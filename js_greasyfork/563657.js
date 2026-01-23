// ==UserScript==
// @name         SaSu Improvements Script
// @namespace    Violentmonkey Scripts
// @match        https://sanctioned-suicide.net/*
// @match        https://sanctionedsuicide.site/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @version      1.1.1
// @author       heywey
// @license      MIT
// @description  Fix some annoyances with Sanctioned Suicide forums.
// @downloadURL https://update.greasyfork.org/scripts/563657/SaSu%20Improvements%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/563657/SaSu%20Improvements%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULTS = {
        REPLACEMENT_WORD: "",
        REMOVE_SITE_NAME: false,
        MAX_SIGNATURE_HEIGHT: 150,
        PREVENT_GIF_AUTOPLAY: true,
        HIDE_BADGE_INDICATOR: true,
        NORMALIZE_CHAT_COLOR: true,
        USE_24H_TIME: false,
        ADD_JUMP_TO_NEW: true,
        ADD_REPORT_BUTTON: true,
        FILTER_KEYWORDS: [],
        HIDE_FOREIGN_SUGGESTIONS: true,
        FILTER_THREADS: true,
        FILTER_POSTS: true
    };

    const getSetting = (key) => GM_getValue(key, DEFAULTS[key]);

    const SETTINGS = {
        replacementWord: getSetting('REPLACEMENT_WORD'),
        removeSiteName: getSetting('REMOVE_SITE_NAME'),
        maxSigHeight: getSetting('MAX_SIGNATURE_HEIGHT'),
        preventGifAutoplay: getSetting('PREVENT_GIF_AUTOPLAY'),
        hideBadge: getSetting('HIDE_BADGE_INDICATOR'),
        normalizeChat: getSetting('NORMALIZE_CHAT_COLOR'),
        use24h: getSetting('USE_24H_TIME'),
        jumpToNew: getSetting('ADD_JUMP_TO_NEW'),
        reportButton: getSetting('ADD_REPORT_BUTTON'),
        keywords: getSetting('FILTER_KEYWORDS'),
        hideForeign: getSetting('HIDE_FOREIGN_SUGGESTIONS'),
        filterThreads: getSetting('FILTER_THREADS'),
        filterPosts: getSetting('FILTER_POSTS')
    };

    // Core utilities
    const injectCss = css => {
        if (!css) return;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    // Settings menu injection
    const injectSettingsMenu = () => {
        if (!window.location.pathname.includes('/account/preferences')) return;

        const container = document.querySelector('.p-body-pageContent');
        const targetForm = document.querySelector('form[action="/account/preferences"]');
        if (!container || !targetForm) return;

        const keywordString = Array.isArray(SETTINGS.keywords) ? SETTINGS.keywords.join('\n') : '';

        const settingsBlock = document.createElement('div');
        settingsBlock.className = 'block';
        settingsBlock.style.marginBottom = '20px';

        // Add autocomplete="off" to all input fields
        settingsBlock.innerHTML = `
            <div class="block-container">
                <h2 class="block-header">SaSu Improvements Settings</h2>
                <div class="block-body">
                    <dl class="formRow">
                        <dt><div class="formRow-labelWrapper"><label class="formRow-label">Privacy</label></div></dt>
                        <dd>
                            <ul class="inputChoices" role="group">
                                <li class="inputChoices-choice" style="padding-left: 0px;">
                                    <div>Replacement Word</div>
                                    <input type="text" class="input" id="sasu_replacement_word" value="${SETTINGS.replacementWord}" placeholder="e.g. sports" style="max-width: 250px;" autocomplete="off">
                                    <dfn class="inputChoices-explain">Replaces "Suicide" in site headers/titles (big text like forum names, etc.). Leave empty to disable.</dfn>
                                </li>
                                <li class="inputChoices-choice">
                                    <label class="iconic">
                                        <input type="checkbox" id="sasu_remove_site_name" ${SETTINGS.removeSiteName ? 'checked' : ''} autocomplete="off">
                                        <i aria-hidden="true"></i>
                                        <span class="iconic-label">Remove Site Name from Tab Title</span>
                                      <dfn class="inputChoices-explain">i.e. " | Sanctioned Suicide"</dfn>
                                    </label>
                                </li>
                            </ul>
                        </dd>
                    </dl>

                    <hr class="formRowSep">

                    <dl class="formRow">
                        <dt><div class="formRow-labelWrapper"><label class="formRow-label">Signatures</label></div></dt>
                        <dd>
                            <ul class="inputChoices" role="group">
                                <li class="inputChoices-choice" style="padding-left: 0px;">
                                    <div>Max Signature Height (px)</div>
                                    <input type="number" class="input" id="sasu_max_sig_height" value="${SETTINGS.maxSigHeight}" style="max-width: 100px;" autocomplete="off">
                                  <dfn class="inputChoices-explain">Sets a maximum height for signatures - overflow gets a scrollbar</dfn>
                                </li>
                                <li class="inputChoices-choice">
                                    <label class="iconic">
                                        <input type="checkbox" id="sasu_prevent_gif" ${SETTINGS.preventGifAutoplay ? 'checked' : ''} autocomplete="off">
                                        <i aria-hidden="true"></i>
                                        <span class="iconic-label">Prevent GIF Autoplay in Signatures</span>
                                      <dfn class="inputChoices-explain">GIFs in signatures are shown as a black box until hovered</dfn>
                                    </label>
                                </li>
                            </ul>
                        </dd>
                    </dl>

                    <hr class="formRowSep">

                    <dl class="formRow">
                        <dt><div class="formRow-labelWrapper"><label class="formRow-label">Visual tweaks</label></div></dt>
                        <dd>
                            <ul class="inputChoices" role="group">
                                <li class="inputChoices-choice">
                                    <label class="iconic">
                                        <input type="checkbox" id="sasu_hide_badge" ${SETTINGS.hideBadge ? 'checked' : ''} autocomplete="off">
                                        <i aria-hidden="true"></i>
                                        <span class="iconic-label">Hide Useless Chat Notification Bubble</span>
                                    </label>
                                </li>
                                <li class="inputChoices-choice">
                                    <label class="iconic">
                                        <input type="checkbox" id="sasu_normalize_chat" ${SETTINGS.normalizeChat ? 'checked' : ''} autocomplete="off">
                                        <i aria-hidden="true"></i>
                                        <span class="iconic-label">Normalize Chat Text Color</span>
                                      <dfn class="inputChoices-explain">All text in chat messages is set to the default color</dfn>
                                    </label>
                                </li>
                                <li class="inputChoices-choice">
                                    <label class="iconic">
                                        <input type="checkbox" id="sasu_use_24h" ${SETTINGS.use24h ? 'checked' : ''} autocomplete="off">
                                        <i aria-hidden="true"></i>
                                        <span class="iconic-label">Use 24-Hour Time Format</span>
                                    </label>
                                </li>
                            </ul>
                        </dd>
                    </dl>

                    <hr class="formRowSep">

                    <dl class="formRow">
                        <dt><div class="formRow-labelWrapper"><label class="formRow-label">Navigation</label></div></dt>
                        <dd>
                            <ul class="inputChoices" role="group">
                                <li class="inputChoices-choice">
                                    <label class="iconic">
                                        <input type="checkbox" id="sasu_jump_new" ${SETTINGS.jumpToNew ? 'checked' : ''} autocomplete="off">
                                        <i aria-hidden="true"></i>
                                        <span class="iconic-label">Add "Jump to new" button to threads</span>
                                      <dfn class="inputChoices-explain">Adds a link to the latest post, even on threads previously read</dfn>
                                    </label>
                                </li>
                                <li class="inputChoices-choice">
                                    <label class="iconic">
                                        <input type="checkbox" id="sasu_report_btn" ${SETTINGS.reportButton ? 'checked' : ''} autocomplete="off">
                                        <i aria-hidden="true"></i>
                                        <span class="iconic-label">Add "Report" button to profile popups</span>
                                    </label>
                                </li>
                                <li class="inputChoices-choice">
                                    <label class="iconic">
                                        <input type="checkbox" id="sasu_hide_foreign" ${SETTINGS.hideForeign ? 'checked' : ''} autocomplete="off">
                                        <i aria-hidden="true"></i>
                                        <span class="iconic-label">Hide suggested threads from other subforums</span>
                                    </label>
                                </li>
                            </ul>
                        </dd>
                    </dl>

                    <hr class="formRowSep">

                    <dl class="formRow formRow--input">
                        <dt><div class="formRow-labelWrapper"><label class="formRow-label">Content filter</label></div></dt>
                        <dd>
                            <textarea class="input" id="sasu_keywords" rows="3" placeholder="e.g.:&#10;self harm&#10;cutting" autocomplete="off">${keywordString}</textarea>
                            <dfn class="inputChoices-explain">Separate keywords with new lines.</dfn>
                            <ul class="inputChoices" style="margin-top: 10px;">
                                <li class="inputChoices-choice">
                                    <label class="iconic">
                                        <input type="checkbox" id="sasu_filter_threads" ${SETTINGS.filterThreads ? 'checked' : ''} autocomplete="off">
                                        <i aria-hidden="true"></i>
                                        <span class="iconic-label">Filter Thread Titles</span>
                                      <dfn class="inputChoices-explain">Threads with titles containing any filtered keywords</dfn>
                                    </label>
                                </li>
                                <li class="inputChoices-choice">
                                    <label class="iconic">
                                        <input type="checkbox" id="sasu_filter_posts" ${SETTINGS.filterPosts ? 'checked' : ''} autocomplete="off">
                                        <i aria-hidden="true"></i>
                                        <span class="iconic-label">Filter Posts</span>
                                      <dfn class="inputChoices-explain">Individual posts containing any filtered keywords</dfn>
                                    </label>
                                </li>
                            </ul>
                        </dd>
                    </dl>

                    <dl class="formRow formSubmitRow">
                        <dt></dt>
                        <dd>
                            <div class="formSubmitRow-main">
                                <div class="formSubmitRow-bar"></div>
                                <div class="formSubmitRow-controls">
                                    <button type="button" id="sasu_save_btn" class="button--primary button button--icon button--icon--save rippleButton">
                                        <span class="button-text">Save Userscript Settings</span>
                                    </button>
                                </div>
                            </div>
                        </dd>
                    </dl>
                </div>
            </div>
        `;

        container.insertBefore(settingsBlock, targetForm);

        document.getElementById('sasu_save_btn').addEventListener('click', function() {
            GM_setValue('REPLACEMENT_WORD', document.getElementById('sasu_replacement_word').value);
            GM_setValue('REMOVE_SITE_NAME', document.getElementById('sasu_remove_site_name').checked);
            GM_setValue('MAX_SIGNATURE_HEIGHT', parseInt(document.getElementById('sasu_max_sig_height').value) || 150);
            GM_setValue('PREVENT_GIF_AUTOPLAY', document.getElementById('sasu_prevent_gif').checked);
            GM_setValue('HIDE_BADGE_INDICATOR', document.getElementById('sasu_hide_badge').checked);
            GM_setValue('NORMALIZE_CHAT_COLOR', document.getElementById('sasu_normalize_chat').checked);
            GM_setValue('USE_24H_TIME', document.getElementById('sasu_use_24h').checked);
            GM_setValue('ADD_JUMP_TO_NEW', document.getElementById('sasu_jump_new').checked);
            GM_setValue('ADD_REPORT_BUTTON', document.getElementById('sasu_report_btn').checked);
            GM_setValue('HIDE_FOREIGN_SUGGESTIONS', document.getElementById('sasu_hide_foreign').checked);
            GM_setValue('FILTER_THREADS', document.getElementById('sasu_filter_threads').checked);
            GM_setValue('FILTER_POSTS', document.getElementById('sasu_filter_posts').checked);

            const rawKeywords = document.getElementById('sasu_keywords').value;
            const keywordArray = rawKeywords.split('\n').map(k => k.trim()).filter(k => k.length > 0);
            GM_setValue('FILTER_KEYWORDS', keywordArray);

            const btn = this;
            btn.querySelector('.button-text').textContent = 'Saved!';
            setTimeout(() => window.location.reload(), 500);
        });
    };

    // Text replacement module
    const applyReplacementWord = () => {
        if (!SETTINGS.replacementWord.trim()) return;

        const replacerLower = SETTINGS.replacementWord.toLowerCase();
        const replacerTitle = capitalize(replacerLower);

        const replaceText = node => {
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(node.tagName)) return;

            if (node.nodeType === Node.TEXT_NODE) {
                const originalText = node.textContent;
                const newText = originalText
                    .replace(/Suicide/g, replacerTitle)
                    .replace(/suicide/g, replacerLower);

                if (newText !== originalText) node.textContent = newText;
                return;
            }

            if (node.nodeType === Node.ELEMENT_NODE && !node.isContentEditable) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    replaceText(node.childNodes[i]);
                }
            }
        };

        document.querySelectorAll('h1, h2, h3, h4, h5').forEach(header => replaceText(header));

        let newTitle = document.title
            .replace(/Suicide/g, replacerTitle)
            .replace(/suicide/g, replacerLower);
        if (newTitle !== document.title) document.title = newTitle;
    };

    const applyRemoveSiteName = () => {
        if (!SETTINGS.removeSiteName) return;
        const newTitle = document.title.replace(/[\s|]*Sanctioned Suicide/gi, '');
        if (newTitle !== document.title) document.title = newTitle;
    };

    const applyMaxSignatureHeight = () => {
        if (SETTINGS.maxSigHeight <= 0) return;
        injectCss(`
            .message-signature {
                max-height: ${SETTINGS.maxSigHeight}px !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
            }
        `);
    };

    const applyPreventGifAutoplay = () => {
        if (!SETTINGS.preventGifAutoplay) return;
        const gifSelectors = [
            '.message-signature img[src*=".gif"]',
            '.message-signature img[data-url*=".gif"]',
            '.message-signature img[alt*=".gif"]'
        ].join(', ');
        const hoverSelectors = gifSelectors.split(', ').map(s => s + ':hover').join(', ');
        injectCss(`
            .message-signature .bbImageWrapper {
                background-color: #000 !important;
                display: inline-block !important;
            }
            .bbImageWrapper:hover {
              background-color: transparent !important;
            }
            ${gifSelectors} {
                opacity: 0 !important;
            }
            ${hoverSelectors} {
                opacity: 1 !important;
            }
        `);
    }

    const applyHideBadgeIndicator = () => {
        if (!SETTINGS.hideBadge) return;
        injectCss(`
            a.p-navgroup-link--chat.badgeContainer.badgeContainer--highlighted::after {
                content: none !important;
            }
            .badge { display: none !important; }
        `);
    };

    const applyNormalizeChatColor = () => {
        if (!SETTINGS.normalizeChat) return;
        injectCss('.siropuChatMessageText .fixed-color { color: inherit !important; }');
    };

    const applyHideForeignSuggestions = () => {
        if (!SETTINGS.hideForeign) return;
        const widget = document.querySelector('[data-widget-key="xfes_thread_view_below_quick_reply_similar_threads"]');
        if (!widget) return;

        const forumLinks = Array.from(document.querySelectorAll('.p-breadcrumbs a'))
            .filter(a => a.href.includes('/forums/'));
        if (!forumLinks.length) return;

        const currentSubforum = forumLinks[forumLinks.length - 1].textContent.trim();
        widget.querySelectorAll('.structItem--thread').forEach(thread => {
            const metaLink = thread.querySelector('.structItem-parts > li > a[href*="/forums/"]');
            if (metaLink && metaLink.textContent.trim() !== currentSubforum) {
                thread.remove();
            }
        });
    };

    const apply24HourTime = (root = document) => {
        if (!SETTINGS.use24h) return;
        const rootNode = (root && root.jquery) ? root[0] : root;

        rootNode.querySelectorAll('time.u-dt').forEach(time => {
            const match = time.textContent.match(/\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/i);
            if (!match) return;

            let [full, hours, minutes, period] = match;
            hours = parseInt(hours, 10);
            period = period.toUpperCase();

            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            time.textContent = time.textContent.replace(full, hours.toString().padStart(2, '0') + ':' + minutes);
        });
    };

    const hookXenForoTime = () => {
        if (!SETTINGS.use24h) return;
        apply24HourTime();

        const win = unsafeWindow;
        if (win.XF?.DynamicDate?.refresh) {
            const originalRefresh = win.XF.DynamicDate.refresh;
            const exportFunction = (typeof window.exportFunction === 'function') ? window.exportFunction : f => f;

            win.XF.DynamicDate.refresh = exportFunction(function(root) {
                originalRefresh.apply(this, arguments);
                apply24HourTime(root || document);
            }, win);
        }
    };

    const applyJumpToNew = () => {
        if (!SETTINGS.jumpToNew || !window.location.pathname.includes('/threads/')) return;
        const match = window.location.pathname.match(/(\/threads\/[^/]+\.\d+\/)/);
        if (!match) return;

        const targetUrl = match[1] + 'latest';
        document.querySelectorAll('.block-outer-opposite .buttonGroup').forEach(group => {
            const hasButton = Array.from(group.children).some(child =>
                child.textContent.trim() === 'Jump to new' ||
                (child.tagName === 'A' && child.href.includes('unread'))
            );
            if (!hasButton) {
                const btn = document.createElement('a');
                btn.className = 'button--link button rippleButton';
                btn.href = targetUrl;
                btn.innerHTML = '<span class="button-text">Jump to new</span>';
                group.insertBefore(btn, group.firstChild);
            }
        });
    };

    const applyReportButton = () => {
        if (!SETTINGS.reportButton) return;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;

                    // Search specifically for the actions container within added nodes
                    // Use querySelector because the added node might be a wrapper (e.g., .tooltip)
                    // or the container itself.
                    let actionsContainer = null;

                    if (node.classList.contains('memberTooltip-actions')) {
                        actionsContainer = node;
                    } else if (node.querySelector) {
                        actionsContainer = node.querySelector('.memberTooltip-actions');
                    }

                    if (actionsContainer && !actionsContainer.querySelector('.sasu-report-btn')) {
                        const tooltip = actionsContainer.closest('.memberTooltip');
                        if (!tooltip) continue;

                        // Find the username link to get the user ID/Slug
                        const nameLink = tooltip.querySelector('.memberTooltip-name a') || tooltip.querySelector('.memberTooltip-header a.avatar');
                        if (!nameLink) continue;

                        // Clean URL and append /report
                        const profileUrl = nameLink.href.replace(/\/+$/, '');
                        const reportUrl = `${profileUrl}/report`;

                        const reportBtn = document.createElement('a');
                        reportBtn.href = reportUrl;
                        reportBtn.className = 'button--link button sasu-report-btn';
                        reportBtn.innerHTML = '<span class="button-text">Report</span>';

                        // Append button
                        actionsContainer.appendChild(reportBtn);
                    }
                }
            }
        });

        // Use subtree: true to catch content injected into existing tooltips via AJAX
        observer.observe(document.body, { childList: true, subtree: true });
    };

    const applyKeywordFilter = () => {
        if (!SETTINGS.keywords?.length) return;
        const pattern = new RegExp(SETTINGS.keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');

        if (SETTINGS.filterThreads) {
            // Thread lists
            document.querySelectorAll('.structItem--thread').forEach(thread => {
                const title = thread.querySelector('.structItem-title');
                if (title && pattern.test(title.textContent)) thread.remove();
            });

            // Sidebar nodes
            document.querySelectorAll('.node-extra').forEach(extra => {
                const title = extra.querySelector('.node-extra-title');
                if (title && pattern.test(title.textContent)) extra.remove();
            });

            // Search results
            document.querySelectorAll('.block-row').forEach(row => {
                const title = row.querySelector('.contentRow-title');
                if (title && pattern.test(title.textContent)) extra.remove();
            });
        }

        if (SETTINGS.filterPosts) {
            document.querySelectorAll('.message--post').forEach(post => {
                const content = post.querySelector('.bbWrapper');
                if (content && pattern.test(content.textContent)) post.remove();
            });
        }
    };

    const init = () => {
        injectSettingsMenu();
        applyRemoveSiteName();
        applyReplacementWord();
        applyMaxSignatureHeight();
        applyPreventGifAutoplay();
        applyHideBadgeIndicator();
        applyHideForeignSuggestions();
        applyNormalizeChatColor();
        hookXenForoTime();
        applyJumpToNew();
        applyReportButton();
        applyKeywordFilter();
    };

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();