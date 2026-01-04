// ==UserScript==
// @name         Wplaceハロウィンイベントカボチャ自動獲得ツール
// @name:en      Wplace Halloween Event Auto Pumpkin Collector
// @description  Wplaceのハロウィンイベントのパンプキンハントのカボチャを自動で獲得できるツールです。
// @description:en Automatically collect pumpkins in Wplace's Halloween Pumpkin Hunt event.
// @version      1.0
// @namespace    torokesou
// @author       torokesou
// @license      MIT
// @icon         https://files.catbox.moe/2tp3kl.png
// @match        https://wplace.live/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554465/Wplace%E3%83%8F%E3%83%AD%E3%82%A6%E3%82%A3%E3%83%B3%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%82%AB%E3%83%9C%E3%83%81%E3%83%A3%E8%87%AA%E5%8B%95%E7%8D%B2%E5%BE%97%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/554465/Wplace%E3%83%8F%E3%83%AD%E3%82%A6%E3%82%A3%E3%83%B3%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%82%AB%E3%83%9C%E3%83%81%E3%83%A3%E8%87%AA%E5%8B%95%E7%8D%B2%E5%BE%97%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LANG_KEY = 'pumpkin_auto_claimer_lang';
    let currentLang = localStorage.getItem(LANG_KEY) || 'ja';
    
    const translations = {
        ja: {
            title: 'カボチャ自動獲得ツール',
            claimed: '獲得済み',
            discovered: '発見済み',
            remaining: '残り',
            progress: '進捗状況',
            start: '開始',
            stop: '停止',
            refresh: '更新',
            close: '閉じる',
            ready: '準備完了',
            manualRefresh: '手動更新を実行中...',
            fetchingClaimed: '獲得済み情報を取得中...',
            fetchingLocations: '座標情報を取得中...',
            claimedSuccess: '獲得済み: {0}個',
            locationsSuccess: '座標取得: {0}個発見（現在時刻）',
            claimedFail: '獲得済み情報の取得失敗: {0}',
            locationsFail: '座標情報の取得失敗: {0}',
            claiming: '{0}個のカボチャを獲得中...',
            claimSuccess: '🎃 #{0} を獲得しました！',
            claimFail: '#{0} の獲得失敗: {1}',
            claimError: '#{0} の獲得エラー: {1}',
            allClaimed: 'すべてのカボチャを獲得済みです！',
            autoClaimComplete: '自動獲得完了！',
            started: '自動獲得を開始しました',
            stopped: '自動獲得を停止しました',
            initialized: 'カボチャ自動獲得ツールを起動しました',
            listTitle: 'カボチャ一覧',
            currentHour: '現在時刻で発見済み',
            madeBy: 'made by torokesou'
        },
        en: {
            title: 'Auto Pumpkin Collector',
            claimed: 'Claimed',
            discovered: 'Discovered',
            remaining: 'Remaining',
            progress: 'Progress',
            start: 'Start',
            stop: 'Stop',
            refresh: 'Refresh',
            close: 'Close',
            ready: 'Ready',
            manualRefresh: 'Manual refresh in progress...',
            fetchingClaimed: 'Fetching claimed pumpkins...',
            fetchingLocations: 'Fetching pumpkin locations...',
            claimedSuccess: 'Claimed: {0} pumpkins',
            locationsSuccess: 'Locations: {0} found (current hour)',
            claimedFail: 'Failed to fetch claimed: {0}',
            locationsFail: 'Failed to fetch locations: {0}',
            claiming: 'Claiming {0} pumpkins...',
            claimSuccess: '🎃 Claimed #{0}!',
            claimFail: 'Failed to claim #{0}: {1}',
            claimError: 'Error claiming #{0}: {1}',
            allClaimed: 'All pumpkins claimed!',
            autoClaimComplete: 'Auto-claim complete!',
            started: 'Auto-claim started',
            stopped: 'Auto-claim stopped',
            initialized: 'Pumpkin auto-claimer initialized',
            listTitle: 'Pumpkin List',
            currentHour: 'Current Hour Discovered',
            madeBy: 'made by torokesou'
        }
    };

    function t(key, ...args) {
        let text = translations[currentLang][key] || translations.ja[key] || key;
        args.forEach((arg, index) => {
            text = text.replace(`{${index}}`, arg);
        });
        return text;
    }

    let claimedPumpkins = [];
    let pumpkinLocations = {};
    let currentHourPumpkins = {};
    let isRunning = false;
    let updateInterval = null;
    let uiContainer = null;
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let xOffset = 0;
    let yOffset = 0;

    function getCurrentHour() {
        const now = new Date();
        return now.getHours();
    }

    function isCurrentHourPumpkin(pumpkin) {
        if (!pumpkin.foundAt) return false;
        const foundDate = new Date(pumpkin.foundAt);
        const currentHour = getCurrentHour();
        return foundDate.getHours() === currentHour;
    }

    function filterCurrentHourPumpkins(locations) {
        const filtered = {};
        for (const [id, location] of Object.entries(locations)) {
            if (isCurrentHourPumpkin(location)) {
                filtered[id] = location;
            }
        }
        return filtered;
    }

    function createUI() {
        const style = document.createElement('style');
        style.textContent = `
            div#pumpkin-auto-claimer-container-unique-id {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 360px;
                background: rgba(17, 24, 39, 0.5);
                border: 1px solid rgba(139, 92, 246, 0.35);
                border-radius: 16px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                color: #f3f4f6;
                z-index: 999999;
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                overflow: hidden;
                transition: opacity 0.2s;
                font-size: 14px;
                line-height: 1.5;
            }
            div#pumpkin-auto-claimer-container-unique-id.pumpkin-hidden {
                opacity: 0;
                pointer-events: none;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-header {
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(217, 70, 239, 0.25));
                padding: 14px 16px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(139, 92, 246, 0.25);
                user-select: none;
                -webkit-user-select: none;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-title {
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1;
                pointer-events: none;
            }
            div#pumpkin-auto-claimer-container-unique-id span.pumpkin-icon {
                font-size: 20px;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-header-buttons {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            div#pumpkin-auto-claimer-container-unique-id button.pumpkin-header-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: #f3f4f6;
                cursor: pointer;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 6px;
                transition: all 0.2s;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-family: inherit;
            }
            div#pumpkin-auto-claimer-container-unique-id button.pumpkin-header-btn:hover {
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(139, 92, 246, 0.5);
            }
            div#pumpkin-auto-claimer-container-unique-id button.pumpkin-icon-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: #f3f4f6;
                cursor: pointer;
                font-size: 14px;
                width: 28px;
                height: 28px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                padding: 0;
                font-family: inherit;
            }
            div#pumpkin-auto-claimer-container-unique-id button.pumpkin-icon-btn:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: scale(1.05);
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-content {
                padding: 16px;
                max-height: 600px;
                overflow-y: auto;
                transition: max-height 0.3s, padding 0.3s;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-content.pumpkin-collapsed {
                max-height: 0;
                padding: 0 16px;
                overflow: hidden;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-stat-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-bottom: 16px;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-stat-item {
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(217, 70, 239, 0.1));
                padding: 14px 12px;
                border-radius: 10px;
                text-align: center;
                border: 1px solid rgba(139, 92, 246, 0.25);
                transition: transform 0.2s;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-stat-item:hover {
                transform: translateY(-2px);
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-stat-value {
                font-size: 24px;
                font-weight: 700;
                color: #c4b5fd;
                margin-bottom: 4px;
                text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-stat-label {
                font-size: 10px;
                color: #d1d5db;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-weight: 500;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-progress-container {
                margin-bottom: 16px;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-progress-label {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #d1d5db;
                margin-bottom: 8px;
                font-weight: 500;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-progress-bar {
                height: 10px;
                background: rgba(31, 41, 55, 0.8);
                border-radius: 5px;
                overflow: hidden;
                border: 1px solid rgba(139, 92, 246, 0.2);
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #8b5cf6, #d946ef, #ec4899);
                border-radius: 5px;
                transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                width: 0%;
                box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-button-group {
                display: flex;
                gap: 10px;
                margin-bottom: 16px;
            }
            div#pumpkin-auto-claimer-container-unique-id button.pumpkin-btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-family: inherit;
            }
            div#pumpkin-auto-claimer-container-unique-id button.pumpkin-btn-primary {
                background: linear-gradient(135deg, #8b5cf6, #d946ef);
                color: white;
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
            }
            div#pumpkin-auto-claimer-container-unique-id button.pumpkin-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
            }
            div#pumpkin-auto-claimer-container-unique-id button.pumpkin-btn-primary.pumpkin-running {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
            }
            div#pumpkin-auto-claimer-container-unique-id button.pumpkin-btn-secondary {
                background: rgba(75, 85, 99, 0.6);
                color: #f3f4f6;
                border: 1px solid rgba(139, 92, 246, 0.3);
            }
            div#pumpkin-auto-claimer-container-unique-id button.pumpkin-btn-secondary:hover {
                background: rgba(75, 85, 99, 0.8);
                border-color: rgba(139, 92, 246, 0.5);
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-list-section {
                margin-bottom: 16px;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-list-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 12px;
                background: rgba(139, 92, 246, 0.15);
                border-radius: 8px;
                cursor: pointer;
                user-select: none;
                margin-bottom: 8px;
                border: 1px solid rgba(139, 92, 246, 0.25);
                transition: all 0.2s;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-list-header:hover {
                background: rgba(139, 92, 246, 0.2);
            }
            div#pumpkin-auto-claimer-container-unique-id span.pumpkin-list-title {
                font-size: 12px;
                font-weight: 600;
                color: #c4b5fd;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            div#pumpkin-auto-claimer-container-unique-id span.pumpkin-list-toggle {
                font-size: 12px;
                color: #d1d5db;
                transition: transform 0.3s;
                display: inline-block;
            }
            div#pumpkin-auto-claimer-container-unique-id span.pumpkin-list-toggle.pumpkin-collapsed {
                transform: rotate(-90deg);
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-list-content {
                max-height: 300px;
                overflow-y: auto;
                transition: max-height 0.3s, opacity 0.3s;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-list-content.pumpkin-collapsed {
                max-height: 0;
                opacity: 0;
                overflow: hidden;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-grid {
                display: grid;
                grid-template-columns: repeat(10, 1fr);
                gap: 6px;
                padding: 8px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                border: 1px solid rgba(139, 92, 246, 0.2);
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-cell {
                aspect-ratio: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 600;
                border-radius: 4px;
                border: 1px solid rgba(75, 85, 99, 0.5);
                background: rgba(31, 41, 55, 0.6);
                color: #9ca3af;
                transition: all 0.2s;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-cell.pumpkin-claimed {
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3));
                border-color: rgba(16, 185, 129, 0.5);
                color: #6ee7b7;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-cell.pumpkin-discovered {
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(217, 70, 239, 0.3));
                border-color: rgba(139, 92, 246, 0.5);
                color: #c4b5fd;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-cell:hover {
                transform: scale(1.1);
                z-index: 1;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-log-container {
                background: rgba(0, 0, 0, 0.4);
                border-radius: 8px;
                padding: 12px;
                max-height: 180px;
                overflow-y: auto;
                font-size: 11px;
                font-family: 'Courier New', 'Consolas', monospace;
                border: 1px solid rgba(139, 92, 246, 0.2);
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-log-entry {
                padding: 5px 0;
                border-bottom: 1px solid rgba(139, 92, 246, 0.1);
                line-height: 1.4;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-log-entry:last-child {
                border-bottom: none;
            }
            div#pumpkin-auto-claimer-container-unique-id span.pumpkin-log-time {
                color: #6b7280;
                margin-right: 8px;
                font-weight: 600;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-log-entry.pumpkin-log-success {
                color: #6ee7b7;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-log-entry.pumpkin-log-error {
                color: #fca5a5;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-log-entry.pumpkin-log-info {
                color: #93c5fd;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-footer {
                text-align: center;
                padding: 8px;
                font-size: 10px;
                color: #9ca3af;
                border-top: 1px solid rgba(139, 92, 246, 0.2);
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-content::-webkit-scrollbar,
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-list-content::-webkit-scrollbar,
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-log-container::-webkit-scrollbar {
                width: 8px;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-content::-webkit-scrollbar-track,
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-list-content::-webkit-scrollbar-track,
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-log-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
            }
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-content::-webkit-scrollbar-thumb,
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-list-content::-webkit-scrollbar-thumb,
            div#pumpkin-auto-claimer-container-unique-id div.pumpkin-log-container::-webkit-scrollbar-thumb {
                background: rgba(139, 92, 246, 0.6);
                border-radius: 4px;
            }
            div#pumpkin-auto-claimer-container-unique-id span.pumpkin-status-indicator {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 6px;
                animation: pumpkin-pulse 2s infinite;
            }
            div#pumpkin-auto-claimer-container-unique-id span.pumpkin-status-running {
                background: #6ee7b7;
                box-shadow: 0 0 10px rgba(110, 231, 183, 0.8);
            }
            div#pumpkin-auto-claimer-container-unique-id span.pumpkin-status-stopped {
                background: #6b7280;
            }
            @keyframes pumpkin-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
        
        const container = document.createElement('div');
        container.id = 'pumpkin-auto-claimer-container-unique-id';
        container.innerHTML = `
            <div class="pumpkin-header">
                <div class="pumpkin-title">
                    <span class="pumpkin-icon">🎃</span>
                    <span id="pumpkin-title-text">${t('title')}</span>
                </div>
                <div class="pumpkin-header-buttons">
                    <button class="pumpkin-header-btn" id="pumpkin-lang-toggle">${currentLang.toUpperCase()}</button>
                    <button class="pumpkin-icon-btn" id="pumpkin-collapse-toggle">▼</button>
                    <button class="pumpkin-icon-btn" id="pumpkin-close-btn">✕</button>
                </div>
            </div>
            <div class="pumpkin-content" id="pumpkin-content">
                <div class="pumpkin-stat-grid">
                    <div class="pumpkin-stat-item">
                        <div class="pumpkin-stat-value" id="pumpkin-stat-claimed">0</div>
                        <div class="pumpkin-stat-label" data-pumpkin-i18n="claimed">${t('claimed')}</div>
                    </div>
                    <div class="pumpkin-stat-item">
                        <div class="pumpkin-stat-value" id="pumpkin-stat-discovered">0</div>
                        <div class="pumpkin-stat-label" data-pumpkin-i18n="discovered">${t('discovered')}</div>
                    </div>
                    <div class="pumpkin-stat-item">
                        <div class="pumpkin-stat-value" id="pumpkin-stat-remaining">100</div>
                        <div class="pumpkin-stat-label" data-pumpkin-i18n="remaining">${t('remaining')}</div>
                    </div>
                </div>
                <div class="pumpkin-progress-container">
                    <div class="pumpkin-progress-label">
                        <span data-pumpkin-i18n="progress">${t('progress')}</span>
                        <span id="pumpkin-progress-text">0%</span>
                    </div>
                    <div class="pumpkin-progress-bar">
                        <div class="pumpkin-progress-fill" id="pumpkin-progress-fill"></div>
                    </div>
                </div>
                <div class="pumpkin-button-group">
                    <button class="pumpkin-btn pumpkin-btn-primary" id="pumpkin-btn-start">
                        <span class="pumpkin-status-indicator pumpkin-status-stopped"></span>
                        <span data-pumpkin-i18n="start">${t('start')}</span>
                    </button>
                    <button class="pumpkin-btn pumpkin-btn-secondary" id="pumpkin-btn-refresh" data-pumpkin-i18n="refresh">${t('refresh')}</button>
                </div>
                <div class="pumpkin-list-section">
                    <div class="pumpkin-list-header" id="pumpkin-claimed-list-header">
                        <span class="pumpkin-list-title" data-pumpkin-i18n="claimed">${t('claimed')} (0/100)</span>
                        <span class="pumpkin-list-toggle pumpkin-collapsed">▼</span>
                    </div>
                    <div class="pumpkin-list-content pumpkin-collapsed" id="pumpkin-claimed-list-content">
                        <div class="pumpkin-grid" id="pumpkin-claimed-grid"></div>
                    </div>
                </div>
                <div class="pumpkin-list-section">
                    <div class="pumpkin-list-header" id="pumpkin-discovered-list-header">
                        <span class="pumpkin-list-title" data-pumpkin-i18n="currentHour">${t('currentHour')} (0/100)</span>
                        <span class="pumpkin-list-toggle pumpkin-collapsed">▼</span>
                    </div>
                    <div class="pumpkin-list-content pumpkin-collapsed" id="pumpkin-discovered-list-content">
                        <div class="pumpkin-grid" id="pumpkin-discovered-grid"></div>
                    </div>
                </div>
                <div class="pumpkin-log-container" id="pumpkin-log-container">
                    <div class="pumpkin-log-entry pumpkin-log-info">
                        <span class="pumpkin-log-time">${getTimeString()}</span>
                        <span data-pumpkin-i18n="ready">${t('ready')}</span>
                    </div>
                </div>
            </div>
            <div class="pumpkin-footer">
                <span data-pumpkin-i18n="madeBy">${t('madeBy')}</span>
            </div>
        `;
        
        document.body.appendChild(container);
        uiContainer = container;
        
        setupEventListeners();
        updatePumpkinLists();
    }

    function setupEventListeners() {
        const header = uiContainer.querySelector('.pumpkin-header');
        const toggleBtn = document.getElementById('pumpkin-collapse-toggle');
        const closeBtn = document.getElementById('pumpkin-close-btn');
        const langToggle = document.getElementById('pumpkin-lang-toggle');
        const content = document.getElementById('pumpkin-content');
        const startBtn = document.getElementById('pumpkin-btn-start');
        const refreshBtn = document.getElementById('pumpkin-btn-refresh');
        
        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            content.classList.toggle('pumpkin-collapsed');
            toggleBtn.textContent = content.classList.contains('pumpkin-collapsed') ? '▲' : '▼';
        });
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            uiContainer.classList.add('pumpkin-hidden');
        });
        
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            currentLang = currentLang === 'ja' ? 'en' : 'ja';
            localStorage.setItem(LANG_KEY, currentLang);
            langToggle.textContent = currentLang.toUpperCase();
            updateUILanguage();
        });
        
        startBtn.addEventListener('click', toggleAutoClaim);
        
        refreshBtn.addEventListener('click', async () => {
            addLog(t('manualRefresh'), 'info');
            await updateData();
        });
        
        setupListToggle('pumpkin-claimed-list-header', 'pumpkin-claimed-list-content');
        setupListToggle('pumpkin-discovered-list-header', 'pumpkin-discovered-list-content');
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                uiContainer.classList.remove('pumpkin-hidden');
            }
        });
    }

    function setupListToggle(headerId, contentId) {
        const header = document.getElementById(headerId);
        const content = document.getElementById(contentId);
        const toggle = header.querySelector('.pumpkin-list-toggle');
        
        header.addEventListener('click', () => {
            content.classList.toggle('pumpkin-collapsed');
            toggle.classList.toggle('pumpkin-collapsed');
        });
    }

    function updateUILanguage() {
        document.getElementById('pumpkin-title-text').textContent = t('title');
        
        document.querySelectorAll('[data-pumpkin-i18n]').forEach(el => {
            const key = el.getAttribute('data-pumpkin-i18n');
            el.textContent = t(key);
        });
        
        const startBtn = document.getElementById('pumpkin-btn-start');
        const btnText = startBtn.querySelector('span:not(.pumpkin-status-indicator)');
        if (btnText) {
            btnText.textContent = isRunning ? t('stop') : t('start');
        }
        
        updatePumpkinListTitles();
    }

    function updatePumpkinListTitles() {
        const claimedCount = claimedPumpkins.length;
        const discoveredCount = Object.keys(currentHourPumpkins).length;
        
        document.querySelector('#pumpkin-claimed-list-header .pumpkin-list-title').textContent = 
            `${t('claimed')} (${claimedCount}/100)`;
        document.querySelector('#pumpkin-discovered-list-header .pumpkin-list-title').textContent = 
            `${t('currentHour')} (${discoveredCount}/100)`;
    }

    function dragStart(e) {
        if (e.target.closest('.pumpkin-header-btn') || e.target.closest('.pumpkin-icon-btn')) {
            return;
        }
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            
            setTranslate(currentX, currentY, uiContainer);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function getTimeString() {
        const now = new Date();
        return now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function addLog(message, type = 'info') {
        const logContainer = document.getElementById('pumpkin-log-container');
        const logEntry = document.createElement('div');
        logEntry.className = `pumpkin-log-entry pumpkin-log-${type}`;
        logEntry.innerHTML = `<span class="pumpkin-log-time">${getTimeString()}</span><span>${message}</span>`;
        
        logContainer.insertBefore(logEntry, logContainer.firstChild);
        
        while (logContainer.children.length > 30) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }

    function updatePumpkinLists() {
        updateClaimedList();
        updateDiscoveredList();
        updatePumpkinListTitles();
    }

    function updateClaimedList() {
        const grid = document.getElementById('pumpkin-claimed-grid');
        grid.innerHTML = '';
        
        for (let i = 1; i <= 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'pumpkin-cell';
            cell.textContent = i;
            
            if (claimedPumpkins.includes(i)) {
                cell.classList.add('pumpkin-claimed');
            } else if (currentHourPumpkins[i]) {
                cell.classList.add('pumpkin-discovered');
            }
            
            grid.appendChild(cell);
        }
    }

    function updateDiscoveredList() {
        const grid = document.getElementById('pumpkin-discovered-grid');
        grid.innerHTML = '';
        
        for (let i = 1; i <= 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'pumpkin-cell';
            cell.textContent = i;
            
            if (currentHourPumpkins[i]) {
                cell.classList.add('pumpkin-discovered');
            }
            
            grid.appendChild(cell);
        }
    }

    function updateStats() {
        const claimedCount = claimedPumpkins.length;
        const discoveredCount = Object.keys(currentHourPumpkins).length;
        const remaining = 100 - claimedCount;
        
        document.getElementById('pumpkin-stat-claimed').textContent = claimedCount;
        document.getElementById('pumpkin-stat-discovered').textContent = discoveredCount;
        document.getElementById('pumpkin-stat-remaining').textContent = remaining;
        
        const progress = (claimedCount / 100 * 100).toFixed(1);
        document.getElementById('pumpkin-progress-text').textContent = `${progress}%`;
        document.getElementById('pumpkin-progress-fill').style.width = `${progress}%`;
        
        updatePumpkinLists();
    }

    async function fetchClaimedPumpkins() {
        try {
            addLog(t('fetchingClaimed'), 'info');
            const response = await fetch('https://backend.wplace.live/event/hallowen/pumpkins/claimed', {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            claimedPumpkins = data.claimed || [];
            addLog(t('claimedSuccess', claimedPumpkins.length), 'success');
            return true;
        } catch (error) {
            addLog(t('claimedFail', error.message), 'error');
            return false;
        }
    }

    async function fetchPumpkinLocations() {
        try {
            addLog(t('fetchingLocations'), 'info');
            const response = await fetch('https://wplace.samuelscheit.com/tiles/pumpkin.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            pumpkinLocations = data;
            
            currentHourPumpkins = filterCurrentHourPumpkins(data);
            
            addLog(t('locationsSuccess', Object.keys(currentHourPumpkins).length), 'success');
            return true;
        } catch (error) {
            addLog(t('locationsFail', error.message), 'error');
            return false;
        }
    }

    async function claimPumpkin(id, location) {
        try {
            const response = await fetch('https://backend.wplace.live/s0/event/pixel/claim', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                referrer: 'https://wplace.live/',
                headers: { 'content-type': 'text/plain;charset=UTF-8' },
                body: JSON.stringify({
                    event: 'halloween',
                    tx: location.tileX,
                    ty: location.tileY,
                    px: location.offsetX,
                    py: location.offsetY
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success !== false) {
                claimedPumpkins.push(parseInt(id));
                addLog(t('claimSuccess', id), 'success');
                return true;
            } else {
                addLog(t('claimFail', id, result.error || 'Unknown'), 'error');
                return false;
            }
        } catch (error) {
            addLog(t('claimError', id, error.message), 'error');
            return false;
        }
    }

    async function autoClaimPumpkins() {
        const unclaimedIds = Object.keys(currentHourPumpkins).filter(
            id => !claimedPumpkins.includes(parseInt(id))
        );
        
        if (unclaimedIds.length === 0) {
            addLog(t('allClaimed'), 'success');
            return;
        }
        
        addLog(t('claiming', unclaimedIds.length), 'info');
        
        for (const id of unclaimedIds) {
            if (!isRunning) break;
            
            await claimPumpkin(id, currentHourPumpkins[id]);
            updateStats();
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        addLog(t('autoClaimComplete'), 'success');
    }

    async function updateData() {
        const claimedSuccess = await fetchClaimedPumpkins();
        const locationsSuccess = await fetchPumpkinLocations();
        
        if (claimedSuccess && locationsSuccess) {
            updateStats();
            
            if (isRunning) {
                await autoClaimPumpkins();
            }
        }
    }

    function toggleAutoClaim() {
        const startBtn = document.getElementById('pumpkin-btn-start');
        const indicator = startBtn.querySelector('.pumpkin-status-indicator');
        const btnText = startBtn.querySelector('span:not(.pumpkin-status-indicator)');
        
        isRunning = !isRunning;
        
        if (isRunning) {
            startBtn.classList.add('pumpkin-running');
            btnText.textContent = t('stop');
            indicator.classList.remove('pumpkin-status-stopped');
            indicator.classList.add('pumpkin-status-running');
            
            addLog(t('started'), 'success');
            
            updateData();
            updateInterval = setInterval(updateData, 10000);
        } else {
            startBtn.classList.remove('pumpkin-running');
            btnText.textContent = t('start');
            indicator.classList.remove('pumpkin-status-running');
            indicator.classList.add('pumpkin-status-stopped');
            
            addLog(t('stopped'), 'info');
            
            if (updateInterval) {
                clearInterval(updateInterval);
                updateInterval = null;
            }
        }
    }

    async function initialize() {
        createUI();
        addLog(t('initialized'), 'success');
        await updateData();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();