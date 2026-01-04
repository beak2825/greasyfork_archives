// ==UserScript==
// @name         GWA Search Interface - Aesthetic Upgrade
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modern, aesthetic redesign for gwasi.com with color customization
// @author       Ifrit Raen
// @match        https://gwasi.com/*
// @license      MIT
// @match        https://gwasi.com/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/551214/GWA%20Search%20Interface%20-%20Aesthetic%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/551214/GWA%20Search%20Interface%20-%20Aesthetic%20Upgrade.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let settings = {
        bgColor1: '#0a0e27',
        bgColor2: '#1a1a2e',
        bgColor3: '#16213e',
        textColor: '#e0e0e0'
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        loadSettings();
        createSettingsButton();
        applyStyles();
        observeAndEnhancePosts();
        setupRedditLinkHandler();
    }

    function loadSettings() {
        const saved = GM_getValue('gwasiSettings');
        if (saved) {
            settings = JSON.parse(saved);
        }
    }

    function saveSettings() {
        GM_setValue('gwasiSettings', JSON.stringify(settings));
        updateColors();
    }

    function updateColors() {
        const root = document.documentElement;
        root.style.setProperty('--bg-color-1', settings.bgColor1);
        root.style.setProperty('--bg-color-2', settings.bgColor2);
        root.style.setProperty('--bg-color-3', settings.bgColor3);
        root.style.setProperty('--text-color', settings.textColor);
    }

    function createSettingsButton() {
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'gwasi-settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = 'Interface Settings';
        document.body.appendChild(settingsBtn);

        const modal = document.createElement('div');
        modal.id = 'gwasi-settings-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="settings-content">
                <div class="settings-header">
                    <h3>Interface Settings</h3>
                    <button class="close-btn">&times;</button>
                </div>

                <div class="settings-section">
                    <label>Background Gradient Start</label>
                    <input type="color" id="bgColor1" value="${settings.bgColor1}">
                </div>

                <div class="settings-section">
                    <label>Background Gradient Middle</label>
                    <input type="color" id="bgColor2" value="${settings.bgColor2}">
                </div>

                <div class="settings-section">
                    <label>Background Gradient End</label>
                    <input type="color" id="bgColor3" value="${settings.bgColor3}">
                </div>

                <div class="settings-section">
                    <label>Text Color</label>
                    <input type="color" id="textColor" value="${settings.textColor}">
                </div>

                <div class="settings-footer">
                    <button id="reset-settings">Reset to Default</button>
                    <button id="save-settings">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        settingsBtn.onclick = () => {
            modal.style.display = 'flex';
        };

        modal.querySelector('.close-btn').onclick = () => {
            modal.style.display = 'none';
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };

        document.getElementById('save-settings').onclick = () => {
            settings.bgColor1 = document.getElementById('bgColor1').value;
            settings.bgColor2 = document.getElementById('bgColor2').value;
            settings.bgColor3 = document.getElementById('bgColor3').value;
            settings.textColor = document.getElementById('textColor').value;
            saveSettings();
            modal.style.display = 'none';
            showCopyFeedback('Settings saved!');
        };

        document.getElementById('reset-settings').onclick = () => {
            settings = {
                bgColor1: '#0a0e27',
                bgColor2: '#1a1a2e',
                bgColor3: '#16213e',
                textColor: '#e0e0e0'
            };
            document.getElementById('bgColor1').value = settings.bgColor1;
            document.getElementById('bgColor2').value = settings.bgColor2;
            document.getElementById('bgColor3').value = settings.bgColor3;
            document.getElementById('textColor').value = settings.textColor;
            saveSettings();
            showCopyFeedback('Reset to default!');
        };
    }

    function setupRedditLinkHandler() {
        document.addEventListener('click', function(e) {
            let target = e.target;

            while (target && target.tagName !== 'A') {
                target = target.parentElement;
            }

            if (target && target.tagName === 'A' && target.href.includes('reddit.com')) {
                target.setAttribute('target', '_blank');
                target.setAttribute('rel', 'noopener noreferrer');
            }
        }, true);
    }

    function copyToClipboard(text) {
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text);
        } else {
            navigator.clipboard.writeText(text);
        }
        showCopyFeedback();
    }

    function showCopyFeedback(msg = '✓ Copied!') {
        const feedback = document.createElement('div');
        feedback.textContent = msg;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(feedback);
        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    function enhancePost(listItem) {
        if (listItem.dataset.enhanced) return;
        listItem.dataset.enhanced = 'true';

        const textContent = listItem.textContent;

        const dateMatch = textContent.match(/(\d{4}-\d{2}-\d{2})/);
        const sourceMatch = textContent.match(/\d{4}-\d{2}-\d{2}\s+(\S+\s+\d+)/);
        const userLink = listItem.querySelector('a[href*="#q=u:"]');
        const username = userLink ? userLink.textContent : null;

        const fullTitle = listItem.childNodes[listItem.childNodes.length - 1]?.textContent?.trim() || '';
        const tags = fullTitle.match(/\[([^\]]+)\]/g) || [];
        const tagTexts = tags.map(t => t.slice(1, -1));

        let actualTitle = fullTitle.replace(/\[([^\]]+)\]/g, '').trim();

        listItem.innerHTML = '';

        const metaContainer = document.createElement('div');
        metaContainer.className = 'post-meta';

        if (dateMatch) {
            const dateSpan = document.createElement('span');
            dateSpan.className = 'post-date clickable-meta';
            dateSpan.textContent = dateMatch[1];
            dateSpan.title = 'Click to copy';
            dateSpan.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                copyToClipboard(dateMatch[1]);
            };
            metaContainer.appendChild(dateSpan);
        }

        if (sourceMatch) {
            const sourceSpan = document.createElement('span');
            sourceSpan.className = 'post-source clickable-meta';
            sourceSpan.textContent = sourceMatch[1];
            sourceSpan.title = 'Click to copy';
            sourceSpan.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                copyToClipboard(sourceMatch[1]);
            };
            metaContainer.appendChild(sourceSpan);
        }

        const scoreMatch = textContent.match(/\s+(\d+)\s+/);
        if (scoreMatch) {
            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'post-score clickable-meta';
            scoreSpan.textContent = `↑ ${scoreMatch[1]}`;
            scoreSpan.title = 'Click to copy';
            scoreSpan.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                copyToClipboard(scoreMatch[1]);
            };
            metaContainer.appendChild(scoreSpan);
        }

        if (username) {
            const userSpan = document.createElement('span');
            userSpan.className = 'post-user clickable-meta';
            userSpan.textContent = username;
            userSpan.title = 'Click to copy';
            userSpan.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                copyToClipboard(username);
            };
            metaContainer.appendChild(userSpan);
        }

        const flairSpans = listItem.parentElement.querySelectorAll('.flair');
        flairSpans.forEach(flair => {
            metaContainer.appendChild(flair.cloneNode(true));
        });

        listItem.appendChild(metaContainer);

        if (tagTexts.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'post-tags';

            tagTexts.forEach(tag => {
                const tagBtn = document.createElement('button');
                tagBtn.className = 'tag-button';
                tagBtn.textContent = tag;
                tagBtn.title = 'Click to copy';
                tagBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard(`[${tag}]`);
                };
                tagsContainer.appendChild(tagBtn);
            });

            listItem.appendChild(tagsContainer);
        }

        if (actualTitle) {
            const titleContainer = document.createElement('div');
            titleContainer.className = 'post-title-container';
            titleContainer.title = 'Click to copy';
            titleContainer.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                copyToClipboard(actualTitle);
            };

            const titleDiv = document.createElement('div');
            titleDiv.className = 'post-title';
            titleDiv.textContent = actualTitle;

            titleContainer.appendChild(titleDiv);
            listItem.appendChild(titleContainer);
        }
    }

    function observeAndEnhancePosts() {
        document.querySelectorAll('ul > a > li').forEach(enhancePost);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.matches && node.matches('ul > a > li')) {
                            enhancePost(node);
                        }
                        node.querySelectorAll && node.querySelectorAll('ul > a > li').forEach(enhancePost);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function applyStyles() {
        updateColors();

        const style = document.createElement('style');
        style.textContent = `
            :root {
                --bg-color-1: ${settings.bgColor1};
                --bg-color-2: ${settings.bgColor2};
                --bg-color-3: ${settings.bgColor3};
                --text-color: ${settings.textColor};
            }

            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
            }

            body {
                background: linear-gradient(135deg, var(--bg-color-1) 0%, var(--bg-color-2) 50%, var(--bg-color-3) 100%) !important;
                background-attachment: fixed !important;
                color: var(--text-color) !important;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                line-height: 1.6 !important;
                padding: 20px !important;
                max-width: 1400px !important;
                margin: 0 auto !important;
            }

            #gwasi-settings-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
                z-index: 9999;
                transition: transform 0.3s ease;
            }

            #gwasi-settings-btn:hover {
                transform: scale(1.1) rotate(90deg);
            }

            #gwasi-settings-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                justify-content: center;
                align-items: center;
            }

            .settings-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid rgba(102, 126, 234, 0.3);
                border-radius: 16px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                color: var(--text-color);
            }

            .settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
            }

            .settings-header h3 {
                margin: 0;
                font-size: 1.5em;
                color: var(--text-color);
            }

            .close-btn {
                background: none;
                border: none;
                color: var(--text-color);
                font-size: 32px;
                cursor: pointer;
                line-height: 1;
                padding: 0;
            }

            .close-btn:hover {
                color: #667eea;
            }

            .settings-section {
                margin-bottom: 20px;
            }

            .settings-section label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: var(--text-color);
            }

            .settings-section input[type="color"] {
                width: 100%;
                height: 50px;
                border: 2px solid rgba(102, 126, 234, 0.3);
                border-radius: 8px;
                cursor: pointer;
                background: transparent;
            }

            .settings-footer {
                display: flex;
                gap: 10px;
                margin-top: 25px;
            }

            .settings-footer button {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            #save-settings {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            #reset-settings {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-color);
            }

            .settings-footer button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            header {
                background: rgba(255, 255, 255, 0.05) !important;
                backdrop-filter: blur(10px) !important;
                padding: 20px 30px !important;
                border-radius: 16px !important;
                margin-bottom: 30px !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
            }

            header h3 {
                font-size: 1.8em !important;
                font-weight: 700 !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
                display: inline-block !important;
                margin: 0 !important;
            }

            header a {
                color: #667eea !important;
                text-decoration: none !important;
                font-weight: 500 !important;
                padding: 8px 16px !important;
                border-radius: 8px !important;
                background: rgba(102, 126, 234, 0.1) !important;
                transition: all 0.3s ease !important;
            }

            header a:hover {
                background: rgba(102, 126, 234, 0.2) !important;
                transform: translateY(-2px) !important;
            }

            input[type=textbox] {
                background: rgba(255, 255, 255, 0.08) !important;
                backdrop-filter: blur(10px) !important;
                border: 2px solid rgba(102, 126, 234, 0.3) !important;
                border-radius: 12px !important;
                padding: 16px 24px !important;
                font-size: 1.1em !important;
                color: var(--text-color) !important;
                width: 100% !important;
                margin-bottom: 20px !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
            }

            input[type=textbox]:focus {
                outline: none !important;
                border-color: #667eea !important;
                box-shadow: 0 4px 24px rgba(102, 126, 234, 0.3) !important;
            }

            input[type=textbox]::placeholder {
                color: rgba(224, 224, 224, 0.5) !important;
            }

            div.buttons {
                background: rgba(255, 255, 255, 0.05) !important;
                backdrop-filter: blur(10px) !important;
                padding: 16px !important;
                border-radius: 12px !important;
                margin-bottom: 16px !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                flex-wrap: wrap !important;
            }

            span.radio {
                background: rgba(255, 255, 255, 0.08) !important;
                border: 1px solid rgba(102, 126, 234, 0.3) !important;
                border-radius: 10px !important;
                padding: 4px !important;
                display: inline-flex !important;
                gap: 4px !important;
            }

            span.radio span {
                padding: 8px 16px !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                font-weight: 500 !important;
                user-select: none !important;
                color: var(--text-color) !important;
            }

            span.radio span:hover {
                background: rgba(102, 126, 234, 0.2) !important;
            }

            span.radio input:checked + span {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: #fff !important;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
            }

            label.button span {
                background: rgba(255, 255, 255, 0.08) !important;
                border: 1px solid rgba(102, 126, 234, 0.3) !important;
                border-radius: 8px !important;
                padding: 8px 16px !important;
                cursor: pointer !important;
                font-weight: 500 !important;
                display: inline-block !important;
                user-select: none !important;
                color: var(--text-color) !important;
            }

            label.button span:hover {
                background: rgba(102, 126, 234, 0.2) !important;
                transform: translateY(-2px) !important;
            }

            label.button input:checked + span {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: #fff !important;
                border-color: transparent !important;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
            }

            #filters {
                max-height: 180px !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                padding-right: 8px !important;
            }

            #filters::-webkit-scrollbar {
                width: 8px;
            }

            #filters::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }

            #filters::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
            }

            ul {
                display: grid !important;
                gap: 16px !important;
            }

            ul > a > li {
                background: rgba(255, 255, 255, 0.05) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(102, 126, 234, 0.2) !important;
                border-radius: 12px !important;
                padding: 20px !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
                text-align: center !important;
            }

            ul > a > li:hover {
                background: rgba(255, 255, 255, 0.08) !important;
                border-color: #667eea !important;
                transform: translateY(-4px) !important;
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3) !important;
            }

            ul > a:visited > li {
                background: rgba(118, 75, 162, 0.1) !important;
                border-color: rgba(118, 75, 162, 0.3) !important;
            }

            .post-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
                font-size: 0.9em;
            }

            .clickable-meta {
                cursor: pointer;
                padding: 6px 12px;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(102, 126, 234, 0.2);
                transition: all 0.2s ease;
                user-select: none;
                color: var(--text-color);
            }

            .clickable-meta:hover {
                background: rgba(102, 126, 234, 0.2);
                border-color: #667eea;
                transform: scale(1.05);
            }

            .clickable-meta:active {
                transform: scale(0.95);
            }

            .post-date {
                font-weight: 600;
                font-family: 'Fira Code', monospace;
            }

            .post-source {
                font-weight: 600;
            }

            .post-score {
                font-weight: 600;
            }

            .post-user {
                font-weight: 600;
            }

            .flair {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 0.85em;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            .audio {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
            }

            .script {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: #fff;
            }

            .post-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin: 16px 0;
                justify-content: center;
            }

            .tag-button {
                background: rgba(102, 126, 234, 0.15);
                border: 1px solid rgba(102, 126, 234, 0.3);
                color: var(--text-color);
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 0.85em;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
                white-space: nowrap;
            }

            .tag-button:hover {
                background: rgba(102, 126, 234, 0.3);
                border-color: #667eea;
                transform: translateY(-2px);
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            }

            .tag-button:active {
                transform: translateY(0);
            }

            .post-title-container {
                margin-top: 16px;
                padding: 16px 20px;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
                border: 2px solid rgba(102, 126, 234, 0.3);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }

            .post-title-container:hover {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%);
                border-color: #667eea;
                transform: scale(1.02);
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            }

            .post-title-container:active {
                transform: scale(0.98);
            }

            .post-title {
                font-size: 1.35em;
                font-weight: 700;
                color: var(--text-color);
                line-height: 1.5;
                letter-spacing: 0.3px;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            li li {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(102, 126, 234, 0.2);
                border-radius: 8px;
                margin: 12px 0;
                padding: 12px;
            }

            a {
                color: var(--text-color);
                text-decoration: none;
            }

            code {
                background: rgba(102, 126, 234, 0.2);
                color: var(--text-color);
                padding: 4px 8px;
                border-radius: 6px;
                font-family: 'Fira Code', monospace;
                font-size: 0.9em;
            }

            /* Help section with fixed height and scroll */
            #help {
                background: rgba(255, 255, 255, 0.05) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(102, 126, 234, 0.2) !important;
                border-radius: 12px !important;
                padding: 16px !important;
                margin-bottom: 16px !important;
                max-height: 200px !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
            }

            #help::-webkit-scrollbar {
                width: 8px;
            }

            #help::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }

            #help::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
            }

            #help li {
                color: var(--text-color);
            }

            #help p {
                color: var(--text-color);
                margin-bottom: 12px;
            }

            #help ul {
                display: block !important;
            }






#help ul li {
                text-align: left;
                padding: 8px 0;
                border: none;
                background: transparent;
                margin: 0;
            }

            /* Advanced section styling */
            #advanced {
                background: rgba(255, 255, 255, 0.05) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(102, 126, 234, 0.2) !important;
                border-radius: 12px !important;
                padding: 16px !important;
                margin-bottom: 16px !important;
            }

            em {
                color: var(--text-color);
                font-style: normal;
                font-size: 0.9em;
                font-weight: 500;
            }

            .results {
                color: var(--text-color);
            }

            ::-webkit-scrollbar {
                width: 12px;
            }

            ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }

            ::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
            }

            @media (max-width: 768px) {
                body {
                    padding: 12px !important;
                }

                #filters {
                    max-height: 150px !important;
                }

                #help {
                    max-height: 180px !important;
                }

                .post-tags {
                    gap: 4px;
                }

                .tag-button {
                    padding: 4px 8px;
                    font-size: 0.8em;
                }

                .post-title {
                    font-size: 1.15em;
                }

                .post-title-container {
                    padding: 14px 16px;
                }

                #gwasi-settings-btn {
                    width: 45px;
                    height: 45px;
                    font-size: 20px;
                    top: 15px;
                    right: 15px;
                }

                .settings-content {
                    padding: 20px;
                }
            }
        `;

        document.head.appendChild(style);
    }
})();