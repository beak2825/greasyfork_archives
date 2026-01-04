// ==UserScript==
// @name         QuillBot Pro Hub
// @namespace    quillbot.kyrillosatef.com
// @version      4.2.0
// @description  Premium Unlocker with Mobile Support, Changelog, Animations, Sounds & Refresh Timer
// @author       Kyrillos Atef
// @match        https://quillbot.com/*
// @icon         https://quillbot.com/favicon.png
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550092/QuillBot%20Pro%20Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/550092/QuillBot%20Pro%20Hub.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    version: "4.2.0",
    author: "Kyrillos Atef",
    primary: "#4361EE",
    premiumFeatures: [
      "Unlimited paraphrasing",
      "Paraphrase in unlimited modes",
      "Get advanced grammar recommendations",
      "Humanize text in Advanced mode",
      "Create custom summaries",
      "Access AI Detector (unlimited)",
      "Prevent accidental plagiarism"
    ],
    changelog: [
      "✅ Mobile-responsive UI (v4.2.0)",
      "📱 Panel auto-positions on small screens",
      "ℹ️ Added in-app changelog",
      "🔊 Fixed sound URLs & preloading",
      "🔒 Improved stealth & performance",
      "✨ Better toggle feedback & accessibility"
    ],
    refreshDelay: 5 // seconds
  };

  const STATE = {
    isActive: GM_getValue("premiumStatus", false),
    panelOpen: false,
    timerId: null,
    remaining: 0,
    showChangelog: false
  };

  // 🔊 Fixed sound URLs (no trailing spaces!)
  const sounds = {
    on: new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"),
    off: new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"),
    click: new Audio("https://actions.google.com/sounds/v1/buttons/button_click.ogg")
  };

  Object.values(sounds).forEach(s => {
    try {
      s.preload = "auto";
      s.load();
    } catch (e) {
      console.warn("[QuillBot Pro] Failed to preload sound:", e.message);
    }
  });

  const log = (type, msg) => {
    const prefix = type === "success" ? "✔️" : type === "error" ? "❌" : "ℹ️";
    console.log(`${prefix} [QuillBot Pro v${CONFIG.version}] ${msg}`);
  };

  const showToast = (msg, icon = "info") => {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon,
        title: msg,
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
        background: "#fff",
        color: "#2C3E50",
        customClass: { popup: 'qb-toast' }
      });
    } else {
      let el = document.getElementById("qb-fallback-toast");
      if (!el) {
        el = document.createElement("div");
        el.id = "qb-fallback-toast";
        Object.assign(el.style, {
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: "9999999",
          padding: "10px 14px",
          borderRadius: "8px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          background: "#fff",
          color: "#2C3E50",
          opacity: "0",
          transition: "opacity 0.3s"
        });
        document.body.appendChild(el);
      }
      el.textContent = msg;
      el.style.opacity = "1";
      setTimeout(() => { el.style.opacity = "0"; }, 2000);
    }
  };

  const playSound = (name) => {
    try {
      const audio = sounds[name];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    } catch (e) {}
  };

  // 🛠️ API Interceptor
  const apiInterceptor = {
    init() {
      try {
        ajaxHooker.hook((req) => {
          if (!/\/api\/v\d\/account|get-account-details/i.test(req.url)) return;

          const originalResponse = req.response;
          req.response = (res) => {
            if (typeof originalResponse === 'function') {
              try { originalResponse(res); } catch (e) {}
            }

            if (!STATE.isActive) return;

            try {
              const data = JSON.parse(res.responseText);
              const d = data.data || {};

              d.profile = {
                ...d.profile,
                premium: true,
                client_type: "premium",
                premium_tier: "premium_plus",
                subscription_expires_at: new Date(Date.now() + 365 * 864e5).toISOString()
              };

              const limitKeys = ['paraphraser', 'summarizer', 'ai_detector', 'plagiarism', 'co_writer'];
              d.limits = d.limits || {};
              limitKeys.forEach(key => {
                d.limits[key] = {
                  limit: 999999,
                  premium_limit: 999999,
                  used: Math.min(d.limits[key]?.used || 0, 999999)
                };
              });

              res.responseText = JSON.stringify(data);
              log("success", "Premium data injected for: " + req.url);
            } catch (err) {
              log("error", "Response modification failed: " + err.message);
            }
          };
        });
        log("system", "API interceptor active");
      } catch (e) {
        log("error", "Failed to initialize ajaxHooker: " + e.message);
      }
    }
  };

  // 🎨 UI Controller
  const UI = {
    injectStyles() {
      GM_addStyle(`
        :root { --qb-primary: ${CONFIG.primary}; }
        .qb-pro-hub {
          position: fixed;
          bottom: ${window.innerWidth < 500 ? '80px' : '22px'};
          right: 22px;
          z-index: 9999999;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .qb-pro-trigger {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--qb-primary);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(67, 97, 238, 0.28);
          transition: transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.32s;
        }
        .qb-pro-trigger:hover {
          transform: rotate(12deg) scale(1.06);
          box-shadow: 0 12px 30px rgba(67, 97, 238, 0.36);
        }
        .qb-pro-trigger:active {
          transform: scale(0.96);
        }
        .qb-pro-panel {
          position: absolute;
          bottom: 72px;
          right: 0;
          width: 320px;
          max-width: calc(100vw - 44px);
          background: white;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 16px 46px rgba(2, 6, 23, 0.18);
          opacity: 0;
          transform: translateY(18px) scale(0.98);
          transition: all 0.36s cubic-bezier(0.2, 1, 0.22, 1);
          pointer-events: none;
          font-size: 14px;
        }
        @media (max-width: 500px) {
          .qb-pro-panel {
            bottom: 72px;
            left: auto;
            right: 0;
            width: calc(100vw - 44px);
            max-width: none;
            font-size: 13px;
            padding: 16px;
          }
        }
        .qb-pro-panel.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .qb-pro-panel h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 700;
          color: #2C3E50;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .qb-changelog-toggle {
          background: none;
          border: none;
          color: #7f8c8d;
          cursor: pointer;
          font-size: 14px;
          padding: 2px;
        }
        .qb-changelog {
          margin-top: 12px;
          padding: 10px;
          background: #f8f9ff;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.4;
          display: none;
        }
        .qb-changelog.show {
          display: block;
        }
        .qb-pro-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .qb-features {
          font-size: 13px;
          color: #333;
          line-height: 1.45;
          margin-bottom: 12px;
        }
        .qb-pro-toggle-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.12s;
        }
        .qb-pro-toggle-btn:active {
          transform: scale(0.995);
        }
        .qb-refresh {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 13px;
          color: #95a5a6;
        }
        .qb-small-btn {
          padding: 6px 10px;
          border-radius: 8px;
          border: none;
          background: #f3f6ff;
          color: var(--qb-primary);
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
        }
        .qb-small-btn:hover {
          background: #e0eaff;
        }
      `);
    },

    createUI() {
      const hub = document.createElement("div");
      hub.className = "qb-pro-hub";
      hub.innerHTML = `
        <button class="qb-pro-trigger" aria-label="QuillBot Pro Hub" title="QuillBot Pro Hub">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="22" height="22">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
          </svg>
        </button>
        <div class="qb-pro-panel" role="dialog" aria-label="QuillBot Pro Panel">
          <h3>
            ⚡ QuillBot Pro Hub
            <button class="qb-changelog-toggle" id="qb-changelog-btn" aria-label="Show changelog">ℹ️</button>
          </h3>
          <div class="qb-pro-status" id="qb-status"></div>
          <div class="qb-features">${CONFIG.premiumFeatures.map(f => `• ${f}`).join("<br>")}</div>
          <div class="qb-changelog" id="qb-changelog">${CONFIG.changelog.map(item => `• ${item}`).join("<br>")}</div>
          <button class="qb-pro-toggle-btn" id="qb-toggle"></button>
          <div class="qb-refresh" id="qb-refresh-row" style="display:none">
            <div>🔄 Refreshing in <strong id="qb-remaining"></strong>s</div>
            <div style="display:flex;gap:6px">
              <button class="qb-small-btn" id="qb-reload-now">Now</button>
              <button class="qb-small-btn" id="qb-cancel">Cancel</button>
            </div>
          </div>
          <div style="margin-top:10px;font-size:12px;color:#9aa6b2">by ${CONFIG.author} • v${CONFIG.version}</div>
        </div>
      `;
      document.body.appendChild(hub);

      const trigger = hub.querySelector(".qb-pro-trigger");
      const panel = hub.querySelector(".qb-pro-panel");
      const statusEl = hub.querySelector("#qb-status");
      const toggleBtn = hub.querySelector("#qb-toggle");
      const changelogBtn = hub.querySelector("#qb-changelog-btn");
      const changelogEl = hub.querySelector("#qb-changelog");
      const refreshRow = hub.querySelector("#qb-refresh-row");
      const reloadNowBtn = hub.querySelector("#qb-reload-now");
      const cancelBtn = hub.querySelector("#qb-cancel");
      const remainingSpan = hub.querySelector("#qb-remaining");

      const render = () => {
        const active = STATE.isActive;
        statusEl.textContent = active ? "✅ Premium Active" : "❌ Premium Disabled";
        statusEl.style.background = active ? "rgba(67,97,238,0.08)" : "rgba(231,76,60,0.08)";
        statusEl.style.color = active ? CONFIG.primary : "#E74C3C";
        toggleBtn.textContent = active ? "Disable Premium" : "Enable Premium";
        toggleBtn.style.background = active ? "#fff0f0" : "#eaf3ff";
        toggleBtn.style.color = active ? "#E74C3C" : CONFIG.primary;
      };

      const clearRefresh = () => {
        if (STATE.timerId) {
          clearInterval(STATE.timerId);
          STATE.timerId = null;
        }
        refreshRow.style.display = "none";
      };

      const startRefreshCountdown = (seconds = CONFIG.refreshDelay) => {
        clearRefresh();
        STATE.remaining = seconds;
        remainingSpan.textContent = STATE.remaining;
        refreshRow.style.display = "flex";
        STATE.timerId = setInterval(() => {
          STATE.remaining -= 1;
          remainingSpan.textContent = STATE.remaining;
          if (STATE.remaining <= 0) {
            clearRefresh();
            showToast("Reloading page...", "info");
            setTimeout(() => location.reload(), 100);
          }
        }, 1000);
      };

      // Events
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        STATE.panelOpen = !STATE.panelOpen;
        panel.classList.toggle("open", STATE.panelOpen);
        playSound("click");
      });

      changelogBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        STATE.showChangelog = !STATE.showChangelog;
        changelogEl.classList.toggle("show", STATE.showChangelog);
      });

      document.addEventListener("click", (e) => {
        if (!hub.contains(e.target) && STATE.panelOpen) {
          panel.classList.remove("open");
          STATE.panelOpen = false;
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && STATE.panelOpen) {
          panel.classList.remove("open");
          STATE.panelOpen = false;
        }
      });

      reloadNowBtn.addEventListener("click", () => {
        clearRefresh();
        showToast("Reloading now...", "info");
        setTimeout(() => location.reload(), 100);
      });

      cancelBtn.addEventListener("click", () => {
        clearRefresh();
        showToast("Auto-reload cancelled", "warning");
      });

      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        STATE.isActive = !STATE.isActive;
        GM_setValue("premiumStatus", STATE.isActive);
        render();
        playSound(STATE.isActive ? "on" : "off");
        showToast(STATE.isActive ? "✅ Premium Enabled!" : "⚠️ Premium Disabled", STATE.isActive ? "success" : "warning");
        startRefreshCountdown();
      });

      render();
    },

    init() {
      this.injectStyles();
      this.createUI();
    }
  };

  // 🚀 Initialize
  apiInterceptor.init();

  const initUI = () => {
    if (document.body) {
      UI.init();
    } else {
      const iv = setInterval(() => {
        if (document.body) {
          clearInterval(iv);
          UI.init();
        }
      }, 100);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUI);
  } else {
    initUI();
  }

  log("system", `QuillBot Pro Hub v${CONFIG.version} initialized. Premium active: ${STATE.isActive}`);
})();