// ==UserScript==
// @name         Torn Chat Templates
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add customizable text templates to Torn chat
// @author       ShAdOwCrEsT [3929345]
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553357/Torn%20Chat%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/553357/Torn%20Chat%20Templates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultTemplates = [
        "Template 1 ",
        "Template 2",
        "Hope u love it. For any help or custom scripts reach out to ShAdOwCrEsT [3929345]"
    ];

    let templates = [];
    for (let i = 0; i < 3; i++) {
        templates[i] = GM_getValue(`template_${i}`, defaultTemplates[i]);
    }

    const style = document.createElement('style');
    style.textContent = `
        .template-button {
            position: absolute;
            right: 10px;
            bottom: 10px;
            width: 24px;
            height: 32px;
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            z-index: 1000;
            transition: background-color 0.2s;
        }

        .template-button:hover {
            background-color: #5a6268;
        }

        .template-dropdown {
            position: absolute;
            bottom: 45px;
            right: 10px;
            background: #1a1a1a;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><text x="150" y="100" font-family="Arial Black, sans-serif" font-size="24" font-weight="bold" fill="%23ffffff" opacity="0.03" text-anchor="middle" dominant-baseline="middle" letter-spacing="2">ShAdOwCrEsT</text><text x="150" y="130" font-family="Arial, sans-serif" font-size="16" fill="%23ffffff" opacity="0.03" text-anchor="middle" dominant-baseline="middle">[3929345]</text></svg>');
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            border: 1px solid #333;
            border-radius: 4px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            min-width: 250px;
            max-width: 400px;
            z-index: 1001;
            display: none;
        }

        .template-dropdown.show {
            display: block;
        }

        .template-item {
            padding: 10px;
            border-bottom: 1px solid #333;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .template-item:last-child {
            border-bottom: none;
        }

        .template-item:hover {
            background-color: #2a2a2a;
        }

        .template-text {
            color: #e0e0e0;
            font-size: 13px;
            margin-bottom: 5px;
            word-wrap: break-word;
        }

        .template-actions {
            display: flex;
            gap: 5px;
        }

        .template-btn {
            padding: 3px 8px;
            font-size: 11px;
            border: none;
            background: #2a2a2a;
            color: #e0e0e0;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .template-btn:hover {
            background-color: #3a3a3a;
        }

        .template-edit-area {
            width: 100%;
            padding: 5px;
            margin-top: 5px;
            border: none;
            background: #2a2a2a;
            color: #e0e0e0;
            border-radius: 3px;
            font-size: 12px;
            resize: vertical;
            min-height: 60px;
            outline: none;
        }
    `;
    document.head.appendChild(style);

    function initTemplateButton() {
        const textareas = document.querySelectorAll('.textarea___V8HsV');

        textareas.forEach(textarea => {
            const parent = textarea.parentElement;
            if (!parent) return;

            if (parent.querySelector('.template-button')) return;

            if (window.getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }

            const button = document.createElement('button');
            button.className = 'template-button';
            button.textContent = 'T';
            button.type = 'button';

            const dropdown = document.createElement('div');
            dropdown.className = 'template-dropdown';

            templates.forEach((template, index) => {
                const item = createTemplateItem(template, index, dropdown, textarea);
                dropdown.appendChild(item);
            });

            button.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && e.target !== button) {
                    dropdown.classList.remove('show');
                }
            });

            parent.appendChild(button);
            parent.appendChild(dropdown);
        });
    }

    function createTemplateItem(template, index, dropdown, textarea) {
        const item = document.createElement('div');
        item.className = 'template-item';

        const textDiv = document.createElement('div');
        textDiv.className = 'template-text';
        textDiv.textContent = template;

        const actions = document.createElement('div');
        actions.className = 'template-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'template-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showEditMode(item, template, index, dropdown, textarea);
        });

        actions.appendChild(editBtn);

        item.appendChild(textDiv);
        item.appendChild(actions);

        item.addEventListener('click', (e) => {
            if (e.target !== editBtn) {
                textarea.value = template;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.focus();
                dropdown.classList.remove('show');
            }
        });

        return item;
    }

    function showEditMode(item, template, index, dropdown, textarea) {
        item.innerHTML = '';

        const editArea = document.createElement('textarea');
        editArea.className = 'template-edit-area';
        editArea.value = template;

        editArea.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        const actions = document.createElement('div');
        actions.className = 'template-actions';
        actions.style.marginTop = '5px';

        actions.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        const saveBtn = document.createElement('button');
        saveBtn.className = 'template-btn';
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newTemplate = editArea.value.trim();
            if (newTemplate) {
                templates[index] = newTemplate;
                GM_setValue(`template_${index}`, newTemplate);

                dropdown.innerHTML = '';
                templates.forEach((t, i) => {
                    const newItem = createTemplateItem(t, i, dropdown, textarea);
                    dropdown.appendChild(newItem);
                });
            }
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'template-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newItem = createTemplateItem(template, index, dropdown, textarea);
            item.replaceWith(newItem);
        });

        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);

        item.appendChild(editArea);
        item.appendChild(actions);
        editArea.focus();
    }

    initTemplateButton();

    const observer = new MutationObserver(() => {
        initTemplateButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(() => {
        initTemplateButton();
    }, 1000);
})();