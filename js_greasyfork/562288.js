// ==UserScript==
// @name         Perplexity.ai Chat Exporter (Simplified)
// @namespace    https://github.com/ckep1/pplxport
// @version      4.0.8
// @description  Export Perplexity.ai conversations as markdown - simplified scroll logic
// @author       Chris Kephart (simplified version)
// @match        https://www.perplexity.ai/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562288/Perplexityai%20Chat%20Exporter%20%28Simplified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562288/Perplexityai%20Chat%20Exporter%20%28Simplified%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEBUG = true;
  const log = DEBUG ? console.log.bind(console, '[PPLXExport]') : () => {};

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function getPreferences() {
    return {
      formatStyle: GM_getValue("formatStyle", "full"),
      exportMethod: GM_getValue("exportMethod", "download"),
      includeFrontmatter: GM_getValue("includeFrontmatter", true),
    };
  }

  // ============================================================================
  // EXTRACTION - scroll down slowly, click copy buttons as we see them
  // ============================================================================

  function findScroller() {
    // Start from thread container, walk up to find scrollable ancestor
    const thread = document.querySelector('.max-w-threadContentWidth, [class*="threadContentWidth"]') || 
                   document.querySelector("main") || 
                   document.body;
    
    const candidates = [];
    let node = thread;
    while (node && node !== document.body) {
      candidates.push(node);
      node = node.parentElement;
    }
    
    const scrollingElement = document.scrollingElement || document.documentElement;
    candidates.push(scrollingElement);

    let best = null;
    for (const el of candidates) {
      try {
        const style = getComputedStyle(el);
        const overflowY = (style.overflowY || style.overflow || "").toLowerCase();
        const canScroll = el.scrollHeight - el.clientHeight > 50;
        const isScrollable = /auto|scroll|overlay/.test(overflowY) || el === scrollingElement;
        if (canScroll && isScrollable) {
          if (!best || el.scrollHeight > best.scrollHeight) {
            best = el;
          }
        }
      } catch (e) {}
    }
    
    log('Found scroller:', best?.tagName, best?.className?.slice(0, 50), 'scrollHeight:', best?.scrollHeight);
    return best || scrollingElement;
  }

  function contentHash(text) {
    // Simple hash for deduplication
    const t = text.trim();
    return `${t.length}:${t.slice(0, 100)}:${t.slice(-50)}`;
  }

  async function extractConversation() {
    const conversation = [];
    const clickedButtons = new Set();
    const seenContent = new Set();  // dedupe by content hash
    
    const scroller = findScroller();
    
    // Go to top
    scroller.scrollTop = 0;
    await sleep(300);
    
    log('Starting extraction...');
    
    let lastScrollTop = -1;
    
    // Smaller steps (25px) but faster (25ms) = same speed, smoother motion
    while (scroller.scrollTop !== lastScrollTop) {
      lastScrollTop = scroller.scrollTop;
      
      // Find copy buttons
      const buttons = document.querySelectorAll(
        'button[data-testid="copy-query-button"], button[aria-label="Copy Query"], button[aria-label="Copy"]'
      );
      
      for (const btn of buttons) {
        // Skip code copy buttons
        if (btn.closest("pre") || btn.closest("code")) continue;
        if ((btn.getAttribute("data-testid") || "").includes("copy-code")) continue;
        if ((btn.getAttribute("aria-label") || "").toLowerCase().includes("copy code")) continue;
        
        // ID by position on page
        const rect = btn.getBoundingClientRect();
        const btnId = Math.round(rect.top + scroller.scrollTop);
        
        if (clickedButtons.has(btnId)) continue;
        if (rect.top < 0 || rect.top > window.innerHeight) continue;
        
        clickedButtons.add(btnId);
        
        const isUser = btn.getAttribute("data-testid") === "copy-query-button" || 
                       btn.getAttribute("aria-label") === "Copy Query";
        const role = isUser ? "User" : "Assistant";
        
        btn.click();
        await sleep(50);
        
        try {
          const text = await navigator.clipboard.readText();
          if (text && text.trim()) {
            const hash = contentHash(text);
            
            // Dedupe by content
            if (seenContent.has(hash)) {
              log(`Skipped duplicate ${role}`);
              continue;
            }
            seenContent.add(hash);
            
            conversation.push({ role, content: text.trim() });
            log(`Got ${role}: ${text.slice(0, 50)}...`);
          }
        } catch (e) {
          log('Clipboard failed:', e);
        }
      }
      
      // Scroll down 25px (smoother)
      scroller.scrollTop += 25;
      await sleep(25);
    }
    
    // Validation: count buttons we should have found
    const totalQueryBtns = document.querySelectorAll('button[data-testid="copy-query-button"], button[aria-label="Copy Query"]').length;
    const totalCopyBtns = Array.from(document.querySelectorAll('button[aria-label="Copy"]'))
      .filter(b => !b.closest("pre") && !b.closest("code") && 
                   !(b.getAttribute("data-testid") || "").includes("copy-code") &&
                   !(b.getAttribute("aria-label") || "").toLowerCase().includes("copy code")).length;
    
    const userCount = conversation.filter(c => c.role === "User").length;
    const assistantCount = conversation.filter(c => c.role === "Assistant").length;
    
    log(`Validation: Found ${userCount}/${totalQueryBtns} user, ${assistantCount}/${totalCopyBtns} assistant`);
    
    if (userCount < totalQueryBtns || assistantCount < totalCopyBtns) {
      log('Warning: May have missed some messages');
    }
    
    log(`Done: ${conversation.length} messages`);
    return conversation;
  }

  // ============================================================================
  // FORMAT OUTPUT
  // ============================================================================

  function formatMarkdown(conversations) {
    const title = document.title.replace(" | Perplexity", "").trim();
    const timestamp = new Date().toISOString().split("T")[0];
    const prefs = getPreferences();

    let md = "";

    if (prefs.includeFrontmatter) {
      md += `---\ntitle: ${title}\ndate: ${timestamp}\nsource: ${window.location.href}\n---\n\n`;
    }

    // Build table of contents (interleaved)
    md += `## Table of Contents\n\n`;
    
    let msgNum = 0;
    for (const conv of conversations) {
      msgNum++;
      const label = conv.role === "User" ? "User" : "Perplexity";
      const preview = conv.content.trim().slice(0, 50).replace(/\n/g, ' ') + (conv.content.length > 50 ? '...' : '');
      md += `- **${label}:** [${preview}](#msg-${msgNum})\n`;
    }
    
    md += `\n---\n\n`;

    // Body
    msgNum = 0;
    for (const conv of conversations) {
      msgNum++;
      const label = conv.role === "User" ? "User" : "Perplexity";
      
      if (prefs.formatStyle === "full" || conv.role === "Assistant") {
        md += `<a id="msg-${msgNum}"></a>\n\n`;
        if (prefs.formatStyle === "full") {
          md += `**${label}:** ${conv.content.trim()}\n\n---\n\n`;
        } else {
          md += `${conv.content.trim()}\n\n---\n\n`;
        }
      }
    }

    return md.trim();
  }

  // ============================================================================
  // EXPORT
  // ============================================================================

  function downloadMarkdown(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function copyToClipboard(content) {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch {
      return false;
    }
  }

  // ============================================================================
  // UI
  // ============================================================================

  function addExportButton() {
    if (document.getElementById("perplexity-export-controls")) return;

    const container = document.createElement("div");
    container.id = "perplexity-export-controls";
    container.style.cssText = `
      position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 8px; z-index: 99999;
    `;

    const exportBtn = document.createElement("button");
    exportBtn.id = "perplexity-export-btn";
    exportBtn.textContent = "Export Markdown";
    exportBtn.style.cssText = `
      padding: 8px 16px; background: #30b8c6; color: black; border: none;
      border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600;
    `;

    const optionsBtn = document.createElement("button");
    optionsBtn.textContent = "⚙️";
    optionsBtn.style.cssText = `
      padding: 8px 12px; background: #30b8c6; color: black; border: none;
      border-radius: 8px; cursor: pointer; font-size: 13px;
    `;

    const menu = document.createElement("div");
    menu.style.cssText = `
      position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
      display: none; flex-direction: column; gap: 8px; min-width: 220px;
      background: #1F2121; color: white; border-radius: 12px; padding: 12px;
    `;

    function renderMenu() {
      const prefs = getPreferences();
      menu.innerHTML = `
        <label style="font-size: 12px;">Format
          <select id="pplx-format" style="width: 100%; margin-top: 4px; padding: 4px; background: #2d3748; color: white; border: 1px solid #4a5568; border-radius: 4px;">
            <option value="full" ${prefs.formatStyle === 'full' ? 'selected' : ''}>Full (User & Assistant)</option>
            <option value="concise" ${prefs.formatStyle === 'concise' ? 'selected' : ''}>Concise (Assistant only)</option>
          </select>
        </label>
        <label style="font-size: 12px;">Export Method
          <select id="pplx-method" style="width: 100%; margin-top: 4px; padding: 4px; background: #2d3748; color: white; border: 1px solid #4a5568; border-radius: 4px;">
            <option value="download" ${prefs.exportMethod === 'download' ? 'selected' : ''}>Download File</option>
            <option value="clipboard" ${prefs.exportMethod === 'clipboard' ? 'selected' : ''}>Copy to Clipboard</option>
          </select>
        </label>
        <label style="font-size: 12px; display: flex; align-items: center; gap: 6px;">
          <input type="checkbox" id="pplx-frontmatter" ${prefs.includeFrontmatter ? 'checked' : ''}>
          Include frontmatter
        </label>
      `;
      menu.querySelector('#pplx-format').onchange = e => GM_setValue('formatStyle', e.target.value);
      menu.querySelector('#pplx-method').onchange = e => GM_setValue('exportMethod', e.target.value);
      menu.querySelector('#pplx-frontmatter').onchange = e => GM_setValue('includeFrontmatter', e.target.checked);
    }

    optionsBtn.onclick = () => {
      if (menu.style.display === 'none') {
        renderMenu();
        menu.style.display = 'flex';
      } else {
        menu.style.display = 'none';
      }
    };

    document.addEventListener('click', e => {
      if (!container.contains(e.target)) menu.style.display = 'none';
    });

    exportBtn.onclick = async () => {
      const originalText = exportBtn.textContent;
      exportBtn.textContent = "Exporting...";
      exportBtn.disabled = true;

      try {
        const conversation = await extractConversation();
        
        if (conversation.length === 0) {
          alert("No conversation found.");
          return;
        }

        const markdown = formatMarkdown(conversation);
        const prefs = getPreferences();

        if (prefs.exportMethod === "clipboard") {
          const ok = await copyToClipboard(markdown);
          exportBtn.textContent = ok ? "Copied!" : "Failed";
          setTimeout(() => { exportBtn.textContent = originalText; }, 2000);
        } else {
          const title = document.title.replace(" | Perplexity", "").trim();
          const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + ".md";
          downloadMarkdown(markdown, filename);
          exportBtn.textContent = originalText;
        }
      } catch (err) {
        console.error("Export failed:", err);
        alert("Export failed: " + err.message);
        exportBtn.textContent = originalText;
      } finally {
        exportBtn.disabled = false;
      }
    };

    container.appendChild(exportBtn);
    container.appendChild(optionsBtn);
    container.appendChild(menu);
    document.body.appendChild(container);
    log("Button added");
  }

  // ============================================================================
  // INIT
  // ============================================================================

  function hasContent() {
    return !!document.querySelector(".prose, span[data-lexical-text='true']");
  }

  async function init() {
    log("Init...");
    await sleep(2000);
    
    if (hasContent()) {
      addExportButton();
    } else {
      const observer = new MutationObserver(() => {
        if (hasContent() && !document.getElementById("perplexity-export-btn")) {
          observer.disconnect();
          addExportButton();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();