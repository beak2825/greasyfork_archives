// ==UserScript==
// @name         Threads to Markdown
// @namespace    https://github.com/Aiuanyu/GeminiChat2MD
// @version      0.5
// @description  Downloads a Threads profile's posts as a Markdown file.
// @author       Aiuanyu & Jules
// @match        https://www.threads.net/*
// @match        https://www.threads.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560012/Threads%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/560012/Threads%20to%20Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = '0.5';

    function formatDate(datetimeString) {
        // Create a date object from the ISO string
        const date = new Date(datetimeString);

        // Convert to UTC+8
        const targetDate = new Date(date.getTime() + (8 * 60 * 60 * 1000));

        const year = targetDate.getUTCFullYear();
        const month = (targetDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = targetDate.getUTCDate().toString().padStart(2, '0');

        const week = ['日', '一', '二', '三', '四', '五', '六'];
        const weekDay = `週${week[targetDate.getUTCDay()]}`;

        const hours = targetDate.getUTCHours().toString().padStart(2, '0');
        const minutes = targetDate.getUTCMinutes().toString().padStart(2, '0');

        return `${year}${month}${day} ${weekDay} ${hours}:${minutes}`;
    }


    function addStyles() {
        const css = `
            .download-markdown-button {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #000000;
                color: white;
                border: 1px solid white;
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
                background-color: #333333;
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
        const h1 = document.querySelector('h1');
        const authorName = h1 ? h1.textContent.trim() : '';

        const usernameMatch = window.location.pathname.match(/@([^/]+)/);
        const username = usernameMatch ? usernameMatch[1] : 'profile';

        const title = authorName ? `${authorName} (${username})` : username;

        return `Threads-${title}`.substring(0, 100);
    }

    function extractContent() {
        const h1 = document.querySelector('h1');
        const authorName = h1 ? h1.textContent.trim() : 'N/A';
        const profileUrl = window.location.href;

        const bioEl = document.querySelector('.xw7yly9');
        const bio = bioEl ? bioEl.textContent.trim() : '';

        const isProfilePage = window.location.pathname.includes('/@');

        const title = getSanitizedTitle();
        let markdown = `---
parser: "Threads to Markdown v${SCRIPT_VERSION}"
title: "${title}"
url: "${profileUrl}"
tags:
  - ${isProfilePage ? 'Threads/profile' : 'Threads'}
---

`;

        markdown += `# ${authorName}\n\n`;
        if (bio) {
            markdown += `${bio}\n\n---\n\n`;
        }

        const allPostContainers = Array.from(document.querySelectorAll('div[data-pressable-container="true"]'));
        const postElements = allPostContainers.filter(p => {
            return p.querySelector('time[datetime]') && !p.parentElement.closest('div[data-pressable-container="true"]');
        });

        let postCount = 0;
        postElements.forEach(post => {
            postCount++;
            const timeEl = post.querySelector('time');
            if (!timeEl) return;

            const datetime = timeEl.getAttribute('datetime');
            const postLinkEl = timeEl.closest('a');
            const postUrl = postLinkEl ? postLinkEl.href : 'No permalink found';

            markdown += `## Post ${postCount}: ${formatDate(datetime)}\n\n`;

            // --- Metadata ---
            const likesEl = post.querySelector('[aria-label="讚"]');
            const likesCount = likesEl ? (likesEl.nextElementSibling?.textContent.trim() || '0') : '0';

            const repliesEl = post.querySelector('[aria-label="回覆"]');
            const repliesCount = repliesEl ? (repliesEl.nextElementSibling?.textContent.trim() || '0') : '0';

            const repostsEl = post.querySelector('[aria-label="轉發"]');
            const repostsCount = repostsEl ? (repostsEl.nextElementSibling?.textContent.trim() || '0') : '0';

            const hashtags = Array.from(post.querySelectorAll('a[href*="serp_type=tags"]')).map(el => `[#${el.textContent.trim()}](${el.href})`);

            markdown += `**Metadata:**\n`;
            markdown += `- **Permalink:** [${postUrl}](${postUrl})\n`;
            markdown += `- **Likes:** ${likesCount}\n`;
            markdown += `- **Replies:** ${repliesCount}\n`;
            markdown += `- **Shares/Reposts:** ${repostsCount}\n`;
             if (hashtags.length > 0) {
                 markdown += `- **Hashtags:** ${hashtags.join(' ')}\n`;
            }
            markdown += `\n`;


            // --- Text Content ---
            const contentContainer = post.querySelector('div.x1a6qonq');
            if (contentContainer) {
                const tempContainer = contentContainer.cloneNode(true);

                tempContainer.querySelectorAll('div.x1rg5ohu').forEach(indicatorNode => {
                    const indicatorText = indicatorNode.textContent.replace(/\s/g, '');
                    if (indicatorText.match(/\d+\/\d+/)) {
                        indicatorNode.replaceWith(' `' + indicatorText + '`');
                    }
                });

                let contentHTML = tempContainer.innerHTML;
                contentHTML = contentHTML.replace(/<br\s*\/?>/gi, '\n');
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = contentHTML;
                const textContent = (tempDiv.textContent || '').trim();

                if (textContent) {
                    markdown += `${textContent}\n\n`;
                }
            }


            // --- Media ---
            const images = post.querySelectorAll('img:not([alt*="大頭貼照"])');
            if (images.length > 0) {
                markdown += `**Media:**\n`;
                images.forEach(img => {
                    const highResSrc = img.srcset?.split(',').map(s => s.trim().split(' ')[0]).pop() || img.src;
                    markdown += `![Image](${highResSrc})\n`;
                });
                markdown += `\n`;
            }
             const videos = post.querySelectorAll('video');
            if (videos.length > 0) {
                if (images.length === 0) markdown += `**Media:**\n`;
                videos.forEach(video => {
                    markdown += `[Video](${video.src})\n`;
                });
                markdown += `\n`;
            }


            // --- Quoted Post ---
            const quoteEl = post.querySelector('div.x6bh95i');
            if (quoteEl) {
                const quoteLinkEl = quoteEl.querySelector('a[href*="/post/"]');
                const quoteUrl = quoteLinkEl ? quoteLinkEl.href : 'N/A';

                let quoteAuthor = 'N/A';
                const quoteAuthorMatch = quoteUrl.match(/@([^/]+)/);
                if (quoteAuthorMatch) {
                    quoteAuthor = quoteAuthorMatch[1];
                }

                const quoteTimeEl = quoteEl.querySelector('time');
                const quoteTime = quoteTimeEl ? formatDate(quoteTimeEl.getAttribute('datetime')) : '';

                let quoteText = '';
                const quoteContentContainer = quoteEl.querySelector('div.x1a6qonq');
                if (quoteContentContainer) {
                    const tempContainer = quoteContentContainer.cloneNode(true);
                    tempContainer.querySelectorAll('div.x1rg5ohu').forEach(indicatorNode => {
                         const indicatorText = indicatorNode.textContent.replace(/\s/g, '');
                         if (indicatorText.match(/\d+\/\d+/)) {
                            indicatorNode.replaceWith(' `' + indicatorText + '`');
                        }
                    });
                     let contentHTML = tempContainer.innerHTML;
                    contentHTML = contentHTML.replace(/<br\s*\/?>/gi, '\n');
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = contentHTML;
                    quoteText = (tempDiv.textContent || '').trim();
                }


                markdown += `> [!quote] **${quoteAuthor}** (${quoteTime})\n`;
                if (quoteText) {
                    markdown += `> ${quoteText.replace(/\n/g, '\n> ')}\n`;
                }
                markdown += `> [Link to quoted post](${quoteUrl})\n\n`;
            }


            markdown += `---\n\n`;
        });


        return markdown;
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
        if (document.querySelector('div[role="region"][aria-label="直欄內文"]')) {
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