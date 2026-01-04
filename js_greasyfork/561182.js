// ==UserScript==
// @name                Misskey Timeline Instance Filter
// @name:zh-CN          Misskey 实例过滤器 (全局流/白名单)
// @name:ja             Misskey タイムライン インスタンス フィルター
// @namespace           https://github.com/Jarvie8176/misskey-instance-filter
// @version             1.1.1
// @description         Filter Misskey global timeline by instances
// @description:zh-CN   通过实例白名单过滤 Misskey 全局流内容，支持自动翻页直至命中白名单实例内容。
// @description:ja      インスタンスのホワイトリストに基づいてMisskeyのグローバルタイムラインをフィルタリングします。ホワイトリストに一致するインスタンスのコンテンツが見つかるまで、自動的にページを進めることができます。
// @author              JarvieK
// @license             MIT
// @match               *://*/*
// @include             *
// @icon                https://misskey-hub.net/favicon.ico
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_addStyle
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/561182/Misskey%20Timeline%20Instance%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/561182/Misskey%20Timeline%20Instance%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_SETTINGS = {
        lang: 'auto',
        maxPages: 2,
        instanceList: '',
        debug: false,
        wildcardSearch: false,
        hideLocal: false
    };

    const TRANSLATIONS = {
        en: {
            title: "Instance Filter",
            listPlaceholder: "one.domain.per.line",
            maxPagesLabel: "Max Auto-Fetch (Max 10):",
            debugLabel: "Debug Mode:",
            hideLocalLabel: "Hide Local Feed:",
            langLabel: "Language:",
            saveBtn: "Save & Reload",
            cancelBtn: "Cancel",
            settingsTooltip: "Instance Filter Settings",
            placeholderTitle: "Content Filter",
            placeholderText: "🚫 {count} pages filtered continuously.",
            placeholderTrace: "Trace ID: {id}",
            placeholderFooter: "Whitelist active.",
            auto: "Auto",
            blockedTitle: "Recently Blocked:",
            addBtn: "Add",
            searchPlaceholder: "Search instances...",
            wildcardLabel: "Wildcard (*)"
        },
        zh: {
            title: "实例过滤器",
            listPlaceholder: "每行一个域名 (例如: misskey.io)",
            maxPagesLabel: "自动翻页上限 (最高10):",
            debugLabel: "调试模式:",
            hideLocalLabel: "隐藏本地内容:",
            langLabel: "界面语言:",
            saveBtn: "保存并重载",
            cancelBtn: "取消",
            settingsTooltip: "过滤器设置",
            placeholderTitle: "内容过滤器",
            placeholderText: "🚫 已连续过滤 {count} 页数据。",
            placeholderTrace: "追踪 ID: {id}",
            placeholderFooter: "白名单外内容已隐藏。",
            auto: "自动检测",
            blockedTitle: "最近拦截的实例:",
            addBtn: "添加",
            searchPlaceholder: "搜索实例...",
            wildcardLabel: "通配符 (*)"
        },
        ja: {
            title: "インスタンスフィルター",
            listPlaceholder: "1行に1つのドメイン (例: misskey.io)",
            maxPagesLabel: "自動取得上限 (最大10):",
            debugLabel: "デバッグモード:",
            hideLocalLabel: "ローカルを非表示:",
            langLabel: "表示言語:",
            saveBtn: "保存して再読み込み",
            cancelBtn: "キャンセル",
            settingsTooltip: "フィルター設定",
            placeholderTitle: "コンテンツフィルター",
            placeholderText: "🚫 合計 {count} ページを連続フィルタ済み。",
            placeholderTrace: "トレース ID: {id}",
            placeholderFooter: "ホワイトリスト適用中。",
            auto: "自動設定",
            blockedTitle: "最近ブロックされた:",
            addBtn: "追加",
            searchPlaceholder: "インスタンスを検索...",
            wildcardLabel: "ワイルドカード (*)"
        }
    };

    const i18n = getCurrentI18n();

    const TARGET_META = 'meta[name="application-name"][content="Misskey"]';

    if (hasMisskeyMeta()) {
        init();
    }

    // ============== end of entrypoint ==============

    function hasMisskeyMeta() {
        return !!document.querySelector(TARGET_META);
    }

    function init() {
        if (window.__MK_FILTER_LOADED__) return;
        window.__MK_FILTER_LOADED__ = true;
        inject();
    }

    function getCurrentI18n() {
        const savedLang = GM_getValue('mk_filter_lang', DEFAULT_SETTINGS.lang);
        let langCode = savedLang;
        if (savedLang === 'auto') {
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('zh')) langCode = 'zh';
            else if (browserLang.startsWith('ja')) langCode = 'ja';
            else langCode = 'en';
        }
        return TRANSLATIONS[langCode] || TRANSLATIONS.en;
    }

    function getSearchPredicate(query, isWildcard) {
        if (!query) return () => true;
        if (isWildcard) {
            const pattern = query.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
            const regex = new RegExp(`^${pattern}$`, 'i');
            return (domain) => regex.test(domain);
        } else {
            const lowerQuery = query.toLowerCase();
            return (domain) => domain.toLowerCase().includes(lowerQuery);
        }
    }

    function inject() {
        const localHost = window.location.hostname.toLowerCase();
        const isDebug = GM_getValue('mk_filter_debug', DEFAULT_SETTINGS.debug);

        const config = {
            allowedInstances: GM_getValue('mk_filter_list', DEFAULT_SETTINGS.instanceList).split('\n').map(l => l.trim().toLowerCase()).filter(Boolean),
            maxAutoFetchPages: Math.min(10, parseInt(GM_getValue('mk_filter_max_pages', DEFAULT_SETTINGS.maxPages), 10)),
            debug: isDebug,
            hideLocal: GM_getValue('mk_filter_hide_local', DEFAULT_SETTINGS.hideLocal),
            localHost: localHost,
            labels: i18n
        };
        if (!config.hideLocal && !config.allowedInstances.includes(localHost)) {
            config.allowedInstances.push(localHost);
        }

        const configJSON = JSON.stringify(config);

        function injectedLogic() {
            const cfg = window.MK_FILTER_CONFIG;
            let globalContinuousFilteredCount = 0;

            if (cfg.debug) console.log('[MK Filter] Script Injected. Config:', cfg);

            function isNoteAllowed(note) {
                try {
                    if (!note) return true;
                    const user = note.renote?.user || note.user;
                    const host = (user?.host || '').toLowerCase();

                    // 处理本地贴 (host 为空)
                    if (!host) {
                        if (cfg.hideLocal) {
                            if (cfg.debug) console.log(`[MK Filter] 🚫 Blocked Local Post: @${user.username}`);
                            return false;
                        }
                        return true;
                    }

                    // 处理远程贴
                    const isAllowed = cfg.allowedInstances.includes(host);
                    if (!isAllowed) {
                        if (cfg.debug) console.log(`[MK Filter] 🚫 Blocked: @${user.username}@${host}`);
                        window.dispatchEvent(new CustomEvent('mk-filter-blocked-event', {detail: host}));
                    }
                    return isAllowed;
                } catch (e) {
                    return true;
                }
            }

            function createPlaceholder(lastId, count) {
                return [{
                    id: lastId, createdAt: new Date().toISOString(), userId: "filter_bot",
                    user: {
                        id: "filter_bot", name: cfg.labels.placeholderTitle, username: "filter", host: null,
                        avatarUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E"
                    },
                    text: `$[fg.color=888 ${cfg.labels.placeholderText.replace('{count}', count)}]\n$[fg.color=aaa ${cfg.labels.placeholderTrace.replace('{id}', lastId)}]\n\n${cfg.labels.placeholderFooter}`,
                    cw: null, visibility: "public", localOnly: true, renoteCount: 0, repliesCount: 0, reactions: {}, fileIds: [], files: []
                }];
            }

            // WebSocket Filtering
            const WS_Proto = window.WebSocket.prototype;
            const originalAddEventListener = WS_Proto.addEventListener;
            WS_Proto.addEventListener = function (type, listener, options) {
                if (type === 'message' && typeof listener === 'function') {
                    const wrapped = function (event) {
                        try {
                            const data = JSON.parse(event.data);
                            if (data.type === 'channel' && data.body?.type === 'note') {
                                if (!isNoteAllowed(data.body.body)) return;
                            }
                        } catch (e) {
                        }
                        return listener.call(this, event);
                    };
                    return originalAddEventListener.call(this, type, wrapped, options);
                }
                return originalAddEventListener.call(this, type, listener, options);
            };

            // Fetch API Filtering
            const originalFetch = window.fetch;
            window.fetch = async function (...args) {
                const url = typeof args[0] === 'string' ? args[0] : args[0].url;
                if (!url || !url.includes('/api/notes/') || !url.includes('-timeline')) return originalFetch(...args);

                if (cfg.debug) console.log(`[MK Filter] 🛰️ Intercepting Timeline Fetch: ${url}`);

                let isRefreshRequest = false;
                try {
                    const body = JSON.parse(args[1].body);
                    if (body.sinceId) isRefreshRequest = true;
                } catch (e) {
                }

                const fetchLoop = async (fArgs, currentReqPageCount) => {
                    const response = await originalFetch(...fArgs);
                    if (!response.ok) return response;
                    const cloned = response.clone();
                    let data;
                    try {
                        data = await cloned.json();
                    } catch (e) {
                        return response;
                    }
                    if (!Array.isArray(data)) return response;

                    const filtered = data.filter(isNoteAllowed);

                    if (filtered.length > 0) {
                        if (cfg.debug) console.log(`[MK Filter] ✅ Passed ${filtered.length}/${data.length} notes.`);
                        globalContinuousFilteredCount = 0;
                        return new Response(JSON.stringify(filtered), {status: 200, headers: response.headers});
                    }

                    if (isRefreshRequest) {
                        if (cfg.debug) console.log(`[MK Filter] ⏳ Refresh yielded 0 results after filtering. Silencing.`);
                        return new Response(JSON.stringify([]), {status: 200, headers: response.headers});
                    }

                    if (data.length > 0 && currentReqPageCount <= cfg.maxAutoFetchPages) {
                        const lastId = data[data.length - 1].id;
                        if (cfg.debug) console.log(`[MK Filter] 🔄 Page ${currentReqPageCount} empty after filtering. Auto-fetching next... (untilId: ${lastId})`);
                        const nextArgs = [...fArgs];
                        try {
                            const body = JSON.parse(nextArgs[1].body);
                            body.untilId = lastId;
                            nextArgs[1].body = JSON.stringify(body);
                            return fetchLoop(nextArgs, currentReqPageCount + 1);
                        } catch (e) {
                        }
                    }

                    if (data.length > 0) {
                        globalContinuousFilteredCount += currentReqPageCount;
                        const lastId = data[data.length - 1].id;
                        if (cfg.debug) console.log(`[MK Filter] 🛑 Max auto-fetch reached. Displaying placeholder.`);
                        return new Response(JSON.stringify(createPlaceholder(lastId, globalContinuousFilteredCount)), {status: 200, headers: response.headers});
                    }
                    return response;
                };

                return fetchLoop(args, 1);
            };
        }

        const script = document.createElement('script');
        script.textContent = `window.MK_FILTER_CONFIG = ${configJSON}; (${injectedLogic.toString()})();`;
        document.documentElement.appendChild(script);
        script.remove();

        const blockedInstancesInUi = new Set();
        window.addEventListener('load', () => {
            GM_addStyle(`
                #mk-f-btn{position:fixed;bottom:20px;right:20px;z-index:99999;width:34px;height:34px;border-radius:50%;background:#31748f;color:#fff;border:none;cursor:pointer;opacity:0.6;transition:0.3s;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3)}
                #mk-f-btn:hover{opacity:1;transform:scale(1.1)}
                #mk-f-panel{position:fixed;bottom:65px;right:20px;z-index:99999;width:280px;background:var(--panel, #fff);color:var(--fg, #333);border-radius:12px;padding:15px;box-shadow:0 8px 30px rgba(0,0,0,0.3);display:none;font-family:sans-serif;font-size:13px;border:1px solid rgba(128,128,128,0.2)}
                #mk-f-list{width:100%;margin:10px 0;font-size:12px;border:1px solid #ccc;border-radius:6px;box-sizing:border-box;display:block;background:var(--face, #fcfcfc);color:inherit;padding:8px;resize:vertical;min-height:80px}
                .mk-f-row{display:flex;justify-content:space-between;align-items:center;margin:8px 0}
                .mk-f-row select, .mk-f-row input[type="number"]{padding:2px 4px;border-radius:4px;border:1px solid #ccc;background:var(--face, #fff);color:inherit}
                .mk-f-blocked-area{margin-top:10px;padding-top:10px;border-top:1px dashed #ccc}
                .mk-f-search-container{display:flex;align-items:center;gap:5px;margin-bottom:5px}
                .mk-f-blocked-search{flex:1;padding:4px 8px;font-size:11px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;background:var(--face, #fff);color:inherit}
                .mk-f-wildcard-opt{display:flex;align-items:center;gap:3px;font-size:10px;white-space:nowrap;cursor:pointer;opacity:0.8}
                .mk-f-blocked-list{max-height:120px;overflow-y:auto;background:var(--face, #f9f9f9);border-radius:4px;padding:5px;margin-top:5px;border:1px solid #eee}
                .mk-f-blocked-item{display:flex;justify-content:space-between;padding:4px 4px;font-size:11px;border-bottom:1px solid #eee;align-items:center}
                .mk-f-add-btn{padding:2px 6px;background:#31748f;color:#fff;border-radius:4px;cursor:pointer;font-size:10px;border:none;line-height:1}
                .mk-f-btns{margin-top:15px;display:flex;gap:8px}
                .mk-f-btns button{flex:1;padding:8px;border:none;border-radius:6px;cursor:pointer;font-weight:bold}
                #mk-f-save{background:#28a745;color:#fff}
                #mk-f-cancel{background:#6c757d;color:#fff}
                .mk-f-footer{margin-top:12px;display:flex;justify-content:center;gap:15px;opacity:0.6;font-size:11px}
                .mk-f-footer a{color:inherit;text-decoration:none;display:flex;align-items:center;gap:4px}
                .mk-f-footer a:hover{opacity:1;text-decoration:underline}
            `);

            const div = document.createElement('div');
            div.innerHTML = `
                <button id="mk-f-btn" title="${i18n.settingsTooltip}">⚙️</button>
                <div id="mk-f-panel">
                    <div style="font-weight:bold;font-size:15px;margin-bottom:10px;color:#31748f;display:flex;align-items:center;gap:5px;">
                        <span>🛡️ ${i18n.title}</span>
                    </div>
                    <textarea id="mk-f-list" rows="5" placeholder="${i18n.listPlaceholder}"></textarea>
                    <div class="mk-f-blocked-area">
                        <div style="font-weight:bold;font-size:12px;margin-bottom:5px;">🕒 ${i18n.blockedTitle}</div>
                        <div class="mk-f-search-container">
                            <input type="text" id="mk-f-blocked-search" class="mk-f-blocked-search" placeholder="${i18n.searchPlaceholder}">
                            <label class="mk-f-wildcard-opt">
                                <input type="checkbox" id="mk-f-wildcard-toggle"> ${i18n.wildcardLabel}
                            </label>
                        </div>
                        <div id="mk-f-blocked-list" class="mk-f-blocked-list"></div>
                    </div>
                    <div style="height:1px; background:rgba(128,128,128,0.1); margin:15px 0 10px 0;"></div>
                    <div class="mk-f-row">
                        <span>🌐 ${i18n.langLabel}</span>
                        <select id="mk-f-lang">
                            <option value="auto">${i18n.auto}</option>
                            <option value="zh">简体中文</option>
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                        </select>
                    </div>
                    <div class="mk-f-row">
                        <span>📄 ${i18n.maxPagesLabel}</span>
                        <input type="number" id="mk-f-pages" style="width:45px" min="0" max="10">
                    </div>
                    <div class="mk-f-row">
                        <span>🏠 ${i18n.hideLocalLabel}</span>
                        <input type="checkbox" id="mk-f-hide-local-toggle">
                    </div>
                    <div class="mk-f-row">
                        <span>🐛 ${i18n.debugLabel}</span>
                        <input type="checkbox" id="mk-f-debug-toggle">
                    </div>
                    <div class="mk-f-btns">
                        <button id="mk-f-save">${i18n.saveBtn}</button>
                        <button id="mk-f-cancel">${i18n.cancelBtn}</button>
                    </div>
                    <div class="mk-f-footer">
                        <a href="https://github.com/Jarvie8176/misskey-instance-filter" target="_blank">📦 GitHub</a>
                        <a href="https://ko-fi.com/jk433552" target="_blank">☕ Ko-fi</a>
                    </div>
                </div>
            `;
            document.body.appendChild(div);

            const listInput = document.getElementById('mk-f-list');
            const blockedListDiv = document.getElementById('mk-f-blocked-list');
            const searchInput = document.getElementById('mk-f-blocked-search');
            const wildcardToggle = document.getElementById('mk-f-wildcard-toggle');

            function renderBlocked() {
                blockedListDiv.innerHTML = '';
                const currentAllowed = listInput.value.split('\n').map(s => s.trim().toLowerCase());
                const query = searchInput.value.trim();
                const isWildcard = wildcardToggle.checked;
                const matchPredicate = getSearchPredicate(query, isWildcard);
                Array.from(blockedInstancesInUi)
                    .filter(domain => !currentAllowed.includes(domain) && matchPredicate(domain))
                    .sort((a, b) => a.localeCompare(b))
                    .forEach(domain => {
                        const item = document.createElement('div');
                        item.className = 'mk-f-blocked-item';
                        item.innerHTML = `<span>${domain}</span><button class="mk-f-add-btn" data-domain="${domain}">${i18n.addBtn} +</button>`;
                        blockedListDiv.appendChild(item);
                    });
                blockedListDiv.querySelectorAll('.mk-f-add-btn').forEach(b => {
                    b.onclick = (e) => {
                        const domain = e.target.getAttribute('data-domain');
                        const v = listInput.value.trim();
                        listInput.value = v ? v + '\n' + domain : domain;
                        renderBlocked();
                    };
                });
            }

            searchInput.oninput = renderBlocked;
            wildcardToggle.onchange = renderBlocked;
            listInput.oninput = renderBlocked;

            window.addEventListener('mk-filter-blocked-event', (e) => {
                const domain = e.detail;
                if (domain && !blockedInstancesInUi.has(domain)) {
                    blockedInstancesInUi.add(domain);
                    if (document.getElementById('mk-f-panel').style.display === 'block') renderBlocked();
                }
            });

            document.getElementById('mk-f-btn').onclick = () => {
                const panel = document.getElementById('mk-f-panel');
                const isVisible = panel.style.display === 'block';
                panel.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    listInput.value = GM_getValue('mk_filter_list', DEFAULT_SETTINGS.instanceList);
                    document.getElementById('mk-f-pages').value = GM_getValue('mk_filter_max_pages', DEFAULT_SETTINGS.maxPages);
                    document.getElementById('mk-f-debug-toggle').checked = GM_getValue('mk_filter_debug', DEFAULT_SETTINGS.debug);
                    document.getElementById('mk-f-hide-local-toggle').checked = GM_getValue('mk_filter_hide_local', DEFAULT_SETTINGS.hideLocal);
                    document.getElementById('mk-f-lang').value = GM_getValue('mk_filter_lang', DEFAULT_SETTINGS.lang);
                    wildcardToggle.checked = GM_getValue('mk_filter_wildcard', DEFAULT_SETTINGS.wildcardSearch);
                    searchInput.value = '';
                    renderBlocked();
                }
            };

            document.getElementById('mk-f-cancel').onclick = () => {
                document.getElementById('mk-f-panel').style.display = 'none';
            };

            document.getElementById('mk-f-save').onclick = () => {
                const rawPages = parseInt(document.getElementById('mk-f-pages').value, 10) || 0;
                const clampedPages = Math.min(10, Math.max(0, rawPages)); // 强制校验：0-10之间

                GM_setValue('mk_filter_list', listInput.value);
                GM_setValue('mk_filter_max_pages', clampedPages);
                GM_setValue('mk_filter_debug', document.getElementById('mk-f-debug-toggle').checked);
                GM_setValue('mk_filter_hide_local', document.getElementById('mk-f-hide-local-toggle').checked);
                GM_setValue('mk_filter_lang', document.getElementById('mk-f-lang').value);
                GM_setValue('mk_filter_wildcard', wildcardToggle.checked);
                window.location.reload();
            };
        });
    }
})();
