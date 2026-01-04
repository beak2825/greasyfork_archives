// ==UserScript==
// @name         Read the section highlight (Transparent Menu)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @license      MIT
// @description  Read highlighted text with speech synthesis
// @author       an vu an
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549139/Read%20the%20section%20highlight%20%28Transparent%20Menu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549139/Read%20the%20section%20highlight%20%28Transparent%20Menu%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const menu = document.createElement("div");
    menu.style.position = "fixed";
    menu.style.bottom = "20px";
    menu.style.right = "20px";
    menu.style.zIndex = "9999";
    menu.style.background = "transparent";
    menu.style.border = "none";
    menu.style.borderRadius = "0";
    menu.style.padding = "0";
    menu.style.boxShadow = "none";
    menu.style.fontSize = "14px";
    menu.style.fontFamily = "sans-serif";
    document.body.appendChild(menu);

    menu.innerHTML = `
      <div style="margin-bottom:6px; font-weight:bold; color:#ff6600;">🔊 Read</div>
      <button id="speakBtn" style="background:transparent; border:none; color:blue; cursor:pointer;">▶️ Read 1 time</button><br>
      <button id="speakLoopBtn" style="background:transparent; border:none; color:green; cursor:pointer;">🔁 Read continuously</button><br>
      <button id="stopBtn" style="background:transparent; border:none; color:red; cursor:pointer;">⏹ Stop</button>
    `;

    const speakBtn = menu.querySelector("#speakBtn");
    const speakLoopBtn = menu.querySelector("#speakLoopBtn");
    const stopBtn = menu.querySelector("#stopBtn");

    let selectedVoice = null;
    let loopMode = false;

    function loadVoices() {
        const voices = speechSynthesis.getVoices();
        const vi = voices.find(v => v.lang.startsWith("vi"));
        if (vi) {
            selectedVoice = vi;
        } else {
            selectedVoice = voices[0]; // fallback
        }
    }
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    function speakText(text) {
        const synth = window.speechSynthesis;
        synth.cancel();

        text = text.replace(/[^\p{L}\p{N}\s.,!?]/gu, "");

        if (!text) {
            alert("❗ No valid content to read");
            return;
        }

        const utter = new SpeechSynthesisUtterance(text);
        if (selectedVoice) {
            utter.voice = selectedVoice;
            utter.lang = selectedVoice.lang;
        } else {
            utter.lang = "vi-VN";
        }

        utter.onend = () => {
            if (loopMode) speakText(text);
        };

        synth.speak(utter);
    }

    speakBtn.addEventListener("click", () => {
        loopMode = false;
        const text = window.getSelection().toString().trim();
        if (!text) {
            alert("❗ Hãy bôi xanh văn bản để đọc");
            return;
        }
        speakText(text);
    });

    speakLoopBtn.addEventListener("click", () => {
        loopMode = true;
        const text = window.getSelection().toString().trim();
        if (!text) {
            alert("❗ Highlight text to read");
            return;
        }
        speakText(text);
    });

    stopBtn.addEventListener("click", () => {
        loopMode = false;
        window.speechSynthesis.cancel();
    });
})();
