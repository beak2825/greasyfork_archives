// ==UserScript==
// @name         Aternos All In One (No Auto Start)
// @namespace    heyxferdi Scripts (modified)
// @version      1.1
// @description  Adblock, Auto Confirm Queue, Auto Extend server time. ĐÃ TẮT Auto Start theo yêu cầu. Credits gốc: heyxferdi & MITEBOSS.
// @author       heyxferdi (modified by Grok)
// @license      MIT
// @match        https://aternos.org/*
// @icon         https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/c7/Grass_Block.png/revision/latest?cb=20230226144250
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560751/Aternos%20All%20In%20One%20%28No%20Auto%20Start%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560751/Aternos%20All%20In%20One%20%28No%20Auto%20Start%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Chặn anti-adblock mạnh mẽ hơn (working 2025 style)
    let originalPush = unsafeWindow.Array.prototype.push;
    unsafeWindow.Array.prototype.push = function(...args) {
        try {
            throw new Error();
        } catch (e) {
            if (e.stack.includes("data:text/javascript")) {
                throw new Error(); // Block suspicious script
            }
            return originalPush.apply(this, args);
        }
    };

    let oldDateNow = Date.now;
    unsafeWindow.Date.now = function () {
        try {
            throw new Error();
        } catch (e) {
            if (e.stack.includes('data:text/javascript')) {
                throw new Error();
            } else {
                return oldDateNow();
            }
        }
    };

    // MutationObserver chính: theo dõi mọi thay đổi DOM → phản ứng nhanh mà nhẹ
    const mainObserver = new MutationObserver(() => {
        autoConfirmQueue();
        autoExtendTimer();
        autoExtendButton();
        dismissAlertNo();
        fixWhiteScreen();
    });

    mainObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'open']
    });

    // IntersectionObserver cho extend button (hiệu quả cao)
    const extendObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const btn = entry.target;
                if (btn.textContent.trim().toLowerCase() !== "stop") {
                    btn.click();
                }
                extendObserver.unobserve(btn);
            }
        });
    }, { threshold: 0.1 });

    function autoExtendButton() {
        const extendBtn = document.querySelector('.btn.btn-tiny.btn-success.server-extend-end');
        if (extendBtn) extendObserver.observe(extendBtn);
    }

    function autoExtendTimer() {
        const timer = document.querySelector('.server-end-countdown');
        if (timer && timer.textContent.trim() === '1:00') {
            const extendBtn = document.querySelector('.btn.btn-tiny.btn-success.server-extend-end');
            if (extendBtn && extendBtn.textContent.trim().toLowerCase() !== "stop") {
                extendBtn.click();
            }
        }
    }

    function autoConfirmQueue() {
        if (document.querySelector('.server-actions.queueing')) {
            const confirmBtn = document.querySelector('#confirm');
            if (confirmBtn && confirmBtn.offsetParent !== null) {
                confirmBtn.click();
            }
        }
    }

    function dismissAlertNo() {
        const alert = document.querySelector('dialog.alert.alert-danger[open]');
        if (alert) {
            const noBtn = alert.querySelector('.btn-danger');
            if (noBtn) noBtn.click();
        }
    }

    function fixWhiteScreen() {
        if (document.querySelector('.white-screen-element')) {
            location.reload();
        }
    }

    // Backup interval nhẹ (5 giây) để chắc chắn không miss
    setInterval(() => {
        autoConfirmQueue();
        autoExtendTimer();
        autoExtendButton();
        dismissAlertNo();
        fixWhiteScreen();
    }, 5000);

})();