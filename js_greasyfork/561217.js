// ==UserScript==
// @name         华医网全自动助手
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  自动播放、自动答题、自动下一节
// @author       男儿当自强
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/course_ware/course_list.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561217/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561217/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ================= ⚙️ 配置区域 =================
  const CONFIG = {    
   

    // --- 防风控设置 ---
    answerBaseDelay: 2500, // 答题等待
    answerRandomDelay: 1500, // 随机波动

    // 倒计时
    submitCountdown: 15,

    // 默认模式: video_exam, exam_only, video_only
    defaultMode: "video_exam",
  };

  // 全局变量
  let IS_SCRIPT_RUNNING = true;
  let IS_JUMPING = false;
  let USER_PAUSED_VIDEO = false;

  // 存储键名 (V10 确保最新数据)
  const STORE_KEY_ANSWERS = "huayi_memory_fix_jump_v10";
  const STORE_KEY_LAST_VIDEO_URL = "huayi_last_video_url";

  // ================= 🎨 UI 界面 =================
  const UI = {
    panelId: "huayi-ios-card",
    init: function () {
      if (document.getElementById(this.panelId)) return;
      const panel = document.createElement("div");
      panel.id = this.panelId;

      panel.innerHTML = `
      <!-- 正常视图容器 -->
      <div class="h-normal-view">
          <!-- 头部：标题 + 最小化 -->
          <div class="h-header-row">
              <div class="h-brand">
                  <span class="h-icon">💧</span>
                  <span class="h-title-text">华医助手</span>
              </div>
              <!-- 最小化按钮 (右上角) -->
              <div class="h-minimize-btn" title="最小化面板">
                  <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
                      <rect width="12" height="2" rx="1" fill="currentColor"/>
                  </svg>
              </div>
          </div>

          <!-- 主体内容 -->
          <div class="h-body">
              <!-- 运行开关 -->
              <div class="h-control-center">
                  <button id="h-toggle-run" class="h-pill-btn active">
                      <span class="h-dot"></span>
                      <span class="h-btn-text">运行中</span>
                  </button>
              </div>

              <!-- 模式选择 (稳固版下拉框) -->
              <div class="h-section">
                  <label class="h-label">当前模式</label>

                  <!-- 隐藏原生select -->
                  <select id="h-mode-select" style="display:none">
                      <option value="video_exam">📺 视频 + 📝 考试</option>
                      <option value="exam_only">📝 纯答题模式</option>
                      <option value="video_only">📺 纯视频模式</option>
                  </select>

                  <!-- 自定义下拉框 -->
                  <div class="h-custom-select" id="h-custom-dropdown">
                      <div class="h-select-trigger" title="点击切换模式">
                          <span id="h-selected-text">📺 视频 + 📝 考试</span>
                          <!-- 下箭头 SVG -->
                          <svg class="h-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
                              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                      </div>
                      <!-- 选项列表 -->
                      <div class="h-options-list">
                          <div class="h-option selected" data-value="video_exam">📺 视频 + 📝 考试</div>
                          <div class="h-option" data-value="exam_only">📝 纯答题模式</div>
                          <div class="h-option" data-value="video_only">📺 纯视频模式</div>
                      </div>
                  </div>
              </div>

              <!-- 状态卡片 -->
              <div class="h-status-card">
                  <div class="h-status-row">
                      <span class="h-label-sm">状态</span>
                      <span id="h-status" class="h-dynamic-text">就绪</span>
                  </div>
                  <div id="h-timer" class="h-timer-box" style="display:none;"></div>
              </div>

              <!-- 底部 -->
              <div class="h-footer">
                  ${
                    CONFIG.your_qr_image
                      ? `<div class="h-qr-box"><img src="${CONFIG.your_qr_image}" /></div>`
                      : ""
                  }
                  <div class="h-contact">${CONFIG.contactText}</div>
              </div>
          </div>
      </div>

      <!-- 最小化后的悬浮球 -->
      <div class="h-minimized-view" title="点击恢复面板">
          <span class="h-min-icon">💧</span>
      </div>
    `;

      this.addStyles();
      document.body.appendChild(panel);
      this.bindEvents();
      this.loadSettings();
      this.initCustomSelect();
    },

    addStyles: function () {
      const css = `
      /* --- 主面板 --- */
      #${this.panelId} {
          position: fixed; right: 20px; bottom: 30px; width: 260px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 24px;
          box-shadow: 0 20px 60px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.02);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 999999;
          color: #333;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          user-select: none;
      }
      #${this.panelId}:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 70px -12px rgba(0,0,0,0.2);
      }

      /* --- 最小化状态 --- */
      #${this.panelId}.h-minimized-state {
          width: 48px; height: 48px; border-radius: 24px;
          background: #fff; cursor: pointer; padding: 0;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
      }
      #${this.panelId}.h-minimized-state:hover { transform: scale(1.1); }

      .h-normal-view { opacity: 1; transition: opacity 0.2s; }
      .h-minimized-view {
          display: none; width: 100%; height: 100%;
          align-items: center; justify-content: center;
          font-size: 24px; animation: popIn 0.3s;
      }

      #${this.panelId}.h-minimized-state .h-normal-view { display: none; opacity: 0; }
      #${this.panelId}.h-minimized-state .h-minimized-view { display: flex; }

      @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }

      /* --- 头部 --- */
      .h-header-row { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px 10px; }
      .h-brand { display: flex; align-items: center; gap: 8px; }
      .h-icon { font-size: 20px; filter: drop-shadow(0 2px 4px rgba(0,122,255,0.2)); }
      .h-title-text { font-weight: 800; font-size: 16px; color: #1c1c1e; }

      /* 最小化按钮 */
      .h-minimize-btn {
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(0,0,0,0.05); color: #86868b;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
      }
      .h-minimize-btn:hover { background: rgba(0,0,0,0.1); color: #333; }

      /* --- 内容区域 --- */
      .h-body { padding: 0 20px 20px; }
      .h-control-center { padding-bottom: 15px; }

      /* 药丸开关 */
      .h-pill-btn {
          width: 100%; border: none; padding: 10px; border-radius: 16px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #f2f2f7; color: #8e8e93;
          transition: all 0.2s;
      }
      .h-pill-btn.active {
          background: #007aff; color: #fff;
          box-shadow: 0 8px 20px -6px rgba(0, 122, 255, 0.5);
      }
      .h-pill-btn .h-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.8; }
      .h-pill-btn:active { transform: scale(0.96); }

      /* --- 稳固版自定义下拉框 --- */
      .h-section { margin-bottom: 15px; position: relative; }
      .h-label { display: block; font-size: 12px; color: #86868b; margin-bottom: 8px; font-weight: 600; margin-left: 4px; }

      .h-custom-select { position: relative; width: 100%; }

      /* 触发器 */
      .h-select-trigger {
          background: #f5f5f7; border: 1px solid transparent;
          border-radius: 14px; padding: 12px 14px;
          font-size: 13px; font-weight: 500; color: #1c1c1e;
          display: flex; justify-content: space-between; align-items: center;
          cursor: pointer; transition: all 0.2s;
      }
      .h-select-trigger:hover { background: #eaeaec; }
      .h-custom-select.active .h-select-trigger {
          background: #fff; border-color: #007aff;
          box-shadow: 0 0 0 3px rgba(0,122,255,0.1);
      }
      .h-arrow { transition: transform 0.3s; color: #86868b; }
      .h-custom-select.active .h-arrow { transform: rotate(180deg); color: #007aff; }

      /* 下拉菜单 */
      .h-options-list {
          position: absolute;
          top: calc(100% + 6px); /* 紧贴触发器，减少空隙 */
          left: 0; right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 14px; padding: 6px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
          display: none; z-index: 9999999; /* 极高层级防止被遮挡 */
          animation: slideDown 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .h-custom-select.active .h-options-list { display: block; }

      @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

      /* 选项 */
      .h-option {
          padding: 10px 12px; border-radius: 10px;
          font-size: 13px; color: #333; cursor: pointer;
          transition: all 0.1s;
      }
      .h-option:hover { background: #f2f2f7; }
      .h-option.selected { background: #eef7ff; color: #007aff; font-weight: 600; }

      /* --- 状态卡片 --- */
      .h-status-card {
          background: #fbfbfd; border: 1px solid #e5e5ea;
          border-radius: 16px; padding: 12px 14px;
          margin-bottom: 15px;
      }
      .h-status-row { display: flex; justify-content: space-between; align-items: center; }
      .h-label-sm { font-size: 12px; color: #86868b; }
      .h-dynamic-text { font-size: 13px; font-weight: 600; color: #007aff; }
      .h-timer-box {
          margin-top: 6px; padding-top: 6px; border-top: 1px dashed #e5e5ea;
          text-align: right; color: #ff3b30; font-weight: 700; font-size: 12px;
      }

      /* --- 底部 --- */
      .h-footer { text-align: center; }
      .h-qr-box img { width: 120px; border-radius: 12px; margin-bottom: 8px; border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
      .h-contact { font-size: 11px; color: #c7c7cc; }
    `;
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
    },

    // 初始化自定义下拉框逻辑 
    initCustomSelect: function () {
      const wrapper = document.getElementById("h-custom-dropdown");
      const trigger = wrapper.querySelector(".h-select-trigger");
      const options = wrapper.querySelectorAll(".h-option");
      const realSelect = document.getElementById("h-mode-select");
      const displaySpan = document.getElementById("h-selected-text");

      // 1. 点击触发器开关
      trigger.onmousedown = (e) => {
        e.stopPropagation();
        wrapper.classList.toggle("active");
      };

      // 下拉框内部任何点击都不冒泡到 document
      wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      // 2. 点击选项
      options.forEach((opt) => {
        opt.onclick = (e) => {
          e.stopPropagation();
          options.forEach((o) => o.classList.remove("selected"));
          opt.classList.add("selected");
          displaySpan.innerText = opt.innerText;
          wrapper.classList.remove("active");

          realSelect.value = opt.getAttribute("data-value");
          realSelect.dispatchEvent(new Event("change"));
        };
      });

      // 3. 点击页面其他空白处关闭
      document.addEventListener("mousedown", (e) => {
        if (!wrapper.classList.contains("active")) return;
        if (wrapper.contains(e.target)) return;
        wrapper.classList.remove("active");
      });

      // 4. 初始化回显
      const currentVal = realSelect.value;
      const currentOpt = Array.from(options).find(
        (o) => o.getAttribute("data-value") === currentVal
      );
      if (currentOpt) {
        currentOpt.classList.add("selected");
        displaySpan.innerText = currentOpt.innerText;
      }
    },

    bindEvents: function () {
      const toggleBtn = document.getElementById("h-toggle-run");
      const toggleFunc = (forceState) => {
        if (typeof forceState === "boolean") IS_SCRIPT_RUNNING = forceState;
        else IS_SCRIPT_RUNNING = !IS_SCRIPT_RUNNING;

        const video = document.querySelector("video");

        if (IS_SCRIPT_RUNNING) {
          toggleBtn.classList.add("active");
          toggleBtn.querySelector(".h-btn-text").innerText = "运行中";
          this.log("正在执行任务...");
          if (video && video.paused && !USER_PAUSED_VIDEO)
            video.play().catch(() => {});
        } else {
          toggleBtn.classList.remove("active");
          toggleBtn.querySelector(".h-btn-text").innerText = "已暂停";
          this.log("脚本已暂停");
          if (video && !video.paused) video.pause();
        }
      };
      toggleBtn.onclick = () => toggleFunc();
      window.toggleScriptState = toggleFunc;

      // 最小化与恢复
      const panel = document.getElementById(this.panelId);
      const minBtn = document.querySelector(".h-minimize-btn");
      const restoreBtn = document.querySelector(".h-minimized-view");

      const toggleMin = (e) => {
        if (e) e.stopPropagation();
        panel.classList.toggle("h-minimized-state");
      };

      minBtn.onclick = toggleMin;
      restoreBtn.onclick = toggleMin;

      // 监听原生 Select 变化
      document.getElementById("h-mode-select").onchange = (e) => {
        localStorage.setItem("huayi_script_mode_local", e.target.value);
        this.log(
          `模式切换: ${
            e.target.options[e.target.selectedIndex].text.split(" ")[1]
          }`
        );
      };
    },

    loadSettings: function () {
      const mode =
        localStorage.getItem("huayi_script_mode_local") || CONFIG.defaultMode;
      document.getElementById("h-mode-select").value = mode;
    },

    log: function (msg) {
      const el = document.getElementById("h-status");
      if (el) el.innerText = msg;
    },

    startCountdown: function (seconds, prefix, callback) {
      const el = document.getElementById("h-timer");
      el.style.display = "block";
      let remain = seconds;
      el.innerText = `${prefix} ${remain} s`;
      if (this.currentTimer) clearInterval(this.currentTimer);
      this.currentTimer = setInterval(() => {
        if (!IS_SCRIPT_RUNNING) return;
        remain--;
        if (remain <= 0) {
          clearInterval(this.currentTimer);
          this.currentTimer = null;
          el.style.display = "none";
          if (callback) callback();
        } else {
          el.innerText = `${prefix} ${remain} s`;
        }
      }, 1000);
    },
  };

  // ================= 🛠️ 核心工具 =================
  const Utils = {
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    randomSleep: async () => {
      const time =
        CONFIG.answerBaseDelay + Math.random() * CONFIG.answerRandomDelay;
      await Utils.sleep(time);
    },
    clean: (text) => {
      if (!text) return "";
      let temp = text.trim();
      temp = temp.replace(/^[（(]?[0-9]+[)）]?[、.,：:\s]+/, "");
      temp = temp.replace(/^[（(]?[A-Z]+[)）]?[、.,：:\s]+/, "");
      return temp.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "");
    },
    getMemory: () => GM_getValue(STORE_KEY_ANSWERS, {}),
    setMemory: (data) => GM_setValue(STORE_KEY_ANSWERS, data),
    saveTriedOption(question, optionText) {
      if (!question || !optionText) return;
      const mem = Utils.getMemory();
      const qKey = Utils.clean(question);
      const opt = Utils.clean(optionText);
      mem[qKey] = mem[qKey] || { tried: [] };
      if (!mem[qKey].tried.includes(opt)) {
        mem[qKey].tried.push(opt);
      }
      Utils.setMemory(mem);
    },
    saveCorrectOption(question, optionText) {
      if (!question || !optionText) return;
      const mem = Utils.getMemory();
      const qKey = Utils.clean(question);
      const opt = Utils.clean(optionText);
      mem[qKey] = mem[qKey] || { tried: [] };
      mem[qKey].correct = opt;
      mem[qKey].tried = mem[qKey].tried.filter((t) => t !== opt);
      Utils.setMemory(mem);
    },
    resetQuestion(question) {
      const mem = Utils.getMemory();
      const qKey = Utils.clean(question);
      if (mem[qKey]) {
        delete mem[qKey];
        Utils.setMemory(mem);
      }
    },
    safeClick: (element, desc) => {
      if (!element) return;
      UI.log(`正在点击: ${desc}`);
      element.click();
      const currentUrl = window.location.href;
      setTimeout(() => {
        if (window.location.href === currentUrl && IS_SCRIPT_RUNNING) {
          if (currentUrl.includes("exam_result")) {
            window.location.href = "/course_ware/course_list.aspx";
          }
        }
      }, 5000);
    },
    parseTime: (timeStr) => {
      if (!timeStr) return 0;
      const parts = timeStr.split(":").map(Number);
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      return 0;
    },
  };

  // ================= 🧠 业务逻辑 =================
  const Logic = {
    init: function () {
      UI.init();
      const url = window.location.href;
      if (url.includes("course_ware_polyv.aspx")) this.pageVideo();
      else if (url.includes("course_list.aspx")) this.pageList();
      else if (url.includes("exam.aspx")) this.pageExam();
      else if (url.includes("exam_result.aspx")) this.pageResult();
    },

    // --- 1. 列表页 ---
    pageList: async function () {
      if (!IS_SCRIPT_RUNNING) return;
      const mode =
        localStorage.getItem("huayi_script_mode_local") || CONFIG.defaultMode;
      UI.log(`扫描任务中 (模式: ${mode})...`);
      await Utils.sleep(2000);

      const buttons = Array.from(
        document.querySelectorAll("input.state_lis_btn")
      );
      if (buttons.length === 0) return;

      let videoBtn = null,
        examBtn = null,
        allDone = true;

      for (let btn of buttons) {
        const val = btn.value.trim();
        if (
          val.includes("已完成") ||
          val.includes("审核中") ||
          val.includes("查看")
        )
          continue;
        allDone = false;
        if (
          (val.includes("立即学习") ||
            val.includes("学习中") ||
            val.includes("未学习")) &&
          !videoBtn
        )
          videoBtn = btn;
        if (val.includes("待考试") && !examBtn) examBtn = btn;
      }

      if (mode === "video_exam") {
        if (examBtn) {
          UI.log("📝 [全自动] 发现待考试");
          UI.startCountdown(CONFIG.submitCountdown, "⏳ 进入考试", () =>
            examBtn.click()
          );
        } else if (videoBtn) {
          UI.log("📺 [全自动] 发现未学视频");
          UI.startCountdown(CONFIG.submitCountdown, "⏳ 进入视频", () =>
            videoBtn.click()
          );
        }
      } else if (mode === "exam_only") {
        if (examBtn) {
          UI.log("📝 [纯答题] 发现待考试");
          UI.startCountdown(CONFIG.submitCountdown, "⏳ 进入考试", () =>
            examBtn.click()
          );
        }
      } else {
        if (videoBtn) {
          UI.log("📺 [纯视频] 发现未学视频");
          UI.startCountdown(CONFIG.submitCountdown, "⏳ 进入视频", () =>
            videoBtn.click()
          );
        }
      }

      if (allDone) {
        UI.log("🎉 全部课程已完成！");
        IS_SCRIPT_RUNNING = false;
      }
    },

    // --- 2. 视频页 ---
    pageVideo: async function () {
      const mode =
        localStorage.getItem("huayi_script_mode_local") || CONFIG.defaultMode;
      UI.log("📺 视频页监控中...");
      localStorage.setItem(STORE_KEY_LAST_VIDEO_URL, window.location.href);

      // 如果已完成，直接跳转，不再执行后续逻辑
      setTimeout(() => {
        const currentLi = document
          .querySelector("i#top_play")
          ?.closest("li.lis-inside-content");
        if (currentLi) {
          const statusBtn = currentLi.querySelector("button");
          const statusText = statusBtn ? statusBtn.innerText.trim() : "";
          if (statusText.includes("已完成") || statusText.includes("审核中")) {
            UI.log("✅ 检测到本章已完成，准备跳转...");
            IS_JUMPING = true;
            this.checkSideMenuAndJump(true);
            return; // 终止后续逻辑
          }
        }
      }, 1500);

      setTimeout(() => {
        const video = document.querySelector("video");
        if (video) {
          video.addEventListener("pause", () => {
            USER_PAUSED_VIDEO = true;
          });
          video.addEventListener("play", () => {
            USER_PAUSED_VIDEO = false;
          });
        }
      }, 2000);

      setInterval(() => {
        if (!IS_SCRIPT_RUNNING || IS_JUMPING) return;

        // 关闭弹窗
        document
          .querySelectorAll(
            ".pv-ask-skip, .signBtn, .btn_sign, .study_box button, .layer_tips .colse_btn"
          )
          .forEach((el) => {
            el.click();
            UI.log("🔧 自动关闭弹窗");
          });

        const v = document.querySelector("video");
        if (v && v.paused && !USER_PAUSED_VIDEO) {
          v.muted = true;
          v.play().catch(() => {});
        }

        // 检测考试按钮
        const examBtn = document.getElementById("jrks");
        const isExamClickable =
          examBtn &&
          !examBtn.disabled &&
          examBtn.className.includes("inputstyle2") &&
          !examBtn.className.includes("inputstyle2_2");

        let isVideoEnded = false;
        if (v) {
          const current = document.querySelector(".pv-time-current")?.innerText;
          const duration =
            document.querySelector(".pv-time-duration")?.innerText;
          if (current && duration) {
            const c = Utils.parseTime(current);
            const d = Utils.parseTime(duration);
            if (d > 0 && c >= d - 2) isVideoEnded = true;
          }
          if (v.ended) isVideoEnded = true;
        }

        if (isExamClickable || isVideoEnded) {
          if (mode === "video_only") {
            UI.log("✅ 视频结束，跳转下一课...");
            IS_JUMPING = true;
            this.checkSideMenuAndJump(true);
          } else if (isExamClickable) {
            UI.log("📝 视频结束，进入考试...");
            IS_JUMPING = true;
            UI.startCountdown(CONFIG.submitCountdown, "⏳ 进入考试", () =>
              examBtn.click()
            );
          } else {
            UI.log("⏳ 视频完毕，等待按钮激活...");
          }
        }
      }, 2000);
    },

    // 更精准的跳转逻辑
    checkSideMenuAndJump: function (forceJump) {
      const items = Array.from(
        document.querySelectorAll("li.lis-inside-content")
      );
      const getStatus = (li) => {
        const btn = li.querySelector("button");
        return btn ? btn.innerText.trim() : "";
      };

      const todos = items.filter((li) => {
        if (li.querySelector("#top_play")) return false;
        const s = getStatus(li);
        return (
          s.includes("未学习") || s.includes("待考试") || s.includes("学习中")
        );
      });

      // 优先级：待考试 > 学习中 > 未学习
      let target =
        todos.find((li) => getStatus(li).includes("待考试")) ||
        todos.find((li) => getStatus(li).includes("学习中")) ||
        todos.find((li) => getStatus(li).includes("未学习"));

      if (target && forceJump) {
        UI.log(`👉 跳转下一节: ${target.innerText.split("\n")[0]}`);
        target.click();
        const h2 = target.querySelector("h2");
        if (h2) h2.click();
        setTimeout(() => {
          IS_JUMPING = false;
        }, 3000);
      } else if (forceJump) {
        UI.log("🔙 章节结束，返回列表页");
        window.location.href = "/course_ware/course_list.aspx";
      }
    },

    // --- 3. 考试页 ---
    pageExam: async function () {
      if (!IS_SCRIPT_RUNNING) return;
      UI.log("✍️ 智能答题中...");
      await Utils.sleep(2000);

      if (document.body.innerText.includes("验证码")) {
        alert("⚠️ 出现验证码，脚本已暂停！");
        IS_SCRIPT_RUNNING = false;
        return;
      }

      const tables = document.querySelectorAll(".test table.tablestyle");
      const memory = Utils.getMemory();

      for (let i = 0; i < tables.length; i++) {
        if (!IS_SCRIPT_RUNNING) return;
        const table = tables[i];
        const rawQText = table.querySelector(".q_name").innerText;
        const qKey = Utils.clean(rawQText);

        const labels = Array.from(table.querySelectorAll("label")).filter((l) =>
          l.querySelector('input[type="radio"]')
        );
        const record = memory[qKey];
        let chosen = false;

        if (record && record.correct) {
          for (let label of labels) {
            if (Utils.clean(label.innerText) === record.correct) {
              label.querySelector("input").click();
              chosen = true;
              UI.log(`第${i + 1}题: ✅ 命中答案`);
              break;
            }
          }
        }

        if (!chosen) {
          const triedList = record && record.tried ? record.tried : [];
          let matchCount = 0;
          labels.forEach((l) => {
            if (triedList.includes(Utils.clean(l.innerText))) matchCount++;
          });

          if (matchCount >= labels.length && labels.length > 0) {
            UI.log(`第${i + 1}题: ⚠️ 死锁重置...`);
            Utils.resetQuestion(rawQText);
            labels[Math.floor(Math.random() * labels.length)]
              .querySelector("input")
              .click();
            chosen = true;
          } else {
            for (let label of labels) {
              const optClean = Utils.clean(label.innerText);
              if (!triedList.includes(optClean)) {
                label.querySelector("input").click();
                chosen = true;
                UI.log(`第${i + 1}题: 🕵️ 排除尝试`);
                break;
              }
            }
          }
        }

        if (!chosen && labels.length > 0) {
          UI.log(`第${i + 1}题: ⚠️ 兜底选择`);
          labels[0].querySelector("input").click();
        }

        await Utils.randomSleep();
      }

      UI.log("🛑 答题完毕，准备交卷...");
      UI.startCountdown(CONFIG.submitCountdown, "⏳ 交卷倒计时", () => {
        document.getElementById("btn_submit")?.click();
      });
    },

    // --- 4. 结果页 ---
    pageResult: async function () {
      if (!IS_SCRIPT_RUNNING) return;
      UI.log("📊 成绩分析中...");
      await Utils.sleep(2000);

      const allItems = Array.from(
        document.querySelectorAll("li.state_cour_lis")
      );
      let hasError = false;

      if (allItems.length > 0) {
        allItems.forEach((li) => {
          const img = li.querySelector("img");
          if (!img) return;

          const qLine = li.querySelector(".state_lis_text").innerText;
          const qKey = Utils.clean(qLine);
          const match = li.innerText.match(/您的答案[：:]\s*([^】\n]+)/);

          if (match) {
            const myAns = Utils.clean(match[1]);
            if (img.src.includes("bar_img.png")) {
              Utils.saveCorrectOption(qKey, myAns);
            } else if (img.src.includes("error_icon.png")) {
              Utils.saveTriedOption(qKey, myAns);
              hasError = true;
            }
          }
        });
      }

      if (hasError) {
        UI.log(`❌ 未满分，更新错题本...`);
        await Utils.sleep(3000);
        const retryBtn =
          document.querySelector('input[value="重新考试"]') ||
          document.querySelector(".state_edu");
        if (retryBtn) retryBtn.click();
        else {
          UI.log("⚠️ 找不到重考按钮，回退尝试");
          window.history.back();
        }
      } else {
        UI.log("💯 全对通过！");
        await Utils.sleep(2000);
        const lastVideo = localStorage.getItem(STORE_KEY_LAST_VIDEO_URL);
        if (lastVideo) window.location.href = lastVideo;
        else window.location.href = "/course_ware/course_list.aspx";
      }
    },
  };

  Logic.init();
})();
