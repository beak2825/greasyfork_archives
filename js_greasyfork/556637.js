// ==UserScript==
// @name         dlsite购物车增强
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  为 DLsite 购物车添加评分、销量、发售日、标签等信息
// @author       0moi
// @match        https://www.dlsite.com/maniax/cart
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/556637/dlsite%E8%B4%AD%E7%89%A9%E8%BD%A6%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/556637/dlsite%E8%B4%AD%E7%89%A9%E8%BD%A6%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


(function () {
    'use strict';

    /* ----------------------
       配置 & 全局变量
       ---------------------- */

    const AJAX_API = 'https://www.dlsite.com/maniax/product/info/ajax?cdn_cache_min=1&product_id=';
    const JSON_API = 'https://www.dlsite.com/maniax/api/=/product.json?workno=';
    const DELETE_API = 'https://www.dlsite.com/maniax/cart/ajax/=/mode/cart_remove/product_id';
    const MOVE_API = 'https://www.dlsite.com/maniax/cart/ajax/=/mode/move_to_buylater/product_id';

    // 存储映射：id -> DOM element
    const workMap = new Map();
    // 存储标签替换数据：id -> [{old, new}]
    const tagMap = new Map();
    // 存储发售天数映射：days -> [id, id, ...]
    const daysMap = new Map();
    // 购物车 id 列表（顺序）
    const shoppingCart = [];
    // 作品评分映射：id -> rate (float)
    const workRateMap = new Map();

    // button
    const delBtn = createEl('sl-button', { size: 'small', variant: 'danger', pill: true }, ['删除']);
    const moveBtn = createEl('sl-button', { size: 'small', variant: 'warning', pill: true }, ['移入稍后购买']);
    const btn = createEl('sl-button', { size: 'small', variant: 'success', pill: true }, ['移入稍后购买']);
    const btnList = [delBtn, moveBtn, btn];

    // 发售日格式化器
    const formatter = new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        hour12: false
    });

    /* ======================
       Helper: DOM 创建与常用操作
       ====================== */

    /**
     * 创建元素并可一次性设置属性与子节点（简化 DOM 创建）
     * @param {string} tag 标签名
     * @param {Object<string,string|boolean>} [attrs] 属性集合（布尔属性可传 true）
     * @param {Array<Node|string>} [children] 子节点或文本数组
     * @returns {HTMLElement}
     */
    function createEl(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs)) {
            if (v === true) {
                el.setAttribute(k, '');
            } else if (v === false || v == null) {
                // skip
            } else {
                el.setAttribute(k, String(v));
            }
        }
        children.forEach(child => {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                el.appendChild(child);
            }
        });
        return el;
    }

    /**
     * 创建一个 flex 行容器并快速追加 children
     * @param {Array<Node>} children
     * @param {Object} styleExtras 可选额外样式
     * @returns {HTMLDivElement}
     */
    function createFlexRow(children = [], styleExtras = {}) {
        const row = createEl('div');
        Object.assign(row.style, {
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            ...styleExtras
        });
        children.forEach(c => row.appendChild(c));
        return row;
    }

    /* ======================
       Helper: 网络请求封装 (GM_xmlhttpRequest -> Promise)
       注：使用 GM_xmlhttpRequest 是因为脚本声明了 grant
       ====================== */

    /**
     * 使用 GM_xmlhttpRequest 发起 GET 请求并返回 Promise
     * @param {string} url
     * @param {"json"|"text"} [responseType]
     * @returns {Promise<any>}
     */
    function gmGet(url, responseType = 'json') {
        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    responseType,
                    onload: (res) => {
                        // 对 responseType 为 'json' 的情况，res.response 可能为 null（解析失败），把它当作失败处理
                        if (responseType === 'json') {
                            resolve(res.response || {});
                        } else {
                            resolve(res.responseText ?? res.response);
                        }
                    },
                    onerror: (err) => reject(err),
                    ontimeout: (err) => reject(err)
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /* ======================
       主流程：入口函数
       ====================== */

    /**
     * main：程序入口
     *  - 注入 Shoelace
     *  - 收集购物车条目
     *  - 并行加载 JSON 标签与 AJAX 评分数据
     *  - 注入 UI 与功能按钮
     */
    async function main() {
        try {
            importShoelace();
            collectCartWorks();

            // 并行加载两个来源的数据（标签 JSON + AJAX 信息）
            await loadJsonTagData(); // 先把 tagMap 填好（不依赖 ajax）
            const ajaxJson = await loadAjaxData(); // 得到评分/销量等
            injectInfo(ajaxJson);

            // 在页面头部注入操作按钮
            const header = document.querySelector('#confirm_inner > div.confirm_title.type_login_info');
            if (header) {
                addDeleteElements(header);
                addMoveWorkToLaterElements(header);
            }
        } catch (err) {
            console.error('dlsite购物车增强 异常：', err);
        }
    }

    /* ======================
       第 1 步：收集购物车作品 DOM（只做一次遍历）
       ====================== */

    /**
     * collectCartWorks：扫描购物车 DOM，填充 workMap 与 shoppingCart
     * - 使用 data-workno 属性作为作品 id
     * - 忽略 display: none 的项
     */
    function collectCartWorks() {
        const works = document.querySelectorAll('#cart_wrapper > ul > li');

        works.forEach(work => {
            const id = work.getAttribute('data-workno');
            if (!id) return;
            workMap.set(id, work);
            // 只把可见作品压入购物车数组
            if (getComputedStyle(work).display !== 'none') {
                shoppingCart.push(id);
            }
        });
    }

    /* ======================
       第 2 步：加载 JSON 标签数据（并行）
       ====================== */

    /**
     * loadJsonTagData：对 workMap 中的每个 id 发起 JSON 请求并填充 tagMap
     * 使用并行请求（Promise.all）来加速
     */
    async function loadJsonTagData() {
        const ids = [...workMap.keys()];
        if (!ids.length) return;
        const tasks = ids.map(id => fetchJsonData(id).catch(err => {
            console.warn(`fetchJsonData ${id} 失败`, err);
            return null;
        }));
        await Promise.all(tasks);
    }

    /**
     * fetchJsonData：获取单个作品的 JSON（包含 genres/genres_replaced），并写入 tagMap
     * @param {string} id
     * @returns {Promise<void>}
     */
    async function fetchJsonData(id) {
        const url = JSON_API + id;
        const res = await gmGet(url, 'json');
        const data = Array.isArray(res) ? res[0] : (res || {});
        if (!data) return;

        const original = data.genres || [];
        const replaced = data.genres_replaced || [];

        // 通过 genre id 找到替换，避免顺序差异
        const tags = original.map(orig => {
            const rep = replaced.find(x => x.id === orig.id);
            return { old: orig.name, new: rep?.name ?? orig.name };
        });

        if (tags.length) tagMap.set(id, tags);
    }

    /* ======================
       第 3 步：加载 AJAX 评分 + 销量 数据
       ====================== */

    /**
     * loadAjaxData：一次性请求所有作品的 AJAX 信息（按 API 支持）
     * 返回解析后的 JSON 对象（键为 id）
     * @returns {Promise<Object>}
     */
    async function loadAjaxData() {
        const ids = [...workMap.keys()];
        if (!ids.length) return {};
        const idStr = ids.join(',');
        const url = AJAX_API + idStr;
        try {
            const res = await gmGet(url, 'json');
            // gmGet 对 json 返回 {} 而非 null
            return res || {};
        } catch (err) {
            console.warn('loadAjaxData 请求失败', err);
            return {};
        }
    }

    /* ======================
       第 4 步：注入信息到 DOM（评分/销量/发售日/标签）
       ====================== */

    /**
     * injectInfo：将 AJAX 返回的信息注入到对应的 DOM（从 workMap 读 DOM）
     * 并更新 workRateMap 与 daysMap 供后续批量操作使用
     * @param {Object} json - AJAX 返回的对象
     */
    function injectInfo(json) {
        workMap.forEach((dom, id) => {
            const info = json[id];
            if (!info) return;

            const avg = info.rate_average_2dp;

            // 存评分（可能 undefined）
            workRateMap.set(id, typeof avg === 'number' ? avg : null);

            const content = dom.querySelector('.work_content');
            if (!content) return;

            // 构建并插入信息块
            const block = createInfoBlock(info, id);
            content.appendChild(block);

            // 标签部分（如果有）
            const tags = tagMap.get(id);
            if (tags && tags.length) {
                const dd = createEl('dd');
                tags.forEach(t => dd.appendChild(buildTag(t.old, t.new)));
                content.appendChild(dd);
            }
        });
    }

    /**
     * createInfoBlock：根据 AJAX info 创建 dd 元素，包含发售日/销量/评分等
     * 并将 id 推入 daysMap 中用于基于发售天数的批量操作
     * @param {Object} info
     * @param {string} id
     * @returns {HTMLElement} dd element
     */
    function createInfoBlock(info, id) {
        const dl_count = info.dl_count ?? 0;
        const avg = info.rate_average_2dp;
        const rate_count = info.rate_count;

        const date = new Date(info.regist_date);
        const dateStr = formatter.format(date).replace(":", " 时");
        const days = Math.floor((Date.now() - date.getTime()) / 86400000);

        // 使用安全读取：如果不存在则返回空数组（但不覆盖已有数组）
        const idList = daysMap.get(days) ?? [];
        idList.push(id);
        daysMap.set(days, idList);

        const dd = createEl('dd');
        // 尽量少用 innerHTML，采用创建节点的方式更可靠，但出于简洁仍保留少量 HTML
        dd.innerHTML = `
            <div class="registDate">
                <span>发售日：</span><span>${escapeHtml(dateStr)}</span><span>&nbsp;&nbsp;发售于 ${days} 天前</span>
            </div>
            <div class="countData" style="display:flex;align-items:center;">
                <span>销量：</span><span>${escapeHtml(String(dl_count))}</span>
            </div>
        `;

        if (rate_count) {
            const rateWrapper = createFlexRow([], { gap: '6px', marginLeft: '8px' });
            rateWrapper.appendChild(createEl('span', {}, [`评分：`]));
            rateWrapper.appendChild(createEl('span', { class: 'rate' }, [String(avg)]));
            rateWrapper.appendChild(createEl('span', {}, [`(${rate_count})`]));

            // 动态构造 <sl-rating readonly value="..."></sl-rating>
            const rating = createEl('sl-rating', { readonly: true, value: String(avg) });
            rateWrapper.appendChild(rating);

            dd.querySelector('.countData').appendChild(rateWrapper);
        }

        return dd;
    }

    /**
     * 简单的文本转义（避免插入不受信任的字符串进 innerHTML）
     * @param {string} str
     */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /* ======================
       Tag 构建（Shoelace tag + tooltip）
       ====================== */

    /**
     * buildTag：使用 shoelace 的 sl-tooltip + sl-tag 显示标签（newName 可带 tooltip）
     * @param {string} oldName
     * @param {string} newName
     * @returns {HTMLElement}
     */
    function buildTag(oldName, newName) {
        const tooltip = createEl('sl-tooltip', { content: oldName });
        const tag = createEl('sl-tag', { size: 'small', pill: true });
        tag.textContent = newName;
        // 若没有替换则使用 primary，替换过使用 warning
        tag.setAttribute('variant', oldName === newName ? 'primary' : 'warning');
        tooltip.appendChild(tag);
        return tooltip;
    }

    /* ======================
       Shoelace 注入（仅注入一次）
       ====================== */

    /**
     * importShoelace：向页面注入 Shoelace CSS 与自动加载脚本（带重复注入保护）
     */
    function importShoelace() {
        if (document.querySelector('link[href*="shoelace"]')) return;

        const head = document.head || document.getElementsByTagName('head')[0];

        const css = createEl('link', {
            rel: 'stylesheet',
            href: 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/light.css'
        });
        const script = createEl('script', {
            type: 'module',
            src: 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/shoelace-autoloader.js'
        });

        head.appendChild(css);
        head.appendChild(script);
    }

    /* ======================
       UI：在 header 插入 删除 / 移入稍后购买 行为（按评分/发售日）
       ====================== */

    /**
     * addDeleteElements：在 header 中添加通过“评分阈值”删除的 UI 控件
     * @param {HTMLElement} header
     */
    function addDeleteElements(header) {
        // 容器（竖向）
        const box = createEl('div');
        Object.assign(box.style, { display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' });

        // 第一行：文本 + range
        const label = createEl('span', {}, ['将低于']);
        const range = createEl('input', { id: 'dl_range', type: 'range', min: '3', max: '5', step: '0.01', value: '4' });
        const output = createEl('output', { name: 'score', for: 'dl_range' }, ['4']);
        // 当 range 变化时更新 output 显示
        range.addEventListener('input', () => output.textContent = range.value);

        const prefix = createFlexRow([label, range, output], { gap: '6px' });
        const suffix = createEl('span', {}, ['分的作品']);
        const line1 = createFlexRow([prefix, suffix], { justifyContent: 'flex-start' });

        // 第二行：按钮（删除 / 移入稍后）
        const line2 = createFlexRow([delBtn, moveBtn], { justifyContent: 'flex-end' });

        box.appendChild(line1);
        box.appendChild(line2);

        // 插入到 header 第二个子节点位置
        try {
            header.insertBefore(box, header.children[1] ?? null);
        } catch (e) {
            header.appendChild(box);
        }

        // 事件绑定：删除
        delBtn.addEventListener('click', async () => {
            onClickBtn(delBtn)
            const ids = selectWorksByScore(parseFloat(range.value));
            if (!ids.length) return alert('未找到低于该评分的作品');
            await deleteWorks(ids);
        });

        // 事件绑定：移入稍后购买（按评分）
        moveBtn.addEventListener('click', async () => {
            onClickBtn(moveBtn)
            const ids = selectWorksByScore(parseFloat(range.value));
            if (!ids.length) return alert('未找到低于该评分的作品');
            await moveWorks(ids);
        });
    }

    /**
     * selectWorksByScore：根据评分阈值筛选购物车作品 id 列表
     * @param {number} score
     * @returns {string[]}
     */
    function selectWorksByScore(score) {
        const workIds = [];
        shoppingCart.forEach(workId => {
            const rate = workRateMap.get(workId);
            // 忽略 null/undefined 的评分
            if (rate != null && Number(rate) < Number(score)) workIds.push(workId);
        });
        return workIds;
    }

    /**
     * deleteWorks：对给定 id 列表发起删除请求并刷新页面
     * @param {string[]} workIds
     */
    async function deleteWorks(workIds) {
        if (!Array.isArray(workIds) || !workIds.length) return;
        try {
            const tasks = workIds.map(id => gmGet(`${DELETE_API}/${id}.html`, 'text').catch(err => ({ err, id })));
            await Promise.all(tasks);
        } catch (err) {
            console.warn('deleteWorks 部分失败', err);
        } finally {
            // 同步刷新页面
            location.reload();
        }
    }

    /**
     * moveWorks：对给定 id 列表发起“移入稍后购买”请求并刷新页面
     * @param {string[]} workIds
     */
    async function moveWorks(workIds) {
        if (!Array.isArray(workIds) || !workIds.length) return;
        try {
            const tasks = workIds.map(id => gmGet(`${MOVE_API}/${id}.html`, 'text').catch(err => ({ err, id })));
            await Promise.all(tasks);
        } catch (err) {
            console.warn('moveWorks 部分失败', err);
        } finally {
            location.reload();
        }
    }

    /**
     * addMoveWorkToLaterElements：在 header 中添加按“发售天数”移入稍后购买的 UI
     * @param {HTMLElement} header
     */
    function addMoveWorkToLaterElements(header) {
        const box = createEl('div');
        Object.assign(box.style, { display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' });

        const label = createEl('span', {}, ['将发售']);
        const input = createEl('input', { type: 'number', value: '7', min: '0', style: 'width:50px;height:20px;min-height:20px;!important' });
        const suffix = createEl('span', {}, ['天内的作品']);

        const line1 = createFlexRow([label, input, suffix], { gap: '6px' });

        const line2 = createFlexRow([btn], { justifyContent: 'flex-end' });

        box.appendChild(line1);
        box.appendChild(line2);

        try {
            header.insertBefore(box, header.children[2] ?? null);
        } catch (e) {
            header.appendChild(box);
        }

        btn.addEventListener('click', async () => {
            onClickBtn(btn)
            const maxDay = parseInt(input.value ?? '0', 10);
            if (Number.isNaN(maxDay)) return alert('请输入有效的天数');
            const ids = selectWorksByDays(maxDay);
            if (!ids.length) return alert('未找到符合条件的作品');
            await moveWorks(ids);
        });
    }

    function onClickBtn(btn) {
        btn.innerHTML = btn.innerText + '<sl-spinner/>'
        btnList.forEach(btn => {
            btn.disabled = true;
        })
    }

    /**
     * selectWorksByDays：根据发售天数筛选作品（daysMap 中 key 为天数）
     * @param {number} maxDay
     * @returns {string[]}
     */
    function selectWorksByDays(maxDay) {
        const workIds = [];
        daysMap.forEach((ids, days) => {
            if (days <= maxDay) {
                ids.forEach(id => workIds.push(id));
            }
        });
        return workIds;
    }

    /* ======================
       启动脚本
       ====================== */

    main().catch(console.error);

})();
