// ==UserScript==
// @name         Claude Code Web to Markdown
// @namespace    https://github.com/Aiuanyu/GeminiChat2MD
// @version      0.1
// @description  Converts a Claude Code Web chat conversation into a Markdown file.
// @author       Aiuanyu
// @match        https://claude.ai/code/*
// @grant        none
// @license      MIT
// @history      0.1 2025-11-29 - Initial release.
// @downloadURL https://update.greasyfork.org/scripts/560005/Claude%20Code%20Web%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/560005/Claude%20Code%20Web%20to%20Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = '0.1';

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
        // Try to find the title button
        // We look for buttons with 'font-base-bold' but exclude small text ones (Active session, Select repo)
        const candidates = document.querySelectorAll('button[aria-haspopup="menu"].font-base-bold');

        for (const button of candidates) {
            // "Active" session button has 'text-xs'
            // "Select repository" button has '!text-xs'
            if (button.classList.contains('text-xs') || button.classList.contains('!text-xs')) {
                continue;
            }

            // This should be the title button
            const clone = button.cloneNode(true);
            // Remove SVG icons which might add noise
            clone.querySelectorAll('svg').forEach(svg => svg.remove());
            const text = clone.textContent.trim();
            if (text) return text;
        }

        return document.title.replace(' | Claude', '') || 'claude-code-web';
    }

    function parseTable(tableElement) {
        let markdown = '\n\n';
        const headerRows = tableElement.querySelectorAll('thead tr');
        headerRows.forEach(row => {
            const headers = Array.from(row.querySelectorAll('th, td')).map(cell => parseNode(cell).trim());
            markdown += `| ${headers.join(' | ')} |\n`;
            markdown += `| ${headers.map(() => '---').join(' | ')} |\n`;
        });

        const bodyRows = tableElement.querySelectorAll('tbody tr');
        bodyRows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td')).map(cell => parseNode(cell).trim().replace(/\|/g, '\\|'));
            markdown += `| ${cells.join(' | ')} |\n`;
        });

        return markdown;
    }

    function parseNode(node, listLevel = 0) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (text.trim() === '[Request interrupted by user]') {
                return `> [!warn] Request interrupted by user`;
            }
            return text;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        // Handle Details/Summary (Command Output)
        if (node.tagName.toLowerCase() === 'details') {
            const summary = node.querySelector('summary');
            const summaryText = summary ? summary.textContent.trim() : 'Details';
            // The content is usually in a div inside details, excluding summary
            // In Claude Code Web, the output is often in a div following summary.
            let contentText = '';
            Array.from(node.children).forEach(child => {
                if (child.tagName.toLowerCase() !== 'summary') {
                    contentText += child.textContent + '\n';
                }
            });

            // Use HTML details tag but wrap content in code block for formatting
            return `\n\n<details><summary>${summaryText}</summary>\n\n\`\`\`\n${contentText.trim()}\n\`\`\`\n</details>\n\n`;
        }

        let childMarkdown = '';
        node.childNodes.forEach(child => {
            childMarkdown += parseNode(child, listLevel);
        });

        // Claude Code Web Specific Classes
        if (node.classList.contains('font-bold') && node.classList.contains('text-text-300')) {
             // e.g. "Bash", "Read" labels
             return `**${childMarkdown}** `;
        }
        if (node.classList.contains('font-mono') && node.classList.contains('text-text-500')) {
            // e.g. command line
            return `\`${childMarkdown}\``;
        }
        if (node.classList.contains('bg-bg-200') && node.classList.contains('rounded')) {
             // inline code background
             // Check if it's already wrapped in backticks by child processing?
             // Often it contains a code element or span.
             // If childMarkdown isn't already backticked, backtick it.
             if (!childMarkdown.trim().startsWith('`')) {
                 return `\`${childMarkdown}\``;
             }
             return childMarkdown;
        }

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
            case 'b':
                return `**${childMarkdown}**`;
            case 'em':
            case 'i':
                return `*${childMarkdown}*`;
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
                const langClass = node.className || '';
                // Try to extract language from class or context if possible,
                // but standard simple code block is fine.
                return `\n\n\`\`\`\n${childMarkdown.trim()}\n\`\`\`\n\n`;
            case 'table':
                return parseTable(node);
            case 'a':
                return `[${childMarkdown}](${node.href})`;
            default:
                return childMarkdown;
        }
    }

    function parseStep(stepNode) {
        // Structure: div.flex.items-start.gap-1.text-sm
        // It has a dot (●) and content.
        const contentDiv = stepNode.querySelector('.break-words.min-w-0.flex-1');
        if (!contentDiv) return parseNode(stepNode);

        // Check if it's a command execution
        const commandDiv = contentDiv.querySelector('.flex.flex-col.gap-1');

        let markdown = '> '; // Use blockquote for steps

        if (commandDiv) {
            // It's likely a command
            // The first child is usually the command line
            const commandLine = commandDiv.firstElementChild;
            if (commandLine) {
                 markdown += parseNode(commandLine).trim() + '\n';
            }

            // Subsequent children are output/details
            const outputs = Array.from(commandDiv.children).slice(1);
            outputs.forEach(output => {
                // Check for the "└" symbol which indicates output
                if (output.textContent.includes('└')) {
                     // The actual output content is usually next to the └ symbol or inside
                     // We can just parse the whole thing, it should handle details/summary
                     const outputText = parseNode(output).replace('└', '').trim();
                     markdown += '> ' + outputText.replace(/\n/g, '\n> ') + '\n';
                } else {
                     markdown += '> ' + parseNode(output).replace(/\n/g, '\n> ') + '\n';
                }
            });
        } else {
            // Just text log
            markdown += parseNode(contentDiv).replace(/\n/g, '\n> ');
        }

        return markdown + '\n\n';
    }

    function extractContent() {
        const title = getTitle();

        let markdown = `---
parser: "Claude Code Web to Markdown v${SCRIPT_VERSION}"
title: "${title}"
url: "${window.location.href}"
tags:
  - Claude_Code_Web
---

# ${title}

`;

        // Find the main chat container
        // We look for a Claude message bubble class `px-3 mb-1` and get its parent's parent usually
        // But the structure is: Container > Turn > Bubble
        // Claude Turn: div.px-3.mb-1 (This IS the turn container for Claude?)
        // User Turn: div.flex.flex-col.gap-2 (This IS the turn container for User?)
        // Let's verify with the provided HTML snippet.
        // <div class="flex flex-col gap-4"> (Main)
        //   <div class="flex flex-col gap-2"> (User Turn) ... </div>
        //   <div class="px-3 mb-1"> (Claude Turn) ... </div>
        // </div>

        // So we need to find the container that holds these.
        // We can search for all `div.px-3.mb-1` and find the common parent.
        const claudeTurns = document.querySelectorAll('div.px-3.mb-1');
        let container = null;
        if (claudeTurns.length > 0) {
            container = claudeTurns[0].parentElement;
        } else {
            // Maybe only user messages exist?
            const userTurns = document.querySelectorAll('div.flex.flex-col.gap-2');
            if (userTurns.length > 0) {
                // This selector is very generic, verify if it has the specific user bubble inside
                // User Bubble: div.bg-bg-200.rounded-lg.px-3.py-2.font-base.text-text-000
                for (let i = 0; i < userTurns.length; i++) {
                    if (userTurns[i].querySelector('div.bg-bg-200.rounded-lg.px-3.py-2.font-base.text-text-000')) {
                        container = userTurns[i].parentElement;
                        break;
                    }
                }
            }
        }

        if (!container) {
            console.error("Chat content not found.");
            return "Error: Could not find chat content.";
        }

        let userCount = 0;
        let claudeCount = 0;

        Array.from(container.children).forEach(child => {
            // Identify User Turn
            // Selector: div.flex.flex-col.gap-2 AND contains the user bubble
            if (child.classList.contains('gap-2') && child.querySelector('div.bg-bg-200.rounded-lg.px-3.py-2.font-base.text-text-000')) {
                userCount++;
                markdown += `## User ${userCount}\n\n`;
                // The content is inside the bubble
                const bubble = child.querySelector('div.bg-bg-200.rounded-lg.px-3.py-2.font-base.text-text-000');
                markdown += parseNode(bubble).trim() + '\n\n';
            }
            // Identify Claude Turn
            // Selector: div.px-3.mb-1
            else if (child.classList.contains('px-3') && child.classList.contains('mb-1')) {
                claudeCount++;
                markdown += `## Claude ${claudeCount}\n\n`;

                // Claude's turn contains a list of items (steps or text)
                // The container for items is usually `div.flex.flex-col.gap-4` inside the turn
                const contentContainer = child.querySelector('div.flex.flex-col.gap-4');
                if (contentContainer) {
                    Array.from(contentContainer.children).forEach(item => {
                        // Check if it's a step (has the dot ●)
                        // Selector: div.flex.items-start.gap-1.text-sm
                        if (item.classList.contains('flex') && item.classList.contains('items-start') && item.classList.contains('gap-1') && item.classList.contains('text-sm')) {
                             markdown += parseStep(item);
                        } else {
                             // Regular text or other content
                             markdown += parseNode(item).trim() + '\n\n';
                        }
                    });
                } else {
                    // Fallback if structure is different
                    markdown += parseNode(child).trim() + '\n\n';
                }
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
        // Wait for at least one Claude response or User message to appear
        const readySelector = 'div.px-3.mb-1, div.bg-bg-200.rounded-lg.px-3.py-2';
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
