// ==UserScript==
// @name         DAD
// @namespace    http://github.com/0H4S
// @version      1.0
// @description  Download Automático DeepSeek - Baixe todos os blocos de código com um clique!
// @author       OHAS
// @license      Copyright (c) 2025 OHAS - Todos os direitos reservados.
// @homepageURL  http://github.com/0H4S
// @match        https://chat.deepseek.com/*
// @icon         https://img.icons8.com/?size=520&id=VGQlJM067vkN&format=png&color=000000
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548836/DAD.user.js
// @updateURL https://update.greasyfork.org/scripts/548836/DAD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let lastCheckedCheckbox = null;
    const styles = `
        .ds-mass-downloader {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .ds-download-button {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: #4285f4;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        .ds-download-button:hover {
            background-color: #3367d6;
            transform: scale(1.05);
        }
        .ds-menu {
            position: absolute;
            bottom: 60px;
            right: 0;
            width: 350px;
            max-height: 70vh;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 16px;
            display: none;
            flex-direction: column;
            gap: 12px;
            overflow: hidden;
        }
        .ds-menu.active {
            display: flex;
        }
        .ds-menu-header {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 8px;
            color: #202124;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ds-select-all-container {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e8eaed;
        }
        .ds-checkbox {
            margin-right: 8px;
            cursor: pointer;
            width: 16px;
            height: 16px;
        }
        .ds-checkbox-label {
            font-size: 14px;
            color: #5f6368;
            cursor: pointer;
        }
        .ds-code-list {
            overflow-y: auto;
            max-height: calc(70vh - 140px);
            margin-bottom: 12px;
            padding-right: 8px;
        }
        .ds-code-list::-webkit-scrollbar {
            width: 6px;
        }
        .ds-code-list::-webkit-scrollbar-track {
            background: #f1f3f4;
            border-radius: 3px;
        }
        .ds-code-list::-webkit-scrollbar-thumb {
            background: #dadce0;
            border-radius: 3px;
        }
        .ds-code-list::-webkit-scrollbar-thumb:hover {
            background: #bdc1c6;
        }
        .ds-code-item {
            display: flex;
            align-items: flex-start;
            padding: 8px 0;
            border-bottom: 1px solid #f1f3f4;
        }
        .ds-code-item:last-child {
            border-bottom: none;
        }
        .ds-code-info {
            margin-left: 8px;
            flex: 1;
        }
        .ds-code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }
        .ds-code-language {
            font-weight: 500;
            font-size: 13px;
            color: #202124;
        }
        .ds-code-position {
            font-size: 11px;
            color: #5f6368;
            background-color: #f1f3f4;
            padding: 2px 6px;
            border-radius: 10px;
        }
        .ds-code-name {
            font-size: 12px;
            color: #1a73e8;
            margin-bottom: 2px;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 280px;
        }
        .ds-code-preview {
            font-size: 12px;
            color: #5f6368;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-family: monospace;
            background-color: #f8f9fa;
            padding: 2px 4px;
            border-radius: 2px;
            max-width: 280px;
        }
        .ds-action-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 8px;
            border-top: 1px solid #e8eaed;
            padding-top: 12px;
        }
        .ds-action-button {
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .ds-cancel-button {
            background-color: transparent;
            color: #5f6368;
            border: none;
        }
        .ds-cancel-button:hover {
            background-color: #f1f3f4;
        }
        .ds-download-action {
            background-color: #4285f4;
            color: white;
            border: none;
        }
        .ds-download-action:hover {
            background-color: #3367d6;
        }
        .ds-progress {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 16px;
            z-index: 10000;
            display: none;
            width: 300px;
        }
        .ds-progress.active {
            display: block;
        }
        .ds-progress-title {
            font-weight: 600;
            margin-bottom: 8px;
            color: #202124;
        }
        .ds-progress-bar-container {
            width: 100%;
            height: 6px;
            background-color: #f1f3f4;
            border-radius: 3px;
            overflow: hidden;
        }
        .ds-progress-bar {
            height: 100%;
            background-color: #4285f4;
            width: 0%;
            transition: width 0.3s ease;
        }
        .ds-progress-text {
            font-size: 12px;
            color: #5f6368;
            margin-top: 8px;
            text-align: right;
        }
        .ds-empty-state {
            text-align: center;
            padding: 20px 0;
            color: #5f6368;
            font-size: 14px;
        }
        .ds-debug-info {
            margin-top: 10px;
            padding: 8px;
            background-color: #f8f9fa;
            border-radius: 4px;
            font-size: 12px;
            color: #5f6368;
            white-space: pre-wrap;
            display: none;
        }
        .ds-message-separator {
            font-size: 12px;
            color: #5f6368;
            text-align: center;
            margin: 12px 0;
            position: relative;
            display: flex;
            align-items: center;
            padding: 8px 0;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        .ds-message-title {
            flex-grow: 1;
            text-align: center;
            font-weight: 500;
        }
        .ds-message-select {
            display: flex;
            align-items: center;
            padding: 0 12px;
        }
        .ds-message-select-label {
            font-size: 12px;
            margin-left: 4px;
            color: #5f6368;
        }
        .ds-selected-count {
            font-size: 12px;
            color: #1a73e8;
            margin-left: 8px;
        }
    `;
    const downloadSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    `;
    function getCodeBlocks() {
        const codeBlocks = [];
        let downloadButtons = [];
        const allButtons = document.querySelectorAll('button, div[role="button"]');
        downloadButtons = Array.from(allButtons).filter(button => {
            const hasDownloadText = button.textContent && button.textContent.trim().includes('Download');
            const isNearCodeBlock = button.closest('.code-block-wrapper') ||
                                    button.closest('pre') ||
                                    button.closest('code') ||
                                    button.closest('[class*="code"]');
            return hasDownloadText && isNearCodeBlock;
        });
        const messageBlocks = getMessageBlocks();
        if (downloadButtons.length === 0) {
            const codeElements = document.querySelectorAll('pre');
            codeElements.forEach((codeElement, index) => {
                const nearbyButtons = Array.from(codeElement.querySelectorAll('button, div[role="button"]'));
                const downloadButton = nearbyButtons.find(btn =>
                    btn.textContent && (
                        btn.textContent.includes('Download') ||
                        btn.textContent.includes('Copy')
                    )
                );
                if (downloadButton) {
                    downloadButtons.push(downloadButton);
                } else {
                    const messageInfo = findParentMessageInfo(codeElement, messageBlocks);
                    codeBlocks.push({
                        id: index,
                        element: codeElement,
                        language: detectLanguage(codeElement),
                        preview: getCodePreview(codeElement),
                        name: extractCodeName(codeElement),
                        hasDownloadButton: false,
                        messageIndex: messageInfo.index,
                        messageTitle: messageInfo.title,
                        position: getElementPosition(codeElement)
                    });
                }
            });
        }
        downloadButtons.forEach((button, index) => {
            const codeBlock = button.closest('.code-block-wrapper') ||
                              button.closest('pre') ||
                              button.closest('[class*="code"]')?.closest('div') ||
                              button.parentElement?.closest('div');
            if (!codeBlock) return;
            let language = 'Código';
            const languageElement = codeBlock.querySelector('.code-block-header-language, [class*="language"]');
            if (languageElement) {
                language = languageElement.textContent.trim() || 'Código';
            } else {
                language = detectLanguage(codeBlock);
            }
            let preview = getCodePreview(codeBlock);
            const messageInfo = findParentMessageInfo(codeBlock, messageBlocks);
            codeBlocks.push({
                id: index,
                button: button,
                element: codeBlock,
                language: language,
                preview: preview,
                name: extractCodeName(codeBlock),
                hasDownloadButton: true,
                messageIndex: messageInfo.index,
                messageTitle: messageInfo.title,
                position: getElementPosition(codeBlock)
            });
        });
        codeBlocks.sort((a, b) => a.position - b.position);
        let currentMessageIndex = -1;
        let codeCounter = 1;
        codeBlocks.forEach(block => {
            if (block.messageIndex !== currentMessageIndex) {
                currentMessageIndex = block.messageIndex;
                codeCounter = 1;
            }
            block.sequentialNumber = codeCounter++;
        });
        return codeBlocks;
    }
    function getMessageBlocks() {
        const messages = [];
        const userMessages = document.querySelectorAll('.fbb737a4');
        const aiResponses = document.querySelectorAll('.e13328ad');
        if (userMessages.length > 0 || aiResponses.length > 0) {
            userMessages.forEach((element, index) => {
                const parentContainer = element.closest('._9663006') || element.parentElement;
                if (parentContainer) {
                    messages.push({
                        element: parentContainer,
                        index: index * 2,
                        title: 'Sua mensagem',
                        isUser: true
                    });
                }
            });
            aiResponses.forEach((element, index) => {
                messages.push({
                    element: element,
                    index: index * 2 + 1,
                    title: 'Resposta DeepSeek',
                    isUser: false
                });
            });
            messages.sort((a, b) => {
                const posA = getElementPosition(a.element);
                const posB = getElementPosition(b.element);
                return posA - posB;
            });
            messages.forEach((message, index) => {
                message.index = index;
            });
            return messages;
        }
        const possibleMessageSelectors = [
            '.message-container',
            '[class*="message"]',
            '.chat-turn',
            '.conversation-turn',
            '.chat-message'
        ];
        let messageElements = [];
        for (const selector of possibleMessageSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                messageElements = Array.from(elements);
                break;
            }
        }
        if (messageElements.length === 0) {
            const textBlocks = document.querySelectorAll('div > p, div > div > p');
            const potentialMessages = Array.from(textBlocks).map(el => el.closest('div:not(:empty)'));
            messageElements = [...new Set(potentialMessages)].filter(Boolean);
        }
        messageElements.forEach((element, index) => {
            let title = '';
            const isUserMessage = element.classList.contains('user-message') ||
                                 element.querySelector('[class*="user"]') !== null ||
                                 element.textContent.includes('You:');
            if (isUserMessage) {
                title = 'Sua mensagem';
            } else {
                title = 'Resposta DeepSeek';
            }
            const firstParagraph = element.querySelector('p');
            if (firstParagraph) {
                const text = firstParagraph.textContent.trim();
                if (text && text.length < 60) {
                    title = text;
                }
            }
            messages.push({
                element: element,
                index: index,
                title: title || `Mensagem ${index + 1}`,
                isUser: isUserMessage
            });
        });
        return messages;
    }
    function findParentMessageInfo(element, messageBlocks) {
        for (const message of messageBlocks) {
            if (message.element.contains(element)) {
                return {
                    index: message.index,
                    title: message.title
                };
            }
        }
        return {
            index: -1,
            title: 'Mensagem não identificada'
        };
    }
    function getElementPosition(element) {
        if (!element) return 999999;
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
    }
    function extractCodeName(codeElement) {
        if (!codeElement) return '';
        const codeText = codeElement.textContent || '';
        const firstLines = codeText.split('\n').slice(0, 5).join('\n');
        const filenamePatterns = [
            /filename[:\s]+([^\s\n]+)/i,
            /file[:\s]+([^\s\n]+)/i,
            /#!\/usr\/bin\/env\s+(\w+)/,
            /package\s+(\w+)/,
            /class\s+(\w+)/,
            /function\s+(\w+)/,
            /def\s+(\w+)/,
            /CREATE\s+TABLE\s+(\w+)/i,
            /SELECT\s+.*\s+FROM\s+(\w+)/i,
            /\/\*\s*(.+?)\s*\*\//,
            /\/\/\s*(.+?)$/m,
            /#\s*(.+?)$/m
        ];
        for (const pattern of filenamePatterns) {
            const match = firstLines.match(pattern);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
        const language = detectLanguage(codeElement).toLowerCase();
        const extensionMap = {
            'javascript': 'script.js',
            'typescript': 'script.ts',
            'python': 'script.py',
            'java': 'Main.java',
            'c': 'main.c',
            'c++': 'main.cpp',
            'cpp': 'main.cpp',
            'c#': 'Program.cs',
            'csharp': 'Program.cs',
            'php': 'index.php',
            'ruby': 'script.rb',
            'go': 'main.go',
            'rust': 'main.rs',
            'html': 'index.html',
            'css': 'styles.css',
            'sql': 'query.sql',
            'bash': 'script.sh',
            'shell': 'script.sh',
            'json': 'data.json',
            'xml': 'data.xml',
            'yaml': 'config.yaml',
            'dockerfile': 'Dockerfile'
        };
        if (extensionMap[language]) {
            const firstLine = codeText.split('\n')[0].trim();
            if (firstLine && firstLine.length < 30 && !firstLine.startsWith('import ') && !firstLine.startsWith('from ')) {
                const cleanName = firstLine
                    .replace(/[\/\\:*?"<>|]/g, '')
                    .replace(/\s+/g, '_')
                    .substring(0, 20);
                if (cleanName) {
                    return `${cleanName}.${extensionMap[language].split('.')[1]}`;
                }
            }
            return extensionMap[language];
        }
        return 'code-snippet';
    }
    function detectLanguage(codeElement) {
        if (!codeElement) return 'Código';
        const classList = codeElement.className || '';
        const classMatch = classList.match(/language-(\w+)/);
        if (classMatch && classMatch[1]) {
            return classMatch[1].charAt(0).toUpperCase() + classMatch[1].slice(1);
        }
        const dataLang = codeElement.getAttribute('data-language') ||
                        codeElement.getAttribute('data-lang') ||
                        codeElement.getAttribute('data-mode');
        if (dataLang) {
            return dataLang.charAt(0).toUpperCase() + dataLang.slice(1);
        }
        const langIndicator = codeElement.querySelector('[class*="language"], [class*="lang"]');
        if (langIndicator && langIndicator.textContent) {
            return langIndicator.textContent.trim();
        }
        return 'Código';
    }
    function getCodePreview(codeElement) {
        if (!codeElement) return '';
        const codeTextElement = codeElement.querySelector('code');
        if (codeTextElement && codeTextElement.textContent) {
            return codeTextElement.textContent.trim().substring(0, 50) +
                  (codeTextElement.textContent.length > 50 ? '...' : '');
        }
        const text = codeElement.textContent || '';
        return text.trim().substring(0, 50) + (text.length > 50 ? '...' : '');
    }
    function createInterface() {
        if (!document.getElementById('ds-downloader-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'ds-downloader-styles';
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }
        const existingContainer = document.querySelector('.ds-mass-downloader');
        if (existingContainer) {
            existingContainer.remove();
        }
        const container = document.createElement('div');
        container.className = 'ds-mass-downloader';
        const downloadButton = document.createElement('button');
        downloadButton.className = 'ds-download-button';
        downloadButton.innerHTML = downloadSvg;
        downloadButton.title = 'Baixar códigos';
        const menu = document.createElement('div');
        menu.className = 'ds-menu';
        menu.innerHTML = `
            <div class="ds-menu-header">
                <span>Download em Massa</span>
                <span class="ds-code-count"></span>
            </div>
            <div class="ds-select-all-container">
                <input type="checkbox" id="ds-select-all" class="ds-checkbox" checked>
                <label for="ds-select-all" class="ds-checkbox-label">Selecionar todos os blocos</label>
                <span class="ds-selected-count"></span>
            </div>
            <div class="ds-code-list"></div>
            <div class="ds-action-buttons">
                <button class="ds-action-button ds-cancel-button">Cancelar</button>
                <button class="ds-action-button ds-download-action">Baixar selecionados</button>
            </div>
            <div class="ds-debug-info"></div>
        `;
        const progressBar = document.createElement('div');
        progressBar.className = 'ds-progress';
        progressBar.innerHTML = `
            <div class="ds-progress-title">Baixando códigos...</div>
            <div class="ds-progress-bar-container">
                <div class="ds-progress-bar"></div>
            </div>
            <div class="ds-progress-text">0/0 concluído</div>
        `;
        container.appendChild(downloadButton);
        container.appendChild(menu);
        document.body.appendChild(container);
        const existingProgressBar = document.querySelector('.ds-progress');
        if (existingProgressBar) {
            existingProgressBar.remove();
        }
        document.body.appendChild(progressBar);
        downloadButton.addEventListener('click', () => {
            menu.classList.toggle('active');
            if (menu.classList.contains('active')) {
                updateCodeList();
            }
        });
        const cancelButton = menu.querySelector('.ds-cancel-button');
        cancelButton.addEventListener('click', () => {
            menu.classList.remove('active');
        });
        const downloadActionButton = menu.querySelector('.ds-download-action');
        downloadActionButton.addEventListener('click', () => {
            const selectedIds = Array.from(menu.querySelectorAll('.ds-code-item input[type="checkbox"]:checked'))
                .map(checkbox => parseInt(checkbox.dataset.id));
            if (selectedIds.length === 0) {
                showNotification('Nenhum bloco de código selecionado.');
                return;
            }
            menu.classList.remove('active');
            downloadSelectedCode(selectedIds);
        });
        const selectAllCheckbox = document.getElementById('ds-select-all');
        selectAllCheckbox.addEventListener('change', () => {
            const isChecked = selectAllCheckbox.checked;
            const checkboxes = menu.querySelectorAll('.ds-code-item input[type="checkbox"]:not([disabled])');
            checkboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            updateSelectedCount();
        });
        document.addEventListener('click', (event) => {
            if (!container.contains(event.target)) {
                menu.classList.remove('active');
            }
        });
    }
    function updateSelectedCount() {
        const selectedCount = document.querySelector('.ds-selected-count');
        const totalCheckboxes = document.querySelectorAll('.ds-code-item input[type="checkbox"]:not([disabled])').length;
        const selectedCheckboxes = document.querySelectorAll('.ds-code-item input[type="checkbox"]:checked:not([disabled])').length;
        if (selectedCount) {
            selectedCount.textContent = `(${selectedCheckboxes}/${totalCheckboxes})`;
        }
    }
    function updateCodeList() {
        const codeBlocks = getCodeBlocks();
        const codeList = document.querySelector('.ds-code-list');
        const codeCount = document.querySelector('.ds-code-count');
        const debugInfo = document.querySelector('.ds-debug-info');
        codeCount.textContent = `${codeBlocks.length} blocos`;
        codeList.innerHTML = '';
        if (codeBlocks.length === 0) {
            debugInfo.style.display = 'block';
            debugInfo.textContent = 'Informações de depuração:\n';
            debugInfo.textContent += `- Total de elementos <pre>: ${document.querySelectorAll('pre').length}\n`;
            debugInfo.textContent += `- Total de elementos <code>: ${document.querySelectorAll('code').length}\n`;
            debugInfo.textContent += `- Elementos com "Download" no texto: ${Array.from(document.querySelectorAll('*')).filter(el => el.textContent && el.textContent.includes('Download')).length}\n`;
        } else {
            debugInfo.style.display = 'none';
        }
        if (codeBlocks.length === 0) {
            codeList.innerHTML = `<div class="ds-empty-state">Nenhum bloco de código encontrado na página.</div>`;
            return;
        }
        const blocksByMessage = {};
        codeBlocks.forEach(block => {
            if (!blocksByMessage[block.messageIndex]) {
                blocksByMessage[block.messageIndex] = [];
            }
            blocksByMessage[block.messageIndex].push(block);
        });
        let isFirstMessage = true;
        Object.keys(blocksByMessage).sort((a, b) => parseInt(a) - parseInt(b)).forEach(messageIndex => {
            const blocks = blocksByMessage[messageIndex];
            if (!isFirstMessage) {
                const separator = document.createElement('div');
                separator.className = 'ds-message-separator';
                separator.textContent = blocks[0].messageTitle || `Mensagem ${parseInt(messageIndex) + 1}`;
                codeList.appendChild(separator);
            } else {
                isFirstMessage = false;
            }
            blocks.forEach(block => {
                const codeItem = document.createElement('div');
                codeItem.className = 'ds-code-item';
                codeItem.innerHTML = `
                    <input type="checkbox" class="ds-checkbox" id="code-${block.id}" data-id="${block.id}" ${block.hasDownloadButton ? '' : 'disabled'}>
                    <div class="ds-code-info">
                        <div class="ds-code-header">
                            <span class="ds-code-language">${block.language}</span>
                            <span class="ds-code-position">#${block.sequentialNumber}</span>
                        </div>
                        <div class="ds-code-name">${block.name || 'Sem nome'}</div>
                        <div class="ds-code-preview">${block.preview}</div>
                        ${!block.hasDownloadButton ? '<div style="color: #d93025; font-size: 11px; margin-top: 2px;">Sem botão de download</div>' : ''}
                    </div>
                `;
                const checkbox = codeItem.querySelector(`#code-${block.id}`);
                if (block.hasDownloadButton) {
                    checkbox.checked = true;
                }
                codeList.appendChild(codeItem);
                if (block.hasDownloadButton) {
                    checkbox.addEventListener('click', (e) => {
                        const allCodeListCheckboxes = Array.from(codeList.querySelectorAll('.ds-checkbox:not([disabled])'));
                        if (e.shiftKey && lastCheckedCheckbox) {
                            const start = allCodeListCheckboxes.indexOf(lastCheckedCheckbox);
                            const end = allCodeListCheckboxes.indexOf(e.target);
                            const range = allCodeListCheckboxes.slice(Math.min(start, end), Math.max(start, end) + 1);
                            range.forEach(cb => {
                                if (!cb.disabled) {
                                    cb.checked = e.target.checked;
                                }
                            });
                        }
                        lastCheckedCheckbox = e.target;
                        updateSelectedCount();
                        const allCheckboxes = Array.from(codeList.querySelectorAll('.ds-checkbox:not([disabled])'));
                        const allChecked = allCheckboxes.every(cb => cb.checked);
                        document.getElementById('ds-select-all').checked = allChecked;
                    });
                }
            });
        });
        updateSelectedCount();
        const allCheckboxes = Array.from(codeList.querySelectorAll('.ds-checkbox:not([disabled])'));
        const allChecked = allCheckboxes.every(cb => cb.checked);
        document.getElementById('ds-select-all').checked = allChecked;
    }
    async function downloadSelectedCode(selectedIds) {
        const codeBlocks = getCodeBlocks();
        const selectedBlocks = codeBlocks.filter(block => selectedIds.includes(block.id) && block.hasDownloadButton);
        
        if (selectedBlocks.length === 0) {
            showNotification('Nenhum bloco de código selecionado para download.');
            return;
        }
        const progressBar = document.querySelector('.ds-progress');
        const progressBarFill = document.querySelector('.ds-progress-bar');
        const progressText = document.querySelector('.ds-progress-text');
        progressBar.classList.add('active');
        progressText.textContent = `0/${selectedBlocks.length} concluído`;
        progressBarFill.style.width = '0%';
        for (let i = 0; i < selectedBlocks.length; i++) {
            const block = selectedBlocks[i];
            try {
                block.button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(resolve => setTimeout(resolve, 300));
                block.button.click();
                const progress = ((i + 1) / selectedBlocks.length) * 100;
                progressBarFill.style.width = `${progress}%`;
                progressText.textContent = `${i + 1}/${selectedBlocks.length} concluído`;
                await new Promise(resolve => setTimeout(resolve, 300));
                console.log(`Baixado bloco de código ${i + 1} de ${selectedBlocks.length}: ${block.name || 'Sem nome'}`);
            } catch (error) {
                console.error(`Erro ao baixar o bloco ${i + 1}:`, error);
            }
        }
        setTimeout(() => {
            progressBar.classList.remove('active');
            showNotification(`Download de ${selectedBlocks.length} blocos de código concluído.`);
        }, 2000);
    }
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #323232;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            opacity: 1;
            transition: opacity 0.5s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
    function hasCodeBlocks() {
        return document.querySelectorAll('pre, code, [class*="code"]').length > 0;
    }
    window.addEventListener('load', function() {
        setTimeout(createInterface, 2000);
    });
    setInterval(function() {
        if (!document.querySelector('.ds-mass-downloader') && hasCodeBlocks()) {
            createInterface();
        }
    }, 5000);
})();