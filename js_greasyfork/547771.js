// ==UserScript==
// @name         NexusMods Exclude Tags Manager V3
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Foldable panel allowing mods with NSFW or Reshade tags to be excluded
// @author       ChatGPT
// @match        https://www.nexusmods.com/*
// @grant        none
 // @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547771/NexusMods%20Exclude%20Tags%20Manager%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/547771/NexusMods%20Exclude%20Tags%20Manager%20V3.meta.js
// ==/UserScript==

(function() {
    // Do not run on individual mod pages
if (/\/mods\/\d+($|[?#])/.test(window.location.pathname)) {
    return; // Stop script here
}

    'use strict';

    const STORAGE_KEY = 'nexus_exclude_tags_memory';

    const excludeTags = [
        "Extreme violence",
        "Sexualised",
        "Swearing/Profanity",
        "Pornographic",
        "Suicide",
        "Self-harm",
        "Depression",
        "Body stigma",
        "Eating disorder",
        "Harmful substances",
        "ReShade"
    ];

    // Loads stored tags
    function loadMemory() {
        try {
            const val = localStorage.getItem(STORAGE_KEY);
            if (val) return JSON.parse(val);
        } catch {}
        return [];
    }

    // Checks if all given tags are in the URL
    function urlContainsAllTags(url, tags) {
        const params = url.searchParams;
        const urlTags = new Set(params.getAll('excludedTag'));
        return tags.every(t => urlTags.has(t));
    }

    // Applies the tags stored in the URL, reloads if necessary
    function applyStoredTagsInUrl() {
        const storedTags = loadMemory();
        if (storedTags.length === 0) return false;

        const url = new URL(window.location.href);
        if (!urlContainsAllTags(url, storedTags)) {
            // Remove all excludedTags before adding the correct ones
            url.searchParams.delete('excludedTag');

            storedTags.forEach(t => url.searchParams.append('excludedTag', t));

            // Reload without adding to history, avoids infinite loop
            window.location.replace(url.toString());
            return true; // reload done
        }
        return false; // no need for reloading
    }

    // ============ UI ===============

    function createUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '61px';      
        container.style.right = '160px';  
        container.style.zIndex = '999999';
        container.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
        container.style.userSelect = 'none';
        container.style.color = '#eee';
        container.style.width = '260px';
        container.style.boxShadow = '0 0 12px rgba(0,0,0,0.9)';
        container.style.backgroundColor = '#1b1f2a';
        container.style.borderRadius = '8px';

        // Foldable button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Exclude Tags ▼';
        toggleBtn.style.width = '100%';
        toggleBtn.style.padding = '10px';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '8px 8px 0 0';
        toggleBtn.style.backgroundColor = '#2e3a4e';
        toggleBtn.style.color = '#eee';
        toggleBtn.style.fontWeight = 'bold';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.textAlign = 'center';
        toggleBtn.style.userSelect = 'none';
        toggleBtn.style.boxShadow = 'inset 0 -3px 6px rgba(0,0,0,0.3)';
        container.appendChild(toggleBtn);

        // Panel content (buttons list + apply)
        const panel = document.createElement('div');
        panel.style.padding = '10px';
        panel.style.display = 'none'; // visible at the outset
        panel.style.maxHeight = '320px';
        panel.style.overflowY = 'auto';
        container.appendChild(panel);

        // Toggle panel
        let collapsed = true;
        toggleBtn.onclick = () => {
            collapsed = !collapsed;
            panel.style.display = collapsed ? 'none' : 'block';
            toggleBtn.textContent = collapsed ? 'Exclude Tags ▲' : 'Exclude Tags ▼';
        };

        // Creating tag buttons
        function createTagBtn(tag) {
            const btn = document.createElement('button');
            btn.textContent = tag;
            btn.style.margin = '4px 6px 4px 0';
            btn.style.padding = '6px 14px';
            btn.style.borderRadius = '6px';
            btn.style.border = 'none';
            btn.style.backgroundColor = '#2e3a4e';
            btn.style.color = '#eee';
            btn.style.cursor = 'pointer';
            btn.style.whiteSpace = 'nowrap';
            btn.style.fontSize = '14px';
            btn.dataset.tag = tag;
            btn.dataset.selected = 'false';

            btn.onclick = () => {
                if (btn.dataset.selected === 'true') {
                    btn.dataset.selected = 'false';
                    btn.style.backgroundColor = '#2e3a4e';
                } else {
                    btn.dataset.selected = 'true';
                    btn.style.backgroundColor = '#d9534f';
                }
            };
            return btn;
        }

        // Container tags buttons
        const btnContainer = document.createElement('div');
        panel.appendChild(btnContainer);

        excludeTags.forEach(tag => {
            btnContainer.appendChild(createTagBtn(tag));
        });

        // button apply
        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Apply';
        applyBtn.style.width = '100%';
        applyBtn.style.marginTop = '12px';
        applyBtn.style.padding = '10px 0';
        applyBtn.style.borderRadius = '6px';
        applyBtn.style.border = 'none';
        applyBtn.style.backgroundColor = '#28a745';
        applyBtn.style.color = '#fff';
        applyBtn.style.fontWeight = 'bold';
        applyBtn.style.cursor = 'pointer';
        applyBtn.style.userSelect = 'none';

        applyBtn.onmouseenter = () => applyBtn.style.backgroundColor = '#218838';
        applyBtn.onmouseleave = () => applyBtn.style.backgroundColor = '#28a745';

        panel.appendChild(applyBtn);

        document.body.appendChild(container);

        // Synchronize buttons with current URL
        function syncButtonsWithUrl() {
            const urlTags = new URLSearchParams(window.location.search).getAll('excludedTag');
            const urlSet = new Set(urlTags);
            excludeTags.forEach(tag => {
                const btn = [...btnContainer.children].find(b => b.dataset.tag === tag);
                if (!btn) return;
                if (urlSet.has(tag)) {
                    btn.dataset.selected = 'true';
                    btn.style.backgroundColor = '#d9534f';
                } else {
                    btn.dataset.selected = 'false';
                    btn.style.backgroundColor = '#2e3a4e';
                }
            });
        }

        syncButtonsWithUrl();

        // Action apply
        applyBtn.onclick = () => {
            const selectedTags = [];
            for (const btn of btnContainer.children) {
                if (btn.dataset.selected === 'true') {
                    selectedTags.push(btn.dataset.tag);
                }
            }
            // Save
            localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTags));

            // Modifier URL et reload si besoin
            const url = new URL(window.location.href);
            url.searchParams.delete('excludedTag');
            selectedTags.forEach(t => url.searchParams.append('excludedTag', t));

            if (url.toString() !== window.location.href) {
                window.location.href = url.toString();
            }
        };

        // Expose sync for external usage
        return {
            syncButtonsWithUrl,
        };
    }

    // Managing URL changes in SPA (pushState + popstate)
    function hookUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                callback();
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // When loading, apply the stored tags (reload if necessary)
    if (applyStoredTagsInUrl()) return; // reload lancé => stop ici

    // Creation UI
    const ui = createUI();

    // Sur changement d'URL détecté, appliquer tags + resync UI
    hookUrlChange(() => {
        if (applyStoredTagsInUrl()) return; // reload if tags missing
        // Else update buttons with URL
        ui.syncButtonsWithUrl();
    });

})();
