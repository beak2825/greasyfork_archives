// ==UserScript==
// @name         雨课堂助手
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  自动学习视频、AI讨论助手、习题OCR识别
// @author       XJ 国家特级不保护废物
// @license      CC BY-NC-SA 4.0
// @match        *://*.yuketang.cn/*
// @match        *://www.yuketang.cn/*
// @match        https://www.yuketang.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      open.bigmodel.cn
// @connect      aip.baidubce.com
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562538/%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562538/%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/**
 * =====================================================
 * 雨课堂助手 (YuKeTang Helper)
 * =====================================================
 * 
 * Copyright (c) 2026 XJ 国家特级不保护废物
 * 
 * 本脚本采用 CC BY-NC-SA 4.0 许可协议
 * (知识共享 署名-非商业性使用-相同方式共享 4.0 国际许可协议)
 * 
 * 您可以自由地：
 *   - 共享 — 在任何媒介以任何形式复制、发行本作品
 *   - 演绎 — 修改、转换或以本作品为基础进行创作
 * 
 * 惟须遵守下列条件：
 *   - 署名 — 您必须给出适当的署名，提供指向本许可协议的链接，
 *           同时标明是否（对原始作品）作了修改
 *   - 非商业性使用 — 您不得将本作品用于商业目的
 *   - 相同方式共享 — 如果您再混合、转换或者基于本作品进行创作，
 *                   您必须基于与原先许可协议相同的许可协议分发您贡献的作品
 * 
 * 完整许可协议: https://creativecommons.org/licenses/by-nc-sa/4.0/
 * 
 * ⚠️  重要声明：
 *   1. 禁止商用 - 严禁将本脚本用于任何商业用途
 *   2. 教育用途 - 本脚本仅供个人学习和研究使用
 *   3. 免责声明 - 使用本脚本所产生的任何后果由使用者自行承担
 *   4. 无担保 - 本脚本按"原样"提供，不提供任何明示或暗示的担保
 * 
 * =====================================================
 */

