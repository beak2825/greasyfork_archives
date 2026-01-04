// ==UserScript==
// @name         [战斗模拟器]配装导入
// @version      1.2
// @description  配装导入
// @author       GPT-DiamondMoo
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://test.milkywayidlecn.com/*
// @match        https://shykai.github.io/MWICombatSimulatorTest/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/556755/%5B%E6%88%98%E6%96%97%E6%A8%A1%E6%8B%9F%E5%99%A8%5D%E9%85%8D%E8%A3%85%E5%AF%BC%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/556755/%5B%E6%88%98%E6%96%97%E6%A8%A1%E6%8B%9F%E5%99%A8%5D%E9%85%8D%E8%A3%85%E5%AF%BC%E5%85%A5.meta.js
// ==/UserScript==

const STORAGE_KEY = "mwi_combat_loadouts_v1";
const IMPORT_REQUEST_KEY = "mwi_import_request";
const UI_POS_GAME = "mwi_ui_pos_game_v1";
const UI_POS_SIM  = "mwi_ui_pos_sim_v1";
const UI_POS_LAST_GAME = "mwi_ui_last_pos_game_v1";
const UI_POS_LAST_SIM = "mwi_ui_last_pos_sim_v1";
const KEY_LAST_ACTIVE_CHAR = "mwi_last_active_char";
const KEY_FIRST_OPEN = "mwi_first_open";
const KEY_SIM_PANEL_OPEN = "mwi_sim_panel_open";
const KEY_SETTINGS = "mwi_settings_v1";
const HOST = location.hostname;
const IS_SIM = HOST.includes("shykai.github.io");
const IS_MILKY = HOST.includes("milkywayidle");
const IS_TEST = HOST.includes("test.milkywayidle");
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
let currentScale = 1.0;
let panelPositionLock = { horizontal: "right", vertical: "bottom" };

function safeJSONParse(s, f=null){ try { return JSON.parse(s); } catch { return f } }
function nowTs(){ return Date.now(); }

const DEFAULT_SETTINGS = {
  READ_ONLY_IRONCOW: false,
  BLOCK_TEST_SERVERS: true,
  ENABLE_AUTO_READ_ON_ENTER: true,
  SIM_SCALE: 1.0,
  MWI_SCALE: 1.0,
  SIM_THEME: "follow",
  GAME_THEME: "dark"
};

GM_addStyle(`
.mwi-ui { box-sizing: border-box; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto; user-select: none !important; }
#mwi-floating-btn, #mwi-panel, #mwi-panel * { -webkit-user-select:none !important; -moz-user-select:none !important; user-select:none !important; }
#mwi-floating-btn{position:fixed;left:12px;top:25%;z-index:2147483647;width:44px;height:33px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:grab;transition:box-shadow .18s,transform .12s;font-weight:700}
#mwi-floating-btn.round{border-radius:50%}
#mwi-panel{position:fixed;left:60px;top:24%;width:360px;max-height:560px;overflow:auto;z-index:2147483646;border-radius:12px;padding:12px;display:none;flex-direction:column;gap:8px;box-shadow:0 18px 38px rgba(0,0,0,0.25);border:1px solid var(--mwi-panel-border);font-size:14px}
.mwi-row{display:flex;flex-wrap:wrap;gap:8px}
.mwi-title { font-size: 16px !important; }
.mwi-section-label { font-size: 12px !important; }
.mwi-btn-text { font-size: 14px !important; }
.mwi-small-muted{font-size:12px !important;color:var(--mwi-muted,#888)}
.mwi-slot-btn{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .12s;border:1px solid var(--mwi-btn-border);font-size:14px !important;}
.mwi-item-btn{height:32px;min-width:110px;border-radius:8px;padding:0 8px;display:flex;align-items:center;justify-content:center;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:all .12s;border:1px solid var(--mwi-btn-border);font-size:14px !important;}
.mwi-delete-btn{margin-left:6px;color:var(--mwi-danger,#ff6b6b);cursor:pointer;font-weight:700;font-size:14px !important;}
.mwi-active{box-shadow:0 6px 12px rgba(0,0,0,0.12);}
.mwi-item-btn:hover, .mwi-slot-btn:hover { transform:translateY(-2px); box-shadow:0 6px 12px rgba(0,0,0,0.08); }
.mwi-item-btn.selected{border-color:var(--mwi-accent,#69a8ff); background:var(--mwi-selected-bg,#e0efff); color:var(--mwi-selected-color,#111);}
.mwi-slot-btn.selected{border-color:var(--mwi-accent,#69a8ff); background:var(--mwi-selected-bg,#e0efff); color:var(--mwi-selected-color,#111);}
#mwi-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:12%;padding:8px 12px;border-radius:8px;background:rgba(0,0,0,0.75);color:#fff;opacity:0;transition:opacity .25s;font-size:13px;pointer-events:none;z-index:2147483648}
:root.mwi-theme-light {
  --mwi-bg: #ffffff;
  --mwi-fg:#111;
  --mwi-muted:#666;
  --mwi-selected-bg:#fff4d2;
  --mwi-selected-color:#111;
  --mwi-accent:#ffca7a;
  --mwi-danger:#c0392b;
  --mwi-panel-border:rgba(0,0,0,0.06);
  --mwi-floating-bg: linear-gradient(180deg,#f5f5f7,#e8eaed);
  --mwi-floating-border: rgba(0,0,0,0.08);
  --mwi-btn-border: rgba(0,0,0,0.1);
}
:root.mwi-theme-light #mwi-panel, :root.mwi-theme-light #mwi-settings-modal { background:var(--mwi-bg); color:var(--mwi-fg); border-color: var(--mwi-panel-border); }
:root.mwi-theme-light #mwi-floating-btn { background: var(--mwi-floating-bg); color:var(--mwi-fg); border:1px solid var(--mwi-floating-border); }
:root.mwi-theme-dark {
  --mwi-bg:#212121;
  --mwi-fg:#e8f0e8;
  --mwi-muted:#9aa79a;
  --mwi-selected-bg:#274a3a;
  --mwi-selected-color:#e6f6e8;
  --mwi-accent:#3f7f5f;
  --mwi-danger:#ff6b6b;
  --mwi-panel-border:rgba(255,255,255,0.1);
  --mwi-floating-bg: linear-gradient(180deg,#333333,#212121);
  --mwi-floating-border: rgba(255,255,255,0.1);
  --mwi-btn-border: rgba(255,255,255,0.15);
}
:root.mwi-theme-dark #mwi-panel, :root.mwi-theme-dark #mwi-settings-modal { background:var(--mwi-bg); color:var(--mwi-fg); border-color: var(--mwi-panel-border); }
:root.mwi-theme-dark #mwi-floating-btn { background: var(--mwi-floating-bg); color:var(--mwi-fg); border:1px solid var(--mwi-floating-border); }
:root.mwi-sim-scale #mwi-panel{transform-origin:top left}
:root.mwi-sim-scale #mwi-floating-btn{transform-origin:top left}
#mwi-settings-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483650;width:520px;max-width:95%;background:#fff;border-radius:12px;padding:16px;box-shadow:0 22px 54px rgba(0,0,0,0.6);display:none;color:#111;transition:transform .2s ease;}
#mwi-settings-modal.dark{background:var(--mwi-bg);color:var(--mwi-fg);border:1px solid var(--mwi-panel-border);}
#mwi-settings-modal h3{margin:0 0 8px 0;font-size:16px !important;}
#mwi-settings-list{display:flex;flex-direction:column;gap:8px}
.mwi-settings-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px;border-radius:8px}
.mwi-settings-row label{flex:1;font-size:14px !important;}
.mwi-settings-controls{min-width:220px;display:flex;gap:8px;align-items:center}
#s_mwi_settings_close{position:absolute;right:8px;top:8px;cursor:pointer;font-size:14px !important;z-index:2147483651;}
#s_mwi_settings_btn{position:absolute;right:8px;bottom:8px;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:1px solid var(--mwi-btn-border);background:rgba(255,255,255,0.06);color:inherit}
#mwi-refresh-btn {
  background: var(--mwi-bg) !important;
  color: var(--mwi-fg) !important;
  border: 1px solid var(--mwi-btn-border) !important;
  min-width: 70px !important;
  height: 26px !important;
  border-radius: 8px !important;
  transition: all .12s !important;
  font-size: 14px !important;
}
#mwi-refresh-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08) !important;
}
#mwi-refresh-btn:disabled {
  opacity: 0.7 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}
`);

