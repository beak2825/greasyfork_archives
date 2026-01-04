// ==UserScript==
// @name         一键发送到AI（支持图文）
// @name:en      Ask AI Anywhere (Support Image)
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.11
// @description  按快捷键选择页面元素，快速发送到Gemini/ChatGPT/AI Studio/DeepSeek
// @description:en  Quickly send web content (text & images) to AI (Gemini, ChatGPT, AI Studio, DeepSeek) with a shortcut
// @author       tmr
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/556649/%E4%B8%80%E9%94%AE%E5%8F%91%E9%80%81%E5%88%B0AI%EF%BC%88%E6%94%AF%E6%8C%81%E5%9B%BE%E6%96%87%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556649/%E4%B8%80%E9%94%AE%E5%8F%91%E9%80%81%E5%88%B0AI%EF%BC%88%E6%94%AF%E6%8C%81%E5%9B%BE%E6%96%87%EF%BC%89.meta.js
// ==/UserScript==

const CONFIG = {
  SHORTCUT_TRIGGER: (e) => e.altKey && e.code === "Digit2",
  PROVIDERS: {
    gemini: {
      name: "Gemini",
      url: "https://gemini.google.com/app",
      inputSelector: 'div[contenteditable="true"], textarea',
      sendButtonSelector: "button.submit",
    },
    chatgpt: {
      name: "ChatGPT",
      url: "https://chatgpt.com/",
      inputSelector: "#prompt-textarea",
      sendButtonSelector: 'button[data-testid="send-button"]',
    },
    aistudio: {
      name: "AI Studio",
      url: "https://aistudio.google.com/prompts/new_chat",
      inputSelector: "ms-autosize-textarea textarea",
      sendButtonSelector: 'button[aria-label="Run"]',
    },
    deepseek: {
      name: "DeepSeek",
      url: "https://chat.deepseek.com/",
      inputSelector: 'textarea[placeholder*="DeepSeek"]',
      sendButtonSelector: 'div[role="button"].ds-icon-button',
    },
  },
  GENERATE_PROMPT: (data) => {
    const { title, url, selection, content, images } = data;
    const zh = navigator.language.toLowerCase().startsWith("zh");
    const prompts = [];
    if (zh) {
      prompts.push(`我正在阅读：${title}`);
    } else {
      prompts.push(`I'm reading: ${title}`);
    }
    if (content) {
      if (zh) {
        prompts.push("内容：");
      } else {
        prompts.push("Content:");
      }
      prompts.push("```markdown");
      prompts.push(content);
      prompts.push("```");
    }
    if (selection) {
      console.log("[Ask] found selection");
      if (zh) {
        prompts.push(`其中${selection}如何理解？`);
      } else {
        prompts.push(`How to understand ${selection}?`);
      }
    } else if (content) {
      console.log("[Ask] found content");
      if (zh) {
        prompts.push("使用通俗的语言总结这篇文章");
      } else {
        prompts.push("Summarize this article in plain language");
      }
    } else if (images) {
      console.log("[Ask] found images");
      if (zh) {
        prompts.push("解释这个图片");
      } else {
        prompts.push("Explain this image");
      }
    }
    return prompts.join("\n");
  },
};

