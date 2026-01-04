// ==UserScript==
// @name         素材中心复制图片资源链接，图片数据万象预览
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  1.3 版本优化了数据万象预览功能，支持调整宽高、格式、质量预览图片效果；修复了部分情况下复制按钮不显示的问题；优化了脚本加载和资源请求的时机，提升了稳定性和兼容性。
// @description  添加复制按钮，点击复制图片链接；添加数据万象预览按钮，支持调整宽高、格式、质量预览图片效果。
// @author       davidwu
// @license      MIT
// @match        *://super.xiaoe-tech.com/new*
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/560055/%E7%B4%A0%E6%9D%90%E4%B8%AD%E5%BF%83%E5%A4%8D%E5%88%B6%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%EF%BC%8C%E5%9B%BE%E7%89%87%E6%95%B0%E6%8D%AE%E4%B8%87%E8%B1%A1%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/560055/%E7%B4%A0%E6%9D%90%E4%B8%AD%E5%BF%83%E5%A4%8D%E5%88%B6%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%EF%BC%8C%E5%9B%BE%E7%89%87%E6%95%B0%E6%8D%AE%E4%B8%87%E8%B1%A1%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const TARGET_ROUTE_REGEX = /^#\/tools\/material_manage(?:[/?].*)?$/;

  function getCurrentHash() {
    return window.location.hash || "";
  }

  function isTargetRoute(hashValue = getCurrentHash()) {
    return TARGET_ROUTE_REGEX.test(hashValue);
  }

  //TODO: 如果后续七牛的CDN服务挂了，请使用其它服务：jsdelivr、unpkg(需翻墙)等
  const CDN_REACT =
    "https://cdn.staticfile.net/react/18.2.0/umd/react.production.min.js";
  const CDN_REACT_DOM =
    "https://cdn.staticfile.net/react-dom/18.2.0/umd/react-dom.production.min.js";
  const CDN_DAYJS = "https://cdn.staticfile.net/dayjs/1.11.10/dayjs.min.js";
  const CDN_ANTD_JS = "https://cdn.staticfile.net/antd/5.13.2/antd.min.js";
  const CDN_ANTD_CSS = "https://cdn.staticfile.net/antd/5.13.2/reset.min.css";

  // 配置参数（根据实际需要修改）
  const config = {
    // 表格选择器和列索引配置
    tableSelector:
      "body > div.home-page > main > div > div > div.main > div.main__content > div.el-table.main-table.el-table--fit.el-table--enable-row-hover.el-table--enable-row-transition", // 表格选择器
    targetColumn: 2, // 要复制的列索引（从1开始）
    textSelector: ".el-table_1_column_3 > .cell", // 可选：如果需要从特定子元素获取文本，可以指定选择器
    rowSelector:
      "div.main__content > div.el-table.main-table.el-table--fit.el-table--enable-row-hover.el-table--enable-row-transition > div.el-table__body-wrapper > table > tbody > tr",
    // 表格行选择器
    columnSelector: "",
    buttonText: "复制", // 按钮文字
    buttonClass: "copy-btn el-button el-button--text el-button--small", // 按钮CSS类名
    insetSelector: ".el-table_1_column_6 > .cell",
    insertColumn: "last", // 按钮插入位置：'first'第一列或'last'最后一列
    //***** 数据万象 */
    previewButtonText: "预览", // 预览按钮文字
    // 预览按钮类名，套用现有的样式
    previewButtonClass:
      "preview-btn el-button el-button--text el-button--small", // 预览按钮CSS类名
    //监听的网络请求路径
    monitorUrl:
      "https://super.xiaoe-tech.com/new/operation/common_material/list",
  };

  const baseStyles = `
    .tamper-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(76, 175, 80, 0.92);
      color: #fff;
      padding: 10px 20px;
      border-radius: 4px;
      z-index: 2147483647;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      transition: opacity 0.3s ease;
      opacity: 1;
    }
    .tamper-toast.error {
      background: rgba(244, 67, 54, 0.92);
    }
    .tamper-toast.hide {
      opacity: 0;
    }
    .xe-preview-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483600;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }
    .xe-preview-overlay.visible {
      opacity: 1;
      pointer-events: auto;
    }
    .xe-preview-modal {
      width: 720px;
      max-width: calc(100vw - 32px);
      max-height: 90vh;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .xe-preview-header {
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
    }
    .xe-preview-close {
      border: none;
      background: transparent;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.45);
    }
    .xe-preview-close:hover {
      color: rgba(0, 0, 0, 0.75);
    }
    .xe-preview-body {
      padding: 24px;
      overflow-y: auto;
    }
    .xe-preview-link {
      word-break: break-all;
      margin-bottom: 16px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.88);
    }
    .xe-preview-link a {
      color: #1677ff;
    }
    .xe-preview-form-row {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    .xe-preview-field {
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.88);
    }
    .xe-preview-field label {
      margin-bottom: 6px;
    }
    .xe-preview-input,
    .xe-preview-select,
    .xe-preview-number {
      padding: 6px 8px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .xe-preview-input:focus,
    .xe-preview-select:focus,
    .xe-preview-number:focus {
      border-color: #1677ff;
      box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
    }
    .xe-preview-quality {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .xe-preview-quality input[type="range"] {
      flex: 1;
    }
    .xe-preview-quality .xe-preview-number {
      width: 80px;
    }
    .xe-preview-preview {
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      padding: 12px;
      background: #fafafa;
      max-height: 60vh;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .xe-preview-img {
      max-width: 100%;
      height: auto;
    }
    .xe-preview-empty {
      color: rgba(0, 0, 0, 0.45);
      font-size: 13px;
    }
    .xe-preview-spinner {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 4px solid rgba(22, 119, 255, 0.2);
      border-top-color: #1677ff;
      animation: xe-preview-spin 1s linear infinite;
    }
    @keyframes xe-preview-spin {
      100% {
        transform: rotate(360deg);
      }
    }
    .xe-preview-info {
      margin-top: 12px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 13px;
    }
    .xe-preview-footer {
      padding: 12px 24px 24px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .xe-preview-button {
      min-width: 88px;
      padding: 6px 16px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid #d9d9d9;
      background: #fff;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .xe-preview-button.primary {
      border-color: #1677ff;
      background: #1677ff;
      color: #fff;
    }
    .xe-preview-button.primary:hover {
      background: #4096ff;
      border-color: #4096ff;
    }
    .xe-preview-button:hover {
      border-color: #4096ff;
      color: #4096ff;
    }
    .xe-preview-hidden {
      display: none !important;
    }
  `;

  if (typeof GM_addStyle === "function") {
    GM_addStyle(baseStyles);
  } else {
    const baseStyleTag = document.createElement("style");
    baseStyleTag.textContent = baseStyles;
    document.head.appendChild(baseStyleTag);
  }

  const runtimeWindow =
    typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  const APP_CONTAINER_CLASS = "xiaoe-tools-material-manage";
  const APP_REACT_ROOT_CLASS = "xiaoe-tools-material-manage-react-root";
  const APP_MODAL_CONTAINER_CLASS = "xiaoe-tools-material-manage-modal-root";

  const initialPreviewState = {
    visible: false,
    sourceUrl: "",
    previewSrc: "",
    width: "",
    height: "",
    format: "jpg",
    quality: "0",
    requestId: 0,
  };

  let previewModalState = { ...initialPreviewState };
  let reactAppRoot = null;
  let reactAppRootContainer = null;
  let reactMountContainer = null;
  let reactContentContainer = null;
  let antdModalContainer = null;
  let reactAntdPromise = null;
  let ReactGlobal = runtimeWindow.React || null;
  let ReactDOMGlobal = runtimeWindow.ReactDOM || null;
  let antdGlobal = runtimeWindow.antd || null;
  let enhancementsActivated = false;
  let requestObserver = null;
  let observerAttachRequested = false;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[data-tamper-src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.tamperSrc = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  function ensureAntdStyles() {
    if (!document.querySelector('link[data-tamper="antd-css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CDN_ANTD_CSS;
      link.dataset.tamper = "antd-css";
      (document.head || document.documentElement).appendChild(link);
    }
  }

  // 确保 React 和 Ant Design 已加载
  async function ensureReactAntd() {
    if (ReactGlobal && ReactDOMGlobal && antdGlobal) {
      ensureAntdStyles();
      return;
    }

    if (!reactAntdPromise) {
      reactAntdPromise = (async () => {
        if (!ReactGlobal) {
          await loadScript(CDN_REACT);
        }
        if (!ReactDOMGlobal) {
          await loadScript(CDN_REACT_DOM);
        }
        if (!runtimeWindow.dayjs) {
          await loadScript(CDN_DAYJS);
        }
        if (!antdGlobal) {
          await loadScript(CDN_ANTD_JS);
        }
        ReactGlobal = runtimeWindow.React || ReactGlobal;
        ReactDOMGlobal = runtimeWindow.ReactDOM || ReactDOMGlobal;
        antdGlobal = runtimeWindow.antd || antdGlobal;
        if (!ReactGlobal || !ReactDOMGlobal || !antdGlobal) {
          throw new Error("React 或 Ant Design 加载失败");
        }
        ensureAntdStyles();
      })().catch((error) => {
        reactAntdPromise = null;
        console.error(error)
        throw error;
      });
    }

    return reactAntdPromise;
  }

  // 确保 React 应用的挂载点和根节点
  function ensureReactApp() {
    ensureAntdStyles();
    ReactGlobal = ReactGlobal || runtimeWindow.React;
    ReactDOMGlobal = ReactDOMGlobal || runtimeWindow.ReactDOM;
    antdGlobal = antdGlobal || runtimeWindow.antd;

    if (!document.body) {
      return false;
    }

    if (!reactMountContainer || !document.body.contains(reactMountContainer)) {
      reactMountContainer = document.querySelector(`.${APP_CONTAINER_CLASS}`);
      if (!reactMountContainer) {
        reactMountContainer = document.createElement("div");
        reactMountContainer.className = APP_CONTAINER_CLASS;
        document.body.appendChild(reactMountContainer);
      }
    }

    if (
      !reactContentContainer ||
      !reactMountContainer.contains(reactContentContainer)
    ) {
      reactContentContainer = reactMountContainer.querySelector(
        `.${APP_REACT_ROOT_CLASS}`
      );
      if (!reactContentContainer) {
        reactContentContainer = document.createElement("div");
        reactContentContainer.className = APP_REACT_ROOT_CLASS;
        reactMountContainer.appendChild(reactContentContainer);
      }
    }

    if (
      !antdModalContainer ||
      !reactMountContainer.contains(antdModalContainer)
    ) {
      antdModalContainer = reactMountContainer.querySelector(
        `.${APP_MODAL_CONTAINER_CLASS}`
      );
      if (!antdModalContainer) {
        antdModalContainer = document.createElement("div");
        antdModalContainer.className = APP_MODAL_CONTAINER_CLASS;
        reactMountContainer.appendChild(antdModalContainer);
      }
    }

    if (!ReactDOMGlobal) {
      return false;
    }

    const needsNewRoot =
      !reactAppRoot ||
      !reactAppRootContainer ||
      reactAppRootContainer !== reactContentContainer;
    if (needsNewRoot) {
      if (reactAppRoot && typeof reactAppRoot.unmount === "function") {
        try {
          reactAppRoot.unmount();
        } catch (error) {
          console.warn("卸载旧的 React 根节点失败", error);
        }
      } else if (
        reactAppRootContainer &&
        ReactDOMGlobal &&
        typeof ReactDOMGlobal.unmountComponentAtNode === "function"
      ) {
        try {
          ReactDOMGlobal.unmountComponentAtNode(reactAppRootContainer);
        } catch (error) {
          console.warn("卸载旧的 React 容器失败", error);
        }
      }

      if (typeof ReactDOMGlobal.createRoot === "function") {
        reactAppRoot = ReactDOMGlobal.createRoot(reactContentContainer);
      } else if (typeof ReactDOMGlobal.render === "function") {
        reactAppRoot = {
          render: (node) => ReactDOMGlobal.render(node, reactContentContainer),
        };
      } else {
        reactAppRoot = null;
      }
      reactAppRootContainer = reactContentContainer;
    }

    return Boolean(reactAppRoot && reactContentContainer && antdModalContainer);
  }

  function setPreviewState(partial, options = {}) {
    const { replace = false, bumpRequestId = false } = options;
    const baseState = replace ? initialPreviewState : previewModalState;
    const nextState = { ...baseState, ...partial };
    nextState.requestId = bumpRequestId
      ? previewModalState.requestId + 1
      : previewModalState.requestId;
    previewModalState = nextState;
    if (reactAppRoot && reactContentContainer && antdModalContainer) {
      renderReactApp();
    }
  }

  function PreviewApp({ state, onApply, onClose, modalContainer }) {
    const ReactLib = ReactGlobal || runtimeWindow.React;
    const antdLib = antdGlobal || runtimeWindow.antd;
    if (!ReactLib || !antdLib) {
      return null;
    }

    const { createElement, useCallback, useEffect, useState } = ReactLib;
    const {
      Form,
      Modal,
      InputNumber,
      Select,
      Slider,
      Row,
      Col,
      Typography,
      Button,
      Tabs,
    } = antdLib;
    const [form] = Form.useForm();
    const [dealUrl, setDealUrl] = useState("");
    // 原始图片信息
    const [originInfo, setOriginInfo] = useState({});
    // 处理后图片信息
    const [newImageInfo, setNewImageInfo] = useState({});

    // 当前激活的Tab
    const [activeKey, setActiveKey] = useState("preview");

    const defaultFormat = state.sourceUrl.split(".").pop().toLowerCase();

    useEffect(() => {
      if (!state.visible) {
        return;
      }
      const parseNumeric = (value) => {
        if (value === "" || value === null || value === undefined) {
          return undefined;
        }
        const numeric = Number.parseInt(value, 10);
        return Number.isNaN(numeric) ? undefined : numeric;
      };
      const widthValue = parseNumeric(state.width);
      const heightValue = parseNumeric(state.height);
      const qualityValue = parseNumeric(state.quality);
      form.setFieldsValue({
        width: widthValue,
        height: heightValue,
        format: state.format || "jpg",
        quality: qualityValue ?? 0,
      });
    }, [
      state.visible,
      state.requestId,
      state.width,
      state.height,
      state.format,
      state.quality,
      form,
    ]);

    useEffect(() => {
      if (!state.visible) {
        form.resetFields();
      }
      // 设置format 默认值
      setPreviewState({
        format: state.previewSrc.split(".").pop().toLowerCase(),
        quality: 0,
      });
    }, [state.visible, form]);

    const handleFinish = useCallback(
      (values) => {
        onApply({
          width: typeof values.width === "number" ? values.width : undefined,
          height: typeof values.height === "number" ? values.height : undefined,
          quality:
            typeof values.quality === "number" ? values.quality : undefined,
          format: values.format,
        });
      },
      [onApply]
    );

    const handleDealUrl = useCallback(() => {
      const getUrl = transformUrl(
        state.previewSrc,
        form.getFieldValue("width") || 0,
        form.getFieldValue("height") || 0,
        form.getFieldValue("quality") || 0,
        form.getFieldValue("format") || ""
      );
      setDealUrl(getUrl);
      if (state.previewSrc === getUrl) {
        return;
      }
      setActiveKey("dealed");
    }, [state.previewSrc, state.visible]);

    const formatOptions = ["png", "jpeg", "jpg", "webp", "gif", "bmp"].map(
      (value) => ({
        label: value,
        value,
      })
    );

    const formElement = createElement(
      Form,
      {
        form,
        layout: "vertical",
        autoComplete: "off",
        onFinish: handleFinish,
        initValues: {
          quality: 0,
          ...state,
        },
      },
      createElement(
        Row,
        { gutter: 12 },
        createElement(
          Col,
          { span: 8 },
          createElement(
            Form.Item,
            { label: "图片请求宽度", name: "width" },
            createElement(InputNumber, { min: 0, style: { width: "100%" } })
          )
        ),
        createElement(
          Col,
          { span: 8 },
          createElement(
            Form.Item,
            { label: "图片请求高度", name: "height" },
            createElement(InputNumber, { min: 0, style: { width: "100%" } })
          )
        ),
        createElement(
          Col,
          { span: 8 },
          createElement(
            Form.Item,
            { label: "图片格式", name: "format" },
            createElement(Select, {
              options: formatOptions,
              allowClear: false,
              defaultValue: defaultFormat,
            })
          )
        )
      ),
      createElement(
        Form.Item,
        { label: "图片质量", name: "quality" },
        createElement(Slider, { min: 0, max: 100, defaultValue: 0 })
      ),
      // 提交按钮
      createElement(
        Form.Item,
        {
          onClick: handleDealUrl,
        },
        createElement(Button, {}, "确认预览")
      )
    );

    const linkSection = createElement(
      Typography.Paragraph,
      {
        style: {
          wordBreak: "break-all",
          marginBottom: 16,
        },
      },
      createElement(Typography.Text, { type: "secondary" }, "资源链接："),
      createElement("br"),
      createElement(
        Typography.Link,
        {
          href: state.sourceUrl,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        state.sourceUrl
      )
    );

    const tabItems = [
      {
        key: "preview",
        label: "图片预览",
        children: createElement(ImageViewer, {
          key: state.previewSrc,
          src: state.previewSrc,
          onLoad: (data) => {
            setOriginInfo({ ...data });
          },
          isOrigin: true,
        }),
      },
    ];

    if (dealUrl !== "") {
      tabItems.push({
        key: "dealed",
        label: "数据万象预览",
        children: createElement(ImageViewer, {
          key: "dealed",
          src: dealUrl,
          onLoad: (data) => {
            setNewImageInfo({ ...data });
          },
          isOrigin: false,
        }),
      });
    }

    return createElement(
      Modal,
      {
        open: state.visible,
        title: "图片资源预览",
        onCancel: () => {
          onClose();
          setDealUrl("");
          setOriginInfo({});
          setNewImageInfo({});
          setActiveKey("preview");
        },
        onOk: () => form.submit(),
        okText: "确认",
        cancelText: "关闭",
        maskClosable: true,
        getContainer: () => modalContainer,
        width: 720,
      },
      createElement(
        ReactLib.Fragment,
        null,
        linkSection,
        formElement,
        createElement(Tabs, {
          onTabClick: (key) => setActiveKey(key),
          defaultActiveKey: state.sourceUrl,
          activeKey: activeKey,
          items: tabItems,
        })
      )
    );
  }
  // 图片预览组件，底部显示图片信息
  function ImageViewer({ src, onLoad, onError, isOrigin }) {
    const ReactLib = ReactGlobal || runtimeWindow.React;
    const antdLib = antdGlobal || runtimeWindow.antd;
    if (!ReactLib || !antdLib) {
      return null;
    }
    const { createElement, useCallback, useEffect, useState, useMemo } =
      ReactLib;
    const [infoText, setInfoText] = useState("图片加载中...");
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [reloadIndex, setReloadIndex] = useState(0);
    const [blobUrl, setBlobUrl] = useState("");
    const [fetchData, setFetchData] = useState(null);
    const [naturalSize, setNaturalSize] = useState([0, 0]);
    const { Typography, Empty, Image, Spin, Button, Space } = antdLib;

    const handleRefresh = useCallback(() => {
      setReloadIndex((index) => index + 1);
    }, []);

    // 监听数据变化，统一更新底部信息
    useEffect(() => {
      if (hasError) return;
      const sizeText =
        naturalSize[0] > 0
          ? `尺寸：${naturalSize[0]} x ${naturalSize[1]}`
          : "尺寸：读取中...";
      const bytesText = fetchData
        ? `，大小：${formatBytes(fetchData.size)}`
        : "，大小：读取中...";
      const timeText = fetchData
        ? `，耗时：${formatTime(fetchData.duration)}`
        : "";

      setInfoText(`${sizeText}${bytesText}${timeText}`);
    }, [fetchData, naturalSize, hasError]);

    useEffect(() => {
      let isMounted = true;
      let currentBlobUrl = "";

      const loadImageData = async () => {
        setLoading(true);
        setHasError(false);
        setFetchData(null);
        setNaturalSize([0, 0]);
        setBlobUrl("");
        setInfoText("正在发起网络请求...");
        const startTime = performance.now();

        try {
          if (typeof GM_xmlhttpRequest !== "undefined") {
            GM_xmlhttpRequest({
              method: "GET",
              url: src,
              responseType: "arraybuffer",
              timeout: 15000,
              onload: (response) => {
                if (!isMounted) return;
                if (response.status >= 200 && response.status < 300) {
                  const contentType =
                    response.responseHeaders.match(/content-type:\s*(.*)/i)?.[1] ||
                    "image/png";
                  const blob = new Blob([response.response], {
                    type: contentType,
                  });
                  const endTime = performance.now();
                  currentBlobUrl = URL.createObjectURL(blob);
                  setBlobUrl(currentBlobUrl);
                  setFetchData({
                    size: blob.size,
                    duration: endTime - startTime,
                  });
                } else {
                  setHasError(true);
                  setLoading(false);
                  setInfoText(`请求失败 (HTTP ${response.status})`);
                }
              },
              onerror: (err) => {
                if (!isMounted) return;
                setHasError(true);
                setLoading(false);
                setInfoText("网络请求错误");
              },
              ontimeout: () => {
                if (!isMounted) return;
                setHasError(true);
                setLoading(false);
                setInfoText("请求超时");
              },
            });
          } else {
            const response = await fetch(src);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            const endTime = performance.now();

            if (!isMounted) return;
            currentBlobUrl = URL.createObjectURL(blob);
            setBlobUrl(currentBlobUrl);
            setFetchData({
              size: blob.size,
              duration: endTime - startTime,
            });
          }
        } catch (error) {
          if (isMounted) {
            setHasError(true);
            setLoading(false);
            setInfoText(`加载异常: ${error.message}`);
          }
        }
      };

      loadImageData();

      return () => {
        isMounted = false;
        if (currentBlobUrl) {
          URL.revokeObjectURL(currentBlobUrl);
        }
      };
    }, [src, reloadIndex]);

    const handleImageLoad = useCallback(
      (event) => {
        const { naturalWidth, naturalHeight } = event.target;
        setNaturalSize([naturalWidth, naturalHeight]);
        setLoading(false);

        if (onLoad && fetchData) {
          onLoad({
            size: [naturalWidth, naturalHeight],
            bytes: fetchData.size,
            url: src,
            time: fetchData.duration,
          });
        }
      },
      [src, onLoad, fetchData]
    );

    const handleImageError = useCallback(
      (error) => {
        setHasError(true);
        setLoading(false);
        setInfoText("图片解析失败");
        if (onError) onError(error);
      },
      [onError]
    );

    const imageKey = useMemo(() => `${src}-${reloadIndex}`, [src, reloadIndex]);

    const imageContent = hasError
      ? createElement(Empty, { description: infoText })
      : blobUrl
      ? createElement(Image, {
          key: imageKey,
          src: blobUrl,
          alt: "预览图",
          style: { maxWidth: "100%", height: "auto" },
          onLoad: handleImageLoad,
          onError: handleImageError,
        })
      : null;

    const previewContainer = createElement(
      "div",
      {
        style: {
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          padding: 12,
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
      imageContent
    );

    const previewSection = createElement(
      "div",
      { style: { marginTop: 16 } },
      createElement(Spin, { spinning: loading }, previewContainer)
    );

    const infoSection = createElement(
      "div",
      { style: { marginTop: 12 } },
      createElement(
        Typography.Text,
        { type: hasError ? "danger" : undefined },
        infoText
      )
    );

    const linkSection = createElement(
      Typography.Paragraph,
      {
        style: {
          wordBreak: "break-all",
          marginBottom: 16,
        },
      },
      createElement(Typography.Text, { type: "secondary" }, "请求图片链接："),
      createElement("br"),
      createElement(
        Typography.Link,
        {
          href: src,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        src
      ),
      createElement(
        Button,
        {
          type: "text",
          size: "small",
          onClick: copyToClipboard.bind(null, src),
        },
        "复制链接"
      )
    );

    const actionSection = createElement(
      "div",
      { style: { marginBottom: 8 } },
      createElement(
        Space,
        null,
        createElement(
          Button,
          {
            size: "small",
            onClick: handleRefresh,
            disabled: loading,
          },
          "刷新预览"
        )
      )
    );

    return createElement(
      ReactLib.Fragment,
      null,
      linkSection,
      actionSection,
      previewSection,
      infoSection
    );
  }

  // 处理图片URL，添加万象图片处理参数
  function transformUrl(sourceUrl, width, height, quality, format) {
    if (width > 0 || height > 0 || (quality > 0 && quality <= 100) || format) {
      let url = `${sourceUrl}?imageView2/2`;
      if (width > 0) {
        url += `/w/${width}`;
      }
      if (height > 0) {
        url += `/h/${height}`;
      }
      if (
        format &&
        sourceUrl.split(".").pop().toLowerCase() !== format.toLowerCase()
      ) {
        url += `/format/${format}`;
      }
      if (quality > 0 && quality <= 100) {
        url += `/q/${quality}`;
      }
      return url === sourceUrl ? sourceUrl : url + "|imageMogr2/ignore-error/1";
    } else {
      return sourceUrl;
    }
  }

  // 格式化时间为可读字符串
  function formatTime(ms) {
    if (ms === null || ms === undefined || Number.isNaN(ms)) return null;
    const value = Number(ms);
    if (!isFinite(value)) return null;
    if (value < 1000) return `${value.toFixed(0)} ms`;
    const s = value / 1000;
    if (s < 10) return `${s.toFixed(2)} s`;
    if (s < 100) return `${s.toFixed(1)} s`;
    return `${s.toFixed(0)} s`;
  }

  // 渲染 React 应用
  function renderReactApp() {
    if (!reactAppRoot || !reactContentContainer || !antdModalContainer) {
      return;
    }

    const ReactLib = ReactGlobal || runtimeWindow.React;
    const antdLib = antdGlobal || runtimeWindow.antd;
    if (!ReactLib || !antdLib) {
      console.error("React 或 Ant Design 尚未准备就绪");
      return;
    }

    const handleModalApply = (values) => {
      const nextUrl = transformUrl(
        previewModalState.sourceUrl,
        values.width || 0,
        values.height || 0,
        values.quality || 0,
        values.format || ""
      );

      const widthValue =
        typeof values.width === "number" && !Number.isNaN(values.width)
          ? String(values.width)
          : "";
      const heightValue =
        typeof values.height === "number" && !Number.isNaN(values.height)
          ? String(values.height)
          : "";
      const qualityValue =
        typeof values.quality === "number" && !Number.isNaN(values.quality)
          ? String(values.quality)
          : "0";
      const formatValue = values.format || "jpg";

      if (previewModalState.previewSrc === nextUrl) {
        setPreviewState({
          width: widthValue,
          height: heightValue,
          quality: qualityValue,
          format: formatValue,
        });
        return;
      }

      setPreviewState(
        {
          previewSrc: nextUrl,
          width: widthValue,
          height: heightValue,
          quality: qualityValue,
          format: formatValue,
        },
        { bumpRequestId: true }
      );
    };

    const handleModalClose = () => {
      setPreviewState({ visible: false });
    };

    const appElement = ReactLib.createElement(
      antdLib.ConfigProvider,
      {
        getPopupContainer: () => antdModalContainer,
      },
      ReactLib.createElement(PreviewApp, {
        state: previewModalState,
        onApply: handleModalApply,
        onClose: handleModalClose,
        modalContainer: antdModalContainer,
      })
    );

    if (typeof reactAppRoot.render === "function") {
      reactAppRoot.render(appElement);
    }
  }

  // 创建复制按钮
  function createCopyButton(text) {
    const button = document.createElement("button");
    button.className = config.buttonClass;
    const btnSpan = document.createElement("span");
    btnSpan.textContent = text;
    button.appendChild(btnSpan);

    return button;
  }

  // 创建预览按钮
  function createPreviewButton(text) {
    const button = document.createElement("button");
    button.className = config.previewButtonClass;
    const btnSpan = document.createElement("span");
    btnSpan.textContent = text;
    button.appendChild(btnSpan);

    return button;
  }

  // 获取目标文本
  function getTargetText(row) {
    const textCell = row.querySelector(config.textSelector);
    if (textCell) {
      return textCell.textContent.trim();
    }
    const cells = row.querySelectorAll("td, th");
    if (config.targetColumn > 0 && cells.length >= config.targetColumn) {
      return cells[config.targetColumn - 1].textContent.trim();
    }
    return "";
  }

  // 显示通知消息
  function inferNotificationType(message, explicitType) {
    if (explicitType) {
      return explicitType;
    }
    if (typeof message === "string") {
      if (/失败|错误|无法|未找到|异常/i.test(message)) {
        return "error";
      }
    }
    return "success";
  }

  function showNotification(message, options) {
    const normalizedOptions =
      typeof options === "string" ? { type: options } : options || {};
    const {
      type: explicitType,
      title,
      duration = 2000,
    } = normalizedOptions;
    const type = inferNotificationType(message, explicitType);
    const isError = type === "error";
    const fallbackTitle = isError ? "操作失败" : "操作成功";
    const toastClass = `tamper-toast${isError ? " error" : ""}`;

    if (typeof GM_notification === "function") {
      try {
        GM_notification({
          text: message,
          title: title || fallbackTitle,
          timeout: duration,
        });
      } catch (err) {
        console.error("GM_notification 调用失败:", err);
      }
    }

    const notification = document.createElement("div");
    notification.className = toastClass;
    notification.textContent = message;
    (document.body || document.documentElement).appendChild(notification);
    setTimeout(() => {
      notification.classList.add("hide");
      setTimeout(() => notification.remove(), 300);
    }, Math.max(0, duration));
  }

  // 复制文本到剪贴板
  function copyToClipboard(text) {
    if (typeof GM_setClipboard !== "undefined") {
      GM_setClipboard(text, "text");
      showNotification("已复制: " + text);
    } else {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showNotification("已复制: " + text);
        })
        .catch((err) => {
          console.error("复制失败:", err);
          showNotification("复制失败，请手动复制");
        });
    }
  }

  // 格式化字节数为可读字符串
  function formatBytes(bytes) {
    if (!bytes || Number.isNaN(bytes)) {
      return null;
    }
    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    const fixed = value.toFixed(2);
    return `${fixed} ${units[index]}`;
  }

  // 展示资源预览弹窗
  async function showPreviewModal(url) {
    if (!url) {
      showNotification("未找到可预览的资源");
      return;
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      showNotification("未找到可预览的资源");
      return;
    }

    try {
      await ensureReactAntd();
    } catch (error) {
      console.error("React/Ant Design 资源加载失败:", error);
      showNotification("预览组件加载失败，请稍后重试");
      return;
    }
    const ready = ensureReactApp();
    if (!ready) {
      console.error("React 渲染容器初始化失败", {
        hasReact: Boolean(ReactGlobal),
        hasReactDOM: Boolean(ReactDOMGlobal),
        hasAntd: Boolean(antdGlobal),
        containers: {
          mount: Boolean(reactMountContainer),
          content: Boolean(reactContentContainer),
          modal: Boolean(antdModalContainer),
        },
      });
      showNotification("预览组件初始化失败");
      return;
    }
    setPreviewState(
      {
        visible: true,
        sourceUrl: trimmedUrl,
        previewSrc: trimmedUrl,
        width: "",
        height: "",
        format: "jpg",
        quality: "100",
      },
      { replace: true, bumpRequestId: true }
    );
  }

  // 处理表格行
  function processTableRows(table) {
    const rows = table.querySelectorAll(config.rowSelector);

    let dataRowCount = 0;
    let mutationCount = 0;

    rows.forEach((row) => {
      if (row.querySelector("th") && config.targetColumn > 0) {
        return;
      }

      const targetText = getTargetText(row);
      if (!targetText) {
        return;
      }

      dataRowCount += 1;

      const lastCell =
        row.querySelector(config.insetSelector) || row.lastElementChild;
      if (!lastCell) {
        return;
      }

      let copyButton = lastCell.querySelector(".copy-btn");
      if (copyButton) {
        copyButton.remove();
      }
      copyButton = createCopyButton(config.buttonText);
      copyButton.addEventListener("click", (event) => {
        event.stopPropagation();
        copyToClipboard(getTargetText(row));
      });
      lastCell.appendChild(copyButton);

      let previewButton = lastCell.querySelector(".preview-btn");
      if (previewButton) {
        previewButton.remove();
      }
      previewButton = createPreviewButton(config.previewButtonText);
      previewButton.addEventListener("click", (event) => {
        event.stopPropagation();
        showPreviewModal(getTargetText(row));
      });
      lastCell.appendChild(previewButton);
    });

    return { dataRowCount, mutationCount };
  }

  // 主函数：查找并处理表格
  function main() {
    if (!isTargetRoute()) {
      return false;
    }
    const tables = document.querySelectorAll(config.tableSelector);

    if (tables.length === 0) {
      return false;
    }

    let totalRows = 0;

    tables.forEach((table) => {
      const { dataRowCount } = processTableRows(table);
      totalRows += dataRowCount;
    });

    return totalRows > 0;
  }

  function requestObserverAttach() {
    if (observerAttachRequested) {
      return;
    }
    observerAttachRequested = true;
    if (requestObserver) {
      requestObserver.disconnect();
      requestObserver = null;
    }
    requestObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // 过滤出 fetch 和 XMLHttpRequest 请求
        if (
          entry.initiatorType === "fetch" ||
          entry.initiatorType === "xmlhttprequest"
        ) {
          if (entry.name === config.monitorUrl) {
            main();
          }
        }
      });
    });

    requestObserver.observe({ entryTypes: ["resource"] });
  }

  function activateEnhancements() {
    if (!enhancementsActivated) {
      requestObserverAttach();
      enhancementsActivated = true;
    }

    main();
  }

  // 预先加载 React/AntD 资源，减少首次使用等待时间
  void ensureReactAntd().catch((error) => {
    console.warn("React/AntD 资源预加载失败:", error);
  });

  // 处理路由变化,运行主逻辑
  function handleRouteChange() {
    activateEnhancements();
  }

  handleRouteChange();
  window.addEventListener("hashchange", handleRouteChange);
})();
