// ==UserScript==
// @name         Gemini TTS Reader
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Read selected text using Gemini 2.5 Flash TTS with customizable Hotkey and System Prompts.
// @author       gemini&Marco
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560437/Gemini%20TTS%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/560437/Gemini%20TTS%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        model: 'gemini-2.5-flash-preview-tts',
        sampleRate: 24000,
        voices: ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'],
        defaultHotkey: 'alt+t'
    };

    // --- State Management ---
    const State = {
        get apiKey() { return GM_getValue('GEMINI_API_KEY', ''); },
        set apiKey(v) { GM_setValue('GEMINI_API_KEY', v.trim()); },
        
        get voice() { return GM_getValue('GEMINI_VOICE', 'Kore'); },
        set voice(v) { GM_setValue('GEMINI_VOICE', v); },

        get hotkey() { return GM_getValue('GEMINI_HOTKEY', CONFIG.defaultHotkey); },
        set hotkey(v) { GM_setValue('GEMINI_HOTKEY', v.toLowerCase().replace(/\s/g, '')); },

        get systemPrompt() { return GM_getValue('GEMINI_SYSTEM_PROMPT', ''); },
        set systemPrompt(v) { GM_setValue('GEMINI_SYSTEM_PROMPT', v.trim()); }
    };

    // --- Settings Menu ---
    GM_registerMenuCommand("🔑 Set API Key", () => {
        const input = prompt('Enter your Google Gemini API Key:', State.apiKey);
        if (input !== null) { State.apiKey = input; showToast('API Key saved'); }
    });

    GM_registerMenuCommand("🗣️ Set Voice", () => {
        const choice = prompt(`Choose a voice:\n${CONFIG.voices.join(', ')}`, State.voice);
        if (choice && CONFIG.voices.includes(choice)) {
            State.voice = choice;
            showToast(`Voice set to ${choice}`);
        } else if (choice) showToast('Invalid voice name', true);
    });

    GM_registerMenuCommand("⌨️ Set Hotkey", () => {
        const input = prompt('Enter Hotkey (e.g., alt+t, ctrl+shift+s):', State.hotkey);
        if (input) { State.hotkey = input; showToast(`Hotkey set to ${State.hotkey}`); }
    });

    GM_registerMenuCommand("🧠 Set Custom Prompt", () => {
        const input = prompt('Enter instructions for the voice (e.g., "British accent", "Speak excitedly"):', State.systemPrompt);
        if (input !== null) { State.systemPrompt = input; showToast('System prompt saved'); }
    });

    // --- Hotkey Listener ---
    document.addEventListener('keydown', (e) => {
        if (!matchesHotkey(e, State.hotkey)) return;
        
        const text = window.getSelection().toString().trim();
        if (!text) return; // Do nothing if no text selected

        if (!State.apiKey) {
            if (confirm('Gemini TTS: API Key missing. Set it now?')) {
                const key = prompt('Enter API Key:');
                if (key) State.apiKey = key;
            }
            return;
        }

        runTTS(text);
    });

    function matchesHotkey(event, hotkeyString) {
        const parts = hotkeyString.split('+');
        const mainKey = parts.pop();
        const mods = {
            alt: parts.includes('alt') || parts.includes('option'),
            ctrl: parts.includes('ctrl') || parts.includes('control'),
            meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('command'),
            shift: parts.includes('shift')
        };
        
        return (
            event.key.toLowerCase() === mainKey &&
            event.altKey === mods.alt &&
            event.ctrlKey === mods.ctrl &&
            event.metaKey === mods.meta &&
            event.shiftKey === mods.shift
        );
    }

    // --- Main Logic ---
    async function runTTS(text) {
        const toastId = showToast('Generating Audio...', false, 0); // Persistent toast
        
        try {
            await generateAndPlay(text, State.apiKey, State.voice, State.systemPrompt);
            updateToast(toastId, 'Downloading...', 2000);
        } catch (e) {
            console.error(e);
            updateToast(toastId, `Error: ${e.message}`, 4000, true);
        }
    }

    async function generateAndPlay(text, apiKey, voice, systemPrompt) {
        // Fix 500 Error: Prepend the prompt to the text instead of using `systemInstruction`.
        // Example result: "Speak excitedly: Hello world"
        let finalText = text;
        if (systemPrompt) {
            finalText = `${systemPrompt}: ${text}`;
        }

        const payload = {
            contents: [{ parts: [{ text: finalText }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voice }
                    }
                }
            }
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${apiKey}`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(payload),
                onload: function(response) {
                    if (response.status !== 200) {
                        reject(new Error(`API Error ${response.status}: ${response.responseText}`));
                        return;
                    }
                    try {
                        const data = JSON.parse(response.responseText);
                        const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                        
                        if (!base64Audio) throw new Error("No audio data found in response");

                        processAudio(base64Audio);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: function(err) {
                    reject(new Error("Network error"));
                }
            });
        });
    }

    function processAudio(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const wavBlob = createWavBlob(bytes, CONFIG.sampleRate);
        const url = URL.createObjectURL(wavBlob);

        // Play
        const audio = new Audio(url);
        audio.play();

        // Download
        const a = document.createElement('a');
        a.href = url;
        a.download = `gemini-tts-${Date.now()}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function createWavBlob(pcmData, sampleRate = 24000, numChannels = 1) {
        const wavHeader = new ArrayBuffer(44);
        const view = new DataView(wavHeader);
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + pcmData.length, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * 2, true);
        view.setUint16(32, numChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, pcmData.length, true);

        return new Blob([wavHeader, pcmData], { type: 'audio/wav' });
    }

    // --- Toast Notification System ---
    function showToast(text, isError = false, duration = 3000) {
        const div = document.createElement('div');
        const id = Date.now();
        div.id = `toast-${id}`;
        div.textContent = text;
        Object.assign(div.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 24px',
            backgroundColor: isError ? '#ef4444' : '#4f46e5',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: '1000000',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            transition: 'opacity 0.5s',
            opacity: '0'
        });
        document.body.appendChild(div);
        
        // Fade in
        requestAnimationFrame(() => div.style.opacity = '1');

        if (duration > 0) {
            setTimeout(() => removeToast(div), duration);
        }
        return id;
    }

    function updateToast(id, text, duration = 3000, isError = false) {
        const div = document.getElementById(`toast-${id}`);
        if (div) {
            div.textContent = text;
            if (isError) div.style.backgroundColor = '#ef4444';
            if (duration > 0) setTimeout(() => removeToast(div), duration);
        }
    }

    function removeToast(div) {
        div.style.opacity = '0';
        setTimeout(() => { if(div.parentNode) div.parentNode.removeChild(div); }, 500);
    }

})();
