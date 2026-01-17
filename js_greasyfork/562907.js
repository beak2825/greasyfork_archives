// ==UserScript==
// @name         Delete/Trash Posts from Moddog
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      1.0
// @description  Add quick moderation actions (delete post, trash topic) to Moddog reports
// @author       kloob
// @match        https://www.gaiaonline.com/moddog/report/*
// @match        http://www.gaiaonline.com/moddog/report/*
// @match        https://www.gaiaonline.com/moddog/report/view/*
// @match        http://www.gaiaonline.com/moddog/report/view/*
// @grant        GM_xmlhttpRequest
// @connect      gaiaonline.com
// @downloadURL https://update.greasyfork.org/scripts/562907/DeleteTrash%20Posts%20from%20Moddog.user.js
// @updateURL https://update.greasyfork.org/scripts/562907/DeleteTrash%20Posts%20from%20Moddog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Gaia Mod Helper] Script loaded');

    // Find ALL report tables (there might be multiple)
    const reportTables = document.querySelectorAll('table#report_table');
    console.log('[Gaia Mod Helper] Found', reportTables.length, 'table(s) with id="report_table"');

    if (reportTables.length === 0) {
        console.log('[Gaia Mod Helper] No report table found');
        return;
    }

    // Try each table to find the one with "References" row
    let reportTable = null;
    let referencesRow = null;

    for (let i = 0; i < reportTables.length; i++) {
        console.log(`[Gaia Mod Helper] Checking table ${i}...`);
        const table = reportTables[i];

        // Log rows in this table
        table.querySelectorAll('.fname').forEach((fname, index) => {
            console.log(`[Gaia Mod Helper] Table ${i}, Row ${index} fname:`, `"${fname.textContent.trim()}"`);
        });

        const refRow = Array.from(table.querySelectorAll('tr')).find(row => {
            const fname = row.querySelector('.fname');
            if (!fname) return false;
            const text = fname.textContent.trim().toLowerCase();
            return text === 'references';
        });

        if (refRow) {
            console.log(`[Gaia Mod Helper] Found References row in table ${i}`);
            reportTable = table;
            referencesRow = refRow;
            break;
        }
    }

    if (!reportTable || !referencesRow) {
        console.log('[Gaia Mod Helper] Could not find table with References row');
        return;
    }

    console.log('[Gaia Mod Helper] Using correct report table');

    const referencesContent = referencesRow.querySelector('.fval .postcontent');
    if (!referencesContent) {
        console.log('[Gaia Mod Helper] References content not found');
        return;
    }
    console.log('[Gaia Mod Helper] References content:', referencesContent.textContent);

    // Extract thread and post IDs
    // For post reports: Thread has id="reported_topic" and Post has id="reported_post"
    // For thread reports: Link has no ID and goes to /forum/detail/THREADID/
    const threadLinkWithId = referencesContent.querySelector('a[id="reported_topic"]');
    const postLink = referencesContent.querySelector('a[id="reported_post"]');

    let threadId = null;
    let isPost = false;
    let postId = null;

    if (threadLinkWithId) {
        // This is a post report (has the reported_topic ID)
        threadId = threadLinkWithId.textContent.trim();
        isPost = !!postLink;
        postId = isPost ? postLink.textContent.trim() : null;
        console.log('[Gaia Mod Helper] Detected POST report');
    } else {
        // This is a thread report (no ID on the link)
        const threadLink = referencesContent.querySelector('a[href*="/forum/detail/"]');
        if (threadLink) {
            threadId = threadLink.textContent.trim();
            isPost = false;
            console.log('[Gaia Mod Helper] Detected THREAD report');
        }
    }

    if (!threadId) {
        console.log('[Gaia Mod Helper] Could not extract thread ID');
        return;
    }

    console.log('[Gaia Mod Helper] Thread ID:', threadId);
    console.log('[Gaia Mod Helper] Is Post:', isPost);
    console.log('[Gaia Mod Helper] Post ID:', postId);

    // Create the action row
    console.log('[Gaia Mod Helper] Creating action row...');
    const actionRow = document.createElement('tr');
    actionRow.className = 'rowon';
    actionRow.innerHTML = `
        <td class="fname" valign="top" nowrap="nowrap" style="padding:4px;">Quick Actions</td>
        <td class="fval" style="font-size:100%;font-family:Arial,sans-serif;padding:4px;">
            <div class="postcontent" id="mod-quick-actions">
                ${isPost ? `
                    <button id="delete-post-btn" style="margin-right: 10px; padding: 5px 10px; background-color: #d9534f; color: white; border: none; cursor: pointer; border-radius: 3px;">Delete Post</button>
                    <label style="margin-right: 15px;">
                        <input type="checkbox" id="delete-notify-check"> Notify user
                    </label>
                ` : `
                    <button id="trash-topic-btn" style="padding: 5px 10px; background-color: #f0ad4e; color: white; border: none; cursor: pointer; border-radius: 3px;">Trash Topic</button>
                    <label style="margin-right: 15px;">
                        <input type="checkbox" id="trash-notify-check"> Notify user
                    </label>
                `}
                <span id="action-status" style="margin-left: 10px; font-style: italic;"></span>
            </div>
        </td>
    `;

    // Insert the row after the References row
    referencesRow.parentNode.insertBefore(actionRow, referencesRow.nextSibling);
    console.log('[Gaia Mod Helper] Action row inserted successfully!');

    // Status message helper
    function showStatus(message, isError = false) {
        const statusEl = document.getElementById('action-status');
        statusEl.textContent = message;
        statusEl.style.color = isError ? 'red' : 'green';
        setTimeout(() => {
            statusEl.textContent = '';
        }, 5000);
    }

    // Delete Post functionality
    if (isPost) {
        document.getElementById('delete-post-btn').addEventListener('click', async function() {
            const notifyUser = document.getElementById('delete-notify-check').checked;
            const notifyText = notifyUser ? ' (with notification)' : ' (without notification)';

            if (!confirm(`Are you sure you want to delete post ${postId}${notifyText}?`)) return;

            this.disabled = true;
            showStatus('Fetching delete form...');

            try {
                // First, fetch the delete page to get the nonce
                const deleteUrl = `https://www.gaiaonline.com/forum/delete/post/${postId}/`;
                const response = await fetch(deleteUrl);
                const html = await response.text();

                // Parse the HTML to extract the nonce
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const nonceInput = doc.querySelector('input[name="nonce"]');

                if (!nonceInput) {
                    throw new Error('Could not find nonce in delete form');
                }

                const nonce = nonceInput.value;

                // Submit the delete form
                const formData = new FormData();
                formData.append('id', postId);
                formData.append('confirm', '1');
                formData.append('nonce', nonce);
                formData.append('mod_pm', notifyUser ? '1' : '0');

                showStatus('Deleting post...');
                const deleteResponse = await fetch(deleteUrl, {
                    method: 'POST',
                    body: formData
                });

                if (deleteResponse.ok) {
                    showStatus('Post deleted successfully!');
                } else {
                    throw new Error('Delete request failed');
                }
            } catch (error) {
                console.error('Delete error:', error);
                showStatus('Error deleting post: ' + error.message, true);
                this.disabled = false;
            }
        });
    } else {
        // Trash Topic functionality (only for thread reports)
        document.getElementById('trash-topic-btn').addEventListener('click', async function() {
            const notifyUser = document.getElementById('trash-notify-check').checked;
            const notifyText = notifyUser ? ' (with notification)' : ' (without notification)';

            if (!confirm(`Are you sure you want to move thread ${threadId} to the Trash Bin${notifyText}?`)) return;

            this.disabled = true;
            showStatus('Fetching move form...');

            try {
                // First, fetch the move page to get the nonce and current forum
                const moveUrl = `https://www.gaiaonline.com/forum/mod/move/${threadId}/`;
                const response = await fetch(moveUrl);
                const html = await response.text();

                // Parse the HTML to extract the nonce and old_forum
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const nonceInput = doc.querySelector('input[name="nonce"]');
                const oldForumInput = doc.querySelector('input[name="old_forum"]');

                if (!nonceInput) {
                    throw new Error('Could not find nonce in move form');
                }

                const nonce = nonceInput.value;
                const oldForum = oldForumInput ? oldForumInput.value : '';

                // Submit the move form
                const formData = new FormData();
                formData.append('forum', '25 trash-bin'); // Pre-populate with trash bin
                formData.append('topic', threadId);
                formData.append('old_forum', oldForum);
                formData.append('confirm', '1');
                formData.append('nonce', nonce);
                formData.append('mod_pm', notifyUser ? '1' : '0'); // Respect the checkbox

                showStatus('Moving topic to trash...');
                const moveResponse = await fetch('https://www.gaiaonline.com/forum/mod/move/', {
                    method: 'POST',
                    body: formData
                });

                if (moveResponse.ok) {
                    showStatus('Topic moved to trash successfully!');
                } else {
                    throw new Error('Move request failed');
                }
            } catch (error) {
                console.error('Move error:', error);
                showStatus('Error moving topic: ' + error.message, true);
                this.disabled = false;
            }
        });
    }
})();