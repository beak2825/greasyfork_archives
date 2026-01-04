// ==UserScript==
// @name         Lolz Chat Manager
// @namespace    http://tampermonkey.net/
// @version      3.19
// @description  Easy dell chats for lolzik (update)
// @author       MARYXANAX
// @license      MIT
// @match        https://lolz.live/conversations*
// @match        https://lzt.market/conversations*
// @match        https://zelenka.guru/conversations*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560671/Lolz%20Chat%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/560671/Lolz%20Chat%20Manager.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const currentHost = window.location.origin;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function getChatWord(n) {
        n = Math.abs(n) % 100;
        let n1 = n % 10;
        if (n > 10 && n < 20) return 'чатов';
        if (n1 > 1 && n1 < 5) return 'чата';
        if (n1 == 1) return 'чат';
        return 'чатов';
    }

    function showLolzToast(htmlContent) {
        const toast = document.createElement('div');
        toast.className = 'lolz-toast';
        toast.innerHTML = `<div class="lolz-toast-content">${htmlContent}</div>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('is-visible'), 50);
        setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    const styles = `
        .conversationItem {
            position: relative !important;
            overflow: hidden !important;
            transition: padding-right 0.3s ease, background-color 0.3s ease, border-left 0.3s ease !important;
            padding-right: 10px !important;
            border-left: 0 solid #2ecc71 !important;
        }

        .conversationItem:not(.starred):hover, .conversationItem.has-checked-box { padding-right: 50px !important; }
        .conversationItem.has-checked-box { background-color: rgba(46, 204, 113, 0.07) !important; border-left: 4px solid #2ecc71 !important; }

        .bulk-check-container {
            position: absolute; top: 0; right: -50px; width: 45px; height: 100%;
            display: flex; align-items: center; justify-content: center; z-index: 200;
            transition: right 0.3s ease; background: rgba(34, 34, 34, 0.7) !important;
            backdrop-filter: blur(8px); border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        .conversationItem.starred .bulk-check-container { display: none !important; }
        .conversationItem:not(.starred):hover .bulk-check-container, .conversationItem.has-checked-box .bulk-check-container { right: 0 !important; }

        .bulk-check { width: 17px; height: 17px; cursor: pointer; accent-color: #2ecc71; }
        .quick-leave-btn {
            position: absolute; top: 0; left: 0; width: 18px; height: 18px;
            background: #e74c3c; color: white; display: flex; align-items: center;
            justify-content: center; cursor: pointer; font-size: 14px; z-index: 1000;
            border-bottom-right-radius: 6px; opacity: 0; transform: scale(0.3); transition: all 0.2s ease;
        }

        .conversationItem:not(.starred):hover .quick-leave-btn { opacity: 1; transform: scale(1); }

        .lolz-toast { position: fixed; bottom: 30px; left: 30px; z-index: 20000; transform: translateX(-120%); transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
        .lolz-toast.is-visible { transform: translateX(0); }
        .lolz-toast-content { background: #222; border: 1px solid #3d3d3d; color: #efefef; padding: 12px 25px; border-radius: 4px; border-left: 4px solid #2ecc71; box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-size: 14px; display: flex; align-items: center; gap: 5px; }
        .lolz-toast-content .username, .lolz-toast-content .username * { font-weight: bold !important; }
        #bulk-mgmt-bar {
            position: fixed; bottom: -80px; left: 50%; transform: translateX(-50%);
            background: #1a1a1a; border: 1px solid #3d3d3d; padding: 8px 20px; border-radius: 20px 20px 0 0;
            box-shadow: 0 -5px 20px rgba(0,0,0,0.7); transition: 0.4s; z-index: 10000;
            display: flex; align-items: center; gap: 12px; color: #efefef; font-size: 13px;
        }
        #bulk-mgmt-bar.active { bottom: 0; }
        .bulk-btn { border: none; color: white; padding: 6px 14px; border-radius: 15px; cursor: pointer; font-weight: 600; font-size: 12px; }
        .bulk-del-btn { background: #e74c3c; }
        .bulk-select-all { background: #34495e; }
        .bulk-counter-badge { background: #2ecc71; color: #000; padding: 1px 6px; border-radius: 8px; font-weight: 800; }
        .telegram-delete-anim { animation: fadeAway 0.5s forwards; }
        @keyframes fadeAway { 100% { opacity: 0; transform: scale(0.9); max-height: 0; padding: 0; margin: 0; } }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const bar = document.createElement('div');
    bar.id = 'bulk-mgmt-bar';
    bar.innerHTML = `
        <button class="bulk-btn bulk-select-all" id="bulk-all">Выбрать все</button>
        <span>Выбрано: <span class="bulk-counter-badge" id="bulk-count">0</span></span>
        <button class="bulk-btn bulk-del-btn" id="bulk-execute">Удалить</button>
    `;
    document.body.appendChild(bar);

    async function leaveConversation(id) {
        return new Promise((resolve) => {
            const token = document.querySelector('input[name="_xfToken"]')?.value || window._xfToken;
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${currentHost}/conversations/${id}/leave`, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        const el = document.getElementById(`conversation-${id}`);
                        if (el) { el.classList.add('telegram-delete-anim'); setTimeout(() => el.remove(), 500); }
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            };
            xhr.send(`_xfToken=${encodeURIComponent(token)}&_xfConfirm=1&delete_type=delete&save=${encodeURIComponent('Покинуть переписку')}`);
        });
    }

    const pendingMsg = sessionStorage.getItem('lolz_pending_toast');
    if (pendingMsg) { showLolzToast(pendingMsg); sessionStorage.removeItem('lolz_pending_toast'); }

    if (window.location.hash.startsWith('#delete-')) {
        const idToDelete = window.location.hash.replace('#delete-', '');
        leaveConversation(idToDelete).then(() => { history.replaceState(null, null, window.location.pathname); });
    }

    function injectTools() {
        document.querySelectorAll('.conversationItem').forEach(item => {

            if (item.classList.contains('starred') || item.innerText.includes('Избранное') || item.querySelector('.bulk-check-container')) return;

            const cid = item.id.replace('conversation-', '');
            const nameContainer = item.querySelector('.username');
            let nickHTML = "пользователем";
            if (nameContainer) {
                const clone = nameContainer.cloneNode(true);
                clone.querySelectorAll('.conversation_muted_icon').forEach(el => el.remove());
                nickHTML = `<div class="username" style="display:inline-block; vertical-align:bottom; font-weight: bold !important;">${clone.innerHTML}</div>`;
            }
            const xBtn = document.createElement('div');
            xBtn.className = 'quick-leave-btn';
            xBtn.innerHTML = '×';
            xBtn.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Удалить чат?`)) {
                    const toastMsg = `Удалён чат с ${nickHTML}`;
                    if (window.location.pathname.includes('/conversations/' + cid)) {
                        sessionStorage.setItem('lolz_pending_toast', toastMsg);
                        window.location.href = `${currentHost}/conversations/#delete-${cid}`;
                    } else {
                        leaveConversation(cid).then((res) => { if(res) showLolzToast(toastMsg); });
                    }
                }
            };
            item.appendChild(xBtn);
            const checkWrap = document.createElement('div');
            checkWrap.className = 'bulk-check-container';
            const chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.className = 'bulk-check';
            chk.dataset.id = cid;
            chk.onchange = () => {
                item.classList.toggle('has-checked-box', chk.checked);
                const count = document.querySelectorAll('.bulk-check:checked').length;
                document.getElementById('bulk-count').innerText = count;
                bar.classList.toggle('active', count > 0);
            };
            chk.onclick = (e) => e.stopPropagation();
            checkWrap.appendChild(chk);
            item.appendChild(checkWrap);
        });
    }

    document.getElementById('bulk-all').onclick = () => {

        const checks = document.querySelectorAll('.conversationItem:not(.starred) .bulk-check');
        const any = Array.from(checks).some(c => !c.checked);
        checks.forEach(c => {
            c.checked = any;
            c.closest('.conversationItem').classList.toggle('has-checked-box', any);
            c.dispatchEvent(new Event('change'));
        });
    };

    document.getElementById('bulk-execute').onclick = async () => {
        const checked = Array.from(document.querySelectorAll('.bulk-check:checked'));
        const count = checked.length;
        if (confirm(`Удалить ${count} ${getChatWord(count)}?`)) {
            bar.style.opacity = '0.5';
            let currentChatId = null;
            const dynamicSleep = count > 30 ? 750 : 450;

            for (let chk of checked) {
                const id = chk.dataset.id;
                if (window.location.pathname.includes('/conversations/' + id)) { currentChatId = id; }
                else {
                    await leaveConversation(id);
                    await sleep(dynamicSleep);
                }
            }
            const bulkMsg = `Вы удалили <b>${count}</b> ${getChatWord(count)}`;
            if (currentChatId) {
                sessionStorage.setItem('lolz_pending_toast', bulkMsg);
                window.location.href = `${currentHost}/conversations/#delete-${currentChatId}`;
            } else {
                showLolzToast(bulkMsg);
                bar.style.opacity = '1';
                document.querySelectorAll('.bulk-check').forEach(c => {
                    c.checked = false;
                    c.closest('.conversationItem').classList.remove('has-checked-box');
                });
                bar.classList.remove('active');
            }
        }
    };

    injectTools();
    new MutationObserver(injectTools).observe(document.body, { childList: true, subtree: true });
})();