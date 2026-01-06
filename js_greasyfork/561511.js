// ==UserScript==
// @name         Claude TTS Reader + Voice Dialog
// @namespace    https://claude.ai/
// @version      2.6
// @description  Sintesi vocale Edge TTS + Dialogo vocale + Streaming TTS per Claude.ai
// @author       Flejta & Claude
// @match        https://claude.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561511/Claude%20TTS%20Reader%20%2B%20Voice%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/561511/Claude%20TTS%20Reader%20%2B%20Voice%20Dialog.meta.js
// ==/UserScript==

/*
 * Changelog v2.6:
 * - Fix e miglioramenti overlay riconoscimento vocale
 * - Posizionamento overlay sopra textarea (non blocca input)
 *
 * Changelog v2.5:
 * - Overlay riconoscimento vocale: mostra il testo in tempo reale sopra la textarea
 * - Testo interim visibile mentre parli (feedback immediato)
 * - L'overlay non blocca la textarea
 *
 * Changelog v2.4:
 * - Pulizia punteggiatura ripetuta (---, ***, ___, ecc.) per TTS più naturale
 * - Stato locale per tab: dialogMode e autoRead non conflittano tra istanze
 * - Invio messaggio via React onClick: funziona anche senza focus sulla tab
 *
 * Changelog v2.3:
 * - Pipeline TTS: pre-genera il chunk successivo mentre legge il corrente
 * - Suono click2.mp3 per "invia messaggio" e fine lettura
 * - Eliminati stacchi tra chunk
 *
 * Changelog v2.2:
 * - Streaming TTS: inizia a leggere mentre Claude sta ancora scrivendo
 * - Taglio intelligente per frasi complete (. ! ? \n)
 * - Chunk progressivi: 300 char iniziali, poi aumenta per fluidità
 * - Coda TTS per gestire chunk multipli senza sovrapposizioni
 *
 * Changelog v2.1:
 * - Fix selettore textarea (contenteditable)
 * - Fix selettore bottone invio (aria-label italiano)
 * - Migliorato restart riconoscimento vocale
 *
 * Changelog v2.0:
 * - Aggiunta modalità "Dialogo vocale" nel menu
 * - Aggiunto bottone microfono nella barra in basso per dettatura manuale
 * - Riconoscimento vocale con webkit auto-restart
 * - Comando "invia messaggio" + 2s silenzio = invio
 * - Timeout 20s silenzio = beep + conferma "sì"/"no"
 * - Pause durante lettura = salta TTS, passa all'ascolto
 * - Comandi: "stop"/"basta" = esci dialogo, "cancella tutto" = svuota textarea
 */

