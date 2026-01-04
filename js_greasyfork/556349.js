// ==UserScript==
// @name         Steam Curator Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Manages checkboxes for Steam Curator accepted games with toggle, review status, and import/export functionality, now with language switching.
// @author       zelda & Grok3 & Gemini 2.5 Pro & GPT5
// @match        https://store.steampowered.com/curator/*/admin*
// @match https://store.steampowered.com/curator/*/about/*
// @supportURL   https://github.com/zelda0079/Steam-Curator-Game-Manager/tree/main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556349/Steam%20Curator%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/556349/Steam%20Curator%20Enhanced.meta.js
// ==/UserScript==

(function() {
    let lastURL = location.href;

    // 主初始化（在第一次載入頁面時跑）
    handlePage();

    // 監控 pushState / replaceState（Steam admin nav 使用）
    (function(history){
        const push = history.pushState;
        history.pushState = function(){
            push.apply(history, arguments);
            setTimeout(checkURLChange, 50);
        };
        const replace = history.replaceState;
        history.replaceState = function(){
            replace.apply(history, arguments);
            setTimeout(checkURLChange, 50);
        };
    })(window.history);

    // 監控 popstate（如按返回鍵）
    window.addEventListener("popstate", () => setTimeout(checkURLChange, 50));

    function checkURLChange() {
        if (location.href !== lastURL) {
            lastURL = location.href;
            console.log("[Game Manager] URL changed →", location.href);
            handlePage();
        }
    }


    function runAcceptedPageFeatures(){
        // --- Language Configuration ---
        const languages = {
            'en': {
                showAllGames: 'Show All Games',
                showHiddenGames: 'Show Hidden Games',
                showUnhiddenGames: 'Show Unhidden Games',
                reviewedAndUnreviewed: 'Reviewed & Unreviewed',
                reviewed: 'Reviewed',
                unreviewed: 'Unreviewed',
                export: 'Export',
                import: 'Import',
                selectAll: 'Select All',
                deselectAll: 'Deselect All'
            },
            'zh-TW': {
                showAllGames: '顯示所有遊戲',
                showHiddenGames: '顯示隱藏的遊戲',
                showUnhiddenGames: '顯示未隱藏的遊戲',
                reviewedAndUnreviewed: '已評論與尚未評論',
                reviewed: '已評論',
                unreviewed: '尚未評論',
                export: '匯出',
                import: '匯入',
                selectAll: '全選',
                deselectAll: '取消全選'
            },
            'zh-CN': {
                showAllGames: '显示所有游戏',
                showHiddenGames: '显示隐藏的游戏',
                showUnhiddenGames: '显示未隐藏的游戏',
                reviewedAndUnreviewed: '已评论与尚未评论',
                reviewed: '已评论',
                unreviewed: '未评论',
                export: '导出',
                import: '导入',
                selectAll: '全选',
                deselectAll: '取消全选'
            }
        };

        let currentLang = localStorage.getItem('curatorScriptLang') || 'en';
        let i18n = languages[currentLang];

        const style = document.createElement('style');
        style.textContent = `
        .app_filter { display: none !important; }
        #curator-controls-wrapper {
            display: flex !important;
            align-items: center;
            padding: 10px;
            background-color: #171a21;
            margin-bottom: 10px;
            z-index: 1000;
            flex-wrap: wrap;
            gap: 10px;
        }
        .curator-checkbox {
            display: inline-block !important;
            visibility: visible !important;
            margin-right: 10px;
            vertical-align: middle;
        }
    `;
        document.head.appendChild(style);

        function loadCheckboxStates() {
            try {
                return JSON.parse(localStorage.getItem('steamCuratorCheckboxes')) || {};
            } catch {
                return {};
            }
        }

        function saveCheckboxStates(state) {
            localStorage.setItem('steamCuratorCheckboxes', JSON.stringify(state));
        }

        function toggleCheckedGames(toggleState, reviewState) {
            const blocks = document.querySelectorAll('.app_ctn.app_block, [id^="app-ctn-"]');

            requestAnimationFrame(() => {
                blocks.forEach(block => {
                    const cb = block.querySelector('.curator-checkbox');
                    if (!cb) return;

                    const checked = cb.checked;
                    const reviewed = block.classList.contains('app_reviewed');
                    const unreviewed = block.classList.contains('app_unreviewed');

                    let reviewOK =
                        reviewState === 'BOTH' ||
                        (reviewState === 'app_reviewed' && reviewed) ||
                        (reviewState === 'app_unreviewed' && unreviewed);

                    let show = false;
                    if (reviewOK) {
                        if (toggleState === 'all') show = true;
                        else if (toggleState === 'hidden') show = checked;
                        else if (toggleState === 'unhidden') show = !checked;
                    }

                    block.style.display = show ? '' : 'none';
                });
            });

            localStorage.setItem('steamCuratorToggleState', toggleState);
            localStorage.setItem('steamCuratorReviewState', reviewState);
        }

        function updateCheckboxes(states) {
            const blocks = document.querySelectorAll('.app_ctn.app_block, [id^="app-ctn-"]');
            blocks.forEach(block => {
                const id = block.id.replace(/^app-ctn-/, '');
                const cb = block.querySelector('.curator-checkbox');
                if (cb && id in states) cb.checked = states[id];
            });
        }

        function addCheckboxesToNewBlocks(blocks, states) {
            blocks.forEach(block => {
                const id = block.id.replace(/^app-ctn-/, '');
                if (!block.querySelector('.curator-checkbox')) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'curator-checkbox';
                    checkbox.checked = states[id] || false;

                    const img = block.querySelector('img');
                    if (img?.parentNode) img.parentNode.insertBefore(checkbox, img);
                    else block.insertBefore(checkbox, block.firstChild);

                    checkbox.addEventListener('change', () => {
                        states[id] = checkbox.checked;
                        saveCheckboxStates(states);
                    });
                }
            });
        }

        let checkboxStates = loadCheckboxStates();

        function createControls() {
            let wrapper = document.getElementById('curator-controls-wrapper');
            if (!wrapper) {
                wrapper = document.createElement('div');
                wrapper.id = 'curator-controls-wrapper';
            } else wrapper.innerHTML = '';

            const styleBtn = `
            margin: 0 10px; padding: 8px 16px;
            background-color: #1b2838; color: #fff;
            border: 2px solid #66c0f4; border-radius: 4px;
            cursor: pointer; font-weight: bold;
        `;

            const lang = document.createElement('select');
            lang.style.cssText = styleBtn;
            const langMap = { 'en': 'English', 'zh-TW': '正體中文', 'zh-CN': '简体中文' };
            for (const [v, t] of Object.entries(langMap)) {
                const op = document.createElement('option');
                op.value = v; op.textContent = t;
                if (v === currentLang) op.selected = true;
                lang.appendChild(op);
            }
            lang.onchange = () => {
                currentLang = lang.value;
                localStorage.setItem('curatorScriptLang', currentLang);
                i18n = languages[currentLang];
                initializeScript();
            };
            wrapper.appendChild(lang);

            const toggle = document.createElement('select');
            toggle.style.cssText = styleBtn;
            [
                { value: 'all', text: i18n.showAllGames },
                { value: 'hidden', text: i18n.showHiddenGames },
                { value: 'unhidden', text: i18n.showUnhiddenGames }
            ].forEach(o => {
                const op = document.createElement('option');
                op.value = o.value; op.textContent = o.text;
                toggle.appendChild(op);
            });

            const review = document.createElement('select');
            review.style.cssText = styleBtn;
            [
                { value: 'BOTH', text: i18n.reviewedAndUnreviewed },
                { value: 'app_reviewed', text: i18n.reviewed },
                { value: 'app_unreviewed', text: i18n.unreviewed }
            ].forEach(o => {
                const op = document.createElement('option');
                op.value = o.value; op.textContent = o.text;
                review.appendChild(op);
            });

            wrapper.appendChild(toggle);
            wrapper.appendChild(review);

            const makeBtn = txt => {
                const b = document.createElement('button');
                b.textContent = txt;
                b.style.cssText = styleBtn;
                return b;
            };

            const exportBtn = makeBtn(i18n.export);
            const importBtn = makeBtn(i18n.import);
            const selAll = makeBtn(i18n.selectAll);
            const deselAll = makeBtn(i18n.deselectAll);

            const inputFile = document.createElement('input');
            inputFile.type = 'file'; inputFile.style.display = 'none';

            exportBtn.onclick = () => {
                const blob = new Blob([JSON.stringify(checkboxStates, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'steam_curator_checkboxes.json'; a.click();
                URL.revokeObjectURL(url);
            };

            importBtn.onclick = () => inputFile.click();
            inputFile.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                const r = new FileReader();
                r.onload = ev => {
                    checkboxStates = JSON.parse(ev.target.result);
                    saveCheckboxStates(checkboxStates);
                    updateCheckboxes(checkboxStates);
                    toggleCheckedGames(toggle.value, review.value);
                };
                r.readAsText(file);
            };

            selAll.onclick = () => {
                document.querySelectorAll('.curator-checkbox').forEach(cb => {
                    cb.checked = true;
                    const id = cb.closest('.app_ctn').id.replace(/^app-ctn-/, '');
                    checkboxStates[id] = true;
                });
                saveCheckboxStates(checkboxStates);
            };

            deselAll.onclick = () => {
                document.querySelectorAll('.curator-checkbox').forEach(cb => {
                    cb.checked = false;
                    const id = cb.closest('.app_ctn').id.replace(/^app-ctn-/, '');
                    checkboxStates[id] = false;
                });
                saveCheckboxStates(checkboxStates);
            };

            wrapper.appendChild(exportBtn);
            wrapper.appendChild(importBtn);
            wrapper.appendChild(inputFile);
            wrapper.appendChild(selAll);
            wrapper.appendChild(deselAll);

            const parent = document.querySelector('.admin_content') || document.body;
            parent.insertBefore(wrapper, parent.firstChild);

            toggle.value = localStorage.getItem('steamCuratorToggleState') || 'all';
            review.value = localStorage.getItem('steamCuratorReviewState') || 'BOTH';

            toggle.onchange = () => toggleCheckedGames(toggle.value, review.value);
            review.onchange = () => toggleCheckedGames(toggle.value, review.value);

            return { toggle, review };
        }

        function initializeScript(){
            if (!location.href.includes('/admin/accepted')) return;

            const { toggle, review } = createControls();

            const blocks = document.querySelectorAll('.app_ctn.app_block, [id^="app-ctn-"]');
            addCheckboxesToNewBlocks(blocks, checkboxStates);
            toggleCheckedGames(toggle.value, review.value);
        }

        /* ============================================================
     * FIX PATCH START — 100% 按鈕顯示 + 下拉不縮回 + AJAX 載入穩定
     * ============================================================ */

        let initLock = false;
        let lastURL = location.href;

        function waitForBlocksThenInit() {
            if (initLock) return;
            initLock = true;

            const timer = setInterval(() => {
                const blocks = document.querySelectorAll('.app_ctn.app_block, [id^="app-ctn-"]');
                if (blocks.length > 0) {
                    clearInterval(timer);
                    initializeScript();
                    initLock = false;
                }
            }, 130);
        }

        // URL change detection (Steam admin nav uses pushState)
        (function(history){
            const push = history.pushState;
            history.pushState = function(){
                push.apply(history, arguments);
                setTimeout(checkURL, 50);
            };
            const rep = history.replaceState;
            history.replaceState = function(){
                rep.apply(history, arguments);
                setTimeout(checkURL, 50);
            };
        })(window.history);

        window.addEventListener('popstate', () => setTimeout(checkURL, 50));

        function checkURL(){
            if (location.href !== lastURL) {
                lastURL = location.href;
                if (location.href.includes('/admin/accepted')) {
                    waitForBlocksThenInit();
                }
            }
        }

        // Observe only when app blocks are added
        const content = document.querySelector('.admin_content') || document.body;

        const observer = new MutationObserver(muts => {
            if (!location.href.includes('/admin/accepted')) return;

            for (const m of muts) {
                if ([...m.addedNodes].some(n =>
                                           n.nodeType === 1 &&
                                           (n.classList?.contains('app_ctn') ||
                                            n.classList?.contains('app_block'))
                                          )) {
                    waitForBlocksThenInit();
                    break;
                }
            }
        });

        observer.observe(content, { childList: true, subtree: true });

        // Initial run
        waitForBlocksThenInit();

        /* ============================================================
     * FIX PATCH END
     * ============================================================ */
    }

    async function runStatsPageFeatures() {
        console.log("[Game Manager] Stats logic start");

        /* ------------------------------
         * Step 0 — Detect curator_id
         * ------------------------------ */
        const curatorIdMatch = location.href.match(/curator\/([^\/]+)\/admin/);
        if (!curatorIdMatch) {
            console.error("[Game Manager] Cannot detect curator_id from URL");
            return;
        }
        const curatorId = curatorIdMatch[1];

        /* ------------------------------
         * Step 1 — Load group_name (cache)
         * ------------------------------ */
        const CACHE_KEY = `curatorGroupName_${curatorId}`;
        let groupName = localStorage.getItem(CACHE_KEY);

        if (groupName) {
            console.log("[Game Manager] Loaded group_name from cache:", groupName);
        } else {
            console.log("[Game Manager] Fetching group name from /about/ ...");

            const aboutURL = `https://store.steampowered.com/curator/${curatorId}/about/`;
            try {
                const res = await fetch(aboutURL, { credentials: "include" });
                const html = await res.text();
                const dom = new DOMParser().parseFromString(html, "text/html");

                const groupBtn = dom.querySelector(
                    'a.btnv6_white_transparent.btn_medium[href*="steamcommunity.com/groups"]'
                );

                if (groupBtn) {
                    const m = groupBtn.href.match(/groups\/([^\/]+)/);
                    if (m) {
                        groupName = m[1];
                        localStorage.setItem(CACHE_KEY, groupName);
                        console.log("[Game Manager] group_name fetched:", groupName);
                    }
                }
            } catch (err) {
                console.error("[Game Manager] Error fetching group name:", err);
            }
        }

        if (!groupName) {
            console.error("[Game Manager] FAILED to obtain group_name");
            return;
        }

        /* ------------------------------
         * Step 2 — Popup UI (2s fade)
         * ------------------------------ */
        function popup(text) {
            let box = document.createElement("div");
            box.textContent = text;
            box.style.cssText = `
                position: fixed;
                left: 20px;
                bottom: 20px;
                padding: 10px 14px;
                background: rgba(0,0,0,0.75);
                color: #fff;
                font-size: 13px;
                border-radius: 6px;
                z-index: 999999;
                opacity: 0;
                transition: opacity .3s;
            `;
            document.body.appendChild(box);
            requestAnimationFrame(() => box.style.opacity = "1");
            setTimeout(() => {
                box.style.opacity = "0";
                setTimeout(() => box.remove(), 400);
            }, 2000);
        }

        /* ------------------------------
         * Step 3 — Replace links function
         * ------------------------------ */
        function replaceLinks() {
            const links = document.querySelectorAll('a[href*="/app/"]');
            let count = 0;

            links.forEach(a => {

                //（1）沒有 curator_clanid → 不替換
                if (!a.href.includes("curator_clanid=")) return;

                //（2）抓 app ID
                const m = a.href.match(/app\/(\d+)/);
                if (!m) return;
                const appId = m[1];

                //（3）替換成 group 的 curation 連結
                a.href = `https://steamcommunity.com/groups/${groupName}/curation/app/${appId}`;
                count++;
            });

            popup(`已替換連結 (${count})`);
            console.log(`[Game Manager] Replaced ${count} app links`);
        }


        replaceLinks(); // initial run

        /* ------------------------------
         * Step 4 — High-efficiency observer
         * ------------------------------ */
        console.log("[Game Manager] Installing optimized MutationObserver");

        const statsContainer =
            document.querySelector("#detail_stats_table") ||
            document.querySelector(".curation_queue_ctn") ||
            document.querySelector(".admin_content") ||
            document.body;

        const observer = new MutationObserver(muts => {
            let changed = false;
            for (const m of muts) {
                if (m.addedNodes.length > 0) changed = true;
            }
            if (changed) {
                console.log("[Game Manager] Detected stats update, replacing links...");
                replaceLinks();
            }
        });

        observer.observe(statsContainer, {
            childList: true,
            subtree: true
        });

        console.log("[Game Manager] Stats enhancement enabled");
    }



    function handlePage() {
        const url = location.href;

        if (url.includes("/admin/accepted")) {
            console.log("[Game Manager] Entered /admin/accepted → initializing...");
            runAcceptedPageFeatures();
            return;
        }

        if (url.includes("/admin/stats")) {
            console.log("[Game Manager] Entered /admin/stats → initializing...");
            runStatsPageFeatures();
            return;
        }

        console.log("[Game Manager] Page not targeted; idle (but monitoring).");
    }
})();
