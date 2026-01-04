// ==UserScript==
// @name         Torn Profile Message Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a convenient message button to player profiles
// @author       TornPlayer
// @match        https://www.torn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550385/Torn%20Profile%20Message%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/550385/Torn%20Profile%20Message%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Friendly default messages - feel free to customize these
    const DEFAULT_MESSAGE = `<p>Are you interested in a new job with generous pay?</p>
<p>&nbsp;</p>
<p>Please apply here: <a href="https://www.torn.com/joblist.php#/p=corpinfo&userID=2807909">https://www.torn.com/joblist.php#/p=corpinfo&userID=2807909</a></p>
<p>&nbsp;</p>
<p><strong>Salary:</strong> $1,000,000 if any of your stats are higher than 80k (lesser stats can be accepted with a salary reduction)</p>
<p>&nbsp;</p>
<p><strong>Training:</strong> free trains on rotation between active staff</p>
<p>&nbsp;</p>
<p><strong>Bonuses:</strong> $1,000,000 each time the company ranks up</p>
<p>&nbsp;</p>
<p><strong>Company specials based on company stars:</strong></p>
<ul>
<li><strong>Off the Grid (1★)</strong><br>20 job points<br>72 hour bounty protection</li>
<li><strong>Tactical Breach (3★)</strong><br>Passive<br>50% Flash Grenade intensity</li>
<li><strong>Open Arsenal (5★)</strong><br>75 job points<br>Primary or Secondary weapon</li>
<li><strong>Regulation (7★)</strong><br>Passive<br>25% full set armor mitigation bonus</li>
<li><strong>Mercenary (10★)</strong><br>1 job points</li>
</ul>
<p>&nbsp;</p>
<p><img src="https://snipboard.io/dzUG3K.jpg" /></p>
<p>3 mission credits</p>`;
    const DEFAULT_SUBJECT = "Job Opportunity - High Pay & Great Benefits";
    
    function addMessageButton() {
        // Only add button on player profile pages
        const params = new URLSearchParams(window.location.search);
        const playerId = params.get("XID");
        if (!playerId) return;
        
        // Don't add multiple buttons
        if (document.querySelector("#profileMsgHelper")) return;
        
        // Create a friendly message button
        const btn = document.createElement("button");
        btn.id = "profileMsgHelper";
        btn.innerText = "Send Message";
        btn.style.margin = "5px";
        btn.style.padding = "8px 15px";
        btn.style.background = "#4CAF50";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "13px";
        
        // Simple hover effect
        btn.addEventListener("mouseenter", () => {
            btn.style.background = "#45a049";
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.background = "#4CAF50";
        });
        
        btn.addEventListener("click", () => {
            // Store info for the message page
            sessionStorage.setItem('msgHelper_playerId', playerId);
            sessionStorage.setItem('msgHelper_text', DEFAULT_MESSAGE);
            sessionStorage.setItem('msgHelper_subject', DEFAULT_SUBJECT);
            
            // Open message page
            const msgUrl = `https://www.torn.com/messages.php#/p=compose&XID=${playerId}`;
            window.open(msgUrl, "_blank");
        });
        
        // Try to add button to profile area
        const target = document.querySelector(".profile-buttons");
        if (target) {
            target.appendChild(btn);
        } else {
            // Alternative location if main spot isn't available
            const fallback = document.querySelector("#profileroot .profile-wrapper");
            if (fallback) {
                fallback.insertBefore(btn, fallback.firstChild);
            }
        }
    }
    
    function helpFillMessage() {
        // Only work on message pages
        if (!window.location.pathname.includes('/messages.php')) return;
        
        // Check if we have stored message data
        const storedPlayerId = sessionStorage.getItem('msgHelper_playerId');
        const storedMessage = sessionStorage.getItem('msgHelper_text');
        const storedSubject = sessionStorage.getItem('msgHelper_subject');
        
        if (!storedPlayerId || !storedMessage) return;
        
        // Make sure we're messaging the right person
        const currentParams = new URLSearchParams(window.location.hash.substring(1));
        const currentPlayerId = currentParams.get('XID');
        
        if (currentPlayerId !== storedPlayerId) return;
        
        // Helper function to fill the subject line
        function tryFillSubject() {
            if (!storedSubject) return false;
            
            // Look for subject input field
            const subjectField = document.querySelector('input[name="subject"]') || 
                                document.querySelector('input#subject') ||
                                document.querySelector('input[placeholder*="subject" i]');
            
            if (subjectField) {
                subjectField.value = storedSubject;
                subjectField.dispatchEvent(new Event('input', { bubbles: true }));
                return true;
            }
            return false;
        }
        
        // Helper function to fill the message content
        function tryFillMessage() {
            // Look for the rich text editor first
            const editor = document.querySelector('.editor-content.mce-content-body[contenteditable="true"]') ||
                          document.querySelector('[contenteditable="true"].editorContent___x6KCb') ||
                          document.querySelector('[contenteditable="true"]');
            
            if (editor) {
                // Fill the message editor with HTML content
                editor.innerHTML = storedMessage;
                
                // Also update hidden textarea if it exists
                const hiddenArea = document.querySelector('textarea.sourceArea___fQWHn.hidden___F8Nbc');
                if (hiddenArea) {
                    hiddenArea.value = storedMessage;
                }
                
                // Notify the editor of changes
                editor.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Try TinyMCE API if available
                if (window.tinymce && editor.id) {
                    const tinyEditor = window.tinymce.get(editor.id);
                    if (tinyEditor) {
                        tinyEditor.setContent(storedMessage);
                    }
                }
                
                // Also fill subject
                tryFillSubject();
                
                // Clean up
                sessionStorage.removeItem('msgHelper_playerId');
                sessionStorage.removeItem('msgHelper_text');
                sessionStorage.removeItem('msgHelper_subject');
                
                return true;
            }
            
            return false;
        }
        
        // Try to fill the message when page loads
        setTimeout(() => {
            tryFillMessage();
        }, 500); // Just a small delay to let the editor initialize
    }
    
    // Initialize the helper when page loads
    function initHelper() {
        if (window.location.pathname.includes('/messages.php')) {
            helpFillMessage();
        } else {
            addMessageButton();
        }
    }
    
    // Start when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHelper);
    } else {
        initHelper();
    }
    
    // Handle page navigation within Torn
    const observer = new MutationObserver(() => {
        initHelper();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Handle URL hash changes
    window.addEventListener('hashchange', () => {
        setTimeout(helpFillMessage, 1000);
    });
})();