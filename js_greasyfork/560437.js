// ==UserScript==
// @name         Gemini TTS Reader w/Console
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Reads selected text using the Gemini 2.5 TTS model, then automatically downloads the audio file.
// @author       Gemini&Marco
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560437/Gemini%20TTS%20Reader%20wConsole.user.js
// @updateURL https://update.greasyfork.org/scripts/560437/Gemini%20TTS%20Reader%20wConsole.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Styles ---
    GM_addStyle(`
        #gemini-config-modal {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #ffffff; border-radius: 14px; box-shadow: 0 15px 50px rgba(0,0,0,0.3);
            padding: 24px; z-index: 1000001; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            width: 480px; display: none; color: #1f2937; line-height: 1.5;
        }
        #gemini-config-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 1000000; display: none;
        }
        .gemini-title { margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #111827; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .gemini-section { margin-bottom: 16px; }
        .gemini-label { font-size: 13px; font-weight: 600; color: #4b5563; display: block; margin-bottom: 6px; }
        .gemini-input {
            width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px;
            box-sizing: border-box; font-size: 14px; transition: border 0.2s;
        }
        .gemini-input:focus { outline: none; border-color: #4f46e5; }
        .gemini-textarea { height: 100px; font-family: ui-monospace, monospace; resize: vertical; }
        .gemini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .gemini-footer { text-align: right; margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee; }
        .gemini-btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 14px; }
        .gemini-btn-primary { background: #4f46e5; color: white; }
        .gemini-btn-secondary { background: #f3f4f6; color: #4b5563; margin-right: 10px; }
    `);

    // --- Configuration ---
    const CONFIG = {
        model: 'gemini-2.5-flash-preview-tts',
        sampleRate: 24000,
        voices: ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'],
        defaultHotkey: 'alt+t'
    };

    const State = {
        get apiKeys() { return GM_getValue('GEMINI_API_KEYS', []); },
        set apiKeys(v) { GM_setValue('GEMINI_API_KEYS', v); },
        get voice() { return GM_getValue('GEMINI_VOICE', 'Kore'); },
        set voice(v) { GM_setValue('GEMINI_VOICE', v); },
        get hotkey() { return GM_getValue('GEMINI_HOTKEY', CONFIG.defaultHotkey); },
        set hotkey(v) { GM_setValue('GEMINI_HOTKEY', v.toLowerCase().replace(/\s/g, '')); },
        get systemPrompt() { return GM_getValue('GEMINI_SYSTEM_PROMPT', ''); },
        set systemPrompt(v) { GM_setValue('GEMINI_SYSTEM_PROMPT', v.trim()); }
    };

    // --- UI Logic ---
    const overlay = document.createElement('div');
    overlay.id = 'gemini-config-overlay';
    const modal = document.createElement('div');
    modal.id = 'gemini-config-modal';

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const renderModal = () => {
        const voiceOptions = CONFIG.voices.map(v => `<option value="${v}" ${v === State.voice ? 'selected' : ''}>${v}</option>`).join('');
        modal.innerHTML = `
            <div class="gemini-title">Gemini TTS Configuration</div>
            <div class="gemini-section">
                <label class="gemini-label">API Keys (One per line)</label>
                <textarea id="ui-keys" class="gemini-input gemini-textarea" placeholder="Enter API keys...">${State.apiKeys.join('\n')}</textarea>
            </div>
            <div class="gemini-section">
                <label class="gemini-label">System Prompt</label>
                <input id="ui-prompt" type="text" class="gemini-input" value="${State.systemPrompt}" placeholder="e.g. British accent...">
            </div>
            <div class="gemini-grid">
                <div class="gemini-section">
                    <label class="gemini-label">Voice</label>
                    <select id="ui-voice" class="gemini-input">${voiceOptions}</select>
                </div>
                <div class="gemini-section">
                    <label class="gemini-label">Hotkey</label>
                    <input id="ui-hotkey" type="text" class="gemini-input" value="${State.hotkey}">
                </div>
            </div>
            <div class="gemini-footer">
                <button id="ui-cancel" class="gemini-btn gemini-btn-secondary">Cancel</button>
                <button id="ui-save" class="gemini-btn gemini-btn-primary">Save All Settings</button>
            </div>
        `;

        document.getElementById('ui-cancel').onclick = closeModal;
        document.getElementById('ui-save').onclick = () => {
            State.apiKeys = document.getElementById('ui-keys').value.split('\n').map(k => k.trim()).filter(k => k.length > 5);
            State.systemPrompt = document.getElementById('ui-prompt').value;
            State.voice = document.getElementById('ui-voice').value;
            State.hotkey = document.getElementById('ui-hotkey').value;
            showToast("Settings Saved!");
            closeModal();
        };
    };

    const openModal = () => { renderModal(); overlay.style.display = 'block'; modal.style.display = 'block'; };
    const closeModal = () => { overlay.style.display = 'none'; modal.style.display = 'none'; };
    overlay.onclick = closeModal;

    GM_registerMenuCommand("⚙️ Gemini TTS Settings", openModal);

    // --- Main Logic ---
    document.addEventListener('keydown', (e) => {
        if (!matchesHotkey(e, State.hotkey)) return;
        const text = window.getSelection().toString().trim();
        if (!text) return;
        if (State.apiKeys.length === 0) { openModal(); return; }
        runTTS(text);
    });

    function matchesHotkey(event, hotkeyString) {
        const parts = hotkeyString.split('+');
        const mainKey = parts.pop();
        const mods = { alt: parts.includes('alt'), ctrl: parts.includes('ctrl'), meta: parts.includes('meta') || parts.includes('cmd'), shift: parts.includes('shift') };
        return event.key.toLowerCase() === mainKey && event.altKey === mods.alt && event.ctrlKey === mods.ctrl && event.metaKey === mods.meta && event.shiftKey === mods.shift;
    }

    async function runTTS(text) {
        const toastId = showToast('Generating...', false, 0);
        const keys = State.apiKeys;
        for (let i = 0; i < keys.length; i++) {
            updateToast(toastId, `Trying Key ${i + 1}/${keys.length}...`, 0);
            try {
                await generateAndPlay(text, keys[i], State.voice, State.systemPrompt);
                updateToast(toastId, 'Success & Downloading!', 2000);
                return;
            } catch (e) {
                const isRetryable = e.message.includes('403') || e.message.includes('429');
                if (!isRetryable || i === keys.length - 1) {
                    updateToast(toastId, `Error: ${e.message}`, 5000, true);
                    return;
                }
            }
        }
    }

    async function generateAndPlay(text, apiKey, voice, systemPrompt) {
        let finalText = systemPrompt ? `${systemPrompt}: ${text}` : text;
        const payload = {
            contents: [{ parts: [{ text: finalText }] }],
            generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } }
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${apiKey}`,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(payload),
                onload: function(response) {
                    if (response.status !== 200) return reject(new Error(`API ${response.status}`));
                    try {
                        const data = JSON.parse(response.responseText);
                        const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                        if (!base64Audio) throw new Error("No audio data");

                        // --- 下载与播放逻辑回归 ---
                        processAudio(base64Audio);
                        resolve();
                    } catch (err) { reject(err); }
                },
                onerror: () => reject(new Error("Network Error"))
            });
        });
    }

    function processAudio(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

        const wavBlob = createWavBlob(bytes, CONFIG.sampleRate);
        const url = URL.createObjectURL(wavBlob);

        // 1. 播放
        const audio = new Audio(url);
        audio.play();

        // 2. 自动下载 (回归逻辑)
        const a = document.createElement('a');
        a.href = url;
        a.download = `gemini-tts-${Date.now()}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // 延时释放内存
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    function createWavBlob(pcmData, sampleRate) {
        const header = new ArrayBuffer(44);
        const view = new DataView(header);
        const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
        writeStr(0, 'RIFF'); view.setUint32(4, 36 + pcmData.length, true);
        writeStr(8, 'WAVEfmt '); view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true); view.setUint16(34, 16, true);
        writeStr(36, 'data'); view.setUint32(40, pcmData.length, true);
        return new Blob([header, pcmData], { type: 'audio/wav' });
    }

    // --- Toast Notification ---
    function showToast(text, isError = false, duration = 3000) {
        const id = `toast-${Date.now()}`;
        const div = document.createElement('div');
        div.id = id; div.textContent = text;
        Object.assign(div.style, {
            position: 'fixed', bottom: '20px', right: '20px', padding: '12px 24px',
            backgroundColor: isError ? '#ef4444' : '#111827', color: 'white',
            borderRadius: '10px', zIndex: '1000002', transition: 'all 0.4s ease',
            opacity: '0', transform: 'translateY(20px)', fontFamily: 'sans-serif'
        });
        document.body.appendChild(div);
        requestAnimationFrame(() => { div.style.opacity = '1'; div.style.transform = 'translateY(0)'; });
        if (duration > 0) setTimeout(() => removeToast(div), duration);
        return id;
    }

    function updateToast(id, text, duration = 3000, isError = false) {
        const div = document.getElementById(id.startsWith('toast-') ? id : `toast-${id}`);
        if (div) {
            div.textContent = text;
            if (isError) div.style.backgroundColor = '#ef4444';
            if (duration > 0) setTimeout(() => removeToast(div), duration);
        }
    }

    function removeToast(div) {
        if (!div) return;
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 500);
    }
})();