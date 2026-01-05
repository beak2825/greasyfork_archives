// ==UserScript==
// @name         Mobile ChatGPT Overlay
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Mobile-friendly ChatGPT overlay with swipe gestures
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      openrouter.ai
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/558990/Mobile%20ChatGPT%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/558990/Mobile%20ChatGPT%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============ CONFIGURATION ============
    const CONFIG = {
        // Get your FREE key at: https://openrouter.ai/keys
        API_KEY: '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',
        API_URL: 'https://openrouter.ai/api/v1/chat/completions',
        
        // Free models (no credit card needed):
        // 'google/gemma-2-9b-it:free'
        // 'meta-llama/llama-3.1-8b-instruct:free'
        // 'mistralai/mistral-7b-instruct:free'
        // Paid models:
        // 'openai/gpt-4o-mini'
        // 'openai/gpt-3.5-turbo'
        MODEL: 'meta-llama/llama-3.1-8b-instruct:free',
        
        DRAWER_WIDTH: 85,
        SWIPE_THRESHOLD: 50,
        TAB_SIZE: 44,
        TIMEOUT: 30000 // 30 seconds timeout
    };

    // ============ STATE ============
    const state = {
        isOpen: false,
        conversationHistory: [],
        isLoading: false,
        currentThinkingEl: null
    };

    // ============ STYLES ============
    const injectStyles = () => {
        GM_addStyle(`
            #ai-drawer, #ai-drawer * {
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
            }
            
            #ai-tab {
                position: fixed;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: ${CONFIG.TAB_SIZE}px;
                height: 56px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 0 12px 12px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2147483646;
                cursor: pointer;
                box-shadow: 2px 2px 12px rgba(0,0,0,0.3);
                transition: transform 0.3s ease, left 0.3s ease;
                touch-action: manipulation;
            }
            #ai-tab.hidden { left: -${CONFIG.TAB_SIZE}px; }
            #ai-tab::after { content: '✨'; font-size: 20px; }
            #ai-tab:active { transform: translateY(-50%) scale(0.95); }
            
            #ai-backdrop {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 2147483646;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
                -webkit-backdrop-filter: blur(2px);
                backdrop-filter: blur(2px);
            }
            #ai-backdrop.visible { opacity: 1; visibility: visible; }
            
            #ai-drawer {
                position: fixed;
                top: 0; left: 0;
                width: ${CONFIG.DRAWER_WIDTH}vw;
                max-width: 360px;
                height: 100%;
                height: 100dvh;
                background: #1a1a2e;
                z-index: 2147483647;
                transform: translateX(-100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                flex-direction: column;
                box-shadow: 4px 0 24px rgba(0,0,0,0.4);
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
                overflow: hidden;
            }
            #ai-drawer.open { transform: translateX(0); }
            #ai-drawer.dragging { transition: none; }
            
            .ai-header {
                padding: 16px;
                padding-top: max(16px, env(safe-area-inset-top));
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }
            .ai-header-left { display: flex; align-items: center; gap: 10px; }
            .ai-header-title { font-size: 17px; font-weight: 600; }
            .ai-header-subtitle { font-size: 11px; opacity: 0.8; margin-top: 2px; }
            .ai-close-btn {
                width: 36px; height: 36px;
                background: rgba(255,255,255,0.2);
                border: none; border-radius: 50%;
                color: white; font-size: 20px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; touch-action: manipulation;
            }
            .ai-close-btn:active { background: rgba(255,255,255,0.3); }
            
            .ai-messages {
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: contain;
            }
            
            .ai-msg {
                max-width: 88%;
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 15px;
                line-height: 1.45;
                word-wrap: break-word;
                animation: msgIn 0.25s ease;
            }
            @keyframes msgIn {
                from { opacity: 0; transform: translateY(10px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .ai-msg.user {
                align-self: flex-end;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-bottom-right-radius: 6px;
            }
            .ai-msg.assistant {
                align-self: flex-start;
                background: #2d2d44;
                color: #e8e8f0;
                border-bottom-left-radius: 6px;
            }
            .ai-msg.thinking {
                background: #2d2d44;
                color: #888;
            }
            .ai-msg.thinking::after {
                content: '';
                animation: dots 1.5s infinite;
            }
            @keyframes dots {
                0%, 20% { content: '.'; }
                40% { content: '..'; }
                60%, 100% { content: '...'; }
            }
            .ai-msg.error {
                background: #ff6b6b;
                color: white;
            }
            
            .ai-msg pre {
                background: #0d0d1a;
                padding: 10px;
                border-radius: 8px;
                overflow-x: auto;
                margin: 8px 0;
                font-size: 13px;
            }
            .ai-msg code { font-family: 'SF Mono', Menlo, monospace; font-size: 13px; }
            .ai-msg p { margin: 0 0 8px 0; }
            .ai-msg p:last-child { margin: 0; }
            
            .ai-quick-actions {
                padding: 12px 16px;
                display: flex;
                gap: 8px;
                overflow-x: auto;
                flex-shrink: 0;
                border-top: 1px solid #2d2d44;
                -webkit-overflow-scrolling: touch;
            }
            .ai-quick-btn {
                flex-shrink: 0;
                padding: 8px 14px;
                background: #2d2d44;
                border: none;
                border-radius: 16px;
                color: #a8a8c0;
                font-size: 13px;
                cursor: pointer;
                touch-action: manipulation;
                transition: all 0.2s;
            }
            .ai-quick-btn:active { background: #3d3d5c; transform: scale(0.96); }
            
            .ai-input-area {
                padding: 12px;
                padding-bottom: max(12px, env(safe-area-inset-bottom));
                background: #12121f;
                border-top: 1px solid #2d2d44;
                flex-shrink: 0;
            }
            .ai-input-row { display: flex; gap: 10px; align-items: flex-end; }
            .ai-input {
                flex: 1;
                min-height: 44px;
                max-height: 120px;
                padding: 12px 16px;
                background: #1e1e32;
                border: 1px solid #3d3d5c;
                border-radius: 22px;
                color: #e8e8f0;
                font-size: 16px;
                resize: none;
                outline: none;
                font-family: inherit;
                line-height: 1.4;
                -webkit-appearance: none;
            }
            .ai-input:focus { border-color: #667eea; }
            .ai-input::placeholder { color: #666; }
            .ai-send-btn {
                width: 44px; height: 44px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none; border-radius: 50%;
                color: white; font-size: 18px;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0;
                touch-action: manipulation;
                transition: transform 0.2s, opacity 0.2s;
            }
            .ai-send-btn:active { transform: scale(0.92); }
            .ai-send-btn:disabled { opacity: 0.5; }
            
            .ai-swipe-handle {
                position: absolute;
                right: 0; top: 50%;
                transform: translateY(-50%);
                width: 20px; height: 60px;
                display: flex; align-items: center; justify-content: center;
            }
            .ai-swipe-handle::after {
                content: '';
                width: 4px; height: 40px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
            }
            
            .ai-footer {
                padding: 8px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #12121f;
                font-size: 11px;
                color: #666;
            }
            .ai-clear-btn {
                padding: 6px 12px;
                background: transparent;
                border: 1px solid #3d3d5c;
                border-radius: 12px;
                color: #888;
                font-size: 12px;
                cursor: pointer;
                touch-action: manipulation;
            }
            .ai-clear-btn:active { background: #2d2d44; }
            
            .ai-status {
                padding: 4px 8px;
                background: #2d2d44;
                border-radius: 8px;
                font-size: 10px;
            }
            .ai-status.error { background: #ff6b6b33; color: #ff6b6b; }
            .ai-status.success { background: #4ade8033; color: #4ade80; }
        `);
    };

    // ============ CREATE UI ============
    const createUI = () => {
        const backdrop = document.createElement('div');
        backdrop.id = 'ai-backdrop';
        document.body.appendChild(backdrop);
        
        const tab = document.createElement('div');
        tab.id = 'ai-tab';
        document.body.appendChild(tab);
        
        const drawer = document.createElement('div');
        drawer.id = 'ai-drawer';
        drawer.innerHTML = `
            <div class="ai-header">
                <div class="ai-header-left">
                    <div>
                        <div class="ai-header-title">✨ AI Assistant</div>
                        <div class="ai-header-subtitle">Swipe right to close</div>
                    </div>
                </div>
                <button class="ai-close-btn" id="ai-close">✕</button>
            </div>
            
            <div class="ai-messages" id="ai-messages">
                <div class="ai-msg assistant">
                    👋 Hi! I'm your AI assistant. Ask me anything!
                </div>
            </div>
            
            <div class="ai-quick-actions">
                <button class="ai-quick-btn" data-prompt="Explain this page to me">📄 Explain page</button>
                <button class="ai-quick-btn" data-prompt="Summarize the content">📝 Summarize</button>
                <button class="ai-quick-btn" data-prompt="Translate to English">🌐 Translate</button>
            </div>
            
            <div class="ai-footer">
                <span class="ai-status" id="ai-status">Ready</span>
                <button class="ai-clear-btn" id="ai-clear">Clear Chat</button>
            </div>
            
            <div class="ai-input-area">
                <div class="ai-input-row">
                    <textarea class="ai-input" id="ai-input" 
                              placeholder="Ask anything..." rows="1"></textarea>
                    <button class="ai-send-btn" id="ai-send">➤</button>
                </div>
            </div>
            
            <div class="ai-swipe-handle"></div>
        `;
        document.body.appendChild(drawer);
        
        setupEventListeners();
        setupTouchGestures();
    };

    // ============ HELPERS ============
    const setStatus = (text, type = '') => {
        const statusEl = document.getElementById('ai-status');
        if (statusEl) {
            statusEl.textContent = text;
            statusEl.className = 'ai-status ' + type;
        }
    };

    const removeThinking = () => {
        if (state.currentThinkingEl && state.currentThinkingEl.parentNode) {
            state.currentThinkingEl.remove();
        }
        state.currentThinkingEl = null;
    };

    // ============ EVENT LISTENERS ============
    const setupEventListeners = () => {
        const tab = document.getElementById('ai-tab');
        const backdrop = document.getElementById('ai-backdrop');
        const closeBtn = document.getElementById('ai-close');
        const clearBtn = document.getElementById('ai-clear');
        const sendBtn = document.getElementById('ai-send');
        const input = document.getElementById('ai-input');
        
        tab.addEventListener('click', () => openDrawer());
        tab.addEventListener('touchend', (e) => { e.preventDefault(); openDrawer(); });
        
        backdrop.addEventListener('click', () => closeDrawer());
        closeBtn.addEventListener('click', () => closeDrawer());
        clearBtn.addEventListener('click', () => clearChat());
        sendBtn.addEventListener('click', () => sendMessage());
        
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        document.querySelectorAll('.ai-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('ai-input').value = btn.dataset.prompt;
                sendMessage();
            });
        });
        
        document.getElementById('ai-messages').addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
    };

    // ============ TOUCH GESTURES ============
    const setupTouchGestures = () => {
        const drawer = document.getElementById('ai-drawer');
        const messages = document.getElementById('ai-messages');
        
        let startX = 0, startY = 0, currentX = 0;
        let isSwipe = false, direction = null;

        drawer.addEventListener('touchstart', (e) => {
            if (e.target.closest('.ai-messages') && messages.scrollHeight > messages.clientHeight) {
                startY = e.touches[0].clientY;
            }
            startX = e.touches[0].clientX;
            currentX = startX;
            isSwipe = false;
            direction = null;
            drawer.classList.add('dragging');
        }, { passive: true });

        drawer.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = Math.abs(touch.clientY - startY);
            
            if (direction === null && (Math.abs(deltaX) > 10 || deltaY > 10)) {
                direction = Math.abs(deltaX) > deltaY ? 'horizontal' : 'vertical';
            }
            
            if (direction === 'horizontal' && deltaX < 0) {
                isSwipe = true;
                currentX = touch.clientX;
                drawer.style.transform = `translateX(${Math.max(deltaX, -drawer.offsetWidth)}px)`;
                document.getElementById('ai-backdrop').style.opacity = 1 - Math.abs(deltaX) / drawer.offsetWidth;
            }
        }, { passive: true });

        drawer.addEventListener('touchend', () => {
            drawer.classList.remove('dragging');
            if (isSwipe) {
                if (currentX - startX < -CONFIG.SWIPE_THRESHOLD) {
                    closeDrawer();
                } else {
                    drawer.style.transform = '';
                    document.getElementById('ai-backdrop').style.opacity = '';
                }
            }
            isSwipe = false;
            direction = null;
        });

        let edgeStartX = 0;
        document.addEventListener('touchstart', (e) => {
            if (state.isOpen) return;
            if (e.touches[0].clientX < 20) edgeStartX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (state.isOpen || edgeStartX === 0) return;
            if (e.touches[0].clientX - edgeStartX > CONFIG.SWIPE_THRESHOLD) {
                openDrawer();
                edgeStartX = 0;
            }
        }, { passive: true });

        document.addEventListener('touchend', () => { edgeStartX = 0; });
    };

    // ============ DRAWER CONTROLS ============
    const openDrawer = () => {
        state.isOpen = true;
        const drawer = document.getElementById('ai-drawer');
        drawer.classList.add('open');
        drawer.style.transform = '';
        document.getElementById('ai-backdrop').classList.add('visible');
        document.getElementById('ai-backdrop').style.opacity = '';
        document.getElementById('ai-tab').classList.add('hidden');
        document.getElementById('ai-input').focus();
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        state.isOpen = false;
        const drawer = document.getElementById('ai-drawer');
        drawer.classList.remove('open');
        drawer.style.transform = '';
        document.getElementById('ai-backdrop').classList.remove('visible');
        document.getElementById('ai-backdrop').style.opacity = '';
        document.getElementById('ai-tab').classList.remove('hidden');
        document.body.style.overflow = '';
    };

    // ============ CHAT FUNCTIONS ============
    const sendMessage = async () => {
        if (state.isLoading) return;
        
        const input = document.getElementById('ai-input');
        const sendBtn = document.getElementById('ai-send');
        const message = input.value.trim();
        
        if (!message) return;
        
        input.value = '';
        input.style.height = 'auto';
        sendBtn.disabled = true;
        state.isLoading = true;
        
        addMessage('user', message);
        state.conversationHistory.push({ role: 'user', content: message });
        
        // Add thinking message
        state.currentThinkingEl = addMessage('assistant', '⏳ Thinking', 'thinking');
        setStatus('Sending...', '');
        
        try {
            const response = await callAPI();
            removeThinking();
            addMessage('assistant', response);
            state.conversationHistory.push({ role: 'assistant', content: response });
            setStatus('Ready', 'success');
        } catch (error) {
            console.error('AI Error:', error);
            removeThinking();
            addMessage('assistant', `❌ ${error.message}`, 'error');
            setStatus('Error', 'error');
        } finally {
            sendBtn.disabled = false;
            state.isLoading = false;
        }
    };

    const addMessage = (role, content, extraClass = '') => {
        const messagesEl = document.getElementById('ai-messages');
        const msgEl = document.createElement('div');
        msgEl.className = `ai-msg ${role} ${extraClass}`;
        msgEl.innerHTML = formatContent(content);
        messagesEl.appendChild(msgEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return msgEl;
    };

    const formatContent = (content) => {
        let html = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\n/g, '<br>');
        
        return html;
    };

    const clearChat = () => {
        removeThinking();
        document.getElementById('ai-messages').innerHTML = `
            <div class="ai-msg assistant">👋 Chat cleared! How can I help?</div>
        `;
        state.conversationHistory = [];
        state.isLoading = false;
        document.getElementById('ai-send').disabled = false;
        setStatus('Ready', 'success');
    };

    // ============ API CALL ============
    const callAPI = () => {
        return new Promise((resolve, reject) => {
            const messages = [
                { 
                    role: 'system', 
                    content: 'You are a helpful AI assistant. Be concise but thorough. Use markdown for code.'
                },
                ...state.conversationHistory.slice(-8)
            ];

            console.log('Sending to API:', CONFIG.API_URL);
            console.log('Model:', CONFIG.MODEL);
            console.log('Messages:', messages);

            const timeoutId = setTimeout(() => {
                reject(new Error('Request timed out after 30s'));
            }, CONFIG.TIMEOUT);

            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Mobile AI Chat'
                },
                data: JSON.stringify({
                    model: CONFIG.MODEL,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1024
                }),
                timeout: CONFIG.TIMEOUT,
                onload: function(response) {
                    clearTimeout(timeoutId);
                    console.log('API Response status:', response.status);
                    console.log('API Response:', response.responseText);
                    
                    try {
                        const data = JSON.parse(response.responseText);
                        
                        if (response.status !== 200) {
                            const errorMsg = data.error?.message || `HTTP ${response.status}`;
                            reject(new Error(errorMsg));
                            return;
                        }
                        
                        if (data.error) {
                            reject(new Error(data.error.message || 'API returned error'));
                            return;
                        }
                        
                        if (data.choices && data.choices[0] && data.choices[0].message) {
                            resolve(data.choices[0].message.content);
                        } else {
                            console.error('Unexpected response structure:', data);
                            reject(new Error('Unexpected API response format'));
                        }
                    } catch (e) {
                        console.error('Parse error:', e, response.responseText);
                        reject(new Error('Failed to parse API response'));
                    }
                },
                onerror: function(error) {
                    clearTimeout(timeoutId);
                    console.error('Network error:', error);
                    reject(new Error('Network error - check connection'));
                },
                ontimeout: function() {
                    clearTimeout(timeoutId);
                    reject(new Error('Request timed out'));
                }
            });
        });
    };

    // ============ INIT ============
    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    };

    const setup = () => {
        injectStyles();
        createUI();
        
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('🤖 Toggle AI Chat', () => {
                state.isOpen ? closeDrawer() : openDrawer();
            });
        }
        
        console.log('📱 Mobile AI Assistant ready!');
        console.log('Using model:', CONFIG.MODEL);
    };

    init();
})();