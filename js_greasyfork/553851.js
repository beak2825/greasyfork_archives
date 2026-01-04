// ==UserScript==
// @name         Attack Button on User by Pankace
// @namespace    http://tampermonkey.net/
// @author       You
// @version      0.2.5
// @description  Places visible attack icon next to usernames
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/preferences.php*
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/page.php?sid=UserList*
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/553851/Attack%20Button%20on%20User%20by%20Pankace.user.js
// @updateURL https://update.greasyfork.org/scripts/553851/Attack%20Button%20on%20User%20by%20Pankace.meta.js
// ==/UserScript==

console.log("AttackButton script loaded");

(function(){
    'use strict';

    // Allowed container selectors where we want icons (userlist, factions, profile areas).
    // These are intentionally specific to avoid touching chat widgets.
    const ALLOWED_CONTAINERS = [
        'div.userlist-wrapper', // the user list/search page
        'div#factions', // factions page
        'div#profileroot', // profile pages
        'div.profile-wrapper', // profile wrapper (covers small/large profile)
        'ul.user-info-list-wrap'// user list inner container
    ];

    function getUserIdFromHref(href){
        if(!href || typeof href !== 'string') return null;
        const m = href.match(/[?&](?:XID|userID|user2ID|user)=(\d+)/i);
        return m ? m[1] : null;
    }

    // Check whether element is inside any allowed container
    function isInsideAllowedContainer(el){
        if(!el) return false;
        try {
            for(const sel of ALLOWED_CONTAINERS){
                if(el.closest && el.closest(sel)) return true;
            }
        } catch(e){}
        return false;
    }

    function cleanupOldIcons(){
        try {
            document.querySelectorAll('[data-pank-attack="1"]').forEach(n => {
                if(!n.getAttribute('data-pank-attack-user')) n.remove();
            });
        } catch(e){}
    }

    function buildOverlayIcon(userId){
        const el = document.createElement('span');
        el.setAttribute('data-pank-attack', '1');
        el.setAttribute('data-pank-attack-user', userId);
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.title = `Attack user ${userId}`;

        el.style.position = 'absolute';
        el.style.right = '6px';
        el.style.top = '50%';
        el.style.transform = 'translateY(-50%)';
        el.style.zIndex = '9999';
        el.style.display = 'inline-flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.minWidth = '24px';
        el.style.height = '24px';
        el.style.padding = '0 6px';
        el.style.borderRadius = '4px';
        el.style.fontSize = '14px';
        el.style.lineHeight = '1';
        el.style.cursor = 'pointer';
        el.style.userSelect = 'none';
        el.style.background = 'rgba(255,0,0,0.06)';
        el.style.border = '1px solid rgba(255,0,0,0.12)';
        el.style.color = 'currentColor';
        el.style.boxSizing = 'border-box';
        el.innerText = '🎯';
        el.setAttribute('aria-label', `Attack user ${userId}`);

        el.addEventListener('click', function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    window.open(`/loader.php?sid=attack&user2ID=${userId}`, '_blank');
}, {capture: true});

el.addEventListener('auxclick', function(ev) {
    if (ev.button === 1) { // middle click
        ev.preventDefault();
        ev.stopPropagation();
        window.open(`/loader.php?sid=attack&user2ID=${userId}`, '_blank');
    }
}, {capture: true});

el.addEventListener('keydown', function(ev){
    if(ev.key === 'Enter' || ev.key === ' '){
        ev.preventDefault();
        ev.stopPropagation();
        window.open(`/loader.php?sid=attack&user2ID=${userId}`, '_blank');
    }
});


        return el;
    }

    // Add one overlay icon inside the anchor (absolute positioned), but only if the anchor is inside an allowed container.
    function ensureOverlayIcon(anchor){
        if(!anchor || anchor.nodeType !== 1) return;

        if(!isInsideAllowedContainer(anchor)) return; // IMPORTANT: don't touch elements outside allowed areas

        // skip avatar-only anchors (they are not username anchors)
        if(anchor.getAttribute && anchor.getAttribute('data-label') === 'avatar') return;

        const id = getUserIdFromHref(anchor.href) || (anchor.dataset && (anchor.dataset.userid || anchor.dataset.userId || anchor.dataset.xid));
        if(!id) return;

        if(anchor.getAttribute('data-pank-processed') === '1') {
            const existing = anchor.querySelector('[data-pank-attack="1"]');
            if(existing && existing.getAttribute('data-pank-attack-user') === id) return;
            anchor.querySelectorAll('[data-pank-attack="1"]').forEach(n => n.remove());
        }

        anchor.setAttribute('data-pank-processed', '1');

        try {
            const cs = window.getComputedStyle(anchor);
            if(!cs || cs.position === 'static') {
                anchor.style.position = 'relative';
            }
        } catch(e){
            try { anchor.style.position = 'relative'; } catch(e){}
        }

        anchor.querySelectorAll('[data-pank-attack="1"]').forEach(n => n.remove());

        const icon = buildOverlayIcon(id);
        try {
            anchor.appendChild(icon);
        } catch(e){
            try { anchor.insertAdjacentElement('afterend', icon); } catch(e){}
        }
    }

    // Process anchors inside a given root/subtree but only if they are inside allowed containers
    function processRoot(root){
        root = root || document;
        const selector = [
            'a[href*="profiles.php?XID="]',
            'a[href*="profiles.php?userID="]',
            'a[href*="profiles.php?user2ID="]',
            'a[href*="profiles.php?user="]',
            'a[data-userid]',
            'a[data-user-id]'
        ].join(',');
        let anchors = [];
        try {
            anchors = root.querySelectorAll ? root.querySelectorAll(selector) : [];
        } catch(e) { anchors = []; }

        for(const a of anchors){
            // ensure it's inside one of the allowed containers (prevents chat)
            if(!isInsideAllowedContainer(a)) continue;
            ensureOverlayIcon(a);
        }
    }

    // Initial setup: clean and run on each allowed container present
    cleanupOldIcons();
    for(const sel of ALLOWED_CONTAINERS){
        try {
            const node = document.querySelector(sel);
            if(node) processRoot(node);
        } catch(e){}
    }
    // also a full-scan fallback (only processes anchors inside allowed containers due to guard)
    processRoot(document);

    // Observe dynamic changes: only process nodes that are inside allowed containers
    const observer = new MutationObserver((mutations)=>{
        for(const m of mutations){
            for(const n of m.addedNodes){
                if(n.nodeType !== 1) continue;
                // If the added node is inside any allowed container - or itself matches a container - process it
                let shouldProcess = false;
                try {
                    for(const sel of ALLOWED_CONTAINERS){
                        if(n.matches && n.matches(sel)) { shouldProcess = true; break; }
                        if(n.closest && n.closest(sel)) { shouldProcess = true; break; }
                    }
                } catch(e){}
                if(shouldProcess) processRoot(n);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
