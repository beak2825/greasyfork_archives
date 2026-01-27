// ==UserScript==
// @name         Redgifs Tag Helper
// @namespace    https://greasyfork.org/en/users/318296-thomased
// @version      1.7.5
// @description  Easily tag videos with curated Amateur/Studio categories (including specific acts like Creampie/Cumshot) and auto-expand the tag list.
// @author       Gemini 3 Pro
// @license      MIT
// @icon         https://www.redgifs.com/favicon.ico
// @match        https://www.redgifs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563851/Redgifs%20Tag%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/563851/Redgifs%20Tag%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // 1. BUILDING BLOCKS (Edit these lists to update tags everywhere)
    // =================================================================

    // --- COMMON TAGS (Applied to ALL lists) ---
    const TAGS_COMMON = [
        'Interracial', 'African American', 'BBC'
    ];

    // --- ANATOMY EXTRA ---
    const TAGS_ANATOMY_BASIC = ['Big Dick', 'Cock', 'Balls'];
    const TAGS_ANATOMY_STUDIO = ['Monster Cock', 'Thick Cock', 'Big Dick', 'Cock', 'Balls'];

    // --- CATEGORY HEADERS ---
    const HEADER_AMATEUR = ['Amateur', 'Homemade', 'POV', 'Real Couple', 'BMWF'];
    const HEADER_STUDIO  = ['Pornstar', 'Blacked'];

    // --- ACTION GROUPS (Optimized) ---
    
    // Oral Focus
    const ACT_BJ = [
        'Blowjob', 'Deepthroat', 'Oral', 'Face Fuck',
        'Handjob', 'Sucking', 'Gagging', 'Spit'
    ];

    // Other Oral & Mutual
    const ACT_ORAL_OTHER = [
        '69', 'Ass To Mouth', 'Cunnilingus', 'Rimming',
        'Facesitting', 'Kissing', 'Licking', 'Asslicking', 
        'Pussy Licking', 'Feet Licking', 'Massage', 'Foreplay', 'Tease'
    ];

    // Solo Content
    const ACT_SOLO = [
        'Solo', 'Masturbating', 'Fingering', 'Toys',
        'Dildo', 'Vibrator', 'Squirt', 'Moaning',
        'Dirty Talk', 'Tease', 'Nude', 'Undressing', 'Striptease'
    ];

    // --- HARDCORE SPLIT ---

    // 1. Creampie Focus (Inside)
    const ACT_CREAMPIE = [
        'Sex', 'Anal', 'Creampie', 'Breeding', 'Balls Deep', 
        'Deep Penetration', 'No Condom', 'Bareback',
        'Rough', 'Hardcore'
    ];

    // 2. Cumshot Focus (Outside/Face)
    const ACT_CUMSHOT = [
        'Sex', 'Anal', 'Cumshot', 'Facial', 'Cum In Mouth', 
        'Deep Penetration', 'Rough', 'Hardcore'
    ];

    // 3. Positions ONLY (New Button)
    const ACT_POSITIONS = [
        'Doggystyle', 'doggy style', 'Cowgirl', 'Missionary', 
        'POV', 'Squirt', 'Tight Ass', 'Ass Clapping'
    ];

    // 4. Hardcore Group (With multiple cumshots)
    const ACT_HARD_GROUP = [
        'Threesome', 'Group Sex', 'Double Penetration', 'Gangbang', 
        'Orgy', 'Bukkake', 'MMF', 'FFM', 
        'Anal', 'Creampie', 'multiple cumshots', 'Hardcore', 'Rough'
    ];


    // =================================================================
    // 2. FINAL LIST ASSEMBLY
    // =================================================================

    // --- AMATEUR LISTS ---
    const amateurBJ = [...TAGS_COMMON, ...HEADER_AMATEUR, ...ACT_BJ, ...TAGS_ANATOMY_BASIC];
    const amateurOral = [...TAGS_COMMON, ...HEADER_AMATEUR, ...ACT_ORAL_OTHER];
    const amateurSolo = [...TAGS_COMMON, ...HEADER_AMATEUR, ...ACT_SOLO];
    
    const amateurCreampie = [...TAGS_COMMON, ...HEADER_AMATEUR, ...ACT_CREAMPIE, 'Big Dick'];
    const amateurCumshot = [...TAGS_COMMON, ...HEADER_AMATEUR, ...ACT_CUMSHOT, 'Big Dick'];
    
    const amateurPositions = [...TAGS_COMMON, ...HEADER_AMATEUR, ...ACT_POSITIONS];
    const amateurGroup = [...TAGS_COMMON, ...HEADER_AMATEUR, ...ACT_HARD_GROUP];

    // --- STUDIO LISTS ---
    const studioBJ = [...TAGS_COMMON, ...HEADER_STUDIO, ...ACT_BJ, ...TAGS_ANATOMY_STUDIO];
    const studioOral = [...TAGS_COMMON, ...HEADER_STUDIO, ...ACT_ORAL_OTHER];
    const studioSolo = [...TAGS_COMMON, ...HEADER_STUDIO, ...ACT_SOLO];
    
    const studioCreampie = [...TAGS_COMMON, ...HEADER_STUDIO, ...ACT_CREAMPIE, 'Monster Cock'];
    const studioCumshot = [...TAGS_COMMON, ...HEADER_STUDIO, ...ACT_CUMSHOT, 'Monster Cock'];
    
    const studioPositions = [...TAGS_COMMON, ...HEADER_STUDIO, ...ACT_POSITIONS];
    const studioGroup = [...TAGS_COMMON, ...HEADER_STUDIO, ...ACT_HARD_GROUP];


    // =================================================================
    // 3. LOGIC & UI
    // =================================================================

    let isTaggingInProgress = false;
    let hasTaggedCurrentSession = false;
    let uiActive = false;
    let manageInterval = null;

    // --- UI: Mode Selection Panel ---

    function createSelectionUI(onStart) {
        if (document.getElementById('rg-mode-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'rg-mode-panel';
        panel.style.cssText = `
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: #121212;
            border: 2px solid #bfa048;
            padding: 15px;
            border-radius: 12px;
            z-index: 9999;
            color: #fff;
            font-family: sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.9);
            text-align: left;
            min-width: 380px;
            max-height: 90vh;
            overflow-y: auto;
        `;

        const headerStyle = `
            margin: 8px 0 5px 0;
            color: #bfa048;
            font-size: 15px;
            font-weight: bold;
            border-bottom: 1px solid #333;
            padding-bottom: 3px;
        `;

        const btnStyle = `
            display: inline-block;
            width: 48%;
            padding: 8px 5px;
            margin: 0 1% 6px 0;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: normal;
            font-size: 12px;
            text-align: center;
            color: white;
            vertical-align: top;
            transition: opacity 0.2s;
        `;
        
        const btnFull = `
            display: block;
            width: 100%;
            padding: 8px 5px;
            margin-bottom: 6px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: normal;
            font-size: 12px;
            text-align: center;
            color: white;
        `;

        // Helper to create buttons
        const createBtn = (text, color, list, name, fullWidth = false) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = (fullWidth ? btnFull : btnStyle) + `background: ${color};`;
            btn.onclick = () => { panel.remove(); uiActive = false; onStart(list, name); };
            return btn;
        };

        // --- AMATEUR SECTION ---
        const titleAmateur = document.createElement('div');
        titleAmateur.textContent = "🏠 Amateur / Homemade";
        titleAmateur.style.cssText = headerStyle;

        // --- STUDIO SECTION ---
        const titleStudio = document.createElement('div');
        titleStudio.textContent = "🏢 Studio / Distributor";
        titleStudio.style.cssText = headerStyle + "margin-top: 10px;";

        // --- CANCEL ---
        const btnCancel = document.createElement('button');
        btnCancel.textContent = "❌ Close / Manual";
        btnCancel.style.cssText = btnFull + "background: #343a40; margin-top: 8px; color: #ccc;";
        btnCancel.onclick = () => {
            panel.remove();
            uiActive = false;
            hasTaggedCurrentSession = true;
        };

        // Building the grid
        panel.appendChild(titleAmateur);
        panel.appendChild(createBtn("🍆👄 Blowjob", "#20c997", amateurBJ, "Amateur BJ"));
        panel.appendChild(createBtn("👅♋ Oral Mix", "#28a745", amateurOral, "Amateur Oral"));
        panel.appendChild(createBtn("🧘‍♀️ Solo", "#198754", amateurSolo, "Amateur Solo"));
        panel.appendChild(createBtn("🧘 Positions Only", "#6c757d", amateurPositions, "Amateur Positions"));
        panel.appendChild(createBtn("🥧 Creampie / Inside", "#dc3545", amateurCreampie, "Amateur Creampie"));
        panel.appendChild(createBtn("💦 Cumshot / Face", "#0dcaf0", amateurCumshot, "Amateur Cumshot"));
        panel.appendChild(createBtn("👯‍♀️ Group / 3+", "#0f5132", amateurGroup, "Amateur Group", true));

        panel.appendChild(titleStudio);
        panel.appendChild(createBtn("🍆👄 Blowjob", "#0dcaf0", studioBJ, "Studio BJ"));
        panel.appendChild(createBtn("👅♋ Oral Mix", "#007bff", studioOral, "Studio Oral"));
        panel.appendChild(createBtn("🧘‍♀️ Solo", "#0d6efd", studioSolo, "Studio Solo"));
        panel.appendChild(createBtn("🧘 Positions Only", "#6c757d", studioPositions, "Studio Positions"));
        panel.appendChild(createBtn("🥧 Creampie / Inside", "#d63384", studioCreampie, "Studio Creampie"));
        panel.appendChild(createBtn("💦 Cumshot / Face", "#0dcaf0", studioCumshot, "Studio Cumshot"));
        panel.appendChild(createBtn("👯‍♀️ Group / 3+", "#052c65", studioGroup, "Studio Group", true));

        panel.appendChild(btnCancel);
        document.body.appendChild(panel);
    }

    // --- Helper Functions ---

    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function simulateTyping(text, input) {
        return new Promise(resolve => {
            input.focus();
            setNativeValue(input, '');
            let currentText = "";
            let currentIndex = 0;
            const typeNextChar = () => {
                if (currentIndex < text.length) {
                    currentText += text[currentIndex];
                    setNativeValue(input, currentText);
                    currentIndex++;
                    setTimeout(typeNextChar, Math.floor(Math.random() * 30) + 70); 
                } else {
                    if (input.value !== text) setNativeValue(input, text);
                    resolve();
                }
            };
            typeNextChar();
        });
    }

    async function searchAndClickTag(tag) {
        const searchInput = document.querySelector('.TagSelector-SearchBar input');
        if (!searchInput) return false;

        await simulateTyping(tag, searchInput);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const allButtons = [...document.querySelectorAll('.TagButton button')];
        const targetBtn = allButtons.find(btn => {
            const btnText = btn.textContent.trim();
            const isMatch = btnText.toLowerCase() === tag.toLowerCase();
            const isClickable = !btn.classList.contains('PinkBaseButton_isPrimary');
            return isMatch && isClickable;
        });

        if (targetBtn) {
            targetBtn.click();
            console.log(`✅ Clicked: ${tag}`);
            return true;
        }
        return false;
    }

    // --- Main Logic ---

    async function startTaggingProcess(tagsToUse, modeName) {
        if (isTaggingInProgress) return;
        isTaggingInProgress = true;
        
        console.log(`🚀 Starting tagging: ${modeName}`);

        for (let tag of tagsToUse) {
            if (!window.location.href.includes('/create')) {
                isTaggingInProgress = false;
                return;
            }

            if (document.querySelector('.FieldFeedback-Error')) {
                console.log("⚠️ Limit reached.");
                break;
            }

            const isSelected = [...document.querySelectorAll('.TagButton button.PinkBaseButton_isPrimary')]
                .some(btn => btn.textContent.trim().toLowerCase() === tag.toLowerCase());

            if (!isSelected) {
                const success = await searchAndClickTag(tag);
                if (!success) {
                    console.log(`🔄 Retry: ${tag}`);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    await searchAndClickTag(tag);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        console.log("✅ Done.");
        hasTaggedCurrentSession = true;
        isTaggingInProgress = false;
    }

    function initUI() {
        if (isTaggingInProgress || hasTaggedCurrentSession || uiActive) return;
        const searchInput = document.querySelector('.TagSelector-SearchBar input');
        if (!searchInput) return;

        uiActive = true;
        createSelectionUI(startTaggingProcess);
    }

    function expandTags() {
        if (!window.location.href.includes('/profile/manage')) return;
        const buttons = document.querySelectorAll('button[aria-label="show more"]');
        if (buttons.length > 0) {
            buttons.forEach(b => b.click());
        }
    }

    // --- State Manager ---

    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;

        // 1. Logic for /CREATE
        if (currentUrl.includes('/create')) {
            if (manageInterval) { clearInterval(manageInterval); manageInterval = null; }
            
            if (document.querySelector('.TagSelector-SearchBar')) {
                initUI();
            } else {
                if (!isTaggingInProgress && !uiActive) {
                    hasTaggedCurrentSession = false;
                    const existingPanel = document.getElementById('rg-mode-panel');
                    if (existingPanel) existingPanel.remove();
                }
            }
        } 
        // 2. Logic for /MANAGE
        else if (currentUrl.includes('/profile/manage')) {
            const existingPanel = document.getElementById('rg-mode-panel');
            if (existingPanel) existingPanel.remove();
            
            if (!manageInterval) {
                manageInterval = setInterval(expandTags, 2000);
            }
        } 
        // 3. Logic for OTHER pages
        else {
            if (manageInterval) { clearInterval(manageInterval); manageInterval = null; }
            hasTaggedCurrentSession = false;
            isTaggingInProgress = false;
            uiActive = false;
            const existingPanel = document.getElementById('rg-mode-panel');
            if (existingPanel) existingPanel.remove();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
