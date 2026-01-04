// ==UserScript==
// @name        Undeleddit
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description The solution to Reddit's biggest problem.
// @author      JGP
// @icon        data:image/x-icon;base64,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
// @match       https://old.reddit.com/r/*/comments/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @connect     api.pullpush.io
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/559390/Undeleddit.user.js
// @updateURL https://update.greasyfork.org/scripts/559390/Undeleddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_PAGE_SIZE = 100;
    const STEALTH_MODE_KEY = 'pullpush_stealth_mode_enabled';
    let DEFAULT_AUTHOR_COLOR = '#369';

    function getPostId() {
        const match = window.location.pathname.match(/\/comments\/(\w+)\//);
        return match ? match[1] : null;
    }

    function timeSince(createdUtc) {
        const seconds = Math.floor((new Date() - (createdUtc * 1000)) / 1000);
        let interval = seconds / 31536000; // years
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000; // months
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400; // days
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600; // hours
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60; // minutes
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }

    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    function getStealthMode() {
        return GM_getValue(STEALTH_MODE_KEY, false);
    }

    function setStealthMode(enabled) {
        GM_setValue(STEALTH_MODE_KEY, enabled);
        restyleRestoredComments(enabled);
        updateToggleText(enabled);
    }

    function getSubredditDefaultAuthorColor() {
        const existingAuthor = document.querySelector('.comment:not(.pullpush-restored) .author:not([style])');

        if (existingAuthor) {
            const computedStyle = window.getComputedStyle(existingAuthor);
            const color = computedStyle.color;
            if (color) {
                console.log(`Pullpush Restorer: Detected default author color: ${color}`);
                return color;
            }
        }
        console.log(`Pullpush Restorer: Using fallback default author color: ${DEFAULT_AUTHOR_COLOR}`);
        return DEFAULT_AUTHOR_COLOR;
    }

    function createToggleUI(commentArea) {
        if (document.getElementById('pullpush-toggle-ui')) return;

        const container = document.createElement('div');
        container.id = 'pullpush-toggle-ui';
        container.style.cssText = 'padding: 10px; margin-bottom: 10px; display: flex; align-items: center; border: 1px solid #ccc; border-radius: 5px; background-color: #f7f7f7;';

        const isStealth = getStealthMode();

        const toggleButton = document.createElement('button'); // This button adapts to a subreddits CSS. That is awesome.
        toggleButton.id = 'pullpush-toggle-button';
        toggleButton.style.cssText = 'padding: 5px 10px; cursor: pointer; border: 1px solid #aaa; border-radius: 3px; background-color: #e0e0e0; font-weight: bold; margin-left: 10px;';
        toggleButton.onclick = () => {
            const currentMode = getStealthMode();
            setStealthMode(!currentMode);
        };

        const statusLabel = document.createElement('span');
        statusLabel.id = 'pullpush-toggle-status';
        statusLabel.style.marginLeft = '10px';

        container.appendChild(toggleButton);
        container.appendChild(statusLabel);

        const loadingIndicator = document.getElementById('pullpush-loading');
        if (loadingIndicator) {
            commentArea.insertBefore(container, loadingIndicator);
        } else {
            commentArea.prepend(container);
        }

        updateToggleText(isStealth);
    }

    function updateToggleText(isStealth) {
        const button = document.getElementById('pullpush-toggle-button');
        const status = document.getElementById('pullpush-toggle-status');

        if (button) {
             button.textContent = isStealth ? 'Switch to Highlight Mode' : 'Switch to Stealth Mode';
        }
        if (status) {
            status.innerHTML = `Restored Comment Display: **${isStealth ? 'Stealth (Blended)' : 'Highlight (Custom Color & Marker)'}**`;
        }
    }

    function restyleRestoredComments(isStealth) {
        const stealthColor = DEFAULT_AUTHOR_COLOR;
        const highlightColor = '#E9967A';

        document.querySelectorAll('.comment.pullpush-restored').forEach(placeholder => {
            const authorLink = placeholder.querySelector('.pullpush-restored-author');
            const marker = placeholder.querySelector('.pullpush-restored-marker');

            if (authorLink) {
                authorLink.style.color = isStealth ? stealthColor : highlightColor;
            }
            if (marker) {
                marker.style.display = isStealth ? 'none' : 'inline';
            }
        });
    }
    async function fetchPage(postId, after = 0) {
        const fields = 'author,body,body_html,created_utc,id,score,permalink,link_id,parent_id,retrieved_on,retrieved_utc,subreddit';

        let apiUrl = `https://api.pullpush.io/reddit/comment/search/?fields=${fields}&metadata=true&size=${MAX_PAGE_SIZE}&sort=asc&link_id=${postId}`;

        if (after > 0) {
            apiUrl += `&after=${after}`;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function(response) {
                    if (response.status !== 200) {
                        console.error("Pullpush Restorer: API request failed with status:", response.status);
                        return reject(`API request failed with status: ${response.status}`);
                    }

                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.data);
                    } catch (e) {
                        console.error("Pullpush Restorer: Failed to parse Pullpush response.", e);
                        reject("Failed to parse response.");
                    }
                },
                onerror: function(response) {
                    console.error("Pullpush Restorer: Network error or security block on API request:", response);
                    reject(`Network error or userscript block.`);
                }
            });
        });
    }

    async function fetchAllDeletedComments(postId) {
        let allComments = [];
        let afterTimestamp = 0;
        let pageCount = 0;

        while (true) {
            pageCount++;

            try {
                const comments = await fetchPage(postId, afterTimestamp);

                if (!comments || comments.length === 0) {
                    console.log(`Pullpush Restorer: Completed fetching, no more comments found after page ${pageCount}.`);
                    break;
                }

                const newComments = comments.filter(c => !allComments.some(ac => ac.id === c.id));
                allComments.push(...newComments);

                afterTimestamp = comments[comments.length - 1].created_utc;

                if (comments.length < MAX_PAGE_SIZE) {
                    console.log(`Pullpush Restorer: Reached end of archive on page ${pageCount}.`);
                    break;
                }

                await new Promise(r => setTimeout(r, 1000));

            } catch (error) {
                console.error("Pullpush Restorer: Error during pagination loop:", error);
                break;
            }
        }
        return allComments;
    }

    function findPlaceholder(commentId) {
        const fullCommentId = `t1_${commentId}`;
        const thingId = `thing_${fullCommentId}`;

        let placeholder = document.querySelector(`.comment[data-fullname="${fullCommentId}"]`);

        if (!placeholder) {
            placeholder = document.getElementById(thingId);
            if (placeholder && !placeholder.classList.contains('comment')) {
                placeholder = null;
            }
        }

        if (!placeholder) {
            const selector = `.comment[data-permalink$="/${commentId}/"]`;
            placeholder = document.querySelector(selector);
        }

        return placeholder;
    }

    function updatePlaceholder(placeholder, comment) {
        const commentId = comment.id;
        const fullCommentId = `t1_${commentId}`;
        const author = comment.author;
        const score = comment.score || '0';
        const createdUtc = comment.created_utc;
        const isStealth = getStealthMode();

        const dateObj = new Date(createdUtc * 1000);
        const timestampLocal = dateObj.toLocaleString();
        const timestampISO = dateObj.toISOString();
        const timeSinceString = timeSince(createdUtc);

        const stealthColor = DEFAULT_AUTHOR_COLOR;
        const highlightColor = '#E9967A';
        const authorColor = isStealth ? stealthColor : highlightColor;
        const markerDisplay = isStealth ? 'none' : 'inline';

        const tagline = placeholder.querySelector('.tagline');
        if (!tagline) return;

        const expander = tagline.querySelector('.expand');
        tagline.innerHTML = '';
        if (expander) {
            tagline.appendChild(expander);
        }

        tagline.innerHTML += `
            <span class="userattrs"></span>
            <a href="/user/${author}" class="author pullpush-restored-author" style="color: ${authorColor};">${author}</a>
            <span class="score unvoted" title="${score} points">${score} points</span>
            <time title="${timestampLocal}" datetime="${timestampISO}" class="live-timestamp">${timeSinceString}</time>
            <span class="pullpush-restored-marker" style="color: #008000; font-weight: bold; margin-left: 5px; display: ${markerDisplay};">[RESTORED VIA PULLPUSH]</span>
        `;

        const entry = placeholder.querySelector('.entry');
        if (entry) {

            let node = tagline.nextSibling;
            while (node) {
                const next = node.nextSibling;
                node.remove();
                node = next;
            }

            let commentBodyContent;
            if (comment.body_html) {
                commentBodyContent = decodeHtml(comment.body_html);
            } else {
                commentBodyContent = `<div class="md"><p>${comment.body}</p></div>`;
            }

            const usertextForm = document.createElement('form');
            usertextForm.action = '#';
            usertextForm.className = 'usertext warn-on-unload pullpush-restored-form';
            usertextForm.setAttribute('onsubmit', 'return false;');
            usertextForm.id = `form-${commentId}`;

            usertextForm.innerHTML = `
                <input type="hidden" name="thing_id" value="${fullCommentId}">
                <div class="usertext-body may-blank-within md-container ">
                    ${commentBodyContent}
                </div>
            `;

            entry.appendChild(usertextForm);

            const buttonsList = document.createElement('ul');
            buttonsList.className = 'flat-list buttons';
            buttonsList.innerHTML = `
                <li class="first"><a href="${comment.permalink}" data-event-action="permalink" class="bylink" rel="nofollow">permalink</a></li>
                <li class="comment-save-button save-button login-required"><a href="javascript:void(0)">save</a></li>
                <li class="report-button login-required"><a href="javascript:void(0)" class="reportbtn access-required" data-event-action="report">report</a></li>
                <li class="reply-button login-required"><a class="access-required" href="javascript:void(0)" data-event-action="comment" onclick="return reply(this)">reply</a></li>
            `;
            entry.appendChild(buttonsList);

            placeholder.classList.remove('deleted', 'removed', 'collapsed');
            placeholder.classList.add('pullpush-restored');
        }
    }

    async function init() {
        const postId = getPostId();

        if (!postId) {
            return;
        }

        console.log(`Pullpush Restorer: Initializing for post ID: ${postId}`);

        const commentArea = document.querySelector('.commentarea');
        if (!commentArea) return;

        DEFAULT_AUTHOR_COLOR = getSubredditDefaultAuthorColor();

        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'pullpush-loading';
        loadingIndicator.style.cssText = 'padding: 10px; border-radius: 5px; margin-bottom: 10px;';
        loadingIndicator.innerHTML = '<p style="font-style: italic; color: #555; background: #ffffcc; border: 1px solid #e0e0e0;">[Pullpush] Checking for *all* archived comments (may take a few seconds for large threads)...</p>';
        commentArea.prepend(loadingIndicator);

        createToggleUI(commentArea);

        const allPlaceholders = Array.from(document.querySelectorAll('.comment.deleted, .comment.removed')).filter(p => {
            const tagline = p.querySelector('.tagline');
            return tagline && (tagline.textContent.includes('[deleted]') || tagline.textContent.includes('[removed]'));
        });

        const placeholderIds = new Set(allPlaceholders.map(p => {
            const fullname = p.getAttribute('data-fullname');
            if (fullname && fullname.startsWith('t1_')) {
                return fullname.substring(3);
            }
            const id = p.id;
            if (id && id.startsWith('thing_t1_')) {
                return id.substring(8);
            }
            return null;
        }).filter(id => id !== null));

        console.log(`Pullpush Restorer: Found ${placeholderIds.size} potential deleted placeholders on the page.`);

        try {
            const allArchivedComments = await fetchAllDeletedComments(postId);
            const archivedIds = new Set(allArchivedComments.map(c => c.id));
            let restoredCount = 0;

            archivedIds.forEach(commentId => {
                const placeholder = findPlaceholder(commentId);
                const comment = allArchivedComments.find(c => c.id === commentId);

                if (placeholder && comment) {
                    const tagline = placeholder.querySelector('.tagline');
                    const isPlaceholder = tagline && (tagline.textContent.includes('[deleted]') || tagline.textContent.includes('[removed]'));

                    const isArchivedContent = comment.author && comment.author !== '[deleted]' &&
                                              comment.body && comment.body !== '[deleted]' &&
                                              comment.body !== '[removed]';

                    if (isPlaceholder && isArchivedContent) {
                        updatePlaceholder(placeholder, comment);
                        placeholderIds.delete(commentId);
                        restoredCount++;
                    }
                }
            });

            const missingPlaceholderIds = Array.from(placeholderIds);
            const totalDeletedOnPage = allPlaceholders.length;
            const finalRestoredCount = restoredCount;

            const loadingIndicator = document.getElementById('pullpush-loading');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = `<p style="font-weight: bold; color: #155724; background: #d4edda; border: 1px solid #c3e6cb;">[Pullpush] Finished. Retrieved ${allArchivedComments.length} archived records, restored ${finalRestoredCount} deleted comments (of ${totalDeletedOnPage} total).</p>`;
            }

            console.log(`%cPullpush Restorer: FINAL DIAGNOSTIC:`, 'font-weight: bold; color: blue;');
            if (missingPlaceholderIds.length > 0) {
                 console.log(`%c- ${missingPlaceholderIds.length} comments could not be restored.`, 'font-weight: bold; color: red;');
                 console.log(`- These IDs were on the page but missing from the ${allArchivedComments.length} retrieved archive records (Likely Archive Gap):`, missingPlaceholderIds);
            } else {
                 console.log(`%c- Successfully matched all deleted comments to retrieved archive records!`, 'font-weight: bold; color: green;');
            }

        } catch (error) {

            const loadingIndicator = document.getElementById('pullpush-loading');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = `<p style="font-weight: bold; color: #721c24; background: #f8d7da; border: 1px solid #f5c6fb;">[Pullpush] Error during comment retrieval: ${error}. Cannot retrieve comments.</p>`;
            }
        }
    }

    init();

})();