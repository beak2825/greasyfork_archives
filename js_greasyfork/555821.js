// ==UserScript==
// @name         Amateur.tv Chat Reader
// @namespace    http://tampermonkey.net/
// @version      18.4
// @description  Reads chat messages aloud on Amateur.tv with independent volume control for each voice, custom voice selection, and a collapsible panel.
// @author       ChatGPT (Corregido - Versión 18.4)
// @match        https://es.amateur.tv/*
// @grant        GM_xmlhttpRequest
// @connect      api.elevenlabs.io
// @icon         https://www.amateur.tv/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555821/Amateurtv%20Chat%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/555821/Amateurtv%20Chat%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('ChatReader: script started. Version 18.4');

    // ===== CONFIGURACIÓN DE API KEY =====
    // Obtén tu API key GRATIS en: https://elevenlabs.io (20,000 caracteres/mes)
    // 1. Regístrate gratis en https://elevenlabs.io
    // 2. Ve a https://elevenlabs.io/app/developers/api-keys
    // 3. Copia tu API key y pégala aquí:
    const ELEVENLABS_API_KEY = 'TU_API_KEY_AQUI';

    // Voces disponibles en español (con género)
    const AVAILABLE_VOICES = {
        // VOCES FEMENINAS
        'Charlotte': { id: 'XB0fDUnXU5powFXDhCwa', gender: 'female', name: 'Charlotte (Femenina - Suave)' },
        'Matilda': { id: 'XrExE9yKIg1WjnnlVkGX', gender: 'female', name: 'Matilda (Femenina - Joven)' },
        'Alice': { id: 'Xb7hH8MSUJpSbSDYk0k2', gender: 'female', name: 'Alice (Femenina - Natural)' },
        'Lily': { id: 'pFZP5JQG7iQjIQuC4Bku', gender: 'female', name: 'Lily (Femenina - Cálida)' },
        'Grace': { id: 'oWAxZDx7w5VEj9dCyTzz', gender: 'female', name: 'Grace (Femenina - Elegante)' },

        // VOCES MASCULINAS
        'Bill': { id: 'pqHfZKP75CvOlQylNhV4', gender: 'male', name: 'Bill (Masculina - Firme)' },
        'Daniel': { id: 'onwK4e9ZLuTAKqWW03F9', gender: 'male', name: 'Daniel (Masculina - Profunda)' },
        'Callum': { id: 'N2lVS1w4EtoT3dr4eOWO', gender: 'male', name: 'Callum (Masculina - Juvenil)' },
        'George': { id: 'JBFqnCBsd6RMkjVDRZzb', gender: 'male', name: 'George (Masculina - Natural)' },
        'Eric': { id: 'cjVigY5qzO86Huf0OWal', gender: 'male', name: 'Eric (Masculina - Cálida)' }
    };

    // ========================================

    let lastReadMessageCount = 0;
    let chatObserver = null;
    let bodyObserver = null;
    let isSpeechEnabled = false;
    let controlsContainer = null;
    let enableButton = null;

    let modelVolumeSlider = null;
    let userVolumeSlider = null;
    let modelVoiceSelect = null;
    let userVoiceSelect = null;

    let modelVoice = localStorage.getItem('chatReaderModelVoice') || 'Charlotte';
    let userVoice = localStorage.getItem('chatReaderUserVoice') || 'Bill';

    let urlCheckInterval = null;
    let chatContainerCheckInterval = null;
    let toggleButton = null;
    let currentChatContainer = null;
    let audioQueue = [];
    let isPlaying = false;
    let isInitialized = false; // FLAG PARA EVITAR BUCLES

    // Cola de reproducción
    function playNextInQueue() {
        if (audioQueue.length === 0) {
            isPlaying = false;
            return;
        }

        isPlaying = true;
        const audioData = audioQueue.shift();

        const audio = new Audio();
        audio.volume = audioData.volume;

        audio.onloadeddata = () => {
            console.log('ChatReader: Audio loaded, playing...');
        };

        audio.onended = () => {
            console.log('ChatReader: Finished playing audio');
            playNextInQueue();
        };

        audio.onerror = (e) => {
            console.error('ChatReader: Audio playback error:', e);
            playNextInQueue();
        };

        audio.src = URL.createObjectURL(audioData.blob);
        audio.play().catch(err => {
            console.error('ChatReader: Error playing audio:', err);
            playNextInQueue();
        });
    }

    // TTS con ElevenLabs
    function speakWithElevenLabs(text, isModelVoice = true, forcePlay = false) {
        if (!isSpeechEnabled && !forcePlay) {
            console.log('ChatReader: Speech is disabled. Skipping:', text);
            return;
        }

        if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'TU_API_KEY_AQUI') {
            console.error('ChatReader: API key not configured!');
            alert('❌ Este script requiere configuración inicial.\n\nEdita el script y configura tu clave en la línea 19.\n\nMás info en: https://elevenlabs.io/app/developers/api-keys');
            return;
        }

        const voiceName = isModelVoice ? modelVoice : userVoice;
        const voiceData = AVAILABLE_VOICES[voiceName];

        if (!voiceData) {
            console.error('ChatReader: Voice not found:', voiceName);
            return;
        }

        const volume = isModelVoice ?
            (modelVolumeSlider ? parseFloat(modelVolumeSlider.value) : 1.0) :
            (userVolumeSlider ? parseFloat(userVolumeSlider.value) : 1.0);

        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceData.id}`;

        const requestData = {
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.0,
                use_speaker_boost: true
            }
        };

        console.log(`ChatReader: Requesting TTS for: "${text.substring(0, 30)}..." with voice: ${voiceData.name}`);

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            data: JSON.stringify(requestData),
            responseType: 'blob',
            onload: function(response) {
                if (response.status === 200) {
                    console.log('ChatReader: Audio generated successfully');
                    audioQueue.push({
                        blob: response.response,
                        volume: volume
                    });

                    if (!isPlaying) {
                        playNextInQueue();
                    }
                } else if (response.status === 401) {
                    console.error('ChatReader: Invalid API key');
                    alert('❌ Clave inválida. Verifica la configuración del script.');
                } else if (response.status === 429) {
                    console.error('ChatReader: Rate limit exceeded');
                    alert('⚠️ Has excedido el límite de uso gratuito.\n\nEspera hasta el próximo mes o actualiza tu plan.');
                } else {
                    console.error('ChatReader: API error:', response.status, response.statusText);
                    alert(`❌ Error: ${response.status}\n\nRevisa la consola para más detalles.`);
                }
            },
            onerror: function(error) {
                console.error('ChatReader: Request error:', error);
                alert('❌ Error de conexión. Verifica tu internet y la configuración de Tampermonkey.');
            }
        });
    }

    // Inject CSS
    function injectStyles() {
        if (document.getElementById('chatReaderStyles')) return; // Ya existe
        
        const style = document.createElement('style');
        style.id = 'chatReaderStyles';
        style.type = 'text/css';
        style.innerHTML = `
            #chatReaderPanel {
                position: fixed;
                top: 50%;
                right: -290px;
                transform: translateY(-50%);
                width: 270px;
                background-color: rgba(0, 0, 0, 0.9);
                border-radius: 8px 0 0 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                font-family: Arial, sans-serif;
                color: white;
                transition: right 0.3s ease-in-out;
                z-index: 99999;
            }

            #chatReaderPanel.open {
                right: 0;
            }

            #chatReaderToggleButton {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%) rotate(270deg);
                transform-origin: bottom right;
                background-color: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border: none;
                border-radius: 8px 8px 0 0;
                cursor: pointer;
                font-size: 13px;
                z-index: 100000;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                transition: right 0.3s ease-in-out;
            }

            #chatReaderPanel.open + #chatReaderToggleButton {
                right: 270px;
            }

            #chatReaderPanel button {
                padding: 8px 12px;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
            }

            #chatReaderPanel select {
                width: 100%;
                padding: 6px;
                border-radius: 3px;
                border: 1px solid #555;
                background-color: #222;
                color: white;
                font-size: 12px;
                cursor: pointer;
            }

            #chatReaderPanel select option {
                background-color: #222;
                color: white;
            }

            #chatReaderPanel .volume-control-wrapper {
                display: flex;
                flex-direction: column;
                gap: 5px;
                font-size: 12px;
            }

            #chatReaderPanel #enableButton.enabled {
                background-color: #28a745;
            }

            #chatReaderPanel #enableButton.disabled {
                background-color: #dc3545;
            }

            #chatReaderPanel input[type="range"] {
                width: 100%;
                cursor: pointer;
            }

            #chatReaderPanel .test-button {
                margin-top: 5px;
                padding: 6px 10px;
                background-color: #007bff;
                font-size: 11px;
            }

            #chatReaderPanel .test-button:hover {
                background-color: #0056b3;
            }

            #chatReaderPanel .voice-section {
                display: flex;
                flex-direction: column;
                gap: 5px;
                padding: 10px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 5px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            #chatReaderPanel .voice-section label {
                font-size: 11px;
                color: #4CAF50;
                font-weight: bold;
                margin-bottom: 3px;
            }
        `;
        document.head.appendChild(style);
    }

    function updateToggleButtonState() {
        if (enableButton) {
            if (isSpeechEnabled) {
                enableButton.textContent = 'Deshabilitar Lectura';
                enableButton.classList.remove('disabled');
                enableButton.classList.add('enabled');
            } else {
                enableButton.textContent = 'Habilitar Lectura';
                enableButton.classList.remove('enabled');
                enableButton.classList.add('disabled');
            }
        }
    }

    function createControls() {
        // EVITAR CREAR MÚLTIPLES VECES
        if (controlsContainer && document.body.contains(controlsContainer)) {
            updateToggleButtonState();
            return;
        }

        injectStyles();

        controlsContainer = document.createElement('div');
        controlsContainer.id = 'chatReaderPanel';

        enableButton = document.createElement('button');
        enableButton.id = 'enableButton';
        updateToggleButtonState();
        enableButton.onclick = () => {
            isSpeechEnabled = !isSpeechEnabled;
            updateToggleButtonState();
            if (isSpeechEnabled) {
                console.log('ChatReader: Speech enabled.');
                if (currentChatContainer) {
                    startChatMessagesObserver(currentChatContainer);
                    setTimeout(() => processNewMessages(currentChatContainer, true), 100);
                }
            } else {
                audioQueue = [];
                console.log('ChatReader: Speech disabled.');
            }
        };

        // Sección Modelo (Femenina)
        const modelSection = document.createElement('div');
        modelSection.className = 'voice-section';

        const modelLabel = document.createElement('label');
        modelLabel.textContent = '👩 VOZ MODELO (FEMENINA)';

        modelVoiceSelect = document.createElement('select');
        Object.entries(AVAILABLE_VOICES).forEach(([key, voice]) => {
            if (voice.gender === 'female') {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = voice.name;
                if (key === modelVoice) option.selected = true;
                modelVoiceSelect.appendChild(option);
            }
        });
        modelVoiceSelect.onchange = (e) => {
            modelVoice = e.target.value;
            localStorage.setItem('chatReaderModelVoice', modelVoice);
            console.log('Model voice changed to:', modelVoice);
        };

        const modelVolWrapper = document.createElement('div');
        modelVolWrapper.className = 'volume-control-wrapper';
        const modelVolLabel = document.createElement('span');
        let initialModelVol = parseFloat(localStorage.getItem('chatReaderModelVolume') || '1');
        modelVolLabel.textContent = `Volumen: ${Math.round(initialModelVol * 100)}%`;
        modelVolumeSlider = document.createElement('input');
        modelVolumeSlider.type = 'range';
        modelVolumeSlider.min = '0';
        modelVolumeSlider.max = '1';
        modelVolumeSlider.step = '0.05';
        modelVolumeSlider.value = initialModelVol;
        modelVolumeSlider.oninput = (e) => {
            const vol = parseFloat(e.target.value);
            modelVolLabel.textContent = `Volumen: ${Math.round(vol * 100)}%`;
            localStorage.setItem('chatReaderModelVolume', vol);
        };
        modelVolWrapper.appendChild(modelVolLabel);
        modelVolWrapper.appendChild(modelVolumeSlider);

        const modelTestBtn = document.createElement('button');
        modelTestBtn.className = 'test-button';
        modelTestBtn.textContent = '🔊 Probar Voz';
        modelTestBtn.onclick = () => {
            speakWithElevenLabs('Hola, soy la voz del modelo', true, true);
        };

        modelSection.appendChild(modelLabel);
        modelSection.appendChild(modelVoiceSelect);
        modelSection.appendChild(modelVolWrapper);
        modelSection.appendChild(modelTestBtn);

        // Sección Usuario (Masculina)
        const userSection = document.createElement('div');
        userSection.className = 'voice-section';

        const userLabel = document.createElement('label');
        userLabel.textContent = '👨 VOZ USUARIO (MASCULINA)';

        userVoiceSelect = document.createElement('select');
        Object.entries(AVAILABLE_VOICES).forEach(([key, voice]) => {
            if (voice.gender === 'male') {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = voice.name;
                if (key === userVoice) option.selected = true;
                userVoiceSelect.appendChild(option);
            }
        });
        userVoiceSelect.onchange = (e) => {
            userVoice = e.target.value;
            localStorage.setItem('chatReaderUserVoice', userVoice);
            console.log('User voice changed to:', userVoice);
        };

        const userVolWrapper = document.createElement('div');
        userVolWrapper.className = 'volume-control-wrapper';
        const userVolLabel = document.createElement('span');
        let initialUserVol = parseFloat(localStorage.getItem('chatReaderUserVolume') || '1');
        userVolLabel.textContent = `Volumen: ${Math.round(initialUserVol * 100)}%`;
        userVolumeSlider = document.createElement('input');
        userVolumeSlider.type = 'range';
        userVolumeSlider.min = '0';
        userVolumeSlider.max = '1';
        userVolumeSlider.step = '0.05';
        userVolumeSlider.value = initialUserVol;
        userVolumeSlider.oninput = (e) => {
            const vol = parseFloat(e.target.value);
            userVolLabel.textContent = `Volumen: ${Math.round(vol * 100)}%`;
            localStorage.setItem('chatReaderUserVolume', vol);
        };
        userVolWrapper.appendChild(userVolLabel);
        userVolWrapper.appendChild(userVolumeSlider);

        const userTestBtn = document.createElement('button');
        userTestBtn.className = 'test-button';
        userTestBtn.textContent = '🔊 Probar Voz';
        userTestBtn.onclick = () => {
            speakWithElevenLabs('Hola, soy la voz del usuario', false, true);
        };

        userSection.appendChild(userLabel);
        userSection.appendChild(userVoiceSelect);
        userSection.appendChild(userVolWrapper);
        userSection.appendChild(userTestBtn);

        controlsContainer.appendChild(enableButton);
        controlsContainer.appendChild(modelSection);
        controlsContainer.appendChild(userSection);

        document.body.appendChild(controlsContainer);

        toggleButton = document.createElement('button');
        toggleButton.id = 'chatReaderToggleButton';
        toggleButton.textContent = 'Chat Reader';
        toggleButton.onclick = () => {
            controlsContainer.classList.toggle('open');
        };
        document.body.appendChild(toggleButton);
        
        console.log('ChatReader: Panel de control creado correctamente');
    }

    function removeControls() {
        if (controlsContainer && document.body.contains(controlsContainer)) {
            document.body.removeChild(controlsContainer);
            controlsContainer = null;
        }
        if (toggleButton && document.body.contains(toggleButton)) {
            document.body.removeChild(toggleButton);
            toggleButton = null;
        }
        audioQueue = [];
        isSpeechEnabled = false;
        currentChatContainer = null;
        lastReadMessageCount = 0;
    }

    function handleChatContainer() {
        const foundChatContainer = document.querySelector('[class*="ChatBlockLegacy__ChatBlockContainer"]');
        
        if (foundChatContainer) {
            if (foundChatContainer !== currentChatContainer) {
                console.log('ChatReader: Chat container encontrado');
                currentChatContainer = foundChatContainer;
                lastReadMessageCount = 0;
                if (chatObserver) {
                    chatObserver.disconnect();
                    chatObserver = null;
                }
                createControls(); // Solo crear cuando cambia el container
            }
        } else {
            if (currentChatContainer || controlsContainer) {
                console.log('ChatReader: Chat container no encontrado, removiendo controles');
                removeControls();
            }
        }
    }

    function observeBodyForChatContainer() {
        if (bodyObserver) {
            bodyObserver.disconnect();
        }
        
        // OPCIÓN MÁS RESTRICTIVA: Solo observar cambios directos en body, no subtree
        bodyObserver = new MutationObserver((mutations) => {
            // Solo procesar si hay cambios relevantes
            const hasRelevantChanges = mutations.some(mutation => 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === 1 && // Es un elemento
                    (node.className?.includes('ChatBlock') || 
                     node.querySelector?.('[class*="ChatBlock"]'))
                )
            );
            
            if (hasRelevantChanges) {
                handleChatContainer();
            }
        });
        
        bodyObserver.observe(document.body, { 
            childList: true, 
            subtree: false // CLAVE: No observar todo el árbol
        });
    }

    function startChatMessagesObserver(chatContainer) {
        if (!chatContainer) return;
        if (chatObserver) {
            chatObserver.disconnect();
        }

        chatObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    if (isSpeechEnabled) {
                        setTimeout(() => processNewMessages(currentChatContainer, false), 300);
                    }
                }
            });
        });

        chatObserver.observe(chatContainer, { childList: true, subtree: false });
        console.log('ChatReader: Observer de mensajes iniciado');
    }

    function processNewMessages(chatContainer, isInitialLoad = false) {
        if (!isSpeechEnabled && !isInitialLoad) return;
        if (!chatContainer || chatContainer !== currentChatContainer) return;

        const messages = Array.from(chatContainer.children).filter(child =>
            child.tagName === 'DIV' &&
            !child.className.includes('Notification__Container') &&
            child.querySelector('div.sc-aXZVg')
        );

        let startIndex = lastReadMessageCount;

        if (isInitialLoad) {
            if (messages.length > 0) {
                startIndex = messages.length - 1;
            } else {
                lastReadMessageCount = messages.length;
                return;
            }
        }

        if (messages.length > lastReadMessageCount) {
            for (let i = startIndex; i < messages.length; i++) {
                const messageWrapperDiv = messages[i];
                const messageDiv = messageWrapperDiv.querySelector('div.sc-aXZVg');

                if (!messageDiv) continue;

                const messageTextSpan = messageDiv.querySelector('span.sc-eqUAAy');
                const authorSpan = messageDiv.querySelector('span.sc-gEvEer');

                if (messageTextSpan && authorSpan) {
                    const messageText = messageTextSpan.textContent.trim();
                    const isModelMessage = authorSpan.querySelector('svg[viewBox="0 0 24 24"]') !== null;

                    if (messageText) {
                        console.log(`ChatReader: Processing ${isModelMessage ? 'model' : 'user'} message:`, messageText);
                        speakWithElevenLabs(messageText, isModelMessage, false);
                    }
                }
            }
            lastReadMessageCount = messages.length;
        }
    }

    // Main execution
    console.log('ChatReader: Iniciando script...');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            observeBodyForChatContainer();
            handleChatContainer(); // Verificar inmediatamente
        });
    } else {
        observeBodyForChatContainer();
        handleChatContainer(); // Verificar inmediatamente
    }

    let lastUrl = location.href;
    urlCheckInterval = setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            removeControls();
            setTimeout(handleChatContainer, 500);
        }
    }, 500);

    chatContainerCheckInterval = setInterval(() => {
        handleChatContainer();
    }, 2000); // Aumentado a 2 segundos para reducir checks

    window.addEventListener('beforeunload', () => {
        if (chatObserver) chatObserver.disconnect();
        if (bodyObserver) bodyObserver.disconnect();
        if (urlCheckInterval) clearInterval(urlCheckInterval);
        if (chatContainerCheckInterval) clearInterval(chatContainerCheckInterval);
    });
    
    console.log('ChatReader: Script inicializado correctamente');
})();