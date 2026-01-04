// ==UserScript==
// @name         Kick.com KickLogz Link
// @namespace    http://neurophate.link
// @version      1.0
// @description  Adds a link to KickLogz next to the streamer's name on Kick.com
// @license      MIT
// @author       neurophate
// @match        https://kick.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552396/Kickcom%20KickLogz%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/552396/Kickcom%20KickLogz%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addKickLogzLink() {
        
        const pathParts = window.location.pathname.split('/').filter(p => p);
        if (pathParts.length === 0) return;
        
        const streamerName = pathParts[0];
        
        
        const selectors = [
            'h1[class*="channel"]',
            'a[class*="channel-name"]',
            '[class*="streamer-name"]',
            'h1.text-2xl',
            '.channel-header h1'
        ];
        
        let nameElement = null;
        for (const selector of selectors) {
            nameElement = document.querySelector(selector);
            if (nameElement) break;
        }
        

        if (!nameElement) {
            const allH1 = document.querySelectorAll('h1');
            for (const h1 of allH1) {
                if (h1.textContent.trim().toLowerCase() === streamerName.toLowerCase()) {
                    nameElement = h1;
                    break;
                }
            }
        }
        
        if (!nameElement) return;
        
        
        const existingLink = nameElement.parentElement.querySelector('.kicklogz-link');
        if (existingLink) return;
        
        
        const kickLogzUrl = `https://kicklogz.com/streamer/${streamerName}`;
        const link = document.createElement('a');
        link.href = kickLogzUrl;
        link.target = '_blank';
        link.className = 'kicklogz-link';
        link.title = 'KickLogz Profile';
        
        
        link.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#53fc18" opacity="0.2"/>
                <rect width="24" height="24" rx="4" fill="none" stroke="#53fc18" stroke-width="2"/>
                <text x="12" y="17" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#53fc18" text-anchor="middle">K</text>
            </svg>
        `;
        
        link.style.cssText = `
            margin-left: 8px;
            display: inline-flex;
            align-items: center;
            text-decoration: none;
            transition: all 0.2s;
            vertical-align: middle;
        `;
        
        
        link.addEventListener('mouseenter', () => {
            const rect = link.querySelector('rect[fill="#53fc18"]');
            const text = link.querySelector('text');
            if (rect) rect.setAttribute('opacity', '1');
            if (text) text.setAttribute('fill', '#000');
        });
        link.addEventListener('mouseleave', () => {
            const rect = link.querySelector('rect[fill="#53fc18"]');
            const text = link.querySelector('text');
            if (rect) rect.setAttribute('opacity', '0.2');
            if (text) text.setAttribute('fill', '#53fc18');
        });
        
        
        if (nameElement.parentElement) {
            nameElement.parentElement.style.display = 'flex';
            nameElement.parentElement.style.alignItems = 'center';
            nameElement.parentElement.style.flexWrap = 'wrap';
            nameElement.parentElement.appendChild(link);
        } else {
            nameElement.appendChild(link);
        }
    }

    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(addKickLogzLink, 1000);
        });
    } else {
        setTimeout(addKickLogzLink, 1000);
    }

    
    const observer = new MutationObserver(() => {
        addKickLogzLink();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(addKickLogzLink, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

})();