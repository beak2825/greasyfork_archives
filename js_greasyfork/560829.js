// ==UserScript==
// @name         Reddit Free Awards
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Give away free awards on Reddit
// @author       nrmu9
// @match        https://www.reddit.com/*
// @license      CC-BY-NC-SA-4.0
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560829/Reddit%20Free%20Awards.user.js
// @updateURL https://update.greasyfork.org/scripts/560829/Reddit%20Free%20Awards.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const AWARD_ICON = `<svg style="transform:translateY(1px)" fill="currentColor" width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 8.75h-0.211c0.548-0.833 0.874-1.854 0.874-2.952 0-0.448-0.054-0.884-0.157-1.3l0.008 0.037c-0.487-1.895-2.008-3.337-3.912-3.702l-0.031-0.005c-0.234-0.035-0.505-0.055-0.78-0.055-2.043 0-3.829 1.096-4.804 2.732l-0.014 0.026-2.973 4.279-2.974-4.279c-0.989-1.662-2.776-2.758-4.818-2.758-0.275 0-0.545 0.020-0.81 0.058l0.030-0.004c-1.935 0.37-3.455 1.812-3.934 3.672l-0.008 0.035c-0.095 0.379-0.149 0.815-0.149 1.263 0 1.097 0.326 2.119 0.886 2.972l-0.013-0.021h-0.212c-1.794 0.002-3.248 1.456-3.25 3.25v3c0.002 1.343 0.817 2.495 1.979 2.99l0.021 0.008v10.002c0.002 1.794 1.456 3.248 3.25 3.25h20c1.794-0.001 3.249-1.456 3.25-3.25v-10.002c1.183-0.503 1.998-1.656 2-2.998v-3c-0.002-1.794-1.456-3.248-3.25-3.25h-0zM28.75 12v3c-0.006 0.412-0.338 0.744-0.749 0.75h-10.751v-4.5h10.75c0.412 0.006 0.744 0.338 0.75 0.749v0.001zM21.027 4.957c0.544-1.009 1.593-1.683 2.8-1.683 0.104 0 0.207 0.005 0.309 0.015l-0.013-0.001c0.963 0.195 1.718 0.915 1.963 1.842l0.004 0.018c0.021 0.149 0.033 0.322 0.033 0.497 0 1.28-0.635 2.412-1.608 3.097l-0.012 0.008h-6.112zM5.911 5.147c0.248-0.944 1.002-1.664 1.949-1.857l0.016-0.003c0.092-0.010 0.199-0.015 0.307-0.015 1.204 0 2.251 0.675 2.783 1.667l0.008 0.017 2.636 3.793h-6.113c-0.984-0.692-1.619-1.823-1.619-3.101 0-0.177 0.012-0.351 0.036-0.521l-0.002 0.020zM3.25 12c0.006-0.412 0.338-0.744 0.749-0.75h10.751v4.5h-10.75c-0.412-0.006-0.744-0.338-0.75-0.749v-0.001zM5.25 28v-9.75h9.5v10.5h-8.75c-0.412-0.006-0.744-0.338-0.75-0.749v-0.001zM26.75 28c-0.006 0.412-0.338 0.744-0.749 0.75h-8.751v-10.5h9.5z"/></svg>`;

  const AWARDS = [
    {
      name: "Heartwarming",
      id: "award_free_heartwarming",
      img: "https://i.redd.it/snoovatar/snoo_assets/marketing/Heartwarming_40.png",
    },
    {
      name: "Popcorn",
      id: "award_free_popcorn_2",
      img: "https://i.redd.it/snoovatar/snoo_assets/marketing/Popcorn_40.png",
    },
    {
      name: "Bravo",
      id: "award_free_bravo",
      img: "https://i.redd.it/snoovatar/snoo_assets/marketing/bravo_40.png",
    },
    {
      name: "Regret",
      id: "award_free_regret_2",
      img: "https://i.redd.it/snoovatar/snoo_assets/marketing/regret_40.png",
    },
    {
      name: "Mindblown",
      id: "award_free_mindblown",
      img: "https://i.redd.it/snoovatar/snoo_assets/marketing/mindblown_40.png",
    },
  ];

  let styleInjected = false;

  function injectStyles() {
    if (styleInjected) return;
    styleInjected = true;

    const style = document.createElement("style");
    style.textContent = `
      .free-award-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
      }
      .free-award-modal-overlay.visible {
        opacity: 1;
      }
      .free-award-modal {
        background: var(--color-neutral-background, #0f1a1c);
        color: var(--color-neutral-content-strong, white);
        padding: 24px;
        border-radius: 16px;
        border: 1px solid var(--color-neutral-border, #343536);
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        box-sizing: border-box;
        max-height: 85vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .free-award-modal-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 16px;
      }
      .free-award-modal-title {
        font-size: 1.125rem;
        font-weight: 700;
      }
      .free-award-modal-subtitle {
        margin: 0 0 16px 0;
        font-size: 13px;
        color: var(--color-neutral-content-weak, #818384);
      }
      .free-award-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
        margin-bottom: 20px;
        width: 100%;
      }
      .free-award-option {
        all: unset;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        background: var(--color-neutral-background-hover, #1a282d);
        border: 2px solid transparent;
        border-radius: 12px;
        padding: 8px;
        box-sizing: border-box;
        transition: background-color 0.15s, border-color 0.15s;
      }
      .free-award-option:hover {
        background-color: var(--color-neutral-background-selected, #253337);
      }
      .free-award-option.selected {
        border-color: #FF4500;
        background-color: var(--color-neutral-background-selected, #253337);
      }
      .free-award-option img {
        display: block;
        width: 40px;
        height: 40px;
      }
      .free-award-option span {
        font-size: 10px;
        font-weight: 600;
        color: var(--color-neutral-content-weak, #818384);
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
      .free-award-send-btn {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        background: #FF4500;
        color: white;
        border-radius: 9999px;
        font-size: 14px;
        font-weight: 700;
        cursor: not-allowed;
        opacity: 0.5;
        margin-bottom: 8px;
        box-sizing: border-box;
        transition: background-color 0.15s, opacity 0.15s;
      }
      .free-award-send-btn:not(:disabled) {
        cursor: pointer;
        opacity: 1;
      }
      .free-award-send-btn:not(:disabled):hover {
        background-color: #ff5722;
      }
      .free-award-cancel-btn {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        color: var(--color-neutral-content-weak, #818384);
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        width: 100%;
        height: 32px;
        transition: color 0.15s;
      }
      .free-award-cancel-btn:hover {
        color: var(--color-neutral-content, #d7dadc);
      }
      .free-award-confetti {
        position: fixed;
        pointer-events: none;
        z-index: 1000000;
        will-change: transform, opacity;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function showConfetti() {
    const colors = [
      "#FF4500",
      "#FF5722",
      "#FFD700",
      "#FFA500",
      "#FF6B35",
      "#FFE55C",
      "#FF8C00",
      "#FFAA33",
    ];
    const particleCount = 50;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const gravity = 0.35;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "free-award-confetti";

      const color = colors[i % colors.length];
      const size = 8 + (i % 5) * 2;
      const isCircle = i % 2 === 0;

      particle.style.cssText = `left:${centerX}px;top:${centerY}px;width:${size}px;height:${
        isCircle ? size : size * 0.6
      }px;background:${color};border-radius:${isCircle ? "50%" : "2px"}`;

      document.body.appendChild(particle);

      const angle =
        (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
      const power = 8 + Math.random() * 6;
      let vx = Math.cos(angle) * power;
      let vy = Math.sin(angle) * power - 5 - Math.random() * 3;
      const drift = (Math.random() - 0.5) * 0.25;
      const rotationSpeed = (Math.random() - 0.5) * 12;
      const duration = 2000 + Math.random() * 800;

      const keyframes = [];
      const steps = 30;
      let x = 0,
        y = 0,
        rotation = 0;

      for (let t = 0; t <= steps; t++) {
        const progress = t / steps;
        x += vx;
        y += vy;
        vy += gravity;
        vx += drift;
        vx *= 0.98;
        vy *= 0.99;
        rotation += rotationSpeed;

        keyframes.push({
          transform: `translate(${x}px,${y}px) rotate(${rotation}deg)`,
          opacity: progress < 0.5 ? 1 : 1 - (progress - 0.5) * 2,
        });
      }

      particle.animate(keyframes, { duration, fill: "forwards" });
      setTimeout(() => particle.remove(), duration + 50);
    }
  }

  function getCSRFToken() {
    const cookie = document.cookie.match(/csrf_token=([^;]+)/);
    if (cookie) return cookie[1];
    const app = document.querySelector("shreddit-app");
    return (
      app?.csrfToken ||
      app?.getAttribute("csrf-token") ||
      app?.getAttribute("spp")
    );
  }

  function getCurrentUserId() {
    return document.querySelector("[user-id]")?.getAttribute("user-id") || null;
  }

  function findAlertControllerModuleId() {
    if (typeof SML === "undefined" || !SML.moduleRegistry) return null;
    for (const [id, mod] of Object.entries(SML.moduleRegistry)) {
      if (mod.factory) {
        const src = mod.factory.toString();
        if (src.includes("alert-controller") && src.includes("toaster-lite")) {
          return id;
        }
      }
    }
    return null;
  }

  async function waitForSMLFactories(maxWait = 5000) {
    const start = Date.now();
    while (Date.now() - start < maxWait) {
      if (typeof SML !== "undefined" && SML.moduleRegistry) {
        const hasFactories =
          Object.values(SML.moduleRegistry).filter((m) => m.factory).length >
          50;
        if (hasFactories) return true;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    return false;
  }

  async function loadAlertControllerModule() {
    await waitForSMLFactories();

    const moduleId = findAlertControllerModuleId();
    if (!moduleId) return false;

    const mod = SML.moduleRegistry[moduleId];
    if (mod?.isResolved && mod?.isEvaluated) return true;

    try {
      const prefix = SML._diState?.lastPrefix || "en-US/";
      await SML.load([moduleId], prefix, "high");
      return true;
    } catch {
      return false;
    }
  }

  async function ensureAlertController() {
    let alertController = document.querySelector("alert-controller");
    if (alertController?.shadowRoot?.querySelector("toaster-lite")) {
      return alertController;
    }

    if (!customElements.get("alert-controller")) {
      await loadAlertControllerModule();
      try {
        await Promise.race([
          customElements.whenDefined("alert-controller"),
          new Promise((_, reject) => setTimeout(reject, 3000)),
        ]);
      } catch {
        return null;
      }
    }

    alertController = document.querySelector("alert-controller");
    if (!alertController) {
      alertController = document.createElement("alert-controller");
      alertController.setAttribute("aria-live", "polite");
      document.body.appendChild(alertController);
    }

    for (let i = 0; i < 50; i++) {
      if (alertController.shadowRoot?.querySelector("toaster-lite")) {
        return alertController;
      }
      await new Promise((r) => setTimeout(r, 50));
    }

    return alertController;
  }

  async function showToast(message, isError = false) {
    const alertController = await ensureAlertController();
    const toaster = alertController?.shadowRoot?.querySelector("toaster-lite");

    if (!toaster) return;

    toaster.dispatchEvent(
      new CustomEvent("show-toast", {
        bubbles: true,
        composed: true,
        detail: { message, level: isError ? 4 : 6, namedContent: {} },
      })
    );
  }

  function updateAwardUI(thingId, awardId, iconUrl) {
    let awardBtn = document.querySelector(
      `award-button[thing-id="${thingId}"]`
    );

    if (!awardBtn) {
      for (const post of document.querySelectorAll("shreddit-post")) {
        if (post.id === thingId && post.shadowRoot) {
          awardBtn = post.shadowRoot.querySelector("award-button");
          if (awardBtn) break;
        }
      }
    }

    if (awardBtn) {
      const currentCount = parseInt(awardBtn.getAttribute("count") || "0", 10);
      awardBtn.setAttribute("count", currentCount + 1);
      awardBtn.setAttribute("is-awarded-by-user", "");
      awardBtn.setAttribute("award-id", awardId);
      awardBtn.setAttribute("icon-url", iconUrl);
    }

    for (const comment of document.querySelectorAll("shreddit-comment")) {
      if (comment.getAttribute("thingid") === thingId) {
        const count = parseInt(comment.getAttribute("award-count") || "0", 10);
        comment.setAttribute("award-count", count + 1);
      }
    }
  }

  async function sendAward(thingId, award) {
    const token = getCSRFToken();
    if (!token) throw new Error("Could not find CSRF token");

    const res = await fetch("https://www.reddit.com/svc/shreddit/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Csrf-Token": token },
      body: JSON.stringify({
        operation: "CreateAwardOrder",
        variables: {
          input: {
            nonce: crypto.randomUUID(),
            thingId,
            awardId: award.id,
            isAnonymous: false,
          },
        },
        csrf_token: token,
      }),
    });

    const json = await res.json();
    if (!json.data?.createAwardOrder?.ok) {
      throw new Error("Reddit API rejected the request");
    }

    return json;
  }

  function openAwardModal(thingId, authorName) {
    injectStyles();

    const overlay = document.createElement("div");
    overlay.className = "free-award-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "free-award-modal";

    const header = document.createElement("div");
    header.className = "free-award-modal-header";
    header.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="#FF4500" stroke-width="2">
        <path d="M28 8.75h-0.211c0.548-0.833 0.874-1.854 0.874-2.952 0-0.448-0.054-0.884-0.157-1.3l0.008 0.037c-0.487-1.895-2.008-3.337-3.912-3.702l-0.031-0.005c-0.234-0.035-0.505-0.055-0.78-0.055-2.043 0-3.829 1.096-4.804 2.732l-0.014 0.026-2.973 4.279-2.974-4.279c-0.989-1.662-2.776-2.758-4.818-2.758-0.275 0-0.545 0.020-0.81 0.058l0.030-0.004c-1.935 0.37-3.455 1.812-3.934 3.672l-0.008 0.035c-0.095 0.379-0.149 0.815-0.149 1.263 0 1.097 0.326 2.119 0.886 2.972l-0.013-0.021h-0.212c-1.794 0.002-3.248 1.456-3.25 3.25v3c0.002 1.343 0.817 2.495 1.979 2.99l0.021 0.008v10.002c0.002 1.794 1.456 3.248 3.25 3.25h20c1.794-0.001 3.249-1.456 3.25-3.25v-10.002c1.183-0.503 1.998-1.656 2-2.998v-3c-0.002-1.794-1.456-3.248-3.25-3.25h-0zM28.75 12v3c-0.006 0.412-0.338 0.744-0.749 0.75h-10.751v-4.5h10.75c0.412 0.006 0.744 0.338 0.75 0.749v0.001zM21.027 4.957c0.544-1.009 1.593-1.683 2.8-1.683 0.104 0 0.207 0.005 0.309 0.015l-0.013-0.001c0.963 0.195 1.718 0.915 1.963 1.842l0.004 0.018c0.021 0.149 0.033 0.322 0.033 0.497 0 1.28-0.635 2.412-1.608 3.097l-0.012 0.008h-6.112zM5.911 5.147c0.248-0.944 1.002-1.664 1.949-1.857l0.016-0.003c0.092-0.010 0.199-0.015 0.307-0.015 1.204 0 2.251 0.675 2.783 1.667l0.008 0.017 2.636 3.793h-6.113c-0.984-0.692-1.619-1.823-1.619-3.101 0-0.177 0.012-0.351 0.036-0.521l-0.002 0.020zM3.25 12c0.006-0.412 0.338-0.744 0.749-0.75h10.751v4.5h-10.75c-0.412-0.006-0.744-0.338-0.75-0.749v-0.001zM5.25 28v-9.75h9.5v10.5h-8.75c-0.412-0.006-0.744-0.338-0.75-0.749v-0.001zM26.75 28c-0.006 0.412-0.338 0.744-0.749 0.75h-8.751v-10.5h9.5z"/>
      </svg>
      <span class="free-award-modal-title">${
        authorName ? `Give Award to ${authorName}` : "Give Award"
      }</span>
    `;
    modal.appendChild(header);

    const subtitle = document.createElement("p");
    subtitle.className = "free-award-modal-subtitle";
    subtitle.textContent = "Select an award to send:";
    modal.appendChild(subtitle);

    const grid = document.createElement("div");
    grid.className = "free-award-grid";

    let selectedAward = null;
    let selectedBtn = null;

    for (const award of AWARDS) {
      const btn = document.createElement("button");
      btn.className = "free-award-option";
      btn.innerHTML = `<img src="${award.img}" width="40" height="40"><span>${award.name}</span>`;
      btn.onclick = () => {
        selectedBtn?.classList.remove("selected");
        selectedBtn = btn;
        selectedAward = award;
        btn.classList.add("selected");
        sendButton.disabled = false;
      };
      grid.appendChild(btn);
    }
    modal.appendChild(grid);

    const sendButton = document.createElement("button");
    sendButton.className = "free-award-send-btn";
    sendButton.textContent = "Give Award";
    sendButton.disabled = true;

    const closeModal = () => {
      overlay.classList.remove("visible");
      setTimeout(() => overlay.remove(), 200);
    };

    sendButton.onclick = async () => {
      if (!selectedAward) return;
      sendButton.disabled = true;
      const originalText = sendButton.textContent;
      sendButton.textContent = "Sending...";

      try {
        await sendAward(thingId, selectedAward);
        updateAwardUI(thingId, selectedAward.id, selectedAward.img);
        showConfetti();
        showToast("Award sent successfully!");
        closeModal();
      } catch (e) {
        showToast(
          "Reddit servers failed. This is a Reddit bug, not this script. Try again!",
          true
        );
        sendButton.disabled = false;
        sendButton.textContent = originalText;
      }
    };
    modal.appendChild(sendButton);

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "free-award-cancel-btn";
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = closeModal;
    modal.appendChild(cancelBtn);

    overlay.appendChild(modal);
    overlay.onclick = (e) => e.target === overlay && closeModal();

    document.body.appendChild(overlay);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => overlay.classList.add("visible"))
    );
  }

  function createAwardButton(onClick, isComment) {
    const btn = document.createElement("button");
    btn.className = `button border-md flex flex-row justify-center items-center h-xl font-semibold relative text-12 inline-flex items-center px-sm ${
      isComment ? "button-plain-weak" : "button-secondary"
    }`;
    btn.style.cssText =
      "height: var(--size-button-sm-h); font: var(--font-button-sm);";
    btn.innerHTML = `<span class="flex items-center"><span class="flex text-16 me-[var(--rem6)]">${AWARD_ICON}</span><span>Free Award</span></span>`;
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    };
    return btn;
  }

  function processPost(post, currentUserId) {
    if (post.dataset.freeAwardProcessed) return;

    const postId = post.id || post.getAttribute("postId");
    if (!postId) return;

    if (post.hasAttribute("nsfw")) {
      post.dataset.freeAwardProcessed = "true";
      return;
    }

    const authorId = post.getAttribute("author-id");
    if (authorId && authorId === currentUserId) {
      post.dataset.freeAwardProcessed = "true";
      return;
    }

    const author = post.getAttribute("author") || null;

    const existingShareBtn = post.querySelector(
      'shreddit-post-share-button[slot="share-button"]'
    );
    if (existingShareBtn) {
      const btn = createAwardButton(
        () => openAwardModal(postId, author),
        false
      );
      btn.setAttribute("slot", "share-button");
      post.insertBefore(btn, existingShareBtn);
      post.dataset.freeAwardProcessed = "true";
      return;
    }

    if (post.shadowRoot) {
      const container = post.shadowRoot.querySelector(
        ".shreddit-post-container"
      );
      const awardBtn = container?.querySelector("award-button");
      if (awardBtn) {
        const btn = createAwardButton(
          () => openAwardModal(postId, author),
          false
        );
        awardBtn.parentNode.insertBefore(btn, awardBtn.nextSibling);
        post.dataset.freeAwardProcessed = "true";
      }
    }
  }

  function processComment(comment, currentUserId) {
    if (comment.dataset.freeAwardProcessed) return;

    const thingId = comment.getAttribute("thingid");
    if (!thingId) return;

    const postId = comment.getAttribute("postid");
    if (postId) {
      const post = document.querySelector(
        `shreddit-post[id="${postId}"], shreddit-post#${postId}`
      );
      if (post?.hasAttribute("nsfw")) {
        comment.dataset.freeAwardProcessed = "true";
        return;
      }
    }

    const overflowMenu = comment.querySelector(
      "shreddit-overflow-menu[author-id]"
    );
    const authorId = overflowMenu?.getAttribute("author-id");
    if (authorId && authorId === currentUserId) {
      comment.dataset.freeAwardProcessed = "true";
      return;
    }

    const actionRow = comment.querySelector("shreddit-comment-action-row");
    const shareBtn = actionRow?.querySelector('[slot="comment-share"]');
    if (!shareBtn) return;

    const author = comment.getAttribute("author") || null;
    const btn = createAwardButton(() => openAwardModal(thingId, author), true);
    btn.setAttribute("slot", "comment-award");
    shareBtn.parentNode.insertBefore(btn, shareBtn);
    comment.dataset.freeAwardProcessed = "true";
  }

  function processAllElements(currentUserId) {
    document
      .querySelectorAll("shreddit-post")
      .forEach((el) => processPost(el, currentUserId));
    document
      .querySelectorAll("shreddit-comment")
      .forEach((el) => processComment(el, currentUserId));
  }

  function init() {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      setTimeout(init, 500);
      return;
    }

    injectStyles();
    loadAlertControllerModule();
    processAllElements(currentUserId);

    const processFrame = () => {
      const userId = getCurrentUserId();
      if (userId) {
        document
          .querySelectorAll("shreddit-post:not([data-free-award-processed])")
          .forEach((el) => {
            processPost(el, userId);
          });
        document
          .querySelectorAll("shreddit-comment:not([data-free-award-processed])")
          .forEach((el) => {
            processComment(el, userId);
          });
      }
      requestAnimationFrame(processFrame);
    };
    requestAnimationFrame(processFrame);
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
