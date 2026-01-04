// ==UserScript==
// @name         PTT to Markdown
// @namespace    https://github.com/Aiuanyu/GeminiChat2MD
// @version      0.3
// @description  Downloads a PTT article and comments as a Markdown file.
// @author       Aiuanyu & Jules
// @match        https://www.ptt.cc/bbs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560011/PTT%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/560011/PTT%20to%20Markdown.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const SCRIPT_VERSION = '0.3';

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

    function getSanitizedTitle() {
        const metaTitle = Array.from(document.querySelectorAll('.article-metaline .article-meta-tag'))
            .find(el => el.textContent.trim() === '標題');

        if (metaTitle) {
            const titleValue = metaTitle.nextElementSibling.textContent.trim();
            return titleValue.replace(/^Re: /, '').substring(0, 50);
        }

        // Fallback using URL
        const match = window.location.pathname.match(/bbs\/(.+)\/(M\..+\.A\..+)\.html/);
        if (match) {
            return `${match[1]}-${match[2]}`;
        }
        return 'ptt-article';
    }

    function extractContent() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error("PTT content container '#main-content' not found.");
            return "Error: Could not find PTT content.";
        }

        let markdown = '';
        const meta = {};
        mainContent.querySelectorAll('.article-metaline, .article-metaline-right').forEach(line => {
            const tag = line.querySelector('.article-meta-tag')?.textContent?.trim();
            const value = line.querySelector('.article-meta-value')?.textContent?.trim();
            if (tag && value) {
                meta[tag] = value;
            }
        });

        const title = meta['標題'] || getSanitizedTitle();
        markdown += `---
parser: "PTT to Markdown v${SCRIPT_VERSION}"
title: "${title}"
url: "${window.location.href}"
tags:
  - PTT
---

`;

        markdown += `# ${meta['標題'] || 'No Title'}\n\n`;
        markdown += `**作者:** ${meta['作者'] || 'N/A'}\n`;
        markdown += `**看板:** ${meta['看板'] || 'N/A'}\n`;
        markdown += `**時間:** ${meta['時間'] || 'N/A'}\n\n`;
        markdown += '---\n\n';

        const nodes = mainContent.childNodes;
        let inPushTable = false;
        let textBuffer = '';
        let currentQuoteLevel = 0;

        const flushTextBuffer = () => {
            const trimmedBuffer = textBuffer.trim();
            if (trimmedBuffer) {
                if (currentQuoteLevel > 0) {
                    markdown += '\n';
                    currentQuoteLevel = 0;
                }
                markdown += trimmedBuffer + '\n\n';
            }
            textBuffer = '';
        };

        const getQuoteInfo = (node) => {
            const text = node.textContent;
            const isHeader = text.includes('※ 引述');

            let level = 0;
            let content = text;

            if (node.matches('.f2')) {
                level = 1;
            } else if (node.matches('.f6')) {
                const indentMatch = text.match(/^(: *)+/);
                const numColons = indentMatch ? (indentMatch[0].match(/:/g) || []).length : 0;
                level = numColons + (isHeader ? 1 : 0);
                if (level === 0) level = 1;
            }

            content = text.replace(/^(:| |※)+/, '').trim();
            if (isHeader) {
                content = `[!quote] ${content.replace(/^引述/, '').trim()}`;
            }

            return { level, content };
        };

        for (const node of nodes) {
            if (node.nodeType === Node.ELEMENT_NODE && node.matches('.article-metaline, .article-metaline-right')) {
                continue;
            }
            if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
                continue;
            }

            const isQuote = node.nodeType === Node.ELEMENT_NODE && (node.matches('.f2, .f6'));
            const isPush = node.nodeType === Node.ELEMENT_NODE && node.matches('.push');

            if (isQuote) {
                if (inPushTable) {
                    markdown += '\n'; // End of table
                    inPushTable = false;
                }
                flushTextBuffer();
                const { level, content } = getQuoteInfo(node);
                if (level > 0) {
                    if (currentQuoteLevel > 0 && level < currentQuoteLevel) {
                        markdown += '> '.repeat(level) + '\n';
                    }
                    markdown += '> '.repeat(level) + content + '\n';
                    currentQuoteLevel = level;
                }
                continue;
            }

            if (isPush) {
                if (currentQuoteLevel > 0) {
                    markdown += '\n'; // End of quote
                    currentQuoteLevel = 0;
                }
                flushTextBuffer();
                if (!inPushTable) {
                    markdown += '|  | ID |  | 時間 |\n';
                    markdown += '|---|---|---|---|\n';
                    inPushTable = true;
                }
                const tag = (node.querySelector('.push-tag')?.textContent ?? '').trim();
                const user = (node.querySelector('.push-userid')?.textContent ?? '').trim();
                const pushContent = ((node.querySelector('.push-content')?.textContent ?? '').replace(/^: /, '').trim() ?? '').replace(/\|/g, '\\|');
                const time = (node.querySelector('.push-ipdatetime')?.textContent ?? '').trim();
                markdown += `| ${tag} | ${user} | ${pushContent} | ${time} |\n`;
                continue;
            }

            // Not a quote or a push, end any open blocks
            if (currentQuoteLevel > 0) {
                markdown += '\n';
                currentQuoteLevel = 0;
            }
            if (inPushTable) {
                markdown += '\n';
                inPushTable = false;
            }

            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '--') {
                flushTextBuffer();
                markdown += '---\n\n';
            }
            else {
                textBuffer += node.textContent || '';
            }
        }

        flushTextBuffer();
        if (currentQuoteLevel > 0) markdown += '\n';
        if (inPushTable) markdown += '\n';

        return markdown.replace(/\n{3,}/g, '\n\n').trim();
    }

    function downloadMarkdown() {
        const markdownContent = extractContent();
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${getSanitizedTitle()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Run the script
    const observer = new MutationObserver((mutations, obs) => {
        if (document.getElementById('main-content')) {
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