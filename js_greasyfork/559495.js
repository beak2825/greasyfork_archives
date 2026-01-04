// ==UserScript==
// @name         Teambition工单创建
// @namespace    http://maxpeedingrods.cn/
// @version      0.0.5
// @description  创建工单需求
// @author       yang
// @license      No License
// @match        *://*/*
// @match        *://*.eccang.com/*
// @match        *://track-web.eccang.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/559495/Teambition%E5%B7%A5%E5%8D%95%E5%88%9B%E5%BB%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/559495/Teambition%E5%B7%A5%E5%8D%95%E5%88%9B%E5%BB%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const myKey = "pro__Access-Token";
  // console.log("1111",myKey);
  let autoSaveTimer = null; // 自动保存计时器
  let issueReasonOptions = []; // 问题原因选项缓存，用于搜索过滤
  let issueReasonSelected = []; // 问题原因已选中的值（数组）
  let isFetchingOptions = false; // 是否正在请求下拉选项，防止重复请求
  let selectOptionsCache = null; // 下拉选项缓存，避免重复请求
  let cachedOrderInfo = null; // 缓存的订单信息（来自iframe）
  let hasActiveOrderListener = false; // 是否有活动的订单信息监听器（临时监听器）

  // 共享上下文对象，存储公共的认证信息和回调函数
  const appContext = {
    authToken: null, // 认证令牌（原始值）
    accessToken: null, // 解析后的 access token
    operatorId: null, // 操作人 ID
    uploadTokens: [], // 文件上传凭证数组（包含 uploadUrl, token 等信息）
  };

  /**
   * 获取并初始化认证令牌
   */
  function initAuthToken() {
    const tokenRaw = GM_getValue(myKey);
    if (tokenRaw) {
      appContext.authToken = tokenRaw;
      const tokenObj = safeParse(tokenRaw);
      appContext.accessToken = tokenObj && tokenObj.value;
    } else {
      appContext.authToken = null;
      appContext.accessToken = null;
    }
    return appContext.accessToken;
  }

  /**
   * 公共的成功处理函数
   */
  function defaultOnSuccess(data) {
    console.log("操作成功:", data);
  }

  /**
   * 公共的错误处理函数
   */
  function defaultOnError(errMsg) {
    console.error("操作失败:", errMsg);
    showResultTips(errMsg || "操作失败，请重试");
    resetSubmitButton();
  }

  /**
   * 重置提交按钮状态
   */
  function resetSubmitButton() {
    const submitBtn = document.getElementById("submitWorkOrderBtn");
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "提交工单";
      submitBtn.style.opacity = "1";
    }
  }

  function start() {
    // 检查是否已经注册过
    if (!GM_getValue("omenuCommandRegistered", false)) {
      GM_registerMenuCommand("创建工单", createWorkOrder);
      // 标记为已注册
      GM_setValue("omenuCommandRegistered", true);
    }

    // 在页面卸载时清除标记
    window.addEventListener("beforeunload", () => {
      GM_setValue("omenuCommandRegistered", false);
    });

    // 如果当前在iframe中运行（eccang.com相关页面），设置消息监听器
    if (isInIframe()) {
      const currentUrl = window.location.href;
      if (
        currentUrl.includes("eccang.com") ||
        currentUrl.includes("track-web")
      ) {
        console.log("脚本在iframe中运行，设置消息监听器");

        // 监听来自父页面的提取请求
        window.addEventListener("message", async (event) => {
          // 验证消息来源（可选，根据实际需求调整）
          if (event.data && event.data.type === "EXTRACT_ORDER_INFO") {
            console.log("收到父页面的提取请求");
            try {
              await extractOrderInfoFromIframe();
            } catch (error) {
              console.error("提取订单信息失败:", error);
            }
          }
        });

        // 页面加载完成后，自动尝试提取一次（作为备用方案）
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => {
            console.log("iframe DOM加载完成，等待内容加载...");
            // 延迟一段时间后自动提取（给内容加载时间）
            setTimeout(() => {
              extractOrderInfoFromIframe().catch((err) => {
                console.log(
                  "自动提取失败（这是正常的，等待用户手动触发）:",
                  err.message
                );
              });
            }, 2000);
          });
        } else {
          // DOM已经加载完成
          setTimeout(() => {
            extractOrderInfoFromIframe().catch((err) => {
              console.log(
                "自动提取失败（这是正常的，等待用户手动触发）:",
                err.message
              );
            });
          }, 2000);
        }
      }
    } else {
      // 在父页面中，设置全局消息监听器，用于接收iframe发送的订单信息
      // 这样即使iframe在页面加载时自动发送消息，也能被捕获
      window.addEventListener("message", (event) => {
        if (event.data && event.data.type === "ORDER_INFO_EXTRACTED") {
          const orderInfo = event.data.data;
          // 如果有活动的临时监听器在等待，不缓存，让临时监听器处理
          if (hasActiveOrderListener) {
            console.log(
              "父页面接收到订单信息，但已有临时监听器在处理，跳过缓存"
            );
            return;
          }
          console.log("父页面接收到iframe发送的订单信息（已缓存）:", orderInfo);
          // 缓存订单信息，供后续使用
          if (orderInfo && orderInfo.success && orderInfo.orderId) {
            cachedOrderInfo = orderInfo;
            console.log('订单信息已缓存，等待用户点击"捕捉"按钮');
          }
        }
      });
    }
  }

  /**
   * 创建工单
   */
  function createWorkOrder() {
    openWorkOrderPage();
  }

  /**
   * 打开工单页面
   */
  function openWorkOrderPage() {
    // 如果已经有弹窗，先关闭
    closeWorkOrderPage();

    if (!document.getElementById("workOrderStyles")) {
      const style = document.createElement("style");
      style.id = "workOrderStyles";
      style.textContent = `
                .wo-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.1);
                    backdrop-filter: none;
                    z-index: 9999;
                    pointer-events: none;
                }

                .wo-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
                    width: 920px;
                    max-width: 96vw;
                    max-height: 90vh;
                    min-width: 600px;
                    min-height: 400px;
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow:
                        0 18px 45px rgba(15, 23, 42, 0.25),
                        0 0 0 1px rgba(148, 163, 184, 0.25);
            z-index: 10000;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            display: flex;
            flex-direction: column;
                    overflow: hidden;
                    pointer-events: auto;
                    resize: none;
                }

                /* 调整大小的边框区域 */
                .wo-resize-handle {
                    position: absolute;
                    background: transparent;
                    z-index: 10001;
                }

                .wo-resize-handle-n {
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    cursor: ns-resize;
                }

                .wo-resize-handle-s {
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    cursor: ns-resize;
                }

                .wo-resize-handle-e {
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 4px;
                    cursor: ew-resize;
                }

                .wo-resize-handle-w {
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: 4px;
                    cursor: ew-resize;
                }

                .wo-resize-handle-ne {
                    top: 0;
                    right: 0;
                    width: 8px;
                    height: 8px;
                    cursor: nesw-resize;
                }

                .wo-resize-handle-nw {
                    top: 0;
                    left: 0;
                    width: 8px;
                    height: 8px;
                    cursor: nwse-resize;
                }

                .wo-resize-handle-se {
                    bottom: 0;
                    right: 0;
                    width: 8px;
                    height: 8px;
                    cursor: nwse-resize;
                }

                .wo-resize-handle-sw {
                    bottom: 0;
                    left: 0;
                    width: 8px;
                    height: 8px;
                    cursor: nesw-resize;
                }

                .wo-header {
                    padding: 14px 20px;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: #ffffff;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    user-select: none;
                }

                .wo-title {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                }

                .wo-toggle-btn {
                    width: 32px;
                    height: 32px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px;
                    border: none;
                    background: rgba(15, 23, 42, 0.22);
                    color: #ffffff;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.15s ease, transform 0.1s ease;
                }

                .wo-toggle-btn:hover {
                    background: rgba(15, 23, 42, 0.35);
                    transform: translateY(-1px);
                }

                .wo-close-btn {
                    width: 32px;
                    height: 32px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px;
                    border: none;
                    background: rgba(15, 23, 42, 0.22);
                    color: #ffffff;
                    font-size: 18px;
                    cursor: pointer;
                    transition: background 0.15s ease, transform 0.1s ease;
                }

                .wo-close-btn:hover {
                    background: rgba(15, 23, 42, 0.35);
                    transform: translateY(-1px);
                }

                .wo-body {
                    display: flex;
                    flex: 1;
                    min-height: 0;
                    background: linear-gradient(120deg, #f8fafc, #f1f5f9);
                }

                .wo-left {
                    flex: 1;
                    padding: 18px 20px 20px;
                    border-right: 1px solid #e2e8f0;
                    overflow-y: auto;
                }

                .wo-right {
                    width: 310px;
                    padding: 18px 18px 20px;
                    background: radial-gradient(circle at top, #f9fafb, #e5e7eb);
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                }

                .wo-section-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 6px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .wo-section-title span {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    border-radius: 999px;
                    background: #22c55e1a;
                    color: #16a34a;
                    font-size: 11px;
                    font-weight: 700;
                }

                .wo-section-subtitle {
                    font-size: 12px;
                    color: #6b7280;
                    margin-bottom: 12px;
                }

                .wo-form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 14px 16px;
                    margin-bottom: 14px;
                }

                .wo-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .wo-label {
                    font-size: 13px;
                    font-weight: 500;
                    color: #111827;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .wo-label-required {
                    color: #ef4444;
                    margin-left: 2px;
                }

                .wo-field-desc {
                    font-size: 11px;
                    color: #9ca3af;
                }

                .wo-input,
                .wo-select,
                .wo-textarea {
                    width: 100%;
                    padding: 7px 9px;
                    border-radius: 6px;
                    border: 1px solid #d1d5db;
                    background-color: #ffffff;
                    font-size: 13px;
                    box-sizing: border-box;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
                }

                .wo-input:focus,
                .wo-select:focus,
                .wo-textarea:focus {
                    outline: none;
                    border-color: #22c55e;
                    box-shadow: 0 0 0 1px #22c55e40;
                    background-color: #f9fffb;
                }

                .wo-textarea {
                    resize: vertical;
                    min-height: 56px;
                }

                .wo-field-block {
                    margin-bottom: 14px;
                }

                .wo-attachment-note {
                    margin-top: 4px;
                    font-size: 11px;
                    color: #9ca3af;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }
                
                .wo-attachment-note > div:first-child {
                    width: 100%;
                }

                .wo-attachment-preview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 8px;
                    margin-top: 8px;
                    width: 100%;
                }

                .wo-attachment-preview-item {
                    position: relative;
                    width: 100%;
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                    background: #f9fafb;
                    display: flex;
                    flex-direction: column;
                }

                .wo-attachment-preview-item .wo-attachment-image-wrapper {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1;
                    overflow: hidden;
                }

                .wo-attachment-preview-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .wo-attachment-preview-item .wo-attachment-item-remove {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.6);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    line-height: 1;
                    padding: 0;
                }

                .wo-attachment-preview-item .wo-attachment-item-remove:hover {
                    background: rgba(239, 68, 68, 0.9);
                }

                .wo-attachment-preview-item .wo-attachment-item-name {
                    display: block;
                    padding: 6px 8px;
                    font-size: 12px;
                    color: #374151;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    cursor: pointer;
                    background: #ffffff;
                    border-top: 1px solid #e5e7eb;
                    transition: background-color 0.2s ease;
                }

                .wo-attachment-preview-item .wo-attachment-item-name:hover {
                    background: #f3f4f6;
                }

                .wo-attachment-preview-item .wo-attachment-item-name-input {
                    display: none;
                    padding: 6px 8px;
                    font-size: 12px;
                    color: #374151;
                    border: 1px solid #3b82f6;
                    border-radius: 4px;
                    width: 100%;
                    box-sizing: border-box;
                    outline: none;
                    background: #ffffff;
                }

                .wo-attachment-preview-item .wo-attachment-item-name-input.editing {
                    display: block;
                }

                .wo-attachment-preview-item .wo-attachment-item-name.editing {
                    display: none;
                }

                .wo-attachment-preview-item img {
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .wo-attachment-preview-item img:hover {
                    transform: scale(1.05);
                }

                /* 图片放大模态框样式 */
                .wo-image-modal {
                    display: none;
                    position: fixed;
                    z-index: 10002;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    animation: fadeIn 0.3s ease;
                }

                .wo-image-modal.show {
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                }

                .wo-image-modal-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                    margin: auto;
                    animation: zoomIn 0.3s ease;
                }

                .wo-image-modal-content img {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                    display: block;
                }

                .wo-image-modal-close {
                    position: absolute;
                    top: 20px;
                    right: 35px;
                    color: #f1f1f1;
                    font-size: 40px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 10003;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }

                .wo-image-modal-close:hover {
                    background: rgba(239, 68, 68, 0.8);
                    transform: rotate(90deg);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes zoomIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .wo-attachment-remove-btn {
                    padding: 4px 10px;
                    font-size: 11px;
                    border-radius: 4px;
                    border: 1px solid #ef4444;
                    background: #ffffff;
                    color: #ef4444;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .wo-attachment-remove-btn:hover {
                    background: #ef4444;
                    color: #ffffff;
                }

                .wo-attachment-area {
                    position: relative;
                    border: 2px dashed #d1d5db;
                    border-radius: 8px;
                    padding: 16px;
                    background: #f9fafb;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }

                .wo-attachment-area:hover {
                    border-color: #22c55e;
                    background: #f0fdf4;
                }

                .wo-attachment-area.drag-over {
                    border-color: #22c55e;
                    background: #dcfce7;
                    border-style: solid;
                }

                .wo-attachment-area-content {
                    text-align: center;
                    color: #6b7280;
                    font-size: 13px;
                }

                .wo-attachment-area-content .icon {
                    font-size: 24px;
                    margin-bottom: 8px;
                    display: block;
                }

                .wo-attachment-area-content .text {
                    margin-bottom: 4px;
                }

                .wo-attachment-area-content .hint {
                    font-size: 11px;
                    color: #9ca3af;
                }

                .wo-multiselect-wrapper {
                    position: relative;
                }

                .wo-multiselect-search {
                    width: 100%;
                    padding: 7px 9px;
                    border-radius: 6px;
                    border: 1px solid #d1d5db;
                    background-color: #ffffff;
                    font-size: 13px;
                    box-sizing: border-box;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease;
                }

                .wo-multiselect-search:focus {
                    outline: none;
                    border-color: #22c55e;
                    box-shadow: 0 0 0 1px #22c55e40;
                }

                .wo-multiselect-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    margin-top: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    background: #ffffff;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    display: none;
                }

                .wo-multiselect-dropdown.show {
                    display: block;
                }

                .wo-multiselect-loading {
                    padding: 12px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 12px;
                }

                .wo-multiselect-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 12px;
                    cursor: pointer;
                    transition: background-color 0.15s ease;
                }

                .wo-multiselect-item:hover {
                    background-color: #f3f4f6;
                }

                .wo-multiselect-item input[type="checkbox"] {
                    margin-right: 8px;
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }

                .wo-multiselect-item label {
                    flex: 1;
                    cursor: pointer;
                    font-size: 13px;
                    color: #111827;
                    margin: 0;
                }

                .wo-multiselect-selected {
                    margin-top: 8px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    min-height: 24px;
                }

                .wo-multiselect-tag {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 8px;
                    background: #e0f2fe;
                    color: #0369a1;
                    border-radius: 4px;
                    font-size: 12px;
                    gap: 6px;
                }

                .wo-multiselect-tag-remove {
                    cursor: pointer;
                    color: #0369a1;
                    font-weight: bold;
                    font-size: 14px;
                    line-height: 1;
                }

                .wo-multiselect-tag-remove:hover {
                    color: #0c4a6e;
                }

                .wo-draft-card {
                    margin-bottom: 16px;
                }

                .wo-draft-card-header {
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #111827;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .wo-draft-card-header svg {
                    width: 14px;
                    height: 14px;
                }

                .wo-draft-btn-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .wo-btn {
                    border-radius: 999px;
                    border: none;
                    padding: 9px 12px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease, opacity 0.15s ease;
                }

                .wo-btn span.icon {
                    font-size: 14px;
                }

                .wo-btn-primary {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    color: #ffffff;
                    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.25);
                }

                .wo-btn-primary:hover {
                    background: linear-gradient(135deg, #1d4ed8, #1d4ed8);
                    transform: translateY(-1px);
                    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.32);
                }

                .wo-btn-warn {
                    background: linear-gradient(135deg, #f97316, #ea580c);
                    color: #ffffff;
                    box-shadow: 0 10px 20px rgba(249, 115, 22, 0.25);
                }

                .wo-btn-warn:hover {
                    background: linear-gradient(135deg, #ea580c, #ea580c);
                    transform: translateY(-1px);
                    box-shadow: 0 14px 28px rgba(249, 115, 22, 0.32);
                }

                .wo-btn-outline {
                    background: #ffffff;
                    color: #111827;
                    border: 1px solid #d1d5db;
                }

                .wo-btn-outline:hover {
                    border-color: #9ca3af;
                    background: #f9fafb;
                }

                .wo-btn:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                    box-shadow: none;
                    transform: none;
                }

                .wo-draft-status {
                    margin-top: 10px;
                    font-size: 12px;
                    min-height: 22px;
                    text-align: center;
                    padding: 7px 8px;
                    border-radius: 8px;
                    background: #f9fafb;
                    border: 1px dashed #e5e7eb;
                }

                .wo-auto-card {
                    margin-bottom: 18px;
                    padding: 10px 11px 11px;
                    background: rgba(255, 255, 255, 0.92);
                    border-radius: 10px;
                    border: 1px solid rgba(209, 213, 219, 0.9);
                    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
                }

                .wo-auto-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .wo-auto-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #111827;
                }

                .wo-auto-label small {
                    font-size: 11px;
                    color: #9ca3af;
                }

                .wo-auto-toggle {
                    width: 36px;
                    height: 20px;
                }

                .wo-auto-desc {
                    font-size: 11px;
                    color: #6b7280;
                }

                .wo-result-card {
                    flex: 1;
                    display: none;
                    padding: 11px 12px 10px;
                    background: rgba(255, 255, 255, 0.98);
                    border-radius: 10px;
                    border: 1px solid rgba(209, 213, 219, 0.95);
                    box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.35);
                    overflow-y: auto;
                    margin-top: 4px;
                }

                .wo-result-title {
                    font-weight: 600;
                    margin-bottom: 6px;
                    color: #111827;
                    font-size: 13px;
                }

                .wo-result-tips {
                    margin-bottom: 6px;
                    min-height: 18px;
                    font-size: 12px;
                }

                .wo-result-content {
                    font-size: 12px;
                    color: #374151;
                    line-height: 1.5;
                }

                .wo-footer {
                    margin-top: auto;
                    padding-top: 14px;
                    border-top: 1px solid #d1d5db;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .wo-submit-btn {
                    width: 100%;
                    padding: 11px 12px;
                    border-radius: 999px;
                    border: none;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: #ffffff;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    box-shadow: 0 14px 30px rgba(34, 197, 94, 0.35);
                    transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, opacity 0.15s ease;
                }

                .wo-submit-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #16a34a, #16a34a);
                    transform: translateY(-1px);
                    box-shadow: 0 18px 40px rgba(22, 163, 74, 0.4);
                }

                .wo-cancel-btn {
                    width: 100%;
                    padding: 9px 12px;
                    border-radius: 999px;
                    border: none;
                    background: #e5e7eb;
                    color: #374151;
                    font-size: 13px;
                    cursor: pointer;
                    transition: background-color 0.15s ease;
                }

                .wo-cancel-btn:hover {
                    background: #d1d5db;
                }

                .wo-submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    box-shadow: none;
                    transform: none;
                }

                .wo-scroll::-webkit-scrollbar {
                    width: 6px;
                }

                .wo-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }

                .wo-scroll::-webkit-scrollbar-thumb {
                    background-color: rgba(148, 163, 184, 0.7);
                    border-radius: 999px;
                }
            `;
      document.head.appendChild(style);
    }

    // 创建弹窗容器
    const modal = document.createElement("div");
    modal.id = "workOrderModal";
    modal.className = "wo-modal";

    // 创建弹窗内容 - 两列布局
    modal.innerHTML = `
            <div class="wo-header">
                <h3 class="wo-title">创建工单</h3>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button id="toggleMaximizeBtn" class="wo-toggle-btn" type="button" aria-label="放大/缩小" title="放大/缩小">
                        <span id="toggleMaximizeIcon">⛶</span>
                    </button>
                    <button id="closeWorkOrderModal" class="wo-close-btn" type="button" aria-label="关闭">
                        ×
                    </button>
                </div>
            </div>
            <div class="wo-body">
                <!-- 左侧表单区域 -->
                <div class="wo-left wo-scroll">
                    <form id="workOrderForm">
                        <div class="wo-section-title">
                            <span>1</span> 基本信息
                        </div>
                        <div class="wo-form-grid">
                            <div class="wo-form-group">
                                <label class="wo-label">
                                    <span>标题</span>
                                </label>
                                <input type="text" id="title" class="wo-input" placeholder="">
                            </div>

                            <div class="wo-form-group">
                                <label class="wo-label" style="position: relative;">
                                    <span>订单号</span>
                                    <button type="button" id="capturePageInfoBtn" class="wo-btn wo-btn-outline" style="position: absolute; right: 110px; top: 50%; transform: translateY(-50%); white-space: nowrap; height: 22px; line-height: 20px; padding: 0 8px; font-size: 12px; margin: 0;">捕获当前页面信息</button>
                                    <button type="button" id="getOrderInfoBtn" class="wo-btn wo-btn-outline" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); white-space: nowrap; height: 22px; line-height: 20px; padding: 0 8px; font-size: 12px; margin: 0;">获取订单信息</button>
                                </label>
                                <input type="text" id="order_id" class="wo-input" placeholder="">
                            </div>
                        </div>

                        <div class="wo-form-grid">
                            <div class="wo-form-group">
                                <label class="wo-label">
                                    <span>SKU<span class="wo-label-required">*</span></span>
                                </label>
                                <input type="text" id="sku" class="wo-input" placeholder="">
                            </div>

                            <div class="wo-form-group">
                                <label class="wo-label">
                                    <span>需支持角色 <span class="wo-label-required">*</span></span>
                                </label>
                                <select id="support_role" class="wo-select">
                                    <option value="">请选择...</option>
                                    <option value="技术支持">技术支持</option>
                                    <option value="仓储支持">仓储支持</option>
                                    <option value="物流支持">物流支持</option>
                                    <option value="财务支持">财务支持</option>
                                </select>
                            </div>
                        </div>

                        <div class="wo-section-title">
                            <span>2</span> 问题信息
                        </div>

                        <div class="wo-form-grid">
                            <div class="wo-form-group">
                                <label class="wo-label">
                                    <span>工单类型 <span class="wo-label-required">*</span></span>
                                </label>
                                <select id="work_order_type" class="wo-select">
                                    <option value="">请选择...</option>
                                    <option value="售后问题">售后问题</option>
                                    <option value="物流问题">物流问题</option>
                                    <option value="产品咨询">产品咨询</option>
                                    <option value="系统问题">系统问题</option>
                                    <option value="其他">其他</option>
                                </select>
                            </div>

                            <div class="wo-form-group">
                                <label class="wo-label">
                                    <span>问题原因（可多选）</span>
                                </label>
                                <div class="wo-multiselect-wrapper">
                                    <input type="text" id="issue_reason_search" class="wo-multiselect-search" placeholder="点击搜索并选择...">
                                    <div class="wo-multiselect-dropdown" id="issue_reason_dropdown">
                                        <div class="wo-multiselect-loading">加载中...</div>
                                    </div>
                                    <div class="wo-multiselect-selected" id="issue_reason_selected"></div>
                                </div>
                            </div>
                        </div>

                        <div class="wo-field-block">
                            <label class="wo-label">
                                <span>问题原因明细</span>
                                <span class="wo-field-desc"></span>
                            </label>
                            <textarea id="issue_detail" class="wo-textarea" rows="2" placeholder=""></textarea>
                        </div>

                        <div class="wo-field-block">
                            <label class="wo-label">
                                <span>问题描述<span class="wo-label-required">*</span></span>
                                    <span class="wo-field-desc">需描述清晰，必填</span>
                            </label>
                                <textarea id="issue_description" class="wo-textarea" rows="4" placeholder="请描述问题详情、时间线、客户诉求、已处理情况等"></textarea>
                        </div>

                        <div class="wo-field-block">
                            <label class="wo-label">
                                <span>问题附件</span>
                                <span class="wo-field-desc"></span>
                            </label>
                            <div class="wo-attachment-area" id="attachment_area">
                                <input type="file" id="attachment" class="wo-input" style="display: none;" multiple>
                                <div class="wo-attachment-area-content">
                                    <div class="text">点击选择文件，或拖拽文件到此处</div>
                                    <div class="hint">支持多个文件，支持复制粘贴（Ctrl+V）</div>
                                </div>
                            </div>
                            <div id="attachment_preview" class="wo-attachment-note">
                                <div id="attachment_preview_text">未选择文件</div>
                                <button type="button" id="removeAllAttachmentsBtn" class="wo-attachment-remove-btn" style="display: none;">清空所有</button>
                            </div>
                        </div>

                        <div class="wo-field-block" style="margin-bottom: 6px;">
                            <label class="wo-label">
                                <span>客诉额外费用</span>
                                <span class="wo-field-desc"></span>
                            </label>
                            <input type="text" id="extra_cost" class="wo-input" placeholder="示例：500  EUR 除订单支付本身金额之外的额外车损/安装等费用">
                        </div>

                        <div class="wo-field-block" style="margin-bottom: 6px;">
                            <label class="wo-label">
                                <span>备注</span>
                                <span class="wo-field-desc"></span>
                            </label>
                            <textarea id="remark" class="wo-textarea" rows="2" placeholder="可填入内部沟通信息、后续跟进建议等"></textarea>
                        </div>
                    </form>
                </div>

                <!-- 右侧操作区域 -->
                <div class="wo-right">
                    <!-- 草稿操作 -->
                    <div class="wo-draft-card">
                        <div class="wo-draft-card-header">
                            草稿操作
                        </div>
                        <div class="wo-draft-btn-group">
                            <button type="button" id="saveDraftBtn" class="wo-btn wo-btn-primary">
                                <span class="icon"></span>
                                <span>保存为草稿</span>
                            </button>
                            <button type="button" id="loadDraftBtn" class="wo-btn wo-btn-warn">
                                <span class="icon"></span>
                                <span>恢复草稿</span>
                            </button>
                            <button type="button" id="clearFormBtn" class="wo-btn wo-btn-outline">
                                <span class="icon"></span>
                                <span>清空表单</span>
                            </button>
                        </div>
                        <div id="draftStatus" class="wo-draft-status"></div>
                    </div>

                    <!-- 自动保存设置 -->
                    <div class="wo-auto-card">
                        <div class="wo-auto-row">
                            <div class="wo-auto-label">
                                自动保存为草稿
                                <small>避免浏览器/页面异常导致内容丢失</small>
                        </div>
                            <input type="checkbox" id="autoSaveToggle" class="wo-auto-toggle" checked>
                        </div>
                        <div class="wo-auto-row">
                            <span class="wo-auto-desc">保存间隔</span>
                            <select id="autoSaveInterval" class="wo-select" style="max-width: 150px;">
                                <option value="10">每 10 秒</option>
                                <option value="30" selected>每 30 秒</option>
                                <option value="60">每 1 分钟</option>
                                <option value="120">每 2 分钟</option>
                                <option value="300">每 5 分钟</option>
                            </select>
                        </div>
                        </div>

                    <!-- 结果区域 -->
                    <div id="workOrderResult" class="wo-result-card wo-scroll">
                        <div class="wo-result-title">创建结果</div>
                        <div id="resultTips" class="wo-result-tips"></div>
                        <div id="resultContent" class="wo-result-content"></div>
                    </div>

                    <!-- 提交按钮 -->
                    <div class="wo-footer">
                        <button type="button" id="submitWorkOrderBtn" class="wo-submit-btn">提交工单</button>
                        <button type="button" id="cancelBtn" class="wo-cancel-btn">取消并关闭</button>
                    </div>
                </div>
            </div>
        `;

    // 添加到页面
    document.body.appendChild(modal);

    // 添加调整大小的边框元素
    const resizeHandles = [
      { class: "wo-resize-handle-n", dir: "n" },
      { class: "wo-resize-handle-s", dir: "s" },
      { class: "wo-resize-handle-e", dir: "e" },
      { class: "wo-resize-handle-w", dir: "w" },
      { class: "wo-resize-handle-ne", dir: "ne" },
      { class: "wo-resize-handle-nw", dir: "nw" },
      { class: "wo-resize-handle-se", dir: "se" },
      { class: "wo-resize-handle-sw", dir: "sw" },
    ];

    resizeHandles.forEach((handle) => {
      const handleEl = document.createElement("div");
      handleEl.className = `wo-resize-handle ${handle.class}`;
      handleEl.dataset.direction = handle.dir;
      modal.appendChild(handleEl);
    });

    // 实现拖拽调整大小功能
    let isResizing = false;
    let resizeDirection = "";
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let startLeft = 0;
    let startTop = 0;
    let startRight = 0;
    let startBottom = 0;

    resizeHandles.forEach((handle) => {
      const handleEl = modal.querySelector(`.${handle.class}`);
      if (handleEl) {
        handleEl.addEventListener("mousedown", function (e) {
          // 如果正在拖动，不触发调整大小
          if (isDragging) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          isResizing = true;
          resizeDirection = handle.dir;

          const rect = modal.getBoundingClientRect();
          startX = e.clientX;
          startY = e.clientY;
          startWidth = rect.width;
          startHeight = rect.height;
          startLeft = rect.left;
          startTop = rect.top;
          startRight = rect.right;
          startBottom = rect.bottom;

          // 移除transform，改用固定定位
          modal.style.transform = "none";
          modal.style.left = startLeft + "px";
          modal.style.top = startTop + "px";

          document.addEventListener("mousemove", handleResize);
          document.addEventListener("mouseup", stopResize);
        });
      }
    });

    function handleResize(e) {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      // 根据方向调整大小和位置
      if (resizeDirection.includes("e")) {
        // 调整右边，保持左边不变
        newWidth = Math.max(600, startWidth + deltaX);
        newLeft = startLeft;
      }
      if (resizeDirection.includes("w")) {
        // 调整左边，保持右边不变
        newWidth = Math.max(600, startWidth - deltaX);
        newLeft = startRight - newWidth;
      }
      if (resizeDirection.includes("s")) {
        // 调整下边，保持上边不变
        newHeight = Math.max(400, startHeight + deltaY);
        newTop = startTop;
      }
      if (resizeDirection.includes("n")) {
        // 调整上边，保持下边不变
        newHeight = Math.max(400, startHeight - deltaY);
        newTop = startBottom - newHeight;
      }

      // 限制最大尺寸
      newWidth = Math.min(newWidth, window.innerWidth * 0.96);
      newHeight = Math.min(newHeight, window.innerHeight * 0.9);

      // 确保不超出屏幕边界
      if (newLeft < 0) {
        newWidth = newWidth + newLeft;
        newLeft = 0;
      }
      if (newTop < 0) {
        newHeight = newHeight + newTop;
        newTop = 0;
      }
      if (newLeft + newWidth > window.innerWidth) {
        newWidth = window.innerWidth - newLeft;
      }
      if (newTop + newHeight > window.innerHeight) {
        newHeight = window.innerHeight - newTop;
      }

      // 再次确保最小尺寸
      newWidth = Math.max(600, newWidth);
      newHeight = Math.max(400, newHeight);

      // 应用新尺寸和位置
      modal.style.width = newWidth + "px";
      modal.style.height = newHeight + "px";
      modal.style.left = newLeft + "px";
      modal.style.top = newTop + "px";
    }

    function stopResize() {
      if (isResizing) {
        isResizing = false;
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", stopResize);

        // 保存当前尺寸到localStorage
        if (window.saveWorkOrderModalSize) {
          window.saveWorkOrderModalSize();
        }
      }
    }

    // 保存弹窗尺寸到localStorage
    function saveModalSize() {
      const modal = document.getElementById("workOrderModal");
      if (!modal) return;

      const rect = modal.getBoundingClientRect();
      const sizeData = {
        width: rect.width,
        height: rect.height,
        left: modal.style.left || "",
        top: modal.style.top || "",
        transform: modal.style.transform || "",
        isMaximized: modal.classList.contains("wo-maximized") || false,
      };

      try {
        localStorage.setItem("workOrderModalSize", JSON.stringify(sizeData));
      } catch (e) {
        console.warn("无法保存弹窗尺寸:", e);
      }
    }

    // 从localStorage加载弹窗尺寸
    function loadModalSize() {
      const modal = document.getElementById("workOrderModal");
      if (!modal) return;

      try {
        const saved = localStorage.getItem("workOrderModalSize");
        if (saved) {
          const sizeData = JSON.parse(saved);

          // 如果是最大化状态，应用最大化样式
          if (sizeData.isMaximized) {
            modal.classList.add("wo-maximized");
            modal.style.width = "96vw";
            modal.style.height = "90vh";
            modal.style.left = "50%";
            modal.style.top = "50%";
            modal.style.transform = "translate(-50%, -50%)";
            const toggleMaximizeIcon =
              document.getElementById("toggleMaximizeIcon");
            if (toggleMaximizeIcon) {
              toggleMaximizeIcon.textContent = "⛶";
            }
          } else {
            // 应用保存的尺寸（非最大化状态）
            if (sizeData.width) {
              modal.style.width = sizeData.width + "px";
            }
            if (sizeData.height) {
              modal.style.height = sizeData.height + "px";
            }
            if (sizeData.left) {
              modal.style.left = sizeData.left;
            }
            if (sizeData.top) {
              modal.style.top = sizeData.top;
            }
            if (sizeData.transform) {
              modal.style.transform = sizeData.transform;
            }
          }
        }
      } catch (e) {
        console.warn("无法加载弹窗尺寸:", e);
      }
    }

    // 将saveModalSize和loadModalSize暴露到window对象，供其他函数调用
    window.saveWorkOrderModalSize = saveModalSize;
    window.loadWorkOrderModalSize = loadModalSize;

    // 实现拖动功能（通过header拖动）
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartLeft = 0;
    let dragStartTop = 0;

    const header = modal.querySelector(".wo-header");
    if (header) {
      header.addEventListener("mousedown", function (e) {
        // 如果点击的是关闭按钮，不触发拖动
        if (e.target.closest(".wo-close-btn")) {
          return;
        }
        // 如果正在调整大小，不触发拖动
        if (isResizing) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;

        const rect = modal.getBoundingClientRect();
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartLeft = rect.left;
        dragStartTop = rect.top;

        // 移除transform，改用固定定位
        modal.style.transform = "none";
        modal.style.left = dragStartLeft + "px";
        modal.style.top = dragStartTop + "px";

        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", stopDrag);
      });
    }

    function handleDrag(e) {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;

      let newLeft = dragStartLeft + deltaX;
      let newTop = dragStartTop + deltaY;

      const rect = modal.getBoundingClientRect();
      const modalWidth = rect.width;
      const modalHeight = rect.height;

      // 允许超出屏幕边界，但至少保留一部分可见（最小可见区域80px）
      const minVisibleArea = 80;

      // 限制左边界：允许超出，但至少保留minVisibleArea可见
      newLeft = Math.max(
        -(modalWidth - minVisibleArea),
        Math.min(newLeft, window.innerWidth - minVisibleArea)
      );

      // 限制右边界：如果超出右边界，确保至少保留minVisibleArea可见
      if (newLeft + modalWidth < minVisibleArea) {
        newLeft = minVisibleArea - modalWidth;
      }

      // 限制上边界：允许超出，但至少保留minVisibleArea可见
      newTop = Math.max(
        -(modalHeight - minVisibleArea),
        Math.min(newTop, window.innerHeight - minVisibleArea)
      );

      // 限制下边界：如果超出下边界，确保至少保留minVisibleArea可见
      if (newTop + modalHeight < minVisibleArea) {
        newTop = minVisibleArea - modalHeight;
      }

      // 应用新位置
      modal.style.left = newLeft + "px";
      modal.style.top = newTop + "px";
    }

    function stopDrag() {
      if (isDragging) {
        isDragging = false;
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", stopDrag);

        // 保存当前尺寸到localStorage
        if (window.saveWorkOrderModalSize) {
          window.saveWorkOrderModalSize();
        }
      }
    }

    // 创建遮罩层
    const overlay = document.createElement("div");
    overlay.id = "workOrderOverlay";
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.1);
            z-index: 9999;
            pointer-events: none;
        `;
    document.body.appendChild(overlay);

    // 加载保存的弹窗尺寸
    loadModalSize();

    // 绑定事件
    bindWorkOrderEvents();

    // 加载草稿数据（如果有）
    checkAndLoadDraft();

    // 加载自动保存设置
    loadAutoSaveSettings();

    // 启动自动保存
    startAutoSave();

    // 检查提交按钮状态
    checkSubmitButtonState();

    // 绑定问题原因多选组件
    bindIssueReasonMultiselect();

    // 拉取远端下拉选项
    fetchRemoteSelectOptions();
  }

  /**
   * 更新附件预览显示（支持多个文件）
   */
  function updateAttachmentPreview() {
    const previewContainer = document.getElementById("attachment_preview_text");
    const removeAllBtn = document.getElementById("removeAllAttachmentsBtn");
    const attachmentInput = document.getElementById("attachment");

    if (!previewContainer || !attachmentInput) return;

    const files = attachmentInput.files;

    if (files && files.length > 0) {
      // 清空容器
      previewContainer.innerHTML = "";

      // 创建图片网格容器
      const imageGrid = document.createElement("div");
      imageGrid.className = "wo-attachment-preview-grid";

      Array.from(files).forEach((file, index) => {
        const previewItem = document.createElement("div");
        previewItem.className = "wo-attachment-preview-item";

        // 创建图片元素
        const img = document.createElement("img");
        img.alt = file.name;

        // 保存图片的 data URL，用于放大显示
        let imageDataUrl = null;

        // 如果是图片文件，显示预览
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = function (e) {
            imageDataUrl = e.target.result;
            img.src = imageDataUrl;
            // 图片加载完成后，添加点击放大功能
            img.style.cursor = "pointer";
            img.addEventListener("click", function (e) {
              e.stopPropagation();
              showImageModal(imageDataUrl, file.name);
            });
          };
          reader.readAsDataURL(file);
        } else {
          // 如果不是图片，显示文件图标或占位符
          img.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3E文件%3C/text%3E%3C/svg%3E";
          img.style.objectFit = "contain";
          // 非图片文件也可以点击查看（显示占位符大图）
          img.style.cursor = "pointer";
          img.addEventListener("click", function (e) {
            e.stopPropagation();
            showImageModal(img.src, file.name);
          });
        }

        // 创建图片包装器
        const imageWrapper = document.createElement("div");
        imageWrapper.className = "wo-attachment-image-wrapper";

        // 创建删除按钮
        const removeBtn = document.createElement("button");
        removeBtn.className = "wo-attachment-item-remove";
        removeBtn.textContent = "×";
        removeBtn.type = "button";
        removeBtn.onclick = function (e) {
          e.stopPropagation();
          removeAttachmentByIndex(index);
        };

        imageWrapper.appendChild(img);
        imageWrapper.appendChild(removeBtn);

        // 获取当前文件名（从文件对象或已更新的文件名）
        const currentFileName = file.name;

        // 创建文件名显示文本（默认显示）
        const fileNameDisplay = document.createElement("div");
        fileNameDisplay.className = "wo-attachment-item-name";
        fileNameDisplay.textContent = currentFileName;
        fileNameDisplay.title = "点击编辑文件名";

        // 创建文件名输入框（默认隐藏）
        const fileNameInput = document.createElement("input");
        fileNameInput.type = "text";
        fileNameInput.className = "wo-attachment-item-name-input";
        fileNameInput.value = currentFileName;

        // 点击文件名文本时，切换到编辑模式
        fileNameDisplay.addEventListener("click", function (e) {
          e.stopPropagation();
          fileNameDisplay.classList.add("editing");
          fileNameInput.classList.add("editing");
          fileNameInput.focus();
          fileNameInput.select();
        });

        // 阻止文件名输入框的点击事件冒泡
        fileNameInput.addEventListener("click", function (e) {
          e.stopPropagation();
        });

        // 文件名修改事件
        fileNameInput.addEventListener("blur", function () {
          const newName = fileNameInput.value.trim();
          const originalName = file.name;
          if (newName && newName !== originalName) {
            updateFileNameByIndex(index, newName);
            // 更新显示文本
            fileNameDisplay.textContent = newName;
          } else if (!newName) {
            fileNameInput.value = originalName; // 如果为空，恢复原名
          }
          // 退出编辑模式
          fileNameDisplay.classList.remove("editing");
          fileNameInput.classList.remove("editing");
        });

        fileNameInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            fileNameInput.blur();
          } else if (e.key === "Escape") {
            fileNameInput.value = file.name;
            fileNameInput.blur();
          }
        });

        previewItem.appendChild(imageWrapper);
        previewItem.appendChild(fileNameDisplay);
        previewItem.appendChild(fileNameInput);
        imageGrid.appendChild(previewItem);
      });

      previewContainer.appendChild(imageGrid);

      if (removeAllBtn) {
        removeAllBtn.style.display = "inline-block";
      }
    } else {
      previewContainer.textContent = "未选择文件";
      if (removeAllBtn) {
        removeAllBtn.style.display = "none";
      }
    }
  }

  /**
   * 根据索引删除附件
   */
  function removeAttachmentByIndex(index) {
    const attachmentInput = document.getElementById("attachment");
    if (!attachmentInput || !attachmentInput.files) return;

    const dataTransfer = new DataTransfer();
    const files = Array.from(attachmentInput.files);

    files.forEach((file, i) => {
      if (i !== index) {
        dataTransfer.items.add(file);
      }
    });

    attachmentInput.files = dataTransfer.files;
    updateAttachmentPreview();
  }

  /**
   * 根据索引更新文件名
   */
  function updateFileNameByIndex(index, newName) {
    const attachmentInput = document.getElementById("attachment");
    if (!attachmentInput || !attachmentInput.files) return;

    const files = Array.from(attachmentInput.files);
    if (index < 0 || index >= files.length) return;

    const oldFile = files[index];

    // 创建新文件（保持原文件的类型和内容，只修改名称）
    const newFile = new File([oldFile], newName, {
      type: oldFile.type,
      lastModified: oldFile.lastModified,
    });

    // 使用 DataTransfer 更新文件列表
    const dataTransfer = new DataTransfer();
    files.forEach((file, i) => {
      if (i === index) {
        dataTransfer.items.add(newFile);
      } else {
        dataTransfer.items.add(file);
      }
    });

    attachmentInput.files = dataTransfer.files;
    updateAttachmentPreview();
  }

  /**
   * 显示图片放大模态框
   */
  function showImageModal(imageSrc, imageName) {
    // 检查是否已存在模态框
    let modal = document.getElementById("woImageModal");
    if (!modal) {
      // 创建模态框
      modal = document.createElement("div");
      modal.id = "woImageModal";
      modal.className = "wo-image-modal";

      const modalContent = document.createElement("div");
      modalContent.className = "wo-image-modal-content";

      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = imageName;

      const closeBtn = document.createElement("span");
      closeBtn.className = "wo-image-modal-close";
      closeBtn.innerHTML = "×";
      closeBtn.onclick = function () {
        closeImageModal();
      };

      modalContent.appendChild(img);
      modalContent.appendChild(closeBtn);
      modal.appendChild(modalContent);

      // 点击背景关闭
      modal.onclick = function (e) {
        if (e.target === modal) {
          closeImageModal();
        }
      };

      // ESC键关闭
      document.addEventListener("keydown", function escHandler(e) {
        if (e.key === "Escape") {
          closeImageModal();
          document.removeEventListener("keydown", escHandler);
        }
      });

      document.body.appendChild(modal);
    }

    // 更新图片
    const img = modal.querySelector("img");
    if (img) {
      img.src = imageSrc;
      img.alt = imageName;
    }

    // 显示模态框
    modal.classList.add("show");
  }

  /**
   * 关闭图片放大模态框
   */
  function closeImageModal() {
    const modal = document.getElementById("woImageModal");
    if (modal) {
      modal.classList.remove("show");
    }
  }

  /**
   * 绑定工单表单事件
   */
  function bindWorkOrderEvents() {
    // 放大/缩小按钮
    const toggleMaximizeBtn = document.getElementById("toggleMaximizeBtn");
    const toggleMaximizeIcon = document.getElementById("toggleMaximizeIcon");
    const modal = document.getElementById("workOrderModal");

    // 检查当前是否处于最大化状态
    let isMaximized = modal.classList.contains("wo-maximized");

    // 保存原始尺寸的变量
    let originalSize = {
      width: "",
      height: "",
      left: "",
      top: "",
      transform: "",
    };

    // 如果已经最大化，更新图标
    if (isMaximized && toggleMaximizeIcon) {
      toggleMaximizeIcon.textContent = "⛶";
    }

    toggleMaximizeBtn.onclick = function (e) {
      e.stopPropagation();

      // 获取当前实际尺寸（使用getBoundingClientRect获取真实尺寸）
      const rect = modal.getBoundingClientRect();
      const currentWidth = rect.width;
      const currentHeight = rect.height;

      if (!isMaximized) {
        // 保存当前尺寸和位置（使用实际计算的尺寸）
        originalSize.width = currentWidth + "px";
        originalSize.height = currentHeight + "px";
        originalSize.left = modal.style.left || "";
        originalSize.top = modal.style.top || "";
        originalSize.transform = modal.style.transform || "";

        // 放大到全屏（留一些边距）
        modal.style.width = "96vw";
        modal.style.height = "90vh";
        modal.style.left = "50%";
        modal.style.top = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.maxWidth = "96vw";
        modal.style.maxHeight = "90vh";
        modal.classList.add("wo-maximized");

        // 更新图标为缩小图标（两个重叠的方框表示还原）
        toggleMaximizeIcon.textContent = "⛶";
        isMaximized = true;

        // 保存状态
        if (window.saveWorkOrderModalSize) {
          window.saveWorkOrderModalSize();
        }
      } else {
        // 恢复到原始尺寸
        // 如果originalSize为空，尝试从localStorage加载
        if (!originalSize.width) {
          try {
            const saved = localStorage.getItem("workOrderModalSize");
            if (saved) {
              const sizeData = JSON.parse(saved);
              if (!sizeData.isMaximized) {
                originalSize.width = sizeData.width
                  ? sizeData.width + "px"
                  : "920px";
                originalSize.height = sizeData.height
                  ? sizeData.height + "px"
                  : "";
                originalSize.left = sizeData.left || "";
                originalSize.top = sizeData.top || "";
                originalSize.transform =
                  sizeData.transform || "translate(-50%, -50%)";
              }
            }
          } catch (e) {
            console.warn("无法加载保存的尺寸:", e);
          }
        }

        // 应用恢复的尺寸
        modal.style.width = originalSize.width || "920px";
        modal.style.height = originalSize.height || "";
        modal.style.left = originalSize.left || "";
        modal.style.top = originalSize.top || "";
        modal.style.transform =
          originalSize.transform || "translate(-50%, -50%)";
        modal.style.maxWidth = "96vw";
        modal.style.maxHeight = "90vh";
        modal.classList.remove("wo-maximized");

        // 更新图标为放大图标（单个方框表示最大化）
        toggleMaximizeIcon.textContent = "⛶";
        isMaximized = false;

        // 保存状态
        if (window.saveWorkOrderModalSize) {
          window.saveWorkOrderModalSize();
        }
      }
    };

    // 关闭按钮
    document.getElementById("closeWorkOrderModal").onclick = closeWorkOrderPage;

    // 取消按钮
    document.getElementById("cancelBtn").onclick = closeWorkOrderPage;

    // 附件相关元素
    const attachmentInput = document.getElementById("attachment");
    const attachmentArea = document.getElementById("attachment_area");
    const attachmentPreview = document.getElementById("attachment_preview");

    // 处理文件选择（支持添加多个文件）
    function handleFileSelect(newFiles) {
      if (!newFiles || newFiles.length === 0) return;

      // 获取现有文件
      const existingFiles = attachmentInput.files
        ? Array.from(attachmentInput.files)
        : [];
      const newFilesArray = Array.from(newFiles);

      // 合并文件（避免重复）
      const allFiles = [...existingFiles];
      newFilesArray.forEach((newFile) => {
        // 检查是否已存在同名文件（只判断文件名）
        const isDuplicate = existingFiles.some(
          (existing) => existing.name === newFile.name
        );
        if (!isDuplicate) {
          allFiles.push(newFile);
        }
      });

      // 创建 DataTransfer 对象来设置文件到 input
      const dataTransfer = new DataTransfer();
      allFiles.forEach((file) => {
        dataTransfer.items.add(file);
      });
      attachmentInput.files = dataTransfer.files;

      updateAttachmentPreview();
    }

    // 附件输入框变化事件
    attachmentInput.onchange = function (e) {
      if (e.target.files && e.target.files.length > 0) {
        updateAttachmentPreview();
      } else {
        updateAttachmentPreview();
      }
    };

    // 点击附件区域触发文件选择
    attachmentArea.onclick = function (e) {
      // 如果点击的是区域本身而不是子元素，触发文件选择
      if (
        e.target === attachmentArea ||
        e.target.closest(".wo-attachment-area-content")
      ) {
        attachmentInput.click();
      }
    };

    // 拖拽上传功能
    attachmentArea.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.stopPropagation();
      attachmentArea.classList.add("drag-over");
    });

    attachmentArea.addEventListener("dragleave", function (e) {
      e.preventDefault();
      e.stopPropagation();
      // 只有当离开整个区域时才移除样式
      if (!attachmentArea.contains(e.relatedTarget)) {
        attachmentArea.classList.remove("drag-over");
      }
    });

    attachmentArea.addEventListener("drop", function (e) {
      e.preventDefault();
      e.stopPropagation();
      attachmentArea.classList.remove("drag-over");

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files);
      }
    });

    // 粘贴上传功能（支持 Ctrl+V 或 Cmd+V）
    document.addEventListener("paste", function (e) {
      // 检查是否在弹窗内
      const modal = document.getElementById("workOrderModal");
      if (!modal || !modal.contains(e.target)) {
        return;
      }

      const items = e.clipboardData.items;
      if (!items) return;

      // 查找文件类型的项（支持多个文件）
      const pastedFiles = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file") {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            pastedFiles.push(file);
          }
        }
      }
      if (pastedFiles.length > 0) {
        handleFileSelect(pastedFiles);
        // 显示提示
        const fileNames = pastedFiles.map((f) => f.name).join(", ");
        showResultTips("已通过粘贴添加文件: " + fileNames);
      }
    });

    // 保存草稿按钮
    document.getElementById("saveDraftBtn").onclick = saveAsDraft;

    // 恢复草稿按钮
    document.getElementById("loadDraftBtn").onclick = loadDraft;

    // 清空表单按钮
    document.getElementById("clearFormBtn").onclick = clearForm;

    // 捕获当前页面信息按钮
    const capturePageInfoBtn = document.getElementById("capturePageInfoBtn");
    capturePageInfoBtn.onclick = function (e) {
      e.stopPropagation(); // 阻止事件冒泡，确保只有 button 有点击事件
      captureCurrentPageInfo();
    };

    // 获取订单信息按钮
    const getOrderInfoBtn = document.getElementById("getOrderInfoBtn");
    getOrderInfoBtn.onclick = function (e) {
      e.stopPropagation(); // 阻止事件冒泡，确保只有 button 有点击事件
      getOrderSkusByOrderId();
    };

    // 确保 label 只有 button 区域可点击
    const orderLabel = getOrderInfoBtn.closest(".wo-label");
    if (orderLabel) {
      orderLabel.onclick = function (e) {
        // 如果点击的不是 button，阻止事件
        if (
          e.target !== getOrderInfoBtn &&
          !getOrderInfoBtn.contains(e.target) &&
          e.target !== capturePageInfoBtn &&
          !capturePageInfoBtn.contains(e.target)
        ) {
          e.stopPropagation();
          e.preventDefault();
        }
      };
    }

    // 清空所有附件按钮
    document.getElementById("removeAllAttachmentsBtn").onclick = function (e) {
      e.stopPropagation(); // 阻止事件冒泡
      removeAttachment();
    };

    // 提交工单按钮
    document.getElementById("submitWorkOrderBtn").onclick = submitWorkOrder;

    // 自动保存开关
    document.getElementById("autoSaveToggle").onchange = function () {
      if (this.checked) {
        startAutoSave();
      } else {
        stopAutoSave();
      }
      saveAutoSaveSettings();
    };

    // 自动保存间隔
    document.getElementById("autoSaveInterval").onchange = function () {
      saveAutoSaveSettings();
      restartAutoSave();
    };

    // 阻止弹窗内点击关闭弹窗
    document.getElementById("workOrderModal").onclick = function (e) {
      e.stopPropagation();
    };

    // 监听表单变化，用于自动保存
    const formInputs = [
      "title",
      "order_id",
      "sku",
      "support_role",
      "work_order_type",
      "issue_detail",
      "issue_description",
      "extra_cost",
      "remark",
    ];

    formInputs.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("input", () => {
          // 标记有更改需要保存
          if (autoSaveTimer) {
            const modal = document.getElementById("workOrderModal");
            if (modal) {
              modal.dataset.hasChanges = "true";
            }
          }
          // 如果标题或订单号变化，检查按钮状态
          if (id === "title" || id === "order_id") {
            checkSubmitButtonState();
          }
          // 如果订单号有值，自动将工单类型改为"售后"
          if (id === "order_id") {
            const orderIdValue = element.value.trim();
            const workOrderTypeEl = document.getElementById("work_order_type");
            if (workOrderTypeEl && orderIdValue) {
              // 检查是否存在"售后"选项
              const afterSaleOption = Array.from(workOrderTypeEl.options).find(
                (opt) => opt.value === "售后"
              );
              if (afterSaleOption) {
                workOrderTypeEl.value = "售后";
              }
            } else if (workOrderTypeEl && !orderIdValue) {
              // 如果订单号被清空，恢复默认值"售前"
              const presaleOption = Array.from(workOrderTypeEl.options).find(
                (opt) => opt.value === "售前"
              );
              if (presaleOption) {
                workOrderTypeEl.value = "售前";
              }
            }
          }
        });
      }
    });
  }

  /**
   * 关闭工单页面
   */
  function closeWorkOrderPage() {
    const modal = document.getElementById("workOrderModal");
    const overlay = document.getElementById("workOrderOverlay");

    if (modal) modal.remove();
    if (overlay) overlay.remove();

    // 停止自动保存计时器
    stopAutoSave();
  }

  /**
   * 检查并加载草稿数据
   */
  function checkAndLoadDraft() {
    try {
      const draftData = GM_getValue("workOrderDraft");
      if (draftData) {
        const data = JSON.parse(draftData);
        showDraftStatus(
          "💾 检测到未提交的草稿 (" + (data.savedAt || "未知时间") + ")",
          "warning"
        );
      }
    } catch (e) {
      console.error("检查草稿数据时出错:", e);
    }
  }

  /**
   * 显示草稿状态提示
   */
  function showDraftStatus(message, type = "info") {
    const colors = {
      success: "#4CAF50",
      info: "#2196F3",
      warning: "#FF9800",
    };

    const color = colors[type] || colors.info;
    const statusDiv = document.getElementById("draftStatus");

    if (statusDiv) {
      statusDiv.innerHTML = `<span style="color: ${color}; font-weight: ${
        type === "warning" ? "bold" : "normal"
      };">${message}</span>`;

      // 5秒后自动清除提示（除了警告类型的）
      if (type !== "warning") {
        setTimeout(() => {
          if (statusDiv.innerHTML.includes(message)) {
            statusDiv.innerHTML = "";
          }
        }, 5000);
      }
    }
  }

  /**
   * 拉取远端下拉选项并填充 select
   */
  function fetchRemoteSelectOptions() {
    console.log("[workOrder] 开始加载远端下拉选项");

    // 如果已经有缓存数据，直接使用缓存
    if (selectOptionsCache) {
      console.log("[workOrder] 使用缓存的下拉选项数据");
      applySelectOptionsCache(selectOptionsCache);
      return;
    }

    // 如果正在请求中，避免重复请求
    if (isFetchingOptions) {
      console.log("[workOrder] 下拉选项正在加载中，跳过重复请求");
      return;
    }

    if (!initAuthToken()) {
      console.error("[workOrder] 未找到存储的 token，请先在 CRM 登录");
      markSelectError("缺少登录凭证，请先登录 CRM");
      return;
    }

    if (!appContext.accessToken) {
      console.error("[workOrder] token 解析失败，无法获取 X-Access-Token");
      markSelectError("登录凭证无效，请重新登录 CRM");
      return;
    }

    // 标记正在请求
    isFetchingOptions = true;

    // 填充加载占位
    setSelectOptions("support_role", [{ value: "", label: "加载中..." }]);
    setSelectOptions("work_order_type", [{ value: "", label: "加载中..." }]);
    const dropdown = document.getElementById("issue_reason_dropdown");
    if (dropdown) {
      dropdown.innerHTML =
        '<div class="wo-multiselect-loading">加载中...</div>';
      // 默认折叠，不自动展开
    }
    issueReasonOptions = [];
    issueReasonSelected = [];

    const url =
      "https://crm-server.maxpeedingrods.cn/crm/tb/getTb?url=api/v3/project/656d3b2f80dc9e8e8a5eb2ac/customfield/search";
    console.log("[workOrder] 请求 URL:", url);
    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers: {
        "X-Access-Token": appContext.accessToken,
      },
      onload: function (resp) {
        // 请求完成，重置标志
        isFetchingOptions = false;

        console.log("[workOrder] 下拉请求完成，状态:", resp.status);
        try {
          const parsed = safeParse(resp.responseText);

          // 检查是否是频率限制错误
          if (parsed && parsed.code === "requestExceedLimit") {
            console.error("[workOrder] 请求过于频繁，请稍后再试");
            markSelectError("请求过于频繁，请一分钟后重试");
            return;
          }

          if (!parsed || parsed.code !== 200 || !parsed.result) {
            throw new Error("接口返回异常");
          }
          const list = safeParse(parsed.result);
          if (!Array.isArray(list)) {
            throw new Error("解析 result 失败");
          }

          const supportRole = list.find((item) => item.name === "需支持角色");
          const workOrderType = list.find((item) => item.name === "工单类型");
          const issueReason = list.find((item) => item.name === "问题原因");

          // 缓存数据
          selectOptionsCache = {
            supportRole:
              supportRole && Array.isArray(supportRole.choices)
                ? supportRole.choices.map((c) => ({
                    value: c.value,
                    label: c.value,
                  }))
                : [],
            workOrderType:
              workOrderType && Array.isArray(workOrderType.choices)
                ? workOrderType.choices.map((c) => ({
                    value: c.value,
                    label: c.value,
                  }))
                : [],
            issueReason:
              issueReason && Array.isArray(issueReason.choices)
                ? issueReason.choices.map((c) => ({
                    value: c.value,
                    label: c.value,
                  }))
                : [],
          };

          // 应用数据
          applySelectOptionsCache(selectOptionsCache);

          console.log("[workOrder] 下拉选项加载成功");
        } catch (e) {
          console.error("下拉选项解析失败:", e);
          markSelectError("下拉数据解析失败，请重试");
        }
      },
      onerror: function (err) {
        // 请求失败，重置标志
        isFetchingOptions = false;
        console.error("下拉选项请求失败:", err);
        markSelectError("请求下拉选项失败，请检查网络或稍后重试");
      },
      ontimeout: function () {
        // 请求超时，重置标志
        isFetchingOptions = false;
        console.error("下拉选项请求超时");
        markSelectError("请求超时，请稍后重试");
      },
    });
  }

  /**
   * 应用缓存的下拉选项数据
   */
  function applySelectOptionsCache(cache) {
    if (cache.supportRole && cache.supportRole.length > 0) {
      setSelectOptions(
        "support_role",
        cache.supportRole,
        "请选择需协同的团队/角色..."
      );
      // 设置默认值为"产品"
      const supportRoleEl = document.getElementById("support_role");
      if (supportRoleEl) {
        const productOption = Array.from(supportRoleEl.options).find(
          (opt) => opt.value === "产品"
        );
        if (productOption) {
          supportRoleEl.value = "产品";
        }
      }
    }

    if (cache.workOrderType && cache.workOrderType.length > 0) {
      setSelectOptions(
        "work_order_type",
        cache.workOrderType,
        "请选择工单类型..."
      );
      // 设置默认值为"售前"
      const workOrderTypeEl = document.getElementById("work_order_type");
      if (workOrderTypeEl) {
        const presaleOption = Array.from(workOrderTypeEl.options).find(
          (opt) => opt.value === "售前"
        );
        if (presaleOption) {
          workOrderTypeEl.value = "售前";
        }
      }
    }

    // 清空问题原因已选中的值，避免自动恢复上次的选择（只有在点击恢复草稿时才恢复）
    issueReasonSelected = [];

    if (cache.issueReason && cache.issueReason.length > 0) {
      setIssueReasonOptions(cache.issueReason);
    } else {
      setIssueReasonOptions([]);
    }
  }

  /**
   * 安全 JSON 解析
   */
  function safeParse(str) {
    if (str && typeof str === "object") return str;
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  /**
   * 绑定问题原因多选组件
   */
  function bindIssueReasonMultiselect() {
    const searchInput = document.getElementById("issue_reason_search");
    const dropdown = document.getElementById("issue_reason_dropdown");
    const selectedDiv = document.getElementById("issue_reason_selected");

    if (!searchInput || !dropdown || !selectedDiv) return;

    // 搜索输入框输入事件
    searchInput.addEventListener("input", (e) => {
      const keyword = e.target.value.trim().toLowerCase();
      renderIssueReasonOptions(keyword);
      // 输入关键词时展开下拉
      if (issueReasonOptions.length > 0) {
        dropdown.classList.add("show");
      }
    });

    // 点击搜索框切换展开/折叠
    searchInput.addEventListener("click", (e) => {
      e.stopPropagation();
      if (issueReasonOptions.length > 0) {
        // 切换展开/折叠状态
        if (dropdown.classList.contains("show")) {
          dropdown.classList.remove("show");
        } else {
          dropdown.classList.add("show");
        }
      }
    });

    // 点击下拉框内部时保持展开（阻止事件冒泡）
    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // 点击外部（含弹窗其他区域）关闭下拉，使用捕获阶段避免被 stopPropagation 阻断
    const wrapper = searchInput.closest(".wo-multiselect-wrapper");
    document.addEventListener(
      "click",
      (e) => {
        if (!wrapper || !wrapper.contains(e.target)) {
          dropdown.classList.remove("show");
        }
      },
      true
    );

    // 更新已选中的显示
    updateIssueReasonSelected();
  }

  /**
   * 设置问题原因选项并渲染
   */
  function setIssueReasonOptions(options) {
    issueReasonOptions = options || [];
    renderIssueReasonOptions("");
    updateIssueReasonSelected();
  }

  /**
   * 根据关键词渲染问题原因下拉（checkbox列表）
   */
  function renderIssueReasonOptions(keyword = "") {
    const dropdown = document.getElementById("issue_reason_dropdown");
    if (!dropdown) return;

    const kw = (keyword || "").toLowerCase();
    const filtered = (issueReasonOptions || []).filter((opt) => {
      const text = (opt.label || opt.value || "").toLowerCase();
      return kw ? text.includes(kw) : true;
    });

    dropdown.innerHTML = "";

    if (filtered.length === 0) {
      dropdown.innerHTML =
        '<div class="wo-multiselect-loading">无匹配结果</div>';
      return;
    }

    filtered.forEach((opt) => {
      const item = document.createElement("div");
      item.className = "wo-multiselect-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `issue_reason_${opt.value}`;
      checkbox.value = opt.value;
      checkbox.checked = issueReasonSelected.includes(opt.value);
      checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          if (!issueReasonSelected.includes(opt.value)) {
            issueReasonSelected.push(opt.value);
          }
        } else {
          issueReasonSelected = issueReasonSelected.filter(
            (v) => v !== opt.value
          );
        }
        updateIssueReasonSelected();
        // 标记有更改需要保存
        const modal = document.getElementById("workOrderModal");
        if (modal && autoSaveTimer) {
          modal.dataset.hasChanges = "true";
        }
      });

      const label = document.createElement("label");
      label.htmlFor = `issue_reason_${opt.value}`;
      label.textContent = opt.label || opt.value;

      item.appendChild(checkbox);
      item.appendChild(label);
      dropdown.appendChild(item);
    });
  }

  /**
   * 更新已选中项的显示
   */
  function updateIssueReasonSelected() {
    const selectedDiv = document.getElementById("issue_reason_selected");
    if (!selectedDiv) return;

    selectedDiv.innerHTML = "";

    issueReasonSelected.forEach((value) => {
      const opt = issueReasonOptions.find((o) => o.value === value);
      if (!opt) return;

      const tag = document.createElement("div");
      tag.className = "wo-multiselect-tag";
      tag.onclick = (e) => {
        e.stopPropagation(); // 阻止事件冒泡，防止触发折叠
      };

      const text = document.createElement("span");
      text.textContent = opt.label || opt.value;

      const remove = document.createElement("span");
      remove.className = "wo-multiselect-tag-remove";
      remove.textContent = "×";
      remove.onclick = (e) => {
        e.stopPropagation(); // 阻止事件冒泡，防止触发折叠
        issueReasonSelected = issueReasonSelected.filter((v) => v !== value);
        updateIssueReasonSelected();
        renderIssueReasonOptions(
          document.getElementById("issue_reason_search")?.value || ""
        );
        // 标记有更改需要保存
        const modal = document.getElementById("workOrderModal");
        if (modal && autoSaveTimer) {
          modal.dataset.hasChanges = "true";
        }
      };

      tag.appendChild(text);
      tag.appendChild(remove);
      selectedDiv.appendChild(tag);
    });
  }

  /**
   * 设置 select 选项
   */
  function setSelectOptions(selectId, options, placeholderText = "请选择...") {
    const el = document.getElementById(selectId);
    if (!el) return;

    el.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = placeholderText;
    el.appendChild(placeholder);

    (options || []).forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label || opt.value;
      el.appendChild(option);
    });
  }

  /**
   * 下拉加载失败提示（不再使用静态选项）
   */
  function markSelectError(msg) {
    issueReasonOptions = [];
    issueReasonSelected = [];
    ["support_role", "work_order_type"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = "";
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = msg || "下拉加载失败，请重试";
        el.appendChild(opt);
      }
    });
    // 更新问题原因多选组件
    const dropdown = document.getElementById("issue_reason_dropdown");
    if (dropdown) {
      dropdown.innerHTML = `<div class="wo-multiselect-loading">${
        msg || "下拉加载失败，请重试"
      }</div>`;
      // 默认折叠，不自动展开
    }
    updateIssueReasonSelected();
    showResultTips(msg || "下拉选项加载失败");
  }

  /**
   * 保存当前表单为草稿
   */
  async function saveAsDraft() {
    try {
      // 获取当前表单数据（包含附件）
      const draftData = await getFormData();

      if (draftData.title || draftData.orderId || draftData.issueDescription) {
        // 保存草稿到GM存储
        const jsonData = JSON.stringify(draftData);
        GM_setValue("workOrderDraft", jsonData);

        // 显示保存成功的提示
        const attachmentCount = draftData.attachments
          ? draftData.attachments.length
          : 0;
        const attachmentInfo =
          attachmentCount > 0 ? `（包含 ${attachmentCount} 个附件）` : "";
        showDraftStatus(
          "✓ 草稿已保存于 " + draftData.savedAt + attachmentInfo,
          "success"
        );

        // 重置更改标记
        const modal = document.getElementById("workOrderModal");
        if (modal) {
          modal.dataset.hasChanges = "false";
        }
        showResultTips(
          "草稿保存成功！\n保存时间：" + draftData.savedAt + attachmentInfo
        );
      } else {
        showResultTips("请至少填写标题、订单号或问题描述中的一项才能保存草稿");
      }
    } catch (e) {
      console.error("保存草稿失败:", e);
      showResultTips("保存草稿失败：" + e.message);
    }
  }

  /**
   * 获取表单数据（包含附件）
   */
  async function getFormData() {
    const formData = {
      title: document.getElementById("title").value.trim(),
      orderId: document.getElementById("order_id").value.trim(),
      sku: document.getElementById("sku").value.trim(),
      supportRole: document.getElementById("support_role").value.trim(),
      workOrderType: document.getElementById("work_order_type").value.trim(),
      issueReason: issueReasonSelected, // 改为数组
      issueDetail: document.getElementById("issue_detail").value.trim(),
      issueDescription: document
        .getElementById("issue_description")
        .value.trim(),
      extraCost: document.getElementById("extra_cost").value.trim(),
      remark: document.getElementById("remark").value.trim(),
      savedAt: new Date().toLocaleString(),
    };

    // 保存附件信息（转换为 base64）
    const attachmentInput = document.getElementById("attachment");
    if (
      attachmentInput &&
      attachmentInput.files &&
      attachmentInput.files.length > 0
    ) {
      const files = Array.from(attachmentInput.files);
      // 使用 Promise.allSettled 而不是 Promise.all，避免单个文件失败导致全部失败
      const results = await Promise.allSettled(
        files.map(async (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            // 设置超时，避免文件读取一直卡住
            const timeoutId = setTimeout(() => {
              reader.abort();
              reject(new Error(`读取文件 ${file.name} 超时`));
            }, 30000); // 30秒超时

            reader.onload = function (e) {
              clearTimeout(timeoutId);
              resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified,
                data: e.target.result, // base64 字符串
              });
            };
            reader.onerror = function (e) {
              clearTimeout(timeoutId);
              reject(new Error(`读取文件 ${file.name} 失败`));
            };
            reader.readAsDataURL(file);
          });
        })
      );
      // 只保存成功读取的文件，失败的记录日志但不中断流程
      formData.attachments = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      // 记录失败的文件
      const failedFiles = results
        .filter((result) => result.status === "rejected")
        .map((result, index) => files[index].name);
      if (failedFiles.length > 0) {
        console.warn("部分文件读取失败:", failedFiles);
      }
    } else {
      formData.attachments = [];
    }

    return formData;
  }

  /**
   * 加载草稿数据
   */
  async function loadDraft() {
    try {
      const draftData = GM_getValue("workOrderDraft");

      if (draftData) {
        const data = JSON.parse(draftData);

        // 恢复表单数据
        document.getElementById("title").value = data.title || "";
        document.getElementById("order_id").value = data.orderId || "";
        document.getElementById("sku").value = data.sku || "";
        document.getElementById("support_role").value = data.supportRole || "";
        document.getElementById("work_order_type").value =
          data.workOrderType || "";
        // 恢复问题原因（支持数组和字符串兼容）
        if (Array.isArray(data.issueReason)) {
          issueReasonSelected = data.issueReason;
        } else if (typeof data.issueReason === "string" && data.issueReason) {
          issueReasonSelected = [data.issueReason];
        } else {
          issueReasonSelected = [];
        }
        updateIssueReasonSelected();
        renderIssueReasonOptions("");
        document.getElementById("issue_detail").value = data.issueDetail || "";
        document.getElementById("issue_description").value =
          data.issueDescription || "";
        document.getElementById("extra_cost").value = data.extraCost || "";
        document.getElementById("remark").value = data.remark || "";

        // 恢复附件（如果有）
        if (
          data.attachments &&
          Array.isArray(data.attachments) &&
          data.attachments.length > 0
        ) {
          const attachmentInput = document.getElementById("attachment");
          if (attachmentInput) {
            const dataTransfer = new DataTransfer();

            // 将 base64 字符串转换回 File 对象
            for (const attachment of data.attachments) {
              try {
                // 从 base64 字符串中提取数据部分
                const base64Data = attachment.data;
                let base64String = base64Data;
                let mimeString = attachment.type || "application/octet-stream";

                // 如果包含 data URL 前缀，提取 base64 部分和 MIME 类型
                if (base64Data.includes(",")) {
                  const parts = base64Data.split(",");
                  base64String = parts[1];
                  const header = parts[0];
                  if (header.includes(":")) {
                    const mimeMatch = header.match(/data:([^;]+)/);
                    if (mimeMatch) {
                      mimeString = mimeMatch[1];
                    }
                  }
                }

                // 将 base64 字符串转换为二进制数据
                const byteString = atob(base64String);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }

                // 创建 File 对象
                const file = new File([ab], attachment.name, {
                  type: mimeString,
                  lastModified: attachment.lastModified || Date.now(),
                });

                dataTransfer.items.add(file);
              } catch (e) {
                console.error(`恢复附件 ${attachment.name} 失败:`, e);
              }
            }

            attachmentInput.files = dataTransfer.files;
            updateAttachmentPreview();
          }
        }

        // 清除结果区域
        document.getElementById("resultTips").textContent = "";
        document.getElementById("resultContent").textContent = "";
        document.getElementById("workOrderResult").style.display = "none";

        // 显示加载成功的提示
        const attachmentCount = data.attachments ? data.attachments.length : 0;
        const attachmentInfo =
          attachmentCount > 0 ? `（包含 ${attachmentCount} 个附件）` : "";
        showDraftStatus("✓ 草稿已恢复" + attachmentInfo, "info");

        showResultTips(
          "草稿加载成功！\n保存时间：" +
            (data.savedAt || "未知时间") +
            attachmentInfo
        );

        // 恢复数据后检查按钮状态
        checkSubmitButtonState();
      } else {
        showResultTips("没有找到草稿数据，请先保存草稿");
      }
    } catch (e) {
      console.error("加载草稿失败:", e);
      showResultTips("加载草稿失败：" + e.message);
    }
  }

  /**
   * 删除附件
   */
  function removeAttachment() {
    const attachmentInput = document.getElementById("attachment");
    const attachmentPreview = document.getElementById("attachment_preview");

    if (attachmentInput) {
      // 清空文件输入
      attachmentInput.value = "";
      // 清空 files
      const dataTransfer = new DataTransfer();
      attachmentInput.files = dataTransfer.files;
    }

    // 更新预览显示
    updateAttachmentPreview();

    // 清除上传凭证
    appContext.uploadTokens = [];

    showResultTips("附件已删除");
  }

  /**
   * 清空表单
   */
  function clearForm() {
    // 确认对话框
    if (!confirm("确定要清空所有表单内容吗？此操作不可恢复。")) {
      return;
    }

    // 清空所有输入字段
    document.getElementById("title").value = "";
    document.getElementById("order_id").value = "";
    document.getElementById("sku").value = "";

    // 恢复默认值：需支持角色为"产品"，工单类型为"售前"
    const supportRoleEl = document.getElementById("support_role");
    if (supportRoleEl) {
      const productOption = Array.from(supportRoleEl.options).find(
        (opt) => opt.value === "产品"
      );
      if (productOption) {
        supportRoleEl.value = "产品";
      } else {
        supportRoleEl.value = "";
      }
    }

    const workOrderTypeEl = document.getElementById("work_order_type");
    if (workOrderTypeEl) {
      const presaleOption = Array.from(workOrderTypeEl.options).find(
        (opt) => opt.value === "售前"
      );
      if (presaleOption) {
        workOrderTypeEl.value = "售前";
      } else {
        workOrderTypeEl.value = "";
      }
    }

    document.getElementById("issue_detail").value = "";
    document.getElementById("issue_description").value = "";
    document.getElementById("extra_cost").value = "";
    document.getElementById("remark").value = "";

    // 清空问题原因多选
    issueReasonSelected = [];
    updateIssueReasonSelected();
    renderIssueReasonOptions("");
    const searchInput = document.getElementById("issue_reason_search");
    if (searchInput) {
      searchInput.value = "";
    }

    // 删除附件
    removeAttachment();

    // 清除结果区域
    document.getElementById("resultTips").textContent = "";
    document.getElementById("resultContent").textContent = "";
    document.getElementById("workOrderResult").style.display = "none";

    // 清除草稿状态提示
    const draftStatus = document.getElementById("draftStatus");
    if (draftStatus) {
      draftStatus.innerHTML = "";
    }

    // 恢复提交按钮状态
    checkSubmitButtonState();

    // 清除上传凭证
    appContext.uploadTokens = [];

    showResultTips("表单已清空");
  }

  /**
   * 加载自动保存设置
   */
  function loadAutoSaveSettings() {
    try {
      const settings = GM_getValue("autoSaveSettings");
      if (settings) {
        const data = JSON.parse(settings);
        document.getElementById("autoSaveToggle").checked =
          data.enabled !== false;
        document.getElementById("autoSaveInterval").value = data.interval || 30;
      }
    } catch (e) {
      console.error("加载自动保存设置失败:", e);
    }
  }

  /**
   * 保存自动保存设置
   */
  function saveAutoSaveSettings() {
    try {
      const settings = {
        enabled: document.getElementById("autoSaveToggle").checked,
        interval:
          parseInt(document.getElementById("autoSaveInterval").value) || 30,
      };
      GM_setValue("autoSaveSettings", JSON.stringify(settings));
    } catch (e) {
      console.error("保存自动保存设置失败:", e);
    }
  }

  /**
   * 开始自动保存
   */
  function startAutoSave() {
    stopAutoSave(); // 先停止现有的

    const toggle = document.getElementById("autoSaveToggle");
    if (!toggle || !toggle.checked) return;

    const interval =
      parseInt(document.getElementById("autoSaveInterval").value) * 1000;

    // 启动自动保存
    autoSaveTimer = setInterval(async () => {
      const modal = document.getElementById("workOrderModal");
      if (modal && modal.dataset.hasChanges === "true") {
        try {
          const draftData = await getFormData();
          // 只有在有实际内容时才保存
          if (
            draftData.title ||
            draftData.orderId ||
            draftData.issueDescription
          ) {
            GM_setValue("workOrderDraft", JSON.stringify(draftData));
            console.log("自动保存草稿成功");
            modal.dataset.hasChanges = "false";
          }
        } catch (e) {
          console.error("自动保存草稿失败:", e);
        }
      }
    }, interval);
  }

  /**
   * 停止自动保存
   */
  function stopAutoSave() {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  }

  /**
   * 重新启动自动保存
   */
  function restartAutoSave() {
    stopAutoSave();
    startAutoSave();
  }

  /**
   * 获取文件MIME类型
   */
  function getFileType(file) {
    let fileType = file.type;
    if (!fileType && file.name) {
      const ext = file.name.split(".").pop().toLowerCase();
      const mimeTypes = {
        txt: "text/plain",
        pdf: "application/pdf",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
      fileType = mimeTypes[ext] || "application/octet-stream";
    }
    if (!fileType) {
      fileType = "application/octet-stream";
    }
    return fileType;
  }

  /**
   * 上传所有附件（递归方式，逐个上传）
   */
  function uploadAllAttachments(files, workOrderData, currentIndex) {
    if (currentIndex >= files.length) {
      // 所有文件上传完成，创建工单
      console.log("所有文件上传成功，开始创建工单");
      sendWorkOrderRequest(workOrderData);
      return;
    }

    const file = files[currentIndex];
    const fileType = getFileType(file);

    const fileInfo = {
      scope: "project:656d3b2f80dc9e8e8a5eb2ac", // 使用项目范围
      fileSize: file.size,
      fileType: fileType,
      fileName: file.name,
      category: "attachment",
    };

    console.log(`上传文件 ${currentIndex + 1}/${files.length}:`, {
      name: file.name,
      size: file.size,
      type: file.type,
      inferredType: fileType,
    });

    // 获取上传凭证
    getUploadToken(
      fileInfo,
      function (uploadTokenData) {
        console.log(
          `文件 ${currentIndex + 1} 上传凭证已获取:`,
          uploadTokenData
        );

        // 保存上传凭证到数组
        appContext.uploadTokens.push(uploadTokenData);

        // 上传文件到OSS（传递上传凭证）
        uploadFileToTeambition(
          file,
          uploadTokenData,
          function () {
            console.log(`文件 ${currentIndex + 1} 上传成功`);
            // 继续上传下一个文件
            uploadAllAttachments(files, workOrderData, currentIndex + 1);
          },
          function (errMsg) {
            defaultOnError(
              errMsg || `文件 ${file.name} 上传失败，无法创建工单`
            );
          }
        );
      },
      function (errMsg) {
        defaultOnError(
          errMsg || `获取文件 ${file.name} 上传凭证失败，无法上传附件`
        );
      }
    );
  }

  /**
   * 提交工单
   */
  async function submitWorkOrder() {
    // 初始化认证令牌
    if (!initAuthToken()) {
      showResultTips("请先登录crm系统");
      return;
    }

    // 获取表单数据
    const title = document.getElementById("title").value.trim();
    const orderId = document.getElementById("order_id").value.trim();
    const sku = document.getElementById("sku").value.trim();
    const supportRole = document.getElementById("support_role").value.trim();
    const workOrderType = document
      .getElementById("work_order_type")
      .value.trim();
    const issueDescription = document
      .getElementById("issue_description")
      .value.trim();

    // if (!title) {
    //     showResultTips("请填写标题！");
    //     document.getElementById('title').focus();
    //     return;
    // }

    // if (!orderId) {
    //     showResultTips("请填写订单号！");
    //     document.getElementById('order_id').focus();
    //     return;
    // }

    if (!sku) {
      showResultTips("请填写 SKU！");
      document.getElementById("sku").focus();
      return;
    }

    if (!supportRole) {
      showResultTips("请选择需支持角色！");
      document.getElementById("support_role").focus();
      return;
    }

    if (!workOrderType) {
      showResultTips("请选择工单类型！");
      document.getElementById("work_order_type").focus();
      return;
    }

    if (!issueDescription) {
      showResultTips("请填写问题描述！");
      document.getElementById("issue_description").focus();
      return;
    }

    // 禁用提交按钮，显示提交中
    const submitBtn = document.getElementById("submitWorkOrderBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "提交中...";
      submitBtn.style.opacity = "0.7";
    }

    const workOrderData = await getFormData();

    // 保存草稿数据（更新保存时间）
    GM_setValue("workOrderDraft", JSON.stringify(workOrderData));

    // 显示保存提示
    showDraftStatus("✓ 草稿已自动保存", "success");

    // 处理附件（如果有）
    const attachmentField = document.getElementById("attachment");
    const hasAttachment =
      attachmentField.files && attachmentField.files.length > 0;

    // 显示结果区域
    document.getElementById("workOrderResult").style.display = "block";
    document.getElementById("resultContent").textContent = "";

    // 处理附件上传流程（支持多个文件）
    if (hasAttachment) {
      console.log("存在文件，开始获取上传凭证");
      const files = Array.from(attachmentField.files);

      // 清空之前的上传凭证
      appContext.uploadTokens = [];

      // 先获取操作人ID（因为 getUploadToken 需要 operatorId）
      getNowUserId(
        function (operatorId) {
          console.log("当前登录人ID为:", operatorId);

          // 上传所有附件
          uploadAllAttachments(files, workOrderData, 0);
        },
        function (errMsg) {
          defaultOnError(errMsg || "获取当前登录人信息失败，无法创建工单");
        }
      );
    } else {
      // 没有附件，清除之前的上传凭证，直接获取用户ID并创建工单
      appContext.uploadTokens = []; // 清除之前的上传凭证，避免误添加附件
      getNowUserId(
        function (operatorId) {
          console.log("当前登录人ID为:", operatorId);
          sendWorkOrderRequest(workOrderData);
        },
        function (errMsg) {
          defaultOnError(errMsg || "获取当前登录人信息失败，无法创建工单");
        }
      );
    }
  }

  /**
   * 构造 Teambition 任务创建请求体 jsonBody
   */
  function buildTaskRequestBody(workOrderData) {
    const {
      title,
      orderId,
      sku,
      supportRole,
      workOrderType,
      issueReason,
      issueDetail,
      issueDescription,
      extraCost,
      remark,
    } = workOrderData || {};

    // // 组合备注信息
    // const lines = [];
    // if (orderId) lines.push('订单号：' + orderId);
    // if (sku) lines.push('SKU：' + sku);
    // if (supportRole) lines.push('需支持角色：' + supportRole);
    // if (workOrderType) lines.push('工单类型：' + workOrderType);
    // if (Array.isArray(issueReason) && issueReason.length) {
    //     lines.push('问题原因：' + issueReason.join('，'));
    // }
    // if (issueDetail) lines.push('问题原因明细：' + issueDetail);
    // if (issueDescription) lines.push('问题描述：' + issueDescription);
    // if (remark) lines.push('备注：' + remark);
    // const note = lines.join('\n');

    // 自定义字段映射（cfId 来自项目自定义字段配置）
    const customfields = [];
    if (sku) {
      // SKU
      customfields.push({
        cfId: "65ae31b132ff6c3069cd2b30",
        value: [{ title: sku }],
      });
    }

    if (orderId) {
      // 订单号
      customfields.push({
        cfId: "65781df1c577a091a1153612",
        value: [{ title: orderId }],
      });
    }

    if (Array.isArray(issueReason) && issueReason.length) {
      // 问题原因（多选）
      customfields.push({
        cfId: "65af6e48e547528b32e48a5f",
        value: issueReason.map((v) => ({ title: v })),
      });
    }

    if (supportRole) {
      // 需支持角色
      customfields.push({
        cfId: "65781ea44a6e55b0027c08a8",
        value: [{ title: supportRole }],
      });
    }

    if (workOrderType) {
      // 工单类型
      customfields.push({
        cfId: "65ae413a32ff6c3069d26f18",
        value: [{ title: workOrderType }],
      });
    }

    if (issueDetail && issueDetail.trim()) {
      // 问题原因明细
      customfields.push({
        cfId: "65af6e48e547528b32e48a93",
        value: [{ title: issueDetail.trim() }],
      });
    }
    if (issueDescription && issueDescription.trim()) {
      // 问题描述
      customfields.push({
        cfId: "65781a7442e7242157b99d14",
        value: [{ title: issueDescription.trim() }],
      });
    }

    if (extraCost && extraCost.trim()) {
      // 客诉额外费用
      customfields.push({
        cfId: "65c04acd3da9da585ed8c3f7",
        value: [{ title: extraCost.trim() }],
      });
    }

    // 如果有附件，添加附件字段（支持多个附件）
    if (appContext.uploadTokens && appContext.uploadTokens.length > 0) {
      const attachmentValues = appContext.uploadTokens
        .map((uploadToken) => {
          if (uploadToken && uploadToken.token) {
            const fileToken = uploadToken.token;
            const metaString = JSON.stringify({ fileToken: fileToken });
            return {
              title: "附件",
              metaString: metaString,
            };
          }
          return null;
        })
        .filter((item) => item !== null); // 过滤掉无效的附件

      if (attachmentValues.length > 0) {
        customfields.push({
          cfId: "656d3bd565e7c55ebbeacc26",
          value: attachmentValues,
        });
      }
    }

    return {
      // 固定绑定到当前工单项目（Teambition projectId）
      projectId: "656d3b2f80dc9e8e8a5eb2ac",
      content: title || "订单号 " + (orderId || "未填写"),
      note: remark,
      noteRenderMode: "markdown",
      visible: "members", //任务隐私性，'involves'表达仅参与者可见; 'members'表达项目成员可见
      customfields: customfields,
      // 将当前操作人作为创建人
      creatorId: appContext.operatorId,
    };
  }

  /**
   * 通过 CRM 代理接口发送工单创建请求
   */
  function sendWorkOrderRequest(workOrderData) {
    const url = "https://crm-server.maxpeedingrods.cn/crm/tb/postTb";
    console.log("发送工单请求到代理接口:", url);
    const timeout = 30 * 1000; // 30秒超时

    // 确保认证信息已初始化
    if (!appContext.accessToken) {
      if (!initAuthToken() || !appContext.accessToken) {
        defaultOnError("登录状态失效，请先登录 CRM 系统");
        return;
      }
    }

    if (!appContext.operatorId) {
      defaultOnError("未获取到操作人 ID，无法创建工单");
      return;
    }

    const taskBody = buildTaskRequestBody(workOrderData);
    const body = [
      "operatorId=" + encodeURIComponent(appContext.operatorId),
      "url=" + encodeURIComponent("api/v3/task/create"),
      "X-Access-Token=" + encodeURIComponent(appContext.accessToken),
      "jsonBody=" + encodeURIComponent(JSON.stringify(taskBody)),
    ].join("&");

    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      timeout: timeout,
      headers: {
        "X-Access-Token": appContext.accessToken,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: body,
      onload: function (response) {
        renderWorkOrderResult(response);
      },
      onerror: function (e) {
        console.log(e);
        defaultOnError("创建工单失败：" + e.message);
      },
      ontimeout: function () {
        defaultOnError("创建工单超时");
      },
    });
  }

  /**
   * 展示工单创建结果
   */
  function renderWorkOrderResult(response) {
    try {
      // 检查响应文本是否存在且非空
      if (!response.responseText || response.responseText.trim() === "") {
        throw new Error("服务器返回空响应");
      }

      const obj = JSON.parse(response.responseText);

      if (obj.code == 200 && obj.result) {
        showResultTips("");

        const title = document.getElementById("title").value;
        const orderId = document.getElementById("order_id").value;

        // 只保存最后一次成功的记录
        const lastSuccessData = {
          title: title,
          orderId: orderId,
        };
        GM_setValue("workOrderSuccess", JSON.stringify(lastSuccessData));

        // 显示成功信息
        showResultTips("工单创建成功！");

        const successHtml = `
                <div style="color:#4CAF50;font-weight:bold; margin-bottom: 10px;">工单创建成功！</div>
            `;
        document.getElementById("resultContent").innerHTML = successHtml;

        // 成功提交后禁用按钮并改文字
        setSubmitButtonSubmitted();

        // 成功提交后清除草稿提示
        showDraftStatus("✓ 工单提交成功", "success");
      } else {
        showResultTips(obj.message || "工单创建失败");
        resetSubmitButton();
      }
    } catch (e) {
      console.log("响应处理异常:", e);
      console.log("原始响应:", response);
      showResultTips(
        "处理响应异常：" + e.message + "。请检查网络连接或联系管理员。"
      );
      resetSubmitButton();
    }
  }

  /**
   * 显示结果提示
   */
  function showResultTips(message) {
    const tipsDiv = document.getElementById("resultTips");
    const resultDiv = document.getElementById("workOrderResult");

    if (tipsDiv) {
      tipsDiv.textContent = message;
      tipsDiv.style.color = message ? "red" : "transparent";
    }

    if (resultDiv && message) {
      resultDiv.style.display = "block";
    }
  }

  /**
   * 设置提交按钮为已提交状态（禁用并改文字）
   */
  function setSubmitButtonSubmitted() {
    const btn = document.getElementById("submitWorkOrderBtn");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "已提交此工单";
      btn.style.background = "#9e9e9e";
      btn.style.cursor = "not-allowed";
    }
  }

  /**
   * 检查并更新提交按钮状态
   */
  function checkSubmitButtonState() {
    const titleEl = document.getElementById("title");
    const orderIdEl = document.getElementById("order_id");
    const btn = document.getElementById("submitWorkOrderBtn");

    if (!titleEl || !orderIdEl || !btn) return;

    const title = titleEl.value.trim();
    const orderId = orderIdEl.value.trim();

    // 如果标题和订单号都为空，恢复按钮状态
    if (!title || !orderId) {
      btn.disabled = false;
      btn.textContent = "提交工单";
      btn.style.background = "#4CAF50";
      btn.style.cursor = "pointer";
      return;
    }

    // 未提交过，恢复按钮状态
    btn.disabled = false;
    btn.textContent = "提交工单";
    btn.style.background = "#4CAF50";
    btn.style.cursor = "pointer";
  }
  /**
   * 获取当前登录用户在 Teambition 中的 userId（通过 CRM 代理接口）
   * @param {function} onSuccess 成功回调，可选
   * @param {function} onError 失败回调，可选
   */
  function getNowUserId(onSuccess, onError) {
    // 初始化认证令牌
    if (!initAuthToken() || !appContext.accessToken) {
      const errMsg = "登录状态失效，请先登录 CRM 系统";
      if (onError) {
        onError(errMsg);
      } else {
        defaultOnError(errMsg);
      }
      return;
    }

    // 如果已经获取过，直接调用成功回调
    if (appContext.operatorId) {
      if (onSuccess) {
        onSuccess(appContext.operatorId);
      }
      return;
    }

    // 尝试从缓存读取
    try {
      const cached = GM_getValue("tbOperatorId");
      if (cached) {
        console.log("使用缓存的 tbOperatorId:", cached);
        appContext.operatorId = cached;
        if (onSuccess) {
          onSuccess(cached);
        }
        return;
      }
    } catch (e) {
      console.warn("读取缓存 tbOperatorId 失败:", e);
    }

    const url =
      "https://crm-server.maxpeedingrods.cn/crm/tb/getMyTbId?url=api/idmap/dingtalk/getTbUserId";
    console.log("获取当前登录人 tb 用户 ID:", url);
    const timeout = 300 * 1000;
    console.log("获取当前登录人token:", appContext.accessToken);

    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      timeout: timeout,
      headers: {
        "X-Access-Token": appContext.accessToken,
      },
      onload: function (response) {
        try {
          const obj = safeParse(response.responseText);
          console.log("获取 tb 用户 ID 响应:", obj);
          if (!obj || obj.code !== 200 || !obj.result) {
            const errMsg =
              "获取当前登录人信息失败：" +
              ((obj && obj.message) || "接口返回异常");
            if (onError) {
              onError(errMsg);
            } else {
              defaultOnError(errMsg);
            }
            return;
          }

          // 直接从 result 获取用户 ID（根据你的响应数据，result 就是用户 ID 字符串）
          let operatorId = null;
          if (typeof obj.result === "string" && obj.result.length > 0) {
            operatorId = obj.result;
          }

          if (!operatorId) {
            const errMsg = "未从返回结果中解析到 tb 用户 ID";
            if (onError) {
              onError(errMsg);
            } else {
              defaultOnError(errMsg);
            }
            return;
          }

          // 保存到上下文和缓存
          appContext.operatorId = operatorId;
          try {
            GM_setValue("tbOperatorId", operatorId);
          } catch (e) {
            console.warn("缓存 tbOperatorId 失败:", e);
          }

          if (onSuccess) {
            onSuccess(operatorId);
          } else {
            defaultOnSuccess(operatorId);
          }
        } catch (e) {
          console.error("解析 tb 用户 ID 响应失败:", e);
          const errMsg = "解析当前登录人信息失败：" + e.message;
          if (onError) {
            onError(errMsg);
          } else {
            defaultOnError(errMsg);
          }
        }
      },
      onerror: function (e) {
        console.log(e);
        const errMsg = "获取当前登录人信息失败：" + e.message;
        if (onError) {
          onError(errMsg);
        } else {
          defaultOnError(errMsg);
        }
      },
      ontimeout: function () {
        const errMsg = "获取当前登录人信息超时";
        if (onError) {
          onError(errMsg);
        } else {
          defaultOnError(errMsg);
        }
      },
    });
  }

  /**
   * 获取文件上传凭证
   * @param {Object} fileInfo 文件信息对象
   * @param {string} fileInfo.scope 作用域 (例如: "task:628cd5bff0396403950f3fdb")
   * @param {number} fileInfo.fileSize 文件大小（字节）
   * @param {string} fileInfo.fileType MIME 类型 (例如: "image/jpeg")
   * @param {string} fileInfo.fileName 文件名 (例如: "example.jpg")
   * @param {string} fileInfo.category 分类 (例如: "attachment")
   * @param {function} onSuccess 成功回调 (uploadToken) => {}，可选，默认使用 defaultOnSuccess
   * @param {function} onError 失败回调 (errorMsg) => {}，可选，默认使用 defaultOnError
   */
  function getUploadToken(fileInfo, onSuccess, onError) {
    // 确保认证信息已初始化
    if (!appContext.accessToken) {
      if (!initAuthToken() || !appContext.accessToken) {
        const errMsg = "登录状态失效，请先登录 CRM 系统";
        if (onError) {
          onError(errMsg);
        } else {
          defaultOnError(errMsg);
        }
        return;
      }
    }

    if (!appContext.operatorId) {
      const errMsg = "未获取到操作人 ID，无法获取上传凭证";
      if (onError) {
        onError(errMsg);
      } else {
        defaultOnError(errMsg);
      }
      return;
    }

    // 注意：文件上传凭证通常是临时的，每次上传都需要新的凭证
    // 所以这里不进行缓存检查，每次都重新获取

    // 构建请求体
    const requestBody = {
      scope: fileInfo.scope,
      fileSize: fileInfo.fileSize,
      fileType: fileInfo.fileType,
      fileName: fileInfo.fileName,
      category: fileInfo.category || "attachment",
    };

    const url = "https://crm-server.maxpeedingrods.cn/crm/tb/postTb";
    const body = [
      "operatorId=" + encodeURIComponent(appContext.operatorId),
      "url=" + encodeURIComponent("api/v3/awos/upload-token"),
      "X-Access-Token=" + encodeURIComponent(appContext.accessToken),
      "jsonBody=" + encodeURIComponent(JSON.stringify(requestBody)),
    ].join("&");

    console.log("获取文件上传凭证请求:", url);

    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      timeout: 30 * 1000, // 30秒超时
      headers: {
        "X-Access-Token": appContext.accessToken,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: body,
      onload: function (response) {
        try {
          const obj = safeParse(response.responseText);
          console.log("获取文件上传凭证响应:", obj);

          if (!obj || obj.code !== 200 || !obj.result) {
            const errMsg =
              "获取上传凭证失败：" + ((obj && obj.message) || "接口返回异常");
            if (onError) {
              onError(errMsg);
            } else {
              defaultOnError(errMsg);
            }
            return;
          }

          // 解析 result 字段中的 JSON 字符串
          const resultData = safeParse(obj.result);
          if (!resultData || !resultData.token || !resultData.uploadUrl) {
            const errMsg = "解析上传凭证失败：未找到有效的 token 或 uploadUrl";
            if (onError) {
              onError(errMsg);
            } else {
              defaultOnError(errMsg);
            }
            return;
          }

          // 注意：上传凭证现在由调用者管理，不再直接保存到上下文
          // 每个文件的上传凭证会在 uploadAllAttachments 中单独处理

          // 记录上传凭证的详细信息，特别是 ContentType
          console.log("上传凭证详情:", {
            hasUploadUrl: !!resultData.uploadUrl,
            hasToken: !!resultData.token,
            hasUpload: !!resultData.upload,
            uploadContentType: resultData.upload?.ContentType,
            uploadUrl: resultData.uploadUrl,
            fullResultData: resultData,
          });

          // 尝试从 uploadUrl 中提取 Content-Type（用于调试）
          if (resultData.uploadUrl) {
            try {
              const urlObj = new URL(resultData.uploadUrl);
              const urlContentType =
                urlObj.searchParams.get("Content-Type") ||
                urlObj.searchParams.get("ContentType") ||
                urlObj.searchParams.get("content-type");
              if (urlContentType) {
                console.log(
                  "从 uploadUrl 中检测到 Content-Type:",
                  urlContentType
                );
              } else {
                console.log("uploadUrl 中未找到 Content-Type 参数");
              }
            } catch (e) {
              console.warn("无法解析 uploadUrl:", e);
            }
          }

          // 返回完整的凭证对象，包含 uploadUrl, token, upload 等信息
          if (onSuccess) {
            onSuccess(resultData);
          } else {
            defaultOnSuccess(resultData);
          }
        } catch (e) {
          console.error("解析上传凭证响应失败:", e);
          const errMsg = "解析上传凭证失败：" + e.message;
          if (onError) {
            onError(errMsg);
          } else {
            defaultOnError(errMsg);
          }
        }
      },
      onerror: function (e) {
        console.error("获取上传凭证请求失败:", e);
        const errMsg = "获取上传凭证失败：" + e.message;
        if (onError) {
          onError(errMsg);
        } else {
          defaultOnError(errMsg);
        }
      },
      ontimeout: function () {
        const errMsg = "获取上传凭证请求超时";
        if (onError) {
          onError(errMsg);
        } else {
          defaultOnError(errMsg);
        }
      },
    });
  }

  /**
   * 捕获当前页面信息
   * 根据当前页面域名调用相应的抓取函数
   */
  function captureCurrentPageInfo() {
    const hostname = window.location.hostname;

    if (hostname.includes("shulex.com")) {
      captureShulexPageInfo();
    } else if (hostname.includes("eccang.com")) {
      captureEccangPageInfo();
    } else {
      showResultTips(
        "当前页面不支持自动抓取，仅支持 *.shulex.com 和 *.eccang.com"
      );
    }
  }

  /**
   * 抓取 *.shulex.com 页面信息
   * 获取订单号和图片链接
   */
  async function captureShulexPageInfo() {
    // 显示加载状态
    const capturePageInfoBtn = document.getElementById("capturePageInfoBtn");
    if (capturePageInfoBtn) {
      capturePageInfoBtn.disabled = true;
      capturePageInfoBtn.textContent = "抓取中...";
    }

    let orderNumber = null;
    const successMessages = [];

    try {
      // 尝试获取订单号
      const copyClickableElements = document.querySelectorAll(
        ".shulex-copyclickable-content"
      );
      const infoRowValueElements = document.querySelectorAll(
        ".shulex-info-row-value"
      );

      if (
        copyClickableElements.length >= 2 &&
        infoRowValueElements.length >= 3
      ) {
        const orderNumberPart1 = infoRowValueElements[2].textContent.trim();
        const orderNumberPart2 = copyClickableElements[1].textContent.trim();
        orderNumber = `${orderNumberPart1}-${orderNumberPart2}`;

        console.log("抓取到的订单号:", orderNumber);

        // 填充订单号
        const orderIdInput = document.getElementById("order_id");
        if (orderIdInput) {
          orderIdInput.value = orderNumber;

          // 自动将工单类型改为"售后"
          const workOrderTypeEl = document.getElementById("work_order_type");
          if (workOrderTypeEl) {
            const afterSaleOption = Array.from(workOrderTypeEl.options).find(
              (opt) => opt.value === "售后"
            );
            if (afterSaleOption) {
              workOrderTypeEl.value = "售后";
            }
          }

          // 触发获取订单信息并填充SKU
          getOrderSkusByOrderId();
        }
        successMessages.push(`成功抓取订单号: ${orderNumber}`);
      } else {
        console.log("未找到订单号信息，继续处理其他信息");
      }
    } catch (error) {
      console.error("抓取订单号失败:", error);
      // 订单号获取失败不影响其他信息的处理
    }

    // 获取图片链接（无论是否有订单号都执行）
    try {
      const imgs = document.querySelectorAll(".ant-image img");
      const imageUrls = [];

      imgs.forEach((imgElement) => {
        if (imgElement && imgElement.src) {
          imageUrls.push(imgElement.src);
        }
      });

      console.log("找到", imageUrls.length, "个图片链接:", imageUrls);

      // 如果有图片，下载并添加到附件
      if (imageUrls.length > 0) {
        await addImagesToAttachments(imageUrls);
        successMessages.push(`添加了 ${imageUrls.length} 个图片附件`);
      } else {
        if (orderNumber) {
          successMessages.push("未找到图片");
        }
      }
    } catch (error) {
      console.error("处理图片失败:", error);
      // 图片处理失败不影响其他信息
    }

    // 显示结果
    if (successMessages.length > 0) {
      showResultTips(successMessages.join("，"));
    } else {
      showResultTips("未找到可抓取的信息");
    }

    // 恢复按钮状态
    if (capturePageInfoBtn) {
      capturePageInfoBtn.disabled = false;
      capturePageInfoBtn.textContent = "捕获当前页面信息";
    }
  }

  /**
   * 检测当前是否在iframe中运行
   * @returns {boolean} 如果在iframe中返回true，否则返回false
   */
  function isInIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      // 如果访问window.top抛出异常，说明在iframe中且跨域
      return true;
    }
  }

  /**
   * 等待单个iframe加载完成并返回其document（按照教程的方式）
   *
   * 问题原因：
   * 1. iframe的加载时机与主页面并不同步，特别是运行于document-start阶段的脚本
   * 2. 如果iframe还没加载完成，contentDocument会返回null，直接访问会失败
   * 3. 跨域iframe的contentDocument始终为null，无法直接访问
   *
   * 解决方案：
   * 使用Promise + load事件监听，等待iframe加载完成后再访问
   * 参考：https://bbs.tampermonkey.net.cn/thread-1845-1-1.html
   *
   * @param {HTMLIFrameElement} iframe iframe元素
   * @returns {Promise<Document|null>} iframe的document，如果无法访问（跨域）则返回null
   */
  function getIframeDocument(iframe) {
    return new Promise((resolve) => {
      try {
        // 如果iframe已经加载完成，直接返回
        if (iframe.contentDocument) {
          resolve(iframe.contentDocument);
          return;
        }

        // 检查iframe是否已经加载完成（但contentDocument仍为null，可能是跨域）
        if (iframe.contentWindow) {
          try {
            // 尝试访问location来判断是否跨域
            const test = iframe.contentWindow.location;
            // 如果能访问location，说明可能同源，但contentDocument可能还没准备好
            // 继续等待load事件
          } catch (e) {
            // 跨域，无法访问location，contentDocument也肯定为null
            console.log("iframe跨域，无法直接访问:", iframe.src || iframe.name);
            resolve(null);
            return;
          }
        }

        // 如果iframe已经complete但contentDocument仍为null，可能是跨域或加载失败
        if (iframe.complete && !iframe.contentDocument) {
          console.log(
            "iframe已加载完成但contentDocument为null（可能是跨域）:",
            iframe.src || iframe.name
          );
          resolve(null);
          return;
        }

        // 如果iframe未加载完成，监听load事件
        iframe.addEventListener(
          "load",
          (e) => {
            try {
              // 再次检查contentDocument（可能仍然是跨域的）
              if (iframe.contentDocument) {
                resolve(iframe.contentDocument);
              } else {
                // 跨域iframe，contentDocument为null
                console.log(
                  "iframe加载完成但无法访问（跨域）:",
                  iframe.src || iframe.name
                );
                resolve(null);
              }
            } catch (error) {
              console.log("访问iframe失败（跨域）:", error.message);
              resolve(null);
            }
          },
          { once: true }
        ); // 使用once确保只执行一次
      } catch (error) {
        console.error("获取iframe document失败:", error);
        resolve(null);
      }
    });
  }

  /**
   * 获取所有iframe的document对象（同步版本，用于向后兼容）
   * @returns {Document|null} 找到的第一个目标iframe的document，如果不存在或无法访问则返回null
   */
  function getIframeDocumentSync() {
    try {
      // 检查当前是否已经在iframe中运行
      if (isInIframe()) {
        // 已经在iframe内部，直接返回当前document
        console.log("脚本在iframe内部运行，使用当前document");
        return document;
      }

      // 尝试查找页面中的iframe元素
      const iframes = Array.from(document.querySelectorAll("iframe"));
      console.log("找到", iframes.length, "个iframe元素");

      for (const iframe of iframes) {
        try {
          // 检查iframe是否已加载
          if (!iframe.contentWindow) {
            console.log("iframe未加载完成，跳过:", iframe.src || iframe.name);
            continue;
          }

          // 尝试访问contentDocument
          if (iframe.contentDocument) {
            const iframeDoc = iframe.contentDocument;
            const iframeUrl = iframe.contentWindow.location.href;

            // 检查是否是目标iframe（eccang相关的）
            if (
              iframeUrl.includes("eccang.com") ||
              iframeUrl.includes("track-web")
            ) {
              console.log("找到目标iframe:", iframeUrl);
              return iframeDoc;
            }
          } else {
            // contentDocument为null，可能是未加载完成或跨域
            console.log(
              "iframe contentDocument为null（可能未加载完成或跨域）:",
              iframe.src || iframe.name
            );
          }
        } catch (e) {
          // 跨域iframe会抛出异常，跳过
          console.log("无法访问iframe（可能是跨域）:", e.message);
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error("获取iframe document失败:", error);
      return null;
    }
  }

  /**
   * 等待iframe加载完成并返回其document（改进版，按照教程方式处理）
   * @param {number} maxWait 最大等待时间（毫秒）
   * @param {number} checkInterval 检查间隔（毫秒）
   * @returns {Promise<Document>} iframe的document
   */
  async function waitForIframeDocument(maxWait = 10000, checkInterval = 200) {
    // 如果当前在iframe中运行，直接返回当前document
    if (isInIframe()) {
      console.log("脚本在iframe内部运行，直接使用当前document");
      // 等待DOM加载完成
      if (document.readyState === "loading") {
        await new Promise((resolve) => {
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", resolve);
          } else {
            resolve();
          }
        });
      }
      return document;
    }

    // 查找所有iframe元素
    const iframes = Array.from(document.querySelectorAll("iframe"));
    console.log("找到", iframes.length, "个iframe元素，开始等待加载...");

    if (iframes.length === 0) {
      console.warn("未找到iframe元素");
      return document;
    }

    // 为所有iframe创建Promise，等待它们加载完成
    const iframePromises = iframes.map(async (iframe) => {
      try {
        // 使用新的getIframeDocument函数等待iframe加载
        const iframeDoc = await getIframeDocument(iframe);

        if (iframeDoc) {
          // 检查是否是目标iframe（eccang相关的）
          try {
            const iframeUrl = iframe.contentWindow.location.href;
            if (
              iframeUrl.includes("eccang.com") ||
              iframeUrl.includes("track-web")
            ) {
              console.log("找到目标iframe:", iframeUrl);
              // 额外检查iframe内容是否已加载（通过查找关键元素）
              const testElements = iframeDoc.querySelectorAll(
                ".flex-box.mb4, body"
              );
              if (testElements.length > 0) {
                console.log("iframe已加载完成");
                return iframeDoc;
              }
            }
          } catch (e) {
            // 跨域iframe无法访问location
            console.log("无法访问iframe URL（跨域）:", e.message);
          }
        }
        return null;
      } catch (error) {
        console.error("等待iframe加载失败:", error);
        return null;
      }
    });

    // 设置超时
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve(null), maxWait);
    });

    // 等待第一个匹配的iframe加载完成，或超时
    const results = await Promise.race([
      Promise.all(iframePromises).then(
        (results) => results.find((r) => r !== null) || null
      ),
      timeoutPromise,
    ]);

    if (results) {
      return results;
    }

    // 如果超时，尝试使用同步方法（向后兼容）
    console.warn("等待iframe超时，尝试使用同步方法...");
    const currentDoc = getIframeDocumentSync();
    if (currentDoc) {
      console.warn("等待iframe超时，但找到了可用的document");
      return currentDoc;
    }

    // 如果都找不到，返回主文档（作为后备）
    console.warn("未找到iframe document，使用主文档");
    return document;
  }

  /**
   * 从iframe内部提取订单信息并发送给父页面
   * 这个函数在iframe内部运行
   */
  async function extractOrderInfoFromIframe() {
    try {
      console.log("在iframe内部运行，开始提取订单信息...");
      console.log("当前URL:", window.location.href);

      // 等待DOM加载完成
      if (document.readyState === "loading") {
        await new Promise((resolve) => {
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", resolve);
          } else {
            resolve();
          }
        });
      }

      // 等待内容加载（最多等待10秒）
      let orderId = null;
      let storeName = null;
      const maxRetries = 100;
      const retryDelay = 100;

      for (let i = 0; i < maxRetries; i++) {
        // 尝试多种选择器
        let items = Array.from(document.querySelectorAll(".flex-box.mb4"));

        if (items.length === 0) {
          items = Array.from(document.querySelectorAll(".flex-box"));
        }

        if (items.length === 0) {
          const allElements = Array.from(document.querySelectorAll("*"));
          items = allElements.filter(
            (el) => el.innerText && el.innerText.includes("订单号:")
          );
        }

        if (items.length > 0) {
          const orderIdEl = items.find(
            (el) => el.innerText && el.innerText.includes("订单号:")
          );
          const storeEl = items.find(
            (el) => el.innerText && el.innerText.includes("店铺名称:")
          );

          if (orderIdEl) {
            const linkEl = orderIdEl.querySelector("a");
            if (linkEl && linkEl.title) {
              orderId = linkEl.title.trim();
            } else if (linkEl && linkEl.textContent) {
              orderId = linkEl.textContent.trim();
            } else {
              const text = orderIdEl.innerText || orderIdEl.textContent || "";
              orderId = text
                .replace(/订单号:\s*/, "")
                .trim()
                .split(/\s/)[0];
            }
          }

          if (storeEl) {
            const spanEl = storeEl.querySelector("span[title]");
            if (spanEl && spanEl.title) {
              storeName = spanEl.title.trim();
            } else if (spanEl && spanEl.textContent) {
              storeName = spanEl.textContent.trim();
            } else {
              const text = storeEl.innerText || storeEl.textContent || "";
              storeName = text
                .replace(/店铺名称:\s*/, "")
                .trim()
                .split(/\s/)[0];
            }
          }

          if (orderId) {
            console.log(`第 ${i + 1} 次尝试成功获取订单信息:`, {
              orderId,
              storeName,
            });
            break;
          }
        }

        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }

      // 获取图片链接
      const imgs = document.querySelectorAll("li.img-wrap img");
      const imageUrls = Array.from(imgs)
        .map((img) => img.src)
        .filter((src) => src);

      const orderInfo = {
        orderId: orderId || null,
        storeName: storeName || null,
        fullOrderId:
          storeName && orderId ? `${storeName}-${orderId}` : orderId || null,
        imageUrls,
        success: !!orderId || (imageUrls && imageUrls.length > 0),
      };

      console.log("提取到的订单信息:", orderInfo);

      // 发送消息给父页面
      if (window.parent && window.parent !== window.self) {
        window.parent.postMessage(
          {
            type: "ORDER_INFO_EXTRACTED",
            data: orderInfo,
          },
          "*"
        );
        console.log("已发送订单信息给父页面");
      }

      return orderInfo;
    } catch (error) {
      console.error("在iframe内部提取订单信息失败:", error);
      // 发送错误消息给父页面
      if (window.parent && window.parent !== window.self) {
        window.parent.postMessage(
          {
            type: "ORDER_INFO_ERROR",
            error: error.message,
          },
          "*"
        );
      }
      throw error;
    }
  }

  /**
   * 抓取 *.eccang.com 页面信息（支持iframe）
   */
  async function captureEccangPageInfo() {
    try {
      // 如果当前在iframe中运行，直接提取信息并发送给父页面
      if (isInIframe()) {
        console.log("检测到在iframe中运行，直接提取订单信息");
        await extractOrderInfoFromIframe();
        return;
      }

      // 显示加载状态
      const capturePageInfoBtn = document.getElementById("capturePageInfoBtn");
      if (capturePageInfoBtn) {
        capturePageInfoBtn.disabled = true;
        capturePageInfoBtn.textContent = "抓取中...";
      }

      // 清除旧的缓存（切换订单后，缓存可能是旧订单信息）
      // 但先保存一份，如果没有收到新消息，再使用缓存
      const oldCachedInfo = cachedOrderInfo;
      cachedOrderInfo = null;

      // 先检查是否有缓存的订单信息（仅在第一次点击时使用）
      if (
        oldCachedInfo &&
        oldCachedInfo.success &&
        oldCachedInfo.orderId &&
        !hasActiveOrderListener
      ) {
        console.log("使用缓存的订单信息:", oldCachedInfo);
        // 使用缓存的订单信息
        const orderInfo = oldCachedInfo;
        // 清除缓存，避免重复使用
        cachedOrderInfo = null;

        // 填充订单号
        const orderIdInput = document.getElementById("order_id");
        if (orderIdInput) {
          orderIdInput.value = orderInfo.fullOrderId || orderInfo.orderId;

          // 自动将工单类型改为"售后"
          const workOrderTypeEl = document.getElementById("work_order_type");
          if (workOrderTypeEl) {
            const afterSaleOption = Array.from(workOrderTypeEl.options).find(
              (opt) => opt.value === "售后"
            );
            if (afterSaleOption) {
              workOrderTypeEl.value = "售后";
            }
          }

          // 触发获取订单信息并填充SKU
          getOrderSkusByOrderId();
        }

        // 如果有图片，下载并添加到附件
        if (orderInfo.imageUrls && orderInfo.imageUrls.length > 0) {
          addImagesToAttachments(orderInfo.imageUrls)
            .then(() => {
              showResultTips(
                `成功抓取订单号: ${orderInfo.orderId}${
                  orderInfo.storeName ? `，店铺: ${orderInfo.storeName}` : ""
                }，并添加了 ${orderInfo.imageUrls.length} 个图片附件`
              );
              if (capturePageInfoBtn) {
                capturePageInfoBtn.disabled = false;
                capturePageInfoBtn.textContent = "捕获当前页面信息";
              }
            })
            .catch((err) => {
              console.error("添加图片附件失败:", err);
              showResultTips(
                `成功抓取订单号: ${orderInfo.orderId}${
                  orderInfo.storeName ? `，店铺: ${orderInfo.storeName}` : ""
                }，但添加图片附件失败`
              );
              if (capturePageInfoBtn) {
                capturePageInfoBtn.disabled = false;
                capturePageInfoBtn.textContent = "捕获当前页面信息";
              }
            });
        } else {
          showResultTips(
            `成功抓取订单号: ${orderInfo.orderId}${
              orderInfo.storeName ? `，店铺: ${orderInfo.storeName}` : ""
            }，未找到图片`
          );
          if (capturePageInfoBtn) {
            capturePageInfoBtn.disabled = false;
            capturePageInfoBtn.textContent = "捕获当前页面信息";
          }
        }
        return;
      }

      // 如果没有缓存，设置消息监听器，接收iframe发送的订单信息
      return new Promise((resolve, reject) => {
        // 标记有活动的监听器
        hasActiveOrderListener = true;

        const messageHandler = (event) => {
          if (event.data && event.data.type === "ORDER_INFO_EXTRACTED") {
            window.removeEventListener("message", messageHandler);
            // 清除活动监听器标志
            hasActiveOrderListener = false;

            const orderInfo = event.data.data;
            console.log("从iframe接收到订单信息:", orderInfo);

            // 清除缓存，避免重复使用
            cachedOrderInfo = null;

            // 如果既没有订单号也没有图片，则认为失败
            if (
              !orderInfo.success ||
              (!orderInfo.orderId &&
                (!orderInfo.imageUrls || orderInfo.imageUrls.length === 0))
            ) {
              const errorMsg = "无法从iframe中提取订单信息或图片";
              showResultTips(errorMsg);
              if (capturePageInfoBtn) {
                capturePageInfoBtn.disabled = false;
                capturePageInfoBtn.textContent = "捕获当前页面信息";
              }
              reject(new Error(errorMsg));
              return;
            }

            // 如果有订单号，填充订单号
            if (orderInfo.orderId) {
              const orderIdInput = document.getElementById("order_id");
              if (orderIdInput) {
                orderIdInput.value = orderInfo.fullOrderId || orderInfo.orderId;

                // 自动将工单类型改为"售后"
                const workOrderTypeEl =
                  document.getElementById("work_order_type");
                if (workOrderTypeEl) {
                  const afterSaleOption = Array.from(
                    workOrderTypeEl.options
                  ).find((opt) => opt.value === "售后");
                  if (afterSaleOption) {
                    workOrderTypeEl.value = "售后";
                  }
                }

                // 触发获取订单信息并填充SKU
                getOrderSkusByOrderId();
              }
            }

            // 如果有图片，下载并添加到附件
            if (orderInfo.imageUrls && orderInfo.imageUrls.length > 0) {
              addImagesToAttachments(orderInfo.imageUrls)
                .then(() => {
                  const orderInfoText = orderInfo.orderId
                    ? `成功抓取订单号: ${orderInfo.orderId}${
                        orderInfo.storeName
                          ? `，店铺: ${orderInfo.storeName}`
                          : ""
                      }，并添加了 ${orderInfo.imageUrls.length} 个图片附件`
                    : `成功抓取了 ${orderInfo.imageUrls.length} 个图片附件${
                        orderInfo.storeName
                          ? `（店铺: ${orderInfo.storeName}）`
                          : ""
                      }`;
                  showResultTips(orderInfoText);
                  if (capturePageInfoBtn) {
                    capturePageInfoBtn.disabled = false;
                    capturePageInfoBtn.textContent = "捕获当前页面信息";
                  }
                  resolve(orderInfo);
                })
                .catch((err) => {
                  console.error("添加图片附件失败:", err);
                  const orderInfoText = orderInfo.orderId
                    ? `成功抓取订单号: ${orderInfo.orderId}${
                        orderInfo.storeName
                          ? `，店铺: ${orderInfo.storeName}`
                          : ""
                      }，但添加图片附件失败`
                    : `抓取了图片，但添加图片附件失败${
                        orderInfo.storeName
                          ? `（店铺: ${orderInfo.storeName}）`
                          : ""
                      }`;
                  showResultTips(orderInfoText);
                  if (capturePageInfoBtn) {
                    capturePageInfoBtn.disabled = false;
                    capturePageInfoBtn.textContent = "捕获当前页面信息";
                  }
                  resolve(orderInfo);
                });
            } else {
              // 只有订单号，没有图片
              const orderInfoText = `成功抓取订单号: ${orderInfo.orderId}${
                orderInfo.storeName ? `，店铺: ${orderInfo.storeName}` : ""
              }，未找到图片`;
              showResultTips(orderInfoText);
              if (capturePageInfoBtn) {
                capturePageInfoBtn.disabled = false;
                capturePageInfoBtn.textContent = "捕获当前页面信息";
              }
              resolve(orderInfo);
            }
          } else if (event.data && event.data.type === "ORDER_INFO_ERROR") {
            window.removeEventListener("message", messageHandler);
            // 清除活动监听器标志
            hasActiveOrderListener = false;
            const errorMsg = "从iframe提取订单信息失败: " + event.data.error;
            showResultTips(errorMsg);
            if (capturePageInfoBtn) {
              capturePageInfoBtn.disabled = false;
              capturePageInfoBtn.textContent = "捕获当前页面信息";
            }
            reject(new Error(errorMsg));
          }
        };

        window.addEventListener("message", messageHandler);

        // 查找iframe并发送提取请求
        console.log("开始查找iframe...");
        const iframes = Array.from(document.querySelectorAll("iframe"));
        console.log("找到", iframes.length, "个iframe元素");

        // 尝试向所有iframe发送提取请求
        // 注意：即使跨域无法访问iframe的URL，postMessage仍然可以工作
        // 我们向所有iframe发送消息，让它们自己判断是否处理（因为跨域无法准确判断）
        let messageSent = false;
        for (const iframe of iframes) {
          try {
            // 检查iframe是否已加载
            if (!iframe.contentWindow) {
              console.log("iframe未加载完成，跳过:", iframe.src || iframe.name);
              continue;
            }

            // 尝试获取iframe URL（可能因为跨域失败）
            let iframeUrl = null;
            let shouldSend = false;

            try {
              iframeUrl = iframe.contentWindow.location.href;
              console.log("检查iframe:", iframeUrl);

              // 检查是否是目标iframe（eccang相关的）
              if (
                iframeUrl.includes("eccang.com") ||
                iframeUrl.includes("track-web")
              ) {
                shouldSend = true;
              }
            } catch (e) {
              // 跨域iframe无法访问location，但仍然可以发送postMessage
              console.log(
                "无法访问iframe URL（跨域），但仍尝试发送消息:",
                iframe.src || iframe.name
              );
              // 即使跨域，也尝试发送消息（postMessage不受跨域限制）
              // 通过src判断，或者src为空（可能是动态加载的）
              const iframeSrc = iframe.src || "";
              // 如果src包含eccang，肯定是目标iframe
              if (
                iframeSrc.includes("eccang.com") ||
                iframeSrc.includes("track-web")
              ) {
                shouldSend = true;
              } else if (
                iframeSrc === "" ||
                !iframeSrc ||
                iframeSrc.startsWith("about:blank")
              ) {
                // src为空或about:blank，可能是动态加载的目标iframe，尝试发送
                shouldSend = true;
              } else {
                // 如果src不包含eccang，但当前页面是eccang相关，这个iframe也可能是目标
                // 因为可能是同源的iframe
                const currentHost = window.location.hostname;
                if (currentHost.includes("eccang.com")) {
                  console.log(
                    "当前页面是eccang相关，iframe可能是同源的，尝试发送消息"
                  );
                  shouldSend = true;
                }
              }
            }

            if (shouldSend) {
              console.log(
                "向iframe发送提取请求:",
                iframeUrl || iframe.src || iframe.name
              );
              messageSent = true;
              try {
                iframe.contentWindow.postMessage(
                  {
                    type: "EXTRACT_ORDER_INFO",
                  },
                  "*"
                );
              } catch (postError) {
                console.log("发送消息失败:", postError.message);
              }
            }
          } catch (e) {
            // 其他异常，跳过
            console.log("处理iframe时出错:", e.message);
            continue;
          }
        }

        // 如果没找到iframe，可能是脚本在iframe内部运行，等待自动提取
        if (!messageSent) {
          console.log(
            "未找到可发送消息的iframe，可能脚本在iframe内部运行，等待自动提取..."
          );
        }

        // 设置超时，如果15秒内没有收到消息，认为失败
        setTimeout(() => {
          window.removeEventListener("message", messageHandler);
          // 清除活动监听器标志
          hasActiveOrderListener = false;
          const errorMsg =
            "等待iframe响应超时，请确保iframe已加载且脚本正在运行";
          showResultTips(errorMsg);
          if (capturePageInfoBtn) {
            capturePageInfoBtn.disabled = false;
            capturePageInfoBtn.textContent = "捕获当前页面信息";
          }
          reject(new Error(errorMsg));
        }, 25000);
      });
    } catch (error) {
      console.error("抓取页面信息失败:", error);
      showResultTips("抓取页面信息失败: " + error.message);

      // 恢复按钮状态
      const capturePageInfoBtn = document.getElementById("capturePageInfoBtn");
      if (capturePageInfoBtn) {
        capturePageInfoBtn.disabled = false;
        capturePageInfoBtn.textContent = "捕获当前页面信息";
      }
    }
  }

  /**
   * 根据URL或文件名推断图片MIME类型
   * @param {string} urlOrFileName URL或文件名
   * @returns {string} MIME类型
   */
  function inferImageMimeType(urlOrFileName) {
    // 提取文件扩展名
    const urlWithoutQuery = urlOrFileName.split("?")[0]; // 移除查询参数
    const fileName = urlWithoutQuery.split("/").pop() || urlWithoutQuery;
    const ext = fileName.split(".").pop()?.toLowerCase() || "";

    // 根据扩展名返回对应的MIME类型
    const mimeTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      bmp: "image/bmp",
      svg: "image/svg+xml",
      ico: "image/x-icon",
    };

    return mimeTypes[ext] || "image/jpeg"; // 默认使用jpeg
  }

  /**
   * 检查MIME类型是否为图片类型
   * @param {string} mimeType MIME类型
   * @returns {boolean} 是否为图片类型
   */
  function isImageMimeType(mimeType) {
    return mimeType && mimeType.startsWith("image/");
  }

  /**
   * 将图片URL下载并添加到附件框
   * @param {string[]} imageUrls 图片URL数组
   */
  async function addImagesToAttachments(imageUrls) {
    const attachmentInput = document.getElementById("attachment");
    if (!attachmentInput) {
      throw new Error("未找到附件输入框");
    }

    const existingFiles = attachmentInput.files
      ? Array.from(attachmentInput.files)
      : [];
    const newFiles = [];

    // 下载每个图片并转换为File对象
    for (const imageUrl of imageUrls) {
      try {
        // 使用 GM_xmlhttpRequest 绕过 CORS 限制
        const blob = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: imageUrl,
            responseType: "arraybuffer",
            onload: function (resp) {
              if (resp.status === 200) {
                // 从响应头获取 Content-Type
                const contentTypeMatch = resp.responseHeaders.match(
                  /content-type:\s*([^\r\n]+)/i
                );
                let contentType = contentTypeMatch
                  ? contentTypeMatch[1].trim()
                  : null;

                // 如果Content-Type不是图片类型，或者为空，则根据URL推断
                if (!contentType || !isImageMimeType(contentType)) {
                  contentType = inferImageMimeType(imageUrl);
                  console.log(
                    `从URL推断图片类型: ${imageUrl} -> ${contentType}`
                  );
                }

                // 将 ArrayBuffer 转换为 Blob
                const blob = new Blob([resp.response], { type: contentType });
                resolve(blob);
              } else {
                reject(
                  new Error(`下载图片失败: ${imageUrl}, 状态码: ${resp.status}`)
                );
              }
            },
            onerror: function (error) {
              reject(
                new Error(
                  `下载图片失败: ${imageUrl}, 错误: ${
                    error.message || "网络错误"
                  }`
                )
              );
            },
          });
        });

        // 确保文件名有正确的扩展名
        let fileName = imageUrl.split("/").pop() || `image_${Date.now()}.jpg`;
        // 移除查询参数
        fileName = fileName.split("?")[0];

        // 如果文件名没有扩展名，根据MIME类型添加
        if (!fileName.includes(".")) {
          const extMap = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/gif": "gif",
            "image/webp": "webp",
            "image/bmp": "bmp",
            "image/svg+xml": "svg",
          };
          const ext = extMap[blob.type] || "jpg";
          fileName = `${fileName}.${ext}`;
        }

        // 确保文件类型正确
        const fileType = blob.type || inferImageMimeType(fileName);
        const file = new File([blob], fileName, { type: fileType });
        newFiles.push(file);
      } catch (error) {
        console.warn("处理图片失败:", imageUrl, error);
      }
    }

    // 合并现有文件和新文件（去重，只判断文件名）
    const allFiles = [...existingFiles];
    newFiles.forEach((newFile) => {
      // 检查是否已存在同名文件（只判断文件名）
      const isDuplicate = existingFiles.some(
        (existing) => existing.name === newFile.name
      );
      if (!isDuplicate) {
        allFiles.push(newFile);
      }
    });

    // 创建新的FileList
    const dataTransfer = new DataTransfer();
    allFiles.forEach((file) => {
      dataTransfer.items.add(file);
    });

    attachmentInput.files = dataTransfer.files;
    updateAttachmentPreview();
  }

  /**
   * 通过订单号获取SKU
   * 从订单信息中提取products和child数组中的sku，去重后用英文逗号分割，填充到SKU输入框
   */
  function getOrderSkusByOrderId() {
    // 获取订单号
    const orderIdInput = document.getElementById("order_id");
    if (!orderIdInput) {
      showResultTips("未找到订单号输入框");
      return;
    }

    const orderId = orderIdInput.value.trim();
    if (!orderId) {
      showResultTips("请先填写订单号");
      orderIdInput.focus();
      return;
    }

    // 确保认证信息已初始化
    if (!appContext.accessToken) {
      if (!initAuthToken() || !appContext.accessToken) {
        showResultTips("登录状态失效，请先登录 CRM 系统");
        return;
      }
    }

    // 显示加载状态
    const getOrderInfoBtn = document.getElementById("getOrderInfoBtn");
    if (getOrderInfoBtn) {
      getOrderInfoBtn.disabled = true;
      getOrderInfoBtn.textContent = "获取中...";
    }

    // 构建请求URL
    const url = `https://crm.maxpeedingrods.cn:8013/crm/order/queryBuyerAndPackage?humanOrderId=${encodeURIComponent(
      orderId
    )}`;

    console.log("获取订单信息请求:", url);

    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      headers: {
        "X-Access-Token": appContext.accessToken,
      },
      onload: function (response) {
        // 恢复按钮状态
        if (getOrderInfoBtn) {
          getOrderInfoBtn.disabled = false;
          getOrderInfoBtn.textContent = "获取订单信息";
        }

        try {
          const result = safeParse(response.responseText);

          if (response.status !== 200) {
            const errMsg =
              result?.message || `请求失败，状态码：${response.status}`;
            showResultTips(errMsg);
            return;
          }

          if (!result || !result.success) {
            const errMsg = result?.message || "获取订单信息失败";
            showResultTips(errMsg);
            return;
          }

          // 提取SKU
          const skuSet = new Set();
          let orderData = result.result;
          console.log("orderData", orderData);
          // 从crmOrderPackages中提取products的sku
          if (orderData.crmOrderPackages) {
            const packages = Array.isArray(orderData.crmOrderPackages)
              ? orderData.crmOrderPackages
              : [orderData.crmOrderPackages];

            packages.forEach((pkg) => {
              // 提取products中的sku
              if (pkg.products && Array.isArray(pkg.products)) {
                pkg.products.forEach((product) => {
                  if (product.sku && product.sku.trim()) {
                    skuSet.add(product.sku.trim());
                  }
                });
              }

              // 提取child中的sku（递归处理）
              function extractSkusFromChild(children) {
                if (Array.isArray(children)) {
                  children.forEach((child) => {
                    // 如果child元素本身有sku属性，直接提取
                    if (child.sku && child.sku.trim()) {
                      skuSet.add(child.sku.trim());
                    }
                    // 如果child有products数组，也提取其中的sku
                    if (child.products && Array.isArray(child.products)) {
                      child.products.forEach((product) => {
                        if (product.sku && product.sku.trim()) {
                          skuSet.add(product.sku.trim());
                        }
                      });
                    }
                    // 递归处理嵌套的child
                    if (child.child && Array.isArray(child.child)) {
                      extractSkusFromChild(child.child);
                    }
                  });
                }
              }

              if (pkg.child && Array.isArray(pkg.child)) {
                extractSkusFromChild(pkg.child);
              }
            });
          }

          // 将SKU去重后用英文逗号分割
          const skuArray = Array.from(skuSet);
          if (skuArray.length === 0) {
            showResultTips("未找到SKU信息");
            return;
          }

          const skuString = skuArray.join(",");

          // 填充到SKU输入框
          const skuInput = document.getElementById("sku");
          if (skuInput) {
            skuInput.value = skuString;
            showResultTips(`成功获取 ${skuArray.length} 个SKU: ${skuString}`);
          } else {
            showResultTips("未找到SKU输入框");
          }
        } catch (e) {
          console.error("解析订单信息失败:", e);
          showResultTips("解析订单信息失败：" + e.message);
        }
      },
      onerror: function (e) {
        // 恢复按钮状态
        if (getOrderInfoBtn) {
          getOrderInfoBtn.disabled = false;
          getOrderInfoBtn.textContent = "获取订单信息";
        }

        console.error("获取订单信息请求失败:", e);
        showResultTips("获取订单信息失败：" + (e.message || "网络请求失败"));
      },
      ontimeout: function () {
        // 恢复按钮状态
        if (getOrderInfoBtn) {
          getOrderInfoBtn.disabled = false;
          getOrderInfoBtn.textContent = "获取订单信息";
        }

        console.error("获取订单信息请求超时");
        showResultTips("获取订单信息超时");
      },
    });
  }

  /**
   * 上传文件到 Teambition OSS
   * @param {File} file 要上传的文件对象
   * @param {Object} uploadTokenData 上传凭证（包含 uploadUrl, token 等信息）
   * @param {function} onSuccess 成功回调，可选
   * @param {function} onError 失败回调，可选
   */
  function uploadFileToTeambition(file, uploadTokenData, onSuccess, onError) {
    if (!uploadTokenData) {
      const errMsg = "上传凭证不存在或无效，请先获取上传凭证";
      if (onError) {
        onError(errMsg);
      } else {
        defaultOnError(errMsg);
      }
      return;
    }

    if (!uploadTokenData.token) {
      const errMsg = "上传凭证格式不正确：缺少 token 信息";
      if (onError) {
        onError(errMsg);
      } else {
        defaultOnError(errMsg);
      }
      return;
    }

    // 获取表单数据（uploadFormData 或 upload）
    const formData = uploadTokenData.uploadFormData || uploadTokenData.upload;

    if (!formData) {
      const errMsg = "上传凭证格式不正确：缺少 uploadFormData 或 upload 信息";
      if (onError) {
        onError(errMsg);
      } else {
        defaultOnError(errMsg);
      }
      return;
    }

    // 从 upload 对象中获取 Key
    const key = uploadTokenData.upload
      ? uploadTokenData.upload.Key
      : formData.Key;

    if (!key) {
      const errMsg = "上传凭证格式不正确：缺少 Key 信息";
      if (onError) {
        onError(errMsg);
      } else {
        defaultOnError(errMsg);
      }
      return;
    }

    // 确定上传地址
    let uploadUrl;
    if (uploadTokenData.uploadUrl) {
      try {
        const urlObj = new URL(uploadTokenData.uploadUrl);
        // 只使用协议和主机部分，去掉路径和查询参数
        uploadUrl = `${urlObj.protocol}//${urlObj.host}`;
      } catch (e) {
        // 如果uploadUrl不是完整URL，尝试使用formData.host
        if (formData.host) {
          uploadUrl = formData.host.startsWith("http")
            ? formData.host
            : `https://${formData.host}`;
        } else {
          const errMsg = "上传凭证格式不正确：无法解析 uploadUrl";
          if (onError) {
            onError(errMsg);
          } else {
            defaultOnError(errMsg);
          }
          return;
        }
      }
    } else if (formData.host) {
      uploadUrl = formData.host.startsWith("http")
        ? formData.host
        : `https://${formData.host}`;
    } else {
      const errMsg = "上传凭证格式不正确：缺少 uploadUrl 或 host 信息";
      if (onError) {
        onError(errMsg);
      } else {
        defaultOnError(errMsg);
      }
      return;
    }

    console.log("准备使用POST表单上传文件到:", uploadUrl);
    console.log("上传Key:", key);

    // 读取文件内容
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileData = e.target.result;

      // 构建 multipart/form-data 格式的请求体
      const boundary =
        "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
      const parts = [];

      // 1. key 字段（必须）
      parts.push(`--${boundary}\r\n`);
      parts.push(`Content-Disposition: form-data; name="key"\r\n\r\n`);
      parts.push(`${key}\r\n`);

      // 2. policy 字段（必须）
      if (formData.policy) {
        parts.push(`--${boundary}\r\n`);
        parts.push(`Content-Disposition: form-data; name="policy"\r\n\r\n`);
        parts.push(`${formData.policy}\r\n`);
      }

      // 3. OSSAccessKeyId 字段（必须）
      const accessKeyId = formData.OSSAccessKeyId || formData.accessKeyId;
      if (accessKeyId) {
        parts.push(`--${boundary}\r\n`);
        parts.push(
          `Content-Disposition: form-data; name="OSSAccessKeyId"\r\n\r\n`
        );
        parts.push(`${accessKeyId}\r\n`);
      }

      // 4. signature 字段（必须）
      if (formData.signature) {
        parts.push(`--${boundary}\r\n`);
        parts.push(`Content-Disposition: form-data; name="signature"\r\n\r\n`);
        parts.push(`${formData.signature}\r\n`);
      }

      // 5. 添加文件字段（必须，且必须是最后一个）
      parts.push(`--${boundary}\r\n`);
      parts.push(
        `Content-Disposition: form-data; name="file"; filename="${file.name}"\r\n`
      );
      parts.push(
        `Content-Type: ${file.type || "application/octet-stream"}\r\n\r\n`
      );

      // 将文本部分转换为 ArrayBuffer
      const textEncoder = new TextEncoder();
      let textBuffer = new Uint8Array(0);
      for (let i = 0; i < parts.length; i++) {
        const partBytes = textEncoder.encode(parts[i]);
        const newBuffer = new Uint8Array(textBuffer.length + partBytes.length);
        newBuffer.set(textBuffer);
        newBuffer.set(partBytes, textBuffer.length);
        textBuffer = newBuffer;
      }

      // 添加文件数据
      const fileArray = new Uint8Array(fileData);

      // 结束边界
      const endBoundaryStr = `\r\n--${boundary}--\r\n`;
      const endBoundary = textEncoder.encode(endBoundaryStr);

      // 创建完整的缓冲区
      const combinedBuffer = new Uint8Array(
        textBuffer.length + fileArray.length + endBoundary.length
      );
      combinedBuffer.set(textBuffer, 0);
      combinedBuffer.set(fileArray, textBuffer.length);
      combinedBuffer.set(endBoundary, textBuffer.length + fileArray.length);

      console.log("准备发送POST文件上传请求到:", uploadUrl);

      GM_xmlhttpRequest({
        method: "POST",
        url: uploadUrl,
        timeout: 30 * 1000, // 设置超时时间为30秒
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
        },
        data: combinedBuffer.buffer,
        binary: true,
        onload: function (response) {
          console.log("POST文件上传OSS请求完成，状态码:", response.status);
          console.log("POST文件上传OSS响应:", response.responseText);

          // OSS POST 上传成功通常返回 200 或 204 状态码
          if (response.status === 200 || response.status === 204) {
            console.log("文件上传成功");
            if (onSuccess) {
              onSuccess();
            } else {
              defaultOnSuccess("文件上传成功");
            }
          } else {
            const errMsg = "文件上传OSS失败，HTTP状态码：" + response.status;
            console.error("上传失败响应:", response.responseText);
            if (onError) {
              onError(errMsg);
            } else {
              defaultOnError(errMsg);
            }
          }
        },
        onerror: function (e) {
          console.error("文件上传OSS请求失败:", e);
          const errMsg = "文件上传OSS失败：" + (e.message || "网络请求失败");
          if (onError) {
            onError(errMsg);
          } else {
            defaultOnError(errMsg);
          }
        },
        ontimeout: function () {
          console.error("文件上传OSS请求超时");
          const errMsg = "文件上传OSS超时";
          if (onError) {
            onError(errMsg);
          } else {
            defaultOnError(errMsg);
          }
        },
      });
    };

    reader.onerror = function (e) {
      console.error("读取文件失败:", e);
      const errMsg = "读取文件失败：" + e.message;
      if (onError) {
        onError(errMsg);
      } else {
        defaultOnError(errMsg);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  // 初始化
  // 读取 localStorage 数据
  const myValue = localStorage.getItem(myKey);
  const currentDomain = window.location.origin;

  if (myValue && currentDomain == "https://crm.maxpeedingrods.cn") {
    // 存储数据到 Tampermonkey 的存储中
    GM_setValue(myKey, myValue);
    console.log(`Stored ${myKey}: ${myValue} in Tampermonkey storage`);
  }

  start();
})();