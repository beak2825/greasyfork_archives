// ==UserScript==
// @name        Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:zh-CN  Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:zh-TW  Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:ar     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:bg     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:cs     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:da     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:de     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:el     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:en     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:eo     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:es     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:es-419 Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:fi     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:fr     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:fr-CA  Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:he     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:hr     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:hu     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:id     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:it     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:ja     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:ka     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:ko     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:nb     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:nl     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:pl     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:pt-BR  Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:ro     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:ru     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:sv     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:th     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:tr     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:uk     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:ug     Export ChatGPT/Gemini/Grok conversations as Markdown
// @name:vi     Export ChatGPT/Gemini/Grok conversations as Markdown
// @description        Export chat history from ChatGPT and Grok websites to normal format as Markdown, which can be opened via typora exactly.
// @description:zh-CN  将 ChatGPT 和 Grok 网站的聊天记录导出为普通 Markdown 格式，可在 Typora 中准确打开。
// @description:zh-TW  將 ChatGPT 和 Grok 網站的聊天記錄導出為普通 Markdown 格式，可於 Typora 中精確打開。
// @description:ar     تصدير محفوظات الدردشة من موقعي ChatGPT و Grok إلى تنسيق Markdown عادي يمكن فتحه عبر Typora بدقة.
// @description:bg     Експортиране на историята на чатовете от уебсайтовете ChatGPT и Grok в обикновен Markdown формат, който може да се отвори точно чрез Typora.
// @description:cs     Exportovat historii chatu z webů ChatGPT a Grok do obyčejného formátu Markdown, který lze přesně otevřít v Typora.
// @description:da     Eksportér chat‑historik fra ChatGPT- og Grok‑websteder til normalt Markdown‑format, som kan åbnes præcist i Typora.
// @description:de     Exportiere den Chatverlauf von den ChatGPT‑ und Grok‑Websites in ein normales Markdown‑Format, das exakt in Typora geöffnet werden kann.
// @description:el     Εξαγωγή του ιστορικού συνομιλίας από τις ιστοσελίδες ChatGPT και Grok σε απλό μορφότυπο Markdown, που μπορεί να ανοιχτεί ακριβώς με το Typora.
// @description:en     Export chat history from ChatGPT and Grok websites to normal format as Markdown, which can be opened via typora exactly.
// @description:eo     Eksporti babilhistorion de ChatGPT- kaj Grok‑retejoj al norma Markdown‑formato, kiu povas esti malfermita ĝuste en Typora.
// @description:es     Exportar el historial de chat de los sitios web ChatGPT y Grok a un formato normal Markdown, que se pueda abrir exactamente con Typora.
// @description:es-419 Exportar el historial de chat de los sitios web ChatGPT y Grok a un formato normal Markdown, que se pueda abrir exactamente con Typora.
// @description:fi     Vie ChatGPT:n ja Grok-verkkosivustojen chätähistoria tavalliseen Markdown‑muotoon, jonka Typora avaa täsmälleen oikein.
// @description:fr     Exporter l’historique de discussion des sites ChatGPT et Grok vers un format Markdown normal, pouvant être ouvert exactement avec Typora.
// @description:fr-CA  Exporter l’historique des conversations des sites ChatGPT et Grok dans un format Markdown standard, pouvant être ouvert précisément avec Typora.
// @description:he     ייצוא היסטוריית הצ'אט מאתרי ChatGPT ו‑Grok לפורמט Markdown רגיל, שניתן לפתוח ב‑Typora בדיוק.
// @description:hr     Izvezi povijest razgovora s web‑mjesta ChatGPT i Grok u obični Markdown format, koji se točno može otvoriti u Typora.
// @description:hu     A ChatGPT és Grok webhelyek csevegési előzményeinek exportálása normál Markdown formátumba, amely pontosan megnyitható a Typora segítségével.
// @description:id     Ekspor riwayat obrolan dari situs web ChatGPT dan Grok ke format Markdown biasa, yang bisa dibuka persis dengan Typora.
// @description:it     Esporta la cronologia della chat dai siti ChatGPT e Grok in formato Markdown normale, che può essere aperto esattamente con Typora.
// @description:ja     ChatGPT と Grok のウェブサイトからチャット履歴を通常の Markdown 形式にエクスポートし、Typora で正確に開けるようにします。
// @description:ka     ChatGPT და Grok ვებსაიტების ჩატის ისტორიის ექსპორტი ნორმალურ Markdown ფორმატში, რომელიც Typora-ში ზუსტად იხსნება.
// @description:ko     ChatGPT 및 Grok 웹사이트의 채팅 기록을 일반 Markdown 형식으로 내보내 Typora에서 정확하게 열 수 있습니다.
// @description:nb     Eksporter chattehistorikk fra ChatGPT- og Grok-nettsteder til vanlig Markdown-format, som kan åpnes nøyaktig i Typora.
// @description:nl     Exporteer de chatgeschiedenis van de ChatGPT- en Grok-websites naar normaal Markdown‑formaat, dat precies met Typora geopend kan worden.
// @description:pl     Eksportuj historię czatów ze stron ChatGPT i Grok do zwykłego formatu Markdown, który można dokładnie otworzyć w Typora.
// @description:pt-BR  Exporte o histórico de conversa dos sites ChatGPT e Grok para um formato Markdown normal, que possa ser aberto exatamente via Typora.
// @description:ro     Exportă istoricul conversației de pe site‑urile ChatGPT și Grok într‑un format Markdown normal, care poate fi deschis exact în Typora.
// @description:ru     Экспорт истории чата с сайтов ChatGPT и Grok в обычный формат Markdown, который можно точно открыть в Typora.
// @description:sv     Exportera chatthistorik från ChatGPT- och Grok-webbplatser till vanligt Markdown-format, som kan öppnas exakt i Typora.
// @description:th     ส่งออกประวัติแชทจากเว็บไซต์ ChatGPT และ Grok ไปยังรูปแบบ Markdown ปกติ ซึ่งสามารถเปิดได้อย่างถูกต้องผ่าน Typora
// @description:tr     ChatGPT ve Grok web sitelerinden sohbet geçmişini normal Markdown formatına aktarın; Typora ile tam olarak açılabilir.
// @description:uk     Експортувати історію чату з веб‑сайтів ChatGPT і Grok у звичайний формат Markdown, який точно відкривається в Typora.
// @description:ug     ChatGPT ۋە Grok تور بەتلىرىدىكى چەت تارىخنى ئادەتتىكى Markdown فورماتىغا چىقارسىڭىز بولىدۇ، بۇنى Typora قوشۇلمىسىدە تولۇق ئاچىشقا بولىدۇ.
// @description:vi     Xuất lịch sử trò chuyện từ các trang ChatGPT và Grok sang định dạng Markdown bình thường, có thể mở chính xác bằng Typora.
// @namespace Elior_Chatgpt_XX
// @version   1.1.4
// @author    Elior | fixes by 83
// @icon      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAkZJREFUWEfNV8tSwzAMtPtFlKFMbm2/rO2XEW4ZygBfVMO6lkdWLFtpe6CXwMSWVqvVI94t+D29DDvv3YFd2aW/Rzy9d+94fn1MR6tZbzm43gxvzjlyZrkCMCcLkCaA59fhGEIRsck5P9QDogK4JeoGuvH7PO1r72cAUp5B+cN/Ibj9z+cU9UK/GYD1ZggP98wMfp+nwmfxj5H2MQR3okigE9hfoJUiHRmARXAkKKRptbpWxeXiRoBJ97coxR4YLswMoEc9XaoArQqsFxClIgLoHf7rAdGJOJdTwRpUZIUz5b3TBB1tRgCt6LlyCYBwgM5Ya1LRQUtXYMG3oodzAES+0dXIGC4KwzkN3B7d11jAexUARZnYKaKJF6/UxjQk2g8QILVfqo4EXCvtUUaSKxZRsmhmAOggVQNXPk9RAqfq4CYAMgVKhXB2mgCq9Ij8aSnIjOE8aYXrQDA5a7JgoApAaCCXFoyj+UhhcV1w9feEqKYgtdc4PLjiNbqTUwRTsCUDERToIiQAeLJWm7chGKZWnCdbqgzOwF0AKH9wwMsrBLfl5YdGpKWgpQGA8635L/PHh0itEfGeQVpplWEE0GnFvXaa54HsGbDbW25iK04A1KWTZsHSQdTbLYhN0zjWFsuKk9rUrC5YxTg2juTYCyBA2fNJlLVqqXmvLiS9VEhDVIZUHXInaOyV9ZWMLvQ2o3sX1uZSalHuPQBMazljYvHnmJV2fu7/fppxlIaltRa8+jlmZkBaZR8h2/Su+DxPAyx/tFj08gu12CtmhuPs2AAAAABJRU5ErkJggg==
// @include   *://chatgpt.com/*
// @include   *://grok.com/*
// @include   *://gemini.google.com/*
// @noframes
// @license   MIT
// @run-at    document-idle
// @grant     GM_registerMenuCommand
// @grant     GM_openInTab
// @grant     GM.openInTab
// @grant     GM_addStyle
// @grant     GM_setValue
// @grant     GM_getValue
// @grant     GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/553414/Export%20ChatGPTGeminiGrok%20conversations%20as%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/553414/Export%20ChatGPTGeminiGrok%20conversations%20as%20Markdown.meta.js
// ==/UserScript==
/* global trustedTypes */

