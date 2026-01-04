// ==UserScript==
// @name         DB
// @namespace    http://tampermonkey.net/
// @author       Mikojiy
// @version      7.1
// @description  Prompt profiles made easy for NovelAI with GLM AI Assistant integration. Now with metadata remover and auto watermark features.
// @match        https://novelai.github.io/image
// @license mit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551301/DB.user.js
// @updateURL https://update.greasyfork.org/scripts/551301/DB.meta.js
// ==/UserScript==
// ── Script Info ─────────────────────────────
// Repository: https://github.com/mikojiy/NAI-Profile-Manager
// ────────────────────────────────────────────
(function () {
    'use strict';
    let newBtn, saveBtn, renameBtn, deleteBtn, swapBtn, clearAllBtn;
    let overrideBtn, appendBtn;
    let addCharBtn, addCharDBBtn, organizeCharDBBtn;
    let tabButtons, characterTabBtn;
    let danbooruBtn, e621Btn, backupBtn, restoreBtn;
    let searchDiv, searchInput;
    let panel;

    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    let panelStepsInput = null;
    let panelGuidanceInput = null;

    // GLM API Variables
    const GLM_API_KEY_KEY = "nai_glm_api_key";
    const LAST_GLM_RESULTS_KEY = "nai_last_glm_results";
    let glmApiKey = localStorage.getItem(GLM_API_KEY_KEY) || "";
    	let lastGLMResults = {};

    // Mobile Fix Styles
    const mobileFixStyle = document.createElement('style');
    mobileFixStyle.textContent = `
      /* Pastikan semua input dapat dipilih dan memunculkan keyboard di mobile */
      input, textarea, select {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        pointer-events: auto !important;
      }

      /* Hapus outline default saat fokus */
      input:focus, textarea:focus, select:focus {
        outline: none !important;
        -webkit-appearance: none !important;
      }

      /* Perbaiki rendering untuk elemen di dalam modal dan panel */
      #nai-profiles-panel input, #nai-profiles-panel textarea, #nai-profiles-panel select,
      .modal input, .modal textarea, .modal select {
        -webkit-transform: translateZ(0) !important;
        transform: translateZ(0) !important;
      }

      /* Perbaikan responsive UI */
      @media (max-width: 768px) {
        .nai-responsive-text {
          font-size: 12px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        .nai-responsive-button {
          font-size: 12px !important;
          padding: 8px 12px !important;
        }
        .nai-responsive-panel {
          width: 95% !important;
          max-width: 95% !important;
        }

        /* Mobile-specific button layout */
        .mobile-action-buttons {
          display: flex !important;
          gap: 8px !important;
          margin-bottom: 8px !important;
        }

        .mobile-action-buttons button {
          flex: 1 !important;
        }

        /* Perbaikan tampilan tab di mobile */
        .tab-buttons {
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .tab-buttons::-webkit-scrollbar {
          display: none !important;
        }

        .tab-buttons button {
          min-width: 60px !important;
          max-width: 80px !important;
          flex: 1 !important;
        }

        /* Pastikan utility tab terlihat di mobile */
        #tab-utility {
          width: 100% !important;
          overflow: visible !important;
        }

        /* Perbaikan tampilan tombol utility di mobile */
        .utility-button-row {
          width: 100% !important;
          overflow: visible !important;
        }
      }

      /* Image Settings Styles - Updated for Compact Layout */
      .image-settings-container {
        background-color: #334155;
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 1px;
      }

      .image-settings-row {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding: 4px 0;
      }

      .image-setting-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .image-setting-label {
        font-size: 12px;
        margin-right: 4px;
        opacity: 0.9;
      }

      .image-setting-input {
        padding: 4px;
        border-radius: 4px;
        border: 1px solid #475569;
        background: #1e293b;
        color: #e2e8f0;
        font-size: 12px;
        width: 40px;
      }

      @media (max-width: 768px) {
        .image-settings-row {
          font-size: 12px !important;
          justify-content: space-between !important;
        }

        .image-setting-input {
          width: 50px !important;
          font-size: 12px !important;
        }
      }

      /* Keyboard Shortcuts Styles */
      .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding: 8px;
        border-radius: 6px;
        background-color: #334155;
      }

      .shortcut-label {
        font-size: 13px;
        flex: 1;
      }

      .shortcut-input {
        width: 120px;
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid #475569;
        background: #1e293b;
        color: #e2e8f0;
        font-size: 12px;
        text-align: center;
      }

      .shortcut-warning {
        color: #f59e0b;
        font-size: 11px;
        margin-top: 4px;
        display: none;
      }

      .shortcut-conflict {
        border: 1px solid #f59e0b !important;
      }

      /* Watermark Preview Styles */
      .watermark-preview-container {
        margin-top: 12px;
        padding: 8px;
        border: 1px solid #475569;
        border-radius: 6px;
        background-color: #1e293b;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .watermark-preview-title {
        font-size: 13px;
        margin-bottom: 8px;
        color: #e2e8f0;
      }

      .watermark-preview-canvas {
        border: 1px solid #475569;
        border-radius: 4px;
        max-width: 100%;
        height: auto;
      }

      /* Image Upload Styles */
      .image-upload-container {
        margin-bottom: 12px;
      }

      .image-upload-label {
        display: block;
        font-size: 13px;
        margin-bottom: 4px;
        opacity: 0.9;
      }

      .image-upload-button {
        display: inline-block;
        padding: 6px 12px;
        background-color: #3b82f6;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.2s;
      }

      .image-upload-button:hover {
        background-color: #2563eb;
      }

      .image-upload-input {
        display: none;
      }

      .uploaded-image-preview {
        margin-top: 8px;
        max-width: 100px;
        max-height: 100px;
        border: 1px solid #475569;
        border-radius: 4px;
      }

      .watermark-type-toggle {
        display: flex;
        margin-bottom: 12px;
        background-color: #334155;
        border-radius: 6px;
        padding: 4px;
      }

      .watermark-type-option {
        flex: 1;
        padding: 8px;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
        font-size: 13px;
        transition: background-color 0.2s;
      }

      .watermark-type-option.active {
        background-color: #3b82f6;
        color: white;
      }

      .watermark-size-control {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .watermark-size-label {
        font-size: 13px;
        min-width: 80px;
      }

      .watermark-size-slider {
        flex: 1;
        height: 4px;
        border-radius: 2px;
        background: #475569;
        outline: none;
        -webkit-appearance: none;
      }

      .watermark-size-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
      }

      .watermark-size-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: none;
      }

      .watermark-size-value {
        font-size: 13px;
        min-width: 40px;
        text-align: right;
      }

      /* GLM AI Assistant Styles */
      .glm-assistant-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border: none !important;
        color: white !important;
        padding: 8px 12px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        min-height: 36px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
      }

      .glm-assistant-btn:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
      }

      .glm-assistant-btn:active {
        transform: translateY(0) !important;
      }

      .glm-response-container {
        background: #1e293b;
        border: 1px solid #475569;
        border-radius: 8px;
        padding: 12px;
        margin-top: 12px;
        max-height: 300px;
        overflow-y: auto;
        font-size: 13px;
        line-height: 1.5;
      }

      .glm-response-text {
        color: #e2e8f0;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .glm-loading {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #94a3b8;
        font-style: italic;
      }

      .glm-loading::after {
        content: '';
        width: 16px;
        height: 16px;
        border: 2px solid #3b82f6;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

	.glm-generate-again-btn {
	    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
	    border: none !important;
	    color: white !important;
	    cursor: pointer !important;
	    font-size: 12px !important;
	    font-weight: 600 !important;
	    padding: 8px 12px !important;
	    border-radius: 6px !important;
	    margin-top: 1px !important;
	    transition: all 0.3s ease !important;
	    display: flex !important;
	    align-items: center !important;
	    justify-content: center !important;
	    gap: 4px !important;
	    min-height: 36px !important;
	}
	.glm-generate-again-btn:hover {
	    transform: translateY(-1px) !important;
	    box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
	}
	.glm-generate-again-btn:active {
	    transform: translateY(0) !important;
	}
	.glm-last-result {
	    background: rgba(16, 185, 129, 0.1) !important;
	    border: 1px solid rgba(16, 185, 129, 0.3) !important;
	    border-radius: 6px !important;
	    padding: 8px !important;
	    margin-bottom: 8px !important;
	    font-style: italic !important;
	    font-size: 12px !important;
	    color: #10b981 !important;
	    display: none !important;
	}
	.glm-use-last-btn {
	    background: linear-gradient(135deg, #64748b 0%, #475569 100%) !important;
	    border: none !important;
	    color: white !important;
	    cursor: pointer !important;
	    font-size: 12px !important;
	    font-weight: 600 !important;
	    padding: 8px 12px !important;
	    border-radius: 6px !important;
	    transition: all 0.3s ease !important;
	    display: flex !important;
	    align-items: center !important;
	    justify-content: center !important;
	    gap: 4px !important;
	    min-height: 36px !important;
	}
	.glm-use-last-btn:hover {
	    transform: translateY(-1px) !important;
	    box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
	}
	.glm-use-last-btn:active {
	    transform: translateY(0) !important;
	}

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .glm-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        flex-wrap: wrap;
      }

      .glm-action-btn {
        padding: 4px 8px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        transition: background-color 0.2s;
      }

      .glm-action-btn:hover {
        background: #2563eb;
      }

      .glm-action-btn.apply {
        background: #10b981;
      }

      .glm-action-btn.apply:hover {
        background: #059669;
      }
    `;
    document.head.appendChild(mobileFixStyle);

    // Checkbox Fix Style
    const checkboxFixStyle = document.createElement('style');
    checkboxFixStyle.textContent = `
      /* Perbaikan untuk checkbox di pengaturan watermark */
      .watermark-checkbox-container {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 16px 0;
      }

      .watermark-checkbox {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 20px;
        flex-shrink: 0; /* Mencegah checkbox menyusut */
      }

      .watermark-checkbox input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }

      .watermark-checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 20px;
        background-color: #334155;
        border: 1px solid #475569;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .watermark-checkbox:hover input ~ .watermark-checkmark {
        background-color: #475569;
        border-color: #64748b;
      }

      .watermark-checkbox input:checked ~ .watermark-checkmark {
        background-color: #3b82f6;
        border-color: #3b82f6;
      }

      .watermark-checkmark:after {
        content: "";
        position: absolute;
        display: none;
        left: 7px;
        top: 3px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }

      .watermark-checkbox input:checked ~ .watermark-checkmark:after {
        display: block;
      }

      .watermark-label {
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        line-height: 1.4;
        flex: 1; /* Memastikan label mengambil ruang yang tersedia */
      }
    `;
    document.head.appendChild(checkboxFixStyle);

    const LANGUAGE_KEY = "nai_language";
    const DEFAULT_LANGUAGE = "en";
    const SUPPORTED_LANGUAGES = {
        en: "English",
        ja: "日本語"
    };

    function detectLanguage() {
        const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
            return savedLanguage;
        }

        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith("ja")) return "ja";

        return DEFAULT_LANGUAGE;
    }

    let currentLanguage = detectLanguage();

    const TRANSLATIONS = {
        en: {
            ready: "Ready to go 🎯",
            profilesTitle: "Prompt Profiles",
            manageGlobalVars: "Manage Global Variables",
            manageWildcards: "Manage Wildcards",
            settingsBlacklist: "Vars & Blacklist",
            keyboardShortcuts: "Keyboard Shortcuts",
            watermarkSettings: "🖼️ Watermark Settings",
            glmApiSettings: "🤖 GLM API Settings",
            positivePlaceholder: "Positive prompt...",
            negativePlaceholder: "Negative prompt (Undesired Content)...",
            override: "🔄 Override",
            append: "➕ Append",
            newProfile: "🆕 New",
            saveProfile: "💾 Save",
            renameProfile: "✏️ Rename",
            deleteProfile: "🗑️ Delete",
            clearAll: "💥 Clear",
            swapPosition: "🔁 Swap Pos",
            danbooru: "🔍 Danbooru",
            e621: "🔍 E621",
            fullBackup: "📦 Full Backup",
            fullRestore: "🔁 Full Restore",
            searchProfiles: "🔍 Search",
            noProfiles: "No profiles yet",
            enterProfileName: "Name your new profile:",
            profileExists: name => `❌ "${name}" already exists.`,
            createdProfile: name => `✅ Created "${name}".`,
            pickProfileFirst: "❌ Pick a profile first.",
            savedProfile: name => `✔️ "${name}" saved.`,
            renamePrompt: "New name:",
            renameTaken: name => `❌ "${name}" already taken.`,
            renamed: (old, neu) => `🔄 Renamed "${old}" → "${neu}"`,
            confirmDelete: name => `Delete "${name}"?`,
            deletedSwitched: (del, newp) => `🗑️ Deleted "${del}". Switched to "${newp}".`,
            deletedNone: name => `🗑️ Deleted "${name}". No profiles left.`,
            confirmClearAll: "⚠️ Delete ALL profiles? This can't be undone.",
            clearedAll: "🧹 Cleared everything.",
            swapPrompt: "Swap with which profile number?",
            invalidPos: "❌ Invalid position.",
            alreadyThere: "ℹ️ Already there.",
            swapped: (pos1, pos2) => `✅ Swapped profile #${pos1} with profile #${pos2}.`,
            danbooruPrompt: (last) => `📌 Pull prompt from Danbooru
Enter post ID (like: 789532)
Last used: ${last || 'None'}`,
            e621Prompt: (last) => `📌 Pull prompt from E621
Enter post ID (like: 789532)
Last used: ${last || 'None'}`,
            danbooruInvalidId: "❌ ID must be numbers only.",
            e621InvalidId: "❌ ID must be numbers only.",
            danbooruFetching: id => `📥 Fetching Danbooru #${id}...`,
            e621Fetching: id => `📥 Fetching E621 #${id}...`,
            danbooruApplying: id => `🔧 Applying prompt from Danbooru #${id}...`,
            e621Applying: id => `🔧 Applying prompt from E621 #${id}...`,
            danbooruApplyFail: "❌ Failed to send to editor.",
            e621ApplyFail: "❌ Failed to send to editor.",
            danbooruError: err => `❌ Danbooru: ${err}`,
            e621Error: err => `❌ E621: ${err}`,
            backupSaved: "✅ Full backup saved!",
            restoreSelectFile: "Select backup file (.json)",
            restoreSuccess: "✅ Full backup restored!",
            restoreLegacy: "🔄 Loaded legacy profiles.",
            restoreInvalid: "❌ Not a valid backup file.",
            globalVarsTitle: "🔤 Global Variables { } ",
            globalVarsDesc: "Format: <code>name=value</code> | Input: {miku} <br>Example: <code>miku=twintail, blue hair, aqua eyes</code>",
            wildcardsTitle: "🎲 Wildcards [ ] ",
            wildcardsDesc: "Format: <code>name=value1, value2, ...</code> | Input: [character] <br>Example: <code>character=miku, teto, luka</code>",
            blacklistTitle: "⚙️ Tag Blacklist",
            blacklistDesc: "Tags below will be removed when fetching from Danbooru/E621. Separate with commas.",
            blacklistPlaceholder: "watermark, signature, artist name",
            blacklistSaved: count => `✅ Blacklist updated (${count} tags).`,
            nothingToPaste: "⚠️ Nothing to paste here.",
            cantFindEditor: "❌ Can't find the editor.",
            doneProseMirror: "✅ Done (ProseMirror)",
            fallbackMethod: "⚠️ That didn't work, trying another way...",
            pasted: "✅ Pasted!",
            clipboardCopy: "📋 Copied! Just hit Ctrl+V to paste it yourself.",
            clipboardFail: "❌ Couldn't copy to clipboard.",
            nothingToAppend: "⚠️ Nothing to append.",
            appendedProseMirror: "✅ Appended (ProseMirror)",
            appendFallback: "⚠️ Append fallback...",
            appended: "✅ Appended!",
            appendClipboard: "📋 Copied! Paste manually.",
            nothingToAppendNeg: "⚠️ Nothing to append (negative).",
            negAppendedProseMirror: "✅ Negative appended (ProseMirror)",
            negAppendFallback: "⚠️ Negative append clipboard fallback...",
            negAppended: "✅ Negative appended!",
            fillVarsTitle: "Fill Variables & Wildcards",
            fillVarsLabel: "Fill values for variables:",
            wildcardChoose: "-- Choose --",
            dbLabel: "Danbooru ID",
            e621Label: "E621 ID",
            dbPlaceholder: "789532",
            e621Placeholder: "789532",
            dbDesc: "Enter a post ID from Danbooru",
            e621Desc: "Enter a post ID from E621",
            cancel: "Cancel",
            apply: "Apply",
            updateAvailable: "🎉 Update Available!",
            updateNew: vers => `Version <strong>v${vers}</strong> is out.`,
            updateNow: "Update Now",
            addCharacter: "Add Character",
            editCharacter: "Edit Character",
            charNameLabel: "Character Name:",
            charPromptLabel: "Character Prompt:",
            charNamePlaceholder: "e.g. Miku",
            charPromptPlaceholder: "girl, blue hair, twintail...",
            removeCharacter: "Remove",
            moveUp: "Move Up",
            moveDown: "Move Down",
            noCharacters: "No characters yet",
            maxCharsWarning: (found, available) => `⚠️ Found ${found} characters, but only ${available} slots available. Some will be skipped.`,
            fillVariablesTitle: "Fill Variables",
            fillVariablesDesc: "Please fill in the values for the variables found in your prompt:",
            fillWildcardsTitle: "Select Wildcards",
            fillWildcardsDesc: "Please select values for the wildcards found in your prompt:",
            fillCharVarsTitle: "Character Variables & Wildcards",
            fillCharVarsDesc: "Fill in values for variables and select wildcards for character prompts:",
            generate: "🎨 Generate Image",
            profileTab: "Profile",
            characterTab: "Character",
            utilityTab: "Utility",
            settingsTab: "Settings",
            close: "✕ Close",
            selectChar: "Select a character...",
            searchCharDB: "Search character database...",
            addSelected: "Add Selected",
            noCharsFound: "No characters found",
            editCharDB: "Edit",
            notificationSettings: "Notification Settings",
            enableNotifications: "🔔Notifications",
            notificationDesc: "Show success/error messages on screen.",
            deleteCharDB: "Delete",
            organizeCharDB: "Organize",
            organizeCharDBTitle: "Organize Character Database",
            searchCharsPlaceholder: "Search characters...",
            promptForUndefVars: "Prompt for Undefined {Variables}",
            editChar: "Edit",
            renameChar: "Rename",
            deleteChar: "Delete",
            confirmDeleteChar: name => `Delete "${name}" from database?`,
            charDeleted: name => `Deleted "${name}" from database`,
            charRenamed: (old, neu) => `Renamed "${old}" to "${neu}"`,
            steps: "steps",
            guidance: "guidance",
            applySettings: "Apply Settings",
            imageSettings: "Image Generation Settings",
            languageSettings: "Language Settings",
            languageDesc: "Select your preferred language:",
            languageChanged: "Language changed. The page will now refresh.",
            languageAutoDetect: "Auto-detect from browser",
            addCharToDB: "Add Character to Database",
            characterDB: "Character Database",
            addToDB: "Add to DB",
            profileMenu: "📁 Profile",
            profileOptions: "Profile Options",
            namePromptRequired: "Name and prompt are required.",
            noPrompt: "No prompt",
            variables: "Variables",
            wildcards: "Wildcards",
            enterNewName: "Enter new name:",
            characterExists: "Character already exists",
            orderUpdated: "✅ Order updated",
            charAddedToProfile: name => `✅ Added "${name}" to profile`,
            charDeletedFromProfile: name => `🗑️ "${name}" deleted`,
            charUpdated: name => `✅ Character "${name}" updated`,
            charAdded: name => `✅ Character "${name}" added`,
            generatingImage: "🎨 Generating image...",
            cantFindGenerateBtn: "❌ Could not find or click the generate button. The page structure might have changed.",
            updateNotice: "🎉 Update Available!",
            updateVersion: vers => `Version <strong>v${vers}</strong> is out.`,
            updateButton: "Update Now",
            zoomIn: "Zoom In",
            zoomOut: "Zoom Out",
            resetZoom: "Reset Zoom",
            zoomLevel: level => `Zoom: ${level}%`,
            imageSettingsApplied: "✅ Image settings applied",
            nameRequired: "Name is required",
            promptRequired: "Prompt is required",
            quickAddTitle: "Quick Add to Base Prompt",
            errorSavingSettings: "❌ Error saving settings.",
            shortcutsTitle: "Keyboard Shortcuts",
            shortcutsDesc: "Customize keyboard shortcuts for quick access to features.",
            shortcutsNote: "Note: CTRL+1 to CTRL+9 are reserved for quick profile switching and cannot be changed.",
            shortcutConflictWarning: "This shortcut conflicts with a browser shortcut and may not work properly.",
            shortcutSaved: "✅ Keyboard shortcuts saved!",
            shortcutConflict: "⚠️ Shortcut conflict detected!",
            newProfileShortcut: "New Profile",
            saveProfileShortcut: "Save Profile",
            renameProfileShortcut: "Rename Profile",
            deleteProfileShortcut: "Delete Profile",
            searchShortcut: "Search Profiles",
            overrideShortcut: "Override",
            appendShortcut: "Append",
            addCharacterShortcut: "Add Character",
            addToDBShortcut: "Add to DB",
            organizeShortcut: "Organize Character Database",
            characterTabShortcut: "Character Tab",
            danbooruShortcut: "Danbooru Fetch",
            e621Shortcut: "E621 Fetch",
            fullBackupShortcut: "Full Backup",
            fullRestoreShortcut: "Full Restore",
            pressKey: "Press a key combination",
            ctrlKey: "Ctrl",
            altKey: "Alt",
            shiftKey: "Shift",
            enterKey: "Enter",
            escapeKey: "Escape",
            spaceKey: "Space",
            tabKey: "Tab",
            backspaceKey: "Backspace",
            deleteKey: "Delete",
            watermarkText: "Watermark Text",
            watermarkFontSize: "Font Size",
            watermarkFont: "Font",
            watermarkBackgroundColor: "Background Color",
            watermarkPadding: "Padding",
            watermarkBorderRadius: "Border Radius",
            watermarkOpacity: "Opacity",
            watermarkColor: "Color",
            watermarkPosition: "Position",
            watermarkMargin: "Margin",
            enableWatermark: "Enable Auto Watermark",
            disableBackground: "Disable Background",
            textShadowColor: "Text Shadow Color",
            topLeft: "Top Left",
            topRight: "Top Right",
            bottomLeft: "Bottom Left",
            bottomRight: "Bottom Right",
            center: "Center",
            imageWithWatermark: "✅ Image downloaded with watermark",
            watermarkRemoved: "✅ Metadata removed and image downloaded",
            watermarkPreview: "Watermark Preview",
            watermarkType: "Watermark Type",
            textWatermark: "Text Watermark",
            imageWatermark: "Image Watermark",
            uploadImage: "Upload Image",
            imageSize: "Image Size",
            maintainAspectRatio: "Maintain Aspect Ratio",
            // GLM AI Assistant translations
            glmApiKeyLabel: "GLM API Key:",
            glmApiKeyPlaceholder: "Enter your GLM API key...",
            glmAssistant: "🤖 AI Prompt Optimizer",
            glmIdeas: "💡 AI Idea Generator",
            glmTags: "🏷️ AI Tag Suggester",
            glmExpander: "📝 AI Prompt Expander",
            glmApiKeyRequired: "Please set your GLM API key in Settings first",
            glmCallingApi: "🤖 Calling GLM API...",
            glmApiResponse: "✅ GLM API response received",
            glmApiError: "❌ GLM API Error:",
            glmAssistantPlaceholder: "Enter your prompt to improve/optimize...",
            glmIdeasPlaceholder: "Describe what kind of image ideas you want...",
            glmTagsPlaceholder: "Enter simple prompt to get tag suggestions...",
            glmExpanderPlaceholder: "Enter a short prompt to expand with details...",
            glmApplyPrompt: "Apply to Editor",
            glmCopyPrompt: "Copy to Clipboard",
            glmClearResponse: "Clear Response",
            glmGenerating: "Generating..."
        },
        ja: {
            ready: "準備完了 🎯",
            profilesTitle: "プロンプトプロファイル",
            manageGlobalVars: "グローバル変数の管理",
            manageWildcards: "ワイルドカードの管理",
            settingsBlacklist: "設定とブラックリスト",
            keyboardShortcuts: "キーボードショートカット",
            watermarkSettings: "🖼️ ウォーターマーク設定",
            glmApiSettings: "🤖 GLM API設定",
            positivePlaceholder: "ポジティブプロンプト...",
            negativePlaceholder: "ネガティブプロンプト（望ましくないコンテンツ）...",
            override: "🔄 上書き",
            append: "➕ 追加",
            newProfile: "🆕 新規",
            saveProfile: "💾 保存",
            renameProfile: "✏️ 名前変更",
            deleteProfile: "🗑️ 削除",
            clearAll: "💥 全削除",
            swapPosition: "🔁 位置交換",
            danbooru: "🔍 Danbooru",
            e621: "🔍 E621",
            fullBackup: "📦 完全バックアップ",
            fullRestore: "🔁 完全復元",
            searchProfiles: "🔍 検索",
            noProfiles: "プロファイルがありません",
            enterProfileName: "新しいプロファイル名を入力してください：",
            profileExists: name => `❌ "${name}" は既に存在します。`,
            createdProfile: name => `✅ "${name}" を作成しました。`,
            pickProfileFirst: "❌ まずプロファイルを選択してください。",
            savedProfile: name => `✔️ "${name}" を保存しました。`,
            renamePrompt: "新しい名前：",
            renameTaken: name => `❌ "${name}" は既に使用されています。`,
            renamed: (old, neu) => `🔄 "${old}" を "${neu}" に名前変更しました`,
            confirmDelete: name => `"${name}" を削除しますか？`,
            deletedSwitched: (del, newp) => `🗑️ "${del}" を削除しました。"${newp}" に切り替えました。`,
            deletedNone: name => `🗑️ "${name}" を削除しました。プロファイルがありません。`,
            confirmClearAll: "⚠️ すべてのプロファイルを削除しますか？これは元に戻せません。",
            clearedAll: "🧹 すべてをクリアしました。",
            swapPrompt: "どのプロファイル番号と交換しますか？",
            invalidPos: "❌ 無効な位置です。",
            alreadyThere: "ℹ️ すでにそこにあります。",
            swapped: (pos1, pos2) => `✅ プロファイル #${pos1} とプロファイル #${pos2} を交換しました。`,
            danbooruPrompt: (last) => `📌 Danbooruからプロンプトを取得
投稿IDを入力（例：789532）
最後に使用：${last || 'なし'}`,
            e621Prompt: (last) => `📌 E621からプロンプトを取得
投稿IDを入力（例：789532）
最後に使用：${last || 'なし'}`,
            danbooruInvalidId: "❌ IDは数字のみである必要があります。",
            e621InvalidId: "❌ IDは数字のみである必要があります。",
            danbooruFetching: id => `📥 Danbooru #${id} を取得中...`,
            e621Fetching: id => `📥 E621 #${id} を取得中...`,
            danbooruApplying: id => `🔧 Danbooru #${id} からプロンプトを適用中...`,
            e621Applying: id => `🔧 E621 #${id} からプロンプトを適用中...`,
            danbooruApplyFail: "❌ エディターへの送信に失敗しました。",
            e621ApplyFail: "❌ エディターへの送信に失敗しました。",
            danbooruError: err => `❌ Danbooru: ${err}`,
            e621Error: err => `❌ E621: ${err}`,
            backupSaved: "✅ 完全バックアップを保存しました！",
            restoreSelectFile: "バックアップファイルを選択（.json）",
            restoreSuccess: "✅ 完全バックアップを復元しました！",
            restoreLegacy: "🔄 レガシープロファイルを読み込みました。",
            restoreInvalid: "❌ 有効なバックアップファイルではありません。",
            globalVarsTitle: "🔤 グローバル変数 { } ",
            globalVarsDesc: "形式: <code>名前=値</code> | 入力: {miku} <br>例: <code>miku=ツインテール、青い髪、水色の目</code>",
            wildcardsTitle: "🎲 ワイルドカード [ ] ",
            wildcardsDesc: "形式: <code>名前=値1, 値2, ...</code> | 入力: [character] <br>例: <code>character=miku, teto, luka</code>",
            blacklistTitle: "⚙️ タグブラックリスト",
            blacklistDesc: "Danbooru/E621から取得する際に以下のタグが削除されます。カンマで区切ってください。",
            blacklistPlaceholder: "watermark, signature, artist name",
            blacklistSaved: count => `✅ ブラックリストを更新しました（${count}タグ）。`,
            nothingToPaste: "⚠️ ここに貼り付けるものがありません。",
            cantFindEditor: "❌ エディターが見つかりません。",
            doneProseMirror: "✅ 完了（ProseMirror）",
            fallbackMethod: "⚠️ うまくいきませんでした、別の方法を試しています...",
            pasted: "✅ 貼り付けました！",
            clipboardCopy: "📋 コピーしました！Ctrl+Vを押して自分で貼り付けてください。",
            clipboardFail: "❌ クリップボードにコピーできませんでした。",
            nothingToAppend: "⚠️ 追加するものがありません。",
            appendedProseMirror: "✅ 追加しました（ProseMirror）",
            appendFallback: "⚠️ 追加のフォールバック...",
            appended: "✅ 追加しました！",
            appendClipboard: "📋 コピーしました！手動で貼り付けてください。",
            nothingToAppendNeg: "⚠️ 追加するものがありません（ネガティブ）。",
            negAppendedProseMirror: "✅ ネガティブを追加しました（ProseMirror）",
            negAppendFallback: "⚠️ ネガティブ追加のクリップボードフォールバック...",
            negAppended: "✅ ネガティブを追加しました！",
            fillVarsTitle: "変数とワイルドカードを入力",
            fillVarsLabel: "変数の値を入力：",
            wildcardChoose: "-- 選択 --",
            dbLabel: "Danbooru ID",
            e621Label: "E621 ID",
            dbPlaceholder: "789532",
            e621Placeholder: "789532",
            dbDesc: "Danbooruの投稿IDを入力",
            e621Desc: "E621の投稿IDを入力",
            cancel: "キャンセル",
            apply: "適用",
            updateAvailable: "🎉 アップデート利用可能！",
            updateNew: vers => `バージョン <strong>v${vers}</strong> が利用可能です。`,
            updateNow: "今すぐアップデート",
            addCharacter: "キャラクターを追加",
            editCharacter: "キャラクターを編集",
            charNameLabel: "キャラクター名：",
            charPromptLabel: "キャラクタープロンプト：",
            charNamePlaceholder: "例：ミク",
            charPromptPlaceholder: "少女、青い髪、ツインテール...",
            removeCharacter: "削除",
            moveUp: "上に移動",
            moveDown: "下に移動",
            noCharacters: "キャラクターがいません",
            maxCharsWarning: (found, available) => `⚠️ ${found}個のキャラクターが見つかりましたが、利用可能なスロットは${available}個のみです。一部はスキップされます。`,
            fillVariablesTitle: "変数を入力",
            fillVariablesDesc: "プロンプト内に見つかった変数の値を入力してください：",
            fillWildcardsTitle: "ワイルドカードを選択",
            fillWildcardsDesc: "プロンプト内に見つかったワイルドカードの値を選択してください：",
            fillCharVarsTitle: "キャラクター変数とワイルドカード",
            fillCharVarsDesc: "キャラクタープロンプトの変数の値を入力し、ワイルドカードを選択してください：",
            generate: "🎨 画像を生成",
            profileTab: "プロファイル",
            characterTab: "キャラクター",
            utilityTab: "ユーティリティ",
            settingsTab: "設定",
            close: "✕ 閉じる",
            selectChar: "キャラクターを選択...",
            searchCharDB: "キャラクターデータベースを検索...",
            addSelected: "選択したものを追加",
            noCharsFound: "キャラクターが見つかりません",
            editCharDB: "編集",
            notificationSettings: "通知設定",
            enableNotifications: "🔔通知",
            notificationDesc: "成功/エラーメッセージを画面に表示します。",
            deleteCharDB: "削除",
            organizeCharDB: "整理",
            organizeCharDBTitle: "キャラクターデータベースを整理",
            searchCharsPlaceholder: "キャラクターを検索...",
            promptForUndefVars: "未定義の{変数}の入力を求める",
            editChar: "編集",
            renameChar: "名前変更",
            deleteChar: "削除",
            confirmDeleteChar: name => `データベースから "${name}" を削除しますか？`,
            charDeleted: name => `データベースから "${name}" を削除しました`,
            charRenamed: (old, neu) => `"${old}" を "${neu}" に名前変更しました`,
            steps: "ステップ",
            guidance: "正確度",
            applySettings: "設定を適用",
            imageSettings: "画像生成設定",
            languageSettings: "言語設定",
            languageDesc: "希望する言語を選択してください：",
            languageChanged: "言語が変更されました。ページがすぐに更新されます。",
            languageAutoDetect: "ブラウザから自動検出",
            addCharToDB: "キャラクターをデータベースに追加",
            characterDB: "キャラクターデータベース",
            addToDB: "DBに追加",
            profileMenu: "📁 プロファイル",
            profileOptions: "プロファイルオプション",
            namePromptRequired: "名前とプロンプトが必要です。",
            noPrompt: "プロンプトがありません",
            variables: "変数",
            wildcards: "ワイルドカード",
            enterNewName: "新しい名前を入力：",
            characterExists: "キャラクターが既に存在します",
            orderUpdated: "✅ 順序が更新されました",
            charAddedToProfile: name => `✅ "${name}" をプロファイルに追加しました`,
            charDeletedFromProfile: name => `🗑️ "${name}" を削除しました`,
            charUpdated: name => `✅ キャラクター "${name}" を更新しました`,
            charAdded: name => `✅ キャラクター "${name}" を追加しました`,
            generatingImage: "🎨 画像を生成中...",
            cantFindGenerateBtn: "❌ 生成ボタンが見つからないかクリックできません。ページ構造が変更された可能性があります。",
            updateNotice: "🎉 アップデート利用可能！",
            updateVersion: vers => `バージョン <strong>v${vers}</strong> が利用可能です。`,
            updateButton: "今すぐアップデート",
            zoomIn: "ズームイン",
            zoomOut: "ズームアウト",
            resetZoom: "ズームリセット",
            zoomLevel: level => `ズーム: ${level}%`,
            imageSettingsApplied: "✅ 画像設定を適用しました",
            nameRequired: "名前が必要です",
            promptRequired: "プロンプトが必要です",
            quickAddTitle: "ベースプロンプトにクイック追加",
            errorSavingSettings: "❌ 設定の保存中にエラーが発生しました。",
            metadataRemover: "🔒 メタデータを削除",
            metadataRemoved: "✅ メタデータが削除され、画像がダウンロードされました",
            metadataError: "❌ メタデータの削除に失敗しました",
            shortcutsTitle: "キーボードショートカット",
            shortcutsDesc: "機能へのクイックアクセスのためのキーボードショートカットをカスタマイズします。",
            shortcutsNote: "注：CTRL+1からCTRL+9はクイックプロファイル切り替え用に予約されており、変更できません。",
            shortcutConflictWarning: "このショートカットはブラウザのショートカットと競合し、正常に機能しない可能性があります。",
            shortcutSaved: "✅ キーボードショートカットが保存されました！",
            shortcutConflict: "⚠️ ショートカットの競合が検出されました！",
            newProfileShortcut: "新しいプロファイル",
            saveProfileShortcut: "プロファイルを保存",
            renameProfileShortcut: "プロファイル名を変更",
            deleteProfileShortcut: "プロファイルを削除",
            searchShortcut: "プロファイルを検索",
            overrideShortcut: "上書き",
            appendShortcut: "追加",
            addCharacterShortcut: "キャラクターを追加",
            addToDBShortcut: "DBに追加",
            organizeShortcut: "整理",
            characterTabShortcut: "キャラクタータブ",
            danbooruShortcut: "Danbooru取得",
            e621Shortcut: "E621取得",
            fullBackupShortcut: "完全バックアップ",
            fullRestoreShortcut: "完全復元",
            pressKey: "キーの組み合わせを押してください",
            ctrlKey: "Ctrl",
            altKey: "Alt",
            shiftKey: "Shift",
            enterKey: "Enter",
            escapeKey: "Escape",
            spaceKey: "Space",
            tabKey: "Tab",
            backspaceKey: "Backspace",
            deleteKey: "Delete",
            watermarkText: "ウォーターマークテキスト",
            watermarkFontSize: "フォントサイズ",
            watermarkFont: "フォント",
            watermarkBackgroundColor: "背景色",
            watermarkPadding: "パディング",
            watermarkBorderRadius: "境界線の丸み",
            watermarkOpacity: "不透明度",
            watermarkColor: "色",
            watermarkPosition: "位置",
            watermarkMargin: "マージン",
            enableWatermark: "自動ウォーターマークを有効にする",
            disableBackground: "背景を無効にする",
            textShadowColor: "テキストシャドウの色",
            topLeft: "左上",
            topRight: "右上",
            bottomLeft: "左下",
            bottomRight: "右下",
            center: "中央",
            imageWithWatermark: "✅ ウォーターマーク付きで画像をダウンロードしました",
            watermarkRemoved: "✅ メタデータが削除され、画像がダウンロードされました",
            watermarkPreview: "ウォーターマークプレビュー",
            watermarkType: "ウォーターマークタイプ",
            textWatermark: "テキストウォーターマーク",
            imageWatermark: "イメージウォーターマーク",
            uploadImage: "画像をアップロード",
            imageSize: "画像サイズ",
            maintainAspectRatio: "アスペクト比を維持",
            // GLM AI Assistant translations
            glmApiKeyLabel: "GLM APIキー:",
            glmApiKeyPlaceholder: "GLM APIキーを入力...",
            glmAssistant: "🤖 AIプロンプトアシスタント",
            glmIdeas: "💡 AIアイデアジェネレーター",
            glmTags: "🏷️ AIタグサジェスター",
            glmTranslator: "🌐 AIプロンプト翻訳者",
            glmExpander: "📝 AIプロンプトエキスパンダー",
            glmApiKeyRequired: "まず設定でGLM APIキーを設定してください",
            glmCallingApi: "🤖 GLM APIを呼び出し中...",
            glmApiResponse: "✅ GLM APIレスポンスを受信しました",
            glmApiError: "❌ GLM APIエラー:",
            glmAssistantPlaceholder: "改善/最適化するプロンプトを入力...",
            glmIdeasPlaceholder: "どのような画像アイデアが欲しいかを説明...",
            glmTagsPlaceholder: "タグ提案を取得するための基本プロンプトを入力...",
            glmExpanderPlaceholder: "詳細を展開する短いプロンプトを入力...",
            glmApplyPrompt: "エディターに適用",
            glmCopyPrompt: "クリップボードにコピー",
            glmClearResponse: "レスポンスをクリア",
            glmGenerating: "生成中..."
        }
    };

    const t = (key, ...args) => {
        const str = TRANSLATIONS[currentLanguage][key] || TRANSLATIONS[DEFAULT_LANGUAGE][key] || key;
        if (typeof str === 'function') return str(...args);
        return str;
    };

    function changeLanguage(lang) {
        if (SUPPORTED_LANGUAGES[lang]) {
            localStorage.setItem(LANGUAGE_KEY, lang);
            showNotification(t('languageChanged'), 'info');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    // Storage Keys
    const STORAGE_KEY = "nai_prompt_profiles_v2";
    const LAST_PROFILE_KEY = "nai_last_profile";
    const ICON_POS_KEY = "nai_icon_position";
    const BLACKLIST_KEY = "nai_danbooru_blacklist";
    const LAST_ID_KEY = "nai_last_danbooru_id";
    const LAST_E621_ID_KEY = "nai_last_e621_id";
    const GLOBAL_VARIABLES_KEY = "nai_global_variables";
    const WILDCARDS_KEY = "nai_wildcards";
    const WILDCARD_REMAINING_KEY = "nai_wildcard_remaining";
    const CHARACTER_DB_KEY = "nai_character_database";
    const NOTIFICATION_SETTINGS_KEY = "nai_notification_settings";
    const IMAGE_SETTINGS_KEY = "nai_image_settings";
    const FREE_VARIABLES_KEY = "nai_free_variables_enabled";
    const BLACKLISTED_CATEGORIES_KEY = "nai_blacklisted_categories";
    const KEYBOARD_SHORTCUTS_KEY = "nai_keyboard_shortcuts";

    // Watermark settings
    const WATERMARK_SETTINGS_KEY = "nai_watermark_settings";
    const WATERMARK_ENABLED_KEY = "nai_watermark_enabled";
    const WATERMARK_TYPE_KEY = "nai_watermark_type";
    const WATERMARK_IMAGE_KEY = "nai_watermark_image";
    const WATERMARK_IMAGE_SIZE_KEY = "nai_watermark_image_size";

    // Initialize variables
    let profiles = [];
    let lastProfileName = localStorage.getItem(LAST_PROFILE_KEY);
    let lastId = localStorage.getItem(LAST_ID_KEY) || "";
    let lastE621Id = localStorage.getItem(LAST_E621_ID_KEY) || "";
    let blacklistTags = [];
    let globalVariables = {};
    let wildcards = {};
    let wildcardRemaining = {};
    let characterDatabase = {};
    let enableNotifications = true;
    let freeVariablesEnabled = true;
    let blacklistedCategories = [];
    let keyboardShortcuts = {};
    let imageSettings = {
        steps: 28,
        guidance: 5.0
    };

    // Watermark variables
    let watermarkSettings = {
        text: "Created with NovelAI",
        fontSize: 16,
        font: "Arial",
        color: "#ffffff",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        opacity: 0.7,
        position: "bottom-right",
        margin: 10,
        padding: 5,
        borderRadius: 5,
        disableBackground: false,
        textShadowColor: "#000000"
    };
    let watermarkEnabled = false;
    let watermarkType = "text"; // "text" or "image"
    let watermarkImage = null; // Base64 encoded image
    let watermarkImageSize = 100; // Size in pixels

    const DEFAULT_SHORTCUTS = {
        newProfile: { alt: true, key: 'n' },
        saveProfile: { alt: true, key: 's' },
        renameProfile: { alt: true, key: 'r' },
        deleteProfile: { alt: true, key: 'd' },
        search: { alt: true, key: 'q' },
        override: { alt: true, key: 'o' },
        append: { alt: true, key: 'a' },
        addCharacter: { alt: true, key: 'c' },
        addToDB: { alt: true, key: 't' },
        organize: { alt: true, key: 'g' },
        characterTab: { alt: true, key: '2' },
        danbooru: { alt: true, key: '3' },
        e621: { alt: true, key: '4' },
        fullBackup: { alt: true, key: 'b' },
        fullRestore: { alt: true, key: 'v' }
    };

    const BROWSER_SHORTCUTS = {
        'ctrl+n': true,  // New window
        'ctrl+s': true,  // Save page
        'ctrl+o': true,  // Open file
        'ctrl+a': true,  // Select all
        'ctrl+b': true,  // Bookmarks
        'ctrl+d': true,  // Bookmark page
        'ctrl+f': true,  // Find
        'ctrl+g': true,  // Find next
        'ctrl+h': true,  // History
        'ctrl+j': true,  // Downloads
        'ctrl+k': true,  // Focus address bar
        'ctrl+l': true,  // Focus address bar
        'ctrl+p': true,  // Print
        'ctrl+r': true,  // Reload
        'ctrl+t': true,  // New tab
        'ctrl+u': true,  // View source
        'ctrl+v': true,  // Paste
        'ctrl+w': true,  // Close tab
        'ctrl+x': true,  // Cut
        'ctrl+y': true,  // Redo
        'ctrl+z': true,  // Undo
        'ctrl+0': true,  // Reset zoom
        'ctrl+1': true,  // Switch to tab 1
        'ctrl+2': true,  // Switch to tab 2
        'ctrl+3': true,  // Switch to tab 3
        'ctrl+4': true,  // Switch to tab 4
        'ctrl+5': true,  // Switch to tab 5
        'ctrl+6': true,  // Switch to tab 6
        'ctrl+7': true,  // Switch to tab 7
        'ctrl+8': true,  // Switch to tab 8
        'ctrl+9': true,  // Switch to tab 9
        'ctrl+-': true,  // Zoom out
        'ctrl+=': true,  // Zoom in
        'ctrl+shift+i': true,  // Developer tools
        'ctrl+shift+j': true,  // Developer tools
        'ctrl+shift+c': true   // Developer tools
    };

    // Load all settings
    loadLastGLMResults();
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) profiles = JSON.parse(saved).filter(p => p && p.name).map(p => ({...p, characters: Array.isArray(p.characters) ? p.characters : [] })); } catch (e) {}
    try { blacklistTags = (localStorage.getItem(BLACKLIST_KEY) || "").split(',').map(t => t.trim().toLowerCase()).filter(t => t); } catch (e) {}
    try { globalVariables = JSON.parse(localStorage.getItem(GLOBAL_VARIABLES_KEY) || "{}"); } catch (e) {}
    try { wildcards = JSON.parse(localStorage.getItem(WILDCARDS_KEY) || "{}"); } catch (e) {}
    try { wildcardRemaining = JSON.parse(localStorage.getItem(WILDCARD_REMAINING_KEY) || "{}"); } catch (e) {}
    try { characterDatabase = JSON.parse(localStorage.getItem(CHARACTER_DB_KEY) || "{}"); } catch (e) {}
    try { enableNotifications = JSON.parse(localStorage.getItem(NOTIFICATION_SETTINGS_KEY) || "true"); } catch (e) {}
    try { freeVariablesEnabled = JSON.parse(localStorage.getItem(FREE_VARIABLES_KEY) || "true"); } catch (e) {}
    try { blacklistedCategories = (localStorage.getItem(BLACKLISTED_CATEGORIES_KEY) || "").split(',').map(t => t.trim()).filter(t => t); } catch (e) {}
    try {
        const saved = localStorage.getItem(KEYBOARD_SHORTCUTS_KEY);
        if (saved) {
            keyboardShortcuts = JSON.parse(saved);
        } else {
            keyboardShortcuts = { ...DEFAULT_SHORTCUTS };
        }
    } catch (e) {
        keyboardShortcuts = { ...DEFAULT_SHORTCUTS };
    }
    try {
        const saved = localStorage.getItem(IMAGE_SETTINGS_KEY);
        if (saved) {
            const loaded = JSON.parse(saved);
            imageSettings = { ...imageSettings, ...loaded };
        }
    } catch (e) {
        console.error("Failed to load image settings:", e);
    }

    // Load watermark settings
    try {
        const saved = localStorage.getItem(WATERMARK_SETTINGS_KEY);
        if (saved) {
            watermarkSettings = { ...watermarkSettings, ...JSON.parse(saved) };
        }
        watermarkEnabled = JSON.parse(localStorage.getItem(WATERMARK_ENABLED_KEY) || "false");
        watermarkType = localStorage.getItem(WATERMARK_TYPE_KEY) || "text";
        watermarkImage = localStorage.getItem(WATERMARK_IMAGE_KEY) || null;
        watermarkImageSize = parseInt(localStorage.getItem(WATERMARK_IMAGE_SIZE_KEY) || "100");
    } catch (e) {
        console.error("Failed to load watermark settings:", e);
    }

    // GLM API Functions
    async function callGLMAPI(prompt, systemPrompt = "You are a helpful AI assistant for NovelAI image generation prompts.") {
        if (!glmApiKey) {
            showNotification(t('glmApiKeyRequired'), 'error');
            return null;
        }

        try {
            showNotification(t('glmCallingApi'), 'info');

            const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${glmApiKey}`
                },
                body: JSON.stringify({
                    model: "glm-4-plus",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.choices && data.choices.length > 0) {
                showNotification(t('glmApiResponse'), 'success');
                return data.choices[0].message.content;
            } else {
                throw new Error("No response from GLM API");
            }
        } catch (error) {
            console.error("GLM API Error:", error);
            showNotification(`${t('glmApiError')} ${error.message}`, 'error');
            return null;
        }
    }

function openGLMAssistantModal(type = 'assistant', existingInput = null) {
    if (document.getElementById('nai-glm-assistant-modal')) return;
    const colors = getThemeColors();
    const modal = document.createElement('div');
    modal.id = 'nai-glm-assistant-modal';
    	    let hasValidLastResult = false;
    if (lastGLMResults[type] && lastGLMResults[type].output) {
        // Cek apakah hasil masih relevan (tidak terlalu lama)
        const resultAge = Date.now() - (lastGLMResults[type].timestamp || 0);
        const maxAge = 24 * 60 * 60 * 1000; // 24 jam

        if (resultAge < maxAge) {
            hasValidLastResult = true;
        }
    }
    Object.assign(modal.style, {
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : '600px', maxWidth: '90vw',
        height: isMobile ? '80vh' : '70vh', maxHeight: isMobile ? '85vh' : '80vh',
        background: colors.background, color: colors.color,
        border: `1px solid ${colors.borderColor}`, borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: '20000',
        padding: '20px', fontFamily: 'sans-serif', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column'
    });

    // Buat header dengan createElement untuk menghindari konflik
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '16px';

    // Tentukan title berdasarkan type
    let modalTitle = '';
    if (type === 'assistant') {
        modalTitle = t('glmAssistant');
    } else if (type === 'ideas') {
        modalTitle = t('glmIdeas');
    } else if (type === 'tags') {
        modalTitle = t('glmTags');
    } else if (type === 'expander') {
        modalTitle = t('glmExpander');
    }

    const titleElement = document.createElement('h3');
    titleElement.textContent = modalTitle;
    titleElement.style.margin = '0';
    titleElement.style.fontSize = '16px';
    titleElement.style.fontWeight = 'bold';

    // Buat close button dengan nama unik untuk menghindari konflik
    const modalCloseBtn = document.createElement('button');
    modalCloseBtn.innerHTML = '✕';
    Object.assign(modalCloseBtn.style, {
        background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer',
        padding: '4px', borderRadius: '4px', color: colors.color
    });
    modalCloseBtn.onmouseover = () => { modalCloseBtn.style.backgroundColor = colors.inputBackground; };
    modalCloseBtn.onmouseout = () => { modalCloseBtn.style.backgroundColor = 'transparent'; };
    modalCloseBtn.onclick = () => document.body.removeChild(modal);

    header.appendChild(titleElement);
    header.appendChild(modalCloseBtn);

    const contentArea = document.createElement('div');
    contentArea.style.flex = '1';
    contentArea.style.overflowY = 'auto';
    contentArea.style.marginBottom = '16px';

    // Language selector untuk translator
    let languageSelector = '';
    let placeholder, buttonText;

    if (type === 'translator') {
    } else if (type === 'assistant') {
        placeholder = t('glmAssistantPlaceholder');
        buttonText = "🔧 Improve Prompt";
    } else if (type === 'ideas') {
        placeholder = t('glmIdeasPlaceholder');
        buttonText = "💡 Generate Ideas";
    } else if (type === 'tags') {
        placeholder = t('glmTagsPlaceholder');
        buttonText = "🏷️ Suggest Tags";
    } else if (type === 'expander') {
        placeholder = t('glmExpanderPlaceholder');
        buttonText = "📝 Expand Prompt";
    }

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${modalTitle}</h3>
            <button id="glm-close-modal" style="background: none; border: none; font-size: 20px; cursor: pointer; padding: 4px; border-radius: 4px; color: ${colors.color};">✕</button>
        </div>
        ${lastGLMResults[type] && lastGLMResults[type].output ? `
            <div class="glm-last-result" id="glm-last-result">
                <strong>Previous Result:</strong> ${lastGLMResults[type].output.substring(0, 100)}${lastGLMResults[type].output.length > 100 ? '...' : ''}
            </div>
        ` : ''}
        ${languageSelector}
        <div style="margin-bottom: 12px;">
            <textarea id="glm-input" placeholder="${placeholder}" style="width: 100%; height: 100px; padding: 10px; border-radius: 6px; border: 1px solid ${colors.borderColor}; background: ${colors.inputBackground}; color: ${colors.inputColor}; font-size: 13px; resize: vertical;"></textarea>
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <button id="glm-process-btn" class="glm-assistant-btn">${buttonText}</button>
            <button id="glm-clear-btn" style="padding: 8px 16px; background: #64748b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; min-height: 36px;">Clear</button>
            ${lastGLMResults[type] ? `<button id="glm-use-last-btn" class="glm-use-last-btn">🔄 Use Last Result</button>` : ''}
        </div>
        <div id="glm-response-container" style="flex: 1; display: none;">
            <div style="font-size: 13px; margin-bottom: 8px; opacity: 0.9;">AI Response:</div>
            <div class="glm-response-container">
                <div id="glm-response-text" class="glm-response-text"></div>
            </div>
            <div class="glm-actions">
                <button id="glm-apply-btn" class="glm-action-btn apply">${t('glmApplyPrompt')}</button>
                <button id="glm-copy-btn" class="glm-action-btn">${t('glmCopyPrompt')}</button>
                <button id="glm-clear-response-btn" class="glm-action-btn">${t('glmClearResponse')}</button>
                <button id="glm-generate-again-btn" class="glm-generate-again-btn" style="display:none;">🔄 Generate Again</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const input = modal.querySelector('#glm-input');
    const processBtn = modal.querySelector('#glm-process-btn');
    const clearBtn = modal.querySelector('#glm-clear-btn');
    const responseContainer = modal.querySelector('#glm-response-container');
    const responseText = modal.querySelector('#glm-response-text');
    const applyBtn = modal.querySelector('#glm-apply-btn');
    const copyBtn = modal.querySelector('#glm-copy-btn');
    const clearResponseBtn = modal.querySelector('#glm-clear-response-btn');
    const closeBtn = modal.querySelector('#glm-close-modal');
    const generateAgainBtn = modal.querySelector('#glm-generate-again-btn');
    const useLastBtn = modal.querySelector('#glm-use-last-btn');

    // Auto-load current prompt
    const currentEditor = findPositiveEditor();
    if (currentEditor) {
        const currentText = currentEditor.textContent || '';
        if (currentText && type !== 'ideas') {
            input.value = currentText;
        }
    } else if (existingInput) {
        input.value = existingInput;
    }

    async function processPrompt() {
        const promptText = input.value.trim();
        if (!promptText) {
            showNotification("Please enter some text", 'error');
            return;
        }

        // Show loading state
        responseContainer.style.display = 'block';
        responseText.innerHTML = `<div class="glm-loading">${t('glmGenerating')}</div>`;
        processBtn.disabled = true;
        processBtn.textContent = 'Processing...';

        // Build the full prompt for GLM
        let fullPrompt = promptText;
        let systemPrompt = '';

        if (type === 'translator') {
        } else if (type === 'ideas') {
            fullPrompt = `Generate creative image prompt ideas based on this description: ${promptText}`;
            systemPrompt = `You are a creative AI assistant for NovelAI image generation. Generate creative and diverse image prompt ideas.
            RULES:
            1. Generate 3-5 distinct and creative ideas
            2. Each idea should be a complete, ready-to-use prompt
            3. Focus on the prompt itself, not explanations
            4. Keep descriptions concise
            5. Output ONLY the prompts, numbered if needed
            Example Input: "fantasy elf"
            Good Output: "1. Cyberpunk elf hacker in neon-lit alley, glowing circuitry tattoos, holographic interface reflected in eyes\n2. Ethereal forest elf standing in moonlit glade, silver hair flowing, ancient runes glowing softly on skin, mist swirling around, high fantasy atmosphere\n3. Gothic elf queen on obsidian throne, black roses and candlelight, intricate lace dress, haunting yet regal expression"
            Bad Output: "I think you could try some elf prompts like..."
            Generate creative image prompt ideas based on this description:`;
        } else if (type === 'tags') {
	            fullPrompt = `Create a detailed, descriptive prompt for AI image generation based on this concept: "${promptText}"`;
            systemPrompt = `You are an expert prompt engineer for AI image generation tools like Midjourney, Stable Diffusion, and DALL-E. Create detailed, descriptive prompts from simple concepts.
            REQUIREMENTS:
            1. Create vivid, descriptive prompts that paint a complete scene
            2. Include subject description, setting, lighting, composition, mood, and style
            3. Use rich vocabulary and sensory details
            4. Include technical specifications (e.g., photorealistic, cinematic, art style)
            5. Add creative elements that make the prompt unique and engaging
            6. Format as natural language description, not as tags
            7. Aim for prompts that are 2-4 sentences long
            8. Dont use " " in the result, or quote
            Example Input: "eagle"
            Good Output: "A majestic eagle soaring through golden hour clouds, its feathers catching warm sunlight as it circles above a misty mountain valley. Photorealistic details in the eagle's intense eyes and textured feathers, dramatic lighting from below creating a powerful silhouette against the orange sky. Wide-angle composition capturing the vastness of the landscape, cinematic mood with a sense of freedom and wild beauty."
            Bad Output: "eagle, bird, flying, sky" (too simple)
            Bad Output: "Tags: #eagle #bird #photorealistic" (tag format)
            Create a detailed, descriptive prompt for AI image generation based on this concept: "${promptText}"`;
        } else if (type === 'assistant') {
            fullPrompt = promptText;
            systemPrompt = `You are an expert AI assistant for NovelAI image generation.
            RULES:
            1. Keep responses concise and to the point
            2. Focus only on the improved prompt itself
            3. DO NOT include explanations, descriptions, or meta-commentary
            4. DO NOT use phrases like "Here's an improved version" or "I suggest"
            5. Output ONLY the final optimized prompt
            6. Maintain the core intent while improving quality
            7. Use danbooru format prompt or tags
            8. But it's not limited to only danbooru, you can make it more creative
            9. Dont use " " in the result, or quote
            10. Aim for 20 word at minimum
            Example Input: "revy, black lagoon"
            Good Output: "alcohol, arm tattoo, bare shoulders, beer, black background, breasts, brown hair, collarbone, completely nude, cup, glass, gradient background, grey background, grin, hair intakes, hair over shoulder, hand up, holding, holding cup, knees, large breasts, long hair, looking at viewer, mature female, neck tattoo, nude, ponytail, shadow, shoulder tattoo, sidelocks, sitting, smile, solo, tattoo, white background, yellow eyes"
            Bad Output: "I suggest using masterpiece and best quality. The improved version would be..."
            Now improve the user's prompt:`;
        } else if (type === 'expander') {
            fullPrompt = `Take the following short prompt and expand it with details: ${promptText}`;
            systemPrompt = `You are an expert prompt writer for NovelAI. Take the user's short prompt and expand it with rich details.
        1. Expand the prompt with descriptive elements, artistic direction, and technical details
        2. Add quality tags, style elements, and composition details
        3. Keep the original intent while making it more comprehensive
        4. Output ONLY the expanded prompt, no explanations
        5. Maintain NovelAI format (comma separated tags)
        6. DO NOT include "Tags:" prefix or any hashtag format
        7. DO NOT use hashtags (#tag format), use plain text instead
        8. Focus on descriptive elements, not just tags
        9. Include details about lighting, composition, atmosphere, mood
        10. Make it sound natural and poetic, not like a list of tags
        Example Input: "anime girl"
        Good Output: "anime style, beautiful face, detailed eyes, flowing hair, cinematic lighting, vibrant colors, serene atmosphere"
        Bad Output: "Tags: #anime, #girl, #masterpiece, #bestquality"
        Take the following short prompt and expand it with details:`;
        }

        const response = await callGLMAPI(fullPrompt, systemPrompt);
        if (response) {
            // Simpan hasil terakhir
            lastGLMResults[type] = {
                input: promptText,
                output: response,
                timestamp: Date.now()
            };
	        saveLastGLMResults();
            generateAgainBtn.style.display = 'flex';
            responseText.textContent = response;
        } else {
            responseText.textContent = 'Failed to get response from AI.';
        }
        processBtn.disabled = false;
        processBtn.textContent = buttonText;
    }

    processBtn.addEventListener('click', processPrompt);
    clearBtn.addEventListener('click', () => {
        input.value = '';
        responseContainer.style.display = 'none';
    });

    applyBtn.addEventListener('click', () => {
        const response = responseText.textContent;
        if (response) {
            applyTextToEditor(response, null);
            modal.remove();
        }
    });

    copyBtn.addEventListener('click', async () => {
        const response = responseText.textContent;
        if (response) {
            try {
                await navigator.clipboard.writeText(response);
                showNotification("Copied to clipboard", 'success');
            } catch (err) {
                showNotification("Failed to copy to clipboard", 'error');
            }
        }
    });

    clearResponseBtn.addEventListener('click', () => {
        responseContainer.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Event handlers untuk tombol baru
    if (useLastBtn) {
        useLastBtn.onclick = () => {
            if (lastGLMResults[type]) {
                input.value = lastGLMResults[type].input;
                responseText.textContent = lastGLMResults[type].output;
                responseContainer.style.display = 'block';
                generateAgainBtn.style.display = 'flex';
            }
        };
    }

    if (generateAgainBtn) {
        generateAgainBtn.onclick = () => {
            processPrompt();
        };
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Allow Enter to submit
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            processPrompt();
        }
    });
}

    function saveKeyboardShortcuts() {
        localStorage.setItem(KEYBOARD_SHORTCUTS_KEY, JSON.stringify(keyboardShortcuts));
    }

    function saveWatermarkSettings() {
        localStorage.setItem(WATERMARK_SETTINGS_KEY, JSON.stringify(watermarkSettings));
        localStorage.setItem(WATERMARK_ENABLED_KEY, JSON.stringify(watermarkEnabled));
        localStorage.setItem(WATERMARK_TYPE_KEY, watermarkType);
        localStorage.setItem(WATERMARK_IMAGE_KEY, watermarkImage);
        localStorage.setItem(WATERMARK_IMAGE_SIZE_KEY, watermarkImageSize.toString());

        // Update buttons visibility after saving settings
        updateWatermarkButtons();
    }

    function checkShortcutConflict(shortcut) {
        if (!shortcut || !shortcut.key) return false;

        const parts = [];
        if (shortcut.ctrl) parts.push('ctrl');
        if (shortcut.alt) parts.push('alt');
        if (shortcut.shift) parts.push('shift');
        parts.push(shortcut.key.toLowerCase());

        const shortcutStr = parts.join('+');
        return BROWSER_SHORTCUTS[shortcutStr] || false;
    }

    function formatShortcut(shortcut) {
        if (!shortcut) return '';

        const parts = [];
        if (shortcut.ctrl) parts.push(t('ctrlKey'));
        if (shortcut.alt) parts.push(t('altKey'));
        if (shortcut.shift) parts.push(t('shiftKey'));

        let key = shortcut.key;
        if (key === ' ') key = t('spaceKey');
        else if (key === 'Enter') key = t('enterKey');
        else if (key === 'Escape') key = t('escapeKey');
        else if (key === 'Tab') key = t('tabKey');
        else if (key === 'Backspace') key = t('backspaceKey');
        else if (key === 'Delete') key = t('deleteKey');

        parts.push(key);
        return parts.join(' + ');
    }

    function saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
        localStorage.setItem(BLACKLIST_KEY, blacklistTags.join(', '));
        localStorage.setItem(BLACKLISTED_CATEGORIES_KEY, blacklistedCategories.join(', '));
        localStorage.setItem(GLOBAL_VARIABLES_KEY, JSON.stringify(globalVariables));
        localStorage.setItem(WILDCARDS_KEY, JSON.stringify(wildcards));
        localStorage.setItem(WILDCARD_REMAINING_KEY, JSON.stringify(wildcardRemaining));
        localStorage.setItem(CHARACTER_DB_KEY, JSON.stringify(characterDatabase));
        saveKeyboardShortcuts();
    }

    function saveImageSettings() {
        localStorage.setItem(IMAGE_SETTINGS_KEY, JSON.stringify(imageSettings));
    }

    	function saveLastGLMResults() {
    localStorage.setItem(LAST_GLM_RESULTS_KEY, JSON.stringify(lastGLMResults));
}

