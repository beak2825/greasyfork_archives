// ==UserScript==
// @name         AI 咒術師標記器 (AI Sorcerer Marker)
// @name:en      AI Sorcerer Marker (AI Art Detector & Blocker)
// @namespace    https://github.com/ai-sorcerer-marker
// @version      1.0.1
// @description  標記 Twitter/X 上謊稱手繪的 AI 繪圖用戶，遏止不誠實行為
// @description:en Mark and block AI art impostors on Twitter/X who claim their art is hand-drawn.
// @keywords     twitter, x, ai, ai art, detector, blocker, tampermonkey, script
// @author       User
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562744/AI%20%E5%92%92%E8%A1%93%E5%B8%AB%E6%A8%99%E8%A8%98%E5%99%A8%20%28AI%20Sorcerer%20Marker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562744/AI%20%E5%92%92%E8%A1%93%E5%B8%AB%E6%A8%99%E8%A8%98%E5%99%A8%20%28AI%20Sorcerer%20Marker%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 常數定義 =====
    const STORAGE_KEY = 'ai_sorcerer_marks';
    const SETTINGS_KEY = 'ai_sorcerer_settings';
    const VERSION = '1.0.1';

    // 標記等級
    const MARK_LEVELS = {
        noTag: { label: 'AI art but no AI tag', icon: '🎨', color: '#f59e0b', bgColor: '#78350f' },
        hasTag: { label: 'AI artist have AI tag', icon: '🏷️', color: '#10b981', bgColor: '#064e3b' },
        cheater: { label: 'AI cheater (say All draw self)', icon: '🚨', color: '#ef4444', bgColor: '#7f1d1d' },
        blocked: { label: 'BLOCKED', icon: '🚫', color: '#71767b', bgColor: '#374151' }
    };

    // 預設設定
    const DEFAULT_SETTINGS = {
        hideMarkedPosts: false,
        collapsedByDefault: true
    };

    // ===== 樣式注入 =====
    GM_addStyle(`
        /* 警告容器 - 深色主題 */
        .asm-warning-container {
            margin-top: 12px;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 13px;
            border: 1px solid;
            transition: all 0.3s ease;
            backdrop-filter: blur(8px);
        }

        .asm-warning-container.collapsed {
            padding: 8px 14px;
        }

        /* AI art but no AI tag - 橙色調 */
        .asm-warning-container.level-noTag {
            background-color: rgba(120, 53, 15, 0.3);
            border-color: rgba(245, 158, 11, 0.5);
            color: #fcd34d;
        }

        /* AI artist have AI tag - 綠色調 */
        .asm-warning-container.level-hasTag {
            background-color: rgba(6, 78, 59, 0.3);
            border-color: rgba(16, 185, 129, 0.5);
            color: #6ee7b7;
        }

        /* AI cheater - 紅色調 */
        .asm-warning-container.level-cheater {
            background-color: rgba(127, 29, 29, 0.3);
            border-color: rgba(239, 68, 68, 0.5);
            color: #fca5a5;
        }

        /* BLOCKED - 灰色調 */
        .asm-warning-container.level-blocked {
            background-color: rgba(55, 65, 81, 0.3);
            border-color: rgba(107, 114, 128, 0.5);
            color: #9ca3af;
        }

        .asm-warning-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            user-select: none;
        }

        .asm-warning-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 14px;
        }

        .asm-warning-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .asm-warning-toggle {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 12px;
            color: inherit;
            opacity: 0.7;
            transition: opacity 0.2s;
            padding: 4px 8px;
            border-radius: 4px;
        }

        .asm-warning-toggle:hover {
            opacity: 1;
            background-color: rgba(255, 255, 255, 0.1);
        }

        .asm-warning-content {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            opacity: 0.9;
        }

        .asm-warning-content.collapsed {
            display: none;
        }

        .asm-warning-notes {
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 10px;
            color: #e5e7eb;
        }

        .asm-warning-evidence {
            font-size: 12px;
            color: #9ca3af;
        }

        .asm-warning-evidence a {
            color: #60a5fa;
            text-decoration: none;
            transition: color 0.2s;
        }

        .asm-warning-evidence a:hover {
            color: #93c5fd;
            text-decoration: underline;
        }

        .asm-warning-meta {
            font-size: 11px;
            opacity: 0.6;
            margin-top: 8px;
            color: #9ca3af;
        }

        /* 標記按鈕 */
        .asm-mark-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border: 1px solid #536471;
            border-radius: 9999px;
            background-color: transparent;
            color: #71767b;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .asm-mark-btn:hover {
            background-color: rgba(29, 155, 240, 0.1);
            border-color: #1d9bf0;
            color: #1d9bf0;
        }

        /* 個人頁面標記按鈕 */
        .asm-profile-btn {
            display: flex;
            width: fit-content;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border: 1px solid #536471;
            border-radius: 9999px;
            background-color: transparent;
            color: #71767b;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 8px;
            margin-bottom: 8px;
        }

        .asm-profile-btn:hover {
            background-color: rgba(29, 155, 240, 0.1);
            color: #1d9bf0;
            border-color: #1d9bf0;
        }

        .asm-profile-btn.marked {
            border-color: #f87171;
            color: #f87171;
        }

        /* 標記彈窗 */
        .asm-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .asm-modal {
            background-color: #16181c;
            border-radius: 16px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid #2f3336;
        }

        .asm-modal-header {
            padding: 16px 20px;
            border-bottom: 1px solid #2f3336;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .asm-modal-title {
            font-size: 18px;
            font-weight: 700;
            color: #e7e9ea;
        }

        .asm-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #71767b;
            padding: 4px;
        }

        .asm-modal-close:hover {
            color: #e7e9ea;
        }

        .asm-modal-body {
            padding: 20px;
        }

        .asm-form-group {
            margin-bottom: 16px;
        }

        .asm-form-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #e7e9ea;
            margin-bottom: 8px;
        }

        .asm-form-required {
            color: #dc2626;
        }

        .asm-radio-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .asm-radio-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            border: 2px solid #2f3336;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            color: #e7e9ea;
            background-color: #1d1f23;
        }

        .asm-radio-item:hover {
            border-color: #536471;
        }

        .asm-radio-item.selected {
            border-color: #1d9bf0;
            background-color: #1d1f23;
        }

        .asm-radio-item input {
            display: none;
        }

        .asm-input {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #2f3336;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s;
            box-sizing: border-box;
            background-color: #1d1f23;
            color: #e7e9ea;
        }

        .asm-input:focus {
            outline: none;
            border-color: #1d9bf0;
        }

        .asm-input::placeholder {
            color: #71767b;
        }

        .asm-textarea {
            min-height: 100px;
            resize: vertical;
        }

        .asm-evidence-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .asm-evidence-item {
            display: flex;
            gap: 8px;
        }

        .asm-evidence-item input {
            flex: 1;
        }

        .asm-evidence-remove {
            background: none;
            border: none;
            color: #dc2626;
            cursor: pointer;
            font-size: 18px;
            padding: 0 8px;
        }

        .asm-add-evidence {
            background: none;
            border: 2px dashed #2f3336;
            border-radius: 8px;
            padding: 8px;
            color: #71767b;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
        }

        .asm-add-evidence:hover {
            border-color: #1d9bf0;
            color: #1d9bf0;
        }

        .asm-char-count {
            font-size: 11px;
            color: #71767b;
            text-align: right;
            margin-top: 4px;
        }

        .asm-char-count.error {
            color: #dc2626;
        }

        .asm-modal-footer {
            padding: 16px 20px;
            border-top: 1px solid #2f3336;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .asm-btn {
            padding: 10px 20px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }

        .asm-btn-secondary {
            background-color: #2f3336;
            color: #e7e9ea;
        }

        .asm-btn-secondary:hover {
            background-color: #3a3d41;
        }

        .asm-btn-primary {
            background-color: #1d9bf0;
            color: #fff;
        }

        .asm-btn-primary:hover {
            background-color: #1a8cd8;
        }

        .asm-btn-primary:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
        }

        .asm-btn-danger {
            background-color: #dc2626;
            color: #fff;
        }

        .asm-btn-danger:hover {
            background-color: #b91c1c;
        }

        /* 統計面板 */
        .asm-stats-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #16181c;
            border-radius: 16px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid #2f3336;
            z-index: 10001;
        }

        .asm-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 20px;
        }

        .asm-stat-card {
            padding: 16px;
            border-radius: 12px;
            text-align: center;
        }

        .asm-stat-card.noTag { background-color: #78350f; color: #fcd34d; }
        .asm-stat-card.hasTag { background-color: #064e3b; color: #34d399; }
        .asm-stat-card.cheater { background-color: #7f1d1d; color: #f87171; }
        .asm-stat-card.blocked { background-color: #374151; color: #9ca3af; }

        .asm-stat-number {
            font-size: 32px;
            font-weight: 700;
        }

        .asm-stat-label {
            font-size: 12px;
            margin-top: 4px;
        }

        .asm-settings-group {
            margin-bottom: 20px;
        }

        .asm-settings-title {
            font-size: 14px;
            font-weight: 600;
            color: #e7e9ea;
            margin-bottom: 12px;
        }

        .asm-checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 0;
        }

        .asm-checkbox-item input {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .asm-checkbox-item label {
            font-size: 14px;
            color: #e7e9ea;
            cursor: pointer;
        }

        .asm-action-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }

        /* 隱藏標記的貼文 */
        .asm-hidden-post {
            display: none !important;
        }

        /* 搜尋框 */
        .asm-search-container {
            margin-bottom: 16px;
        }

        .asm-user-list {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #2f3336;
            border-radius: 8px;
            background-color: #1d1f23;
        }

        .asm-user-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            border-bottom: 1px solid #2f3336;
        }

        .asm-user-item:last-child {
            border-bottom: none;
        }

        .asm-user-info {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .asm-user-level {
            font-size: 16px;
        }

        .asm-user-name {
            font-weight: 600;
            color: #e7e9ea;
        }

        .asm-user-actions {
            display: flex;
            gap: 8px;
        }

        .asm-user-action-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 4px;
            opacity: 0.6;
            transition: opacity 0.2s;
        }

        .asm-user-action-btn:hover {
            opacity: 1;
        }

        /* Toast 通知 */
        .asm-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: #111827;
            color: #fff;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10002;
            animation: asm-toast-in 0.3s ease;
        }

        @keyframes asm-toast-in {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .asm-toast.success { background-color: #059669; }
        .asm-toast.error { background-color: #dc2626; }
    `);

    // ===== 資料儲存模組 =====
    const Storage = {
        getMarks() {
            const data = GM_getValue(STORAGE_KEY, null);
            if (!data) return { marks: {}, whitelist: {} };
            try {
                return JSON.parse(data);
            } catch {
                return { marks: {}, whitelist: {} };
            }
        },

        saveMarks(data) {
            GM_setValue(STORAGE_KEY, JSON.stringify(data));
        },

        getMark(username) {
            const data = this.getMarks();
            const normalized = username.toLowerCase().replace('@', '');
            return data.marks[normalized] || data.whitelist[normalized] || null;
        },

        setMark(username, markData) {
            const data = this.getMarks();
            const normalized = username.toLowerCase().replace('@', '');

            if (markData.level === 'whitelist') {
                delete data.marks[normalized];
                data.whitelist[normalized] = markData;
            } else {
                delete data.whitelist[normalized];
                data.marks[normalized] = markData;
            }

            this.saveMarks(data);
        },

        removeMark(username) {
            const data = this.getMarks();
            const normalized = username.toLowerCase().replace('@', '');
            delete data.marks[normalized];
            delete data.whitelist[normalized];
            this.saveMarks(data);
        },

        getSettings() {
            const data = GM_getValue(SETTINGS_KEY, null);
            if (!data) return { ...DEFAULT_SETTINGS };
            try {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
            } catch {
                return { ...DEFAULT_SETTINGS };
            }
        },

        saveSettings(settings) {
            GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
        },

        getStats() {
            const data = this.getMarks();
            const stats = {
                noTag: 0,
                hasTag: 0,
                cheater: 0,
                blocked: 0,
                total: 0
            };

            Object.values(data.marks).forEach(mark => {
                stats[mark.level] = (stats[mark.level] || 0) + 1;
                stats.total++;
            });

            Object.values(data.whitelist).forEach(mark => {
                stats[mark.level] = (stats[mark.level] || 0) + 1;
                stats.total++;
            });

            return stats;
        },

        exportData() {
            const data = this.getMarks();
            return {
                version: VERSION,
                exportDate: new Date().toISOString(),
                ...data
            };
        },

        importData(jsonData, mode = 'merge') {
            try {
                const importedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
                const currentData = this.getMarks();

                if (mode === 'overwrite') {
                    this.saveMarks({
                        marks: importedData.marks || {},
                        whitelist: importedData.whitelist || {}
                    });
                } else {
                    // 合併模式
                    const merged = {
                        marks: { ...currentData.marks },
                        whitelist: { ...currentData.whitelist }
                    };

                    Object.entries(importedData.marks || {}).forEach(([key, value]) => {
                        if (!merged.marks[key] || new Date(value.updatedAt) > new Date(merged.marks[key].updatedAt)) {
                            merged.marks[key] = value;
                        }
                    });

                    Object.entries(importedData.whitelist || {}).forEach(([key, value]) => {
                        if (!merged.whitelist[key]) {
                            merged.whitelist[key] = value;
                        }
                    });

                    this.saveMarks(merged);
                }

                return true;
            } catch (e) {
                console.error('Import failed:', e);
                return false;
            }
        },

        clearAll() {
            this.saveMarks({ marks: {}, whitelist: {} });
        }
    };

    // ===== UI 模組 =====
    const UI = {
        showToast(message, type = 'info') {
            const existing = document.querySelector('.asm-toast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className = `asm-toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => toast.remove(), 3000);
        },

        createWarningElement(mark, username) {
            const settings = Storage.getSettings();
            const levelInfo = MARK_LEVELS[mark.level];

            const container = document.createElement('div');
            container.className = `asm-warning-container level-${mark.level}`;
            container.dataset.asmUsername = username;

            const isCollapsed = settings.collapsedByDefault;

            container.innerHTML = `
                <div class="asm-warning-header">
                    <div class="asm-warning-title">
                        <span>${levelInfo.icon}</span>
                        <span>${levelInfo.label}</span>
                    </div>
                    <div class="asm-warning-actions">
                        <button class="asm-warning-toggle" data-action="toggle">
                            ${isCollapsed ? '展開詳情 ▼' : '收合 ▲'}
                        </button>
                    </div>
                </div>
                <div class="asm-warning-content ${isCollapsed ? 'collapsed' : ''}">
                    ${mark.notes ? `<div class="asm-warning-notes">${this.escapeHtml(mark.notes)}</div>` : ''}
                    ${mark.evidence && mark.evidence.length > 0 ? `
                        <div class="asm-warning-evidence">
                            <strong>證據連結:</strong><br>
                            ${mark.evidence.map(e => `<a href="${this.escapeHtml(e.url)}" target="_blank">${this.escapeHtml(e.url)}</a>`).join('<br>')}
                        </div>
                    ` : ''}
                    <div class="asm-warning-meta">
                        標記於: ${new Date(mark.markedAt).toLocaleDateString('zh-TW')}
                        ${mark.exportedBy ? ` | 來源: ${this.escapeHtml(mark.exportedBy)}` : ''}
                    </div>
                </div>
            `;

            container.querySelector('.asm-warning-toggle').addEventListener('click', (e) => {
                e.stopPropagation();
                const content = container.querySelector('.asm-warning-content');
                const toggle = container.querySelector('.asm-warning-toggle');
                const isNowCollapsed = content.classList.toggle('collapsed');
                toggle.textContent = isNowCollapsed ? '展開詳情 ▼' : '收合 ▲';
            });

            return container;
        },

        createMarkButton(username) {
            const btn = document.createElement('button');
            btn.className = 'asm-mark-btn';
            btn.innerHTML = 'AI ?';
            btn.dataset.asmUsername = username;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.showMarkModal(username);
            });

            return btn;
        },

        showMarkModal(username, existingMark = null) {
            const overlay = document.createElement('div');
            overlay.className = 'asm-modal-overlay';

            const isEdit = !!existingMark;

            overlay.innerHTML = `
                <div class="asm-modal">
                    <div class="asm-modal-header">
                        <div class="asm-modal-title">🏷️ ${isEdit ? '編輯' : '標記'}用戶 @${this.escapeHtml(username)}</div>
                        <button class="asm-modal-close">&times;</button>
                    </div>
                    <div class="asm-modal-body">
                        <div class="asm-form-group">
                            <div class="asm-form-label">標記等級 <span class="asm-form-required">*</span></div>
                            <div class="asm-radio-group">
                                ${Object.entries(MARK_LEVELS).map(([key, val]) => `
                                    <label class="asm-radio-item ${existingMark?.level === key ? 'selected' : ''}" data-level="${key}">
                                        <input type="radio" name="level" value="${key}" ${existingMark?.level === key ? 'checked' : ''}>
                                        <span>${val.icon}</span>
                                        <span>${val.label}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div class="asm-form-group">
                            <div class="asm-form-label">證據連結 <span class="asm-form-required">*</span></div>
                            <div class="asm-evidence-list">
                                ${(existingMark?.evidence || [{ url: '' }]).map((e, i) => `
                                    <div class="asm-evidence-item">
                                        <input type="url" class="asm-input asm-evidence-input" placeholder="https://twitter.com/..." value="${this.escapeHtml(e.url || '')}">
                                        ${i > 0 ? '<button class="asm-evidence-remove">&times;</button>' : ''}
                                    </div>
                                `).join('')}
                            </div>
                            <button class="asm-add-evidence">+ 新增更多連結</button>
                        </div>

                        <div class="asm-form-group">
                            <div class="asm-form-label">備註說明 (選填)</div>
                            <textarea class="asm-input asm-textarea" id="asm-notes" placeholder="可以說明為什麼標記此用戶...">${this.escapeHtml(existingMark?.notes || '')}</textarea>
                        </div>

                        <div class="asm-form-group">
                            <div class="asm-checkbox-item">
                                <input type="checkbox" id="asm-hide-author" ${existingMark?.hideAuthor ? 'checked' : ''}>
                                <label for="asm-hide-author">🙈 隱藏此作者的所有貼文</label>
                            </div>
                        </div>
                    </div>
                    <div class="asm-modal-footer">
                        ${isEdit ? '<button class="asm-btn asm-btn-danger" data-action="delete">刪除標記</button>' : ''}
                        <button class="asm-btn asm-btn-secondary" data-action="hide-only">僅隱藏</button>
                        <button class="asm-btn asm-btn-secondary" data-action="cancel">取消</button>
                        <button class="asm-btn asm-btn-primary" data-action="save">確認標記</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            // 事件綁定
            overlay.querySelector('.asm-modal-close').addEventListener('click', () => overlay.remove());
            overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.remove();
            });

            // Radio 選擇
            overlay.querySelectorAll('.asm-radio-item').forEach(item => {
                item.addEventListener('click', () => {
                    overlay.querySelectorAll('.asm-radio-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    item.querySelector('input').checked = true;
                });
            });

            // 新增證據連結
            overlay.querySelector('.asm-add-evidence').addEventListener('click', () => {
                const list = overlay.querySelector('.asm-evidence-list');
                const newItem = document.createElement('div');
                newItem.className = 'asm-evidence-item';
                newItem.innerHTML = `
                    <input type="url" class="asm-input asm-evidence-input" placeholder="https://twitter.com/...">
                    <button class="asm-evidence-remove">&times;</button>
                `;
                list.appendChild(newItem);

                newItem.querySelector('.asm-evidence-remove').addEventListener('click', () => newItem.remove());
            });

            // 移除證據按鈕
            overlay.querySelectorAll('.asm-evidence-remove').forEach(btn => {
                btn.addEventListener('click', () => btn.parentElement.remove());
            });

            // 字數統計
            const notesField = overlay.querySelector('#asm-notes');
            const charCount = overlay.querySelector('#asm-char-current');
            const charCountContainer = overlay.querySelector('.asm-char-count');

            notesField.addEventListener('input', () => {
                const len = notesField.value.length;
                charCount.textContent = len;
                charCountContainer.classList.toggle('error', len < 20);
            });

            // 刪除標記
            if (isEdit) {
                overlay.querySelector('[data-action="delete"]').addEventListener('click', () => {
                    if (confirm('確定要刪除此標記嗎？')) {
                        Storage.removeMark(username);
                        UI.showToast('標記已刪除', 'success');
                        overlay.remove();
                        Detector.refreshPage();
                    }
                });
            }

            // 僅隱藏（快速隱藏不需要填寫詳細資料）
            overlay.querySelector('[data-action="hide-only"]').addEventListener('click', () => {
                const markData = {
                    username: username,
                    level: 'blocked',
                    evidence: [],
                    notes: '快速封鎖',
                    hideAuthor: true,
                    markedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                Storage.setMark(username, markData);
                UI.showToast('已封鎖此作者', 'success');
                overlay.remove();
                Detector.refreshPage();
            });

            // 儲存
            overlay.querySelector('[data-action="save"]').addEventListener('click', () => {
                const levelInput = overlay.querySelector('input[name="level"]:checked');
                const evidenceInputs = overlay.querySelectorAll('.asm-evidence-input');
                const notes = notesField.value.trim();
                const hideAuthor = overlay.querySelector('#asm-hide-author').checked;

                // 驗證
                if (!levelInput) {
                    UI.showToast('請選擇標記等級', 'error');
                    return;
                }

                const evidence = Array.from(evidenceInputs)
                    .map(input => ({ url: input.value.trim() }))
                    .filter(e => e.url);

                if (evidence.length === 0) {
                    UI.showToast('請至少填寫一個證據連結', 'error');
                    return;
                }

                const markData = {
                    username: username,
                    level: levelInput.value,
                    evidence: evidence,
                    notes: notes,
                    hideAuthor: hideAuthor,
                    markedAt: existingMark?.markedAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                Storage.setMark(username, markData);
                UI.showToast(isEdit ? '標記已更新' : '標記成功', 'success');
                overlay.remove();
                Detector.refreshPage();
            });
        },

        showStatsPanel() {
            const existing = document.querySelector('.asm-modal-overlay');
            if (existing) existing.remove();

            const stats = Storage.getStats();
            const settings = Storage.getSettings();
            const allMarks = Storage.getMarks();

            const overlay = document.createElement('div');
            overlay.className = 'asm-modal-overlay';

            overlay.innerHTML = `
                <div class="asm-modal" style="max-width: 600px;">
                    <div class="asm-modal-header">
                        <div class="asm-modal-title">📊 AI 咒術師標記器 - 統計面板</div>
                        <button class="asm-modal-close">&times;</button>
                    </div>
                    <div class="asm-modal-body">
                        <div class="asm-stats-grid">
                            <div class="asm-stat-card noTag">
                                <div class="asm-stat-number">${stats.noTag || 0}</div>
                                <div class="asm-stat-label">🎨 AI no tag</div>
                            </div>
                            <div class="asm-stat-card hasTag">
                                <div class="asm-stat-number">${stats.hasTag || 0}</div>
                                <div class="asm-stat-label">🏷️ AI has tag</div>
                            </div>
                            <div class="asm-stat-card cheater">
                                <div class="asm-stat-number">${stats.cheater || 0}</div>
                                <div class="asm-stat-label">🚨 AI cheater</div>
                            </div>
                            <div class="asm-stat-card blocked">
                                <div class="asm-stat-number">${stats.blocked || 0}</div>
                                <div class="asm-stat-label">🚫 BLOCKED</div>
                            </div>
                        </div>

                        <div class="asm-settings-group">
                            <div class="asm-settings-title">⚙️ 顯示設定</div>
                            <div class="asm-checkbox-item">
                                <input type="checkbox" id="asm-hide-posts" ${settings.hideMarkedPosts ? 'checked' : ''}>
                                <label for="asm-hide-posts">隱藏已標記用戶的貼文</label>
                            </div>
                            <div class="asm-checkbox-item">
                                <input type="checkbox" id="asm-collapsed" ${settings.collapsedByDefault ? 'checked' : ''}>
                                <label for="asm-collapsed">預設收合警告訊息</label>
                            </div>
                        </div>

                        <div class="asm-settings-group">
                            <div class="asm-settings-title">📦 名單管理</div>
                            <div class="asm-action-buttons">
                                <button class="asm-btn asm-btn-secondary" data-action="export">📤 匯出名單</button>
                                <button class="asm-btn asm-btn-secondary" data-action="import">📥 匯入名單</button>
                                <button class="asm-btn asm-btn-secondary" data-action="search">🔍 搜尋用戶</button>
                                <button class="asm-btn asm-btn-danger" data-action="clear">🗑️ 清除全部</button>
                            </div>
                            <input type="file" id="asm-import-file" accept=".json" style="display: none;">
                        </div>

                        <div class="asm-search-container" style="display: none;">
                            <input type="text" class="asm-input" id="asm-search-input" placeholder="搜尋用戶名稱...">
                            <div class="asm-user-list" id="asm-user-list"></div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            // 關閉
            overlay.querySelector('.asm-modal-close').addEventListener('click', () => overlay.remove());
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.remove();
            });

            // 設定變更
            const saveSettings = () => {
                const newSettings = {
                    hideMarkedPosts: overlay.querySelector('#asm-hide-posts')?.checked || false,
                    collapsedByDefault: overlay.querySelector('#asm-collapsed')?.checked || true
                };
                Storage.saveSettings(newSettings);
                Detector.refreshPage();
            };

            overlay.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.addEventListener('change', saveSettings);
            });

            // 匯出
            overlay.querySelector('[data-action="export"]').addEventListener('click', () => {
                const data = Storage.exportData();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ai-sorcerer-marks-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                UI.showToast('名單已匯出', 'success');
            });

            // 匯入
            const importFile = overlay.querySelector('#asm-import-file');
            overlay.querySelector('[data-action="import"]').addEventListener('click', () => {
                importFile.click();
            });

            importFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const mode = confirm('選擇匯入模式:\n\n確定 = 合併 (保留現有資料)\n取消 = 覆蓋 (清除現有資料)') ? 'merge' : 'overwrite';
                    if (Storage.importData(event.target.result, mode)) {
                        UI.showToast('名單匯入成功', 'success');
                        overlay.remove();
                        UI.showStatsPanel();
                    } else {
                        UI.showToast('匯入失敗，請檢查檔案格式', 'error');
                    }
                };
                reader.readAsText(file);
            });

            // 搜尋
            const searchContainer = overlay.querySelector('.asm-search-container');
            const searchInput = overlay.querySelector('#asm-search-input');
            const userList = overlay.querySelector('#asm-user-list');

            overlay.querySelector('[data-action="search"]').addEventListener('click', () => {
                searchContainer.style.display = searchContainer.style.display === 'none' ? 'block' : 'none';
                if (searchContainer.style.display === 'block') {
                    searchInput.focus();
                    renderUserList('');
                }
            });

            const renderUserList = (query) => {
                const allData = Storage.getMarks();
                const allUsers = [
                    ...Object.entries(allData.marks).map(([k, v]) => ({ ...v, username: k })),
                    ...Object.entries(allData.whitelist).map(([k, v]) => ({ ...v, username: k, level: 'whitelist' }))
                ].filter(u => u.username.toLowerCase().includes(query.toLowerCase()));

                userList.innerHTML = allUsers.length === 0
                    ? '<div style="padding: 12px; text-align: center; color: #6b7280;">無結果</div>'
                    : allUsers.map(user => {
                        const levelInfo = MARK_LEVELS[user.level];
                        return `
                            <div class="asm-user-item" data-username="${user.username}">
                                <div class="asm-user-info">
                                    <span class="asm-user-level">${levelInfo.icon}</span>
                                    <span class="asm-user-name">@${user.username}</span>
                                </div>
                                <div class="asm-user-actions">
                                    <button class="asm-user-action-btn" data-action="edit" title="編輯">✏️</button>
                                    <button class="asm-user-action-btn" data-action="delete" title="刪除">🗑️</button>
                                </div>
                            </div>
                        `;
                    }).join('');

                userList.querySelectorAll('.asm-user-item').forEach(item => {
                    const username = item.dataset.username;

                    item.querySelector('[data-action="edit"]').addEventListener('click', () => {
                        overlay.remove();
                        const mark = Storage.getMark(username);
                        UI.showMarkModal(username, mark);
                    });

                    item.querySelector('[data-action="delete"]').addEventListener('click', () => {
                        if (confirm(`確定要刪除 @${username} 的標記嗎？`)) {
                            Storage.removeMark(username);
                            renderUserList(searchInput.value);
                            UI.showToast('標記已刪除', 'success');
                        }
                    });
                });
            };

            searchInput.addEventListener('input', (e) => {
                renderUserList(e.target.value);
            });

            // 清除全部
            overlay.querySelector('[data-action="clear"]').addEventListener('click', () => {
                if (confirm('確定要清除所有標記嗎？此操作無法復原！')) {
                    Storage.clearAll();
                    UI.showToast('所有標記已清除', 'success');
                    overlay.remove();
                    Detector.refreshPage();
                }
            });
        },

        escapeHtml(str) {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
    };

    // ===== 偵測模組 =====
    const Detector = {
        processedTweets: new WeakSet(),

        init() {
            this.observeTimeline();
            this.scanExistingTweets();
            this.checkProfilePage();

            // 監聽 URL 變化（SPA 路由）
            let lastUrl = location.href;
            new MutationObserver(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    setTimeout(() => this.checkProfilePage(), 500);
                }
            }).observe(document.body, { subtree: true, childList: true });
        },

        checkProfilePage() {
            // 檢查是否在個人頁面
            const match = location.pathname.match(/^\/([^\/]+)\/?$/);
            if (!match) return;

            const username = match[1];
            // 排除特殊頁面
            if (['home', 'explore', 'notifications', 'messages', 'settings', 'i', 'search', 'compose'].includes(username)) return;

            // 等待頁面載入
            setTimeout(() => this.addProfileButton(username), 800);
        },

        addProfileButton(username) {
            // 避免重複加入
            if (document.querySelector('.asm-profile-btn')) return;

            // 目標：放在用戶名稱 (UserName) 下方
            const userNameElement = document.querySelector('div[data-testid="UserName"]');

            if (!userNameElement) {
                // 備用：放在 Description 上方
                const description = document.querySelector('div[data-testid="UserDescription"]');
                if (description) {
                    // 插入邏輯在下面處理
                } else {
                    return; // 找不到適合的位置
                }
            }

            const targetContainer = userNameElement ? userNameElement.parentElement : document.querySelector('div[data-testid="UserDescription"]')?.parentElement;

            if (!targetContainer) return;

            const mark = Storage.getMark(username);
            const btn = document.createElement('button');
            btn.className = 'asm-profile-btn' + (mark ? ' marked' : '');
            btn.innerHTML = mark ? `${MARK_LEVELS[mark.level]?.icon || '🏷️'} 已標記` : '🏷️ AI ?';
            btn.addEventListener('click', () => UI.showMarkModal(username, mark));

            if (userNameElement) {
                // 插入到 UserName 後面
                userNameElement.insertAdjacentElement('afterend', btn);
            } else {
                // 插入到 Description 前面
                const description = document.querySelector('div[data-testid="UserDescription"]');
                if (description) description.insertAdjacentElement('beforebegin', btn);
            }
        },

        observeTimeline() {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        this.scanTweets(mutation.addedNodes);
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        scanExistingTweets() {
            const tweets = document.querySelectorAll('article[data-testid="tweet"]');
            tweets.forEach(tweet => this.processTweet(tweet));
        },

        scanTweets(nodes) {
            nodes.forEach(node => {
                if (node.nodeType !== 1) return;

                if (node.matches && node.matches('article[data-testid="tweet"]')) {
                    this.processTweet(node);
                }

                const tweets = node.querySelectorAll ? node.querySelectorAll('article[data-testid="tweet"]') : [];
                tweets.forEach(tweet => this.processTweet(tweet));
            });
        },

        processTweet(tweet) {
            if (this.processedTweets.has(tweet)) return;
            this.processedTweets.add(tweet);

            const username = this.extractUsername(tweet);
            if (!username) return;

            const mark = Storage.getMark(username);
            const settings = Storage.getSettings();

            // 加入標記按鈕
            this.addMarkButton(tweet, username);

            if (mark) {
                // 如果設定了隱藏作者或等級為 blocked，直接隱藏
                if (mark.hideAuthor || mark.level === 'blocked') {
                    tweet.classList.add('asm-hidden-post');
                    return;
                }

                // 全域隱藏已標記貼文設定
                if (settings.hideMarkedPosts) {
                    tweet.classList.add('asm-hidden-post');
                    return;
                }

                // 加入警告
                this.addWarning(tweet, mark, username);
            }
        },

        extractUsername(tweet) {
            const userLink = tweet.querySelector('a[href^="/"][role="link"]');
            if (!userLink) return null;

            const href = userLink.getAttribute('href');
            const match = href.match(/^\/([^\/\?]+)/);
            if (match && !['home', 'explore', 'notifications', 'messages', 'settings', 'i'].includes(match[1])) {
                return match[1];
            }
            return null;
        },

        addWarning(tweet, mark, username) {
            // 避免重複加入
            if (tweet.querySelector('.asm-warning-container')) return;

            const actionBar = tweet.querySelector('div[role="group"]');
            if (!actionBar) return;

            const warning = UI.createWarningElement(mark, username);
            actionBar.parentElement.insertBefore(warning, actionBar.nextSibling);

            // 點擊警告可編輯
            warning.querySelector('.asm-warning-header').addEventListener('dblclick', () => {
                UI.showMarkModal(username, mark);
            });
        },

        addMarkButton(tweet, username) {
            // 避免重複加入
            if (tweet.querySelector('.asm-mark-btn')) return;

            // 只在 Action Bar 加入按鈕（最穩定的方式）
            const actionBar = tweet.querySelector('div[role="group"]');
            if (!actionBar) return;

            const btn = UI.createMarkButton(username);
            actionBar.appendChild(btn);
        },

        refreshPage() {
            // 清除所有已處理的標記
            document.querySelectorAll('.asm-warning-container, .asm-mark-btn').forEach(el => el.remove());
            document.querySelectorAll('.asm-hidden-post').forEach(el => el.classList.remove('asm-hidden-post'));

            this.processedTweets = new WeakSet();
            this.scanExistingTweets();
        }
    };

    // ===== 初始化 =====
    function init() {
        console.log('🏷️ AI 咒術師標記器已啟動 v' + VERSION);

        // 註冊選單
        GM_registerMenuCommand('📊 統計面板', () => UI.showStatsPanel());

        GM_registerMenuCommand('📤 匯出名單', () => {
            const data = Storage.exportData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-sorcerer-marks-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            UI.showToast('名單已匯出', 'success');
        });

        GM_registerMenuCommand('📥 匯入名單', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const mode = confirm('選擇匯入模式:\n\n確定 = 合併 (保留現有資料)\n取消 = 覆蓋 (清除現有資料)') ? 'merge' : 'overwrite';
                    if (Storage.importData(event.target.result, mode)) {
                        UI.showToast('名單匯入成功', 'success');
                        Detector.refreshPage();
                    } else {
                        UI.showToast('匯入失敗，請檢查檔案格式', 'error');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        GM_registerMenuCommand('🙈 切換隱藏模式', () => {
            const settings = Storage.getSettings();
            settings.hideMarkedPosts = !settings.hideMarkedPosts;
            Storage.saveSettings(settings);
            UI.showToast(settings.hideMarkedPosts ? '已開啟：隱藏所有標記貼文' : '已關閉：顯示標記貼文', 'success');
            Detector.refreshPage();
        });

        GM_registerMenuCommand('🔄 重新掃描頁面', () => {
            Detector.refreshPage();
            UI.showToast('已重新掃描頁面', 'success');
        });

        GM_registerMenuCommand('🗑️ 清除所有標記', () => {
            if (confirm('確定要清除所有標記嗎？此操作無法復原！')) {
                Storage.clearAll();
                UI.showToast('所有標記已清除', 'success');
                Detector.refreshPage();
            }
        });

        // 初始化偵測器
        Detector.init();
    }

    // 等待頁面載入
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
