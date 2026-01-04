// ==UserScript==
// @name         Fishing 一键赠送（每种自定义保留）
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  遍历已发现鱼卡，填写 UID=11233，数量=拥有数量-保留数量（不足则跳过），依次点击“赠送”；自动拦截 alert。
// @match        https://si-qi.xyz/siqi_fishing.php
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557043/Fishing%20%E4%B8%80%E9%94%AE%E8%B5%A0%E9%80%81%EF%BC%88%E6%AF%8F%E7%A7%8D%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BF%9D%E7%95%99%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557043/Fishing%20%E4%B8%80%E9%94%AE%E8%B5%A0%E9%80%81%EF%BC%88%E6%AF%8F%E7%A7%8D%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BF%9D%E7%95%99%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  const PANEL_ID = 'gift-all-fish-panel';
  if (document.getElementById(PANEL_ID)) {
    console.log('[GiftAll] 面板已存在');
    return;
  }

  // 拦截全局 alert，自动关闭并打印日志
  (function interceptAlert() {
    const oldAlert = window.alert;
    window.alert = function(msg) {
      console.log('[GiftAll][alert]', msg);
      return; // 不再弹窗
    };
    console.log('[GiftAll] 已拦截 window.alert()');
  })();

  const css = `
  #${PANEL_ID}{
    position:fixed;right:16px;bottom:16px;z-index:99999;
    background:#111827cc; color:#e5e7eb; backdrop-filter: blur(6px);
    padding:12px;border-radius:12px; box-shadow: 0 8px 24px rgba(0,0,0,.25);
    font-family: ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;
    width: 300px;
  }
  #${PANEL_ID} h4{margin:0 0 10px 0;font-size:14px;font-weight:700;display:flex;align-items:center;gap:6px}
  #${PANEL_ID} label{display:block;font-size:12px;color:#cbd5e1;margin:6px 0 4px}
  #${PANEL_ID} input{
    width:100%;padding:3px;border-radius:8px;border:1px solid #374151;background:#0b1220;color:#e5e7eb;
    outline:none;
  }
  #${PANEL_ID} .row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  #${PANEL_ID} button{
    margin-top:10px;width:100%;padding:9px 10px;border:none;border-radius:10px;
    background:#10b981;color:#062c22;font-weight:700;cursor:pointer
  }
  #${PANEL_ID} button[disabled]{opacity:.5;cursor:not-allowed}
  #${PANEL_ID} .muted{font-size:11px;color:#94a3b8;margin-top:8px}
  #${PANEL_ID} .log{max-height:120px;overflow:auto;font-size:12px;background:#0b1220;border:1px solid #1f2937;border-radius:8px;padding:6px;margin-top:8px;white-space:pre-wrap}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <h4>🎁 一键赠送（每种自定义保留）</h4>
    <div class="row">
      <div>
        <label>目标UID</label>
        <input id="gift-uid" type="number" min="1" value="11233" />
      </div>
      <div>
        <label>点击间隔(ms)</label>
        <input id="gift-delay" type="number" min="0" value="600" />
      </div>
    </div>
    <label>每种保留数量</label>
    <input id="gift-keep" type="number" min="0" value="1" />
    <button id="gift-run">开始赠送</button>
    <div class="muted" id="gift-muted">
      仅对“拥有数量 &gt; 保留数量”的鱼卡进行赠送，赠送数量=拥有数量-保留数量。
    </div>
    <div class="log" id="gift-log"></div>
  `;
  document.body.appendChild(panel);

  const logBox = panel.querySelector('#gift-log');
  const btn = panel.querySelector('#gift-run');
  const uidInput = panel.querySelector('#gift-uid');
  const delayInput = panel.querySelector('#gift-delay');
  const keepInput = panel.querySelector('#gift-keep');
  const mutedBox = panel.querySelector('#gift-muted');

  let running = false;
  const log = (...args) => {
    console.log('[GiftAll]', ...args);
    const line = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    logBox.textContent += (logBox.textContent ? '\n' : '') + line;
    logBox.scrollTop = logBox.scrollHeight;
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const getOwned = (card) => {
    for (const d of card.querySelectorAll('div')) {
      const m = d.textContent && d.textContent.match(/拥有数量：\s*(\d+)/);
      if (m) return parseInt(m[1], 10) || 0;
    }
    return 0;
  };

  const setVal = (el, val) => {
    if (!el) return;
    const desc = Object.getOwnPropertyDescriptor(el.__proto__, 'value');
    if (desc && desc.set) desc.set.call(el, val); else el.value = val;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };

  async function giftKeepN(uid, clickDelay, keepN) {
    const cards = Array.from(document.querySelectorAll('.codex-card.discovered:not(.discovered-noany)'))
      .filter(c => c.querySelector('.gift-form'));

    if (!cards.length) {
      log('未找到可赠送的鱼卡（检查选择器或页面是否加载完成）');
      return;
    }

    let total = 0, clicked = 0, skipped = 0, failed = 0;

    for (const card of cards) {
      total++;
      const owned = getOwned(card);

      // 拥有数量 <= 保留数量 直接跳过；否则 giftQty = owned - keepN
      if (!owned || owned <= keepN) { skipped++; continue; }
      const giftQty = Math.max(owned - keepN, 0);

      const form = card.querySelector('.gift-form');
      const uidEl  = form && form.querySelector('[data-gift-uid]');
      const fishId = uidEl ? uidEl.getAttribute('data-gift-uid') : null;
      const qtyEl  = fishId ? form.querySelector(`[data-gift-qty="${CSS.escape(fishId)}"]`) : null;
      const btnEl  = fishId ? form.querySelector(`[data-gift="${CSS.escape(fishId)}"]`) : null;

      if (!uidEl || !qtyEl || !btnEl || btnEl.disabled) { skipped++; continue; }

      try {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setVal(uidEl, String(uid));
        setVal(qtyEl, String(giftQty));
        await sleep(60);
        btnEl.click();
        clicked++;
        log(`已赠送 #${fishId} × ${giftQty}（原持有 ${owned}，保留 ${keepN}）→ UID ${uid}`);
        await sleep(clickDelay);
      } catch (e) {
        failed++;
        log(`失败 #${fishId}: ${e && e.message ? e.message : e}`);
      }
    }
    log(`完成：扫描 ${total}，点击 ${clicked}，跳过 ${skipped}，失败 ${failed}`);
  }

  // 动态更新说明文字
  function refreshMuted() {
    const keepN = Math.max(0, parseInt(keepInput.value || '1', 10) || 0);
    mutedBox.textContent = `仅对“拥有数量 > ${keepN}”的鱼卡进行赠送，赠送数量=拥有数量-${keepN}。`;
  }
  keepInput.addEventListener('input', refreshMuted);
  refreshMuted();

  btn.addEventListener('click', async () => {
    if (running) return;
    running = true;
    btn.disabled = true;
    logBox.textContent = '';

    const uid = (uidInput.value || '11233').trim();
    const delay = Math.max(0, parseInt(delayInput.value || '600', 10) || 0);
    const keepN = Math.max(0, parseInt(keepInput.value || '1', 10) || 0);

    log(`开始执行（每种保留 ${keepN}）→ UID ${uid}，间隔 ${delay}ms`);
    await giftKeepN(uid, delay, keepN);

    btn.disabled = false;
    running = false;
    log('—— 任务已结束 ——');
  });
})();