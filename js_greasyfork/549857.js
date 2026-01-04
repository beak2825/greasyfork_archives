// ==UserScript==
// @name         Mousehunt Living Garden Script (Cypher)
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Autobot for Living Garden
// @author       Cypher
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549857/Mousehunt%20Living%20Garden%20Script%20%28Cypher%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549857/Mousehunt%20Living%20Garden%20Script%20%28Cypher%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const mhLocation = document.querySelector('.mousehuntHud-environmentName').textContent;
    if (mhLocation === 'Living Garden' ||
        mhLocation === 'Twisted Garden' ||
        mhLocation === 'Lost City' ||
        mhLocation === 'Cursed City' ||
        mhLocation === 'Sand Dunes' ||
        mhLocation === 'Sand Crypts'
    ){
        console.log('%c[Living Garden] Detected location in Living Garden region...', 'color: #2b7cff;')
    }
    else {
        return;
    }

    // Wrap the entire interval function in an async function
    setInterval(async function(){

        switch (mhLocation){
            case 'Living Garden':
                {
                    console.log('%c[Living Garden] Detected location in Living Garden...', 'color: #2b7cff;');
                    const blueDrop = Number(document.querySelector('.stateFilling .itemImage.dewdrop .quantity').textContent);
                    const checkPourActive = document.querySelector('.pour.active');
                    if (!checkPourActive){
                        const pourHunts = Number(document.querySelector('.pourEstimate').textContent.trim().match(/(\d+)/)[0]);
                        if (pourHunts < 35){
                             if (blueDrop < 20){
                                console.log(`%c[Living Garden] Current blue drop ${blueDrop}/20, arming Blue Sponge Charm...`, 'color: #ffa02b;');
                                const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                                if (currentCharm !== 'Sponge Charm'){
                                    const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                                    checkCharm.click();
                                    await waitFor(2000);
                                    const blueCharmArmButton = document.querySelector('.campPage-trap-itemBrowser-item-armButton[data-item-id="1020"]'); // Blue Sponge Charm
                                    blueCharmArmButton.click();
                                    await waitFor(2000);
                                    const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                                    closeCharm.click();
                                    await waitFor(2000);
                                }
                                else {
                                    console.log('[Living Garden] Blue Sponge Charm armed, bypassing...');
                                }
                            }
                        }
                        else if (pourHunts === 35){
                            console.log(`%c[Living Garden] Current blue drop ${blueDrop}/20, pouring...`, 'color: #ffa02b;');
                            const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                            if (currentCharm === 'Sponge Charm'){
                                console.log('[Living Garden] Currently poured, disarming charm...');
                                const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                                checkCharm.click();
                                await waitFor(2000);
                                const disarmCharm = document.querySelector('.campPage-trap-itemBrowser-item-disarmButton');
                                disarmCharm.click();
                                await waitFor(2000);
                                const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                                closeCharm.click();
                                await waitFor(2000);
                            }
                            else {
                                console.log('[Living Garden] Currently poured and sponge charms disarmed, bypassing...');
                            }
                        
                            const pourButton = document.querySelector('.pour');
                            pourButton.click();
                            await waitFor(5000);
                            const confirmButton = document.querySelector('input.confirm.button');
                            confirmButton.click();
                            await waitFor(5000);

                        }
                        else {
                            const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                            if (currentCharm === 'Sponge Charm'){
                                console.log('[Living Garden] Currently poured, disarming charm...');
                                const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                                checkCharm.click();
                                await waitFor(2000);
                                const disarmCharm = document.querySelector('.campPage-trap-itemBrowser-item-disarmButton');
                                disarmCharm.click();
                                await waitFor(2000);
                                const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');  
                                closeCharm.click();
                                await waitFor(2000);
                            }
                            else {
                                console.log('[Living Garden] Currently poured and sponge charms disarmed, bypassing...');
                            }
                        }
                    }
                    break;
                }

            case 'Twisted Garden':
                {
                    console.log('%c[Twisted Garden] Detected location in Twisted Garden...', 'color: #2b7cff;');
                    const redDrop = Number(document.querySelector('.stateFilling .itemImage.red .quantity').textContent);
                    const yellowDrop = Number(document.querySelector('.stateFilling .itemImage.yellow .quantity').textContent);
                    const checkPourActive = document.querySelector('.pour.active');
                    if (!checkPourActive){
                        const pourHunts = Number(document.querySelector('.pourEstimate').textContent.trim().match(/(\d+)/)[0]);
                        if (pourHunts < 35){
                            if (redDrop < 10){
                                console.log(`%c[Twisted Garden] Current red drop ${redDrop}/20, arming Red Sponge Charm...`, 'color: #ffa02b;');
                                const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                                if (currentCharm !== 'Red Sponge Charm'){
                                    const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                                    checkCharm.click();
                                    await waitFor(2000);
                                    const redCharmArmButton = document.querySelector('.campPage-trap-itemBrowser-item-armButton[data-item-id="1017"]'); // Red Sponge Charm
                                    redCharmArmButton.click();
                                    await waitFor(2000);
                                    const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                                    closeCharm.click();
                                    await waitFor(2000);
                                }
                                else {
                                    console.log('[Twisted Garden] Red Sponge Charm armed, bypassing...')
                                }
                            }
                            else if (yellowDrop < 10){
                                console.log(`%c[Twisted Garden] Current yellow drop ${yellowDrop}/20, arming Yellow Sponge Charm...`, 'color: #ffa02b;');
                                const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                                if (currentCharm !== 'Yellow Sponge Charm'){
                                    const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                                    checkCharm.click();
                                    await waitFor(2000);
                                    const yellowCharmArmButton = document.querySelector('.campPage-trap-itemBrowser-item-armButton[data-item-id="1022"]'); // Yellow Sponge Charm
                                    yellowCharmArmButton.click();
                                    await waitFor(2000);
                                    const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                                    closeCharm.click();
                                    await waitFor(2000);
                                }
                                else {
                                    console.log('[Twisted Garden] Yellow Sponge Charm armed, bypassing...')
                                }
                            }
                        }
                        else if (pourHunts === 35){
                            console.log(`%c[Twisted Garden] Current red drop ${redDrop}/20 and yellow drop ${yellowDrop}/20, pouring...`, 'color: #ffa02b;');
                            const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                            if (currentCharm === 'Red Sponge Charm' || currentCharm === 'Yellow Sponge Charm'){
                                console.log('[Twisted Garden] Currently poured, disarming charm...');
                                const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                                checkCharm.click();
                                await waitFor(2000);
                                const disarmCharm = document.querySelector('.campPage-trap-itemBrowser-item-disarmButton');
                                disarmCharm.click();
                                await waitFor(2000);
                                const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                                closeCharm.click();
                                await waitFor(2000);
                            }
                            else {
                                console.log('[Twisted Garden] Currently poured and sponge charms disarmed, bypassing...');
                            }
                            
                            const pourButton = document.querySelector('.pour');
                            pourButton.click();
                            await waitFor(5000);
                            const confirmButton = document.querySelector('input.confirm.button');
                            confirmButton.click();
                            await waitFor(5000);
                        }
                    }
                    else {
                        const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                        if (currentCharm === 'Red Sponge Charm' || currentCharm === 'Yellow Sponge Charm'){
                            console.log('[Twisted Garden] Currently poured, disarming charm...');
                            const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                            checkCharm.click();
                            await waitFor(2000);
                            const disarmCharm = document.querySelector('.campPage-trap-itemBrowser-item-disarmButton');
                            disarmCharm.click();
                            await waitFor(2000);
                            const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');  
                            closeCharm.click();
                            await waitFor(2000);
                        }
                        else {
                            console.log('[Twisted Garden] Currently poured and sponge charms disarmed, bypassing...');
                        }
                    }
                    break;
                }

            case 'Lost City':
                {
                    break;
                }

            case 'Cursed City':
                {
                    console.log('%c[Cursed City] Detected location in Cursed City...', 'color: #2b7cff;');
                    const checkFear = document.querySelector('.curse.fear.active');
                    const checkDarkness = document.querySelector('.curse.darkness.active');
                    const checkMist = document.querySelector('.curse.mist.active');
                    const checkClear = document.querySelector('.minigameContainer.curse.blessed');

                    if (!checkClear){
                        if (checkFear){
                            console.log('%c[Cursed City] Arming Bravery Charm...', 'color: #ffa02b;');
                            const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                            if (currentCharm !== 'Bravery Charm'){
                                const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                                checkCharm.click();
                                await waitFor(2000);
                                const braveryCharmArmButton = document.querySelector('.campPage-trap-itemBrowser-item-armButton[data-item-id="1011"]'); // Bravery Charm
                                braveryCharmArmButton.click();
                                await waitFor(2000);
                                const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                                closeCharm.click();
                                await waitFor(2000);
                            }
                            else {
                                console.log('[Cursed City] Bravery Charm armed, bypassing...')
                            }
                        }
                        else if (checkDarkness){
                            console.log('%c[Cursed City] Arming Shine Charm...', 'color: #ffa02b;');
                            const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                            if (currentCharm !== 'Shine Charm'){
                                const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                                checkCharm.click();
                                await waitFor(2000);
                                const shineCharmArmButton = document.querySelector('.campPage-trap-itemBrowser-item-armButton[data-item-id="1019"]'); // Shine Charm
                                shineCharmArmButton.click();
                                await waitFor(2000);
                                const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                                closeCharm.click();
                                await waitFor(2000);
                            }
                            else {
                                console.log('[Cursed City] Shine Charm armed, bypassing...')
                            }
                        }
                        else if (checkMist){
                            console.log('%c[Cursed City] Arming Mist Charm...', 'color: #ffa02b;');
                            const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                            if (currentCharm !== 'Clarity Charm'){
                                const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                                checkCharm.click();
                                await waitFor(2000);
                                const clarityCharmArmButton = document.querySelector('.campPage-trap-itemBrowser-item-armButton[data-item-id="1012"]'); // Clarity Charm
                                clarityCharmArmButton.click();
                                await waitFor(2000);
                                const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                                closeCharm.click();
                                await waitFor(2000);
                            }
                            else {
                                console.log('[Cursed City] Clarity Charm armed, bypassing...');
                            }
                        }
                    }
                    else {
                        const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                        if (currentCharm === 'null' || currentCharm === ''){
                            console.log('[Cursed City] All curse cleared and no charm armed, bypassing...');
                        }
                        else {
                            console.log('[Cursed City] All curse cleared, disarming charm...');
                            const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                            checkCharm.click();
                            await waitFor(2000);
                            const disarmCharm = document.querySelector('.campPage-trap-itemBrowser-item-disarmButton');
                            disarmCharm.click();
                            await waitFor(2000);
                            const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                            closeCharm.click();
                            await waitFor(2000);
                        }
                    }
                    break;
                }

            case 'Sand Dunes':
                {
                    break;
                }

            case 'Sand Crypts':
                {
                    console.log('%c[Sand Crypts] Detected location in Sand Crypts...', 'color: #2b7cff;');
                    const saltUsed = Number(document.querySelector('.salt_charms').textContent.trim());
                    if (saltUsed < 20){
                        console.log('%c[Sand Crypts] Less than 20 salts, arming Grub Salt Charm...', 'color: #ffa02b;');
                        const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                        if (currentCharm !== 'Grub Salt Charm'){
                            const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                            checkCharm.click();
                            await waitFor(2000);
                            const saltCharmArmButton = document.querySelector('.campPage-trap-itemBrowser-item-armButton[data-item-id="1014"]'); // Grub Salt Charm
                            saltCharmArmButton.click();
                            await waitFor(2000);
                            const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                            closeCharm.click();
                            await waitFor(2000);
                        }
                        else {
                            console.log('[Sand Crypts] Grub Salt Charm armed, bypassing...');
                        }
                    }
                    else {
                        console.log(`%c[Sand Crypts] Currently at ${saltUsed} salts, arming Grub Scent Charm...', 'color: #ffa02b;`);
                        const currentCharm = document.querySelector('.trapSelectorView__armedItem[data-item-classification="trinket"] .trapSelectorView__tooltip .trapSelectorView__tooltipContent').textContent.trim();
                        if (currentCharm !== 'Grub Scent Charm'){
                            const checkCharm = document.querySelector('button[data-item-classification="trinket"]');
                            checkCharm.click();
                            await waitFor(2000);
                            const scentCharmArmButton = document.querySelector('.campPage-trap-itemBrowser-item-armButton[data-item-id="1015"]'); // Grub Scent Charm
                            scentCharmArmButton.click();
                            await waitFor(2000);
                            const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                            closeCharm.click();
                            await waitFor(2000);
                        }
                        break;
                    }
                }
        }

    }, 20*1000);

    // Utility function to wait for a specified time
    function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();