// ==UserScript==
// @name          FF14物价查询补充-Universalis+Wiki
// @namespace     FF14-Universalis-CN-L10n
// @version       1.3.0
// @description   Universalis 新版本物品搜索补全；FF14 灰机Wiki 物品页增加物价链接。
// @author        桀桀大王@红茶川
// @match         https://ff14.huijiwiki.com/wiki/*
// @match         https://universalis.app/*
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_listValues
// @grant         GM_registerMenuCommand
// @connect       www.garlandtools.cn
// @connect       universalis.app
// @run-at        document-start
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/560615/FF14%E7%89%A9%E4%BB%B7%E6%9F%A5%E8%AF%A2%E8%A1%A5%E5%85%85-Universalis%2BWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/560615/FF14%E7%89%A9%E4%BB%B7%E6%9F%A5%E8%AF%A2%E8%A1%A5%E5%85%85-Universalis%2BWiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * =====================================================================================
     * SECTION 1: CONFIGURATION & CONSTANTS
     * 全局配置常量定义
     * =====================================================================================
     */
    const CONFIG = Object.freeze({
        // 本地存储键名 (Storage Keys)
        KEYS: {
            WIKI: 'CFG_WIKI_ENABLED',       // 开关：Wiki 模块
            UNI:  'CFG_UNI_ENABLED',        // 开关：Universalis 模块
            DATA: 'DATA_BITSET',            // 缓存：物品ID位图数据
            TIME: 'DATA_TIMESTAMP'          // 缓存：上次更新时间
        },
        // 远程接口地址 (API Endpoints)
        API: {
            UNI_MARKET: 'https://universalis.app/api/marketable',
            GT_SEARCH:  'https://www.garlandtools.cn/api/search.php',
            GT_ICON:    'https://www.garlandtools.cn/files/icons/item/',
            GT_DOC:     'https://www.garlandtools.cn/db/doc/item/chs/3/'
        },
        // 资源文件 (Assets)
        ASSETS: {
            // Universalis Logo (Base64 encoded WebP)
            LOGO: 'data:image/webp;base64,UklGRvIBAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSLMAAAABgFvbtqltfw6t1MZfh+2/AKe2OjAKsR3atqM/f773lBAREwDVQFXPSFu+D7zBsSdBed5lY8t7ELQ3siy5PwLrcVQr+Cqwr1g0pgTeVjX/B9dfk0lRLRDOBwH0UAgnOcAwiXBgQxuN0Id8oluP54pGKEAnUQesOzQjQOqYpA9AcJGiDgBMTb9cPyEF0MA1B3XzAsd7WAPBQ6b/SjBmNxleS8Hs6DpXeZ2OgddX2DHaXx+GKgBWUDggGAEAADAGAJ0BKhgAGAA+kUKbSiWjoiGoCACwEglsAJ0zkzwKg7y3Qrkv/5k06q4SygYmUDTzkrTu7gBQgwAA/kR2IPzlGkHyO9/yYVHFBJlggdMt0ymazv3QWRFA7Fmk9rlsNX4g9q3rJK55Fykqc5VycWXdPM1RNG+4YrizU2ZKmGJChyYWidUZvOC0rT+3b0G3XnZlb7FZ7Uew6jEPA8qp88h9cOMq41aHeM4JjjOhGGv1v8JxdVefvvkWlEsxOkiRkqtKcw0msu8ELYGcWvx7EvAHX4FHxctAGmqV6EXDsvR1pO1nozqRu6zQ2bak21hKa2F33FA5l+3kvzLvMyk1MTP+y4FJdTqsHDWEO4b/OcBiGwSju1oAAAA='
        },
        // 系统参数 (System Parameters)
        TIMEOUT: 1200,          // 搜索请求最大等待时间 (ms)
        CACHE_TTL: 604800000    // 数据缓存有效期: 7 天 (7 * 24 * 60 * 60 * 1000)
    });

    /**
     * =====================================================================================
     * SECTION 2: UTILITIES
     * 基础工具库：封装底层操作
     * =====================================================================================
     */
    const Utils = {
        /**
         * 将 GM_xmlhttpRequest 封装为 Promise 异步对象
         * @param {object} opt - 请求配置对象 (参考 Tampermonkey 文档)
         * @returns {Promise<string>} 请求成功返回 responseText，失败返回完整 response 对象
         */
        request: (opt) => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...opt,
                onload: r => (r.status >= 200 && r.status < 300) ? resolve(r.responseText) : reject(r),
                onerror: reject
            });
        }),

        /**
         * 动态向页面头部注入 CSS 样式
         * @param {string} css - CSS 样式字符串
         */
        addStyle: (css) => {
            const el = document.createElement('style');
            el.textContent = css;
            (document.head || document.documentElement).appendChild(el);
        }
    };

    /**
     * =====================================================================================
     * SECTION 3: BITSET INDEX
     * 位图索引类：用于高效存储和查询可交易物品 ID
     * 原理：使用 1 个 bit 表示 1 个物品是否存在，极大压缩内存占用。
     * =====================================================================================
     */
    class Bitset {
        /**
         * 将 ID 数组编码为 Base64 字符串
         * @param {number[]} ids - 物品 ID 数组
         * @returns {string} Base64 编码的位图
         */
        static encode(ids) {
            // FF14 物品 ID 目前约 40000+，65536 (8KB) 足够覆盖
            const b = new Uint8Array(8192);
            for (let i = 0, len = ids.length; i < len; i++) {
                const id = ids[i];
                if (id >= 0 && id < 65536) {
                    // id >>> 3 等同于 floor(id / 8)，确定字节位置
                    // id & 7   等同于 id % 8，确定 bit 位置
                    b[id >>> 3] |= (1 << (id & 7));
                }
            }
            // 使用 String.fromCharCode 处理大数组以避免调用栈溢出
            return btoa(String.fromCharCode(...b));
        }

        /**
         * 将 Base64 字符串解码为 Uint8Array
         * @param {string} str - Base64 编码的位图
         * @returns {Uint8Array|null} 解码后的二进制数组
         */
        static decode(str) {
            if (!str) return null;
            try {
                const bin = atob(str);
                const b = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
                return b;
            } catch (e) { return null; }
        }

        /**
         * 检查 ID 是否存在于位图中
         * @param {Uint8Array} b - 位图数据
         * @param {number} id - 待查询 ID
         * @returns {boolean}
         */
        static has(b, id) {
            return b && id >= 0 && id < 65536 && (b[id >>> 3] & (1 << (id & 7)));
        }
    }

    /**
     * =====================================================================================
     * SECTION 4: DATA CONTROLLER
     * 数据控制中心：管理缓存策略与数据更新
     * =====================================================================================
     */
    class DataController {
        constructor() {
            this.wikiEnabled = GM_getValue(CONFIG.KEYS.WIKI, true);
            this.uniEnabled = GM_getValue(CONFIG.KEYS.UNI, true);
            this.bitset = null;
        }

        /**
         * 初始化数据控制器
         * 执行垃圾回收，检查缓存有效性，必要时更新数据
         */
        async init() {
            // 1. 垃圾回收 (Garbage Collection)
            this._gc();

            // 2. 加载本地缓存
            this.bitset = Bitset.decode(GM_getValue(CONFIG.KEYS.DATA));
            const now = Date.now();
            const last = GM_getValue(CONFIG.KEYS.TIME, 0);

            // 3. 缓存失效检查 (Cache Miss or Expired)
            if (!this.bitset || (now - last > CONFIG.CACHE_TTL)) {
                await this.update();
            }
        }

        /**
         * 从 Universalis API 获取最新可交易列表并更新本地缓存
         */
        async update() {
            try {
                // console.info('[Universalis+] Updating marketable item cache...');
                const json = await Utils.request({ method: 'GET', url: CONFIG.API.UNI_MARKET });
                const ids = JSON.parse(json);
                const encoded = Bitset.encode(ids);
                
                GM_setValue(CONFIG.KEYS.DATA, encoded);
                GM_setValue(CONFIG.KEYS.TIME, Date.now());
                this.bitset = Bitset.decode(encoded);
                // console.info('[Universalis+] Cache updated successfully.');
            } catch (e) { 
                console.error('[Universalis+] Cache update failed:', e); 
            }
        }

        /**
         * 内部方法：清除未在配置白名单中的旧数据
         * @private
         */
        _gc() {
            const keep = new Set(Object.values(CONFIG.KEYS));
            GM_listValues().forEach(k => {
                if (!keep.has(k)) GM_deleteValue(k);
            });
        }
    }

    /**
     * =====================================================================================
     * SECTION 5: UNIVERSALIS MODULE
     * Universalis 增强模块：搜索补全 + SPA 路由修复 + 图标修复
     * =====================================================================================
     */
    class UniModule {
        /**
         * @param {DataController} ctx - 数据控制器实例
         */
        constructor(ctx) { 
            this.ctx = ctx;
            this.iconRegistry = new Map(); // 图标 URL 缓存，减少重复请求
            this.pendingRequests = new Set();
            this.currentPath = location.pathname;
        }

        /**
         * 模块入口
         */
        run() {
            this.injectStyles();
            this.injectInterceptor(); // 注入 Fetch 拦截器
            this.bindBridge();        // 绑定跨域通信桥
            this.observeDOM();        // 监听 DOM 变化
            
            // 路由监听：处理 SPA (Single Page Application) 的页面跳转
            window.addEventListener('popstate', () => this.handleNavigation());
            
            // 劫持 pushState 以捕获前端路由跳转
            const pushState = history.pushState;
            history.pushState = (...args) => {
                pushState.apply(history, args);
                this.handleNavigation();
            };
        }

        /**
         * 处理页面导航事件
         */
        handleNavigation() {
            if (location.pathname === this.currentPath) return;
            this.currentPath = location.pathname;
            this.scanAndFix(); // 路由变化时重新扫描页面
        }

        /**
         * 扫描页面并修复损坏的图标 (error.png)
         */
        scanAndFix() {
            // 从 URL 提取物品 ID (e.g., /market/12345)
            const mIdStr = location.pathname.match(/\/market\/(\d+)/)?.[1];
            if (!mIdStr) return;
            const id = parseInt(mIdStr);

            // 查找所有加载错误的图标
            const imgs = document.querySelectorAll('img.item-icon[src*="error.png"]');
            if (imgs.length === 0) return;

            // 策略 A: 命中内存缓存
            if (this.iconRegistry.has(id)) {
                const cachedSrc = this.iconRegistry.get(id);
                imgs.forEach(img => {
                    if (img.dataset.realSrc !== cachedSrc) {
                        img.src = cachedSrc;
                        img.dataset.realSrc = cachedSrc;
                        img.classList.add('gt-fixed');
                    }
                });
                return;
            }

            // 策略 B: 发起远程请求 (如果尚未请求)
            if (!this.pendingRequests.has(id)) {
                this.pendingRequests.add(id);
                this.fetchIconFromGT(id).then(iconUrl => {
                    if (iconUrl) {
                        this.iconRegistry.set(id, iconUrl);
                        this.scanAndFix(); // 获取成功后重新应用
                    }
                    this.pendingRequests.delete(id);
                });
            }
        }

        /**
         * 从 GarlandTools 获取正确的图标 URL
         * @param {number} id - 物品 ID
         * @returns {Promise<string|null>} 图标 URL
         */
        async fetchIconFromGT(id) {
            try {
                const url = `${CONFIG.API.GT_DOC}${id}.json`;
                const json = await Utils.request({ method: 'GET', url: url });
                const data = JSON.parse(json);
                if (data && data.item && data.item.icon) {
                    return `${CONFIG.API.GT_ICON}${data.item.icon}.png`;
                }
            } catch (e) {
                // 图标获取失败通常忽略，保持原样
            }
            return null;
        }

        /**
         * 注入模块专用样式
         */
        injectStyles() {
            Utils.addStyle(`
                /* 补全项标记样式 */
                .gt-supp { color: #e67e22 !important; font-weight: 700; font-size: 0.8em !important; }
                .gt-supp::after { content: '➜'; font-size: 2.2em; vertical-align: middle; margin-left: 2px; }
                /* 图标修复过渡动画 */
                img.item-icon[src*="error.png"] { opacity: 0; }
                img.item-icon.gt-fixed { opacity: 1 !important; transition: opacity 0.2s; }
            `);
        }

        /**
         * 建立 MutationObserver 监听页面变动
         */
        observeDOM() {
            let timer = null;
            // 防抖动执行 (Debounce)
            const runFix = () => { this.scanAndFix(); timer = null; };

            const obs = new MutationObserver(mutations => {
                let needsScan = false;
                for (const m of mutations) {
                    // 检测新节点插入
                    if (m.type === 'childList' && m.addedNodes.length) {
                        this.processSupplemental(m.addedNodes);
                        needsScan = true;
                    }
                    // 检测图片 src 属性变化
                    if (m.type === 'attributes' && m.attributeName === 'src') needsScan = true;
                }
                if (needsScan && !timer) timer = setTimeout(runFix, 200);
            });

            obs.observe(document.body, { 
                childList: true, 
                subtree: true, 
                attributes: true, 
                attributeFilter: ['src'] 
            });
        }

        /**
         * 处理补全数据的 DOM 节点，添加高亮样式
         * @param {NodeList} nodes 
         */
        processSupplemental(nodes) {
            nodes.forEach(node => {
                if (node.nodeType !== 1) return;
                const processEl = (el) => {
                    // 识别 GarlandTools 注入的特殊标记
                    if (el.textContent === '补全' && !el.classList.contains('gt-supp')) {
                        el.classList.add('gt-supp');
                        const row = el.closest('tr') || el.closest('[class*="styles_row"]');
                        if (row) row.style.backgroundColor = 'rgba(230,126,34,0.05)';
                    }
                };
                if (node.tagName === 'SPAN' || node.tagName === 'DIV') processEl(node);
                if (node.querySelectorAll) node.querySelectorAll('div, span, td').forEach(processEl);
            });
        }

        /**
         * 绑定跨域通信桥 (Bridge)
         * 页面内脚本 (Page Script) 无法直接跨域，需要通过事件委托给 UserScript 处理
         */
        bindBridge() {
            window.addEventListener('GT_REQ', async e => {
                const { q, reqId } = e.detail;
                let data = [];
                try {
                    // 使用 GM_xmlhttpRequest 进行跨域搜索
                    const res = await Utils.request({ 
                        method: 'GET', 
                        url: `${CONFIG.API.GT_SEARCH}?text=${encodeURIComponent(q)}&lang=chs&type=item` 
                    });
                    const raw = JSON.parse(res);
                    
                    // 过滤并格式化数据，只保留可交易物品
                    data = raw.reduce((acc, x) => {
                        const id = parseInt(x.obj.i);
                        // Bitset 快速校验是否可交易
                        if (!Bitset.has(this.ctx.bitset, id)) return acc;

                        const iconPath = x.obj.c;
                        // 将搜索到的图标加入缓存
                        this.iconRegistry.set(id, `${CONFIG.API.GT_ICON}${iconPath}.png`);

                        acc.push({ 
                            ID: id, Name: x.obj.n, Icon: iconPath, LevelItem: x.obj.l 
                        });
                        return acc;
                    }, []);

                } catch (err) {}
                // 将结果回传给页面脚本
                window.dispatchEvent(new CustomEvent('GT_RES', { detail: { data, reqId } }));
            });
        }

        /**
         * 注入 Fetch 拦截器 (Interceptor)
         * 核心逻辑：劫持页面发出的搜索请求，并行请求 GarlandTools，合并结果后返回。
         */
        injectInterceptor() {
            const script = document.createElement('script');
            script.textContent = `
            (() => {
                const _fetch = window.fetch;
                let _abort = null; // 用于取消前一次未完成的搜索
                
                window.fetch = async (...args) => {
                    const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
                    
                    // 命中搜索接口 (Universalis API)
                    if ((url.includes('/api/search') || url.includes('cafemaker')) && !url.includes('?term=&')) {
                        const u = new URL(url, location.origin);
                        const q = u.searchParams.get('term') || u.searchParams.get('string');
                        
                        // 忽略过短的查询
                        if (!q || q.length < 2) return _fetch(...args);
                        
                        // 取消之前的挂起请求
                        if (_abort) _abort.abort();
                        _abort = new AbortController();
                        
                        // 1. 发起原生请求
                        const pNative = _fetch(...args).then(r => r.clone().json().then(d => ({ ok: r.ok, data: d, headers: r.headers })));
                        
                        // 2. 发起补全请求 (通过 EventBridge)
                        const pSupp = new Promise(resolve => {
                            const signal = _abort.signal;
                            const reqId = Math.random().toString(36).slice(2);
                            
                            const handler = e => {
                                if (e.detail.reqId === reqId) { 
                                    window.removeEventListener('GT_RES', handler); 
                                    resolve(e.detail.data); 
                                }
                            };
                            
                            window.addEventListener('GT_RES', handler);
                            window.dispatchEvent(new CustomEvent('GT_REQ', { detail: { q, reqId } }));
                            
                            // 超时或中断处理
                            setTimeout(() => { window.removeEventListener('GT_RES', handler); resolve([]); }, ${CONFIG.TIMEOUT});
                            signal.addEventListener('abort', () => { window.removeEventListener('GT_RES', handler); resolve([]); });
                        });
                        
                        try {
                            // 3. 并发等待并合并结果
                            const [native, suppItems] = await Promise.all([pNative, pSupp]);
                            
                            // 如果原生失败或无补全数据，直接返回原生结果
                            if (!native.ok || !suppItems.length) {
                                return new Response(JSON.stringify(native.data), { status: native.ok?200:500, headers: native.headers });
                            }
                            
                            // 4. 数据去重与合并
                            const exist = new Set((native.data.Results || []).map(i => i.ID));
                            const cleanSupp = suppItems.filter(i => !exist.has(i.ID)).map(i => ({
                                ID: i.ID, 
                                Name: i.Name,
                                Icon: \`/i/\${String(i.Icon).padStart(6,'0').slice(0,3)}000/\${String(i.Icon).padStart(6,'0')}.png\`,
                                ItemKind: { Name: "GT" }, 
                                ItemSearchCategory: { Name: "补全" }, 
                                LevelItem: i.LevelItem || 1, 
                                Rarity: 1, 
                                isSupplemental: true
                            }));
                            
                            if (native.data.Results) native.data.Results.unshift(...cleanSupp);
                            if (native.data.Pagination) native.data.Pagination.ResultsTotal += cleanSupp.length;
                            
                            return new Response(JSON.stringify(native.data), { status: 200, headers: native.headers });
                        } catch(e) { 
                            return _fetch(...args); 
                        }
                    }
                    return _fetch(...args);
                };
            })();`;
            (document.head || document.documentElement).appendChild(script).remove();
        }
    }

    /**
     * =====================================================================================
     * SECTION 6: WIKI MODULE
     * 灰机 Wiki 增强模块：注入 Universalis 链接
     * =====================================================================================
     */
    class WikiModule {
        /**
         * @param {DataController} ctx - 数据控制器实例
         */
        constructor(ctx) { this.ctx = ctx; }

        run() {
            // 注入通用链接样式
            Utils.addStyle(`
                .uni-link-box { display: flex; align-items: center; gap: 4px; margin: 2px 0 4px; font-size: 14px; }
                .uni-link-box a { color: #77d1ff !important; text-decoration: none !important; }
                .uni-icon { width: 16px; height: 16px; vertical-align: middle; }
            `);
            
            const target = document.getElementById('mw-content-text');
            if (target) this.process(target);
        }

        /**
         * 处理 Wiki 内容区域，查找物品链接并注入按钮
         * @param {HTMLElement} root 
         */
        process(root) {
            // 查找所有指向 Lodestone 的物品链接 (Wiki 物品页的标准特征)
            // [FIXED] 修正 CSS 选择器语法错误: aref -> a[href
            const nodes = root.querySelectorAll('a[href*="lodestone/playguide/db/item/"]');
            
            for (let i = 0, len = nodes.length; i < len; i++) {
                const node = nodes[i];
                const li = node.closest('li');
                // 避免重复注入
                if (!li || li.dataset.uni) continue;

                // 尝试从相邻的 GarlandTools 链接中提取物品 ID
                // [FIXED] 修正 CSS 选择器语法错误: aref -> a[href
                const gtLink = li.parentNode.querySelector('a[href*="garlandtools"]');
                const idStr = gtLink ? gtLink.href.match(/\/(\d+)\/?$/)?.[1] : null;
                const id = idStr ? parseInt(idStr) : 0;

                // 校验 ID 是否有效且可交易 (Bitset check)
                if (id > 0 && Bitset.has(this.ctx.bitset, id)) {
                    li.dataset.uni = '1';
                    const div = document.createElement('div');
                    div.className = 'uni-link-box';
                    div.innerHTML = `
                        <img src="${CONFIG.ASSETS.LOGO}" class="uni-icon">
                        <a href="https://universalis.app/market/${id}" target="_blank" class="external text">Universalis</a>
                    `;
                    li.parentNode.insertBefore(div, li);
                }
            }
        }
    }

    /**
     * =====================================================================================
     * SECTION 7: MAIN ENTRY
     * 主程序入口
     * =====================================================================================
     */
    (async function main() {
        // 1. 初始化数据控制器
        const controller = new DataController();
        await controller.init();

        // 2. 注册油猴菜单 (UserScript Menu)
        const registerMenu = (key, name) => {
            const val = GM_getValue(key, true);
            GM_registerMenuCommand(`${val ? '✅' : '❌'} ${name}`, () => {
                GM_setValue(key, !val);
                location.reload();
            });
        };
        
        registerMenu(CONFIG.KEYS.WIKI, '灰机Wiki 添加Universalis链接');
        registerMenu(CONFIG.KEYS.UNI, 'Universalis 搜索栏补全与修复');

        // 3. 根据当前域名路由到对应模块
        const host = location.hostname;
        if (controller.uniEnabled && host.includes('universalis.app')) {
            // Universalis 模块
            new UniModule(controller).run();
        } else if (controller.wikiEnabled && host.includes('huijiwiki.com')) {
            // Wiki 模块 (处理 DOM 加载时机)
            if (document.readyState === 'loading') {
                window.addEventListener('DOMContentLoaded', () => new WikiModule(controller).run());
            } else {
                new WikiModule(controller).run();
            }
        }
    })();
})();