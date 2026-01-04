// ==UserScript==
// @name         Nitro Type Leaderboards (Startrack Embed)
// @namespace    https://ntstartrack.org
// @version      1.0
// @description  Adds a Leaderboards tab and loads ntstartrack.org/leaderboards inside Nitro Type’s layout
// @match        https://www.nitrotype.com/*
// @grant        none
// @author       Daymare
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553925/Nitro%20Type%20Leaderboards%20%28Startrack%20Embed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553925/Nitro%20Type%20Leaderboards%20%28Startrack%20Embed%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TAB_CLASS = 'nt-custom-leaderboards';

    function insertTab() {
        if (document.querySelector('.' + TAB_CLASS)) return;
        const nav = document.querySelector('.nav-list');
        if (!nav) return;

        const ach = Array.from(nav.children).find(li =>
            li.textContent.trim().includes('Achievements')
        );
        const li = document.createElement('li');
        li.className = `nav-list-item ${TAB_CLASS}`;
        li.innerHTML = `<a href="/leaderboards" class="nav-link"><span class="has-notify">Leaderboards</span></a>`;

        if (ach) ach.before(li);
        else nav.appendChild(li);
    }

    function setActiveTab() {
        document.querySelectorAll('.nav-list-item').forEach(li => li.classList.remove('is-current'));
        const tab = document.querySelector('.' + TAB_CLASS);
        if (tab) tab.classList.add('is-current');
    }

    function replace404() {
        const main = document.querySelector('main.structure-content');
        if (!main) return;
        if (main.querySelector('iframe[src*="ntstartrack.org"]')) return;

        main.innerHTML = `
            <section class="card card--b card--shadow card--o card--grit card--f mtxs mbm">
                <div class="well--p well--l_p pll" style="padding:0;">
                    <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
                        <h1 class="tc-i mbs tbs" style="margin:20px 0 10px;">Leaderboards</h1>
                        <div style="width:100%;height:80vh;border-radius:8px;overflow:hidden;">
                            <iframe
                                src="https://ntstartrack.org/leaderboards"
                                style="width:100%;height:100%;border:none;"
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>
                </div>
            </section>
        `;
        document.title = 'Leaderboards | Nitro Type';
        setActiveTab();
    }

    function handlePage() {
        insertTab();
        if (location.pathname === '/leaderboards') {
            const observer = new MutationObserver(() => {
                const err = document.querySelector('.error');
                if (err) {
                    replace404();
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    const obs = new MutationObserver(handlePage);
    obs.observe(document.body, { childList: true, subtree: true });
    handlePage();
})();
