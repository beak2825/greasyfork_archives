// ==UserScript==
// @name         DeepSeek 聊天记录导出工具
// @namespace    https://github.com/leekHotline/deepseek-export-chat-records
// @version      1.0.1
// @description  导出 DeepSeek 聊天记录为 JSON/TXT
// @author       leekHotline
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @supportURL   https://github.com/leekHotline/deepseek-export-chat-records/issues
// @downloadURL https://update.greasyfork.org/scripts/559489/DeepSeek%20%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/559489/DeepSeek%20%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ===== config.js =====
  const CONFIG = {
    selectors: {
      aiResponse: '.ds-markdown-paragraph',
      userPrompt: '.fbb737a4',
      chatContainer: '.dad65929',
      messageWrapper: '.f8d1e6d0'
    },
    appName: 'DeepSeek Export',
    version: '1.0.0'
  };

  // ===== core.js =====
  const Core = {
    extractChats() {
      const messages = [];
      const wrappers = document.querySelectorAll(CONFIG.selectors.messageWrapper);
      
      wrappers.forEach((wrapper, index) => {
        const userEl = wrapper.querySelector(CONFIG.selectors.userPrompt);
        const aiEl = wrapper.querySelector(CONFIG.selectors.aiResponse);
        
        if (userEl) {
          messages.push({ role: 'user', content: userEl.innerText.trim(), index });
        }
        if (aiEl) {
          messages.push({ role: 'assistant', content: aiEl.innerText.trim(), index });
        }
      });
      
      // 备用方案：直接抓取所有消息
      if (messages.length === 0) {
        document.querySelectorAll(CONFIG.selectors.userPrompt).forEach(el => {
          messages.push({ role: 'user', content: el.innerText.trim() });
        });
        document.querySelectorAll(CONFIG.selectors.aiResponse).forEach(el => {
          messages.push({ role: 'assistant', content: el.innerText.trim() });
        });
      }
      
      return messages;
    },
  
    exportAsJSON(messages) {
      const data = {
        exportedAt: new Date().toISOString(),
        source: 'DeepSeek',
        messages
      };
      this.download(JSON.stringify(data, null, 2), 'deepseek-chat.json', 'application/json');
    },
  
    exportAsTXT(messages) {
      const text = messages.map(m => 
        `【${m.role === 'user' ? '用户' : 'AI'}】\n${m.content}\n`
      ).join('\n' + '─'.repeat(40) + '\n\n');
      this.download(text, 'deepseek-chat.txt', 'text/plain');
    },
  
    download(content, filename, type) {
      const blob = new Blob([content], { type: `${type};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // ===== ui.js =====
  const UI = {
    init() {
      this.injectStyles();
      this.createButton();
    },
  
    injectStyles() {
      const css = `
        .ds-export-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(102,126,234,0.4);
          z-index: 9999;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ds-export-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(102,126,234,0.6);
        }
        .ds-export-btn svg {
          width: 24px;
          height: 24px;
          fill: white;
        }
        .ds-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .ds-modal.active {
          opacity: 1;
          visibility: visible;
        }
        .ds-modal-content {
          background: white;
          border-radius: 16px;
          padding: 24px;
          min-width: 280px;
          transform: scale(0.9) translateY(20px);
          transition: all 0.3s ease;
        }
        .ds-modal.active .ds-modal-content {
          transform: scale(1) translateY(0);
        }
        .ds-modal h3 {
          margin: 0 0 20px;
          font-size: 18px;
          color: #333;
          text-align: center;
        }
        .ds-modal-btns {
          display: flex;
          gap: 12px;
        }
        .ds-modal-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ds-modal-btn.json {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .ds-modal-btn.txt {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }
        .ds-modal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .ds-toast {
          position: fixed;
          bottom: 80px;
          right: 20px;
          background: #333;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 10001;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }
        .ds-toast.show {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    },
  
    createButton() {
      const btn = document.createElement('button');
      btn.className = 'ds-export-btn';
      btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`;
      btn.onclick = () => this.showModal();
      document.body.appendChild(btn);
    },
  
    showModal() {
      const messages = Core.extractChats();
      if (messages.length === 0) {
        this.toast('未找到聊天记录');
        return;
      }
  
      const modal = document.createElement('div');
      modal.className = 'ds-modal';
      modal.innerHTML = `
        <div class="ds-modal-content">
          <h3>📦 导出 ${messages.length} 条记录</h3>
          <div class="ds-modal-btns">
            <button class="ds-modal-btn json">JSON</button>
            <button class="ds-modal-btn txt">TXT</button>
          </div>
        </div>
      `;
  
      modal.querySelector('.json').onclick = () => {
        Core.exportAsJSON(messages);
        this.closeModal(modal);
        this.toast('JSON 导出成功！');
      };
  
      modal.querySelector('.txt').onclick = () => {
        Core.exportAsTXT(messages);
        this.closeModal(modal);
        this.toast('TXT 导出成功！');
      };
  
      modal.onclick = (e) => {
        if (e.target === modal) this.closeModal(modal);
      };
  
      document.body.appendChild(modal);
      requestAnimationFrame(() => modal.classList.add('active'));
    },
  
    closeModal(modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    },
  
    toast(msg) {
      const t = document.createElement('div');
      t.className = 'ds-toast';
      t.textContent = msg;
      document.body.appendChild(t);
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 300);
      }, 2000);
    }
  };
  
  // 初始化
  UI.init();


})();