async function getSettings(){
  const raw = await GM_getValue(KEY_SETTINGS, null);
  if(!raw){ await GM_setValue(KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS)); return Object.assign({}, DEFAULT_SETTINGS); }
  const parsed = safeJSONParse(raw, {});
  return Object.assign({}, DEFAULT_SETTINGS, parsed);
}

async function saveSettings(obj){
  await GM_setValue(KEY_SETTINGS, JSON.stringify(obj));
  await GM_setValue(KEY_SETTINGS + "_ts", Date.now());
}

async function saveAllData(o){ await GM_setValue(STORAGE_KEY, JSON.stringify(o)); }
async function loadAllData(){ return safeJSONParse(await GM_getValue(STORAGE_KEY, "{}"), {}); }

function readGameStateFromPage(){
  try{
    const el = document.querySelector('[class^="GamePage"]');
    if(!el) return null;
    const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    const fiber = el?.[fiberKey];
    if(!fiber) return null;
    const stateNode = fiber.return?.stateNode || fiber?.return?.stateNode;
    if(!stateNode) return null;
    return stateNode.state || stateNode.props?.state || stateNode;
  }catch{return null}
}

function parseEquipmentFromWearableMap(map){
  const out = [];
  if(!map) return out;
  for(const loc of Object.keys(map)){
    const raw = map[loc];
    if(!raw) continue;
    const parts = String(raw).split("::");
    let itemHrid = parts.find(p => typeof p === "string" && p.startsWith("/items/")) || "";
    let enh = 0;
    const last = parts[parts.length - 1];
    if(/^\d+$/.test(last)) enh = Number(last);
    out.push({ itemLocationHrid: loc, itemHrid: itemHrid, enhancementLevel: enh });
  }
  return out;
}

function parseFoodAndDrinks(loadout){
  const foods = (loadout.foodItemHrids || []).filter(Boolean);
  const drinks = (loadout.drinkItemHrids || []).filter(Boolean);
  const f=[]; const d=[];
  for(let i=0;i<3;i++){ f.push({itemHrid:foods[i]||""}); d.push({itemHrid:drinks[i]||""}); }
  return { food: { "/action_types/combat": f }, drinks: { "/action_types/combat": d } };
}

function parseAbilitiesFromMap(abilityMap, abilityLevelMap){
  const plain={};
  try{ if(abilityLevelMap?.get) for(const [k,v] of abilityLevelMap.entries()) plain[k]=v; else Object.assign(plain, abilityLevelMap||{}); }catch{}
  const keys = Object.keys(abilityMap||{}).sort((a,b)=>Number(a)-Number(b));
  const out=[];
  for(const k of keys){
    const hrid=abilityMap[k]||""; let level="1";
    if(hrid && plain[hrid] && Number.isFinite(Number(plain[hrid].level))) level=String(plain[hrid].level);
    out.push({abilityHrid:hrid, level});
  }
  while(out.length<5) out.push({abilityHrid:"", level:"1"});
  return out.slice(0,5);
}

function parseCombatLevels(skillMap){
  const get=hrid=>{ try{ if(!skillMap) return 1; if(skillMap.get) return Number(skillMap.get(hrid)?.level||1); if(skillMap[hrid]) return Number(skillMap[hrid].level||1);}catch{} return 1; };
  return {
    attackLevel:get("/skills/attack"),
    magicLevel:get("/skills/magic"),
    meleeLevel:get("/skills/melee"),
    rangedLevel:get("/skills/ranged"),
    defenseLevel:get("/skills/defense"),
    staminaLevel:get("/skills/stamina"),
    intelligenceLevel:get("/skills/intelligence")
  };
}

function parseHouseRooms(dict){ const out={}; if(!dict) return out; for(const k of Object.keys(dict)) out[k]=dict[k].level||0; return out; }

function convertStateToLoadoutJson(state, characterID, loadout){
  const equipment = parseEquipmentFromWearableMap(loadout.wearableMap || {});
  const { food, drinks } = parseFoodAndDrinks(loadout);
  const abilities = parseAbilitiesFromMap(loadout.abilityMap || {}, state.characterAbilityMap || {});
  const triggerMap = Object.assign({}, state.abilityCombatTriggersDict || {}, state.consumableCombatTriggersDict || {});
  const zone = state.zone || loadout.zone || "/actions/combat/fly";
  const simulationTime = String(loadout.simulationTime || state.simulationTime || 24);
  const houseRooms = parseHouseRooms(state.characterHouseRoomDict || {});
  const combatLevels = parseCombatLevels(state.characterSkillMap || {});
  const charMeta = state.character || {};
  return {
    player: { ...combatLevels, equipment },
    food,
    drinks,
    abilities,
    triggerMap,
    zone,
    simulationTime,
    houseRooms,
    characterName: charMeta.name || `Player ${characterID.slice(-1)}`
  };
}

function mergeTriggerMaps(existingMap, newMap){
  if(!existingMap) return { ...newMap };
  if(!newMap) return { ...existingMap };

  const merged = { ...existingMap };
  Object.keys(newMap).forEach(key => {
    merged[key] = newMap[key];
  });
  return merged;
}

