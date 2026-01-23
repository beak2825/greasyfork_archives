// ==UserScript==
// @name         ExamTopics Unlocker & UI Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  Auto-reveal answers and bypass content restrictions on ExamTopics. Includes Google Search fallback.
// @author       Antigravity
// @license      MIT
// @match        https://www.examtopics.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
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
        /* Relaxed Hiding Rules */
        /* .vote-bar and others are now visible so user can see community stats */
        /* .vote-bar, .new-comment-box { display: none !important; } */
        /* .comments-container was hidden, but user needs to see discussions */
        .question - body { font - size: 1.1em; line - height: 1.5; color: #333; }
        .correct - answer - box { background - color: #e8f5e9!important; border - left: 5px solid #4caf50; padding: 10px; margin - top: 10px; }
        .bypass - badge {
        position: fixed; bottom: 10px; right: 10px;
        background: #4caf50; color: white; padding: 5px 10px;
        border - radius: 5px; font - size: 12px; z - index: 9999; opacity: 0.8; pointer - events: none;
    }
    /* Top Bar Styles */
    #et - unlocker - bar {
        position: fixed; top: 0; left: 0; width: 100 %; height: auto; min - height: 60px;
        background: #fff; border - bottom: 3px solid #2196F3;
        padding: 10px 20px; box - shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z - index: 2147483647; /* Max Z-Index */
        display: flex; flex - wrap: wrap; align - items: center; justify - content: center; gap: 15px;
        font - family: sans - serif; box - sizing: border - box;
    }
        .et - btn {
        border: none; padding: 8px 16px;
        cursor: pointer; border - radius: 4px; font - weight: bold; font - size: 14px;
        transition: opacity 0.2s; white - space: nowrap; margin: 0;
    }
        .et - btn:hover { opacity: 0.9; }
        .et - btn - primary { background: #2196F3; color: white; }
        .et - btn - warning { background: #ff9800; color: white; }
        .et - btn - success { background: #4caf50; color: white; }
        .et - status { color: #555; font - size: 14px; font - weight: bold; }

        /* Clean up ads ONLY */
        .adsbygoogle { display: none !important; }
        /* .action-row-container, .w-100.d-print-none { display: none !important; } */

        /* Remove "Section not available" persistent popup */
        /* Remove "Section not available" persistent popup */
    #notRemoverPopup, .popup-overlay, #general-modal-outer { display: none !important; }
    
    /* Ensure Unlocker Bar is ALWAYS visible */
    #et-unlocker-bar { display: flex !important; opacity: 1 !important; visibility: visible !important; }
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
                        container.innerHTML = '';

                        const wrapper = document.createElement('div');
                        wrapper.style.cssText = "background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-top: 20px;";
                        wrapper.appendChild(questionContent);
                        container.appendChild(wrapper);

                        const linkInfo = document.createElement('div');
                        linkInfo.innerHTML = `< small style = "display:block; margin-top:15px; border-top:1px solid #eee; padding-top:10px; color:#999;" > Source: <a href="${discussionUrl}" target="_blank">Discussion Page</a></small > `;
                        container.appendChild(linkInfo);

                        setTimeout(revealAnswer, 500);

                        let badge = document.querySelector('.bypass-badge');
                        if (!badge) {
                            badge = document.createElement('div');
                            badge.className = 'bypass-badge';
                            document.body.appendChild(badge);
                        }
                        badge.innerText = 'Unlocked via Discussion';
                        badge.style.background = '#2196F3';
                    } else {
                        container.innerHTML = `< div style = "color:red; padding:20px; font-weight:bold; text-align:center;" > Error: Question content not found on Discussion page.</div > <div style="text-align:center; margin-top:10px;"><a href="${discussionUrl}" target="_blank" class="et-btn et-btn-primary">Open Discussion Page Manually</a></div>`;
                    }
                } else {
                    container.innerHTML = `< div style = "color:red; padding:20px; text-align:center;" > Error: Failed to fetch(Status ${response.status}).</div > `;
                }
            }
        });
    }

    // --- UI Injection ---
    function injectInterface() {
        // Only run on Exam View or Discussion pages
        const isExamView = window.location.href.includes('/exams/');
        const isDiscussion = window.location.href.includes('/discussions/');

        if ((!isExamView && !isDiscussion) || !BYPASS_RESTRICTIONS) return;

        // Check if already injected
        if (document.getElementById('et-unlocker-bar')) return;

        // Setup paths and Exam Code
        const pathParts = window.location.pathname.split('/');
        let examCode = "";

        // Attempt to parse Exam Code
        // View: /exams/vmware/2v0-17-25/view/2/ -> Index 3 might be exam code
        // Discussion: /discussions/vmware/view/315217-exam-2v0-1725-topic-1-question-2-discussion/
        // For discussion, extracting exam code is harder safely from URL structure alone, 
        // but often it's in the text or breadcrumbs. 
        // Let's try to grab it from URL if standard format, or fallback to known patterns.

        if (isExamView && pathParts.length >= 4) {
            examCode = pathParts[3];
        } else if (isDiscussion) {
            // Try to extract from URL slug: ...-exam-(CODE)-topic...
            const match = window.location.href.match(/exam-(.+?)-topic/);
            if (match) {
                examCode = match[1];
            } else {
                // Fallback: try directory structure if it matches view
                if (pathParts.length >= 3) examCode = pathParts[2]; // /discussions/vmware/ ... unlikely to be code
            }
        }

        // Format Exam Code: 2v0-17-25 -> 2V0-17.25
        let formattedCode = examCode ? examCode.toUpperCase().replace(/-/g, '.') : "";

        // Determine Default Question Number
        let defaultQuestionNum = "";

        if (isDiscussion) {
            // Extract "question-X" from URL
            const qMatch = window.location.href.match(/question-(\d+)-discussion/);
            if (qMatch) {
                const currentNum = parseInt(qMatch[1], 10);
                if (!isNaN(currentNum)) {
                    defaultQuestionNum = (currentNum + 1).toString(); // Default to Next
                }
            }
        }

        const discussionBtn = document.querySelector('a[href*="/discussions/"]');

        // Find main container
        let targetContainer = document.querySelector('.card-body.question-body') ||
            document.querySelector('.questions-container') ||
            document.querySelector('.container.py-4') ||
            document.body;

        // Create Bar
        const topBar = document.createElement('div');
        topBar.id = 'et-unlocker-bar';
        topBar.innerHTML = `< div style = "font-weight:bold; color:#2196F3; font-size:16px;" >🔓 Unlocker</div > `;

        // Button A: Load Discussion (if available) - Only relevant on View pages usually, or if button exists
        if (discussionBtn) {
            const discussionUrl = discussionBtn.href;
            const btn = document.createElement('button');
            btn.className = 'et-btn et-btn-warning';
            btn.innerText = "⚡ Load Discussion";
            btn.onclick = (e) => { e.preventDefault(); fetchDiscussionContent(discussionUrl, targetContainer); };
            topBar.appendChild(btn);
        }

        // Search UI Container
        const searchContainer = document.createElement('div');
        searchContainer.style.display = 'flex';
        searchContainer.style.alignItems = 'center';
        searchContainer.style.gap = '5px';

        // Input: Exam Code (Editable but prefilled)
        const codeInput = document.createElement('input');
        codeInput.type = 'text';
        codeInput.value = formattedCode;
        codeInput.placeholder = "Exam Code";
        codeInput.style.cssText = "width: 100px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; font-weight:bold;";
        searchContainer.appendChild(codeInput);

        // Input: Question Number
        const qNumInput = document.createElement('input');
        qNumInput.type = 'number';
        qNumInput.value = defaultQuestionNum;
        qNumInput.placeholder = "Q #";
        qNumInput.style.cssText = "width: 60px; padding: 5px; border: 1px solid #ccc; border-radius: 4px;";
        searchContainer.appendChild(qNumInput);

        // Button B: Google Search
        const searchBtn = document.createElement('button');
        searchBtn.className = 'et-btn et-btn-success';
        searchBtn.innerText = `🔍 Search`;
        searchBtn.title = "Search Google for this Question";
        searchBtn.onclick = () => {
            const code = codeInput.value.trim();
            const num = qNumInput.value.trim();
            if (code && num) {
                const query = `"${code}" "Question ${num}"`;
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.open(searchUrl, '_blank');
            } else {
                alert("Please enter Exam Code and Question Number");
            }
        };
        searchContainer.appendChild(searchBtn);

        // Button C: Direct Go (Google "I'm Feeling Lucky" + Redirect Handler)
        const luckyBtn = document.createElement('button');
        luckyBtn.className = 'et-btn et-btn-success';
        luckyBtn.style.backgroundColor = "#00796b"; // Teal distinct color
        luckyBtn.innerText = `🚀 Go`;
        luckyBtn.title = "Directly open the first Google result (Auto-skips Redirect Notice)";
        luckyBtn.onclick = async () => {
            const code = codeInput.value.trim();
            const num = qNumInput.value.trim();
            if (!code || !num) {
                alert("Please enter Exam Code and Question Number");
                return;
            }

            luckyBtn.disabled = true;
            luckyBtn.innerText = "⌛ Google...";

            // Query: site:examtopics.com "CODE" "Question NUM"
            // Use btnI=1 for I'm Feeling Lucky
            const query = `site:examtopics.com "${code}" "Question ${num}"`;
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`;

            GM_xmlhttpRequest({
                method: "GET",
                url: searchUrl,
                onload: function (response) {
                    // Check where we landed
                    const finalUrl = response.finalUrl || searchUrl;

                    // Case 1: Landed directly on ExamTopics (Ideal)
                    if (finalUrl.includes('examtopics.com') && !finalUrl.includes('google.com')) {
                        window.location.href = finalUrl;
                        return;
                    }

                    // Case 2: Landed on Google Redirect Notice or Search Results
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");

                    // Try to extract from Redirect Notice link
                    // Usually: <a href="TARGET">...</a>
                    const redirectLink = doc.querySelector('a[href*="examtopics.com"]');
                    if (redirectLink) {
                        // Sometimes Google URLs are /url?q=...
                        let target = redirectLink.href;
                        if (target.includes('/url?q=')) {
                            // Extract q param manually if URL API fails or just split
                            try {
                                const urlObj = new URL(target, "https://www.google.com");
                                target = urlObj.searchParams.get('q') || target;
                            } catch (e) {
                                // Fallback split
                                const parts = target.split('q=');
                                if (parts.length > 1) target = parts[1].split('&')[0];
                            }
                        }
                        window.location.href = decodeURIComponent(target);
                        return;
                    }

                    // Case 3: Landed on Search Results (multiple options)
                    // Try to find first organic result
                    const searchResult = doc.querySelector('#search a[href*="examtopics.com"]');
                    if (searchResult) {
                        let target = searchResult.href;
                        // Clean if it is wrapped in google url
                        if (target.includes('/url?q=')) {
                            try {
                                const urlObj = new URL(target, "https://www.google.com");
                                target = urlObj.searchParams.get('q') || target;
                            } catch (e) {
                                const parts = target.split('q=');
                                if (parts.length > 1) target = parts[1].split('&')[0];
                            }
                        }
                        window.location.href = decodeURIComponent(target);
                        return;
                    }

                    // Fail
                    alert("Could not auto-redirect. Opening Google Search.");
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
                    luckyBtn.disabled = false;
                    luckyBtn.innerText = `🚀 Go`;
                },
                onerror: function () {
                    alert("Network error with Google. Opening Search manually.");
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
                    luckyBtn.disabled = false;
                    luckyBtn.innerText = `🚀 Go`;
                }
            });
        };
        searchContainer.appendChild(luckyBtn);

        topBar.appendChild(searchContainer);

        // Close Btn
        const closeBtn = document.createElement('button');
        closeBtn.innerText = "✕";
        closeBtn.style.cssText = "background:none; border:none; font-size:18px; cursor:pointer; margin-left: auto; color: #999;";
        closeBtn.onclick = () => { topBar.remove(); document.body.style.marginTop = ""; };
        topBar.appendChild(closeBtn);

        document.body.appendChild(topBar);
        document.body.style.marginTop = "70px";
    }

    // --- Main Loop ---
    function init() {
        console.log("ExamTopics Unlocker Started v1.15");

        // Usage of MutationObserver to delete popup instantly (faster than setInterval)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element
                        if (node.id === 'notRemoverPopup' || node.classList.contains('popup-overlay') || node.id === 'general-modal-outer') {
                            node.remove();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Force Reveal Answers Immediately on Load
        revealAnswer();

        // Fallback Cleanup
        setInterval(() => {
            const popup = document.getElementById('notRemoverPopup');
            if (popup) popup.remove();
            const overlay = document.querySelector('.popup-overlay');
            if (overlay) overlay.remove();
        }, 1000);

        // Polling to ensure UI persists
        setInterval(() => {
            if (window.location.href.includes('/discussions/') || window.location.href.includes('/exams/')) {
                // Force re-injection if missing
                if (!document.getElementById('et-unlocker-bar')) {
                    injectInterface();
                }

                if (window.location.href.includes('/discussions/')) {
                    revealAnswer();
                }
            }
        }, 1000);
    }

    init(); // Run immediately

})();
