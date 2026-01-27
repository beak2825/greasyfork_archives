// ==UserScript==
// @name         QS2 Custom Display
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Custom display
// @author       acershaw
// @match        https://v2.queslar.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564064/QS2%20Custom%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/564064/QS2%20Custom%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // increase base font size for everything
    document.documentElement.style.fontSize = '17px';
    
    let combatObservers = [];
    
    function updateQuickPanel() {
        // grab the quick panel element
        let panel = document.querySelector('h3.font-bold.uppercase.tracking-widest:not(.border-b)');
        let bp = document.querySelector('span.font-mono.hover-card-text');
        let name = document.querySelector('h3.font-bold.tracking-widest.hover-card-text');
        
        if (panel && bp && name) {
            let username = name.textContent.trim();
            let bpValue = bp.textContent.trim();
            
            // center the parent container
            let parent = panel.closest('.flex.justify-between');
            if (parent) {
                parent.style.justifyContent = 'center';
            }
            
            // update the panel with name and bp
            panel.innerHTML = `${username}<br>${bpValue}`;
            panel.style.textAlign = 'center';
            panel.style.textTransform = 'none';
            panel.style.fontSize = '16px';
            panel.style.fontWeight = 'bold';
            panel.style.lineHeight = '1.4';
            panel.classList.remove('text-muted-foreground');
            
            // watch for bp changes and update
            let observer = new MutationObserver(() => {
                let newBP = bp.textContent.trim();
                panel.innerHTML = `${username}<br>${newBP}`;
            });
            
            observer.observe(bp, {childList: true, characterData: true, subtree: true});
            
            return true;
        }
        return false;
    }
    
    function updateCombatDisplay() {
        const container = document.querySelector('#tutorial-combat');
        
        if (container) {
            // get the three level groups
            const levelGroups = container.querySelectorAll('span.flex.items-center.gap-1.tracking-wider');
            
            if (levelGroups.length === 3) {
                // find and remove the name/bp at the top
                const combatNameDiv = container.querySelector('.flex.justify-between');
                if (combatNameDiv) {
                    combatNameDiv.style.display = 'none';
                }
                
                // hide the exp text below progress bar
                const expText = container.querySelector('.flex.justify-between.font-mono.text-muted-foreground.text-xs');
                if (expText) {
                    expText.style.display = 'none';
                }
                
                // find the space-y-1 container
                const spaceDiv = container.querySelector('.space-y-1');
                
                if (spaceDiv) {
                    // save only the progress bar
                    const progressParent = spaceDiv.querySelector('.absolute.inset-0');
                    
                    // function to get current levels
                    const getLevels = () => {
                        let battling = '0', forging = '0', sanctum = '0';
                        
                        const groups = container.querySelectorAll('span.flex.items-center.gap-1.tracking-wider');
                        if (groups[0]) {
                            const span = groups[0].querySelector('span.hover-card-text');
                            battling = span ? span.textContent.trim() : '0';
                        }
                        if (groups[1]) {
                            const span = groups[1].querySelector('span.hover-card-text');
                            forging = span ? span.textContent.trim() : '0';
                        }
                        if (groups[2]) {
                            const span = groups[2].querySelector('span.hover-card-text');
                            sanctum = span ? span.textContent.trim() : '0';
                        }
                        
                        return {battling, forging, sanctum};
                    };
                    
                    // function to update the display
                    const updateLevels = () => {
                        const levels = getLevels();
                        
                        // rebuild
                        spaceDiv.innerHTML = `
                            <div class="flex justify-between items-center">
                                <span>Battling</span>
                                <span class="font-mono">${levels.battling}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Forging</span>
                                <span class="font-mono">${levels.forging}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Sanctum</span>
                                <span class="font-mono">${levels.sanctum}</span>
                            </div>
                        `;
                        
                        // re-add progress bar only
                        if (progressParent && progressParent.parentElement && progressParent.parentElement.parentElement) {
                            spaceDiv.appendChild(progressParent.parentElement.parentElement);
                        }
                        
                        // hide exp text again
                        setTimeout(() => {
                            const expText2 = container.querySelector('.flex.justify-between.font-mono.text-muted-foreground.text-xs');
                            if (expText2) expText2.style.display = 'none';
                        }, 100);
                    };
                    
                    // initial update
                    updateLevels();
                    
                    // disconnect old observers
                    combatObservers.forEach(obs => obs.disconnect());
                    combatObservers = [];
                    
                    // watch for level changes
                    levelGroups.forEach(group => {
                        const span = group.querySelector('span.hover-card-text');
                        if (span) {
                            const levelObserver = new MutationObserver(updateLevels);
                            levelObserver.observe(span, {childList: true, characterData: true, subtree: true});
                            combatObservers.push(levelObserver);
                        }
                    });
                    
                    return true;
                }
            }
        }
        return false;
    }
    
    // initial setup - keep checking until page loads
    let attempts = 0;
    let interval = setInterval(() => {
        attempts++;
        
        // try updating both sections
        let quickPanelDone = updateQuickPanel();
        let combatDone = updateCombatDisplay();
        
        // stop when both are done or max attempts reached
        if ((quickPanelDone && combatDone) || attempts > 20) {
            clearInterval(interval);
        }
    }, 500);
    
    // periodically re-check combat display, but only when tab is active
    setInterval(() => {
        if (!document.hidden) {
            updateCombatDisplay();
        }
    }, 30000); // check every 30 seconds
})();