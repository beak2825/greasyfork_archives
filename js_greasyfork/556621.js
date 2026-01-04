// ==UserScript==
// @name         [银河奶牛]隐藏强化垃圾物品
// @name:en      [MWI]Hide Enhance Junk   
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在仓库中以及选取强化物品时，隐藏垃圾物品
// @description:en Hide junk items in inventory and when selecting enhancement items
// @author       jhd32
// @license      MIT
// @match        https://test.milkywayidle.com/game*
// @match        https://www.milkywayidle.com/game*
// @match        https://test.milkywayidlecn.com/game*
// @match        https://www.milkywayidlecn.com/game*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556621/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E9%9A%90%E8%97%8F%E5%BC%BA%E5%8C%96%E5%9E%83%E5%9C%BE%E7%89%A9%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/556621/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E9%9A%90%E8%97%8F%E5%BC%BA%E5%8C%96%E5%9E%83%E5%9C%BE%E7%89%A9%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'hideEnhanceJunkSettings';
    const LANG_KEY = 'i18nextLng';
    const OBSERVER_TARGET = document.body;
    const PANEL_ID = 'garbage-hide-panel-32';

    const TEXT = {
        cn: {
            panelTitle: '强化垃圾隐藏设置',
            enhanceJunk: '开启强化垃圾隐藏',
            inventoryJunk: '开启仓库垃圾隐藏(刷新页面)',
            junk: '垃圾',
            jewelry: '首饰',
            lowLevel: '低等级',
            holyTools: '神圣工具',
            charms: '护符',
            refined: '精',
            settings: '强化垃圾隐藏设置',
            equipLabel: '装备',
            saveError: `保存设置失败:`,
            loadError: `加载设置失败，使用默认配置:`,
        },
        en: {
            panelTitle: 'Enhance Junk Hiding Settings',
            enhanceJunk: 'enable enhance junk hiding',
            inventoryJunk: 'enable inventory junk hiding(refresh page)',
            junk: 'junk',
            jewelry: 'jewelry',
            lowLevel: 'low-level',
            holyTools: 'holy tools',
            charms: 'charms',
            refined: 'refined',
            settings: 'hide enhance junk settings',
            equipLabel: 'Equipment',
            saveError: `save settings failed:`,
            loadError: `load local settings failed, use the default:`,
        }
    };

    const SELECTORS = {
        navLinks: 'div.NavigationBar_minorNavigationLinks__dbxh7',
        navItem: 'NavigationBar_minorNavigationLink__31K7Y',
        enhance: {
            detail: 'SkillActionDetail_enhancingComponent__17bOx',
            itemSelector: 'ItemSelector_itemSelector__2eTV6',
            selected: 'ItemSelector_selected__36_rD',
            itemContainer: 'ItemSelector_itemContainer__3olqe',
            tooltip: '[role="tooltip"].css-11y1x02'
        },
        inventory: {
            panel: 'Inventory_inventory__17CH2',
            subPanel: 'MainPanel_subPanelContainer__1i-H9',
            label: 'Inventory_label__XEOAx',
            itemContainer: 'Item_itemContainer__x7kH1',
            middlePanel: 'GamePage_middlePanel__uDts7',
            charPanel: 'GamePage_characterManagementPanel__3OYQL'
        },
        panel: {
            closeBtn: '.close-btn-32',
            masterToggle: '.master-toggle-32',
            subToggle: '[data-role="sub"]',
            switchCard: '.switch-card-32'
        }
    };

    const JUNK_ITEMS = Object.freeze({
        refined: [
            "griffin_bulwark_refined", "cursed_bow_refined", "furious_spear_refined", "regal_sword_refined",
            "chaotic_flail_refined", "sundering_crossbow_refined", "rippling_trident_refined", "blooming_trident_refined",
            "blazing_trident_refined", "knights_aegis_refined", "bishops_codex_refined", "sinister_cape_refined",
            "chimerical_quiver_refined", "enchanted_cloak_refined", "corsair_helmet_refined", "acrobatic_hood_refined",
            "magicians_hat_refined", "anchorbound_plate_body_refined", "maelstrom_plate_body_refined", "kraken_tunic_refined",
            "royal_water_robe_top_refined", "royal_nature_robe_top_refined", "royal_fire_robe_top_refined", "anchorbound_plate_legs_refined",
            "maelstrom_plate_legs_refined", "kraken_chaps_refined", "royal_water_robe_bottoms_refined", "royal_nature_robe_bottoms_refined",
            "royal_fire_robe_bottoms_refined", "dodocamel_gauntlets_refined", "marksman_bracers_refined"
        ],
        junk: [
            "gobo_stabber", "gobo_slasher", "gobo_smasher", "gobo_shooter", "gobo_boomstick", "cheese_bulwark", "verdant_bulwark",
            "azure_bulwark", "burble_bulwark", "crimson_bulwark", "rainbow_bulwark", "wooden_bow", "birch_bow", "cedar_bow",
            "purpleheart_bow", "ginkgo_bow", "redwood_bow", "arcane_bow", "cheese_sword", "verdant_sword", "azure_sword",
            "burble_sword", "crimson_sword", "rainbow_sword", "cheese_spear", "verdant_spear", "azure_spear", "burble_spear",
            "crimson_spear", "rainbow_spear", "cheese_mace", "verdant_mace", "azure_mace", "burble_mace", "crimson_mace",
            "rainbow_mace", "wooden_crossbow", "birch_crossbow", "cedar_crossbow", "purpleheart_crossbow", "ginkgo_crossbow",
            "redwood_crossbow", "arcane_crossbow", "wooden_water_staff", "birch_water_staff", "cedar_water_staff",
            "purpleheart_water_staff", "ginkgo_water_staff", "redwood_water_staff", "arcane_water_staff", "wooden_nature_staff",
            "birch_nature_staff", "cedar_nature_staff", "purpleheart_nature_staff", "ginkgo_nature_staff", "redwood_nature_staff",
            "arcane_nature_staff", "wooden_fire_staff", "birch_fire_staff", "cedar_fire_staff", "purpleheart_fire_staff",
            "ginkgo_fire_staff", "redwood_fire_staff", "arcane_fire_staff", "gobo_defender", "cheese_buckler", "verdant_buckler",
            "azure_buckler", "burble_buckler", "crimson_buckler", "rainbow_buckler", "wooden_shield", "birch_shield", "cedar_shield",
            "purpleheart_shield", "ginkgo_shield", "redwood_shield", "arcane_shield", "cheese_helmet", "verdant_helmet", "azure_helmet",
            "burble_helmet", "crimson_helmet", "rainbow_helmet", "rough_hood", "reptile_hood", "gobo_hood", "beast_hood", "umbral_hood",
            "cotton_hat", "linen_hat", "bamboo_hat", "silk_hat", "radiant_hat", "cheese_plate_body", "verdant_plate_body",
            "azure_plate_body", "burble_plate_body", "crimson_plate_body", "rainbow_plate_body", "rough_tunic", "reptile_tunic",
            "gobo_tunic", "beast_tunic", "umbral_tunic", "cotton_robe_top", "linen_robe_top", "bamboo_robe_top", "silk_robe_top",
            "radiant_robe_top", "cheese_plate_legs", "verdant_plate_legs", "azure_plate_legs", "burble_plate_legs", "crimson_plate_legs",
            "rainbow_plate_legs", "rough_chaps", "reptile_chaps", "gobo_chaps", "beast_chaps", "umbral_chaps", "cotton_robe_bottoms",
            "linen_robe_bottoms", "bamboo_robe_bottoms", "silk_robe_bottoms", "radiant_robe_bottoms", "cheese_gauntlets",
            "verdant_gauntlets", "azure_gauntlets", "burble_gauntlets", "crimson_gauntlets", "rainbow_gauntlets", "rough_bracers",
            "reptile_bracers", "gobo_bracers", "beast_bracers", "umbral_bracers", "cotton_gloves", "linen_gloves", "bamboo_gloves",
            "silk_gloves", "radiant_gloves", "cheese_boots", "verdant_boots", "azure_boots", "burble_boots", "crimson_boots",
            "rainbow_boots", "rough_boots", "reptile_boots", "gobo_boots", "beast_boots", "umbral_boots", "cotton_boots",
            "linen_boots", "bamboo_boots", "silk_boots", "radiant_boots", "cheese_brush", "verdant_brush", "azure_brush",
            "burble_brush", "crimson_brush", "rainbow_brush", "cheese_shears", "verdant_shears", "azure_shears", "burble_shears",
            "crimson_shears", "rainbow_shears", "cheese_hatchet", "verdant_hatchet", "azure_hatchet", "burble_hatchet",
            "crimson_hatchet", "rainbow_hatchet", "cheese_hammer", "verdant_hammer", "azure_hammer", "burble_hammer",
            "crimson_hammer", "rainbow_hammer", "cheese_chisel", "verdant_chisel", "azure_chisel", "burble_chisel",
            "crimson_chisel", "rainbow_chisel", "cheese_needle", "verdant_needle", "azure_needle", "burble_needle",
            "crimson_needle", "rainbow_needle", "cheese_spatula", "verdant_spatula", "azure_spatula", "burble_spatula",
            "crimson_spatula", "rainbow_spatula", "cheese_pot", "verdant_pot", "azure_pot", "burble_pot", "crimson_pot",
            "rainbow_pot", "cheese_alembic", "verdant_alembic", "azure_alembic", "burble_alembic", "crimson_alembic",
            "rainbow_alembic", "cheese_enhancer", "verdant_enhancer", "azure_enhancer", "burble_enhancer", "crimson_enhancer",
            "rainbow_enhancer", "holy_bulwark", "holy_sword", "holy_spear", "holy_mace", "holy_buckler", "holy_helmet",
            "holy_plate_body", "holy_plate_legs", "holy_gauntlets", "holy_boots", "trainee_milking_charm",
            "trainee_foraging_charm", "trainee_woodcutting_charm", "trainee_cheesesmithing_charm", "trainee_crafting_charm",
            "trainee_tailoring_charm", "trainee_cooking_charm", "trainee_brewing_charm", "trainee_alchemy_charm",
            "trainee_enhancing_charm", "trainee_stamina_charm", "trainee_intelligence_charm", "trainee_attack_charm",
            "trainee_defense_charm", "trainee_melee_charm", "trainee_ranged_charm", "trainee_magic_charm"
        ],
        lowLevel: [
            "snake_fang_dirk", "vision_shield", "treant_shield", "tome_of_healing", "snail_shell_helmet", "vision_helmet",
            "gator_vest", "marine_tunic", "turtle_shell_legs", "marine_chaps", "pincer_gloves", "shoebill_shoes",
            "small_pouch", "medium_pouch", "large_pouch", "turtle_shell_body"
        ],
        holyTools: [
            "holy_brush", "holy_shears", "holy_hatchet", "holy_hammer", "holy_chisel", "holy_needle",
            "holy_spatula", "holy_pot", "holy_alembic", "holy_enhancer"
        ],
        jewelry: [
            "necklace_of_efficiency", "fighter_necklace", "ranger_necklace", "wizard_necklace", "necklace_of_wisdom",
            "necklace_of_speed", "earrings_of_gathering", "earrings_of_essence_find", "earrings_of_armor",
            "earrings_of_regeneration", "earrings_of_resistance", "earrings_of_rare_find", "earrings_of_critical_strike",
            "ring_of_gathering", "ring_of_essence_find", "ring_of_armor", "ring_of_regeneration", "ring_of_resistance",
            "ring_of_rare_find", "ring_of_critical_strike"
        ],
        charms: [
            "basic_milking_charm", "advanced_milking_charm", "expert_milking_charm", "master_milking_charm",
            "grandmaster_milking_charm", "basic_foraging_charm", "advanced_foraging_charm", "expert_foraging_charm",
            "master_foraging_charm", "grandmaster_foraging_charm", "basic_woodcutting_charm", "advanced_woodcutting_charm",
            "expert_woodcutting_charm", "master_woodcutting_charm", "grandmaster_woodcutting_charm", "basic_cheesesmithing_charm",
            "advanced_cheesesmithing_charm", "expert_cheesesmithing_charm", "master_cheesesmithing_charm",
            "grandmaster_cheesesmithing_charm", "basic_crafting_charm", "advanced_crafting_charm", "expert_crafting_charm",
            "master_crafting_charm", "grandmaster_crafting_charm", "basic_tailoring_charm", "advanced_tailoring_charm",
            "expert_tailoring_charm", "master_tailoring_charm", "grandmaster_tailoring_charm", "basic_cooking_charm",
            "advanced_cooking_charm", "expert_cooking_charm", "master_cooking_charm", "grandmaster_cooking_charm",
            "basic_brewing_charm", "advanced_brewing_charm", "expert_brewing_charm", "master_brewing_charm",
            "grandmaster_brewing_charm", "basic_alchemy_charm", "advanced_alchemy_charm", "expert_alchemy_charm",
            "master_alchemy_charm", "grandmaster_alchemy_charm", "basic_enhancing_charm", "advanced_enhancing_charm",
            "expert_enhancing_charm", "master_enhancing_charm", "grandmaster_enhancing_charm", "basic_stamina_charm",
            "advanced_stamina_charm", "expert_stamina_charm", "master_stamina_charm", "grandmaster_stamina_charm",
            "basic_intelligence_charm", "advanced_intelligence_charm", "expert_intelligence_charm", "master_intelligence_charm",
            "grandmaster_intelligence_charm", "basic_attack_charm", "advanced_attack_charm", "expert_attack_charm",
            "master_attack_charm", "grandmaster_attack_charm", "basic_defense_charm", "advanced_defense_charm",
            "expert_defense_charm", "master_defense_charm", "grandmaster_defense_charm", "basic_melee_charm",
            "advanced_melee_charm", "expert_melee_charm", "master_melee_charm", "grandmaster_melee_charm",
            "basic_ranged_charm", "advanced_ranged_charm", "expert_ranged_charm", "master_ranged_charm",
            "grandmaster_ranged_charm", "basic_magic_charm", "advanced_magic_charm", "expert_magic_charm",
            "master_magic_charm", "grandmaster_magic_charm"
        ]
    });

    GM_addStyle(`
        #${PANEL_ID} {
            position: fixed;
            top: 110px;
            left: 110px;
            width: 320px;
            background: #fff;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            z-index: 9999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow: hidden;
            cursor: move;
        }
        #${PANEL_ID} h3 {
            text-align: center;
            margin: 0;
            padding: 10px 30px 10px 10px;
            background-color: #f8f8f8;
            color: #333;
            font-size: 14px;
            border-bottom: 1px solid #eee;
            position: relative;
        }
        .close-btn-32 {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
            background: #f0f0f0;
            color: #666;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            z-index: 1;
        }
        .close-btn-32:hover {
            background: #ff4d4f;
            color: #fff;
        }
        .switch-card-32 {
            padding: 10px 12px;
            border-bottom: 1px solid #f0f0f0;
        }
        .switch-card-32:last-child {
            border-bottom: none;
        }
        .card-header-32 {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 8px;
            cursor: default;
        }
        .master-toggle-32 {
            width: 14px;
            height: 14px;
            cursor: pointer;
        }
        .card-title-32 {
            color: #555;
            font-size: 13px;
            font-weight: 500;
        }
        .card-content-32 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            cursor: default;
        }
        .toggle-item-32 {
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            padding: 3px;
            border-radius: 3px;
        }
        .toggle-item-32 input[type="checkbox"] {
            display: none;
        }
        .toggle-slider-32 {
            position: relative;
            width: 30px;
            height: 14px;
            background-color: #e0e0e0;
            border-radius: 7px;
            transition: background-color 0.3s;
        }
        .toggle-slider-32::after {
            content: '';
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            top: 1px;
            left: 1px;
            background-color: white;
            transition: transform 0.3s;
        }
        .toggle-item-32 input:checked + .toggle-slider-32 {
            background-color: #409eff;
        }
        .toggle-item-32 input:checked + .toggle-slider-32::after {
            transform: translateX(16px);
        }
        .toggle-text-32 {
            color: #666;
            font-size: 11px;
            flex-grow: 1;
        }
    `);

    let settings = loadSettings();
    let observer = createObserver();
    let observerActive = false;
    let observedNodes = { enhanceJunk: null, inventoryJunk: null };
    let t = getTextConfig();

    initScript();


    function initScript() {
        insertSettingsButton();
    }

    function getTextConfig() {
        const lang = localStorage.getItem(LANG_KEY) || 'en';
        return lang !== 'en' ? TEXT.cn : TEXT.en;
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : getDefaultSettings();
        } catch (e) {
            console.error(t.loadError, e);
            return getDefaultSettings();
        }
    }

    function getDefaultSettings() {
        return {
            enhanceJunk: { isHiding: false, hide: false, junkType: getDefaultJunkType() },
            inventoryJunk: { isHiding: false, hide: false, junkType: getDefaultJunkType() }
        };
    }

    function getDefaultJunkType() {
        return { refined: false, junk: false, lowLevel: false, holyTools: false, jewelry: false, charms: false };
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error(t.saveError, e);
        }
    }

    function insertSettingsButton() {
        waitForElement(SELECTORS.navLinks, (navContainer) => {
            const btn = document.createElement('div');
            btn.className = SELECTORS.navItem;
            btn.style.color = '#ED694D';
            btn.textContent = t.settings;
            btn.addEventListener('click', createSettingsPanel);
            navContainer.insertAdjacentElement('afterbegin', btn);
            initObserverState();
        });
    }

    function initObserverState() {
        let needObserver = false;
        Object.entries(settings).forEach(([group, item])=>{
            item.isHiding = false;
            if(item.hide){
                needObserver = true;
                if(group == "inventoryJunk"){
                    hideInventoryJunk(null);
                }
            }
        })
        if(needObserver){
            enableObserver();
            observerActive = true;
        }
    }

    function createSettingsPanel() {
        const oldPanel = document.getElementById(PANEL_ID);
        if (oldPanel) {
            cleanupPanelEvents();
            oldPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.innerHTML = getPanelHTML();
        document.body.appendChild(panel);

        bindPanelEvents(panel);
        initPanelInputs(panel);
    }

    function getPanelHTML() {
        return `
            <h3>
                ${t.panelTitle}
                <span class="close-btn-32">×</span>
            </h3>
            <div class="switch-card-32" data-group="enhanceJunk">
                <div class="card-header-32">
                    <input type="checkbox" class="master-toggle-32" data-role="master">
                    <span class="card-title-32">${t.enhanceJunk}</span>
                </div>
                <div class="card-content-32">
                    ${getToggleItemsHTML()}
                </div>
            </div>
            <div class="switch-card-32" data-group="inventoryJunk">
                <div class="card-header-32">
                    <input type="checkbox" class="master-toggle-32" data-role="master">
                    <span class="card-title-32">${t.inventoryJunk}</span>
                </div>
                <div class="card-content-32">
                    ${getToggleItemsHTML()}
                </div>
            </div>
        `;
    }

    function getToggleItemsHTML() {
        return [
            { key: 'junk', text: t.junk },
            { key: 'jewelry', text: t.jewelry },
            { key: 'lowLevel', text: t.lowLevel },
            { key: 'holyTools', text: t.holyTools },
            { key: 'charms', text: t.charms },
            { key: 'refined', text: t.refined }
        ].map(item => `
            <label class="toggle-item-32">
                <input type="checkbox" data-role="sub" data-key="${item.key}">
                <span class="toggle-slider-32"></span>
                <span class="toggle-text-32">${item.text}</span>
            </label>
        `).join('');
    }

    function bindPanelEvents(panel) {
        panel.querySelector(SELECTORS.panel.closeBtn).addEventListener('click', () => {
            cleanupPanelEvents();
            panel.remove();
        });

        bindPanelDrag(panel);

        document.addEventListener('change', handleInputChange);
    }

    function bindPanelDrag(panel) {
        let isDragging = false;
        let startX, startY, panelX, panelY;

        const startDrag = (e) => {
            if (isFilteredElement(e.target)) return;
            e.preventDefault();
            
            const coord = getEventCoord(e);
            [startX, startY] = [coord.x, coord.y];
            
            const rect = panel.getBoundingClientRect();
            [panelX, panelY] = [rect.left, rect.top];
            
            isDragging = true;
            panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const coord = getEventCoord(e);
            const dx = coord.x - startX;
            const dy = coord.y - startY;
            
            const newLeft = Math.max(0, Math.min(panelX + dx, window.innerWidth - panel.offsetWidth));
            const newTop = Math.max(0, Math.min(panelY + dy, window.innerHeight - panel.offsetHeight));
            
            panel.style.left = `${newLeft}px`;
            panel.style.top = `${newTop}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        };

        const endDrag = () => {
            if (isDragging) {
                isDragging = false;
                panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }
        };

        panel.addEventListener('mousedown', startDrag);
        panel.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        document.addEventListener('touchcancel', endDrag);
    }

    function cleanupPanelEvents() {
        document.removeEventListener('change', handleInputChange);
    }

    function initPanelInputs(panel) {
        panel.querySelectorAll(SELECTORS.panel.switchCard).forEach(card => {
            const group = card.dataset.group;
            card.querySelectorAll('input').forEach(input => {
                if (input.dataset.role === 'master') {
                    input.checked = settings[group].hide;
                } else {
                    input.checked = settings[group].junkType[input.dataset.key];
                }
            });
        });
    }

    function handleInputChange(e) {
        const input = e.target;
        const card = input.closest(SELECTORS.panel.switchCard);
        if (!card) return;

        const group = card.dataset.group;

        if (input.dataset.role === 'master') {
            handleMasterToggle(group, input.checked);
        } else {
            handleSubToggle(group, input.dataset.key, input.checked);
        }

        updateObserverState();
        saveSettings();
    }

    function handleMasterToggle(group, checked) {
        settings[group].hide = checked;
        if (!checked && group === 'inventoryJunk' && settings[group].isHiding && observedNodes[group]) {
            recoverElements(observedNodes[group]);
        }
    }

    function handleSubToggle(group, key, checked) {
        settings[group].junkType[key] = checked;

        if (settings[group].hide && observedNodes[group] && settings[group].isHiding) {
            group == 'inventoryJunk' ? hideInventoryJunk(observedNodes[group]) : hideEnhanceJunk(observedNodes[group]);
        } else {
            settings[group].isHiding = false;
        }
    }

    function updateObserverState() {
        const needObserve = Object.values(settings).some(group => group.hide);
        
        if (needObserve && !observerActive) {
            enableObserver();
            observerActive = true;
        } else if (!needObserve && observerActive) {
            observer.disconnect();
            observerActive = false;
        }
    }

    function hideEnhanceJunk(node) {
        if (!node || !node.matches(SELECTORS.enhance.tooltip)) return;

        const enhancePanel = document.querySelector(`.${SELECTORS.enhance.detail}`);
        const firstItemSelected = enhancePanel?.querySelector(`.${SELECTORS.enhance.itemSelector}`)?.classList.contains(SELECTORS.enhance.selected);
        
        if (!firstItemSelected) {
            settings.enhanceJunk.isHiding = false;
            return;
        }
        const items = node.querySelectorAll(`.${SELECTORS.enhance.itemContainer}`);
        filterItems('enhanceJunk', items);

        observedNodes.enhanceJunk = node;
        settings.enhanceJunk.isHiding = true;
    }

    function hideInventoryJunk(node) {
        let inventoryPanel = getInventoryPanel(node);
        if (!inventoryPanel) return;

        const equipLabel = [...inventoryPanel.querySelectorAll(`.${SELECTORS.inventory.label}`)].find(node=>node.textContent.trim() == t.equipLabel);
        if (!equipLabel) return;

        const items = equipLabel.parentElement.parentElement.querySelectorAll(`.${SELECTORS.inventory.itemContainer}`);
        filterItems('inventoryJunk', items);

        observedNodes.inventoryJunk = inventoryPanel;
        settings.inventoryJunk.isHiding = true;
    }

    function getInventoryPanel(node) {
        if (node) {
            if (node.classList.contains(SELECTORS.inventory.panel)) return node;
            if (node.classList.contains(SELECTORS.inventory.subPanel)) return node.querySelector(`.${SELECTORS.inventory.panel}`);
            return null;
        }

        return window.innerWidth >= 1024 
            ? document.querySelector(`.${SELECTORS.inventory.charPanel} .${SELECTORS.inventory.panel}`)
            : document.querySelector(`.${SELECTORS.inventory.middlePanel} .${SELECTORS.inventory.panel}`);
    }

    function filterItems(group, items) {
        const junkSet = getJunkSet(group);
        
        items.forEach(item => {
            const itemId = item.querySelector('use')?.getAttribute('href')?.split('#').pop();
            if (itemId && junkSet.has(itemId)) {
                item.style.display = 'none';
            } else {
                item.style.removeProperty('display');
            }
        });
    }

    function getJunkSet(group) {
        const junkSet = new Set();
        const junkType = settings[group].junkType;

        Object.entries(junkType).forEach(([key, hide]) => {
            if (hide) JUNK_ITEMS[key].forEach(id => junkSet.add(id));
        });

        return junkSet;
    }

    function recoverElements(container) {
        if (!container) return;
        
        const items = container.querySelectorAll(`.${SELECTORS.inventory.itemContainer}`);
        items.forEach(item => item.style.removeProperty('display'));
    }

    function createObserver() {
        return new MutationObserver((mutations) => {
            cleanupObservedNodes();

            if (!Object.values(settings).some(group => group.hide && !group.isHiding)){
                return;
            }

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;
                    
                    if (settings.enhanceJunk.hide && !settings.enhanceJunk.isHiding) {
                        hideEnhanceJunk(node);
                    }
                    
                    if (settings.inventoryJunk.hide && !settings.inventoryJunk.isHiding && window.innerWidth < 1024) {
                        hideInventoryJunk(node);
                    }
                });
            });
        });
    }

    function cleanupObservedNodes() {
        Object.entries(observedNodes).forEach(([group, node]) => {
            if (node && !node.isConnected) {
                observedNodes[group] = null;
                settings[group].isHiding = false;
            }
        });
    }

    function enableObserver() {
        observer.observe(OBSERVER_TARGET, { childList: true, subtree: true });
    }

    function waitForElement(selector, callback, timeout = 60000) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 100);

        setTimeout(() => clearInterval(interval), timeout);
    }

    function getEventCoord(e) {
        return e.type.startsWith('touch') 
            ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
            : { x: e.clientX, y: e.clientY };
    }

    function isFilteredElement(el) {
        return el.classList.contains('close-btn-32') ||
               el.classList.contains('master-toggle-32') ||
               el.closest('.toggle-item-32');
    }

})();