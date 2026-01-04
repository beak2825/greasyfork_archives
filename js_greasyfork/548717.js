// ==UserScript==
// @name         Custom Markers Pro
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Advanced marker system with integrated expanding button menu
// @author       Disruptor
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://unpkg.com/jspdf@2.5.2/dist/jspdf.umd.min.js
// @license      GPL-3.0
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+DQo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgY2xhc3M9Imljb24iICB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTMwOS4yIDU4NC43NzZoMTA1LjVsLTQ5IDE1My4ySDIyNS44Yy03LjMgMC0xMy4zLTYtMTMuMy0xMy4zIDAtMi42IDAuOC01LjEgMi4yLTcuM2w4My40LTEyNi43YzIuNS0zLjYgNi43LTUuOSAxMS4xLTUuOXoiIGZpbGw9IiNGRkZGRkYiIC8+PHBhdGggZD0iTTQwNC41IDc5MS4yNzZIMjI1LjhjLTM2LjcgMC02Ni41LTI5LjgtNjYuNS02Ni41IDAtMTMgMy44LTI1LjcgMTEtMzYuNmw4My40LTEyNi43YzEyLjMtMTguNyAzMy4xLTI5LjkgNTUuNS0yOS45aDE3OC40bC04My4xIDI1OS43eiBtLTk1LjMtMjA2LjVjLTQuNSAwLTguNiAyLjItMTEuMSA2bC04My40IDEyNi43Yy0xLjQgMi4yLTIuMiA0LjctMi4yIDcuMyAwIDcuMyA2IDEzLjMgMTMuMyAxMy4zaDEzOS45bDQ5LTE1My4ySDMwOS4yeiIgZmlsbD0iIzMzMzMzMyIgLz48cGF0aCBkPSJNNDU0LjYgNTg0Ljc3NmgxMDkuNmwyNS4zIDE1My4zSDQyOS4zeiIgZmlsbD0iI0ZGRkZGRiIgLz48cGF0aCBkPSJNNjUyLjIgNzkxLjI3NkgzNjYuNmw0Mi44LTI1OS42aDIwMGw0Mi44IDI1OS42eiBtLTIyMi45LTUzLjJoMTYwLjJsLTI1LjMtMTUzLjNINDU0LjZsLTI1LjMgMTUzLjN6IiBmaWxsPSIjMzMzMzMzIiAvPjxwYXRoIGQ9Ik02MTguNiA1ODQuNzc2aDEwNS41YzQuNSAwIDguNiAyLjIgMTEuMSA2bDgzLjUgMTI2LjdjNCA2LjEgMi4zIDE0LjQtMy44IDE4LjQtMi4yIDEuNC00LjcgMi4yLTcuMyAyLjJINjY3LjdsLTQ5LjEtMTUzLjN6IiBmaWxsPSIjRkZGRkZGIiAvPjxwYXRoIGQ9Ik04MDcuNiA3OTEuMjc2SDYyOC45bC04My4xLTI1OS43aDE3OC40YzIyLjQgMCA0My4yIDExLjIgNTUuNSAyOS45bDgzLjQgMTI2LjdjOS44IDE0LjggMTMuMiAzMi42IDkuNiA1MHMtMTMuNyAzMi4zLTI4LjYgNDIuMWMtMTAuOCA3LjItMjMuNSAxMS0zNi41IDExeiBtLTEzOS45LTUzLjJoMTM5LjljMi42IDAgNS4xLTAuOCA3LjMtMi4yIDQtMi42IDUuMy02LjQgNS43LTguNCAwLjQtMiAwLjctNi0xLjktMTBsLTgzLjQtMTI2LjZjLTIuNS0zLjgtNi42LTYtMTEuMS02SDYxOC42bDQ5LjEgMTUzLjJ6IiBmaWxsPSIjMzMzMzMzIiAvPjxwYXRoIGQ9Ik01MzQuMSA2MzkuN0M2NTIuNSA1MzcuNCA3MTEuNyA0NDUuOCA3MTEuNyAzNjVjMC0xMjctMTAyLjctMjEyLjEtMTk1LTIxMi4xcy0xOTUgODUuMS0xOTUgMjEyLjFjMCA4MC44IDU5LjIgMTcyLjMgMTc3LjcgMjc0LjcgOS45IDguNiAyNC43IDguNiAzNC43IDB6IiBmaWxsPSIjOENBQUZGIiAvPjxwYXRoIGQ9Ik01MTYuNyA2NzIuN2MtMTIuNSAwLTI0LjktNC4zLTM0LjgtMTIuOUMzNTYuMiA1NTEuMiAyOTUuMSA0NTQuNyAyOTUuMSAzNjVjMC0xNDIuOCAxMTQuNi0yMzguNyAyMjEuNi0yMzguN1M3MzguMyAyMjIuMiA3MzguMyAzNjVjMCA4OS43LTYxLjEgMTg2LjItMTg2LjkgMjk0LjgtOS44IDguNi0yMi4zIDEyLjktMzQuNyAxMi45eiBtMC00OTMuMmMtNzkuNyAwLTE2OC40IDc2LjItMTY4LjQgMTg1LjUgMCA3Mi4zIDU2LjcgMTU4IDE2OC40IDI1NC42QzYyOC41IDUyMyA2ODUuMSA0MzcuMyA2ODUuMSAzNjVjMC0xMDkuMy04OC43LTE4NS41LTE2OC40LTE4NS41eiIgZmlsbD0iIzMzMzMzMyIgLz48cGF0aCBkPSJNNTE2LjcgMzQ4bS05Ny41IDBhOTcuNSA5Ny41IDAgMSAwIDE5NSAwIDk3LjUgOTcuNSAwIDEgMC0xOTUgMFoiIGZpbGw9IiNGRkZGRkYiIC8+PHBhdGggZD0iTTUxNi43IDQ3Mi4xYy02OC40IDAtMTI0LjEtNTUuNy0xMjQuMS0xMjQuMXM1NS43LTEyNC4xIDEyNC4xLTEyNC4xUzY0MC44IDI3OS41IDY0MC44IDM0OCA1ODUuMSA0NzIuMSA1MTYuNyA0NzIuMXogbTAtMTk1LjFjLTM5LjEgMC03MC45IDMxLjgtNzAuOSA3MC45IDAgMzkuMSAzMS44IDcwLjkgNzAuOSA3MC45czcwLjktMzEuOCA3MC45LTcwLjljMC0zOS4xLTMxLjgtNzAuOS03MC45LTcwLjl6IiBmaWxsPSIjMzMzMzMzIiAvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/548717/Custom%20Markers%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/548717/Custom%20Markers%20Pro.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Check if GM_addStyle is available, provide fallback if not
  if (typeof GM_addStyle === 'undefined') {
    window.GM_addStyle = function (css) {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    };
  }

  // Modern UI Styles with Glassmorphism and Integrated Button System
  GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --success-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      --warning-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      --glass-bg: rgba(255, 255, 255, 0.95);
      --glass-border: rgba(255, 255, 255, 0.18);
      --shadow-color: rgba(31, 38, 135, 0.37);
      --text-primary: #1a202c;
      --text-secondary: #4a5568;
      --border-radius: 20px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cm-dark-mode {
      --glass-bg: rgba(30, 30, 30, 0.95);
      --glass-border: rgba(255, 255, 255, 0.1);
      --text-primary: #f0f0f0;
      --text-secondary: #b0b0b0;
      --shadow-color: rgba(0, 0, 0, 0.5);
    }

    /* Integrated Button System */
    #cm-button-container {
      position: fixed;
      bottom: 8px;
      right: 8px;
      z-index: 2147483647;
      pointer-events: auto;
    }

    #cm-button-container .button-box {
      position: relative;
      width: 4rem;
      height: 14rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      user-select: none;
    }

    #cm-button-container .touch {
      flex: 1;
      width: 100%;
      cursor: pointer;
      background: transparent;
      pointer-events: auto;
    }

    #cm-button-container .button {
      width: 2.3rem;
      height: 2.3rem;
      position: absolute;
      left: 50%;
      bottom: 0%;
      transform: translate(-50%, 0);
      cursor: pointer;
      border: 2px solid #311703;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0.95;
      box-shadow: inset 0 0 6px rgba(0,0,0,0.35);
      backdrop-filter: blur(10px);
      -webkit-backface-visibility: hidden;
      font-size: 24px;
    }

    #cm-button-container .button .icon {
      width: 18px;
      height: 18px;
      transition: transform .15s ease;
      opacity: 0.95;
      transform-origin: 50% 50%;
    }

    /* Button colors */
    /* Panel button */
    #cm-button-container .button:nth-child(6)  {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 30;
    }
    /* Edit button */
    #cm-button-container .button:nth-child(7)  {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      z-index: 35;
    }
    /* Drawing button */
    #cm-button-container .button:nth-child(8)  {
      background: linear-gradient(135deg, #fee140 0%, #fa709a 100%);
      z-index: 40;
    }
    /* Bulk button */
    #cm-button-container .button:nth-child(9)  {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      z-index: 45;
    }
    /* Deactivate button */
    #cm-button-container .button:nth-child(10) {
      background: linear-gradient(135deg, #f56565 0%, #ed64a6 100%);
      z-index: 35;
    }
    /* Main gear button */
    #cm-button-container .button:nth-child(11) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 50;
    }

    /* Expanded positions */
    #cm-button-container:hover .button:nth-child(6)  {
      transform: translate(-50%, -250px) rotate(0deg);
      opacity: 1;
    }
    #cm-button-container:hover .button:nth-child(7)  {
      transform: translate(-50%, -200px) rotate(0deg);
      opacity: 1;
    }
    #cm-button-container:hover .button:nth-child(8)  {
      transform: translate(-50%, -150px) rotate(0deg);
      opacity: 1;
    }
    #cm-button-container:hover .button:nth-child(9)  {
      transform: translate(-50%, -100px) rotate(0deg);
      opacity: 1;
    }
    #cm-button-container:hover .button:nth-child(10) {
      transform: translate(-50%, -50px) rotate(0deg);
      opacity: 1;
    }
    #cm-button-container:hover .button:nth-child(11) {
      transform: translate(-50%, 0px) rotate(0deg);
      opacity: 1;
    }

    /* Touch area hover effects */
    #cm-button-container .touch.btn1:hover ~ .button:nth-child(6)  {
      transform: translate(-50%, -250px) rotate(0deg);
      opacity: 1;
    }
    #cm-button-container .touch.btn2:hover ~ .button:nth-child(7)  {
      transform: translate(-50%, -200px) rotate(0deg);
      opacity: 1;
    }
    #cm-button-container .touch.btn3:hover ~ .button:nth-child(8)  {
      transform: translate(-50%, -150px) rotate(0deg);
      opacity: 1;
    }
    #cm-button-container .touch.btn4:hover ~ .button:nth-child(9)  {
      transform: translate(-50%, -100px) rotate(0deg);
      opacity: 1;
    }
    #cm-button-container .touch.btn5:hover ~ .button:nth-child(10) {
      transform: translate(-50%, -50px) rotate(0deg);
      opacity: 1;
    }
    #cm-button-container .touch.btn6:hover ~ .button:nth-child(11) {
      transform: translate(-50%, 0px) rotate(0deg);
      opacity: 1;
    }

    #cm-button-container .button:hover {
      transform: scale(1.1);
      filter: drop-shadow(0 0 20px currentColor);
    }

    #cm-button-container .button:active {
      transform: scale(0.95);
    }

    /* Active states for toggle buttons */
    #cm-button-container .button.active {
      filter: drop-shadow(0 0 15px currentColor);
      border-color: rgba(255,255,255,0.5);
    }

    #cm-button-container .button.active::after {
      content: '✓';
      position: absolute;
      top: -5px;
      right: -5px;
      background: #43e97b;
      color: white;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    /* Tooltip for buttons */
    #cm-button-container .button-tooltip {
      position: absolute;
      left: -120px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }

    #cm-button-container .button:hover .button-tooltip {
      opacity: 1;
    }

    /* Animation for the main gear button */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    #cm-button-container .button[data-button="main"]:hover .icon {
      animation: spin 1.2s linear infinite;
    }

    /* Quick actions menu */
    .cm-quick-actions {
      background: white;
      border-radius: 12px;
      padding: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      z-index: 2147483647;
      min-width: 180px;
    }

    .cm-quick-action {
      padding: 10px;
      cursor: pointer;
      transition: background 0.3s;
      border-radius: 8px;
    }

    .cm-quick-action:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    /* Fix for dark background sites */
    .cm-drawing-canvas.active {
      background: rgba(255, 255, 255, 0.01);
    }


    @keyframes float {
      0%, 100% { transform: translateY(0px) translateZ(0); }
      50% { transform: translateY(-10px) translateZ(0); }
    }


    /* Activation button for initial state */
    .cm-activate-container {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 2147483640;
    }

    .cm-activate-btn {
      width: 2.3rem;
      height: 2.3rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 32px;
      cursor: pointer;
      border: 2px solid #311703;
      border-radius: 6px;
      box-shadow: inset 0 0 6px rgba(0,0,0,0.35);
      filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.8));
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease;
    }

    .cm-activate-btn:hover {
      filter: drop-shadow(0 0 25px rgba(102, 126, 234, 1));
      transform: scale(1.15) rotate(10deg);
      box-shadow: 0 0 15px rgba(102, 126, 234, 0.6);
    }

    .cm-activate-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 2147483641;
      bottom: 70px;
      right: 0;
    }

    .cm-activate-btn:hover + .cm-activate-tooltip {
      opacity: 1;
    }

    .cm-panel {
      position: fixed;
      top: 0;
      right: -450px;
      width: 450px;
      height: 100vh;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: -10px 0 40px rgba(0,0,0,0.1);
      z-index: 2147483641;
      transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      font-family: 'Inter', sans-serif;
      border-left: 1px solid var(--glass-border);
    }

    .cm-panel.cm-dark-mode {
      background: rgba(30, 30, 30, 0.95);
      color: #f0f0f0;
    }

    .cm-panel.active {
      right: 0;
    }

    .cm-panel-header {
      background: var(--primary-gradient);
      color: white;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .cm-panel-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .cm-panel-title {
      font-size: 22px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cm-header-buttons {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .cm-theme-toggle,
    .cm-close-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.3);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      font-size: 18px;
    }

    .cm-theme-toggle:hover,
    .cm-close-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: scale(1.1);
    }

    .cm-close-btn:hover {
      transform: rotate(90deg);
    }

    .cm-panel-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%);
    }

    .cm-dark-mode .cm-panel-content {
      background: linear-gradient(180deg, rgba(40,40,40,0.9) 0%, rgba(50,50,50,0.9) 100%);
    }

    .cm-panel-content::-webkit-scrollbar {
      width: 8px;
    }

    .cm-panel-content::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
    }

    .cm-panel-content::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #667eea, #764ba2);
      border-radius: 4px;
    }

    .cm-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      background: rgba(0,0,0,0.03);
      padding: 4px;
      border-radius: 16px;
    }

    .cm-dark-mode .cm-tabs {
      background: rgba(255,255,255,0.05);
    }

    .cm-tab {
      flex: 1;
      padding: 10px 16px;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      transition: var(--transition);
    }

    .cm-tab.active {
      background: white;
      color: var(--text-primary);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .cm-dark-mode .cm-tab.active {
      background: rgba(60,60,60,1);
      color: #f0f0f0;
    }

    .cm-tab:hover:not(.active) {
      background: rgba(255,255,255,0.5);
    }

    .cm-form {
      background: white;
      padding: 24px;
      border-radius: var(--border-radius);
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      margin-bottom: 24px;
    }

    .cm-dark-mode .cm-form {
      background: rgba(50,50,50,1);
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .cm-form-group {
      margin-bottom: 20px;
    }

    .cm-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: var(--text-primary);
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .cm-input,
    .cm-textarea,
    .cm-select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 15px;
      transition: var(--transition);
      font-family: 'Inter', sans-serif;
      background: white;
      box-sizing: border-box;
    }

    .cm-dark-mode .cm-input,
    .cm-dark-mode .cm-textarea,
    .cm-dark-mode .cm-select {
      background: rgba(40,40,40,1);
      border-color: rgba(255,255,255,0.1);
      color: #f0f0f0;
    }

    .cm-input:focus,
    .cm-textarea:focus,
    .cm-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .cm-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .cm-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .cm-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s;
    }

    .cm-btn:active::before {
      width: 300px;
      height: 300px;
    }

    .cm-btn-primary {
      background: var(--primary-gradient);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .cm-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .cm-btn-secondary {
      background: #f7fafc;
      color: var(--text-primary);
      border: 2px solid #e2e8f0;
    }

    .cm-dark-mode .cm-btn-secondary {
      background: rgba(60,60,60,1);
      color: #f0f0f0;
      border-color: rgba(255,255,255,0.2);
    }

    .cm-btn-secondary:hover {
      background: #edf2f7;
      border-color: #cbd5e0;
    }

    .cm-btn-success {
      background: var(--success-gradient);
      color: white;
      box-shadow: 0 4px 15px rgba(67, 233, 123, 0.3);
    }

    .cm-btn-danger {
      background: linear-gradient(135deg, #f56565 0%, #ed64a6 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(245, 101, 101, 0.3);
    }

    #donate-btn {
      transition: all 0.3s ease;
    }

    #donate-btn:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 25px rgba(255, 196, 57, 0.4);
    }

    #donate-btn:hover span {
      animation: coffeeShake 0.5s ease-in-out;
    }

    @keyframes coffeeShake {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-10deg); }
      75% { transform: rotate(10deg); }
    }

    .cm-search-container {
      position: relative;
      margin-bottom: 20px;
    }

    .cm-search-input {
      width: 100%;
      padding: 14px 48px 14px 20px;
      border: 2px solid #e2e8f0;
      border-radius: 50px;
      font-size: 15px;
      transition: var(--transition);
      font-family: 'Inter', sans-serif;
      box-sizing: border-box;
    }

    .cm-dark-mode .cm-search-input {
      background: rgba(40,40,40,1);
      border-color: rgba(255,255,255,0.1);
      color: #f0f0f0;
    }

    .cm-search-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .cm-search-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #a0aec0;
      pointer-events: none;
    }

    .cm-marker-item {
      background: white;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      transition: var(--transition);
      border: 2px solid transparent;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .cm-dark-mode .cm-marker-item {
      background: rgba(50,50,50,1);
    }

    .cm-marker-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent);
      transition: left 0.5s;
    }

    .cm-marker-item:hover {
      transform: translateX(-4px);
      border-color: #667eea;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
    }

    .cm-marker-item:hover::before {
      left: 100%;
    }

    .cm-marker-item.selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      border-color: #667eea;
    }

    .cm-icon-preview {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: var(--primary-gradient);
      border-radius: 16px;
      font-size: 32px;
      margin-top: 10px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      animation: iconBounce 2s ease-in-out infinite;
    }

    @keyframes iconBounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `);

  // Adding animation keyframes and remaining CSS

  GM_addStyle(`
    @keyframes markerPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }

    @keyframes markerBounce {
      0%, 100% { transform: translateY(0); }
      25% { transform: translateY(-10px); }
      75% { transform: translateY(-5px); }
    }

    @keyframes markerRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes markerGlow {
      0%, 100% { filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.5)); }
      50% { filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.8)); }
    }

    @keyframes markerShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    @keyframes markerWiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }

    @keyframes markerFade {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes markerFlip {
      0% { transform: rotateY(0); }
      100% { transform: rotateY(360deg); }
    }

    @keyframes markerZoom {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.5); }
    }

    @keyframes markerSlide {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(10px); }
    }

    @keyframes markerSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .cm-marker.animate-pulse { animation: markerPulse 2s ease-in-out infinite; }
    .cm-marker.animate-bounce { animation: markerBounce 1.5s ease-in-out infinite; }
    .cm-marker.animate-rotate { animation: markerRotate 3s linear infinite; }
    .cm-marker.animate-glow { animation: markerGlow 2s ease-in-out infinite; }
    .cm-marker.animate-shake { animation: markerShake 0.5s ease-in-out infinite; }
    .cm-marker.animate-wiggle { animation: markerWiggle 1s ease-in-out infinite; }
    .cm-marker.animate-fade { animation: markerFade 2s ease-in-out infinite; }
    .cm-marker.animate-flip { animation: markerFlip 3s ease-in-out infinite; }
    .cm-marker.animate-zoom { animation: markerZoom 2s ease-in-out infinite; }
    .cm-marker.animate-slide { animation: markerSlide 2s ease-in-out infinite; }
    .cm-marker.animate-spin { animation: markerSpin 2s linear infinite; }

    .cm-drawing-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483636;
    }

    .cm-drawing-canvas.active {
      pointer-events: auto;
      cursor: crosshair;
    }

    .cm-drawing-shape {
      position: absolute;
      border: 3px solid #667eea;
      background: rgba(102, 126, 234, 0.1);
      pointer-events: auto;
      cursor: move;
    }

    .cm-drawing-shape.circle {
      border-radius: 50%;
    }

    .cm-drawing-shape.line,
    .cm-drawing-shape.arrow {
      height: 0;
      background: none;
      border: none;
      border-top: 3px solid #667eea;
      transform-origin: left center;
    }

    .cm-drawing-shape.arrow::after {
      content: '';
      position: absolute;
      right: -10px;
      top: -8px;
      width: 0;
      height: 0;
      border-left: 10px solid #667eea;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
    }

    .cm-drawing-shape.text {
      border: none;
      background: none;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      padding: 4px 8px;
      color: #667eea;
    }

    .cm-drawing-canvas .cm-drawing-shape.selected {
      border-color: #f5576c !important;
      background: rgba(245, 87, 108, 0.1) !important;
      box-shadow: 0 0 10px rgba(245, 87, 108, 0.5);
    }

    .cm-svg-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483635;
    }

    .cm-svg-canvas path {
      pointer-events: stroke;
      cursor: pointer;
    }

    .cm-svg-canvas path.selected {
      stroke: #f5576c !important;
      stroke-width: 4 !important;
      fill: none;
    }

    .cm-drawing-toolbar {
      position: fixed;
      top: 80px;
      left: 20px;
      background: white;
      padding: 8px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      display: none;
      flex-direction: column;
      gap: 4px;
      z-index: 2147483637;
      max-height: calc(100vh - 160px);
      overflow-y: auto;
    }

    .cm-drawing-toolbar.active {
      display: flex;
    }

    .cm-drawing-toolbar-section {
      padding: 8px;
      border-bottom: 1px solid #e2e8f0;
    }

    .cm-drawing-toolbar-section:last-child {
      border-bottom: none;
    }

    .cm-drawing-toolbar-title {
      font-size: 12px;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .cm-drawing-tools {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
    }

    .cm-drawing-tool {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: 2px solid #e2e8f0;
      background: #cce5ff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      font-size: 18px;
    }

    .cm-drawing-tool:hover {
      border-color: #667eea;
      transform: scale(1.1);
    }

    .cm-drawing-tool.active {
      background: var(--primary-gradient);
      border-color: transparent;
      color: white;
    }

    .cm-bulk-toolbar {
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 16px 24px;
      border-radius: 50px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      display: none;
      align-items: center;
      gap: 16px;
      z-index: 2147483637;
    }

    .cm-bulk-toolbar.active {
      display: flex;
    }

    .cm-bulk-count {
      font-weight: 600;
      color: var(--text-primary);
    }

    .cm-settings {
      background: white;
      padding: 24px;
      border-radius: var(--border-radius);
      margin-top: 20px;
    }

    .cm-dark-mode .cm-settings {
      background: rgba(50,50,50,1);
    }

    .cm-settings-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cm-settings-group {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e2e8f0;
    }

    .cm-settings-group:last-child {
      border-bottom: none;
    }

    .cm-toggle-switch {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .cm-switch {
      position: relative;
      width: 50px;
      height: 26px;
    }

    .cm-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .cm-switch-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #cbd5e0;
      transition: 0.3s;
      border-radius: 26px;
    }

    .cm-switch-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    .cm-switch input:checked + .cm-switch-slider {
      background: var(--primary-gradient);
    }

    .cm-switch input:checked + .cm-switch-slider:before {
      transform: translateX(24px);
    }

    .cm-note-editor {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-top: 20px;
    }

    .cm-dark-mode .cm-note-editor {
      background: rgba(50,50,50,1);
    }

    .cm-note-toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e2e8f0;
    }

    .cm-note-tool {
      width: 36px;
      height: 36px;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }

    .cm-dark-mode .cm-note-tool {
      background: rgba(40,40,40,1);
      border-color: rgba(255,255,255,0.1);
    }

    .cm-note-tool:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    .cm-note-tool.active {
      background: var(--primary-gradient);
      border-color: transparent;
      color: white;
    }

    .cm-note-content {
      min-height: 200px;
      padding: 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      line-height: 1.6;
    }

    .cm-dark-mode .cm-note-content {
      background: rgba(40,40,40,1);
      border-color: rgba(255,255,255,0.1);
      color: #f0f0f0;
    }

    .cm-note-content:focus {
      outline: none;
      border-color: #667eea;
    }

    .cm-export-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 16px;
    }

    .cm-export-option {
      padding: 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      text-align: center;
      transition: var(--transition);
      font-weight: 500;
    }

    .cm-dark-mode .cm-export-option {
      border-color: rgba(255,255,255,0.1);
    }

    .cm-export-option:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    .cm-export-option-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .cm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483635;
    }

    .cm-overlay.active {
      pointer-events: auto;
    }

    .cm-marker {
      position: absolute;
      cursor: pointer;
      pointer-events: auto;
      font-size: 32px;
      filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));
      transition: transform 0.2s;
      user-select: none;
      z-index: 2147483636;
    }

    .cm-marker:hover {
      transform: scale(1.15);
    }

    .cm-marker.dragging {
      cursor: grabbing;
      transform: scale(1.2);
      z-index: 2147483637;
    }

    .cm-marker.selected {
      filter: drop-shadow(0 0 10px rgba(245, 87, 108, 0.8));
    }

    .cm-marker.anchored::after {
      content: '🔗';
      position: absolute;
      top: -5px;
      right: -5px;
      font-size: 12px;
      background: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cm-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.95);
      color: white;
      padding: 16px;
      border-radius: 12px;
      max-width: 350px;
      pointer-events: none;
      z-index: 2147483642;
      display: none;
      font-size: 14px;
      line-height: 1.6;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .cm-tooltip.active {
      display: block;
    }

    .cm-tooltip.persistent {
      pointer-events: auto;
    }

    .cm-tooltip-close {
      float: right;
      cursor: pointer;
      padding: 4px;
      font-size: 16px;
      opacity: 0.8;
      transition: opacity 0.3s;
    }

    .cm-tooltip-close:hover {
      opacity: 1;
    }

    .cm-message {
      padding: 12px 20px;
      border-radius: 12px;
      margin: 12px 0;
      font-size: 14px;
      display: none;
      animation: slideInRight 0.3s ease;
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .cm-message.success {
      background: linear-gradient(135deg, rgba(67, 233, 123, 0.1), rgba(56, 249, 215, 0.1));
      color: #22543d;
      border: 2px solid #48bb78;
      display: block;
    }

    .cm-message.error {
      background: linear-gradient(135deg, rgba(245, 101, 101, 0.1), rgba(237, 100, 166, 0.1));
      color: #742a2a;
      border: 2px solid #fc8181;
      display: block;
    }

    .cm-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(102, 126, 234, 0.2);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .cm-context-menu {
      position: absolute;
      background: white;
      border-radius: 12px;
      padding: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      z-index: 2147483641;
      display: none;
      min-width: 200px;
    }

    .cm-dark-mode .cm-context-menu {
      background: rgba(40,40,40,1);
    }

    .cm-context-menu.active {
      display: block;
    }

    .cm-shape-context-menu .cm-shape-context-item {
      padding: 10px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 10px;
      user-select: none;
    }

    .cm-shape-context-menu .cm-shape-context-item:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    .cm-context-item {
      padding: 10px 16px;
      border-radius: 8px;
      cursor: pointer !important;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 10px;
      user-select: none;
      background: rgba(26, 32, 44, 0.1);
      margin-bottom: 6px;
    }

    .cm-context-item:hover {
      background: rgba(102, 126, 234, 0.5);
    }

    .cm-marker-checkbox {
      width: 18px;
      height: 18px;
      margin-right: 12px;
      cursor: pointer;
    }
  `);

  // ========================================
  // Configuration & State
  // ========================================
  const WEBSITE_HOST = window.location.hostname;
  const STORAGE_KEY = `custom_markers_${WEBSITE_HOST}`;
  const NOTES_KEY = `custom_markers_notes_${WEBSITE_HOST}`;
  const WEBHOOK_URL = 'Add your webhook URL here'; // Add your webhook URL here
  const CLOUD_SYNC_API = 'Add your cloud sync API endpoint here'; // Add your cloud sync API endpoint here

  let state = {
    markers: [],
    shapes: [],
    paths: [],
    isEditMode: false,
    isDrawingMode: false,
    isBulkMode: false,
    isDragging: false,
    currentDragItem: null,
    editingMarkerId: null,
    selectedMarkers: new Set(),
    selectedShapeId: null,
    currentDrawingTool: 'rectangle',
    animationType: 'pulse',
    tooltip: null,
    isInitialized: false,
    currentTab: 'markers',
    isDarkMode: false,
    anchoredItems: new Map(),
    settings: {
      autoSave: true,
      animations: true,
      soundEffects: false,
      cloudSync: false,
      webhooks: false,
      contextDetection: true,
    },
  };

  // Icon Options with Categories - Fixed Emojis
  const iconOptions = {
    Basic: {
      '📍': 'Location Pin',
      '⭐': 'Star',
      '🌟': 'Special',
      '⚠️': 'Warning',
      '❗': 'Important',
      '❓': 'Question',
      '💡': 'Idea',
      '📝': 'Note',
      '📸': 'Photo',
      '📌': 'Push Pin',
      '📎': 'Attachment',
    },
    Places: {
      '🏠': 'House',
      '⛺': 'Camp',
      '🏰': 'Castle',
      '🏭': 'Factory',
      '🎪': 'Event',
      '🏤': 'Post Office',
      '🏥': 'Hospital',
      '🏫': 'School',
      '🛕': 'Temple',
      '🏝️': 'Island',
      '🗺️': 'Map',
    },
    'Travel & Vehicles': {
      '⚓': 'Anchor',
      '🚢': 'Ship',
      '🚤': 'Boat',
      '🛶': 'Canoe',
      '🛳️': 'Cruise Ship',
      '✈️': 'Airplane',
      '🚁': 'Helicopter',
      '🚀': 'Rocket',
      '🚗': 'Car',
      '🚙': 'SUV',
      '🏎️': 'Race Car',
      '🚌': 'Bus',
      '🚉': 'Station',
      '🚆': 'Train',
      '🚲': 'Bicycle',
      '🛴': 'Scooter',
      '🛸': 'UFO',
    },
    'Combat & RPG': {
      '⚔️': 'Battle',
      '🗡': 'Dagger',
      '🏹': 'Bow & Arrow',
      '🛡️': 'Shield',
      '🔮': 'Crystal Ball',
      '🧙': 'Mage',
      '🧌': 'Troll',
      '🐲': 'Eastern Dragon',
      '💀': 'Danger',
      '🔥': 'Fire',
      '⚡': 'Lightning',
      '⛓️': 'Chains',
      '🪄': 'Wand',
      '📜': 'Scroll',
    },
    'Resources & Items': {
      '📦': 'Loot Box',
      '💎': 'Diamond',
      '🪙': 'Coin',
      '💰': 'Bag of Gold',
      '🥇': 'Medal',
      '🎁': 'Treasure',
      '🧪': 'Potion',
      '⚗️': 'Alchemy',
      '🔑': 'Key',
      '🧊': 'Ice Cube',
      '🗝': 'Ancient Key',
      '🧰': 'Toolbox',
      '⛏️': 'Pickaxe',
      '🔨': 'Hammer',
      '🪓': 'Axe',
      '🧲': 'Magnet',
    },
    Nature: {
      '🌲': 'Tree',
      '🌳': 'Oak Tree',
      '🌴': 'Palm Tree',
      '🌱': 'Sprout',
      '🌾': 'Field',
      '🍄': 'Mushroom',
      '🌋': 'Volcano',
      '⛰️': 'Mountain',
      '🏞️': 'Park',
      '🏖️': 'Beach',
      '🌊': 'Wave',
      '🌌': 'Galaxy',
      '🌙': 'Moon',
      '☀️': 'Sun',
      '⭐': 'Star',
      '🌈': 'Rainbow',
    },
    'People & NPC': {
      '👑': 'King',
      '🤴': 'Prince',
      '👸': 'Princess',
      '🧝': 'Elf',
      '🧟': 'Zombie',
      '🧌': 'Troll',
      '🧚': 'Fairy',
      '🧜': 'Mermaid',
      '🧛': 'Vampire',
      '🧞': 'Genie',
      '🧓': 'Elder',
      '👩': 'Woman',
      '🧑': 'Person',
      '👥': 'Group',
    },
    'Animals & Creatures': {
      '🐉': 'Dragon',
      '🐺': 'Wolf',
      '🦁': 'Lion',
      '🐯': 'Tiger',
      '🐍': 'Snake',
      '🦅': 'Eagle',
      '🦇': 'Bat',
      '🦄': 'Unicorn',
      '🐗': 'Boar',
      '🐸': 'Frog',
      '🐟': 'Fish',
      '🦈': 'Shark',
    },
    Entertainment: {
      '🎮': 'Gaming',
      '🎲': 'Dice',
      '🎵': 'Music',
      '🎸': 'Guitar',
      '🥁': 'Drum',
      '🎬': 'Video',
      '🎨': 'Art',
      '🎯': 'Target',
      '🏆': 'Trophy',
    },
  };

  // ========================================
  // Utility Functions
  // ========================================

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = String(s);
    return div.innerHTML;
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeSelector(selector) {
    if (typeof CSS !== 'undefined' && CSS.escape) {
      return CSS.escape(selector);
    }
    return selector.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  }

  function buildIconOptionsHTML(iconOptions) {
    let html = '';
    const isNested = Object.values(iconOptions).some(
      (v) => typeof v === 'object' && v !== null
    );

    if (isNested) {
      for (const [category, icons] of Object.entries(iconOptions)) {
        if (!icons || typeof icons !== 'object') continue;
        html += `<optgroup label="${escapeAttr(`----[${category}]----`)}">`;
        for (const [icon, label] of Object.entries(icons)) {
          html += `<option value="${escapeAttr(icon)}">${escapeHtml(
            icon
          )} ${escapeHtml(label)}</option>`;
        }
        html += `</optgroup>`;
      }
    } else {
      for (const [icon, label] of Object.entries(iconOptions)) {
        html += `<option value="${escapeAttr(icon)}">${escapeHtml(
          icon
        )} ${escapeHtml(label)}</option>`;
      }
    }

    return html;
  }

  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        state.markers = data.markers || [];
        state.shapes = data.shapes || [];
        state.paths = data.paths || [];
        state.settings = { ...state.settings, ...(data.settings || {}) };
        state.isDarkMode = data.isDarkMode || false;
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }

  function saveData() {
    if (state.settings.autoSave) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            markers: state.markers,
            shapes: state.shapes,
            paths: state.paths,
            settings: state.settings,
            isDarkMode: state.isDarkMode,
            lastSaved: new Date().toISOString(),
          })
        );
      } catch (e) {
        console.error('Error saving data:', e);
        showMessage('Failed to save data!', 'error');
      }
    }
  }

  function exportToJSON() {
    const data = {
      website: {
        host: WEBSITE_HOST,
        url: window.location.href,
        title: document.title,
        exportDate: new Date().toISOString(),
      },

      version: '2.0',
      markers: state.markers,
      shapes: state.shapes,
      paths: state.paths,
      settings: state.settings,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markers_${WEBSITE_HOST.replace(
      /\./g,
      '_'
    )}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showMessage('Exported to JSON successfully!', 'success');
  }

  function exportToCSV() {
    let csv =
      'ID,Title,Icon,Description,X,Y,Created,LinkURL,LinkTitle,ImageURL\n';
    state.markers.forEach((marker) => {
      csv += `"${marker.id}","${marker.title}","${marker.icon}","${
        marker.description || ''
      }","${marker.x}","${marker.y}","${marker.created}","${
        marker.linkUrl || ''
      }","${marker.linkTitle || ''}","${marker.imageUrl || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markers_${WEBSITE_HOST.replace(
      /\./g,
      '_'
    )}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showMessage('Exported to CSV successfully!', 'success');
  }

  function exportToPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF export requires jsPDF library. Opening print dialog instead.');
      window.print();
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 25;
    let y = 20;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(`Custom Markers for ${WEBSITE_HOST}`, margin, y);
    y += 15;

    // Table of Contents
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Table of Contents', margin, y);
    y += 12;

    state.markers.forEach((marker, idx) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 120);
      doc.text(`${idx + 1}. ${marker.title}`, margin + 5, y);
      doc.setDrawColor(220);
      doc.setLineWidth(0.3);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 10;
    });

    // Add markers details
    doc.addPage();
    y = 20;

    state.markers.forEach((marker, index) => {
      if (y > pageHeight - 50) {
        doc.addPage();
        y = 20;
      }

      // Marker title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(0, 80, 180);
      doc.text(`${index + 1}. ${marker.icon} ${marker.title}`, margin, y);
      y += 9;

      // Description
      if (marker.description) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(
          marker.description,
          pageWidth - margin * 2
        );
        lines.forEach((line) => {
          if (y > pageHeight - 30) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin + 7, y);
          y += 6;
        });
      }

      // Position
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.text(`Position: ${marker.x}, ${marker.y}`, margin + 7, y);
      y += 8;

      // Link
      if (marker.linkUrl) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 200);
        doc.textWithLink(marker.linkTitle || marker.linkUrl, margin + 7, y, {
          url: marker.linkUrl,
        });
        y += 12;
      }

      // Separator
      doc.setDrawColor(200);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(
        `Page ${i} / ${pageCount}`,
        pageWidth - margin - 20,
        pageHeight - 10
      );
    }

    doc.save(`markers_${WEBSITE_HOST.replace(/\./g, '_')}_${Date.now()}.pdf`);
    showMessage('Exported to PDF successfully!', 'success');
  }

  function exportToMarkdown() {
    let md = `# Custom Markers for ${WEBSITE_HOST}\n\n`;
    md += `Exported: ${new Date().toLocaleString()}\n\n`;
    md += `## Markers (${state.markers.length})\n\n`;

    state.markers.forEach((marker) => {
      md += `### ${marker.icon} ${marker.title}\n`;
      md += `- **Position**: ${marker.x}, ${marker.y}\n`;
      if (marker.description) md += `- **Description**: ${marker.description}\n`;
      if (marker.linkUrl) md += `- **Link**: [${marker.linkTitle || 'View'}](${marker.linkUrl})\n`;
      if (marker.imageUrl) md += `- **Image**: ![Image](${marker.imageUrl})\n`;
      md += `- **Created**: ${new Date(marker.created).toLocaleString()}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markers_${WEBSITE_HOST.replace(/\./g, '_')}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    showMessage('Exported to Markdown successfully!', 'success');
  }

  async function sendWebhook(action, data) {
    if (state.settings.webhooks && !WEBHOOK_URL) {
      showMessage('⚠️ Webhooks enabled but no WEBHOOK_URL set!', 'error');
      return;
    }
    if (!state.settings.webhooks) return;

    try {
      GM_xmlhttpRequest({
        method: 'POST',
        url: WEBHOOK_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          action,
          website: WEBSITE_HOST,
          timestamp: new Date().toISOString(),
          data,
        }),
        onload: (response) => {
          console.log('Webhook sent:', response.status);
        },
        onerror: (error) => {
          console.error('Webhook error:', error);
        },
      });
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }

  async function syncToCloud() {
    if (state.settings.cloudSync && !CLOUD_SYNC_API) {
      showMessage('⚠️ Cloud Sync enabled but no CLOUD_SYNC_API set!', 'error');
      return;
    }
    if (!state.settings.cloudSync) return;

    showMessage('Syncing to cloud...', 'success');

    try {
      GM_xmlhttpRequest({
        method: 'POST',
        url: CLOUD_SYNC_API,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          website: WEBSITE_HOST,
          markers: state.markers,
          shapes: state.shapes,
          paths: state.paths,
          settings: state.settings,
          timestamp: new Date().toISOString(),
        }),
        onload: (response) => {
          showMessage('Synced to cloud successfully!', 'success');
        },
        onerror: (error) => {
          showMessage('Cloud sync failed!', 'error');
        },
      });
    } catch (error) {
      showMessage('Cloud sync error!', 'error');
    }
  }

  function fixSiteSpecificIssues() {
    const hostname = window.location.hostname;

    // Fix for sites with high z-index elements
    if (
      hostname.includes('flaticon.com') ||
      hostname.includes('onetrust.com')
    ) {
      setTimeout(() => {
        const style = document.createElement('style');
        style.textContent = `
          .cm-control-btn,
          .cm-panel,
          .cm-drawing-toolbar,
          .cm-bulk-toolbar,
          .cm-tooltip,
          .cm-context-menu,
          #cm-button-container {
            z-index: 2147483647 !important;
          }
        `;
        document.head.appendChild(style);
      }, 1000);
    }

    // Fix for Reddit
    if (hostname.includes('reddit.com')) {
      document.body.style.position = 'static';
    }

    // Fix for Twitter/X
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      document.documentElement.style.transform = 'none';
    }
  }

  function showMessage(msg, type) {
    const existingMsg = document.querySelector('.cm-message');
    if (existingMsg) existingMsg.remove();

    const msgEl = document.createElement('div');
    msgEl.className = `cm-message ${type}`;
    msgEl.textContent = msg;

    const panel = document.querySelector('.cm-panel-content');
    if (panel) {
      panel.insertBefore(msgEl, panel.firstChild);
      setTimeout(() => msgEl.remove(), 3000);
    }
  }

  function showActivationButton() {
    try {
      // Clean up any existing elements first
      const existingContainer = document.querySelector(
        '.cm-activate-container'
      );
      if (existingContainer) {
        existingContainer.remove();
      }

      // Don't show if already initialized
      if (
        state.isInitialized &&
        document.querySelector('#cm-button-container')
      ) {
        return;
      }

      const container = document.createElement('div');
      container.className = 'cm-activate-container';

      const activateBtn = document.createElement('button');
      activateBtn.className = 'cm-activate-btn';
      activateBtn.innerHTML =
        '<svg class="icon" viewBox="0 0 1024 1024"><path fill="#ffffff" d="M793.6 678.4c29.866667-51.2 81.066667-76.8 132.266667-72.533333 8.533333-29.866667 12.8-64 12.8-98.133334 0-29.866667-4.266667-59.733333-8.533334-85.333333-51.2 8.533333-106.666667-21.333333-136.533333-72.533333-29.866667-51.2-25.6-115.2 8.533333-153.6-46.933333-42.666667-98.133333-72.533333-157.866666-93.866667-17.066667 51.2-68.266667 85.333333-132.266667 85.333333s-110.933333-34.133333-132.266667-85.333333c-59.733333 21.333333-110.933333 55.466667-157.866666 98.133333 34.133333 42.666667 38.4 102.4 8.533333 153.6-29.866667 51.2-85.333333 76.8-136.533333 68.266667-4.266667 29.866667-8.533333 59.733333-8.533334 89.6 0 34.133333 4.266667 64 12.8 93.866667 51.2-4.266667 102.4 21.333333 132.266667 72.533333 25.6 51.2 25.6 106.666667-4.266667 149.333333 46.933333 42.666667 98.133333 72.533333 157.866667 89.6 21.333333-46.933333 68.266667-76.8 128-76.8s106.666667 29.866667 128 76.8c59.733333-17.066667 110.933333-51.2 157.866667-89.6-29.866667-42.666667-34.133333-98.133333-4.266667-149.333333z m-281.6 17.066667c-102.4 0-183.466667-81.066667-183.466667-183.466667S409.6 328.533333 512 328.533333s183.466667 81.066667 183.466667 183.466667-81.066667 183.466667-183.466667 183.466667z"/></svg>';
      activateBtn.onclick = function () {
        const cont = document.querySelector('.cm-activate-container');
        if (cont) cont.remove();
        state.isInitialized = false;
        init();
      };

      const tooltip = document.createElement('div');
      tooltip.className = 'cm-activate-tooltip';
      tooltip.textContent = 'Activate Markers Pro';

      container.appendChild(activateBtn);
      container.appendChild(tooltip);

      if (document.body) {
        document.body.appendChild(container);
      } else {
        document.addEventListener('DOMContentLoaded', () =>
          showActivationButton()
        );
      }
    } catch (error) {
      console.error('Error in showActivationButton:', error);
    }
  }

  // ========================================
  // Integrated Button System Functions
  // ========================================

  function createIntegratedButtons() {
    // Remove any existing button container
    const existing = document.getElementById('cm-button-container');
    if (existing) existing.remove();

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'cm-button-container';
    buttonContainer.innerHTML = `
      <div class="button-box">
        <div class="touch btn1"></div>
        <div class="touch btn2"></div>
        <div class="touch btn3"></div>
        <div class="touch btn4"></div>
        <div class="touch btn5"></div>
        <div class="touch btn6"></div>

        <!-- Button 1: Panel Toggle -->
        <div class="button" data-button="panel" title="Open Markers Panel (Ctrl+M)">
          <span style="font-size: 28px;">📌</span>
          <div class="button-tooltip">Markers Panel</div>
        </div>

        <!-- Button 2: Edit Mode -->
        <div class="button" data-button="edit" title="Toggle Edit Mode (Ctrl+E)">
          <span style="font-size: 28px;">✏️</span>
          <div class="button-tooltip">Edit Mode</div>
        </div>

        <!-- Button 3: Drawing Mode -->
        <div class="button" data-button="drawing" title="Toggle Drawing Mode (Ctrl+D)">
          <span style="font-size: 28px;">🎨</span>
          <div class="button-tooltip">Drawing Mode</div>
        </div>

        <!-- Button 4: Bulk Select -->
        <div class="button" data-button="bulk" title="Bulk Select Mode (Ctrl+B)">
          <span style="font-size: 28px;"><svg viewBox="0 0 64 64" width="20" height="20"><g><path fill="#394240" d="M12,60c0,2.211,1.789,4,4,4h32c2.211,0,4-1.789,4-4V16H12V60z M20,24h24v32H20V24z"/><path fill="#394240" d="M56,4H40c0-2.211-1.789-4-4-4h-8c-2.211,0-4,1.789-4,4H8C5.789,4,4,5.789,4,8s1.789,4,4,4h48c2.211,0,4-1.789,4-4S58.211,4,56,4z"/><rect x="20" y="24" fill="#B4CCB9" width="24" height="32"/></g></svg></span>
          <div class="button-tooltip">Bulk Select</div>
        </div>

        <!-- Button 5: Deactivate -->
        <div class="button" data-button="deactivate" title="Deactivate Markers Pro">
          <span style="font-size: 28px;"><svg viewBox="0 0 1024 1024" class="icon"><path d="M513.28 80.64c-226.56 0-409.6 183.04-409.6 409.6s183.04 409.6 409.6 409.6 409.6-183.04 409.6-409.6-184.32-409.6-409.6-409.6z m0 153.6c47.36 0 92.16 12.8 129.28 35.84L293.12 619.52c-23.04-38.4-35.84-81.92-35.84-129.28 0-140.8 113.92-256 256-256z m0 512c-47.36 0-92.16-12.8-129.28-35.84l350.72-350.72c23.04 38.4 35.84 81.92 35.84 129.28-1.28 142.08-116.48 257.28-257.28 257.28z" fill="#D82621" /><path d="M513.28 912.64c-232.96 0-422.4-189.44-422.4-422.4s189.44-422.4 422.4-422.4 422.4 189.44 422.4 422.4-189.44 422.4-422.4 422.4z m0-819.2c-218.88 0-396.8 177.92-396.8 396.8s177.92 396.8 396.8 396.8 396.8-177.92 396.8-396.8-177.92-396.8-396.8-396.8z m0 665.6c-47.36 0-94.72-12.8-136.96-37.12-3.84-2.56-5.12-5.12-6.4-8.96 0-3.84 1.28-7.68 3.84-10.24l350.72-350.72c2.56-2.56 6.4-3.84 10.24-3.84 3.84 0 7.68 2.56 8.96 6.4C768 395.52 780.8 442.88 780.8 491.52c1.28 147.2-120.32 267.52-267.52 267.52z m-108.8-51.2c33.28 16.64 71.68 25.6 108.8 25.6 134.4 0 243.2-108.8 243.2-243.2 0-37.12-8.96-75.52-25.6-108.8L404.48 707.84z m-111.36-75.52h-1.28c-3.84 0-7.68-2.56-8.96-6.4-24.32-40.96-37.12-88.32-37.12-136.96 0-148.48 120.32-268.8 268.8-268.8 47.36 0 94.72 12.8 136.96 37.12 3.84 2.56 5.12 5.12 6.4 8.96s-1.28 7.68-3.84 10.24L302.08 628.48c-2.56 2.56-6.4 3.84-8.96 3.84z m220.16-385.28c-134.4 0-243.2 108.8-243.2 243.2 0 37.12 8.96 75.52 25.6 108.8l326.4-326.4c-34.56-16.64-71.68-25.6-108.8-25.6z" fill="#231C1C" /></svg></span>
          <div class="button-tooltip">Deactivate</div>
        </div>

        <!-- Button 6: Main Settings (Gear) -->
        <div class="button" data-button="main" title="Custom Markers Pro">
          <svg class="icon" viewBox="0 0 1024 1024">
            <path fill="#ffffff" d="M793.6 678.4c29.866667-51.2 81.066667-76.8 132.266667-72.533333 8.533333-29.866667 12.8-64 12.8-98.133334 0-29.866667-4.266667-59.733333-8.533334-85.333333-51.2 8.533333-106.666667-21.333333-136.533333-72.533333-29.866667-51.2-25.6-115.2 8.533333-153.6-46.933333-42.666667-98.133333-72.533333-157.866666-93.866667-17.066667 51.2-68.266667 85.333333-132.266667 85.333333s-110.933333-34.133333-132.266667-85.333333c-59.733333 21.333333-110.933333 55.466667-157.866666 98.133333 34.133333 42.666667 38.4 102.4 8.533333 153.6-29.866667 51.2-85.333333 76.8-136.533333 68.266667-4.266667 29.866667-8.533333 59.733333-8.533334 89.6 0 34.133333 4.266667 64 12.8 93.866667 51.2-4.266667 102.4 21.333333 132.266667 72.533333 25.6 51.2 25.6 106.666667-4.266667 149.333333 46.933333 42.666667 98.133333 72.533333 157.866667 89.6 21.333333-46.933333 68.266667-76.8 128-76.8s106.666667 29.866667 128 76.8c59.733333-17.066667 110.933333-51.2 157.866667-89.6-29.866667-42.666667-34.133333-98.133333-4.266667-149.333333z m-281.6 17.066667c-102.4 0-183.466667-81.066667-183.466667-183.466667S409.6 328.533333 512 328.533333s183.466667 81.066667 183.466667 183.466667-81.066667 183.466667-183.466667 183.466667z"/>
          </svg>
          <div class="button-tooltip">Settings</div>
        </div>
      </div>
    `;

    document.body.appendChild(buttonContainer);

    // Add event listeners for each button
    buttonContainer
      .querySelector('[data-button="panel"]')
      .addEventListener('click', togglePanel);
    buttonContainer
      .querySelector('[data-button="edit"]')
      .addEventListener('click', toggleEditMode);
    buttonContainer
      .querySelector('[data-button="drawing"]')
      .addEventListener('click', toggleDrawingMode);
    buttonContainer
      .querySelector('[data-button="bulk"]')
      .addEventListener('click', toggleBulkMode);
    buttonContainer
      .querySelector('[data-button="deactivate"]')
      .addEventListener('click', deactivateAll);
    buttonContainer
      .querySelector('[data-button="main"]')
      .addEventListener('click', () => {
        togglePanel();
        switchTab('settings');
      });

    // Right-click on main button for quick actions
    buttonContainer
      .querySelector('[data-button="main"]')
      .addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showQuickActionsMenu(e);
      });
  }

  function showQuickActionsMenu(e) {
    const existing = document.querySelector('.cm-quick-actions');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.className = 'cm-quick-actions';
    menu.style.cssText = `
      position: fixed;
      left: ${e.pageX}px;
      top: ${e.pageY}px;
      background: white;
      border-radius: 12px;
      padding: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      z-index: 2147483647;
      min-width: 180px;
    `;
    menu.innerHTML = `
      <div class="cm-quick-action" data-action="add-marker">➕ Quick Add Marker</div>
      <div class="cm-quick-action" data-action="export">📥 Quick Export</div>
      <div class="cm-quick-action" data-action="clear-all">🗑️ Clear All</div>
      <div class="cm-quick-action" data-action="help">❓ Help</div>
    `;

    document.body.appendChild(menu);

    menu.querySelectorAll('.cm-quick-action').forEach((item) => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        switch (action) {
          case 'add-marker':
            quickAddMarker();
            break;
          case 'export':
            exportToJSON();
            break;
          case 'clear-all':
            if (confirm('Clear all markers and drawings?')) {
              state.markers = [];
              state.shapes = [];
              state.paths = [];
              saveData();
              renderMarkers();
              renderShapes();
              renderPaths();
              showMessage('All data cleared!', 'success');
            }
            break;
          case 'help':
            showHelpDialog();
            break;
        }
        menu.remove();
      });
    });

    // Remove menu when clicking elsewhere
    setTimeout(() => {
      document.addEventListener('click', () => menu.remove(), { once: true });
    }, 0);
  }

  function quickAddMarker() {
    const title = prompt('Enter marker title:');
    if (!title) return;

    const marker = {
      id: Date.now().toString(),
      title,
      icon: '📍',
      animation: 'pulse',
      description: '',
      x: '50%',
      y: '50%',
      created: new Date().toISOString(),
      website: WEBSITE_HOST,
      context: window.location.pathname,
    };

    state.markers.push(marker);
    saveData();
    renderMarkers();
    updateMarkersList();
    showMessage('Marker added! Enter edit mode to position it.', 'success');
  }

  function showHelpDialog() {
    alert(`Custom Markers Pro - Keyboard Shortcuts:

    Ctrl+M : Toggle Panel
    Ctrl+E : Toggle Edit Mode
    Ctrl+D : Toggle Drawing Mode
    Ctrl+B : Toggle Bulk Select
    Ctrl+S : Save
    Ctrl+F : Search Markers

    Right-click on markers for context menu.
    Right-click on main button for quick actions.`);
  }

  function deactivateAll() {
    if (confirm('Deactivate Custom Markers Pro?')) {
      cleanupExistingUI();
      const buttonContainer = document.getElementById('cm-button-container');
      if (buttonContainer) buttonContainer.remove();
      state.isInitialized = false;
      state.isEditMode = false;
      state.isDrawingMode = false;
      state.isBulkMode = false;
      showActivationButton();
    }
  }

  // ========================================
  // Initialize Function
  // ========================================

  function init() {
    // Don't re-init if UI already exists
    if (state.isInitialized && document.querySelector('#cm-button-container')) {
      togglePanel();
      return;
    }

    state.isInitialized = true;
    loadData();

    // Clean up any existing UI before creating new
    cleanupExistingUI();

    // Create the integrated button system
    createIntegratedButtons();

    createUI();
    loadNotes();
    renderMarkers();
    renderShapes();
    renderPaths();
    setupEventListeners();
    updateMarkersList();
    applyTheme();

    sendWebhook('init', { markersCount: state.markers.length });
    fixSiteSpecificIssues();
  }

  function cleanupExistingUI() {
    const elements = [
      '.cm-control-btn',
      '.cm-panel',
      '.cm-overlay',
      '.cm-drawing-canvas',
      '.cm-svg-canvas',
      '.cm-drawing-toolbar',
      '.cm-bulk-toolbar',
      '.cm-tooltip',
      '.cm-context-menu',
      '.cm-shape-context-menu',
      '#cm-button-container',
    ];

    elements.forEach((selector) => {
      const el = document.querySelector(selector);
      if (el) el.remove();
    });

    // Clean up global event handlers
    if (window._cmEventHandlers) {
      Object.values(window._cmEventHandlers).forEach((handler) => {
        if (handler && handler.remove) {
          handler.remove();
        }
      });
      window._cmEventHandlers = {};
    }
  }

  // ========================================
  // Create UI Elements
  // ========================================

  function createUI() {
    if (document.querySelector('.cm-control-btn')) return;

    // Main control button
    const controlBtn = document.createElement('div');
    controlBtn.className = 'cm-control-btn';
    controlBtn.innerHTML = '<span>🚀</span><span>Markers Pro</span>';
    document.body.appendChild(controlBtn);

    // Side panel
    const panel = document.createElement('div');
    panel.className = 'cm-panel';
    panel.innerHTML = `
      <div class="cm-panel-header">
        <div class="cm-panel-title">
          <span>🎯</span>
          <span>CustomMarkers</span>
        </div>
        <div class="cm-header-buttons">
          <button class="cm-theme-toggle" id="theme-toggle" title="Toggle Dark/Light Mode">🌓</button>
          <button class="cm-close-btn" id="panel-close">✕</button>
        </div>
      </div>
      <div class="cm-panel-content">
        <div class="cm-tabs">
          <button class="cm-tab active" data-tab="markers">📍 Markers</button>
          <button class="cm-tab" data-tab="notes">📝 Notes</button>
          <button class="cm-tab" data-tab="settings">⚙️ Settings</button>
        </div>

        <div class="cm-tab-content" id="tab-markers">
          <div class="cm-search-container">
            <input type="text" class="cm-search-input" id="search-markers" placeholder="Search markers...">
            <span class="cm-search-icon">🔍</span>
          </div>

          <div class="cm-form">
            <div class="cm-form-group">
              <label class="cm-label">Title</label>
              <input type="text" class="cm-input" id="marker-title" placeholder="Enter marker title">
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Icon & Animation</label>
              <div style="display: flex; gap: 12px;">
                <select class="cm-select" id="marker-icon" style="flex: 1;">
                  ${buildIconOptionsHTML(iconOptions)}
                </select>
                <select class="cm-select" id="marker-animation" style="flex: 1;">
                  <option value="none">No Animation</option>
                  <option value="pulse">Pulse</option>
                  <option value="bounce">Bounce</option>
                  <option value="rotate">Rotate</option>
                  <option value="glow">Glow</option>
                  <option value="shake">Shake</option>
                  <option value="wiggle">Wiggle</option>
                  <option value="fade">Fade</option>
                  <option value="flip">Flip</option>
                  <option value="zoom">Zoom</option>
                  <option value="slide">Slide</option>
                  <option value="spin">Spin</option>
                </select>
              </div>
              <div class="cm-icon-preview" id="icon-preview">📍</div>
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Description</label>
              <textarea class="cm-textarea" id="marker-description" placeholder="Add notes..."></textarea>
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Link URL</label>
              <input type="text" class="cm-input" id="marker-link-url" placeholder="https://example.com">
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Link Title</label>
              <input type="text" class="cm-input" id="marker-link-title" placeholder="Click here for more info">
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Image URL</label>
              <input type="text" class="cm-input" id="marker-image-url" placeholder="https://example.com/image.jpg">
            </div>

            <div class="cm-form-group">
              <button class="cm-btn cm-btn-primary" id="add-marker-btn">➕ Add Marker</button>
              <button class="cm-btn cm-btn-primary" id="save-marker-btn" style="display:none;">💾 Save Changes</button>
              <button class="cm-btn cm-btn-secondary" id="cancel-edit-btn" style="display:none;">Cancel</button>
            </div>
          </div>

          <div class="cm-export-options">
            <div class="cm-export-option" id="export-json">
              <div class="cm-export-option-icon">📄</div>
              <div>JSON</div>
            </div>
            <div class="cm-export-option" id="export-csv">
              <div class="cm-export-option-icon">📊</div>
              <div>CSV</div>
            </div>
            <div class="cm-export-option" id="export-markdown">
              <div class="cm-export-option-icon">📝</div>
              <div>Markdown</div>
            </div>
            <div class="cm-export-option" id="export-pdf">
              <div class="cm-export-option-icon">📑</div>
              <div>PDF</div>
            </div>
          </div>

          <div class="cm-markers-list">
            <h3 style="margin: 20px 0;">📌 Markers (<span id="markers-count">0</span>)</h3>
            <div id="markers-container"></div>
          </div>
        </div>

        <div class="cm-tab-content" id="tab-notes" style="display:none;">
          <div class="cm-note-editor">
            <div class="cm-note-toolbar">
              <button class="cm-note-tool" data-format="bold">𝐁</button>
              <button class="cm-note-tool" data-format="italic">𝐼</button>
              <button class="cm-note-tool" data-format="underline">U̲</button>
              <button class="cm-note-tool" data-format="list">☰</button>
              <button class="cm-note-tool" data-format="link">🔗</button>
            </div>
            <div class="cm-note-content" contenteditable="true" id="note-content">
              Start taking notes here...
            </div>
            <button class="cm-btn cm-btn-primary" id="save-note-btn" style="margin-top: 16px;">💾 Save Note</button>
          </div>
        </div>

        <div class="cm-tab-content" id="tab-settings" style="display:none;">
          <div class="cm-settings">
            <div class="cm-settings-title">
              <span>⚙️</span>
              <span>Settings</span>
            </div>

            <div class="cm-settings-group">
              <div class="cm-toggle-switch">
                <span>Auto Save</span>
                <label class="cm-switch">
                  <input type="checkbox" id="setting-autosave" checked>
                  <span class="cm-switch-slider"></span>
                </label>
              </div>

              <div class="cm-toggle-switch">
                <span>Animations</span>
                <label class="cm-switch">
                  <input type="checkbox" id="setting-animations" checked>
                  <span class="cm-switch-slider"></span>
                </label>
              </div>

              <div class="cm-toggle-switch">
                <span>Cloud Sync</span>
                <label class="cm-switch">
                  <input type="checkbox" id="setting-cloudsync">
                  <span class="cm-switch-slider"></span>
                </label>
              </div>

              <div class="cm-toggle-switch">
                <span>Webhooks</span>
                <label class="cm-switch">
                  <input type="checkbox" id="setting-webhooks">
                  <span class="cm-switch-slider"></span>
                </label>
              </div>
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Webhook URL</label>
              <input type="text" class="cm-input" id="webhook-url" placeholder="https://your-webhook-url.com">
            </div>

            <div class="cm-form-group" style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
              <div style="text-align: center;">
                <h3 style="margin-bottom: 16px; color: var(--text-primary);">☕ Support Development</h3>
                <p style="margin-bottom: 20px; color: var(--text-secondary); font-size: 14px;">
                  If you find this tool useful, consider buying me a coffee!
                </p>
                <button class="cm-btn" id="donate-btn" style="
                  background: linear-gradient(135deg, #FFC439 0%, #FF9B3D 100%);
                  color: white;
                  padding: 14px 28px;
                  font-size: 16px;
                  font-weight: 600;
                  box-shadow: 0 4px 15px rgba(255, 196, 57, 0.3);
                ">
                  <span style="font-size: 20px; vertical-align: middle;">☕</span>
                  Buy Me a Coffee via PayPal
                </button>
                <p style="margin-top: 12px; font-size: 12px; color: var(--text-secondary);">
                  • Made with ❤️ by Disruptor
                </p>
              </div>
            </div>

            <button class="cm-btn cm-btn-success" id="sync-now-btn">☁️ Sync Now</button>
            <button class="cm-btn cm-btn-danger" id="clear-all-btn" style="margin-top: 20px;">🗑️ Clear All Data</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Create overlay for markers
    const overlay = document.createElement('div');
    overlay.className = 'cm-overlay';
    overlay.id = 'marker-overlay';
    document.body.appendChild(overlay);

    // Create drawing canvas
    const drawingCanvas = document.createElement('div');
    drawingCanvas.className = 'cm-drawing-canvas';
    drawingCanvas.id = 'drawing-canvas';
    document.body.appendChild(drawingCanvas);

    // Create SVG canvas for pen tool
    const svgCanvas = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    svgCanvas.setAttribute('class', 'cm-svg-canvas');
    svgCanvas.setAttribute('id', 'svg-canvas');
    document.body.appendChild(svgCanvas);

    // Create drawing toolbar
    const drawingToolbar = document.createElement('div');
    drawingToolbar.className = 'cm-drawing-toolbar';
    drawingToolbar.innerHTML = `
      <div class="cm-drawing-toolbar-section">
        <div class="cm-drawing-toolbar-title">Shapes</div>
        <div class="cm-drawing-tools">
          <button class="cm-drawing-tool active" data-tool="rectangle" title="Rectangle">▭</button>
          <button class="cm-drawing-tool" data-tool="circle" title="Circle">○</button>
          <button class="cm-drawing-tool" data-tool="line" title="Line">╱</button>
          <button class="cm-drawing-tool" data-tool="arrow" title="Arrow">→</button>
          <button class="cm-drawing-tool" data-tool="text" title="Text">T</button>
          <button class="cm-drawing-tool" data-tool="pen" title="Free Draw">✏️</button>
        </div>
      </div>
      <div class="cm-drawing-toolbar-section">
        <div class="cm-drawing-toolbar-title">Actions</div>
        <div class="cm-drawing-tools">
          <button class="cm-drawing-tool" data-tool="select" title="Select">👆</button>
          <button class="cm-drawing-tool" data-tool="delete" title="Delete">🗑️</button>
          <button class="cm-drawing-tool" data-tool="clear" title="Clear All">💣</button>
        </div>
      </div>
      <div class="cm-drawing-toolbar-section">
        <div class="cm-drawing-toolbar-title">Style</div>
        <input type="color" id="draw-color" value="#667eea" style="width: 100%; height: 32px; border-radius: 8px; border: 2px solid #e2e8f0;">
        <input type="range" id="draw-thickness" min="1" max="20" value="3" style="width: 100%; margin-top: 8px;">
        <select id="draw-style" style="width: 100%; margin-top: 8px; padding: 8px; border-radius: 8px; border: 2px solid #e2e8f0;">
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>
      <div class="cm-drawing-toolbar-section" id="text-options" style="display:none;">
        <div class="cm-drawing-toolbar-title">Text Style</div>
        <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <input type="checkbox" id="text-bold">
          <span style="color:#8B4513;">Bold</span>
        </label>
        <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <input type="checkbox" id="text-italic">
          <span style="color:#8B4513;">Italic</span>
        </label>
        <label style="display:block;margin-bottom:4px;">Size</label>
        <input type="range" id="text-size" min="10" max="48" value="16" style="width:100%;">
      </div>
    `;
    document.body.appendChild(drawingToolbar);

    // Create bulk toolbar
    const bulkToolbar = document.createElement('div');
    bulkToolbar.className = 'cm-bulk-toolbar';
    bulkToolbar.innerHTML = `
      <span class="cm-bulk-count">0 selected</span>
      <button class="cm-btn cm-btn-primary" id="bulk-delete">Delete</button>
      <button class="cm-btn cm-btn-secondary" id="bulk-export">Export</button>
      <button class="cm-btn cm-btn-secondary" id="bulk-cancel">Cancel</button>
    `;
    document.body.appendChild(bulkToolbar);

    // Create tooltip
    state.tooltip = document.createElement('div');
    state.tooltip.className = 'cm-tooltip';
    document.body.appendChild(state.tooltip);

    // Create context menu
    const contextMenu = document.createElement('div');
    contextMenu.className = 'cm-context-menu';
    contextMenu.innerHTML = `
      <div class="cm-context-item" data-action="edit">✏️ Edit</div>
      <div class="cm-context-item" data-action="duplicate">📋 Duplicate</div>
      <div class="cm-context-item" data-action="delete">🗑️ Delete</div>
      <div class="cm-context-item" data-action="animate">✨ Change Animation</div>
      <div class="cm-context-item" data-action="anchor">⚓ Anchor to Element</div>
    `;
    document.body.appendChild(contextMenu);

    // Create separate context menu for shapes
    const shapeContextMenu = document.createElement('div');
    shapeContextMenu.className = 'cm-context-menu cm-shape-context-menu';
    shapeContextMenu.innerHTML = `
      <div class="cm-shape-context-item" data-action="anchor-shape">⚓ Anchor to Element</div>
      <div class="cm-shape-context-item" data-action="unanchor-shape">🔓 Un-anchor</div>
      <div class="cm-shape-context-item" data-action="delete-shape">🗑️ Delete Shape</div>
    `;
    document.body.appendChild(shapeContextMenu);
  }

  // ========================================
  // Event Listeners
  // ========================================

  function setupEventListeners() {
    // Store handlers globally for cleanup
    window._cmEventHandlers = window._cmEventHandlers || {};

    // Panel controls
    document
      .querySelector('.cm-control-btn')
      .addEventListener('click', togglePanel);
    document
      .getElementById('panel-close')
      .addEventListener('click', togglePanel);

    // Theme toggle
    document
      .getElementById('theme-toggle')
      .addEventListener('click', toggleTheme);

    // Tabs
    document.querySelectorAll('.cm-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        switchTab(e.target.dataset.tab);
      });
    });

    // Marker form
    document.getElementById('marker-icon').addEventListener('change', (e) => {
      document.getElementById('icon-preview').textContent = e.target.value;
    });

    document
      .getElementById('marker-animation')
      .addEventListener('change', (e) => {
        const preview = document.getElementById('icon-preview');
        preview.className = `cm-icon-preview animate-${e.target.value}`;
      });

    document
      .getElementById('add-marker-btn')
      .addEventListener('click', addNewMarker);
    document
      .getElementById('save-marker-btn')
      .addEventListener('click', saveEditedMarker);
    document
      .getElementById('cancel-edit-btn')
      .addEventListener('click', cancelEdit);

    // Search
    document.getElementById('search-markers').addEventListener('input', (e) => {
      searchMarkers(e.target.value);
    });

    // Export options
    document
      .getElementById('export-json')
      .addEventListener('click', exportToJSON);
    document
      .getElementById('export-csv')
      .addEventListener('click', exportToCSV);
    document
      .getElementById('export-markdown')
      .addEventListener('click', exportToMarkdown);
    document
      .getElementById('export-pdf')
      .addEventListener('click', exportToPDF);

    // Settings
    document
      .getElementById('setting-autosave')
      .addEventListener('change', (e) => {
        state.settings.autoSave = e.target.checked;
        saveData();
      });

    document
      .getElementById('setting-animations')
      .addEventListener('change', (e) => {
        state.settings.animations = e.target.checked;
        saveData();
        renderMarkers();
      });

    document
      .getElementById('setting-cloudsync')
      .addEventListener('change', (e) => {
        state.settings.cloudSync = e.target.checked;
        saveData();
      });

    document
      .getElementById('setting-webhooks')
      .addEventListener('change', (e) => {
        state.settings.webhooks = e.target.checked;
        saveData();
      });

    document
      .getElementById('sync-now-btn')
      .addEventListener('click', syncToCloud);

    document.getElementById('clear-all-btn').addEventListener('click', () => {
      if (
        confirm(
          'Are you sure you want to clear all data? This cannot be undone!'
        )
      ) {
        state.markers = [];
        state.shapes = [];
        state.paths = [];
        saveData();
        updateMarkersList();
        renderMarkers();
        renderShapes();
        renderPaths();
        showMessage('All data cleared!', 'success');
      }
    });

    // Note editor
    document.querySelectorAll('.cm-note-tool').forEach((tool) => {
      tool.addEventListener('click', (e) => {
        applyFormat(e.target.dataset.format);
      });
    });

    document
      .getElementById('save-note-btn')
      .addEventListener('click', saveNote);

    // Drawing tools
    document.querySelectorAll('.cm-drawing-tool').forEach((tool) => {
      tool.addEventListener('click', (e) => {
        const toolType = e.target.dataset.tool;
        if (toolType === 'clear') {
          if (confirm('Clear all drawings?')) {
            state.shapes = [];
            state.paths = [];
            saveData();
            renderShapes();
            renderPaths();
          }
        } else {
          selectDrawingTool(toolType);
          document.getElementById('text-options').style.display =
            toolType === 'text' ? 'block' : 'none';
        }
      });
    });

    // Bulk actions
    document
      .getElementById('bulk-delete')
      .addEventListener('click', bulkDelete);
    document
      .getElementById('bulk-export')
      .addEventListener('click', bulkExport);
    document.getElementById('bulk-cancel').addEventListener('click', () => {
      state.isBulkMode = false;
      state.selectedMarkers.clear();
      updateBulkToolbar();
      renderMarkers();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+M for panel
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        togglePanel();
      }
      // Ctrl+E for edit mode
      else if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        toggleEditMode();
      }
      // Ctrl+D for drawing mode
      else if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDrawingMode();
      }
      // Ctrl+B for bulk mode
      else if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        toggleBulkMode();
      }
      // Ctrl+S for save
      else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveData();
        showMessage('Saved!', 'success');
      }
      // Ctrl+F for search
      else if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        if (document.getElementById('search-markers')) {
          togglePanel();
          document.getElementById('search-markers').focus();
        }
      }
    });

    // PayPal Donation
    document.getElementById('donate-btn').addEventListener('click', () => {
      const paypalUrl = 'https://www.paypal.com/paypalme/TamamMatta';
      window.open(paypalUrl, '_blank');
      showMessage('Thank you for your support! 💙', 'success');
    });

    // Add scroll listener for anchored markers
    window.addEventListener(
      'scroll',
      () => {
        const hasAnchoredMarkers = state.markers.some((m) => m.isAnchored);
        const hasAnchoredShapes = state.shapes.some((s) => s.isAnchored);
        const hasAnchoredPaths = state.paths.some((p) => p.isAnchored);

        if (hasAnchoredMarkers) {
          renderMarkers();
        }
        if (hasAnchoredShapes) {
          renderShapes();
        }
        if (hasAnchoredPaths) {
          renderPaths();
        }
      },
      { passive: true }
    );

    // Context menu
    document.addEventListener('contextmenu', (e) => {
      const marker = e.target.closest('.cm-marker');
      if (marker) {
        e.preventDefault();
        showContextMenu(e, marker.dataset.markerId);
      }
    });

    document.addEventListener('click', (e) => {
      const contextMenu = document.querySelector('.cm-context-menu');
      if (!contextMenu) return; // Add null check

      const contextItem = e.target.closest('.cm-context-item');

      if (contextItem) {
        const action = contextItem.dataset.action;
        const contextType = contextMenu.dataset.contextType;

        if (contextType === 'shape') {
          const shapeId = contextMenu.dataset.shapeId;
          if (action === 'anchor-shape') {
            anchorShape(shapeId);
          } else if (action === 'delete-shape') {
            state.shapes = state.shapes.filter((s) => s.id !== shapeId);
            saveData();
            renderShapes();
          }
          contextMenu.classList.remove('active');
        } else {
          handleContextAction(action);
        }
      } else if (contextMenu.contains(e.target)) {
        // Do nothing if clicking inside menu
      } else {
        // Hide menu when clicking outside
        contextMenu.classList.remove('active');
      }
    });

    // Shape context menu handlers
    document.addEventListener('click', (e) => {
      const shapeMenu = document.querySelector('.cm-shape-context-menu');
      if (shapeMenu && !shapeMenu.contains(e.target)) {
        shapeMenu.classList.remove('active');
      }
    });

    // Fix the event delegation for shape context items
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('cm-shape-context-item')) {
        const action = e.target.dataset.action;
        const menu = document.querySelector('.cm-shape-context-menu');
        const shapeId = menu.dataset.shapeId;
        const shapeType = menu.dataset.shapeType;

        if (action === 'anchor-shape') {
          const wasDrawingMode = state.isDrawingMode;
          if (wasDrawingMode) {
            state.isDrawingMode = false;
            const canvas = document.getElementById('drawing-canvas');
            if (canvas) canvas.style.pointerEvents = 'none';
          }

          anchorShape(shapeId);

          setTimeout(() => {
            if (wasDrawingMode) {
              state.isDrawingMode = true;
              const canvas = document.getElementById('drawing-canvas');
              if (canvas) canvas.style.pointerEvents = 'auto';
            }
          }, 100);
        } else if (action === 'unanchor-shape') {
          let unanchored = false;
          if (shapeType === 'path') {
            const pathIndex = state.paths.findIndex((p) => p.id === shapeId);
            if (pathIndex !== -1) {
              if (state.paths[pathIndex].originalPath) {
                state.paths[pathIndex].path =
                  state.paths[pathIndex].originalPath;
                delete state.paths[pathIndex].originalPath;
              }
              delete state.paths[pathIndex].isAnchored;
              delete state.paths[pathIndex].anchorSelector;
              delete state.paths[pathIndex].anchorOffsetX;
              delete state.paths[pathIndex].anchorOffsetY;
              unanchored = true;
              saveData();
              renderPaths();
            }
          } else {
            const shapeIndex = state.shapes.findIndex((s) => s.id === shapeId);
            if (shapeIndex !== -1) {
              if (state.shapes[shapeIndex].originalX) {
                state.shapes[shapeIndex].x = state.shapes[shapeIndex].originalX;
                delete state.shapes[shapeIndex].originalX;
              }
              if (state.shapes[shapeIndex].originalY) {
                state.shapes[shapeIndex].y = state.shapes[shapeIndex].originalY;
                delete state.shapes[shapeIndex].originalY;
              }
              delete state.shapes[shapeIndex].isAnchored;
              delete state.shapes[shapeIndex].anchorSelector;
              delete state.shapes[shapeIndex].anchorOffsetX;
              delete state.shapes[shapeIndex].anchorOffsetY;
              unanchored = true;
              saveData();
              renderShapes();
            }
          }
          if (unanchored) {
            showMessage('Un-anchored successfully', 'success');
          } else {
            showMessage('Failed to un-anchor', 'error');
          }
        } else if (action === 'delete-shape') {
          if (shapeType === 'path') {
            state.paths = state.paths.filter((p) => p.id !== shapeId);
            saveData();
            renderPaths();
          } else {
            state.shapes = state.shapes.filter((s) => s.id !== shapeId);
            saveData();
            renderShapes();
          }
        }

        menu.classList.remove('active');
      }
    });
  }

  // ========================================
  // Core Functions
  // ========================================

  function togglePanel() {
    const panel = document.querySelector('.cm-panel');
    if (panel) {
      panel.classList.toggle('active');
    }
  }

  function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    applyTheme();
    saveData();
  }

  function applyTheme() {
    const panel = document.querySelector('.cm-panel');
    if (panel) {
      panel.classList.toggle('cm-dark-mode', state.isDarkMode);
    }
    const contextMenu = document.querySelector('.cm-context-menu');
    if (contextMenu) {
      contextMenu.classList.toggle('cm-dark-mode', state.isDarkMode);
    }
  }

  function switchTab(tabName) {
    state.currentTab = tabName;

    document.querySelectorAll('.cm-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    document.querySelectorAll('.cm-tab-content').forEach((content) => {
      content.style.display =
        content.id === `tab-${tabName}` ? 'block' : 'none';
    });
  }

  function toggleEditMode() {
    if (!state.isEditMode && state.isDrawingMode) {
      toggleDrawingMode();
    }

    state.isEditMode = !state.isEditMode;
    const overlay = document.getElementById('marker-overlay');
    const button = document.querySelector('[data-button="edit"]');

    if (overlay) overlay.classList.toggle('active', state.isEditMode);
    if (button) button.classList.toggle('active', state.isEditMode);

    if (!state.isEditMode) {
      document.body.style.userSelect = '';
    } else {
      document.body.style.userSelect = 'none';
    }
  }

  function toggleDrawingMode() {
    if (!state.isDrawingMode && state.isEditMode) {
      toggleEditMode();
    }

    state.isDrawingMode = !state.isDrawingMode;
    const canvas = document.getElementById('drawing-canvas');
    const toolbar = document.querySelector('.cm-drawing-toolbar');
    const button = document.querySelector('[data-button="drawing"]');
    const svgCanvas = document.getElementById('svg-canvas');

    if (canvas) canvas.classList.toggle('active', state.isDrawingMode);
    if (toolbar) toolbar.classList.toggle('active', state.isDrawingMode);
    if (button) button.classList.toggle('active', state.isDrawingMode);

    if (svgCanvas) {
      svgCanvas.style.pointerEvents = state.isDrawingMode ? 'auto' : 'none';
    }

    if (state.isDrawingMode) {
      if (canvas) {
        canvas.style.pointerEvents = 'auto';
        canvas.style.pointerEvents =
          state.currentDrawingTool === 'select' ||
          state.currentDrawingTool === 'delete'
            ? 'none'
            : 'auto';
      }
      initDrawing();
    } else {
      if (canvas) {
        canvas.style.pointerEvents = 'none';
      }
    }
  }

  function toggleBulkMode() {
    state.isBulkMode = !state.isBulkMode;
    const button = document.querySelector('[data-button="bulk"]');
    if (button) button.classList.toggle('active', state.isBulkMode);

    updateBulkToolbar();

    if (!state.isBulkMode) {
      state.selectedMarkers.clear();
      renderMarkers();
    }
  }

  function addNewMarker() {
    const title = document.getElementById('marker-title').value.trim();
    const icon = document.getElementById('marker-icon').value;
    const animation = document.getElementById('marker-animation').value;
    const description = document
      .getElementById('marker-description')
      .value.trim();
    const linkUrl = document.getElementById('marker-link-url').value.trim();
    const linkTitle = document.getElementById('marker-link-title').value.trim();
    const imageUrl = document.getElementById('marker-image-url').value.trim();

    if (!title) {
      showMessage('Please enter a title!', 'error');
      return;
    }

    const marker = {
      id: Date.now().toString(),
      title,
      icon,
      animation,
      description,
      linkUrl,
      linkTitle,
      imageUrl,
      x: 40 + Math.random() * 20 + '%',
      y: 40 + Math.random() * 20 + '%',
      created: new Date().toISOString(),
      website: WEBSITE_HOST,
      context: window.location.pathname,
    };

    state.markers.push(marker);
    saveData();
    resetForm();
    updateMarkersList();
    renderMarkers();

    showMessage('Marker added!', 'success');
    sendWebhook('marker_added', marker);
  }

  function saveEditedMarker() {
    const title = document.getElementById('marker-title').value.trim();
    const icon = document.getElementById('marker-icon').value;
    const animation = document.getElementById('marker-animation').value;
    const description = document
      .getElementById('marker-description')
      .value.trim();
    const linkUrl = document.getElementById('marker-link-url').value.trim();
    const linkTitle = document.getElementById('marker-link-title').value.trim();
    const imageUrl = document.getElementById('marker-image-url').value.trim();

    if (!title || !state.editingMarkerId) {
      showMessage('Please enter a title!', 'error');
      return;
    }

    const markerIndex = state.markers.findIndex(
      (m) => m.id === state.editingMarkerId
    );
    if (markerIndex !== -1) {
      state.markers[markerIndex] = {
        ...state.markers[markerIndex],
        title,
        icon,
        animation,
        description,
        linkUrl,
        linkTitle,
        imageUrl,
        updated: new Date().toISOString(),
      };

      saveData();
      resetForm();
      updateMarkersList();
      renderMarkers();

      showMessage('Marker updated!', 'success');
      sendWebhook('marker_updated', state.markers[markerIndex]);
    }
  }

  function cancelEdit() {
    resetForm();
  }

  function resetForm() {
    document.getElementById('marker-title').value = '';
    document.getElementById('marker-icon').value = '📍';
    document.getElementById('marker-animation').value = 'pulse';
    document.getElementById('icon-preview').textContent = '📍';
    document.getElementById('icon-preview').className =
      'cm-icon-preview animate-pulse';
    document.getElementById('marker-description').value = '';
    document.getElementById('marker-link-url').value = '';
    document.getElementById('marker-link-title').value = '';
    document.getElementById('marker-image-url').value = '';

    document.getElementById('add-marker-btn').style.display = 'inline-block';
    document.getElementById('save-marker-btn').style.display = 'none';
    document.getElementById('cancel-edit-btn').style.display = 'none';

    state.editingMarkerId = null;
  }

  function searchMarkers(query) {
    const filtered = state.markers.filter(
      (m) =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.description?.toLowerCase().includes(query.toLowerCase())
    );
    updateMarkersList(filtered);
  }

  function bulkDelete() {
    if (confirm(`Delete ${state.selectedMarkers.size} markers?`)) {
      state.markers = state.markers.filter(
        (m) => !state.selectedMarkers.has(m.id)
      );
      state.selectedMarkers.clear();
      saveData();
      updateMarkersList();
      renderMarkers();
      updateBulkToolbar();

      showMessage('Markers deleted!', 'success');
    }
  }

  function bulkExport() {
    const selected = state.markers.filter((m) =>
      state.selectedMarkers.has(m.id)
    );
    const data = {
      website: WEBSITE_HOST,
      exportDate: new Date().toISOString(),
      markers: selected,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_markers_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showMessage(`Exported ${selected.length} markers!`, 'success');
  }

  function updateBulkToolbar() {
    const toolbar = document.querySelector('.cm-bulk-toolbar');
    if (toolbar) {
      toolbar.classList.toggle('active', state.isBulkMode);

      if (state.isBulkMode) {
        toolbar.querySelector(
          '.cm-bulk-count'
        ).textContent = `${state.selectedMarkers.size} selected`;
      }
    }
  }

  function showContextMenu(e, markerId) {
    const menu = document.querySelector('.cm-context-menu');
    if (menu) {
      menu.style.left = e.pageX + 'px';
      menu.style.top = e.pageY + 'px';
      menu.classList.add('active');
      menu.dataset.markerId = markerId;
    }
  }

  function handleContextAction(action) {
    const menu = document.querySelector('.cm-context-menu');
    if (!menu) return;

    const markerId = menu.dataset.markerId;

    switch (action) {
      case 'edit':
        editMarker(markerId);
        break;
      case 'duplicate':
        duplicateMarker(markerId);
        break;
      case 'delete':
        deleteMarker(markerId);
        break;
      case 'animate':
        changeMarkerAnimation(markerId);
        break;
      case 'anchor':
        anchorMarker(markerId);
        break;
    }

    menu.classList.remove('active');
  }

  function editMarker(id) {
    const marker = state.markers.find((m) => m.id === id);
    if (!marker) return;

    state.editingMarkerId = id;

    document.getElementById('marker-title').value = marker.title;
    document.getElementById('marker-icon').value = marker.icon;
    document.getElementById('marker-animation').value =
      marker.animation || 'none';
    document.getElementById('icon-preview').textContent = marker.icon;
    document.getElementById('marker-description').value =
      marker.description || '';
    document.getElementById('marker-link-url').value = marker.linkUrl || '';
    document.getElementById('marker-link-title').value = marker.linkTitle || '';
    document.getElementById('marker-image-url').value = marker.imageUrl || '';

    document.getElementById('add-marker-btn').style.display = 'none';
    document.getElementById('save-marker-btn').style.display = 'inline-block';
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';

    const panel = document.querySelector('.cm-panel');
    if (panel) panel.classList.add('active');
    switchTab('markers');
  }

  function duplicateMarker(id) {
    const marker = state.markers.find((m) => m.id === id);
    if (!marker) return;

    const duplicate = {
      ...marker,
      id: Date.now().toString(),
      title: marker.title + ' (Copy)',
      x: parseFloat(marker.x) + 2 + '%',
      y: parseFloat(marker.y) + 2 + '%',
      created: new Date().toISOString(),
    };

    state.markers.push(duplicate);
    saveData();
    updateMarkersList();
    renderMarkers();

    showMessage('Marker duplicated!', 'success');
  }

  function deleteMarker(id) {
    if (confirm('Delete this marker?')) {
      state.markers = state.markers.filter((m) => m.id !== id);
      saveData();
      updateMarkersList();
      renderMarkers();

      showMessage('Marker deleted!', 'success');
      sendWebhook('marker_deleted', { id });
    }
  }

  function changeMarkerAnimation(id) {
    const marker = state.markers.find((m) => m.id === id);
    if (!marker) return;

    const animations = [
      'none',
      'pulse',
      'bounce',
      'rotate',
      'glow',
      'shake',
      'wiggle',
      'fade',
      'flip',
      'zoom',
      'slide',
      'spin',
    ];
    const currentIndex = animations.indexOf(marker.animation || 'none');
    const nextIndex = (currentIndex + 1) % animations.length;

    marker.animation = animations[nextIndex];
    saveData();
    renderMarkers();

    showMessage(`Animation changed to ${animations[nextIndex]}`, 'success');
  }

  function anchorMarker(id) {
    const marker = state.markers.find((m) => m.id === id);
    if (!marker) return;

    showMessage('Click on an element to anchor this marker', 'success');
    document.body.style.cursor = 'crosshair';

    function handleAnchorClick(e) {
      e.preventDefault();
      e.stopPropagation();

      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (
        target &&
        target !== document.body &&
        target !== document.documentElement
      ) {
        let selector = target.tagName.toLowerCase();
        if (target.id) {
          selector = `#${escapeSelector(target.id)}`;
        } else if (target.className && typeof target.className === 'string') {
          const classes = target.className.split(' ').filter((c) => c.trim());
          if (classes.length > 0) {
            selector += `.${classes.map((c) => escapeSelector(c)).join('.')}`;
          }
        }

        marker.anchorSelector = selector;
        marker.isAnchored = true;

        const rect = target.getBoundingClientRect();
        marker.anchorOffsetX = e.clientX - rect.left;
        marker.anchorOffsetY = e.clientY - rect.top;

        target.style.outline = '2px solid #667eea';
        setTimeout(() => {
          target.style.outline = '';
        }, 1000);

        showMessage('Marker anchored!', 'success');
        saveData();
        renderMarkers();
      }

      document.body.style.cursor = '';
      document.removeEventListener('click', handleAnchorClick);
    }

    setTimeout(() => {
      document.addEventListener('click', handleAnchorClick, { once: true });
    }, 100);
  }

  function anchorShape(id) {
    let shape = state.shapes.find((s) => s.id === id);
    let isPath = false;

    if (!shape) {
      shape = state.paths.find((p) => p.id === id);
      isPath = true;
    }

    if (!shape) return;

    showMessage(
      'Click on an element to anchor this ' + (isPath ? 'drawing' : 'shape'),
      'success'
    );
    document.body.style.cursor = 'crosshair';

    function handleAnchorClick(e) {
      e.preventDefault();
      e.stopPropagation();

      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (
        target &&
        target !== document.body &&
        target !== document.documentElement
      ) {
        let selector = target.tagName.toLowerCase();
        if (target.id) {
          selector = `#${escapeSelector(target.id)}`;
        } else if (target.className && typeof target.className === 'string') {
          const classes = target.className.split(' ').filter((c) => c.trim());
          if (classes.length > 0) {
            selector += `.${classes.map((c) => escapeSelector(c)).join('.')}`;
          }
        }

        shape.anchorSelector = selector;
        shape.isAnchored = true;

        const rect = target.getBoundingClientRect();

        if (isPath) {
          if (!shape.originalPath) {
            shape.originalPath = shape.path;
          }
          shape.anchorOffsetX = e.clientX - rect.left - window.pageXOffset;
          shape.anchorOffsetY = e.clientY - rect.top - window.pageYOffset;
        } else {
          shape.anchorOffsetX = e.clientX - rect.left;
          shape.anchorOffsetY = e.clientY - rect.top;
          shape.originalX = shape.x;
          shape.originalY = shape.y;
        }

        target.style.outline = '2px solid #667eea';
        setTimeout(() => {
          target.style.outline = '';
        }, 1000);

        showMessage((isPath ? 'Drawing' : 'Shape') + ' anchored!', 'success');
        saveData();

        if (isPath) {
          renderPaths();
        } else {
          renderShapes();
        }
      }

      document.body.style.cursor = '';
      document.removeEventListener('click', handleAnchorClick);
    }

    setTimeout(() => {
      document.addEventListener('click', handleAnchorClick, { once: true });
    }, 100);
  }

  // ========================================
  // Rendering Functions
  // ========================================

  function renderMarkers() {
    const overlay = document.getElementById('marker-overlay');
    if (!overlay) return;

    overlay.querySelectorAll('.cm-marker').forEach((el) => el.remove());

    state.markers.forEach((marker) => {
      const markerEl = document.createElement('div');
      markerEl.className = `cm-marker ${
        state.settings.animations
          ? `animate-${marker.animation || 'pulse'}`
          : ''
      }`;
      markerEl.innerHTML = marker.icon;
      markerEl.dataset.markerId = marker.id;

      if (marker.isAnchored && marker.anchorSelector) {
        try {
          const anchorEl = document.querySelector(marker.anchorSelector);
          if (anchorEl) {
            const rect = anchorEl.getBoundingClientRect();
            markerEl.style.left =
              rect.left + (marker.anchorOffsetX || 0) + 'px';
            markerEl.style.top = rect.top + (marker.anchorOffsetY || 0) + 'px';
          } else {
            markerEl.style.left = marker.x;
            markerEl.style.top = marker.y;
          }
        } catch (e) {
          markerEl.style.left = marker.x;
          markerEl.style.top = marker.y;
        }
      } else {
        markerEl.style.left = marker.x;
        markerEl.style.top = marker.y;
      }

      if (marker.isAnchored) {
        markerEl.classList.add('anchored');
      }

      if (state.selectedMarkers.has(marker.id)) {
        markerEl.classList.add('selected');
      }

      // Event listeners
      markerEl.addEventListener('click', (e) => {
        if (state.isBulkMode) {
          e.stopPropagation();
          if (state.selectedMarkers.has(marker.id)) {
            state.selectedMarkers.delete(marker.id);
          } else {
            state.selectedMarkers.add(marker.id);
          }
          updateBulkToolbar();
          markerEl.classList.toggle('selected');
        } else if (!state.isEditMode) {
          e.stopPropagation();
          showTooltip(e, marker, true);
        }
      });

      markerEl.addEventListener('mousedown', (e) => {
        if (state.isEditMode && !state.isBulkMode) {
          startDrag(e, 'marker');
        }
      });

      markerEl.addEventListener('mouseenter', (e) => {
        if (
          !state.isEditMode &&
          state.tooltip &&
          !state.tooltip.classList.contains('persistent')
        ) {
          showTooltip(e, marker, false);
        }
      });

      markerEl.addEventListener('mouseleave', () => {
        if (state.tooltip && !state.tooltip.classList.contains('persistent')) {
          hideTooltip();
        }
      });

      overlay.appendChild(markerEl);
    });
  }

  function renderShapes() {
    const canvas = document.getElementById('drawing-canvas');
    if (!canvas) return;

    canvas.querySelectorAll('.cm-drawing-shape').forEach((el) => el.remove());

    state.shapes.forEach((shape) => {
      const shapeEl = document.createElement('div');
      shapeEl.className = `cm-drawing-shape ${shape.type}`;
      shapeEl.dataset.shapeId = shape.id;

      if (shape.isAnchored && shape.anchorSelector) {
        try {
          const anchorEl = document.querySelector(shape.anchorSelector);
          if (anchorEl) {
            const rect = anchorEl.getBoundingClientRect();
            shapeEl.style.left = rect.left + (shape.anchorOffsetX || 0) + 'px';
            shapeEl.style.top = rect.top + (shape.anchorOffsetY || 0) + 'px';
          } else {
            shapeEl.style.left = shape.x;
            shapeEl.style.top = shape.y;
          }
        } catch (e) {
          shapeEl.style.left = shape.x;
          shapeEl.style.top = shape.y;
        }
      } else {
        shapeEl.style.left = shape.x;
        shapeEl.style.top = shape.y;
      }

      if (shape.type === 'text') {
        shapeEl.textContent = shape.text;
        shapeEl.style.color = shape.borderColor || '#667eea';
        shapeEl.style.fontSize = (shape.fontSize || 16) + 'px';
        shapeEl.style.fontFamily = shape.fontFamily || 'Inter, sans-serif';
        shapeEl.style.fontWeight = shape.bold ? 'bold' : 'normal';
        shapeEl.style.fontStyle = shape.italic ? 'italic' : 'normal';
      } else if (shape.type === 'line' || shape.type === 'arrow') {
        shapeEl.style.width = shape.width;
        shapeEl.style.transform = shape.transform;
        shapeEl.style.borderColor = shape.borderColor || '#667eea';
        shapeEl.style.borderStyle = shape.borderStyle || 'solid';
      } else {
        shapeEl.style.width = shape.width;
        shapeEl.style.height = shape.height;
        shapeEl.style.borderColor = shape.borderColor || '#667eea';
        shapeEl.style.borderStyle = shape.borderStyle || 'solid';
      }

      shapeEl.addEventListener('click', (e) => {
        e.stopPropagation();

        if (state.isDrawingMode) {
          if (state.currentDrawingTool === 'select') {
            state.selectedShapeId = shape.id;
            document
              .querySelectorAll('.cm-drawing-shape')
              .forEach((s) => s.classList.remove('selected'));
            shapeEl.classList.add('selected');
            return;
          } else if (state.currentDrawingTool === 'delete') {
            state.shapes = state.shapes.filter((s) => s.id !== shape.id);
            saveData();
            renderShapes();
            return;
          }
        }
      });

      shapeEl.addEventListener('mousedown', (e) => {
        if (
          state.isDrawingMode &&
          state.currentDrawingTool === 'select' &&
          shapeEl.classList.contains('selected')
        ) {
          e.stopPropagation();

          if (shape.isAnchored) {
            showMessage(
              'This shape is anchored. Right-click to un-anchor first.',
              'error'
            );
            return;
          }

          const startX = e.clientX - parseInt(shapeEl.style.left);
          const startY = e.clientY - parseInt(shapeEl.style.top);

          function onMouseMove(ev) {
            shapeEl.style.left = ev.clientX - startX + 'px';
            shapeEl.style.top = ev.clientY - startY + 'px';
          }

          function onMouseUp() {
            if (shape.isAnchored) {
              renderShapes();
              showMessage(
                'Anchored shapes cannot be moved. Un-anchor first to reposition.',
                'error'
              );
            } else {
              shape.x = shapeEl.style.left;
              shape.y = shapeEl.style.top;
              saveData();
            }

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          }

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }
      });

      shapeEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (
          state.isDrawingMode &&
          !['select', 'delete'].includes(state.currentDrawingTool)
        ) {
          return;
        }

        const menu = document.querySelector('.cm-shape-context-menu');
        if (menu) {
          menu.style.left = e.pageX + 'px';
          menu.style.top = e.pageY + 'px';
          menu.classList.add('active');
          menu.dataset.shapeId = shape.id;
        }
      });

      canvas.appendChild(shapeEl);
    });
  }

  // Completing remaining rendering and utility functions

  /**
   * anchorPath(id)
   * Attach an anchor to a free-draw path by clicking a page element.
   */
  function anchorPath(id) {
    const pathObj = state.paths.find((p) => p.id === id);
    if (!pathObj) return;

    showMessage('Click on an element to anchor this drawing', 'success');
    document.body.style.cursor = 'crosshair';

    function handleAnchorClick(e) {
      e.preventDefault();
      e.stopPropagation();

      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (
        target &&
        target !== document.body &&
        target !== document.documentElement
      ) {
        let selector = target.tagName.toLowerCase();
        if (target.id) {
          selector = `#${escapeSelector(target.id)}`;
        } else if (target.className && typeof target.className === 'string') {
          const classes = target.className.split(' ').filter((c) => c.trim());
          if (classes.length > 0) {
            selector += `.${classes.map((c) => escapeSelector(c)).join('.')}`;
          }
        }

        pathObj.anchorSelector = selector;
        pathObj.isAnchored = true;
        if (!pathObj.originalPath) pathObj.originalPath = pathObj.path;

        const rect = target.getBoundingClientRect();
        pathObj.anchorOffsetX = e.clientX - rect.left;
        pathObj.anchorOffsetY = e.clientY - rect.top;

        target.style.outline = '2px solid #667eea';
        setTimeout(() => {
          target.style.outline = '';
        }, 1000);

        showMessage('Drawing anchored!', 'success');
        saveData();
        renderPaths();
      }

      document.body.style.cursor = '';
      document.removeEventListener('click', handleAnchorClick);
    }

    setTimeout(() => {
      document.addEventListener('click', handleAnchorClick, { once: true });
    }, 100);
  }
  function renderPaths() {
    const svgCanvas = document.getElementById('svg-canvas');
    if (!svgCanvas) return;

    svgCanvas.innerHTML = '';

    if (state.isDrawingMode) {
      if (state.currentDrawingTool === 'pen') {
        svgCanvas.style.pointerEvents = 'none';
      } else if (['select', 'delete'].includes(state.currentDrawingTool)) {
        svgCanvas.style.pointerEvents = 'auto';
      }
    } else {
      svgCanvas.style.pointerEvents = 'none';
    }

    state.paths.forEach((pathData) => {
      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', pathData.color);
      path.setAttribute('stroke-width', pathData.strokeWidth || '3');

      path.setAttribute('d', pathData.path);
      path.setAttribute('data-path-id', pathData.id);
      path.style.cursor = 'pointer';
      path.style.pointerEvents = 'visibleStroke';

      path.addEventListener('click', (e) => {
        e.stopPropagation();

        if (state.isDrawingMode) {
          if (state.currentDrawingTool === 'select') {
            svgCanvas.querySelectorAll('path').forEach((p) => {
              p.classList.remove('selected');
            });
            path.classList.add('selected');
          } else if (state.currentDrawingTool === 'delete') {
            state.paths = state.paths.filter((p) => p.id !== pathData.id);
            saveData();
            renderPaths();
          }
        }
      });

      path.addEventListener('mousedown', (e) => {
        // If anchored, do not allow dragging with the select tool.
        if (
          pathData.isAnchored &&
          state.isDrawingMode &&
          state.currentDrawingTool === 'select'
        ) {
          showMessage(
            'This drawing is anchored. Right-click to un-anchor first.',
            'error'
          );
          return;
        }

        if (
          state.isDrawingMode &&
          state.currentDrawingTool === 'select' &&
          path.classList.contains('selected')
        ) {
          e.stopPropagation();

          const startX = e.clientX;
          const startY = e.clientY;
          const originalPath = pathData.path;

          function onMouseMove(ev) {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            const transformedPath = originalPath.replace(
              /([ML])\s*(\d+)\s+(\d+)/g,
              (match, cmd, x, y) => {
                const newX = parseInt(x) + dx;
                const newY = parseInt(y) + dy;
                return `${cmd} ${newX} ${newY}`;
              }
            );

            path.setAttribute('d', transformedPath);
          }

          function onMouseUp(ev) {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            pathData.path = originalPath.replace(
              /([ML])\s*(\d+)\s+(\d+)/g,
              (match, cmd, x, y) => {
                const newX = parseInt(x) + dx;
                const newY = parseInt(y) + dy;
                return `${cmd} ${newX} ${newY}`;
              }
            );

            saveData();

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          }

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }
      });

      path.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (
          state.isDrawingMode &&
          !['select', 'delete'].includes(state.currentDrawingTool)
        ) {
          return;
        }

        const menu = document.querySelector('.cm-shape-context-menu');
        if (menu) {
          menu.style.left = e.pageX + 'px';
          menu.style.top = e.pageY + 'px';
          menu.classList.add('active');
          menu.dataset.shapeId = pathData.id;
          menu.dataset.shapeType = 'path';
        }
      });

      svgCanvas.appendChild(path);

      // If this path is anchored, compute a delta between the path's current screen rect and the anchor element rect.
      if (pathData.isAnchored && pathData.anchorSelector) {
        try {
          const anchorEl = document.querySelector(pathData.anchorSelector);
          if (anchorEl) {
            const anchorRect = anchorEl.getBoundingClientRect();
            const pathRect = path.getBoundingClientRect();

            const desiredLeft = anchorRect.left + (pathData.anchorOffsetX || 0);
            const desiredTop = anchorRect.top + (pathData.anchorOffsetY || 0);

            const deltaX = desiredLeft - pathRect.left;
            const deltaY = desiredTop - pathRect.top;

            path.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            path.style.transformOrigin = '0 0';
          }
        } catch (err) {
          console.error('Failed to compute anchor transform for path:', err);
        }
      }
    });
  }

  function updateMarkersList(markersToShow = state.markers) {
    const container = document.getElementById('markers-container');
    if (!container) return;

    if (markersToShow.length === 0) {
      container.innerHTML =
        '<p style="text-align:center; color:#a0aec0;">No markers yet!</p>';
      const countEl = document.getElementById('markers-count');
      if (countEl) countEl.textContent = '0';
      return;
    }

    container.innerHTML = markersToShow
      .map(
        (marker) => `
        <div class="cm-marker-item" data-marker-id="${marker.id}">
          <div style="font-size: 28px; margin-right: 16px;">${marker.icon}</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(
              marker.title
            )}</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${
              marker.x
            }, ${marker.y}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="cm-btn cm-btn-secondary marker-edit-btn" data-id="${
              marker.id
            }" style="padding: 8px 12px; font-size: 12px;">✏️</button>
            <button class="cm-btn cm-btn-danger marker-delete-btn" data-id="${
              marker.id
            }" style="padding: 8px 12px; font-size: 12px;">🗑️</button>
          </div>
        </div>
      `
      )
      .join('');

    const countEl = document.getElementById('markers-count');
    if (countEl) countEl.textContent = markersToShow.length.toString();

    container.querySelectorAll('.marker-edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => editMarker(btn.dataset.id));
    });

    container.querySelectorAll('.marker-delete-btn').forEach((btn) => {
      btn.addEventListener('click', () => deleteMarker(btn.dataset.id));
    });
  }

  // ========================================
  // Drawing Functions
  // ========================================

  function initDrawing() {
    const canvas = document.getElementById('drawing-canvas');
    const svgCanvas = document.getElementById('svg-canvas');
    if (!canvas || !svgCanvas) return;

    let isDrawing = false;
    let startX, startY;
    let currentShape = null;
    let currentPath = null;
    let textPromptActive = false;

    if (window._drawingHandlers) {
      canvas.removeEventListener(
        'mousedown',
        window._drawingHandlers.mousedown
      );
      svgCanvas.removeEventListener(
        'mousedown',
        window._drawingHandlers.mousedown
      );
      document.removeEventListener(
        'mousemove',
        window._drawingHandlers.mousemove
      );
      document.removeEventListener('mouseup', window._drawingHandlers.mouseup);
    }

    const handleMouseDown = (e) => {
      if (!state.isDrawingMode) return;
      if (e.button === 2) return;
      if (['select', 'delete', 'clear'].includes(state.currentDrawingTool)) return;

      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;

      if (state.currentDrawingTool === 'pen') {
        currentPath = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        currentPath.setAttribute('fill', 'none');
        currentPath.setAttribute(
          'stroke',
          document.getElementById('draw-color').value
        );
        currentPath.setAttribute(
          'stroke-width',
          document.getElementById('draw-thickness').value
        );
        currentPath.setAttribute('d', `M ${startX} ${startY}`);
        svgCanvas.appendChild(currentPath);
      } else if (state.currentDrawingTool === 'text') {
        if (textPromptActive) return;

        textPromptActive = true;
        const text = prompt('Enter text:');
        textPromptActive = false;

        if (text) {
          const shape = {
            id: Date.now().toString(),
            type: 'text',
            text,
            x: startX + 'px',
            y: startY + 'px',
            borderColor: document.getElementById('draw-color').value,
            fontSize: document.getElementById('text-size')?.value || 16,
            bold: document.getElementById('text-bold')?.checked || false,
            italic: document.getElementById('text-italic')?.checked || false,
            fontFamily: 'Inter, sans-serif',
          };
          state.shapes.push(shape);
          saveData();
          renderShapes();
        }
        isDrawing = false;
        return;
      } else {
        currentShape = document.createElement('div');
        currentShape.className = `cm-drawing-shape ${state.currentDrawingTool}`;
        currentShape.style.left = startX + 'px';
        currentShape.style.top = startY + 'px';
        currentShape.style.borderColor =
          document.getElementById('draw-color').value;
        currentShape.style.borderStyle =
          document.getElementById('draw-style').value;

        if (
          state.currentDrawingTool === 'line' ||
          state.currentDrawingTool === 'arrow'
        ) {
          currentShape.style.width = '0px';
          currentShape.style.transform = 'rotate(0deg)';
        } else {
          currentShape.style.width = '0px';
          currentShape.style.height = '0px';
        }

        canvas.appendChild(currentShape);
      }
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;

      if (state.currentDrawingTool === 'pen' && currentPath) {
        const d = currentPath.getAttribute('d');
        currentPath.setAttribute('d', `${d} L ${e.clientX} ${e.clientY}`);
      } else if (
        (state.currentDrawingTool === 'line' ||
          state.currentDrawingTool === 'arrow') &&
        currentShape
      ) {
        const dx = e.clientX - startX;
        // Continuing from Part 6 - completing the handleMouseMove function
        // Correcting the incomplete line

        const dy = e.clientY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        currentShape.style.width = length + 'px';
        currentShape.style.transform = `rotate(${angle}deg)`;
      } else if (currentShape) {
        const width = Math.abs(e.clientX - startX);
        const height = Math.abs(e.clientY - startY);
        currentShape.style.width = width + 'px';
        currentShape.style.height = height + 'px';
        currentShape.style.left = Math.min(e.clientX, startX) + 'px';
        currentShape.style.top = Math.min(e.clientY, startY) + 'px';
      }
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;
      isDrawing = false;

      if (state.currentDrawingTool === 'pen' && currentPath) {
        const pathData = currentPath.getAttribute('d');
        const pathId = Date.now().toString();

        currentPath.setAttribute('data-path-id', pathId);
        currentPath.style.cursor = 'pointer';

        state.paths.push({
          id: pathId,
          path: pathData,
          color: currentPath.getAttribute('stroke'),
          strokeWidth: currentPath.getAttribute('stroke-width'),
        });

        saveData();
        renderPaths();
        currentPath = null;

        if (svgCanvas && state.isDrawingMode) {
          svgCanvas.style.pointerEvents = 'auto';
        }
      } else if (currentShape) {
        const shape = {
          id: Date.now().toString(),
          type: state.currentDrawingTool,
          x: currentShape.style.left,
          y: currentShape.style.top,
          width: currentShape.style.width,
          height: currentShape.style.height,
          transform: currentShape.style.transform,
          borderColor: document.getElementById('draw-color').value,
          borderStyle: document.getElementById('draw-style').value,
        };
        state.shapes.push(shape);
        saveData();
        renderShapes();
        currentShape = null;
      }
    };

    window._drawingHandlers = {
      mousedown: handleMouseDown,
      mousemove: handleMouseMove,
      mouseup: handleMouseUp,
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    svgCanvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function selectDrawingTool(tool) {
    state.currentDrawingTool = tool;

    document.querySelectorAll('.cm-drawing-tool').forEach((t) => {
      t.classList.toggle('active', t.dataset.tool === tool);
    });

    const canvas = document.getElementById('drawing-canvas');
    if (canvas) {
      if (tool === 'select' || tool === 'delete') {
        canvas.style.pointerEvents = 'none';
      } else {
        canvas.style.pointerEvents = state.isDrawingMode ? 'auto' : 'none';
      }

      if (tool === 'select') {
        canvas.style.cursor = 'pointer';
      } else if (tool === 'delete') {
        canvas.style.cursor = 'not-allowed';
      } else {
        canvas.style.cursor = 'crosshair';
      }
    }

    renderPaths();
  }

  // ========================================
  // Drag Functions
  // ========================================

  function startDrag(e, type) {
    if (type === 'marker' && !state.isEditMode) return;

    state.isDragging = true;
    state.currentDragItem = e.target;
    state.currentDragItem.classList.add('dragging');

    const rect = state.currentDragItem.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    function onMouseMove(e) {
      if (!state.isDragging) return;

      const x = ((e.clientX - offsetX) / window.innerWidth) * 100;
      const y = ((e.clientY - offsetY) / window.innerHeight) * 100;

      state.currentDragItem.style.left = `${Math.max(0, Math.min(100, x))}%`;
      state.currentDragItem.style.top = `${Math.max(0, Math.min(100, y))}%`;
    }

    function onMouseUp() {
      if (!state.isDragging) return;

      state.isDragging = false;
      state.currentDragItem.classList.remove('dragging');

      const id = state.currentDragItem.dataset.markerId;
      const marker = state.markers.find((m) => m.id === id);

      if (marker) {
        marker.x = state.currentDragItem.style.left;
        marker.y = state.currentDragItem.style.top;
        saveData();
        updateMarkersList();
      }

      state.currentDragItem = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // ========================================
  // Tooltip Functions
  // ========================================

  window._cmTooltipOutsideHandler = null;
  window._cmTooltipCloseHandler = null;

  function showTooltip(e, marker, isPersistent = false) {
    if (state.isDragging || !state.tooltip) return;

    state.tooltip.innerHTML = `
      ${
        isPersistent
          ? '<div class="cm-tooltip-close" id="cm-tooltip-close">✕</div>'
          : ''
      }
      <div style="font-weight: 600; color: #667eea; margin-bottom: 8px; font-size: 16px;">${escapeHtml(
        marker.title
      )}</div>
      <div style="margin-bottom: 8px;">${escapeHtml(
        marker.description || 'No description'
      )}</div>
      ${
        marker.linkUrl
          ? `<div style="margin-top: 8px;"><a href="${escapeAttr(
              marker.linkUrl
            )}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 600;">🔗 ${escapeHtml(
              marker.linkTitle || 'View Link'
            )}</a></div>`
          : ''
      }
      ${
        marker.imageUrl
          ? `<div style="margin-top: 8px;"><img src="${escapeAttr(
              marker.imageUrl
            )}" style="max-width: 100%; border-radius: 8px;"></div>`
          : ''
      }
    `;

    state.tooltip.classList.add('active');

    if (isPersistent) {
      state.tooltip.classList.add('persistent');
      state.tooltip.style.pointerEvents = 'auto';

      const closeBtn = document.getElementById('cm-tooltip-close');
      if (closeBtn) {
        if (window._cmTooltipCloseHandler) {
          closeBtn.removeEventListener('click', window._cmTooltipCloseHandler);
          window._cmTooltipCloseHandler = null;
        }
        window._cmTooltipCloseHandler = function (ev) {
          ev.stopPropagation();
          hideTooltip();
        };
        closeBtn.addEventListener('click', window._cmTooltipCloseHandler);
      }

      if (window._cmTooltipOutsideHandler) {
        document.removeEventListener('click', window._cmTooltipOutsideHandler);
        window._cmTooltipOutsideHandler = null;
      }
      window._cmTooltipOutsideHandler = function (evt) {
        if (!state.tooltip.contains(evt.target)) {
          hideTooltip();
        }
      };
      setTimeout(
        () =>
          document.addEventListener('click', window._cmTooltipOutsideHandler),
        0
      );
    } else {
      state.tooltip.style.pointerEvents = 'none';
    }

    const tooltipWidth = 350;
    const tooltipHeight = 200;
    const padding = 15;

    let x = e.pageX + padding;
    let y = e.pageY + padding;

    if (x + tooltipWidth > window.innerWidth) {
      x = e.pageX - tooltipWidth - padding;
    }
    if (y + tooltipHeight > window.innerHeight) {
      y = e.pageY - tooltipHeight - padding;
    }

    if (x < 0) x = padding;
    if (y < 0) y = padding;

    state.tooltip.style.left = `${x}px`;
    state.tooltip.style.top = `${y}px`;
  }

  function hideTooltip() {
    if (state.tooltip) {
      state.tooltip.classList.remove('active', 'persistent');
      state.tooltip.style.pointerEvents = 'none';
    }

    if (window._cmTooltipOutsideHandler) {
      document.removeEventListener('click', window._cmTooltipOutsideHandler);
      window._cmTooltipOutsideHandler = null;
    }

    const closeBtn = document.getElementById('cm-tooltip-close');
    if (closeBtn && window._cmTooltipCloseHandler) {
      closeBtn.removeEventListener('click', window._cmTooltipCloseHandler);
      window._cmTooltipCloseHandler = null;
    }
  }

  // ========================================
  // Note Taking Functions
  // ========================================

  function applyFormat(format) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    switch (format) {
      case 'bold':
        document.execCommand('bold');
        break;
      case 'italic':
        document.execCommand('italic');
        break;
      case 'underline':
        document.execCommand('underline');
        break;
      case 'list':
        document.execCommand('insertUnorderedList');
        break;
      case 'link': {
        const url = prompt('Enter URL:');
        if (url) document.execCommand('createLink', false, url);
        break;
      }
    }
  }

  function saveNote() {
    const content = document.getElementById('note-content').innerHTML;
    const note = {
      id: Date.now().toString(),
      content,
      website: WEBSITE_HOST,
      created: new Date().toISOString(),
    };

    let notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
    notes.push(note);
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));

    showMessage('Note saved!', 'success');
    sendWebhook('note_saved', note);
  }

  function loadNotes() {
    const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');

    if (notes.length > 0) {
      const latestNote = notes[notes.length - 1];
      setTimeout(() => {
        const noteContent = document.getElementById('note-content');
        if (noteContent) {
          noteContent.innerHTML = latestNote.content;
        }
      }, 100);
    }
  }

  // ========================================
  // Register Menu Command
  // ========================================

  GM_registerMenuCommand('🎯 Activate Markers Pro', init);

  // ========================================
  // Auto-initialization
  // ========================================

  const autoInitPatterns = [
    'mapgenie.io',
    'maps.google',
    'google.com/maps',
    'openstreetmap.org',
    'bing.com/maps',
    'here.com',
    'waze.com',
    'reddit.com/r/gaming',
    'github.com',
    'stackoverflow.com',
  ];

  const shouldAutoInit = autoInitPatterns.some((pattern) =>
    window.location.href.includes(pattern)
  );

  if (shouldAutoInit) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      setTimeout(init, 1000);
    }
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showActivationButton);
    } else {
      setTimeout(showActivationButton, 500);
    }
  }
})();