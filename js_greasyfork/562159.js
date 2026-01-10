// ==UserScript==
// @name         Reddit Free Awards – Posts & Comments (Queued + Toggle)
// @namespace    https://tampermonkey.net/reddit-free-awards-toggle-floating
// @version      3.4.0
// @description  One-click free awards for posts & comments with floating toggle and rate-limit safe queue
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562159/Reddit%20Free%20Awards%20%E2%80%93%20Posts%20%20Comments%20%28Queued%20%2B%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562159/Reddit%20Free%20Awards%20%E2%80%93%20Posts%20%20Comments%20%28Queued%20%2B%20Toggle%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /* ===================== CONFIG ===================== */

  const STORAGE_KEY = "free_awards_enabled";
  const AWARD_DELAY_MS = 2500; // ⏱️ delay between awards (rate-limit safe)

  const AWARDS = [
    { name: "Heartwarming", id: "award_free_heartwarming", img: "https://i.redd.it/snoovatar/snoo_assets/marketing/Heartwarming_40.png" },
    { name: "Popcorn", id: "award_free_popcorn_2", img: "https://i.redd.it/snoovatar/snoo_assets/marketing/Popcorn_40.png" },
    { name: "Bravo", id: "award_free_bravo", img: "https://i.redd.it/snoovatar/snoo_assets/marketing/bravo_40.png" },
    { name: "Regret", id: "award_free_regret_2", img: "https://i.redd.it/snoovatar/snoo_assets/marketing/regret_40.png" },
    { name: "Mindblown", id: "award_free_mindblown", img: "https://i.redd.it/snoovatar/snoo_assets/marketing/mindblown_40.png" },
  ];

  /* ===================== STATE ===================== */

  const isEnabled = () => localStorage.getItem(STORAGE_KEY) !== "false";
  const setEnabled = (v) => localStorage.setItem(STORAGE_KEY, String(v));

  /* ===================== AWARD QUEUE ===================== */

  const awardQueue = [];
  let isProcessing = false;

  const processQueue = async () => {
    if (isProcessing || awardQueue.length === 0) return;
    isProcessing = true;

    const { thingId, awardId, btn, img } = awardQueue.shift();

    try {
      await sendAward(thingId, awardId);
      btn.textContent = "✓";
      btn.style.background = "#4BB543";
      btn.style.color = "white";
    } catch {
      btn.textContent = "✕";
      btn.style.background = "#EA0027";
      btn.style.color = "white";
      setTimeout(() => {
        btn.textContent = "";
        btn.appendChild(img);
        btn.style.background = "transparent";
        btn.style.color = "";
        btn.disabled = false;
      }, 2000);
    }

    setTimeout(() => {
      isProcessing = false;
      processQueue();
    }, AWARD_DELAY_MS);
  };

  /* ===================== HELPERS ===================== */

  const getCurrentUserId = () =>
    document.querySelector("[user-id]")?.getAttribute("user-id") || null;

  const getCsrfToken = () => {
    const c = document.cookie.match(/csrf_token=([^;]+)/);
    if (c) return c[1];
    const app = document.querySelector("shreddit-app");
    return app?.csrfToken || app?.getAttribute("csrf-token") || app?.getAttribute("spp");
  };

  const sendAward = async (thingId, awardId) => {
    const token = getCsrfToken();
    if (!token) throw new Error("No CSRF");

    const res = await fetch("https://www.reddit.com/svc/shreddit/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Csrf-Token": token },
      body: JSON.stringify({
        operation: "CreateAwardOrder",
        variables: { input: { nonce: crypto.randomUUID(), thingId, awardId, isAnonymous: false } },
        csrf_token: token,
      }),
    });

    const json = await res.json();
    if (!json?.data?.createAwardOrder?.ok) throw new Error("Award failed");
  };

  /* ===================== UI ===================== */

  const createAwardButton = (award, thingId) => {
    const btn = document.createElement("button");
    btn.title = award.name;

    btn.style.cssText = `
      background: transparent;
      border: none;
      border-radius: 999px;
      cursor: pointer;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0;
    `;

    const img = document.createElement("img");
    img.src = award.img;
    img.style.cssText = "width:20px;height:20px;margin-bottom:2px;pointer-events:none;";
    btn.appendChild(img);

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (btn.disabled) return;

      btn.disabled = true;
      btn.style.opacity = "0.6";

      awardQueue.push({ thingId, awardId: award.id, btn, img });
      processQueue();
    };

    return btn;
  };

  /* ===================== INJECTION ===================== */

  const removeAllButtons = () =>
    document.querySelectorAll(".free-award-wrap").forEach(e => e.remove());

  const injectCommentButtons = () => {
    document.querySelectorAll("shreddit-comment-action-row").forEach(row => {
      if (!isEnabled() || row.querySelector(".free-award-wrap")) return;

      const comment = row.closest("shreddit-comment");
      if (!comment || comment.hasAttribute("is-author")) return;

      const thingId = row.getAttribute("comment-id");
      if (!thingId) return;

      const wrap = document.createElement("div");
      wrap.className = "free-award-wrap";
      wrap.setAttribute("slot", "comment-award");
      wrap.style.cssText = "display:inline-flex;gap:2px;margin-left:8px;";

      AWARDS.forEach(a => wrap.appendChild(createAwardButton(a, thingId)));

      const existing = row.querySelector('[slot="comment-award"]');
      existing ? existing.after(wrap) : row.appendChild(wrap);
    });
  };

  const injectPostButtons = (uid) => {
    document.querySelectorAll("shreddit-post").forEach(post => {
      if (!isEnabled() || post.dataset.freeAwardInjected) return;
      if (post.getAttribute("author-id") === uid) return;

      const thingId = post.id || post.getAttribute("postid");
      if (!thingId) return;

      const wrap = document.createElement("div");
      wrap.className = "free-award-wrap";
      wrap.style.cssText = "display:inline-flex;gap:4px;margin-left:8px;";

      AWARDS.forEach(a => wrap.appendChild(createAwardButton(a, thingId)));

      const target = post.querySelector('[slot="post-award"]') || post.querySelector("award-button");
      if (target) {
        target.after(wrap);
        post.dataset.freeAwardInjected = "true";
      }
    });
  };

  /* ===================== FLOATING TOGGLE ===================== */

  const injectToggle = () => {
    if (document.querySelector("#free-award-toggle")) return;

    const btn = document.createElement("button");
    btn.id = "free-award-toggle";

    btn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 16px;
      height: 36px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      color: white;
    `;

    const update = () => {
      btn.textContent = `Free Awards: ${isEnabled() ? "ON" : "OFF"}`;
      btn.style.background = isEnabled() ? "#FF4500" : "#555";
    };

    btn.onclick = () => {
      setEnabled(!isEnabled());
      removeAllButtons();
      update();
      run();
    };

    update();
    document.body.appendChild(btn);
  };

  /* ===================== INIT ===================== */

  const run = () => {
    const uid = getCurrentUserId();
    if (!uid) return;
    injectToggle();
    injectCommentButtons();
    injectPostButtons(uid);
  };

  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
