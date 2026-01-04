// ==UserScript==
// @license MIT
// @name         HDKylin自动抽奖 v1.1
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  点按抽奖 + 接口极速；右侧奖项统计与明细；面板可拖拽；刷新后统计清空（只保存设置）
// @match        *://www.hdkyl.in/wof*.php*
// @match        *://www.hdkyl.in/dowof*.php*
// @match        *://hdkyl.in/wof*.php*
// @match        *://hdkyl.in/dowof*.php*
// @match        *://dev.hdkylin.top/wof*.php*
// @match        *://dev.hdkylin.top/dowof*.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548701/HDKylin%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/548701/HDKylin%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96%20v11.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const log = (...a) => console.log('[HDKylin抽奖]', ...a);
  const err = (...a) => console.error('[HDKylin抽奖][ERR]', ...a);

  // ——— 工具 ———
  function waitForElement(selector, timeout = 8000) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function chk() {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - t0 > timeout) return reject(new Error('元素未找到: ' + selector));
        setTimeout(chk, 120);
      })();
    });
  }

  // ——— 主类（1.1核心 + 新UI）———
  class AutoLottery {
    constructor() {
      // 运行态（不从 localStorage 恢复，刷新=清空统计）
      this.isRunning = false;
      this.fastMode = false;           // 接口模式
      this.drawCount = 0;              // 已完成次数（内存）
      this.results = [];               // 明细（内存）

      // 设置（允许保存在 localStorage）
      const saved = JSON.parse(localStorage.getItem('hdkylinAutoLotterySettings') || '{}');
      this.totalDraws = saved.totalDraws || 10;  // 目标次数（请求数/点击数）
      this.delay = (saved.delay ?? 3000);         // 仅对点按模式生效
      this.minMagicValue = saved.minMagicValue || 10000;

      // 页面识别
      this.costPerDraw = 1000000; // 单次消耗魔力
      this.drawUnit = 1;          // 一次接口=几抽（1/10/100）
      this.detectPageType();

      // 其它
      this.currentMagicValue = 0;

      // 8个奖项固定统计（刷新即清空）
      this.stats = {
        '一等奖': 0, '二等奖': 0, '三等奖': 0, '四等奖': 0,
        '五等奖': 0, '六等奖': 0, '鼓励奖': 0, '谢谢参与': 0
      };

      // 备份原生对话框（保持1.1逻辑）
      this.originalConfirm = window.confirm;
      this.originalAlert = window.alert;
      this.originalPrompt = window.prompt;

      // 初始化
      this.init().catch(err);
    }

    // —— 识别页面、接口路径 ——
    detectPageType() {
      const href = location.href;
      if (href.includes('wof100.php')) { this.costPerDraw = 1000000; this.drawUnit = 100; }
      else if (href.includes('wof10.php')) { this.costPerDraw = 100000; this.drawUnit = 10; }
      else { this.costPerDraw = 10000; this.drawUnit = 1; }
      log('页面识别：costPerDraw=', this.costPerDraw, ' drawUnit=', this.drawUnit);
    }
    getApiUrl() {
      const base = location.origin;
      if (location.pathname.includes('wof100.php')) return `${base}/wof/ajax_chs100.php?app=lottery_json`;
      if (location.pathname.includes('wof10.php'))  return `${base}/wof/ajax_chs10.php?app=lottery_json`;
      return `${base}/wof/ajax_chs.php?app=lottery_json`;
    }

    // —— 初始化 ——
    async init() {
      this.getCurrentMagicValue();
      this.createPanel();
      this.makeDraggable(document.getElementById('autoLotteryPanel'));
      this.overrideDialogs();
      this.updateDisplay();

      // 结果页处理（保留1.1的“dowof页抓结果 → 自动跳回”）
      this.handlePageNavigation();

      // 抽奖页存在#inner就等一下（点按模式要用）
      if (!location.href.includes('dowof')) {
        await waitForElement('#inner', 2500).catch(() => {});
      }
      log('初始化完成');
    }

    // —— 魔力值 ——
    getCurrentMagicValue() {
      try {
        const el = document.querySelector('.Detail b');
        if (el && el.textContent.includes('当前拥有魔力值：')) {
          const m = el.textContent.match(/当前拥有魔力值：([\d,\.]+)/);
          if (m) this.currentMagicValue = parseFloat(m[1].replace(/,/g, '')) || 0;
        }
      } catch {}
      return this.currentMagicValue;
    }
    canContinue() {
      const v = this.getCurrentMagicValue();
      if (v < Math.max(this.minMagicValue, this.costPerDraw)) return false;
      if (this.totalDraws > 0 && this.drawCount >= this.totalDraws) return false;
      return true;
    }

    // —— 结果归类（和1.1一致）——
    normalizePrize(text) {
      const t = (text || '').trim();
      if (!t) return '谢谢参与';
      if (/一等奖|站免/.test(t)) return '一等奖';
      if (/二等奖|魔力值?100?万/.test(t)) return '二等奖';
      if (/三等奖|VIP|14天|一个月?VIP/.test(t)) return '三等奖';
      if (/四等奖|彩虹ID/.test(t)) return '四等奖';
      if (/五等奖|上传量|20\.?0?G/i.test(t)) return '五等奖';
      if (/六等奖|补签卡/.test(t)) return '六等奖';
      if (/鼓励奖|随机魔力|谢谢参与/.test(t)) return /谢谢参与/.test(t) ? '谢谢参与' : '鼓励奖';
      return '谢谢参与';
    }
    splitRname(rname) {
      if (!rname) return [];
      return rname.split(/\n|,|，|；|;|、/).map(s => s.trim()).filter(Boolean);
    }
    addStats(items) {
      items.forEach(txt => {
        const k = this.normalizePrize(txt);
        this.stats[k] = (this.stats[k] || 0) + 1;
      });
      this.renderAwardStats();
    }

    // —— 接口极速模式（照1.1：点击即连发，串行无间隔）——
    async fastDrawOnce() {
      const url = this.getApiUrl();
      const res = await fetch(url, { credentials: 'same-origin', headers: {'X-Requested-With':'XMLHttpRequest'} });
      const data = await res.json(); // { rid, rname, num }
      const rname = (data && data.rname) ? String(data.rname) : '';
      const items = this.splitRname(rname);
      // 计数：按返回条目数累加；若接口只给一条，就按 drawUnit
      this.drawCount += (items.length || this.drawUnit);
      this.results.push(rname || '未知结果');
      this.addStats(items.length ? items : [rname]);
      this.updateDisplay();
    }
    async startFastAuto() {
      if (this.isRunning) return;
      // 保存设置（仅设置）
      this.totalDraws = parseInt(document.getElementById('drawCountInput').value) || 0;
      this.minMagicValue = this.costPerDraw;
      localStorage.setItem('hdkylinAutoLotterySettings', JSON.stringify({
        delay: this.delay, totalDraws: this.totalDraws, minMagicValue: this.minMagicValue
      }));

      this.isRunning = true;
      this.fastMode = true;
      this.updateDisplay();

      try {
        // 1.1的节奏：无等待串行请求，直到达标或不足
        while (this.isRunning && this.canContinue()) {
          await this.fastDrawOnce();
          if (this.totalDraws > 0 && this.drawCount >= this.totalDraws) break;
        }
      } catch (e) {
        err('接口抽奖失败', e);
      } finally {
        // 停止但保留统计（刷新自然清空）
        this.stop(false);
      }
    }

    // —— 点按模式（照1.1）——
    performSingleDraw() {
      if (!this.isRunning || this.fastMode) return;
      if (!this.canContinue()) { this.stop(false); return; }
      const inner = document.getElementById('inner');
      if (inner) (window.$ ? window.$(inner).trigger('click') : inner.click());
    }
    startAuto() {
      if (this.isRunning) return;
      this.totalDraws = parseInt(document.getElementById('drawCountInput').value) || 0;
      this.minMagicValue = this.costPerDraw;
      localStorage.setItem('hdkylinAutoLotterySettings', JSON.stringify({
        delay: this.delay, totalDraws: this.totalDraws, minMagicValue: this.minMagicValue
      }));
      this.isRunning = true;
      this.fastMode = false;
      this.updateDisplay();
      this.performSingleDraw(); // 立即点一次
    }

    // —— 停止（刷新自然清空；这里不清空）——
    stop(clearNow = false) {
      this.isRunning = false;
      this.fastMode = false;
      this.updateDisplay();
      if (clearNow) {
        this.drawCount = 0;
        this.results = [];
        Object.keys(this.stats).forEach(k => this.stats[k] = 0);
        this.renderAwardStats();
        this.updateDisplay();
      }
    }

    // —— 结果页处理（照1.1）——
    extractFromResultPage() {
      let r = null;
      if (window.rname && window.rname.trim()) r = window.rname.trim();
      if (!r) {
        const params = new URLSearchParams(location.search);
        const pid = params.get('pid');
        const map = {
          '1':'全站站免1天','2':'获得魔力100万','3':'获得VIP一个月','4':'获得彩虹ID一个月',
          '5':'获得上传量20.0GB','6':'获得补签卡1张','7':'一周年纪念勋章'
        };
        if (pid) r = map[pid] || ('未知奖品ID:' + pid);
      }
      if (r) {
        this.drawCount += 1;
        this.results.push(r);
        this.addStats([r]);
        this.updateDisplay();
      }
      return r;
    }
    handlePageNavigation() {
      // 结果页：抓取结果后，按设置的 delay 跳回抽奖页
      if (location.href.includes('dowof')) {
        setTimeout(() => this.extractFromResultPage(), 400);
        setTimeout(() => this.gotoWof(), Math.max(this.delay, 800));
      } else if (location.href.includes('wof')) {
        // 点按模式：循环点
        if (this.isRunning && !this.fastMode) {
          if (this.canContinue()) {
            setTimeout(() => this.performSingleDraw(), 1000);
          } else {
            this.stop(false);
          }
        }
      }
    }
    gotoWof() {
      let url = location.href.replace('dowof', 'wof');
      if (!url.includes('wof')) url = 'https://www.hdkyl.in/wof.php';
      location.href = url;
    }

    // —— 对话框覆盖（照1.1）——
    overrideDialogs() {
      const self = this;
      window.confirm = function (m) {
        return self.isRunning ? true : self.originalConfirm.call(window, m);
      };
      window.alert = function (m) {
        if (self.isRunning) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('HDKylin抽奖结果', { body: String(m), icon: '/favicon.ico' });
          }
          return;
        }
        return self.originalAlert.call(window, m);
      };
      window.prompt = function (m, d) {
        return self.isRunning ? (d || '') : self.originalPrompt.call(window, m, d);
      };
    }

    // —— UI（双列 + 三行按钮）——
    createPanel() {
      if (document.getElementById('autoLotteryPanel')) return;

      const panel = document.createElement('div');
      panel.id = 'autoLotteryPanel';
      panel.style.cssText = `
        position:fixed;top:20px;right:20px;width:760px;background:#fff;
        border:2px solid #4595d5;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.25);
        z-index:99999;font-family:'Microsoft YaHei',Arial,sans-serif;font-size:14px;`;

      const btnBase = `
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:4px;text-align:center;line-height:1.1;padding:14px 8px;border:none;
        border-radius:10px;cursor:pointer;font-weight:700;min-height:86px;`;

      panel.innerHTML = `
        <div class="hdk-header" style="background:linear-gradient(135deg,#5887e0,#3b62c6);color:#fff;padding:14px 16px;border-radius:10px 10px 0 0;display:flex;justify-content:space-between;align-items:center;">
          <strong>🧩 HDKylin自动抽奖</strong>
          <button id="closePanel" style="background:transparent;border:none;color:#fff;font-size:20px;cursor:pointer">×</button>
        </div>

        <div class="hdk-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:16px;">
          <!-- 左列：概览 + 参数 + 按钮 -->
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div style="padding:12px;background:linear-gradient(135deg,#f8f9fa,#e9ecef);border-radius:8px;border-left:4px solid #5887e0;">
              <div style="margin-bottom:6px;">💰 当前魔力值: <b id="currentMagic" style="color:#2d6cdf">${this.currentMagicValue.toLocaleString()}</b></div>
              <div style="margin-bottom:6px;">🎯 可抽奖次数: <b id="maxDraws" style="color:#28a745">${Math.floor(this.currentMagicValue/this.costPerDraw)}</b></div>
              <div>📊 已完成: <b id="completedDraws" style="color:#17a2b8">${this.drawCount}</b> / <b id="totalPlanned">${this.totalDraws||0}</b></div>
            </div>

            <div style="padding:12px;background:#f8f9fa;border-radius:8px;">
              <label style="display:block;margin-bottom:8px;font-weight:700;">🎲 抽奖次数（总目标）</label>
              <input type="number" id="drawCountInput" value="${this.totalDraws}" min="1" max="999" style="width:100%;padding:10px;border:2px solid #ddd;border-radius:8px;">
              <div style="height:10px"></div>
              <label style="display:block;margin-bottom:8px;font-weight:700;">⏱️ 抽奖间隔</label>
              <div style="display:flex;align-items:center;gap:10px;">
                <input type="number" id="delayInput" value="${Math.round(this.delay/1000)}" min="0" max="60" style="width:90px;padding:8px;border:2px solid #ddd;border-radius:8px;">
                <span style="color:#666;">秒（接口模式忽略）</span>
              </div>
              <div style="height:12px"></div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
                <button id="startAutoBtn" style="${btnBase}background:linear-gradient(135deg,#28a745,#20c997);color:#fff;">
                  <span>🚀</span><span>开始抽奖</span><span style="font-weight:500;opacity:.85">（点按）</span>
                </button>
                <button id="startFastBtn" style="${btnBase}background:linear-gradient(135deg,#ff7a18,#ff3d00);color:#fff;">
                  <span>⚡</span><span>快速抽奖</span><span style="font-weight:500;opacity:.85">（接口）</span>
                </button>
                <button id="stopBtn" style="${btnBase}background:linear-gradient(135deg,#dc3545,#c82333);color:#fff;">
                  <span>🟥</span><span>停止</span><span style="font-weight:500;opacity:.85">&nbsp;</span>
                </button>
              </div>
              <div style="margin-top:10px;font-size:12px;color:#666;">
                当前页面一次接口请求 = <b>${this.drawUnit}</b> 抽；接口：<code>${this.getApiUrl().replace(location.origin,'')}</code>
              </div>
            </div>

            <div style="text-align:center;padding:10px;background:#e9ecef;border-radius:8px;">
              <b style="color:#495057;">状态：</b>
              <span id="statusText" style="font-weight:700;color:#28a745">🟢 就绪</span>
            </div>
          </div>

          <!-- 右列：统计 + 明细 -->
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div>
              <div style="font-weight:700;margin-bottom:8px;color:#495057;">📑 奖项统计：</div>
              <div id="awardStats" style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;background:#f8f9fa;padding:10px;border-radius:8px;border:1px solid #dee2e6;"></div>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;">
              <div style="font-weight:700;margin-bottom:8px;color:#495057;">🧾 抽奖明细：</div>
              <div id="resultStats" style="flex:1;max-height:360px;overflow-y:auto;background:#f8f9fa;padding:12px;border-radius:8px;border:1px solid #dee2e6;">
                <div style="text-align:center;color:#6c757d;padding:18px;">暂无抽奖结果</div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(panel);

      // 事件绑定（1.1节奏）
      document.getElementById('startAutoBtn')?.addEventListener('click', () => this.startAuto());
      document.getElementById('startFastBtn')?.addEventListener('click', () => this.startFastAuto());
      document.getElementById('stopBtn')?.addEventListener('click', () => this.stop(false));
      document.getElementById('closePanel')?.addEventListener('click', () => panel.remove());
      document.getElementById('delayInput')?.addEventListener('change', () => {
        const v = Math.max(0, parseInt(document.getElementById('delayInput').value) || 0) * 1000;
        this.delay = v;
        localStorage.setItem('hdkylinAutoLotterySettings', JSON.stringify({
          delay: this.delay, totalDraws: this.totalDraws, minMagicValue: this.minMagicValue
        }));
      });

      this.injectStyle();
      this.renderAwardStats();
    }

    // 奖项统计渲染（8项固定）
    renderAwardStats() {
      const box = document.getElementById('awardStats');
      if (!box) return;
      const order = ['一等奖','二等奖','三等奖','四等奖','五等奖','六等奖','鼓励奖','谢谢参与'];
      box.innerHTML = order.map(k => `
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:8px 10px;display:flex;justify-content:space-between;gap:8px;">
          <span>${k}</span><b>${this.stats[k]||0}</b>
        </div>`).join('');
    }

    updateDisplay() {
      const startBtn = document.getElementById('startAutoBtn');
      const fastBtn  = document.getElementById('startFastBtn');
      const stopBtn  = document.getElementById('stopBtn');

      if (startBtn) startBtn.disabled = this.isRunning;
      if (fastBtn)  fastBtn.disabled  = this.isRunning;
      if (stopBtn)  stopBtn.disabled  = !this.isRunning;

      const status = document.getElementById('statusText');
      if (status) {
        status.textContent = this.isRunning ? (this.fastMode ? '🔴 运行中（快速）' : '🔴 运行中') : '🟢 就绪';
        status.style.color = this.isRunning ? '#dc3545' : '#28a745';
      }
      const completed = document.getElementById('completedDraws');
      const planned   = document.getElementById('totalPlanned');
      if (completed) completed.textContent = this.drawCount;
      if (planned)   planned.textContent   = this.totalDraws || 0;

      const magic = document.getElementById('currentMagic');
      const max   = document.getElementById('maxDraws');
      if (magic && max) {
        const v = this.getCurrentMagicValue();
        magic.textContent = v.toLocaleString();
        max.textContent = Math.floor(v / this.costPerDraw);
      }

      const detail = document.getElementById('resultStats');
      if (detail) {
        detail.innerHTML = this.results.length
          ? this.results.map((r,i)=>`<div>${i+1}. ${r}</div>`).join('')
          : '<div style="text-align:center;color:#6c757d;padding:18px;">暂无抽奖结果</div>';
      }
    }

    // 可拖拽（标题栏拖动）
    makeDraggable(panel) {
      if (!panel) return;
      const handle = panel.querySelector('.hdk-header') || panel;
      let dragging = false, sx=0, sy=0, cx=0, cy=0;
      handle.style.cursor = 'move';
      handle.addEventListener('mousedown', (e)=>{
        if (e.target.id === 'closePanel') return;
        dragging = true; sx = e.clientX - cx; sy = e.clientY - cy; document.body.style.userSelect='none';
      });
      document.addEventListener('mousemove', (e)=>{
        if (!dragging) return;
        cx = e.clientX - sx; cy = e.clientY - sy;
        panel.style.transform = `translate(${cx}px, ${cy}px)`;
      });
      document.addEventListener('mouseup', ()=>{ dragging=false; document.body.style.userSelect=''; });
    }

    injectStyle() {
      const style = document.createElement('style');
      style.textContent = `
        #autoLotteryPanel button:hover{ transform:translateY(-1px); box-shadow:0 4px 8px rgba(0,0,0,.18); }
        #autoLotteryPanel button:disabled{ opacity:.6; cursor:not-allowed; transform:none!important; }
        #autoLotteryPanel input:focus{ outline:none;border-color:#5887e0;box-shadow:0 0 0 3px rgba(88,135,224,.12); }
        @media (max-width: 880px){ #autoLotteryPanel{ width:96vw; right:2vw; } #autoLotteryPanel .hdk-grid{ grid-template-columns:1fr; } }
        #autoLotteryPanel::-webkit-scrollbar{ width:6px; }
        #autoLotteryPanel::-webkit-scrollbar-thumb{ background:#c1c1c1;border-radius:3px; }
      `;
      document.head.appendChild(style);
    }
  }

  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(()=>{});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AutoLottery());
  } else {
    new AutoLottery();
  }
})();
