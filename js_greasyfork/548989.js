// ==UserScript==
// @name         AutoComplete
// @version      1.0.1
// @description  dummy data and fill
// @author       https://github.com/sitien173
// @match        *://*/eidv/personMatch*
// @match        *://*/verification*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @connect      *
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1508709
// @downloadURL https://update.greasyfork.org/scripts/548989/AutoComplete.user.js
// @updateURL https://update.greasyfork.org/scripts/548989/AutoComplete.meta.js
// ==/UserScript==

(function () {
    const DEFAULT_CONFIG = {
        BACKEND_ENDPOINT: "https://auto-completed-byg2dgh8egaahsg9.southeastasia-01.azurewebsites.net",
        showNotifications: true,
        enableCachedResponses: true,
        showUiButtons: false,
        excludedFields: ['Third Party Reference','Customer Reference ID'],
    };

    let config = { ...DEFAULT_CONFIG };
    // State
    const CLICK_DELAY_MS = 600;
    let countrySelection = null;
    let isVerification = false;
    let isKyb = false;
    let isSearchFieldExisting = false;

    function normalizeExcludedFields(value) {
        if (Array.isArray(value)) {
            return value.map((field) => field.trim()).filter(Boolean);
        }
        if (typeof value === "string") {
            return value
                .split(/[\n,]/)
                .map((field) => field.trim())
                .filter(Boolean);
        }
        return [];
    }

    function getExcludedFieldSet(processSpaces = false) {
        return new Set(
            (config.excludedFields || [])
                .map((field) => processSpaces ? field.toLowerCase().replaceAll(/\s+/g, "") : field.toLowerCase())
                .filter(Boolean)
        );
    }

    function shouldSkipField(fieldName, control, excludedSet) {
        if (!excludedSet || excludedSet.size === 0) return false;
        const normalizedName = (fieldName || "").toLowerCase().replaceAll(/\s+/g, "");
        if (excludedSet.has(normalizedName)) return true;

        if (control) {
            const nameAttr = (control.getAttribute("name") || "").toLowerCase().replaceAll(/\s+/g, "");
            if (nameAttr && excludedSet.has(nameAttr)) return true;

            const idAttr = (control.id || "").toLowerCase().replaceAll(/\s+/g, "");
            if (idAttr && excludedSet.has(idAttr)) return true;
        }

        return false;
    }

    // Helpers (ported)
    const dobMonthOpts = [
        { text: "January", value: 1 },
        { text: "February", value: 2 },
        { text: "March", value: 3 },
        { text: "April", value: 4 },
        { text: "May", value: 5 },
        { text: "June", value: 6 },
        { text: "July", value: 7 },
        { text: "August", value: 8 },
        { text: "September", value: 9 },
        { text: "October", value: 10 },
        { text: "November", value: 11 },
        { text: "December", value: 12 },
    ];

    const genderMap = new Map([
        ["M", "MALE"],
        ["MALE", "MALE"],
        ["F", "FEMALE"],
        ["FEMALE", "FEMALE"],
    ]);

    function loadConfig() {
        const savedConfig = GM_getValue("config", {});
        config = { ...DEFAULT_CONFIG, ...savedConfig };
        config.excludedFields = normalizeExcludedFields(config.excludedFields);
    }

    // Save configuration
    function saveConfig() {
        GM_setValue("config", config);
    }

    function showNotification(message, type = "info") {
        if (!config.showNotifications) return;

        const existingNotification = document.getElementById(
            "udemy-cookie-notification"
        );
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement("div");
        notification.id = "autocompleted-notification";
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: opacity 0.3s ease;
        `;

        switch (type) {
            case "success":
                notification.style.backgroundColor = "#4CAF50";
                break;
            case "error":
                notification.style.backgroundColor = "#f44336";
                break;
            case "warning":
                notification.style.backgroundColor = "#ff9800";
                break;
            default:
                notification.style.backgroundColor = "#2196F3";
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = "0";
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // Create settings panel
    function createSettingsPanel() {
        const panel = document.createElement("div");
        panel.id = "autocompleted-settings-panel";
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            font-family: Arial, sans-serif;
            min-width: 400px;
        `;

        panel.innerHTML = `
            <h2 style="margin-top: 0; color: #333;">AutoCompleted Settings</h2>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Worker URL:</label>
                <input type="text" id="worker-url" value="${config.BACKEND_ENDPOINT
            }" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="show-notifications" ${config.showNotifications ? "checked" : ""
            } style="margin-right: 8px;">
                    Show Notifications
                </label>
            
            
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="enable-cache-response" ${config.enableCachedResponses ? "checked" : ""
            } style="margin-right: 8px;">
                    Cache Responses
                </label>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="show-ui-buttons" ${config.showUiButtons ? "checked" : ""
            } style="margin-right: 8px;">
                    Show UI Button
                </label>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Skip Field Names (comma or newline separated):</label>
                <textarea id="excluded-fields" style="width: 100%; min-height: 60px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="FieldName1, FieldName2">${config.excludedFields.join(", ")}</textarea>
                <small style="color: #666;">Matching is case-insensitive against field names or IDs.</small>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="save-settings" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Settings</button>
                <button id="cancel-settings" style="padding: 10px 20px; background: #9E9E9E; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
        `;

        function removeFillButton() {
            const btn = document.getElementById("autocompleted-fill-button");
            if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
        }

        function removePasteAndFillButton() {
            const btn = document.getElementById("autocompleted-paste-fill-button");
            if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
        }

        function removeCreateRuleButton() {
            const btn = document.getElementById("autocompleted-create-rule-button");
            if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
        }

        panel.querySelector("#save-settings").addEventListener("click", () => {
            config.BACKEND_ENDPOINT = panel.querySelector("#worker-url").value;
            config.showNotifications = panel.querySelector(
                "#show-notifications"
            ).checked;
            config.showUiButtons = panel.querySelector("#show-ui-buttons").checked;
            config.enableCachedResponses = panel.querySelector("#enable-cache-response").checked;
            config.excludedFields = normalizeExcludedFields(
                panel.querySelector("#excluded-fields").value || ""
            );

            saveConfig();
            panel.remove();
            showNotification("Settings saved successfully!", "success");

            if (config.showUiButtons) {
                addFillButton();
                addPasteAndFillButton();
                addCreateRuleButton();
            }
            else {
                removeFillButton();
                removePasteAndFillButton();
                removeCreateRuleButton();
            }
        });

        panel.querySelector("#cancel-settings").addEventListener("click", () => {
            panel.remove();
        });

        panel.addEventListener("click", (e) => {
            if (e.target === panel) {
                panel.remove();
            }
        });

        document.body.appendChild(panel);
    }

    function normalizeInput(input) {
        return String(input).toLowerCase().replace(/[()]/g, "").trim();
    }

    function normalizeMonthOfBirth(input) {
        input = String(input).trim();
        const numericInput = parseInt(input);
        if (!isNaN(numericInput) && numericInput >= 1 && numericInput <= 12) {
            const month = dobMonthOpts.find((m) => m.value === numericInput);
            return `${month.text} (${month.value})`;
        }
        const normalizedInput = normalizeInput(input);
        const monthByText = dobMonthOpts.find(
            (m) => normalizeInput(m.text) === normalizedInput
        );
        if (monthByText) return `${monthByText.text} (${monthByText.value})`;

        const complexMatch = normalizedInput.match(
            /([a-z]+)\s*(?:\()?(\d+)(?:\))?/
        );
        if (complexMatch) {
            const [, monthText, monthValue] = complexMatch;
            const month = dobMonthOpts.find(
                (m) =>
                    normalizeInput(m.text) === monthText.trim() ||
                    m.value === parseInt(monthValue)
            );
            if (month) return `${month.text} (${month.value})`;
        }
        return "Invalid month input";
    }

    function compareGender(a, b) {
        if (!a || !b) return false;
        const norm = (x) => x.trim().toUpperCase();
        const extractParen = (s) => (s.match(/\(([^)]+)\)/) || [])[1];
        const stripParen = (s) => s.replace(/\s*\([^)]*\)\s*/g, "").trim();

        const n1 = norm(a),
            n2 = norm(b);
        const c1 = stripParen(n1),
            c2 = stripParen(n2);
        const p1 = extractParen(n1),
            p2 = extractParen(n2);

        const s1 = genderMap.get(c1) || genderMap.get(p1) || c1;
        const s2 = genderMap.get(c2) || genderMap.get(p2) || c2;
        return s1 === s2;
    }

    function compareStrings(a, b) {
        if (!a || !b) return false;
        a = a.trim().toUpperCase();
        b = b.trim().toUpperCase();
        if (a === b) return true;

        const abbr = (s) => (s.match(/\(([^)]+)\)/) || [])[1];
        const strip = (s) => s.replace(/\s*\([^)]*\)\s*/g, "").trim();

        const aAbbr = abbr(a),
            bAbbr = abbr(b);
        const aClean = strip(a),
            bClean = strip(b);

        return (
            (aAbbr && bClean === aAbbr) ||
            (bAbbr && aClean === bAbbr) ||
            aClean === bClean ||
            (aAbbr && bAbbr && aAbbr === bAbbr)
        );
    }

    // Modal utilities
    function createModal() {
        const modal = document.createElement("div");
        modal.id = "autocompleted-modal";
        modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(2px);
        z-index: 2147483646;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        `;

        const modalContent = document.createElement("div");
        modalContent.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 24px;
        min-width: 400px;
        max-width: 500px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        border: 1px solid #e1e5e9;
        `;

        const header = document.createElement("div");
        header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e1e5e9;
        `;

        const title = document.createElement("h3");
        title.textContent = "Create Rule";
        title.style.cssText = `
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #24292f;
        `;

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #656d76;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        `;
        closeBtn.addEventListener("mouseenter", () => {
            closeBtn.style.background = "#f6f8fa";
        });
        closeBtn.addEventListener("mouseleave", () => {
            closeBtn.style.background = "none";
        });
        closeBtn.addEventListener("click", () => {
            closeModal();
        });

        header.appendChild(title);
        header.appendChild(closeBtn);
        modalContent.appendChild(header);

        // Field selection
        const fieldLabel = document.createElement("label");
        fieldLabel.textContent = "Select Field:";
        fieldLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #24292f;
        `;

        const fieldSelect = document.createElement("select");
        fieldSelect.id = "rule-field-select";
        fieldSelect.style.cssText = `
        width: 90%;
        padding: 8px 12px;
        border: 1px solid #d0d7de;
        border-radius: 6px;
        font-size: 14px;
        margin-bottom: 16px;
        background: white;
        `;
        fieldSelect.innerHTML = '<option value="">Select a field...</option>';
        fieldSelect.value = "";

        detectContext();
        const defaultRules = {};
        const rulesString = GM_getValue(
            `autocompleted-countrySelectionRules_${countrySelection}`,
            "{}"
        );
        const rules = JSON.parse(rulesString);
        const fields = getFormFields();
        fields.forEach((field) => {
            const option = document.createElement("option");
            option.value = field;
            option.textContent = field;
            fieldSelect.appendChild(option);

            defaultRules[field] = rules[field] || "";
        });

        GM_setValue(
            `autocompleted-countrySelectionRules_${countrySelection}_temp`,
            JSON.stringify(defaultRules)
        );

        fieldSelect.addEventListener("change", () => {
            loadExistingRule();
        });

        // Rule input
        const ruleLabel = document.createElement("label");
        ruleLabel.textContent = "Rule:";
        ruleLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #24292f;
        `;

        const ruleTextarea = document.createElement("textarea");
        ruleTextarea.id = "rule-textarea";
        ruleTextarea.placeholder = "Enter your rule here...";
        ruleTextarea.style.cssText = `
        width: 90%;
        min-height: 100px;
        padding: 8px 12px;
        border: 1px solid #d0d7de;
        border-radius: 6px;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
        margin-bottom: 20px;
        `;

        ruleTextarea.addEventListener("change", (event) => {
            const fieldSelect = document.getElementById("rule-field-select");
            const selectedField = fieldSelect.value;
            const ruleText = event.target.value.trim();

            const rulesString = GM_getValue(
                `autocompleted-countrySelectionRules_${countrySelection}_temp`,
                "{}"
            );
            const rules = JSON.parse(rulesString);

            rules[selectedField] = ruleText;

            GM_setValue(
                `autocompleted-countrySelectionRules_${countrySelection}_temp`,
                JSON.stringify(rules)
            );
        });

        // Buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        `;

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #d0d7de;
        background: white;
        color: #24292f;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        `;
        cancelBtn.addEventListener("click", () => {
            GM_deleteValue(
                `autocompleted-countrySelectionRules_${countrySelection}_temp`
            );
            closeModal();
        });

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save Rule";
        saveBtn.style.cssText = `
        padding: 8px 16px;
        background: #0969da;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        `;
        saveBtn.addEventListener("click", () => {
            saveRule();
        });

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(saveBtn);

        modalContent.appendChild(fieldLabel);
        modalContent.appendChild(fieldSelect);
        modalContent.appendChild(ruleLabel);
        modalContent.appendChild(ruleTextarea);
        modalContent.appendChild(buttonContainer);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close on backdrop click
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        return modal;
    }

    function loadExistingRule() {
        const fieldSelect = document.getElementById("rule-field-select");
        const ruleTextarea = document.getElementById("rule-textarea");

        if (!fieldSelect || !ruleTextarea) return;

        const selectedField = fieldSelect.value;
        if (!selectedField) {
            ruleTextarea.value = "";
            return;
        }

        // Get existing rules for current country
        const rulesString = GM_getValue(
            `autocompleted-countrySelectionRules_${countrySelection}_temp`,
            "{}"
        );
        const rules = JSON.parse(rulesString);

        if (rules[selectedField]) {
            ruleTextarea.value = rules[selectedField];
        } else {
            ruleTextarea.value = "";
        }
    }

    function closeModal() {
        const modal = document.getElementById("autocompleted-modal");
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    // Environment detection
    function detectContext() {
        isVerification = window.location.href.endsWith("verification");
        const kybRootId = "KYBMFComponent";
        isKyb = isVerification && !!document.getElementById(kybRootId);

        if (isVerification) {
            // Old UI country text
            const el = isKyb
                ? document.getElementById(kybRootId)
                : document.querySelector("td.country-name");
            if (el) {
                const text = isKyb
                    ? document.querySelector(
                        "[data-testid=country-selection-inputbox] #search"
                    )?.value
                    : el.textContent;
                countrySelection = text ? text.toUpperCase() : null;
            }
        } else {
            // New UI country is in search input as "Country (code)"
            const searchInput = document.querySelector('input[name="search"]');
            if (searchInput) {
                const m = searchInput.value.match(/^(.+?) \(/);
                if (m) countrySelection = m[1].toUpperCase();
            }
        }
    }

    // Field discovery (ported)
    function getOldUIFields() {
        const selectors = [
            ".mat-input",
            "[id^=number-range-field-]",
            "[id^=option-field-]",
            "[id^=number-range-picker]",
            "input.form-control",
        ];
        const fields = [
            ...new Set(
                selectors.flatMap((selector) =>
                    Array.from(document.querySelectorAll(selector)).map((item) =>
                        (item.getAttribute("id") || "").split("-").pop()
                    )
                )
            ),
        ].filter(Boolean);

        const refIndex = fields.indexOf("Customer Reference ID");
        if (refIndex !== -1) fields.splice(refIndex, 1);
        return fields;
    }

    function getNewUIFields() {
        const fields = [
            ...new Set(
                Array.from(document.querySelectorAll(".form-control"))
                    .map((item) => item.getAttribute("name"))
                    .slice(1)
            ),
        ].filter(Boolean);

        const searchIndex = fields.indexOf("search");
        if (searchIndex !== -1) {
            isSearchFieldExisting = true;
            fields.splice(searchIndex, 1);

            const searchFields = document.querySelectorAll(
                '[data-testid$="-search-field"]'
            );
            searchFields.forEach((sf) => {
                const field = sf.getAttribute("data-testid").split("-").shift().trim();
                fields.push(field);
            });
        }
        return fields;
    }

    function getFormFields() {
        if (isVerification) return getOldUIFields();
        return getNewUIFields();
    }

    // Parsing and filling (ported)
    const invalidFieldValues = new Set([
        "null",
        "none",
        "na",
        "n/a",
        "",
        "undefined",
        "unspecified",
        "unknown",
        "not applicable",
        "not available",
        "not provided",
    ]);

    function transformResultsToMap(entries) {
        return entries.reduce((acc, entry) => ({
            ...acc,
            [entry.fieldName]: entry.value
        }), {});
    }

    function handleSelectField(selectEl, responseMap) {
        const options = selectEl.querySelectorAll("option");
        let optionIndex = -1;
        const field = (selectEl.getAttribute("id") || "").split("-").pop();
        const value = responseMap[field];

        switch (field) {
            case "MonthOfBirth": {
                const month = normalizeMonthOfBirth(value);
                optionIndex = Array.from(options).findIndex(
                    (o) => normalizeMonthOfBirth(o.getAttribute("value")) === month
                );
                break;
            }
            case "Gender":
                optionIndex = Array.from(options).findIndex((o) =>
                    compareGender(o.getAttribute("value"), value)
                );
                break;
            default:
                optionIndex = Array.from(options).findIndex((o) =>
                    compareStrings(o.getAttribute("value"), value)
                );
                break;
        }
        if (optionIndex >= 0) {
            options[optionIndex].selected = true;
        }
    }

    function rejectSearchFields() {
        if (!isSearchFieldExisting) return;
        const icons = document.querySelectorAll("[data-icon=xmark]");
        if (icons.length > 1) {
            for (let i = 1; i < icons.length; i++) {
                icons[i].dispatchEvent(
                    new MouseEvent("click", { bubbles: true, cancellable: true })
                );
            }
        }
    }

    function handleSearchField(responseMap) {
        if (!isSearchFieldExisting) return;
        document.querySelectorAll("input[name=search]").forEach((searchInput) => {
            searchInput.click();
            document.querySelectorAll("[id$=-dropdown-menu]").forEach((dropDown) => {
                const options = dropDown.querySelectorAll(
                    "[data-testid*=-dropdown-row-]"
                );
                const field = dropDown.getAttribute("id").split("-").shift().trim();
                const value = responseMap[field];
                let option = null;

                switch (field) {
                    case "countrySelection":
                        break;
                    case "MonthOfBirth": {
                        const month = normalizeMonthOfBirth(value);
                        option = Array.from(options).find(
                            (opt) => normalizeMonthOfBirth(opt.textContent) === month
                        );
                        break;
                    }
                    case "Gender":
                        option = Array.from(options).find((opt) =>
                            compareGender(opt.textContent, value)
                        );
                        break;
                    default:
                        option = Array.from(options).find((opt) =>
                            compareStrings(opt.textContent, value)
                        );
                        break;
                }
                if (option) {
                    option.dispatchEvent(
                        new MouseEvent("click", { bubbles: true, cancellable: true })
                    );
                }
            });
        });
    }

    function resetFormFields() {
        const excludedFieldsSet = getExcludedFieldSet();
        const fields = getFormFields();
        fields.forEach((field) => {
            const control = document.querySelector(
                `[name="${field}"], [id$="${field}"]`
            );
            if (!control || shouldSkipField(field, control, excludedFieldsSet)) return;
            if (control.tagName.toLowerCase() === "select") {
                control.selectedIndex = 0;
            } else {
                control.value = "";
            }
            control.dispatchEvent(new Event("change", { bubbles: true }));
        });
        rejectSearchFields();
    }

    function clickTestTransactionCheckboxes() {
        if (isVerification) {
            // Old UI
            const consentText = "I agree T&C*";
            document
                .querySelectorAll('div:has(+ label input[type="checkbox"])')
                .forEach((div) => {
                    if (!div.textContent.includes(consentText)) return;
                    const checkbox = div.nextElementSibling?.querySelector(
                        'input[type="checkbox"]'
                    );
                    if (checkbox?.checked === false) checkbox.click();
                });

            const TEST_TRANSACTION_TEXT = "Run A Test Transaction";
            document
                .querySelectorAll('input[type="checkbox"] ~ span')
                .forEach((span) => {
                    if (!span.textContent.includes(TEST_TRANSACTION_TEXT)) return;
                    const checkbox = span.previousElementSibling?.previousElementSibling;
                    if (checkbox?.type === "checkbox" && !checkbox.checked)
                        checkbox.click();
                });
        } else {
            // New UI
            const TEST_TRANSACTION_TEXT = "Run a Test Transaction";
            setTimeout(() => {
                document.querySelectorAll('input[type="checkbox"] + p').forEach((p) => {
                    if (!p.textContent.includes(TEST_TRANSACTION_TEXT)) return;
                    const checkbox = p.previousElementSibling;
                    if (checkbox?.type === "checkbox" && !checkbox.checked)
                        checkbox.click();
                });
            }, CLICK_DELAY_MS);
        }
    }

    function setNativeValue(el, value) {
        const prototype = Object.getPrototypeOf(el);
        const desc = Object.getOwnPropertyDescriptor(prototype, "value");
        if (desc && desc.set) {
            desc.set.call(el, value);
        } else {
            el.value = value;
        }
    }

    function commitInput(el) {
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function setControlValue(control, value, responseMap) {
        const tag = control.tagName.toLowerCase();
        if (tag === "select") {
            handleSelectField(control, responseMap);
            commitInput(control);
            return;
        }

        if (tag === "input") {
            const type = (control.getAttribute("type") || "").toLowerCase();
            if (type === "checkbox") {
                const desired =
                    value === true || String(value).toLowerCase() === "true";
                if (control.checked !== desired) {
                    control.click(); // click toggles and triggers events in most frameworks
                }
                return;
            }
            if (type === "radio") {
                const name = control.getAttribute("name");
                const radios = document.querySelectorAll(
                    `input[type="radio"][name="${name}"]`
                );
                const match = Array.from(radios).find(
                    (r) =>
                        compareStrings(r.value, value) ||
                        compareStrings(r.id, value) ||
                        compareStrings(r.getAttribute("data-value") || "", value)
                );
                if (match && !match.checked) {
                    match.click();
                }
                return;
            }
        }

        // Default: text-like controls
        control.focus();
        setNativeValue(control, value);
        commitInput(control);
        control.blur();
    }

    function fillFormFields(responseMap) {
        resetFormFields();
        handleSearchField(responseMap);
        const excludedFieldsSet = getExcludedFieldSet();

        if (isVerification) {
            if (responseMap.MonthOfBirth) {
                const idx = dobMonthOpts.findIndex(
                    (m) =>
                        normalizeMonthOfBirth(m.text) ===
                        normalizeMonthOfBirth(responseMap.MonthOfBirth)
                );
                if (idx !== -1) {
                    responseMap.MonthOfBirth = dobMonthOpts[idx].value;
                }
            }
        } else {
            // new UI already handled by clickTestTransactionCheckboxes()
        }

        for (const [key, value] of Object.entries(responseMap)) {
            const control = document.querySelector(`[name="${key}"], [id$="${key}"]`);
            if (!control || shouldSkipField(key, control, excludedFieldsSet)) continue;

            setControlValue(control, value, responseMap);
        }
    }

    // Network
    // Simple top progress bar for network activity
    const netProgress = (() => {
        let activeCount = 0;
        let barEl = null;
        let timerId = null;
        function ensureStyles() {
            if (document.getElementById("tmk-progress-style")) return;
            const style = document.createElement("style");
            style.id = "tmk-progress-style";
            style.textContent = `
                #tmk-progress-container { position: fixed; top: 0; left: 0; width: 100%; height: 3px; z-index: 2147483647; pointer-events: none; }
                #tmk-progress-bar { width: 0%; height: 100%; background: linear-gradient(90deg, #29d, #3af); box-shadow: 0 0 10px rgba(41,157,255,.7); transition: width .2s ease; }
            `;
            document.head.appendChild(style);
        }
        function createBar() {
            if (barEl) return;
            ensureStyles();
            const container = document.createElement("div");
            container.id = "tmk-progress-container";
            const bar = document.createElement("div");
            bar.id = "tmk-progress-bar";
            container.appendChild(bar);
            document.documentElement.appendChild(container);
            barEl = bar;
        }
        function startTimer() {
            if (timerId) return;
            timerId = window.setInterval(() => {
                if (!barEl) return;
                const current = parseFloat(barEl.style.width || "0");
                const target = current < 80 ? current + Math.random() * 5 + 3 : current < 90 ? current + Math.random() * 2 + 1 : current;
                barEl.style.width = Math.min(90, target) + "%";
            }, 300);
        }
        function clearTimer() {
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            }
        }
        return {
            start() {
                activeCount += 1;
                if (activeCount === 1) {
                    createBar();
                    barEl.style.width = "0%";
                    startTimer();
                }
            },
            end() {
                if (activeCount > 0) activeCount -= 1;
                if (activeCount === 0 && barEl) {
                    clearTimer();
                    barEl.style.width = "100%";
                    setTimeout(() => {
                        const container = document.getElementById("tmk-progress-container");
                        if (container && container.parentNode) container.parentNode.removeChild(container);
                        barEl = null;
                    }, 200);
                }
            },
        };
    })();

    function postJson(url, body) {
        return new Promise((resolve, reject) => {
            netProgress.start();
            GM_xmlhttpRequest({
                method: "POST",
                url,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(body),
                onload: (res) => { netProgress.end(); resolve(res); },
                onerror: (err) => { netProgress.end(); reject(err); },
                ontimeout: () => { netProgress.end(); reject(new Error("Timeout")); },
            });
        });
    }

    async function parseDataToStructuredFormat(fields) {
        const clipboardText = await navigator.clipboard.readText();
        if (!clipboardText || !clipboardText.trim()) {
            throw new Error("Clipboard is empty");
        }
        const payload = {
            fields: fields,
            unstructuredData: clipboardText,
        };
        const res = await postJson(
            `${config.BACKEND_ENDPOINT}/api/parse-data-to-structured-format`,
            payload
        );

        if(res.status === 200) {
            return JSON.parse(res.responseText);
        }
        throw new Error(res.responseText);
    }

    async function fetchDummyData(fields, countrySelection) {
        const rules = GM_getValue(
            `autocompleted-countrySelectionRules_${countrySelection}`,
            "{}"
        );

        const cached_value = GM_getValue(
            `autocompleted_${countrySelection}_${fields.join(",")}_${rules}`
        );

        if (cached_value && config.enableCachedResponses) {
            return JSON.parse(cached_value);
        }

        const rulesSpec = Object.entries(rules)
        .filter(([_, value]) => value !== "")
        .map(([key, value]) => ({
            fieldName: key,
            ruleSpecification: value
        }));

        const payload = {
            country: countrySelection,
            fields: fields.filter((field) => !shouldSkipField(field, null, getExcludedFieldSet(true))),
            rules: rulesSpec,
        };
        const res = await postJson(
            `${config.BACKEND_ENDPOINT}/api/dummy-data-generator`,
            payload
        );

        if(res.status === 200) {
            const result = JSON.parse(res.responseText);
            if (config.enableCachedResponses)
            {
                GM_setValue(
                    `autocompleted_${countrySelection}_${fields.join(",")}_${rules}`,
                    JSON.stringify(result)
                );
            }
            return result;
        }
        throw new Error(res.responseText);
    }

    // Wait for fields to be available
    async function waitForFields(timeoutMs = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            const fields = getFormFields();
            if (fields && fields.length > 0) return fields;
            await new Promise((r) => setTimeout(r, 150));
        }
        return getFormFields();
    }

    function saveRule() {
        const rulesString = GM_getValue(
            `autocompleted-countrySelectionRules_${countrySelection}_temp`,
            "{}"
        );

        if (rulesString === "{}") {
            closeModal();
            return;
        }

        GM_setValue(
            `autocompleted-countrySelectionRules_${countrySelection}`,
            rulesString
        );

        GM_deleteValue(
            `autocompleted-countrySelectionRules_${countrySelection}_temp`
        );

        closeModal();
    }

    function openRuleModal() {
        createModal();
    }

    async function clickFillButon() {
        const target = document.querySelector('#content');
        if (!target) {
            throw new Error("Target not found.");
        }
        console.log(target);
        const canvas = await html2canvas(target,{
            allowTaint: true,
            logging: true,
            useCORS: true,
        });
        const base64Image = canvas.toDataURL("image/png");
        console.log(base64Image);

        const btn = document.getElementById("autocompleted-button-fill");
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = "0.6";
            btn.style.cursor = "not-allowed";
            btn.textContent = "Auto Fill…";
        }
        try {
            detectContext();
            const fields = await waitForFields();
            if (!fields || fields.length === 0) {
                throw new Error("No fields detected.");
            }
            if (!countrySelection) {
                throw new Error("Country selection not found.");
            }
            clickTestTransactionCheckboxes();

            const results = await fetchDummyData(fields, countrySelection);
            const parsed = transformResultsToMap(results);
            fillFormFields(parsed);

            // Retry search fields after a delay to let dropdowns mount
            await new Promise((r) => setTimeout(r, 150));
            handleSearchField(parsed);
            // Re-enable on success
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = "";
                btn.style.cursor = "pointer";
                btn.textContent = "Auto Fill";
            }
        } catch (e) {
            console.error(e);
            alert("Auto Fill failed: " + (e?.message || e));
        }
    }

    // UI trigger
    function addFillButton() {
        const btn = document.createElement("button");
        btn.id = "autocompleted-button-fill";
        btn.textContent = "Auto Fill";
        btn.style.cssText = `
            position: fixed;
            z-index: 999999;
            bottom: 20px;
            right: 20px;
            background: #1f6feb;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px 14px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            font-size: 14px;
        `;
        btn.addEventListener("click", clickFillButon);
        document.body.appendChild(btn);
    }

    async function clickPasteAndFillButton() {
        const btn = document.getElementById("autocompleted-button-paste-and-fill");
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = "0.6";
            btn.style.cursor = "not-allowed";
            btn.textContent = "Paste & Fill…";
        }
        try {
            detectContext();
            const fields = await waitForFields();
            if (!fields || fields.length === 0) {
                throw new Error("No fields detected.");
            }
            clickTestTransactionCheckboxes();

            const results = await parseDataToStructuredFormat(fields);
            const parsed = transformResultsToMap(results);
            fillFormFields(parsed);

            await new Promise((r) => setTimeout(r, 150));
            handleSearchField(parsed);
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = "";
                btn.style.cursor = "pointer";
                btn.textContent = "Paste & Fill";
            }
        } catch (e) {
            console.error(e);
            alert("Paste & Fill failed: " + (e?.message || e));
        }
    }

    function addPasteAndFillButton() {
        const btn = document.createElement("button");
        btn.id = "autocompleted-button-paste-and-fill";
        btn.textContent = "Paste & Fill";
        btn.style.cssText = `
            position: fixed;
            z-index: 999999;
            bottom: 20px;
            right: 120px;
            background: #6e40c9;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px 14px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            font-size: 14px;
        `;
        btn.addEventListener("click", clickPasteAndFillButton);
        document.body.appendChild(btn);
    }

    function addCreateRuleButton() {
        const btn = document.createElement("button");
        btn.id = "autocompleted-button-create-rule";
        btn.textContent = "Configure Rule";
        btn.style.cssText = `
            position: fixed;
            z-index: 999999;
            bottom: 20px;
            right: 235px;
            background: #d97706;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px 14px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            font-size: 14px;
        `;
        btn.addEventListener("click", () => {
            openRuleModal();
        });
        document.body.appendChild(btn);
    }

    function registerMenuCommands() {
        GM_registerMenuCommand("Open Settings", () => {
            createSettingsPanel();
        });
        GM_registerMenuCommand("Configure Rule", () => {
            openRuleModal();
        });
    }

    function initialize() {
        loadConfig();

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initialize);
            return;
        }

        registerMenuCommands();
        detectContext();

        if (config.showUiButtons) {
            addFillButton();
            addPasteAndFillButton();
            addCreateRuleButton();
        }

        document.addEventListener("keydown", async function (zEvent) {
            let consumed = false;
            if (
                zEvent.ctrlKey &&
                zEvent.shiftKey &&
                !zEvent.altKey &&
                !zEvent.metaKey
            ) {
                switch (zEvent.code) {
                    case "KeyF": // Search
                        await clickFillButon();
                        consumed = true;
                        break;
                    case "KeyV": // Paste
                        await clickPasteAndFillButton();
                        consumed = true;
                        break;
                    default:
                        break;
                }
            }
            if (consumed) {
                zEvent.stopPropagation();
                zEvent.preventDefault();
            }
        });
    }

    initialize();
})();
