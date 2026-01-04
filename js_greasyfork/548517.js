// ==UserScript==
// @name         WME Chats Enhanced
// @namespace    https://github.com/WazeDev/wme-chats-enhanced
// @version      0.0.1
// @description  Send template messages using WME chat.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      MIT
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/548517/WME%20Chats%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/548517/WME%20Chats%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const scriptInfo = GM_info.script;
    const scriptId = scriptInfo.namespace.includes("github") ?
        scriptInfo.namespace.split("/").pop() : null;
    const scriptName = scriptInfo.name;
    const scriptShorthand = "WME C-E";

    const chatTextAreaQuerySelector = "textarea[placeholder='Send a message']"
    const chatButtonQuerySelector = "div > wz-a[href*='USERNAME_HERE']"

    const SHEETS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRKysGM6H9nqjiP3nujS4Rs9rcV4aR0kc-CNA94A3-sXxKKQg9aI7TxMKb98DRqoy7c2c53c2oS4Br/pubhtml/sheet?gid=0&single=true";
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScy3_ywQuw-Svnbc_2x0e26tvBSEDoKnygJ2xt72KBxTVHUiw/viewform";
    const STORAGE_KEY = 'WME_CE_TemplateMessages';
    const STORAGE_TIMESTAMP_KEY = 'WME_CE_TemplateMessages_Timestamp';
    const CUSTOM_TEMPLATES_KEY = 'WME_CE_CustomTemplates';

    let sdk, venueURListElm, CE_statusMsgElm, CE_templateMessagesElm;
    let currentlySelectedReporterUsername, currentlySelectedVenue, chatTextArea;
    let templateMessages = {};
    let customTemplates = {};
    let allVenueCategories = [];
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    window.SDK_INITIALIZED.then(init);

    function getTimeBasedGreeting() {
        const hour = new Date().getHours();
        return hour >= 5 && hour < 12 ? "Good morning," :
            hour >= 12 && hour < 18 ? "Good afternoon," : "Good evening,";
    }

    function saveTemplatesToStorage(templates) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
            localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
            scriptLog(`Saved ${Object.keys(templates).length} templates to localStorage`);
        } catch (error) {
            scriptLog(`Error saving templates to localStorage: ${error.message}`);
        }
    }

    function saveCustomTemplates() {
        try {
            localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(customTemplates));
            scriptLog(`Saved ${Object.keys(customTemplates).length} custom templates`);
        } catch (error) {
            scriptLog(`Error saving custom templates: ${error.message}`);
        }
    }

    function loadCustomTemplates() {
        try {
            const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
            if (stored) {
                customTemplates = JSON.parse(stored);
                scriptLog(`Loaded ${Object.keys(customTemplates).length} custom templates`);
            }
        } catch (error) {
            scriptLog(`Error loading custom templates: ${error.message}`);
            customTemplates = {};
        }
    }

    function loadTemplatesFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);

            if (!stored || !timestamp) {
                scriptLog("No templates found in localStorage");
                return null;
            }

            const age = Date.now() - parseInt(timestamp);
            if (age > CACHE_DURATION) {
                scriptLog("Stored templates are expired, will fetch fresh ones");
                return null;
            }

            const templates = JSON.parse(stored);
            scriptLog(`Loaded ${Object.keys(templates).length} templates from localStorage`);
            return templates;
        } catch (error) {
            scriptLog(`Error loading templates from localStorage: ${error.message}`);
            return null;
        }
    }

    function getAllTemplates() {
        return {
            ...templateMessages,
            ...customTemplates
        };
    }

    function generateGoogleFormURL(templateName, templateData) {
        const baseURL = GOOGLE_FORM_URL;
        const params = new URLSearchParams();

        // Add prefill parameters
        params.append('usp', 'pp_url');
        params.append('entry.1574063336', templateData.text); // template body
        params.append('entry.817091061', templateData.type); // template type
        params.append('entry.2037058359', templateName); // template name

        // Format venue categories as proper JSON array for the form
        const categoriesText = JSON.stringify(templateData.venue_categories || []);
        params.append('entry.100514702', categoriesText); // template venue categories

        return `${baseURL}?${params.toString()}`;
    }

    function submitTemplateToForm(templateName, templateData) {
        const formURL = generateGoogleFormURL(templateName, templateData);
        window.open(formURL, '_blank');
        scriptLog(`Opened Google form for template: ${templateName}`);
    }

    async function loadTemplateMessages(forceRefresh = false) {
        if (!forceRefresh) {
            const cached = loadTemplatesFromStorage();
            if (cached) {
                templateMessages = cached;
                return templateMessages;
            }
        }

        try {
            scriptLog("Fetching template messages from Google Sheets...");
            const response = await fetch(SHEETS_URL);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const rows = doc.querySelectorAll('table tr');
            const newTemplateMessages = {};

            // Process all rows and filter out headers/freezebar rows
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.querySelectorAll('td');

                if (cells.length < 4) continue;

                // Skip rows with freezebar cells or empty cells
                const hasFreezebar = Array.from(cells).some(cell =>
                    cell.classList.contains('freezebar-cell')
                );
                if (hasFreezebar) continue;

                const message = cells[0].textContent.trim();
                const venueCategories = cells[1].textContent.trim();
                const messageType = cells[2].textContent.trim();
                const name = cells[3].textContent.trim();

                // Skip header rows or rows with header-like content
                if (message === 'Message' || messageType === 'Message Type' || name === 'Name') {
                    continue;
                }

                // Skip rows with empty required fields
                if (!message || !messageType || !name) continue;

                let parsedCategories = [];
                if (venueCategories && venueCategories !== 'Venue Categories') {
                    try {
                        parsedCategories = JSON.parse(venueCategories);
                    } catch (e) {
                        // If it's not valid JSON, try to treat it as a simple array notation
                        if (venueCategories.includes('[') && venueCategories.includes(']')) {
                            scriptLog(`Warning: Could not parse venue categories for "${name}": ${venueCategories}`);
                            parsedCategories = [];
                        } else {
                            // Treat as single category
                            parsedCategories = venueCategories ? [venueCategories] : [];
                        }
                    }
                }

                newTemplateMessages[name] = {
                    text: message,
                    venue_categories: parsedCategories,
                    type: messageType
                };

                scriptLog(`Loaded template: "${name}" (type: ${messageType})`);
            }

            templateMessages = newTemplateMessages;
            saveTemplatesToStorage(templateMessages);

            scriptLog(`Successfully loaded ${Object.keys(templateMessages).length} template messages from Google Sheets`);
            return templateMessages;

        } catch (error) {
            scriptLog(`Error loading template messages: ${error.message}`);
            // If fetch failed but we have cached templates, use those
            const cached = loadTemplatesFromStorage();
            if (cached) {
                scriptLog("Using cached templates due to fetch error");
                templateMessages = cached;
            }
            return templateMessages;
        }
    }

    function createTemplateEditor(existingTemplate = null, templateName = null) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    // Get existing types for autocomplete
    const allTemplates = getAllTemplates();
    const existingTypes = [...new Set(Object.values(allTemplates).map(template => template.type))];
    const typeOptions = existingTypes.map(type => `<option value="${type}">`).join('');

    modal.innerHTML = `
        <h2 style="margin-top: 0;">Template Editor</h2>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Template Name:</label>
            <input type="text" id="template-name" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" value="${templateName || ''}">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Message Type:</label>
            <input type="text" id="template-type" list="type-suggestions" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Enter message type (e.g., resolution or question)" value="${existingTemplate?.type || ''}">
            <datalist id="type-suggestions">
                ${typeOptions}
            </datalist>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Template Text:</label>
            <textarea id="template-text" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical; height: 150px" placeholder="Use {GREETING}, {REPORTER_NAME}, and {VENUE_NAME} as placeholders">${existingTemplate?.text || ''}</textarea>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Venue Categories (leave empty for all venues):</label>
            <div id="venue-categories" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; border-radius: 4px;">
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <div>
                <button id="save-template" style="background-color: #4CAF50; color: white; padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Save Template</button>
                <button id="submit-to-form" style="background-color: #2196F3; color: white; padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Submit to Form</button>
                <button id="cancel-template" style="background-color: #f44336; color: white; padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
            <button id="manage-templates" style="background-color: #FF9800; color: white; padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer;">Manage Templates</button>
        </div>
    `;

    // Populate venue categories with checkboxes
    const categoriesDiv = modal.querySelector('#venue-categories');
    allVenueCategories.forEach(categoryId => {
        const label = document.createElement('label');
        label.style.cssText = 'display: block; margin-bottom: 5px; cursor: pointer;';
        label.innerHTML = `
            <input type="checkbox" value="${categoryId}" style="margin-right: 5px;" ${existingTemplate?.venue_categories?.includes(categoryId) ? 'checked' : ''}>
            ${categoryId}
        `;
        categoriesDiv.appendChild(label);
    });

    // Add event listeners
    modal.querySelector('#save-template').addEventListener('click', saveTemplate);
    modal.querySelector('#submit-to-form').addEventListener('click', submitToForm);
    modal.querySelector('#cancel-template').addEventListener('click', () => document.body.removeChild(backdrop));
    modal.querySelector('#manage-templates').addEventListener('click', showTemplateManager);

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    function saveTemplate() {
        const name = modal.querySelector('#template-name').value.trim();
        const type = modal.querySelector('#template-type').value.trim().toLowerCase();
        const text = modal.querySelector('#template-text').value.trim();
        const selectedCategories = Array.from(modal.querySelectorAll('#venue-categories input:checked'))
            .map(checkbox => checkbox.value);

        if (!name || !text || !type) {
            alert('Please fill in template name, message type, and text');
            return;
        }

        if (customTemplates[name]) {
            if (!confirm(`Template "${name}" already exists. Overwrite?`)) {
                return;
            }
        }

        customTemplates[name] = {
            text: text,
            venue_categories: selectedCategories,
            type: type,
            custom: true
        };

        saveCustomTemplates();
        scriptLog(`Saved custom template: ${name}`);

        if (currentlySelectedReporterUsername && currentlySelectedVenue) {
            generateTemplateMessages();
        }

        document.body.removeChild(backdrop);
    }

    function submitToForm() {
        const name = modal.querySelector('#template-name').value.trim();
        const type = modal.querySelector('#template-type').value.trim().toLowerCase();
        const text = modal.querySelector('#template-text').value.trim();
        const selectedCategories = Array.from(modal.querySelectorAll('#venue-categories input:checked'))
            .map(checkbox => checkbox.value);

        if (!name || !text || !type) {
            alert('Please fill in template name, message type, and text before submitting to form');
            return;
        }

        const templateData = {
            text: text,
            venue_categories: selectedCategories,
            type: type
        };

        submitTemplateToForm(name, templateData);
    }

    function showTemplateManager() {
        document.body.removeChild(backdrop);
        createTemplateManager();
    }
}

    function createTemplateManager() {
        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

        const templateList = Object.entries(customTemplates).map(([name, template]) => `
        <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0; color: #333;">${name}</h4>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">Type: ${template.type}</p>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">Categories: ${template.venue_categories.length ? template.venue_categories : '[]'}</p>
                    <p style="margin: 0; font-style: italic; color: #555; font-size: 14px;">${template.text}</p>
                </div>
                <div style="margin-left: 15px;">
                    <button class="edit-template-btn" data-template-name="${name}" style="background-color: #FFA500; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px; font-size: 12px;">Edit</button>
                    <button class="submit-template-btn" data-template-name="${name}" style="background-color: #2196F3; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px; font-size: 12px;">Submit to Form</button>
                    <button class="delete-template-btn" data-template-name="${name}" style="background-color: #f44336; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">Delete</button>
                </div>
            </div>
        </div>
    `).join('');

        modal.innerHTML = `
        <h2 style="margin-top: 0;">Manage Custom Templates</h2>
        <div style="margin-bottom: 20px;">
            ${templateList || '<p style="color: #666; font-style: italic;">No custom templates created yet.</p>'}
        </div>
        <div style="display: flex; justify-content: space-between;">
            <button id="add-new-template" style="background-color: #4CAF50; color: white; padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer;">Add New Template</button>
            <button id="close-manager" style="background-color: #666; color: white; padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
    `;

        // Add event listeners for template action buttons
        modal.addEventListener('click', (e) => {
            const templateName = e.target.dataset.templateName;

            if (e.target.classList.contains('edit-template-btn')) {
                document.body.removeChild(backdrop);
                editTemplate(templateName);
            } else if (e.target.classList.contains('submit-template-btn')) {
                const template = customTemplates[templateName];
                if (template) {
                    submitTemplateToForm(templateName, template);
                }
            } else if (e.target.classList.contains('delete-template-btn')) {
                if (confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
                    delete customTemplates[templateName];
                    saveCustomTemplates();
                    scriptLog(`Deleted custom template: ${templateName}`);

                    if (currentlySelectedReporterUsername && currentlySelectedVenue) {
                        generateTemplateMessages();
                    }

                    // Refresh the manager
                    document.body.removeChild(backdrop);
                    createTemplateManager();
                }
            }
        });

        // Add event listeners for main buttons
        modal.querySelector('#add-new-template').addEventListener('click', () => {
    document.body.removeChild(backdrop);
    createTemplateEditor();
});
        modal.querySelector('#close-manager').addEventListener('click', () => document.body.removeChild(backdrop));

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
    }

    function editTemplate(name) {
        const template = customTemplates[name];
        if (!template) return;

        // Create editor with pre-filled values
        createTemplateEditor(template, name);
    }

    function init() {
        sdk = window.getWmeSdk({
            scriptId,
            scriptName
        });

        // Get all venue categories
        allVenueCategories = sdk.DataModel.Venues.getAllVenueCategories().map(e => e.id);

        // Load custom templates
        loadCustomTemplates();

        sdk.Sidebar.registerScriptTab().then(res => {
            res.tabLabel.innerText = scriptShorthand;
            res.tabPane.innerHTML = `
                <div>
                    <h1>${scriptName}</h1>
                    <div style="margin-bottom: 10px;">
                        <button id="WME_C-E_RefreshTemplates" style="padding: 4px 8px; font-size: 11px; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; cursor: pointer; margin-right: 5px;">Refresh Templates</button>
                        <button id="WME_C-E_TemplateEditor" style="padding: 4px 8px; font-size: 11px; background-color: #4CAF50; color: white; border: 1px solid #45a049; border-radius: 3px; cursor: pointer;">Template Editor</button>
                    </div>
                </div>
                <b><p id="WME_C-E_StatusMessage"></p></b>
                <div id="WME_C-E_VenueURList"></div>
                <div id="WME_C-E_TemplateMsgs" style="margin-top: 10px;"></div>
            `;
            venueURListElm = res.tabPane.querySelector("#WME_C-E_VenueURList");
            CE_statusMsgElm = res.tabPane.querySelector("#WME_C-E_StatusMessage");
            CE_templateMessagesElm = res.tabPane.querySelector("#WME_C-E_TemplateMsgs");

            const refreshButton = res.tabPane.querySelector("#WME_C-E_RefreshTemplates");
            refreshButton.addEventListener("click", async () => {
                refreshButton.disabled = true;
                refreshButton.innerText = "Refreshing...";

                await loadTemplateMessages(true); // Force refresh

                if (currentlySelectedReporterUsername && currentlySelectedVenue) {
                    generateTemplateMessages();
                }

                refreshButton.disabled = false;
                refreshButton.innerText = "Refresh Templates";
            });

            const editorButton = res.tabPane.querySelector("#WME_C-E_TemplateEditor");
editorButton.addEventListener("click", () => createTemplateEditor());
        });

        // Load templates on initialization
        loadTemplateMessages();

        sdk.Events.on({
            eventName: "wme-selection-changed",
            eventHandler: getDetails
        });
    }

    function scriptLog(msg) {
        console.log(`${scriptId}: ${msg}`);
    }

    function setStatusMsg(msg, color = "black") {
        CE_statusMsgElm.innerText = msg;
        CE_statusMsgElm.style.color = color;
    }

    function showSelectReporterMessage() {
        CE_templateMessagesElm.innerHTML = "";
        const selectMsg = document.createElement("p");
        selectMsg.innerText = "Please select a reporter to generate template messages";
        selectMsg.style.cssText = "color: #666; font-style: italic; text-align: center; padding: 20px; margin: 0;";
        CE_templateMessagesElm.appendChild(selectMsg);
    }

    async function checkForOpenChat() {
        try {
            const iframe = document.querySelector("iframe");
            if (!iframe) return null;

            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) return null;

            const textArea = iframeDoc.querySelector(chatTextAreaQuerySelector);
            const usernameElement = iframeDoc.querySelector("wz-h6");

            if (textArea && usernameElement) {
                const username = usernameElement.innerText.trim();
                if (username) {
                    chatTextArea = textArea;
                    return username;
                }
            }
        } catch (error) {
            scriptLog(`Error checking for open chat: ${error.message}`);
        }
        return null;
    }

    async function generateVUROptions() {
        if (!venueURListElm) return;

        venueURListElm.innerHTML = "";
        const vurs = currentlySelectedVenue.venueUpdateRequests;

        if (!vurs?.length) {
            // Check if there's an open chat even without VURs
            const openChatUsername = await checkForOpenChat();
            if (openChatUsername) {
                currentlySelectedReporterUsername = openChatUsername;
                setStatusMsg(`Chat open with: ${openChatUsername}`, "green");
                generateTemplateMessages();
                return;
            }

            setStatusMsg("No Venue Update Requests found...", "darkred");
            CE_templateMessagesElm.innerHTML = "";
            return;
        }

        const uniqueUsernames = [...new Set(vurs.map(request => request.createdBy))];

        uniqueUsernames.forEach(username => {
            const label = document.createElement("label");
            label.innerText = username;
            label.htmlFor = `WME_C-E_${username}`;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = label.htmlFor;
            checkbox.style.marginLeft = "5px";
            checkbox.addEventListener("input", selectReporter);

            venueURListElm.append(label, checkbox);
        });

        setStatusMsg(`Found ${uniqueUsernames.length} reporters!`, "green");

        showSelectReporterMessage();

        if (uniqueUsernames.length === 1) {
            const singleCheckbox = venueURListElm.querySelector('input[type="checkbox"]');
            if (singleCheckbox) {
                singleCheckbox.checked = true;
                const event = new Event('input', {
                    bubbles: true
                });
                singleCheckbox.dispatchEvent(event);
            }
        }
    }

    function generateTemplateMessages() {
        CE_templateMessagesElm.innerHTML = "";

        const allTemplates = getAllTemplates();

        if (Object.keys(allTemplates).length === 0) {
            const noTemplatesMsg = document.createElement("p");
            noTemplatesMsg.innerText = "Templates not loaded yet. Please wait or click 'Refresh Templates'.";
            noTemplatesMsg.style.cssText = "color: orange; font-style: italic;";
            CE_templateMessagesElm.appendChild(noTemplatesMsg);
            return;
        }

        // Always show settings section
        const settingsHeading = document.createElement("h4");
        settingsHeading.innerText = "Settings";
        settingsHeading.style.cssText = "margin: 0 0 8px 0; color: #333; font-size: 13px; border-bottom: 1px solid #ddd; padding-bottom: 3px;";
        CE_templateMessagesElm.appendChild(settingsHeading);

        const replaceCheckbox = document.createElement("input");
        replaceCheckbox.type = "checkbox";
        replaceCheckbox.id = "replace-text-checkbox";
        replaceCheckbox.style.marginRight = "5px";

        const replaceLabel = document.createElement("label");
        replaceLabel.htmlFor = "replace-text-checkbox";
        replaceLabel.innerText = "Replace existing text";
        replaceLabel.style.cssText = "display: block; margin-bottom: 15px; font-size: 12px;";
        replaceLabel.prepend(replaceCheckbox);
        CE_templateMessagesElm.appendChild(replaceLabel);

        const matchingTemplates = Object.entries(allTemplates).filter(([, details]) =>
            !details.venue_categories.length ||
            currentlySelectedVenue.categories.some(cat => details.venue_categories.includes(cat))
        );

        if (!matchingTemplates.length) {
            const noTemplatesMsg = document.createElement("p");
            noTemplatesMsg.innerText = "No templates available for this venue type.";
            noTemplatesMsg.style.cssText = "color: gray; font-style: italic;";
            CE_templateMessagesElm.appendChild(noTemplatesMsg);
            return;
        }

        // Group templates by type
        const templatesByType = matchingTemplates.reduce((acc, [msg, details]) => {
            (acc[details.type] ??= []).push([msg, details]);
            return acc;
        }, {});

        // Create sections for each type
        Object.entries(templatesByType).forEach(([type, templates]) => {
            const typeHeading = document.createElement("h4");
            typeHeading.innerText = type.charAt(0).toUpperCase() + type.slice(1);
            typeHeading.style.cssText = "margin: 15px 0 8px 0; color: #333; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 3px;";
            CE_templateMessagesElm.appendChild(typeHeading);

            templates.forEach(([msg, details]) => {
                const button = document.createElement("button");
                button.innerText = msg + (details.custom ? ' (Custom)' : '');
                button.style.cssText = `display: block; width: 100%; margin-bottom: 5px; background-color: ${details.custom ? '#e8f5e8' : '#f0f0f0'}; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; text-align: left; font-size: 12px;`;
                button.title = details.text
                    .replace("{GREETING}", getTimeBasedGreeting())
                    .replace("{REPORTER_NAME}", currentlySelectedReporterUsername)
                    .replace("{VENUE_NAME}", currentlySelectedVenue.name);
                button.addEventListener("mouseenter", () => button.style.backgroundColor = details.custom ? '#d4eed4' : '#e0e0e0');
                button.addEventListener("mouseleave", () => button.style.backgroundColor = details.custom ? '#e8f5e8' : '#f0f0f0');
                button.addEventListener("click", (e) => {
                    insertTemplateMessage(e.target.title);
                });

                CE_templateMessagesElm.appendChild(button);
            });
        });
    }

    function insertTemplateMessage(message) {
        if (!chatTextArea || !message) {
            scriptLog("No chat textarea or message to insert");
            return;
        }

        const shouldReplace = CE_templateMessagesElm.querySelector("#replace-text-checkbox")?.checked;
        const currentText = chatTextArea.value.trim();

        chatTextArea.value = shouldReplace ? message :
            currentText ? `${currentText} ${message}` : message;

        chatTextArea.dispatchEvent(new Event('input', {
            bubbles: true
        }));
        scriptLog(`Template message ${shouldReplace ? 'replaced' : 'appended'} to chat!`);
    }

    async function selectReporter(event) {
        sdk.DataModel.Venues.showVenueUpdateRequestDialog({
            venueId: currentlySelectedVenue.id
        });
        currentlySelectedReporterUsername = event.target.previousElementSibling.innerText;

        scriptLog("Looking for chat button...");
        try {
            const chatButton = await waitForQuerySelector(chatButtonQuerySelector.replace("USERNAME_HERE", currentlySelectedReporterUsername));
            if (chatButton) {
                scriptLog("Opening chat!");
                chatButton.parentElement.lastChild.children[0].click();

                const iframe = await waitForQuerySelector("iframe");
                if (iframe) {
                    const textArea = await waitForQuerySelectorInIframe(iframe, chatTextAreaQuerySelector);
                    if (textArea) {
                        chatTextArea = textArea;
                        generateTemplateMessages();
                        scriptLog("Chat textarea found and ready!");
                    } else {
                        scriptLog("Could not find chat text area in iframe");
                    }
                } else {
                    scriptLog("Could not find chat iframe");
                }
            } else {
                scriptLog("Could not find chat button");
            }
        } catch (error) {
            scriptLog(`Error in selectReporter: ${error.message}`);
        }
    }

    function waitForQuerySelector(querySelector, maxTries = 10) {
        return new Promise(resolve => {
            let tries = 0;
            const attempt = () => {
                const element = document.querySelector(querySelector);
                if (element) {
                    scriptLog("Found element!");
                    resolve(element);
                    return;
                }
                if (++tries >= maxTries) {
                    scriptLog("Couldn't find element after maximum tries!");
                    resolve(null);
                    return;
                }
                scriptLog("No element! Trying again...");
                setTimeout(attempt, 1000);
            };
            attempt();
        });
    }

    function waitForQuerySelectorInIframe(iframe, querySelector, maxTries = 10) {
        return new Promise(resolve => {
            let tries = 0;
            const attempt = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (!iframeDoc) {
                        if (++tries >= maxTries) {
                            scriptLog("Iframe not ready after maximum tries!");
                            resolve(null);
                            return;
                        }
                        scriptLog("Iframe not ready, trying again...");
                        setTimeout(attempt, 1000);
                        return;
                    }

                    const element = iframeDoc.querySelector(querySelector);
                    if (element) {
                        scriptLog("Found element in iframe!");
                        resolve(element);
                        return;
                    }

                    if (++tries >= maxTries) {
                        scriptLog("Couldn't find element in iframe after maximum tries!");
                        resolve(null);
                        return;
                    }
                    scriptLog("No element in iframe! Trying again...");
                    setTimeout(attempt, 1000);
                } catch (error) {
                    scriptLog(`Error accessing iframe: ${error.message}`);
                    if (++tries >= maxTries) {
                        resolve(null);
                        return;
                    }
                    setTimeout(attempt, 1000);
                }
            };
            attempt();
        });
    }

    function getDetails() {
        currentlySelectedReporterUsername = null;
        currentlySelectedVenue = null;

        const selection = sdk.Editing.getSelection();
        if (!selection || selection.objectType !== "venue") return;

        currentlySelectedVenue = sdk.DataModel.Venues.getById({
            venueId: selection.ids[0]
        });
        generateVUROptions();
    }
})();