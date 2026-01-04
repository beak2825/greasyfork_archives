// ==UserScript==
// @name         Read Aloud with Voice, Speed & Pitch Controls
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Use Web Speech API to read aloud selected text or full page, with voice picker, speed & pitch sliders, plus minimize & close buttons
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548387/Read%20Aloud%20with%20Voice%2C%20Speed%20%20Pitch%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/548387/Read%20Aloud%20with%20Voice%2C%20Speed%20%20Pitch%20Controls.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- UI Container ---
    const container = document.createElement("div");
    Object.assign(container.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#222",
        color: "#fff",
        padding: "10px",
        borderRadius: "10px",
        zIndex: 9999,
        fontSize: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        width: "220px",
        fontFamily: "sans-serif"
    });

    // --- Header with controls ---
    const header = document.createElement("div");
    Object.assign(header.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "5px"
    });

    const title = document.createElement("span");
    title.textContent = "Read Aloud";
    title.style.fontWeight = "bold";

    const controls = document.createElement("div");

    // Minimize button
    const minimizeBtn = document.createElement("button");
    minimizeBtn.textContent = "—";
    Object.assign(minimizeBtn.style, {
        background: "transparent",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        marginRight: "5px",
        fontSize: "16px"
    });

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    Object.assign(closeBtn.style, {
        background: "transparent",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontSize: "16px"
    });

    controls.appendChild(minimizeBtn);
    controls.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(controls);

    // --- Content container (collapsible) ---
    const content = document.createElement("div");
    Object.assign(content.style, {
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    });

    // --- Voice Dropdown ---
    const voiceSelect = document.createElement("select");
    Object.assign(voiceSelect.style, {
        padding: "5px",
        width: "100%"
    });

    // --- Speed Slider ---
    const rateLabel = document.createElement("label");
    rateLabel.textContent = "Speed: 1.0";
    const rateSlider = document.createElement("input");
    rateSlider.type = "range";
    rateSlider.min = "0.5";
    rateSlider.max = "2";
    rateSlider.step = "0.1";
    rateSlider.value = "1";
    rateSlider.style.width = "100%";
    rateSlider.addEventListener("input", () => {
        rateLabel.textContent = `Speed: ${rateSlider.value}`;
    });

    // --- Pitch Slider ---
    const pitchLabel = document.createElement("label");
    pitchLabel.textContent = "Pitch: 1.0";
    const pitchSlider = document.createElement("input");
    pitchSlider.type = "range";
    pitchSlider.min = "0.5";
    pitchSlider.max = "2";
    pitchSlider.step = "0.1";
    pitchSlider.value = "1";
    pitchSlider.style.width = "100%";
    pitchSlider.addEventListener("input", () => {
        pitchLabel.textContent = `Pitch: ${pitchSlider.value}`;
    });

    // --- Button ---
    const btn = document.createElement("button");
    btn.textContent = "🔊 Read Aloud";
    Object.assign(btn.style, {
        padding: "8px",
        background: "#444",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
    });

    // --- Assemble ---
    content.appendChild(voiceSelect);
    content.appendChild(rateLabel);
    content.appendChild(rateSlider);
    content.appendChild(pitchLabel);
    content.appendChild(pitchSlider);
    content.appendChild(btn);

    container.appendChild(header);
    container.appendChild(content);
    document.body.appendChild(container);

    // --- Voice Setup ---
    let voices = [];
    function populateVoices() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = "";
        voices.forEach((v, i) => {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `${v.name} (${v.lang})`;
            voiceSelect.appendChild(option);
        });
    }

    populateVoices();
    speechSynthesis.onvoiceschanged = populateVoices;

    // --- Read Aloud Logic ---
    let utterance = null;

    btn.addEventListener("click", () => {
        const selectedText = window.getSelection().toString().trim();
        const text = selectedText || document.body.innerText;

        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            btn.textContent = "🔊 Read Aloud";
        } else {
            utterance = new SpeechSynthesisUtterance(text);

            // Apply voice, speed, pitch
            const selectedVoice = voices[voiceSelect.value];
            if (selectedVoice) utterance.voice = selectedVoice;
            utterance.rate = parseFloat(rateSlider.value);
            utterance.pitch = parseFloat(pitchSlider.value);

            btn.textContent = "⏹ Stop";
            speechSynthesis.speak(utterance);

            utterance.onend = () => {
                btn.textContent = "🔊 Read Aloud";
            };
        }
    });

    // --- Minimize & Close logic ---
    let minimized = false;
    minimizeBtn.addEventListener("click", () => {
        minimized = !minimized;
        content.style.display = minimized ? "none" : "flex";
        minimizeBtn.textContent = minimized ? "+" : "—";
    });

    closeBtn.addEventListener("click", () => {
        speechSynthesis.cancel();
        container.remove();
    });
})();