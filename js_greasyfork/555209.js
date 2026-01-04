// ==UserScript==
// @name         AI Studio to VOICEVOX (v5.3.1 安定版)
// @namespace    https://rentry.co/x9fw82o3
// @version      5.3.1
// @description  AI Studioの回答をVOICEVOXで自動読み上げ (画像URLの読み上げバグを完全修正)
// @author       FoeverPWA
// @match        https://aistudio.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555209/AI%20Studio%20to%20VOICEVOX%20%28v531%20%E5%AE%89%E5%AE%9A%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555209/AI%20Studio%20to%20VOICEVOX%20%28v531%20%E5%AE%89%E5%AE%9A%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 設定 =====
    const CONFIG_KEY = 'aistudio_voicevox_config';
    const defaultConfig = {
        apiUrl: 'http://localhost:50021',
        speakerId: 20,
        autoPlay: true,
        speedScale: 1.0,
        volumeScale: 1.0
    };

    let savedConfig = GM_getValue(CONFIG_KEY, {});
    let config = Object.assign({}, defaultConfig, savedConfig);

    // ===== 状態管理 =====
    let state = {
        isPlaying: false,
        isSynthesizing: false,
        currentAudio: null,
        audioQueue: [],
        textQueue: [],
        lastProcessedText: '',
        lastProcessedCleanText: '',
        textBuffer: '', // 【重要】読み上げ前のテキストバッファ
        wasGenerating: false, // 前回の生成状態を保持
        playButton: null,
        shouldStop: false
    };

    // ===== ユーティリティ関数 =====
    function getModelResponseText() {
        const turns = document.querySelectorAll('ms-chat-turn');
        const lastTurn = turns[turns.length - 1];
        if (!lastTurn) return '';
        const container = lastTurn.querySelector('[data-turn-role="Model"]');
        if (!container) return '';
        const textChunks = Array.from(container.querySelectorAll('ms-text-chunk'));
        let text = '';
        textChunks.forEach(chunk => {
            if (chunk.closest('ms-code-chunk, ms-thought-chunk')) return;
            text += chunk.textContent;
        });
        return text;
    }

    function isGenerating() {
        const turns = document.querySelectorAll('ms-chat-turn');
        const lastTurn = turns[turns.length - 1];
        if (!lastTurn) return false;
        return !lastTurn.querySelector('button[iconname="thumb_up"]');
    }

    function cleanMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/!\[.*?\]\(.*?\)/g, '') // 完成した画像マークダウンを除去
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`[^`]+`/g, '')
            .replace(/(\*\*|__)(.*?)\1/g, '$2')
            .replace(/(\*|_)(.*?)\1/g, '$2')
            .replace(/^#+\s+/gm, '')
            .replace(/^[\-\*]{3,}$/gm, '')
            .replace(/^\s*[\-\*\+]\s+/gm, '')
            .replace(/^\s*\d+\.\s+/gm, '')
            .replace(/^>\s+/gm, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    function splitIntoSentences(text) {
        return text.split(/(?<=[。！?\n])|(?<=\.\s)/g)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    // ===== VOICEVOX API (タイムアウト付き) =====
    function synthesizeSpeech(text, callback, customApiUrl = null, customSpeakerId = null, customSpeedScale = null, customVolumeScale = null) {
        const apiUrl = customApiUrl || config.apiUrl;
        const speakerId = customSpeakerId !== null ? customSpeakerId : config.speakerId;
        const speedScale = customSpeedScale !== null ? customSpeedScale : config.speedScale;
        const volumeScale = customVolumeScale !== null ? customVolumeScale : config.volumeScale;
        const queryUrl = `${apiUrl}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`;

        GM_xmlhttpRequest({
            method: 'POST', url: queryUrl, timeout: 5000,
            onload: (response) => {
                if (response.status !== 200) return callback(null);
                try {
                    const audioQuery = JSON.parse(response.responseText);
                    audioQuery.speedScale = speedScale; audioQuery.volumeScale = volumeScale;
                    GM_xmlhttpRequest({
                        method: 'POST', url: `${apiUrl}/synthesis?speaker=${speakerId}`,
                        headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(audioQuery),
                        responseType: 'blob', timeout: 10000,
                        onload: (synthResponse) => callback(synthResponse.status === 200 ? URL.createObjectURL(synthResponse.response) : null),
                        onerror: () => callback(null), ontimeout: () => callback(null)
                    });
                } catch (e) { callback(null); }
            },
            onerror: () => callback(null), ontimeout: () => callback(null)
        });
    }

    // ===== 再生制御 =====
    function playNext() {
        if (state.shouldStop || state.isPlaying || state.audioQueue.length === 0) {
            if (!state.isSynthesizing && state.audioQueue.length === 0 && state.textQueue.length === 0) {
                state.isPlaying = false;
                updatePlayButton(false);
            }
            return;
        }
        state.isPlaying = true; updatePlayButton(true);
        const audioUrl = state.audioQueue.shift();
        const audio = new Audio(audioUrl);
        state.currentAudio = audio;
        audio.onended = audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            state.isPlaying = false; state.currentAudio = null;
            if (!state.shouldStop) playNext();
        };
        audio.play().catch(() => { state.isPlaying = false; state.currentAudio = null; });
    }

    function processTextQueue() {
        if (state.shouldStop || state.isSynthesizing || state.textQueue.length === 0) return;
        state.isSynthesizing = true;
        const text = state.textQueue.shift();
        synthesizeSpeech(text, (audioUrl) => {
            state.isSynthesizing = false;
            if (state.shouldStop) { if (audioUrl) URL.revokeObjectURL(audioUrl); return; }
            if (audioUrl) { state.audioQueue.push(audioUrl); playNext(); }
            if (state.textQueue.length > 0) setTimeout(() => processTextQueue(), 100);
        });
    }

    function startPlayback(text) {
        stopPlayback();
        state.shouldStop = false;
        const cleanedText = cleanMarkdown(text);
        const sentences = splitIntoSentences(cleanedText);
        if (sentences.length === 0) return;
        state.textQueue = sentences;
        state.lastProcessedText = text;
        state.lastProcessedCleanText = cleanedText;
        updatePlayButton(true);
        processTextQueue();
    }

    function addToPlaybackQueue(newCleanText) {
        if (state.shouldStop || !newCleanText) return;
        const sentences = splitIntoSentences(newCleanText);
        if (sentences.length === 0) return;
        const wasIdle = !state.isPlaying && !state.isSynthesizing && state.textQueue.length === 0;
        state.textQueue.push(...sentences);
        if (wasIdle) { updatePlayButton(true); processTextQueue(); }
        else if (!state.isSynthesizing) { processTextQueue(); }
    }

    function stopPlayback() {
        state.shouldStop = true;
        if (state.currentAudio) {
            state.currentAudio.pause(); state.currentAudio.src = ''; state.currentAudio = null;
        }
        state.audioQueue.forEach(url => URL.revokeObjectURL(url));
        state.audioQueue = [];
        state.textQueue = [];
        state.textBuffer = '';
        state.isPlaying = false;
        state.isSynthesizing = false;
        updatePlayButton(false);
    }

    // ===== UI制御とメインロジック =====
    function updatePlayButton(isActive) {
        if (state.playButton) {
            state.playButton.textContent = isActive ? '■ 停止' : '🔊 再生';
        }
    }

    let debounceTimer = null;
    function handleUpdate() {
        if (debounceTimer) return;
        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            try {
                const isCurrentlyGenerating = isGenerating();

                // 新しい回答の開始を検知（false -> true）
                if (isCurrentlyGenerating && !state.wasGenerating) {
                    stopPlayback();
                    state.lastProcessedText = '';
                    state.lastProcessedCleanText = '';
                    state.shouldStop = false;
                }

                const currentText = getModelResponseText();
                if (config.autoPlay && !state.shouldStop && currentText) {
                    const cleanedFullText = cleanMarkdown(currentText);
                    // 差分があればバッファに追加
                    if (cleanedFullText.length > state.lastProcessedCleanText.length) {
                        const newCleanTextPart = cleanedFullText.substring(state.lastProcessedCleanText.length);
                        state.lastProcessedText = currentText;
                        state.lastProcessedCleanText = cleanedFullText;
                        state.textBuffer += newCleanTextPart;
                    }
                }

                // バッファから完成した文を切り出してキューに追加
                const sentenceRegex = /(?<=[。！?\n])/;
                if (sentenceRegex.test(state.textBuffer)) {
                    let parts = state.textBuffer.split(sentenceRegex);
                    const lastPart = parts[parts.length - 1] === '' ? '' : parts.pop();
                    const sentencesToQueue = parts.join('');

                    if (sentencesToQueue) {
                        addToPlaybackQueue(sentencesToQueue);
                    }
                    state.textBuffer = lastPart || '';
                }

                // 生成が完了した瞬間（true -> false）にバッファの残りを処理
                if (state.wasGenerating && !isCurrentlyGenerating) {
                    if (state.textBuffer.trim().length > 0) {
                        addToPlaybackQueue(state.textBuffer);
                        state.textBuffer = '';
                    }
                }
                state.wasGenerating = isCurrentlyGenerating;

                // 再生ボタンの追加/更新
                const lastTurn = document.querySelector('ms-chat-turn:last-of-type');
                if (lastTurn && !lastTurn.querySelector('#voicevox_play_button')) {
                    const footer = lastTurn.querySelector('.turn-footer');
                    if (footer) {
                        const button = document.createElement('button');
                        button.id = 'voicevox_play_button';
                        button.textContent = '🔊 再生';
                        button.style.cssText = `padding: 5px 12px; background: rgb(138, 180, 248); color: rgb(32, 33, 36); border: none; border-radius: 20px; cursor: pointer; margin-left: 8px; font-weight: 500;`;
                        button.onclick = () => {
                            const isActive = state.isPlaying || state.isSynthesizing || state.textQueue.length > 0;
                            if (isActive) { stopPlayback(); }
                            else { startPlayback(getModelResponseText()); }
                        };
                        footer.insertBefore(button, footer.firstChild);
                        state.playButton = button;
                    }
                }
                if (state.playButton) {
                    updatePlayButton(state.isPlaying || state.isSynthesizing || state.textQueue.length > 0);
                }

            } catch (e) {
                console.warn("AI Studio to VOICEVOX: handleUpdate error:", e);
            }
        }, 300);
    }

    // ===== DOM監視 =====
    const observer = new MutationObserver(handleUpdate);
    observer.observe(document.body, { childList: true, subtree: true });

    // ===== 設定画面（変更なし） =====
    let speakerList = [];

    function fetchSpeakers(callback) {
        GM_xmlhttpRequest({
            method: 'GET', url: `${config.apiUrl}/speakers`, timeout: 3000,
            onload: (response) => {
                if (response.status === 200) {
                    try { speakerList = JSON.parse(response.responseText); callback(true); }
                    catch (e) { callback(false); }
                } else { callback(false); }
            },
            onerror: () => callback(false), ontimeout: () => callback(false)
        });
    }

    function getSpeakerName(speakerId) {
        for (const speaker of speakerList) {
            for (const style of speaker.styles) {
                if (style.id === speakerId) return `${speaker.name} (${style.name})`;
            }
        }
        return `ID: ${speakerId} (不明)`;
    }

    function openSettings() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;`;
        const panel = document.createElement('div');
        panel.style.cssText = `background:#202124;color:#e8eaed;padding:24px;border-radius:8px;width:500px;max-height:90vh;overflow-y:auto;`;

        function createStyledElement(tag, style, textContent = '') {
            const el = document.createElement(tag);
            el.style.cssText = style;
            if (textContent) el.textContent = textContent;
            return el;
        }

        panel.appendChild(createStyledElement('h2', 'margin:0 0 20px;font-size:1.5em;', '🔊 VOICEVOX連携設定'));

        const apiUrlSection = createStyledElement('div', 'margin-bottom:16px;');
        apiUrlSection.appendChild(createStyledElement('label', 'display:block;margin-bottom:8px;color:#9aa0a6;', 'API URL:'));
        const apiUrlInput = createStyledElement('input', 'width:100%;padding:10px;background:#3c4043;color:#e8eaed;border:1px solid #5f6368;border-radius:4px;box-sizing:border-box;font-size:14px;');
        apiUrlInput.type = 'text'; apiUrlInput.value = config.apiUrl;
        apiUrlSection.appendChild(apiUrlInput); panel.appendChild(apiUrlSection);

        const speakerSection = createStyledElement('div', 'margin-bottom:16px;position:relative;');
        speakerSection.appendChild(createStyledElement('label', 'display:block;margin-bottom:8px;color:#9aa0a6;', 'スピーカー:'));
        const speakerInputContainer = createStyledElement('div', 'display:flex;gap:10px;align-items:center;');
        const speakerIdInput = createStyledElement('input', 'width:100px;padding:10px;background:#3c4043;color:#e8eaed;border:1px solid #5f6368;border-radius:4px;box-sizing:border-box;font-size:14px;');
        speakerIdInput.type = 'number'; speakerIdInput.value = config.speakerId;
        const speakerNameDisplay = createStyledElement('span', 'color:#81c995;font-weight:500;');
        const speakerListContainer = createStyledElement('div', 'position:absolute;top:100%;left:0;width:100%;z-index:10001;max-height:200px;overflow-y:auto;background:#3c4043;border:1px solid #5f6368;border-radius:4px;display:none;');
        speakerInputContainer.appendChild(speakerIdInput); speakerInputContainer.appendChild(speakerNameDisplay);
        speakerSection.appendChild(speakerInputContainer); speakerSection.appendChild(speakerListContainer);
        panel.appendChild(speakerSection);

        const speedSection = createStyledElement('div', 'margin-bottom:16px;');
        speedSection.appendChild(createStyledElement('label', 'display:block;margin-bottom:8px;color:#9aa0a6;', '読み上げ速度:'));
        const speedContainer = createStyledElement('div', 'display:flex;gap:12px;align-items:center;');
        const speedSlider = createStyledElement('input', 'flex:1;');
        speedSlider.type = 'range'; speedSlider.min = 0.5; speedSlider.max = 2.0; speedSlider.step = 0.1; speedSlider.value = config.speedScale;
        const speedValue = createStyledElement('span', 'min-width:50px;color:#8ab4f8;font-weight:500;text-align:right;', `${config.speedScale.toFixed(1)}x`);
        speedContainer.appendChild(speedSlider); speedContainer.appendChild(speedValue);
        speedSection.appendChild(speedContainer); panel.appendChild(speedSection);

        const volumeSection = createStyledElement('div', 'margin-bottom:16px;');
        volumeSection.appendChild(createStyledElement('label', 'display:block;margin-bottom:8px;color:#9aa0a6;', '音量:'));
        const volumeContainer = createStyledElement('div', 'display:flex;gap:12px;align-items:center;');
        const volumeSlider = createStyledElement('input', 'flex:1;');
        volumeSlider.type = 'range'; volumeSlider.min = 0.0; volumeSlider.max = 2.0; volumeSlider.step = 0.1; volumeSlider.value = config.volumeScale;
        const volumeValue = createStyledElement('span', 'min-width:50px;color:#8ab4f8;font-weight:500;text-align:right;', `${Math.round(config.volumeScale * 100)}%`);
        volumeContainer.appendChild(volumeSlider); volumeContainer.appendChild(volumeValue);
        volumeSection.appendChild(volumeContainer); panel.appendChild(volumeSection);

        const testSection = createStyledElement('div', 'margin:16px 0;padding-top:16px;border-top:1px solid #3c4043;');
        const testButton = createStyledElement('button', 'width:100%;padding:10px;background:#81c995;color:#202124;border:none;border-radius:4px;cursor:pointer;font-weight:500;', '🎵 サンプル音声を再生');
        testSection.appendChild(testButton); panel.appendChild(testSection);

        const autoplaySection = createStyledElement('div', 'margin-bottom:20px;padding-top:16px;border-top:1px solid #3c4043;');
        const autoplayLabel = createStyledElement('label', 'display:flex;align-items:center;cursor:pointer;');
        const autoplayCheckbox = createStyledElement('input', 'margin-right:12px;width:20px;height:20px;');
        autoplayCheckbox.type = 'checkbox'; autoplayCheckbox.checked = config.autoPlay;
        autoplayLabel.appendChild(autoplayCheckbox);
        autoplayLabel.appendChild(createStyledElement('span', '', '自動再生を有効にする'));
        autoplaySection.appendChild(autoplayLabel); panel.appendChild(autoplaySection);

        const actionsSection = createStyledElement('div', 'display:flex;justify-content:flex-end;gap:10px;padding-top:16px;border-top:1px solid #3c4043;');
        const cancelButton = createStyledElement('button', 'padding:10px 20px;background:transparent;color:#8ab4f8;border:1px solid #5f6368;border-radius:4px;cursor:pointer;', 'キャンセル');
        const saveButton = createStyledElement('button', 'padding:10px 20px;background:#8ab4f8;color:#202124;border:none;border-radius:4px;cursor:pointer;', '保存');
        actionsSection.appendChild(cancelButton); actionsSection.appendChild(saveButton);
        panel.appendChild(actionsSection);

        document.body.appendChild(overlay); overlay.appendChild(panel);

        let testAudio = null;
        const closePanel = () => { if (testAudio) { testAudio.pause(); } overlay.remove(); };
        speedSlider.oninput = () => speedValue.textContent = `${parseFloat(speedSlider.value).toFixed(1)}x`;
        volumeSlider.oninput = () => volumeValue.textContent = `${Math.round(parseFloat(volumeSlider.value) * 100)}%`;
        cancelButton.onclick = closePanel;
        overlay.onclick = (e) => { if (e.target === overlay) closePanel(); };
        document.addEventListener('click', (e) => { if (!speakerSection.contains(e.target)) speakerListContainer.style.display = 'none'; }, true);

        const updateSpeakerDisplay = () => {
            const id = parseInt(speakerIdInput.value);
            speakerNameDisplay.textContent = speakerList.length === 0 ? '取得中...' : getSpeakerName(id);
            speakerNameDisplay.style.color = speakerNameDisplay.textContent.includes('不明') ? '#f28b82' : '#81c995';
        };

        const populateSpeakerList = () => {
            if (speakerList.length === 0) { speakerListContainer.innerHTML = `<div style="padding:10px;color:#9aa0a6;">スピーカー情報なし</div>`; return; }
            speakerListContainer.innerHTML = speakerList.map(sp => sp.styles.map(st =>
                `<div data-id="${st.id}" style="padding:10px;cursor:pointer;border-bottom:1px solid #5f6368;"><div>${sp.name} (${st.name})</div></div>`
            ).join('')).join('');
            speakerListContainer.querySelectorAll('[data-id]').forEach(item => {
                item.onclick = () => { speakerIdInput.value = item.dataset.id; updateSpeakerDisplay(); speakerListContainer.style.display = 'none'; };
                item.onmouseenter = () => item.style.backgroundColor = '#5f6368';
                item.onmouseleave = () => item.style.backgroundColor = '';
            });
        };

        const refreshSpeakers = () => {
            speakerList = []; updateSpeakerDisplay();
            fetchSpeakers(success => {
                if (success) { populateSpeakerList(); }
                else { speakerNameDisplay.textContent = 'API接続エラー'; speakerNameDisplay.style.color = '#f28b82'; }
                updateSpeakerDisplay();
            });
        };

        speakerIdInput.onfocus = () => speakerListContainer.style.display = 'block';
        speakerIdInput.oninput = updateSpeakerDisplay;
        apiUrlInput.onchange = refreshSpeakers;
        testButton.onclick = () => {
            if (testAudio && !testAudio.paused) { testAudio.pause(); testButton.textContent = '🎵 サンプル音声を再生'; return; }
            testButton.textContent = '合成中...'; testButton.disabled = true;
            synthesizeSpeech('こんにちは。これはサンプル音声です。', url => {
                testButton.disabled = false;
                if (url) {
                    testAudio = new Audio(url); testAudio.play(); testButton.textContent = '再生中... ■停止';
                    testAudio.onended = () => { URL.revokeObjectURL(url); testButton.textContent = '🎵 サンプル音声を再生'; };
                } else { testButton.textContent = '再生失敗'; }
            }, apiUrlInput.value, parseInt(speakerIdInput.value), parseFloat(speedSlider.value), parseFloat(volumeSlider.value));
        };
        saveButton.onclick = () => {
            config.apiUrl = apiUrlInput.value.trim();
            config.speakerId = parseInt(speakerIdInput.value);
            config.autoPlay = autoplayCheckbox.checked;
            config.speedScale = parseFloat(speedSlider.value);
            config.volumeScale = parseFloat(volumeSlider.value);
            GM_setValue(CONFIG_KEY, config);
            closePanel();
        };
        refreshSpeakers();
    }

    // ===== 初期化 =====
    GM_registerMenuCommand('VOICEVOX設定', openSettings);
    setTimeout(handleUpdate, 2000);

})();