async function readAndSaveCurrentPageConfig(){
  const settings = await getSettings();
  if(IS_TEST && settings.BLOCK_TEST_SERVERS) return null;
  const state = readGameStateFromPage();
  if(!state || !state.character) return null;
  const c = state.character;
  if(settings.READ_ONLY_IRONCOW && c.gameMode !== "ironcow") return null;
  const all = await loadAllData();
  const charId = String(c.id);
  const store = all[charId] || { characterMeta: {}, loadouts: {}, triggerMap: {}, lastSavedAt: null };
  store.characterMeta = { id: c.id, name: c.name, gameMode: c.gameMode, createdAt: c.createdAt };
  const loadouts = state.characterLoadoutDict || {};

  let pageTriggerMap = {};
  for(const lid of Object.keys(loadouts)){
    const l = loadouts[lid]; if(!l) continue;
    if(l.actionTypeHrid !== "/action_types/combat") continue;
    const parsed = convertStateToLoadoutJson(state, charId, l);
    store.loadouts[l.id] = { id: l.id, name: l.name, data: parsed };
    pageTriggerMap = mergeTriggerMaps(pageTriggerMap, parsed.triggerMap);
  }

  store.triggerMap = mergeTriggerMaps(store.triggerMap, pageTriggerMap);
  store.lastSavedAt = new Date().toISOString();
  all[charId] = store;
  await saveAllData(all);
  await GM_setValue(KEY_LAST_ACTIVE_CHAR, charId);
  return store;
}

function convertLoadoutToImportFormat(loadoutData, characterTriggerMap){
  const mergedTriggers = mergeTriggerMaps(characterTriggerMap, loadoutData.triggerMap);
  return {
    ...loadoutData,
    triggerMap: mergedTriggers
  };
}

GM_addValueChangeListener(IMPORT_REQUEST_KEY, (_,__, newVal) => {
  if(!newVal) return;
  try{
    const req = safeJSONParse(newVal, null);
    if(!req || !req.payload) return;
    const payload = req.payload;
    const slot = req.slot || 1;
    const input = document.querySelector(`#inputSetGroupCombatplayer${slot}`);
    if(input){
      input.value = payload;
      input.dispatchEvent(new Event("input",{bubbles:true}));
      input.dispatchEvent(new Event("change",{bubbles:true}));
      setTimeout(()=>$("#buttonImportSet")?.click(),150);
    } else {
      const all = $("#inputSetGroupCombatAll");
      if(all){
        all.value = payload;
        all.dispatchEvent(new Event("input",{bubbles:true}));
        all.dispatchEvent(new Event("change",{bubbles:true}));
        setTimeout(()=>$("#buttonImportSet")?.click(),150);
      }
    }
    if(payload && slot >=1 && slot <=5){
      const charData = safeJSONParse(payload, {});
      const charName = charData.characterName || `Player ${slot}`;
      const tabLink = $(`#player${slot}-tab`);
      if(tabLink) tabLink.innerText = charName;
    }
  }catch(e){console.error("Import listener error:", e)}
});

async function importLoadoutToSimulator(data, slotNum, characterTriggerMap){
  try{
    const importData = convertLoadoutToImportFormat(data, characterTriggerMap);
    const payload = JSON.stringify(importData || {});
    await GM_setValue(IMPORT_REQUEST_KEY, JSON.stringify({ slot: slotNum, payload, ts: nowTs() }));
    if(IS_SIM){
      const input = document.querySelector(`#inputSetGroupCombatplayer${slotNum}`);
      if(input){
        input.value = payload;
        input.dispatchEvent(new Event("input",{bubbles:true}));
        input.dispatchEvent(new Event("change",{bubbles:true}));
        setTimeout(()=>$("#buttonImportSet")?.click(),150);
      } else {
        const allInput = $("#inputSetGroupCombatAll");
        if(allInput){
          allInput.value = payload;
          allInput.dispatchEvent(new Event("input",{bubbles:true}));
          allInput.dispatchEvent(new Event("change",{bubbles:true}));
          setTimeout(()=>$("#buttonImportSet")?.click(),150);
        }
      }
      if(data?.characterName && slotNum >=1 && slotNum <=5){
        const tabLink = $(`#player${slotNum}-tab`);
        if(tabLink) tabLink.innerText = data.characterName;
      }
    } else {
      try{
        await navigator.clipboard.writeText(payload);
        showToast("已复制配装数据");
      }catch{
        showToast("复制失败，请手动复制");
      }
    }
  }catch(e){
    console.error("Import error:", e);
    showToast("导入失败");
  }
}

function waitForGameReady(timeoutMs = 8000, interval = 300){
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = async () => {
      const st = readGameStateFromPage();
      if(st && st.character && (st.characterLoadoutDict || st.characterLoadoutDict === undefined)) { resolve(st); return; }
      if(Date.now() - start > timeoutMs) { resolve(null); return; }
      setTimeout(tick, interval);
    };
    tick();
  });
}

function constrainBtnToScreen(btn){
  const btnRect = btn.getBoundingClientRect();
  const btnWidth = btnRect.width || 44;
  const btnHeight = btnRect.height || 33;
  const minOffset = 8;
  let newLeft = parseFloat(btn.style.left) || 0;
  let newTop = parseFloat(btn.style.top) || 0;
  newLeft = Math.max(minOffset, Math.min(newLeft, window.innerWidth - btnWidth - minOffset));
  newTop = Math.max(minOffset, Math.min(newTop, window.innerHeight - btnHeight - minOffset));
  btn.style.left = `${newLeft}px`;
  btn.style.top = `${newTop}px`;
}

function positionPanelNearButton(btn, panel){
  const btnRect = btn.getBoundingClientRect();
  panel.style.display = panel.style.display === "flex" ? "flex" : "none";
  const panelW = 360 * currentScale;
  const panelH = 360 * currentScale;
  const minOffset = 8;
  let left, top;
  const rightSpace = window.innerWidth - btnRect.right;
  const leftSpace = btnRect.left;

  if(panelPositionLock.horizontal === "right"){
    if(rightSpace >= panelW + minOffset){
      left = btnRect.right + minOffset;
    } else {
      panelPositionLock.horizontal = "left";
      left = Math.max(minOffset, btnRect.left - panelW - minOffset);
    }
  } else {
    if(leftSpace >= panelW + minOffset){
      left = Math.max(minOffset, btnRect.left - panelW - minOffset);
    } else {
      panelPositionLock.horizontal = "right";
      left = btnRect.right + minOffset;
    }
  }

  const btnCenterY = btnRect.top + btnRect.height / 2;
  const bottomSpace = window.innerHeight - btnRect.bottom;
  const topSpace = btnRect.top;

  if(panelPositionLock.vertical === "bottom"){
    if(bottomSpace >= panelH + minOffset){
      top = btnRect.top;
    } else {
      panelPositionLock.vertical = "top";
      top = btnRect.bottom - panelH;
    }
  } else {
    if(topSpace >= panelH + minOffset){
      top = btnRect.bottom - panelH;
    } else {
      panelPositionLock.vertical = "bottom";
      top = btnRect.top;
    }
  }

  left = Math.max(minOffset, Math.min(left, window.innerWidth - panelW - minOffset));
  top = Math.max(minOffset, Math.min(top, window.innerHeight - panelH - minOffset));
  panel.style.left = `${Math.round(left)}px`;
  panel.style.top = `${Math.round(top)}px`;
}

