

// ==UserScript==
// @name         Mobile ChatGPT Overlay
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Mobile-friendly ChatGPT overlay with swipe gestures
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      openrouter.ai
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/558994/Mobile%20ChatGPT%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/558994/Mobile%20ChatGPT%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============ CONFIGURATION ============
    const CONFIG = {
        API_KEY: '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',
        API_URL: 'https://openrouter.ai/api/v1/chat/completions',
        
        // ✅ WORKING FREE MODELS (updated):
        MODEL: 'google/gemini-2.0-flash-exp:free',
        
        // Other free options:
        // 'google/gemini-2.0-flash-exp:free'
        // 'meta-llama/llama-3.2-3b-instruct:free'
        // 'qwen/qwen-2-7b-instruct:free'
        // 'huggingfaceh4/zephyr-7b-beta:free'
        
        // Cheap paid options:
        // 'openai/gpt-4o-mini' (very cheap, very good)
        // 'openai/gpt-3.5-turbo'
        
        DRAWER_WIDTH: 85,
        SWIPE_THRESHOLD: 50,
        TAB_SIZE: 44,
        TIMEOUT: 60000
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
            }
            .ai-send-btn:active { transform: scale(0.92); }
            .ai-send-btn:disabled { opacity: 0.5; }
            
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
            }
            .ai-clear-btn:active { background: #2d2d44; }
            
            .ai-model-select {
                background: #2d2d44;
                border: none;
                color: #a8a8c0;
                padding: 4px 8px;
                border-radius: 8px;
                font-size: 11px;
                cursor: pointer;
            }
            
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
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            .ai-msg.thinking { animation: pulse 1.5s infinite; }
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
                        <div class="ai-header-subtitle">Swipe left to close</div>
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
                <button class="ai-quick-btn" data-prompt="Explain this page to me">📄 Explain</button>
                <button class="ai-quick-btn" data-prompt="Summarize the content">📝 Summarize</button>
                <button class="ai-quick-btn" data-prompt="Help me with this">❓ Help</button>
            </div>
            
            <div class="ai-footer">
                <select class="ai-model-select" id="ai-model">
                    <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 (Free)</option>
                    <option value="google/gemma-2-9b-it:free">Gemma 2 9B (Free)</option>
                    <option value="qwen/qwen-2-7b-instruct:free">Qwen 2 7B (Free)</option>
                    <option value="openai/gpt-4o-mini">GPT-4o Mini (Paid)</option>
                    <option value="anthropic/claude-3-haiku">Claude Haiku (Paid)</option>
                </select>
                <button class="ai-clear-btn" id="ai-clear">Clear</button>
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
    const removeThinking = () => {
        if (state.currentThinkingEl) {
            state.currentThinkingEl.remove();
            state.currentThinkingEl = null;
        }
    };

    const getSelectedModel = () => {
        const select = document.getElementById('ai-model');
        return select ? select.value : CONFIG.MODEL;
    };

    // ============ EVENT LISTENERS ============
    const setupEventListeners = () => {
        document.getElementById('ai-tab').addEventListener('click', openDrawer);
        document.getElementById('ai-backdrop').addEventListener('click', closeDrawer);
        document.getElementById('ai-close').addEventListener('click', closeDrawer);
        document.getElementById('ai-clear').addEventListener('click', clearChat);
        document.getElementById('ai-send').addEventListener('click', sendMessage);
        
        const input = document.getElementById('ai-input');
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
    };

    // ============ TOUCH GESTURES ============
    const setupTouchGestures = () => {
        const drawer = document.getElementById('ai-drawer');
        let startX = 0, currentX = 0, isSwipe = false;

        drawer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentX = startX;
            isSwipe = false;
            drawer.classList.add('dragging');
        }, { passive: true });

        drawer.addEventListener('touchmove', (e) => {
            const deltaX = e.touches[0].clientX - startX;
            if (deltaX < 0) {
                isSwipe = true;
                currentX = e.touches[0].clientX;
                drawer.style.transform = `translateX(${Math.max(deltaX, -drawer.offsetWidth)}px)`;
                document.getElementById('ai-backdrop').style.opacity = 1 - Math.abs(deltaX) / drawer.offsetWidth;
            }
        }, { passive: true });

        drawer.addEventListener('touchend', () => {
            drawer.classList.remove('dragging');
            if (isSwipe && currentX - startX < -CONFIG.SWIPE_THRESHOLD) {
                closeDrawer();
            } else {
                drawer.style.transform = '';
                document.getElementById('ai-backdrop').style.opacity = '';
            }
        });

        // Edge swipe to open
        let edgeStartX = 0;
        document.addEventListener('touchstart', (e) => {
            if (!state.isOpen && e.touches[0].clientX < 25) {
                edgeStartX = e.touches[0].clientX;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!state.isOpen && edgeStartX > 0) {
                if (e.touches[0].clientX - edgeStartX > CONFIG.SWIPE_THRESHOLD) {
                    openDrawer();
                    edgeStartX = 0;
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', () => { edgeStartX = 0; });
    };

    // ============ DRAWER CONTROLS ============
    const openDrawer = () => {
        state.isOpen = true;
        document.getElementById('ai-drawer').classList.add('open');
        document.getElementById('ai-drawer').style.transform = '';
        document.getElementById('ai-backdrop').classList.add('visible');
        document.getElementById('ai-backdrop').style.opacity = '';
        document.getElementById('ai-tab').classList.add('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        state.isOpen = false;
        document.getElementById('ai-drawer').classList.remove('open');
        document.getElementById('ai-drawer').style.transform = '';
        document.getElementById('ai-backdrop').classList.remove('visible');
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
        
        state.currentThinkingEl = addMessage('assistant', '⏳ Thinking...', 'thinking');
        
        try {
            const response = await callAPI();
            removeThinking();
            addMessage('assistant', response);
            state.conversationHistory.push({ role: 'assistant', content: response });
        } catch (error) {
            removeThinking();
            addMessage('assistant', `❌ Error: ${error.message}`, 'error');
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
        return content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    };

    const clearChat = () => {
        removeThinking();
        document.getElementById('ai-messages').innerHTML = `
            <div class="ai-msg assistant">👋 Chat cleared!</div>
        `;
        state.conversationHistory = [];
        state.isLoading = false;
        document.getElementById('ai-send').disabled = false;
    };

    // ============ API CALL ============
    const callAPI = () => {
        return new Promise((resolve, reject) => {
            const model = getSelectedModel();
            const messages = [
                { role: 'system', content: 'You are a helpful AI assistant. Be concise.' },
                ...state.conversationHistory.slice(-8)
            ];

            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}`,
                    'HTTP-Referer': window.location.origin || 'https://example.com',
                    'X-Title': 'AI Assistant'
                },
                data: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1024
                }),
                timeout: CONFIG.TIMEOUT,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        
                        if (data.error) {
                            reject(new Error(data.error.message || JSON.stringify(data.error)));
                            return;
                        }
                        
                        if (data.choices && data.choices[0]?.message?.content) {
                            resolve(data.choices[0].message.content);
                        } else {
                            reject(new Error('Invalid response from API'));
                        }
                    } catch (e) {
                        reject(new Error('Failed to parse response'));
                    }
                },
                onerror: function(err) {
                    reject(new Error('Network error'));
                },
                ontimeout: function() {
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
        console.log('✨ AI Assistant ready!');
    };

    init();
})();