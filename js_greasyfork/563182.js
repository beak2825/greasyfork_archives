// ==UserScript==
// @name         牛牛战斗Buff显示
// @namespace    https://www.milkywayidle.com/
// @version      0.2.7
// @description  Display battle buff and debuff
// @author       400BadRequest
// @match        https://milkywayidle.com/*
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://milkywayidlecn.com/*
// @match        https://www.milkywayidlecn.com/*
// @run-at       document-start
// @grant        none
// @icon         https://www.milkywayidle.com/favicon.svg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563182/%E7%89%9B%E7%89%9B%E6%88%98%E6%96%97Buff%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/563182/%E7%89%9B%E7%89%9B%E6%88%98%E6%96%97Buff%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_PREFIXES = [
    'wss://api.milkywayidle.com/ws?',
    'wss://api.milkywayidlecn.com/ws?',
  ];
  const TAG = '[MWI-WSS]';
  const FALLBACK_SPRITE_URL = '/static/media/abilities_sprite.fdd1b4de.svg';
  let abilitySpriteBase = null;
  const BUFFS = new Map([
    ['/abilities/mana_spring', 10],
    ['/abilities/taunt', 65],
    ['/abilities/provoke', 65],
    ['/abilities/toughness', 20],
    ['/abilities/elusiveness', 20],
    ['/abilities/precision', 20],
    ['/abilities/berserk', 20],
    ['/abilities/elemental_affinity', 20],
    ['/abilities/frenzy', 20],
    ['/abilities/spike_shell', 30],
    ['/abilities/retribution', 30],
    ['/abilities/vampirism', 20],
    ['/abilities/insanity', 12],
    ['/abilities/invincible', 12],
    ['/abilities/fierce_aura', 120],
    ['/abilities/guardian_aura', 120],
    ['/abilities/mystic_aura', 120],
    ['/abilities/speed_aura', 120],
    ['/abilities/critical_aura', 120],
  ]);
  const DEBUFFS = new Map([
    ['/abilities/puncture', 10],
    ['/abilities/maim', 12],
    ['/abilities/crippling_slash', 12],
    ['/abilities/fracturing_impact', 12],
    ['/abilities/pestilent_shot', 12],
    ['/abilities/ice_spear', 8],
    ['/abilities/frost_surge', 9],
    ['/abilities/toxic_pollen', 10],
    ['/abilities/smoke_burst', 8],
  ]);
  const SINGLE_TARGET_DEBUFFS = new Set([
    '/abilities/puncture',
    '/abilities/maim',
    '/abilities/pestilent_shot',
    '/abilities/smoke_burst',
  ]);
  const TEAM_BUFFS = new Set([
    '/abilities/mana_spring',
    '/abilities/fierce_aura',
    '/abilities/guardian_aura',
    '/abilities/mystic_aura',
    '/abilities/speed_aura',
    '/abilities/critical_aura',
  ]);
  const UNIT_STATE = new WeakMap();
  const BATTLE_STATE = {
    players: new Map(),
    monsters: new Map(),
  };
  const LAST_EFFECT_TARGETS = {
    players: new Map(),
    monsters: new Map(),
  };
  const PENDING_BUFFS = [];
  let cleanupTimer = null;

  function safeParseJson(data) {
    if (typeof data !== 'string') return null;
    const s = data.trim();
    if (!(s.startsWith('{') || s.startsWith('['))) return null;
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  }

  function findBattleUpdatedPayload(obj) {
    // 杩斿洖鐪熸鎵胯浇 battle_updated 鐨勯偅涓€灞傚璞?
    if (!obj || typeof obj !== 'object') return null;
    if (obj.type === 'battle_updated') return obj;

    // 鍏煎涓€灞傚祵濂?
    const candidates = [obj.data, obj.payload, obj.message, obj.event];
    for (const c of candidates) {
      if (c && typeof c === 'object' && c.type === 'battle_updated') return c;
    }
    return null;
  }

  function findNewBattleSignal(obj) {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.type === 'new_battle') return obj;
    const candidates = [obj.data, obj.payload, obj.message, obj.event];
    for (const c of candidates) {
      if (c && typeof c === 'object' && c.type === 'new_battle') return c;
    }
    return null;
  }

  function seedStateFromCombatant(list, stateMap) {
    if (!Array.isArray(list)) return;
    for (let i = 0; i < list.length; i += 1) {
      const entry = list[i];
      if (!entry || typeof entry !== 'object') continue;
      const state = stateMap.get(String(i)) || {};
      const preparing = typeof entry.preparingAbilityHrid === 'string' ? entry.preparingAbilityHrid : '';
      if (preparing) {
        state.abilityHrid = preparing;
        delete state.isAutoAtk;
      } else if (entry.isPreparingAutoAttack === true || entry.isAutoAtk === true) {
        state.isAutoAtk = true;
        delete state.abilityHrid;
      }
      if (typeof entry.currentHitpoints === 'number') {
        state.cHP = entry.currentHitpoints;
      }
      if (typeof entry.currentManapoints === 'number') {
        state.cMP = entry.currentManapoints;
      }
      stateMap.set(String(i), state);
    }
  }

  function handleNewBattle(signal) {
    resetForNewBattle();
    clearMonsterBuffs();
    seedStateFromCombatant(signal.players, BATTLE_STATE.players);
    seedStateFromCombatant(signal.monsters, BATTLE_STATE.monsters);
  }

  function clearMonsterBuffs() {
    const units = getBattleUnits().monsters;
    for (const unitEl of units) {
      if (!unitEl) continue;
      const state = UNIT_STATE.get(unitEl);
      if (state) state.effects.clear();
      const bar = unitEl.querySelector('.mwi-buffbar');
      if (bar) bar.innerHTML = '';
    }
  }

  function resetForNewBattle() {
    BATTLE_STATE.monsters.clear();
    LAST_EFFECT_TARGETS.players.clear();
    LAST_EFFECT_TARGETS.monsters.clear();
    PENDING_BUFFS.length = 0;
  }

  function ensureBuffStyles() {
    if (document.getElementById('mwi-buff-style')) return;
    const style = document.createElement('style');
    style.id = 'mwi-buff-style';
    style.textContent = `
.mwi-buffbar{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;align-items:center;justify-content:center}
.mwi-chip{font:11px/1.2 "Trebuchet MS", Verdana, Arial, sans-serif;padding:2px 6px;border-radius:10px;white-space:nowrap;display:inline-flex;align-items:center;gap:4px;position:relative}
.mwi-icon-wrap{position:relative;width:15px;height:15px;display:inline-block}
.mwi-icon{width:15px;height:15px;display:block}
.mwi-progress-ring{position:absolute;inset:-3px;border-radius:14px;pointer-events:none;mask:linear-gradient(#000 0 0);-webkit-mask:linear-gradient(#000 0 0)}
.mwi-progress-ring::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:3px;background:conic-gradient(var(--mwi-ring-color) 0deg var(--mwi-ring-deg), transparent var(--mwi-ring-deg) 360deg);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.mwi-buff{background:#e7f4e4;color:#1e4d1a;border:1px solid #7fbf7a}
.mwi-debuff{background:#fbe3e3;color:#6b1a1a;border:1px solid #d17b7b}
`;
    (document.head || document.documentElement).appendChild(style);
  }

  function getUnitElements(areaSelector) {
    const area = document.querySelector(areaSelector);
    if (!area) return [];
    const grid = area.querySelector('.BattlePanel_combatUnitGrid__2hTAM');
    if (!grid) return [];
    return Array.from(grid.querySelectorAll('.CombatUnit_combatUnit__1m3XT'));
  }

  function getBattleUnits() {
    return {
      players: getUnitElements('.BattlePanel_playersArea__vvwlB'),
      monsters: getUnitElements('.BattlePanel_monstersArea__2dzrY'),
    };
  }

  function ensureBuffBar(unitEl) {
    let bar = unitEl.querySelector('.mwi-buffbar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'mwi-buffbar';
      unitEl.appendChild(bar);
    }
    return bar;
  }

  function getState(unitEl) {
    let state = UNIT_STATE.get(unitEl);
    if (!state) {
      state = { effects: new Map() };
      UNIT_STATE.set(unitEl, state);
    }
    return state;
  }

  function abilityId(hrid) {
    const parts = hrid.split('/');
    return parts[parts.length - 1] || hrid;
  }

  function getAbilitySpriteBase() {
    if (abilitySpriteBase) return abilitySpriteBase;
    const selectors = [
      'use[href*="abilities_sprite"]',
      'use[xlink\\:href*="abilities_sprite"]',
      'img[src*="abilities_sprite"]',
      'link[href*="abilities_sprite"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const href = el.getAttribute('href') || el.getAttribute('xlink:href') || el.getAttribute('src');
      if (typeof href === 'string' && href.includes('abilities_sprite')) {
        abilitySpriteBase = href.split('#')[0];
        return abilitySpriteBase;
      }
    }
    abilitySpriteBase = FALLBACK_SPRITE_URL;
    return abilitySpriteBase;
  }

  function getActionKey(state) {
    if (!state || typeof state !== 'object') return null;
    if (typeof state.abilityHrid === 'string' && state.abilityHrid.length > 0) return state.abilityHrid;
    if (state.isAutoAtk === true) return 'auto';
    return null;
  }

  function mergeState(stateMap, patchMap, mapName) {
    const actionChanges = [];
    const hpChanges = [];
    if (!patchMap || typeof patchMap !== 'object') return { actionChanges, hpChanges };

    const keys = Object.keys(patchMap);
    for (let idx = 0; idx < keys.length; idx += 1) {
      const key = keys[idx];
      const patch = patchMap[key];
      if (!patch || typeof patch !== 'object') continue;
      const prev = stateMap.get(key) || {};
      const next = { ...prev, ...patch };
      const prevAction = getActionKey(prev);
      const nextAction = getActionKey(next);
      if (prevAction && nextAction && prevAction !== nextAction) {
        actionChanges.push({ mapName, key, prevAction, nextAction });
      }
      if (typeof prev.cHP === 'number' && typeof next.cHP === 'number' && prev.cHP !== next.cHP) {
        hpChanges.push({ mapName, key, prevHP: prev.cHP, newHP: next.cHP, delta: next.cHP - prev.cHP });
      }
      stateMap.set(key, next);
    }
    return { actionChanges, hpChanges };
  }

  function updateBattleState(payload) {
    if (!payload || typeof payload !== 'object') return;
    const playerResult = mergeState(BATTLE_STATE.players, payload.pMap, 'pMap');
    const monsterResult = mergeState(BATTLE_STATE.monsters, payload.mMap, 'mMap');

    const monsterHits = monsterResult.hpChanges.filter((h) => h.delta < 0).map((h) => Number(h.key));
    for (const change of playerResult.actionChanges) {
      if (BUFFS.has(change.prevAction)) {
        const casterIndex = Number(change.key);
        if (Number.isInteger(casterIndex)) {
          PENDING_BUFFS.push({ mapName: 'pMap', casterIndex, abilityHrid: change.prevAction });
        }
      }
      if (!DEBUFFS.has(change.prevAction)) continue;
      if (monsterHits.length === 0) continue;
      const casterIndex = Number(change.key);
      if (!Number.isInteger(casterIndex)) continue;
      LAST_EFFECT_TARGETS.players.set(casterIndex, monsterHits);
    }

    const playerHits = playerResult.hpChanges.filter((h) => h.delta < 0).map((h) => Number(h.key));
    for (const change of monsterResult.actionChanges) {
      if (BUFFS.has(change.prevAction)) {
        const casterIndex = Number(change.key);
        if (Number.isInteger(casterIndex)) {
          PENDING_BUFFS.push({ mapName: 'mMap', casterIndex, abilityHrid: change.prevAction });
        }
      }
      if (!DEBUFFS.has(change.prevAction)) continue;
      if (playerHits.length === 0) continue;
      const casterIndex = Number(change.key);
      if (!Number.isInteger(casterIndex)) continue;
      LAST_EFFECT_TARGETS.monsters.set(casterIndex, playerHits);
    }
  }

  function inferTargetIndexes(entity, targetCount) {
    if (!entity || typeof entity !== 'object') return null;
    const candidates = [
      entity.targetIndexes,
      entity.targetIndices,
      entity.targetIndexList,
      entity.targetIdxs,
      entity.targets,
    ];
    for (const c of candidates) {
      if (!Array.isArray(c)) continue;
      const indexes = c.filter((n) => Number.isInteger(n) && n >= 0 && n < targetCount);
      if (indexes.length > 0) return indexes;
    }
    return null;
  }

  function inferTargetsFromOppositeMap(mapName, pMap, mMap, targetCount) {
    const opposite = mapName === 'pMap' ? mMap : pMap;
    if (!opposite || typeof opposite !== 'object') return null;
    const keys = Object.keys(opposite)
      .map((k) => Number(k))
      .filter((n) => Number.isInteger(n) && n >= 0 && n < targetCount);
    return keys.length > 0 ? keys : null;
  }

  function inferTargetsFromLastEffect(mapName, casterIndex) {
    const bucket = mapName === 'pMap' ? LAST_EFFECT_TARGETS.players : LAST_EFFECT_TARGETS.monsters;
    const targets = bucket.get(casterIndex);
    return Array.isArray(targets) && targets.length > 0 ? targets : null;
  }

  function renderUnit(unitEl) {
    const state = getState(unitEl);
    const bar = ensureBuffBar(unitEl);
    const now = Date.now();
    const entries = Array.from(state.effects.values()).filter((e) => e.expiresAt > now);
    state.effects = new Map(entries.map((e) => [e.abilityHrid, e]));

    bar.innerHTML = '';
    for (const effect of entries.sort((a, b) => a.expiresAt - b.expiresAt)) {
      const chip = document.createElement('span');
      chip.className = `mwi-chip ${effect.kind === 'buff' ? 'mwi-buff' : 'mwi-debuff'}`;
      const iconWrap = document.createElement('span');
      iconWrap.className = 'mwi-icon-wrap';
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('role', 'img');
      icon.setAttribute('aria-label', '技能');
      icon.setAttribute('class', 'Icon_icon__2LtL_ mwi-icon');
      icon.setAttribute('width', '100%');
      icon.setAttribute('height', '100%');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      const spriteBase = getAbilitySpriteBase();
      use.setAttribute('href', `${spriteBase}#${abilityId(effect.abilityHrid)}`);
      use.setAttribute('xlink:href', `${spriteBase}#${abilityId(effect.abilityHrid)}`);
      icon.appendChild(use);
      const total = Math.max(1, effect.durationSec);
      const elapsed = Math.max(0, Math.min(total, (now - effect.startedAt) / 1000));
      const progress = Math.min(1, Math.max(0, elapsed / total));
      const degrees = progress * 360;
      iconWrap.appendChild(icon);
      chip.appendChild(iconWrap);
      const ring = document.createElement('span');
      ring.className = 'mwi-progress-ring';
      ring.style.setProperty('--mwi-ring-deg', `${degrees}deg`);
      ring.style.setProperty('--mwi-ring-color', effect.kind === 'buff' ? 'rgba(60,140,60,0.7)' : 'rgba(180,60,60,0.7)');
      chip.appendChild(ring);
      bar.appendChild(chip);
    }
  }

  function updateUnitEffect(unitEl, kind, abilityHrid, durationSec) {
    const state = getState(unitEl);
    const now = Date.now();
    state.effects.set(abilityHrid, {
      abilityHrid,
      kind,
      durationSec,
      startedAt: now,
      expiresAt: now + durationSec * 1000,
    });
    renderUnit(unitEl);
  }

  function ensureCleanupTimer() {
    if (cleanupTimer) return;
    cleanupTimer = setInterval(() => {
      const units = [...getBattleUnits().players, ...getBattleUnits().monsters];
      for (const unitEl of units) {
        if (UNIT_STATE.has(unitEl)) renderUnit(unitEl);
      }
    }, 1000);
  }

  function inferMMapRole(entity) {
    if (!entity || typeof entity !== 'object') return 'target';
    if (entity.isMonster === true || entity.monsterHrid || entity.monsterId || entity.entityType === 'monster' || entity.kind === 'monster') {
      return 'monster-caster';
    }
    return 'target';
  }

  function logAbilityHridsFromMaps(payload, wsUrl) {
    const pMap = payload?.pMap;
    const mMap = payload?.mMap;
    const units = getBattleUnits();
    if (units.players.length === 0 && units.monsters.length === 0) return;
    ensureBuffStyles();
    ensureCleanupTimer();
    updateBattleState(payload);
    if (PENDING_BUFFS.length > 0) {
      const pending = PENDING_BUFFS.splice(0, PENDING_BUFFS.length);
      for (const item of pending) {
        if (!BUFFS.has(item.abilityHrid)) continue;
        const duration = BUFFS.get(item.abilityHrid);
        const isTeamBuff = TEAM_BUFFS.has(item.abilityHrid);
        const unitList = item.mapName === 'pMap' ? units.players : units.monsters;
        if (isTeamBuff) {
          for (const unitEl of unitList) {
            if (unitEl) updateUnitEffect(unitEl, 'buff', item.abilityHrid, duration);
          }
        } else {
          const unitEl = unitList[item.casterIndex];
          if (unitEl) updateUnitEffect(unitEl, 'buff', item.abilityHrid, duration);
        }
      }
    }

    const logFromMap = (map, mapName, roleResolver) => {
      if (!map || typeof map !== 'object') return;
      const keys = Object.keys(map);
      for (let idx = 0; idx < keys.length; idx += 1) {
        const key = keys[idx];
        const entity = map[key];
        if (!entity || typeof entity !== 'object') continue;

        const abilityHrid = entity.abilityHrid;
        if (typeof abilityHrid !== 'string' || abilityHrid.length === 0) continue;

        const isBuff = BUFFS.has(abilityHrid);
        const isDebuff = DEBUFFS.has(abilityHrid);
        if (!isBuff && !isDebuff) continue;

        const duration = isBuff ? BUFFS.get(abilityHrid) : DEBUFFS.get(abilityHrid);
        const kind = isBuff ? 'buff' : 'debuff';
        const isTeamBuff = isBuff && TEAM_BUFFS.has(abilityHrid);
        const affects = isBuff ? (isTeamBuff ? 'team' : 'self') : 'enemy';
        const role = roleResolver(entity);
        const unitList = mapName === 'pMap' ? units.players : units.monsters;
        const targetList = mapName === 'pMap' ? units.monsters : units.players;
        const targetSide = mapName === 'pMap' ? 'monsters' : 'players';
        const keyIndex = Number.isInteger(Number(key)) ? Number(key) : idx;
        if (isTeamBuff) {
          for (const unitEl of unitList) {
            if (unitEl) updateUnitEffect(unitEl, kind, abilityHrid, duration);
          }
        } else {
          const applyList = isDebuff ? targetList : unitList;
          if (isDebuff) {
            const targets = SINGLE_TARGET_DEBUFFS.has(abilityHrid) && targetSide === 'monsters'
              ? (applyList.length > 0 ? [0] : [])
              : (
                inferTargetsFromLastEffect(mapName, keyIndex) ||
                inferTargetIndexes(entity, applyList.length) ||
                inferTargetsFromOppositeMap(mapName, pMap, mMap, applyList.length) ||
                applyList.map((_, i) => i)
              );
            const targetInfo = targets.length === applyList.length ? ' target=all' : ` target=${targetSide}[${targets.join(',')}]`;
            for (const t of targets) {
              const unitEl = applyList[t];
              if (unitEl) updateUnitEffect(unitEl, kind, abilityHrid, duration);
            }
          } else {
            const unitEl = applyList[keyIndex];
            if (unitEl) updateUnitEffect(unitEl, kind, abilityHrid, duration);
          }
        }
      }
    };

    logFromMap(pMap, 'pMap', () => 'caster');
    logFromMap(mMap, 'mMap', inferMMapRole);
  }

  const NativeWebSocket = window.WebSocket;
  if (!NativeWebSocket) return;

  if (window.__MWI_WS_HOOKED__) return;
  window.__MWI_WS_HOOKED__ = true;

  window.WebSocket = function WebSocketProxy(url, protocols) {
    const ws = protocols ? new NativeWebSocket(url, protocols) : new NativeWebSocket(url);
    const wsUrl = String(url || '');
    const isTarget = TARGET_PREFIXES.some((prefix) => wsUrl.startsWith(prefix));

    ws.addEventListener('message', (event) => {
      if (!isTarget) return;

      const raw = event.data;

      if (typeof raw === 'string') {
        const obj = safeParseJson(raw);
        if (!obj) return;

        const newBattle = findNewBattleSignal(obj);
        if (newBattle) {
          handleNewBattle(newBattle);
        }

        const payload = findBattleUpdatedPayload(obj);
        if (!payload) return;

        logAbilityHridsFromMaps(payload, wsUrl);
        return;
      }

      // 濡傛灉浣犵殑 ws message 涓嶆槸 string锛岃€屾槸 Blob / ArrayBuffer锛屽彲鍚敤涓嬮潰 decode
      // if (raw instanceof Blob) {
      //   raw.text().then((text) => {
      //     const obj = safeParseJson(text);
      //     if (!obj) return;
      //     const payload = findBattleUpdatedPayload(obj);
      //     if (!payload) return;
      //     logAbilityHridsFromMaps(payload, wsUrl);
      //   }).catch(() => {});
      // } else if (raw instanceof ArrayBuffer) {
      //   try {
      //     const text = new TextDecoder('utf-8').decode(new Uint8Array(raw));
      //     const obj = safeParseJson(text);
      //     if (!obj) return;
      //     const payload = findBattleUpdatedPayload(obj);
      //     if (!payload) return;
      //     logAbilityHridsFromMaps(payload, wsUrl);
      //   } catch {}
      // }
    });

    return ws;
  };

  window.WebSocket.prototype = NativeWebSocket.prototype;
  Object.setPrototypeOf(window.WebSocket, NativeWebSocket);
  const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
  for (const name of states) {
    try {
      if (Object.prototype.hasOwnProperty.call(window.WebSocket, name)) continue;
      Object.defineProperty(window.WebSocket, name, {
        value: NativeWebSocket[name],
        configurable: true,
      });
    } catch {}
  }

  console.log(`${TAG} WebSocket hook installed`);
})();
