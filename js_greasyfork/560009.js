// ==UserScript==
// @name         GitHub PR to Markdown
// @namespace    https://github.com/Aiuanyu/GeminiChat2MD
// @version      0.3
// @description  Downloads a GitHub pull request conversation as a Markdown file.
// @author       Aiuanyu & Jules
// @match        https://github.com/*/*/pull/*
// @grant        none
// @license      MIT
// @history      0.3 2025-12-21 - Added a dialog to set the title before downloading.
// @history      0.2 Initial release with PR conversation extraction
// @history      0.1 Development version
// @downloadURL https://update.greasyfork.org/scripts/560009/GitHub%20PR%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/560009/GitHub%20PR%20to%20Markdown.meta.js
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
                background-color: #2da44e; /* GitHub Green */
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
                background-color: #2c974b;
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
        const titleElement = document.querySelector('.gh-header-title .js-issue-title');
        const prNumber = document.querySelector('.gh-header-title .f1-light')?.textContent?.trim() || '';
        const title = titleElement ? titleElement.textContent.trim() : 'GitHub PR';
        return `${prNumber.replace('#', '')} ${title}`;
    }

    function sanitizeFilename(name) {
        return name.replace(/[\/\\?%*:|"<>]/g, '-');
    }

    function escapeYamlString(str) {
        return str.replace(/"/g, '\\"');
    }

    function showTitlePrompt(defaultTitle, callback) {
        let title = prompt("Enter the title for the Markdown file:", defaultTitle);
        if (title === null) {
            return; // User cancelled
        }
        if (title.trim() === '') {
            title = defaultTitle;
        }
        callback(title);
    }

    function nodeToMarkdown(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        const el = node;
        let childrenMarkdown = '';
        el.childNodes.forEach(child => {
            childrenMarkdown += nodeToMarkdown(child);
        });

        const tagName = el.tagName.toLowerCase();

        switch (tagName) {
            case 'p': return childrenMarkdown + '\n\n';
            case 'a':
                // Handle user/issue mentions
                if (el.classList.contains('issue-link')) {
                    return `[${childrenMarkdown}](${el.href})`;
                }
                return `[${childrenMarkdown}](${el.href})`;
            case 'strong': case 'b': return `**${childrenMarkdown}**`;
            case 'em': case 'i': return `*${childrenMarkdown}*`;
            case 'del': return `~~${childrenMarkdown}~~`;
            case 'code': return el.closest('pre') ? childrenMarkdown : `\`${childrenMarkdown}\``;
            case 'br': return '\n';
            case 'ul':
                let ul_items = '';
                el.childNodes.forEach(li => {
                    if (li.nodeName === 'LI') ul_items += `* ${nodeToMarkdown(li).trim()}\n`;
                });
                return ul_items;
            case 'ol':
                let ol_items = '';
                let itemIndex = 1;
                el.childNodes.forEach(li => {
                    if (li.nodeName === 'LI') ol_items += `${itemIndex++}. ${nodeToMarkdown(li).trim()}\n`;
                });
                return ol_items;
            case 'li': return `${childrenMarkdown}`;
            case 'pre':
                const lang = (el.querySelector('code')?.className.match(/language-(\S+)/) || [])[1] || '';
                return `\n\`\`\`${lang}\n${el.textContent.trim()}\n\`\`\`\n\n`;
            case 'blockquote':
                return `> ${childrenMarkdown.replace(/\n/g, '\n> ')}\n\n`;
            case 'h1': return `# ${childrenMarkdown}\n\n`;
            case 'h2': return `## ${childrenMarkdown}\n\n`;
            case 'h3': return `### ${childrenMarkdown}\n\n`;
            case 'h4': return `#### ${childrenMarkdown}\n\n`;
            case 'hr': return '---\n\n';
            case 'table':
                let tableMd = '';
                const headers = Array.from(el.querySelectorAll('thead th, th')).map(th => th.textContent.trim());
                if (headers.length > 0) {
                    tableMd += `| ${headers.join(' | ')} |\n`;
                    tableMd += `| ${headers.map(() => '---').join(' | ')} |\n`;
                }
                const rows = el.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cells = Array.from(row.querySelectorAll('td')).map(td => htmlToMarkdown(td).trim().replace(/\n/g, '<br>'));
                    tableMd += `| ${cells.join(' | ')} |\n`;
                });
                return tableMd + '\n';
            default: return childrenMarkdown;
        }
    }

    function htmlToMarkdown(element) {
        if (!element) return '';
        let markdown = '';
        element.childNodes.forEach(node => {
            markdown += nodeToMarkdown(node);
        });
        return markdown.replace(/\n\s*\n/g, '\n\n').trim();
    }

    function handleCommit(el) {
        const titleEl = el.querySelector('.TimelineItem-body code a');
        const commitHash = el.querySelector('.TimelineItem-body .text-right a')?.textContent.trim() || '';
        if (!titleEl) return '';

        const title = titleEl.title || titleEl.textContent.trim();
        const description = title.split('\n\n').slice(1).join('\n\n');

        let markdown = `> [!commit] **Commit: \`${commitHash}\`**\n`;
        markdown += `> **${title.split('\n\n')[0]}**\n`;
        if (description) {
            markdown += `>\n> ${description.replace(/\n/g, '\n> ')}\n`;
        }
        return markdown + '\n';
    }

    function handleSystemEvent(el) {
        const text = el.querySelector('.TimelineItem-body')?.textContent.trim().replace(/\s+/g, ' ');
        if (!text) return '';
        return `> *System Event: ${text}*\n\n`;
    }

    function extractContent(title) {
        const titleEl = document.querySelector('.gh-header-title .js-issue-title');
        const prNumber = document.querySelector('.gh-header-title .f1-light')?.textContent?.trim() || '';
        const author = document.querySelector('.gh-header-meta .author')?.textContent.trim() || 'unknown';
        const status = document.querySelector('.gh-header-meta .State')?.textContent.trim() || 'unknown';
        const labels = Array.from(document.querySelectorAll('.js-issue-labels .IssueLabel')).map(l => l.textContent.trim());
        const headRef = document.querySelector('.head-ref')?.textContent.trim() || 'unknown';
        const baseRef = document.querySelector('.base-ref')?.textContent.trim() || 'unknown';

        let markdown = `---
parser: "GitHub PR to Markdown v${SCRIPT_VERSION}"
title: "${escapeYamlString(title)}"
number: ${prNumber.replace('#', '')}
url: "${window.location.href}"
author: ${author}
status: "${status}"
head: "${headRef}"
base: "${baseRef}"
labels: [${labels.map(l => `"${l.replace(/"/g, '\\"')}"`).join(', ')}]
---

