// ==UserScript==
// @name         GGn PDF Screenshots Studio
// @namespace    https://gazellegames.net/
// @version      1.1.0
// @description  Takes one or more PDFs or images, shows a modal with thumbnails to select pages, returns full-page screenshots uploaded to the cloud, and automatically fills screenshot URLs into screenshots inputs.
// @author       VGTal
// @license      Unlicense
// @icon         https://gazellegames.net/favicon.ico
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php*
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/551365/GGn%20PDF%20Screenshots%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/551365/GGn%20PDF%20Screenshots%20Studio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PFX = 'pdfss-';
    const SETTINGS_KEY = 'GGnPDFSS_settings';
    const MAX_RESOLUTION = 3000;
    const NATIVE_DPI_SCALE = 96 / 72;

    const defaultSettings = {
        lazyLoad: true,
        autoClose: false,
        inlineProcessing: false,
        concurrentRenders: 16,
        spreadMode: 'odd',
        resolutionMultiplier: 1.0,
    };

    const settings = {
        ...defaultSettings,
        ...GM_getValue(SETTINGS_KEY, {})
    };
    settings.resolutionMultiplier = 1.0;

    // Function to save settings
    function saveSettings() {
        GM_setValue(SETTINGS_KEY, settings);
        logDebug('Settings saved:', settings);
    }

    // --- UTILITIES ---
    const logDebug = (...messages) => {
        const css = 'background: #222; color: #df5088; font-weight: 900;';
        console.debug('%c[PDF Page Screenshotter]', css, ...messages);
    };
    const logError = (...messages) => {
        const css = 'background: #900; color: #fff; font-weight: 900;';
        console.error('%c[PDF Page Screenshotter]', css, ...messages);
    };

    // --- COLOR GENERATION ---
    const fileColors = {};
    const colorPalette = [
        '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899', '#78716c'
    ];
    let colorIndex = 0;
    function getFileColor(fileName) {
        if (!fileColors[fileName]) {
            fileColors[fileName] = colorPalette[colorIndex % colorPalette.length];
            colorIndex++;
        }
        return fileColors[fileName];
    }


    // Set the worker source for PDF.js from CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    // --- 1. DEFINE STYLES & HTML ---

    // Inject CSS for the modals and UI elements
    GM_addStyle(`
        /* Inter font */
        @import url('https://rsms.me/inter/inter.css');

        /* Main Drop Zone */
        #${PFX}drop-zone {
            width: 100%;
            box-sizing: border-box;
            position: relative;
            border: 2px dashed #cbd5e1;
            border-radius: 0.75rem;
            padding: 1rem;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            text-align: center;
            font-family: 'Inter', sans-serif;
            color: #4b5563;
            transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
            cursor: pointer;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            order: -2;
        }
        #${PFX}drop-zone-content {
            position: relative;
            z-index: 2;
        }
        #${PFX}drop-zone.dragover {
            border-color: #3b82f6;
            background-color: #eff6ff;
        }
        #${PFX}drop-zone-input {
            display: none;
        }
        #${PFX}loader-wrapper, .${PFX}preview-loader {
            display: none;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-weight: 500;
        }
        #${PFX}drop-zone.loading #${PFX}loader-wrapper { display: flex; }
        #${PFX}drop-zone.loading #${PFX}drop-zone-content { display: none; }
        #${PFX}drop-zone.loading { cursor: not-allowed; }

        #${PFX}loader-wrapper svg, .${PFX}preview-loader svg, .${PFX}sort-item-placeholder svg {
            animation: ${PFX}spin 1s linear infinite;
        }
        @keyframes ${PFX}spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }


        /* Modal Styles */
        .${PFX}modal {
            position: fixed;
            inset: 0;
            background-color: rgba(15, 23, 42, 0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            z-index: 99999;
            font-family: 'Inter', sans-serif;
        }
        .${PFX}modal.dragover .${PFX}modal-content {
            box-shadow: 0 0 0 4px #3b82f6;
        }
        .${PFX}modal-content {
            background-color: white;
            border-radius: 0.75rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            width: 100%;
            max-width: 105rem;
            height: 90vh;
            display: flex;
            flex-direction: column;
            color: #111827;
            transition: box-shadow 0.2s;
        }
        .${PFX}modal-header {
            padding: 0.75rem 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }
        #${PFX}close-main-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0.75rem;
            font-size: 1.5rem;
            width: 2rem;
            height: 2rem;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            cursor: pointer;
            transition: background-color 0.2s, color 0.2s;
        }
        #${PFX}close-main-btn:hover {
            background-color: #f3f4f6;
            color: #1f2937;
        }
        .${PFX}modal-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
            text-align: center;
            flex-grow: 1;
        }
        .${PFX}modal-main {
            padding: 0;
            overflow: hidden;
            flex-grow: 1;
            display: flex;
            position: relative;
        }
        #${PFX}main-content-overlay {
            position: absolute;
            inset: 0;
            right: 480px;
            background-color: rgba(239, 68, 68, 0.5);
            z-index: 15;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            pointer-events: none;
        }
        #${PFX}main-content-overlay.drop-active {
            opacity: 1;
            visibility: visible;
        }
        .${PFX}modal-footer {
            padding: 1rem 1.5rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            background-color: #f9fafb;
            border-bottom-left-radius: 0.75rem;
            border-bottom-right-radius: 0.75rem;
            position: relative;
            z-index: 10;
        }
        #${PFX}results-modal .${PFX}modal-main {
             display: block;
             padding: 1.5rem;
             overflow-y: auto;
        }
        #${PFX}results-modal .${PFX}modal-header .${PFX}modal-title {
            padding-left: 5rem; /* Make space for button */
        }
        #${PFX}done-results-btn {
            white-space: nowrap;
        }
        .${PFX}btn {
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 600;
            border: 1px solid transparent;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            font-family: 'Inter', sans-serif;
            text-decoration: none !important;
            line-height: 1.25;
            -webkit-appearance: none;
            appearance: none;
            background-image: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
            text-transform: none !important;
            letter-spacing: normal !important;
            margin: 0 !important;
        }
        .${PFX}btn-primary {
            background-color: #2563eb;
            color: white;
            border-color: #2563eb;
        }
        .${PFX}btn-primary:hover { background-color: #1d4ed8; border-color: #1d4ed8; color: white !important; }
        .${PFX}btn-primary:disabled { background-color: #93c5fd; border-color: #93c5fd; color: white; cursor: not-allowed; }
        .${PFX}btn-secondary {
            background-color: #e5e7eb;
            color: #374151;
            border-color: #d1d5db;
        }
        .${PFX}btn-secondary:hover { background-color: #d1d5db; color: #374151 !important; }
        .${PFX}btn-sm { font-size: 0.875rem; padding: 0.375rem 0.75rem; }



        /* Left Sidebar & Main Content Styles */
        #${PFX}sidebar {
            width: 180px;
            flex-shrink: 0;
            background-color: #f9fafb;
            border-right: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
        }
        #${PFX}add-files-btn {
            width: calc(100% - 1.5rem);
            margin: 0.75rem !important;
            flex-shrink: 0;
        }
        #${PFX}sidebar-list {
            flex-grow: 1;
            overflow-y: auto;
            padding: 0.75rem;
        }
        #${PFX}main-content {
            flex-grow: 1;
            overflow-y: auto;
        }
        #${PFX}main-content::-webkit-scrollbar, #${PFX}sidebar-list::-webkit-scrollbar, #${PFX}sort-container-wrapper::-webkit-scrollbar {
            width: 12px;
        }
        #${PFX}main-content::-webkit-scrollbar-track, #${PFX}sidebar-list::-webkit-scrollbar-track, #${PFX}sort-container-wrapper::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
        }
        #${PFX}main-content::-webkit-scrollbar-thumb, #${PFX}sidebar-list::-webkit-scrollbar-thumb, #${PFX}sort-container-wrapper::-webkit-scrollbar-thumb {
            background: #cccccc;
            border-radius: 6px;
        }
        #${PFX}main-content::-webkit-scrollbar-thumb:hover, #${PFX}sidebar-list::-webkit-scrollbar-thumb:hover, #${PFX}sort-container-wrapper::-webkit-scrollbar-thumb:hover {
            background: #999999;
        }

        .${PFX}sidebar-item {
            padding: 0.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            margin-bottom: 0.5rem;
            transition: background-color 0.2s;
            border: 2px solid transparent;
            position: relative;
            border-left-width: 4px;
        }
        .${PFX}sidebar-item:hover {
            background-color: #f3f4f6;
        }
        .${PFX}sidebar-item.active {
            background-color: #e0e7ff;
            font-weight: 600;
            border-color: #4f46e5;
        }
        .${PFX}sidebar-item canvas, .${PFX}sidebar-item-canvas-placeholder, .${PFX}sidebar-item img, .${PFX}sidebar-item-text-label {
            width: 100%;
            border-radius: 0.25rem;
            margin-bottom: 0.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .${PFX}sidebar-item-canvas-placeholder {
            aspect-ratio: 7 / 9;
            background-color: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .${PFX}sidebar-item-text-label {
            aspect-ratio: 7 / 9;
            background-color: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 0.25rem;
            color: #4b5563;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem;
            text-align: center;
        }
        .${PFX}sidebar-item p {
            font-size: 0.8rem;
            word-break: break-word;
            text-align: center;
        }
        .${PFX}sidebar-count {
            position: absolute;
            top: 0.25rem;
            right: 0.25rem;
            background-color: #2563eb;
            color: white;
            font-size: 0.65rem;
            font-weight: 700;
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 0 2px white;
        }
        .${PFX}sidebar-item-remove-btn {
            position: absolute;
            top: -0.25rem;
            right: -0.25rem;
            width: 1.25rem;
            height: 1.25rem;
            background-color: #ef4444;
            color: white;
            border: 2px solid white;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: bold;
            line-height: 1;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        .${PFX}sidebar-item:hover .${PFX}sidebar-item-remove-btn {
            display: flex;
        }
        .${PFX}sidebar-spinner {
            display: none;
            position: absolute;
            top: 0.25rem;
            left: 0.25rem;
            width: 1.25rem;
            height: 1.25rem;
            color: #4f46e5;
        }
        .${PFX}sidebar-spinner svg { animation: ${PFX}spin 1s linear infinite; }
        .${PFX}sidebar-item.is-rendering .${PFX}sidebar-spinner { display: block; }
        .${PFX}sidebar-item.is-rendering > *:not(.${PFX}sidebar-spinner) { opacity: 0.5; }

        #${PFX}main-toolbar {
            all: initial !important;
            position: sticky !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 10 !important;
            background-color: #f9fafb !important;
            border: none !important;
            border-bottom: 1px solid #e5e7eb !important;
            padding: 0.875rem 1.5rem !important;
            display: flex !important;
            align-items: stretch !important;
            gap: 1rem !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        }
        #${PFX}main-toolbar * {
            box-sizing: border-box !important;
        }
        #${PFX}main-toolbar-label {
            all: initial !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            line-height: 1.25rem !important;
            color: #6b7280 !important;
            padding: 0.5rem 0 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            white-space: nowrap !important;
            background: none !important;
            border: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
            text-transform: none !important;
            letter-spacing: normal !important;
            text-decoration: none !important;
        }
        .${PFX}spread-toggle {
            all: initial !important;
            display: flex !important;
            flex: 1 !important;
            gap: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 1px solid #d1d5db !important;
            border-radius: 0.5rem !important;
            background: white !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
        }
        .${PFX}spread-toggle-btn {
            all: initial !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            flex: 1 !important;
            padding: 0.625rem 1.5rem !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            line-height: 1.25rem !important;
            background-color: white !important;
            color: #4b5563 !important;
            border: none !important;
            border-radius: 0 !important;
            cursor: pointer !important;
            transition: all 0.15s ease !important;
            outline: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
            text-transform: none !important;
            letter-spacing: normal !important;
            text-decoration: none !important;
            text-align: center !important;
            vertical-align: middle !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            min-height: 2.25rem !important;
        }
        .${PFX}spread-toggle-btn:first-child {
            border-right: 1px solid #e5e7eb !important;
        }
        .${PFX}spread-toggle-btn:hover {
            background-color: #f9fafb !important;
            color: #374151 !important;
        }
        .${PFX}spread-toggle-btn.active {
            background-color: #2563eb !important;
            background-image: none !important;
            border-color: transparent !important;
            color: white !important;
            position: relative !important;
            z-index: 1 !important;
            font-weight: 600 !important;
        }
        .${PFX}spread-toggle-btn.active:hover {
            background-color: #1d4ed8 !important;
            background-image: none !important;
            color: white !important;
        }
        .${PFX}spread-toggle-btn:focus {
            outline: 2px solid #3b82f6 !important;
            outline-offset: -2px !important;
        }
        .${PFX}spread-toggle-btn.active:focus {
            outline-color: #1d4ed8 !important;
        }

        .${PFX}thumbnail-grid-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            padding: 1.5rem;
            scrollbar-width: auto !important;
        }
        .${PFX}thumbnail-grid-container.spread-odd > *:first-child {
            grid-column: 2 / span 1;
        }
        #${PFX}sort-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0.75rem;
        }

        .${PFX}thumbnail-container, .${PFX}thumbnail-placeholder {
            position: relative;
            padding: 0.5rem;
            border: 2px solid transparent;
            border-radius: 0.5rem;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            border-top-width: 4px;
        }
        .${PFX}thumbnail-placeholder {
            aspect-ratio: 7 / 9;
            background-color: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .${PFX}thumbnail-container:hover, .${PFX}thumbnail-placeholder:hover, .${PFX}sort-item:hover {
            transform: scale(1.05);
        }
        .${PFX}thumbnail-container canvas, .${PFX}sort-item canvas, .${PFX}sort-item img, .${PFX}thumbnail-container img {
            width: 100%; height: auto; border-radius: 0.25rem;
        }
        .${PFX}thumbnail-container.thumbnail-selected, .${PFX}thumbnail-placeholder.thumbnail-selected {
            box-shadow: 0 0 0 2px #2563eb;
        }
        .${PFX}thumbnail-page-num {
            position: absolute;
            bottom: 0.25rem;
            right: 0.25rem;
            background-color: rgba(17, 24, 39, 0.8);
            color: white;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
        }

        /* Sort Sidebar Styles */
        #${PFX}sort-sidebar {
            width: 480px;
            height: 100%;
            flex-shrink: 0;
            background-color: #f3f4f6;
            border-left: 1px solid #e5e7eb;
            position: relative;
            z-index: 20;
            display: flex;
            flex-direction: column;
        }
        #${PFX}sort-sidebar-header {
            padding: 0.75rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        #${PFX}sort-sidebar-header-text h3 {
            font-size: 1rem;
            font-weight: 600;
            margin: 0 0 0.1rem;
            white-space: nowrap;
        }
        #${PFX}sort-sidebar-header-text p {
            font-size: 0.8rem;
            color: #6b7280;
            margin: 0;
        }
        #${PFX}sort-container-wrapper {
            padding: 0.75rem;
            flex-grow: 1;
            overflow-y: auto;
        }
        #${PFX}sort-sidebar-footer {
            padding: 0.75rem;
            border-top: 1px solid #e5e7eb;
            font-size: 0.8rem;
            text-align: center;
            color: #6b7280;
            flex-shrink: 0;
        }
        .${PFX}sort-item {
            cursor: pointer;
            position: relative;
            border-radius: 0.5rem;
            padding: 0.25rem;
            border-top-width: 4px;
            border-top-style: solid;
        }
        .${PFX}sort-item > *:not(.${PFX}sort-item-remove-btn) { pointer-events: none; }
        .${PFX}sort-item-remove-btn { pointer-events: auto; }
        .${PFX}sort-item.${PFX}dragging { opacity: 0.5; }
        .${PFX}sort-item-placeholder {
            background-color: #e5e7eb;
            border-radius: 0.25rem;
            width: 100%;
            aspect-ratio: 7 / 9;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .${PFX}sort-item-remove-btn {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(25%, -25%);
            width: 1.5rem;
            height: 1.5rem;
            background-color: #ef4444;
            color: white;
            border: 2px solid white;
            border-radius: 9999px;
            font-size: 1rem;
            font-weight: bold;
            line-height: 1.25rem;
            text-align: center;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s, transform 0.2s;
            z-index: 10;
            opacity: 0;
        }
        .${PFX}sort-item:hover .${PFX}sort-item-remove-btn {
            opacity: 1;
        }
        .${PFX}sort-item-remove-btn:hover {
            background-color: #dc2626;
            transform: translate(25%, -25%) scale(1.1);
        }

        /* Preview Modal */
        .${PFX}preview-modal-backdrop {
            position: fixed;
            inset: 0;
            background-color: rgba(15, 23, 42, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            cursor: default;
        }
        .${PFX}preview-modal-content {
            position: relative;
            max-width: 95vw;
            max-height: 95vh;
            width: 100%;
            height: 100%;
            box-shadow: none;
            cursor: default;
            overflow: hidden;
        }
        .${PFX}preview-track {
            display: flex;
            height: 100%;
            width: 300%;
            transform: translateX(-33.3333%);
        }
        .${PFX}preview-slide {
            width: 33.3333%;
            height: 100%;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }
        .${PFX}preview-slide img {
            display: block;
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            user-select: none;
        }
        .${PFX}preview-loader {
            position: absolute;
            inset: 0;
            background: rgba(255,255,255,0.8);
            color: #111827;
        }
        .${PFX}preview-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(0,0,0,0.5);
            color: white;
            border-radius: 9999px;
            width: 3.5rem;
            height: 3.5rem;
            font-size: 2.5rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.2s;
            z-index: 100001;
            line-height: 1;
            box-sizing: border-box;
        }
        .${PFX}preview-nav-btn:hover { background-color: rgba(0,0,0,0.8); }
        .${PFX}preview-prev-btn { left: 1rem; padding-right: 4px; }
        .${PFX}preview-next-btn { right: 1rem; padding-left: 4px; }
        .${PFX}preview-close-btn {
            position: absolute;
            top: 0.5rem;
            right: 1rem;
            width: 3.5rem;
            height: 3.5rem;
            font-size: 2.5rem;
            color: white;
            cursor: pointer;
            z-index: 100002;
            transition: transform 0.2s, color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            text-shadow: 0 0 4px black;
        }
        .${PFX}preview-close-btn:hover {
            transform: scale(1.15);
            color: #ef4444;
        }


        /* Upload Status & Progress */
        #${PFX}progress-container {
             width: 100%; max-width: 48rem; margin: 0 auto 1.5rem;
        }
        #${PFX}progress-bar {
             width: 100%; background-color: #e5e7eb; border-radius: 9999px; height: 0.75rem; overflow: hidden;
        }
        #${PFX}progress-bar-inner {
            height: 100%; width: 0%; background-color: #3b82f6; border-radius: 9999px; transition: width 0.3s ease-in-out;
        }
        #${PFX}links-container {
            display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 48rem; margin: auto;
        }
        .${PFX}upload-status-item {
            display: flex; align-items: center; gap: 0.75rem; font-family: monospace; font-size: 0.875rem;
            background-color: #f3f4f6; padding: 0.5rem 0.75rem; border-radius: 0.5rem; transition: background-color 0.3s, opacity 0.3s;
        }
        .${PFX}upload-status-item-icon {
            flex-shrink: 0;
        }
        .${PFX}upload-status-item-text {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .${PFX}upload-status-item a {
            text-decoration: none; color: #2563eb; font-weight: 600;
        }
        .${PFX}upload-status-item.${PFX}upload-success {
            background-color: #dbeafe;
        }
        .${PFX}upload-status-item.${PFX}upload-fail {
            background-color: #fee2e2;
            color: #991b1b;
        }
        /* Inline processing spinner */
        .${PFX}inline-spinner {
            display: inline-flex;
            width: 1rem; /* Use rem to be independent of parent's font-size */
            height: 1rem; /* Use rem to be independent of parent's font-size */
            margin-right: 4px;
            vertical-align: middle;
            color: #3b82f6;
        }

        .${PFX}inline-spinner svg.${PFX}spinner-svg {
            width: 100%;
            height: 100%;
            animation: ${PFX}spin 1s linear infinite;
        }

        /* Settings Panel */
        #${PFX}settings-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0.75rem;
            width: 2rem;
            height: 2rem;
            border-radius: 9999px;
            color: #9ca3af;
            cursor: pointer;
            transition: background-color 0.2s, color 0.2s, transform 0.3s;
            display: flex; align-items: center; justify-content: center;
        }
        #${PFX}settings-btn:hover { background-color: #f3f4f6; color: #1f2937; }
        #${PFX}settings-btn.open { transform: translateY(-50%) rotate(90deg); }
        #${PFX}settings-panel {
            position: absolute;
            top: calc(100% + 0.5rem);
            left: 0.75rem;
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            z-index: 100;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            font-size: 0.875rem;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
        }
        #${PFX}settings-panel.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        #${PFX}settings-panel label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .${PFX}settings-slider-group { display: flex; flex-direction: column; gap: 0.25rem; }
        .${PFX}settings-slider-label { font-size: 0.75rem; color: #6b7280; font-weight: 500; }
        .${PFX}settings-slider-controls { display: flex; align-items: center; gap: 0.5rem; }
        .${PFX}settings-slider { flex: 1; }
        .${PFX}settings-number-input { width: 3.5rem; padding: 0.25rem 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem; font-size: 0.875rem; }
        .${PFX}resolution-warning { color: #f59e0b; font-weight: 600; }

        .${PFX}resolution-multiplier-group { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem; }
        .${PFX}resolution-multiplier-controls { display: flex; align-items: center; gap: 0.5rem; }
        .${PFX}resolution-multiplier-label { font-size: 0.75rem; color: #6b7280; font-weight: 500; }
        .${PFX}resolution-multiplier-slider { flex: 1; }
        .${PFX}resolution-multiplier-input { width: 3.5rem; padding: 0.25rem 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem; font-size: 0.875rem; text-align: center; }

        /* Queue Status Footer */
        #${PFX}queue-status-wrapper {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-right: auto;
            font-size: 0.875rem;
            font-weight: 500;
            color: #4b5563;
        }


        /* Dark Mode Styles */
        @media (prefers-color-scheme: dark) {
            #${PFX}drop-zone {
                border-color: #4b5563;
                color: #d1d5db;
            }
            #${PFX}drop-zone.dragover {
                border-color: #60a5fa;
                background-color: #1e293b;
            }
            .${PFX}modal-content {
                background-color: #1f2937;
                color: #f3f4f6;
            }
            #${PFX}close-main-btn, #${PFX}settings-btn { color: #6b7280; }
            #${PFX}close-main-btn:hover, #${PFX}settings-btn:hover { background-color: #374151; color: #f9fafb; }
            .${PFX}modal-header, .${PFX}modal-footer {
                border-color: #374151;
            }
            .${PFX}modal-footer {
                background-color: #111827;
            }
            .${PFX}btn-secondary {
                background-color: #374151;
                color: #f3f4f6;
                border-color: #4b5563;
            }
            .${PFX}btn-secondary:hover {
                background-color: #4b5563;
            }
            #${PFX}selection-count, #${PFX}queue-status-wrapper {
                color: #9ca3af;
            }
            .${PFX}sidebar-item-canvas-placeholder, .${PFX}thumbnail-placeholder {
                background-color: #374151;
            }
             .${PFX}sidebar-item-text-label {
                background-color: #374151;
                color: #d1d5db;
            }
            #${PFX}sidebar {
                background-color: #111827;
                border-right-color: #374151;
            }
            .${PFX}sidebar-item:hover {
                background-color: #374151;
            }
            .${PFX}sidebar-item.active {
                background-color: #312e81;
                border-color: #6366f1;
            }
            .${PFX}sidebar-count {
                box-shadow: 0 0 0 2px #111827;
            }
            .${PFX}sidebar-item-remove-btn {
                border-color: #111827;
            }
            #${PFX}main-content::-webkit-scrollbar-track, #${PFX}sidebar-list::-webkit-scrollbar-track, #${PFX}sort-container-wrapper::-webkit-scrollbar-track {
                background: #2d3748;
            }
            #${PFX}main-content::-webkit-scrollbar-thumb, #${PFX}sidebar-list::-webkit-scrollbar-thumb, #${PFX}sort-container-wrapper::-webkit-scrollbar-thumb {
                background: #4a5568;
            }
            #${PFX}main-content::-webkit-scrollbar-thumb:hover, #${PFX}sidebar-list::-webkit-scrollbar-thumb:hover, #${PFX}sort-container-wrapper::-webkit-scrollbar-thumb:hover {
                background: #718096;
            }
            .${PFX}sort-item-placeholder {
                background-color: #374151;
                border: none;
            }
             #${PFX}progress-bar { background-color: #374151; }
            .${PFX}upload-status-item {
                background-color: #374151;
            }
            .${PFX}upload-status-item.${PFX}upload-success {
                background-color: #1e3a8a;
            }
            .${PFX}upload-status-item.${PFX}upload-success > a {
                color: #bfdbfe;
            }
            .${PFX}upload-status-item.${PFX}upload-fail {
                background-color: #450a0a;
                color: #fecaca;
            }
            .${PFX}sort-item-remove-btn {
                border-color: #1f2937;
            }
            #${PFX}sort-sidebar {
                background-color: #111827;
                border-left-color: #374151;
            }
            #${PFX}sort-sidebar-header, #${PFX}sort-sidebar-footer {
                border-color: #374151;
            }
            #${PFX}sort-sidebar-footer {
                color: #9ca3af;
            }
            .${PFX}preview-modal-content { background-color: transparent; }
            .${PFX}preview-loader { background: rgba(31, 41, 55, 0.8); color: #f3f4f6; }
            #${PFX}sort-sidebar-header-text p { color: #9ca3af; }
            #${PFX}settings-panel {
                background-color: #1f2937;
                border-color: #374151;
            }
            .${PFX}settings-slider-label { color: #9ca3af; }
            .${PFX}settings-number-input {
                background-color: #374151;
                border-color: #4b5563;
                color: #f3f4f6;
            }
            .${PFX}resolution-multiplier-label { color: #9ca3af; }
            .${PFX}resolution-multiplier-input {
                background-color: #374151;
                border-color: #4b5563;
                color: #f3f4f6;
            }
            #${PFX}main-toolbar {
                background-color: #111827 !important;
                border-bottom-color: #374151 !important;
            }
            #${PFX}main-toolbar-label {
                color: #9ca3af !important;
            }
            .${PFX}spread-toggle {
                border-color: #4b5563 !important;
                background: #1f2937 !important;
            }
            .${PFX}spread-toggle-btn {
                background-color: #1f2937 !important;
                background-image: none !important;
                color: #d1d5db !important;
            }
            .${PFX}spread-toggle-btn:first-child {
                border-right-color: #4b5563 !important;
            }
            .${PFX}spread-toggle-btn:hover {
                background-color: #374151 !important;
                background-image: none !important;
                color: #e5e7eb !important;
            }
            .${PFX}spread-toggle-btn.active {
                background-color: #2563eb !important;
                background-image: none !important;
                border-color: transparent !important;
                color: white !important;
            }
            .${PFX}spread-toggle-btn.active:hover {
                background-color: #1d4ed8 !important;
                background-image: none !important;
                color: white !important;
            }
            .${PFX}spread-toggle-btn:focus {
                outline-color: #3b82f6 !important;
            }
            .${PFX}spread-toggle-btn.active:focus {
                outline-color: #60a5fa !important;
            }
        }
    `);

    const fileInputHTML = `
        <div id="${PFX}drop-zone">
             <div id="${PFX}drop-zone-content">
                 <p><strong>Drop PDFs or Images here</strong> or click to select.</p>
                 <p style="margin: 1.5rem 0 1rem 0; font-size: 0.8rem; color: #6b7280;">— or —</p>
                 <button type="button" id="${PFX}open-empty-btn" class="${PFX}btn ${PFX}btn-secondary">Open Editor</button>
            </div>
            <div id="${PFX}loader-wrapper">
                <svg class="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span id="${PFX}loader-text">Loading...</span>
            </div>
            <input id="${PFX}drop-zone-input" type="file" accept="application/pdf,image/jpeg,image/png,image/gif,image/webp" multiple />
        </div>
    `;

    const modalHTML = `
        <div id="${PFX}page-select-modal" class="${PFX}modal" style="display: none;">
            <div class="${PFX}modal-content">
                <header class="${PFX}modal-header">
                    <div id="${PFX}settings-container" style="position: relative;">
                         <div id="${PFX}settings-btn" title="Settings">
                            <svg xmlns="http://www.w3.org/2000/svg" style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>
                        </div>
                        <div id="${PFX}settings-panel">
                            <label><input type="checkbox" data-setting="lazyLoad" ${settings.lazyLoad ? 'checked' : ''}> Lazy Load Thumbnails</label>
                            <label><input type="checkbox" data-setting="autoClose" ${settings.autoClose ? 'checked' : ''}> Auto-close after processing</label>
                            <label><input type="checkbox" data-setting="inlineProcessing" ${settings.inlineProcessing ? 'checked' : ''}> Inline processing status</label>
                            <div class="${PFX}settings-slider-group">
                                <div class="${PFX}settings-slider-label">Concurrent Renders</div>
                                <div class="${PFX}settings-slider-controls">
                                    <input type="range" id="${PFX}concurrency-slider" class="${PFX}settings-slider" min="1" max="32" value="${settings.concurrentRenders}" />
                                    <input type="number" id="${PFX}concurrency-input" class="${PFX}settings-number-input" min="1" max="32" value="${settings.concurrentRenders}" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 class="${PFX}modal-title">Select Pages to Capture</h2>
                    <div id="${PFX}close-main-btn" title="Close (Esc)">&times;</div>
                </header>
                <main class="${PFX}modal-main">
                    <div id="${PFX}sidebar"></div>
                    <div id="${PFX}main-content"></div>
                    <div id="${PFX}main-content-overlay"></div>
                    <aside id="${PFX}sort-sidebar">
                        <div id="${PFX}sort-sidebar-header">
                            <div id="${PFX}sort-sidebar-header-text">
                                <h3>Selected Pages</h3>
                                <p>Drag to reorder</p>
                            </div>
                            <button id="${PFX}clear-selection-btn" class="${PFX}btn ${PFX}btn-secondary ${PFX}btn-sm">Clear</button>
                        </div>
                         <div id="${PFX}sort-container-wrapper">
                          <div id="${PFX}sort-container"></div>
                        </div>
                         <div id="${PFX}sort-sidebar-footer">
                           <p id="${PFX}resolution-info" style="font-weight: 600; margin: 0;"></p>
                           <div class="${PFX}resolution-multiplier-group">
                               <div class="${PFX}resolution-multiplier-label">Resolution Multiplier</div>
                               <div class="${PFX}resolution-multiplier-controls">
                                   <input type="range" id="${PFX}resolution-multiplier-slider" class="${PFX}resolution-multiplier-slider" min="0.25" max="4" step="0.05" value="1" />
                                   <input type="number" id="${PFX}resolution-multiplier-input" class="${PFX}resolution-multiplier-input" min="0.25" max="4" step="0.05" value="1" />
                               </div>
                           </div>
                        </div>
                    </aside>
                </main>
                <footer class="${PFX}modal-footer">
                    <div id="${PFX}queue-status-wrapper">
                        <button id="${PFX}load-all-remaining-btn" class="${PFX}btn ${PFX}btn-secondary ${PFX}btn-sm" style="display:none;">Load All Remaining</button>
                        <span id="${PFX}queue-stats"></span>
                    </div>
                    <button id="${PFX}generate-btn" class="${PFX}btn ${PFX}btn-primary" disabled>Generate 0 Screenshots</button>
                </footer>
            </div>
            <input type="file" id="${PFX}add-files-input" multiple accept="application/pdf,image/jpeg,image/png,image/gif,image/webp" style="display: none;" />
        </div>
        <div id="${PFX}results-modal" class="${PFX}modal" style="display: none;">
            <div class="${PFX}modal-content" style="max-width: 56rem; height: auto; max-height: 90vh;">
                <header class="${PFX}modal-header">
                    <h2 class="${PFX}modal-title">Processing Screenshots...</h2>
                    <button id="${PFX}done-results-btn" class="${PFX}btn ${PFX}btn-primary" style="display: none;">All Done</button>
                </header>
                <main id="${PFX}screenshots-output-main" class="${PFX}modal-main"></main>
            </div>
        </div>
        <div id="${PFX}preview-modal" class="${PFX}preview-modal-backdrop" style="display: none;">
             <div class="${PFX}preview-close-btn" title="Close (Esc)">&times;</div>
             <div class="${PFX}preview-nav-btn ${PFX}preview-prev-btn" title="Previous image (Left Arrow)">&#x276E;</div>
             <div class="${PFX}preview-modal-content">
                <div class="${PFX}preview-track">
                    <div class="${PFX}preview-slide"><img id="${PFX}preview-image-prev" /></div>
                    <div class="${PFX}preview-slide"><img id="${PFX}preview-image-curr" /></div>
                    <div class="${PFX}preview-slide"><img id="${PFX}preview-image-next" /></div>
                </div>
                <div class="${PFX}preview-loader">
                    <svg style="width: 2.5rem; height: 2.5rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
            </div>
            <div class="${PFX}preview-nav-btn ${PFX}preview-next-btn" title="Next image (Right Arrow)">&#x276F;</div>
        </div>
    `;

