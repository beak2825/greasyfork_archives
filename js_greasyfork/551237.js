// ==UserScript==
// @name            导出Markdown格式的AI对话（ChatGPT / Gemini / Grok）
// @namespace       https://github.com/YunAsimov
// @version         1.0.1
// @description     Export conversations from ChatGPT / Gemini / Grok (X AI) to clean Markdown with auto full-scroll, code fences, KaTeX, timestamps.
// @author          YunAsimov
// @license         MIT
// @homepageURL     https://github.com/YunAsimov/AI-Chat-Md-Export
// @source          https://github.com/YunAsimov/AI-Chat-Md-Export
// @supportURL      https://github.com/YunAsimov/AI-Chat-Md-Export/issues
// @icon            https://chat.openai.com/favicon.ico
// @match           https://chat.openai.com/*
// @match           https://chatgpt.com/*
// @match           https://poe.com/*
// @match           https://gemini.google.com/*
// @match           https://ai.google.com/*
// @match           https://*.google.com/chat/*
// @match           https://x.com/i/grok*
// @match           https://x.com/*
// @match           https://grok.x.ai/*
// @run-at          document_idle
// @grant           GM_setClipboard
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/551237/%E5%AF%BC%E5%87%BAMarkdown%E6%A0%BC%E5%BC%8F%E7%9A%84AI%E5%AF%B9%E8%AF%9D%EF%BC%88ChatGPT%20%20Gemini%20%20Grok%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551237/%E5%AF%BC%E5%87%BAMarkdown%E6%A0%BC%E5%BC%8F%E7%9A%84AI%E5%AF%B9%E8%AF%9D%EF%BC%88ChatGPT%20%20Gemini%20%20Grok%EF%BC%89.meta.js
// ==/UserScript==

