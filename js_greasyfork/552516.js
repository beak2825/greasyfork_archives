// ==UserScript==
// @name         Google AI Studio profile manager
// @version      1.20
// @description  Manage and switch between multiple custom system instruction profiles in Google AI Studio.
// @author       LetMeFixIt
// @license      MIT
// @match        https://aistudio.google.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1520954
// @downloadURL https://update.greasyfork.org/scripts/552516/Google%20AI%20Studio%20profile%20manager.user.js
// @updateURL https://update.greasyfork.org/scripts/552516/Google%20AI%20Studio%20profile%20manager.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    //================================================================================
    // SECTION: Configuration & State
    //================================================================================

    const SCRIPT_NAME = 'AI Studio Profile Manager';
    const STORAGE_KEY_PROFILES = 'injector_profiles';
    const STORAGE_KEY_GEMINI_API_KEY = 'injector_gemini_api_key';
    const STORAGE_KEY_DEFAULT_PROFILE_ID = 'injector_default_profile_id';
    const STORAGE_KEY_CUSTOM_ICONS = 'injector_custom_icons';
    const STORAGE_KEY_META_PROMPT_WITH_CONTEXT = 'injector_meta_prompt_with_context';
    const STORAGE_KEY_META_PROMPT_WITHOUT_CONTEXT = 'injector_meta_prompt_without_context';
    const STORAGE_KEY_SELECTED_LLM_MODEL = 'injector_selected_llm_model';
    const SELECTORS = {
        systemInstructionsTextArea: 'textarea[aria-label="System instructions"]',
        systemInstructionsCard: '[data-test-system-instructions-card]',
        runSettingsButton: 'button[aria-label="Toggle run settings panel"]'
    };
    const TIMEOUTS = {
        DOCK_HIDE_DELAY: 50,
        UI_SETTLE: 100,
        DOCK_DEBOUNCE: 1000,
        MODAL_UI_WAIT: 3000,
        WAIT_FOR_ELEMENT: 5000
    };
    // The base URL for the Gemini API. The model name will be appended.
    const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';
    const ICONIFY_API_URL = 'https://api.iconify.design';
    const AVAILABLE_MODELS = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'];

    // The default icon catalog is now empty. Users will add icons via the import/search features.
    const DEFAULT_META_PROMPT_WITH_CONTEXT = `You are an expert prompt engineer. Your task is to refine the original system instruction based on the provided guidance and conversation context. The refined instruction should be more effective and relevant to the topic. Output ONLY the refined instruction text and nothing else.\n\nRefinement Guidance:\n---\n{GUIDANCE}\n\nConversation Context:\n---\n{CONTEXT}\n\nOriginal Instruction:\n---\n{PROMPT}`;
    const DEFAULT_META_PROMPT_WITHOUT_CONTEXT = `You are an expert prompt engineer. Your task is to refine the following system instruction based on the provided guidance to be more detailed, robust, and effective for guiding a large language model. Ensure the output is clear, unambiguous, and provides a strong persona. Output ONLY the refined instruction text and nothing else.\n\nRefinement Guidance:\n---\n{GUIDANCE}\n\nOriginal Instruction:\n---\n{PROMPT}`;

    const ICON_CATALOG = {
        // This object is intentionally left empty.
    };

    const state = {
        profiles: [],
        customIcons: {},
        defaultProfileId: null,
        isInitialized: false // Flag to prevent re-initializing the UI
    };

    //================================================================================
    // SECTION: Main Entry Point
    //================================================================================

    async function main() {
        // This function now handles the one-time setup.
        if (state.isInitialized) return;
        state.isInitialized = true;

        console.log(`[${SCRIPT_NAME}] Initializing UI components...`);
        await loadProfiles();
        await loadDefaultProfile();
        await loadCustomIcons();
        setupMenuCommands();
        createProfileDock();
        renderProfilesInDock();
        attachDockListeners();

        // Check for injection on the very first load after UI is ready.
        await checkForNewChatAndInject();
    }

    /**
     * Checks if the current page is a new, empty chat and then calls the
     * auto-injection function if the conditions are met.
     */
    async function checkForNewChatAndInject() {
        // We only want to inject on "new_chat" URLs that have no pre-existing conversation turns.
        const isNewChatPage = window.location.href.includes('/prompts/new_chat');
        const hasChatTurns = !!document.querySelector('ms-chat-turn');

        if (isNewChatPage && !hasChatTurns) {
            console.log(`[${SCRIPT_NAME}] New chat page detected. Attempting auto-injection.`);
            await autoInjectDefaultProfile();
        }
    }

    //================================================================================
    // SECTION: Data Management
    //================================================================================

    async function loadProfiles() {
        const profilesJSON = await GM_getValue(STORAGE_KEY_PROFILES, null);
        if (profilesJSON) {
            try {
                state.profiles = JSON.parse(profilesJSON);
            } catch (e) {
                console.error(`[${SCRIPT_NAME}] Error parsing profiles from storage. Resetting to default.`, e);
                createDefaultProfiles();
            }
        } else {
            createDefaultProfiles();
            await saveProfiles();
        }
    }

    async function saveProfiles() {
        try {
            await GM_setValue(STORAGE_KEY_PROFILES, JSON.stringify(state.profiles));
        } catch (e) {
            console.error(`[${SCRIPT_NAME}] Error saving profiles!`, e);
            showToast('Error saving profiles!', 'error');
        }
    }

    async function loadDefaultProfile() {
        const defaultId = await GM_getValue(STORAGE_KEY_DEFAULT_PROFILE_ID, null);
        // Ensure the ID is a number if it exists
        state.defaultProfileId = defaultId ? parseInt(defaultId, 10) : null;
    }

    async function saveDefaultProfile() {
        await GM_setValue(STORAGE_KEY_DEFAULT_PROFILE_ID, state.defaultProfileId);
    }

    async function loadCustomIcons() {
        const iconsJSON = await GM_getValue(STORAGE_KEY_CUSTOM_ICONS, '{}');
        try {
            state.customIcons = JSON.parse(iconsJSON);
        } catch (e) {
            console.error(`[${SCRIPT_NAME}] Error parsing custom icons. Resetting.`, e);
            state.customIcons = {};
        }
    }

    async function saveCustomIcons() {
        try {
            await GM_setValue(STORAGE_KEY_CUSTOM_ICONS, JSON.stringify(state.customIcons));
        } catch (e) {
            console.error(`[${SCRIPT_NAME}] Error saving custom icons!`, e);
        }
    }

    async function addProfile(profileData) {
        const newProfile = {
            id: Date.now(),
            ...profileData
        };
        state.profiles.push(newProfile);
        await saveProfiles();
        renderProfilesInDock();
        return newProfile; // Return the created profile for chaining
    }

    async function updateProfile(updatedProfile) {
        const index = state.profiles.findIndex(p => p.id === updatedProfile.id);
        if (index !== -1) {
            state.profiles[index] = updatedProfile;
            await saveProfiles();
            renderProfilesInDock();
            return updatedProfile; // Return the updated profile
        }
    }

    async function deleteProfile(profileId) {
        state.profiles = state.profiles.filter(p => p.id !== profileId);
        if (state.defaultProfileId === profileId) {
            state.defaultProfileId = null;
            await saveDefaultProfile();
        }
        await saveProfiles();
        renderProfilesInDock();
    }

    function createDefaultProfiles() {
        state.profiles = [{
            id: Date.now(),
            name: "Creative Writer",
            icon: "feather",
            instructions: "You are a creative and eloquent writer, known for your vivid descriptions and ability to craft compelling narratives. Your tone is inspiring and slightly whimsical. You help users brainstorm ideas, overcome writer's block, and refine their prose."
        }, {
            id: Date.now() + 1,
            name: "Code Assistant",
            icon: "code",
            instructions: "You are a master programmer and an expert in software architecture. You provide clean, efficient, and well-documented code in multiple programming languages. You can explain complex technical concepts clearly and concisely. Your primary goal is to help users write better code and solve technical challenges."
        }];
    }

    function setupMenuCommands() {
        GM_registerMenuCommand("Add New Profile", handleAddNewProfileClick);
        GM_registerMenuCommand("Reset to Default Profiles", async () => {
            const confirmed = await showConfirmationModal({
                title: "Reset Profiles",
                message: "This will delete all your current profiles and restore the defaults. Are you sure?"
            });
            if (confirmed) {
                createDefaultProfiles();
                await saveProfiles();
                renderProfilesInDock();
                showToast("Profiles have been reset to default.", "success");
            }
        });
        GM_registerMenuCommand("Export All Profiles", handleExportProfiles);
        GM_registerMenuCommand("Import Profiles", handleImportProfiles);
    }

    async function autoInjectDefaultProfile() {
        if (state.defaultProfileId !== null) {
            const defaultProfile = state.profiles.find(p => p.id === state.defaultProfileId);
            if (defaultProfile) {
                await injectText(defaultProfile.instructions);
                showToast(`Default profile "${defaultProfile.name}" auto-injected.`, 'success');

                // Visually activate the button in the dock
                const button = document.querySelector(`.profile-button[data-profile-id="${defaultProfile.id}"]`);
                if (button) {
                    button.classList.add('active');
                }
            }
        }
    }
    //================================================================================
    // SECTION: UI Rendering
    //================================================================================

    /**
     * Programmatically builds an SVG element to bypass TrustedHTML policies.
     * @param {string} name - The name of the icon in ICON_CATALOG.
     * @returns {SVGElement} The fully constructed SVG DOM element.
     */
    function createIconElement(name, instruction = null) {
        const fallbackIcon = { viewBox: '0 0 24 24', children: [{ tag: 'path', attrs: { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' } }, { tag: 'polyline', attrs: { points: '14 2 14 8 20 8' } }] }; // file icon
        const iconData = instruction || state.customIcons[name] || ICON_CATALOG[name] || fallbackIcon;
        if (!iconData) {
            console.error(`Icon "${name}" not found or has invalid data. Using fallback.`);
            return createIconElement(null, fallbackIcon); // Recurse with fallback
        }
        const xmlns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(xmlns, 'svg');

        svg.setAttribute('viewBox', iconData.viewBox);
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        if (iconData.children) {
            iconData.children.forEach(childData => {
                const el = document.createElementNS(xmlns, childData.tag);
                for (const [attr, value] of Object.entries(childData.attrs)) {
                    el.setAttribute(attr, value);
                }
                svg.appendChild(el);
            });
        }

        return svg;
    }

    function createProfileDock() {
        const trigger = document.createElement('div');
        trigger.id = 'profile-dock-trigger';
        const container = document.createElement('div');
        container.id = 'profile-dock-container';
        const dock = document.createElement('div'); dock.id = 'profile-dock';
        container.appendChild(dock);
        document.body.append(trigger, container);

        let hideTimeout;

        const showDock = () => {
            // If the trigger is in a debounced state, do not show the dock.
            if (trigger.dataset.debounced === 'true') {
                return;
            }
            clearTimeout(hideTimeout);
            container.classList.add('visible');
        };

        const hideDock = () => {
            // Before hiding, double-check that the mouse isn't currently over the trigger or the container.
            // This prevents a race condition where a quick mouse-out from the trigger leaves the dock open.
            if (trigger.matches(':hover') || container.matches(':hover')) {
                return; // The mouse has re-entered one of the areas, so do not hide.
            }
            container.classList.remove('visible');
        };

        const startHideTimer = () => {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(hideDock, TIMEOUTS.DOCK_HIDE_DELAY);
        };

        trigger.addEventListener('mouseenter', showDock);
        trigger.addEventListener('mouseleave', startHideTimer);
        container.addEventListener('mouseenter', showDock);
        container.addEventListener('mouseleave', startHideTimer);
    }

    function renderProfilesInDock() {
        const dock = document.getElementById('profile-dock');
        if (!dock) return;
        while (dock.firstChild) { dock.removeChild(dock.firstChild); }
        if (state.profiles.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'dock-empty-state';
            emptyState.textContent = "No profiles. Click the '+' button to add one!";
            dock.appendChild(emptyState);
        } else {
            state.profiles.forEach(profile => {
                const isDefault = profile.id === state.defaultProfileId;
                const button = createProfileButton(profile, isDefault);
                if (button) dock.appendChild(button);
            });
        }
        const addButton = document.createElement('button');
        addButton.className = 'profile-button add-new-button';
        addButton.textContent = '+';
        addButton.title = 'Add New Profile';
        dock.appendChild(addButton);

        const explorerButton = document.createElement('button');
        explorerButton.className = 'profile-button explorer-button';
        explorerButton.title = 'Show All Profiles';
        const gridIcon = {
            viewBox: '0 0 24 24',
            children: [
                { tag: 'rect', attrs: { x: '3', y: '3', width: '7', height: '7' } }, { tag: 'rect', attrs: { x: '14', y: '3', width: '7', height: '7' } },
                { tag: 'rect', attrs: { x: '14', y: '14', width: '7', height: '7' } }, { tag: 'rect', attrs: { x: '3', y: '14', width: '7', height: '7' } }
            ]
        };
        explorerButton.appendChild(createIconElement(null, gridIcon));
        dock.appendChild(explorerButton);
    }

    /**
     * Creates a single HTML button element for a given profile.
     * @param {object} profile - The profile object.
     * @returns {HTMLButtonElement} The created button element.
     */
    function createProfileButton(profile, isDefault = false) {
        const button = document.createElement('button');
        button.className = 'profile-button';
        button.title = profile.name;
        if (isDefault) {
            button.classList.add('default');
        }
        button.dataset.profileId = profile.id;
        button.draggable = true;

        const svgNode = createIconElement(profile.icon);
        if (!svgNode) return null; // Don't create a button if the icon is invalid
        button.appendChild(svgNode);
        return button;
    }

    //================================================================================
    // SECTION: AI Refiner Logic
    //================================================================================

    /**
     * Scrapes the current chat history from the AI Studio page.
     * @async
     * @returns {Promise<string>} A formatted string of the conversation history.
     */
     async function getChatContext() {
         const turns = document.querySelectorAll('ms-chat-turn');
         if (!turns.length) return [];

         const context = [];
         for (const turn of turns) {
             const userTurn = turn.querySelector('.user-prompt-container');
             const modelTurn = turn.querySelector('.model-prompt-container');

             if (userTurn) {
                 // User turns can have multiple text/media chunks. We'll join them.
                 const parts = Array.from(userTurn.querySelectorAll('ms-cmark-node'))
                                     .map(node => node.textContent.trim())
                                     .filter(text => text)
                                     .join('\n');
                 if (parts) context.push({ role: 'user', parts });
             } else if (modelTurn) {
                 // Model turns also can have multiple parts. We specifically target the response nodes.
                 const parts = Array.from(modelTurn.querySelectorAll('ms-prompt-chunk > ms-text-chunk > ms-cmark-node'))
                                     .map(node => node.textContent.trim())
                                     .filter(text => text)
                                     .join('\n');
                 if (parts) context.push({ role: 'model', parts });
             }
         }

         return context;
     }

    /**
     * Calls the Gemini API to refine a given prompt.
     * @async
     * @param {{originalPrompt: string, chatContext?: string}} options
     * @param {string} model - The model to use for the API call.
     * @returns {Promise<string>} The refined prompt text from the API.
     */
    async function fetchRefinedPrompt({ originalPrompt, chatContext = '', guidance = '' }, model) {
        const apiKey = await GM_getValue(STORAGE_KEY_GEMINI_API_KEY);
        if (!apiKey) {
            throw new Error("Gemini API key is not set. Please set it in the AI Configuration section.");
        }

        const metaPromptTemplateWithContext = await GM_getValue(STORAGE_KEY_META_PROMPT_WITH_CONTEXT, DEFAULT_META_PROMPT_WITH_CONTEXT);
        const metaPromptTemplateWithoutContext = await GM_getValue(STORAGE_KEY_META_PROMPT_WITHOUT_CONTEXT, DEFAULT_META_PROMPT_WITHOUT_CONTEXT);

        // The getChatContext function returns an array of objects. Stringify it for the {CONTEXT} placeholder.
        const contextString = (Array.isArray(chatContext) && chatContext.length > 0) ? JSON.stringify(chatContext, null, 2) : '';

        const finalMetaPrompt = (contextString ? metaPromptTemplateWithContext : metaPromptTemplateWithoutContext)
            .replace('{CONTEXT}', contextString)
            .replace('{PROMPT}', originalPrompt)
            .replace('{GUIDANCE}', guidance || 'No specific guidance provided. Refine for general quality and effectiveness.');

        const body = {
            contents: [{ parts: [{ text: finalMetaPrompt }] }]
        };

        const response = await fetch(`${GEMINI_API_BASE_URL}${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            throw new Error(`API request failed: ${response.status} ${response.statusText}. Check console for details.`);
        }

        const data = await response.json();
        const refinedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!refinedText) throw new Error("Invalid API response format from Gemini.");
        return refinedText.trim();
    }

    /**
     * Searches the Iconify API for icons matching a query.
     * @param {string} query The search term.
     * @returns {Promise<Array<string>>} A promise that resolves to an array of icon names (e.g., "mdi:kangaroo").
     */
    async function searchIconify(query) {
        const response = await fetch(`${ICONIFY_API_URL}/search?query=${encodeURIComponent(query)}&limit=32`);
        if (!response.ok) throw new Error("Iconify API search failed.");
        const data = await response.json();
        return data.icons || [];
    }

    /**
     * Fetches the SVG data for a specific Iconify icon.
     * @param {string} iconName The full name of the icon (e.g., "mdi:kangaroo").
     * @returns {Promise<string>} A promise that resolves to the raw SVG string.
     */
    async function fetchIconifySVG(iconName) {
        // The API returns the SVG content directly.
        const response = await fetch(`${ICONIFY_API_URL}/${iconName.replace(':', '/')}.svg`);
        if (!response.ok) throw new Error("Failed to fetch Iconify SVG data.");
        const svgText = await response.text();
        // The API sometimes includes width/height, which we don't want.
        return svgText.replace(/ width="[^"]*"/g, '').replace(/ height="[^"]*"/g, '');
    }

    //================================================================================
    // SECTION: Event Handling & Modals
    //================================================================================
    function attachDockListeners() {
        const dock = document.getElementById('profile-dock');
        if (!dock) return;

        // Use event delegation for efficiency
        dock.addEventListener('click', async (event) => {
            const button = event.target.closest('button');
            if (button) {
                if (button.classList.contains('add-new-button')) {
                    await handleAddNewProfileClick();
                } else if (button.classList.contains('explorer-button')) {
                    // This will be a new function to show the full-screen explorer
                    await showProfileManagerModal();
                } else if (button.classList.contains('profile-button') && button.dataset.profileId) {
                    handleProfileClick(button);
                }
            } else if (event.target === dock) { // Clicked on the dock background
                const container = document.getElementById('profile-dock-container');
                // Instantly hide the dock and debounce the trigger to prevent accidental re-opening.
                container.style.transition = 'none';
                container.classList.remove('visible');
                void container.offsetHeight; // Force reflow
                container.style.transition = '';

                const trigger = document.getElementById('profile-dock-trigger');
                if (trigger) {
                    trigger.dataset.debounced = 'true';
                    setTimeout(() => trigger.dataset.debounced = 'false', TIMEOUTS.DOCK_DEBOUNCE);
                }
            }
        });

        // Restore the context menu listener
        dock.addEventListener('contextmenu', async (event) => {
            // Prevent the default browser context menu
            event.preventDefault();
            const button = event.target.closest('.profile-button[data-profile-id]');
            if (button) {
                await handleProfileRightClick(event, button);
            }
        });
        // --- Drag and Drop Logic ---
        let draggedElementId = null;

        // Fired on the element that is being dragged
        dock.addEventListener('dragstart', (e) => {
            const target = e.target.closest('.profile-button[data-profile-id]');
            if (target) {
                draggedElementId = target.dataset.profileId;
                // Add a visual cue to the item being dragged
                e.dataTransfer.setData('text/plain', null); // Required for Firefox to allow dragging
                setTimeout(() => target.classList.add('dragging'), 0);
            } else {
                e.preventDefault(); // Prevent dragging the '+' button
            }
        });

        // Fired when the drag operation ends (e.g., mouse up, escape key)
        dock.addEventListener('dragend', (e) => {
            const target = e.target.closest('.profile-button[data-profile-id]');
            if (target) {
                target.classList.remove('dragging');
            }
            draggedElementId = null;
        });

         // Fired when a valid drop target is hovered
         dock.addEventListener('dragover', (e) => {
             e.preventDefault(); // Necessary to allow dropping
         });

        // Fired when an element is dropped on a valid drop target
        dock.addEventListener('drop', async (e) => {
            e.preventDefault();
            const dropTarget = e.target.closest('.profile-button[data-profile-id]');
            if (!dropTarget || !draggedElementId || dropTarget.dataset.profileId === draggedElementId) {
                return;
            }

            const draggedIndex = state.profiles.findIndex(p => p.id == draggedElementId);
            const targetIndex = state.profiles.findIndex(p => p.id == dropTarget.dataset.profileId);

            if (draggedIndex === -1 || targetIndex === -1) return;

            // Reorder the array
            const [draggedItem] = state.profiles.splice(draggedIndex, 1);
            state.profiles.splice(targetIndex, 0, draggedItem);

            await saveProfiles();
            renderProfilesInDock(); // Re-render to reflect the new order

        });
    }

    function handleProfileClick(buttonEl) {
        const profileId = parseInt(buttonEl.dataset.profileId, 10);
        const profile = state.profiles.find(p => p.id === profileId);

        if (profile) {
            injectText(profile.instructions);
            showToast(`Profile "${profile.name}" injected.`, 'success');

            // Update active state
            document.querySelectorAll('#profile-dock .profile-button').forEach(btn => btn.classList.remove('active'));
            buttonEl.classList.add('active');
        }
    }

    /**
     * Handles the logic when a profile button is right-clicked.
     */
    async function handleProfileRightClick(event, buttonEl) {
        const profileId = parseInt(buttonEl.dataset.profileId, 10);
        const profile = state.profiles.find(p => p.id === profileId);
        if (!profile) return;

        const choice = await showContextMenu(event, profile);

        if (choice === 'edit') {
            // Use the new Profile Manager modal for editing
            await showProfileManagerModal({ startWithProfileId: profile.id });
        } else if (choice === 'delete') {
            const confirmed = await showConfirmationModal({
                title: "Delete Profile",
                message: `Are you sure you want to delete the "${profile.name}" profile? This cannot be undone.`
            });
            if (confirmed) {
                await deleteProfile(profile.id);
                showToast(`Profile "${profile.name}" deleted.`, 'success');
            }
        } else if (choice === 'default') {
            if (state.defaultProfileId === profile.id) {
                state.defaultProfileId = null; // Unset if it's already the default
                showToast(`"${profile.name}" is no longer the default profile.`, 'info');
            } else {
                state.defaultProfileId = profile.id; // Set as the new default
                showToast(`"${profile.name}" is now the default profile.`, 'success');
            }
            await saveDefaultProfile();
            renderProfilesInDock(); // Re-render to update any visual state
        }
    }

    async function handleAddNewProfileClick() {
        const newProfileData = await showProfileManagerModal({ startWithAdd: true });
        if (newProfileData) {
            await addProfile(newProfileData);
            showToast(`Profile "${newProfileData.name}" created!`, 'success');
        }
    }

    async function handleExportProfiles() {
        // We don't need to show a modal if there are no profiles to export.
        if (state.profiles.length === 0) {
            showToast("There are no profiles to export.", "info");
            return;
        }

        // Fetch the current refiner prompts to include them in the export.
        const refinerWithContext = await GM_getValue(STORAGE_KEY_META_PROMPT_WITH_CONTEXT, DEFAULT_META_PROMPT_WITH_CONTEXT);
        const refinerWithoutContext = await GM_getValue(STORAGE_KEY_META_PROMPT_WITHOUT_CONTEXT, DEFAULT_META_PROMPT_WITHOUT_CONTEXT);

        const exportData = {
            profiles: state.profiles,
            refinerPrompts: {
                withContext: refinerWithContext,
                withoutContext: refinerWithoutContext
            },
            customIcons: state.customIcons
        };

        const exportJSON = JSON.stringify(exportData, null, 2);

        const { modal, overlay, closeModalAndResolve } = createBaseModal();
        const promise = new Promise(resolve => {
            const closeModal = (data) => closeModalAndResolve(resolve, data);

            modal.style.maxWidth = '600px'; // Make this modal a bit wider

            const h2 = document.createElement('h2');
            h2.textContent = 'Export Profiles';
            const p = document.createElement('p');
            p.textContent = 'Copy the JSON below to back up your profiles, or use the download button.';

            const textarea = document.createElement('textarea');
            textarea.id = 'injector-textarea';
            textarea.value = exportJSON;
            textarea.readOnly = true;
            textarea.rows = 15;

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'injector-buttons';

            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy to Clipboard';

            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download as File';

            const closeButton = document.createElement('button');
            closeButton.id = 'injector-cancel';
            closeButton.textContent = 'Close';

            buttonsDiv.append(closeButton, copyButton, downloadButton);
            modal.append(h2, p, textarea, buttonsDiv);

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(exportJSON).then(() => {
                    showToast('Profiles copied to clipboard!', 'success');
                }, () => {
                    showToast('Failed to copy to clipboard.', 'error');
                });
            });

            downloadButton.addEventListener('click', () => {
                const blob = new Blob([exportJSON], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `aistudio_profiles_backup_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });

            closeButton.addEventListener('click', () => closeModal(null));
            overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(null); });
        });
        await promise;
    }

    async function handleImportProfiles() {
        const importJSON = await showInputModal({
            title: 'Import Profiles',
            message: 'Paste your exported JSON here. This will overwrite all current profiles.',
            placeholder: '[{ "name": "My Profile", ... }]',
            submitText: 'Import & Overwrite',
            isTextarea: true // A flag to use a textarea instead of an input
        });

        if (!importJSON) return; // User cancelled

        try {
            const importedData = JSON.parse(importJSON);
            let importedProfiles;
            let importedPrompts = null;
            let importedCustomIcons = null;

            // Handle both new and old formats for backward compatibility
            if (Array.isArray(importedData)) {
                // Old format: just an array of profiles
                importedProfiles = importedData;
                showToast("Importing legacy format. Refiner prompts will not be changed.", "info");
            } else if (typeof importedData === 'object' && importedData !== null && Array.isArray(importedData.profiles)) {
                // New format: an object with profiles and refinerPrompts
                importedProfiles = importedData.profiles;
                importedPrompts = importedData.refinerPrompts;
                importedCustomIcons = importedData.customIcons;
            } else {
                throw new Error("Invalid JSON structure. Expected an array of profiles or an object containing a 'profiles' array.");
            }

            // Validate the profiles array itself
            if (importedProfiles.some(p => !p.name || !p.instructions || !p.icon || !p.id)) {
                throw new Error("Profile data is invalid. Each profile must have 'id', 'name', 'icon', and 'instructions'.");
            }

            // If new format included custom icons, save them
            if (importedCustomIcons && typeof importedCustomIcons === 'object') {
                state.customIcons = importedCustomIcons;
                await saveCustomIcons();
                showToast("Custom icons imported successfully!", "success");
            }

            // If new format included refiner prompts, save them
            if (importedPrompts && importedPrompts.withContext && importedPrompts.withoutContext) {
                await GM_setValue(STORAGE_KEY_META_PROMPT_WITH_CONTEXT, importedPrompts.withContext);
                await GM_setValue(STORAGE_KEY_META_PROMPT_WITHOUT_CONTEXT, importedPrompts.withoutContext);
                showToast("Refiner prompts imported successfully!", "success");
            }

            state.profiles = importedProfiles;
            state.defaultProfileId = null; // After importing, clear the default profile ID as it may be invalid.
            await saveDefaultProfile();
            await saveProfiles();
            renderProfilesInDock();
            showToast(`${importedProfiles.length} profiles imported successfully!`, "success");
        } catch (error) {
            showToast(`Import failed: ${error.message}`, 'error');
        }
    }

    /**
     * Creates a base modal structure with an overlay.
     * @param {string} modalId - The ID for the modal element.
     * @param {string} overlayId - The ID for the overlay element.
     * @returns {{modal: HTMLDivElement, overlay: HTMLDivElement, closeModal: function(any): void, resolve: function}}
     */
     function createBaseModal(modalId = 'injector-modal', overlayId = 'injector-overlay') {
        const overlay = document.createElement('div');
        overlay.id = overlayId;

        const modal = document.createElement('div');
        modal.id = modalId;

        document.body.append(overlay, modal);

        // This function now takes the promise's `resolve` function as an argument.
        // It handles DOM removal and then safely resolves the promise.
        const closeModalAndResolve = (resolve, data) => {
            overlay.remove();
            modal.remove();
            // Per memory_bank.md, use queueMicrotask to avoid race conditions.
            queueMicrotask(() => resolve(data));
        };

        // The function returns the elements and the new closing utility.
        return { modal, overlay, closeModalAndResolve };
    }


    /**
     * Renders the complete editor UI into a given pane.
     * This function is the result of refactoring showProfileEditorModal.
     */
    function renderEditorForProfile(profile, editorPane) {
        return new Promise(async (resolve) => {
            const isEditing = profile !== null;
            const title = isEditing ? "Edit Profile" : "Add New Profile";
            let selectedIcon = isEditing ? profile.icon : (Object.keys(state.customIcons)[0] || null);

            // State for refinement history
            let refinementHistory = [isEditing ? profile.instructions : ''];
            let historyIndex = 0;

            // Clear the pane before rendering new content
            while (editorPane.firstChild) {
                editorPane.removeChild(editorPane.firstChild);
            }

            const mainContent = document.createElement('div');
            mainContent.id = 'injector-modal-main-content';
            const h2 = document.createElement('h2');
            h2.textContent = title;

            const iconLabelWrapper = document.createElement('div');
            iconLabelWrapper.className = 'label-wrapper';
            const nameLabel = document.createElement('label');
            nameLabel.className = 'injector-label';
            nameLabel.textContent = 'Profile Name';
            const nameInput = document.createElement('input');
            nameInput.id = 'injector-input-name';
            nameInput.className = 'profile-name-input';
            nameInput.type = 'text';
            nameInput.placeholder = 'e.g., "Code Assistant"';
            nameInput.value = isEditing ? profile.name : '';

            const nameWrapper = document.createElement('div');
            nameWrapper.className = 'profile-name-wrapper';
            nameWrapper.append(nameInput);

            if (isEditing) {
                const setDefaultBtn = document.createElement('button');
                setDefaultBtn.className = 'set-default-button';
                setDefaultBtn.title = 'Set as default profile';
                nameWrapper.append(setDefaultBtn);
            }

            const importSvgBtn = document.createElement('button');
            importSvgBtn.id = 'import-svg-btn';
            importSvgBtn.className = 'inline-button';
            importSvgBtn.textContent = 'Import...';
            const iconLabel = document.createElement('label');
            iconLabel.className = 'injector-label';
            iconLabel.textContent = 'Icon';
            const iconPicker = document.createElement('div');
            iconPicker.className = 'icon-picker-grid';

            const renderIcons = () => {
                if (!iconLabelWrapper.contains(iconLabel)) iconLabelWrapper.append(iconLabel, importSvgBtn);

                // If there are no icons at all, the selected icon should be null
                if (Object.keys(state.customIcons).length === 0 && Object.keys(ICON_CATALOG).length === 0) {
                    selectedIcon = null;
                }
                while (iconPicker.firstChild) { iconPicker.removeChild(iconPicker.firstChild); } // Clear previous icons
                Object.keys(ICON_CATALOG).forEach(iconName => {
                    const iconButton = document.createElement('button');
                    iconButton.className = 'icon-picker-button';
                    if (iconName === selectedIcon) {
                        iconButton.classList.add('selected');
                    }
                    iconButton.appendChild(createIconElement(iconName));
                    iconButton.dataset.iconName = iconName;
                    iconPicker.appendChild(iconButton);
                });
                Object.keys(state.customIcons).forEach(iconName => {
                    const iconButton = document.createElement('button');
                    iconButton.className = 'icon-picker-button custom-icon-wrapper';
                    if (iconName === selectedIcon) {
                        iconButton.classList.add('selected');
                    }
                    iconButton.appendChild(createIconElement(iconName));
                    iconButton.dataset.iconName = iconName;

                    const deleteBtn = document.createElement('div');
                    deleteBtn.className = 'custom-icon-delete-btn';
                    deleteBtn.textContent = '×';
                    deleteBtn.title = 'Delete this custom icon';
                    deleteBtn.dataset.iconToDelete = iconName;

                    iconButton.appendChild(deleteBtn);
                    iconPicker.appendChild(iconButton);
                });
                // Add Search button
                const searchBtn = document.createElement('button');
                searchBtn.id = 'search-icon-btn';
                searchBtn.className = 'icon-picker-button ai-generate'; // Reuse style
                searchBtn.title = 'Search for icons online';
                searchBtn.textContent = '🔍';
                iconPicker.appendChild(searchBtn);


            };

            iconPicker.addEventListener('click', (e) => {
                const button = e.target.closest('.icon-picker-button');
                if (button && button.dataset.iconName) { // Ensure it's not the generate button
                    selectedIcon = button.dataset.iconName;
                    renderIcons();
                }
            });

            // Listener for deleting custom icons
            iconPicker.addEventListener('click', async (e) => {
                const deleteBtn = e.target.closest('.custom-icon-delete-btn');
                if (!deleteBtn) return;

                e.stopPropagation(); // Prevent the icon from being selected
                const iconToDelete = deleteBtn.dataset.iconToDelete;
                if (iconToDelete && state.customIcons[iconToDelete]) {
                    delete state.customIcons[iconToDelete];
                    await saveCustomIcons();
                    showToast("Custom icon deleted.", "info");
                    // Fallback to the first available custom icon, or null
                    if (selectedIcon === iconToDelete) {
                        selectedIcon = Object.keys(state.customIcons)[0] || Object.keys(ICON_CATALOG)[0] || null;
                    }
                    renderIcons(); // Re-render the picker
                }
            });

            const instructionsSection = document.createElement('div');
            instructionsSection.className = 'instructions-section'; // This is now the main content area for the editor

            const instructionsTextarea = document.createElement('textarea');
            instructionsTextarea.id = 'injector-textarea';
            instructionsTextarea.placeholder = 'Paste your system instructions here...';
            instructionsTextarea.value = isEditing ? profile.instructions : '';
            const aiRefinerContainer = document.createElement('div');
            aiRefinerContainer.className = 'ai-refiner-container-wrapper';

            const aiRefinerButtons = document.createElement('div');
            aiRefinerButtons.className = 'ai-refiner-buttons';

            const centerButtonsWrapper = document.createElement('div');
            centerButtonsWrapper.className = 'ai-refiner-center-group';


            const prevBtn = document.createElement('button');
            prevBtn.id = 'ai-refiner-prev-btn';
            prevBtn.textContent = '‹';
            prevBtn.title = 'Previous Version';
            prevBtn.disabled = true;

            const historyCounter = document.createElement('span');
            historyCounter.id = 'ai-refiner-history-counter';
            historyCounter.style.display = 'none'; // Hidden until there's history

            const aiRefinerBtn = document.createElement('button');
            aiRefinerBtn.id = 'ai-refiner-btn';
            aiRefinerBtn.textContent = 'Refine with AI ✨';

            const nextBtn = document.createElement('button');
            nextBtn.id = 'ai-refiner-next-btn';
            nextBtn.textContent = '›';
            nextBtn.title = 'Next Version';
            nextBtn.disabled = true;

            const refinerModelSelect = document.createElement('select');
            refinerModelSelect.id = 'ai-refiner-model-select';
            refinerModelSelect.title = 'Select LLM for refinement';
            AVAILABLE_MODELS.forEach(modelName => {
                const option = new Option(modelName, modelName);
                refinerModelSelect.add(option);
            });

            const updateHistoryButtons = () => {
                prevBtn.disabled = historyIndex <= 0;
                nextBtn.disabled = historyIndex >= refinementHistory.length - 1;
                if (refinementHistory.length > 1) {
                    historyCounter.textContent = `${historyIndex + 1} / ${refinementHistory.length}`;
                    historyCounter.style.display = 'inline';
                } else {
                    historyCounter.style.display = 'none';
                }
            };


            const guidanceTextarea = document.createElement('textarea');
            guidanceTextarea.id = 'ai-refiner-guidance';
            guidanceTextarea.placeholder = 'Optional: Guide the refinement (e.g., "make it more formal")';
            guidanceTextarea.rows = 2;

            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'checkbox-wrapper';
            const contextCheckbox = document.createElement('input');
            contextCheckbox.type = 'checkbox';
            contextCheckbox.id = 'ai-refiner-context-checkbox';
            const contextLabel = document.createElement('label');
            contextLabel.htmlFor = 'ai-refiner-context-checkbox';
            contextLabel.textContent = 'Use chat context';

            const viewContextLink = document.createElement('button');
            viewContextLink.className = 'inline-button view-context-link';
            viewContextLink.textContent = 'View';
            viewContextLink.style.display = 'none'; // Initially hidden

            checkboxWrapper.append(contextCheckbox, contextLabel, viewContextLink);
            centerButtonsWrapper.append(prevBtn, historyCounter, aiRefinerBtn, nextBtn);
            aiRefinerButtons.append(checkboxWrapper, centerButtonsWrapper, refinerModelSelect);
            aiRefinerContainer.append(aiRefinerButtons, guidanceTextarea);
            instructionsSection.append(instructionsTextarea, aiRefinerContainer);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'injector-buttons';
            const cancelButton = document.createElement('button');
            cancelButton.id = 'injector-cancel';
            cancelButton.textContent = 'Cancel';
            const saveButton = document.createElement('button');
            saveButton.id = 'injector-save';
            saveButton.textContent = isEditing ? 'Save Changes' : 'Create Profile';

            if (isEditing) {
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete';
                deleteButton.textContent = 'Delete';
                deleteButton.style.marginRight = 'auto'; // Push to the far left
                buttonsDiv.append(deleteButton); // Add delete button first
            }

            const aiConfigButton = document.createElement('button');
            aiConfigButton.textContent = 'AI Configuration...';
            // If delete button exists, this will be next to it. Otherwise, it's on the far left.
            if (!isEditing) aiConfigButton.style.marginRight = 'auto';
            buttonsDiv.append(aiConfigButton);

            mainContent.append(h2, nameLabel, nameWrapper, iconLabelWrapper, iconPicker, instructionsSection);
            buttonsDiv.append(cancelButton, saveButton); // These are on the right
            editorPane.append(mainContent, buttonsDiv);

            renderIcons();
            nameInput.focus();
            updateHistoryButtons(); // Set initial state of history UI

            // Load existing values into the config section
            if (isEditing) {
                const setDefaultBtn = editorPane.querySelector('.set-default-button');
                const updateSetDefaultButtonState = () => {
                    if (state.defaultProfileId === profile.id) {
                        setDefaultBtn.classList.add('is-default');
                        setDefaultBtn.textContent = '✓ Default';
                    } else {
                        setDefaultBtn.classList.remove('is-default');
                        setDefaultBtn.textContent = 'Set as Default';
                    }
                };
                updateSetDefaultButtonState();
            }
            const savedModel = await GM_getValue(STORAGE_KEY_SELECTED_LLM_MODEL, AVAILABLE_MODELS[0]);
            // Ensure the saved model is still in our list of available models before setting it.
            if (AVAILABLE_MODELS.includes(savedModel)) {
                refinerModelSelect.value = savedModel;
            }

            // --- Event Listeners ---
            aiConfigButton.addEventListener('click', () => showAiConfigModal());

            refinerModelSelect.addEventListener('change', () => {
                // Also immediately save the change for a more responsive feel.
                // This value will be formally saved with the "Save Refiner Prompts" button anyway.
                GM_setValue(STORAGE_KEY_SELECTED_LLM_MODEL, refinerModelSelect.value);
            });

            contextCheckbox.addEventListener('change', () => {
                viewContextLink.style.display = contextCheckbox.checked ? 'inline' : 'none';
            });

            viewContextLink.addEventListener('click', async () => {
                viewContextLink.textContent = 'Loading...';
                viewContextLink.disabled = true;
                try {
                    const context = await getChatContext();
                    const contextString = context.length > 0 ? JSON.stringify(context, null, 2) : 'No chat context found or the chat is empty.';
                    await showInputModal({
                        title: 'Current Chat Context',
                        message: 'This is the context that will be sent to the AI for refinement. It is read-only.',
                        isTextarea: true,
                        initialValue: contextString,
                        isReadOnly: true,
                        submitText: 'Close', // Change button text to be more intuitive
                        isLarge: true // New option to trigger large modal styles
                    });
                } finally {
                    viewContextLink.textContent = 'View';
                    viewContextLink.disabled = false;
                }
            });


            aiRefinerBtn.addEventListener('click', async () => {
                aiRefinerBtn.disabled = true;
                aiRefinerBtn.textContent = 'Refining...';
                try {
                    // Before refining, ensure the current text is the latest in history
                    const currentText = instructionsTextarea.value;
                    if (currentText !== refinementHistory[historyIndex]) {
                        // User edited manually, so truncate future history
                        refinementHistory = refinementHistory.slice(0, historyIndex + 1);
                        refinementHistory.push(currentText);
                        historyIndex++;
                    }

                    const guidance = guidanceTextarea.value.trim();
                    const originalPrompt = instructionsTextarea.value;
                    const chatContext = contextCheckbox.checked ? await getChatContext() : '';
                    const selectedModel = refinerModelSelect.value; // Use the more accessible dropdown
                    const refinedPrompt = await fetchRefinedPrompt({ originalPrompt, chatContext, guidance }, selectedModel);

                    // Add new version to history
                    refinementHistory.push(refinedPrompt);
                    historyIndex = refinementHistory.length - 1;

                    instructionsTextarea.value = refinedPrompt;
                    updateHistoryButtons();
                    showToast("Prompt refined successfully!", "success");
                } catch (error) {
                    showToast(error.message, "error");
                } finally {
                    aiRefinerBtn.disabled = false;
                    aiRefinerBtn.textContent = 'Refine with AI ✨';
                }
            });

            prevBtn.addEventListener('click', () => {
                if (historyIndex > 0) {
                    historyIndex--;
                    instructionsTextarea.value = refinementHistory[historyIndex];
                    updateHistoryButtons();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (historyIndex < refinementHistory.length - 1) {
                    historyIndex++;
                    instructionsTextarea.value = refinementHistory[historyIndex];
                    updateHistoryButtons();
                }
            });

            instructionsTextarea.addEventListener('input', () => {
                const currentText = instructionsTextarea.value;
                if (currentText !== refinementHistory[historyIndex]) {
                    refinementHistory = refinementHistory.slice(0, historyIndex + 1);
                    nextBtn.disabled = true; // Can't go forward anymore
                }
            });

            importSvgBtn.addEventListener('click', async () => {
                const buildInstruction = await showImportSVGModal();
                if (buildInstruction) {
                    const iconId = 'custom_' + Date.now();
                    state.customIcons[iconId] = buildInstruction;
                    await saveCustomIcons();
                    showToast("Custom icon imported!", "success");

                    // Select the new icon and re-render the picker
                    selectedIcon = iconId;
                    renderIcons();
                }
            });

            iconPicker.addEventListener('click', async (e) => {
                const button = e.target.closest('#search-icon-btn');
                if (!button) return;

                try {
                    const selectedIconName = await showIconSearchModal();
                    if (selectedIconName) {
                        const svgCode = await fetchIconifySVG(selectedIconName);
                        const buildInstruction = parseSvgString(svgCode);
                        const iconId = 'custom_' + Date.now();
                        state.customIcons[iconId] = buildInstruction;
                        await saveCustomIcons();
                        showToast(`Icon "${selectedIconName}" imported!`, "success");
                        selectedIcon = iconId;
                        renderIcons();
                    }
                } catch (error) {
                    showToast(error.message, 'error');
                }
            });

            if (isEditing) {
                const deleteButton = editorPane.querySelector('.injector-buttons .delete');
                deleteButton.addEventListener('click', () => resolve({ action: 'delete', name: nameInput.value.trim(), icon: selectedIcon, instructions: instructionsTextarea.value.trim() }));

                const setDefaultBtn = editorPane.querySelector('.set-default-button');
                setDefaultBtn.addEventListener('click', async () => {
                    // This action is self-contained and doesn't need to resolve the promise.
                    // It just updates state and UI in place.
                    if (state.defaultProfileId === profile.id) {
                        state.defaultProfileId = null;
                        showToast(`"${profile.name}" is no longer the default profile.`, 'info');
                    } else {
                        state.defaultProfileId = profile.id;
                        showToast(`"${profile.name}" is now the default profile.`, 'success');
                    }
                    await saveDefaultProfile();
                    // We need a way to tell the parent modal to re-render the list.
                    // We can dispatch a custom event for this.
                    editorPane.dispatchEvent(new CustomEvent('profileListShouldUpdate', { bubbles: true }));
                    // Also update the button's own state.
                    const isNowDefault = state.defaultProfileId === profile.id;
                    setDefaultBtn.classList.toggle('is-default', isNowDefault);
                    setDefaultBtn.textContent = isNowDefault ? '✓ Default' : 'Set as Default';
                });
            }

            saveButton.addEventListener('click', () => {
                const name = nameInput.value.trim();
                const instructions = instructionsTextarea.value.trim();
                if (!name || !instructions || !selectedIcon) {
                    showToast("Profile Name, Instructions, and a selected Icon are required.", "error");
                    return;
                }
                // Instead of closing, we resolve the promise with the data.
                // The parent function will handle adding/updating and closing the modal.
                resolve({ name, icon: selectedIcon, instructions });
            });

            cancelButton.addEventListener('click', () => resolve(null)); // Resolve with null on cancel
        });
    }

    /**
     * Enables auto-resizing for a textarea element to fit its content.
     * @param {HTMLTextAreaElement} textarea - The textarea to make auto-resizable.
     */
    function autoResizeTextarea(textarea) {
        // Mark the textarea so we can find it later
        textarea.dataset.autoResize = 'true';
        const resize = () => {
            // Only resize if the element is visible in the DOM
            if (textarea.offsetParent !== null) {
                textarea.style.height = 'auto'; // Reset height to recalculate scrollHeight correctly
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        };
        textarea.addEventListener('input', resize);
        textarea.addEventListener('resize', resize); // Listen for a custom resize event
        // Initial resize needs to run after the element is rendered and has its value/is visible.
        queueMicrotask(resize);
    }

    /**
     * Creates a tabbed interface for the AI Config modal.
     * @param {HTMLElement} parent - The parent element to append the tabs to.
     * @param {Array<Object>} tabsConfig - Array of { name: string, content: HTMLElement }.
     */
    function createTabs(parent, tabsConfig) {
        const tabContainer = document.createElement('div');
        tabContainer.className = 'tab-container';
        const contentContainer = document.createElement('div');
        contentContainer.className = 'tab-content-container';

        tabsConfig.forEach((config, index) => {
            const tabButton = document.createElement('button');
            tabButton.className = 'tab-button';
            tabButton.textContent = config.name;
            tabButton.addEventListener('click', () => {
                tabContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                contentContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                tabButton.classList.add('active');
                config.content.classList.add('active');
                // After making the content visible, trigger resize on any auto-resizing textareas within it.
                // This fixes the issue where hidden textareas don't resize on initial load.
                config.content.querySelectorAll('textarea[data-auto-resize="true"]').forEach(ta => {
                    ta.dispatchEvent(new CustomEvent('resize'));
                });
            });
            tabContainer.appendChild(tabButton);
            contentContainer.appendChild(config.content);
            if (index === 0) tabButton.click(); // Activate the first tab
        });
        parent.append(tabContainer, contentContainer);
    }

    function showAiConfigModal() {
        return new Promise(async (resolve) => {
            const { modal, overlay, closeModalAndResolve } = createBaseModal('injector-modal-config');

            const closeModal = (data) => closeModalAndResolve(resolve, data);

            const h2 = document.createElement('h2');
            h2.textContent = 'AI Configuration';

            const configContent = document.createElement('div');
            configContent.className = 'ai-config-content';

            const apiKeyLabel = document.createElement('label');
            apiKeyLabel.htmlFor = 'gemini-api-key-input';
            apiKeyLabel.textContent = 'Gemini API Key';
            const apiKeyWrapper = document.createElement('div');
            apiKeyWrapper.className = 'api-key-wrapper';
            const apiKeyInput = document.createElement('input');
            apiKeyInput.type = 'password';
            apiKeyInput.id = 'gemini-api-key-input';
            apiKeyInput.placeholder = 'Enter your key...';
            const saveApiKeyBtn = document.createElement('button');
            saveApiKeyBtn.id = 'save-api-key-btn';
            saveApiKeyBtn.textContent = 'Save Key';
            apiKeyWrapper.append(apiKeyInput, saveApiKeyBtn);

            const modelLabel = document.createElement('label');
            modelLabel.htmlFor = 'gemini-model-select';
            modelLabel.textContent = 'LLM Model for Refinement';
            const modelSelect = document.createElement('select');
            modelSelect.id = 'gemini-model-select';
            AVAILABLE_MODELS.forEach(modelName => modelSelect.add(new Option(modelName, modelName)));

            // --- Create Textareas for Tabs ---
            const metaPromptTextareaWithContext = document.createElement('textarea');
            metaPromptTextareaWithContext.className = 'meta-prompt-textarea';
            const metaPromptTextareaWithoutContext = document.createElement('textarea');
            metaPromptTextareaWithoutContext.className = 'meta-prompt-textarea';

            // --- Create Tab Content Panes ---
            const contentWithContext = document.createElement('div');
            contentWithContext.className = 'tab-content';
            contentWithContext.appendChild(metaPromptTextareaWithContext);
            const contentWithoutContext = document.createElement('div');
            contentWithoutContext.className = 'tab-content';
            contentWithoutContext.appendChild(metaPromptTextareaWithoutContext);
            configContent.append(apiKeyLabel, apiKeyWrapper, modelLabel, modelSelect);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'injector-buttons';
            const closeButton = document.createElement('button');
            closeButton.id = 'injector-cancel';
            closeButton.textContent = 'Close';
            const saveAllButton = document.createElement('button');
            saveAllButton.id = 'injector-save';
            saveAllButton.textContent = 'Save & Close';
            buttonsDiv.append(closeButton, saveAllButton);

            // Create and append the tabs
            createTabs(configContent, [
                { name: 'Refiner Prompt (with context)', content: contentWithContext },
                { name: 'Refiner Prompt (without context)', content: contentWithoutContext }
            ]);

            modal.append(h2, configContent, buttonsDiv); // Append buttons after content


            // --- Load existing values ---
            const savedKey = await GM_getValue(STORAGE_KEY_GEMINI_API_KEY, null);
            if (savedKey) apiKeyInput.placeholder = "Key is set. Enter a new key to overwrite.";
            metaPromptTextareaWithContext.value = await GM_getValue(STORAGE_KEY_META_PROMPT_WITH_CONTEXT, DEFAULT_META_PROMPT_WITH_CONTEXT);
            metaPromptTextareaWithoutContext.value = await GM_getValue(STORAGE_KEY_META_PROMPT_WITHOUT_CONTEXT, DEFAULT_META_PROMPT_WITHOUT_CONTEXT);
            const savedModel = await GM_getValue(STORAGE_KEY_SELECTED_LLM_MODEL, AVAILABLE_MODELS[0]);
            if (AVAILABLE_MODELS.includes(savedModel)) modelSelect.value = savedModel;

            // --- Enable auto-resizing for textareas ---
            autoResizeTextarea(metaPromptTextareaWithContext);
            autoResizeTextarea(metaPromptTextareaWithoutContext);

            // --- Event Listeners ---
            saveApiKeyBtn.addEventListener('click', async () => {
                const newKey = apiKeyInput.value.trim();
                if (newKey) {
                    await GM_setValue(STORAGE_KEY_GEMINI_API_KEY, newKey);
                    apiKeyInput.value = '';
                    apiKeyInput.placeholder = "Key is set. Enter a new key to overwrite.";
                    showToast("API Key saved successfully!", "success");
                }
            });

            const saveAllSettings = async () => {
                const withContext = metaPromptTextareaWithContext.value.trim();
                const withoutContext = metaPromptTextareaWithoutContext.value.trim();
                const selectedModel = modelSelect.value;
                await GM_setValue(STORAGE_KEY_META_PROMPT_WITH_CONTEXT, withContext);
                await GM_setValue(STORAGE_KEY_META_PROMPT_WITHOUT_CONTEXT, withoutContext);
                await GM_setValue(STORAGE_KEY_SELECTED_LLM_MODEL, selectedModel);
                showToast("AI Configuration saved!", "success");
            };

            saveAllButton.addEventListener('click', async () => {
                await saveAllSettings();
                closeModal();
            });

            closeButton.addEventListener('click', () => closeModal());
            overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
        });
    }

    async function showImportSVGModal() {
        return new Promise(resolve => {
            // Use a unique ID for this modal to apply specific styles.
            const { modal, overlay, closeModalAndResolve } = createBaseModal('injector-modal-import-svg');

            // This wrapper correctly handles closing the modal and resolving the promise.
            const closeModal = (data) => {
                closeModalAndResolve(resolve, data);
            };

            const h2 = document.createElement('h2');
            h2.textContent = 'Import Custom Icon';
            const p = document.createElement('p');
            p.textContent = 'Paste your SVG code below. The script will securely parse it.';

            const textarea = document.createElement('textarea');
            textarea.id = 'injector-textarea';
            textarea.placeholder = '<svg viewBox="0 0 24 24">...</svg>';

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'injector-buttons';

            const cancelButton = document.createElement('button');
            cancelButton.id = 'injector-cancel';
            cancelButton.textContent = 'Cancel';

            const importButton = document.createElement('button');
            importButton.id = 'injector-save';
            importButton.textContent = 'Import';

            buttonsDiv.append(cancelButton, importButton);
            modal.append(h2, p, textarea, buttonsDiv);
            textarea.focus();

            importButton.addEventListener('click', () => {
                try {
                    const instruction = parseSvgString(textarea.value);
                    closeModal(instruction);
                } catch (error) {
                    showToast(error.message, 'error');
                }
            });
            cancelButton.addEventListener('click', () => closeModal(null));
            overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(null); });
        });
    }

    /**
     * Securely parses an SVG string into a serializable "build instruction" object.
     * @param {string} svgString - The raw SVG code string.
     * @returns {{viewBox: string, children: Array<{tag: string, attrs: object}>}} The build instruction object.
     */
     function parseSvgString(svgString) {
         if (!svgString || !svgString.trim()) throw new Error("SVG code cannot be empty.");

         // Use regex to extract the viewBox from the <svg> tag
         const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
         const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

         const buildInstruction = { viewBox, children: [] };

         // Regex to find all self-closing or container tags within the SVG
         const tagRegex = /<([a-zA-Z0-9]+)\s*([^>]*?)\s*(\/>|>)/g;
         let match;

         while ((match = tagRegex.exec(svgString)) !== null) {
             const tagName = match[1];
             if (tagName.toLowerCase() === 'svg') continue; // Skip the root svg tag

             const attributesString = match[2];
             const childInstruction = { tag: tagName, attrs: {} };

             // Regex to parse attributes (e.g., d="..." fill="#fff")
             const attrRegex = /([a-zA-Z0-9\-:]+)="([^"]+)"/g;
             let attrMatch;
             while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
                 // Exclude color attributes to allow CSS to take over
                 if (attrMatch[1] !== 'fill' && attrMatch[1] !== 'stroke') {
                     childInstruction.attrs[attrMatch[1]] = attrMatch[2];
                 }
             }
             buildInstruction.children.push(childInstruction);
         }

         if (buildInstruction.children.length === 0) {
             throw new Error("Could not parse any child elements from the SVG string.");
         }

         return buildInstruction;
     }

    /**
     * Shows a generic modal for single text input.
     * @param {{title: string, message: string, placeholder?: string}} options
     * @returns {Promise<string|null>} The user's input or null if cancelled.
     */
    function showInputModal({ title, message, placeholder = '', submitText = 'Submit', modalId = 'injector-modal', isTextarea = false, initialValue = '', isReadOnly = false, isLarge = false }) {
        return new Promise(resolve => {
            const { modal, overlay, closeModalAndResolve } = createBaseModal(modalId);

            const closeModal = (data) => {
                closeModalAndResolve(resolve, data);
            };

            if (isLarge) {
                modal.classList.add('injector-modal-large');
            } else if (isTextarea) {
                modal.style.maxWidth = '600px'; // Make this modal a bit wider for the text area
            }

            const h2 = document.createElement('h2');
            h2.textContent = title;
            const p = document.createElement('p');
            p.textContent = message;
            const inputElement = isTextarea ? document.createElement('textarea') : document.createElement('input');
            inputElement.id = isTextarea ? 'injector-textarea' : 'injector-input-name';
            inputElement.placeholder = placeholder;
            inputElement.value = initialValue;
            if (isTextarea && !isLarge) {
                inputElement.rows = 15;
            } else if (isTextarea && isLarge) {
                inputElement.style.flexGrow = '1'; // Allow it to fill space
            }
            if (isReadOnly) inputElement.readOnly = true;

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'injector-buttons';
            const cancelButton = document.createElement('button');
            cancelButton.id = 'injector-cancel';
            cancelButton.textContent = 'Cancel';
            const submitButton = document.createElement('button');
            submitButton.id = 'injector-save';
            submitButton.textContent = submitText;

            buttonsDiv.append(cancelButton, submitButton);
            modal.append(h2, p, inputElement, buttonsDiv);
            inputElement.focus();

            submitButton.addEventListener('click', () => {
                // For a read-only modal, the submit button just closes it.
                // Otherwise, it resolves with the value.
                const result = isReadOnly ? null : inputElement.value.trim();
                closeModal(result);
            });
            cancelButton.addEventListener('click', () => closeModal(null));
            overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(null); });
        });
    }

    function showIconSearchModal() {
        return new Promise(resolve => {
            const { modal, overlay, closeModalAndResolve } = createBaseModal('injector-modal-search-results');

            const closeModal = (data) => {
                closeModalAndResolve(resolve, data);
            };

            const h2 = document.createElement('h2');
            h2.textContent = 'Search Online Icons';

            const searchContainer = document.createElement('div');
            searchContainer.className = 'icon-search-container';
            const input = document.createElement('input');
            input.placeholder = "e.g., 'rocket', 'user'";
            const searchButton = document.createElement('button');
            searchButton.textContent = 'Search';
            searchContainer.append(input, searchButton);

            const iconGrid = document.createElement('div');
            iconGrid.className = 'icon-search-results-grid';

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'injector-buttons';
            const closeButton = document.createElement('button');
            closeButton.id = 'injector-cancel';
            closeButton.textContent = 'Close';
            buttonsDiv.append(closeButton);

            modal.append(h2, searchContainer, iconGrid, buttonsDiv);
            input.focus();

            const performSearch = async () => {
                const query = input.value.trim();
                if (!query) return;

                searchButton.disabled = true;
                searchButton.textContent = '...';
                // Clear previous results and show loading message safely
                iconGrid.textContent = '';
                const loadingP = document.createElement('p');
                loadingP.textContent = 'Loading...';
                iconGrid.appendChild(loadingP);

                try {
                    const iconNames = await searchIconify(query);
                    iconGrid.textContent = ''; // Clear loading message
                    if (iconNames.length === 0) {
                        const noResultsP = document.createElement('p');
                        noResultsP.textContent = 'No icons found for your query.';
                        iconGrid.appendChild(noResultsP);
                        return;
                    }

                    Promise.all(iconNames.map(async (name) => {
                        const svgText = await fetchIconifySVG(name);
                        const buildInstruction = parseSvgString(svgText);
                        // Per memory_bank.md, all icons must be built programmatically.
                        // createIconElement handles this requirement.
                        const iconElement = createIconElement(null, buildInstruction);
                        const button = document.createElement('button');
                        button.className = 'icon-picker-button';
                        button.dataset.iconName = name;
                        button.title = name;
                        button.appendChild(iconElement);
                        button.addEventListener('click', () => closeModal(name));
                        return button;
                    })).then(buttons => buttons.forEach(btn => btn && iconGrid.appendChild(btn)));
                } catch (error) {
                    iconGrid.textContent = ''; // Clear loading message
                    const errorP = document.createElement('p');
                    errorP.className = 'error-message';
                    errorP.textContent = error.message;
                    iconGrid.appendChild(errorP);
                } finally {
                    searchButton.disabled = false;
                    searchButton.textContent = 'Search';
                }
            };

            searchButton.addEventListener('click', performSearch);
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') performSearch(); });
            closeButton.addEventListener('click', () => closeModal(null));
            overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(null); });
        });
    }

    async function showConfirmationModal({ title, message }) {
        return new Promise(async (resolve) => {
            const { modal, overlay, closeModalAndResolve } = createBaseModal('injector-modal-confirm');

            const closeModal = (data) => {
                closeModalAndResolve(resolve, data);
            };

            const h2 = document.createElement('h2');
            h2.textContent = title;
            const p = document.createElement('p');
            p.textContent = message;
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'injector-buttons confirmation';
            const cancelButton = document.createElement('button');
            cancelButton.dataset.choice = 'false';
            cancelButton.className = 'cancel';
            cancelButton.textContent = 'Cancel';
            const confirmButton = document.createElement('button');
            confirmButton.dataset.choice = 'true';
            confirmButton.className = 'confirm-delete';
            confirmButton.textContent = 'Confirm';
            buttonsDiv.append(cancelButton, confirmButton);
            modal.append(h2, p, buttonsDiv);

            buttonsDiv.addEventListener('click', (e) => {
                if (e.target.dataset.choice) closeModal(e.target.dataset.choice === 'true');
            });
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal(false);
            });
        });
    }

    /**
     * Creates and displays a custom context menu at the event coordinates.
     */
    function showContextMenu(event, profile) {
        return new Promise(resolve => {
            // Remove any existing context menu to prevent duplicates
            const existingMenu = document.getElementById('injector-context-menu');
            if (existingMenu) existingMenu.remove();

            const menu = document.createElement('div');
            menu.id = 'injector-context-menu';

            const options = [
                { choice: 'default', text: state.defaultProfileId === profile.id ? '✓ Default' : 'Set as Default' },
                { choice: 'edit', text: 'Edit' },
                { choice: 'delete', text: 'Delete' }
            ];

            options.forEach(opt => {
                const button = document.createElement('button');
                button.dataset.choice = opt.choice;
                button.textContent = opt.text;
                menu.appendChild(button);
            });

            document.body.appendChild(menu);

            // Position the menu
            const { clientX: mouseX, clientY: mouseY } = event;
            const menuWidth = menu.offsetWidth;
            const menuHeight = menu.offsetHeight;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            let top = mouseY;
            let left = mouseX;

            if (mouseX + menuWidth > screenWidth) left = screenWidth - menuWidth - 5;
            if (mouseY + menuHeight > screenHeight) top = screenHeight - menuHeight - 5;

            menu.style.top = `${top}px`;
            menu.style.left = `${left}px`;
            menu.classList.add('visible');

            const closeMenu = (choice = null) => {
                menu.remove();
                document.removeEventListener('click', handleGlobalClick, true);
                resolve(choice);
            };

            const handleGlobalClick = (e) => { if (!menu.contains(e.target)) closeMenu(null); };
            menu.addEventListener('click', (e) => closeMenu(e.target.dataset.choice));
            setTimeout(() => document.addEventListener('click', handleGlobalClick, true), 0);
        });
    }

    function showProfileManagerModal({ startWithProfileId = null, startWithAdd = false } = {}) { // NOSONAR
        return new Promise(async (resolve) => {
            const { modal, overlay, closeModalAndResolve } = createBaseModal('injector-modal-manager');

            const closeModal = (data) => {
                closeModalAndResolve(resolve, data);
            };

            // --- Create the two-pane layout ---
            const h2 = document.createElement('h2');
            h2.textContent = 'Profile Manager';
            const explorerContainer = document.createElement('div');
            explorerContainer.className = 'explorer-container';
            const profileGrid = document.createElement('div');
            profileGrid.className = 'explorer-grid';
            const editorPane = document.createElement('div');
            editorPane.className = 'editor-pane empty';
            editorPane.textContent = "Select a profile to edit, or click 'Add New Profile' to begin.";

            // --- Helper function to render the profile list (Sprint 2) ---
            const renderProfileList = (selectedProfileId = null) => {
                while (profileGrid.firstChild) {
                    profileGrid.removeChild(profileGrid.firstChild);
                }

                // 1. "Add New Profile" Card
                const addNewCard = document.createElement('div');
                addNewCard.className = 'explorer-card add-new-profile-card';
                if (selectedProfileId === 'add-new') {
                    addNewCard.classList.add('selected');
                }
                const addNewHeader = document.createElement('div');
                addNewHeader.className = 'explorer-card-header';
                addNewHeader.textContent = '＋ Add New Profile';
                addNewCard.appendChild(addNewHeader);
                profileGrid.appendChild(addNewCard);

                // 2. Existing Profile Cards
                state.profiles.forEach(p => {
                    const card = document.createElement('div');
                    card.className = 'explorer-card';
                    card.dataset.profileId = p.id;
                    if (p.id === selectedProfileId) {
                        card.classList.add('selected');
                    }
                    if (p.id === state.defaultProfileId) {
                        card.classList.add('default');
                    }

                    const header = document.createElement('div');
                    header.className = 'explorer-card-header';
                    const icon = createIconElement(p.icon);
                    const name = document.createElement('span');
                    name.textContent = p.name;
                    header.append(icon, name);
                    card.appendChild(header);
                    profileGrid.appendChild(card);
                });
            };

            // Listen for the custom event dispatched by the "Set as Default" button
            // This allows the list to re-render instantly without complex prop drilling.
            profileGrid.addEventListener('profileListShouldUpdate', () => {
                renderProfileList(parseInt(editorPane.querySelector('.explorer-card.selected')?.dataset.profileId, 10) || null);
            });

            // --- Core Click Logic (Sprint 2) ---
            profileGrid.addEventListener('click', async (e) => {
                const card = e.target.closest('.explorer-card');
                if (!card) return;

                let profileToEdit = null;
                let selectedId = null;

                if (card.classList.contains('add-new-profile-card')) {
                    selectedId = 'add-new';
                } else {
                    const profileId = parseInt(card.dataset.profileId, 10);
                    profileToEdit = state.profiles.find(p => p.id === profileId);
                    if (!profileToEdit) return;
                    selectedId = profileId;
                }

                renderProfileList(selectedId); // Re-render list to show selection
                editorPane.classList.remove('empty');

                // This loop ensures the editor is always interactive until the user selects another profile.
                while (true) {
                    const result = await renderEditorForProfile(profileToEdit, editorPane);

                    if (!result) { // User clicked "Cancel" in the editor
                        break; // Exit the loop, leaving the editor as is.
                    }

                    if (result.action === 'delete') {
                        const confirmed = await showConfirmationModal({
                            title: "Delete Profile",
                            message: `Are you sure you want to delete the "${profileToEdit.name}" profile? This cannot be undone.`
                        });

                        if (confirmed) {
                            await deleteProfile(profileToEdit.id);
                            showToast(`Profile "${profileToEdit.name}" deleted.`, 'success');
                            renderProfileList(); // Re-render list with no selection
                            while (editorPane.firstChild) {
                                editorPane.removeChild(editorPane.firstChild);
                            }
                            editorPane.textContent = "Select a profile to edit, or click 'Add New Profile' to begin.";
                            editorPane.classList.add('empty');
                            break; // Exit loop, as the profile is gone.
                        }
                        // If delete was canceled, the loop continues, re-rendering the editor.

                    } else if (profileToEdit) { // User clicked "Save" on an existing profile
                        profileToEdit = await updateProfile({ ...profileToEdit, ...result });
                        renderProfileList(profileToEdit.id);
                        // Loop continues, re-rendering the editor for the updated profile.

                    } else if (profileToEdit) { // Editing existing profile
                        const updatedProfile = await updateProfile({ ...profileToEdit, ...result });
                        renderProfileList(updatedProfile.id); // Keep selection on the updated profile
                    } else { // Creating new profile
                        const newProfile = await addProfile(result);
                        showToast(`Profile "${newProfile.name}" created!`, 'success');

                        // Animate the save button from the editor pane
                        const saveButton = editorPane.querySelector('#injector-save');
                        if (saveButton) {
                            saveButton.classList.add('success');
                            saveButton.addEventListener('animationend', () => saveButton.classList.remove('success'), { once: true });
                        }

                        // Re-render the list and switch to editing the new profile
                        renderProfileList(newProfile.id);
                        profileToEdit = newProfile; // Continue the loop in edit mode for the new profile
                    }
                }
            });

            // --- Initial State Logic (Sprint 2) ---
            renderProfileList(startWithProfileId);
            if (startWithAdd) {
                // Simulate a click on the "Add New" card
                profileGrid.querySelector('.add-new-profile-card').click();
            } else if (startWithProfileId) {
                // Simulate a click on the specific profile card
                const cardToSelect = profileGrid.querySelector(`.explorer-card[data-profile-id="${startWithProfileId}"]`);
                if (cardToSelect) {
                    cardToSelect.click();
                }
            }

            // --- Final Assembly (Moved to the end) ---
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'injector-buttons';
            const closeButton = document.createElement('button');
            closeButton.id = 'injector-cancel';
            closeButton.textContent = 'Close';
            buttonsDiv.append(closeButton);
            explorerContainer.append(profileGrid, editorPane);
            modal.append(h2, explorerContainer, buttonsDiv);

            closeButton.addEventListener('click', () => closeModal(null));
            overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(null); });
        });
    }

    /**
     * Waits for a specific element to appear in the DOM.
     * @param {string} selector The CSS selector for the element.
     * @param {number} timeout The maximum time to wait in milliseconds.
     * @returns {Promise<Element|null>} A promise that resolves with the element or null if timed out.
     */
    function waitForElement(selector, timeout = TIMEOUTS.WAIT_FOR_ELEMENT) {
        return new Promise(resolve => {
            const existingElement = document.querySelector(selector);
            if (existingElement) return resolve(existingElement);

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearTimeout(timer);
                    observer.disconnect();
                    resolve(element);
                }
            });

            const timer = setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    /**
     * Closes the system instructions panel by clicking the overlay backdrop.
     * @returns {Promise<void>} A promise that resolves when the panel is closed.
     */
    async function closeInstructionsPanel(wasSidebarInitiallyOpen) {
        // Step 1: Wait for the modal's close button to appear and then click it.
        // The modal is inside a `mat-dialog-container`. The close button has a specific aria-label.
        const modalCloseButton = await waitForElement('mat-dialog-container button[aria-label="Close panel"]', TIMEOUTS.MODAL_UI_WAIT);
        if (modalCloseButton) {
            modalCloseButton.click();
            // Wait for the modal's textarea to disappear before proceeding.
            await waitForElementToDisappear(SELECTORS.systemInstructionsTextArea);
        } else {
            console.warn(`[${SCRIPT_NAME}] Could not find the modal close button to click.`);
        }

        // Step 2: Only close the main "Run settings" panel if the script opened it.
        if (!wasSidebarInitiallyOpen) {
            // We wait a brief moment for the UI to settle after the modal closes.
            await new Promise(resolve => setTimeout(resolve, TIMEOUTS.UI_SETTLE));
            const sidePanel = document.querySelector('ms-right-side-panel');
            if (sidePanel) {
                const panelCloseButton = sidePanel.querySelector('button[aria-label="Close run settings panel"]');
                if (panelCloseButton) {
                    panelCloseButton.click();
                await waitForElementToDisappear('ms-right-side-panel .settings-items-wrapper');
                }
            }
        }
    }

    function waitForElementToDisappear(selector, timeout = TIMEOUTS.MODAL_UI_WAIT) {
        return new Promise(resolve => {
            if (!document.querySelector(selector)) {
                return resolve();
            }

            const observer = new MutationObserver((mutations, obs) => {
                if (!document.querySelector(selector)) {
                    clearTimeout(timer);
                    obs.disconnect();
                    resolve();
                }
            });

            const timer = setTimeout(() => {
                observer.disconnect();
                console.warn(`[${SCRIPT_NAME}] waitForElementToDisappear timed out for selector: ${selector}`);
                resolve(); // Resolve anyway to not block the script
            }, timeout);

            observer.observe(document.body, {
                childList: true, subtree: true
            });
        });
    }

    async function injectText(text) {
        // First, check if the sidebar is already open before we do anything.
        const wasSidebarInitiallyOpen = !!document.querySelector('ms-right-side-panel .settings-items-wrapper');

        let textArea = document.querySelector(SELECTORS.systemInstructionsTextArea);

        // If the text area isn't visible, we need to open the panels.
        if (!textArea) {
            // 1. Ensure the main "Run settings" panel is open.
            // We check the initial state again in case it was already open.
            if (!wasSidebarInitiallyOpen) {
                const openButton = await waitForElement(SELECTORS.runSettingsButton, TIMEOUTS.MODAL_UI_WAIT);
                if (openButton) {
                    openButton.click();
                }
            }

            // 2. Click the "System instructions" card within the panel.
            const instructionsCard = await waitForElement(SELECTORS.systemInstructionsCard, TIMEOUTS.MODAL_UI_WAIT);
            if (instructionsCard) {
                instructionsCard.click();
                // 3. Wait for the modal with the textarea to appear.
                textArea = await waitForElement(SELECTORS.systemInstructionsTextArea, TIMEOUTS.MODAL_UI_WAIT);
            }
        }

        if (textArea) {
            // This sequence is crucial for React-based inputs to recognize the change.
            textArea.value = text;
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            textArea.dispatchEvent(new Event('blur', { bubbles: true }));
            await closeInstructionsPanel(wasSidebarInitiallyOpen);
        } else {
            showToast("Injection failed: could not find or open the instructions panel.", "error");
            console.error(`[${SCRIPT_NAME}] Injection process failed. Could not find one of the required elements: Run Settings Button, Instructions Card, or Text Area.`);
        }
    }

    function showToast(message, type = 'info') {
        let container = document.getElementById('injector-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'injector-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `injector-toast ${type}`;

        const iconDiv = document.createElement('div');
        iconDiv.className = 'toast-icon';
        const icons = { success: '✔', error: '✖', info: 'ℹ' };
        iconDiv.textContent = icons[type] || 'ℹ';

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;

        toast.append(iconDiv, messageDiv);
        container.appendChild(toast);

        setTimeout(() => toast.classList.add('fade-out'), 3000); // Start fade-out after 3 seconds
        toast.addEventListener('animationend', (event) => {
            // Only remove the toast after the fade-out animation has completed
            if (event.animationName === 'toast-fade-out') {
                toast.remove();
            }
        });
    }

    //================================================================================
    // SECTION: Styling
    //================================================================================

    GM_addStyle(`
        /* The invisible hover area at the bottom of the screen */
        #profile-dock-trigger {
            position: fixed;
            bottom: 0;
            left: 50%; /* Center the trigger */
            transform: translateX(-50%); /* Adjust for its own width */
            width: 800px; /* Match the max-width of the dock */
            max-width: 100%; /* Ensure it doesn't overflow on small screens */
            height: 10px;
            z-index: 9980;
            /* background: rgba(255, 0, 0, 0.3); */ /* DEBUG: Make trigger area visible */
        }
        #profile-dock-container {
            position: fixed; bottom: 0; left: 0; width: 100%; z-index: 9981;
            transform: translateY(100%); transition: transform 0.3s ease-in-out; pointer-events: none;
        }
        #profile-dock-container.visible { transform: translateY(0); }
        #profile-dock {
            display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; padding: 16px;
            background: rgba(45, 45, 45, 0.9); backdrop-filter: blur(8px);
            border-top: 1px solid #444; border-radius: 16px 16px 0 0;
            max-width: 800px; margin: 0 auto; pointer-events: auto; /* Only the dock itself is interactive */
        }
        .profile-button {
            width: 50px; height: 50px; border-radius: 50%; border: 2px solid #666; background-color: #333; color: #fff;
            display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;
        }
        .profile-button:hover { background-color: #444; border-color: #8e24aa; transform: translateY(-3px); }
        .profile-button.default {
            border-color: #3498db; /* Blue border for default profile */
            background-color: #1f2b38; /* Dark blue background for default */
            animation: pulse-default 2s infinite ease-in-out; /* Add the pulsing animation */
        }
        .profile-button.active { border-color: #c0392b; background-color: #555; box-shadow: 0 0 15px rgba(231, 76, 60, 0.5); }
        .profile-button svg { width: 24px; height: 24px; pointer-events: none; }
        .profile-button.dragging { opacity: 0.5; border-style: dashed; }
        .add-new-button { border-style: dashed; background-color: transparent; color: #888; font-size: 1.5em; }
        .add-new-button:hover { background-color: #222; color: #fff; }
        .explorer-button { border-style: solid; }
        .dock-empty-state { color: #888; font-size: 0.9em; padding: 0 20px; text-align: center; }

        /* Modal & Overlay Styles */
        #injector-overlay, #injector-overlay-search-results { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 20000; }
        #injector-modal {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #2d2d2d; color: #e0e0e0; border-radius: 12px; padding: 24px;
            width: 100vw; height: 100vh;
            z-index: 20001; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #444;
            display: flex; flex-direction: column;
            max-height: 95vh; /* Prevent overflow on very short screens */
            max-width: 95vw;
            box-sizing: border-box;
        }
        #injector-modal-import-svg { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2d2d2d; color: #e0e0e0; border-radius: 12px; padding: 24px; width: 90%; max-width: 500px; z-index: 20001; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #444; display: flex; flex-direction: column; }
        #injector-modal-confirm { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2d2d2d; color: #e0e0e0; border-radius: 12px; padding: 24px; width: 90%; max-width: 450px; z-index: 20002; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #444; display: flex; flex-direction: column; }
        #injector-modal-config { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2d2d2d; color: #e0e0e0; border-radius: 12px; padding: 24px; width: 90%; max-width: 900px; z-index: 20002; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #444; display: flex; flex-direction: column; }
        #injector-modal-manager { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2d2d2d; color: #e0e0e0; border-radius: 12px; padding: 24px; width: 95vw; max-width: 1600px; height: 90vh; z-index: 20001; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #444; display: flex; flex-direction: column; }
        #injector-modal-main-content {
            flex: 1; /* This is the key: make this content area grow */
            display: flex; flex-direction: column;
            overflow-y: auto; /* Allow scrolling for content if it overflows */
        }
        .injector-modal-large {
            width: 80vw !important;
            height: 85vh !important;
            display: flex; flex-direction: column;
            overflow-y: auto; /* Allow scrolling for content if it overflows */
        }
        #injector-modal-search-results { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2d2d2d; color: #e0e0e0; border-radius: 12px; padding: 24px; width: 90%; max-width: 600px; z-index: 20001; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #444; display: flex; flex-direction: column; }
        #injector-modal h2 { margin-top: 0; font-size: 1.4em; color: #fff; }
        #injector-modal p { margin-bottom: 16px; line-height: 1.5; color: #ccc; }
        #injector-modal #injector-textarea[readonly] { background: #1e1e1e; color: #999; cursor: default; }
        #injector-modal-search-results p { text-align: center; color: #999; }
        #injector-modal-search-results .error-message { color: #e74c3c; }
        .icon-search-container { display: flex; gap: 8px; margin-bottom: 16px; }
        .icon-search-container input { flex-grow: 1; background: #1e1e1e; color: #e0e0e0; border: 1px solid #555; border-radius: 8px; padding: 12px; font-family: sans-serif; font-size: 14px; box-sizing: border-box; }
        .injector-label { display: block; margin: 16px 0 6px; font-weight: bold; color: #aaa; }
        #injector-input-name, #injector-textarea, #ai-refiner-guidance { width: 100%; background: #1e1e1e; color: #e0e0e0; border: 1px solid #555; border-radius: 8px; padding: 12px; font-family: sans-serif; font-size: 14px; box-sizing: border-box; }
        .profile-name-wrapper { display: flex; align-items: center; gap: 12px; }
        .profile-name-input { flex-grow: 1; }
        #injector-textarea { resize: vertical; font-family: monospace; }
        .set-default-button { background: #444; color: #fff; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; }
        .set-default-button.is-default { background: #3498db; }
        .meta-prompt-textarea { width: 100%; background: #1e1e1e; color: #e0e0e0; border: 1px solid #555; border-radius: 8px; padding: 12px; font-family: sans-serif; font-size: 12px; box-sizing: border-box; min-height: 120px; resize: vertical; margin-bottom: 12px; }
        .icon-picker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 8px; margin-top: 8px; max-height: 150px; overflow-y: auto; padding: 4px; background: #222; border-radius: 6px; }
        .icon-search-results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)); gap: 10px; margin-top: 16px; max-height: 40vh; overflow-y: auto; padding: 10px; background: #222; border-radius: 8px; }
        .icon-picker-button { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 2px solid #555; border-radius: 8px; background: #333; cursor: pointer; transition: all 0.2s ease; }
        .icon-picker-button:hover { border-color: #777; }
        .icon-picker-button.selected { border-color: #8e24aa; background: #4a2c55; }
        .icon-picker-button svg { width: 20px; height: 20px; color: #ccc; }
        .icon-picker-button.ai-generate { font-size: 1.5em; line-height: 1; border-style: dashed; border-color: #8e24aa; padding: 0; }
        .icon-picker-button.ai-generate:hover { background: #4a2c55; }
        .icon-picker-button[data-icon-name^="custom_"] { border-style: dashed; }
        .custom-icon-wrapper { position: relative; }
        .custom-icon-delete-btn {
            position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; border-radius: 50%;
            background: #c0392b; color: white; border: 1px solid #2d2d2d;
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; font-weight: bold; line-height: 1;
            cursor: pointer; opacity: 0; transform: scale(0.5); transition: all 0.2s ease;
            pointer-events: none;
        }
        .custom-icon-wrapper:hover .custom-icon-delete-btn { opacity: 1; transform: scale(1); pointer-events: auto; }
        .custom-icon-delete-btn:hover { background: #e74c3c; }
        .injector-buttons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .injector-buttons button { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.2s ease; }
        #injector-cancel, .injector-buttons .cancel { background: #444; color: #fff; }
        #injector-cancel:hover, .injector-buttons .cancel:hover { background: #555; }
        #injector-save.success { animation: button-success-pulse 0.6s ease; }
        #injector-save { background: #8e24aa; color: #fff; }
        #injector-save:hover { background: #a042c0; }
        .injector-buttons .delete, .injector-buttons .confirm-delete { background: #c0392b; color: #fff; }
        .injector-buttons .delete:hover, .injector-buttons .confirm-delete:hover { background: #e74c3c; }

        /* Profile Explorer Styles */
        #injector-context-menu { position: fixed; z-index: 20002; background: #3a3a3a; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); padding: 6px; display: flex; flex-direction: column; opacity: 0; transform: scale(0.95); transition: all 0.1s ease-out; }
        #injector-context-menu.visible { opacity: 1; transform: scale(1); }
        #injector-context-menu button { background: none; border: none; color: #e0e0e0; text-align: left; padding: 8px 12px; border-radius: 4px; cursor: pointer; width: 100%; }
        #injector-context-menu button:hover { background: #8e24aa; }
        #injector-context-menu button[data-choice="delete"]:hover { background: #c0392b; }
        #injector-context-menu button[data-choice="default"]:hover { background: #3498db; }


        .explorer-card {
            background: #3a3a3a; border-radius: 8px; border: 1px solid #444;
            padding: 12px; display: flex; flex-direction: column;
            transition: all 0.2s ease; pointer-events: none; /* Let parent handle clicks */
        }
        .explorer-card.default { border-left: 4px solid #3498db; }
        .explorer-card:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .explorer-card-header { display: flex; align-items: center; gap: 10px; font-weight: bold; margin-bottom: 8px; }
        .explorer-card-header svg { width: 20px; height: 20px; flex-shrink: 0; }
        .explorer-card-instructions {
            flex: 1; font-size: 0.9em; color: #bbb; line-height: 1.4;
            margin: 0 0 12px; max-height: 100px; overflow: hidden;
            display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;
        }
        .explorer-card-actions { display: flex; gap: 8px; margin-top: auto; }
        .explorer-card-actions button { flex: 1; padding: 6px 10px; border: 1px solid #555; background: #444; color: #fff; border-radius: 4px; cursor: pointer; font-size: 0.9em; }
        .explorer-card-actions button:hover { background: #555; }
        .explorer-card-actions button.delete { border-color: #c0392b; background: transparent; color: #c0392b; }
        .explorer-card-actions button.delete:hover { background: #c0392b; color: #fff; }
        .injector-buttons .delete:hover, .injector-buttons .confirm-delete:hover { background: #e74c3c; }

        /* New Explorer Layout */
        .explorer-container { display: flex; flex: 1; min-height: 0; gap: 16px; padding: 16px 0; }
        .explorer-grid { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 8px; border-right: 1px solid #444; }
        .editor-pane { flex: 3; display: flex; flex-direction: column; min-height: 0; }
        .editor-pane.empty { align-items: center; justify-content: center; color: #666; font-style: italic; }
        .explorer-grid > .explorer-card { cursor: pointer; pointer-events: auto; } /* Make top-level cards clickable */
        .add-new-profile-card { border-style: dashed; }
        .explorer-card.selected { border-color: #8e24aa; background: #4a2c55; }

        /* Profile Preview Modal (replaces tooltip) */
        #profile-preview-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(2px); display: none; }
        #profile-preview-modal {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #2d2d2d; color: #e0e0e0; border-radius: 12px; padding: 24px;
            width: 90%; max-width: 800px; max-height: 80vh;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #444;
            overflow-y: auto; white-space: pre-wrap; line-height: 1.6;
            pointer-events: none; /* Prevent interaction with the preview itself */
            display: none;
        }

        /* Label & Inline Button Styles */
        .profile-tooltip {
            position: fixed;
            z-index: 20004; /* Above everything */
            background: #1e1e1e;
            color: #e0e0e0;
            border: 1px solid #555;
            border-radius: 8px;
            padding: 12px;
            max-width: 400px;
            font-size: 0.9em;
            line-height: 1.5;
            pointer-events: none; /* So it doesn't interfere with mouse events */
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            white-space: pre-wrap; /* This is the key change to preserve newlines */
        }
        .label-wrapper { display: flex; justify-content: space-between; align-items: center; }
        .inline-button { background: none; border: none; color: #8e24aa; cursor: pointer; padding: 0; font-size: 0.9em; }
        .view-context-link { margin-left: 8px; }
        .inline-button:hover { text-decoration: underline; }

        /* AI Refiner & Config Styles */
        .ai-refiner-container-wrapper {
            display: grid;
            grid-template-columns: 1fr; /* This ensures a single-column layout, stacking children vertically. */
            gap: 8px; /* Reduced gap for a tighter vertical layout */
            padding: 8px;
            background: #222;
            border-radius: 6px;
        }
        .ai-refiner-buttons { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .ai-refiner-center-group { display: flex; align-items: center; justify-content: center; gap: 8px; position: absolute; left: 50%; transform: translateX(-50%); }
        #ai-refiner-prev-btn, #ai-refiner-next-btn { background: #444; color: #fff; border: none; border-radius: 6px; cursor: pointer; width: 30px; height: 30px; font-size: 1.2em; line-height: 1; }
        #ai-refiner-history-counter { font-size: 0.9em; color: #999; min-width: 40px; text-align: center; }
        #ai-refiner-model-select { margin-left: auto; background: #1e1e1e; color: #e0e0e0; border: 1px solid #555; border-radius: 6px; padding: 4px 8px; font-size: 12px; z-index: 1; }
        #ai-refiner-prev-btn:hover, #ai-refiner-next-btn:hover { background: #555; }
        #ai-refiner-prev-btn:disabled, #ai-refiner-next-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        #ai-refiner-guidance { resize: vertical; font-size: 12px; padding: 6px 8px; }
        #ai-refiner-btn { background: none; border: 1px solid #8e24aa; color: #8e24aa; font-weight: bold; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
        #ai-refiner-btn:not(:disabled):hover { background: #4a2c55; }
        .checkbox-wrapper { display: flex; align-items: center; gap: 6px; }
        .checkbox-wrapper label { margin: 0; font-weight: normal; color: #ccc; }
        .instructions-section { margin-top: 20px; flex: 1; display: flex; flex-direction: column; min-height: 0; gap: 12px; }
        .instructions-section #injector-textarea { flex-grow: 1; /* Allow it to fill the parent's height, which is managed by flexbox */ }
        .instructions-section .ai-refiner-container-wrapper { flex-shrink: 0; }
        .ai-config-content { padding-bottom: 12px; max-height: 70vh; overflow-y: auto; }
        .ai-config-content label { display: block; margin-bottom: 6px; }
        .ai-config-content label[for^="meta-prompt"] { margin-top: 16px; }
        .api-key-wrapper { display: flex; gap: 8px; margin-bottom: 16px; }
        .api-key-wrapper input { flex-grow: 1; margin: 0; }
        .api-key-wrapper button, #save-meta-prompts-btn { background: #444; color: #fff; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; width: auto; }
        .api-key-wrapper button:hover { background: #555; }

        /* Tab Styles */
        .tab-container { display: flex; border-bottom: 1px solid #444; margin-top: 16px; }
        .tab-button { background: none; border: none; color: #aaa; padding: 10px 15px; cursor: pointer; font-size: 0.9em; border-bottom: 2px solid transparent; }
        .tab-button:hover { color: #fff; }
        .tab-button.active { color: #fff; border-bottom-color: #8e24aa; font-weight: bold; }
        .tab-content-container { padding: 16px 0; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .tab-content .meta-prompt-textarea {
            /* Remove bottom margin as the container now provides padding */
            margin-bottom: 0;
        }


        #gemini-model-select { width: 100%; background: #1e1e1e; color: #e0e0e0; border: 1px solid #555; border-radius: 8px; padding: 12px; font-family: sans-serif; font-size: 14px; box-sizing: border-box; margin-top: 6px; }


        /* Toast Styles */
        #injector-toast-container { position: fixed; top: 20px; right: 20px; z-index: 20003; display: flex; flex-direction: column; gap: 10px; }
        .injector-toast { display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; background: #333; color: #fff; border-left: 5px solid #555; box-shadow: 0 5px 15px rgba(0,0,0,0.4); animation: toast-fade-in 0.3s ease; min-width: 250px; }
        .injector-toast.fade-out { animation: toast-fade-out 0.4s ease forwards; }
        .injector-toast .toast-icon { margin-right: 12px; font-size: 1.2em; }
        .injector-toast.success { border-left-color: #2ecc71; } .injector-toast.success .toast-icon { color: #2ecc71; }
        .injector-toast.info { border-left-color: #3498db; } .injector-toast.info .toast-icon { color: #3498db; }
        .injector-toast.error { border-left-color: #e74c3c; } .injector-toast.error .toast-icon { color: #e74c3c; }
        @keyframes toast-fade-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes button-success-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); background-color: #2ecc71; } 100% { transform: scale(1); } }
        @keyframes pulse-default { 0% { box-shadow: 0 0 5px rgba(52, 152, 219, 0.3); } 50% { box-shadow: 0 0 15px rgba(52, 152, 219, 0.8); } 100% { box-shadow: 0 0 5px rgba(52, 152, 219, 0.3); } }
        @keyframes toast-fade-out { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
    `);

    //================================================================================
    // KICK-OFF (Replaced with a robust observer for SPA)
    //================================================================================

    // This is the new, intelligent entry point for the script.
    (function() {
        // A stable parent element that appears only when the chat UI is fully loaded.
        const keyElementSelector = 'ms-prompt-renderer';
        let lastUrl = location.href;

        console.log(`[${SCRIPT_NAME}] Observer waiting for chat UI...`);

        // This function will start the whole script once the page is ready.
        const startScript = async () => {
            // 1. Wait for the main chat UI container to appear in the DOM.
            // This is non-blocking and efficient. It's the key to working with SPAs.
            await waitForElement(keyElementSelector);
            console.log(`[${SCRIPT_NAME}] Chat UI detected.`);

            // 2. Run the main one-time setup (creating the dock, etc.).
            await main();

            // 3. Set up an observer to watch for URL changes (SPA navigation).
            // This detects when you click "New Chat" or open a saved prompt.
            new MutationObserver(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    console.log(`[${SCRIPT_NAME}] URL changed to: ${lastUrl}`);
                    // When the URL changes, we re-run our check to see if we should inject a profile.
                    checkForNewChatAndInject();
                }
            }).observe(document.body, { subtree: true, childList: true });
        };

        // Execute the startup function.
        startScript();
    })();

})();