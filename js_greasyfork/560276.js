// ==UserScript==
// @name         GitHub Advanced Search Builder
// @namespace    https://github.com/quantavil/userscript
// @version      1.8
// @description  Advanced filter modal for GitHub search with OR/AND/NOT logic and native look.
// @author       quantavil
// @match        https://github.com/*
// @license      MIT
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560276/GitHub%20Advanced%20Search%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/560276/GitHub%20Advanced%20Search%20Builder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Config
    const TRIGGER_ID = 'gh-adv-search-btn';
    const MODAL_ID = 'gh-adv-search-modal';

    // Icons
    const FILTER_ICON = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor"><path d="M.75 3h14.5a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1 0-1.5ZM3 7.75A.75.75 0 0 1 3.75 7h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 7.75Zm3 4.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>`;

    function createUI() {
        if (document.getElementById(TRIGGER_ID)) return;

        // Find the global search input container
        const headerSearch = document.querySelector('.header-search-wrapper, .AppHeader-search');
        if (!headerSearch) return;

        // Create Trigger Button
        const btn = document.createElement('button');
        btn.id = TRIGGER_ID;
        btn.className = 'btn btn-sm ml-2';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '4px';
        btn.innerHTML = `${FILTER_ICON} Filter`;
        btn.title = "Advanced Search Builder (Ctrl+Shift+F)";

        // Insert Button
        if (headerSearch.parentNode) {
            headerSearch.parentNode.insertBefore(btn, headerSearch.nextSibling);
        }

        // Create Modal (Hidden by default)
        const modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 95%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            z-index: 9999;
            background-color: var(--bgColor-default, #fff);
            border: 1px solid var(--borderColor-default, #d0d7de);
            border-radius: 6px;
            box-shadow: var(--shadow-large, 0 8px 24px rgba(140,149,159,0.2));
            display: none;
            padding: 16px;
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif;
            color: var(--fgColor-default, #24292f);
            box-sizing: border-box;
        `;

        // Add responsive grid style
        const style = document.createElement('style');
        style.innerHTML = `
            #${MODAL_ID} .responsive-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            @media (max-width: 480px) {
                #${MODAL_ID} .responsive-grid {
                    grid-template-columns: 1fr;
                }
                #${MODAL_ID} {
                    top: 10px;
                    transform: translateX(-50%);
                }
            }
        `;
        document.head.appendChild(style);

        modal.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h3 style="margin:0; font-size:16px;">Advanced Search</h3>
                <button id="${MODAL_ID}-close" class="btn-octicon" type="button">
                   <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg>
                </button>
            </div>

            <form id="${MODAL_ID}-form">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom:12px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Search Type</label>
                        <select id="sel-type" class="form-select select-sm" style="width:100%;">
                            <option value="repositories">Repositories</option>
                            <option value="code">Code</option>
                            <option value="issues">Issues</option>
                            <option value="pullrequests">Pull Requests</option>
                            <option value="discussions">Discussions</option>
                            <option value="users">Users</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Sort By</label>
                        <select id="sel-sort" class="form-select select-sm" style="width:100%;">
                            <option value="">Best Match</option>
                            <option value="stars">Most Stars</option>
                            <option value="forks">Most Forks</option>
                            <option value="updated">Recently Updated</option>
                        </select>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom:12px;">
                    <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Must contain ALL (AND)</label>
                    <input type="text" id="inp-and" class="form-control input-sm input-block" placeholder="rust async tokio" style="width:100%;">
                </div>

                <div class="form-group" style="margin-bottom:12px;">
                    <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Must contain ONE OF (OR)</label>
                    <input type="text" id="inp-or" class="form-control input-sm input-block" placeholder="api, library" style="width:100%;">
                </div>

                <div class="form-group" style="margin-bottom:12px;">
                    <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px; color:var(--fgColor-danger, #cf222e);">Exclude (NOT)</label>
                    <input type="text" id="inp-not" class="form-control input-sm input-block" placeholder="deprecated" style="width:100%;">
                </div>

                <hr style="border:0; border-top:1px solid var(--borderColor-muted); margin: 12px 0;">

                <div class="responsive-grid">
                     <div>
                        <label style="display:block; font-size:12px; font-weight:600;">Owner/User</label>
                        <input type="text" id="inp-user" class="form-control input-sm" placeholder="e.g. facebook" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600;">Repository</label>
                        <input type="text" id="inp-repo" class="form-control input-sm" placeholder="e.g. react" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600;">Language</label>
                        <input type="text" id="inp-lang" class="form-control input-sm" placeholder="e.g. python" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600;">Extension</label>
                        <input type="text" id="inp-ext" class="form-control input-sm" placeholder="e.g. md" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600;">Created Date</label>
                        <input type="text" id="inp-created" class="form-control input-sm" placeholder="e.g. >2023-01-01" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600;">Pushed Date</label>
                        <input type="text" id="inp-pushed" class="form-control input-sm" placeholder="e.g. >2024-01-01" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600;">Stars (>=)</label>
                        <input type="number" id="inp-stars" class="form-control input-sm" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600;">Forks (>=)</label>
                        <input type="number" id="inp-forks" class="form-control input-sm" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600;">Size (KB)</label>
                        <input type="text" id="inp-size" class="form-control input-sm" placeholder="e.g. >1000" style="width:100%;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600;">Topics</label>
                        <input type="text" id="inp-topics" class="form-control input-sm" placeholder="e.g. machine-learning" style="width:100%;">
                    </div>
                </div>

                 <div style="margin-top:12px;">
                    <label style="display:block; font-size:12px; font-weight:600;">In Path</label>
                    <input type="text" id="inp-path" class="form-control input-sm" placeholder="src/main" style="width:100%;">
                </div>

                <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
                    <button type="button" id="${MODAL_ID}-clear" class="btn btn-sm btn-muted">Clear all</button>
                    <button type="submit" class="btn btn-primary btn-sm">Search</button>
                </div>
            </form>

        `;

        document.body.appendChild(modal);

        // Events
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpening = modal.style.display !== 'block';
            modal.style.display = isOpening ? 'block' : 'none';
            if (isOpening) {
                populateFieldsFromURL();
                document.getElementById('inp-and').focus();
            }
        });

        document.getElementById(`${MODAL_ID}-close`).addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById(`${MODAL_ID}-form`).addEventListener('submit', (e) => {
            e.preventDefault();
            executeSearch();
        });

        document.getElementById(`${MODAL_ID}-clear`).addEventListener('click', () => {
            const ids = ['inp-and', 'inp-or', 'inp-not', 'inp-user', 'inp-repo', 'inp-lang', 'inp-ext', 'inp-stars', 'inp-forks', 'inp-path', 'inp-topics', 'inp-created', 'inp-pushed', 'inp-size', 'sel-type', 'sel-sort'];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (el.tagName === 'SELECT') el.selectedIndex = 0;
                    else el.value = '';
                }
            });
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.style.display = 'none';
            if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                modal.style.display = 'block';
                populateFieldsFromURL();
                document.getElementById('inp-and').focus();
            }
        });
    }

    function populateFieldsFromURL() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        const type = params.get('type');
        const sort = params.get('s');

        // Reset fields
        const allIds = ['inp-and', 'inp-or', 'inp-not', 'inp-user', 'inp-repo', 'inp-lang', 'inp-ext', 'inp-stars', 'inp-forks', 'inp-path', 'inp-topics', 'inp-created', 'inp-pushed', 'inp-size', 'sel-type', 'sel-sort'];
        allIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (el.tagName === 'SELECT') el.selectedIndex = 0;
                else el.value = '';
            }
        });

        if (type) document.getElementById('sel-type').value = type;
        if (sort) document.getElementById('sel-sort').value = sort;

        if (!query) return;

        let remainingQuery = query;

        // 1. Extract metadata filters
        const metadataMap = {
            'user': 'inp-user',
            'repo': 'inp-repo',
            'language': 'inp-lang',
            'extension': 'inp-ext',
            'stars': 'inp-stars',
            'forks': 'inp-forks',
            'path': 'inp-path',
            'topic': 'inp-topics',
            'created': 'inp-created',
            'pushed': 'inp-pushed',
            'size': 'inp-size'
        };

        for (const [key, id] of Object.entries(metadataMap)) {
            const regex = new RegExp(`${key}:(\\S+)`, 'i');
            const match = remainingQuery.match(regex);
            if (match) {
                let val = match[1];
                if (key === 'stars' || key === 'forks') {
                    val = val.replace('>=', '');
                }
                document.getElementById(id).value = val;
                remainingQuery = remainingQuery.replace(match[0], '');
            }
        }

        // 2. Extract OR groups: (A OR B OR C)
        const orMatch = remainingQuery.match(/\(([^)]+ OR [^)]+)\)/i);
        if (orMatch) {
            const terms = orMatch[1].split(/\s+OR\s+/i);
            document.getElementById('inp-or').value = terms.join(', ');
            remainingQuery = remainingQuery.replace(orMatch[0], '');
        }

        // 3. Extract NOT terms: -term
        const notTerms = [];
        remainingQuery = remainingQuery.replace(/-(\S+)/g, (match, term) => {
            notTerms.push(term);
            return '';
        });
        if (notTerms.length > 0) {
            document.getElementById('inp-not').value = notTerms.join(', ');
        }

        // 4. Remaining goes to AND
        const andVal = remainingQuery.trim().replace(/\s+/g, ' ');
        if (andVal) {
            document.getElementById('inp-and').value = andVal;
        }
    }

    function executeSearch() {
        let queryParts = [];
        const getVal = (id) => document.getElementById(id).value.trim();

        // Helper to split by space, comma, or semicolon
        const parseList = (val) => val.split(/[\s,;]+/).filter(t => t.length > 0);

        // 1. Handle AND
        const andVal = getVal('inp-and');
        if (andVal) queryParts.push(andVal);

        // 2. Handle OR
        const orVal = getVal('inp-or');
        if (orVal) {
            const terms = parseList(orVal);
            if (terms.length > 1) queryParts.push(`(${terms.join(' OR ')})`);
            else if (terms.length === 1) queryParts.push(terms[0]);
        }

        // 3. Handle NOT
        const notVal = getVal('inp-not');
        if (notVal) {
            const terms = parseList(notVal);
            terms.forEach(t => queryParts.push(`-${t}`));
        }

        // 4. Metadata
        const metadata = {
            'user': 'inp-user',
            'repo': 'inp-repo',
            'language': 'inp-lang',
            'extension': 'inp-ext',
            'stars': 'inp-stars',
            'forks': 'inp-forks',
            'path': 'inp-path',
            'topic': 'inp-topics',
            'created': 'inp-created',
            'pushed': 'inp-pushed',
            'size': 'inp-size'
        };

        for (const [key, id] of Object.entries(metadata)) {
            let val = getVal(id);
            if (val) {
                // Auto-add >= to stars/forks if missing and only a number
                if ((key === 'stars' || key === 'forks') && !val.match(/[<>=]/)) val = `>=${val}`;
                queryParts.push(`${key}:${val}`);
            }
        }

        const type = document.getElementById('sel-type').value;
        const sort = document.getElementById('sel-sort').value;

        // Construct final URL
        const finalQuery = encodeURIComponent(queryParts.join(' '));
        let url = `https://github.com/search?q=${finalQuery}&type=${type}`;
        if (sort) url += `&s=${sort}&o=desc`;

        window.location.href = url;
    }

    // Init and Observe for Turbo/PJAX
    createUI();
    const observer = new MutationObserver(() => {
        if (!document.getElementById(TRIGGER_ID)) createUI();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();