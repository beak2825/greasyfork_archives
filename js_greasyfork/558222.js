// ==UserScript==
// @name         Google Photos Time editor SPA-Safe Auto Time Setter based on Name (S00E00)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Auto-set time based on SxxEyy pattern for currently visible photo in Google Photos
// @match        https://photos.google.com/*
// @icon         https://1000logos.net/wp-content/uploads/2020/05/Google-Photos-logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558222/Google%20Photos%20Time%20editor%20SPA-Safe%20Auto%20Time%20Setter%20based%20on%20Name%20%28S00E00%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558222/Google%20Photos%20Time%20editor%20SPA-Safe%20Auto%20Time%20Setter%20based%20on%20Name%20%28S00E00%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    // ---------- Get visible filename ----------
    function getVisibleFilename() {
        const nodes = document.querySelectorAll('div.R9U8ab[aria-label^="Filename:"]');
        for(const node of nodes){
            const rect = node.getBoundingClientRect();
            if(rect.width > 0 && rect.height > 0){
                return node.innerText.trim();
            }
        }
        return null;
    }

    // ---------- Get visible pencil button ----------
    function getVisiblePencil() {
        const svgs = document.querySelectorAll('svg.v1262d.F6wuZ');
        for(const svg of svgs){
            const rect = svg.getBoundingClientRect();
            if(rect.width > 0 && rect.height > 0){
                return svg.parentElement; // click on parent to open editor
            }
        }
        return null;
    }

    // ---------- Parse SxxEyy from filename ----------
    function parseEpisode(filename) {
        const match = filename.match(/S\d{2}E(\d{2})/i);
        if(!match) return null;
        return { hh: "01", mm: match[1], period: "PM" };
    }

    // ---------- Simulate input typing ----------
    function setInputSimulated(el, value){
        el.focus();
        el.select();
        document.execCommand('insertText', false, value);
        el.dispatchEvent(new Event('input',{bubbles:true}));
        el.dispatchEvent(new Event('change',{bubbles:true}));
        el.blur();
    }

    // ---------- Main auto-set function ----------
    async function autoSetTime() {
        const filename = getVisibleFilename();
        if(!filename){
            alert("❌ Filename not found!");
            return;
        }

        const time = parseEpisode(filename);
        if(!time){
            alert("⚠️ No SxxEyy pattern in filename!");
            return;
        }

        const pencil = getVisiblePencil();
        if(!pencil){
            alert("❌ Pencil button not found!");
            return;
        }

        pencil.click();
        await sleep(300); // wait for editor

        const hourInput = document.querySelector('input[aria-label="Hour"]');
        const minInput = document.querySelector('input[aria-label="Minutes"]');
        const ampmInput = document.querySelector('input[aria-label="AM/PM"]');
        const saveBtn = document.querySelector('button[jsname="LgbsSe"][data-mdc-dialog-action="EBS5u"]');

        if(!hourInput || !minInput || !ampmInput || !saveBtn){
            alert("❌ Could not find editor inputs or Save button!");
            return;
        }

        // Set values
        setInputSimulated(hourInput, time.hh);
        await sleep(50);
        setInputSimulated(minInput, time.mm);
        await sleep(50);
        setInputSimulated(ampmInput, time.period);
        await sleep(50);

        // Click Save
        saveBtn.focus();
        saveBtn.scrollIntoView({behavior:"smooth", block:"center"});
        saveBtn.click();

        console.log(`✅ Updated: ${filename} -> ${time.hh}:${time.mm} ${time.period}`);
    }

    // ---------- Keyboard shortcut: Shift + E ----------
    document.addEventListener('keydown', e => {
        if(e.shiftKey && e.key === "E"){
            e.preventDefault();
            autoSetTime();
        }
    });

    console.log("✅ Google Photos SPA-Safe Auto Time Setter loaded. Press Shift + E on any photo.");
})();