(function () {
	'use strict';

    if (typeof trustedTypes !== 'undefined' && trustedTypes.createPolicy) {
        try { trustedTypes.createPolicy('default', { createHTML: (s) => s, createScriptURL: (s) => s, createScript: (s) => s }); } catch (e) {}
    }

    const config = {
        LONG_LOAD_DELAY: 5000,
        SCROLL_JIGGLES: 4,
        MAX_SCROLL_TRIES: 300,
    };

	const CommonUtil = {
	  addStyle: function(style) { GM_addStyle(style); },
	  createElement: function(tag, options = {}) {
	    const element = document.createElement(tag);
	    if (options.text) { element.textContent = options.text; }
	    if (options.html) { element.innerHTML = options.html; }
	    if (options.style) { Object.assign(element.style, options.style); }
	    if (options.className) { element.className = options.className; }
	    if (options.attributes) { for (let [key, value] of Object.entries(options.attributes)) { element.setAttribute(key, value); } }
	    if (options.childrens) { options.childrens.forEach((child) => { element.appendChild(child); });}
	    return element;
	  }
	};

	const HtmlToMarkdown = {
      to: function(html, platform) {
	    const parser = new DOMParser();
	    const doc = parser.parseFromString(html, "text/html");
	    const isGemini = platform === "gemini";
	    if (!isGemini) {
	      doc.querySelectorAll("span.katex-html").forEach((element) => element.remove());
	    }
	    doc.querySelectorAll("mrow").forEach((mrow) => mrow.remove());
	    doc.querySelectorAll('annotation[encoding="application/x-tex"]').forEach((element) => {
	      if (element.closest(".katex-display")) {
	        const latex = element.textContent;
	        const trimmedLatex = latex.trim();
	        element.replaceWith(`\n$$\n${trimmedLatex}\n$$\n`);
	      } else {
	        const latex = element.textContent;
	        const trimmedLatex = latex.trim();
	        element.replaceWith(`$${trimmedLatex}$`);
	      }
	    });
	    doc.querySelectorAll("strong, b").forEach((bold) => {
	      const markdownBold = `**${bold.textContent}**`;
	      bold.parentNode.replaceChild(document.createTextNode(markdownBold), bold);
	    });
	    doc.querySelectorAll("em, i").forEach((italic) => {
	      const markdownItalic = `*${italic.textContent}*`;
	      italic.parentNode.replaceChild(document.createTextNode(markdownItalic), italic);
	    });
	    doc.querySelectorAll("p code").forEach((code) => {
	      const markdownCode = `\`${code.textContent}\``;
	      code.parentNode.replaceChild(document.createTextNode(markdownCode), code);
	    });
	    doc.querySelectorAll("a").forEach((link) => {
	      const markdownLink = `[${link.textContent}](${link.href})`;
	      link.parentNode.replaceChild(document.createTextNode(markdownLink), link);
	    });
	    doc.querySelectorAll("img").forEach((img) => {
	      const markdownImage = `![${img.alt}](${img.src})`;
	      img.parentNode.replaceChild(document.createTextNode(markdownImage), img);
	    });
	    if (platform === "chatGPT") {
	      doc.querySelectorAll("pre").forEach((pre) => {
	        const codeType = pre.querySelector("div > div:first-child")?.textContent || "";
	        const markdownCode = pre.querySelector("div > div:nth-child(3) > code")?.textContent || pre.textContent;
	        pre.innerHTML = `\n\`\`\`${codeType}\n${markdownCode}\n\`\`\``;
	      });
	    } else if (platform === "grok") {
	      doc.querySelectorAll("div.not-prose").forEach((div) => {
	        const codeType = div.querySelector("div > div > span")?.textContent || "";
	        const markdownCode = div.querySelector("div > div:nth-child(3) > code")?.textContent || div.textContent;
	        div.innerHTML = `\n\`\`\`${codeType}\n${markdownCode}\n\`\`\``;
	      });
	    } else if (isGemini) {
	      doc.querySelectorAll("code-block").forEach((div) => {
	        const codeType = div.querySelector("div > div > span")?.textContent || "";
	        const markdownCode = div.querySelector("div > div:nth-child(2) > div > pre")?.textContent || div.textContent;
	        div.innerHTML = `\n\`\`\`${codeType}\n${markdownCode}\n\`\`\``;
	      });
	    }
	    doc.querySelectorAll("ul").forEach((ul) => {
	      let markdown2 = "";
	      ul.querySelectorAll(":scope > li").forEach((li) => {
	        markdown2 += `- ${li.textContent.trim()}\n`;
	      });
	      ul.parentNode.replaceChild(document.createTextNode("\n" + markdown2.trim()), ul);
	    });
	    doc.querySelectorAll("ol").forEach((ol) => {
	      let markdown2 = "";
	      ol.querySelectorAll(":scope > li").forEach((li, index) => {
	        markdown2 += `${index + 1}. ${li.textContent.trim()}\n`;
	      });
	      ol.parentNode.replaceChild(document.createTextNode("\n" + markdown2.trim()), ol);
	    });
	    for (let i = 1; i <= 6; i++) {
	      doc.querySelectorAll(`h${i}`).forEach((header) => {
	        const markdownHeader = `\n${"#".repeat(i)} ${header.textContent}\n`;
	        header.parentNode.replaceChild(document.createTextNode(markdownHeader), header);
	      });
	    }
	    doc.querySelectorAll("p").forEach((p) => {
	      const markdownParagraph = "\n" + p.textContent + "\n";
	      p.parentNode.replaceChild(document.createTextNode(markdownParagraph), p);
	    });
	    doc.querySelectorAll("table").forEach((table) => {
	      let markdown2 = "";
	      table.querySelectorAll("thead tr").forEach((tr) => {
	        tr.querySelectorAll("th").forEach((th) => { markdown2 += `| ${th.textContent} `; });
	        markdown2 += "|\n";
	        tr.querySelectorAll("th").forEach(() => { markdown2 += "| ---- "; });
	        markdown2 += "|\n";
	      });
	      table.querySelectorAll("tbody tr").forEach((tr) => {
	        tr.querySelectorAll("td").forEach((td) => { markdown2 += `| ${td.textContent} `; });
	        markdown2 += "|\n";
	      });
	      table.parentNode.replaceChild(document.createTextNode("\n" + markdown2.trim() + "\n"), table);
	    });
	    let markdown = doc.body.innerHTML.replace(/<[^>]*>/g, "");
	    return markdown.replaceAll(/- &gt;/g,"- $\\gt$").replaceAll(/>/g,">").replaceAll(/</g,"<").replaceAll(/≥/g,">=").replaceAll(/≤/g,"<=").replaceAll(/≠/g,"\\neq").trim()
      }
    };

	const Download = {
      start: function(data, filename, type) {
	    var file = new Blob([data], { type });
	    if (window.navigator.msSaveOrOpenBlob) {
	      window.navigator.msSaveOrOpenBlob(file, filename);
	    } else {
	      var a = document.createElement("a"), url = URL.createObjectURL(file);
	      a.href = url; a.download = filename;
	      document.body.appendChild(a); a.click();
	      setTimeout(function() { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 0);
	    }
	  }
    };

	const Chat = {
      findScrollableContainer: function(log) {
          const messageSelectors = 'user-query, model-response, div[data-message-id]';
          const firstMessage = document.querySelector(messageSelectors);
          if (!firstMessage) {
              log('Could not find a message element to start search from.');
              return null;
          }

          let parent = firstMessage.parentElement;
          while (parent && parent !== document.body) {
              if (parent.scrollHeight > parent.clientHeight) {
                  log(`Found scrollable container: <${parent.tagName.toLowerCase()}.${parent.className}>`);
                  return parent;
              }
              parent = parent.parentElement;
          }
          log('No specific scroll container found, will attempt to scroll window.');
          return window;
      },

      scrollToTopAndLoadAll: async function() {
        const log = (message) => console.log(`%c[Export script] ${message}`, 'color: #007bff; font-weight: bold;');
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const scrollContainer = this.findScrollableContainer(log);
        if (!scrollContainer) return;

        const getMessageCount = () => document.querySelectorAll('user-query, model-response, div[data-message-id]').length;

        let tries = 0;
        log('Starting aggressive & patient scroll to load entire conversation...');
        while (tries < config.MAX_SCROLL_TRIES) {
            const lastMessageCount = getMessageCount();

            log(`Scrolling up aggressively (Attempt #${tries + 1})...`);
            for (let i = 0; i < config.SCROLL_JIGGLES; i++) {
                scrollContainer.scrollTo({ top: 0 });
                await delay(50);
            }

            log(`Waiting ${config.LONG_LOAD_DELAY}ms for content to load...`);
            await delay(config.LONG_LOAD_DELAY);

            const currentMessageCount = getMessageCount();

            if (currentMessageCount === lastMessageCount && lastMessageCount > 0) {
                log(`Message count is stable at ${currentMessageCount}. Assuming all content is loaded.`);
                break;
            } else {
                 log(`New content loaded. Count: ${lastMessageCount} -> ${currentMessageCount}. Will try again.`);
            }
            tries++;
        }

        if (tries >= config.MAX_SCROLL_TRIES) { log('Reached max scroll tries. Proceeding with export.'); }
        log('Auto-scroll finished.');
    },

	  sanitizeFilename: function(input, replacement = "_") {
	    const illegalRe = /[\/\\\?\%\*\:\|"<>\.]/g;
	    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
	    const reservedRe = /^\.+$/;
	    const windowsReservedRe = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
	    let name = (input || "").replace(illegalRe, replacement).replace(controlRe, replacement).replace(/\s+/g, " ").trim();
	    if (reservedRe.test(name)) { name = "file"; }
	    if (windowsReservedRe.test(name)) { name = `file_${name}`; }
	    return name || "untitled";
	  },
      getConversationElements: function() {
	    const currentUrl = window.location.href;
	    const result = []; let platform = ""; let title = "";
	    if (currentUrl.includes("openai.com") || currentUrl.includes("chatgpt.com")) {
	      platform = "chatGPT";
          title = document.querySelector('div[class*="react-scroll-to-bottom"] h1')?.textContent || document.querySelector('#history a[data-active]')?.textContent || document.title;
	      result.push(...document.querySelectorAll("div[data-message-id]"));
	    } else if (currentUrl.includes("grok.com")) {
	      platform = "grok";
          title = document.title;
	      result.push(...document.querySelectorAll("div.message-bubble"));
	    } else if (currentUrl.includes("gemini.google.com")) {
	      platform = "gemini";
          title = document.querySelector('conversations-list div.selected')?.textContent || document.querySelector('div.conversation-title')?.textContent || document.title;
	      const userQueries = document.querySelectorAll("user-query");
	      const modelResponses = document.querySelectorAll("model-response");
	      for (let i = 0; i < userQueries.length; i++) {
	        result.push(userQueries[i], modelResponses[i] || userQueries[i]);
	      }
	    }
	    return { result, platform, title };
	  },
	  exportChatAsMarkdown: async function() {
        await this.scrollToTopAndLoadAll();
	    let markdownContent = "";
	    const { result, platform, title } = this.getConversationElements();
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}_${String(now.getHours()).padStart(2,"0")}-${String(now.getMinutes()).padStart(2,"0")}-${String(now.getSeconds()).padStart(2,"0")}`;
        const filename = `${timestamp}_${this.sanitizeFilename(title) || "chat_export"}.md`;
	    for (let i = 0; i < result.length; i += 2) {
	      if (!result[i + 1]) break;
	      let userText = result[i].textContent.trim();
	      let answerHtml = result[i + 1].innerHTML.trim();
	      userText = HtmlToMarkdown.to(userText, platform);
	      answerHtml = HtmlToMarkdown.to(answerHtml, platform);
	      markdownContent += `\n# Q:\n${userText}\n# A:\n${answerHtml}`;
	    }
	    markdownContent = markdownContent.replace(/&amp;/g, "&");
	    if (markdownContent.trim()) {
	      Download.start(markdownContent.trim(), filename, "text/markdown");
	    } else {
            alert('Export failed: No conversation content was found. Please check the browser console (F12) for error messages.');
        }
	  }
	};

	const css_248z = `
        .chat-gpt-document-block {
            background-color: var(--gm-background, #FFFFFF); color: var(--gm-text-color, #000000);
            align-items: center; border: 1px solid #9c9c9c; border-radius: 35px;
            cursor: pointer; display: flex; font-size: 14px; justify-content: center;
            left: 50%; padding: 6px 16px; position: fixed; top: 10px;
            transform: translateX(-50%); z-index: 99999999999 !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        @media (prefers-color-scheme: dark) {
            .chat-gpt-document-block {
                background-color: var(--gm-background-dark, #2d2d2d); color: var(--gm-text-color-dark, #E0E0E0);
                border-color: #555;
            }
        }
        .chat-gpt-document-icon-sm { margin-right: 8px; color: currentColor; width: 16px; height: 16px; }
        .chat-gpt-document-btn-content { align-items: center; display: flex; }
        .chat-gpt-document-block.loading { cursor: not-allowed; background-color: #f0f0f0; opacity: 0.7; color: #555; }
    `;

	const Export = {
	  addStyle: function() { CommonUtil.addStyle(css_248z); },
	  createSvgIcon: function() {
	    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	    svg.setAttribute("class", "chat-gpt-document-icon-sm");
	    svg.setAttribute("viewBox", "0 0 24 24");
	    svg.setAttribute("fill", "none");
	    svg.setAttribute("stroke-width", "1.5");
	    svg.setAttribute("stroke", "currentColor");
	    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	    path.setAttribute("stroke-linecap", "round");
	    path.setAttribute("stroke-linejoin", "round");
	    path.setAttribute("d", "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z");
	    svg.appendChild(path);
	    return svg;
	  },
      generateHtml: function() {
        const originalButtonText = 'Save Conversation';
        const buttonTextElement = CommonUtil.createElement("div", { className:"chat-gpt-document-btn-content", text: originalButtonText });
        const outerDiv = CommonUtil.createElement("div", { className:"chat-gpt-document-block", childrens:[this.createSvgIcon(), buttonTextElement] });
        (document.body||document.documentElement).appendChild(outerDiv);
        outerDiv.addEventListener("click",async function(){
            if(outerDiv.classList.contains("loading")) return;
            outerDiv.classList.add("loading"); buttonTextElement.textContent="Loading full chat...";
            try { await Chat.exportChatAsMarkdown() }
            catch(e){ console.error("Export script error:",e); alert("An error occurred during export. Check the console (F12) for details.") }
            finally{ outerDiv.classList.remove("loading"); buttonTextElement.textContent=originalButtonText }
        });
      },
	  start: function(){ this.addStyle(); this.generateHtml(); }
	};

    const run = () => Export.start();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }

}());