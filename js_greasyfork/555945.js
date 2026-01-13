// ==UserScript==
// @name         X(Twitter) Downloader
// @name:zh-CN   X（Twitter）下载器
// @author       mengshouer
// @version      1.0.7
// @description  For X(Twitter) add download buttons for images and videos. Settings available by hovering mouse to the bottom left corner or via Tampermonkey menu.
// @description:zh-CN  为 X(Twitter) 的图片和视频添加下载按钮。鼠标移入浏览器左下角或油猴菜单可打开设置。
// @include      *://twitter.com/*
// @include      *://*.twitter.com/*
// @include      *://x.com/*
// @include      *://*.x.com/*
// @license      GPL-3.0 License
// @namespace    https://github.com/mengshouer/UserScripts
// @grant        GM_registerMenuCommand
// @require     https://cdn.jsdelivr.net/npm/preact@10.28.2/dist/preact.umd.js
// @require     https://cdn.jsdelivr.net/npm/goober@2.1.18/dist/goober.umd.js
// @require     https://cdn.jsdelivr.net/npm/preact@10.28.2/jsx-runtime/dist/jsxRuntime.umd.js
// @require     https://cdn.jsdelivr.net/npm/preact@10.28.2/hooks/dist/hooks.umd.js
// @require     https://cdn.jsdelivr.net/npm/@preact/signals-core@1.12.1/dist/signals-core.min.js
// @downloadURL https://update.greasyfork.org/scripts/555945/X%28Twitter%29%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/555945/X%28Twitter%29%20Downloader.meta.js
// ==/UserScript==