function loadLastGLMResults() {
    try {
        const saved = localStorage.getItem(LAST_GLM_RESULTS_KEY);
        if (saved) {
            lastGLMResults = JSON.parse(saved);
        }
    } catch (e) {
        console.error("Failed to load last GLM results:", e);
        lastGLMResults = {};
    }
}

    function setLastProfile(name) {
        lastProfileName = name;
        localStorage.setItem(LAST_PROFILE_KEY, name);
    }

    function getThemeColors() {
        return {
            background: '#1e293b',
            color: '#e2e8f0',
            borderColor: '#334155',
            inputBackground: '#334155',
            inputColor: '#e2e8f0',
            buttonBackground: '#3b82f6',
            buttonHover: '#2563eb',
            deleteBackground: '#ef4444',
            deleteHover: '#dc2626',
            charListBackground: '#1e293b',
            charListColor: '#e2e8f0',
            charListBorder: '#334155',
            charItemBackground: '#334155',
            charItemColor: '#e2e8f0',
            charItemHover: '#475569',
            successBg: '#065f46',
            successBorder: '#047857',
            errorBg: '#7f1d1d',
            errorBorder: '#b91c1c',
            infoBg: '#1e3a8a',
            infoBorder: '#2563eb'
        };
    }

    function updateSelectOptions(select, selectedName = null, filteredProfiles = null) {
        select.innerHTML = "";
        const profilesToUse = filteredProfiles || profiles;
        if (profilesToUse.length === 0) {
            const opt = document.createElement("option");
            opt.value = ""; opt.textContent = t('noProfiles'); opt.disabled = true; select.appendChild(opt);
            return;
        }
        profilesToUse.forEach((p) => {
            const opt = document.createElement("option");
            opt.value = p.name;
            const originalIndex = profiles.findIndex(profile => profile.name === p.name);
            opt.textContent = `${originalIndex + 1}. ${p.name}`;
            select.appendChild(opt);
        });
        if (selectedName && profilesToUse.some(p => p.name === selectedName)) {
            select.value = selectedName;
        } else if (profilesToUse.length > 0) {
            select.selectedIndex = 0;
        }
    }

    function findPositiveEditor() {
        return document.querySelector('.image-gen-prompt-main .ProseMirror') ||
               document.querySelector('.prompt-input-box-prompt .ProseMirror');
    }

    function findNegativeEditor() {
        return document.querySelector('.prompt-input-box-undesired-content .ProseMirror');
    }

    function findPMView(node, maxDepth = 6) {
        let el = node;
        let depth = 0;
        while (el && depth < maxDepth) {
            try {
                const maybeKeys = Object.keys(el);
                for (const k of maybeKeys) {
                    try {
                        const v = el[k];
                        if (v && typeof v === 'object' && v.state && typeof v.dispatch === 'function') {
                            return v;
                        }
                    } catch (e) {}
                }
                if (el.pmView) return el.pmView;
                if (el.__pmView) return el.__pmView;
                if (el._pmView) return el._pmView;
                if (el.__view) return el.__view;
                if (el._view) return el._view;
            } catch (e) {}
            el = el.parentNode;
            depth++;
        }
        return null;
    }

    function extractVariables(text) {
        const variables = [];
        const regex = /{([^{}]+)}/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const key = match[1];
            if (key !== "DB" && !variables.includes(key)) {
                variables.push(key);
            }
        }
        return variables;
    }

    function extractWildcards(text) {
        const wildcards = [];
        const regex = /\[([^\[\]]+)\]/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const key = match[1];
            if (!wildcards.includes(key)) {
                wildcards.push(key);
            }
        }
        return wildcards;
    }

    function replaceGlobalVariables(text) {
        if (!text) return text;
        let result = text;
        const regex = /{([^{}]+)}/g;
        let match;
        while ((match = regex.exec(result)) !== null) {
            const key = match[1];
            if (key === "DB") continue;
            if (globalVariables[key] !== undefined) {
                const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const pattern = new RegExp(`{${escapedKey}}`, 'g');
                result = result.replace(pattern, globalVariables[key]);
            }
        }
        return result;
    }

    function resolveWildcard(content) {
        const regex = /\[([^\[\]]+)\]/g;
        let match;
        let result = content;
        while ((match = regex.exec(content)) !== null) {
            const key = match[1];
            const options = wildcards[key] || [];
            if (options.length === 0) continue;
            let remaining = wildcardRemaining[key] || [...options];
            if (remaining.length === 0) remaining = [...options];
            const chosen = remaining.shift();
            wildcardRemaining[key] = remaining;
            const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`\\[${escapedKey}\\]`, 'g');
            result = result.replace(pattern, chosen);
        }
        return result;
    }

    function showNotification(message, type = 'info') {
        if (!enableNotifications) return;
        const colors = getThemeColors();
        let bgColor, borderColor;
        switch(type) {
            case 'success': bgColor = colors.successBg; borderColor = colors.successBorder; break;
            case 'error': bgColor = colors.errorBg; borderColor = colors.errorBorder; break;
            default: bgColor = colors.infoBg; borderColor = colors.infoBorder; break;
        }
        const notification = document.createElement('div');
        Object.assign(notification.style, {
            position: 'fixed', top: "20px", right: "20px",
            padding: '12px 16px', backgroundColor: bgColor, color: colors.color,
            border: `1px solid ${borderColor}`, borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: '30000',
            maxWidth: isMobile ? '80%' : '300px', fontSize: '14px', fontFamily: 'sans-serif',
            boxSizing: 'border-box', transform: 'translateX(120%)',
            transition: 'transform 0.3s ease-out'
        });
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.style.transform = 'translateX(0)', 10);
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => { if (notification.parentNode) document.body.removeChild(notification); }, 300);
        }, 3000);
    }

    // Function to fetch Danbooru data by ID
    async function fetchDanbooruById(id) {
        try {
            showNotification(t('danbooruFetching', id), 'info');
            const response = await fetch(`https://danbooru.donmai.us/posts/${id}.json`);
            const data = await response.json();

            if (!data) {
                showNotification(t('danbooruError', "No data"), 'error');
                return null;
            }

            let allTags = [];
            const isCopyrightBlacklisted = blacklistedCategories.includes('DBCOPYRIGHT');
            const isCharacterBlacklisted = blacklistedCategories.includes('DBCHARACTER');

            if (!isCharacterBlacklisted && data.tag_string_character) {
                const characterTags = data.tag_string_character.split(' ').map(tag => tag.replace(/_/g, ' '));
                allTags.push(...characterTags);
            }

            if (!isCopyrightBlacklisted && data.tag_string_copyright) {
                const copyrightTags = data.tag_string_copyright.split(' ').map(tag => tag.replace(/_/g, ' '));
                allTags.push(...copyrightTags);
            }

            if (data.tag_string_general) {
                const generalTags = data.tag_string_general.split(' ').map(tag => tag.replace(/_/g, ' '));
                let filteredGeneralTags = generalTags;
                if (blacklistTags.length > 0) {
                    filteredGeneralTags = generalTags.filter(t => !blacklistTags.includes(t.toLowerCase()));
                }
                allTags.push(...filteredGeneralTags);
            }

            return allTags.join(', ');
        } catch (err) {
            console.error(err);
            showNotification(t('danbooruError', err.message || "Network error"), 'error');
            return null;
        }
    }

    // Function to fetch E621 data by ID
    async function fetchE621ById(id) {
        try {
            showNotification(t('e621Fetching', id), 'info');
            const response = await fetch(`https://e621.net/posts/${id}.json`);
            const data = await response.json();

            if (!data || !data.post) {
                showNotification(t('e621Error', "No data"), 'error');
                return null;
            }

            const post = data.post;
            const tags = post.tags || {};

            let allTags = [];
            const isCopyrightBlacklisted = blacklistedCategories.includes('E621COPYRIGHT');
            const isCharacterBlacklisted = blacklistedCategories.includes('E621CHARACTER');
            const isSpeciesBlacklisted = blacklistedCategories.includes('E621SPECIES');

            if (!isCharacterBlacklisted && tags.character) {
                const characterTags = tags.character.map(tag => tag.replace(/_/g, ' '));
                allTags.push(...characterTags);
            }

            if (!isCopyrightBlacklisted && tags.copyright) {
                const copyrightTags = tags.copyright.map(tag => tag.replace(/_/g, ' '));
                allTags.push(...copyrightTags);
            }

            if (!isSpeciesBlacklisted && tags.species) {
                const speciesTags = tags.species.map(tag => tag.replace(/_/g, ' '));
                allTags.push(...speciesTags);
            }

            if (tags.general) {
                const generalTags = tags.general.map(tag => tag.replace(/_/g, ' '));
                let filteredGeneralTags = generalTags;
                if (blacklistTags.length > 0) {
                    filteredGeneralTags = generalTags.filter(t => !blacklistTags.includes(t.toLowerCase()));
                }
                allTags.push(...filteredGeneralTags);
            }

            return allTags.join(', ');
        } catch (err) {
            console.error(err);
            showNotification(t('e621Error', err.message || "Network error"), 'error');
            return null;
        }
    }

    function showVariableWildcardDialog(text, callback, isCharacter = false) {
        const variables = extractVariables(text);
        const extractedWildcards = extractWildcards(text);
        const wildcardsList = extractedWildcards.filter(key => {
            const options = wildcards[key];
            return Array.isArray(options) && options.length > 0;
        });

        // Check for {db} and {e6} variables
        const hasDbVariable = text.includes('{db}');
        const hasE6Variable = text.includes('{e6}');

        // Exclude {db} and {e6} from general undefined variables
        let undefVars = variables.filter(v => globalVariables[v] === undefined && v !== "db" && v !== "e6");

        if (!freeVariablesEnabled && undefVars.length > 0) {
            undefVars = [];
        }

        if (undefVars.length === 0 && wildcardsList.length === 0 && !hasDbVariable && !hasE6Variable) {
            const processedText = replaceGlobalVariables(text);
            callback(processedText);
            return;
        }

        if (undefVars.length === 0 && wildcardsList.length > 0 && !hasDbVariable && !hasE6Variable) {
            showWildcardOnlyDialog(text, callback, isCharacter);
            return;
        }

        const colors = getThemeColors();
        const modal = document.createElement('div');
        modal.id = 'nai-variable-wildcard-modal';
        Object.assign(modal.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : '500px', maxWidth: '90vw',
            background: colors.background, color: colors.color,
            border: `1px solid ${colors.borderColor}`, borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: '20000',
            padding: '20px', fontFamily: 'sans-serif', boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', maxHeight: isMobile ? '85vh' : '80vh'
        });

        const contentArea = document.createElement('div');
        contentArea.style.flex = '1';
        contentArea.style.overflowY = 'auto';
        contentArea.style.marginBottom = '16px';

        let modalHTML = '';
        if (undefVars.length > 0) {
            modalHTML += `
                <div style="font-weight:bold; font-size:16px; margin-bottom:16px;">${t('fillVariablesTitle')}</div>
                <div style="font-size:13px; margin-bottom:16px; opacity:0.9;">${t('fillVariablesDesc')}</div>
                <div style="margin-bottom:20px;">
            `;
            undefVars.forEach(variable => {
                const currentValue = globalVariables[variable] || '';
                modalHTML += `
                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">{${variable}}:</label>
                        <input type="text" id="var-${variable}"
                               value="${currentValue}"
                               placeholder="Enter value for ${variable}"
                               style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor};
                                      background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;" />
                    </div>
                `;
            });
            modalHTML += '</div>';
        }

        // Add Danbooru ID input if {db} variable is present
        if (hasDbVariable) {
            modalHTML += `
                <div style="margin-bottom:20px;">
                    <div style="font-weight:bold; font-size:16px; margin-bottom:16px;">${t('dbLabel')}</div>
                    <div style="font-size:13px; margin-bottom:16px; opacity:0.9;">${t('dbDesc')}</div>
                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">Danbooru ID:</label>
                        <input type="text" id="db-id"
                               value="${lastId}"
                               placeholder="${t('dbPlaceholder')}"
                               style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor};
                                      background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;" />
                    </div>
                </div>
            `;
        }

        // Add E621 ID input if {e6} variable is present
        if (hasE6Variable) {
            modalHTML += `
                <div style="margin-bottom:20px;">
                    <div style="font-weight:bold; font-size:16px; margin-bottom:16px;">${t('e621Label')}</div>
                    <div style="font-size:13px; margin-bottom:16px; opacity:0.9;">${t('e621Desc')}</div>
                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">E621 ID:</label>
                        <input type="text" id="e6-id"
                               value="${lastE621Id}"
                               placeholder="${t('e621Placeholder')}"
                               style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor};
                                      background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;" />
                    </div>
                </div>
            `;
        }

        if (wildcardsList.length > 0) {
            modalHTML += `
                <div style="font-weight:bold; font-size:16px; margin-bottom:16px;">${t('fillWildcardsTitle')}</div>
                <div style="font-size:13px; margin-bottom:16px; opacity:0.9;">${t('fillWildcardsDesc')}</div>
                <div style="margin-bottom:20px;">
            `;
            wildcardsList.forEach(wildcard => {
                const options = wildcards[wildcard] || [];
                let optionsHtml = '<option value="__random__">🎲 Random</option>';
                options.forEach(opt => {
                    optionsHtml += `<option value="${opt}">${opt}</option>`;
                });
                modalHTML += `
                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">[${wildcard}]:</label>
                        <select id="wildcard-${wildcard}"
                                style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor};
                                       background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;">
                            ${optionsHtml}
                        </select>
                    </div>
                `;
            });
            modalHTML += '</div>';
        }
        contentArea.innerHTML = modalHTML;

        const buttonArea = document.createElement('div');
        buttonArea.style.display = 'flex';
        buttonArea.style.gap = '8px';
        buttonArea.style.justifyContent = 'flex-end';
        buttonArea.style.paddingTop = '16px';
        buttonArea.style.borderTop = `1px solid ${colors.borderColor}`;

        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-vars';
        cancelBtn.textContent = t('cancel');
        Object.assign(cancelBtn.style, {
            padding: '6px 12px', background: colors.deleteBackground, color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer'
        });

        const applyBtn = document.createElement('button');
        applyBtn.id = 'apply-vars';
        applyBtn.textContent = t('apply');
        Object.assign(applyBtn.style, {
            padding: '6px 12px', background: colors.buttonBackground, color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer', zIndex: '20001'
        });

        buttonArea.appendChild(cancelBtn);
        buttonArea.appendChild(applyBtn);
        modal.appendChild(contentArea);
        modal.appendChild(buttonArea);

        document.body.appendChild(modal);

        const cancelBtnClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.body.removeChild(modal);
        };

        const applyBtnClick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            let resultText = text;

            // Process regular variables
            undefVars.forEach(variable => {
                const input = modal.querySelector(`#var-${variable}`);
                const value = input.value.trim();
                if (value) {
                    const escapedKey = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const pattern = new RegExp(`{${escapedKey}}`, 'g');
                    resultText = resultText.replace(pattern, value);
                }
            });

            // Process {db} variable if present
            if (hasDbVariable) {
                const dbInput = modal.querySelector('#db-id');
                const dbId = dbInput.value.trim();

                if (dbId && /^\d+$/.test(dbId)) {
                    lastId = dbId;
                    localStorage.setItem(LAST_ID_KEY, dbId);

                    // Fetch Danbooru data
                    const danbooruTags = await fetchDanbooruById(dbId);
                    if (danbooruTags) {
                        resultText = resultText.replace(/{db}/g, danbooruTags);
                    }
                } else if (dbId) {
                    showNotification(t('danbooruInvalidId'), 'error');
                    return;
                }
            }

            // Process {e6} variable if present
            if (hasE6Variable) {
                const e6Input = modal.querySelector('#e6-id');
                const e6Id = e6Input.value.trim();

                if (e6Id && /^\d+$/.test(e6Id)) {
                    lastE621Id = e6Id;
                    localStorage.setItem(LAST_E621_ID_KEY, e6Id);

                    // Fetch E621 data
                    const e621Tags = await fetchE621ById(e6Id);
                    if (e621Tags) {
                        resultText = resultText.replace(/{e6}/g, e621Tags);
                    }
                } else if (e6Id) {
                    showNotification(t('e621InvalidId'), 'error');
                    return;
                }
            }

            // Process wildcards
            wildcardsList.forEach(wildcard => {
                const select = modal.querySelector(`#wildcard-${wildcard}`);
                const value = select.value;
                if (value === "__random__") {
                    const options = wildcards[wildcard] || [];
                    if (options.length > 0) {
                        let remaining = wildcardRemaining[wildcard] || [...options];
                        if (remaining.length === 0) remaining = [...options];
                        const chosen = remaining.shift();
                        wildcardRemaining[wildcard] = remaining;
                        const escapedKey = wildcard.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const pattern = new RegExp(`\\[${escapedKey}\\]`, 'g');
                        resultText = resultText.replace(pattern, chosen);
                    }
                } else if (value) {
                    const escapedKey = wildcard.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const pattern = new RegExp(`\\[${escapedKey}\\]`, 'g');
                    resultText = resultText.replace(pattern, value);
                }
            });

            resultText = replaceGlobalVariables(resultText);
            localStorage.setItem(WILDCARD_REMAINING_KEY, JSON.stringify(wildcardRemaining));
            document.body.removeChild(modal);
            callback(resultText);
        };

        cancelBtn.onclick = cancelBtnClick;
        cancelBtn.addEventListener('touchend', cancelBtnClick, { passive: false });
        applyBtn.onclick = applyBtnClick;
        applyBtn.addEventListener('touchend', applyBtnClick, { passive: false });

        modal.addEventListener('click', e => {
            if (e.target === modal) {
                e.preventDefault();
                e.stopPropagation();
                document.body.removeChild(modal);
            }
        });
    }

    function showWildcardOnlyDialog(text, callback, isCharacter = false) {
        const extractedWildcards = extractWildcards(text);
        const wildcardsList = extractedWildcards.filter(key => {
            const options = wildcards[key];
            return Array.isArray(options) && options.length > 0;
        });

        const colors = getThemeColors();
        const modal = document.createElement('div');
        modal.id = 'nai-wildcard-only-modal';
        Object.assign(modal.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : '500px', maxWidth: '90vw',
            background: colors.background, color: colors.color,
            border: `1px solid ${colors.borderColor}`, borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: '20000',
            padding: '20px', fontFamily: 'sans-serif', boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', maxHeight: isMobile ? '85vh' : '80vh'
        });

        const contentArea = document.createElement('div');
        contentArea.style.flex = '1';
        contentArea.style.overflowY = 'auto';
        contentArea.style.marginBottom = '16px';

        let modalHTML = `
            <div style="font-weight:bold; font-size:16px; margin-bottom:16px;">${t('fillWildcardsTitle')}</div>
            <div style="font-size:13px; margin-bottom:16px; opacity:0.9;">${t('fillWildcardsDesc')}</div>
            <div style="margin-bottom:20px;">
        `;
        wildcardsList.forEach(wildcard => {
            const options = wildcards[wildcard] || [];
            let optionsHtml = '<option value="__random__">🎲 Random</option>';
            options.forEach(opt => {
                optionsHtml += `<option value="${opt}">${opt}</option>`;
            });
            modalHTML += `
                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">[${wildcard}]:</label>
                    <select id="wildcard-${wildcard}"
                            style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor};
                                   background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;">
                        ${optionsHtml}
                    </select>
                </div>
            `;
        });
        modalHTML += '</div>';
        contentArea.innerHTML = modalHTML;

        const buttonArea = document.createElement('div');
        buttonArea.style.display = 'flex';
        buttonArea.style.gap = '8px';
        buttonArea.style.justifyContent = 'flex-end';
        buttonArea.style.paddingTop = '16px';
        buttonArea.style.borderTop = `1px solid ${colors.borderColor}`;

        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-wildcard';
        cancelBtn.textContent = t('cancel');
        Object.assign(cancelBtn.style, {
            padding: '6px 12px', background: colors.deleteBackground, color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer'
        });

        const applyBtn = document.createElement('button');
        applyBtn.id = 'apply-wildcard';
        applyBtn.textContent = t('apply');
        Object.assign(applyBtn.style, {
            padding: '6px 12px', background: colors.buttonBackground, color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer', zIndex: '20001'
        });

        buttonArea.appendChild(cancelBtn);
        buttonArea.appendChild(applyBtn);
        modal.appendChild(contentArea);
        modal.appendChild(buttonArea);

        document.body.appendChild(modal);

        const cancelBtnClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.body.removeChild(modal);
        };

        const applyBtnClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            let resultText = text;
            wildcardsList.forEach(wildcard => {
                const select = modal.querySelector(`#wildcard-${wildcard}`);
                const value = select.value;
                if (value === "__random__") {
                    const options = wildcards[wildcard] || [];
                    if (options.length > 0) {
                        let remaining = wildcardRemaining[wildcard] || [...options];
                        if (remaining.length === 0) remaining = [...options];
                        const chosen = remaining.shift();
                        wildcardRemaining[wildcard] = remaining;
                        const escapedKey = wildcard.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const pattern = new RegExp(`\\[${escapedKey}\\]`, 'g');
                        resultText = resultText.replace(pattern, chosen);
                    }
                } else if (value) {
                    const escapedKey = wildcard.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const pattern = new RegExp(`\\[${escapedKey}\\]`, 'g');
                    resultText = resultText.replace(pattern, value);
                }
            });
            resultText = replaceGlobalVariables(resultText);
            localStorage.setItem(WILDCARD_REMAINING_KEY, JSON.stringify(wildcardRemaining));
            document.body.removeChild(modal);
            callback(resultText);
        };

        cancelBtn.onclick = cancelBtnClick;
        cancelBtn.addEventListener('touchend', cancelBtnClick, { passive: false });
        applyBtn.onclick = applyBtnClick;
        applyBtn.addEventListener('touchend', applyBtnClick, { passive: false });

        modal.addEventListener('click', e => {
            if (e.target === modal) {
                e.preventDefault();
                e.stopPropagation();
                document.body.removeChild(modal);
            }
        });
    }

    async function applyTextToEditor(text, statusEl) {
        if (!text?.trim()) {
            showNotification(t('nothingToPaste'), 'error');
            return false;
        }

        showVariableWildcardDialog(text, async (processedText) => {
            const editor = findPositiveEditor();
            if (!editor) {
                showNotification(t('cantFindEditor'), 'error');
                return false;
            }
            const view = findPMView(editor);
            if (view) {
                try {
                    const tr = view.state.tr;
                    tr.delete(0, view.state.doc.content.size);
                    tr.insertText(processedText);
                    view.dispatch(tr);
                    showNotification(t('doneProseMirror'), 'success');
                    return true;
                } catch (e) {
                    await new Promise(r => setTimeout(r, 100));
                    try {
                        const tr = view.state.tr;
                        tr.delete(0, view.state.doc.content.size);
                        tr.insertText(processedText);
                        view.dispatch(tr);
                        showNotification(t('doneProseMirror'), 'success');
                        return true;
                    } catch (e2) {
                        console.error("Retry failed:", e2);
                        showNotification(t('fallbackMethod'), 'error');
                    }
                }
            }
            try {
                editor.focus();
                const range = document.createRange();
                range.selectNodeContents(editor);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                const okIns = document.execCommand('insertText', false, processedText);
                editor.dispatchEvent(new InputEvent('input', { bubbles: true }));
                editor.dispatchEvent(new Event('change', { bubbles: true }));
                if (okIns) {
                    showNotification(t('pasted'), 'success');
                    return true;
                }
            } catch (e) {
                console.error("execCommand error:", e);
                showNotification(t('clipboardCopy'), 'info');
            }
            try {
                await navigator.clipboard.writeText(processedText);
                showNotification(t('clipboardCopy'), 'info');
                return false;
            } catch (e) {
                console.error("Clipboard error:", e);
                showNotification(t('clipboardFail'), 'error');
                return false;
            }
        });
        return true;
    }

    async function applyTextToNegativeEditor(text, statusEl) {
        if (!text?.trim()) {
            showNotification(t('nothingToAppendNeg'), 'error');
            return false;
        }

        showVariableWildcardDialog(text, async (processedText) => {
            const editor = findNegativeEditor();
            if (!editor) {
                showNotification(t('cantFindEditor'), 'error');
                return false;
            }
            const view = findPMView(editor);
            if (view) {
                try {
                    const tr = view.state.tr;
                    tr.delete(0, view.state.doc.content.size);
                    tr.insertText(processedText);
                    view.dispatch(tr);
                    showNotification(t('doneProseMirror'), 'success');
                    return true;
                } catch (e) {
                    await new Promise(r => setTimeout(r, 100));
                    try {
                        const tr = view.state.tr;
                        tr.delete(0, view.state.doc.content.size);
                        tr.insertText(processedText);
                        view.dispatch(tr);
                        showNotification(t('doneProseMirror'), 'success');
                        return true;
                    } catch (e2) {
                        console.error("Retry failed:", e2);
                        showNotification(t('negFallback'), 'error');
                    }
                }
            }
            try {
                editor.focus();
                const range = document.createRange();
                range.selectNodeContents(editor);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                const okIns = document.execCommand('insertText', false, processedText);
                editor.dispatchEvent(new InputEvent('input', { bubbles: true }));
                editor.dispatchEvent(new Event('change', { bubbles: true }));
                if (okIns) {
                    showNotification(t('pasted'), 'success');
                    return true;
                }
            } catch (e) {
                console.error("Negative execCommand error:", e);
                showNotification(t('negClipboard'), 'info');
            }
            try {
                await navigator.clipboard.writeText(processedText);
                showNotification(t('negClipboard'), 'info');
                return false;
            } catch (e) {
                console.error("Negative clipboard error:", e);
                showNotification(t('negClipboardFail'), 'error');
                return false;
            }
        });
        return true;
    }

    async function applyTextToEditorAppend(text, statusEl) {
        if (!text?.trim()) {
            showNotification(t('nothingToAppend'), 'error');
            return false;
        }

        showVariableWildcardDialog(text, async (processedText) => {
            const editor = findPositiveEditor();
            if (!editor) {
                showNotification(t('cantFindEditor'), 'error');
                return false;
            }
            let currentText = "";
            const view = findPMView(editor);
            if (view) {
                currentText = view.state.doc.textContent;
            } else {
                currentText = editor.textContent || "";
            }
            currentText = currentText.trim();
            let finalText = processedText.trim();
            if (currentText) {
                if (!currentText.endsWith(',')) currentText += ',';
                if (!finalText.startsWith(' ')) finalText = ' ' + finalText;
                finalText = currentText + finalText;
            }
            if (view) {
                try {
                    const tr = view.state.tr;
                    tr.delete(0, view.state.doc.content.size);
                    tr.insertText(finalText);
                    view.dispatch(tr);
                    showNotification(t('appendedProseMirror'), 'success');
                    return true;
                } catch (e) {
                    await new Promise(r => setTimeout(r, 100));
                    try {
                        const tr = view.state.tr;
                        tr.delete(0, view.state.doc.content.size);
                        tr.insertText(finalText);
                        view.dispatch(tr);
                        showNotification(t('appendedProseMirror'), 'success');
                        return true;
                    } catch (e2) {
                        console.error("Retry failed:", e2);
                        showNotification(t('appendFallback'), 'error');
                    }
                }
            }
            try {
                editor.focus();
                const range = document.createRange();
                range.selectNodeContents(editor);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                const okIns = document.execCommand('insertText', false, finalText);
                editor.dispatchEvent(new InputEvent('input', { bubbles: true }));
                editor.dispatchEvent(new Event('change', { bubbles: true }));
                if (okIns) {
                    showNotification(t('appended'), 'success');
                    return true;
                }
            } catch (e) {
                console.error("execCommand append error:", e);
                showNotification(t('appendClipboard'), 'info');
            }
            try {
                await navigator.clipboard.writeText(finalText);
                showNotification(t('appendClipboard'), 'info');
                return false;
            } catch (e) {
                console.error("Clipboard error:", e);
                showNotification(t('clipboardFail'), 'error');
                return false;
            }
        });
        return true;
    }

    function insertCharacterPrompts(characters, warningContainer = null) {
        if (!characters || characters.length === 0) return;
        const containers = [
            '.character-prompt-input-1 .ProseMirror',
            '.character-prompt-input-2 .ProseMirror',
            '.character-prompt-input-3 .ProseMirror',
            '.character-prompt-input-4 .ProseMirror',
            '.character-prompt-input-5 .ProseMirror',
            '.character-prompt-input-6 .ProseMirror',
            '.character-prompt-input-7 .ProseMirror',
            '.character-prompt-input-8 .ProseMirror',
            '.character-prompt-input-9 .ProseMirror',
            '.character-prompt-input-10 .ProseMirror'
        ].map(sel => document.querySelector(sel)).filter(Boolean);
        if (containers.length === 0) return;
        if (warningContainer) {
            if (characters.length > containers.length) {
                warningContainer.textContent = t('maxCharsWarning', characters.length, containers.length);
                warningContainer.style.display = 'block';
            } else {
                warningContainer.style.display = 'none';
            }
        }

        let hasVarsOrWC = false;
        for (const char of characters) {
            if (!char.prompt) continue;

            const variables = extractVariables(char.prompt);
            const undefVars = variables.filter(v => globalVariables[v] === undefined);

            const extractedWC = extractWildcards(char.prompt);
            const availableWC = extractedWC.filter(key => {
                const options = wildcards[key];
                return Array.isArray(options) && options.length > 0;
            });

            if (undefVars.length > 0 || availableWC.length > 0) {
                hasVarsOrWC = true;
                break;
            }
        }

        if (hasVarsOrWC) {
            const colors = getThemeColors();
            const modal = document.createElement('div');
            modal.id = 'nai-char-vars-modal';
            Object.assign(modal.style, {
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : '500px', maxWidth: '90vw',
                background: colors.background, color: colors.color,
                border: `1px solid ${colors.borderColor}`, borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: '20000',
                padding: '20px', fontFamily: 'sans-serif', boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', maxHeight: isMobile ? '85vh' : '80vh'
            });

            const contentArea = document.createElement('div');
            contentArea.style.flex = '1';
            contentArea.style.overflowY = 'auto';
            contentArea.style.marginBottom = '16px';

            contentArea.innerHTML = `
                <div style="font-weight:bold; font-size:16px; margin-bottom:16px;">${t('fillCharVarsTitle')}</div>
                <div style="font-size:13px; margin-bottom:16px; opacity:0.9;">${t('fillCharVarsDesc')}</div>
                <div style="margin-bottom:20px;">
                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">Select character to configure:</label>
                        <select id="char-select"
                                style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor};
                                       background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;">
                            ${characters.map((char, idx) => `<option value="${idx}">${char.name || `Character ${idx+1}`}</option>`).join('')}
                        </select>
                    </div>
                    <div id="char-vars-container"></div>
                </div>
            `;

            const buttonArea = document.createElement('div');
            buttonArea.style.display = 'flex';
            buttonArea.style.gap = '8px';
            buttonArea.style.justifyContent = 'flex-end';
            buttonArea.style.paddingTop = '16px';
            buttonArea.style.borderTop = `1px solid ${colors.borderColor}`;

            const cancelBtn = document.createElement('button');
            cancelBtn.id = 'cancel-char-vars';
            cancelBtn.textContent = t('cancel');
            Object.assign(cancelBtn.style, {
                padding: '6px 12px', background: colors.deleteBackground, color: 'white', border: 'none',
                borderRadius: '6px', cursor: 'pointer'
            });

            const applyBtn = document.createElement('button');
            applyBtn.id = 'apply-char-vars';
            applyBtn.textContent = t('apply');
            Object.assign(applyBtn.style, {
                padding: '6px 12px', background: colors.buttonBackground, color: 'white', border: 'none',
                borderRadius: '6px', cursor: 'pointer'
            });

            buttonArea.appendChild(cancelBtn);
            buttonArea.appendChild(applyBtn);
            modal.appendChild(contentArea);
            modal.appendChild(buttonArea);

            document.body.appendChild(modal);

            const charSelect = modal.querySelector('#char-select');
            const varsContainer = modal.querySelector('#char-vars-container');

            const cancelBtnClick = () => document.body.removeChild(modal);

            const applyBtnClick = () => {
                const processedPrompts = [];
                characters.forEach((char, idx) => {
                    if (!char.prompt) {
                        processedPrompts[idx] = '';
                        return;
                    }
                    let processedPrompt = char.prompt;
                    const variables = extractVariables(char.prompt);
                    const undefVars = variables.filter(v => globalVariables[v] === undefined);
                    undefVars.forEach(variable => {
                        const input = modal.querySelector(`#char-var-${variable}`);
                        if (input) {
                            const value = input.value.trim();
                            if (value) {
                                const escapedKey = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                const pattern = new RegExp(`{${escapedKey}}`, 'g');
                                processedPrompt = processedPrompt.replace(pattern, value);
                            }
                        }
                    });
                    const wildcardsList = extractWildcards(char.prompt);
                    wildcardsList.forEach(wildcard => {
                        const select = modal.querySelector(`#char-wildcard-${wildcard}`);
                        if (select) {
                            const value = select.value;
                            if (value === "__random__") {
                                const options = wildcards[wildcard] || [];
                                if (options.length > 0) {
                                    let remaining = wildcardRemaining[wildcard] || [...options];
                                    if (remaining.length === 0) remaining = [...options];
                                    const chosen = remaining.shift();
                                    wildcardRemaining[wildcard] = remaining;
                                    const escapedKey = wildcard.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                    const pattern = new RegExp(`\\[${escapedKey}\\]`, 'g');
                                    processedPrompt = processedPrompt.replace(pattern, chosen);
                                }
                            } else if (value) {
                                const escapedKey = wildcard.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                const pattern = new RegExp(`\\[${escapedKey}\\]`, 'g');
                                processedPrompt = processedPrompt.replace(pattern, value);
                            }
                        }
                    });
                    processedPrompt = replaceGlobalVariables(processedPrompt);
                    processedPrompts[idx] = processedPrompt;
                });
                localStorage.setItem(WILDCARD_REMAINING_KEY, JSON.stringify(wildcardRemaining));
                document.body.removeChild(modal);
                applyProcessedCharacterPromptsWithValues(characters, processedPrompts, warningContainer);
            };

            cancelBtn.onclick = cancelBtnClick;
            cancelBtn.addEventListener('touchend', (e) => { e.preventDefault(); cancelBtnClick(); }, { passive: false });
            applyBtn.onclick = applyBtnClick;
            applyBtn.addEventListener('touchend', (e) => { e.preventDefault(); applyBtnClick(); }, { passive: false });

            function updateCharVars() {
                const idx = parseInt(charSelect.value);
                const char = characters[idx];
                if (!char || !char.prompt) {
                    varsContainer.innerHTML = '<p style="opacity:0.7">' + t('noPrompt') + '</p>';
                    return;
                }
                const variables = extractVariables(char.prompt);
                const wildcardsList = extractWildcards(char.prompt);
                let html = '';
                const undefVars = variables.filter(v => globalVariables[v] === undefined);
                if (undefVars.length > 0) {
                    html += '<div style="margin-bottom:16px;"><h4 style="margin:0 0 8px 0; font-size:14px;">' + t('variables') + '</h4>';
                    undefVars.forEach(variable => {
                        const currentValue = globalVariables[variable] || '';
                        html += `
                            <div style="margin-bottom:12px;">
                                <label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">{${variable}}:</label>
                                <input type="text" id="char-var-${variable}"
                                       value="${currentValue}"
                                       placeholder="Enter value for ${variable}"
                                       style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor};
                                              background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;" />
                            </div>
                        `;
                    });
                    html += '</div>';
                }
                if (wildcardsList.length > 0) {
                    html += '<div style="margin-bottom:16px;"><h4 style="margin:0 0 8px 0; font-size:14px;">' + t('wildcards') + '</h4>';
                    wildcardsList.forEach(wildcard => {
                        const options = wildcards[wildcard] || [];
                        let optionsHtml = '<option value="__random__">🎲 Random</option>';
                        options.forEach(opt => {
                            optionsHtml += `<option value="${opt}">${opt}</option>`;
                        });
                        html += `
                            <div style="margin-bottom:12px;">
                                <label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">[${wildcard}]:</label>
                                <select id="char-wildcard-${wildcard}"
                                        style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor};
                                               background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;">
                                    ${optionsHtml}
                                </select>
                            </div>
                        `;
                    });
                    html += '</div>';
                }
                varsContainer.innerHTML = html || '<p style="opacity:0.7">No variables or wildcards</p>';
            }
            updateCharVars();
            charSelect.addEventListener('change', updateCharVars);
            modal.addEventListener('click', e => { if (e.target === modal) document.body.removeChild(modal); });
        } else {
            applyProcessedCharacterPrompts(characters, warningContainer);
        }
    }

    function applyProcessedCharacterPromptsWithValues(originalChars, processedPrompts, warningContainer = null) {
        const containers = [
            '.character-prompt-input-1 .ProseMirror',
            '.character-prompt-input-2 .ProseMirror',
            '.character-prompt-input-3 .ProseMirror',
            '.character-prompt-input-4 .ProseMirror',
            '.character-prompt-input-5 .ProseMirror',
            '.character-prompt-input-6 .ProseMirror',
            '.character-prompt-input-7 .ProseMirror',
            '.character-prompt-input-8 .ProseMirror',
            '.character-prompt-input-9 .ProseMirror',
            '.character-prompt-input-10 .ProseMirror'
        ].map(sel => document.querySelector(sel)).filter(Boolean);
        setTimeout(() => {
            containers.forEach((container, index) => {
                const prompt = processedPrompts[index] || '';
                if (container) {
                    const view = findPMView(container);
                    if (view) {
                        const tr = view.state.tr;
                        tr.delete(0, view.state.doc.content.size);
                        tr.insertText(prompt);
                        view.dispatch(tr);
                    } else {
                        container.textContent = prompt;
                        container.dispatchEvent(new Event('input', { bubbles: true }));
                        container.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            });
        }, 50);
    }

    function applyProcessedCharacterPrompts(characters, warningContainer = null) {
        const containers = [
            '.character-prompt-input-1 .ProseMirror',
            '.character-prompt-input-2 .ProseMirror',
            '.character-prompt-input-3 .ProseMirror',
            '.character-prompt-input-4 .ProseMirror',
            '.character-prompt-input-5 .ProseMirror',
            '.character-prompt-input-6 .ProseMirror',
            '.character-prompt-input-7 .ProseMirror',
            '.character-prompt-input-8 .ProseMirror',
            '.character-prompt-input-9 .ProseMirror',
            '.character-prompt-input-10 .ProseMirror'
        ].map(sel => document.querySelector(sel)).filter(Boolean);
        setTimeout(() => {
            containers.forEach((container, index) => {
                const char = characters[index];
                if (char && container) {
                    const prompt = char.prompt || '';
                    const view = findPMView(container);
                    if (view) {
                        const tr = view.state.tr;
                        tr.delete(0, view.state.doc.content.size);
                        tr.insertText(prompt);
                        view.dispatch(tr);
                    } else {
                        container.textContent = prompt;
                        container.dispatchEvent(new Event('input', { bubbles: true }));
                        container.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } else if (container) {
                    const view = findPMView(container);
                    if (view) {
                        const tr = view.state.tr;
                        tr.delete(0, view.state.doc.content.size);
                        view.dispatch(tr);
                    } else {
                        container.textContent = '';
                        container.dispatchEvent(new Event('input', { bubbles: true }));
                        container.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            });
        }, 50);
    }

    function startEditingShortcut(input, warning, shortcutId) {
        input.readOnly = false;
        input.value = t('pressKey');
        input.style.backgroundColor = '#3b82f6';
        input.style.color = 'white';

        let keysPressed = {};
        let isRecording = false;

        const handleKeyDown = (e) => {
            if (!isRecording) return;

            e.preventDefault();
            e.stopPropagation();

            if (e.key === 'Escape') {
                finishRecording();
                return;
            }

            keysPressed[e.key] = true;

            const hasModifier = e.ctrlKey || e.altKey || e.shiftKey;
            const isValidKey = !['Control', 'Alt', 'Shift', 'Meta'].includes(e.key);

            if (hasModifier || isValidKey) {
                let displayText = [];
                if (e.ctrlKey) displayText.push(t('ctrlKey'));
                if (e.altKey) displayText.push(t('altKey'));
                if (e.shiftKey) displayText.push(t('shiftKey'));

                if (isValidKey) {
                    let key = e.key;
                    if (key === ' ') key = t('spaceKey');
                    else if (key.length > 1) {
                        key = key;
                    } else {
                        key = key.toUpperCase();
                    }
                    displayText.push(key);
                }
                input.value = displayText.join(' + ');
            }
        };

        const handleKeyUp = (e) => {
            if (!isRecording) return;

            delete keysPressed[e.key];
            const allModifiersReleased = !e.ctrlKey && !e.altKey && !e.shiftKey;

            if (allModifiersReleased && Object.keys(keysPressed).length === 0) {
                finishRecording();
            }
        };

        const finishRecording = () => {
            isRecording = false;

            const lastValue = input.value;
            const parts = lastValue.split(' + ').map(p => p.trim());
            let newShortcut = {
                ctrl: parts.includes(t('ctrlKey')),
                alt: parts.includes(t('altKey')),
                shift: parts.includes(t('shiftKey')),
                key: ''
            };

            for (const part of parts) {
                if (!['Ctrl', 'Alt', 'Shift', t('ctrlKey'), t('altKey'), t('shiftKey')].includes(part)) {
                    newShortcut.key = part;
                    break;
                }
            }

            if (newShortcut.key) {
                const hasConflict = checkShortcutConflict(newShortcut);
                keyboardShortcuts[shortcutId] = newShortcut;

                input.value = formatShortcut(newShortcut);
                input.readOnly = true;
                input.style.backgroundColor = '';
                input.style.color = '';

                if (hasConflict) {
                    input.classList.add('shortcut-conflict');
                    warning.style.display = 'block';
                    showNotification(t('shortcutConflict'), 'error');
                } else {
                    input.classList.remove('shortcut-conflict');
                    warning.style.display = 'none';
                }
            } else {
                input.value = formatShortcut(keyboardShortcuts[shortcutId]);
                input.readOnly = true;
                input.style.backgroundColor = '';
                input.style.color = '';
            }

            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('keyup', handleKeyUp, true);
        };

        isRecording = true;
        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('keyup', handleKeyUp, true);
    }

    function addWatermarkToCanvas(canvas, settings) {
        const ctx = canvas.getContext('2d');

        // Save current context state
        ctx.save();

        // Set global alpha for opacity
        ctx.globalAlpha = settings.opacity;

        if (watermarkType === 'text') {
            // Text watermark
            ctx.font = `${settings.fontSize}px ${settings.font}`;
            ctx.fillStyle = settings.color;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            // Add text shadow
            ctx.shadowColor = settings.textShadowColor;
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            const text = settings.text;
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const textHeight = settings.fontSize;

            let x, y;
            const margin = settings.margin;

            switch (settings.position) {
                case "top-left":
                    x = margin;
                    y = margin;
                    break;
                case "top-right":
                    x = canvas.width - textWidth - margin;
                    y = margin;
                    break;
                case "bottom-left":
                    x = margin;
                    y = canvas.height - textHeight - margin;
                    break;
                case "bottom-right":
                    x = canvas.width - textWidth - margin;
                    y = canvas.height - textHeight - margin;
                    break;
                case "center":
                    x = (canvas.width - textWidth) / 2;
                    y = (canvas.height - textHeight) / 2;
                    break;
                default:
                    x = canvas.width - textWidth - margin;
                    y = canvas.height - textHeight - margin;
            }

            // Draw background if not disabled
            if (!settings.disableBackground) {
                ctx.fillStyle = settings.backgroundColor;
                ctx.fillRect(
                    x - settings.padding,
                    y - settings.padding,
                    textWidth + (settings.padding * 2),
                    textHeight + (settings.padding * 2)
                );
            }

            // Draw text
            ctx.fillStyle = settings.color;
            ctx.fillText(text, x, y);

        } else if (watermarkType === 'image' && watermarkImage) {
            // Create an image object from the base64 data
            const img = new Image();

            // Return a Promise that resolves when the image is loaded and drawn
            return new Promise((resolve) => {
                img.onload = function() {
                    // Calculate position
                    let x, y;
                    const margin = settings.margin;
                    const imgWidth = watermarkImageSize;
                    const imgHeight = (img.height / img.width) * watermarkImageSize;

                    switch (settings.position) {
                        case "top-left":
                            x = margin;
                            y = margin;
                            break;
                        case "top-right":
                            x = canvas.width - imgWidth - margin;
                            y = margin;
                            break;
                        case "bottom-left":
                            x = margin;
                            y = canvas.height - imgHeight - margin;
                            break;
                        case "bottom-right":
                            x = canvas.width - imgWidth - margin;
                            y = canvas.height - imgHeight - margin;
                            break;
                        case "center":
                            x = (canvas.width - imgWidth) / 2;
                            y = (canvas.height - imgHeight) / 2;
                            break;
                        default:
                            x = canvas.width - imgWidth - margin;
                            y = canvas.height - imgHeight - margin;
                    }

                    // Draw the image
                    ctx.drawImage(img, x, y, imgWidth, imgHeight);

                    // Restore context state
                    ctx.restore();

                    // Resolve the promise
                    resolve(canvas);
                };

                // Set the image source (this triggers the loading)
                img.src = watermarkImage;
            });
        }

        // Restore context state for text watermark
        ctx.restore();
        return canvas;
    }

    function updateWatermarkPreview() {
        const previewContainer = document.getElementById('watermark-preview-container');
        if (!previewContainer) return;

        const previewCanvas = document.getElementById('watermark-preview-canvas');
        if (!previewCanvas) return;

        const ctx = previewCanvas.getContext('2d');

        // Set canvas size
        previewCanvas.width = 300;
        previewCanvas.height = 200;

        // Fill with a sample background
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

        // Add a sample image pattern
        ctx.fillStyle = '#3a3a3a';
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 7; j++) {
                if ((i + j) % 2 === 0) {
                    ctx.fillRect(i * 30, j * 30, 30, 30);
                }
            }
        }

        // Apply watermark to preview
        if (watermarkType === 'image' && watermarkImage) {
            const img = new Image();
            img.onload = function() {
                // Calculate position
                let x, y;
                const margin = watermarkSettings.margin;
                const imgWidth = Math.min(watermarkImageSize, 100); // Limit preview size
                const imgHeight = (img.height / img.width) * imgWidth;

                switch (watermarkSettings.position) {
                    case "top-left":
                        x = margin;
                        y = margin;
                        break;
                    case "top-right":
                        x = previewCanvas.width - imgWidth - margin;
                        y = margin;
                        break;
                    case "bottom-left":
                        x = margin;
                        y = previewCanvas.height - imgHeight - margin;
                        break;
                    case "bottom-right":
                        x = previewCanvas.width - imgWidth - margin;
                        y = previewCanvas.height - imgHeight - margin;
                        break;
                    case "center":
                        x = (previewCanvas.width - imgWidth) / 2;
                        y = (previewCanvas.height - imgHeight) / 2;
                        break;
                    default:
                        x = previewCanvas.width - imgWidth - margin;
                        y = previewCanvas.height - imgHeight - margin;
                }

                // Apply opacity
                ctx.globalAlpha = watermarkSettings.opacity;

                // Draw the image
                ctx.drawImage(img, x, y, imgWidth, imgHeight);
            };
            img.src = watermarkImage;
        } else {
            // Use text watermark
            addWatermarkToCanvas(previewCanvas, watermarkSettings);
        }
    }

    function updateWatermarkButtons() {
        if (watermarkEnabled) {
            // Show buttons for watermark functionality
            const existingButtons = document.querySelectorAll('.metadata-remover-btn');
            existingButtons.forEach(btn => {
                btn.style.display = 'block';
                btn.innerHTML = '💧 Download with Watermark';
                btn.title = 'Download image with watermark';
                btn.style.backgroundColor = 'rgb(59, 130, 246)';
            });
            // Add buttons to images that don't have them yet
            const imagesWithoutButtons = document.querySelectorAll('img.image-grid-image:not([data-scrubber-button-added])');
            imagesWithoutButtons.forEach(img => {
                addMetadataRemoverButtonToImage(img);
            });
        } else {
            // Hide all existing buttons
            const existingButtons = document.querySelectorAll('.metadata-remover-btn');
            existingButtons.forEach(btn => {
                btn.style.display = 'none';
            });
        }
    }

    function downloadImageWithWatermark(imageUrl, filename) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            const originalWidth = img.naturalWidth;
            const originalHeight = img.naturalHeight;
            // Create canvas with ORIGINAL dimensions
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = originalWidth;
            canvas.height = originalHeight;
            // Draw the full image
            ctx.drawImage(img, 0, 0);
            // Add watermark
            if (watermarkType === 'image' && watermarkImage) {
                const watermarkImg = new Image();
                watermarkImg.onload = function() {
                    // Apply watermark and download with metadata preservation
                    applyImageWatermarkAndDownload(ctx, canvas, watermarkImg, filename, imageUrl);
                };
                watermarkImg.src = watermarkImage;
                return;
            } else {
                // Text watermark
                addWatermarkToCanvas(canvas, watermarkSettings);
            }
            // Download with metadata preservation
            downloadWithMetadataPreservation(canvas, filename, imageUrl);
        };
        img.onerror = function() {
            console.error('Failed to load image for processing.');
            showNotification('❌ Failed to load image for watermarking', 'error');
        };
        img.src = imageUrl;
    }

    function applyImageWatermarkAndDownload(ctx, canvas, watermarkImg, filename, originalUrl) {
        // Calculate position
        let x, y;
        const margin = watermarkSettings.margin;
        const imgWidth = watermarkImageSize;
        const imgHeight = (watermarkImg.height / watermarkImg.width) * watermarkImageSize;
        switch (watermarkSettings.position) {
            case "top-left":
                x = margin;
                y = margin;
                break;
            case "top-right":
                x = canvas.width - imgWidth - margin;
                y = margin;
                break;
            case "bottom-left":
                x = margin;
                y = canvas.height - imgHeight - margin;
                break;
            case "bottom-right":
                x = canvas.width - imgWidth - margin;
                y = canvas.height - imgHeight - margin;
                break;
            case "center":
                x = (canvas.width - imgWidth) / 2;
                y = (canvas.height - imgHeight) / 2;
                break;
            default:
                x = canvas.width - imgWidth - margin;
                y = canvas.height - imgHeight - margin;
        }
        // Apply opacity
        ctx.globalAlpha = watermarkSettings.opacity;
        // Draw the watermark image
        ctx.drawImage(watermarkImg, x, y, imgWidth, imgHeight);
        // Download with metadata preservation
        downloadWithMetadataPreservation(canvas, filename, originalUrl);
    }

    function downloadWithMetadataPreservation(canvas, filename, originalUrl) {
        // Get canvas as PNG blob
        canvas.toBlob(function(watermarkedBlob) {
            // Fetch original image to extract metadata
            fetch(originalUrl)
                .then(response => response.blob())
                .then(originalBlob => {
                    // Read original PNG as array buffer
                    originalBlob.arrayBuffer().then(originalBuffer => {
                        // Read watermarked image as array buffer
                        watermarkedBlob.arrayBuffer().then(watermarkedBuffer => {
                            try {
                                // Merge metadata from original with watermarked image data
                                const mergedBlob = mergePNGMetadata(originalBuffer, watermarkedBuffer);
                                // Download the merged image
                                const url = URL.createObjectURL(mergedBlob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = filename || `novelai-watermarked-${Date.now()}.png`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                                showNotification('✅ Image downloaded with watermark', 'success');
                            } catch (e) {
                                console.error('Error merging metadata:', e);
                                // Fallback to download watermarked image without metadata
                                downloadWatermarkedFallback(watermarkedBlob, filename);
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('Error fetching original image:', error);
                    // Fallback to download watermarked image without metadata
                    downloadWatermarkedFallback(watermarkedBlob, filename);
                });
        }, 'image/png');
    }

    function mergePNGMetadata(originalBuffer, watermarkedBuffer) {
        // Convert to Uint8Array for manipulation
        const original = new Uint8Array(originalBuffer);
        const watermarked = new Uint8Array(watermarkedBuffer);
        // Check if both are valid PNG files
        if (original[0] !== 0x89 || original[1] !== 0x50 || original[2] !== 0x4E || original[3] !== 0x47) {
            throw new Error('Original is not a valid PNG');
        }
        if (watermarked[0] !== 0x89 || watermarked[1] !== 0x50 || watermarked[2] !== 0x4E || watermarked[3] !== 0x47) {
            throw new Error('Watermarked is not a valid PNG');
        }
        // Parse original PNG to extract metadata chunks
        const originalChunks = parsePNGChunks(original);
        const watermarkedChunks = parsePNGChunks(watermarked);
        // Find IHDR and IDAT chunks in watermarked image
        const watermarkedIHDR = watermarkedChunks.find(chunk => chunk.type === 'IHDR');
        const watermarkedIDATs = watermarkedChunks.filter(chunk => chunk.type === 'IDAT');
        // Extract metadata chunks from original (excluding IHDR and IDAT)
        const metadataChunks = originalChunks.filter(chunk =>
            chunk.type !== 'IHDR' &&
            chunk.type !== 'IDAT' &&
            chunk.type !== 'IEND'
        );
        // Build new PNG: signature + IHDR + metadata + IDATs + IEND
        const newChunks = [];
        // PNG signature
        newChunks.push(new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));
        // IHDR from watermarked
        newChunks.push(createPNGChunk(watermarkedIHDR.type, watermarkedIHDR.data));
        // Add metadata chunks from original
        metadataChunks.forEach(chunk => {
            newChunks.push(createPNGChunk(chunk.type, chunk.data));
        });
        // Add IDAT chunks from watermarked
        watermarkedIDATs.forEach(chunk => {
            newChunks.push(createPNGChunk(chunk.type, chunk.data));
        });
        // IEND chunk
        newChunks.push(createPNGChunk('IEND', new Uint8Array(0)));
        // Combine all chunks
        const totalLength = newChunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        newChunks.forEach(chunk => {
            result.set(chunk, offset);
            offset += chunk.length;
        });
        return new Blob([result], { type: 'image/png' });
    }

    function parsePNGChunks(data) {
        const chunks = [];
        let offset = 8; // Skip PNG signature
        while (offset < data.length) {
            if (offset + 8 > data.length) break;
            // Read chunk length
            const length = (data[offset] << 24) | (data[offset + 1] << 16) |
                          (data[offset + 2] << 8) | data[offset + 3];
            // Read chunk type
            const type = String.fromCharCode(
                data[offset + 4], data[offset + 5],
                data[offset + 6], data[offset + 7]
            );
            // Read chunk data
            const chunkData = data.slice(offset + 8, offset + 8 + length);
            chunks.push({
                type: type,
                data: chunkData,
                length: length
            });
            // Move to next chunk (skip CRC)
            offset += 8 + length + 4;
        }
        return chunks;
    }

    function createPNGChunk(type, data) {
        const length = data.length;
        const chunk = new Uint8Array(8 + length + 4);
        // Write length
        chunk[0] = (length >>> 24) & 0xFF;
        chunk[1] = (length >>> 16) & 0xFF;
        chunk[2] = (length >>> 8) & 0xFF;
        chunk[3] = length & 0xFF;
        // Write type
        chunk[4] = type.charCodeAt(0);
        chunk[5] = type.charCodeAt(1);
        chunk[6] = type.charCodeAt(2);
        chunk[7] = type.charCodeAt(3);
        // Write data
        chunk.set(data, 8);
        // Calculate CRC (simplified - you might need a proper CRC implementation)
        const crcData = new Uint8Array(4 + length);
        crcData.set(chunk.slice(4, 8), 0);
        crcData.set(data, 4);
        const crc = calculateCRC32(crcData);
        // Write CRC
        chunk[8 + length] = (crc >>> 24) & 0xFF;
        chunk[8 + length + 1] = (crc >>> 16) & 0xFF;
        chunk[8 + length + 2] = (crc >>> 8) & 0xFF;
        chunk[8 + length + 3] = crc & 0xFF;
        return chunk;
    }

    function calculateCRC32(data) {
        // Simple CRC32 implementation
        const crcTable = [];
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) {
                c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            }
            crcTable[i] = c;
        }
        let crc = 0 ^ (-1);
        for (let i = 0; i < data.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    }

    function downloadWatermarkedFallback(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `novelai-watermarked-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('✅ Image downloaded with watermark', 'success');
    }

    function openWatermarkSettingsModal() {
        if (document.getElementById('nai-watermark-settings-modal')) return;

        const colors = getThemeColors();
        const modal = document.createElement('div');
        modal.id = 'nai-watermark-settings-modal';
        Object.assign(modal.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : '500px', maxWidth: '90vw',
            background: colors.background, color: colors.color,
            border: `1px solid ${colors.borderColor}`, borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: '20000',
            padding: '20px', fontFamily: 'sans-serif', boxSizing: 'border-box',
            maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
        });

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '16px';

        const title = document.createElement('h3');
        title.textContent = t('watermarkSettings');
        title.style.margin = '0';
        title.style.fontSize = '16px';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            color: colors.color
        });
        closeBtn.onmouseover = () => { closeBtn.style.backgroundColor = colors.inputBackground; };
        closeBtn.onmouseout = () => { closeBtn.style.backgroundColor = 'transparent'; };
        closeBtn.onclick = () => document.body.removeChild(modal);

        header.appendChild(title);
        header.appendChild(closeBtn);

        const contentArea = document.createElement('div');
        contentArea.style.flex = '1';
        contentArea.style.overflowY = 'auto';
        contentArea.style.marginBottom = '16px';

        // Watermark type toggle
        const watermarkTypeToggle = document.createElement('div');
        watermarkTypeToggle.className = 'watermark-type-toggle';
        watermarkTypeToggle.innerHTML = `
            <div class="watermark-type-option ${watermarkType === 'text' ? 'active' : ''}" data-type="text">${t('textWatermark')}</div>
            <div class="watermark-type-option ${watermarkType === 'image' ? 'active' : ''}" data-type="image">${t('imageWatermark')}</div>
        `;

        // Text watermark settings
        const textWatermarkSettings = document.createElement('div');
        textWatermarkSettings.id = 'text-watermark-settings';
        textWatermarkSettings.style.display = watermarkType === 'text' ? 'block' : 'none';

        // Image watermark settings
        const imageWatermarkSettings = document.createElement('div');
        imageWatermarkSettings.id = 'image-watermark-settings';
        imageWatermarkSettings.style.display = watermarkType === 'image' ? 'block' : 'none';

        // Common settings
        const commonSettings = document.createElement('div');

        // Position options
        let positionOptions = '';
        const positions = [
            { value: 'top-left', label: t('topLeft') },
            { value: 'top-right', label: t('topRight') },
            { value: 'bottom-left', label: t('bottomLeft') },
            { value: 'bottom-right', label: t('bottomRight') },
            { value: 'center', label: t('center') }
        ];
        positions.forEach(pos => {
            const selected = pos.value === watermarkSettings.position ? 'selected' : '';
            positionOptions += `<option value="${pos.value}" ${selected}>${pos.label}</option>`;
        });

        // Font options
        let fontOptions = '';
        const fonts = [
            'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS', 'Impact', 'Trebuchet MS'
        ];
        fonts.forEach(font => {
            const selected = font === watermarkSettings.font ? 'selected' : '';
            fontOptions += `<option value="${font}" ${selected}>${font}</option>`;
        });

        // Build the content
        textWatermarkSettings.innerHTML = `
            <div style="margin-bottom:12px;">
                <label style="display:block; font-size:13px; margin-bottom:4px;">${t('watermarkText')}:</label>
                <input type="text" id="watermark-text" value="${watermarkSettings.text}" style="width:100%; padding:6px; border-radius:4px; border:1px solid ${colors.borderColor}; background:${colors.background}; color:${colors.color}; font-size:13px;">
            </div>

            <div style="display:flex; gap:8px; margin-bottom:12px;">
                <div style="flex:1;">
                    <label style="display:block; font-size:13px; margin-bottom:4px;">${t('watermarkFontSize')}:</label>
                    <input type="number" id="watermark-fontsize" value="${watermarkSettings.fontSize}" min="8" max="72" style="width:100%; padding:6px; border-radius:4px; border:1px solid ${colors.borderColor}; background:${colors.background}; color:${colors.color}; font-size:13px;">
                </div>
                <div style="flex:1;">
                    <label style="display:block; font-size:13px; margin-bottom:4px;">${t('watermarkFont')}:</label>
                    <select id="watermark-font" style="width:100%; padding:6px; border-radius:4px; border:1px solid ${colors.borderColor}; background:${colors.background}; color:${colors.color}; font-size:13px;">
                        ${fontOptions}
                    </select>
                </div>
            </div>

            <div style="display:flex; gap:8px; margin-bottom:12px;">
                <div style="flex:1;">
                    <label style="display:block; font-size:13px; margin-bottom:4px;">${t('watermarkColor')}:</label>
                    <input type="color" id="watermark-color" value="${watermarkSettings.color}" style="width:100%; height:32px; border-radius:4px; border:1px solid ${colors.borderColor}; background:${colors.background}; cursor:pointer;">
                </div>
                <div style="flex:1;">
                    <label style="display:block; font-size:13px; margin-bottom:4px;">${t('textShadowColor')}:</label>
                    <input type="color" id="watermark-textshadow" value="${watermarkSettings.textShadowColor}" style="width:100%; height:32px; border-radius:4px; border:1px solid ${colors.borderColor}; background:${colors.background}; cursor:pointer;">
                </div>
            </div>

            <div style="margin-bottom:12px;">
                <label style="display:block; font-size:13px; margin-bottom:4px;">${t('watermarkBackgroundColor')}:</label>
                <input type="color" id="watermark-bgcolor" value="${watermarkSettings.backgroundColor}" style="width:100%; height:32px; border-radius:4px; border:1px solid ${colors.borderColor}; background:${colors.background}; cursor:pointer;">
            </div>

            <div style="display:flex; gap:8px; margin-bottom:12px;">
                <div style="flex:1;">
                    <label style="display:block; font-size:13px; margin-bottom:4px;">${t('watermarkPadding')} (pixels):</label>
                    <input type="number" id="watermark-padding" value="${watermarkSettings.padding}" min="0" max="20" style="width:100%; padding:6px; border-radius:4px; border:1px solid ${colors.borderColor}; background:${colors.background}; color:${colors.color}; font-size:13px;">
                </div>
                <div style="flex:1;">
                    <label style="display:block; font-size:13px; margin-bottom:4px;">${t('watermarkBorderRadius')} (pixels):</label>
                    <input type="number" id="watermark-borderradius" value="${watermarkSettings.borderRadius}" min="0" max="20" style="width:100%; padding:6px; border-radius:4px; border:1px solid ${colors.borderColor}; background:${colors.background}; color:${colors.color}; font-size:13px;">
                </div>
            </div>

            <div class="watermark-checkbox-container">
                <label class="watermark-checkbox">
                    <input type="checkbox" id="disable-background" ${watermarkSettings.disableBackground ? 'checked' : ''}>
                    <span class="watermark-checkmark"></span>
                </label>
                <label for="disable-background" class="watermark-label">${t('disableBackground')}</label>
            </div>
        `;

        imageWatermarkSettings.innerHTML = `
            <div class="image-upload-container">
                <label class="image-upload-label">${t('uploadImage')}:</label>
                <div style="display:flex; gap:8px; align-items:center;">
                    <label for="watermark-image-upload" class="image-upload-button">${t('uploadImage')}</label>
                    <input type="file" id="watermark-image-upload" class="image-upload-input" accept="image/png, image/jpeg, image/svg+xml">
                    ${watermarkImage ? '<img id="uploaded-image-preview" class="uploaded-image-preview" src="' + watermarkImage + '">' : ''}
                </div>
            </div>

            <div class="watermark-size-control">
                <span class="watermark-size-label">${t('imageSize')}:</span>
                <input type="range" id="watermark-image-size-slider" class="watermark-size-slider" min="20" max="300" value="${watermarkImageSize}">
                <span class="watermark-size-value">${watermarkImageSize}px</span>
            </div>

            <div class="watermark-checkbox-container">
                <label class="watermark-checkbox">
                    <input type="checkbox" id="maintain-aspect-ratio" checked>
                    <span class="watermark-checkmark"></span>
                </label>
                <label for="maintain-aspect-ratio" class="watermark-label">${t('maintainAspectRatio')}</label>
            </div>
        `;

        commonSettings.innerHTML = `
            <div style="margin-bottom:12px;">
                <label style="display:block; font-size:13px; margin-bottom:4px;">${t('watermarkPosition')}:</label>
                <select id="watermark-position" style="width:100%; padding:6px; border-radius:4px; border:1px solid ${colors.borderColor}; background:${colors.background}; color:${colors.color}; font-size:13px;">
                    ${positionOptions}
                </select>
            </div>

            <div style="margin-bottom:12px;">
                <label style="display:block; font-size:13px; margin-bottom:4px;">${t('watermarkOpacity')}:</label>
                <input type="range" id="watermark-opacity-slider" min="0.1" max="1" step="0.1" value="${watermarkSettings.opacity}" style="width:100%;">
                <div style="display:flex; justify-content:space-between; font-size:11px; opacity:0.7;">
                    <span>0.1</span>
                    <span id="watermark-opacity-value">${watermarkSettings.opacity}</span>
                    <span>1.0</span>
                </div>
            </div>

            <div style="margin-bottom:12px;">
                <label style="display:block; font-size:13px; margin-bottom:4px;">${t('watermarkMargin')} (pixels):</label>
                <input type="number" id="watermark-margin" value="${watermarkSettings.margin}" min="0" max="100" style="width:100%; padding:6px; border-radius:4px; border:1px solid ${colors.borderColor}; background:${colors.background}; color:${colors.color}; font-size:13px;">
            </div>

            <div class="watermark-checkbox-container">
                <label class="watermark-checkbox">
                    <input type="checkbox" id="enable-watermark" ${watermarkEnabled ? 'checked' : ''}>
                    <span class="watermark-checkmark"></span>
                </label>
                <label for="enable-watermark" class="watermark-label">${t('enableWatermark')}</label>
            </div>

            <!-- Watermark Preview -->
            <div class="watermark-preview-container" id="watermark-preview-container">
                <div class="watermark-preview-title">${t('watermarkPreview')}</div>
                <canvas id="watermark-preview-canvas" class="watermark-preview-canvas" width="300" height="200"></canvas>
            </div>
        `;

        contentArea.appendChild(watermarkTypeToggle);
        contentArea.appendChild(textWatermarkSettings);
        contentArea.appendChild(imageWatermarkSettings);
        contentArea.appendChild(commonSettings);

        const buttonArea = document.createElement('div');
        buttonArea.style.display = 'flex';
        buttonArea.style.gap = '8px';
        buttonArea.style.justifyContent = 'flex-end';
        buttonArea.style.paddingTop = '16px';
        buttonArea.style.borderTop = `1px solid ${colors.borderColor}`;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = t('cancel');
        Object.assign(cancelBtn.style, {
            padding: '6px 12px', background: colors.deleteBackground, color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer'
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = t('apply');
        Object.assign(saveBtn.style, {
            padding: '6px 12px', background: colors.buttonBackground, color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer'
        });

        buttonArea.appendChild(cancelBtn);
        buttonArea.appendChild(saveBtn);

        modal.appendChild(header);
        modal.appendChild(contentArea);
        modal.appendChild(buttonArea);

        document.body.appendChild(modal);

        // Event listeners
        const watermarkTypeOptions = modal.querySelectorAll('.watermark-type-option');
        watermarkTypeOptions.forEach(option => {
            option.addEventListener('click', () => {
                watermarkTypeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                const type = option.dataset.type;
                watermarkType = type;

                if (type === 'text') {
                    textWatermarkSettings.style.display = 'block';
                    imageWatermarkSettings.style.display = 'none';
                } else {
                    textWatermarkSettings.style.display = 'none';
                    imageWatermarkSettings.style.display = 'block';
                }

                updateWatermarkPreview();
            });
        });

        // Image upload
        const imageUploadInput = modal.querySelector('#watermark-image-upload');
        imageUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    watermarkImage = event.target.result;
                    const preview = modal.querySelector('#uploaded-image-preview');
                    if (preview) {
                        preview.src = watermarkImage;
                    } else {
                        const img = document.createElement('img');
                        img.id = 'uploaded-image-preview';
                        img.className = 'uploaded-image-preview';
                        img.src = watermarkImage;
                        imageUploadInput.parentNode.appendChild(img);
                    }
                    updateWatermarkPreview();
                };
                reader.readAsDataURL(file);
            }
        });

        // Image size slider
        const imageSizeSlider = modal.querySelector('#watermark-image-size-slider');
        const imageSizeValue = modal.querySelector('.watermark-size-value');
        imageSizeSlider.addEventListener('input', () => {
            watermarkImageSize = parseInt(imageSizeSlider.value);
            imageSizeValue.textContent = `${watermarkImageSize}px`;
            updateWatermarkPreview();
        });

        // Opacity slider
        const opacitySlider = modal.querySelector('#watermark-opacity-slider');
        const opacityValue = modal.querySelector('#watermark-opacity-value');
        opacitySlider.addEventListener('input', () => {
            watermarkSettings.opacity = parseFloat(opacitySlider.value);
            opacityValue.textContent = watermarkSettings.opacity;
            updateWatermarkPreview();
        });

        // Initialize watermark preview
        updateWatermarkPreview();

        // Add event listeners for real-time preview
        const textInputs = [
            'watermark-text', 'watermark-fontsize', 'watermark-color', 'watermark-position',
            'watermark-font', 'watermark-bgcolor', 'watermark-padding', 'watermark-borderradius',
            'watermark-margin', 'disable-background', 'watermark-textshadow'
        ];

        textInputs.forEach(id => {
            const element = modal.querySelector(`#${id}`);
            if (element) {
                element.addEventListener('input', () => {
                    updateWatermarkSettingsFromModal();
                    updateWatermarkPreview();
                });
            }
        });

        const enableWatermarkCheckbox = modal.querySelector('#enable-watermark');
        enableWatermarkCheckbox.addEventListener('change', () => {
            watermarkEnabled = enableWatermarkCheckbox.checked;
            updateWatermarkPreview();
        });

        function updateWatermarkSettingsFromModal() {
            watermarkSettings.text = modal.querySelector('#watermark-text').value;
            watermarkSettings.fontSize = parseInt(modal.querySelector('#watermark-fontsize').value);
            watermarkSettings.color = modal.querySelector('#watermark-color').value;
            watermarkSettings.position = modal.querySelector('#watermark-position').value;
            watermarkSettings.font = modal.querySelector('#watermark-font').value;
            watermarkSettings.backgroundColor = modal.querySelector('#watermark-bgcolor').value;
            watermarkSettings.padding = parseInt(modal.querySelector('#watermark-padding').value);
            watermarkSettings.borderRadius = parseInt(modal.querySelector('#watermark-borderradius').value);
            watermarkSettings.margin = parseInt(modal.querySelector('#watermark-margin').value);
            watermarkSettings.opacity = parseFloat(modal.querySelector('#watermark-opacity-slider').value);
            watermarkSettings.disableBackground = modal.querySelector('#disable-background').checked;
            watermarkSettings.textShadowColor = modal.querySelector('#watermark-textshadow').value;
        }

        // Simpan nilai asli untuk perbandingan saat cancel
        const originalWatermarkSettings = { ...watermarkSettings };
        const originalWatermarkEnabled = watermarkEnabled;
        const originalWatermarkType = watermarkType;
        const originalWatermarkImage = watermarkImage;
        const originalWatermarkImageSize = watermarkImageSize;

        cancelBtn.onclick = () => {
            // Kembalikan nilai asli saat cancel
            Object.assign(watermarkSettings, originalWatermarkSettings);
            watermarkEnabled = originalWatermarkEnabled;
            watermarkType = originalWatermarkType;
            watermarkImage = originalWatermarkImage;
            watermarkImageSize = originalWatermarkImageSize;
            document.body.removeChild(modal);
        };

        saveBtn.onclick = () => {
            updateWatermarkSettingsFromModal();
            watermarkEnabled = modal.querySelector('#enable-watermark').checked;
            saveWatermarkSettings();
            document.body.removeChild(modal);
            showNotification('Watermark settings saved', 'success');
        };

        modal.addEventListener('click', e => {
            if (e.target === modal) document.body.removeChild(modal);
        });
    }

    function createPanelOnce() {
        if (document.getElementById('nai-profiles-panel')) return;
        const container = document.querySelector('.image-gen-prompt-main') || document.querySelector('.prompt-input-box-prompt');
        if (!container) {
            setTimeout(createPanelOnce, 500);
            return;
        }

        const globalStyle = document.createElement('style');
        globalStyle.id = 'nai-hidden-scrollbar-style';
        globalStyle.textContent = `
            #nai-profiles-panel .char-list-container ::-webkit-scrollbar,
            .nai-hidden-scrollbar ::-webkit-scrollbar {
                width: 0 !important;
                height: 0 !important;
                display: none !important;
            }
            #nai-profiles-panel .char-list-container {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `;
        if (!document.getElementById('nai-hidden-scrollbar-style')) {
            document.head.appendChild(globalStyle);
        }

        let select, taPositive, taNegative, status, charsList, charWarning, toggle, charDBSelect, charDBSearchInput;
        let savedPos = { x: 10, y: 10 };
        try {
            const posStr = localStorage.getItem(ICON_POS_KEY);
            if (posStr) savedPos = JSON.parse(posStr);
        } catch (e) {}

        toggle = document.createElement("div");
        toggle.id = "nai-profiles-toggle";
        Object.assign(toggle.style, {
            position: "fixed", top: "0", left: "0", zIndex: "10000", cursor: "move",
            fontSize: isMobile ? "24px" : "20px", padding: isMobile ? "12px" : "8px", backgroundColor: "#f8fafc", color: "#1e40af",
            border: "1px solid #bfdbfe", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            userSelect: "none", transform: `translate(${savedPos.x}px, ${savedPos.y}px)`,
            transition: "opacity 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center",
            width: isMobile ? "48px" : "36px", height: isMobile ? "48px" : "36px"
        });
        toggle.title = "Drag to move | Click to open";
        toggle.innerHTML = "📝";
        document.body.appendChild(toggle);

        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        function handleStart(e) {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;

            if (e.type === 'touchstart') {
                offsetX = e.touches[0].clientX - savedPos.x;
                offsetY = e.touches[0].clientY - savedPos.y;
            } else {
                offsetX = e.clientX - savedPos.x;
                offsetY = e.clientY - savedPos.y;
            }

            toggle.style.opacity = "0.85";
            toggle.style.cursor = "grabbing";
            e.preventDefault();
        }

        function handleMove(e) {
            if (!isDragging) return;

            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            let x = Math.max(10, Math.min(clientX - offsetX, window.innerWidth - (isMobile ? 48 : 36)));
            let y = Math.max(10, Math.min(clientY - offsetY, window.innerHeight - (isMobile ? 48 : 36)));
            toggle.style.transform = `translate(${x}px, ${y}px)`;
        }

        function handleEnd() {
            if (isDragging) {
                isDragging = false;
                toggle.style.opacity = "1";
                toggle.style.cursor = "move";
                const match = toggle.style.transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
                if (match) {
                    savedPos = { x: parseFloat(match[1]), y: parseFloat(match[2]) };
                    localStorage.setItem(ICON_POS_KEY, JSON.stringify(savedPos));
                    if (panel && panel.style.display !== "none") updatePanelPosition();
                }
            }
        }

        toggle.addEventListener("mousedown", handleStart);
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleEnd);
        toggle.addEventListener("touchstart", handleStart, { passive: false });
        toggle.addEventListener("touchmove", handleMove, { passive: false });
        toggle.addEventListener("touchend", handleEnd);

        function handleToggleClick(e) {
            e.preventDefault();
            e.stopPropagation();

            if (panel) {
                panel.style.display = panel.style.display === "none" ? "block" : "none";
                if (panel.style.display === "block") updatePanelPosition();
                return;
            }

            createPanel();
        }

        toggle.addEventListener("click", handleToggleClick);
        toggle.addEventListener("touchend", handleToggleClick);

        function updateCharDBUI(searchTerm = '') {
            const dbKeys = Object.keys(characterDatabase);
            const filteredKeys = dbKeys.filter(key =>
                key.toLowerCase().includes(searchTerm.toLowerCase())
            );

            charDBSelect.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = t('selectChar');
            defaultOption.disabled = true;
            charDBSelect.appendChild(defaultOption);

            if (filteredKeys.length === 0) {
                const noOption = document.createElement('option');
                noOption.value = '';
                noOption.textContent = searchTerm ? t('noCharsFound') : t('noCharacters');
                noOption.disabled = true;
                charDBSelect.appendChild(noOption);
                return;
            }

            filteredKeys.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                charDBSelect.appendChild(option);
            });
        }

        function openCharacterDBModal(editName = null, editPrompt = null, callback = null) {
            if (document.getElementById('nai-character-db-modal')) return;
            const isEdit = editName !== null;
            const colors = getThemeColors();
            const modal = document.createElement('div');
            modal.id = 'nai-character-db-modal';
            Object.assign(modal.style, {
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : '400px', maxWidth: '90vw',
                background: colors.background, color: colors.color,
                border: `1px solid ${colors.borderColor}`, borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: '20000',
                padding: '20px', fontFamily: 'sans-serif', boxSizing: 'border-box'
            });
            modal.innerHTML = `
                <div style="font-weight:bold; font-size:16px; margin-bottom:16px;">${isEdit ? t('editCharacter') : t('addCharToDB')}</div>
                <div style="margin-bottom:12px;"><label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">${t('charNameLabel')}</label><input type="text" id="char-db-name" placeholder="e.g. Hatsune Miku" value="${isEdit ? editName : ''}" style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor}; background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;" /></div>
                <div style="margin-bottom:16px;"><label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">${t('charPromptLabel')}</label><textarea id="char-db-prompt" rows="4" placeholder="e.g. girl, blue hair, twintail, aqua eyes..." style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor}; background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px; resize:vertical;">${isEdit ? editPrompt : ''}</textarea></div>
                <div style="display:flex; gap:8px; justify-content:flex-end;"><button id="cancel-char-db" style="padding:6px 12px; background:${colors.deleteBackground}; color:white; border:none; border-radius:6px; cursor:pointer;">${t('cancel')}</button><button id="save-char-db" style="padding:6px 12px; background:${colors.buttonBackground}; color:white; border:none; border-radius:6px; cursor:pointer;">${isEdit ? 'Update' : t('saveProfile')}</button></div>
            `;
            const scrollbarStyle = document.createElement('style');
            scrollbarStyle.textContent = `
                #nai-settings-modal #settings-content::-webkit-scrollbar {
                    width: 8px;
                }
                #nai-settings-modal #settings-content::-webkit-scrollbar-track {
                    background: ${colors.inputBackground};
                    border-radius: 4px;
                }
                #nai-settings-modal #settings-content::-webkit-scrollbar-thumb {
                    background: ${colors.borderColor};
                    border-radius: 4px;
                }
                #nai-settings-modal #settings-content::-webkit-scrollbar-thumb:hover {
                    background: ${colors.buttonHover};
                }
            `;
            document.head.appendChild(scrollbarStyle);

            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    if (document.head.contains(scrollbarStyle)) {
                        document.head.removeChild(scrollbarStyle);
                    }
                }
            });
            document.body.appendChild(modal);

            const nameInput = modal.querySelector('#char-db-name');
            const promptInput = modal.querySelector('#char-db-prompt');
            const saveBtn = modal.querySelector('#save-char-db');
            const cancelBtn = modal.querySelector('#cancel-char-db');

            saveBtn.onclick = () => {
                const name = nameInput.value.trim();
                const prompt = promptInput.value.trim();
                if (!name || !prompt) {
                    showNotification(t('namePromptRequired'), 'error');
                    return;
                }
                if (isEdit && name !== editName) {
                    delete characterDatabase[editName];
                }

                characterDatabase[name] = prompt;
                localStorage.setItem(CHARACTER_DB_KEY, JSON.stringify(characterDatabase));
                updateCharDBUI(charDBSearchInput.value);
                document.body.removeChild(modal);
                showNotification(t('charAdded', name), 'success');
                if (callback) callback();
            };

            cancelBtn.onclick = () => {
                document.body.removeChild(modal);
                if (callback) callback();
            };

            modal.addEventListener('click', e => { if (e.target === modal) {
                document.body.removeChild(modal);
                if (callback) callback();
            }});
        }

        function openOrganizeCharDBModal() {
            if (document.getElementById('nai-organize-char-db-modal')) return;

            const colors = getThemeColors();
            const modal = document.createElement('div');
            modal.id = 'nai-organize-char-db-modal';
            Object.assign(modal.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '90%' : '500px',
                maxWidth: '90vw',
                height: isMobile ? '70vh' : '60vh',
                background: colors.background,
                color: colors.color,
                border: `1px solid ${colors.borderColor}`,
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                zIndex: '20000',
                padding: '20px',
                fontFamily: 'sans-serif',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column'
            });

            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '16px';

            const title = document.createElement('h3');
            title.textContent = t('organizeCharDBTitle');
            title.style.margin = '0';
            title.style.fontSize = '16px';

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            Object.assign(closeBtn.style, {
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                color: colors.color
            });
            closeBtn.onmouseover = () => { closeBtn.style.backgroundColor = colors.inputBackground; };
            closeBtn.onmouseout = () => { closeBtn.style.backgroundColor = 'transparent'; };
            closeBtn.onclick = () => document.body.removeChild(modal);

            header.appendChild(title);
            header.appendChild(closeBtn);

            const searchContainer = document.createElement('div');
            searchContainer.style.marginBottom = '12px';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = t('searchCharsPlaceholder');
            Object.assign(searchInput.style, {
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: `1px solid ${colors.borderColor}`,
                background: colors.inputBackground,
                color: colors.inputColor,
                fontSize: '13px'
            });

            searchContainer.appendChild(searchInput);

            const listContainer = document.createElement('div');
            listContainer.style.flex = '1';
            listContainer.style.overflowY = 'auto';
            listContainer.style.border = `1px solid ${colors.borderColor}`;
            listContainer.style.borderRadius = '6px';
            listContainer.style.padding = '8px';

            function updateCharacterList(searchTerm = '') {
                listContainer.innerHTML = '';

                const dbKeys = Object.keys(characterDatabase);
                const filteredKeys = dbKeys.filter(key =>
                    key.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (filteredKeys.length === 0) {
                    const noCharsMsg = document.createElement('div');
                    noCharsMsg.textContent = searchTerm ? t('noCharsFound') : t('noCharacters');
                    noCharsMsg.style.textAlign = 'center';
                    noCharsMsg.style.padding = '20px';
                    noCharsMsg.style.opacity = '0.7';
                    listContainer.appendChild(noCharsMsg);
                    return;
                }

                filteredKeys.forEach(name => {
                    const item = document.createElement('div');
                    item.style.display = 'flex';
                    item.style.alignItems = 'center';
                    item.style.justifyContent = 'space-between';
                    item.style.padding = '8px';
                    item.style.borderRadius = '4px';
                    item.style.marginBottom = '6px';
                    item.style.backgroundColor = colors.inputBackground;

                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = name;
                    nameSpan.style.flex = '1';
                    nameSpan.style.marginRight = '8px';
                    nameSpan.style.overflow = 'hidden';
                    nameSpan.style.textOverflow = 'ellipsis';
                    nameSpan.style.whiteSpace = 'nowrap';

                    const actionsContainer = document.createElement('div');
                    actionsContainer.style.display = 'flex';
                    actionsContainer.style.gap = '4px';

                    const editBtn = document.createElement('button');
                    editBtn.innerHTML = '✏️';
                    Object.assign(editBtn.style, {
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: 'none',
                        background: colors.buttonBackground,
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                    });
                    editBtn.onclick = () => {
                        openCharacterDBModal(name, characterDatabase[name], () => {
                            updateCharacterList(searchInput.value);
                            updateCharDBUI(charDBSearchInput.value);
                        });
                    };

                    const renameBtn = document.createElement('button');
                    renameBtn.innerHTML = '📝';
                    Object.assign(renameBtn.style, {
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#64748b',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                    });
                    renameBtn.onclick = () => {
                        const newName = prompt(t('enterNewName'), name);
                        if (!newName || newName === name) return;
                        if (characterDatabase[newName]) {
                            showNotification(t('characterExists'), 'error');
                            return;
                        }
                        characterDatabase[newName] = characterDatabase[name];
                        delete characterDatabase[name];
                        localStorage.setItem(CHARACTER_DB_KEY, JSON.stringify(characterDatabase));
                        updateCharacterList(searchInput.value);
                        updateCharDBUI(charDBSearchInput.value);
                        showNotification(t('charRenamed', name, newName), 'success');
                    };

                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerHTML = '🗑️';
                    Object.assign(deleteBtn.style, {
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: 'none',
                        background: colors.deleteBackground,
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                    });
                    deleteBtn.onclick = () => {
                        if (confirm(t('confirmDeleteChar', name))) {
                            delete characterDatabase[name];
                            localStorage.setItem(CHARACTER_DB_KEY, JSON.stringify(characterDatabase));
                            updateCharacterList(searchInput.value);
                            updateCharDBUI(charDBSearchInput.value);
                            showNotification(t('charDeleted', name), 'info');
                        }
                    };

                    actionsContainer.appendChild(editBtn);
                    actionsContainer.appendChild(renameBtn);
                    actionsContainer.appendChild(deleteBtn);

                    item.appendChild(nameSpan);
                    item.appendChild(actionsContainer);
                    listContainer.appendChild(item);
                });
            }

            updateCharacterList();
            searchInput.addEventListener('input', () => {
                updateCharacterList(searchInput.value);
            });

            modal.appendChild(header);
            modal.appendChild(searchContainer);
            modal.appendChild(listContainer);

            if (isMobile) {
                const bottomCloseBtn = document.createElement('button');
                bottomCloseBtn.textContent = t('close');
                Object.assign(bottomCloseBtn.style, {
                    padding: '12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: colors.deleteBackground,
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginTop: '12px',
                    width: '100%'
                });
                bottomCloseBtn.onclick = () => document.body.removeChild(modal);
                modal.appendChild(bottomCloseBtn);
            }

            document.body.appendChild(modal);
            modal.addEventListener('click', e => {
                if (e.target === modal) document.body.removeChild(modal);
            });
        }

        function openKeyboardShortcutsModal() {
            if (document.getElementById('nai-keyboard-shortcuts-modal')) return;

            const colors = getThemeColors();
            const modal = document.createElement('div');
            modal.id = 'nai-keyboard-shortcuts-modal';
            Object.assign(modal.style, {
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : '600px', maxWidth: '90vw',
                background: colors.background, color: colors.color,
                border: `1px solid ${colors.borderColor}`, borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: '20000',
                padding: '20px', fontFamily: 'sans-serif', boxSizing: 'border-box',
                maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
            });

            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '16px';

            const title = document.createElement('h3');
            title.textContent = t('shortcutsTitle');
            title.style.margin = '0';
            title.style.fontSize = '16px';

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            Object.assign(closeBtn.style, {
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                color: colors.color
            });
            closeBtn.onmouseover = () => { closeBtn.style.backgroundColor = colors.inputBackground; };
            closeBtn.onmouseout = () => { closeBtn.style.backgroundColor = 'transparent'; };
            closeBtn.onclick = () => document.body.removeChild(modal);

            header.appendChild(title);
            header.appendChild(closeBtn);

            const desc = document.createElement('div');
            desc.textContent = t('shortcutsDesc');
            desc.style.fontSize = '13px';
            desc.style.marginBottom = '16px';
            desc.style.opacity = '0.9';

            const note = document.createElement('div');
            note.textContent = t('shortcutsNote');
            note.style.fontSize = '12px';
            note.style.marginBottom = '16px';
            note.style.padding = '8px';
            note.style.borderRadius = '6px';
            note.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            note.style.borderLeft = '3px solid #3b82f6';

            const contentArea = document.createElement('div');
            contentArea.style.flex = '1';
            contentArea.style.overflowY = 'auto';
            contentArea.style.marginBottom = '16px';
            const shortcuts = [
                { id: 'newProfile', label: t('newProfileShortcut') },
                { id: 'saveProfile', label: t('saveProfileShortcut') },
                { id: 'renameProfile', label: t('renameProfileShortcut') },
                { id: 'deleteProfile', label: t('deleteProfileShortcut') },
                { id: 'search', label: t('searchShortcut') },
                { id: 'override', label: t('overrideShortcut') },
                { id: 'append', label: t('appendShortcut') },
                { id: 'addCharacter', label: t('addCharacterShortcut') },
                { id: 'addToDB', label: t('addToDBShortcut') },
                { id: 'organize', label: t('organizeShortcut') },
                { id: 'characterTab', label: t('characterTabShortcut') },
                { id: 'danbooru', label: t('danbooruShortcut') },
                { id: 'e621', label: t('e621Shortcut') },
                { id: 'fullBackup', label: t('fullBackupShortcut') },
                { id: 'fullRestore', label: t('fullRestoreShortcut') }
            ];

            shortcuts.forEach(shortcut => {
                const item = document.createElement('div');
                item.className = 'shortcut-item';

                const label = document.createElement('div');
                label.className = 'shortcut-label';
                label.textContent = shortcut.label;

                const inputContainer = document.createElement('div');
                inputContainer.style.position = 'relative';

                const input = document.createElement('input');
                input.className = 'shortcut-input';
                input.type = 'text';
                input.readOnly = true;
                input.value = formatShortcut(keyboardShortcuts[shortcut.id]);
                input.dataset.shortcutId = shortcut.id;

                const warning = document.createElement('div');
                warning.className = 'shortcut-warning';
                warning.textContent = t('shortcutConflictWarning');
                if (keyboardShortcuts[shortcut.id] && checkShortcutConflict(keyboardShortcuts[shortcut.id])) {
                    input.classList.add('shortcut-conflict');
                    warning.style.display = 'block';
                }

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                Object.assign(editBtn.style, {
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: colors.buttonBackground,
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginLeft: '4px'
                });

                editBtn.onclick = () => {
                    startEditingShortcut(input, warning, shortcut.id);
                };

                inputContainer.appendChild(input);
                inputContainer.appendChild(editBtn);
                inputContainer.appendChild(warning);

                item.appendChild(label);
                item.appendChild(inputContainer);
                contentArea.appendChild(item);
            });

            const buttonArea = document.createElement('div');
            buttonArea.style.display = 'flex';
            buttonArea.style.gap = '8px';
            buttonArea.style.justifyContent = 'flex-end';
            buttonArea.style.paddingTop = '16px';
            buttonArea.style.borderTop = `1px solid ${colors.borderColor}`;

            const resetBtn = document.createElement('button');
            resetBtn.textContent = 'Reset to Defaults';
            Object.assign(resetBtn.style, {
                padding: '6px 12px', background: '#64748b', color: 'white', border: 'none',
                borderRadius: '6px', cursor: 'pointer'
            });

            const saveBtn = document.createElement('button');
            saveBtn.textContent = t('apply');
            Object.assign(saveBtn.style, {
                padding: '6px 12px', background: colors.buttonBackground, color: 'white', border: 'none',
                borderRadius: '6px', cursor: 'pointer'
            });

            buttonArea.appendChild(resetBtn);
            buttonArea.appendChild(saveBtn);

            modal.appendChild(header);
            modal.appendChild(desc);
            modal.appendChild(note);
            modal.appendChild(contentArea);
            modal.appendChild(buttonArea);

            document.body.appendChild(modal);

            resetBtn.onclick = () => {
                if (confirm('Reset all keyboard shortcuts to default values?')) {
                    keyboardShortcuts = { ...DEFAULT_SHORTCUTS };
                    saveKeyboardShortcuts();
                    document.body.removeChild(modal);
                    showNotification(t('shortcutSaved'), 'success');
                    setTimeout(() => openKeyboardShortcutsModal(), 100);
                }
            };

            saveBtn.onclick = () => {
                saveKeyboardShortcuts();
                document.body.removeChild(modal);
                showNotification(t('shortcutSaved'), 'success');
            };

            modal.addEventListener('click', e => {
                if (e.target === modal) document.body.removeChild(modal);
            });
        }

        function createPanel() {
            const colors = getThemeColors();
            panel = document.createElement("div");
            panel.id = "nai-profiles-panel";
            panel.className = isMobile ? "nai-responsive-panel" : "";
            Object.assign(panel.style, {
                position: "fixed",
                width: isMobile ? "95%" : "380px",
                maxWidth: isMobile ? "95%" : "380px",
                height: isMobile ? "80vh" : "auto",
                maxHeight: isMobile ? "80vh" : "none",
                overflowY: "auto",
                background: colors.background, color: colors.color, border: `1px solid ${colors.borderColor}`,
                borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", zIndex: "10000",
                padding: isMobile ? "16px" : "12px", fontFamily: "sans-serif", boxSizing: "border-box",
                fontSize: isMobile ? "14px" : "13px", display: "none"
            });

            if (!document.getElementById('nai-hidden-scrollbar-style')) {
                const style = document.createElement('style');
                style.id = 'nai-hidden-scrollbar-style';
                style.textContent = `
                    #nai-profiles-panel .char-list-container {
                        -ms-overflow-style: none; /* IE/Edge */
                        scrollbar-width: none;   /* Firefox */
                    }
                    #nai-profiles-panel .char-list-container::-webkit-scrollbar {
                        width: 0 !important;
                        height: 0 !important;
                        display: none !important;
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(panel);

            const header = document.createElement("div");
            header.style.display = "flex"; header.style.justifyContent = "space-between";
            header.style.alignItems = "center"; header.style.marginBottom = "10px";

            const title = document.createElement("h3");
            title.style.margin = "0"; title.style.fontSize = isMobile ? "16px" : "14px"; title.style.fontWeight = "bold";
            title.textContent = t('profilesTitle');

            const minimizeBtn = document.createElement("button");
            minimizeBtn.innerHTML = "−";
            Object.assign(minimizeBtn.style, {
                background: "none", border: "none", fontSize: isMobile ? "20px" : "18px", cursor: "pointer",
                padding: "4px", borderRadius: "4px", color: colors.color,
                width: isMobile ? "32px" : "24px", height: isMobile ? "32px" : "24px",
                display: "flex", alignItems: "center", justifyContent: "center"
            });
            minimizeBtn.onmouseover = () => { minimizeBtn.style.backgroundColor = colors.inputBackground; };
            minimizeBtn.onmouseout = () => { minimizeBtn.style.backgroundColor = "transparent"; };

            const closeBtn = document.createElement("button");
            closeBtn.innerHTML = "✕";
            Object.assign(closeBtn.style, {
                background: "none", border: "none", fontSize: isMobile ? "20px" : "18px", cursor: "pointer",
                padding: "4px", borderRadius: "4px", color: colors.color,
                width: isMobile ? "32px" : "24px", height: isMobile ? "32px" : "24px",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 10001
            });
            closeBtn.onmouseover = () => { closeBtn.style.backgroundColor = colors.inputBackground; };
            closeBtn.onmouseout = () => { closeBtn.style.backgroundColor = "transparent"; };

            const handleClose = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (panel) {
                    panel.style.display = "none";
                }
            };
            closeBtn.onclick = handleClose;
            closeBtn.addEventListener('touchend', handleClose, { passive: false });

            header.appendChild(title); header.appendChild(minimizeBtn); header.appendChild(closeBtn);
            panel.appendChild(header);

            const panelContent = document.createElement("div");
            panelContent.id = "panel-content";

            const tabContainer = document.createElement("div");
            tabContainer.style.marginBottom = "8px";

            tabButtons = document.createElement("div");
            tabButtons.className = "tab-buttons";
            tabButtons.style.display = "flex";
            tabButtons.style.marginBottom = "8px";
            if (isMobile) {
                tabButtons.style.flexWrap = "nowrap";
                tabButtons.style.overflowX = "auto";
                tabButtons.style.width = "100%";
                tabButtons.style.scrollbarWidth = "none";
                tabButtons.style.msOverflowStyle = "none";
            } else {
                tabButtons.style.flexWrap = "nowrap";
            }

            const tabContent = document.createElement("div");
            tabContent.style.padding = "8px";
            tabContent.style.border = `1px solid ${colors.borderColor}`;
            tabContent.style.borderRadius = "6px";

            const tabs = [
                { id: "profile", name: t('profileTab'), active: true },
                { id: "character", name: t('characterTab'), active: false },
                { id: "utility", name: t('utilityTab'), active: false },
                { id: "settings", name: t('settingsTab'), active: false }
            ];

            tabs.forEach(tab => {
                const tabBtn = document.createElement("button");
                tabBtn.textContent = tab.name;
                tabBtn.className = "nai-responsive-text";
                Object.assign(tabBtn.style, {
                    padding: isMobile ? "8px 6px" : "6px 12px",
                    borderRadius: "6px 6px 0 0",
                    border: "none",
                    background: tab.active ? colors.buttonBackground : colors.inputBackground,
                    color: "white",
                    cursor: "pointer",
                    fontSize: isMobile ? "11px" : "12px",
                    marginRight: "2px",
                    marginBottom: isMobile ? "4px" : "0",
                    flex: isMobile ? "1" : "none",
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: isMobile ? "60px" : "auto",
                    maxWidth: isMobile ? "80px" : "none"
                });

                tabBtn.onclick = () => {
                    document.querySelectorAll(".tab-content").forEach(content => {
                        content.style.display = "none";
                    });
                    document.getElementById(`tab-${tab.id}`).style.display = "block";
                    tabs.forEach(t => {
                        const isActive = t.id === tab.id;
                        const btn = Array.from(tabButtons.children).find(b => b.textContent === t.name);
                        if (btn) {
                            btn.style.background = isActive ? colors.buttonBackground : colors.inputBackground;
                        }
                    });
                };

                tabButtons.appendChild(tabBtn);
            });
            characterTabBtn = Array.from(tabButtons.children).find(b => b.textContent === t('characterTab'));

            tabContainer.appendChild(tabButtons);
            tabContainer.appendChild(tabContent);
            panelContent.appendChild(tabContainer);

            // Profile Tab
            const profileTab = document.createElement("div");
            profileTab.id = "tab-profile";
            profileTab.className = "tab-content";

            searchDiv = document.createElement("div");
            searchDiv.style.marginBottom = "8px";
            searchDiv.style.display = "none";
            searchInput = document.createElement("input");
            searchInput.type = "text";
            searchInput.placeholder = t('searchProfiles');
            Object.assign(searchInput.style, {
                width: "100%", padding: isMobile ? "10px" : "6px", borderRadius: "6px", border: `1px solid ${colors.borderColor}`,
                background: colors.inputBackground, color: colors.inputColor, fontSize: isMobile ? "14px" : "13px"
            });
            searchDiv.appendChild(searchInput);
            profileTab.appendChild(searchDiv);

            const selectDiv = document.createElement("div");
            selectDiv.style.marginBottom = "8px";
            select = document.createElement("select");
            Object.assign(select.style, {
                width: "100%", padding: isMobile ? "10px" : "6px", borderRadius: "6px", border: `1px solid ${colors.borderColor}`,
                background: colors.inputBackground, color: colors.inputColor, fontSize: isMobile ? "14px" : "13px"
            });
            selectDiv.appendChild(select);
            profileTab.appendChild(selectDiv);

            const mobileActionButtons = document.createElement("div");
            if (isMobile) {
                mobileActionButtons.className = "mobile-action-buttons";
            } else {
                mobileActionButtons.style.display = "flex";
                mobileActionButtons.style.gap = "6px";
                mobileActionButtons.style.marginBottom = "8px";
            }

            overrideBtn = document.createElement("button");
            overrideBtn.textContent = t('override');
            overrideBtn.className = "nai-responsive-button";
            Object.assign(overrideBtn.style, {
                flex: "1",
                padding: isMobile ? "12px" : "6px",
                borderRadius: "6px",
                border: "none",
                background: colors.buttonBackground,
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                fontWeight: "bold",
                minHeight: isMobile ? "44px" : "auto"
            });
            overrideBtn.onclick = () => {
                const positiveText = taPositive.value.trim();
                const negativeText = taNegative.value.trim();

                if (positiveText) {
                    applyTextToEditor(positiveText, status);
                }
                if (negativeText) {
                    applyTextToNegativeEditor(negativeText, status);
                }

                const name = select.value;
                if (name) {
                    const profile = profiles.find(p => p.name === name);
                    if (profile && profile.characters && profile.characters.length > 0) {
                        insertCharacterPrompts(profile.characters, charWarning);
                    }
                }

                showNotification(`✅ Applied current editor content`, 'success');
            };

            appendBtn = document.createElement("button");
            appendBtn.textContent = t('append');
            appendBtn.className = "nai-responsive-button";
            Object.assign(appendBtn.style, {
                flex: "1",
                padding: isMobile ? "12px" : "6px",
                borderRadius: "6px",
                border: "none",
                background: colors.buttonBackground,
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                fontWeight: "bold",
                minHeight: isMobile ? "44px" : "auto"
            });
            appendBtn.onclick = () => {
                const positiveText = taPositive.value.trim();
                const negativeText = taNegative.value.trim();

                if (positiveText) {
                    applyTextToEditorAppend(positiveText, status);
                }
                if (negativeText) {
                    applyTextToNegativeEditor(negativeText, status);
                }

                showNotification(`✅ Appended current editor content`, 'success');
            };

            mobileActionButtons.appendChild(overrideBtn);
            mobileActionButtons.appendChild(appendBtn);
            profileTab.appendChild(mobileActionButtons);

            const profileMenuRow = document.createElement("div");
            profileMenuRow.style.display = "flex";
            profileMenuRow.style.gap = "6px";
            profileMenuRow.style.marginBottom = "8px";
            profileMenuRow.style.position = "relative";

            const profileMenuBtn = document.createElement("button");
            profileMenuBtn.textContent = t('profileMenu');
            profileMenuBtn.className = "nai-responsive-button";
            Object.assign(profileMenuBtn.style, {
                width: "100%",
                padding: isMobile ? "12px" : "6px",
                borderRadius: "6px",
                border: "none",
                background: colors.buttonBackground,
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                minHeight: isMobile ? "44px" : "auto"
            });

            const profileDropdown = document.createElement("div");
            profileDropdown.style.display = "none";
            profileDropdown.style.backgroundColor = colors.inputBackground;
            profileDropdown.style.border = `1px solid ${colors.borderColor}`;
            profileDropdown.style.borderRadius = "6px";
            profileDropdown.style.zIndex = "1000";
            profileDropdown.style.minWidth = "150px";
            profileDropdown.style.top = "100%";
            profileDropdown.style.left = "0";
            profileDropdown.style.marginTop = "2px";

            if (isMobile) {
                profileDropdown.style.position = "fixed";
                profileDropdown.style.top = "50%";
                profileDropdown.style.left = "50%";
                profileDropdown.style.transform = "translate(-50%, -50%)";
                profileDropdown.style.width = isMobile && window.innerWidth <= 400 ? "85%" : "70%";
                profileDropdown.style.maxWidth = "280px";
                profileDropdown.style.maxHeight = "60vh";
                profileDropdown.style.overflowY = "auto";
            }

            saveBtn = document.createElement("div");
            saveBtn.textContent = t('saveProfile');
            Object.assign(saveBtn.style, {
                padding: isMobile ? "12px 8px" : "8px 12px",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            saveBtn.onmouseover = () => { saveBtn.style.backgroundColor = colors.buttonHover; };
            saveBtn.onmouseout = () => { saveBtn.style.backgroundColor = "transparent"; };
            saveBtn.onclick = () => {
                const name = select.value;
                if (!name) {
                    showNotification(t('pickProfileFirst'), 'error');
                    return;
                }
                const profile = profiles.find(p => p.name === name);
                if (!profile) return;
                profile.positive = taPositive.value.trim();
                profile.negative = taNegative.value.trim();
                if (panelStepsInput) profile.steps = parseInt(panelStepsInput.value) || 28;
                if (panelGuidanceInput) profile.guidance = parseFloat(panelGuidanceInput.value) || 5.0;

                saveToStorage();
                showNotification(t('savedProfile', name), 'success');
                profileDropdown.style.display = "none";
            };

            newBtn = document.createElement("div");
            newBtn.textContent = t('newProfile');
            Object.assign(newBtn.style, {
                padding: isMobile ? "12px 8px" : "8px 12px",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            newBtn.onmouseover = () => { newBtn.style.backgroundColor = colors.buttonHover; };
            newBtn.onmouseout = () => { newBtn.style.backgroundColor = "transparent"; };
            newBtn.onclick = () => {
                const name = prompt(t('enterProfileName'));
                if (!name) return;
                if (profiles.some(p => p.name === name)) {
                    showNotification(t('profileExists', name), 'error');
                    return;
                }
                const newProfile = {
                    name,
                    positive: "",
                    negative: "",
                    characters: [],
                    steps: panelStepsInput ? parseInt(panelStepsInput.value) || 28 : 28,
                    guidance: panelGuidanceInput ? parseFloat(panelGuidanceInput.value) || 5.0 : 5.0
                };
                profiles.push(newProfile);
                saveToStorage();
                updateSelectOptions(select, name);
                taPositive.value = "";
                taNegative.value = "";
                updateCharListUI();
                updateCharDBUI();
                showNotification(t('createdProfile', name), 'success');
                profileDropdown.style.display = "none";
            };

            renameBtn = document.createElement("div");
            renameBtn.textContent = t('renameProfile');
            Object.assign(renameBtn.style, {
                padding: isMobile ? "12px 8px" : "8px 12px",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            renameBtn.onmouseover = () => { renameBtn.style.backgroundColor = colors.buttonHover; };
            renameBtn.onmouseout = () => { renameBtn.style.backgroundColor = "transparent"; };
            renameBtn.onclick = () => {
                const name = select.value;
                if (!name) {
                    showNotification(t('pickProfileFirst'), 'error');
                    return;
                }
                const newName = prompt(t('renamePrompt'), name);
                if (!newName || newName === name) return;
                if (profiles.some(p => p.name === newName)) {
                    showNotification(t('renameTaken', newName), 'error');
                    return;
                }
                const profile = profiles.find(p => p.name === name);
                if (profile) {
                    profile.name = newName;
                    saveToStorage();
                    updateSelectOptions(select, newName);
                    if (lastProfileName === name) setLastProfile(newName);
                    showNotification(t('renamed', name, newName), 'success');
                }
                profileDropdown.style.display = "none";
            };

            deleteBtn = document.createElement("div");
            deleteBtn.textContent = t('deleteProfile');
            Object.assign(deleteBtn.style, {
                padding: isMobile ? "12px 8px" : "8px 12px",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            deleteBtn.onmouseover = () => { deleteBtn.style.backgroundColor = colors.deleteHover; };
            deleteBtn.onmouseout = () => { deleteBtn.style.backgroundColor = "transparent"; };
            deleteBtn.onclick = () => {
                const name = select.value;
                if (!name) {
                    showNotification(t('pickProfileFirst'), 'error');
                    return;
                }
                if (!confirm(t('confirmDelete', name))) return;
                const idx = profiles.findIndex(p => p.name === name);
                if (idx !== -1) {
                    profiles.splice(idx, 1);
                    saveToStorage();
                    if (profiles.length === 0) {
                        updateSelectOptions(select);
                        taPositive.value = ""; taNegative.value = ""; charsList.innerHTML = "";
                        showNotification(t('deletedNone', name), 'info');
                    } else {
                        const newSel = profiles[Math.max(0, idx - 1)].name;
                        updateSelectOptions(select, newSel);
                        if (lastProfileName === name) setLastProfile(newSel);
                        showNotification(t('deletedSwitched', name, newSel), 'info');
                    }
                }
                profileDropdown.style.display = "none";
            };

            swapBtn = document.createElement("div");
            swapBtn.textContent = t('swapPosition');
            Object.assign(swapBtn.style, {
                padding: isMobile ? "12px 8px" : "8px 12px",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            swapBtn.onmouseover = () => { swapBtn.style.backgroundColor = colors.buttonHover; };
            swapBtn.onmouseout = () => { swapBtn.style.backgroundColor = "transparent"; };
            swapBtn.onclick = () => {
                const name = select.value;
                if (!name) {
                    showNotification(t('pickProfileFirst'), 'error');
                    return;
                }

                const currentIndex = profiles.findIndex(p => p.name === name);
                const input = prompt(t('swapPrompt'));
                if (!input) return;

                const targetIndex = parseInt(input) - 1;

                if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= profiles.length) {
                    showNotification(t('invalidPos'), 'error');
                    return;
                }

                if (currentIndex === targetIndex) {
                    showNotification(t('alreadyThere'), 'info');
                    return;
                }
                [profiles[currentIndex], profiles[targetIndex]] = [profiles[targetIndex], profiles[currentIndex]];
                saveToStorage();
                updateSelectOptions(select, name);

                showNotification(t('swapped', currentIndex + 1, targetIndex + 1), 'success');
                profileDropdown.style.display = "none";
            };

            clearAllBtn = document.createElement("div");
            clearAllBtn.textContent = t('clearAll');
            Object.assign(clearAllBtn.style, {
                padding: isMobile ? "12px 8px" : "8px 12px",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
            });
            clearAllBtn.onmouseover = () => { clearAllBtn.style.backgroundColor = colors.deleteHover; };
            clearAllBtn.onmouseout = () => { clearAllBtn.style.backgroundColor = "transparent"; };
            clearAllBtn.onclick = () => {
                if (!confirm(t('confirmClearAll'))) return;
                profiles = []; saveToStorage(); updateSelectOptions(select);
                taPositive.value = ""; taNegative.value = ""; charsList.innerHTML = "";
                showNotification(t('clearedAll'), 'info');
                profileDropdown.style.display = "none";
            };

            if (isMobile) {
                const closeDropdownBtn = document.createElement("div");
                closeDropdownBtn.textContent = t('close');
                Object.assign(closeDropdownBtn.style, {
                    padding: "12px 8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: colors.deleteBackground,
                    color: "white",
                    borderRadius: "6px",
                    marginTop: "8px",
                    fontWeight: "bold"
                });

                const handleDropdownClose = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    profileDropdown.style.display = "none";
                };
                closeDropdownBtn.onclick = handleDropdownClose;
                closeDropdownBtn.addEventListener('touchend', handleDropdownClose, { passive: false });

                const dropdownHeader = document.createElement("div");
                dropdownHeader.style.display = "flex";
                dropdownHeader.style.justifyContent = "space-between";
                dropdownHeader.style.alignItems = "center";
                dropdownHeader.style.padding = "8px 12px";
                dropdownHeader.style.borderBottom = `1px solid ${colors.borderColor}`;
                dropdownHeader.style.marginBottom = "4px";

                const dropdownTitle = document.createElement("div");
                dropdownTitle.textContent = t('profileOptions');
                dropdownTitle.style.fontWeight = "bold";
                dropdownTitle.style.fontSize = "16px";

                dropdownHeader.appendChild(dropdownTitle);
                dropdownHeader.appendChild(closeDropdownBtn);

                profileDropdown.appendChild(dropdownHeader);
            }

            profileDropdown.appendChild(saveBtn);
            profileDropdown.appendChild(newBtn);
            profileDropdown.appendChild(renameBtn);
            profileDropdown.appendChild(deleteBtn);
            profileDropdown.appendChild(swapBtn);
            profileDropdown.appendChild(clearAllBtn);

            profileMenuBtn.appendChild(profileDropdown);
            profileMenuBtn.onclick = (e) => {
                e.stopPropagation();
                profileDropdown.style.display = profileDropdown.style.display === "none" ? "block" : "none";
            };

            profileMenuRow.appendChild(profileMenuBtn);
            profileTab.appendChild(profileMenuRow);

            const taDiv = document.createElement("div");
            taDiv.style.marginBottom = "8px";
            taPositive = document.createElement("textarea");
            taPositive.placeholder = t('positivePlaceholder');
            Object.assign(taPositive.style, {
                width: "100%", height: isMobile ? "120px" : "100px", padding: isMobile ? "10px" : "6px", borderRadius: "6px",
                border: `1px solid ${colors.borderColor}`, background: colors.inputBackground,
                color: colors.inputColor, resize: "vertical", fontSize: isMobile ? "14px" : "12px", fontFamily: "monospace"
            });
            taDiv.appendChild(taPositive);
            taNegative = document.createElement("textarea");
            taNegative.placeholder = t('negativePlaceholder');
            Object.assign(taNegative.style, {
                width: "100%", height: isMobile ? "80px" : "60px", padding: isMobile ? "10px" : "6px", borderRadius: "6px",
                border: `1px solid ${colors.borderColor}`, background: colors.inputBackground,
                color: colors.inputColor, resize: "vertical", fontSize: isMobile ? "14px" : "12px", fontFamily: "monospace", marginTop: "6px"
            });
            taDiv.appendChild(taNegative);
            profileTab.appendChild(taDiv);

            const imageSettingsContainer = document.createElement("div");
            imageSettingsContainer.className = "image-settings-container";
            if (isMobile) {
                imageSettingsContainer.style.display = "none";
            }

            const settingsRow = document.createElement("div");
            settingsRow.className = "image-settings-row";
            settingsRow.style.display = "flex";
            settingsRow.style.alignItems = "center";
            settingsRow.style.gap = "8px";

            const stepsContainer = document.createElement("div");
            stepsContainer.style.display = "flex";
            stepsContainer.style.alignItems = "center";
            stepsContainer.style.gap = "4px";

            const stepsLabel = document.createElement("span");
            stepsLabel.textContent = t('steps');
            stepsLabel.style.fontSize = isMobile ? "12px" : "13px";
            stepsLabel.style.marginRight = "4px";

            const stepsInput = document.createElement("input");
            stepsInput.type = "number";
            stepsInput.className = "image-setting-input";
            stepsInput.style.width = isMobile ? "60px" : "40px";
            stepsInput.style.padding = "4px";
            stepsInput.style.borderRadius = "4px";
            stepsInput.style.border = "1px solid #475569";
            stepsInput.style.background = "#1e293b";
            stepsInput.style.color = "#e2e8f0";
            stepsInput.style.fontSize = isMobile ? "12px" : "13px";
            stepsInput.min = "1";
            stepsInput.max = "50";
            stepsInput.value = imageSettings.steps;
            panelStepsInput = stepsInput;
            stepsInput.addEventListener('change', () => {
                const name = select.value;
                if (name) {
                    const profile = profiles.find(p => p.name === name);
                    if (profile) {
                        profile.steps = parseInt(stepsInput.value) || 28;
                        saveToStorage();
                    }
                } else {
                    imageSettings.steps = parseInt(stepsInput.value) || 28;
                    saveImageSettings();
                }
            });

            stepsContainer.appendChild(stepsLabel);
            stepsContainer.appendChild(stepsInput);

            const separator1 = document.createElement("span");
            separator1.textContent = "|";
            separator1.style.margin = "0 4px";
            separator1.style.color = "#94a3b8";

            const guidanceContainer = document.createElement("div");
            guidanceContainer.style.display = "flex";
            guidanceContainer.style.alignItems = "center";
            guidanceContainer.style.gap = "4px";

            const guidanceLabel = document.createElement("span");
            guidanceLabel.textContent = t('guidance');
            guidanceLabel.style.fontSize = isMobile ? "12px" : "13px";
            guidanceLabel.style.marginRight = "4px";

            const guidanceInput = document.createElement("input");
            guidanceInput.type = "number";
            guidanceInput.className = "image-setting-input";
            guidanceInput.style.width = isMobile ? "60px" : "40px";
            guidanceInput.style.padding = "4px";
            guidanceInput.style.borderRadius = "4px";
            guidanceInput.style.border = "1px solid #475569";
            guidanceInput.style.background = "#1e293b";
            guidanceInput.style.color = "#e2e8f0";
            guidanceInput.style.fontSize = isMobile ? "12px" : "13px";
            guidanceInput.min = "1";
            guidanceInput.max = "20";
            guidanceInput.step = "0.1";
            guidanceInput.value = imageSettings.guidance;
            panelGuidanceInput = guidanceInput;
            guidanceInput.addEventListener('change', () => {
                const name = select.value;
                if (name) {
                    const profile = profiles.find(p => p.name === name);
                    if (profile) {
                        profile.guidance = parseFloat(guidanceInput.value) || 5.0;
                        saveToStorage();
                    }
                } else {
                    imageSettings.guidance = parseFloat(guidanceInput.value) || 5.0;
                    saveImageSettings();
                }
            });

            guidanceContainer.appendChild(guidanceLabel);
            guidanceContainer.appendChild(guidanceInput);

            const separator2 = document.createElement("span");
            separator2.textContent = "|";
            separator2.style.margin = "0 4px";
            separator2.style.color = "#94a3b8";

            const applySettingsBtn = document.createElement("button");
            applySettingsBtn.innerHTML = "✅";
            applySettingsBtn.className = "nai-responsive-button";
            applySettingsBtn.style.padding = isMobile ? "6px 8px" : "4px 8px";
            applySettingsBtn.style.borderRadius = "4px";
            applySettingsBtn.style.border = "none";
            applySettingsBtn.style.background = "#3b82f6";
            applySettingsBtn.style.color = "white";
            applySettingsBtn.style.cursor = "pointer";
            applySettingsBtn.style.fontSize = isMobile ? "14px" : "16px";
            applySettingsBtn.style.display = "flex";
            applySettingsBtn.style.alignItems = "center";
            applySettingsBtn.style.justifyContent = "center";
            applySettingsBtn.addEventListener('click', applyImageSettings);

            settingsRow.appendChild(stepsContainer);
            settingsRow.appendChild(separator1);
            settingsRow.appendChild(guidanceContainer);
            settingsRow.appendChild(separator2);
            settingsRow.appendChild(applySettingsBtn);

            imageSettingsContainer.appendChild(settingsRow);
            profileTab.appendChild(imageSettingsContainer);

            const generateBtn = document.createElement("button");
            generateBtn.textContent = t('generate');
            generateBtn.className = "nai-responsive-button";
            Object.assign(generateBtn.style, {
                width: "100%",
                padding: isMobile ? "12px" : "6px",
                borderRadius: "6px",
                border: "1px solid #7c7850",
                backgroundColor: "rgb(245, 243, 194)",
                color: "black",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                fontWeight: "bold",
                marginTop: "6px",
                fontFamily: "inherit",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                minHeight: isMobile ? "44px" : "auto"
            });
            generateBtn.onmouseover = () => {
                generateBtn.style.backgroundColor = "#e8e5b0";
            };
            generateBtn.onmouseout = () => {
                generateBtn.style.backgroundColor = "rgb(245, 243, 194)";
            };

            if (isMobile) {
                generateBtn.style.display = "none";
            }

            generateBtn.onclick = () => {
                applyImageSettings();

                const findGenerateButton = () => {
                    let btn = document.querySelector('.common__GenerateButtonMain-sc-883533e0-3');
                    if (btn) {
                        return btn;
                    }
                    btn = document.querySelector('[class*="GenerateButtonMain"]');
                    if (btn) {
                        return btn;
                    }
                    const buttonsWithSpan = document.querySelectorAll('button span');
                    for (const span of buttonsWithSpan) {
                        if (span.textContent && span.textContent.toLowerCase().includes('generate')) {
                            return span.parentElement;
                        }
                    }
                    const allButtons = document.querySelectorAll('button');
                    for (const button of allButtons) {
                        if (button.textContent && button.textContent.toLowerCase().includes('generate')) {
                            return button;
                        }
                    }

                    return null;
                };

                const clickButtonRobustly = (btn) => {
                    if (!btn) return;
                    showNotification(t('generatingImage'), 'info');
                    try {
                        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setTimeout(() => {
                            btn.focus();
                            btn.click();
                        }, 150);
                    } catch (e) {
                        console.error('NAI: Standard click failed, trying another way.', e);
                        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                            btn.dispatchEvent(new MouseEvent(eventType, {
                                view: window,
                                bubbles: true,
                                cancelable: true,
                                buttons: 1
                            }));
                        });
                    }
                };

                const attemptClick = () => {
                    const button = findGenerateButton();
                    if (button) {
                        clickButtonRobustly(button);
                        return true;
                    }
                    return false;
                };

                if (!attemptClick()) {
                    setTimeout(attemptClick, 500);
                    setTimeout(attemptClick, 1500);
                    setTimeout(() => {
                        if (!attemptClick()) {
                            showNotification(t('cantFindGenerateBtn'), 'error');
                        }
                    }, 3000);
                }
            };
            profileTab.appendChild(generateBtn);

            tabContent.appendChild(profileTab);

            // Character Tab
            const characterTab = document.createElement("div");
            characterTab.id = "tab-character";
            characterTab.className = "tab-content";
            characterTab.style.display = "none";

            const charSection = document.createElement("div");
            charSection.style.marginBottom = "8px";

            const charHeader = document.createElement("div");
            charHeader.style.display = "flex"; charHeader.style.justifyContent = "space-between";
            charHeader.style.alignItems = "center"; charHeader.style.marginBottom = "6px";

            const charTitle = document.createElement("h4");
            charTitle.style.margin = "0"; charTitle.style.fontSize = isMobile ? "15px" : "13px"; charTitle.style.fontWeight = "bold";
            charTitle.textContent = t('characterTab');

            addCharBtn = document.createElement("button");
            addCharBtn.textContent = t('addCharacter');
            addCharBtn.className = "nai-responsive-button";
            Object.assign(addCharBtn.style, {
                padding: isMobile ? "8px 12px" : "4px 8px", borderRadius: "4px", border: "none",
                background: colors.buttonBackground, color: "white", cursor: "pointer", fontSize: isMobile ? "12px" : "11px"
            });
            addCharBtn.onclick = () => {
                const name = select.value;
                if (!name) {
                    showNotification(t('pickProfileFirst'), 'error');
                    return;
                }
                const profile = profiles.find(p => p.name === name);
                if (profile) openCharacterModal(profile);
            };

            charHeader.appendChild(charTitle); charHeader.appendChild(addCharBtn);
            charSection.appendChild(charHeader);

            charsList = document.createElement("div");
            charsList.style.minHeight = "40px";
            charSection.appendChild(charsList);

            charWarning = document.createElement("div");
            charWarning.style.display = "none";
            charSection.appendChild(charWarning);

            characterTab.appendChild(charSection);

            const charDBSection = document.createElement("div");
            charDBSection.style.marginTop = "16px";

            const charDBHeader = document.createElement("div");
            charDBHeader.style.display = "flex"; charDBHeader.style.justifyContent = "space-between";
            charDBHeader.style.alignItems = "center"; charDBHeader.style.marginBottom = "6px";

            const charDBTitle = document.createElement("h4");
            charDBTitle.style.margin = "0"; charDBTitle.style.fontSize = isMobile ? "15px" : "13px"; charDBTitle.style.fontWeight = "bold";
            charDBTitle.textContent = t('characterDB');

            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.gap = "6px";

            addCharDBBtn = document.createElement("button");
            addCharDBBtn.textContent = t('addToDB');
            addCharDBBtn.className = "nai-responsive-button";
            Object.assign(addCharDBBtn.style, {
                padding: isMobile ? "8px 12px" : "4px 8px", borderRadius: "4px", border: "none",
                background: colors.buttonBackground, color: "white", cursor: "pointer", fontSize: isMobile ? "12px" : "11px"
            });
            addCharDBBtn.onclick = () => openCharacterDBModal();

            organizeCharDBBtn = document.createElement("button");
            organizeCharDBBtn.textContent = t('organizeCharDB');
            organizeCharDBBtn.className = "nai-responsive-button";
            Object.assign(organizeCharDBBtn.style, {
                padding: isMobile ? "8px 12px" : "4px 8px",
                borderRadius: "4px",
                border: "none",
                background: "#64748b",
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? "12px" : "11px"
            });
            organizeCharDBBtn.onclick = () => openOrganizeCharDBModal();

            buttonContainer.appendChild(addCharDBBtn);
            buttonContainer.appendChild(organizeCharDBBtn);

            charDBHeader.appendChild(charDBTitle);
            charDBHeader.appendChild(buttonContainer);
            charDBSection.appendChild(charDBHeader);

            const charDBSelectContainer = document.createElement("div");
            charDBSelectContainer.style.display = "flex";
            charDBSelectContainer.style.gap = "6px";
            charDBSelectContainer.style.marginBottom = "8px";

            charDBSelect = document.createElement("select");
            Object.assign(charDBSelect.style, {
                flex: "1",
                padding: isMobile ? "10px" : "6px",
                borderRadius: "6px",
                border: `1px solid ${colors.borderColor}`,
                background: colors.inputBackground,
                color: colors.inputColor,
                fontSize: isMobile ? "14px" : "13px"
            });

            const addSelectedBtn = document.createElement("button");
            addSelectedBtn.textContent = t('addSelected');
            addSelectedBtn.className = "nai-responsive-button";
            Object.assign(addSelectedBtn.style, {
                padding: isMobile ? "10px 12px" : "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: colors.buttonBackground,
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                fontWeight: "bold"
            });
            addSelectedBtn.onclick = () => {
                const selectedCharName = charDBSelect.value;
                if (!selectedCharName) {
                    showNotification(t('pickProfileFirst'), 'error');
                    return;
                }
                const profile = profiles.find(p => p.name === select.value);
                if (profile) {
                    profile.characters.push({ name: selectedCharName, prompt: characterDatabase[selectedCharName] });
                    saveToStorage();
                    updateCharListUI();
                    insertCharacterPrompts(profile.characters, charWarning);
                    showNotification(t('charAddedToProfile', selectedCharName), 'success');
                } else {
                    showNotification(t('pickProfileFirst'), 'error');
                }
            };

            charDBSelectContainer.appendChild(charDBSelect);
            charDBSelectContainer.appendChild(addSelectedBtn);
            charDBSection.appendChild(charDBSelectContainer);

            charDBSearchInput = document.createElement("input");
            charDBSearchInput.type = "text";
            charDBSearchInput.placeholder = t('searchCharDB');
            Object.assign(charDBSearchInput.style, {
                width: "100%",
                padding: isMobile ? "10px" : "6px",
                borderRadius: "6px",
                border: `1px solid ${colors.borderColor}`,
                background: colors.inputBackground,
                color: colors.inputColor,
                fontSize: isMobile ? "14px" : "13px",
                marginBottom: "8px"
            });
            charDBSearchInput.addEventListener('input', () => {
                updateCharDBUI(charDBSearchInput.value);
            });
            charDBSection.appendChild(charDBSearchInput);

            characterTab.appendChild(charDBSection);

            let quickAddSection;
            const quickAddSectionContainer = document.createElement("div");
            quickAddSectionContainer.style.marginTop = "16px";
            quickAddSection = document.createElement("div");
            quickAddSection.style.padding = "12px";
            quickAddSection.style.border = `1px solid ${colors.borderColor}`;
            quickAddSection.style.borderRadius = "6px";
            quickAddSection.style.backgroundColor = colors.inputBackground;

            const quickAddTitle = document.createElement("h4");
            quickAddTitle.style.margin = "0 0 8px 0";
            quickAddTitle.style.fontSize = isMobile ? "15px" : "13px";
            quickAddTitle.style.fontWeight = "bold";
            quickAddTitle.textContent = t('quickAddTitle');
            quickAddSection.appendChild(quickAddTitle);

            const quickAddSelectContainer = document.createElement("div");
            quickAddSelectContainer.style.display = "flex";
            quickAddSelectContainer.style.gap = "6px";
            quickAddSelectContainer.style.marginBottom = "8px";

            const quickAddSelect = document.createElement("select");
            Object.assign(quickAddSelect.style, {
                flex: "1",
                padding: isMobile ? "10px" : "6px",
                borderRadius: "6px",
                border: `1px solid ${colors.borderColor}`,
                background: colors.background,
                color: colors.color,
                fontSize: isMobile ? "14px" : "13px"
            });

            const quickAddButtonsContainer = document.createElement("div");
            quickAddButtonsContainer.style.display = "flex";
            quickAddButtonsContainer.style.gap = "6px";

            const quickAddOverrideBtn = document.createElement("button");
            quickAddOverrideBtn.textContent = t('override');
            quickAddOverrideBtn.className = "nai-responsive-button";
            Object.assign(quickAddOverrideBtn.style, {
                flex: "1",
                padding: isMobile ? "10px 12px" : "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: colors.buttonBackground,
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                fontWeight: "bold"
            });

            const quickAddAppendBtn = document.createElement("button");
            quickAddAppendBtn.textContent = t('append');
            quickAddAppendBtn.className = "nai-responsive-button";
            Object.assign(quickAddAppendBtn.style, {
                flex: "1",
                padding: isMobile ? "10px 12px" : "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#10b981",
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                fontWeight: "bold"
            });

            quickAddSelectContainer.appendChild(quickAddSelect);
            quickAddButtonsContainer.appendChild(quickAddOverrideBtn);
            quickAddButtonsContainer.appendChild(quickAddAppendBtn);

            quickAddSection.appendChild(quickAddSelectContainer);
            quickAddSection.appendChild(quickAddButtonsContainer);
            quickAddSectionContainer.appendChild(quickAddSection);
            characterTab.appendChild(quickAddSectionContainer);

            tabContent.appendChild(characterTab);

            // Utility Tab with GLM AI Assistant
            const utilityTab = document.createElement("div");
            utilityTab.id = "tab-utility";
            utilityTab.className = "tab-content";
            utilityTab.style.display = "none";
            if (isMobile) {
                utilityTab.style.width = "100%";
                utilityTab.style.overflow = "visible";
            }

            // GLM AI Assistant Section
const glmSection = document.createElement("div");
glmSection.style.marginBottom = "12px";
glmSection.innerHTML = `
    <div style="font-weight:bold; font-size:14px; margin-bottom:8px; color: #e2e8f0;">🤖 AI Assistant (Experimental)</div>
`;

// Susunan tombol yang baru (tanpa Translator)
const glmBtnRow1 = document.createElement("div");
glmBtnRow1.className = "utility-button-row";
glmBtnRow1.style.display = "grid";
glmBtnRow1.style.gridTemplateColumns = "1fr 1fr";
glmBtnRow1.style.gap = "8px";
glmBtnRow1.style.marginBottom = "8px";

const glmAssistantBtn = document.createElement("button");
glmAssistantBtn.className = "glm-assistant-btn";
glmAssistantBtn.innerHTML = "🔧<br>Optimize";
glmAssistantBtn.onclick = () => openGLMAssistantModal('assistant');

const glmIdeasBtn = document.createElement("button");
glmIdeasBtn.className = "glm-assistant-btn";
glmIdeasBtn.innerHTML = "💡<br>Ideas";
glmIdeasBtn.onclick = () => openGLMAssistantModal('ideas');

glmBtnRow1.appendChild(glmAssistantBtn);
glmBtnRow1.appendChild(glmIdeasBtn);

const glmBtnRow2 = document.createElement("div");
glmBtnRow2.className = "utility-button-row";
glmBtnRow2.style.display = "grid";
glmBtnRow2.style.gridTemplateColumns = "1fr 1fr";
glmBtnRow2.style.gap = "8px";
glmBtnRow2.style.marginBottom = "12px";

const glmTagsBtn = document.createElement("button");
glmTagsBtn.className = "glm-assistant-btn";
glmTagsBtn.innerHTML = "🏷️<br>Tag Suggester";
glmTagsBtn.onclick = () => openGLMAssistantModal('tags');

// Expander dipindahkan ke posisi kedua (posisi Translator sebelumnya)
const glmExpanderBtn = document.createElement("button");
glmExpanderBtn.className = "glm-assistant-btn";
glmExpanderBtn.innerHTML = "📝<br>Expander";
glmExpanderBtn.onclick = () => openGLMAssistantModal('expander');

glmBtnRow2.appendChild(glmTagsBtn);
glmBtnRow2.appendChild(glmExpanderBtn);

glmSection.appendChild(glmBtnRow1);
glmSection.appendChild(glmBtnRow2);
utilityTab.appendChild(glmSection);

            // Divider
            const divider = document.createElement("div");
            divider.style.height = "1px";
            divider.style.backgroundColor = colors.borderColor;
            divider.style.margin = "16px 0";
            utilityTab.appendChild(divider);

            // Existing utility functions
            const utilityBtnRow1 = document.createElement("div");
            utilityBtnRow1.className = "utility-button-row";
            utilityBtnRow1.style.display = "flex";
            utilityBtnRow1.style.gap = "6px";
            utilityBtnRow1.style.marginBottom = "8px";
            if (isMobile) {
                utilityBtnRow1.style.flexDirection = "column";
                utilityBtnRow1.style.width = "100%";
                utilityBtnRow1.style.overflow = "visible";
            }

            danbooruBtn = document.createElement("button");
            danbooruBtn.textContent = t('danbooru');
            danbooruBtn.className = "nai-responsive-button";
            Object.assign(danbooruBtn.style, {
                flex: "1",
                padding: isMobile ? "12px" : "6px",
                borderRadius: "6px",
                border: "none",
                background: colors.buttonBackground,
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                minHeight: isMobile ? "44px" : "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                visibility: "visible",
                opacity: "1"
            });
            danbooruBtn.onclick = () => {
                const idStr = prompt(t('danbooruPrompt', lastId));
                if (!idStr) return;
                if (!/^\d+$/.test(idStr)) {
                    showNotification(t('danbooruInvalidId'), 'error');
                    return;
                }
                const id = parseInt(idStr, 10);
                lastId = idStr; localStorage.setItem(LAST_ID_KEY, idStr);
                showNotification(t('danbooruFetching', id), 'info');
                fetch(`https://danbooru.donmai.us/posts/${id}.json`)
                    .then(r => r.json())
                    .then(data => {
                        if (!data) {
                            showNotification(t('danbooruError', "No data"), 'error');
                            return;
                        }

                        let allTags = [];
                        const isCopyrightBlacklisted = blacklistedCategories.includes('DBCOPYRIGHT');
                        const isCharacterBlacklisted = blacklistedCategories.includes('DBCHARACTER');
                        if (!isCharacterBlacklisted && data.tag_string_character) {
                            const characterTags = data.tag_string_character.split(' ').map(tag => tag.replace(/_/g, ' '));
                            allTags.push(...characterTags);
                        }

                        if (!isCopyrightBlacklisted && data.tag_string_copyright) {
                            const copyrightTags = data.tag_string_copyright.split(' ').map(tag => tag.replace(/_/g, ' '));
                            allTags.push(...copyrightTags);
                        }
                        if (data.tag_string_general) {
                            const generalTags = data.tag_string_general.split(' ').map(tag => tag.replace(/_/g, ' '));
                            let filteredGeneralTags = generalTags;
                            if (blacklistTags.length > 0) {
                                filteredGeneralTags = generalTags.filter(t => !blacklistTags.includes(t.toLowerCase()));
                            }
                            allTags.push(...filteredGeneralTags);
                        }

                        const tagsString = allTags.join(', ');

                        showNotification(t('danbooruApplying', id), 'info');
                        if (!applyTextToEditor(tagsString, status)) {
                            showNotification(t('danbooruApplyFail'), 'error');
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        showNotification(t('danbooruError', err.message || "Network error"), 'error');
                    });
            };

            e621Btn = document.createElement("button");
            e621Btn.textContent = t('e621');
            e621Btn.className = "nai-responsive-button";
            Object.assign(e621Btn.style, {
                flex: "1",
                padding: isMobile ? "12px" : "6px",
                borderRadius: "6px",
                border: "none",
                background: colors.buttonBackground,
                color: "white",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "12px",
                minHeight: isMobile ? "44px" : "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                visibility: "visible",
                opacity: "1"
            });
            e621Btn.onclick = () => {
                const idStr = prompt(t('e621Prompt', lastE621Id));
                if (!idStr) return;
                if (!/^\d+$/.test(idStr)) {
                    showNotification(t('e621InvalidId'), 'error');
                    return;
                }
                const id = parseInt(idStr, 10);
                lastE621Id = idStr; localStorage.setItem(LAST_E621_ID_KEY, idStr);
                showNotification(t('e621Fetching', id), 'info');
                fetch(`https://e621.net/posts/${id}.json`)
                    .then(r => r.json())
                    .then(data => {
                        if (!data || !data.post) {
                            showNotification(t('e621Error', "No data"), 'error');
                            return;
                        }
                        const post = data.post;
                        const tags = post.tags || {};

                        let allTags = [];
                        const isCopyrightBlacklisted = blacklistedCategories.includes('E621COPYRIGHT');
                        const isCharacterBlacklisted = blacklistedCategories.includes('E621CHARACTER');
                        const isSpeciesBlacklisted = blacklistedCategories.includes('E621SPECIES');
                        if (!isCharacterBlacklisted && tags.character) {
                            const characterTags = tags.character.map(tag => tag.replace(/_/g, ' '));
                            allTags.push(...characterTags);
                        }

                        if (!isCopyrightBlacklisted && tags.copyright) {
                            const copyrightTags = tags.copyright.map(tag => tag.replace(/_/g, ' '));
                            allTags.push(...copyrightTags);
                        }

                        if (!isSpeciesBlacklisted && tags.species) {
                            const speciesTags = tags.species.map(tag => tag.replace(/_/g, ' '));
                            allTags.push(...speciesTags);
                        }
                        if (tags.general) {
                            const generalTags = tags.general.map(tag => tag.replace(/_/g, ' '));
                            let filteredGeneralTags = generalTags;
                            if (blacklistTags.length > 0) {
                                filteredGeneralTags = generalTags.filter(t => !blacklistTags.includes(t.toLowerCase()));
                            }
                            allTags.push(...filteredGeneralTags);
                        }

                        const tagsString = allTags.join(', ');

                        showNotification(t('e621Applying', id), 'info');
                        if (!applyTextToEditor(tagsString, status)) {
                            showNotification(t('e621ApplyFail'), 'error');
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        showNotification(t('e621Error', err.message || "Network error"), 'error');
                    });
            };

            utilityBtnRow1.appendChild(danbooruBtn);
            utilityBtnRow1.appendChild(e621Btn);
            utilityTab.appendChild(utilityBtnRow1);

            const utilityBtnRow2 = document.createElement("div");
            utilityBtnRow2.style.display = "flex";
            utilityBtnRow2.style.gap = "6px";
            utilityBtnRow2.style.marginBottom = "8px";
            if (isMobile) utilityBtnRow2.style.flexDirection = "column";

            backupBtn = document.createElement("button");
            backupBtn.textContent = t('fullBackup');
            backupBtn.className = "nai-responsive-button";
            Object.assign(backupBtn.style, {
                flex: "1", padding: isMobile ? "12px" : "6px", borderRadius: "6px", border: "none",
                background: colors.buttonBackground, color: "white", cursor: "pointer", fontSize: isMobile ? "14px" : "12px",
                minHeight: isMobile ? "44px" : "auto"
            });
            backupBtn.onclick = () => {
                const data = { profiles, blacklistTags, globalVariables, wildcards, wildcardRemaining, characterDatabase, imageSettings, watermarkSettings, watermarkEnabled, watermarkType, watermarkImage, watermarkImageSize, glmApiKey, version: "NAIPM7" };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `nai-profiles-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showNotification(t('backupSaved'), 'success');
            };

            restoreBtn = document.createElement("button");
            restoreBtn.textContent = t('fullRestore');
            restoreBtn.className = "nai-responsive-button";
            Object.assign(restoreBtn.style, {
                flex: "1", padding: isMobile ? "12px" : "6px", borderRadius: "6px", border: "none",
                background: colors.buttonBackground, color: "white", cursor: "pointer", fontSize: isMobile ? "14px" : "12px",
                minHeight: isMobile ? "44px" : "auto"
            });
            restoreBtn.onclick = () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".json";
                input.onchange = () => {
                    const file = input.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const rawData = reader.result;
                            let data;
                            try {
                                data = JSON.parse(rawData);
                            } catch (e) {
                                showNotification(t('restoreInvalid'), 'error');
                                return;
                            }
                            let importedProfiles = [];
                            let importedBlacklist = [];
                            let importedGlobalVars = {};
                            let importedWildcards = {};
                            let importedWildcardRemaining = {};
                            let importedCharDB = {};
                            let importedImageSettings = {};
                            let importedWatermarkSettings = {};
                            let importedWatermarkEnabled = false;
                            let importedWatermarkType = "text";
                            let importedWatermarkImage = null;
                            let importedWatermarkImageSize = 100;
                            let importedGlmApiKey = "";

                            if (Array.isArray(data)) {
                                importedProfiles = data
                                    .filter(p => p && p.name)
                                    .map(p => ({
                                        name: p.name,
                                        positive: p.content || "",
                                        negative: "",
                                        characters: [],
                                        steps: p.steps || 28,
                                        guidance: p.guidance || 5.0
                                    }));
                                showNotification(t('restoreLegacy'), 'info');

                            } else if (data.version && data.version.startsWith("2.")) {
                                if (Array.isArray(data.profiles)) {
                                    importedProfiles = data.profiles.map(p => ({
                                        name: p.name,
                                        positive: p.content || p.positive || "",
                                        negative: p.negative || "",
                                        characters: Array.isArray(p.characters) ? p.characters : [],
                                        steps: p.steps || 28,
                                        guidance: p.guidance || 5.0
                                    }));
                                }
                                if (Array.isArray(data.blacklist)) {
                                    importedBlacklist = data.blacklist.map(t => t.trim()).filter(t => t);
                                }
                                if (typeof data.globalVariables === "object" && data.globalVariables !== null) {
                                    importedGlobalVars = { ...data.globalVariables };
                                }
                                if (typeof data.wildcards === "object" && data.wildcards !== null) {
                                    importedWildcards = { ...data.wildcards };
                                }
                                if (data.lastProfile) {
                                    setLastProfile(data.lastProfile);
                                }
                                showNotification(t('restoreSuccess'), 'success');

                            } else if (data.profiles && Array.isArray(data.profiles)) {
                                importedProfiles = data.profiles;
                                if (Array.isArray(data.blacklistTags)) {
                                    importedBlacklist = data.blacklistTags;
                                }
                                if (typeof data.globalVariables === "object") {
                                    importedGlobalVars = data.globalVariables;
                                }
                                if (typeof data.wildcards === "object") {
                                    importedWildcards = data.wildcards;
                                }
                                if (typeof data.wildcardRemaining === "object") {
                                    importedWildcardRemaining = data.wildcardRemaining;
                                }
                                if (typeof data.characterDatabase === "object") {
                                    importedCharDB = data.characterDatabase;
                                }
                                if (typeof data.imageSettings === "object") {
                                    importedImageSettings = data.imageSettings;
                                }
                                if (typeof data.watermarkSettings === "object") {
                                    importedWatermarkSettings = data.watermarkSettings;
                                }
                                if (typeof data.watermarkEnabled === "boolean") {
                                    importedWatermarkEnabled = data.watermarkEnabled;
                                }
                                if (typeof data.watermarkType === "string") {
                                    importedWatermarkType = data.watermarkType;
                                }
                                if (typeof data.watermarkImage === "string") {
                                    importedWatermarkImage = data.watermarkImage;
                                }
                                if (typeof data.watermarkImageSize === "number") {
                                    importedWatermarkImageSize = data.watermarkImageSize;
                                }
                                if (typeof data.glmApiKey === "string") {
                                    importedGlmApiKey = data.glmApiKey;
                                }
                                if (typeof data.enableNotifications === "boolean") {
                                    enableNotifications = data.enableNotifications;
                                    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(enableNotifications));
                                }
                                showNotification(t('restoreSuccess'), 'success');
                            } else {
                                showNotification(t('restoreInvalid'), 'error');
                                return;
                            }

                            importedProfiles = importedProfiles
                                .filter(p => p && p.name)
                                .map(p => ({
                                    name: p.name,
                                    positive: p.positive || p.content || "",
                                    negative: p.negative || "",
                                    characters: Array.isArray(p.characters) ? p.characters : [],
                                    steps: p.steps || 28,
                                    guidance: p.guidance || 5.0
                                }));

                            profiles = importedProfiles;
                            blacklistTags = importedBlacklist;
                            globalVariables = importedGlobalVars;
                            wildcards = importedWildcards;
                            wildcardRemaining = importedWildcardRemaining;
                            characterDatabase = importedCharDB;
                            glmApiKey = importedGlmApiKey;
                            localStorage.setItem(GLM_API_KEY_KEY, glmApiKey);

                            if (Object.keys(importedImageSettings).length > 0) {
                                imageSettings = importedImageSettings;
                                saveImageSettings();
                            }

                            if (Object.keys(importedWatermarkSettings).length > 0) {
                                watermarkSettings = importedWatermarkSettings;
                                watermarkEnabled = importedWatermarkEnabled;
                                watermarkType = importedWatermarkType;
                                watermarkImage = importedWatermarkImage;
                                watermarkImageSize = importedWatermarkImageSize;
                                saveWatermarkSettings();
                            }

                            saveToStorage();
                            updateSelectOptions(select);

                            if (profiles.length > 0) {
                                const first = profiles[0];
                                taPositive.value = first.positive || "";
                                taNegative.value = first.negative || "";
                                if (panelStepsInput) panelStepsInput.value = first.steps || 28;
                                if (panelGuidanceInput) panelGuidanceInput.value = first.guidance || 5.0;
                                updateCharListUI();
                                updateCharDBUI();
                            }

                        } catch (e) {
                            console.error("Restore error:", e);
                            showNotification(t('restoreInvalid'), 'error');
                        }
                    };
                    reader.readAsText(file);
                };
                input.click();
            };

            utilityBtnRow2.appendChild(backupBtn);
            utilityBtnRow2.appendChild(restoreBtn);
            utilityTab.appendChild(utilityBtnRow2);

            tabContent.appendChild(utilityTab);

            // Settings Tab with GLM API Key
            const settingsTab = document.createElement("div");
            settingsTab.id = "tab-settings";
            settingsTab.className = "tab-content";
            settingsTab.style.display = "none";

            // GLM API Settings Section
            const glmApiSection = document.createElement("div");
            glmApiSection.style.marginBottom = "16px";
            glmApiSection.style.padding = "12px";
            glmApiSection.style.border = `1px solid ${colors.borderColor}`;
            glmApiSection.style.borderRadius = "8px";
            glmApiSection.style.backgroundColor = colors.inputBackground;

            const glmApiTitle = document.createElement("h3");
            glmApiTitle.textContent = t('glmApiSettings');
            glmApiTitle.style.margin = "0 0 12px 0";
            glmApiTitle.style.fontSize = "14px";
            glmApiTitle.style.fontWeight = "bold";
            glmApiTitle.style.color = colors.color;

            const glmApiInputContainer = document.createElement("div");
            glmApiInputContainer.style.marginBottom = "8px";

            const glmApiLabel = document.createElement("label");
            glmApiLabel.textContent = t('glmApiKeyLabel');
            glmApiLabel.style.display = "block";
            glmApiLabel.style.fontSize = "13px";
            glmApiLabel.style.marginBottom = "4px";
            glmApiLabel.style.opacity = "0.9";

            const glmApiInput = document.createElement("input");
            glmApiInput.type = "password";
            glmApiInput.placeholder = t('glmApiKeyPlaceholder');
            glmApiInput.value = glmApiKey;
            Object.assign(glmApiInput.style, {
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: `1px solid ${colors.borderColor}`,
                background: colors.background,
                color: colors.inputColor,
                fontSize: "13px",
                boxSizing: "border-box"
            });

            glmApiInput.addEventListener('input', (e) => {
                glmApiKey = e.target.value.trim();
                localStorage.setItem(GLM_API_KEY_KEY, glmApiKey);
            });

            const glmApiDesc = document.createElement("div");
            glmApiDesc.textContent = "Get your API key from https://open.bigmodel.cn/";
            glmApiDesc.style.fontSize = "11px";
            glmApiDesc.style.opacity = "0.7";
            glmApiDesc.style.marginTop = "4px";

            glmApiInputContainer.appendChild(glmApiLabel);
            glmApiInputContainer.appendChild(glmApiInput);
            glmApiInputContainer.appendChild(glmApiDesc);

            glmApiSection.appendChild(glmApiTitle);
            glmApiSection.appendChild(glmApiInputContainer);

            settingsTab.appendChild(glmApiSection);

            // Divider
            const settingsDivider = document.createElement("div");
            settingsDivider.style.height = "1px";
            settingsDivider.style.backgroundColor = colors.borderColor;
            settingsDivider.style.margin = "16px 0";
            settingsTab.appendChild(settingsDivider);

            // Existing settings buttons
            const settingsBtn = document.createElement("button");
            settingsBtn.textContent = t('settingsBlacklist');
            settingsBtn.className = "nai-responsive-button";
            Object.assign(settingsBtn.style, {
                width: "100%", padding: isMobile ? "12px" : "6px", borderRadius: "6px", border: "none",
                background: colors.buttonBackground, color: "white", cursor: "pointer", fontSize: isMobile ? "14px" : "12px",
                minHeight: isMobile ? "44px" : "auto", marginBottom: "8px"
            });
            settingsBtn.onclick = () => {
                if (document.getElementById('nai-settings-modal')) return;
                const colors = getThemeColors();
                const modal = document.createElement('div');
                modal.id = 'nai-settings-modal';
                Object.assign(modal.style, {
                    position: 'fixed', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : '500px', maxWidth: '90vw',
                    background: colors.background, color: colors.color,
                    border: `1px solid ${colors.borderColor}`, borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: '20000',
                    padding: '0', fontFamily: 'sans-serif', boxSizing: 'border-box',
                    maxHeight: '80vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                });

                const checkboxStyle = document.createElement('style');
                checkboxStyle.textContent = `
                    .custom-checkbox {
                        position: relative;
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        margin-right: 8px;
                        vertical-align: middle;
                    }

                    .custom-checkbox input {
                        opacity: 0;
                        width: 0;
                        height: 0;
                        position: absolute;
                    }

                    .checkmark {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 20px;
                        width: 20px;
                        background-color: ${colors.inputBackground};
                        border: 1px solid ${colors.borderColor};
                        border-radius: 4px;
                    }

                    .custom-checkbox:hover input ~ .checkmark {
                        background-color: ${colors.buttonHover};
                    }

                    .custom-checkbox input:checked ~ .checkmark {
                        background-color: ${colors.buttonBackground};
                    }

                    .checkmark:after {
                        content: "";
                        position: absolute;
                        display: none;
                    }

                    .custom-checkbox input:checked ~ .checkmark:after {
                        display: block;
                    }

                    .custom-checkbox .checkmark:after {
                        left: 7px;
                        top: 3px;
                        width: 5px;
                        height: 10px;
                        border: solid white;
                        border-width: 0 2px 2px 0;
                        transform: rotate(45deg);
                    }
                `;
                document.head.appendChild(checkboxStyle);

                let languageOptions = '';
                Object.entries(SUPPORTED_LANGUAGES).forEach(([code, name]) => {
                    const selected = code === currentLanguage ? 'selected' : '';
                    languageOptions += `<option value="${code}" ${selected}>${name}</option>`;
                });

                modal.innerHTML = `
                    <div style="padding:20px 20px 0 20px;">
                        <div style="font-weight:bold; font-size:16px; margin-bottom:16px;">${t('settingsBlacklist')}</div>
                    </div>

                    <div id="settings-content" style="flex:1; overflow-y:auto; padding:0 20px;">
                        <!-- General Blacklist -->
                        <div style="margin-bottom:16px;">
                            <div style="font-weight:bold; margin-bottom:8px;">${t('blacklistTitle')} (General Tags)</div>
                            <div style="font-size:12px; opacity:0.8; margin-bottom:8px;">${t('blacklistDesc')}</div>
                            <textarea id="blacklist" rows="3" placeholder="${t('blacklistPlaceholder')}" style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor}; background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px; resize:vertical;">${blacklistTags.join(', ')}</textarea>
                        </div>

                        <!-- Category Blacklist -->
                        <div style="margin-bottom:16px;">
                            <div style="font-weight:bold; margin-bottom:8px;">Category Blacklist</div>
                            <div style="font-size:12px; opacity:0.8; margin-bottom:8px;">Enter category codes to blacklist entire categories. Separate with commas.</div>
                            <div style="margin-bottom:8px; font-size:11px; opacity:0.7;">
                                Available codes:<br>
                                • DBCOPYRIGHT - Blacklist all copyright tags from Danbooru<br>
                                • DBCHARACTER - Blacklist all character tags from Danbooru<br>
                                • E621COPYRIGHT - Blacklist all copyright tags from E621<br>
                                • E621CHARACTER - Blacklist all character tags from E621<br>
                                • E621SPECIES - Blacklist all species tags from E621
                            </div>
                            <textarea id="blacklisted-categories" rows="3" placeholder="DBCOPYRIGHT, E621SPECIES" style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor}; background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px; resize:vertical;">${blacklistedCategories.join(', ')}</textarea>
                        </div>

                        <!-- Other settings content -->
                        <div style="margin-bottom:16px;">
                            <div style="font-weight:bold; margin-bottom:8px;">${t('globalVarsTitle')}</div>
                            <div style="font-size:12px; opacity:0.8; margin-bottom:8px;">${t('globalVarsDesc')}</div>
                            <textarea id="global-vars" rows="4" style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor}; background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px; resize:vertical;">${Object.entries(globalVariables).map(([k, v]) => `${k}=${v}`).join('\n')}</textarea>
                        </div>

                        <div style="margin-bottom:16px;">
                            <div style="font-weight:bold; margin-bottom:8px;">${t('wildcardsTitle')}</div>
                            <div style="font-size:12px; opacity:0.8; margin-bottom:8px;">${t('wildcardsDesc')}</div>
                            <textarea id="wildcards" rows="4" style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor}; background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px; resize:vertical;">${Object.entries(wildcards).map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(', ') : v}`).join('\n')}</textarea>
                        </div>

                        <!-- Moved elements to top -->
                        <div style="margin-bottom:16px;">
                            <div style="margin:16px 0; display:flex; align-items:center; gap:8px;">
                                <label for="enable-notifications" style="font-size:14px; cursor: pointer; white-space: nowrap; display: flex; align-items: center;">
                                    <div class="custom-checkbox">
                                        <input type="checkbox" id="enable-notifications">
                                        <span class="checkmark"></span>
                                    </div>
                                    🔔 Notifications / 通知
                                </label>
                            </div>

                            <div style="margin:16px 0; display:flex; align-items:center; gap:8px;">
                                <label for="enable-free-variables" style="font-size:14px; cursor: pointer; white-space: nowrap; display: flex; align-items: center;">
                                    <div class="custom-checkbox">
                                        <input type="checkbox" id="enable-free-variables">
                                        <span class="checkmark"></span>
                                    </div>
                                    ${t('promptForUndefVars')}
                                </label>
                            </div>

                            <div style="margin:16px 0;">
                                <div style="font-weight:bold; margin-bottom:8px;">${t('languageSettings')}</div>
                                <div style="font-size:12px; opacity:0.8; margin-bottom:8px;">${t('languageDesc')}</div>
                                <select id="language-select" style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor}; background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;">
                                    ${languageOptions}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style="padding:16px 20px 20px 20px; border-top: 1px solid ${colors.borderColor}; display:flex; gap:8px; justify-content:flex-end;">
                        <button id="cancel-settings" style="padding:8px 16px; background:${colors.deleteBackground}; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">${t('cancel')}</button>
                        <button id="save-settings" style="padding:8px 16px; background:${colors.buttonBackground}; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">${t('apply')}</button>
                    </div>
                `;
                document.body.appendChild(modal);

                const cancelBtn = modal.querySelector('#cancel-settings');
                const saveBtn = modal.querySelector('#save-settings');
                const notificationCheckbox = modal.querySelector('#enable-notifications');
                const languageSelect = modal.querySelector('#language-select');
                const freeVarsCheckbox = modal.querySelector('#enable-free-variables');

                notificationCheckbox.checked = enableNotifications;
                freeVarsCheckbox.checked = freeVariablesEnabled;

                cancelBtn.onclick = () => {
                    document.body.removeChild(modal);
                    if (document.head.contains(checkboxStyle)) {
                        document.head.removeChild(checkboxStyle);
                    }
                };

                saveBtn.onclick = () => {
                    const blacklistedCategoriesText = modal.querySelector('#blacklisted-categories').value;
                    const globalVarsText = modal.querySelector('#global-vars').value;
                    const wildcardsText = modal.querySelector('#wildcards').value;
                    const blacklistText = modal.querySelector('#blacklist').value;
                    const notificationsEnabled = notificationCheckbox.checked;
                    const freeVarsEnabledSetting = freeVarsCheckbox.checked;
                    const selectedLanguage = languageSelect.value;

                    if (selectedLanguage !== currentLanguage) {
                        changeLanguage(selectedLanguage);
                        return;
                    }

                    try {
                        const newGlobalVars = {};
                        globalVarsText.split('\n').forEach(line => {
                            const eq = line.indexOf('=');
                            if (eq > 0) {
                                const key = line.substring(0, eq).trim();
                                const value = line.substring(eq + 1).trim();
                                if (key) newGlobalVars[key] = value;
                            }
                        });
                        globalVariables = newGlobalVars;

                        const newWildcards = {};
                        wildcardsText.split('\n').forEach(line => {
                            const eq = line.indexOf('=');
                            if (eq > 0) {
                                const key = line.substring(0, eq).trim();
                                const value = line.substring(eq + 1).trim();
                                if (key) {
                                    newWildcards[key] = value.split(',').map(v => v.trim()).filter(v => v);
                                }
                            }
                        });
                        wildcards = newWildcards;

                        blacklistTags = blacklistText.split(',').map(t => t.trim()).filter(t => t);
                        blacklistedCategories = blacklistedCategoriesText.split(',').map(t => t.trim()).filter(t => t);

                        saveToStorage();
                        showNotification(t('blacklistSaved', blacklistTags.length), 'success');

                        enableNotifications = notificationsEnabled;
                        localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(enableNotifications));

                        freeVariablesEnabled = freeVarsEnabledSetting;
                        localStorage.setItem(FREE_VARIABLES_KEY, JSON.stringify(freeVariablesEnabled));
                    } catch (e) {
                        console.error(e);
                        showNotification(t('errorSavingSettings'), 'error');
                    }
                    document.body.removeChild(modal);
                    if (document.head.contains(checkboxStyle)) {
                        document.head.removeChild(checkboxStyle);
                    }
                };

                modal.addEventListener('click', e => {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                        if (document.head.contains(checkboxStyle)) {
                            document.head.removeChild(checkboxStyle);
                        }
                    }
                });
            };
            settingsTab.appendChild(settingsBtn);

            // Keyboard shortcuts - HANYA di desktop
            if (!isMobile) {
                const shortcutsBtn = document.createElement("button");
                shortcutsBtn.textContent = t('keyboardShortcuts');
                shortcutsBtn.className = "nai-responsive-button";
                Object.assign(shortcutsBtn.style, {
                    width: "100%", padding: isMobile ? "12px" : "6px", borderRadius: "6px", border: "none",
                    background: colors.buttonBackground, color: "white", cursor: "pointer", fontSize: isMobile ? "14px" : "12px",
                    minHeight: isMobile ? "44px" : "auto"
                });
                shortcutsBtn.onclick = () => openKeyboardShortcutsModal();
                settingsTab.appendChild(shortcutsBtn);
            }

            // Watermark settings - Muncul di desktop DAN mobile
            const watermarkBtn = document.createElement("button");
            watermarkBtn.textContent = t('watermarkSettings');
            watermarkBtn.className = "nai-responsive-button";
            Object.assign(watermarkBtn.style, {
                width: "100%", padding: isMobile ? "12px" : "6px", borderRadius: "6px", border: "none", marginTop: "8px",
                background: colors.buttonBackground, color: "white", cursor: "pointer", fontSize: isMobile ? "14px" : "12px",
                minHeight: isMobile ? "44px" : "auto"
            });
            watermarkBtn.onclick = () => openWatermarkSettingsModal();
            settingsTab.appendChild(watermarkBtn);

            tabContent.appendChild(settingsTab);

            status = document.createElement("div");
            Object.assign(status.style, {
                fontSize: isMobile ? "12px" : "11px", marginTop: "8px", textAlign: "center",
                minHeight: "16px", opacity: "0.7"
            });
            panelContent.appendChild(status);

            panel.appendChild(panelContent);

            function createIconButton(icon, title, onClick) {
                const btn = document.createElement("button");
                btn.innerHTML = icon;
                btn.title = title;
                Object.assign(btn.style, {
                    padding: "6px",
                    borderRadius: "6px",
                    border: "none",
                    background: colors.buttonBackground,
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                });
                btn.onclick = onClick;
                return btn;
            }

            minimizeBtn.onclick = () => {
                const content = document.getElementById("panel-content");
                if (content.style.display === "none") {
                    content.style.display = "block";
                    minimizeBtn.innerHTML = "−";
                    panel.style.height = "auto";
                } else {
                    content.style.display = "none";
                    minimizeBtn.innerHTML = "+";
                    panel.style.height = "40px";
                }
            };

            select.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                const existingMenu = document.getElementById("profile-context-menu");
                if (existingMenu) {
                    document.body.removeChild(existingMenu);
                }
                const contextMenu = document.createElement("div");
                contextMenu.id = "profile-context-menu";
                Object.assign(contextMenu.style, {
                    position: "fixed",
                    left: `${e.clientX}px`,
                    top: `${e.clientY}px`,
                    backgroundColor: colors.inputBackground,
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: "6px",
                    padding: "4px 0",
                    zIndex: "1000",
                    minWidth: "150px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
                });
                const options = [
                    { text: t('saveProfile'), action: () => {
                        const name = select.value;
                        if (!name) {
                            showNotification(t('pickProfileFirst'), 'error');
                            return;
                        }
                        const profile = profiles.find(p => p.name === name);
                        if (!profile) return;
                        profile.positive = taPositive.value.trim();
                        profile.negative = taNegative.value.trim();
                        if (panelStepsInput) profile.steps = parseInt(panelStepsInput.value) || 28;
                        if (panelGuidanceInput) profile.guidance = parseFloat(panelGuidanceInput.value) || 5.0;

                        saveToStorage();
                        showNotification(t('savedProfile', name), 'success');
                    } },
                    { text: t('renameProfile'), action: () => {
                        const name = select.value;
                        if (!name) {
                            showNotification(t('pickProfileFirst'), 'error');
                            return;
                        }
                        const newName = prompt(t('renamePrompt'), name);
                        if (!newName || newName === name) return;
                        if (profiles.some(p => p.name === newName)) {
                            showNotification(t('renameTaken', newName), 'error');
                            return;
                        }
                        const profile = profiles.find(p => p.name === name);
                        if (profile) {
                            profile.name = newName;
                            saveToStorage();
                            updateSelectOptions(select, newName);
                            if (lastProfileName === name) setLastProfile(newName);
                            showNotification(t('renamed', name, newName), 'success');
                        }
                    } },
                    { text: t('deleteProfile'), action: () => {
                        const name = select.value;
                        if (!name) {
                            showNotification(t('pickProfileFirst'), 'error');
                            return;
                        }
                        if (!confirm(t('confirmDelete', name))) return;
                        const idx = profiles.findIndex(p => p.name === name);
                        if (idx !== -1) {
                            profiles.splice(idx, 1);
                            saveToStorage();
                            if (profiles.length === 0) {
                                updateSelectOptions(select);
                                taPositive.value = ""; taNegative.value = ""; charsList.innerHTML = "";
                                showNotification(t('deletedNone', name), 'info');
                            } else {
                                const newSel = profiles[Math.max(0, idx - 1)].name;
                                updateSelectOptions(select, newSel);
                                if (lastProfileName === name) setLastProfile(newSel);
                                showNotification(t('deletedSwitched', name, newSel), 'info');
                            }
                        }
                    } },
                    { text: t('swapPosition'), action: () => {
                        const name = select.value;
                        if (!name) {
                            showNotification(t('pickProfileFirst'), 'error');
                            return;
                        }

                        const currentIndex = profiles.findIndex(p => p.name === name);
                        const input = prompt(t('swapPrompt'));
                        if (!input) return;

                        const targetIndex = parseInt(input) - 1;

                        if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= profiles.length) {
                            showNotification(t('invalidPos'), 'error');
                            return;
                        }

                        if (currentIndex === targetIndex) {
                            showNotification(t('alreadyThere'), 'info');
                            return;
                        }
                        [profiles[currentIndex], profiles[targetIndex]] = [profiles[targetIndex], profiles[currentIndex]];
                        saveToStorage();
                        updateSelectOptions(select, name);

                        showNotification(t('swapped', currentIndex + 1, targetIndex + 1), 'success');
                    } }
                ];

                options.forEach(option => {
                    const menuItem = document.createElement("div");
                    menuItem.textContent = option.text;
                    Object.assign(menuItem.style, {
                        padding: "8px 12px",
                        cursor: "pointer"
                    });
                    menuItem.onmouseover = () => { menuItem.style.backgroundColor = colors.buttonHover; };
                    menuItem.onmouseout = () => { menuItem.style.backgroundColor = "transparent"; };
                    menuItem.onclick = () => {
                        option.action();
                        document.body.removeChild(contextMenu);
                    };
                    contextMenu.appendChild(menuItem);
                });

                document.body.appendChild(contextMenu);
                document.addEventListener("click", function closeContextMenu() {
                    if (document.getElementById("profile-context-menu")) {
                        document.body.removeChild(contextMenu);
                    }
                    document.removeEventListener("click", closeContextMenu);
                });
            });

            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.trim().toLowerCase();
                if (!searchTerm) {
                    updateSelectOptions(select, select.value);
                    return;
                }
                let filteredProfiles = profiles.filter(p =>
                    p.name.toLowerCase().includes(searchTerm) ||
                    (p.positive && p.positive.toLowerCase().includes(searchTerm)) ||
                    (p.negative && p.negative.toLowerCase().includes(searchTerm))
                );

                updateSelectOptions(select, null, filteredProfiles);
            });

            select.addEventListener("change", () => {
                const name = select.value;
                if (!name) return;
                const profile = profiles.find(p => p.name === name);
                if (!profile) return;
                taPositive.value = profile.positive || "";
                taNegative.value = profile.negative || "";
                const profileSteps = profile.steps !== undefined ? profile.steps : 28;
                const profileGuidance = profile.guidance !== undefined ? profile.guidance : 5.0;
                let currentSteps = 28;
                let currentGuidance = 5.0;
                const allContainers = document.querySelectorAll('.image__ASDetail-sc-5d63727e-15');
                allContainers.forEach(container => {
                    if (container.textContent.includes('Steps')) {
                        const input = container.querySelector('input[type="number"][step="1"]');
                        if (input) currentSteps = parseInt(input.value) || 28;
                    } else if (container.textContent.includes('Guidance')) {
                        const input = container.querySelector('input[type="number"][step="0.1"]');
                        if (input) currentGuidance = parseFloat(input.value) || 5.0;
                    }
                });
                if (panelStepsInput) {
                    panelStepsInput.value = profileSteps;
                    panelStepsInput.setAttribute('value', profileSteps);
                }
                if (panelGuidanceInput) {
                    panelGuidanceInput.value = profileGuidance;
                    panelGuidanceInput.setAttribute('value', profileGuidance);
                }
                if (currentSteps !== profileSteps || currentGuidance !== profileGuidance) {
                    setTimeout(() => {
                        applyImageSettings();
                        showNotification(`✅ Auto-applied settings for profile: ${name}`, 'success');
                    }, 200);
                }

                updateCharListUI();
                updateCharDBUI();
                setLastProfile(name);
            });

            updateSelectOptions(select, lastProfileName);
            if (lastProfileName) {
                const profile = profiles.find(p => p.name === lastProfileName);
                if (profile) {
                    taPositive.value = profile.positive || "";
                    taNegative.value = profile.negative || "";
                    if (panelStepsInput) panelStepsInput.value = profile.steps !== undefined ? profile.steps : 28;
                    if (panelGuidanceInput) panelGuidanceInput.value = profile.guidance !== undefined ? profile.guidance : 5.0;

                    updateCharListUI();
                    updateCharDBUI();
                }
            }
            panel.style.display = "block";
            updatePanelPosition();
            showNotification(t('ready'), 'success');

            function updateQuickAddSelect(searchTerm = '') {
                const dbKeys = Object.keys(characterDatabase);
                const filteredKeys = dbKeys.filter(key =>
                    key.toLowerCase().includes(searchTerm.toLowerCase())
                );
                filteredKeys.sort((a, b) => a.localeCompare(b));

                quickAddSelect.innerHTML = '';
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select a character...';
                defaultOption.disabled = true;
                quickAddSelect.appendChild(defaultOption);

                if (filteredKeys.length === 0) {
                    const noOption = document.createElement('option');
                    noOption.value = '';
                    noOption.textContent = 'No characters found';
                    noOption.disabled = true;
                    quickAddSelect.appendChild(noOption);
                    return;
                }

                filteredKeys.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    quickAddSelect.appendChild(option);
                });
            }

            quickAddOverrideBtn.onclick = () => {
                const selectedCharName = quickAddSelect.value;
                if (!selectedCharName) {
                    showNotification('Please select a character first', 'error');
                    return;
                }

                const charPrompt = characterDatabase[selectedCharName];
                if (!charPrompt) {
                    showNotification('Character prompt not found', 'error');
                    return;
                }

                applyTextToEditor(charPrompt, status);
            };

            quickAddAppendBtn.onclick = () => {
                const selectedCharName = quickAddSelect.value;
                if (!selectedCharName) {
                    showNotification('Please select a character first', 'error');
                    return;
                }

                const charPrompt = characterDatabase[selectedCharName];
                if (!charPrompt) {
                    showNotification('Character prompt not found', 'error');
                    return;
                }

                applyTextToEditorAppend(charPrompt, status);
            };

            const originalUpdateCharDBUI = updateCharDBUI;
            updateCharDBUI = function(searchTerm) {
                originalUpdateCharDBUI(searchTerm);
                updateQuickAddSelect(searchTerm);
            };

            updateQuickAddSelect();
        }

        function updatePanelPosition() {
            if (!panel || !toggle) return;
            const toggleRect = toggle.getBoundingClientRect();
            let panelLeft = toggleRect.right + 10;
            let panelTop = toggleRect.top;

            if (isMobile) {
                panelLeft = (window.innerWidth - panel.offsetWidth) / 2;
                panelTop = (window.innerHeight - panel.offsetHeight) / 2;
                panelLeft = Math.max(10, Math.min(panelLeft, window.innerWidth - panel.offsetWidth - 10));
                panelTop = Math.max(10, Math.min(panelTop, window.innerHeight - panel.offsetHeight - 10));
            } else {
                if (panelLeft + 380 > window.innerWidth) panelLeft = toggleRect.left - 390;
                if (panelTop + 600 > window.innerHeight) panelTop = window.innerHeight - 610;
            }

            panel.style.left = `${panelLeft}px`;
            panel.style.top = `${panelTop}px`;
        }

        function updateCharListUI() {
            const name = select.value;
            const profile = profiles.find(p => p.name === name);
            if (!profile) {
                charsList.innerHTML = '';
                return;
            }
            charsList.innerHTML = '';
            if (profile.characters.length === 0) return;
            const colors = getThemeColors();
            const container = document.createElement('div');
            container.className = "char-list-container";
            container.style.maxHeight = isMobile ? '150px' : '120px';
            container.style.overflowY = 'auto';
            container.style.border = `1px solid ${colors.charListBorder}`;
            container.style.borderRadius = '6px';
            container.style.padding = '8px';
            container.style.marginBottom = '8px';
            container.style.backgroundColor = colors.charListBackground;
            profile.characters.forEach((char, idx) => {
                const item = document.createElement('div');
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.justifyContent = 'space-between';
                item.style.padding = isMobile ? '8px' : '6px 8px';
                item.style.background = colors.charItemBackground;
                item.style.borderRadius = '4px';
                item.style.marginBottom = '4px';
                item.style.fontSize = isMobile ? '14px' : '13px';
                item.style.color = colors.charItemColor;
                const hasVars = extractVariables(char.prompt || '').length > 0;
                const hasWildcards = extractWildcards(char.prompt || '').length > 0;
                const indicator = (hasVars || hasWildcards) ? ' 🔧' : '';
                item.innerHTML = `
                    <span title="${char.prompt}" class="nai-responsive-text"><strong>${char.name}</strong>${indicator}</span>
                    <div style="display:flex; gap:4px;">
                        <button class="edit-char" style="padding:2px 6px; background:${colors.buttonBackground}; color:white; border:none; border-radius:4px; font-size:11px; cursor:pointer;">✏️️️</button>
                        <button class="move-up" style="padding:2px 6px; background:#64748b; color:white; border:none; border-radius:4px; font-size:11px; cursor:pointer;">↑</button>
                        <button class="move-down" style="padding:2px 6px; background:#64748b; color:white; border:none; border-radius:4px; font-size:11px; cursor:pointer;">↓</button>
                        <button class="remove-char" style="padding:2px 6px; background:${colors.deleteBackground}; color:white; border:none; border-radius:4px; font-size:11px; cursor:pointer;">✕</button>
                    </div>
                `;
                container.appendChild(item);
            });
            charsList.appendChild(container);
            container.querySelectorAll('.edit-char').forEach((btn, i) => {
                btn.onclick = () => {
                    const profile = profiles.find(p => p.name === select.value);
                    if (profile) openCharacterModal(profile, i);
                };
            });
            container.querySelectorAll('.move-up').forEach((btn, i) => {
                btn.onclick = () => {
                    const profile = profiles.find(p => p.name === select.value);
                    if (profile && i > 0) {
                        [profile.characters[i], profile.characters[i-1]] = [profile.characters[i-1], profile.characters[i]];
                        saveToStorage();
                        updateCharListUI();
                        if (profile.characters.length > 0) {
                            insertCharacterPrompts(profile.characters, charWarning);
                        }
                        showNotification(t('orderUpdated'), 'success');
                    }
                };
            });
            container.querySelectorAll('.move-down').forEach((btn, i) => {
                btn.onclick = () => {
                    const profile = profiles.find(p => p.name === select.value);
                    if (profile && i < profile.characters.length - 1) {
                        [profile.characters[i], profile.characters[i+1]] = [profile.characters[i+1], profile.characters[i]];
                        saveToStorage();
                        updateCharListUI();
                        if (profile.characters.length > 0) {
                            insertCharacterPrompts(profile.characters, charWarning);
                        }
                        showNotification(t('orderUpdated'), 'success');
                    }
                };
            });
            container.querySelectorAll('.remove-char').forEach((btn, i) => {
                btn.onclick = () => {
                    const profile = profiles.find(p => p.name === select.value);
                    if (profile) {
                        const name = profile.characters[i].name;
                        profile.characters.splice(i, 1);
                        saveToStorage();
                        updateCharListUI();
                        if (profile.characters.length > 0) {
                            insertCharacterPrompts(profile.characters, charWarning);
                        } else {
                            applyProcessedCharacterPrompts([], charWarning);
                        }
                        showNotification(t('charDeletedFromProfile', name), 'info');
                    }
                };
            });
        }

        function openCharacterModal(profile, index = null) {
            if (document.getElementById('nai-character-modal')) return;
            const isNew = index === null;
            const character = isNew ? { name: '', prompt: '' } : profile.characters[index];
            const colors = getThemeColors();
            const modal = document.createElement('div');
            modal.id = 'nai-character-modal';
            Object.assign(modal.style, {
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', width: isMobile ? '90%' : '400px', maxWidth: '90vw',
                background: colors.background, color: colors.color,
                border: `1px solid ${colors.borderColor}`, borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: '20000',
                padding: '20px', fontFamily: 'sans-serif', boxSizing: 'border-box'
            });
            modal.innerHTML = `
                <div style="font-weight:bold; font-size:16px; margin-bottom:16px;">
                    ${isNew ? t('addCharacter') : t('editCharacter')}
                </div>
                <div style="margin-bottom:12px;"><label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">${t('charNameLabel')}</label><input type="text" id="char-name"
                           placeholder="${t('charNamePlaceholder')}"
                           value="${character.name}"
                           style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor};
                                  background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px;" /></div>
                <div style="margin-bottom:16px;"><label style="display:block; font-size:13px; margin-bottom:4px; opacity:0.9;">${t('charPromptLabel')}</label><textarea id="char-prompt" rows="4"
                              placeholder="${t('charPromptPlaceholder')}"
                              style="width:100%; padding:8px; border-radius:6px; border:1px solid ${colors.borderColor}; background:${colors.inputBackground}; color:${colors.inputColor}; font-size:13px; resize:vertical;">${character.prompt}</textarea></div>
                <div style="display:flex; gap:8px; justify-content:flex-end;">
                    <button id="cancel" style="padding:6px 12px; background:${colors.deleteBackground}; color:white; border:none; border-radius:6px; cursor:pointer;">${t('cancel')}</button>
                    <button id="save" style="padding:6px 12px; background:${colors.buttonBackground}; color:white; border:none; border-radius:6px; cursor:pointer;">${t('apply')}</button>
                </div>
            `;
            document.body.appendChild(modal);
            const nameInput = modal.querySelector('#char-name');
            const promptInput = modal.querySelector('#char-prompt');
            const saveBtn = modal.querySelector('#save');
            const cancelBtn = modal.querySelector('#cancel');
            saveBtn.onclick = () => {
                const name = nameInput.value.trim();
                const prompt = promptInput.value.trim();
                if (!name) {
                    showNotification(t('nameRequired'), 'error');
                    return;
                }
                if (!prompt) {
                    showNotification(t('promptRequired'), 'error');
                    return;
                }
                if (isNew) {
                    profile.characters.push({ name, prompt });
                } else {
                    profile.characters[index] = { name, prompt };
                }
                saveToStorage();
                updateCharListUI();
                if (profile.characters.length > 0) {
                    insertCharacterPrompts(profile.characters, charWarning);
                }
                document.body.removeChild(modal);
                showNotification(t('charUpdated', name), 'success');
            };
            cancelBtn.onclick = () => document.body.removeChild(modal);
            modal.addEventListener('click', e => { if (e.target === modal) document.body.removeChild(modal); });
        }

        document.body.appendChild(toggle);
        let searchVisible = false;
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            const isInInput = activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true'
            );
            if (isInInput && !e.ctrlKey && !e.altKey) return;
            if (e.key === 'Escape' && panel && panel.style.display === 'block') {
                if (searchDiv) {
                    searchVisible = (searchDiv.style.display !== 'none');
                }
                panel.style.display = 'none';
                return;
            }
            let shortcutMatched = false;
            for (const [action, shortcut] of Object.entries(keyboardShortcuts)) {
                if (
                    e.ctrlKey === !!shortcut.ctrl &&
                    e.altKey === !!shortcut.alt &&
                    e.shiftKey === !!shortcut.shift &&
                    e.key.toUpperCase() === shortcut.key.toUpperCase()
                ) {
                    shortcutMatched = true;
                    const hasConflict = checkShortcutConflict(shortcut);
                    if (hasConflict) {
                        showNotification(t('shortcutConflictWarning'), 'error');
                        e.preventDefault();
                        return;
                    }
                    e.preventDefault();

                    switch (action) {
                        case 'newProfile':
                            if (newBtn) newBtn.click();
                            break;
                        case 'saveProfile':
                            if (saveBtn) saveBtn.click();
                            break;
                        case 'renameProfile':
                            if (renameBtn) renameBtn.click();
                            break;
                        case 'deleteProfile':
                            if (deleteBtn) deleteBtn.click();
                            break;
                        case 'search':
                            if (!panel) {
                                createPanel();
                            }
                            if (panel.style.display === 'none') {
                                panel.style.display = 'block';
                                updatePanelPosition();
                                const profileTabBtn = Array.from(tabButtons.children).find(b => b.textContent === t('profileTab'));
                                if (profileTabBtn) {
                                    profileTabBtn.click();
                                }
                                if (searchDiv) {
                                    if (searchVisible) {
                                        searchDiv.style.display = 'block';
                                        if (searchInput) {
                                            searchInput.focus();
                                        }
                                    } else {
                                        searchDiv.style.display = 'none';
                                    }
                                }
                            } else {
                                if (searchDiv) {
                                    if (searchDiv.style.display === 'none') {
                                        searchDiv.style.display = 'block';
                                        searchVisible = true;
                                        if (searchInput) {
                                            searchInput.focus();
                                        }
                                    } else {
                                        searchDiv.style.display = 'none';
                                        searchVisible = false;
                                    }
                                }
                            }
                            break;
                        case 'override':
                            if (overrideBtn) overrideBtn.click();
                            break;
                        case 'append':
                            if (appendBtn) appendBtn.click();
                            break;
                        case 'addCharacter':
                            if (addCharBtn) addCharBtn.click();
                            break;
                        case 'addToDB':
                            if (addCharDBBtn) addCharDBBtn.click();
                            break;
                        case 'organize':
                            if (organizeCharDBBtn) organizeCharDBBtn.click();
                            break;
                        case 'characterTab':
                            if (panel && panel.style.display === 'none') {
                                panel.style.display = 'block';
                                updatePanelPosition();
                            }
                            if (characterTabBtn) characterTabBtn.click();
                            break;
                        case 'danbooru':
                            if (danbooruBtn) danbooruBtn.click();
                            break;
                        case 'e621':
                            if (e621Btn) e621Btn.click();
                            break;
                        case 'fullBackup':
                            if (backupBtn) backupBtn.click();
                            break;
                        case 'fullRestore':
                            if (restoreBtn) restoreBtn.click();
                            break;
                    }
                    break;
                }
            }
            if (!shortcutMatched) {
                if (e.ctrlKey && e.key >= '0' && e.key <= '9') {
                    e.preventDefault();
                    const profileIndex = e.key === '0' ? 9 : parseInt(e.key) - 1;

                    if (profileIndex < profiles.length) {
                        if (panel && panel.style.display === 'none') {
                            panel.style.display = 'block';
                            updatePanelPosition();
                        }
                        select.value = profiles[profileIndex].name;
                        const event = new Event('change');
                        select.dispatchEvent(event);

                        setTimeout(() => {
                            const profile = profiles[profileIndex];
                            if (profile.positive) {
                                applyTextToEditor(profile.positive, status);
                            }
                            if (profile.negative) {
                                applyTextToNegativeEditor(profile.negative, status);
                            }
                            if (profile.characters && profile.characters.length > 0) {
                                insertCharacterPrompts(profile.characters, charWarning);
                            }
                            showNotification(`✅ Applied profile #${profileIndex + 1}: ${profile.name}`, 'success');
                        }, 500);
                    } else {
                        showNotification(`❌ Profile #${profileIndex + 1} does not exist`, 'error');
                    }
                    return;
                }
            }
        });
    }

    function applyImageSettings() {
        const selectElement = document.querySelector("#nai-profiles-panel select");
        const name = selectElement ? selectElement.value : null;

        let steps, guidance;
        if (panelStepsInput && panelGuidanceInput) {
            steps = parseInt(panelStepsInput.value) || 28;
            guidance = parseFloat(panelGuidanceInput.value) || 5.0;
        } else {
            steps = imageSettings.steps;
            guidance = imageSettings.guidance;
        }
        let stepsInput = null;
        let guidanceInput = null;

        const allContainers = document.querySelectorAll('.image__ASDetail-sc-5d63727e-15');
        allContainers.forEach(container => {
            if (container.textContent.includes('Steps')) {
                stepsInput = container.querySelector('input[type="number"][step="1"]');
            } else if (container.textContent.includes('Guidance')) {
                guidanceInput = container.querySelector('input[type="number"][step="0.1"]');
            }
        });

        function simulateUserInteraction(input, value) {
            if (!input) return;
            const valueStr = String(value);
            input.focus();
            input.select();
            document.execCommand('insertText', false, '');
            for (let i = 0; i < valueStr.length; i++) {
                const char = valueStr[i];
                document.execCommand('insertText', false, char);
            }
            input.blur();
            setTimeout(() => {
            }, 100);
        }

        if (stepsInput) {
            simulateUserInteraction(stepsInput, steps);
        } else {
        }

        if (guidanceInput) {
            simulateUserInteraction(guidanceInput, guidance);
        } else {
            console.error("Could not find Guidance input element");
        }

        showNotification(t('imageSettingsApplied'), 'success');
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createPanelOnce);
    } else {
        createPanelOnce();
    }

    function compareVersions(v1, v2) {
        const a = v1.split('.').map(Number);
        const b = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
            const num1 = a[i] || 0;
            const num2 = b[i] || 0;
            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }
        return 0;
    }

    setTimeout(async () => {
        try {
            const res = await fetch('https://raw.githubusercontent.com/mikojiy/naipm-test/main/NAIPM.user.js?t=' + Date.now(), { cache: 'no-cache' });
            const text = await res.text();
            const match = text.match(/@version\s+([0-9.]+)/);
            if (!match) return;
            const latestVersion = match[1];
            const currentVersion = "7.0";
            const comparison = compareVersions(latestVersion, currentVersion);
            if (comparison > 0 && !document.getElementById('nai-update-notice')) {
                const notice = document.createElement('div');
                notice.id = 'nai-update-notice';
                Object.assign(notice.style, {
                    position: 'fixed',
                    top: '30px',
                    right: "30px",
                    zIndex: '99999',
                    background: '#1e40af',
                    color: 'white',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    maxWidth: '380px',
                    fontFamily: 'sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.5'
                });
                notice.innerHTML = `
                    <b>${t('updateNotice')}</b><br>
                    ${t('updateVersion', latestVersion)}<br>
                    <button id="update-now" style="
                        margin-top: 10px;
                        padding: 8px 14px;
                        background: white;
                        color: #1e40af;
                        border: none;
                        border-radius: 8px;
                        font-weight: bold;
                        cursor: pointer;
                    ">${t('updateButton')}</button>
                `;
                document.body.appendChild(notice);
                document.getElementById('update-now').onclick = () => {
                    window.open('https://raw.githubusercontent.com/mikojiy/naipm-test/main/NAIPM.user.js', '_blank');
                    notice.remove();
                };
            }
        } catch (e) {
            console.warn('Auto update check failed:', e);
        }
    }, 3000);

    window.addEventListener('popstate', () => {
        setTimeout(() => {
            const select = document.querySelector("#nai-profiles-panel select");
            if (select && select.value) {
                const event = new Event('change');
                select.dispatchEvent(event);
            }
        }, 1000);
    });

    setTimeout(() => {
        const select = document.querySelector("#nai-profiles-panel select");
        if (select && select.value) {
            const event = new Event('change');
            select.dispatchEvent(event);
        }
    }, 2000);

    function addImageZoomFeature() {
        function handleImageClick(e) {
            e.preventDefault();
            const img = e.target;
            const imgSrc = img.src;
            const modal = document.createElement('div');
            modal.id = 'nai-image-zoom-modal';
            Object.assign(modal.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                zIndex: '99999',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'zoom-out',
                overflow: 'hidden',
                touchAction: 'none'
            });
            const imgContainer = document.createElement('div');
            Object.assign(imgContainer.style, {
                position: 'relative',
                width: '90%',
                height: '90%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            });
            const modalImg = document.createElement('img');
            modalImg.src = imgSrc;
            Object.assign(modalImg.style, {
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: 'scale(1) translate(0px, 0px)',
                transition: 'transform 0.1s ease-out',
                cursor: 'grab',
                userSelect: 'none',
                WebkitUserDrag: 'none',
                KhtmlUserDrag: 'none',
                MozUserDrag: 'none',
                OUserDrag: 'none'
            });
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            Object.assign(closeBtn.style, {
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: '1000'
            });

            const zoomInBtn = document.createElement('button');
            zoomInBtn.innerHTML = '+';
            Object.assign(zoomInBtn.style, {
                position: 'absolute',
                bottom: '20px',
                right: '80px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: '1000'
            });

            const zoomOutBtn = document.createElement('button');
            zoomOutBtn.innerHTML = '-';
            Object.assign(zoomOutBtn.style, {
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: '1000'
            });

            const resetBtn = document.createElement('button');
            resetBtn.innerHTML = '100%';
            Object.assign(resetBtn.style, {
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                zIndex: '1000'
            });

            const zoomInfo = document.createElement('div');
            Object.assign(zoomInfo.style, {
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                zIndex: '1000'
            });
            zoomInfo.textContent = t('zoomLevel', '100');

            imgContainer.appendChild(modalImg);
            modal.appendChild(imgContainer);
            modal.appendChild(closeBtn);
            modal.appendChild(zoomInBtn);
            modal.appendChild(zoomOutBtn);
            modal.appendChild(resetBtn);
            modal.appendChild(zoomInfo);
            document.body.appendChild(modal);

            let scale = 1;
            let translateX = 0;
            let translateY = 0;
            let isDragging = false;
            let startX, startY;
            let lastX, lastY;
            let initialDistance = 0;
            let initialScale = 1;

            modalImg.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    initialDistance = Math.hypot(
                        e.touches[0].pageX - e.touches[1].pageX,
                        e.touches[0].pageY - e.touches[1].pageY
                    );
                    initialScale = scale;
                } else if (e.touches.length === 1 && scale > 1) {
                    isDragging = true;
                    modalImg.style.transition = 'none';
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                    lastX = translateX;
                    lastY = translateY;
                }
                e.preventDefault();
            });

            modalImg.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2) {
                    const currentDistance = Math.hypot(
                        e.touches[0].pageX - e.touches[1].pageX,
                        e.touches[0].pageY - e.touches[1].pageY
                    );

                    if (initialDistance > 0) {
                        scale = Math.min(Math.max(0.5, initialScale * (currentDistance / initialDistance)), 5);
                        updateTransform();
                    }
                } else if (e.touches.length === 1 && isDragging) {
                    const deltaX = e.touches[0].clientX - startX;
                    const deltaY = e.touches[0].clientY - startY;
                    translateX = lastX + deltaX;
                    translateY = lastY + deltaY;
                    updateTransform();
                }
                e.preventDefault();
            });

            modalImg.addEventListener('touchend', (e) => {
                if (e.touches.length < 2) {
                    isDragging = false;
                    modalImg.style.transition = 'transform 0.1s ease-out';
                }
                e.preventDefault();
            });

            function updateTransform() {
                modalImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
                zoomInfo.textContent = t('zoomLevel', Math.round(scale * 100));
            }

            zoomInBtn.addEventListener('click', (e) => { e.stopPropagation(); scale = Math.min(scale + 0.25, 5); updateTransform(); });
            zoomOutBtn.addEventListener('click', (e) => { e.stopPropagation(); scale = Math.max(scale - 0.25, 0.5); updateTransform(); });
            resetBtn.addEventListener('click', (e) => { e.stopPropagation(); scale = 1; translateX = 0; translateY = 0; updateTransform(); });

            const closeModal = () => { document.body.removeChild(modal); };
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target === imgContainer) {
                    closeModal();
                }
            });

            modalImg.addEventListener('mousedown', (e) => {
                if (scale > 1) {
                    isDragging = true;
                    modalImg.style.cursor = 'grabbing';
                    modalImg.style.transition = 'none';
                    startX = e.clientX; startY = e.clientY; lastX = translateX; lastY = translateY;
                    e.preventDefault();
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                translateX = lastX + deltaX;
                translateY = lastY + deltaY;
                updateTransform();
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    modalImg.style.cursor = 'grab';
                    modalImg.style.transition = 'transform 0.1s ease-out';
                }
            });

            modal.addEventListener('wheel', (e) => { e.preventDefault(); const delta = e.deltaY > 0 ? -0.1 : 0.1; scale = Math.min(Math.max(0.5, scale + delta), 5); updateTransform(); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
        }

        function attachClickListener(img) {
            if (img.dataset.naiZoomAttached) {
                return;
            }
            img.addEventListener('click', handleImageClick);
            img.style.cursor = 'zoom-in';
            img.dataset.naiZoomAttached = 'true';
        }

        document.querySelectorAll('.image-grid-image').forEach(attachClickListener);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && node.classList.contains('image-grid-image')) {
                                attachClickListener(node);
                            }
                            if (node.querySelectorAll) {
                                node.querySelectorAll('.image-grid-image').forEach(attachClickListener);
                            }
                        }
                    }
                }
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    const targetNode = mutation.target;
                    if (targetNode.classList && targetNode.classList.contains('image-grid-image')) {
                        attachClickListener(targetNode);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    }

    function addMetadataRemoverButtonToImage(imgElement) {
        // Only show button if watermark is enabled
        if (!watermarkEnabled) {
            return;
        }
        if (!imgElement || imgElement.dataset.scrubberButtonAdded) return;
        let parentContainer = imgElement.parentElement;
        while (parentContainer && !parentContainer.querySelector('.display-grid-bottom')) {
            parentContainer = parentContainer.parentElement;
        }
        if (!parentContainer) return;
        if (parentContainer.querySelector('.metadata-remover-btn')) return;
        if (getComputedStyle(parentContainer).position === 'static') {
            parentContainer.style.position = 'relative';
        }
        const scrubberBtn = document.createElement('button');
        scrubberBtn.className = 'metadata-remover-btn';
        scrubberBtn.innerHTML = '💧 Download with Watermark';
        scrubberBtn.title = 'Download image with watermark';
        scrubberBtn.style.cssText = `
            position: absolute !important;
            bottom: 65px !important;
            left: 30px !important;
            z-index: 1000 !important;
            font-size: 13px !important;
            padding: 6px 12px !important;
            border-radius: 4px !important;
            background-color: rgb(59, 130, 246) !important;
            color: white !important;
            border: none !important;
            cursor: pointer !important;
            opacity: 1.0 !important;
            transition: opacity 0.2s !important;
            box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px !important;
        `;
        scrubberBtn.addEventListener('mouseenter', () => {
            scrubberBtn.style.opacity = '1';
        });
        scrubberBtn.addEventListener('mouseleave', () => {
            scrubberBtn.style.opacity = '1';
        });
        scrubberBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const imageUrl = imgElement.src;
            const filename = 'novelai-watermarked-' + Date.now() + '.png';
            downloadImageScrubbedManually(imageUrl, filename);
        });
        parentContainer.appendChild(scrubberBtn);
        imgElement.dataset.scrubberButtonAdded = 'true';
    }

    function downloadImageScrubbedManually(imageUrl, filename) {
        downloadImageWithWatermark(imageUrl, filename);
    }

    function observeImages() {
        const imageObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'IMG' && node.classList.contains('image-grid-image')) {
                                // Only add button if watermark is enabled
                                if (watermarkEnabled) {
                                    addMetadataRemoverButtonToImage(node);
                                }
                            }
                            const images = node.querySelectorAll && node.querySelectorAll('img.image-grid-image');
                            if (images) {
                                for (let j = 0; j < images.length; j++) {
                                    // Only add button if watermark is enabled
                                    if (watermarkEnabled) {
                                        addMetadataRemoverButtonToImage(images[j]);
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
        imageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        // Check existing images
        const existingImages = document.querySelectorAll('img.image-grid-image');
        for (let i = 0; i < existingImages.length; i++) {
            // Only add button if watermark is enabled
            if (watermarkEnabled) {
                addMetadataRemoverButtonToImage(existingImages[i]);
            }
        }
    }

    function initMetadataScrubber() {
        observeImages();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            setTimeout(() => {
                addImageZoomFeature();
                initMetadataScrubber();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            addImageZoomFeature();
            initMetadataScrubber();
        }, 1000);
    }

})();