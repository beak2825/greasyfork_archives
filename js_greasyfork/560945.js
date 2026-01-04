// ==UserScript==
// @name         Holotower Claim Posts
// @namespace    http://holotower.org/
// @license MIT
// @version      1.0
// @description  Fixes [Claim] button appearing inside inline quotes.
// @author       Fayne
// @match        *://boards.holotower.org/*
// @match        *://holotower.org/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560945/Holotower%20Claim%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/560945/Holotower%20Claim%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Config ---
    const BTN_TEXT = "[Claim]";
    const BTN_ACTIVE = "[Mine]";

    // --- Styles ---
    GM_addStyle(`
        /* Highlight Styles (Box Shadow for visibility) */
        .fake-you {
            box-shadow: inset 4px 0 0 0 #00b8e6 !important;
            background-color: rgba(0, 184, 230, 0.1) !important;
        }
        .fake-reply {
            box-shadow: inset 4px 0 0 0 #ff3d3d !important;
            background-color: rgba(255, 61, 61, 0.1) !important;
        }

        /* Button Styling */
        .fake-mine-btn {
            cursor: pointer !important;
            margin-left: 6px;
            font-size: 10px;
            color: #888;
            font-family: sans-serif;
            position: relative;
            z-index: 5; /* Lower Z-index to avoid overlap issues */
            user-select: none;
        }
        .fake-mine-btn:hover { color: #00b8e6; text-decoration: underline; }
        .fake-mine-btn.active { color: #00b8e6; font-weight: bold; }

        /* --- FIX: HIDE BUTTON IN PREVIEWS --- */
        /* If the button is inside a quote preview (.qp) or inline quote (.inline), hide it */
        .qp .fake-mine-btn,
        .inline .fake-mine-btn,
        #qp .fake-mine-btn {
            display: none !important;
        }
    `);

    const myPostIds = new Set();

    // --- Click Handler ---
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('fake-mine-btn')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            handleClaimClick(e.target);
        }
    }, true);

    function handleClaimClick(btn) {
        // Find closest post that is NOT a preview popup
        const post = btn.closest('.post');
        if (!post) return;

        const id = getPostId(post);
        if (!id) return;

        if (myPostIds.has(id)) {
            myPostIds.delete(id);
            // Update ALL buttons for this ID (in case multiple exist on page)
            updateButtons(id, false);
        } else {
            myPostIds.add(id);
            updateButtons(id, true);
        }

        refreshHighlights();
    }

    // Update text/style of all buttons for a specific ID
    function updateButtons(id, isActive) {
        document.querySelectorAll('.post').forEach(post => {
            if (getPostId(post) === id) {
                const btn = post.querySelector('.fake-mine-btn');
                if (btn) {
                    btn.textContent = isActive ? BTN_ACTIVE : BTN_TEXT;
                    if (isActive) btn.classList.add('active');
                    else btn.classList.remove('active');
                }
            }
        });
    }

    // --- Extraction Logic ---
    function getPostId(post) {
        // 1. Container ID
        if (post.id) {
            const match = post.id.match(/(\d{4,})/);
            if (match) return match[1];
        }
        // 2. Info Text
        const intro = post.querySelector('.intro') || post.querySelector('.postInfo');
        if (intro) {
            const text = intro.innerText || "";
            const match = text.match(/No\.\s*(\d+)/) || text.match(/\b(\d{5,})\b/);
            if (match) return match[1];
        }
        // 3. Link Text
        const numLinks = post.querySelectorAll('.post_no');
        for (let link of numLinks) {
            const txt = link.innerText.replace(/\D/g, '');
            if (txt.length > 4) return txt;
        }
        return null;
    }

    function isReplyingToMe(post) {
        if (myPostIds.size === 0) return false;
        const text = post.innerText || "";
        for (const myId of myPostIds) {
            const regex = new RegExp(`>>\\s*${myId}\\b`);
            if (regex.test(text)) return true;
        }
        return false;
    }

    function refreshHighlights() {
        document.querySelectorAll('.post').forEach(post => {
            // Skip previews from getting highlights if desired, or keep them
            if (post.closest('.qp')) return;

            const id = getPostId(post);
            post.classList.remove('fake-you', 'fake-reply');

            if (id && myPostIds.has(id)) {
                post.classList.add('fake-you');
            } else if (isReplyingToMe(post)) {
                post.classList.add('fake-reply');
            }
        });
    }

    // --- Init ---
    function addButtons() {
        document.querySelectorAll('.post').forEach(post => {
            // Prevent adding if already exists
            if (post.querySelector('.fake-mine-btn')) return;

            // Prevent adding to previews (class 'qp' or 'inline')
            if (post.closest('.qp') || post.classList.contains('qp')) return;

            const intro = post.querySelector('.intro') || post.querySelector('.postInfo');
            if (intro) {
                const btn = document.createElement('span');
                btn.className = 'fake-mine-btn';
                btn.textContent = BTN_TEXT;
                intro.appendChild(btn);
            }
        });
    }

    addButtons();

    const observer = new MutationObserver(mutations => {
        let added = false;
        mutations.forEach(m => { if (m.addedNodes.length) added = true; });
        if (added) {
            addButtons();
            if (myPostIds.size > 0) refreshHighlights();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();