// --- 2. INJECT UI & INITIALIZE ---

    const imageBlock = document.getElementById('image_block');
    if (!imageBlock) {
        logError('Target element #image_block not found.');
        return;
    }

    // Per user request, always inject the drop zone as the first child of #image_block.
    imageBlock.insertAdjacentHTML('afterbegin', fileInputHTML);
    logDebug('Injected drop zone as the first child of #image_block.');


    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // --- 3. GET DOM ELEMENTS ---

    const dropZone = document.getElementById(`${PFX}drop-zone`);
    const dropZoneInput = document.getElementById(`${PFX}drop-zone-input`);
    const selectModal = document.getElementById(`${PFX}page-select-modal`);
    const resultsModal = document.getElementById(`${PFX}results-modal`);
    const sidebar = document.getElementById(`${PFX}sidebar`);
    const mainContent = document.getElementById(`${PFX}main-content`);
    const sortContainer = document.getElementById(`${PFX}sort-container`);
    const screenshotsOutputMain = document.getElementById(`${PFX}screenshots-output-main`);
    const generateBtn = document.getElementById(`${PFX}generate-btn`);
    const doneResultsBtn = document.getElementById(`${PFX}done-results-btn`);
    const closeMainBtn = document.getElementById(`${PFX}close-main-btn`);
    const addFilesInput = document.getElementById(`${PFX}add-files-input`);
    const clearSelectionBtn = document.getElementById(`${PFX}clear-selection-btn`);
    const loadAllRemainingBtn = document.getElementById(`${PFX}load-all-remaining-btn`);
    const previewModal = document.getElementById(`${PFX}preview-modal`);
    const mainContentOverlay = document.getElementById(`${PFX}main-content-overlay`);
    const previewLoader = previewModal.querySelector(`.${PFX}preview-loader`);
    const previewPrevBtn = previewModal.querySelector(`.${PFX}preview-prev-btn`);
    const previewNextBtn = previewModal.querySelector(`.${PFX}preview-next-btn`);
    const previewCloseBtn = previewModal.querySelector(`.${PFX}preview-close-btn`);
    const previewTrack = previewModal.querySelector(`.${PFX}preview-track`);
    const previewImageCurr = document.getElementById(`${PFX}preview-image-curr`);
    const previewImagePrev = document.getElementById(`${PFX}preview-image-prev`);
    const previewImageNext = document.getElementById(`${PFX}preview-image-next`);
    const settingsBtn = document.getElementById(`${PFX}settings-btn`);
    const settingsPanel = document.getElementById(`${PFX}settings-panel`);
    const queueStatsEl = document.getElementById(`${PFX}queue-stats`);
    const loaderText = document.getElementById(`${PFX}loader-text`);
    const concurrencySlider = document.getElementById(`${PFX}concurrency-slider`);
    const concurrencyInput = document.getElementById(`${PFX}concurrency-input`);
    const resolutionMultiplierSlider = document.getElementById(`${PFX}resolution-multiplier-slider`);
    const resolutionMultiplierInput = document.getElementById(`${PFX}resolution-multiplier-input`);


    let loadedPdfDocs = [];
    let thumbnailObserver = null;
    let selectedPagesState = new Set();
    let currentVisibleDocIndex = 0;
    let draggedItem = null;
    let isSorting = false;
    let currentPreviewIndex = -1;
    let currentPreviewSortedList = [];
    let isDraggingPreview = false;
    let previewDragStartX = 0;
    let isNavigatingPreview = false;
    const thumbnailCache = new Map();
    let thumbnailQueue = [];
    const currentlyProcessing = new Set();
    let scrollThrottleTimer = null;


    // --- 4. EVENT LISTENERS ---
    document.getElementById(`${PFX}open-empty-btn`).addEventListener('click', async (e) => {
        e.stopPropagation();
        if (loadedPdfDocs.length === 0) {
            checkForExistingLinks();
        }
        await openModal();
    });

    dropZone.addEventListener('click', (e) => {
        if (e.currentTarget.classList.contains('loading')) return;

        if (loadedPdfDocs.length > 0) {
            openModal();
        } else {
            dropZoneInput.click();
        }
    });

    dropZoneInput.addEventListener('change', (e) => handleFiles(e.target.files));
    addFilesInput.addEventListener('change', (e) => handleFiles(e.target.files));

    selectModal.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSorting) return;
        selectModal.classList.add('dragover');
    });
    selectModal.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); if (!selectModal.contains(e.relatedTarget)) { selectModal.classList.remove('dragover'); }});
    selectModal.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSorting) return;
        selectModal.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', (e) => e.currentTarget.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.currentTarget.classList.contains('loading')) return; // Add this line
        e.currentTarget.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    doneResultsBtn.addEventListener('click', () => { resultsModal.style.display = 'none'; resetState(); });
    closeMainBtn.addEventListener('click', closeModal);

    generateBtn.addEventListener('click', handleScreenshotGeneration);

    // --- Settings Panel ---
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsBtn.classList.toggle('open');
        settingsPanel.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
        if (!settingsBtn.contains(e.target) && !settingsPanel.contains(e.target)) {
            settingsBtn.classList.remove('open');
            settingsPanel.classList.remove('open');
        }
    });
    settingsPanel.addEventListener('change', (e) => {
        const setting = e.target.dataset.setting;
        if (setting && typeof settings[setting] !== 'undefined') {
            settings[setting] = e.target.checked;
            saveSettings();
            if (setting === 'lazyLoad') {
                if (!settings.lazyLoad) {
                    enqueueAllPlaceholders();
                } else {
                    prioritizeVisibleThumbnails();
                }
            }
        }
    });

    const syncConcurrency = (value) => {
        const numValue = Math.max(1, Math.min(32, parseInt(value, 10) || 1));
        concurrencySlider.value = numValue;
        concurrencyInput.value = numValue;
        settings.concurrentRenders = numValue;
        saveSettings();
        updateQueueStats();
        processThumbnailQueue();
    };

    concurrencySlider.addEventListener('input', (e) => syncConcurrency(e.target.value));
    concurrencyInput.addEventListener('change', (e) => syncConcurrency(e.target.value));

    const syncResolutionMultiplier = (value) => {
        const numValue = Math.max(0.25, Math.min(4, parseFloat(value) || 1.0));
        const roundedValue = Math.round(numValue * 100) / 100;
        resolutionMultiplierSlider.value = roundedValue;
        resolutionMultiplierInput.value = roundedValue;
        settings.resolutionMultiplier = roundedValue;
        updateResolutionDisplay();
    };

    resolutionMultiplierSlider.addEventListener('input', (e) => syncResolutionMultiplier(e.target.value));
    resolutionMultiplierInput.addEventListener('change', (e) => syncResolutionMultiplier(e.target.value));

    mainContent.addEventListener('click', (e) => {
        const spreadBtn = e.target.closest(`.${PFX}spread-toggle-btn`);
        if (spreadBtn) {
            const mode = spreadBtn.dataset.spread;
            settings.spreadMode = mode;
            saveSettings();

            document.querySelectorAll(`.${PFX}spread-toggle-btn`).forEach(btn => {
                btn.classList.toggle('active', btn.dataset.spread === mode);
            });

            document.querySelectorAll(`.${PFX}thumbnail-grid-container`).forEach(grid => {
                grid.classList.remove('spread-odd', 'spread-even');
                grid.classList.add(mode === 'odd' ? 'spread-odd' : 'spread-even');
            });
        }
    });

    // --- Preview Modal Navigation ---
    function animateAndShuffle(direction) {
        if (isNavigatingPreview || currentPreviewSortedList.length <= 1) return;
        isNavigatingPreview = true;

        const targetTransform = direction > 0 ? 'translateX(-66.6666%)' : 'translateX(0%)';

        previewTrack.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        previewTrack.style.transform = targetTransform;

        previewTrack.addEventListener('transitionend', () => {
            currentPreviewIndex = (currentPreviewIndex + direction + currentPreviewSortedList.length) % currentPreviewSortedList.length;

            const newNextIndex = (currentPreviewIndex + 1) % currentPreviewSortedList.length;
            const newPrevIndex = (currentPreviewIndex - 1 + currentPreviewSortedList.length) % currentPreviewSortedList.length;

            if (direction > 0) { // Navigated Next
                previewImagePrev.src = previewImageCurr.src;
                previewImageCurr.src = previewImageNext.src;
                loadSlide(previewImageNext, newNextIndex);
            } else { // Navigated Previous
                previewImageNext.src = previewImageCurr.src;
                previewImageCurr.src = previewImagePrev.src;
                loadSlide(previewImagePrev, newPrevIndex);
            }

            previewTrack.style.transition = 'none';
            previewTrack.style.transform = 'translateX(-33.3333%)';

            requestAnimationFrame(() => { isNavigatingPreview = false; });
        }, { once: true });
    }

    function navigatePreview(direction) {
        animateAndShuffle(direction);
    }

    previewModal.addEventListener('pointerdown', (e) => {
        if (e.target.closest(`.${PFX}preview-nav-btn`) || e.target.closest(`.${PFX}preview-close-btn`)) return;
        isDraggingPreview = true;
        previewDragStartX = e.clientX;
        e.preventDefault();
    });

    previewModal.addEventListener('pointermove', (e) => {
        if (isDraggingPreview && !isNavigatingPreview) {
            const dragOffset = e.clientX - previewDragStartX;
            previewTrack.style.transition = 'none';
            previewTrack.style.transform = `translateX(calc(-33.3333% + ${dragOffset}px))`;
        }
    });

    previewModal.addEventListener('pointerup', (e) => {
        if (!isDraggingPreview) return;
        const dragDistance = e.clientX - previewDragStartX;
        isDraggingPreview = false;
        if (isNavigatingPreview) return;

        const dragThreshold = 50;

        if (Math.abs(dragDistance) > dragThreshold) {
            const direction = dragDistance < 0 ? 1 : -1;
            animateAndShuffle(direction);
        } else {
            previewTrack.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
            previewTrack.style.transform = 'translateX(-33.3333%)';

            if (e.target === previewModal) {
                 previewModal.style.display = 'none';
            }
        }
    });

    previewPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigatePreview(-1); });
    previewNextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigatePreview(1); });
    previewCloseBtn.addEventListener('click', () => { previewModal.style.display = 'none'; });
    document.addEventListener('keydown', (e) => {
        if (selectModal.style.display === 'flex' && e.key === 'Escape') {
            closeModal();
        } else if (previewModal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') navigatePreview(-1);
            if (e.key === 'ArrowRight') navigatePreview(1);
            if (e.key === 'Escape') previewModal.style.display = 'none';
        }
    });


    clearSelectionBtn.addEventListener('click', () => {
        selectedPagesState.clear();
        document.querySelectorAll(`.${PFX}thumbnail-container.thumbnail-selected, .${PFX}thumbnail-placeholder.thumbnail-selected`).forEach(t => {
            t.classList.remove('thumbnail-selected');
        });
        updateSelectionState();
    });

    function enqueueAllPlaceholders() {
        const allPlaceholders = Array.from(document.querySelectorAll(`.${PFX}thumbnail-placeholder`));
        
        allPlaceholders.sort((a, b) => {
            if (a.offsetTop !== b.offsetTop) {
                return a.offsetTop - b.offsetTop;
            }
            return a.offsetLeft - b.offsetLeft;
        });

        allPlaceholders.forEach(p => {
             const { docIndex, pageNum } = p.dataset;
             const uniqueId = `${docIndex}-${pageNum}`;
             addToThumbnailQueue(uniqueId);
        });
    }
    loadAllRemainingBtn.addEventListener('click', enqueueAllPlaceholders);

    mainContent.addEventListener('scroll', () => {
        if (scrollThrottleTimer) return;
        scrollThrottleTimer = setTimeout(() => {
            prioritizeVisibleThumbnails();
            scrollThrottleTimer = null;
        }, 150);
    });


    // --- SORTING DRAG & DROP ---
    sortContainer.addEventListener('dragstart', e => {
        draggedItem = e.target.closest(`.${PFX}sort-item`);
        if (draggedItem) {
            isSorting = true;
            setTimeout(() => {
                if (draggedItem) {
                    draggedItem.classList.add(`${PFX}dragging`);
                }
            }, 0);
        }
    });

    sortContainer.addEventListener('dragend', e => {
        if (draggedItem) {
            draggedItem.classList.remove(`${PFX}dragging`);
            draggedItem = null;
            updateStateFromSortOrder();
        }
        isSorting = false;
        mainContentOverlay.classList.remove('drop-active');
    });


    sortContainer.addEventListener('dragover', e => {
        e.preventDefault();
        const overElement = e.target.closest(`.${PFX}sort-item`);
        if (draggedItem && overElement && overElement !== draggedItem) {
            const overElementIndex = Array.from(sortContainer.children).indexOf(overElement);
            const draggedItemIndex = Array.from(sortContainer.children).indexOf(draggedItem);

            if (overElementIndex > draggedItemIndex) {
                overElement.parentNode.insertBefore(draggedItem, overElement.nextSibling);
            } else {
                overElement.parentNode.insertBefore(draggedItem, overElement);
            }
        }
    });

    // Remove item by dropping it on the main content area
    mainContent.addEventListener('dragover', e => {
        if (draggedItem && isSorting) {
            e.preventDefault();
            mainContentOverlay.classList.add('drop-active');
        }
    });
    mainContent.addEventListener('dragleave', e => {
        if (!mainContent.contains(e.relatedTarget)) {
            mainContentOverlay.classList.remove('drop-active');
        }
    });
    mainContent.addEventListener('drop', e => {
        if (draggedItem && isSorting) {
            e.preventDefault();
            e.stopPropagation();
            const { docIndex, pageNum } = draggedItem.dataset;
            const uniqueId = `${docIndex}-${pageNum}`;
            selectedPagesState.delete(uniqueId);
            const originalThumb = mainContent.querySelector(`[data-doc-index="${docIndex}"][data-page-num="${pageNum}"]`);
            if (originalThumb) {
                originalThumb.classList.remove('thumbnail-selected');
            }
            draggedItem.remove();
            draggedItem = null;
            isSorting = false;
            mainContentOverlay.classList.remove('drop-active');
            updateSelectionState();
        }
    });


    // --- 5. CORE FUNCTIONS ---

    // --- Thumbnail Queue System ---
    function updateQueueStats() {
        if (!queueStatsEl) return;
        const totalPlaceholders = mainContent.querySelectorAll(`.${PFX}thumbnail-placeholder`).length;
        const queueSize = thumbnailQueue.length;
        const processingSize = currentlyProcessing.size;
        const toLoad = totalPlaceholders - queueSize - processingSize;

        queueStatsEl.textContent = `To Load: ${toLoad} | Queue: ${queueSize} | Rendering: ${processingSize}`;

        if (toLoad > 0) {
            loadAllRemainingBtn.style.display = 'inline-flex';
        } else {
            loadAllRemainingBtn.style.display = 'none';
        }
    }

    function addToThumbnailQueue(uniqueId, isPriority = false) {
        if (thumbnailCache.has(uniqueId) || currentlyProcessing.has(uniqueId)) {
            return;
        }

        const existingIndex = thumbnailQueue.indexOf(uniqueId);
        if (existingIndex !== -1) {
            thumbnailQueue.splice(existingIndex, 1);
        }

        if (isPriority) {
            thumbnailQueue.unshift(uniqueId);
        } else {
            thumbnailQueue.push(uniqueId);
        }

        updateQueueStats();
        processThumbnailQueue();
    }

    function processThumbnailQueue() {
        while (currentlyProcessing.size < settings.concurrentRenders && thumbnailQueue.length > 0) {
            const uniqueId = thumbnailQueue.shift();
            const [docIndex] = uniqueId.split('-');
            const docInfo = loadedPdfDocs[docIndex];
            
            if (!docInfo) { // The doc may have been removed
                continue;
            }

            currentlyProcessing.add(uniqueId);
            updateQueueStats();

            const promise = (docInfo.type === 'pseudo')
                ? renderImageThumbnail(uniqueId)
                : renderThumbnail(uniqueId);

            promise.catch(err => {
                logError(`Failed to render thumbnail for ${uniqueId}:`, err);
                // Update UI to show error state for this thumb
                const ph1 = mainContent.querySelector(`.${PFX}thumbnail-placeholder[data-doc-index="${docIndex}"][data-page-num="${uniqueId.split('-')[1]}"]`);
                if (ph1) ph1.textContent = 'Error';
                const si = sortContainer.querySelector(`.${PFX}sort-item[data-unique-id="${uniqueId}"] .${PFX}sort-item-placeholder`);
                if (si) si.textContent = 'Error';
            }).finally(() => {
                currentlyProcessing.delete(uniqueId);
                updateQueueStats();
                processThumbnailQueue();
            });
        }
    }

