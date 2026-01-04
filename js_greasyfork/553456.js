// ==UserScript==
// @name         RoseAholic QuickLinks
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Personalized quicklinks for RoseAholic [3982163] with direct bazaar access
// @author       SharmZ
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553456/RoseAholic%20QuickLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/553456/RoseAholic%20QuickLinks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const quickLinksBox = document.createElement('div');
    quickLinksBox.id = 'roseaholic-quicklinks';
    quickLinksBox.style.position = 'fixed';
    quickLinksBox.style.top = '150px';
    quickLinksBox.style.left = '25px';
    quickLinksBox.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    quickLinksBox.style.border = '1px solid #C71585';
    quickLinksBox.style.borderRadius = '5px';
    quickLinksBox.style.padding = '12px';
    quickLinksBox.style.zIndex = '99999';
    quickLinksBox.style.fontFamily = 'Verdana, Tahoma, sans-serif';
    quickLinksBox.style.color = '#FFB6C1';
    quickLinksBox.style.boxShadow = '0 0 15px rgba(0,0,0,0.7)';
    quickLinksBox.style.maxHeight = '85vh';
    quickLinksBox.style.overflowY = 'auto';

    // Title with username
    const title = document.createElement('div');
    title.innerHTML = '<strong>RoseAholic QuickLinks</strong>';
    title.style.marginBottom = '10px';
    title.style.textAlign = 'center';
    title.style.borderBottom = '1px solid #C71585';
    title.style.paddingBottom = '5px';
    quickLinksBox.appendChild(title);

    // Organized link groups
    const linkGroups = [
        {
            title: 'Personal',
            links: [
                {text: 'SharmZ Bazaar', url: 'https://www.torn.com/bazaar.php?userId=3542741#/'},
                {text: 'SharmZ Profile', url: 'https://www.torn.com/profiles.php?XID=3542741'},
                {text: 'Bazaar Directory', url: 'https://www.torn.com/page.php?sid=bazaar'},
                {text: 'Display Case', url: 'https://www.torn.com/displaycase.php#display/3982163'}
            ]
        },
        {
            title: 'Markets',
            links: [
                {text: 'Item Market', url: 'https://www.torn.com/page.php?sid=ItemMarket#/market/view=category&categoryName=Most%20Popular'},
                {text: 'Stock Market', url: 'https://www.torn.com/page.php?sid=stocks'},
                {text: '$1 Bazaars', url: 'https://www.weav3r.dev/dollar-bazaars'}
            ]
        },
        {
            title: 'Activities',
            links: [
                {text: 'Search for Cash', url: 'https://www.torn.com/page.php?sid=crimes#/searchforcash'},
                {text: 'Faction', url: 'https://www.torn.com/factions.php?step=your&type=1'},
                {text: 'Items', url: 'https://www.torn.com/item.php'},
                {text: 'Wheels', url: 'https://www.torn.com/page.php?sid=spinTheWheel'}
            ]
        }
    ];

    // Create grouped links
    linkGroups.forEach(group => {
        const groupTitle = document.createElement('div');
        groupTitle.textContent = group.title;
        groupTitle.style.fontWeight = 'bold';
        groupTitle.style.color = '#FF1493';
        groupTitle.style.margin = '8px 0 4px 0';
        groupTitle.style.paddingLeft = '3px';
        groupTitle.style.borderLeft = '2px solid #C71585';
        quickLinksBox.appendChild(groupTitle);

        group.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.text;
            a.style.display = 'block';
            a.style.margin = '4px 0';
            a.style.color = '#FFFFFF';
            a.style.textDecoration = 'none';
            a.style.padding = '4px 8px';
            a.style.borderRadius = '3px';
            a.style.transition = 'all 0.2s';
            a.style.fontSize = '14px';

            a.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'rgba(199, 21, 133, 0.6)';
                this.style.textShadow = '0 0 3px #000000';
                this.style.transform = 'translateX(3px)';
            });
            a.addEventListener('mouseout', function() {
                this.style.backgroundColor = '';
                this.style.textShadow = '';
                this.style.transform = '';
            });

            quickLinksBox.appendChild(a);
        });
    });

    // Compact close button
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'fixed';
    closeBtn.style.top = '8px';
    closeBtn.style.right = '8px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#FF6B6B';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.zIndex = '100';
    closeBtn.title = 'Minimize QuickLinks';
    closeBtn.style.transition = 'color 0.2s';

    closeBtn.addEventListener('mouseover', () => closeBtn.style.color = '#FF0000');
    closeBtn.addEventListener('mouseout', () => closeBtn.style.color = '#FF6B6B');
    closeBtn.addEventListener('click', () => quickLinksBox.style.display = quickLinksBox.style.display === 'none' ? 'block' : 'none');

    quickLinksBox.appendChild(closeBtn);

    // Add to page
    document.body.appendChild(quickLinksBox);

    // Initialize as visible
    quickLinksBox.style.display = 'block';
})();