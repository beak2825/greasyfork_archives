// ==UserScript==
// @name         ChatGPT Limit Render（限制渲染｜解决长对话卡顿与崩溃）
// @namespace    https://github.com/hu-qihang/chatgpt-limit-render
// @version      0.1.2
// @description  解决 ChatGPT 网页端长对话卡顿、无响应、崩溃问题（限制渲染）
// @match        https://chatgpt.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561689/ChatGPT%20Limit%20Render%EF%BC%88%E9%99%90%E5%88%B6%E6%B8%B2%E6%9F%93%EF%BD%9C%E8%A7%A3%E5%86%B3%E9%95%BF%E5%AF%B9%E8%AF%9D%E5%8D%A1%E9%A1%BF%E4%B8%8E%E5%B4%A9%E6%BA%83%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561689/ChatGPT%20Limit%20Render%EF%BC%88%E9%99%90%E5%88%B6%E6%B8%B2%E6%9F%93%EF%BD%9C%E8%A7%A3%E5%86%B3%E9%95%BF%E5%AF%B9%E8%AF%9D%E5%8D%A1%E9%A1%BF%E4%B8%8E%E5%B4%A9%E6%BA%83%EF%BC%89.meta.js
// ==/UserScript==

/*
============================================================
ChatGPT Limit Render（限制渲染 / 防卡顿崩溃）用户说明
作者：胡启航
反馈邮箱：ihuqihang@icloud.com
适用网站：chatgpt.com（网页版）
适用工具：Chrome + Tampermonkey（油猴）
本脚本完全免费、开源、无任何强制收费行为，仅用于改善 ChatGPT 网页端使用体验。
============================================================

一、这个脚本是干什么的？
--------------------------------------------
如果你在 ChatGPT 网页端长期使用“超长对话”，通常会遇到：
- 回答生成过程中网页一卡一卡（明显掉帧、输入延迟）
- 发送消息后页面无响应，甚至弹出“页面没有响应/等待/退出”
- 滚动卡顿、CPU 占用升高、内存持续上涨

这些问题的常见原因是：
- 对话越长，页面上要渲染的历史消息（DOM 节点）越多
- 浏览器每次更新页面（尤其是回答流式生成时）都要处理大量节点
- 最终导致主线程阻塞 → 页面无响应/崩溃

本脚本的核心思路是：
【限制渲染（Limit Render）】——只让页面“渲染/显示”最近的 N 轮对话，
把更早的历史对话从页面中“减负”（隐藏或从 DOM 移除，并用占位符替代），
从而显著降低崩溃概率，让长对话能持续使用。

重要提示（很多人会误解）：
- 本脚本限制的是“网页渲染负担”，不是删除你的对话。
- 它不会主动改写你的提问或回答内容。
- 是否影响模型的上下文记忆取决于 ChatGPT 官方前端/后端的实现机制。
  通常情况下，限制网页渲染 ≠ 模型失忆。本脚本的目标是“网页稳定”。

二、你能得到什么效果？
--------------------------------------------
- 长对话更不容易崩溃
- 发送消息后更不容易“页面无响应”
- 滚动更顺滑，整体卡顿降低
- 即使历史很多，也能继续用同一条对话

三、右下角面板每个按钮是什么意思？
--------------------------------------------
脚本启用后，页面右下角会出现一个面板（Limit Render）。

1）ON 开关
- ON：脚本生效
- OFF：脚本暂停（页面恢复为原始状态，显示全部对话）

2）Default turns（默认轮数）
- 表示平时页面“最多保留渲染”的对话轮数。
- 1 轮 = 你问一次 + GPT 回答一次（通常算作一组）
- 建议：如果你机器性能一般或经常崩溃，Default 设置小一些（如 14~18）

3）Safe turns（安全轮数）
- 表示“救命档”的渲染轮数。
- 当你点击发送、或检测到卡顿风险时，脚本会临时收缩到 Safe turns。
- 建议：Safe 越小越稳定（如 6~10）。你之前 20 轮左右就会崩溃，Safe 建议偏小。

4）Shrink（收缩）
- 立即将页面渲染轮数切换到 Safe turns（性能优先/救命档）。
- 适用场景：
  - 你感觉页面开始变慢
  - 你准备发送一个很长的问题
  - 你担心再发送会卡死
  点击 Shrink 先降载，再继续操作。

5）Restore（恢复）
- 立即将页面渲染轮数切回 Default turns（可读性优先）。
- 适用场景：
  - 页面稳定了，你想多看一点上下文
  - 你刚刚 Shrink 后希望恢复更大的阅读窗口

6）Pre-send auto-shrink（发送前自动收缩）
- 开启后：你点击“发送”或回车发送时，脚本会自动切到 Safe turns，发送完成/生成结束后再恢复。
- 强烈建议保持开启：这是降低“发送后崩溃”的关键。

7）Freeze guard（卡死保护）
- 开启后：如果检测到主线程疑似长时间阻塞（页面接近“无响应”），脚本会自动强制进入 Safe turns 进行降载。
- 强烈建议保持开启。

四、占位符 Show/Hide 是什么？
--------------------------------------------
当历史对话被限制渲染后，较早的消息会显示为“占位条”（placeholder），并提供按钮：
- Show：临时展开/插回该条历史内容（用于回看）
- Hide：再次收起该条历史内容（回到减负状态）

提示：
- 如果你连续展开很多条历史，就等于把负担又加回来了，页面可能再次变慢。
- 建议：只在需要回看时展开少数几条，看完就 Hide。

五、推荐参数（按电脑性能分档）
--------------------------------------------
你可以在面板里改，也可以在代码 CFG 里改。

1）稳定优先（适合你这种 20 轮左右会崩溃的情况）
- Default turns：14~18
- Safe turns：6~8
- Pre-send auto-shrink：开启
- Freeze guard：开启

2）平衡模式（电脑中等，偶尔卡）
- Default turns：20~25
- Safe turns：8~10
- 其余保持开启

3）可读性优先（电脑很强，主要想少滚动）
- Default turns：30+
- Safe turns：10~12
- 若仍崩溃，优先把 Safe 降低，其次再降 Default

六、常见问题（FAQ）
--------------------------------------------
Q1：为什么我开启脚本后，生成回答时仍然会偶尔卡？
A：回答生成是“流式输出”，最后一条消息不断追加文字，天然会有渲染压力。
   脚本的目标是把“历史 DOM 负担”降到可控，从而避免最终崩溃。
   如果仍卡，优先把 Safe turns 调小（例如 10 → 6），并减少展开的历史条数。

Q2：我点了很多 Show，页面又开始卡了怎么办？
A：Show 相当于把旧内容再插回页面，会增加负担。建议：
   - 先 Hide 不必要的展开内容
   - 点 Shrink 进入安全档
   - 仍不行就刷新页面（Ctrl+F5）

Q3：脚本会不会把我的聊天记录删掉？
A：脚本如果采用“从 DOM 移除再插回”的方式，它只是减少网页渲染节点，
   并不会主动删除你的账号对话历史。你的对话是否存在由 ChatGPT 服务端决定。

Q4：为什么我修改脚本后没有生效？
A：请按顺序做：
   - Tampermonkey 保存脚本（Ctrl+S）
   - 回到 chatgpt.com 页面按 Ctrl+F5 强刷
   - 确认面板存在且 ON 已开启

七、安全与隐私说明
--------------------------------------------
- 本脚本不需要你输入账号密码。
- 本脚本不应主动把你的对话内容发送到任何第三方服务器。
- 你的对话内容属于敏感信息，请谨慎安装来源不明的脚本。
- 如果你对安全有疑虑，可自行查看脚本代码，确认没有外部上传逻辑。

八、反馈联系
--------------------------------------------
如果你在使用中遇到以下情况，欢迎联系作者：
- 仍然会崩溃（请告知你的 Default/Safe 参数、Chrome 版本、是否多标签页）
- Show/Hide 不稳定
- 面板不显示或行为异常
- 想新增功能（例如快捷键、自动清理、更多状态显示等）

联系邮箱：
ihuqihang@icloud.com

九、在线乞讨
--------------------------------------------
- 本脚本完全免费、无广告、无强制收费。
- 如果它确实帮你解决了实际问题，欢迎自愿打赏支持作者的持续维护（打赏途径在脚本发布网站的本脚本发布页）。
- 你的支持将用于修复问题、适配新版本以及最重要的长期维护。
![支付宝](https://github.com/hu-qihang/chatgpt-limit-render/releases/tag/0.1.1)

## 更新日志

### v0.1.1
- 修复 Show / Hide 不稳定的问题
- 优化 DOM 监听逻辑，避免状态闪动
- 显著降低长对话页面崩溃概率

### v0.1.0
- 初始发布
- 支持限制渲染、自动安全收缩、卡死保护

============================================================
*/