function initializeThumbnailObserver() {
        if (thumbnailObserver) {
            thumbnailObserver.disconnect();
            thumbnailObserver = null;
        }
    }

    function checkForExistingLinks() {
        const existingInputs = [...document.querySelectorAll('#image_block input[name="screens[]"]')]
            .map(input => input.value.trim())
            .filter(url => url.startsWith('http'));

        if (existingInputs.length === 0) {
            logDebug("No existing screenshot links found.");
            return;
        }

        logDebug(`Found ${existingInputs.length} existing screenshot links.`);
        const docIndex = loadedPdfDocs.length;
        const pseudoDoc = {
            doc: null,
            fileName: 'Existing Images',
            color: getFileColor('Existing Images'),
            type: 'pseudo',
            pages: existingInputs,
            identifier: 'existing-images' // Add a unique identifier
        };
        loadedPdfDocs.push(pseudoDoc);

        existingInputs.forEach((url, pageIndex) => {
            const uniqueId = `${docIndex}-${pageIndex + 1}`; // 1-based pageIndex
            selectedPagesState.add(uniqueId);
        });
    }


    async function handleFiles(files) {
        if (loadedPdfDocs.length === 0) {
            checkForExistingLinks();
        }

        const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        const newFiles = Array.from(files).filter(file => {
             if (!acceptedTypes.includes(file.type)) return false;
             const identifier = `${file.name}-${file.size}`;
             return !loadedPdfDocs.some(doc => doc.identifier === identifier);
        });

        if (newFiles.length === 0) {
            logDebug("No new files to add (all were duplicates).");
            if (selectModal.style.display !== 'flex') openModal();
            return;
        }

        dropZone.classList.add('loading');

        try {
            const wasModalHidden = selectModal.style.display !== 'flex';
            const startIndex = loadedPdfDocs.length; // Get index before adding new files

            const newPdfs = newFiles.filter(f => f.type === 'application/pdf');
            const newImages = newFiles.filter(f => f.type.startsWith('image/'));

            for (const file of newPdfs) {
                const fileName = file.name.replace(/\.[^/.]+$/, "");
                const identifier = `${file.name}-${file.size}`;
                const fileData = await file.arrayBuffer();
                const pdfDoc = await pdfjsLib.getDocument({ data: fileData }).promise;
                loadedPdfDocs.push({
                    doc: pdfDoc, fileName, activeRenderingCount: 0, scrollTop: 0, color: getFileColor(fileName), identifier
                });
            }

            if (newImages.length > 0) {
                const dataUrls = await Promise.all(newImages.map(file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })));

                let addedImagesDoc = loadedPdfDocs.find(d => d.identifier === 'added-images');
                if (addedImagesDoc) {
                    addedImagesDoc.pages.push(...dataUrls);
                } else {
                     addedImagesDoc = {
                        doc: null, fileName: 'Added Images', type: 'pseudo', pages: dataUrls,
                        color: getFileColor('Added Images'), identifier: 'added-images'
                    };
                    loadedPdfDocs.push(addedImagesDoc);
                }
            }

            if (wasModalHidden) {
                await openModal();
            } else {
                // FIX: Instead of rebuilding the entire UI, just append the new file elements.
                await appendNewFileUI(startIndex);
                const currentDocStillExists = currentVisibleDocIndex < loadedPdfDocs.length;
                showThumbnailGridForDoc(currentDocStillExists ? currentVisibleDocIndex : 0);
                updateSelectionState();
                updateQueueStats();
            }
        } catch (error) {
            logError('Error processing files:', error);
            alert('Failed to load or process one or more files.');
        } finally {
            dropZone.classList.remove('loading');
        }
    }

    async function updateSidebar() {
        if (!sidebar.querySelector(`#${PFX}sidebar-list`)) {
            sidebar.innerHTML = `
                <div id="${PFX}sidebar-list"></div>
                <button id="${PFX}add-files-btn" class="${PFX}btn ${PFX}btn-secondary">Add More (or Drop)</button>
            `;
            sidebar.querySelector(`#${PFX}add-files-btn`).addEventListener('click', () => addFilesInput.click());
        }

        const sidebarList = sidebar.querySelector(`#${PFX}sidebar-list`);
        if (!sidebarList) {
            logError("Failed to find sidebar list container.");
            return;
        }
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        sidebarList.innerHTML = ''; // Clear and rebuild fully

        for (let i = 0; i < loadedPdfDocs.length; i++) {
            const pdfInfo = loadedPdfDocs[i];
            const item = document.createElement('div');
            item.className = `${PFX}sidebar-item`;
            item.dataset.docIndex = i;
            item.style.borderLeftColor = pdfInfo.color;

            item.innerHTML = `
                <span class="${PFX}sidebar-spinner"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span>
                <button class="${PFX}sidebar-item-remove-btn" title="Remove ${pdfInfo.fileName}">&times;</button>
                <div class="${PFX}sidebar-item-canvas-placeholder"></div>
                <p>${pdfInfo.fileName}</p>
                <span class="${PFX}sidebar-count" id="${PFX}sidebar-count-${i}" style="display: none;"></span>
            `;

            item.querySelector(`.${PFX}sidebar-item-remove-btn`).addEventListener('click', (e) => {
                e.stopPropagation();
                removeFile(i);
            });

            item.addEventListener('click', () => {
                sidebar.querySelector(`.${PFX}sidebar-item.active`)?.classList.remove('active');
                item.classList.add('active');
                showThumbnailGridForDoc(i);
            });

            sidebarList.appendChild(item);

            const placeholder = item.querySelector(`.${PFX}sidebar-item-canvas-placeholder`);
            if (pdfInfo.type === 'pseudo') {
                const labelDiv = document.createElement('div');
                labelDiv.className = `${PFX}sidebar-item-text-label`;
                const shortName = pdfInfo.fileName.split(' ')[0]; // "Existing" or "Added"
                labelDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="width: 2rem; height: 2rem; color: #9ca3af;" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg><span>${shortName}</span>`;
                placeholder.replaceWith(labelDiv);
            } else {
                 (async () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const page = await pdfInfo.doc.getPage(1);
                        const viewport = page.getViewport({ scale: 0.18 });
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = isDarkMode ? '#1f2937' : 'white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        await page.render({ canvasContext: ctx, viewport, background: 'rgba(0,0,0,0)' }).promise;
                        if (item.contains(placeholder)) placeholder.replaceWith(canvas);
                    } catch(e) { logError("Sidebar thumb render failed", e); }
                })();
            }
        }
    }

    async function appendNewFileUI(startIndex) {
        const sidebarList = sidebar.querySelector(`#${PFX}sidebar-list`);
        if (!sidebarList) return;

        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Loop through only the newly added documents
        for (let i = startIndex; i < loadedPdfDocs.length; i++) {
            const pdfInfo = loadedPdfDocs[i];
            
            // == 1. Append new item to Sidebar ==
            const item = document.createElement('div');
            item.className = `${PFX}sidebar-item`;
            item.dataset.docIndex = i;
            item.style.borderLeftColor = pdfInfo.color;
            item.innerHTML = `
                <span class="${PFX}sidebar-spinner"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span>
                <button class="${PFX}sidebar-item-remove-btn" title="Remove ${pdfInfo.fileName}">&times;</button>
                <div class="${PFX}sidebar-item-canvas-placeholder"></div>
                <p>${pdfInfo.fileName}</p>
                <span class="${PFX}sidebar-count" id="${PFX}sidebar-count-${i}" style="display: none;"></span>
            `;
            item.querySelector(`.${PFX}sidebar-item-remove-btn`).addEventListener('click', (e) => { e.stopPropagation(); removeFile(i); });
            item.addEventListener('click', () => {
                sidebar.querySelector(`.${PFX}sidebar-item.active`)?.classList.remove('active');
                item.classList.add('active');
                showThumbnailGridForDoc(i);
            });
            sidebarList.appendChild(item);

            const placeholder = item.querySelector(`.${PFX}sidebar-item-canvas-placeholder`);
            if (pdfInfo.type === 'pseudo') {
                const labelDiv = document.createElement('div');
                labelDiv.className = `${PFX}sidebar-item-text-label`;
                const shortName = pdfInfo.fileName.split(' ')[0];
                labelDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="width: 2rem; height: 2rem; color: #9ca3af;" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg><span>${shortName}</span>`;
                placeholder.replaceWith(labelDiv);
            } else {
                 (async () => {
                    try {
                        const page = await pdfInfo.doc.getPage(1);
                        const viewport = page.getViewport({ scale: 0.18 });
                        const canvas = document.createElement('canvas');
                        canvas.height = viewport.height; canvas.width = viewport.width;
                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = isDarkMode ? '#1f2937' : 'white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        await page.render({ canvasContext: ctx, viewport, background: 'rgba(0,0,0,0)' }).promise;
                        if (item.contains(placeholder)) placeholder.replaceWith(canvas);
                    } catch(e) { logError("Sidebar thumb render failed", e); }
                })();
            }

            // == 2. Append new grid to Main Content ==
            const gridContainer = document.createElement('div');
            gridContainer.className = `${PFX}thumbnail-grid-container`;
            gridContainer.dataset.docIndex = i;
            gridContainer.style.display = 'none'; // Initially hidden
            gridContainer.addEventListener('click', (e) => {
                const thumb = e.target.closest(`.${PFX}thumbnail-container, .${PFX}thumbnail-placeholder`);
                if (thumb) toggleThumbnailSelection(thumb);
            });

            const pages = pdfInfo.type === 'pseudo' ? pdfInfo.pages.length : pdfInfo.doc.numPages;
            for (let pageNum = 1; pageNum <= pages; pageNum++) {
                const placeholder = document.createElement('div');
                placeholder.className = `${PFX}thumbnail-placeholder`;
                placeholder.innerHTML = `<svg style="width: 2rem; height: 2rem; color: #9ca3af; animation: ${PFX}spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
                placeholder.dataset.docIndex = i;
                placeholder.dataset.pageNum = pageNum;
                gridContainer.appendChild(placeholder);
            }
            mainContent.appendChild(gridContainer);
        }

        if (!settings.lazyLoad) {
            requestAnimationFrame(() => {
                const newPlaceholders = Array.from(mainContent.querySelectorAll(`.${PFX}thumbnail-placeholder`))
                    .filter(p => parseInt(p.dataset.docIndex) >= startIndex);
                
                newPlaceholders.sort((a, b) => {
                    if (a.offsetTop !== b.offsetTop) {
                        return a.offsetTop - b.offsetTop;
                    }
                    return a.offsetLeft - b.offsetLeft;
                });

                newPlaceholders.forEach(p => {
                    const uniqueId = `${p.dataset.docIndex}-${p.dataset.pageNum}`;
                    addToThumbnailQueue(uniqueId);
                });
            });
        }
    }

    function removeFile(docIndexToRemove) {
        // Remove from queue any items associated with the file
        thumbnailQueue = thumbnailQueue.filter(id => !id.startsWith(`${docIndexToRemove}-`));
        for (const id of currentlyProcessing) {
            if (id.startsWith(`${docIndexToRemove}-`)) {
                currentlyProcessing.delete(id);
            }
        }

        loadedPdfDocs.splice(docIndexToRemove, 1);

        // Re-key the thumbnail cache to account for the shifted doc indices.
        const keysToDelete = [];
        const updatedEntries = new Map();

        for (const [key, value] of thumbnailCache.entries()) {
            const [docIndexStr, pageNumStr] = key.split('-');
            const docIndex = parseInt(docIndexStr, 10);

            if (docIndex === docIndexToRemove) {
                // Mark this key for deletion.
                keysToDelete.push(key);
            } else if (docIndex > docIndexToRemove) {
                // Mark the old key for deletion and prepare the updated entry.
                keysToDelete.push(key);
                const newKey = `${docIndex - 1}-${pageNumStr}`;
                updatedEntries.set(newKey, value);
            }
        }

        // Apply the changes to the cache.
        keysToDelete.forEach(key => thumbnailCache.delete(key));
        for (const [key, value] of updatedEntries.entries()) {
            thumbnailCache.set(key, value);
        }

        const newSelectedPagesState = new Set();
        selectedPagesState.forEach(id => {
            const [docIndexStr, pageNumStr] = id.split('-');
            let docIndex = parseInt(docIndexStr, 10);
            if (docIndex < docIndexToRemove) newSelectedPagesState.add(id);
            else if (docIndex > docIndexToRemove) newSelectedPagesState.add(`${docIndex - 1}-${pageNumStr}`);
        });
        selectedPagesState = newSelectedPagesState;

        if (currentVisibleDocIndex >= docIndexToRemove) {
            currentVisibleDocIndex = Math.max(0, currentVisibleDocIndex - 1);
        }

        if (loadedPdfDocs.length === 0) {
            closeModal();
            return;
        }

        updateSidebar();
        appendThumbnailGrids().then(() => {
            const firstItem = sidebar.querySelector(`.${PFX}sidebar-item[data-doc-index="${currentVisibleDocIndex}"]`);
            if (firstItem) firstItem.classList.add('active');
            showThumbnailGridForDoc(currentVisibleDocIndex);
            updateSelectionState();
        });
    }

    function prioritizeVisibleThumbnails() {
        const activeGrid = mainContent.querySelector(`.${PFX}thumbnail-grid-container[data-doc-index="${currentVisibleDocIndex}"]`);
        if (!activeGrid || activeGrid.style.display === 'none') return;

        const viewportTop = mainContent.scrollTop;
        const viewportBottom = viewportTop + mainContent.clientHeight;
        const rootMargin = settings.lazyLoad ? 300 : 0;
        const visiblePlaceholders = [];

        activeGrid.querySelectorAll(`.${PFX}thumbnail-placeholder`).forEach(placeholder => {
            const placeholderTop = placeholder.offsetTop;
            const placeholderBottom = placeholderTop + placeholder.offsetHeight;
            if (placeholderTop < viewportBottom + rootMargin && placeholderBottom > viewportTop - rootMargin) {
                visiblePlaceholders.push(placeholder);
            }
        });

        visiblePlaceholders.sort((a, b) => {
            if (a.offsetTop !== b.offsetTop) {
                return a.offsetTop - b.offsetTop;
            }
            return a.offsetLeft - b.offsetLeft;
        });

        const idsToQueue = visiblePlaceholders.map(p => `${p.dataset.docIndex}-${p.dataset.pageNum}`);
        idsToQueue.reverse().forEach(id => {
            addToThumbnailQueue(id, true);
        });
    }

    function showThumbnailGridForDoc(newDocIndex) {
        if (loadedPdfDocs[currentVisibleDocIndex]) {
            loadedPdfDocs[currentVisibleDocIndex].scrollTop = mainContent.scrollTop;
        }

        currentVisibleDocIndex = newDocIndex;
        document.querySelectorAll(`.${PFX}thumbnail-grid-container`).forEach(grid => {
            grid.style.display = grid.dataset.docIndex == newDocIndex ? 'grid' : 'none';
        });

        if (loadedPdfDocs[newDocIndex]) {
            mainContent.scrollTop = loadedPdfDocs[newDocIndex].scrollTop || 0;
        }

        prioritizeVisibleThumbnails();
    }

    async function appendThumbnailGrids() {
        mainContent.innerHTML = '';

        const toolbar = document.createElement('div');
        toolbar.id = `${PFX}main-toolbar`;
        toolbar.innerHTML = `
            <span id="${PFX}main-toolbar-label">Spread Mode:</span>
            <div class="${PFX}spread-toggle">
                <button class="${PFX}spread-toggle-btn ${settings.spreadMode === 'odd' ? 'active' : ''}" data-spread="odd">Odd</button>
                <button class="${PFX}spread-toggle-btn ${settings.spreadMode === 'even' ? 'active' : ''}" data-spread="even">Even</button>
            </div>
        `;
        mainContent.appendChild(toolbar);

        for (let docIndex = 0; docIndex < loadedPdfDocs.length; docIndex++) {
            const pdfInfo = loadedPdfDocs[docIndex];
            const gridContainer = document.createElement('div');
            gridContainer.className = `${PFX}thumbnail-grid-container ${settings.spreadMode === 'odd' ? 'spread-odd' : 'spread-even'}`;
            gridContainer.dataset.docIndex = docIndex;
            gridContainer.style.display = 'none';

            gridContainer.addEventListener('click', (e) => {
                const thumb = e.target.closest(`.${PFX}thumbnail-container, .${PFX}thumbnail-placeholder`);
                if (thumb) {
                    toggleThumbnailSelection(thumb);
                }
            });

            const pages = pdfInfo.type === 'pseudo' ? pdfInfo.pages.length : pdfInfo.doc.numPages;
            for (let pageNum = 1; pageNum <= pages; pageNum++) {
                const uniqueId = `${docIndex}-${pageNum}`;
                const cachedThumb = thumbnailCache.get(uniqueId);
                let element;
                if (cachedThumb) {
                    element = cachedThumb.cloneNode(true);
                    const originalCanvas = cachedThumb.querySelector('canvas');
                    if (originalCanvas) {
                        const clonedCanvas = element.querySelector('canvas');
                        if (clonedCanvas) {
                            clonedCanvas.getContext('2d').drawImage(originalCanvas, 0, 0);
                        }
                    }
                } else {
                    const placeholder = document.createElement('div');
                    placeholder.className = `${PFX}thumbnail-placeholder`;
                    placeholder.innerHTML = `<svg style="width: 2rem; height: 2rem; color: #9ca3af; animation: ${PFX}spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
                    element = placeholder;
                }

                element.dataset.docIndex = docIndex;
                element.dataset.pageNum = pageNum;
                if (selectedPagesState.has(uniqueId)) {
                    element.classList.add('thumbnail-selected');
                }
                gridContainer.appendChild(element);
            }
            mainContent.appendChild(gridContainer);
        }

        initializeThumbnailObserver();
        
        if (!settings.lazyLoad) {
            enqueueAllPlaceholders();
        }
    }

    async function renderThumbnail(uniqueId) {
        const [docIndex, pageNum] = uniqueId.split('-');
        const placeholder = mainContent.querySelector(`.${PFX}thumbnail-placeholder[data-doc-index="${docIndex}"][data-page-num="${pageNum}"]`);
        if (!loadedPdfDocs[docIndex] || !placeholder) return;

        const docInfo = loadedPdfDocs[docIndex];
        const sidebarItem = sidebar.querySelector(`[data-doc-index="${docIndex}"]`);

        docInfo.activeRenderingCount++;
        if (sidebarItem) sidebarItem.classList.add('is-rendering');

        try {
            const page = await docInfo.doc.getPage(parseInt(pageNum));
            const canvas = document.createElement('canvas');
            const viewport = page.getViewport({ scale: 0.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

            const thumbDiv = document.createElement('div');
            thumbDiv.className = `${PFX}thumbnail-container`;
            thumbDiv.innerHTML = `<span class="${PFX}thumbnail-page-num">${pageNum}</span>`;
            thumbDiv.prepend(canvas);

            // --- START FIX ---
            // Create a clean clone for the cache, ensuring the canvas content is copied.
            // A simple cloneNode() does not copy the pixel data of a canvas.
            const cacheClone = thumbDiv.cloneNode(true);
            const originalCanvas = thumbDiv.querySelector('canvas');
            const clonedCanvasForCache = cacheClone.querySelector('canvas');
            if (originalCanvas && clonedCanvasForCache) {
                clonedCanvasForCache.getContext('2d').drawImage(originalCanvas, 0, 0);
            }
            thumbnailCache.set(uniqueId, cacheClone); // Cache the clone with copied pixels
            // --- END FIX ---


            if (document.body.contains(placeholder)) {
                 thumbDiv.dataset.docIndex = docIndex;
                 thumbDiv.dataset.pageNum = pageNum;
                 if(placeholder.classList.contains('thumbnail-selected')) {
                     thumbDiv.classList.add('thumbnail-selected');
                 }
                placeholder.replaceWith(thumbDiv);
            }

            // Update sort item if it exists and has a placeholder
            const sortItem = sortContainer.querySelector(`.${PFX}sort-item[data-unique-id="${uniqueId}"]`);
            if (sortItem) {
                const sortPlaceholder = sortItem.querySelector(`.${PFX}sort-item-placeholder`);
                if (sortPlaceholder) {
                    const clonedCanvas = canvas.cloneNode(true);
                    clonedCanvas.getContext('2d').drawImage(canvas, 0, 0);
                    sortPlaceholder.replaceWith(clonedCanvas);
                }
            }

        } catch (err) {
            logError(`Failed to render thumbnail for doc ${docIndex}, page ${pageNum}:`, err);
            if(document.body.contains(placeholder)) placeholder.textContent = 'Error';
        } finally {
             if(docInfo) {
                docInfo.activeRenderingCount--;
                if (docInfo.activeRenderingCount <= 0 && sidebarItem) {
                    sidebarItem.classList.remove('is-rendering');
                }
             }
        }
    }

    async function renderImageThumbnail(uniqueId) {
        const [docIndexStr, pageNumStr] = uniqueId.split('-');
        const docIndex = parseInt(docIndexStr, 10);
        const pageNum = parseInt(pageNumStr, 10);
        const docInfo = loadedPdfDocs[docIndex];

        if (!docInfo || docInfo.type !== 'pseudo') {
            throw new Error("Invalid doc type or index for renderImageThumbnail");
        }

        try {
            const url = docInfo.pages[pageNum - 1];
            const img = await loadImageFromUrl(url);

            // FIX: Convert the loaded image to a canvas to make its content permanent and cacheable,
            // avoiding issues with revoked blob URLs.
            const canvas = document.createElement('canvas');
            // Use a consistent thumbnail size, aiming for a width of ~160px like the PDF thumbs
            const scale = 160 / img.width;
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

            const thumbDiv = document.createElement('div');
            thumbDiv.className = `${PFX}thumbnail-container`;
            thumbDiv.innerHTML = `<span class="${PFX}thumbnail-page-num">${pageNum}</span>`;
            thumbDiv.prepend(canvas);

            // Create a clean clone for the cache with redrawn canvas
            const cacheClone = thumbDiv.cloneNode(true);
            cacheClone.querySelector('canvas').getContext('2d').drawImage(canvas, 0, 0);
            thumbnailCache.set(uniqueId, cacheClone);

            // Update main grid placeholder
            const mainPlaceholder = mainContent.querySelector(`.${PFX}thumbnail-placeholder[data-doc-index="${docIndex}"][data-page-num="${pageNum}"]`);
            if (mainPlaceholder) {
                const finalThumb = thumbDiv.cloneNode(true);
                finalThumb.querySelector('canvas').getContext('2d').drawImage(canvas, 0, 0);
                finalThumb.dataset.docIndex = docIndex;
                finalThumb.dataset.pageNum = pageNum;
                if (mainPlaceholder.classList.contains('thumbnail-selected')) {
                    finalThumb.classList.add('thumbnail-selected');
                }
                mainPlaceholder.replaceWith(finalThumb);
            }

            // Update sort sidebar placeholder
            const sortItem = sortContainer.querySelector(`.${PFX}sort-item[data-unique-id="${uniqueId}"]`);
            if (sortItem) {
                const sortPlaceholder = sortItem.querySelector(`.${PFX}sort-item-placeholder`);
                if (sortPlaceholder) {
                    const canvasContent = canvas.cloneNode(true);
                    canvasContent.getContext('2d').drawImage(canvas, 0, 0);
                    sortPlaceholder.replaceWith(canvasContent);
                }
            }
        } catch (error) {
            logError(`Failed to load image for thumbnail ${uniqueId}:`, error);
            throw error;
        }
    }

     function updateSortSidebar() {
        sortContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();

        const orderedItems = Array.from(selectedPagesState, id => {
            const [docIndex, pageNum] = id.split('-').map(Number);
            return { docIndex, pageNum, uniqueId: id };
        });

        for (const { docIndex, pageNum, uniqueId } of orderedItems) {
            const docInfo = loadedPdfDocs[docIndex];
            if (!docInfo) continue;

            const item = document.createElement('div');
            item.className = `${PFX}sort-item`;
            item.dataset.docIndex = docIndex;
            item.dataset.pageNum = pageNum;
            item.dataset.uniqueId = uniqueId;
            item.draggable = true;
            item.style.borderTopColor = docInfo.color;
            item.addEventListener('click', () => showLargePreview(docIndex, pageNum));

            const removeBtn = document.createElement('button');
            removeBtn.className = `${PFX}sort-item-remove-btn`;
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Remove page';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedPagesState.delete(uniqueId);
                const originalThumb = mainContent.querySelector(`[data-doc-index="${docIndex}"][data-page-num="${pageNum}"]`);
                if (originalThumb) {
                    originalThumb.classList.remove('thumbnail-selected');
                }
                updateSelectionState();
            });
            item.appendChild(removeBtn);

            const cachedThumb = thumbnailCache.get(uniqueId);
            if (cachedThumb) {
                const originalCanvas = cachedThumb.querySelector('canvas');
                if (originalCanvas) {
                    const newCanvas = originalCanvas.cloneNode(true);
                    newCanvas.getContext('2d').drawImage(originalCanvas, 0, 0);
                    item.appendChild(newCanvas);
                } else {
                    // Fallback for cache inconsistency, should not happen.
                    const placeholder = document.createElement('div');
                    placeholder.className = `${PFX}sort-item-placeholder`;
                    placeholder.textContent = 'Error';
                    item.appendChild(placeholder);
                }
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = `${PFX}sort-item-placeholder`;
                placeholder.innerHTML = `<svg style="width: 1.5rem; height: 1.5rem; color: #9ca3af;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
                item.appendChild(placeholder);
                addToThumbnailQueue(uniqueId, true);
            }
            fragment.appendChild(item);
        }
        sortContainer.appendChild(fragment);
    }

    async function loadSlide(imgElement, listIndex) {
        imgElement.src = 'about:blank';
        if (listIndex < 0 || listIndex >= currentPreviewSortedList.length) return;

        const [docIndex, pageNum] = currentPreviewSortedList[listIndex].split('-').map(Number);
        const docInfo = loadedPdfDocs[docIndex];

        try {
            let dataUrl;
            if (docInfo.type === 'pseudo') {
                dataUrl = docInfo.pages[pageNum - 1];
            } else {
                const page = await docInfo.doc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
                dataUrl = canvas.toDataURL();
            }
            imgElement.src = dataUrl;
        } catch (e) {
            logError(`Failed to load slide for doc ${docIndex}, page ${pageNum}`, e);
            imgElement.src = 'about:blank';
        }
    }

    async function showLargePreview(docIndex, pageNum, resetList = true) {
        if (isNavigatingPreview) return;
        previewModal.style.display = 'flex';
        previewLoader.style.display = 'flex';

        [previewImagePrev, previewImageCurr, previewImageNext].forEach(img => {
            img.src = 'about:blank';
        });

        previewTrack.style.transition = 'none';
        previewTrack.style.transform = 'translateX(-33.3333%)';

        if (resetList) {
            currentPreviewSortedList = Array.from(sortContainer.querySelectorAll(`.${PFX}sort-item`)).map(item => `${item.dataset.docIndex}-${item.dataset.pageNum}`);
            const currentId = `${docIndex}-${pageNum}`;
            currentPreviewIndex = currentPreviewSortedList.indexOf(currentId);
        }

        await loadSlide(previewImageCurr, currentPreviewIndex);
        previewLoader.style.display = 'none';

        const prevIndex = (currentPreviewIndex - 1 + currentPreviewSortedList.length) % currentPreviewSortedList.length;
        const nextIndex = (currentPreviewIndex + 1) % currentPreviewSortedList.length;
        loadSlide(previewImagePrev, prevIndex);
        loadSlide(previewImageNext, nextIndex);
    }


    async function handleScreenshotGeneration() {
        loaderText.textContent = 'Processing...';
        dropZone.classList.add('loading');

        const sortedItems = Array.from(sortContainer.querySelectorAll(`.${PFX}sort-item`));
        const sortedPages = sortedItems.map(item => ({
            docIndex: parseInt(item.dataset.docIndex, 10),
            pageNum: parseInt(item.dataset.pageNum, 10)
        }));

        if (sortedPages.length === 0) {
            await populateFormAndClickButtons([]);
            closeModal();
            return;
        }

        if (settings.inlineProcessing) {
            closeModal();
            await processInline(sortedPages);
        } else {
            selectModal.style.display = 'none';
            resultsModal.style.display = 'flex';
            doneResultsBtn.style.display = 'none';
            resultsModal.querySelector(`.${PFX}modal-title`).textContent = 'Processing Screenshots...';
            await processInModal(sortedPages);
        }
    }

    async function processInModal(sortedPages) {
         try {
            updateProgressInResultsModal(`Preparing ${sortedPages.length} images...`);
            const urls = await processAndUpload(sortedPages, (id, url, isExisting) => {
                updateUploadStatus(id, url, isExisting, false);
            }, (progress) => {
                 const progressBarInner = document.getElementById(`${PFX}progress-bar-inner`);
                if(progressBarInner) progressBarInner.style.width = `${progress}%`;
            });

            const validUrls = urls.filter(u => u);

            if (validUrls.length > 0) {
                updateProgressInResultsModal('Populating form...');
                await populateFormAndClickButtons(validUrls);
            }

            resultsModal.querySelector(`.${PFX}modal-title`).textContent = 'Processing Complete!';
            updateProgressInResultsModal(`Successfully processed ${validUrls.length} of ${sortedPages.length} images.`);
            doneResultsBtn.style.display = 'inline-flex';

            if (settings.autoClose) {
                setTimeout(() => {
                    if (resultsModal.style.display === 'flex') {
                        doneResultsBtn.click();
                    }
                }, 2000);
            }

        } catch (error) {
            logError('Screenshot generation failed:', error);
            screenshotsOutputMain.innerHTML = `<p style="color: #ef4444; text-align: center;">An error occurred during processing. Please check the console for details.<br><small>${error.message}</small></p>`;
            doneResultsBtn.style.display = 'inline-flex';
        }
    }

    async function processInline(sortedPages) {
        const inputs = await populateFormAndClickButtons(Array(sortedPages.length).fill(''));
        const spinners = [];
        inputs.forEach(input => {
            const spinner = document.createElement('span');
            spinner.className = `${PFX}inline-spinner`;
            spinner.innerHTML = `<svg class="${PFX}spinner-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
            input.parentElement.insertBefore(spinner, input);
            spinners.push(spinner);
        });

        await new Promise(resolve => setTimeout(resolve, 50));

        try {
            const urls = await processAndUpload(sortedPages, (id, url, isExisting, index) => {
                updateUploadStatus(id, url, isExisting, true, index, spinners);
                if (url && inputs[index]) {
                     inputs[index].value = url;
                     inputs[index].dispatchEvent(new Event('input', { bubbles: true }));
                     inputs[index].dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            // Final check to remove any remaining spinners
            setTimeout(() => spinners.forEach(s => s.remove()), 1000);
            resetState();
        } catch (error) {
             logError('Inline processing failed:', error);
             spinners.forEach(s => s.textContent = '❌');
             resetState();
        }
    }


    async function processAndUpload(sortedPages, onStatusUpdate, onProgressUpdate) {
        displayUploadProgress(sortedPages);

        const processingPromises = sortedPages.map(({ pageNum, docIndex }) => {
            const docInfo = loadedPdfDocs[docIndex];
            if (docInfo.type === 'pseudo') {
                const url = docInfo.pages[pageNum - 1];
                return loadImageFromUrl(url).then(img => ({ img, pageNum, docIndex })).catch(() => null);
            }
            return docInfo.doc.getPage(pageNum).then(page => ({ page, pageNum, docIndex })).catch(() => null);
        });
        const processedItems = await Promise.all(processingPromises);

        const baseDimensionPromises = processedItems.map(item => {
            if (item?.img) return Promise.resolve({ width: item.img.width, height: item.img.height });
            if (item?.page) {
                const viewport = item.page.getViewport({ scale: NATIVE_DPI_SCALE });
                return Promise.resolve({ width: viewport.width, height: viewport.height });
            }
            return Promise.resolve(null);
        });
        const baseDimensions = (await Promise.all(baseDimensionPromises)).filter(Boolean);

        if (baseDimensions.length === 0 && processedItems.length > 0) {
            throw new Error("Could not determine dimensions for any selected items. Check for broken images.");
        }
        
        const minWidth = baseDimensions.length > 0 ? Math.min(...baseDimensions.map(d => d.width)) : 0;
        const minHeight = baseDimensions.length > 0 ? Math.min(...baseDimensions.map(d => d.height)) : 0;
        const multiplier = settings.resolutionMultiplier || 1.0;
        const { scale: relativeScale, finalWidth: targetWidth, finalHeight: targetHeight } = calculateOptimalScale(minWidth, minHeight, multiplier);
        const pdfRenderScale = relativeScale * NATIVE_DPI_SCALE;
        
        updateProgressInResultsModal(`Rendering, resizing, and uploading ${processedItems.length} images...`);

        let completedUploads = 0;
        const totalUploads = processedItems.length;
        const updateProgressBar = () => {
            completedUploads++;
            if (onProgressUpdate) {
                const progress = totalUploads > 0 ? (completedUploads / totalUploads) * 100 : 100;
                onProgressUpdate(progress);
            }
        };

        const finalCanvasPromises = processedItems.map(async (item, index) => {
            const uniqueId = item ? `${item.docIndex}-${item.pageNum}` : `item-${index}`;
            try {
                if (!item) throw new Error("Item failed to load.");
                let sourceItem;
                if (item.page) {
                    const viewport = item.page.getViewport({ scale: pdfRenderScale });
                    const canvas = document.createElement('canvas');
                    canvas.width = viewport.width; canvas.height = viewport.height;
                    await item.page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
                    sourceItem = canvas;
                } else if (item.img) { // Existing image
                    sourceItem = item.img;
                    const needsProcessing = (Math.abs(sourceItem.width - targetWidth) > 4 || Math.abs(sourceItem.height - targetHeight) > 4);
                    if (!needsProcessing) {
                        const originalUrl = loadedPdfDocs[item.docIndex].pages[item.pageNum - 1];
                        const proxiedUrl = await proxyThroughGGn(originalUrl);
                        if (onStatusUpdate) onStatusUpdate(uniqueId, proxiedUrl, true, index);
                        updateProgressBar();
                        return proxiedUrl;
                    }
                } else {
                     throw new Error("Invalid item type");
                }

                let resizableSource = sourceItem;
                if (sourceItem.width && sourceItem.height && (Math.abs(sourceItem.width - targetWidth) > 4 || Math.abs(sourceItem.height - targetHeight) > 4)) {
                    const scaleFactor = Math.max(targetWidth / sourceItem.width, targetHeight / sourceItem.height);
                    const resizedCanvas = document.createElement('canvas');
                    resizedCanvas.width = sourceItem.width * scaleFactor;
                    resizedCanvas.height = sourceItem.height * scaleFactor;
                    resizedCanvas.getContext('2d').drawImage(sourceItem, 0, 0, resizedCanvas.width, resizedCanvas.height);
                    resizableSource = resizedCanvas;
                }

                const finalCanvas = document.createElement('canvas');
                finalCanvas.width = targetWidth; finalCanvas.height = targetHeight;
                const ctx = finalCanvas.getContext('2d');
                ctx.drawImage(resizableSource, (resizableSource.width - targetWidth) / 2, (resizableSource.height - targetHeight) / 2, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);

                const blob = await new Promise(resolve => finalCanvas.toBlob(resolve, 'image/jpeg', 0.92));
                if (!blob) throw new Error("Canvas toBlob returned null.");

                const randomFileName = `${generateRandomName()}.jpg`;
                const uguuUrl = await uploadToUguu(blob, randomFileName);
                const url = uguuUrl ? await proxyThroughGGn(uguuUrl) : null;
                if (onStatusUpdate) onStatusUpdate(uniqueId, url, false, index);
                updateProgressBar();
                return url;

            } catch (err) {
                logError("Processing failed for item:", item, err);
                if (onStatusUpdate) onStatusUpdate(uniqueId, null, false, index);
                updateProgressBar();
                return null;
            }
        });

        return await Promise.all(finalCanvasPromises);
    }

    // --- 6. HELPER FUNCTIONS ---

    function loadImageFromUrl(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                timeout: 30000, // 30-second timeout
                ontimeout: function() {
                    reject(new Error(`Timeout fetching image (30s) for url: ${url}`));
                },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const img = new Image();
                        const objectUrl = URL.createObjectURL(response.response);
                        img.onload = () => {
                            URL.revokeObjectURL(objectUrl);
                            resolve(img);
                        };
                        img.onerror = () => {
                            URL.revokeObjectURL(objectUrl);
                            reject(new Error(`Could not load image from blob for url: ${url}`));
                        };
                        img.src = objectUrl;
                    } else {
                        reject(new Error(`HTTP error! status: ${response.status} for url: ${url}`));
                    }
                },
                onerror: function() {
                    reject(new Error(`Failed to fetch image (onerror) for url: ${url}`));
                }
            });
        });
    }

    function generateRandomName(length = 12) {
        return Array.from(crypto.getRandomValues(new Uint8Array(length)), byte => ('0' + (byte & 0x3f).toString(36)).slice(-1)).join('');
    }

    async function uploadToUguu(blob, fileName) {
        return new Promise((resolve) => {
            const formData = new FormData();
            formData.append('files[]', blob, fileName);
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://uguu.se/upload',
                data: formData,
                responseType: 'json',
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const result = response.response;
                        if (result.files?.[0]?.url) {
                            const unescapedUrl = result.files[0].url.replace(/\\\//g, "/");
                            resolve(unescapedUrl);
                        } else {
                            logError(`Invalid JSON response from uguu.se API:`, result);
                            resolve(null);
                        }
                    } else {
                        logError(`Upload HTTP error! status: ${response.status}`, response);
                        resolve(null);
                    }
                },
                onerror: function(response) {
                    logError('Upload failed (onerror):', response);
                    resolve(null);
                }
            });
        });
    }

    async function proxyThroughGGn(imageUrl) {
        if (!imageUrl) return null;
        
        return new Promise((resolve) => {
            const proxyUrl = `https://gazellegames.net/imgup.php?img=${encodeURIComponent(imageUrl)}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: proxyUrl,
                timeout: 30000,
                ontimeout: function() {
                    logError(`Timeout proxying image through GGn (30s) for url: ${imageUrl}`);
                    resolve(null);
                },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const proxiedUrl = response.responseText.trim();
                        if (proxiedUrl && proxiedUrl.startsWith('http')) {
                            resolve(proxiedUrl);
                        } else {
                            logError(`Invalid response from GGn imgup.php:`, response.responseText);
                            resolve(null);
                        }
                    } else {
                        logError(`GGn proxy HTTP error! status: ${response.status}`, response);
                        resolve(null);
                    }
                },
                onerror: function(response) {
                    logError('GGn proxy failed (onerror):', response);
                    resolve(null);
                }
            });
        });
    }

    function displayUploadProgress(itemsToProcess) {
        if (settings.inlineProcessing) return; // Don't draw this UI for inline mode
        screenshotsOutputMain.innerHTML = `
            <div id="${PFX}progress-container">
                <p id="${PFX}progress-text" style="text-align: center; margin-bottom: 0.5rem; font-weight: 500;"></p>
                <div id="${PFX}progress-bar"><div id="${PFX}progress-bar-inner"></div></div>
            </div>
            <div id="${PFX}links-container"></div>`;

        const linksContainer = document.getElementById(`${PFX}links-container`);
        if (!linksContainer) return;

        itemsToProcess.forEach(({ pageNum, docIndex }) => {
            const statusDiv = document.createElement('div');
            statusDiv.id = `${PFX}upload-status-${docIndex}-${pageNum}`;
            statusDiv.className = `${PFX}upload-status-item`;
            const docInfo = loadedPdfDocs[docIndex];
            statusDiv.innerHTML = `
                <span class="${PFX}upload-status-item-icon">
                    <svg style="animation: ${PFX}spin 1s linear infinite; height: 1em; width: 1em;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </span>
                <span class="${PFX}upload-status-item-text">Page ${pageNum} (${docInfo.fileName}): Queued...</span>
            `;
            linksContainer.appendChild(statusDiv);
        });
    }

    function updateUploadStatus(uniqueId, url, isExisting = false, isInline = false, index, spinners) {
        if (isInline) {
            const spinner = spinners[index];
            if (!spinner) return;

            // FIX: Replace the unreliable text emoji with a reliable SVG icon and set a status color.
            if (url) {
                // Success: Green checkmark SVG
                spinner.style.color = '#22c55e'; // A nice green from your script's palette
                spinner.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>`;
            } else {
                // Failure: Red 'X' SVG
                spinner.style.color = '#ef4444'; // A red from your script's palette
                spinner.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
            }
            return;
        }

        const statusDiv = document.getElementById(`${PFX}upload-status-${uniqueId}`);
        if (!statusDiv) return;
        const [docIndex, pageNum] = uniqueId.split('-');
        const docInfo = loadedPdfDocs[docIndex];

        if (url) {
            statusDiv.classList.add(`${PFX}upload-success`);
            const statusText = isExisting ? 'Kept Existing' : 'Success';
            statusDiv.innerHTML = `
                 <span class="${PFX}upload-status-item-icon">✅</span>
                 <span class="${PFX}upload-status-item-text">Page ${pageNum} (${docInfo.fileName}): ${statusText}</span>
                 <a href="${url}" target="_blank" rel="noopener noreferrer">(view)</a>`;
        } else {
            statusDiv.classList.add(`${PFX}upload-fail`);
            statusDiv.innerHTML = `
                <span class="${PFX}upload-status-item-icon">❌</span>
                <span class="${PFX}upload-status-item-text">Page ${pageNum} (${docInfo.fileName}): Upload Failed!</span>`;
        }
    }

    async function populateFormAndClickButtons(urls) {
        if (!urls) urls = [];
        const imageBlock = document.getElementById('image_block');
        if (!imageBlock) {
            logError("Could not find #image_block to add screenshots.");
            return [];
        }

        imageBlock.querySelectorAll('input[name="screens[]"]').forEach(input => { input.value = ''; });

        // This function clones the last screenshot input field.
        const addScreenshotInput = () => {
            const allSpans = document.querySelectorAll('span[id^="screenSpan"]');
            if (allSpans.length === 0) {
                // Cannot add a field if there's no template to clone.
                return false;
            }

            const lastSpan = allSpans[allSpans.length - 1];
            const lastIdNum = parseInt(lastSpan.id.replace('screenSpan', ''), 10);

            if (isNaN(lastIdNum)) {
                // The ID of the last span was not in the expected format.
                return false;
            }

            // Clone the last span, which serves as our template.
            const newSpan = lastSpan.cloneNode(true);
            const newIdNum = lastIdNum + 1;
            const newId = `screenSpan${newIdNum}`;
            newSpan.id = newId;

            // Clear the value of the input field in our new clone.
            const input = newSpan.querySelector('input[name="screens[]"]');
            if (input) {
                input.value = '';
            }

            // Update the 'Remove' link to target the new ID.
            const removeLink = newSpan.querySelector('a[onclick]');
            if (removeLink) {
                removeLink.setAttribute('onclick', `RemoveField('${newId}')`);
            }

            // Insert the new span into the DOM right after the last one.
            lastSpan.after(newSpan);

            return true;
        };

        let attempts = 0;
        const maxAttempts = urls.length + 5;
        let currentInputs = imageBlock.querySelectorAll('input[name="screens[]"]');

        while (currentInputs.length < urls.length) {
            if (attempts++ > maxAttempts) {
                throw new Error("Could not add enough screenshot fields to the form after multiple attempts. The site may have a limit.");
            }
            if (!addScreenshotInput()) {
                 throw new Error("Could not find a template or button to add new screenshot fields.");
            }
            await new Promise(resolve => setTimeout(resolve, 20));
            currentInputs = imageBlock.querySelectorAll('input[name="screens[]"]');
        }

        const finalInputs = Array.from(imageBlock.querySelectorAll('input[name="screens[]"]'));
        urls.forEach((url, index) => {
            if (finalInputs[index]) {
                finalInputs[index].value = url;
                if (url) { // only dispatch events if we are actually populating
                    finalInputs[index].dispatchEvent(new Event('input', { bubbles: true }));
                    finalInputs[index].dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });
        return finalInputs.slice(0, urls.length);
    }

    function toggleThumbnailSelection(element) {
        const { docIndex, pageNum } = element.dataset;
        const uniqueId = `${docIndex}-${pageNum}`;

        if (selectedPagesState.has(uniqueId)) {
            selectedPagesState.delete(uniqueId);
            element.classList.remove('thumbnail-selected');
        } else {
            selectedPagesState.add(uniqueId);
            element.classList.add('thumbnail-selected');
        }
        updateSelectionState();
    }

    function updateStateFromSortOrder() {
        const newSelectedPages = new Set();
        sortContainer.querySelectorAll(`.${PFX}sort-item`).forEach(item => {
            const { docIndex, pageNum } = item.dataset;
            newSelectedPages.add(`${docIndex}-${pageNum}`);
        });
        selectedPagesState = newSelectedPages;
        logDebug("Updated selected pages order from sidebar.");
        updateSelectionState();
    }


    function updateSidebarCounts() {
        loadedPdfDocs.forEach((_, docIndex) => {
            const countBadge = document.getElementById(`${PFX}sidebar-count-${docIndex}`);
            if (!countBadge) return;
            const count = Array.from(selectedPagesState).filter(id => id.startsWith(`${docIndex}-`)).length;
            if (count > 0) {
                countBadge.textContent = count;
                countBadge.style.display = 'flex';
            } else {
                countBadge.style.display = 'none';
            }
        });
    }


    function calculateOptimalScale(width, height, multiplier = 1.0) {
        let scale = multiplier;
        let finalWidth = Math.round(width * multiplier);
        let finalHeight = Math.round(height * multiplier);
        let capped = false;
        
        if (finalWidth > MAX_RESOLUTION || finalHeight > MAX_RESOLUTION) {
            const widthScale = MAX_RESOLUTION / (width * multiplier);
            const heightScale = MAX_RESOLUTION / (height * multiplier);
            const capScale = Math.min(widthScale, heightScale);
            scale = multiplier * capScale;
            finalWidth = Math.round(width * scale);
            finalHeight = Math.round(height * scale);
            capped = true;
        }
        
        return { scale, finalWidth, finalHeight, capped };
    }

    async function updateResolutionDisplay() {
        const resolutionInfo = document.querySelector(`#${PFX}resolution-info`);
        if (!resolutionInfo) return;

        const selectedCount = selectedPagesState.size;
        if (selectedCount === 0) {
            resolutionInfo.textContent = 'No pages selected';
            return;
        }

        resolutionInfo.textContent = 'Calculating resolution...';

        const dimensionPromises = Array.from(selectedPagesState).map(id => {
            const [docIndex, pageNum] = id.split('-').map(Number);
            const docInfo = loadedPdfDocs[docIndex];
            if (!docInfo) return Promise.resolve(null);

            if (docInfo.type === 'pseudo') {
                const url = docInfo.pages[pageNum - 1];
                return loadImageFromUrl(url)
                    .then(img => ({ width: img.width, height: img.height }))
                    .catch(() => null);
            } else {
                return docInfo.doc.getPage(pageNum)
                    .then(page => {
                        const viewport = page.getViewport({ scale: NATIVE_DPI_SCALE });
                        return { width: viewport.width, height: viewport.height };
                    })
                    .catch(() => null);
            }
        });

        const dimensions = (await Promise.all(dimensionPromises)).filter(Boolean);

        if (dimensions.length > 0) {
            const minWidth = Math.min(...dimensions.map(d => d.width));
            const minHeight = Math.min(...dimensions.map(d => d.height));
            const multiplier = settings.resolutionMultiplier || 1.0;
            
            const { scale, finalWidth, finalHeight, capped } = calculateOptimalScale(minWidth, minHeight, multiplier);
            
            if (capped) {
                const targetWidth = Math.round(minWidth * multiplier);
                const targetHeight = Math.round(minHeight * multiplier);
                resolutionInfo.innerHTML = `Target: ${finalWidth}x${finalHeight} <span class="${PFX}resolution-warning">(capped from ${targetWidth}x${targetHeight})</span>`;
            } else {
                resolutionInfo.textContent = `Target Resolution: ${finalWidth}x${finalHeight}`;
            }
        } else if (selectedCount > 0) {
            resolutionInfo.textContent = 'Could not calculate resolution.';
        } else {
            resolutionInfo.textContent = '';
        }
    }


    function updateSelectionState() {
        const count = selectedPagesState.size;
        generateBtn.textContent = count === 1 ? 'Generate 1 Screenshot' : `Generate ${count} Screenshots`;
        generateBtn.disabled = count === 0;
        updateSidebarCounts();
        updateSortSidebar();
        updateResolutionDisplay();
    }

    async function openModal() {
        selectModal.style.display = 'flex';
        if (mainContent.children.length !== loadedPdfDocs.length + 1 || !sidebar.querySelector(`#${PFX}add-files-btn`)) {
            await updateSidebar();
            await appendThumbnailGrids();
        }

        const itemToSelect = sidebar.querySelector(`.${PFX}sidebar-item[data-doc-index="${currentVisibleDocIndex}"]`) || sidebar.querySelector(`.${PFX}sidebar-item`);

        if (itemToSelect) {
            itemToSelect.click();
        } else if (loadedPdfDocs.length > 0) {
            const firstGrid = mainContent.querySelector(`.${PFX}thumbnail-grid-container`);
            if(firstGrid) firstGrid.style.display = 'grid';
        }

        updateSelectionState();
        updateQueueStats();
    }

    function closeModal() {
        selectModal.style.display = 'none';
        if (thumbnailObserver) thumbnailObserver.disconnect();
    }

    function resetState() {
        loadedPdfDocs = [];
        selectedPagesState.clear();
        if (thumbnailObserver) thumbnailObserver.disconnect();
        thumbnailCache.clear();
        thumbnailQueue = [];
        currentlyProcessing.clear();
        sidebar.innerHTML = '';
        mainContent.innerHTML = '';
        screenshotsOutputMain.innerHTML = '';
        if (dropZoneInput) dropZoneInput.value = '';
        if (addFilesInput) addFilesInput.value = '';
        if (dropZone) dropZone.classList.remove('loading');
        if (loaderText) loaderText.textContent = 'Loading...';
    }

    function updateProgressInResultsModal(message) {
        if(settings.inlineProcessing) return;
        const progressText = document.getElementById(`${PFX}progress-text`);
        if (progressText) {
            progressText.textContent = message;
        } else {
             screenshotsOutputMain.innerHTML = `<p>${message}</p>`;
        }
    }
})();