# PR: ${title} (${prNumber})

`;

        const timeline = document.querySelectorAll('#discussion_bucket .TimelineItem');
        let commentCount = 0;

        for (const item of timeline) {
            // Regular comments and the PR description
            if (item.querySelector('.timeline-comment-group')) {
                commentCount++;
                const author = item.querySelector('.author')?.textContent.trim() || 'Unknown';
                const timestamp = item.querySelector('relative-time')?.getAttribute('datetime') || '';
                const body = item.querySelector('.comment-body');
                if (!body) continue;

                if (commentCount === 1) {
                    markdown += `## Description\n\n_By ${author} on ${timestamp}_\n\n`;
                } else {
                    markdown += `## Comment ${commentCount - 1}\n\n_By ${author} on ${timestamp}_\n\n`;
                }
                markdown += htmlToMarkdown(body) + '\n\n---\n\n';
            }
            // Commit Messages
            else if (item.querySelector('.octicon-git-commit')) {
                 markdown += handleCommit(item);
            }
            // System events like adding labels, etc.
            else if (item.querySelector('.TimelineItem-badge .octicon-cross-reference, .TimelineItem-badge .octicon-tag')) {
                 markdown += handleSystemEvent(item);
            }
        }

        return markdown.replace(/\n{3,}/g, '\n\n').trim();
    }

    function downloadMarkdown() {
        const defaultTitle = getSanitizedTitle();
        showTitlePrompt(defaultTitle, (title) => {
            const markdownContent = extractContent(title);
            const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${sanitizeFilename(title)}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Use a MutationObserver to wait for the page to be ready
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.gh-header-title')) {
            addStyles();
            createButton();
            obs.disconnect(); // Stop observing once the element is found
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();