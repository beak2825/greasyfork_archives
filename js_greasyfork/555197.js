// ==UserScript==
// @name         Anti-safetyexam
// @namespace    howardzhangdqs
// @version      11.45.14.1
// @description  南京信息工程大学实验室安全教育 自动刷课 | 一键复制题目 | 一键搜题 | 自动解析AI回答
// @license      WTFPL
// @match        https://examsafety.nuist.edu.cn/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/555197/Anti-safetyexam.user.js
// @updateURL https://update.greasyfork.org/scripts/555197/Anti-safetyexam.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  const styleCss = '.safetyexam-floating-button{position:fixed;bottom:20px;right:20px;z-index:1000;padding:10px 20px;background-color:#007bff;color:#fff;border:none;border-radius:5px;cursor:pointer}.safetyexam-floating-button:hover{background-color:#0056b3}.safetyexam-copy-button{position:absolute;left:-45px;bottom:0;width:40px;height:25px;background-color:#28a745;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:12px;z-index:100;transition:background-color .2s;display:flex;align-items:center;justify-content:center}.safetyexam-copy-button:hover{background-color:#218838}.safetyexam-copy-button:active{background-color:#1e7e34}.safetyexam-shiti-container{position:relative;margin-left:180px}.safetyexam-batch-container{position:fixed;top:20px;right:20px;z-index:1000;display:flex;flex-direction:column;gap:10px}.safetyexam-batch-button{padding:8px 15px;background-color:#6c757d;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:12px;transition:background-color .2s;white-space:nowrap}.safetyexam-batch-button:hover{background-color:#5a6268}.safetyexam-batch-button.batch-copy{background-color:#28a745}.safetyexam-batch-button.batch-copy:hover{background-color:#218838}.safetyexam-batch-button.ai-copy{background-color:#007bff}.safetyexam-batch-button.ai-copy:hover{background-color:#0056b3}.safetyexam-json-modal{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:#00000080;z-index:20000;display:flex;align-items:center;justify-content:center}.safetyexam-json-content{background-color:#fff;border-radius:8px;padding:20px;width:80vw;max-width:600px;max-height:80vh;overflow-y:auto}.safetyexam-json-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.safetyexam-json-title{font-size:18px;font-weight:700;color:#333}.safetyexam-json-close{background:none;border:none;font-size:24px;cursor:pointer;color:#666}.safetyexam-json-textarea{width:100%;max-width:550px;height:200px;border:1px solid #ddd;border-radius:4px;padding:10px;font-family:monospace;font-size:12px;resize:vertical;margin-bottom:15px;box-sizing:border-box}.safetyexam-json-buttons{display:flex;gap:10px;justify-content:flex-end}.safetyexam-json-button{padding:8px 16px;border:none;border-radius:4px;cursor:pointer;font-size:14px}.safetyexam-json-button.primary{background-color:#007bff;color:#fff}.safetyexam-json-button.primary:hover{background-color:#0056b3}.safetyexam-json-button.secondary{background-color:#6c757d;color:#fff}.safetyexam-json-button.secondary:hover{background-color:#5a6268}.safetyexam-search-button{position:absolute;left:-90px;bottom:0;width:40px;height:25px;background-color:#17a2b8;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:12px;z-index:100;transition:background-color .2s;display:flex;align-items:center;justify-content:center}.safetyexam-search-button:hover{background-color:#138496}.safetyexam-search-button:active{background-color:#117a8b}.safetyexam-search-container{position:fixed;top:2em;left:2em;right:2em;width:auto;height:60vh;background-color:#fff;border:2px solid #17a2b8;border-radius:8px;box-shadow:0 4px 20px #00000026;z-index:10000;overflow:hidden}.safetyexam-search-header{background-color:#17a2b8;color:#fff;padding:8px 15px;display:flex;justify-content:space-between;align-items:center;cursor:move;-webkit-user-select:none;user-select:none}.safetyexam-search-left{display:flex;align-items:center;gap:10px}.safetyexam-search-title{font-size:14px;font-weight:700}.safetyexam-search-source{display:flex;background-color:#fff3;border-radius:4px;overflow:hidden}.safetyexam-source-btn{background:none;border:none;color:#fff;font-size:12px;cursor:pointer;padding:4px 8px;transition:background-color .2s}.safetyexam-source-btn:hover{background-color:#ffffff1a}.safetyexam-source-btn.active{background-color:#ffffff4d;font-weight:700}.safetyexam-source-btn.external{position:relative}.safetyexam-source-btn.external:after{content:"↗";font-size:10px;margin-left:2px;opacity:.7}.safetyexam-tooltip{position:absolute;bottom:100%;left:50%;transform:translate(-50%);background-color:#000000e6;color:#fff;padding:6px 10px;border-radius:4px;font-size:12px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .3s;z-index:10001;margin-bottom:5px;max-width:200px;text-align:center;line-height:1.4}.safetyexam-tooltip:after{content:"";position:absolute;top:100%;left:50%;transform:translate(-50%);border:5px solid transparent;border-top-color:#000000e6}.safetyexam-source-btn:hover .safetyexam-tooltip{opacity:1}.safetyexam-search-close{background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:3px}.safetyexam-search-close:hover{background-color:#fff3}.safetyexam-search-content{width:100%;height:calc(100% - 40px)}.safetyexam-search-resize{position:absolute;bottom:0;right:0;width:20px;height:20px;cursor:nwse-resize;background:linear-gradient(135deg,transparent 50%,#17a2b8 50%)}.safetyexam-search-resize:hover{background:linear-gradient(135deg,transparent 50%,#138496 50%)}';
  importCSS(styleCss);
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const listPageUrl = _GM_getValue("listPageUrl", window.location.href);
  _GM_setValue("listPageUrl", listPageUrl);
  const createFloatingButton = () => {
    const button = document.createElement("button");
    button.innerText = _GM_getValue("isRunning", false) ? "刷课中" : "开始刷课";
    button.className = "safetyexam-floating-button";
    button.onclick = async () => {
      const isRunning = await _GM_getValue("isRunning", false);
      if (isRunning) {
        await _GM_setValue("isRunning", false);
        await _GM_setValue("currentCourseIndex", 0);
        await _GM_setValue("phase", "idle");
        button.innerText = "开始刷课";
      } else {
        await _GM_setValue("isRunning", true);
        await _GM_setValue("currentCourseIndex", 0);
        await _GM_setValue("phase", "selecting_course");
        button.innerText = "刷课中";
        window.location.reload();
        startAutoLearning();
      }
    };
    document.body.appendChild(button);
    const phase = _GM_getValue("phase", "");
    if (phase === "learning_course") {
      autoLearnSimpleCourse();
    } else if (phase === "selecting_course") {
      startAutoLearning();
    }
  };
  const startAutoLearning = async () => {
    const courseElements = Array.from(document.querySelectorAll(".mainLeftContent a"));
    const safeCourses = courseElements.filter((el) => el.innerText.trim().endsWith("安全"));
    console.log("可看的课程：", safeCourses.map((el) => el.innerText.trim()));
    let currentIndex = await _GM_getValue("currentCourseIndex", 0);
    for (let i = currentIndex; i < safeCourses.length; i++) {
      const isRunning = await _GM_getValue("isRunning", false);
      if (!isRunning) {
        console.log("刷课已停止");
        break;
      }
      await _GM_setValue("currentCourseIndex", i);
      const courseElement = safeCourses[i];
      await _GM_setValue("currentCourseName", courseElement.innerText.trim());
      if (i + 1 < safeCourses.length) {
        const nextElement = safeCourses[i + 1];
        await _GM_setValue("nextCourseHref", nextElement.href);
        await _GM_setValue("nextCourseName", nextElement.innerText.trim());
      } else {
        await _GM_setValue("nextCourseHref", "");
        await _GM_setValue("nextCourseName", "");
      }
      await _GM_setValue("phase", "learning_course");
      const preventer = (e) => {
        e.preventDefault();
      };
      courseElement.addEventListener("click", preventer, { once: true });
      courseElement.click();
      console.log("正在刷课：", courseElement.innerText.trim());
      break;
    }
    if (currentIndex >= safeCourses.length) {
      await _GM_setValue("isRunning", false);
      await _GM_setValue("currentCourseIndex", 0);
      await _GM_setValue("phase", "idle");
      console.log("所有课程刷课完成");
    }
  };
  const autoLearnSimpleCourse = async () => {
    const courseName = _GM_getValue("currentCourseName", "");
    if (courseName) {
      console.log("开始处理课程：", courseName);
    }
    const heading = document.querySelector(".zxxxy-heading");
    if (heading) {
      heading.click();
    }
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    let lastScrollHeight = document.body.scrollHeight;
    while (true) {
      const isRunning = await _GM_getValue("isRunning", false);
      if (!isRunning) {
        console.log("刷课已停止（滚动阶段）");
        return;
      }
      console.log("向下滚动页面");
      let totalScrolled = 0;
      const scrollStep = 1;
      const targetScroll = 300;
      while (totalScrolled < targetScroll) {
        window.scrollBy(0, scrollStep);
        totalScrolled += scrollStep;
        await sleep(3);
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        break;
      }
      const currentScrollHeight = window.scrollY + window.innerHeight;
      console.log("当前页面高度：", currentScrollHeight, "上次页面高度：", lastScrollHeight);
      if (currentScrollHeight === lastScrollHeight) {
        console.log("页面已到底部，跳出滚动循环");
        break;
      }
      lastScrollHeight = currentScrollHeight;
      await sleep(2e3);
    }
    const colorElements = Array.from(document.querySelectorAll('[color="#083F84"]'));
    if (colorElements.length === 0) {
      console.log('未找到 color="#083F84" 的元素，跳过当前课程');
      return;
    }
    if (colorElements.length === 1) {
      const linkElements = Array.from(document.querySelectorAll('[color="#CCCCCC"], [color="#083F84"]'));
      const lastLinkElement = linkElements[linkElements.length - 1];
      if (lastLinkElement.getAttribute("color") === "#CCCCCC") {
        console.log("课程已完成，灰色元素在最后，结束当前课程刷课");
        const nextHref = _GM_getValue("nextCourseHref", "");
        if (nextHref) {
          const currentIndex = _GM_getValue("currentCourseIndex", 0);
          await _GM_setValue("currentCourseIndex", currentIndex + 1);
          await _GM_setValue("currentCourseName", _GM_getValue("nextCourseName", ""));
          window.location.href = nextHref;
        } else {
          await _GM_setValue("isRunning", false);
          await _GM_setValue("currentCourseIndex", 0);
          await _GM_setValue("phase", "idle");
          window.location.href = listPageUrl;
        }
        return;
      }
    }
    const lastColorElement = colorElements[colorElements.length - 1];
    lastColorElement.click();
    await sleep(2e3);
  };
  setInterval(() => {
    let cf = window.confirm;
    window.confirm = function(...args) {
      if (args[0] && typeof args[0] === "string" && args[0].indexOf("5分钟") >= 0) {
        return true;
      } else {
        return cf(...args);
      }
    };
  }, 1e3);
  const checkExamMode = () => {
    const headTitle = document.querySelector("div.main-content > div.head-title");
    if (headTitle && headTitle.innerText.endsWith("在线考试")) {
      console.log("检测到在线考试页面，进入考试模式");
      initExamMode();
      return;
    }
    const shitiElements = document.querySelectorAll(".shiti");
    if (shitiElements.length > 0) {
      console.log("检测到答题页面，显示考试工具");
      initExamMode();
      return;
    }
    createFloatingButton();
  };
  const createBatchButtons = () => {
    const container = document.createElement("div");
    container.className = "safetyexam-batch-container";
    const batchCopyBtn = document.createElement("button");
    batchCopyBtn.className = "safetyexam-batch-button batch-copy";
    batchCopyBtn.innerText = "批量复制";
    batchCopyBtn.title = "复制当页全部题目（带编号和选项）";
    batchCopyBtn.onclick = () => batchCopyAllQuestions();
    const aiCopyBtn = document.createElement("button");
    aiCopyBtn.className = "safetyexam-batch-button ai-copy";
    aiCopyBtn.innerText = "AI答题";
    aiCopyBtn.title = "复制带prompt的题目，用于AI生成答案";
    aiCopyBtn.onclick = () => aiCopyAllQuestions();
    container.appendChild(batchCopyBtn);
    container.appendChild(aiCopyBtn);
    document.body.appendChild(container);
  };
  const initExamMode = () => {
    const shitiElements = document.querySelectorAll(".shiti");
    console.log(`找到 ${shitiElements.length} 个题目元素`);
    shitiElements.forEach((shiti, index) => {
      const shitiElement = shiti;
      const container = document.createElement("div");
      container.className = "safetyexam-shiti-container";
      shiti.parentNode?.insertBefore(container, shiti);
      container.appendChild(shiti);
      const copyButton = document.createElement("button");
      copyButton.className = "safetyexam-copy-button";
      copyButton.innerText = "复制";
      copyButton.title = "复制题目内容";
      copyButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        copyToClipboard(shitiElement.innerText, index + 1);
      };
      const searchButton = document.createElement("button");
      searchButton.className = "safetyexam-search-button";
      searchButton.innerText = "搜题";
      searchButton.title = "搜索题目答案";
      searchButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchQuestion(shitiElement, index + 1);
      };
      container.appendChild(copyButton);
      container.appendChild(searchButton);
    });
    createBatchButtons();
  };
  const copyToClipboard = async (text, questionNumber) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`已复制 \`${text}\` 到剪贴板`);
      const toast = document.createElement("div");
      toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
        `;
      toast.innerText = `第${questionNumber}题已复制到剪贴板`;
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 2e3);
    } catch (err) {
      console.error("复制失败:", err);
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      const toast = document.createElement("div");
      toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #ffc107;
            color: black;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
        `;
      toast.innerText = `第${questionNumber}题已复制（使用降级方法）`;
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 2e3);
    }
  };
  let globalSearchContainer = null;
  let globalSearchTitle = null;
  let globalSearchIframe = null;
  let currentShitiElement = null;
  const searchQuestion = (shitiElement, questionNumber) => {
    currentShitiElement = shitiElement;
    if (globalSearchContainer && globalSearchIframe && globalSearchTitle) {
      updateSearchContent(questionNumber);
      return;
    }
    createSearchWindow(questionNumber);
  };
  const createSearchWindow = (questionNumber) => {
    globalSearchContainer = document.createElement("div");
    globalSearchContainer.className = "safetyexam-search-container";
    globalSearchContainer.id = "safetyexam-search-global";
    const header = document.createElement("div");
    header.className = "safetyexam-search-header";
    const leftArea = document.createElement("div");
    leftArea.className = "safetyexam-search-left";
    globalSearchTitle = document.createElement("div");
    globalSearchTitle.className = "safetyexam-search-title";
    globalSearchTitle.innerText = `搜索第${questionNumber}题`;
    const sourceGroup = document.createElement("div");
    sourceGroup.className = "safetyexam-search-source";
    const baiduBtn = document.createElement("button");
    baiduBtn.className = "safetyexam-source-btn external";
    baiduBtn.innerText = "百度";
    baiduBtn.onclick = () => openExternalSearch("baidu");
    const baiduTooltip = document.createElement("div");
    baiduTooltip.className = "safetyexam-tooltip";
    baiduTooltip.innerText = "百度不支持iframe嵌入，将在新标签页打开";
    baiduBtn.appendChild(baiduTooltip);
    const bingBtn = document.createElement("button");
    bingBtn.className = "safetyexam-source-btn active";
    bingBtn.innerText = "必应";
    bingBtn.onclick = () => switchSearchSource();
    const googleBtn = document.createElement("button");
    googleBtn.className = "safetyexam-source-btn external";
    googleBtn.innerText = "谷歌";
    googleBtn.onclick = () => openExternalSearch("google");
    const googleTooltip = document.createElement("div");
    googleTooltip.className = "safetyexam-tooltip";
    googleTooltip.innerText = "谷歌不支持iframe嵌入，将在新标签页打开";
    googleBtn.appendChild(googleTooltip);
    sourceGroup.appendChild(baiduBtn);
    sourceGroup.appendChild(bingBtn);
    sourceGroup.appendChild(googleBtn);
    leftArea.appendChild(globalSearchTitle);
    leftArea.appendChild(sourceGroup);
    const closeButton = document.createElement("button");
    closeButton.className = "safetyexam-search-close";
    closeButton.innerText = "×";
    closeButton.onclick = () => {
      if (globalSearchContainer && globalSearchContainer.parentNode) {
        document.body.removeChild(globalSearchContainer);
        globalSearchContainer = null;
        globalSearchTitle = null;
        globalSearchIframe = null;
      }
    };
    header.appendChild(leftArea);
    header.appendChild(closeButton);
    globalSearchIframe = document.createElement("iframe");
    globalSearchIframe.className = "safetyexam-search-content";
    const resizeHandle = document.createElement("div");
    resizeHandle.className = "safetyexam-search-resize";
    globalSearchContainer.appendChild(header);
    globalSearchContainer.appendChild(globalSearchIframe);
    globalSearchContainer.appendChild(resizeHandle);
    document.body.appendChild(globalSearchContainer);
    makeDraggable(globalSearchContainer, header);
    makeResizable(globalSearchContainer, resizeHandle);
    updateSearchContent(questionNumber);
    console.log(`已为第${questionNumber}题创建搜索窗口`);
  };
  const extractQuestionText = (shitiElement) => {
    const h3Element = shitiElement.querySelector("h3");
    if (h3Element) {
      let questionText = h3Element.innerText.trim();
      questionText = questionText.replace(/^\d+[、\.\s]+/, "");
      return questionText;
    }
    return "";
  };
  const openExternalSearch = (source) => {
    if (!currentShitiElement) {
      console.error("当前没有选中的题目元素");
      return;
    }
    const questionText = extractQuestionText(currentShitiElement);
    if (!questionText) {
      console.error("无法提取题干文本");
      return;
    }
    const searchQuery = encodeURIComponent(questionText);
    const searchUrl = source === "baidu" ? `https://www.baidu.com/s?wd=${searchQuery}` : `https://www.google.com/search?q=${searchQuery}`;
    window.open(searchUrl, "_blank");
    const sourceNames = {
      "baidu": "百度",
      "google": "谷歌"
    };
    console.log(`已在${sourceNames[source]}中搜索（新标签页）：${questionText}`);
  };
  const switchSearchSource = (source) => {
    return;
  };
  const updateSearchContent = (questionNumber) => {
    if (!globalSearchTitle || !globalSearchIframe || !currentShitiElement) return;
    globalSearchTitle.innerText = `搜索第${questionNumber}题`;
    const questionText = extractQuestionText(currentShitiElement);
    if (!questionText) {
      console.error("无法提取题干文本");
      return;
    }
    const searchQuery = encodeURIComponent(questionText);
    const searchUrl = `https://cn.bing.com/search?q=${searchQuery}`;
    globalSearchIframe.src = searchUrl;
    console.log(`已在必应中搜索第${questionNumber}题：${questionText}`);
  };
  const makeDraggable = (element, handle) => {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;
    handle.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = element.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      element.style.left = `${initialLeft + deltaX}px`;
      element.style.top = `${initialTop + deltaY}px`;
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  };
  const makeResizable = (element, handle) => {
    let isResizing = false;
    let startX, startY;
    let initialWidth, initialHeight;
    handle.addEventListener("mousedown", (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = element.getBoundingClientRect();
      initialWidth = rect.width;
      initialHeight = rect.height;
      e.preventDefault();
      e.stopPropagation();
    });
    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newWidth = Math.max(300, initialWidth + deltaX);
      const newHeight = Math.max(200, initialHeight + deltaY);
      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
    });
    document.addEventListener("mouseup", () => {
      isResizing = false;
    });
  };
  const batchCopyAllQuestions = () => {
    const shitiElements = document.querySelectorAll(".shiti");
    let allText = "";
    shitiElements.forEach((shiti) => {
      const h3Element = shiti.querySelector("h3");
      if (!h3Element) return;
      const questionText = h3Element.innerText.trim();
      allText += `${questionText}
`;
      const optionElements = shiti.querySelectorAll('input[type="radio"]');
      optionElements.forEach((option) => {
        const label = shiti.querySelector(`label[for="${option.id}"]`);
        if (label) {
          allText += `${label.innerText.trim()}
`;
        }
      });
      allText += "\n";
    });
    console.log("题目内容：", allText);
    copyToClipboard(allText.trim(), 0);
    showToast("已复制全部题目到剪贴板", "success");
  };
  const aiCopyAllQuestions = () => {
    const shitiElements = document.querySelectorAll(".shiti");
    let questionsText = "";
    let questionsArray = [];
    let changeLine = `
`;
    shitiElements.forEach((shiti, index) => {
      const h3Element = shiti.querySelector("h3");
      if (!h3Element) return;
      const questionText = h3Element.innerText.trim();
      const cleanQuestion = questionText.replace(/^\d+[、\.\s]+/, "");
      const options = [];
      const optionElements = shiti.querySelectorAll('input[type="radio"]');
      optionElements.forEach((option) => {
        const label = shiti.querySelector(`label[for="${option.id}"]`);
        if (label) {
          options.push(label.innerText.trim());
        }
      });
      questionsText += `${index + 1}. ${cleanQuestion}${changeLine}`;
      options.forEach((option, optIndex) => {
        const optionElement = optionElements[optIndex];
        const optionValue = optionElement ? optionElement.value : String.fromCharCode(65 + optIndex);
        questionsText += `  ${String.fromCharCode(65 + optIndex)}. ${option} (value: ${optionValue})${changeLine}`;
      });
      questionsText += changeLine;
    });
    const prompt = `请搜索后思考，然后以JSON格式返回答案。

格式要求：
[
  {"id": 1, "answer": "A"},
  {"id": 2, "answer": "B"}
]

题目：
${questionsText.trim()}`;
    console.log("AI格式题目：", prompt);
    console.log(questionsArray);
    copyToClipboard(prompt, 0);
    showToast("已复制AI格式题目到剪贴板", "info");
    showJsonInputDialog();
  };
  const showJsonInputDialog = () => {
    const modal = document.createElement("div");
    modal.className = "safetyexam-json-modal";
    const content = document.createElement("div");
    content.className = "safetyexam-json-content";
    const header = document.createElement("div");
    header.className = "safetyexam-json-header";
    const title = document.createElement("div");
    title.className = "safetyexam-json-title";
    title.innerText = "粘贴AI生成的答案JSON";
    const closeBtn = document.createElement("button");
    closeBtn.className = "safetyexam-json-close";
    closeBtn.innerText = "×";
    closeBtn.onclick = () => {
      document.body.removeChild(modal);
    };
    header.appendChild(title);
    header.appendChild(closeBtn);
    const recommendationDiv = document.createElement("div");
    recommendationDiv.style.cssText = `
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 15px;
        font-size: 14px;
    `;
    const recommendationTitle = document.createElement("div");
    recommendationTitle.style.cssText = `
        font-weight: bold;
        color: #495057;
        margin-bottom: 8px;
    `;
    recommendationTitle.innerText = "推荐AI搜索引擎：";
    const recommendationContent = document.createElement("div");
    recommendationContent.style.cssText = `
        color: #6c757d;
        line-height: 1.5;
    `;
    recommendationContent.innerHTML = `
        <strong>使用方法</strong>：粘贴到GLM-4.5对话框中（题目和相关提示词已经自动复制到剪贴板里了） → 发送给AI获取JSON答案 → 粘贴到下方输入框<br>
        <strong>推荐AI工具</strong>：<a href="https://chat.z.ai/">Z.ai</a> - GLM-4.5 - 关闭深度思考，工具选择"全网搜索"<br>
    `;
    recommendationDiv.appendChild(recommendationContent);
    const textarea = document.createElement("textarea");
    textarea.className = "safetyexam-json-textarea";
    textarea.placeholder = `请粘贴AI生成的JSON，例如：
[
  {"id": 1, "answer": "A"},
  {"id": 2, "answer": "B"}
]`;
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "safetyexam-json-buttons";
    const parseBtn = document.createElement("button");
    parseBtn.className = "safetyexam-json-button primary";
    parseBtn.innerText = "解析并自动选择";
    parseBtn.onclick = () => {
      parseAndSelectAnswers(textarea.value, modal);
    };
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "safetyexam-json-button secondary";
    cancelBtn.innerText = "取消";
    cancelBtn.onclick = () => {
      document.body.removeChild(modal);
    };
    buttonContainer.appendChild(parseBtn);
    buttonContainer.appendChild(cancelBtn);
    content.appendChild(header);
    content.appendChild(recommendationDiv);
    content.appendChild(textarea);
    content.appendChild(buttonContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);
    setTimeout(() => {
      textarea.focus();
      textarea.select();
    }, 100);
  };
  const parseAndSelectAnswers = (jsonText, modal) => {
    try {
      console.log("输入的JSON文本:", jsonText);
      const answers = JSON.parse(jsonText);
      console.log("解析后的答案数组:", answers);
      if (!Array.isArray(answers)) {
        throw new Error("JSON格式错误：应为数组");
      }
      let successCount = 0;
      let errorCount = 0;
      answers.forEach((answer) => {
        console.log(`处理答案: id=${answer.id}, answer=${answer.answer}`);
        if (!answer.id || !answer.answer) {
          console.log(`答案格式错误，缺少id或answer字段`);
          errorCount++;
          return;
        }
        const shitiElements = document.querySelectorAll(".shiti");
        console.log(`找到 ${shitiElements.length} 个题目元素`);
        const targetShiti = shitiElements[answer.id - 1];
        if (!targetShiti) {
          console.log(`找不到第 ${answer.id} 题元素`);
          errorCount++;
          return;
        }
        console.log(`找到第 ${answer.id} 题元素:`, targetShiti);
        let targetOption = null;
        let usedValue = "";
        let matchMethod = "";
        console.log(`尝试方法1：直接查找 input[value="${answer.answer}"]`);
        targetOption = targetShiti.querySelector(`input[value="${answer.answer}"]`);
        if (targetOption) {
          usedValue = answer.answer;
          matchMethod = "直接匹配";
        }
        if (!targetOption && (answer.answer === "A" || answer.answer === "B")) {
          console.log(`尝试方法2：A/B格式转换`);
          const convertedValue = answer.answer === "A" ? "1" : "0";
          console.log(`将 ${answer.answer} 转换为 ${convertedValue}`);
          targetOption = targetShiti.querySelector(`input[value="${convertedValue}"]`);
          if (targetOption) {
            usedValue = convertedValue;
            matchMethod = "A/B转换";
          }
        }
        if (!targetOption && (answer.answer === "0" || answer.answer === "1")) {
          console.log(`尝试方法3：数字格式转换`);
          const convertedValue = answer.answer === "1" ? "A" : "B";
          console.log(`将 ${answer.answer} 转换为 ${convertedValue}`);
          targetOption = targetShiti.querySelector(`input[value="${convertedValue}"]`);
          if (targetOption) {
            usedValue = convertedValue;
            matchMethod = "数字转换";
          }
        }
        if (!targetOption) {
          console.log(`尝试方法4：按位置匹配`);
          const allOptions = targetShiti.querySelectorAll('input[type="radio"]');
          const answerIndex = answer.answer.toUpperCase().charCodeAt(0) - 65;
          if (answerIndex >= 0 && answerIndex < allOptions.length) {
            targetOption = allOptions[answerIndex];
            if (targetOption) {
              usedValue = targetOption.value;
              matchMethod = "位置匹配";
            }
          }
        }
        console.log(`最终匹配结果:`, targetOption ? `成功 (${matchMethod}, value: ${usedValue})` : "失败");
        if (targetOption) {
          targetOption.checked = true;
          console.log(`✅ 成功选择第 ${answer.id} 题的选项 ${answer.answer} (实际value: ${usedValue}, 方法: ${matchMethod})`);
          successCount++;
        } else {
          console.log(`❌ 第 ${answer.id} 题无法匹配答案 ${answer.answer}，检查所有选项:`);
          const allOptions = targetShiti.querySelectorAll('input[type="radio"]');
          allOptions.forEach((opt, idx) => {
            const optElement = opt;
            const label = targetShiti.querySelector(`label[for="${opt.id}"]`);
            const labelText = label ? label.innerText.trim() : "";
            console.log(`  选项${String.fromCharCode(65 + idx)}: value=${optElement.value}, id=${optElement.id}, text="${labelText}"`);
          });
          errorCount++;
        }
      });
      document.body.removeChild(modal);
      if (errorCount === 0) {
        showToast(`成功自动选择 ${successCount} 道题目！`, "success");
      } else {
        showToast(`成功选择 ${successCount} 道题目，失败 ${errorCount} 道`, "warning");
      }
    } catch (error) {
      showToast("JSON解析失败，请检查格式是否正确", "error");
      console.error("JSON解析错误:", error);
    }
  };
  const showToast = (message, type = "info") => {
    const toast = document.createElement("div");
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 30000;
        font-size: 14px;
        color: white;
        max-width: 300px;
    `;
    const colors = {
      success: "#28a745",
      error: "#dc3545",
      warning: "#ffc107",
      info: "#17a2b8"
    };
    toast.style.backgroundColor = colors[type];
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3e3);
  };
  checkExamMode();

})();