// ==UserScript==
// @name         学习通自动阅读脚本
// @namespace    n/a
// @version      1.2.0
// @description  通用阅读辅助：自动缓慢滚动、拟人停顿、到底自动翻页（找不到就停）、可选后台继续、可选手动操作暂停、带悬浮控制面板
// @author       Albert_Li
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559571/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/559571/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULTS = {
    stepMin: 80,
    stepMax: 160,
    delayMin: 1600,
    delayMax: 3200,

    pauseChance: 0.12,
    pauseMin: 3500,
    pauseMax: 6500,

    smooth: true,
    stopAtBottom: true,

    autoNextPage: true,
    pageWaitMin: 2500,
    pageWaitMax: 4500,
    afterClickWait: 3000,

    // 新增开关
    allowBackground: false,     // 后台继续（默认关闭）
    pauseOnUserInput: true      // 手动操作时暂停（默认开启）
  };

  // ---------- utils ----------
  const rand = (a, b) => Math.random() * (b - a) + a;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function nearBottom() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const height = window.innerHeight || doc.clientHeight || 0;
    const scrollHeight = doc.scrollHeight || document.body.scrollHeight || 0;
    return scrollTop + height >= scrollHeight - 8;
  }

  function isVisible(el) {
    if (!el) return false;
    if (el.disabled) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    return el.getClientRects().length > 0;
  }

  // ---------- next page finder ----------
  function findNextPageButton() {
    const textSet = new Set(["下一页", "下一章", "下页", "Next", "next", ">", "»"]);
    const candidates = Array.from(document.querySelectorAll("a, button, li, span, div"));

    // 1) 文本匹配
    for (const el of candidates) {
      const t = (el.innerText || "").trim();
      if (t.length > 6) continue;
      if (textSet.has(t) && isVisible(el)) return el;
    }

    // 2) 常见 next class/id
    const selectors = [
      "a.next", "button.next", ".nextPage", ".xl-nextPage",
      "[class*='nextPage']", "[id*='nextPage']",
      "[class*='next']", "[id*='next']"
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (isVisible(el)) return el;
    }

    // 3) active -> next sibling
    const active = document.querySelector(".active, .xl-active, [aria-current='page']");
    if (active && active.nextElementSibling && isVisible(active.nextElementSibling)) {
      return active.nextElementSibling;
    }

    // 4) rel=next
    const relNext = document.querySelector("a[rel='next']");
    if (isVisible(relNext)) return relNext;

    return null;
  }

  // ---------- state ----------
  let running = false;
  let timer = null;
  let cfg = { ...DEFAULTS };

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function setStatus(t) {
    const el = document.getElementById("asr_status");
    if (el) el.textContent = t;
  }

  function setButtonText() {
    const btn = document.getElementById("asr_btn");
    if (btn) btn.textContent = running ? "暂停" : "开始";
  }

  function stop(reason) {
    running = false;
    clearTimer();
    setStatus(`已暂停${reason ? "：" + reason : ""}`);
    setButtonText();
  }

  function scheduleNext() {
    if (!running) return;

    // 后台策略：默认后台暂停；若 allowBackground=true 则继续
    if (document.hidden && !cfg.allowBackground) {
      stop("页面在后台");
      return;
    }

    // 到底：翻页 or 停止
    if (cfg.stopAtBottom && nearBottom()) {
      if (cfg.autoNextPage) {
        setStatus("已读完本页，准备翻页…");
        const wait = rand(cfg.pageWaitMin, cfg.pageWaitMax);

        timer = setTimeout(() => {
          const nextBtn = findNextPageButton();
          if (!nextBtn) {
            stop("未找到下一页按钮");
            return;
          }

          try {
            nextBtn.click();
            setStatus("已尝试翻页，等待加载…");

            timer = setTimeout(() => {
              if (!running) return;
              setStatus("继续阅读…");
              scheduleNext();
            }, cfg.afterClickWait);
          } catch (e) {
            stop("点击翻页失败");
          }
        }, wait);

        return;
      }

      stop("到底了");
      return;
    }

    // 正常滚动
    const step = rand(cfg.stepMin, cfg.stepMax);
    const doPause = Math.random() < cfg.pauseChance;
    const delay = doPause ? rand(cfg.pauseMin, cfg.pauseMax) : rand(cfg.delayMin, cfg.delayMax);

    window.scrollBy({
      top: step,
      left: 0,
      behavior: cfg.smooth ? "smooth" : "auto"
    });

    timer = setTimeout(scheduleNext, delay);
  }

  function start() {
    if (running) return;
    running = true;
    setStatus(cfg.allowBackground ? "运行中…（允许后台继续）" : "运行中…（切后台会暂停）");
    setButtonText();
    scheduleNext();
  }

  function toggle() {
    if (running) stop();
    else start();
  }

  // ---------- UI ----------
  GM_addStyle(`
    #asr_panel{
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: 300px;
      z-index: 999999;
      background: rgba(20,20,25,0.88);
      color: #fff;
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
      font: 13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,"PingFang SC","Microsoft YaHei",sans-serif;
      overflow: hidden;
      user-select: none;
    }
    #asr_panel header{
      padding: 10px 12px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      background: rgba(255,255,255,0.06);
    }
    #asr_title{font-weight: 700; letter-spacing: .2px;}
    #asr_status{opacity:.9; font-size:12px; margin-top:2px;}
    #asr_body{padding: 10px 12px 12px;}
    #asr_btn{
      border: 0;
      padding: 8px 10px;
      border-radius: 10px;
      cursor: pointer;
      background: #3A8BFF;
      color: #fff;
      font-weight: 700;
    }
    #asr_btn:hover{filter: brightness(1.05);}
    .asr_row{margin-top:10px;}
    .asr_row label{display:flex; justify-content:space-between; align-items:center; gap:10px;}
    .asr_row input[type="range"]{width: 160px;}
    .asr_hint{opacity:.75; font-size:12px; margin-top:8px;}
    #asr_close{
      cursor:pointer;
      opacity:.8;
      padding: 6px 8px;
      border-radius: 8px;
    }
    #asr_close:hover{background: rgba(255,255,255,0.08); opacity:1;}
  `);

  const panel = document.createElement("div");
  panel.id = "asr_panel";
  panel.innerHTML = `
    <header>
      <div>
        <div id="asr_title">Auto Scroll Reader</div>
        <div id="asr_status">就绪</div>
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        <button id="asr_btn">开始</button>
        <div id="asr_close" title="隐藏面板">✕</div>
      </div>
    </header>
    <div id="asr_body">
      <div class="asr_row">
        <label>
          <span>步长</span>
          <input id="asr_step" type="range" min="40" max="260" value="120">
          <span id="asr_step_v">120px</span>
        </label>
      </div>

      <div class="asr_row">
        <label>
          <span>速度</span>
          <input id="asr_speed" type="range" min="800" max="4500" value="2200">
          <span id="asr_speed_v">2.2s</span>
        </label>
      </div>

      <div class="asr_row">
        <label style="justify-content:flex-start; gap:8px;">
          <input id="asr_smooth" type="checkbox" checked>
          <span>平滑滚动</span>
        </label>
      </div>

      <div class="asr_row">
        <label style="justify-content:flex-start; gap:8px;">
          <input id="asr_bottom" type="checkbox" checked>
          <span>到底停止</span>
        </label>
      </div>

      <div class="asr_row">
        <label style="justify-content:flex-start; gap:8px;">
          <input id="asr_next" type="checkbox" checked>
          <span>自动翻页</span>
        </label>
      </div>

      <div class="asr_row">
        <label style="justify-content:flex-start; gap:8px;">
          <input id="asr_bg" type="checkbox">
          <span>后台继续</span>
        </label>
      </div>

      <div class="asr_row">
        <label style="justify-content:flex-start; gap:8px;">
          <input id="asr_pause_user" type="checkbox" checked>
          <span>手动时暂停</span>
        </label>
      </div>

      <div class="asr_hint">
        建议：把“后台继续”当成无障碍辅助功能用，别开着人就走。
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  const stepRange = document.getElementById("asr_step");
  const speedRange = document.getElementById("asr_speed");
  const stepV = document.getElementById("asr_step_v");
  const speedV = document.getElementById("asr_speed_v");
  const smoothCk = document.getElementById("asr_smooth");
  const bottomCk = document.getElementById("asr_bottom");
  const nextCk = document.getElementById("asr_next");
  const bgCk = document.getElementById("asr_bg");
  const pauseUserCk = document.getElementById("asr_pause_user");

  function syncCfg() {
    const step = Number(stepRange.value);
    const speed = Number(speedRange.value);

    cfg.stepMin = clamp(step - 40, 20, 400);
    cfg.stepMax = clamp(step + 40, 20, 500);
    cfg.delayMin = clamp(speed - 700, 200, 8000);
    cfg.delayMax = clamp(speed + 700, 200, 9000);

    cfg.smooth = !!smoothCk.checked;
    cfg.stopAtBottom = !!bottomCk.checked;
    cfg.autoNextPage = !!nextCk.checked;

    cfg.allowBackground = !!bgCk.checked;
    cfg.pauseOnUserInput = !!pauseUserCk.checked;

    stepV.textContent = `${step}px`;
    speedV.textContent = `${(speed / 1000).toFixed(1)}s`;

    if (running) {
      setStatus(cfg.allowBackground ? "运行中…（允许后台继续）" : "运行中…（切后台会暂停）");
    }
  }

  [stepRange, speedRange].forEach(el => el.addEventListener("input", syncCfg));
  [smoothCk, bottomCk, nextCk, bgCk, pauseUserCk].forEach(el => el.addEventListener("change", syncCfg));

  document.getElementById("asr_btn").addEventListener("click", () => {
    syncCfg();
    toggle();
  });

  document.getElementById("asr_close").addEventListener("click", () => {
    panel.style.display = "none";
    stop("面板已隐藏（刷新可恢复）");
  });

  // 手动操作时暂停：做成开关
  function onUserInputPause() {
    if (running && cfg.pauseOnUserInput) stop("检测到手动操作");
  }
  ["wheel", "keydown", "touchstart", "mousedown"].forEach((ev) => {
    window.addEventListener(ev, onUserInputPause, { passive: true });
  });

  // 可见性变化：仅当不允许后台时才暂停
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && running && !cfg.allowBackground) stop("页面在后台");
  });

  syncCfg();
  setButtonText();
})();
