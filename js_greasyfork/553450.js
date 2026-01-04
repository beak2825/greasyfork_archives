// ==UserScript==
// @name         ReD22 - Reminder Dashboard (Collapsible)
// @namespace    https://motcua.tphcm.gov.vn/
// @version      2.5.4
// @description  Collapsible reminder dashboard with enhanced highlighting and status colors
// @author       NguyenVu
// @match        https://motcua.tphcm.gov.vn/*
// @match        https://*.tphcm.gov.vn/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553450/ReD22%20-%20Reminder%20Dashboard%20%28Collapsible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553450/ReD22%20-%20Reminder%20Dashboard%20%28Collapsible%29.meta.js
// ==/UserScript==

// ========================================
// GLOBAL FUNCTIONS
// ========================================

// Define global reference to renderReminders (will be set later)
let renderRemindersGlobal = null;

// Global button action functions
window.__redDismiss = function(id) {
    let reminders = GM_getValue('reminders', []);
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
        reminder.shown = true;
        GM_setValue('reminders', reminders);
        if (renderRemindersGlobal) renderRemindersGlobal(reminders);
        console.log("ReD: Dismissed reminder", id);
    }
};

window.__redSnooze = function(id) {
    let reminders = GM_getValue('reminders', []);
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
        reminder.time = Date.now() + 300000; // 5 minutes
        reminder.shown = false;
        GM_setValue('reminders', reminders);
        if (renderRemindersGlobal) renderRemindersGlobal(reminders);
        console.log("ReD: Snoozed reminder", id);
    }
};

window.__redClear = function(id) {
    let reminders = GM_getValue('reminders', []);
    const initialLength = reminders.length;
    reminders = reminders.filter(r => r.id !== id);

    if (reminders.length < initialLength) {
        GM_setValue('reminders', reminders);
        if (renderRemindersGlobal) renderRemindersGlobal(reminders);
        console.log("ReD: Deleted reminder", id);
    }
};

window.__redCopyDossier = function(dossierCode) {
    // Create a temporary textarea to copy text
    const textarea = document.createElement('textarea');
    textarea.value = dossierCode;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);

    try {
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices

        const successful = document.execCommand('copy');

        if (successful) {
            console.log("ReD: Copied dossier code", dossierCode);

            // Show temporary success message using the button that was clicked
            const btn = window.event?.target;
            if (btn) {
                const originalText = btn.innerHTML;
                const originalBg = btn.style.background;

                btn.innerHTML = '✓ Đã copy';
                btn.style.background = '#10b981';
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = originalBg;
                    btn.disabled = false;
                }, 2000);
            }

            // Also try modern clipboard API as fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(dossierCode).catch(err => {
                    console.warn("ReD: Clipboard API failed", err);
                });
            }
        } else {
            throw new Error('Copy command failed');
        }
    } catch (err) {
        console.error("ReD: Copy failed", err);

        // Try modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(dossierCode)
                .then(() => {
                console.log("ReD: Copied via Clipboard API", dossierCode);
                const btn = window.event?.target;
                if (btn) {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✓ Đã copy';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                }
            })
                .catch(() => {
                alert('Không thể copy. Mã hồ sơ: ' + dossierCode);
            });
        } else {
            alert('Không thể copy. Mã hồ sơ: ' + dossierCode);
        }
    } finally {
        document.body.removeChild(textarea);
    }
};

