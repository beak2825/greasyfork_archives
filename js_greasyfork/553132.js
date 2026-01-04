// ==UserScript==
// @name         Speech2Text Gemini + Speech Cleaner
// @namespace    fiverr.com/web_coder_nsd
// @version      2.0
// @description  Voice recording and speech-to-text using Google Gemini API for Fiverr, Upwork, and WhatsApp
// @author       noushadBug
// @license      MIT
// @match        https://www.fiverr.com/inbox/*
// @match        https://www.upwork.com/ab/messages/*
// @match        https://web.whatsapp.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553132/Speech2Text%20Gemini%20%2B%20Speech%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/553132/Speech2Text%20Gemini%20%2B%20Speech%20Cleaner.meta.js
// ==/UserScript==

/*
 * Speech2Text Gemini - Voice Recording and Transcription
 *
 * SETUP INSTRUCTIONS:
 * 1. Get your Gemini API key from: https://aistudio.google.com/app/apikey
 * 2. Replace 'YOUR_GEMINI_API_KEY_HERE' in the CONFIG object below with your actual API key
 * 3. Save and install the userscript in Tampermonkey
 *
 * FEATURES:
 * - Record voice using your microphone
 * - Upload audio to Google Gemini for transcription
 * - Auto-fill textareas on any webpage
 * - Undo functionality for filled textareas
 * - Copy transcribed text to clipboard
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        GEMINI_API_KEY: 'AIzaSyAYPdEJK597aWlSDWKhv5l6FEv6Rm_azVg', // Replace with your Gemini API key
        GEMINI_UPLOAD_URL: 'https://generativelanguage.googleapis.com/upload/v1beta/files',
        GEMINI_GENERATE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
        RECORDING_MIME_TYPE: 'audio/webm;codecs=opus'
    };

    // Gemini Client Class for text cleaning
    class GeminiClient {
        constructor() {
            this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
            this.primaryModel = 'gemini-2.0-flash';
            this.fallbackModel = 'gemini-1.5-flash';
        }

        async init() {
            let apiKey = localStorage.getItem('gemini_api_key');
            if (!apiKey) {
                apiKey = prompt('Please enter your Gemini API key:');
                if (!apiKey) {
                    throw new Error('API key is required');
                }
                localStorage.setItem('gemini_api_key', apiKey);
            }
            this.apiKey = apiKey;
        }

        async fetchFromModel(model, prompt) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    }),
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            // Create a response-like object
                            const responseObj = {
                                ok: true,
                                status: response.status,
                                json: () => Promise.resolve(JSON.parse(response.responseText))
                            };
                            resolve(responseObj);
                        } else {
                            reject(new Error(`HTTP error! status: ${response.status}`));
                        }
                    },
                    onerror: function (error) {
                        reject(new Error('Network error: ' + error.message));
                    }
                });
            });
        }

        async generateContent(prompt) {
            if (!this.apiKey) {
                await this.init();
            }

            try {
                // Try primary model
                let response = await this.fetchFromModel(this.primaryModel, prompt);

                // If rate-limited, switch to fallback model
                if (response.status === 429) {
                    console.warn(`Rate limit on ${this.primaryModel}, switching to ${this.fallbackModel}...`);
                    response = await this.fetchFromModel(this.fallbackModel, prompt);
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || '[No response text]';

            } catch (error) {
                console.error('Error calling Gemini API:', error);
                throw error;
            }
        }

        async cleanTranscript(transcript) {
            const prompt = `Please clean and improve this transcript by:
1. Removing all filler words (um, uh, like, you know, etc.)
2. Fixing grammar and sentence structure
3. Adding proper punctuation (periods, commas, question marks, etc.)
4. Making it sound natural and professional
5. Keeping the original meaning intact

Transcript: "${transcript}"

Return only the cleaned text without any additional commentary:`;

            return await this.generateContent(prompt);
        }
    }

    // Global variables
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    let recordingStartTime = null;
    let lastFilledTextareas = [];
    let geminiClient = new GeminiClient();
    let mutationObserver = null;

    // Platform detection
    function getCurrentPlatform() {
        const hostname = window.location.hostname;
        if (hostname.includes('fiverr.com')) return 'fiverr';
        if (hostname.includes('upwork.com')) return 'upwork';
        if (hostname.includes('web.whatsapp.com')) return 'whatsapp';
        return 'unknown';
    }

    // Platform-specific selectors
    const PLATFORM_SELECTORS = {
        fiverr: {
            textarea: 'textarea[placeholder*="message"], textarea[placeholder*="Message"], textarea[data-testid*="message"]',
            container: 'textarea[placeholder*="message"], textarea[placeholder*="Message"], textarea[data-testid*="message"]'
        },
        upwork: {
            textarea: '[contenteditable="true"] p',
            container: '[contenteditable="true"]'
        },
        whatsapp: {
            textarea: 'footer div[contenteditable="true"][data-lexical-editor="true"]',
            container: 'footer div[contenteditable="true"][data-lexical-editor="true"]'
        }
    };

    // Check if text input elements are available and create button
    function checkAndCreateButton() {
        const platform = getCurrentPlatform();
        const selectors = PLATFORM_SELECTORS[platform];

        if (!selectors) {
            console.log('Unsupported platform:', platform);
            return false;
        }

        // Check if button already exists
        const existingButton = document.getElementById('voice-record-btn');
        if (existingButton) {
            return true; // Button already exists
        }

        // Find the textarea/input element
        const textElement = document.querySelector(selectors.textarea);
        const containerElement = document.querySelector(selectors.container);

        if (!textElement || !containerElement) {
            return false; // Elements not found yet
        }

        // Create voice recording button
        const voiceButton = document.createElement('button');
        voiceButton.id = 'voice-record-btn';
        voiceButton.innerHTML = '🎤';
        voiceButton.title = 'Voice to Text (Click to record)';

        // Platform-specific styling
        const platformStyles = {
            fiverr: {
                background: '#1dbf73',
                hoverBackground: '#17a85b',
                position: 'absolute',
                right: '45px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '30px',
                height: '30px'
            },
            upwork: {
                background: '#14a800',
                hoverBackground: '#0f7d00',
                position: 'absolute',
                right: '60px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '30px',
                height: '30px'
            },
            whatsapp: {
                background: '#25d366',
                hoverBackground: '#1da851',
                position: 'absolute',
                right: '80px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '30px',
                height: '30px'
            }
        };

        const style = platformStyles[platform] || platformStyles.fiverr;

        voiceButton.style.cssText = `
            position: ${style.position};
            right: ${style.right};
            top: ${style.top};
            transform: ${style.transform};
            width: ${style.width || '40px'};
            height: ${style.height || '40px'};
            border: none;
            border-radius: 50%;
            background: ${style.background};
            color: white;
            font-size: ${style.width === '30px' ? '14px' : '18px'};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        // Add hover effect
        voiceButton.addEventListener('mouseenter', () => {
            voiceButton.style.background = style.hoverBackground;
            voiceButton.style.transform = `${style.transform} scale(1.1)`;
        });

        voiceButton.addEventListener('mouseleave', () => {
            voiceButton.style.background = style.background;
            voiceButton.style.transform = style.transform;
        });

        // Find the appropriate container and make it relative
        if (platform === 'fiverr') {
            var textareaContainer = containerElement.closest('div') || containerElement;
        }
        if (platform === 'whatsapp') {
            textareaContainer = containerElement.closest('div').parentElement.parentElement
        }
        if (platform === 'upwork') {
            textareaContainer = containerElement.closest('div').parentElement.parentElement.parentElement
        }
        if (textareaContainer) {
            textareaContainer.style.position = 'relative';
            textareaContainer.appendChild(voiceButton);
        }

        // Event listener
        voiceButton.addEventListener('click', toggleRecording);

        console.log(`Voice button created for ${platform}`);
        return true;
    }

    // Setup MutationObserver to watch for text input elements
    function setupMutationObserver() {
        // Disconnect existing observer
        if (mutationObserver) {
            mutationObserver.disconnect();
        }

        // Create new observer
        mutationObserver = new MutationObserver((mutations) => {
            let shouldCheck = false;

            mutations.forEach((mutation) => {
                // Check if nodes were added
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
                // Check if attributes changed (for contenteditable elements)
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'contenteditable' ||
                        mutation.attributeName === 'class' ||
                        mutation.attributeName === 'data-testid')) {
                    shouldCheck = true;
                }
            });

            if (shouldCheck) {
                // Debounce the check to avoid excessive calls
                clearTimeout(window.voiceButtonCheckTimeout);
                window.voiceButtonCheckTimeout = setTimeout(() => {
                    checkAndCreateButton();
                }, 500);
            }
        });

        // Start observing
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['contenteditable', 'class', 'data-testid', 'placeholder']
        });

        console.log('MutationObserver started');
    }

    // Initial check and setup
    function initializeVoiceButton() {
        // Try to create button immediately
        if (checkAndCreateButton()) {
            console.log('Voice button created immediately');
        } else {
            console.log('Text input not found, setting up MutationObserver');
            setupMutationObserver();
        }
    }

    // Cleanup function
    function cleanup() {
        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
        }

        const existingButton = document.getElementById('voice-record-btn');
        if (existingButton) {
            existingButton.remove();
        }

        if (window.voiceButtonCheckTimeout) {
            clearTimeout(window.voiceButtonCheckTimeout);
        }
    }

    // Toggle recording state
    async function toggleRecording() {
        const voiceButton = document.getElementById('voice-record-btn');

        // Check if API key is set
        if (CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            alert('Please set your Gemini API key first!');
            return;
        }

        if (!isRecording) {
            try {
                await startRecording();
            } catch (error) {
                console.error('Error starting recording:', error);
                alert('Error: ' + error.message);
            }
        } else {
            stopRecording();
        }
    }

    // Start recording
    async function startRecording() {
        const voiceButton = document.getElementById('voice-record-btn');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            mediaRecorder = new MediaRecorder(stream, {
                mimeType: CONFIG.RECORDING_MIME_TYPE
            });

            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                processRecording();
                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start(100); // Collect data every 100ms
            isRecording = true;
            recordingStartTime = Date.now();

            voiceButton.innerHTML = '⏹️';
            voiceButton.style.background = '#e74c3c';
            voiceButton.title = 'Stop Recording';

        } catch (error) {
            throw new Error('Microphone access denied or not available');
        }
    }

    // Stop recording
    function stopRecording() {
        const voiceButton = document.getElementById('voice-record-btn');

        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;

            voiceButton.innerHTML = '🎤';
            voiceButton.style.background = '#1dbf73';
            voiceButton.title = 'Voice to Text (Click to record)';
        }
    }

    // Process the recorded audio
    async function processRecording() {
        const voiceButton = document.getElementById('voice-record-btn');

        try {
            if (audioChunks.length === 0) {
                throw new Error('No audio data recorded');
            }

            // Show processing state
            voiceButton.innerHTML = '⏳';
            voiceButton.style.background = '#f39c12';
            voiceButton.title = 'Processing...';

            // Create audio blob
            const audioBlob = new Blob(audioChunks, { type: CONFIG.RECORDING_MIME_TYPE });

            // Convert to WAV format for better API compatibility
            const wavBlob = await convertToWav(audioBlob);

            // Send to Gemini API for transcription
            const rawTranscription = await transcribeAudio(wavBlob);

            // Clean the transcript using Gemini
            const cleanedTranscription = await geminiClient.cleanTranscript(rawTranscription);

            // Find and fill the platform-specific textarea
            const platform = getCurrentPlatform();
            const selectors = PLATFORM_SELECTORS[platform];
            const textElement = document.querySelector(selectors.textarea);

            if (textElement) {
                // Store original value for undo
                const originalValue = getTextContent(textElement);

                // Insert text based on platform
                insertTextToElement(textElement, cleanedTranscription, platform);

                // Store for undo functionality
                lastFilledTextareas = [{
                    element: textElement,
                    originalValue: originalValue,
                    platform: platform
                }];

                // Show success state
                voiceButton.innerHTML = '✅';
                voiceButton.style.background = '#27ae60';
                voiceButton.title = 'Transcription complete!';

                // Reset after 2 seconds
                setTimeout(() => {
                    voiceButton.innerHTML = '🎤';
                    const platformStyles = {
                        fiverr: '#1dbf73',
                        upwork: '#14a800',
                        whatsapp: '#25d366'
                    };
                    voiceButton.style.background = platformStyles[platform] || '#1dbf73';
                    voiceButton.title = 'Voice to Text (Click to record)';
                }, 2000);

            } else {
                throw new Error(`Could not find ${platform} textarea`);
            }

        } catch (error) {
            console.error('Error processing recording:', error);

            // Show error state
            voiceButton.innerHTML = '❌';
            voiceButton.style.background = '#e74c3c';
            voiceButton.title = 'Error: ' + error.message;

            // Reset after 3 seconds
            setTimeout(() => {
                voiceButton.innerHTML = '🎤';
                const platform = getCurrentPlatform();
                const platformStyles = {
                    fiverr: '#1dbf73',
                    upwork: '#14a800',
                    whatsapp: '#25d366'
                };
                voiceButton.style.background = platformStyles[platform] || '#1dbf73';
                voiceButton.title = 'Voice to Text (Click to record)';
            }, 3000);
        }
    }

    // Convert audio blob to WAV format
    async function convertToWav(audioBlob) {
        return new Promise((resolve) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const fileReader = new FileReader();

            fileReader.onload = async () => {
                try {
                    const arrayBuffer = fileReader.result;
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                    // Convert to WAV
                    const wavBuffer = audioBufferToWav(audioBuffer);
                    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
                    resolve(wavBlob);
                } catch (error) {
                    // If conversion fails, use original blob
                    resolve(audioBlob);
                }
            };

            fileReader.readAsArrayBuffer(audioBlob);
        });
    }

    // Convert AudioBuffer to WAV
    function audioBufferToWav(buffer) {
        const length = buffer.length;
        const sampleRate = buffer.sampleRate;
        const arrayBuffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(arrayBuffer);

        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * 2, true);

        // Convert float samples to 16-bit PCM
        const channelData = buffer.getChannelData(0);
        let offset = 44;
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, channelData[i]));
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }

        return arrayBuffer;
    }

    // Transcribe audio using Gemini API
    async function transcribeAudio(audioBlob) {
        try {
            // Step 1: Upload the audio file to Gemini
            const fileUri = await uploadAudioToGemini(audioBlob);

            // Step 2: Generate content using the uploaded file
            const transcription = await generateContentWithGemini(fileUri, audioBlob.type);

            return transcription;
        } catch (error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
    }

    // Upload audio file to Gemini and get file URI
    async function uploadAudioToGemini(audioBlob) {
        const displayName = `audio_${Date.now()}`;
        const fileSize = audioBlob.size;

        // Step 1: Start resumable upload
        const uploadStartResponse = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.GEMINI_UPLOAD_URL,
                headers: {
                    'x-goog-api-key': CONFIG.GEMINI_API_KEY,
                    'X-Goog-Upload-Protocol': 'resumable',
                    'X-Goog-Upload-Command': 'start',
                    'X-Goog-Upload-Header-Content-Length': fileSize.toString(),
                    'X-Goog-Upload-Header-Content-Type': audioBlob.type,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    file: {
                        display_name: displayName
                    }
                }),
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        const responseObj = {
                            ok: true,
                            status: response.status,
                            headers: {
                                get: (name) => {
                                    // GM_xmlhttpRequest stores headers in responseHeaders
                                    const headers = response.responseHeaders || '';
                                    console.log('Raw response headers:', headers);
                                    const lines = headers.split('\r\n');
                                    console.log('Header lines:', lines);
                                    for (let line of lines) {
                                        const colonIndex = line.indexOf(':');
                                        if (colonIndex > 0) {
                                            const key = line.substring(0, colonIndex).trim();
                                            const value = line.substring(colonIndex + 1).trim();
                                            console.log(`Header: ${key} = ${value}`);
                                            if (key.toLowerCase() === name.toLowerCase()) {
                                                console.log(`Found matching header: ${key} = ${value}`);
                                                return value;
                                            }
                                        }
                                    }
                                    console.log(`Header not found: ${name}`);
                                    return null;
                                }
                            },
                            text: () => Promise.resolve(response.responseText)
                        };
                        resolve(responseObj);
                    } else {
                        reject(new Error(`Upload start failed: ${response.status} - ${response.responseText}`));
                    }
                },
                onerror: function (error) {
                    reject(new Error('Network error: ' + error.message));
                }
            });
        });

        if (!uploadStartResponse.ok) {
            const errorText = await uploadStartResponse.text();
            throw new Error(`Upload start failed: ${uploadStartResponse.status} - ${errorText}`);
        }

        // Get upload URL from response headers
        console.log('Upload start response headers:', uploadStartResponse.headers);
        console.log('Response headers raw:', uploadStartResponse.headers.get('X-Goog-Upload-URL'));

        const uploadUrl = uploadStartResponse.headers.get('X-Goog-Upload-URL');
        console.log('Extracted upload URL:', uploadUrl);

        let finalUploadUrl = uploadUrl;

        if (!uploadUrl) {
            // Try alternative header names
            const altUploadUrl = uploadStartResponse.headers.get('x-goog-upload-url') ||
                uploadStartResponse.headers.get('X-Goog-Upload-Url') ||
                uploadStartResponse.headers.get('upload-url');
            console.log('Alternative upload URL:', altUploadUrl);

            if (!altUploadUrl) {
                throw new Error('No upload URL received from Gemini. Response headers: ' + JSON.stringify(uploadStartResponse.headers));
            }
            finalUploadUrl = altUploadUrl;
        }

        // Step 2: Upload the actual file
        const uploadResponse = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: finalUploadUrl,
                headers: {
                    'Content-Length': fileSize.toString(),
                    'X-Goog-Upload-Offset': '0',
                    'X-Goog-Upload-Command': 'upload, finalize'
                },
                data: audioBlob,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        const responseObj = {
                            ok: true,
                            status: response.status,
                            json: () => Promise.resolve(JSON.parse(response.responseText))
                        };
                        resolve(responseObj);
                    } else {
                        reject(new Error(`File upload failed: ${response.status} - ${response.responseText}`));
                    }
                },
                onerror: function (error) {
                    reject(new Error('Network error: ' + error.message));
                }
            });
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`File upload failed: ${uploadResponse.status} - ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();
        return uploadResult.file.uri;
    }

    // Generate content using Gemini with the uploaded audio file
    async function generateContentWithGemini(fileUri, mimeType) {
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.GEMINI_GENERATE_URL,
                headers: {
                    'x-goog-api-key': CONFIG.GEMINI_API_KEY,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: "Please transcribe this audio file. Provide only the transcribed text without any additional commentary or formatting." },
                            {
                                file_data: {
                                    mime_type: mimeType,
                                    file_uri: fileUri
                                }
                            }
                        ]
                    }]
                }),
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        const responseObj = {
                            ok: true,
                            status: response.status,
                            json: () => Promise.resolve(JSON.parse(response.responseText))
                        };
                        resolve(responseObj);
                    } else {
                        reject(new Error(`Content generation failed: ${response.status} - ${response.responseText}`));
                    }
                },
                onerror: function (error) {
                    reject(new Error('Network error: ' + error.message));
                }
            });
        });

        const result = await response.json();

        // Extract text from Gemini response
        if (result.candidates && result.candidates.length > 0) {
            const candidate = result.candidates[0];
            if (candidate.content && candidate.content.parts) {
                const textParts = candidate.content.parts
                    .filter(part => part.text)
                    .map(part => part.text);
                return textParts.join(' ').trim();
            }
        }

        throw new Error('No transcription found in Gemini response');
    }

    // Get text content from different element types
    function getTextContent(element) {
        if (element.value !== undefined) {
            return element.value; // For textarea elements
        } else {
            return element.textContent || element.innerText || ''; // For contenteditable elements
        }
    }

    // Fiverr-specific text insertion with React state management
    function setText(text, removePrevValue = false) {
        const platform = getCurrentPlatform();
        if (platform !== 'fiverr') {
            return false; // Only for Fiverr
        }

        const selectors = PLATFORM_SELECTORS[platform];
        const input = document.querySelector(selectors.textarea);
        if (!input) return false;

        let lastValue = input.value;

        // Clear the previous value if removePrevValue is true
        if (removePrevValue) {
            input.value = '';
        }

        input.value += text; // Append the new text
        let event = new Event('input', { bubbles: true });
        // hack React15
        event.simulated = true;
        // hack React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        input.dispatchEvent(event);

        return true;
    }

    // WhatsApp-specific text insertion with Lexical editor support
    function writeTextToWhatsApp(text, triggerEnter = false) {
        const platform = getCurrentPlatform();
        if (platform !== 'whatsapp') {
            return false; // Only for WhatsApp
        }

        const inputDiv = document.querySelector('footer div[contenteditable="true"][data-lexical-editor="true"]');
        if (!inputDiv) {
            console.error('WhatsApp input box not found.');
            return false;
        }

        inputDiv.focus();
        inputDiv.innerHTML = '<p><br></p>';
        document.execCommand('insertText', false, text);
        inputDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
        inputDiv.dispatchEvent(new InputEvent('input', { bubbles: true }));
        inputDiv.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));

        if (triggerEnter && text.trim()) {
            inputDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            inputDiv.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
            setTimeout(() => writeTextToWhatsApp('', true), 300);
        }

        return true;
    }

    // Insert text into different element types
    function insertTextToElement(element, text, platform) {
        // Use Fiverr-specific setText function for better React compatibility
        if (platform === 'fiverr') {
            const success = setText(text, false); // false = don't remove previous text (concatenate)
            if (success) {
                return; // Successfully inserted using setText
            }
            // Fallback to regular method if setText fails
        }

        // Use WhatsApp-specific writeTextToWhatsApp function for Lexical editor
        if (platform === 'whatsapp') {
            const success = writeTextToWhatsApp(text, false); // false = don't trigger enter
            if (success) {
                return; // Successfully inserted using writeTextToWhatsApp
            }
            // Fallback to regular method if writeTextToWhatsApp fails
        }

        if (element.value !== undefined) {
            // For textarea elements (Fiverr fallback)
            const currentValue = element.value.trim();
            if (currentValue === '') {
                element.value = text;
            } else {
                element.value = currentValue + ' ' + text;
            }

            // Trigger events
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));

        } else {
            // For contenteditable elements (Upwork, WhatsApp)
            const currentText = element.textContent || element.innerText || '';
            const newText = currentText.trim() === '' ? text : currentText + ' ' + text;

            // Set text content
            element.textContent = newText;

            // For WhatsApp, we might need to trigger specific events
            if (platform === 'whatsapp') {
                // Focus the element first
                element.focus();

                // Create input event
                const inputEvent = new Event('input', { bubbles: true });
                element.dispatchEvent(inputEvent);

                // Create keyup event (WhatsApp listens for this)
                const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
                element.dispatchEvent(keyupEvent);
            } else {
                // For Upwork
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }

    // Undo the last textarea fill operation
    function undoLastFill() {
        if (lastFilledTextareas.length === 0) {
            alert('Nothing to undo!');
            return;
        }

        lastFilledTextareas.forEach((textareaInfo) => {
            try {
                if (textareaInfo.element && textareaInfo.originalValue !== undefined) {
                    if (textareaInfo.element.value !== undefined) {
                        // For textarea elements
                        textareaInfo.element.value = textareaInfo.originalValue;
                        textareaInfo.element.dispatchEvent(new Event('input', { bubbles: true }));
                        textareaInfo.element.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        // For contenteditable elements
                        textareaInfo.element.textContent = textareaInfo.originalValue;
                        textareaInfo.element.dispatchEvent(new Event('input', { bubbles: true }));
                        textareaInfo.element.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            } catch (error) {
                console.warn('Could not undo textarea:', error);
            }
        });

        lastFilledTextareas = [];
        alert('Undone last transcription!');
    }

    // Initialize the userscript
    function init() {
        // Check if browser supports required APIs
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error('This browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Edge.');
            return;
        }

        // Initialize Gemini client
        geminiClient.init().catch(error => {
            console.error('Failed to initialize Gemini client:', error);
        });

        // Initialize voice button with MutationObserver
        initializeVoiceButton();

        // Add keyboard shortcut for undo (Ctrl+Z)
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'z' && lastFilledTextareas.length > 0) {
                event.preventDefault();
                undoLastFill();
            }
        });

        // Add some styling for better integration
        const style = document.createElement('style');
        style.textContent = `
            #voice-record-btn {
                transition: all 0.3s ease !important;
            }
            #voice-record-btn:hover {
                transform: translateY(-50%) scale(1.1) !important;
            }
        `;
        document.head.appendChild(style);

        // Handle page navigation (for SPAs like WhatsApp)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                console.log('Page navigation detected, reinitializing...');
                // Clean up existing observer and button
                cleanup();
                // Reinitialize after a short delay
                setTimeout(initializeVoiceButton, 1000);
            }
        }).observe(document, { subtree: true, childList: true });

        // Cleanup on page unload
        window.addEventListener('beforeunload', cleanup);
    }

    // Start the userscript
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