(function() {
    'use strict';

    //#region Stili CSS
    function addStyles() {
        const style = document.createElement('style');
        style.id = 'tts-styles';
        style.textContent = `
            /* Bottone play - stile che si integra con quelli esistenti */
            .tts-play-btn.playing {
                color: #ef4444 !important;
            }
            .tts-play-btn.playing .text-text-500 {
                color: #ef4444 !important;
            }
            .tts-play-btn.playing svg {
                animation: tts-pulse 1s ease-in-out infinite;
            }
            @keyframes tts-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            /* Bottone controllo TTS nel campo input */
            .tts-control-wrapper {
                position: relative;
                display: inline-flex;
            }
            .tts-control-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 32px;
                width: 32px;
                border-radius: 8px;
                border: none;
                background: transparent;
                color: #9ca3af;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            .tts-control-btn:hover {
                background: rgba(0,0,0,0.05);
                color: #6b7280;
            }
            .tts-control-btn.active {
                color: #2563eb;
                background: rgba(37, 99, 235, 0.1);
            }

            /* Bottone microfono */
            .tts-mic-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 32px;
                width: 32px;
                border-radius: 8px;
                border: none;
                background: transparent;
                color: #9ca3af;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            .tts-mic-btn:hover {
                background: rgba(0,0,0,0.05);
                color: #6b7280;
            }
            .tts-mic-btn.listening {
                color: #ef4444 !important;
                background: rgba(239, 68, 68, 0.1);
            }
            .tts-mic-btn.listening svg {
                animation: tts-pulse 1s ease-in-out infinite;
            }

            /* Menu impostazioni */
            .tts-menu {
                position: absolute;
                bottom: calc(100% + 8px);
                left: 0;
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 8px 0;
                min-width: 220px;
                z-index: 99999;
                display: none;
            }
            .tts-menu.open {
                display: block;
            }
            .tts-menu-section {
                padding: 4px 12px;
                font-size: 10px;
                font-weight: 600;
                color: #9ca3af;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .tts-menu-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                cursor: pointer;
                font-size: 13px;
                color: #374151;
                transition: background 0.1s;
            }
            .tts-menu-item:hover {
                background: #f3f4f6;
            }
            .tts-menu-item.selected {
                background: #eff6ff;
                color: #2563eb;
            }
            .tts-menu-item .check {
                width: 16px;
                color: #2563eb;
                opacity: 0;
            }
            .tts-menu-item.selected .check {
                opacity: 1;
            }
            .tts-menu-divider {
                height: 1px;
                background: #e5e7eb;
                margin: 4px 0;
            }
            .tts-menu-speed {
                padding: 8px 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .tts-menu-speed label {
                font-size: 12px;
                color: #6b7280;
            }
            .tts-menu-speed input {
                flex: 1;
                accent-color: #2563eb;
            }
            .tts-menu-speed .value {
                font-size: 11px;
                color: #9ca3af;
                min-width: 30px;
                text-align: right;
            }

            /* Dark mode */
            @media (prefers-color-scheme: dark) {
                .tts-menu {
                    background: #1f2937;
                    border-color: #374151;
                }
                .tts-menu-item {
                    color: #e5e7eb;
                }
                .tts-menu-item:hover {
                    background: #374151;
                }
                .tts-menu-item.selected {
                    background: #1e3a5f;
                }
                .tts-menu-section {
                    color: #6b7280;
                }
                .tts-menu-divider {
                    background: #374151;
                }
                .tts-play-btn:hover,
                .tts-control-btn:hover,
                .tts-mic-btn:hover {
                    background: rgba(255,255,255,0.1);
                }
            }

            /* Toast notifiche */
            .tts-toast {
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: #1f2937;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 13px;
                z-index: 999999;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }
            .tts-toast.show {
                opacity: 1;
            }

            /* Indicatore stato dialogo */
            .tts-dialog-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(37, 99, 235, 0.9);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                z-index: 999999;
                display: none;
                align-items: center;
                gap: 8px;
            }
            .tts-dialog-indicator.active {
                display: flex;
            }
            .tts-dialog-indicator.listening {
                background: rgba(239, 68, 68, 0.9);
            }
            .tts-dialog-indicator .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: white;
                animation: tts-pulse 1s ease-in-out infinite;
            }

            /* Overlay riconoscimento vocale */
            .tts-speech-overlay {
                position: fixed;
                bottom: 140px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(31, 41, 55, 0.95);
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                font-size: 14px;
                max-width: 80%;
                min-width: 200px;
                z-index: 999998;
                display: none;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
            }
            .tts-speech-overlay.active {
                display: flex;
            }
            .tts-speech-overlay .mic-icon {
                color: #ef4444;
                animation: tts-pulse 1s ease-in-out infinite;
                flex-shrink: 0;
            }
            .tts-speech-overlay .speech-text {
                flex: 1;
                word-break: break-word;
            }
            .tts-speech-overlay .speech-text.interim {
                color: rgba(255,255,255,0.6);
                font-style: italic;
            }
            .tts-speech-overlay .speech-text.final {
                color: white;
            }
        `;
        document.head.appendChild(style);
    }
    //#endregion

    //#region Icone SVG
    const ICONS = {
        play: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
        pause: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
        speaker: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
        check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
        mic: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
        micOff: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>'
    };
    //#endregion

    //#region Stato Globale
    // Preferenze persistenti (condivise tra tab - solo voce e velocità)
    // dialogMode e autoRead sono locali per evitare conflitti tra istanze
    const State = {
        autoRead: false,  // Locale per tab
        dialogMode: false, // Locale per tab
        currentVoice: GM_getValue('tts_voice', 'it-IT-IsabellaNeural'),
        rate: GM_getValue('tts_rate', 0),
        isPlaying: false,
        isListening: false,
        isManualDictation: false, // true quando usa bottone mic manuale
        isStreaming: false // true durante lo streaming della risposta
    };

    let currentAudio = null;
    let currentPlayingBtn = null;
    let recognition = null;
    let silenceTimer = null;
    let longSilenceTimer = null;
    let pendingText = '';
    let waitingForSendConfirm = false;
    let lastMessageCount = -1;
    let isFirstLoad = true;

    // Streaming TTS
    let streamBuffer = '';           // Buffer del testo in arrivo
    let ttsQueue = [];               // Coda dei chunk da leggere
    let audioQueue = [];             // Coda degli audio pre-generati
    let isProcessingQueue = false;   // true se sta elaborando la coda
    let isPreGenerating = false;     // true se sta pre-generando
    let currentChunkSize = 300;      // Dimensione chunk iniziale (aumenta progressivamente)
    let streamingAborted = false;    // true se l'utente ha interrotto

    // URL suoni
    const SOUNDS = {
        click: 'https://certificationsystem.netlify.app/application/sounds/click2.mp3'
    };
    //#endregion

    //#region Sound Effects
    function playSound(soundName) {
        const url = SOUNDS[soundName];
        if (!url) return;

        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(e => console.log('[TTS] Errore riproduzione suono:', e));
    }
    //#endregion

    //#region Speech Overlay
    let speechOverlay = null;
    let currentTranscript = ''; // Testo finale accumulato

    function createSpeechOverlay() {
        if (speechOverlay) return speechOverlay;

        speechOverlay = document.createElement('div');
        speechOverlay.className = 'tts-speech-overlay';
        speechOverlay.innerHTML = `
            <span class="mic-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
            </span>
            <span class="speech-text"></span>
        `;
        document.body.appendChild(speechOverlay);
        return speechOverlay;
    }

    function showSpeechOverlay(text, isInterim = false) {
        const overlay = createSpeechOverlay();
        const textSpan = overlay.querySelector('.speech-text');

        // Mostra testo accumulato + interim corrente
        const displayText = isInterim ?
            (currentTranscript + ' ' + text).trim() :
            text;

        textSpan.textContent = displayText || '...';
        textSpan.className = 'speech-text ' + (isInterim ? 'interim' : 'final');
        overlay.classList.add('active');
    }

    function hideSpeechOverlay() {
        if (speechOverlay) {
            speechOverlay.classList.remove('active');
        }
        currentTranscript = '';
    }

    function updateTranscript(finalText) {
        // Aggiungi al testo accumulato
        currentTranscript = (currentTranscript + ' ' + finalText).trim();
        showSpeechOverlay(currentTranscript, false);
    }

    function clearTranscript() {
        currentTranscript = '';
        if (speechOverlay) {
            const textSpan = speechOverlay.querySelector('.speech-text');
            textSpan.textContent = '...';
        }
    }
    //#endregion

    //#region Beep Sound
    function playBeep() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;

        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            audioContext.close();
        }, 200);
    }
    //#endregion

    //#region Speech Recognition
    function initSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('[TTS] Speech Recognition non supportato');
            return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'it-IT';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            State.isListening = true;
            updateDialogIndicator();
            updateMicButtonState();
            console.log('[TTS] Riconoscimento avviato');
        };

        recognition.onend = () => {
            console.log('[TTS] Riconoscimento terminato, State:', {
                dialogMode: State.dialogMode,
                isManualDictation: State.isManualDictation,
                isListening: State.isListening
            });

            // Auto-restart se in modalità dialogo o dettatura manuale
            if ((State.dialogMode || State.isManualDictation) && State.isListening) {
                console.log('[TTS] Tento riavvio tra 300ms...');
                setTimeout(() => {
                    if ((State.dialogMode || State.isManualDictation) && State.isListening) {
                        try {
                            recognition.start();
                            console.log('[TTS] Riavvio richiesto');
                        } catch (e) {
                            console.log('[TTS] Riavvio recognition fallito:', e.message);
                            // Riprova dopo un po'
                            setTimeout(() => {
                                if ((State.dialogMode || State.isManualDictation) && State.isListening) {
                                    try { recognition.start(); } catch(e2) {}
                                }
                            }, 1000);
                        }
                    }
                }, 300);
            } else {
                State.isListening = false;
                updateDialogIndicator();
                updateMicButtonState();
            }
        };

        recognition.onerror = (event) => {
            console.error('[TTS] Errore recognition:', event.error);
            if (event.error === 'no-speech' || event.error === 'aborted') {
                // Ignora, il restart automatico gestirà
                return;
            }
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Mostra interim nell'overlay (feedback in tempo reale)
            if (interimTranscript) {
                showSpeechOverlay(interimTranscript, true);
            }

            // Quando è finale, aggiorna overlay e processa
            if (finalTranscript) {
                updateTranscript(finalTranscript.trim());
                handleRecognizedText(finalTranscript.trim().toLowerCase(), finalTranscript.trim());
            }

            // Reset timer silenzio lungo quando c'è attività
            resetLongSilenceTimer();
        };

        return true;
    }

    function handleRecognizedText(textLower, textOriginal) {
        console.log('[TTS] Riconosciuto:', textOriginal);
        console.log('[TTS] Lowercase:', textLower);

        // Comandi speciali
        if (textLower.includes('stop') || textLower.includes('basta')) {
            console.log('[TTS] Comando STOP rilevato');
            stopDialogMode();
            showToast('🛑 Dialogo terminato');
            return;
        }

        if (textLower.includes('cancella tutto')) {
            console.log('[TTS] Comando CANCELLA rilevato');
            clearTextarea();
            clearTranscript(); // Pulisci anche l'overlay
            showToast('🗑️ Testo cancellato');
            return;
        }

        // Se aspettiamo conferma invio
        if (waitingForSendConfirm) {
            console.log('[TTS] In attesa conferma, ricevuto:', textLower);
            if (textLower.includes('sì') || textLower === 'si' || textLower.includes('okay') || textLower.includes('ok')) {
                waitingForSendConfirm = false;
                clearTranscript(); // Pulisci overlay
                sendMessage();
                return;
            } else if (textLower.includes('no') || textLower.includes('aspetta')) {
                waitingForSendConfirm = false;
                showToast('⏳ Continuo ad ascoltare...');
                resetLongSilenceTimer();
                return;
            }
            // Se dice altro, tratta come nuovo testo
            waitingForSendConfirm = false;
        }

        // Gestione "invia messaggio"
        if (textLower.includes('invia messaggio')) {
            console.log('[TTS] Comando INVIA MESSAGGIO rilevato');
            playSound('click'); // Feedback sonoro
            // Rimuovi "invia messaggio" dal testo
            const cleanText = textOriginal.replace(/invia messaggio/gi, '').trim();
            if (cleanText) {
                appendToTextarea(cleanText);
            }
            // Pulisci overlay e avvia timer 2 secondi
            clearTranscript();
            startSendTimer();
            return;
        }

        // Testo normale - aggiungilo alla textarea
        console.log('[TTS] Aggiungo testo alla textarea:', textOriginal);
        appendToTextarea(textOriginal);

        // Reset del timer di invio se c'era
        clearTimeout(silenceTimer);
    }

    function startSendTimer() {
        clearTimeout(silenceTimer);
        showToast('📤 Invio tra 2 secondi...');
        silenceTimer = setTimeout(() => {
            sendMessage();
        }, 2000);
    }

    function resetLongSilenceTimer() {
        clearTimeout(longSilenceTimer);
        if (State.dialogMode && State.isListening && !State.isManualDictation) {
            longSilenceTimer = setTimeout(() => {
                // 20 secondi di silenzio - chiedi conferma
                const textarea = getTextarea();
                if (textarea && textarea.value.trim()) {
                    playBeep();
                    showToast('🔔 Invio messaggio?');
                    waitingForSendConfirm = true;
                    // Aspetta altri 10 secondi per la risposta
                    longSilenceTimer = setTimeout(() => {
                        if (waitingForSendConfirm) {
                            waitingForSendConfirm = false;
                            showToast('⏳ Nessuna risposta, continuo ad ascoltare');
                            resetLongSilenceTimer();
                        }
                    }, 10000);
                }
            }, 20000);
        }
    }

    function startListening() {
        if (!recognition) {
            if (!initSpeechRecognition()) {
                showToast('❌ Riconoscimento vocale non supportato');
                return;
            }
        }

        try {
            State.isListening = true;
            recognition.start();
            resetLongSilenceTimer();

            // Mostra overlay con testo iniziale
            clearTranscript();
            showSpeechOverlay('...', false);
        } catch (e) {
            console.log('[TTS] Recognition già attivo o errore:', e);
        }
    }

    function stopListening() {
        State.isListening = false;
        State.isManualDictation = false;
        clearTimeout(silenceTimer);
        clearTimeout(longSilenceTimer);
        waitingForSendConfirm = false;

        if (recognition) {
            try {
                recognition.stop();
            } catch (e) {}
        }

        // Nascondi overlay
        hideSpeechOverlay();

        updateDialogIndicator();
        updateMicButtonState();
    }
    //#endregion

    //#region Textarea e Invio Messaggi
    function getTextarea() {
        // Claude usa un div contenteditable
        return document.querySelector('div[contenteditable="true"][data-testid="chat-input"]');
    }

    function appendToTextarea(text) {
        const textarea = getTextarea();
        if (!textarea) {
            console.error('[TTS] Textarea non trovata');
            return;
        }

        // Mantieni il focus
        textarea.focus();

        // Trova o crea il paragrafo interno
        let p = textarea.querySelector('p');
        if (!p) {
            p = document.createElement('p');
            textarea.appendChild(p);
        }

        // Aggiungi testo
        const currentText = p.textContent || '';
        const separator = currentText && !currentText.endsWith(' ') ? ' ' : '';
        p.textContent = currentText + separator + text;

        // Sposta cursore alla fine
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(p);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);

        // Trigger input event per aggiornare lo stato di Claude
        textarea.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: text
        }));
    }

    function clearTextarea() {
        const textarea = getTextarea();
        if (!textarea) return;

        textarea.focus();

        let p = textarea.querySelector('p');
        if (p) {
            p.textContent = '';
        } else {
            textarea.innerHTML = '<p></p>';
        }

        textarea.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'deleteContent'
        }));
    }

    function sendMessage() {
        clearTimeout(silenceTimer);
        clearTimeout(longSilenceTimer);

        // Nascondi overlay subito
        hideSpeechOverlay();

        // Trova il bottone di invio
        const sendBtn = document.querySelector('button[aria-label="Invia messaggio"]') ||
                       document.querySelector('button[aria-label="Send message"]');

        if (sendBtn && !sendBtn.disabled) {
            // Usa React onClick direttamente (funziona anche senza focus sulla tab)
            const propsKey = Object.keys(sendBtn).find(k => k.startsWith('__reactProps'));
            const onClick = sendBtn[propsKey]?.onClick;

            if (onClick) {
                onClick();
                console.log('[TTS] Messaggio inviato via React onClick');
            } else {
                // Fallback al click normale
                sendBtn.click();
                console.log('[TTS] Messaggio inviato via click()');
            }

            showToast('📨 Messaggio inviato!');

            // Se in modalità dialogo, fermati e aspetta la risposta
            if (State.dialogMode) {
                stopListening();
            }
        } else {
            showToast('⚠️ Impossibile inviare (bottone disabilitato?)');
            console.log('[TTS] Bottone invio non trovato o disabilitato:', sendBtn);
        }
    }
    //#endregion

    //#region Dialog Mode
    function startDialogMode() {
        State.dialogMode = true;
        // Non salvare in GM - stato locale per tab
        showToast('🎙️ Dialogo vocale attivato');
        updateDialogIndicator();
        updateMenuState();

        // Non avviare subito l'ascolto - aspetta che finisca l'eventuale lettura
        if (!State.isPlaying) {
            startListening();
        }
    }

    function stopDialogMode() {
        State.dialogMode = false;
        State.isManualDictation = false;
        // Non salvare in GM - stato locale per tab
        stopListening();
        stopCurrentPlayback();
        updateDialogIndicator();
        updateMenuState();
    }

    function updateDialogIndicator() {
        let indicator = document.querySelector('.tts-dialog-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'tts-dialog-indicator';
            document.body.appendChild(indicator);
        }

        if (State.dialogMode) {
            indicator.classList.add('active');
            if (State.isListening) {
                indicator.classList.add('listening');
                indicator.innerHTML = '<span class="dot"></span> In ascolto...';
            } else if (State.isPlaying) {
                indicator.classList.remove('listening');
                indicator.innerHTML = '<span class="dot"></span> Lettura...';
            } else {
                indicator.classList.remove('listening');
                indicator.innerHTML = '<span class="dot"></span> Dialogo attivo';
            }
        } else {
            indicator.classList.remove('active', 'listening');
        }
    }

    function updateMicButtonState() {
        const micBtn = document.querySelector('.tts-mic-btn');
        if (micBtn) {
            if (State.isListening) {
                micBtn.classList.add('listening');
                micBtn.innerHTML = ICONS.mic;
                micBtn.title = 'Smetti di ascoltare';
            } else {
                micBtn.classList.remove('listening');
                micBtn.innerHTML = ICONS.mic;
                micBtn.title = 'Parla';
            }
        }
    }

    function updateMenuState() {
        const dialogItem = document.querySelector('[data-action="toggle-dialog"]');
        if (dialogItem) {
            dialogItem.classList.toggle('selected', State.dialogMode);
        }

        const controlBtn = document.querySelector('.tts-control-btn');
        if (controlBtn) {
            controlBtn.classList.toggle('active', State.autoRead || State.dialogMode);
        }
    }
    //#endregion

    //#region Streaming TTS

    // Trova il punto di taglio ottimale per una frase
    function findSentenceBreak(text, minLength) {
        if (text.length < minLength) return -1;

        // Cerca fine frase dopo minLength caratteri
        const searchStart = minLength;
        const sentenceEnders = ['. ', '! ', '? ', '.\n', '!\n', '?\n', '\n\n'];

        let bestBreak = -1;

        for (const ender of sentenceEnders) {
            const pos = text.indexOf(ender, searchStart);
            if (pos !== -1 && (bestBreak === -1 || pos < bestBreak)) {
                bestBreak = pos + ender.length - 1; // Include il punto ma non lo spazio
            }
        }

        // Se non trova fine frase, cerca almeno un a capo
        if (bestBreak === -1) {
            const newlinePos = text.indexOf('\n', searchStart);
            if (newlinePos !== -1) {
                bestBreak = newlinePos;
            }
        }

        return bestBreak;
    }

    // Estrae un chunk dal buffer se pronto
    function extractChunkFromBuffer() {
        const breakPoint = findSentenceBreak(streamBuffer, currentChunkSize);

        if (breakPoint !== -1) {
            const chunk = streamBuffer.substring(0, breakPoint + 1).trim();
            streamBuffer = streamBuffer.substring(breakPoint + 1);

            // Aumenta progressivamente la dimensione del chunk per fluidità
            currentChunkSize = Math.min(currentChunkSize + 100, 800);

            return chunk;
        }

        return null;
    }

    // Processa la coda TTS con pipeline (pre-genera mentre riproduce)
    async function processQueue() {
        if (isProcessingQueue || streamingAborted) return;

        isProcessingQueue = true;
        State.isPlaying = true;
        updateDialogIndicator();

        // Avvia pre-generazione in background
        preGenerateNext();

        while ((ttsQueue.length > 0 || audioQueue.length > 0) && !streamingAborted) {
            let audioData = null;

            // Prova a prendere audio pre-generato
            if (audioQueue.length > 0) {
                audioData = audioQueue.shift();
                console.log('[TTS] Uso audio pre-generato');
            }
            // Altrimenti genera al volo
            else if (ttsQueue.length > 0) {
                const chunk = ttsQueue.shift();
                const cleanChunk = cleanTextForTTS(chunk);

                if (!cleanChunk) continue;

                console.log('[TTS] Genero audio al volo:', cleanChunk.substring(0, 50) + '...');

                try {
                    const result = await edgeTTSGenerate(cleanChunk, State.currentVoice, State.rate);
                    audioData = result.base64;
                } catch (e) {
                    console.error('[TTS] Errore generazione:', e);
                    continue;
                }
            }

            if (!audioData || streamingAborted) break;

            // Avvia pre-generazione del prossimo mentre riproduco questo
            preGenerateNext();

            try {
                const audio = new Audio("data:audio/mpeg;base64," + audioData);
                currentAudio = audio;

                await new Promise((resolve, reject) => {
                    audio.onended = resolve;
                    audio.onerror = reject;
                    audio.play().catch(reject);
                });

            } catch (e) {
                console.error('[TTS] Errore riproduzione:', e);
            }
        }

        isProcessingQueue = false;

        // Se lo streaming è finito e le code sono vuote, concludi
        if (!State.isStreaming && ttsQueue.length === 0 && audioQueue.length === 0) {
            finishStreamingPlayback();
        }
    }

    // Pre-genera il prossimo chunk in background
    async function preGenerateNext() {
        if (isPreGenerating || streamingAborted || ttsQueue.length === 0) return;

        isPreGenerating = true;

        const chunk = ttsQueue.shift();
        const cleanChunk = cleanTextForTTS(chunk);

        if (cleanChunk) {
            console.log('[TTS] Pre-genero:', cleanChunk.substring(0, 50) + '...');

            try {
                const result = await edgeTTSGenerate(cleanChunk, State.currentVoice, State.rate);
                if (!streamingAborted) {
                    audioQueue.push(result.base64);
                    console.log('[TTS] Audio pre-generato, coda audio:', audioQueue.length);
                }
            } catch (e) {
                console.error('[TTS] Errore pre-generazione:', e);
                // Rimetti in coda per ritentare
                ttsQueue.unshift(chunk);
            }
        }

        isPreGenerating = false;

        // Continua a pre-generare se c'è altro
        if (ttsQueue.length > 0 && audioQueue.length < 2) {
            preGenerateNext();
        }
    }

    // Aggiunge testo al buffer e estrae chunk se pronti
    function addToStreamBuffer(text) {
        streamBuffer += text;

        // Prova a estrarre un chunk
        const chunk = extractChunkFromBuffer();
        if (chunk) {
            ttsQueue.push(chunk);
            console.log('[TTS] Chunk estratto, coda:', ttsQueue.length);

            // Avvia elaborazione se non già in corso
            if (!isProcessingQueue) {
                processQueue();
            }
        }
    }

    // Chiamata quando lo streaming termina
    function flushStreamBuffer() {
        // Aggiungi tutto il buffer rimanente alla coda
        if (streamBuffer.trim()) {
            ttsQueue.push(streamBuffer.trim());
            streamBuffer = '';
        }

        State.isStreaming = false;

        // Se non sta già processando, avvia
        if (!isProcessingQueue && (ttsQueue.length > 0 || audioQueue.length > 0)) {
            processQueue();
        } else if (!isProcessingQueue && ttsQueue.length === 0 && audioQueue.length === 0) {
            finishStreamingPlayback();
        }
    }

    // Concludi la riproduzione streaming
    function finishStreamingPlayback() {
        State.isPlaying = false;
        currentAudio = null;
        updateDialogIndicator();

        console.log('[TTS] Streaming playback completato');

        // Suono di completamento
        playSound('click');

        // Se in modalità dialogo, avvia ascolto
        if (State.dialogMode && !streamingAborted) {
            setTimeout(() => {
                startListening();
            }, 500);
        }

        // Reset per prossimo streaming
        streamingAborted = false;
        currentChunkSize = 300;
    }

    // Interrompe lo streaming TTS
    function abortStreamingPlayback() {
        streamingAborted = true;
        streamBuffer = '';
        ttsQueue = [];
        audioQueue = [];
        isPreGenerating = false;

        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        State.isPlaying = false;
        State.isStreaming = false;
        isProcessingQueue = false;
        updateDialogIndicator();
    }

    //#endregion

    //#region Fetch Interceptor per Streaming
    function setupFetchInterceptor() {
        const originalFetch = unsafeWindow.fetch;

        unsafeWindow.fetch = async function(...args) {
            const [url, config] = args;

            // Intercetta le chiamate di completion (streaming)
            if (typeof url === 'string' &&
                url.includes('/completion') &&
                config && config.method === 'POST' &&
                (State.autoRead || State.dialogMode)) {

                console.log('[TTS] Intercettato streaming completion');

                // Reset stato streaming
                streamBuffer = '';
                ttsQueue = [];
                currentChunkSize = 300;
                streamingAborted = false;
                State.isStreaming = true;

                const response = await originalFetch.apply(this, args);

                // Clona la risposta per processarla
                const clonedResponse = response.clone();

                // Processa lo stream in background
                processSSEStream(clonedResponse);

                return response;
            }

            // Per altre chiamate, comportamento normale
            return originalFetch.apply(this, args);
        };
    }

    async function processSSEStream(response) {
        try {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    console.log('[TTS] Stream completato');
                    flushStreamBuffer();
                    break;
                }

                if (streamingAborted) {
                    console.log('[TTS] Stream abortito');
                    reader.cancel();
                    break;
                }

                buffer += decoder.decode(value, { stream: true });

                // Processa linee complete
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Mantieni l'ultima linea incompleta

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));

                            // Estrai il testo dai delta
                            if (data.type === 'content_block_delta' &&
                                data.delta?.type === 'text_delta' &&
                                data.delta?.text) {

                                addToStreamBuffer(data.delta.text);
                            }

                            // Fine messaggio
                            if (data.type === 'message_stop') {
                                console.log('[TTS] message_stop ricevuto');
                                flushStreamBuffer();
                            }

                        } catch (e) {
                            // Ignora errori di parsing (linee non JSON)
                        }
                    }
                }
            }

        } catch (e) {
            console.error('[TTS] Errore processamento stream:', e);
            flushStreamBuffer();
        }
    }

    // Manteniamo anche autoPlayLastMessage come fallback
    async function autoPlayLastMessage(text) {
        if (State.isPlaying || (!State.autoRead && !State.dialogMode)) return;

        // Trova l'ultimo bottone play nel DOM
        const allPlayBtns = document.querySelectorAll('.tts-play-btn');
        const lastBtn = allPlayBtns[allPlayBtns.length - 1];

        if (!lastBtn) return;

        State.isPlaying = true;
        currentPlayingBtn = lastBtn;
        setButtonState(lastBtn, true);
        updateDialogIndicator();
        showToast('🔊 Auto-lettura...');

        const chunks = splitTextIntoChunks(text);

        try {
            for (let i = 0; i < chunks.length; i++) {
                if ((!State.autoRead && !State.dialogMode) || currentPlayingBtn !== lastBtn) break;

                if (chunks.length > 1) {
                    showToast(`🔊 Parte ${i + 1}/${chunks.length}`);
                }

                const result = await edgeTTSGenerate(chunks[i], State.currentVoice, State.rate);
                const audio = new Audio("data:audio/mpeg;base64," + result.base64);
                currentAudio = audio;

                await new Promise((resolve, reject) => {
                    audio.onended = resolve;
                    audio.onerror = reject;
                    audio.play().catch(reject);
                });

                if (i < chunks.length - 1) {
                    await new Promise(r => setTimeout(r, 200));
                }
            }
        } catch (e) {
            console.error('[TTS] Errore auto-play:', e);
        } finally {
            State.isPlaying = false;
            setButtonState(lastBtn, false);
            currentAudio = null;
            currentPlayingBtn = null;
            updateDialogIndicator();

            // Se in modalità dialogo, avvia ascolto dopo lettura
            if (State.dialogMode) {
                setTimeout(() => {
                    startListening();
                }, 500);
            }
        }
    }
    //#endregion

    //#region Edge TTS Core
    const EDGE_TTS_CONFIG = {
        token: "6A5AA1D4EAFF4E9FB37E23D68491D6F4",
        version: "1-130.0.2849.68",
        baseUrl: "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1",
        timeout: 30
    };

    async function generateSecMsGec() {
        const WIN_EPOCH = 11644473600;
        let ticks = (Date.now() / 1000) + WIN_EPOCH;
        ticks -= ticks % 300;
        ticks *= 1e7;
        const str = `${ticks.toFixed(0)}${EDGE_TTS_CONFIG.token}`;
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    function formatTimestamp() {
        const now = new Date();
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const pad = n => (n < 10 ? "0" : "") + n;
        return `${days[now.getUTCDay()]} ${months[now.getUTCMonth()]} ${pad(now.getUTCDate())} ${now.getUTCFullYear()} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} GMT+0000 (Coordinated Universal Time)`;
    }

    function generateUUID() {
        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c =>
            (c === "x" ? (Math.random() * 16) | 0 : ((Math.random() * 16) & 0x3) | 0x8).toString(16)
        );
    }

    function escapeSSML(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function uint8ArrayToBase64(uint8Array) {
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binary);
    }

    async function edgeTTSGenerate(text, voice, rate = 0, retryCount = 0) {
        const maxRetries = 2;

        const secMsGec = await generateSecMsGec();
        const wsUrl = `${EDGE_TTS_CONFIG.baseUrl}?TrustedClientToken=${EDGE_TTS_CONFIG.token}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${EDGE_TTS_CONFIG.version}`;

        const voiceLang = voice.split('-').slice(0, 2).join('-');

        try {
            return await new Promise((resolve, reject) => {
                const audioChunks = [];
                let ws, timeoutId, receivedTurnEnd = false;

                try {
                    ws = new WebSocket(wsUrl);
                } catch (e) {
                    reject(e);
                    return;
                }

                timeoutId = setTimeout(() => {
                    ws.close();
                    reject(new Error('Timeout'));
                }, EDGE_TTS_CONFIG.timeout * 1000);

                ws.onopen = () => {
                    ws.send("X-Timestamp:" + formatTimestamp() + "\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n" + JSON.stringify({
                        context: {
                            synthesis: {
                                audio: {
                                    metadataoptions: { sentenceBoundaryEnabled: "false", wordBoundaryEnabled: "false" },
                                    outputFormat: "audio-24khz-48kbitrate-mono-mp3"
                                }
                            }
                        }
                    }));

                    const rateStr = (rate >= 0 ? '+' : '') + rate + '%';
                    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${voiceLang}'><voice name='${voice}'><prosody rate='${rateStr}'>${escapeSSML(text)}</prosody></voice></speak>`;
                    ws.send("X-RequestId:" + generateUUID() + "\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:" + formatTimestamp() + "Z\r\nPath:ssml\r\n\r\n" + ssml);
                };

                ws.onmessage = async (event) => {
                    if (typeof event.data === 'string' && event.data.includes('Path:turn.end')) {
                        receivedTurnEnd = true;
                        clearTimeout(timeoutId);
                        setTimeout(() => {
                            ws.close(1000);
                            const totalLen = audioChunks.reduce((a, c) => a + c.length, 0);
                            const merged = new Uint8Array(totalLen);
                            let off = 0;
                            for (const c of audioChunks) {
                                merged.set(c, off);
                                off += c.length;
                            }
                            resolve({ base64: uint8ArrayToBase64(merged), size: merged.length });
                        }, 300);
                    } else if (event.data instanceof Blob) {
                        const buf = await event.data.arrayBuffer();
                        if (buf.byteLength >= 2) {
                            const hLen = new DataView(buf).getUint16(0, false);
                            if (hLen + 2 <= buf.byteLength) {
                                const audio = new Uint8Array(buf.slice(hLen + 2));
                                if (audio.length > 0) audioChunks.push(audio);
                            }
                        }
                    }
                };

                ws.onerror = () => {
                    clearTimeout(timeoutId);
                    reject(new Error('WebSocket error'));
                };
                ws.onclose = () => {
                    if (!receivedTurnEnd && audioChunks.length === 0) {
                        clearTimeout(timeoutId);
                        reject(new Error('Connessione chiusa'));
                    }
                };
            });
        } catch (e) {
            // Retry automatico
            if (retryCount < maxRetries) {
                console.log(`[TTS] Retry ${retryCount + 1}/${maxRetries} dopo errore:`, e.message);
                await new Promise(r => setTimeout(r, 500));
                return edgeTTSGenerate(text, voice, rate, retryCount + 1);
            }
            throw e;
        }
    }
    //#endregion

    //#region Text Extraction
    function extractTextFromMessage(container) {
        let messageContent = container.querySelector('.font-claude-response');
        if (!messageContent) {
            messageContent = container.querySelector('.font-user-message');
        }
        if (!messageContent) return '';

        const clone = messageContent.cloneNode(true);
        clone.querySelectorAll('button, svg, .message-time, pre, code, .tts-play-wrapper').forEach(el => el.remove());

        let text = clone.textContent || '';
        text = cleanTextForTTS(text);

        return text;
    }

    function cleanTextForTTS(text) {
        return text
            // Rimuovi markdown formattazione
            .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
            .replace(/\*([^*]+)\*/g, '$1')      // *italic*
            .replace(/__([^_]+)__/g, '$1')      // __bold__
            .replace(/_([^_]+)_/g, '$1')        // _italic_
            .replace(/~~([^~]+)~~/g, '$1')      // ~~strikethrough~~
            .replace(/`([^`]+)`/g, '$1')        // `code`
            .replace(/```[\s\S]*?```/g, '')     // ```code blocks```
            .replace(/^#{1,6}\s*/gm, '')        // # headers

            // Rimuovi bullet points e liste
            .replace(/^\s*[-*+]\s+/gm, '')      // - bullet points
            .replace(/^\s*\d+\.\s+/gm, '')      // 1. numbered lists

            // Rimuovi link markdown
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // [link](url)

            // PULIZIA PUNTEGGIATURA RIPETUTA (per TTS naturale)
            .replace(/-{2,}/g, ' ')             // -- --- ---- → spazio
            .replace(/_{2,}/g, ' ')             // __ ___ → spazio
            .replace(/\*{2,}/g, '')             // ** *** → niente
            .replace(/={2,}/g, ' ')             // == === → spazio
            .replace(/\.{3,}/g, '...')          // .... → ...
            .replace(/\|/g, ' ')                // | (tabelle) → spazio
            .replace(/[─━┃│┄┅┆┇┈┉]/g, '')      // Caratteri box drawing

            // Rimuovi simboli rimasti
            .replace(/\*/g, '')
            .replace(/_/g, ' ')

            // Normalizza spazi
            .replace(/\n{3,}/g, '\n\n')         // Max 2 newline
            .replace(/\s+/g, ' ')
            .trim();
    }

    function splitTextIntoChunks(text, maxLength = 3000) {
        if (text.length <= maxLength) return [text];

        const chunks = [];
        const sentences = text.split(/(?<=[.!?])\s+/);
        let currentChunk = '';

        for (const sentence of sentences) {
            if ((currentChunk + ' ' + sentence).length > maxLength) {
                if (currentChunk) chunks.push(currentChunk.trim());
                if (sentence.length > maxLength) {
                    const words = sentence.split(' ');
                    currentChunk = '';
                    for (const word of words) {
                        if ((currentChunk + ' ' + word).length > maxLength) {
                            if (currentChunk) chunks.push(currentChunk.trim());
                            currentChunk = word;
                        } else {
                            currentChunk += (currentChunk ? ' ' : '') + word;
                        }
                    }
                } else {
                    currentChunk = sentence;
                }
            } else {
                currentChunk += (currentChunk ? ' ' : '') + sentence;
            }
        }
        if (currentChunk) chunks.push(currentChunk.trim());

        return chunks;
    }
    //#endregion

    //#region Audio Playback
    function stopCurrentPlayback() {
        // Ferma streaming se attivo
        if (State.isStreaming) {
            abortStreamingPlayback();
        }

        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        if (currentPlayingBtn) {
            setButtonState(currentPlayingBtn, false);
            currentPlayingBtn = null;
        }
        State.isPlaying = false;
        updateDialogIndicator();
    }

    function setButtonState(btn, playing) {
        const iconPlay = btn.querySelector('.tts-icon-play');
        const iconPause = btn.querySelector('.tts-icon-pause');

        if (playing) {
            btn.classList.add('playing');
            if (iconPlay) iconPlay.style.display = 'none';
            if (iconPause) iconPause.style.display = '';
        } else {
            btn.classList.remove('playing');
            if (iconPlay) iconPlay.style.display = '';
            if (iconPause) iconPause.style.display = 'none';
        }
    }

    async function playMessage(container, btn) {
        // Se sta già suonando questo, gestisci pausa
        if (currentPlayingBtn === btn || State.isStreaming) {
            // In modalità dialogo: pause = salta lettura, passa all'ascolto
            if (State.dialogMode) {
                stopCurrentPlayback();
                showToast('⏭️ Salto lettura, in ascolto...');
                setTimeout(() => startListening(), 300);
            } else {
                stopCurrentPlayback();
                showToast('⏹️ Fermato');
            }
            return;
        }

        // Ferma eventuale riproduzione precedente
        stopCurrentPlayback();

        const text = extractTextFromMessage(container);
        if (!text) {
            showToast('❌ Nessun testo da leggere');
            return;
        }

        currentPlayingBtn = btn;
        State.isPlaying = true;
        setButtonState(btn, true);
        updateDialogIndicator();

        const chunks = splitTextIntoChunks(text);
        showToast(`🎤 Generazione audio...`);

        try {
            for (let i = 0; i < chunks.length; i++) {
                if (currentPlayingBtn !== btn) break;

                if (chunks.length > 1) {
                    showToast(`🔊 Parte ${i + 1}/${chunks.length}`);
                }

                const result = await edgeTTSGenerate(chunks[i], State.currentVoice, State.rate);
                const audio = new Audio("data:audio/mpeg;base64," + result.base64);
                currentAudio = audio;

                await new Promise((resolve, reject) => {
                    audio.onended = resolve;
                    audio.onerror = reject;
                    audio.play().catch(reject);
                });

                if (i < chunks.length - 1 && currentPlayingBtn === btn) {
                    await new Promise(r => setTimeout(r, 200));
                }
            }

            if (currentPlayingBtn === btn) {
                showToast('✅ Completato');
            }
        } catch (e) {
            console.error('[TTS] Errore:', e);
            showToast('❌ Errore: ' + e.message);
        } finally {
            if (currentPlayingBtn === btn) {
                stopCurrentPlayback();
                // Se in dialogo, avvia ascolto
                if (State.dialogMode) {
                    setTimeout(() => startListening(), 500);
                }
            }
        }
    }
    //#endregion

    //#region Voci Disponibili
    const VOICES = [
        { id: 'it-IT-IsabellaNeural', name: '🇮🇹 Isabella', lang: 'IT' },
        { id: 'it-IT-DiegoNeural', name: '🇮🇹 Diego', lang: 'IT' },
        { id: 'en-US-JennyNeural', name: '🇺🇸 Jenny', lang: 'EN' },
        { id: 'en-US-GuyNeural', name: '🇺🇸 Guy', lang: 'EN' },
        { id: 'en-GB-SoniaNeural', name: '🇬🇧 Sonia', lang: 'EN' },
        { id: 'fr-FR-DeniseNeural', name: '🇫🇷 Denise', lang: 'FR' },
        { id: 'de-DE-KatjaNeural', name: '🇩🇪 Katja', lang: 'DE' },
        { id: 'es-ES-ElviraNeural', name: '🇪🇸 Elvira', lang: 'ES' },
        { id: 'ja-JP-NanamiNeural', name: '🇯🇵 Nanami', lang: 'JA' },
        { id: 'zh-CN-XiaoxiaoNeural', name: '🇨🇳 Xiaoxiao', lang: 'ZH' }
    ];
    //#endregion

    //#region Utility
    function showToast(msg) {
        let toast = document.querySelector('.tts-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'tts-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
    //#endregion

    //#region Bottone Play per messaggi
    function createPlayButton() {
        const wrapper = document.createElement('div');
        wrapper.className = 'w-fit tts-play-wrapper';
        wrapper.setAttribute('data-state', 'closed');

        const btn = document.createElement('button');
        btn.className = `inline-flex items-center justify-center relative shrink-0 can-focus select-none
            border-transparent transition font-base duration-300
            ease-[cubic-bezier(0.165,0.85,0.45,1)] h-8 w-8 rounded-md active:scale-95 group/btn tts-play-btn`;
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Leggi messaggio');
        btn.title = 'Leggi questo messaggio';

        btn.innerHTML = `
            <div class="flex items-center justify-center text-text-500 group-hover/btn:text-text-100" style="width: 16px; height: 16px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="shrink-0 tts-icon-play">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="shrink-0 tts-icon-pause" style="display:none;">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
            </div>
        `;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const messageContainer = btn.closest('div[data-test-render-count]');
            if (messageContainer) {
                playMessage(messageContainer, btn);
            } else {
                showToast('❌ Messaggio non trovato');
            }
        });

        wrapper.appendChild(btn);
        return wrapper;
    }

    function injectPlayButtons() {
        const messageContainers = document.querySelectorAll('div[data-test-render-count]');

        messageContainers.forEach(container => {
            const actionBar = container.querySelector('[role="group"][aria-label="Message actions"]');
            if (!actionBar) return;
            if (actionBar.querySelector('.tts-play-wrapper')) return;

            const buttonsRow = actionBar.querySelector('.flex.items-stretch');
            if (buttonsRow) {
                const playBtn = createPlayButton();
                buttonsRow.insertBefore(playBtn, buttonsRow.firstChild);
            }
        });
    }
    //#endregion

    //#region Bottoni Controllo (Speaker + Mic)
    function createControlButton() {
        const wrapper = document.createElement('div');
        wrapper.className = 'tts-control-wrapper';

        const btn = document.createElement('button');
        btn.className = 'tts-control-btn' + ((State.autoRead || State.dialogMode) ? ' active' : '');
        btn.title = 'Impostazioni TTS';
        btn.innerHTML = ICONS.speaker;

        const menu = document.createElement('div');
        menu.className = 'tts-menu';
        menu.innerHTML = `
            <div class="tts-menu-section">Modalità</div>
            <div class="tts-menu-item ${State.autoRead ? 'selected' : ''}" data-action="toggle-auto">
                <span class="check">${ICONS.check}</span>
                <span>Leggi automaticamente</span>
            </div>
            <div class="tts-menu-item ${State.dialogMode ? 'selected' : ''}" data-action="toggle-dialog">
                <span class="check">${ICONS.check}</span>
                <span>🎤 Dialogo vocale</span>
            </div>
            <div class="tts-menu-divider"></div>
            <div class="tts-menu-section">Voce</div>
            ${VOICES.map(v => `
                <div class="tts-menu-item ${v.id === State.currentVoice ? 'selected' : ''}" data-voice="${v.id}">
                    <span class="check">${ICONS.check}</span>
                    <span>${v.name}</span>
                </div>
            `).join('')}
            <div class="tts-menu-divider"></div>
            <div class="tts-menu-speed">
                <label>Velocità:</label>
                <input type="range" min="-50" max="100" value="${State.rate}" id="tts-rate-slider">
                <span class="value">${State.rate}%</span>
            </div>
        `;

        wrapper.appendChild(btn);
        wrapper.appendChild(menu);

        // Toggle menu
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
        });

        // Click fuori chiude menu
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                menu.classList.remove('open');
            }
        });

        // Gestione click menu items
        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.tts-menu-item');
            if (!item) return;

            e.stopPropagation();

            if (item.dataset.action === 'toggle-auto') {
                State.autoRead = !State.autoRead;
                // Non salvare in GM - stato locale per tab
                item.classList.toggle('selected', State.autoRead);
                btn.classList.toggle('active', State.autoRead || State.dialogMode);
                showToast(State.autoRead ? '🔊 Auto-lettura ON' : '🔇 Auto-lettura OFF');
            } else if (item.dataset.action === 'toggle-dialog') {
                if (State.dialogMode) {
                    stopDialogMode();
                    showToast('🎤 Dialogo vocale OFF');
                } else {
                    startDialogMode();
                }
                item.classList.toggle('selected', State.dialogMode);
                btn.classList.toggle('active', State.autoRead || State.dialogMode);
            } else if (item.dataset.voice) {
                State.currentVoice = item.dataset.voice;
                GM_setValue('tts_voice', State.currentVoice);
                menu.querySelectorAll('[data-voice]').forEach(el => {
                    el.classList.toggle('selected', el.dataset.voice === State.currentVoice);
                });
                const voiceName = VOICES.find(v => v.id === State.currentVoice)?.name || '';
                showToast(`🎤 Voce: ${voiceName}`);
            }
        });

        // Slider velocità
        const slider = menu.querySelector('#tts-rate-slider');
        const valueSpan = menu.querySelector('.tts-menu-speed .value');
        slider.addEventListener('input', (e) => {
            State.rate = parseInt(e.target.value);
            GM_setValue('tts_rate', State.rate);
            valueSpan.textContent = State.rate + '%';
        });

        return wrapper;
    }

    function createMicButton() {
        const btn = document.createElement('button');
        btn.className = 'tts-mic-btn';
        btn.title = 'Parla';
        btn.innerHTML = ICONS.mic;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (State.isListening && State.isManualDictation) {
                // Ferma dettatura manuale
                State.isManualDictation = false;
                stopListening();
                showToast('🎤 Dettatura terminata');
            } else if (!State.isListening) {
                // Avvia dettatura manuale
                State.isManualDictation = true;
                startListening();
                showToast('🎤 Parla pure...');
            }
        });

        return btn;
    }

    function injectControlButtons() {
        const inputArea = document.querySelector('[data-testid="chat-input"]');
        if (!inputArea) return false;

        const buttonsContainer = inputArea.closest('.flex.flex-col')?.querySelector('.flex.gap-2.w-full.items-center .relative.flex-1');
        if (!buttonsContainer) return false;

        // Evita doppia iniezione
        if (buttonsContainer.querySelector('.tts-control-wrapper')) return true;

        const controlBtn = createControlButton();
        const micBtn = createMicButton();

        buttonsContainer.appendChild(controlBtn);
        buttonsContainer.appendChild(micBtn);

        return true;
    }
    //#endregion

    //#region Observer e Init
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                    break;
                }
            }
            if (shouldCheck) {
                requestAnimationFrame(() => {
                    injectPlayButtons();
                    injectControlButtons();
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        addStyles();
        setupFetchInterceptor();
        initSpeechRecognition();

        // Polling per iniettare i bottoni
        let attempts = 0;
        const maxAttempts = 30;
        const pollInterval = setInterval(() => {
            attempts++;
            const injected = injectControlButtons();
            if (injected || attempts >= maxAttempts) {
                clearInterval(pollInterval);
            }
        }, 500);

        // Inietta bottoni play sui messaggi esistenti
        setTimeout(injectPlayButtons, 1000);

        // Observer per nuovi messaggi
        setupObserver();

        // Crea indicatore dialogo
        const indicator = document.createElement('div');
        indicator.className = 'tts-dialog-indicator';
        document.body.appendChild(indicator);

        console.log('[TTS] Claude TTS Reader + Voice Dialog v2.0 inizializzato');
    }

    // Avvia
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    //#endregion

})();