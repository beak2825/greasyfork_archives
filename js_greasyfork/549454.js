// ==UserScript==
// @name         One Word Stories With No Restrictions
// @namespace    https://julies-stuff.dev/
// @version      2025-09-13
// @description  I remove the restrictions on the website
// @author       colonthreeing
// @match        https://singleword.web.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=web.app
// @grant        none
// @license      AGPL-V3
// @downloadURL https://update.greasyfork.org/scripts/549454/One%20Word%20Stories%20With%20No%20Restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/549454/One%20Word%20Stories%20With%20No%20Restrictions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // remove the checking
    const element = document.getElementById("wordInput");
    element.outerHTML = element.outerHTML;

    // no more sanitizing
    function cleanWord(raw) {
        return raw;
    }

    // no more time delay
    async function addWord() {
        let raw = input.value.trim();
        raw = cleanWord(raw);

        if(!raw){
            notifyTop('Enter a valid word', 'var(--btnDanger)', true);
            return;
        }

        cooldownUntil = Date.now();

        const payload = {
            word: raw,
            color: myColor,
            author: myUser,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        try{
            await db.collection('storyWords').add(payload);
            input.value = '';
            charCounter.textContent = `0/${MAX_WORD_LENGTH}`;
            cachedWords.push({ word: raw, color: myColor, author: myUser, timestamp: Date.now()/1000 });
            renderStory(cachedWords);
            notifyTop('Saved!', 'var(--btnMain)', false);
            setTimeout(()=> loadOnce(), 500);
        }catch(e){
            console.error('save err', e);
            notifyTop('Save failed', 'var(--btnDanger)', true);
            cooldownUntil = 0;
        }
    }
})();