// ==UserScript==
// @name         ASMR.one Subtitle Translator to English
// @namespace    http://tampermonkey.net/
// @license MIT 
// @version      0.6
// @description  Translates subtitles to English on asmr.one and shows the translated version instead of the original
// @author       lukamahariel
// @match        https://asmr.one/*
// @match        https://www.asmr.one/*
// @match        https://asmr-100.com/*
// @match        https://asmr-200.com/*
// @match        https://asmr-300.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/554143/ASMRone%20Subtitle%20Translator%20to%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/554143/ASMRone%20Subtitle%20Translator%20to%20English.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function translateText(text, callback) {
        const url = `https://translate.google.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const translated = data[0][0][0] || text;
                    callback(translated);
                } catch (e) {
                    callback(text);
                }
            },
            onerror: function() {
                callback(text);
            }
        });
    }

    let lastText = '';

    const initInterval = setInterval(() => {
        const lyricEl = document.querySelector('#lyric');
        if (lyricEl) {
            clearInterval(initInterval);
            const observer = new MutationObserver(() => {
                const text = lyricEl.textContent.trim();
                if (text && text !== lastText) {
                    lastText = text;
                    lyricEl.dataset.original = text;
                    translateText(text, (trans) => {
                        if (lyricEl.dataset.original === text) {
                            lyricEl.textContent = trans;
                        }
                    });
                }
            });
            observer.observe(lyricEl, { childList: true, characterData: true, subtree: true });
            // Initial check
            const initialText = lyricEl.textContent.trim();
            if (initialText && initialText !== lastText) {
                lastText = initialText;
                lyricEl.dataset.original = initialText;
                translateText(initialText, (trans) => {
                    if (lyricEl.dataset.original === initialText) {
                        lyricEl.textContent = trans;
                    }
                });
            }
        }
    }, 100); // Check every 100ms for the element
})();