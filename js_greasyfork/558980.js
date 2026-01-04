// ==UserScript==
// @name         ChatGPT Markdown Export
// @name:zh-CN   ChatGPT 对话导出（Markdown）
// @name:zh-TW   ChatGPT 對話匯出（Markdown）
// @name:ja      ChatGPT 会話エクスポート（Markdown）
//
// @namespace    https://github.com/yoyoithink/ChatGPT-Markdown-File-Export
// @version      0.1.0
//
// @description        Export the current ChatGPT conversation as a Markdown document.
// @description:zh-CN 将当前 ChatGPT 对话导出为 Markdown 文档。
// @description:zh-TW 將目前的 ChatGPT 對話匯出為 Markdown 文件。
// @description:ja    現在の ChatGPT 会話を Markdown ドキュメントとしてエクスポートします。
//
// @license     MIT
//
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/558980/ChatGPT%20Markdown%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/558980/ChatGPT%20Markdown%20Export.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const UI_ROOT_ID = "cge-root";
  const STYLE_ID = "cge-style";

  function addStyle(cssText) {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = cssText;
    (document.head || document.documentElement).appendChild(style);
  }

  function sanitizeFilename(input, replacement = "_") {
    const illegalRe = /[\/\\\?\%\*\:\|"<>\u0000-\u001F]/g;
    const reservedRe = /^\.+$/;
    const windowsReservedRe = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
    let name = String(input ?? "")
      .replace(illegalRe, replacement)
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[. ]+$/g, "");
    if (!name || reservedRe.test(name)) name = "chat_export";
    if (windowsReservedRe.test(name)) name = `chat_${name}`;
    return name;
  }

  function downloadText(filename, text, mime = "text/plain") {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  function getConversationTitle() {
    const candidates = [
      document.querySelector("#history a[data-active]")?.textContent,
      document.querySelector('nav a[aria-current="page"]')?.textContent,
      document.querySelector("main h1")?.textContent,
      document.title
    ]
      .map((v) => (v ?? "").trim())
      .filter(Boolean);

    const title = (candidates[0] || "chat_export").replace(/\s*-\s*ChatGPT\s*$/i, "").trim();
    return title || "chat_export";
  }

  function getMessageNodes() {
    const main = document.querySelector("main");
    if (!main) return [];

    const roleNodes = Array.from(main.querySelectorAll("[data-message-author-role]")).filter(
      (node) => !node.parentElement?.closest("[data-message-author-role]")
    );
    if (roleNodes.length) return roleNodes;

    return Array.from(main.querySelectorAll("div[data-message-id]"));
  }

  function getMessageRole(node, index) {
    const role =
      node.getAttribute?.("data-message-author-role") ||
      node.querySelector?.("[data-message-author-role]")?.getAttribute("data-message-author-role");
    if (role) return role;
    return index % 2 === 0 ? "user" : "assistant";
  }

  function getMessageContentElement(node) {
    const selectors = [
      "[data-message-content]",
      ".markdown",
      ".prose",
      ".whitespace-pre-wrap",
      "[data-testid='markdown']"
    ];
    for (const selector of selectors) {
      const el = node.querySelector?.(selector);
      if (el && el.textContent?.trim()) return el;
    }
    return node;
  }

  function normalizeMarkdown(markdown) {
    return String(markdown ?? "")
      .replace(/\r\n/g, "\n")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function extractLanguageFromCodeElement(codeEl) {
    const dataLang = codeEl?.getAttribute?.("data-language");
    if (dataLang) return dataLang.trim();
    for (const className of Array.from(codeEl?.classList || [])) {
      if (className.startsWith("language-")) return className.slice("language-".length).trim();
      if (className.startsWith("lang-")) return className.slice("lang-".length).trim();
    }
    return "";
  }

  function replaceKatex(root) {
    const doc = root.ownerDocument;
    root.querySelectorAll(".katex-display").forEach((el) => {
      const ann = el.querySelector('annotation[encoding="application/x-tex"]');
      const latex = ann?.textContent?.trim();
      if (!latex) return;
      el.replaceWith(doc.createTextNode(`\n\n$$\n${latex}\n$$\n\n`));
    });
    root.querySelectorAll(".katex").forEach((el) => {
      if (el.closest(".katex-display")) return;
      const ann = el.querySelector('annotation[encoding="application/x-tex"]');
      const latex = ann?.textContent?.trim();
      if (!latex) return;
      el.replaceWith(doc.createTextNode(`$${latex}$`));
    });
  }

  function htmlToMarkdown(html) {
    const doc = new DOMParser().parseFromString(`<div id="cge-tmp">${html}</div>`, "text/html");
    const root = doc.getElementById("cge-tmp");
    if (!root) return "";

    replaceKatex(root);

    const blocks = new Set(["div", "section", "article", "header", "footer", "main"]);

    function childrenToMarkdown(nodes) {
      let out = "";
      nodes.forEach((n) => {
        out += toMarkdown(n);
      });
      return out;
    }

    function toMarkdown(node) {
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || "";
      if (node.nodeType !== Node.ELEMENT_NODE) return "";

      const tag = node.tagName.toLowerCase();
      if (["script", "style", "noscript", "button"].includes(tag)) return "";
      if (tag === "br") return "\n";
      if (tag === "hr") return "\n\n---\n\n";

      if (tag === "pre") {
        const codeEl = node.querySelector("code") || node;
        const lang = extractLanguageFromCodeElement(codeEl);
        const code = (codeEl.textContent || "").replace(/\n$/, "");
        return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
      }

      if (tag === "code") {
        if (node.closest("pre")) return node.textContent || "";
        const text = node.textContent || "";
        const fence = text.includes("`") ? "``" : "`";
        return `${fence}${text}${fence}`;
      }

      if (tag === "a") {
        const href = node.getAttribute("href") || "";
        const text = childrenToMarkdown(Array.from(node.childNodes)).trim() || href;
        if (!href) return text;
        return `[${text}](${href})`;
      }

      if (tag === "img") {
        const alt = node.getAttribute("alt") || "";
        const src = node.getAttribute("src") || "";
        if (!src) return "";
        return `![${alt}](${src})`;
      }

      if (/^h[1-6]$/.test(tag)) {
        const level = Number(tag.slice(1));
        const text = childrenToMarkdown(Array.from(node.childNodes)).trim();
        return `\n\n${"#".repeat(level)} ${text}\n\n`;
      }

      if (tag === "blockquote") {
        const content = normalizeMarkdown(childrenToMarkdown(Array.from(node.childNodes)));
        const quoted = content
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n");
        return `\n\n${quoted}\n\n`;
      }

      if (tag === "ul" || tag === "ol") {
        const ordered = tag === "ol";
        const items = Array.from(node.children).filter((c) => c.tagName.toLowerCase() === "li");
        const lines = items.map((li, idx) => {
          const prefix = ordered ? `${idx + 1}. ` : "- ";
          let item = normalizeMarkdown(childrenToMarkdown(Array.from(li.childNodes)));
          item = item.replace(/\n/g, "\n    ");
          return prefix + item;
        });
        return `\n\n${lines.join("\n")}\n\n`;
      }

      if (tag === "table") {
        const rows = Array.from(node.querySelectorAll("tr"));
        if (!rows.length) return childrenToMarkdown(Array.from(node.childNodes));
        const cellText = (cell) =>
          normalizeMarkdown(childrenToMarkdown(Array.from(cell.childNodes))).replace(/\n+/g, "<br>");

        const headerCells = Array.from(rows[0].querySelectorAll("th,td"));
        const headers = headerCells.map(cellText);
        const aligns = headers.map(() => "---");
        const lines = [`| ${headers.join(" | ")} |`, `| ${aligns.join(" | ")} |`];

        rows.slice(1).forEach((row) => {
          const cells = Array.from(row.querySelectorAll("td,th")).map(cellText);
          while (cells.length < headers.length) cells.push("");
          lines.push(`| ${cells.join(" | ")} |`);
        });

        return `\n\n${lines.join("\n")}\n\n`;
      }

      const content = childrenToMarkdown(Array.from(node.childNodes));
      if (tag === "p") return `\n\n${content.trim()}\n\n`;
      if (blocks.has(tag)) return content;
      return content;
    }

    return normalizeMarkdown(childrenToMarkdown(Array.from(root.childNodes)));
  }

  function extractConversation() {
    const title = getConversationTitle();
    const nodes = getMessageNodes();
    const messages = nodes
      .map((node, index) => {
        const role = getMessageRole(node, index);
        const contentEl = getMessageContentElement(node);
        const html = contentEl?.innerHTML || "";
        const markdown = htmlToMarkdown(html);
        return { role, html, markdown };
      })
      .filter((m) => m.markdown.trim());

    return { title, messages };
  }

  function buildMarkdownExport(conversation) {
    const roleLabel = (role) => {
      if (role === "user") return "User";
      if (role === "assistant") return "Assistant";
      return role || "Message";
    };

    const parts = [`# ${conversation.title}`, ""];
    conversation.messages.forEach((m) => {
      parts.push("---", "", `### ${roleLabel(m.role)}`, "", m.markdown, "");
    });
    return normalizeMarkdown(parts.join("\n"));
  }

  function exportMarkdown() {
    const conversation = extractConversation();
    if (!conversation.messages.length) return { ok: false, message: "未找到对话内容" };
    const filename = `${sanitizeFilename(conversation.title)}.md`;
    downloadText(filename, buildMarkdownExport(conversation), "text/markdown;charset=utf-8");
    return { ok: true };
  }

  function createIconSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 3v10m0 0 3-3m-3 3-3-3M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4");
    svg.appendChild(path);
    return svg;
  }

  function showToast(root, text, isError = false) {
    const toast = root.querySelector(".cge-toast");
    if (!toast) return;
    toast.textContent = text;
    toast.dataset.kind = isError ? "error" : "info";
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.hidden = true;
    }, 2400);
  }

  function updatePosition(root) {
    const prompt = document.querySelector("#prompt-textarea");
    const composer = prompt?.closest("form") || prompt?.closest("div");
    const composerRect = composer?.getBoundingClientRect?.();

    const main = document.querySelector("main");
    const mainRect = main?.getBoundingClientRect?.();

    const rootRect = root.getBoundingClientRect();
    const gap = 12;
    const minInset = 8;

    let left = minInset;
    let bottom = 16;

    if (composerRect) {
      const leftEdge = mainRect?.left ?? 0;
      const gutterWidth = Math.max(0, composerRect.left - leftEdge);
      const hasGutter = gutterWidth >= rootRect.width + gap * 2;

      if (hasGutter) {
        const gutterCenterX = leftEdge + gutterWidth / 2;
        left = gutterCenterX - rootRect.width / 2;
      } else {
        left = composerRect.left - gap - rootRect.width;
      }

      const composerCenterY = composerRect.top + composerRect.height / 2;
      bottom = window.innerHeight - composerCenterY - rootRect.height / 2;

      const leftMin = (mainRect?.left ?? 0) + minInset;
      left = Math.max(leftMin, left);
    } else if (mainRect) {
      left = mainRect.left + gap;
      bottom = 16;
    }

    left = Math.max(minInset, Math.round(left));
    bottom = Math.max(minInset, Math.round(bottom));

    root.style.left = `${left}px`;
    root.style.bottom = `${bottom}px`;
  }

  function isOnNewChatPage() {
    const main = document.querySelector("main");
    if (!main) return false;
    const h1 = main.querySelector("h1");
    if (h1 && /new chat|新对话|新聊天/i.test(h1.textContent || "")) return true;
    if (getMessageNodes().length === 0) return true;
    if (/new chat|新对话|新聊天/i.test(document.title)) return true;
    return false;
  }

  function ensureUi() {
    if (document.getElementById(UI_ROOT_ID)) return;

    addStyle(`
      #${UI_ROOT_ID} { position: fixed; z-index: 1200; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
      #${UI_ROOT_ID} * { box-sizing: border-box; font-family: inherit; }
      #${UI_ROOT_ID} .cge-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 9999px; border: 1px solid rgba(0,0,0,.12); background: rgba(255,255,255,.92); color: inherit; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,.08); backdrop-filter: blur(8px); }
      #${UI_ROOT_ID} .cge-btn:hover { box-shadow: 0 6px 18px rgba(0,0,0,.12); }
      #${UI_ROOT_ID} .cge-btn:disabled { opacity: .6; cursor: not-allowed; }
      #${UI_ROOT_ID} .cge-toast { padding: 8px 10px; border-radius: 12px; border: 1px solid rgba(0,0,0,.12); background: rgba(255,255,255,.96); box-shadow: 0 12px 30px rgba(0,0,0,.14); }
      #${UI_ROOT_ID} .cge-toast[data-kind="error"] { border-color: rgba(239,68,68,.35); }
      html.dark #${UI_ROOT_ID} .cge-btn, :root.dark #${UI_ROOT_ID} .cge-btn { border-color: rgba(255,255,255,.12); background: rgba(17,24,39,.75); box-shadow: 0 1px 2px rgba(0,0,0,.5); }
      html.dark #${UI_ROOT_ID} .cge-toast, :root.dark #${UI_ROOT_ID} .cge-toast { border-color: rgba(255,255,255,.12); background: rgba(17,24,39,.92); }
    `);

    const root = document.createElement("div");
    root.id = UI_ROOT_ID;
    root.setAttribute("aria-label", "ChatGPT Export");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cge-btn";
    btn.appendChild(createIconSvg());
    const btnText = document.createElement("span");
    btnText.textContent = "导出";
    btn.appendChild(btnText);

    const toast = document.createElement("div");
    toast.className = "cge-toast";
    toast.hidden = true;

    root.appendChild(btn);
    root.appendChild(toast);
    (document.body || document.documentElement).appendChild(root);

    function setBusy(isBusy) {
      btn.disabled = isBusy;
      btnText.textContent = isBusy ? "导出中…" : "导出";
    }

    function run(action) {
      setBusy(true);
      try {
        const result = action();
        if (!result?.ok) showToast(root, result?.message || "导出失败", true);
      } catch (err) {
        showToast(root, err?.message || "导出失败", true);
      } finally {
        setBusy(false);
      }
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      run(exportMarkdown);
    });

    let rafId = 0;
    const schedulePosition = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updatePosition(root);
      });
    };

    function updateBtnVisible() {
      if (isOnNewChatPage()) {
        root.style.display = "none";
      } else {
        root.style.display = "flex";
      }
    }

    window.addEventListener("resize", () => {
      schedulePosition();
      updateBtnVisible();
    }, { passive: true });
    document.addEventListener("scroll", schedulePosition, true);

    new MutationObserver(() => {
      schedulePosition();
      updateBtnVisible();
    }).observe(document.body, { childList: true, subtree: true });

    schedulePosition();
    updateBtnVisible();
  }

  ensureUi();
})();