// Helper to wait for element using MutationObserver
function waitForElement(selector, checkFn = (el) => true) {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element && checkFn(element)) {
      return resolve(element);
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element && checkFn(element)) {
        resolve(element);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// Helper to get valid image source, handling lazy loading and relative URLs
function getImageSrc(imgNode) {
  const candidates = [imgNode.src, imgNode.getAttribute("data-src")];

  for (const src of candidates) {
    if (src && !src.startsWith("data:")) {
      try {
        return new URL(src, location.href).href;
      } catch {}
    }
  }
  return null;
}

// Helper to check if image should be included (filters out icons, avatars, etc.)
function shouldIncludeImage(imgNode) {
  // Filter by keywords
  const keywords = ["avatar", "icon", "logo", "profile"];
  const checkStr = `${imgNode.className || ""} ${imgNode.alt || ""} ${
    imgNode.id || ""
  }`.toLowerCase();
  if (keywords.some((k) => checkStr.includes(k))) return false;

  return true;
}

// Helper to extract text (Markdown) and images from element or fragment
function extractContent(elementOrFragment) {
  if (!elementOrFragment) return { text: "", images: [] };

  let text = "";
  const images = [];

  function traverse(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Escape Markdown characters in text
      return node.textContent.replace(/([*_`[\]])/g, "\\$1");
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const tagName = node.tagName;
    if (tagName === "SCRIPT" || tagName === "STYLE" || tagName === "NOSCRIPT")
      return "";

    const parts = [];
    for (const child of node.childNodes) {
      parts.push(traverse(child));
    }
    const content = parts.join("");

    // Handle specific tags
    switch (tagName) {
      case "IMG": {
        const src = getImageSrc(node);
        if (src && shouldIncludeImage(node)) {
          const filename = `img_${images.length + 1}`;
          images.push({ url: src, filename });
          return `\n![${filename}]\n`;
        }
        return "";
      }
      case "BR":
        return "\n";
      case "P":
      case "DIV":
        return `\n${content}\n`;
      case "H1":
        return `\n# ${content}\n`;
      case "H2":
        return `\n## ${content}\n`;
      case "H3":
        return `\n### ${content}\n`;
      case "H4":
        return `\n#### ${content}\n`;
      case "H5":
        return `\n##### ${content}\n`;
      case "H6":
        return `\n###### ${content}\n`;
      case "STRONG":
      case "B":
        return `**${content}**`;
      case "EM":
      case "I":
        return `*${content}*`;
      case "A": {
        const href = node.href;
        if (href) {
          try {
            const url = new URL(href, location.href);
            const isImage =
              ["http:", "https:"].includes(url.protocol) &&
              /\.(jpeg|jpg|gif|png|webp|svg|bmp)$/i.test(url.pathname);

            if (isImage) {
              const filename = `img_${images.length + 1}`;
              images.push({ url: href, filename });
              return `\n![${filename}]\n`;
            } else {
              return `[${content}](${href})`;
            }
          } catch {}
        }
      }
      case "CODE":
        return `\`${content}\``;
      case "PRE":
        return `\n\`\`\`\n${content}\n\`\`\`\n`;
      case "BLOCKQUOTE":
        return `\n> ${content}\n`;
      case "LI":
        return `\n- ${content}`;
      case "UL":
      case "OL":
        return `\n${content}\n`;
      case "TR":
        return `\n${content}`;
      case "TD":
      case "TH":
        return ` ${content} |`;
      default:
        return content;
    }
  }

  text = traverse(elementOrFragment);

  // Clean up whitespace
  text = text.replace(/\n(\s*\n)+/g, "\n").trim();

  // Deduplicate images
  const uniqueImages = [];
  const seenUrls = new Set();
  for (const img of images) {
    if (!seenUrls.has(img.url)) {
      seenUrls.add(img.url);
      uniqueImages.push(img);
    }
  }

  return { text, images: uniqueImages };
}

// Helper to fetch image as File object
function fetchImageAsFile(url, filename, referrer, timeout = 5000) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      headers: {
        Referer: referrer,
      },
      timeout: timeout,
      responseType: "blob",
      onload: (response) => {
        if (response.status === 200) {
          const blob = response.response;
          const file = new File([blob], filename, { type: blob.type });
          resolve(file);
        } else {
          reject(new Error(`Failed to fetch image: ${response.status}`));
        }
      },
      ontimeout: () => reject(new Error("Timeout fetching image")),
      onerror: (err) => reject(err),
    });
  });
}

// DOM Selector Class
class DomSelector {
  constructor() {
    this.state = {
      active: false,
      overlay: null,
      currentElement: null,
      onSelect: null,
    };
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    this.boundHandleClick = this.handleClick.bind(this);
    this.boundHandleKeydown = this.handleKeydown.bind(this);
  }

  injectStyles() {
    if (document.getElementById("ask-ai-anywhere-selector-styles")) return;

    const css = `
      .ask-ai-anywhere-selector-overlay {
        position: absolute;
        border: 3px solid #4285f4;
        background: rgba(66, 133, 244, 0.1);
        pointer-events: none;
        z-index: 2147483647;
        transition: all 0.1s ease;
        box-shadow: 0 0 0 1px rgba(66, 133, 244, 0.3);
      }
      .ask-ai-anywhere-selector-active {
        cursor: crosshair !important;
      }
      .ask-ai-anywhere-selector-active * {
        cursor: crosshair !important;
      }
    `;
    const style = GM_addStyle(css);
    if (style) {
      style.id = "ask-ai-anywhere-selector-styles";
    }
  }

  createOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "ask-ai-anywhere-selector-overlay";
    overlay.style.display = "none";
    document.body.appendChild(overlay);
    return overlay;
  }

  highlight(element) {
    if (!this.state.overlay) return;

    if (!element || element === document.documentElement) {
      this.state.overlay.style.display = "none";
      this.state.currentElement = null;
      return;
    }

    const rect = element.getBoundingClientRect();
    const overlay = this.state.overlay;

    overlay.style.display = "block";
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;

    this.state.currentElement = element;
  }

  handleMouseMove(e) {
    if (!this.state.active) return;

    e.stopPropagation();
    const element = document.elementFromPoint(e.clientX, e.clientY);
    this.highlight(element);
  }

  handleClick(e) {
    if (!this.state.active) return;

    e.preventDefault();
    e.stopPropagation();

    const element = this.state.currentElement;
    if (element && this.state.onSelect) {
      const content = element; // Pass the whole element
      this.state.onSelect(content);
      this.deactivate();
    }
  }

  handleKeydown(e) {
    if (!this.state.active) return;

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      console.log("[Selector] Canceled by user");
      this.deactivate();
    }
  }

  activate(onSelect) {
    if (this.state.active) return;

    console.log("[Selector] Activating DOM selector");

    this.injectStyles();
    this.state.overlay = this.createOverlay();
    this.state.active = true;
    this.state.onSelect = onSelect;

    document.body.classList.add("ask-ai-anywhere-selector-active");

    // Add event listeners with capture to intercept all events
    document.addEventListener("mousemove", this.boundHandleMouseMove, true);
    document.addEventListener("click", this.boundHandleClick, true);
    document.addEventListener("keydown", this.boundHandleKeydown, true);
  }

  deactivate() {
    if (!this.state.active) return;

    console.log("[Selector] Deactivating DOM selector");

    document.body.classList.remove("ask-ai-anywhere-selector-active");

    // Remove event listeners
    document.removeEventListener("mousemove", this.boundHandleMouseMove, true);
    document.removeEventListener("click", this.boundHandleClick, true);
    document.removeEventListener("keydown", this.boundHandleKeydown, true);

    // Clean up overlay
    if (this.state.overlay) {
      this.state.overlay.remove();
      this.state.overlay = null;
    }

    this.state.active = false;
    this.state.currentElement = null;
    this.state.onSelect = null;
  }
}

const domSelector = new DomSelector();

// Initialize Provider page to receive prompts
async function initProviderPage(providerConfig) {
  console.log(`[Ask] Initializing ${providerConfig.name} page`);

  // Check for prompt from URL param or storage
  const urlParams = new URLSearchParams(window.location.search);
  const urlPrompt = urlParams.get("q");
  const prompt = urlPrompt || GM_getValue("ask_prompt");

  // Check for images in storage
  const storedImagesJson = GM_getValue("ask_images");
  let images = [];
  let referrer = "";
  if (storedImagesJson) {
    try {
      const data = JSON.parse(storedImagesJson);
      images = Array.isArray(data) ? data : data.urls;
      referrer = Array.isArray(data) ? "" : data.referrer;
    } catch (e) {
      console.error("[Ask] Failed to parse stored images", e);
    }
  }

  if (!prompt && (!images || images.length === 0)) return;

  console.log("[Ask] Found content to process");

  // Start fetching images immediately if any
  const imageFetchPromise =
    images && images.length > 0
      ? Promise.all(
          images.map((img) => {
            return fetchImageAsFile(img.url, img.filename, referrer).catch(
              (err) => {
                console.error(`[Ask] Failed to fetch image ${img.url}`, err);
                return null;
              }
            );
          })
        )
      : Promise.resolve([]);

  if (document.readyState !== "complete") {
    await new Promise((resolve) => window.addEventListener("load", resolve));
  }

  try {
    const inputBox = await waitForElement(providerConfig.inputSelector);
    console.log("[Ask] Input box found");
    inputBox.focus();

    // 1. Paste Images
    const rawFiles = await imageFetchPromise;
    const files = rawFiles.filter((f) => f !== null);
    if (files.length > 0) {
      console.log(
        `[Ask] Waiting for window load to paste ${files.length} images...`
      );

      console.log(`[Ask] Window loaded, pasting images`);
      const dataTransfer = new DataTransfer();
      files.forEach((file) => {
        console.log(
          `[Ask] Adding file to DataTransfer: ${file.name} (${file.type}, ${file.size} bytes)`
        );
        dataTransfer.items.add(file);
      });

      const pasteEvent = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer,
      });

      // Fallback for some browsers/environments where constructor doesn't set clipboardData correctly
      if (!pasteEvent.clipboardData) {
        Object.defineProperty(pasteEvent, "clipboardData", {
          value: dataTransfer,
          writable: false,
        });
      }

      inputBox.dispatchEvent(pasteEvent);
    }

    // 2. Fill Text
    if (prompt) {
      console.log("[Ask] Filling text prompt");
      inputBox.focus(); // Ensure focus is back on input
      if (inputBox.tagName === "TEXTAREA") {
        const valueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        ).set;
        valueSetter.call(inputBox, prompt);
      } else {
        // Safe text insertion for contenteditable
        // If we just pasted images, we don't want to wipe them out with textContent = ...
        // So we append a text node.
        const textNode = document.createTextNode(prompt);
        inputBox.appendChild(textNode);
      }
      inputBox.dispatchEvent(new Event("input", { bubbles: true }));
      inputBox.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // 3. Send
    const btn = await waitForElement(
      providerConfig.sendButtonSelector,
      (btn) => {
        return !btn.disabled && btn.getAttribute("aria-disabled") !== "true";
      }
    );

    if (btn) {
      console.log("[Ask] Send button ready, clicking");
      btn.click();
      // Cleanup
      console.log("[Ask] Cleanup");
      GM_deleteValue("ask_prompt");
      GM_deleteValue("ask_images");
    }
  } catch (err) {
    console.error("[Ask] Error processing content", err);
  }
}

