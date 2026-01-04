// ==UserScript==
// @name         WTR Lab Uncensor
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Replaces censored words with their uncensored counterparts on wtr-lab.com for a better reading experience, without breaking site functionality.
// @author       MasuRii
// @match        https://wtr-lab.com/en/novel/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553165/WTR%20Lab%20Uncensor.user.js
// @updateURL https://update.greasyfork.org/scripts/553165/WTR%20Lab%20Uncensor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CHAPTER_BODY_SELECTOR = '.chapter-body';
    const PROCESSED_MARKER = 'data-uncensor-processed';
    const LOGGING_STORAGE_KEY = 'wtrLabUncensor_loggingEnabled';

    // --- LOGGING SETUP ---
    // Get the saved logging preference, defaulting to false (disabled).
    let loggingEnabled = GM_getValue(LOGGING_STORAGE_KEY, false);

    // Function to toggle the logging preference.
    function toggleLogging() {
        loggingEnabled = !loggingEnabled; // Flip the current state
        GM_setValue(LOGGING_STORAGE_KEY, loggingEnabled); // Save the new state
        alert(`WTR Lab Uncensor logging is now ${loggingEnabled ? 'ENABLED' : 'DISABLED'}.`);
    }

    // Register the command in the Tampermonkey menu.
    GM_registerMenuCommand('Toggle Logging', toggleLogging);


    // --- CENSOR DATABASE ---
    const CENSOR_DATA = [
      { "censored": "B*stard", "uncensored": "Bastard" },
      { "censored": "Bulls**t", "uncensored": "Bullshit" },
      { "censored": "D*mn", "uncensored": "Damn" },
      { "censored": "F**K", "uncensored": "FUCK" },
      { "censored": "F*CK", "uncensored": "FUCK" },
      { "censored": "F*cking", "uncensored": "Fucking" },
      { "censored": "Motherf*cking", "uncensored": "Motherfucking" },
      { "censored": "P*ss", "uncensored": "Piss" },
      { "censored": "Scr*w", "uncensored": "Screw" },
      { "censored": "a**es", "uncensored": "asses" },
      { "censored": "assh*le", "uncensored": "asshole" },
      { "censored": "b**tards", "uncensored": "bastards" },
      { "censored": "b*stard", "uncensored": "bastard" },
      { "censored": "b*stards", "uncensored": "bastards" },
      { "censored": "b*tchy", "uncensored": "bitchy" },
      { "censored": "bulls**t", "uncensored": "bullshit" },
      { "censored": "bullsh*ting", "uncensored": "bullshitting" },
      { "censored": "d*mn", "uncensored": "damn" },
      { "censored": "dumb***es", "uncensored": "dumbasses" },
      { "censored": "dumb*ss", "uncensored": "dumbass" },
      { "censored": "f****r", "uncensored": "fucker" },
      { "censored": "f**ked", "uncensored": "fucked" },
      { "censored": "f**king", "uncensored": "fucking" },
      { "censored": "f*cker", "uncensored": "fucker" },
      { "censored": "idi*t", "uncensored": "idiot" },
      { "censored": "motherf**kers", "uncensored": "motherfuckers" },
      { "censored": "p*ss", "uncensored": "piss" },
      { "censored": "p*ssed", "uncensored": "pissed" },
      { "censored": "r*ped", "uncensored": "raped" },
      { "censored": "s***hole", "uncensored": "shithole" },
      { "censored": "s**t", "uncensored": "shit" },
      { "censored": "sh***y", "uncensored": "shitty" },
      { "censored": "sh*tless", "uncensored": "shitless" },
      { "censored": "sh*tty", "uncensored": "shitty" },
      { "censored": "A**hole", "uncensored": "Asshole" },
      { "censored": "B*****d", "uncensored": "Bastard" },
      { "censored": "B***h", "uncensored": "Bitch" },
      { "censored": "B*Tch", "uncensored": "BiTch" },
      { "censored": "B*tch", "uncensored": "Bitch" },
      { "censored": "Bullsh*t", "uncensored": "Bullshit" },
      { "censored": "D**n", "uncensored": "Damn" },
      { "censored": "F**k", "uncensored": "Fuck" },
      { "censored": "F*ck", "uncensored": "Fuck" },
      { "censored": "Motherf*cker", "uncensored": "Motherfucker" },
      { "censored": "Sh*t", "uncensored": "Shit" },
      { "censored": "a**hole", "uncensored": "asshole" },
      { "censored": "a**holes", "uncensored": "assholes" },
      { "censored": "a*s", "uncensored": "ass" },
      { "censored": "a*ses", "uncensored": "asses" },
      { "censored": "an*s", "uncensored": "anus" },
      { "censored": "an*ses", "uncensored": "anuses" },
      { "censored": "as*es", "uncensored": "asses" },
      { "censored": "as*ses", "uncensored": "asses" },
      { "censored": "b*****d", "uncensored": "bastardd" },
      { "censored": "b***h", "uncensored": "bitch" },
      { "censored": "b**bs", "uncensored": "boobs" },
      { "censored": "b*tch", "uncensored": "bitch" },
      { "censored": "b*tches", "uncensored": "bitches" },
      { "censored": "b*tt", "uncensored": "butt" },
      { "censored": "bl*wjob", "uncensored": "blowjob" },
      { "censored": "bo*bs", "uncensored": "boobs" },
      { "censored": "bullsh*t", "uncensored": "bullshit" },
      { "censored": "bullsh*tting", "uncensored": "bullshitting" },
      { "censored": "c**p", "uncensored": "crap" },
      { "censored": "c*ck", "uncensored": "cock" },
      { "censored": "c*cks", "uncensored": "cocks" },
      { "censored": "d**n", "uncensored": "damn" },
      { "censored": "d*ck", "uncensored": "dick" },
      { "censored": "d*cks", "uncensored": "dicks" },
      { "censored": "f**k", "uncensored": "fuck" },
      { "censored": "f*ck", "uncensored": "fuck" },
      { "censored": "f*cked", "uncensored": "fucked" },
      { "censored": "f*cking", "uncensored": "fucking" },
      { "censored": "h*rd", "uncensored": "hard" },
      { "censored": "m*sturbating", "uncensored": "masturbating" },
      { "censored": "motherf*cker", "uncensored": "motherfucker" },
      { "censored": "motherf*cking", "uncensored": "motherfucking" },
      { "censored": "org*sm", "uncensored": "orgasm" },
      { "censored": "p*bic", "uncensored": "pubic" },
      { "censored": "p*nes", "uncensored": "penes" },
      { "censored": "p*nile", "uncensored": "penile" },
      { "censored": "p*nis", "uncensored": "penes" },
      { "censored": "p*rn", "uncensored": "porn" },
      { "censored": "s*x", "uncensored": "sex" },
      { "censored": "s*xual", "uncensored": "sexual" },
      { "censored": "sh*t", "uncensored": "shit" },
      { "censored": "sl*t", "uncensored": "slut" },
      { "censored": "t*ts", "uncensored": "tits" },
      { "censored": "w*ener", "uncensored": "wiener" },
      { "censored": "wh*rehouses", "uncensored": "whorehouses" },
      { "censored": "Bull***", "uncensored": "Bullshit" },
      { "censored": "Bulls**", "uncensored": "Bullshit" },
      { "censored": "Bullsh*", "uncensored": "Bullshit" },
      { "censored": "Godd*", "uncensored": "Goddamn" },
      { "censored": "Motherf*", "uncensored": "Motherfucker" },
      { "censored": "Scr*", "uncensored": "Screw" },
      { "censored": "Sh*", "uncensored": "Shit" },
      { "censored": "assh*", "uncensored": "asshole" },
      { "censored": "bulls**", "uncensored": "bullshit" },
      { "censored": "bullsh*", "uncensored": "bullshit" },
      { "censored": "dumb***", "uncensored": "dumbass" },
      { "censored": "idi*", "uncensored": "idiot" },
      { "censored": "motherf*", "uncensored": "motherfucker" },
      { "censored": "motherf**", "uncensored": "motherfucker" },
      { "censored": "****r", "uncensored": "fucker" },
      { "censored": "***hole", "uncensored": "asshole" },
      { "censored": "**K", "uncensored": "FUCK" },
      { "censored": "**hole", "uncensored": "asshole" },
      { "censored": "**k", "uncensored": "fuck" },
      { "censored": "**ked", "uncensored": "fucked" },
      { "censored": "**kers", "uncensored": "fuckers" },
      { "censored": "**king", "uncensored": "fucking" },
      { "censored": "**tards", "uncensored": "bastards" },
      { "censored": "*CK", "uncensored": "FUCK" },
      { "censored": "*Ck", "uncensored": "FUCk" },
      { "censored": "*Tch", "uncensored": "BiTch" },
      { "censored": "*ck", "uncensored": "Fuck" },
      { "censored": "*cked", "uncensored": "fucked" },
      { "censored": "*cker", "uncensored": "fucker" },
      { "censored": "*cking", "uncensored": "fucking" },
      { "censored": "*cks", "uncensored": "fucks" },
      { "censored": "*mn", "uncensored": "damn" },
      { "censored": "*nis", "uncensored": "penis" },
      { "censored": "*ped", "uncensored": "raped" },
      { "censored": "*rn", "uncensored": "porn" },
      { "censored": "*ssed", "uncensored": "assed" },
      { "censored": "*stard", "uncensored": "bastard" },
      { "censored": "*stards", "uncensored": "bastards" },
      { "censored": "*tch", "uncensored": "bitch" },
      { "censored": "*tches", "uncensored": "bitches" },
      { "censored": "*tchy", "uncensored": "bitchy" },
      { "censored": "*tless", "uncensored": "shitless" },
      { "censored": "*tty", "uncensored": "shitty" },
      { "censored": "Godd*mn", "uncensored": "Goddamn" },
      { "censored": "f***", "uncensored": "fuck" },
      { "censored": "f******", "uncensored": "fucking" },
      { "censored": "F*Ck", "uncensored": "Fuck" },
      { "censored": "s***", "uncensored": "shit" },
      { "censored": "Bull***t", "uncensored": "Bullshit" },
      { "censored": "bada**", "uncensored": "badass" },
      { "censored": "smarta**", "uncensored": "smartass" },
      { "censored": "Bullsh**", "uncensored": "Bullshit" },
      { "censored": "F * ck", "uncensored": "Fuck" },
      { "censored": "d * ck", "uncensored": "dick" },
      { "censored": "*ss", "uncensored": "ass" },
      { "censored": "*sses", "uncensored": "asses" },
      { "censored": "*sshole", "uncensored": "asshole" },
      { "censored": "*ssholes", "uncensored": "assholes" },
      { "censored": "bada**.", "uncensored": "badass." },
      { "censored": "f***?", "uncensored": "fuck?" },
      { "censored": "s***,", "uncensored": "shit," },
      { "censored": "a**!", "uncensored": "ass!" },
      { "censored": "Bullsh**!", "uncensored": "Bullshit!" },
      { "censored": "bullsh*tting.", "uncensored": "bullshitting." },
      { "censored": "sh*tting", "uncensored": "shitting" },
      { "censored": "bullsh*tting!\"", "uncensored": "bullshitting!\"" },
      { "censored": "sh*ting", "uncensored": "shitting" },
      { "censored": "d * mned", "uncensored": "damned" },
      { "censored": "sh * t!", "uncensored": "shit!" },
      { "censored": "sh * t", "uncensored": "shit" },
      { "censored": "a * s!", "uncensored": "ass!" },
      { "censored": "a * s", "uncensored": "ass" },
      { "censored": "B * tch,\"", "uncensored": "Bitch,\"" },
      { "censored": "B * tch,", "uncensored": "Bitch," },
      { "censored": "B * tch", "uncensored": "Bitch" },
      { "censored": "F * cking", "uncensored": "Fucking" },
      { "censored": "B * stard,", "uncensored": "Bastard," },
      { "censored": "B * stard", "uncensored": "Bastard" },
      { "censored": "a**!\"", "uncensored": "ass!\"" },
      { "censored": "a**.", "uncensored": "ass." },
      { "censored": "B*llshit", "uncensored": "Bullshit" },
      { "censored": "F*cK", "uncensored": "FucK" },
      { "censored": "F*k", "uncensored": "Fuck" },
      { "censored": "F*uk", "uncensored": "Fuck" },
      { "censored": "r*tards", "uncensored": "retards" },
      { "censored": "D*MMIT", "uncensored": "DAMMIT" },
      { "censored": "D*MN", "uncensored": "DAMN" },
      { "censored": "D*MNIT", "uncensored": "DAMNIT" },
      { "censored": "D*mmit", "uncensored": "Damnit" },
      { "censored": "F***ING", "uncensored": "FUCKING" },
      { "censored": "SH*T", "uncensored": "SHIT" },
      { "censored": "b*tiches", "uncensored": "bitches" },
      { "censored": "d*mmit", "uncensored": "damnit" },
      { "censored": "f*king", "uncensored": "fucking" },
      { "censored": "h*ll", "uncensored": "hell" },
      { "censored": "F***!", "uncensored": "Fuck!" },
      { "censored": "B*stards", "uncensored": "Bastards" },
      { "censored": "bad*ss", "uncensored": "badass" },
      { "censored": "bad-*ss", "uncensored": "badass" },
      { "censored": "b****es", "uncensored": "bitches" },
      { "censored": "f*cked-up", "uncensored": "fucked-up" },
      { "censored": "Motherf***er", "uncensored": "Motherfucker" },
      { "censored": "b****,", "uncensored": "bitch," },
      { "censored": "son of a ****.", "uncensored": "son of a bitch." },
      { "censored": "****ing", "uncensored": "fucking" },
      { "censored": "Motherf***", "uncensored": "Motherfucker" },
      { "censored": "b****", "uncensored": "bitch" },
      { "censored": "Fuc*ing", "uncensored": "Fucking" },
      { "censored": "fu*k", "uncensored": "fuck" },
      { "censored": "Fuc*", "uncensored": "Fuck" },
      { "censored": "fu*", "uncensored": "fuck" },
      { "censored": "F*ckChens", "uncensored": "FuckChens" },
      { "censored": "Fu*k", "uncensored": "Fuck" },
      { "censored": "b**ch", "uncensored": "bitch" },
      { "censored": "motherf***er", "uncensored": "motherfucker" },
      { "censored": "as*holes", "uncensored": "assholes" },
      { "censored": "bast*rds", "uncensored": "bastards" },
      { "censored": "fu*ked", "uncensored": "fucked" },
      { "censored": "fu*ked-up", "uncensored": "fucked-up" },
      { "censored": "rottenbast*ards", "uncensored": "rottenbastards" },
      { "censored": "bast*rd", "uncensored": "bastard" },
      { "censored": "dr*g", "uncensored": "drug" },
      { "censored": "dr*gs", "uncensored": "drugs" },
      { "censored": "pr*n", "uncensored": "porn" },
      { "censored": "r*pe", "uncensored": "rape" },
      { "censored": "rap*d", "uncensored": "raped" },
      { "censored": "rap*st", "uncensored": "rapist" },
      { "censored": "r*ping", "uncensored": "raping" },
      { "censored": "F*ckers", "uncensored": "Fuckers" },
      { "censored": "b*lly", "uncensored": "bully" },
      { "censored": "p*rvert", "uncensored": "pervert" },
      { "censored": "s**cide", "uncensored": "suicide" },
      { "censored": "t*rturing", "uncensored": "torturing" },
      { "censored": "motherf***ing", "uncensored": "motherfucking" }
    ];

    // --- REPLACEMENT ENGINE ---

    // Create a map for quick lookups: { "c*nsored": "uncensored" }
    const replacementMap = CENSOR_DATA.reduce((acc, item) => {
        acc[item.censored] = item.uncensored;
        return acc;
    }, {});

    // Function to escape special characters for use in a RegExp
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Create a single, efficient RegExp to find all censored words.
    // We sort by length descending to match longer words first (e.g., "bullsh*t" before "sh*t").
    const censoredWordsPattern = CENSOR_DATA
        .map(item => escapeRegex(item.censored))
        .sort((a, b) => b.length - a.length)
        .join('|');
    const uncensorRegex = new RegExp(censoredWordsPattern, 'g');

    /**
     * Recursively traverses the DOM from a starting node, replacing text in text nodes.
     * This method preserves element nodes and their event listeners.
     * @param {Node} node The node to start traversing from.
     */
    function traverseAndReplace(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.nodeValue;
            const newText = originalText.replace(uncensorRegex, (matched) => {
                return replacementMap[matched] || matched;
            });
            if (newText !== originalText) {
                node.nodeValue = newText;
            }
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'script' && node.tagName.toLowerCase() !== 'style') {
            for (const child of node.childNodes) {
                traverseAndReplace(child);
            }
        }
    }

    /**
     * Replaces censored words within a target element using safe DOM traversal.
     * @param {HTMLElement} targetElement The container element to process.
     */
    function applyUncensor(targetElement) {
        if (!targetElement || targetElement.hasAttribute(PROCESSED_MARKER)) {
            return;
        }

        traverseAndReplace(targetElement);
        targetElement.setAttribute(PROCESSED_MARKER, 'true');

        // Conditionally log to the console based on the user's preference.
        if (loggingEnabled) {
            console.log('WTR Lab Uncensor script applied to chapter.', targetElement);
        }
    }

    /**
     * Finds and processes all chapter bodies currently in the DOM.
     */
    function processAllVisibleChapters() {
        const chapterBodies = document.querySelectorAll(CHAPTER_BODY_SELECTOR);
        chapterBodies.forEach(applyUncensor);
    }

    // --- EXECUTION LOGIC ---
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(CHAPTER_BODY_SELECTOR) || node.querySelector(CHAPTER_BODY_SELECTOR)) {
                            setTimeout(processAllVisibleChapters, 250);
                            return;
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(processAllVisibleChapters, 500);

})();