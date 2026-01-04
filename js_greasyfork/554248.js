// ==UserScript==
// @name         pia autofill
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically fills and saves application data using separate Fill and Save buttons.
// @author       Misaka_ZeroTwo
// @match        https://va.pia.jp/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554248/pia%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/554248/pia%20autofill.meta.js
// ==/UserScript==

// --- CONFIGURATION ---
const STORAGE_KEY = 'piaAutofillData';

// === DEFAULT USER DATA (Used if no data in localStorage) ===
// NOTE: Use a unique variable name to avoid confusion with the loaded data
const defaultFormData = {
    // お客様情報 (Customer Info)
    cstmr_lnm: '山田',      // 姓 (Last Name/Family Name)
    cstmr_fnm: '太郎',      // 名 (First Name/Given Name)
    cstmr_lkn: 'ヤマダ',    // セイ (Last Name Katakana)
    cstmr_fkn: 'タロウ',    // メイ (First Name Katakana)

    // 性別 (Gender): '2': Female, '1': Male, '8': Others, '9': Prefer not answer
    sex_typ: '1',

    // 生年月日 (Date of Birth) - Use options from the select menus
    birth_yyyy: '1990',
    birth_mm: '05',
    birth_dd: '25',

    // 電話番号 (Phone Number)
    telno1: '090',
    telno2: '1234',
    telno3: '5678',

    // Email Address
    email: 'test@example.com',

    // Address (All address fields use 'cmnt' names)
    postcode1: '221',       // 郵便番号上3桁 - cmnt01
    postcode2: '0013',      // 郵便番号下4桁 - cmnt02
    prefecture: '神奈川県',   // 都道府県 - cmnt11 (MUST MATCH AN <option> VALUE)
    city: '横浜市神奈川区',         // 市町村 - cmnt12
    district: '新子安',   // 町名 - cmnt13
    street: '4-5-6'         // 丁目・番地・号 - cmnt14
};

// =================================================================
// --- HELPER FUNCTIONS ---
// =================================================================

/**
 * Helper function to set value and trigger change events on form elements.
 */
const setInputValue = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) {
        element.value = value;
        // Crucial for form validation to think a user typed the info
        ['input', 'change'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
        });
        return true;
    }
    return false;
};

/**
 * Helper function to get value from a form element.
 */
const getInputValue = (selector, isRadio = false) => {
    if (isRadio) {
        // For radio buttons, we want the value of the CHECKED one
        const checkedRadio = document.querySelector(`${selector}:checked`);
        return checkedRadio ? checkedRadio.value : '';
    }
    const element = document.querySelector(selector);
    return element ? element.value : '';
};


// =================================================================
// --- LOCALSTORAGE & DATA MANAGEMENT ---
// =================================================================

/**
 * Loads form data from localStorage, falling back to default data if empty.
 * @returns {Object} The form data.
 */
function loadFormData() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            console.log("Data loaded from localStorage.");
            return JSON.parse(storedData);
        }
    } catch (e) {
        console.error("Error loading from localStorage:", e);
    }
    console.log("No data found in localStorage. Using default data.");
    return defaultFormData;
}

/**
 * Saves the provided data into localStorage.
 * @param {Object} data - The data object to save.
 */
function saveFormData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log("✅ Form data saved to localStorage.");
        alert("✅ Current form data saved successfully!");
    } catch (e) {
        console.error("Error saving to localStorage:", e);
        alert("🚨 Failed to save data. Please check the console.");
    }
}


// =================================================================
// --- FILL & RETRIEVE LOGIC ---
// =================================================================

/**
 * Fills the form using the provided data.
 * @param {Object} data - The data object to fill the form with.
 */
