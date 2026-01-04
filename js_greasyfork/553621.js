// ==UserScript==
// @name         SCNU Helper
// @namespace    scnu_helper
// @version      0.4.0
// @author       Ravi
// @description  华师砺儒云课堂与教务系统增强脚本
// @license      AGPL-3.0-only
// @match        https://moodle.scnu.edu.cn/*
// @match        https://jwxt.scnu.edu.cn/*
// @connect      api.siliconflow.cn
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553621/SCNU%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/553621/SCNU%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  function video_zoom() {
    console.log("[Interceptor] 视频页面，准备拦截 tcplayer-video.js 脚本");
    let tcplayerProcessed = false;
    let tcplayerReady = false;
    const pendingMainScripts = [];
    const maxWaitMs = 7e3;
    function isMainScriptTag(tag) {
      try {
        if (!(tag instanceof HTMLScriptElement)) return false;
        const src = tag.getAttribute("src") || "";
        if (!src) return false;
        return /(^|\/)main(\.|$|-)/.test(src);
      } catch (_) {
        return false;
      }
    }
    function flushPendingMain(reason = "tcplayer 就绪") {
      if (!pendingMainScripts.length) return;
      console.log(`[Interceptor] 释放被拦截的 main.js（${pendingMainScripts.length} 个），原因：${reason}`);
      const target = document.head || document.documentElement || document.body;
      while (pendingMainScripts.length) {
        const node = pendingMainScripts.shift();
        try {
          target.appendChild(node);
        } catch (e) {
          console.warn("[Interceptor] 重新注入 main.js 失败：", e);
        }
      }
    }
    function interceptMainScriptsOnce() {
      const candidates = Array.from(document.querySelectorAll("script[src]")).filter(isMainScriptTag);
      for (const s of candidates) {
        if (tcplayerReady) {
          continue;
        }
        try {
          console.log("[Interceptor] 拦截到依赖 tcplayer 的 main.js：", s.src);
          s.remove();
          pendingMainScripts.push(s);
        } catch (e) {
          console.warn("[Interceptor] 移除 main.js 失败：", e);
        }
      }
    }
    function processTcplayerIfPresent() {
      const playerScriptTag = document.querySelector('script[src*="tcplayer-video.js"]');
      if (playerScriptTag && !tcplayerProcessed) {
        const originalSrc = playerScriptTag.src;
        console.log("[Interceptor] 拦截到 tcplayer-video.js:", originalSrc);
        playerScriptTag.remove();
        tcplayerProcessed = true;
        _GM_xmlhttpRequest({
          method: "GET",
          url: originalSrc,
          onload: function(response) {
            if (response.status === 200) {
              let modifiedCode = response.responseText;
              modifiedCode = modifiedCode.replace(
                "var time = Math.round(this.viewTotalTime / 1000)",
                "this.viewTotalTime = 99999;\nvar time = Math.round(this.viewTotalTime / 1000)"
              );
              console.log("[Interceptor] 已修改 tcplayer-video.js 内容，准备注入");
              const newScript = document.createElement("script");
              newScript.textContent = modifiedCode;
              newScript.type = "text/javascript";
              (document.head || document.documentElement).appendChild(newScript);
              console.log("[Interceptor] 修改后的 tcplayer-video.js 已注入");
              tcplayerReady = true;
              flushPendingMain("tcplayer 注入完成");
            } else {
              console.error("[Interceptor] 请求 tcplayer-video.js 失败:", response.status);
              flushPendingMain("请求 tcplayer 失败");
            }
          },
          onerror: function(error) {
            console.error("[Interceptor] 请求 tcplayer-video.js 出错:", error);
            flushPendingMain("请求 tcplayer 出错");
          }
        });
      }
    }
    const observer = new MutationObserver(() => {
      interceptMainScriptsOnce();
      processTcplayerIfPresent();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    interceptMainScriptsOnce();
    processTcplayerIfPresent();
    setTimeout(() => {
      if (!tcplayerReady && pendingMainScripts.length) {
        console.warn("[Interceptor] 等待 tcplayer 超时，释放 main.js 以避免页面卡死");
        flushPendingMain("等待超时");
      }
    }, maxWaitMs);
  }
  function ai_answer() {
    console.log("[AI Answer] 作答页面，准备运行 AI 作答脚本");
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error("[AI Answer] 未提供 API Key，已取消");
      return;
    }
    const questions = extractQuestionsWithOptions();
    if (!questions.length) {
      console.error("[AI Answer] 未能从页面提取题目与选项");
      return;
    }
    console.log(`[AI Answer] 共提取到 ${questions.length} 道题`);
    let chain = Promise.resolve();
    questions.forEach((q, idx) => {
      chain = chain.then(() => {
        console.log(`
[AI Answer] 第 ${idx + 1} 题：
${q}`);
        return callSiliconFlowOnce(apiKey, q).then((answer) => {
          const letter = (answer || "").trim().toUpperCase().replace(/[^A-Z]/g, "").charAt(0);
          let div = document.createElement("div");
          if (!letter) {
            console.warn(`[AI Answer] 第 ${idx + 1} 题：未解析到有效选项字母，原始返回：`, answer);
            div.innerText = String(answer ?? "");
          } else {
            console.log(`[AI Answer] 第 ${idx + 1} 题模型答案：${letter}`);
            div.innerText = letter;
          }
          document.querySelectorAll('[class^="info"]')[idx]?.appendChild(div);
        }).catch((err) => {
          console.error(`[AI Answer] 第 ${idx + 1} 题请求失败：`, err);
        });
      });
    });
  }
  function getApiKey() {
    try {
      const keyInStore = localStorage.getItem("sf_api_key");
      if (keyInStore && keyInStore.trim()) return keyInStore.trim();
    } catch (_) {
    }
    const input = window.prompt("请输入 SiliconFlow API Key（仅提示一次，将保存在本地浏览器）：");
    const key = (input || "").trim();
    if (key) {
      try {
        localStorage.setItem("sf_api_key", key);
      } catch (_) {
      }
      return key;
    }
    return "";
  }
  function extractQuestionsWithOptions() {
    const nodes = Array.from(document.querySelectorAll('[class^="formulation clearfix"]'));
    const results = [];
    for (const el of nodes) {
      results.push(el.innerText);
    }
    return results;
  }
  function callSiliconFlowOnce(apiKey, question) {
    const url = "https://api.siliconflow.cn/v1/chat/completions";
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };
    const data = {
      model: "THUDM/GLM-4-9B-0414",
      messages: [
        {
          role: "system",
          content: "能力与角色:你是一位答题助手。\n背景信息:你会得到一个题目和多个选项。\n指令:你要仔细思考问题，并从下面的几个选项中选择你认为正确的那个。\n输出风格:你无需给出推理过程以及任何解释。你只需要回答正确选项对应的字母，不得回答任何多余的文字，不得添加任何的标点符号。\n输出范围:我希望你仅仅回答一个字母。"
        },
        { role: "user", content: question }
      ],
      enable_thinking: false,
      temperature: 0.2
    };
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "POST",
        url,
        headers,
        data: JSON.stringify(data),
        timeout: 2e4,
        onload: (resp) => {
          try {
            if (resp.status >= 200 && resp.status < 300) {
              const json = JSON.parse(resp.responseText || "{}");
              const content = json?.choices?.[0]?.message?.content;
              if (typeof content === "string" && content.trim()) {
                resolve(content);
              } else {
                reject(new Error("响应不包含有效内容"));
              }
            } else {
              reject(new Error(`HTTP ${resp.status}`));
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: (err) => reject(err)
      });
    });
  }
  function remove_timeinterval() {
    console.log("[Interceptor] 教务系统页面，准备移除倒计时限制");
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === "SCRIPT" && !node.src) {
            node.textContent = node.textContent.replace(
              "var count 	= (''==null||''=='')?((''==null||''=='')?5:''):'';",
              "var count = 0;"
            );
            console.log("[Interceptor] 修改后的代码已注入");
          }
        });
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  const domain = window.location.hostname;
  const path = window.location.pathname;
  if (domain === "moodle.scnu.edu.cn") {
    if (path.includes("fsresource")) {
      video_zoom();
    } else if (path.includes("quiz/attempt.php")) {
      ai_answer();
    }
  } else if (domain === "jwxt.scnu.edu.cn") {
    if (path.includes("index_initMenu")) {
      remove_timeinterval();
    }
  }

})();