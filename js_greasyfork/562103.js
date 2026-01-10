// ==UserScript==
// @name         LDOH LDC 打赏插件
// @namespace    jojojotarou.ldoh.ldc.reward
// @version      1.0.0
// @description  为 LDOH 公益站添加 LDC 打赏。
// @author       @JoJoJotarou
// @match        https://ldoh.105117.xyz/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      credit.linux.do
// @connect      linux.do
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562103/LDOH%20LDC%20%E6%89%93%E8%B5%8F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/562103/LDOH%20LDC%20%E6%89%93%E8%B5%8F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    STORAGE_KEY: "ldc_reward_config",
    USER_CACHE_KEY: "ldc_reward_user_cache_ujson",
    USER_CACHE_TTL_MS: 7 * 24 * 3600 * 1000, // ✅缓存 7 天
    API: {
      ENDPOINT: "https://credit.linux.do/epay/pay/distribute",
      LOOKUP: "https://linux.do/u/{username}.json",
    },
    DOM: {
      CARD_SELECTOR: ".rounded-xl.shadow.group.relative",
      USERNAME_ATTR: "data-ld-username",
      BTN_CLASS: "ldc-gift-btn",
    },
    AMOUNT: {
      MIN: 0.01,
      MAX: 10000,
    },
  };

  // ============================================================================
  // 样式表
  // ============================================================================
  const STYLES = `
    /* --- Toast --- */
    #ldc-toast-box {
      position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
      z-index: 999999; display: flex; flex-direction: column; gap: 8px; pointer-events: none;
    }
    .ldc-toast {
      background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);
      padding: 8px 16px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.5);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-size: 13px; font-weight: 600; color: #333;
      opacity: 0; transform: translateY(-10px); transition: all 0.25s ease;
      display: flex; align-items: center; gap: 6px;
    }
    .ldc-toast.show { opacity: 1; transform: translateY(0); }

    /* --- 核心按钮样式（✅完全保留你满意的版本） --- */
    .${CONFIG.DOM.BTN_CLASS} {
      position: absolute;
      right: 0;
      top: 20%;
      z-index: 10;

      width: 40px;
      height: 36px;

      border-radius: 20px 0 0 20px;

      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(2px);
      border: 1px solid rgba(245, 158, 11, 0.5);
      border-right: none;

      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #b45309;

      transform: translateX(58%);
      opacity: 0.5;

      padding-right: 8px;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 0.8);
    }

    ${CONFIG.DOM.CARD_SELECTOR}:hover .${CONFIG.DOM.BTN_CLASS},
    .${CONFIG.DOM.BTN_CLASS}:hover {
      transform: translateX(0);
      opacity: 1;
      background: #fff;
      border-color: #fbbf24;
      width: 46px;
      box-shadow: -3px 4px 12px rgba(245, 158, 11, 0.15);
    }

    .${CONFIG.DOM.BTN_CLASS} svg {
      width: 18px; height: 18px;
      stroke-width: 2;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .${CONFIG.DOM.BTN_CLASS}:hover svg {
      transform: scale(1.15) rotate(-8deg);
      stroke: #d97706;
    }

    /* --- Overlay --- */
    .ldc-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(4px);
    }

    /* --- Dialog（更小一档） --- */
    .ldc-dialog {
      background: #fff;
      width: min(560px, 92vw);
      padding: 26px 28px;
      border-radius: 18px;
      box-shadow: 0 22px 50px rgba(0,0,0,0.18);
      animation: zoomIn 0.25s ease;
    }

    @keyframes zoomIn {
      from { transform: scale(0.96); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }

    .ldc-title {
      font-size: 26px;
      font-weight: 950;
      color: #111827;
      margin-bottom: 10px;
    }

    .ldc-sub {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.55;
      margin-top: 0;
      margin-bottom: 16px;
    }

    /* 用户信息卡片 */
    .ldc-user {
      display:flex;
      align-items:center;
      gap: 12px;
      padding: 14px 14px;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      margin-bottom: 16px;
    }

    .ldc-avatar {
      width: 46px;
      height: 46px;
      border-radius: 999px;
      border: 2px solid rgba(245,158,11,0.22);
      box-shadow: 0 8px 18px rgba(245,158,11,0.12);
      object-fit: cover;
      background: #fff;
    }

    .ldc-user-name {
      font-weight: 950;
      color: #111827;
      font-size: 17px;
      margin-bottom: 2px;
    }
    .ldc-user-meta {
      font-size: 13px;
      font-weight: 850;
      color: #6b7280;
    }
    .ldc-user-id {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 3px;
      font-weight: 700;
    }

    /* 分区标题 */
    .ldc-section-title {
      font-size: 15px;
      font-weight: 950;
      color: #111827;
      margin-bottom: 8px;
    }

    .ldc-tip {
      font-size: 12px;
      color: #6b7280;
      margin: 0 0 10px 0;
      line-height: 1.55;
    }

    /* 快捷金额 */
    .ldc-grid {
      display:grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .ldc-chip {
      padding: 10px 0;
      text-align:center;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 15px;
      cursor:pointer;
      color:#374151;
      font-weight: 950;
      transition: 0.16s;
      background: #fff;
      user-select: none;
    }

    .ldc-chip:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 18px rgba(0,0,0,0.07);
    }

    .ldc-chip.active {
      background: #fffbeb;
      border-color: #f59e0b;
      color: #b45309;
    }

    /* 输入框 */
    .ldc-input {
      width:100%;
      padding: 12px 12px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 800;
      outline:none;
      margin-bottom: 12px;
      box-sizing:border-box;
      transition: 0.2s;
    }

    .ldc-input:focus {
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
    }

    .ldc-input::placeholder {
      font-weight: 700;
      color: #9ca3af;
    }

    /* 底部按钮区 */
    .ldc-actions {
      display:flex;
      justify-content:flex-end;
      gap: 10px;
      margin-top: 14px;
    }

    .ldc-btn {
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 950;
      cursor:pointer;
      border:none;
      transition: 0.18s;
      white-space: nowrap;
    }

    .ldc-btn-sub {
      background: #fff;
      border: 2px solid #e5e7eb;
      color: #6b7280;
    }
    .ldc-btn-sub:hover { background: #f9fafb; }

    .ldc-btn-main {
      background: #f59e0b;
      color: #fff;
      box-shadow: 0 10px 20px rgba(245,158,11,0.25);
      min-width: 120px;
    }
    .ldc-btn-main:hover { background: #d97706; transform: translateY(-1px); }

    /* --- 多维护者选择列表 --- */
    .ldc-list { display:flex; flex-direction:column; gap:10px; margin: 12px 0 4px; }
    .ldc-item {
      display:flex; align-items:center; justify-content:space-between;
      padding: 12px 14px;
      border: 1px solid rgba(245,158,11,0.16);
      border-radius: 14px;
      background: rgba(255,251,235,0.92);
      cursor: pointer;
      transition: all .18s ease;
      font-weight: 900;
      color: #111827;
      gap: 12px;
    }
    .ldc-item:hover {
      transform: translateY(-1px);
      border-color: rgba(245,158,11,0.35);
      box-shadow: 0 12px 18px rgba(245,158,11,0.10);
    }
    .ldc-item span { white-space: nowrap; font-size: 12px; font-weight: 950; color:#b45309; }
  `;

  // ============================================================================
  // Utils & Cache
  // ============================================================================
  const Utils = {
    getConfig: () => {
      try {
        const raw = GM_getValue(CONFIG.STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    setConfig: (id, sec) =>
      GM_setValue(
        CONFIG.STORAGE_KEY,
        JSON.stringify({ client_id: id, client_secret: sec })
      ),

    parseNames: (str) =>
      str
        ? str
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .filter((v, i, arr) => arr.indexOf(v) === i)
        : [],

    injectStyles: () => {
      if (!document.getElementById("ldc-elegant-css")) {
        const s = document.createElement("style");
        s.id = "ldc-elegant-css";
        s.textContent = STYLES;
        document.head.appendChild(s);
      }
    },

    // cache format: { username: { id, avatar, displayName, ts } }
    loadUserCache: () => {
      try {
        const raw = GM_getValue(CONFIG.USER_CACHE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    },
    saveUserCache: (cache) => {
      GM_setValue(CONFIG.USER_CACHE_KEY, JSON.stringify(cache));
    },
    getCachedUser: (username) => {
      const cache = Utils.loadUserCache();
      const entry = cache[username];
      if (!entry) return null;
      if (!entry.ts || Date.now() - entry.ts > CONFIG.USER_CACHE_TTL_MS)
        return null;
      if (typeof entry.id !== "number") return null;
      return entry;
    },
    setCachedUser: (username, data) => {
      const cache = Utils.loadUserCache();
      cache[username] = { ...data, ts: Date.now() };
      Utils.saveUserCache(cache);
    },

    buildAvatarUrl: (avatarTemplate, size = 96) => {
      if (!avatarTemplate) return "";
      const tpl = avatarTemplate.replace("{size}", String(size));
      if (tpl.startsWith("http")) return tpl;
      return `https://linux.do${tpl}`;
    },
  };

  // ============================================================================
  // Toast（✅支持 loading + close）
  // ============================================================================
  const Toast = {
    ensureBox() {
      let box = document.getElementById("ldc-toast-box");
      if (!box) {
        box = document.createElement("div");
        box.id = "ldc-toast-box";
        document.body.appendChild(box);
      }
      return box;
    },

    show(msg, type = "info", duration = 2000) {
      const box = this.ensureBox();
      const t = document.createElement("div");
      t.className = "ldc-toast";
      t.innerHTML = `<span style="color:${
        type === "success"
          ? "#10b981"
          : type === "error"
          ? "#ef4444"
          : "#f59e0b"
      }">●</span> ${msg}`;
      box.appendChild(t);

      requestAnimationFrame(() => t.classList.add("show"));

      let closed = false;
      const close = () => {
        if (closed) return;
        closed = true;
        t.classList.remove("show");
        setTimeout(() => t.remove(), 260);
      };

      if (duration > 0) setTimeout(close, duration);

      return { close };
    },

    loading(msg) {
      return this.show(msg, "info", 0);
    },
  };

  // ============================================================================
  // API
  // ============================================================================
  const API = {
    resolveUser(username, cb) {
      const cached = Utils.getCachedUser(username);
      if (cached) return cb(true, cached, true);

      GM_xmlhttpRequest({
        method: "GET",
        url: CONFIG.API.LOOKUP.replace(
          "{username}",
          encodeURIComponent(username)
        ),
        timeout: 12000,
        headers: { Accept: "application/json" },
        onload: (res) => {
          try {
            const d = JSON.parse(res.responseText);
            const id = d?.user?.id;
            const avatar = Utils.buildAvatarUrl(d?.user?.avatar_template, 96);

            // ✅ 有 user.name 则优先显示
            const displayName = d?.user?.name || d?.user?.username || username;

            if (typeof id === "number") {
              const payload = { id, avatar, displayName };
              Utils.setCachedUser(username, payload);
              cb(true, payload, false);
            } else cb(false, "UID Not Found", false);
          } catch {
            cb(false, "API Error", false);
          }
        },
        onerror: () => cb(false, "Network Error", false),
        ontimeout: () => cb(false, "Timeout", false),
      });
    },

    pay(params, cb) {
      const cfg = Utils.getConfig();
      if (!cfg) return cb(false, "No Credentials");
      const auth = btoa(`${cfg.client_id}:${cfg.client_secret}`);

      GM_xmlhttpRequest({
        method: "POST",
        url: CONFIG.API.ENDPOINT,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        data: JSON.stringify({
          user_id: parseInt(params.userId, 10),
          username: params.username,
          amount: parseFloat(params.amount),
          out_trade_no: `LDR_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
          remark: params.remark || "LDC Reward",
        }),
        onload: (res) => {
          try {
            const d = JSON.parse(res.responseText);
            d.error_msg ? cb(false, d.error_msg) : cb(true, d.data?.trade_no);
          } catch {
            cb(false, "Response Error");
          }
        },
        onerror: () => cb(false, "Request Failed"),
        ontimeout: () => cb(false, "Timeout"),
        timeout: 30000,
      });
    },
  };

  // ============================================================================
  // 批量预加载维护者（缓存优先，缺失才请求）
  // ============================================================================
  async function preloadMaintainers(usernames) {
    const results = [];
    const tasks = [];

    for (const username of usernames) {
      const cached = Utils.getCachedUser(username);
      if (cached) {
        results.push({
          username,
          id: cached.id,
          avatar: cached.avatar,
          displayName: cached.displayName || username,
          fromCache: true,
          ok: true,
        });
      } else {
        const item = {
          username,
          id: null,
          avatar: "",
          displayName: username,
          fromCache: false,
          ok: false,
        };
        results.push(item);

        tasks.push(
          new Promise((resolve) => {
            API.resolveUser(username, (ok, payload) => {
              if (ok) {
                item.id = payload.id;
                item.avatar = payload.avatar;
                item.displayName = payload.displayName || username;
                item.ok = true;
              }
              resolve();
            });
          })
        );
      }
    }

    await Promise.all(tasks);
    return results;
  }

  // ============================================================================
  // UI
  // ============================================================================
  const UI = {
    overlay(html) {
      Utils.injectStyles();
      const el = document.createElement("div");
      el.className = "ldc-overlay";
      el.innerHTML = `<div class="ldc-dialog">${html}</div>`;
      el.addEventListener("click", (e) => {
        if (e.target === el) el.remove();
      });
      document.body.appendChild(el);
      return el;
    },

    showConfig() {
      const c = Utils.getConfig();
      const ov = this.overlay(`
        <div class="ldc-title">配置凭证</div>
        <div class="ldc-sub">Client ID / Secret 仅保存在本地（与 tbphp 佬原脚本共用）</div>
        <input id="cid" class="ldc-input" placeholder="Client ID" value="${
          c?.client_id || ""
        }">
        <input id="sec" class="ldc-input" type="password" placeholder="Client Secret" value="${
          c?.client_secret || ""
        }">
        <div class="ldc-actions">
          <button id="cancel" class="ldc-btn ldc-btn-sub">取消</button>
          <button id="save" class="ldc-btn ldc-btn-main">保存</button>
        </div>
      `);
      ov.querySelector("#cancel").onclick = () => ov.remove();
      ov.querySelector("#save").onclick = () => {
        const id = ov.querySelector("#cid").value.trim();
        const sec = ov.querySelector("#sec").value.trim();
        if (id && sec) {
          Utils.setConfig(id, sec);
          ov.remove();
          Toast.show("已保存", "success", 1600);
        } else {
          Toast.show("请填写完整", "error", 2400);
        }
      };
    },

    // ✅ 多维护者：头像 + 昵称（name 优先） + 缓存提示
    showPickMaintainer(usernames, onPick) {
      // 骨架先渲染
      const skeletonList = usernames
        .map(
          (u) => `
          <div class="ldc-item ldc-item-user" data-u="${u}">
            <div style="display:flex; align-items:center; gap:12px; min-width:0;">
              <div style="
                width:34px;height:34px;border-radius:999px;
                background: rgba(245,158,11,0.12);
                border:1px solid rgba(245,158,11,0.18);
                flex-shrink:0;
              "></div>
              <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
                <div style="font-size:14px; font-weight:950; color:#111827;">@${u}</div>
                <div style="font-size:12px; font-weight:800; color:#9ca3af;">加载中...</div>
              </div>
            </div>
            <span>选择 →</span>
          </div>`
        )
        .join("");

      const ov = this.overlay(`
        <div class="ldc-title">选择维护者</div>
        <div class="ldc-sub">检测到多个维护者，请选择要打赏的目标</div>
        <div class="ldc-list" id="ldc-maintainers-list">${skeletonList}</div>
        <div class="ldc-actions">
          <button id="cancel" class="ldc-btn ldc-btn-sub">取消</button>
        </div>
      `);

      ov.querySelector("#cancel").onclick = () => ov.remove();

      // 先允许直接点（即使未加载完）
      const bindClicks = (root) => {
        root.querySelectorAll(".ldc-item-user").forEach((item) => {
          item.onclick = () => {
            const u = item.getAttribute("data-u");
            ov.remove();
            onPick(u);
          };
        });
      };

      bindClicks(ov);

      // 异步预加载
      (async () => {
        try {
          const data = await preloadMaintainers(usernames);
          const listEl = ov.querySelector("#ldc-maintainers-list");
          if (!listEl) return;

          listEl.innerHTML = data
            .map((m) => {
              const avatar = m.avatar || "https://linux.do/images/avatar.png";
              const displayName = m.displayName || m.username;

              const badge = m.fromCache
                ? `<span style="font-size:11px;font-weight:900;color:#10b981;">已缓存</span>`
                : `<span style="font-size:11px;font-weight:900;color:#f59e0b;">在线获取</span>`;

              const sub = m.ok ? `@${m.username}` : `加载失败（仍可选择）`;

              return `
                <div class="ldc-item ldc-item-user" data-u="${m.username}">
                  <div style="display:flex; align-items:center; gap:12px; min-width:0;">
                    <img src="${avatar}" style="
                      width:34px;height:34px;border-radius:999px;
                      object-fit:cover;
                      border:1px solid rgba(245,158,11,0.25);
                      box-shadow: 0 6px 16px rgba(245,158,11,0.12);
                      background:#fff;
                      flex-shrink:0;
                    "/>
                    <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
                      <div style="
                        font-size:14px; font-weight:950; color:#111827;
                        white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
                        max-width: 360px;
                      ">${displayName}</div>
                      <div style="display:flex; align-items:center; gap:10px;">
                        <div style="font-size:12px; font-weight:850; color:#6b7280;">${sub}</div>
                        ${badge}
                      </div>
                    </div>
                  </div>
                  <span>选择 →</span>
                </div>
              `;
            })
            .join("");

          bindClicks(listEl);
        } catch (e) {
          console.warn("[LDC] preload maintainers failed", e);
        }
      })();
    },

    // ✅ 小弹窗 + 必要文字 + 头像 + 昵称
    showReward(u) {
      const ov = this.overlay(`
        <div class="ldc-title">打赏</div>
        <div class="ldc-sub">
          支持站长～
        </div>

        <div class="ldc-user">
          <img class="ldc-avatar" src="${
            u.avatar || "https://linux.do/images/avatar.png"
          }" />
          <div style="min-width:0;">
            <div class="ldc-user-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${
              u.displayName || u.name
            }</div>
            <div class="ldc-user-meta">@${u.name}</div>
            <div class="ldc-user-id">User ID: ${u.id}</div>
          </div>
        </div>

        <div class="ldc-section-title">快捷金额：</div>
        <div class="ldc-grid">
          ${[1, 5, 10, 50]
            .map((n) => `<div class="ldc-chip" data-v="${n}">${n} LDC</div>`)
            .join("")}
        </div>

        <div class="ldc-section-title">自定义金额：</div>
        <p class="ldc-tip">支持小数，最低 0.01，不超过 10000。</p>
        <input id="amt" class="ldc-input" type="number" step="0.01" min="${
          CONFIG.AMOUNT.MIN
        }" placeholder="请输入金额">

        <div class="ldc-section-title">备注（可选）：</div>
        <input id="rem" class="ldc-input" placeholder="说点什么吧...">

        <div class="ldc-actions">
          <button id="cancel" class="ldc-btn ldc-btn-sub">取消</button>
          <button id="pay" class="ldc-btn ldc-btn-main">确认打赏</button>
        </div>
      `);

      const amt = ov.querySelector("#amt");

      ov.querySelectorAll(".ldc-chip").forEach((c) => {
        c.onclick = () => {
          ov.querySelectorAll(".ldc-chip").forEach((i) =>
            i.classList.remove("active")
          );
          c.classList.add("active");
          amt.value = c.dataset.v;
        };
      });

      ov.querySelector("#cancel").onclick = () => ov.remove();

      ov.querySelector("#pay").onclick = () => {
        const val = parseFloat(amt.value);
        if (!val || val <= 0) return Toast.show("金额无效", "error", 2400);
        if (val < CONFIG.AMOUNT.MIN)
          return Toast.show(`最低 ${CONFIG.AMOUNT.MIN} LDC`, "error", 2400);
        if (val > CONFIG.AMOUNT.MAX)
          return Toast.show(
            `单次不超过 ${CONFIG.AMOUNT.MAX} LDC`,
            "error",
            2400
          );

        if (!confirm(`确认向 @${u.name} 打赏 ${val} LDC？`)) return;

        const btn = ov.querySelector("#pay");
        btn.textContent = "处理中...";
        btn.disabled = true;

        API.pay(
          {
            userId: u.id,
            username: u.name,
            amount: val,
            remark: ov.querySelector("#rem").value.trim() || "LDC Reward",
          },
          (ok, msg) => {
            ov.remove();
            ok
              ? Toast.show("打赏成功!", "success", 2200)
              : Toast.show(msg, "error", 2600);
          }
        );
      };
    },
  };

  // ============================================================================
  // Injection
  // ============================================================================
  function createButton(card) {
    if (card.querySelector(`.${CONFIG.DOM.BTN_CLASS}`)) return;
    if (getComputedStyle(card).position === "static")
      card.style.position = "relative";

    const btn = document.createElement("div");
    btn.className = CONFIG.DOM.BTN_CLASS;

    // ✅ 你满意的“礼物盒”图标，不改
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`;
    btn.title = "打赏 LDC";

    btn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();

      const cfg = Utils.getConfig();
      if (!cfg) return UI.showConfig();

      const nameAttr =
        card.getAttribute(CONFIG.DOM.USERNAME_ATTR) ||
        card
          .querySelector(`[${CONFIG.DOM.USERNAME_ATTR}]`)
          ?.getAttribute(CONFIG.DOM.USERNAME_ATTR);

      const names = Utils.parseNames(nameAttr);
      if (!names.length)
        return Toast.show("未找到维护者（data-ld-username）", "error", 2400);

      const pickAndContinue = (picked) => {
        const cached = Utils.getCachedUser(picked);
        if (cached) {
          // ✅ 缓存命中：不显示长提示
          UI.showReward({
            id: cached.id,
            avatar: cached.avatar,
            displayName: cached.displayName,
            name: picked,
          });
          return;
        }

        const loading = Toast.loading(`查询 @${picked}...`);
        API.resolveUser(picked, (ok, payload) => {
          loading.close();
          if (!ok) return Toast.show("查询失败", "error", 2400);
          UI.showReward({
            id: payload.id,
            avatar: payload.avatar,
            displayName: payload.displayName,
            name: picked,
          });
        });
      };

      if (names.length === 1) pickAndContinue(names[0]);
      else UI.showPickMaintainer(names, pickAndContinue);
    };

    card.appendChild(btn);
  }

  function scan() {
    Utils.injectStyles();
    document.querySelectorAll(CONFIG.DOM.CARD_SELECTOR).forEach(createButton);
  }

  // ============================================================================
  // Observe
  // ============================================================================
  const observer = new MutationObserver((m) => {
    if (m.some((i) => i.addedNodes.length)) setTimeout(scan, 180);
  });

  window.addEventListener("load", () => {
    const start = () => {
      scan();
      observer.observe(document.body, { childList: true, subtree: true });
    };

    // 如果浏览器支持，在空闲时执行；否则延迟 800ms
    if (window.requestIdleCallback) {
      window.requestIdleCallback(start, { timeout: 2000 });
    } else {
      setTimeout(start, 800);
    }
  });

  GM_registerMenuCommand("设置 LDC 凭证", () => UI.showConfig());
  GM_registerMenuCommand("清除用户缓存", () => {
    GM_setValue(CONFIG.USER_CACHE_KEY, "{}");
    Toast.show("已清除用户缓存", "success", 1800);
  });

  GM_registerMenuCommand("清除全部缓存(含凭证)", () => {
    GM_setValue(CONFIG.USER_CACHE_KEY, "{}");
    GM_setValue(CONFIG.STORAGE_KEY, "");
    Toast.show("已清除全部缓存", "success", 2000);
  });
})();
