// ==UserScript==
// @name         LinkedIn Notifications Bulk Delete
// @name:ru      LinkedIn: Массовое удаление уведомлений
// @version      1.0
// @description  Bulk delete LinkedIn notifications
// @description:ru Массовое удаление уведомлений в LinkedIn
// @author       DayDve
// @match        https://www.linkedin.com/notifications/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// @license      MIT
// @keywords     linkedin, notifications, delete, bulk
// @namespace https://greasyfork.org/users/1549348
// @downloadURL https://update.greasyfork.org/scripts/559378/LinkedIn%20Notifications%20Bulk%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/559378/LinkedIn%20Notifications%20Bulk%20Delete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setupElement(tagName, options = {}, style = {}) {
        const element = tagName instanceof Element ? tagName : document.createElement(tagName);
        Object.assign(element, options);
        Object.assign(element.style, style);
        return element;
    }

    const deleteFunc = (chk) => {
        const wrapper = chk.closest('div[data-finite-scroll-hotkey-item]');
        if (!wrapper) return;

        const pTags = wrapper.getElementsByClassName('nt-card-settings-dropdown-item__headline');
        const searchText = "Delete notification";

        for (let i = 0; i < pTags.length; i++) {
            if (pTags[i].textContent.includes(searchText)) {
                pTags[i].click(); 
                
                setupElement(wrapper, {}, {
                    transition: 'all 0.4s ease',
                    opacity: '0',
                    height: '0',
                    margin: '0',
                    padding: '0',
                    overflow: 'hidden'
                });
                
                setTimeout(() => wrapper.remove(), 400);
                break;
            }
        }
    };

    const updateButtonState = () => {
        const btn = document.getElementById('btn-delete-selected');
        if (!btn) return;
        const selectedCount = document.querySelectorAll('.nt-bulk-custom-check.is-checked').length;
        
        if (selectedCount > 0) {
            btn.disabled = false;
            setupElement(btn, {}, { opacity: '1', cursor: 'pointer' });
        } else {
            btn.disabled = true;
            setupElement(btn, {}, { opacity: '0.5', cursor: 'not-allowed' });
        }
    };

    const injectInterface = () => {
        if (document.getElementById('bulk-delete-panel')) return;
        const target = document.querySelector('.scaffold-finite-scroll__content');
        if (!target) return;

        const panel = setupElement('div', { id: 'bulk-delete-panel' }, {
            padding: '15px',
            background: '#fff',
            borderBottom: '1px solid #dcdcdc',
            display: 'flex',
            gap: '12px',
            position: 'sticky',
            top: '0',
            zIndex: '20000',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        });
        
        const btnDeleteSelected = setupElement('button', {
            id: 'btn-delete-selected',
            innerText: 'Delete Selected',
            disabled: true
        }, {
            background: '#0a66c2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '16px',
            fontWeight: '600',
            opacity: '0.5',
            cursor: 'not-allowed',
            transition: 'opacity 0.2s'
        });
        
        btnDeleteSelected.onclick = () => {
            document.querySelectorAll('.nt-bulk-custom-check.is-checked').forEach(chk => deleteFunc(chk));
            setTimeout(updateButtonState, 500);
        };

        const btnDeleteAll = setupElement('button', {
            id: 'btn-delete-all',
            innerText: 'Delete All'
        }, {
            background: '#fff',
            color: '#cc1016',
            border: '1px solid #cc1016',
            padding: '8px 16px',
            borderRadius: '16px',
            fontWeight: '600',
            cursor: 'pointer'
        });

        btnDeleteAll.onclick = () => {
            if (!confirm('Delete all visible notifications?')) return;
            document.querySelectorAll('.nt-bulk-custom-check').forEach(chk => deleteFunc(chk));
            setTimeout(updateButtonState, 500);
        };

        panel.appendChild(btnDeleteSelected);
        panel.appendChild(btnDeleteAll);
        target.prepend(panel);
    };

    const addCheckboxes = () => {
        const wrappers = document.querySelectorAll('div[data-finite-scroll-hotkey-item]:not(.bulk-processed)');
        wrappers.forEach(wrapper => {
            const card = wrapper.querySelector('article.nt-card');
            if (!card) return;

            const chk = setupElement('div', { className: 'nt-bulk-custom-check' }, {
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: '1000',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                border: '2px solid #0a66c2',
                background: 'white',
                borderRadius: '4px',
                pointerEvents: 'all',
                boxSizing: 'border-box'
            });

            chk.onclick = (e) => {
                e.preventDefault(); 
                e.stopPropagation();
                const isChecked = chk.classList.toggle('is-checked');
                chk.style.background = isChecked ? '#0a66c2' : 'white';
                updateButtonState();
            };

            wrapper.style.position = 'relative';
            card.style.marginLeft = '45px'; 
            wrapper.prepend(chk);
            wrapper.classList.add('bulk-processed');
        });
    };

    const observer = new MutationObserver(() => {
        injectInterface();
        addCheckboxes();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