(function(jsxRuntime2, preact2, hooks, goober2, signalsCore) {
  "use strict";
  const STORAGE_KEY$1 = "m-userscript-settings";
  const OPEN_SETTINGS_EVENT = "m-open-settings-panel";
  class StorageManager {
    constructor(storageKey, defaultSettings) {
      this.storageKey = storageKey;
      this.defaultSettings = defaultSettings;
    }
    /**
     * 加载设置
     */
    loadSettings() {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...this.defaultSettings, ...parsed };
        }
      } catch (error2) {
        /* @__PURE__ */ console.debug("Failed to load settings:", error2);
      }
      return { ...this.defaultSettings };
    }
    /**
     * 保存设置
     */
    saveSettings(newSettings) {
      const currentSettings = this.loadSettings();
      const updatedSettings = { ...currentSettings, ...newSettings };
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
      } catch (error2) {
        /* @__PURE__ */ console.debug("Failed to save settings:", error2);
      }
      return updatedSettings;
    }
    /**
     * 重置为默认设置
     */
    resetSettings() {
      try {
        localStorage.removeItem(this.storageKey);
      } catch (error2) {
        /* @__PURE__ */ console.debug("Failed to reset settings:", error2);
      }
      return { ...this.defaultSettings };
    }
  }
  function formatPositionValue$1(value) {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
      return `${trimmed}px`;
    }
    return trimmed;
  }
  function preventEventPropagation(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  let downloadCount = 0;
  const beforeUnloadHandler = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  const downloadGuard = {
    add: () => {
      if (downloadCount === 0) {
        window.addEventListener("beforeunload", beforeUnloadHandler);
      }
      downloadCount++;
    },
    remove: () => {
      downloadCount--;
      if (downloadCount <= 0) {
        downloadCount = 0;
        window.removeEventListener("beforeunload", beforeUnloadHandler);
      }
    }
  };
  async function downloadFile(url, fileName) {
    downloadGuard.add();
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error2) {
      console.error(`Download failed: ${fileName}`, error2);
      throw error2;
    } finally {
      downloadGuard.remove();
    }
  }
  async function gmDownloadFile(url, fileName, options) {
    downloadGuard.add();
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType: "blob",
        ...options?.headers && { headers: options.headers },
        onload: (response) => {
          try {
            const blob = response.response;
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = fileName;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(blobUrl);
            }, 100);
            resolve();
          } catch (error2) {
            reject(error2);
          } finally {
            downloadGuard.remove();
          }
        },
        onerror: (error2) => {
          downloadGuard.remove();
          reject(error2);
        }
      });
    });
  }
  function extractFileInfo(src) {
    const picname = src.split("?")[0]?.split("/").pop() || "";
    const ext = src.includes("format=png") ? "png" : "jpg";
    return { picname, ext };
  }
  function generateFileName(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`<%${key}>`, "g"), value || "");
    }
    return result;
  }
  function extractUrlInfo(url) {
    const urlRegex = /https:\/\/(twitter|x)\.com\//;
    const array = url.replace(urlRegex, "").split("/");
    return {
      userid: array[0] || "unknown",
      tid: array[2] || "unknown",
      picno: array[4] || "1"
    };
  }
  goober2.setup(preact2.h);
  const MessageContainer = goober2.styled("div")`
  position: relative;
  min-width: 250px;
  max-width: 400px;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  color: #fff;

  &.message-success {
    --msg-color: 34, 197, 94;
  }

  &.message-error {
    --msg-color: 239, 68, 68;
  }

  &.message-warning {
    --msg-color: 245, 158, 11;
  }

  &.message-info {
    --msg-color: 59, 130, 246;
  }

  &[class*="message-"] {
    background-color: rgba(var(--msg-color), 0.4);
    border: 1px solid rgba(var(--msg-color), 0.7);
  }
`;
  const CloseIcon = goober2.styled("span")`
  float: right;
  margin-left: 8px;
  font-weight: bold;
  opacity: 0.7;
  font-size: 16px;
  line-height: 1;

  &:hover {
    opacity: 1;
  }
`;
  function Message({
    type = "info",
    content,
    duration = 3e3,
    onClose,
    onClick,
    className,
    style
  }) {
    const timerRef = hooks.useRef(null);
    const startTimeRef = hooks.useRef(0);
    const remainingTimeRef = hooks.useRef(duration);
    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    const startTimer = (time) => {
      clearTimer();
      if (time > 0) {
        startTimeRef.current = Date.now();
        timerRef.current = window.setTimeout(() => {
          onClose?.();
        }, time);
      }
    };
    const pauseTimer = () => {
      if (timerRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
        clearTimer();
      }
    };
    const resumeTimer = () => {
      if (remainingTimeRef.current > 0) {
        startTimer(remainingTimeRef.current);
      }
    };
    hooks.useEffect(() => {
      if (duration > 0) {
        remainingTimeRef.current = duration;
        startTimer(duration);
      }
      return clearTimer;
    }, [duration, onClose]);
    return /* @__PURE__ */ jsxRuntime2.jsxs(
      MessageContainer,
      {
        className: `message-${type} ${className || ""}`,
        style,
        onClick: () => {
          onClick?.();
          onClose?.();
        },
        onMouseEnter: pauseTimer,
        onMouseLeave: resumeTimer,
        children: [
          content,
          /* @__PURE__ */ jsxRuntime2.jsx(CloseIcon, { children: "×" })
        ]
      }
    );
  }
  const getUserMessagePlacement = () => {
    try {
      const settings = JSON.parse(localStorage.getItem(STORAGE_KEY$1) || "{}");
      return settings.messagePlacement || "top";
    } catch {
      return "top";
    }
  };
  const containers = /* @__PURE__ */ new Map();
  let messageCount = 0;
  const getPositionStyle = (placement) => {
    const [vertical, horizontal] = placement.split("-");
    const isBottom = vertical === "bottom";
    const direction = isBottom ? "column-reverse" : "column";
    let position = `${vertical}: 20px; display: flex; flex-direction: ${direction};`;
    if (horizontal) {
      position += ` ${horizontal}: 20px;`;
    } else {
      position += " left: 50%; transform: translateX(-50%);";
    }
    return position;
  };
  const getContainer = (placement = "top") => {
    if (!containers.has(placement)) {
      const container = document.createElement("div");
      container.id = `userscript-message-container-${placement}`;
      container.style.cssText = `
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      ${getPositionStyle(placement)}
    `;
      document.body.appendChild(container);
      containers.set(placement, container);
    }
    return containers.get(placement);
  };
  const show = (config) => {
    const placement = config.placement || "top";
    const container = getContainer(placement);
    const messageId = `userscript-message-${++messageCount}`;
    const messageElement = document.createElement("div");
    messageElement.id = messageId;
    const isBottom = placement.startsWith("bottom");
    messageElement.style.cssText = `
    position: relative;
    margin-bottom: 8px;
    pointer-events: auto;
    animation: ${isBottom ? "messageSlideInBottom" : "messageSlideIn"} 0.3s ease-out;
  `;
    container.appendChild(messageElement);
    const onClose = () => {
      if (messageElement.parentNode) {
        const isBottom2 = placement.startsWith("bottom");
        messageElement.style.animation = `${isBottom2 ? "messageSlideOutBottom" : "messageSlideOut"} 0.3s ease-in forwards`;
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
          }
        }, 300);
      }
    };
    preact2.render(preact2.h(Message, { ...config, onClose }), messageElement);
    return onClose;
  };
  const createMessageMethod = (type) => (content, duration, placement, onClick) => show({
    type,
    content,
    placement: placement || getUserMessagePlacement(),
    ...onClick && { onClick },
    ...duration !== void 0 && { duration }
  });
  const success = createMessageMethod("success");
  const error = createMessageMethod("error");
  const warning = createMessageMethod("warning");
  const info = createMessageMethod("info");
  const destroy = () => {
    containers.forEach((container) => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
    containers.clear();
  };
  const message = { success, error, warning, info, destroy };
  const MESSAGE_STYLE_ID = "userscript-message-styles";
  if (!document.getElementById(MESSAGE_STYLE_ID)) {
    const style = document.createElement("style");
    style.id = MESSAGE_STYLE_ID;
    style.textContent = `
  @keyframes messageSlideIn {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes messageSlideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }

  @keyframes messageSlideInBottom {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes messageSlideOutBottom {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
`;
    document.head.appendChild(style);
  }
  const DEFAULT_LOCALE = "en";
  const STORAGE_KEY = "userscript-locale";
  let currentLocale = DEFAULT_LOCALE;
  const translations = {};
  const listeners = [];
  const detectBrowserLocale = () => navigator?.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
  try {
    currentLocale = localStorage.getItem(STORAGE_KEY) || detectBrowserLocale();
  } catch {
    currentLocale = detectBrowserLocale();
  }
  const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] !== null && typeof source[key] === "object" && !Array.isArray(source[key]) && target[key] !== null && typeof target[key] === "object" && !Array.isArray(target[key])) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };
  const getNestedValue = (obj, path) => {
    let result = obj;
    for (const key of path.split(".")) {
      result = result?.[key];
      if (!result) return void 0;
    }
    return typeof result === "string" ? result : void 0;
  };
  const interpolate = (template, params) => {
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? "{" + key + "}");
  };
  function t(keyOrOptions, params) {
    const key = typeof keyOrOptions === "string" ? keyOrOptions : keyOrOptions.key;
    const actualParams = typeof keyOrOptions === "string" ? params : keyOrOptions.params;
    const text = getNestedValue(translations[currentLocale], key) || getNestedValue(translations[DEFAULT_LOCALE], key) || key;
    return interpolate(text, actualParams);
  }
  const i18n = {
    addTranslations(locale, data) {
      translations[locale] = deepMerge(translations[locale] || {}, data);
    },
    setLocale(locale) {
      if (currentLocale !== locale) {
        currentLocale = locale;
        try {
          localStorage.setItem(STORAGE_KEY, locale);
        } catch {
        }
        listeners.forEach((callback) => callback());
      }
    },
    getLocale() {
      return currentLocale;
    },
    t,
    subscribe(callback) {
      listeners.push(callback);
      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      };
    }
  };
  function useI18n() {
    const [locale, setLocaleState] = hooks.useState(i18n.getLocale());
    hooks.useEffect(() => {
      const unsubscribe = i18n.subscribe(() => {
        setLocaleState(i18n.getLocale());
      });
      return unsubscribe;
    }, []);
    const setLocale = (newLocale) => i18n.setLocale(newLocale);
    return { t: i18n.t, locale, setLocale };
  }
  async function copyToClipboard(text) {
    try {
      let successful = false;
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        successful = true;
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        successful = document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      if (successful) {
        message.success(i18n.t("ui.copied"));
      } else {
        message.error(i18n.t("ui.copyFailed"));
      }
      return successful;
    } catch (error2) {
      console.error("Failed to copy to clipboard:", error2);
      message.error(i18n.t("ui.copyFailed"));
      return false;
    }
  }
  function getThemeConfig(isDark) {
    return {
      textColor: isDark ? "#e1e8ed" : "#333",
      backgroundColor: isDark ? "#1e1e1e" : "white",
      borderColor: isDark ? "#38444d" : "#ddd",
      secondaryTextColor: isDark ? "#8b98a5" : "#666",
      inputBackground: isDark ? "#253341" : "white",
      inputBorder: isDark ? "#38444d" : "#ddd",
      panelBackground: isDark ? "#1e1e1e" : "white"
    };
  }
  function useTheme() {
    const [isDark, setIsDark] = hooks.useState(
      () => window.matchMedia?.("(prefers-color-scheme: dark)").matches || false
    );
    hooks.useEffect(() => {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e) => setIsDark(e.matches);
      if (media.addEventListener) {
        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
      } else if (media.addListener) {
        media.addListener(handler);
        return () => media.removeListener?.(handler);
      }
      return void 0;
    }, []);
    return {
      theme: getThemeConfig(isDark),
      isDark
    };
  }
  const keySignals = /* @__PURE__ */ new Map();
  let globalEventListenersAttached = false;
  function getKeySignal(key) {
    if (!keySignals.has(key)) {
      const newSignal = signalsCore.signal(false);
      keySignals.set(key, newSignal);
      return newSignal;
    }
    return keySignals.get(key);
  }
  const handleKeyDown = (e) => {
    const keySignal = keySignals.get(e.key);
    if (keySignal && !keySignal.value) {
      keySignal.value = true;
    }
  };
  const handleKeyUp = (e) => {
    const keySignal = keySignals.get(e.key);
    if (keySignal && keySignal.value) {
      keySignal.value = false;
    }
  };
  const handleBlur = () => {
    keySignals.forEach((keySignal) => {
      if (keySignal.value) {
        keySignal.value = false;
      }
    });
  };
  function attachGlobalEventListeners() {
    if (!globalEventListenersAttached) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      window.addEventListener("blur", handleBlur);
      globalEventListenersAttached = true;
    }
  }
  function useGlobalKey(key) {
    const keySignal = getKeySignal(key);
    const [keyState, setKeyState] = hooks.useState(keySignal.value);
    hooks.useEffect(() => {
      attachGlobalEventListeners();
      const unsubscribe = keySignal.subscribe((value) => {
        setKeyState(value);
      });
      setKeyState(keySignal.value);
      return () => {
        unsubscribe();
      };
    }, [key, keySignal]);
    return keyState ?? false;
  }
  const StyledButton$2 = goober2.styled("button")`
  /* Base styles */
  border-radius: 6px;
  font-weight: 500;
  outline: none;
  border: none;
  cursor: var(--cursor);
  opacity: var(--opacity);

  /* Size variants */
  padding: var(--padding);
  font-size: var(--font-size);

  /* Color variants */
  background: var(--bg);
  color: var(--color);
  border: var(--border);
`;
  const buttonVariants = {
    primary: {
      "--bg": "#1da1f2",
      "--color": "white",
      "--border": "none"
    },
    secondary: (theme) => ({
      "--bg": theme.inputBackground,
      "--color": theme.textColor,
      "--border": `1px solid ${theme.borderColor}`
    }),
    danger: {
      "--bg": "#dc3545",
      "--color": "white",
      "--border": "none"
    }
  };
  const buttonSizes = {
    small: {
      "--padding": "6px 12px",
      "--font-size": "12px"
    },
    medium: {
      "--padding": "8px 16px",
      "--font-size": "14px"
    },
    large: {
      "--padding": "12px 24px",
      "--font-size": "16px"
    }
  };
  function Button({
    children,
    onClick,
    disabled = false,
    variant = "primary",
    size = "medium",
    className = "",
    style = {},
    type = "button"
  }) {
    const { theme } = useTheme();
    const variantStyles = (() => {
      const variantConfig = buttonVariants[variant];
      return typeof variantConfig === "function" ? variantConfig(theme) : variantConfig;
    })();
    const buttonStyle = {
      ...variantStyles,
      ...buttonSizes[size],
      "--cursor": disabled ? "not-allowed" : "pointer",
      "--opacity": disabled ? "0.6" : "1",
      ...style
    };
    return /* @__PURE__ */ jsxRuntime2.jsx(
      StyledButton$2,
      {
        className,
        style: buttonStyle,
        onClick,
        disabled,
        type,
        children
      }
    );
  }
  const Label = goober2.styled("label")`
  display: flex;
  align-items: center;
  cursor: var(--cursor);
  color: var(--text-color);
  opacity: var(--opacity);
`;
  const CheckboxInput = goober2.styled("input")`
  margin-right: 8px;
  accent-color: #1da1f2;
  cursor: var(--cursor);
`;
  function Checkbox({
    checked,
    defaultChecked,
    disabled = false,
    onChange,
    children,
    className = "",
    style = {}
  }) {
    const { theme } = useTheme();
    const checkboxStyle = {
      "--cursor": disabled ? "not-allowed" : "pointer",
      "--text-color": theme.textColor,
      "--opacity": disabled ? "0.6" : "1",
      ...style
    };
    return /* @__PURE__ */ jsxRuntime2.jsxs(Label, { className, style: checkboxStyle, children: [
      /* @__PURE__ */ jsxRuntime2.jsx(
        CheckboxInput,
        {
          type: "checkbox",
          checked,
          defaultChecked,
          disabled,
          onChange: (e) => onChange?.(e.currentTarget.checked),
          style: { "--cursor": disabled ? "not-allowed" : "pointer" }
        }
      ),
      children
    ] });
  }
  const StyledInput = goober2.styled("input")`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--input-text);
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #1da1f2;
  }
`;
  function Input({
    type = "text",
    value,
    defaultValue,
    placeholder,
    disabled = false,
    onChange,
    onBlur,
    onFocus,
    className = "",
    style = {}
  }) {
    const { theme } = useTheme();
    const inputStyle = {
      "--input-border": theme.inputBorder,
      "--input-bg": theme.inputBackground,
      "--input-text": theme.textColor,
      ...style
    };
    return /* @__PURE__ */ jsxRuntime2.jsx(
      StyledInput,
      {
        type,
        value,
        defaultValue,
        placeholder,
        disabled,
        className,
        style: inputStyle,
        onChange: (e) => onChange?.(e.currentTarget.value),
        onBlur,
        onFocus
      }
    );
  }
  function Select({ value, options, onChange, placeholder, className, style }) {
    const { theme } = useTheme();
    const selectStyle = {
      padding: "6px 8px",
      borderRadius: "4px",
      border: `1px solid ${theme.borderColor}`,
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      fontSize: "14px",
      cursor: "pointer",
      outline: "none",
      ...style
    };
    const handleChange = (event) => {
      const target = event.target;
      onChange(target.value);
    };
    return /* @__PURE__ */ jsxRuntime2.jsxs("select", { value, onChange: handleChange, className, style: selectStyle, children: [
      placeholder && /* @__PURE__ */ jsxRuntime2.jsx("option", { value: "", disabled: true, children: placeholder }),
      options.map((option) => /* @__PURE__ */ jsxRuntime2.jsx("option", { value: option.value, children: option.label }, option.value))
    ] });
  }
  function LanguageSelector({ className, style }) {
    const { theme } = useTheme();
    const { t: t2, locale, setLocale } = useI18n();
    const languages = [
      { value: "zh", label: "中文" },
      { value: "en", label: "English" }
    ];
    return /* @__PURE__ */ jsxRuntime2.jsxs(
      "div",
      {
        className,
        style: { display: "flex", alignItems: "center", gap: "8px", ...style },
        children: [
          /* @__PURE__ */ jsxRuntime2.jsxs(
            "label",
            {
              style: {
                fontSize: "14px",
                fontWeight: 500,
                color: theme.textColor,
                marginBottom: "0"
              },
              children: [
                t2("common.language"),
                ":"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime2.jsx(Select, { value: locale, options: languages, onChange: (value) => setLocale(value) })
        ]
      }
    );
  }
  function MessagePlacementSelector({
    value,
    onChange,
    className,
    style
  }) {
    const { theme } = useTheme();
    const { t: t2 } = useI18n();
    const placements = [
      { value: "top", label: t2("common.messagePlacement.top") },
      { value: "bottom", label: t2("common.messagePlacement.bottom") },
      { value: "top-left", label: t2("common.messagePlacement.topLeft") },
      { value: "top-right", label: t2("common.messagePlacement.topRight") },
      { value: "bottom-left", label: t2("common.messagePlacement.bottomLeft") },
      { value: "bottom-right", label: t2("common.messagePlacement.bottomRight") }
    ];
    const handlePlacementChange = (newValue) => {
      onChange(newValue);
    };
    return /* @__PURE__ */ jsxRuntime2.jsxs(
      "div",
      {
        className,
        style: { display: "flex", alignItems: "center", gap: "8px", ...style },
        children: [
          /* @__PURE__ */ jsxRuntime2.jsxs(
            "label",
            {
              style: {
                fontSize: "14px",
                fontWeight: 500,
                color: theme.textColor,
                marginBottom: "0"
              },
              children: [
                t2("common.messagePlacement.label"),
                ":"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime2.jsx(Select, { value, options: placements, onChange: handlePlacementChange })
        ]
      }
    );
  }
  const Overlay = goober2.styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
`;
  const ModalContainer = goober2.styled("div")`
  background: var(--modal-bg);
  color: var(--modal-text);
  border-radius: 12px;
  padding: 24px;
  min-width: 480px;
  width: auto;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 640px) {
    min-width: auto;
    width: 90vw;
  }
`;
  function Modal({
    isOpen,
    onClose,
    title,
    children,
    className = "",
    style = {}
  }) {
    const { theme } = useTheme();
    hooks.useEffect(() => {
      if (!isOpen) return;
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);
    if (!isOpen) return null;
    const cssVariables = {
      "--modal-bg": theme.panelBackground,
      "--modal-text": theme.textColor,
      ...style
    };
    const headerStyle = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: title ? "20px" : "0"
    };
    const titleStyle = {
      margin: 0,
      color: theme.textColor,
      fontSize: "20px",
      fontWeight: 600
    };
    const closeButtonStyle = {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: theme.secondaryTextColor,
      padding: 0,
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "4px",
      transition: "background-color 0.2s ease"
    };
    return /* @__PURE__ */ jsxRuntime2.jsx(Overlay, { onClick: onClose, children: /* @__PURE__ */ jsxRuntime2.jsxs(
      ModalContainer,
      {
        className,
        style: cssVariables,
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: headerStyle, children: [
            title && /* @__PURE__ */ jsxRuntime2.jsx("h2", { style: titleStyle, children: title }),
            /* @__PURE__ */ jsxRuntime2.jsx(
              "button",
              {
                style: closeButtonStyle,
                onClick: onClose,
                onMouseEnter: (e) => {
                  const target = e.target;
                  target.style.backgroundColor = theme.borderColor;
                },
                onMouseLeave: (e) => {
                  const target = e.target;
                  target.style.backgroundColor = "transparent";
                },
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime2.jsx("div", { children })
        ]
      }
    ) });
  }
  const Card = goober2.styled("div")`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 0;
  margin-bottom: 16px;
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }
`;
  const CardHeader = goober2.styled("div")`
  padding: 16px 20px;
  border-bottom: 1px solid var(--card-border);
  background: var(--card-header-bg);
  border-radius: 12px 12px 0 0;
`;
  const CardTitle = goober2.styled("h3")`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--card-title-color);
  display: flex;
  align-items: center;
  gap: 8px;
`;
  const CardContent = goober2.styled("div")`
  padding: 20px;
`;
  function SettingsCard({ title, children, className = "", style = {} }) {
    const { theme, isDark } = useTheme();
    const cardStyle = {
      "--card-bg": theme.panelBackground,
      "--card-border": theme.borderColor,
      "--card-header-bg": isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.01)",
      "--card-title-color": theme.textColor,
      ...style
    };
    return /* @__PURE__ */ jsxRuntime2.jsxs(Card, { className, style: cardStyle, children: [
      title && /* @__PURE__ */ jsxRuntime2.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime2.jsx(CardTitle, { children: title }) }),
      /* @__PURE__ */ jsxRuntime2.jsx(CardContent, { children })
    ] });
  }
  const StyledButton$1 = goober2.styled("button")`
  position: fixed;
  left: var(--left-position);
  bottom: 20px;
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.$bgColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10000;
  color: white;
  transition:
    left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.2s ease,
    transform 0.2s ease;
  opacity: 0.9;
  border: none;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;
  const SettingsIcon = goober2.styled("svg")`
  width: 20px;
  height: 20px;
  fill: currentColor;
`;
  function SettingsButton({
    onClick,
    isVisible,
    backgroundColor = "#1da1f2"
  }) {
    const buttonStyle = {
      "--left-position": isVisible ? "10px" : "-40px"
    };
    return /* @__PURE__ */ jsxRuntime2.jsx(StyledButton$1, { style: buttonStyle, onClick, $bgColor: backgroundColor, children: /* @__PURE__ */ jsxRuntime2.jsx(SettingsIcon, { viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntime2.jsx("path", { d: "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" }) }) });
  }
  function ButtonPositionSettings({ values, onChange }) {
    const { theme } = useTheme();
    const { t: t2 } = useI18n();
    const labelStyle = {
      display: "block",
      marginBottom: "8px",
      fontWeight: 500,
      fontSize: "14px",
      color: theme.textColor
    };
    return /* @__PURE__ */ jsxRuntime2.jsx(SettingsCard, { title: t2("settings.position.title"), children: /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
      /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: { display: "flex", gap: "24px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: { flex: "1", minWidth: "120px" }, children: [
          /* @__PURE__ */ jsxRuntime2.jsx("label", { style: labelStyle, children: t2("settings.position.vertical") }),
          /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntime2.jsx(
              Button,
              {
                variant: values.buttonPositionVertical === "top" ? "primary" : "secondary",
                size: "small",
                onClick: () => onChange("buttonPositionVertical", "top"),
                children: t2("settings.position.top")
              }
            ),
            /* @__PURE__ */ jsxRuntime2.jsx(
              Button,
              {
                variant: values.buttonPositionVertical === "bottom" ? "primary" : "secondary",
                size: "small",
                onClick: () => onChange("buttonPositionVertical", "bottom"),
                children: t2("settings.position.bottom")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: { flex: "1", minWidth: "120px" }, children: [
          /* @__PURE__ */ jsxRuntime2.jsx("label", { style: labelStyle, children: t2("settings.position.verticalValue") }),
          /* @__PURE__ */ jsxRuntime2.jsx(
            Input,
            {
              value: values.buttonPositionVerticalValue,
              onChange: (value) => onChange("buttonPositionVerticalValue", value),
              placeholder: "8"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: { display: "flex", gap: "24px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: { flex: "1", minWidth: "120px" }, children: [
          /* @__PURE__ */ jsxRuntime2.jsx("label", { style: labelStyle, children: t2("settings.position.horizontal") }),
          /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntime2.jsx(
              Button,
              {
                variant: values.buttonPositionHorizontal === "left" ? "primary" : "secondary",
                size: "small",
                onClick: () => onChange("buttonPositionHorizontal", "left"),
                children: t2("settings.position.left")
              }
            ),
            /* @__PURE__ */ jsxRuntime2.jsx(
              Button,
              {
                variant: values.buttonPositionHorizontal === "right" ? "primary" : "secondary",
                size: "small",
                onClick: () => onChange("buttonPositionHorizontal", "right"),
                children: t2("settings.position.right")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: { flex: "1", minWidth: "120px" }, children: [
          /* @__PURE__ */ jsxRuntime2.jsx("label", { style: labelStyle, children: t2("settings.position.horizontalValue") }),
          /* @__PURE__ */ jsxRuntime2.jsx(
            Input,
            {
              value: values.buttonPositionHorizontalValue,
              onChange: (value) => onChange("buttonPositionHorizontalValue", value),
              placeholder: "8"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime2.jsx("div", { style: { fontSize: "12px", color: theme.secondaryTextColor }, children: t2("settings.position.valueHelp") })
    ] }) });
  }
  function createSettingsHook(storageKey, defaultSettings) {
    const storageManager = new StorageManager(storageKey, defaultSettings);
    const settingsSignal = signalsCore.signal(storageManager.loadSettings());
    const computedSettings = signalsCore.computed(() => settingsSignal.value);
    const updateSettings = (newSettings) => {
      const updated = storageManager.saveSettings(newSettings);
      settingsSignal.value = updated;
      window.dispatchEvent(new CustomEvent(`${storageKey}-changed`));
    };
    const resetSettings = () => {
      const reset = storageManager.resetSettings();
      settingsSignal.value = reset;
      window.dispatchEvent(new CustomEvent(`${storageKey}-changed`));
      return reset;
    };
    const getSetting = (key) => {
      return settingsSignal.value[key];
    };
    const setSetting = (key, value) => {
      updateSettings({ [key]: value });
    };
    return {
      // 获取当前设置
      get settings() {
        return computedSettings.value;
      },
      // 更新设置
      updateSettings,
      // 重置设置
      resetSettings,
      // 获取单个设置项
      getSetting,
      // 设置单个设置项
      setSetting,
      // 响应式信号（用于组件订阅）
      signal: settingsSignal
    };
  }
  const DEFAULT_SETTINGS = {
    fileName: "<%Userid> <%Tid>_p<%PicNo>",
    showDownloadButton: true,
    videoFileName: "<%Userid> <%Tid>",
    showVideoDownloadButton: false,
    showUniversalDownloadButton: true,
    autoLikeOnDownload: false,
    messagePlacement: "top",
    buttonPositionVertical: "bottom",
    buttonPositionHorizontal: "right",
    buttonPositionVerticalValue: "64",
    buttonPositionHorizontalValue: "8"
  };
  const settingsHook = createSettingsHook(STORAGE_KEY$1, DEFAULT_SETTINGS);
  function useDownloaderSettings() {
    const [settings, setSettings] = hooks.useState(settingsHook.signal.value);
    hooks.useEffect(() => {
      const unsubscribe = settingsHook.signal.subscribe((value) => {
        setSettings(value);
      });
      return () => unsubscribe();
    }, []);
    return {
      settings,
      setSetting: settingsHook.setSetting,
      updateSettings: settingsHook.updateSettings,
      resetSettings: settingsHook.resetSettings,
      getSetting: settingsHook.getSetting
    };
  }
  const zhTranslations$1 = {
    common: {
      ok: "确定",
      cancel: "取消",
      close: "关闭",
      reset: "重置",
      save: "保存",
      loading: "加载中...",
      error: "错误",
      success: "成功",
      warning: "警告",
      info: "信息",
      language: "语言",
      messagePlacement: {
        label: "消息弹窗位置",
        top: "顶部居中",
        bottom: "底部居中",
        topLeft: "左上角",
        topRight: "右上角",
        bottomLeft: "左下角",
        bottomRight: "右下角"
      }
    },
    button: {
      download: "下载",
      settings: "设置"
    },
    settings: {
      position: {
        title: "按钮位置设置",
        vertical: "垂直方向",
        horizontal: "水平方向",
        top: "上",
        bottom: "下",
        left: "左",
        right: "右",
        verticalValue: "垂直距离",
        horizontalValue: "水平距离",
        valueHelp: "纯数字默认 px，也可输入带单位的值如 1rem、10%"
      }
    }
  };
  const enTranslations$1 = {
    common: {
      ok: "OK",
      cancel: "Cancel",
      close: "Close",
      reset: "Reset",
      save: "Save",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Info",
      language: "Language",
      messagePlacement: {
        label: "Message Placement",
        top: "Top Center",
        bottom: "Bottom Center",
        topLeft: "Top Left",
        topRight: "Top Right",
        bottomLeft: "Bottom Left",
        bottomRight: "Bottom Right"
      }
    },
    button: {
      download: "Download",
      settings: "Settings"
    },
    settings: {
      position: {
        title: "Button Position",
        vertical: "Vertical",
        horizontal: "Horizontal",
        top: "Top",
        bottom: "Bottom",
        left: "Left",
        right: "Right",
        verticalValue: "Vertical Offset",
        horizontalValue: "Horizontal Offset",
        valueHelp: "Pure numbers default to px, also supports values like 1rem, 10%"
      }
    }
  };
  const zhTranslations = {
    title: "X(Twitter) Downloader 设置",
    settings: {
      image: {
        title: "图片下载设置",
        fileName: "图片文件名格式",
        fileNamePlaceholder: "<%Userid> <%Tid>_p<%PicNo>",
        fileNameHelp: "可用变量：<%Userid>、<%Tid>、<%Time>、<%PicName>、<%PicNo>",
        showButton: "显示图片下载按钮"
      },
      video: {
        title: "视频下载设置",
        fileName: "视频文件名格式",
        fileNamePlaceholder: "<%Userid> <%Tid>_video_<%Time>",
        fileNameHelp: "可用变量：<%Userid>、<%Tid>、<%Time>",
        showButton: "显示视频下载按钮"
      },
      universal: {
        title: "通用下载设置",
        showButton: "显示通用下载按钮",
        showButtonHelp: "在推文操作栏中显示统一的下载按钮，自动检测媒体类型",
        autoLike: "下载时自动点赞",
        autoLikeHelp: "下载图片或视频时自动为推文点赞"
      },
      reset: "重置为默认设置"
    },
    messages: {
      downloadStart: "开始下载",
      downloadSuccess: "下载成功",
      downloadError: "下载失败",
      noMediaFound: "未找到媒体文件",
      settingsReset: "设置已重置",
      imagesDownloadSuccess: "成功下载 {count} 张图片",
      videoDownloadSuccess: "视频下载成功",
      cannotRecognizeTweet: "无法识别推文，请重试",
      videoLinkNotFound: "未找到视频下载链接",
      tweetAlreadyLiked: "推文已点赞",
      likeSuccess: "点赞成功",
      likeButtonNotFound: "未找到点赞按钮",
      cannotGetAuthInfo: "无法获取认证信息",
      networkRequestFailed: "网络请求失败 ({status})",
      likeFailed: "点赞失败: {error}",
      likeResponseError: "点赞响应异常",
      downloadFailed: "下载失败",
      videoDownloadFailed: "视频下载失败",
      imageDownloadFailed: "图片下载失败"
    },
    ui: {
      downloading: "下载中...",
      downloadVideo: "下载视频",
      downloadImage: "下载原图",
      downloadImages: "下载 {count} 张图片",
      downloadVideos: "下载 {count} 个视频",
      copied: "已复制到剪贴板",
      copyFailed: "复制失败"
    }
  };
  const enTranslations = {
    title: "X(Twitter) Downloader Settings",
    settings: {
      image: {
        title: "Image Download Settings",
        fileName: "Image filename format",
        fileNamePlaceholder: "<%Userid> <%Tid>_p<%PicNo>",
        fileNameHelp: "Available variables: <%Userid>, <%Tid>, <%Time>, <%PicName>, <%PicNo>",
        showButton: "Show image download button"
      },
      video: {
        title: "Video Download Settings",
        fileName: "Video filename format",
        fileNamePlaceholder: "<%Userid> <%Tid>_video_<%Time>",
        fileNameHelp: "Available variables: <%Userid>, <%Tid>, <%Time>",
        showButton: "Show video download button"
      },
      universal: {
        title: "Universal Download Settings",
        showButton: "Show universal download button",
        showButtonHelp: "Display unified download button in tweet actions, automatically detects media type",
        autoLike: "Auto-like on download",
        autoLikeHelp: "Automatically like the tweet when downloading images or videos"
      },
      reset: "Reset to default settings"
    },
    messages: {
      downloadStart: "Download started",
      downloadSuccess: "Download successful",
      downloadError: "Download failed",
      noMediaFound: "No media found",
      settingsReset: "Settings reset",
      imagesDownloadSuccess: "Successfully downloaded {count} images",
      videoDownloadSuccess: "Video download successful",
      cannotRecognizeTweet: "Cannot recognize tweet, please try again",
      videoLinkNotFound: "Video download link not found",
      tweetAlreadyLiked: "Tweet already liked",
      likeSuccess: "Like successful",
      likeButtonNotFound: "Like button not found",
      cannotGetAuthInfo: "Cannot get authentication info",
      networkRequestFailed: "Network request failed ({status})",
      likeFailed: "Like failed: {error}",
      likeResponseError: "Like response error",
      downloadFailed: "Download failed",
      videoDownloadFailed: "Video download failed",
      imageDownloadFailed: "Image download failed"
    },
    ui: {
      downloading: "Downloading...",
      downloadVideo: "Download Video",
      downloadImage: "Download Image",
      downloadImages: "Download {count} Images",
      downloadVideos: "Download {count} Videos",
      copied: "Copied to clipboard",
      copyFailed: "Copy failed"
    }
  };
  i18n.addTranslations("zh", zhTranslations$1);
  i18n.addTranslations("zh", zhTranslations);
  i18n.addTranslations("en", enTranslations$1);
  i18n.addTranslations("en", enTranslations);
  function SettingsPanel({ isOpen, onClose }) {
    const { settings, setSetting, resetSettings } = useDownloaderSettings();
    const { t: t2 } = useI18n();
    const { theme, isDark } = useTheme();
    const [resetKey, setResetKey] = hooks.useState(0);
    const toolbarStyle = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: "16px",
      padding: "16px",
      marginBottom: "20px",
      background: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.01)",
      border: `1px solid ${theme.borderColor}`,
      borderRadius: "8px"
    };
    const fieldStyle = {
      marginBottom: "20px"
    };
    const labelStyle = {
      display: "block",
      marginBottom: "8px",
      fontWeight: 500,
      fontSize: "14px",
      color: theme.textColor
    };
    const helpTextStyle = {
      marginTop: "6px",
      fontSize: "12px",
      color: theme.secondaryTextColor,
      paddingLeft: "24px"
    };
    return /* @__PURE__ */ jsxRuntime2.jsx(Modal, { isOpen, onClose, title: t2("title"), children: /* @__PURE__ */ jsxRuntime2.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: toolbarStyle, children: [
        /* @__PURE__ */ jsxRuntime2.jsxs(
          "div",
          {
            style: {
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              flex: "1",
              minWidth: "0"
            },
            children: [
              /* @__PURE__ */ jsxRuntime2.jsx(LanguageSelector, {}),
              /* @__PURE__ */ jsxRuntime2.jsx(
                MessagePlacementSelector,
                {
                  value: settings.messagePlacement,
                  onChange: (placement) => setSetting("messagePlacement", placement)
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime2.jsx(
          Button,
          {
            variant: "secondary",
            style: { flexShrink: 0 },
            onClick: () => {
              resetSettings();
              setResetKey((prev) => prev + 1);
            },
            children: t2("settings.reset")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime2.jsxs(SettingsCard, { title: t2("settings.image.title"), children: [
        /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: fieldStyle, children: [
          /* @__PURE__ */ jsxRuntime2.jsx("label", { style: labelStyle, children: t2("settings.image.fileName") }),
          /* @__PURE__ */ jsxRuntime2.jsx(
            Input,
            {
              value: settings.fileName,
              onChange: (value) => setSetting("fileName", value),
              placeholder: t2("settings.image.fileNamePlaceholder")
            }
          ),
          /* @__PURE__ */ jsxRuntime2.jsx("div", { style: { marginTop: "6px", fontSize: "12px", color: theme.secondaryTextColor }, children: t2("settings.image.fileNameHelp") })
        ] }),
        /* @__PURE__ */ jsxRuntime2.jsx(
          Checkbox,
          {
            checked: settings.showDownloadButton,
            onChange: (checked) => setSetting("showDownloadButton", checked),
            children: t2("settings.image.showButton")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime2.jsxs(SettingsCard, { title: t2("settings.video.title"), children: [
        /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: fieldStyle, children: [
          /* @__PURE__ */ jsxRuntime2.jsx("label", { style: labelStyle, children: t2("settings.video.fileName") }),
          /* @__PURE__ */ jsxRuntime2.jsx(
            Input,
            {
              value: settings.videoFileName,
              onChange: (value) => setSetting("videoFileName", value),
              placeholder: t2("settings.video.fileNamePlaceholder")
            }
          ),
          /* @__PURE__ */ jsxRuntime2.jsx("div", { style: { marginTop: "6px", fontSize: "12px", color: theme.secondaryTextColor }, children: t2("settings.video.fileNameHelp") })
        ] }),
        /* @__PURE__ */ jsxRuntime2.jsx(
          Checkbox,
          {
            checked: settings.showVideoDownloadButton,
            onChange: (checked) => setSetting("showVideoDownloadButton", checked),
            children: t2("settings.video.showButton")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime2.jsxs(SettingsCard, { title: t2("settings.universal.title"), children: [
        /* @__PURE__ */ jsxRuntime2.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime2.jsx(
            Checkbox,
            {
              checked: settings.showUniversalDownloadButton,
              onChange: (checked) => setSetting("showUniversalDownloadButton", checked),
              children: t2("settings.universal.showButton")
            }
          ),
          /* @__PURE__ */ jsxRuntime2.jsx("div", { style: helpTextStyle, children: t2("settings.universal.showButtonHelp") })
        ] }),
        /* @__PURE__ */ jsxRuntime2.jsxs("div", { style: { marginTop: "16px" }, children: [
          /* @__PURE__ */ jsxRuntime2.jsx(
            Checkbox,
            {
              checked: settings.autoLikeOnDownload,
              onChange: (checked) => setSetting("autoLikeOnDownload", checked),
              children: t2("settings.universal.autoLike")
            }
          ),
          /* @__PURE__ */ jsxRuntime2.jsx("div", { style: helpTextStyle, children: t2("settings.universal.autoLikeHelp") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime2.jsx(
        ButtonPositionSettings,
        {
          values: {
            buttonPositionVertical: settings.buttonPositionVertical,
            buttonPositionHorizontal: settings.buttonPositionHorizontal,
            buttonPositionVerticalValue: settings.buttonPositionVerticalValue,
            buttonPositionHorizontalValue: settings.buttonPositionHorizontalValue
          },
          onChange: (key, value) => setSetting(key, value)
        }
      )
    ] }, resetKey) });
  }
  function App() {
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = hooks.useState(false);
    const [isMouseNearLeft, setIsMouseNearLeft] = hooks.useState(false);
    hooks.useEffect(() => {
      const handleMouseMove = (e) => {
        const isNear = e.clientX < 100 && e.clientY > window.innerHeight * (2 / 3);
        setIsMouseNearLeft(isNear);
      };
      const handleOpenSettings = () => setIsSettingsPanelOpen(true);
      document.addEventListener("mousemove", handleMouseMove);
      window.addEventListener(OPEN_SETTINGS_EVENT, handleOpenSettings);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener(OPEN_SETTINGS_EVENT, handleOpenSettings);
      };
    }, []);
    const isVisible = isMouseNearLeft || isSettingsPanelOpen;
    return /* @__PURE__ */ jsxRuntime2.jsxs(jsxRuntime2.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime2.jsx(
        SettingsButton,
        {
          onClick: () => setIsSettingsPanelOpen(!isSettingsPanelOpen),
          isVisible,
          backgroundColor: "#1da1f2"
        }
      ),
      /* @__PURE__ */ jsxRuntime2.jsx(SettingsPanel, { isOpen: isSettingsPanelOpen, onClose: () => setIsSettingsPanelOpen(false) })
    ] });
  }
  const spin = goober2.keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
  const StyledButton = goober2.styled("button")`
  position: absolute;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.9);
  cursor: pointer;
  opacity: 0.8;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform: scale(1);
  top: var(--top);
  right: var(--right);
  bottom: var(--bottom);
  left: var(--left);

  &:hover:not(:disabled) {
    opacity: 1;
    transform: scale(1.05);
  }
`;
  const DownloadIcon$1 = goober2.styled("svg")`
  width: var(--icon-width, 20px);
  height: var(--icon-height, 20px);
  fill: var(--icon-color, white);
`;
  const LoadingIcon = goober2.styled("svg")`
  width: var(--icon-width, 18px);
  height: var(--icon-height, 18px);
  animation: ${spin} 1s linear infinite;
  fill: none;
  color: var(--icon-color, white);
`;
  const defaultDownloadIcon = /* @__PURE__ */ jsxRuntime2.jsx(DownloadIcon$1, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntime2.jsx("path", { d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" }) });
  const defaultLoadingIcon = /* @__PURE__ */ jsxRuntime2.jsx(LoadingIcon, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntime2.jsx(
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      strokeWidth: "4",
      fill: "none",
      strokeDasharray: "31.416",
      strokeDashoffset: "15.708"
    }
  ) });
  const defaultCopyIcon = /* @__PURE__ */ jsxRuntime2.jsx(DownloadIcon$1, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntime2.jsx("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }) });
  function DownloadButton({
    title,
    isDownloading = false,
    disabled = false,
    icon = defaultDownloadIcon,
    shiftIcon = defaultCopyIcon,
    loadingIcon = defaultLoadingIcon,
    style = {},
    className = "",
    onClick
  }) {
    const isDisabled = disabled || isDownloading;
    const isShiftPressed = useGlobalKey("Shift");
    const handleClick = (e) => {
      preventEventPropagation(e);
      if (isDisabled) return;
      onClick?.(e, isShiftPressed);
    };
    const convertStyleToCSSVars = (styles) => {
      const cssVars = {};
      for (const [key, value] of Object.entries(styles)) {
        const cssVarName = `--${key.replace(/[A-Z]/g, "-$&").toLowerCase()}`;
        cssVars[cssVarName] = value;
      }
      return cssVars;
    };
    const buttonStyle = {
      // 功能性 CSS 变量
      "--cursor": isDisabled ? "not-allowed" : "pointer",
      "--opacity": isDownloading ? "0.5" : "0.8",
      "--transform": isDownloading ? "scale(0.95)" : "scale(1)",
      "--hover-transform": isDownloading ? "scale(0.95)" : "scale(1.05)",
      ...!style.top && !style.bottom && { "--bottom": "8px" },
      ...!style.right && !style.left && { "--right": "8px" },
      ...convertStyleToCSSVars(style)
    };
    return /* @__PURE__ */ jsxRuntime2.jsx(
      StyledButton,
      {
        className,
        style: buttonStyle,
        onClick: handleClick,
        onMouseDown: (e) => {
          e.preventDefault();
          return false;
        },
        title,
        disabled: isDisabled,
        children: isDownloading ? loadingIcon : isShiftPressed && shiftIcon ? shiftIcon : icon
      }
    );
  }
  const GRAPHQL_TWEET_DETAIL_ID = "_8aYOgEDz35BrBcBal1-_w";
  const GRAPHQL_ENDPOINT = `https://x.com/i/api/graphql/${GRAPHQL_TWEET_DETAIL_ID}/TweetDetail`;
  const GRAPHQL_AUTH_TOKEN = "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
  const TWEET_FEATURE_FLAGS = {
    rweb_video_screen_enabled: false,
    profile_label_improvements_pcf_label_in_post_enabled: true,
    rweb_tipjar_consumption_enabled: true,
    verified_phone_label_enabled: false,
    creator_subscriptions_tweet_preview_api_enabled: true,
    responsive_web_graphql_timeline_navigation_enabled: true,
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    premium_content_api_read_enabled: false,
    communities_web_enable_tweet_community_results_fetch: true,
    c9s_tweet_anatomy_moderator_badge_enabled: true,
    responsive_web_grok_analyze_button_fetch_trends_enabled: false,
    responsive_web_grok_analyze_post_followups_enabled: true,
    responsive_web_jetfuel_frame: false,
    responsive_web_grok_share_attachment_enabled: true,
    articles_preview_enabled: true,
    responsive_web_edit_tweet_api_enabled: true,
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
    view_counts_everywhere_api_enabled: true,
    longform_notetweets_consumption_enabled: true,
    responsive_web_twitter_article_tweet_consumption_enabled: true,
    tweet_awards_web_tipping_enabled: false,
    responsive_web_grok_show_grok_translated_post: false,
    responsive_web_grok_analysis_button_from_backend: false,
    creator_subscriptions_quote_tweet_preview_enabled: false,
    freedom_of_speech_not_reach_fetch_enabled: true,
    standardized_nudges_misinfo: true,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
    longform_notetweets_rich_text_read_enabled: true,
    longform_notetweets_inline_media_enabled: true,
    responsive_web_grok_image_annotation_enabled: true,
    responsive_web_enhance_cards_enabled: false
  };
  const TWEET_FIELD_TOGGLES = {
    withArticlePlainText: false,
    withArticleRichContentState: true,
    withDisallowedReplyControls: false,
    withGrokAnalyze: false
  };
  const FEATURES_PARAM = encodeURIComponent(JSON.stringify(TWEET_FEATURE_FLAGS));
  const FIELD_TOGGLES_PARAM = encodeURIComponent(JSON.stringify(TWEET_FIELD_TOGGLES));
  const BASE_QUERY_SUFFIX = `features=${FEATURES_PARAM}&fieldToggles=${FIELD_TOGGLES_PARAM}`;
  const BASE_VARIABLES_SUFFIX = '","rankingMode":"Relevance","includePromotedContent":false,"withCommunity":false,"withQuickPromoteEligibilityTweetFields":false,"withBirdwatchNotes":false,"withVoice":false}';
  const GRAPHQL_BASE_HEADERS = [
    ["Authorization", GRAPHQL_AUTH_TOKEN],
    ["x-twitter-active-user", "yes"],
    ["Content-Type", "application/json"]
  ];
  let cachedCsrfToken;
  const buildTweetDetailUrl = (tweetId) => {
    const variables = encodeURIComponent(`{"focalTweetId":"${tweetId}${BASE_VARIABLES_SUFFIX}`);
    return `${GRAPHQL_ENDPOINT}?${BASE_QUERY_SUFFIX}&variables=${variables}`;
  };
  function getBestVideoUrl(medias) {
    if (!Array.isArray(medias) || medias.length === 0) {
      return void 0;
    }
    const videoMedia = medias.find(
      (media) => media.type === "video" || media.type === "animated_gif"
    );
    if (!videoMedia || !videoMedia.video_info || !Array.isArray(videoMedia.video_info.variants)) {
      return void 0;
    }
    const mp4Variants = videoMedia.video_info.variants.filter(
      (variant) => variant.content_type === "video/mp4" && variant.url
    );
    if (mp4Variants.length === 0) {
      return void 0;
    }
    const bestVariant = mp4Variants.reduce((prev, current) => {
      return (current.bitrate || 0) >= (prev.bitrate || 0) ? current : prev;
    });
    return bestVariant.url;
  }
  function extractMediaFromTweetData(tweetData, tweetId) {
    try {
      const instructions = tweetData.data.threaded_conversation_with_injections_v2.instructions;
      const timelineAddEntries = instructions.find((i) => i.type === "TimelineAddEntries");
      if (!timelineAddEntries || !Array.isArray(timelineAddEntries.entries)) {
        return [];
      }
      for (const entry of timelineAddEntries.entries) {
        const { content, entryId } = entry;
        const { entryType, itemContent } = content;
        if (entryId === `tweet-${tweetId}` && entryType === "TimelineTimelineItem" && itemContent?.itemType === "TimelineTweet" && itemContent.tweet_results?.result?.legacy?.extended_entities?.media) {
          return itemContent.tweet_results.result.legacy.extended_entities.media;
        }
      }
      return [];
    } catch (error2) {
      console.error("Error extracting media from tweet data:", error2);
      return [];
    }
  }
  function getCSRFToken() {
    if (cachedCsrfToken) {
      return cachedCsrfToken;
    }
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      const token = metaTag.getAttribute("content") || void 0;
      if (token) {
        cachedCsrfToken = token;
        return token;
      }
    }
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "ct0" && value) {
        cachedCsrfToken = decodeURIComponent(value);
        return cachedCsrfToken;
      }
    }
    return void 0;
  }
  async function fetchTweetData(tweetId, csrfToken) {
    const headers = new Headers(GRAPHQL_BASE_HEADERS);
    headers.set("x-csrf-token", csrfToken);
    headers.set("User-Agent", navigator.userAgent);
    const response = await fetch(buildTweetDetailUrl(tweetId), {
      method: "GET",
      headers,
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch tweet data: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }
  async function extractVideoUrl(tweetId) {
    try {
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        throw new Error("Could not find CSRF token");
      }
      const tweetData = await fetchTweetData(tweetId, csrfToken);
      const mediaArray = extractMediaFromTweetData(tweetData, tweetId);
      const videoUrl = getBestVideoUrl(mediaArray);
      return videoUrl;
    } catch (error2) {
      cachedCsrfToken = void 0;
      console.error("Error extracting video URL:", error2);
      throw error2;
    }
  }
  function findVideoContainer(videoElement) {
    let current = videoElement.parentElement;
    while (current && current.tagName !== "BODY") {
      if (current.hasAttribute("data-testid") && current.getAttribute("data-testid") === "videoComponent") {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }
  function findVideoPlayerContainer(videoElement) {
    let current = videoElement.parentElement;
    while (current && current.tagName !== "BODY") {
      if (current.hasAttribute("data-testid") && current.getAttribute("data-testid") === "videoPlayer") {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }
  const LIKE_BUTTON_SELECTOR = 'button[data-testid="like"]';
  const UNLIKE_BUTTON_SELECTOR = 'button[data-testid="unlike"]';
  const DOM_CHECK_RETRIES = 5;
  const DOM_CHECK_INTERVAL_MS = 200;
  const TWITTER_API_ENDPOINT = "https://x.com/i/api/graphql/lI07N6Otwv1PhnEgXILM7A/FavoriteTweet";
  const TWITTER_BEARER_TOKEN = "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
  async function likeTweet(tweetContainer, tweetId) {
    try {
      if (tweetContainer) {
        const domResult = await tryLikeViaDom(tweetContainer);
        if (domResult === "success" || domResult === "already-liked") {
          return { success: true };
        }
      }
      return await likeTweetViaApi(tweetId);
    } catch (error2) {
      const errorMsg = error2 instanceof Error ? error2.message : String(error2);
      return { success: false, message: i18n.t("messages.likeFailed", { error: errorMsg }) };
    }
  }
  async function tryLikeViaDom(tweetContainer) {
    const unlikeButton = tweetContainer.querySelector(
      UNLIKE_BUTTON_SELECTOR
    );
    if (unlikeButton) {
      return "already-liked";
    }
    const likeButton = tweetContainer.querySelector(LIKE_BUTTON_SELECTOR);
    if (!likeButton) {
      return "fallback";
    }
    try {
      likeButton.click();
    } catch {
      return "fallback";
    }
    const domUpdated = await waitForDomLikeState(tweetContainer, likeButton);
    if (domUpdated) {
      message.info(i18n.t("messages.likeSuccess"));
      return "success";
    }
    return "fallback";
  }
  async function waitForDomLikeState(tweetContainer, likeButton) {
    for (let attempt = 0; attempt < DOM_CHECK_RETRIES; attempt++) {
      const unlikeButton2 = tweetContainer.querySelector(UNLIKE_BUTTON_SELECTOR);
      if (unlikeButton2) {
        return true;
      }
      const dataTestId2 = likeButton.getAttribute("data-testid");
      const ariaPressed = likeButton.getAttribute("aria-pressed");
      if (dataTestId2 === "unlike" || ariaPressed === "true") {
        return true;
      }
      await new Promise((resolve) => window.setTimeout(resolve, DOM_CHECK_INTERVAL_MS));
    }
    const unlikeButton = tweetContainer.querySelector(UNLIKE_BUTTON_SELECTOR);
    if (unlikeButton) {
      return true;
    }
    const dataTestId = likeButton.getAttribute("data-testid");
    if (dataTestId === "unlike") {
      return true;
    }
    return likeButton.getAttribute("aria-pressed") === "true";
  }
  function getTwitterHeaders() {
    const csrfToken = getCookie("ct0");
    const cookies = document.cookie;
    if (!csrfToken || !cookies) {
      return null;
    }
    return {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      authorization: TWITTER_BEARER_TOKEN,
      "content-type": "application/json",
      "x-csrf-token": csrfToken,
      "x-twitter-active-user": "yes",
      "x-twitter-auth-type": "OAuth2Session",
      "x-twitter-client-language": "en",
      cookie: cookies
    };
  }
  async function likeTweetViaApi(tweetId) {
    const headers = getTwitterHeaders();
    if (!headers) {
      return { success: false, message: i18n.t("messages.cannotGetAuthInfo") };
    }
    const payload = {
      variables: {
        tweet_id: tweetId
      },
      queryId: "lI07N6Otwv1PhnEgXILM7A"
    };
    try {
      const response = await fetch(TWITTER_API_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        return {
          success: false,
          message: i18n.t("messages.networkRequestFailed", { status: response.status })
        };
      }
      const { errors, data } = await response.json();
      if (errors && errors.length > 0) {
        const [error2] = errors;
        const { code, name, message: errorMessage } = error2 || {};
        if (code === 139 && name === "AuthorizationError") {
          message.info(i18n.t("messages.tweetAlreadyLiked"));
          return { success: true };
        }
        const errorMsg = errorMessage || "未知错误";
        return { success: false, message: i18n.t("messages.likeFailed", { error: errorMsg }) };
      }
      if (data?.favorite_tweet === "Done") {
        message.info(i18n.t("messages.likeSuccess"));
        return { success: true };
      }
      return { success: false, message: i18n.t("messages.likeResponseError") };
    } catch (error2) {
      const errorMsg = error2 instanceof Error ? error2.message : String(error2);
      return { success: false, message: i18n.t("messages.likeFailed", { error: errorMsg }) };
    }
  }
  function formatPositionValue(value) {
    if (/^\d+$/.test(value.trim())) {
      return `${value.trim()}px`;
    }
    return value;
  }
  function getButtonPositionStyle(settings) {
    return {
      [settings.buttonPositionVertical]: formatPositionValue(
        settings.buttonPositionVerticalValue
      ),
      [settings.buttonPositionHorizontal]: formatPositionValue(
        settings.buttonPositionHorizontalValue
      )
    };
  }
  function handleDownloadError(error2, prefix = i18n.t("messages.downloadFailed")) {
    console.error(`${prefix}:`, error2);
    const errorMessage = error2 instanceof Error ? error2.message : String(error2);
    message.error(`${prefix}: ${errorMessage}`);
  }
  function findTweetContainer(element) {
    let current = element;
    while (current && current.tagName !== "BODY") {
      if (current.tagName === "ARTICLE" && current.getAttribute("data-testid") === "tweet") {
        return current;
      }
      if (current.getAttribute("role") === "dialog") {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }
  function getTweetIdFromElement(element, username = "") {
    let current = element;
    while (current && current.tagName !== "BODY") {
      if (current.tagName === "ARTICLE" && current.hasAttribute("data-testid")) {
        const testId = current.getAttribute("data-testid");
        if (testId === "tweet") {
          const links = current.querySelectorAll(`a[href*="${username}/status/"]`);
          for (const link of Array.from(links)) {
            const href = link.href;
            const match = href.match(/\/status\/(\d+)/);
            if (match) {
              return match[1];
            }
          }
        }
      }
      current = current.parentElement;
    }
    const urlMatch = window.location.href.match(/\/status\/(\d+)/);
    if (urlMatch) {
      return urlMatch[1];
    }
    return void 0;
  }
  function isInsideQuoteTweet(element) {
    const roleLink = element.closest('[role="link"]');
    if (roleLink && roleLink.querySelector("time")) {
      return true;
    }
    const idContainer = element.closest('[id^="id"]:not([aria-labelledby])');
    if (idContainer && idContainer.querySelector("time")) {
      return true;
    }
    return false;
  }
  function tweetHasDownloadableImages(tweetContainer) {
    const images = tweetContainer.querySelectorAll('img[src^="https://pbs.twimg.com/media/"]');
    return Array.from(images).some((img) => !isInsideQuoteTweet(img));
  }
  function tweetHasDownloadableVideos(tweetContainer) {
    const videos = tweetContainer.querySelectorAll("video");
    return Array.from(videos).some((video) => !isInsideQuoteTweet(video));
  }
  function getDownloadableImages(tweetContainer) {
    const images = tweetContainer.querySelectorAll('img[src^="https://pbs.twimg.com/media/"]');
    return Array.from(images).filter(
      (img) => !isInsideQuoteTweet(img)
    );
  }
  function getDownloadableVideos(tweetContainer) {
    const videos = tweetContainer.querySelectorAll("video");
    return Array.from(videos).filter(
      (video) => !isInsideQuoteTweet(video)
    );
  }
  function getUserIdFromTweetContainer(tweetContainer) {
    try {
      const userNameElement = tweetContainer.querySelector('[data-testid="User-Name"]');
      if (userNameElement) {
        const linkElement = userNameElement.querySelector('a[href^="/"]');
        if (linkElement) {
          const href = linkElement.getAttribute("href");
          if (href && href.startsWith("/")) {
            const username = href.slice(1).split("/")[0];
            if (username) {
              return username;
            }
          }
        }
      }
      const tweetLink = tweetContainer.querySelector('a[href*="/status/"]');
      if (tweetLink) {
        return extractUrlInfo(tweetLink.href).userid;
      } else {
        return extractUrlInfo(window.location.href).userid;
      }
    } catch (error2) {
      console.error("获取用户名时出错:", error2);
      return void 0;
    }
  }
  function findFirstAnchor(node) {
    let current = node;
    for (let i = 0; i < 20 && current; i++) {
      current = current.parentElement;
      if (current?.tagName.toLowerCase() === "a") {
        return current;
      }
    }
    return null;
  }
  const handleImageDownload = async ({
    setIsDownloading,
    targetImage,
    settings,
    skipAutoLike = false,
    imageIndex,
    isShiftPressed = false,
    tweetContainer
  }) => {
    setIsDownloading(true);
    const { picname, ext } = extractFileInfo(targetImage.src);
    let urlInfo;
    if (window.location.href.includes("photo")) {
      urlInfo = extractUrlInfo(window.location.href);
    } else {
      const firstA = findFirstAnchor(targetImage);
      if (!firstA) return;
      urlInfo = extractUrlInfo(firstA.href);
    }
    const picNo = imageIndex ? imageIndex : parseInt(urlInfo.picno) - 1;
    const filename = generateFileName(settings.fileName, {
      Userid: urlInfo.userid,
      Tid: urlInfo.tid,
      Time: `${Date.now()}`,
      PicName: picname,
      PicNo: `${picNo}`
    });
    const downloadUrl = `https://pbs.twimg.com/media/${picname}?format=${ext}&name=orig`;
    try {
      if (isShiftPressed) {
        await copyToClipboard(downloadUrl);
        return;
      }
      await downloadFile(downloadUrl, `${filename}.${ext}`);
      if (settings.autoLikeOnDownload && urlInfo.tid && !skipAutoLike) {
        const likeResult = await likeTweet(tweetContainer, urlInfo.tid);
        if (!likeResult.success && likeResult.message) {
          message.error(likeResult.message);
        }
      }
    } catch (error2) {
      handleDownloadError(error2, i18n.t("messages.imageDownloadFailed"));
    } finally {
      setIsDownloading(false);
    }
  };
  function ImageDownloadButton({ targetImage, tweetContainer }) {
    const { settings } = useDownloaderSettings();
    const [isDownloading, setIsDownloading] = hooks.useState(false);
    if (!settings.showDownloadButton) return null;
    return /* @__PURE__ */ jsxRuntime2.jsx(
      DownloadButton,
      {
        isDownloading,
        onClick: (_, isShiftPressed) => handleImageDownload({
          setIsDownloading,
          targetImage,
          settings,
          isShiftPressed,
          tweetContainer
        }),
        title: i18n.t("ui.downloadImage"),
        style: getButtonPositionStyle(settings)
      }
    );
  }
  const handleVideoDownload = async ({
    setIsDownloading,
    src,
    tweetContainer,
    settings,
    skipAutoLike = false,
    isShiftPressed = false
  }) => {
    setIsDownloading(true);
    try {
      const username = getUserIdFromTweetContainer(tweetContainer);
      const tweetId = getTweetIdFromElement(tweetContainer, username);
      if (!tweetId) {
        message.error(i18n.t("messages.cannotRecognizeTweet"));
        return;
      }
      const videoUrl = src && src.startsWith("https://video.twimg.com") ? src : await extractVideoUrl(tweetId);
      if (!videoUrl) {
        message.error(i18n.t("messages.videoLinkNotFound"));
        return;
      }
      if (isShiftPressed) {
        await copyToClipboard(videoUrl);
        return;
      }
      const urlInfo = { userid: username, tid: tweetId };
      const filename = generateFileName(settings.videoFileName, {
        Userid: urlInfo.userid || "unknown",
        Tid: urlInfo.tid,
        Time: `${Date.now()}`
      });
      await downloadFile(videoUrl, `${filename}.mp4`);
      if (settings.autoLikeOnDownload && tweetId && !skipAutoLike) {
        const likeResult = await likeTweet(tweetContainer, tweetId);
        if (!likeResult.success && likeResult.message) {
          message.error(likeResult.message);
        }
      }
    } catch (error2) {
      handleDownloadError(error2, i18n.t("messages.videoDownloadFailed"));
    } finally {
      setIsDownloading(false);
    }
  };
  function VideoDownloadButton({ src, tweetContainer }) {
    const { settings } = useDownloaderSettings();
    const [isDownloading, setIsDownloading] = hooks.useState(false);
    if (!settings.showVideoDownloadButton) {
      return null;
    }
    return /* @__PURE__ */ jsxRuntime2.jsx(
      DownloadButton,
      {
        isDownloading,
        onClick: (_, isShiftPressed) => handleVideoDownload({
          setIsDownloading,
          src,
          tweetContainer,
          settings,
          isShiftPressed
        }),
        title: isDownloading ? i18n.t("ui.downloading") : i18n.t("ui.downloadVideo"),
        style: getButtonPositionStyle(settings)
      }
    );
  }
  const InlineButton = goober2.styled("button")`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34.75px;
  height: 34.75px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: rgb(113, 118, 123);

  &:hover:not(:disabled) {
    background-color: rgba(29, 155, 240, 0.1);
    color: rgb(29, 155, 240);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
  const DownloadIcon = goober2.styled("svg")`
  width: 18.75px;
  height: 18.75px;
  fill: currentColor;
`;
  function UniversalDownloadButton({ tweetContainer }) {
    const { settings } = useDownloaderSettings();
    const [isDownloading, setIsDownloading] = hooks.useState(false);
    const [mediaType, setMediaType] = hooks.useState("none");
    const url = window.location.href;
    hooks.useEffect(() => {
      let timeoutId = null;
      const detectMediaType = () => {
        if (tweetHasDownloadableImages(tweetContainer)) {
          setMediaType("image");
          return;
        }
        if (tweetHasDownloadableVideos(tweetContainer)) {
          setMediaType("video");
          return;
        }
        setMediaType("none");
      };
      const debouncedDetectMediaType = () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(detectMediaType, 100);
      };
      detectMediaType();
      const observer = new MutationObserver(debouncedDetectMediaType);
      observer.observe(tweetContainer, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      });
      return () => {
        observer.disconnect();
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
      };
    }, [tweetContainer]);
    if (mediaType === "none" || !settings.showUniversalDownloadButton) {
      return null;
    }
    const nopSetDownloading = () => {
    };
    const downloadImages = async (container) => {
      if (url.includes("/photo/") && container.nodeName !== "ARTICLE") {
        const photoMatch = url.match(/\/photo\/(\d+)/);
        const photoIndex = photoMatch && photoMatch[1] ? parseInt(photoMatch[1]) - 1 : 0;
        const carouselContainer = container.querySelector('[aria-roledescription="carousel"]');
        if (carouselContainer) {
          const targetImage = carouselContainer.querySelectorAll(IMAGE_SELECTOR)[photoIndex];
          if (targetImage) {
            await handleImageDownload({
              setIsDownloading: nopSetDownloading,
              targetImage,
              settings,
              imageIndex: photoIndex,
              tweetContainer: container
            });
            message.success(i18n.t("messages.imagesDownloadSuccess", { count: 1 }));
            return;
          }
        }
        throw new Error("Image not found in preview mode");
      }
      const images = getDownloadableImages(container);
      const downloadPromises = images.map((img, index) => {
        if (!img) return Promise.resolve();
        return handleImageDownload({
          setIsDownloading: nopSetDownloading,
          targetImage: img,
          settings,
          skipAutoLike: index > 0,
          // 只有第一张图片允许点赞，其他跳过
          imageIndex: index,
          tweetContainer: container
        });
      });
      const results = await Promise.allSettled(downloadPromises);
      const failed = results.filter((result) => result.status === "rejected");
      const successCount = results.length - failed.length;
      if (successCount === 0) {
        message.error(i18n.t("messages.imageDownloadFailed"));
      } else if (failed.length > 0) {
        message.warning(
          i18n.t("messages.imagesDownloadSuccess", { count: `${successCount}/${results.length}` })
        );
      } else {
        message.success(i18n.t("messages.imagesDownloadSuccess", { count: results.length }));
      }
    };
    const downloadVideo = async (container) => {
      const videos = getDownloadableVideos(container);
      const video = videos[0];
      if (!video) return;
      handleVideoDownload({
        setIsDownloading: nopSetDownloading,
        src: video.src,
        tweetContainer: container,
        settings
      }).then(() => message.success(i18n.t("messages.videoDownloadSuccess")));
    };
    const getTitle = () => {
      if (isDownloading) return i18n.t("ui.downloading");
      let imageCount = getDownloadableImages(tweetContainer).length;
      let videoCount = getDownloadableVideos(tweetContainer).length;
      if (["/photo/", "/video/"].some((segment) => url.includes(segment))) {
        imageCount = 1;
        videoCount = 1;
      }
      if (mediaType === "image") {
        return imageCount > 1 ? i18n.t("ui.downloadImages", { count: imageCount }) : i18n.t("ui.downloadImage");
      }
      return videoCount > 1 ? i18n.t("ui.downloadVideos", { count: videoCount }) : i18n.t("ui.downloadVideo");
    };
    const handleDownload = async (e) => {
      if (isDownloading) return;
      e.stopPropagation();
      setIsDownloading(true);
      try {
        if (mediaType === "image") {
          await downloadImages(tweetContainer);
        } else if (mediaType === "video") {
          await downloadVideo(tweetContainer);
        }
      } finally {
        setIsDownloading(false);
      }
    };
    return /* @__PURE__ */ jsxRuntime2.jsx(InlineButton, { onClick: handleDownload, disabled: isDownloading, title: getTitle(), children: /* @__PURE__ */ jsxRuntime2.jsx(DownloadIcon, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntime2.jsx("path", { d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" }) }) });
  }
  GM_registerMenuCommand("⚙️ Settings / 设置", () => {
    window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
  });
  const IMAGE_SELECTOR = 'img[src^="https://pbs.twimg.com/media/"]';
  const VIDEO_SELECTOR = "video";
  const processedImages = /* @__PURE__ */ new WeakSet();
  const processedVideos = /* @__PURE__ */ new WeakSet();
  const processedTweets = /* @__PURE__ */ new WeakSet();
  const getSettings = () => JSON.parse(localStorage.getItem(STORAGE_KEY$1) || "{}");
  const mountHoverButton = (hostElement, settingKey, renderCallback) => {
    const container = document.createElement("div");
    container.style.display = "none";
    hostElement.appendChild(container);
    const showButton = () => {
      const shouldShow = getSettings()[settingKey] !== false;
      container.style.display = shouldShow ? "block" : "none";
      if (shouldShow) renderCallback(container);
    };
    renderCallback(container);
    hostElement.addEventListener("mouseenter", showButton);
    hostElement.addEventListener("mouseleave", () => container.style.display = "none");
  };
  const ensureRelativePosition = (element) => {
    const style = getComputedStyle(element);
    if (style.position === "static") {
      element.style.position = "relative";
    }
  };
  function setupUniversalDownloadButton(tweetElement) {
    if (processedTweets.has(tweetElement)) return;
    const actionGroup = Array.from(tweetElement.querySelectorAll('div[role="group"]')).find(
      (group) => {
        const ariaLabel = group.getAttribute("aria-label");
        return ariaLabel && ariaLabel.includes("likes");
      }
    );
    if (!actionGroup) return;
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = "display: inline-flex; align-items: center; margin-left: auto;";
    actionGroup.appendChild(buttonContainer);
    const renderButton = () => preact2.render(/* @__PURE__ */ jsxRuntime2.jsx(UniversalDownloadButton, { tweetContainer: tweetElement }), buttonContainer);
    renderButton();
    let timeoutId = null;
    actionGroup.addEventListener("mouseenter", () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = window.setTimeout(renderButton, 50);
    });
    processedTweets.add(tweetElement);
  }
  const isTargetImage = (img) => Boolean(img.src) && img.src.startsWith("https://pbs.twimg.com/media/");
  function setupImageInteraction(img) {
    if (processedImages.has(img) || !isTargetImage(img)) return;
    const tweetContainer = findTweetContainer(img);
    if (tweetContainer) setupUniversalDownloadButton(tweetContainer);
    const imageContainer = img.parentElement?.parentElement;
    if (!imageContainer) return;
    ensureRelativePosition(imageContainer);
    mountHoverButton(imageContainer, "showDownloadButton", (container) => {
      preact2.render(/* @__PURE__ */ jsxRuntime2.jsx(ImageDownloadButton, { targetImage: img, tweetContainer }), container);
    });
    processedImages.add(img);
  }
  function setupVideoInteraction(video) {
    if (processedVideos.has(video)) return;
    if (isInsideQuoteTweet(video)) {
      return;
    }
    const tweetContainer = findTweetContainer(video);
    if (!tweetContainer) return;
    setupUniversalDownloadButton(tweetContainer);
    const videoContainer = findVideoContainer(video) || findVideoPlayerContainer(video);
    if (!videoContainer) return;
    mountHoverButton(videoContainer, "showVideoDownloadButton", (container) => {
      preact2.render(/* @__PURE__ */ jsxRuntime2.jsx(VideoDownloadButton, { src: video.src, tweetContainer }), container);
    });
    processedVideos.add(video);
  }
  const scanNodeForMedia = (node) => {
    if (node instanceof HTMLImageElement && isTargetImage(node)) {
      setupImageInteraction(node);
    } else if (node.firstChild instanceof HTMLVideoElement) {
      setupVideoInteraction(node.firstChild);
    } else if (node instanceof Element || node instanceof Document || node instanceof DocumentFragment) {
      node.querySelectorAll(IMAGE_SELECTOR).forEach((img) => setupImageInteraction(img));
      node.querySelectorAll(VIDEO_SELECTOR).forEach((video) => setupVideoInteraction(video));
    }
  };
  function watchForMedia() {
    const pendingNodes = /* @__PURE__ */ new Set();
    let rafId = null;
    const scheduleScan = (node) => {
      pendingNodes.add(node);
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        pendingNodes.forEach((pendingNode) => {
          scanNodeForMedia(pendingNode);
        });
        pendingNodes.clear();
      });
    };
    scheduleScan(document);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          scheduleScan(node);
        });
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      // 不监听属性变化
      characterData: false
      // 不监听文本变化
    });
    const cleanup = () => {
      observer.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      pendingNodes.clear();
    };
    window.addEventListener("beforeunload", cleanup);
  }
  function initializeApp() {
    const appContainer = document.createElement("div");
    appContainer.id = "x-downloader-app";
    document.body.appendChild(appContainer);
    preact2.render(/* @__PURE__ */ jsxRuntime2.jsx(App, {}), appContainer);
    watchForMedia();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }
})(jsxRuntime, preact, preactHooks, goober, preactSignalsCore);