(async function() {
    'use strict';

    // ========================================
    // CLASSES
    // ========================================

    class DossierData {
        constructor(dossierData) {
            this.id = dossierData.id;
            this.taskName = dossierData.task_name;
            this.code = dossierData.code;
            this.appliedDate = dossierData.applied_date;
            this.dossierTaskStatus = dossierData.dossierTaskStatus;
            this.completedDate = dossierData.completedDate;
            this.appointmentDate = dossierData.appointmentDate;
            this.sectorName = dossierData.procedure.sector.code
            this.procedureTypeName = dossierData.procedure.translate.name
        }

        isCloseToDeadline(daysThreshold = 3) {
            if (!this.appointmentDate) return false;
            const appointment = new Date(this.appointmentDate);
            const now = new Date();
            const diffTime = appointment - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 && diffDays <= daysThreshold;
        }

        getDaysToDeadline() {
            if (!this.appointmentDate) return null;
            const appointment = new Date(this.appointmentDate);
            const now = new Date();
            const diffTime = appointment - now;
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
    }

    // ========================================
    // INITIALIZATION & CONFIGURATION
    // ========================================

    console.log("🚀 ReD: Script executing...", {
        url: window.location.href,
        pathname: window.location.pathname,
        readyState: document.readyState
    });

    // Guard so the script runs only once
    if (window.__NguyenVu_ReminderLoaded) {
        console.log("⚠️ ReD: Already loaded, skipping");
        return;
    }
    window.__NguyenVu_ReminderLoaded = true;

    // Configuration
    const CONFIG = {
        API_URL: "https://apigatewaydvcmc.hochiminhcity.gov.vn",
        TELEGRAM_BOT_TOKEN: GM_getValue('telegram_token', ''),
        CHECK_INTERVAL: 3000,
        FETCH_DELAY: 2000,
        DEBUG_MODE: false
    };

    // Only run on Vietnamese pages
    if (!location.href.includes("/vi") && !location.pathname.startsWith("/vi")) {
        console.log("ReD: Not a /vi page — skipping", location.href);
        return;
    }

    console.log("ReD: Script loaded successfully!");

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getHourDiff(time) {
        if (!time) return;

        const now = Date.now();
        const diffMs = time - now;
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays >= 1) {
            return `${diffDays} ngày`;
        } else if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return `${diffMinutes} phút`;
        } else {
            return `${Math.floor(diffHours)} giờ`;
        }
    }


    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c]));
    }

    async function getTokenFromLocalStorage() {
        try {
            const userData = localStorage.getItem('userToken');
            return userData;
        } catch (err) {
            console.error("ReD: getTokenFromLocalStorage error", err);
            return null;
        }
    }

    async function getTokenWithRetry(maxRetries = 3, delayMs = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            const token = await getTokenFromLocalStorage();
            if (token) return token;

            if (i < maxRetries - 1) {
                console.log(`ReD: Token not found, retrying in ${delayMs}ms... (${i + 1}/${maxRetries})`);
                await delay(delayMs);
            }
        }
        console.warn("ReD: Failed to get token after", maxRetries, "attempts");
        return null;
    }

    async function getRegionIdFromLocalStorage() {
        try {
            const items = localStorage.getItem('userAgency')
            const regId = JSON.parse(items)
            return regId;
        } catch (err) {
            console.error("Red:getRegionId Errorr", err)
            return null
        }
    }

    // Get status color based on status name
    function getStatusColor(statusName) {
        const statusColors = {
            'Yêu cầu thanh toán': '#f59e0b',
            'Yêu cầu bổ sung giấy tờ': '#ef4444',
            'Thụ lý hồ sơ': '#3b82f6',
            'Đã thanh toán': '#10b981',
            'Đang xử lý': '#8b5cf6'
        };
        return statusColors[statusName] || '#64748b';
    }

    // ========================================
    // DOSSIER FETCHING & REMINDER CREATION
    // ========================================

    async function fetchDossiersByRegion(token, regId) {
        const currentDay = new Date().getDate();
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        let page = 1;
        const size = 50;
        let flag = false;

        if (!token) {
            console.warn("ReD: No token provided for fetchDossiersByRegion");
            return;
        }

        // Clear all existing dossier reminders before scanning
        console.log("ReD: Clearing old dossier reminders before new scan...");
        let reminders = GM_getValue('reminders', []);
        const nonDossierReminders = reminders.filter(r => r.type !== 'dossier');
        GM_setValue('reminders', nonDossierReminders);
        console.log(`ReD: Cleared ${reminders.length - nonDossierReminders.length} old dossier reminders`);

        try {
            while (!flag) {
                const query = `pa/dossier/search?page=${page}&size=${size}&applicant-organization=&spec=slice&receipt-code=&identity-number=&applicant-name=&applicant-owner-name=&remind-id=&procedure-code=&accepted-from=&accepted-to=&ancestor-agency-id=${regId}&vnpost-status-return-code=&receiving-kind-id=&applied-from=${currentDay}%2F${currentMonth - 1}%2F${currentYear}&applied-to=${currentDay}%2F${currentMonth}%2F${currentYear}&taxCode=&resPerson=&isAgencySearch=true&code-match=&nation-code-match=`;

                console.log(`ReD: Đang quét trang ${page}...`);

                const response = await fetch(`${CONFIG.API_URL}/${query}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.last) {
                    flag = true;
                }

                const filteredStatusDossier = data.content
                .map(d => new DossierData(d))
                .filter(d =>
                        d.dossierTaskStatus.name === "Yêu cầu thanh toán" ||
                        d.dossierTaskStatus.name === "Yêu cầu bổ sung giấy tờ" ||
                        d.dossierTaskStatus.name === "Thụ lý hồ sơ" ||
                        d.dossierTaskStatus.name === "Đã thanh toán" ||
                        d.dossierTaskStatus.name === "Đang xử lý"
                       );

                // Check each dossier and create reminders for those close to deadline
                for (const dossier of filteredStatusDossier) {
                    if (dossier.isCloseToDeadline(3)) {
                        // console.log("ReD: Dossier close to deadline:", dossier);
                        addDossierReminder(dossier);
                    }
                }

                page += 1;

                // Add delay before next iteration
                if (!flag) {
                    console.log(`ReD: Đợi ${CONFIG.FETCH_DELAY / 1000} giây trước khi quét lần tiếp theo...`);
                    await delay(CONFIG.FETCH_DELAY);
                }
            }

            console.log("ReD: Đã quét xong");

            // Re-render after scan completes
            const updatedReminders = GM_getValue('reminders', []);
            renderReminders(updatedReminders);
            console.log(`ReD: Scan complete. Total reminders: ${updatedReminders.length}`);

        } catch (error) {
            console.error("ReD: fetchDossiersByRegion error", error);
        }
    }

    function addDossierReminder(dossier) {
        let reminders = GM_getValue('reminders', []);

        // No need to check for existing reminder since we cleared all dossier reminders before scan
        // Just add the new reminder directly

        // Calculate days to deadline
        const diffDays = dossier.getDaysToDeadline();
        if (diffDays === null || diffDays <= 0) {
            console.log("ReD: Invalid deadline for dossier", dossier.code);
            return;
        }

        const appointment = new Date(dossier.appointmentDate);

        // Create reminder message with structured data
        const message = `⚠️ Hồ sơ ${dossier.code} sắp đến hạn!\n` +
              `Tên: ${dossier.taskName || 'N/A'}\n` +
              `Trạng thái: ${dossier.dossierTaskStatus.name}\n` +
              `Còn ${diffDays} ngày đến hạn (${appointment.toLocaleDateString('vi-VN')})`;

        // Generate new ID
        const newId = Math.max(0, ...reminders.map(r => r.id)) + 1;

        // Set reminder time: immediate if <= 1 day, otherwise 1 day before deadline
        let reminderTime;
        if (diffDays <= 1) {
            reminderTime = Date.now() + 60000; // 1 minute from now for urgent cases
        } else {
            reminderTime = appointment.getTime() - (24 * 60 * 60 * 1000); // 1 day before
        }
        // console.log("CODEEE:",dossier)
        // Add reminder
        const newReminder = {
            id: newId,
            dossierId: dossier.id,
            dossierCode: dossier.code,
            dossierStatus: dossier.dossierTaskStatus.name,
            daysToDeadline: diffDays,
            appointmentDate: dossier.appointmentDate,
            sectorName: dossier.sectorName,
            procedureTypeName: dossier.procedureTypeName,
            time: reminderTime,
            message: message,
            shown: false,
            type: 'dossier' // Mark as dossier reminder
        };

        reminders.push(newReminder);
        GM_setValue('reminders', reminders);

        // console.log("ReD: Created reminder for dossier", dossier.code, newReminder);
    }

    function cleanupOldDossierReminders() {
        // This function is now simplified - just remove old shown reminders
        let reminders = GM_getValue('reminders', []);
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);

        const initialCount = reminders.length;

        // Remove shown dossier reminders older than 1 day
        reminders = reminders.filter(r => {
            // Keep non-dossier reminders
            if (r.type !== 'dossier') return true;

            // Remove shown dossier reminders older than 1 day
            if (r.shown && r.time < oneDayAgo) {
                console.log("ReD: Cleaning up old shown reminder for dossier", r.dossierCode);
                return false;
            }

            return true;
        });

        if (reminders.length !== initialCount) {
            GM_setValue('reminders', reminders);
            console.log(`ReD: Cleaned up ${initialCount - reminders.length} old shown reminders`);
        }
    }

    // ========================================
    // UI FUNCTIONS
    // ========================================

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .red-dashboard {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 999998;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .red-dashboard.collapsed {
        width: 60px;
        height: 60px;
      }

      .red-dashboard.expanded {
        width: 580px;
        max-height: 500px;
      }

      .red-toggle-btn {
        margin-top:10px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.3s ease;
      }

      .red-toggle-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
      }

      .red-toggle-btn:active {
        transform: scale(0.95);
      }

      .red-toggle-icon {
        font-size: 28px;
        transition: transform 0.3s ease;
      }

      .red-dashboard.expanded .red-toggle-icon {
        transform: rotate(180deg);
      }

      .red-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ef4444;
        color: white;
        border-radius: 12px;
        padding: 2px 7px;
        font-size: 12px;
        font-weight: bold;
        min-width: 20px;
        text-align: center;
        animation: pulse 2s infinite;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
      }

      .red-panel {
        display: none;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        overflow: hidden;
        margin-bottom: 10px;
        animation: slideUp 0.3s ease-out;
      }

      .red-dashboard.expanded .red-panel {
        display: block;
      }

      .red-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .red-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        flex: 1;
      }

      .red-content {
        max-height: 350px;
        overflow-y: auto;
        padding: 12px;
      }

      .red-content::-webkit-scrollbar {
        width: 6px;
      }

      .red-content::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      .red-content::-webkit-scrollbar-thumb {
        background: #cbd5e0;
        border-radius: 3px;
      }

      .red-content::-webkit-scrollbar-thumb:hover {
        background: #a0aec0;
      }

      .red-reminder-item {
        background: #f8fafc;
        border-left: 4px solid #667eea;
        border-radius: 8px;
        padding: 12px 14px;
        margin-bottom: 10px;
        transition: all 0.2s ease;
      }

      .red-reminder-item:hover {
        background: #f1f5f9;
        transform: translateX(4px);
      }

      .red-reminder-item.active {
        border-left-color: #10b981;
        background: #ecfdf5;
      }

      .red-reminder-item.pending {
        border-left-color: #f59e0b;
        background: #fffbeb;
      }

      .red-reminder-item.urgent {
        border-left-color: #ef4444;
        background: #fef2f2;
      }

      .red-reminder-time {
        font-size: 12px;
        color: #64748b;
        font-weight: 500;
        margin-bottom: 6px;
      }

      .red-reminder-message {
        color: #1e293b;
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 8px;
      }

      .red-reminder-highlight {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
      }

      .red-highlight-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        color: white;
      }

      .red-highlight-code {
        background: #667eea;
        font
      }

      .red-highlight-days {
        background: #ef4444;
        animation: pulse 2s infinite;
      }

      .red-highlight-days.moderate {
        background: #f59e0b;
      }

      .red-highlight-days.safe {
        background: #10b981;
      }

      .red-highlight-date {
        background: #8b5cf6;

      }

      .red-status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        color: white;
        margin-bottom: 8px;
      }

      .red-reminder-actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .red-btn {
        padding: 6px 12px;
        border-radius: 6px;
        border: none;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
      }

      .red-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .red-btn-primary {
        background: #667eea;
        color: white;
      }

      .red-btn-primary:hover:not(:disabled) {
        background: #5568d3;
      }

      .red-btn-secondary {
        background: #e2e8f0;
        color: #475569;
      }

      .red-btn-secondary:hover:not(:disabled) {
        background: #cbd5e1;
      }

      .red-btn-danger {
        background: #ef4444;
        color: white;
      }

      .red-btn-danger:hover:not(:disabled) {
        background: #dc2626;
      }

      .red-btn-copy {
        background: #10b981;
        color: white;
      }

      .red-btn-copy:hover:not(:disabled) {
        background: #059669;
      }

      .red-empty {
        text-align: center;
        padding: 40px 20px;
        color: #94a3b8;
      }

      .red-empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.5;
      }

      .red-footer {
        padding: 12px 16px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        text-align: center;
      }

      .red-add-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .red-add-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
    `;
        document.head.appendChild(style);
    }

    function createDashboard() {
        const dashboard = document.createElement('div');
        dashboard.className = 'red-dashboard collapsed';
        dashboard.id = 'red-reminder-dashboard';

        dashboard.innerHTML = `
      <div class="red-panel">
        <div class="red-header">
          <span>🔔</span>
          <h3>Nhắc nhở (<span id="red-header-reminders-total">0</span>)</h3>
        </div>
        <div class="red-content" id="red-reminders-list">
          <div class="red-empty">
            <div class="red-empty-icon">📭</div>
            <div>Không có nhắc nhở</div>
          </div>
        </div>

      </div>
      <button class="red-toggle-btn" id="red-toggle">
        <span class="red-toggle-icon">🔔</span>
        <span class="red-badge" id="red-badge" style="display: none;">0</span>
      </button>
    `;

        document.body.appendChild(dashboard);

        // Toggle functionality
        const toggleBtn = document.getElementById('red-toggle');
        toggleBtn.addEventListener('click', () => {
            dashboard.classList.toggle('collapsed');
            dashboard.classList.toggle('expanded');
        });
    }

    function renderReminders(reminders) {
        const container = document.getElementById('red-reminders-list');
        const badge = document.getElementById('red-badge');
        const numReminders = document.getElementById('red-header-reminders-total');

        if (!container || !badge) return;

        const activeReminders = reminders.filter(r => !r.shown);

        if (activeReminders.length === 0) {
            container.innerHTML = `
        <div class="red-empty">
          <div class="red-empty-icon">📭</div>
          <div>Không có nhắc nhở</div>
        </div>
      `;
            badge.style.display = 'none';
        } else {
            badge.style.display = 'block';
            badge.textContent = activeReminders.length;
            numReminders.textContent = activeReminders.length;
            // Sort reminders by time (earliest first)
            const sortedReminders = [...reminders].sort((a, b) => a.time - b.time);

            container.innerHTML = sortedReminders.map(r => {
                const isPast = Date.now() >= r.time;
                const timeStr = new Date(r.time).toLocaleString('vi-VN');
                let status = r.shown ? 'active' : (isPast ? 'pending' : '');

                // Build highlight badges for dossier reminders
                let highlightHtml = '';
                if (r.type === 'dossier') {
                    const daysClass = r.daysToDeadline <= 1 ? '' : (r.daysToDeadline === 2 ? 'moderate' : 'safe');
                    const statusColor = getStatusColor(r.dossierStatus);
                    const appointmentDateStr = new Date(r.appointmentDate).toLocaleDateString('vi-VN');
                    const hourDiff = getHourDiff(new Date(r.appointmentDate).getTime())
                    highlightHtml = `
                        <div class="red-reminder-highlight">
                            <span class="red-highlight-badge red-highlight-code">
                                ${escapeHtml(r.dossierCode)}
                            </span>
                            <span class="red-highlight-badge red-highlight-code  ">
                                📋 ${r.sectorName}
                            </span>
                            <span class="red-highlight-badge red-highlight-days ${daysClass}">
                                ⏰ Còn ${hourDiff}
                            </span>

                        </div>
                        <div class="red-status-badge" style="background-color: ${statusColor};">
                            ${escapeHtml(r.dossierStatus)}
                        </div>
                        

                    `;

                    // Add urgent status
                    if (!r.shown && r.daysToDeadline <= 1) {
                        status = 'urgent';
                    }
                }

                return `
          <div class="red-reminder-item ${status}" data-reminder-id="${r.id}">
              ${highlightHtml}
                <div class="red-reminder-actions">
                    ${!r.shown ? `
                ${r.type === 'dossier' ? `
                  <button class="red-btn red-btn-copy" data-action="copy" data-code="${escapeHtml(r.dossierCode)}">
                    📋 Copy
                  </button>
                ` : ''}

                <button class="red-btn red-btn-danger" data-action="clear" data-id="${r.id}">
                  🗑️ Xóa
                </button>
              ` : `<span style="color: #10b981; font-size: 12px;">✓ Đã xem</span>`}
                </div>
                </div>
                `;
            }).join('');

            // Attach event listeners to all buttons after rendering
            attachButtonListeners();
        }
    }

    // Attach event listeners to action buttons
    function attachButtonListeners() {
        const container = document.getElementById('red-reminders-list');
        if (!container) return;

        // Use event delegation for better performance
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;

            const action = btn.dataset.action;
            const id = parseInt(btn.dataset.id);
            const code = btn.dataset.code;

            switch (action) {
                case 'copy':
                    handleCopy(code, btn);
                    break;
                    // case 'dismiss':
                    //     handleDismiss(id);
                    //     break;
                    // case 'snooze':
                    //     handleSnooze(id);
                    //     break;
                case 'clear':
                    handleClear(id);
                    break;
            }
        });
    }

    // Action handlers
    function handleCopy(dossierCode, btn) {
        const textarea = document.createElement('textarea');
        textarea.value = dossierCode;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);

        try {
            textarea.select();
            textarea.setSelectionRange(0, 99999);

            const successful = document.execCommand('copy');

            if (successful) {
                console.log("ReD: Copied dossier code", dossierCode);

                const originalText = btn.innerHTML;
                const originalBg = btn.style.background;

                btn.innerHTML = '✓ Đã copy';
                btn.style.background = '#10b981';
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = originalBg;
                    btn.disabled = false;
                }, 2000);

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(dossierCode).catch(err => {
                        console.warn("ReD: Clipboard API failed", err);
                    });
                }
            } else {
                throw new Error('Copy command failed');
            }
        } catch (err) {
            console.error("ReD: Copy failed", err);

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(dossierCode)
                    .then(() => {
                    console.log("ReD: Copied via Clipboard API", dossierCode);
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✓ Đã copy';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                })
                    .catch(() => {
                    alert('Không thể copy. Mã hồ sơ: ' + dossierCode);
                });
            } else {
                alert('Không thể copy. Mã hồ sơ: ' + dossierCode);
            }
        } finally {
            document.body.removeChild(textarea);
        }
    }

    function handleDismiss(id) {
        let reminders = GM_getValue('reminders', []);
        const reminder = reminders.find(r => r.id === id);
        if (reminder) {
            reminder.shown = true;
            GM_setValue('reminders', reminders);
            renderReminders(reminders);
            console.log("ReD: Dismissed reminder", id);
        }
    }

    function handleSnooze(id) {
        let reminders = GM_getValue('reminders', []);
        const reminder = reminders.find(r => r.id === id);
        if (reminder) {
            reminder.time = Date.now() + 300000; // 5 minutes
            reminder.shown = false;
            GM_setValue('reminders', reminders);
            renderReminders(reminders);
            console.log("ReD: Snoozed reminder", id);
        }
    }

    function handleClear(id) {
        let reminders = GM_getValue('reminders', []);
        const initialLength = reminders.length;
        reminders = reminders.filter(r => r.id !== id);

        if (reminders.length < initialLength) {
            GM_setValue('reminders', reminders);
            renderReminders(reminders);
            console.log("ReD: Deleted reminder", id);
        }
    }

    // Set global reference to renderReminders
    renderRemindersGlobal = renderReminders;

    // ========================================
    // REMINDER MANAGEMENT
    // ========================================

    async function initReminders() {
        let reminders = GM_getValue('reminders', []);

        // Initial render
        renderReminders(reminders);

        // Poll reminders periodically
        setInterval(() => {
            reminders = GM_getValue('reminders', []);
            const now = Date.now();
            let hasChanges = false;

            reminders.forEach(r => {
                if (!r.shown && now >= r.time) {
                    // r.shown = true;
                    hasChanges = true;
                    // console.log("ReD: Shown reminder", r);

                    if (CONFIG.TELEGRAM_BOT_TOKEN) {
                        sendTelegramNotification(r.message);
                    }
                }
            });

            if (hasChanges) {
                GM_setValue('reminders', reminders);
                renderReminders(reminders);
            }
        }, CONFIG.CHECK_INTERVAL);
    }

    async function sendTelegramNotification(message) {
        if (!CONFIG.TELEGRAM_BOT_TOKEN) return;

        try {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`,
                data: JSON.stringify({
                    chat_id: GM_getValue('telegram_chat_id', ''),
                    text: `🔔 Reminder: ${message}`
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    console.log('ReD: Telegram notification sent', response);
                },
                onerror: (error) => {
                    console.error('ReD: Telegram notification failed', error);
                }
            });
        } catch (err) {
            console.error('ReD: Telegram error', err);
        }
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    window.addEventListener('load', async () => {
        try {
            // Wait for token stored
            await new Promise(r => setTimeout(r, 5000));

            const userData = await getTokenWithRetry();

            let userAgency = await getRegionIdFromLocalStorage()
            let count = 0;
            // Clean up old reminders first
            cleanupOldDossierReminders();


            // Fetch dossiers and create reminders on load
            if (userData && userAgency) {
                const regId = userAgency.parent.id
                fetchDossiersByRegion(userData, regId);

                // Re-fetch dossiers every hour
                setInterval(async () => {
                    await fetchDossiersByRegion(userData, regId);
                }, 60 * 60 * 1000);
            } else {

                console.warn("ReD: No user token found, skipping dossier fetch, refreshing window again");
            }

            // Add CSS styles
            addStyles();

            // Create dashboard widget
            createDashboard();

            // Initialize reminder system
            await initReminders();

        } catch (err) {
            console.error("ReD: Initialization error", err);
        }
    });

})();