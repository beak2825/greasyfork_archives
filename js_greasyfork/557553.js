// ==UserScript==
// @name         AWBW Advanced Hotkeys
// @namespace    https://awbw.amarriner.com/
// @version      1.2.4
// @description  Adds rebindable hotkeys for all AWBW actions. Hotkeys can be configured via the Hotkey button in the game menu.
// @author       Incinerate
// @license      MIT
// @match        https://awbw.amarriner.com/*
// @icon         https://awbw.amarriner.com/terrain/ani/geblackboat.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557553/AWBW%20Advanced%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/557553/AWBW%20Advanced%20Hotkeys.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ============================================================================
  // Configuration
  // ============================================================================

  const STORAGE_KEY = 'awbw_hotkeys_config';
  const ICON_CACHE_KEY = 'awbw_hotkeys_icon_cache';
  const VERSION = 1;

  // ============================================================================
  // Default Presets (stored in QWERTY format)
  // ============================================================================

  const DEFAULT_PRESETS = {
    'Touch Typing': {
      description: 'Optimized for a touch-typing hand position',
      hotkeys: {
        openConfig: { key: 'h' },
        select: { key: 'f' },
        previousUnit: { key: 'q' },
        nextUnit: { key: 'e' },
        showMovementRangeIndividual: { key: 'c' },
        showMovementRangeCombined: null,
        showMovementRangeWholeArmy: null,
        showAttackRangeIndividual: { key: 'z' },
        showAttackRangeCombined: null,
        showAttackRangeType: { key: 'x' },
        showAttackRangeWholeArmy: null,
        showVisionRangeIndividual: null,
        showVisionRangeCombined: null,
        showVisionRangeWholeArmy: { key: 'v' },
        endTurn: { key: 't' },
        tagCO: { key: 't', modifier: 'shift' },
        activatePower: { key: 'a', modifier: 'shift' },
        activateSuperPower: { key: 's', modifier: 'shift' },
        zoomIn: { key: '2' },
        zoomOut: { key: '1' },
        pause: { key: 'p' },
        setDraw: null,
        resign: null,
        toggleCalculator: { key: 'tab' },
        selectAttacker: { key: 'a' },
        selectDefender: { key: 'd' },
        swapUnits: { key: 's' },
        openChat: { key: 'enter' },
        closeChat: { key: 'escape' },
        sendChatMessage: { key: 'enter' },
        openMovementPlanner: { key: 'd', modifier: 'shift' },
        closeMovementPlanner: { key: 'd', modifier: 'shift' },
        toggleMaximize: null,
        toggleFullscreen: { key: 'f', modifier: 'shift' },
        openReplay: { key: 'r', modifier: 'shift' },
        closeReplay: { key: 'r', modifier: 'shift' },
        replayFirstTurn: { key: 'home' },
        replayLatestTurn: { key: 'end' },
        replayForwardTurn: { key: 'arrowdown' },
        replayBackwardTurn: { key: 'arrowup' },
        replayForwardAction: { key: 'arrowright' },
        replayBackwardAction: { key: 'arrowleft' },
        fire: { key: 'a' },
        launch: { key: 's' },
        explode: { key: 's' },
        capture: { key: 'd' },
        supply: { key: 'd' },
        wait: { key: 'd' },
        repair: { key: 'a' },
        load: { key: 's' },
        unload1: { key: 's' },
        unload2: { key: 'x' },
        hide: { key: 's' },
        join: { key: 's' },
        delete: { key: 'w' },
        deleteConfirm: { key: 'delete' },
        buildInfantry: { key: 'a' },
        buildMech: { key: 's' },
        buildRecon: { key: 'd' },
        buildAPC: { key: 't' },
        buildArtillery: { key: 'z' },
        buildTank: { key: 'q' },
        buildAntiAir: { key: 'g' },
        buildMissile: { key: 'x' },
        buildRocket: { key: 'c' },
        buildMdTank: { key: 'w' },
        buildPiperunner: { key: 'v' },
        buildNeotank: { key: 'e' },
        buildMegatank: { key: 'r' },
        buildTCopter: { key: 'a' },
        buildBCopter: { key: 's' },
        buildFighter: { key: 'q' },
        buildBomber: { key: 'w' },
        buildStealth: { key: 'e' },
        buildBlackBomb: { key: 'g' },
        buildBlackBoat: { key: 'a' },
        buildLander: { key: 's' },
        buildCruiser: { key: 'q' },
        buildSub: { key: 'w' },
        buildBattleship: { key: 'z' },
        buildCarrier: { key: 'x' },
        toggleMusic: { key: 'm' },
      }
    },
    'WASD': {
      description: 'Optimized for a WASD hand position',
      hotkeys: {
        openConfig: { key: 'h' },
        select: { key: 'd' },
        previousUnit: { key: 'q' },
        nextUnit: { key: 'e' },
        showMovementRangeIndividual: { key: 'x' },
        showMovementRangeCombined: null,
        showMovementRangeWholeArmy: null,
        showAttackRangeIndividual: { key: 'z' },
        showAttackRangeCombined: null,
        showAttackRangeType: { key: 'shift' },
        showAttackRangeWholeArmy: null,
        showVisionRangeIndividual: null,
        showVisionRangeCombined: null,
        showVisionRangeWholeArmy: { key: 'c' },
        endTurn: { key: 'r' },
        tagCO: { key: 'r', modifier: 'shift' },
        activatePower: { key: 'a', modifier: 'shift' },
        activateSuperPower: { key: 's', modifier: 'shift' },
        zoomIn: { key: '2' },
        zoomOut: { key: '1' },
        pause: { key: 'p' },
        setDraw: null,
        resign: null,
        toggleCalculator: { key: 'tab' },
        selectAttacker: { key: 'a' },
        selectDefender: { key: 's' },
        swapUnits: { key: 'f' },
        openChat: { key: 'enter' },
        closeChat: { key: 'escape' },
        sendChatMessage: { key: 'enter' },
        openMovementPlanner: { key: 'd', modifier: 'ctrl' },
        closeMovementPlanner: { key: 'd', modifier: 'ctrl' },
        toggleMaximize: null,
        toggleFullscreen: { key: 'f', modifier: 'ctrl' },
        openReplay: { key: 'r', modifier: 'ctrl' },
        closeReplay: { key: 'r', modifier: 'ctrl' },
        replayFirstTurn: { key: 'home' },
        replayLatestTurn: { key: 'end' },
        replayForwardTurn: { key: 'arrowdown' },
        replayBackwardTurn: { key: 'arrowup' },
        replayForwardAction: { key: 'arrowright' },
        replayBackwardAction: { key: 'arrowleft' },
        fire: { key: 'a' },
        launch: { key: 'w' },
        explode: { key: 'w' },
        capture: { key: 's' },
        supply: { key: 's' },
        wait: { key: 's' },
        repair: { key: 'a' },
        load: { key: 'w' },
        unload1: { key: 'w' },
        unload2: { key: 's' },
        hide: { key: 's' },
        join: { key: 's' },
        delete: { key: 'z' },
        deleteConfirm: { key: 'delete' },
        buildInfantry: { key: 'a' },
        buildMech: { key: 's' },
        buildRecon: { key: 'a', modifier: 'shift' },
        buildAPC: { key: 's', modifier: 'shift' },
        buildArtillery: { key: 'z' },
        buildTank: { key: 'q' },
        buildAntiAir: { key: 'd', modifier: 'shift' },
        buildMissile: { key: 'x' },
        buildRocket: { key: 'c' },
        buildMdTank: { key: 'w' },
        buildPiperunner: { key: 'v' },
        buildNeotank: { key: 'e' },
        buildMegatank: { key: 'r' },
        buildTCopter: { key: 'a' },
        buildBCopter: { key: 's' },
        buildFighter: { key: 'q' },
        buildBomber: { key: 'w' },
        buildStealth: { key: 'e' },
        buildBlackBomb: { key: 'f' },
        buildBlackBoat: { key: 'a' },
        buildLander: { key: 's' },
        buildCruiser: { key: 'q' },
        buildSub: { key: 'w' },
        buildBattleship: { key: 'z' },
        buildCarrier: { key: 'x' },
        toggleMusic: { key: 'm' },
      }
    },
    'No Bindings': {
      description: 'Start with all hotkeys unbound',
      hotkeys: null,  // Will generate all nulls
      settings: {
        showHotkeysInMenus: false,
        showTheoreticalRange: false
      }
    }
  };

  const HOTKEY_ACTIONS = {
    navigation: [
      { id: 'select', label: 'Select Unit/Building' },
      { id: 'previousUnit', label: 'Previous Unit' },
      { id: 'nextUnit', label: 'Next Unit' },
      // Movement Range section
      { id: 'showMovementRangeIndividual', label: 'Show Movement Range (Individual)' },
      { id: 'showMovementRangeCombined', label: 'Show Movement Range (Combined)' },
      { id: 'showMovementRangeWholeArmy', label: 'Show Movement Range (Whole Army)' },
      // Attack Range section
      { id: 'showAttackRangeIndividual', label: 'Show Attack Range (Individual)' },
      { id: 'showAttackRangeCombined', label: 'Show Attack Range (Combined)' },
      { id: 'showAttackRangeType', label: 'Show Attack Range (Unit Type)' },
      { id: 'showAttackRangeWholeArmy', label: 'Show Attack Range (Whole Army)' },
      // Vision Range section
      { id: 'showVisionRangeIndividual', label: 'Show Vision Range (Individual)' },
      { id: 'showVisionRangeCombined', label: 'Show Vision Range (Combined)' },
      { id: 'showVisionRangeWholeArmy', label: 'Show Vision Range (Whole Army)' },
    ],
    misc: [
      // Page 1 - Core gameplay
      { id: 'endTurn', label: 'End Turn' },
      { id: 'tagCO', label: 'Tag CO' },
      { id: 'activatePower', label: 'Power' },
      { id: 'activateSuperPower', label: 'Super Power' },
      { id: 'zoomIn', label: 'Zoom In' },
      { id: 'zoomOut', label: 'Zoom Out' },
      { id: 'pause', label: 'Pause' },
      { id: 'setDraw', label: 'Set Draw' },
      { id: 'resign', label: 'Resign' },
      // Page 1 - Calculator
      { id: 'toggleCalculator', label: 'Toggle Calculator' },
      { id: 'selectAttacker', label: 'Select Attacker' },
      { id: 'selectDefender', label: 'Select Defender' },
      { id: 'swapUnits', label: 'Swap Units' },
      // Page 2 - Chat
      { id: 'openChat', label: 'Open Chat', page: 2 },
      { id: 'closeChat', label: 'Close Chat', page: 2 },
      { id: 'sendChatMessage', label: 'Send Chat Message', page: 2 },
      // Page 2 - Movement Planner
      { id: 'openMovementPlanner', label: 'Open Movement Planner', page: 2 },
      { id: 'closeMovementPlanner', label: 'Close Movement Planner', page: 2 },
      // Page 2 - Replay controls
      { id: 'openReplay', label: 'Open Replay', page: 2 },
      { id: 'closeReplay', label: 'Close Replay', page: 2 },
      { id: 'replayFirstTurn', label: 'First Turn', page: 2 },
      { id: 'replayLatestTurn', label: 'Latest Turn', page: 2 },
      { id: 'replayForwardTurn', label: 'Forward Turn', page: 2 },
      { id: 'replayBackwardTurn', label: 'Backward Turn', page: 2 },
      { id: 'replayForwardAction', label: 'Forward Action', page: 2 },
      { id: 'replayBackwardAction', label: 'Backward Action', page: 2 },
      // Page 3 - Fullscreen (requires AWBW Maximise mod)
      { id: 'toggleMaximize', label: 'Toggle Maximize', page: 3, requiresMaximizeMod: true },
      { id: 'toggleFullscreen', label: 'Toggle Fullscreen', page: 3, requiresMaximizeMod: true },
      // Page 3 - Music Player (requires AWBW Music Player)
      { id: 'toggleMusic', label: 'Toggle Music', page: 3, requiresMusicPlayer: true },
    ],
    // Unit actions in PRIORITY ORDER (highest first)
    // Duplicates allowed - resolved by priority when same hotkey bound to multiple actions
    unit: [
      { id: 'fire', label: 'Fire', option: 'Fire', icon: 'https://awbw.amarriner.com/terrain/fire.gif', noFlip: true },
      { id: 'launch', label: 'Launch', option: 'Launch', icon: 'https://awbw.amarriner.com/terrain/fire.gif', noFlip: true },
      { id: 'explode', label: 'Explode', option: 'Explode', icon: 'https://awbw.amarriner.com/terrain/fire.gif', noFlip: true },
      { id: 'capture', label: 'Capture', option: 'Capt', icon: 'https://awbw.amarriner.com/terrain/capt_icon.gif', noFlip: true },
      { id: 'supply', label: 'Supply', option: 'Supply', icon: 'https://awbw.amarriner.com/terrain/resupply.gif', noFlip: true },
      { id: 'wait', label: 'Wait', option: 'Wait', icon: 'https://awbw.amarriner.com/terrain/wait.gif', noFlip: true },
      { id: 'repair', label: 'Repair', option: 'Repair', icon: 'https://awbw.amarriner.com/terrain/repair.gif', noFlip: true },
      { id: 'load', label: 'Load', option: 'Load', icon: 'https://awbw.amarriner.com/terrain/makeprivate.gif', noFlip: true },
      { id: 'unload1', label: 'Unload Unit 1', option: 'Unload', icon: 'https://awbw.amarriner.com/terrain/unload.gif', noFlip: true },
      { id: 'unload2', label: 'Unload Unit 2', option: 'Unload', icon: 'https://awbw.amarriner.com/terrain/unload.gif', noFlip: true },
      { id: 'hide', label: 'Hide/Unhide', option: ['Hide', 'Unhide'], icon: 'https://awbw.amarriner.com/terrain/divehide.gif', noFlip: true },
      { id: 'join', label: 'Join', option: 'Join', icon: 'https://awbw.amarriner.com/terrain/join.gif', noFlip: true },
      { id: 'delete', label: 'Delete', option: 'Delete', icon: 'https://awbw.amarriner.com/terrain/delete.gif', noFlip: true },
      { id: 'deleteConfirm', label: 'Delete & Confirm', option: 'Delete', icon: 'https://awbw.amarriner.com/terrain/delete.gif', noFlip: true },
    ],
    base: [
      { id: 'buildInfantry', label: 'Infantry', unitName: 'Infantry', icon: 'https://awbw.amarriner.com/terrain/ani/bminfantry.gif' },
      { id: 'buildMech', label: 'Mech', unitName: 'Mech', icon: 'https://awbw.amarriner.com/terrain/ani/bmmech.gif' },
      { id: 'buildRecon', label: 'Recon', unitName: 'Recon', icon: 'https://awbw.amarriner.com/terrain/ani/bmrecon.gif' },
      { id: 'buildAPC', label: 'APC', unitName: 'APC', icon: 'https://awbw.amarriner.com/terrain/ani/bmapc.gif' },
      { id: 'buildArtillery', label: 'Artillery', unitName: 'Artillery', icon: 'https://awbw.amarriner.com/terrain/ani/bmartillery.gif' },
      { id: 'buildTank', label: 'Tank', unitName: 'Tank', icon: 'https://awbw.amarriner.com/terrain/ani/bmtank.gif' },
      { id: 'buildAntiAir', label: 'Anti-Air', unitName: 'Anti-Air', icon: 'https://awbw.amarriner.com/terrain/ani/bmanti-air.gif' },
      { id: 'buildMissile', label: 'Missile', unitName: 'Missile', icon: 'https://awbw.amarriner.com/terrain/ani/bmmissile.gif' },
      { id: 'buildRocket', label: 'Rocket', unitName: 'Rocket', icon: 'https://awbw.amarriner.com/terrain/ani/bmrocket.gif' },
      { id: 'buildMdTank', label: 'Md. Tank', unitName: 'Md.Tank', icon: 'https://awbw.amarriner.com/terrain/ani/bmmdtank.gif' },
      { id: 'buildPiperunner', label: 'Piperunner', unitName: 'Piperunner', icon: 'https://awbw.amarriner.com/terrain/ani/bmpiperunner.gif' },
      { id: 'buildNeotank', label: 'Neotank', unitName: 'Neotank', icon: 'https://awbw.amarriner.com/terrain/ani/bmneotank.gif' },
      { id: 'buildMegatank', label: 'Mega Tank', unitName: 'Mega Tank', icon: 'https://awbw.amarriner.com/terrain/ani/bmmegatank.gif' },
    ],
    airport: [
      { id: 'buildTCopter', label: 'T-Copter', unitName: 'T-Copter', icon: 'https://awbw.amarriner.com/terrain/ani/bmt-copter.gif' },
      { id: 'buildBCopter', label: 'B-Copter', unitName: 'B-Copter', icon: 'https://awbw.amarriner.com/terrain/ani/bmb-copter.gif' },
      { id: 'buildFighter', label: 'Fighter', unitName: 'Fighter', icon: 'https://awbw.amarriner.com/terrain/ani/bmfighter.gif' },
      { id: 'buildBomber', label: 'Bomber', unitName: 'Bomber', icon: 'https://awbw.amarriner.com/terrain/ani/bmbomber.gif' },
      { id: 'buildStealth', label: 'Stealth', unitName: 'Stealth', icon: 'https://awbw.amarriner.com/terrain/ani/bmstealth.gif' },
      { id: 'buildBlackBomb', label: 'Black Bomb', unitName: 'Black Bomb', icon: 'https://awbw.amarriner.com/terrain/ani/bmblackbomb.gif' },
    ],
    port: [
      { id: 'buildBlackBoat', label: 'Black Boat', unitName: 'Black Boat', icon: 'https://awbw.amarriner.com/terrain/ani/bmblackboat.gif' },
      { id: 'buildLander', label: 'Lander', unitName: 'Lander', icon: 'https://awbw.amarriner.com/terrain/ani/bmlander.gif' },
      { id: 'buildCruiser', label: 'Cruiser', unitName: 'Cruiser', icon: 'https://awbw.amarriner.com/terrain/ani/bmcruiser.gif' },
      { id: 'buildSub', label: 'Sub', unitName: 'Sub', icon: 'https://awbw.amarriner.com/terrain/ani/bmsub.gif' },
      { id: 'buildBattleship', label: 'Battleship', unitName: 'Battleship', icon: 'https://awbw.amarriner.com/terrain/ani/bmbattleship.gif' },
      { id: 'buildCarrier', label: 'Carrier', unitName: 'Carrier', icon: 'https://awbw.amarriner.com/terrain/ani/bmcarrier.gif' },
    ],
  };

  // Precomputed Set of contextual action IDs (unit + building actions)
  // Used for fast O(1) filtering in handleKeyDown instead of O(n) array scans
  const CONTEXTUAL_ACTION_IDS = new Set([
    ...HOTKEY_ACTIONS.unit.map(a => a.id),
    ...HOTKEY_ACTIONS.base.map(a => a.id),
    ...HOTKEY_ACTIONS.airport.map(a => a.id),
    ...HOTKEY_ACTIONS.port.map(a => a.id),
  ]);

  // Preload all GUI icons to avoid pop-in effect
  (function preloadIcons() {
    const icons = new Set();
    // Collect all icon URLs from HOTKEY_ACTIONS
    for (const category of Object.values(HOTKEY_ACTIONS)) {
      for (const action of category) {
        if (action.icon) icons.add(action.icon);
      }
    }
    // Preload by creating Image objects
    for (const url of icons) {
      const img = new Image();
      img.src = url;
    }
  })();

  const SETTINGS_OPTIONS = [
    {
      id: 'fastBuildMenuClose',
      label: 'Fast build menu close',
      description: 'Close the build menu immediately after selecting a unit, instead of waiting for the unit to spawn',
      default: true
    },
    {
      id: 'allowDeleteWithoutCursorOverUnit',
      label: 'Allow Delete without cursor over unit',
      description: 'Allow Delete hotkey to work when cursor is not over the selected unit',
      default: true
    },
    {
      id: 'allowEndTurnWhileSelected',
      label: 'Allow End Turn when sth. is selected',
      description: 'Allow End Turn hotkey when a unit or building is selected',
      default: true
    },
    {
      id: 'allowRangeDisplayWhileSelected',
      label: 'Allow range hotkeys when sth. is selected',
      description: 'Allow range display hotkeys when a unit or building is selected',
      default: true
    },
    {
      id: 'allowCalcWhileSelected',
      label: 'Allow calc. hotkeys when sth. is selected',
      description: 'Allow calculator hotkeys when a unit or building is selected',
      default: true
    },
    {
      id: 'allowMiscWhileSelected',
      label: 'Allow misc. hotkeys when sth. is selected',
      description: 'Allow miscellaneous hotkeys (zoom, pause, etc.) when a unit or building is selected',
      default: true
    },
    {
      id: 'showHotkeysInMenus',
      label: 'Show hotkeys in menus',
      description: 'Display hotkey labels in unit action and building menus',
      default: true
    },
    {
      id: 'showTheoreticalRange',
      label: 'Show potential range',
      description: 'Show tiles that would be reachable if no units were blocking, displayed in a different color',
      default: true
    },
  ];

  // Fullscreen re-entry setting (shown in misc tab, not settings tab)
  const FULLSCREEN_REENTRY_SETTING = {
    id: 'fullscreenReentry',
    label: 'Auto re-enter fullscreen',
    description: 'When opening Chat or Movement Planner from fullscreen, the browser exits fullscreen. Enable this to automatically re-enter fullscreen when you return, triggered by mouse click or select hotkeys.',
    default: true
  };

  // ============================================================================
  // State
  // ============================================================================

  let config = loadConfig();
  // Handle setup for new users (no config) or users needing migration
  if (!config) {
    // Will show setup dialog - config created after selection
    config = null;
  }

  // Helper to get current hotkeys (works with both old and new format during transition)
  function getCurrentHotkeys() {
    if (!config) return {};
    return config.currentSettings?.hotkeys || {};
  }

  function getCurrentSettings() {
    if (!config) return {};
    return config.currentSettings?.settings || {};
  }

  let panelVisible = false;
  let rebindingAction = null;
  let rebindingTab = null;
  let pendingModifier = null;
  let modifierTimer = null;

  // View-only unit tracking (for enemy/moved units that show range but can't be commanded)
  let viewOnlyUnitSelected = false;  // True while showing range for view-only unit
  let viewOnlyUnitId = null;         // Unit ID for detecting same-unit repeated presses
  let viewOnlyCycleState = 0;        // 0=movement, 1=attack
  let selectKeyActive = false;       // True while select key is held (for proper keyup detection)
  let selectClickSuppressed = false; // True when click happened while select key held (suppress key repeats)

  // Mouse position tracking (for coordinate calculation when cursor is over menus)
  let mouseX = 0;
  let mouseY = 0;

  // Silo targeting state (for Launch action)
  let siloTargetX = null;
  let siloTargetY = null;

  // Build action tracking (for double-press confirmation)
  let lastBuildActionId = null;        // Track last build action for confirmation

  // F11 fullscreen sync flag (to prevent double-toggle)
  let exitingFullscreenOurselves = false;

  // Track which action opened end turn confirmation ('endTurn' or 'tagCO')
  let endTurnConfirmationSource = null;

  // Misc tab pagination state
  let miscTabPage = 1;
  // Page 3 only exists when maximize mod or music player is installed
  function getMiscTabTotalPages() {
    return (isMaximizeModInstalled() || isMusicPlayerInstalled()) ? 3 : 2;
  }

  // Page detection
  const currentUrl = window.location.href;
  const gamesIdMatch = currentUrl.match(/games_id=(\d+)/);
  const gamesId = gamesIdMatch ? gamesIdMatch[1] : null;
  const isGamePage = currentUrl.includes('game.php');
  const isChatPage = currentUrl.includes('press.php');
  const isMovePlannerPage = currentUrl.includes('moveplanner.php');

  // ============================================================================
  // Transport Menu Suppression State
  // ============================================================================
  // When transports with cargo execute Wait/Supply/Repair via hotkey, AWBW
  // automatically shows an "Unload" menu after they arrive. We suppress this.

  // Transport unit names for identification
  const TRANSPORT_UNITS = /^(APC|T-Copter|Lander|Black Boat|Cruiser|Carrier)$/;

  // Terrain where unloading is NOT allowed (menu won't appear on these)
  const NO_UNLOAD_TERRAIN = /Sea|Reef/;

  // Transport menu suppression state
  let transportSuppression = {
    active: false,           // Whether suppression is currently active
    transportId: null,       // Unit ID of the transport we're suppressing for
    timeoutId: null,         // Cleanup timeout ID
    autoOpenCargoMenu: false, // Auto-advance to cargo menu after Unload menu appears
    savedCurrentClick: null, // Saved user selection when they click while waiting
  };

  // ============================================================================
  // Storage
  // ============================================================================

  function createDefaultSettings() {
    const settings = {};
    for (const option of SETTINGS_OPTIONS) {
      settings[option.id] = option.default;
    }
    settings[FULLSCREEN_REENTRY_SETTING.id] = FULLSCREEN_REENTRY_SETTING.default;
    return settings;
  }

  function createEmptyHotkeys() {
    // Create hotkeys object with all keys set to null
    const hotkeys = {};
    const allActions = [
      ...HOTKEY_ACTIONS.navigation,
      ...HOTKEY_ACTIONS.misc,
      ...HOTKEY_ACTIONS.unit,
      ...HOTKEY_ACTIONS.base,
      ...HOTKEY_ACTIONS.airport,
      ...HOTKEY_ACTIONS.port
    ];
    for (const action of allActions) {
      hotkeys[action.id] = null;
    }
    return hotkeys;
  }

  function getPresetHotkeys(presetName, layout) {
    const preset = DEFAULT_PRESETS[presetName];
    if (!preset) return null;

    // Handle 'No Bindings' preset
    if (preset.hotkeys === null) {
      return createEmptyHotkeys();
    }

    // Deep clone the hotkeys
    const hotkeys = JSON.parse(JSON.stringify(preset.hotkeys));

    // Convert for QWERTZ if needed
    if (layout === 'QWERTZ') {
      convertHotkeysLayout(hotkeys);
    }

    return hotkeys;
  }

  function getPresetSettings(presetName) {
    const preset = DEFAULT_PRESETS[presetName];
    const settings = createDefaultSettings();

    // Apply preset-specific settings overrides if defined
    if (preset?.settings) {
      for (const [key, value] of Object.entries(preset.settings)) {
        settings[key] = value;
      }
    }

    return settings;
  }

  function convertHotkeysLayout(hotkeys) {
    // Swap y <-> z for QWERTZ conversion (works both directions)
    for (const key of Object.keys(hotkeys)) {
      if (hotkeys[key]?.key === 'y') {
        hotkeys[key].key = 'z';
      } else if (hotkeys[key]?.key === 'z') {
        hotkeys[key].key = 'y';
      }
    }
  }

  function loadConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.storageVersion === VERSION) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('AWBW Hotkeys: Failed to load config', e);
    }
    return null; // Will trigger setup dialog
  }

  function saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('AWBW Hotkeys: Failed to save config', e);
    }
  }

  function profilesMatch(settings1, settings2) {
    // Check if two settings objects are identical (for unsaved changes detection)
    return JSON.stringify(settings1) === JSON.stringify(settings2);
  }

  function hasUnsavedChanges() {
    if (!config || !config.currentSettings) return false;

    // Check if current settings match any saved profile
    for (const profileName of Object.keys(config.savedProfiles)) {
      if (profilesMatch(config.currentSettings, config.savedProfiles[profileName])) {
        return false;
      }
    }

    // Check if current settings match any default preset
    for (const presetName of Object.keys(DEFAULT_PRESETS)) {
      const presetHotkeys = getPresetHotkeys(presetName, config.layout);
      const presetSettings = {
        hotkeys: presetHotkeys,
        settings: getPresetSettings(presetName)
      };
      if (profilesMatch(config.currentSettings, presetSettings)) {
        return false;
      }
    }

    return true;
  }

  // ============================================================================
  // Icon Cache
  // ============================================================================

  let iconCache = {};

  function loadIconCache() {
    try {
      const stored = localStorage.getItem(ICON_CACHE_KEY);
      if (stored) {
        iconCache = JSON.parse(stored);
      }
    } catch (e) {
      console.error('AWBW Hotkeys: Failed to load icon cache', e);
      iconCache = {};
    }
  }

  function saveIconCache() {
    try {
      localStorage.setItem(ICON_CACHE_KEY, JSON.stringify(iconCache));
    } catch (e) {
      console.error('AWBW Hotkeys: Failed to save icon cache', e);
    }
  }

  // Fetch a GIF and convert to base64 data URL, with caching
  async function getIconDataUrl(url) {
    // Return cached version if available
    if (iconCache[url]) {
      return iconCache[url];
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          // Cache it
          iconCache[url] = dataUrl;
          saveIconCache();
          resolve(dataUrl);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error('AWBW Hotkeys: Failed to fetch icon', url, e);
      return url; // Fallback to original URL
    }
  }

  function createNewConfig(layout, presetName) {
    return {
      storageVersion: VERSION,
      layout: layout,
      currentSettings: {
        hotkeys: getPresetHotkeys(presetName, layout),
        settings: createDefaultSettings()
      },
      savedProfiles: {},
      lastLoadedProfile: null
    };
  }

  // ============================================================================
  // Hotkey Display Helpers
  // ============================================================================

  function formatHotkey(binding) {
    if (!binding) return '';
    let display = '';
    if (binding.modifier) {
      display += binding.modifier.toUpperCase() + ' + ';
    }
    // Map special keys to display symbols
    const keyLower = binding.key.toLowerCase();
    let key;
    if (keyLower === ' ') {
      key = 'SPACE';
    } else if (keyLower === 'arrowup') {
      key = '↑';
    } else if (keyLower === 'arrowdown') {
      key = '↓';
    } else if (keyLower === 'arrowleft') {
      key = '←';
    } else if (keyLower === 'arrowright') {
      key = '→';
    } else {
      key = binding.key.toUpperCase();
    }
    display += key;
    return display;
  }

  function hotkeyEquals(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.key === b.key && a.modifier === b.modifier;
  }

  // ============================================================================
  // Menu Hotkey Display
  // ============================================================================

  // Format hotkey for menu display with compact modifier symbols
  function formatHotkeyForMenu(binding) {
    if (!binding) return null;
    let display = '';
    if (binding.modifier) {
      // Use compact symbols for modifiers
      if (binding.modifier === 'ctrl') display += '^';
      else if (binding.modifier === 'shift') display += '⇧';
      else if (binding.modifier === 'alt') display += '⌥';
    }
    // Map special keys to display symbols
    const keyLower = binding.key.toLowerCase();
    if (keyLower === ' ') {
      display += '␣';
    } else if (keyLower === 'arrowup') {
      display += '↑';
    } else if (keyLower === 'arrowdown') {
      display += '↓';
    } else if (keyLower === 'arrowleft') {
      display += '←';
    } else if (keyLower === 'arrowright') {
      display += '→';
    } else if (keyLower === 'escape') {
      display += 'Esc';
    } else if (keyLower === 'enter') {
      display += '↵';
    } else if (keyLower === 'tab') {
      display += 'Tab';
    } else if (keyLower === 'delete') {
      display += 'Del';
    } else if (keyLower === 'backspace') {
      display += '⌫';
    } else {
      display += binding.key.toUpperCase();
    }
    return display;
  }

  // Map menu option text to hotkey action IDs
  const MENU_OPTION_TO_ACTION = {
    // Unit actions
    'Fire': 'fire',
    'Wait': 'wait',
    'Capt': 'capture',
    'Load': 'load',
    'Unload': 'unload1',  // First unload key shown on Unload option
    'Join': 'join',
    'Supply': 'supply',
    'Hide': 'hide',
    'Unhide': 'hide',
    'Repair': 'repair',
    'Launch': 'launch',
    'Explode': 'explode',
    'Delete': 'delete',
    'Fire Silo': 'launch',
  };

  // Map build menu unit names to hotkey action IDs
  const BUILD_UNIT_TO_ACTION = {
    'Infantry': 'buildInfantry',
    'Mech': 'buildMech',
    'Recon': 'buildRecon',
    'APC': 'buildAPC',
    'Tank': 'buildTank',
    'Anti-Air': 'buildAntiAir',
    'Artillery': 'buildArtillery',
    'Md.Tank': 'buildMdTank',
    'Rocket': 'buildRocket',
    'Neotank': 'buildNeotank',
    'Missile': 'buildMissile',
    'Mega Tank': 'buildMegatank',
    'Piperunner': 'buildPiperunner',
    'T-Copter': 'buildTCopter',
    'B-Copter': 'buildBCopter',
    'Fighter': 'buildFighter',
    'Bomber': 'buildBomber',
    'Stealth': 'buildStealth',
    'Black Bomb': 'buildBlackBomb',
    'Black Boat': 'buildBlackBoat',
    'Lander': 'buildLander',
    'Cruiser': 'buildCruiser',
    'Sub': 'buildSub',
    'Battleship': 'buildBattleship',
    'Carrier': 'buildCarrier',
  };

  // Inject hotkeys into unit action menu using wrapper span for Icon -> Hotkey -> Name order
  function injectHotkeysIntoUnitMenu() {
    if (!config?.currentSettings?.settings?.showHotkeysInMenus) return;

    const menuItems = document.querySelectorAll('.unit-options-game ul li');
    menuItems.forEach(li => {
      // Skip if already processed
      if (li.hasAttribute('data-hotkey')) return;

      const optionText = li.textContent.trim();
      const actionId = MENU_OPTION_TO_ACTION[optionText];
      if (!actionId) {
        li.setAttribute('data-hotkey', ''); // Mark as processed even if no hotkey
        return;
      }

      let hotkeyText;

      // Special case for Unload - show both hotkeys
      if (optionText === 'Unload') {
        const binding1 = config.currentSettings.hotkeys['unload1'];
        const binding2 = config.currentSettings.hotkeys['unload2'];
        const hotkey1 = formatHotkeyForMenu(binding1);
        const hotkey2 = formatHotkeyForMenu(binding2);

        if (hotkey1 && hotkey2 && hotkey1 !== hotkey2) {
          hotkeyText = `[${hotkey1}]/[${hotkey2}]`;
        } else if (hotkey1) {
          hotkeyText = `[${hotkey1}]`;
        } else if (hotkey2) {
          hotkeyText = `[${hotkey2}]`;
        }
      } else {
        const binding = config.currentSettings.hotkeys[actionId];
        const formatted = formatHotkeyForMenu(binding);
        if (formatted) {
          hotkeyText = `[${formatted}]`;
        }
      }

      if (!hotkeyText) {
        li.setAttribute('data-hotkey', '');
        return;
      }

      // Wrap the icon in a span so we can use ::after for the hotkey
      const img = li.querySelector('img');
      if (img) {
        const wrapper = document.createElement('span');
        wrapper.className = 'menu-icon-wrapper';
        wrapper.setAttribute('data-hotkey', hotkeyText);
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      }

      // Mark li as processed
      li.setAttribute('data-hotkey', 'processed');
    });
  }

  // Inject hotkeys into build menu using wrapper span
  function injectHotkeysIntoBuildMenu() {
    if (!config?.currentSettings?.settings?.showHotkeysInMenus) return;

    const menuItems = document.querySelectorAll('.build-options-game li');
    menuItems.forEach(li => {
      // Skip if already processed
      if (li.hasAttribute('data-hotkey')) return;

      // Get unit name - exclude the cost span text
      // The li structure is: <span><img></span> "UnitName" <span class="unit-cost">1000</span>
      let unitName = '';
      for (const node of li.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          unitName += node.textContent;
        }
      }
      unitName = unitName.trim();

      const actionId = BUILD_UNIT_TO_ACTION[unitName];
      if (!actionId) {
        li.setAttribute('data-hotkey', '');
        return;
      }

      const binding = config.currentSettings.hotkeys[actionId];
      const hotkeyText = formatHotkeyForMenu(binding);
      if (!hotkeyText) {
        li.setAttribute('data-hotkey', '');
        return;
      }

      // Find the span containing the icon and add data-hotkey to it
      const iconSpan = li.querySelector('span:not(.unit-cost)');
      if (iconSpan) {
        iconSpan.classList.add('menu-icon-wrapper');
        iconSpan.setAttribute('data-hotkey', `[${hotkeyText}]`);
      }

      // Mark li as processed
      li.setAttribute('data-hotkey', 'processed');
    });
  }

  // Inject hotkeys into cargo menu (unload) using wrapper span
  function injectHotkeysIntoCargoMenu() {
    if (!config?.currentSettings?.settings?.showHotkeysInMenus) return;

    const menuItems = document.querySelectorAll('.unit-options-game ul li[data-drop-id]');
    const itemCount = menuItems.length;

    menuItems.forEach((li, index) => {
      // Skip if already processed by us
      if (li.getAttribute('data-hotkey') === 'processed') return;

      let hotkeyText;

      // If only 1 cargo unit, both hotkeys work - show both
      if (itemCount === 1) {
        const binding1 = config.currentSettings.hotkeys['unload1'];
        const binding2 = config.currentSettings.hotkeys['unload2'];
        const hotkey1 = formatHotkeyForMenu(binding1);
        const hotkey2 = formatHotkeyForMenu(binding2);

        if (hotkey1 && hotkey2 && hotkey1 !== hotkey2) {
          hotkeyText = `[${hotkey1}]/[${hotkey2}]`;
        } else if (hotkey1) {
          hotkeyText = `[${hotkey1}]`;
        } else if (hotkey2) {
          hotkeyText = `[${hotkey2}]`;
        }
      } else {
        // Multiple cargo - first uses unload1, second uses unload2
        const actionId = index === 0 ? 'unload1' : 'unload2';
        const binding = config.currentSettings.hotkeys[actionId];
        const formatted = formatHotkeyForMenu(binding);
        if (formatted) {
          hotkeyText = `[${formatted}]`;
        }
      }

      if (!hotkeyText) {
        li.setAttribute('data-hotkey', 'processed');
        return;
      }

      // Find the menu-unit span and add hotkey after it
      const menuUnitSpan = li.querySelector('.menu-unit');
      if (menuUnitSpan) {
        menuUnitSpan.classList.add('menu-icon-wrapper');
        menuUnitSpan.setAttribute('data-hotkey', hotkeyText);
      }

      // Mark li as processed
      li.setAttribute('data-hotkey', 'processed');
    });
  }

  // Set up observer for menu changes
  function setupMenuHotkeyObserver() {
    if (!isGamePage) return;

    // Observe unit options menu
    const unitMenu = document.querySelector('.unit-options-game');
    if (unitMenu) {
      const observer = new MutationObserver(() => {
        injectHotkeysIntoUnitMenu();
        injectHotkeysIntoCargoMenu();
      });
      observer.observe(unitMenu, { childList: true, subtree: true });
    }

    // Observe build options menu
    const buildMenu = document.querySelector('.build-options-game');
    if (buildMenu) {
      const observer = new MutationObserver(() => {
        injectHotkeysIntoBuildMenu();
      });
      observer.observe(buildMenu, { childList: true, subtree: true });
    }
  }

  // ============================================================================
  // Native Hotkey Blocking
  // ============================================================================

  const NATIVE_HOTKEYS = new Set(['q', 'e', 'a', 'd', 'c', 'shift', 'control', 'alt']);

  function shouldBlockNativeHotkey(key) {
    return NATIVE_HOTKEYS.has(key.toLowerCase());
  }

  // ============================================================================
  // Auto-Repeat Suppression
  // ============================================================================

  const pressedKeys = new Set();

  // Actions that should allow repeats (range display needs updates as cursor moves)
  const ALLOW_REPEAT_ACTIONS = new Set([
    'showMovementRangeCombined',
    'showMovementRangeIndividual',
    'showMovementRangeWholeArmy',
    'showAttackRangeCombined',
    'showAttackRangeIndividual',
    'showAttackRangeType',
    'showAttackRangeWholeArmy',
    'showVisionRangeIndividual',
    'showVisionRangeCombined',
    'showVisionRangeWholeArmy',
    'zoomIn',
    'zoomOut',
  ]);

  function isRepeatAllowed(actionId) {
    return ALLOW_REPEAT_ACTIONS.has(actionId);
  }

  // ============================================================================
  // Range Display State
  // ============================================================================

  let rangeKeyHeld = null;        // Current range type being held
  let rangeMainKey = null;        // The main key (without modifier) that started the range display
  let rangeClickSuppressed = false; // True when range was cancelled by click, ignore keydowns until key released
  let lockedTeam = null;          // Team ID of first unit selected (for accumulating modes)
  const currentPreviewUnits = new Set();
  let tileMatrix = null;
  let blockedTileMatrix = null;   // For potential range: tiles blocked by units
  let individualModeLastUnit = null;  // For "Individual" modes: track last displayed unit
  let typeModeLastUnitName = null;    // For "Type" mode: track last displayed unit type

  // Selector for clearing all range tiles
  const TILE_SELECTOR = "span[class$='tile'], span[class$='square'], .action-square, .check-range-square, .blocked-movement-bg, .blocked-movement-border, .blocked-range-bg, .blocked-range-border, .movement-tile-bg, .movement-tile-border, .range-tile-bg, .range-tile-border, .vision-tile-bg, .vision-tile-border";

  // Selector for only OUR custom tile classes (not AWBW's native tiles)
  const CUSTOM_TILE_SELECTOR = ".blocked-movement-bg, .blocked-movement-border, .blocked-range-bg, .blocked-range-border, .movement-tile-bg, .movement-tile-border, .range-tile-bg, .range-tile-border, .vision-tile-bg, .vision-tile-border";

  // Non-attacking unit names (transports that can't attack)
  const NON_ATTACKING_UNITS = ["APC", "T-Copter", "Lander", "Black Boat"];

  // ============================================================================
  // Range Display Helpers
  // ============================================================================

  function resetTilesMatrix() {
    tileMatrix = [];
    blockedTileMatrix = [];
    for (let row = 0; row < maxY; row++) {
      tileMatrix[row] = [];
      blockedTileMatrix[row] = [];
      for (let col = 0; col < maxX; col++) {
        tileMatrix[row][col] = false;
        blockedTileMatrix[row][col] = false;
      }
    }
  }

  function addUniqueTiles(tiles) {
    if (!tileMatrix) {
      resetTilesMatrix();
    }
    tiles.forEach(tile => {
      if (tile.y >= 0 && tile.y < maxY && tile.x >= 0 && tile.x < maxX) {
        tileMatrix[tile.y][tile.x] = true;
      }
    });
  }

  // Add tiles with potential range support
  function addUniqueTilesWithTheoretical(result) {
    if (!tileMatrix) {
      resetTilesMatrix();
    }

    // If result has actual/theoretical structure
    if (result && result.actual && result.theoretical) {
      // Add actual tiles to main matrix
      result.actual.forEach(tile => {
        if (tile.y >= 0 && tile.y < maxY && tile.x >= 0 && tile.x < maxX) {
          tileMatrix[tile.y][tile.x] = true;
        }
      });

      // Create set of actual tile keys for fast lookup
      const actualSet = new Set(result.actual.map(t => `${t.x},${t.y}`));

      // Add theoretical-only tiles (blocked) to blocked matrix
      result.theoretical.forEach(tile => {
        if (tile.y >= 0 && tile.y < maxY && tile.x >= 0 && tile.x < maxX) {
          const key = `${tile.x},${tile.y}`;
          if (!actualSet.has(key)) {
            blockedTileMatrix[tile.y][tile.x] = true;
          }
        }
      });
    } else {
      // Fallback: just add as regular tiles
      const tiles = Array.isArray(result) ? result : [];
      addUniqueTiles(tiles);
    }
  }

  function getUnitAt(x, y) {
    // Exclude cargo units (units_carried === "Y") - they share coordinates with their transport
    return Object.values(unitsInfo).find(unit =>
      unit?.units_x == x &&
      unit?.units_y == y &&
      unit?.units_carried !== "Y"
    );
  }

  // Map internal type names to AWBW's draw types for correct colors
  function getDrawType(type) {
    if (type.startsWith('movement')) return 'movement';
    if (type.startsWith('attack')) return 'range';
    if (type.startsWith('vision')) return 'vision';
    return type;
  }

  function drawTilesWithBorders(type) {
    if (!tileMatrix) return;

    const tilesWithBorders = [];
    const tilesWithoutBorders = [];
    const blockedTilesToDraw = [];

    // Process actual tiles
    for (let r = 0; r < tileMatrix.length; r++) {
      for (let c = 0; c < tileMatrix[r].length; c++) {
        if (!tileMatrix[r][c]) continue;

        let borderWidth = {
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
        };

        // Use tileMatrix only for border calculation
        // This keeps actual range border visible even when blocked tiles are adjacent
        if (r === 0 || !tileMatrix[r - 1]?.[c]) {
          borderWidth.top = "1px";
        }
        if (r === tileMatrix.length - 1 || !tileMatrix[r + 1]?.[c]) {
          borderWidth.bottom = "1px";
        }
        if (c === 0 || !tileMatrix[r]?.[c - 1]) {
          borderWidth.left = "1px";
        }
        if (c === tileMatrix[r].length - 1 || !tileMatrix[r]?.[c + 1]) {
          borderWidth.right = "1px";
        }

        const bw = `${borderWidth.top} ${borderWidth.right} ${borderWidth.bottom} ${borderWidth.left} `;
        const tile = { x: c, y: r, borderWidth: bw };

        // Separate tiles with and without borders
        if (bw === "0 0 0 0 ") {
          tilesWithoutBorders.push(tile);
        } else {
          tilesWithBorders.push(tile);
        }
      }
    }

    // Process blocked tiles (if setting enabled)
    if (blockedTileMatrix && config?.currentSettings?.settings?.showTheoreticalRange) {
      for (let r = 0; r < blockedTileMatrix.length; r++) {
        for (let c = 0; c < blockedTileMatrix[r].length; c++) {
          if (!blockedTileMatrix[r][c]) continue;

          let borderWidth = {
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
          };

          // Only draw border if:
          // 1. No blocked tile adjacent AND
          // 2. No actual tile adjacent (so actual tile's border shows instead)
          if ((r === 0 || !blockedTileMatrix[r - 1]?.[c]) && !tileMatrix[r - 1]?.[c]) {
            borderWidth.top = "1px";
          }
          if ((r === blockedTileMatrix.length - 1 || !blockedTileMatrix[r + 1]?.[c]) && !tileMatrix[r + 1]?.[c]) {
            borderWidth.bottom = "1px";
          }
          if ((c === 0 || !blockedTileMatrix[r]?.[c - 1]) && !tileMatrix[r]?.[c - 1]) {
            borderWidth.left = "1px";
          }
          if ((c === blockedTileMatrix[r].length - 1 || !blockedTileMatrix[r]?.[c + 1]) && !tileMatrix[r]?.[c + 1]) {
            borderWidth.right = "1px";
          }

          blockedTilesToDraw.push({
            x: c,
            y: r,
            borderWidth: `${borderWidth.top} ${borderWidth.right} ${borderWidth.bottom} ${borderWidth.left} `,
          });
        }
      }
    }

    // Draw blocked tiles first
    if (blockedTilesToDraw.length > 0) {
      drawBlockedTiles(blockedTilesToDraw, getDrawType(type));
    }

    // Draw actual tiles with separated background/border layers
    const allActualTiles = [...tilesWithoutBorders, ...tilesWithBorders];
    drawActualTiles(allActualTiles, getDrawType(type));
  }

  // Draw actual tiles with separate background and border layers
  function drawActualTiles(tiles, type) {
    const gamemap = document.getElementById('gamemap');
    if (!gamemap) return;

    let bgClass, borderClass;
    if (type === 'movement') {
      bgClass = 'movement-tile-bg';
      borderClass = 'movement-tile-border';
    } else if (type === 'vision') {
      bgClass = 'vision-tile-bg';
      borderClass = 'vision-tile-border';
    } else {
      bgClass = 'range-tile-bg';
      borderClass = 'range-tile-border';
    }

    const fragment = document.createDocumentFragment();

    // First layer: backgrounds only
    for (const tile of tiles) {
      const bgSpan = document.createElement('span');
      bgSpan.className = bgClass;
      bgSpan.style.left = (tile.x * 16 - 1) + 'px';
      bgSpan.style.top = (tile.y * 16 - 1) + 'px';
      fragment.appendChild(bgSpan);
    }

    // Second layer: borders only
    for (const tile of tiles) {
      if (tile.borderWidth === "0 0 0 0 ") continue;

      const borderSpan = document.createElement('span');
      borderSpan.className = borderClass;
      borderSpan.style.left = (tile.x * 16 - 1) + 'px';
      borderSpan.style.top = (tile.y * 16 - 1) + 'px';
      borderSpan.style.borderStyle = 'solid';
      borderSpan.style.borderWidth = tile.borderWidth;
      fragment.appendChild(borderSpan);
    }

    gamemap.appendChild(fragment);
  }

  // Draw blocked tiles with separate background and border layers
  function drawBlockedTiles(tiles, type) {
    const gamemap = document.getElementById('gamemap');
    if (!gamemap) return;

    const bgClass = type === 'movement'
      ? 'blocked-movement-bg'
      : 'blocked-range-bg';
    const borderClass = type === 'movement'
      ? 'blocked-movement-border'
      : 'blocked-range-border';

    const fragment = document.createDocumentFragment();

    // First layer: backgrounds only
    for (const tile of tiles) {
      const bgSpan = document.createElement('span');
      bgSpan.className = bgClass;
      bgSpan.style.left = (tile.x * 16 - 1) + 'px';
      bgSpan.style.top = (tile.y * 16 - 1) + 'px';
      fragment.appendChild(bgSpan);
    }

    // Second layer: borders only
    for (const tile of tiles) {
      if (tile.borderWidth === "0 0 0 0 ") continue;

      const borderSpan = document.createElement('span');
      borderSpan.className = borderClass;
      borderSpan.style.left = (tile.x * 16 - 1) + 'px';
      borderSpan.style.top = (tile.y * 16 - 1) + 'px';
      borderSpan.style.borderStyle = 'solid';
      borderSpan.style.borderWidth = tile.borderWidth;
      fragment.appendChild(borderSpan);
    }

    gamemap.appendChild(fragment);
  }

  // Draw tiles with borders from a simple tile array (used for view-only unit display)
  // Creates temporary matrix for border calculation, then draws with proper edge detection
  function drawTilesWithBordersFromArray(tiles, type) {
    if (!tiles || tiles.length === 0) return;

    // Create temporary matrix for border calculation
    const tempMatrix = [];
    for (let row = 0; row < maxY; row++) {
      tempMatrix[row] = [];
      for (let col = 0; col < maxX; col++) {
        tempMatrix[row][col] = false;
      }
    }

    // Mark tiles in matrix
    for (const tile of tiles) {
      if (tile.y >= 0 && tile.y < maxY && tile.x >= 0 && tile.x < maxX) {
        tempMatrix[tile.y][tile.x] = true;
      }
    }

    // Calculate borders and build draw list
    const tilesWithBorders = [];
    const tilesWithoutBorders = [];
    for (let r = 0; r < tempMatrix.length; r++) {
      for (let c = 0; c < tempMatrix[r].length; c++) {
        if (!tempMatrix[r][c]) continue;

        let borderWidth = {
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
        };

        if (r === 0 || !tempMatrix[r - 1]?.[c]) borderWidth.top = "1px";
        if (r === tempMatrix.length - 1 || !tempMatrix[r + 1]?.[c]) borderWidth.bottom = "1px";
        if (c === 0 || !tempMatrix[r]?.[c - 1]) borderWidth.left = "1px";
        if (c === tempMatrix[r].length - 1 || !tempMatrix[r]?.[c + 1]) borderWidth.right = "1px";

        const bw = `${borderWidth.top} ${borderWidth.right} ${borderWidth.bottom} ${borderWidth.left} `;
        const tile = { x: c, y: r, borderWidth: bw };

        if (bw === "0 0 0 0 ") {
          tilesWithoutBorders.push(tile);
        } else {
          tilesWithBorders.push(tile);
        }
      }
    }

    // Draw with separated background/border layers
    const allTiles = [...tilesWithoutBorders, ...tilesWithBorders];
    drawActualTiles(allTiles, type);
  }

  // ============================================================================
  // Range Calculation Helpers
  // ============================================================================

  // Extract all terrain-reachable tiles from the dist array (ignores unit blocking)
  function getTheoreticalTilesFromDist(dist) {
    const tiles = [];
    if (!dist) return tiles;

    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        const node = y * maxX + x;
        if (dist[node] !== undefined && dist[node] !== Infinity) {
          tiles.push({ x, y });
        }
      }
    }
    return tiles;
  }

  // Get movement tiles for a single unit (returns both actual and theoretical if setting enabled)
  function getMovementTilesForUnit(unit, includeTheoretical = false) {
    const unitTeam = playersInfo[unit.units_players_id].players_team;
    const unitPId = unit.units_players_id;
    const startTile = { x: unit.units_x, y: unit.units_y };
    const mType = unit.units_movement_type;
    const mp = Math.min(unit.units_fuel, unit.units_movement_points);

    // Get actual tiles (with unit blocking)
    const movementInfo = window.getMovementTiles(maxX, maxY, mType, mp, startTile, unitTeam, playersInfo[unitPId], false);
    const actualTiles = movementInfo.tilesToDraw || [];

    if (includeTheoretical && typeof unitMap !== 'undefined') {
      // Save unitMap contents and clear them (keep the object reference)
      const savedEntries = {};
      for (const key in unitMap) {
        savedEntries[key] = unitMap[key];
        delete unitMap[key];
      }

      try {
        const theoreticalInfo = window.getMovementTiles(maxX, maxY, mType, mp, startTile, unitTeam, playersInfo[unitPId], false);
        const theoreticalTiles = theoreticalInfo.tilesToDraw || [];
        return { actual: actualTiles, theoretical: theoreticalTiles };
      } finally {
        // Restore unitMap contents
        for (const key in savedEntries) {
          unitMap[key] = savedEntries[key];
        }
      }
    }

    return actualTiles;
  }

  // Get attack tiles for a single unit (handles both melee and ranged)
  function getAttackTilesForUnit(unit, includeTheoretical = false) {
    if (NON_ATTACKING_UNITS.includes(unit.units_name)) {
      return includeTheoretical ? { actual: [], theoretical: [] } : [];
    }

    const startTile = { x: unit.units_x, y: unit.units_y };

    if (unit.units_short_range === 0) {
      // MELEE: Movement range + 1 tile around each reachable position
      const movementResult = getMovementTilesForUnit(unit, includeTheoretical);

      if (includeTheoretical && movementResult.actual) {
        const actualTiles = movementResult.actual;
        const theoreticalTiles = movementResult.theoretical;

        const actualAttack = expandTilesToAdjacent([...actualTiles, startTile]);
        const theoreticalAttack = expandTilesToAdjacent([...theoreticalTiles, startTile]);

        return { actual: actualAttack, theoretical: theoreticalAttack };
      } else {
        const movementTiles = Array.isArray(movementResult) ? movementResult : movementResult.actual || [];
        return expandTilesToAdjacent([...movementTiles, startTile]);
      }
    } else {
      // RANGED: Use native function (ranged units can't move and fire, so no theoretical difference)
      const tiles = window.createAttackRangeTilesForUnit(unit, startTile) || [];
      return includeTheoretical ? { actual: tiles, theoretical: tiles } : tiles;
    }
  }

  // Helper to expand tiles to include adjacent tiles (for melee attack range)
  function expandTilesToAdjacent(tiles) {
    const attackTiles = [];
    for (const tile of tiles) {
      const adjacent = [
        { x: tile.x - 1, y: tile.y },
        { x: tile.x + 1, y: tile.y },
        { x: tile.x, y: tile.y - 1 },
        { x: tile.x, y: tile.y + 1 },
      ];
      for (const adj of adjacent) {
        if (adj.x >= 0 && adj.x < maxX && adj.y >= 0 && adj.y < maxY) {
          attackTiles.push(adj);
        }
      }
    }
    return attackTiles;
  }

  // Get vision tiles for a single unit
  function getVisionTilesForUnit(unit) {
    const unitId = unit.units_id;
    const startTile = { x: unit.units_x, y: unit.units_y };
    let unitVision = unit.units_vision;
    unitVision = window.checkMountain(unitId, unitVision, startTile.x, startTile.y);
    return window.createSquareInRangeOf(unitVision, 1, "vision", startTile.x, startTile.y, null, false) || [];
  }

  // Get all units belonging to a team
  function getTeamUnits(team) {
    return Object.values(unitsInfo).filter(u => {
      if (!u) return false;
      const uTeam = playersInfo[u.units_players_id]?.players_team;
      return uTeam === team;
    });
  }

  // ============================================================================
  // Main Range Display Function
  // ============================================================================

  function addTilesForUnitAt(x, y, type) {
    const unit = getUnitAt(x, y);
    const showTheoretical = config?.currentSettings?.settings?.showTheoreticalRange;

    // Handle "Single" modes specially
    if (type === 'movementIndividual' || type === 'attackIndividual' || type === 'visionIndividual') {
      // If no unit at cursor, keep showing last unit (do nothing)
      if (!unit) return;

      // If same unit as before, do nothing
      if (individualModeLastUnit === unit) return;

      // New unit - clear and show new range
      individualModeLastUnit = unit;
      resetTilesMatrix();
      currentPreviewUnits.clear();

      if (type === 'movementIndividual') {
        if (showTheoretical) {
          addUniqueTilesWithTheoretical(getMovementTilesForUnit(unit, true));
        } else {
          addUniqueTiles(getMovementTilesForUnit(unit));
        }
      } else if (type === 'attackIndividual') {
        if (showTheoretical) {
          addUniqueTilesWithTheoretical(getAttackTilesForUnit(unit, true));
        } else {
          addUniqueTiles(getAttackTilesForUnit(unit));
        }
      } else {
        addUniqueTiles(getVisionTilesForUnit(unit));
      }

      window.resetCreatedTiles(TILE_SELECTOR);
      drawTilesWithBorders(type);
      return;
    }

    // Handle "Type" mode - shows attack range of all units of the same type
    if (type === 'attackType') {
      // If no unit at cursor, keep showing last type (do nothing)
      if (!unit) return;

      const unitName = unit.units_name;

      // If same unit type as before, do nothing
      if (typeModeLastUnitName === unitName) return;

      // New unit type - clear and show all units of this type
      typeModeLastUnitName = unitName;
      resetTilesMatrix();
      currentPreviewUnits.clear();

      // Get all units of the same type on the same team
      const unitTeam = playersInfo[unit.units_players_id].players_team;
      const teamUnits = getTeamUnits(unitTeam);
      const sameTypeUnits = teamUnits.filter(u => u.units_name === unitName);

      // Add attack tiles for all units of this type
      for (const u of sameTypeUnits) {
        if (!NON_ATTACKING_UNITS.includes(u.units_name)) {
          if (showTheoretical) {
            addUniqueTilesWithTheoretical(getAttackTilesForUnit(u, true));
          } else {
            addUniqueTiles(getAttackTilesForUnit(u));
          }
        }
      }

      window.resetCreatedTiles(TILE_SELECTOR);
      drawTilesWithBorders(type);
      return;
    }

    // For non-single modes, require a unit
    if (!unit) return;

    // Skip if already processed this unit (for accumulating modes)
    if (currentPreviewUnits.has(unit)) return;

    const unitTeam = playersInfo[unit.units_players_id].players_team;

    // "All" modes show entire army from first unit hovered
    if (type === 'movementWholeArmy' || type === 'attackWholeArmy' || type === 'visionWholeArmy') {
      // Only process once per key hold
      if (currentPreviewUnits.size > 0) return;

      currentPreviewUnits.add(unit);
      const teamUnits = getTeamUnits(unitTeam);

      if (type === 'movementWholeArmy') {
        for (const u of teamUnits) {
          if (showTheoretical) {
            addUniqueTilesWithTheoretical(getMovementTilesForUnit(u, true));
          } else {
            addUniqueTiles(getMovementTilesForUnit(u));
          }
        }
      } else if (type === 'attackWholeArmy') {
        const attackingUnits = teamUnits.filter(u => !NON_ATTACKING_UNITS.includes(u.units_name));
        for (const u of attackingUnits) {
          if (showTheoretical) {
            addUniqueTilesWithTheoretical(getAttackTilesForUnit(u, true));
          } else {
            addUniqueTiles(getAttackTilesForUnit(u));
          }
        }
      } else if (type === 'visionWholeArmy') {
        for (const u of teamUnits) {
          addUniqueTiles(getVisionTilesForUnit(u));
        }
      }

      window.resetCreatedTiles(TILE_SELECTOR);
      drawTilesWithBorders(type);
      return;
    }

    // Accumulating modes (movement, attack, vision) - team locked
    // Team locking: first unit locks the team
    if (lockedTeam === null) {
      lockedTeam = unitTeam;
    } else if (unitTeam !== lockedTeam) {
      return;  // Skip units from different team
    }

    currentPreviewUnits.add(unit);

    if (type === 'movementCombined') {
      if (showTheoretical) {
        addUniqueTilesWithTheoretical(getMovementTilesForUnit(unit, true));
      } else {
        addUniqueTiles(getMovementTilesForUnit(unit));
      }
    } else if (type === 'attackCombined') {
      if (showTheoretical) {
        addUniqueTilesWithTheoretical(getAttackTilesForUnit(unit, true));
      } else {
        addUniqueTiles(getAttackTilesForUnit(unit));
      }
    } else if (type === 'visionCombined') {
      addUniqueTiles(getVisionTilesForUnit(unit));
    }

    // Clear existing and redraw
    window.resetCreatedTiles(TILE_SELECTOR);
    drawTilesWithBorders(type);
  }

  function clearRangePreview() {
    window.resetCreatedTiles(TILE_SELECTOR);
    currentPreviewUnits.clear();
    resetTilesMatrix();
    lockedTeam = null;
    rangeKeyHeld = null;
    rangeMainKey = null;
    rangeClickSuppressed = false;
    individualModeLastUnit = null;
    typeModeLastUnitName = null;
  }

  function handleRangeKeyDown(type, mainKey) {
    // Ignore if range was cancelled by a click (wait for key release)
    if (rangeClickSuppressed) {
      return;
    }

    // If already holding a different range key, clear and switch to new one
    if (rangeKeyHeld && rangeKeyHeld !== type) {
      clearRangePreview();
    } else if (rangeKeyHeld) {
      return; // Same key already held
    }

    rangeKeyHeld = type;
    rangeMainKey = mainKey;  // Store the main key for keyup detection

    // Immediately show for current cursor position
    addTilesForUnitAt(window.coordX, window.coordY, type);
  }

  function handleRangeKeyUp(releasedKey) {
    // Normalize key name (e.key uses 'control', but we store 'ctrl')
    let normalizedKey = releasedKey;
    if (releasedKey === 'control') normalizedKey = 'ctrl';

    // Clear click suppression when the key is released
    if (rangeClickSuppressed && rangeMainKey && normalizedKey === rangeMainKey) {
      rangeClickSuppressed = false;
      rangeMainKey = null;
    }

    // Only clear if the released key matches the main key that started this range
    if (rangeKeyHeld && rangeMainKey && normalizedKey === rangeMainKey) {
      clearRangePreview();

      // Restore selected unit's movement range if one was selected
      // Just redraw the tiles - the unit is still selected (currentClick, path arrow, etc.)
      if (window.currentClick?.type === 'unit' && window.currentClick?.info && window.moving) {
        const unit = window.currentClick.info;
        const tiles = getMovementTilesForUnit(unit);
        if (tiles && tiles.length > 0) {
          drawTilesWithBordersFromArray(tiles, 'movement');
        }
      }
    }
  }

  function setupRangeDisplay() {
    const coordsDisplay = document.querySelector("#coords");
    if (!coordsDisplay) return;

    const coordsObserver = new MutationObserver(() => {
      // Only process if a range key is being held
      if (rangeKeyHeld) {
        addTilesForUnitAt(window.coordX, window.coordY, rangeKeyHeld);
      }
    });

    coordsObserver.observe(coordsDisplay, { childList: true });

    // Clear on window blur
    window.addEventListener("blur", clearRangePreview);

    // Cancel range display on left click
    const gamemap = document.getElementById('gamemap');
    if (gamemap) {
      gamemap.addEventListener("mousedown", () => {
        if (rangeKeyHeld) {
          // Store the main key so we can suppress key repeats until released
          const keyToSuppress = rangeMainKey;

          // Disable our range display state (stop coordsObserver updates)
          rangeKeyHeld = null;
          individualModeLastUnit = null;
          typeModeLastUnitName = null;
          currentPreviewUnits.clear();
          resetTilesMatrix();
          lockedTeam = null;

          // Set suppression to ignore key repeats until key is released
          if (keyToSuppress) {
            rangeClickSuppressed = true;
            rangeMainKey = keyToSuppress;
          }

          // Clear all our custom range tiles (not AWBW's native tiles)
          window.resetCreatedTiles(CUSTOM_TILE_SELECTOR);
        }

        // Clear view-only unit selection when clicking on the map
        // Let AWBW handle all click interactions
        if (viewOnlyUnitId) {
          // Suppress select key repeats until key is released
          if (selectKeyActive) {
            selectClickSuppressed = true;
          }
          // Only clear our custom tiles, let AWBW handle its native tiles
          window.resetCreatedTiles(CUSTOM_TILE_SELECTOR);
          viewOnlyUnitSelected = false;
          viewOnlyUnitId = null;
          viewOnlyCycleState = 0;
          selectKeyActive = false;
        }
      });
    }
  }

  // ============================================================================
  // Hotkey Matching
  // ============================================================================

  function matchesBinding(e, binding) {
    if (!binding) return false;

    const key = e.key.toLowerCase();
    const bindingKey = binding.key.toLowerCase();

    // Check if it's a modifier-only binding
    if (['shift', 'ctrl', 'alt'].includes(bindingKey) && !binding.modifier) {
      // For standalone modifier, check if this key is that modifier
      const modifierMap = { 'shift': 'shift', 'ctrl': 'control', 'alt': 'alt' };
      return key === modifierMap[bindingKey] || key === bindingKey;
    }

    // Check modifier+key combo
    if (binding.modifier) {
      const modifierHeld =
        (binding.modifier === 'ctrl' && e.ctrlKey) ||
        (binding.modifier === 'shift' && e.shiftKey) ||
        (binding.modifier === 'alt' && e.altKey);
      return modifierHeld && key === bindingKey;
    }

    // Plain key (no modifier required, and no modifier should be held)
    return key === bindingKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  }

  // ============================================================================
  // Game State Detection
  // ============================================================================

  // Game states for priority system
  const GameState = {
    IDLE: 'IDLE',
    UNIT_SELECTED: 'UNIT_SELECTED',
    BUILDING_MENU: 'BUILDING_MENU',
  };

  // Detect current game state for hotkey priority resolution
  function getGameState() {
    // Check if building menu is open
    const buildMenu = document.querySelector('.build-options-game');
    if (buildMenu && window.getComputedStyle(buildMenu).display !== 'none') {
      return GameState.BUILDING_MENU;
    }

    // Check if unit is selected via moving flag
    if (moving) {
      return GameState.UNIT_SELECTED;
    }

    // Check if unit action menu is visible
    const actionMenu = document.querySelector('.unit-options-game');
    if (actionMenu && window.getComputedStyle(actionMenu).display !== 'none') {
      return GameState.UNIT_SELECTED;
    }

    // Check if in fire mode (damage squares visible)
    if (document.querySelector('.dmg-square')) {
      return GameState.UNIT_SELECTED;
    }

    // Check via currentClick
    if (currentClick?.info && currentClick?.type === 'unit') {
      return GameState.UNIT_SELECTED;
    }

    return GameState.IDLE;
  }

  // Check if current building menu matches a specific type
  function getBuildingMenuType() {
    const buildMenu = document.querySelector('.build-options-game');
    if (!buildMenu || window.getComputedStyle(buildMenu).display === 'none') {
      return null;
    }

    // Check what building opened this menu by looking at currentClick
    if (currentClick?.type === 'building' && currentClick?.info) {
      const terrainName = currentClick.info.terrain_name || '';
      if (/Base|City/.test(terrainName)) return 'base';
      if (/Airport/.test(terrainName)) return 'airport';
      if (/Port/.test(terrainName)) return 'port';
    }

    return null;
  }

  // ============================================================================
  // Unit Action Helpers
  // ============================================================================

  // Check if the unit action menu is currently open
  function isActionMenuOpen() {
    const menu = document.querySelector('.unit-options-game');
    return menu && window.getComputedStyle(menu).display !== 'none';
  }

  // Check if a tile is reachable by the currently selected unit
  // Uses movementInfo.dist which AWBW calculates when unit is selected
  function isTileReachable(x, y) {
    if (!currentClick?.info) return false;

    const unit = currentClick.info;

    // Unit's current position is always "reachable"
    if (x === unit.units_x && y === unit.units_y) return true;

    // Check movementInfo.dist (set when unit is selected)
    if (window.movementInfo?.dist) {
      const node = y * maxX + x;
      return window.movementInfo.dist[node] !== Infinity;
    }

    return false;
  }

  // Get the target coordinates for action execution
  // Returns path end if menu is open, cursor position otherwise
  function getActionTargetCoords() {
    const path = currentClick?.path;
    const menuOpen = isActionMenuOpen();

    // Menu open - use path end position (user already clicked valid tile)
    if (menuOpen && path && path.length > 0) {
      const endNode = path[path.length - 1];
      return {
        valid: true,
        x: endNode % maxX,
        y: Math.floor(endNode / maxX),
        fromMenu: true
      };
    }

    // Menu not open - use cursor position
    const coords = getGridCoordinates();
    if (!coords.valid) return { valid: false };

    return {
      valid: true,
      x: coords.x,
      y: coords.y,
      fromMenu: false
    };
  }

  // ============================================================================
  // Fire Hotkey
  // ============================================================================

  // Helper: extract coords from path node
  function nodeToCoords(node) {
    return { x: node % maxX, y: Math.floor(node / maxX) };
  }

  // Helper: Check if damage squares are visible (fire mode active)
  function areDamageSquaresVisible() {
    return document.querySelector('.dmg-square') !== null;
  }

  // Helper: Get valid attack target at cursor (from unitsInRange)
  function getAttackTargetAtCursor(x, y) {
    return currentClick?.unitsInRange?.find(u => u.units_x === x && u.units_y === y) || null;
  }

  // Detect which Fire state we're in
  // Returns: { state: 'confirm' | 'direct' | 'enter', target? } or null
  function getFireState(cursorX, cursorY) {
    // State: CONFIRM - damage squares visible, cursor on valid target
    if (areDamageSquaresVisible() && !window.moving) {
      const target = getAttackTargetAtCursor(cursorX, cursorY);
      return target ? { state: 'confirm', target } : null;
    }

    // Need selected unit for other states
    const unit = currentClick?.info;
    if (!unit) return null;

    // Get path end position - for ranged units with empty path, use unit's current position
    const path = currentClick?.path;
    let pathEnd;
    if (path?.length) {
      pathEnd = nodeToCoords(path[path.length - 1]);
    } else {
      // Empty path (common for ranged units) - use unit's current position
      pathEnd = { x: unit.units_x, y: unit.units_y };
    }

    // Use AWBW's checkTargetTile to validate Fire availability
    // This handles ranged movement restrictions, ammo, etc.
    const options = checkTargetTile(pathEnd.x, pathEnd.y);
    const canFire = options?.some(o => o.option === 'Fire' && o.clickable);
    if (!canFire) return null;

    // checkTargetTile populates currentClick.unitsInRange when Fire is available
    // State: DIRECT - cursor on a target in range (includes pipe seams)
    const target = currentClick.unitsInRange?.find(u => u.units_x === cursorX && u.units_y === cursorY);
    if (target) {
      return { state: 'direct', target };
    }

    // State: ENTER - Fire available but cursor not on target
    return { state: 'enter' };
  }

  // ============================================================================
  // Repair Hotkey Helpers
  // ============================================================================

  // Helper: Check if repair squares are visible
  function areRepairSquaresVisible() {
    return document.querySelector('.repair-square') !== null;
  }

  // Helper: Get valid repair target at cursor
  function getRepairTargetAtCursor(x, y) {
    const square = document.querySelector(`.repair-square[style*="left: ${x * 16 - 1}px"][style*="top: ${y * 16 - 1}px"]`);
    if (!square) return null;
    const targetId = square.getAttribute('data-repair-id');
    return targetId ? unitsInfo[targetId] : null;
  }

  // Detect which Repair state we're in
  // Returns: { state: 'confirm' | 'enter', target? } or null
  function getRepairState(cursorX, cursorY) {
    // State: CONFIRM - repair squares visible, cursor on valid target
    if (areRepairSquaresVisible() && !window.moving) {
      const target = getRepairTargetAtCursor(cursorX, cursorY);
      return target ? { state: 'confirm', target } : null;
    }

    // Need selected unit with path for other states
    const unit = currentClick?.info;
    const path = currentClick?.path;
    if (!unit || !path?.length) return null;

    const pathEnd = nodeToCoords(path[path.length - 1]);

    // Use AWBW's checkTargetTile to validate Repair availability
    const options = checkTargetTile(pathEnd.x, pathEnd.y);
    const canRepair = options?.some(o => o.option === 'Repair' && o.clickable);
    if (!canRepair) return null;

    // State: ENTER - Repair available, will show repair squares
    return { state: 'enter' };
  }

  // ============================================================================
  // Explode Hotkey Helpers
  // ============================================================================

  // Helper: Check if bomb squares are visible (explode mode active)
  function areBombSquaresVisible() {
    return document.querySelector('.bomb-square') !== null;
  }

  // Detect which Explode state we're in
  // Returns: { state: 'confirm' | 'enter' } or null
  function getExplodeState() {
    // State: CONFIRM - bomb squares visible
    if (areBombSquaresVisible() && !window.moving) {
      return { state: 'confirm' };
    }

    // Need selected unit with path for other states
    const unit = currentClick?.info;
    const path = currentClick?.path;
    if (!unit || !path?.length) return null;

    // Only Black Bomb can explode
    if (unit.units_name !== 'Black Bomb') return null;

    const pathEnd = nodeToCoords(path[path.length - 1]);

    // Use AWBW's checkTargetTile to validate Explode availability
    const options = checkTargetTile(pathEnd.x, pathEnd.y);
    const canExplode = options?.some(o => o.option === 'Explode' && o.clickable);
    if (!canExplode) return null;

    // State: ENTER - Explode available, will show bomb squares
    return { state: 'enter' };
  }

  // ============================================================================
  // Launch Hotkey Helpers
  // ============================================================================

  // Helper: Check if silo squares are visible
  function areSiloSquaresVisible() {
    return document.querySelector('.silo-square') !== null;
  }

  // Helper: Check if silo squares are locked (pulsing, ready to fire)
  function areSiloSquaresLocked() {
    return document.querySelector('.silo-square.silo-pulse') !== null;
  }

  // Detect which Launch state we're in
  // Returns: { state: 'confirm' | 'aim' | 'enter' } or null
  function getLaunchState() {
    // State: CONFIRM - silo squares visible AND locked (pulsing)
    if (areSiloSquaresLocked() && !window.moving) {
      return { state: 'confirm' };
    }

    // State: AIM - silo squares visible but not locked (following cursor)
    if (areSiloSquaresVisible() && !window.moving) {
      return { state: 'aim' };
    }

    // Need selected unit with path for ENTER state
    const unit = currentClick?.info;
    const path = currentClick?.path;
    if (!unit || !path?.length) return null;

    // Only Infantry/Mech can launch
    if (unit.units_name !== 'Infantry' && unit.units_name !== 'Mech') return null;

    const pathEnd = nodeToCoords(path[path.length - 1]);

    // Use AWBW's checkTargetTile to validate Launch availability
    const options = checkTargetTile(pathEnd.x, pathEnd.y);
    const canLaunch = options?.some(o => o.option === 'Launch' && o.clickable);
    if (!canLaunch) return null;

    // State: ENTER - Launch available, will show silo targeting
    return { state: 'enter' };
  }

  // ============================================================================
  // Unload Hotkey Helpers
  // ============================================================================

  // Detect current unload menu state (action_menu, cargo_menu, landing_selection, transport_selected, or idle)
  function getUnloadMenuState() {
    const menu = document.querySelector('.unit-options-game');
    const menuVisible = menu && window.getComputedStyle(menu).display !== 'none';

    const menuItems = document.querySelectorAll('.unit-options-game ul li');
    const hasDropIds = Array.from(menuItems).some(li => li.hasAttribute('data-drop-id'));

    const landingSquares = document.querySelectorAll('.landing-square');
    const hasLandingSquares = landingSquares.length > 0;

    const transport = currentClick?.info;
    const hasCargo = transport && (transport.units_cargo1_units_id || transport.units_cargo2_units_id);

    // Determine state - order matters!
    let state = 'unknown';

    // First check: if we're in movement mode, we're selecting a unit (regardless of old menu state)
    if (window.moving && transport && hasCargo) {
      state = 'transport_selected';
    }
    // Landing squares take priority when visible
    else if (hasLandingSquares) {
      state = 'landing_selection';
    }
    // Cargo menu - must be VISIBLE and have drop IDs
    else if (menuVisible && hasDropIds) {
      state = 'cargo_menu';
    }
    // Action menu - visible but no drop IDs
    else if (menuVisible) {
      state = 'action_menu';
    }
    // Transport with cargo but no menu
    else if (transport && hasCargo) {
      state = 'transport_selected';
    }
    else {
      state = 'idle';
    }

    return {
      state,
      menuVisible,
      hasDropIds,
      hasLandingSquares,
      landingSquares: Array.from(landingSquares),
      menuItems: Array.from(menuItems),
      transport,
      hasCargo
    };
  }

  // Get the current unload state for hotkey handling
  function getUnloadState(slotNumber) {
    // Detect current menu state
    const diag = getUnloadMenuState();

    const transport = currentClick?.info;
    if (!transport) return null;

    // Check if this is a transport with cargo
    const isTransport = TRANSPORT_UNITS.test(transport.units_name);
    const hasCargo = transport.units_cargo1_units_id || transport.units_cargo2_units_id;

    if (!isTransport || !hasCargo) return null;

    // Determine state and return appropriate action
    if (diag.state === 'landing_selection') {
      return { state: 'landing', slotNumber, diagnostics: diag };
    }

    if (diag.state === 'cargo_menu') {
      return { state: 'cargo', slotNumber, diagnostics: diag };
    }

    if (diag.state === 'action_menu') {
      return { state: 'action_menu', slotNumber, diagnostics: diag };
    }

    if (diag.state === 'transport_selected') {
      return { state: 'selected', slotNumber, diagnostics: diag };
    }

    return null;
  }

  // Get available unit actions at the given tile using AWBW's checkTargetTile
  // Returns array of available option names (e.g., ['Fire', 'Wait', 'Capt'])
  function getAvailableActionsAtTile(x, y, skipReachabilityCheck = false) {
    if (!currentClick?.info) return [];

    // Validate tile is reachable (unless called from menu context)
    if (!skipReachabilityCheck && !isTileReachable(x, y)) return [];

    // checkTargetTile is an AWBW global
    if (typeof checkTargetTile !== 'function') return [];

    const options = checkTargetTile(x, y);
    if (!options || !Array.isArray(options)) return [];

    // Filter to clickable options and extract names
    return options.filter(opt => opt.clickable).map(opt => opt.option);
  }

  // Find the highest-priority unit action that matches the pressed hotkey and is available
  function findMatchingUnitAction(e) {
    const cursorCoords = getGridCoordinates();

    // Check if the selected unit has already moved
    // If so, only Unload actions should be available (for transports with cargo showing Unload menu)
    const selectedUnit = currentClick?.info;
    const unitAlreadyMoved = selectedUnit?.units_moved === 1;

    // Go through unit actions in priority order (they're defined in order)
    for (const action of HOTKEY_ACTIONS.unit) {
      const binding = config.currentSettings.hotkeys[action.id];
      if (!binding || !matchesBinding(e, binding)) continue;

      // Block actions that cause server errors on already-moved units
      // This prevents errors when a moved transport with cargo shows the Unload menu
      // and user tries to execute other actions via hotkey
      const blockedOnMovedUnit = ['wait', 'supply', 'fire', 'load', 'delete', 'deleteConfirm'];
      if (unitAlreadyMoved && blockedOnMovedUnit.includes(action.id)) {
        continue;
      }

      // Special handling for Fire - it has multiple states
      if (action.id === 'fire') {
        if (!cursorCoords.valid) continue;

        const fireState = getFireState(cursorCoords.x, cursorCoords.y);
        if (fireState) {
          return { ...action, fireState };
        }
        continue;
      }

      // Special handling for Repair - similar to Fire
      if (action.id === 'repair') {
        if (!cursorCoords.valid) continue;

        const repairState = getRepairState(cursorCoords.x, cursorCoords.y);
        if (repairState) {
          return { ...action, repairState };
        }
        continue;
      }

      // Special handling for Explode - similar to Fire/Repair
      if (action.id === 'explode') {
        const explodeState = getExplodeState();
        if (explodeState) {
          return { ...action, explodeState };
        }
        continue;
      }

      // Special handling for Launch - three states (enter/aim/confirm)
      if (action.id === 'launch') {
        const launchState = getLaunchState();
        if (launchState) {
          return { ...action, launchState };
        }
        continue;
      }

      // Special handling for Unload
      if (action.id === 'unload1' || action.id === 'unload2') {
        const slotNumber = action.id === 'unload1' ? 1 : 2;
        const unloadState = getUnloadState(slotNumber);
        if (unloadState) {
          return { ...action, unloadState };
        }
        continue;
      }

      // Special handling for Delete - allow without cursor over unit if setting enabled
      if ((action.id === 'delete' || action.id === 'deleteConfirm') && config.currentSettings.settings.allowDeleteWithoutCursorOverUnit) {
        // Just need a unit selected, cursor position doesn't matter
        if (currentClick?.info) {
          return action;
        }
        continue;
      }

      // Normal action handling
      const coords = getActionTargetCoords();
      if (!coords.valid) continue;

      // Skip reachability check if menu is open
      const availableOptions = getAvailableActionsAtTile(coords.x, coords.y, coords.fromMenu);

      // Check if this action's option is available
      const actionOptions = Array.isArray(action.option) ? action.option : [action.option];
      const isAvailable = actionOptions.some(opt => availableOptions.includes(opt));

      if (isAvailable) {
        return action;
      }
    }

    return null;
  }

  // Find matching building action for the current menu
  function findMatchingBuildingAction(e) {
    const menuType = getBuildingMenuType();
    if (!menuType) return null;

    const actions = HOTKEY_ACTIONS[menuType];
    if (!actions) return null;

    for (const action of actions) {
      const binding = config.currentSettings.hotkeys[action.id];
      if (binding && matchesBinding(e, binding)) {
        return action;
      }
    }

    return null;
  }

  // ============================================================================
  // Hotkey Priority Categories
  // ============================================================================

  // Actions that always work regardless of state
  const ALWAYS_ACTIVE_ACTIONS = new Set(['openConfig', 'select', 'previousUnit', 'nextUnit']);

  // Actions that are conditionally blocked based on settings (covers both navigation and misc tabs)
  const CONDITIONAL_GENERAL_ACTIONS = {
    'endTurn': 'allowEndTurnWhileSelected',
    'showMovementRangeCombined': 'allowRangeDisplayWhileSelected',
    'showMovementRangeIndividual': 'allowRangeDisplayWhileSelected',
    'showMovementRangeWholeArmy': 'allowRangeDisplayWhileSelected',
    'showAttackRangeCombined': 'allowRangeDisplayWhileSelected',
    'showAttackRangeIndividual': 'allowRangeDisplayWhileSelected',
    'showAttackRangeType': 'allowRangeDisplayWhileSelected',
    'showAttackRangeWholeArmy': 'allowRangeDisplayWhileSelected',
    'showVisionRangeIndividual': 'allowRangeDisplayWhileSelected',
    'showVisionRangeCombined': 'allowRangeDisplayWhileSelected',
    'showVisionRangeWholeArmy': 'allowRangeDisplayWhileSelected',
    'toggleCalculator': 'allowCalcWhileSelected',
    'selectAttacker': 'allowCalcWhileSelected',
    'selectDefender': 'allowCalcWhileSelected',
    'swapUnits': 'allowCalcWhileSelected',
    'zoomIn': 'allowMiscWhileSelected',
    'zoomOut': 'allowMiscWhileSelected',
    'pause': 'allowMiscWhileSelected',
    'setDraw': 'allowMiscWhileSelected',
    'resign': 'allowMiscWhileSelected',
  };

  // Check if a navigation/misc action should be blocked in current state
  function isGeneralActionBlocked(actionId, gameState) {
    if (gameState === GameState.IDLE) return false;
    if (ALWAYS_ACTIVE_ACTIONS.has(actionId)) return false;

    // Replay navigation actions only work when in replay mode (freezeGame is true)
    // openReplay/closeReplay handle their own state checking, others require replay to be active
    const replayNavigationActions = ['replayFirstTurn', 'replayLatestTurn', 'replayForwardTurn', 'replayBackwardTurn', 'replayForwardAction', 'replayBackwardAction'];
    if (replayNavigationActions.includes(actionId)) {
      const inReplayMode = typeof freezeGame !== 'undefined' && freezeGame;
      if (!inReplayMode) return true; // Block if not in replay mode
    }

    const settingId = CONDITIONAL_GENERAL_ACTIONS[actionId];
    if (settingId && !config.currentSettings.settings[settingId]) {
      return true;  // Setting is OFF, block the action
    }

    return false;
  }

  // ============================================================================
  // Action Handlers
  // ============================================================================

  const actionHandlers = {
    endTurn: function() {
      // Only works on our turn
      const viewerPId = window.getViewerPId();
      if (typeof currentTurn === 'undefined' || currentTurn !== viewerPId) {
        return;
      }

      const endTurnScreen = document.querySelector('.end-turn-screen');
      if (!endTurnScreen) return;

      const isVisible = window.getComputedStyle(endTurnScreen).display !== 'none';

      if (isVisible) {
        if (endTurnConfirmationSource === 'endTurn') {
          // Same action - confirm end turn
          const confirmBtn = document.querySelector('.end-turn-conf-btn');
          if (confirmBtn) {
            confirmBtn.click();
            endTurnConfirmationSource = null;
          }
        } else {
          // Different action (tagCO opened it) - close and reopen with endTurn
          endTurnScreen.style.display = 'none';
          const endTurnBtn = document.querySelector('#end-turn');
          if (endTurnBtn) {
            endTurnBtn.click();
            endTurnConfirmationSource = 'endTurn';
          }
        }
      } else {
        // First press - click the end turn button to open confirmation dialog
        const endTurnBtn = document.querySelector('#end-turn');
        if (endTurnBtn) {
          endTurnBtn.click();
          endTurnConfirmationSource = 'endTurn';
        }
      }
    },

    nextUnit: function() {
      if (typeof window.selectNextUnit === 'function' && window.unitSelectorRef) {
        window.awbw_music_player?.resetMenuState?.();
        window.closeMenu();
        window.unitSelectorRef = window.selectNextUnit(window.unitSelectorRef.index + 1, 1);
        // Set currentClick for building menu if opened via cycling
        if (window.unitSelectorRef?.openBase) {
          const { x, y } = window.unitSelectorRef.openBase;
          window.currentClick = {
            type: 'building',
            info: buildingsInfo?.[x]?.[y]
          };
        }
      }
    },

    previousUnit: function() {
      if (typeof window.selectNextUnit === 'function' && window.unitSelectorRef) {
        window.awbw_music_player?.resetMenuState?.();
        window.closeMenu();
        window.unitSelectorRef = window.selectNextUnit(window.unitSelectorRef.index - 1, -1);
        // Set currentClick for building menu if opened via cycling
        if (window.unitSelectorRef?.openBase) {
          const { x, y } = window.unitSelectorRef.openBase;
          window.currentClick = {
            type: 'building',
            info: buildingsInfo?.[x]?.[y]
          };
        }
      }
    },

    toggleCalculator: function() {
      if (window.calculator) {
        window.calculator.toggled = !window.calculator.toggled;
      }
    },

    selectAttacker: function() {
      selectCalculatorUnit('attacker');
    },

    selectDefender: function() {
      selectCalculatorUnit('defender');
    },

    swapUnits: function() {
      if (!window.calculator?.toggled) return false;
      window.calculator.swapPosition();
      return true;
    },

    openConfig: function() {
      togglePanel();
    },

    // Movement Range
    showMovementRangeIndividual: function() {
      handleRangeKeyDown('movementIndividual', config.currentSettings.hotkeys.showMovementRangeIndividual?.key?.toLowerCase());
    },
    showMovementRangeCombined: function() {
      handleRangeKeyDown('movementCombined', config.currentSettings.hotkeys.showMovementRangeCombined?.key?.toLowerCase());
    },
    showMovementRangeWholeArmy: function() {
      handleRangeKeyDown('movementWholeArmy', config.currentSettings.hotkeys.showMovementRangeWholeArmy?.key?.toLowerCase());
    },

    // Attack Range
    showAttackRangeIndividual: function() {
      handleRangeKeyDown('attackIndividual', config.currentSettings.hotkeys.showAttackRangeIndividual?.key?.toLowerCase());
    },
    showAttackRangeCombined: function() {
      handleRangeKeyDown('attackCombined', config.currentSettings.hotkeys.showAttackRangeCombined?.key?.toLowerCase());
    },
    showAttackRangeType: function() {
      handleRangeKeyDown('attackType', config.currentSettings.hotkeys.showAttackRangeType?.key?.toLowerCase());
    },
    showAttackRangeWholeArmy: function() {
      handleRangeKeyDown('attackWholeArmy', config.currentSettings.hotkeys.showAttackRangeWholeArmy?.key?.toLowerCase());
    },

    // Vision Range
    showVisionRangeIndividual: function() {
      handleRangeKeyDown('visionIndividual', config.currentSettings.hotkeys.showVisionRangeIndividual?.key?.toLowerCase());
    },
    showVisionRangeCombined: function() {
      handleRangeKeyDown('visionCombined', config.currentSettings.hotkeys.showVisionRangeCombined?.key?.toLowerCase());
    },
    showVisionRangeWholeArmy: function() {
      handleRangeKeyDown('visionWholeArmy', config.currentSettings.hotkeys.showVisionRangeWholeArmy?.key?.toLowerCase());
    },

    select: function() {
      selectUnitOrBuilding();
    },

    zoomIn: function() {
      if (typeof window.applyScale === 'function') {
        window.applyScale(0.1);
      } else {
        document.querySelector('#zoom-in')?.click();
      }
    },

    zoomOut: function() {
      if (typeof window.applyScale === 'function') {
        window.applyScale(-0.1);
      } else {
        document.querySelector('#zoom-out')?.click();
      }
    },

    pause: function() {
      if (typeof window.emitData === 'function' && typeof window.webSocket !== 'undefined' && typeof window.getViewerPId === 'function') {
        window.emitData(window.webSocket, { action: 'Pause', playerID: window.getViewerPId() });
      }
    },

    setDraw: function() {
      const setDrawBtn = document.querySelector('#set-draw');
      if (setDrawBtn) {
        setDrawBtn.click();
      }
    },

    resign: function() {
      const resignScreen = document.querySelector('.resign-screen');
      if (!resignScreen) return;

      const isVisible = window.getComputedStyle(resignScreen).display !== 'none';

      if (isVisible) {
        // Second press - confirm resign
        const confirmBtn = document.querySelector('.resign-conf-btn');
        if (confirmBtn) {
          confirmBtn.click();
        }
      } else {
        // First press - open resign dialog
        const resignBtn = document.querySelector('#resign-game');
        if (resignBtn) {
          resignBtn.click();
        }
      }
    },

    openChat: function() {
      if (!isGamePage || !gamesId) return;

      // Check if AWBW Game Chat userscript is active
      const gameChatContainer = document.getElementById('awbw-chat-container');
      if (gameChatContainer) {
        // Show chat if hidden (click toggle button to properly update script's internal state)
        const isHidden = gameChatContainer.style.display === 'none';
        if (isHidden) {
          const toggleBtn = Array.from(document.querySelectorAll('button')).find(
            btn => btn.textContent.includes('Game Chat')
          );
          if (toggleBtn) toggleBtn.click();
        }
        // Focus the textarea
        const textarea = document.querySelector('#awbw-send-message-container textarea.press');
        if (textarea) textarea.focus();
        return;
      }

      // Native chat - open in new tab
      openChatTab();
    },

    closeChat: function() {
      // Check if AWBW Game Chat userscript is active (on game page)
      const gameChatContainer = document.getElementById('awbw-chat-container');
      if (gameChatContainer) {
        // Minimize chat if visible (click toggle button to properly update script's internal state)
        const isVisible = gameChatContainer.style.display !== 'none';
        if (isVisible) {
          const toggleBtn = Array.from(document.querySelectorAll('button')).find(
            btn => btn.textContent.includes('Game Chat')
          );
          if (toggleBtn) toggleBtn.click();
        }
        return;
      }

      // Native chat page - close the tab
      if (!isChatPage) return;
      window.close();
    },

    sendChatMessage: function() {
      // Check if AWBW Game Chat userscript is active (on game page)
      const gameChatContainer = document.getElementById('awbw-chat-container');
      if (gameChatContainer) {
        const sendContainer = document.getElementById('awbw-send-message-container');
        if (!sendContainer) return;

        const textarea = sendContainer.querySelector('textarea.press');
        if (!textarea || !textarea.value.trim()) return;

        // Click the submit button to send (this triggers the script's async submit handler)
        const submitBtn = sendContainer.querySelector('input[type="submit"].submit');
        if (submitBtn) submitBtn.click();
        return;
      }

      // Native chat page
      if (!isChatPage) return;

      // AWBW's chat form HTML is malformed (form tag is self-closed, inputs are outside).
      // We create a new form, copy all field values, and submit it properly.
      const formAction = document.querySelector('form[name="send"]')?.action;
      if (!formAction) return;

      const textarea = document.querySelector('textarea[name="press_text"]');
      const subject = document.querySelector('input[name="press_subject"]');
      const playersId = document.querySelector('input[name="players_id"]');
      const gamesIdInput = document.querySelector('input[name="games_id"]');
      const uniqId = document.querySelector('input[name="uniq_id"]');
      const checkboxes = document.querySelectorAll('input[name="press_to_players_id[]"]:checked');

      if (!textarea || !textarea.value.trim()) return;

      // If sendChatMessage and closeChat share the same hotkey, set a flag
      // so after page reload we don't auto-focus (allowing next keypress to close)
      const sendBinding = config.currentSettings.hotkeys.sendChatMessage;
      const closeBinding = config.currentSettings.hotkeys.closeChat;
      if (sendBinding && closeBinding && hotkeyEquals(sendBinding, closeBinding)) {
        sessionStorage.setItem('awbw_hotkeys_chat_sent', '1');
      }

      // Create a proper form with all the data
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = formAction;
      form.style.display = 'none';

      const addInput = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value || '';
        form.appendChild(input);
      };

      addInput('press_text', textarea.value);
      addInput('press_subject', subject?.value || '');
      addInput('players_id', playersId?.value || '');
      addInput('games_id', gamesIdInput?.value || '');
      addInput('uniq_id', uniqId?.value || '');

      checkboxes.forEach(cb => {
        addInput('press_to_players_id[]', cb.value);
      });

      document.body.appendChild(form);
      form.submit();
    },

    // Page 2 - Additional features
    openMovementPlanner: function() {
      if (!isGamePage || !gamesId) return;
      openMovePlannerTab();
    },

    closeMovementPlanner: function() {
      if (!isMovePlannerPage) return;
      window.close();
    },

    activatePower: function() {
      if (!isGamePage) return;
      // Get viewer's player ID
      const playerId = typeof getViewerPId === 'function' ? getViewerPId() : null;
      if (!playerId) return;
      // Click the COP button
      const copBtn = document.querySelector(`#player${playerId} .cop-button`);
      if (copBtn) copBtn.click();
    },

    activateSuperPower: function() {
      if (!isGamePage) return;
      // Get viewer's player ID
      const playerId = typeof getViewerPId === 'function' ? getViewerPId() : null;
      if (!playerId) return;
      // Click the SCOP button
      const scopBtn = document.querySelector(`#player${playerId} .scop-button`);
      if (scopBtn) scopBtn.click();
    },

    tagCO: function() {
      if (!isGamePage) return;

      const confScreen = document.querySelector('.end-turn-screen');
      const isVisible = confScreen && window.getComputedStyle(confScreen).display !== 'none';

      if (isVisible) {
        if (endTurnConfirmationSource === 'tagCO') {
          // Same action - confirm tag CO
          const confBtn = document.querySelector('.end-turn-conf-btn');
          if (confBtn) {
            confBtn.click();
            endTurnConfirmationSource = null;
          }
        } else {
          // Different action (endTurn opened it) - close and reopen with tagCO
          confScreen.style.display = 'none';
          const tagBtn = document.querySelector('#tag-co');
          if (tagBtn) {
            tagBtn.click();
            endTurnConfirmationSource = 'tagCO';
          }
        }
      } else {
        // First press - click the Tag CO button to open confirmation
        const tagBtn = document.querySelector('#tag-co');
        if (tagBtn) {
          tagBtn.click();
          endTurnConfirmationSource = 'tagCO';
        }
      }
    },

    toggleMaximize: function() {
      // Only works when AWBW Maximise mod is installed
      if (!isMaximizeModInstalled()) return;
      // Toggle the AWBW Maximise mod (without affecting browser fullscreen)
      const maximizeBtn = document.querySelector('.AWBWMaxmiseButton');
      if (maximizeBtn) {
        maximizeBtn.click();
      }
    },

    toggleFullscreen: function() {
      // Only works when AWBW Maximise mod is installed
      if (!isMaximizeModInstalled()) return;

      // Combined toggle: browser fullscreen + maximize mod
      // If either is off, turn both on. If both are on, turn both off.
      const isFullscreen = !!document.fullscreenElement;
      const isMaximized = isMaximised();
      const maximizeBtn = document.querySelector('.AWBWMaxmiseButton');

      if (isFullscreen && isMaximized) {
        // Both on - turn both off
        // Set flag so fullscreenchange listener doesn't double-toggle
        exitingFullscreenOurselves = true;
        document.exitFullscreen?.();
        if (maximizeBtn) maximizeBtn.click();
      } else {
        // At least one is off - turn both on
        if (!isFullscreen) {
          document.documentElement.requestFullscreen?.();
        }
        if (!isMaximized && maximizeBtn) {
          maximizeBtn.click();
        }
      }
    },

    toggleMusic: function() {
      // Only works when Music Player is installed
      if (!isMusicPlayerInstalled()) return;

      // Click the music player button to toggle play/pause
      const musicBtn = getMusicPlayerButton();
      if (musicBtn) musicBtn.click();
    },

    // Page 2 - Replay controls
    openReplay: function() {
      if (!isGamePage) return;
      const inReplayMode = typeof freezeGame !== 'undefined' && freezeGame;

      if (inReplayMode) {
        // Already in replay mode - check if closeReplay has same binding, if so close
        const openBinding = config.currentSettings.hotkeys.openReplay;
        const closeBinding = config.currentSettings.hotkeys.closeReplay;
        if (openBinding && closeBinding &&
            openBinding.key === closeBinding.key &&
            openBinding.modifier === closeBinding.modifier) {
          const closeBtn = document.querySelector('.replay-close');
          if (closeBtn) closeBtn.click();
        }
        return;
      }

      const openBtn = document.querySelector('.replay-open');
      if (openBtn) openBtn.click();
    },

    closeReplay: function() {
      if (!isGamePage) return;
      // Only close if in replay mode
      const inReplayMode = typeof freezeGame !== 'undefined' && freezeGame;
      if (!inReplayMode) return;
      const closeBtn = document.querySelector('.replay-close');
      if (closeBtn) closeBtn.click();
    },

    replayFirstTurn: function() {
      if (!isGamePage) return;
      if (typeof freezeGame === 'undefined' || !freezeGame) return;

      // Use replayControlsVue to jump to first turn (index 0)
      if (typeof replayControlsVue !== 'undefined' && replayControlsVue.options?.length > 0) {
        replayControlsVue.selectTurn(0, true);
      }
    },

    replayLatestTurn: function() {
      if (!isGamePage) return;
      if (typeof freezeGame === 'undefined' || !freezeGame) return;

      // Use replayControlsVue to jump to latest turn (last index)
      if (typeof replayControlsVue !== 'undefined' && replayControlsVue.options?.length > 0) {
        replayControlsVue.selectTurn(replayControlsVue.options.length - 1, true);
      }
    },

    replayForwardTurn: function() {
      if (!isGamePage) return;
      if (typeof freezeGame === 'undefined' || !freezeGame) return;

      const btn = document.querySelector('.replay-forward');
      if (btn) btn.click();
    },

    replayBackwardTurn: function() {
      if (!isGamePage) return;
      if (typeof freezeGame === 'undefined' || !freezeGame) return;

      const btn = document.querySelector('.replay-backward');
      if (btn) btn.click();
    },

    replayForwardAction: function() {
      if (!isGamePage) return;
      if (typeof freezeGame === 'undefined' || !freezeGame) return;

      const btn = document.querySelector('.replay-forward-action');
      if (btn) btn.click();
    },

    replayBackwardAction: function() {
      if (!isGamePage) return;
      if (typeof freezeGame === 'undefined' || !freezeGame) return;

      const btn = document.querySelector('.replay-backward-action');
      if (btn) btn.click();
    },
  };

  // ============================================================================
  // Chat & Movement Planner Tab Management
  // ============================================================================
  // Fullscreen re-entry: When opening chat/planner from fullscreen, browser exits
  // fullscreen. We use sessionStorage to track this and re-enter on the next
  // mouse click or select hotkey press when the user returns to the game tab.

  function openChatTab() {
    if (!gamesId) return;
    if (document.fullscreenElement) {
      sessionStorage.setItem('awbw_hotkeys_reenter_fullscreen', '1');
    }
    window.open(`https://awbw.amarriner.com/press.php?games_id=${gamesId}`, `awbw_chat_${gamesId}`);
  }

  function openMovePlannerTab() {
    if (!gamesId) return;
    if (document.fullscreenElement) {
      sessionStorage.setItem('awbw_hotkeys_reenter_fullscreen', '1');
    }
    window.open(`https://awbw.amarriner.com/moveplanner.php?games_id=${gamesId}`, `awbw_moveplanner_${gamesId}`);
  }

  function tryFullscreenReentry() {
    sessionStorage.removeItem('awbw_hotkeys_reenter_fullscreen');
    if (!config?.currentSettings?.settings?.fullscreenReentry) return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  // Re-enter fullscreen on mouse click
  if (isGamePage) {
    document.addEventListener('mousedown', function() {
      if (sessionStorage.getItem('awbw_hotkeys_reenter_fullscreen')) {
        tryFullscreenReentry();
      }
    });
  }

  // ============================================================================
  // Select Unit/Building
  // ============================================================================
  // Handles selecting units and buildings with the select hotkey.
  //
  // Key behaviors:
  // - Your unmoved units: Normal selection (shows movement, can give orders)
  // - Enemy/moved units: View-only (shows range cycling, clears on key release)
  // - Your buildings: Opens build menu (on your turn, no unit blocking)
  // - Empty space: Deselects current selection
  //
  // View-only units cycle through: Movement → Attack → Vision (fog) → Movement...
  // Attack range for melee units shows movement range + 1 tile (true threat zone)
  // ============================================================================

  // Calculate grid coordinates from mouse position
  // Works even when menus block AWBW's mousemove handler (window.coordX/Y becomes stale)
  function getGridCoordinates() {
    const gameMap = document.getElementById('gamemap');
    if (!gameMap) return { valid: false };

    const mapRect = gameMap.getBoundingClientRect();
    const scale = window.scale || 1;
    const gridX = Math.floor((mouseX - mapRect.left) / (16 * scale));
    const gridY = Math.floor((mouseY - mapRect.top) / (16 * scale));

    if (gridX < 0 || gridX >= maxX || gridY < 0 || gridY >= maxY) {
      return { valid: false };
    }
    return { valid: true, x: gridX, y: gridY };
  }

  // Get unit at specific coordinates (excluding cargo)
  function getUnitAtCoords(x, y) {
    return Object.values(unitsInfo).find(unit =>
      unit.units_x === x &&
      unit.units_y === y &&
      unit.units_carried !== "Y"
    );
  }

  // Deselect current unit/building selection (with sound)
  function deselectUnit() {
    window.closeMenu();
    window.resetCreatedTiles(TILE_SELECTOR);
    window.resetUnit();
    window.currentClick = null;
    window.moving = false;
  }

  // Deselect silently (when switching to another unit/building)
  function deselectUnitSilent() {
    window.awbw_music_player?.resetMenuState?.();  // Prevent deselect sound
    deselectUnit();
  }

  // Clear view-only range tiles (keeps cycle state for repeated presses)
  function clearViewOnlyRange() {
    window.resetCreatedTiles(TILE_SELECTOR);
    viewOnlyUnitSelected = false;
  }

  // Full reset of view-only state (when switching units or clicking away)
  function resetViewOnlyState() {
    window.resetCreatedTiles(TILE_SELECTOR);
    viewOnlyUnitSelected = false;
    viewOnlyUnitId = null;
    viewOnlyCycleState = 0;
    selectKeyActive = false;
    // Note: don't clear selectClickSuppressed here - it's cleared on keyup
  }

  // Display range for a view-only unit with improved melee attack range
  function displayViewOnlyUnitRange(unit, type) {
    const unitId = unit.units_id;
    const unitPId = unit.units_players_id;
    const unitTeam = playersInfo[unitPId].players_team;
    const startTile = { x: unit.units_x, y: unit.units_y };

    window.resetCreatedTiles(TILE_SELECTOR);

    let tiles = [];
    let drawType = type;

    if (type === 'movement') {
      const mType = unit.units_movement_type;
      const mp = Math.min(unit.units_fuel, unit.units_movement_points);
      const movementInfo = window.getMovementTiles(maxX, maxY, mType, mp, startTile, unitTeam, playersInfo[unitPId], false);
      tiles = movementInfo.tilesToDraw || [];
      drawType = 'movement';
    }

    if (type === 'attack') {
      const unitName = unit.units_name;
      const nonAttackers = ["APC", "T-Copter", "Lander", "Black Boat"];

      // Skip attack for non-attacking units - go back to movement
      if (nonAttackers.includes(unitName)) {
        viewOnlyCycleState = 0;
        return displayViewOnlyUnitRange(unit, 'movement');
      }

      if (unit.units_short_range === 0) {
        // MELEE: Movement range + 1 tile around each reachable position
        const mType = unit.units_movement_type;
        const mp = Math.min(unit.units_fuel, unit.units_movement_points);
        const movementInfo = window.getMovementTiles(maxX, maxY, mType, mp, startTile, unitTeam, playersInfo[unitPId], false);

        const reachableTiles = [...(movementInfo.tilesToDraw || []), startTile];
        const attackTileSet = new Set();

        for (const tile of reachableTiles) {
          const adjacent = [
            { x: tile.x - 1, y: tile.y },
            { x: tile.x + 1, y: tile.y },
            { x: tile.x, y: tile.y - 1 },
            { x: tile.x, y: tile.y + 1 },
          ];
          for (const adj of adjacent) {
            if (adj.x >= 0 && adj.x < maxX && adj.y >= 0 && adj.y < maxY) {
              attackTileSet.add(`${adj.x},${adj.y}`);
            }
          }
        }

        tiles = Array.from(attackTileSet).map(key => {
          const [x, y] = key.split(',').map(Number);
          return { x, y };
        });
      } else {
        // RANGED: Use createSquareInRangeOf with draw=false to avoid double-draw
        let minRange = unit.units_short_range;
        let maxRange = unit.units_long_range;
        if (minRange <= 0 || maxRange <= 0) {
          minRange = 1;
          maxRange = 1;
        }
        if (unit.units_name === "Black Bomb") maxRange = 3;
        tiles = window.createSquareInRangeOf(maxRange, minRange, "range", startTile.x, startTile.y, null, false) || [];
      }
      drawType = 'range';
    }

    if (type === 'vision') {
      let unitVision = unit.units_vision;
      unitVision = window.checkMountain(unitId, unitVision, startTile.x, startTile.y);
      tiles = window.createSquareInRangeOf(unitVision, 1, "vision", startTile.x, startTile.y, null, false) || [];
      drawType = 'vision';
    }

    if (tiles.length > 0) {
      drawTilesWithBordersFromArray(tiles, drawType);
    }
  }

  // Handle cycling for view-only units: movement → attack → movement...
  function cycleViewOnlyUnit(unit) {
    const unitId = unit.units_id;

    // Different unit resets cycle, same unit advances it
    if (viewOnlyUnitId !== unitId) {
      viewOnlyUnitId = unitId;
      viewOnlyCycleState = 0;
    } else {
      viewOnlyCycleState++;
      // Toggle between movement (0) and attack (1)
      if (viewOnlyCycleState > 1) {
        viewOnlyCycleState = 0;
      }
    }

    const types = ['movement', 'attack'];
    displayViewOnlyUnitRange(unit, types[viewOnlyCycleState]);
    viewOnlyUnitSelected = true;
  }

  // Main select handler
  function selectUnitOrBuilding() {
    // === STEP 1: Clear any active range preview ===
    let clearedRangePreview = false;
    if (rangeKeyHeld) {
      clearedRangePreview = true;
      const keyToSuppress = rangeMainKey;
      rangeKeyHeld = null;
      individualModeLastUnit = null;
      typeModeLastUnitName = null;
      currentPreviewUnits.clear();
      resetTilesMatrix();
      lockedTeam = null;
      window.resetCreatedTiles(CUSTOM_TILE_SELECTOR);
      if (keyToSuppress) {
        rangeClickSuppressed = true;
        rangeMainKey = keyToSuppress;
      }
    }

    // === STEP 2: Get what's under the cursor ===
    const coords = getGridCoordinates();
    if (!coords.valid) return;

    const x = coords.x;
    const y = coords.y;
    const unit = getUnitAtCoords(x, y);

    // === STEP 3: Handle unit selection ===
    if (unit) {
      // Determine unit state
      const isAlreadySelected = window.currentClick?.info?.units_id === unit.units_id && window.moving;
      const viewerPId = typeof window.getViewerPId === 'function' ? window.getViewerPId() : null;
      const isOurUnit = unit.units_players_id === viewerPId;
      const isOurTurn = typeof currentTurn !== 'undefined' && currentTurn === viewerPId;
      const hasNotMoved = unit.units_moved !== 1;
      const shouldBeSelectable = isOurUnit && isOurTurn && hasNotMoved;

      // 3a. Already selected and moving - if we cleared range preview, restore AWBW state
      if (isAlreadySelected) {
        if (clearedRangePreview) {
          // Deselect and re-select through AWBW to restore proper tile state and handlers
          deselectUnitSilent();
          window.unitClickHandler({ id: unit.units_id, type: 'unit' });
        }
        return;
      }

      // 3b. Already in view-only mode for this unit - cycle the display
      if (viewOnlyUnitId === unit.units_id && !shouldBeSelectable) {
        window.awbw_music_player?.playUiUnitSelect?.();
        cycleViewOnlyUnit(unit);
        return;
      }

      // 3c. Clear any existing selection before selecting new unit
      if (window.moving || window.currentClick) {
        deselectUnitSilent();
      }
      if (viewOnlyUnitId) {
        window.resetCreatedTiles(CUSTOM_TILE_SELECTOR);
        viewOnlyUnitSelected = false;
        viewOnlyUnitId = null;
        viewOnlyCycleState = 0;
      }

      // Clear all tiles and handlers for clean state
      window.resetCreatedTiles(TILE_SELECTOR);
      const gamemapEl = document.getElementById('gamemap');
      if (gamemapEl) gamemapEl.onmouseup = null;

      // 3d. Let AWBW try to handle the selection
      window.unitClickHandler({ id: unit.units_id, type: 'unit' });

      // 3e. Check results - AWBW succeeded with normal selection
      if (window.moving) {
        return;
      }

      // 3f. Special case: Moved transport with cargo shows Unload menu
      const menuShown = document.querySelector('.unit-options-game');
      const menuVisible = menuShown && window.getComputedStyle(menuShown).display !== 'none';
      if (menuVisible && window.currentClick?.info?.units_id === unit.units_id) {
        return;
      }

      // 3g. AWBW didn't select - either not ready or view-only unit
      if (shouldBeSelectable) {
        // Unit should be selectable but AWBW didn't respond - likely not ready yet
        // Don't enter view-only mode, user can retry
        return;
      }

      // 3h. View-only unit - show range with our custom display
      window.resetCreatedTiles(TILE_SELECTOR);
      const gamemap = document.getElementById('gamemap');
      if (gamemap) gamemap.onmouseup = null;
      cycleViewOnlyUnit(unit);
      return;
    }

    // === STEP 4: Handle building selection ===
    const building = buildingsInfo[x]?.[y];
    if (building) {
      const buildingPId = building.buildings_players_id;
      const viewerPId = window.getViewerPId();
      const isOurTurn = currentTurn === viewerPId;
      const hasUnitOnTop = unitMap[x]?.[y];

      if (buildingPId === viewerPId && isOurTurn && !hasUnitOnTop) {
        if (viewOnlyUnitId) resetViewOnlyState();
        if (window.moving || window.currentClick) deselectUnitSilent();
        window.showBuildOptions(x, y);
        window.currentClick = { type: 'building', info: building };
        return;
      }
    }

    // === STEP 5: Empty space - deselect everything ===
    if (viewOnlyUnitId) resetViewOnlyState();
    if (window.moving || window.currentClick) deselectUnit();
  }

  // Called on select key release
  function handleSelectKeyUp() {
    if (viewOnlyUnitSelected && viewOnlyUnitId) {
      clearViewOnlyRange();
    }
  }

  function selectCalculatorUnit(position) {
    // Find unit at current cursor position
    const unit = Object.values(unitsInfo).find(u =>
      u.units_x === window.coordX && u.units_y === window.coordY
    );
    if (!unit) return false;

    const unitElement = document.querySelector(`[data-unit-id="${unit.units_id}"]`);
    if (!unitElement) return false;

    // Ensure calculator is open
    if (!window.calculator.toggled) {
      window.calculator.toggled = true;
    }

    // Set up calculator selection state
    window.calculator.selectorPosition = position;
    window.calculator.shortcutPressed = position === 'attacker' ? 'a' : 'd';

    // Add listener, trigger click, remove listener
    const gamemap = document.getElementById('gamemap');
    gamemap.addEventListener('click', window.calculator.fetchUnitId);
    unitElement.click();
    gamemap.removeEventListener('click', window.calculator.fetchUnitId);

    // Clean up state
    window.calculator.selectorPosition = null;
    window.calculator.shortcutPressed = '';

    return true;
  }

  function executeAction(actionId) {
    const handler = actionHandlers[actionId];
    if (handler) {
      handler();
      return true;
    }
    return false;
  }

  // ============================================================================
  // Unit Action Execution
  // ============================================================================

  // Execute a unit action directly using AWBW's internal functions
  function executeUnitAction(action) {
    // Special handling for Fire - it has its own state management
    if (action.id === 'fire' && action.fireState) {
      return executeFire(action.fireState);
    }

    // Special handling for Repair - similar to Fire
    if (action.id === 'repair' && action.repairState) {
      return executeRepair(action.repairState);
    }

    // Special handling for Explode - similar to Fire/Repair
    if (action.id === 'explode' && action.explodeState) {
      return executeExplode(action.explodeState);
    }

    // Special handling for Launch - three states
    if (action.id === 'launch' && action.launchState) {
      return executeLaunch(action.launchState);
    }

    // Special handling for Unload
    if ((action.id === 'unload1' || action.id === 'unload2') && action.unloadState) {
      return executeUnload(action.unloadState);
    }

    // Special handling for Delete - bypass availability check if setting enabled
    if ((action.id === 'delete' || action.id === 'deleteConfirm') && config.currentSettings.settings.allowDeleteWithoutCursorOverUnit) {
      if (!currentClick?.info) return false;
      const unit = currentClick.info;
      return executeDelete(action, unit.units_id, unit.units_players_id);
    }

    // Get selected unit info
    if (!currentClick?.info) return false;

    const unit = currentClick.info;
    const unitId = unit.units_id;
    const unitPId = unit.units_players_id;

    // Get the path - must exist
    const path = currentClick.path;
    if (!path || path.length === 0) return false;

    // Use path end as the action location
    const endNode = path[path.length - 1];
    const x = endNode % maxX;
    const y = Math.floor(endNode / maxX);

    // Get available options to verify action is valid
    const availableOptions = getAvailableActionsAtTile(x, y, true);  // Skip reachability - path end is valid by definition
    const actionOptions = Array.isArray(action.option) ? action.option : [action.option];
    const matchingOption = actionOptions.find(opt => availableOptions.includes(opt));

    if (!matchingOption) return false;

    // Get webSocket reference
    if (!webSocket) return false;

    // Execute based on action type
    switch (matchingOption) {
      case 'Wait':
        return executeWait(webSocket, unitId, unitPId, path);

      case 'Capt':
        return executeCapture(webSocket, unitId, unitPId, path);

      case 'Supply':
        return executeSupply(webSocket, unitId, unitPId, path);

      case 'Hide':
      case 'Unhide':
        return executeHideUnhide(webSocket, unitId, unitPId, path, matchingOption);

      case 'Join':
        return executeJoin(webSocket, unitId, unitPId, path, x, y);

      case 'Load':
        return executeLoad(webSocket, unitId, unitPId, path, x, y);

      case 'Delete':
        return executeDelete(action, unitId, unitPId);

      default:
        return false;
    }
  }

  // Clean up after action execution
  function cleanupAfterAction() {
    // Play confirmation sound and prevent deselect sound
    window.awbw_music_player?.playUiMenuOpen?.();
    window.awbw_music_player?.resetMenuState?.();

    // Clear all tiles and squares (use *= to match dmg-square which has multiple classes)
    window.resetCreatedTiles?.("span[class*='tile'], span[class*='square']");
    window.resetAttack?.();
    window.resetUnit?.();
    window.closeMenu?.();
  }

  // ============================================================================
  // Transport Menu Suppression Helpers
  // ============================================================================

  /**
   * Check if a unit is a transport with cargo
   * @param {Object} unit - Unit object from unitsInfo
   * @returns {boolean}
   */
  function isTransportWithCargo(unit) {
    if (!unit) return false;
    const unitName = unit.units_name;
    if (!TRANSPORT_UNITS.test(unitName)) return false;
    return !!(unit.units_cargo1_units_id || unit.units_cargo2_units_id);
  }

  /**
   * Check if the destination terrain allows unloading
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {string} unitName - Name of the transport unit
   * @returns {boolean} - True if menu will appear (terrain allows unloading)
   */
  function willUnloadMenuAppear(x, y, unitName) {
    // Get terrain at destination
    const terrain = terrainInfo?.[x]?.[y];
    const building = buildingsInfo?.[x]?.[y];
    const terrainName = terrain?.terrain_name || building?.terrain_name || '';

    // APCs, Cruisers, Carriers are always on valid terrain for their cargo
    if (unitName === 'APC' || unitName === 'Cruiser' || unitName === 'Carrier') {
      return true;
    }

    // T-Copter, Lander, Black Boat cannot unload on Sea or Reef
    if (NO_UNLOAD_TERRAIN.test(terrainName)) {
      return false;
    }

    return true;
  }

  /**
   * Activate suppression for a transport's automatic Unload menu
   * Called before sending Wait/Supply/Repair commands
   * @param {number} unitId - ID of the transport unit
   * @param {Array} path - Movement path (array of node values)
   */
  function activateTransportSuppression(unitId, path) {
    const unit = unitsInfo?.[unitId];
    if (!unit) return;

    // Only suppress for transports with cargo
    if (!isTransportWithCargo(unit)) return;

    // Check destination terrain - if menu won't appear, don't suppress
    const pathEnd = path[path.length - 1];
    const destX = pathEnd % maxX;
    const destY = Math.floor(pathEnd / maxX);

    if (!willUnloadMenuAppear(destX, destY, unit.units_name)) {
      // Menu won't appear on this terrain, no need to suppress
      return;
    }

    // If path is only 1 node (staying in place), no animation = no automatic menu
    // The menu only appears after movement animation completes in animUnit()
    if (path.length <= 1) {
      return;
    }

    // Activate suppression
    transportSuppression.active = true;
    transportSuppression.transportId = unitId;

    // Set timeout to auto-clear in case observer never fires
    // Movement takes ~100ms per tile, max reasonable wait is ~5 seconds
    clearTimeout(transportSuppression.timeoutId);
    transportSuppression.timeoutId = setTimeout(() => {
      clearTransportSuppression();
    }, 5000);
  }

  /**
   * Clear the transport suppression state
   */
  function clearTransportSuppression() {
    transportSuppression.active = false;
    transportSuppression.transportId = null;
    transportSuppression.autoOpenCargoMenu = false;
    transportSuppression.savedCurrentClick = null;
    clearTimeout(transportSuppression.timeoutId);
    transportSuppression.timeoutId = null;
  }

  // ============================================================================
  // Unit Action Execution
  // ============================================================================

  // Execute Wait action
  function executeWait(ws, unitId, unitPId, path) {
    // Activate suppression before sending command (for transports with cargo)
    activateTransportSuppression(unitId, path);

    const moveData = {
      action: "Move",
      path: path,
      playerID: unitPId,
      unitID: unitId,
    };

    ws.send(JSON.stringify(moveData));
    cleanupAfterAction();
    return true;
  }

  // Execute Capture action
  function executeCapture(ws, unitId, unitPId, path) {
    const captData = {
      action: "Capt",
      path: path,
      playerID: unitPId,
      unitID: unitId,
    };

    ws.send(JSON.stringify(captData));
    cleanupAfterAction();
    return true;
  }

  // Execute Supply action (APC only - APC is a transport)
  function executeSupply(ws, unitId, unitPId, path) {
    // Activate suppression before sending command (APC with cargo)
    activateTransportSuppression(unitId, path);

    const supplyData = {
      action: "Supply",
      path: path,
      playerID: unitPId,
      unitID: unitId,
    };

    ws.send(JSON.stringify(supplyData));
    cleanupAfterAction();
    return true;
  }

  // Execute Hide/Unhide action
  function executeHideUnhide(ws, unitId, unitPId, path, action) {
    const hideData = {
      action: action,
      path: path,
      playerID: unitPId,
      unitID: unitId,
    };

    ws.send(JSON.stringify(hideData));
    cleanupAfterAction();
    return true;
  }

  // Execute Join action
  function executeJoin(ws, unitId, unitPId, path, x, y) {
    const targetUnitId = unitMap?.[x]?.[y]?.units_id;
    if (!targetUnitId) return false;

    const joinData = {
      action: "Join",
      playerID: unitPId,
      joinID: unitId,
      joinedID: targetUnitId,
      path: path,
    };

    ws.send(JSON.stringify(joinData));
    cleanupAfterAction();
    return true;
  }

  // Execute Load action
  function executeLoad(ws, unitId, unitPId, path, x, y) {
    const transportId = unitMap?.[x]?.[y]?.units_id;
    if (!transportId) return false;

    const loadData = {
      action: "Load",
      playerID: unitPId,
      loadID: unitId,
      transportID: transportId,
      path: path,
    };

    ws.send(JSON.stringify(loadData));
    cleanupAfterAction();
    return true;
  }

  // Execute Delete action
  function executeDelete(action, unitId, unitPId) {
    const deleteScreen = document.querySelector('.delete-screen');
    const isVisible = deleteScreen && window.getComputedStyle(deleteScreen).display !== 'none';

    // If confirmation dialog is already visible, confirm it
    if (isVisible) {
      const confirmBtn = document.querySelector('.delete-conf-btn');
      if (confirmBtn) {
        confirmBtn.click();
      }
      return true;
    }

    // Delete needs confirmation unless using DeleteConfirm
    if (action.id === 'deleteConfirm') {
      const deleteData = {
        action: "Delete",
        playerID: unitPId,
        unitID: unitId,
      };

      webSocket.send(JSON.stringify(deleteData));
      cleanupAfterAction();
      return true;
    }

    // Regular delete - show confirmation dialog
    window.awbw_music_player?.resetMenuState?.();
    window.awbw_music_player?.playUiMenuOpen?.();
    const deleteData = {
      action: "Delete",
      playerID: unitPId,
      unitID: unitId,
    };
    window.deleteConfirmation(deleteData);
    return true;
  }

  // Helper: Build attack websocket message
  function buildAttackMessage(attacker, defender, path) {
    const msg = {
      action: "Fire",
      attacker: { playerID: attacker.units_players_id, unitID: attacker.units_id, path },
    };
    if (defender.units_name === "Pipe Seam") {
      msg.action = "AttackSeam";
      msg.seamID = buildingsInfo[defender.units_x][defender.units_y].buildings_id;
    } else {
      msg.defender = { playerID: defender.units_players_id, unitID: defender.units_id };
    }
    return msg;
  }

  // Execute Fire based on detected state
  function executeFire(fireState) {
    const attacker = currentClick.info;

    if (fireState.state === 'confirm' || fireState.state === 'direct') {
      const msg = buildAttackMessage(attacker, fireState.target, currentClick.path);
      webSocket.send(JSON.stringify(msg));
      cleanupAfterAction();
      return true;
    }

    if (fireState.state === 'enter') {
      window.awbw_music_player?.resetMenuState?.();
      window.awbw_music_player?.playUiMenuOpen?.();
      window.moving = false;
      window.resetCreatedTiles(".movement-tile, .action-square");
      window.closeMenu();
      window.createDamageSquares(attacker, currentClick.unitsInRange, window.movementInfo, false);
      return true;
    }

    return false;
  }

  // Execute Repair based on detected state (Black Boat only - Black Boat is a transport)
  function executeRepair(repairState) {
    const blackBoat = currentClick.info;

    if (repairState.state === 'confirm') {
      // Activate suppression before sending command (Black Boat with cargo)
      activateTransportSuppression(blackBoat.units_id, currentClick.path);

      const repairData = {
        action: "Repair",
        playerID: blackBoat.units_players_id,
        targetID: repairState.target.units_id,
        unitID: blackBoat.units_id,
        path: currentClick.path,
      };

      webSocket.send(JSON.stringify(repairData));
      cleanupAfterAction();
      return true;
    }

    if (repairState.state === 'enter') {
      const path = currentClick.path;
      const pathEnd = nodeToCoords(path[path.length - 1]);

      window.awbw_music_player?.resetMenuState?.();
      window.awbw_music_player?.playUiMenuOpen?.();
      window.moving = false;
      window.resetCreatedTiles(".movement-tile, .action-square");
      window.closeMenu();

      const alliedNeighbours = window.loopNeighbours(pathEnd.x, pathEnd.y, blackBoat).allied;
      const repairableUnits = window.checkIfCanRepair(alliedNeighbours);
      window.createActionSquares(repairableUnits, "repair", window.repairClickHandler);
      return true;
    }

    return false;
  }

  // Execute Explode based on detected state
  function executeExplode(explodeState) {
    const blackBomb = currentClick.info;

    if (explodeState.state === 'confirm') {
      const explodeData = {
        action: "Explode",
        path: currentClick.path,
        playerID: blackBomb.units_players_id,
        unitID: blackBomb.units_id,
      };
      webSocket.send(JSON.stringify(explodeData));
      cleanupAfterAction();
      return true;
    }

    if (explodeState.state === 'enter') {
      const path = currentClick.path;
      const pathEnd = nodeToCoords(path[path.length - 1]);

      window.awbw_music_player?.resetMenuState?.();
      window.awbw_music_player?.playUiMenuOpen?.();
      window.moving = false;
      window.resetCreatedTiles(".movement-tile, .action-square");
      window.closeMenu();
      window.createSquareInRangeOf(3, 0, "bomb", pathEnd.x, pathEnd.y, window.bombClickHandler);
      return true;
    }

    return false;
  }

  // Execute Launch based on detected state
  function executeLaunch(launchState) {
    if (launchState.state === 'confirm') {
      // Need stored target position and unit info
      if (siloTargetX === null || siloTargetY === null) return false;
      if (!currentClick?.info || !currentClick?.path) return false;

      const unit = currentClick.info;
      const path = currentClick.path;
      const pathEnd = nodeToCoords(path[path.length - 1]);

      const launchData = {
        action: "Launch",
        playerID: unit.units_players_id,
        targetX: siloTargetX,
        targetY: siloTargetY,
        unitId: unit.units_id,
        unitX: pathEnd.x,
        unitY: pathEnd.y,
        path: path,
      };

      webSocket.send(JSON.stringify(launchData));

      // Reset silo state
      window.showSiloRange = false;
      siloTargetX = null;
      siloTargetY = null;

      cleanupAfterAction();
      return true;
    }

    if (launchState.state === 'aim') {
      // Lock the silo squares and show Fire Silo menu
      window.awbw_music_player?.resetMenuState?.();
      window.awbw_music_player?.playUiMenuOpen?.();

      // Store target position (current cursor)
      siloTargetX = window.coordX;
      siloTargetY = window.coordY;

      // Stop squares from following cursor
      window.showSiloRange = false;

      // Add pulse animation to all silo squares
      const siloSquares = document.querySelectorAll('.silo-square');
      for (const sq of siloSquares) {
        sq.classList.add('silo-pulse', 'fire-cursor');
      }

      // Show "Fire Silo" menu option
      window.closeMenu();
      window.showUnitOptions([{ option: "Fire Silo", clickable: true }], siloTargetX, siloTargetY);
      return true;
    }

    if (launchState.state === 'enter') {
      window.awbw_music_player?.resetMenuState?.();
      window.awbw_music_player?.playUiMenuOpen?.();
      window.moving = false;
      window.resetCreatedTiles(".movement-tile, .action-square");
      window.closeMenu();

      // Enable silo targeting mode - squares will follow cursor
      window.showSiloRange = true;
      // Draw initial silo squares at current cursor position
      window.createSquareInRangeOf(2, 0, "silo", window.coordX, window.coordY, window.siloClickHandler);
      return true;
    }

    return false;
  }

  // Execute Unload based on detected state
  function executeUnload(unloadState) {
    const diag = unloadState.diagnostics;
    const slotNumber = unloadState.slotNumber;
    const transport = currentClick?.info;

    if (!transport) {
      return false;
    }

    // State: Landing selection - user selecting where to drop cargo
    if (unloadState.state === 'landing') {
      const coords = getGridCoordinates();
      if (!coords.valid) return false;

      // Find landing square at cursor position
      const landingSquares = diag.landingSquares;
      for (const sq of landingSquares) {
        // Landing squares have -1px offset, so add 1 before dividing by 16
        const sqX = (parseInt(sq.style.left) + 1) / 16;
        const sqY = (parseInt(sq.style.top) + 1) / 16;

        if (sqX === coords.x && sqY === coords.y) {
          // Found matching landing square - click it
          window.awbw_music_player?.playUiMenuOpen?.();
          sq.click();
          return true;
        }
      }
      return false;
    }

    // State: Cargo menu - user selecting which unit to unload
    if (unloadState.state === 'cargo') {
      const menuItems = diag.menuItems.filter(li => li.hasAttribute('data-drop-id'));

      // Select the appropriate cargo (slot 1 or 2)
      // If only 1 cargo, both hotkeys select it
      const targetIndex = menuItems.length === 1 ? 0 : (slotNumber - 1);

      if (menuItems[targetIndex] && !menuItems[targetIndex].classList.contains('forbidden')) {
        window.awbw_music_player?.playUiMenuOpen?.();
        menuItems[targetIndex].click();
        return true;
      }
      return false;
    }

    // State: Action menu showing (with Unload option) - skip to cargo menu
    if (unloadState.state === 'action_menu') {
      // Find and click the Unload option
      const unloadOption = Array.from(diag.menuItems).find(li =>
        li.textContent.trim() === 'Unload' && !li.classList.contains('forbidden')
      );

      if (unloadOption) {
        window.awbw_music_player?.playUiMenuOpen?.();
        unloadOption.click();
        return true;
      }
      return false;
    }

    // State: Transport selected but no menu - need to trigger movement first
    if (unloadState.state === 'selected') {
      const path = currentClick?.path;
      if (!path || path.length === 0) return false;

      // Check if cursor is on the transport's own tile
      const coords = getGridCoordinates();
      if (!coords.valid) return false;

      const unitX = transport.units_x;
      const unitY = transport.units_y;

      // Special case: cursor on transport's own tile - open cargo menu directly
      if (coords.x === unitX && coords.y === unitY) {
        // Build cargo array from transport's cargo slots
        const cargo = [];
        if (transport.units_cargo1_units_id) {
          cargo.push(unitsInfo[transport.units_cargo1_units_id]);
        }
        if (transport.units_cargo2_units_id) {
          cargo.push(unitsInfo[transport.units_cargo2_units_id]);
        }

        if (cargo.length === 0) return false;

        // Set up currentClick.path for the unload flow (staying in place)
        currentClick.path = [unitY * maxX + unitX];

        // Clear movement tiles and reset moving state (like movementClickHandler does)
        window.moving = false;
        window.resetCreatedTiles?.(".movement-tile, .action-square");

        // Use showUnitOptions first to position the menu correctly, then showUnloadOptions to replace content
        window.awbw_music_player?.playUiMenuOpen?.();
        window.showUnitOptions([{ option: "Unload", clickable: true }], unitX, unitY);
        window.showUnloadOptions(cargo, transport);

        return true;
      }

      // Get the path end position (where transport will move to)
      const endNode = path[path.length - 1];

      // Check if the tile is reachable
      if (!isTileReachable(coords.x, coords.y)) return false;

      // Build the path to the cursor position
      const cursorNode = coords.y * maxX + coords.x;

      if (cursorNode !== endNode) {
        // Cursor is at a different tile - need to rebuild path
        if (typeof window.buildPath === 'function' && window.movementInfo?.previous) {
          const newPath = window.buildPath(window.movementInfo.previous, cursorNode, path[0]);
          if (newPath && newPath.length > 0) {
            currentClick.path = newPath;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }

      // Send the Move command and set flag based on transport type
      const unitId = transport.units_id;
      const unitPId = transport.units_players_id;
      const isAPC = transport.units_name === 'APC';

      // For all transports: auto-click Unload to open cargo menu after arrival
      transportSuppression.autoOpenCargoMenu = true;

      transportSuppression.transportId = unitId;
      clearTimeout(transportSuppression.timeoutId);
      transportSuppression.timeoutId = setTimeout(() => {
        transportSuppression.autoOpenCargoMenu = false;
        transportSuppression.transportId = null;
      }, 5000);

      // For APCs: check if Supply is available at destination, use it instead of Move
      // Supply works exactly like Move but also resupplies adjacent friendly units
      let action = "Move";
      if (isAPC && typeof checkTargetTile === 'function') {
        const destX = coords.x;
        const destY = coords.y;
        const options = checkTargetTile(destX, destY);
        if (options && Array.isArray(options)) {
          const supplyAvailable = options.some(opt => opt.option === 'Supply' && opt.clickable);
          if (supplyAvailable) {
            action = "Supply";
          }
        }
      }

      const moveData = {
        action: action,
        path: currentClick.path,
        playerID: unitPId,
        unitID: unitId,
      };

      webSocket.send(JSON.stringify(moveData));

      // Play sound and cleanup UI (but menu will appear after animation)
      window.awbw_music_player?.playUiMenuOpen?.();
      window.awbw_music_player?.resetMenuState?.();
      window.resetCreatedTiles?.("span[class*='tile'], span[class*='square']");
      window.resetAttack?.();
      window.moving = false;

      return true;
    }

    return false;
  }

  // ============================================================================
  // Unload Menu Suppression Setup
  // ============================================================================

  /**
   * Setup suppression by monkey-patching showUnitOptions
   * This intercepts the menu BEFORE it appears, which is more reliable than
   * using MutationObserver to detect and close it after it appears.
   */
  function setupUnloadMenuObserver() {
    // Save original function
    const originalShowUnitOptions = window.showUnitOptions;

    if (!originalShowUnitOptions) {
      console.warn('AWBW Hotkeys: Could not find showUnitOptions for suppression');
      return;
    }

    // Cancel auto-actions on any click (user is doing something else)
    const gamemap = document.getElementById('gamemap');
    if (gamemap) {
      gamemap.addEventListener('click', () => {
        if (transportSuppression.autoOpenCargoMenu) {
          transportSuppression.autoOpenCargoMenu = false;
          transportSuppression.active = true; // Suppress the menu when it appears
          // Save currentClick AFTER AWBW processes the click (so it has the user's new selection)
          setTimeout(() => {
            if (window.currentClick) {
              transportSuppression.savedCurrentClick = {
                type: window.currentClick.type,
                info: window.currentClick.info,
                path: window.currentClick.path ? [...window.currentClick.path] : null
              };
            }
          }, 0);
        }
      }, true); // Use capture to get it before AWBW's handlers
    }

    // Replace with our version
    window.showUnitOptions = function(options, x, y) {
      // Check if we should suppress (for Wait/Supply/Repair actions OR cancelled Unload)
      if (transportSuppression.active) {
        // Check if this is a single "Unload" option (automatic menu after transport arrival)
        if (options.length === 1 && options[0].option === 'Unload') {
          // IMPORTANT: AWBW's animUnit sets currentClick.info to the transport
          // right before calling this function, which corrupts any existing user selection.
          // We need to check if the user had a DIFFERENT unit selected (moving mode with path).

          const suppressedId = transportSuppression.transportId;

          // Check if user has a unit in movement mode (selected a different unit)
          // animUnit corrupts currentClick.info but leaves currentClick.path intact
          if (window.moving && window.currentClick?.path?.length > 0) {
            // User has a different unit selected - restore their selection
            // Reconstruct currentClick.info from the path's starting position
            const startNode = window.currentClick.path[0];
            const startX = startNode % maxX;
            const startY = Math.floor(startNode / maxX);
            const selectedUnitEntry = unitMap?.[startX]?.[startY];

            if (selectedUnitEntry && selectedUnitEntry.units_id !== suppressedId) {
              // Restore the user's selected unit info
              window.currentClick.info = unitsInfo[selectedUnitEntry.units_id];
              clearTransportSuppression();
              return; // Don't show menu, user's selection preserved
            }
          }

          // No different unit selected - suppress menu
          // Save the click info before clearing
          const savedClick = transportSuppression.savedCurrentClick;
          clearTransportSuppression();

          // Restore saved currentClick if user clicked on something while waiting
          if (savedClick) {
            window.currentClick = savedClick;
          } else {
            // Only clear currentClick if nothing was saved
            const buildMenu = document.querySelector('.build-options-game');
            const buildMenuOpen = buildMenu && window.getComputedStyle(buildMenu).display !== 'none';
            if (!buildMenuOpen) {
              window.currentClick = null;
            }
          }
          return; // Don't show the menu
        }
      }

      // Check if we should auto-advance to cargo menu (for Unload hotkey)
      if (transportSuppression.autoOpenCargoMenu) {
        // Check if this is a menu with Unload option
        const hasUnload = options.some(opt => opt.option === 'Unload' && opt.clickable);

        if (hasUnload) {
          // Show the menu first (so AWBW sets up its state)
          const result = originalShowUnitOptions.call(this, options, x, y);

          // Clear the flag
          clearTransportSuppression();

          // Use setTimeout to let AWBW finish setting up, then click Unload
          setTimeout(() => {
            // Find the Unload option and click it
            const menuItems = document.querySelectorAll('.unit-options-game ul li');
            for (const item of menuItems) {
              if (item.textContent.trim() === 'Unload' && !item.classList.contains('forbidden')) {
                item.click();
                break;
              }
            }
          }, 0);

          return result;
        }
      }

      // Call original function for all other cases
      return originalShowUnitOptions.call(this, options, x, y);
    };
  }

  // ============================================================================
  // Build Menu Fast Close Setup
  // ============================================================================

  // Setup click listener for fast build menu close on direct clicks
  function setupBuildMenuFastClose() {
    const buildMenu = document.querySelector('.build-options-game');
    if (!buildMenu) return;

    // Use event delegation to catch all menu item clicks
    buildMenu.addEventListener('click', (e) => {
      // Only act if fast close is enabled
      if (!config.currentSettings.settings.fastBuildMenuClose) return;

      // Check if click target is a build menu item
      const menuItem = e.target.closest('[data-build-unit]');
      if (!menuItem || menuItem.classList.contains('forbidden')) return;

      // Close menu after AWBW's handler runs
      setTimeout(() => {
        window.closeMenu?.();
      }, 0);
    });

    // Clear build action tracking when cancel is clicked
    const cancelBtn = document.querySelector('.build-confirmation-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        lastBuildActionId = null;
      });
    }
  }

  // ============================================================================
  // Building Action Execution
  // ============================================================================

  // Execute a building action (build a unit)
  function executeBuildingAction(action) {
    // Check if confirmation dialog is visible
    const confirmDialog = document.querySelector('.build-confirmation-game');
    const confirmDialogVisible = confirmDialog && window.getComputedStyle(confirmDialog).display !== 'none';

    if (confirmDialogVisible && lastBuildActionId === action.id) {
      // Same action pressed twice - confirm the build
      const confirmBtn = document.querySelector('.build-confirmation-conf-btn');
      if (confirmBtn) {
        confirmBtn.click();
        lastBuildActionId = null;  // Clear after confirming
        return true;
      }
      return false;
    }

    // Normal flow - find and click the unit in the menu
    const buildMenu = document.querySelector('.build-options-game');
    if (!buildMenu || window.getComputedStyle(buildMenu).display === 'none') {
      return false;
    }

    // Find the unit in the menu by name
    // Menu item structure: <li><span>sprites</span>UnitName<span class="unit-cost">cost</span></li>
    const menuItems = buildMenu.querySelectorAll('[data-build-unit]');
    for (const item of menuItems) {
      if (item.classList.contains('forbidden')) continue;

      // Extract unit name from text nodes (skip sprite spans and cost span)
      let unitName = '';
      for (const node of item.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          unitName += node.textContent;
        }
      }
      unitName = unitName.trim();

      if (unitName === action.unitName) {
        item.click();

        // Store action ID for potential confirmation
        lastBuildActionId = action.id;

        // Fast menu close if enabled
        if (config.currentSettings.settings.fastBuildMenuClose) {
          setTimeout(() => {
            window.closeMenu?.();
          }, 0);
        }

        return true;
      }
    }

    return false;
  }

  // ============================================================================
  // Fullscreen Compatibility
  // ============================================================================

  function isMaximizeModInstalled() {
    // Check if the AWBW Maximise userscript is installed by looking for its button
    return document.querySelector('.AWBWMaxmiseButton') !== null;
  }

  function isMaximised() {
    return document.documentElement.classList.contains('AWBWMaximise');
  }

  function isMusicPlayerInstalled() {
    // Check for the music player global object or its button (may be in iframe)
    if (typeof window.awbw_music_player !== 'undefined') return true;
    if (document.getElementById('music_player_background')) return true;
    if (document.getElementById('music_player_parent')) return true;
    // Check in music player iframe if it exists
    const iframe = document.getElementById('music-player-iframe');
    if (iframe?.contentDocument?.getElementById('music_player_background')) return true;
    return false;
  }

  function getMusicPlayerButton() {
    // Try the background element first (where click listener is attached)
    let btn = document.getElementById('music_player_background');
    if (btn) return btn;

    // Try the parent element as fallback
    btn = document.getElementById('music_player_parent');
    if (btn) {
      // Try to find background within parent
      const bg = btn.querySelector('.game-tools-bg');
      if (bg) return bg;
      return btn;
    }

    // Try music player iframe as last resort
    const iframe = document.getElementById('music-player-iframe');
    if (iframe?.contentDocument) {
      btn = iframe.contentDocument.getElementById('music_player_background');
      if (btn) return btn;
      btn = iframe.contentDocument.getElementById('music_player_parent');
      if (btn) {
        const bg = btn.querySelector('.game-tools-bg');
        if (bg) return bg;
        return btn;
      }
    }
    return null;
  }

  function updatePanelCentering(panel) {
    // Temporarily show panel to get dimensions if hidden
    const wasHidden = panel.style.display === 'none';
    if (wasHidden) {
      panel.style.display = 'flex';
      panel.style.visibility = 'hidden';
    }

    const rect = panel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate position and round to integers to prevent blurry rendering
    const left = Math.round((viewportWidth - rect.width) / 2);
    const top = Math.round((viewportHeight - rect.height) / 2);

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.style.transform = 'none';

    // Restore visibility
    if (wasHidden) {
      panel.style.display = 'none';
      panel.style.visibility = 'visible';
    }
  }

  // ============================================================================
  // Focus Check
  // ============================================================================

  function isGameFocused() {
    return document.activeElement === document.body ||
           document.activeElement.id === 'gamemap-container';
  }

  // ============================================================================
  // UI Creation
  // ============================================================================

  function createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Range display tiles should not capture clicks - let them pass through to units */
      .range-square, .vision-square, .check-range-square {
        pointer-events: none;
      }

      /* Blocked tiles (potential range) - separate background and border layers */
      .blocked-movement-bg,
      .blocked-movement-border,
      .blocked-range-bg,
      .blocked-range-border {
        position: absolute;
        width: 17px;
        height: 17px;
        box-sizing: border-box;
        pointer-events: none;
        z-index: 110;
      }
      /* Background layers - colored background, no border */
      .blocked-movement-bg {
        background-color: rgba(200, 170, 245, 0.35);
      }
      .blocked-range-bg {
        background-color: rgba(255, 165, 0, 0.35);
      }
      /* Border layers - no background, colored border */
      .blocked-movement-border {
        background-color: transparent;
        border-color: rgba(150, 115, 210, 1);
      }
      .blocked-range-border {
        background-color: transparent;
        border-color: rgba(255, 140, 0, 1);
      }

      /* Actual tiles - separate background and border layers */
      .movement-tile-bg,
      .movement-tile-border,
      .range-tile-bg,
      .range-tile-border,
      .vision-tile-bg,
      .vision-tile-border {
        position: absolute;
        width: 17px;
        height: 17px;
        box-sizing: border-box;
        pointer-events: none;
        z-index: 110;
      }
      /* Movement tiles (blue) */
      .movement-tile-bg {
        background-color: rgba(67, 217, 228, 0.4);
      }
      .movement-tile-border {
        background-color: transparent;
        border-color: rgb(22, 98, 184);
      }
      /* Attack range tiles (red) */
      .range-tile-bg {
        background-color: rgba(255, 0, 0, 0.35);
      }
      .range-tile-border {
        background-color: transparent;
        border-color: rgb(139, 0, 0);
      }
      /* Vision tiles */
      .vision-tile-bg {
        background-color: rgba(236, 221, 9, 0.35);
      }
      .vision-tile-border {
        background-color: transparent;
        border-color: rgb(255, 115, 0);
      }

      .awbw-hotkeys-panel {
        position: fixed;
        background: white;
        border: 3px solid #2c5aa0;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        max-width: 379px;
        width: 90%;
        height: 845px;
        max-height: calc(100vh - 64px);
        display: flex;
        flex-direction: column;
        font-family: "Nova Square", cursive;
        z-index: 10000;
        padding: 20px;
        -webkit-font-smoothing: none;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }

      .awbw-hotkeys-panel *,
      .awbw-hotkeys-panel *::before,
      .awbw-hotkeys-panel *::after {
        -webkit-font-smoothing: none;
        -moz-osx-font-smoothing: grayscale;
      }

      .awbw-hotkeys-header {
        background: white;
        color: #2c5aa0;
        font-size: 22px;
        font-weight: bold;
        margin: 0 0 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .awbw-hotkeys-header-title {
        flex: 1;
      }

      /* Profile dropdown */
      .awbw-hotkeys-profile-dropdown {
        position: relative;
        display: inline-block;
      }

      .awbw-hotkeys-profile-btn {
        padding: 8px 32px 8px 12px;
        background: #2c5aa0;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        font-family: "Nova Square", cursive;
        font-size: 14px;
        transition: all 0.15s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        outline: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3e%3cpath fill='white' d='M6 8L0 0h12z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 10px;
      }

      .awbw-hotkeys-profile-btn:hover {
        background-color: #1e4080;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3e%3cpath fill='white' d='M6 8L0 0h12z'/%3e%3c/svg%3e");
      }

      .awbw-hotkeys-profile-btn.open {
        background-color: #1e4080;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3e%3cpath fill='white' d='M6 0L12 8H0z'/%3e%3c/svg%3e");
      }

      .awbw-hotkeys-profile-menu {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        background: white;
        border: 2px solid #2c5aa0;
        border-radius: 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 180px;
        z-index: 10005;
        display: none;
      }

      .awbw-hotkeys-profile-menu.open {
        display: block;
      }

      .awbw-hotkeys-profile-menu-item {
        padding: 8px 12px;
        cursor: pointer;
        background: white;
        color: #333;
        font-size: 14px;
        font-family: "Nova Square", cursive;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background 0.2s;
      }

      .awbw-hotkeys-profile-menu-item:hover {
        background: #f0f5ff;
      }

      .awbw-hotkeys-profile-menu-item.disabled {
        color: #999;
        cursor: default;
      }

      .awbw-hotkeys-profile-menu-item.disabled:hover {
        background: transparent;
      }

      .awbw-hotkeys-profile-divider {
        height: 1px;
        background: #d0d8e8;
        margin: 4px 0;
      }

      .awbw-hotkeys-profile-submenu {
        position: relative;
      }

      .awbw-hotkeys-profile-submenu-content {
        position: absolute;
        left: 100%;
        top: -5px;
        background: white;
        border: 2px solid #2c5aa0;
        border-radius: 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 150px;
        display: none;
      }

      /* Invisible bridge to maintain hover when moving to submenu */
      .awbw-hotkeys-profile-submenu::before {
        content: '';
        position: absolute;
        right: -10px;
        top: 0;
        width: 10px;
        height: 100%;
      }

      .awbw-hotkeys-profile-submenu:hover .awbw-hotkeys-profile-submenu-content {
        display: block;
      }

      .awbw-hotkeys-profile-menu-item.has-submenu::after {
        content: '▶';
        font-size: 10px;
        opacity: 0.6;
      }

      .awbw-hotkeys-profile-submenu-content.saved-profile-submenu {
        top: -2px;
      }

      .awbw-hotkeys-header-line {
        border-bottom: 2px solid #2c5aa0;
        margin: 0 0 15px 0;
      }

      .awbw-hotkeys-tabs {
        display: flex;
        gap: 12px;
        margin: 0;
        padding: 0;
        position: relative;
      }

      .awbw-hotkeys-tabs::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: #e0e0e0;
      }

      .awbw-hotkeys-tab {
        padding: 12px 4px;
        cursor: pointer;
        border: none;
        background: transparent;
        color: #333;
        font-size: 14px;
        font-family: "Nova Square", cursive;
        font-weight: bold;
        border-bottom: 2px solid transparent;
        position: relative;
        top: 1px;
        z-index: 1;
        transition: color 0.2s, border-color 0.2s;
      }

      .awbw-hotkeys-tab:hover {
        color: #2c5aa0;
      }

      .awbw-hotkeys-tab.active {
        color: #2c5aa0;
        border-bottom-color: #2c5aa0;
      }

      .awbw-hotkeys-content {
        padding: 0;
        overflow-y: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .awbw-hotkeys-rows-container {
        flex: 1;
        overflow-y: auto;
        padding-top: 20px;
      }

      .awbw-hotkeys-section-header {
        color: #2c5aa0;
        font-size: 16px;
        margin: 20px 0 12px 0;
        font-weight: bold;
      }

      .awbw-hotkeys-section-header:first-child {
        margin-top: 0;
      }

      .awbw-hotkeys-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 10px;
        background: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 6px;
        height: 36px;
        box-sizing: border-box;
      }

      .awbw-hotkeys-label {
        font-size: 14px;
        color: #333;
        font-weight: bold;
        font-family: "Nova Square", cursive;
        display: flex;
        align-items: center;
      }

      .awbw-hotkeys-icon {
        margin-right: 6px;
        transform: scaleX(-1);
      }

      .awbw-hotkeys-icon.no-flip {
        transform: none;
      }

      .awbw-hotkeys-button {
        width: 90px;
        height: 24px;
        padding: 0;
        border: none;
        border-radius: 5px;
        background: #2c5aa0;
        color: white;
        font-size: 12px;
        font-family: "Nova Square", cursive;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        transition: all 0.15s ease;
      }

      .awbw-hotkeys-button:hover {
        background: #1e4080;
      }

      .awbw-hotkeys-button:active {
        background: #16325f;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3) inset;
        transform: translateY(2px);
      }

      .awbw-hotkeys-button.rebinding {
        background: #e67e22;
        transition: none;
      }

      .awbw-hotkeys-button.rebinding:hover {
        background: #e67e22;
      }

      .awbw-hotkeys-button.rebinding:active {
        background: #e67e22;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3) inset;
        transform: translateY(2px);
      }

      .awbw-hotkeys-divider {
        border: none;
        border-top: 1px solid #ddd;
        margin: 12px 0;
      }

      .awbw-hotkeys-footer {
        padding: 12px 0 0 0;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .awbw-hotkeys-close {
        padding: 8px 24px;
        border: none;
        border-radius: 5px;
        background: #e8e8e8;
        color: #555;
        font-size: 14px;
        font-family: "Nova Square", cursive;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.15s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      }

      .awbw-hotkeys-close:hover {
        background: #d8d8d8;
      }

      .awbw-hotkeys-close:active {
        background: #c8c8c8;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3) inset;
        transform: translateY(2px);
      }

      /* Info button */
      .awbw-hotkeys-info-btn {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 50%;
        background: #2c5aa0;
        color: white;
        font-size: 16px;
        font-weight: bold;
        font-family: "Nova Square", cursive;
        cursor: pointer;
        transition: all 0.15s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .awbw-hotkeys-info-btn:hover {
        background: #1e4080;
      }

      .awbw-hotkeys-info-btn:active {
        background: #163060;
        transform: translateY(1px);
      }

      /* Info button tooltip - position below the button */
      .awbw-hotkeys-info-btn[data-tooltip]::after {
        bottom: auto;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 0;
        margin-top: 8px;
        width: auto;
        white-space: nowrap;
      }

      /* Info dialog overlay */
      .awbw-hotkeys-info-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10002;
      }

      /* Info dialog */
      .awbw-hotkeys-info-dialog {
        position: fixed;
        z-index: 10003;
        background: white;
        border: 3px solid #2c5aa0;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        width: 500px;
        max-width: 90vw;
        height: 500px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        font-family: "Nova Square", cursive;
        padding: 20px;
        -webkit-font-smoothing: none;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }

      .awbw-hotkeys-info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .awbw-hotkeys-info-title {
        font-size: 22px;
        font-weight: bold;
        color: #2c5aa0;
      }

      /* Info dialog tabs */
      .awbw-hotkeys-info-tabs {
        display: flex;
        gap: 12px;
        margin: 0;
        padding: 0;
        position: relative;
      }

      .awbw-hotkeys-info-tabs::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: #e0e0e0;
      }

      .awbw-hotkeys-info-tab {
        padding: 12px 4px;
        cursor: pointer;
        border: none;
        background: transparent;
        color: #333;
        font-size: 14px;
        font-family: "Nova Square", cursive;
        font-weight: bold;
        border-bottom: 2px solid transparent;
        position: relative;
        top: 1px;
        z-index: 1;
        transition: color 0.2s, border-color 0.2s;
      }

      .awbw-hotkeys-info-tab:hover {
        color: #2c5aa0;
      }

      .awbw-hotkeys-info-tab.active {
        color: #2c5aa0;
        border-bottom-color: #2c5aa0;
      }

      /* Info dialog content */
      .awbw-hotkeys-info-content {
        padding: 15px 0;
        overflow-y: auto;
        flex: 1;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
      }

      .awbw-hotkeys-info-content h3 {
        color: #2c5aa0;
        margin: 0 0 10px 0;
        font-size: 16px;
      }

      .awbw-hotkeys-info-content p {
        margin: 0 0 12px 0;
      }

      .awbw-hotkeys-info-content ul {
        margin: 0 0 12px 0;
        padding-left: 20px;
      }

      .awbw-hotkeys-info-content li {
        margin-bottom: 4px;
      }

      .awbw-hotkeys-info-content .version-entry {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }

      .awbw-hotkeys-info-content .version-entry:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .awbw-hotkeys-info-content .version-number {
        font-weight: bold;
        color: #2c5aa0;
      }

      .awbw-hotkeys-info-content .version-date {
        color: #888;
        font-size: 12px;
        margin-left: 8px;
      }

      .awbw-hotkeys-info-content a {
        color: #2c5aa0;
        text-decoration: none;
      }

      .awbw-hotkeys-info-content a:hover {
        text-decoration: underline;
      }

      .awbw-hotkeys-info-footer {
        padding: 12px 0 0 0;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: flex-end;
      }

      .awbw-hotkeys-setting-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 10px;
        background: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 6px;
        height: 36px;
        box-sizing: border-box;
      }

      .awbw-hotkeys-setting-label {
        font-size: 14px;
        color: #333;
        font-weight: bold;
        font-family: "Nova Square", cursive;
      }

      .awbw-hotkeys-toggle {
        position: relative;
        width: 48px;
        height: 24px;
      }

      .awbw-hotkeys-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .awbw-hotkeys-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.3s;
        border-radius: 24px;
      }

      .awbw-hotkeys-toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
      }

      .awbw-hotkeys-toggle input:checked + .awbw-hotkeys-toggle-slider {
        background-color: #2c5aa0;
      }

      .awbw-hotkeys-toggle input:checked + .awbw-hotkeys-toggle-slider:before {
        transform: translateX(24px);
      }

      .awbw-hotkeys-empty-tab {
        color: #888;
        font-style: italic;
        text-align: center;
        padding: 40px 20px;
      }

      .awbw-hotkeys-confirm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
      }

      .awbw-hotkeys-confirm-dialog {
        background: white;
        border: 3px solid #2c5aa0;
        padding: 20px;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        font-family: "Nova Square", cursive;
        text-align: center;
      }

      .awbw-hotkeys-confirm-message {
        margin-bottom: 16px;
        font-size: 14px;
        color: #333;
        font-family: "Nova Square", cursive;
      }

      .awbw-hotkeys-confirm-buttons {
        display: flex;
        justify-content: center;
        gap: 8px;
      }

      .awbw-hotkeys-confirm-btn {
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        font-family: "Nova Square", cursive;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        transition: all 0.15s ease;
      }

      .awbw-hotkeys-confirm-btn:active {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3) inset;
        transform: translateY(2px);
      }

      .awbw-hotkeys-confirm-yes {
        background: #2c5aa0;
        color: white;
        border: none;
        transition: all 0.15s ease;
      }

      .awbw-hotkeys-confirm-yes:hover {
        background: #1e4080;
      }

      .awbw-hotkeys-confirm-yes:active {
        background: #16325f;
      }

      .awbw-hotkeys-confirm-yes.danger {
        background: #dc3545;
        border: none;
      }

      .awbw-hotkeys-confirm-yes.danger:hover {
        background: #b02a37;
      }

      .awbw-hotkeys-confirm-yes.danger:active {
        background: #8a2229;
      }

      .awbw-hotkeys-confirm-no {
        background: #e8e8e8;
        color: #555;
        border: none;
        transition: all 0.15s ease;
      }

      .awbw-hotkeys-confirm-no:hover {
        background: #d8d8d8;
      }

      .awbw-hotkeys-confirm-no:active {
        background: #c8c8c8;
      }

      .awbw-hotkeys-confirm-dialog.danger {
        border-color: #dc3545;
      }

      /* Popup buttons */
      .awbw-hotkeys-popup-btn-primary {
        padding: 8px 15px;
        background: #2c5aa0;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Nova Square', cursive;
        font-weight: bold;
        transition: all 0.15s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      }

      .awbw-hotkeys-popup-btn-primary:hover {
        background: #1e4080;
      }

      .awbw-hotkeys-popup-btn-primary:active {
        background: #16325f;
        transform: translateY(2px);
      }

      .awbw-hotkeys-popup-btn-secondary {
        padding: 10px;
        background: #e8e8e8;
        color: #555;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Nova Square', cursive;
        font-weight: bold;
        transition: all 0.15s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      }

      .awbw-hotkeys-popup-btn-secondary:hover {
        background: #d8d8d8;
      }

      .awbw-hotkeys-popup-btn-secondary:active {
        background: #c8c8c8;
        transform: translateY(2px);
      }

      .awbw-hotkeys-layout-select {
        position: relative;
        display: inline-block;
      }

      .awbw-hotkeys-layout-button {
        padding: 8px 32px 8px 12px;
        background: #2c5aa0;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        font-family: "Nova Square", cursive;
        font-size: 14px;
        transition: all 0.15s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        min-width: 90px;
        outline: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3e%3cpath fill='white' d='M6 8L0 0h12z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 10px;
      }

      .awbw-hotkeys-layout-button:hover {
        background-color: #1e4080;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3e%3cpath fill='white' d='M6 8L0 0h12z'/%3e%3c/svg%3e");
      }

      .awbw-hotkeys-layout-button.open {
        background-color: #1e4080;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3e%3cpath fill='white' d='M6 0L12 8H0z'/%3e%3c/svg%3e");
      }

      .awbw-hotkeys-layout-menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: white;
        border: 2px solid #2c5aa0;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow: hidden;
        display: none;
      }

      .awbw-hotkeys-layout-menu.open {
        display: block;
      }

      .awbw-hotkeys-layout-option {
        padding: 8px 12px;
        cursor: pointer;
        background: white;
        color: #333;
        font-size: 14px;
        font-weight: bold;
        font-family: "Nova Square", cursive;
        border: none;
        width: 100%;
        text-align: left;
        transition: background 0.2s;
      }

      .awbw-hotkeys-layout-option:hover {
        background: #f0f5ff;
      }

      .awbw-hotkeys-layout-option.selected {
        background: #e3ecff;
        color: #2c5aa0;
      }

      .awbw-hotkeys-support-btn {
        padding: 8px 16px;
        background: #2c5aa0;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        font-family: "Nova Square", cursive;
        font-size: 14px;
        transition: all 0.15s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      }

      .awbw-hotkeys-support-btn:hover {
        background: #1e4080;
      }

      .awbw-hotkeys-support-btn:active {
        background: #16325f;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3) inset;
        transform: translateY(2px);
      }

      /* Custom tooltips with faster display (0.3s delay) */
      [data-tooltip] {
        position: relative;
      }

      [data-tooltip]::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: -10px;
        padding: 6px 10px;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        font-size: 12px;
        font-weight: normal;
        white-space: normal;
        width: 277px;
        text-align: center;
        border-radius: 4px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        margin-bottom: 8px;
        z-index: 10003;
        line-height: 1.4;
      }

      [data-tooltip]:hover::after {
        opacity: 1;
        transition-delay: 0.3s;
      }

      /* Preset submenu tooltips - position to the left of the submenu */
      .awbw-hotkeys-profile-submenu-content [data-tooltip]::after {
        bottom: auto;
        top: 50%;
        left: auto;
        right: 100%;
        transform: translateY(-50%);
        margin-bottom: 0;
        margin-right: 8px;
        width: 200px;
      }

      /* Pagination controls for Misc tab */
      .awbw-hotkeys-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        padding: 15px 0;
        margin-top: 0;
        border-top: 1px solid #e0e0e0;
      }

      .awbw-hotkeys-pagination-btn {
        width: 26px;
        height: 26px;
        padding: 0;
        padding-bottom: 1px;
        border: 1px solid #1e4080;
        border-radius: 4px;
        background: #2c5aa0;
        color: white;
        font-size: 14px;
        font-family: "Nova Square", cursive;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .awbw-hotkeys-pagination-btn:hover:not(:disabled) {
        background: #1e4080;
      }

      .awbw-hotkeys-pagination-btn:active:not(:disabled) {
        background: #16325f;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3) inset;
        transform: translateY(1px);
      }

      .awbw-hotkeys-pagination-btn:disabled {
        background: #ccc;
        border-color: #aaa;
        cursor: not-allowed;
        box-shadow: none;
      }

      .awbw-hotkeys-pagination-indicator {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        font-family: "Nova Square", cursive;
        min-width: 50px;
        text-align: center;
      }

      /* Menu hotkey hints via wrapper span ::after for Icon -> Hotkey -> Name order */
      .menu-icon-wrapper {
        display: inline;
      }
      .menu-icon-wrapper[data-hotkey]::after {
        content: attr(data-hotkey);
        opacity: 0.7;
        font-size: 0.9em;
        margin-left: 1px;
        margin-right: 2px;
      }
      .menu-unit.menu-icon-wrapper[data-hotkey]::after {
        content: attr(data-hotkey);
        opacity: 0.7;
        font-size: 0.9em;
        margin-left: 3px;
        margin-right: 3px;
      }
    `;
    document.head.appendChild(style);
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'awbw-hotkeys-panel';
    panel.id = 'awbw-hotkeys-panel';
    panel.style.display = 'none';

    // Block context menu on the entire panel
    panel.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Header
    const header = document.createElement('div');
    header.className = 'awbw-hotkeys-header';

    const headerTitle = document.createElement('span');
    headerTitle.className = 'awbw-hotkeys-header-title';
    headerTitle.textContent = 'Hotkey Configuration';
    header.appendChild(headerTitle);

    // Info button (before profile dropdown)
    const infoBtn = document.createElement('button');
    infoBtn.className = 'awbw-hotkeys-info-btn';
    infoBtn.textContent = 'i';
    infoBtn.setAttribute('data-tooltip', 'Help & Info');
    infoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.awbw_music_player?.playUiMenuOpen?.();
      showInfoDialog();
    });
    header.appendChild(infoBtn);

    // Profile dropdown
    const profileDropdown = document.createElement('div');
    profileDropdown.className = 'awbw-hotkeys-profile-dropdown';
    profileDropdown.id = 'awbw-hotkeys-profile-dropdown';

    const profileBtn = document.createElement('button');
    profileBtn.className = 'awbw-hotkeys-profile-btn';
    profileBtn.id = 'awbw-hotkeys-profile-btn';
    profileBtn.textContent = 'Profile';
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.awbw_music_player?.playUiMenuOpen?.();
      toggleProfileMenu();
    });
    profileDropdown.appendChild(profileBtn);

    const profileMenu = document.createElement('div');
    profileMenu.className = 'awbw-hotkeys-profile-menu';
    profileMenu.id = 'awbw-hotkeys-profile-menu';
    profileDropdown.appendChild(profileMenu);

    header.appendChild(profileDropdown);

    panel.appendChild(header);

    // Header line
    const headerLine = document.createElement('div');
    headerLine.className = 'awbw-hotkeys-header-line';
    panel.appendChild(headerLine);

    // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'awbw-hotkeys-tabs';
    const tabNames = ['Nav.', 'Unit', 'Base', 'Airport', 'Port', 'Misc.', 'Settings'];
    const tabIds = ['navigation', 'unit', 'base', 'airport', 'port', 'misc', 'settings'];
    tabIds.forEach((tabId, index) => {
      const tab = document.createElement('button');
      tab.className = 'awbw-hotkeys-tab' + (index === 0 ? ' active' : '');
      tab.textContent = tabNames[index];
      tab.dataset.tab = tabId;
      tab.addEventListener('click', () => switchTab(tabId));
      tabs.appendChild(tab);
    });
    panel.appendChild(tabs);

    // Content
    const content = document.createElement('div');
    content.className = 'awbw-hotkeys-content';
    content.id = 'awbw-hotkeys-content';
    panel.appendChild(content);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'awbw-hotkeys-footer';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'awbw-hotkeys-close';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', hidePanel);
    footer.appendChild(closeBtn);

    panel.appendChild(footer);

    document.body.appendChild(panel);
    renderTabContent('navigation');
  }

  function switchTab(tabId) {
    // Cancel any active rebinding
    cancelRebinding();

    window.awbw_music_player?.playUiMenuOpen?.();

    // Update tab buttons
    document.querySelectorAll('.awbw-hotkeys-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    renderTabContent(tabId);
  }

  function renderTabContent(tabId) {
    const content = document.getElementById('awbw-hotkeys-content');
    content.innerHTML = '';

    if (tabId === 'settings') {
      renderSettingsTab(content);
    } else {
      renderHotkeyTab(content, tabId);
    }
  }

  function renderHotkeyTab(content, tabId) {
    let actions = HOTKEY_ACTIONS[tabId];

    // Create scrollable container for all tabs
    const needsPagination = tabId === 'misc' && getMiscTabTotalPages() > 1;
    const rowsContainer = document.createElement('div');
    rowsContainer.className = 'awbw-hotkeys-rows-container';
    content.appendChild(rowsContainer);

    // Section header
    const tabTitles = {
      navigation: 'Navigation Hotkeys',
      misc: 'Miscellaneous Hotkeys',
      unit: 'Unit Hotkeys',
      base: 'Base Hotkeys',
      airport: 'Airport Hotkeys',
      port: 'Port Hotkeys',
    };

    const header = document.createElement('h3');
    header.className = 'awbw-hotkeys-section-header';
    header.textContent = tabTitles[tabId] || 'Hotkeys';
    rowsContainer.appendChild(header);

    if (!actions || actions.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'awbw-hotkeys-empty-tab';
      empty.textContent = 'No hotkeys configured for this tab yet.';
      rowsContainer.appendChild(empty);
      return;
    }

    // Filter by page for misc tab
    if (tabId === 'misc') {
      actions = actions.filter(action => {
        const actionPage = action.page || 1;
        return actionPage === miscTabPage;
      });
    }

    actions.forEach((action, index) => {
      // Skip actions that require the Maximize mod if it's not installed
      if (action.requiresMaximizeMod && !isMaximizeModInstalled()) {
        return;
      }
      // Skip actions that require the Music Player if it's not installed
      if (action.requiresMusicPlayer && !isMusicPlayerInstalled()) {
        return;
      }

      // Add dividers for Navigation and Misc tabs
      if (tabId === 'navigation') {
        // Divider before Movement Range section
        if (action.id === 'showMovementRangeIndividual') {
          const divider = document.createElement('hr');
          divider.className = 'awbw-hotkeys-divider';
          rowsContainer.appendChild(divider);
        }
        // Divider before Attack Range section
        if (action.id === 'showAttackRangeIndividual') {
          const divider = document.createElement('hr');
          divider.className = 'awbw-hotkeys-divider';
          rowsContainer.appendChild(divider);
        }
        // Divider before Vision Range section
        if (action.id === 'showVisionRangeIndividual') {
          const divider = document.createElement('hr');
          divider.className = 'awbw-hotkeys-divider';
          rowsContainer.appendChild(divider);
        }
      } else if (tabId === 'misc') {
        // Page 1: Divider before Calculator section
        if (action.id === 'toggleCalculator') {
          const divider = document.createElement('hr');
          divider.className = 'awbw-hotkeys-divider';
          rowsContainer.appendChild(divider);
        }
        // Page 2: Divider before Movement Planner section
        if (action.id === 'openMovementPlanner') {
          const divider = document.createElement('hr');
          divider.className = 'awbw-hotkeys-divider';
          rowsContainer.appendChild(divider);
        }
        // Page 2: Divider before replay section
        if (action.id === 'openReplay') {
          const divider = document.createElement('hr');
          divider.className = 'awbw-hotkeys-divider';
          rowsContainer.appendChild(divider);
        }
        // Page 3: Divider before Music Player section (only if Maximize mod is also installed)
        if (action.id === 'toggleMusic' && isMaximizeModInstalled()) {
          const divider = document.createElement('hr');
          divider.className = 'awbw-hotkeys-divider';
          rowsContainer.appendChild(divider);
        }
      }

      const row = document.createElement('div');
      row.className = 'awbw-hotkeys-row';

      const label = document.createElement('span');
      label.className = 'awbw-hotkeys-label';

      // Add icon if present
      if (action.icon) {
        const icon = document.createElement('img');
        icon.className = action.noFlip ? 'awbw-hotkeys-icon no-flip' : 'awbw-hotkeys-icon';

        // Use cached version if available, otherwise fetch and cache
        if (iconCache[action.icon]) {
          icon.src = iconCache[action.icon];
        } else {
          // Use original URL for now, cache in background
          icon.src = action.icon;
          getIconDataUrl(action.icon).then(dataUrl => {
            icon.src = dataUrl;
          });
        }

        label.appendChild(icon);
      }

      label.appendChild(document.createTextNode(action.label));
      row.appendChild(label);

      const button = document.createElement('button');
      button.className = 'awbw-hotkeys-button';
      button.dataset.action = action.id;
      button.dataset.tab = tabId;
      updateButtonDisplay(button, config.currentSettings.hotkeys[action.id]);

      button.addEventListener('click', () => startRebinding(action.id, tabId, button));
      button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        clearBinding(action.id, button);
      });

      row.appendChild(button);
      rowsContainer.appendChild(row);

      // Add fullscreen re-entry setting after toggleFullscreen (only when maximize mod is installed)
      if (action.id === 'toggleFullscreen' && isMaximizeModInstalled()) {
        const settingRow = document.createElement('div');
        settingRow.className = 'awbw-hotkeys-setting-row';
        settingRow.style.marginTop = '4px';
        settingRow.style.marginBottom = '4px';

        const settingLabel = document.createElement('span');
        settingLabel.className = 'awbw-hotkeys-setting-label';
        settingLabel.textContent = FULLSCREEN_REENTRY_SETTING.label;
        settingLabel.setAttribute('data-tooltip', FULLSCREEN_REENTRY_SETTING.description);
        settingLabel.style.cursor = 'help';
        settingRow.appendChild(settingLabel);

        const toggle = document.createElement('label');
        toggle.className = 'awbw-hotkeys-toggle';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = config.currentSettings.settings[FULLSCREEN_REENTRY_SETTING.id];
        checkbox.addEventListener('change', () => {
          window.awbw_music_player?.playUiMenuOpen?.();
          config.currentSettings.settings[FULLSCREEN_REENTRY_SETTING.id] = checkbox.checked;
          saveConfig();
        });

        const slider = document.createElement('span');
        slider.className = 'awbw-hotkeys-toggle-slider';

        toggle.appendChild(checkbox);
        toggle.appendChild(slider);
        settingRow.appendChild(toggle);

        rowsContainer.appendChild(settingRow);
      }
    });

    // Add pagination controls for misc tab (outside scrollable container)
    if (needsPagination) {
      const pagination = document.createElement('div');
      pagination.className = 'awbw-hotkeys-pagination';

      const prevBtn = document.createElement('button');
      prevBtn.className = 'awbw-hotkeys-pagination-btn';
      prevBtn.textContent = '◀';
      prevBtn.disabled = miscTabPage === 1;
      prevBtn.addEventListener('click', () => {
        if (miscTabPage > 1) {
          window.awbw_music_player?.playUiMenuOpen?.();
          miscTabPage--;
          renderTabContent('misc');
        }
      });
      pagination.appendChild(prevBtn);

      const indicator = document.createElement('span');
      indicator.className = 'awbw-hotkeys-pagination-indicator';
      indicator.textContent = `${miscTabPage} / ${getMiscTabTotalPages()}`;
      pagination.appendChild(indicator);

      const nextBtn = document.createElement('button');
      nextBtn.className = 'awbw-hotkeys-pagination-btn';
      nextBtn.textContent = '▶';
      nextBtn.disabled = miscTabPage === getMiscTabTotalPages();
      nextBtn.addEventListener('click', () => {
        if (miscTabPage < getMiscTabTotalPages()) {
          window.awbw_music_player?.playUiMenuOpen?.();
          miscTabPage++;
          renderTabContent('misc');
        }
      });
      pagination.appendChild(nextBtn);

      content.appendChild(pagination);
    }
  }

  function renderSettingsTab(content) {
    // Create scrollable container for settings
    const rowsContainer = document.createElement('div');
    rowsContainer.className = 'awbw-hotkeys-rows-container';
    content.appendChild(rowsContainer);

    // Script Hotkeys section
    const scriptHeader = document.createElement('h3');
    scriptHeader.className = 'awbw-hotkeys-section-header';
    scriptHeader.textContent = 'Script Hotkeys';
    rowsContainer.appendChild(scriptHeader);

    // Open Hotkey Configuration hotkey row
    const row = document.createElement('div');
    row.className = 'awbw-hotkeys-row';

    const label = document.createElement('span');
    label.className = 'awbw-hotkeys-label';
    label.textContent = 'Open Hotkey Configuration';
    row.appendChild(label);

    const button = document.createElement('button');
    button.className = 'awbw-hotkeys-button';
    button.dataset.action = 'openConfig';
    button.dataset.tab = 'settings';
    updateButtonDisplay(button, config.currentSettings.hotkeys.openConfig);

    button.addEventListener('click', () => startRebinding('openConfig', 'settings', button));
    button.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      clearBinding('openConfig', button);
    });

    row.appendChild(button);
    rowsContainer.appendChild(row);

    // Game Settings section
    const header = document.createElement('h3');
    header.className = 'awbw-hotkeys-section-header';
    header.textContent = 'Game Settings';
    rowsContainer.appendChild(header);

    SETTINGS_OPTIONS.forEach(option => {
      const row = document.createElement('div');
      row.className = 'awbw-hotkeys-setting-row';

      const label = document.createElement('span');
      label.className = 'awbw-hotkeys-setting-label';
      label.textContent = option.label;
      label.setAttribute('data-tooltip', option.description); // Add custom tooltip
      label.style.cursor = 'help'; // Show help cursor on hover
      row.appendChild(label);

      const toggle = document.createElement('label');
      toggle.className = 'awbw-hotkeys-toggle';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = config.currentSettings.settings[option.id];
      checkbox.addEventListener('change', () => {
        window.awbw_music_player?.playUiMenuOpen?.();
        config.currentSettings.settings[option.id] = checkbox.checked;
        saveConfig();
      });

      const slider = document.createElement('span');
      slider.className = 'awbw-hotkeys-toggle-slider';

      toggle.appendChild(checkbox);
      toggle.appendChild(slider);
      row.appendChild(toggle);

      rowsContainer.appendChild(row);
    });

    // Keyboard Layout section
    const layoutHeader = document.createElement('h3');
    layoutHeader.className = 'awbw-hotkeys-section-header';
    layoutHeader.textContent = 'Keyboard Layout';
    rowsContainer.appendChild(layoutHeader);

    const layoutRow = document.createElement('div');
    layoutRow.className = 'awbw-hotkeys-setting-row';

    const layoutLabel = document.createElement('span');
    layoutLabel.className = 'awbw-hotkeys-setting-label';
    layoutLabel.textContent = 'Layout';
    layoutLabel.setAttribute('data-tooltip', 'Your keyboard layout (only affects default hotkey bindings)');
    layoutLabel.style.cursor = 'help';
    layoutRow.appendChild(layoutLabel);

    const layoutSelect = document.createElement('div');
    layoutSelect.className = 'awbw-hotkeys-layout-select';

    const layoutButton = document.createElement('button');
    layoutButton.className = 'awbw-hotkeys-layout-button';
    layoutButton.textContent = config.layout;
    layoutSelect.appendChild(layoutButton);

    const layoutMenu = document.createElement('div');
    layoutMenu.className = 'awbw-hotkeys-layout-menu';

    const qwertyOption = document.createElement('button');
    qwertyOption.className = 'awbw-hotkeys-layout-option';
    qwertyOption.textContent = 'QWERTY';
    qwertyOption.dataset.value = 'QWERTY';
    if (config.layout === 'QWERTY') {
      qwertyOption.classList.add('selected');
    }
    layoutMenu.appendChild(qwertyOption);

    const qwertzOption = document.createElement('button');
    qwertzOption.className = 'awbw-hotkeys-layout-option';
    qwertzOption.textContent = 'QWERTZ';
    qwertzOption.dataset.value = 'QWERTZ';
    if (config.layout === 'QWERTZ') {
      qwertzOption.classList.add('selected');
    }
    layoutMenu.appendChild(qwertzOption);

    layoutSelect.appendChild(layoutMenu);

    // Toggle dropdown menu
    layoutButton.addEventListener('click', (e) => {
      window.awbw_music_player?.playUiMenuOpen?.();
      e.stopPropagation();
      const isOpen = layoutMenu.classList.contains('open');
      if (isOpen) {
        layoutMenu.classList.remove('open');
        layoutButton.classList.remove('open');
      } else {
        layoutMenu.classList.add('open');
        layoutButton.classList.add('open');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!layoutSelect.contains(e.target)) {
        layoutMenu.classList.remove('open');
        layoutButton.classList.remove('open');
      }
    });

    // Handle option selection
    const handleLayoutChange = (newLayout) => {
      if (newLayout !== config.layout) {
        // Close menu
        layoutMenu.classList.remove('open');
        layoutButton.classList.remove('open');

        // Ask if they want to reset hotkeys
        showConfirmDialog(
          `Reset all hotkeys to defaults for ${newLayout} layout?`,
          () => {
            // Yes - reset hotkeys to new layout defaults
            const hotkeys = getPresetHotkeys('Touch Typing', newLayout);
            config.layout = newLayout;
            config.currentSettings.hotkeys = hotkeys;
            saveConfig();
            // Update button text and selected state
            layoutButton.textContent = newLayout;
            qwertyOption.classList.toggle('selected', newLayout === 'QWERTY');
            qwertzOption.classList.toggle('selected', newLayout === 'QWERTZ');
            // Refresh the panel to show updated bindings
            const activeTab = document.querySelector('.awbw-hotkeys-tab.active')?.dataset.tab || 'navigation';
            renderTabContent(activeTab);
          },
          false,
          () => {
            // No - just update layout without resetting hotkeys
            config.layout = newLayout;
            saveConfig();
            // Update button text and selected state
            layoutButton.textContent = newLayout;
            qwertyOption.classList.toggle('selected', newLayout === 'QWERTY');
            qwertzOption.classList.toggle('selected', newLayout === 'QWERTZ');
          }
        );
      } else {
        // Same layout clicked - just close menu
        layoutMenu.classList.remove('open');
        layoutButton.classList.remove('open');
      }
    };

    qwertyOption.addEventListener('click', () => {
      window.awbw_music_player?.playUiMenuOpen?.();
      handleLayoutChange('QWERTY');
    });
    qwertzOption.addEventListener('click', () => {
      window.awbw_music_player?.playUiMenuOpen?.();
      handleLayoutChange('QWERTZ');
    });

    layoutRow.appendChild(layoutSelect);
    rowsContainer.appendChild(layoutRow);

    // Support section
    const supportHeader = document.createElement('h3');
    supportHeader.className = 'awbw-hotkeys-section-header';
    supportHeader.textContent = 'Support';
    rowsContainer.appendChild(supportHeader);

    const supportRow = document.createElement('div');
    supportRow.style.cssText = 'text-align: center; padding: 12px; background: #f5f5f5; border-radius: 4px; overflow: hidden; margin-bottom: 15px;';

    const supportBtn = document.createElement('button');
    supportBtn.className = 'awbw-hotkeys-support-btn';
    supportBtn.textContent = 'Support the Project';
    supportBtn.addEventListener('click', () => {
      window.awbw_music_player?.playUiMenuOpen?.();
      showSupportDialog();
    });

    supportRow.appendChild(supportBtn);
    rowsContainer.appendChild(supportRow);
  }

  function showSupportDialog() {
    // Create overlay to block clicks on main panel
    const overlay = document.createElement('div');
    overlay.id = 'awbw-hotkeys-support-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      z-index: 10001;
    `;
    document.body.appendChild(overlay);

    const supportDialog = document.createElement('div');
    supportDialog.id = 'awbw-hotkeys-support-dialog';
    supportDialog.style.cssText = `
      position: fixed;
      z-index: 10002;
      background: white;
      border: 3px solid #2c5aa0;
      padding: 25px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      font-family: "Nova Square", cursive;
      max-width: 450px;
    `;
    updatePanelCentering(supportDialog);

    supportDialog.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px 0; color: #2c5aa0; text-align: center;">Support the Project</h3>
        <p style="margin: 0 0 15px 0; color: #666; line-height: 1.6;">
          Donations are by no means required, but you can buy me a coffee if you would like to contribute to covering development costs.<br>I have some programming experience, but no experience with JS, CSS, or HTML, which is why I subscribed to a Claude AI Max plan to develop this script.
        </p>
      </div>
      <div style="display: flex; justify-content: center; gap: 10px;">
        <button id="buy-coffee-btn" class="awbw-hotkeys-popup-btn-primary">Buy me a coffee</button>
        <button id="close-support-btn" class="awbw-hotkeys-popup-btn-secondary">Close</button>
      </div>
    `;

    document.body.appendChild(supportDialog);
    updatePanelCentering(supportDialog);

    supportDialog.querySelector('#buy-coffee-btn').addEventListener('click', () => {
      window.open('https://buymeacoffee.com/incinerate', '_blank');
    });
    supportDialog.querySelector('#close-support-btn').addEventListener('click', closeSupportDialog);

    // Keyboard handling
    const handleSupportKeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeSupportDialog();
      }
    };
    document.addEventListener('keydown', handleSupportKeydown, true);

    // Store handler for cleanup
    supportDialog._keydownHandler = handleSupportKeydown;
  }

  function closeSupportDialog() {
    window.awbw_music_player?.playUiMenuClose?.();
    const dialog = document.getElementById('awbw-hotkeys-support-dialog');
    const overlay = document.getElementById('awbw-hotkeys-support-overlay');
    if (dialog?._keydownHandler) {
      document.removeEventListener('keydown', dialog._keydownHandler, true);
    }
    if (dialog) dialog.remove();
    if (overlay) overlay.remove();
  }

  function isSupportDialogOpen() {
    return !!document.getElementById('awbw-hotkeys-support-dialog');
  }

  // ============================================================================
  // Info Dialog (Help, Changelog, About)
  // ============================================================================

  const INFO_CONTENT = {
    help: `
      <h3>Getting Started</h3>
      <p>This script adds customizable keyboard shortcuts for all game actions. Click on any hotkey button to rebind it to a different key. Right-click a button to quickly unbind it.</p>

      <h3>Profiles</h3>
      <p>Use profiles to save, export, and import hotkey configurations. The QWERTY/QWERTZ setting ensures that physical key positions are stored correctly and presets load with the intended layout.</p>

      <h3>Presets</h3>
      <p>I would encourage you to create your own keyboard shortcuts according to your preferences, but I can also recommend the default settings as a starting point. They are optimized for speed and comfort. I would recommend replacing mouse clicks entirely with the "Select Unit/Building" hotkey, as this allows you to select units and buildings with overlapping areas and menus. I also recommend assigning multiple unit commands to a single key. The script supports this, as different commands often cannot appear at the same time (e.g., wait and join), or one action rarely makes sense when another is available (e.g., wait over capture or supply). In this case, a priority system takes effect, giving preference to supply and capture. The order of the unit commands in the menu corresponds to the order of priority. This allows you, for example, to assign supply, capture, and wait to the same key, which should simplify the keybind system.</p>
      <p><strong>Touch Typing:</strong> Designed for a touch-typing hand position on the home row. This places the index finger on F, which is assigned the most frequently used hotkey for selecting units and buildings. The second most frequently used action is the wait and capture commands, which are assigned to the D key, allowing you to press the index and middle fingers alternately. This leaves A for attack and S for the remaining special commands. Some of these commands could also be assigned to D, but the reason for using a different key is to reduce the risk of misclicks. When producing new units, I have set two priorities: 1) The most frequently used units must be quick and easy to access (e.g., F then A for infantry) and 2) there is a logic to make it as easy as possible to remember all units. For example, all ranged units are sorted by cost in the bottom row and all tanks are sorted by cost in the top row.</p>
      <p><strong>WASD:</strong> Same logic shifted one key to the left for a gaming hand position.</p>

      <h3>QoL Features</h3>
      <ul>
        <li><strong>Capture icon fix:</strong> AWBW sometimes leaves capture icons stuck on infantry after completing a capture or moving away. This script automatically cleans them up.</li>
        <li><strong>Transport unload behavior:</strong> Using an Unload hotkey to move a transport will automatically advance to the cargo selection after arrival. The Unload menu no longer opens automatically when using other actions like Wait or Supply. Both Unload hotkeys work identically throughout the process - including selecting the drop tile - only differing when choosing which cargo unit to drop.</li>
        <li><strong>Script compatibility:</strong> Supports the Maximize Script by @Truniht, the Game Chat Script by @new1234, and the Music Player Script by @DeveloperJose.</li>
      </ul>
    `,
    changelog: `
      <div class="version-entry">
        <span class="version-number">v1.2.4</span><span class="version-date">2025/12/16</span>
        <ul>
          <li>Native AWBW hotkeys are now only blocked on the game page</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.2.3</span><span class="version-date">2025/12/16</span>
        <ul>
          <li>Fixed a bug that could cause the select hotkey to stop working until the page was refreshed</li>
          <li>Fixed a bug where using the select hotkey while holding a range hotkey could cause issues with unit selection and deselection</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.2.2</span><span class="version-date">2025/12/15</span>
        <ul>
          <li>Fixed a bug that the info dialog would not center correctly when the Maximize mod was active</li>
          <li>Fixed a bug that auto-repeat suppression did not work for toggle music and open config hotkeys</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.2.1</span><span class="version-date">2025/12/15</span>
        <ul>
          <li>Fixed a bug that site-wide hotkeys (zoom, toggle music, open config) would trigger while typing in input fields</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.2.0</span><span class="version-date">2025/12/15</span>
        <ul>
          <li>Fixed a bug that infantry still sometimes had the capture icon wrongfully displayed</li>
          <li>The range is now displayed with cleaner edges</li>
          <li>The Select Unit/Building hotkey does not cycle through the vision range of the selected unit anymore</li>
          <li>Added compatibility with the Game Chat script by @new1234</li>
          <li>Added a hotkey to toggle the Music Player by @DeveloperJose</li>
          <li>Added an info button that opens a window with an introduction to the script and changelogs</li>
          <li>The zoom, open hotkey configuration, and toggle music hotkeys now work on the whole site</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.1.1</span><span class="version-date">2025/12/12</span>
        <ul>
          <li>Fixed a bug that prevented a unit's range from being displayed when it was selected with the left mouse button</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.1.0</span><span class="version-date">2025/12/12</span>
        <ul>
          <li>Fixed a bug with transport units carrying cargo that caused the range of the cargo unit to be displayed</li>
          <li>Fixed an error message that appeared when an APC with cargo that had not moved yet was sent using the unload hotkey</li>
          <li>New feature: Added an option to show potential movement and attack ranges if there were no units that could block them</li>
          <li>Corrected a mistake in the touch typing preset. The cruiser and submarine were accidentally assigned a key combination</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.0.4</span><span class="version-date">2025/12/07</span>
        <ul>
          <li>Performance improvements</li>
          <li>GUI optimisations for small screens</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.0.3</span><span class="version-date">2025/12/03</span>
        <ul>
          <li>Changed the hotkey "Show Attack Range (All Indirects)" to "Show Attack Range (Unit Type)"</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.0.2</span><span class="version-date">2025/12/01</span>
        <ul>
          <li>Fixed a bug that building menu hotkeys would not be activated if the building was selected with the next/previous unit hotkeys</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.0.1</span><span class="version-date">2025/12/01</span>
        <ul>
          <li>Fixed a bug that the CTRL key got stuck</li>
        </ul>
      </div>
      <div class="version-entry">
        <span class="version-number">v1.0.0</span><span class="version-date">2025/12/01</span>
        <ul>
          <li>Initial release</li>
        </ul>
      </div>
    `,
    about: `
      <h3>AWBW Advanced Hotkeys</h3>
      <p><strong>Version:</strong> 1.2.4</p>
      <p><strong>Author:</strong> Incinerate</p>

      <h3>License</h3>
      <p>MIT License - Free to use and modify</p>

      <h3>Links</h3>
      <p>
        <a href="https://greasyfork.org/scripts/557553" target="_blank">Greasy Fork Page</a>
      </p>
    `
  };

  function showInfoDialog() {
    // Remove existing if any
    closeInfoDialog();

    const overlay = document.createElement('div');
    overlay.className = 'awbw-hotkeys-info-overlay';
    overlay.id = 'awbw-hotkeys-info-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'awbw-hotkeys-info-dialog';
    dialog.id = 'awbw-hotkeys-info-dialog';

    // Header (title only, no X button)
    const header = document.createElement('div');
    header.className = 'awbw-hotkeys-info-header';

    const title = document.createElement('span');
    title.className = 'awbw-hotkeys-info-title';
    title.textContent = 'Help & Info';
    header.appendChild(title);

    dialog.appendChild(header);

    // Tabs
    const tabs = document.createElement('div');
    tabs.className = 'awbw-hotkeys-info-tabs';

    const tabData = [
      { id: 'help', label: 'Help' },
      { id: 'changelog', label: 'Changelog' },
      { id: 'about', label: 'About' }
    ];

    tabData.forEach((tab, index) => {
      const tabBtn = document.createElement('button');
      tabBtn.className = 'awbw-hotkeys-info-tab' + (index === 0 ? ' active' : '');
      tabBtn.textContent = tab.label;
      tabBtn.dataset.tab = tab.id;
      tabBtn.addEventListener('click', () => switchInfoTab(tab.id));
      tabs.appendChild(tabBtn);
    });

    dialog.appendChild(tabs);

    // Content
    const content = document.createElement('div');
    content.className = 'awbw-hotkeys-info-content';
    content.id = 'awbw-hotkeys-info-content';
    content.innerHTML = INFO_CONTENT.help;
    dialog.appendChild(content);

    // Footer with Close button
    const footer = document.createElement('div');
    footer.className = 'awbw-hotkeys-info-footer';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'awbw-hotkeys-close';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', closeInfoDialog);
    footer.appendChild(closeBtn);

    dialog.appendChild(footer);

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    updatePanelCentering(dialog);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeInfoDialog();
      }
    });

    // Close on Escape
    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeInfoDialog();
      }
    };
    document.addEventListener('keydown', keyHandler, true);
    dialog._keydownHandler = keyHandler;
  }

  function switchInfoTab(tabId) {
    const content = document.getElementById('awbw-hotkeys-info-content');
    const tabs = document.querySelectorAll('.awbw-hotkeys-info-tab');

    if (!content || !INFO_CONTENT[tabId]) return;

    // Update active tab
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    // Update content
    content.innerHTML = INFO_CONTENT[tabId];

    window.awbw_music_player?.playUiMenuSwitch?.();
  }

  function closeInfoDialog() {
    const overlay = document.getElementById('awbw-hotkeys-info-overlay');
    const dialog = document.getElementById('awbw-hotkeys-info-dialog');

    if (!overlay && !dialog) return; // Nothing to close

    if (dialog?._keydownHandler) {
      document.removeEventListener('keydown', dialog._keydownHandler, true);
    }
    if (overlay) overlay.remove();
    if (dialog) dialog.remove();

    window.awbw_music_player?.playUiMenuClose?.();
  }

  function isInfoDialogOpen() {
    return !!document.getElementById('awbw-hotkeys-info-dialog');
  }

  // ============================================================================
  // Setup Dialog (First-time users)
  // ============================================================================

  function showSetupDialog(onSetupComplete) {
    let selectedLayout = 'QWERTY';
    let selectedPreset = 'Touch Typing';

    const overlay = document.createElement('div');
    overlay.id = 'awbw-hotkeys-setup-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10001;
    `;
    document.body.appendChild(overlay);

    const dialog = document.createElement('div');
    dialog.id = 'awbw-hotkeys-setup-dialog';
    dialog.style.cssText = `
      position: fixed;
      z-index: 10002;
      background: white;
      border: 3px solid #2c5aa0;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      font-family: "Nova Square", cursive;
      max-width: 400px;
    `;

    const presetNames = Object.keys(DEFAULT_PRESETS);

    dialog.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #2c5aa0; text-align: center;">AWBW Advanced Hotkeys</h3>
        <p style="margin: 0; color: #666; line-height: 1.5; text-align: center; font-size: 13px;">
          Configure your keyboard settings to get started
        </p>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">Keyboard Layout</label>
        <div id="setup-layout-btns" style="display: flex; gap: 10px;">
          <button data-layout="QWERTY" class="setup-option-btn selected" style="flex: 1; padding: 12px; border: 2px solid #2c5aa0; background: #e3ecff; color: #2c5aa0; border-radius: 4px; cursor: pointer; font-weight: bold; font-family: 'Nova Square', cursive;">QWERTY</button>
          <button data-layout="QWERTZ" class="setup-option-btn" style="flex: 1; padding: 12px; border: 2px solid #ccc; background: white; color: #333; border-radius: 4px; cursor: pointer; font-weight: bold; font-family: 'Nova Square', cursive;">QWERTZ</button>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">Hotkey Preset</label>
        <div id="setup-preset-btns" style="display: flex; flex-direction: column; gap: 8px;">
          ${presetNames.map((name, i) => `
            <button data-preset="${name}" class="setup-preset-btn${i === 0 ? ' selected' : ''}" style="padding: 14px; border: 2px solid ${i === 0 ? '#2c5aa0' : '#ccc'}; background: ${i === 0 ? '#e3ecff' : 'white'}; color: ${i === 0 ? '#2c5aa0' : '#333'}; border-radius: 4px; cursor: pointer; font-family: 'Nova Square', cursive; text-align: left; display: flex; flex-direction: column; gap: 2px;">
              <span style="font-weight: bold;">${name}</span>
              <span style="font-size: 11px; color: #666;">${DEFAULT_PRESETS[name].description}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <button id="setup-continue-btn" style="width: 100%; padding: 14px; background: #2c5aa0; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 16px; font-family: 'Nova Square', cursive; transition: all 0.15s ease;">Continue</button>

      <p style="margin: 15px 0 0 0; color: #999; font-size: 11px; text-align: center;">
        You can change these settings anytime<br>via the Hotkeys button in the game menu
      </p>
    `;

    document.body.appendChild(dialog);
    updatePanelCentering(dialog);

    // Layout button handlers
    dialog.querySelectorAll('#setup-layout-btns .setup-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.awbw_music_player?.playUiMenuOpen?.();
        selectedLayout = btn.dataset.layout;
        dialog.querySelectorAll('#setup-layout-btns .setup-option-btn').forEach(b => {
          b.classList.remove('selected');
          b.style.border = '2px solid #ccc';
          b.style.background = 'white';
          b.style.color = '#333';
        });
        btn.classList.add('selected');
        btn.style.border = '2px solid #2c5aa0';
        btn.style.background = '#e3ecff';
        btn.style.color = '#2c5aa0';
      });
    });

    // Preset button handlers
    dialog.querySelectorAll('#setup-preset-btns .setup-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.awbw_music_player?.playUiMenuOpen?.();
        selectedPreset = btn.dataset.preset;
        dialog.querySelectorAll('#setup-preset-btns .setup-preset-btn').forEach(b => {
          b.classList.remove('selected');
          b.style.border = '2px solid #ccc';
          b.style.background = 'white';
          b.style.color = '#333';
        });
        btn.classList.add('selected');
        btn.style.border = '2px solid #2c5aa0';
        btn.style.background = '#e3ecff';
        btn.style.color = '#2c5aa0';
      });
    });

    // Continue button
    const continueBtn = dialog.querySelector('#setup-continue-btn');
    continueBtn.addEventListener('click', () => {
      window.awbw_music_player?.playUiMenuOpen?.();
      closeSetupDialog();
      onSetupComplete(selectedLayout, selectedPreset);
    });
    continueBtn.addEventListener('mouseover', () => {
      continueBtn.style.background = '#1e4080';
    });
    continueBtn.addEventListener('mouseout', () => {
      continueBtn.style.background = '#2c5aa0';
      continueBtn.style.transform = '';
    });
    continueBtn.addEventListener('mousedown', () => {
      continueBtn.style.background = '#16325f';
      continueBtn.style.transform = 'translateY(2px)';
    });
    continueBtn.addEventListener('mouseup', () => {
      continueBtn.style.background = '#1e4080';
      continueBtn.style.transform = '';
    });
  }

  function closeSetupDialog() {
    const dialog = document.getElementById('awbw-hotkeys-setup-dialog');
    const overlay = document.getElementById('awbw-hotkeys-setup-overlay');
    if (dialog) dialog.remove();
    if (overlay) overlay.remove();
  }

  // ============================================================================
  // Profile Management
  // ============================================================================

  let profileMenuOpen = false;

  function toggleProfileMenu() {
    const menu = document.getElementById('awbw-hotkeys-profile-menu');
    const btn = document.getElementById('awbw-hotkeys-profile-btn');
    if (!menu) return;

    profileMenuOpen = !profileMenuOpen;
    if (profileMenuOpen) {
      renderProfileMenu();
      menu.classList.add('open');
      if (btn) btn.classList.add('open');
    } else {
      menu.classList.remove('open');
      if (btn) btn.classList.remove('open');
    }
  }

  function closeProfileMenu() {
    const menu = document.getElementById('awbw-hotkeys-profile-menu');
    const btn = document.getElementById('awbw-hotkeys-profile-btn');
    if (menu) menu.classList.remove('open');
    if (btn) btn.classList.remove('open');
    profileMenuOpen = false;
  }

  function renderProfileMenu() {
    const menu = document.getElementById('awbw-hotkeys-profile-menu');
    if (!menu) return;

    const savedProfiles = Object.keys(config.savedProfiles || {});

    let html = '';

    // Saved profiles section - each profile is a submenu with options
    if (savedProfiles.length > 0) {
      savedProfiles.forEach(name => {
        html += `<div class="awbw-hotkeys-profile-submenu">`;
        html += `<div class="awbw-hotkeys-profile-menu-item has-submenu" data-profile="${name}">${name}</div>`;
        html += `<div class="awbw-hotkeys-profile-submenu-content saved-profile-submenu">`;
        html += `<div class="awbw-hotkeys-profile-menu-item" data-profile-action="load" data-profile-name="${name}">Load</div>`;
        html += `<div class="awbw-hotkeys-profile-menu-item" data-profile-action="rename" data-profile-name="${name}">Rename</div>`;
        html += `<div class="awbw-hotkeys-profile-menu-item" data-profile-action="delete" data-profile-name="${name}">Delete</div>`;
        html += `</div></div>`;
      });
    } else {
      html += `<div class="awbw-hotkeys-profile-menu-item disabled">No saved profiles</div>`;
    }

    html += `<div class="awbw-hotkeys-profile-divider"></div>`;

    // Actions
    html += `<div class="awbw-hotkeys-profile-menu-item" data-action="save">Save profile as...</div>`;

    html += `<div class="awbw-hotkeys-profile-divider"></div>`;

    html += `<div class="awbw-hotkeys-profile-menu-item" data-action="export">Export</div>`;
    html += `<div class="awbw-hotkeys-profile-menu-item" data-action="import">Import</div>`;

    html += `<div class="awbw-hotkeys-profile-divider"></div>`;

    // Load Default Profile submenu
    html += `<div class="awbw-hotkeys-profile-submenu">`;
    html += `<div class="awbw-hotkeys-profile-menu-item has-submenu">Load Default Profile</div>`;
    html += `<div class="awbw-hotkeys-profile-submenu-content">`;
    Object.keys(DEFAULT_PRESETS).forEach(name => {
      const description = DEFAULT_PRESETS[name].description || '';
      html += `<div class="awbw-hotkeys-profile-menu-item" data-preset="${name}" data-tooltip="${description}">${name}</div>`;
    });
    html += `</div></div>`;

    menu.innerHTML = html;

    // Add event listeners for profile actions (load, rename, delete)
    menu.querySelectorAll('.awbw-hotkeys-profile-menu-item[data-profile-action]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        window.awbw_music_player?.playUiMenuOpen?.();
        const action = item.dataset.profileAction;
        const profileName = item.dataset.profileName;
        closeProfileMenu();

        switch (action) {
          case 'load':
            confirmAndLoadProfile(profileName, false);
            break;
          case 'rename':
            showRenameDialog(profileName);
            break;
          case 'delete':
            showConfirmDialog(`Are you sure you want to delete the profile "${profileName}"?`, () => {
              deleteProfile(profileName);
            });
            break;
        }
      });
    });

    menu.querySelectorAll('.awbw-hotkeys-profile-menu-item[data-action]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        window.awbw_music_player?.playUiMenuOpen?.();
        closeProfileMenu();
        handleProfileAction(item.dataset.action);
      });
    });

    menu.querySelectorAll('.awbw-hotkeys-profile-menu-item[data-preset]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        window.awbw_music_player?.playUiMenuOpen?.();
        closeProfileMenu();
        const presetName = item.dataset.preset;
        confirmAndLoadProfile(presetName, true);
      });
    });
  }

  function handleProfileAction(action) {
    switch (action) {
      case 'save':
        showSavePopup();
        break;
      case 'export':
        exportProfile();
        break;
      case 'import':
        importProfile();
        break;
    }
  }

  function confirmAndLoadProfile(name, isPreset) {
    if (hasUnsavedChanges()) {
      showConfirmDialog(
        'You have unsaved changes. Continue anyway?',
        () => {
          if (isPreset) {
            loadDefaultPreset(name);
          } else {
            loadProfile(name);
          }
        }
      );
    } else {
      if (isPreset) {
        loadDefaultPreset(name);
      } else {
        loadProfile(name);
      }
    }
  }

  function loadProfile(name) {
    const profile = config.savedProfiles[name];
    if (!profile) return;

    // Deep clone the profile settings
    config.currentSettings = JSON.parse(JSON.stringify(profile));
    config.lastLoadedProfile = name;
    saveConfig();

    // Refresh UI
    refreshCurrentTab();
  }

  function loadDefaultPreset(name) {
    const hotkeys = getPresetHotkeys(name, config.layout);
    if (!hotkeys) return;

    config.currentSettings.hotkeys = hotkeys;
    config.currentSettings.settings = getPresetSettings(name);
    config.lastLoadedProfile = null; // Presets don't count as "loaded profile"
    saveConfig();

    // Refresh UI
    refreshCurrentTab();
  }

  function refreshCurrentTab() {
    const activeTab = document.querySelector('.awbw-hotkeys-tab.active');
    if (activeTab) {
      const tabId = activeTab.dataset.tab;
      renderTabContent(tabId);
    }
  }

  function showSavePopup() {
    const savedProfiles = Object.keys(config.savedProfiles || {});

    const overlay = document.createElement('div');
    overlay.className = 'awbw-hotkeys-confirm-overlay';
    overlay.id = 'awbw-hotkeys-save-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10004;';

    const popup = document.createElement('div');
    popup.className = 'awbw-hotkeys-confirm-dialog';
    popup.id = 'awbw-hotkeys-save-popup';
    popup.style.cssText = `
      position: fixed;
      z-index: 10005;
      background: white;
      border: 3px solid #2c5aa0;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      font-family: "Nova Square", cursive;
      min-width: 280px;
      max-width: 350px;
    `;

    let html = `<h3 style="margin: 0 0 15px 0; color: #2c5aa0;">Save Profile</h3>`;

    if (savedProfiles.length > 0) {
      html += `<div style="margin-bottom: 15px; color: #666; font-size: 13px;">Save to existing profile:</div>`;
      html += `<div style="margin-bottom: 15px; max-height: 200px; overflow-y: auto;">`;
      savedProfiles.forEach(name => {
        html += `<div class="save-popup-profile" data-profile="${name}" style="padding: 10px; border: 1px solid #ddd; margin-bottom: 5px; border-radius: 4px; cursor: pointer;">${name}</div>`;
      });
      html += `</div>`;
      html += `<div class="awbw-hotkeys-profile-divider" style="height: 1px; background: #e0e0e0; margin: 15px 0;"></div>`;
    }

    html += `
      <div style="margin-bottom: 10px; color: #666; font-size: 13px;">Or create new profile:</div>
      <div style="display: flex; gap: 10px; margin-bottom: 15px;">
        <input type="text" id="save-popup-name" placeholder="Profile name" autocomplete="off" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: 'Nova Square', cursive;">
        <button id="save-popup-new-btn" class="awbw-hotkeys-popup-btn-primary">Save</button>
      </div>
      <button id="save-popup-cancel" class="awbw-hotkeys-popup-btn-secondary" style="width: 100%;">Cancel</button>
    `;

    popup.innerHTML = html;
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    updatePanelCentering(popup);

    // Event listeners
    popup.querySelectorAll('.save-popup-profile').forEach(item => {
      item.addEventListener('mouseover', () => {
        item.style.background = '#f0f0f0';
      });
      item.addEventListener('mouseout', () => {
        item.style.background = 'white';
      });
      item.addEventListener('click', () => {
        const profileName = item.dataset.profile;
        closeSavePopup();
        showConfirmDialog(`Are you sure you want to overwrite the profile "${profileName}"?`, () => {
          saveToProfile(profileName);
        });
      });
    });

    popup.querySelector('#save-popup-new-btn').addEventListener('click', () => {
      const nameInput = popup.querySelector('#save-popup-name');
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.style.borderColor = 'red';
        return;
      }
      if (config.savedProfiles[name]) {
        closeSavePopup();
        showConfirmDialog(`Are you sure you want to overwrite the profile "${name}"?`, () => {
          saveToProfile(name);
        });
        return;
      }
      closeSavePopup();
      saveToProfile(name);
    });

    popup.querySelector('#save-popup-cancel').addEventListener('click', closeSavePopup);
    overlay.addEventListener('click', closeSavePopup);

    // Keyboard handling
    const handleSavePopupKeydown = (e) => {
      // Stop all key events from reaching the main handler
      e.stopPropagation();
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSavePopup();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        popup.querySelector('#save-popup-new-btn').click();
      }
    };
    document.addEventListener('keydown', handleSavePopupKeydown, true);

    // Store handler for cleanup
    popup._keydownHandler = handleSavePopupKeydown;

    // Focus the input
    popup.querySelector('#save-popup-name').focus();
  }

  function closeSavePopup() {
    const popup = document.getElementById('awbw-hotkeys-save-popup');
    const overlay = document.getElementById('awbw-hotkeys-save-overlay');
    if (popup?._keydownHandler) {
      document.removeEventListener('keydown', popup._keydownHandler, true);
    }
    if (popup) popup.remove();
    if (overlay) overlay.remove();
  }

  function isSavePopupOpen() {
    return !!document.getElementById('awbw-hotkeys-save-popup');
  }

  function saveToProfile(name) {
    // Deep clone current settings
    config.savedProfiles[name] = JSON.parse(JSON.stringify(config.currentSettings));
    config.lastLoadedProfile = name;
    saveConfig();
    window.awbw_music_player?.playUiMenuOpen?.();
  }

  function showRenameDialog(oldName) {
    const overlay = document.createElement('div');
    overlay.className = 'awbw-hotkeys-confirm-overlay';
    overlay.id = 'awbw-hotkeys-rename-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10004;';

    const dialog = document.createElement('div');
    dialog.className = 'awbw-hotkeys-confirm-dialog';
    dialog.id = 'awbw-hotkeys-rename-dialog';
    dialog.style.cssText = `
      position: fixed;
      z-index: 10005;
      background: white;
      border: 3px solid #2c5aa0;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      font-family: "Nova Square", cursive;
      min-width: 280px;
    `;

    dialog.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: #2c5aa0;">Rename Profile</h3>
      <input type="text" id="rename-input" value="${oldName}" autocomplete="off" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: 'Nova Square', cursive; box-sizing: border-box; margin-bottom: 15px;">
      <div style="display: flex; gap: 10px;">
        <button id="rename-cancel" class="awbw-hotkeys-popup-btn-secondary" style="flex: 1;">Cancel</button>
        <button id="rename-confirm" class="awbw-hotkeys-popup-btn-primary" style="flex: 1;">Rename</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    updatePanelCentering(dialog);

    const input = dialog.querySelector('#rename-input');
    input.select();

    dialog.querySelector('#rename-confirm').addEventListener('click', () => {
      const newName = input.value.trim();
      if (!newName) {
        input.style.borderColor = 'red';
        return;
      }
      if (newName !== oldName && config.savedProfiles[newName]) {
        input.style.borderColor = 'red';
        return;
      }
      closeRenameDialog();
      renameProfile(oldName, newName);
    });

    dialog.querySelector('#rename-cancel').addEventListener('click', closeRenameDialog);
    overlay.addEventListener('click', closeRenameDialog);

    // Keyboard handling
    const handleRenameKeydown = (e) => {
      // Stop all key events from reaching the main handler
      e.stopPropagation();
      if (e.key === 'Escape') {
        e.preventDefault();
        closeRenameDialog();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        dialog.querySelector('#rename-confirm').click();
      }
    };
    document.addEventListener('keydown', handleRenameKeydown, true);

    // Store handler for cleanup
    dialog._keydownHandler = handleRenameKeydown;
  }

  function closeRenameDialog() {
    const dialog = document.getElementById('awbw-hotkeys-rename-dialog');
    const overlay = document.getElementById('awbw-hotkeys-rename-overlay');
    if (dialog?._keydownHandler) {
      document.removeEventListener('keydown', dialog._keydownHandler, true);
    }
    if (dialog) dialog.remove();
    if (overlay) overlay.remove();
  }

  function isRenameDialogOpen() {
    return !!document.getElementById('awbw-hotkeys-rename-dialog');
  }

  function renameProfile(oldName, newName) {
    if (oldName === newName) return;

    config.savedProfiles[newName] = config.savedProfiles[oldName];
    delete config.savedProfiles[oldName];

    if (config.lastLoadedProfile === oldName) {
      config.lastLoadedProfile = newName;
    }

    saveConfig();
  }

  function deleteProfile(name) {
    delete config.savedProfiles[name];

    if (config.lastLoadedProfile === name) {
      config.lastLoadedProfile = null;
    }

    saveConfig();
  }

  function exportProfile() {
    const data = {
      hotkeys: config.currentSettings.hotkeys,
      settings: config.currentSettings.settings
    };

    // Convert to QWERTY for export if user is QWERTZ
    if (config.layout === 'QWERTZ') {
      data.hotkeys = JSON.parse(JSON.stringify(data.hotkeys));
      convertHotkeysLayout(data.hotkeys);
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'AWBW_Hotkeys_Export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importProfile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);

          if (!data.hotkeys) {
            alert('Invalid profile file');
            return;
          }

          // Check for unsaved changes
          if (hasUnsavedChanges()) {
            showConfirmDialog('You have unsaved changes. Continue anyway?', () => {
              applyImportedProfile(data);
            });
          } else {
            applyImportedProfile(data);
          }
        } catch (err) {
          alert('Failed to read profile file');
        }
      };
      reader.readAsText(file);
    });

    input.click();
  }

  function applyImportedProfile(data) {
    // Convert from QWERTY if user is QWERTZ
    if (config.layout === 'QWERTZ') {
      convertHotkeysLayout(data.hotkeys);
    }

    config.currentSettings.hotkeys = data.hotkeys;
    if (data.settings) {
      config.currentSettings.settings = data.settings;
    }
    config.lastLoadedProfile = null;
    saveConfig();

    refreshCurrentTab();
  }

  // Close profile menu when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('awbw-hotkeys-profile-dropdown');
    if (dropdown && !dropdown.contains(e.target) && profileMenuOpen) {
      closeProfileMenu();
    }
  });

  function updateButtonDisplay(button, binding) {
    const display = formatHotkey(binding);
    button.textContent = display || '';
    button.classList.remove('rebinding');
  }

  // ============================================================================
  // Rebinding Logic
  // ============================================================================

  function startRebinding(actionId, tabId, button) {
    // Cancel any previous rebinding
    cancelRebinding();

    window.awbw_music_player?.playUiMenuOpen?.();

    rebindingAction = actionId;
    rebindingTab = tabId;
    button.classList.add('rebinding');
    button.textContent = '';
  }

  function cancelRebinding() {
    if (!rebindingAction) return;

    window.awbw_music_player?.playUiMenuClose?.();

    clearModifierTimer();
    const button = document.querySelector(`.awbw-hotkeys-button[data-action="${rebindingAction}"]`);
    if (button) {
      updateButtonDisplay(button, config.currentSettings.hotkeys[rebindingAction]);
    }
    rebindingAction = null;
    rebindingTab = null;
    pendingModifier = null;
  }

  function clearModifierTimer() {
    if (modifierTimer) {
      clearTimeout(modifierTimer);
      modifierTimer = null;
    }
  }

  function completeRebinding(newBinding) {
    window.awbw_music_player?.playUiMenuOpen?.();

    const actionId = rebindingAction;
    const tabId = rebindingTab;

    // Check for conflicts in all tabs except Unit and Settings
    const tabsWithConflictCheck = ['navigation', 'misc', 'base', 'airport', 'port'];
    if (tabsWithConflictCheck.includes(tabId)) {
      const conflict = findConflict(newBinding, actionId, tabId);
      if (conflict) {
        showConflictDialog(conflict, newBinding, actionId);
        return;
      }
    }

    applyBinding(actionId, newBinding);
  }

  function applyBinding(actionId, newBinding) {
    config.currentSettings.hotkeys[actionId] = newBinding;
    saveConfig();

    const button = document.querySelector(`.awbw-hotkeys-button[data-action="${actionId}"]`);
    if (button) {
      updateButtonDisplay(button, newBinding);
    }

    rebindingAction = null;
    rebindingTab = null;
    pendingModifier = null;
  }

  function clearBinding(actionId, button) {
    config.currentSettings.hotkeys[actionId] = null;
    saveConfig();
    updateButtonDisplay(button, null);
  }

  function showConfirmDialog(message, onConfirm, isDanger = false, onCancel = null) {
    // Create overlay to block clicks
    const overlay = document.createElement('div');
    overlay.id = 'awbw-hotkeys-confirm-dialog-overlay';
    overlay.className = 'awbw-hotkeys-confirm-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'awbw-hotkeys-confirm-dialog' + (isDanger ? ' danger' : '');

    const messageEl = document.createElement('div');
    messageEl.className = 'awbw-hotkeys-confirm-message';
    messageEl.textContent = message;
    dialog.appendChild(messageEl);

    const buttons = document.createElement('div');
    buttons.className = 'awbw-hotkeys-confirm-buttons';

    const yesBtn = document.createElement('button');
    yesBtn.className = 'awbw-hotkeys-confirm-btn awbw-hotkeys-confirm-yes' + (isDanger ? ' danger' : '');
    yesBtn.textContent = 'Yes';
    yesBtn.addEventListener('click', () => {
      window.awbw_music_player?.playUiMenuOpen?.();
      cleanup();
      onConfirm();
      overlay.remove();
    });
    buttons.appendChild(yesBtn);

    const noBtn = document.createElement('button');
    noBtn.className = 'awbw-hotkeys-confirm-btn awbw-hotkeys-confirm-no';
    noBtn.textContent = 'No';
    noBtn.addEventListener('click', () => {
      window.awbw_music_player?.playUiMenuClose?.();
      cleanup();
      if (onCancel) onCancel();
      overlay.remove();
    });
    buttons.appendChild(noBtn);

    dialog.appendChild(buttons);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Keyboard handling
    const handleConfirmKeydown = (e) => {
      // Stop all key events from reaching the main handler
      e.stopPropagation();
      if (e.key === 'Escape') {
        e.preventDefault();
        noBtn.click();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        yesBtn.click();
      }
    };
    document.addEventListener('keydown', handleConfirmKeydown, true);

    const cleanup = () => {
      document.removeEventListener('keydown', handleConfirmKeydown, true);
    };

    // Focus yes button for visual clarity
    yesBtn.focus();
  }

  function isConfirmDialogOpen() {
    return !!document.getElementById('awbw-hotkeys-confirm-dialog-overlay');
  }

  function closeConfirmDialog() {
    window.awbw_music_player?.playUiMenuClose?.();
    const overlay = document.getElementById('awbw-hotkeys-confirm-dialog-overlay');
    if (overlay) overlay.remove();
  }

  // Actions that are allowed to share the same hotkey (they work on different pages/contexts)
  const ALLOWED_SHARED_HOTKEYS = [
    ['openChat', 'closeChat', 'sendChatMessage'],
    ['openMovementPlanner', 'closeMovementPlanner'],
    ['openReplay', 'closeReplay'],
  ];

  function canShareHotkey(actionId1, actionId2) {
    for (const group of ALLOWED_SHARED_HOTKEYS) {
      if (group.includes(actionId1) && group.includes(actionId2)) {
        return true;
      }
    }
    return false;
  }

  function findConflict(newBinding, currentActionId, tabId) {
    const actions = HOTKEY_ACTIONS[tabId];
    if (!actions) return null;

    for (const action of actions) {
      if (action.id === currentActionId) continue;
      // Skip conflict check for allowed shared hotkey pairs
      if (canShareHotkey(currentActionId, action.id)) continue;
      const existing = config.currentSettings.hotkeys[action.id];
      if (hotkeyEquals(existing, newBinding)) {
        return action;
      }
    }
    return null;
  }

  function showConflictDialog(conflictAction, newBinding, actionId) {
    const overlay = document.createElement('div');
    overlay.className = 'awbw-hotkeys-confirm-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'awbw-hotkeys-confirm-dialog';

    const message = document.createElement('div');
    message.className = 'awbw-hotkeys-confirm-message';
    message.textContent = `"${formatHotkey(newBinding)}" is already bound to "${conflictAction.label}". Overwrite?`;
    dialog.appendChild(message);

    const buttons = document.createElement('div');
    buttons.className = 'awbw-hotkeys-confirm-buttons';

    const yesBtn = document.createElement('button');
    yesBtn.className = 'awbw-hotkeys-confirm-btn awbw-hotkeys-confirm-yes';
    yesBtn.textContent = 'Yes';
    yesBtn.addEventListener('click', () => {
      window.awbw_music_player?.playUiMenuOpen?.();

      // Find all actions that share this hotkey (including shared hotkey groups)
      const actionsToClear = [conflictAction.id];

      // Check if conflicting action is part of a shared hotkey group
      for (const group of ALLOWED_SHARED_HOTKEYS) {
        if (group.includes(conflictAction.id)) {
          // Add all other actions in this group that have the same binding
          for (const groupActionId of group) {
            if (groupActionId !== conflictAction.id &&
                hotkeyEquals(config.currentSettings.hotkeys[groupActionId], newBinding)) {
              actionsToClear.push(groupActionId);
            }
          }
          break;
        }
      }

      // Clear all conflicting bindings
      for (const actionToClear of actionsToClear) {
        config.currentSettings.hotkeys[actionToClear] = null;
        const conflictButton = document.querySelector(`.awbw-hotkeys-button[data-action="${actionToClear}"]`);
        if (conflictButton) {
          updateButtonDisplay(conflictButton, null);
        }
      }

      // Apply new binding
      applyBinding(actionId, newBinding);
      overlay.remove();
    });
    buttons.appendChild(yesBtn);

    const noBtn = document.createElement('button');
    noBtn.className = 'awbw-hotkeys-confirm-btn awbw-hotkeys-confirm-no';
    noBtn.textContent = 'No';
    noBtn.addEventListener('click', () => {
      window.awbw_music_player?.playUiMenuClose?.();
      cancelRebinding();
      overlay.remove();
    });
    buttons.appendChild(noBtn);

    dialog.appendChild(buttons);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  }

  // ============================================================================
  // Panel Visibility
  // ============================================================================

  function showPanel() {
    const panel = document.getElementById('awbw-hotkeys-panel');
    if (panel) {
      window.awbw_music_player?.playUiMenuOpen?.();
      updatePanelCentering(panel);
      panel.style.display = 'flex';
      panelVisible = true;
    }
  }

  function hidePanel() {
    cancelRebinding();
    window.awbw_music_player?.playUiMenuClose?.();
    const panel = document.getElementById('awbw-hotkeys-panel');
    if (panel) {
      panel.style.display = 'none';
      panelVisible = false;
    }
  }

  function togglePanel() {
    if (panelVisible) {
      hidePanel();
    } else {
      showPanel();
    }
  }

  // ============================================================================
  // AWBW Menu Integration
  // ============================================================================

  function setupMenuIntegration() {
    const dropdown = document.getElementById('game-map-menu-dropdown');
    if (!dropdown) return;

    const items = dropdown.querySelectorAll('*');
    for (const item of items) {
      if (item.childNodes.length === 1 &&
          item.childNodes[0].nodeType === Node.TEXT_NODE &&
          item.textContent.trim() === 'Hotkeys') {
        // Remove tooltip
        const tooltip = item.querySelector('.hover-box-text');
        if (tooltip) {
          tooltip.remove();
        }
        // Also check parent for tooltip
        const parentTooltip = item.parentElement?.querySelector('.hover-box-text');
        if (parentTooltip) {
          parentTooltip.remove();
        }

        // Make clickable
        item.style.cursor = 'pointer';
        if (item.parentElement) {
          item.parentElement.style.cursor = 'pointer';
        }

        const clickHandler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropdown.style.display = 'none';
          showPanel();
        };

        item.addEventListener('click', clickHandler);
        if (item.parentElement) {
          item.parentElement.addEventListener('click', clickHandler);
        }

        break;
      }
    }
  }

  // ============================================================================
  // Keyboard Event Handling
  // ============================================================================

  function handleKeyDown(e) {
    const key = e.key.toLowerCase();
    const modifier = e.shiftKey ? 'shift' : e.ctrlKey ? 'ctrl' : e.altKey ? 'alt' : null;

    // Re-enter fullscreen on select hotkeys after returning from chat/planner
    // Must be at the very start before any other processing to preserve user gesture
    if (isGamePage && sessionStorage.getItem('awbw_hotkeys_reenter_fullscreen')) {
      const selectHotkeys = ['select', 'previousUnit', 'nextUnit'];
      for (const hotkeyId of selectHotkeys) {
        const binding = config?.hotkeys?.[hotkeyId];
        if (binding && key === binding.key && modifier === (binding.modifier || null)) {
          tryFullscreenReentry();
          break;
        }
      }
    }

    // Skip all hotkey processing when a dialog with text input is open
    if (isSavePopupOpen() || isRenameDialogOpen()) {
      return;
    }

    // Cancel auto-actions on ANY keypress
    // (user is doing something else while transport was moving)
    // Also activate suppression to block the Unload menu entirely
    if (transportSuppression.autoOpenCargoMenu) {
      transportSuppression.autoOpenCargoMenu = false;
      transportSuppression.active = true; // Suppress the menu when it appears
      // Save currentClick AFTER the keypress is processed (so it has any new selection)
      setTimeout(() => {
        if (window.currentClick) {
          transportSuppression.savedCurrentClick = {
            type: window.currentClick.type,
            info: window.currentClick.info,
            path: window.currentClick.path ? [...window.currentClick.path] : null
          };
        }
      }, 0);
    }

    // Handle rebinding mode
    if (rebindingAction) {
      e.preventDefault();
      e.stopPropagation();

      const isModifier = ['shift', 'control', 'alt'].includes(key);

      // Reject Windows/Meta key (cannot be blocked by browser)
      if (key === 'meta' || e.metaKey) {
        return;
      }

      const button = document.querySelector(`.awbw-hotkeys-button[data-action="${rebindingAction}"]`);

      if (isModifier) {
        // Start waiting for potential combo, show modifier in button
        pendingModifier = key === 'control' ? 'ctrl' : key;
        clearModifierTimer();
        if (button) {
          button.textContent = pendingModifier.toUpperCase();
        }
        // Timer will be handled on keyup
      } else {
        // Regular key pressed
        clearModifierTimer();
        const binding = { key: key };

        // Check if a modifier is held
        if (e.ctrlKey) binding.modifier = 'ctrl';
        else if (e.shiftKey) binding.modifier = 'shift';
        else if (e.altKey) binding.modifier = 'alt';

        // Show the final binding in button before saving
        if (button) {
          button.textContent = formatHotkey(binding);
        }

        completeRebinding(binding);
        pendingModifier = null;
      }
      return;
    }

    // Chat page: sendChatMessage (when typing) takes priority over closeChat
    if (isChatPage) {
      if (!config) return;

      const activeElement = document.activeElement;
      const isTypingInChat = activeElement && (
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement.tagName === 'INPUT' && activeElement.type === 'text')
      );

      if (isTypingInChat) {
        const sendBinding = config.currentSettings.hotkeys.sendChatMessage;
        if (sendBinding && matchesBinding(e, sendBinding)) {
          e.preventDefault();
          e.stopPropagation();
          executeAction('sendChatMessage');
          return;
        }
      }

      const closeBinding = config.currentSettings.hotkeys.closeChat;
      if (closeBinding && matchesBinding(e, closeBinding)) {
        e.preventDefault();
        e.stopPropagation();
        executeAction('closeChat');
      }
      return;
    }

    // Game Chat userscript: handle chat hotkeys when typing in the in-game chat
    const gameChatContainer = document.getElementById('awbw-chat-container');
    if (gameChatContainer && config) {
      const activeElement = document.activeElement;
      const sendContainer = document.getElementById('awbw-send-message-container');
      const isTypingInGameChat = activeElement && sendContainer &&
        sendContainer.contains(activeElement) && (
          activeElement.tagName === 'TEXTAREA' ||
          (activeElement.tagName === 'INPUT' && activeElement.type === 'text')
        );

      if (isTypingInGameChat) {
        // sendChatMessage takes priority when typing
        const sendBinding = config.currentSettings.hotkeys.sendChatMessage;
        if (sendBinding && matchesBinding(e, sendBinding)) {
          e.preventDefault();
          e.stopPropagation();
          executeAction('sendChatMessage');
          return;
        }

        // closeChat also works when typing (to minimize and get back to game)
        const closeBinding = config.currentSettings.hotkeys.closeChat;
        if (closeBinding && matchesBinding(e, closeBinding)) {
          e.preventDefault();
          e.stopPropagation();
          executeAction('closeChat');
          return;
        }

        // Block other hotkeys while typing in game chat
        return;
      }
    }

    // Movement planner page: only closeMovementPlanner works
    if (isMovePlannerPage) {
      if (!config) return;

      const binding = config.currentSettings.hotkeys.closeMovementPlanner;
      if (binding && matchesBinding(e, binding)) {
        e.preventDefault();
        e.stopPropagation();
        executeAction('closeMovementPlanner');
      }
      return;
    }

    // Handle panel toggle (H key) and close (Escape)
    if (panelVisible) {
      if (key === 'escape') {
        e.preventDefault();
        // Priority: confirm dialog > info dialog > support dialog > main panel
        if (isConfirmDialogOpen()) {
          closeConfirmDialog();
        } else if (isInfoDialogOpen()) {
          closeInfoDialog();
        } else if (isSupportDialogOpen()) {
          closeSupportDialog();
        } else {
          hidePanel();
        }
        return;
      }
      // Allow openConfig hotkey to close panel (and support dialog if open)
      if (matchesBinding(e, config.currentSettings.hotkeys.openConfig)) {
        e.preventDefault();
        const isRepeat = pressedKeys.has(key);
        pressedKeys.add(key);
        if (!isRepeat) {
          closeConfirmDialog();
          closeInfoDialog();
          closeSupportDialog();
          hidePanel();
        }
        return;
      }
      // Don't process other hotkeys while panel is open
      return;
    }

    // Site-wide actions (work on any AWBW page, not just game page)
    // These are checked before isGameFocused() so they work everywhere
    // But not when typing in an input field

    const isTypingInInput = document.activeElement && (
      document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA' ||
      document.activeElement.isContentEditable
    );

    // Skip site-wide actions when typing (except they still work via isGameFocused path for game chat)
    if (!isTypingInInput) {
      // openConfig - opens hotkey configuration panel (no repeat)
      if (matchesBinding(e, config.currentSettings.hotkeys.openConfig)) {
        e.preventDefault();
        e.stopPropagation();
        const isRepeat = pressedKeys.has(key);
        pressedKeys.add(key);
        if (!isRepeat) executeAction('openConfig');
        return;
      }

      // toggleMusic - toggle music player if installed (no repeat)
      if (isMusicPlayerInstalled() && matchesBinding(e, config.currentSettings.hotkeys.toggleMusic)) {
        e.preventDefault();
        e.stopPropagation();
        const isRepeat = pressedKeys.has(key);
        pressedKeys.add(key);
        if (!isRepeat) executeAction('toggleMusic');
        return;
      }

      // zoomIn/zoomOut - work on game page and map preview page (allow repeat)
      const isMapPreviewPage = currentUrl.includes('prevmaps.php');
      if (isGamePage || isMapPreviewPage) {
        if (matchesBinding(e, config.currentSettings.hotkeys.zoomIn)) {
          e.preventDefault();
          e.stopPropagation();
          executeAction('zoomIn');
          return;
        }
        if (matchesBinding(e, config.currentSettings.hotkeys.zoomOut)) {
          e.preventDefault();
          e.stopPropagation();
          executeAction('zoomOut');
          return;
        }
      }
    }

    // Only process remaining hotkeys when game is focused
    if (!isGameFocused()) return;

    // Track key press for auto-repeat suppression
    const isRepeat = pressedKeys.has(key);
    pressedKeys.add(key);

    // Block native hotkeys from reaching AWBW's handlers (only on game page)
    if (isGamePage && shouldBlockNativeHotkey(key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    // ========================================
    // PRIORITY-BASED HOTKEY RESOLUTION
    // ========================================

    const gameState = getGameState();

    // Note: openConfig, toggleMusic, and zoom hotkeys are handled earlier (site-wide actions)

    // Priority 1.5: Delete confirmation - if delete screen visible, confirm with delete hotkey
    const deleteScreen = document.querySelector('.delete-screen');
    const deleteScreenVisible = deleteScreen && window.getComputedStyle(deleteScreen).display !== 'none';
    if (deleteScreenVisible) {
      if (matchesBinding(e, config.currentSettings.hotkeys.delete) || matchesBinding(e, config.currentSettings.hotkeys.deleteConfirm)) {
        e.preventDefault();
        e.stopPropagation();
        if (!isRepeat) {
          window.awbw_music_player?.resetMenuState?.();
          window.resetCreatedTiles?.("span[class*='tile'], span[class*='square']");
          const confirmBtn = document.querySelector('.delete-conf-btn');
          if (confirmBtn) confirmBtn.click();
        }
        return;
      }
    }

    // Priority 2: Unit actions (when unit selected)
    if (gameState === GameState.UNIT_SELECTED) {
      const unitAction = findMatchingUnitAction(e);
      if (unitAction) {
        e.preventDefault();
        e.stopPropagation();
        if (!isRepeat) executeUnitAction(unitAction);
        return;
      }
    }

    // Priority 3: Building actions (when building menu open)
    if (gameState === GameState.BUILDING_MENU) {
      const buildAction = findMatchingBuildingAction(e);
      if (buildAction) {
        e.preventDefault();
        e.stopPropagation();
        if (!isRepeat) executeBuildingAction(buildAction);
        return;
      }
    }

    // Priority 4: Always-active navigation actions (select, prev/next unit)
    for (const actionId of ALWAYS_ACTIVE_ACTIONS) {
      if (actionId === 'openConfig') continue; // Already handled above
      const binding = config.currentSettings.hotkeys[actionId];
      if (binding && matchesBinding(e, binding)) {
        e.preventDefault();
        e.stopPropagation();

        if (isRepeat && !isRepeatAllowed(actionId)) return;

        if (actionId === 'select') {
          // Ignore if select was cancelled by a click (wait for key release)
          if (selectClickSuppressed) return;
          selectKeyActive = true;
        }

        executeAction(actionId);
        return;
      }
    }

    // Priority 5: Conditional navigation/misc actions (may be blocked based on settings)
    for (const [actionId, binding] of Object.entries(config.currentSettings.hotkeys)) {
      if (!binding || !matchesBinding(e, binding)) continue;
      if (ALWAYS_ACTIVE_ACTIONS.has(actionId)) continue; // Already handled
      if (CONTEXTUAL_ACTION_IDS.has(actionId)) continue; // Unit/building action - handled in Priority 2/3
      // Skip site-wide actions (handled earlier, before isGameFocused check)
      if (['toggleMusic', 'zoomIn', 'zoomOut'].includes(actionId)) continue;

      // Check if blocked by settings
      if (isGeneralActionBlocked(actionId, gameState)) {
        // For replay navigation actions, don't prevent default when blocked
        // This allows arrow keys to work normally when not in replay mode
        const replayNavigationActions = ['replayFirstTurn', 'replayLatestTurn', 'replayForwardTurn', 'replayBackwardTurn', 'replayForwardAction', 'replayBackwardAction'];
        if (!replayNavigationActions.includes(actionId)) {
          // Blocked - don't execute but still prevent default for non-replay actions
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (isRepeat && !isRepeatAllowed(actionId)) return;

      executeAction(actionId);
      return;
    }
  }

  function handleKeyUp(e) {
    const key = e.key.toLowerCase();

    // Clear from pressed keys tracking
    pressedKeys.delete(key);

    // Check for range key release - only the main key matters, not modifiers
    // Also check rangeClickSuppressed to clear it when key is released after a click cancel
    if (rangeKeyHeld || rangeClickSuppressed) {
      handleRangeKeyUp(key);
    }

    // Check for select key release (view-only unit cleanup)
    // Use state-based tracking to handle modifier+key release order issues
    // Only deselect when the MAIN key is released, not the modifier
    // (e.g., if bound to Shift+F, releasing Shift keeps selection, releasing F clears it)
    if (selectKeyActive || selectClickSuppressed) {
      const binding = config.currentSettings.hotkeys.select;
      if (binding) {
        const bindingKey = binding.key.toLowerCase();
        // Normalize key name (e.key uses 'control', but we store 'ctrl')
        let normalizedKey = key;
        if (key === 'control') normalizedKey = 'ctrl';

        const isMainKey = normalizedKey === bindingKey;

        if (isMainKey) {
          if (selectKeyActive) {
            handleSelectKeyUp();
          }
          selectKeyActive = false;
          selectClickSuppressed = false;
        }
      }
    }

    if (!rebindingAction) return;

    const isModifier = ['shift', 'control', 'alt'].includes(key);

    if (isModifier && pendingModifier) {
      const releasedModifier = key === 'control' ? 'ctrl' : key;
      if (releasedModifier === pendingModifier) {
        // Modifier released without pressing another key = standalone modifier
        e.preventDefault();
        e.stopPropagation();

        const binding = { key: pendingModifier };
        const button = document.querySelector(`.awbw-hotkeys-button[data-action="${rebindingAction}"]`);
        if (button) {
          button.textContent = formatHotkey(binding);
        }

        completeRebinding(binding);
        pendingModifier = null;
      }
    }
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  function init() {
    // On chat or move planner page, only set up minimal hotkey handling
    if (isChatPage || isMovePlannerPage) {
      initSecondaryPageHotkeys();
      return;
    }

    // Load icon cache from localStorage
    loadIconCache();

    // Check if setup is needed
    if (!config) {
      showSetupDialog((selectedLayout, selectedPreset) => {
        const hotkeys = getPresetHotkeys(selectedPreset, selectedLayout);
        const settings = getPresetSettings(selectedPreset);
        config = {
          storageVersion: VERSION,
          layout: selectedLayout,
          currentSettings: {
            hotkeys: hotkeys,
            settings: settings
          },
          savedProfiles: {},
          lastLoadedProfile: null
        };
        saveConfig();
        // Now initialize the rest
        initializeUI();
        // Open the config panel for new users
        showPanel();
      });
      return; // Wait for setup
    }

    initializeUI();
  }

  // Minimal initialization for chat/move planner pages
  // Only specific hotkeys work: sendChatMessage/closeChat on chat, closeMovementPlanner on move planner
  function initSecondaryPageHotkeys() {
    // Load config for hotkey bindings
    config = loadConfig();
    if (!config) {
      // No config yet - hotkeys won't work until user configures from game page
      return;
    }

    // Auto-focus the chat textarea when chat page loads
    // Skip if we just sent a message and hotkeys are shared (so next Enter closes chat)
    if (isChatPage) {
      const justSentMessage = sessionStorage.getItem('awbw_hotkeys_chat_sent');
      sessionStorage.removeItem('awbw_hotkeys_chat_sent');

      if (!justSentMessage) {
        const textarea = document.querySelector('textarea[name="press_text"]');
        if (textarea) {
          textarea.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
  }

  function initializeUI() {
    createStyles();
    createPanel();
    setupMenuIntegration();
    setupRangeDisplay();
    setupUnloadMenuObserver();
    setupBuildMenuFastClose();
    setupMenuHotkeyObserver();

    // Block F11's native browser fullscreen if bound to toggleFullscreen
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F11' || e.key === 'f11') {
        const binding = config?.hotkeys?.toggleFullscreen;
        if (binding?.key === 'f11' && !binding.modifier) {
          e.preventDefault();
        }
      }
    }, true);

    // Sync maximize when exiting fullscreen via F11 (browser handles F11 in fullscreen before JS)
    document.addEventListener('fullscreenchange', () => {
      const binding = config?.hotkeys?.toggleFullscreen;
      if (binding?.key !== 'f11' || binding.modifier) return;
      if (!isMaximizeModInstalled()) return;

      const isFullscreen = !!document.fullscreenElement;
      const isMaximized = isMaximised();

      // Skip if we exited fullscreen ourselves
      if (exitingFullscreenOurselves) {
        exitingFullscreenOurselves = false;
        return;
      }

      // If exited fullscreen but maximize is still on, turn it off
      if (!isFullscreen && isMaximized) {
        const maximizeBtn = document.querySelector('.AWBWMaxmiseButton');
        if (maximizeBtn) maximizeBtn.click();
      }
    });

    // Track mouse position for coordinate calculation (works even over menus)
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Use capture phase to intercept before game's handlers
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

    // Cancel rebinding on any mouse click
    document.addEventListener('mousedown', () => {
      if (rebindingAction) {
        cancelRebinding();
      }
    });

    // Clear state when window loses focus
    window.addEventListener('blur', () => {
      pressedKeys.clear();
      selectKeyActive = false;
      selectClickSuppressed = false;
      lastBuildActionId = null;
      if (viewOnlyUnitSelected || viewOnlyUnitId) {
        resetViewOnlyState();
      }
    });

    // Setup capture icon cleanup
    if (isGamePage) {
      setupCaptureIconCleanup();
    }
  }

  // ============================================================================
  // Capture Icon Cleanup (AWBW bug fix)
  // ============================================================================
  // AWBW sometimes leaves capture icons stuck on infantry/mechs after finishing
  // a capture or moving away. This happens because the removal code uses
  // .unit-licon selector which can match the wrong icon (load, dive icons use
  // same class). We fix this by listening for capture/move actions via WebSocket.

  function cleanupCaptureIconAt(x, y) {
    const unit = typeof unitMap !== 'undefined' && unitMap[x] && unitMap[x][y];
    if (!unit) return;
    cleanupCaptureIconForUnit(unit.units_id);
  }

  function cleanupCaptureIconForUnit(unitId) {
    const unitSpan = document.querySelector(`span[data-unit-id="${unitId}"]`);
    if (!unitSpan) return;

    // Check if unit is actually still capturing something
    const unit = typeof unitsInfo !== 'undefined' && unitsInfo[unitId];
    if (unit) {
      const x = unit.units_x;
      const y = unit.units_y;
      const building = typeof buildingsInfo !== 'undefined' &&
                       buildingsInfo[x] && buildingsInfo[x][y];

      // If unit is on a building being captured (HP < 20), keep the icon
      if (building && building.buildings_capture < 20) {
        return;
      }
    }

    // Try to find capture icon - check both specific src and general unit-licon
    let captureIcon = unitSpan.querySelector('img.unit-licon[src*="capture"]');

    // Fallback: check if there's a unit-licon that looks like a capture icon (capt)
    if (!captureIcon) {
      captureIcon = unitSpan.querySelector('img.unit-licon[src*="capt"]');
    }

    if (captureIcon) {
      captureIcon.remove();
    }
  }

  function setupCaptureIconCleanup() {
    // AWBW stores the WebSocket in global variable 'webSocket'
    // We add our own message listener (doesn't interfere with onmessage)
    function attachToWebSocket(socket) {
      socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);

          // Check if this message contains a capture completion
          if (data.Capt) {
            const buildingInfo = data.Capt.buildingInfo;
            const captureHP = buildingInfo?.buildings_capture;

            // Capture is complete when HP is 20 (1-19 means still being captured)
            if (captureHP === 20) {
              const x = buildingInfo.buildings_x;
              const y = buildingInfo.buildings_y;

              // Calculate base delay based on movement path
              let baseDelay = 300;
              if (data.Move && data.Move.path) {
                const pathLength = data.Move.path.length;
                const speed = typeof movementSpeed !== 'undefined' ? movementSpeed : 50;
                baseDelay = (pathLength * speed) + 300;
              }

              // Run cleanup multiple times to ensure icon is removed
              setTimeout(() => cleanupCaptureIconAt(x, y), baseDelay);
              setTimeout(() => cleanupCaptureIconAt(x, y), baseDelay + 500);
              setTimeout(() => cleanupCaptureIconAt(x, y), baseDelay + 1000);
            }
          }

          // Check if this is a Move action (unit might be moving away from a capture)
          if (data.Move && !data.Capt) {
            const moveData = data.Move;
            const path = moveData.path;
            const unitId = moveData.unit?.units_id;

            if (path && path.length >= 2 && unitId) {
              // Only Infantry and Mech can capture, so only they can have stuck capture icons
              const unit = typeof unitsInfo !== 'undefined' && unitsInfo[unitId];
              if (unit && (unit.units_name === 'Infantry' || unit.units_name === 'Mech')) {
                // Calculate base delay based on movement path
                const pathLength = path.length;
                const speed = typeof movementSpeed !== 'undefined' ? movementSpeed : 50;
                const baseDelay = (pathLength * speed) + 300;

                // Run cleanup multiple times to ensure icon is removed
                setTimeout(() => cleanupCaptureIconForUnit(unitId), baseDelay);
                setTimeout(() => cleanupCaptureIconForUnit(unitId), baseDelay + 500);
                setTimeout(() => cleanupCaptureIconForUnit(unitId), baseDelay + 1000);
              }
            }
          }
        } catch (e) {
          // Not JSON or parse error, ignore
        }
      });
    }

    // Check if webSocket exists and is open
    if (typeof webSocket !== 'undefined' && webSocket) {
      if (webSocket.readyState === WebSocket.OPEN) {
        attachToWebSocket(webSocket);
      } else {
        // Wait for it to open
        webSocket.addEventListener('open', () => {
          attachToWebSocket(webSocket);
        });
      }
    } else {
      // Retry after a delay (script might have loaded before AWBW created the socket)
      setTimeout(() => {
        if (typeof webSocket !== 'undefined' && webSocket) {
          attachToWebSocket(webSocket);
        }
      }, 1000);
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();