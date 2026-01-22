// ==UserScript==
// @name          FF14物价查询补充-Universalis+Wiki
// @namespace     FF14-Universalis-CN-L10n
// @version       1.2.2
// @description   Universalis 新版本物品搜索补全；FF14 灰机Wiki 物品页增加物价链接。
// @author        桀桀大王@红茶川
// @match         https://ff14.huijiwiki.com/wiki/*
// @match         https://universalis.app/*
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
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

    // 全局配置
    const CONF = {
        KEYS: {
            WIKI: 'CFG_WIKI_ENABLED',      // Wiki模块开关
            UNI: 'CFG_UNI_ENABLED',        // Universalis模块开关
            CACHE: 'DATA_BITSET',          // 可交易物品Bitset位图缓存
            TIME: 'DATA_TIMESTAMP'         // 缓存更新时间戳(ms)
        },
        API: {
            UNI_MARKET: 'https://universalis.app/api/marketable',
            GT_SEARCH: 'https://www.garlandtools.cn/api/search.php',
            GT_ICON: 'https://www.garlandtools.cn/files/icons/item/',
            GT_DOC: 'https://www.garlandtools.cn/db/doc/item/chs/3/'
        },
        CACHE_TTL: 604800000,   // 7天
        ASSETS: {
            LOGO: 'data:image/webp;base64,UklGRvIBAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSLMAAAABgFvbtqltfw6t1MZfh+2/AKe2OjAKsR3atqM/f773lBAREwDVQFXPSFu+D7zBsSdBed5lY8t7ELQ3siy5PwLrcVQr+Cqwr1g0pgTeVjX/B9dfk0lRLRDOBwH0UAgnOcAwiXBgQxuN0Id8oluP54pGKEAnUQesOzQjQOqYpA9AcJGiDgBMTb9cPyEF0MA1B3XzAsd7WAPBQ6b/SjBmNxleS8Hs6DpXeZ2OgddX2DHaXx+GKgBWUDggGAEAADAGAJ0BKhgAGAA+kUKbSiWjoiGoCACwEglsAJ0zkzwKg7y3Qrkv/5k06q4SygYmUDTzkrTu7gBQgwAA/kR2IPzlGkHyO9/yYVHFBJlggdMt0ymazv3QWRFA7Fmk9rlsNX4g9q3rJK55Fykqc5VycWXdPM1RNG+4YrizU2ZKmGJChyYWidUZvOC0rT+3b0G3XnZlb7FZ7Uew6jEPA8qp88h9cOMq41aHeM4JjjOhGGv1v8JxdVefvvkWlEsxOkiRkqtKcw0msu8ELYGcWvx7EvAHX4FHxctAGmqV6EXDsvR1pO1nozqRu6zQ2bak21hKa2F33FA5l+3kvzLvMyk1MTP+y4FJdTqsHDWEO4b/OcBiGwSju1oAAAA='
        }
    };

    // Bitset 运算
    const Bitset = {
        SIZE: 8192,
        encode: ids => {
            const b = new Uint8Array(Bitset.SIZE);
            ids.forEach(id => { if (id >= 0 && id < 65536) b[id >> 3] |= (1 << (id & 7)); });
            return btoa(String.fromCharCode(...b));
        },
        decode: s => {
            if (!s) return null;
            try {
                const bin = atob(s), b = new Uint8Array(Bitset.SIZE);
                for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
                return b;
            } catch(e) { return null; }
        },
        has: (b, id) => b && id >= 0 && id < 65536 && (b[id >> 3] & (1 << (id & 7))) !== 0
    };

    const STATE = {
        wiki: GM_getValue(CONF.KEYS.WIKI, true),
        uni: GM_getValue(CONF.KEYS.UNI, true),
        bitset: Bitset.decode(GM_getValue(CONF.KEYS.CACHE, ""))
    };

    // ═════════════════════════════════════════════════════════════════════════════════════════════
    // Universalis 搜索增强
    // 通过 Fetch 拦截器和跨域桥接实现搜索结果补全，修复 SPA 页面图标丢失
    // ═════════════════════════════════════════════════════════════════════════════════════════════
    const CoreUniversalis = {
        init() {
            this.syncCache();
            this.injectInterceptor();
            this.bindBridge();
            this.injectStyles();
            this.observeDOM();
        },

        // 自动管理位图缓存 (7天一更新)
        syncCache() {
            const now = Date.now();
            const last = GM_getValue(CONF.KEYS.TIME, 0);
            if (!STATE.bitset || (now - last > CONF.CACHE_TTL)) {
                GM_deleteValue('DATA_CACHE'); // 自动清理旧版JSON缓存
                GM_xmlhttpRequest({
                    method: 'GET', url: CONF.API.UNI_MARKET,
                    onload: r => {
                        try {
                            const ids = JSON.parse(r.responseText);
                            const encoded = Bitset.encode(ids);
                            GM_setValue(CONF.KEYS.CACHE, encoded);
                            GM_setValue(CONF.KEYS.TIME, now);
                            STATE.bitset = Bitset.decode(encoded);
                        } catch(e) {}
                    }
                });
            }
        },

        // 注入原生 Fetch 拦截器，拦截搜索请求并注入 GarlandTools 数据
        injectInterceptor() {
            const script = document.createElement('script');
            script.textContent = `
            (() => {
                const _origFetch = window.fetch;
                window.fetch = async (...args) => {
                    const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');

                    // 仅针对有效搜索请求
                    if ((url.includes('/api/search') || url.includes('cafemaker')) && !url.includes('?term=&')) {
                        try {
                            const u = new URL(url, location.origin);
                            const q = u.searchParams.get('term') || u.searchParams.get('string');
                            if (!q || q.length < 2) return _origFetch(...args);

                            // 并发执行原生请求和 GarlandTools 请求
                            const [nativeRes, gtItems] = await Promise.all([
                                _origFetch(...args),
                                new Promise(resolve => {
                                    const reqId = Math.random().toString(36).slice(2);
                                    const handler = e => {
                                        if (e.detail.reqId === reqId) {
                                            window.removeEventListener('GT_RES', handler);
                                            resolve(e.detail.data);
                                        }
                                    };
                                    window.addEventListener('GT_RES', handler);
                                    window.dispatchEvent(new CustomEvent('GT_REQ', { detail: { q, reqId } }));
                                    setTimeout(() => { window.removeEventListener('GT_RES', handler); resolve([]); }, 2000);
                                })
                            ]);

                            if (!nativeRes.ok || !gtItems.length) return nativeRes;

                            // 合并去重搜索结果
                            const data = await nativeRes.clone().json();
                            if (data.Results) {
                                const exist = new Set(data.Results.map(i => i.ID));
                                const supp = gtItems.filter(i => !exist.has(i.ID)).map(i => ({
                                    ID: i.ID,
                                    Name: i.Name,
                                    Icon: \`/i/\${String(i.Icon).padStart(6,'0').slice(0,3)}000/\${String(i.Icon).padStart(6,'0')}.png\`,
                                    ItemKind: { Name: "GT" },
                                    ItemSearchCategory: { Name: "补全" },
                                    LevelItem: i.LevelItem || 1,
                                    Rarity: 1,
                                    isSupplemental: true
                                }));
                                data.Results.unshift(...supp);
                                if (data.Pagination) data.Pagination.ResultsTotal += supp.length;
                                return new Response(JSON.stringify(data), { status: 200, statusText: 'OK',headers: nativeRes.headers });
                            }
                            return nativeRes;
                        } catch (e) { return _origFetch(...args); }
                    }
                    return _origFetch(...args);
                };
            })();`;
            (document.head || document.documentElement).appendChild(script).remove();
        },

        // 跨域通信桥接，利用 UserScript 权限请求 GarlandTools API
        bindBridge() {
            window.addEventListener('GT_REQ', e => {
                const { q, reqId } = e.detail;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${CONF.API.GT_SEARCH}?text=${encodeURIComponent(q)}&lang=chs&type=item`,
                    onload: r => {
                        let data = [];
                        try {
                            const raw = JSON.parse(r.responseText);
                            data = raw
                                .map(x => ({ ID: parseInt(x.obj.i), Name: x.obj.n, Icon: x.obj.c, LevelItem: x.obj.l }))
                                .filter(x => Bitset.has(STATE.bitset, x.ID));
                        } catch(err) {}
                        window.dispatchEvent(new CustomEvent('GT_RES', { detail: { data, reqId } }));
                    }
                });
            });
        },

        // 注入补全项样式
        injectStyles() {
            const css = document.createElement('style');
            css.textContent = `
                .gt-supp { color: #e67e22 !important; font-weight: 700; font-size: 0.8em !important; }
                .gt-supp::after { content: '➜'; font-size: 2.2em; vertical-align: middle; margin-left: 2px; }
            `;
            (document.head || document.documentElement).appendChild(css);
        },

        // DOM 观察器：标记补全项样式并修复详情页图标丢失
        observeDOM() {
            const obs = new MutationObserver(mutations => {
                let needsScan = false;
                for (const m of mutations) {
                    if ((m.type === 'childList' && m.addedNodes.length > 0) ||
                        (m.type === 'attributes' && m.attributeName === 'src')) {
                        needsScan = true;
                        break;
                    }
                }
                if (!needsScan) return;

                // 标记"补全"项样式
                document.querySelectorAll('div,span,td').forEach(el => {
                    if (el.textContent === '补全' && !el.classList.contains('gt-supp')) {
                        el.classList.add('gt-supp');
                        const row = el.closest('tr') || el.closest('[class*="styles_row"]');
                        if (row) row.style.backgroundColor = 'rgba(230,126,34,0.05)';
                    }
                });

                // 修复详情页缺失图标
                const mId = location.pathname.match(/\/market\/(\d+)/)?.[1];
                if (mId) {
                    const img = document.querySelector('img.item-icon');
                    if (img && img.dataset.fixed !== mId) {
                        if (img.naturalWidth === 0 || img.src.includes('undefined') || img.src === '') {
                            img.dataset.fixed = mId;
                            GM_xmlhttpRequest({
                                method: 'GET', url: `${CONF.API.GT_DOC}${mId}.json`,
                                onload: r => {
                                    try { img.src = `${CONF.API.GT_ICON}${JSON.parse(r.responseText).item.icon}.png`; }
                                    catch(e) { img.dataset.fixed = ''; }
                                }
                            });
                        }
                    }
                }
            });

            obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
        }
    };

    // ═════════════════════════════════════════════════════════════════════════════════════════════
    // 灰机 Wiki 增强
    // 在物品页面自动注入 Universalis 市场链接，排除不可交易物品
    // ═════════════════════════════════════════════════════════════════════════════════════════════
    const CoreWiki = {
        init() {
            const target = document.getElementById('mw-content-text') || document.body;
            if (!target || !target.nodeType) return;
            if (document.readyState !== 'loading') this.process(target);

            const obs = new MutationObserver(() => this.process(target));
            obs.observe(target, { childList: true, subtree: true });
            this.observer = obs;
        },

        injectStyles() {
            if (document.getElementById('uni-wiki-style')) return;
            const css = document.createElement('style');
            css.id = 'uni-wiki-style';
            css.textContent = `
                .uni-link-box { display: flex; align-items: center; gap: 4px; margin: 2px 0 4px; font-size: 14px; }
                .uni-link-box a { color: #77d1ff !important; text-decoration: none !important; }
                .uni-icon { width: 16px; height: 16px; vertical-align: middle; }
            `;
            (document.head || document.documentElement).appendChild(css);
        },

        process(target) {
            // 排除不可交易物品
            const warn = target.querySelector('ul.color-warning');
            if (warn && warn.textContent.includes('不可在市场出售')) {
                if (this.observer) this.observer.disconnect();
                return;
            }

            const anchors = target.querySelectorAll('a[href*="lodestone/playguide/db/item/"]');
            if (!anchors.length) return;

            let injectedCount = 0;
            anchors.forEach(node => {
                const li = node.closest('li');
                if (!li || li.dataset.uni) return;

                // 通过相邻 GarlandTools 链接反推物品 ID
                const gtUrl = li.parentNode.querySelector('a[href*="garlandtools"]')?.href;
                const id = gtUrl?.match(/\/(\d+)\/?$/)?.[1] || gtUrl?.match(/#item\/(\d+)/)?.[1];

                if (id) {
                    li.dataset.uni = '1';
                    const div = document.createElement('div');
                    div.className = 'uni-link-box';
                    div.innerHTML = `<img src="${CONF.ASSETS.LOGO}" class="uni-icon">
                                     <a href="https://universalis.app/market/${id}" target="_blank" class="external text">Universalis</a>`;
                    li.parentNode.insertBefore(div, li);
                    injectedCount++;
                }
            });

            if (injectedCount > 0) {
                this.injectStyles();
                if (this.observer) this.observer.disconnect();
            }
        }
    };

    // 程序入口
    function initMenu() {
        const toggle = (k, v) => { GM_setValue(k, !v); location.reload(); };
        GM_registerMenuCommand(`${STATE.wiki ? '✅' : '❌'} 灰机Wiki 添加Universalis链接`, () => toggle(CONF.KEYS.WIKI, STATE.wiki));
        GM_registerMenuCommand(`${STATE.uni ? '✅' : '❌'} Universalis 新版本物品搜索补全`, () => toggle(CONF.KEYS.UNI, STATE.uni));
    }

    function dispatchRoute() {
        const host = location.hostname;
        if (STATE.uni && host.includes('universalis.app'))
            document.head ? CoreUniversalis.init() : window.addEventListener('DOMContentLoaded', () => CoreUniversalis.init());
        else if (STATE.wiki && host.includes('huijiwiki.com'))
            document.body ? CoreWiki.init() : window.addEventListener('DOMContentLoaded', () => CoreWiki.init());
    }

    initMenu();
    dispatchRoute();

})();