// ==UserScript==
// @name         Kick Auto Claim Drop
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script will open and close the share button on stream to keep progression active, also checks for updates on the inventory page and claims rewards when received.
// @author       dxng
// @match        https://kick.com/*
// @icon         https://www.google.com/s2/favicons?domain=kick.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/555982/Kick%20Auto%20Claim%20Drop.user.js
// @updateURL https://update.greasyfork.org/scripts/555982/Kick%20Auto%20Claim%20Drop.meta.js
// ==/UserScript==

//Credit to DarkJS, this has just been adapted to work on Kick + fixed the auto claim

const rewardButton = 'button[aria-label*="Claim" i]'; // Looks for button with "Claim" in aria-label
const timeCheck = 5; // In minutes
const shareButton = 'button[aria-label="Share via"]';

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };
if (window.location.pathname === '/drops/inventory')
{
    // Initial check for claim button on page load
    setTimeout(() => {
        if(document.querySelector(rewardButton) !== null)
        {
            document.querySelector(rewardButton).click();
            console.log('Congratulations, you have received a gift!');
        }
    }, 1000); // 1 second delay to ensure page is loaded

    let checkChanges = (mutationsList) =>
    {
        for (const mutation of mutationsList)
        {
            if(document.querySelector(rewardButton) !== null)
            {
                document.querySelector(rewardButton).click();
                console.log('Congratulations, you have received a gift!');
                return true;
            }
        }
    };
    let verifyChanges = new MutationObserver(checkChanges);
    verifyChanges.observe(document.body, config);
    setInterval(function()
    {
        window.location.reload();
    }, timeCheck * 60000);
}
else
{
    setInterval(function()
    {
        if (document.querySelector(shareButton) !== null)
        {
            document.querySelector(shareButton).click();
        }
    }, 10000);
}