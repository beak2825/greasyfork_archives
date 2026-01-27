// ==UserScript==
// @name         HWM Artifact Sets Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds tabs with icons to filter artifact sets (Imp, Dark, Heaven, Magma, Fear, Warlord) in inventory and warehouse
// @author       Vladislav
// @license      MIT
// @homepageURL  https://greasyfork.org/ru/scripts/564240-hwm-artifact-sets-filter
// @supportURL   https://greasyfork.org/ru/scripts/564240-hwm-artifact-sets-filter/feedback
// @match        *://www.heroeswm.ru/inventory.php*
// @match        *://heroeswm.ru/inventory.php*
// @match        *://www.lordswm.com/inventory.php*
// @match        *://lordswm.com/inventory.php*
// @match        *://www.heroeswm.ru/sklad_info.php*
// @match        *://heroeswm.ru/sklad_info.php*
// @match        *://www.lordswm.com/sklad_info.php*
// @match        *://lordswm.com/sklad_info.php*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564240/HWM%20Artifact%20Sets%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/564240/HWM%20Artifact%20Sets%20Filter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // === SMOOTH FILTER TRANSITION ===
  // Smooth fade-out and fade-in for polished UX
  const FADE_DURATION_MS = 600;
  const TRANSITION_CSS = `
    .hwm-filter-fade {
      opacity: 0 !important;
      transition: opacity ${FADE_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .hwm-filter-ready {
      opacity: 1 !important;
      transition: opacity ${FADE_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
  `;

  // Inject transition CSS as early as possible
  function injectTransitionCSS() {
    if (typeof GM_addStyle !== "undefined") {
      GM_addStyle(TRANSITION_CSS);
    } else {
      const style = document.createElement("style");
      style.textContent = TRANSITION_CSS;
      (document.head || document.documentElement).appendChild(style);
    }
  }
  injectTransitionCSS();
  // === END SMOOTH FILTER TRANSITION ===

  const STORAGE_KEY_INVENTORY = "hwm_artifact_sets_filter_inventory";
  const STORAGE_KEY_SKLAD = "hwm_artifact_sets_filter_sklad";
  const isSkladPage = window.location.pathname.includes("sklad_info.php");

  function getStorageKey() {
    return isSkladPage ? STORAGE_KEY_SKLAD : STORAGE_KEY_INVENTORY;
  }

  let hasAppliedSkladFilter = false;
  let hasAppliedInventoryFilter = false;

  // Reference to the sklad content cell where tabs are placed (for scoping filtering)
  let skladContentCell = null;

  function setFadeState(element, fadeOut) {
    if (!element) return;
    if (fadeOut) {
      element.classList.add("hwm-filter-fade");
    } else {
      element.classList.remove("hwm-filter-fade");
      element.classList.add("hwm-filter-ready");
    }
  }

  function ensurePageVisible() {
    for (const el of document.querySelectorAll(".hwm-filter-fade")) {
      el.classList.remove("hwm-filter-fade");
    }
  }

  // SVG Icons for each set (20x20, compact size)
  const ICONS = {
    // Shop: Shopping bag for basic artifacts
    shop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs><linearGradient id="shopG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8a8a8a"/><stop offset="100%" stop-color="#5a5a5a"/></linearGradient></defs>
      <path d="M5 7v9c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V7H5z" fill="url(#shopG)" stroke="#3a3a3a" stroke-width=".5"/>
      <path d="M7 7V5c0-1.7 1.3-3 3-3s3 1.3 3 3v2" fill="none" stroke="#6a6a6a" stroke-width="1.5" stroke-linecap="round"/>
      <rect x="7" y="9" width="2" height="1" rx=".3" fill="#aaa" opacity=".7"/>
      <rect x="11" y="9" width="2" height="1" rx=".3" fill="#aaa" opacity=".7"/>
    </svg>`,
    // Non-shop: Shopping bag with red cross (for non-shop artifacts)
    nonshop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs><linearGradient id="nonshopG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8a8a8a"/><stop offset="100%" stop-color="#5a5a5a"/></linearGradient></defs>
      <path d="M5 7v9c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V7H5z" fill="url(#nonshopG)" stroke="#3a3a3a" stroke-width=".5"/>
      <path d="M7 7V5c0-1.7 1.3-3 3-3s3 1.3 3 3v2" fill="none" stroke="#6a6a6a" stroke-width="1.5" stroke-linecap="round"/>
      <rect x="7" y="9" width="2" height="1" rx=".3" fill="#aaa" opacity=".7"/>
      <rect x="11" y="9" width="2" height="1" rx=".3" fill="#aaa" opacity=".7"/>
      <path d="M4 4l12 12M16 4l-12 12" stroke="#cc3333" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    // Imp: Golden knight helmet with visor
    imp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs><linearGradient id="impG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffd700"/><stop offset="100%" stop-color="#b8860b"/></linearGradient></defs>
      <path d="M10 2C6 2 3 5 3 9v5c0 1.2.6 2.3 1.7 2.9L5 18h10l-.3-2.1C16.4 15.3 17 14.2 17 13V9c0-4-2.7-7-7-7z" fill="url(#impG)" stroke="#8b6914" stroke-width=".5"/>
      <rect x="4.5" y="8" width="11" height="2.5" rx=".5" fill="#1a1a1a" opacity=".8"/>
      <path d="M6 6.5h8" stroke="#fff3c4" stroke-width=".5" opacity=".6"/>
    </svg>`,
    // Dark: Demon horns with magenta glow
    dark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs><linearGradient id="darkG" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#2a1a3a"/><stop offset="100%" stop-color="#ff00ff"/></linearGradient></defs>
      <path d="M3 15C2 11 1 6 3 3c1.1-1.6 3.2-1.1 4.5 1.1l2.2 4.5 2.2-4.5c1.3-2.2 3.4-2.7 4.5-1.1 2 3 1 8 0 12" fill="none" stroke="url(#darkG)" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M3 15C2 11 1 6 3 3c1.1-1.6 3.2-1.1 4.5 1.1l2.2 4.5 2.2-4.5c1.3-2.2 3.4-2.7 4.5-1.1 2 3 1 8 0 12" fill="none" stroke="#ff66ff" stroke-width="1" stroke-linecap="round" opacity=".5"/>
    </svg>`,
    // Heaven: Angel wings with celestial glow
    heaven: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs><linearGradient id="heavenG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e6f3ff"/><stop offset="50%" stop-color="#87ceeb"/><stop offset="100%" stop-color="#4a90c2"/></linearGradient></defs>
      <ellipse cx="10" cy="4.5" rx="3" ry="1.2" fill="none" stroke="#ffd700" stroke-width="1.2" opacity=".9"/>
      <path d="M10 6.5c-2.2 1.1-5.4 1.1-7.5 3.2-1.1 1.1 0 3.1 2.2 4.4 1.6.9 4.4.6 5.3-1.1" fill="url(#heavenG)" stroke="#4a7a9a" stroke-width=".4"/>
      <path d="M10 6.5c2.2 1.1 5.4 1.1 7.5 3.2 1.1 1.1 0 3.1-2.2 4.4-1.6.9-4.4.6-5.3-1.1" fill="url(#heavenG)" stroke="#4a7a9a" stroke-width=".4"/>
      <path d="M4.5 11c1.1-.6 2.2 0 2.7 1.1M15.5 11c-1.1-.6-2.2 0-2.7 1.1" stroke="#fff" stroke-width=".5" opacity=".7"/>
    </svg>`,
    // Magma: Flame with lava glow
    magma: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs>
        <linearGradient id="magmaG" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#8b0000"/><stop offset="40%" stop-color="#ff4500"/><stop offset="70%" stop-color="#ffa500"/><stop offset="100%" stop-color="#ffd700"/></linearGradient>
        <filter id="magmaGlow"><feGaussianBlur stdDeviation="1" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M10 2c-1.1 2.2-3.2 3.2-3.2 6.6 0 1.6.9 3.2 2.2 4.4-.6-1.1-.3-2.2.6-3.2.6 2.2 1.1 3.2 2.7 4.4 1.1-1.1 2.2-2.7 2.2-4.4 0-3.2-2.7-5.4-4.5-7.8z" fill="url(#magmaG)" filter="url(#magmaGlow)"/>
      <path d="M9 11c0-1.1.6-2.2 1.1-2.7.6.6 1.1 1.6 1.1 2.7 0 1.3-1.1 2.2-2.2 1.7.6-.3 1.1-.9 0-1.7z" fill="#fff5e6" opacity=".9"/>
    </svg>`,
    // Fear: Spectral skull with ghostly aura
    fear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs>
        <linearGradient id="fearG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#b8a0c8"/><stop offset="100%" stop-color="#4a3a5a"/></linearGradient>
        <filter id="fearGlow"><feGaussianBlur stdDeviation="0.9"/></filter>
      </defs>
      <ellipse cx="10" cy="10" rx="5.3" ry="6.6" fill="#6a4a7a" opacity=".3" filter="url(#fearGlow)"/>
      <path d="M10 3c-3.1 0-5.3 2.2-5.3 5.6 0 2.2.6 4.4 1.6 5.9.6.9 1.1 1.6 1.1 2.7h5.3c0-1.1.6-1.8 1.1-2.7.9-1.6 1.6-3.8 1.6-5.9 0-3.4-2.2-5.6-5.3-5.6z" fill="url(#fearG)" stroke="#3a2a4a" stroke-width=".4"/>
      <ellipse cx="7" cy="9" rx="1.4" ry="1.9" fill="#1a0a2a"/>
      <ellipse cx="13" cy="9" rx="1.4" ry="1.9" fill="#1a0a2a"/>
      <ellipse cx="7" cy="8.3" rx=".6" ry=".8" fill="#d4a5ff" opacity=".6"/>
      <ellipse cx="13" cy="8.3" rx=".6" ry=".8" fill="#d4a5ff" opacity=".6"/>
      <path d="M10 11v2.2" stroke="#2a1a3a" stroke-width=".9" stroke-linecap="round"/>
      <path d="M7.5 14h5" stroke="#2a1a3a" stroke-width=".6"/>
    </svg>`,
    // Warlord: Bronze shield with crossed pattern
    warlord: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs><linearGradient id="warlordG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#cd853f"/><stop offset="50%" stop-color="#daa520"/><stop offset="100%" stop-color="#8b6914"/></linearGradient></defs>
      <path d="M10 2L3 5.5v5.3c0 4.4 6.6 6.6 6.6 6.6S17 14.8 17 10.8V5.5L10 2z" fill="url(#warlordG)" stroke="#5a4a2a" stroke-width=".6"/>
      <path d="M10 4.4L5.3 6.6v4.4c0 2.7 4.4 4.4 4.4 4.4s4.4-1.7 4.4-4.4V6.6L10 4.4z" fill="none" stroke="#ffd700" stroke-width=".5" opacity=".5"/>
      <path d="M10 6.6v7.5M6.6 9.7h6.8" stroke="#4a3a1a" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="10" cy="10" r="1.6" fill="#5a4a2a"/>
      <circle cx="10" cy="10" r=".9" fill="#daa520"/>
    </svg>`,
    // Craft: Anvil with magic enchantment sparkles
    craft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs>
        <linearGradient id="craftG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7a9fcc"/><stop offset="50%" stop-color="#5a7fcc"/><stop offset="100%" stop-color="#4a6faa"/></linearGradient>
        <filter id="craftGlow"><feGaussianBlur stdDeviation="0.8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="M5 9h10l-1 6H6l-1-6z" fill="url(#craftG)" stroke="#3a5a8a" stroke-width=".5"/>
      <path d="M6 9l1-3h6l1 3" fill="none" stroke="#5a7fcc" stroke-width="1" stroke-linejoin="round"/>
      <ellipse cx="10" cy="6.5" rx="3" ry="1.2" fill="#8ab4ee" opacity=".8"/>
      <circle cx="4" cy="7" r=".8" fill="#ffd700" filter="url(#craftGlow)" opacity=".9"/>
      <circle cx="16" cy="7" r=".6" fill="#87ceeb" filter="url(#craftGlow)" opacity=".9"/>
      <circle cx="14" cy="4" r=".5" fill="#ff69b4" filter="url(#craftGlow)" opacity=".8"/>
      <circle cx="6" cy="4" r=".4" fill="#98fb98" filter="url(#craftGlow)" opacity=".8"/>
      <circle cx="10" cy="3" r=".5" fill="#ffa500" filter="url(#craftGlow)" opacity=".8"/>
    </svg>`,
    // Noncraft: Anvil with red cross (for non-craft artifacts)
    noncraft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <defs>
        <linearGradient id="noncraftG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7a9fcc"/><stop offset="50%" stop-color="#5a7fcc"/><stop offset="100%" stop-color="#4a6faa"/></linearGradient>
      </defs>
      <path d="M5 9h10l-1 6H6l-1-6z" fill="url(#noncraftG)" stroke="#3a5a8a" stroke-width=".5"/>
      <path d="M6 9l1-3h6l1 3" fill="none" stroke="#5a7fcc" stroke-width="1" stroke-linejoin="round"/>
      <ellipse cx="10" cy="6.5" rx="3" ry="1.2" fill="#8ab4ee" opacity=".8"/>
      <path d="M4 4l12 12M16 4l-12 12" stroke="#cc3333" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  };

  // Set configurations: id, tooltip hint, theme color for active tab
  const SETS = [
    {
      id: "shop",
      hint: "Артефакты со статусом артефакт из магазина",
      color: "#cccccc",
    },
    { id: "nonshop", hint: "Артефакты не из магазина", color: "#ffaaaa" },
    { id: "craft", hint: "Артефакты с крафтом", color: "#aaddff" },
    { id: "noncraft", hint: "Артефакты без крафта", color: "#aaffaa" },
    { id: "imp", hint: "Комплект Империи", color: "#ffaaaa" },
    { id: "dark", hint: "Комплект тьмы", color: "#aaaaff" },
    { id: "heaven", hint: "Комплект небес", color: "#aaddff" },
    { id: "magma", hint: "Комплект магмы", color: "#ffcc88" },
    { id: "fear", hint: "Комплект страха", color: "#d4a5ff" },
    { id: "warlord", hint: "Комплект войны", color: "#dddd88" },
  ];

  const TAB_ID_PREFIX = "set_tab_";
  const SPECIAL_SET_IDS = new Set([
    "imp",
    "dark",
    "heaven",
    "magma",
    "fear",
    "warlord",
  ]);
  const SPECIAL_SETS = SETS.filter((s) => SPECIAL_SET_IDS.has(s.id));
  const DEFAULT_TAB_COLOR = "#ffd700";
  const TAB_VISUAL = {
    INACTIVE_OPACITY_ALL: 0.6,
    INACTIVE_OPACITY_SET: 0.5,
    INACTIVE_GRAYSCALE: "40%",
  };
  const TAB_STYLE = {
    base: "cursor: pointer;",
    all: "padding: 0 8px; height: 20px; line-height: 20px; border-radius: 3px; background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%); color: #ccc; font-size: 11px; font-weight: bold; border: 1px solid #555; min-width: 40px; text-align: center;",
    allActive:
      "padding: 0 8px; height: 20px; line-height: 20px; border-radius: 3px; background: linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%); color: #fff; font-size: 11px; font-weight: bold; border: 2px solid #ffd700; min-width: 40px; text-align: center; box-shadow: 0 0 8px 2px rgba(255, 215, 0, 0.6), inset 0 0 4px rgba(255, 215, 0, 0.2); transform: scale(1.05);",
    set: "padding: 0; border-radius: 3px; width: 20px; height: 20px; flex-shrink: 0; background: #f5f5f0; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center;",
    setActiveBase:
      "padding: 0; border-radius: 3px; width: 20px; height: 20px; flex-shrink: 0; background: #f5f5f0; display: flex; align-items: center; justify-content: center; opacity: 1; filter: none; transform: scale(1.15); z-index: 10; position: relative;",
    svg: "width: 20px; height: 20px; display: block;",
  };

  // Whitelist of shop artifact IDs (artifacts that can be bought in the shop)
  const SHOP_ARTIFACT_IDS = new Set([
    "n_sword",
    "n_shield",
    "n_boots",
    "n_armor",
    "n_clk",
    "n_ringa",
    "n_ringd",
    "n_amul",
    "n_helmet",
    "quest_pendant1",
    "leatherhat",
    "leather_shiled",
    "wood_sword",
    "round_shiled",
    "leatherboots",
    "i_ring",
    "bravery_medal",
    "gnome_hammer",
    "s_shield",
    "student_armor",
    "leather_helm",
    "amulet_of_luck",
    "leatherplate",
    "def_sword",
    "steel_blade",
    "dagger",
    "flyaga",
    "10scroll",
    "skill_book11",
    "12hron",
    "13coin",
    "cold_sword2014",
    "ring2013",
    "clover_amul",
    "super_dagger",
    "sun_armor",
    "cold_shieldn",
    "sring4",
    "doubt_ring",
    "verve_ring",
    "defender_shield",
    "shortbow",
    "scoutcloack",
    "hunter_boots",
    "sumka",
    "rashness_ring",
    "dring5",
    "sword5",
    "knowledge_hat",
    "chain_coif",
    "wizard_cap",
    "hauberk",
    "requital_sword",
    "staff",
    "sshield5",
    "dagger_dex",
    "soul_cape",
    "boots2",
    "shoe_of_initiative",
    "mirror",
    "wind_ring",
    "sun_staff",
    "sun_ring",
    "coldring_n",
    "lbow",
    "finecl",
    "sun_helm",
    "adv_sumk2",
    "circ_ring",
    "broad_sword",
    "long_bow",
    "antiair_cape",
    "powerring",
    "mage_helm",
    "steel_helmet",
    "power_pendant",
    "ciras",
    "power_sword",
    "sor_staff",
    "dragon_shield",
    "steel_boots",
    "shield_14y",
    "sun_sword",
    "sun_boots",
    "coldamul",
    "wind_boots",
    "wind_helm",
    "wind_armor",
    "shelm8",
    "samul8",
    "mage_armor",
    "mif_light",
    "ssword8",
    "mstaff8",
    "powercape",
    "scloack8",
    "antimagic_cape",
    "mif_lboots",
    "dring9",
    "mif_lhelmet",
    "sarmor9",
    "mif_sword",
    "mif_staff",
    "sboots9",
    "smring10",
    "sring10",
    "warriorring",
    "darkring",
    "warrior_pendant",
    "magic_amulet",
    "full_plate",
    "ssword10",
    "mstaff10",
    "large_shield",
    "dagger_myf",
    "energy_scroll",
    "mif_hhelmet",
    "wiz_robe",
    "sshield11",
    "composite_bow",
    "mif_hboots",
    "dring12",
    "shelm12",
    "miff_plate",
    "mm_sword",
    "mm_staff",
    "wiz_cape",
    "sboots12",
    "wiz_boots",
    "magring13",
    "warring13",
    "mhelmetzh13",
    "zxhelmet13",
    "wzzamulet13",
    "mmzamulet13",
    "sarmor13",
    "ssword13",
    "mstaff13",
    "shield13",
    "boots13",
    "adv_sumk1",
    "bring14",
    "smamul14",
    "samul14",
    "sshield14",
    "bow14",
    "mboots14",
    "dring15",
    "myhelmet15",
    "xymhelmet15",
    "bafamulet15",
    "robewz15",
    "armor15",
    "firsword15",
    "ffstaff15",
    "cloackwz15",
    "boots15",
    "wwwring16",
    "mmmring16",
    "shelm16",
    "mmzamulet16",
    "wzzamulet16",
    "sarmor16",
    "ssword16",
    "smstaff16",
    "shield16",
    "dagger16",
    "scloack16",
    "sboots16",
    "smring17",
    "sring17",
    "helmet17",
    "mhelmet17",
    "samul17",
    "smamul17",
    "marmor17",
    "armor17",
    "sshield17",
    "bow17",
    "cloack17",
    "boots17",
    "mboots17",
    "dring18",
    "sword18",
    "staff18",
    "scroll18",
    "ring19",
    "mring19",
    "mamulet19",
    "amulet19",
    "shield19",
    "dagger20",
    "dring21",
  ]);

  // ===== Helper Functions =====

  // Check if an artifact ID belongs to a specific set
  function isArtifactInSet(artId, setId) {
    if (!setId || !artId) return false;
    return (
      artId.startsWith(setId + "_") ||
      artId.includes("_" + setId + "_") ||
      artId.endsWith("_" + setId)
    );
  }

  // Check if an artifact is from the shop
  function isShopArtifact(artId) {
    return SHOP_ARTIFACT_IDS.has(artId);
  }

  // Check if a row has craft (enchantment mods)
  function hasRowCraft(row) {
    return !!row.querySelector(".art_mods");
  }

  // Check if an artifact row matches the active set filter
  function rowMatchesSet(row, activeSet, artIds) {
    // No filter active = show all
    if (!activeSet) return true;

    if (artIds.length === 0) return false;

    switch (activeSet) {
      case "shop":
        return artIds.some(isShopArtifact);
      case "nonshop":
        return artIds.some((artId) => !isShopArtifact(artId));
      case "craft":
        return hasRowCraft(row);
      case "noncraft":
        return !hasRowCraft(row);
      default:
        // Special sets (imp, dark, heaven, magma, fear, warlord)
        return artIds.some((artId) => isArtifactInSet(artId, activeSet));
    }
  }

  // ===== End Helper Functions =====

  const setItems = {};
  let activeSetTab = null;
  let initAttempts = 0;

  const CHECK_INTERVAL_MS = 100;
  const INIT_TIMEOUT_MS = 5000;
  const MAX_INIT_ATTEMPTS = INIT_TIMEOUT_MS / CHECK_INTERVAL_MS;

  function getTabId(setId) {
    return TAB_ID_PREFIX + (setId || "all");
  }

  function saveActiveFilter(setId) {
    try {
      localStorage.setItem(getStorageKey(), setId || "");
    } catch (e) {
      console.warn("[ArtifactSetsFilter] Failed to save filter:", e);
    }
  }

  function loadActiveFilter() {
    try {
      const saved = localStorage.getItem(getStorageKey());
      return saved || null;
    } catch (e) {
      console.warn("[ArtifactSetsFilter] Failed to load filter:", e);
      return null;
    }
  }

  function restoreSavedFilter() {
    const savedFilterValue = loadActiveFilter();
    if (savedFilterValue === null) return false;

    const tab = document.getElementById(getTabId(savedFilterValue));
    if (!tab) return false;

    activeSetTab = savedFilterValue;
    updateTabVisualState(tab);
    return true;
  }

  function isMobilePage() {
    if (isSkladPage) {
      return !document.querySelector('table a[href^="sklad_info.php?"]');
    }
    return (
      !document.querySelector(".filter_tabs_block") ||
      !document.getElementById("inventory_block")
    );
  }

  // ===== Sklad-specific functions =====

  function decodeHref(href) {
    return href ? href.replace(/&amp;/g, "&") : "";
  }

  function getSkladCategoryTable() {
    for (const table of document.querySelectorAll("table.wb")) {
      const firstRow = table.querySelector("tr");
      if (!firstRow || firstRow.querySelectorAll("td.wblight").length < 6) {
        continue;
      }

      const hasCategoryLink = Array.from(
        table.querySelectorAll('a[href*="sklad_info.php"]'),
      ).some((link) => decodeHref(link.getAttribute("href")).includes("cat="));

      if (hasCategoryLink) return table;
    }
    return null;
  }

  function getSkladItemArtifactIds(row) {
    const ids = new Set();

    // Try extracting from links first
    for (const link of row.querySelectorAll('a[href*="art_info.php?id="]')) {
      const match = decodeHref(link.getAttribute("href")).match(
        /art_info\.php\?id=([^&]+)/,
      );
      if (match) ids.add(match[1]);
    }

    // Fallback to image sources if no links found
    if (ids.size === 0) {
      for (const img of row.querySelectorAll('img[src*="/artifacts/"]')) {
        const match = img.getAttribute("src").match(/\/([^/]+)\.[a-z]+$/i);
        if (match) ids.add(match[1]);
      }
    }

    return Array.from(ids);
  }

  function getSkladItemRows() {
    const scope = skladContentCell || document.body;
    return Array.from(scope.querySelectorAll("tr")).filter((row) => {
      if (!row.querySelector('a[href*="art_info.php?id="]')) return false;
      if (row.querySelector("#set_tabs_container")) return false;

      const hasActionElements =
        row.querySelector("select") ||
        row.querySelector('input[type="submit"]');
      const hasNestedStructure =
        row.querySelector("table") || row.querySelector("tr");

      if (hasNestedStructure && !hasActionElements) return false;

      // Exclude category navigation rows
      return !Array.from(
        row.querySelectorAll('a[href*="sklad_info.php"]'),
      ).some((link) => decodeHref(link.getAttribute("href")).includes("cat="));
    });
  }

  function getSkladContentTable() {
    return skladContentCell?.closest("table") ?? null;
  }

  function doSkladFiltering() {
    for (const row of getSkladItemRows()) {
      const artIds = getSkladItemArtifactIds(row);
      row.style.display = rowMatchesSet(row, activeSetTab, artIds)
        ? ""
        : "none";
    }
  }

  function filterSkladItems() {
    // Apply fade only to content table (after header and icons)
    const fadeTarget =
      getSkladContentTable() || skladContentCell || document.body;

    // First filter application: smooth fade-out -> filter -> fade-in
    if (!hasAppliedSkladFilter) {
      hasAppliedSkladFilter = true;
      setFadeState(fadeTarget, true);

      // Wait for fade-out to complete, then filter and fade-in
      setTimeout(() => {
        doSkladFiltering();
        requestAnimationFrame(() => setFadeState(fadeTarget, false));
      }, FADE_DURATION_MS);
    } else {
      // Subsequent filters: immediate (no fade)
      doSkladFiltering();
    }
  }

  function setupSkladObserver() {
    const scope = skladContentCell || document.body;
    const artifactTables = Array.from(scope.querySelectorAll("table")).filter(
      (table) => table.querySelector('a[href*="art_info.php?id="]'),
    );

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const rows = node.matches?.("tr")
            ? [node]
            : Array.from(node.querySelectorAll?.("tr") || []);
          for (const row of rows) {
            if (row.querySelector('a[href*="art_info.php?id="]')) {
              row.style.display = "none";
            }
          }
        }
      }
      setTimeout(() => {
        filterSkladItems();
        updateSkladTabCounts();
      }, 0);
    });

    for (const table of artifactTables) {
      observer.observe(table, { childList: true, subtree: true });
    }
  }

  // ===== End of sklad-specific functions =====

  function init() {
    if (isMobilePage()) {
      ensurePageVisible();
      return;
    }

    // Failsafe: show page after timeout even if init fails
    setTimeout(() => {
      if (!hasAppliedSkladFilter && !hasAppliedInventoryFilter) {
        console.warn("[ArtifactSetsFilter] Failsafe timeout - showing page");
        ensurePageVisible();
      }
    }, INIT_TIMEOUT_MS);

    isSkladPage ? initSklad() : initInventory();
  }

  function initInventory() {
    const tabsBlock = document.querySelector(".filter_tabs_block");
    const inventoryBlock = document.getElementById("inventory_block");

    if (
      !tabsBlock ||
      !inventoryBlock ||
      typeof arts === "undefined" ||
      !Array.isArray(arts)
    ) {
      initAttempts++;
      if (initAttempts >= MAX_INIT_ATTEMPTS) {
        console.warn(
          `[ArtifactSetsFilter] Initialization timeout - required elements not found after ${INIT_TIMEOUT_MS}ms`,
        );
        ensurePageVisible();
        return;
      }
      setTimeout(initInventory, CHECK_INTERVAL_MS);
      return;
    }

    // Reset attempts on successful init for potential re-initialization
    initAttempts = 0;

    const container = createSetTabsContainer(tabsBlock);
    injectTabContainerStyles();
    indexArtifactsBySets();
    createAllTab(container);
    createSetTabs(container);
    setupCategoryChangeHandler(tabsBlock, inventoryBlock);
    setupInventoryObserver(inventoryBlock);

    if (restoreSavedFilter()) {
      applySetFilter();
    }

    hasAppliedInventoryFilter = true;
  }

  function initSklad() {
    const categoryTable = getSkladCategoryTable();

    if (!categoryTable) {
      initAttempts++;
      if (initAttempts >= MAX_INIT_ATTEMPTS) {
        console.warn(
          `[ArtifactSetsFilter] Sklad initialization timeout - category table not found after ${INIT_TIMEOUT_MS}ms`,
        );
        ensurePageVisible();
        return;
      }
      setTimeout(initSklad, CHECK_INTERVAL_MS);
      return;
    }

    // Reset attempts on successful init for potential re-initialization
    initAttempts = 0;

    const container = createSkladTabsContainer(categoryTable);
    injectTabContainerStyles();
    createAllTab(container);
    createSetTabs(container);
    updateSkladTabCounts();
    setupSkladObserver();
    restoreSavedFilter();
    filterSkladItems();
  }

  function updateSkladTabCounts() {
    const rows = getSkladItemRows();
    const counts = Object.fromEntries(SETS.map((s) => [s.id, 0]));

    for (const row of rows) {
      const artIds = getSkladItemArtifactIds(row);
      if (artIds.length === 0) continue;

      if (artIds.some(isShopArtifact)) counts.shop++;
      if (artIds.some((id) => !isShopArtifact(id))) counts.nonshop++;

      if (hasRowCraft(row)) {
        counts.craft++;
      } else {
        counts.noncraft++;
      }

      for (const set of SPECIAL_SETS) {
        if (artIds.some((id) => isArtifactInSet(id, set.id))) {
          counts[set.id]++;
        }
      }
    }

    for (const set of SETS) {
      const tab = document.getElementById(getTabId(set.id));
      if (tab) {
        const hint = `${set.hint} (${counts[set.id]})`;
        tab.setAttribute("hint", hint);
        tab.title = hint;
      }
    }
  }

  function injectTabContainerStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #set_tabs_container .filter_tab { padding: 0.45em 0.8em !important; }
      @media (max-width: 768px) {
        #set_tabs_container.inventory-tabs { gap: 1px !important; }
        #set_tabs_container.inventory-tabs .filter_tab[data-set] { width: 15px !important; height: 15px !important; padding: 0 !important; }
        #set_tabs_container.inventory-tabs .filter_tab[data-set] svg { width: 15px !important; height: 15px !important; }
        #set_tabs_container.inventory-tabs #set_tab_all { height: 15px !important; line-height: 15px !important; padding: 0 0 !important; min-width: unset !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function createSkladTabsContainer(categoryTable) {
    const container = document.createElement("div");
    container.id = "set_tabs_container";
    container.style.cssText =
      "display: flex; gap: 4px; padding: 6px 4px; align-items: center; justify-content: center; background: #f5f3ea; border: 1px solid #5d413a; border-top: none;";

    // Find the content table after the category table (for scoping filtering)
    let nextTable = categoryTable.nextElementSibling;
    while (nextTable) {
      if (nextTable.tagName === "TABLE") {
        const contentCell = nextTable.querySelector("td.wbwhite");
        if (contentCell) {
          skladContentCell = contentCell;
          break;
        }
      }
      nextTable = nextTable.nextElementSibling;
    }

    // Insert after the category tabs table
    categoryTable.parentNode.insertBefore(container, categoryTable.nextSibling);
    return container;
  }

  function createSetTabsContainer(tabsBlock) {
    const container = document.createElement("div");
    container.id = "set_tabs_container";
    container.className = "inventory-tabs";
    container.style.cssText =
      "display: flex; gap: 4px; margin-top: 8px; margin-bottom: 12px; align-items: center; justify-content: center;";
    tabsBlock.parentNode.insertBefore(container, tabsBlock.nextSibling);
    return container;
  }

  function indexArtifactsBySets() {
    for (const set of SETS) {
      setItems[set.id] = new Set();
    }

    for (let index = 0; index < arts.length; index++) {
      const artId = arts[index]?.art_id;
      if (!artId) continue;

      const belongsToSpecialSet = SPECIAL_SETS.some((set) => {
        if (isArtifactInSet(artId, set.id)) {
          setItems[set.id].add(index);
          return true;
        }
        return false;
      });

      const isShop = !belongsToSpecialSet && isShopArtifact(artId);
      setItems[isShop ? "shop" : "nonshop"].add(index);
    }

    indexCraftItems();
  }

  function createTab(container, setId, hint, content) {
    const tab = document.createElement("div");
    tab.id = getTabId(setId);
    tab.className = "show_hint filter_tab filter_tab_for_hover";
    tab.setAttribute("hint", hint);
    tab.title = hint;

    if (setId) {
      tab.setAttribute("data-set", setId);
      tab.innerHTML = content;
      tab.style.cssText = TAB_STYLE.base + TAB_STYLE.set;
      const svg = tab.querySelector("svg");
      if (svg) svg.style.cssText = TAB_STYLE.svg;
    } else {
      tab.textContent = content;
      tab.style.cssText = TAB_STYLE.base + TAB_STYLE.all;
    }

    tab.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      activateSetTab(setId, tab);
    });

    container.appendChild(tab);
    return tab;
  }

  function createAllTab(container) {
    const tab = createTab(
      container,
      null,
      "Все предметы (в текущей категории)",
      "All",
    );
    updateTabVisualState(tab);
  }

  function createSetTabs(container) {
    for (const set of SETS) {
      const count = setItems[set.id]?.size ?? 0;
      const hint = `${set.hint} (${count})`;
      createTab(container, set.id, hint, ICONS[set.id]);
    }
  }

  function setupCategoryChangeHandler(tabsBlock, inventoryBlock) {
    // Hide inventory during category change to prevent flicker
    tabsBlock.addEventListener(
      "click",
      (e) => {
        if (!activeSetTab) return;

        const tab = e.target.closest(".filter_tab");
        const isGameCategoryTab = tab && !tab.id.startsWith(TAB_ID_PREFIX);
        if (isGameCategoryTab) {
          inventoryBlock.style.visibility = "hidden";
        }
      },
      true,
    );
  }

  function setupInventoryObserver(inventoryBlock) {
    const observer = new MutationObserver((mutations) => {
      const addedItems = [];
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (node.classList?.contains("inventory_item_div")) {
            addedItems.push(node);
          } else if (node.querySelectorAll) {
            addedItems.push(...node.querySelectorAll(".inventory_item_div"));
          }
        }
      }

      if (addedItems.length === 0) return;

      setTimeout(() => {
        indexCraftItems(addedItems);
        applySetFilter();
        inventoryBlock.style.visibility = "";
      }, 0);
    });

    observer.observe(inventoryBlock, { childList: true });
  }

  function indexCraftItems(items = null) {
    if (!items) {
      setItems.craft.clear();
      setItems.noncraft.clear();
      items = document.querySelectorAll(".inventory_item_div");
    }

    for (const item of items) {
      const artIdx = item.getAttribute("art_idx");
      if (artIdx === null) continue;

      const idx = parseInt(artIdx, 10);
      if (isNaN(idx) || idx < 0 || idx >= arts.length) continue;

      const hasMods = !!item.querySelector(".art_mods");
      const targetSet = hasMods ? setItems.craft : setItems.noncraft;
      const otherSet = hasMods ? setItems.noncraft : setItems.craft;

      targetSet.add(idx);
      otherSet.delete(idx);
    }
  }

  function getSetColor(setId) {
    return SETS.find((s) => s.id === setId)?.color ?? DEFAULT_TAB_COLOR;
  }

  function updateTabVisualState(activeTab) {
    const allTabId = getTabId(null);

    for (const tab of document.querySelectorAll(
      "#set_tabs_container .filter_tab",
    )) {
      tab.classList.remove("filter_tab_active");
      tab.classList.add("filter_tab_for_hover");

      const isAllTab = tab.id === allTabId;
      if (isAllTab) {
        tab.style.cssText = TAB_STYLE.base + TAB_STYLE.all;
        tab.style.opacity = TAB_VISUAL.INACTIVE_OPACITY_ALL;
      } else {
        tab.style.cssText = TAB_STYLE.base + TAB_STYLE.set;
        tab.style.opacity = TAB_VISUAL.INACTIVE_OPACITY_SET;
        tab.style.filter = `grayscale(${TAB_VISUAL.INACTIVE_GRAYSCALE})`;
      }
    }

    activeTab.classList.add("filter_tab_active");
    activeTab.classList.remove("filter_tab_for_hover");

    if (activeTab.id === allTabId) {
      activeTab.style.cssText = TAB_STYLE.base + TAB_STYLE.allActive;
    } else {
      const themeColor = getSetColor(activeTab.getAttribute("data-set"));
      activeTab.style.cssText = TAB_STYLE.base + TAB_STYLE.setActiveBase;
      activeTab.style.border = `2px solid ${themeColor}`;
      activeTab.style.boxShadow = `0 0 8px 2px ${themeColor}80, 0 0 3px 1px ${themeColor}60, inset 0 0 6px ${themeColor}30`;
    }
  }

  function activateSetTab(setId, clickedTab) {
    activeSetTab = setId;
    updateTabVisualState(clickedTab);
    saveActiveFilter(setId);
    applySetFilter();
  }

  function applySetFilter() {
    isSkladPage ? filterSkladItems() : applyInventoryFilter();
  }

  function applyInventoryFilter() {
    const inventoryBlock = document.getElementById("inventory_block");
    if (!inventoryBlock) return;

    const allowedIndices = activeSetTab ? setItems[activeSetTab] : null;

    for (const item of inventoryBlock.querySelectorAll(".inventory_item_div")) {
      const artIdx = item.getAttribute("art_idx");
      if (artIdx === null) continue;

      const idx = parseInt(artIdx, 10);
      item.style.display =
        !allowedIndices || allowedIndices.has(idx) ? "" : "none";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
