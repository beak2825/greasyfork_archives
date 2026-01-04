// ==UserScript==
// @name         BookRoll Memo Count Badge
// @namespace    https://bookroll.org.tw/
// @version      1.0.1
// @description  Show the number of memos in the BookRoll memo popup header.
// @author       a stupid cs student
// @match        *://bookroll.org.tw/book/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557401/BookRoll%20Memo%20Count%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/557401/BookRoll%20Memo%20Count%20Badge.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const POLL_INTERVAL = 300;
    const UPDATE_INTERVAL = 1500;
    const POPUP_SELECTORS = ['#popup7 .popup__head', '#popup-memo .popup__head_center'];
    let updateTimer = null;

    function waitForMemoData() {
        return new Promise((resolve) => {
            const check = () => {
                if (window.bookroll?.memo?.MemorandumData) {
                    resolve();
                } else {
                    setTimeout(check, POLL_INTERVAL);
                }
            };
            check();
        });
    }

    function ensureBadgeElement() {
        const popupHead = POPUP_SELECTORS.map((selector) => document.querySelector(selector)).find(Boolean);
        if (!popupHead) {
            return null;
        }
        let badge = popupHead.querySelector('.memo-count-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'memo-count-badge';
            badge.textContent = '筆記數：-';
            badge.style.cssText = [
                'margin-left:8px',
                'padding:2px 10px',
                'border-radius:999px',
                'background:rgba(0,0,0,0.08)',
                'font-size:12px',
                'font-weight:600',
                'color:#333',
                'display:inline-flex',
                'align-items:center',
                'justify-content:center'
            ].join(';');
            if (popupHead.firstElementChild) {
                popupHead.insertBefore(badge, popupHead.firstElementChild.nextSibling);
            } else {
                popupHead.appendChild(badge);
            }
        }
        return badge;
    }

    function getMemoCount() {
        const memoData = window.bookroll?.memo?.MemorandumData;
        if (!memoData) {
            return 0;
        }
        return Object.keys(memoData).length;
    }

    function updateBadge() {
        const badge = ensureBadgeElement();
        if (!badge) {
            return;
        }
        badge.textContent = `筆記數：${getMemoCount()}`;
    }

    function hookMemoActions() {
        const memoApi = window.bookroll?.memo;
        if (!memoApi) {
            return;
        }
        ['save', 'delete', 'load', 'display'].forEach((method) => {
            const original = memoApi[method];
            if (typeof original !== 'function' || original.__memoCountWrapped) {
                return;
            }
            const wrapped = function (...args) {
                const result = original.apply(this, args);
                queueMicrotask(updateBadge);
                return result;
            };
            wrapped.__memoCountWrapped = true;
            memoApi[method] = wrapped;
        });
    }

    function startUpdating() {
        if (updateTimer) {
            clearInterval(updateTimer);
        }
        updateBadge();
        updateTimer = setInterval(updateBadge, UPDATE_INTERVAL);
    }

    function init() {
        hookMemoActions();
        startUpdating();
    }

    waitForMemoData().then(init);
})();
