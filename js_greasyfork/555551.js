// ==UserScript==
// @name         OpenFront.io Bundle: Player List + Auto-Join
// @namespace    https://openfront.io/
// @version      2.5.0
// @description  Merges "Lobby Player List" and "Auto-Join Lobby" into one efficient script. Shared API calls to prevent 429 errors. Compatible with OpenFront.io v0.29.0+
// @homepageURL  https://github.com/DeLoWaN/openfront-autojoin-lobby
// @author       DeLoVaN + SyntaxMenace + DeepSeek + Claude
// @match        https://openfront.io/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      UNLICENSED
// @downloadURL https://update.greasyfork.org/scripts/555551/OpenFrontio%20Bundle%3A%20Player%20List%20%2B%20Auto-Join.user.js
// @updateURL https://update.greasyfork.org/scripts/555551/OpenFrontio%20Bundle%3A%20Player%20List%20%2B%20Auto-Join.meta.js
// ==/UserScript==

"use strict";(()=>{var s={bgPrimary:"rgba(10, 14, 22, 0.92)",bgSecondary:"rgba(18, 26, 40, 0.75)",bgHover:"rgba(35, 48, 70, 0.6)",textPrimary:"#e7f1ff",textSecondary:"rgba(231, 241, 255, 0.7)",textMuted:"rgba(231, 241, 255, 0.5)",accent:"rgba(46, 211, 241, 0.95)",accentHover:"rgba(99, 224, 255, 0.95)",accentMuted:"rgba(46, 211, 241, 0.18)",accentAlt:"rgba(99, 110, 255, 0.9)",success:"rgba(20, 220, 170, 0.9)",successSolid:"#38d9a9",warning:"#f2c94c",error:"#ff7d87",highlight:"rgba(88, 211, 255, 0.2)",border:"rgba(120, 140, 180, 0.3)",borderAccent:"rgba(46, 211, 241, 0.55)"},f={display:"'Trebuchet MS', 'Segoe UI', Tahoma, Verdana, sans-serif",body:"'Segoe UI', Tahoma, Verdana, sans-serif",mono:"'Consolas', 'Courier New', monospace"},d={xs:"4px",sm:"8px",md:"12px",lg:"16px",xl:"20px",xxl:"24px"},x={sm:"4px",md:"6px",lg:"8px",xl:"12px"},M={sm:"0 2px 8px rgba(3, 8, 18, 0.35)",md:"0 10px 22px rgba(3, 8, 18, 0.45)",lg:"0 24px 40px rgba(2, 6, 16, 0.55), 0 0 24px rgba(46, 211, 241, 0.08)"},p={fast:"0.12s",normal:"0.2s",slow:"0.3s"};var U={threadCount:20,lobbyPollingRate:1e3},L={autoJoinSettings:"OF_AUTOJOIN_SETTINGS",autoJoinPanelPosition:"OF_AUTOJOIN_PANEL_POSITION",playerListPanelPosition:"OF_PLAYER_LIST_PANEL_POSITION",playerListPanelSize:"OF_PLAYER_LIST_PANEL_SIZE",playerListShowOnlyClans:"OF_PLAYER_LIST_SHOW_ONLY_CLANS",playerListCollapseStates:"OF_PLAYER_LIST_COLLAPSE_STATES",playerListRecentTags:"OF_PLAYER_LIST_RECENT_TAGS",playerListAutoRejoin:"OF_PLAYER_LIST_AUTO_REJOIN"},P={panel:9998,panelOverlay:9999,modal:1e4,notification:2e4};function Y(){return`
    /* Body layout wrapper for flexbox */
    #of-game-layout-wrapper {
      display: flex;
      height: 100vh;
      width: 100vw;
    }
    #of-game-content {
      flex: 1;
      overflow: auto;
      min-width: 0;
    }

    :root {
      --of-hud-accent: ${s.accent};
      --of-hud-accent-soft: ${s.accentMuted};
      --of-hud-accent-alt: ${s.accentAlt};
      --of-hud-border: ${s.border};
      --of-hud-border-strong: ${s.borderAccent};
      --of-hud-bg: ${s.bgPrimary};
      --of-hud-bg-2: ${s.bgSecondary};
      --of-hud-text: ${s.textPrimary};
    }

    @keyframes ofPanelEnter {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .of-panel {
      position: fixed;
      background: linear-gradient(145deg, rgba(12, 18, 30, 0.98) 0%, rgba(10, 16, 26, 0.94) 60%, rgba(8, 12, 20, 0.96) 100%);
      border: 1px solid ${s.border};
      border-radius: ${x.lg};
      box-shadow: ${M.lg};
      font-family: ${f.body};
      color: ${s.textPrimary};
      user-select: none;
      z-index: ${P.panel};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      animation: ofPanelEnter ${p.slow} ease;
    }
    .of-panel input[type="checkbox"] { accent-color: ${s.accent}; }
    .of-panel.hidden { display: none; }
    .of-header {
      padding: ${d.md} ${d.lg};
      background: linear-gradient(90deg, rgba(20, 30, 46, 0.85), rgba(12, 18, 30, 0.6));
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      font-size: 0.85em;
      border-bottom: 1px solid ${s.border};
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${f.display};
    }
    .of-header-title {
      display: flex;
      align-items: center;
      gap: ${d.sm};
    }
    .of-player-list-title {
      font-size: 1em;
      color: ${s.textPrimary};
    }
    .of-player-list-header {
      position: relative;
    }
    .of-player-list-header::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(46, 211, 241, 0.7), transparent);
      pointer-events: none;
    }
    .autojoin-header {
      cursor: pointer;
      gap: ${d.sm};
      padding: ${d.sm} ${d.md};
      font-size: 0.85em;
      position: relative;
    }
    .autojoin-header:hover {
      background: ${s.bgHover};
    }
    .autojoin-header::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(46, 211, 241, 0.7), transparent);
      pointer-events: none;
    }
    .autojoin-title {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .autojoin-title-text {
      color: ${s.textPrimary};
      font-weight: 700;
    }
    .autojoin-title-sub {
      font-size: 0.72em;
      color: ${s.textMuted};
      letter-spacing: 0.2em;
    }
    .autojoin-collapse-button {
      background: transparent;
      border: 1px solid transparent;
      color: ${s.textPrimary};
      border-radius: ${x.sm};
      padding: 2px 8px;
      cursor: pointer;
      font-size: 1em;
      line-height: 1;
      transition: transform ${p.fast}, border-color ${p.fast}, background ${p.fast};
    }
    .autojoin-collapse-button:hover {
      border-color: ${s.borderAccent};
      background: ${s.bgHover};
    }
    .autojoin-panel.autojoin-collapsed .autojoin-collapse-button {
      transform: rotate(-90deg);
    }
    .of-content { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(80,110,160,0.4) transparent; }
    .of-content::-webkit-scrollbar { width: 7px; }
    .of-content::-webkit-scrollbar-thumb { background: rgba(80,110,160,0.4); border-radius: 5px; }
    .of-footer {
      padding: ${d.sm} ${d.lg};
      display: flex;
      justify-content: space-between;
      background: ${s.bgSecondary};
      flex-shrink: 0;
      border-top: 1px solid ${s.border};
    }
    .of-button {
      background: ${s.bgHover};
      border: 1px solid ${s.border};
      color: ${s.textPrimary};
      padding: ${d.sm} ${d.md};
      border-radius: ${x.md};
      cursor: pointer;
      font-size: 0.95em;
      font-weight: 600;
      transition: background ${p.fast}, border-color ${p.fast}, color ${p.fast};
      outline: none;
    }
    .of-button:hover { background: rgba(80,110,160,0.5); border-color: ${s.borderAccent}; }
    .of-button.primary { background: ${s.accent}; color: #04131a; }
    .of-button.primary:hover { background: ${s.accentHover}; }
    .of-input {
      padding: ${d.sm};
      background: rgba(20, 30, 46, 0.7);
      border: 1px solid ${s.border};
      border-radius: ${x.md};
      color: ${s.textPrimary};
      font-size: 0.95em;
      outline: none;
      transition: border ${p.fast};
    }
    .of-input:focus { border-color: ${s.accent}; }
    .of-badge {
      background: ${s.accentMuted};
      border: 1px solid ${s.borderAccent};
      border-radius: ${x.xl};
      padding: 2px 10px;
      font-size: 0.75em;
      color: ${s.textPrimary};
    }
    .of-toggle {
      width: 34px;
      height: 18px;
      border-radius: 11px;
      background: rgba(35, 48, 70, 0.9);
      border: 1px solid ${s.border};
      position: relative;
      transition: background ${p.fast}, border-color ${p.fast};
      cursor: pointer;
    }
    .of-toggle.on { background: ${s.successSolid}; }
    .of-toggle-ball {
      position: absolute; left: 2px; top: 2px; width: 14px; height: 14px;
      border-radius: 50%; background: #fff; transition: left ${p.fast};
    }
    .of-toggle.on .of-toggle-ball { left: 18px; }

    .of-player-list-container {
      width: var(--player-list-width, 320px);
      min-width: 240px;
      max-width: 50vw;
      height: 100vh;
      flex-shrink: 0;
      position: relative;
      background: linear-gradient(180deg, rgba(12, 18, 30, 0.98), rgba(8, 12, 20, 0.95));
      border: 1px solid ${s.border};
      border-left: 1px solid ${s.borderAccent};
      border-radius: 0;
      box-shadow: ${M.lg};
      font-family: ${f.body};
      color: ${s.textPrimary};
      user-select: none;
      z-index: ${P.panel};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      resize: none;
    }
    .of-autojoin-slot {
      width: 100%;
      flex-shrink: 0;
    }
    .of-resize-handle {
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, ${s.accent}, rgba(46, 211, 241, 0.1));
      cursor: ew-resize;
      z-index: ${P.panel+1};
      opacity: 0.35;
      transition: opacity ${p.fast}, box-shadow ${p.fast};
    }
    .of-resize-handle:hover {
      opacity: 0.8;
      box-shadow: 0 0 12px rgba(46, 211, 241, 0.4);
    }
    .of-resize-handle.dragging {
      opacity: 1;
    }
    .of-player-list-count { font-size: 0.72em; letter-spacing: 0.12em; font-family: ${f.mono}; }
    .of-player-debug-info { font-size: 0.75em; color: rgba(148, 170, 210, 0.7); padding: 2px 6px; display: none; font-family: ${f.mono}; }

    .of-quick-tag-switch {
      padding: ${d.md} ${d.lg};
      background: rgba(14, 22, 34, 0.75);
      border-bottom: 1px solid ${s.border};
      display: flex;
      align-items: center;
      gap: ${d.sm};
      flex-shrink: 0;
      flex-wrap: nowrap;
      overflow-x: auto;
    }
    .of-quick-tag-switch::-webkit-scrollbar { height: 5px; }
    .of-quick-tag-switch::-webkit-scrollbar-thumb { background: rgba(80,110,160,0.45); border-radius: 4px; }
    .of-quick-tag-label {
      font-size: 0.75em;
      color: ${s.textMuted};
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }
    .of-quick-tag-item {
      display: flex;
      align-items: center;
      gap: ${d.xs};
    }
    .of-quick-tag-btn {
      padding: 4px 12px;
      font-size: 0.8em;
      background: rgba(22, 34, 52, 0.9);
      color: ${s.textPrimary};
      border: 1px solid ${s.border};
      border-radius: ${x.md};
      cursor: pointer;
      transition: all ${p.fast};
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${f.display};
    }
    .of-quick-tag-btn:hover {
      background: ${s.accentMuted};
      border-color: ${s.accent};
    }
    .of-quick-tag-remove {
      width: 16px;
      height: 16px;
      padding: 0;
      font-size: 11px;
      line-height: 1;
      background: rgba(255, 125, 135, 0.15);
      color: ${s.error};
      border: 1px solid rgba(255, 125, 135, 0.6);
      border-radius: 50%;
      cursor: pointer;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background ${p.fast}, border-color ${p.fast}, transform ${p.fast};
    }
    .of-quick-tag-remove:hover {
      background: rgba(255, 117, 117, 0.25);
      border-color: ${s.error};
      transform: scale(1.05);
    }

    .of-clan-checkbox-filter {
      padding: ${d.md} ${d.lg};
      background: rgba(14, 22, 34, 0.75);
      border-bottom: 1px solid ${s.border};
      display: flex;
      align-items: center;
      gap: ${d.sm};
      flex-shrink: 0;
    }
    .of-clan-checkbox-filter input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin: 0;
    }
    .of-clan-checkbox-filter label {
      cursor: pointer;
      color: ${s.textPrimary};
      font-size: 0.85em;
      user-select: none;
      flex: 1;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${f.display};
    }

    .of-clan-group {
      margin: 8px ${d.md};
      border: 1px solid rgba(90, 110, 150, 0.35);
      border-radius: ${x.md};
      background: rgba(14, 20, 32, 0.78);
      overflow: hidden;
      box-shadow: 0 10px 18px rgba(2, 6, 16, 0.35);
    }
    .of-clan-group-enter {
      animation: clanGroupEnter ${p.slow} cubic-bezier(.27,.82,.48,1.06) forwards;
    }
    @keyframes clanGroupEnter {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .of-clan-group-exit {
      animation: clanGroupExit 0.25s cubic-bezier(.51,.01,1,1.01) forwards;
    }
    @keyframes clanGroupExit {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-8px); }
    }
    .of-clan-group-header {
      padding: calc(${d.sm} - 2px) ${d.md};
      background: rgba(22, 32, 48, 0.9);
      cursor: default;
      display: flex;
      align-items: center;
      gap: ${d.sm};
      transition: background ${p.fast}, border-color ${p.fast};
      flex-wrap: wrap;
      font-family: ${f.display};
    }
    .of-clan-group-header:hover {
      background: rgba(28, 40, 60, 0.95);
    }
    .of-clan-group.current-player-clan .of-clan-group-header {
      background: rgba(46, 211, 241, 0.18) !important;
      border-left: 3px solid ${s.accent} !important;
      padding-left: calc(${d.sm} - 3px);
    }
    .of-clan-group.current-player-clan .of-clan-group-players .of-player-item {
      background: rgba(46, 211, 241, 0.15) !important;
      border-color: ${s.accent} !important;
      box-shadow: 0 0 8px rgba(46, 211, 241, 0.2);
    }
    .of-clan-group.current-player-clan .of-clan-group-players .of-player-item:hover {
      background: rgba(46, 211, 241, 0.25) !important;
      transform: translateY(-1px);
    }
    .of-clan-arrow {
      font-size: 0.8em;
      color: ${s.textSecondary};
      transition: transform ${p.fast};
      width: 16px;
      display: inline-block;
    }
    .of-clan-group.collapsed .of-clan-arrow {
      transform: rotate(-90deg);
    }
    .of-clan-tag {
      font-weight: 700;
      color: ${s.textPrimary};
      font-size: 0.85em;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-family: ${f.display};
    }
    .of-clan-count {
      font-size: 0.75em;
      color: ${s.textPrimary};
      background: rgba(46, 211, 241, 0.18);
      padding: 2px 7px;
      border-radius: ${x.xl};
      border: 1px solid ${s.borderAccent};
      letter-spacing: 0.1em;
      font-family: ${f.mono};
    }
    .of-clan-actions {
      display: flex;
      gap: ${d.xs};
      flex-wrap: wrap;
      align-items: center;
      margin-left: auto;
    }
    .of-clan-stats {
      display: flex;
      gap: ${d.xs};
      font-size: 0.66em;
      color: ${s.textSecondary};
      flex-wrap: wrap;
      font-family: ${f.mono};
      line-height: 1.2;
    }
    .of-clan-stats span {
      white-space: nowrap;
    }
    .of-clan-use-btn {
      padding: 4px 10px;
      font-size: 0.75em;
      background: rgba(46, 211, 241, 0.15);
      color: ${s.textPrimary};
      border: 1px solid ${s.borderAccent};
      border-radius: ${x.sm};
      cursor: pointer;
      transition: all ${p.fast};
      font-weight: 700;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${f.display};
    }
    .of-clan-use-btn:hover {
      background: ${s.accent};
      border-color: ${s.accent};
      color: #04131a;
    }
    .of-clan-group-players {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 10px 10px 12px 10px;
      overflow: visible;
      transition: max-height ${p.normal} ease-in-out, opacity ${p.normal} ease-in-out;
      border-top: 1px solid rgba(60, 80, 120, 0.35);
    }
    .of-clan-group.collapsed .of-clan-group-players {
      max-height: 0;
      padding: 0;
      opacity: 0;
      overflow: hidden;
    }
    .of-clan-group-players .of-player-item {
      display: inline-flex;
      padding: 4px 10px;
      border: 1px solid rgba(90, 110, 150, 0.4);
      border-radius: ${x.sm};
      background: rgba(22, 34, 52, 0.9);
      cursor: default;
      transition: background ${p.fast}, border-color ${p.fast}, transform ${p.fast};
    }
    .of-clan-group-players .of-player-item:hover {
      background: rgba(30, 44, 66, 0.95);
      border-color: ${s.borderAccent};
      transform: translateY(-1px);
    }
    .of-player-list-content { flex: 1; padding: ${d.xs} 0; }
    /* Base player item styles (for untagged players) */
    .of-player-list-content > .of-player-item {
      padding: 6px ${d.md};
      border-bottom: 1px solid rgba(60, 80, 120, 0.35);
      font-size: 0.85em;
      line-height: 1.4;
      position: relative;
      transition: background-color ${p.slow}, border-color ${p.slow};
      cursor: default;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .of-player-list-content > .of-player-item:hover {
      background: rgba(24, 34, 52, 0.7);
      border-bottom-color: rgba(80, 110, 160, 0.5);
    }
    .of-player-name { color: ${s.textPrimary}; white-space: nowrap; overflow: visible; font-weight: 400; flex: 1; }
    .of-player-highlighted { background: linear-gradient(90deg, ${s.highlight} 40%, rgba(46, 211, 241, 0.05)); border-left: 3px solid ${s.accent}; }
    .of-player-enter { animation: playerEnter ${p.slow} cubic-bezier(.27,.82,.48,1.06) forwards; }
    .of-player-enter-stagger-1 { animation-delay: 30ms; }
    .of-player-enter-stagger-2 { animation-delay: 60ms; }
    .of-player-enter-stagger-3 { animation-delay: 90ms; }
    .of-player-enter-stagger-4 { animation-delay: 120ms; }
    .of-player-enter-highlight { background-color: rgba(110,160,255,0.14) !important; }
    .of-player-exit-highlight { background-color: rgba(220, 70, 90, 0.18); }
    .of-player-exit { animation: playerExit 0.25s cubic-bezier(.51,.01,1,1.01) forwards; }
    @keyframes playerEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes playerExit { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-8px); } }
    .of-player-list-footer { padding: ${d.sm} ${d.lg}; display: flex; justify-content: space-between; background: ${s.bgSecondary}; font-size: 0.95em; flex-shrink: 0; border-top: 1px solid ${s.border}; }
    .of-player-list-button { background: ${s.bgHover}; border: 1px solid ${s.border}; color: ${s.textPrimary}; padding: 6px 13px; border-radius: ${x.md}; cursor: pointer; font-size: 0.9em; font-weight: 600; transition: background ${p.fast}, border-color ${p.fast}; outline: none; }
    .of-player-list-button:hover { background: rgba(80,110,160,0.5); border-color: ${s.borderAccent}; }

    .autojoin-panel {
      position: relative;
      width: 100%;
      max-width: none;
      max-height: none;
      margin: 0;
      border: none;
      border-bottom: 1px solid ${s.border};
      border-radius: 0;
      box-shadow: none;
      transition: opacity ${p.slow}, transform ${p.slow};
      cursor: default;
    }
    .autojoin-panel::after { display: none; }
    .autojoin-panel.hidden { display: none; }
    .autojoin-panel.autojoin-collapsed .autojoin-body { display: none; }
    .autojoin-body { display: flex; flex-direction: column; }
    .autojoin-content { display: flex; flex-direction: column; gap: ${d.sm}; padding: ${d.sm} ${d.md} ${d.md}; }
    .autojoin-status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${d.sm};
      flex-wrap: wrap;
      padding: ${d.sm} ${d.md};
      background: rgba(18, 26, 40, 0.75);
      border: 1px solid ${s.border};
      border-radius: ${x.md};
    }
    .autojoin-action-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: ${d.sm};
    }
    .autojoin-clanmate-button {
      width: 100%;
      background: rgba(22, 34, 52, 0.9);
      border: 1px solid ${s.border};
      color: ${s.textPrimary};
      padding: ${d.sm} ${d.md};
      border-radius: ${x.md};
      font-size: 0.8em;
      font-weight: 700;
      cursor: pointer;
      transition: background ${p.fast}, border-color ${p.fast};
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${f.display};
    }
    .autojoin-clanmate-button:hover { background: rgba(30, 44, 66, 0.95); border-color: ${s.borderAccent}; }
    .autojoin-clanmate-button.armed { background: ${s.accent}; border-color: ${s.accentHover}; color: #04131a; box-shadow: 0 0 12px rgba(46, 211, 241, 0.35); }
    .autojoin-clanmate-button:disabled { opacity: 0.6; cursor: not-allowed; }
    .autojoin-config-grid { display: flex; flex-direction: column; gap: ${d.sm}; }
    .autojoin-config-card { flex: 1 1 auto; min-width: 0; width: 100%; background: rgba(14, 22, 34, 0.7); border: 1px solid ${s.border}; border-radius: ${x.md}; }
    .autojoin-mode-inner {
      display: flex;
      flex-direction: column;
      gap: ${d.xs};
      margin-top: ${d.xs};
    }
    .autojoin-section {
      display: flex;
      flex-direction: column;
      gap: ${d.xs};
    }
    .autojoin-section-title {
      font-size: 0.72em;
      color: ${s.textMuted};
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-family: ${f.display};
      margin-top: ${d.xs};
    }
    .autojoin-footer { align-items: center; justify-content: flex-start; gap: ${d.sm}; flex-wrap: wrap; padding: ${d.sm} ${d.md}; background: rgba(14, 22, 34, 0.75); border-top: 1px solid ${s.border}; }
    .autojoin-main-button {
      width: auto;
      flex: 1 1 160px;
      padding: ${d.sm} ${d.md};
      border: 1px solid ${s.border};
      border-radius: ${x.md};
      font-size: 0.8em;
      font-weight: 700;
      cursor: pointer;
      transition: all ${p.slow};
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: ${f.display};
    }
    .autojoin-main-button.active { background: ${s.accent}; color: #04131a; border-color: ${s.accentHover}; box-shadow: 0 0 14px rgba(46, 211, 241, 0.35); }
    .autojoin-main-button.inactive { background: rgba(28, 38, 58, 0.9); color: ${s.textSecondary}; }
    .autojoin-mode-config { margin-bottom: ${d.xs}; padding: ${d.sm}; background: rgba(18, 26, 40, 0.8); border-radius: ${x.md}; border: 1px solid rgba(90, 110, 150, 0.35); }
    .mode-checkbox-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      cursor: pointer;
      margin-bottom: 6px;
      font-size: 0.8em;
      color: ${s.textPrimary};
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-family: ${f.display};
    }
    .mode-checkbox-label input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
    .player-filter-info { margin-bottom: 4px; padding: 2px 0; }
    .player-filter-info small { color: ${s.textSecondary}; font-size: 0.8em; }
    .capacity-range-wrapper { margin-top: 4px; }
    .capacity-range-visual { position: relative; padding: 8px 0 4px 0; }
    .capacity-track { position: relative; height: 6px; background: rgba(46, 211, 241, 0.2); border-radius: 3px; margin-bottom: ${d.sm}; }
    .team-count-options-centered { display: flex; justify-content: space-between; gap: 10px; margin: ${d.xs} 0; }
    .team-count-column { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; background: rgba(12, 18, 30, 0.6); padding: 5px; border-radius: ${x.sm}; border: 1px solid rgba(90, 110, 150, 0.25); }
    .team-count-column label { display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 0.78em; color: ${s.textPrimary}; white-space: nowrap; user-select: none; }
    .team-count-column input[type="checkbox"] { width: 16px; height: 16px; margin: 0; }
    .select-all-btn { background: rgba(46, 211, 241, 0.15); color: ${s.textPrimary}; border: 1px solid ${s.borderAccent}; border-radius: ${x.sm}; padding: ${d.xs} ${d.sm}; font-size: 0.75em; cursor: pointer; flex: 1; text-align: center; margin: 0 2px; text-transform: uppercase; letter-spacing: 0.1em; font-family: ${f.display}; }
    .select-all-btn:hover { background: rgba(46, 211, 241, 0.25); }
    .team-count-section > div:first-of-type { display: flex; gap: 5px; margin-bottom: ${d.xs}; }
    .team-count-section > label { font-size: 0.8em; color: ${s.textPrimary}; font-weight: 600; margin-bottom: 4px; display: block; text-transform: uppercase; letter-spacing: 0.08em; font-family: ${f.display}; }
    .capacity-labels { display: flex; justify-content: space-between; align-items: center; margin-top: ${d.sm}; }
    .three-times-checkbox { display: flex; align-items: center; gap: ${d.xs}; font-size: 0.78em; color: ${s.textPrimary}; margin: 0 5px; }
    .three-times-checkbox input[type="checkbox"] { width: 15px; height: 15px; }
    .capacity-range-fill { position: absolute; height: 100%; background: rgba(46, 211, 241, 0.5); border-radius: 3px; pointer-events: none; opacity: 0.7; transition: left 0.1s ease, width 0.1s ease; }
    .capacity-slider { position: absolute; width: 100%; height: 6px; top: 0; left: 0; background: transparent; outline: none; -webkit-appearance: none; pointer-events: none; margin: 0; }
    .capacity-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${s.accent}; cursor: pointer; pointer-events: all; border: 2px solid rgba(5, 20, 26, 0.9); box-shadow: ${M.sm}; }
    .capacity-slider-min { z-index: 2; }
    .capacity-slider-max { z-index: 1; }
    .capacity-label-group { display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .capacity-label-group label { font-size: 0.8em; color: ${s.textSecondary}; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.08em; font-family: ${f.display}; }
    .capacity-value { font-size: 0.85em; color: #FFFFFF; font-weight: 600; min-width: 40px; text-align: center; }
    .capacity-inputs-hidden { display: none; }
    .autojoin-status { display: flex; align-items: center; gap: 8px; cursor: pointer; white-space: nowrap; flex-wrap: wrap; }
    @keyframes statusPulse {
      0% { box-shadow: 0 0 0 0 rgba(20, 220, 170, 0.4); }
      70% { box-shadow: 0 0 0 8px rgba(20, 220, 170, 0); }
      100% { box-shadow: 0 0 0 0 rgba(20, 220, 170, 0); }
    }
    .status-indicator { width: 8px; height: 8px; border-radius: 50%; background: ${s.success}; box-shadow: 0 0 10px rgba(20, 220, 170, 0.4); }
    .status-indicator.active { animation: statusPulse 2s infinite; }
    .status-indicator.inactive { animation: none; box-shadow: none; }
    .status-text { font-size: 0.8em; color: ${s.textPrimary}; text-transform: uppercase; letter-spacing: 0.12em; font-family: ${f.display}; }
    .search-timer { font-size: 0.8em; color: rgba(147, 197, 253, 0.9); font-weight: 500; font-family: ${f.mono}; }
    .autojoin-settings { display: flex; align-items: center; gap: ${d.sm}; flex-wrap: wrap; }
    .autojoin-toggle-label { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 0.8em; color: ${s.textPrimary}; font-family: ${f.display}; text-transform: uppercase; letter-spacing: 0.08em; }
    .autojoin-toggle-label input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; }
    .current-game-info { margin: 6px 0; padding: 6px ${d.sm}; background: rgba(46, 211, 241, 0.1); border-radius: ${x.sm}; font-size: 0.8em; color: rgba(147, 197, 253, 0.9); text-align: center; border: 1px solid rgba(46, 211, 241, 0.25); }
    .current-game-info.not-applicable { background: rgba(100, 100, 100, 0.1); color: ${s.textMuted}; border-color: rgba(100, 100, 100, 0.2); font-style: italic; }
    .game-found-notification {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      background: linear-gradient(135deg, rgba(12, 20, 32, 0.95) 0%, rgba(10, 16, 28, 0.9) 100%);
      border: 1px solid ${s.borderAccent};
      border-radius: ${x.lg};
      padding: ${d.xl} 30px;
      z-index: ${P.notification};
      color: ${s.textPrimary};
      font-family: ${f.display};
      font-size: 0.9em;
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      cursor: pointer;
      box-shadow: ${M.md};
      transition: transform ${p.slow}, opacity ${p.slow};
      opacity: 0;
      min-width: 300px;
      max-width: 520px;
    }
    .game-found-notification .notification-title {
      font-size: 1.1em;
    }
    .game-found-notification .notification-detail {
      font-size: 0.85em;
      margin-top: ${d.sm};
      text-transform: none;
      letter-spacing: 0.06em;
      color: ${s.textSecondary};
      font-family: ${f.mono};
    }
    .game-found-notification .notification-hint {
      font-size: 0.7em;
      margin-top: 6px;
      text-transform: none;
      letter-spacing: 0.08em;
      color: ${s.textMuted};
    }
    .game-found-notification.notification-visible { transform: translateX(-50%) translateY(0); opacity: 1; }
    .game-found-notification.notification-dismissing { transform: translateX(-50%) translateY(-100px); opacity: 0; }
    .game-found-notification:hover { background: rgba(16, 26, 40, 0.96); border-color: ${s.accentHover}; box-shadow: 0 0 18px rgba(46, 211, 241, 0.2); }
  `}var A={gameFoundAudio:null,gameStartAudio:null,audioUnlocked:!1,preloadSounds(){try{this.gameFoundAudio=new Audio("https://github.com/DeLoWaN/openfront-autojoin-lobby/raw/refs/heads/main/notification_sounds/new-notification-014-363678.mp3"),this.gameFoundAudio.volume=.5,this.gameFoundAudio.preload="auto",this.gameStartAudio=new Audio("https://github.com/DeLoWaN/openfront-autojoin-lobby/raw/refs/heads/main/notification_sounds/opening-bell-421471.mp3"),this.gameStartAudio.volume=.5,this.gameStartAudio.preload="auto",this.setupAudioUnlock()}catch(i){console.warn("[SoundUtils] Could not preload audio:",i)}},setupAudioUnlock(){let i=()=>{if(this.audioUnlocked)return;let e=[];this.gameFoundAudio&&(this.gameFoundAudio.volume=.01,e.push(this.gameFoundAudio.play().then(()=>{this.gameFoundAudio&&(this.gameFoundAudio.pause(),this.gameFoundAudio.currentTime=0,this.gameFoundAudio.volume=.5)}).catch(()=>{}))),this.gameStartAudio&&(this.gameStartAudio.volume=.01,e.push(this.gameStartAudio.play().then(()=>{this.gameStartAudio&&(this.gameStartAudio.pause(),this.gameStartAudio.currentTime=0,this.gameStartAudio.volume=.5)}).catch(()=>{}))),Promise.all(e).then(()=>{this.audioUnlocked=!0,console.log("[SoundUtils] Audio unlocked successfully"),document.removeEventListener("click",i),document.removeEventListener("keydown",i),document.removeEventListener("touchstart",i)})};document.addEventListener("click",i,{once:!0}),document.addEventListener("keydown",i,{once:!0}),document.addEventListener("touchstart",i,{once:!0})},playGameFoundSound(){this.gameFoundAudio?(console.log("[SoundUtils] Attempting to play game found sound"),this.gameFoundAudio.currentTime=0,this.gameFoundAudio.play().catch(i=>{console.warn("[SoundUtils] Failed to play game found sound:",i)})):console.warn("[SoundUtils] Game found audio not initialized")},playGameStartSound(){this.gameStartAudio?(console.log("[SoundUtils] Attempting to play game start sound"),this.gameStartAudio.currentTime=0,this.gameStartAudio.play().catch(i=>{console.warn("[SoundUtils] Failed to play game start sound:",i)})):console.warn("[SoundUtils] Game start audio not initialized")}};var E={callbacks:[],lastUrl:location.href,initialized:!1,init(){if(this.initialized)return;this.initialized=!0;let i=()=>{location.href!==this.lastUrl&&(this.lastUrl=location.href,this.notify())};window.addEventListener("popstate",i),window.addEventListener("hashchange",i);let e=history.pushState,t=history.replaceState;history.pushState=function(...n){e.apply(history,n),setTimeout(i,0)},history.replaceState=function(...n){t.apply(history,n),setTimeout(i,0)},setInterval(i,200)},subscribe(i){this.callbacks.push(i),this.init()},notify(){this.callbacks.forEach(i=>i(location.href))}};var W={subscribers:[],ws:null,fallbackInterval:null,lastLobbies:[],pollingRate:U.lobbyPollingRate,wsConnectionAttempts:0,maxWsAttempts:3,reconnectTimeout:null,start(){this.ws||this.fallbackInterval||(console.log("[Bundle] Starting LobbyDataManager with WebSocket"),this.wsConnectionAttempts=0,this.connectWebSocket())},stop(){this.ws&&(this.ws.close(),this.ws=null),this.reconnectTimeout&&(clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.stopFallbackPolling()},subscribe(i){this.subscribers.push(i)},connectWebSocket(){try{let e=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}/lobbies`;this.ws=new WebSocket(e),this.ws.addEventListener("open",()=>{console.log("[Bundle] WebSocket connected"),this.wsConnectionAttempts=0,this.stopFallbackPolling(),this.reconnectTimeout&&(clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null)}),this.ws.addEventListener("message",t=>{try{let n=JSON.parse(t.data);n.type==="lobbies_update"&&(this.lastLobbies=n.data?.lobbies??[],this.notifySubscribers())}catch(n){console.error("[Bundle] WebSocket parse error:",n)}}),this.ws.addEventListener("close",()=>{console.log("[Bundle] WebSocket disconnected"),this.ws=null,this.wsConnectionAttempts++,this.wsConnectionAttempts>=this.maxWsAttempts?(console.log("[Bundle] Max WebSocket attempts reached, falling back to HTTP"),this.startFallbackPolling()):this.reconnectTimeout=setTimeout(()=>this.connectWebSocket(),3e3)}),this.ws.addEventListener("error",t=>{console.error("[Bundle] WebSocket error:",t)})}catch(i){console.error("[Bundle] WebSocket connection error:",i),this.wsConnectionAttempts++,this.wsConnectionAttempts>=this.maxWsAttempts&&this.startFallbackPolling()}},startFallbackPolling(){this.fallbackInterval||(console.log("[Bundle] Starting HTTP fallback polling"),this.fetchData(),this.fallbackInterval=setInterval(()=>this.fetchData(),this.pollingRate))},stopFallbackPolling(){this.fallbackInterval&&(clearInterval(this.fallbackInterval),this.fallbackInterval=null)},async fetchData(){if(!(location.pathname!=="/"&&!location.pathname.startsWith("/public-lobby")))try{let i=await fetch("/api/public_lobbies");if(i.status===429){console.warn("[Bundle] Rate limited.");return}let e=await i.json();this.lastLobbies=e.lobbies||[],this.notifySubscribers()}catch(i){console.error("[Bundle] API Error:",i),this.lastLobbies=[],this.notifySubscribers()}},notifySubscribers(){this.subscribers.forEach(i=>i(this.lastLobbies))}};var k={data:null,dataByTag:null,fetching:!1,fetched:!1,async fetch(){if(this.fetched||this.fetching)return this.data||[];this.fetching=!0;let i=async()=>{let e=await fetch("https://api.openfront.io/public/clans/leaderboard");if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.json()};try{let e=await i();this.data=e.clans||[],this.dataByTag=new Map;for(let t of this.data)this.dataByTag.set(t.clanTag.toLowerCase(),t);this.fetched=!0,console.log("[Bundle] Clan leaderboard cached:",this.data.length,"clans")}catch(e){console.warn("[Bundle] Clan fetch failed, retrying...",e instanceof Error?e.message:String(e)),await new Promise(t=>setTimeout(t,5e3));try{let t=await i();this.data=t.clans||[],this.dataByTag=new Map;for(let n of this.data)this.dataByTag.set(n.clanTag.toLowerCase(),n);this.fetched=!0,console.log("[Bundle] Clan leaderboard cached (retry):",this.data.length,"clans")}catch(t){console.error("[Bundle] Clan leaderboard unavailable:",t instanceof Error?t.message:String(t)),this.data=[],this.dataByTag=new Map,this.fetched=!0}}return this.fetching=!1,this.data||[]},getStats(i){return!this.dataByTag||!i?null:this.dataByTag.get(i.toLowerCase())||null}};var G=class{constructor(e,t,n=null,a=200,o=50){this.isDragging=!1;this.startX=0;this.startWidth=0;this.el=e,this.onResize=t,this.storageKey=n,this.minWidth=a,this.maxWidthVw=o,this.handleMouseDown=this._handleMouseDown.bind(this),this.handleMouseMove=this._handleMouseMove.bind(this),this.handleMouseUp=this._handleMouseUp.bind(this),this.handle=this.createHandle(),e.appendChild(this.handle),n&&this.loadWidth()}createHandle(){let e=document.createElement("div");return e.className="of-resize-handle",e.addEventListener("mousedown",this.handleMouseDown),e}loadWidth(){if(!this.storageKey)return;let e=GM_getValue(this.storageKey,null);if(e&&e.width){let t=this.clampWidth(e.width);this.el.style.width=t+"px",this.onResize(t)}}saveWidth(){this.storageKey&&GM_setValue(this.storageKey,{width:this.el.offsetWidth})}clampWidth(e){let t=window.innerWidth*(this.maxWidthVw/100);return Math.max(this.minWidth,Math.min(e,t))}_handleMouseDown(e){e.preventDefault(),e.stopPropagation(),this.isDragging=!0,this.startX=e.clientX,this.startWidth=this.el.offsetWidth,this.handle.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp)}_handleMouseMove(e){if(!this.isDragging)return;let t=this.startX-e.clientX,n=this.clampWidth(this.startWidth+t);this.el.style.width=n+"px",this.onResize(n)}_handleMouseUp(){this.isDragging&&(this.isDragging=!1,this.handle.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp),this.saveWidth())}destroy(){this.handle.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp),this.handle.parentNode&&this.handle.parentNode.removeChild(this.handle)}};var T={lastActionTime:0,debounceDelay:800,getLobbyButton(){return document.querySelector("public-lobby")?.querySelector("button.group.relative.isolate")},canJoinLobby(){let i=document.querySelector("public-lobby");if(!i)return!1;let e=this.getLobbyButton();return!!(e&&!i.isLobbyHighlighted&&i.lobbies&&i.lobbies.length>0&&!e.disabled&&e.offsetParent!==null)},verifyState(i){let e=document.querySelector("public-lobby");if(!e)return!1;let t=this.getLobbyButton();return!t||t.disabled||t.offsetParent===null?!1:i==="in"?e.isLobbyHighlighted===!0:i==="out"?!!(!e.isLobbyHighlighted&&e.lobbies&&e.lobbies.length>0):!1},tryJoinLobby(){let i=Date.now();if(i-this.lastActionTime<this.debounceDelay)return!1;let e=this.getLobbyButton(),t=document.querySelector("public-lobby");return e&&t&&!t.isLobbyHighlighted&&t.lobbies&&t.lobbies.length>0&&!e.disabled&&e.offsetParent!==null?(this.lastActionTime=i,e.click(),setTimeout(()=>{this.verifyState("in")||console.warn("[LobbyUtils] Join may have failed, state not updated")},100),!0):!1},isOnLobbyPage(){let i=document.getElementById("page-game");if(i&&!i.classList.contains("hidden"))return!1;let e=document.querySelector("canvas");if(e&&e.offsetParent!==null){let o=e.getBoundingClientRect();if(o.width>100&&o.height>100)return!1}let t=document.querySelector("public-lobby");if(t&&t.offsetParent!==null)return!0;if(t&&t.offsetParent===null)return!1;let n=document.getElementById("page-play");if(n&&!n.classList.contains("hidden")&&t)return!0;let a=window.location.pathname.replace(/\/+$/,"")||"/";return a==="/"||a==="/public-lobby"}};var Q={showPlayerCount:!0,animationsEnabled:!0,debug:!1};function F(i){if(!i)return null;let e=i.trim().match(/\[([a-zA-Z0-9]{2,5})\]/);return e?e[1]??null:null}function X(i){return i&&i.trim().replace(/^\[([a-zA-Z0-9]{2,5})\]\s*/,"")}function Z(i){let e=new Map,t=[];for(let a of i){let o=F(a);if(o){let r=o.toLowerCase();e.has(r)?e.get(r).players.push(a):e.set(r,{tag:o,players:[a]})}else t.push(a)}return{clanGroups:Array.from(e.values()),untaggedPlayers:t}}function oe(i){let e=0;for(let t=0;t<i.length;t++)e=(e<<5)-e+i.charCodeAt(t),e|=0;return Math.abs(e)}function ee(i){return oe(i)%U.threadCount}async function te(i,e){try{let t=await fetch(`/w${e}/api/game/${i}`);if(t.headers.get("content-type")?.includes("text/html"))throw new Error("Game started");return await t.json()}catch{return{clients:{}}}}function ne(i,e,t,n,a,o){let r=new Set(e),l=new Set,c=new Set;for(let h of e)i.has(h)||l.add(h);for(let h of i)r.has(h)||c.add(h);let u=new Map;for(let h of t)u.set(h.tag.toLowerCase(),new Set(h.players));let m=new Map;for(let h of n)m.set(h.tag.toLowerCase(),new Set(h.players));let y=new Map,b=new Map;for(let[h,R]of m){let I=u.get(h);if(!I)continue;let w=[];for(let j of R)I.has(j)||w.push(j);w.length>0&&y.set(h,w)}for(let[h,R]of u){let I=m.get(h);if(!I)continue;let w=[];for(let j of R)I.has(j)||w.push(j);w.length>0&&b.set(h,w)}let C=[],S=[];for(let h of n)u.has(h.tag.toLowerCase())||C.push(h.tag);for(let h of t)m.has(h.tag.toLowerCase())||S.push(h.tag);let g=new Set(a),v=new Set(o),$=[],H=[];for(let h of o)g.has(h)||$.push(h);for(let h of a)v.has(h)||H.push(h);return{added:l,removed:c,addedByClan:y,removedByClan:b,addedUntagged:$,removedUntagged:H,newClans:C,removedClans:S}}var B=null,_=null,O=class{constructor(){this.currentPlayers=[];this.clanGroups=[];this.untaggedPlayers=[];this.previousPlayers=new Set;this.previousClanGroups=[];this.previousUntaggedPlayers=[];this.debugSequence=[];this.showOnlyClans=!0;this.recentTags=[];this.usernameCheckInterval=null;this.usernameAttachInterval=null;this.debugKeyHandler=null;this.lastFetchedGameId=null;this.lastFetchTime=0;this.fetchDebounceMs=1500;this.currentPlayerUsername="";this.selectedClanTag=null;this.playerListUpdateSubscribers=[];this.settings={...Q},this.sleeping=!T.isOnLobbyPage(),this.loadSettings(),this.initUI(),this.initDebugKey(),this.updateSleepState(),E.subscribe(()=>this.updateSleepState()),k.fetch()}async receiveLobbyUpdate(e){if(this.sleeping)return;if(!e||!e.length){B=_=null,this.lastFetchedGameId=null,this.updateListWithNames([]);return}let t=e[0];if(!t)return;let n=t.gameID,a=ee(n),o=Date.now();if(!(this.lastFetchedGameId===n&&o-this.lastFetchTime<this.fetchDebounceMs)){this.lastFetchedGameId=n,this.lastFetchTime=o,B=n,_=a;try{let r=await te(n,a),l=Object.values(r.clients||{}).map(c=>c.username);this.updateListWithNames(l)}catch(r){console.warn("[PlayerList] Failed to fetch game data:",r)}}}onPlayerListUpdate(e){this.playerListUpdateSubscribers.push(e)}updateListWithNames(e){this.currentPlayers=e,this.settings.debug&&B!=null&&(this.debugInfo.textContent=`GameID: ${B} | WorkerID: ${_}`);let t=new Set(e),n=this.previousPlayers&&this.previousPlayers.size===t.size&&e.every(u=>this.previousPlayers.has(u)),a=this.lastRenderedShowOnlyClans===this.showOnlyClans,o=this.getActiveClanTag(),r=this.lastRenderedSelectedClanTag===o;if(n&&a&&r)return;let{clanGroups:l,untaggedPlayers:c}=Z(e);if(this.previousClanGroups=this.clanGroups,this.previousUntaggedPlayers=this.untaggedPlayers,this.clanGroups=l,this.untaggedPlayers=c,this.renderPlayerList(),this.settings.showPlayerCount){let u=this.header.querySelector(".of-player-list-count");u&&(u.textContent=String(e.length))}this.previousPlayers=t,this.lastRenderedShowOnlyClans=this.showOnlyClans,this.notifyPlayerListUpdate()}notifyPlayerListUpdate(){if(this.playerListUpdateSubscribers.length===0)return;let e=this.getActiveClanTag(),t=this.hasClanmateMatch(e),n={activeClanTag:e,hasClanmateMatch:t};this.playerListUpdateSubscribers.forEach(a=>a(n))}hasClanmateMatch(e){if(!e)return!1;let t=e.toLowerCase(),n=this.currentPlayerUsername.trim();for(let a of this.clanGroups)if(a.tag.toLowerCase()===t)return n?a.players.some(o=>o.trim()!==n):a.players.length>0;return!1}initUI(){this.container=document.createElement("div"),this.container.className="of-panel of-player-list-container";let e=document.getElementById("of-game-layout-wrapper");e?e.appendChild(this.container):(console.warn("[PlayerList] Layout wrapper not found, appending to body"),document.body.appendChild(this.container));let t=document.createElement("div");t.id="of-autojoin-slot",t.className="of-autojoin-slot",this.container.appendChild(t),this.header=document.createElement("div"),this.header.className="of-header of-player-list-header",this.header.innerHTML=`
      <div class="of-header-title">
        <span class="of-player-list-title">Lobby Intel</span>
        <span class="of-badge of-player-list-count">0</span>
      </div>
    `,this.container.appendChild(this.header),this.debugInfo=document.createElement("div"),this.debugInfo.className="of-player-debug-info",this.header.appendChild(this.debugInfo),this.quickTagSwitch=document.createElement("div"),this.quickTagSwitch.className="of-quick-tag-switch";let n=document.createElement("span");n.className="of-quick-tag-label",n.textContent="Quick tags",this.quickTagSwitch.appendChild(n),this.container.appendChild(this.quickTagSwitch),this.checkboxFilter=document.createElement("div"),this.checkboxFilter.className="of-clan-checkbox-filter";let a=document.createElement("input");a.type="checkbox",a.id="show-only-clans-checkbox",a.checked=this.showOnlyClans,a.addEventListener("change",r=>{if(this.showOnlyClans=r.target.checked,this.saveSettings(),this.renderPlayerList(),this.settings.showPlayerCount){let l=this.header.querySelector(".of-player-list-count");l&&(l.textContent=String(this.currentPlayers.length))}});let o=document.createElement("label");o.htmlFor="show-only-clans-checkbox",o.textContent="Show only players with clan tags",this.checkboxFilter.appendChild(a),this.checkboxFilter.appendChild(o),this.container.appendChild(this.checkboxFilter),this.content=document.createElement("div"),this.content.className="of-content of-player-list-content",this.container.appendChild(this.content),this.resizeHandler=new G(this.container,r=>{document.documentElement.style.setProperty("--player-list-width",r+"px")},L.playerListPanelSize,200,50),this.applySavedPanelSize(),this.resizeObserver=new ResizeObserver(()=>{if(!T.isOnLobbyPage())return;let r=this.container.offsetWidth,l=this.container.offsetHeight;r<=0||l<=0||GM_setValue(L.playerListPanelSize,{width:r,height:l})}),this.resizeObserver.observe(this.container),this.applySettings(),this.renderQuickTagSwitch(),this.monitorUsernameInput()}monitorUsernameInput(){let e=()=>{let r=document.querySelector("username-input");if(!r)return null;let l=r.querySelector('input[maxlength="5"]'),c=r.querySelector('input:not([maxlength="5"])');return{clanInput:l,nameInput:c,component:r}},t="",n=()=>{let r=e();if(!r)return;let l=r.clanInput?.value||"",c=r.nameInput?.value||"",u=l?`[${l}] ${c}`:c,m=l||F(u);m&&m.length>=2&&this.addRecentTag(m)},a=()=>{let r=e();if(!r)return;let l=r.clanInput?.value||"",c=r.nameInput?.value||"",u=l?`[${l}] ${c}`:c;if(u!==t){t=u,this.currentPlayerUsername=u;let m=F(u);!this.setSelectedClanTag(l||m)&&this.clanGroups.length>0&&this.renderPlayerList()}};a(),this.usernameCheckInterval=setInterval(a,1e3);let o=()=>{let r=e(),l=r?.clanInput,c=r?.nameInput;l&&!l.dataset.ofMonitored&&(l.dataset.ofMonitored="true",l.addEventListener("input",a),l.addEventListener("change",()=>{a(),n()})),c&&!c.dataset.ofMonitored&&(c.dataset.ofMonitored="true",c.addEventListener("input",a),c.addEventListener("change",()=>{a(),n()}))};o(),this.usernameAttachInterval=setInterval(o,5e3)}loadSettings(){let e=GM_getValue(L.playerListShowOnlyClans);e!==void 0&&(e==="true"?this.showOnlyClans=!0:e==="false"?this.showOnlyClans=!1:this.showOnlyClans=!!e);let t=GM_getValue(L.playerListRecentTags);t&&Array.isArray(t)&&(this.recentTags=t)}saveSettings(){GM_setValue(L.playerListShowOnlyClans,this.showOnlyClans)}getAutoRejoinOnClanChange(){let e=GM_getValue(L.autoJoinSettings,null);return e&&typeof e.autoRejoinOnClanChange=="boolean"?e.autoRejoinOnClanChange:GM_getValue(L.playerListAutoRejoin)??!1}applyClanTagToNickname(e){this.setSelectedClanTag(e);let t=document.querySelector("username-input");if(!t)return;let n=t.querySelector('input[maxlength="5"]');if(n){let a=e.toUpperCase(),o=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value")?.set;o&&(o.call(n,a),n.dispatchEvent(new Event("input",{bubbles:!0})),n.dispatchEvent(new Event("change",{bubbles:!0})),this.getAutoRejoinOnClanChange()&&this.performLobbyRejoin())}}addRecentTag(e){let t=e.toUpperCase();this.recentTags.includes(t)||(this.recentTags.unshift(t),this.recentTags.length>3&&(this.recentTags=this.recentTags.slice(0,3)),GM_setValue(L.playerListRecentTags,this.recentTags),this.renderQuickTagSwitch())}renderQuickTagSwitch(){this.quickTagSwitch.querySelectorAll(".of-quick-tag-item").forEach(t=>t.remove());for(let t of this.recentTags){let n=document.createElement("div");n.className="of-quick-tag-item";let a=document.createElement("button");a.type="button",a.className="of-quick-tag-btn",a.textContent=t,a.title=`Apply [${t}] to your username`,a.addEventListener("click",()=>{this.applyClanTagToNickname(t)});let o=document.createElement("button");o.type="button",o.className="of-quick-tag-remove",o.textContent="x",o.title="Remove from recent tags",o.setAttribute("aria-label",`Remove ${t} from recent tags`),o.addEventListener("click",r=>{r.stopPropagation(),this.recentTags=this.recentTags.filter(l=>l!==t),GM_setValue(L.playerListRecentTags,this.recentTags),this.renderQuickTagSwitch()}),n.appendChild(a),n.appendChild(o),this.quickTagSwitch.appendChild(n)}}createClanGroupEl(e,t,n,a=!1){let o=document.createElement("div");o.className="of-clan-group",o.setAttribute("data-clan-tag",e.toLowerCase()),a&&o.classList.add("of-clan-group-enter");let r=document.createElement("div");r.className="of-clan-group-header";let l="";if(n){let m=n.wins&&n.losses?(n.wins/n.losses).toFixed(2):n.weightedWLRatio?.toFixed(2)||"0.00",y=n.wins?.toLocaleString()||0,b=n.losses?.toLocaleString()||0;l=`
        <span>W ${y}</span>
        <span>\u2022</span>
        <span>L ${b}</span>
        <span>\u2022</span>
        <span>R ${m}</span>
      `}r.innerHTML=`
      <span class="of-clan-tag">[${e}]</span>
      <span class="of-clan-count">${t.length}</span>
      <div class="of-clan-actions">
        ${l?`<div class="of-clan-stats">${l}</div>`:""}
        <button class="of-clan-use-btn" title="Apply [${e}] to your username">Use tag</button>
      </div>
    `;let c=r.querySelector(".of-clan-use-btn");c&&c.addEventListener("click",m=>{m.stopPropagation(),this.applyClanTagToNickname(e)});let u=document.createElement("div");u.className="of-clan-group-players";for(let m of t)u.appendChild(this.createPlayerEl(m,!1,!0));return o.appendChild(r),o.appendChild(u),o}createPlayerEl(e,t=!1,n=!1){let a=document.createElement("div");a.className="of-player-item",a.setAttribute("data-player-name",e),t&&a.classList.add("of-player-enter");let o=document.createElement("span");return o.className="of-player-name",o.textContent=n?X(e):e,a.appendChild(o),a}normalizeClanTag(e){if(!e)return null;let t=e.trim();return t?t.toLowerCase():null}setSelectedClanTag(e){let t=this.normalizeClanTag(e);return t===this.selectedClanTag?!1:(this.selectedClanTag=t,this.renderPlayerList(),this.notifyPlayerListUpdate(),!0)}getActiveClanTag(){return this.selectedClanTag?this.selectedClanTag:this.currentPlayerUsername?this.normalizeClanTag(F(this.currentPlayerUsername)):null}sortClanGroupsWithPlayerFirst(e,t){let n=t??this.getActiveClanTag();if(!n)return e;let a=e.findIndex(o=>o.tag.toLowerCase()===n);return a>0?[e[a],...e.slice(0,a),...e.slice(a+1)]:e}async performLobbyRejoin(){let e=document.querySelector("public-lobby"),t=T.getLobbyButton();if(!t||!e){console.warn("[PlayerList] Cannot rejoin - lobby elements not found");return}if(e.isLobbyHighlighted===!0&&(t.click(),await new Promise(o=>setTimeout(o,900)),!T.verifyState("out"))){console.warn("[PlayerList] Failed to leave lobby");return}await new Promise(o=>setTimeout(o,200)),T.tryJoinLobby()||console.warn("[PlayerList] Failed to join lobby")}renderPlayerList(){let e=ne(this.previousPlayers,this.currentPlayers,this.previousClanGroups,this.clanGroups,this.previousUntaggedPlayers,this.untaggedPlayers),t=this.previousPlayers.size===0,n=this.lastRenderedShowOnlyClans!==this.showOnlyClans,a=this.getActiveClanTag(),o=this.lastRenderedSelectedClanTag!==a;t||n||o?this.renderPlayerListFull(a):this.renderPlayerListDifferential(e,a),this.lastRenderedSelectedClanTag=a}renderPlayerListFull(e){this.content.innerHTML="";let t=e??this.getActiveClanTag(),n=this.sortClanGroupsWithPlayerFirst(this.clanGroups,t);for(let a of n){let o=k.getStats(a.tag),r=this.createClanGroupEl(a.tag,a.players,o,!1);t&&a.tag.toLowerCase()===t&&r.classList.add("current-player-clan"),this.content.appendChild(r)}if(!this.showOnlyClans)for(let a of this.untaggedPlayers)this.content.appendChild(this.createPlayerEl(a,!1,!1))}renderPlayerListDifferential(e,t){for(let r of e.removedClans){let l=this.content.querySelector(`[data-clan-tag="${r.toLowerCase()}"]`);l&&this.removeClanGroupWithAnimation(l)}for(let[r,l]of e.removedByClan){let c=this.content.querySelector(`[data-clan-tag="${r.toLowerCase()}"]`);if(c)for(let u of l){let m=c.querySelector(`[data-player-name="${CSS.escape(u)}"]`);m&&this.removePlayerWithAnimation(m)}}if(!this.showOnlyClans)for(let r of e.removedUntagged){let l=this.content.querySelector(`.of-player-item[data-player-name="${CSS.escape(r)}"]`);l&&!l.closest(".of-clan-group")&&this.removePlayerWithAnimation(l)}let n=t??this.getActiveClanTag(),a=this.sortClanGroupsWithPlayerFirst(this.clanGroups,n);for(let r of e.newClans){let l=a.find(m=>m.tag===r);if(!l)continue;let c=k.getStats(l.tag),u=this.createClanGroupEl(l.tag,l.players,c,!0);n&&l.tag.toLowerCase()===n&&u.classList.add("current-player-clan"),this.insertClanGroupInOrder(u,a),u.addEventListener("animationend",()=>{u.classList.remove("of-clan-group-enter")},{once:!0})}let o=0;for(let[r,l]of e.addedByClan){let c=this.content.querySelector(`[data-clan-tag="${r.toLowerCase()}"]`);if(!c)continue;let u=c.querySelector(".of-clan-group-players");if(!u)continue;let m=c.classList.contains("collapsed");for(let y of l){let b=this.createPlayerEl(y,!0,!0);o>0&&o<=4&&b.classList.add(`of-player-enter-stagger-${o}`),o++,m&&b.classList.remove("of-player-enter"),u.appendChild(b),m||b.addEventListener("animationend",()=>{b.classList.remove("of-player-enter");for(let C=1;C<=4;C++)b.classList.remove(`of-player-enter-stagger-${C}`)},{once:!0})}this.updateClanCount(c)}if(!this.showOnlyClans)for(let r of e.addedUntagged){let l=this.createPlayerEl(r,!0,!1);o>0&&o<=4&&l.classList.add(`of-player-enter-stagger-${o}`),o++,this.content.appendChild(l),l.addEventListener("animationend",()=>{l.classList.remove("of-player-enter");for(let c=1;c<=4;c++)l.classList.remove(`of-player-enter-stagger-${c}`)},{once:!0})}for(let r of a){let l=this.content.querySelector(`[data-clan-tag="${r.tag.toLowerCase()}"]`);l&&this.updateClanCount(l)}}removePlayerWithAnimation(e){e.classList.add("of-player-exit"),e.addEventListener("animationend",()=>{e.remove()},{once:!0})}removeClanGroupWithAnimation(e){e.classList.add("of-clan-group-exit"),e.addEventListener("animationend",()=>{e.remove()},{once:!0})}insertClanGroupInOrder(e,t){let n=e.getAttribute("data-clan-tag");if(!n){this.content.appendChild(e);return}let a=t.findIndex(r=>r.tag.toLowerCase()===n);if(a===-1){this.content.appendChild(e);return}let o=null;for(let r=a+1;r<t.length;r++){let l=t[r].tag.toLowerCase(),c=this.content.querySelector(`[data-clan-tag="${l}"]`);if(c){o=c;break}}if(o)this.content.insertBefore(e,o);else{let r=this.content.querySelector(".of-player-item:not(.of-clan-group .of-player-item)");r?this.content.insertBefore(e,r):this.content.appendChild(e)}}updateClanCount(e){let t=e.querySelector(".of-clan-count"),n=e.querySelector(".of-clan-group-players");if(t&&n){let a=n.querySelectorAll(".of-player-item").length;t.textContent=String(a)}}applySettings(){this.settings.debug&&(this.debugInfo.style.display="block")}applySavedPanelSize(){let e=GM_getValue(L.playerListPanelSize);e&&e.width&&(this.container.style.width=e.width+"px",document.documentElement.style.setProperty("--player-list-width",e.width+"px"))}updateSleepState(){let e=T.isOnLobbyPage();this.sleeping=!e,this.sleeping?this.container.classList.add("hidden"):this.container.classList.remove("hidden")}initDebugKey(){this.debugKeyHandler=e=>{e.ctrlKey&&e.shiftKey&&e.key==="D"&&(this.debugSequence.push("D"),this.debugSequence.length>3&&this.debugSequence.shift(),this.debugSequence.join("")==="DDD"&&(this.settings.debug=!this.settings.debug,this.applySettings(),console.log("[PlayerList] Debug mode:",this.settings.debug),this.debugSequence=[]))},document.addEventListener("keydown",this.debugKeyHandler)}cleanup(){this.usernameCheckInterval&&clearInterval(this.usernameCheckInterval),this.usernameAttachInterval&&clearInterval(this.usernameAttachInterval),this.debugKeyHandler&&document.removeEventListener("keydown",this.debugKeyHandler),this.resizeObserver&&this.resizeObserver.disconnect(),this.resizeHandler&&this.resizeHandler.destroy(),this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container)}};function J(i,e){return!i||!e?null:i==="Duos"?2:i==="Trios"?3:i==="Quads"?4:typeof i=="number"&&i>0?Math.floor(e/i):null}function ie(i){if(!i)return null;let e=i.toLowerCase().trim();return e==="free for all"||e==="ffa"?"FFA":e==="team"||e==="teams"?"Team":e==="humans vs nations"||e==="hvn"?"HvN":null}function q(i){return ie(i.gameConfig?.gameMode)}function N(i){let e=i.gameConfig;if(!e)return null;if(e.playerTeams)return e.playerTeams;let t=e.teamCount??e.teams;return typeof t=="number"?t:null}function V(i){let e=i.gameConfig;return e?e.maxClients??e.maxPlayers??e.maxPlayersPerGame??i.maxClients??null:null}function K(i){let e=q(i),t=N(i),n=V(i);if(e==="FFA")return n!==null?`FFA (${n} max players)`:"FFA";if(e==="Team"){if(t==="Duos")return"Duos";if(t==="Trios")return"Trios";if(t==="Quads")return"Quads";if(typeof t=="number"&&n!==null){let a=J(t,n);return a!==null?`${t} teams (${a} per team)`:`${t} teams`}return"Team"}return"Unknown"}var z=class{matchesCriteria(e,t){if(!e||!e.gameConfig||!t||t.length===0)return!1;let n=V(e),a=q(e);for(let o of t){let r=!1;if(o.gameMode==="FFA"&&a==="FFA")r=!0;else if(o.gameMode==="Team"&&a==="Team"){if(o.teamCount!==null&&o.teamCount!==void 0){let l=N(e);if(o.teamCount==="Duos"&&l!=="Duos"||o.teamCount==="Trios"&&l!=="Trios"||o.teamCount==="Quads"&&l!=="Quads"||typeof o.teamCount=="number"&&l!==o.teamCount)continue}r=!0}else o.gameMode==="HvN"&&a==="Team"&&e.gameConfig?.playerTeams==="Humans Vs Nations"&&(r=!0);if(r){if(o.gameMode==="FFA"){if(n===null)return!0;if(o.minPlayers!==null&&n<o.minPlayers||o.maxPlayers!==null&&n>o.maxPlayers)continue}else if(o.gameMode==="Team"){let l=N(e),c=J(l,n);if(c===null)return!0;if(o.minPlayers!==null&&c<o.minPlayers||o.maxPlayers!==null&&c>o.maxPlayers)continue}return!0}}return!1}};var D=class{constructor(){this.autoJoinEnabled=!0;this.criteriaList=[];this.joinedLobbies=new Set;this.searchStartTime=null;this.gameFoundTime=null;this.isJoining=!1;this.soundEnabled=!0;this.recentlyLeftLobbyID=null;this.joinMode="autojoin";this.notifiedLobbies=new Set;this.lastNotifiedGameID=null;this.isTeamThreeTimesMinEnabled=!1;this.sleeping=!1;this.autoRejoinOnClanChange=!1;this.clanmateWatcherArmed=!1;this.lastClanmateMatch=!1;this.lastActiveClanTag=null;this.timerInterval=null;this.gameInfoInterval=null;this.notificationTimeout=null;this.isCollapsed=!1;this.engine=new z,this.loadSettings(),this.createUI(),this.updateSleepState(),E.subscribe(()=>this.updateSleepState())}receiveLobbyUpdate(e){this.processLobbies(e)}handleClanmateUpdate(e){if(this.lastActiveClanTag=e.activeClanTag,this.lastClanmateMatch=e.hasClanmateMatch,this.updateClanmateButtonState(),!!this.clanmateWatcherArmed){if(!e.activeClanTag){this.setClanmateWatcherArmed(!1);return}e.hasClanmateMatch&&this.attemptClanmateJoin()}}migrateSettings(){let e="autoJoinSettings",t=L.autoJoinSettings,n="autoJoinPanelPosition",a=L.autoJoinPanelPosition,o=L.playerListAutoRejoin,r=GM_getValue(e),l=GM_getValue(t);r&&!l&&GM_setValue(t,r);let c=GM_getValue(n),u=GM_getValue(a);c&&!u&&GM_setValue(a,c);let m=GM_getValue(o);if(m!==void 0){let y=GM_getValue(t,null);y?y.autoRejoinOnClanChange===void 0&&GM_setValue(t,{...y,autoRejoinOnClanChange:m}):GM_setValue(t,{criteria:[],autoJoinEnabled:!0,soundEnabled:!0,joinMode:"autojoin",isTeamThreeTimesMinEnabled:!1,autoRejoinOnClanChange:m})}}loadSettings(){this.migrateSettings();let e=GM_getValue(L.autoJoinSettings,null);e&&(this.criteriaList=e.criteria||[],this.soundEnabled=e.soundEnabled!==void 0?e.soundEnabled:!0,this.joinMode=e.joinMode||"autojoin",this.isTeamThreeTimesMinEnabled=e.isTeamThreeTimesMinEnabled||!1,this.autoJoinEnabled=e.autoJoinEnabled!==void 0?e.autoJoinEnabled:!0,this.autoRejoinOnClanChange=e.autoRejoinOnClanChange!==void 0?e.autoRejoinOnClanChange:!1)}saveSettings(){GM_setValue(L.autoJoinSettings,{criteria:this.criteriaList,autoJoinEnabled:this.autoJoinEnabled,soundEnabled:this.soundEnabled,joinMode:this.joinMode,isTeamThreeTimesMinEnabled:this.isTeamThreeTimesMinEnabled,autoRejoinOnClanChange:this.autoRejoinOnClanChange})}updateSearchTimer(){let e=document.getElementById("search-timer");if(!e)return;if(!this.autoJoinEnabled||this.searchStartTime===null||!this.criteriaList||this.criteriaList.length===0){e.style.display="none",this.gameFoundTime=null;return}if(this.gameFoundTime!==null){let n=Math.floor((this.gameFoundTime-this.searchStartTime)/1e3);e.textContent=`Game found! (${Math.floor(n/60)}m ${n%60}s)`,e.style.display="inline";return}let t=Math.floor((Date.now()-this.searchStartTime)/1e3);e.textContent=`Searching: ${Math.floor(t/60)}m ${t%60}s`,e.style.display="inline"}updateCurrentGameInfo(){let e=document.getElementById("current-game-info");if(!e||!T.isOnLobbyPage()){e&&(e.style.display="none");return}e.style.display="block";let t=document.querySelector("public-lobby");if(!t||!t.lobbies||t.lobbies.length===0){e.textContent="Current game: No game",e.classList.add("not-applicable");return}let n=t.lobbies[0];if(!n||!n.gameConfig){e.textContent="Current game: No game",e.classList.add("not-applicable");return}let a=K(n);e.textContent=`Current game: ${a}`,e.classList.remove("not-applicable")}processLobbies(e){try{if(this.updateCurrentGameInfo(),this.isJoining||!this.autoJoinEnabled||!this.criteriaList||this.criteriaList.length===0||!T.isOnLobbyPage())return;this.joinMode==="notify"&&this.gameFoundTime!==null&&this.lastNotifiedGameID!==null&&(e.length>0?e[0]:null)?.gameID!==this.lastNotifiedGameID&&(this.gameFoundTime=null,this.lastNotifiedGameID=null,this.syncSearchTimer({resetStart:!0}));for(let t of e)if(this.engine.matchesCriteria(t,this.criteriaList)){if(this.recentlyLeftLobbyID===t.gameID)continue;if(this.joinMode==="notify"){this.notifiedLobbies.has(t.gameID)||(this.showGameFoundNotification(t),console.log("[AutoJoin] Sound enabled:",this.soundEnabled),this.soundEnabled&&A.playGameFoundSound(),this.notifiedLobbies.add(t.gameID),this.gameFoundTime=Date.now(),this.lastNotifiedGameID=t.gameID);return}else{this.joinedLobbies.has(t.gameID)||(this.joinLobby(t),this.joinedLobbies.add(t.gameID));return}}}catch(t){console.error("[AutoJoin] Error processing lobbies:",t)}}showGameFoundNotification(e){this.dismissNotification();let t=this.createNewNotification(e);document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add("notification-visible")}),this.notificationTimeout=setTimeout(()=>{this.dismissNotification(t)},1e4)}createNewNotification(e){let t=document.createElement("div");t.className="game-found-notification";let n=K(e);return t.innerHTML=`
      <div class="notification-title">Game Found</div>
      <div class="notification-detail">${n}</div>
      <div class="notification-hint">Click to dismiss</div>
    `,t.addEventListener("click",()=>{this.dismissNotification(t)}),t}dismissNotification(e=null){this.notificationTimeout&&(clearTimeout(this.notificationTimeout),this.notificationTimeout=null);let t=e?[e]:Array.from(document.querySelectorAll(".game-found-notification"));for(let n of t)n.classList.remove("notification-visible"),n.classList.add("notification-dismissing"),setTimeout(()=>{n.parentNode&&n.parentNode.removeChild(n)},300)}joinLobby(e){if(this.isJoining)return;console.log("[AutoJoin] Attempting to join lobby:",e.gameID),this.isJoining=!0,this.gameFoundTime=Date.now(),setTimeout(()=>{T.tryJoinLobby()?(console.log("[AutoJoin] Join initiated"),this.soundEnabled&&A.playGameStartSound(),this.recentlyLeftLobbyID=e.gameID,setTimeout(()=>{this.recentlyLeftLobbyID=null},5e3)):console.warn("[AutoJoin] Failed to join lobby"),this.isJoining=!1},100)}stopTimer(){this.timerInterval&&(clearInterval(this.timerInterval),this.timerInterval=null)}startGameInfoUpdates(){this.stopGameInfoUpdates(),this.updateCurrentGameInfo(),this.gameInfoInterval=setInterval(()=>this.updateCurrentGameInfo(),1e3)}stopGameInfoUpdates(){this.gameInfoInterval&&(clearInterval(this.gameInfoInterval),this.gameInfoInterval=null)}syncSearchTimer(e={}){let{resetStart:t=!1}=e;this.stopTimer(),t&&(this.searchStartTime=null,this.gameFoundTime=null,this.notifiedLobbies.clear(),this.lastNotifiedGameID=null),this.autoJoinEnabled&&this.criteriaList&&this.criteriaList.length>0?(this.searchStartTime===null&&(this.searchStartTime=Date.now()),this.timerInterval=setInterval(()=>this.updateSearchTimer(),100)):(this.searchStartTime=null,this.gameFoundTime=null),this.updateSearchTimer()}setAutoJoinEnabled(e,t={}){let{resetTimer:n=!1}=t;this.autoJoinEnabled=e,this.saveSettings(),this.updateUI(),this.syncSearchTimer({resetStart:n})}setCollapsed(e){this.isCollapsed=e,this.panel.classList.toggle("autojoin-collapsed",e);let t=document.getElementById("autojoin-collapse-toggle");t&&(t.setAttribute("aria-expanded",String(!e)),t.setAttribute("title",e?"Expand":"Collapse"))}setClanmateWatcherArmed(e){this.clanmateWatcherArmed=e,this.updateClanmateButtonState()}updateClanmateButtonState(){let e=document.getElementById("autojoin-clanmate-button");if(!e)return;let t="One-shot. Uses clan tag input. Independent of Auto-Join status.",n=!!this.lastActiveClanTag,a=this.lastActiveClanTag?this.lastActiveClanTag.toUpperCase():null;e.disabled=!n,e.setAttribute("title",t),this.clanmateWatcherArmed?(e.textContent="Waiting for clanmate...",e.classList.add("armed")):(e.textContent=n?`Join any [${a}] member`:"Set your clan tag to enable",e.classList.remove("armed"))}attemptClanmateJoin(){if(!this.clanmateWatcherArmed)return;this.setClanmateWatcherArmed(!1),T.tryJoinLobby()||console.warn("[AutoJoin] Clanmate auto-join attempt failed")}getNumberValue(e){let t=document.getElementById(e);if(!t)return null;let n=parseInt(t.value,10);return isNaN(n)?null:n}getAllTeamCountValues(){let e=[],t=["autojoin-team-duos","autojoin-team-trios","autojoin-team-quads","autojoin-team-2","autojoin-team-3","autojoin-team-4","autojoin-team-5","autojoin-team-6","autojoin-team-7"];for(let n of t){let a=document.getElementById(n);if(a?.checked){let o=a.value;if(o==="Duos"||o==="Trios"||o==="Quads")e.push(o);else{let r=parseInt(o,10);isNaN(r)||e.push(r)}}}return e}setAllTeamCounts(e){let t=["autojoin-team-duos","autojoin-team-trios","autojoin-team-quads","autojoin-team-2","autojoin-team-3","autojoin-team-4","autojoin-team-5","autojoin-team-6","autojoin-team-7"];for(let n of t){let a=document.getElementById(n);a&&(a.checked=e)}}buildCriteriaFromUI(){let e=[];if(document.getElementById("autojoin-ffa")?.checked&&e.push({gameMode:"FFA",minPlayers:this.getNumberValue("autojoin-ffa-min"),maxPlayers:this.getNumberValue("autojoin-ffa-max")}),document.getElementById("autojoin-team")?.checked){let o=this.getAllTeamCountValues();if(o.length===0)e.push({gameMode:"Team",teamCount:null,minPlayers:this.getNumberValue("autojoin-team-min"),maxPlayers:this.getNumberValue("autojoin-team-max")});else for(let r of o)e.push({gameMode:"Team",teamCount:r,minPlayers:this.getNumberValue("autojoin-team-min"),maxPlayers:this.getNumberValue("autojoin-team-max")})}return document.getElementById("autojoin-hvn")?.checked&&e.push({gameMode:"HvN",teamCount:null,minPlayers:null,maxPlayers:null}),e}updateUI(){let e=document.getElementById("autojoin-main-button"),t=document.querySelector(".status-text"),n=document.querySelector(".status-indicator");e&&(this.joinMode==="autojoin"?(e.textContent="Auto-Join",e.classList.add("active"),e.classList.remove("inactive")):(e.textContent="Notify Only",e.classList.remove("active"),e.classList.add("inactive"))),t&&n&&(this.autoJoinEnabled?(t.textContent="Active",n.style.background="#38d9a9",n.classList.add("active"),n.classList.remove("inactive")):(t.textContent="Inactive",n.style.background="#888",n.classList.remove("active"),n.classList.add("inactive")))}loadUIFromSettings(){let e=document.getElementById("autojoin-ffa"),t=document.getElementById("ffa-config"),n=this.criteriaList.some(g=>g.gameMode==="FFA");e&&(e.checked=n,t&&(t.style.display=n?"block":"none"));let a=document.getElementById("autojoin-team"),o=document.getElementById("team-config"),r=this.criteriaList.some(g=>g.gameMode==="Team");a&&(a.checked=r,o&&(o.style.display=r?"block":"none"));let l=this.criteriaList.filter(g=>g.gameMode==="Team"),c=l.map(g=>g.teamCount).filter(g=>g!==null);for(let g of c){let v=null;g==="Duos"?v=document.getElementById("autojoin-team-duos"):g==="Trios"?v=document.getElementById("autojoin-team-trios"):g==="Quads"?v=document.getElementById("autojoin-team-quads"):typeof g=="number"&&(v=document.getElementById(`autojoin-team-${g}`)),v&&(v.checked=!0)}let u=document.getElementById("autojoin-hvn"),m=this.criteriaList.some(g=>g.gameMode==="HvN");u&&(u.checked=m);let y=this.criteriaList.find(g=>g.gameMode==="FFA");if(y){let g=document.getElementById("autojoin-ffa-min"),v=document.getElementById("autojoin-ffa-max");g&&y.minPlayers!==null&&(g.value=String(y.minPlayers)),v&&y.maxPlayers!==null&&(v.value=String(y.maxPlayers))}let b=l[0];if(b){let g=document.getElementById("autojoin-team-min"),v=document.getElementById("autojoin-team-max");g&&b.minPlayers!==null&&(g.value=String(b.minPlayers)),v&&b.maxPlayers!==null&&(v.value=String(b.maxPlayers))}let C=document.getElementById("autojoin-sound-toggle");C&&(C.checked=this.soundEnabled);let S=document.getElementById("autojoin-auto-rejoin");S&&(S.checked=this.autoRejoinOnClanChange)}initializeSlider(e,t,n,a,o,r,l){let c=document.getElementById(e),u=document.getElementById(t),m=document.getElementById(n),y=document.getElementById(a);if(!c||!u||!m||!y)return;let b=parseInt(m.value,10),C=parseInt(y.value,10);Number.isNaN(b)||(c.value=String(b)),Number.isNaN(C)||(u.value=String(C));let S=()=>{this.updateSliderRange(e,t,n,a,o,r,l),this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})};c.addEventListener("input",S),u.addEventListener("input",S),this.updateSliderRange(e,t,n,a,o,r,l)}updateSliderRange(e,t,n,a,o,r,l){let c=document.getElementById(e),u=document.getElementById(t),m=document.getElementById(n),y=document.getElementById(a),b=document.getElementById(o),C=document.getElementById(r),S=document.getElementById(l);if(!c||!u||!m||!y)return;let g=parseInt(c.value,10),v=parseInt(u.value,10);if(e.includes("team")&&this.isTeamThreeTimesMinEnabled&&(v=Math.min(parseInt(u.max,10),Math.max(1,3*g)),u.value=String(v)),g>v&&(g=v,c.value=String(g)),m.value=String(g),y.value=String(v),C&&(C.textContent=g===1?"Any":String(g)),S&&(S.textContent=v===parseInt(u.max,10)?"Any":String(v)),b){let $=(g-parseInt(c.min,10))/(parseInt(c.max,10)-parseInt(c.min,10))*100,H=(v-parseInt(c.min,10))/(parseInt(c.max,10)-parseInt(c.min,10))*100;b.style.left=$+"%",b.style.width=H-$+"%"}}setupEventListeners(){document.getElementById("autojoin-main-button")?.addEventListener("click",()=>{this.joinMode=this.joinMode==="autojoin"?"notify":"autojoin",this.saveSettings(),this.updateUI()}),document.getElementById("autojoin-status")?.addEventListener("click",()=>{this.setAutoJoinEnabled(!this.autoJoinEnabled,{resetTimer:!0})}),document.getElementById("autojoin-clanmate-button")?.addEventListener("click",()=>{if(this.clanmateWatcherArmed){this.setClanmateWatcherArmed(!1);return}if(!this.lastActiveClanTag){this.setClanmateWatcherArmed(!1);return}this.setClanmateWatcherArmed(!0),this.lastClanmateMatch&&this.attemptClanmateJoin()}),this.panel.querySelector(".autojoin-header")?.addEventListener("click",c=>{c.target.closest("#autojoin-collapse-toggle")||this.setCollapsed(!this.isCollapsed)}),document.getElementById("autojoin-collapse-toggle")?.addEventListener("click",c=>{c.stopPropagation(),this.setCollapsed(!this.isCollapsed)});let e=document.getElementById("autojoin-ffa");e&&e.addEventListener("change",()=>{let c=document.getElementById("ffa-config");c&&(c.style.display=e.checked?"block":"none"),this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})});let t=document.getElementById("autojoin-team");t&&t.addEventListener("change",()=>{let c=document.getElementById("team-config");c&&(c.style.display=t.checked?"block":"none"),this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})});let n=document.getElementById("autojoin-hvn");n&&n.addEventListener("change",()=>{this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})});let a=document.getElementById("autojoin-team-three-times");a&&(a.checked=this.isTeamThreeTimesMinEnabled,a.addEventListener("change",()=>{this.isTeamThreeTimesMinEnabled=a.checked,this.saveSettings(),this.updateUI();let c=document.getElementById("autojoin-team-min-slider"),u=document.getElementById("autojoin-team-max-slider");if(c&&u){let m=parseInt(c.value,10);u.value=this.isTeamThreeTimesMinEnabled?String(Math.min(50,Math.max(1,3*m))):u.value,this.updateSliderRange("autojoin-team-min-slider","autojoin-team-max-slider","autojoin-team-min","autojoin-team-max","team-range-fill","team-min-value","team-max-value")}})),document.getElementById("autojoin-team-select-all")?.addEventListener("click",()=>{this.setAllTeamCounts(!0),this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})}),document.getElementById("autojoin-team-deselect-all")?.addEventListener("click",()=>{this.setAllTeamCounts(!1),this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})});let o=["autojoin-team-2","autojoin-team-3","autojoin-team-4","autojoin-team-5","autojoin-team-6","autojoin-team-7","autojoin-team-duos","autojoin-team-trios","autojoin-team-quads"];for(let c of o)document.getElementById(c)?.addEventListener("change",()=>{this.criteriaList=this.buildCriteriaFromUI(),this.saveSettings(),this.syncSearchTimer({resetStart:!0})});let r=document.getElementById("autojoin-sound-toggle");r&&r.addEventListener("change",()=>{this.soundEnabled=r.checked,this.saveSettings()});let l=document.getElementById("autojoin-auto-rejoin");l&&l.addEventListener("change",()=>{this.autoRejoinOnClanChange=l.checked,this.saveSettings()})}createUI(){if(document.getElementById("openfront-autojoin-panel"))return;this.panel=document.createElement("div"),this.panel.id="openfront-autojoin-panel",this.panel.className="of-panel autojoin-panel",this.panel.innerHTML=`
      <div class="of-header autojoin-header">
        <div class="autojoin-title">
          <span class="autojoin-title-text">Tactical Auto-Join</span>
          <span class="autojoin-title-sub">HUD ACTIVE</span>
        </div>
        <button type="button" id="autojoin-collapse-toggle" class="autojoin-collapse-button" aria-label="Collapse Auto-Join" title="Collapse">\u25BE</button>
      </div>
      <div class="autojoin-body">
        <div class="of-content autojoin-content">
          <div class="autojoin-status-bar">
            <div class="autojoin-status" id="autojoin-status">
              <span class="status-indicator"></span>
              <span class="status-text">Active</span>
              <span class="search-timer" id="search-timer" style="display: none;"></span>
            </div>
            <label class="autojoin-toggle-label">
              <input type="checkbox" id="autojoin-sound-toggle">
              <span>Sound</span>
            </label>
          </div>
          <div class="autojoin-action-row">
            <button type="button" id="autojoin-main-button" class="autojoin-main-button active">Auto-Join</button>
            <button type="button" id="autojoin-clanmate-button" class="autojoin-clanmate-button">Join the game if any member of your clan is in the lobby</button>
          </div>
          <div class="autojoin-section">
            <div class="autojoin-section-title">Modes</div>
            <div class="autojoin-config-grid">
            <div class="autojoin-mode-config autojoin-config-card">
              <label class="mode-checkbox-label"><input type="checkbox" id="autojoin-ffa" name="gameMode" value="FFA"><span>FFA</span></label>
              <div class="autojoin-mode-inner" id="ffa-config" style="display: none;">
                <div class="player-filter-info"><small>Filter by max players:</small></div>
                <div class="capacity-range-wrapper">
                  <div class="capacity-range-visual">
                    <div class="capacity-track">
                      <div class="capacity-range-fill" id="ffa-range-fill"></div>
                      <input type="range" id="autojoin-ffa-min-slider" min="1" max="100" value="1" class="capacity-slider capacity-slider-min">
                      <input type="range" id="autojoin-ffa-max-slider" min="1" max="100" value="100" class="capacity-slider capacity-slider-max">
                    </div>
                    <div class="capacity-labels">
                      <div class="capacity-label-group"><label for="autojoin-ffa-min-slider">Min:</label><span class="capacity-value" id="ffa-min-value">Any</span></div>
                      <div class="capacity-label-group"><label for="autojoin-ffa-max-slider">Max:</label><span class="capacity-value" id="ffa-max-value">Any</span></div>
                    </div>
                  </div>
                  <div class="capacity-inputs-hidden">
                    <input type="number" id="autojoin-ffa-min" min="1" max="100" style="display: none;">
                    <input type="number" id="autojoin-ffa-max" min="1" max="100" style="display: none;">
                  </div>
                </div>
              </div>
            </div>
            <div class="autojoin-mode-config autojoin-config-card">
              <label class="mode-checkbox-label"><input type="checkbox" id="autojoin-hvn" name="gameMode" value="HvN"><span>Humans Vs Nations</span></label>
            </div>
            <div class="autojoin-mode-config autojoin-config-card">
              <label class="mode-checkbox-label"><input type="checkbox" id="autojoin-team" name="gameMode" value="Team"><span>Team</span></label>
              <div class="autojoin-mode-inner" id="team-config" style="display: none;">
                <div class="team-count-section">
                  <label>Teams (optional):</label>
                  <div>
                    <button type="button" id="autojoin-team-select-all" class="select-all-btn">Select All</button>
                    <button type="button" id="autojoin-team-deselect-all" class="select-all-btn">Deselect All</button>
                  </div>
                  <div class="team-count-options-centered">
                    <div class="team-count-column">
                      <label><input type="checkbox" id="autojoin-team-duos" value="Duos"> Duos</label>
                      <label><input type="checkbox" id="autojoin-team-trios" value="Trios"> Trios</label>
                      <label><input type="checkbox" id="autojoin-team-quads" value="Quads"> Quads</label>
                    </div>
                    <div class="team-count-column">
                      <label><input type="checkbox" id="autojoin-team-2" value="2"> 2 teams</label>
                      <label><input type="checkbox" id="autojoin-team-3" value="3"> 3 teams</label>
                      <label><input type="checkbox" id="autojoin-team-4" value="4"> 4 teams</label>
                    </div>
                    <div class="team-count-column">
                      <label><input type="checkbox" id="autojoin-team-5" value="5"> 5 teams</label>
                      <label><input type="checkbox" id="autojoin-team-6" value="6"> 6 teams</label>
                      <label><input type="checkbox" id="autojoin-team-7" value="7"> 7 teams</label>
                    </div>
                  </div>
                </div>
                <div class="player-filter-info"><small>Filter by players per team:</small></div>
                <div class="capacity-range-wrapper">
                  <div class="capacity-range-visual">
                    <div class="capacity-track">
                      <div class="capacity-range-fill" id="team-range-fill"></div>
                      <input type="range" id="autojoin-team-min-slider" min="1" max="50" value="1" class="capacity-slider capacity-slider-min">
                      <input type="range" id="autojoin-team-max-slider" min="1" max="50" value="50" class="capacity-slider capacity-slider-max">
                    </div>
                    <div class="capacity-labels">
                      <div class="capacity-label-group"><label for="autojoin-team-min-slider">Min:</label><span class="capacity-value" id="team-min-value">1</span></div>
                      <div class="three-times-checkbox"><label for="autojoin-team-three-times">3\xD7</label><input type="checkbox" id="autojoin-team-three-times"></div>
                      <div class="capacity-label-group"><label for="autojoin-team-max-slider">Max:</label><span class="capacity-value" id="team-max-value">50</span></div>
                    </div>
                  </div>
                  <div class="capacity-inputs-hidden">
                    <input type="number" id="autojoin-team-min" min="1" max="50" style="display: none;">
                    <input type="number" id="autojoin-team-max" min="1" max="50" style="display: none;">
                  </div>
                </div>
                <div class="current-game-info" id="current-game-info" style="display: none;"></div>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div class="of-footer autojoin-footer">
          <div class="autojoin-settings">
            <label class="autojoin-toggle-label"><input type="checkbox" id="autojoin-auto-rejoin"><span>Auto rejoin on clan tag apply</span></label>
          </div>
        </div>
      </div>
    `;let e=document.getElementById("of-autojoin-slot");e?e.appendChild(this.panel):(console.warn("[AutoJoin] Auto-join slot not found, appending to body"),document.body.appendChild(this.panel)),this.setupEventListeners(),this.setCollapsed(!1),this.loadUIFromSettings(),this.updateClanmateButtonState(),this.initializeSlider("autojoin-ffa-min-slider","autojoin-ffa-max-slider","autojoin-ffa-min","autojoin-ffa-max","ffa-range-fill","ffa-min-value","ffa-max-value"),this.initializeSlider("autojoin-team-min-slider","autojoin-team-max-slider","autojoin-team-min","autojoin-team-max","team-range-fill","team-min-value","team-max-value"),this.updateUI(),this.syncSearchTimer(),this.startGameInfoUpdates()}updateSleepState(){let e=T.isOnLobbyPage();this.sleeping=!e,this.sleeping?(this.panel.classList.add("hidden"),this.stopTimer(),this.stopGameInfoUpdates()):(this.panel.classList.remove("hidden"),this.syncSearchTimer(),this.startGameInfoUpdates())}cleanup(){this.stopTimer(),this.stopGameInfoUpdates(),this.notificationTimeout&&clearTimeout(this.notificationTimeout),this.panel&&this.panel.parentNode&&this.panel.parentNode.removeChild(this.panel),this.dismissNotification()}};function ae(){if(!document.body){console.warn("[OpenFront Bundle] Body not ready, retrying layout wrapper injection..."),setTimeout(ae,100);return}if(document.getElementById("of-game-layout-wrapper")){console.log("[OpenFront Bundle] Layout wrapper already exists");return}let i=document.body,e=document.createElement("div");e.id="of-game-layout-wrapper";let t=document.createElement("div");for(t.id="of-game-content";i.firstChild;)t.appendChild(i.firstChild);e.appendChild(t),i.appendChild(e);let a=GM_getValue(L.playerListPanelSize)?.width||300;document.documentElement.style.setProperty("--player-list-width",a+"px"),console.log("[OpenFront Bundle] Layout wrapper injected \u2705")}(function(){"use strict";console.log("[OpenFront Bundle] Initializing v2.3.0..."),GM_addStyle(Y()),console.log("[OpenFront Bundle] Styles injected \u2705"),ae(),A.preloadSounds(),console.log("[OpenFront Bundle] Sound system initialized \u2705"),E.init(),console.log("[OpenFront Bundle] URL observer initialized \u2705"),W.start(),console.log("[OpenFront Bundle] Lobby data manager started \u2705"),k.fetch(),console.log("[OpenFront Bundle] Clan leaderboard caching started \u2705");let i=new O;console.log("[OpenFront Bundle] Player list initialized \u2705");let e=new D;console.log("[OpenFront Bundle] Auto-join initialized \u2705"),i.onPlayerListUpdate(t=>{e.handleClanmateUpdate(t)}),W.subscribe(t=>{i.receiveLobbyUpdate(t),e.receiveLobbyUpdate(t)}),console.log("[OpenFront Bundle] Modules subscribed to lobby updates \u2705"),console.log("[OpenFront Bundle] Ready! \u{1F680}")})();})();
