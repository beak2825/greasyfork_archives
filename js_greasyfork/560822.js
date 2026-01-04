// ==UserScript==
// @name         Lolz Chat Manager (Cancel funcs)
// @namespace    http://tampermonkey.net/
// @version      3.19.1
// @description  Система отмены удаления диалога(ов)
// @author       MARYXANAX
// @license      MIT
// @match        https://lolz.live/conversations*
// @match        https://lzt.market/conversations*
// @match        https://zelenka.guru/conversations*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560822/Lolz%20Chat%20Manager%20%28Cancel%20funcs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560822/Lolz%20Chat%20Manager%20%28Cancel%20funcs%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHost = window.location.origin;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let activeTimers = {};

    function getChatWord(n) {
        n = Math.abs(n) % 100;
        let n1 = n % 10;
        if (n > 10 && n < 20) return 'чатов';
        if (n1 > 1 && n1 < 5) return 'чата';
        if (n1 == 1) return 'чат';
        return 'чатов';
    }

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
                    } else { resolve(false); }
                }
            };
            xhr.send(`_xfToken=${encodeURIComponent(token)}&_xfConfirm=1&delete_type=delete&save=${encodeURIComponent('Покинуть переписку')}`);
        });
    }

    function showUndoToast(ids, line1HTML, onConfirm) {
        let container = document.getElementById('lolz-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'lolz-toast-container';
            document.body.appendChild(container);
        }

        const toastId = Date.now();
        const toast = document.createElement('div');
        toast.className = 'lolz-toast-item';
        let timeLeft = 5;

        toast.innerHTML = `
            <div class="lolz-toast-content">
                <div class="toast-text-wrap">
                    <div class="toast-line-1">${line1HTML}</div>
                    <div class="toast-line-2">будет удалено через <span id="timer-${toastId}">${timeLeft}</span>с.</div>
                </div>
                <div class="undo-wrap"><button class="undo-btn" id="undo-${toastId}">ОТМЕНА</button></div>
            </div>
            <div class="toast-progress"><div class="toast-progress-bar"></div></div>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('is-visible'), 10);

        const countdown = setInterval(() => {
            timeLeft--;
            const tEl = document.getElementById(`timer-${toastId}`);
            if (tEl) tEl.innerText = timeLeft;
            if (timeLeft <= 0) clearInterval(countdown);
        }, 1000);

        const cancelAction = () => {
            clearInterval(countdown);
            clearTimeout(activeTimers[toastId]);
            ids.forEach(id => {
                const el = document.getElementById(`conversation-${id}`);
                if (el) { el.style.display = ""; setTimeout(() => { el.style.opacity = "1"; el.classList.remove('telegram-delete-anim'); }, 10); }
            });
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 400);
        };

        document.getElementById(`undo-${toastId}`).onclick = cancelAction;

        activeTimers[toastId] = setTimeout(() => {
            onConfirm();
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    }

    const styles = `
        .conversationItem { position: relative !important; overflow: hidden !important; transition: padding-right 0.3s ease, background-color 0.3s ease, border-left 0.3s ease !important; padding-right: 10px !important; border-left: 0 solid #2ecc71 !important; }
        .conversationItem:not(.starred):hover, .conversationItem.has-checked-box { padding-right: 50px !important; }
        .conversationItem.has-checked-box { background-color: rgba(46, 204, 113, 0.07) !important; border-left: 4px solid #2ecc71 !important; }
        .bulk-check-container { position: absolute; top: 0; right: -50px; width: 45px; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 200; transition: right 0.3s ease; background: rgba(34, 34, 34, 0.7) !important; backdrop-filter: blur(8px); border-left: 1px solid rgba(255, 255, 255, 0.1); }
        .conversationItem:not(.starred):hover .bulk-check-container, .conversationItem.has-checked-box .bulk-check-container { right: 0 !important; }
        .bulk-check { width: 17px; height: 17px; cursor: pointer; accent-color: #2ecc71; }
        .quick-leave-btn { position: absolute; top: 0; left: 0; width: 18px; height: 18px; background: #e74c3c; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; z-index: 1000; border-bottom-right-radius: 6px; opacity: 0; transform: scale(0.3); transition: all 0.2s ease; }
        .conversationItem:not(.starred):hover .quick-leave-btn { opacity: 1; transform: scale(1); }
        .telegram-delete-anim { animation: fadeAway 0.5s forwards; }
        @keyframes fadeAway { 100% { opacity: 0; transform: scale(0.9); max-height: 0; padding: 0; margin: 0; } }

        #lolz-toast-container { position: fixed; bottom: 30px; left: 30px; display: flex; flex-direction: column-reverse; gap: 10px; z-index: 20000; pointer-events: none; }
        .lolz-toast-item { pointer-events: auto; transform: translateX(-120%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); background: #1a1a1a; border: 1px solid #383838; border-radius: 8px; overflow: hidden; width: 330px; box-shadow: 0 8px 25px rgba(0,0,0,0.7); border-left: 4px solid #2ecc71; }
        .lolz-toast-item.is-visible { transform: translateX(0); }
        .lolz-toast-content { padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .toast-text-wrap { display: flex; flex-direction: column; flex: 1; min-width: 0; }

        .toast-line-1 { color: #fff; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
        .toast-line-1 .username { font-weight: bold !important; display: inline !important; }
        .toast-line-1 .username * { font-weight: bold !important; display: inline !important; }

        .toast-line-2 { color: #999; font-size: 12px; white-space: nowrap; margin-top: 2px; }
        .undo-btn { background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid #2ecc71; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 10px; text-transform: uppercase; flex-shrink: 0; }
        .toast-progress-bar { height: 3px; background: #2ecc71; width: 100%; animation: t-line 5s linear forwards; }
        @keyframes t-line { from { width: 100%; } to { width: 0%; } }

        #bulk-mgmt-bar { position: fixed; bottom: -80px; left: 50%; transform: translateX(-50%); background: #1a1a1a; border: 1px solid #3d3d3d; padding: 8px 20px; border-radius: 20px 20px 0 0; box-shadow: 0 -5px 20px rgba(0,0,0,0.7); transition: 0.4s; z-index: 10000; display: flex; align-items: center; gap: 12px; color: #efefef; font-size: 13px; }
        #bulk-mgmt-bar.active { bottom: 0; }
        .bulk-btn { border: none; color: white; padding: 6px 14px; border-radius: 15px; cursor: pointer; font-weight: 600; font-size: 12px; }
        .bulk-del-btn { background: #e74c3c; }
        .bulk-select-all { background: #34495e; }
        .bulk-counter-badge { background: #2ecc71; color: #000; padding: 1px 6px; border-radius: 8px; font-weight: 800; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const bar = document.createElement('div');
    bar.id = 'bulk-mgmt-bar';
    bar.innerHTML = `<button class="bulk-btn bulk-select-all" id="bulk-all">Выбрать все</button><span>Выбрано: <span class="bulk-counter-badge" id="bulk-count">0</span></span><button class="bulk-btn bulk-del-btn" id="bulk-execute">Удалить</button>`;
    document.body.appendChild(bar);

    function injectTools() {
        document.querySelectorAll('.conversationItem').forEach(item => {
            if (item.classList.contains('starred') || item.innerText.includes('Избранное') || item.querySelector('.bulk-check-container')) return;
            const cid = item.id.replace('conversation-', '');

            const xBtn = document.createElement('div');
            xBtn.className = 'quick-leave-btn'; xBtn.innerHTML = '×';
            xBtn.onclick = (e) => {
                e.stopPropagation();
                const nameContainer = item.querySelector('.username');
                let nickHTML = "пользователем";

                if (nameContainer) {
                    const clone = nameContainer.cloneNode(true);

                    clone.querySelectorAll('.conversation_muted_icon').forEach(el => el.remove());
                    nickHTML = `<span class="username">${clone.innerHTML}</span>`;
                }

                item.style.opacity = "0.3";
                showUndoToast([cid], `Чат с ${nickHTML}`, async () => {
                    if (window.location.pathname.includes('/conversations/' + cid)) {
                        sessionStorage.setItem('lolz_pending_toast', `Удалён чат с ${nickHTML}`);
                        window.location.href = `${currentHost}/conversations/#delete-${cid}`;
                    } else {
                        await leaveConversation(cid);
                    }
                });
            };
            item.appendChild(xBtn);

            const checkWrap = document.createElement('div');
            checkWrap.className = 'bulk-check-container';
            const chk = document.createElement('input');
            chk.type = 'checkbox'; chk.className = 'bulk-check'; chk.dataset.id = cid;
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
        checks.forEach(c => { c.checked = any; c.dispatchEvent(new Event('change')); });
    };

    document.getElementById('bulk-execute').onclick = () => {
        const checked = Array.from(document.querySelectorAll('.bulk-check:checked'));
        const count = checked.length;
        const ids = checked.map(c => c.dataset.id);

        checked.forEach(c => c.closest('.conversationItem').style.opacity = "0.3");

        showUndoToast(ids, `Будет удалено ${count} ${getChatWord(count)}`, async () => {
            bar.style.opacity = '0.5';
            let currentChatId = null;
            for (let id of ids) {
                if (window.location.pathname.includes('/conversations/' + id)) { currentChatId = id; }
                else { await leaveConversation(id); await sleep(450); }
            }
            if (currentChatId) {
                sessionStorage.setItem('lolz_pending_toast', `Удалено ${count} ${getChatWord(count)}`);
                window.location.href = `${currentHost}/conversations/#delete-${currentChatId}`;
            }
            bar.style.opacity = '1'; bar.classList.remove('active');
        });
    };

    if (window.location.hash.startsWith('#delete-')) {
        const idToDelete = window.location.hash.replace('#delete-', '');
        leaveConversation(idToDelete).then(() => { history.replaceState(null, null, window.location.pathname); });
    }

    const pendingMsg = sessionStorage.getItem('lolz_pending_toast');
    if (pendingMsg) {
        let c = document.getElementById('lolz-toast-container') || document.createElement('div');
        c.id = 'lolz-toast-container'; document.body.appendChild(c);
        let t = document.createElement('div'); t.className = 'lolz-toast-item is-visible';
        t.innerHTML = `<div class="lolz-toast-content">${pendingMsg}</div>`;
        c.appendChild(t); setTimeout(() => t.remove(), 3000);
        sessionStorage.removeItem('lolz_pending_toast');
    }

    injectTools();
    new MutationObserver(injectTools).observe(document.body, { childList: true, subtree: true });
})();