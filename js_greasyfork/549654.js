// ==UserScript==
// @name         MyDealz Kommentarvolltextsuche
// @namespace    https://mydealz.de/
// @version      1.3.4
// @description  Suchbox für Volltextsuche in allen Kommentaren eines Deals / einer Diskussion
// @match        https://www.mydealz.de/deals/*
// @match        https://www.mydealz.de/diskussion/*
// @match        https://www.mydealz.de/feedback/*
// @match        https://www.mydealz.de/gutscheine/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524875/MyDealz%20Kommentarvolltextsuche.user.js
// @updateURL https://update.greasyfork.org/scripts/524875/MyDealz%20Kommentarvolltextsuche.meta.js
// ==/UserScript==

//CHANGELOG
// 2025-10-27 - 1.3.4
// ADD: @match für Gutscheine

(function() {
    'use strict';

    // Farbkonstanten für Light/Dark Mode
    const THEME_COLORS = {
        light: {
            background: '#e8f5e9',
            border: '#81c784',
            text: 'inherit',
            buttonBg: '#4CAF50',
            buttonText: 'white',
            closeButtonBg: '#ffffff',
            closeButtonBorder: '#c8d9e6',
            closeButtonText: '#005293'
        },
        dark: {
            background: '#2D2D2D',
            border: '#404040',
            text: '#E4E4E4',
            buttonBg: '#404040',
            buttonText: '#E4E4E4',
            closeButtonBg: '#2D2D2D',
            closeButtonBorder: '#404040',
            closeButtonText: '#E4E4E4'
        }
    };

    function getThemeColors() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        const isDark =
            htmlElement.classList.contains('dark') ||
            bodyElement.classList.contains('dark') ||
            (prefersDark && !htmlElement.classList.contains('light'));

        return isDark ? THEME_COLORS.dark : THEME_COLORS.light;
    }

    function updateUpdateNoticeTheme() {
        const colors = getThemeColors();
        const notice = document.querySelector('.comment-search-update-notice');
        if (notice) {
            notice.style.backgroundColor = colors.background;
            notice.style.borderColor = colors.border;
            notice.style.color = colors.text;

            // Update button styles
            const openButton = notice.querySelector('button:not(.update-close-button)');
            if (openButton) {
                openButton.style.backgroundColor = colors.buttonBg;
                openButton.style.color = colors.buttonText;
            }

            const closeButton = notice.querySelector('.update-close-button');
            if (closeButton) {
                closeButton.style.backgroundColor = colors.closeButtonBg;
                closeButton.style.borderColor = colors.closeButtonBorder;
                closeButton.style.color = colors.closeButtonText;
            }
        }
    }

    // Theme Observer
    const themeObserver = new MutationObserver(updateUpdateNoticeTheme);

    // Observer für HTML und Body Element einrichten
    const targetNodes = [document.documentElement, document.body];
    targetNodes.forEach(node => {
        themeObserver.observe(node, {
            attributes: true,
            attributeFilter: ['class']
        });
    });

    // System Theme Observer
    const systemThemeObserver = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeObserver.addEventListener('change', updateUpdateNoticeTheme);

    const SCRIPT_VERSION = (() => {
        try {
            if (typeof GM_info !== 'undefined') {
                if (GM_info.script && GM_info.script.version) {
                    return GM_info.script.version;
                }
                if (GM_info.scriptMetaStr) {
                    const match = GM_info.scriptMetaStr.match(/@version\s+([^\s]+)/);
                    if (match) {
                        return match[1];
                    }
                }
            }
        } catch (error) {
            console.warn('Kann Skriptversion nicht auslesen:', error);
        }
        return '0.0.0';
    })();
    const UPDATE_NOTICE_KEY = 'commentSearch_noticeShown';

    function parseVersion(version) {
        if (!version) return [];
        return version.split('.').map(part => parseInt(part, 10) || 0);
    }

    function isVersionGreater(a, b) {
        if (!b) return true;
        const aParts = parseVersion(a);
        const bParts = parseVersion(b);
        const maxLength = Math.max(aParts.length, bParts.length);
        for (let i = 0; i < maxLength; i++) {
            const aValue = aParts[i] || 0;
            const bValue = bParts[i] || 0;
            if (aValue > bValue) return true;
            if (aValue < bValue) return false;
        }
        return false;
    }

    function displayUpdateNotice(searchContainer) {
        if (!searchContainer || !searchContainer.parentNode) return;

        const parent = searchContainer.parentNode;
        if (parent.querySelector('.comment-search-update-notice')) return;

        const notice = document.createElement('div');
        notice.className = 'comment-search-update-notice';
        const isDarkTheme = getThemeColors();
        notice.style.cssText = `
            flex-basis: 100%;
            margin: 10px 0;
            padding: 12px 16px;
            background-color: ${isDarkTheme ? '#2D2D2D' : '#e8f5e9'};
            border: 1px solid ${isDarkTheme ? '#404040' : '#81c784'};
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            color: ${isDarkTheme ? '#E4E4E4' : 'inherit'};
        `;

        const message = document.createElement('div');
        message.style.flex = '1';
        message.style.fontSize = '14px';
        message.textContent = 'mydealz Kommentarvolltextsuche wurde auf Version ' + SCRIPT_VERSION + ' aktualisiert.';

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '8px';
        actions.style.alignItems = 'center';

        const markAcknowledged = () => {
            try {
                localStorage.setItem(UPDATE_NOTICE_KEY, SCRIPT_VERSION);
            } catch (error) {
                console.warn('Kann Update-Hinweis nicht speichern:', error);
            }
        };

        const openButton = document.createElement('button');
        openButton.type = 'button';
        openButton.textContent = 'Changelog';
        openButton.style.cssText = `
            background-color: ${isDarkTheme ? '#404040' : '#4CAF50'};
            color: ${isDarkTheme ? '#E4E4E4' : 'white'};
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            white-space: nowrap;
            transition: background-color 0.2s ease;
        `;

        openButton.addEventListener('mouseover', () => {
            openButton.style.backgroundColor = isDarkTheme ? '#505050' : '#45a049';
        });

        openButton.addEventListener('mouseout', () => {
            openButton.style.backgroundColor = isDarkTheme ? '#404040' : '#4CAF50';
        });

        openButton.addEventListener('click', () => {
            window.open('https://greasyfork.org/de/scripts/524875-mydealz-kommentarvolltextsuche/versions', '_blank');
            markAcknowledged();
            notice.remove();
        });

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'update-close-button';
        closeButton.setAttribute('aria-label', 'Hinweis schliessen');
        closeButton.innerHTML = `
            <span class="update-close-button__icon">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3.76 3.76a.75.75 0 0 1 1.06 0L8 6.94l3.18-3.18a.75.75 0 1 1 1.06 1.06L9.06 8l3.18 3.18a.75.75 0 1 1-1.06 1.06L8 9.06l-3.18 3.18a.75.75 0 1 1-1.06-1.06L6.94 8l-3.18-3.18a.75.75 0 0 1 0-1.06z" fill="currentColor"></path>
                </svg>
            </span>
        `;

        closeButton.addEventListener('click', () => {
            markAcknowledged();
            notice.remove();
        });

        actions.appendChild(openButton);
        actions.appendChild(closeButton);

        notice.appendChild(message);
        notice.appendChild(actions);
        parent.insertBefore(notice, searchContainer);
    }

    function maybeShowUpdateNotice(searchContainer) {
        let storedVersion = null;
        try {
            storedVersion = localStorage.getItem(UPDATE_NOTICE_KEY);
        } catch (error) {
            console.warn('Kann Update-Hinweis nicht lesen:', error);
        }

        if (storedVersion && !isVersionGreater(SCRIPT_VERSION, storedVersion)) {
            return;
        }

        displayUpdateNotice(searchContainer);
    }

    let newWindow;
    let isSearchCancelled = false;
    const API_URL = 'https://www.mydealz.de/graphql';

    // Basis-Funktionen
    function getDealId() {
        const match = window.location.href.match(/-(\d+)(?=[/?#]|$)/);
        return match ? match[1] : null;
    }

    function extractThreadId() {
        const mainElement = document.getElementById('main');
        if (!mainElement) return null;

        const dataAttribute = mainElement.getAttribute('data-t-d');
        if (!dataAttribute) return null;

        return JSON.parse(dataAttribute.replace(/&quot;/g, '"')).threadId;
    }

    function cleanHTML(html) {
        return html.replace(/<.*?>/g, '');
    }

    function highlightSearchTerm(text, searchTerm) {
        return text.replace(
            new RegExp(searchTerm, 'gi'),
            match => `<b style="color:#4CAF50;">${match}</b>`
        );
    }

    // GraphQL-Funktionen
    async function fetchGraphQLData(query, variables) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query, variables})
        });

        if (response.status === 429) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            return fetchGraphQLData(query, variables);
        }

        const data = await response.json();
        if (data.errors) throw new Error(data.errors[0].message);
        return data.data.comments;
    }

    async function fetchAllPages(query, variables) {
        let currentPage = 1;
        let allData = [];
        while (true) {
            const data = await fetchGraphQLData(query, {...variables, page: currentPage});
            allData.push(...data.items);
            if (!data.pagination.next) break;
            currentPage++;
        }
        return allData;
    }

    async function fetchAllComments() {
        let allComments = [];
        let currentPage = 1;
        let hasMorePages = true;
        const threadId = extractThreadId();

        while (hasMorePages) {
            const query = `
                query comments($filter: CommentFilter!, $limit: Int, $page: Int) {
                    comments(filter: $filter, limit: $limit, page: $page) {
                        items { commentId replyCount }
                        pagination { current next }
                    }
                }
            `;
            const variables = {
                filter: { threadId: {eq: threadId} },
                limit: 100,
                page: currentPage
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({query, variables})
            });

            const data = await response.json();
            if (data.errors) throw new Error(data.errors[0].message);

            allComments = allComments.concat(data.data.comments.items);
            hasMorePages = !!data.data.comments.pagination.next;
            if (hasMorePages) currentPage++;
        }
        return allComments;
    }

    async function fetchReplies(commentId, threadId) {
        const query = `
            query comments($filter: CommentFilter!, $limit: Int, $page: Int) {
                comments(filter: $filter, limit: $limit, page: $page) {
                    items {
                        commentId preparedHtmlContent user { userId username }
                        replyCount createdAt parentReply { user { username } }
                    }
                    pagination { current next }
                }
            }
        `;

        return await fetchAllPages(query, {
            filter: {
                mainCommentId: commentId,
                threadId: {eq: threadId},
                order: {direction: "Ascending"}
            },
            limit: 100
        });
    }

    async function fetchDataAndReplies(forceReload = false, callbacks = {}) {
        const dealId = getDealId();
        const threadId = extractThreadId();
        const savedComments = JSON.parse(localStorage.getItem('dealComments_' + dealId)) || [];
        const { onTotalKnown, onCommentProcessed } = callbacks;

        const reportTotal = total => {
            if (typeof onTotalKnown === 'function') onTotalKnown(total);
        };

        const reportComment = (comment, meta) => {
            if (typeof onCommentProcessed === 'function') onCommentProcessed(comment, meta);
        };
        if (!forceReload && savedComments.length > 0) {
            const allComments = await fetchAllComments();
            let totalReplies = 0;
            allComments.forEach(comment => {
                totalReplies += comment.replyCount || 0;
            });

            const onlineCommentCount = allComments.length + totalReplies;
            const localCommentCount = savedComments.reduce((acc, comment) =>
                                                           acc + 1 + (comment.replies?.length || 0), 0);

            const newCommentsStatus = newWindow?.document?.getElementById('newCommentsStatus');
            if (localCommentCount < onlineCommentCount && newCommentsStatus) {
                const newCommentCount = onlineCommentCount - localCommentCount;
                newCommentsStatus.innerHTML = `Es sind ${newCommentCount} neue Kommentare vorhanden.
                     <button onclick=\"reloadFromServer()\"
                             style=\"background-color:#4CAF50;color:white;padding:5px 10px;
                                    border:none;border-radius:5px;font-size:14px;cursor:pointer;
                                    box-shadow:0 2px 4px rgba(0,0,0,0.2);\">
                         Neue Kommentare laden
                     </button>`;
                reportTotal(localCommentCount);
                return savedComments;
            }

            reportTotal(localCommentCount);
            let processedItems = 0;
            for (const comment of savedComments) {
                if (newWindow?.isSearchCancelled) break;

                const replies = comment.replies || [];
                processedItems += 1 + replies.length;

                reportComment(comment, { processedItems, totalItems: localCommentCount });
                updateProgress(processedItems, localCommentCount);

                await new Promise(resolve => setTimeout(resolve, 0));
            }

            return savedComments;
        }

        const query = `
            query comments($filter: CommentFilter!, $limit: Int, $page: Int) {
                comments(filter: $filter, limit: $limit, page: $page) {
                    items {
                        commentId preparedHtmlContent user { userId username }
                        replyCount createdAt
                    }
                    pagination { current next }
                }
            }
        `;

        newWindow.document.getElementById('progressBar').style.display = 'block';
        let allData = await fetchAllPages(query, {
            filter: {
                threadId: {eq: threadId},
                order: {direction: "Ascending"}
            },
            limit: 100
        });

        const totalItems = allData.length + allData.reduce((acc, c) => acc + (c.replyCount || 0), 0);
        reportTotal(totalItems);

        let processedItems = 0;

        for (const comment of allData) {
            if (newWindow.isSearchCancelled) break;

            processedItems++;
            updateProgress(processedItems, totalItems);

            if (comment.replyCount > 0) {
                const replies = await fetchReplies(comment.commentId, threadId);
                comment.replies = replies;
                processedItems += replies.length;
                updateProgress(processedItems, totalItems);
            } else {
                comment.replies = [];
            }

            reportComment(comment, { processedItems, totalItems });

            if (newWindow.isSearchCancelled) break;
        }

        if (!newWindow.isSearchCancelled) {
            localStorage.setItem('dealComments_' + dealId, JSON.stringify(allData));
            localStorage.setItem('dealComments_' + dealId + '_timestamp', new Date().toISOString());
        }

        return allData;
    }



    function updateProgress(processed, total) {
        const percentage = Math.round((processed / total) * 100);
        newWindow.document.getElementById('progress').innerText =
            processed === total ? 'Alle Kommentare durchsucht' :
        `Fortschritt: ${percentage}%`;
        newWindow.document.getElementById('progressBarFill').style.width = `${percentage}%`;
    }

    function ensurePlaceholder(state) {
        if (!state || !state.matchesContainer) return;
        if (state.matches.length === 0) {
            state.matchesContainer.innerHTML = '<p style="color:#666;">Noch keine Treffer gefunden...</p>';
        }
    }

    function updateSummary(state) {
        if (!state || !state.summaryElement) return;
        if (state.processedItems === 0 && state.matches.length === 0) {
            if (state.isSearching) {
                state.summaryElement.innerHTML = 'Suche läuft...';
                return;
            }
        }

        const processedText = state.totalItems
        ? `Es wurden ${state.processedItems} von ${state.totalItems} Kommentaren durchsucht`
            : `Es wurden ${state.processedItems} Kommentare durchsucht`;

        state.summaryElement.innerHTML =
            `${processedText} und ${state.matches.length} Treffer mit '${state.searchTerm}' gefunden.`;

        if (state.wasCancelled) {
            state.summaryElement.innerHTML +=
                ' <span style="color:#666;">Suche wurde abgebrochen. Zeige bisherige Ergebnisse.</span>';
        }
    }

    function renderMatches(state) {
        if (!state || !state.matchesContainer) return;
        if (state.matches.length === 0) {
            ensurePlaceholder(state);
            return;
        }

        const dealId = getDealId();
        const sortedMatches = state.matches.slice().sort((a, b) =>
                                                         state.sortType === 'newest' ? b.commentId - a.commentId : a.commentId - b.commentId
                                                        );

        const itemsHtml = sortedMatches.map(item => {
            const url = `https://www.mydealz.de/${dealId}#${item.type}-${item.commentId}`;
            const content = state.outputType === 'compact'
            ? cleanHTML(item.preparedHtmlContent)
            : item.preparedHtmlContent;

            return `<div class="${item.type}"
                             style="padding:10px;margin-bottom:10px;background-color:white;
                                    border-radius:5px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                        <a href="${url}" target="_blank">
                            🔗 ${item.createdAt} ${item.user.username}
                        </a>:
                        ${highlightSearchTerm(content, state.searchTerm)}
                    </div>`;
        }).join('');

        state.matchesContainer.innerHTML = itemsHtml;
    }

    function collectMatchesForState(comment, state) {
        const matches = [];
        const commentContent = comment.preparedHtmlContent || '';
        const username = comment.user?.username || '';
        const searchTerm = state.lowerSearchTerm;

        const matchesContent = commentContent.toLowerCase().includes(searchTerm);
        const matchesUsername = username.toLowerCase().includes(searchTerm);

        if ((state.searchType === 'all' && (matchesContent || matchesUsername)) ||
            (state.searchType === 'content' && matchesContent) ||
            (state.searchType === 'username' && matchesUsername)) {
            matches.push({
                type: 'comment',
                commentId: comment.commentId,
                preparedHtmlContent: comment.preparedHtmlContent,
                user: comment.user,
                createdAt: comment.createdAt
            });
        }

        if (comment.replies) {
            comment.replies.forEach(reply => {
                const replyContent = reply.preparedHtmlContent || '';
                const replyUsername = reply.user?.username || '';
                const replyMatchesContent = replyContent.toLowerCase().includes(searchTerm);
                const replyMatchesUsername = replyUsername.toLowerCase().includes(searchTerm);

                if ((state.searchType === 'all' && (replyMatchesContent || replyMatchesUsername)) ||
                    (state.searchType === 'content' && replyMatchesContent) ||
                    (state.searchType === 'username' && replyMatchesUsername)) {
                    matches.push({
                        type: 'reply',
                        commentId: reply.commentId,
                        preparedHtmlContent: reply.preparedHtmlContent,
                        user: reply.user,
                        createdAt: reply.createdAt
                    });
                }
            });
        }

        return matches;
    }

    function recomputeMatches(state) {
        if (!state) return;
        state.matches = [];
        state.allComments.forEach(comment => {
            const newMatches = collectMatchesForState(comment, state);
            if (newMatches.length) {
                state.matches.push(...newMatches);
            }
        });
        renderMatches(state);
        updateSummary(state);
    }





    async function searchComments(forceReload = false) {
        const rawSearchTerm = newWindow.document.getElementById('searchTerm').value.trim();
        if (!rawSearchTerm) {
            alert("Kein Suchbegriff eingegeben.");
            return;
        }

        isSearchCancelled = false;
        newWindow.isSearchCancelled = false;

        const searchButtonEl = newWindow.document.getElementById('searchButton');
        const cancelButtonEl = newWindow.document.getElementById('cancelButton');
        searchButtonEl.style.display = 'none';
        cancelButtonEl.style.display = 'flex';

        const progressBar = newWindow.document.getElementById('progressBar');
        const progressLabel = newWindow.document.getElementById('progress');
        const progressFill = newWindow.document.getElementById('progressBarFill');
        progressBar.style.display = 'block';
        progressLabel.innerText = 'Fortschritt: 0%';
        progressFill.style.width = '0%';

        const resultsRoot = newWindow.document.getElementById('results');
        resultsRoot.innerHTML = '';

        const summaryElement = newWindow.document.createElement('p');
        summaryElement.id = 'searchSummary';
        summaryElement.style.marginBottom = '15px';
        resultsRoot.appendChild(summaryElement);

        const matchesContainer = newWindow.document.createElement('div');
        matchesContainer.className = 'comments-container';
        resultsRoot.appendChild(matchesContainer);

        const searchTypeSelect = newWindow.document.getElementById('searchTypeSelect');
        const outputTypeSelect = newWindow.document.getElementById('outputTypeSelect');
        const sortTypeSelect = newWindow.document.getElementById('sortTypeSelect');

        const state = {
            searchTerm: rawSearchTerm,
            lowerSearchTerm: rawSearchTerm.toLowerCase(),
            matches: [],
            processedItems: 0,
            totalItems: 0,
            outputType: outputTypeSelect ? outputTypeSelect.value : 'compact',
            sortType: sortTypeSelect ? sortTypeSelect.value : 'newest',
            searchType: searchTypeSelect ? searchTypeSelect.value : 'all',
            matchesContainer,
            summaryElement,
            allComments: [],
            isSearching: true,
            wasCancelled: false
        };

        newWindow.currentSearchState = state;

        ensurePlaceholder(state);
        updateSummary(state);

        try {
            await fetchDataAndReplies(forceReload, {
                onTotalKnown: totalItems => {
                    state.totalItems = totalItems;
                    updateSummary(state);
                },
                onCommentProcessed: (comment, meta) => {
                    state.allComments.push(comment);
                    state.processedItems = meta.processedItems;
                    state.totalItems = meta.totalItems || state.totalItems;

                    const newMatches = collectMatchesForState(comment, state);
                    if (newMatches.length) {
                        state.matches.push(...newMatches);
                        renderMatches(state);
                    } else if (state.matches.length === 0) {
                        ensurePlaceholder(state);
                    }

                    updateSummary(state);
                }
            });

            state.isSearching = false;
            updateSummary(state);

            if (newWindow.isSearchCancelled) {
                state.wasCancelled = true;
                state.summaryElement.innerHTML +=
                    ' <span style="color:#666;">Suche wurde abgebrochen. Zeige bisherige Ergebnisse.</span>';
            } else if (state.matches.length === 0) {
                matchesContainer.innerHTML =
                    `<p style="color:#666;">Keine Treffer mit '${state.searchTerm}' gefunden.</p>`;
            }
        } catch (error) {
            state.isSearching = false;
            console.error('Error:', error);
            newWindow.document.getElementById('results').innerHTML =
                'Fehler bei der Suche: ' + error.message;
        } finally {
            state.isSearching = false;
            if (newWindow.currentSearchState === state) {
                searchButtonEl.style.display = 'flex';
                cancelButtonEl.style.display = 'none';
                progressBar.style.display = 'none';
            }
        }
    }




    function applySearchOptions() {
        if (!newWindow || !newWindow.document) return;
        const state = newWindow.currentSearchState;
        if (!state) return;

        const outputTypeSelect = newWindow.document.getElementById('outputTypeSelect');
        const sortTypeSelect = newWindow.document.getElementById('sortTypeSelect');
        const searchTypeSelect = newWindow.document.getElementById('searchTypeSelect');

        if (outputTypeSelect) state.outputType = outputTypeSelect.value;
        if (sortTypeSelect) state.sortType = sortTypeSelect.value;
        if (searchTypeSelect) state.searchType = searchTypeSelect.value;

        recomputeMatches(state);
    }

    function reloadFromServer() {
        const dealId = getDealId();
        localStorage.removeItem('dealComments_' + dealId);
        localStorage.removeItem('dealComments_' + dealId + '_timestamp');
        const statusEl = newWindow?.document?.getElementById('newCommentsStatus');
        if (statusEl) {
            statusEl.innerHTML = '';
        }
        searchComments(true);
    }

    function attachEventListeners() {
        newWindow.document.querySelectorAll('[data-search-option]')
            .forEach(element => {
            element.addEventListener('change', () => {
                if (typeof newWindow.applySearchOptions === 'function') {
                    newWindow.applySearchOptions();
                }
            });
        });
    }

    function handleSearch(searchInput) {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm || searchTerm === searchInput.placeholder) return;

        const title = document.title.replace(" | mydealz", "");
        newWindow = window.open('', '_blank');

        const isDarkTheme = getThemeColors();
        newWindow.document.write(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Kommentar-Suche</title>
                    <style>
                        :root { color-scheme: light; }
                        * { box-sizing: border-box; }
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: ${isDarkTheme ? '#141414' : '#f5f5f5'};
                            font-family: 'Segoe UI', Tahoma, sans-serif;
                            color: ${isDarkTheme ? '#E4E4E4' : '#222'};
                        }
                        a { color: #005293; text-decoration: none; }
                        a:hover { text-decoration: underline; }
                        #header {
                            background-color: ${isDarkTheme ? '#1A1A1A' : '#005293'};
                            min-height: 56px;
                            display: flex;
                            align-items: center;
                            width: 100%;
                            color: white;
                            padding: 0 16px;
                            border-bottom: ${isDarkTheme ? '1px solid #2D2D2D' : 'none'};
                        }
                        #header img { height: 40px; margin-right: 16px; }
                        #header h2 { margin: 0 auto; font-size: clamp(18px, 4vw, 24px); text-align: center; }
                        .search-page { padding: 18px 5vw 10px; max-width: 960px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; text-align: left; }
                        #searchForm { display: flex; flex-wrap: wrap; justify-content: flex-start; align-items: center; gap: 10px; width: 100%; }
                        #searchForm .search-input { flex: 1 1 320px; min-width: 230px; max-width: 480px; padding: 10px 12px; border-radius: 6px; border: 1px solid #ccc; font-size: 16px; }
                        #searchForm button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 16px; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: background-color 0.2s ease; }
                        #searchButton { background-color: #4CAF50; color: #fff; }
                        #searchButton:hover { background-color: #43a047; }
                        #cancelButton { background-color: #ff4444; color: #fff; display: none; }
                        #cancelButton:hover { background-color: #e53935; }
                        .button-icon { font-size: 18px; line-height: 1; }
                        #options { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; }
                        #options .option-group { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border: 1px solid #d0d0d0; border-radius: 999px; background-color: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
                        #options label { font-weight: 600; font-size: 14px; color: #005293; }
                        #options select { border: none; background: transparent; font-size: 14px; color: #222; padding: 4px 20px 4px 6px; cursor: pointer; appearance: none; -webkit-appearance: none; -moz-appearance: none; position: relative; }
                        #options .option-group { position: relative; }
                        #options .option-group::after { content: '\\25BE'; position: absolute; right: 10px; font-size: 12px; color: #005293; pointer-events: none; }
                        #options select:focus { outline: none; box-shadow: 0 0 0 2px rgba(0,82,147,0.25); border-radius: 999px; }
                        #newCommentsStatus { margin-top: 2px; }
                        #progress { text-align: center; font-size: 14px; color: #555; min-height: 18px; margin: 2px auto 0; }
                        #progressBar { display: none; width: 100%; max-width: 320px; margin: 6px auto 0; background-color: #e0e0e0; height: 16px; border-radius: 16px; overflow: hidden; }
                        #progressBarFill { width: 0%; height: 100%; background-color: #4CAF50; transition: width 0.3s ease; }
                        .update-close-button {
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            border: 1px solid #c8d9e6;
                            background-color: #ffffff;
                            color: #005293;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            padding: 0;
                            transition: all 0.2s ease;
                        }
                        .update-close-button:hover {
                            background-color: ${isDarkTheme ? '#505050' : '#f0f6fb'};
                            border-color: ${isDarkTheme ? '#505050' : '#a5c3dd'};
                            color: ${isDarkTheme ? '#FFFFFF' : '#003d73'};
                        }
                        .update-close-button__icon {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            line-height: 1;
                        }
                        .update-close-button__icon svg {
                            display: block;
                        }
                        #results {
                            width: 92%;
                            max-width: 960px;
                            margin: 10px auto 18px;
                            background-color: ${isDarkTheme ? '#1A1A1A' : '#fff'};
                            padding: 18px;
                            border-radius: 8px;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
                            color: ${isDarkTheme ? '#E4E4E4' : 'inherit'};
                        }
                        .comments-container > div {
                            margin-bottom: 12px;
                            background-color: ${isDarkTheme ? '#2D2D2D' : '#fff'} !important;
                            color: ${isDarkTheme ? '#E4E4E4' : 'inherit'} !important;
                        }
                        .comment-search-update-notice { flex-wrap: wrap; }
                        .comment-search-update-notice button { box-shadow: none; }
                        @media (max-width: 900px) {
                            .search-page { padding: 18px 24px 10px; }
                            #searchForm .search-input { min-width: 0; }
                            #results { width: 94%; }
                        }
                        @media (max-width: 640px) {
                            #options { flex-direction: column; align-items: stretch; }
                            #options .option-group { width: 100%; justify-content: space-between; border-radius: 14px; }
                            #options label { font-size: 15px; }
                            #options select { text-align: right; padding-right: 28px; }
                            #options .option-group::after { right: 12px; }
                        }
                    </style>
                </head>
                <body>
                    <div id="header">
                        <img src="https://www.mydealz.de/assets/img/logo/default-light_d4b86.svg"
                             alt="mydealz logo">
                        <h2>Kommentarvolltextsuche</h2>
                    </div>
                    ${createSearchForm(title, searchTerm)}
                </body>
            </html>
        `);

        newWindow.document.close();
        newWindow.searchComments = searchComments;
        newWindow.reloadFromServer = reloadFromServer;
        newWindow.applySearchOptions = applySearchOptions;
        newWindow.currentSearchState = null;
        newWindow.isSearchCancelled = false;
        attachEventListeners();
        newWindow.searchComments();
    }

    function createSearchForm(_title, searchTerm) {
        return `
            <div class="search-page">
                <form id="searchForm" onsubmit="searchComments(); return false;">
                    <input type="search" id="searchTerm" class="search-input" placeholder="Suchbegriff eingeben" value="${searchTerm}" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" data-bw-ignore="true" data-lpignore="true" data-form-type="other" data-pw-ignore="true" results="0">
                    <button type="submit" id="searchButton">
                        <span class="button-icon">&#128269;</span><span>Suchen</span>
                    </button>
                    <button type="button" id="cancelButton" onclick="isSearchCancelled = true;">
                        <span class="button-icon">&#10005;</span><span>Abbrechen</span>
                    </button>
                </form>
                <div id="options">
                    <div class="option-group">
                        <label for="sortTypeSelect">Sortierung</label>
                        <select id="sortTypeSelect" data-search-option="sortType">
                            <option value="newest" selected>Neueste zuerst</option>
                            <option value="oldest">Älteste zuerst</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label for="searchTypeSelect">Suchen in</label>
                        <select id="searchTypeSelect" data-search-option="searchType">
                            <option value="all" selected>Kommentare &amp; Benutzernamen</option>
                            <option value="content">nur Kommentare</option>
                            <option value="username">nur Benutzernamen</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label for="outputTypeSelect">Darstellung</label>
                        <select id="outputTypeSelect" data-search-option="outputType">
                            <option value="compact" selected>Kompakt</option>
                            <option value="detailed">Ausführlich</option>
                        </select>
                    </div>
                    <div id="newCommentsStatus"></div>
                </div>
                <div id="progress"></div>
                <div id="progressBar">
                    <div id="progressBarFill"></div>
                </div>
            </div>
            <div id="results"></div>
        `;
    }

    // Initialisierung
    const observer = new MutationObserver((_mutations, obs) => {
        if (document.querySelector('.comment-search-container')) return;

        const sortLabel = document.querySelector('.size--all-m.size--fromW3-l.overflow--wrap-off');
        if (sortLabel && sortLabel.textContent.includes('sortiert nach')) {
            injectSearchBox(sortLabel);
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function injectSearchBox(targetElement) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'comment-search-container';
        searchContainer.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-left: 15px;
            margin-right: 15px;
            flex: 0 1 auto;
        `;

        // Add responsive styles
        const responsiveStyle = document.createElement('style');
        responsiveStyle.textContent = `
            @media screen and (max-width: 768px) {
                .comment-search-container {
                    flex-basis: 100%;
                    margin: 10px 0;
                    justify-content: space-between;
                    order: 2;
                }
                .comment-search-container input {
                    width: calc(100% - 90px) !important;
                }
                .flex--inline.gap--h-1 {
                    flex-wrap: wrap;
                    width: 100%;
                }
                .button--shape-circle[title="Folgen"] {
                    order: 1;
                    margin-left: 10px !important;
                }
            }
        `;
        document.head.appendChild(responsiveStyle);

        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.placeholder = 'Wort/Benutzername suchen';
        searchInput.setAttribute('autocomplete', 'off');
        searchInput.setAttribute('autocapitalize', 'none');
        searchInput.setAttribute('autocorrect', 'off');
        searchInput.setAttribute('spellcheck', 'false');
        searchInput.setAttribute('data-bw-ignore', 'true');
        searchInput.setAttribute('data-lpignore', 'true');
        searchInput.setAttribute('data-form-type', 'other');
        searchInput.setAttribute('data-pw-ignore', 'true');
        searchInput.setAttribute('results', '0');
        searchInput.setAttribute('name', 'comment-search-input');
        searchInput.setAttribute('role', 'searchbox');
        searchInput.style.cssText = `
            width: 240px;
            padding: 4px 8px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 14px;
            height: 28px;
            color: #666;
            background-color: white;
        `;

        const searchButton = document.createElement('button');
        searchButton.textContent = 'Suchen';
        searchButton.style.cssText = `
            margin-left: 8px;
            padding: 4px 12px;
            border: none;
            border-radius: 4px;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            white-space: nowrap;
        `;

        searchInput.addEventListener('focus', () => {
            if (searchInput.value === searchInput.placeholder) {
                searchInput.value = '';
                searchInput.style.color = '#000';
            }
        });

        searchInput.addEventListener('blur', () => {
            if (!searchInput.value.trim()) {
                searchInput.value = searchInput.placeholder;
                searchInput.style.color = '#666';
            }
        });

        searchButton.addEventListener('click', () => handleSearch(searchInput));
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') handleSearch(searchInput);
        });

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);

        const bellIcon = targetElement.parentNode.querySelector('button[title="Folgen"]');
        if (bellIcon) {
            bellIcon.parentNode.insertBefore(searchContainer, bellIcon);
        } else {
            targetElement.parentNode.appendChild(searchContainer);
        }

        maybeShowUpdateNotice(searchContainer);
    }
})();