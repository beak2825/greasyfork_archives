// ==UserScript==
// @name         X リプ欄 即ブロック補助
// @namespace    https://x.com/
// @description  個別ツイートページのリプ欄にワンタップ即ブロックボタンを追加し、ページ右下のサイドバーから表示／非表示を切り替えられる補助スクリプト
// @version      1.0
// @match        https://x.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563669/X%20%E3%83%AA%E3%83%97%E6%AC%84%20%E5%8D%B3%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E8%A3%9C%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/563669/X%20%E3%83%AA%E3%83%97%E6%AC%84%20%E5%8D%B3%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E8%A3%9C%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

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
            }, 16);
        });
    }

    async function openMenu(article) {
        const btn = article.querySelector('[data-testid="caret"]');
        if (!btn) return false;
        btn.click();
        return true;
    }

    function hasBlueBadge(article) {
        return !!article.querySelector(
            '[data-testid="icon-verified"], svg[aria-label*="認証"], svg[aria-label*="Verified"]'
        );
    }

    function fireEscKey() {
        const ev = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(ev);
    }

async function doBlock(article, username) {
    const caretBtn = await (async () => {
        const btn = article.querySelector('[data-testid="caret"]');
        if (!btn) return null;
        btn.click();
        return btn;
    })();
    if (!caretBtn) return;

    try {
        const blockBtn = await waitForElement('[data-testid="block"]');
        blockBtn.click();

        // 認証済み → OKのみ
        if (hasBlueBadge(article)) {
            const confirm = await waitForElement('[data-testid="confirmationSheetConfirm"]');
            confirm.click();
            return;
        }

        // 非認証 → confirmationSheet の消失を監視
        try {
            await waitForElement('[data-testid="confirmationSheetCancel"]', 3000);

            const observer = new MutationObserver(() => {
                if (!document.querySelector('[data-testid="confirmationSheetCancel"]')) {
                    observer.disconnect();

                    // ESCキー送信（Xの標準挙動を再現）
                    document.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Escape',
                        code: 'Escape',
                        bubbles: true,
                        cancelable: true
                    }));

                    // 念のため caret 再クリック（iOS / Xの挙動差対策）
                    setTimeout(() => {
                        caretBtn.click();
                    }, 60);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        } catch {}
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
            padding: '2px 8px',
            fontSize: '12px',
            lineHeight: '1',
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
            userSelect: 'none',
            touchAction: 'none'
        });

        const header = document.createElement('div');
        header.textContent = '︿ ドラッグ';
        Object.assign(header.style, {
            padding: '6px 12px',
            fontSize: '12px',
            textAlign: 'center',
            color: '#555',
            cursor: 'grab',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            touchAction: 'none'
        });

        const content = document.createElement('div');

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

        content.appendChild(btn);
        bar.append(header, content);
        document.body.appendChild(bar);
        enableDrag(bar, header);
        updateSidebar();

        let collapsed = false;
        let ignoreClick = false;
        let touchStartTime = 0; // ★追加
        let touchMoved = false; // ★追加

        function toggleCollapse() {
            collapsed = !collapsed;
            if (collapsed) {
                content.style.display = 'none';
                header.textContent = '﹀ ドラッグ';
            } else {
                content.style.display = '';
                header.textContent = '︿ ドラッグ';
            }
        }

        header.addEventListener('click', (e) => {
            if (ignoreClick) {
                ignoreClick = false;
                return;
            }
            e.stopPropagation();
            toggleCollapse();
        });

        // ★追加：iOS / iPadOS 用 tap 判定（click が発火しない問題対策）
        header.addEventListener('touchstart', () => {
            touchStartTime = Date.now();
            touchMoved = false;
        }, { passive: true });

        header.addEventListener('touchmove', () => {
            touchMoved = true;
        }, { passive: true });

        header.addEventListener('touchend', (e) => {
            const elapsed = Date.now() - touchStartTime;

            // ドラッグではなく「短いタップ」のみ toggle
            if (!touchMoved && elapsed < 300 && !ignoreClick) {
                e.preventDefault();
                toggleCollapse();
            }
        });

        const saved = localStorage.getItem(SIDEBAR_POS_KEY);
        if (saved) {
            const pos = JSON.parse(saved);
            bar.style.left = pos.left + 'px';
            bar.style.top = pos.top + 'px';
            bar.style.right = '';
            bar.style.bottom = '';
        }

        bar.__setIgnoreClick = () => {
            ignoreClick = true;
            setTimeout(() => ignoreClick = false, 80); // ★微調整（iOS向けに少し長め）
        };
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
        let startScrollX = 0, startScrollY = 0;
        let startX = 0, startY = 0;
        let dragged = false;

        function getPoint(e) {
            const ev = e.touches ? e.touches[0] : e;
            const vv = window.visualViewport;
            if (vv) {
                return {
                    x: ev.clientX + vv.offsetLeft,
                    y: ev.clientY + vv.offsetTop
                };
            }
            return { x: ev.clientX, y: ev.clientY };
        }

        function lockScroll() {
            startScrollX = window.scrollX;
            startScrollY = window.scrollY;
            document.body.style.overscrollBehavior = 'none';
            document.documentElement.style.overscrollBehavior = 'none';
        }

        function unlockScroll() {
            document.body.style.overscrollBehavior = '';
            document.documentElement.style.overscrollBehavior = '';
        }

        handle.addEventListener('mousedown', start);
        handle.addEventListener('touchstart', start, { passive: false });

        function start(e) {
            e.preventDefault();
            isDown = true;
            dragged = false;
            handle.style.cursor = 'grabbing';
            lockScroll();

            const rect = elm.getBoundingClientRect();
            const vv = window.visualViewport;
            const rectLeft = vv ? rect.left + vv.offsetLeft : rect.left;
            const rectTop  = vv ? rect.top + vv.offsetTop : rect.top;

            const p = getPoint(e);
            startX = p.x;
            startY = p.y;

            offsetX = p.x - rectLeft;
            offsetY = p.y - rectTop;

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', end);
            document.addEventListener('touchmove', move, { passive: false });
            document.addEventListener('touchend', end);
        }

        function move(e) {
            if (!isDown) return;
            e.preventDefault();

            window.scrollTo(startScrollX, startScrollY);

            const p = getPoint(e);

            if (!dragged && (Math.abs(p.x - startX) > 4 || Math.abs(p.y - startY) > 4)) {
                dragged = true;
            }

            let left = p.x - offsetX;
            let top  = p.y - offsetY;

            const vv = window.visualViewport;

            let minLeft = 0;
            let minTop = 0;
            let maxLeft = window.innerWidth - elm.offsetWidth;
            let maxTop = window.innerHeight - elm.offsetHeight;

            if (vv) {
                minLeft = vv.offsetLeft;
                minTop = vv.offsetTop;
                maxLeft = vv.offsetLeft + vv.width - elm.offsetWidth;
                maxTop = vv.offsetTop + vv.height - elm.offsetHeight;
            }

            left = Math.max(minLeft, Math.min(left, maxLeft));
            top  = Math.max(minTop, Math.min(top, maxTop));

            elm.style.left = left + 'px';
            elm.style.top  = top + 'px';
            elm.style.right = '';
            elm.style.bottom = '';
        }

        function end() {
            if (!isDown) return;
            isDown = false;
            handle.style.cursor = 'grab';
            unlockScroll();

            if (dragged) {
                elm.__setIgnoreClick?.();
            }

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

    const observer = new MutationObserver(() => {
        if (!isStatusPage()) return;
        document.querySelectorAll('article').forEach(addButtons);
        createSidebar();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
