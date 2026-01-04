// ==UserScript==
// @name                       Online Judge 标题复制器
// @name:zh-CN                 Online Judge 标题复制器
// @name:en                    Online Judge Problem Title Copier
// @namespace                  https://tampermonkey.net
// @version                    0.3.4
// @author                     Jerry Karlbaey
// @description                这个脚本可以复制各大 OJ 的题目标题，方便整理题号信息并收藏到本地
// @description:zh-CN          这个脚本可以复制各大 OJ 的题目标题，方便整理题号信息并收藏到本地
// @description:en             This script can copy the problem titles from major OJs, making it easy to organize problem numbers and save them locally.
// @homepage                   https://github.com/Karlbaey/Karlgo
// @supportURL                 https://github.com/Karlbaey/Karlgo/issues
// @grant                      GM_setClipboard
// @license                    AGPL-3.0-only
// @match                      *://onlinejudge.org/index.php*option=com_onlinejudge*page=show_problem*
// @match                      *://codeforces.com/problemset/problem/*
// @match                      *://codeforces.com/contest/*/problem/*
// @match                      *://leetcode.com/problems/*
// @match                      *://leetcode.cn/problems/*
// @match                      *://www.luogu.com.cn/problem/*
// @match                      *://www.lintcode.com/problem/*
// @match                      *://acm.hdu.edu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/558749/Online%20Judge%20%E6%A0%87%E9%A2%98%E5%A4%8D%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558749/Online%20Judge%20%E6%A0%87%E9%A2%98%E5%A4%8D%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- Site Configurations ---
  const siteConfigs = {
    "onlinejudge.org": {
      prefix: "UVa",
      selector: "#col3_content_wrapper h3",
    },
    "codeforces.com": {
      prefix: "CF",
      selector: ".problem-statement .header .title",
      process: (text) => {
        // 1. Extract the match ID and problem code from the URL
        const Path = window.location.pathname;
        const match = Path.match(/\/problem\/(\d+)\/([A-Z]\d?)/);
        if (!match) {
          return text.replace(/\./g, "");
        }
        // match[1] is the competition/problem set ID, such as "2175"
        const contestId = match[1];
        // match[2] is the problem code, such as "B"
        const problemCode = match[2];
        const problemName = text.substring(text.indexOf(".") + 1).trim();
        return `${contestId}${problemCode}_${problemName}`;
      },
    },
    "leetcode.com": {
      prefix: "LC",
      selector: ".text-title-large",
      // Remove dot '.'
      process: (text) => text.replace(/\./g, ""),
    },
    "leetcode.cn": {
      prefix: "LC", // Sync with English site
      selector: ".text-title-large",
      // Remove dot '.'
      process: (text) => text.replace(/\./g, ""),
    },
    "www.luogu.com.cn": {
      prefix: "LG",
      selector: ".lfe-h1",
    },
    "www.lintcode.com": {
      prefix: "Lint",
      selector: ".title-TkVpy",
    },
    "acm.hdu.edu.cn": {
      prefix: "HDOJ",
      // FIX: Use a more specific selector to target the problem title's h1,
      // which has a unique inline style. This avoids selecting the site's main banner h1.
      selector: "h1",
      process: (text) => {
        const params = new URLSearchParams(window.location.search);
        const problemId = params.get("pid");
        return problemId ? `${problemId}_${text}` : text;
      },
    },
  };

  // --- Core Logic ---

  /**
   * Create and attach a copy button next to the specified element
   * @param {HTMLElement} titleElement - The DOM element where the title is located
   * @param {object} config - Current site configuration
   */
  function create(titleElement, config) {
    if (
      titleElement.nextElementSibling &&
      titleElement.nextElementSibling.classList.contains(
        "oj-title-copier-wrapper"
      )
    ) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "oj-title-copier-wrapper";

    Object.assign(wrapper.style, {
      display: "inline-block",
      verticalAlign: "middle",
    });

    const copybutton = document.createElement("button");
    copybutton.textContent = "复制标题";
    copybutton.className = "oj-title-copier-btn";

    Object.assign(copybutton.style, {
      marginLeft: "15px",
      padding: "4px 10px",
      cursor: "pointer",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#f0f0f0",
      color: "#333",
      fontSize: "14px",
      fontWeight: "normal",
    });

    copybutton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const Raw = titleElement.textContent.trim();
      const Clean = config.process ? config.process(Raw) : Raw;
      const Formatted = `${config.prefix}_${Clean.replace(/\s+/g, "_")}`;
      GM_setClipboard(Formatted);

      const originalText = copybutton.textContent;
      copybutton.textContent = "已复制!";
      copybutton.style.backgroundColor = "#d4edda";
      copybutton.style.borderColor = "#c3e6cb";
      setTimeout(() => {
        copybutton.textContent = originalText;
        copybutton.style.backgroundColor = "#f0f0f0";
        copybutton.style.borderColor = "#ccc";
      }, 2000);
    });

    wrapper.appendChild(copybutton);

    titleElement.insertAdjacentElement("afterend", wrapper);
  }

  // --- Script Entry ---
  // Get the configuration of the current site
  const Current = siteConfigs[window.location.hostname];
  if (Current) {
    // Since modern website content may load dynamically, we use setInterval to poll for the title element
    const Find = setInterval(() => {
      const title = document.querySelector(Current.selector);

      if (title) {
        // After finding the element, clear the timer and perform the operation
        clearInterval(Find);
        create(title, Current);
      }
    }, 500); // Check every 500 ms

    // Set a timeout to prevent the element from being permanently unfindable due to changes in the page structure.
    setTimeout(() => {
      clearInterval(Find);
    }, 15000); // Stop trying after 15 seconds
  }
})();