function fillForm(data) {
    console.clear();
    console.log("🚀 Starting form fill...");

    // Existing Fields (cstmr prefix)
    setInputValue('input[name="cstmr_lnm"]', data.cstmr_lnm);
    setInputValue('input[name="cstmr_fnm"]', data.cstmr_fnm);
    setInputValue('input[name="cstmr_lkn"]', data.cstmr_lkn);
    setInputValue('input[name="cstmr_fkn"]', data.cstmr_fkn);
    setInputValue('select[name="birth_yyyy"]', data.birth_yyyy);
    setInputValue('select[name="birth_mm"]', data.birth_mm);
    setInputValue('select[name="birth_dd"]', data.birth_dd);
    setInputValue('input[name="telno1"]', data.telno1);
    setInputValue('input[name="telno2"]', data.telno2);
    setInputValue('input[name="telno3"]', data.telno3);

    // Radio Button (Sex/Gender)
    const sexRadio = document.querySelector(`input[name="sex_typ"][value="${data.sex_typ}"]`);
    if (sexRadio) {
        sexRadio.checked = true;
        sexRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Email Address (ml_addr and ml_addr_cnfm)
    setInputValue('input[name="ml_addr"]', data.email);
    setInputValue('input[name="ml_addr_cnfm"]', data.email); // Fills confirm email too!

    // Postcode (cmnt01 and cmnt02)
    setInputValue('input[name="cmnt01"]', data.postcode1);
    setInputValue('input[name="cmnt02"]', data.postcode2);

    // Address (cmnt11, cmnt12, cmnt13, and cmnt14)
    setInputValue('select[name="cmnt11"]', data.prefecture); // Prefecture (Select dropdown)
    setInputValue('input[name="cmnt12"]', data.city);        // City/Ward (Text input)
    setInputValue('input[name="cmnt13"]', data.district);    // District (Text input)
    setInputValue('input[name="cmnt14"]', data.street);      // Street/Apartment (Text input - cmnt14)

    console.log("✅ Autofill script completed. You can now edit and save the form data.");
}

/**
 * Retrieves the current form data from the page fields.
 * @returns {Object} The data object containing current field values.
 */
function retrieveForm() {
    return {
        cstmr_lnm: getInputValue('input[name="cstmr_lnm"]'),
        cstmr_fnm: getInputValue('input[name="cstmr_fnm"]'),
        cstmr_lkn: getInputValue('input[name="cstmr_lkn"]'),
        cstmr_fkn: getInputValue('input[name="cstmr_fkn"]'),
        sex_typ: getInputValue('input[name="sex_typ"]', true), // isRadio = true
        birth_yyyy: getInputValue('select[name="birth_yyyy"]'),
        birth_mm: getInputValue('select[name="birth_mm"]'),
        birth_dd: getInputValue('select[name="birth_dd"]'),
        telno1: getInputValue('input[name="telno1"]'),
        telno2: getInputValue('input[name="telno2"]'),
        telno3: getInputValue('input[name="telno3"]'),
        email: getInputValue('input[name="ml_addr"]'), // Using the main email field
        postcode1: getInputValue('input[name="cmnt01"]'),
        postcode2: getInputValue('input[name="cmnt02"]'),
        prefecture: getInputValue('select[name="cmnt11"]'),
        city: getInputValue('input[name="cmnt12"]'),
        district: getInputValue('input[name="cmnt13"]'),
        street: getInputValue('input[name="cmnt14"]'),
    };
}


// =================================================================
// --- BUTTON LOGIC AND INITIALIZATION ---
// =================================================================

const buttonContainer = document.createElement('div');
buttonContainer.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    display: flex; /* Use flexbox to align buttons */
    gap: 10px;    /* Space between buttons */
`;

const baseButtonStyle = `
    padding: 10px 15px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

// 1. Create the FILL button
const fillButton = document.createElement('button');
fillButton.id = 'autofill-script-fill-button';
fillButton.textContent = '🚀 Autofill Form';
fillButton.style.cssText = baseButtonStyle + `background-color: #007bff;`; // Blue

fillButton.addEventListener('click', () => {
    // 1. Load data from storage (or default)
    const data = loadFormData();

    // 2. Fill the form
    fillForm(data);

    // 3. Show the save button
    saveButton.style.display = 'block';
});

// 2. Create the SAVE button
const saveButton = document.createElement('button');
saveButton.id = 'autofill-script-save-button';
saveButton.textContent = '💾 Save Edits';
saveButton.style.cssText = baseButtonStyle + `background-color: #28a745;`; // Green

saveButton.addEventListener('click', () => {
    // 1. Retrieve current data from form fields
    const currentData = retrieveForm();

    // 2. Save the retrieved data to storage
    saveFormData(currentData);
});

// 3. Initial state: Hide the save button
saveButton.style.display = 'none';

// 4. Add buttons to the container
buttonContainer.appendChild(fillButton);
buttonContainer.appendChild(saveButton);

// 5. Add the container to the page body
document.body.appendChild(buttonContainer);

console.log('Autofill and Save buttons added. Click "🚀 Autofill Form" first. The "💾 Save Edits" button will appear after filling.');