// ==UserScript==
// @name          FF14物价查询补充-Universalis+Wiki
// @namespace     FF14-Universalis-CN-L10n
// @version       1.1.1
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

    /**
     * 配置持久化管理
     */
    const config = {
        getWikiEnabled: () => GM_getValue('ENABLE_WIKI_INTEGRATION', true),
        getUniEnabled: () => GM_getValue('ENABLE_UNIVERSALIS_ENHANCER', true),
        setWikiEnabled: (val) => GM_setValue('ENABLE_WIKI_INTEGRATION', val),
        setUniEnabled: (val) => GM_setValue('ENABLE_UNIVERSALIS_ENHANCER', val)
    };

    /**
     * 注册油猴功能菜单，点击后切换状态并刷新页面
     */
    function registerMenus() {
        const wikiStatus = config.getWikiEnabled();
        const uniStatus = config.getUniEnabled();

        GM_registerMenuCommand(`${wikiStatus ? '✅' : '❌'} 灰机Wiki 添加Universalis链接`, () => {
            config.setWikiEnabled(!wikiStatus);
            location.reload();
        });

        GM_registerMenuCommand(`${uniStatus ? '✅' : '❌'} Universalis 新版本物品搜索补全`, () => {
            config.setUniEnabled(!uniStatus);
            location.reload();
        });
    }

    registerMenus();

    // ==========================================
    // 模块一：灰机Wiki 市场集成
    // ==========================================
    const WIKI_MODULE = {
        CONFIG: {
            LODE_KEY: 'lodestone/playguide/db/item/',
            GARL_KEY: 'garlandtools.cn/db/#item/',
            UNI_BASE: 'https://universalis.app/market/',
            UNIQUE_CLASS: 'uni-market-v12',
            ICON: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAY8SURBVEhLnVVpTNN3GCYxm8s2K6iomy4eeAzkpqU3pSe9uKUgoIKoOFRUBMohdkgrRylQsFCgCBQKUhAEFfGeeMwtM5txmcuSJYuZ2T7oPu37sxf2N35Qo/FJSPjQ3/Mez/O8f583gb1x4Xpu4Efp0qglx5R8f3Ns1NJS/pZFeknQxyuZn7wfBFsWBsSE+50qPyJ/4nFtwwV3Bmbc2ZhwGdBxUof8zNDHghBWhUSy2Jd58u6I3LhAd2iv8o8H9+rxy/1yTHanwV2vwkBtHHotSow7kjF7Zif6mhORJP/iljTaN4x5+naEr1+gNR/LePb8z2EMtaagek8QLPvC0FzMxakyHmr2huH4rmCYv4rAkE2HYXsitsateSRlL93MULwZgi2sgILd4qdPfrWjvVII0+5AuBuUuNyXhks9KRhtUeNsq57+T0VHpQiVucHo+joWDpMMWtHK62r1hoUM1esh4Sxx3pw5AE9jHNpKozHm0OPGcDYudCbhQncKbgxm4vZINkabdbAe4cKYE4hM5SocSA9EumotOEGfHGSoXkV06MJ1xfs5f89O7CRyPjqrxThPXd+kAhOOBFzrS8eoVQnT3hAU7oxEvUmFzgYNOms16LBoUFcuRZom4B/2lk8LoqJ8PmBoX0IU4ZfhrFNjrEWHViMXZ+x6fDu+C1fd23DnbA4G62TI1a+DvWE7frxfjXszBTjXlYpzjiRMtCXhUm8GZkfz4LBooRatmJFGsgIY6v+h5C871t8Uj2GrGj0nYjDdM7f3VFpLBvosEuSnh+LW1WY8vFODNhL7eG4gGg9Fo6mEC1NeMCp2BMFWxMWUMwXejhQY1Gt+lnAWhzP0Pj4qgX9Nvy0Bg/VKnD4Zi+leAy65knG2OQ55iQGYmTyGn26WoypnM5qKokgnBbytGoy36zB+Sk9rjEdLCQ/lO0LQURUL5wkF9JLPvkt8kRMZz7+0w6zGcIMKXbT/uQJ3SNDK3BDYahNwezIfjYWR6K2V4po3Bw8uF2CyPQF3J3Ix05uGi53JcJ9U0J8cjUf5sByIhnF3FGLZS47PFxBF+uqrCnkYJRu6a+UYtsWhvUKIgqwgXJnchW6TBKfNcgw1qfHgSj5+uJQHb6MKVwbSMUMG8NSp0FcjQ5dJDHedkgpw0HBUSFOs+l3JX7GcNFix3KBZ99tgo4Y0kGGqKxnWIj5MRQKMO5PgpALnuigLdh1uebfhcn8q5cOAcx1J+GZkB6ZdWzFokaG9XDjfTFuZCNYSIfZsDUQM2zd+fgphOKu8cj8XrmoFdSuFrUqMOqMEXkrsUJMGVz3ZREjZOJOF657tOE/kYy1a6l4xbw6vTYO+E1K0lgrgrBSjvoiHo7nhEEf5lc0XUCj8Fsuil9+tJ9IBErvAsAm1xhh4W/QYaUvAFO35oisJs+M7KR/bMTVXgCY6/bUU3UTYW037P8yBvUSA/mopnRceivMiIWEvNc8XmIOS7Rcs4y5/ZCuXoCo/EpZiMTzU3TDlY8SupUQn4/uL+bjavw2TVGCITDFAEziItO+EfJ60uzIGzgox7GVCHC+MRkw4I/QLqAX+AbGcZVdS5Gth3Meho6bBAN2k6b4MEl+F6dOpVCAT3iYdBsk5Yy2kG01hNwroCgjhMSvQSuRtZNeSPZEQhPlmMdQvsZfizg9hFehiP3/utmrRSw6ZIJFHaF1eIpzqTMAE6TFxKhHOshhaqYwuAA/tJSKcscbBRhN57PFIU697JuH5b2BoX4UggrWvaFcEnYo4OCpEmOpNxUizHi6yYw8F8s7ZbMx0p5IWalgPcchJCrQU8zHnRsdJNahJF0P1eqQFBX1IIl1uKJOgxyyDnc60y6ycX8WYXUMT6NBpiqGTIUDtfg5sB9n0YVLhvDsLCdLVfym4yzYyVG/GnCZyvv/DeiN1XSNHTQEHVbtDUVvIRnFmEI4YAlFEJ7t6HxuTlJ9pTxZS49b/KwxjGRiKt0MV7R9Gk8wezolAMznMepQHSyEHTUYhnCSwp0mL6YEMdFnjoZOseioMXZzCPH13qHirl4jCfSsUvBWPc5I3wUgOMVPa60rp63aAC4N2/VNeMKtTxV/6JfPk/aCV+K+kb3CCONyvTBjmZxGEskyCsEXZb963j89/xWGIvnugTwAAAAAASUVORK5CYII=', // 按钮图标 Base64
            UNTRADABLE_TEXT: '不可在市场出售'
        },
        observer: null,
        fastTimer: null,

        /**
         * 停止所有监听任务
         */
        stopAll: function() {
            if (this.observer) this.observer.disconnect();
            if (this.fastTimer) clearInterval(this.fastTimer);
            this.observer = null;
            this.fastTimer = null;
        },

        /**
         * 执行注入逻辑：在Lodestone链接旁插入Universalis跳转链接
         */
        processInject: function() {
            const warningBox = document.querySelector('ul.color-warning');
            if (warningBox && warningBox.textContent.includes(this.CONFIG.UNTRADABLE_TEXT)) {
                this.stopAll();
                return;
            }

            const lodeLinks = document.querySelectorAll(`a[href*="${this.CONFIG.LODE_KEY}"]`);
            if (lodeLinks.length === 0) return;

            lodeLinks.forEach(lodeLink => {
                const lodeRow = lodeLink.closest('li');
                if (!lodeRow || lodeRow.parentNode.querySelector('.' + this.CONFIG.UNIQUE_CLASS)) return;

                const garlLink = lodeRow.parentNode.querySelector(`a[href*="${this.CONFIG.GARL_KEY}"]`) ||
                                 document.querySelector(`a[href*="${this.CONFIG.GARL_KEY}"]`);

                if (garlLink) {
                    const match = garlLink.href.match(/item[\/|=](\d+)/i);
                    if (match) {
                        const uniID = match[1];
                        const officialColor = window.getComputedStyle(lodeLink).color;

                        const uniRow = document.createElement('li');
                        uniRow.className = (lodeRow.className + ' ' + this.CONFIG.UNIQUE_CLASS).trim();

                        const iconAnchor = document.createElement('a');
                        iconAnchor.href = this.CONFIG.UNI_BASE + uniID;
                        iconAnchor.target = "_blank";

                        const img = document.createElement('img');
                        img.src = this.CONFIG.ICON;
                        img.style.cssText = "width:16px;height:16px;border:none;vertical-align:middle;";
                        iconAnchor.appendChild(img);

                        const textAnchor = document.createElement('a');
                        textAnchor.href = this.CONFIG.UNI_BASE + uniID;
                        textAnchor.target = "_blank";
                        textAnchor.className = "external text";
                        textAnchor.textContent = "Universalis";
                        textAnchor.style.cssText = `color:${officialColor} !important; text-decoration:none;`;

                        uniRow.appendChild(iconAnchor);
                        uniRow.appendChild(document.createTextNode(' '));
                        uniRow.appendChild(textAnchor);

                        lodeRow.parentNode.insertBefore(uniRow, lodeRow);
                    }
                }
            });
        },

        /**
         * 启动MutationObserver监听动态内容加载
         */
        startWatcher: function() {
            if (this.observer) return;
            const target = document.getElementById('mw-content-text') || document.body;
            this.observer = new MutationObserver(() => this.processInject());
            this.observer.observe(target, { childList: true, subtree: true });
            this.processInject();
        },

        /**
         * Wiki模块初始化：采用高频轮询+DOM监听+自动停止策略
         */
        init: function() {
            this.fastTimer = setInterval(() => this.processInject(), 100);

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.startWatcher());
            } else {
                this.startWatcher();
            }

            // 3秒后降低轮询频率以节省资源
            setTimeout(() => {
                if(this.fastTimer) {
                    clearInterval(this.fastTimer);
                    this.fastTimer = setInterval(() => this.processInject(), 1000);
                }
            }, 3000);

            // 10秒后彻底停止以防内存泄露
            setTimeout(() => this.stopAll(), 10000);
        }
    };

    // ==========================================
    // 模块二：Universalis 增强补全
    // ==========================================
    const UNIVERSALIS_MODULE = {
        marketableIds: new Set(),
        CACHE_KEY: 'm_cache',
        TIME_KEY: 'm_cache_time',
        CACHE_TTL: 2592000000, // 30天缓存过期
        scanObserver: null,
        sleepTimer: null,
        inputDebounceTimer: null,

        /**
         * 初始化可交易物品ID库（优先读取缓存，过期则从API同步）
         */
        initData: function() {
            const cached = GM_getValue(this.CACHE_KEY);
            const lastTime = GM_getValue(this.TIME_KEY, 0);

            if (cached && (Date.now() - lastTime < this.CACHE_TTL)) {
                try {
                    this.marketableIds = new Set(JSON.parse(cached));
                    return;
                } catch (e) {}
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: "https://universalis.app/api/marketable",
                onload: (res) => {
                    try {
                        this.marketableIds = new Set(JSON.parse(res.responseText));
                        GM_setValue(this.CACHE_KEY, res.responseText);
                        GM_setValue(this.TIME_KEY, Date.now());
                    } catch (e) {}
                }
            });
        },

        /**
         * 注入UI辅助样式
         */
        injectStyles: function() {
            const style = document.createElement('style');
            style.textContent = `
                .gt-item-fix { color: #e67e22 !important; font-weight: bold !important; display: inline-flex !important; align-items: center; }
                .gt-item-fix::after { content: " ➜"; margin-left: 4px; font-size: 2.5em; }
            `;
            document.documentElement.appendChild(style);
        },

        /**
         * 劫持 Fetch API：当 Universalis 搜索无结果或结果不全时，混入 GarlandTools 的数据
         */
        hijackAPI: function() {
            const self = this;
            const originalJson = Response.prototype.json;
            Response.prototype.json = async function () {
                const data = await originalJson.call(this);
                const isSearch = this.url.includes('/api/search') || this.url.includes('cafemaker');

                if (isSearch && data && Array.isArray(data.Results)) {
                    try {
                        const url = new URL(this.url);
                        const term = url.searchParams.get('term') || url.searchParams.get('string');

                        if (term && term.length >= 2) {
                            const gtItems = await self.fetchGT(term);
                            const existingIds = new Set(data.Results.map(i => i.ID));

                            gtItems.reverse().forEach(item => {
                                // 仅补全 Universalis 库中存在但当前搜索未返回的物品
                                if (self.marketableIds.has(item.ID) && !existingIds.has(item.ID)) {
                                    data.Results.unshift({
                                        ID: item.ID,
                                        Name: item.Name,
                                        Icon: `/i/${item.Icon.toString().padStart(6, '0').substring(0, 3)}000/${item.Icon.toString().padStart(6, '0')}.png`,
                                        LevelItem: item.Lvl || 1,
                                        ItemKind: { Name: "GT补全" },
                                        ItemSearchCategory: { ID: 0, Name: "补全" },
                                        Rarity: 1
                                    });
                                }
                            });
                            if (data.Pagination) data.Pagination.ResultsTotal = data.Results.length;
                        }
                    } catch (e) {}
                }
                return data;
            };
        },

        /**
         * 调用 GarlandTools 搜索 API
         */
        fetchGT: function(term) {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.garlandtools.cn/api/search.php?text=${encodeURIComponent(term)}&lang=chs&type=item`,
                    onload: (res) => {
                        try {
                            const results = JSON.parse(res.responseText);
                            resolve(results.map(i => ({
                                ID: parseInt(i.obj.i),
                                Name: i.obj.n,
                                Icon: i.obj.c,
                                Lvl: i.obj.l
                            })));
                        } catch (e) { resolve([]); }
                    }
                });
            });
        },

        /**
         * 修复详情页缺失或损坏的图标
         */
        fixDetailIcon: function() {
            if (document.hidden) return;
            const img = document.querySelector('img.item-icon');
            if (!img || img._fixed) return;

            if (img.src.includes('error.png') || img.naturalWidth === 0) {
                const itemId = window.location.pathname.match(/\/market\/(\d+)/)?.[1];
                if (!itemId) return;

                img._fixed = true;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.garlandtools.cn/db/doc/item/chs/3/${itemId}.json`,
                    onload: (res) => {
                        try {
                            const iconId = JSON.parse(res.responseText).item.icon;
                            img.removeAttribute('srcset');
                            img.src = `https://www.garlandtools.cn/files/icons/item/${iconId}.png`;
                        } catch (e) { img._fixed = false; }
                    }
                });
            }
        },

        /**
         * 启动 DOM 扫描，为补全的物品添加视觉标记
         */
        startScanning: function() {
            if (this.scanObserver) {
                clearTimeout(this.sleepTimer);
                this.sleepTimer = setTimeout(() => this.stopScanning(), 5000);
                return;
            }
            this.scanObserver = new MutationObserver(() => {
                document.querySelectorAll('div, span, td').forEach(el => {
                    if (el.textContent === "补全" && !el.classList.contains('gt-item-fix')) {
                        el.classList.add('gt-item-fix');
                    }
                });
            });
            this.scanObserver.observe(document.body, { childList: true, subtree: true });
            this.sleepTimer = setTimeout(() => this.stopScanning(), 5000);
        },

        stopScanning: function() {
            if (this.scanObserver) {
                this.scanObserver.disconnect();
                this.scanObserver = null;
            }
        },

        init: function() {
            this.initData();
            this.injectStyles();
            this.hijackAPI();
            setInterval(() => this.fixDetailIcon(), 1500);

            // 仅在用户输入搜索时激活 UI 扫描，减少静止状态下的开销
            document.addEventListener('input', (e) => {
                const t = e.target;
                if (t && (t.tagName === 'INPUT' || t.type === 'text')) {
                    clearTimeout(this.inputDebounceTimer);
                    this.inputDebounceTimer = setTimeout(() => this.startScanning(), 200);
                }
            }, true);
        }
    };

    // 执行初始化
    const currentHost = window.location.hostname;
    if (config.getWikiEnabled() && currentHost.includes('huijiwiki.com')) {
        WIKI_MODULE.init();
    }
    if (config.getUniEnabled() && currentHost.includes('universalis.app')) {
        UNIVERSALIS_MODULE.init();
    }

})();