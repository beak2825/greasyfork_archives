// ==UserScript==
// @name         餐馆一键下馆子
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  最多绑定三位用户，每日一键操作，无需重复检索。
// @author       kiwi4814
// @match        https://si-qi.xyz/siqi_restaurant.php*
// @license      Copyright (c) 2025 kiwi4814, All Rights Reserved
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556223/%E9%A4%90%E9%A6%86%E4%B8%80%E9%94%AE%E4%B8%8B%E9%A6%86%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/556223/%E9%A4%90%E9%A6%86%E4%B8%80%E9%94%AE%E4%B8%8B%E9%A6%86%E5%AD%90.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const FRIEND_LIST_KEY = 'sq_restaurant_friends_list';
  const MAX_FRIENDS = 3;

  try {
    GM_addStyle(`
      .sq-batch-modal-overlay {
        position: fixed; inset: 0; background: rgba(16, 23, 47, 0.55);
        display: flex; align-items: center; justify-content: center;
        z-index: 10001; opacity: 0; animation: sq-modal-in 0.2s forwards;
      }
      .sq-batch-modal {
        width: min(400px, 90%); background: #ffffff; border-radius: 14px;
        box-shadow: 0 18px 40px rgba(18, 38, 63, 0.18);
        padding: 24px 26px; color: #1a1f36;
      }
      .sq-batch-modal h3 {
        margin: 0 0 16px 0; font-size: 20px; font-weight: 700;
        color: #1d2433; text-align: center;
      }
      .sq-batch-field {
        display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;
      }
      .sq-batch-field label {
        font-size: 13px; font-weight: 600; color: #1d2433;
      }
      .sq-batch-field input {
        padding: 8px 10px; border-radius: 8px;
        border: 1px solid rgba(23, 43, 77, 0.2);
        font-size: 14px; outline: none;
      }
      .sq-batch-modal-actions {
        margin-top: 20px; display: flex;
        justify-content: flex-end; gap: 8px;
      }
      @keyframes sq-modal-in { from { opacity: 0; } to { opacity: 1; } }
    `);
  } catch (e) {}

  class SettingsModal {
    constructor(gameApp) {
      this.game = gameApp;
      this.modal = null;
      this.overlay = null;
      this.inputs = [];
      try { this.init(); } catch (e) {}
    }

    init() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'sq-batch-modal-overlay';
      this.overlay.style.display = 'none';
      const modal = document.createElement('div');
      modal.className = 'sq-batch-modal';
      modal.innerHTML = `<h3>一键下馆子设置</h3><p style="font-size: 13px; color: #3f4b6a; margin-bottom: 16px;">请输入最多 ${MAX_FRIENDS} 位朋友的用户名，保存后点击“一键下馆子”即可按顺序访问。</p>`;

      this.inputs = [];
      for (let i = 0; i < MAX_FRIENDS; i++) {
        const field = document.createElement('div');
        field.className = 'sq-batch-field';
        field.innerHTML = `<label>朋友 ${i + 1}</label><input type="text" placeholder="输入用户名">`;
        const input = field.querySelector('input');
        this.inputs.push(input);
        modal.appendChild(field);
      }

      const actions = document.createElement('div');
      actions.className = 'sq-batch-modal-actions';
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'rest-btn secondary';
      cancelBtn.textContent = '取消';
      cancelBtn.onclick = () => this.hide();
      const saveBtn = document.createElement('button');
      saveBtn.className = 'rest-btn';
      saveBtn.textContent = '保存设置';
      saveBtn.onclick = () => this.save();

      actions.append(cancelBtn, saveBtn);
      modal.appendChild(actions);
      this.overlay.appendChild(modal);
      document.body.appendChild(this.overlay);
      this.overlay.addEventListener('click', (e) => { if (e.target === this.overlay) this.hide(); });
    }

    async show() {
      const friends = (await GM_getValue(FRIEND_LIST_KEY, [])) || [];
      this.inputs.forEach((input, i) => { input.value = friends[i] || ''; });
      this.overlay.style.display = 'flex';
    }

    hide() { this.overlay.style.display = 'none'; }

    async save() {
      const friends = this.inputs.map(i => i.value.trim()).filter(v => v.length > 0);
      const uniqueFriends = [...new Set(friends)];
      if (uniqueFriends.length > MAX_FRIENDS) {
        this.game.setMessage(`最多只能添加 ${MAX_FRIENDS} 位朋友`, 'warning');
        return;
      }
      await GM_setValue(FRIEND_LIST_KEY, uniqueFriends);
      this.game.setMessage('朋友列表已保存', 'success');
      this.hide();
    }
  }

  class BatchDiner {
    constructor() {
      this.game = null;
      this.settings = null;
      this.oneClickBtn = null;
      this.settingsBtn = null;
      this.originalBtn = null;
      this.waitForGame();
    }

    waitForGame() {
      let checkCount = 0;
      const interval = setInterval(() => {
        checkCount++;
        const gameApp = unsafeWindow.SiqiRestaurantGame;
        const dineBtn = document.getElementById('rest-dine-button');
        if (gameApp && dineBtn) {
          clearInterval(interval);
          this.game = gameApp;
          this.originalBtn = dineBtn;
          this.settings = new SettingsModal(this.game);
          this.injectButtons();
          this.addListeners();
          this.updateButtonState();
        }
        if (checkCount > 40) clearInterval(interval);
      }, 500);
    }

    injectButtons() {
      this.oneClickBtn = document.createElement('button');
      this.oneClickBtn.type = 'button';
      this.oneClickBtn.className = 'rest-btn';
      this.oneClickBtn.textContent = '一键下馆子';
      this.oneClickBtn.style.marginLeft = '8px';

      this.settingsBtn = document.createElement('button');
      this.settingsBtn.type = 'button';
      this.settingsBtn.className = 'rest-btn secondary';
      this.settingsBtn.textContent = '⚙️';
      this.settingsBtn.title = '设置列表';
      this.settingsBtn.style.marginLeft = '4px';
      this.settingsBtn.style.padding = '8px 10px';

      this.originalBtn.insertAdjacentElement('afterend', this.settingsBtn);
      this.originalBtn.insertAdjacentElement('afterend', this.oneClickBtn);
    }

    addListeners() {
      this.settingsBtn.addEventListener('click', () => this.settings.show());
      this.oneClickBtn.addEventListener('click', async () => await this.runBatchVisit());

      // 监听状态变化自动更新按钮
      const originalShowMessage = this.game.setMessage;
      this.game.setMessage = (...args) => {
        originalShowMessage.apply(this.game, args);
        if (args[0] && args[0].includes('下馆子')) this.updateButtonState();
      };
      this.originalBtn.addEventListener('click', () => setTimeout(() => this.updateButtonState(), 1000));
    }

    updateButtonState() {
      if (!this.game?.data?.visits || !this.oneClickBtn) return;

      // 检测是否还有次数
      const info = this.game.data.visits;
      const limit = Number(info.limit) || 3;
      const count = Number(info.count) || 0;
      const reachedLimit = info.reached_limit || count >= limit;

      this.oneClickBtn.disabled = reachedLimit;
      if (reachedLimit) {
        this.oneClickBtn.textContent = '次数已用完';
        this.oneClickBtn.className = 'rest-btn secondary'; // 变灰
      } else {
        this.oneClickBtn.textContent = '一键下馆子';
        this.oneClickBtn.className = 'rest-btn'; // 恢复蓝色
      }
    }

    async runBatchVisit() {
      this.updateButtonState();
      if (this.oneClickBtn.disabled) {
        this.game.setMessage('今日下馆子次数已用完', 'warning');
        return;
      }
      const friends = (await GM_getValue(FRIEND_LIST_KEY, [])) || [];
      if (friends.length === 0) {
        this.game.setMessage('请先点击 ⚙️ 设置朋友列表', 'warning');
        return;
      }

      this.oneClickBtn.disabled = true;
      this.oneClickBtn.textContent = '执行中...';
      let visitCount = 0;

      for (const username of friends) {
        if (!username) continue;

        const records = this.game.data?.visits?.records || [];
        const isVisited = records.some(r => r.target_username && r.target_username.toLowerCase() === username.toLowerCase());

        if (isVisited) {
          this.game.setMessage(`已访问过 ${username}，自动跳过`, 'info');
          await this.wait(300);
          continue;
        }

        const info = this.game.data.visits;
        if (info.reached_limit || (info.count >= info.limit)) {
          this.game.setMessage('次数用尽，停止执行', 'info');
          break;
        }

        try {
          this.game.setMessage(`正在前往 ${username} 的餐馆...`, 'info');

          // true 代表 confirmed，跳过弹窗
          await this.game.visitOtherRestaurant(username, true);

          await this.waitForLoading();

          visitCount++;

          await this.wait(1200);

        } catch (err) {
          console.error(err);
        }
      }

      this.game.setMessage(`执行完毕，已尝试访问 ${visitCount} 位朋友`, 'success');
      this.updateButtonState();
    }

    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    waitForLoading() {
      return new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
          if (!this.game.loading || (Date.now() - start > 8000)) {
            resolve();
          } else {
            setTimeout(check, 200);
          }
        };
        check();
      });
    }
  }

  try { new BatchDiner(); } catch (e) {}
})();