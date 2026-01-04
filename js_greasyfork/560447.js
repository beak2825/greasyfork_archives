// ==UserScript==
// @name         AI Enter as Newline (Windows Only)
// @name:zh-CN   AI Enter 换行（仅 Windows）
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Windows only: Enter inserts newline, Ctrl+Enter sends. Includes quick toggle + per-site enable.
// @description:zh-CN  仅 Windows：Enter 换行，Ctrl+Enter 发送；支持快捷开关与按站点启用。
// @author       windofage (modified)
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @match        https://www.perplexity.ai/*
// @match        https://felo.ai/*
// @match        https://chat.deepseek.com/*
// @match        https://grok.com/*
// @match        https://duckduckgo.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560447/AI%20Enter%20as%20Newline%20%28Windows%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560447/AI%20Enter%20as%20Newline%20%28Windows%20Only%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Windows-only guard
  const isWindows = (() => {
    const p = (navigator.platform || "").toLowerCase();
    const ua = (navigator.userAgent || "").toLowerCase();
    return p.includes("win") || ua.includes("windows");
  })();
  if (!isWindows) return;

  // Config
  const KEY = "aiEnterNewline_windowsOnly_v2";
  const siteKey = () => `${KEY}:${location.host}`;

  const defaultConfig = {
    enabled: true,
    showToast: true,
    toastMs: 900,
    respectIME: true,
  };

  const load = () => {
    try {
      const raw = GM_getValue(siteKey(), "");
      if (!raw) return { ...defaultConfig };
      const parsed = JSON.parse(raw);
      return { ...defaultConfig, ...parsed };
    } catch {
      return { ...defaultConfig };
    }
  };

  const save = () => {
    try {
      GM_setValue(siteKey(), JSON.stringify(cfg));
      return true;
    } catch {
      return false;
    }
  };

  let cfg = load();

  // Toast
  const toast = (() => {
    let el = null;
    let timer = null;

    const ensure = () => {
      if (el && el.isConnected) return el;
      el = document.createElement("div");
      el.id = "ai-enter-newline-toast";
      el.style.cssText = [
        "position:fixed",
        "right:12px",
        "bottom:12px",
        "z-index:2147483647",
        "background:rgba(0,0,0,.78)",
        "color:#fff",
        "padding:8px 10px",
        "border-radius:10px",
        "font:600 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial",
        "box-shadow:0 6px 20px rgba(0,0,0,.25)",
        "pointer-events:none",
        "opacity:0",
        "transform:translateY(6px)",
        "transition:opacity .12s ease, transform .12s ease",
      ].join(";");

      document.addEventListener("DOMContentLoaded", () => {
        if (!el.isConnected) document.body.appendChild(el);
      });
      return el;
    };

    const show = (msg) => {
      if (!cfg.showToast) return;
      const node = ensure();
      node.textContent = msg;
      node.style.opacity = "1";
      node.style.transform = "translateY(0)";
      clearTimeout(timer);
      timer = setTimeout(() => {
        node.style.opacity = "0";
        node.style.transform = "translateY(6px)";
      }, Math.max(200, cfg.toastMs || 900));
    };

    return { show };
  })();

  // Menu (rebuildable, no refresh needed)
  const menu = (() => {
    /** @type {number[]} */
    let ids = [];

    const unregisterAll = () => {
      if (typeof GM_unregisterMenuCommand !== "function") return;
      for (const id of ids) {
        try { GM_unregisterMenuCommand(id); } catch {}
      }
      ids = [];
    };

    const reg = (title, fn) => {
      try {
        const id = GM_registerMenuCommand(title, fn);
        if (typeof id === "number") ids.push(id);
      } catch {}
    };

    const rebuild = () => {
      unregisterAll();

      reg(
        cfg.enabled ? "✅ Enter 换行：已启用（点击禁用）" : "⛔ Enter 换行：已禁用（点击启用）",
        () => {
          cfg.enabled = !cfg.enabled;
          save();
          toast.show(cfg.enabled ? "Enter 换行：已启用" : "Enter 换行：已禁用");
          rebuild();
        }
      );

      reg(
        cfg.showToast ? "🔕 关闭提示 Toast" : "🔔 开启提示 Toast",
        () => {
          cfg.showToast = !cfg.showToast;
          save();
          toast.show(cfg.showToast ? "已开启提示" : "已关闭提示");
          rebuild();
        }
      );

      reg("♻️ 重置为默认设置", () => {
        cfg = { ...defaultConfig };
        save();
        toast.show("已重置");
        rebuild();
      });

      reg("ℹ️ 快捷键说明", () => {
        alert("Windows Only\n\nEnter：换行\nCtrl + Enter：发送\nAlt + N：启用/禁用脚本（本页面）");
      });
    };

    return { rebuild };
  })();

  // Hotkey toggle (Alt+N)
  function handleToggleHotkey(e) {
    if (e.key?.toLowerCase() === "n" && e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      cfg.enabled = !cfg.enabled;
      save();
      toast.show(cfg.enabled ? "Enter 换行：已启用" : "Enter 换行：已禁用");
      menu.rebuild();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // Site adapters
  const Adapters = {
    chatgpt: {
      isHere: () => /(^|\.)chatgpt\.com$/.test(location.host) || /(^|\.)chat\.openai\.com$/.test(location.host),
      findSendButton: () =>
        document.querySelector('button[data-testid="send-button"]') ||
        document.querySelector('button[aria-label="Send prompt"]') ||
        document.querySelector('button[type="submit"]'),
      isInEditor: (target) =>
        target?.id === "prompt-textarea" ||
        target?.closest?.("#prompt-textarea") ||
        target?.closest?.('[data-testid="prompt-textarea"]') ||
        (target?.getAttribute?.("contenteditable") === "true" && !!target.closest?.("form")),
      newline: (target) => {
        const ev = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        });
        target.dispatchEvent(ev);
        if (!ev.defaultPrevented) {
          try { document.execCommand("insertLineBreak"); } catch {}
          try { document.execCommand("insertParagraph"); } catch {}
        }
      },
    },
    generic: {
      findSendButton: () => null,
      isInEditor: (target) => {
        if (!target) return false;
        const tag = (target.tagName || "").toUpperCase();
        return (
          tag === "TEXTAREA" ||
          (tag === "INPUT" && (target.type || "").toLowerCase() === "text") ||
          target.getAttribute?.("contenteditable") === "true"
        );
      },
      newline: (target) => {
        if (target?.getAttribute?.("contenteditable") === "true") {
          try { document.execCommand("insertLineBreak"); } catch {}
        }
      },
    },
  };

  const adapter = Adapters.chatgpt.isHere() ? Adapters.chatgpt : Adapters.generic;

  // Event helpers
  const getTarget = (e) => (e.composedPath ? e.composedPath()[0] || e.target : e.target);
  const isComposingIME = (e) => !!e.isComposing || e.keyCode === 229;

  const isPlainEnter = (e) => e.key === "Enter" && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey;
  const isCtrlEnter  = (e) => e.key === "Enter" &&  e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey;

  function trySend() {
    const btn = adapter.findSendButton?.();
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  }

  function onKeyDown(e) {
    if (cfg.respectIME && isComposingIME(e)) return;
    if (!cfg.enabled) return;

    const target = getTarget(e);
    if (!adapter.isInEditor(target)) return;

    if (isPlainEnter(e)) {
      e.preventDefault();
      e.stopPropagation();
      adapter.newline(target);
      return;
    }

    if (isCtrlEnter(e)) {
      const sent = trySend();
      if (sent) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  function boot() {
    menu.rebuild();
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keydown", handleToggleHotkey, true);
    toast.show("Enter 换行已启用（Ctrl+Enter 发送，Alt+N 开关）");
  }

  boot();
})();
