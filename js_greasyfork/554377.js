// ==UserScript==
// @name         SharmZ Quick Nav
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds persistent top-right navigation box to Torn.com with hot pink styling
// @author       SharmZ
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554377/SharmZ%20Quick%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/554377/SharmZ%20Quick%20Nav.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the container div
    const navBox = document.createElement('div');
    navBox.id = 'torn-quick-nav';
    navBox.style.position = 'fixed';
    navBox.style.top = '20px';  // Changed from bottom to top
    navBox.style.right = '20px';
    navBox.style.backgroundColor = '#000';  // Solid black background
    navBox.style.border = '1px solid #FF1493';  // Hot pink border
    navBox.style.borderRadius = '5px';
    navBox.style.padding = '10px';
    navBox.style.zIndex = '9999';
    navBox.style.fontFamily = 'Arial, sans-serif';
    navBox.style.color = '#fff';
    navBox.style.boxShadow = '0 0 10px rgba(255, 20, 147, 0.7)';  // Hot pink glow
    navBox.style.width = '150px';

    // Create the content
    navBox.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px; text-align: center; color: #FF1493;">QUICK NAV</div>
        <div style="display: flex; flex-direction: column; gap: 3px;">
            <a href="https://www.torn.com/factions.php?step=your&type=1#/war/rank"
               style="color: #FF1493; text-decoration: none; padding: 3px 5px; border-radius: 3px; background: rgba(255, 20, 147, 0.2); transition: all 0.2s;">My Faction</a>
            <a href="https://www.torn.com/page.php?sid=stocks"
               style="color: #FF1493; text-decoration: none; padding: 3px 5px; border-radius: 3px; background: rgba(255, 20, 147, 0.2); transition: all 0.2s;">Stocks</a>
            <a href="https://www.torn.com/bazaar.php?userId=3542741"
               style="color: #FF1493; text-decoration: none; padding: 3px 5px; border-radius: 3px; background: rgba(255, 20, 147, 0.2); transition: all 0.2s;">My Bazaar</a>
            <a href="https://www.torn.com/displaycase.php#display/3542741"
               style="color: #FF1493; text-decoration: none; padding: 3px 5px; border-radius: 3px; background: rgba(255, 20, 147, 0.2); transition: all 0.2s;">Display Case</a>
            <a href="https://www.weav3r.dev/dollar-bazaars"
               style="color: #FF1493; text-decoration: none; padding: 3px 5px; border-radius: 3px; background: rgba(255, 20, 147, 0.2); transition: all 0.2s;" target="_blank">$1 Items</a>
            <a href="https://ffscouter.com/target-finder"
               style="color: #FF1493; text-decoration: none; padding: 3px 5px; border-radius: 3px; background: rgba(255, 20, 147, 0.2); transition: all 0.2s;" target="_blank">Target Finder</a>
            <a href="https://wiki.torn.com/wiki/Big_Al%27s_Bunker"
               style="color: #FF1493; text-decoration: none; padding: 3px 5px; border-radius: 3px; background: rgba(255, 20, 147, 0.2); transition: all 0.2s;" target="_blank">Big Al Bunker Wiki</a>
            <a href="https://www.torn.com/forums.php#/p=threads&f=10&t=16521728&b=0&a=0&start"
               style="color: #FF1493; text-decoration: none; padding: 3px 5px; border-radius: 3px; background: rgba(255, 20, 147, 0.2); transition: all 0.2s;">RW Weps Forum</a>
            <a href="https://www.torn.com/forums.php#/p=threads&f=23&t=16521459&b=0&a=0&start"
               style="color: #FF1493; text-decoration: none; padding: 3px 5px; border-radius: 3px; background: rgba(255, 20, 147, 0.2); transition: all 0.2s;">Art Forum</a>
        </div>
    `;

    // Add hover effects
    const style = document.createElement('style');
    style.textContent = `
        #torn-quick-nav a:hover {
            background: rgba(255, 20, 147, 0.4) !important;
            transform: translateX(3px);
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(navBox);
})();