async function createFloatingUI(){
  if($("#mwi-floating-btn")) return;
  const settings = await getSettings();
  window.__mwi_settings_cache = Object.assign({}, DEFAULT_SETTINGS, settings);
  const btn = document.createElement("div");
  btn.id = "mwi-floating-btn";
  btn.className = "mwi-ui";
  btn.title = "配装";
  btn.innerText = "配装";
  document.body.appendChild(btn);
  const panel = document.createElement("div");
  panel.id = "mwi-panel";
  panel.className = "mwi-ui";
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:8px">
        <h4 class="mwi-title" style="margin:0;">配装导入</h4>
        <div id="mwi-role-last-saved" class="mwi-section-label mwi-small-muted">（未选择）</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <button id="mwi-refresh-btn" class="mwi-item-btn mwi-btn-text" style="min-width:70px;height:26px;padding:0 8px">刷新</button>
      </div>
    </div>
    <div id="mwi-select-label"><div class="mwi-section-label mwi-small-muted">序号</div></div>
    <div class="mwi-row" id="mwi-slot-row"></div>
    <div><div class="mwi-section-label mwi-small-muted">角色</div></div>
    <div class="mwi-row" id="mwi-char-row"></div>
    <div><div class="mwi-section-label mwi-small-muted">配装</div></div>
    <div class="mwi-row" id="mwi-load-row"></div>
  `;
  document.body.appendChild(panel);
  const settingsModal = buildSettingsModal();
  document.body.appendChild(settingsModal.modal);
  const root = document.documentElement;
  const currentSite = IS_SIM ? "sim" : "game";
  const UI_POS_LAST_CURRENT = IS_SIM ? UI_POS_LAST_SIM : UI_POS_LAST_GAME;
  currentScale = IS_SIM ? window.__mwi_settings_cache.SIM_SCALE : window.__mwi_settings_cache.MWI_SCALE;

  function applyGameTheme(theme){
    root.classList.remove("mwi-theme-dark","mwi-theme-light");
    if(theme === "dark") root.classList.add("mwi-theme-dark");
    else if(theme === "light") root.classList.add("mwi-theme-light");
  }

  function applySimTheme(theme){
    root.classList.remove("mwi-theme-dark","mwi-theme-light");
    if(theme === "dark") root.classList.add("mwi-theme-dark");
    else if(theme === "light") root.classList.add("mwi-theme-light");
    else {
      const chk = $("#darkModeToggle");
      if(chk) root.classList.add(chk.checked ? "mwi-theme-dark" : "mwi-theme-light");
    }
  }

  function applyScalesAndTheme(){
    const s = window.__mwi_settings_cache;
    currentScale = IS_SIM ? s.SIM_SCALE : s.MWI_SCALE;
    if(IS_MILKY){
      panel.style.transform = `scale(${currentScale})`;
      panel.style.transformOrigin = "top left";
      btn.style.transform = `scale(${currentScale})`;
      btn.style.transformOrigin = "top left";
      const modal = $("#mwi-settings-modal");
      if(modal) modal.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
      applyGameTheme(s.GAME_THEME);
    } else {
      root.classList.add("mwi-sim-scale");
      panel.style.transform = `scale(${currentScale})`;
      panel.style.transformOrigin = "top left";
      btn.style.transform = `scale(${currentScale})`;
      btn.style.transformOrigin = "top left";
      const modal = $("#mwi-settings-modal");
      if(modal) modal.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
      applySimTheme(s.SIM_THEME);
    }
    panel.style.fontSize = "14px";
    const modal = $("#mwi-settings-modal");
    if(modal){
      modal.classList.toggle("dark", IS_SIM ? s.SIM_THEME === "dark" : s.GAME_THEME === "dark");
    }
    positionPanelNearButton(btn, panel);
  }

  applyScalesAndTheme();

  if(IS_SIM){
    const chk = $("#darkModeToggle");
    if(chk) root.classList.remove("mwi-theme-dark","mwi-theme-light"), root.classList.add(chk.checked ? "mwi-theme-dark" : "mwi-theme-light");
    const obs = new MutationObserver(()=>{
      if(window.__mwi_settings_cache.SIM_THEME === "follow"){
        const c = $("#darkModeToggle");
        if(c) {
          root.classList.remove("mwi-theme-dark","mwi-theme-light");
          root.classList.add(c.checked ? "mwi-theme-dark":"mwi-theme-light");
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  const uiKey = IS_SIM ? UI_POS_SIM : UI_POS_GAME;

  async function loadAndApplySavedBtnPos(){
    const pos = safeJSONParse(await GM_getValue(uiKey, null), null);
    const last = safeJSONParse(await GM_getValue(UI_POS_LAST_CURRENT, null), null);
    if(last && last.ts && (!pos || last.ts >= (pos.ts||0))){
      btn.style.left = last.left;
      btn.style.top = last.top;
      await GM_setValue(uiKey, JSON.stringify(last));
    } else if(pos && pos.left && pos.top){
      btn.style.left = pos.left;
      btn.style.top = pos.top;
    } else {
      btn.style.left = "12px";
      btn.style.top = "25%";
    }
    constrainBtnToScreen(btn);
    positionPanelNearButton(btn, panel);
  }

  await loadAndApplySavedBtnPos();

  let dragging=false, startX=0, startY=0, startLeft=0, startTop=0, moved=false;
  const DRAG_THRESHOLD=6;

  btn.addEventListener("pointerdown", e=>{
    if(e.button!==0) return;
    dragging=true; moved=false;
    startX=e.clientX; startY=e.clientY;
    startLeft=btn.offsetLeft; startTop=btn.offsetTop;
    btn.setPointerCapture && btn.setPointerCapture(e.pointerId);
    btn.style.transition="none";
  });

  document.addEventListener("pointermove", e=>{
    if(!dragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if(!moved && Math.hypot(dx,dy) > DRAG_THRESHOLD) moved=true;
    let newLeft = startLeft + dx;
    let newTop = startTop + dy;
    btn.style.left = `${newLeft}px`;
    btn.style.top = `${newTop}px`;
    constrainBtnToScreen(btn);
    positionPanelNearButton(btn, panel);
  });

  document.addEventListener("pointerup", async e=>{
    if(!dragging) return;
    dragging=false;
    btn.style.transition="all .18s ease";
    btn.releasePointerCapture && btn.releasePointerCapture(e.pointerId);
    constrainBtnToScreen(btn);
    const payload = { left: btn.style.left, top: btn.style.top, ts: nowTs() };
    await GM_setValue(uiKey, JSON.stringify(payload));
    await GM_setValue(UI_POS_LAST_CURRENT, JSON.stringify(payload));
  });

  GM_addValueChangeListener(UI_POS_LAST_CURRENT, async (_,__, newVal) => {
    try{
      const p = safeJSONParse(newVal, null);
      if(!p) return;
      btn.style.left = p.left;
      btn.style.top = p.top;
      constrainBtnToScreen(btn);
      await GM_setValue(uiKey, JSON.stringify(p));
      positionPanelNearButton(btn, panel);
    }catch{}
  });

  const slotRow = $("#mwi-slot-row"), selectLabel = $("#mwi-select-label"), charRow = $("#mwi-char-row"), loadRow = $("#mwi-load-row");
  const roleLastSavedEl = $("#mwi-role-last-saved"), refreshBtn = $("#mwi-refresh-btn");
  let selectedSlot = 1;
  let selectedCharacterId = null;

  function renderSlots(){
    if(!slotRow) return;
    slotRow.innerHTML="";
    for(let i=1;i<=5;i++){
      const b=document.createElement("div");
      b.className="mwi-slot-btn mwi-ui mwi-btn-text";
      b.innerText=String(i);
      if(i===selectedSlot) b.classList.add("selected");
      b.onclick=()=>{
        selectedSlot=i;
        $$(".mwi-slot-btn").forEach(x=>x.classList.remove("selected"));
        b.classList.add("selected");
        renderLoadouts();
      };
      slotRow.appendChild(b);
    }
  }

  async function updateRoleLastSavedDisplay(){
    const all = await loadAllData();
    if(!selectedCharacterId || !all[selectedCharacterId]){
      roleLastSavedEl.innerText="（未选择）";
      return;
    }
    const t = all[selectedCharacterId].lastSavedAt;
    roleLastSavedEl.innerText = t ? `最后同步：${new Date(t).toLocaleString()}` : "（未读取）";
  }

  async function renderCharacters(){
    const all = await loadAllData();
    charRow.innerHTML = "";
    const ids = Object.keys(all);
    if(ids.length === 0){
      charRow.innerHTML = '<div class="mwi-section-label mwi-small-muted">暂无已读取角色</div>';
      roleLastSavedEl.innerText="（未选择）";
      return;
    }
    if(!selectedCharacterId || !all[selectedCharacterId]){
      if(IS_MILKY){
        const st = readGameStateFromPage();
        if(st && st.character) selectedCharacterId = String(st.character.id);
        else selectedCharacterId = ids[0];
      } else {
        const last = await GM_getValue(KEY_LAST_ACTIVE_CHAR, null);
        if(last && all[last]) selectedCharacterId = last;
        else selectedCharacterId = ids[0];
      }
    }
    for(const id of ids){
      const meta = all[id].characterMeta || {};
      const name = meta.name || ("#"+id);
      const wrap = document.createElement("div");
      wrap.style.display="flex"; wrap.style.alignItems="center"; wrap.style.gap="6px";
      const b = document.createElement("div");
      b.className="mwi-item-btn mwi-ui mwi-btn-text";
      if(id===selectedCharacterId) b.classList.add("selected");
      b.innerHTML = `<div style="font-weight:600">${name}</div>`;
      b.onclick = ()=>{
        selectedCharacterId=id;
        $$(".mwi-item-btn").forEach(x=>{
          if(x.parentElement?.querySelector(".mwi-delete-btn")) x.classList.remove("selected");
        });
        b.classList.add("selected");
        renderLoadouts();
        updateRoleLastSavedDisplay();
      };
      const del = document.createElement("div");
      del.className="mwi-delete-btn mwi-btn-text";
      del.innerText="✕";
      del.onclick = async e => {
        e.stopPropagation();
        if(confirm(`确定从本地删除角色 ${name} 吗？`)){
          const all2 = await loadAllData();
          delete all2[id];
          await saveAllData(all2);
          if(id === selectedCharacterId) selectedCharacterId = null;
          renderCharacters();
          renderLoadouts();
          updateRoleLastSavedDisplay();
        }
      };
      wrap.appendChild(b); wrap.appendChild(del); charRow.appendChild(wrap);
    }
    updateRoleLastSavedDisplay();
  }

  async function renderLoadouts(){
    loadRow.innerHTML="";
    if(!selectedCharacterId){
      loadRow.innerHTML = '<div class="mwi-section-label mwi-small-muted">请选择角色</div>';
      return;
    }
    const all = await loadAllData();
    const char = all[selectedCharacterId];
    if(!char || !char.loadouts || Object.keys(char.loadouts).length===0){
      loadRow.innerHTML = '<div class="mwi-section-label mwi-small-muted">该角色暂无配装</div>';
      return;
    }
    const characterTriggerMap = char.triggerMap || {};
    for(const lo of Object.values(char.loadouts)){
      const b = document.createElement("div");
      b.className="mwi-item-btn mwi-ui mwi-btn-text";
      b.innerText = lo.name || ("#"+lo.id);
      b.onclick = async ()=>{
        if(!selectedCharacterId || !selectedSlot) return;
        const charData = all[selectedCharacterId];
        const loadoutData = lo.data;
        if(IS_MILKY){
          try{
            const mergedData = convertLoadoutToImportFormat(loadoutData, characterTriggerMap);
            const payload = JSON.stringify(mergedData || {});
            await navigator.clipboard.writeText(payload);
            showToast(`已复制【${charData.characterMeta.name || "未知角色"}】-【${lo.name || "未知配装"}】`);
          }catch{
            showToast("复制失败，请手动操作");
          }
        } else {
          await importLoadoutToSimulator(loadoutData, selectedSlot, characterTriggerMap);
          showToast(`已导入配装到序号${selectedSlot}`);
        }
        b.classList.add("selected");
        setTimeout(()=>b.classList.remove("selected"),700);
      };
      loadRow.appendChild(b);
    }
  }

  refreshBtn.innerText = "刷新";
  refreshBtn.addEventListener("click", async ()=>{
    refreshBtn.innerText = "读取中...";
    refreshBtn.disabled = true;
    try{
      const currentSelectedCharId = selectedCharacterId;
      await readAndSaveCurrentPageConfig();
      await renderCharacters();
      await renderLoadouts();
        if(currentSelectedCharId){
            const all = await loadAllData();
            if(all[currentSelectedCharId]){
                selectedCharacterId = currentSelectedCharId;
                $$(".mwi-item-btn").forEach(x=>{
                    if(x.parentElement?.querySelector(".mwi-delete-btn")) x.classList.remove("selected");
                });
                const charBtns = $$(".mwi-item-btn");
                charBtns.forEach(btn=>{
                    const charNameEl = btn.querySelector("div");
                    if(!charNameEl) return; 
                    const charName = charNameEl.innerText;
                    const targetChar = all[currentSelectedCharId]?.characterMeta?.name;
                    if(charName === targetChar) btn.classList.add("selected");
                });
            }
        }
      $$(".mwi-slot-btn").forEach(x=>x.classList.remove("selected"));
      $(`.mwi-slot-btn:nth-child(${selectedSlot})`).classList.add("selected");
      showToast("刷新成功");
    }catch(e){
      console.error("Refresh error:", e);
      showToast("刷新失败");
    }
    refreshBtn.disabled=false;
    refreshBtn.innerText="刷新";
  });

  function refreshPanelUI(){
    renderSlots();
    renderCharacters();
    renderLoadouts();
  }

  if(IS_MILKY){
    if(selectLabel) selectLabel.style.display="none";
    if(slotRow) slotRow.style.display="none";
  }

  if(IS_SIM){
    if(refreshBtn) refreshBtn.style.display="none";
    root.classList.add("mwi-sim-scale");
  }

  const toast = document.createElement("div");
  toast.id="mwi-toast";
  document.body.appendChild(toast);
  let toastTimer=null;

  function showToast(t){
    toast.innerText = t;
    toast.style.opacity="1";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>toast.style.opacity="0",1500);
  }

  const firstOpen = await GM_getValue(KEY_FIRST_OPEN, null);
  const simPanelState = await GM_getValue(KEY_SIM_PANEL_OPEN, "closed");

  if(!firstOpen){
    panel.style.display="flex";
    await GM_setValue(KEY_FIRST_OPEN, true);
  }
  else {
    if(IS_SIM) panel.style.display = simPanelState === "open" ? "flex" : "none";
    else panel.style.display = "none";
  }

  if(panel.style.display === "flex"){
    setTimeout(()=>{
      renderCharacters();
      renderLoadouts();
      updateRoleLastSavedDisplay();
      positionPanelNearButton(btn, panel);
    }, 20);
  }

  setTimeout(()=>{
    refreshPanelUI();
    positionPanelNearButton(btn, panel);
  },200);

  btn.addEventListener("click", async e=>{
    if(moved){ moved=false; return; }
    if(panel.style.display === "flex"){
      panel.style.display="none";
      if(IS_SIM) await GM_setValue(KEY_SIM_PANEL_OPEN,"closed");
    }
    else {
      panel.style.display="flex";
      if(IS_MILKY){
        const st = readGameStateFromPage();
        if(st && st.character) selectedCharacterId = String(st.character.id);
      }
      else {
        const last = await GM_getValue(KEY_LAST_ACTIVE_CHAR, null);
        if(last){
          const all = await loadAllData();
          if(all[last]) selectedCharacterId = last;
        }
      }
      refreshPanelUI();
      positionPanelNearButton(btn, panel);
      if(IS_SIM) await GM_setValue(KEY_SIM_PANEL_OPEN,"open");
    }
  });

  const settingsBtn = document.createElement("div");
  settingsBtn.id = "s_mwi_settings_btn";
  settingsBtn.className = "mwi-ui";
  settingsBtn.title = "设置";
  settingsBtn.innerText = "⚙️";
  panel.appendChild(settingsBtn);
  let settingsModalOpen = false;

  settingsBtn.addEventListener("click", async ()=>{
    const modal = $("#mwi-settings-modal");
    if(settingsModalOpen){
      modal.style.display = "none";
      settingsModalOpen = false;
    } else {
      await syncSettingsToModal();
      modal.classList.toggle("dark", IS_SIM ? window.__mwi_settings_cache.SIM_THEME === "dark" : window.__mwi_settings_cache.GAME_THEME === "dark");
      modal.style.display = "block";
      settingsModalOpen = true;
    }
  });

  const closeBtn = document.createElement("div");
  closeBtn.id = "s_mwi_settings_close";
  closeBtn.innerText = "✕";
  closeBtn.style.position = "absolute";
  closeBtn.style.right = "8px";
  closeBtn.style.top = "8px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "14px";
  closeBtn.style.zIndex = "2147483651";
  closeBtn.addEventListener("click", ()=>{
    const modal = $("#mwi-settings-modal");
    modal.style.display = "none";
    settingsModalOpen = false;
  });
  settingsModal.modal.appendChild(closeBtn);

  GM_addValueChangeListener(KEY_SETTINGS, async (name, oldVal, newVal) => {
    try{
      const s = safeJSONParse(newVal, null);
      if(!s) return;
      window.__mwi_settings_cache = Object.assign({}, DEFAULT_SETTINGS, s);
      applyScalesAndTheme();
      await syncSettingsToModal();
    }catch(e){console.error("Settings sync error:", e)}
  });

  GM_addValueChangeListener(KEY_SETTINGS + "_ts", async ()=>{
    try{
      const fresh = await getSettings();
      window.__mwi_settings_cache = Object.assign({}, DEFAULT_SETTINGS, fresh);
      applyScalesAndTheme();
      await syncSettingsToModal();
    }catch(e){console.error("Settings ts sync error:", e)}
  });

  window.__mwi_panel = { refresh: refreshPanelUI, setSelectedSlot: (n)=>{ selectedSlot = n; refreshPanelUI(); } };
}

function buildSettingsModal(){
  const modal = document.createElement("div");
  modal.id = "mwi-settings-modal";
  modal.className = "mwi-ui";
  modal.innerHTML = `
    <h3 class="mwi-title">配装导入 设置</h3>
    <div id="mwi-settings-list"></div>
  `;
  const list = modal.querySelector("#mwi-settings-list");
  const settingsControls = {
    chkReadOnly: null,
    chkBlockTest: null,
    chkAutoRead: null,
    simScaleInput: null,
    simScaleLabel: null,
    mwiScaleInput: null,
    mwiScaleLabel: null,
    simThemeSelect: null,
    gameThemeSelect: null
  };

  (async()=>{
    const s = await getSettings();
    window.__mwi_settings_cache = Object.assign({}, DEFAULT_SETTINGS, s);

    function row(labelHtml, controlEl){
      const r = document.createElement("div");
      r.className="mwi-settings-row";
      const lab = document.createElement("label");
      lab.innerHTML=labelHtml;
      const wrap = document.createElement("div");
      wrap.className="mwi-settings-controls";
      wrap.appendChild(controlEl);
      r.appendChild(lab);
      r.appendChild(wrap);
      return r;
    }

    const chkReadOnly = document.createElement("input");
    chkReadOnly.type="checkbox";
    chkReadOnly.checked = s.READ_ONLY_IRONCOW;
    chkReadOnly.onchange = async ()=>{
      window.__mwi_settings_cache.READ_ONLY_IRONCOW = chkReadOnly.checked;
      await saveSettings(window.__mwi_settings_cache);
    };
    settingsControls.chkReadOnly = chkReadOnly;
    list.appendChild(row("屏蔽标准角色", chkReadOnly));

    const chkBlockTest = document.createElement("input");
    chkBlockTest.type="checkbox";
    chkBlockTest.checked = !!s.BLOCK_TEST_SERVERS;
    chkBlockTest.onchange = async ()=>{
      window.__mwi_settings_cache.BLOCK_TEST_SERVERS = chkBlockTest.checked;
      await saveSettings(window.__mwi_settings_cache);
    };
    settingsControls.chkBlockTest = chkBlockTest;
    list.appendChild(row("屏蔽测试服角色", chkBlockTest));

    const chkAutoRead = document.createElement("input");
    chkAutoRead.type="checkbox";
    chkAutoRead.checked = !!s.ENABLE_AUTO_READ_ON_ENTER;
    chkAutoRead.onchange = async ()=>{
      window.__mwi_settings_cache.ENABLE_AUTO_READ_ON_ENTER = chkAutoRead.checked;
      await saveSettings(window.__mwi_settings_cache);
    };
    settingsControls.chkAutoRead = chkAutoRead;
    list.appendChild(row("进入游戏时读取角色配置", chkAutoRead));

    if(IS_SIM){
      const simScaleInput = document.createElement("input");
      simScaleInput.type="range";
      simScaleInput.min="0.5";
      simScaleInput.max="2";
      simScaleInput.step="0.1";
      simScaleInput.value = s.SIM_SCALE || 1.0;
      const simScaleLabel = document.createElement("div");
      simScaleLabel.innerText = simScaleInput.value + "×";
      simScaleLabel.className = "mwi-btn-text";

      simScaleInput.oninput = async ()=>{
        const newScale = Number(simScaleInput.value);
        simScaleLabel.innerText = newScale + "×";

        window.__mwi_settings_cache.SIM_SCALE = newScale;
        document.querySelector("#mwi-panel")?.style.setProperty("transform", `scale(${newScale})`);
        document.querySelector("#mwi-floating-btn")?.style.setProperty("transform", `scale(${newScale})`);
        const modal = $("#mwi-settings-modal");
        modal?.style.setProperty("transform", `translate(-50%, -50%) scale(${newScale})`);

        currentScale = newScale;
        const btn = document.querySelector("#mwi-floating-btn");
        const panel = document.querySelector("#mwi-panel");
        if(btn && panel) positionPanelNearButton(btn, panel);

        await saveSettings(window.__mwi_settings_cache);
        showToast(`缩放倍率已保存: ${newScale}×`);
      };

      settingsControls.simScaleInput = simScaleInput;
      settingsControls.simScaleLabel = simScaleLabel;
      const simWrap = document.createElement("div");
      simWrap.appendChild(simScaleInput);
      simWrap.appendChild(simScaleLabel);
      list.appendChild(row("战斗模拟器缩放倍率", simWrap));
    } else {
      const mwiScaleInput = document.createElement("input");
      mwiScaleInput.type="range";
      mwiScaleInput.min="0.5";
      mwiScaleInput.max="2";
      mwiScaleInput.step="0.1";
      mwiScaleInput.value = s.MWI_SCALE || 1.0;
      const mwiScaleLabel = document.createElement("div");
      mwiScaleLabel.innerText = mwiScaleInput.value + "×";
      mwiScaleLabel.className = "mwi-btn-text";

      mwiScaleInput.oninput = async ()=>{
        const newScale = Number(mwiScaleInput.value);
        mwiScaleLabel.innerText = newScale + "×";

        window.__mwi_settings_cache.MWI_SCALE = newScale;
        document.querySelector("#mwi-panel")?.style.setProperty("transform", `scale(${newScale})`);
        document.querySelector("#mwi-floating-btn")?.style.setProperty("transform", `scale(${newScale})`);
        const modal = $("#mwi-settings-modal");
        modal?.style.setProperty("transform", `translate(-50%, -50%) scale(${newScale})`);

        currentScale = newScale;
        const btn = document.querySelector("#mwi-floating-btn");
        const panel = document.querySelector("#mwi-panel");
        if(btn && panel) positionPanelNearButton(btn, panel);

        await saveSettings(window.__mwi_settings_cache);
        showToast(`缩放倍率已保存: ${newScale}×`);
      };

      settingsControls.mwiScaleInput = mwiScaleInput;
      settingsControls.mwiScaleLabel = mwiScaleLabel;
      const mwiWrap = document.createElement("div");
      mwiWrap.appendChild(mwiScaleInput);
      mwiWrap.appendChild(mwiScaleLabel);
      list.appendChild(row("MWI缩放倍率", mwiWrap));
    }

    if(IS_SIM){
      const simThemeSelect = document.createElement("select");
      simThemeSelect.className = "mwi-btn-text";
      [["follow","跟随"],["dark","黑暗"],["light","明亮"]].forEach(([v,t])=>{
        const o=document.createElement("option");
        o.value=v;
        o.innerText=t;
        simThemeSelect.appendChild(o);
      });
      simThemeSelect.value = s.SIM_THEME || "follow";
      simThemeSelect.onchange = async ()=>{
        window.__mwi_settings_cache.SIM_THEME = simThemeSelect.value;
        if(simThemeSelect.value==="dark") document.documentElement.classList.add("mwi-theme-dark"), document.documentElement.classList.remove("mwi-theme-light");
        else if(simThemeSelect.value==="light") document.documentElement.classList.add("mwi-theme-light"), document.documentElement.classList.remove("mwi-theme-dark");
        else {
          const chk = $("#darkModeToggle");
          if(chk) document.documentElement.classList.remove("mwi-theme-dark","mwi-theme-light"), document.documentElement.classList.add(chk.checked?"mwi-theme-dark":"mwi-theme-light");
        }
        await saveSettings(window.__mwi_settings_cache);
      };
      settingsControls.simThemeSelect = simThemeSelect;
      list.appendChild(row("战斗模拟器主题", simThemeSelect));
    } else {
      const gameThemeSelect = document.createElement("select");
      gameThemeSelect.className = "mwi-btn-text";
      [["dark","黑暗"],["light","明亮"]].forEach(([v,t])=>{
        const o=document.createElement("option");
        o.value=v;
        o.innerText=t;
        gameThemeSelect.appendChild(o);
      });
      gameThemeSelect.value = s.GAME_THEME || "dark";
      gameThemeSelect.onchange = async ()=>{
        window.__mwi_settings_cache.GAME_THEME = gameThemeSelect.value;
        if(gameThemeSelect.value==="dark") document.documentElement.classList.add("mwi-theme-dark"), document.documentElement.classList.remove("mwi-theme-light");
        else document.documentElement.classList.add("mwi-theme-light"), document.documentElement.classList.remove("mwi-theme-dark");
        await saveSettings(window.__mwi_settings_cache);
      };
      settingsControls.gameThemeSelect = gameThemeSelect;
      list.appendChild(row("MWI页面主题", gameThemeSelect));
    }
  })();

  window.syncSettingsToModal = async function(){
    try{
      const freshSettings = await getSettings();
      window.__mwi_settings_cache = Object.assign({}, DEFAULT_SETTINGS, freshSettings);

      if(settingsControls.chkReadOnly) settingsControls.chkReadOnly.checked = freshSettings.READ_ONLY_IRONCOW;
      if(settingsControls.chkBlockTest) settingsControls.chkBlockTest.checked = !!freshSettings.BLOCK_TEST_SERVERS;
      if(settingsControls.chkAutoRead) settingsControls.chkAutoRead.checked = !!freshSettings.ENABLE_AUTO_READ_ON_ENTER;

      if(IS_SIM && settingsControls.simScaleInput){
        const savedScale = freshSettings.SIM_SCALE || 1.0;
        settingsControls.simScaleInput.value = savedScale;
        if(settingsControls.simScaleLabel) settingsControls.simScaleLabel.innerText = savedScale + "×";
        currentScale = savedScale;
      }

      if(IS_MILKY && settingsControls.mwiScaleInput){
        const savedScale = freshSettings.MWI_SCALE || 1.0;
        settingsControls.mwiScaleInput.value = savedScale;
        if(settingsControls.mwiScaleLabel) settingsControls.mwiScaleLabel.innerText = savedScale + "×";
        currentScale = savedScale;
      }

      if(IS_SIM && settingsControls.simThemeSelect) settingsControls.simThemeSelect.value = freshSettings.SIM_THEME || "follow";
      if(IS_MILKY && settingsControls.gameThemeSelect) settingsControls.gameThemeSelect.value = freshSettings.GAME_THEME || "dark";

      const btn = document.querySelector("#mwi-floating-btn");
      const panel = document.querySelector("#mwi-panel");
      if(btn && panel) positionPanelNearButton(btn, panel);
    }catch(e){console.error("Sync settings to modal error:", e)}
  };

  return { modal };
}

async function main(){
  try{
    const s = await getSettings();
    window.__mwi_settings_cache = Object.assign({}, DEFAULT_SETTINGS, s);
    await createFloatingUI();

    currentScale = IS_SIM ? s.SIM_SCALE : s.MWI_SCALE;

    if(IS_MILKY && window.__mwi_settings_cache.ENABLE_AUTO_READ_ON_ENTER){
      const flag = await GM_getValue("mwi_auto_read_once", null);
      if(!flag){
        await GM_setValue("mwi_auto_read_once", true);
        const st = await waitForGameReady(9000, 300);
        if(st) {
          await readAndSaveCurrentPageConfig();
          window.__mwi_panel?.refresh?.();
        }
      }
    }

    if(IS_SIM){
      const panel = document.querySelector("#mwi-panel");
      if(panel) panel.style.transform = `scale(${currentScale})`;
      const modal = $("#mwi-settings-modal");
      if(modal) modal.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
      if(window.__mwi_settings_cache.SIM_THEME === "follow"){
        const chk = $("#darkModeToggle");
        if(chk){
          document.documentElement.classList.remove("mwi-theme-dark","mwi-theme-light");
          document.documentElement.classList.add(chk.checked ? "mwi-theme-dark" : "mwi-theme-light");
        }
      } else if(window.__mwi_settings_cache.SIM_THEME === "dark"){
        document.documentElement.classList.remove("mwi-theme-light");
        document.documentElement.classList.add("mwi-theme-dark");
      } else {
        document.documentElement.classList.remove("mwi-theme-dark");
        document.documentElement.classList.add("mwi-theme-light");
      }
    } else {
      const panel = document.querySelector("#mwi-panel");
      if(panel) panel.style.transform = `scale(${currentScale})`;
      const modal = $("#mwi-settings-modal");
      if(modal) modal.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
      if(window.__mwi_settings_cache.GAME_THEME === "dark"){
        document.documentElement.classList.remove("mwi-theme-light");
        document.documentElement.classList.add("mwi-theme-dark");
      } else {
        document.documentElement.classList.remove("mwi-theme-dark");
        document.documentElement.classList.add("mwi-theme-light");
      }
    }

    GM_addValueChangeListener(KEY_SETTINGS + "_ts", async ()=>{
      try{
        const fresh = await getSettings();
        window.__mwi_settings_cache = Object.assign({}, DEFAULT_SETTINGS, fresh);
        currentScale = IS_SIM ? fresh.SIM_SCALE : fresh.MWI_SCALE;

        const modal = $("#mwi-settings-modal");
        if(modal){
          modal.classList.toggle("dark", IS_SIM ? window.__mwi_settings_cache.SIM_THEME === "dark" : window.__mwi_settings_cache.GAME_THEME === "dark");
          modal.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
        }

        const panel = $("#mwi-panel"), btn = $("#mwi-floating-btn");
        if(panel && btn){
          if(IS_MILKY){
            panel.style.transform = `scale(${currentScale})`;
            btn.style.transform = `scale(${currentScale})`;
            if(window.__mwi_settings_cache.GAME_THEME === "dark"){
              document.documentElement.classList.remove("mwi-theme-light");
              document.documentElement.classList.add("mwi-theme-dark");
            } else {
              document.documentElement.classList.remove("mwi-theme-dark");
              document.documentElement.classList.add("mwi-theme-light");
            }
          } else {
            panel.style.transform = `scale(${currentScale})`;
            btn.style.transform = `scale(${currentScale})`;
            if(window.__mwi_settings_cache.SIM_THEME === "dark"){
              document.documentElement.classList.remove("mwi-theme-light");
              document.documentElement.classList.add("mwi-theme-dark");
            } else if(window.__mwi_settings_cache.SIM_THEME === "light"){
              document.documentElement.classList.remove("mwi-theme-dark");
              document.documentElement.classList.add("mwi-theme-light");
            } else {
              const chk = $("#darkModeToggle");
              if(chk){
                document.documentElement.classList.remove("mwi-theme-dark","mwi-theme-light");
                document.documentElement.classList.add(chk.checked?"mwi-theme-dark":"mwi-theme-light");
              }
            }
          }
        }

        const btnEl = document.querySelector("#mwi-floating-btn");
        const panelEl = document.querySelector("#mwi-panel");
        if(btnEl && panelEl) positionPanelNearButton(btnEl, panelEl);
      }catch(e){console.error("Settings ts sync main error:", e)}
    });

    try{
      if(IS_MILKY){
        const st = await waitForGameReady(9000, 300);
        if(st){
          await readAndSaveCurrentPageConfig();
          window.__mwi_panel?.refresh?.();
        }
      } else {
        const st = readGameStateFromPage();
        if(st && st.character){
          await readAndSaveCurrentPageConfig();
          window.__mwi_panel?.refresh?.();
        }
      }
    }catch(e){console.error("Initial load error:", e)}

    setTimeout(()=>{
      window.__mwi_panel?.refresh?.();
      const btn = document.querySelector("#mwi-floating-btn");
      const panel = document.querySelector("#mwi-panel");
      if(btn && panel) positionPanelNearButton(btn, panel);
    }, 800);
  }catch(e){console.error("Main init error:", e)}
}

main();