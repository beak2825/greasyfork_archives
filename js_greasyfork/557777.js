// ==UserScript==
// @name         千川素材中心视频管理助手（自动勾选 + 批量添加标签 + 自动翻页）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  刷新→切到100条/页→只等分页后的video/list→等1秒→按material_id匹配行，source_type_words为空则勾选→有勾选则批量添加标签→等待下一页video/list→自动翻页并重复本页操作。
// @author       你
// @match        https://business.oceanengine.com/site/asset/material_center/management/video*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557777/%E5%8D%83%E5%B7%9D%E7%B4%A0%E6%9D%90%E4%B8%AD%E5%BF%83%E8%A7%86%E9%A2%91%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B%EF%BC%88%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%20%2B%20%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E6%A0%87%E7%AD%BE%20%2B%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557777/%E5%8D%83%E5%B7%9D%E7%B4%A0%E6%9D%90%E4%B8%AD%E5%BF%83%E8%A7%86%E9%A2%91%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B%EF%BC%88%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%20%2B%20%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E6%A0%87%E7%AD%BE%20%2B%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FLAG_AUTO_TAG = 'qc_auto_tagging';
    const KEY_VIDEO_LIST_JSON = 'qc_video_list_last_json';
    const KEY_VIDEO_LIST_RAW  = 'qc_video_list_last_raw';

    let networkHooked = false;

    // 只关心“某次动作之后”的那一次 video/list（首次 100条/页 + 后续翻页）
    let waitAfterPageChange = false;
    let afterPageChangeJson = null;
    let afterPageChangeResolvers = [];

    // ========== 样式 ==========
    GM_addStyle(`
      #qc-helper-fab {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 999999;
        width: 48px;
        height: 48px;
        border-radius: 24px;
        background: #1677ff;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        user-select: none;
        white-space: pre-line;
        text-align: center;
      }
      #qc-helper-fab:hover {
        opacity: 0.85;
      }
      #qc-helper-panel {
        position: fixed;
        right: 20px;
        bottom: 80px;
        width: 320px;
        max-height: 60vh;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        z-index: 999999;
        display: none;
        font-size: 12px;
      }
      #qc-helper-panel-header {
        padding: 8px 12px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #qc-helper-panel-header-title {
        font-weight: bold;
      }
      #qc-helper-panel-body {
        padding: 8px 12px 12px;
        overflow-y: auto;
        max-height: 50vh;
      }
      #qc-helper-close {
        cursor: pointer;
        font-size: 14px;
      }
      #qc-helper-panel-body pre {
        background:#f7f7f7;
        padding:4px 6px;
        border-radius:4px;
        max-height:120px;
        overflow:auto;
        font-size:11px;
      }
    `);

    // ========== 工具函数 ==========
    function simulateMouseClick(el) {
        if (!el) return;
        try {
            const evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            el.dispatchEvent(evt);
        } catch (e) {
            console.warn('[千川视频助手] MouseEvent click 失败，fallback 到 el.click()', e);
            try {
                el.click();
            } catch (e2) {
                console.warn('[千川视频助手] el.click() 也失败', e2);
            }
        }
    }

    function simulateHover(el) {
        if (!el) return;
        const events = ['pointerenter','mouseenter','mouseover','mousemove'];
        for (const type of events) {
            try {
                el.dispatchEvent(new MouseEvent(type, { bubbles:true, cancelable:true }));
            } catch (e) {
                try {
                    el.dispatchEvent(new PointerEvent(type, { bubbles:true, cancelable:true }));
                } catch {}
            }
        }
        console.log('[千川视频助手] Hover 已发送:', el);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function findBatchButton() {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.innerText.includes('批量操作'));
    }

    // 打开「批量操作」浮层，点击「批量添加标签」
    async function openBatchAddTagMenu() {
        const batchBtn = findBatchButton();
        if (!batchBtn) {
            console.log('[千川视频助手] 未找到“批量操作”按钮，无法打开批量添加标签菜单');
            return false;
        }

        console.log('[千川视频助手] 准备激活批量操作悬浮框:', batchBtn);
        simulateHover(batchBtn);
        await delay(500); // 等悬浮框渲染

        // 找“批量添加标签”这条菜单项的点击目标
        const candidates = Array.from(document.querySelectorAll('div,button,span,a,li'));
        const contentEl = candidates.find(el =>
            el.textContent &&
            el.textContent.trim().includes('批量添加标签') &&
            el.className.includes('dropdown-item__content')
        );
        let clickTarget = null;
        if (contentEl && contentEl.parentElement && contentEl.parentElement.classList.contains('ovui-dropdown-item')) {
            clickTarget = contentEl.parentElement;
        } else {
            clickTarget = contentEl;
        }

        if (!clickTarget) {
            console.log('[千川视频助手] 未找到“批量添加标签”菜单项，可能文案或结构有变');
            return false;
        }

        console.log('[千川视频助手] 点击“批量添加标签”菜单项:', clickTarget);
        simulateMouseClick(clickTarget);
        return true;
    }

    // ========= 初始化入口 =========
    function init() {
        console.log('[千川视频助手] init 触发，当前页面：', location.href);

        if (!location.href.startsWith('https://business.oceanengine.com/site/asset/material_center/management/video')) {
            console.log('[千川视频助手] 当前不在素材中心-视频页面，不执行逻辑');
            return;
        }

        hookNetworkOnce();
        createUI();
        checkAutoTagFlagAndRun();
    }

    // ========= UI =========
    function createUI() {
        if (document.getElementById('qc-helper-fab')) return;

        const fab = document.createElement('div');
        fab.id = 'qc-helper-fab';
        fab.textContent = '视频\n助手';

        const lastJson = GM_getValue(KEY_VIDEO_LIST_JSON, null);
        const lastPreview = lastJson
            ? JSON.stringify(lastJson?.data || lastJson, null, 2).slice(0, 400)
            : '暂无抓包数据，执行一次「开始打标签」会自动抓取。';

        const panel = document.createElement('div');
        panel.id = 'qc-helper-panel';
        panel.innerHTML = `
          <div id="qc-helper-panel-header">
            <span id="qc-helper-panel-header-title">千川视频助手</span>
            <span id="qc-helper-close">✕</span>
          </div>
          <div id="qc-helper-panel-body">
              <button id="qc-start-tag-btn"
                style="
                  width:100%;
                  padding:8px;
                  background:#1677ff;
                  border:none;
                  border-radius:6px;
                  color:white;
                  font-weight:bold;
                  cursor:pointer;
                ">
                开始打标签
              </button>
              <p style="margin-top:10px;">
                流程：1）点击本按钮 ⇒ 2）页面刷新并自动切到「100条/页」 ⇒
                3）只等待“点完100条/页之后”的那次 <code>/nbs/api/bm/video/list</code> ⇒
                4）拿到数据后等待 1 秒，按行里的 ID 与 material_id 对应，<code>source_type_words</code> 为空则勾选该行复选框 ⇒
                5）若有勾选，自动批量添加标签 ⇒
                6）等待下一页 <code>video/list</code> 请求返回，自动翻页并重复。
              </p>
              <p style="margin-top:6px;">最近一次抓到的部分 data 预览：</p>
              <pre id="qc-video-list-preview">${lastPreview}</pre>
          </div>
        `;

        document.body.appendChild(fab);
        document.body.appendChild(panel);

        fab.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' || !panel.style.display ? 'block' : 'none';
        });

        const closeBtn = panel.querySelector('#qc-helper-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.style.display = 'none';
            });
        }

        const startBtn = panel.querySelector('#qc-start-tag-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('[千川视频助手] 开始打标签按钮被点击，设置标记并刷新页面...');
                GM_setValue(KEY_VIDEO_LIST_JSON, null);
                GM_setValue(KEY_VIDEO_LIST_RAW, '');
                GM_setValue(FLAG_AUTO_TAG, true);

                waitAfterPageChange = false;
                afterPageChangeJson = null;

                alert('开始打标签：页面将刷新，自动切到 100条/页，然后只等分页后的那次 video/list，接着等 1 秒再按 material_id 精准勾选，有勾选则自动执行“批量添加标签”，然后翻到下一页继续。');
                location.href = location.href;
            });
        }
    }

    // ========= 流程：分页 + 等待 video/list =========
    function checkAutoTagFlagAndRun() {
        const needAuto = GM_getValue(FLAG_AUTO_TAG, false);
        if (!needAuto) return;

        console.log('[千川视频助手] 检测到需要自动打标签，开始执行自动切换 100条/页');
        GM_setValue(FLAG_AUTO_TAG, false);

        autoSelect100PerPage()
            .then(() => {
                console.log('[千川视频助手] 分页切换逻辑结束，开始等待【点完100条/页之后】的 video/list 响应...');
                return waitForVideoListAfterPageChange(15000);
            })
            .then((data) => {
                console.log('[千川视频助手] ✅ 已拿到“分页后”的 video/list 数据：', data);
                // 第一页处理，从这里起 runAfterVideoList 自己会负责后续翻页
                runAfterVideoList(data);
            })
            .catch((err) => {
                console.error('[千川视频助手] ❌ 自动流程出错或超时：', err);
            });
    }

    function autoSelect100PerPage() {
        return new Promise((resolve, reject) => {
            let tries = 50;
            const interval = setInterval(() => {
                tries--;

                const allSelectWrappers = document.querySelectorAll(
                    'div.ovui-input__wrapper.ovui-input__wrapper--xs.ovui-input__wrapper--fill.ovui-select__input'
                );

                if (allSelectWrappers && allSelectWrappers.length > 0) {
                    const selectWrapper = allSelectWrappers[allSelectWrappers.length - 1];
                    console.log('[千川视频助手] 找到分页下拉框父元素，模拟点击打开...', selectWrapper);
                    simulateMouseClick(selectWrapper);

                    setTimeout(() => {
                        const options = Array.from(document.querySelectorAll('.ovui-option__content'));
                        const target = options.find(el => el.textContent.trim().includes('100条/页'));

                        if (target) {
                            console.log('[千川视频助手] 找到 100条/页 选项，模拟点击切换...', target);

                            // 下一次 video/list 将作为“100条/页后的第一页”
                            waitAfterPageChange = true;
                            afterPageChangeJson = null;

                            simulateMouseClick(target);
                        } else {
                            console.log('[千川视频助手] 未找到 100条/页 选项，请检查文本');
                        }

                        resolve();
                    }, 400);

                    clearInterval(interval);
                    return;
                }

                if (tries <= 0) {
                    clearInterval(interval);
                    console.log('[千川视频助手] 多次尝试仍未找到分页下拉框父元素，放弃自动切换');
                    reject(new Error('未找到分页下拉框'));
                }
            }, 300);
        });
    }

    function waitForVideoListAfterPageChange(timeoutMs = 10000) {
        return new Promise((resolve, reject) => {
            if (afterPageChangeJson) {
                const data = afterPageChangeJson;
                afterPageChangeJson = null;
                resolve(data);
                return;
            }

            const resolver = (data) => {
                resolve(data);
            };
            afterPageChangeResolvers.push(resolver);

            setTimeout(() => {
                if (!afterPageChangeJson) {
                    afterPageChangeResolvers = afterPageChangeResolvers.filter(fn => fn !== resolver);
                    reject(new Error('等待分页/刷新后的 video/list 响应超时'));
                }
            }, timeoutMs);
        });
    }

    // ========= 拦截 /nbs/api/bm/video/list =========
    function hookNetworkOnce() {
        if (networkHooked) return;
        networkHooked = true;

        console.log('[千川视频助手] 开始挂载网络拦截（fetch & XHR）');

        function handleVideoListJson(json, where) {
            GM_setValue(KEY_VIDEO_LIST_JSON, json);
            console.log(`[千川视频助手][${where}] video/list JSON:`, json);

            // 如果当前在等待某次“页面变化后”的 video/list，就唤醒
            if (waitAfterPageChange) {
                afterPageChangeJson = json;
                console.log('[千川视频助手] ✅ 捕获到本次页面变化后的 video/list，唤醒所有等待者');

                waitAfterPageChange = false;
                const resolvers = afterPageChangeResolvers.slice();
                afterPageChangeResolvers = [];
                resolvers.forEach(fn => {
                    try { fn(json); } catch (e) { console.error(e); }
                });
            }
        }

        // fetch
        if (window.fetch) {
            const origFetch = window.fetch;
            window.fetch = function (...args) {
                let url = '';
                try {
                    if (typeof args[0] === 'string') url = args[0];
                    else if (args[0] && typeof args[0].url === 'string') url = args[0].url;
                } catch (e) {}

                const isVideoList = url && url.includes('/nbs/api/bm/video/list');
                if (isVideoList) {
                    console.log('[千川视频助手][fetch] 监控到 video/list 请求：', url);
                }

                return origFetch.apply(this, args).then(res => {
                    if (isVideoList) {
                        try {
                            const clone = res.clone();
                            clone.text().then(text => {
                                GM_setValue(KEY_VIDEO_LIST_RAW, text);
                                try {
                                    const json = JSON.parse(text);
                                    handleVideoListJson(json, 'fetch');
                                } catch (e) {
                                    console.warn('[千川视频助手][fetch] 解析 JSON 失败：', e);
                                }
                            });
                        } catch (e) {
                            console.warn('[千川视频助手][fetch] clone/处理响应失败：', e);
                        }
                    }
                    return res;
                });
            };
        }

        // XHR
        if (window.XMLHttpRequest) {
            const origOpen = XMLHttpRequest.prototype.open;
            const origSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                this._qc_isVideoList = typeof url === 'string' && url.includes('/nbs/api/bm/video/list');
                return origOpen.call(this, method, url, async, user, password);
            };

            XMLHttpRequest.prototype.send = function (...args) {
                if (this._qc_isVideoList) {
                    console.log('[千川视频助手][XHR] 监控到 video/list 请求');
                    this.addEventListener('load', function () {
                        try {
                            const text = this.responseText;
                            GM_setValue(KEY_VIDEO_LIST_RAW, text);
                            try {
                                const json = JSON.parse(text);
                                handleVideoListJson(json, 'XHR');
                            } catch (e) {
                                console.warn('[千川视频助手][XHR] 解析 JSON 失败：', e);
                            }
                        } catch (e) {
                            console.warn('[千川视频助手][XHR] 读取响应失败：', e);
                        }
                    });
                }
                return origSend.apply(this, args);
            };
        }
    }

    // ========= 拿到 video/list 后：等 1 秒 + 按 material_id 勾选 + 批量添加标签 + 自动翻页 =========
    async function runAfterVideoList(videoListJson) {
        console.log('[千川视频助手] >>> 进入 runAfterVideoList，先等 1 秒再按 material_id 匹配行并勾选…');
        await delay(1000);

        const videos = videoListJson?.data?.videos || [];
        console.log('[千川视频助手] 本页 videos 数量：', videos.length);

        const videoMap = new Map();
        videos.forEach(v => {
            if (v && v.material_id != null) {
                videoMap.set(String(v.material_id), v);
            }
        });

        const checkboxes = Array.from(document.querySelectorAll('input.ovui-checkbox__input[type="checkbox"]'));
        console.log('[千川视频助手] 当前页面 checkbox 总数：', checkboxes.length);

        let checkedCount = 0;

        for (let idx = 0; idx < checkboxes.length; idx++) {
            const cb = checkboxes[idx];

            const row = cb.closest('tr')
                     || cb.closest('[class*="row"]')
                     || cb.closest('[class*="item"]')
                     || cb.parentElement?.parentElement;

            if (!row) continue;

            const text = row.innerText || '';
            const m = text.match(/ID[:：]\s*(\d{5,})/);
            if (!m) continue;

            const materialId = m[1];
            const video = videoMap.get(materialId);
            if (!video) continue;

            const tags = video.source_type_words || [];
            const needCheck = !tags || tags.length === 0;

            if (needCheck) {
                const wrapper = cb.closest('label.ovui-checkbox') || cb.closest('.ovui-checkbox');
                console.log(
                  `[千川视频助手] 勾选行: material_id=${materialId}, video_id=${video.video_id}, video_name=${video.video_name}, checkboxIndex=${idx}`
                );

                if (wrapper) {
                    simulateMouseClick(wrapper);
                } else {
                    simulateMouseClick(cb);
                }

                checkedCount++;
                await delay(50);
            }
        }

        console.log(`[千川视频助手] 本次共自动勾选 ${checkedCount} 行（source_type_words 为空或长度为 0）。`);

        if (checkedCount > 0) {
            console.log('[千川视频助手] 检测到有勾选的行，开始执行“批量添加标签”流程…');

            // 1）打开 批量添加标签 菜单
            const okMenu = await openBatchAddTagMenu();
            if (!okMenu) {
                console.log('[千川视频助手] 批量添加标签菜单打开失败，直接尝试翻页。');
            } else {
                // 2）点击标签输入框
                const tagInput = document.querySelector('input.ovui-input[placeholder="请选择标签,最多支持50个"]');
                if (tagInput) {
                    simulateHover(tagInput);
                    simulateMouseClick(tagInput);
                    console.log('🏷 已点击标签输入框');
                    await delay(400);
                } else {
                    console.log('⚠ 未找到标签输入框，跳过打标签步骤。');
                }

                // 3）选中第一个标签复选框
                const firstLi = document.querySelector('.ovui-cascader-panel__selection-list .ovui-cascader-panel__selection-item');
                if (firstLi) {
                    const labelBox = firstLi.querySelector('label.ovui-checkbox') || firstLi.querySelector('.ovui-checkbox__inner');
                    if (labelBox) {
                        simulateHover(labelBox);
                        simulateMouseClick(labelBox);
                        console.log('✅ 已模拟点击第一个标签复选框');
                        await delay(200);
                    }
                } else {
                    console.log('⚠ 未找到标签列表 li，可能标签数据为空或结构变更。');
                }

                // 4）点击「确定」按钮
                const okBtn = Array.from(document.querySelectorAll('button'))
                    .find(b => b.innerText.trim() === '确定');
                if (okBtn) {
                    simulateHover(okBtn);
                    simulateMouseClick(okBtn);
                    console.log('✅ 已点击确定按钮');
                    // 这里不再重复 hook XHR，而是直接进入翻页逻辑，翻页时会等待 video/list 完成
                } else {
                    console.log('⚠ 未找到“确定”按钮，可能弹窗结构有变。');
                }
            }
        } else {
            console.log('[千川视频助手] 没有任何行被勾选，不执行批量添加标签。');
        }

        // ====== 无论有没有勾选，都要尝试翻页，且翻页前设置等待下一次 video/list ======
        const pagerUL = document.querySelector('.ovui-page-turner');
        if (!pagerUL) {
            console.log('[千川视频助手] 未找到分页组件，自动流程结束。');
            return;
        }

        const allPageItems = Array.from(pagerUL.querySelectorAll('li.ovui-page-turner__item') || []);
        if (!allPageItems.length) {
            console.log('[千川视频助手] 分页 li 为空，自动流程结束。');
            return;
        }

        const lastItem = allPageItems[allPageItems.length - 1];

        // 如果最后一个 li 是禁用状态，说明已经无法继续翻页了
        if (lastItem.classList.contains('ovui-page-turner__item--disabled')) {
            console.log('[千川视频助手] 分页最后一个 li 已禁用，认为是最后一页，自动流程结束。');
            return;
        }

        // 设置等待下一次 video/list（翻页的请求）
        waitAfterPageChange = true;
        afterPageChangeJson = null;

        simulateHover(lastItem);
        simulateMouseClick(lastItem);
        console.log('✅ 分页最后一个 <li> 已模拟点击（无视勾选状态），等待下一页 video/list...');

        try {
            const nextPageJson = await waitForVideoListAfterPageChange(15000);
            console.log('[千川视频助手] 📦 下一页 video/list 请求已返回，开始新一轮 runAfterVideoList...');
            await runAfterVideoList(nextPageJson);
        } catch (e) {
            console.error('[千川视频助手] 等待翻页后的 video/list 超时或失败，自动流程停止。', e);
        }
    }

    // ========= 处理 SPA 路由 =========
    function hookHistory() {
        const _pushState = history.pushState;
        history.pushState = function () {
            const ret = _pushState.apply(this, arguments);
            setTimeout(init, 500);
            return ret;
        };

        const _replaceState = history.replaceState;
        history.replaceState = function () {
            const ret = _replaceState.apply(this, arguments);
            setTimeout(init, 500);
            return ret;
        };

        window.addEventListener('popstate', () => {
            setTimeout(init, 500);
        });
    }

    hookHistory();
    window.addEventListener('load', () => {
        setTimeout(init, 800);
    });
})();
