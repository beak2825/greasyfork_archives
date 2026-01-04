// ==UserScript==
// @name         划词本地题库搜索
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  网页划词后在本地题库搜索匹配的题目与答案，界面简洁，支持匹配词高亮、一键复制答案、异步搜索、GM菜单设置、精确搜索。
// @author       LLs
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/556105/%E5%88%92%E8%AF%8D%E6%9C%AC%E5%9C%B0%E9%A2%98%E5%BA%93%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/556105/%E5%88%92%E8%AF%8D%E6%9C%AC%E5%9C%B0%E9%A2%98%E5%BA%93%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* -------------------------
     配置与默认题库
     -------------------------*/
  const STORAGE_KEY = 'local_question_bank_v1';
  const STORAGE_KEY_SETTINGS = 'local_question_bank_settings_v1';

  const DEFAULT_BANK = [
    { id: 'q1', type: '选择', question: 'HTML 的全称是什么？', options: ['HyperText Markup Language', 'HighText Machine Language', 'Hyper Transfer Markup Language'], answer: 'HyperText Markup Language', tags: ['前端', '基础'] },
    { id: 'q2', type: '判断', question: 'CSS 用来控制网页的样式与布局（对或错）？', answer: '对', tags: ['前端', '样式'] },
    { id: 'q3', type: '简答', question: '简述 HTTP 和 HTTPS 区别。', answer: 'HTTPS 在 HTTP 基础上使用 TLS/SSL 加密，保证传输加密性与完整性。', tags: ['网络'] }
  ];

  const DEFAULT_SETTINGS = {
    scoreThreshold: 0.3,
    searchImmediately: false
  };

  /* -------------------------
     全局变量 (UI 和状态)
     -------------------------*/
  let panel, badge, settingsPanel;
  let searchIcon;
  let lastQuery = '';
  let currentSelection = { text: '', range: null };


  /* -------------------------
     样式
     -------------------------*/
  GM_addStyle(`
     #tm-qsearch-panel {
       position: fixed; z-index: 2147483647; right: 15px; top: 80px;
       width: 380px; max-width: 90vw; max-height: 80vh; overflow: hidden;
       background: #fff; border: 1px solid #ddd; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
       font-family: Arial, sans-serif; color: #222; border-radius: 8px;
       -webkit-overflow-scrolling: touch;
       display: none; /* 默认隐藏 */
       flex-direction: column; /* 垂直布局 */
     }
     #tm-qsearch-panel .header {
       display:flex; justify-content:space-between; align-items:center;
       padding:8px 10px; border-bottom:1px solid #eee; background:#f9f9f9;
       border-top-left-radius:8px; border-top-right-radius:8px;
       flex-shrink: 0; /* 不收缩 */
     }
     #tm-qsearch-panel .header .title { font-weight:600; }
     #tm-qsearch-panel .list {
       padding:10px; overflow-y: auto;
       flex-grow: 1; /* 占据剩余空间 */
     }
     #tm-qsearch-panel .item { padding:8px; border-bottom:1px solid #f1f1f1; }
     #tm-qsearch-panel .question { font-weight:600; margin-bottom:6px; }
     #tm-qsearch-panel .meta { color:#666; font-size:12px; margin-bottom:6px; }
     #tm-qsearch-panel .answer {
       background:#fff8e6;
       padding:8px;
       border-radius:6px;
       font-size:14px;
       border: 1px dashed #ffdca8; /* 突出答案区域 */
       margin-top: 5px;
     }
     #tm-qsearch-panel .controls {
       padding:8px; display:flex; gap:8px; justify-content:space-between; align-items:center;
       border-bottom: 1px solid #eee;
       flex-shrink: 0; /* 不收缩 */
     }

     /* 融合的搜索框样式 */
     #tm-qsearch-panel .search-container {
       display: flex;
       flex-grow: 1;
     }
     #tm-qsearch-panel #tm-current-query-input {
       flex-grow: 1;
       padding: 6px 8px;
       border: 1px solid #ccc;
       border-right: none; /* 移除右边框 */
       border-radius: 6px 0 0 6px; /* 圆角调整 */
       font-size: 14px;
       height: 32px; /* 固定高度 */
       box-sizing: border-box; /* 保证高度一致 */
     }
     #tm-qsearch-panel #tm-manual-search-btn {
       padding: 6px 10px;
       border: 1px solid #ccc;
       border-left: none; /* 移除左边框 */
       border-radius: 0 6px 6px 0; /* 圆角调整 */
       margin-left: 0; /* 移除左边距 */
       height: 32px; /* 固定高度 */
       box-sizing: border-box; /* 保证高度一致 */
       background: #f0f0f0;
     }
     #tm-qsearch-panel #tm-manual-search-btn:hover { background: #e0e0e0; }

     /* 精确搜索开关样式 */
     #tm-exact-search-toggle-container {
       display: flex;
       align-items: center;
       gap: 5px;
       flex-shrink: 0;
     }
     #tm-exact-search-toggle-container .tm-toggle-label {
        font-size: 12px;
        color: #333;
        cursor: pointer;
     }
     #tm-exact-search-toggle-container .tm-toggle-switch {
       position: relative;
       display: inline-block;
       width: 34px;
       height: 20px;
     }
     #tm-exact-search-toggle-container .tm-toggle-switch input {
       opacity: 0;
       width: 0;
       height: 0;
     }
     #tm-exact-search-toggle-container .tm-toggle-slider {
       position: absolute;
       cursor: pointer;
       top: 0;
       left: 0;
       right: 0;
       bottom: 0;
       background-color: #ccc;
       border-radius: 20px;
       transition: .4s;
     }
     #tm-exact-search-toggle-container .tm-toggle-slider:before {
       position: absolute;
       content: "";
       height: 16px;
       width: 16px;
       left: 2px;
       bottom: 2px;
       background-color: white;
       border-radius: 50%;
       transition: .4s;
     }
     #tm-exact-search-toggle-container input:checked + .tm-toggle-slider {
       background-color: #ff6b6b;
     }
     #tm-exact-search-toggle-container input:checked + .tm-toggle-slider:before {
       transform: translateX(14px);
     }

     #tm-qsearch-panel button { cursor:pointer; border:1px solid #ddd; background:#fff; padding:6px 8px; border-radius:6px; }
     #tm-qsearch-panel button:hover { background: #f0f0f0; }

     #tm-qsearch-badge {
       position: fixed; z-index: 2147483646; right: 20px; bottom: 20px; top: auto;
       background:#ff6b6b; color:#fff; padding:6px 10px; border-radius:20px;
       cursor:pointer; box-shadow: 0 6px 18px rgba(0,0,0,0.12); font-weight:600;
     }
     #tm-qsearch-empty { padding:10px; color:#666; }

     /* --- (设置面板样式保持不变) --- */
     #tm-qsearch-settings-overlay {
       position: fixed; z-index: 2147483648; left: 0; top: 0;
       width: 100vw; height: 100vh; background: rgba(0,0,0,0.4);
       display: none; align-items: center; justify-content: center;
     }
     #tm-qsearch-settings-panel {
       background: #fff; padding: 20px; border-radius: 8px;
       width: 80vw; max-width: 350px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
     }
     #tm-qsearch-settings-panel .setting-item { margin-bottom: 15px; }
     #tm-qsearch-settings-panel .setting-item label { display: block; font-weight: 600; margin-bottom: 5px; }
     #tm-qsearch-settings-panel .setting-item input[type="number"] {
       width: 100%; padding: 8px; box-sizing: border-box;
       border: 1px solid #ccc; border-radius: 4px;
     }
     #tm-qsearch-settings-panel .setting-item-check {
       display: flex; align-items: center; gap: 8px;
     }
     #tm-qsearch-settings-panel .setting-item-check label {
       margin-bottom: 0;
     }
     #tm-qsearch-settings-panel .settings-footer {
       display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;
     }
     .tm-qsearch-data-zone {
       border-top: 1px solid #eee;
       margin-top: 20px;
       padding-top: 15px;
     }
     .tm-qsearch-data-zone label {
       display: block; font-weight: 600; margin-bottom: 5px;
     }
     .tm-settings-button {
       background-color: #f0f0f0;
       color: #333;
       border: 1px solid #ccc;
       padding: 8px 12px;
       border-radius: 6px;
       cursor: pointer;
       width: 100%;
       font-weight: 600;
       box-sizing: border-box;
     }
     .tm-settings-button:hover {
       background-color: #e0e0e0;
     }
     .tm-qsearch-danger-zone {
       border-top: 1px solid #eee;
       margin-top: 20px;
       padding-top: 15px;
     }
     .tm-qsearch-danger-zone label {
       color: #d9534f;
       font-weight: 600;
       margin-bottom: 5px;
       display: block;
     }
     .tm-settings-button-danger {
       background-color: #d9534f;
       color: white;
       border: 1px solid #d43f3a;
       padding: 8px 12px;
       border-radius: 6px;
       cursor: pointer;
       width: 100%;
       font-weight: 600;
       box-sizing: border-box;
     }
     .tm-settings-button-danger:hover {
       background-color: #c9302c;
     }

     #tm-qsearch-icon {
       position: absolute; z-index: 2147483646; background: #fff;
       border: 1px solid #ccc; border-radius: 50%;
       width: 30px; height: 30px;
       display: none; align-items: center; justify-content: center;
       font-size: 16px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
       transition: transform 0.1s ease;
     }
     #tm-qsearch-icon:hover { transform: scale(1.1); }

     /* --- 新增样式 --- */

     /* 高亮样式 */
     .tm-highlight {
       background-color: #fffdc4;
       color: #000;
       font-weight: bold;
       border-radius: 3px;
       padding: 0 2px;
     }
   `);

  /* -------------------------
     存储函数 (题库 & 配置)
     -------------------------*/
  async function loadBank() {
    let raw = await GM_getValue(STORAGE_KEY);
    if (!raw) {
      await GM_setValue(STORAGE_KEY, JSON.stringify(DEFAULT_BANK));
      raw = JSON.stringify(DEFAULT_BANK);
    }
    try { return JSON.parse(raw); }
    catch (e) {
      console.error('解析本地题库失败，将重置为默认题库', e);
      await GM_setValue(STORAGE_KEY, JSON.stringify(DEFAULT_BANK));
      return DEFAULT_BANK;
    }
  }
  async function saveBank(bank) {
    await GM_setValue(STORAGE_KEY, JSON.stringify(bank));
  }
  async function loadSettings() {
    let raw = await GM_getValue(STORAGE_KEY_SETTINGS);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    try {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      console.error('解析配置失败，将重置为默认配置', e);
      return DEFAULT_SETTINGS;
    }
  }
  async function saveSettings(settings) {
    await GM_setValue(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }

  /* -------------------------
     异步分块处理
     -------------------------*/
  function updateProgress(current, total) {
    const el = document.querySelector('#tm-qsearch-empty.progress');
    if (el) {
      const percent = Math.round((current / total) * 100);
      el.textContent = `搜索中 (${percent}%)...`;
    }
  }
  function processArrayAsync(array, fn, chunkSize = 50, progressCallback) {
    return new Promise((resolve) => {
      let index = 0;
      const results = [];
      function processChunk() {
        const end = Math.min(index + chunkSize, array.length);
        for (; index < end; index++) {
          const result = fn(array[index]);
          if (result) results.push(result);
        }
        if (index < array.length) {
          if (progressCallback) progressCallback(index, array.length);
          setTimeout(processChunk, 0);
        } else {
          if (progressCallback) progressCallback(index, array.length);
          resolve(results);
        }
      }
      processChunk();
    });
  }

  /* -------------------------
     文本预处理与相似度算法
     -------------------------*/
  function normalizeText(s) {
    if (!s) return '';
    s = s.toString().toLowerCase();
    s = s.replace(/[^\p{Script=Han}\p{L}\p{N}\s]/gu, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
  }
  function substringMatch(a, b) {
    return a.indexOf(b) !== -1 || b.indexOf(a) !== -1;
  }
  function tokens(s) {
    return s.split(/\s+/).filter(Boolean);
  }
  function jaccardSimilarity(a, b) {
    const A = new Set(tokens(a));
    const B = new Set(tokens(b));
    const inter = [...A].filter(x => B.has(x)).length;
    const union = new Set([...A, ...B]).size;
    if (union === 0) return 0;
    return inter / union;
  }
  function levenshteinDistance(a, b) {
    const n = a.length, m = b.length;
    if (n === 0) return m; if (m === 0) return n;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = 0; i <= n; i++) dp[i][0] = i;
    for (let j = 0; j <= m; j++) dp[0][j] = j;
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[n][m];
  }
  function levenshteinRatio(a, b) {
    if (a.length === 0 && b.length === 0) return 1;
    const dist = levenshteinDistance(a, b);
    return 1 - dist / Math.max(a.length, b.length);
  }
  function scoreMatch(q_normalized, c_normalized) {
    if (!q_normalized || !c_normalized) return 0;
    // 精确匹配 (子字符串) 给予满分
    if (substringMatch(c_normalized, q_normalized)) return 1.0;

    const jacc = jaccardSimilarity(q_normalized, c_normalized);
    let lev = 0;
    const LEV_COMPLEXITY_LIMIT = 250000;
    if (q_normalized.length * c_normalized.length < LEV_COMPLEXITY_LIMIT) {
      lev = levenshteinRatio(q_normalized, c_normalized);
    }
    // 模糊匹配
    const score = 0.55 * jacc + 0.45 * lev;
    return score;
  }

  /* -------------------------
     主搜索函数
     -------------------------*/
  async function searchBank(query, limit = 10) {
    const [bank, settings] = await Promise.all([loadBank(), loadSettings()]);
    const qn = normalizeText(query);
    if (!qn) return [];

    // 获取精确搜索开关的状态
    const exactSearchToggle = document.getElementById('tm-exact-search-toggle');
    const isExactSearch = exactSearchToggle ? exactSearchToggle.checked : false;

    let scoreThreshold = settings.scoreThreshold || 0;

    const MAX_QUERY_LEN_FOR_SCORE = 500;
    const truncatedQuery = qn.length > MAX_QUERY_LEN_FOR_SCORE ? qn.substring(0, MAX_QUERY_LEN_FOR_SCORE) : qn;

    const scoringFn = (item) => {
      let combined = item.question || '';
      if (item.options && Array.isArray(item.options)) combined += ' ' + item.options.join(' ');
      if (item.tags && Array.isArray(item.tags)) combined += ' ' + item.tags.join(' ');
      if (item.answer) combined += ' ' + (typeof item.answer === 'string' ? item.answer : JSON.stringify(item.answer));

      const cn = normalizeText(combined);
      const sc = scoreMatch(truncatedQuery, cn);

      if (isExactSearch) {
        // 精确搜索模式：只接受 1.0 (完美匹配)
        if (sc === 1.0) {
          return { item, score: sc };
        }
      } else {
        // 模糊搜索模式：使用设置中的阈值
        if (sc >= scoreThreshold) {
          return { item, score: sc };
        }
      }
      return null;
    };

    const results = await processArrayAsync(bank, scoringFn, 50, updateProgress);
    results.sort((a,b) => b.score - a.score);
    return results.slice(0, limit);
  }

  /* -------------------------
     UI：主面板
     -------------------------*/
  async function createPanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'tm-qsearch-panel';
    panel.style.display = "none"; // 确保初始隐藏
    panel.innerHTML = `
      <div class="header">
        <div class="title">本地题库搜索</div>
        <button id="tm-close">×</button>
      </div>
      <div class="controls">
        <div class="search-container">
          <input type="text" id="tm-current-query-input" placeholder="输入搜索词...">
          <button id="tm-manual-search-btn">🔍</button>
        </div>
        <div id="tm-exact-search-toggle-container" title="精确搜索 (100% 匹配)">
          <label class="tm-toggle-switch">
            <input type="checkbox" id="tm-exact-search-toggle">
            <span class="tm-toggle-slider"></span>
          </label>
        </div>
      </div>
      <div class="list" id="tm-result-list">
        <div id="tm-qsearch-empty">无结果</div>
      </div>
    `;
    document.body.appendChild(panel);

    // 关闭按钮
    panel.querySelector('#tm-close').addEventListener('click', () => hidePanel());

    // 手动搜索按钮
    panel.querySelector('#tm-manual-search-btn').addEventListener('click', async () => {
      await refreshResults();
    });

    // 搜索框回车
    panel.querySelector('#tm-current-query-input').addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        await refreshResults();
      }
    });

    // 精确搜索开关变化时也触发搜索
    panel.querySelector('#tm-exact-search-toggle').addEventListener('change', async () => {
        await refreshResults();
    });

    return panel;
  }

  /* -------------------------
     UI：设置面板
     -------------------------*/
  async function createSettingsPanel() {
    if (settingsPanel) return settingsPanel;
    settingsPanel = document.createElement('div');
    settingsPanel.id = 'tm-qsearch-settings-overlay';
    settingsPanel.innerHTML = `
      <div id="tm-qsearch-settings-panel">
        <h3>设置</h3>
        <div class="setting-item">
          <label for="tm-setting-threshold">模糊搜索分数阈值 (0.0 - 1.0)</label>
          <input id="tm-setting-threshold" type="number" step="0.1" min="0" max="1" />
          <div style="font-size:12px; color:#666; margin-top:5px;">
            低于此分数的题目将不显示 (精确搜索关闭时生效)。
          </div>
        </div>
        <div class="setting-item setting-item-check">
          <input id="tm-setting-immediate-search" type="checkbox" />
          <label for="tm-setting-immediate-search">划词后立即搜索</label>
        </div>

        <div class="tm-qsearch-data-zone">
          <label>数据管理</label>
          <div style="display:flex; gap:10px; margin-top:5px;">
             <button id="tm-import-btn" class="tm-settings-button">导入题库</button>
             <button id="tm-export-btn" class="tm-settings-button">导出题库</button>
          </div>
        </div>

        <div class="settings-footer">
          <button id="tm-settings-cancel">取消</button>
          <button id="tm-settings-save">保存</button>
        </div>

        <div class="tm-qsearch-danger-zone">
          <label>危险操作</label>
          <button id="tm-clear-bank-danger" class="tm-settings-button-danger">清空本地题库</button>
          <div style="font-size:12px; color:#666; margin-top:5px;">
            此操作不可撤销，将永久删除所有已导入的题目。
          </div>
          <button id="tm-reset-bank-danger" class="tm-settings-button-danger" style="margin-top: 10px;">重置为默认题库</button>
        </div>
      </div>
      <input id="tm-file-input" type="file" accept="application/json" style="display:none;" />
    `;
    document.body.appendChild(settingsPanel);

    // --- 绑定设置面板事件 ---

    // 导入
    settingsPanel.querySelector('#tm-import-btn').addEventListener('click', () => settingsPanel.querySelector('#tm-file-input').click());

    // 导出
    settingsPanel.querySelector('#tm-export-btn').addEventListener('click', async () => {
      const bank = await loadBank();
      const blob = new Blob([JSON.stringify(bank, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'question_bank.json';
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });

    // 文件输入
    const fileInput = settingsPanel.querySelector('#tm-file-input');
    fileInput.addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      const text = await f.text();
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error('题库文件必须为数组格式');
        await saveBank(parsed);
        GM_notification({ text: '导入成功', title: '本地题库搜索' });
        await refreshResults();
      } catch (err) { alert('导入失败：' + err.message); }
      finally { fileInput.value = ''; }
    });

    // 点击覆盖层关闭
    settingsPanel.addEventListener('click', (e) => {
      if (e.target.id === 'tm-qsearch-settings-overlay') {
        hideSettingsPanel();
      }
    });

    // 取消按钮
    settingsPanel.querySelector('#tm-settings-cancel').addEventListener('click', () => hideSettingsPanel());

    // 保存按钮
    settingsPanel.querySelector('#tm-settings-save').addEventListener('click', async () => {
      const inputThreshold = settingsPanel.querySelector('#tm-setting-threshold');
      const inputImmediate = settingsPanel.querySelector('#tm-setting-immediate-search');

      let threshold = parseFloat(inputThreshold.value);
      if (isNaN(threshold) || threshold < 0 || threshold > 1) {
        alert('请输入 0.0 到 1.0 之间的有效数字。');
        return;
      }

      const currentSettings = await loadSettings();
      await saveSettings({
        ...currentSettings,
        scoreThreshold: threshold,
        searchImmediately: inputImmediate.checked
      });

      GM_notification({ text: `设置已保存`, title: '本地题库搜索' });
      hideSettingsPanel();
      await refreshResults();
    });

    // 清空题库
    settingsPanel.querySelector('#tm-clear-bank-danger').addEventListener('click', async () => {
      if (!confirm('【危险操作】\n\n确认清空本地题库？此操作不可撤销！')) return;
      await saveBank([]); // 清空
      hideSettingsPanel();
      await refreshResults();
      GM_notification({ text: '题库已清空', title: '本地题库搜索' });
    });

    // 重置题库
    settingsPanel.querySelector('#tm-reset-bank-danger').addEventListener('click', async () => {
      if (confirm('【危险操作】\n\n确认重置为默认题库？\n此操作将覆盖您当前的题库。')) {
        await saveBank(DEFAULT_BANK);
        hideSettingsPanel();
        await refreshResults();
        GM_notification({ text: '题库已重置为默认', title: '本地题库搜索' });
      }
    });

    return settingsPanel;
  }

  async function showSettingsPanel() {
    if (!settingsPanel) await createSettingsPanel();
    const settings = await loadSettings();
    const inputThreshold = settingsPanel.querySelector('#tm-setting-threshold');
    const inputImmediate = settingsPanel.querySelector('#tm-setting-immediate-search');
    inputThreshold.value = (settings.scoreThreshold || 0).toFixed(1);
    inputImmediate.checked = settings.searchImmediately;
    settingsPanel.style.display = 'flex';
  }

  function hideSettingsPanel() {
    if (settingsPanel) {
      settingsPanel.style.display = 'none';
    }
  }

  /* -------------------------
     Badge, Panel, Icon 控制
     -------------------------*/
  function createBadge() {
    if (badge) return badge;
    badge = document.createElement('div');
    badge.id = 'tm-qsearch-badge';
    badge.textContent = '题库';
    badge.title = '点击显示/隐藏本地题库面板';
    badge.addEventListener('click', () => togglePanel());
    document.body.appendChild(badge);
    return badge;
  }
  async function showPanel() {
    if (!panel) await createPanel();
    panel.style.display = 'flex'; // 改为 flex
  }
  function hidePanel() {
    if (panel) panel.style.display = 'none';
    hideSettingsPanel();
    hideSearchIcon();
  }
  async function togglePanel() {
    if (!panel) await createPanel();
    const isHidden = (panel.style.display === 'none' || !panel.style.display);
    if (isHidden) { showPanel(); } else { hidePanel(); }
  }
  function createSearchIcon() {
    if (searchIcon) return;
    searchIcon = document.createElement('div');
    searchIcon.id = 'tm-qsearch-icon';
    searchIcon.innerHTML = '🔍';
    searchIcon.title = '搜索本地题库';
    searchIcon.addEventListener('click', async (e) => {
      e.stopPropagation();
      const text = currentSelection.text;
      if (!text) return;
      hideSearchIcon();
      await showPanel();
      await refreshResults(text);
      currentSelection = { text: '', range: null };
    });
    document.body.appendChild(searchIcon);
  }
  function showSearchIcon(range) {
    if (!searchIcon) createSearchIcon();
    const rect = range.getBoundingClientRect();
    let x = window.scrollX + rect.right + 5;
    let y = window.scrollY + rect.top;
    if (x + 30 > window.innerWidth + window.scrollX) {
      x = window.scrollX + rect.left - 35;
    }
    searchIcon.style.left = `${x}px`;
    searchIcon.style.top = `${y}px`;
    searchIcon.style.display = 'flex';
  }
  function hideSearchIcon() {
    if (searchIcon) {
      searchIcon.style.display = 'none';
    }
  }

  /* -------------------------
     刷新结果
     -------------------------*/
  async function refreshResults(query) {
    if (!panel) await createPanel(); // 确保面板存在
    const input = panel.querySelector('#tm-current-query-input');
    const list = panel.querySelector('#tm-result-list');

    list.innerHTML = '<div id="tm-qsearch-empty" class="progress">搜索中...</div>';

    if (typeof query !== 'undefined') {
        lastQuery = query; // 从划词更新
    } else {
        lastQuery = input.value; // 从输入框获取
    }

    input.value = lastQuery; // 同步输入框内容

    if (!lastQuery) {
      list.innerHTML = '<div id="tm-qsearch-empty">无结果</div>';
      return;
    }

    // --- 高亮逻辑 ---
    const keywords = tokens(normalizeText(lastQuery));
    const regex = keywords.length > 0 ? new RegExp(`(${keywords.map(escapeRegExp).join('|')})`, 'gi') : null;
    // --- 结束高亮逻辑 ---

    const results = await searchBank(lastQuery, 20);
    list.innerHTML = '';
    if (!results || results.length === 0) {
      list.innerHTML = '<div id="tm-qsearch-empty">未找到匹配题目</div>';
      return;
    }
    for (const r of results) {
      const div = document.createElement('div');
      div.className = 'item';

      const answerText = typeof r.item.answer === 'string' ? r.item.answer : JSON.stringify(r.item.answer);

      div.innerHTML = `
        <div class="question">${highlight(r.item.question, regex)}</div>
        <div class="meta">类型: ${escapeHtml(r.item.type || '')}  分数: ${(r.score * 100).toFixed(1)}%</div>
        ${r.item.options && Array.isArray(r.item.options) ? `<div class="meta">选项: ${highlight(r.item.options.join(' / '), regex)}</div>` : ''}
        <div class="answer">${highlight(answerText, regex)}</div>
      `;


      list.appendChild(div);
    }
  }

  /* -------------------------
     帮助函数：HTML 转义、复制、抖动防抖
     -------------------------*/
  function escapeHtml(s) {
    if (s == null) return '';
    return s.toString().replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // --- 新增高亮辅助函数 ---
  function escapeRegExp(s) {
    return s.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, regex) {
    const s = text == null ? '' : text.toString();
    // 1. 先转义，防 XSS
    const escaped = escapeHtml(s);
    // 2. 如果没有正则或正则为空，直接返回转义后内容
    if (!regex || regex.source === '(?:)') {
      return escaped;
    }
    // 3. 替换高亮
    return escaped.replace(regex, '<mark class="tm-highlight">$1</mark>');
  }
  // --- 结束新增函数 ---

  function copyToClipboard(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (err) { console.warn('复制失败', err); }
    ta.remove();
  }
  function debounce(fn, ms = 300) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /* -------------------------
     划词检测
     -------------------------*/
  let selectionHandler = debounce(async function (e) {
    const sel = window.getSelection();
    let text = sel ? sel.toString().trim() : '';

    // 排除在我们的 UI 内部的划词
    if (sel && sel.anchorNode) {
        if (sel.anchorNode.parentElement.closest('#tm-qsearch-panel, #tm-qsearch-settings-overlay')) {
            return;
        }
    }

    // 排除输入框和文本域
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
        // 如果是在输入框中划词，也允许
        if (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') {
             text = activeEl.value.substring(activeEl.selectionStart, activeEl.selectionEnd).trim();
        }
    }

    if (!text || text.length < 2) {
      hideSearchIcon();
      currentSelection = { text: '', range: null };
      return;
    }

    currentSelection = { text, range: sel.rangeCount > 0 ? sel.getRangeAt(0) : null };
    const settings = await loadSettings();

    if (settings.searchImmediately) {
      hideSearchIcon();
      await showPanel();
      await refreshResults(text);
    } else {
      if(currentSelection.range) {
          showSearchIcon(currentSelection.range);
      }
    }
  }, 200);

  document.addEventListener('selectionchange', selectionHandler);

  /* -------------------------
     初始化
     -------------------------*/
  (async function init() {
    createBadge();
    // 预先创建面板，但保持隐藏
    await createPanel();
    await createSettingsPanel();
    createSearchIcon();

    // GM 菜单注册
    GM_registerMenuCommand('打开/关闭题库面板', () => togglePanel());
    GM_registerMenuCommand('划词搜索 - 设置', () => showSettingsPanel());
  })();

})();

