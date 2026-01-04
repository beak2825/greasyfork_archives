// ==UserScript==
// @name         기출넷플러스
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  기출넷(rlcnf.net)에서 문제플이/속성암기 기능 이용 시 단축키와 편의기능을 사용할 수 있게 해주는 스크립트입니다.
// @author       enc2586, Claude Code, Google Gemini
// @match        https://rlcnf.net/bbs/board.php?bo_table=*
// @match        http://rlcnf.net/bbs/board.php?bo_table=*
// @match        https://rlcnf.net/bbs/board.php*
// @match        http://rlcnf.net/bbs/board.php*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550319/%EA%B8%B0%EC%B6%9C%EB%84%B7%ED%94%8C%EB%9F%AC%EC%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/550319/%EA%B8%B0%EC%B6%9C%EB%84%B7%ED%94%8C%EB%9F%AC%EC%8A%A4.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let lastClickTime = 0;
  let lastBackTime = 0;
  const CLICK_COOLDOWN = 500;
  const BACK_COOLDOWN = 1000;
  let autoExplanationEnabled = true;
  let sideBySideEnabled = false;
  let autoScrollEnabled = true;

  const customCSS = `
        .kb-icon {
            display: inline-block;
            background-color: transparent;
            border: 1px solid #888;
            color: #555;
            box-shadow: none;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            font-family: 'Arial', sans-serif;
            margin-left: 9px;
            vertical-align: middle;
            position: relative;
            top: -1px;
        }
        .btn-container-flex {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
        }
        .auto-explanation-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            z-index: 10000;
            width: 80px;
            max-height: 40px;
            overflow: hidden;
            transition: width 0.3s ease-out, max-height 0.3s ease-out;
        }
        #go-btn {
            bottom: 70px !important;
        }
        .auto-explanation-popup:hover {
            width: 220px;
            max-height: 300px;
        }
        .popup-tab {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            margin: -12px -12px 8px -12px;
            background: #f8fafc;
            border-radius: 8px 8px 0 0;
            border-bottom: 1px solid #e2e8f0;
            cursor: pointer;
            position: relative;
            z-index: 1;
        }
        .popup-tab-icon {
            font-size: 16px;
        }
        .popup-tab-text {
            font-size: 12px;
            font-weight: 500;
            color: #64748b;
        }
        .auto-explanation-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .toggle-switch {
            position: relative;
            width: 36px;
            height: 20px;
            background: #e5e7eb;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .toggle-switch.active {
            background: #374151;
        }
        .toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background: white;
            border-radius: 50%;
            transition: transform 0.2s;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .toggle-switch.active .toggle-slider {
            transform: translateX(16px);
        }
        .toggle-label {
            color: #374151;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
        }
        .side-by-side-container {
            display: flex !important;
            align-items: flex-start;
            position: relative;
        }
        .side-by-side-container .view-content {
            flex: 0 0 30%;
            min-width: 0;
        }
        .side-by-side-container #explanation-section-parents {
            flex: 0 0 70%;
            min-width: 0;
            margin-top: 0 !important;
        }
        .resize-handle {
            width: 8px;
            background: #e5e7eb;
            cursor: col-resize;
            position: absolute;
            top: 0;
            bottom: 0;
            left: calc(30% - 4px);
            z-index: 10;
            opacity: 0;
            transition: opacity 1s ease-out, background-color 0.2s;
        }
        .resize-handle.show {
            opacity: 1;
        }
        .resize-handle:hover {
            background: #9ca3af;
            opacity: 1 !important;
            transition: opacity 0.1s ease-in, background-color 0.2s;
        }
        .resize-handle::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 3px;
            height: 30px;
            background: #6b7280;
            border-radius: 2px;
        }
        .side-by-side-enabled .col-md-offset-2 {
            margin-left: 0 !important;
        }
        .side-by-side-enabled .col-md-8 {
            width: 100% !important;
        }
        .toggle-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .toggle-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        html {
            scroll-behavior: smooth;
        }
    `;

  function addGlobalStyle(css) {
    const head = document.head || document.getElementsByTagName("head")[0];
    if (head) {
      const style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = css;
      head.appendChild(style);
    }
  }

  function setupUI() {
    const nextButton = document.querySelector("#scoring");
    if (!nextButton) return;

    const container = nextButton.parentElement;
    if (!container || !container.classList.contains("text-center")) return;

    container.classList.add("btn-container-flex");

    const nIcon = document.createElement("span");
    nIcon.className = "kb-icon";
    nIcon.textContent = "R";
    nextButton.append(nIcon);

    const bIcon = document.createElement("span");
    bIcon.className = "kb-icon";
    bIcon.textContent = "E";

    const prevButton = document.createElement("span");
    prevButton.id = "prev-problem-btn";

    const classesToCopy = Array.from(nextButton.classList).filter(
      (cls) => cls !== "trans-bg-crimson"
    );
    prevButton.className = classesToCopy.join(" ");

    prevButton.style.cursor = "pointer";

    prevButton.style.setProperty(
      "background-color",
      "transparent",
      "important"
    );
    prevButton.style.setProperty("color", "#000", "important");
    prevButton.style.setProperty("border", "none", "important");
    prevButton.style.setProperty("opacity", "1", "important");

    prevButton.textContent = "뒤로가기";
    prevButton.append(bIcon);

    prevButton.addEventListener("click", () => {
      const currentTime = Date.now();
      if (currentTime - lastBackTime >= BACK_COOLDOWN) {
        window.history.back();
        lastBackTime = currentTime;
      }
    });

    container.insertBefore(prevButton, nextButton);
  }

  function checkAndClickExplanationButton() {
    if (!autoExplanationEnabled) return;

    const explanationButton = document.querySelector("#more-explanation-btn");
    if (explanationButton && isElementVisible(explanationButton)) {
      explanationButton.click();
    }
  }

  function createResizeHandle() {
    const handle = document.createElement("div");
    handle.className = "resize-handle show";

    let isResizing = false;
    let startX = 0;
    let startLeftPercent = 30;
    let hideTimeout;

    // 초기 표시 후 2초 뒤 숨김
    setTimeout(() => {
      handle.classList.remove("show");
    }, 2000);

    handle.addEventListener("mouseenter", () => {
      clearTimeout(hideTimeout);
      handle.classList.add("show");
    });

    handle.addEventListener("mouseleave", () => {
      if (!isResizing) {
        hideTimeout = setTimeout(() => {
          handle.classList.remove("show");
        }, 2000);
      }
    });

    function updateHandlePosition(leftPercent) {
      handle.style.left = `calc(${leftPercent}% - 4px)`;
    }

    handle.addEventListener("mousedown", (e) => {
      isResizing = true;
      startX = e.clientX;

      const container = handle.parentElement;
      const leftPanel = container.querySelector(".view-content");

      const containerWidth = container.offsetWidth;
      startLeftPercent = (leftPanel.offsetWidth / containerWidth) * 100;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      e.preventDefault();
    });

    function handleMouseMove(e) {
      if (!isResizing) return;

      const container = handle.parentElement;
      const leftPanel = container.querySelector(".view-content");
      const rightPanel = container.querySelector(
        "#explanation-section-parents"
      );

      const deltaX = e.clientX - startX;
      const containerWidth = container.offsetWidth;
      const deltaPercent = (deltaX / containerWidth) * 100;

      const newLeftPercent = startLeftPercent + deltaPercent;
      const newRightPercent = 100 - newLeftPercent;

      // 최소 20%, 최대 80% 제한
      if (newLeftPercent >= 20 && newLeftPercent <= 80) {
        leftPanel.style.flex = `0 0 ${newLeftPercent}%`;
        rightPanel.style.flex = `0 0 ${newRightPercent}%`;
        updateHandlePosition(newLeftPercent);
      }
    }

    function handleMouseUp() {
      isResizing = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      // 드래그 완료 후 2초 뒤 숨김
      hideTimeout = setTimeout(() => {
        handle.classList.remove("show");
      }, 2000);
    }

    return handle;
  }

  function toggleSideBySideLayout() {
    const viewContent = document.querySelector(".view-content");
    const explanationSection = document.querySelector(
      "#explanation-section-parents"
    );
    const body = document.body;

    if (!viewContent || !explanationSection) return;

    let container = document.querySelector(".side-by-side-container");

    if (sideBySideEnabled) {
      if (!container) {
        container = document.createElement("div");
        container.className = "side-by-side-container";

        const parent = viewContent.parentNode;
        parent.insertBefore(container, viewContent);

        container.appendChild(viewContent);
        container.appendChild(explanationSection);

        const resizeHandle = createResizeHandle();
        container.appendChild(resizeHandle);
      }
      body.classList.add("side-by-side-enabled");
    } else {
      if (container) {
        const parent = container.parentNode;
        parent.insertBefore(viewContent, container);
        parent.insertBefore(explanationSection, container);
        container.remove();
      }
      body.classList.remove("side-by-side-enabled");
    }
  }

  function autoScrollToArticle() {
    if (!autoScrollEnabled) return;

    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("wr_id")) return;

    const article = document.querySelector("article.exam");
    if (article) {
      article.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function createTogglePopup() {
    const popup = document.createElement("div");
    popup.className = "auto-explanation-popup";
    popup.innerHTML = `
      <div class="popup-tab">
        <span class="popup-tab-icon">⚙️</span>
        <span class="popup-tab-text">설정</span>
      </div>
      <div class="toggle-group">
        <div class="toggle-item">
          <span class="toggle-label">자동 상세 풀이 보기</span>
          <div class="toggle-switch ${
            autoExplanationEnabled ? "active" : ""
          }" id="explanation-toggle">
            <div class="toggle-slider"></div>
          </div>
        </div>
        <div class="toggle-item">
          <span class="toggle-label">좌우 나란히 보기</span>
          <div class="toggle-switch ${
            sideBySideEnabled ? "active" : ""
          }" id="sidebyside-toggle">
            <div class="toggle-slider"></div>
          </div>
        </div>
        <div class="toggle-item">
          <span class="toggle-label">문제 영역으로 자동 스크롤</span>
          <div class="toggle-switch ${
            autoScrollEnabled ? "active" : ""
          }" id="autoscroll-toggle">
            <div class="toggle-slider"></div>
          </div>
        </div>
      </div>
    `;

    const explanationToggle = popup.querySelector("#explanation-toggle");
    explanationToggle.addEventListener("click", () => {
      autoExplanationEnabled = !autoExplanationEnabled;
      explanationToggle.classList.toggle("active", autoExplanationEnabled);
      localStorage.setItem("autoExplanationEnabled", autoExplanationEnabled);
    });

    const sideBySideToggle = popup.querySelector("#sidebyside-toggle");
    sideBySideToggle.addEventListener("click", () => {
      sideBySideEnabled = !sideBySideEnabled;
      sideBySideToggle.classList.toggle("active", sideBySideEnabled);
      localStorage.setItem("sideBySideEnabled", sideBySideEnabled);
      toggleSideBySideLayout();
    });

    const autoScrollToggle = popup.querySelector("#autoscroll-toggle");
    autoScrollToggle.addEventListener("click", () => {
      autoScrollEnabled = !autoScrollEnabled;
      autoScrollToggle.classList.toggle("active", autoScrollEnabled);
      localStorage.setItem("autoScrollEnabled", autoScrollEnabled);
    });

    document.body.appendChild(popup);
  }

  function initAutoExplanation() {
    const savedExplanation = localStorage.getItem("autoExplanationEnabled");
    if (savedExplanation !== null) {
      autoExplanationEnabled = savedExplanation === "true";
    }

    const savedSideBySide = localStorage.getItem("sideBySideEnabled");
    if (savedSideBySide !== null) {
      sideBySideEnabled = savedSideBySide === "true";
    }

    const savedAutoScroll = localStorage.getItem("autoScrollEnabled");
    if (savedAutoScroll !== null) {
      autoScrollEnabled = savedAutoScroll === "true";
    }

    createTogglePopup();
    toggleSideBySideLayout();

    setTimeout(() => {
      autoScrollToArticle();
    }, 100);

    const observer = new MutationObserver(() => {
      checkAndClickExplanationButton();
      // 좌우 나란히 보기가 활성화되어 있고 아직 적용되지 않았다면 다시 시도
      if (
        sideBySideEnabled &&
        !document.querySelector(".side-by-side-container")
      ) {
        toggleSideBySideLayout();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    checkAndClickExplanationButton();
  }

  console.log(`
키보드 단축키가 로드되었습니다:
- R: 다음문제
- E: 뒤로가기
    `);

  function isInInputField() {
    const activeElement = document.activeElement;
    if (!activeElement) return false;
    const tagName = activeElement.tagName.toUpperCase();
    const isContentEditable =
      activeElement.isContentEditable ||
      activeElement.getAttribute("contentEditable") === "true";
    return (
      ["INPUT", "TEXTAREA", "SELECT"].includes(tagName) || isContentEditable
    );
  }

  function isModalOpen() {
    const modalSelectors = [".modal", ".popup", ".dialog", '[role="dialog"]'];
    return modalSelectors.some((selector) => {
      const element = document.querySelector(selector);
      return element && (element.offsetWidth > 0 || element.offsetHeight > 0);
    });
  }

  function isElementVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return !(
      el.offsetParent === null ||
      style.display === "none" ||
      style.visibility === "hidden"
    );
  }

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
      return;
    if (isInInputField()) return;
    if (isModalOpen()) return;

    const currentTime = Date.now();
    let actionTaken = false;

    switch (event.key) {
      case "r":
      case "R":
      case "ㄱ":
        if (currentTime - lastClickTime < CLICK_COOLDOWN) break;
        const scoringButton = document.querySelector("#scoring");
        if (!scoringButton) {
          break;
        }
        if (!isElementVisible(scoringButton)) {
          break;
        }
        scoringButton.click();
        lastClickTime = currentTime;
        actionTaken = true;
        break;

      case "e":
      case "E":
      case "ㄷ":
        if (currentTime - lastBackTime < BACK_COOLDOWN) break;
        window.history.back();
        lastBackTime = currentTime;
        actionTaken = true;
        break;
    }

    if (actionTaken) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  addGlobalStyle(customCSS);
  setupUI();
  initAutoExplanation();
})();
