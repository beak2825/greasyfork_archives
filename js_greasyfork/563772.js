// ==UserScript==
// @name         나무위키 게시판 링크 복사기
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  나무위키 게시글 우상단의 공유 버튼 클릭 시 복사 완료를 시각화합니다.
// @author       disprosium1
// @match        https://board.namu.wiki/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=namu.wiki
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563772/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EB%A7%81%ED%81%AC%20%EB%B3%B5%EC%82%AC%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/563772/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EA%B2%8C%EC%8B%9C%ED%8C%90%20%EB%A7%81%ED%81%AC%20%EB%B3%B5%EC%82%AC%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const iconCss = `
        .ion-md-share {
            cursor: pointer !important;
            display: inline-block !important;
            transition: transform 0.12s cubic-bezier(.2,.8,.2,1), color 0.12s ease;
        }
        .nmw-copy-click-animate {
            transform: scale(0.86) !important;
            color: #6c757d !important;
        }
    `;
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(iconCss);
    } else {
        const s = document.createElement('style');
        s.textContent = iconCss;
        document.head.appendChild(s);
    }

    const host = document.createElement('div');
    host.style.all = 'initial';
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
        <style>
            :host { all: initial; }
            #nmw-copy-toast {
                font-family: "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", sans-serif;
                font-weight: 500;
                visibility: hidden;
                min-width: 260px;
                max-width: 90vw;
                background-color: rgba(33,33,33,0.96);
                color: #ffffff;
                text-align: center;
                border-radius: 50px;
                padding: 12px 20px;
                position: fixed;
                z-index: 2147483647;
                left: 50%;
                bottom: 50px;
                transform: translateX(-50%);
                font-size: 14px;
                box-shadow: 0 6px 22px rgba(0,0,0,0.45);
                opacity: 0;
                transition: opacity 0.42s cubic-bezier(.2,.8,.2,1), bottom 0.42s cubic-bezier(.2,.8,.2,1);
                pointer-events: none;
            }
            #nmw-copy-toast.show {
                visibility: visible;
                opacity: 1;
                bottom: 80px;
            }
        </style>
        <div id="nmw-copy-toast" role="status" aria-live="polite"></div>
    `;

    const toastEl = shadow.getElementById('nmw-copy-toast');
    let toastTimer = null;

    function showToast(message, duration = 2500) {
        if (!toastEl) return;
        toastEl.textContent = message;
        clearTimeout(toastTimer);
        toastEl.classList.add('show');
        toastTimer = setTimeout(() => {
            toastEl.classList.remove('show');
        }, duration);
    }

    function writeTextToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise((resolve, reject) => {
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                ta.style.top = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(ta);
                if (ok) resolve();
                else reject(new Error('execCommand 실패'));
            } catch (err) {
                reject(err);
            }
        });
    }

    document.addEventListener('click', function (ev) {
        const targetIcon = ev.target.closest('.ion-md-share');
        if (!targetIcon) return;

        ev.preventDefault();
        ev.stopImmediatePropagation();

        targetIcon.classList.add('nmw-copy-click-animate');
        setTimeout(() => targetIcon.classList.remove('nmw-copy-click-animate'), 160);

        let linkUrl = null;

        const wrapper = targetIcon.closest('.article-link');
        if (wrapper) {
            const a = wrapper.querySelector('a');
            if (a && a.href) linkUrl = a.href;
        }

        if (!linkUrl) {
            const parentRow = targetIcon.closest('li, .v-row, .article-wrapper, .board-list-item');
            if (parentRow) {
                const backup = parentRow.querySelector('a.title, a.article-link, a[href*="/w/"], a[href*="/board/"]');
                if (backup && backup.href) linkUrl = backup.href;
            }
        }

        if (!linkUrl) {
            linkUrl = location.href;
        }

        if (!linkUrl) {
            showToast('링크를 찾을 수 없습니다.');
            return;
        }

        writeTextToClipboard(linkUrl)
            .then(() => {
                showToast('게시글 주소가 복사되었습니다.');
            })
            .catch((err) => {
                console.error('클립보드 복사 실패:', err);
                showToast('클립보드에 복사할 수 없습니다.');
            });
    }, true);
})();
