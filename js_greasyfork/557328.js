// ==UserScript==
// @name         Loot Visualizer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @author       Lotak - Guild leader of Casual Ahab
// @description  Loot window, totals, rarity colors, summary, tooltips, and pop-in animation
// @match        https://demonicscans.org/*
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557328/Loot%20Visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/557328/Loot%20Visualizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let gateInfo = document.querySelector("body > div.gate-info > div.gate-info-scroll > div");
    if (gateInfo) {
        gateInfo.style.display = "none";
    }

    function addCustomSideNavItems() {
        // Wait for side-nav to exist (some pages load it asynchronously)
        const waitForNav = setInterval(() => {
            const nav = document.querySelector("nav.side-nav");
            if (!nav) return;  // keep waiting

            clearInterval(waitForNav);

            // Helper to create a nav item
            function createNavItem(icon, label, href) {
                const a = document.createElement("a");
                a.className = "side-nav-item";
                a.href = href;

                a.innerHTML = `
                <span class="side-icon">${icon}</span>
                <span class="side-label">${label}</span>
            `;

                return a;
            }
            const halloweenBtn = nav.querySelector('a.side-nav-item[href="/event_goblin_feast_of_shadows.php"]');
            if (halloweenBtn) {
                halloweenBtn.href = "/a_lizardmen_winter.php";
                halloweenBtn.textContent = '❄️ Winter Event';
            }

            // --- ADD YOUR CUSTOM BUTTONS BELOW ---
            const items = [
                //{ icon: "🌊", label: "Event Gate", href: " /active_wave.php?event=4&wave=2" },
                //{ icon: "🌀", label: "Gate 2", href: "/active_wave.php?gate=3&wave=5" },
                { icon: "🌀", label: "Gate 3", href: "/active_wave.php?gate=3&wave=8" },
                { icon: "⚒️", label: "Legendary Forge", href: "/legendary_forge.php" },
                { icon: "📅", label: "Weekly", href: "/weekly.php" },
                { icon: "📖", label: "Manga", href: "/index.php" },
                { icon: "🛡️", label: "Adventurer Guild", href: "/adventurers_guild.php" }
            ];

            // Append all custom items
            items.forEach(item => {
                nav.appendChild(createNavItem(item.icon, item.label, item.href));
            });

            console.log("[CustomNav] Extra navigation items added.");
        }, 200);
    }
    addCustomSideNavItems();

    /*below is for refresh button*/
        const btn = document.createElement("button");

    btn.textContent = "⟳ Refresh";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.left = "40%";
    btn.style.transform = "translateX(-50%)";
    btn.style.padding = "10px 18px";
    btn.style.fontSize = "14px";
    btn.style.borderRadius = "8px";
    btn.style.border = "1px solid #444";
    btn.style.background = "#222";
    btn.style.color = "white";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "99999";
    btn.style.opacity = "0.85";

    btn.onmouseenter = () => btn.style.opacity = "1";
    btn.onmouseleave = () => btn.style.opacity = "0.85";

    btn.onclick = () => location.reload();

    document.body.appendChild(btn);

    /*Below is for hiding images*/
    const styleEl = document.createElement("style");
    styleEl.textContent = `
        /* Hide .webp images ONLY inside body > div.monster-container */
        body > div.monster-container img[src$=".webp"],
        body > div.monster-container img[data-src$=".webp"],
        body > div.monster-container img[data-original$=".webp"] {
            display: none !important;
        }

        /* Hide gate-info element */
        body > div.gate-info > div.gate-info-scroll > div {
            display: none !important;
        }
    `;
    document.documentElement.appendChild(styleEl);

    const rarityColors = {
        COMMON: '#7f8c8d',
        UNCOMMON: '#2ecc71',
        RARE: '#9b59b6',
        EPIC: '#e67e22',
        LEGENDARY: '#f1c40f'
    };

    function transformLootWindow() {
        const lootContainer = document.getElementById('batchLootItems');
        const summaryContainer = document.getElementById('blmSummary');
        if (!lootContainer || !summaryContainer) return;

        // Collate loot
        const lootItems = Array.from(lootContainer.querySelectorAll('.blm-item'));
        const lootMap = new Map();

        lootItems.forEach(item => {
            const nameEl = item.querySelector('small:not(.muted)');
            const rarityEl = item.querySelector('small.muted');
            const imgEl = item.querySelector('img');

            if (!nameEl || !imgEl) return;

            const name = nameEl.textContent.trim();
            const rarity = rarityEl ? rarityEl.textContent.trim().toUpperCase() : 'COMMON';
            const imgSrc = imgEl.src;

            if (lootMap.has(name)) {
                lootMap.get(name).count += 1;
            } else {
                lootMap.set(name, { imgSrc, rarity, count: 1 });
            }
        });

        // Style summary
        summaryContainer.style.display = 'flex';
        summaryContainer.style.flexWrap = 'wrap';
        summaryContainer.style.gap = '6px';
        summaryContainer.style.marginBottom = '12px';
        summaryContainer.style.justifyContent = 'center';
        summaryContainer.style.textAlign = 'center';
        summaryContainer.querySelectorAll('.chip').forEach(chip => {
            chip.style.background = '#2c3e50';
            chip.style.color = 'white';
            chip.style.padding = '4px 8px';
            chip.style.borderRadius = '6px';
            chip.style.fontWeight = 'bold';
            chip.style.fontSize = '12px';
        });

        // Clear loot container and center everything
        lootContainer.innerHTML = '';
        lootContainer.style.display = 'flex';
        lootContainer.style.flexWrap = 'wrap';
        lootContainer.style.justifyContent = 'center';
        lootContainer.style.alignItems = 'center';
        lootContainer.style.gap = '12px';
        lootContainer.style.textAlign = 'center';

        // Render collated loot with tooltips and animation
        lootMap.forEach((data, name) => {
            const color = rarityColors[data.rarity] || '#bdc3c7';

            const div = document.createElement('div');
            div.className = 'blm-item';
            div.style.display = 'flex';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.textAlign = 'center';
            div.style.fontFamily = 'Arial, sans-serif';
            div.style.position = 'relative';
            div.style.opacity = '0';
            div.style.transform = 'scale(0.5)';
            div.style.transition = 'all 0.3s ease-out';

            div.innerHTML = `
                <div style="position: relative; width:64px; height:64px;">
                    <img src="${data.imgSrc}" alt="${name}" style="width:64px; height:64px; border-radius:4px; border:2px solid ${color}; cursor:pointer;">
                    <span style="
                        position: absolute;
                        bottom: -2px;
                        right: -2px;
                        background: rgba(0,0,0,0.75);
                        color: white;
                        font-size: 12px;
                        font-weight:bold;
                        padding: 1px 4px;
                        border-radius: 6px;
                    ">${data.count}</span>
                    <div class="tooltip" style="
                        visibility: hidden;
                        width: max-content;
                        background-color: rgba(0,0,0,0.85);
                        color: #fff;
                        text-align: center;
                        border-radius: 6px;
                        padding: 4px 8px;
                        position: absolute;
                        z-index: 1000;
                        bottom: 70px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 12px;
                        white-space: nowrap;
                    ">${name} (${data.rarity})<br>Total: ${data.count}</div>
                </div>
                <div style="margin-top:4px;">
                    <small style="display:block; color:white; font-weight:bold; text-align:center;">${name}</small>
                    <small style="display:block; color:${color}; font-weight:bold; text-align:center;">${data.rarity}</small>
                </div>
            `;

            // Tooltip hover
            const imgWrapper = div.querySelector('div');
            const tooltip = div.querySelector('.tooltip');
            imgWrapper.addEventListener('mouseenter', () => { tooltip.style.visibility = 'visible'; });
            imgWrapper.addEventListener('mouseleave', () => { tooltip.style.visibility = 'hidden'; });

            lootContainer.appendChild(div);

            // Animate pop-in
            setTimeout(() => {
                div.style.opacity = '1';
                div.style.transform = 'scale(1)';
            }, 50);
        });

        // Style popup box
        const lootBox = document.querySelector('.blm-box');
        if (lootBox) {
            lootBox.style.background = '#1f1f2e';
            lootBox.style.border = '2px solid #8e44ad';
            lootBox.style.borderRadius = '12px';
            lootBox.style.padding = '12px';
            lootBox.style.color = 'white';
            lootBox.style.fontFamily = 'Arial, sans-serif';
            lootBox.style.textAlign = 'center';
        }

        // Style close button
        const closeBtn = lootBox.querySelector('.blm-actions .btn-ghost');
        if (closeBtn) {
            closeBtn.style.background = '#8e44ad';
            closeBtn.style.color = 'white';
            closeBtn.style.border = 'none';
            closeBtn.style.padding = '6px 12px';
            closeBtn.style.borderRadius = '8px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onmouseover = () => { closeBtn.style.background = '#732d91'; };
            closeBtn.onmouseout = () => { closeBtn.style.background = '#8e44ad'; };
        }
    }

    // Observe loot window
    const observer = new MutationObserver((mutations, obs) => {
        const lootContainer = document.getElementById('batchLootItems');
        const summaryContainer = document.getElementById('blmSummary');
        if (lootContainer && summaryContainer && lootContainer.querySelectorAll('.blm-item').length > 0) {
            transformLootWindow();
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
