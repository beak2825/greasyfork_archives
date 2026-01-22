// ==UserScript==
// @name         ExamTopics Unlocker & UI Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto-reveal answers and bypass content restrictions on ExamTopics. Includes Google Search fallback.
// @author       Antigravity
// @license      MIT
// @match        https://www.examtopics.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563542/ExamTopics%20Unlocker%20%20UI%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/563542/ExamTopics%20Unlocker%20%20UI%20Cleaner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const AUTO_REVEAL = true;
    const BYPASS_RESTRICTIONS = true;

    // --- Styles ---
    GM_addStyle(`
        .vote-bar, .comments-container, .new-comment-box { display: none !important; }
        .question-body { font-size: 1.1em; line-height: 1.5; color: #333; }
        .correct-answer-box { background-color: #e8f5e9 !important; border-left: 5px solid #4caf50; padding: 10px; margin-top: 10px; }
        .bypass-badge { 
            position: fixed; bottom: 10px; right: 10px; 
            background: #4caf50; color: white; padding: 5px 10px; 
            border-radius: 5px; font-size: 12px; z-index: 9999; opacity: 0.8; pointer-events: none;
        }
        /* Top Bar Styles */
        #et-unlocker-bar {
            position: fixed; top: 0; left: 0; width: 100%; 
            background: #fff; border-bottom: 3px solid #2196F3; 
            padding: 10px 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
            z-index: 2147483647; /* Max Z-Index */
            display: flex; align-items: center; justify-content: center; gap: 15px; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-sizing: border-box;
        }
        .et-btn {
            border: none; padding: 8px 16px; 
            cursor: pointer; border-radius: 4px; font-weight: bold; font-size: 14px;
            transition: opacity 0.2s; white-space: nowrap;
        }
        .et-btn:hover { opacity: 0.9; }
        .et-btn-primary { background: #2196F3; color: white; }
        .et-btn-warning { background: #ff9800; color: white; }
        .et-status { color: #555; font-size: 14px; }
        
        /* Clean up ads and sidebars */
        .adsbygoogle, .action-row-container, .w-100.d-print-none { display: none !important; }
    `);

    // --- Helper: Auto Reveal Answer ---
    function revealAnswer() {
        if (!AUTO_REVEAL) return;
        try {
            const revealBtns = document.querySelectorAll('.reveal-solution');
            revealBtns.forEach(btn => {
                const parent = btn.closest('.question-body') || document.body;
                const answerBlock = parent.querySelector('.question-answer');
                if (answerBlock) {
                    answerBlock.classList.remove('d-none');
                    btn.classList.add('d-none');
                    const hideBtn = parent.querySelector('.hide-solution');
                    if (hideBtn) hideBtn.classList.remove('d-none');
                } else {
                    btn.click();
                }
            });
        } catch (e) { console.error(e); }
    }

    // --- Helper: Fetch Discussion Content ---
    function fetchDiscussionContent(discussionUrl, container) {
        if (!discussionUrl) return;

        console.log("Fetching discussion content from:", discussionUrl);
        container.innerHTML = '<div style="text-align:center; padding: 40px; font-size:18px; color:#666;">🔄 Fetching Discussion Content...<br/><small>(Bypassing restrictions)</small></div>';

        GM_xmlhttpRequest({
            method: "GET",
            url: discussionUrl,
            onload: function (response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const questionContent = doc.querySelector('.card-body.question-body');

                    if (questionContent) {
                        console.log("Content found. Injecting...");
                        container.innerHTML = '';

                        // Inject into a nice wrapper
                        const wrapper = document.createElement('div');
                        wrapper.style.cssText = "background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);";
                        wrapper.appendChild(questionContent);

                        container.appendChild(wrapper);

                        // Inject source link
                        const linkInfo = document.createElement('div');
                        linkInfo.innerHTML = `<small style="display:block; margin-top:15px; border-top:1px solid #eee; padding-top:10px; color:#999;">Source: <a href="${discussionUrl}" target="_blank">Discussion Page</a></small>`;
                        container.appendChild(linkInfo);

                        setTimeout(revealAnswer, 500);

                        // Update Badge
                        let badge = document.querySelector('.bypass-badge');
                        if (!badge) {
                            badge = document.createElement('div');
                            badge.className = 'bypass-badge';
                            document.body.appendChild(badge);
                        }
                        badge.innerText = 'Unlocked via Discussion';
                        badge.style.background = '#2196F3';
                    } else {
                        container.innerHTML = `<div style="color:red; padding:20px; font-weight:bold; text-align:center;">Error: Question content not found on Discussion page.<br>The page structure might be unusual.</div><div style="text-align:center; margin-top:10px;"><a href="${discussionUrl}" target="_blank" class="et-btn et-btn-primary">Open Discussion Page Manually</a></div>`;
                    }
                } else {
                    container.innerHTML = `<div style="color:red; padding:20px; text-align:center;">Error: Failed to fetch (Status ${response.status}).</div>`;
                }
            }
        });
    }

    // --- Main Logic ---
    function init() {
        console.log("ExamTopics Unlocker Started v1.3");
        setTimeout(revealAnswer, 1000);

        const isExamView = window.location.href.includes('/view/');

        if (isExamView && BYPASS_RESTRICTIONS) {

            // Determine Context
            const pathParts = window.location.pathname.split('/');
            // ex: /exams/vmware/2v0-17-25/view/2/
            let examCode = "";
            let questionNum = "";
            if (pathParts.length >= 6) {
                examCode = pathParts[3];
                questionNum = pathParts[5];
            }

            // Find Discussion Link
            let discussionBtn = document.querySelector('a[href*="/discussions/"]');

            // Determine Injection Point (Fallbacks)
            let targetContainer = document.querySelector('.card-body.question-body') ||
                document.querySelector('.questions-container') ||
                document.querySelector('.container.py-4') ||
                document.body;

            // Create Fixed Top Bar
            const topBar = document.createElement('div');
            topBar.id = 'et-unlocker-bar';

            topBar.innerHTML = `<div style="font-weight:bold; color:#2196F3; font-size:16px;">🔓 ExamTopics Unlocker</div>`;

            let hasControls = false;

            if (discussionBtn) {
                // Case A: Link exists
                const discussionUrl = discussionBtn.href;
                const btn = document.createElement('button');
                btn.className = 'et-btn et-btn-warning';
                btn.innerText = "⚡ Load Content from Discussion Page";
                btn.title = "Replace current view with Discussion content";
                btn.onclick = (e) => { e.preventDefault(); fetchDiscussionContent(discussionUrl, targetContainer); };

                topBar.appendChild(btn);
                hasControls = true;
            } else {
                // Case B: No Link (Blocked/Captcha) -> Offer Search
                // Heuristic: Try to match "Question X" broadly.
                // Query: site:examtopics.com "2V0-17.25" "Question 3"
                if (examCode && questionNum) {
                    const query = `site:examtopics.com "${examCode}" "Question ${questionNum}"`;
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

                    const msg = document.createElement('span');
                    msg.className = 'et-status';
                    msg.innerHTML = `Discussion Link Hidden by Site.`;
                    topBar.appendChild(msg);

                    const searchBtn = document.createElement('button');
                    searchBtn.className = 'et-btn et-btn-primary';
                    searchBtn.innerText = `🔍 Search Google for Q${questionNum}`;
                    searchBtn.onclick = () => window.open(searchUrl, '_blank');
                    topBar.appendChild(searchBtn);

                    hasControls = true;
                }
            }

            // Close Button
            const closeBtn = document.createElement('button');
            closeBtn.innerText = "✕";
            closeBtn.style.cssText = "background:none; border:none; font-size:18px; cursor:pointer; margin-left: auto; color: #999;";
            closeBtn.onclick = () => { topBar.remove(); document.body.style.marginTop = ""; };
            topBar.appendChild(closeBtn);

            if (hasControls) {
                document.body.appendChild(topBar);
                // Adjust body margin so bar doesn't cover content
                document.body.style.marginTop = "60px";
            }
        }

        // Discussion Page specific
        if (window.location.href.includes('/discussions/')) {
            revealAnswer();
        }
    }

    window.addEventListener('load', init);

})();
