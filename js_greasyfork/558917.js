// ==UserScript==
// @name         DeepSeek Chat Memory & History
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add memory and chat history features to DeepSeek
// @author       You
// @match        https://chat.deepseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558917/DeepSeek%20Chat%20Memory%20%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/558917/DeepSeek%20Chat%20Memory%20%20History.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // IndexedDB wrapper for storing chat history and memories
    class ChatStorage {
        constructor() {
            this.dbName = 'DeepSeekMemory';
            this.version = 1;
            this.db = null;
        }

        async init() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, this.version);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    this.db = request.result;
                    resolve();
                };

                request.onupgradeneeded = (e) => {
                    const db = e.target.result;

                    if (!db.objectStoreNames.contains('chats')) {
                        const chatStore = db.createObjectStore('chats', { keyPath: 'id', autoIncrement: true });
                        chatStore.createIndex('timestamp', 'timestamp', { unique: false });
                        chatStore.createIndex('title', 'title', { unique: false });
                    }

                    if (!db.objectStoreNames.contains('memories')) {
                        db.createObjectStore('memories', { keyPath: 'id', autoIncrement: true });
                    }
                };
            });
        }

        async saveChat(title, messages) {
            const transaction = this.db.transaction(['chats'], 'readwrite');
            const store = transaction.objectStore('chats');
            
            const chat = {
                title: title || 'Untitled Chat',
                messages: messages,
                timestamp: Date.now()
            };

            return new Promise((resolve, reject) => {
                const request = store.add(chat);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        async getChats(limit = 50) {
            const transaction = this.db.transaction(['chats'], 'readonly');
            const store = transaction.objectStore('chats');
            const index = store.index('timestamp');

            return new Promise((resolve, reject) => {
                const request = index.openCursor(null, 'prev');
                const chats = [];

                request.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor && chats.length < limit) {
                        chats.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(chats);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        }

        async searchChats(query) {
            const chats = await this.getChats(100);
            const lowerQuery = query.toLowerCase();
            
            return chats.filter(chat => {
                const titleMatch = chat.title.toLowerCase().includes(lowerQuery);
                const contentMatch = chat.messages.some(msg => 
                    msg.content.toLowerCase().includes(lowerQuery)
                );
                return titleMatch || contentMatch;
            });
        }

        async saveMemory(memory) {
            const transaction = this.db.transaction(['memories'], 'readwrite');
            const store = transaction.objectStore('memories');
            
            return new Promise((resolve, reject) => {
                const request = store.add({
                    content: memory,
                    timestamp: Date.now()
                });
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        async getMemories() {
            const transaction = this.db.transaction(['memories'], 'readonly');
            const store = transaction.objectStore('memories');

            return new Promise((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        async deleteMemory(id) {
            const transaction = this.db.transaction(['memories'], 'readwrite');
            const store = transaction.objectStore('memories');
            return new Promise((resolve, reject) => {
                const request = store.delete(id);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
    }

    // UI Manager
    class MemoryUI {
        constructor(storage) {
            this.storage = storage;
            this.panel = null;
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.id = 'memory-panel';
            panel.innerHTML = `
                <style>
                    #memory-panel {
                        position: fixed;
                        right: -400px;
                        top: 0;
                        width: 400px;
                        height: 100vh;
                        background: #1a1a1a;
                        border-left: 1px solid #333;
                        transition: right 0.3s;
                        z-index: 10000;
                        display: flex;
                        flex-direction: column;
                        color: #fff;
                        font-family: system-ui, -apple-system, sans-serif;
                    }
                    #memory-panel.open {
                        right: 0;
                    }
                    #memory-toggle {
                        position: fixed;
                        right: 20px;
                        top: 20px;
                        background: #2563eb;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        padding: 10px 16px;
                        cursor: pointer;
                        z-index: 10001;
                        font-weight: 600;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    }
                    #memory-toggle:hover {
                        background: #1d4ed8;
                    }
                    .memory-header {
                        padding: 20px;
                        border-bottom: 1px solid #333;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .memory-tabs {
                        display: flex;
                        gap: 10px;
                        padding: 0 20px;
                        border-bottom: 1px solid #333;
                    }
                    .memory-tab {
                        padding: 12px 16px;
                        cursor: pointer;
                        border-bottom: 2px solid transparent;
                        transition: all 0.2s;
                    }
                    .memory-tab:hover {
                        background: #252525;
                    }
                    .memory-tab.active {
                        border-bottom-color: #2563eb;
                        color: #2563eb;
                    }
                    .memory-content {
                        flex: 1;
                        overflow-y: auto;
                        padding: 20px;
                    }
                    .memory-search {
                        width: 100%;
                        padding: 10px;
                        background: #252525;
                        border: 1px solid #333;
                        border-radius: 6px;
                        color: #fff;
                        margin-bottom: 16px;
                    }
                    .chat-item, .memory-item {
                        background: #252525;
                        padding: 12px;
                        border-radius: 6px;
                        margin-bottom: 10px;
                        cursor: pointer;
                        transition: background 0.2s;
                    }
                    .chat-item:hover {
                        background: #2a2a2a;
                    }
                    .chat-title {
                        font-weight: 600;
                        margin-bottom: 4px;
                    }
                    .chat-preview {
                        font-size: 13px;
                        color: #888;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .chat-date {
                        font-size: 11px;
                        color: #666;
                        margin-top: 4px;
                    }
                    .memory-item {
                        cursor: default;
                        display: flex;
                        justify-content: space-between;
                        align-items: start;
                    }
                    .memory-delete {
                        background: #dc2626;
                        border: none;
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    }
                    .save-chat-btn {
                        background: #16a34a;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                    }
                    .add-memory-btn {
                        width: 100%;
                        background: #2563eb;
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 6px;
                        cursor: pointer;
                        margin-bottom: 16px;
                    }
                    .memory-input {
                        width: 100%;
                        padding: 10px;
                        background: #252525;
                        border: 1px solid #333;
                        border-radius: 6px;
                        color: #fff;
                        margin-bottom: 10px;
                        resize: vertical;
                        min-height: 80px;
                    }
                </style>
                <div class="memory-header">
                    <h3 style="margin: 0;">Chat Memory</h3>
                    <button class="save-chat-btn">💾 Save Chat</button>
                </div>
                <div class="memory-tabs">
                    <div class="memory-tab active" data-tab="history">History</div>
                    <div class="memory-tab" data-tab="memories">Memories</div>
                </div>
                <div class="memory-content">
                    <div id="history-tab">
                        <input type="text" class="memory-search" placeholder="Search chats..." />
                        <div id="chat-list"></div>
                    </div>
                    <div id="memories-tab" style="display: none;">
                        <button class="add-memory-btn">+ Add Memory</button>
                        <div id="memory-list"></div>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            this.panel = panel;

            // Create toggle button
            const toggle = document.createElement('button');
            toggle.id = 'memory-toggle';
            toggle.textContent = '📚 Memory';
            toggle.onclick = () => panel.classList.toggle('open');
            document.body.appendChild(toggle);

            // Set up event listeners
            this.setupEventListeners();
            this.loadChats();
            this.loadMemories();
        }

        setupEventListeners() {
            // Tab switching
            this.panel.querySelectorAll('.memory-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    this.panel.querySelectorAll('.memory-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    const tabName = tab.dataset.tab;
                    document.getElementById('history-tab').style.display = tabName === 'history' ? 'block' : 'none';
                    document.getElementById('memories-tab').style.display = tabName === 'memories' ? 'block' : 'none';
                });
            });

            // Search
            const searchInput = this.panel.querySelector('.memory-search');
            searchInput.addEventListener('input', async (e) => {
                const query = e.target.value;
                if (query) {
                    const results = await this.storage.searchChats(query);
                    this.displayChats(results);
                } else {
                    this.loadChats();
                }
            });

            // Save current chat
            this.panel.querySelector('.save-chat-btn').addEventListener('click', () => {
                this.saveCurrentChat();
            });

            // Add memory
            this.panel.querySelector('.add-memory-btn').addEventListener('click', () => {
                this.showAddMemoryDialog();
            });
        }

        async loadChats() {
            const chats = await this.storage.getChats();
            this.displayChats(chats);
        }

        displayChats(chats) {
            const chatList = document.getElementById('chat-list');
            chatList.innerHTML = '';

            if (chats.length === 0) {
                chatList.innerHTML = '<p style="color: #666; text-align: center;">No saved chats yet</p>';
                return;
            }

            chats.forEach(chat => {
                const item = document.createElement('div');
                item.className = 'chat-item';
                
                const preview = chat.messages[0]?.content || 'Empty chat';
                const date = new Date(chat.timestamp).toLocaleDateString();
                
                item.innerHTML = `
                    <div class="chat-title">${chat.title}</div>
                    <div class="chat-preview">${preview.substring(0, 100)}</div>
                    <div class="chat-date">${date}</div>
                `;
                
                item.onclick = () => this.viewChat(chat);
                chatList.appendChild(item);
            });
        }

        async loadMemories() {
            const memories = await this.storage.getMemories();
            const memoryList = document.getElementById('memory-list');
            memoryList.innerHTML = '';

            if (memories.length === 0) {
                memoryList.innerHTML = '<p style="color: #666; text-align: center;">No memories saved</p>';
                return;
            }

            memories.forEach(memory => {
                const item = document.createElement('div');
                item.className = 'memory-item';
                item.innerHTML = `
                    <div>${memory.content}</div>
                    <button class="memory-delete" data-id="${memory.id}">Delete</button>
                `;
                
                item.querySelector('.memory-delete').onclick = async (e) => {
                    e.stopPropagation();
                    await this.storage.deleteMemory(memory.id);
                    this.loadMemories();
                };
                
                memoryList.appendChild(item);
            });
        }

        saveCurrentChat() {
            // Try to extract messages from the page
            const messages = this.extractMessages();
            
            if (messages.length === 0) {
                alert('No messages found to save. Start a conversation first!');
                return;
            }

            const title = prompt('Enter a title for this chat:', messages[0].content.substring(0, 50));
            if (title) {
                this.storage.saveChat(title, messages).then(() => {
                    alert('Chat saved!');
                    this.loadChats();
                });
            }
        }

        extractMessages() {
            // This is a generic extractor - you may need to adjust selectors based on DeepSeek's actual DOM structure
            const messages = [];
            const messageElements = document.querySelectorAll('[class*="message"], [class*="chat"]');
            
            messageElements.forEach(el => {
                const text = el.textContent.trim();
                if (text.length > 0) {
                    messages.push({
                        role: el.classList.contains('user') || el.querySelector('[class*="user"]') ? 'user' : 'assistant',
                        content: text
                    });
                }
            });

            return messages;
        }

        viewChat(chat) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
                padding: 20px;
            `;
            
            const content = document.createElement('div');
            content.style.cssText = `
                background: #1a1a1a;
                color: #fff;
                padding: 30px;
                border-radius: 12px;
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                width: 100%;
            `;
            
            content.innerHTML = `
                <h2 style="margin-top: 0;">${chat.title}</h2>
                <div style="color: #666; margin-bottom: 20px;">${new Date(chat.timestamp).toLocaleString()}</div>
                ${chat.messages.map(msg => `
                    <div style="margin-bottom: 16px; padding: 12px; background: ${msg.role === 'user' ? '#2563eb' : '#252525'}; border-radius: 8px;">
                        <strong>${msg.role === 'user' ? 'You' : 'DeepSeek'}:</strong><br/>
                        ${msg.content}
                    </div>
                `).join('')}
                <button style="background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 20px;">Close</button>
            `;
            
            content.querySelector('button').onclick = () => modal.remove();
            modal.appendChild(content);
            document.body.appendChild(modal);
        }

        showAddMemoryDialog() {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
            `;
            
            const content = document.createElement('div');
            content.style.cssText = `
                background: #1a1a1a;
                color: #fff;
                padding: 30px;
                border-radius: 12px;
                max-width: 500px;
                width: 100%;
            `;
            
            content.innerHTML = `
                <h2 style="margin-top: 0;">Add Memory</h2>
                <p style="color: #888;">Save a fact or preference to remember across conversations</p>
                <textarea class="memory-input" placeholder="e.g., I prefer Python for backend development"></textarea>
                <div style="display: flex; gap: 10px;">
                    <button class="save-btn" style="flex: 1; background: #2563eb; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">Save</button>
                    <button class="cancel-btn" style="flex: 1; background: #333; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">Cancel</button>
                </div>
            `;
            
            const input = content.querySelector('.memory-input');
            content.querySelector('.save-btn').onclick = async () => {
                const memory = input.value.trim();
                if (memory) {
                    await this.storage.saveMemory(memory);
                    this.loadMemories();
                    modal.remove();
                }
            };
            content.querySelector('.cancel-btn').onclick = () => modal.remove();
            
            modal.appendChild(content);
            document.body.appendChild(modal);
        }
    }

    // Initialize
    async function init() {
        const storage = new ChatStorage();
        await storage.init();
        
        const ui = new MemoryUI(storage);
        ui.createPanel();
        
        console.log('DeepSeek Memory Extension loaded!');
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();