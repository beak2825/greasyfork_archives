// ==UserScript==
// @name         Claude to Markdown
// @namespace    https://github.com/Aiuanyu/GeminiChat2MD
// @version      0.7
// @description  Converts a Claude chat conversation into a Markdown file.
// @author       Aiuanyu
// @match        https://claude.ai/chat/*
// @grant        none
// @license      MIT
// @history      0.7 2025-11-17 - Added support for hyperlinks.
// @history      0.6 2025-11-17 - Added changelog and updated feature comparison table.
// @history      0.5 2025-11-17 - Added support for parsing "Artifact" blocks.
// @history      0.4 2025-11-17 - Fixed handling of multi-part responses.
// @history      0.3 2025-11-17 - Switched to a more reliable selector for the chat title and simplified the code.
// @history      0.2 2025-11-17 - Fixed content extraction to include headings and moved the button to the bottom-right.
// @history      0.1 2025-11-17 - Initial release.
// @downloadURL https://update.greasyfork.org/scripts/560006/Claude%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/560006/Claude%20to%20Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = '0.7';

    function addStyles() {
        const css = `
            .download-markdown-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #1a73e8;
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .download-markdown-button:hover {
                background-color: #185abc;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }

    function createButton() {
        const button = document.createElement("button");
        button.innerText = "MD";
        button.title = "Download as Markdown";
        button.className = "download-markdown-button";
        button.onclick = downloadMarkdown;
        document.body.appendChild(button);
    }

    function getTitle() {
        const titleElement = document.querySelector('[data-testid="chat-title-button"] .truncate');
        if (titleElement) {
            return titleElement.textContent.trim();
        }
        return 'claude-chat';
    }

    function parseNode(node, listLevel = 0) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        let childMarkdown = '';
        node.childNodes.forEach(child => {
            childMarkdown += parseNode(child, listLevel);
        });

        switch (node.tagName.toLowerCase()) {
            case 'p':
                return `\n\n${childMarkdown.trim()}`;
            case 'h1':
                return `\n\n# ${childMarkdown.trim()}\n\n`;
            case 'h2':
                return `\n\n## ${childMarkdown.trim()}\n\n`;
            case 'h3':
                return `\n\n### ${childMarkdown.trim()}\n\n`;
            case 'h4':
                return `\n\n#### ${childMarkdown.trim()}\n\n`;
            case 'h5':
                return `\n\n##### ${childMarkdown.trim()}\n\n`;
            case 'h6':
                return `\n\n###### ${childMarkdown.trim()}\n\n`;
            case 'strong':
                return `**${childMarkdown}**`;
            case 'ul':
            case 'ol':
                let listContent = '';
                const indent = '    '.repeat(listLevel);
                Array.from(node.children).forEach((li, i) => {
                    const marker = node.tagName.toLowerCase() === 'ul' ? '*' : `${i + 1}.`;
                    let liText = '';
                    let nestedList = '';
                    li.childNodes.forEach(liChild => {
                        if (liChild.nodeType === Node.ELEMENT_NODE && ['ul', 'ol'].includes(liChild.tagName.toLowerCase())) {
                            nestedList += parseNode(liChild, listLevel + 1);
                        } else {
                            liText += parseNode(liChild, listLevel);
                        }
                    });
                    liText = liText.replace(/^\s*\n|\n\s*$/g, '');
                    listContent += `\n${indent}${marker} ${liText}${nestedList}`;
                });
                return listContent;
            case 'li':
                return childMarkdown;
            case 'code':
                return node.closest('pre') ? childMarkdown : `\`${childMarkdown}\``;
            case 'pre':
                const codeBlock = node.closest('.relative.group\\/copy');
                const langElement = codeBlock ? codeBlock.querySelector('.text-text-500.font-small') : null;
                const lang = langElement ? langElement.textContent.trim() : '';
                const code = node.querySelector('code');
                return `\n\n\`\`\`${lang}\n${code ? code.textContent.trim() : ''}\n\`\`\`\n\n`;
            case 'a':
                return `[${childMarkdown}](${node.href})`;
            default:
                return childMarkdown;
        }
    }

    function parseArtifactBlock(node) {
        const titleElement = node.querySelector('.leading-tight.text-sm.line-clamp-1');
        const previewElement = node.querySelector('.whitespace-pre-wrap.text-\\[0\\.3rem\\]');

        let markdown = '\n\n';
        if (titleElement) {
            markdown += `> **_${titleElement.textContent.trim()}_**\n>\n`;
        }
        if (previewElement) {
            const previewText = previewElement.textContent.trim().replace(/\n/g, '\n> ');
            markdown += `> ${previewText}\n\n`;
        }
        return markdown;
    }

    function extractContent() {
        const title = getTitle();

        let markdown = `---
parser: "Claude to Markdown v${SCRIPT_VERSION}"
title: "${title}"
url: "${window.location.href}"
tags:
  - Claude
---

# ${title}

`;

        // NOTE: The selectors used here are based on the current Claude UI (as of late 2023)
        // and may break if the UI is updated.
        const turns = document.querySelectorAll('div[data-test-render-count]');
        if (!turns || turns.length === 0) {
            console.error("Chat content not found.");
            return "Error: Could not find chat content.";
        }

        let userCount = 0;
        let claudeCount = 0;

        turns.forEach(turn => {
            const userQuery = turn.querySelector('div[data-testid="user-message"]');
            if (userQuery) {
                userCount++;
                markdown += `## User ${userCount}\n\n${parseNode(userQuery).trim()}\n\n`;
            }

            const responseContainer = turn.querySelector('.font-claude-response');
            if (responseContainer && responseContainer.children.length > 0) {
                claudeCount++;
                let claudeText = '';
                Array.from(responseContainer.children).forEach(child => {
                    if (child.querySelector('.standard-markdown')) {
                        claudeText += parseNode(child.querySelector('.standard-markdown')).trim() + '\n\n';
                    } else if (child.querySelector('.artifact-block-cell')) {
                        claudeText += parseArtifactBlock(child).trim() + '\n\n';
                    }
                });
                markdown += `## Claude ${claudeCount}\n${claudeText.trim()}\n\n`;
            }
        });

        return markdown.replace(/\n{3,}/g, '\n\n').trim();
    }

    function downloadMarkdown() {
        const markdownContent = extractContent();
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${getTitle()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Run the script
    const observer = new MutationObserver((mutations, obs) => {
        const readySelector = 'div[data-testid="user-message"]';
        if (document.querySelector(readySelector)) {
            addStyles();
            createButton();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