(() => {
    if (window.__lr_booted) return;
window.__lr_booted = true;

  'use strict';

  /** =========================
   *  Config (default values)
   *  ========================= */
  const CFG = {
    enabled: true,

    // Default rendered turns (1 turn = user + assistant). Older turns become lightweight placeholders.
    renderTurnsDefault: 15,

    // "Safe mode" rendered turns used during send or when freeze is detected
    renderTurnsSafe: 6,

    // Pre-send self-check: temporarily shrink to safe turns before sending
    preSendAutoShrink: true,

    // After sending, restore to default after delay (ms)
    restoreDelayMs: 1200,

    // Freeze guard: if main thread looks blocked for >= threshold, force shrink to safe turns
    freezeGuardEnabled: true,
    freezeThresholdMs: 6500,

    // Placeholder height (px) for each hidden turn; keeps scroll position roughly stable
    placeholderHeightPx: 44,

    // Debug logs
    debug: false,
  };

    let isStreaming = false;
    let lastStreamActivityAt = 0;
    let isApplying = false;


  /** =========================
   *  Utilities
   *  ========================= */
  const log = (...args) => CFG.debug && console.log('[LimitRender]', ...args);

  function debounce(fn, wait) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function now() { return performance.now(); }

  /** =========================
   *  UI Panel
   *  ========================= */
  function createPanel() {
    const existing = document.getElementById('lr-panel');
    if (existing) return existing;
    const panel = document.createElement('div');
    panel.id = 'lr-panel';
    panel.style.cssText = `
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 999999;
      font: 12px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: #111;
      background: rgba(255,255,255,0.92);
      border: 1px solid rgba(0,0,0,0.12);
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      padding: 10px 10px 8px;
      width: 220px;
      user-select: none;
    `;
    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div style="font-weight:600;">Limit Render</div>
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
          <input id="lr-enabled" type="checkbox" style="margin:0;" ${CFG.enabled ? 'checked' : ''}/>
          <span>ON</span>
        </label>
      </div>

      <div style="display:grid;grid-template-columns: 1fr 70px;gap:6px;align-items:center;">
        <div>Default turns</div>
        <input id="lr-default" type="number" min="5" max="300" value="${CFG.renderTurnsDefault}"
               style="width:70px;padding:2px 6px;border:1px solid rgba(0,0,0,0.18);border-radius:6px;"/>
        <div>Safe turns</div>
        <input id="lr-safe" type="number" min="5" max="120" value="${CFG.renderTurnsSafe}"
               style="width:70px;padding:2px 6px;border:1px solid rgba(0,0,0,0.18);border-radius:6px;"/>
      </div>

      <div style="display:flex;gap:8px;margin-top:8px;align-items:center;justify-content:space-between;">
        <button id="lr-shrink" style="flex:1;padding:6px 8px;border-radius:8px;border:1px solid rgba(0,0,0,0.18);background:#fff;cursor:pointer;">Shrink</button>
        <button id="lr-restore" style="flex:1;padding:6px 8px;border-radius:8px;border:1px solid rgba(0,0,0,0.18);background:#fff;cursor:pointer;">Restore</button>
      </div>

      <div style="margin-top:8px;display:flex;align-items:center;gap:6px;">
        <input id="lr-presend" type="checkbox" style="margin:0;" ${CFG.preSendAutoShrink ? 'checked' : ''}/>
        <label for="lr-presend" style="cursor:pointer;">Pre-send auto-shrink</label>
      </div>

      <div style="margin-top:6px;display:flex;align-items:center;gap:6px;">
        <input id="lr-freeze" type="checkbox" style="margin:0;" ${CFG.freezeGuardEnabled ? 'checked' : ''}/>
        <label for="lr-freeze" style="cursor:pointer;">Freeze guard</label>
      </div>

      <div id="lr-status" style="margin-top:8px;color:rgba(0,0,0,0.65);">
        Status: idle
      </div>
    `;

    document.documentElement.appendChild(panel);

    const $ = (id) => panel.querySelector(id);

    $('#lr-enabled').addEventListener('change', (e) => {
      CFG.enabled = e.target.checked;
      setStatus(CFG.enabled ? 'enabled' : 'disabled');
      scheduleApply();
    });

    $('#lr-default').addEventListener('change', (e) => {
      CFG.renderTurnsDefault = clampInt(e.target.value, 5, 300);
      e.target.value = CFG.renderTurnsDefault;
      scheduleApply();
    });

    $('#lr-safe').addEventListener('change', (e) => {
      CFG.renderTurnsSafe = clampInt(e.target.value, 5, 120);
      e.target.value = CFG.renderTurnsSafe;
    });

    $('#lr-presend').addEventListener('change', (e) => {
      CFG.preSendAutoShrink = e.target.checked;
    });

    $('#lr-freeze').addEventListener('change', (e) => {
      CFG.freezeGuardEnabled = e.target.checked;
    });

    $('#lr-shrink').addEventListener('click', () => {
      forceShrinkSafe('manual');
    });

    $('#lr-restore').addEventListener('click', () => {
      forceRestoreDefault('manual');
    });

    return panel;
  }

  function clampInt(v, min, max) {
    const n = Number.parseInt(String(v), 10);
    if (Number.isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  let lastStatusText = '';
  function setStatus(text) {
  const next = `Status: ${text}`;
  if (next === lastStatusText) return;
  lastStatusText = next;
  const el = document.getElementById('lr-status');
  if (el) el.textContent = next;
}


  /** =========================
   *  Core: find turns + limit rendering
   *  ========================= */

  // Heuristic selector for each "turn" container in ChatGPT UI
  function getTurnNodes() {
    // New UI frequently uses data-testid="conversation-turn"
    const a = Array.from(document.querySelectorAll('[data-testid="conversation-turn"]'));
    if (a.length) return a;

    // Fallback: try article blocks inside main
    const main = document.querySelector('main');
    if (!main) return [];
    const b = Array.from(main.querySelectorAll('article'));
    return b;
  }
  function getConversationRoot() {
  // 优先使用 main（ChatGPT 对话通常都在 main 内）
  const main = document.querySelector('main');
  if (main) return main;
  return document.body;
}

  // Placeholder nodes inserted for hidden turns
  const PLACEHOLDER_CLASS = 'lr-placeholder';
  // Store detached (removed) turns in memory so they are not in DOM
  const DETACHED_TURNS = new Map(); // key: data-lr-id, value: { node, parent, nextSibling }
  function makePlaceholder(indexFromStart) {
  const ph = document.createElement('div');
  ph.className = PLACEHOLDER_CLASS;
  ph.style.cssText = `
    height: ${CFG.placeholderHeightPx}px;
    margin: 6px 0;
    border-radius: 10px;
    border: 1px dashed rgba(0,0,0,0.18);
    background: rgba(0,0,0,0.02);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    color: rgba(0,0,0,0.6);
    font-size: 12px;
  `;

  ph.innerHTML = `
    <span>Hidden earlier turn #${indexFromStart + 1}</span>
    <button data-lr-toggle="1"
      style="padding:4px 8px;border-radius:8px;border:1px solid rgba(0,0,0,0.18);background:#fff;cursor:pointer;">
      Show
    </button>
  `;

  const btn = ph.querySelector('button[data-lr-toggle="1"]');

  btn.addEventListener('click', () => {
    const targetId = ph.getAttribute('data-lr-target-id');
    if (!targetId) return;

    const shown = ph.getAttribute('data-lr-shown') === '1';

    if (!shown) {
      // SHOW：优先从 detached pool 拿回节点插回 DOM
      const rec = getDetachedRecord(targetId);
      if (rec && rec.node) {
        rec.node.setAttribute('data-lr-pinned', '1'); // 用户手动展开 → pinned
        ph.parentNode?.insertBefore(rec.node, ph.nextSibling);

        // 关键：插回后，这个 id 不再属于 detached
        DETACHED_TURNS.delete(targetId);
      } else {
        // 兜底：若节点已在 DOM（例如被应用重建），直接 pinned
        const existing = document.querySelector(`[data-lr-id="${cssEscape(targetId)}"]`);
        if (existing) existing.setAttribute('data-lr-pinned', '1');
      }

      ph.setAttribute('data-lr-shown', '1');
      btn.textContent = 'Hide';
      ph.querySelector('span').textContent = `Shown earlier turn #${indexFromStart + 1}`;
      setStatus('shown one turn');
    } else {
      // HIDE：从 DOM 再 detach，并放回 detached pool
      const node = document.querySelector(`[data-lr-id="${cssEscape(targetId)}"]`);
      if (node && node.parentNode) {
        DETACHED_TURNS.set(targetId, {
          node,
          parent: node.parentNode,
          nextSibling: node.nextSibling
        });
        node.removeAttribute('data-lr-pinned');
        node.parentNode.removeChild(node);
      }

      ph.removeAttribute('data-lr-shown');
      btn.textContent = 'Show';
      ph.querySelector('span').textContent = `Hidden earlier turn #${indexFromStart + 1}`;
      setStatus('hidden one turn');
    }
  });

  return ph;
}




  // Assign stable IDs to turn nodes
  function ensureTurnIds(turns) {
    for (let i = 0; i < turns.length; i++) {
      const t = turns[i];
      if (!t.hasAttribute('data-lr-id')) {
        // Use increment + timestamp; stability within page session
        t.setAttribute('data-lr-id', `${Date.now()}-${i}-${Math.random().toString(16).slice(2)}`);
      }
    }
  }

  function cssEscape(s) {
    // minimal escape for attribute selector
    return String(s).replace(/"/g, '\\"');
  }
  function isInDom(node) {
  return !!(node && node.nodeType === 1 && document.documentElement.contains(node));
  }

  function getDetachedRecord(id) {
  const rec = DETACHED_TURNS.get(id);
  if (!rec) return null;
  // 如果记录里 node 已经不在 DOM，说明确实是 detached
  // 如果 node 在 DOM，说明它已经被插回来了，此时这个 rec 应该视为“过期”
  if (rec.node && isInDom(rec.node)) return null;
  return rec;
  }


  function clearPlaceholders() {
  // 只清理“重复”或“已无必要”的 placeholder：
  // - 如果 target turn 当前在 DOM 且被 pinned/显示，则保留 placeholder（用于 Hide）
  // - 如果 target turn 当前在 DOM 且未 pinned（说明它是正常渲染的 turn），移除 placeholder
  // - 如果 target turn 不在 DOM（detached），必须保留 placeholder（用于 Show）
  document.querySelectorAll(`.${PLACEHOLDER_CLASS}`).forEach(ph => {
    const targetId = ph.getAttribute('data-lr-target-id');
    if (!targetId) {
      ph.remove();
      return;
    }
    const t = document.querySelector(`[data-lr-id="${cssEscape(targetId)}"]`);
    if (!t) {
      // detached：必须保留 placeholder
      return;
    }
    // 在 DOM：若 pinned（用户展开），保留；否则移除（因为它已正常显示）
    if (t.getAttribute('data-lr-pinned') === '1') return;
    ph.remove();
  });
}



  function applyLimit(renderTurns) {
    if (isApplying) return;

  isApplying = true;
  try {
    if (!CFG.enabled) {
      // Ensure all turns visible
      clearPlaceholders();
      getTurnNodes().forEach(t => (t.style.display = ''));
      return;
    }

    const turns = getTurnNodes();
    if (!turns.length) return;

    ensureTurnIds(turns);

    // show all first, then hide old ones
    clearPlaceholders();

    const keep = Math.max(1, renderTurns);
    const hideCount = Math.max(0, turns.length - keep);
    if (hideCount === 0) return;

    // Hide earliest turns and insert placeholders (lightweight)
    let hidden = 0;

  for (let i = 0; i < turns.length; i++) {
  if (turns.length - i <= keep) continue; // keep last N turns

  const t = turns[i];
  if (t.getAttribute('data-lr-pinned') === '1') continue; // pinned stays visible

  const id = t.getAttribute('data-lr-id');
  if (!id) continue;

  // If already detached and still not in DOM, skip detaching again
  const existingRec = getDetachedRecord(id);
  if (existingRec && existingRec.node && !isInDom(existingRec.node)) {
  continue;
  }


  const parent = t.parentNode;
  const nextSibling = t.nextSibling;

  // Detach from DOM (real DOM reduction)
  if (parent) {
    DETACHED_TURNS.set(id, { node: t, parent, nextSibling });
    parent.removeChild(t);
  }

  // Insert placeholder at original position (before nextSibling)
  const ph = makePlaceholder(i);
  ph.setAttribute('data-lr-target-id', id);

  if (parent) parent.insertBefore(ph, nextSibling);

  hidden++;
  }

   setStatus(`rendering last ${keep} turns (hidden ${hidden})`);

   }finally {
    isApplying = false;
  }
  }

  const scheduleApply = debounce(() => {
    applyLimit(CFG.renderTurnsDefault);
  }, 250);

  /** =========================
   *  Pre-send auto shrink
   *  ========================= */
  let restoreTimer = null;

  function forceShrinkSafe(reason) {
    if (!CFG.enabled) return;
    clearTimeout(restoreTimer);
    applyLimit(CFG.renderTurnsSafe);
    setStatus(`safe shrink (${reason})`);
  }

  function forceRestoreDefault(reason) {
    if (!CFG.enabled) return;
    clearTimeout(restoreTimer);
    applyLimit(CFG.renderTurnsDefault);
    setStatus(`restored (${reason})`);
  }

  function scheduleRestore(reason) {
  clearTimeout(restoreTimer);
  restoreTimer = setTimeout(() => {
    if (isStreaming) {
      // still streaming; try later
      scheduleRestore(reason);
      return;
    }
    forceRestoreDefault(reason);
  }, CFG.restoreDelayMs);
  }


  function installPreSendHook() {
    // Capture click on common send buttons, plus Enter in textarea
    document.addEventListener('click', (e) => {
      if (!CFG.preSendAutoShrink || !CFG.enabled) return;

      const btn = e.target?.closest?.('button');
      if (!btn) return;

      // Best-effort: buttons that look like "Send"
      const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
      const testid = (btn.getAttribute('data-testid') || '').toLowerCase();

      if (aria.includes('send') || testid.includes('send') || aria.includes('发送') || aria.includes('submit')) {
        forceShrinkSafe('pre-send');
        scheduleRestore('post-send');
      }
    }, true);

    document.addEventListener('keydown', (e) => {
      if (!CFG.preSendAutoShrink || !CFG.enabled) return;

      // Enter to send (without Shift), inside textarea / contenteditable
      if (e.key !== 'Enter' || e.shiftKey) return;

      const el = e.target;
      const isTextArea = el && (el.tagName === 'TEXTAREA' || el.getAttribute?.('contenteditable') === 'true');
      if (!isTextArea) return;

      // Many UIs prevent default; still shrink early
      forceShrinkSafe('pre-send-enter');
      scheduleRestore('post-send');
    }, true);
  }

  /** =========================
   *  Freeze guard (detect main-thread stalls)
   *  ========================= */
  function installFreezeGuard() {
    let last = now();
    const tick = () => {
      const t = now();
      const delta = t - last;
      last = t;

      if (CFG.freezeGuardEnabled && CFG.enabled) {
        if (delta >= CFG.freezeThresholdMs) {
          // main thread stall detected
          forceShrinkSafe(`freeze ${Math.round(delta)}ms`);
          // do not auto-restore immediately; keep safe for a bit longer
          clearTimeout(restoreTimer);
          restoreTimer = setTimeout(() => {
            forceRestoreDefault('freeze-recover');
          }, Math.max(2500, CFG.restoreDelayMs));
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /** =========================
   *  Observe DOM changes
   *  ========================= */
  function installObserver() {
  const obs = new MutationObserver((mutations) => {
    if (!CFG.enabled) return;
    if (isApplying) return;
    // 判断是否是“新增 turn”（而不是文本流式追加）
    let addedTurn = false;

    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        for (const n of m.addedNodes) {
          if (!(n instanceof HTMLElement)) continue;

          // 新 UI: data-testid="conversation-turn"
          if (n.matches?.('[data-testid="conversation-turn"]') || n.querySelector?.('[data-testid="conversation-turn"]')) {
            addedTurn = true;
            break;
          }

          // Fallback: article 作为 turn
          if (n.matches?.('article') || n.querySelector?.('article')) {
            // 可能误伤，但比每次流式变动都触发要好
            addedTurn = true;
            break;
          }
        }
      }
      if (addedTurn) break;
    }

    // 另外：监测“正在生成”——只要最近有变动，就认为在流式输出
    if (addedTurn) {
      isStreaming = true;
      lastStreamActivityAt = performance.now();
    }


    // 流式期间不 apply，避免抖动；仅在新增 turn 时做一次轻量 apply
    if (addedTurn && !isStreaming) {
      scheduleApply();
    }
  });

  obs.observe(getConversationRoot(), { childList: true, subtree: true });


  // 生成结束检测：最近 800ms 没有任何 DOM 变动，就认为流式结束
  setInterval(() => {
    if (!CFG.enabled) return;
    if (!isStreaming) return;

    const idle = performance.now() - lastStreamActivityAt;
    if (idle >= 800) {
      isStreaming = false;
      // 流式结束后再 apply 一次
      scheduleApply();
    }
  }, 400);
}


  /** =========================
   *  Boot
   *  ========================= */
  function boot() {
    createPanel();
    installObserver();
    installPreSendHook();
    installFreezeGuard();

    // Initial apply after UI stabilizes
    setTimeout(() => applyLimit(CFG.renderTurnsDefault), 1200);
    setStatus('ready');
    log('booted');
  }

  // Run when DOM ready enough
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
