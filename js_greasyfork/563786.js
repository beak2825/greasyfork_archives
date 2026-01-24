// ==UserScript==
// @name        YouTube Upload Templates
// @namespace   danielytuk/YTUPTEMP
// @version     1.0.1
// @description UploadTemplates let you save and switch between different templates - helping you quickly match each video's metadata to its content.
// @author      danielytuk
// @license     Unlicense
// @match       https://studio.youtube.com/*
// @homepageURL https://github.com/danielytuk/UserScripts
// @supportURL  https://github.com/danielytuk/UserScripts/Issues
// @icon        https://www.youtube.com/yts/img/favicon-vfl8qSV2F.ico
// @run-at      document-end
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/563786/YouTube%20Upload%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/563786/YouTube%20Upload%20Templates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======= Utility functions =======
    function waitForElement(selector) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            // Optionally timeout after a certain time
            setTimeout(() => {
                observer.disconnect();
                reject('Timeout waiting for element ' + selector);
            }, 15000);
        });
    }

    function createButton(text, className) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = className;
        btn.style = `
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 6px 12px;
            font-weight: 500;
            cursor: pointer;
            font-size: 13px;
            transition: background-color 0.2s ease-in-out;
        `;
        btn.onmouseover = () => btn.style.backgroundColor = '#1669c1';
        btn.onmouseout = () => btn.style.backgroundColor = '#1a73e8';
        return btn;
    }

    function createFormInput(labelText, id, type = 'text') {
        const wrapper = document.createElement('div');
        wrapper.style = 'margin-bottom: 8px; text-align: left;';
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;
        label.style = 'display: block; font-weight: 600; margin-bottom: 4px; font-size: 14px;';
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.style = 'width: 100%; padding: 6px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;';
        wrapper.append(label, input);
        return wrapper;
    }

    function createFormTextarea(labelText, id) {
        const wrapper = document.createElement('div');
        wrapper.style = 'margin-bottom: 8px; text-align: left;';
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;
        label.style = 'display: block; font-weight: 600; margin-bottom: 4px; font-size: 14px;';
        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.rows = 6;
        textarea.style = 'width: 100%; padding: 6px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;';
        wrapper.append(label, textarea);
        return wrapper;
    }

    // ======= Template storage and loading =======
    function loadTemplates() {
        const stored = GM_getValue('ytTemplates', '{}');
        try {
            return JSON.parse(stored);
        } catch {
            return {};
        }
    }

    function saveTemplates(templates) {
        GM_setValue('ytTemplates', JSON.stringify(templates));
    }

    // ======= Apply template to description =======
    function applyTemplate() {
        const select = document.getElementById('template-selector');
        if (!select) return;

        const templates = loadTemplates();
        const name = select.value;
        if (!name || !templates[name]) return;

        const desc = templates[name].description;
        // Find YouTube description textarea in Studio
        const descBox = document.querySelector('ytcp-mention-textbox#description-container textarea');
        if (!descBox) {
            alertModal('YouTube description textarea not found.');
            return;
        }
        descBox.value = desc;
        descBox.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // ======= Populate dropdown with templates and select last used =======
    let lastSelectedTemplate = GM_getValue('lastSelectedTemplate', '');

    function populateTemplates(select) {
        select.innerHTML = '';
        const templates = loadTemplates();
        const names = Object.keys(templates);
        if (names.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No templates saved';
            option.disabled = true;
            select.appendChild(option);
            document.getElementById('apply-btn').disabled = true;
            document.getElementById('edit-btn').setAttribute('disabled', 'true');
            document.getElementById('delete-btn').setAttribute('disabled', 'true');
            return;
        }
        names.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
        if (names.includes(lastSelectedTemplate)) {
            select.value = lastSelectedTemplate;
        } else {
            select.selectedIndex = 0;
            lastSelectedTemplate = select.value;
        }
        document.getElementById('apply-btn').disabled = false;
        document.getElementById('edit-btn').removeAttribute('disabled');
        document.getElementById('delete-btn').removeAttribute('disabled');
    }

    // ======= Create UI dropdown + buttons =======
    async function createTemplateDropdown() {
        if (document.getElementById('template-container')) return;

        const parent = await waitForElement('#video-metadata-editor ytcp-video-metadata-editor-sidepanel').catch(() => null);
        if (!parent) return;

        const container = document.createElement('div');
        container.id = 'template-container';
        container.className = 'template-container';
        container.style = 'margin-bottom: 12px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;';

        const label = document.createElement('label');
        label.textContent = 'Select Template:';
        label.className = 'template-label';
        label.style = 'font-weight: 600; font-size: 14px;';

        const select = document.createElement('select');
        select.id = 'template-selector';
        select.className = 'template-selector';
        select.style = `
            padding: 5px 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 14px;
            min-width: 180px;
        `;

        const applyBtn = createButton('Apply Template', 'apply-btn');
        applyBtn.id = 'apply-btn';

        const addBtn = createButton('Add New Template', 'new-template-btn');
        const editBtn = createButton('Edit Template', 'edit-btn');
        editBtn.id = 'edit-btn';

        const deleteBtn = createButton('Delete Template', 'delete-btn');
        deleteBtn.id = 'delete-btn';

        container.append(label, select, applyBtn, addBtn, editBtn, deleteBtn);
        parent.prepend(container);

        populateTemplates(select);

        container.addEventListener('click', (e) => {
            if (e.target === applyBtn) {
                lastSelectedTemplate = select.value;
                GM_setValue('lastSelectedTemplate', lastSelectedTemplate);
                applyTemplate();
            } else if (e.target === addBtn) {
                showAddTemplateForm();
            } else if (e.target === editBtn) {
                showEditTemplateForm(select.value);
            } else if (e.target === deleteBtn) {
                deleteTemplate(select.value);
            }
        });
    }

    // ======= Show form to add a new template =======
    async function showAddTemplateForm() {
        if (document.getElementById('form-container')) return;
        const container = document.getElementById('template-container');
        if (container) container.style.display = 'none';

        const formContainer = document.createElement('div');
        formContainer.id = 'form-container';
        formContainer.className = 'template-container';
        formContainer.style = 'margin-bottom: 12px;';

        const form = document.createElement('form');
        form.style = 'max-width: 400px;';

        form.appendChild(createFormInput('Template Name:', 'new-template-name'));
        form.appendChild(createFormTextarea('Description:', 'new-template-description'));

        const saveBtn = createButton('Save Template', 'save-btn');
        const cancelBtn = createButton('Cancel', 'cancel-btn');

        form.append(saveBtn, cancelBtn);
        formContainer.appendChild(form);

        const parent = await waitForElement('#video-metadata-editor ytcp-video-metadata-editor-sidepanel').catch(() => null);
        if (parent) parent.prepend(formContainer);

        formContainer.scrollIntoView({ behavior: 'smooth' });

        formContainer.addEventListener('click', (event) => {
            if (event.target === saveBtn) saveNewTemplate();
            else if (event.target === cancelBtn) {
                formContainer.remove();
                if (container) container.style.display = 'flex';
            }
        });

        form.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveNewTemplate();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                formContainer.remove();
                if (container) container.style.display = 'flex';
            }
        });
    }

    // ======= Save new template =======
    function saveNewTemplate() {
        const nameInput = document.getElementById('new-template-name');
        const descInput = document.getElementById('new-template-description');

        const name = nameInput.value.trim();
        const desc = descInput.value.trim();
        if (!name || !desc) {
            alertModal('Please fill in all fields.');
            return;
        }

        const templates = loadTemplates();
        if (templates[name]) {
            alertModal('A template with this name already exists.');
            return;
        }

        templates[name] = { description: desc };
        saveTemplates(templates);

        const select = document.getElementById('template-selector');
        populateTemplates(select);
        select.value = name;
        lastSelectedTemplate = name;
        GM_setValue('lastSelectedTemplate', lastSelectedTemplate);

        document.getElementById('form-container')?.remove();
        document.getElementById('template-container').style.display = 'flex';

        alertModal(`Template "${name}" saved successfully!`);
    }

    // ======= Delete template with confirmation modal =======
    function deleteTemplate(templateName) {
        if (!templateName) return;

        showModal(`Delete template "${templateName}"? This action cannot be undone.`, () => {
            const templates = loadTemplates();
            delete templates[templateName];
            saveTemplates(templates);

            const select = document.getElementById('template-selector');
            populateTemplates(select);

            alertModal(`Template "${templateName}" deleted.`);
        });
    }

    // ======= Show form to edit a template =======
    async function showEditTemplateForm(templateName) {
        if (!templateName) {
            alertModal('No template selected to edit.');
            return;
        }
        if (document.getElementById('form-container')) return;
        const container = document.getElementById('template-container');
        if (container) container.style.display = 'none';

        const templates = loadTemplates();
        const template = templates[templateName];

        const formContainer = document.createElement('div');
        formContainer.id = 'form-container';
        formContainer.className = 'template-container';
        formContainer.style = 'margin-bottom: 12px; max-width: 400px;';

        const form = document.createElement('form');

        form.appendChild(createFormInput('Template Name:', 'edit-template-name'));
        form.appendChild(createFormTextarea('Description:', 'edit-template-description'));

        const saveBtn = createButton('Save Changes', 'save-btn');
        const cancelBtn = createButton('Cancel', 'cancel-btn');

        form.append(saveBtn, cancelBtn);
        formContainer.appendChild(form);

        const parent = await waitForElement('#video-metadata-editor ytcp-video-metadata-editor-sidepanel').catch(() => null);
        if (parent) parent.prepend(formContainer);

        // Prefill fields
        const nameInput = form.querySelector('#edit-template-name');
        const descInput = form.querySelector('#edit-template-description');
        nameInput.value = templateName;
        descInput.value = template.description;

        nameInput.focus();

        formContainer.addEventListener('click', (event) => {
            if (event.target === saveBtn) saveEditedTemplate(templateName);
            else if (event.target === cancelBtn) {
                formContainer.remove();
                if (container) container.style.display = 'flex';
            }
        });

        form.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEditedTemplate(templateName);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                formContainer.remove();
                if (container) container.style.display = 'flex';
            }
        });
    }

    // ======= Save changes to edited template =======
    function saveEditedTemplate(oldName) {
        const nameInput = document.getElementById('edit-template-name');
        const descInput = document.getElementById('edit-template-description');

        const newName = nameInput.value.trim();
        const newDesc = descInput.value.trim();
        const templates = loadTemplates();

        if (!newName || !newDesc) {
            alertModal('Please fill in all fields.');
            return;
        }

        if (newName !== oldName && templates[newName]) {
            alertModal('A template with this name already exists.');
            return;
        }

        if (newName !== oldName) {
            delete templates[oldName];
        }
        templates[newName] = { description: newDesc };
        saveTemplates(templates);

        const select = document.getElementById('template-selector');
        populateTemplates(select);
        select.value = newName;

        document.getElementById('form-container')?.remove();
        document.getElementById('template-container').style.display = 'flex';

        alertModal(`Template "${newName}" saved successfully!`);
    }

    // ======= Modal dialog for confirmation =======
    function showModal(message, onConfirm) {
        if (document.getElementById('ut-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'ut-modal';
        modal.style = `
            position: fixed;
            top:0; left:0; right:0; bottom:0;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
        `;

        const dialog = document.createElement('div');
        dialog.style = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 320px;
            font-family: Roboto, Arial, sans-serif;
            text-align: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        `;

        const msg = document.createElement('p');
        msg.textContent = message;
        msg.style.marginBottom = '20px';

        const btnYes = createButton('Yes', 'btn-yes');
        btnYes.style.backgroundColor = '#1a73e8';
        const btnNo = createButton('No', 'btn-no');
        btnNo.style.backgroundColor = '#ea4335';

        btnYes.style.marginRight = '10px';

        dialog.append(msg, btnYes, btnNo);
        modal.appendChild(dialog);
        document.body.appendChild(modal);

        btnYes.onclick = () => {
            onConfirm();
            modal.remove();
        };
        btnNo.onclick = () => {
            modal.remove();
        };
    }

    // ======= Modal dialog for alert/info =======
    function alertModal(message) {
        if (document.getElementById('ut-alert')) return;

        const modal = document.createElement('div');
        modal.id = 'ut-alert';
        modal.style = `
            position: fixed;
            top:0; left:0; right:0; bottom:0;
            background: rgba(0,0,0,0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
        `;

        const dialog = document.createElement('div');
        dialog.style = `
            background: white;
            padding: 16px 24px;
            border-radius: 6px;
            max-width: 300px;
            font-family: Roboto, Arial, sans-serif;
            text-align: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        `;

        const msg = document.createElement('p');
        msg.textContent = message;
        msg.style.marginBottom = '20px';

        const okBtn = createButton('OK', 'btn-ok');
        okBtn.style.backgroundColor = '#1a73e8';

        okBtn.onclick = () => modal.remove();

        dialog.append(msg, okBtn);
        modal.appendChild(dialog);
        document.body.appendChild(modal);
    }

    // ======= Initialization =======
    function init() {
        createTemplateDropdown();
    }

    // Run when YouTube Studio video edit page is loaded and stable
    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(init, 1500); // Delay to allow DOM elements to appear
    });

    // Also run on script start for initial page load
    setTimeout(init, 2500);

})();