(function () {
  "use strict";

  console.log("雨课堂助手已加载");

  // ==================== 配置常量 ====================
  // AI讨论助手配置
  const AI_CONFIG_KEY = "bigmodel_api_key";
  const AI_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
  const AI_INVITE_LINK =
    "https://www.bigmodel.cn/invite?icode=36ExrDF%2BjyBH7b9Yb3uiBEjPr3uHog9F4g5tjuOUqno%3D";

  // OCR配置
  const OCR_API_KEY = "baidu_api_key";
  const OCR_SECRET_KEY = "baidu_secret_key";

  // ==================== 全局变量 ====================
  // 页面类型：'course' 或 'video' 或 'discussion' 或 'exercise'
  let currentPageType = detectPageType();
  console.log("当前页面类型:", currentPageType);

  // 跟踪上次播放时间，用于判断播放/暂停状态
  let lastPlayTime = -1;

  // 跟踪视频完成状态，避免重复触发
  let videoCompletedTriggered = false;

  // 跟踪讨论完成状态，避免重复触发
  let discussionCompletedTriggered = false;

  // 跟踪习题完成状态，避免重复触发
  let exerciseCompletedTriggered = false;

  // 自动化状态
  let automationRunning = false;
  let automationInterval = null;
  let lastClickedTask = null; // 记录最后点击的任务，避免重复点击

  // OCR相关
  let latestScreenshot = null;
  let isOCRRunning = false;
  let ocrAutoCount = 0;

  // 监测URL变化
  monitorUrlChange();

  // 根据页面类型执行不同逻辑
  if (currentPageType === "course") {
    // 课程页面：创建主面板并收集数据
    createFloatingPanel();
    setTimeout(() => {
      console.log("开始点击标签并收集数据...");
      clickTabAndCollect();
    }, 2500);
  } else if (currentPageType === "video") {
    // 视频页面：创建视频信息面板
    setTimeout(() => {
      console.log("视频页面，创建视频信息面板...");
      createVideoInfoPanel();
    }, 500);
  } else if (currentPageType === "discussion") {
    // 讨论页面：创建AI助手面板
    setTimeout(() => {
      console.log("========== 讨论页面初始化 ==========");
      console.log("讨论页面，创建AI助手面板...");

      // 优先使用课程页面保存的索引
      let discussionIndex = localStorage.getItem("yuketang_current_discussion_index");
      console.log("📌 localStorage 中已有的讨论索引:", discussionIndex);

      // 只有在没有索引时才尝试提取
      if (!discussionIndex) {
        console.log("⚠️ 未找到已保存的索引，尝试提取...");

        // 方法1: 尝试从URL提取
        const urlParams = new URLSearchParams(window.location.search);
        const discussionId = urlParams.get("id") || urlParams.get("discussionId");
        console.log("🔍 从URL提取讨论ID:", discussionId);

        if (discussionId) {
          discussionIndex = discussionId;
          localStorage.setItem("yuketang_current_discussion_index", discussionIndex);
          console.log("✅ 从URL保存讨论索引:", discussionIndex);
        } else {
          // 方法2: 从课程数据通过标题匹配
          const courseData = localStorage.getItem("yuketang_helper_data");
          console.log("🔍 尝试从标题匹配推断讨论索引...");

          if (courseData) {
            try {
              const data = JSON.parse(courseData);
              if (data.discussion && data.discussion.length > 0) {
                console.log("📊 课程数据中有", data.discussion.length, "个讨论");

                // 尝试多个选择器匹配当前页面的讨论标题
                const titleSelectors = [
                  ".title-fl > span",
                  ".title-fl",
                  "h3",
                  "h2",
                  ".title",
                  ".discussion-title"
                ];

                let currentTitle = null;
                for (const selector of titleSelectors) {
                  const element = document.querySelector(selector);
                  if (element) {
                    currentTitle = element.textContent.trim();
                    console.log(`✅ 通过选择器 ${selector} 找到标题:`, currentTitle);
                    break;
                  }
                }

                if (currentTitle) {
                  console.log("🔍 尝试匹配标题:", currentTitle);
                  console.log("📋 可用的讨论标题:", data.discussion.map((d, i) => `${i + 1}: ${d.title}`));

                  const matchIndex = data.discussion.findIndex(
                    (d) => d.title === currentTitle
                  );
                  if (matchIndex !== -1) {
                    discussionIndex = String(matchIndex + 1);
                    localStorage.setItem("yuketang_current_discussion_index", discussionIndex);
                    console.log("✅ 通过标题匹配找到讨论索引:", discussionIndex);
                  } else {
                    console.error("❌ 未能通过标题匹配找到讨论");
                    console.error("当前标题:", currentTitle);
                    console.error("可用的讨论标题:", data.discussion.map(d => d.title));
                  }
                } else {
                  console.error("❌ 未找到讨论标题元素");
                }
              }
            } catch (e) {
              console.error("解析课程数据失败:", e);
            }
          } else {
            console.error("❌ 未找到课程数据(yuketang_helper_data)");
          }
        }
      } else {
        console.log("✅ 使用课程页面保存的索引:", discussionIndex);
      }

      console.log("📌 最终讨论索引:", discussionIndex);
      console.log("========== 讨论页面初始化完成 ==========");


      createAIAssistantPanel();

      // 检查是否首次使用AI助手
      const hasShownWelcome = GM_getValue("ai_welcome_shown", false);
      const apiKey = GM_getValue(AI_CONFIG_KEY, "");

      if (!hasShownWelcome || !apiKey) {
        // 显示欢迎模态框
        setTimeout(() => {
          showAIWelcomeModal();
          GM_setValue("ai_welcome_shown", true);
        }, 1500);
      }
    }, 500);
  } else if (currentPageType === "exercise") {
    // 习题页面：创建OCR助手面板
    setTimeout(() => {
      console.log("习题页面，创建OCR助手面板...");

      // 尝试从URL或页面中提取习题索引
      const urlParams = new URLSearchParams(window.location.search);
      const exerciseId = urlParams.get("id") || urlParams.get("exerciseId");
      console.log("从URL提取习题ID:", exerciseId);

      if (!exerciseId) {
        // 如果URL中没有ID，从localStorage课程数据推断
        const courseData = localStorage.getItem("yuketang_helper_data");
        console.log("尝试从课程数据推断习题索引...");

        if (courseData) {
          try {
            const data = JSON.parse(courseData);
            if (data.exercise && data.exercise.length > 0) {
              console.log("课程数据中有", data.exercise.length, "个习题");

              // 尝试多个选择器匹配当前页面的习题标题
              const titleSelectors = [
                ".question-title",
                ".exercise-title",
                "h3",
                "h2",
                ".title",
                ".problem-title"
              ];

              let currentTitle = null;
              for (const selector of titleSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                  currentTitle = element.textContent.trim();
                  console.log(`通过选择器 ${selector} 找到标题:`, currentTitle);
                  break;
                }
              }

              if (currentTitle) {
                const matchIndex = data.exercise.findIndex(
                  (e) => e.title && e.title.includes(currentTitle)
                );
                if (matchIndex !== -1) {
                  localStorage.setItem(
                    "yuketang_current_exercise_index",
                    String(matchIndex + 1)
                  );
                  console.log("✓ 通过标题匹配找到习题索引:", matchIndex + 1);
                } else {
                  console.warn("未能通过标题匹配找到习题");
                  console.log("可用的习题标题:", data.exercise.map(e => e.title));
                }
              } else {
                console.warn("未找到习题标题元素");
              }
            }
          } catch (e) {
            console.error("解析课程数据失败:", e);
          }
        } else {
          console.warn("未找到课程数据(yuketang_helper_data)");
        }
      } else {
        localStorage.setItem("yuketang_current_exercise_index", exerciseId);
        console.log("✓ 从URL保存习题索引:", exerciseId);
      }

      createOCRPanel();

      // 监测习题完成状态
      let completionStatusInterval = null;

      function updateExerciseCompletionStatus() {
        const statusDisplay = document.getElementById("ocr-completion-status");
        if (!statusDisplay) return;

        // 如果已经手动标记完成，停止检测
        if (exerciseCompletedTriggered) {
          if (completionStatusInterval) {
            clearInterval(completionStatusInterval);
            completionStatusInterval = null;
          }
          return;
        }

        // 通过 div.aside-body--progress 获取完成情况
        const progressElement = document.querySelector(
          "div.aside-body--progress"
        );

        if (progressElement) {
          const progressText = progressElement.textContent.trim(); // 格式: "x/n" 或 "已完成"

          // 检查是否显示"已完成"
          if (progressText.includes("已完成")) {
            statusDisplay.innerHTML =
              '<i class="fas fa-check-circle" style="color: #2ecc71;"></i><span>已完成</span>';

            // 检测到习题已完成，自动保存状态并关闭标签页
            if (!exerciseCompletedTriggered) {
              exerciseCompletedTriggered = true;
              console.log("检测到习题状态为'已完成'，准备保存状态并关闭当前标签页...");

              // 停止定时检测
              if (completionStatusInterval) {
                clearInterval(completionStatusInterval);
                completionStatusInterval = null;
              }

              const exerciseIndex = localStorage.getItem("yuketang_current_exercise_index");
              if (exerciseIndex) {
                const completionData = {
                  exerciseIndex: parseInt(exerciseIndex),
                  timestamp: Date.now(),
                  status: "已完成",
                };
                localStorage.setItem(
                  "yuketang_exercise_completed",
                  JSON.stringify(completionData)
                );
                console.log("已保存习题完成状态:", completionData);
              }

              showToast('<i class="fas fa-edit"></i> 习题已完成！');

              // 延迟2秒后关闭
              setTimeout(() => {
                console.log("习题已完成，正在关闭当前标签页并返回课程页面...");

                // 尝试关闭当前标签页
                window.close();

                // 如果无法关闭（浏览器限制），则尝试返回上一页
                setTimeout(() => {
                  if (window.history.length > 1) {
                    console.log("无法自动关闭标签页，尝试返回上一页...");
                    window.history.back();
                  } else {
                    console.log("无法自动关闭标签页，请手动关闭");
                    showToast(
                      '<i class="fas fa-edit"></i> 习题已完成！请手动关闭此标签页'
                    );
                  }
                }, 1000);
              }, 2000);
            }
            return;
          }

          // 解析进度格式 "x/n"
          const match = progressText.match(/(\d+)\/(\d+)/);

          if (match) {
            const completed = parseInt(match[1]);
            const total = parseInt(match[2]);
            const isCompleted = completed === total;

            if (isCompleted) {
              statusDisplay.innerHTML =
                '<i class="fas fa-check-circle" style="color: #2ecc71;"></i><span>已完成 (' +
                progressText +
                ")</span>";

              // 检测到习题已全部完成，自动保存状态并关闭标签页
              if (!exerciseCompletedTriggered) {
                exerciseCompletedTriggered = true;
                console.log("习题已全部完成，准备保存状态并关闭当前标签页...");

                // 停止定时检测
                if (completionStatusInterval) {
                  clearInterval(completionStatusInterval);
                  completionStatusInterval = null;
                }

                const exerciseIndex = localStorage.getItem("yuketang_current_exercise_index");
                if (exerciseIndex) {
                  const completionData = {
                    exerciseIndex: parseInt(exerciseIndex),
                    timestamp: Date.now(),
                    status: "已完成",
                  };
                  localStorage.setItem(
                    "yuketang_exercise_completed",
                    JSON.stringify(completionData)
                  );
                  console.log("已保存习题完成状态:", completionData);
                }

                showToast('<i class="fas fa-edit"></i> 习题已完成！');

                // 延迟2秒后关闭
                setTimeout(() => {
                  console.log("习题已完成，正在关闭当前标签页并返回课程页面...");

                  // 尝试关闭当前标签页
                  window.close();

                  // 如果无法关闭（浏览器限制），则尝试返回上一页
                  setTimeout(() => {
                    if (window.history.length > 1) {
                      console.log("无法自动关闭标签页，尝试返回上一页...");
                      window.history.back();
                    } else {
                      console.log("无法自动关闭标签页，请手动关闭");
                      showToast('<i class="fas fa-edit"></i> 习题已完成！请手动关闭此标签页');
                    }
                  }, 1000);
                }, 2000);
              }
            } else {
              statusDisplay.innerHTML =
                '<i class="fas fa-hourglass-half" style="color: #f39c12;"></i><span>进行中 (' +
                progressText +
                ")</span>";
            }

            console.log(
              `习题完成情况: ${progressText} (${completed}/${total})`
            );
          } else {
            statusDisplay.innerHTML =
              '<i class="fas fa-hourglass-start" style="color: #95a5a6;"></i><span>未完成</span>';
          }
        } else {
          statusDisplay.innerHTML =
            '<i class="fas fa-hourglass-start" style="color: #95a5a6;"></i><span>未完成</span>';
        }
      }

      // 初始检测并定期更新
      setTimeout(updateExerciseCompletionStatus, 1000);
      completionStatusInterval = setInterval(updateExerciseCompletionStatus, 3000);

      // 自动触发识别全部
      setTimeout(() => {
        const autoBtn = document.getElementById("ocr-auto-btn");
        if (autoBtn && !isOCRRunning) {
          console.log("自动触发识别全部题目...");
          autoBtn.click();
        }
      }, 2000);
    }, 500);
  }

  // 不使用定时刷新，避免面板重置，用户可手动点击刷新按钮

  // 检测页面类型
  function detectPageType() {
    const url = window.location.href;
    console.log("检测URL:", url);
    if (url.includes("/v2/web/studentLog/")) {
      return "course";
    } else if (url.includes("/v2/web/xcloud/video-student/")) {
      return "video";
    } else if (url.includes("/v2/web/lms/")) {
      return "discussion"; // 讨论页面
    } else if (url.includes("/v2/web/cloud/student/exercise/")) {
      return "exercise"; // 习题页面
    }
    return "unknown";
  }

  // 监测URL变化
  function monitorUrlChange() {
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        console.log("URL已变化:", lastUrl, "->", currentUrl);
        lastUrl = currentUrl;

        const newPageType = detectPageType();
        if (newPageType !== currentPageType) {
          console.log("页面类型已变化:", currentPageType, "->", newPageType);
          currentPageType = newPageType;

          // 移除旧面板
          const oldCoursePanel = document.getElementById(
            "yuketang-helper-panel"
          );
          const oldVideoPanel = document.getElementById(
            "yuketang-video-info-panel"
          );
          if (oldCoursePanel) oldCoursePanel.remove();
          if (oldVideoPanel) oldVideoPanel.remove();

          // 根据新页面类型创建对应面板
          if (currentPageType === "course") {
            setTimeout(() => {
              console.log("切换到课程页面，创建主面板...");
              createFloatingPanel();
              // 只检查完成状态更新，不自动刷新数据
              setTimeout(() => {
                checkRecentCompletions();
                // 如果需要刷新数据，用户可以手动点击刷新按钮
              }, 500);
            }, 500);
          } else if (currentPageType === "video") {
            setTimeout(() => {
              console.log("切换到视频页面，创建视频信息面板...");
              createVideoInfoPanel();
            }, 500);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // 主动检查最近的完成事件（解决 history.back() 返回时的问题）
  function checkRecentCompletions() {
    console.log("主动检查最近的完成事件...");

    // 检查视频完成
    const videoDataStr = localStorage.getItem("yuketang_video_completed");
    if (videoDataStr) {
      try {
        const videoData = JSON.parse(videoDataStr);
        if (Date.now() - videoData.timestamp < 10000) {
          console.log("检测到最近的视频完成:", videoData);
          handleVideoCompletion(videoData);
        }
      } catch (e) {
        console.error("解析视频完成数据失败:", e);
      }
    }

    // 检查讨论完成
    const discussionDataStr = localStorage.getItem("yuketang_discussion_completed");
    if (discussionDataStr) {
      try {
        const discussionData = JSON.parse(discussionDataStr);
        if (Date.now() - discussionData.timestamp < 10000) {
          console.log("检测到最近的讨论完成:", discussionData);
          handleDiscussionCompletion(discussionData);
        }
      } catch (e) {
        console.error("解析讨论完成数据失败:", e);
      }
    }

    // 检查习题完成
    const exerciseDataStr = localStorage.getItem("yuketang_exercise_completed");
    if (exerciseDataStr) {
      try {
        const exerciseData = JSON.parse(exerciseDataStr);
        if (Date.now() - exerciseData.timestamp < 10000) {
          console.log("检测到最近的习题完成:", exerciseData);
          handleExerciseCompletion(exerciseData);
        }
      } catch (e) {
        console.error("解析习题完成数据失败:", e);
      }
    }
  }

  // 点击标签并收集数据
  function clickTabAndCollect() {
    // 主动检查是否有最近的完成事件（解决 history.back() 返回时的问题）
    checkRecentCompletions();

    const tab = document.querySelector("div#tab-student_school_report");

    if (tab) {
      console.log("找到标签，准备点击:", tab);
      tab.click();

      // 点击后等待内容加载，使用轮询机制检测数据是否加载完成
      let attempts = 0;
      const maxAttempts = 20; // 最多尝试20次（10秒）
      const checkInterval = 500;

      const waitForData = () => {
        attempts++;
        const videoContainer = document.querySelector(
          ".list-detail:nth-child(2)"
        );
        const exerciseContainer = document.querySelector(
          ".list-detail:nth-child(4)"
        );
        const discussionContainer = document.querySelector(
          ".list-detail:nth-child(6)"
        );

        // 检查是否至少有一个容器已加载
        const hasData =
          videoContainer || exerciseContainer || discussionContainer;

        if (hasData) {
          console.log("检测到数据容器，开始收集数据");
          // 再等待500ms确保内容完全渲染
          setTimeout(() => collectData(), 500);
        } else if (attempts < maxAttempts) {
          console.log(`等待数据加载... (${attempts}/${maxAttempts})`);
          setTimeout(waitForData, checkInterval);
        } else {
          console.warn("等待超时，强制收集数据");
          collectData();
        }
      };

      setTimeout(waitForData, 500);
    } else {
      console.log("未找到标签 div#tab-student_school_report，1秒后重试...");
      setTimeout(clickTabAndCollect, 1000);
    }
  }

  // 收集数据
  let lastDataHash = "";
  function collectData() {
    console.log("尝试查找元素...");

    // 收集视频数据
    const videoData = [];
    let videoIndex = 1;
    const videoContainer = document.querySelector(".list-detail:nth-child(2)");
    console.log("视频容器元素:", videoContainer);

    if (videoContainer) {
      while (true) {
        const titleElement = document.querySelector(
          `.list-detail:nth-child(2) .study-unit:nth-child(${videoIndex}) .name-text`
        );
        const statusElement = document.querySelector(
          `.list-detail:nth-child(2) .study-unit:nth-child(${videoIndex}) .font14`
        );

        if (!titleElement) {
          console.log(`未找到第 ${videoIndex} 个视频元素，停止收集`);
          break;
        }

        videoData.push({
          title: titleElement.textContent.trim(),
          status: statusElement ? statusElement.textContent.trim() : "未知",
        });

        videoIndex++;
      }
    }
    console.log("收集到的视频数据:", videoData);

    // 收集讨论数据
    const discussionData = [];
    let discussionIndex = 1;
    const discussionContainer = document.querySelector(
      ".list-detail:nth-child(3)"
    );
    console.log("讨论容器元素:", discussionContainer);

    if (discussionContainer) {
      while (true) {
        const titleElement = document.querySelector(
          `.list-detail:nth-child(3) .study-unit:nth-child(${discussionIndex}) .name-text`
        );
        const statusElement = document.querySelector(
          `.list-detail:nth-child(3) .study-unit:nth-child(${discussionIndex}) .font14`
        );

        if (!titleElement) {
          console.log(`未找到第 ${discussionIndex} 个讨论元素，停止收集`);
          break;
        }

        discussionData.push({
          title: titleElement.textContent.trim(),
          status: statusElement ? statusElement.textContent.trim() : "未知",
        });

        discussionIndex++;
      }
    }
    console.log("收集到的讨论数据:", discussionData);

    // 收集习题数据
    const exerciseData = [];
    let exerciseIndex = 1;
    const exerciseContainer = document.querySelector(
      ".list-detail:nth-child(4)"
    );
    console.log("习题容器元素:", exerciseContainer);

    if (exerciseContainer) {
      while (true) {
        const titleElement = document.querySelector(
          `.list-detail:nth-child(4) .study-unit:nth-child(${exerciseIndex}) .name-text`
        );
        const statusElement = document.querySelector(
          `.list-detail:nth-child(4) .study-unit:nth-child(${exerciseIndex}) > .complete-td`
        );

        if (!titleElement) {
          console.log(`未找到第 ${exerciseIndex} 个习题元素，停止收集`);
          break;
        }

        exerciseData.push({
          title: titleElement.textContent.trim(),
          status: statusElement ? statusElement.textContent.trim() : "未知",
        });

        exerciseIndex++;
      }
    }
    console.log("收集到的习题数据:", exerciseData);

    // 检查数据是否变化，避免不必要的更新
    const dataHash = JSON.stringify({
      video: videoData,
      exercise: exerciseData,
      discussion: discussionData,
    });
    if (dataHash !== lastDataHash) {
      console.log("数据已变化，更新面板");
      lastDataHash = dataHash;
      const data = {
        video: videoData,
        exercise: exerciseData,
        discussion: discussionData,
      };

      // 保存到localStorage
      try {
        localStorage.setItem("yuketang_helper_data", JSON.stringify(data));
        console.log("数据已保存到localStorage");
      } catch (e) {
        console.error("保存数据到localStorage失败:", e);
      }

      updatePanel(data, false); // 课程页面可点击
    } else {
      console.log("数据未变化，跳过更新");
    }
  }

  // 处理视频完成事件
  function handleVideoCompletion(completionData) {
    console.log("处理视频完成事件:", completionData);

    // 获取当前保存的数据
    const dataStr = localStorage.getItem("yuketang_helper_data");
    if (!dataStr) {
      console.log("未找到课程数据，跳过更新");
      return;
    }

    try {
      const data = JSON.parse(dataStr);
      const videoIndex = completionData.videoIndex - 1; // 索引从1开始，数组从0开始

      if (data.video && data.video[videoIndex]) {
        // 更新视频状态
        const oldStatus = data.video[videoIndex].status;
        data.video[videoIndex].status = "已完成 100%";

        console.log(
          `更新视频 #${completionData.videoIndex} 状态: ${oldStatus} -> 已完成 100%`
        );

        // 保存更新后的数据
        localStorage.setItem("yuketang_helper_data", JSON.stringify(data));
        lastDataHash = JSON.stringify(data); // 更新hash避免重复刷新

        // 更新面板显示
        updatePanel(data, false);

        // 清除完成标记，避免重复处理
        localStorage.removeItem("yuketang_video_completed");

        // 清除最后点击的任务记录，允许继续下一任务
        lastClickedTask = null;
        console.log("已清除任务记录，允许继续下一任务");

        // 显示提示
        showToast('<i class="fas fa-check-circle"></i> 视频已完成，数据已更新');
      } else {
        console.warn("未找到对应的视频数据:", videoIndex);
      }
    } catch (e) {
      console.error("处理视频完成状态失败:", e);
    }
  }

  // 处理讨论完成事件
  function handleDiscussionCompletion(completionData) {
    console.log("========== 处理讨论完成事件 ==========");
    console.log("完成数据:", completionData);

    // 获取当前保存的数据
    const dataStr = localStorage.getItem("yuketang_helper_data");
    if (!dataStr) {
      console.error("❌ 未找到课程数据(yuketang_helper_data)，跳过更新");
      return;
    }

    try {
      const data = JSON.parse(dataStr);
      console.log("📦 课程数据:", data);
      console.log("📊 讨论数量:", data.discussion ? data.discussion.length : 0);

      const discussionIndex = completionData.discussionIndex - 1;
      console.log("🔢 讨论索引 (从0开始):", discussionIndex);

      if (data.discussion && data.discussion[discussionIndex]) {
        console.log("✅ 找到对应的讨论数据:", data.discussion[discussionIndex]);

        // 更新讨论状态为"已发言"（与面板检测保持一致）
        const oldStatus = data.discussion[discussionIndex].status;
        data.discussion[discussionIndex].status = "已发言";

        console.log(
          `🔄 更新讨论 #${completionData.discussionIndex} 状态: ${oldStatus} -> 已发言`
        );

        // 保存更新后的数据
        localStorage.setItem("yuketang_helper_data", JSON.stringify(data));
        lastDataHash = JSON.stringify(data);
        console.log("💾 已保存更新后的数据到 localStorage");

        // 更新面板显示
        updatePanel(data, false);
        console.log("🎨 已更新面板显示");

        // 清除完成标记
        localStorage.removeItem("yuketang_discussion_completed");
        console.log("🗑️ 已清除完成标记");

        // 清除最后点击的任务记录，允许继续下一任务
        lastClickedTask = null;
        console.log("✨ 已清除任务记录，允许继续下一任务");

        // 显示提示
        showToast('<i class="fas fa-comments"></i> 讨论已完成，数据已更新');
        console.log("========== 讨论完成处理结束 ==========");
      } else {
        console.error("❌ 未找到对应的讨论数据");
        console.error("讨论索引:", discussionIndex);
        console.error("讨论数组:", data.discussion);
        console.error("========== 讨论完成处理失败 ==========");
      }
    } catch (e) {
      console.error("❌ 处理讨论完成状态失败:", e);
      console.error("========== 讨论完成处理异常 ==========");
    }
  }

  // 处理习题完成事件
  function handleExerciseCompletion(completionData) {
    console.log("处理习题完成事件:", completionData);

    // 获取当前保存的数据
    const dataStr = localStorage.getItem("yuketang_helper_data");
    if (!dataStr) {
      console.log("未找到课程数据，跳过更新");
      return;
    }

    try {
      const data = JSON.parse(dataStr);
      const exerciseIndex = completionData.exerciseIndex - 1;

      if (data.exercise && data.exercise[exerciseIndex]) {
        // 更新习题状态
        const oldStatus = data.exercise[exerciseIndex].status;
        data.exercise[exerciseIndex].status = "已完成";

        console.log(
          `更新习题 #${completionData.exerciseIndex} 状态: ${oldStatus} -> 已完成`
        );

        // 保存更新后的数据
        localStorage.setItem("yuketang_helper_data", JSON.stringify(data));
        lastDataHash = JSON.stringify(data);

        // 更新面板显示
        updatePanel(data, false);

        // 清除完成标记
        localStorage.removeItem("yuketang_exercise_completed");

        // 清除最后点击的任务记录，允许继续下一任务
        lastClickedTask = null;
        console.log("已清除任务记录，允许继续下一任务");

        // 显示提示
        showToast('<i class="fas fa-edit"></i> 习题已完成，数据已更新');
      } else {
        console.warn("未找到对应的习题数据:", exerciseIndex);
      }
    } catch (e) {
      console.error("处理习题完成状态失败:", e);
    }
  }

  // 创建悬浮面板
  function createFloatingPanel() {
    console.log("创建悬浮面板...");

    // 检查是否已存在
    if (document.getElementById("yuketang-helper-panel")) {
      console.log("面板已存在，跳过创建");
      return;
    }

    // 监听localStorage变化，检测视频完成状态
    window.addEventListener("storage", (e) => {
      if (e.key === "yuketang_video_completed" && e.newValue) {
        console.log("检测到视频完成事件:", e.newValue);
        handleVideoCompletion(JSON.parse(e.newValue));
      }
      if (e.key === "yuketang_discussion_completed" && e.newValue) {
        console.log("检测到讨论完成事件:", e.newValue);
        handleDiscussionCompletion(JSON.parse(e.newValue));
      }
      if (e.key === "yuketang_exercise_completed" && e.newValue) {
        console.log("检测到习题完成事件:", e.newValue);
        handleExerciseCompletion(JSON.parse(e.newValue));
      }
    });

    // 页面获得焦点时也检查一次（用于同一浏览器窗口的情况）
    window.addEventListener("focus", () => {
      const completionDataStr = localStorage.getItem(
        "yuketang_video_completed"
      );
      if (completionDataStr) {
        const completionData = JSON.parse(completionDataStr);
        // 检查是否是最近5秒内的完成事件（避免重复处理）
        if (Date.now() - completionData.timestamp < 5000) {
          console.log("页面获得焦点，检测到最近的视频完成:", completionData);
          handleVideoCompletion(completionData);
        }
      }

      const discussionDataStr = localStorage.getItem(
        "yuketang_discussion_completed"
      );
      if (discussionDataStr) {
        const discussionData = JSON.parse(discussionDataStr);
        if (Date.now() - discussionData.timestamp < 5000) {
          console.log("页面获得焦点，检测到最近的讨论完成:", discussionData);
          handleDiscussionCompletion(discussionData);
        }
      }

      const exerciseDataStr = localStorage.getItem(
        "yuketang_exercise_completed"
      );
      if (exerciseDataStr) {
        const exerciseData = JSON.parse(exerciseDataStr);
        if (Date.now() - exerciseData.timestamp < 5000) {
          console.log("页面获得焦点，检测到最近的习题完成:", exerciseData);
          handleExerciseCompletion(exerciseData);
        }
      }
    });

    // 添加Font Awesome样式
    const faLink = document.createElement("link");
    faLink.rel = "stylesheet";
    faLink.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    faLink.crossOrigin = "anonymous";
    document.head.appendChild(faLink);

    // 创建面板容器
    const panel = document.createElement("div");
    panel.id = "yuketang-helper-panel";
    panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">
                    <i class="fas fa-book-reader"></i>
                    <span>学习进度</span>
                </div>
                <div class="panel-controls">
                    <button class="panel-btn" id="refresh-btn" title="刷新">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="panel-btn" id="minimize-btn" title="最小化">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <div class="panel-content" id="panel-content">
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>加载中...</span>
                </div>
            </div>
            <!-- 自定义滚动条 -->
            <div class="custom-scrollbar-track" id="custom-scrollbar-track">
                <div class="custom-scrollbar-thumb" id="custom-scrollbar-thumb"></div>
            </div>
            <button class="back-to-top" id="back-to-top" title="返回顶部">
                <i class="fas fa-arrow-up"></i>
            </button>
        `;

    // 添加样式
    const style = document.createElement("style");
    style.textContent = `
            #yuketang-helper-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 40vh;
                background: #1f2937;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                z-index: 999999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                overflow: hidden;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform;
                transform: translate(0, 0);
                border: 1px solid #374151;
            }

            #yuketang-helper-panel.minimized {
                max-height: 60px;
            }

            #yuketang-helper-panel.minimized .panel-content {
                opacity: 0;
                max-height: 0;
                overflow: hidden;
            }

            .panel-header {
                background: #111827;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                border-bottom: 1px solid #374151;
            }

            .panel-title {
                display: flex;
                align-items: center;
                gap: 8px;
                color: white;
                font-size: 15px;
                font-weight: 600;
            }

            .panel-title i {
                font-size: 16px;
            }

            .panel-controls {
                display: flex;
                gap: 6px;
            }

            .panel-btn {
                background: #374151;
                border: 1px solid #4b5563;
                width: 28px;
                height: 28px;
                border-radius: 5px;
                color: #e5e7eb;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease-in-out;
            }

            .panel-btn i {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .panel-btn:hover {
                background: #4b5563;
                border-color: #6b7280;
            }

            .panel-btn:active {
                transform: scale(0.95);
            }

            .panel-content {
                padding: 0;
                max-height: calc(40vh - 60px);
                overflow-y: overlay;
                background: #1f2937;
                transition: opacity 0.4s ease-in-out, max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 1;
            }

            .panel-content::-webkit-scrollbar {
                display: none; /* 隐藏原生滚动条 */
            }
            .panel-content {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
            }

            /* 自定义悬浮滚动条容器 */
            .custom-scrollbar-track {
                position: absolute;
                top: 96px; /* 避开Header(约50px) + NavBar(约46px) */
                right: 2px;
                bottom: 2px;
                width: 6px;
                background: transparent;
                z-index: 1000; /* 确保在最上层，覆盖 .nav-indicator */
                pointer-events: none; /* 让鼠标事件透过轨道直接作用于内容，除非点在滑块上 */
            }

            /* 自定义滑块 */
            .custom-scrollbar-thumb {
                position: absolute;
                top: 0;
                right: 0;
                width: 4px;
                background: rgba(156, 163, 175);
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s, width 0.2s;
                pointer-events: auto; /* 恢复滑块的鼠标事件 */
                opacity: 0; /* 默认隐藏，滚动时显示 */
            }

            /* 容器hover或滚动时显示滑块 */
            #yuketang-helper-panel:hover .custom-scrollbar-thumb,
            .custom-scrollbar-thumb.visible {
                opacity: 1;
            }

            .custom-scrollbar-thumb:hover,
            .custom-scrollbar-thumb.dragging {
                background: rgba(156, 163, 175, 0.8);
                width: 6px;
            }

            .loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
                padding: 40px 20px;
                color: #818cf8;
            }

            .loading i {
                font-size: 32px;
            }

            .item {
                background: #374151;
                border-radius: 6px;
                padding: 10px 12px;
                margin-bottom: 8px;
                box-shadow: none;
                border: 1px solid #4b5563;
                transition: all 0.3s;
                animation: slideIn 0.5s ease-out;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .item:hover {
                background: #4b5563;
                border-color: #6b7280;
            }

            .item-header {
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1;
                min-width: 0;
            }

            .item-number {
                background: #6366f1;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                flex-shrink: 0;
            }

            .item-title {
                flex: 1;
                color: #f3f4f6;
                font-weight: 600;
                line-height: 1.4;
                font-size: 13px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .item-status {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 10px;
                background: #1f2937;
                border-radius: 6px;
                font-size: 12px;
                border: 1px solid #4b5563;
                flex-shrink: 0;
                white-space: nowrap;
            }

            .item-status i {
                color: #818cf8;
            }

            .status-text {
                color: #d1d5db;
            }

            .status-completed {
                color: #48bb78;
            }

            .status-incomplete {
                color: #f56565;
            }

            .empty-state {
                text-align: center;
                padding: 40px 20px;
                color: #9ca3af;
            }

            .empty-state i {
                font-size: 48px;
                margin-bottom: 16px;
                color: #6b7280;
            }

            .empty-state p {
                margin: 0;
                font-size: 14px;
            }

            .accordion {
                margin-top: 0;
                background: #111827;
                border-radius: 0;
                border: none;
                border-bottom: 1px solid #374151;
                overflow: visible;
            }

            .accordion-header {
                background: rgba(31, 41, 55, 0.7); /* 半透明背景 */
                backdrop-filter: blur(8px) brightness(1.05); /* 玻璃效果 */
                -webkit-backdrop-filter: blur(8px) brightness(1.05);
                border-left: 3px solid #818cf8;
                padding: 12px 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                transition: all 0.2s;
                position: sticky;
                top: 45px;
                z-index: 9;
            }

            .accordion-header::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background: #818cf8;
                transition: width 0.2s;
            }

            .accordion-header:hover {
                background: #374151;
            }

            .accordion-header:hover::before {
                width: 5px;
            }

            .accordion-title {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #f3f4f6;
                font-weight: 600;
                font-size: 14px;
            }

            .accordion-title i {
                color: #818cf8;
                font-size: 14px;
            }

            .accordion-stats {
                color: #818cf8;
                font-size: 13px;
                font-weight: 600;
                margin-left: auto;
                padding-left: 12px;
            }

            .accordion-icon {
                color: #9ca3af;
                font-size: 14px;
                transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease-in-out;
            }

            .accordion-header:hover .accordion-icon {
                color: #d1d5db;
            }

            .accordion.collapsed .accordion-icon {
                transform: rotate(-90deg);
            }

            .accordion-content {
                max-height: 10000px;
                overflow: hidden;
                transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                            padding 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                            opacity 0.4s ease-in-out;
                padding: 8px 12px 12px 12px;
                background: #1f2937;
                opacity: 1;
            }

            .accordion.collapsed .accordion-content {
                max-height: 0;
                padding: 0 12px;
                opacity: 0;
            }

            .accordion .item {
                background: #374151;
                border-left: 2px solid transparent;
                transition: all 0.2s ease-in-out;
                transform-origin: top;
            }

            .accordion .item:hover {
                background: #4b5563;
                border-color: #6b7280;
                border-left-color: #818cf8;
                cursor: pointer;
            }

            /* 只读模式样式 */
            .accordion .item.readonly {
                cursor: not-allowed !important;
                opacity: 0.7;
            }

            .accordion .item.readonly:hover {
                background: #374151 !important;
                border-left-color: transparent !important;
                cursor: not-allowed !important;
            }

            .back-to-top {
                position: absolute;
                bottom: 16px;
                right: 16px;
                width: 40px;
                height: 40px;
                background: #6366f1;
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 20;
            }

            .back-to-top.show {
                opacity: 1;
                visibility: visible;
            }

            .back-to-top:hover {
                background: #818cf8;
                box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
            }

            .back-to-top:active {
                transform: translateY(0);
            }

            .back-to-top i {
                font-size: 16px;
            }

            /* 导航栏样式 */
            .nav-bar {
                display: flex;
                background: rgba(55, 65, 81, 0.75); /* 半透明背景 */
                backdrop-filter: blur(12px) brightness(1.1) contrast(1.05) saturate(120%); /* 玻璃效果 */
                -webkit-backdrop-filter: blur(12px) brightness(1.1) contrast(1.05) saturate(120%); /* Safari支持 */
                border-bottom: 2px solid rgba(75, 85, 99, 0.6);
                padding: 0;
                margin: 0;
                position: sticky;
                top: 0;
                z-index: 100;
            }

            .nav-tab {
                flex: 1;
                padding: 12px 16px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #9ca3af;
                font-size: 13px;
                font-weight: 600;
                position: relative;
                z-index: 1;
            }

            .nav-tab:hover {
                background: rgba(75, 85, 99, 0.5);
                color: #e5e7eb;
            }

            .nav-tab.active {
                color: #6366f1;
                background: #1f2937;
            }

            .nav-tab i {
                margin-right: 6px;
            }

            /* 滑动指示器 */
            .nav-indicator {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                width: 50%;
                background: linear-gradient(90deg, #6366f1, #818cf8);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 2;
                box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
            }

            /* 内容区域 */
            .nav-content {
                display: none;
            }

            .nav-content.active {
                display: block;
            }

            /* 卡片容器样式 - 使卡片并排显示 */
            .task-cards-container {
                display: flex;
                gap: 8px;
                margin: 12px;
                align-items: stretch;
            }

            /* 下一个任务卡片样式 */
            .next-task-card {
                background: #6366f1;
                border-radius: 8px;
                padding: 10px 12px;
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                cursor: pointer;
                transition: all 0.3s ease-in-out;
                border: 2px solid rgba(255, 255, 255, 0.1);
                flex: 1;
                min-width: 0;
            }

            .next-task-card:hover {
                box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
            }

            .next-task-card.readonly {
                cursor: not-allowed !important;
                opacity: 0.7;
            }

            .next-task-card.readonly:hover {
                transform: none !important;
            }

            .next-task-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .next-task-header i {
                font-size: 12px;
            }

            .next-task-content {
                color: white;
            }

            .next-task-type {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                opacity: 0.95;
                font-weight: 700;
                color: white;
            }

            .next-task-type i {
                font-size: 13px;
            }

            .next-task-badge {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: white;
                opacity: 0.85;
            }

            .next-task-badge i {
                font-size: 10px;
            }

            .next-task-title {
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 6px;
                line-height: 1.3;
                color: white;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .next-task-status {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                font-size: 11px;
                opacity: 0.9;
                padding-top: 6px;
                border-top: 1px solid rgba(255, 255, 255, 0.15);
            }

            .next-task-status-text {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .next-task-action {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                font-weight: 600;
                opacity: 0.95;
            }

            .next-task-action i {
                font-size: 10px;
            }

            /* 自动化控制卡片样式 */
            .automation-control-card {
                background: #374151;
                border-radius: 8px;
                padding: 8px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                border: 2px solid #4b5563;
                flex-shrink: 0;
                display: flex;
                flex-direction: row;
                gap: 12px;
                transition: all 0.3s ease-in-out;
                align-items: center;
            }

            .automation-control-card:hover {
                border-color: #6b7280;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }

            .automation-stats {
                display: flex;
                gap: 16px;
                margin-left: auto;
            }

            .stat-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 11px;
                color: #e5e7eb;
                font-weight: 600;
            }

            .stat-item i {
                color: #818cf8;
                font-size: 12px;
            }

            .stat-item span {
                white-space: nowrap;
            }



            .automation-controls {
                display: flex;
                flex-direction: row;
                gap: 8px;
                align-items: stretch;
            }

            .automation-options {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
            }

            .automation-checkbox {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 6px;
                background: #4b5563;
                border: 1px solid #6b7280;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                font-size: 10px;
                color: #e5e7eb;
                font-weight: 600;
            }

            .automation-checkbox:hover {
                background: #6b7280;
                border-color: #818cf8;
            }

            .automation-checkbox input[type="checkbox"] {
                width: 14px;
                height: 14px;
                cursor: pointer;
                margin: 0;
                flex-shrink: 0;
                appearance: none;
                -webkit-appearance: none;
                border: 2px solid #9ca3af;
                border-radius: 3px;
                background-color: transparent;
                position: relative;
                transition: all 0.2s ease;
            }

            .automation-checkbox input[type="checkbox"]:hover {
                border-color: #6366f1;
            }

            .automation-checkbox input[type="checkbox"]:checked {
                background-color: #6366f1;
                border-color: #6366f1;
            }

            .automation-checkbox input[type="checkbox"]:checked::after {
                content: '';
                position: absolute;
                left: 3px;
                top: 0px;
                width: 4px;
                height: 8px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }

            .automation-checkbox span {
                flex: 1;
                white-space: nowrap;
            }

            .automation-toggle-btn {
                background: #4b5563;
                border: 1px solid #6b7280;
                border-radius: 6px;
                padding: 10px 8px;
                color: #e5e7eb;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                transition: all 0.2s ease-in-out;
                font-size: 11px;
                font-weight: 700;
            }

            .automation-toggle-btn i {
                font-size: 20px;
                color: #818cf8;
                transition: all 0.2s ease-in-out;
            }

            /* Toast 提示样式 - 支持多条堆叠 */
            .yuketang-toast {
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 10px 20px;
                border-radius: 24px;
                font-size: 13px;
                font-weight: 500;
                z-index: 2147483647;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                max-width: 70%;
                text-align: center;
                line-height: 1.4;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                pointer-events: none;
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            /* 最新的 Toast（层级 0） */
            .yuketang-toast.toast-level-0 {
                opacity: 1;
                transform: translateX(-50%) scale(1);
                z-index: 2147483647;
                animation: toast-slide-in 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                min-width: 180px;
                max-width: 400px;
            }

            /* 第二层 Toast */
            .yuketang-toast.toast-level-1 {
                opacity: 0.7;
                transform: translateX(-50%) translateY(-40px) scale(0.94);
                z-index: 2147483646;
                filter: brightness(0.85);
                min-width: 180px;
                max-width: 340px;
            }

            /* 第三层 Toast */
            .yuketang-toast.toast-level-2 {
                opacity: 0.45;
                transform: translateX(-50%) translateY(-80px) scale(0.88);
                z-index: 2147483645;
                filter: brightness(0.7);
                min-width: 180px;
                max-width: 280px;
            }

            .yuketang-toast i {
                font-size: 16px;
            }

            .yuketang-toast .fa-rocket {
                color: #818cf8;
            }

            .yuketang-toast .fa-trophy {
                color: #ffd700;
            }

            .yuketang-toast .fa-exclamation-triangle {
                color: #fbbf24;
            }

            .yuketang-toast .fa-times-circle {
                color: #ef4444;
            }

            .yuketang-toast .fa-check-circle {
                color: #10b981;
            }

            .yuketang-toast .fa-info-circle {
                color: #3b82f6;
            }

            @keyframes toast-slide-in {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) scale(1);
                }
            }

            .yuketang-toast.fade-out {
                animation: toast-fade-out 0.3s ease-in forwards;
            }

            @keyframes toast-fade-out {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px) scale(0.9);
                }
            }
                    transform: translate(-50%, -50%);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -40%);
                }
            }

            /* 模态框样式 */
            .yuketang-modal-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: rgba(0, 0, 0, 0.75) !important;
                display: none !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 2147483647 !important;
                animation: modal-fade-in 0.3s ease-out;
                backdrop-filter: blur(3px);
            }

            .yuketang-modal-overlay.show {
                display: flex !important;
            }

            .yuketang-modal {
                background: #1f2937 !important;
                border-radius: 12px !important;
                padding: 24px !important;
                max-width: 400px !important;
                width: 90% !important;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;
                animation: modal-slide-up 0.3s ease-out;
                border: 2px solid #374151 !important;
                position: relative !important;
                z-index: 2147483647 !important;
            }

            .yuketang-modal-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
                color: #fbbf24;
            }

            .yuketang-modal-header i {
                font-size: 24px;
            }

            .yuketang-modal-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 700;
                color: #e5e7eb;
            }

            .yuketang-modal-body {
                color: #d1d5db;
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 20px;
            }

            .yuketang-modal-footer {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }

            .yuketang-modal-btn {
                padding: 8px 20px;
                border-radius: 6px;
                border: none;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .yuketang-modal-btn-cancel {
                background: #4b5563;
                color: #e5e7eb;
            }

            .yuketang-modal-btn-cancel:hover {
                background: #6b7280;
            }

            .yuketang-modal-btn-confirm {
                background: #6366f1;
                color: white;
            }

            .yuketang-modal-btn-confirm:hover {
                background: #818cf8;
            }

            @keyframes modal-fade-in {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes modal-slide-up {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .automation-toggle-btn:hover {
                background: #6366f1;
                border-color: #818cf8;
                box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
            }

            .automation-toggle-btn:hover i {
                color: white;
                transform: scale(1.1);
            }

            .automation-toggle-btn:active {
                transform: translateY(0);
            }

            .automation-toggle-btn.active {
                background: #6366f1;
                border-color: #48bb78;
            }

            .automation-toggle-btn.active i {
                color: #48bb78;
                animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.6;
                }
            }

            /* 全部完成时的容器样式 */
            .task-cards-container.all-completed {
                justify-content: center;
            }

            .task-cards-container.all-completed .next-task-card {
                flex: 0 1 auto;
                max-width: 100%;
            }

            /* 全部完成卡片样式 */
            .next-task-card.all-completed {
                background: #48bb78;
                cursor: default;
            }

            .next-task-card.all-completed:hover {
                transform: none;
            }

            .all-completed-content {
                display: flex;
                align-items: center;
                gap: 16px;
                color: white;
            }

            .all-completed-content > i {
                font-size: 40px;
                color: #ffd700;
                animation: trophy-bounce 2s ease-in-out infinite;
            }

            @keyframes trophy-bounce {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-5px);
                }
            }

            .all-completed-text {
                flex: 1;
            }

            .congrats-title {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 4px;
            }

            .congrats-subtitle {
                font-size: 13px;
                opacity: 0.9;
            }
        `;

    document.head.appendChild(style);
    document.body.appendChild(panel);

    console.log("面板已添加到页面");

    // 获取课程名称并更新面板标题
    setTimeout(() => {
      const courseNameElement = document.querySelector("h1 > .text-ellipsis");
      if (courseNameElement) {
        const courseName = courseNameElement.textContent.trim();
        const panelTitleSpan = panel.querySelector(".panel-title > span");
        if (panelTitleSpan && courseName) {
          panelTitleSpan.textContent = courseName;
          console.log("已更新面板标题为课程名称:", courseName);
        }
      }
    }, 500);

    // 阻止面板右键菜单
    panel.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    // 添加拖拽功能
    makeDraggable(panel);

    // 添加按钮事件
    document.getElementById("refresh-btn").addEventListener("click", () => {
      if (currentPageType === "course") {
        // 课程页面：重新收集数据
        clickTabAndCollect();
      } else if (currentPageType === "video") {
        // 视频页面：从localStorage重新加载
        loadDataFromStorage();
      }
    });

    document.getElementById("minimize-btn").addEventListener("click", () => {
      panel.classList.toggle("minimized");
      const icon = document.querySelector("#minimize-btn i");
      icon.className = panel.classList.contains("minimized")
        ? "fas fa-plus"
        : "fas fa-minus";
    });

    // 返回顶部按钮功能
    const backToTopBtn = document.getElementById("back-to-top");
    const panelContent = document.getElementById("panel-content");
    const scrollThumb = document.getElementById("custom-scrollbar-thumb");
    const scrollTrack = document.getElementById("custom-scrollbar-track");

    // 自定义滚动条逻辑
    function updateScrollbar() {
      const contentHeight = panelContent.scrollHeight;
      const containerHeight = panelContent.clientHeight;
      const scrollTop = panelContent.scrollTop;

      // 如果内容不超过容器，隐藏滚动条
      if (contentHeight <= containerHeight) {
        scrollThumb.style.display = 'none';
        return;
      }
      scrollThumb.style.display = 'block';

      // 1. 动态调整轨道的位置和高度，使其精确覆盖内容区域
      // offsetTop 需要加上导航栏和header的高度偏移，这里直接获取 panelContent 相对于父容器的位置更准确
      // 但由于 panelContent 可能有 margin/padding，最稳妥的是直接读取它的位置
      // 这里我们简单修正：让轨道高度等于容器可视高度
      scrollTrack.style.height = `${containerHeight}px`;
      // top 保持 CSS 中的 96px 或动态获取 panelContent.offsetTop
      scrollTrack.style.top = `${panelContent.offsetTop}px`;

      // 2. 获取轨道实际高度 (应该等于 containerHeight)
      const trackHeight = containerHeight;

      // 3. 计算滑块高度 (最小20px)
      // 滑块高度占轨道的比例 = 容器可视高度 占 总内容高度 的比例
      const thumbHeight = Math.max(20, (containerHeight / contentHeight) * trackHeight);
      scrollThumb.style.height = `${thumbHeight}px`;

      // 4. 计算滑块位置
      const maxScrollTop = contentHeight - containerHeight;
      const maxThumbTop = trackHeight - thumbHeight;
      // 避免除以0
      const scrollRatio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
      const thumbTop = scrollRatio * maxThumbTop;

      scrollThumb.style.transform = `translateY(${thumbTop}px)`;
    }

    // 拖拽逻辑
    let isDraggingScrollbar = false;
    let startY = 0;
    let startScrollTop = 0;

    scrollThumb.addEventListener('mousedown', (e) => {
      isDraggingScrollbar = true;
      scrollThumb.classList.add('dragging');
      startY = e.clientY;
      startScrollTop = panelContent.scrollTop;
      e.preventDefault(); // 防止选中文本
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onScrollbarDrag);
      document.addEventListener('mouseup', onScrollbarDragEnd);
    });

    function onScrollbarDrag(e) {
      if (!isDraggingScrollbar) return;
      const deltaY = e.clientY - startY;

      const contentHeight = panelContent.scrollHeight;
      const containerHeight = panelContent.clientHeight;
      const trackHeight = containerHeight; // 轨道高度等于容器高度

      const thumbHeight = Math.max(20, (containerHeight / contentHeight) * trackHeight);
      const maxThumbTop = trackHeight - thumbHeight;
      const maxScrollTop = contentHeight - containerHeight;

      // 计算新的 scrollTop
      // 移动比例 = 鼠标移动距离 / 滑块最大可移动距离
      const moveRatio = maxThumbTop > 0 ? deltaY / maxThumbTop : 0;
      panelContent.scrollTop = startScrollTop + (moveRatio * maxScrollTop);
    }

    function onScrollbarDragEnd() {
      isDraggingScrollbar = false;
      scrollThumb.classList.remove('dragging');
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onScrollbarDrag);
      document.removeEventListener('mouseup', onScrollbarDragEnd);
    }

    // 监听内容变化和容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      updateScrollbar();
    });
    resizeObserver.observe(panelContent);
    // 监听子元素变化
    const mutationObserver = new MutationObserver(() => {
      updateScrollbar();
    });
    mutationObserver.observe(panelContent, { childList: true, subtree: true });


    // 监听滚动事件
    panelContent.addEventListener("scroll", () => {
      // 滚动自定义滑块
      updateScrollbar();

      // 返回顶部按钮显示逻辑
      if (panelContent.scrollTop > 200) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    // 点击返回顶部
    backToTopBtn.addEventListener("click", () => {
      panelContent.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    // 为复选框添加事件委托（在panel-content上监听）
    // 这样无论内容如何更新，事件都能正确触发
    let isCheckboxUpdating = false; // 防止递归触发

    panelContent.addEventListener("change", (e) => {
      const target = e.target;

      // 防止在程序内部更新复选框时触发事件
      if (isCheckboxUpdating) {
        return;
      }

      // 处理习题复选框
      if (target.id === "auto-exercise-checkbox") {
        if (target.checked) {
          // 显示确认模态框
          showConfirmModal(
            "习题识别确认",
            "仅为识别题目信息，并不作答，请确认",
            () => {
              // 确认
              localStorage.setItem("yuketang_auto_exercise", "true");
            },
            () => {
              // 取消 - 恢复复选框状态
              isCheckboxUpdating = true;
              target.checked = false;
              localStorage.setItem("yuketang_auto_exercise", "false");
              setTimeout(() => { isCheckboxUpdating = false; }, 0);
            }
          );
        } else {
          localStorage.setItem("yuketang_auto_exercise", "false");
        }
      }

      // 处理讨论复选框
      if (target.id === "auto-discussion-checkbox") {
        if (target.checked) {
          // 显示确认模态框
          showConfirmModal(
            "讨论AI辅助确认",
            "将使用AI工具完成发言内容生成与填写，请确认",
            () => {
              // 确认
              localStorage.setItem("yuketang_auto_discussion", "true");
            },
            () => {
              // 取消 - 恢复复选框状态
              isCheckboxUpdating = true;
              target.checked = false;
              localStorage.setItem("yuketang_auto_discussion", "false");
              setTimeout(() => { isCheckboxUpdating = false; }, 0);
            }
          );
        } else {
          localStorage.setItem("yuketang_auto_discussion", "false");
        }
      }
    });
  }

  // 更新面板内容
  // readOnly: true表示视频页面只读模式，禁用点击
  function updatePanel(data, readOnly = false) {
    const content = document.getElementById("panel-content");

    if (!content) {
      console.log("面板内容区域不存在");
      return;
    }

    // 如果传入的是数组（旧版兼容）或空对象，显示空状态
    if (
      Array.isArray(data) ||
      (!data.video && !data.exercise && !data.discussion)
    ) {
      content.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>暂无数据</p>
                    <p style="font-size: 12px; margin-top: 8px;">请确保已打开正确的页面</p>
                </div>
            `;
      return;
    }

    const videoData = data.video || [];
    const exerciseData = data.exercise || [];
    const discussionData = data.discussion || [];

    // 计算各类型的统计数据
    const videoCompleted = videoData.filter(
      (item) => item.status.includes("已完成") || item.status.includes("100%")
    ).length;
    const exerciseCompleted = exerciseData.filter(
      (item) => item.status.includes("已完成") || item.status.includes("100%")
    ).length;
    const discussionCompleted = discussionData.filter(
      (item) => item.status.includes("已发言") || item.status.includes("已完成")
    ).length;

    // 查找下一个未完成的条目（按顺序：视频 -> 习题 -> 讨论）
    let nextIncomplete = null;

    // 先检查视频
    for (let i = 0; i < videoData.length; i++) {
      const isCompleted =
        videoData[i].status.includes("已完成") ||
        videoData[i].status.includes("100%");
      if (!isCompleted) {
        nextIncomplete = {
          type: "video",
          index: i + 1,
          title: videoData[i].title,
          status: videoData[i].status,
          icon: "fa-video",
          typeName: "视频",
        };
        break;
      }
    }

    // 如果视频都完成了，检查习题
    if (!nextIncomplete) {
      for (let i = 0; i < exerciseData.length; i++) {
        const isCompleted =
          exerciseData[i].status.includes("已完成") ||
          exerciseData[i].status.includes("100%");
        if (!isCompleted) {
          nextIncomplete = {
            type: "exercise",
            index: i + 1,
            title: exerciseData[i].title,
            status: exerciseData[i].status,
            icon: "fa-pen-to-square",
            typeName: "习题",
          };
          break;
        }
      }
    }

    // 如果习题也都完成了，检查讨论
    if (!nextIncomplete) {
      for (let i = 0; i < discussionData.length; i++) {
        const isCompleted =
          discussionData[i].status.includes("已发言") ||
          discussionData[i].status.includes("已完成");
        if (!isCompleted) {
          nextIncomplete = {
            type: "discussion",
            index: i + 1,
            title: discussionData[i].title,
            status: discussionData[i].status,
            icon: "fa-comments",
            typeName: "讨论",
          };
          break;
        }
      }
    }

    let html = "";

    // 导航栏
    html += `
        <div class="nav-bar">
            <div class="nav-tab active" data-tab="home">
                <i class="fas fa-home"></i>
                <span>首页</span>
            </div>
            <div class="nav-tab" data-tab="courses">
                <i class="fas fa-book"></i>
                <span>课程信息</span>
            </div>
            <div class="nav-indicator"></div>
        </div>
    `;

    // 首页内容
    html += `<div class="nav-content active" id="home-content">`;

    // 如果有未完成的条目，显示"下一个任务"卡片和自动化控制卡片
    if (nextIncomplete) {
      html += `
            <div class="task-cards-container">
                <div class="next-task-card ${readOnly ? "readonly" : ""}" 
                     data-type="${nextIncomplete.type}" 
                     data-index="${nextIncomplete.index}"
                     ${readOnly ? 'data-readonly="true"' : ""}>
                    <div class="next-task-header">
                        <div class="next-task-type">
                            <i class="fas ${nextIncomplete.icon}"></i>
                            <span>${nextIncomplete.typeName} #${nextIncomplete.index
        }</span>
                        </div>
                        <div class="next-task-badge">
                            <i class="fas fa-bullseye"></i>
                            <span>下一个任务</span>
                        </div>
                    </div>
                    <div class="next-task-content">
                        <div class="next-task-title" title="${nextIncomplete.title
        }">${nextIncomplete.title}</div>
                        <div class="next-task-status">
                            <div class="next-task-status-text">
                                <i class="fas fa-clock"></i>
                                <span>${nextIncomplete.status}</span>
                            </div>
                            ${!readOnly
          ? '<div class="next-task-action"><span>点击前往</span><i class="fas fa-arrow-right"></i></div>'
          : ""
        }
                        </div>
                    </div>
                </div>
            </div>
            <div class="task-cards-container" style="margin-top: 8px;">
                <div class="automation-control-card">
                    <div class="automation-controls">
                        <button class="automation-toggle-btn" id="automation-toggle-btn" title="开始自动化">
                            <i class="fas fa-play"></i>
                            <span>开始</span>
                        </button>
                        <div class="automation-options">
                            <label class="automation-checkbox">
                                <input type="checkbox" id="auto-exercise-checkbox">
                                <span>习题</span>
                            </label>
                            <label class="automation-checkbox">
                                <input type="checkbox" id="auto-discussion-checkbox">
                                <span>讨论</span>
                            </label>
                        </div>
                    </div>
                    <div class="automation-stats">
                        <div class="stat-item">
                            <i class="fas fa-video"></i>
                            <span>视频: ${videoCompleted}/${videoData.length}</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-pen-to-square"></i>
                            <span>习题: ${exerciseCompleted}/${exerciseData.length}</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-comments"></i>
                            <span>讨论: ${discussionCompleted}/${discussionData.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
      // 所有任务都完成了
      html += `
            <div class="task-cards-container all-completed">
                <div class="next-task-card all-completed">
                    <div class="all-completed-content">
                        <i class="fas fa-trophy"></i>
                        <div class="all-completed-text">
                            <div class="congrats-title"><i class="fas fa-check-circle"></i> 恭喜完成！</div>
                            <div class="congrats-subtitle">所有学习任务已完成</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 关闭首页内容
    html += `</div>`;

    // 课程信息内容
    html += `<div class="nav-content" id="courses-content">`;

    // 构建视频风琴容器
    html += `
            <div class="accordion collapsed" id="accordion-video">
                <div class="accordion-header">
                    <div class="accordion-title">
                        <i class="fas fa-video"></i>
                        <span>视频</span>
                    </div>
                    <div class="accordion-stats">${videoCompleted}/${videoData.length}</div>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
        `;

    if (videoData.length > 0) {
      videoData.forEach((item, index) => {
        const isCompleted =
          item.status.includes("已完成") || item.status.includes("100%");
        html += `
                    <div class="item ${readOnly ? "readonly" : ""}" 
                         data-type="video" 
                         data-index="${index + 1}" 
                         ${readOnly ? 'data-readonly="true"' : ""}
                         style="animation-delay: ${index * 0.05}s; ${readOnly ? "cursor: not-allowed; opacity: 0.7;" : ""
          }">
                        <div class="item-number">${index + 1}</div>
                        <div class="item-title" title="${item.title}">${item.title
          }</div>
                        <div class="item-status">
                            <i class="fas ${isCompleted
            ? "fa-check-circle status-completed"
            : "fa-clock status-incomplete"
          }"></i>
                            <span class="status-text ${isCompleted
            ? "status-completed"
            : "status-incomplete"
          }">${item.status}</span>
                        </div>
                    </div>
                `;
      });
    } else {
      html += `
                <div class="empty-state" style="padding: 20px;">
                    <i class="fas fa-video" style="font-size: 32px;"></i>
                    <p style="font-size: 13px; margin-top: 8px;">暂无视频数据</p>
                </div>
            `;
    }

    html += `
                </div>
            </div>
        `;

    // 构建习题风琴容器
    html += `
            <div class="accordion collapsed" id="accordion-exercise" style="margin-top: 8px;">
                <div class="accordion-header">
                    <div class="accordion-title">
                        <i class="fas fa-pen-to-square"></i>
                        <span>习题</span>
                    </div>
                    <div class="accordion-stats">${exerciseCompleted}/${exerciseData.length}</div>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
        `;

    if (exerciseData.length > 0) {
      exerciseData.forEach((item, index) => {
        const isCompleted =
          item.status.includes("已完成") || item.status.includes("100%");
        html += `
                    <div class="item ${readOnly ? "readonly" : ""}" 
                         data-type="exercise" 
                         data-index="${index + 1}" 
                         ${readOnly ? 'data-readonly="true"' : ""}
                         style="animation-delay: ${index * 0.05}s; ${readOnly ? "cursor: not-allowed; opacity: 0.7;" : ""
          }">
                        <div class="item-number">${index + 1}</div>
                        <div class="item-title" title="${item.title}">${item.title
          }</div>
                        <div class="item-status">
                            <i class="fas ${isCompleted
            ? "fa-check-circle status-completed"
            : "fa-clock status-incomplete"
          }"></i>
                            <span class="status-text ${isCompleted
            ? "status-completed"
            : "status-incomplete"
          }">${item.status}</span>
                        </div>
                    </div>
                `;
      });
    } else {
      html += `
                <div class="empty-state" style="padding: 20px;">
                    <i class="fas fa-clipboard-question" style="font-size: 32px;"></i>
                    <p style="font-size: 13px; margin-top: 8px;">暂无习题数据</p>
                </div>
            `;
    }

    html += `
                </div>
            </div>
        `;

    // 构建讨论风琴容器
    html += `
            <div class="accordion collapsed" id="accordion-discussion" style="margin-top: 8px;">
                <div class="accordion-header">
                    <div class="accordion-title">
                        <i class="fas fa-comments"></i>
                        <span>讨论</span>
                    </div>
                    <div class="accordion-stats">${discussionCompleted}/${discussionData.length}</div>
                    <i class="fas fa-chevron-down accordion-icon"></i>
                </div>
                <div class="accordion-content">
        `;

    if (discussionData.length > 0) {
      discussionData.forEach((item, index) => {
        const isCompleted =
          item.status.includes("已发言") || item.status.includes("已完成");
        html += `
                    <div class="item ${readOnly ? "readonly" : ""}" 
                         data-type="discussion" 
                         data-index="${index + 1}" 
                         ${readOnly ? 'data-readonly="true"' : ""}
                         style="animation-delay: ${index * 0.05}s; ${readOnly ? "cursor: not-allowed; opacity: 0.7;" : ""
          }">
                        <div class="item-number">${index + 1}</div>
                        <div class="item-title" title="${item.title}">${item.title
          }</div>
                        <div class="item-status">
                            <i class="fas ${isCompleted
            ? "fa-check-circle status-completed"
            : "fa-clock status-incomplete"
          }"></i>
                            <span class="status-text ${isCompleted
            ? "status-completed"
            : "status-incomplete"
          }">${item.status}</span>
                        </div>
                    </div>
                `;
      });
    } else {
      html += `
                <div class="empty-state" style="padding: 20px;">
                    <i class="fas fa-comment-dots" style="font-size: 32px;"></i>
                    <p style="font-size: 13px; margin-top: 8px;">暂无讨论数据</p>
                </div>
            `;
    }

    html += `
                </div>
            </div>
        `;

    // 关闭课程信息内容
    html += `</div>`;

    content.innerHTML = html;

    // 导航栏切换功能
    const navTabs = content.querySelectorAll(".nav-tab");
    const navIndicator = content.querySelector(".nav-indicator");

    // 初始化指示器位置
    function updateIndicator(index) {
      if (navIndicator) {
        const offset = index * 100; // 相对于自身宽度的位移，自身宽50%，所以移动100%就是移动到另一半
        navIndicator.style.transform = `translateX(${offset}%)`;
      }
    }

    // 设置初始位置（首页）
    updateIndicator(0);

    navTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        const targetTab = tab.dataset.tab;

        // 移除所有激活状态
        navTabs.forEach((t) => t.classList.remove("active"));
        content
          .querySelectorAll(".nav-content")
          .forEach((c) => c.classList.remove("active"));

        // 激活选中的标签和内容
        tab.classList.add("active");
        const targetContent = content.querySelector(`#${targetTab}-content`);
        if (targetContent) {
          targetContent.classList.add("active");
        }

        // 更新指示器位置
        updateIndicator(index);
      });
    });

    // 添加互斥展开逻辑
    const accordions = content.querySelectorAll(".accordion");
    accordions.forEach((accordion) => {
      const header = accordion.querySelector(".accordion-header");
      header.addEventListener("click", () => {
        const isCurrentlyCollapsed = accordion.classList.contains("collapsed");

        // 关闭所有风琴容器
        accordions.forEach((acc) => acc.classList.add("collapsed"));

        // 如果当前是收起状态，则展开
        if (isCurrentlyCollapsed) {
          accordion.classList.remove("collapsed");
        }
      });
    });

    // 为所有item添加点击事件，映射到实际元素 - 只读模式下禁用
    const items = content.querySelectorAll(".item[data-type]");
    items.forEach((item) => {
      item.addEventListener("click", () => {
        // 检查是否为只读模式
        if (item.getAttribute("data-readonly") === "true") {
          console.log("视频页面只读模式，点击已禁用");
          return;
        }

        const type = item.getAttribute("data-type");
        const index = item.getAttribute("data-index");

        // 使用通用点击函数
        clickTaskElement(type, index);
      });
    });

    // 为"下一个任务"卡片添加点击事件
    const nextTaskCard = content.querySelector(".next-task-card[data-type]");
    if (nextTaskCard && nextTaskCard.getAttribute("data-readonly") !== "true") {
      nextTaskCard.addEventListener("click", () => {
        const type = nextTaskCard.getAttribute("data-type");
        const index = nextTaskCard.getAttribute("data-index");

        // 使用通用点击函数
        clickTaskElement(type, index);
      });
    }

    // 为自动化切换按钮添加点击事件
    const automationToggleBtn = content.querySelector("#automation-toggle-btn");

    if (automationToggleBtn) {
      // 恢复复选框状态
      const autoExerciseCheckbox = content.querySelector(
        "#auto-exercise-checkbox"
      );
      const autoDiscussionCheckbox = content.querySelector(
        "#auto-discussion-checkbox"
      );

      if (autoExerciseCheckbox) {
        const savedState = localStorage.getItem("yuketang_auto_exercise") === "true";
        autoExerciseCheckbox.checked = savedState;
        // 如果已勾选，显示OCR卡片
      }
      if (autoDiscussionCheckbox) {
        const savedState = localStorage.getItem("yuketang_auto_discussion") === "true";
        autoDiscussionCheckbox.checked = savedState;
      }

      // 为自动化切换按钮添加事件
      automationToggleBtn.addEventListener("click", () => {
        const isActive = automationToggleBtn.classList.contains("active");

        if (isActive) {
          // 当前是运行状态，切换到暂停
          stopAutomation();
          automationToggleBtn.classList.remove("active");
          automationToggleBtn.innerHTML =
            '<i class="fas fa-play"></i><span>开始</span>';
          automationToggleBtn.title = "开始自动化";
          console.log("自动化已暂停");
        } else {
          // 当前是暂停状态，切换到运行
          automationToggleBtn.classList.add("active");
          automationToggleBtn.innerHTML =
            '<i class="fas fa-pause"></i><span>暂停</span>';
          automationToggleBtn.title = "暂停自动化";
          console.log("自动化已启动");

          // 开始自动化
          startAutomation();
        }
      });
    }
  }

  // 使面板可拖拽（优化性能版本）
  function makeDraggable(element) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    let currentX = 0,
      currentY = 0;
    const header = element.querySelector(".panel-header");

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;

      // 添加拖拽时的样式
      element.style.transition = "none";
      element.style.cursor = "grabbing";
      header.style.cursor = "grabbing";

      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();

      // 计算移动距离
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // 累加当前位置
      currentX -= pos1;
      currentY -= pos2;

      // 获取面板和窗口尺寸
      const panelRect = element.getBoundingClientRect();
      const panelWidth = panelRect.width;
      const panelHeight = panelRect.height;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // 获取元素的初始样式位置（computed style）
      const computedStyle = window.getComputedStyle(element);
      const initialTop = parseFloat(computedStyle.top) || 0;
      const initialRight = parseFloat(computedStyle.right) || 0;

      // 计算边界限制
      // 这里的 currentX/Y 是 transform 的值，是相对于初始位置的偏移量

      // 上边界：我们希望面板顶部最少为 0 (top + transformY >= 0)
      // 所以 transformY >= -top
      const minY = -initialTop;

      // 下边界：我们希望面板底部不超出窗口 (top + height + transformY <= windowHeight)
      // 所以 transformY <= windowHeight - top - height
      const maxY = windowHeight - initialTop - panelHeight;

      // 左边界：(right + width - transformX <= windowWidth) -> transformX >= right + width - windowWidth
      // 注意：这里左右拖拽逻辑是基于 right 定位的
      // 简单起见，且之前的逻辑 currentX 是负数向左移
      // minX 允许向左移动直到左边缘贴边：right + width + transformX = windowWidth (element left = 0)
      // 这里的坐标系有点绕，原代码是: minX = -(windowWidth - panelWidth - 20)
      // 假设 initialRight 是 20，那么 minX = -(windowWidth - panelWidth - 20) = 20 + panelWidth - windowWidth
      // 这实际上是：transformX >= -(windowWidth - initialRight - panelWidth)
      const minX = -(windowWidth - initialRight - panelWidth);

      // 右边界：允许稍微超出右边缘
      const maxX = initialRight;

      // 限制在边界内
      currentX = Math.max(minX, Math.min(currentX, maxX));
      currentY = Math.max(minY, Math.min(currentY, maxY));

      // 使用transform提升性能，避免触发重排
      requestAnimationFrame(() => {
        element.style.transform = `translate(${currentX}px, ${currentY}px)`;
      });
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;

      // 恢复样式
      element.style.cursor = "";
      header.style.cursor = "move";
      element.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    }
  }

  // 创建视频信息辅助面板
  function createVideoInfoPanel() {
    console.log("创建视频信息辅助面板...");

    // 检查是否已存在
    if (document.getElementById("yuketang-video-info-panel")) {
      console.log("视频信息面板已存在，跳过创建");
      return;
    }

    // 添加Font Awesome样式（如果未加载）
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const faLink = document.createElement("link");
      faLink.rel = "stylesheet";
      faLink.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      faLink.crossOrigin = "anonymous";
      document.head.appendChild(faLink);
    }

    // 创建面板容器
    const panel = document.createElement("div");
    panel.id = "yuketang-video-info-panel";
    panel.innerHTML = `
            <div class="video-panel-header">
                <div class="video-panel-title">
                    <i class="fas fa-video"></i>
                    <span>视频信息</span>
                </div>
                <div class="video-panel-controls">
                    <button class="video-panel-btn" id="video-refresh-btn" title="刷新">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="video-panel-btn" id="video-minimize-btn" title="最小化">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <div class="video-panel-content" id="video-panel-content">
                <div class="video-info-item">
                    <div class="video-info-label">
                        <i class="fas fa-chart-line"></i>
                        <span>完成情况</span>
                    </div>
                    <div class="video-info-value" id="video-completion-status">
                        <i class="fas fa-spinner fa-spin"></i> 加载中...
                    </div>
                </div>
                <div class="video-info-item">
                    <div class="video-info-label">
                        <i class="fas fa-play-circle"></i>
                        <span>视频播放</span>
                    </div>
                    <div class="video-playback-info">
                        <div class="video-time-display">
                            <span id="video-current-time">00:00</span>
                            <span class="time-separator">/</span>
                            <span id="video-total-time">00:00</span>
                        </div>
                        <div class="video-progress-bar">
                            <div class="video-progress-fill" id="video-progress-fill"></div>
                        </div>
                        <button class="video-control-btn" id="video-play-pause-btn">
                            <i class="fas fa-play"></i>
                            <span>播放</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

    // 添加样式
    const style = document.createElement("style");
    style.textContent = `
            #yuketang-video-info-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 350px;
                background: #1f2937;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                z-index: 999999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                overflow: hidden;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform;
                transform: translate(0, 0);
                border: 1px solid #374151;
            }

            #yuketang-video-info-panel.minimized {
                max-height: 60px;
            }

            #yuketang-video-info-panel.minimized .video-panel-content {
                opacity: 0;
                max-height: 0;
                overflow: hidden;
            }

            .video-panel-header {
                background: #111827;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                border-bottom: 1px solid #374151;
            }

            .video-panel-title {
                display: flex;
                align-items: center;
                gap: 8px;
                color: white;
                font-size: 15px;
                font-weight: 600;
            }

            .video-panel-title i {
                font-size: 16px;
                color: #818cf8;
            }

            .video-panel-controls {
                display: flex;
                gap: 6px;
            }

            .video-panel-btn {
                background: #374151;
                border: 1px solid #4b5563;
                width: 28px;
                height: 28px;
                border-radius: 5px;
                color: #e5e7eb;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease-in-out;
            }

            .video-panel-btn:hover {
                background: #4b5563;
                border-color: #6b7280;
            }

            .video-panel-btn:active {
                transform: scale(0.95);
            }

            .video-panel-content {
                padding: 16px;
                background: #1f2937;
                transition: opacity 0.4s ease-in-out, max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 1;
            }

            .video-info-item {
                background: #374151;
                border-radius: 8px;
                padding: 12px 14px;
                margin-bottom: 12px;
                border: 1px solid #4b5563;
                transition: all 0.3s ease-in-out;
            }

            .video-info-item:last-child {
                margin-bottom: 0;
            }

            .video-info-item:hover {
                background: #4b5563;
                border-color: #6b7280;
            }

            .video-info-label {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #9ca3af;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .video-info-label i {
                color: #818cf8;
                font-size: 13px;
            }

            .video-info-value {
                color: #f3f4f6;
                font-size: 18px;
                font-weight: 700;
                font-family: 'Courier New', monospace;
                letter-spacing: 1px;
            }

            .video-info-value i.fa-spinner {
                font-size: 14px;
                color: #818cf8;
            }

            .video-playback-info {
                margin-top: 8px;
            }

            .video-time-display {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-bottom: 12px;
                font-family: 'Courier New', monospace;
                font-size: 16px;
                font-weight: 700;
                color: #f3f4f6;
            }

            .time-separator {
                color: #6b7280;
                font-weight: 400;
            }

            .video-progress-bar {
                width: 100%;
                height: 6px;
                background: #374151;
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 12px;
                position: relative;
            }

            .video-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #6366f1, #818cf8);
                border-radius: 3px;
                width: 0%;
                transition: width 0.3s ease-in-out;
                box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
            }

            .video-control-btn {
                width: 100%;
                background: #6366f1;
                border: none;
                border-radius: 6px;
                color: white;
                padding: 10px 16px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s ease-in-out;
                box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
            }

            .video-control-btn:hover {
                background: #818cf8;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }

            .video-control-btn:active {
                transform: translateY(0);
            }

            .video-control-btn i {
                font-size: 14px;
            }

            .status-completed {
                color: #48bb78;
            }

            .status-incomplete {
                color: #f56565;
            }
        `;

    document.head.appendChild(style);
    document.body.appendChild(panel);

    console.log("视频信息面板已添加到页面");

    // 添加拖拽功能
    makeVideoPanelDraggable(panel);

    // 添加按钮事件
    document
      .getElementById("video-refresh-btn")
      .addEventListener("click", () => {
        updateVideoInfo();
      });

    document
      .getElementById("video-minimize-btn")
      .addEventListener("click", () => {
        panel.classList.toggle("minimized");
        const icon = document.querySelector("#video-minimize-btn i");
        icon.className = panel.classList.contains("minimized")
          ? "fas fa-plus"
          : "fas fa-minus";
      });

    // 播放/暂停按钮事件
    document
      .getElementById("video-play-pause-btn")
      .addEventListener("click", () => {
        // 方法1：直接控制HTML5 video元素（最可靠）
        const videoElement = document.querySelector("video");

        if (videoElement) {
          console.log(
            "找到video元素，当前状态:",
            videoElement.paused ? "暂停" : "播放中"
          );

          if (videoElement.paused) {
            videoElement
              .play()
              .then(() => {
                console.log("视频已开始播放");
                setTimeout(updateVideoInfo, 300);
              })
              .catch((e) => {
                console.error("播放失败:", e);
              });
          } else {
            videoElement.pause();
            console.log("视频已暂停");
            setTimeout(updateVideoInfo, 300);
          }
          return;
        }

        // 方法2：备用方案 - 尝试点击播放按钮
        const playBtn = document.querySelector("button.xt_video_bit_play_btn");
        if (playBtn) {
          console.log("找到播放按钮，元素:", playBtn);
          try {
            playBtn.dispatchEvent(
              new MouseEvent("mousedown", { bubbles: true, cancelable: true })
            );
            playBtn.dispatchEvent(
              new MouseEvent("mouseup", { bubbles: true, cancelable: true })
            );
            playBtn.click();
            console.log("已触发播放/暂停按钮");
          } catch (e) {
            console.error("触发播放按钮失败:", e);
          }
          setTimeout(updateVideoInfo, 300);
          return;
        }

        // 方法3：最后尝试键盘事件（空格键）
        console.log("尝试空格键事件控制播放");
        const controlsLayer = document.querySelector(
          ".xt_video_player_controls_layer"
        );
        if (controlsLayer) {
          const spaceEvent = new KeyboardEvent("keydown", {
            key: " ",
            code: "Space",
            keyCode: 32,
            bubbles: true,
            cancelable: true,
          });
          document.dispatchEvent(spaceEvent);
          setTimeout(updateVideoInfo, 300);
        } else {
          console.log("未找到任何可用的控制方式");
        }
      });

    // 开始更新视频信息
    updateVideoInfo();

    // 定时更新视频信息（每秒更新一次）
    setInterval(updateVideoInfo, 1000);

    // 自动播放功能：监听视频暂停事件，暂停时自动播放
    const setupAutoPlay = () => {
      const videoElement = document.querySelector("video");
      if (videoElement) {
        console.log("已找到video元素，启动自动播放监听");

        // 设置视频静音
        videoElement.muted = true;
        console.log("视频已设置为静音");

        // 如果视频当前是暂停状态，立即尝试播放（处理初始状态）
        if (videoElement.paused) {
          console.log("视频初始状态为暂停，尝试自动播放...");
          setTimeout(() => {
            videoElement
              .play()
              .then(() => {
                console.log("初始自动播放成功（静音模式）");
              })
              .catch((e) => {
                console.error("初始自动播放失败:", e);
              });
          }, 500);
        }

        // 监听暂停事件
        videoElement.addEventListener("pause", () => {
          console.log("检测到视频暂停，自动恢复播放...");
          setTimeout(() => {
            if (videoElement.paused) {
              videoElement
                .play()
                .then(() => {
                  console.log("自动播放成功");
                })
                .catch((e) => {
                  console.error("自动播放失败:", e);
                });
            }
          }, 100);
        });

        console.log("自动播放监听已启动");
      } else {
        console.log("未找到video元素，1秒后重试...");
        setTimeout(setupAutoPlay, 1000);
      }
    };

    // 延迟启动自动播放（等待视频加载）
    setTimeout(setupAutoPlay, 1000);
  }

  // 更新视频信息
  function updateVideoInfo() {
    // 1. 完成情况
    const completionElement = document.querySelector(".el-tooltip > .text");
    const completionStatus = document.getElementById("video-completion-status");
    if (completionElement && completionStatus) {
      const statusText = completionElement.textContent.trim();
      const isCompleted =
        statusText.includes("100%") || statusText.includes("已完成");
      completionStatus.innerHTML = `
                <i class="fas ${isCompleted
          ? "fa-check-circle status-completed"
          : "fa-clock status-incomplete"
        }"></i>
                <span class="${isCompleted ? "status-completed" : "status-incomplete"
        }">${statusText}</span>
            `;

      // 检测视频是否完成，如果完成则关闭当前标签页
      if (isCompleted && !videoCompletedTriggered) {
        videoCompletedTriggered = true;
        console.log("视频已完成，准备保存状态并关闭当前标签页...");

        // 获取当前视频索引
        const videoIndex = localStorage.getItem("yuketang_current_video_index");

        if (videoIndex) {
          // 保存完成状态到localStorage
          const completionData = {
            videoIndex: parseInt(videoIndex),
            timestamp: Date.now(),
            status: "已完成",
          };
          localStorage.setItem(
            "yuketang_video_completed",
            JSON.stringify(completionData)
          );
          console.log("已保存视频完成状态:", completionData);
        }

        // 延迟2秒后关闭，给用户一个提示时间
        setTimeout(() => {
          console.log("视频已完成，正在关闭当前标签页并返回课程页面...");

          // 尝试关闭当前标签页
          window.close();

          // 如果无法关闭（浏览器限制），则尝试返回上一页
          setTimeout(() => {
            if (window.history.length > 1) {
              console.log("无法自动关闭标签页，尝试返回上一页...");
              window.history.back();
            } else {
              console.log("无法自动关闭标签页，请手动关闭");
              // 不再显示alert，使用Toast提示
              showToast(
                '<i class="fas fa-check-circle"></i> 视频已完成！请手动关闭此标签页'
              );
            }
          }, 1000);
        }, 2000);
      }
    }

    // 2. 视频播放实时时间进度
    const currentTimeElement = document.querySelector("span.white");
    const currentTimeDisplay = document.getElementById("video-current-time");
    if (currentTimeElement && currentTimeDisplay) {
      currentTimeDisplay.textContent = currentTimeElement.textContent.trim();
    }

    // 3. 视频总时长
    const totalTimeElement = document.querySelector(
      ".xt_video_player_current_time_display > span:nth-child(2)"
    );
    const totalTimeDisplay = document.getElementById("video-total-time");
    if (totalTimeElement && totalTimeDisplay) {
      totalTimeDisplay.textContent = totalTimeElement.textContent.trim();
    }

    // 4. 更新进度条
    const progressFill = document.getElementById("video-progress-fill");
    if (currentTimeElement && totalTimeElement && progressFill) {
      const currentTime = parseTime(currentTimeElement.textContent.trim());
      const totalTime = parseTime(totalTimeElement.textContent.trim());
      if (totalTime > 0) {
        const progress = (currentTime / totalTime) * 100;
        progressFill.style.width = `${Math.min(progress, 100)}%`;
      }
    }

    // 5. 更新播放按钮状态（通过 pause_show 类判断）
    const playLayer = document.querySelector(".xt_video_player_big_play_layer");
    const playPauseBtn = document.getElementById("video-play-pause-btn");
    if (playLayer && playPauseBtn) {
      const isPaused = playLayer.classList.contains("pause_show");
      playPauseBtn.innerHTML = isPaused
        ? '<i class="fas fa-play"></i><span>播放</span>'
        : '<i class="fas fa-pause"></i><span>暂停</span>';
    }
  }

  // 解析时间字符串为秒数
  function parseTime(timeStr) {
    const parts = timeStr.split(":").map((p) => parseInt(p) || 0);
    if (parts.length === 2) {
      // MM:SS
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }

  // 使视频面板可拖拽
  function makeVideoPanelDraggable(element) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    let currentX = 0,
      currentY = 0;
    const header = element.querySelector(".video-panel-header");

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;

      element.style.transition = "none";
      element.style.cursor = "grabbing";
      header.style.cursor = "grabbing";

      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();

      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      currentX -= pos1;
      currentY -= pos2;

      const panelRect = element.getBoundingClientRect();
      const panelWidth = panelRect.width;
      const panelHeight = panelRect.height;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const minX = -(windowWidth - panelWidth - 20);
      const maxX = 20;
      const minY = -20;
      const maxY = windowHeight - panelHeight - 20;

      currentX = Math.max(minX, Math.min(currentX, maxX));
      currentY = Math.max(minY, Math.min(currentY, maxY));

      requestAnimationFrame(() => {
        element.style.transform = `translate(${currentX}px, ${currentY}px)`;
      });
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;

      element.style.cursor = "";
      header.style.cursor = "move";
      element.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    }
  }

  // 通用点击函数 - 复用风琴容器的点击逻辑
  function clickTaskElement(type, index) {
    console.log(`========== 点击任务元素 ==========`);
    console.log(`类型: ${type}, 索引: ${index}`);

    // 保存索引到localStorage
    if (type === "video") {
      localStorage.setItem("yuketang_current_video_index", index);
      console.log("💾 保存当前视频索引:", index);
    } else if (type === "exercise") {
      localStorage.setItem("yuketang_current_exercise_index", index);
      console.log("💾 保存当前习题索引:", index);
    } else if (type === "discussion") {
      localStorage.setItem("yuketang_current_discussion_index", index);
      console.log("💾 保存当前讨论索引:", index);
      console.log("📌 localStorage 中的值:", localStorage.getItem("yuketang_current_discussion_index"));
    }

    let selector = "";
    if (type === "video") {
      selector = `.list-detail:nth-child(2) .study-unit:nth-child(${index})`;
    } else if (type === "exercise") {
      selector = `.list-detail:nth-child(4) .study-unit:nth-child(${index})`;
    } else if (type === "discussion") {
      selector = `.list-detail:nth-child(3) .study-unit:nth-child(${index})`;
    }

    if (selector) {
      const targetElement = document.querySelector(selector);
      if (targetElement) {
        // 滚动到目标元素
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // 添加高亮效果
        targetElement.style.transition = "background-color 0.3s";
        const originalBg = targetElement.style.backgroundColor;
        targetElement.style.backgroundColor = "#818cf8";

        // 延迟后点击元素内部的可点击部分
        setTimeout(() => {
          // 尝试找到可点击的子元素（如标题链接）
          const clickableElement =
            targetElement.querySelector(".name-text") ||
            targetElement.querySelector("a") ||
            targetElement;

          clickableElement.click();
          console.log(`已点击元素: ${selector}`, clickableElement);
        }, 300);

        setTimeout(() => {
          targetElement.style.backgroundColor = originalBg;
          setTimeout(() => {
            targetElement.style.transition = "";
          }, 300);
        }, 800);

        return true;
      } else {
        console.log(`未找到目标元素: ${selector}`);
        return false;
      }
    }
    return false;
  }

  // 开始自动化
  function startAutomation() {
    if (automationRunning) {
      console.log("自动化已在运行中");
      return;
    }

    automationRunning = true;
    console.log("开始自动化执行...");
    showToast('<i class="fas fa-rocket"></i> 自动化已启动');

    // 立即执行一次
    executeNextTask();

    // 每5秒检查一次是否需要执行下一个任务
    automationInterval = setInterval(() => {
      if (automationRunning) {
        executeNextTask();
      }
    }, 5000);
  }

  // 停止自动化
  function stopAutomation() {
    automationRunning = false;
    if (automationInterval) {
      clearInterval(automationInterval);
      automationInterval = null;
    }
    console.log("自动化已停止");
  }

  // 执行下一个任务
  function executeNextTask() {
    // 从 localStorage 加载数据
    let data;
    try {
      const storedData = localStorage.getItem("yuketang_helper_data");
      if (storedData) {
        data = JSON.parse(storedData);
      }
    } catch (e) {
      console.error("加载数据失败:", e);
      showToast('<i class="fas fa-times-circle"></i> 加载数据失败');
      return;
    }

    if (!data || (!data.video && !data.exercise && !data.discussion)) {
      console.log("没有数据，停止自动化");
      showToast(
        '<i class="fas fa-exclamation-triangle"></i> 没有可执行的任务数据'
      );
      stopAutomation();
      return;
    }

    const videoData = data.video || [];
    const exerciseData = data.exercise || [];
    const discussionData = data.discussion || [];

    // 获取复选框状态
    const autoExercise =
      localStorage.getItem("yuketang_auto_exercise") === "true";
    const autoDiscussion =
      localStorage.getItem("yuketang_auto_discussion") === "true";

    console.log(
      "自动化配置: 视频=true, 习题=" + autoExercise + ", 讨论=" + autoDiscussion
    );

    let nextIncomplete = null;

    // 先检查视频（默认总是启用）
    for (let i = 0; i < videoData.length; i++) {
      const isCompleted =
        videoData[i].status.includes("已完成") ||
        videoData[i].status.includes("100%");
      if (!isCompleted) {
        nextIncomplete = {
          type: "video",
          index: i + 1,
          title: videoData[i].title,
        };
        break;
      }
    }

    // 如果视频都完成了，且启用了习题，检查习题
    if (!nextIncomplete && autoExercise) {
      for (let i = 0; i < exerciseData.length; i++) {
        const isCompleted =
          exerciseData[i].status.includes("已完成") ||
          exerciseData[i].status.includes("100%");
        if (!isCompleted) {
          nextIncomplete = {
            type: "exercise",
            index: i + 1,
            title: exerciseData[i].title,
          };
          break;
        }
      }
    }

    // 如果习题也都完成了，且启用了讨论，检查讨论
    if (!nextIncomplete && autoDiscussion) {
      for (let i = 0; i < discussionData.length; i++) {
        const isCompleted =
          discussionData[i].status.includes("已发言") ||
          discussionData[i].status.includes("已完成");
        if (!isCompleted) {
          nextIncomplete = {
            type: "discussion",
            index: i + 1,
            title: discussionData[i].title,
          };
          break;
        }
      }
    }

    if (!nextIncomplete) {
      console.log("所有任务已完成，停止自动化");
      showToast('<i class="fas fa-trophy"></i> 所有任务已完成！');
      stopAutomation();
      lastClickedTask = null; // 重置记录
      // 更新按钮状态
      const automationToggleBtn = document.querySelector(
        "#automation-toggle-btn"
      );
      if (automationToggleBtn) {
        automationToggleBtn.classList.remove("active");
        automationToggleBtn.innerHTML =
          '<i class="fas fa-play"></i><span>开始</span>';
        automationToggleBtn.title = "开始自动化";
      }
      return;
    }

    // 检查是否是同一个任务，避免重复点击
    const taskKey = `${nextIncomplete.type}-${nextIncomplete.index}`;
    if (lastClickedTask === taskKey) {
      console.log("任务已点击，等待完成:", taskKey);
      return; // 不重复点击同一个任务
    }

    console.log("下一个任务:", nextIncomplete);

    // 使用通用点击函数
    const success = clickTaskElement(nextIncomplete.type, nextIncomplete.index);

    if (success) {
      lastClickedTask = taskKey; // 记录已点击的任务
      console.log("已点击任务:", taskKey);
    } else {
      console.log("点击失败，未找到目标元素");
      showToast('<i class="fas fa-exclamation-triangle"></i> 未找到目标任务');
    }
  }

  // Toast 队列管理
  const toastQueue = [];
  const MAX_TOASTS = 3;

  // 显示Toast提示（支持多条堆叠）
  function showToast(message, duration = 2000) {
    // 创建新toast
    const toast = document.createElement("div");
    toast.className = "yuketang-toast";

    // 解析消息，将emoji转换为Font Awesome图标
    const iconMap = {
      "🚀": '<i class="fas fa-rocket"></i>',
      "🎉": '<i class="fas fa-trophy"></i>',
      "⚠️": '<i class="fas fa-exclamation-triangle"></i>',
      "❌": '<i class="fas fa-times-circle"></i>',
    };

    let processedMessage = message;
    for (const [emoji, icon] of Object.entries(iconMap)) {
      processedMessage = processedMessage.replace(emoji, icon);
    }

    toast.innerHTML = processedMessage;

    // 先添加到页面
    document.body.appendChild(toast);

    // 添加到队列
    toastQueue.unshift(toast);

    // 如果超过最大数量，移除最旧的
    if (toastQueue.length > MAX_TOASTS) {
      const oldestToast = toastQueue.pop();
      if (oldestToast && oldestToast.parentNode) {
        oldestToast.classList.add("fade-out");
        setTimeout(() => {
          if (oldestToast.parentNode) {
            oldestToast.remove();
          }
        }, 300);
      }
    }

    // 更新所有 Toast 的层级样式（使用 RAF 确保 DOM 已渲染）
    requestAnimationFrame(() => {
      updateToastLevels();
    });

    // 设置自动移除
    const removeTimer = setTimeout(() => {
      const index = toastQueue.indexOf(toast);
      if (index > -1) {
        toast.classList.add("fade-out");
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
          // 从队列中移除
          const currentIndex = toastQueue.indexOf(toast);
          if (currentIndex > -1) {
            toastQueue.splice(currentIndex, 1);
            updateToastLevels();
          }
        }, 300);
      }
    }, duration);

    // 存储定时器引用，方便提前清除
    toast._removeTimer = removeTimer;
  }

  // 更新所有 Toast 的层级样式
  function updateToastLevels() {
    toastQueue.forEach((toast, index) => {
      // 只更新还在 DOM 中的 Toast
      if (!toast || !toast.parentNode) return;

      // 移除所有层级类
      toast.classList.remove("toast-level-0", "toast-level-1", "toast-level-2");

      // 添加新的层级类
      if (index < MAX_TOASTS) {
        toast.classList.add(`toast-level-${index}`);
      }
    });
  }



  // 显示确认模态框
  function showConfirmModal(title, message, onConfirm, onCancel) {
    // 移除已存在的模态框
    const existingModal = document.querySelector(".yuketang-modal-overlay");
    if (existingModal) {
      existingModal.remove();
    }

    // 创建模态框
    const overlay = document.createElement("div");
    overlay.className = "yuketang-modal-overlay show";

    overlay.innerHTML = `
      <div class="yuketang-modal">
        <div class="yuketang-modal-header">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>${title}</h3>
        </div>
        <div class="yuketang-modal-body">
          ${message}
        </div>
        <div class="yuketang-modal-footer">
          <button class="yuketang-modal-btn yuketang-modal-btn-cancel">取消</button>
          <button class="yuketang-modal-btn yuketang-modal-btn-confirm">确认</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // 强制设置内联样式确保可见
    overlay.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0, 0, 0, 0.75) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 2147483647 !important;
      pointer-events: auto !important;
    `;

    // 绑定事件
    const cancelBtn = overlay.querySelector(".yuketang-modal-btn-cancel");
    const confirmBtn = overlay.querySelector(".yuketang-modal-btn-confirm");

    const closeModal = () => {
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 300);
    };

    cancelBtn.addEventListener("click", () => {
      closeModal();
      if (onCancel) onCancel();
    });

    confirmBtn.addEventListener("click", () => {
      closeModal();
      if (onConfirm) onConfirm();
    });

    // 点击背景关闭
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal();
        if (onCancel) onCancel();
      }
    });
  }

  // ==================== AI讨论助手功能 ====================

  // 创建AI设置面板
  function createAISettingsPanel() {
    const overlay = document.createElement("div");
    overlay.id = "ai-settings-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.75);
      z-index: 999999;
      backdrop-filter: blur(4px);
    `;

    const panel = document.createElement("div");
    panel.id = "ai-settings-panel";
    panel.innerHTML = `
      <div class="ai-settings-header">
        <span><i class="fas fa-cog"></i> AI助手设置</span>
        <button class="ai-settings-close" id="ai-settings-close-btn"><i class="fas fa-times"></i></button>
      </div>
      <div class="ai-settings-body">
        <div class="ai-info-box">
          <i class="fas fa-lightbulb"></i> <strong>免费额度提示：</strong>新用户可以申请 <strong>2000万 tokens</strong> 的免费额度！<br>
          <i class="fas fa-hand-point-right"></i> <a href="${AI_INVITE_LINK}" target="_blank">点击这里申请免费额度</a>
        </div>
        <div class="ai-form-group">
          <label class="ai-form-label"><i class="fas fa-key"></i> 智谱 AI API Key</label>
          <input type="text" class="ai-form-input" id="ai-api-key-input" 
                 placeholder="请输入你的 API Key" value="${GM_getValue(
      AI_CONFIG_KEY,
      ""
    )}">
        </div>
        <div class="ai-info-box">
          <i class="fas fa-book"></i> <strong>如何获取 API Key：</strong><br>
          1. 访问 <a href="${AI_INVITE_LINK}" target="_blank">智谱开放平台（含免费额度）</a><br>
          2. 注册/登录账号<br>
          3. 进入"API Keys"页面创建新的 API Key<br>
          4. 复制 API Key 并粘贴到上方输入框
        </div>
      </div>
      <div class="ai-settings-footer">
        <button class="ai-settings-btn secondary" id="ai-settings-cancel-btn">
          <i class="fas fa-times-circle"></i> 取消
        </button>
        <button class="ai-settings-btn primary" id="ai-settings-save-btn">
          <i class="fas fa-save"></i> 保存
        </button>
      </div>
    `;

    // 添加设置面板样式
    const style = document.createElement("style");
    style.textContent = `
      #ai-settings-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        background: #1a1a2e;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
        z-index: 1000000;
        padding: 24px;
        border: 1px solid #2d2d44;
      }

      .ai-settings-header {
        font-size: 18px;
        font-weight: 600;
        color: #e0e0e0;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 12px;
        border-bottom: 1px solid #2d2d44;
      }

      .ai-settings-header span {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ai-settings-close {
        width: 32px;
        height: 32px;
        border: none;
        background: #2d2d44;
        border-radius: 4px;
        cursor: pointer;
        font-size: 20px;
        color: #b0b0b0;
        transition: background 0.2s, color 0.2s;
      }

      .ai-settings-close:hover {
        background: #3d3d54;
        color: #ffffff;
      }

      .ai-settings-body {
        margin-bottom: 20px;
      }

      .ai-form-group {
        margin-bottom: 16px;
      }

      .ai-form-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #b0b0b0;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .ai-form-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #2d2d44;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.2s;
        box-sizing: border-box;
        background: #0f0f1e;
        color: #e0e0e0;
      }

      .ai-form-input:focus {
        outline: none;
        border-color: #4a9eff;
      }

      .ai-info-box {
        background: #16213e;
        border-left: 3px solid #4a9eff;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 16px;
        font-size: 13px;
        line-height: 1.6;
        color: #b0b0b0;
      }

      .ai-info-box a {
        color: #4a9eff;
        text-decoration: none;
        font-weight: 600;
      }

      .ai-info-box a:hover {
        text-decoration: underline;
        color: #3d8ee6;
      }

      .ai-settings-footer {
        display: flex;
        gap: 12px;
      }

      .ai-settings-btn {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .ai-settings-btn.primary {
        background: #4a9eff;
        color: #ffffff;
      }

      .ai-settings-btn.primary:hover {
        background: #3d8ee6;
      }

      .ai-settings-btn.secondary {
        background: #2d2d44;
        color: #b0b0b0;
      }

      .ai-settings-btn.secondary:hover {
        background: #3d3d54;
        color: #ffffff;
      }
    `;
    document.head.appendChild(style);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // 绑定事件
    document
      .getElementById("ai-settings-close-btn")
      .addEventListener("click", () => {
        overlay.remove();
      });

    document
      .getElementById("ai-settings-cancel-btn")
      .addEventListener("click", () => {
        overlay.remove();
      });

    document
      .getElementById("ai-settings-save-btn")
      .addEventListener("click", () => {
        const apiKey = document.getElementById("ai-api-key-input").value.trim();
        if (apiKey) {
          GM_setValue(AI_CONFIG_KEY, apiKey);
          showToast('<i class="fas fa-check-circle"></i> API Key 保存成功！');
          overlay.remove();
        } else {
          showToast(
            '<i class="fas fa-exclamation-triangle"></i> 请输入有效的 API Key'
          );
        }
      });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  // 创建欢迎模态框
  function showAIWelcomeModal() {
    const overlay = document.createElement("div");
    overlay.id = "ai-welcome-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      z-index: 1000000;
      backdrop-filter: blur(4px);
    `;

    const modal = document.createElement("div");
    modal.id = "ai-welcome-modal";
    modal.innerHTML = `
      <div class="ai-welcome-header">
        <i class="fas fa-robot"></i>
        <h2>欢迎使用 AI 助手</h2>
      </div>
      <div class="ai-welcome-body">
        <div class="ai-welcome-message">
          <p><i class="fas fa-hand-sparkles"></i> 您好！感谢使用 AI 讨论助手。</p>
          <p>在开始使用之前，请先配置智谱 AI 的 API Key。</p>
        </div>
        <div class="ai-welcome-features">
          <h3><i class="fas fa-gift"></i> 免费额度</h3>
          <ul>
            <li>新用户可免费申请 <strong>2000万 tokens</strong> 额度</li>
            <li>足够处理大量讨论题目</li>
            <li>完全免费，无需付费</li>
          </ul>
        </div>
        <div class="ai-welcome-footer">
          <button class="ai-welcome-btn primary" id="ai-welcome-ok-btn">
            <i class="fas fa-cog"></i> 立即配置
          </button>
        </div>
      </div>
    `;

    // 添加欢迎模态框样式
    const style = document.createElement("style");
    style.textContent = `
      #ai-welcome-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 450px;
        background: #1a1a2e;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
        z-index: 1000001;
        padding: 0;
        border: 1px solid #2d2d44;
        overflow: hidden;
      }

      .ai-welcome-header {
        background: linear-gradient(135deg, #4a9eff 0%, #3d8ee6 100%);
        padding: 24px;
        text-align: center;
      }

      .ai-welcome-header i {
        font-size: 48px;
        color: #ffffff;
        margin-bottom: 12px;
        display: block;
      }

      .ai-welcome-header h2 {
        margin: 0;
        color: #ffffff;
        font-size: 24px;
        font-weight: 600;
      }

      .ai-welcome-body {
        padding: 24px;
      }

      .ai-welcome-message {
        color: #d0d0d0;
        font-size: 15px;
        line-height: 1.8;
        margin-bottom: 20px;
      }

      .ai-welcome-message p {
        margin: 0 0 12px 0;
      }

      .ai-welcome-features {
        background: #16213e;
        border-left: 3px solid #4a9eff;
        padding: 16px;
        border-radius: 4px;
        margin-bottom: 20px;
      }

      .ai-welcome-features h3 {
        margin: 0 0 12px 0;
        color: #4a9eff;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ai-welcome-features ul {
        margin: 0;
        padding-left: 20px;
        color: #b0b0b0;
        font-size: 13px;
        line-height: 1.8;
      }

      .ai-welcome-features li {
        margin-bottom: 6px;
      }

      .ai-welcome-footer {
        display: flex;
        gap: 12px;
      }

      .ai-welcome-btn {
        flex: 1;
        padding: 14px;
        border: none;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .ai-welcome-btn.primary {
        background: #4a9eff;
        color: #ffffff;
      }

      .ai-welcome-btn.primary:hover {
        background: #3d8ee6;
      }
    `;
    document.head.appendChild(style);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 绑定事件
    document
      .getElementById("ai-welcome-ok-btn")
      .addEventListener("click", () => {
        overlay.remove();
        createAISettingsPanel();
      });

    // 点击遮罩层也可以关闭（但会打开设置）
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        createAISettingsPanel();
      }
    });
  }

  // 清理AI答案中的Markdown格式
  function cleanAIAnswer(text) {
    if (!text) return text;
    return text
      .replace(/^```[\s\S]*?\n/, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      .replace(/!\[.*?\]\(.+?\)/g, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`(.+?)`/g, "$1")
      .replace(/^>\s+/gm, "")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  // 调用智谱AI API
  function callAIAPI(question, callback) {
    const apiKey = GM_getValue(AI_CONFIG_KEY, "");
    if (!apiKey) {
      callback({ success: false, error: "请先配置API Key" });
      return;
    }

    const prompt = `请用中文简洁地回答以下问题。要求：
1. 直接给出答案，不要有开场白或总结
2. 使用纯文本格式，不要使用任何Markdown标记
3. 如果是选择题，直接给出选项和简短解释
4. 保持答案简洁明了

问题：${question}`;

    GM_xmlhttpRequest({
      method: "POST",
      url: AI_API_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      data: JSON.stringify({
        model: "glm-4-air",
        messages: [{ role: "user", content: prompt }],
      }),
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          if (data.choices && data.choices[0] && data.choices[0].message) {
            const rawAnswer = data.choices[0].message.content;
            const cleanedAnswer = cleanAIAnswer(rawAnswer);
            callback({ success: true, answer: cleanedAnswer });
          } else {
            callback({ success: false, error: "API返回数据格式错误" });
          }
        } catch (e) {
          callback({ success: false, error: "解析响应失败: " + e.message });
        }
      },
      onerror: function () {
        callback({ success: false, error: "网络请求失败" });
      },
    });
  }

  // 创建AI助手面板
  function createAIAssistantPanel() {
    // 保存讨论状态监测定时器ID
    let discussionStatusIntervalId = null;

    // 添加Font Awesome样式（如果未加载）
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const faLink = document.createElement("link");
      faLink.rel = "stylesheet";
      faLink.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      faLink.crossOrigin = "anonymous";
      document.head.appendChild(faLink);
    }

    const panel = document.createElement("div");
    panel.id = "ai-assistant-panel";
    panel.innerHTML = `
      <div class="panel-header">
        <div class="panel-title"><i class="fas fa-robot"></i> AI 讨论助手</div>
        <div class="panel-controls">
          <button class="panel-btn" id="ai-settings-btn" title="设置"><i class="fas fa-cog"></i></button>
          <button class="panel-btn" id="ai-minimize-btn" title="最小化"><i class="fas fa-minus"></i></button>
        </div>
      </div>
      <div class="panel-content">
        <div style="padding: 12px; height: 100%; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;">
          <!-- 完成状态 -->
          <div style="background: #374151; padding: 10px; border-radius: 6px; border: 1px solid #4b5563;">
            <div style="display: flex; align-items: center; gap: 8px; color: #9ca3af; font-size: 12px; font-weight: 600; margin-bottom: 6px;">
              <i class="fas fa-chart-line" style="color: #818cf8;"></i>
              <span>完成状态</span>
            </div>
            <div id="ai-completion-status" style="color: #f3f4f6; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-spinner fa-spin"></i> 检测中...
            </div>
          </div>
          
          <!-- 题目内容 -->
          <div style="background: #374151; padding: 10px; border-radius: 6px; border: 1px solid #4b5563;">
            <div style="display: flex; align-items: center; gap: 8px; color: #9ca3af; font-size: 12px; font-weight: 600; margin-bottom: 6px;">
              <i class="fas fa-file-alt" style="color: #10b981;"></i>
              <span>题目内容</span>
            </div>
            <div id="ai-question-text" style="color: #d1d5db; font-size: 13px; line-height: 1.6; max-height: 150px; overflow-y: auto;">
              暂无题目
            </div>
          </div>
          
          <!-- AI答案 -->
          <div style="background: #374151; padding: 10px; border-radius: 6px; border: 1px solid #4b5563; flex: 1; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; gap: 8px; color: #9ca3af; font-size: 12px; font-weight: 600; margin-bottom: 6px;">
              <i class="fas fa-brain" style="color: #f59e0b;"></i>
              <span>AI 答案</span>
            </div>
            <div id="ai-answer-text" style="color: #d1d5db; font-size: 13px; line-height: 1.6; flex: 1; overflow-y: auto; min-height: 100px;">
              点击"获取答案"按钮
            </div>
          </div>
          
          <!-- 状态消息 -->
          <div id="ai-status-message" class="status-message"></div>
          
          <!-- 操作按钮 -->
          <div style="display: flex; gap: 8px;">
            <button class="action-btn" id="ai-get-answer-btn" style="background: linear-gradient(135deg, #667eea, #764ba2); flex: 1;">
              <i class="fas fa-magic"></i> 获取答案
            </button>
            <button class="action-btn" id="ai-confirm-complete-btn" style="background: linear-gradient(135deg, #10b981, #059669); flex: 1;">
              <i class="fas fa-check-circle"></i> 确认完成
            </button>
          </div>
        </div>
      </div>
    `;

    // AI助手样式（与OCR面板统一）
    const style = document.createElement("style");
    style.textContent = `
      #ai-assistant-panel {
        position: fixed;
        top: 100px;
        right: 20px;
        width: 380px;
        height: 500px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        z-index: 999999;
        font-family: 'Microsoft YaHei', sans-serif;
        overflow: hidden;
        border: 1px solid rgba(74, 158, 255, 0.2);
        display: flex;
        flex-direction: column;
      }
      #ai-assistant-panel .panel-header {
        background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        border-bottom: 1px solid rgba(74, 158, 255, 0.3);
        flex-shrink: 0;
      }
      #ai-assistant-panel .panel-title {
        color: #e0e0e0;
        font-weight: 600;
        font-size: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #ai-assistant-panel .panel-controls {
        display: flex;
        gap: 6px;
      }
      #ai-assistant-panel .panel-btn {
        width: 26px;
        height: 26px;
        border: none;
        background: rgba(74, 158, 255, 0.1);
        color: #b0b0b0;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #ai-assistant-panel .panel-btn:hover {
        background: rgba(74, 158, 255, 0.2);
        color: #ffffff;
        transform: scale(1.05);
      }
      #ai-assistant-panel .panel-content {
        flex: 1;
        overflow: hidden;
      }
      #ai-assistant-panel .panel-content > div {
        height: 100%;
      }
      #ai-assistant-panel .panel-content ::-webkit-scrollbar {
        width: 6px;
      }
      #ai-assistant-panel .panel-content ::-webkit-scrollbar-track {
        background: #16213e;
        border-radius: 3px;
      }
      #ai-assistant-panel .panel-content ::-webkit-scrollbar-thumb {
        background: #4a9eff;
        border-radius: 3px;
      }
      #ai-assistant-panel .panel-content ::-webkit-scrollbar-thumb:hover {
        background: #3d8ee6;
      }
      #ai-assistant-panel #ai-question-text::-webkit-scrollbar,
      #ai-assistant-panel #ai-answer-text::-webkit-scrollbar {
        width: 4px;
      }
      #ai-assistant-panel #ai-question-text::-webkit-scrollbar-track,
      #ai-assistant-panel #ai-answer-text::-webkit-scrollbar-track {
        background: #2d2d44;
        border-radius: 2px;
      }
      #ai-assistant-panel #ai-question-text::-webkit-scrollbar-thumb,
      #ai-assistant-panel #ai-answer-text::-webkit-scrollbar-thumb {
        background: #4a9eff;
        border-radius: 2px;
      }
      #ai-assistant-panel .action-btn {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s;
        color: #ffffff;
      }
      #ai-assistant-panel .action-btn:hover {
        box-shadow: 0 4px 12px rgba(74, 158, 255, 0.4);
      }
      #ai-assistant-panel .action-btn:active {
        transform: translateY(0);
      }
      #ai-assistant-panel .status-message {
        margin-bottom: 8px;
        padding: 10px;
        border-radius: 8px;
        font-size: 13px;
        display: none;
        animation: fadeIn 0.3s;
      }
      #ai-assistant-panel .status-message.success {
        background: rgba(46, 204, 113, 0.15);
        color: #2ecc71;
        border: 1px solid rgba(46, 204, 113, 0.3);
        display: block;
      }
      #ai-assistant-panel .status-message.error {
        background: rgba(231, 76, 60, 0.15);
        color: #e74c3c;
        border: 1px solid rgba(231, 76, 60, 0.3);
        display: block;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    // 阻止面板右键菜单
    panel.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    document.body.appendChild(panel);

    // 绑定事件
    document
      .getElementById("ai-get-answer-btn")
      .addEventListener("click", getAIAnswer);
    document.getElementById("ai-minimize-btn").addEventListener("click", () => {
      const content = panel.querySelector(".panel-content");
      content.style.display =
        content.style.display === "none" ? "block" : "none";
    });
    document.getElementById("ai-settings-btn").addEventListener("click", () => {
      createAISettingsPanel();
    });

    // 绑定确认完成按钮（添加二次确认）
    document.getElementById("ai-confirm-complete-btn").addEventListener("click", () => {
      console.log("用户点击确认完成");

      // 创建确认模态框
      const overlay = document.createElement("div");
      overlay.id = "confirmation-modal-overlay";
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        animation: modal-fade-in 0.2s ease-out;
      `;

      const modalBox = document.createElement("div");
      modalBox.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        padding: 32px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(74, 158, 255, 0.2);
        animation: modal-slide-in 0.3s ease-out;
      `;

      modalBox.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #10b981, #059669); 
            border-radius: 50%; display: flex; align-items: center; justify-content: center; 
            margin: 0 auto 16px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);">
            <i class="fas fa-check-circle" style="font-size: 32px; color: white;"></i>
          </div>
          <h3 style="margin: 0 0 12px 0; color: #f3f4f6; font-size: 20px; font-weight: 700;">
            确认完成讨论
          </h3>
          <p style="margin: 0; color: #9ca3af; font-size: 14px; line-height: 1.6;">
            点击确认后将返回课程页面<br>并标记此讨论为已完成
          </p>
        </div>
        
        <div style="display: flex; gap: 12px;">
          <button id="discussion-modal-cancel-btn" style="
            flex: 1;
            padding: 12px 24px;
            background: #374151;
            border: 1px solid #4b5563;
            border-radius: 10px;
            color: #e5e7eb;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          ">
            <i class="fas fa-times"></i> 取消
          </button>
          <button id="discussion-modal-confirm-btn" style="
            flex: 1;
            padding: 12px 24px;
            background: linear-gradient(135deg, #10b981, #059669);
            border: none;
            border-radius: 10px;
            color: white;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          ">
            <i class="fas fa-check"></i> 确认完成
          </button>
        </div>
        
        <style>
          @keyframes modal-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modal-slide-in {
            from { 
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            to { 
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          #discussion-modal-cancel-btn:hover {
            background: #4b5563;
            border-color: #6b7280;
          }
          #discussion-modal-confirm-btn:hover {
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
          }
          #discussion-modal-cancel-btn:active,
          #discussion-modal-confirm-btn:active {
            transform: translateY(0);
          }
        </style>
      `;

      overlay.appendChild(modalBox);
      document.body.appendChild(overlay);

      // 取消按钮
      document.getElementById("discussion-modal-cancel-btn").onclick = () => {
        overlay.style.animation = "modal-fade-out 0.2s ease-in forwards";
        setTimeout(() => overlay.remove(), 200);
      };

      // 点击背景关闭
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          overlay.style.animation = "modal-fade-out 0.2s ease-in forwards";
          setTimeout(() => overlay.remove(), 200);
        }
      };

      // 确认按钮
      document.getElementById("discussion-modal-confirm-btn").onclick = () => {
        overlay.remove();

        // 尝试点击提交按钮（如果存在且可点击）
        const submitBtn = document.querySelector("button.submitComment");
        if (submitBtn && !submitBtn.disabled) {
          console.log("确认完成时自动点击提交按钮");
          submitBtn.click();
          // 给一点时间让提交请求发出
        }

        // 停止监测div.el-tooltip
        if (discussionStatusIntervalId) {
          clearInterval(discussionStatusIntervalId);
          console.log("已停止监测讨论完成状态");
        }

        discussionCompletedTriggered = true;
        console.log("========== 讨论确认完成按钮点击 ==========");
        console.log("讨论已标记完成，准备保存状态...");

        // 更新完成状态显示
        const statusDisplay = document.getElementById("ai-completion-status");
        if (statusDisplay) {
          statusDisplay.innerHTML =
            '<i class="fas fa-check-circle" style="color: #2ecc71;"></i><span>已完成</span>';
        }

        // 先检查localStorage中是否有索引
        let discussionIndex = localStorage.getItem("yuketang_current_discussion_index");
        console.log("📌 当前讨论索引 (localStorage):", discussionIndex);

        // 如果没有索引，尝试重新从课程数据推断
        if (!discussionIndex) {
          console.log("⚠️ 未找到讨论索引，尝试重新推断...");
          const courseData = localStorage.getItem("yuketang_helper_data");
          if (courseData) {
            try {
              const data = JSON.parse(courseData);
              console.log("📦 课程数据:", data);
              console.log("📊 讨论数量:", data.discussion ? data.discussion.length : 0);

              if (data.discussion && data.discussion.length === 1) {
                // 如果只有一个讨论，直接使用
                discussionIndex = "1";
                localStorage.setItem("yuketang_current_discussion_index", discussionIndex);
                console.log("✅ 只有一个讨论，使用索引 1");
              } else if (data.discussion && data.discussion.length > 1) {
                console.error("❌ 有多个讨论但无法确定当前是哪一个");
                console.error("讨论列表:", data.discussion.map((d, i) => `${i + 1}: ${d.title}`));
              }
            } catch (e) {
              console.error("解析课程数据失败:", e);
            }
          } else {
            console.error("❌ 未找到课程数据 (yuketang_helper_data)");
          }
        }

        if (discussionIndex) {
          const completionData = {
            discussionIndex: parseInt(discussionIndex),
            timestamp: Date.now(),
            status: "已完成",
          };
          localStorage.setItem(
            "yuketang_discussion_completed",
            JSON.stringify(completionData)
          );
          console.log("✅ 已保存讨论完成状态到 localStorage:");
          console.log("   讨论索引:", completionData.discussionIndex);
          console.log("   时间戳:", new Date(completionData.timestamp).toLocaleString());
          console.log("   完成数据:", completionData);
        } else {
          console.error("❌ 未找到讨论索引，无法保存完成状态");
          console.error("但仍会尝试关闭标签页返回课程页面");
        }
        console.log("========== 准备关闭标签页 ==========");

        showToast('<i class="fas fa-comments"></i> 讨论已标记完成！');

        // 延迟2秒后关闭（无论是否保存了索引）
        setTimeout(() => {
          console.log("讨论已完成，正在关闭当前标签页并返回课程页面...");

          // 尝试关闭当前标签页
          window.close();

          // 如果无法关闭（浏览器限制），则尝试返回上一页
          setTimeout(() => {
            if (window.history.length > 1) {
              console.log("无法自动关闭标签页，尝试返回上一页...");
              window.history.back();
            } else {
              console.log("无法自动关闭标签页，请手动关闭");
              showToast(
                '<i class="fas fa-comments"></i> 讨论已完成！请手动关闭此标签页'
              );
            }
          }, 1000);
        }, 2000);
      };
    });

    // 自动检测题目
    setTimeout(() => {
      const title = document.querySelector(".title-fl > span");
      const content = document.querySelector(".word-break > p");
      let questionText = "";
      if (title) questionText += title.textContent.trim() + "\n\n";
      if (content) questionText += content.textContent.trim();
      if (questionText) {
        document.getElementById("ai-question-text").textContent = questionText;
      }
    }, 1000);

    // 监测讨论完成状态
    function updateDiscussionStatus() {
      const statusDisplay = document.getElementById("ai-completion-status");
      const confirmBtn = document.getElementById("ai-confirm-complete-btn");
      if (!statusDisplay) return;

      // 检测方式1: 通过 div.el-tooltip 检测"已发言"
      const tooltipElement = document.querySelector("div.el-tooltip");
      const hasSpoken = tooltipElement && tooltipElement.textContent.includes("已发言");

      // 检测方式2: 检测是否已提交（查找提交成功的标志）
      const submitSuccess = document.querySelector(".ant-message-success");
      const submitButton = document.querySelector(".ant-btn-primary");
      const textareaValue = document.querySelector("textarea")?.value || "";

      // 如果已发言或已提交，都视为完成
      if (hasSpoken || submitSuccess || (submitButton && submitButton.disabled)) {
        if (hasSpoken) {
          statusDisplay.innerHTML =
            '<i class="fas fa-check-circle" style="color: #2ecc71;"></i> 已发言';
          console.log("检测到已发言状态");
        } else {
          statusDisplay.innerHTML =
            '<i class="fas fa-check-circle" style="color: #2ecc71;"></i> 已提交';
        }

        // 如果尚未触发完成事件，则触发
        if (!discussionCompletedTriggered) {
          discussionCompletedTriggered = true;
          console.log("讨论已完成，准备保存状态...");

          // 先检查localStorage中是否有索引
          let discussionIndex = localStorage.getItem(
            "yuketang_current_discussion_index"
          );
          console.log("当前讨论索引:", discussionIndex);

          // 如果没有索引，尝试重新从课程数据推断
          if (!discussionIndex) {
            console.log("尝试重新推断讨论索引...");
            const courseData = localStorage.getItem("yuketang_helper_data");
            if (courseData) {
              try {
                const data = JSON.parse(courseData);
                if (data.discussion && data.discussion.length === 1) {
                  // 如果只有一个讨论，直接使用
                  discussionIndex = "1";
                  localStorage.setItem("yuketang_current_discussion_index", discussionIndex);
                  console.log("只有一个讨论，使用索引 1");
                }
              } catch (e) {
                console.error("解析课程数据失败:", e);
              }
            }
          }

          if (discussionIndex) {
            const completionData = {
              discussionIndex: parseInt(discussionIndex),
              timestamp: Date.now(),
              status: "已完成",
            };
            localStorage.setItem(
              "yuketang_discussion_completed",
              JSON.stringify(completionData)
            );
            console.log("✓ 已保存讨论完成状态:", completionData);
          } else {
            console.warn("⚠ 未找到讨论索引，无法保存完成状态到课程数据");
            console.warn("但仍会尝试关闭标签页返回课程页面");
          }

          showToast('<i class="fas fa-comments"></i> 讨论已完成！');

          // 延迟2秒后关闭（无论是否保存了索引）
          setTimeout(() => {
            console.log("讨论已完成，正在关闭当前标签页并返回课程页面...");

            // 尝试关闭当前标签页
            window.close();

            // 如果无法关闭（浏览器限制），则尝试返回上一页
            setTimeout(() => {
              if (window.history.length > 1) {
                console.log("无法自动关闭标签页，尝试返回上一页...");
                window.history.back();
              } else {
                console.log("无法自动关闭标签页，请手动关闭");
                showToast(
                  '<i class="fas fa-comments"></i> 讨论已完成！请手动关闭此标签页'
                );
              }
            }, 1000);
          }, 2000);
        }
      } else if (textareaValue.trim().length > 0) {
        statusDisplay.innerHTML =
          '<i class="fas fa-edit" style="color: #f39c12;"></i> 编辑中...';
      } else {
        statusDisplay.innerHTML =
          '<i class="fas fa-hourglass-start" style="color: #95a5a6;"></i> 未开始';
      }
    }

    // 定期检测状态
    updateDiscussionStatus();
    discussionStatusIntervalId = setInterval(updateDiscussionStatus, 1000);

    // 监听提交按钮点击
    document.addEventListener("click", (e) => {
      if (e.target.closest(".ant-btn-primary")) {
        console.log("检测到提交按钮点击");
        setTimeout(updateDiscussionStatus, 500);
      }
    });

    // 使面板可拖拽
    makeDraggable(panel);
  }

  // 获取AI答案
  function getAIAnswer() {
    const questionText =
      document.getElementById("ai-question-text").textContent;
    const answerDiv = document.getElementById("ai-answer-text");
    const statusDiv = document.getElementById("ai-status-message");
    const btn = document.getElementById("ai-get-answer-btn");

    if (questionText === "暂无题目") {
      statusDiv.className = "status-message error";
      statusDiv.textContent = "未检测到题目内容";
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在思考...';
    answerDiv.textContent = "AI正在生成答案，请稍候...";

    callAIAPI(questionText, (result) => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-magic"></i> 获取答案';

      if (result.success) {
        answerDiv.textContent = result.answer;
        statusDiv.className = "status-message success";
        statusDiv.innerHTML =
          '<i class="fas fa-check-circle"></i> 答案获取成功';
        setTimeout(() => (statusDiv.style.display = "none"), 3000);

        // 自动粘贴答案到输入框
        try {
          const textarea = document.querySelector(
            "#publish > div > div.textarea.el-textarea > textarea"
          );
          if (textarea) {
            // 先聚焦元素
            textarea.focus();

            // 等待聚焦完成后再粘贴
            setTimeout(() => {
              // 设置内容 (textarea 使用 value 属性)
              textarea.value = result.answer;

              // 触发 input 事件以确保页面识别到内容变化
              const inputEvent = new Event("input", { bubbles: true });
              textarea.dispatchEvent(inputEvent);

              // 触发 change 事件
              const changeEvent = new Event("change", { bubbles: true });
              textarea.dispatchEvent(changeEvent);

              // 更新状态信息
              statusDiv.innerHTML =
                '<i class="fas fa-check-circle"></i> 已自动粘贴，请手动提交';
              statusDiv.className = "status-message success";

              // 移除自动提交逻辑
              /* 
              setTimeout(() => {
                const submitBtn = document.querySelector(
                  "button.submitComment"
                );
                if (submitBtn) {
                  submitBtn.click();
                  statusDiv.innerHTML =
                    '<i class="fas fa-check-double"></i> 已自动提交';
                } else {
                  statusDiv.innerHTML =
                    '<i class="fas fa-check-circle"></i> 已粘贴，请手动提交';
                }
              }, 500); 
              */
            }, 100);
          } else {
            // 未找到输入框，只显示答案
            statusDiv.innerHTML =
              '<i class="fas fa-exclamation-triangle"></i> 未找到输入框，请手动复制';
            statusDiv.className = "status-message warning";
          }
        } catch (e) {
          console.error("粘贴失败:", e);
          statusDiv.innerHTML =
            '<i class="fas fa-exclamation-triangle"></i> 自动粘贴失败，请手动复制';
          statusDiv.className = "status-message warning";
        }
      } else {
        answerDiv.textContent = "获取失败：" + result.error;
        statusDiv.className = "status-message error";
        statusDiv.innerHTML =
          '<i class="fas fa-times-circle"></i> ' + result.error;
      }
    });
  }

  // ==================== OCR习题识别功能 ====================

  // 获取百度OCR Access Token
  function getBaiduAccessToken() {
    return new Promise((resolve, reject) => {
      const apiKey = GM_getValue(OCR_API_KEY, "");
      const secretKey = GM_getValue(OCR_SECRET_KEY, "");

      if (!apiKey || !secretKey) {
        reject(new Error("请先配置百度OCR密钥"));
        return;
      }

      GM_xmlhttpRequest({
        method: "POST",
        url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            if (data.access_token) {
              resolve(data.access_token);
            } else {
              reject(new Error("获取Token失败"));
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: () => reject(new Error("网络请求失败")),
      });
    });
  }

  // OCR识别图片
  function recognizeImage(base64Image) {
    return new Promise((resolve, reject) => {
      getBaiduAccessToken()
        .then((token) => {
          GM_xmlhttpRequest({
            method: "POST",
            url: `https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=${token}`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: `image=${encodeURIComponent(base64Image)}`,
            onload: function (response) {
              try {
                const data = JSON.parse(response.responseText);
                if (data.words_result) {
                  const text = data.words_result
                    .map((item) => item.words)
                    .join("\n");
                  const count = data.words_result.length;
                  resolve({ text, count });
                } else {
                  reject(new Error("识别失败"));
                }
              } catch (e) {
                reject(e);
              }
            },
            onerror: () => reject(new Error("网络请求失败")),
          });
        })
        .catch(reject);
    });
  }

  // 生成截图（完整版，带滚动条隐藏）
  async function captureOCRScreenshot() {
    const element = document.querySelector(
      ".el-scrollbar__view > .subject-item"
    );
    if (!element) {
      throw new Error("未找到题目元素");
    }

    // 临时注入样式隐藏滚动条
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
      body, html, .subject-item { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    element.appendChild(styleTag);

    try {
      const width = element.scrollWidth;
      const height = element.scrollHeight;
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        width: width,
        height: height,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: width,
        windowHeight: height,
        logging: false,
      });
      return canvas.toDataURL("image/png");
    } finally {
      if (styleTag.parentNode) {
        styleTag.parentNode.removeChild(styleTag);
      }
    }
  }

  // 显示AI工具推荐面板
  function showAIRecommendationPanel() {
    const oldPanel = document.getElementById("ai-recommend-panel");
    if (oldPanel) oldPanel.remove();

    const panel = document.createElement("div");
    panel.id = "ai-recommend-panel";
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      background: #1f2937;
      border: 1px solid #374151;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      border-radius: 12px;
      z-index: 1000000;
      padding: 24px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-align: center;
    `;

    const tools = [
      { name: "Gemini", url: "https://gemini.google.com/" },
      { name: "ChatGPT", url: "https://chatgpt.com/" },
      { name: "Claude", url: "https://claude.ai/" },
      { name: "Deepseek", url: "https://chat.deepseek.com/" },
      { name: "Grok", url: "https://x.com/i/grok" },
      { name: "Kimi", url: "https://kimi.moonshot.cn/" },
      { name: "通义千问", url: "https://tongyi.aliyun.com/qianwen/" },
      { name: "豆包", url: "https://www.doubao.com/" },
    ];

    panel.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: #4CAF50;">
        <i class="fa-solid fa-check-circle"></i> 题目识别完成！
      </h3>
      <p style="font-size: 14px; color: #d1d5db; margin-bottom: 15px;">
        建议复制识别结果，并使用以下 AI 工具获取答案：
      </p>
      <div style="text-align: left; font-size: 14px; line-height: 2; padding: 15px 20px; background: #111827; border-radius: 8px; border: 1px solid #374151; color: #e5e7eb; margin-bottom: 15px;">
        ${tools
        .map(
          (t) =>
            `<div><a href="${t.url}" target="_blank" style="color: #60a5fa; text-decoration: none;">${t.name}</a></div>`
        )
        .join("")}
      </div>
      <button id="ai-recommend-close" style="padding: 10px 24px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;">
        <i class="fa-solid fa-check"></i> 知道了
      </button>
    `;

    document.body.appendChild(panel);

    document.getElementById("ai-recommend-close").onclick = () =>
      panel.remove();
  }

  // 截图并识别（单次）
  async function captureAndRecognize() {
    const apiKey = GM_getValue(OCR_API_KEY, "");
    const secretKey = GM_getValue(OCR_SECRET_KEY, "");

    if (!apiKey || !secretKey) {
      showToast(
        '<i class="fas fa-exclamation-triangle"></i> 请先配置百度OCR密钥'
      );
      document.getElementById("ocr-settings-btn").click();
      return;
    }

    const statusSpan = document.querySelector(
      "#ocr-helper-panel .panel-status span"
    );
    if (statusSpan) statusSpan.textContent = "正在生成截图...";

    try {
      const dataUrl = await captureOCRScreenshot();
      latestScreenshot = dataUrl;

      // 启用导出按钮
      const exportBtn = document.getElementById("ocr-export-btn");
      if (exportBtn) {
        exportBtn.disabled = false;
        exportBtn.style.opacity = "1";
      }

      if (statusSpan) statusSpan.textContent = "正在识别文字...";

      const base64Image = dataUrl.split(",")[1];
      const result = await recognizeImage(base64Image);

      document.getElementById("ocr-result-textarea").value = result.text;
      if (statusSpan)
        statusSpan.textContent = `识别完成，共 ${result.count} 行`;

      showToast('<i class="fas fa-check-circle"></i> 识别完成');
    } catch (error) {
      if (statusSpan) statusSpan.textContent = "识别出错";
      showToast(
        '<i class="fas fa-times-circle"></i> 识别失败: ' + error.message
      );
      console.error("OCR错误:", error);
    }
  }

  // 自动识别全部题目
  async function runOCRAutomation() {
    if (isOCRRunning) {
      showToast('<i class="fas fa-exclamation-triangle"></i> 正在运行中...');
      return;
    }

    const apiKey = GM_getValue(OCR_API_KEY, "");
    const secretKey = GM_getValue(OCR_SECRET_KEY, "");

    if (!apiKey || !secretKey) {
      showToast(
        '<i class="fas fa-exclamation-triangle"></i> 请先配置百度OCR密钥'
      );
      document.getElementById("ocr-settings-btn").click();
      return;
    }

    isOCRRunning = true;
    ocrAutoCount = 0;

    const autoBtn = document.getElementById("ocr-auto-btn");
    const textarea = document.getElementById("ocr-result-textarea");
    const statusSpan = document.querySelector(
      "#ocr-helper-panel .panel-status span"
    );

    if (autoBtn) autoBtn.innerHTML = '<i class="fa-solid fa-stop"></i> 停止';

    while (isOCRRunning) {
      ocrAutoCount++;
      if (statusSpan)
        statusSpan.textContent = `正在识别第 ${ocrAutoCount} 题...`;

      try {
        // 1. 截图
        const dataUrl = await captureOCRScreenshot();
        latestScreenshot = dataUrl;

        const exportBtn = document.getElementById("ocr-export-btn");
        if (exportBtn) {
          exportBtn.disabled = false;
          exportBtn.style.opacity = "1";
        }

        // 2. 识别
        const base64Image = dataUrl.split(",")[1];
        const result = await recognizeImage(base64Image);
        textarea.value += `\n--- 第 ${ocrAutoCount} 题 ---\n${result.text}\n`;
        textarea.scrollTop = textarea.scrollHeight;

        // 3. 寻找下一题按钮
        const nextBtn = document.querySelector(".text-right .el-button");

        if (!nextBtn) {
          if (statusSpan) statusSpan.textContent = "未找到下一题按钮，流程结束";
          showAIRecommendationPanel();
          break;
        }

        if (nextBtn.classList.contains("is-disabled") || nextBtn.disabled) {
          if (statusSpan) statusSpan.textContent = "已到达最后一题，流程结束";
          showAIRecommendationPanel();
          break;
        }

        // 4. 点击下一题
        nextBtn.click();

        // 5. 等待加载（QPS < 2）
        if (statusSpan) statusSpan.textContent = "等待跳转...";
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error("自动识别错误:", err);
        textarea.value += `\n[错误] 第 ${ocrAutoCount} 题: ${err.message}\n`;
        if (statusSpan) statusSpan.textContent = "发生错误，自动化停止";
        isOCRRunning = false;
      }
    }

    isOCRRunning = false;
    if (autoBtn)
      autoBtn.innerHTML = '<i class="fa-solid fa-play"></i> 识别全部题目';

    // 自动复制识别结果
    const text = textarea.value.trim();
    if (text && ocrAutoCount > 0) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToast(
            '<i class="fas fa-check-circle"></i> 识别完成，已自动复制到剪贴板'
          );
        })
        .catch((err) => {
          // 降级方案
          textarea.select();
          document.execCommand("copy");
          showToast(
            '<i class="fas fa-check-circle"></i> 识别完成，已自动复制到剪贴板'
          );
        });
    }
  }

  // 导出截图
  function exportOCRScreenshot() {
    if (!latestScreenshot) {
      showToast('<i class="fas fa-exclamation-triangle"></i> 没有可导出的截图');
      return;
    }

    const link = document.createElement("a");
    link.href = latestScreenshot;
    link.download = `yuketang-screenshot-${Date.now()}.png`;
    link.click();
    showToast('<i class="fas fa-check-circle"></i> 截图已导出');
  }

  // 创建OCR面板
  function createOCRPanel() {
    // 添加Font Awesome样式（如果未加载）
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const faLink = document.createElement("link");
      faLink.rel = "stylesheet";
      faLink.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      faLink.crossOrigin = "anonymous";
      document.head.appendChild(faLink);
    }

    const panel = document.createElement("div");
    panel.id = "ocr-helper-panel";
    panel.innerHTML = `
      <div class="panel-header">
        <div class="panel-title"><i class="fa-solid fa-camera"></i> OCR 识别助手</div>
        <div class="panel-controls">
          <button class="panel-btn" id="ocr-settings-btn" title="设置"><i class="fas fa-cog"></i></button>
          <button class="panel-btn" id="ocr-minimize-btn" title="最小化"><i class="fas fa-minus"></i></button>
        </div>
      </div>
      <div class="panel-content">
        <!-- 结果视图 -->
        <div id="ocr-result-view" style="display: flex; flex-direction: column; height: 100%; padding: 12px;">
          <div style="background: #374151; padding: 10px; border-radius: 6px; margin-bottom: 12px; border: 1px solid #4b5563;">
            <div style="display: flex; align-items: center; gap: 8px; color: #9ca3af; font-size: 12px; font-weight: 600; margin-bottom: 6px;">
              <i class="fas fa-chart-line" style="color: #818cf8;"></i>
              <span>完成状态</span>
            </div>
            <div id="ocr-completion-status" style="color: #f3f4f6; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-hourglass-start" style="color: #95a5a6;"></i>
              <span>未完成</span>
            </div>
          </div>
          
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            <button class="action-btn" id="ocr-screenshot-btn" style="flex: 1; background: #10b981;">
              <i class="fa-solid fa-camera"></i> 截图识别
            </button>
            <button class="action-btn" id="ocr-auto-btn" style="flex: 1; background: #3b82f6;">
              <i class="fa-solid fa-play"></i> 识别全部
            </button>
          </div>
          
          <textarea id="ocr-result-textarea" placeholder="截图后在此显示识别结果..." 
            style="flex: 1; width: 100%; background: #1f2937; color: #e5e7eb; border: 1px solid #374151; 
            border-radius: 6px; padding: 12px; font-size: 13px; margin-bottom: 12px; resize: none;"></textarea>
          
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <button class="action-btn" id="ocr-export-btn" style="flex: 1; background: #6366f1; opacity: 0.5;" disabled>
              <i class="fas fa-save"></i> 导出截图
            </button>
            <button class="action-btn" id="ocr-copy-btn" style="flex: 1; background: #8b5cf6;">
              <i class="fas fa-copy"></i> 复制结果
            </button>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="action-btn" id="ocr-complete-btn" style="flex: 1; background: #10b981;">
              <i class="fas fa-check-circle"></i> 确认完成
            </button>
          </div>
        </div>
        
        <!-- 设置视图 -->
        <div id="ocr-config-view" style="display: none; padding: 16px;">
          <div style="margin-bottom: 16px;">
            <div style="color: #e5e7eb; font-size: 13px; font-weight: 600; margin-bottom: 8px;">
              <i class="fas fa-key"></i> API Key
            </div>
            <input type="text" id="ocr-api-key-input" placeholder="请输入百度OCR API Key" 
              style="width: 100%; padding: 10px; background: #111827; border: 1px solid #374151; 
              border-radius: 6px; color: #e5e7eb; font-size: 13px;">
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="color: #e5e7eb; font-size: 13px; font-weight: 600; margin-bottom: 8px;">
              <i class="fas fa-lock"></i> Secret Key
            </div>
            <input type="password" id="ocr-secret-key-input" placeholder="请输入百度OCR Secret Key" 
              style="width: 100%; padding: 10px; background: #111827; border: 1px solid #374151; 
              border-radius: 6px; color: #e5e7eb; font-size: 13px;">
          </div>
          
          <div style="background: #374151; padding: 12px; border-radius: 6px; border: 1px solid #4b5563; margin-bottom: 16px;">
            <div style="color: #9ca3af; font-size: 12px; line-height: 1.6;">
              <i class="fas fa-info-circle" style="color: #60a5fa;"></i>
              <strong>获取密钥：</strong><br>
              访问 <a href="https://console.bce.baidu.com/ai/#/ai/ocr/overview/index" target="_blank" 
              style="color: #60a5fa; text-decoration: none;">百度智能云</a> 创建应用获取密钥
            </div>
          </div>
          
          <div style="display: flex; gap: 8px;">
            <button class="action-btn" id="ocr-config-cancel-btn" style="flex: 1; background: #6b7280;">
              <i class="fas fa-times"></i> 取消
            </button>
            <button class="action-btn" id="ocr-config-save-btn" style="flex: 1; background: #10b981;">
              <i class="fas fa-check"></i> 保存
            </button>
          </div>
        </div>
      </div>
      
      <div class="panel-status">
        <i class="fas fa-info-circle"></i> <span>准备就绪</span>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #ocr-helper-panel {
        position: fixed;
        top: 60px;
        right: 20px;
        width: 380px;
        height: 600px;
        background: #1f2937;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        z-index: 999999;
        border: 1px solid #374151;
        display: flex;
        flex-direction: column;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        overflow: hidden;
      }
      #ocr-helper-panel .panel-header {
        background: #111827;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        border-bottom: 1px solid #374151;
        flex-shrink: 0;
        user-select: none;
        border-radius: 16px 16px 0 0;
      }
      #ocr-helper-panel .panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: white;
        font-size: 15px;
        font-weight: 600;
      }
      #ocr-helper-panel .panel-controls {
        display: flex;
        gap: 6px;
      }
      #ocr-helper-panel .panel-btn {
        background: #374151;
        border: 1px solid #4b5563;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        color: #e5e7eb;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      #ocr-helper-panel .panel-btn:hover {
        background: #4b5563;
        border-color: #6b7280;
      }
      #ocr-helper-panel .panel-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      #ocr-helper-panel .panel-status {
        background: #111827;
        padding: 10px 16px;
        border-top: 1px solid #374151;
        color: #9ca3af;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        border-radius: 0 0 16px 16px;
      }
      #ocr-helper-panel .action-btn {
        padding: 10px 16px;
        border: none;
        border-radius: 8px;
        color: white;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      #ocr-helper-panel .action-btn:hover:not(:disabled) {
        opacity: 0.9;
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
      }
      #ocr-helper-panel .action-btn:active:not(:disabled) {
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
      }
      #ocr-helper-panel .action-btn:disabled {
        cursor: not-allowed;
      }
      #ocr-helper-panel.minimized .panel-content,
      #ocr-helper-panel.minimized .panel-status {
        display: none;
      }
      #ocr-helper-panel.minimized {
        height: auto;
      }
      #ocr-helper-panel.minimized .panel-header {
        border-radius: 16px;
      }
      
      /* 自定义滚动条样式 */
      #ocr-helper-panel ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      #ocr-helper-panel ::-webkit-scrollbar-track {
        background: #1f2937;
        border-radius: 4px;
      }
      #ocr-helper-panel ::-webkit-scrollbar-thumb {
        background: #4b5563;
        border-radius: 4px;
        transition: background 0.2s;
      }
      #ocr-helper-panel ::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
      }
      #ocr-helper-panel ::-webkit-scrollbar-thumb:active {
        background: #9ca3af;
      }
      
      /* textarea 特定样式 */
      #ocr-result-textarea::-webkit-scrollbar {
        width: 10px;
      }
      #ocr-result-textarea::-webkit-scrollbar-track {
        background: #111827;
        border-radius: 5px;
        margin: 4px;
      }
      #ocr-result-textarea::-webkit-scrollbar-thumb {
        background: #374151;
        border-radius: 5px;
        border: 2px solid #111827;
      }
      #ocr-result-textarea::-webkit-scrollbar-thumb:hover {
        background: #4b5563;
      }
    `;
    document.head.appendChild(style);

    // 阻止面板右键菜单
    panel.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    document.body.appendChild(panel);

    // 获取元素
    const resultView = document.getElementById("ocr-result-view");
    const configView = document.getElementById("ocr-config-view");
    const apiKeyInput = document.getElementById("ocr-api-key-input");
    const secretKeyInput = document.getElementById("ocr-secret-key-input");

    // 加载保存的配置
    apiKeyInput.value = GM_getValue(OCR_API_KEY, "");
    secretKeyInput.value = GM_getValue(OCR_SECRET_KEY, "");

    // 切换视图函数
    function toggleView(viewName) {
      if (viewName === "config") {
        resultView.style.display = "none";
        configView.style.display = "block";
      } else {
        resultView.style.display = "flex";
        configView.style.display = "none";
      }
    }

    // 绑定事件
    document
      .getElementById("ocr-screenshot-btn")
      .addEventListener("click", captureAndRecognize);

    document.getElementById("ocr-auto-btn").addEventListener("click", () => {
      if (isOCRRunning) {
        isOCRRunning = false;
        document.getElementById("ocr-auto-btn").innerHTML =
          '<i class="fa-solid fa-play"></i> 识别全部';
      } else {
        runOCRAutomation();
      }
    });

    document
      .getElementById("ocr-export-btn")
      .addEventListener("click", exportOCRScreenshot);

    document.getElementById("ocr-copy-btn").addEventListener("click", () => {
      const textarea = document.getElementById("ocr-result-textarea");
      const text = textarea.value.trim();

      if (!text) {
        showToast(
          '<i class="fas fa-exclamation-triangle"></i> 没有可复制的内容'
        );
        return;
      }

      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToast('<i class="fas fa-check-circle"></i> 已复制到剪贴板');
        })
        .catch((err) => {
          // 降级方案：使用旧方法
          textarea.select();
          document.execCommand("copy");
          showToast('<i class="fas fa-check-circle"></i> 已复制到剪贴板');
        });
    });

    document
      .getElementById("ocr-minimize-btn")
      .addEventListener("click", () => {
        panel.classList.toggle("minimized");
        const icon = document.querySelector("#ocr-minimize-btn i");
        icon.className = panel.classList.contains("minimized")
          ? "fas fa-plus"
          : "fas fa-minus";
      });

    document
      .getElementById("ocr-settings-btn")
      .addEventListener("click", () => {
        toggleView("config");
      });

    document
      .getElementById("ocr-config-cancel-btn")
      .addEventListener("click", () => {
        toggleView("result");
      });

    document
      .getElementById("ocr-config-save-btn")
      .addEventListener("click", () => {
        const apiKey = apiKeyInput.value.trim();
        const secretKey = secretKeyInput.value.trim();

        if (!apiKey || !secretKey) {
          showToast(
            '<i class="fas fa-exclamation-triangle"></i> 请填写完整的密钥信息'
          );
          return;
        }

        GM_setValue(OCR_API_KEY, apiKey);
        GM_setValue(OCR_SECRET_KEY, secretKey);
        showToast('<i class="fas fa-check-circle"></i> 配置已保存');
        toggleView("result");
      });

    // 拖拽功能
    const header = panel.querySelector(".panel-header");
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let rafId = null;

    header.addEventListener("mousedown", dragStart, { passive: false });

    function dragStart(e) {
      if (e.target.closest(".panel-controls")) return;
      e.preventDefault();
      isDragging = true;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      document.addEventListener("mousemove", drag, { passive: false });
      document.addEventListener("mouseup", dragEnd, { once: true });
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      const newX = e.clientX - initialX;
      const newY = e.clientY - initialY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        currentX = newX;
        currentY = newY;
        panel.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        rafId = null;
      });
    }

    function dragEnd() {
      isDragging = false;
      document.removeEventListener("mousemove", drag);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    // 检查配置并显示相应视图
    const apiKey = GM_getValue(OCR_API_KEY, "");
    const secretKey = GM_getValue(OCR_SECRET_KEY, "");
    if (!apiKey || !secretKey) {
      toggleView("config");
    } else {
      toggleView("result");
    }

    // 绑定确认完成按钮事件
    document
      .getElementById("ocr-complete-btn")
      .addEventListener("click", () => {
        if (exerciseCompletedTriggered) {
          showToast('<i class="fas fa-exclamation-triangle"></i> 已标记为完成');
          return;
        }

        // 创建自定义确认模态框
        const modal = document.createElement("div");
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 10000000;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: modal-fade-in 0.2s ease-out;
        `;

        const modalBox = document.createElement("div");
        modalBox.style.cssText = `
          background: #1f2937;
          border-radius: 16px;
          padding: 28px;
          width: 420px;
          max-width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 1px solid #374151;
          animation: modal-slide-in 0.3s ease-out;
        `;

        modalBox.innerHTML = `
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #10b981, #059669); 
              border-radius: 50%; display: flex; align-items: center; justify-content: center; 
              margin: 0 auto 16px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);">
              <i class="fas fa-check-circle" style="font-size: 32px; color: white;"></i>
            </div>
            <h3 style="margin: 0 0 12px 0; color: #f3f4f6; font-size: 20px; font-weight: 700;">
              确认完成习题
            </h3>
            <p style="margin: 0; color: #9ca3af; font-size: 14px; line-height: 1.6;">
              点击确认后将返回课程页面<br>并标记此习题为已完成
            </p>
          </div>
          
          <div style="display: flex; gap: 12px;">
            <button id="modal-cancel-btn" style="
              flex: 1;
              padding: 12px 24px;
              background: #374151;
              border: 1px solid #4b5563;
              border-radius: 10px;
              color: #e5e7eb;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">
              <i class="fas fa-times"></i> 取消
            </button>
            <button id="modal-confirm-btn" style="
              flex: 1;
              padding: 12px 24px;
              background: linear-gradient(135deg, #10b981, #059669);
              border: none;
              border-radius: 10px;
              color: white;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            ">
              <i class="fas fa-check"></i> 确认完成
            </button>
          </div>
          
          <style>
            @keyframes modal-fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes modal-slide-in {
              from { 
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
              }
              to { 
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
            #modal-cancel-btn:hover {
              background: #4b5563;
              border-color: #6b7280;
              box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
            }
            #modal-confirm-btn:hover {
              box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
            }
            #modal-cancel-btn:active,
            #modal-confirm-btn:active {
              transform: translateY(0);
            }
          </style>
        `;

        modal.appendChild(modalBox);
        document.body.appendChild(modal);

        // 取消按钮
        document.getElementById("modal-cancel-btn").onclick = () => {
          modal.style.animation = "modal-fade-out 0.2s ease-in forwards";
          setTimeout(() => modal.remove(), 200);
        };

        // 点击背景关闭
        modal.onclick = (e) => {
          if (e.target === modal) {
            modal.style.animation = "modal-fade-out 0.2s ease-in forwards";
            setTimeout(() => modal.remove(), 200);
          }
        };

        // 确认按钮
        document.getElementById("modal-confirm-btn").onclick = () => {
          modal.remove();

          exerciseCompletedTriggered = true;
          console.log("习题已标记完成，准备保存状态...");

          // 更新完成状态显示
          const statusDisplay = document.getElementById("ocr-completion-status");
          if (statusDisplay) {
            statusDisplay.innerHTML =
              '<i class="fas fa-check-circle" style="color: #2ecc71;"></i><span>已完成</span>';
          }

          // 先检查localStorage中是否有索引
          let exerciseIndex = localStorage.getItem("yuketang_current_exercise_index");
          console.log("当前习题索引:", exerciseIndex);

          // 如果没有索引，尝试重新从课程数据推断
          if (!exerciseIndex) {
            console.log("尝试重新推断习题索引...");
            const courseData = localStorage.getItem("yuketang_helper_data");
            if (courseData) {
              try {
                const data = JSON.parse(courseData);
                if (data.exercise && data.exercise.length === 1) {
                  // 如果只有一个习题，直接使用
                  exerciseIndex = "1";
                  localStorage.setItem("yuketang_current_exercise_index", exerciseIndex);
                  console.log("只有一个习题，使用索引 1");
                }
              } catch (e) {
                console.error("解析课程数据失败:", e);
              }
            }
          }

          if (exerciseIndex) {
            const completionData = {
              exerciseIndex: parseInt(exerciseIndex),
              timestamp: Date.now(),
              status: "已完成",
            };
            localStorage.setItem(
              "yuketang_exercise_completed",
              JSON.stringify(completionData)
            );
            console.log("✓ 已保存习题完成状态:", completionData);
          } else {
            console.warn("⚠ 未找到习题索引，无法保存完成状态到课程数据");
            console.warn("但仍会尝试关闭标签页返回课程页面");
          }

          showToast('<i class="fas fa-edit"></i> 习题已标记完成！');

          // 延迟2秒后关闭（无论是否保存了索引）
          setTimeout(() => {
            console.log("习题已完成，正在关闭当前标签页并返回课程页面...");

            // 尝试关闭当前标签页
            window.close();

            // 如果无法关闭（浏览器限制），则尝试返回上一页
            setTimeout(() => {
              if (window.history.length > 1) {
                console.log("无法自动关闭标签页，尝试返回上一页...");
                window.history.back();
              } else {
                console.log("无法自动关闭标签页，请手动关闭");
                showToast(
                  '<i class="fas fa-edit"></i> 习题已完成！请手动关闭此标签页'
                );
              }
            }, 1000);
          }, 2000);
        };
      });
  }
})();
