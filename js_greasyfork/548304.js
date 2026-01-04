// ==UserScript==
// @name         Amazon Review Toolkit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Complete review writing toolkit with Unicode formatting, templates, phrases, auto-save, and cloud sync
// @author       Prismaris
// @match        https://www.amazon.com/review/review-your-purchases*
// @match        https://www.amazon.com/review/create-review*
// @match        https://www.amazon.com/reviews/edit-review/*
// @match        https://www.amazon.ca/review/review-your-purchases*
// @match        https://www.amazon.ca/review/create-review*
// @match        https://www.amazon.ca/reviews/edit-review/*
// @match        https://www.amazon.co.uk/review/review-your-purchases*
// @match        https://www.amazon.co.uk/review/create-review*
// @match        https://www.amazon.co.uk/reviews/edit-review/*
// @match        https://www.amazon.de/review/review-your-purchases*
// @match        https://www.amazon.de/review/create-review*
// @match        https://www.amazon.de/reviews/edit-review/*
// @match        https://www.amazon.fr/review/review-your-purchases*
// @match        https://www.amazon.fr/review/create-review*
// @match        https://www.amazon.fr/reviews/edit-review/*
// @match        https://www.amazon.it/review/review-your-purchases*
// @match        https://www.amazon.it/review/create-review*
// @match        https://www.amazon.it/reviews/edit-review/*
// @match        https://www.amazon.es/review/review-your-purchases*
// @match        https://www.amazon.es/review/create-review*
// @match        https://www.amazon.es/reviews/edit-review/*
// @match        https://www.amazon.co.jp/review/review-your-purchases*
// @match        https://www.amazon.co.jp/review/create-review*
// @match        https://www.amazon.co.jp/reviews/edit-review/*
// @match        https://www.amazon.in/review/review-your-purchases*
// @match        https://www.amazon.in/review/create-review*
// @match        https://www.amazon.in/reviews/edit-review/*
// @match        https://www.amazon.com.au/review/review-your-purchases*
// @match        https://www.amazon.com.au/review/create-review*
// @match        https://www.amazon.com.au/reviews/edit-review/*
// @grant        GM_xmlhttpRequest
// @connect      pastebin.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548304/Amazon%20Review%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/548304/Amazon%20Review%20Toolkit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles
    const styles = `
        #reviewText {
            min-height: 28em !important;
            /* height: 28em !important; */
            resize: vertical;
        }
        .unicode-toolbar {
            position: relative;
            z-index: 10;
            display: flex;
            gap: 8px;
            margin-bottom: 6px;
            align-items: center;
        }
        .unicode-toolbar button {
            position: relative;
            overflow: hidden;
            will-change: transform, background-color;
            font-size: 1.1em;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid #bbb;
            background: #f8f8f8;
            cursor: pointer;
            transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
            outline: none;
            user-select: none;
        }
        .unicode-toolbar button:active {
            transform: scale(0.95);
        }
        .unicode-toolbar button:focus {
            outline: 2px solid #1976d2;
            outline-offset: 2px;
        }
        .unicode-toolbar button[aria-pressed="true"] {
            background-color: #1976d2 !important;
            color: #fff !important;
        }
        .unicode-toolbar button[aria-pressed="false"] {
            background-color: #f8f8f8 !important;
            color: inherit !important;
        }
        .unicode-toolbar button {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        /* Drag-and-drop highlight for media upload */
        .in-context-ryp__form-field--mediaUploadInput--custom-wrapper.dragover {
            outline: 2px solid #2196f3 !important;
            box-shadow: 0 0 0 2px #2196f3 !important;
            background: #e3f2fd !important;
            transition: outline 0.2s, box-shadow 0.2s, background 0.2s;
        }
        /* Pastebin popover styles */
        .pastebin-popover {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            min-width: 200px;
            display: none;
            font-size: 14px;
        }
        .pastebin-popover.show {
            display: block;
        }
        .pastebin-popover-item {
            padding: 8px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.15s;
        }
        .pastebin-popover-item:hover {
            background: #f5f5f5;
        }
        .pastebin-popover-item:first-child {
            border-radius: 6px 6px 0 0;
        }
        .pastebin-popover-item:last-child {
            border-radius: 0 0 6px 6px;
        }
        .pastebin-popover-item:not(:last-child) {
            border-bottom: 1px solid #eee;
        }
        .pastebin-popover-item.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .pastebin-popover-item.disabled:hover {
            background: transparent;
        }
        /* Configuration modal styles */
        .pastebin-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
        }
        .pastebin-modal.show {
            display: flex;
        }
        .pastebin-modal-content {
            background: white;
            border-radius: 8px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .pastebin-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .pastebin-modal-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        .pastebin-modal-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.15s;
        }
        .pastebin-modal-close:hover {
            background: #f5f5f5;
        }
        .pastebin-form-group {
            margin-bottom: 16px;
        }
        .pastebin-form-label {
            display: block;
            font-weight: 500;
            margin-bottom: 4px;
            color: #333;
        }
        .pastebin-form-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }
        .pastebin-form-input:focus {
            outline: none;
            border-color: #1976d2;
            box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
        }
        .pastebin-form-input[readonly] {
            background: #f8f8f8;
            color: #666;
        }
        .pastebin-form-help {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }
        .pastebin-form-help a {
            color: #1976d2;
            text-decoration: none;
        }
        .pastebin-form-help a:hover {
            text-decoration: underline;
        }
        .pastebin-form-actions {
            display: flex;
            gap: 8px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        .pastebin-btn {
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f8f8f8;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.15s;
            min-width: 100px;
        }
        .pastebin-btn:hover {
            background: #e8e8e8;
        }
        .pastebin-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .pastebin-btn-primary {
            background: #1976d2;
            color: white;
            border-color: #1976d2;
        }
        .pastebin-btn-primary:hover {
            background: #1565c0;
        }
        /* Sync status indicators */
        .template-sync-status {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-left: 6px;
        }
        .sync-status-synced { background: #4caf50; }
        .sync-status-pending { background: #ff9800; }
        .sync-status-failed { background: #f44336; }
        .sync-status-none { background: #ccc; }
        /* Loading spinner */
        .pastebin-loading {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #1976d2;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 6px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        /* Template manager modal styles */
        .template-manager-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
        }
        .template-manager-modal.show {
            display: flex;
        }
        .template-manager-content {
            background: white;
            border-radius: 8px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .template-manager-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .template-manager-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        .template-manager-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.15s;
        }
        .template-manager-close:hover {
            background: #f5f5f5;
        }
        .template-manager-body {
            max-height: 400px;
            overflow-y: auto;
        }
        .template-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .template-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            background: #fafafa;
            transition: all 0.15s;
        }
        .template-item:hover {
            background: #f5f5f5;
            border-color: #ccc;
        }
        .template-info {
            flex: 1;
            min-width: 0;
        }
        .template-name {
            font-weight: 500;
            margin-bottom: 4px;
            color: #333;
        }
        .template-preview {
            font-size: 12px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .template-actions {
            display: flex;
            gap: 8px;
            margin-left: 12px;
        }
        .template-btn {
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.15s;
            min-width: 32px;
        }
        .template-btn:hover {
            background: #f0f0f0;
        }
        .template-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .template-insert-btn:hover {
            background: #e8f5e8;
            border-color: #4caf50;
        }
        .template-delete-btn:hover {
            background: #ffe8e8;
            border-color: #f44336;
        }
        .no-templates {
            text-align: center;
            color: #666;
            font-style: italic;
            padding: 40px 20px;
        }
        /* Tab styles */
        .template-manager-tabs {
            display: flex;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
        }
        .tab-btn {
            background: none;
            border: none;
            padding: 12px 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #666;
            border-bottom: 2px solid transparent;
            transition: all 0.15s;
        }
        .tab-btn:hover {
            background: #f5f5f5;
            color: #333;
        }
        .tab-btn.active {
            color: #1976d2;
            border-bottom-color: #1976d2;
            background: #f8f9fa;
        }
        .tab-content {
            animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    // Inject CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Add CSS for uploading state
    const uploadStyle = document.createElement('style');
    uploadStyle.textContent = `
        .amazon-uploading {
            position: relative;
        }
        .amazon-uploading .google-photos-btn,
        .amazon-uploading .amazon-dnd-dragtext,
        .amazon-uploading [aria-label="Add a photo"],
        .amazon-uploading .add-photo-btn,
        .amazon-uploading > div, /* fallback for + button */
        .amazon-uploading > button {
            opacity: 0.2 !important;
            pointer-events: none !important;
            filter: blur(1px);
        }
        .amazon-uploading .amazon-dnd-pastetext {
            opacity: 1 !important;
            filter: none !important;
        }
    `;
    document.head.appendChild(uploadStyle);

    // --- PASTEBIN API CONFIGURATION ---
    const PASTEBIN_CONFIG = {
        API_URL: 'https://pastebin.com/api/api_post.php',
        LOGIN_URL: 'https://pastebin.com/api/api_login.php',
        API_DEV_KEY: null,
        API_USER_KEY: null,
        API_USER_NAME: null,
        API_USER_PASSWORD: null,
        PASTE_FORMAT: 'text',
        PASTE_PRIVACY: '0', // 0=public, 1=unlisted, 2=private
        PASTE_EXPIRE: 'N'   // N=never, 10M=10 minutes, 1H=1 hour, 1D=1 day, 1W=1 week, 2W=2 weeks, 1M=1 month, 6M=6 months, 1Y=1 year
    };

    // Load configuration from localStorage
    function loadPastebinConfig() {
        try {
            const saved = localStorage.getItem('amazon_pastebin_config');
            if (saved) {
                const config = JSON.parse(saved);
                PASTEBIN_CONFIG.API_DEV_KEY = config.api_dev_key || null;
                PASTEBIN_CONFIG.API_USER_KEY = config.api_user_key || null;
                PASTEBIN_CONFIG.API_USER_NAME = config.api_user_name || null;
                PASTEBIN_CONFIG.API_USER_PASSWORD = config.api_user_password || null;
            }
        } catch (e) {
            console.error('Error loading Pastebin config:', e);
        }
    }

    // Save configuration to localStorage
    function savePastebinConfig() {
        try {
            const config = {
                api_dev_key: PASTEBIN_CONFIG.API_DEV_KEY,
                api_user_key: PASTEBIN_CONFIG.API_USER_KEY,
                api_user_name: PASTEBIN_CONFIG.API_USER_NAME,
                api_user_password: PASTEBIN_CONFIG.API_USER_PASSWORD
            };
            localStorage.setItem('amazon_pastebin_config', JSON.stringify(config));
        } catch (e) {
            console.error('Error saving Pastebin config:', e);
        }
    }

    // Generate API User Key using Pastebin login API
    async function generatePastebinUserKey(username, password) {
        if (!PASTEBIN_CONFIG.API_DEV_KEY) {
            throw new Error('API Dev Key is required to generate User Key');
        }

        const data = {
            api_dev_key: PASTEBIN_CONFIG.API_DEV_KEY,
            api_user_name: username,
            api_user_password: password
        };

        // Convert to URLSearchParams for proper encoding
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params.append(key, value);
            }
        });

        console.log('Generating Pastebin User Key for username:', username);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: PASTEBIN_CONFIG.LOGIN_URL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: params.toString(),
                onload: function(response) {
                    const result = response.responseText.trim();
                    console.log('Pastebin login response:', result);

                    // Check for API errors
                    if (result.startsWith('Bad API request')) {
                        console.error('Pastebin login failed:', result);
                        reject(new Error(`Login failed: ${result}`));
                        return;
                    }

                    // Check if response looks like a valid user key (32 character hex string)
                    if (result.length === 32 && /^[a-f0-9]+$/i.test(result)) {
                        console.log('Successfully generated User Key');
                        resolve(result);
                    } else {
                        console.error('Unexpected login response format:', result);
                        reject(new Error('Invalid response from Pastebin login API'));
                    }
                },
                onerror: function(error) {
                    console.error('Pastebin login request failed:', error);
                    reject(new Error('Network error during login. Please check your internet connection.'));
                }
            });
        });
    }

    // Check if Pastebin is configured
    function isPastebinConfigured() {
        const hasKey = !!(PASTEBIN_CONFIG.API_DEV_KEY);
        if (hasKey) {
            console.log('Pastebin API configured with dev key length:', PASTEBIN_CONFIG.API_DEV_KEY.length);
            console.log('Dev key format looks valid:', /^[a-zA-Z0-9_-]+$/.test(PASTEBIN_CONFIG.API_DEV_KEY));
        }
        return hasKey;
    }

    // --- PASTEBIN API FUNCTIONS ---
    async function pastebinRequest(data) {
        if (!isPastebinConfigured()) {
            throw new Error('Pastebin API not configured');
        }

        // Prepare the request data with proper parameter names
        const requestData = {
            api_dev_key: PASTEBIN_CONFIG.API_DEV_KEY,
            ...data
        };

        // Convert to URLSearchParams for proper encoding
        const params = new URLSearchParams();
        Object.entries(requestData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params.append(key, value);
            }
        });

        console.log('Sending Pastebin API request to:', PASTEBIN_CONFIG.API_URL);
        console.log('Request params:', params.toString());
        console.log('Dev key being used:', PASTEBIN_CONFIG.API_DEV_KEY.substring(0, 10) + '...');

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: PASTEBIN_CONFIG.API_URL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: params.toString(),
                onload: function(response) {
                    const result = response.responseText;
                    console.log('Pastebin API response status:', response.status);
                    console.log('Pastebin API response:', result);
                    console.log('Response length:', result.length);

                    // Check for API errors
                    if (result.startsWith('Bad API request')) {
                        console.error('Pastebin API returned error:', result);
                        reject(new Error(`Pastebin API Error: ${result}`));
                        return;
                    }

                    // Check if response looks like an error page
                    if (result.includes('cors-anywhere') ||
                        result.includes('Access-Control-Allow-Origin') ||
                        result.includes('/corsdemo') ||
                        result.length < 10) {
                        console.error('Unexpected response format:', result);
                        reject(new Error('Unexpected response from Pastebin API. Please check your API keys.'));
                        return;
                    }

                    console.log('Pastebin API request successful, response:', result);
                    resolve(result);
                },
                onerror: function(error) {
                    console.error('Pastebin API request failed:', error);
                    reject(new Error('Network error. Please check your internet connection and try again.'));
                }
            });
        });
    }

    // Create a new paste
    async function createPastebinPaste(name, content, isReview = false) {
        const data = {
            api_option: 'paste',
            api_paste_code: content,
            api_paste_name: isReview ? name : `Amazon Review Template: ${name}`,
            api_paste_format: isReview ? 'json' : PASTEBIN_CONFIG.PASTE_FORMAT,
            api_paste_private: PASTEBIN_CONFIG.PASTE_PRIVACY,
            api_paste_expire_date: PASTEBIN_CONFIG.PASTE_EXPIRE
        };

        // Add user key if available (required for private pastes)
        if (PASTEBIN_CONFIG.API_USER_KEY) {
            data.api_user_key = PASTEBIN_CONFIG.API_USER_KEY;
        }

        console.log('Creating paste with data:', { ...data, api_paste_code: '[content]' });
        const response = await pastebinRequest(data);
        console.log('Raw paste response:', response);

        // Validate the response
        if (!response || response.includes('Bad API request') || response.includes('error')) {
            throw new Error(`Pastebin API error: ${response}`);
        }

        // Extract paste key from response
        let pasteKey;
        if (response.startsWith('https://pastebin.com/')) {
            // Response is a full URL, extract the key
            pasteKey = response.split('/').pop();
            console.log('Extracted paste key from URL:', pasteKey);
        } else {
            // Response is already a paste key
            pasteKey = response;
        }

        // Validate the paste key format
        if (!pasteKey || pasteKey.length !== 8) {
            throw new Error(`Invalid paste key format. Expected 8 characters, got: ${pasteKey}`);
        }

        return pasteKey;
    }

    // Note: Pastebin API does not support updating existing pastes
    // The updatePastebinPaste function has been removed as it's not functional
    // Instead, we use delete + recreate approach for all paste updates:
    // - Template updates: delete old paste, create new one
    // - Review updates: delete old paste, create new one  
    // - Phrase sync: delete old phrases paste, create new one

    // Delete a paste
    async function deletePastebinPaste(pasteKey) {
        if (!PASTEBIN_CONFIG.API_USER_KEY) {
            throw new Error('User key required for deleting pastes');
        }

        const data = {
            api_option: 'delete',
            api_user_key: PASTEBIN_CONFIG.API_USER_KEY,
            api_paste_key: pasteKey
        };

        const result = await pastebinRequest(data);
        return result === 'Paste deleted successfully';
    }

    // Get paste content
    async function getPastebinPaste(pasteKey) {
        const data = {
            api_option: 'show_paste',
            api_paste_key: pasteKey
        };

        // Add user key if available (required for private pastes)
        if (PASTEBIN_CONFIG.API_USER_KEY) {
            data.api_user_key = PASTEBIN_CONFIG.API_USER_KEY;
        }

        const content = await pastebinRequest(data);
        return content;
    }

    // List user's pastes
    async function listUserPastes() {
        if (!PASTEBIN_CONFIG.API_USER_KEY) {
            throw new Error('User key required for listing pastes');
        }

        const data = {
            api_option: 'list',
            api_user_key: PASTEBIN_CONFIG.API_USER_KEY,
            api_results_limit: 100
        };

        const result = await pastebinRequest(data);

        // Parse XML result
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(result, 'text/xml');
        const pastes = xmlDoc.getElementsByTagName('paste');

        console.log('Raw XML result:', result);
        console.log('XML parsing result:', xmlDoc);
        console.log('Found paste elements:', pastes);
        console.log('Number of paste elements:', pastes.length);

        const pasteList = [];
        console.log(`Processing ${pastes.length} pastes from Pastebin API...`);
        
        // If XML parsing didn't work properly, try manual parsing as fallback
        if (pastes.length === 0 || pastes.length === 1) {
            console.log('XML parsing may have failed, trying manual parsing...');
            
            // Manual parsing using regex
            const pasteMatches = result.match(/<paste>([\s\S]*?)<\/paste>/g);
            if (pasteMatches) {
                console.log(`Manual parsing found ${pasteMatches.length} pastes`);
                
                for (let i = 0; i < pasteMatches.length; i++) {
                    const pasteXml = pasteMatches[i];
                    console.log(`Manual parsing paste ${i + 1}:`, pasteXml);
                    
                    const titleMatch = pasteXml.match(/<paste_title>([^<]+)<\/paste_title>/);
                    const keyMatch = pasteXml.match(/<paste_key>([^<]+)<\/paste_key>/);
                    const dateMatch = pasteXml.match(/<paste_date>([^<]+)<\/paste_date>/);
                    
                    if (titleMatch && keyMatch && dateMatch) {
                        const title = titleMatch[1];
                        const key = keyMatch[1];
                        const date = dateMatch[1];
                        
                        console.log(`  Manual extracted - Title: "${title}", Key: "${key}", Date: "${date}"`);
                        
                        // Include both Amazon Review Template pastes and review pastes
                        if (title.startsWith('Amazon Product:') && title.includes(' — REVIEW — ')) {
                            // This is a review paste (has the new Amazon Product prefix and review indicator)
                            console.log(`  -> Categorizing as REVIEW (has Amazon Product prefix and review indicator)`);
                            pasteList.push({
                                key: key,
                                title: title.replace('Amazon Product: ', ''),
                                date: parseInt(date) * 1000, // Convert to milliseconds
                                type: 'review'
                            });
                        } else if (title.startsWith('Amazon Review Template:') && title.includes(' — REVIEW — ')) {
                            // This is an old review paste (has old prefix and review indicator) - for backward compatibility
                            console.log(`  -> Categorizing as REVIEW (has old Amazon Review Template prefix and review indicator)`);
                            pasteList.push({
                                key: key,
                                title: title.replace('Amazon Review Template: ', ''),
                                date: parseInt(date) * 1000, // Convert to milliseconds
                                type: 'review'
                            });
                        } else if (title.startsWith('Amazon Review Template:')) {
                            // This is a template paste (has prefix but no review indicator)
                            console.log(`  -> Categorizing as TEMPLATE (has prefix but no review indicator)`);
                            pasteList.push({
                                key: key,
                                title: title.replace('Amazon Review Template: ', ''),
                                date: parseInt(date) * 1000, // Convert to milliseconds
                                type: 'template'
                            });
                        } else if (title.includes(' — REVIEW — ')) {
                            // This is a review paste (no prefix but has review indicator)
                            console.log(`  -> Categorizing as REVIEW (no prefix but has review indicator)`);
                            pasteList.push({
                                key: key,
                                title: title,
                                date: parseInt(date) * 1000, // Convert to milliseconds
                                type: 'review'
                            });
                        } else {
                            console.log(`  -> Skipping (doesn't match any criteria)`);
                        }
                    }
                }
            }
        } else {
            // Use normal XML parsing
            for (let i = 0; i < pastes.length; i++) {
                const paste = pastes[i];
                console.log(`Processing paste element ${i}:`, paste);
                
                const titleElement = paste.getElementsByTagName('paste_title')[0];
                const keyElement = paste.getElementsByTagName('paste_key')[0];
                const dateElement = paste.getElementsByTagName('paste_date')[0];
                
                const title = titleElement?.textContent || '';
                const key = keyElement?.textContent || '';
                const date = dateElement?.textContent || '';

                console.log(`  Title element:`, titleElement);
                console.log(`  Key element:`, keyElement);
                console.log(`  Date element:`, dateElement);
                console.log(`  Extracted values - Title: "${title}", Key: "${key}", Date: "${date}"`);

                console.log(`Processing paste ${i + 1}: "${title}"`);

                // Include both Amazon Review Template pastes and review pastes
                if (title.startsWith('Amazon Product:') && title.includes(' — REVIEW — ')) {
                    // This is a review paste (has the new Amazon Product prefix and review indicator)
                    console.log(`  -> Categorizing as REVIEW (has Amazon Product prefix and review indicator)`);
                    pasteList.push({
                        key: key,
                        title: title.replace('Amazon Product: ', ''),
                        date: parseInt(date) * 1000, // Convert to milliseconds
                        type: 'review'
                    });
                } else if (title.startsWith('Amazon Review Template:') && title.includes(' — REVIEW — ')) {
                    // This is an old review paste (has old prefix and review indicator) - for backward compatibility
                    console.log(`  -> Categorizing as REVIEW (has old Amazon Review Template prefix and review indicator)`);
                    pasteList.push({
                        key: key,
                        title: title.replace('Amazon Review Template: ', ''),
                        date: parseInt(date) * 1000, // Convert to milliseconds
                        type: 'review'
                    });
                } else if (title.startsWith('Amazon Review Template:')) {
                    // This is a template paste (has prefix but no review indicator)
                    console.log(`  -> Categorizing as TEMPLATE (has prefix but no review indicator)`);
                    pasteList.push({
                        key: key,
                        title: title.replace('Amazon Review Template: ', ''),
                        date: parseInt(date) * 1000, // Convert to milliseconds
                        type: 'template'
                    });
                } else if (title.includes(' — REVIEW — ')) {
                    // This is a review paste (no prefix but has review indicator)
                    console.log(`  -> Categorizing as REVIEW (no prefix but has review indicator)`);
                    pasteList.push({
                        key: key,
                        title: title,
                        date: parseInt(date) * 1000, // Convert to milliseconds
                        type: 'review'
                    });
                } else {
                    console.log(`  -> Skipping (doesn't match any criteria)`);
                }
            }
        }

        console.log(`Final paste list has ${pasteList.length} items:`, pasteList);

        return pasteList;
    }

    // Test API connection
    async function testPastebinConnection() {
        try {
            if (!isPastebinConfigured()) {
                return { success: false, message: 'API not configured' };
            }

            console.log('Testing Pastebin connection with dev key:', PASTEBIN_CONFIG.API_DEV_KEY);
            console.log('User key available:', !!PASTEBIN_CONFIG.API_USER_KEY);

            // Try a simple test first - just check if we can get a response
            const testData = {
                api_option: 'paste',
                api_paste_code: 'Test connection',
                api_paste_name: 'Test',
                api_paste_format: 'text',
                api_paste_private: '0',
                api_paste_expire_date: 'N'
            };

            // Add user key if available
            if (PASTEBIN_CONFIG.API_USER_KEY) {
                testData.api_user_key = PASTEBIN_CONFIG.API_USER_KEY;
            }

            console.log('Sending test request with data:', testData);

            // Try to create a test paste
            const testKey = await createPastebinPaste('Test Connection', 'This is a test paste to verify API connection.');

            console.log('Test paste created successfully with key:', testKey);

            // Try to delete the test paste
            if (PASTEBIN_CONFIG.API_USER_KEY) {
                await deletePastebinPaste(testKey);
                console.log('Test paste deleted successfully');
            }

            return { success: true, message: 'Connection successful' };
        } catch (error) {
            console.error('Test connection failed:', error);

            // Provide specific error messages
            if (error.message.includes('Network error')) {
                return {
                    success: false,
                    message: 'Network error. Please check your internet connection and try again.'
                };
            } else if (error.message.includes('Bad API request')) {
                return {
                    success: false,
                    message: `API Error: ${error.message}. Please check your API keys.`
                };
            } else if (error.message.includes('Unexpected response')) {
                return {
                    success: false,
                    message: 'Unexpected response from Pastebin API. Please check your API keys.'
                };
            }

            return { success: false, message: error.message };
        }
    }

    // Load configuration on script start
    loadPastebinConfig();

    // --- Unicode Style Maps ---
    // a-z and A-Z
    const unicodeMaps = {
        bold: {
            A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭',
            a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇'
        },
        boldserif: {
            A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',M:'𝐌',N:'𝐍',O:'𝐎',P:'𝐏',Q:'𝐐',R:'𝐑',S:'𝐒',T:'𝐓',U:'𝐔',V:'𝐕',W:'𝐖',X:'𝐗',Y:'𝐘',Z:'𝐙',
            a:'𝐚',b:'𝐛',c:'𝐜',d:'𝐝',e:'𝐞',f:'𝐟',g:'𝐠',h:'𝐡',i:'𝐢',j:'𝐣',k:'𝐤',l:'𝐥',m:'𝐦',n:'𝐧',o:'𝐨',p:'𝐩',q:'𝐪',r:'𝐫',s:'𝐬',t:'𝐭',u:'𝐮',v:'𝐯',w:'𝐰',x:'𝐱',y:'𝐲',z:'𝐳'
        },
        italic: {
            A:'𝘐',B:'𝘉',C:'𝘊',D:'𝘋',E:'𝘌',F:'𝘍',G:'𝘎',H:'𝘏',I:'𝘐',J:'𝘑',K:'𝘒',L:'𝘓',M:'𝘔',N:'𝘕',O:'𝘖',P:'𝘗',Q:'𝘘',R:'𝘙',S:'𝘚',T:'𝘛',U:'𝘜',V:'𝘝',W:'𝘞',X:'𝘟',Y:'𝘠',Z:'𝘡',
            a:'𝘢',b:'𝘣',c:'𝘤',d:'𝘥',e:'𝘦',f:'𝘧',g:'𝘨',h:'𝘩',i:'𝘪',j:'𝘫',k:'𝘬',l:'𝘭',m:'𝘮',n:'𝘯',o:'𝘰',p:'𝘱',q:'𝘲',r:'𝘳',s:'𝘴',t:'𝘵',u:'𝘶',v:'𝘷',w:'𝘸',x:'𝘹',y:'𝘺',z:'𝘻'
        },
        bolditalic: {
            A:'𝘼',B:'𝘽',C:'𝘾',D:'𝘿',E:'𝙀',F:'𝙁',G:'𝙂',H:'𝙃',I:'𝙄',J:'𝙅',K:'𝙆',L:'𝙇',M:'𝙈',N:'𝙉',O:'𝙊',P:'𝙋',Q:'𝙌',R:'𝙍',S:'𝙎',T:'𝙏',U:'𝙐',V:'𝙑',W:'𝙒',X:'𝙓',Y:'𝙔',Z:'𝙕',
            a:'𝙖',b:'𝙗',c:'𝙘',d:'𝙙',e:'𝙚',f:'𝙛',g:'𝙜',h:'𝙝',i:'𝙞',j:'𝙟',k:'𝙠',l:'𝙡',m:'𝙢',n:'𝙣',o:'𝙤',p:'𝙥',q:'𝙦',r:'𝙧',s:'𝙨',t:'𝙩',u:'𝙪',v:'𝙫',w:'𝙬',x:'𝙭',y:'𝙮',z:'𝙯'
        },
        serif: {
            A:'𝐴',B:'𝐵',C:'𝐶',D:'𝐷',E:'𝐸',F:'𝐹',G:'𝐺',H:'𝐻',I:'𝐼',J:'𝐽',K:'𝐾',L:'𝐿',M:'𝑀',N:'𝑁',O:'𝑂',P:'𝑃',Q:'𝑄',R:'𝑅',S:'𝑆',T:'𝑇',U:'𝑈',V:'𝑉',W:'𝑊',X:'𝑋',Y:'𝑌',Z:'𝑍',
            a:'𝑎',b:'𝑏',c:'𝑐',d:'𝑑',e:'𝑒',f:'𝑓',g:'𝑔',h:'ℎ',i:'𝑖',j:'𝑗',k:'𝑘',l:'𝑙',m:'𝑚',n:'𝑛',o:'𝑜',p:'𝑝',q:'𝑞',r:'𝑟',s:'𝑠',t:'𝑡',u:'𝑢',v:'𝑣',w:'𝑤',x:'𝑥',y:'𝑦',z:'𝑧'
        },
        serifitalic: {
            A:'𝐴',B:'𝐵',C:'𝐶',D:'𝐷',E:'𝐸',F:'𝐹',G:'𝐺',H:'𝐻',I:'𝐼',J:'𝐽',K:'𝐾',L:'𝐿',M:'𝑀',N:'𝑁',O:'𝑂',P:'𝑃',Q:'𝑄',R:'𝑅',S:'𝑆',T:'𝑇',U:'𝑈',V:'𝑉',W:'𝑊',X:'𝑋',Y:'𝑌',Z:'𝑍',
            a:'𝑎',b:'𝑏',c:'𝑐',d:'𝑑',e:'𝑒',f:'𝑓',g:'𝑔',h:'ℎ',i:'𝑖',j:'𝑗',k:'𝑘',l:'𝑙',m:'𝑚',n:'𝑛',o:'𝑜',p:'𝑝',q:'𝑞',r:'𝑟',s:'𝑠',t:'𝑡',u:'𝑢',v:'𝑣',w:'𝑤',x:'𝑥',y:'𝑦',z:'𝑧'
        },
        serifbolditalic: {
            A:'𝑨',B:'𝑩',C:'𝑪',D:'𝑫',E:'𝑬',F:'𝑭',G:'𝑮',H:'𝑯',I:'𝑰',J:'𝑱',K:'𝑲',L:'𝑳',M:'𝑴',N:'𝑵',O:'𝑶',P:'𝑷',Q:'𝑸',R:'𝑹',S:'𝑺',T:'𝑻',U:'𝑼',V:'𝑽',W:'𝑾',X:'𝑿',Y:'𝒀',Z:'𝒁',
            a:'𝒂',b:'𝒃',c:'𝒄',d:'𝒅',e:'𝒆',f:'𝒇',g:'𝒈',h:'𝒉',i:'𝒊',j:'𝒋',k:'𝒌',l:'𝒍',m:'𝒎',n:'𝒏',o:'𝒐',p:'𝒑',q:'𝒒',r:'𝒓',s:'𝒔',t:'𝒕',u:'𝒖',v:'𝒗',w:'𝒘',x:'𝒙',y:'𝒚',z:'𝒛'
        },
        cursive: {
            A:'𝓐',B:'𝓑',C:'𝓒',D:'𝓓',E:'𝓔',F:'𝓕',G:'𝓖',H:'𝓗',I:'𝓘',J:'𝓙',K:'𝓚',L:'𝓛',M:'𝓜',N:'𝓝',O:'𝓞',P:'𝓟',Q:'𝓠',R:'𝓡',S:'𝓢',T:'𝓣',U:'𝓤',V:'𝓥',W:'𝓦',X:'𝓧',Y:'𝓨',Z:'𝓩',
            a:'𝒶',b:'𝒷',c:'𝒸',d:'𝒹',e:'𝑒',f:'𝒻',g:'𝑔',h:'𝒽',i:'𝒾',j:'𝒿',k:'𝓀',l:'𝓁',m:'𝓂',n:'𝓃',o:'𝑜',p:'𝓅',q:'𝓆',r:'𝓇',s:'𝓈',t:'𝓉',u:'𝓊',v:'𝓋',w:'𝓌',x:'𝓍',y:'𝓎',z:'𝓏'
        },
        cursivebold: {
            A:'𝓐',B:'𝓑',C:'𝓒',D:'𝓓',E:'𝓔',F:'𝓕',G:'𝓖',H:'𝓗',I:'𝓘',J:'𝓙',K:'𝓚',L:'𝓛',M:'𝓜',N:'𝓝',O:'𝓞',P:'𝓟',Q:'𝓠',R:'𝓡',S:'𝓢',T:'𝓣',U:'𝓤',V:'𝓥',W:'𝓦',X:'𝓧',Y:'𝓨',Z:'𝓩',
            a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃'
        },
        superscript: {
            A:'ᴬ',B:'ᴮ',C:'ᶜ',D:'ᴰ',E:'ᴱ',F:'ᶠ',G:'ᴳ',H:'ᴴ',I:'ᴵ',J:'ᴶ',K:'ᴷ',L:'ᴸ',M:'ᴹ',N:'ᴺ',O:'ᴼ',P:'ᴾ',R:'ᴿ',S:'ˢ',T:'ᵀ',U:'ᵁ',V:'ⱽ',W:'ᵂ',X:'ˣ',Y:'ʸ',Z:'ᶻ',
            a:'ᵃ',b:'ᵇ',c:'ᶜ',d:'ᵈ',e:'ᵉ',f:'ᶠ',g:'ᵍ',h:'ʰ',i:'ᶦ',j:'ʲ',k:'ᵏ',l:'ˡ',m:'ᵐ',n:'ⁿ',o:'ᵒ',p:'ᵖ',r:'ʳ',s:'ˢ',t:'ᵗ',u:'ᵘ',v:'ᵛ',w:'ʷ',x:'ˣ',y:'ʸ',z:'ᶻ'
        },
        underline: {
            A:'A͟',B:'B͟',C:'C͟',D:'D͟',E:'E͟',F:'F͟',G:'G͟',H:'H͟',I:'I͟',J:'J͟',K:'K͟',L:'L͟',M:'M͟',N:'N͟',O:'O͟',P:'P͟',Q:'Q͟',R:'R͟',S:'S͟',T:'T͟',U:'U͟',V:'V͟',W:'W͟',X:'X͟',Y:'Y͟',Z:'Z͟',
            a:'a͟',b:'b͟',c:'c͟',d:'d͟',e:'e͟',f:'f͟',g:'g͟',h:'h͟',i:'i͟',j:'j͟',k:'k͟',l:'l͟',m:'m͟',n:'n͟',o:'o͟',p:'p͟',q:'q͟',r:'r͟',s:'s͟',t:'t͟',u:'u͟',v:'v͟',w:'w͟',x:'x͟',y:'y͟',z:'z͟'
        },
        monospace: {
            A:'𝙰',B:'𝙱',C:'𝙲',D:'𝙳',E:'𝙴',F:'𝙵',G:'𝙶',H:'𝙷',I:'𝙸',J:'𝙹',K:'𝙺',L:'𝙻',M:'𝙼',N:'𝙽',O:'𝙾',P:'𝙿',Q:'𝚀',R:'𝚁',S:'𝚂',T:'𝚃',U:'𝚄',V:'𝚅',W:'𝚆',X:'𝚇',Y:'𝚈',Z:'𝚉',
            a:'𝚊',b:'𝚋',c:'𝚌',d:'𝚍',e:'𝚎',f:'𝚏',g:'𝚐',h:'𝚑',i:'𝚒',j:'𝚓',k:'𝚔',l:'𝚕',m:'𝚖',n:'𝚗',o:'𝚘',p:'𝚙',q:'𝚚',r:'𝚛',s:'𝚜',t:'𝚝',u:'𝚞',v:'𝚟',w:'𝚠',x:'𝚡',y:'𝚢',z:'𝚣'
        },
        wide: {
            A:'Ａ',B:'Ｂ',C:'Ｃ',D:'Ｄ',E:'Ｅ',F:'Ｆ',G:'Ｇ',H:'Ｈ',I:'Ｉ',J:'Ｊ',K:'Ｋ',L:'Ｌ',M:'Ｍ',N:'Ｎ',O:'Ｏ',P:'Ｐ',Q:'Ｑ',R:'Ｒ',S:'Ｓ',T:'Ｔ',U:'Ｕ',V:'Ｖ',W:'Ｗ',X:'Ｘ',Y:'Ｙ',Z:'Ｚ',
            a:'ａ',b:'ｂ',c:'ｃ',d:'ｄ',e:'ｅ',f:'ｆ',g:'ｇ',h:'ｈ',i:'ｉ',j:'ｊ',k:'ｋ',l:'ｌ',m:'ｍ',n:'ｎ',o:'ｏ',p:'ｐ',q:'ｑ',r:'ｒ',s:'ｓ',t:'ｔ',u:'ｕ',v:'ｖ',w:'ｗ',x:'ｘ',y:'ｙ',z:'ｚ'
        },
        strikethrough: {
            A:'A̶',B:'B̶',C:'C̶',D:'D̶',E:'E̶',F:'F̶',G:'G̶',H:'H̶',I:'I̶',J:'J̶',K:'K̶',L:'L̶',M:'M̶',N:'N̶',O:'O̶',P:'P̶',Q:'Q̶',R:'R̶',S:'S̶',T:'T̶',U:'U̶',V:'V̶',W:'W̶',X:'X̶',Y:'Y̶',Z:'Z̶',
            a:'a̶',b:'b̶',c:'c̶',d:'d̶',e:'e̶',f:'f̶',g:'g̶',h:'h̶',i:'i̶',j:'j̶',k:'k̶',l:'l̶',m:'m̶',n:'n̶',o:'o̶',p:'p̶',q:'q̶',r:'r̶',s:'s̶',t:'t̶',u:'u̶',v:'v̶',w:'w̶',x:'x̶',y:'y̶',z:'z̶'
        }
    };

    // --- Style Combination Logic ---
    const styleCombinationMap = [
        { styles: ['superscript'], key: 'superscript' },
        { styles: ['underline'], key: 'underline' },
        { styles: ['monospace'], key: 'monospace' },
        { styles: ['wide'], key: 'wide' },
        { styles: ['strikethrough'], key: 'strikethrough' },
        { styles: ['cursive', 'bold'], key: 'cursivebold' },
        { styles: ['cursive'], key: 'cursive' },
        { styles: ['serif', 'bold', 'italic'], key: 'serifbolditalic' },
        { styles: ['serif', 'bold'], key: 'boldserif' },
        { styles: ['serif', 'italic'], key: 'serifitalic' },
        { styles: ['serif'], key: 'serif' },
        { styles: ['bold', 'italic'], key: 'bolditalic' },
        { styles: ['bold'], key: 'bold' },
        { styles: ['italic'], key: 'italic' }
    ];

    function stylize(text, styles) {
        if (styles.size === 0) return text;
        for (const combo of styleCombinationMap) {
            if (combo.styles.every(s => styles.has(s)) && combo.styles.length === styles.size) {
                const map = unicodeMaps[combo.key];
                if (!map) return text;
                return [...text].map(ch => map[ch] || ch).join('');
            }
        }
        return text;
    }

    function detectAppliedStyles(text) {
        const detectedStyles = new Set();
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const two_chars = text.substring(i, i + 2);
            let styleFound = false;

            for (const [styleName, styleMap] of Object.entries(unicodeMaps)) {
                for (const [ascii, unicode] of Object.entries(styleMap)) {
                    let match = false;
                    if (unicode.length === 1 && char === unicode) {
                        match = true;
                    } else if (unicode.length > 1 && two_chars === unicode) {
                        match = true;
                    }

                    if (match) {
                        if (unicode.length > 1) i++;

                        if (styleName === 'bold') detectedStyles.add('bold');
                        else if (styleName === 'italic') detectedStyles.add('italic');
                        else if (styleName === 'serif') detectedStyles.add('serif');
                        else if (styleName === 'cursive') detectedStyles.add('cursive');
                        else if (styleName === 'superscript') detectedStyles.add('superscript');
                        else if (styleName === 'underline') detectedStyles.add('underline');
                        else if (styleName === 'monospace') detectedStyles.add('monospace');
                        else if (styleName === 'wide') detectedStyles.add('wide');
                        else if (styleName === 'strikethrough') detectedStyles.add('strikethrough');
                        else if (styleName === 'boldserif') {
                            detectedStyles.add('bold');
                            detectedStyles.add('serif');
                        } else if (styleName === 'bolditalic') {
                            detectedStyles.add('bold');
                            detectedStyles.add('italic');
                        } else if (styleName === 'serifitalic') {
                            detectedStyles.add('serif');
                            detectedStyles.add('italic');
                        } else if (styleName === 'serifbolditalic') {
                            detectedStyles.add('serif');
                            detectedStyles.add('bold');
                            detectedStyles.add('italic');
                        } else if (styleName === 'cursivebold') {
                            detectedStyles.add('cursive');
                            detectedStyles.add('bold');
                        }
                        styleFound = true;
                        break;
                    }
                }
                if(styleFound) break;
            }
        }
        return detectedStyles;
    }

    function convertToPlainText(text) {
        let plainText = text;
        for (const [mapName, map] of Object.entries(unicodeMaps)) {
            for (const [ascii, uni] of Object.entries(map)) {
                plainText = plainText.replace(new RegExp(uni.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ascii);
            }
        }
        return plainText;
    }

    // --- Toolbar UI ---
    function createToolbar(textarea) {
        const toolbar = document.createElement('div');
        toolbar.className = 'unicode-toolbar';
        toolbar.style.display = 'flex';
        toolbar.style.gap = '8px';
        toolbar.style.marginBottom = '6px';
        toolbar.style.alignItems = 'center';

        // --- TEMPLATE FEATURE ---
        // Enhanced template storage helpers with cloud sync support
        function getTemplates() {
            try {
                return JSON.parse(localStorage.getItem('amazon_review_templates') || '[]');
            } catch (e) { return []; }
        }
        function saveTemplates(templates) {
            localStorage.setItem('amazon_review_templates', JSON.stringify(templates));
        }

        // --- PHRASE STORAGE FUNCTIONS ---
        function getPhrases() {
            try {
                return JSON.parse(localStorage.getItem('amazon_review_phrases') || '[]');
            } catch (e) { return []; }
        }
        
        function savePhrases(phrases) {
            localStorage.setItem('amazon_review_phrases', JSON.stringify(phrases));
        }
        
        async function upsertPhrase(name, text) {
            let phrases = getPhrases();
            const idx = phrases.findIndex(p => p.name === name);
            const now = Date.now();
            
            if (idx !== -1) {
                // Update existing phrase
                phrases[idx].text = text;
                phrases[idx].lastModified = now;
                phrases[idx].syncStatus = 'pending';
            } else {
                // Create new phrase
                const newPhrase = {
                    name: name,
                    text: text,
                    lastModified: now,
                    syncStatus: 'none'
                };
                phrases.push(newPhrase);
            }
            
            savePhrases(phrases);
            
            // Sync to cloud if configured
            if (isPastebinConfigured()) {
                try {
                    await syncPhrasesToCloud();
                } catch (error) {
                    console.error('Failed to sync phrases to cloud:', error);
                }
            }
            
            return phrases[idx !== -1 ? idx : phrases.length - 1];
        }
        
        function getPhraseByName(name) {
            return getPhrases().find(p => p.name === name);
        }
        
        async function removePhrase(name) {
            let phrases = getPhrases();
            phrases = phrases.filter(p => p.name !== name);
            savePhrases(phrases);
            
            // Sync to cloud if configured
            if (isPastebinConfigured()) {
                try {
                    await syncPhrasesToCloud();
                } catch (error) {
                    console.error('Failed to sync phrases to cloud:', error);
                }
            }
        }

        // Enhanced template structure with cloud sync support
        async function upsertTemplate(name, text, height) {
            let templates = getTemplates();
            const idx = templates.findIndex(t => t.name === name);
            const now = Date.now();

            if (idx !== -1) {
                // Update existing template
                templates[idx].text = text;
                templates[idx].height = height;
                templates[idx].lastModified = now;
                templates[idx].syncStatus = 'pending';

                // Update cloud paste if it exists (using delete + recreate since Pastebin doesn't support updates)
                if (templates[idx].pasteCode && isPastebinConfigured()) {
                    try {
                        // Delete old paste and create new one
                        await deletePastebinPaste(templates[idx].pasteCode);
                        const newPasteCode = await createPastebinPaste(name, JSON.stringify({
                            name: name,
                            text: text,
                            height: height,
                            lastModified: now
                        }));
                        templates[idx].pasteCode = newPasteCode;
                        templates[idx].syncStatus = 'synced';
                        templates[idx].lastSynced = now;
                    } catch (error) {
                        console.error('Failed to update cloud template:', error);
                        templates[idx].syncStatus = 'failed';
                    }
                }
            } else {
                // Create new template
                const newTemplate = {
                    name: name,
                    text: text,
                    height: height,
                    lastModified: now,
                    syncStatus: 'none',
                    pasteCode: null,
                    lastSynced: null
                };

                // Create cloud paste if configured
                if (isPastebinConfigured()) {
                    try {
                        const pasteCode = await createPastebinPaste(name, JSON.stringify(newTemplate));
                        newTemplate.pasteCode = pasteCode;
                        newTemplate.syncStatus = 'synced';
                        newTemplate.lastSynced = now;
                    } catch (error) {
                        console.error('Failed to create cloud template:', error);
                        newTemplate.syncStatus = 'failed';
                    }
                }

                templates.push(newTemplate);
            }

            saveTemplates(templates);
            return templates[idx !== -1 ? idx : templates.length - 1];
        }

        function getTemplateByName(name) {
            return getTemplates().find(t => t.name === name);
        }

        async function removeTemplate(name) {
            let templates = getTemplates();
            const template = templates.find(t => t.name === name);

            if (template && template.pasteCode && isPastebinConfigured()) {
                try {
                    await deletePastebinPaste(template.pasteCode);
                } catch (error) {
                    console.error('Failed to delete cloud template:', error);
                }
            }

            templates = templates.filter(t => t.name !== name);
            saveTemplates(templates);
        }

        // --- PHRASE CLOUD SYNC FUNCTIONS ---
        async function syncPhrasesToCloud() {
            if (!isPastebinConfigured()) {
                throw new Error('Pastebin API not configured');
            }

            const phrases = getPhrases();
            if (phrases.length === 0) {
                console.log('No phrases to sync');
                return { success: true, message: 'No phrases to sync' };
            }

            // Create aggregated phrases data
            const phrasesData = {
                version: '1.0',
                lastUpdated: new Date().toISOString(),
                phrases: phrases.map(p => ({
                    name: p.name,
                    text: p.text,
                    lastModified: p.lastModified || Date.now()
                }))
            };

            try {
                // Check if phrases paste already exists
                const existingPhrasesPaste = await findPhrasesPaste();
                
                if (existingPhrasesPaste) {
                    // Pastebin API doesn't support updates, so we must delete and recreate
                    console.log('Deleting existing phrases paste and recreating...');
                    try {
                        await deletePastebinPaste(existingPhrasesPaste.key);
                        console.log('Successfully deleted old phrases paste');
                    } catch (deleteError) {
                        console.warn('Failed to delete old phrases paste, continuing with recreation:', deleteError);
                    }
                }

                // Create new paste (either first time or after deletion)
                const pasteCode = await createPastebinPaste('Amazon Review Phrases', JSON.stringify(phrasesData, null, 2));
                console.log('Created new phrases paste with key:', pasteCode);

                // Mark all phrases as synced
                phrases.forEach(phrase => phrase.syncStatus = 'synced');
                savePhrases(phrases);

                return { success: true, message: 'Phrases synced successfully' };
            } catch (error) {
                console.error('Failed to sync phrases:', error);
                // Mark phrases as failed
                phrases.forEach(phrase => {
                    if (phrase.syncStatus === 'pending') {
                        phrase.syncStatus = 'failed';
                    }
                });
                savePhrases(phrases);
                throw error;
            }
        }

        async function findPhrasesPaste() {
            try {
                const pastes = await listUserPastes();
                return pastes.find(paste => 
                    paste.type === 'template' && 
                    paste.title === 'Amazon Review Phrases'
                );
            } catch (error) {
                console.error('Error finding phrases paste:', error);
                return null;
            }
        }

        async function syncPhrasesFromCloud() {
            if (!isPastebinConfigured() || !PASTEBIN_CONFIG.API_USER_KEY) {
                throw new Error('Pastebin API not configured or user key missing');
            }

            try {
                const phrasesPaste = await findPhrasesPaste();
                if (!phrasesPaste) {
                    return { imported: 0, updated: 0, message: 'No phrases found in cloud' };
                }

                const content = await getPastebinPaste(phrasesPaste.key);
                const phrasesData = JSON.parse(content);

                if (!phrasesData.phrases || !Array.isArray(phrasesData.phrases)) {
                    throw new Error('Invalid phrases data format');
                }

                const localPhrases = getPhrases();
                let importedCount = 0;
                let updatedCount = 0;

                for (const cloudPhrase of phrasesData.phrases) {
                    const existingIndex = localPhrases.findIndex(p => p.name === cloudPhrase.name);

                    if (existingIndex === -1) {
                        // Import new phrase
                        localPhrases.push({
                            ...cloudPhrase,
                            syncStatus: 'synced'
                        });
                        importedCount++;
                    } else {
                        // Update existing phrase if cloud version is newer
                        const localPhrase = localPhrases[existingIndex];
                        if (cloudPhrase.lastModified > localPhrase.lastModified) {
                            localPhrases[existingIndex] = {
                                ...cloudPhrase,
                                syncStatus: 'synced'
                            };
                            updatedCount++;
                        }
                    }
                }

                savePhrases(localPhrases);
                return { imported: importedCount, updated: updatedCount };
            } catch (error) {
                console.error('Failed to import phrases from cloud:', error);
                throw error;
            }
        }

        // Cloud sync functions
        async function syncTemplatesToCloud() {
            if (!isPastebinConfigured()) {
                throw new Error('Pastebin API not configured');
            }

            const templates = getTemplates();
            let syncedCount = 0;
            let failedCount = 0;

            console.log(`Starting sync for ${templates.length} templates...`);

            for (const template of templates) {
                try {
                    console.log(`Processing template: ${template.name} (status: ${template.syncStatus})`);

                    if (template.syncStatus === 'none' || template.syncStatus === 'failed') {
                        // Create new paste
                        console.log(`Creating new paste for: ${template.name}`);
                        const pasteCode = await createPastebinPaste(template.name, JSON.stringify(template));
                        console.log(`Received paste code: ${pasteCode}`);

                        // Validate the paste code
                        if (!pasteCode || pasteCode.length < 8) {
                            throw new Error(`Invalid paste code received: ${pasteCode}`);
                        }

                        template.pasteCode = pasteCode;
                        template.syncStatus = 'synced';
                        template.lastSynced = Date.now();
                        syncedCount++;
                        console.log(`Successfully created paste for: ${template.name}`);

                        // Verify the paste was actually created
                        const verified = await verifyPasteCreation(pasteCode);
                        if (!verified) {
                            console.warn(`Warning: Paste ${pasteCode} may not have been created successfully`);
                            template.syncStatus = 'failed';
                            syncedCount--;
                            failedCount++;
                        }
                    } else if (template.syncStatus === 'pending') {
                        // Update existing paste (using delete + recreate since Pastebin doesn't support updates)
                        console.log(`Updating existing paste for: ${template.name} (code: ${template.pasteCode})`);
                        try {
                            // Delete old paste and create new one
                            await deletePastebinPaste(template.pasteCode);
                            const newPasteCode = await createPastebinPaste(template.name, JSON.stringify(template));
                            template.pasteCode = newPasteCode;
                            template.syncStatus = 'synced';
                            template.lastSynced = Date.now();
                            syncedCount++;
                            console.log(`Successfully updated paste for: ${template.name}`);
                        } catch (error) {
                            console.error(`Failed to update paste for: ${template.name}:`, error);
                            throw new Error('Update operation failed');
                        }
                    } else if (template.syncStatus === 'synced') {
                        console.log(`Template ${template.name} already synced, skipping`);
                    }
                } catch (error) {
                    console.error(`Failed to sync template "${template.name}":`, error);
                    template.syncStatus = 'failed';
                    failedCount++;
                }
            }

            console.log(`Sync completed. Synced: ${syncedCount}, Failed: ${failedCount}`);
            saveTemplates(templates);
            return { synced: syncedCount, failed: failedCount };
        }

        // Verify that pastes were actually created
        async function verifyPasteCreation(pasteCode) {
            try {
                // Try to fetch the paste content to verify it exists
                const response = await fetch(`https://pastebin.com/raw/${pasteCode}`);
                if (response.ok) {
                    const content = await response.text();
                    console.log(`Paste ${pasteCode} verified - content length: ${content.length}`);
                    return true;
                } else {
                    console.error(`Paste ${pasteCode} verification failed - status: ${response.status}`);
                    return false;
                }
            } catch (error) {
                console.error(`Paste ${pasteCode} verification error:`, error);
                return false;
            }
        }

        async function syncTemplatesFromCloud() {
            if (!isPastebinConfigured()) {
                throw new Error('Pastebin API not configured');
            }

            if (!PASTEBIN_CONFIG.API_USER_KEY) {
                throw new Error('User key required for importing from cloud');
            }

            const cloudTemplates = await listUserPastes();
            const localTemplates = getTemplates();
            let importedCount = 0;
            let updatedCount = 0;

            console.log(`Found ${cloudTemplates.length} total pastes in cloud:`);
            cloudTemplates.forEach(paste => {
                console.log(`- ${paste.type}: "${paste.title}"`);
            });

            for (const cloudTemplate of cloudTemplates) {
                // Only process template pastes (not review pastes)
                if (cloudTemplate.type !== 'template') {
                    console.log(`Skipping non-template paste: "${cloudTemplate.title}" (type: ${cloudTemplate.type})`);
                    continue;
                }

                console.log(`Processing template: "${cloudTemplate.title}"`);

                try {
                    const content = await getPastebinPaste(cloudTemplate.key);
                    const templateData = JSON.parse(content);

                    console.log(`Template data:`, templateData);

                    const existingIndex = localTemplates.findIndex(t => t.name === templateData.name);

                    if (existingIndex === -1) {
                        // Import new template
                        const newTemplate = {
                            ...templateData,
                            pasteCode: cloudTemplate.key,
                            syncStatus: 'synced',
                            lastSynced: Date.now()
                        };
                        localTemplates.push(newTemplate);
                        importedCount++;
                        console.log(`Imported new template: "${templateData.name}"`);
                    } else {
                        // Update existing template if cloud version is newer
                        const localTemplate = localTemplates[existingIndex];
                        if (templateData.lastModified > localTemplate.lastModified) {
                            localTemplates[existingIndex] = {
                                ...templateData,
                                pasteCode: cloudTemplate.key,
                                syncStatus: 'synced',
                                lastSynced: Date.now()
                            };
                            updatedCount++;
                            console.log(`Updated existing template: "${templateData.name}"`);
                        } else {
                            console.log(`Template "${templateData.name}" already up to date`);
                        }
                    }
                } catch (error) {
                    console.error(`Failed to import template "${cloudTemplate.title}":`, error);
                }
            }

            console.log(`Import completed. Imported: ${importedCount}, Updated: ${updatedCount}`);
            saveTemplates(localTemplates);
            return { imported: importedCount, updated: updatedCount };
        }

        // Create Pastebin button and popover
        function createPastebinButton() {
            const pastebinBtn = document.createElement('button');
            pastebinBtn.type = 'button';
            pastebinBtn.innerHTML = '☁️';
            pastebinBtn.title = 'Pastebin Cloud Sync';
            pastebinBtn.style.fontSize = '1.1em';
            pastebinBtn.style.padding = '2px 8px';
            pastebinBtn.style.borderRadius = '4px';
            pastebinBtn.style.border = '1px solid #bbb';
            pastebinBtn.style.background = '#f8f8f8';
            pastebinBtn.style.cursor = 'pointer';
            pastebinBtn.style.transition = 'background 0.15s ease, color 0.15s ease, transform 0.1s ease';
            pastebinBtn.style.outline = 'none';
            pastebinBtn.style.userSelect = 'none';
            pastebinBtn.style.position = 'relative';

            // Create popover
            const popover = document.createElement('div');
            popover.className = 'pastebin-popover';

            const menuItems = [
                { icon: '💾', text: 'Save Review', action: 'save-review', requiresConfig: true, requiresUserKey: true },
                { icon: '📥', text: 'Fetch Review', action: 'fetch-review', requiresConfig: true, requiresUserKey: true },
                { icon: '📋', text: 'Create Manual Paste', action: 'create-manual', requiresConfig: false },
                { icon: '📥', text: 'Import from Paste URL', action: 'import-manual', requiresConfig: false },
                { icon: '📚', text: 'Import Templates', action: 'import-templates', requiresConfig: true, requiresUserKey: true },
                { icon: '🔗', text: 'My Pastebin', action: 'my-pastebin', requiresConfig: true, requiresUserKey: true },
                { icon: '⚙️', text: 'API Settings', action: 'settings', requiresConfig: false },
                { icon: '📊', text: 'Sync Status', action: 'status', requiresConfig: false },
                { icon: '🗑️', text: 'Clear Cloud Data', action: 'clear-cloud', requiresConfig: true }
            ];

            menuItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'pastebin-popover-item';
                if (item.requiresConfig && !isPastebinConfigured()) {
                    menuItem.classList.add('disabled');
                }
                if (item.requiresUserKey && !PASTEBIN_CONFIG.API_USER_KEY) {
                    menuItem.classList.add('disabled');
                }

                menuItem.innerHTML = `
                    <span>${item.icon}</span>
                    <span>${item.text}</span>
                `;

                menuItem.addEventListener('click', () => {
                    if (!menuItem.classList.contains('disabled')) {
                        handlePastebinAction(item.action);
                    }
                    popover.classList.remove('show');
                });

                popover.appendChild(menuItem);
            });

            pastebinBtn.appendChild(popover);

            // Toggle popover
            pastebinBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                popover.classList.toggle('show');
            });

            // Close popover when clicking outside
            document.addEventListener('click', (e) => {
                if (!pastebinBtn.contains(e.target)) {
                    popover.classList.remove('show');
                }
            });

            // Close popover on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    popover.classList.remove('show');
                }
            });

            return pastebinBtn;
        }

        // Handle Pastebin popover actions
        async function handlePastebinAction(action) {
            switch (action) {
                case 'save-review':
                    await handleSaveReview();
                    break;
                case 'fetch-review':
                    await handleFetchReview();
                    break;
                case 'sync-to-cloud':
                    await handleSyncToCloud();
                    break;
                case 'import-from-cloud':
                    await handleImportFromCloud();
                    break;
                case 'create-manual':
                    await handleCreateManualPaste();
                    break;
                case 'import-manual':
                    await handleImportManualPaste();
                    break;
                case 'import-templates':
                    await handleImportTemplates();
                    break;
                case 'my-pastebin':
                    handleMyPastebin();
                    break;
                case 'settings':
                    showPastebinSettings();
                    break;
                case 'status':
                    showSyncStatus();
                    break;
                case 'clear-cloud':
                    await handleClearCloudData();
                    break;
                default:
                    console.warn('Unknown Pastebin action:', action);
            }
        }

        // Handle sync to cloud
        async function handleSyncToCloud() {
            try {
                console.log('Starting sync to cloud...');
                const result = await syncTemplatesToCloud();

                let message = `Sync completed!\nSynced: ${result.synced}\nFailed: ${result.failed}`;

                if (result.failed > 0) {
                    message += '\n\nSome templates failed to sync. Check the browser console for details.';
                }

                if (result.synced === 0 && result.failed === 0) {
                    message = 'No templates to sync. All templates are already up to date.';
                }

                alert(message);
                refreshTemplateOptions();
            } catch (error) {
                console.error('Sync failed:', error);
                alert(`Sync failed: ${error.message}\n\nTry using the manual paste method instead.`);
            }
        }

        // Handle import from cloud
        async function handleImportFromCloud() {
            try {
                const result = await syncTemplatesFromCloud();
                alert(`Import completed!\nImported: ${result.imported}\nUpdated: ${result.updated}`);
                refreshTemplateOptions();
            } catch (error) {
                alert(`Import failed: ${error.message}`);
            }
        }

        // Handle clear cloud data
        async function handleClearCloudData() {
            if (!confirm('This will delete all templates from Pastebin. Continue?')) {
                return;
            }

            const templates = getTemplates();
            let deletedCount = 0;

            for (const template of templates) {
                if (template.pasteCode) {
                    try {
                        await deletePastebinPaste(template.pasteCode);
                        template.pasteCode = null;
                        template.syncStatus = 'none';
                        template.lastSynced = null;
                        deletedCount++;
                    } catch (error) {
                        console.error(`Failed to delete template "${template.name}":`, error);
                    }
                }
            }

            saveTemplates(templates);
            alert(`Cleared ${deletedCount} templates from cloud`);
            refreshTemplateOptions();
        }

        // Handle manual paste creation
        async function handleCreateManualPaste() {
            const templates = getTemplates();
            if (templates.length === 0) {
                alert('No templates to export. Please save some templates first.');
                return;
            }

            // Create a combined export of all templates
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                templates: templates.map(t => ({
                    name: t.name,
                    text: t.text,
                    height: t.height,
                    lastModified: t.lastModified || Date.now()
                }))
            };

            const exportText = JSON.stringify(exportData, null, 2);

            // Create a temporary textarea to copy the data
            const textarea = document.createElement('textarea');
            textarea.value = exportText;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            // Open Pastebin in a new tab
            const pastebinUrl = 'https://pastebin.com/';
            window.open(pastebinUrl, '_blank');

            alert(`Template data copied to clipboard!\n\nInstructions:\n1. Paste the data into Pastebin\n2. Set title to "Amazon Review Templates"\n3. Set format to "JSON"\n4. Set expiration to "Never"\n5. Click "Create New Paste"\n6. Copy the paste URL for importing later`);
        }

        // Handle manual paste import
        async function handleImportManualPaste() {
            const pasteUrl = prompt('Enter Pastebin URL (e.g., https://pastebin.com/abc123):', '');
            if (!pasteUrl) return;

            // Extract paste key from URL
            const pasteKeyMatch = pasteUrl.match(/pastebin\.com\/([a-zA-Z0-9]+)/);
            if (!pasteKeyMatch) {
                alert('Invalid Pastebin URL. Please enter a valid URL like https://pastebin.com/abc123');
                return;
            }

            const pasteKey = pasteKeyMatch[1];

            try {
                // Try to fetch the paste content
                const response = await fetch(`https://pastebin.com/raw/${pasteKey}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch paste content');
                }

                const content = await response.text();
                const importData = JSON.parse(content);

                if (!importData.templates || !Array.isArray(importData.templates)) {
                    throw new Error('Invalid template data format');
                }

                const localTemplates = getTemplates();
                let importedCount = 0;
                let updatedCount = 0;

                for (const templateData of importData.templates) {
                    const existingIndex = localTemplates.findIndex(t => t.name === templateData.name);

                    if (existingIndex === -1) {
                        // Import new template
                        const newTemplate = {
                            ...templateData,
                            syncStatus: 'none',
                            pasteCode: null,
                            lastSynced: null
                        };
                        localTemplates.push(newTemplate);
                        importedCount++;
                    } else {
                        // Update existing template if import version is newer
                        const localTemplate = localTemplates[existingIndex];
                        if (templateData.lastModified > localTemplate.lastModified) {
                            localTemplates[existingIndex] = {
                                ...templateData,
                                syncStatus: 'none',
                                pasteCode: null,
                                lastSynced: null
                            };
                            updatedCount++;
                        }
                    }
                }

                saveTemplates(localTemplates);
                refreshTemplateOptions();
                alert(`Import completed!\nImported: ${importedCount}\nUpdated: ${updatedCount}`);

            } catch (error) {
                console.error('Import failed:', error);
                alert(`Import failed: ${error.message}\n\nMake sure the paste contains valid template data in JSON format.`);
            }
        }

        // Show sync status
        function showSyncStatus() {
            const templates = getTemplates();
            let statusText = 'Template Sync Status:\n\n';

            if (templates.length === 0) {
                statusText += 'No templates found.';
            } else {
                templates.forEach(template => {
                    const statusIcon = {
                        'synced': '🟢',
                        'pending': '🟡',
                        'failed': '🔴',
                        'none': '⚪'
                    }[template.syncStatus] || '⚪';

                    statusText += `${statusIcon} ${template.name}\n`;
                });
            }

            alert(statusText);
        }

        // Handle save review action
        async function handleSaveReview() {
            const textarea = document.getElementById('reviewText');
            if (!textarea) {
                alert('Review textarea not found');
                return;
            }

            if (!textarea.value.trim()) {
                alert('Please enter some review text before saving to cloud');
                return;
            }

            try {
                const result = await saveReviewToCloud(textarea);
                alert(`${result.message}\n\nPaste URL: ${result.pasteUrl}`);
            } catch (error) {
                console.error('Save review failed:', error);
                alert(`Failed to save review: ${error.message}`);
            }
        }

        // Handle fetch review action
        async function handleFetchReview() {
            const textarea = document.getElementById('reviewText');
            if (!textarea) {
                alert('Review textarea not found');
                return;
            }

            // Check if textarea has content and warn user
            if (textarea.value.trim()) {
                if (!confirm('This will replace your current review text. Continue?')) {
                    return;
                }
            }

            try {
                const result = await fetchReviewFromCloud(textarea);
                alert(`${result.message}\n\nPaste URL: ${result.pasteUrl}`);
            } catch (error) {
                console.error('Fetch review failed:', error);
                alert(`Failed to fetch review: ${error.message}`);
            }
        }

        // Handle import templates action (same as previous "Import from Cloud")
        async function handleImportTemplates() {
            try {
                await handleImportFromCloud();
            } catch (error) {
                console.error('Import templates failed:', error);
                alert(`Failed to import templates: ${error.message}`);
            }
        }

        // Handle My Pastebin action
        function handleMyPastebin() {
            // Extract username from the user key or use a default approach
            // Since we can't directly get the username from the API, we'll use a generic approach
            const pastebinUrl = 'https://pastebin.com/u/';
            window.open(pastebinUrl, '_blank');
            
            // Show a helpful message
            alert('Opening Pastebin user page.\n\nNote: You may need to log in to see your pastes. The URL format is typically:\nhttps://pastebin.com/u/[username]\n\nYou can find your username in your Pastebin account settings.');
        }

        // Show Pastebin settings modal
        function showPastebinSettings() {
            // Create modal if it doesn't exist
            let modal = document.querySelector('.pastebin-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.className = 'pastebin-modal';
                modal.innerHTML = `
                    <div class="pastebin-modal-content">
                        <div class="pastebin-modal-header">
                            <h3 class="pastebin-modal-title">Pastebin API Settings</h3>
                            <button class="pastebin-modal-close">&times;</button>
                        </div>
                        <form id="pastebin-settings-form">
                            <div class="pastebin-form-group">
                                <label class="pastebin-form-label" for="api-dev-key">API Dev Key *</label>
                                <input type="text" id="api-dev-key" class="pastebin-form-input" placeholder="Enter your Pastebin API Dev Key" required>
                                <div class="pastebin-form-help">
                                    Get your API Dev Key from <a href="https://pastebin.com/doc_api" target="_blank">Pastebin API documentation</a>
                                </div>
                            </div>
                            <div class="pastebin-form-group">
                                <label class="pastebin-form-label" for="api-username">Pastebin Username</label>
                                <input type="text" id="api-username" class="pastebin-form-input" placeholder="Enter your Pastebin username">
                                <div class="pastebin-form-help">
                                    Your Pastebin account username (required to post under your account)
                                </div>
                            </div>
                            <div class="pastebin-form-group">
                                <label class="pastebin-form-label" for="api-password">Pastebin Password</label>
                                <input type="password" id="api-password" class="pastebin-form-input" placeholder="Enter your Pastebin password">
                                <div class="pastebin-form-help">
                                    Your Pastebin account password (will be used to generate User Key)
                                </div>
                            </div>
                            <div class="pastebin-form-group">
                                <label class="pastebin-form-label" for="api-user-key">API User Key (Auto-generated)</label>
                                <input type="text" id="api-user-key" class="pastebin-form-input" placeholder="Will be generated automatically" readonly>
                                <div class="pastebin-form-help">
                                    This will be automatically generated from your username/password
                                </div>
                            </div>
                            <div class="pastebin-form-actions">
                                <button type="button" class="pastebin-btn" id="generate-user-key">Generate User Key</button>
                                <button type="button" class="pastebin-btn" id="test-connection">Test Connection</button>
                                <button type="button" class="pastebin-btn" id="cancel-settings">Cancel</button>
                                <button type="submit" class="pastebin-btn pastebin-btn-primary">Save Settings</button>
                            </div>
                        </form>
                    </div>
                `;
                document.body.appendChild(modal);

                // Add event listeners
                const closeBtn = modal.querySelector('.pastebin-modal-close');
                const cancelBtn = modal.querySelector('#cancel-settings');
                const testBtn = modal.querySelector('#test-connection');
                const generateBtn = modal.querySelector('#generate-user-key');
                const form = modal.querySelector('#pastebin-settings-form');

                closeBtn.addEventListener('click', () => modal.classList.remove('show'));
                cancelBtn.addEventListener('click', () => modal.classList.remove('show'));

                generateBtn.addEventListener('click', async () => {
                    const devKey = modal.querySelector('#api-dev-key').value;
                    const username = modal.querySelector('#api-username').value;
                    const password = modal.querySelector('#api-password').value;

                    if (!devKey) {
                        alert('Please enter an API Dev Key first.');
                        return;
                    }

                    if (!username || !password) {
                        alert('Please enter both username and password to generate User Key.');
                        return;
                    }

                    generateBtn.disabled = true;
                    generateBtn.innerHTML = '<span class="pastebin-loading"></span> Generating...';

                    try {
                        // Temporarily set dev key for generation
                        const originalDevKey = PASTEBIN_CONFIG.API_DEV_KEY;
                        PASTEBIN_CONFIG.API_DEV_KEY = devKey;

                        const userKey = await generatePastebinUserKey(username, password);

                        // Update the user key field
                        modal.querySelector('#api-user-key').value = userKey;

                        // Automatically save the configuration
                        PASTEBIN_CONFIG.API_DEV_KEY = devKey;
                        PASTEBIN_CONFIG.API_USER_NAME = username;
                        PASTEBIN_CONFIG.API_USER_PASSWORD = password;
                        PASTEBIN_CONFIG.API_USER_KEY = userKey;

                        savePastebinConfig();

                        alert('User Key generated and saved successfully!');

                    } catch (error) {
                        alert(`Failed to generate User Key: ${error.message}`);
                    } finally {
                        generateBtn.disabled = false;
                        generateBtn.textContent = 'Generate User Key';
                    }
                });

                testBtn.addEventListener('click', async () => {
                    const devKey = modal.querySelector('#api-dev-key').value;
                    const userKey = modal.querySelector('#api-user-key').value;

                    if (!devKey) {
                        alert('Please enter an API Dev Key first.');
                        return;
                    }

                    testBtn.disabled = true;
                    testBtn.innerHTML = '<span class="pastebin-loading"></span> Testing...';

                    try {
                        // Temporarily set keys for testing
                        const originalDevKey = PASTEBIN_CONFIG.API_DEV_KEY;
                        const originalUserKey = PASTEBIN_CONFIG.API_USER_KEY;
                        PASTEBIN_CONFIG.API_DEV_KEY = devKey;
                        PASTEBIN_CONFIG.API_USER_KEY = userKey;

                        const result = await testPastebinConnection();

                        if (result.success) {
                            alert('Connection successful!');
                        } else {
                            alert(`Connection failed: ${result.message}`);
                        }

                        // Restore original keys
                        PASTEBIN_CONFIG.API_DEV_KEY = originalDevKey;
                        PASTEBIN_CONFIG.API_USER_KEY = originalUserKey;
                    } catch (error) {
                        alert(`Test failed: ${error.message}`);
                    } finally {
                        testBtn.disabled = false;
                        testBtn.textContent = 'Test Connection';
                    }
                });

                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const devKey = modal.querySelector('#api-dev-key').value;
                    const username = modal.querySelector('#api-username').value;
                    const password = modal.querySelector('#api-password').value;
                    const userKey = modal.querySelector('#api-user-key').value;

                    PASTEBIN_CONFIG.API_DEV_KEY = devKey || null;
                    PASTEBIN_CONFIG.API_USER_NAME = username || null;
                    PASTEBIN_CONFIG.API_USER_PASSWORD = password || null;
                    PASTEBIN_CONFIG.API_USER_KEY = userKey || null;

                    savePastebinConfig();
                    modal.classList.remove('show');
                    alert('Settings saved!');
                });

                // Close modal when clicking outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('show');
                    }
                });
            }

            // Populate current values
            const devKeyInput = modal.querySelector('#api-dev-key');
            const usernameInput = modal.querySelector('#api-username');
            const passwordInput = modal.querySelector('#api-password');
            const userKeyInput = modal.querySelector('#api-user-key');
            devKeyInput.value = PASTEBIN_CONFIG.API_DEV_KEY || '';
            usernameInput.value = PASTEBIN_CONFIG.API_USER_NAME || '';
            passwordInput.value = PASTEBIN_CONFIG.API_USER_PASSWORD || '';
            userKeyInput.value = PASTEBIN_CONFIG.API_USER_KEY || '';

            // Show modal
            modal.classList.add('show');
        }

        // Template and Phrase UI Container
        const templateContainer = document.createElement('div');
        templateContainer.style.marginLeft = '';
        templateContainer.style.display = 'flex';
        templateContainer.style.alignItems = 'center';
        templateContainer.style.gap = '6px';

        // Phrase dropdown
        const phraseSelect = document.createElement('select');
        phraseSelect.style.maxWidth = '150px';
        phraseSelect.style.fontSize = '1em';
        phraseSelect.style.padding = '2px 6px';
        phraseSelect.style.borderRadius = '4px';
        phraseSelect.style.border = '1px solid #bbb';
        phraseSelect.style.background = '#fff';
        phraseSelect.style.color = '#222';
        phraseSelect.title = 'Insert a saved phrase';
        
        function refreshPhraseOptions() {
            const phrases = getPhrases();
            phraseSelect.innerHTML = '';
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = 'Insert phrase...';
            phraseSelect.appendChild(defaultOpt);
            phrases.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.name;
                
                // Add sync status indicator
                const statusIcon = {
                    'synced': '🟢',
                    'pending': '🟡',
                    'failed': '🔴',
                    'none': '⚪'
                }[p.syncStatus] || '⚪';
                
                opt.textContent = `${statusIcon} ${p.name}`;
                phraseSelect.appendChild(opt);
            });
        }
        refreshPhraseOptions();

        // Insert phrase on select
        phraseSelect.addEventListener('change', function() {
            const name = phraseSelect.value;
            if (!name) return;
            const phrase = getPhraseByName(name);
            if (!phrase) return;
            
            // Insert phrase at cursor position
            const cursorPos = textarea.selectionStart;
            const textBefore = textarea.value.substring(0, cursorPos);
            const textAfter = textarea.value.substring(textarea.selectionEnd);
            
            textarea.value = textBefore + phrase.text + textAfter;
            
            // Move cursor to end of inserted phrase
            const newCursorPos = cursorPos + phrase.text.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            
            // Trigger input event for autosave
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            phraseSelect.value = '';
            textarea.focus();
        });

        const templateSelect = document.createElement('select');
        templateSelect.style.maxWidth = '180px';
        templateSelect.style.fontSize = '1em';
        templateSelect.style.padding = '2px 6px';
        templateSelect.style.borderRadius = '4px';
        templateSelect.style.border = '1px solid #bbb';
        templateSelect.style.background = '#fff'; // Ensure default background
        templateSelect.style.color = '#222'; // Ensure default text color
        templateSelect.title = 'Insert a saved template';
        function refreshTemplateOptions() {
            const templates = getTemplates();
            templateSelect.innerHTML = '';
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = 'Insert template...';
            templateSelect.appendChild(defaultOpt);
            templates.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.name;

                // Add sync status indicator
                const statusIcon = {
                    'synced': '🟢',
                    'pending': '🟡',
                    'failed': '🔴',
                    'none': '⚪'
                }[t.syncStatus] || '⚪';

                opt.textContent = `${statusIcon} ${t.name}`;
                templateSelect.appendChild(opt);
            });
        }
        refreshTemplateOptions();

        // Insert template on select
        templateSelect.addEventListener('change', function() {
            const name = templateSelect.value;
            if (!name) return;
            const template = getTemplateByName(name);
            if (!template) return;
            // Confirm if textbox is not empty and would overwrite
            if (textarea.value && textarea.value !== template.text) {
                if (!confirm('Replace current text with template "' + name + '"?')) {
                    templateSelect.value = '';
                    return;
                }
            }
            textarea.value = template.text;
            if (template.height) textarea.style.height = template.height;
            // Trigger input event for autosave
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            templateSelect.value = '';
        });

        // Save as template button
        const saveTemplateBtn = document.createElement('button');
        saveTemplateBtn.type = 'button';
        saveTemplateBtn.textContent = 'Save as...';
        saveTemplateBtn.style.fontSize = '1em';
        saveTemplateBtn.style.padding = '2px 8px';
        saveTemplateBtn.style.borderRadius = '4px';
        saveTemplateBtn.style.border = '1px solid #bbb';
        saveTemplateBtn.style.background = '#f8f8f8';
        saveTemplateBtn.style.color = '#222'; // Normal text color
        saveTemplateBtn.style.opacity = '1'; // Not faded
        saveTemplateBtn.style.cursor = 'pointer';
        saveTemplateBtn.style.transition = 'background 0.15s, color 0.15s, transform 0.1s';
        saveTemplateBtn.style.userSelect = 'none';
        saveTemplateBtn.title = 'Save current text as a reusable template';
        saveTemplateBtn.addEventListener('mouseenter', () => {
            saveTemplateBtn.style.background = '#e8e8e8';
        });
        saveTemplateBtn.addEventListener('mouseleave', () => {
            saveTemplateBtn.style.background = '#f8f8f8';
        });
        saveTemplateBtn.addEventListener('click', async function() {
            // Smart detection: selected text = phrase, no selection = template
            const hasSelection = textarea.selectionStart !== textarea.selectionEnd;
            const selectedText = hasSelection ? textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) : '';
            
            if (hasSelection && selectedText.trim()) {
                // Save as phrase
                let name = prompt('Phrase name:', '');
                if (!name) return;
                name = name.trim();
                if (!name) return;
                
                // Check if phrase exists
                const exists = !!getPhraseByName(name);
                if (exists && !confirm('A phrase with this name exists. Overwrite?')) return;

                // Show loading state
                const originalText = saveTemplateBtn.textContent;
                saveTemplateBtn.textContent = 'Saving phrase...';
                saveTemplateBtn.disabled = true;

                try {
                    await upsertPhrase(name, selectedText);
                    refreshPhraseOptions();
                    alert('Phrase saved!');
                } catch (error) {
                    alert(`Failed to save phrase: ${error.message}`);
                } finally {
                    saveTemplateBtn.textContent = originalText;
                    saveTemplateBtn.disabled = false;
                }
            } else {
                // Save as template
                let name = prompt('Template name:', '');
                if (!name) return;
                name = name.trim();
                if (!name) return;
                
                // Check if template exists
                const exists = !!getTemplateByName(name);
                if (exists && !confirm('A template with this name exists. Overwrite?')) return;

                // Show loading state
                const originalText = saveTemplateBtn.textContent;
                saveTemplateBtn.textContent = 'Saving template...';
                saveTemplateBtn.disabled = true;

                try {
                    await upsertTemplate(name, textarea.value, textarea.style.height);
                    refreshTemplateOptions();
                    alert('Template saved!');
                } catch (error) {
                    alert(`Failed to save template: ${error.message}`);
                } finally {
                    saveTemplateBtn.textContent = originalText;
                    saveTemplateBtn.disabled = false;
                }
            }
        });

        // Remove template button (optional, for user convenience)
        const deleteTemplateBtn = document.createElement('button');
        deleteTemplateBtn.type = 'button';
        deleteTemplateBtn.textContent = 'Manage';
        deleteTemplateBtn.style.fontSize = '1em';
        deleteTemplateBtn.style.padding = '2px 8px';
        deleteTemplateBtn.style.borderRadius = '4px';
        deleteTemplateBtn.style.border = '1px solid #bbb';
        deleteTemplateBtn.style.background = '#f8f8f8';
        deleteTemplateBtn.style.color = '#222';
        deleteTemplateBtn.style.cursor = 'pointer';
        deleteTemplateBtn.style.transition = 'background 0.15s, color 0.15s, transform 0.1s';
        deleteTemplateBtn.style.userSelect = 'none';
        deleteTemplateBtn.title = 'Manage templates (view, delete, etc.)';
        deleteTemplateBtn.addEventListener('mouseenter', () => {
            deleteTemplateBtn.style.background = '#e8e8e8';
        });
        deleteTemplateBtn.addEventListener('mouseleave', () => {
            deleteTemplateBtn.style.background = '#f8f8f8';
        });
        deleteTemplateBtn.addEventListener('click', function() {
            showTemplateManager();
        });

        // Unified Template and Phrase Manager
        function showTemplateManager() {
            const templates = getTemplates();
            const phrases = getPhrases();

            // Create modal if it doesn't exist
            let modal = document.querySelector('.template-manager-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.className = 'template-manager-modal';
                modal.innerHTML = `
                    <div class="template-manager-content">
                        <div class="template-manager-header">
                            <h3 class="template-manager-title">Templates & Phrases Manager</h3>
                            <button class="template-manager-close">&times;</button>
                        </div>
                        <div class="template-manager-tabs">
                            <button class="tab-btn active" data-tab="templates">📝 Templates</button>
                            <button class="tab-btn" data-tab="phrases">💬 Phrases</button>
                        </div>
                        <div class="template-manager-body">
                            <div class="tab-content" id="templates-tab">
                                <div class="template-list" id="template-list">
                                    <!-- Templates will be populated here -->
                                </div>
                            </div>
                            <div class="tab-content" id="phrases-tab" style="display: none;">
                                <div class="template-list" id="phrase-list">
                                    <!-- Phrases will be populated here -->
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                // Add tab switching functionality
                const tabBtns = modal.querySelectorAll('.tab-btn');
                const tabContents = modal.querySelectorAll('.tab-content');
                
                tabBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const tabName = btn.dataset.tab;
                        
                        // Update active tab button
                        tabBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        
                        // Show corresponding tab content
                        tabContents.forEach(content => {
                            if (content.id === `${tabName}-tab`) {
                                content.style.display = 'block';
                            } else {
                                content.style.display = 'none';
                            }
                        });
                    });
                });

                // Add event listeners
                const closeBtn = modal.querySelector('.template-manager-close');
                closeBtn.addEventListener('click', () => modal.classList.remove('show'));

                // Close modal when clicking outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('show');
                    }
                });
            }

            // Populate template list
            const templateList = modal.querySelector('#template-list');
            templateList.innerHTML = '';

            if (templates.length === 0) {
                templateList.innerHTML = '<div class="no-templates">No templates found. Create some templates to see them here.</div>';
            } else {
                templates.forEach(template => {
                    const templateItem = document.createElement('div');
                    templateItem.className = 'template-item';

                    const statusIcon = {
                        'synced': '🟢',
                        'pending': '🟡',
                        'failed': '🔴',
                        'none': '⚪'
                    }[template.syncStatus] || '⚪';

                    templateItem.innerHTML = `
                        <div class="template-info">
                            <div class="template-name">${statusIcon} ${template.name}</div>
                            <div class="template-preview">${template.text.substring(0, 100)}${template.text.length > 100 ? '...' : ''}</div>
                        </div>
                        <div class="template-actions">
                            <button class="template-btn template-insert-btn" title="Insert template">📝</button>
                            <button class="template-btn template-delete-btn" title="Delete template">🗑</button>
                        </div>
                    `;

                    // Add event listeners
                    const insertBtn = templateItem.querySelector('.template-insert-btn');
                    const deleteBtn = templateItem.querySelector('.template-delete-btn');

                    insertBtn.addEventListener('click', () => {
                        // Confirm if textbox is not empty and would overwrite
                        if (textarea.value && textarea.value !== template.text) {
                            if (!confirm('Replace current text with template "' + template.name + '"?')) {
                                return;
                            }
                        }
                        textarea.value = template.text;
                        if (template.height) textarea.style.height = template.height;
                        // Trigger input event for autosave
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        modal.classList.remove('show');
                    });

                    deleteBtn.addEventListener('click', async () => {
                        if (!confirm(`Delete template "${template.name}"?`)) return;

                        deleteBtn.disabled = true;
                        deleteBtn.textContent = '...';

                        try {
                            await removeTemplate(template.name);
                            // Remove the item from the list
                            templateItem.remove();
                            // Update the dropdown
                            refreshTemplateOptions();

                            // If no templates left, show the no templates message
                            if (templateList.children.length === 0) {
                                templateList.innerHTML = '<div class="no-templates">No templates found. Create some templates to see them here.</div>';
                            }
                        } catch (error) {
                            alert(`Failed to delete template: ${error.message}`);
                            deleteBtn.disabled = false;
                            deleteBtn.textContent = '🗑';
                        }
                    });

                    templateList.appendChild(templateItem);
                });
            }

            // Populate phrase list
            const phraseList = modal.querySelector('#phrase-list');
            phraseList.innerHTML = '';

            if (phrases.length === 0) {
                phraseList.innerHTML = '<div class="no-templates">No phrases found. Create some phrases to see them here.</div>';
            } else {
                phrases.forEach(phrase => {
                    const phraseItem = document.createElement('div');
                    phraseItem.className = 'template-item';

                    const statusIcon = {
                        'synced': '🟢',
                        'pending': '🟡',
                        'failed': '🔴',
                        'none': '⚪'
                    }[phrase.syncStatus] || '⚪';

                    phraseItem.innerHTML = `
                        <div class="template-info">
                            <div class="template-name">${statusIcon} ${phrase.name}</div>
                            <div class="template-preview">${phrase.text.substring(0, 100)}${phrase.text.length > 100 ? '...' : ''}</div>
                        </div>
                        <div class="template-actions">
                            <button class="template-btn template-insert-btn" title="Insert phrase">💬</button>
                            <button class="template-btn template-delete-btn" title="Delete phrase">🗑</button>
                        </div>
                    `;

                    // Add event listeners
                    const insertBtn = phraseItem.querySelector('.template-insert-btn');
                    const deleteBtn = phraseItem.querySelector('.template-delete-btn');

                    insertBtn.addEventListener('click', () => {
                        // Insert phrase at cursor position
                        const cursorPos = textarea.selectionStart;
                        const textBefore = textarea.value.substring(0, cursorPos);
                        const textAfter = textarea.value.substring(textarea.selectionEnd);
                        
                        textarea.value = textBefore + phrase.text + textAfter;
                        
                        // Move cursor to end of inserted phrase
                        const newCursorPos = cursorPos + phrase.text.length;
                        textarea.setSelectionRange(newCursorPos, newCursorPos);
                        
                        // Trigger input event for autosave
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        modal.classList.remove('show');
                        textarea.focus();
                    });

                    deleteBtn.addEventListener('click', async () => {
                        if (!confirm(`Delete phrase "${phrase.name}"?`)) return;

                        deleteBtn.disabled = true;
                        deleteBtn.textContent = '...';

                        try {
                            await removePhrase(phrase.name);
                            // Remove the item from the list
                            phraseItem.remove();
                            // Update the dropdown
                            refreshPhraseOptions();

                            // If no phrases left, show the no phrases message
                            if (phraseList.children.length === 0) {
                                phraseList.innerHTML = '<div class="no-templates">No phrases found. Create some phrases to see them here.</div>';
                            }
                        } catch (error) {
                            alert(`Failed to delete phrase: ${error.message}`);
                            deleteBtn.disabled = false;
                            deleteBtn.textContent = '🗑';
                        }
                    });

                    phraseList.appendChild(phraseItem);
                });
            }

            // Show modal
            modal.classList.add('show');
        }

        // Create Pastebin button
        const pastebinBtn = createPastebinButton();

        templateContainer.appendChild(phraseSelect);
        templateContainer.appendChild(templateSelect);
        templateContainer.appendChild(saveTemplateBtn);
        templateContainer.appendChild(deleteTemplateBtn);
        templateContainer.appendChild(pastebinBtn);
        toolbar.appendChild(templateContainer);

        // Button definitions
        const buttons = [
            { label: '<b>B</b>', style: 'bold', title: 'Bold Sans (𝗕)' },
            { label: '<i>I</i>', style: 'italic', title: 'Italic Sans (𝘪)' },
            { label: '<span style="font-family:serif">S</span>', style: 'serif', title: 'Serif (𝑠)' },
            { label: '<span style="font-family:cursive">C</span>', style: 'cursive', title: 'Cursive (𝓬)' },
            { label: '<sup>^</sup>', style: 'superscript', title: 'Superscript (ᵃ)' },
            { label: '<u>U</u>', style: 'underline', title: 'Underline (U͟)' },
            { label: '<s>S</s>', style: 'strikethrough', title: 'Strikethrough (S̶)' },
            { label: '<span style="font-family:monospace">M</span>', style: 'monospace', title: 'Monospace (𝙼)' },
            { label: '<span style="font-family:\'Arial Black\', Gadget, sans-serif">W</span>', style: 'wide', title: 'Wide (Ｗ)' },
            { label: '●', style: 'bullet', title: 'Bullet Points (➜)' },
            { label: '1.', style: 'number', title: 'Numbered List (1), 2)...)' }
        ];

        // State for toggling
        let activeStyles = new Set();
        const buttonElements = [];

        // State for bullet points and numbering
        let bulletMode = false;
        let numberMode = false;
        let bulletCount = 0;
        let numberCount = 0;
        let lastUsedNumber = 0; // Track the last used number for continuation

        // Helper function to remove specific style from text
        function removeStyleFromText(text, styleToRemove) {
            // First, detect what styles are currently applied to the text
            const currentStyles = detectAppliedStyles(text);

            // Remove the specific style we want to remove
            currentStyles.delete(styleToRemove);

            // Convert the text back to plain ASCII
            const plainText = convertToPlainText(text);

            // Reapply the remaining styles
            return stylize(plainText, currentStyles);
        }

        // Helper function to update button states based on selected text
        function updateButtonStatesFromSelection() {
            const cursorPos = textarea.selectionStart;
            const selectionEnd = textarea.selectionEnd;

            if (cursorPos !== selectionEnd) {
                // Get selected text
                const selected = textarea.value.slice(cursorPos, selectionEnd);
                const detectedStyles = detectAppliedStyles(selected);

                // Update activeStyles to match detected styles
                activeStyles.clear();
                detectedStyles.forEach(style => activeStyles.add(style));

                // Update button appearances
                buttonElements.forEach(({ element, style }) => {
                    if (style !== 'bullet' && style !== 'number') {
                        element.setAttribute('aria-pressed', activeStyles.has(style).toString());
                    }
                });
            }
        }

        // Helper function to check if current line already has a bullet
        function currentLineHasBullet() {
            const cursorPos = textarea.selectionStart;
            const textBefore = textarea.value.substring(0, cursorPos);
            const lineStart = textBefore.lastIndexOf('\n') + 1;
            const lineText = textBefore.substring(lineStart);
            return lineText.trim().startsWith('➜');
        }

        // Helper function to check if current line already has a number
        function currentLineHasNumber() {
            const cursorPos = textarea.selectionStart;
            const textBefore = textarea.value.substring(0, cursorPos);
            const lineStart = textBefore.lastIndexOf('\n') + 1;
            const lineText = textBefore.substring(lineStart);
            return /^\d+\)\s/.test(lineText.trim());
        }

        // Helper function to find the highest number in the document
        function findHighestNumberInDocument() {
            const text = textarea.value;
            const lines = text.split('\n');
            let highestNumber = 0;

            for (const line of lines) {
                const match = line.trim().match(/^(\d+)\)\s/);
                if (match) {
                    const number = parseInt(match[1], 10);
                    if (number > highestNumber) {
                        highestNumber = number;
                    }
                }
            }

            return highestNumber;
        }

        // Helper function to renumber the document when items are deleted
        function renumberDocument() {
            const text = textarea.value;
            const lines = text.split('\n');
            let newLines = [];
            let currentNumber = 1;

            for (const line of lines) {
                const trimmedLine = line.trim();
                const match = trimmedLine.match(/^(\d+)\)\s(.+)$/);

                if (match) {
                    // This is a numbered line, renumber it
                    const content = match[2];
                    newLines.push(`${currentNumber}) ${content}`);
                    currentNumber++;
                } else {
                    // This is not a numbered line, keep as is
                    newLines.push(line);
                }
            }

            // Update the textarea with renumbered content
            const newText = newLines.join('\n');
            if (newText !== text) {
                const cursorPos = textarea.selectionStart;
                const selectionEnd = textarea.selectionEnd;

                textarea.value = newText;

                // Try to maintain cursor position as much as possible
                const newCursorPos = Math.min(cursorPos, newText.length);
                const newSelectionEnd = Math.min(selectionEnd, newText.length);
                textarea.setSelectionRange(newCursorPos, newSelectionEnd);

                // Update the numbering state
                lastUsedNumber = currentNumber - 1;
                numberCount = lastUsedNumber;
            }
        }

        // Create buttons
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.innerHTML = btn.label;
            button.title = btn.title;
            button.type = 'button';
            button.style.fontSize = '1.1em';
            button.style.padding = '2px 8px';
            button.style.borderRadius = '4px';
            button.style.border = '1px solid #bbb';
            button.style.background = '#f8f8f8';
            button.style.cursor = 'pointer';
            button.style.transition = 'background 0.15s ease, color 0.15s ease, transform 0.1s ease';
            button.style.outline = 'none';
            button.style.userSelect = 'none';
            button.setAttribute('aria-pressed', 'false');

            // Store reference to button for efficient updates
            buttonElements.push({ element: button, style: btn.style });

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Add immediate visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 100);

                // Handle bullet and number modes
                if (btn.style === 'bullet') {
                    bulletMode = !bulletMode;
                    if (bulletMode) {
                        numberMode = false;
                        // Reset other modes
                        activeStyles.clear();
                        buttonElements.forEach(({ element, style }) => {
                            if (style !== 'bullet') {
                                element.setAttribute('aria-pressed', 'false');
                            }
                        });

                        // Check if current line already has a bullet
                        if (!currentLineHasBullet()) {
                            // Insert bullet at cursor position or before selected text
                            const cursorPos = textarea.selectionStart;
                            const selectionEnd = textarea.selectionEnd;
                            const textBefore = textarea.value.substring(0, cursorPos);
                            const selectedText = textarea.value.substring(cursorPos, selectionEnd);
                            const textAfter = textarea.value.substring(selectionEnd);

                            // Find the beginning of the current line
                            const lineStart = textBefore.lastIndexOf('\n') + 1;
                            const lineText = textBefore.substring(lineStart);

                            // If we're at the start of a line or the line is empty, insert bullet
                            if (lineStart === cursorPos || lineText.trim() === '') {
                                const bulletText = '➜ ';
                                textarea.value = textBefore + bulletText + selectedText + textAfter;
                                textarea.setSelectionRange(cursorPos + bulletText.length, cursorPos + bulletText.length + selectedText.length);
                            } else {
                                // Insert bullet at the beginning of the current line
                                const bulletText = '➜ ';
                                textarea.value = textBefore.substring(0, lineStart) + bulletText + textBefore.substring(lineStart) + selectedText + textAfter;
                                textarea.setSelectionRange(lineStart + bulletText.length, lineStart + bulletText.length + selectedText.length);
                            }
                        }
                        // If line already has bullet, just activate the mode without adding another
                    }
                    button.setAttribute('aria-pressed', bulletMode.toString());
                    return;
                }

                if (btn.style === 'number') {
                    numberMode = !numberMode;
                    if (numberMode) {
                        bulletMode = false;
                        // Reset other modes
                        activeStyles.clear();
                        buttonElements.forEach(({ element, style }) => {
                            if (style !== 'number') {
                                element.setAttribute('aria-pressed', 'false');
                            }
                        });

                        // Find the highest number in the document to continue from
                        const highestNumber = findHighestNumberInDocument();
                        // Always use the highest number found, regardless of previous lastUsedNumber
                        lastUsedNumber = highestNumber;
                        numberCount = lastUsedNumber;

                        // Check if current line already has a number
                        if (!currentLineHasNumber()) {
                            // Insert number at cursor position or before selected text
                            const cursorPos = textarea.selectionStart;
                            const selectionEnd = textarea.selectionEnd;
                            const textBefore = textarea.value.substring(0, cursorPos);
                            const selectedText = textarea.value.substring(cursorPos, selectionEnd);
                            const textAfter = textarea.value.substring(selectionEnd);

                            // Find the beginning of the current line
                            const lineStart = textBefore.lastIndexOf('\n') + 1;
                            const lineText = textBefore.substring(lineStart);

                            // If we're at the start of a line or the line is empty, insert number
                            if (lineStart === cursorPos || lineText.trim() === '') {
                                numberCount++;
                                lastUsedNumber = numberCount;
                                const numberText = `${numberCount}) `;
                                textarea.value = textBefore + numberText + selectedText + textAfter;
                                textarea.setSelectionRange(cursorPos + numberText.length, cursorPos + numberText.length + selectedText.length);
                            } else {
                                // Insert number at the beginning of the current line
                                numberCount++;
                                lastUsedNumber = numberCount;
                                const numberText = `${numberCount}) `;
                                textarea.value = textBefore.substring(0, lineStart) + numberText + textBefore.substring(lineStart) + selectedText + textAfter;
                                textarea.setSelectionRange(lineStart + numberText.length, lineStart + numberText.length + selectedText.length);
                            }
                        }
                        // If line already has number, just activate the mode without adding another
                    } else {
                        // Numbering mode is being turned off
                        // Clear the renumbering timeout if it exists
                        if (textarea.renumberTimeout) {
                            clearTimeout(textarea.renumberTimeout);
                        }
                    }
                    button.setAttribute('aria-pressed', numberMode.toString());
                    return;
                }

                // Toggle style for regular formatting buttons
                if (activeStyles.has(btn.style)) {
                    // Remove style from active styles
                    activeStyles.delete(btn.style);
                    button.setAttribute('aria-pressed', 'false');

                    // Remove this style from any selected text
                    const cursorPos = textarea.selectionStart;
                    const selectionEnd = textarea.selectionEnd;

                    if (cursorPos !== selectionEnd) {
                        // Remove style from selected text
                        const before = textarea.value.slice(0, cursorPos);
                        const selected = textarea.value.slice(cursorPos, selectionEnd);
                        const after = textarea.value.slice(selectionEnd);
                        const updated = removeStyleFromText(selected, btn.style);
                        textarea.value = before + updated + after;
                        textarea.setSelectionRange(cursorPos, cursorPos + updated.length);

                        // Update activeStyles to reflect what's actually applied to the text
                        const remainingStyles = detectAppliedStyles(updated);
                        activeStyles.clear();
                        remainingStyles.forEach(style => activeStyles.add(style));

                        // Update button states to match the remaining styles
                        buttonElements.forEach(({ element, style }) => {
                            if (style !== 'bullet' && style !== 'number') {
                                element.setAttribute('aria-pressed', activeStyles.has(style).toString());
                            }
                        });
                    } else {
                        // Remove style from current word
                        const text = textarea.value;
                        const beforeCursor = text.slice(0, cursorPos);
                        const afterCursor = text.slice(cursorPos);

                        const wordStart = beforeCursor.search(/\S+$/);
                        const wordEnd = afterCursor.search(/\s|$/);

                        if (wordStart !== -1) {
                            const start = cursorPos - (beforeCursor.length - wordStart);
                            const end = cursorPos + (wordEnd === -1 ? afterCursor.length : wordEnd);
                            const word = text.slice(start, end);
                            const updated = removeStyleFromText(word, btn.style);
                            textarea.value = text.slice(0, start) + updated + text.slice(end);
                            textarea.setSelectionRange(start, start + updated.length);

                            // Update activeStyles to reflect what's actually applied to the word
                            const remainingStyles = detectAppliedStyles(updated);
                            activeStyles.clear();
                            remainingStyles.forEach(style => activeStyles.add(style));

                            // Update button states to match the remaining styles
                            buttonElements.forEach(({ element, style }) => {
                                if (style !== 'bullet' && style !== 'number') {
                                    element.setAttribute('aria-pressed', activeStyles.has(style).toString());
                                }
                            });
                        }
                    }
                } else {
                    // Add style
                    // Superscript and other new styles are exclusive
                    if (btn.style === 'superscript' || btn.style === 'underline' || btn.style === 'strikethrough' || btn.style === 'monospace' || btn.style === 'wide') {
                        activeStyles.clear();
                        // Use stored references instead of querying DOM
                        buttonElements.forEach(({ element, style }) => {
                            element.setAttribute('aria-pressed', 'false');
                        });
                    }
                    activeStyles.add(btn.style);
                    button.setAttribute('aria-pressed', 'true');

                    // Apply formatting instantly to selected text or current word
                    const cursorPos = textarea.selectionStart;
                    const selectionEnd = textarea.selectionEnd;

                    if (cursorPos !== selectionEnd) {
                        // Apply to selected text
                        const before = textarea.value.slice(0, cursorPos);
                        const selected = textarea.value.slice(cursorPos, selectionEnd);
                        const after = textarea.value.slice(selectionEnd);

                        // Detect existing styles on the selected text
                        const existingStyles = detectAppliedStyles(selected);

                        // Combine existing styles with new active styles
                        const combinedStyles = new Set([...existingStyles, ...activeStyles]);

                        // Convert to plain text and reapply all styles
                        const plainText = convertToPlainText(selected);
                        const styled = stylize(plainText, combinedStyles);

                        textarea.value = before + styled + after;
                        textarea.setSelectionRange(cursorPos, cursorPos + styled.length);
                    } else {
                        // Apply to current word
                        const text = textarea.value;
                        const beforeCursor = text.slice(0, cursorPos);
                        const afterCursor = text.slice(cursorPos);

                        // Find word boundaries
                        const wordStart = beforeCursor.search(/\S+$/);
                        const wordEnd = afterCursor.search(/\s|$/);

                        if (wordStart !== -1) {
                            const start = cursorPos - (beforeCursor.length - wordStart);
                            const end = cursorPos + (wordEnd === -1 ? afterCursor.length : wordEnd);
                            const word = text.slice(start, end);

                            // Detect existing styles on the word
                            const existingStyles = detectAppliedStyles(word);

                            // Combine existing styles with new active styles
                            const combinedStyles = new Set([...existingStyles, ...activeStyles]);

                            // Convert to plain text and reapply all styles
                            const plainText = convertToPlainText(word);
                            const styled = stylize(plainText, combinedStyles);

                            textarea.value = text.slice(0, start) + styled + text.slice(end);
                            textarea.setSelectionRange(start, start + styled.length);
                        }
                    }
                }

                // Don't focus textarea - let user continue working without interruption
            });

            // Add hover effects
            button.addEventListener('mouseenter', () => {
                if (!activeStyles.has(btn.style)) {
                    button.style.background = '#e8e8e8';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (!activeStyles.has(btn.style)) {
                    button.style.background = '#f8f8f8';
                }
            });

            toolbar.appendChild(button);
        });

        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Clear styles';
        resetBtn.type = 'button';
        resetBtn.style.marginLeft = '6px';
        resetBtn.style.background = '#ffe0b2'; // More vibrant background
        resetBtn.style.border = '1px solid #ff9800';
        resetBtn.style.borderRadius = '4px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.style.transition = 'background 0.15s ease, transform 0.1s ease';
        resetBtn.style.userSelect = 'none';
        resetBtn.style.color = '#b26a00'; // Stronger text color
        resetBtn.style.opacity = '1'; // Not faded
        resetBtn.title = 'Remove all Unicode styling from highlighted text';

        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Add immediate visual feedback
            resetBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                resetBtn.style.transform = '';
            }, 100);

            const [start, end] = [textarea.selectionStart, textarea.selectionEnd];
            if (start === end) return;

            const before = textarea.value.slice(0, start);
            const selected = textarea.value.slice(start, end);
            const after = textarea.value.slice(end);

            // Remove all stylization (replace with plain ASCII)
            const plain = convertToPlainText(selected);

            textarea.value = before + plain + after;
            textarea.setSelectionRange(start, start + plain.length);
            textarea.focus();
        });

        // Add hover effects for reset button
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.background = '#ffe0b2';
        });

        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.background = '#fff3e0';
        });

        toolbar.appendChild(resetBtn);

        // Reset numbering button
        const resetNumberingBtn = document.createElement('button');
        resetNumberingBtn.textContent = 'Reset Numbering';
        resetNumberingBtn.type = 'button';
        resetNumberingBtn.style.marginLeft = '6px';
        resetNumberingBtn.style.background = '#e3f2fd'; // More vibrant background
        resetNumberingBtn.style.border = '1px solid #2196f3';
        resetNumberingBtn.style.borderRadius = '4px';
        resetNumberingBtn.style.cursor = 'pointer';
        resetNumberingBtn.style.transition = 'background 0.15s ease, transform 0.1s ease';
        resetNumberingBtn.style.userSelect = 'none';
        resetNumberingBtn.style.color = '#1565c0'; // Stronger text color
        resetNumberingBtn.style.opacity = '1'; // Not faded
        resetNumberingBtn.title = 'Start a new numbered list from 1 at the current position';

        resetNumberingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Add immediate visual feedback
            resetNumberingBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                resetNumberingBtn.style.transform = '';
            }, 100);
            // Reset the numbering counter so the next list starts at 1
            numberCount = 0;
            lastUsedNumber = 0;
        });

        // Add hover effects for reset numbering button
        resetNumberingBtn.addEventListener('mouseenter', () => {
            resetNumberingBtn.style.background = '#bbdefb';
        });
        resetNumberingBtn.addEventListener('mouseleave', () => {
            resetNumberingBtn.style.background = '#e3f2fd';
        });
        toolbar.appendChild(resetNumberingBtn);

        // Add keydown listener for bullet points and numbering
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                // Handle bullet mode
                if (bulletMode) {
                    e.preventDefault();
                    const cursorPos = textarea.selectionStart;
                    const textBefore = textarea.value.substring(0, cursorPos);
                    const textAfter = textarea.value.substring(cursorPos);

                    // Find the beginning of the current line
                    const lineStart = textBefore.lastIndexOf('\n') + 1;
                    const lineText = textBefore.substring(lineStart);

                    // Check if current line is empty or only contains bullet
                    const isCurrentLineEmpty = lineText.trim() === '' || lineText.trim() === '➜';

                    if (isCurrentLineEmpty) {
                        // Delete the bullet and disable bullet mode
                        const newTextBefore = textBefore.substring(0, lineStart);
                        textarea.value = newTextBefore + textAfter;
                        textarea.setSelectionRange(lineStart, lineStart);

                        // Disable bullet mode
                        bulletMode = false;
                        buttonElements.forEach(({ element, style }) => {
                            if (style === 'bullet') {
                                element.setAttribute('aria-pressed', 'false');
                            }
                        });
                    } else {
                        // Insert new bullet on next line
                        const bulletText = '\n➜ ';
                        textarea.value = textBefore + bulletText + textAfter;
                        textarea.setSelectionRange(cursorPos + bulletText.length, cursorPos + bulletText.length);
                    }
                    return;
                }

                // Handle number mode
                if (numberMode) {
                    e.preventDefault();
                    const cursorPos = textarea.selectionStart;
                    const textBefore = textarea.value.substring(0, cursorPos);
                    const textAfter = textarea.value.substring(cursorPos);

                    // Find the beginning of the current line
                    const lineStart = textBefore.lastIndexOf('\n') + 1;
                    const lineText = textBefore.substring(lineStart);

                    // Check if current line is empty or only contains number
                    const numberPattern = /^\d+\)\s*$/;
                    const isCurrentLineEmpty = lineText.trim() === '' || numberPattern.test(lineText.trim());

                    if (isCurrentLineEmpty) {
                        // Delete the number and disable number mode
                        const newTextBefore = textBefore.substring(0, lineStart);
                        textarea.value = newTextBefore + textAfter;
                        textarea.setSelectionRange(lineStart, lineStart);

                        // Disable number mode
                        numberMode = false;
                        // Don't reset numberCount to preserve the sequence
                        buttonElements.forEach(({ element, style }) => {
                            if (style === 'number') {
                                element.setAttribute('aria-pressed', 'false');
                            }
                        });
                    } else {
                        // Insert new number on next line
                        numberCount++;
                        lastUsedNumber = numberCount;
                        const numberText = `\n${numberCount}) `;
                        textarea.value = textBefore + numberText + textAfter;
                        textarea.setSelectionRange(cursorPos + numberText.length, cursorPos + numberText.length);
                    }
                    return;
                }
            }
        });

        // Add event listeners to update button states when selection changes
        textarea.addEventListener('mouseup', updateButtonStatesFromSelection);
        textarea.addEventListener('keyup', updateButtonStatesFromSelection);
        textarea.addEventListener('input', (e) => {
            updateButtonStatesFromSelection();

            // If numbering mode is active, renumber the document when content changes
            if (numberMode) {
                // Use a debounced approach to avoid renumbering during typing
                clearTimeout(textarea.renumberTimeout);
                textarea.renumberTimeout = setTimeout(() => {
                    renumberDocument();
                }, 300); // Increased delay for better performance
            }
        });

        return toolbar;
    }

    // --- Auto-Save Review Draft Feature ---
    function getCurrentASIN() {
        // Try to get ASIN from URL (?asin=...)
        const params = new URLSearchParams(window.location.search);
        let asin = params.get('asin');
        // Fallback: extract from path or query string
        if (!asin && window.location.href.includes('/review/create-review')) {
            const asinMatch = window.location.href.match(/[?&]asin=([A-Z0-9]{10})/);
            if (asinMatch) asin = asinMatch[1];
        }
        return asin;
    }

    // Fetch product title from product page using ASIN
    async function fetchProductTitleFromASIN(asin) {
        try {
            const productUrl = `https://www.amazon.ca/dp/${asin}`;
            console.log(`Fetching product title from: ${productUrl}`);
            
            // Add timeout to the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(productUrl, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            
            // Try to find the product title in the HTML
            const titleSelectors = [
                '#productTitle',
                '.a-size-large.product-title-word-break',
                '.product-title-word-break',
                'h1[data-automation-id="title"]',
                '.a-size-large'
            ];
            
            for (const selector of titleSelectors) {
                const match = html.match(new RegExp(`<[^>]*id="${selector.replace('#', '')}"[^>]*>([^<]+)</[^>]*>`, 'i')) ||
                             html.match(new RegExp(`<[^>]*class="[^"]*${selector.replace('.', '')}[^"]*"[^>]*>([^<]+)</[^>]*>`, 'i'));
                
                if (match && match[1]) {
                    const title = match[1].trim();
                    if (title && title.length > 0) {
                        console.log(`Found product title using selector "${selector}": "${title}"`);
                        return title;
                    }
                }
            }
            
            console.log('No product title found in product page HTML');
            return null;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Fetching product title timed out after 10 seconds');
            } else {
                console.error('Error fetching product title:', error);
            }
            return null;
        }
    }

    // Get product title from the current page or fetch from product page
    async function getProductTitle() {
        // First try to get title from current page
        const titleElement = document.getElementById('productTitle');
        if (titleElement) {
            return titleElement.textContent.trim();
        }

        // Fallback: try to find title in other common selectors
        const selectors = [
            '.a-size-large.product-title-word-break',
            '.product-title-word-break',
            'h1[data-automation-id="title"]',
            '.a-size-large'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.textContent.trim();
            }
        }

        // If no title found on current page, try to fetch from product page using ASIN
        try {
            const asin = getCurrentASIN();
            if (asin) {
                console.log(`No product title found on current page, fetching from product page for ASIN: ${asin}`);
                const productTitle = await fetchProductTitleFromASIN(asin);
                if (productTitle) {
                    console.log(`Successfully fetched product title: "${productTitle}"`);
                    return productTitle;
                }
            }
        } catch (error) {
            console.error('Failed to fetch product title from product page:', error);
        }

        return 'Unknown';
    }

    // Create a review paste title with format: Amazon Product: [first 5 words] — REVIEW — [ASIN]
    function createReviewPasteTitle(productTitle, asin) {
        // Clean up the product title and limit to first 8 words for readability
        const cleanTitle = productTitle.replace(/[^\w\s]/g, '').trim();
        const words = cleanTitle.split(/\s+/).slice(0, 8).join(' ');
        return `Amazon Product: ${words} — REVIEW — ${asin}`;
    }

    // Find existing review paste for current ASIN
    async function findReviewPasteForASIN(asin) {
        if (!isPastebinConfigured() || !PASTEBIN_CONFIG.API_USER_KEY) {
            throw new Error('Pastebin API not configured or user key missing');
        }

        try {
            const pastes = await listUserPastes();
            const asinSuffix = ` — ${asin}`;

            console.log(`Looking for review paste with ASIN: ${asin}`);
            console.log(`Expected suffix: ${asinSuffix}`);
            console.log(`Found ${pastes.length} total pastes:`);
            pastes.forEach(paste => {
                console.log(`- ${paste.type}: "${paste.title}"`);
            });

            for (const paste of pastes) {
                // Only look at review pastes (not templates)
                if (paste.type === 'review' && paste.title && paste.title.endsWith(asinSuffix)) {
                    console.log(`Found matching review paste: "${paste.title}"`);
                    return paste;
                }
            }

            console.log('No matching review paste found');
            return null; // No matching paste found
        } catch (error) {
            console.error('Error finding review paste:', error);
            throw error;
        }
    }

    // Save current review to Pastebin
    async function saveReviewToCloud(textarea) {
        const asin = getCurrentASIN();
        if (!asin) {
            throw new Error('Could not determine ASIN from current page');
        }

        const productTitle = await getProductTitle();
        const pasteTitle = createReviewPasteTitle(productTitle, asin);
        const reviewContent = textarea.value;
        
        // Get review title if available
        const reviewTitleInput = document.getElementById('reviewTitle');
        const reviewTitle = reviewTitleInput ? reviewTitleInput.value.trim() : '';

        if (!reviewContent.trim()) {
            throw new Error('Review text is empty');
        }

        // Create JSON payload with both review body and title
        const reviewData = {
            reviewBody: reviewContent,
            reviewTitle: reviewTitle,
            asin: asin,
            productTitle: productTitle,
            savedAt: new Date().toISOString()
        };

        // Check if we already have a paste for this ASIN
        const existingPaste = await findReviewPasteForASIN(asin);

        if (existingPaste) {
            // Update existing paste (using delete + recreate since Pastebin doesn't support updates)
            try {
                // Delete old paste and create new one
                await deletePastebinPaste(existingPaste.key);
                const newPasteCode = await createPastebinPaste(pasteTitle, JSON.stringify(reviewData, null, 2), true);
                return {
                    success: true,
                    message: 'Review updated in cloud',
                    pasteKey: newPasteCode,
                    pasteUrl: `https://pastebin.com/${newPasteCode}`
                };
            } catch (error) {
                console.error('Failed to update review paste:', error);
                throw new Error('Failed to update review in cloud');
            }
        } else {
            // Create new paste
            try {
                const pasteCode = await createPastebinPaste(pasteTitle, JSON.stringify(reviewData, null, 2), true);
                return {
                    success: true,
                    message: 'Review saved to cloud',
                    pasteKey: pasteCode,
                    pasteUrl: `https://pastebin.com/${pasteCode}`
                };
            } catch (error) {
                console.error('Failed to create review paste:', error);
                throw new Error('Failed to save review to cloud');
            }
        }
    }

    // Fetch review from Pastebin
    async function fetchReviewFromCloud(textarea) {
        const asin = getCurrentASIN();
        if (!asin) {
            throw new Error('Could not determine ASIN from current page');
        }

        const existingPaste = await findReviewPasteForASIN(asin);

        if (!existingPaste) {
            throw new Error('No review found in cloud for this product');
        }

        try {
            const reviewContent = await getPastebinPaste(existingPaste.key);
            
            // Try to parse as JSON first (new format)
            let reviewData;
            try {
                reviewData = JSON.parse(reviewContent);
            } catch (parseError) {
                // Fallback to old format (plain text)
                console.log('Review is in old format (plain text), using as review body only');
                reviewData = { reviewBody: reviewContent };
            }

            // Set review body
            if (reviewData.reviewBody) {
                textarea.value = reviewData.reviewBody;
            } else {
                textarea.value = reviewContent; // Fallback to raw content
            }

            // Set review title if available
            if (reviewData.reviewTitle) {
                const reviewTitleInput = document.getElementById('reviewTitle');
                if (reviewTitleInput) {
                    reviewTitleInput.value = reviewData.reviewTitle;
                    // Trigger input event for title autosave
                    reviewTitleInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }

            // Trigger input event to update any listeners
            textarea.dispatchEvent(new Event('input', { bubbles: true }));

            return {
                success: true,
                message: 'Review loaded from cloud',
                pasteKey: existingPaste.key,
                pasteUrl: `https://pastebin.com/${existingPaste.key}`
            };
        } catch (error) {
            console.error('Failed to fetch review paste:', error);
            throw new Error('Failed to load review from cloud');
        }
    }

    function getDraftKey(asin) {
        return asin ? `amazon_review_draft_${asin}` : null;
    }
    // --- NEW: Title draft key ---
    function getTitleDraftKey(asin) {
        return asin ? `amazon_review_title_draft_${asin}` : null;
    }

    function insertAutosaveStatusUI() {
        // Find the label container
        const label = document.querySelector('.in-context-ryp__field-label');
        if (!label) return null;
        let status = label.querySelector('.amazon-autosave-status');
        if (!status) {
            status = document.createElement('span');
            status.className = 'amazon-autosave-status';
            status.style.float = 'right';
            status.style.fontSize = '0.98em';
            status.style.color = '#888';
            status.style.marginLeft = '12px';
            status.style.fontWeight = '400';
            status.style.transition = 'color 0.2s';
            status.textContent = '';
            label.appendChild(status);
        }
        return status;
    }

    // --- NEW: Auto-Save for Review Title ---
    function attachTitleAutosave() {
        const titleInput = document.getElementById('reviewTitle');
        if (!titleInput || titleInput.dataset.amazonTitleAutosave) return;
        titleInput.dataset.amazonTitleAutosave = 'true';
        const asin = getCurrentASIN();
        const titleDraftKey = getTitleDraftKey(asin);
        // Find the label for the title
        const label = titleInput.closest('div').querySelector('.in-context-ryp__field-label');
        let statusUI = null;
        if (label) {
            statusUI = label.querySelector('.amazon-autosave-status-title');
            if (!statusUI) {
                statusUI = document.createElement('span');
                statusUI.className = 'amazon-autosave-status-title';
                statusUI.style.float = 'right';
                statusUI.style.fontSize = '0.98em';
                statusUI.style.color = '#888';
                statusUI.style.marginLeft = '12px';
                statusUI.style.fontWeight = '400';
                statusUI.style.transition = 'color 0.2s';
                statusUI.textContent = '';
                label.appendChild(statusUI);
            }
        }
        let saveTimeout = null;
        let lastSavedValue = '';
        // Restore draft if present
        if (titleDraftKey) {
            const saved = localStorage.getItem(titleDraftKey);
            if (saved && !titleInput.value) {
                titleInput.value = saved;
            }
        }
        // Save on input (debounced)
        function saveDraft() {
            if (!titleDraftKey) return;
            localStorage.setItem(titleDraftKey, titleInput.value);
            lastSavedValue = titleInput.value;
            if (statusUI) {
                statusUI.textContent = 'Saved.';
                statusUI.style.color = '#4caf50';
                setTimeout(() => {
                    if (statusUI.textContent === 'Saved.') statusUI.style.color = '#888';
                }, 1200);
            }
        }
        function onInput() {
            if (statusUI) statusUI.textContent = 'Saving...';
            if (saveTimeout) clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveDraft, 600);
        }
        titleInput.addEventListener('input', onInput);
        // Initial status
        if (statusUI) statusUI.textContent = '';
        // Clear draft on submit (if possible)
        function clearDraftOnSubmit() {
            if (!titleDraftKey) return;
            localStorage.removeItem(titleDraftKey);
            if (statusUI) statusUI.textContent = '';
        }
        // Try to detect submit button
        const form = titleInput.closest('form');
        if (form) {
            form.addEventListener('submit', clearDraftOnSubmit);
        } else {
            // Fallback: look for a submit button and listen for click
            const submitBtn = document.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) {
                submitBtn.addEventListener('click', clearDraftOnSubmit);
            }
        }
    }

    // --- Attach Toolbar to Review Textarea ---
    function attachToolbar() {
        const textarea = document.getElementById('reviewText');
        if (!textarea || textarea.dataset.unicodeToolbar) return;
        textarea.dataset.unicodeToolbar = 'true';
        const toolbar = createToolbar(textarea);
        textarea.parentNode.insertBefore(toolbar, textarea);

        // --- SWAP: Move template UI above label, autosave status into toolbar ---
        // 1. Move template UI above label
        const label = document.querySelector('.in-context-ryp__field-label');
        if (label) {
            // Find the template UI in the toolbar
            const templateContainer = toolbar.querySelector('div');
            if (templateContainer) {
                // Remove from toolbar and insert above label
                toolbar.removeChild(templateContainer);
                label.parentNode.insertBefore(templateContainer, label);
                templateContainer.style.marginLeft = '';
                templateContainer.style.justifyContent = 'flex-end';
                templateContainer.style.width = '100%';
            }
        }
        // 2. Move autosave status into toolbar, right-aligned
        let statusUI = document.querySelector('.amazon-autosave-status');
        if (statusUI) {
            // Remove from label and add to toolbar
            if (statusUI.parentNode) statusUI.parentNode.removeChild(statusUI);
            statusUI.style.float = '';
            statusUI.style.marginLeft = 'auto';
            statusUI.style.alignSelf = 'center';
            toolbar.appendChild(statusUI);
        } else {
            // If not present, create and add to toolbar
            statusUI = document.createElement('span');
            statusUI.className = 'amazon-autosave-status';
            statusUI.style.marginLeft = 'auto';
            statusUI.style.fontSize = '0.98em';
            statusUI.style.color = '#888';
            statusUI.style.fontWeight = '400';
            statusUI.style.transition = 'color 0.2s';
            statusUI.textContent = '';
            toolbar.appendChild(statusUI);
        }

        // --- AUTOSAVE LOGIC ---
        const asin = getCurrentASIN();
        const draftKey = getDraftKey(asin);
        let saveTimeout = null;
        let lastSavedValue = '';
        // Restore draft if present
        if (draftKey) {
            const saved = localStorage.getItem(draftKey);
            if (saved && !textarea.value) {
                textarea.value = saved;
            }
        }
        // Save on input (debounced)
        function saveDraft() {
            if (!draftKey) return;
            localStorage.setItem(draftKey, textarea.value);
            lastSavedValue = textarea.value;
            if (statusUI) {
                statusUI.textContent = 'Saved.';
                statusUI.style.color = '#4caf50';
                setTimeout(() => {
                    if (statusUI.textContent === 'Saved.') statusUI.style.color = '#888';
                }, 1200);
            }
        }
        function onInput() {
            if (statusUI) statusUI.textContent = 'Saving...';
            if (saveTimeout) clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveDraft, 600);
        }
        textarea.addEventListener('input', onInput);
        // Initial status
        if (statusUI) statusUI.textContent = '';
        // Clear draft on submit (if possible)
        function clearDraftOnSubmit() {
            if (!draftKey) return;
            localStorage.removeItem(draftKey);
            if (statusUI) statusUI.textContent = '';
        }
        // Try to detect submit button
        const form = textarea.closest('form');
        if (form) {
            form.addEventListener('submit', clearDraftOnSubmit);
        } else {
            // Fallback: look for a submit button and listen for click
            const submitBtn = document.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) {
                submitBtn.addEventListener('click', clearDraftOnSubmit);
            }
        }
        // Focus the textarea for better UX
        setTimeout(() => textarea.focus(), 100);
    }

    // --- Wait for textarea to appear ---
    function waitForTextarea() {
        const textarea = document.getElementById('reviewText');
        if (textarea) {
            attachToolbar();
        } else {
            setTimeout(waitForTextarea, 500);
        }
    }
    waitForTextarea();

    // --- Wait for review title to appear and attach autosave ---
    function waitForTitleInput() {
        const titleInput = document.getElementById('reviewTitle');
        if (titleInput) {
            attachTitleAutosave();
        } else {
            setTimeout(waitForTitleInput, 500);
        }
    }
    waitForTitleInput();

    // --- Drag-and-drop for media upload ---
    function enableMediaDragDrop() {
        const wrapper = document.querySelector('.in-context-ryp__form-field--mediaUploadInput--custom-wrapper');
        const fileInput = document.querySelector('input[type="file"]#media');
        if (!wrapper || !fileInput) return;

        // Create drag overlay text
        let dragText = document.createElement('div');
        dragText.textContent = 'Drag & drop files here';
        dragText.style.position = 'absolute';
        dragText.style.top = '50%';
        dragText.style.left = '50%';
        dragText.style.transform = 'translate(-50%, -50%)';
        dragText.style.fontSize = '1.2em';
        dragText.style.fontWeight = 'bold';
        dragText.style.color = '#1976d2';
        dragText.style.background = 'rgba(255,255,255,0.85)';
        dragText.style.padding = '12px 24px';
        dragText.style.borderRadius = '8px';
        dragText.style.boxShadow = '0 2px 8px rgba(33,150,243,0.08)';
        dragText.style.pointerEvents = 'none';
        dragText.style.zIndex = '100';
        dragText.style.display = 'none';
        dragText.className = 'amazon-dnd-dragtext';
        wrapper.style.position = 'relative';
        wrapper.appendChild(dragText);

        // Ensure Google Photos button exists
        let googleBtn = wrapper.querySelector('.google-photos-btn');
        if (!googleBtn) {
            googleBtn = document.createElement('a');
            googleBtn.href = 'https://photos.google.com/';
            googleBtn.target = '_blank';
            googleBtn.rel = 'noopener noreferrer';
            googleBtn.className = 'google-photos-btn';
            googleBtn.style.display = 'flex';
            googleBtn.style.alignItems = 'center';
            googleBtn.style.justifyContent = 'center';
            googleBtn.style.gap = '8px';
            googleBtn.style.margin = '18px 0 0 0';
            googleBtn.style.padding = '8px 16px';
            googleBtn.style.background = '#fff';
            googleBtn.style.border = '1px solid #dadce0';
            googleBtn.style.borderRadius = '6px 0 0 6px';
            googleBtn.style.boxShadow = '0 1px 2px rgba(60,64,67,.08)';
            googleBtn.style.fontSize = '1em';
            googleBtn.style.fontWeight = '500';
            googleBtn.style.color = '#444';
            googleBtn.style.cursor = 'pointer';
            googleBtn.style.textDecoration = 'none';
            googleBtn.style.width = 'fit-content';
            googleBtn.style.transition = 'background 0.15s, box-shadow 0.15s';
            googleBtn.innerHTML = `<img src="https://cdn.iconscout.com/icon/free/png-256/free-google-photos-logo-icon-download-in-svg-png-gif-file-formats--new-logos-pack-icons-2476486.png" alt="Google Photos" style="width: 22px; height: 22px; margin-right: 8px; vertical-align: middle;">Add from Google Photos...`;
            googleBtn.addEventListener('mouseenter', () => {
                googleBtn.style.background = '#f1f3f4';
                googleBtn.style.boxShadow = '0 2px 8px rgba(60,64,67,.13)';
            });
            googleBtn.addEventListener('mouseleave', () => {
                googleBtn.style.background = '#fff';
                googleBtn.style.boxShadow = '0 1px 2px rgba(60,64,67,.08)';
            });
            // Prevent file upload overlay from opening when clicking Google Photos
            googleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Create a Paste from Clipboard button
        let pasteBtn = wrapper.querySelector('.paste-clipboard-btn');
        if (!pasteBtn) {
            pasteBtn = document.createElement('button');
            pasteBtn.type = 'button';
            pasteBtn.className = 'paste-clipboard-btn';
            pasteBtn.style.display = 'flex';
            pasteBtn.style.alignItems = 'center';
            pasteBtn.style.justifyContent = 'center';
            pasteBtn.style.gap = '8px';
            pasteBtn.style.margin = '18px 0 0 0';
            pasteBtn.style.padding = '8px 16px';
            pasteBtn.style.background = '#fff';
            pasteBtn.style.border = '1px solid #dadce0';
            pasteBtn.style.borderLeft = 'none';
            pasteBtn.style.borderRadius = '0 6px 6px 0';
            pasteBtn.style.boxShadow = '0 1px 2px rgba(60,64,67,.08)';
            pasteBtn.style.fontSize = '1em';
            pasteBtn.style.fontWeight = '500';
            pasteBtn.style.color = '#444';
            pasteBtn.style.cursor = 'pointer';
            pasteBtn.style.textDecoration = 'none';
            pasteBtn.style.width = 'fit-content';
            pasteBtn.style.transition = 'background 0.15s, box-shadow 0.15s';
            pasteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1976d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Paste from Clipboard...`;
            pasteBtn.title = 'Paste image from clipboard';
            pasteBtn.addEventListener('mouseenter', () => {
                pasteBtn.style.background = '#f1f3f4';
                pasteBtn.style.boxShadow = '0 2px 8px rgba(60,64,67,.13)';
            });
            pasteBtn.addEventListener('mouseleave', () => {
                pasteBtn.style.background = '#fff';
                pasteBtn.style.boxShadow = '0 1px 2px rgba(60,64,67,.08)';
            });
            pasteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Try to trigger a paste event on the wrapper
                // This will only work if the user has granted clipboard permissions
                navigator.clipboard.read().then(items => {
                    let foundImage = false;
                    for (const item of items) {
                        if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                            foundImage = true;
                            item.getType(item.types.includes('image/png') ? 'image/png' : 'image/jpeg').then(blob => {
                                const file = new File([blob], 'clipboard-image.' + (item.types.includes('image/png') ? 'png' : 'jpg'), { type: blob.type });
                                const dt = new DataTransfer();
                                dt.items.add(file);
                                fileInput.files = dt.files;
                                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                                handleUploadUIUpdate();
                                // UI feedback: dim/blur area, hide buttons, show message
                                wrapper.classList.add('amazon-uploading');
                                wrapper.classList.remove('dragover');
                                let pasteText = wrapper.querySelector('.amazon-dnd-pastetext');
                                if (!pasteText) {
                                    pasteText = document.createElement('div');
                                    pasteText.className = 'amazon-dnd-pastetext';
                                    pasteText.textContent = 'Image pasted! Uploading...';
                                    pasteText.style.position = 'absolute';
                                    pasteText.style.top = '50%';
                                    pasteText.style.left = '50%';
                                    pasteText.style.transform = 'translate(-50%, -50%)';
                                    pasteText.style.fontSize = '1.2em';
                                    pasteText.style.fontWeight = 'bold';
                                    pasteText.style.color = '#388e3c';
                                    pasteText.style.background = 'rgba(255,255,255,0.98)';
                                    pasteText.style.padding = '16px 32px';
                                    pasteText.style.borderRadius = '12px';
                                    pasteText.style.boxShadow = '0 2px 12px rgba(56,142,60,0.10)';
                                    pasteText.style.pointerEvents = 'none';
                                    pasteText.style.zIndex = '101';
                                    pasteText.style.display = 'block';
                                    pasteText.style.textAlign = 'center';
                                    wrapper.appendChild(pasteText);
                                } else {
                                    pasteText.style.display = 'block';
                                }
                                setTimeout(() => {
                                    wrapper.classList.remove('amazon-uploading');
                                    if (pasteText) pasteText.style.display = 'none';
                                }, 2000);
                            }).catch(error => {
                                console.error('Error processing clipboard image:', error);
                                alert('Error processing clipboard image. Please try copying the image again.');
                            });
                            break;
                        }
                    }
                    if (!foundImage) {
                        alert('No image found in clipboard! Please copy an image first.');
                    }
                }).catch(error => {
                    console.error('Clipboard access error:', error);
                    if (error.name === 'NotAllowedError') {
                        alert('Clipboard access denied. Please grant clipboard permissions and try again.');
                    } else if (error.name === 'NotSupportedError') {
                        alert('Clipboard API not supported in this browser. Try using Ctrl+V instead.');
                    } else {
                        alert('Clipboard access failed. Please try using Ctrl+V to paste the image.');
                    }
                });
            });
        }

        // Find the outer upload container
        const mediaUploadInputWrapper = document.querySelector('.in-context-ryp__form-field--mediaUploadInput');

        // Ensure a container for both buttons, and insert both as a group
        let btnGroup = document.querySelector('.amazon-btn-group');
        if (!btnGroup) {
            btnGroup = document.createElement('div');
            btnGroup.className = 'amazon-btn-group';
            btnGroup.style.display = 'flex';
            btnGroup.style.flexDirection = 'row';
            btnGroup.style.gap = '0';
            btnGroup.style.margin = '24px auto 0 auto';
            btnGroup.style.width = 'fit-content';
            btnGroup.style.justifyContent = 'center';
        }
        // Ensure both buttons are in the group
        if (!btnGroup.contains(googleBtn)) btnGroup.appendChild(googleBtn);
        if (!btnGroup.contains(pasteBtn)) btnGroup.appendChild(pasteBtn);
        // Ensure group is in the correct place: after the upload area wrapper
        if (mediaUploadInputWrapper && mediaUploadInputWrapper.nextSibling !== btnGroup) {
            mediaUploadInputWrapper.parentNode.insertBefore(btnGroup, mediaUploadInputWrapper.nextSibling);
        }

        // Helper to always keep the button group after the upload area
        function repositionGooglePhotosBtn() {
            if (mediaUploadInputWrapper && mediaUploadInputWrapper.nextSibling !== btnGroup) {
                mediaUploadInputWrapper.parentNode.insertBefore(btnGroup, mediaUploadInputWrapper.nextSibling);
            }
        }

        // Call after each upload (drop or paste)
        function handleUploadUIUpdate() {
            setTimeout(repositionGooglePhotosBtn, 100); // Wait for DOM update
        }

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            wrapper.addEventListener(eventName, e => e.preventDefault());
        });

        // Highlight on dragover
        wrapper.addEventListener('dragover', () => {
            wrapper.classList.add('dragover');
            dragText.style.display = 'block';
        });
        wrapper.addEventListener('dragenter', () => {
            wrapper.classList.add('dragover');
            dragText.style.display = 'block';
        });
        wrapper.addEventListener('dragleave', (e) => {
            if (!wrapper.contains(e.relatedTarget)) {
                wrapper.classList.remove('dragover');
                dragText.style.display = 'none';
            }
        });

        // Upload files one by one
        async function uploadFilesQueue(files) {
            for (let i = 0; i < files.length; i++) {
                try {
                    // Assign file to input
                    const dt = new DataTransfer();
                    dt.items.add(files[i]);
                    fileInput.files = dt.files;
                    fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                    // Wait before uploading the next file
                    if (i < files.length - 1) {
                        await new Promise(res => setTimeout(res, 2000));
                    }
                } catch (error) {
                    console.error(`Error uploading file ${i + 1}:`, error);
                    // Continue with next file instead of stopping the entire queue
                }
            }
        }

        wrapper.addEventListener('drop', (e) => {
            wrapper.classList.remove('dragover');
            dragText.style.display = 'none';
            if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
            const files = Array.from(e.dataTransfer.files);
            if (files.length === 1) {
                // Single file: upload as normal
                const dt = new DataTransfer();
                dt.items.add(files[0]);
                fileInput.files = dt.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                handleUploadUIUpdate();
            } else {
                // Multiple files: upload one by one as a queue
                uploadFilesQueue(files).then(handleUploadUIUpdate);
            }
        });

        // --- Clipboard paste support for images ---
        wrapper.addEventListener('paste', (e) => {
            if (!e.clipboardData || !e.clipboardData.items) return;
            let foundImage = false;
            for (let i = 0; i < e.clipboardData.items.length; i++) {
                const item = e.clipboardData.items[i];
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        foundImage = true;
                        // Assign file to input and trigger upload
                        const dt = new DataTransfer();
                        dt.items.add(file);
                        fileInput.files = dt.files;
                        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                        e.preventDefault();
                        handleUploadUIUpdate();
                        break;
                    }
                }
            }
            if (foundImage) {
                // UI feedback: dim/blur area, hide buttons, show message
                wrapper.classList.add('amazon-uploading');
                wrapper.classList.remove('dragover');
                let pasteText = wrapper.querySelector('.amazon-dnd-pastetext');
                if (!pasteText) {
                    pasteText = document.createElement('div');
                    pasteText.className = 'amazon-dnd-pastetext';
                    pasteText.textContent = 'Image pasted! Uploading...';
                    pasteText.style.position = 'absolute';
                    pasteText.style.top = '50%';
                    pasteText.style.left = '50%';
                    pasteText.style.transform = 'translate(-50%, -50%)';
                    pasteText.style.fontSize = '1.2em';
                    pasteText.style.fontWeight = 'bold';
                    pasteText.style.color = '#388e3c';
                    pasteText.style.background = 'rgba(255,255,255,0.98)';
                    pasteText.style.padding = '16px 32px';
                    pasteText.style.borderRadius = '12px';
                    pasteText.style.boxShadow = '0 2px 12px rgba(56,142,60,0.10)';
                    pasteText.style.pointerEvents = 'none';
                    pasteText.style.zIndex = '101';
                    pasteText.style.display = 'block';
                    pasteText.style.textAlign = 'center';
                    wrapper.appendChild(pasteText);
                } else {
                    pasteText.style.display = 'block';
                }
                // Remove feedback after 2 seconds
                setTimeout(() => {
                    wrapper.classList.remove('amazon-uploading');
                    if (pasteText) pasteText.style.display = 'none';
                }, 2000);
            }
        });
    }

    // Wait for the media upload area to appear and enable drag-and-drop
    function waitForMediaUploadArea() {
        const wrapper = document.querySelector('.in-context-ryp__form-field--mediaUploadInput--custom-wrapper');
        const fileInput = document.querySelector('input[type="file"]#media');
        if (wrapper && fileInput) {
            // Prevent duplicate overlays
            if (!wrapper.querySelector('.amazon-dnd-dragtext')) {
                enableMediaDragDrop();
            }
        } else {
            setTimeout(waitForMediaUploadArea, 500);
        }
    }
    waitForMediaUploadArea();

    // --- Link all review candidate images to their product pages using ASIN from their review URLs ---
    function linkAllReviewCandidateImages() {
        const candidates = document.querySelectorAll('.ryp__review-candidate');
        candidates.forEach(candidate => {
            // Find the review link with ?asin=... - handle both URL patterns
            const reviewLink = candidate.querySelector('a[href*="/review/"]');
            if (!reviewLink) return;

            const url = new URL(reviewLink.href, window.location.origin);
            let asin = new URLSearchParams(url.search).get('asin');

            // If no ASIN in query params, try to extract from path (for create-review URLs)
            if (!asin && url.href.includes('/review/create-review')) {
                const asinMatch = url.href.match(/[?&]asin=([A-Z0-9]{10})/);
                if (asinMatch) {
                    asin = asinMatch[1];
                }
            }

            if (!asin) return;

            // Find the product image
            const img = candidate.querySelector('img.ryp__review-candidate__product-image');
            if (!img) return;

            // Check if already wrapped in a link to /dp/
            if (img.parentElement && img.parentElement.tagName === 'A' && img.parentElement.href.includes('/dp/')) return;

            // Create the product link
            const link = document.createElement('a');
            link.href = `https://www.amazon.ca/dp/${asin}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            // Insert the image into the link
            img.parentNode.insertBefore(link, img);
            link.appendChild(img);
        });
    }
    // Wait for review candidate images to appear and link them
    function waitForReviewCandidateImages() {
        if (document.querySelector('.ryp__review-candidate__product-image')) {
            linkAllReviewCandidateImages();
        } else {
            setTimeout(waitForReviewCandidateImages, 500);
        }
    }
    waitForReviewCandidateImages();

    // --- Link review image to product page using ASIN from URL (main review image) ---
    function linkReviewImageToASIN() {
        // Only run on review pages
        if (!window.location.href.includes('/review/')) return;

        // Get ASIN from URL - handle both URL patterns
        const params = new URLSearchParams(window.location.search);
        let asin = params.get('asin');

        // If no ASIN in query params, try to extract from path (for create-review URLs)
        if (!asin && window.location.href.includes('/review/create-review')) {
            // Extract ASIN from URL like /review/create-review?encoding=UTF&asin=B0DTTHH7Y4
            const asinMatch = window.location.href.match(/[?&]asin=([A-Z0-9]{10})/);
            if (asinMatch) {
                asin = asinMatch[1];
            }
        }

        if (!asin) return;

        // Find the image element (first matching Amazon CDN image in review area)
        const img = document.querySelector('img[src*="m.media-amazon.com/images/I/"]');
        if (!img) return;

        // Check if already wrapped in a link
        if (img.parentElement && img.parentElement.tagName === 'A' && img.parentElement.href.includes('/dp/')) return;

        // Create the product link
        const link = document.createElement('a');
        link.href = `https://www.amazon.ca/dp/${asin}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        // Insert the image into the link
        img.parentNode.insertBefore(link, img);
        link.appendChild(img);
    }
    // Wait for the review image to appear and link it
    function waitForReviewImageLink() {
        if (document.querySelector('img[src*="m.media-amazon.com/images/I/"]')) {
            linkReviewImageToASIN();
        } else {
            setTimeout(waitForReviewImageLink, 500);
        }
    }
    waitForReviewImageLink();
})();