(function () {
	'use strict';

	/*!
	* Copyright (c) 2024 - 2025, Elior. All rights reserved.
	* (license text omitted for brevity)
	*/

	const CommonUtil = {
	  onPageLoad: function(callback) {
	    if (document.readyState === "complete") {
	      callback();
	    } else {
	      window.addEventListener("DOMContentLoaded", callback, { once: true });
	      window.addEventListener("load", callback, { once: true });
	    }
	  },
	  addStyle: function(style) {
	    GM_addStyle(style);
	  },
	  createElement: function(tag, options = {}) {
	    const element = document.createElement(tag);
	    if (options.text) {
	      element.textContent = options.text;
	    }
	    if (options.html) {
	      element.innerHTML = options.html;
	    }
	    if (options.style) {
	      Object.assign(element.style, options.style);
	    }
	    if (options.className) {
	      element.className = options.className;
	    }
	    if (options.attributes) {
	      for (let [key, value] of Object.entries(options.attributes)) {
	        element.setAttribute(key, value);
	      }
	    }
	    if (options.childrens) {
	      options.childrens.forEach((child) => {
	        element.appendChild(child);
	      });
	    }
	    return element;
	  },
	  openInTab: function(url, options = { "active": true, "insert": true, "setParent": true }) {
	    if (typeof GM_openInTab === "function") {
	      GM_openInTab(url, options);
	    } else {
	      GM.openInTab(url, options);
	    }
	  },
	  waitForElementByInterval: function(selector, target = document.body, allowEmpty = true, delay = 10, maxDelay = 10 * 1e3) {
	    return new Promise((resolve, reject) => {
	      let totalDelay = 0;
	      let element = target.querySelector(selector);
	      let result = allowEmpty ? !!element : !!element && !!element.innerHTML;
	      if (result) {
	        resolve(element);
	      }
	      const elementInterval = setInterval(() => {
	        if (totalDelay >= maxDelay) {
	          clearInterval(elementInterval);
	          resolve(null);
	        }
	        element = target.querySelector(selector);
	        result = allowEmpty ? !!element : !!element && !!element.innerHTML;
	        if (result) {
	          clearInterval(elementInterval);
	          resolve(element);
	        } else {
	          totalDelay += delay;
	        }
	      }, delay);
	    });
	  }
	};

	const HtmlToMarkdown = {
	  to: function(html, platform) {
	    const parser = new DOMParser();
	    const doc = parser.parseFromString(html, "text/html");
	    const isChatGPT = platform === "chatGPT", isGemini = platform === "gemini", isGrok = platform === "grok";
	    if (!isGemini) {
	      doc.querySelectorAll("span.katex-html").forEach((element) => element.remove());
	    }
	    doc.querySelectorAll("mrow").forEach((mrow) => mrow.remove());
	    doc.querySelectorAll('annotation[encoding="application/x-tex"]').forEach((element) => {
	      if (element.closest(".katex-display")) {
	        const latex = element.textContent;
	        const trimmedLatex = latex.trim();
	        element.replaceWith(`
$$
${trimmedLatex}
$$
`);
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
	    if (isChatGPT) {
	      doc.querySelectorAll("pre").forEach((pre) => {
	        const codeType = pre.querySelector("div > div:first-child")?.textContent || "";
	        const markdownCode = pre.querySelector("div > div:nth-child(3) > code")?.textContent || pre.textContent;
	        pre.innerHTML = `
\`\`\`${codeType}
${markdownCode}
\`\`\``;
	      });
	    } else if (isGrok) {
	      doc.querySelectorAll("div.not-prose").forEach((div) => {
	        const codeType = div.querySelector("div > div > span")?.textContent || "";
	        const markdownCode = div.querySelector("div > div:nth-child(3) > code")?.textContent || div.textContent;
	        div.innerHTML = `
\`\`\`${codeType}
${markdownCode}
\`\`\``;
	      });
	    } else if (isGemini) {
	      doc.querySelectorAll("code-block").forEach((div) => {
	        const codeType = div.querySelector("div > div > span")?.textContent || "";
	        const markdownCode = div.querySelector("div > div:nth-child(2) > div > pre")?.textContent || div.textContent;
	        div.innerHTML = `
\`\`\`${codeType}
${markdownCode}
\`\`\``;
	      });
	    }
	    doc.querySelectorAll("ul").forEach((ul) => {
	      let markdown2 = "";
	      ul.querySelectorAll(":scope > li").forEach((li) => {
	        markdown2 += `- ${li.textContent.trim()}
`;
	      });
	      ul.parentNode.replaceChild(document.createTextNode("\n" + markdown2.trim()), ul);
	    });
	    doc.querySelectorAll("ol").forEach((ol) => {
	      let markdown2 = "";
	      ol.querySelectorAll(":scope > li").forEach((li, index) => {
	        markdown2 += `${index + 1}. ${li.textContent.trim()}
`;
	      });
	      ol.parentNode.replaceChild(document.createTextNode("\n" + markdown2.trim()), ol);
	    });
	    for (let i = 1; i <= 6; i++) {
	      doc.querySelectorAll(`h${i}`).forEach((header) => {
	        const markdownHeader = `
${"#".repeat(i)} ${header.textContent}
`;
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
	        tr.querySelectorAll("th").forEach((th) => {
	          markdown2 += `| ${th.textContent} `;
	        });
	        markdown2 += "|\n";
	        tr.querySelectorAll("th").forEach(() => {
	          markdown2 += "| ---- ";
	        });
	        markdown2 += "|\n";
	      });
	      table.querySelectorAll("tbody tr").forEach((tr) => {
	        tr.querySelectorAll("td").forEach((td) => {
	          markdown2 += `| ${td.textContent} `;
	        });
	        markdown2 += "|\n";
	      });
	      table.parentNode.replaceChild(document.createTextNode("\n" + markdown2.trim() + "\n"), table);
	    });
	    let markdown = doc.body.innerHTML.replace(/<[^>]*>/g, "");
	    markdown = markdown.replaceAll(/- &gt;/g, "- $\\gt$");
	    markdown = markdown.replaceAll(/>/g, ">");
	    markdown = markdown.replaceAll(/</g, "<");
	    markdown = markdown.replaceAll(/≥/g, ">=");
	    markdown = markdown.replaceAll(/≤/g, "<=");
	    markdown = markdown.replaceAll(/≠/g, "\\neq");
	    return markdown.trim();
	  }
	};

	const Download = {
	  start: function(data, filename, type) {
	    var file = new Blob([data], { type });
	    if (window.navigator.msSaveOrOpenBlob) {
	      window.navigator.msSaveOrOpenBlob(file, filename);
	    } else {
	      var a = document.createElement("a"), url = URL.createObjectURL(file);
	      a.href = url;
	      a.download = filename;
	      document.body.appendChild(a);
	      a.click();
	      setTimeout(function() {
	        document.body.removeChild(a);
	        window.URL.revokeObjectURL(url);
	      }, 0);
	    }
	  }
	};

	const Chat = {
	  sanitizeFilename: function(input, replacement = "_") {
	    const illegalRe = /[\/\\\?\%\*\:\|"<>\.]/g;
	    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
	    const reservedRe = /^\.+$/;
	    const windowsReservedRe = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
	    let name = input.replace(illegalRe, replacement).replace(controlRe, replacement).replace(/\s+/g, " ").trim();
	    if (reservedRe.test(name)) {
	      name = "file";
	    }
	    if (windowsReservedRe.test(name)) {
	      name = `file_${name}`;
	    }
	    return name || "untitled";
	  },
	  getConversationElements: function() {
	    const currentUrl = window.location.href;
	    const result = [];
	    let platform = "";
	    let title = "";
	    if (currentUrl.includes("openai.com") || currentUrl.includes("chatgpt.com")) {
	      platform = "chatGPT";
	      title = document.querySelector("#history a[data-active]")?.textContent;
	      result.push(...document.querySelectorAll("div[data-message-id]"));
	    } else if (currentUrl.includes("grok.com")) {
	      platform = "grok";
	      result.push(...document.querySelectorAll("div.message-bubble"));
	    } else if (currentUrl.includes("gemini.google.com")) {
	      platform = "gemini";
	      title = document.querySelector("conversations-list div.selected")?.textContent;
	      const userQueries = document.querySelectorAll("user-query-content");
	      const modelResponses = document.querySelectorAll("model-response");
	      for (let i = 0; i < userQueries.length; i++) {
	        if (i < modelResponses.length) {
	          result.push(userQueries[i]);
	          result.push(modelResponses[i]);
	        } else {
	          result.push(userQueries[i]);
	        }
	      }
	    }
	    return { "result": result, "platform": platform, "title": title };
	  },
	  exportChatAsMarkdown: function() {
	    let markdownContent = "";
	    const { result, platform, title } = this.getConversationElements();
	    const filename = (this.sanitizeFilename(title) || "chat_export") + ".md";
	    for (let i = 0; i < result.length; i += 2) {
	      if (!result[i + 1]) {
	        break;
	      }
	      let userText = result[i].textContent.trim();
	      let answerHtml = result[i + 1].innerHTML.trim();
	      userText = HtmlToMarkdown.to(userText, platform);
	      answerHtml = HtmlToMarkdown.to(answerHtml, platform);
	      markdownContent += `
# Q:
${userText}
# A:
${answerHtml}`;
	    }
	    markdownContent = markdownContent.replace(/&amp;/g, "&");
	    if (markdownContent) {
	      Download.start(markdownContent, filename, "text/markdown");
	    }
	  }
	};

	var css_248z = ".chat-gpt-document-block{align-items:center;border:1px solid #e5e5e5;border-radius:35px;cursor:pointer;display:flex;font-size:15px;justify-content:center;left:50%;padding:5px 15px;position:fixed;top:9px;transform:translateX(-50%);z-index:99999999999!important}.chat-gpt-document-icon-sm{margin-right:5px}.chat-gpt-document-btn-content{align-items:center;display:flex}";

	const Export = {
	  addStyle: function() {
	    CommonUtil.addStyle(css_248z);
	  },
	  createSvgIcon: function() {
	    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	    svg.setAttribute("class", "chat-gpt-document-icon-sm chat-gpt-document-btn-content");
	    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	    svg.setAttribute("fill", "none");
	    svg.setAttribute("viewBox", "0 0 24 24");
	    svg.setAttribute("width", "16");
	    svg.setAttribute("height", "16");
	    svg.setAttribute("stroke-width", "1.5");
	    svg.setAttribute("stroke", "currentColor");
	    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	    path.setAttribute("stroke-linecap", "round");
	    path.setAttribute("stroke-linejoin", "round");
	    path.setAttribute("d", "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z");
	    svg.appendChild(path);
	    document.body.appendChild(svg);
	    return svg;
	  },
	  generateHtml: function() {
	    const outerDiv = CommonUtil.createElement("div", {
	      className: "chat-gpt-document-block",
	      childrens: [
	        this.createSvgIcon(),
	        CommonUtil.createElement("div", {
	          className: "chat-gpt-document-btn-content",
	          text: "Save As .MD"
	        })
	      ]
	    });
	    (document.body || document.documentElement).appendChild(outerDiv);
	    outerDiv.addEventListener("click", function() {
	      Chat.exportChatAsMarkdown();
	    });
	  },
	  start: function() {
	    this.addStyle();
	    this.generateHtml();
	  }
	};

	(() => {
	  // Use window.trustedTypes to avoid 'no-undef' ESLint error and be safe in non-TTP environments.
	  if (typeof window !== "undefined" && window.trustedTypes && window.trustedTypes.defaultPolicy === null) {
	    let s = (s2) => s2;
	    trustedTypes.createPolicy("default", { createHTML: s, createScriptURL: s, createScript: s });
	  }
	})();

	Export.start();

}());
