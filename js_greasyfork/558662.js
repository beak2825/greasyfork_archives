// ==UserScript==
// @name         Safari Dark Mode
// @namespace    https://greasyfork.org/en/scripts/558662-safari-dark-mode
// @version      0.2.3
// @description  True dark mode without inverting images, videos, canvas, webp, etc. Handles backdrop-blur correctly & Override stubborn CSS.
// @author       Ai
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558662/Safari%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/558662/Safari%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    const excludeDomains = ['google.com', 'youtube.com', 'maps.google.com'];
    if (excludeDomains.some(d => location.hostname.includes(d))) return;

    const PROCESSED_ATTR = 'data-sdm-processed';

    function isDark(color) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return false;
        const [r, g, b] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        return (r * 0.299 + g * 0.587 + b * 0.114) < 140;
    }

    function applyDarkMode() {
        const elems = document.querySelectorAll(`html, body, body *:not([${PROCESSED_ATTR}])`);
        
        elems.forEach(el => {
            if (el.getAttribute(PROCESSED_ATTR)) return;
            el.setAttribute(PROCESSED_ATTR, 'true');

            const cs = getComputedStyle(el);
            const bg = cs.backgroundColor;
            const hasBlur = (cs.backdropFilter && cs.backdropFilter !== 'none') || 
                            (cs.webkitBackdropFilter && cs.webkitBackdropFilter !== 'none');
            
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                const rgbaMatch = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                
                if (rgbaMatch) {
                    let alpha = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
                    const r = parseInt(rgbaMatch[1]);
                    const g = parseInt(rgbaMatch[2]);
                    const b = parseInt(rgbaMatch[3]);
                    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);

                    if (brightness > 140) {
                        if (hasBlur || alpha < 1) {
                            const finalAlpha = hasBlur ? 0.75 : alpha;
                            el.style.setProperty('background-color', `rgba(18, 18, 18, ${finalAlpha})`, 'important');
                        } else {
                            el.style.setProperty('background-color', '#121212', 'important');
                        }
                        el.style.setProperty('box-shadow', 'none', 'important'); 
                    }
                }
            }

            if (cs.color && cs.color !== 'rgba(0, 0, 0, 0)' && cs.color !== 'transparent') {
                if (isDark(cs.color)) { 
                     el.style.setProperty('color', '#e0e0e0', 'important');
                }
            }

            if (cs.borderColor && cs.borderColor !== 'rgba(0, 0, 0, 0)' && cs.borderColor !== 'transparent') {
                 if (isDark(cs.borderColor)) {
                    el.style.setProperty('border-color', '#444', 'important');
                 }
            }
        });
    }

    window.addEventListener('load', applyDarkMode);

    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(applyDarkMode, 100);
    });
    
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
