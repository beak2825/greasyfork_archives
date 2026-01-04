// ==UserScript==
// @license MIT
// @name         Helper App by jkee
// @namespace    http://tampermonkey.net/
// @version      11.3
// @description  Разработчики Helper простите меня за этот мусор
// @author       Frosjkee
// @match        https://helper-app.com/*
// @match        https://*.helper-app.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557999/Helper%20App%20by%20jkee.user.js
// @updateURL https://update.greasyfork.org/scripts/557999/Helper%20App%20by%20jkee.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const managerPaths = [
        '/chatmanager',
        '/v3/chatmanager',
        '/management/',
        '/admin',
        '/team',
        '/settings/team'
    ];

    let currentFontSize = localStorage.getItem('jkee-font-size') || '13';
    let currentPath = window.location.pathname;
    let isManagerPage = managerPaths.some(path => currentPath.includes(path));
    let stylesApplied = false;

    console.log(`✓ Начальный путь: ${currentPath}`);
    console.log(`✓ Страница менеджера: ${isManagerPage ? 'ДА' : 'НЕТ'}`);

    function checkPageType() {
        const newPath = window.location.pathname;
        const newIsManagerPage = managerPaths.some(path => newPath.includes(path));

        if (newPath !== currentPath) {
            console.log(`✓ Переход: ${currentPath} → ${newPath}`);
            console.log(`✓ Тип страницы: ${newIsManagerPage ? 'МЕНЕДЖЕР' : 'ОПЕРАТОР'}`);

            currentPath = newPath;
            const wasManagerPage = isManagerPage;
            isManagerPage = newIsManagerPage;

            if (!wasManagerPage && newIsManagerPage) {
                console.log('✓ Удаляем стили оператора');
                removeOperatorStyles();
                showNotification('✓ jkee 11.3 - Режим менеджера', 'info');
            }
            else if (wasManagerPage && !newIsManagerPage) {
                console.log('✓ Применяем стили оператора');
                applyOperatorStyles();
                showNotification(`✓ jkee 11.3 - Режим оператора`, 'success');
            }
        }
    }

    function removeOperatorStyles() {
        const operatorStyle = document.getElementById('frosjkee-premium-styles');
        if (operatorStyle) {
            operatorStyle.remove();
        }
        stylesApplied = false;
    }

    function applyOperatorStyles() {
        if (stylesApplied) return;

        const screenWidth = window.innerWidth;
        let columnWidth, gapSize, paddingSize;

        if (screenWidth >= 1920) {
            columnWidth = 380;
            gapSize = 60;
            paddingSize = 60;
        } else if (screenWidth >= 1600) {
            columnWidth = 350;
            gapSize = 40;
            paddingSize = 40;
        } else if (screenWidth >= 1366) {
            columnWidth = 310;
            gapSize = 10;
            paddingSize = 10;
        } else {
            columnWidth = 280;
            gapSize = 10;
            paddingSize = 10;
        }

        const style = document.createElement('style');
        style.id = 'frosjkee-premium-styles';
        style.textContent = `
        .chat-v3-wrapper,
        .flex.w-\\[642px\\].flex-col.h-full {
            contain: layout style !important;
        }

        [data-testid="task-v2-list-item"],
        [data-testid="dialog-chat"],
        [data-e2e="chat-manager-right-sidebar-dialogs-list-item"],
        [data-testid="create-new-accordion-item"],
        button[role="tab"],
        [data-testid="profile-ru-modal-trigger"],
        [data-testid="profile-tu-modal-trigger"] {
            will-change: transform !important;
        }

        .container {
            width: 100vw !important;
            max-width: 100vw !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
        }

        .row.justify-center,
        .row {
            justify-content: stretch !important;
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .chat-v3-wrapper {
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .chat-container {
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
        }

        .w-full.h-full.flex {
            width: 100% !important;
        }

        .flex.w-\\[642px\\].flex-col.h-full {
            width: auto !important;
            max-width: none !important;
            flex: 1 1 auto !important;
            border: 1px solid rgba(74,158,255,0.2) !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            background: linear-gradient(180deg, #141e2d 0%, #0d1721 100%) !important;
        }

        .flex.w-\\[642px\\].flex-col.h-full .flex.items-center.gap-4,
        .flex.w-\\[642px\\].flex-col.h-full > div > div:last-child > div:last-child {
            justify-content: center !important;
        }

        textarea[placeholder*="Type your message"] {
            overflow-y: auto !important;
            resize: none !important;
        }

        textarea[placeholder*="Type your message"]::-webkit-scrollbar {
            width: 8px !important;
        }

        textarea[placeholder*="Type your message"]::-webkit-scrollbar-track {
            background: rgba(15,25,35,0.5) !important;
            border-radius: 4px !important;
        }

        textarea[placeholder*="Type your message"]::-webkit-scrollbar-thumb {
            background: rgba(74,158,255,0.5) !important;
            border-radius: 4px !important;
        }

        textarea[placeholder*="Type your message"]::-webkit-scrollbar-thumb:hover {
            background: rgba(74,158,255,0.7) !important;
        }

        body.chat-v3 {
            background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0d1117 100%) !important;
            background-attachment: fixed !important;
        }

        main.main {
            background: transparent !important;
        }

        .h-\\[56px\\].px-6.flex.justify-between.border-b.border-solid.border-border-secondary.bg-bg-secondary {
            background: linear-gradient(180deg, #1f2937 0%, #1a2332 100%) !important;
            border-bottom: 1px solid rgba(74,158,255,0.2) !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important;
        }

        .h-\\[78px\\].w-full.flex.px-4.bg-bg-secondary.border-b.border-t.border-solid.border-border-secondary {
            background: linear-gradient(180deg, rgba(26,35,50,0.95) 0%, rgba(15,25,35,0.98) 100%) !important;
            border-bottom: 1px solid rgba(74,158,255,0.15) !important;
            border-top: 1px solid rgba(74,158,255,0.15) !important;
        }

        [data-testid="profile-ru-modal-trigger"],
        [data-testid="profile-tu-modal-trigger"] {
            background: linear-gradient(135deg, rgba(42,52,70,0.9) 0%, rgba(30,40,58,0.95) 100%) !important;
            border: 1px solid rgba(74,158,255,0.25) !important;
            border-radius: 12px !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important;
        }

        [data-testid="profile-ru-modal-trigger"]:hover,
        [data-testid="profile-tu-modal-trigger"]:hover {
            background: linear-gradient(135deg, rgba(52,72,100,0.95) 0%, rgba(40,60,88,1) 100%) !important;
            border-color: rgba(74,158,255,0.5) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 24px rgba(74,158,255,0.15) !important;
        }

        .relative.flex-1.h-full.border-r.border-l.border-solid.border-border-secondary {
            background: linear-gradient(180deg, #141e2d 0%, #0d1721 100%) !important;
        }

        .flex.flex-col.h-full.justify-end.bg-bg-primary.border-b.border-t.border-solid.border-border-secondary {
            background: transparent !important;
            border: none !important;
        }

        .p-4.flex.flex-col.gap-\\[15px\\] {
            background: transparent !important;
        }

        .bg-bg-user-chat {
            background: linear-gradient(135deg, rgba(74,158,255,0.15) 0%, rgba(59,130,246,0.2) 100%) !important;
            border: 1px solid rgba(74,158,255,0.3) !important;
            border-radius: 12px 12px 4px 12px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }

        .bg-bg-table-line {
            background: linear-gradient(135deg, rgba(42,52,70,0.7) 0%, rgba(30,40,58,0.8) 100%) !important;
            border: 1px solid rgba(74,158,255,0.15) !important;
            transition: all 0.2s ease !important;
        }

        .bg-bg-table-line:hover {
            background: linear-gradient(135deg, rgba(42,52,70,0.85) 0%, rgba(30,40,58,0.95) 100%) !important;
            border-color: rgba(74,158,255,0.3) !important;
            transform: translateX(-2px) !important;
            box-shadow: 0 4px 12px rgba(74,158,255,0.15) !important;
        }

        .bg-bg-card {
            background: linear-gradient(135deg, rgba(42,52,70,0.9) 0%, rgba(30,40,58,0.95) 100%) !important;
            border: 1px solid rgba(74,158,255,0.2) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }

        .bg-bg-tertiary.rounded-lg {
            background: linear-gradient(135deg, rgba(42,52,70,0.9) 0%, rgba(30,40,58,0.95) 100%) !important;
            border: 1px solid rgba(74,158,255,0.2) !important;
            border-radius: 12px 12px 12px 4px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }

      .absolute.px-4.py-1.border.border-t-0.border-solid.border-border-secondary.z-20.bg-bg-secondary.rounded-b.justify-self-center {
      background: linear-gradient(135deg, rgba(42,52,70,0.95) 0%, rgba(30,40,58,0.98) 100%) !important;
      border: 1px solid rgba(74,158,255,0.25) !important;
      border-top: none !important;
      backdrop-filter: blur(10px) !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
      }

        .bg-border-secondary.relative.h-px,
        .bg-border-primary.relative.h-px {
            background: rgba(74,158,255,0.2) !important;
        }

        .column.w-\\[320px\\].h-full > div,
        .flex.flex-col.w-full.h-full.px-2.py-3.bg-bg-secondary.border-r.border-solid.border-border-secondary {
            background: linear-gradient(180deg, #1a2332 0%, #0f1923 100%) !important;
            border-right: 1px solid rgba(74,158,255,0.1) !important;
            box-shadow: 4px 0 24px rgba(0,0,0,0.3) !important;
        }

        .flex.flex-col.w-\\[320px\\].h-full:last-child,
        .flex.flex-col.w-\\[320px\\].h-full > .overflow-hidden {
            background: linear-gradient(180deg, #1a2332 0%, #0f1923 100%) !important;
            border-left: 1px solid rgba(74,158,255,0.1) !important;
            box-shadow: -4px 0 24px rgba(0,0,0,0.3) !important;
        }

        .flex.flex-col.w-\\[320px\\].h-full button[role="tab"],
        [role="tablist"] button {
            background: linear-gradient(135deg, rgba(42,52,70,0.7) 0%, rgba(30,40,58,0.8) 100%) !important;
            border: 1px solid rgba(74,158,255,0.15) !important;
            color: rgba(255,255,255,0.6) !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
        }

button[role="checkbox"][data-testid*="selected-checkbox"] {
    background: rgba(30,40,58,0.9) !important;
    border: 1px solid rgba(74,158,255,0.25) !important;
    border-radius: 4px !important;
    transition: all 0.3s ease !important;
}

button[role="checkbox"][data-testid*="selected-checkbox"]:hover {
    border-color: rgba(74,158,255,0.5) !important;
    background: rgba(35,45,65,0.95) !important;
}

button[role="checkbox"][data-testid*="selected-checkbox"][data-state="checked"],
button[role="checkbox"][data-testid*="selected-checkbox"][aria-checked="true"] {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
    border-color: rgba(16,185,129,0.6) !important;
    box-shadow: 0 0 12px rgba(16,185,129,0.4) !important;
}

button[role="checkbox"][data-testid*="selected-checkbox"][data-state="checked"] svg,
button[role="checkbox"][data-testid*="selected-checkbox"][aria-checked="true"] svg {
    color: #ffffff !important;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)) !important;
}

a[data-testid="profiles-tu-list-item"].bg-bg-card {
    transition: all 0.2s ease !important;
}

a[data-testid="profiles-tu-list-item"][aria-selected="true"],
a[data-testid="profiles-tu-list-item"].selected {
    background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.2) 100%) !important;
    border-left: 3px solid #10b981 !important;
}

.py-5.px-4.flex.items-baseline.gap-3.justify-between {
    background: linear-gradient(180deg, #1a2332 0%, #0f1923 100%) !important;
    border-bottom: 1px solid rgba(74,158,255,0.15) !important;
}

.bg-bg-secondary.px-4.pb-0\\.5.pt-3.flex.justify-between {
    background: linear-gradient(180deg, #1a2332 0%, #0f1923 100%) !important;
    border-bottom: 1px solid rgba(74,158,255,0.15) !important;
}

.simple {
    background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0d1117 100%) !important;
    background-attachment: fixed !important;
    min-height: 100vh !important;
}

div[data-target="loader"] {
    background: transparent !important;
}

div[data-target="loader"] > div {
    color: #4a9eff !important;
    font-weight: 600 !important;
    text-shadow: 0 2px 8px rgba(74,158,255,0.3) !important;
}

.main-app-content {
    background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0d1117 100%) !important;
    min-height: 100vh !important;
}

        .flex.flex-col.w-\\[320px\\].h-full button[role="tab"][data-state="active"],
        [role="tablist"] button[data-state="active"],
        .flex.flex-col.w-\\[320px\\].h-full button[role="tab"][aria-selected="true"],
        [role="tablist"] button[aria-selected="true"] {
            background: linear-gradient(135deg, #4a9eff 0%, #3b82f6 100%) !important;
            border: 1px solid rgba(74,158,255,0.6) !important;
            color: #ffffff !important;
            box-shadow: 0 4px 12px rgba(74,158,255,0.4) !important;
            transform: translateY(-1px) !important;
        }

        .flex.flex-col.w-\\[320px\\].h-full button[role="tab"]:hover,
        [role="tablist"] button:hover {
            background: linear-gradient(135deg, rgba(52,72,100,0.85) 0%, rgba(40,60,88,0.9) 100%) !important;
            border-color: rgba(74,158,255,0.35) !important;
            color: rgba(255,255,255,0.9) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 3px 10px rgba(74,158,255,0.2) !important;
        }

        .flex.flex-col.w-\\[320px\\].h-full button[role="tab"][data-state="active"]:hover,
        [role="tablist"] button[data-state="active"]:hover {
            background: linear-gradient(135deg, #5aaeff 0%, #4b92ff 100%) !important;
            border-color: rgba(74,158,255,0.8) !important;
            box-shadow: 0 6px 16px rgba(74,158,255,0.5) !important;
        }

        [data-testid="task-v2-list-item"],
        [data-testid="dialog-chat"],
        [data-e2e="chat-manager-right-sidebar-dialogs-list-item"] {
            background: linear-gradient(135deg, rgba(42,52,70,0.9) 0%, rgba(30,40,58,0.95) 100%) !important;
            border: 1px solid rgba(74,158,255,0.25) !important;
            border-radius: 10px !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            box-shadow: 0 3px 8px rgba(0,0,0,0.2) !important;
        }

        [data-testid="task-v2-list-item"]:hover,
        [data-testid="dialog-chat"]:hover,
        [data-e2e="chat-manager-right-sidebar-dialogs-list-item"]:hover {
            background: linear-gradient(135deg, rgba(52,72,100,0.95) 0%, rgba(40,60,88,1) 100%) !important;
            border-color: rgba(74,158,255,0.5) !important;
            transform: translateY(-1px) scale(1.01) !important;
            box-shadow: 0 5px 15px rgba(74,158,255,0.15) !important;
        }

		img[src="/static/img/layout/ajax-loader-stripe.gif"],
		img[alt="loader"] {
			content: url("https://i.pinimg.com/originals/c0/30/03/c03003776e9cb3e20ba7bd3171700507.gif") !important;
			width: auto !important;
			height: auto !important;
			max-width: 200px !important;
			max-height: 200px !important;
		}

		div[style*="top: -125px"] {
			top: 20px !important;
		}

        [data-testid="dialog-footer-block"],
        .bg-bg-primary.px-4.py-5 {
            background: linear-gradient(180deg, rgba(26,35,50,0.95) 0%, rgba(15,25,35,0.98) 100%) !important;
            border-top: 1px solid rgba(74,158,255,0.15) !important;
            box-shadow: 0 -4px 24px rgba(0,0,0,0.3) !important;
        }

        [data-testid="dialog-footer-form-textarea"] {
            background: rgba(30,40,58,0.9) !important;
            border: 1px solid rgba(74,158,255,0.25) !important;
            color: #ffffff !important;
            border-radius: 10px !important;
            transition: border-color 0.2s ease !important;
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.2) !important;
        }

        [data-testid="dialog-footer-form-textarea"]:focus {
            border-color: rgba(74,158,255,0.5) !important;
            box-shadow: 0 0 20px rgba(74,158,255,0.2), inset 0 2px 8px rgba(0,0,0,0.2) !important;
            background: rgba(35,45,65,0.95) !important;
        }

        [data-testid="create-new-accordion-item"] {
            background: linear-gradient(135deg, rgba(42,52,70,0.7) 0%, rgba(30,40,58,0.8) 100%) !important;
            border-radius: 10px !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 3px 8px rgba(0,0,0,0.2) !important;
        }

        [data-testid="create-new-accordion-item"]:hover {
            background: linear-gradient(135deg, rgba(42,52,70,0.85) 0%, rgba(30,40,58,0.95) 100%) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 5px 15px rgba(74,158,255,0.15) !important;
        }

        [data-testid="create-new-accordion-item"][data-state="open"] {
            background: linear-gradient(135deg, rgba(74,158,255,0.15) 0%, rgba(59,130,246,0.2) 100%) !important;
            box-shadow: 0 6px 20px rgba(74,158,255,0.25) !important;
        }

        [data-testid="create-new-accordion-item"] span.border-border-tertiary,
        [data-testid="create-new-accordion-item"] img.border-border-tertiary,
        [data-testid*="create-new-accordion-trigger-item"] .border-border-tertiary,
        [data-testid="create-new-accordion-item"] .bg-tertiary {
            border: none !important;
            border-width: 0 !important;
        }

        [data-testid*="create-new-add-message-btn"] {
            background: linear-gradient(135deg, rgba(42,52,70,0.8) 0%, rgba(30,40,58,0.9) 100%) !important;
            border: 1px solid rgba(74,158,255,0.25) !important;
            color: rgba(255,255,255,0.8) !important;
            border-radius: 8px !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        }

        [data-testid*="create-new-add-message-btn"]:hover {
            background: linear-gradient(135deg, #4a9eff 0%, #3b82f6 100%) !important;
            border-color: rgba(74,158,255,0.5) !important;
            color: #ffffff !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(74,158,255,0.3) !important;
        }

        .px-4.d-flex.overflow-hidden {
            background: linear-gradient(180deg, #1a2332 0%, #0f1923 100%) !important;
        }

        [role="tablist"]:has(button:contains("Create new")) {
            background: linear-gradient(180deg, #1f2937 0%, #1a2332 100%) !important;
            border-bottom: 1px solid rgba(74,158,255,0.2) !important;
            padding: 12px 16px !important;
        }

        input[placeholder*="Search by name"] {
            background: rgba(30,40,58,0.9) !important;
            border: 1px solid rgba(74,158,255,0.25) !important;
            color: #ffffff !important;
            border-radius: 8px !important;
        }

        input[placeholder*="Search by name"]:focus {
            border-color: rgba(74,158,255,0.5) !important;
            box-shadow: 0 0 20px rgba(74,158,255,0.2) !important;
        }

        [data-radix-scroll-area-viewport] {
            background: transparent !important;
        }

        [data-testid*="create-new-accordion-trigger-item"] {
            transition: all 0.2s ease !important;
        }

        [data-testid*="create-new-accordion-trigger-item"]:hover {
            color: #4a9eff !important;
        }

        [data-testid="create-new-accordion"] {
            gap: 8px !important;
        }

        [data-testid="navigate-to-chat-btn"] {
            background: linear-gradient(135deg, rgba(42,52,70,0.8) 0%, rgba(30,40,58,0.9) 100%) !important;
            border: 1px solid rgba(74,158,255,0.2) !important;
            border-radius: 8px !important;
            transition: transform 0.2s ease !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        }

        [data-testid="navigate-to-chat-btn"]:hover {
            background: linear-gradient(135deg, rgba(52,72,100,0.9) 0%, rgba(40,60,88,1) 100%) !important;
            border-color: rgba(74,158,255,0.4) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(74,158,255,0.2) !important;
        }

        [data-testid="mail-footer-form-textarea"] {
            background: rgba(30,40,58,0.9) !important;
            border: 1px solid rgba(74,158,255,0.25) !important;
            color: #ffffff !important;
            border-radius: 10px !important;
            transition: border-color 0.2s ease !important;
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.2) !important;
        }

        [data-testid="mail-footer-form-textarea"]:focus {
            border-color: rgba(74,158,255,0.5) !important;
            box-shadow: 0 0 20px rgba(74,158,255,0.2), inset 0 2px 8px rgba(0,0,0,0.2) !important;
            background: rgba(35,45,65,0.95) !important;
            outline: none !important;
        }

        [data-testid="mail-footer-form-textarea"]::placeholder {
            color: rgba(255,255,255,0.4) !important;
        }

        [data-testid="dialog-footer-form-send-btn"] {
            background: linear-gradient(135deg, #4a9eff 0%, #3b82f6 100%) !important;
            border: 1px solid rgba(74,158,255,0.5) !important;
            box-shadow: 0 4px 12px rgba(74,158,255,0.3) !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            border-radius: 10px !important;
        }

        [data-testid="dialog-footer-form-send-btn"]:hover:not(:disabled) {
            background: linear-gradient(135deg, #5aaeff 0%, #4b92ff 100%) !important;
            border-color: rgba(74,158,255,0.7) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(74,158,255,0.4) !important;
        }

        [data-testid="navigate-to-email-chat-btn"],
        [data-testid="handle-vip-status-btn"],
        [data-testid="show-notes-btn"],
        [data-testid="handle-bookmark-btn"],
        [data-testid="handle-pin-btn"],
        [data-testid="handle-like-btn"],
        [data-testid="actions-trigger"],
        button[data-testid*="starred"] {
            background: linear-gradient(135deg, rgba(42,52,70,0.8) 0%, rgba(30,40,58,0.9) 100%) !important;
            border: 1px solid rgba(74,158,255,0.2) !important;
            border-radius: 8px !important;
            transition: transform 0.2s ease !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        }

        [data-testid="navigate-to-email-chat-btn"]:hover,
        [data-testid="handle-vip-status-btn"]:hover,
        [data-testid="show-notes-btn"]:hover,
        [data-testid="handle-bookmark-btn"]:hover,
        [data-testid="handle-pin-btn"]:hover,
        [data-testid="handle-like-btn"]:hover,
        [data-testid="actions-trigger"]:hover,
        button[data-testid*="starred"]:hover {
            background: linear-gradient(135deg, rgba(52,72,100,0.9) 0%, rgba(40,60,88,1) 100%) !important;
            border-color: rgba(74,158,255,0.4) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(74,158,255,0.2) !important;
        }

        [data-testid="emoji-btn"],
        [data-testid="sticker-btn"],
        [data-testid="media-btn"],
        [data-testid="gift-btn"],
        [data-testid="post-btn"] {
            background: linear-gradient(135deg, rgba(42,52,70,0.8) 0%, rgba(30,40,58,0.9) 100%) !important;
            border: 1px solid rgba(74,158,255,0.2) !important;
            border-radius: 10px !important;
            transition: transform 0.2s ease !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        }

        [data-testid="emoji-btn"]:hover:not(:disabled),
        [data-testid="sticker-btn"]:hover:not(:disabled),
        [data-testid="media-btn"]:hover:not(:disabled),
        [data-testid="gift-btn"]:hover:not(:disabled),
        [data-testid="post-btn"]:hover:not(:disabled) {
            background: linear-gradient(135deg, rgba(52,72,100,0.9) 0%, rgba(40,60,88,1) 100%) !important;
            border-color: rgba(74,158,255,0.4) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(74,158,255,0.2) !important;
        }

        input[placeholder="Search"],
        input.bg-bg-input,
        input[placeholder*="Search"] {
            background: rgba(30,40,58,0.9) !important;
            border: 1px solid rgba(74,158,255,0.25) !important;
            border-radius: 8px !important;
            color: #ffffff !important;
            transition: border-color 0.2s ease !important;
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.2) !important;
        }

        input[placeholder="Search"]:focus,
        input.bg-bg-input:focus,
        input[placeholder*="Search"]:focus {
            border-color: rgba(74,158,255,0.5) !important;
            background: rgba(35,45,65,0.95) !important;
            box-shadow: 0 0 20px rgba(74,158,255,0.2), inset 0 2px 8px rgba(0,0,0,0.2) !important;
            outline: none !important;
        }

.relative.flex.flex-col.px-4.py-3.gap-2.bg-bg-secondary.border-b.border-r.border-solid.border-border-secondary {
    background: linear-gradient(180deg, #1a2332 0%, #0f1923 100%) !important;
    border-right: 1px solid rgba(74,158,255,0.1) !important;
    border-bottom: 1px solid rgba(74,158,255,0.15) !important;
}

.w-\\[723px\\].flex.flex-wrap.justify-center.p-4 {
    background: linear-gradient(180deg, #141e2d 0%, #0d1721 100%) !important;
    border-radius: 8px !important;
}

.w-\\[207px\\].px-2.pr-1.flex.flex-col.justify-start.items-start.bg-bg-secondary.h-full {
    background: linear-gradient(180deg, #1a2332 0%, #0f1923 100%) !important;
}

.w-\\[207px\\].px-2.pr-1.flex.flex-col.justify-start.items-start.bg-bg-secondary.h-full [data-radix-scroll-area-viewport] {
    background: transparent !important;
}

.flex.justify-center.pb-3.gap-4 {
    background: linear-gradient(180deg, #141e2d 0%, #0d1721 100%) !important;
    padding-top: 12px !important;
    border-radius: 8px !important;
}

.w-\[723px\].flex.flex-wrap.justify-center.p-4:has(svg[data-testid="loader-search-profile"]) {
    background: linear-gradient(180deg, #141e2d 0%, #0d1721 100%) !important;
    min-height: 400px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

svg[data-testid="loader-search-profile"] {
    color: #4a9eff !important;
    filter: drop-shadow(0 0 8px rgba(74,158,255,0.5)) !important;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite !important;
}

[data-testid="starred-wrapper"] {
    background: linear-gradient(180deg, #1a2332 0%, #0f1923 100%) !important;
    border-left: 1px solid rgba(74,158,255,0.1) !important;
    box-shadow: -4px 0 24px rgba(0,0,0,0.3) !important;
}

.inline-flex.items-center.rounded.text-xs.leading-\\[18px\\].font-medium.cursor-pointer.text-text-primary.px-2\\.5.py-1.bg-bg-tertiary {
    background: linear-gradient(135deg, rgba(42,52,70,0.9) 0%, rgba(30,40,58,0.95) 100%) !important;
    border: 1px solid rgba(74,158,255,0.25) !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
}

        ::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
        }

        ::-webkit-scrollbar-track {
            background: rgba(15,25,35,0.5) !important;
            border-radius: 4px !important;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(74,158,255,0.5) !important;
            border-radius: 4px !important;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(74,158,255,0.7) !important;
        }
    `;

        document.head.appendChild(style);
        stylesApplied = true;

        let debounceTimer;
        const debounce = (func, delay) => {
            return function() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(func, delay);
            };
        };

        function applyFullScreen() {
            const wrapper = document.querySelector('.chat-v3-wrapper');
            const container = document.querySelector('.chat-container');
            const leftColumn = document.querySelector('.column.w-\\[320px\\].h-full');
            const mainFlex = document.querySelector('.w-full.h-full.flex');
            const chatColumn = document.querySelector('.flex.w-\\[642px\\].flex-col.h-full');
            const rightColumn = document.querySelector('.flex.flex-col.w-\\[320px\\].h-full:last-child');

            if (wrapper) wrapper.style.cssText = 'width: 100vw !important; max-width: 100vw !important;';
            if (container) container.style.cssText = 'width: 100vw !important; max-width: 100vw !important;';
            if (leftColumn) leftColumn.style.cssText = `width: ${columnWidth}px !important; min-width: ${columnWidth}px !important; flex: 0 0 ${columnWidth}px !important;`;
            if (mainFlex) mainFlex.style.cssText = `gap: ${gapSize}px !important; padding: 0 ${paddingSize}px !important;`;
            if (chatColumn) chatColumn.style.cssText = 'border: 1px solid rgba(74,158,255,0.2) !important; border-radius: 8px !important; overflow: hidden !important;';
            if (rightColumn) rightColumn.style.cssText = `width: ${columnWidth}px !important; min-width: ${columnWidth}px !important; flex: 0 0 ${columnWidth}px !important;`;
        }

        const debouncedApply = debounce(applyFullScreen, 100);

        const observer = new MutationObserver(debouncedApply);
        observer.observe(document.body, {
            childList: true,
            attributes: true,
            attributeFilter: ['class']
        });

        setTimeout(() => {
            observer.disconnect();
        }, 5000);

        applyFullScreen();
    }

    function applyFontSize(size) {
        currentFontSize = size;
        localStorage.setItem('jkee-font-size', size);

        const fontStyle = document.getElementById('frosjkee-font-styles');
        if (fontStyle) {
            fontStyle.textContent = `
                .bg-bg-user-chat.text-base,
                .bg-bg-card.text-base {
                    font-size: ${size}px !important;
                }
            `;
        }
        showNotification(`✓ Размер шрифта: ${size}px`, 'success');
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `helper-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }

    function setupCopyFeatures() {
        document.addEventListener('click', function(e) {
            const target = e.target;

            let idElement = null;
            if (target.classList?.contains('text-text-secondary') && target.textContent?.match(/^\d+$/)) {
                idElement = target;
            } else if (target.parentElement?.classList?.contains('text-text-secondary') && target.textContent?.match(/^\d+$/)) {
                idElement = target.parentElement;
            }

            if (idElement) {
                const userId = idElement.textContent.trim();
                navigator.clipboard.writeText(userId).then(() => {
                    showNotification(`✓ ID скопирован: ${userId}`, 'success');
                }).catch(() => {
                    showNotification('✗ Ошибка копирования', 'error');
                });
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            let nameElement = null;
            if (target.classList?.contains('truncate')) {
                const parent = target.closest('[data-testid="profile-ru-modal-trigger"], [data-testid="profile-tu-modal-trigger"], [data-testid="profile-tu-operator-modal-trigger"]');
                if (parent) {
                    nameElement = target;
                }
            }

            if (nameElement) {
                const userName = nameElement.textContent.trim();
                navigator.clipboard.writeText(userName).then(() => {
                    showNotification(`✓ Имя скопировано: ${userName}`, 'success');
                }).catch(() => {
                    showNotification('✗ Ошибка копирования', 'error');
                });
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }

    function addFontSizeButtons(menu) {
        if (menu.querySelector('.jkee-font-size-section')) {
            return;
        }

        console.log('✓ шрифт готов');

        const separator = document.createElement('div');
        separator.className = 'h-px bg-border-secondary my-1';

        const fontSizeSection = document.createElement('div');
        fontSizeSection.className = 'jkee-font-size-section';

        const fontSizeLabel = document.createElement('div');
        fontSizeLabel.className = 'px-2 py-1.5 text-xs text-text-secondary font-semibold';
        fontSizeLabel.textContent = 'Размер шрифта';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex gap-1 px-2 py-1.5';

        const sizes = [
            { size: '12', label: 'S' },
            { size: '13', label: 'M' },
            { size: '14', label: 'L' },
            { size: '16', label: 'XL' }
        ];

        sizes.forEach(({ size, label }) => {
            const btn = document.createElement('button');
            btn.className = 'jkee-font-size-btn flex-1 px-2 py-1.5 text-xs font-medium rounded transition-all';
            btn.textContent = label;
            btn.dataset.size = size;

            if (size === currentFontSize) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                applyFontSize(size);

                buttonContainer.querySelectorAll('.jkee-font-size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });

            buttonContainer.appendChild(btn);
        });

        fontSizeSection.appendChild(fontSizeLabel);
        fontSizeSection.appendChild(buttonContainer);

        menu.appendChild(separator);
        menu.appendChild(fontSizeSection);
    }

    function watchForMenu() {
        const observer = new MutationObserver((mutations) => {
            const menus = document.querySelectorAll('[role="menu"][data-state="open"]');

            menus.forEach(menu => {
                const hasFollowBtn = menu.querySelector('[data-testid="follow-btn"]');
                const hasWinkBtn = menu.querySelector('[data-testid="wink-btn"]');

                if ((hasFollowBtn || hasWinkBtn) && !menu.querySelector('.jkee-font-size-section')) {
                    setTimeout(() => {
                        addFontSizeButtons(menu);
                    }, 50);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-state', 'class']
        });

        console.log('✓ Наблюдатель за меню запущен');
    }

    // ===== ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЯ URL =====
    setInterval(checkPageType, 500);

    const notificationStyle = document.createElement('style');
    notificationStyle.id = 'frosjkee-notification-styles';
    notificationStyle.textContent = `
        .helper-notification {
            position: fixed !important;
            top: 70px !important;
            right: 20px !important;
            padding: 16px 20px !important;
            border-radius: 12px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            z-index: 10000 !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            animation: slideInGlow 0.4s ease !important;
            pointer-events: none !important;
        }

        .helper-notification.success {
            background: linear-gradient(135deg, rgba(16,185,129,0.9) 0%, rgba(5,150,105,0.95) 100%) !important;
            box-shadow: 0 8px 32px rgba(16,185,129,0.4) !important;
            color: #ffffff !important;
        }

        .helper-notification.error {
            background: linear-gradient(135deg, rgba(220,38,38,0.9) 0%, rgba(185,28,28,0.95) 100%) !important;
            box-shadow: 0 8px 32px rgba(220,38,38,0.4) !important;
            color: #ffffff !important;
        }

        .helper-notification.info {
            background: linear-gradient(135deg, rgba(74,158,255,0.9) 0%, rgba(59,130,246,0.95) 100%) !important;
            box-shadow: 0 8px 32px rgba(74,158,255,0.4) !important;
            color: #ffffff !important;
        }

        @keyframes slideInGlow {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(notificationStyle);

    const copyHighlightStyle = document.createElement('style');
    copyHighlightStyle.id = 'frosjkee-copy-highlight-styles';
    copyHighlightStyle.textContent = `
        .text-text-secondary {
            cursor: pointer !important;
            transition: color 0.2s ease !important;
            position: relative !important;
        }

        .text-text-secondary:hover {
            color: #4a9eff !important;
        }

        .text-text-secondary::after {
            opacity: 0;
            margin-left: 4px;
            font-size: 10px;
            transition: opacity 0.2s ease;
        }

        .text-text-secondary:hover::after {
            opacity: 1;
        }

        [data-testid="profile-ru-modal-trigger"] .truncate,
        [data-testid="profile-tu-modal-trigger"] .truncate,
        [data-testid="profile-tu-operator-modal-trigger"] .truncate {
            cursor: pointer !important;
            transition: color 0.2s ease !important;
            position: relative !important;
        }

        [data-testid="profile-ru-modal-trigger"] .truncate:hover,
        [data-testid="profile-tu-modal-trigger"] .truncate:hover,
        [data-testid="profile-tu-operator-modal-trigger"] .truncate:hover {
            color: #4a9eff !important;
        }

        [data-testid="profile-ru-modal-trigger"] .truncate::after,
        [data-testid="profile-tu-modal-trigger"] .truncate::after,
        [data-testid="profile-tu-operator-modal-trigger"] .truncate::after {
            opacity: 0;
            margin-left: 4px;
            font-size: 10px;
            transition: opacity 0.2s ease;
        }

        [data-testid="profile-ru-modal-trigger"] .truncate:hover::after,
        [data-testid="profile-tu-modal-trigger"] .truncate:hover::after,
        [data-testid="profile-tu-operator-modal-trigger"] .truncate:hover::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(copyHighlightStyle);

    const fontStyle = document.createElement('style');
    fontStyle.id = 'frosjkee-font-styles';
    fontStyle.textContent = `
        .bg-bg-user-chat.text-base,
        .bg-bg-card.text-base {
            font-size: ${currentFontSize}px !important;
        }
    `;
    document.head.appendChild(fontStyle);

    const fontButtonStyle = document.createElement('style');
    fontButtonStyle.id = 'frosjkee-font-button-styles';
    fontButtonStyle.textContent = `
        [role="menu"][data-radix-menu-content] {
            background: linear-gradient(135deg, rgba(42,52,70,0.95) 0%, rgba(30,40,58,0.98) 100%) !important;
            border: 1px solid rgba(74,158,255,0.3) !important;
            backdrop-filter: blur(10px) !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
        }

        [role="menu"] [role="menuitem"] {
            transition: all 0.2s ease !important;
        }

        [role="menu"] [role="menuitem"]:hover {
            background: rgba(74,158,255,0.15) !important;
            color: #ffffff !important;
        }

        .jkee-font-size-btn {
            background: rgba(42,52,70,0.7) !important;
            border: 1px solid rgba(74,158,255,0.2) !important;
            color: rgba(255,255,255,0.7) !important;
            cursor: pointer !important;
        }

        .jkee-font-size-btn:hover {
            background: rgba(52,72,100,0.8) !important;
            border-color: rgba(74,158,255,0.4) !important;
            color: rgba(255,255,255,0.9) !important;
            transform: translateY(-1px) !important;
        }

        .jkee-font-size-btn.active {
            background: linear-gradient(135deg, #4a9eff 0%, #3b82f6 100%) !important;
            border-color: rgba(74,158,255,0.6) !important;
            color: #ffffff !important;
            box-shadow: 0 0 12px rgba(74,158,255,0.4) !important;
        }
    `;
    document.head.appendChild(fontButtonStyle);

    setupCopyFeatures();
    watchForMenu();

    if (!isManagerPage) {
        applyOperatorStyles();
    }

    console.log(`✓ Frosjkee v11.3 - Font: ${currentFontSize}px`);
})();