// Handle shortcut trigger
function handleShortcut(e) {
  if (!CONFIG.SHORTCUT_TRIGGER(e)) return;

  console.log("[Source] Shortcut triggered");
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const selection = window.getSelection();
  let selectionText = "";
  let selectionImages = [];

  if (selection.rangeCount > 0) {
    const container = document.createElement("div");
    for (let i = 0; i < selection.rangeCount; i++) {
      container.appendChild(selection.getRangeAt(i).cloneContents());
    }
    const result = extractContent(container);
    selectionText = result.text;
    selectionImages = result.images;
  }

  domSelector.activate((element) => {
    const { text: content, images: elementImages } = extractContent(element);

    // Combine images and deduplicate
    const includeImages = GM_getValue("include_images", true);
    const allImages = includeImages ? [...selectionImages, ...elementImages] : [];
    // Deduplicate again based on URL
    const uniqueImages = [];
    const seenUrls = new Set();
    for (const img of allImages) {
      if (!seenUrls.has(img.url)) {
        seenUrls.add(img.url);
        uniqueImages.push(img);
      }
    }

    const promptText = CONFIG.GENERATE_PROMPT({
      title: document.title,
      url: location.href,
      selection: selectionText,
      content,
      images: uniqueImages.length ? uniqueImages : null,
    });
    console.log(
      "[Source] Generated prompt from element, length:",
      promptText.length
    );

    GM_setValue("ask_prompt", promptText);
    if (uniqueImages.length > 0) {
      console.log(`[Source] Saving ${uniqueImages.length} images to storage`);
      GM_setValue(
        "ask_images",
        JSON.stringify({
          urls: uniqueImages,
          referrer: location.href,
        })
      );
    }

    const currentProviderKey = GM_getValue("provider", "gemini");
    const provider = CONFIG.PROVIDERS[currentProviderKey];

    const win = window.open(provider.url, "_blank");
    if (!win) {
      console.log("[Source] Failed to open window");
      return;
    }
    console.log(`[Source] ${provider.name} window opened`);
  });
}

let menuIds = [];
// Register menu command to switch provider
function registerMenuCommands() {
  // Unregister existing commands
  for (const id of menuIds) {
    GM_unregisterMenuCommand(id);
  }
  menuIds = [];

  const currentProviderKey = GM_getValue("provider", "gemini");

  Object.entries(CONFIG.PROVIDERS).forEach(([key, config]) => {
    const isCurrent = currentProviderKey === key;
    const title = isCurrent ? `✅ ${config.name}` : `⬜ ${config.name}`;

    const id = GM_registerMenuCommand(title, () => {
      GM_setValue("provider", key);
      registerMenuCommands(); // Re-register to update checkmarks
    });
    menuIds.push(id);
  });

  const includeImages = GM_getValue("include_images", true);
  const imageStatus = includeImages ? "✅" : "⬜";
  menuIds.push(GM_registerMenuCommand(`${imageStatus} 包含图片 (Include Images)`, () => {
    GM_setValue("include_images", !includeImages);
    registerMenuCommands();
  }));
}

(async function () {
  "use strict";

  // Check if we are on a provider page
  const currentUrl = location.href;
  for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
    if (currentUrl.startsWith(config.url)) {
      await initProviderPage(config);
      return; // Exit if we are on a provider page
    }
  }

  // Otherwise, we are on a source page
  registerMenuCommands();
  window.addEventListener("keydown", handleShortcut, true);
})();
