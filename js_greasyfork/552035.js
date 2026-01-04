// ==UserScript==
// @name         filecxx_activation_code
// @namespace    npm/vite-plugin-monkey
// @version      0.1.0
// @description  自用，用于拷贝指定时间的激活码到剪切板
// @icon         https://vitejs.dev/logo.svg
// @match        https://filecxx.com/en_US/activation_code.html
// @match        https://filecxx.com/zh_CN/activation_code.html
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.22/dist/vue.global.prod.js
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552035/filecxx_activation_code.user.js
// @updateURL https://update.greasyfork.org/scripts/552035/filecxx_activation_code.meta.js
// ==/UserScript==

(function (vue) {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  importCSS(" .container[data-v-1c5b843e]{display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px;background:linear-gradient(135deg,#667eea,#764ba2)}.card[data-v-1c5b843e]{background:#fff;border-radius:16px;padding:32px;box-shadow:0 20px 60px #0000004d;max-width:600px;width:100%}h2[data-v-1c5b843e]{margin:0 0 24px;color:#333;text-align:center;font-size:24px}.copy-button[data-v-1c5b843e]{width:100%;padding:14px 24px;font-size:16px;font-weight:600;color:#fff;background:linear-gradient(135deg,#667eea,#764ba2);border:none;border-radius:8px;cursor:pointer;transition:all .3s ease;box-shadow:0 4px 15px #667eea66}.copy-button[data-v-1c5b843e]:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 20px #667eea99}.copy-button[data-v-1c5b843e]:active:not(:disabled){transform:translateY(0)}.copy-button[data-v-1c5b843e]:disabled{opacity:.6;cursor:not-allowed}.message[data-v-1c5b843e]{margin-top:16px;padding:12px 16px;border-radius:8px;text-align:center;font-weight:500;background:#f0f9ff;color:#0369a1;border:1px solid #bae6fd}.result-section[data-v-1c5b843e]{margin-top:24px;padding-top:24px;border-top:2px solid #f1f5f9}.result-item[data-v-1c5b843e]{margin-bottom:16px;display:flex;flex-direction:column;gap:6px}.result-item[data-v-1c5b843e]:last-child{margin-bottom:0}.result-item label[data-v-1c5b843e]{font-weight:600;color:#64748b;font-size:14px;text-transform:uppercase;letter-spacing:.5px}.result-item span[data-v-1c5b843e]{color:#334155;font-size:16px}.activation-code[data-v-1c5b843e]{background:#f8fafc;border:2px solid #e2e8f0;border-radius:6px;padding:12px;font-family:Courier New,monospace;font-size:14px;word-break:break-all;color:#0f172a;display:block}@media (max-width: 640px){.card[data-v-1c5b843e]{padding:24px}h2[data-v-1c5b843e]{font-size:20px}} ");

  const styleCss = ":root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;display:flex;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}#app{max-width:1280px;margin:0 auto;padding:2rem;text-align:center}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}";
  importCSS(styleCss);
  const _hoisted_1 = { class: "container" };
  const _hoisted_2 = { class: "card" };
  const _hoisted_3 = ["disabled"];
  const _hoisted_4 = {
    key: 0,
    class: "message"
  };
  const _hoisted_5 = {
    key: 1,
    class: "result-section"
  };
  const _hoisted_6 = { class: "result-item" };
  const _hoisted_7 = { class: "result-item" };
  const _hoisted_8 = { class: "result-item" };
  const _hoisted_9 = { class: "activation-code" };
  const _sfc_main = vue.defineComponent({
    __name: "App",
    setup(__props) {
      function getCurrentActivationCode() {
        const now = new Date();
        const codesElement = document.getElementById("codes");
        if (!codesElement) {
          return {
            code: "错误：找不到 ID 为 'codes' 的元素。",
            timeRange: null,
            currentTime: now.toLocaleString()
          };
        }
        const rawText = codesElement.textContent?.trim() || "";
        const codeBlocks = rawText.split(/\n{2,}/g).filter((block) => block.trim().length > 0);
        let activeCode = "未找到有效的激活码。当前时间不匹配任何时间段。";
        let matchedRange = null;
        for (const block of codeBlocks) {
          const lines = block.trim().split("\n");
          if (lines.length >= 2) {
            const timeRangeStr = lines[0].trim();
            const code = lines[1].trim();
            const times = timeRangeStr.split(" - ");
            if (times.length === 2) {
              const startTime = new Date(times[0]);
              const endTime = new Date(times[1]);
              if (now >= startTime && now < endTime) {
                activeCode = code;
                matchedRange = timeRangeStr;
                return {
                  code: activeCode,
                  timeRange: matchedRange,
                  currentTime: now.toLocaleString()
                };
              }
            }
          }
        }
        return {
          code: activeCode,
          timeRange: matchedRange,
          currentTime: now.toLocaleString()
        };
      }
      function copyToClipboard(textToCopy) {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            console.log("成功复制到剪贴板:", textToCopy);
          }).catch((err) => {
            console.error("无法复制到剪贴板:", err);
          });
        } else {
          console.log("不安全的方法");
        }
      }
      const isLoading = vue.ref(false);
      const message = vue.ref("");
      const resultCode = vue.ref("");
      const resultTimeRange = vue.ref("");
      const resultCurrentTime = vue.ref("");
      const handleCopyCode = () => {
        isLoading.value = true;
        message.value = "";
        try {
          const result = getCurrentActivationCode();
          console.log("--- TS 查找结果 ---");
          console.log(`当前时间 (本地): ${result.currentTime}`);
          console.log(`匹配的时间段: ${result.timeRange || "N/A"}`);
          console.log(`${result.code}`);
          resultCode.value = result.code;
          resultTimeRange.value = result.timeRange || "无";
          resultCurrentTime.value = result.currentTime;
          copyToClipboard(result.code);
          if (result.timeRange) {
            message.value = "✅ 激活码已复制到剪贴板！";
          } else {
            message.value = "⚠️ 未找到有效激活码";
          }
        } catch (error) {
          console.error("执行失败:", error);
          message.value = "❌ 获取激活码失败：" + error.message;
        } finally {
          isLoading.value = false;
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            _cache[3] || (_cache[3] = vue.createElementVNode("h2", null, "🔑 激活码获取工具", -1)),
            vue.createElementVNode("button", {
              onClick: handleCopyCode,
              disabled: isLoading.value,
              class: "copy-button"
            }, vue.toDisplayString(isLoading.value ? "处理中..." : "获取并复制激活码"), 9, _hoisted_3),
            message.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, vue.toDisplayString(message.value), 1)) : vue.createCommentVNode("", true),
            resultCode.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [
              vue.createElementVNode("div", _hoisted_6, [
                _cache[0] || (_cache[0] = vue.createElementVNode("label", null, "当前时间：", -1)),
                vue.createElementVNode("span", null, vue.toDisplayString(resultCurrentTime.value), 1)
              ]),
              vue.createElementVNode("div", _hoisted_7, [
                _cache[1] || (_cache[1] = vue.createElementVNode("label", null, "匹配时间段：", -1)),
                vue.createElementVNode("span", null, vue.toDisplayString(resultTimeRange.value), 1)
              ]),
              vue.createElementVNode("div", _hoisted_8, [
                _cache[2] || (_cache[2] = vue.createElementVNode("label", null, "激活码：", -1)),
                vue.createElementVNode("code", _hoisted_9, vue.toDisplayString(resultCode.value), 1)
              ])
            ])) : vue.createCommentVNode("", true)
          ])
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const App = _export_sfc(_sfc_main, [["__scopeId", "data-v-1c5b843e"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);