// ==UserScript==
// @name          FF14物价查询补充-Universalis+Wiki
// @namespace     FF14-Universalis-CN-L10n
// @version       1.2.0
// @description   Universalis 新版本物品搜索补全；FF14 灰机Wiki 物品页增加物价链接。
// @author        桀桀大王@红茶川
// @match         https://ff14.huijiwiki.com/wiki/*
// @match         https://universalis.app/*
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
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
            CACHE: 'DATA_CACHE',           // 可交易物品ID集合
            TIME: 'DATA_TIMESTAMP'         // 缓存更新时间戳(ms)
        },
        API: {
            UNI_MARKET: 'https://universalis.app/api/marketable',
            GT_SEARCH: 'https://www.garlandtools.cn/api/search.php',
            GT_ICON: 'https://www.garlandtools.cn/files/icons/item/',
            GT_DOC: 'https://www.garlandtools.cn/db/doc/item/chs/3/'
        },
        CACHE_TTL: 2592000000,  // 30天
        ASSETS: {
            LOGO: 'data:image/webp;base64,UklGRsIEAABXRUJQVlA4TLYEAAAvF8AFEPXIz7btfJ7M8tWKndS2bTv+KfpZsW3Utq0ROkA3Cb4VnmqKjtD/ukwX6ALdAI5s221bUawUgI8M/vxhunZpiAEApG36/y2dB4fgEql7FNZH5AYCQACO/0urtTWH7R/Ara0NjEFsl7YRJ1X6mwAYOq2/k2e1XK9redAK46S+rN1zSymZjSURJju3jinqWqbdn/N77St0JtRBqrYoYXh7yvVGWUr/ousYOd60uhSfSOvrh7f1qf6oIiWLILrCq5IX7pIiyaEsrcOuMQ8F40zUUhT8TH++fK3MVo67dyoin1m4KyeiccRbpy2JSy2NtZX1eaEvOWPU3PpOOfZ6fX1ORMCUY+ZFmGkJUFcgZVjGqLpCAdcOa4dShUTL1ubN1dcYPsKYpvlH70pMGDSUPCEXCSgbUhWkp9Bl/ZN0zq3BIWosv+923mcrxmA2/HcNU36GpLOp/XFzfUPDopmrI3CRgbwSLUeiD3VCooPtgkxRpEniNPjpEC1ZDcO/Oam0665d6IAGcoPUlZQzmClpYm5IpSPIdfojObXuvom8Lz69iUf1VwWJvDFZF5pMXCWM754dphVdm1IU1yYAwArjYGJJURcY4+qC/e1phTdqZ394+rp6VyTclMOROCNCxDjqjQPe85hXUqq4mFXlcWnIYyGAFcaJ+NZk4wSmmoTUDEgebOO+uv3uvBzUoYg8rsUEyzBSYCCnWF4xxKwDdhBSi0FjYRlOF/VjJJjz0s0tJxIcLVyTkMv257D2xFd0e0KO44hMXZnQ4/2jYNhN/NUUqOyY4DXBBa8E56R1bB0YYB4GbVpLHK2VEUo0Lq6U37W97eD29wfpCqdSgqkn68PDeyt2qC5VWoxIUWNDIq0mqXBOGl5KFpbpyQpz/O/V9XkfY4ExpcKIRyJPSUqIkaJUEEsrdYW+tPlXS6CiEJcJqCnG/whEGP9xcxAMto0bQ5pKQZ3XvrO9R5vFqRDqCjaSeNQSzPQRKQpwCf/0GSs6kXJKCu5nPDjmSKg7gTA8FByeB7q89CquTcCyaxdhhHyIzURWbsc+wnqUUi6LTFmwmlRu7B8XGSoakTaKOlrgMehjuNxD3KMfxWfO0XGgh3USQD/nXHNaLogdnMSObzSiKqSISTNRFej+/autWFGJiHOSccjjMUf7E3gs/7FwsRw90dQyDADWNqUYcl5b2man2k5cuIgwLcTiSjQYaCuRcEE4tZQTVGiYWmh43K+CqxVC63jfUefSrLg2AQCg+9+FKiG3L4Txb5Qk1qXKjaWESylRFqDIQM4Y/AlkJTDTkN8oGhzCXnpzq8rrj+U9pQ4AaNLSeqQfSC75zWiuSlIFMmoCUdfpSzWwtCFOD/gfyedejAWhGcpclmH47L9NmD6vq/iMOKkFUONYQ8NLG5YzhFQJEe+st84/kehSZxCLy/jdVJe0EfDPkqYzbAasKmekc0xaDgn26NEOu9hpZ6ekVyGkP6CVMP5XQa6DMY0jFxjSvHeonxAYeNlzUISRQ7GWIK67gGgzFsL0pYJSBWNb6jtaXUq/Gdabze3m+NzxzAidwbnWWV2Grzn1f8FShkyY7KJ0S9SXXKYpuVedy5QS8ogqry2/YCg='
        }
    };

    const STATE = {
        wiki: GM_getValue(CONF.KEYS.WIKI, true),
        uni: GM_getValue(CONF.KEYS.UNI, true)
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

        // 同步 Universalis 可交易物品缓存，30天更新一次
        syncCache() {
            const now = Date.now();
            const last = GM_getValue(CONF.KEYS.TIME, 0);
            if (!GM_getValue(CONF.KEYS.CACHE) || (now - last > CONF.CACHE_TTL)) {
                GM_xmlhttpRequest({
                    method: 'GET', url: CONF.API.UNI_MARKET,
                    onload: r => {
                        if (r.responseText.length > 100) {
                            GM_setValue(CONF.KEYS.CACHE, r.responseText);
                            GM_setValue(CONF.KEYS.TIME, now);
                        }
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
                                return new Response(JSON.stringify(data), { status: 200, headers: nativeRes.headers });
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
                            const cacheStr = GM_getValue(CONF.KEYS.CACHE);
                            const allowed = cacheStr ? new Set(JSON.parse(cacheStr)) : null;
                            data = raw
                                .map(x => ({ ID: parseInt(x.obj.i), Name: x.obj.n, Icon: x.obj.c, LevelItem: x.obj.l }))
                                .filter(x => !allowed || allowed.has(x.ID));
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
            document.head.appendChild(css);
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
            document.head.appendChild(css);
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
        if (STATE.uni && host.includes('universalis.app')) CoreUniversalis.init();
        else if (STATE.wiki && host.includes('huijiwiki.com')) CoreWiki.init();
    }

    initMenu();
    dispatchRoute();

})();