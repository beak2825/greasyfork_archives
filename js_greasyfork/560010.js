// ==UserScript==
// @name         Jules to Markdown
// @namespace    https://github.com/Aiuanyu/GeminiChat2MD
// @version      0.8
// @description  Downloads a Jules chat log as a Markdown file.
// @author       Aiuanyu & Jules
// @match        https://jules.google.com/session/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560010/Jules%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/560010/Jules%20to%20Markdown.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const SCRIPT_VERSION = '0.8';

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
        // Use the document title for a filename.
        const title = document.title || 'Jules Chat';
        return title.substring(0, 100);
    }

    function extractContent() {
        const chatContainer = document.querySelector('.chat-container .chat-history');
        if (!chatContainer) {
            console.error("Jules chat container '.chat-container .chat-history' not found.");
            return "Error: Could not find Jules chat content.";
        }

        let markdown = `---
parser: "Jules to Markdown v${SCRIPT_VERSION}"
title: "${getSanitizedTitle()}"
url: "${window.location.href}"
tags:
  - Jules
---

`;

        const elements = chatContainer.children;
        let userMessageCount = 0;
        let agentMessageCount = 0;

        for (const el of elements) {
            const tagName = el.tagName.toLowerCase();
            if (tagName === 'swebot-user-chat-bubble') {
                userMessageCount++;
                markdown += handleUserMessage(el, userMessageCount);
            } else if (tagName === 'swebot-agent-chat-bubble') {
                agentMessageCount++;
                markdown += handleAgentMessage(el, agentMessageCount);
            } else if (tagName === 'swebot-plan') {
                markdown += handlePlan(el);
            } else if (tagName === 'swebot-progress-update-card') {
                markdown += handleProgressUpdate(el);
            } else if (tagName === 'swebot-code-diff-update-card') {
                markdown += handleCodeDiff(el);
            } else if (tagName === 'swebot-tool-code-output-card') {
                markdown += handleToolCodeOutput(el);
            } else if (tagName === 'swebot-file-tree-update-card') {
                markdown += handleFileTreeUpdate(el);
            } else if (tagName === 'swebot-critic-card') {
                markdown += handleCriticCard(el);
            } else if (tagName === 'swebot-submission-card') {
                markdown += handleSubmissionCard(el);
            } else if (tagName === 'swebot-status-pill') {
                markdown += `> ${el.textContent.trim()}\n\n`;
            } else if (el.classList.contains('timestamp')) {
                markdown += `\n*${el.textContent.trim()}*\n\n`;
            } else if (el.classList.contains('step-description-card')) {
                markdown += handleStepDescriptionCard(el);
            }
        }
        return markdown.replace(/\n{3,}/g, '\n\n').trim();
    }

    function htmlToMarkdown(element) {
        if (!element) return '';
        let markdown = '';
        element.childNodes.forEach(node => {
            markdown += nodeToMarkdown(node);
        });
        return markdown.replace(/\n\s*\n/g, '\n\n').trim();
    }

    function nodeToMarkdown(node, listLevel = 0) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        const el = node;
        const tagName = el.tagName.toLowerCase();
        const indentation = '    '.repeat(listLevel);

        // Special handling for lists
        if (tagName === 'ul' || tagName === 'ol') {
            let list_items = '';
            let item_number = 1;
            el.childNodes.forEach(li => {
                if (li.nodeName === 'LI') {
                    const marker = tagName === 'ul' ? '*' : `${item_number++}.`;
                    // Process children of li, and check if it contains a nested list
                    let liContent = '';
                    let hasNestedList = false;
                    li.childNodes.forEach(child => {
                        if (child.nodeType === Node.ELEMENT_NODE && (child.tagName.toLowerCase() === 'ul' || child.tagName.toLowerCase() === 'ol')) {
                            hasNestedList = true;
                        }
                        liContent += nodeToMarkdown(child, listLevel + 1);
                    });

                    if (hasNestedList) {
                        // Add a newline before the nested list for proper rendering
                        list_items += `${indentation}${marker} ${liContent.trim()}\n`;
                    } else {
                        list_items += `${indentation}${marker} ${liContent.trim()}\n`;
                    }
                }
            });
            return `\n${list_items}`;
        }

        // General element processing
        let childrenMarkdown = '';
        el.childNodes.forEach(child => {
            childrenMarkdown += nodeToMarkdown(child, listLevel);
        });

        switch (tagName) {
            case 'p': return childrenMarkdown + '\n\n';
            case 'a': return `[${childrenMarkdown}](${el.href})`;
            case 'strong': case 'b': return `**${childrenMarkdown}**`;
            case 'em': case 'i': return `*${childrenMarkdown}*`;
            case 'code': return el.closest('pre') ? childrenMarkdown : `\`${childrenMarkdown}\``;
            case 'br': return '\n';
            case 'hr': return '\n---\n';
            case 'h3': return `### ${childrenMarkdown}\n\n`;
            case 'blockquote':
                return childrenMarkdown.split('\n').filter(line => line.trim()).map(line => `> ${line}`).join('\n') + '\n\n';
            case 'li': return childrenMarkdown; // Let the ul/ol handler do the trimming
            case 'pre':
                 const code = el.querySelector('code');
                 const lang = code ? (code.className.match(/language-(\S+)/) || [])[1] || '' : '';
                 return `\n\`\`\`${lang}\n${code ? code.textContent.trim() : el.textContent.trim()}\n\`\`\`\n\n`;
            default: return childrenMarkdown;
        }
    }


    function handleUserMessage(el, count) {
        const messageEl = el.querySelector('.message.normalize-headings .markdown');
        if (!messageEl) return '';
        const content = htmlToMarkdown(messageEl);
        // Apply blockquote line by line
        const quotedContent = content.split('\n').map(line => `> ${line}`).join('\n');
        return `## User ${count}\n\n${quotedContent}\n\n`;
    }

    function handleAgentMessage(el, count) {
        const messageEl = el.querySelector('.message.normalize-headings .markdown');
        if (!messageEl) return '';
        return `## Jules ${count}\n\n${htmlToMarkdown(messageEl)}\n\n`;
    }

    function handlePlan(el) {
        let markdown = '## Plan\n\n';
        const steps = el.querySelectorAll('swebot-expansion-panel-row');
        steps.forEach(step => {
            const number = step.querySelector('.step-number-icon')?.textContent?.trim();
            const titleEl = step.querySelector('.step-title-text .markdown');
            const descriptionEl = step.querySelector('.step-description .markdown');

            if (number && titleEl) {
                markdown += `${number}. ${htmlToMarkdown(titleEl)}\n`;
                if (descriptionEl && descriptionEl.textContent.trim()) {
                    markdown += `    > ${htmlToMarkdown(descriptionEl).replace(/\n/g, '\n    > ')}\n`;
                }
            }
        });
        return markdown + '\n';
    }

    function handleProgressUpdate(el) {
        const titleEl = el.querySelector('.progress-update-card-title .markdown');
        const descriptionEl = el.querySelector('.progress-update-card-description .markdown');
        const icon = el.getAttribute('icon');
        let title = 'Action';
        if(icon === 'public') title = 'Reading documentation';
        if(icon === 'build') title = 'Running command';
        if(icon === 'list_alt_check') title = 'Running code review';

        let markdown = `> [!info] **${title}**\n`;
        if (titleEl) {
            markdown += `> ${htmlToMarkdown(titleEl)}\n`;
        }
        if (descriptionEl && descriptionEl.textContent.trim()) {
            markdown += `> ${htmlToMarkdown(descriptionEl)}\n`;
        }
        return markdown + '\n';
    }

    function handleCodeDiff(el) {
        const summaryEl = el.querySelector('.summary');
        if (!summaryEl) return '';

        let parts = [];
        summaryEl.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                parts.push(node.textContent);
            } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('file-name')) {
                parts.push(`\`${node.textContent.trim()}\``);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                parts.push(node.textContent);
            }
        });

        const summaryText = parts.join(' ').replace(/\s+/g, ' ').trim();

        if (!summaryText) return '';

        return `> [!note] **Code Change**\n> ${summaryText}\n\n`;
    }

    function handleToolCodeOutput(el) {
        const codeEl = el.querySelector('pre code');
        if (!codeEl) return '';
        const lang = (codeEl.className.match(/language-(\S+)/) || [])[1] || '';
        return `> [!dev] **Tool Output**\n\`\`\`${lang}\n${codeEl.textContent.trim()}\n\`\`\`\n\n`;
    }

    function handleFileTreeUpdate(el) {
        const content = el.querySelector('.file-tree-diff-card');
        if (!content) return '';
        return `> [!note] **File Tree Update**\n\`\`\`\n${content.textContent.trim()}\n\`\`\`\n\n`;
    }

    function handleCriticCard(el) {
        const title = el.getAttribute('title') || 'Code Review';
        const contentEl = el.querySelector('.critic-output .markdown');
        if (!contentEl) return '';
        return `## ${title}\n\n${htmlToMarkdown(contentEl)}\n\n`;
    }

    function handleSubmissionCard(el) {
        const headerEl = el.querySelector('.header-text');
        const addedEl = el.querySelector('.num-lines.added');
        const removedEl = el.querySelector('.num-lines.removed');
        const runtimeEl = el.querySelector('.total-runtime');

        let markdown = '### ';
        markdown += (headerEl ? headerEl.textContent.trim() : 'Submission') + '\n\n';

        let details = [];
        // This data is not available in the static DOM, so we add a placeholder.
        details.push(`**Branch:** \`[Manual copy-paste required]\``);

        if (addedEl && removedEl) {
            details.push(`**Lines:** ${addedEl.textContent.trim()}/${removedEl.textContent.trim()}`);
        }
        if (runtimeEl) {
            details.push(`**Time:** ${runtimeEl.textContent.trim()}`);
        }

        if (details.length > 0) {
            markdown += `> ${details.join(' | ')}\n\n`;
        }

        // The commit message is also dynamically rendered and not available in a static attribute.
        markdown += `**Commit Message:**\n\`\`\`\n[Manual copy-paste required]\n\`\`\`\n`;

        return markdown + '\n';
    }

    function handleStepDescriptionCard(el) {
        const descriptionEl = el.querySelector('.step-description');
        if (!descriptionEl) return '';

        const content = htmlToMarkdown(descriptionEl);
        // Apply blockquote line by line
        const quotedContent = content.split('\n').map(line => `> ${line}`).join('\n');
        return `> [!note]\n${quotedContent}\n\n`;
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
        // The main chat container in Jules is '.chat-history'
        if (document.querySelector('.chat-history')) {
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