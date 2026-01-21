// ==UserScript==
// @name         X リプ欄 即ブロック支援
// @namespace    https://x.com/
// @description  個別ツイートページのリプ欄にワンタップ即ブロックボタンを追加し、ページ右下のサイドバーから表示／非表示を切り替えられる補助スクリプト
// @version      1.6
// @match        https://x.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563398/X%20%E3%83%AA%E3%83%97%E6%AC%84%20%E5%8D%B3%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E6%94%AF%E6%8F%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/563398/X%20%E3%83%AA%E3%83%97%E6%AC%84%20%E5%8D%B3%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E6%94%AF%E6%8F%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'x_block_log';
    const TOGGLE_KEY = 'x_block_button_enabled';
    const SIDEBAR_POS_KEY = 'x_block_sidebar_pos';

    function isStatusPage() {
        return location.pathname.includes('/status/');
    }

    function isEnabled() {
        return localStorage.getItem(TOGGLE_KEY) !== 'false';
    }

    function setEnabled(val) {
        localStorage.setItem(TOGGLE_KEY, val ? 'true' : 'false');
        updateButtonVisibility();
        updateSidebar();
    }

    function saveLog(entry) {
        const logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        logs.unshift(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 100)));
    }

    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject();
                }
            }, 100);
        });
    }

    async function openMenu(article) {
        const btn = article.querySelector('[data-testid="caret"]');
        if (!btn) return false;
        btn.click();
        return true;
    }

    async function doBlock(article, username) {
        saveLog({ user: username, time: new Date().toISOString(), url: location.href });

        if (!await openMenu(article)) return;

        try {
            const blockBtn = await waitForElement('[data-testid="block"]');
            blockBtn.click();

            const confirm = await waitForElement('[data-testid="confirmationSheetConfirm"]');
            confirm.click();
        } catch {}
    }

    function addButtons(article) {
        if (!isStatusPage()) return;
        if (article.querySelector('.quick-block')) return;

        const userLink = article.querySelector('a[href^="/"][role="link"]');
        if (!userLink) return;

        const username = userLink.getAttribute('href');

        const blockBtn = document.createElement('button');
        blockBtn.className = 'quick-block';
        blockBtn.textContent = '◆ ブロック';

        Object.assign(blockBtn.style, {
            minWidth: '72px',
            padding: '2px 8px',        // ← 縦を最小限に
            fontSize: '12px',
            lineHeight: '1',           // ← 行高を固定しない
            borderRadius: '999px',
            border: '1px solid #b6d9ff',
            background: '#eaf4ff',
            color: '#000',
            fontWeight: '600',
            cursor: 'pointer',
            marginRight: '6px',
            display: isEnabled() ? 'inline-flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center'
        });

        blockBtn.onclick = () => doBlock(article, username);

        const actionRoot = article.querySelector('div.css-175oi2r.r-1kkk96v');

        if (actionRoot) {
            actionRoot.style.display = 'flex';
            actionRoot.style.flexDirection = 'row';
            actionRoot.style.alignItems = 'center';
            actionRoot.prepend(blockBtn);
        } else {
            article.querySelector('[role="group"]')?.appendChild(blockBtn);
        }
    }

    function updateButtonVisibility() {
        document.querySelectorAll('.quick-block').forEach(btn => {
            btn.style.display = isEnabled() ? 'inline-flex' : 'none';
        });
    }

    /* ===== サイドバーUI（ドラッグ可・ヘッダー付き） ===== */

    function createSidebar() {
        if (!isStatusPage()) return;
        if (document.getElementById('x-block-sidebar')) return;

        const bar = document.createElement('div');
        bar.id = 'x-block-sidebar';

        Object.assign(bar.style, {
            position: 'fixed',
            right: '16px',
            bottom: '24px',
            zIndex: 99999,
            width: '170px',
            background: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            userSelect: 'none'
        });

        const header = document.createElement('div');
        header.textContent = '︿ ドラッグ';
        Object.assign(header.style, {
            padding: '6px 12px',
            fontSize: '12px',
            textAlign: 'center',
            color: '#555',
            cursor: 'grab',
            borderBottom: '1px solid rgba(0,0,0,0.1)'
        });

        const btn = document.createElement('button');
        Object.assign(btn.style, {
            margin: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #b6d9ff',
            background: '#eaf4ff',
            color: '#000',
            cursor: 'pointer',
            fontWeight: '600',
            width: 'calc(100% - 16px)',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s, border 0.15s, color 0.15s'
        });

        btn.onclick = (e) => {
            e.stopPropagation();
            setEnabled(!isEnabled());
        };

        bar.append(header, btn);
        document.body.appendChild(bar);
        enableDrag(bar, header);
        updateSidebar();

        const saved = localStorage.getItem(SIDEBAR_POS_KEY);
        if (saved) {
            const pos = JSON.parse(saved);
            bar.style.left = pos.left + 'px';
            bar.style.top = pos.top + 'px';
            bar.style.right = '';
            bar.style.bottom = '';
        }
    }

    function updateSidebar() {
        const bar = document.getElementById('x-block-sidebar');
        if (!bar) return;

        const btn = bar.querySelector('button');
        const enabled = isEnabled();

        if (enabled) {
            btn.textContent = '◆ ブロック表示中';
            btn.style.background = '#eaf4ff';
            btn.style.border = '1px solid #b6d9ff';
            btn.style.color = '#000';
        } else {
            btn.textContent = '− ブロック非表示';
            btn.style.background = '#f0f0f0';
            btn.style.border = '1px solid #bbb';
            btn.style.color = '#666';
        }
    }

    function enableDrag(elm, handle) {
        let isDown = false;
        let offsetX = 0, offsetY = 0;

        handle.addEventListener('mousedown', start);
        handle.addEventListener('touchstart', start, { passive: false });

        function start(e) {
            isDown = true;
            handle.style.cursor = 'grabbing';

            const rect = elm.getBoundingClientRect();
            const ev = e.touches ? e.touches[0] : e;

            offsetX = ev.clientX - rect.left;
            offsetY = ev.clientY - rect.top;

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', end);
            document.addEventListener('touchmove', move, { passive: false });
            document.addEventListener('touchend', end);
        }

        function move(e) {
            if (!isDown) return;
            e.preventDefault();

            const ev = e.touches ? e.touches[0] : e;

            let left = ev.clientX - offsetX;
            let top  = ev.clientY - offsetY;

            const maxLeft = window.innerWidth - elm.offsetWidth;
            const maxTop  = window.innerHeight - elm.offsetHeight;

            left = Math.max(0, Math.min(left, maxLeft));
            top  = Math.max(0, Math.min(top, maxTop));

            elm.style.left = left + 'px';
            elm.style.top  = top + 'px';
            elm.style.right = '';
            elm.style.bottom = '';
        }

        function end() {
            if (!isDown) return;
            isDown = false;
            handle.style.cursor = 'grab';

            const rect = elm.getBoundingClientRect();
            localStorage.setItem(SIDEBAR_POS_KEY, JSON.stringify({
                left: rect.left,
                top: rect.top
            }));

            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);
            document.removeEventListener('touchmove', move);
            document.removeEventListener('touchend', end);
        }
    }

    /* ===== 起動処理 ===== */

    const observer = new MutationObserver(() => {
        if (!isStatusPage()) return;
        document.querySelectorAll('article').forEach(addButtons);
        createSidebar();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
