// ==UserScript==
// @name         Enhanced Claude Chat & Code Exporter 4.2
// @namespace    https://fsfarimani.dev/
// @version      4.2
// @description  Export Claude chat conversations with code artifacts into individual files with timestamp prefixes
// @author       Foad S. Farimani (fsfarimani) <f.s.farimani@gmail.com>
// @match        https://claude.ai/chat/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/534219-enhanced-claude-chat-code-exporter-4-1
// @source       https://greasyfork.org/en/scripts/534219-enhanced-claude-chat-code-exporter-4-1/code
// @downloadURL https://update.greasyfork.org/scripts/549988/Enhanced%20Claude%20Chat%20%20Code%20Exporter%2042.user.js
// @updateURL https://update.greasyfork.org/scripts/549988/Enhanced%20Claude%20Chat%20%20Code%20Exporter%2042.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Add export buttons to the UI
  // Add export buttons to the UI (mounted outside the React tree via Shadow DOM)
  function addExportButtons() {
    // If our host already exists, bail
    if (document.getElementById("claude-export-host")) return;

    // Create a host attached to <body>
    const host = document.createElement("div");
    host.id = "claude-export-host";
    host.style.all = "initial"; // defensive reset in case of inherited styles
    host.style.position = "fixed";
    host.style.zIndex = "2147483647"; // max-ish
    host.style.bottom = "16px";
    host.style.right = "16px";
    host.style.pointerEvents = "auto";
    document.body.appendChild(host);

    // Shadow root for isolation
    const shadow = host.attachShadow({ mode: "open" });

    // Styles scoped to shadow
    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
      .wrap {
        display: flex;
        gap: 8px;
        background: rgba(17,17,17,0.85);
        border: 1px solid rgba(255,255,255,0.08);
        backdrop-filter: blur(6px);
        padding: 8px;
        border-radius: 10px;
        align-items: center;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      }
      button {
        appearance: none;
        border: 0;
        border-radius: 8px;
        height: 32px;
        padding: 0 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.06s ease, opacity 0.2s ease, filter 0.2s ease;
        will-change: transform;
      }
      button:active { transform: translateY(1px) scale(0.98); }
      .btn-all { background: #4a6ee0; }
      .btn-md  { background: #9e6ee0; }
      .icon { display: inline-flex; }
    `;
    shadow.appendChild(style);

    // Container
    const container = document.createElement("div");
    container.className = "wrap";

    // Export All button
    const btnAll = document.createElement("button");
    btnAll.className = "btn-all";
    btnAll.setAttribute("aria-label", "Export All");
    btnAll.innerHTML = `
      <span class="icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
          <path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112a8,8,0,0,1,16,0v96H200V112a8,8,0,0,1,16,0ZM80,80a8,8,0,0,1,8-8h32V36a4,4,0,0,1,4-4h8a4,4,0,0,1,4,4V72h32a8,8,0,0,1,5.66,13.66l-40,40a8,8,0,0,1-11.32,0l-40-40A8,8,0,0,1,80,80Z"></path>
        </svg>
      </span>
      <span>Export All</span>
    `;
    btnAll.addEventListener("click", exportConversation);

    // Markdown-only button
    const btnMd = document.createElement("button");
    btnMd.className = "btn-md";
    btnMd.setAttribute("aria-label", "Export Markdown Only");
    btnMd.innerHTML = `
      <span class="icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
          <path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112a8,8,0,0,1,16,0v96H200V112a8,8,0,0,1,16,0ZM80,80a8,8,0,0,1,8-8h32V36a4,4,0,0,1,4-4h8a4,4,0,0,1,4,4V72h32a8,8,0,0,1,5.66,13.66l-40,40a8,8,0,0,1-11.32,0l-40-40A8,8,0,0,1,80,80Z"></path>
        </svg>
      </span>
      <span>Md Only</span>
    `;
    btnMd.addEventListener("click", exportMarkdownOnly);

    // Mount
    container.appendChild(btnAll);
    container.appendChild(btnMd);
    shadow.appendChild(container);
  }

  // Helper function to download a file
  function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // Generate a timestamp in the format yyyyMMddHHmmss
  function generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  // Function to export only the markdown content
  async function exportMarkdownOnly() {
    try {
      logDebug("Starting markdown-only export process...");

      // Show loading indicator
      showLoadingIndicator("Extracting conversation...");

      // Generate timestamp prefix for this export
      const timestampPrefix = generateTimestamp();
      logDebug(`Generated timestamp prefix: ${timestampPrefix}`);

      // Get the chat title
      const chatTitle = getChatTitle();
      const safeChatTitle = sanitizeFileName(
        chatTitle || "Claude Conversation"
      );
      logDebug(`Chat title: ${chatTitle} (sanitized: ${safeChatTitle})`);

      // Extract the conversation as markdown
      logDebug("Extracting conversation as markdown");
      const markdown = extractConversationMarkdown();

      // Download the markdown file with timestamp prefix
      const markdownFilename = `${timestampPrefix}_${safeChatTitle}.md`;
      const markdownBlob = new Blob([markdown], { type: "text/markdown" });
      downloadFile(markdownBlob, markdownFilename);
      logDebug(`Downloaded markdown file: ${markdownFilename}`);

      // Show success message
      hideLoadingIndicator();
      showNotification(
        `Exported Claude conversation as markdown successfully!`,
        "success"
      );
    } catch (error) {
      logDebug(`Error in exportMarkdownOnly: ${error.message}`);
      console.error("Error exporting markdown:", error);
      hideLoadingIndicator();
      showNotification(
        "Error exporting markdown. Check console for details.",
        "error"
      );
    }
  }

  // Main function to export the conversation with artifacts
  async function exportConversation() {
    try {
      logDebug("Starting export process...");

      // Initialize a variable to store clipboard content for artifact extraction
      let savedClipboardContent = "";

      // Try to save current clipboard content so we can restore it later
      try {
        savedClipboardContent = await navigator.clipboard.readText();
        logDebug("Saved original clipboard content");
      } catch (error) {
        logDebug("Could not read original clipboard content: " + error.message);
      }

      // Show loading indicator
      showLoadingIndicator("Processing chat and artifacts...");

      // Generate timestamp prefix for this export session
      const timestampPrefix = generateTimestamp();
      logDebug(`Generated timestamp prefix: ${timestampPrefix}`);

      // Get the chat title
      const chatTitle = getChatTitle();
      const safeChatTitle = sanitizeFileName(
        chatTitle || "Claude Conversation"
      );
      logDebug(`Chat title: ${chatTitle} (sanitized: ${safeChatTitle})`);

      // Extract the conversation as markdown
      logDebug("Extracting conversation as markdown");
      const markdown = extractConversationMarkdown();

      // Download the markdown file with timestamp prefix
      const markdownFilename = `${timestampPrefix}_00_${safeChatTitle}.md`;
      const markdownBlob = new Blob([markdown], { type: "text/markdown" });
      downloadFile(markdownBlob, markdownFilename);
      logDebug(`Downloaded markdown file: ${markdownFilename}`);

      // Small delay before processing artifacts
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find all artifact containers in the DOM
      const artifactButtons = document.querySelectorAll(
        'button[aria-label="Preview contents"]'
      );
      logDebug(`Found ${artifactButtons.length} artifact buttons`);

      // Process all artifacts sequentially
      showLoadingIndicator(
        `Found ${artifactButtons.length} artifacts, processing...`
      );

      for (let i = 0; i < artifactButtons.length; i++) {
        const artifactButton = artifactButtons[i];

        try {
          // Update loading indicator with progress
          showLoadingIndicator(
            `Processing artifact ${i + 1} of ${artifactButtons.length}...`
          );

          // First, extract metadata without opening the artifact
          const initialArtifact = extractArtifactMetadataFromPreview(
            artifactButton,
            i
          );

          if (!initialArtifact) {
            logDebug(`Failed to extract metadata for artifact ${i + 1}`);
            continue;
          }

          // Click the artifact button to open the code panel
          logDebug(`Clicking artifact button ${i + 1} to open code panel`);
          artifactButton.click();

          // Wait for the code panel to load
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Now extract the full content using keyboard shortcut method
          const fullArtifact = await extractArtifactUsingKeyboardCopy(
            initialArtifact
          );

          if (fullArtifact && fullArtifact.content) {
            const artifactNumber = String(i + 1).padStart(2, "0");
            const fileName = `${timestampPrefix}_${artifactNumber}_${sanitizeFileName(
              fullArtifact.title
            )}${getFileExtension(fullArtifact.language)}`;

            // Download the artifact
            const blob = new Blob([fullArtifact.content], {
              type: "text/plain",
            });
            downloadFile(blob, fileName);

            logDebug(
              `Downloaded artifact ${i + 1}: ${fileName} (${
                fullArtifact.content.length
              } chars)`
            );

            // Close the code panel by clicking outside or on close button
            const closeButton = document.querySelector(
              'button svg[width="18"][height="18"] path[d*="205.66,194.34"]'
            );
            if (
              closeButton &&
              closeButton.parentElement &&
              closeButton.parentElement.parentElement
            ) {
              closeButton.parentElement.parentElement.click();
            } else {
              // If can't find the close button, try clicking elsewhere
              const header = document.querySelector("header");
              if (header) header.click();
            }

            // Small delay between artifacts to prevent browser throttling
            await new Promise((resolve) => setTimeout(resolve, 800));
          } else {
            logDebug(`Failed to extract content for artifact ${i + 1}`);
          }
        } catch (error) {
          logDebug(`Error processing artifact ${i + 1}: ${error.message}`);
          console.error(`Error processing artifact ${i + 1}:`, error);

          // Try to close any open panels before continuing
          const closeButton = document.querySelector(
            'button svg[width="18"][height="18"] path[d*="205.66,194.34"]'
          );
          if (
            closeButton &&
            closeButton.parentElement &&
            closeButton.parentElement.parentElement
          ) {
            closeButton.parentElement.parentElement.click();
          }
        }
      }

      // Try to restore original clipboard content
      if (savedClipboardContent) {
        try {
          await navigator.clipboard.writeText(savedClipboardContent);
          logDebug("Restored original clipboard content");
        } catch (error) {
          logDebug("Could not restore clipboard: " + error.message);
        }
      }

      // Show success message
      hideLoadingIndicator();
      showNotification(
        `Exported Claude conversation and ${artifactButtons.length} artifacts successfully!`,
        "success"
      );
    } catch (error) {
      logDebug(`Error in exportConversation: ${error.message}`);
      console.error("Error exporting conversation:", error);
      hideLoadingIndicator();
      showNotification(
        "Error exporting conversation. Check console for details.",
        "error"
      );
    }
  }

  // Extract only metadata from an artifact preview without opening it
  function extractArtifactMetadataFromPreview(button, index) {
    try {
      // Extract metadata from the preview
      const titleElement = button.querySelector(".leading-tight.text-sm");
      const typeElement = button.querySelector(".text-sm.text-text-300");

      let title = `artifact_${index + 1}`;
      let type = "Code";

      if (titleElement) {
        title = titleElement.textContent.trim();
      }

      if (typeElement) {
        type = typeElement.textContent.trim();
      }

      // Return metadata without content
      return {
        title: title,
        type: type,
        language: determineLanguage(type, title, ""),
        content: null, // We'll get the content later
      };
    } catch (err) {
      logDebug(`Error in extractArtifactMetadataFromPreview: ${err.message}`);
      console.error("Error extracting artifact metadata from preview:", err);
      return null;
    }
  }

  // Extract artifact content by reading text directly (no clipboard dependency)
  async function extractArtifactUsingKeyboardCopy(artifactMetadata) {
    try {
      // Be liberal about code containers/selectors
      const codeBlock =
        document.querySelector(".code-block__code") ||
        document.querySelector('[data-testid="code-block"] code') ||
        document.querySelector("pre code") ||
        document.querySelector("pre") ||
        document.querySelector("code");

      if (!codeBlock) {
        logDebug("No code block found in panel");
        return null;
      }

      // Determine language from classnames or data attributes
      let language = artifactMetadata.language || "plaintext";
      const langGuessers = [
        (el) => (el.getAttribute && el.getAttribute("data-language")) || null,
        (el) => {
          const cls = (el.className || "").toString();
          const m = cls.match(/\blanguage-([\w+-]+)\b/i);
          return m ? m[1] : null;
        },
        (el) => {
          // Some UIs put language on the parent container
          const parent = el.parentElement;
          if (!parent) return null;
          const cls = (parent.className || "").toString();
          const m = cls.match(/\blanguage-([\w+-]+)\b/i);
          return m ? m[1] : null;
        },
      ];
      for (const g of langGuessers) {
        const v = g(codeBlock);
        if (v) {
          language = v;
          break;
        }
      }

      // Extract plain text reliably; innerText preserves visual line breaks
      let extractedText = (
        codeBlock.innerText ||
        codeBlock.textContent ||
        ""
      ).replace(/\r\n/g, "\n");

      // If extraction is unexpectedly empty, try a broader read
      if (!extractedText.trim()) {
        const fallback =
          document.querySelector("pre") || document.querySelector("code");
        if (fallback && fallback !== codeBlock) {
          extractedText = (
            fallback.innerText ||
            fallback.textContent ||
            ""
          ).replace(/\r\n/g, "\n");
        }
      }

      // Final safety net
      if (!extractedText.trim()) {
        extractedText = "// Unable to extract code from the artifact panel";
      }

      return {
        title: artifactMetadata.title,
        type: artifactMetadata.type,
        language: language,
        content: extractedText,
      };
    } catch (err) {
      logDebug(`Error in extractArtifactUsingKeyboardCopy: ${err.message}`);
      console.error("Error extracting artifact without clipboard:", err);

      // Last resort: try reading any visible pre/code text
      const anyCode = document.querySelector("pre, code");
      const txt = anyCode ? anyCode.innerText || anyCode.textContent || "" : "";
      return {
        title: artifactMetadata.title,
        type: artifactMetadata.type,
        language: artifactMetadata.language || "plaintext",
        content: txt || "// Error extracting content",
      };
    }
  }

  // Extract all text from an element including all child nodes, maintaining line breaks
  function extractAllTextFromElement(element) {
    if (!element) return "";

    let text = "";
    const childNodes = element.childNodes;

    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];

      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Process element nodes
        if (
          node.tagName === "BR" ||
          node.tagName === "DIV" ||
          node.tagName === "P"
        ) {
          text += "\n"; // Add newline for line break elements
        }

        // Recursively process child elements
        text += extractAllTextFromElement(node);

        // Add newline after certain block elements
        if (
          node.tagName === "DIV" ||
          node.tagName === "P" ||
          node.tagName === "LI" ||
          node.tagName === "TR"
        ) {
          text += "\n";
        }
      }
    }

    return text;
  }

  // Extract the conversation as markdown (more tolerant selectors)
  function extractConversationMarkdown() {
    let markdown = "";

    // Title (from robust getter)
    const chatTitle = getChatTitle();
    if (chatTitle) {
      markdown += `# ${chatTitle}\n\n`;
    }

    // Export timestamp
    const now = new Date();
    markdown += `*Exported on: ${now.toLocaleString()}*\n\n`;

    // Try to find a message list container (best effort)
    const root =
      document.querySelector('[data-testid="chat"]') ||
      document.querySelector('[role="main"]') ||
      document.body;

    // Collect likely message nodes
    const messageNodes = root.querySelectorAll(
      [
        '[data-testid="chat-message"]',
        '[data-testid="message"]',
        "[data-message]",
        'article[role="article"]',
        'div[role="listitem"]',
        // fallback for generic message groups (Claude UI often nests blocks)
        ".group, .prose, .markdown",
      ].join(", ")
    );

    // Helper to convert a block to basic markdown
    const toMarkdown = (el) => {
      if (!el) return "";
      // Prefer innerText to keep line breaks; trim trailing spaces
      return (el.innerText || el.textContent || "")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    };

    // Identify role (user/assistant) per node
    messageNodes.forEach((node) => {
      // Heuristics/markers seen across Claude revisions
      const isUser =
        node.querySelector('[data-testid="user-message"]') ||
        node.getAttribute("data-message") === "user" ||
        node.querySelector('[data-role="user"]') ||
        node.querySelector('[aria-label="User"]');

      const isAssistant =
        node.querySelector(".font-claude-message") ||
        node.querySelector('[data-testid="assistant-message"]') ||
        node.getAttribute("data-message") === "assistant" ||
        node.querySelector('[data-role="assistant"]') ||
        node.querySelector('[aria-label="Claude"]');

      // Skip containers that are clearly empty
      const contentText = toMarkdown(node);
      if (!contentText) return;

      if (isUser) {
        markdown += `## User\n\n${contentText}\n\n`;
        return;
      }
      if (isAssistant) {
        markdown += `## Claude\n\n${contentText}\n\n`;

        // Attach artifact references if present
        const artifactButtons = node.querySelectorAll(
          'button[aria-label="Preview contents"]'
        );
        artifactButtons.forEach((button, index) => {
          const titleElement = button.querySelector(".leading-tight.text-sm");
          const typeElement = button.querySelector(".text-sm.text-text-300");
          const title = titleElement
            ? titleElement.textContent.trim()
            : `artifact_${index + 1}`;
          const type = typeElement ? typeElement.textContent.trim() : "Code";
          const artifactNumber = String(index + 1).padStart(2, "0");

          markdown += `\n**Code Artifact:** \`${artifactNumber}_${title}\` (${type})\n`;
          markdown += `*See separate file with corresponding timestamp prefix*\n\n`;
        });

        return;
      }

      // If we cannot confidently tell, include as a generic assistant message,
      // because most content blocks belong to assistant in Claude’s UI.
      markdown += `## Claude\n\n${contentText}\n\n`;
    });

    return markdown;
  }

  // Determine the language of a code artifact based on context clues
  function determineLanguage(type, title, content) {
    // If it's not code, return as document
    if (type.toLowerCase() !== "code") {
      return "markdown";
    }

    // Check title for language hints
    const titleLower = title.toLowerCase();
    if (titleLower.includes("java")) return "java";
    if (titleLower.includes("python") || titleLower.includes(".py"))
      return "python";
    if (titleLower.includes("javascript") || titleLower.includes("js"))
      return "javascript";
    if (titleLower.includes("html")) return "html";
    if (titleLower.includes("css")) return "css";
    if (
      titleLower.includes("bash") ||
      titleLower.includes("shell") ||
      titleLower.includes(".sh")
    )
      return "bash";
    if (titleLower.includes("powershell") || titleLower.includes(".ps1"))
      return "powershell";
    if (titleLower.includes("sql")) return "sql";
    if (titleLower.includes("c#")) return "csharp";
    if (titleLower.includes("c++")) return "cpp";
    if (titleLower.includes("go")) return "go";
    if (titleLower.includes("rust")) return "rust";

    // Check content for language clues if content is provided
    if (content) {
      if (content.includes("public class") || content.includes("import java."))
        return "java";
      if (content.includes("def ") && content.includes(":")) return "python";
      if (content.includes("function") && content.includes("{"))
        return "javascript";
      if (content.includes("<html") || content.includes("<!DOCTYPE html"))
        return "html";
      if (content.includes("#!/bin/bash")) return "bash";
      if (content.includes("#!/bin/sh")) return "bash";
      if (content.includes("#!powershell")) return "powershell";
    }

    // Default to plaintext if we can't determine
    return "plaintext";
  }

  // Get the appropriate file extension for a language
  function getFileExtension(language) {
    const extensions = {
      java: ".java",
      python: ".py",
      javascript: ".js",
      html: ".html",
      css: ".css",
      bash: ".sh",
      powershell: ".ps1",
      sql: ".sql",
      csharp: ".cs",
      cpp: ".cpp",
      go: ".go",
      rust: ".rs",
      markdown: ".md",
      plaintext: ".txt",
    };

    return extensions[language.toLowerCase()] || ".txt";
  }

  // Get the chat title (robust + derives from first user message if generic)
  function getChatTitle() {
    // 1) Try common title locations
    const selectors = [
      '[data-testid="conversation-title"]',
      '[data-testid="chat-title"]',
      "header h1",
      'h1[role="heading"]',
      "h1.truncate",
      "h1",
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.textContent && el.textContent.trim()) {
        const t = el.textContent.trim();
        if (!isGenericTitle(t)) return t;
      }
    }

    // 2) Fallback: document.title (strip common decorations)
    const dt = (document.title || "")
      .trim()
      .replace(/^\s*Claude\s*[–-]\s*/i, "")
      .replace(/\s*[–-]\s*Claude\s*$/i, "")
      .trim();
    if (dt && !isGenericTitle(dt)) return dt;

    // 3) Last-resort: derive from the first user message snippet
    const root =
      document.querySelector('[data-testid="chat"]') ||
      document.querySelector('[role="main"]') ||
      document.body;

    // Prefer explicit user markers; fall back to plausible user blocks
    const userCandidates = root.querySelectorAll(
      [
        '[data-testid="user-message"]',
        '[data-role="user"]',
        '[aria-label="User"]',
        '[data-message="user"]',
        // plausible fallbacks (Claude often renders user text in simple blocks)
        'article[role="article"]',
        'div[role="listitem"]',
        ".prose, .markdown",
      ].join(", ")
    );

    for (const node of userCandidates) {
      const txt = (node.innerText || node.textContent || "")
        .replace(/\s+/g, " ")
        .trim();
      if (txt && !isLikelyNonContent(txt)) {
        const snippet = txt.slice(0, 60);
        const clean = snippet.replace(/[\\/:*?"<>|]+/g, " ").trim();
        if (clean) return clean;
      }
    }

    // If all else fails, let caller use its own fallback
    return null;

    // Helpers
    function isGenericTitle(s) {
      // Titles like "Claude" or empty are not helpful
      const v = (s || "").trim().toLowerCase();
      return !v || v === "claude" || v === "chat" || v === "conversation";
    }
    function isLikelyNonContent(s) {
      // Ignore very short or purely decorative strings
      return s.length < 4;
    }
  }

  // Sanitize a string to be used as a filename
  function sanitizeFileName(name) {
    return name
      .replace(/[\\/:*?"<>|]/g, "_") // Replace invalid filename chars
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/__+/g, "_") // Replace multiple underscores with a single one
      .replace(/^_+|_+$/g, "") // Remove leading/trailing underscores
      .slice(0, 100); // Limit length to 100 chars
  }

  // Log debug information to console with prefix
  function logDebug(message) {
    console.log(`[Claude Exporter] ${message}`);
  }

  // Show loading indicator with message
  function showLoadingIndicator(message) {
    // Remove existing indicator if any
    hideLoadingIndicator();

    const indicator = document.createElement("div");
    indicator.id = "claude-export-loading";
    indicator.style.position = "fixed";
    indicator.style.top = "50%";
    indicator.style.left = "50%";
    indicator.style.transform = "translate(-50%, -50%)";
    indicator.style.padding = "20px";
    indicator.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    indicator.style.color = "white";
    indicator.style.borderRadius = "8px";
    indicator.style.zIndex = "10000";
    indicator.style.fontSize = "16px";
    indicator.style.fontFamily = "system-ui, -apple-system, sans-serif";

    // Add a spinner and message for better visual feedback
    indicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="spinner" style="border: 3px solid rgba(255,255,255,.3); border-radius: 50%; border-top: 3px solid white; width: 20px; height: 20px; animation: spin 1s linear infinite;"></div>
                <div>${message || "Processing..."}</div>
            </div>
        `;

    // Add animation style
    const style = document.createElement("style");
    style.id = "claude-export-style";
    style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

    if (!document.getElementById("claude-export-style")) {
      document.head.appendChild(style);
    }

    document.body.appendChild(indicator);
  }

  // Hide loading indicator
  function hideLoadingIndicator() {
    const indicator = document.getElementById("claude-export-loading");
    if (indicator) {
      document.body.removeChild(indicator);
    }
  }

  // Show a notification
  function showNotification(message, type = "info") {
    // Remove any existing notification
    const existingNotification = document.getElementById(
      "claude-export-notification"
    );
    if (existingNotification) {
      document.body.removeChild(existingNotification);
    }

    const notification = document.createElement("div");
    notification.id = "claude-export-notification";
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "4px";
    notification.style.zIndex = "10000";
    notification.style.fontSize = "14px";
    notification.style.fontFamily = "system-ui, -apple-system, sans-serif";
    notification.style.textAlign = "center";
    notification.style.maxWidth = "80%";
    notification.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";

    if (type === "error") {
      notification.style.backgroundColor = "#f44336";
      notification.style.color = "white";
    } else if (type === "success") {
      notification.style.backgroundColor = "#4CAF50";
      notification.style.color = "white";
    } else {
      notification.style.backgroundColor = "#2196F3";
      notification.style.color = "white";
    }

    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      if (document.getElementById("claude-export-notification")) {
        document.body.removeChild(notification);
      }
    }, 5000);
  }

  // Initialize the script
  function init() {
    logDebug("Initializing Enhanced Claude Exporter 4.1");

    // Add export buttons when the page loads
    addExportButtons();

    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      // Check if we need to add the export buttons after DOM changes
      addExportButtons();
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also register menu commands
    GM_registerMenuCommand(
      "Export Claude Conversation with Artifacts",
      exportConversation
    );
    GM_registerMenuCommand(
      "Export Claude Conversation as Markdown Only",
      exportMarkdownOnly
    );

    logDebug("Initialization complete");
  }

  // Run the initialization
  init();
})();
