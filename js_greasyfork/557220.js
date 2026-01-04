// ==UserScript==
// @name         MyDealz | Comment Section Exporter
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      3.8
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Exports entire comment section of current thread with resume capability
// @match        https://www.mydealz.de/deals/*
// @match        https://www.mydealz.de/diskussion/*
// @match        https://www.mydealz.de/feedback/*
// @match        https://www.mydealz.de/gutscheine/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mydealz.de
// @grant        none
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/557220/MyDealz%20%7C%20Comment%20Section%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/557220/MyDealz%20%7C%20Comment%20Section%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== USER CONFIGURATION ==========
    const CONFIG = {
        INITIAL_RETRY_DELAY_SEC: 10,
        RETRY_BACKOFF_FACTOR: 1.25,
        SKIP_SCANNING: false,
        STORAGE_KEY: 'mydealz_scraper_pos_v1',
        MINIMIZED_KEY: 'mydealz_scraper_minimized_v1',
        UI_WIDTH: 240,
        UI_MIN_SIZE: 44
    };
    // =========================================

    let state = {
        isScraping: false,
        abortController: null,
        threadId: null,
        xsrfToken: null,
        threadTitle: '',
        allComments: [],
        totalPages: 0,
        totalRoot: 0,
        totalReplies: 0,
        canResume: false,
        resumeFromPage: 1,
        resumeFromIndex: 0,
        totalComments: 0,
        expectedReplies: 0,
        processedComments: 0,
        processedReplies: 0,
        processedCommentIds: new Set(),
        currentRetryDelay: CONFIG.INITIAL_RETRY_DELAY_SEC,
        countdownInterval: null,
        isWaitingForRetry: false,
        lastSuccessfulFetch: false
    };

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function getThreadId() {
        const el = document.querySelector('[data-thread-id]');
        if (el) return el.dataset.threadId;
        const match = window.location.pathname.match(/-(\d+)(?:\?|$)/);
        return match ? match[1] : null;
    }

    function sanitizeFilename(name) {
        return (name || 'mydealz_export').replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ').trim().substring(0, 200);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function cleanHtml(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        temp.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
        temp.querySelectorAll('p').forEach(p => p.insertAdjacentText('afterend', '\n\n'));
        temp.querySelectorAll('i.emoji').forEach(emoji => emoji.replaceWith(emoji.getAttribute('title') || ''));
        return temp.textContent.trim();
    }

    function formatDate(timestamp) {
        return new Date(timestamp * 1000).toLocaleString('de-DE');
    }

    function formatReactions(reactionCounts) {
        if (!reactionCounts || reactionCounts.length === 0) return '';
        const icons = { 'LIKE': '👍', 'FUNNY': '😂', 'HELPFUL': '💡' };
        return reactionCounts.map(r => `${icons[r.type] || '❓'} ${r.count}`).join('  |  ');
    }

    function getThreadMetadata() {
        const metadata = {
            title: '',
            merchant: '',
            postedDate: '',
            temperature: '',
            author: '',
            description: '',
            additionalInfo: []
        };

        metadata.title = document.querySelector('h1.thread-title')?.textContent.trim() || '';
        metadata.merchant = document.querySelector('.threadItem-content a[data-t="merchantLink"]')?.textContent.trim() || '';
        const dateEl = document.querySelector('.threadItem-content time[title]');
        metadata.postedDate = dateEl?.getAttribute('title') || dateEl?.textContent.trim() || '';
        metadata.temperature = document.querySelector('.vote-temp')?.textContent.trim() || '';
        let authorEl = document.querySelector('.threadItemCard-author .thread-user');
        if (!authorEl) {
            authorEl = document.querySelector('.short-profile-target .thread-user');
        }
        metadata.author = authorEl?.textContent.trim() || '';

        let descEl = document.querySelector('div[data-t="description"]');
        if (!descEl) {
            descEl = document.querySelector('#threadDescriptionItemPortal .userHtml-content');
        }
        if (descEl) {
            const descClone = descEl.cloneNode(true);
            descClone.querySelectorAll('img').forEach(img => img.remove());
            metadata.description = cleanHtml(descClone.innerHTML);
        }

        document.querySelectorAll('#additionalInfoPortal .threadInfo-item').forEach(item => {
            const author = item.querySelector('.user button')?.textContent.trim();
            const date = item.querySelector('time')?.textContent.trim();
            const body = item.querySelector('.comment-body .userHtml-content');
            if (author && body) {
                metadata.additionalInfo.push({
                    author,
                    date,
                    content: cleanHtml(body.innerHTML)
                });
            }
        });

        return metadata;
    }

    async function safeFetch(url, options) {
        const response = await fetch(url, options);

        if (response.status === 429) {
            throw new Error('RATE_LIMITED');
        }

        const text = await response.text();

        if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
            console.error('Got HTML instead of JSON - rate limited');
            throw new Error('RATE_LIMITED');
        }

        state.lastSuccessfulFetch = true;

        return JSON.parse(text);
    }

    async function fetchRootComments(page) {
        const query = `
        query comments($filter: CommentFilter!, $limit: Int, $page: Int) {
          comments(filter: $filter, limit: $limit, page: $page) {
            items {
              commentId
              user { username }
              preparedHtmlContent
              reactionCounts { type count }
              createdAtTs
              wasEdited
              isPinned
              replyCount
            }
            pagination { current last }
          }
        }`;

        const data = await safeFetch("https://www.mydealz.de/graphql", {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-pepper-txn': 'threads.show.deal',
                'x-request-type': 'application/vnd.pepper.v1+json',
                'x-requested-with': 'XMLHttpRequest',
                'x-xsrf-token': state.xsrfToken
            },
            body: JSON.stringify({
                query,
                variables: {
                    filter: { threadId: { eq: state.threadId }, order: { direction: "Ascending" } },
                    page,
                    limit: 100
                }
            })
        });

        return data.errors ? null : data.data.comments;
    }

    async function fetchNestedReplies(mainCommentId) {
        const query = `
        query comments($filter: CommentFilter!, $limit: Int, $page: Int) {
          comments(filter: $filter, limit: $limit, page: $page) {
            items {
              commentId
              user { username }
              preparedHtmlContent
              reactionCounts { type count }
              createdAtTs
              wasEdited
            }
          }
        }`;

        const data = await safeFetch("https://www.mydealz.de/graphql", {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-pepper-txn': 'threads.show.deal',
                'x-request-type': 'application/vnd.pepper.v1+json',
                'x-requested-with': 'XMLHttpRequest',
                'x-xsrf-token': state.xsrfToken
            },
            body: JSON.stringify({
                query,
                variables: {
                    filter: {
                        mainCommentId,
                        threadId: { eq: state.threadId },
                        order: { direction: "Ascending" }
                    },
                    page: 1,
                    limit: 100
                }
            })
        });

        return data.errors ? [] : data.data.comments.items;
    }

    function cancelCountdown() {
        if (state.countdownInterval) {
            clearInterval(state.countdownInterval);
            state.countdownInterval = null;
        }
        state.isWaitingForRetry = false;
    }

    function startCountdown(seconds, onComplete) {
        const btn = document.getElementById('md-scraper-btn');
        let remaining = seconds;

        state.isWaitingForRetry = true;

        btn.textContent = `⏳ Retry (${remaining}s)`;
        btn.style.background = '#d97706';

        updateStatus(`Rate limited! Auto-retry in ${remaining}s`);

        state.countdownInterval = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                btn.textContent = `⏳ Retry (${remaining}s)`;
                updateStatus(`Rate limited! Auto-retry in ${remaining}s`);
            } else {
                cancelCountdown();
                onComplete();
            }
        }, 1000);
    }

    function handleRateLimitWithRetry() {
        state.isScraping = false;
        state.canResume = true;

        if (!state.lastSuccessfulFetch) {
            state.currentRetryDelay *= CONFIG.RETRY_BACKOFF_FACTOR;
            console.log(`Consecutive rate limit. Delay increased to ${Math.round(state.currentRetryDelay)}s`);
        } else {
            state.currentRetryDelay = CONFIG.INITIAL_RETRY_DELAY_SEC;
            console.log(`Had successful fetches before rate limit. Delay reset to ${state.currentRetryDelay}s`);
        }

        state.lastSuccessfulFetch = false;

        const delaySec = Math.round(state.currentRetryDelay);
        console.log(`Rate limited. Waiting ${delaySec}s. Collected ${state.allComments.length} comments.`);

        if (state.allComments.length > 0) {
            document.getElementById('md-download-btn').style.display = 'block';
        }

        startCountdown(delaySec, async () => {
            await toggleScraping();
        });
    }

    async function toggleScraping() {
        const btn = document.getElementById('md-scraper-btn');

        if (state.isWaitingForRetry) {
            console.log('User forced retry');
            cancelCountdown();
        }

        if (state.isScraping) {
            if (state.abortController) state.abortController.abort();
            state.isScraping = false;
            state.canResume = true;
            showPausedUI();
            return;
        }

        const isResume = state.canResume && (state.allComments.length > 0 || state.resumeFromPage > 1 || state.resumeFromIndex > 0);

        state.isScraping = true;
        state.abortController = new AbortController();
        state.lastSuccessfulFetch = false;
        const signal = state.abortController.signal;

        btn.textContent = 'Stop';
        btn.style.background = '#dc3545';
        document.getElementById('md-download-btn').style.display = 'none';

        if (!isResume) {
            state.currentRetryDelay = CONFIG.INITIAL_RETRY_DELAY_SEC;
            state.threadId = getThreadId();
            state.xsrfToken = decodeURIComponent(getCookie('xsrf_t'));
            state.threadTitle = document.querySelector('h1.thread-title')?.textContent.trim() || 'MyDealz Thread';
            state.allComments = [];
            state.processedCommentIds = new Set();
            state.totalRoot = 0;
            state.totalReplies = 0;
            state.resumeFromPage = 1;
            state.resumeFromIndex = 0;
            state.processedComments = 0;
            state.processedReplies = 0;
            state.totalComments = 0;
            state.expectedReplies = 0;

            if (!state.threadId) {
                alert('Error: Could not determine Thread ID.');
                resetUI();
                return;
            }

            try {
                const firstPage = await fetchRootComments(1);
                if (!firstPage) throw new Error('Failed to fetch comments');

                state.totalPages = firstPage.pagination.last;

                if (CONFIG.SKIP_SCANNING) {
                    state.totalComments = state.totalPages * firstPage.items.length;
                    state.expectedReplies = state.totalPages * firstPage.items.reduce((sum, c) => sum + (c.replyCount || 0), 0);
                    updateProgress('Scraping...', 0, state.totalComments, 0, state.expectedReplies);
                } else {
                    state.expectedReplies = firstPage.items.reduce((sum, c) => sum + (c.replyCount || 0), 0);
                    state.totalComments = firstPage.items.length;
                    updateStatus(`Scanning 1 / ${state.totalPages}...`);

                    for (let p = 2; p <= state.totalPages; p++) {
                        if (signal.aborted) break;
                        updateStatus(`Scanning ${p} / ${state.totalPages}...`);
                        const pageData = await fetchRootComments(p);
                        if (pageData) {
                            state.totalComments += pageData.items.length;
                            state.expectedReplies += pageData.items.reduce((sum, c) => sum + (c.replyCount || 0), 0);
                        }
                    }
                    updateProgress('Scraping...', 0, state.totalComments, 0, state.expectedReplies);
                }
            } catch (err) {
                if (err.message === 'RATE_LIMITED') {
                    handleRateLimitWithRetry();
                    return;
                }
                throw err;
            }
        } else {
            console.log(`Resuming from page ${state.resumeFromPage}, index ${state.resumeFromIndex}`);
            updateProgress('Resuming...', state.processedComments, state.totalComments, state.processedReplies, state.expectedReplies);
        }

        try {
            for (let page = state.resumeFromPage; page <= state.totalPages; page++) {
                if (signal.aborted) break;

                const pageData = await fetchRootComments(page);
                if (!pageData) continue;

                const startIndex = (page === state.resumeFromPage) ? state.resumeFromIndex : 0;

                for (let i = startIndex; i < pageData.items.length; i++) {
                    if (signal.aborted) break;

                    const comment = pageData.items[i];

                    // Skip already processed
                    if (state.processedCommentIds.has(comment.commentId)) {
                        continue;
                    }

                    updateProgress('Scraping...', state.processedComments, state.totalComments, state.processedReplies, state.expectedReplies);

                    const commentData = { ...comment, replies: [] };

                    if (comment.replyCount > 0) {
                        const replies = await fetchNestedReplies(comment.commentId);
                        commentData.replies = replies;
                        state.processedReplies += replies.length;
                        state.totalReplies += replies.length;
                    }

                    // Successfully processed - add to results
                    state.allComments.push(commentData);
                    state.processedCommentIds.add(comment.commentId);
                    state.totalRoot++;
                    state.processedComments++;

                    // Save resume position: NEXT comment to process
                    if (i + 1 < pageData.items.length) {
                        state.resumeFromPage = page;
                        state.resumeFromIndex = i + 1;
                    } else {
                        // End of this page, next page starts at 0
                        state.resumeFromPage = page + 1;
                        state.resumeFromIndex = 0;
                    }

                    updateProgress('Scraping...', state.processedComments, state.totalComments, state.processedReplies, state.expectedReplies);
                }
            }

            if (!signal.aborted && state.allComments.length > 0) {
                state.currentRetryDelay = CONFIG.INITIAL_RETRY_DELAY_SEC;
                state.canResume = false;
                state.isScraping = false;
                updateProgress('Complete!', state.processedComments, state.totalComments, state.processedReplies, state.expectedReplies);
                await sleep(500);
                exportTxt();
                showCompleteUI();
            }

        } catch (err) {
            if (err.message === 'RATE_LIMITED') {
                handleRateLimitWithRetry();
                return;
            }
            console.error(err);
            alert('Error: ' + err.message);
            showPausedUI();
        }
    }

    function showPausedUI() {
        const btn = document.getElementById('md-scraper-btn');
        const downloadBtn = document.getElementById('md-download-btn');

        btn.textContent = '▶ Resume';
        btn.style.background = '#28a745';

        if (state.allComments.length > 0) {
            downloadBtn.style.display = 'block';
            downloadBtn.textContent = '📥 Download Partial';
            updateStatus(`Paused. ${state.allComments.length} saved.`);
        } else {
            updateStatus('Paused.');
        }
    }

    function showCompleteUI() {
        cancelCountdown();
        state.isScraping = false;
        state.abortController = null;
        state.canResume = false;
        state.currentRetryDelay = CONFIG.INITIAL_RETRY_DELAY_SEC;
        state.lastSuccessfulFetch = false;

        const btn = document.getElementById('md-scraper-btn');
        const downloadBtn = document.getElementById('md-download-btn');

        if (btn) {
            btn.textContent = 'Start Export';
            btn.style.background = '#03a5c1';
        }
        if (downloadBtn) {
            downloadBtn.style.display = 'block';
            downloadBtn.textContent = '📥 Download Again';
        }
    }

    function resetUI() {
        cancelCountdown();
        state.isScraping = false;
        state.abortController = null;
        state.canResume = false;
        state.currentRetryDelay = CONFIG.INITIAL_RETRY_DELAY_SEC;
        state.lastSuccessfulFetch = false;

        const btn = document.getElementById('md-scraper-btn');
        if (btn) {
            btn.textContent = 'Start Export';
            btn.style.background = '#03a5c1';
        }
        document.getElementById('md-download-btn').style.display = 'none';
    }

    function exportTxt() {
        const meta = getThreadMetadata();

        let text = `${meta.title}\n${'='.repeat(meta.title.length)}\n\n`;

        if (meta.merchant) text += `Merchant: ${meta.merchant}\n`;
        if (meta.postedDate) text += `Posted: ${meta.postedDate}\n`;
        if (meta.temperature) text += `Temperature: ${meta.temperature}\n`;
        if (meta.author) text += `Author: ${meta.author}\n`;
        text += `\n`;

        if (meta.description) {
            text += `DESCRIPTION:\n${'-'.repeat(60)}\n${meta.description}\n\n`;
        }

        if (meta.additionalInfo.length > 0) {
            text += `ADDITIONAL TIPS:\n${'-'.repeat(60)}\n`;
            meta.additionalInfo.forEach(tip => {
                text += `[${tip.author}] - ${tip.date}\n${tip.content}\n\n`;
            });
            text += '\n';
        }

        text += `COMMENTS:\n${'-'.repeat(60)}\n`;
        text += `Total: ${state.totalRoot} comments + ${state.totalReplies} replies = ${state.totalRoot + state.totalReplies} items\n\n`;

        for (const comment of state.allComments) {
            const badges = [];
            if (comment.isPinned) badges.push('📌 PINNED');
            if (comment.wasEdited) badges.push('✏️ EDITED');
            const badgeStr = badges.length > 0 ? `  [${badges.join(' ')}]` : '';

            text += `[${comment.user.username}] - ${formatDate(comment.createdAtTs)}${badgeStr}\n`;

            const reactions = formatReactions(comment.reactionCounts);
            if (reactions) text += `${reactions}\n`;

            text += `\n${cleanHtml(comment.preparedHtmlContent)}\n\n${'-'.repeat(40)}\n\n`;

            for (const reply of comment.replies) {
                const replyBadge = reply.wasEdited ? '  [✏️ EDITED]' : '';
                text += `  >> [${reply.user.username}] - ${formatDate(reply.createdAtTs)}${replyBadge}\n`;

                const replyReactions = formatReactions(reply.reactionCounts);
                if (replyReactions) text += `  ${replyReactions}\n`;

                text += `\n  ${cleanHtml(reply.preparedHtmlContent).replace(/\n/g, '\n  ')}\n\n  ${'-'.repeat(40)}\n\n`;
            }
        }

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sanitizeFilename(state.threadTitle)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // UI POSITIONING & DRAG MANAGEMENT
    // ══════════════════════════════════════════════════════════════════════════
    const UIManager = {
        container: null,
        isDragging: false,
        isMinimized: false,
        anchorBottom: false,

        loadPosition(el) {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                try {
                    const { ratioX, ratioY, anchorBottom } = JSON.parse(saved);
                    this.anchorBottom = anchorBottom || false;
                    this.setPositionFromRatio(el, ratioX, ratioY);
                    return;
                } catch {}
            }
            // Default position: bottom-right, anchored to bottom
            this.anchorBottom = true;
            this.setPositionFromRatio(el, 0.95, 0.05);
        },

        setPositionFromRatio(el, ratioX, ratioY) {
            const width = this.isMinimized ? CONFIG.UI_MIN_SIZE : CONFIG.UI_WIDTH;
            const maxX = window.innerWidth - width - 10;
            const x = Math.max(10, Math.min(maxX, ratioX * window.innerWidth));

            el.style.left = `${x}px`;
            el.style.right = 'auto';

            if (this.anchorBottom) {
                const bottomOffset = Math.max(10, ratioY * window.innerHeight);
                el.style.bottom = `${bottomOffset}px`;
                el.style.top = 'auto';
            } else {
                const topOffset = Math.max(10, ratioY * window.innerHeight);
                el.style.top = `${topOffset}px`;
                el.style.bottom = 'auto';
            }
        },

        applyRatioPosition() {
            if (!this.container) return;
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    this.anchorBottom = data.anchorBottom === true;

                    const width = this.isMinimized ? CONFIG.UI_MIN_SIZE : CONFIG.UI_WIDTH;
                    const height = this.container.offsetHeight || CONFIG.UI_MIN_SIZE;

                    const maxX = window.innerWidth - width - 10;
                    const x = Math.max(10, Math.min(maxX, data.ratioX * window.innerWidth));

                    this.container.style.left = `${x}px`;
                    this.container.style.right = 'auto';

                    if (this.anchorBottom) {
                        const maxBottom = Math.max(10, window.innerHeight - height - 10);
                        const bottomOffset = Math.max(10, Math.min(maxBottom, data.ratioY * window.innerHeight));
                        this.container.style.bottom = `${bottomOffset}px`;
                        this.container.style.top = 'auto';
                    } else {
                        const maxTop = Math.max(10, window.innerHeight - height - 10);
                        const topOffset = Math.max(10, Math.min(maxTop, data.ratioY * window.innerHeight));
                        this.container.style.top = `${topOffset}px`;
                        this.container.style.bottom = 'auto';
                    }
                } catch {}
            }
        },

        savePositionAsRatio(x, y) {
            const rect = this.container.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            this.anchorBottom = centerY > window.innerHeight / 2;

            const ratioX = x / window.innerWidth;
            const ratioY = this.anchorBottom
                ? (window.innerHeight - rect.bottom) / window.innerHeight
                : y / window.innerHeight;

            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                ratioX: Math.max(0, Math.min(1, ratioX)),
                ratioY: Math.max(0, Math.min(1, ratioY)),
                anchorBottom: this.anchorBottom
            }));
        },

        startDrag(e, el) {
            if (e.button !== 2) return;
            e.preventDefault();

            this.isDragging = true;
            const rect = el.getBoundingClientRect();
            const offX = e.clientX - rect.left;
            const offY = e.clientY - rect.top;

            const onMove = (ev) => {
                const width = this.isMinimized ? CONFIG.UI_MIN_SIZE : CONFIG.UI_WIDTH;
                const height = this.isMinimized ? CONFIG.UI_MIN_SIZE : el.offsetHeight;
                const maxX = window.innerWidth - width - 10;
                const maxY = window.innerHeight - height - 10;

                const x = Math.max(10, Math.min(maxX, ev.clientX - offX));
                const y = Math.max(10, Math.min(maxY, ev.clientY - offY));

                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
                el.style.bottom = 'auto';
                el.style.right = 'auto';
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);

                const finalRect = el.getBoundingClientRect();
                this.savePositionAsRatio(finalRect.left, finalRect.top);
                this.applyRatioPosition();

                setTimeout(() => { this.isDragging = false; }, 50);
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        },

        loadMinimizedState() {
            try {
                return localStorage.getItem(CONFIG.MINIMIZED_KEY) === 'true';
            } catch { return false; }
        },

        saveMinimizedState(minimized) {
            try {
                localStorage.setItem(CONFIG.MINIMIZED_KEY, minimized ? 'true' : 'false');
            } catch {}
        },

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            this.saveMinimizedState(this.isMinimized);
            this.updateMinimizedUI();
        },

        updateMinimizedUI() {
            if (!this.container) return;

            const header = this.container.querySelector('.md-scraper-header');
            const content = this.container.querySelector('.md-scraper-content');
            const minimizeBtn = this.container.querySelector('.md-minimize-btn');

            if (this.isMinimized) {
                this.container.style.width = `${CONFIG.UI_MIN_SIZE}px`;
                this.container.style.height = `${CONFIG.UI_MIN_SIZE}px`;
                this.container.style.padding = '0';
                this.container.style.borderRadius = '50%';
                this.container.style.cursor = 'pointer';
                this.container.title = 'Click to expand • Right-click drag to move';

                if (header) header.style.display = 'none';
                if (content) content.style.display = 'none';
                if (minimizeBtn) minimizeBtn.style.display = 'none';

                let icon = this.container.querySelector('.md-minimized-icon');
                if (!icon) {
                    icon = document.createElement('div');
                    icon.className = 'md-minimized-icon';
                    icon.textContent = '💬';
                    icon.style.cssText = `
                        font-size: 22px;
                        line-height: ${CONFIG.UI_MIN_SIZE}px;
                        text-align: center;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                    `;
                    this.container.appendChild(icon);
                }
                icon.style.display = 'block';

            } else {
                this.container.style.width = `${CONFIG.UI_WIDTH}px`;
                this.container.style.height = 'auto';
                this.container.style.padding = '12px';
                this.container.style.borderRadius = '8px';
                this.container.style.cursor = '';
                this.container.title = '';

                if (header) header.style.display = 'block';
                if (content) content.style.display = 'flex';
                if (minimizeBtn) minimizeBtn.style.display = 'block';

                const icon = this.container.querySelector('.md-minimized-icon');
                if (icon) icon.style.display = 'none';
            }

            this.applyRatioPosition();
        }
    };

    function createFloatingUI() {
        if (document.getElementById('md-scraper-ui')) return;

        const container = document.createElement('div');
        container.id = 'md-scraper-ui';
        container.style.cssText = `
            position: fixed; z-index: 99999;
            background: #1a1a2e; padding: 12px; border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            width: ${CONFIG.UI_WIDTH}px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            border: 1px solid #2d2d44;
            user-select: none;
        `;

        UIManager.container = container;
        UIManager.isMinimized = UIManager.loadMinimizedState();
        UIManager.loadPosition(container);

        // Header with title
        const header = document.createElement('div');
        header.className = 'md-scraper-header';
        header.style.cssText = `
            position: relative;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #2d2d44;
        `;

        const title = document.createElement('div');
        title.className = 'md-scraper-title';
        title.textContent = 'Comment Section Exporter';
        title.style.cssText = `
            font-weight: bold; color: #03a5c1;
            font-size: 13px; white-space: nowrap;
            padding-right: 24px;
        `;

        // Minimize button - absolute top right
        const minimizeBtn = document.createElement('span');
        minimizeBtn.className = 'md-minimize-btn';
        minimizeBtn.textContent = '─';
        minimizeBtn.title = 'Minimize';
        minimizeBtn.style.cssText = `
            position: absolute; top: -2px; right: 0;
            cursor: pointer; font-size: 14px; color: #666;
            line-height: 1; font-weight: bold; padding: 2px 4px;
        `;
        minimizeBtn.onmouseover = () => minimizeBtn.style.color = '#fff';
        minimizeBtn.onmouseout = () => minimizeBtn.style.color = '#666';
        minimizeBtn.onclick = (e) => {
            e.stopPropagation();
            UIManager.toggleMinimize();
        };

        header.appendChild(title);
        header.appendChild(minimizeBtn);

        // Content wrapper
        const content = document.createElement('div');
        content.className = 'md-scraper-content';
        content.style.cssText = `display: flex; flex-direction: column; gap: 8px;`;

        const statusMsg = document.createElement('div');
        statusMsg.id = 'md-scraper-msg';
        statusMsg.textContent = 'Ready • Right-click drag to move';
        statusMsg.style.cssText = `
            font-size: 11px; color: #888; text-align: center;
            min-height: 15px; padding: 2px 0;
        `;

        const progressTable = document.createElement('table');
        progressTable.id = 'md-scraper-progress';
        progressTable.style.cssText = `
            display: none; width: 100%; font-family: "Courier New", monospace;
            font-size: 11px; color: #ccc; border-collapse: collapse;
        `;
        progressTable.innerHTML = `
            <tr style="height: 18px;">
                <td style="color: #888; text-align: left;">Comments</td>
                <td style="text-align: right; color: #4ade80; padding-right: 2px;" id="prog-c-curr">0</td>
                <td style="text-align: center; color: #666; width: 12px;">/</td>
                <td style="text-align: right; color: #888;" id="prog-c-total">0</td>
            </tr>
            <tr style="height: 18px;">
                <td style="color: #888; text-align: left;">Replies</td>
                <td style="text-align: right; color: #4ade80; padding-right: 2px;" id="prog-r-curr">0</td>
                <td style="text-align: center; color: #666; width: 12px;">/</td>
                <td style="text-align: right; color: #888;" id="prog-r-total">0</td>
            </tr>
        `;

        const btn = document.createElement('button');
        btn.id = 'md-scraper-btn';
        btn.textContent = 'Start Export';
        btn.style.cssText = `
            background: #03a5c1; color: white; border: none; padding: 10px;
            border-radius: 4px; cursor: pointer; font-weight: bold;
            text-align: center; width: 100%; font-size: 13px;
        `;
        btn.onclick = toggleScraping;

        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'md-download-btn';
        downloadBtn.textContent = '📥 Export Partial';
        downloadBtn.style.cssText = `
            display: none; background: #374151; color: #ccc; border: none;
            padding: 8px; border-radius: 4px; cursor: pointer; font-size: 12px;
            text-align: center; width: 100%;
        `;
        downloadBtn.onmouseover = () => downloadBtn.style.background = '#4b5563';
        downloadBtn.onmouseout = () => downloadBtn.style.background = '#374151';
        downloadBtn.onclick = exportTxt;

        content.appendChild(statusMsg);
        content.appendChild(progressTable);
        content.appendChild(downloadBtn);
        content.appendChild(btn);

        container.appendChild(header);
        container.appendChild(content);

        // Right-click drag handler
        container.addEventListener('contextmenu', (e) => e.preventDefault());
        container.addEventListener('mousedown', (e) => {
            if (e.button === 2) {
                UIManager.startDrag(e, container);
            }
        });

        // Left-click on minimized icon expands
        container.addEventListener('click', (e) => {
            if (UIManager.isMinimized && e.button === 0 && !UIManager.isDragging) {
                UIManager.toggleMinimize();
            }
        });

        document.body.appendChild(container);

        if (UIManager.isMinimized) {
            UIManager.updateMinimizedUI();
        }

        window.addEventListener('resize', () => UIManager.applyRatioPosition());
    }

    function updateStatus(msg) {
        const msgEl = document.getElementById('md-scraper-msg');
        if (msgEl) msgEl.textContent = msg;
    }

    function updateProgress(msg, currentComments, totalComments, currentReplies, totalReplies) {
        updateStatus(msg);
        const tableEl = document.getElementById('md-scraper-progress');

        if (tableEl) {
            const wasHidden = tableEl.style.display === 'none';
            tableEl.style.display = 'table';
            document.getElementById('prog-c-curr').textContent = currentComments;
            document.getElementById('prog-c-total').textContent = totalComments;
            document.getElementById('prog-r-curr').textContent = currentReplies;
            document.getElementById('prog-r-total').textContent = totalReplies;

            if (wasHidden) {
                UIManager.applyRatioPosition();
            }
        }
    }

    if (document.readyState === 'complete') {
        createFloatingUI();
    } else {
        window.addEventListener('load', createFloatingUI);
    }

})();