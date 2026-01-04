// ==UserScript==
// @name        Company Training Companion
// @namespace   kamiren.company-training-companion
// @match       https://www.torn.com/companies.php*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author      KamiRen [2805199] - https://www.torn.com/profiles.php?XID=2805199
// @version     1.0
// @grant       none
// @description Adds a properly aligned Paid Trains column that will help Directors track how many paid trains their employees have left.
// @downloadURL https://update.greasyfork.org/scripts/558987/Company%20Training%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/558987/Company%20Training%20Companion.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       MODEL
    ========================== */
    const SELECTORS = {
        header: 'ul.employee-list-title.bold',
        headerColumn: 'ul.employee-list-title.bold li.paid-trains',
        employeeListWrap: '.employee-list-wrap',
        employees:
            '#employees > form > div.employee-list-wrap > ul.employee-list.t-blue-cont.h > li[data-user]',
        trainButtons: '.employee-list .train a',
    };

    function getEmployeeId(emp) {
        return emp.getAttribute('data-user');
    }

    function getStoredValue(userId) {
        return localStorage.getItem(`paidTrains_${userId}`) ?? '0';
    }

    function setStoredValue(userId, value) {
        localStorage.setItem(`paidTrains_${userId}`, value);
    }

    /* =========================
       STYLE
    ========================== */
    function injectStyles() {
        if (document.getElementById('paid-trains-style')) return;

        const style = document.createElement('style');
        style.id = 'paid-trains-style';
        style.textContent = `
            .d .manage-company .employees .employee-list-title > li.paid-trains {
                width: 70px;
            }
            .d .manage-company .employees .employee-list .paid-trains {
                width: 70px;
                padding: 0 5px;
                margin-top: -1px;
                position: relative;
                float: left;
                height: 33px;
                line-height: 33px;
                border-left: 1px solid var(--default-panel-divider-inner-side-color);
                border-right: 1px solid var(--default-panel-divider-outer-side-color);
            }
            .d .manage-company .employees .employee-list .paid-trains input {
                width: 50px;
                line-height: 14px;
                padding: 4px 5px;
                margin-top: 4px;
                text-align: left;
            }
            .d .manage-company .employees .employee-list .paid-trains input.daily-train {
                color: #2b8a3e;
                font-weight: bold;
            }
            .d .manage-company .company-tabs > li a {
                width: 207.5px !important;
            }
            .d .company-wrap .company-stats-list > li {
                width: 294px !important;
            }
        `;
        document.head.appendChild(style);
    }

    /* =========================
       VIEW
    ========================== */
    function createHeaderColumn() {
        const header = document.querySelector(SELECTORS.header);
        if (!header || header.querySelector('.paid-trains')) return;

        const trainHeader = header.querySelector('li.train');
        if (!trainHeader) return;

        const li = document.createElement('li');
        li.className = 'paid-trains';
        li.textContent = 'Paid Trains';

        const delimiter = document.createElement('div');
        delimiter.className = 't-delimiter';

        li.appendChild(delimiter);
        header.insertBefore(li, trainHeader);
    }

    function createEmployeeColumn(emp) {
        const accBody = emp.querySelector('.acc-body');
        if (!accBody || accBody.querySelector('.paid-trains')) return;

        const train = accBody.querySelector('.train');
        if (!train) return;

        const userId = getEmployeeId(emp);

        const paidDiv = document.createElement('div');
        paidDiv.className = 'paid-trains';

        const delimiter = document.createElement('div');
        delimiter.className = 'r-delimiter white t-show';

        const input = document.createElement('input');
        input.type = 'text';
        input.size = '2';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.className = 'input-paid-trains';
        input.setAttribute('aria-label', 'Paid Trains');
        input.setAttribute('data-ignore', 'true');
        input.value = getStoredValue(userId);

        input.addEventListener('input', () => {
            let val = input.value;
            if (val === '-') return;
            if (!/^(-?\d*)$/.test(val)) {
                input.value = val.replace(/[^\d-]/g, '');
                return;
            }
            setStoredValue(userId, input.value || '0');
            updateDailyVisual(input);
        });

        paidDiv.appendChild(delimiter);
        paidDiv.appendChild(input);
        accBody.insertBefore(paidDiv, train);

        updateDailyVisual(input);
    }

    /* =========================
       TRAIN LOGIC
    ========================== */
    function decrementTrain(emp) {
        const userId = getEmployeeId(emp);
        let current = parseInt(getStoredValue(userId), 10) || 0;

        if (current > 0) {
            current--;
            setStoredValue(userId, String(current));
        }

        const input = emp.querySelector('.paid-trains input');
        if (input) {
            input.value = String(current);
            updateDailyVisual(input);
        }
    }

    function attachTrainListeners() {
        document.querySelectorAll(SELECTORS.trainButtons).forEach(btn => {
            if (btn.dataset.ptBound) return;
            btn.dataset.ptBound = '1';

            btn.addEventListener('click', () => {
                const emp = btn.closest('li[data-user]');
                if (emp) decrementTrain(emp);
            });
        });
    }

    function updateDailyVisual(input) {
        input.classList.toggle(
            'daily-train',
            parseInt(input.value, 10) < 0
        );
    }

    /* =========================
       SELF-HEAL (NO RELOAD)
    ========================== */
    function ensureHeaderColumn() {
        if (!document.querySelector(SELECTORS.headerColumn)) {
            createHeaderColumn();
        }
    }

    function ensureEmployeeColumns() {
        document.querySelectorAll(SELECTORS.employees).forEach(emp => {
            if (!emp.querySelector('.paid-trains')) {
                createEmployeeColumn(emp);
            }
        });
    }

    /* =========================
       LAYOUT
    ========================== */
    function resizeLayout() {
        const mainContainer = document.querySelector('#mainContainer');
        if (mainContainer) mainContainer.style.width = '1070px';
    }

    /* =========================
       INIT
    ========================== */
    function init() {
        injectStyles();
        resizeLayout();
        ensureHeaderColumn();
        ensureEmployeeColumns();
        attachTrainListeners();
    }

    let initPending = false;
    function safeInit() {
        if (initPending) return;
        initPending = true;
        requestAnimationFrame(() => {
            initPending = false;
            init();
        });
    }

    /* =========================
       OBSERVER (ADAPTED TO YOUR PATTERN)
    ========================== */
    function createObserver(element) {
        let target;
        target = element;

        if (!target) {
            console.error(`[PT] Mutation Observer target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            // We don't care *what* changed; we care if Torn removed our stuff.
            // If header/columns are missing after an update -> repair.
            let headerExists = !!document.querySelector(SELECTORS.headerColumn);

            if (!headerExists) {
                safeInit();
                return;
            }

            // If header exists but some rows lost the column, repair as well.
            // (This is cheap; ensureEmployeeColumns() has guards.)
            // Also re-bind train buttons in case Torn re-rendered them.
            for (let mutation of mutationsList) {
                if (
                    mutation.type === 'childList' ||
                    mutation.type === 'subtree' ||
                    mutation.type === 'characterData' ||
                    mutation.type === 'attributes'
                ) {
                    ensureEmployeeColumns();
                    attachTrainListeners();
                    break;
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    function observeEmployeeList() {
        // Pick a stable parent that survives Submit Changes / rerenders.
        // #employees is usually stable; fallback to the manage-company root.
        const target =
            document.querySelector('#employees') ||
            document.querySelector('.manage-company') ||
            document.querySelector(SELECTORS.employeeListWrap);

        createObserver(target);
    }

    /* =========================
       BOOTSTRAP
    ========================== */
    const interval = setInterval(() => {
        if (document.querySelector(SELECTORS.header)) {
            safeInit();
            observeEmployeeList();
            clearInterval(interval);
        }
    }, 300);
})();