// ==UserScript==
// @name         微博PC直播弹幕助手
// @namespace    npm/weibo-pc-live-comments
// @version      1.3.1
// @author       MAXLZ
// @description  在微博PC端生成弹幕。
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @match        https://weibo.com/l/wblive/p/show/*
// @require      https://cdn.jsdelivr.net/npm/umd-react@19.2.0/dist/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/umd-react@19.2.0/dist/react-dom.production.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551427/%E5%BE%AE%E5%8D%9APC%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/551427/%E5%BE%AE%E5%8D%9APC%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function (React, ReactDOM) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const React__namespace = _interopNamespaceDefault(React);

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production = {};
  /**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var hasRequiredReactJsxRuntime_production;
  function requireReactJsxRuntime_production() {
    if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
    hasRequiredReactJsxRuntime_production = 1;
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
    function jsxProd(type, config, maybeKey) {
      var key = null;
      void 0 !== maybeKey && (key = "" + maybeKey);
      void 0 !== config.key && (key = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          "key" !== propName && (maybeKey[propName] = config[propName]);
      } else maybeKey = config;
      config = maybeKey.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== config ? config : null,
        props: maybeKey
      };
    }
    reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
    reactJsxRuntime_production.jsx = jsxProd;
    reactJsxRuntime_production.jsxs = jsxProd;
    return reactJsxRuntime_production;
  }
  var hasRequiredJsxRuntime;
  function requireJsxRuntime() {
    if (hasRequiredJsxRuntime) return jsxRuntime.exports;
    hasRequiredJsxRuntime = 1;
    {
      jsxRuntime.exports = requireReactJsxRuntime_production();
    }
    return jsxRuntime.exports;
  }
  var jsxRuntimeExports = requireJsxRuntime();
  const indexCss$e = ".danmu-switch{display:flex;align-items:center;justify-self:center;cursor:pointer;margin-right:24px;padding-top:2px}.wbp-video.wbpv-fullscreen .danmu-switch{height:70px;padding-bottom:2px;padding-top:0;margin-right:40px}.danmu-switch:hover{color:#ff8200}";
  importCSS(indexCss$e);
  const indexCss$d = ".chart-history-panel-box{position:relative;box-shadow:0 0 5px 4px #2828280d;border-radius:8px;height:calc(100vh - 10px - var(--weibo-top-nav-height) - 30px);display:flex;flex-direction:column}.chart-history-panel-wrapper{position:relative;overflow:hidden;flex:1}.chart-history-panel{width:100%;height:100%;padding:10px;overflow-y:auto;box-sizing:border-box}.chart-history-panel .comments-list{width:100%;line-height:22px;font-size:13px}.chart-history-panel-box .chart-control-panel{height:35px}.chart-history-panel-box .bottom-button{position:absolute;bottom:15px;left:0;right:0;margin:auto;width:110px;opacity:0;transform:translateY(10px);transition:all .3s ease;display:flex;align-items:center;justify-content:center;font-size:12px;padding:8px 4px;z-index:1}.chart-history-panel-box .bottom-button .arrow-down{height:16px;width:16px;margin-right:4px}.chart-history-panel-box .bottom-button.visible{transform:translateY(0);opacity:.9}.chart-history-panel-box .sending-form{box-sizing:border-box;padding:10px}.chart-history-panel-box .sending-form [class^=Composer_iconbox2_]{margin:0}.chart-history-panel-box .sending-form .woo-pop-main{transform:translate3d(-100%,-100%,0)}";
  importCSS(indexCss$d);
  function createLocalStorageStore(key, initialValue) {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify(initialValue));
    }
    const listeners = new Set();
    let lastSnapshot = read();
    function read() {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch {
        return initialValue;
      }
    }
    function subscribe(listener) {
      listeners.add(listener);
      const onStorage = (e) => {
        if (e.key === key)
          listeners.forEach(
            (l) => l(e.newValue ? JSON.parse(e.newValue) : {})
          );
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    }
    function getSnapshot() {
      const next = read();
      if (JSON.stringify(next) !== JSON.stringify(lastSnapshot)) {
        lastSnapshot = next;
      }
      return lastSnapshot;
    }
    function setValue(value) {
      const newValue = value instanceof Function ? value(getSnapshot()) : value;
      localStorage.setItem(key, JSON.stringify(newValue));
      listeners.forEach((l) => l(newValue));
    }
    return {
      subscribe,
      useStore: () => React.useSyncExternalStore(subscribe, getSnapshot),
      setValue,
      getSnapshot
    };
  }
  const blockedWordsStore = createLocalStorageStore(
    `${"weibo-pc-live-comments"}-block-words"`,
    []
  );
  function addBlockedWord(word) {
    blockedWordsStore.setValue((prev) => {
      const trimedWord = word.trim();
      if (!trimedWord) return prev;
      const newWords = Array.from( new Set([trimedWord, ...prev]));
      return newWords;
    });
  }
  function removeBlockedWord(word) {
    blockedWordsStore.setValue((prev) => prev.filter((w) => w !== word));
  }
  function clearBlockedWords() {
    blockedWordsStore.setValue([]);
  }
  const localStorageStore = createLocalStorageStore(
    `${"weibo-pc-live-comments"}-global-setting"`,
    {
      autoSearchLive: true,
      autoRedirectLive: false,
      requestGap: Number("3"),
      maxCommentsNum: Number("200"),
      commentSpeed: Number("8")
    }
  );
  const globalSettingStore = {
    getGlobalSetting: localStorageStore.getSnapshot,
    setGlobalSetting: localStorageStore.setValue,
    useGlobalSetting: localStorageStore.useStore,
    subscribe: localStorageStore.subscribe
  };
  function createCommentsStore() {
    let comments = [];
    const subscribers = new Set();
    const getComments2 = () => comments;
    const setComments = (newComments) => {
      const { maxCommentsNum } = globalSettingStore.getGlobalSetting();
      const prevIds = new Set(comments.map((c) => c.id));
      const merged = Array.from(
        new Map([...comments, ...newComments].map((c) => [c.id, c])).values()
      ).slice(-maxCommentsNum);
      const added = merged.filter((c) => !prevIds.has(c.id));
      if (added.length === 0) return;
      comments = merged;
      subscribers.forEach((sub) => sub(added));
    };
    const subscribe = (sub) => {
      subscribers.add(sub);
      return () => subscribers.delete(sub);
    };
    return { getComments: getComments2, setComments, subscribe };
  }
  const commentsStore = createCommentsStore();
  const addComments = (newComments) => {
    commentsStore.setComments(newComments);
  };
  const commentSwitchStore = createLocalStorageStore(
    `${"weibo-pc-live-comments"}-video-comments-enabled"`,
    true
  );
  function useBlockedWords() {
    const value = blockedWordsStore.useStore();
    return [
      value,
      { addBlockedWord, removeBlockedWord, clearBlockedWords }
    ];
  }
  function useComments() {
    return React.useSyncExternalStore(
      commentsStore.subscribe,
      commentsStore.getComments
    );
  }
  function useIncrementalComments() {
    const [added, setAdded] = React.useState([]);
    React.useEffect(() => {
      const unsubscribe = commentsStore.subscribe((newAdded) => {
        setAdded(newAdded);
      });
      return () => {
        unsubscribe();
      };
    }, []);
    return added;
  }
  function useCommentSwitch() {
    return [commentSwitchStore.useStore(), commentSwitchStore.setValue];
  }
  function useControllableState({
    value,
    defaultValue,
    onChange
  }) {
    const update = useUpdate();
    const isControlled = value !== void 0;
    const stateRef = React.useRef(isControlled ? value : defaultValue);
    if (isControlled) {
      stateRef.current = value;
    }
    const setState = React.useCallback(
      (v) => {
        const nextValue = typeof v === "function" ? v(stateRef.current) : v;
        if (nextValue === stateRef.current) return;
        if (!isControlled) {
          stateRef.current = nextValue;
          update();
        }
        onChange?.(nextValue);
      },
      [onChange, update]
    );
    return [stateRef.current, setState];
  }
  const useUpdate = () => {
    const [, setState] = React.useState({});
    return React.useCallback(() => setState({}), []);
  };
  function useGlobalSetting() {
    const value = globalSettingStore.useGlobalSetting();
    return [value, globalSettingStore.setGlobalSetting];
  }
  function WButton({
    children,
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      "button",
      {
        className: `woo-button-main woo-button-flat woo-button-primary woo-button-m woo-button-round ${className}`,
        ...props,
        children
      }
    );
  }
  const SvgArrowDownward = (props) => React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "24px", viewBox: "0 0 24 24", width: "24px", fill: "currentColor", ...props }, React__namespace.createElement("path", { d: "M0 0h24v24H0V0z", fill: "none" }), React__namespace.createElement("path", { d: "M11 5v11.17l-4.88-4.88c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L13 16.17V5c0-.55-.45-1-1-1s-1 .45-1 1z" }));
  const indexCss$c = ".chat-control-panel-box{display:flex;align-items:center;justify-content:flex-start;padding:4px 10px;color:#929292;gap:10px;position:relative;border-top:1px solid rgba(189,189,189,.4)}.chat-control-panel-box .control-icon{height:26px;width:26px;cursor:pointer}.chat-control-panel-box .control-icon:hover{color:var(--w-brand)}";
  importCSS(indexCss$c);
  const SvgBlockedMessage = (props) => React__namespace.createElement("svg", { t: 1759738789170, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1306, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M478.0032 753.1008H165.2736c-19.0464-0.01024-34.47808-15.33952-34.5088-34.26304l0.1024-516.83328h658.70848c18.96448 0 34.31424 15.53408 34.31424 34.58048v174.22336c0 19.01568 15.5136 34.43712 34.6624 34.43712 19.13856 0 34.65216-15.42144 34.65216-34.43712V236.58496C893.2864 179.6096 846.9504 133.3248 789.61664 133.12H130.85696C92.63104 133.05856 61.57312 163.77856 61.44 201.76896v517.0688c0.1024 56.9344 46.53056 103.07584 103.8336 103.15776h312.7296c19.13856 0 34.65216-15.42144 34.65216-34.44736 0-19.02592-15.5136-34.44736-34.65216-34.44736", fill: "currentColor", "p-id": 1307 }), React__namespace.createElement("path", { d: "M373.37088 477.55264H234.73152c-19.1488 0-34.6624 15.42144-34.6624 34.44736 0 19.02592 15.52384 34.44736 34.6624 34.44736h138.63936c19.13856 0 34.65216-15.42144 34.65216-34.44736 0-19.02592-15.5136-34.44736-34.65216-34.44736m0 137.7792H234.73152c-19.1488 0-34.6624 15.42144-34.6624 34.44736 0 19.01568 15.52384 34.43712 34.6624 34.43712h138.63936c19.13856 0 34.65216-15.42144 34.65216-34.43712 0-19.02592-15.5136-34.44736-34.65216-34.44736M512 339.7632H234.73152c-19.1488 0-34.6624 15.43168-34.6624 34.44736 0 19.02592 15.52384 34.44736 34.6624 34.44736H512c19.1488 0 34.6624-15.42144 34.6624-34.44736 0-19.01568-15.52384-34.43712-34.6624-34.43712m242.60608 482.2016c-76.45184 0-138.62912-61.78816-138.62912-137.76896 0-25.48736 7.45472-49.0496 19.65056-69.53984l188.95872 187.79136a137.44128 137.44128 0 0 1-69.98016 19.52768m0-275.5584c76.46208 0 138.63936 61.7984 138.63936 137.7792 0 25.4976-7.45472 49.0496-19.6608 69.53984L684.6464 565.97504a137.44128 137.44128 0 0 1 69.96992-19.52768m0-68.89472c-114.688 0-207.94368 92.69248-207.94368 206.66368C546.6624 798.18752 639.92832 890.88 754.60608 890.88 869.29408 890.88 962.56 798.18752 962.56 684.21632c0-113.9712-93.26592-206.66368-207.95392-206.66368", fill: "currentColor", "p-id": 1308 }));
  const ToolPanelCss = ".tool-panel-main{box-sizing:border-box;position:absolute;bottom:calc(100% - 10px);left:-1px;right:-1px;background-color:#fff;transition:all .3s ease;opacity:0;pointer-events:none;z-index:99}.tool-panel-main.open{bottom:100%;opacity:1;pointer-events:initial}.tool-panel-main .tool-panel-title{background-color:#eae6e6;font-size:14px;color:#333;padding:10px;border-radius:6px 6px 0 0;display:flex;align-items:center;justify-content:space-between}.tool-panel-main .tool-panel-title .close-icon{width:16px;height:16px;cursor:pointer}.tool-panel-main .tool-panel-title .close-icon:hover{color:#979797}.tool-panel-main .tool-panel-content{padding:10px}";
  importCSS(ToolPanelCss);
  const SvgClose = (props) => React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "24px", viewBox: "0 0 24 24", width: "24px", fill: "currentColor", ...props }, React__namespace.createElement("path", { d: "M0 0h24v24H0V0z", fill: "none" }), React__namespace.createElement("path", { d: "M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" }));
  function ToolPanel({
    children,
    open,
    onClose,
    slots: { title, content }
  }) {
    const handleClose = () => {
      onClose && onClose();
    };
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      children,
jsxRuntimeExports.jsxs("div", { className: `tool-panel-main ${open ? "open" : ""}`, children: [
jsxRuntimeExports.jsxs("div", { className: "tool-panel-title", children: [
jsxRuntimeExports.jsx("span", { children: title }),
jsxRuntimeExports.jsx(SvgClose, { className: "close-icon", onClick: handleClose })
        ] }),
jsxRuntimeExports.jsx("div", { className: "tool-panel-content", children: content })
      ] })
    ] });
  }
  const indexCss$b = ".blocked-word-form{margin-top:10px;display:flex;gap:10px}.blocked-word-form .blocked-word-input{flex:1}";
  importCSS(indexCss$b);
  const FormContext = React.createContext(null);
  const useFormContext = () => {
    const ctx = React.useContext(FormContext);
    return ctx;
  };
  const FormItemContext = React.createContext(null);
  const useFormItemContext = () => {
    const ctx = React.useContext(FormItemContext);
    return ctx;
  };
  function WInput({
    defaultValue,
    className,
    ...props
  }) {
    const { value, onChange, name: nameInProps, ...rest } = props;
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    let name = nameInProps;
    if (formItemContext) {
      const { name: nameInContext } = formItemContext;
      if (name === void 0) name = nameInContext;
    }
    let realDefaultValue = defaultValue;
    if (formContext && name && realDefaultValue === void 0) {
      realDefaultValue = formContext.values?.[name];
    }
    const [currentValue, setCurrentValue] = useControllableState(
      {
        value,
        defaultValue: realDefaultValue
      }
    );
    const handleChange = (e) => {
      const val = e.target.value;
      setCurrentValue(val);
      if (formContext && name !== void 0) {
        formContext.setFieldValue?.(name, val);
      }
      onChange?.(e);
    };
    React.useEffect(() => {
      if (defaultValue && formContext && name) {
        formContext?.setFieldValue?.(name, defaultValue);
      }
    }, []);
    return jsxRuntimeExports.jsx("div", { className: `woo-input-wrap ${className}`, children: jsxRuntimeExports.jsx(
      "input",
      {
        className: "woo-input-main",
        name,
        value: currentValue,
        onChange: handleChange,
        ...rest
      }
    ) });
  }
  function BlockedWordForm() {
    const [blockedWord, setBlockedWord] = React.useState("");
    const [, { addBlockedWord: addBlockedWord2 }] = useBlockedWords();
    function handleBlockedWordChange(e) {
      setBlockedWord(e.target.value);
    }
    function handleSubmit(e) {
      e.preventDefault();
      if (!blockedWord.trim()) return;
      addBlockedWord2(blockedWord);
      setBlockedWord("");
    }
    return jsxRuntimeExports.jsxs("form", { className: "blocked-word-form", onSubmit: handleSubmit, children: [
jsxRuntimeExports.jsx(
        WInput,
        {
          className: "blocked-word-input",
          placeholder: "请输入关键字（支持正则表达式）",
          name: "filterWord",
          type: "text",
          value: blockedWord,
          onChange: handleBlockedWordChange
        }
      ),
jsxRuntimeExports.jsx(WButton, { type: "submit", className: "woo-button-s", children: "添加屏蔽词" })
    ] });
  }
  const indexCss$a = ".blocked-word-list{margin-top:10px;max-height:200px;overflow-y:auto;border:1px solid rgba(255,255,255,.2);border-radius:6px;box-sizing:border-box;padding:0;font-size:12px}.clear-blocked-words{width:100%;text-align:center;margin-top:10px;font-size:14px}.clear-blocked-words a{cursor:pointer}.clear-blocked-words a:hover{color:var(--w-brand);text-decoration:underline}.no-blocked-words{text-align:center;color:#929292;padding:20px 0;font-size:14px}";
  importCSS(indexCss$a);
  const BlockedWordItemCss = ".blocked-word-item{display:flex;justify-content:space-between;align-items:center;padding:4px 8px;border-radius:4px}.blocked-word-item:hover{background-color:#8989891a}.blocked-word-item .blocked-word-item-left{display:flex;align-items:center;gap:10px;flex:1}.blocked-word-item .blocked-word-item-left .blocked-word-text{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:250px}.blocked-word-item>.clear{margin-left:8px;cursor:pointer;font-size:12px;padding:2px;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center}.blocked-word-item>.clear:hover{color:var(--w-brand)}@media screen and (max-width: 1319px){.blocked-word-item .blocked-word-item-left .blocked-word-text{max-width:200px}}";
  importCSS(BlockedWordItemCss);
  const SvgTrash = (props) => React__namespace.createElement("svg", { t: 1759756521143, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1701, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M640 192h192v64h-64v576l-64 64H256l-64-64V256H128V192h192V128a64 64 0 0 1 64-64h192a64 64 0 0 1 64 64v64zM576 128H384v64h192V128zM256 832h448V256H256v576z m128-512H320v448h64V320z m64 0h64v448H448V320z m128 0h64v448H576V320z", fill: "currentColor", "p-id": 1702 }));
  function BlcokedWordItem({
    word,
    onClear,
    index
  }) {
    const handleClick = () => {
      onClear && onClear(word);
    };
    return jsxRuntimeExports.jsxs("li", { className: "blocked-word-item", children: [
jsxRuntimeExports.jsxs("div", { className: "blocked-word-item-left", children: [
jsxRuntimeExports.jsxs("span", { children: [
          index,
          "."
        ] }),
jsxRuntimeExports.jsx("span", { className: "blocked-word-text", children: word })
      ] }),
jsxRuntimeExports.jsx(SvgTrash, { className: "clear", onClick: handleClick })
    ] });
  }
  function BlcokedWordList() {
    const [blockedWords, { removeBlockedWord: removeBlockedWord2, clearBlockedWords: clearBlockedWords2 }] = useBlockedWords();
    const handleClear = (word) => {
      removeBlockedWord2(word);
    };
    const handleClearAll = () => {
      clearBlockedWords2();
    };
    return blockedWords.length > 0 ? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx("ul", { className: "blocked-word-list", children: blockedWords.map((word, index) => jsxRuntimeExports.jsx(
        BlcokedWordItem,
        {
          word,
          index: index + 1,
          onClear: handleClear
        },
        word
      )) }),
jsxRuntimeExports.jsx("div", { className: "clear-blocked-words", children: jsxRuntimeExports.jsx("a", { onClick: handleClearAll, children: "清空屏蔽词" }) })
    ] }) : jsxRuntimeExports.jsx("div", { className: "no-blocked-words", children: "当前暂未设置屏蔽词" });
  }
  function ChatControlPanel({ className }) {
    const [open, setOpen] = React.useState(false);
    const handleBlockedWordToolPanelClose = () => {
      setOpen(false);
    };
    const handleBlockedWordControlClick = () => {
      setOpen(!open);
    };
    return jsxRuntimeExports.jsx("div", { className: `chat-control-panel-box ${className}`, children: jsxRuntimeExports.jsx(
      ToolPanel,
      {
        open,
        onClose: handleBlockedWordToolPanelClose,
        slots: {
          title: "屏蔽词管理",
          content: jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(BlockedWordForm, {}),
jsxRuntimeExports.jsx(BlcokedWordList, {})
          ] })
        },
        children: jsxRuntimeExports.jsx(
          SvgBlockedMessage,
          {
            className: "control-icon",
            onClick: handleBlockedWordControlClick
          }
        )
      }
    ) });
  }
  const CommentItemCss = ".comment-item{word-wrap:break-word;word-break:break-word;white-space:pre-wrap;margin:2px 0;padding:4px;border-radius:4px}.comment-item:hover{background-color:#d8d8d84d}.comment-item .avatar{width:24px;border-radius:50%;margin-right:4px;vertical-align:middle}.comment-item .fans-icon{height:14px;vertical-align:middle;margin-right:4px}.comment-item .comment-user{color:var(--w-alink);text-decoration:none;cursor:pointer;margin-right:2px}.comment-item .comment-text img{width:16px;height:16px;vertical-align:text-bottom}.comment-item .comment-text a{color:var(--w-alink);text-decoration:none;cursor:pointer}";
  importCSS(CommentItemCss);
  function CommentItem({ comment }) {
    const {
      user: { fansIcon, avatar_large }
    } = comment;
    return jsxRuntimeExports.jsxs("div", { className: "comment-item", children: [
      avatar_large && jsxRuntimeExports.jsx("img", { src: avatar_large, className: "avatar", alt: "" }),
jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://weibo.com/u/${comment.user.id}`,
          className: "comment-user",
          target: "_blank",
          rel: "noopener noreferrer",
          children: comment.user.screen_name
        }
      ),
      fansIcon?.icon_url && jsxRuntimeExports.jsx("img", { src: fansIcon.icon_url, className: "fans-icon", alt: "" }),
      ":",
jsxRuntimeExports.jsx(
        "span",
        {
          dangerouslySetInnerHTML: { __html: comment.text },
          className: "comment-text"
        }
      )
    ] }, comment.id);
  }
  function moveSendingForm(container) {
    const sendingForm = document.querySelector(
      '[class^="Tit_wrap"] + div > .woo-box-flex'
    );
    if (sendingForm) {
      sendingForm.classList.add("sending-form");
      container.appendChild(sendingForm);
    }
  }
  function ChatHistoryPanel() {
    const comments = useComments();
    const incrementalComments = useIncrementalComments();
    const [globalSetting] = useGlobalSetting();
    const [newCount, setNewCount] = React.useState(0);
    const listRef = React.useRef(null);
    const boxRef = React.useRef(null);
    const [atBottom, setAtBottom] = React.useState(true);
    const lastSeenCount = React.useRef(0);
    const handleScroll = React.useCallback(() => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setAtBottom(isBottom);
    }, []);
    React.useEffect(() => {
      if (incrementalComments.length === 0) return;
      if (atBottom) {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
        lastSeenCount.current = incrementalComments.length;
      } else {
        const delta = incrementalComments.length - lastSeenCount.current;
        if (delta >= 0) {
          setNewCount(
            (prev) => Math.min(prev + delta, globalSetting.maxCommentsNum)
          );
          lastSeenCount.current = 0;
        }
      }
    }, [incrementalComments, atBottom, globalSetting.maxCommentsNum]);
    React.useEffect(() => {
      const el = listRef.current;
      if (!el) return;
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);
    React.useEffect(() => {
      boxRef.current && moveSendingForm(boxRef.current);
    }, []);
    const scrollToBottom = () => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    };
    return jsxRuntimeExports.jsxs("div", { className: "chart-history-panel-box", ref: boxRef, children: [
jsxRuntimeExports.jsxs("div", { className: "chart-history-panel-wrapper", children: [
jsxRuntimeExports.jsx("div", { className: "chart-history-panel", ref: listRef, children: jsxRuntimeExports.jsx("div", { className: "comments-list", children: comments.map((comment) => jsxRuntimeExports.jsx(CommentItem, { comment }, comment.id)) }) }),
jsxRuntimeExports.jsxs(
          WButton,
          {
            className: `bottom-button ${!atBottom && newCount > 0 ? "visible" : ""}`,
            onClick: scrollToBottom,
            onTransitionEnd: (e) => {
              if (e.propertyName === "opacity" && atBottom) {
                setNewCount(0);
              }
            },
            children: [
jsxRuntimeExports.jsx(SvgArrowDownward, { className: "arrow-down" }),
              newCount,
              "条新弹幕"
            ]
          }
        )
      ] }),
jsxRuntimeExports.jsx(ChatControlPanel, { className: "chart-control-panel" })
    ] });
  }
  function extractDisplayComments(comments) {
    const res = [];
    for (let i = 0; i < comments.length; i++) {
      if (!skipComment(comments[i])) {
        res.unshift(comments[i]);
      }
    }
    return res;
  }
  function skipComment(comment) {
    const blockedWords = blockedWordsStore.getSnapshot();
    return blockedWords.length > 0 && blockedWords.some((word) => {
      if (!word || !comment) return false;
      try {
        return new RegExp(word, "i").test(comment.text_raw);
      } catch (e) {
        return comment.text_raw.includes(word);
      }
    });
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function injectCSS(css) {
    const style2 = document.createElement("style");
    style2.textContent = css;
    document.head.appendChild(style2);
  }
  var reactDom = { exports: {} };
  var reactDom_production = {};
  /**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var hasRequiredReactDom_production;
  function requireReactDom_production() {
    if (hasRequiredReactDom_production) return reactDom_production;
    hasRequiredReactDom_production = 1;
    var React2 = React;
    function formatProdErrorMessage(code) {
      var url = "https://react.dev/errors/" + code;
      if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var i = 2; i < arguments.length; i++)
          url += "&args[]=" + encodeURIComponent(arguments[i]);
      }
      return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function noop2() {
    }
    var Internals = {
      d: {
        f: noop2,
        r: function() {
          throw Error(formatProdErrorMessage(522));
        },
        D: noop2,
        C: noop2,
        L: noop2,
        m: noop2,
        X: noop2,
        S: noop2,
        M: noop2
      },
      p: 0,
      findDOMNode: null
    }, REACT_PORTAL_TYPE = Symbol.for("react.portal");
    function createPortal$1(children, containerInfo, implementation) {
      var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return {
        $$typeof: REACT_PORTAL_TYPE,
        key: null == key ? null : "" + key,
        children,
        containerInfo,
        implementation
      };
    }
    var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function getCrossOriginStringAs(as, input) {
      if ("font" === as) return "";
      if ("string" === typeof input)
        return "use-credentials" === input ? input : "";
    }
    reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
    reactDom_production.createPortal = function(children, container) {
      var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
        throw Error(formatProdErrorMessage(299));
      return createPortal$1(children, container, null, key);
    };
    reactDom_production.flushSync = function(fn) {
      var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
      try {
        if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
      } finally {
        ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
      }
    };
    reactDom_production.preconnect = function(href, options) {
      "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
    };
    reactDom_production.prefetchDNS = function(href) {
      "string" === typeof href && Internals.d.D(href);
    };
    reactDom_production.preinit = function(href, options) {
      if ("string" === typeof href && options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
        "style" === as ? Internals.d.S(
          href,
          "string" === typeof options.precedence ? options.precedence : void 0,
          {
            crossOrigin,
            integrity,
            fetchPriority
          }
        ) : "script" === as && Internals.d.X(href, {
          crossOrigin,
          integrity,
          fetchPriority,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
      }
    };
    reactDom_production.preinitModule = function(href, options) {
      if ("string" === typeof href)
        if ("object" === typeof options && null !== options) {
          if (null == options.as || "script" === options.as) {
            var crossOrigin = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            );
            Internals.d.M(href, {
              crossOrigin,
              integrity: "string" === typeof options.integrity ? options.integrity : void 0,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0
            });
          }
        } else null == options && Internals.d.M(href);
    };
    reactDom_production.preload = function(href, options) {
      if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
        Internals.d.L(href, as, {
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          type: "string" === typeof options.type ? options.type : void 0,
          fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
          referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
          imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
          imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
          media: "string" === typeof options.media ? options.media : void 0
        });
      }
    };
    reactDom_production.preloadModule = function(href, options) {
      if ("string" === typeof href)
        if (options) {
          var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
          Internals.d.m(href, {
            as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0
          });
        } else Internals.d.m(href);
    };
    reactDom_production.requestFormReset = function(form) {
      Internals.d.r(form);
    };
    reactDom_production.unstable_batchedUpdates = function(fn, a) {
      return fn(a);
    };
    reactDom_production.useFormState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useFormState(action, initialState, permalink);
    };
    reactDom_production.useFormStatus = function() {
      return ReactSharedInternals.H.useHostTransitionStatus();
    };
    reactDom_production.version = "19.2.0";
    return reactDom_production;
  }
  var hasRequiredReactDom;
  function requireReactDom() {
    if (hasRequiredReactDom) return reactDom.exports;
    hasRequiredReactDom = 1;
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    {
      checkDCE();
      reactDom.exports = requireReactDom_production();
    }
    return reactDom.exports;
  }
  var reactDomExports = requireReactDom();
  const indexCss$9 = ".weibo-message{width:100%;padding:8px;text-align:center}.weibo-message .weibo-message-wrapper{display:inline-block;padding:10px 12px;background-color:#fff;border-radius:8px;box-shadow:0 6px 16px #00000014,0 3px 6px -4px #0000001f,0 9px 28px 8px #0000000d;pointer-events:all}.weibo-message .weibo-message-wrapper.leaving{animation:.3s ease messageOut}.weibo-message .weibo-message-wrapper .weibo-message-content{display:flex;align-items:center}.weibo-message .weibo-message-wrapper .weibo-message-content .message-action{display:flex;align-items:center;margin-right:8px}.weibo-message .weibo-message-wrapper .weibo-message-content .message-action svg{width:20px;height:20px}.weibo-message .weibo-message-wrapper .weibo-message-content .message-action svg.info{color:var(--w-tip-fill-help)}.weibo-message .weibo-message-wrapper .weibo-message-content .message-action svg.success{color:var(--w-tip-fill-success)}.weibo-message .weibo-message-wrapper .weibo-message-content .message-action svg.error{color:var(--w-tip-fill-error)}@keyframes messageIn{0%{transform:translateY(-20px);opacity:0}to{transform:translateY(-0);opacity:1}}@keyframes messageOut{0%{transform:translateY(-0);opacity:1}to{transform:translateY(-20px);opacity:0}}";
  importCSS(indexCss$9);
  const SvgInfo = (props) => React__namespace.createElement("svg", { t: 1759897832368, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1426, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M512 85.333333a426.666667 426.666667 0 1 0 426.666667 426.666667A426.666667 426.666667 0 0 0 512 85.333333z m42.666667 597.333334a42.666667 42.666667 0 0 1-85.333334 0v-213.333334a42.666667 42.666667 0 0 1 85.333334 0z m-42.666667-298.666667a42.666667 42.666667 0 1 1 42.666667-42.666667 42.666667 42.666667 0 0 1-42.666667 42.666667z", "p-id": 1427, fill: "currentColor" }));
  const SvgError = (props) => React__namespace.createElement("svg", { t: 1759897837149, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1590, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M512 92q178.14 4.68 296.73 123.27T932 512q-4.68 178.14-123.27 296.73T512 932q-178.14-4.68-296.73-123.27T92 512q4.68-178.14 123.27-296.73T512 92z m0 369.39l-97.5-97.5q-11.25-11.25-25.77-11.25t-25.32 10.77-10.77 25.32 11.25 25.77l97.5 97.5-97.5 97.5q-11.25 11.25-11.25 25.77t10.77 25.32 25.32 10.77 25.77-11.25l97.5-97.5 97.5 97.5q15 14.07 34.68 8.91t24.84-24.84-8.91-34.68L562.61 512l97.5-97.5q11.25-11.25 11.25-25.77t-10.77-25.32-25.32-10.77-25.77 11.25z", "p-id": 1591, fill: "currentColor" }));
  const SvgSuccess = (props) => React__namespace.createElement("svg", { t: 1759897842881, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1754, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M512 81.92c121.60032 3.19968 222.88032 45.28032 303.84 126.24S938.88032 390.39968 942.08 512c-3.19968 121.60032-45.28032 222.88032-126.24 303.84S633.60032 938.88032 512 942.08c-121.60032-3.19968-222.88032-45.28032-303.84-126.24S85.11968 633.60032 81.92 512c3.19968-121.60032 45.28032-222.88032 126.24-303.84S390.39968 85.11968 512 81.92z m-53.76 514.56l-95.04-95.04c-7.68-7.03968-16.48032-10.56-26.4-10.56-9.91968 0-18.55968 3.67968-25.92 11.04-7.36032 7.36032-11.04 15.84-11.04 25.44s3.52032 18.24 10.56 25.92l121.92 121.92c7.03968 7.03968 15.67968 10.56 25.92 10.56 10.24032 0 18.88032-3.52032 25.92-10.56l252.48-252.48c9.6-9.6 12.64032-21.28032 9.12-35.04-3.52032-13.75968-12.16032-22.39968-25.92-25.92-13.75968-3.52032-25.44-0.48-35.04 9.12L458.24 596.48z", "p-id": 1755, fill: "currentColor" }));
  const SvgSpin = (props) => React__namespace.createElement("svg", { "data-v-8211": "", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 50 50", className: "wbpv-loading-spinner-wrap", style: {
    fontSize: 50,
    color: "#FF8200"
  }, ...props }, React__namespace.createElement("g", { fill: "none", strokeWidth: 5, strokeMiterlimit: 10, stroke: "currentColor", style: {
    animation: "2s linear 0s infinite normal none running woo-spinner-_-rotate",
    height: 50,
    transformOrigin: "center center",
    width: 50
  } }, React__namespace.createElement("circle", { cx: 25, cy: 25, r: 20, opacity: 0.3 }), React__namespace.createElement("circle", { cx: 25, cy: 25, r: 20, strokeDasharray: "25,200", strokeLinecap: "round", style: {
    animation: "1.5s ease-in-out 0s infinite normal none running woo-spinner-_-dash"
  } })));
  const iconMap = {
    info: jsxRuntimeExports.jsx(SvgInfo, { className: "info" }),
    error: jsxRuntimeExports.jsx(SvgError, { className: "error" }),
    success: jsxRuntimeExports.jsx(SvgSuccess, { className: "success" }),
    loading: jsxRuntimeExports.jsx(SvgSpin, {})
  };
  function WMessage({ children, type }) {
    return jsxRuntimeExports.jsx("div", { className: "weibo-message", children: jsxRuntimeExports.jsx("div", { className: "weibo-message-wrapper", children: jsxRuntimeExports.jsxs("div", { className: "weibo-message-content", children: [
jsxRuntimeExports.jsx("span", { className: "message-action", children: iconMap[type ?? "info"] }),
      children
    ] }) }) });
  }
  const MessageHolderCss = ".message-container{position:fixed;top:5px;left:0;font-size:14px;pointer-events:none;z-index:99999;width:100%}";
  importCSS(MessageHolderCss);
  const LayoutGroupContext = React.createContext({});
  function useConstant(init) {
    const ref = React.useRef(null);
    if (ref.current === null) {
      ref.current = init();
    }
    return ref.current;
  }
  const isBrowser = typeof window !== "undefined";
  const useIsomorphicLayoutEffect = isBrowser ? React.useLayoutEffect : React.useEffect;
  const PresenceContext = React.createContext(null);
  function addUniqueItem(arr, item) {
    if (arr.indexOf(item) === -1)
      arr.push(item);
  }
  function removeItem(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1)
      arr.splice(index, 1);
  }
  const clamp = (min, max, v) => {
    if (v > max)
      return max;
    if (v < min)
      return min;
    return v;
  };
  let invariant = () => {
  };
  const MotionGlobalConfig = {};
  const isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }
  const isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
function memo(callback) {
    let result;
    return () => {
      if (result === void 0)
        result = callback();
      return result;
    };
  }
  const noop = (any) => any;
  const combineFunctions = (a, b) => (v) => b(a(v));
  const pipe = (...transformers) => transformers.reduce(combineFunctions);
  const progress = (from, to, value) => {
    const toFromDifference = to - from;
    return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
  };
  class SubscriptionManager {
    constructor() {
      this.subscriptions = [];
    }
    add(handler) {
      addUniqueItem(this.subscriptions, handler);
      return () => removeItem(this.subscriptions, handler);
    }
    notify(a, b, c) {
      const numSubscriptions = this.subscriptions.length;
      if (!numSubscriptions)
        return;
      if (numSubscriptions === 1) {
        this.subscriptions[0](a, b, c);
      } else {
        for (let i = 0; i < numSubscriptions; i++) {
          const handler = this.subscriptions[i];
          handler && handler(a, b, c);
        }
      }
    }
    getSize() {
      return this.subscriptions.length;
    }
    clear() {
      this.subscriptions.length = 0;
    }
  }
  const secondsToMilliseconds = (seconds) => seconds * 1e3;
  const millisecondsToSeconds = (milliseconds) => milliseconds / 1e3;
  function velocityPerSecond(velocity, frameDuration) {
    return frameDuration ? velocity * (1e3 / frameDuration) : 0;
  }
  const calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
  const subdivisionPrecision = 1e-7;
  const subdivisionMaxIterations = 12;
  function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
    let currentX;
    let currentT;
    let i = 0;
    do {
      currentT = lowerBound + (upperBound - lowerBound) / 2;
      currentX = calcBezier(currentT, mX1, mX2) - x;
      if (currentX > 0) {
        upperBound = currentT;
      } else {
        lowerBound = currentT;
      }
    } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
    return currentT;
  }
  function cubicBezier(mX1, mY1, mX2, mY2) {
    if (mX1 === mY1 && mX2 === mY2)
      return noop;
    const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
    return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
  }
  const mirrorEasing = (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
  const reverseEasing = (easing) => (p) => 1 - easing(1 - p);
  const backOut = cubicBezier(0.33, 1.53, 0.69, 0.99);
  const backIn = reverseEasing(backOut);
  const backInOut = mirrorEasing(backIn);
  const anticipate = (p) => (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
  const circIn = (p) => 1 - Math.sin(Math.acos(p));
  const circOut = reverseEasing(circIn);
  const circInOut = mirrorEasing(circIn);
  const easeIn = cubicBezier(0.42, 0, 1, 1);
  const easeOut = cubicBezier(0, 0, 0.58, 1);
  const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
  const isEasingArray = (ease2) => {
    return Array.isArray(ease2) && typeof ease2[0] !== "number";
  };
  const isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] === "number";
  const easingLookup = {
    linear: noop,
    easeIn,
    easeInOut,
    easeOut,
    circIn,
    circInOut,
    circOut,
    backIn,
    backInOut,
    backOut,
    anticipate
  };
  const isValidEasing = (easing) => {
    return typeof easing === "string";
  };
  const easingDefinitionToFunction = (definition) => {
    if (isBezierDefinition(definition)) {
      invariant(definition.length === 4);
      const [x1, y1, x2, y2] = definition;
      return cubicBezier(x1, y1, x2, y2);
    } else if (isValidEasing(definition)) {
      return easingLookup[definition];
    }
    return definition;
  };
  const stepsOrder = [
    "setup",
"read",
"resolveKeyframes",
"preUpdate",
"update",
"preRender",
"render",
"postRender"
];
  function createRenderStep(runNextFrame, stepName) {
    let thisFrame = new Set();
    let nextFrame = new Set();
    let isProcessing = false;
    let flushNextFrame = false;
    const toKeepAlive = new WeakSet();
    let latestFrameData = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    };
    function triggerCallback(callback) {
      if (toKeepAlive.has(callback)) {
        step.schedule(callback);
        runNextFrame();
      }
      callback(latestFrameData);
    }
    const step = {
schedule: (callback, keepAlive = false, immediate = false) => {
        const addToCurrentFrame = immediate && isProcessing;
        const queue = addToCurrentFrame ? thisFrame : nextFrame;
        if (keepAlive)
          toKeepAlive.add(callback);
        if (!queue.has(callback))
          queue.add(callback);
        return callback;
      },
cancel: (callback) => {
        nextFrame.delete(callback);
        toKeepAlive.delete(callback);
      },
process: (frameData2) => {
        latestFrameData = frameData2;
        if (isProcessing) {
          flushNextFrame = true;
          return;
        }
        isProcessing = true;
        [thisFrame, nextFrame] = [nextFrame, thisFrame];
        thisFrame.forEach(triggerCallback);
        thisFrame.clear();
        isProcessing = false;
        if (flushNextFrame) {
          flushNextFrame = false;
          step.process(frameData2);
        }
      }
    };
    return step;
  }
  const maxElapsed = 40;
  function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
    let runNextFrame = false;
    let useDefaultElapsed = true;
    const state = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    };
    const flagRunNextFrame = () => runNextFrame = true;
    const steps = stepsOrder.reduce((acc, key) => {
      acc[key] = createRenderStep(flagRunNextFrame);
      return acc;
    }, {});
    const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
    const processBatch = () => {
      const timestamp = MotionGlobalConfig.useManualTiming ? state.timestamp : performance.now();
      runNextFrame = false;
      if (!MotionGlobalConfig.useManualTiming) {
        state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
      }
      state.timestamp = timestamp;
      state.isProcessing = true;
      setup.process(state);
      read.process(state);
      resolveKeyframes.process(state);
      preUpdate.process(state);
      update.process(state);
      preRender.process(state);
      render.process(state);
      postRender.process(state);
      state.isProcessing = false;
      if (runNextFrame && allowKeepAlive) {
        useDefaultElapsed = false;
        scheduleNextBatch(processBatch);
      }
    };
    const wake = () => {
      runNextFrame = true;
      useDefaultElapsed = true;
      if (!state.isProcessing) {
        scheduleNextBatch(processBatch);
      }
    };
    const schedule = stepsOrder.reduce((acc, key) => {
      const step = steps[key];
      acc[key] = (process, keepAlive = false, immediate = false) => {
        if (!runNextFrame)
          wake();
        return step.schedule(process, keepAlive, immediate);
      };
      return acc;
    }, {});
    const cancel = (process) => {
      for (let i = 0; i < stepsOrder.length; i++) {
        steps[stepsOrder[i]].cancel(process);
      }
    };
    return { schedule, cancel, state, steps };
  }
  const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);
  let now;
  function clearTime() {
    now = void 0;
  }
  const time = {
    now: () => {
      if (now === void 0) {
        time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
      }
      return now;
    },
    set: (newTime) => {
      now = newTime;
      queueMicrotask(clearTime);
    }
  };
  const checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
  const isCSSVariableName = checkStringStartsWith("--");
  const startsAsVariableToken = checkStringStartsWith("var(--");
  const isCSSVariableToken = (value) => {
    const startsWithToken = startsAsVariableToken(value);
    if (!startsWithToken)
      return false;
    return singleCssVariableRegex.test(value.split("/*")[0].trim());
  };
  const singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
  const number = {
    test: (v) => typeof v === "number",
    parse: parseFloat,
    transform: (v) => v
  };
  const alpha = {
    ...number,
    transform: (v) => clamp(0, 1, v)
  };
  const scale = {
    ...number,
    default: 1
  };
  const sanitize = (v) => Math.round(v * 1e5) / 1e5;
  const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
  function isNullish(v) {
    return v == null;
  }
  const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
  const isColorString = (type, testProp) => (v) => {
    return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
  };
  const splitColor = (aName, bName, cName) => (v) => {
    if (typeof v !== "string")
      return v;
    const [a, b, c, alpha2] = v.match(floatRegex);
    return {
      [aName]: parseFloat(a),
      [bName]: parseFloat(b),
      [cName]: parseFloat(c),
      alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
    };
  };
  const clampRgbUnit = (v) => clamp(0, 255, v);
  const rgbUnit = {
    ...number,
    transform: (v) => Math.round(clampRgbUnit(v))
  };
  const rgba = {
    test: isColorString("rgb", "red"),
    parse: splitColor("red", "green", "blue"),
    transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
  };
  function parseHex(v) {
    let r = "";
    let g = "";
    let b = "";
    let a = "";
    if (v.length > 5) {
      r = v.substring(1, 3);
      g = v.substring(3, 5);
      b = v.substring(5, 7);
      a = v.substring(7, 9);
    } else {
      r = v.substring(1, 2);
      g = v.substring(2, 3);
      b = v.substring(3, 4);
      a = v.substring(4, 5);
      r += r;
      g += g;
      b += b;
      a += a;
    }
    return {
      red: parseInt(r, 16),
      green: parseInt(g, 16),
      blue: parseInt(b, 16),
      alpha: a ? parseInt(a, 16) / 255 : 1
    };
  }
  const hex = {
    test: isColorString("#"),
    parse: parseHex,
    transform: rgba.transform
  };
  const createUnitType = (unit2) => ({
    test: (v) => typeof v === "string" && v.endsWith(unit2) && v.split(" ").length === 1,
    parse: parseFloat,
    transform: (v) => `${v}${unit2}`
  });
  const degrees = createUnitType("deg");
  const percent = createUnitType("%");
  const px = createUnitType("px");
  const vh = createUnitType("vh");
  const vw = createUnitType("vw");
  const progressPercentage = (() => ({
    ...percent,
    parse: (v) => percent.parse(v) / 100,
    transform: (v) => percent.transform(v * 100)
  }))();
  const hsla = {
    test: isColorString("hsl", "hue"),
    parse: splitColor("hue", "saturation", "lightness"),
    transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
      return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
    }
  };
  const color = {
    test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
    parse: (v) => {
      if (rgba.test(v)) {
        return rgba.parse(v);
      } else if (hsla.test(v)) {
        return hsla.parse(v);
      } else {
        return hex.parse(v);
      }
    },
    transform: (v) => {
      return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
    },
    getAnimatableNone: (v) => {
      const parsed = color.parse(v);
      parsed.alpha = 0;
      return color.transform(parsed);
    }
  };
  const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
  function test(v) {
    return isNaN(v) && typeof v === "string" && (v.match(floatRegex)?.length || 0) + (v.match(colorRegex)?.length || 0) > 0;
  }
  const NUMBER_TOKEN = "number";
  const COLOR_TOKEN = "color";
  const VAR_TOKEN = "var";
  const VAR_FUNCTION_TOKEN = "var(";
  const SPLIT_TOKEN = "${}";
  const complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
  function analyseComplexValue(value) {
    const originalValue = value.toString();
    const values = [];
    const indexes = {
      color: [],
      number: [],
      var: []
    };
    const types = [];
    let i = 0;
    const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
      if (color.test(parsedValue)) {
        indexes.color.push(i);
        types.push(COLOR_TOKEN);
        values.push(color.parse(parsedValue));
      } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
        indexes.var.push(i);
        types.push(VAR_TOKEN);
        values.push(parsedValue);
      } else {
        indexes.number.push(i);
        types.push(NUMBER_TOKEN);
        values.push(parseFloat(parsedValue));
      }
      ++i;
      return SPLIT_TOKEN;
    });
    const split = tokenised.split(SPLIT_TOKEN);
    return { values, split, indexes, types };
  }
  function parseComplexValue(v) {
    return analyseComplexValue(v).values;
  }
  function createTransformer(source) {
    const { split, types } = analyseComplexValue(source);
    const numSections = split.length;
    return (v) => {
      let output = "";
      for (let i = 0; i < numSections; i++) {
        output += split[i];
        if (v[i] !== void 0) {
          const type = types[i];
          if (type === NUMBER_TOKEN) {
            output += sanitize(v[i]);
          } else if (type === COLOR_TOKEN) {
            output += color.transform(v[i]);
          } else {
            output += v[i];
          }
        }
      }
      return output;
    };
  }
  const convertNumbersToZero = (v) => typeof v === "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v;
  function getAnimatableNone$1(v) {
    const parsed = parseComplexValue(v);
    const transformer = createTransformer(v);
    return transformer(parsed.map(convertNumbersToZero));
  }
  const complex = {
    test,
    parse: parseComplexValue,
    createTransformer,
    getAnimatableNone: getAnimatableNone$1
  };
  function hueToRgb(p, q, t) {
    if (t < 0)
      t += 1;
    if (t > 1)
      t -= 1;
    if (t < 1 / 6)
      return p + (q - p) * 6 * t;
    if (t < 1 / 2)
      return q;
    if (t < 2 / 3)
      return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
    hue /= 360;
    saturation /= 100;
    lightness /= 100;
    let red = 0;
    let green = 0;
    let blue = 0;
    if (!saturation) {
      red = green = blue = lightness;
    } else {
      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;
      red = hueToRgb(p, q, hue + 1 / 3);
      green = hueToRgb(p, q, hue);
      blue = hueToRgb(p, q, hue - 1 / 3);
    }
    return {
      red: Math.round(red * 255),
      green: Math.round(green * 255),
      blue: Math.round(blue * 255),
      alpha: alpha2
    };
  }
  function mixImmediate(a, b) {
    return (p) => p > 0 ? b : a;
  }
  const mixNumber$1 = (from, to, progress2) => {
    return from + (to - from) * progress2;
  };
  const mixLinearColor = (from, to, v) => {
    const fromExpo = from * from;
    const expo = v * (to * to - fromExpo) + fromExpo;
    return expo < 0 ? 0 : Math.sqrt(expo);
  };
  const colorTypes = [hex, rgba, hsla];
  const getColorType = (v) => colorTypes.find((type) => type.test(v));
  function asRGBA(color2) {
    const type = getColorType(color2);
    if (!Boolean(type))
      return false;
    let model = type.parse(color2);
    if (type === hsla) {
      model = hslaToRgba(model);
    }
    return model;
  }
  const mixColor = (from, to) => {
    const fromRGBA = asRGBA(from);
    const toRGBA = asRGBA(to);
    if (!fromRGBA || !toRGBA) {
      return mixImmediate(from, to);
    }
    const blended = { ...fromRGBA };
    return (v) => {
      blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
      blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
      blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
      blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v);
      return rgba.transform(blended);
    };
  };
  const invisibleValues = new Set(["none", "hidden"]);
  function mixVisibility(origin, target) {
    if (invisibleValues.has(origin)) {
      return (p) => p <= 0 ? origin : target;
    } else {
      return (p) => p >= 1 ? target : origin;
    }
  }
  function mixNumber(a, b) {
    return (p) => mixNumber$1(a, b, p);
  }
  function getMixer(a) {
    if (typeof a === "number") {
      return mixNumber;
    } else if (typeof a === "string") {
      return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
    } else if (Array.isArray(a)) {
      return mixArray;
    } else if (typeof a === "object") {
      return color.test(a) ? mixColor : mixObject;
    }
    return mixImmediate;
  }
  function mixArray(a, b) {
    const output = [...a];
    const numValues = output.length;
    const blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
    return (p) => {
      for (let i = 0; i < numValues; i++) {
        output[i] = blendValue[i](p);
      }
      return output;
    };
  }
  function mixObject(a, b) {
    const output = { ...a, ...b };
    const blendValue = {};
    for (const key in output) {
      if (a[key] !== void 0 && b[key] !== void 0) {
        blendValue[key] = getMixer(a[key])(a[key], b[key]);
      }
    }
    return (v) => {
      for (const key in blendValue) {
        output[key] = blendValue[key](v);
      }
      return output;
    };
  }
  function matchOrder(origin, target) {
    const orderedOrigin = [];
    const pointers = { color: 0, var: 0, number: 0 };
    for (let i = 0; i < target.values.length; i++) {
      const type = target.types[i];
      const originIndex = origin.indexes[type][pointers[type]];
      const originValue = origin.values[originIndex] ?? 0;
      orderedOrigin[i] = originValue;
      pointers[type]++;
    }
    return orderedOrigin;
  }
  const mixComplex = (origin, target) => {
    const template = complex.createTransformer(target);
    const originStats = analyseComplexValue(origin);
    const targetStats = analyseComplexValue(target);
    const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
    if (canInterpolate) {
      if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
        return mixVisibility(origin, target);
      }
      return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
    } else {
      return mixImmediate(origin, target);
    }
  };
  function mix(from, to, p) {
    if (typeof from === "number" && typeof to === "number" && typeof p === "number") {
      return mixNumber$1(from, to, p);
    }
    const mixer = getMixer(from);
    return mixer(from, to);
  }
  const frameloopDriver = (update) => {
    const passTimestamp = ({ timestamp }) => update(timestamp);
    return {
      start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
      stop: () => cancelFrame(passTimestamp),
now: () => frameData.isProcessing ? frameData.timestamp : time.now()
    };
  };
  const generateLinearEasing = (easing, duration, resolution = 10) => {
    let points = "";
    const numPoints = Math.max(Math.round(duration / resolution), 2);
    for (let i = 0; i < numPoints; i++) {
      points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
    }
    return `linear(${points.substring(0, points.length - 2)})`;
  };
  const maxGeneratorDuration = 2e4;
  function calcGeneratorDuration(generator) {
    let duration = 0;
    const timeStep = 50;
    let state = generator.next(duration);
    while (!state.done && duration < maxGeneratorDuration) {
      duration += timeStep;
      state = generator.next(duration);
    }
    return duration >= maxGeneratorDuration ? Infinity : duration;
  }
  function createGeneratorEasing(options, scale2 = 100, createGenerator) {
    const generator = createGenerator({ ...options, keyframes: [0, scale2] });
    const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
    return {
      type: "keyframes",
      ease: (progress2) => {
        return generator.next(duration * progress2).value / scale2;
      },
      duration: millisecondsToSeconds(duration)
    };
  }
  const velocitySampleDuration = 5;
  function calcGeneratorVelocity(resolveValue, t, current) {
    const prevT = Math.max(t - velocitySampleDuration, 0);
    return velocityPerSecond(current - resolveValue(prevT), t - prevT);
  }
  const springDefaults = {
stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
duration: 800,
bounce: 0.3,
    visualDuration: 0.3,

restSpeed: {
      granular: 0.01,
      default: 2
    },
    restDelta: {
      granular: 5e-3,
      default: 0.5
    },
minDuration: 0.01,
maxDuration: 10,
minDamping: 0.05,
    maxDamping: 1
  };
  const safeMin = 1e-3;
  function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
    let envelope;
    let derivative;
    let dampingRatio = 1 - bounce;
    dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
    duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, millisecondsToSeconds(duration));
    if (dampingRatio < 1) {
      envelope = (undampedFreq2) => {
        const exponentialDecay = undampedFreq2 * dampingRatio;
        const delta = exponentialDecay * duration;
        const a = exponentialDecay - velocity;
        const b = calcAngularFreq(undampedFreq2, dampingRatio);
        const c = Math.exp(-delta);
        return safeMin - a / b * c;
      };
      derivative = (undampedFreq2) => {
        const exponentialDecay = undampedFreq2 * dampingRatio;
        const delta = exponentialDecay * duration;
        const d = delta * velocity + velocity;
        const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
        const f = Math.exp(-delta);
        const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
        const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
        return factor * ((d - e) * f) / g;
      };
    } else {
      envelope = (undampedFreq2) => {
        const a = Math.exp(-undampedFreq2 * duration);
        const b = (undampedFreq2 - velocity) * duration + 1;
        return -safeMin + a * b;
      };
      derivative = (undampedFreq2) => {
        const a = Math.exp(-undampedFreq2 * duration);
        const b = (velocity - undampedFreq2) * (duration * duration);
        return a * b;
      };
    }
    const initialGuess = 5 / duration;
    const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
    duration = secondsToMilliseconds(duration);
    if (isNaN(undampedFreq)) {
      return {
        stiffness: springDefaults.stiffness,
        damping: springDefaults.damping,
        duration
      };
    } else {
      const stiffness = Math.pow(undampedFreq, 2) * mass;
      return {
        stiffness,
        damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
        duration
      };
    }
  }
  const rootIterations = 12;
  function approximateRoot(envelope, derivative, initialGuess) {
    let result = initialGuess;
    for (let i = 1; i < rootIterations; i++) {
      result = result - envelope(result) / derivative(result);
    }
    return result;
  }
  function calcAngularFreq(undampedFreq, dampingRatio) {
    return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
  }
  const durationKeys = ["duration", "bounce"];
  const physicsKeys = ["stiffness", "damping", "mass"];
  function isSpringType(options, keys) {
    return keys.some((key) => options[key] !== void 0);
  }
  function getSpringOptions(options) {
    let springOptions = {
      velocity: springDefaults.velocity,
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      mass: springDefaults.mass,
      isResolvedFromDuration: false,
      ...options
    };
    if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
      if (options.visualDuration) {
        const visualDuration = options.visualDuration;
        const root = 2 * Math.PI / (visualDuration * 1.2);
        const stiffness = root * root;
        const damping = 2 * clamp(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
        springOptions = {
          ...springOptions,
          mass: springDefaults.mass,
          stiffness,
          damping
        };
      } else {
        const derived = findSpring(options);
        springOptions = {
          ...springOptions,
          ...derived,
          mass: springDefaults.mass
        };
        springOptions.isResolvedFromDuration = true;
      }
    }
    return springOptions;
  }
  function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
    const options = typeof optionsOrVisualDuration !== "object" ? {
      visualDuration: optionsOrVisualDuration,
      keyframes: [0, 1],
      bounce
    } : optionsOrVisualDuration;
    let { restSpeed, restDelta } = options;
    const origin = options.keyframes[0];
    const target = options.keyframes[options.keyframes.length - 1];
    const state = { done: false, value: origin };
    const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
      ...options,
      velocity: - millisecondsToSeconds(options.velocity || 0)
    });
    const initialVelocity = velocity || 0;
    const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
    const initialDelta = target - origin;
    const undampedAngularFreq = millisecondsToSeconds(Math.sqrt(stiffness / mass));
    const isGranularScale = Math.abs(initialDelta) < 5;
    restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
    restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
    let resolveSpring;
    if (dampingRatio < 1) {
      const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
      resolveSpring = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
      };
    } else if (dampingRatio === 1) {
      resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
    } else {
      const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
      resolveSpring = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        const freqForT = Math.min(dampedAngularFreq * t, 300);
        return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
      };
    }
    const generator = {
      calculatedDuration: isResolvedFromDuration ? duration || null : null,
      next: (t) => {
        const current = resolveSpring(t);
        if (!isResolvedFromDuration) {
          let currentVelocity = t === 0 ? initialVelocity : 0;
          if (dampingRatio < 1) {
            currentVelocity = t === 0 ? secondsToMilliseconds(initialVelocity) : calcGeneratorVelocity(resolveSpring, t, current);
          }
          const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
          const isBelowDisplacementThreshold = Math.abs(target - current) <= restDelta;
          state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
        } else {
          state.done = t >= duration;
        }
        state.value = state.done ? target : current;
        return state;
      },
      toString: () => {
        const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
        const easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
        return calculatedDuration + "ms " + easing;
      },
      toTransition: () => {
      }
    };
    return generator;
  }
  spring.applyToOptions = (options) => {
    const generatorOptions = createGeneratorEasing(options, 100, spring);
    options.ease = generatorOptions.ease;
    options.duration = secondsToMilliseconds(generatorOptions.duration);
    options.type = "keyframes";
    return options;
  };
  function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = 0.5, restSpeed }) {
    const origin = keyframes2[0];
    const state = {
      done: false,
      value: origin
    };
    const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
    const nearestBoundary = (v) => {
      if (min === void 0)
        return max;
      if (max === void 0)
        return min;
      return Math.abs(min - v) < Math.abs(max - v) ? min : max;
    };
    let amplitude = power * velocity;
    const ideal = origin + amplitude;
    const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
    if (target !== ideal)
      amplitude = target - origin;
    const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
    const calcLatest = (t) => target + calcDelta(t);
    const applyFriction = (t) => {
      const delta = calcDelta(t);
      const latest = calcLatest(t);
      state.done = Math.abs(delta) <= restDelta;
      state.value = state.done ? target : latest;
    };
    let timeReachedBoundary;
    let spring$1;
    const checkCatchBoundary = (t) => {
      if (!isOutOfBounds(state.value))
        return;
      timeReachedBoundary = t;
      spring$1 = spring({
        keyframes: [state.value, nearestBoundary(state.value)],
        velocity: calcGeneratorVelocity(calcLatest, t, state.value),
damping: bounceDamping,
        stiffness: bounceStiffness,
        restDelta,
        restSpeed
      });
    };
    checkCatchBoundary(0);
    return {
      calculatedDuration: null,
      next: (t) => {
        let hasUpdatedFrame = false;
        if (!spring$1 && timeReachedBoundary === void 0) {
          hasUpdatedFrame = true;
          applyFriction(t);
          checkCatchBoundary(t);
        }
        if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) {
          return spring$1.next(t - timeReachedBoundary);
        } else {
          !hasUpdatedFrame && applyFriction(t);
          return state;
        }
      }
    };
  }
  function createMixers(output, ease2, customMixer) {
    const mixers = [];
    const mixerFactory = customMixer || MotionGlobalConfig.mix || mix;
    const numMixers = output.length - 1;
    for (let i = 0; i < numMixers; i++) {
      let mixer = mixerFactory(output[i], output[i + 1]);
      if (ease2) {
        const easingFunction = Array.isArray(ease2) ? ease2[i] || noop : ease2;
        mixer = pipe(easingFunction, mixer);
      }
      mixers.push(mixer);
    }
    return mixers;
  }
  function interpolate(input, output, { clamp: isClamp = true, ease: ease2, mixer } = {}) {
    const inputLength = input.length;
    invariant(inputLength === output.length);
    if (inputLength === 1)
      return () => output[0];
    if (inputLength === 2 && output[0] === output[1])
      return () => output[1];
    const isZeroDeltaRange = input[0] === input[1];
    if (input[0] > input[inputLength - 1]) {
      input = [...input].reverse();
      output = [...output].reverse();
    }
    const mixers = createMixers(output, ease2, mixer);
    const numMixers = mixers.length;
    const interpolator = (v) => {
      if (isZeroDeltaRange && v < input[0])
        return output[0];
      let i = 0;
      if (numMixers > 1) {
        for (; i < input.length - 2; i++) {
          if (v < input[i + 1])
            break;
        }
      }
      const progressInRange = progress(input[i], input[i + 1], v);
      return mixers[i](progressInRange);
    };
    return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
  }
  function fillOffset(offset, remaining) {
    const min = offset[offset.length - 1];
    for (let i = 1; i <= remaining; i++) {
      const offsetProgress = progress(0, remaining, i);
      offset.push(mixNumber$1(min, 1, offsetProgress));
    }
  }
  function defaultOffset(arr) {
    const offset = [0];
    fillOffset(offset, arr.length - 1);
    return offset;
  }
  function convertOffsetToTimes(offset, duration) {
    return offset.map((o) => o * duration);
  }
  function defaultEasing(values, easing) {
    return values.map(() => easing || easeInOut).splice(0, values.length - 1);
  }
  function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
    const easingFunctions = isEasingArray(ease2) ? ease2.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease2);
    const state = {
      done: false,
      value: keyframeValues[0]
    };
    const absoluteTimes = convertOffsetToTimes(

times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
      duration
    );
    const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
      ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
    });
    return {
      calculatedDuration: duration,
      next: (t) => {
        state.value = mapTimeToKeyframe(t);
        state.done = t >= duration;
        return state;
      }
    };
  }
  const isNotNull$1 = (value) => value !== null;
  function getFinalKeyframe$1(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
    const resolvedKeyframes = keyframes2.filter(isNotNull$1);
    const useFirstKeyframe = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1;
    const index = useFirstKeyframe ? 0 : resolvedKeyframes.length - 1;
    return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
  }
  const transitionTypeMap = {
    decay: inertia,
    inertia,
    tween: keyframes,
    keyframes,
    spring
  };
  function replaceTransitionType(transition) {
    if (typeof transition.type === "string") {
      transition.type = transitionTypeMap[transition.type];
    }
  }
  class WithPromise {
    constructor() {
      this.updateFinished();
    }
    get finished() {
      return this._finished;
    }
    updateFinished() {
      this._finished = new Promise((resolve) => {
        this.resolve = resolve;
      });
    }
    notifyFinished() {
      this.resolve();
    }
then(onResolve, onReject) {
      return this.finished.then(onResolve, onReject);
    }
  }
  const percentToProgress = (percent2) => percent2 / 100;
  class JSAnimation extends WithPromise {
    constructor(options) {
      super();
      this.state = "idle";
      this.startTime = null;
      this.isStopped = false;
      this.currentTime = 0;
      this.holdTime = null;
      this.playbackSpeed = 1;
      this.stop = () => {
        const { motionValue: motionValue2 } = this.options;
        if (motionValue2 && motionValue2.updatedAt !== time.now()) {
          this.tick(time.now());
        }
        this.isStopped = true;
        if (this.state === "idle")
          return;
        this.teardown();
        this.options.onStop?.();
      };
      this.options = options;
      this.initAnimation();
      this.play();
      if (options.autoplay === false)
        this.pause();
    }
    initAnimation() {
      const { options } = this;
      replaceTransitionType(options);
      const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
      let { keyframes: keyframes$1 } = options;
      const generatorFactory = type || keyframes;
      if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
        this.mixKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
        keyframes$1 = [0, 100];
      }
      const generator = generatorFactory({ ...options, keyframes: keyframes$1 });
      if (repeatType === "mirror") {
        this.mirroredGenerator = generatorFactory({
          ...options,
          keyframes: [...keyframes$1].reverse(),
          velocity: -velocity
        });
      }
      if (generator.calculatedDuration === null) {
        generator.calculatedDuration = calcGeneratorDuration(generator);
      }
      const { calculatedDuration } = generator;
      this.calculatedDuration = calculatedDuration;
      this.resolvedDuration = calculatedDuration + repeatDelay;
      this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
      this.generator = generator;
    }
    updateTime(timestamp) {
      const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
      if (this.holdTime !== null) {
        this.currentTime = this.holdTime;
      } else {
        this.currentTime = animationTime;
      }
    }
    tick(timestamp, sample = false) {
      const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
      if (this.startTime === null)
        return generator.next(0);
      const { delay: delay2 = 0, keyframes: keyframes2, repeat, repeatType, repeatDelay, type, onUpdate, finalKeyframe } = this.options;
      if (this.speed > 0) {
        this.startTime = Math.min(this.startTime, timestamp);
      } else if (this.speed < 0) {
        this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
      }
      if (sample) {
        this.currentTime = timestamp;
      } else {
        this.updateTime(timestamp);
      }
      const timeWithoutDelay = this.currentTime - delay2 * (this.playbackSpeed >= 0 ? 1 : -1);
      const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
      this.currentTime = Math.max(timeWithoutDelay, 0);
      if (this.state === "finished" && this.holdTime === null) {
        this.currentTime = totalDuration;
      }
      let elapsed = this.currentTime;
      let frameGenerator = generator;
      if (repeat) {
        const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
        let currentIteration = Math.floor(progress2);
        let iterationProgress = progress2 % 1;
        if (!iterationProgress && progress2 >= 1) {
          iterationProgress = 1;
        }
        iterationProgress === 1 && currentIteration--;
        currentIteration = Math.min(currentIteration, repeat + 1);
        const isOddIteration = Boolean(currentIteration % 2);
        if (isOddIteration) {
          if (repeatType === "reverse") {
            iterationProgress = 1 - iterationProgress;
            if (repeatDelay) {
              iterationProgress -= repeatDelay / resolvedDuration;
            }
          } else if (repeatType === "mirror") {
            frameGenerator = mirroredGenerator;
          }
        }
        elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
      }
      const state = isInDelayPhase ? { done: false, value: keyframes2[0] } : frameGenerator.next(elapsed);
      if (mixKeyframes) {
        state.value = mixKeyframes(state.value);
      }
      let { done } = state;
      if (!isInDelayPhase && calculatedDuration !== null) {
        done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
      }
      const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
      if (isAnimationFinished && type !== inertia) {
        state.value = getFinalKeyframe$1(keyframes2, this.options, finalKeyframe, this.speed);
      }
      if (onUpdate) {
        onUpdate(state.value);
      }
      if (isAnimationFinished) {
        this.finish();
      }
      return state;
    }
then(resolve, reject) {
      return this.finished.then(resolve, reject);
    }
    get duration() {
      return millisecondsToSeconds(this.calculatedDuration);
    }
    get iterationDuration() {
      const { delay: delay2 = 0 } = this.options || {};
      return this.duration + millisecondsToSeconds(delay2);
    }
    get time() {
      return millisecondsToSeconds(this.currentTime);
    }
    set time(newTime) {
      newTime = secondsToMilliseconds(newTime);
      this.currentTime = newTime;
      if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) {
        this.holdTime = newTime;
      } else if (this.driver) {
        this.startTime = this.driver.now() - newTime / this.playbackSpeed;
      }
      this.driver?.start(false);
    }
    get speed() {
      return this.playbackSpeed;
    }
    set speed(newSpeed) {
      this.updateTime(time.now());
      const hasChanged = this.playbackSpeed !== newSpeed;
      this.playbackSpeed = newSpeed;
      if (hasChanged) {
        this.time = millisecondsToSeconds(this.currentTime);
      }
    }
    play() {
      if (this.isStopped)
        return;
      const { driver = frameloopDriver, startTime } = this.options;
      if (!this.driver) {
        this.driver = driver((timestamp) => this.tick(timestamp));
      }
      this.options.onPlay?.();
      const now2 = this.driver.now();
      if (this.state === "finished") {
        this.updateFinished();
        this.startTime = now2;
      } else if (this.holdTime !== null) {
        this.startTime = now2 - this.holdTime;
      } else if (!this.startTime) {
        this.startTime = startTime ?? now2;
      }
      if (this.state === "finished" && this.speed < 0) {
        this.startTime += this.calculatedDuration;
      }
      this.holdTime = null;
      this.state = "running";
      this.driver.start();
    }
    pause() {
      this.state = "paused";
      this.updateTime(time.now());
      this.holdTime = this.currentTime;
    }
    complete() {
      if (this.state !== "running") {
        this.play();
      }
      this.state = "finished";
      this.holdTime = null;
    }
    finish() {
      this.notifyFinished();
      this.teardown();
      this.state = "finished";
      this.options.onComplete?.();
    }
    cancel() {
      this.holdTime = null;
      this.startTime = 0;
      this.tick(0);
      this.teardown();
      this.options.onCancel?.();
    }
    teardown() {
      this.state = "idle";
      this.stopDriver();
      this.startTime = this.holdTime = null;
    }
    stopDriver() {
      if (!this.driver)
        return;
      this.driver.stop();
      this.driver = void 0;
    }
    sample(sampleTime) {
      this.startTime = 0;
      return this.tick(sampleTime, true);
    }
    attachTimeline(timeline) {
      if (this.options.allowFlatten) {
        this.options.type = "keyframes";
        this.options.ease = "linear";
        this.initAnimation();
      }
      this.driver?.stop();
      return timeline.observe(this);
    }
  }
  function fillWildcards(keyframes2) {
    for (let i = 1; i < keyframes2.length; i++) {
      keyframes2[i] ?? (keyframes2[i] = keyframes2[i - 1]);
    }
  }
  const radToDeg = (rad) => rad * 180 / Math.PI;
  const rotate = (v) => {
    const angle = radToDeg(Math.atan2(v[1], v[0]));
    return rebaseAngle(angle);
  };
  const matrix2dParsers = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
    rotate,
    rotateZ: rotate,
    skewX: (v) => radToDeg(Math.atan(v[1])),
    skewY: (v) => radToDeg(Math.atan(v[2])),
    skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
  };
  const rebaseAngle = (angle) => {
    angle = angle % 360;
    if (angle < 0)
      angle += 360;
    return angle;
  };
  const rotateZ = rotate;
  const scaleX = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  const scaleY = (v) => Math.sqrt(v[4] * v[4] + v[5] * v[5]);
  const matrix3dParsers = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX,
    scaleY,
    scale: (v) => (scaleX(v) + scaleY(v)) / 2,
    rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
    rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
    rotateZ,
    rotate: rotateZ,
    skewX: (v) => radToDeg(Math.atan(v[4])),
    skewY: (v) => radToDeg(Math.atan(v[1])),
    skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
  };
  function defaultTransformValue(name) {
    return name.includes("scale") ? 1 : 0;
  }
  function parseValueFromTransform(transform, name) {
    if (!transform || transform === "none") {
      return defaultTransformValue(name);
    }
    const matrix3dMatch = transform.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
    let parsers;
    let match;
    if (matrix3dMatch) {
      parsers = matrix3dParsers;
      match = matrix3dMatch;
    } else {
      const matrix2dMatch = transform.match(/^matrix\(([-\d.e\s,]+)\)$/u);
      parsers = matrix2dParsers;
      match = matrix2dMatch;
    }
    if (!match) {
      return defaultTransformValue(name);
    }
    const valueParser = parsers[name];
    const values = match[1].split(",").map(convertTransformToNumber);
    return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
  }
  const readTransformValue = (instance, name) => {
    const { transform = "none" } = getComputedStyle(instance);
    return parseValueFromTransform(transform, name);
  };
  function convertTransformToNumber(value) {
    return parseFloat(value.trim());
  }
  const transformPropOrder = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY"
  ];
  const transformProps = (() => new Set(transformPropOrder))();
  const isNumOrPxType = (v) => v === number || v === px;
  const transformKeys = new Set(["x", "y", "z"]);
  const nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
  function removeNonTranslationalTransform(visualElement) {
    const removedTransforms = [];
    nonTranslationalTransformKeys.forEach((key) => {
      const value = visualElement.getValue(key);
      if (value !== void 0) {
        removedTransforms.push([key, value.get()]);
        value.set(key.startsWith("scale") ? 1 : 0);
      }
    });
    return removedTransforms;
  }
  const positionalValues = {
width: ({ x }, { paddingLeft = "0", paddingRight = "0" }) => x.max - x.min - parseFloat(paddingLeft) - parseFloat(paddingRight),
    height: ({ y }, { paddingTop = "0", paddingBottom = "0" }) => y.max - y.min - parseFloat(paddingTop) - parseFloat(paddingBottom),
    top: (_bbox, { top }) => parseFloat(top),
    left: (_bbox, { left }) => parseFloat(left),
    bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
    right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
x: (_bbox, { transform }) => parseValueFromTransform(transform, "x"),
    y: (_bbox, { transform }) => parseValueFromTransform(transform, "y")
  };
  positionalValues.translateX = positionalValues.x;
  positionalValues.translateY = positionalValues.y;
  const toResolve = new Set();
  let isScheduled = false;
  let anyNeedsMeasurement = false;
  let isForced = false;
  function measureAllKeyframes() {
    if (anyNeedsMeasurement) {
      const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
      const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
      const transformsToRestore = new Map();
      elementsToMeasure.forEach((element) => {
        const removedTransforms = removeNonTranslationalTransform(element);
        if (!removedTransforms.length)
          return;
        transformsToRestore.set(element, removedTransforms);
        element.render();
      });
      resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
      elementsToMeasure.forEach((element) => {
        element.render();
        const restore = transformsToRestore.get(element);
        if (restore) {
          restore.forEach(([key, value]) => {
            element.getValue(key)?.set(value);
          });
        }
      });
      resolversToMeasure.forEach((resolver) => resolver.measureEndState());
      resolversToMeasure.forEach((resolver) => {
        if (resolver.suspendedScrollY !== void 0) {
          window.scrollTo(0, resolver.suspendedScrollY);
        }
      });
    }
    anyNeedsMeasurement = false;
    isScheduled = false;
    toResolve.forEach((resolver) => resolver.complete(isForced));
    toResolve.clear();
  }
  function readAllKeyframes() {
    toResolve.forEach((resolver) => {
      resolver.readKeyframes();
      if (resolver.needsMeasurement) {
        anyNeedsMeasurement = true;
      }
    });
  }
  function flushKeyframeResolvers() {
    isForced = true;
    readAllKeyframes();
    measureAllKeyframes();
    isForced = false;
  }
  class KeyframeResolver {
    constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = false) {
      this.state = "pending";
      this.isAsync = false;
      this.needsMeasurement = false;
      this.unresolvedKeyframes = [...unresolvedKeyframes];
      this.onComplete = onComplete;
      this.name = name;
      this.motionValue = motionValue2;
      this.element = element;
      this.isAsync = isAsync;
    }
    scheduleResolve() {
      this.state = "scheduled";
      if (this.isAsync) {
        toResolve.add(this);
        if (!isScheduled) {
          isScheduled = true;
          frame.read(readAllKeyframes);
          frame.resolveKeyframes(measureAllKeyframes);
        }
      } else {
        this.readKeyframes();
        this.complete();
      }
    }
    readKeyframes() {
      const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
      if (unresolvedKeyframes[0] === null) {
        const currentValue = motionValue2?.get();
        const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
        if (currentValue !== void 0) {
          unresolvedKeyframes[0] = currentValue;
        } else if (element && name) {
          const valueAsRead = element.readValue(name, finalKeyframe);
          if (valueAsRead !== void 0 && valueAsRead !== null) {
            unresolvedKeyframes[0] = valueAsRead;
          }
        }
        if (unresolvedKeyframes[0] === void 0) {
          unresolvedKeyframes[0] = finalKeyframe;
        }
        if (motionValue2 && currentValue === void 0) {
          motionValue2.set(unresolvedKeyframes[0]);
        }
      }
      fillWildcards(unresolvedKeyframes);
    }
    setFinalKeyframe() {
    }
    measureInitialState() {
    }
    renderEndStyles() {
    }
    measureEndState() {
    }
    complete(isForcedComplete = false) {
      this.state = "complete";
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
      toResolve.delete(this);
    }
    cancel() {
      if (this.state === "scheduled") {
        toResolve.delete(this);
        this.state = "pending";
      }
    }
    resume() {
      if (this.state === "pending")
        this.scheduleResolve();
    }
  }
  const isCSSVar = (name) => name.startsWith("--");
  function setStyle(element, name, value) {
    isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
  }
  const supportsScrollTimeline = memo(() => window.ScrollTimeline !== void 0);
  const supportsFlags = {};
  function memoSupports(callback, supportsFlag) {
    const memoized = memo(callback);
    return () => supportsFlags[supportsFlag] ?? memoized();
  }
  const supportsLinearEasing = memoSupports(() => {
    try {
      document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch (e) {
      return false;
    }
    return true;
  }, "linearEasing");
  const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
  const supportedWaapiEasing = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: cubicBezierAsString([0, 0.65, 0.55, 1]),
    circOut: cubicBezierAsString([0.55, 0, 1, 0.45]),
    backIn: cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
    backOut: cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
  };
  function mapEasingToNativeEasing(easing, duration) {
    if (!easing) {
      return void 0;
    } else if (typeof easing === "function") {
      return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
    } else if (isBezierDefinition(easing)) {
      return cubicBezierAsString(easing);
    } else if (Array.isArray(easing)) {
      return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
    } else {
      return supportedWaapiEasing[easing];
    }
  }
  function startWaapiAnimation(element, valueName, keyframes2, { delay: delay2 = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeOut", times } = {}, pseudoElement = void 0) {
    const keyframeOptions = {
      [valueName]: keyframes2
    };
    if (times)
      keyframeOptions.offset = times;
    const easing = mapEasingToNativeEasing(ease2, duration);
    if (Array.isArray(easing))
      keyframeOptions.easing = easing;
    const options = {
      delay: delay2,
      duration,
      easing: !Array.isArray(easing) ? easing : "linear",
      fill: "both",
      iterations: repeat + 1,
      direction: repeatType === "reverse" ? "alternate" : "normal"
    };
    if (pseudoElement)
      options.pseudoElement = pseudoElement;
    const animation = element.animate(keyframeOptions, options);
    return animation;
  }
  function isGenerator(type) {
    return typeof type === "function" && "applyToOptions" in type;
  }
  function applyGeneratorOptions({ type, ...options }) {
    if (isGenerator(type) && supportsLinearEasing()) {
      return type.applyToOptions(options);
    } else {
      options.duration ?? (options.duration = 300);
      options.ease ?? (options.ease = "easeOut");
    }
    return options;
  }
  class NativeAnimation extends WithPromise {
    constructor(options) {
      super();
      this.finishedTime = null;
      this.isStopped = false;
      if (!options)
        return;
      const { element, name, keyframes: keyframes2, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
      this.isPseudoElement = Boolean(pseudoElement);
      this.allowFlatten = allowFlatten;
      this.options = options;
      invariant(typeof options.type !== "string");
      const transition = applyGeneratorOptions(options);
      this.animation = startWaapiAnimation(element, name, keyframes2, transition, pseudoElement);
      if (transition.autoplay === false) {
        this.animation.pause();
      }
      this.animation.onfinish = () => {
        this.finishedTime = this.time;
        if (!pseudoElement) {
          const keyframe = getFinalKeyframe$1(keyframes2, this.options, finalKeyframe, this.speed);
          if (this.updateMotionValue) {
            this.updateMotionValue(keyframe);
          } else {
            setStyle(element, name, keyframe);
          }
          this.animation.cancel();
        }
        onComplete?.();
        this.notifyFinished();
      };
    }
    play() {
      if (this.isStopped)
        return;
      this.animation.play();
      if (this.state === "finished") {
        this.updateFinished();
      }
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.finish?.();
    }
    cancel() {
      try {
        this.animation.cancel();
      } catch (e) {
      }
    }
    stop() {
      if (this.isStopped)
        return;
      this.isStopped = true;
      const { state } = this;
      if (state === "idle" || state === "finished") {
        return;
      }
      if (this.updateMotionValue) {
        this.updateMotionValue();
      } else {
        this.commitStyles();
      }
      if (!this.isPseudoElement)
        this.cancel();
    }
commitStyles() {
      if (!this.isPseudoElement) {
        this.animation.commitStyles?.();
      }
    }
    get duration() {
      const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
      return millisecondsToSeconds(Number(duration));
    }
    get iterationDuration() {
      const { delay: delay2 = 0 } = this.options || {};
      return this.duration + millisecondsToSeconds(delay2);
    }
    get time() {
      return millisecondsToSeconds(Number(this.animation.currentTime) || 0);
    }
    set time(newTime) {
      this.finishedTime = null;
      this.animation.currentTime = secondsToMilliseconds(newTime);
    }
get speed() {
      return this.animation.playbackRate;
    }
    set speed(newSpeed) {
      if (newSpeed < 0)
        this.finishedTime = null;
      this.animation.playbackRate = newSpeed;
    }
    get state() {
      return this.finishedTime !== null ? "finished" : this.animation.playState;
    }
    get startTime() {
      return Number(this.animation.startTime);
    }
    set startTime(newStartTime) {
      this.animation.startTime = newStartTime;
    }
attachTimeline({ timeline, observe }) {
      if (this.allowFlatten) {
        this.animation.effect?.updateTiming({ easing: "linear" });
      }
      this.animation.onfinish = null;
      if (timeline && supportsScrollTimeline()) {
        this.animation.timeline = timeline;
        return noop;
      } else {
        return observe(this);
      }
    }
  }
  const unsupportedEasingFunctions = {
    anticipate,
    backInOut,
    circInOut
  };
  function isUnsupportedEase(key) {
    return key in unsupportedEasingFunctions;
  }
  function replaceStringEasing(transition) {
    if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) {
      transition.ease = unsupportedEasingFunctions[transition.ease];
    }
  }
  const sampleDelta = 10;
  class NativeAnimationExtended extends NativeAnimation {
    constructor(options) {
      replaceStringEasing(options);
      replaceTransitionType(options);
      super(options);
      if (options.startTime) {
        this.startTime = options.startTime;
      }
      this.options = options;
    }
updateMotionValue(value) {
      const { motionValue: motionValue2, onUpdate, onComplete, element, ...options } = this.options;
      if (!motionValue2)
        return;
      if (value !== void 0) {
        motionValue2.set(value);
        return;
      }
      const sampleAnimation = new JSAnimation({
        ...options,
        autoplay: false
      });
      const sampleTime = secondsToMilliseconds(this.finishedTime ?? this.time);
      motionValue2.setWithVelocity(sampleAnimation.sample(sampleTime - sampleDelta).value, sampleAnimation.sample(sampleTime).value, sampleDelta);
      sampleAnimation.stop();
    }
  }
  const isAnimatable = (value, name) => {
    if (name === "zIndex")
      return false;
    if (typeof value === "number" || Array.isArray(value))
      return true;
    if (typeof value === "string" &&
(complex.test(value) || value === "0") &&
!value.startsWith("url(")) {
      return true;
    }
    return false;
  };
  function hasKeyframesChanged(keyframes2) {
    const current = keyframes2[0];
    if (keyframes2.length === 1)
      return true;
    for (let i = 0; i < keyframes2.length; i++) {
      if (keyframes2[i] !== current)
        return true;
    }
  }
  function canAnimate(keyframes2, name, type, velocity) {
    const originKeyframe = keyframes2[0];
    if (originKeyframe === null)
      return false;
    if (name === "display" || name === "visibility")
      return true;
    const targetKeyframe = keyframes2[keyframes2.length - 1];
    const isOriginAnimatable = isAnimatable(originKeyframe, name);
    const isTargetAnimatable = isAnimatable(targetKeyframe, name);
    if (!isOriginAnimatable || !isTargetAnimatable) {
      return false;
    }
    return hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
  }
  function makeAnimationInstant(options) {
    options.duration = 0;
    options.type = "keyframes";
  }
  const acceleratedValues = new Set([
    "opacity",
    "clipPath",
    "filter",
    "transform"

]);
  const supportsWaapi = memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
  function supportsBrowserAnimation(options) {
    const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type } = options;
    const subject = motionValue2?.owner?.current;
    if (!(subject instanceof HTMLElement)) {
      return false;
    }
    const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
    return supportsWaapi() && name && acceleratedValues.has(name) && (name !== "transform" || !transformTemplate) &&
!onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
  }
  const MAX_RESOLVE_DELAY = 40;
  class AsyncMotionValueAnimation extends WithPromise {
    constructor({ autoplay = true, delay: delay2 = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes: keyframes2, name, motionValue: motionValue2, element, ...options }) {
      super();
      this.stop = () => {
        if (this._animation) {
          this._animation.stop();
          this.stopTimeline?.();
        }
        this.keyframeResolver?.cancel();
      };
      this.createdAt = time.now();
      const optionsWithDefaults = {
        autoplay,
        delay: delay2,
        type,
        repeat,
        repeatDelay,
        repeatType,
        name,
        motionValue: motionValue2,
        element,
        ...options
      };
      const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
      this.keyframeResolver = new KeyframeResolver$1(keyframes2, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue2, element);
      this.keyframeResolver?.scheduleResolve();
    }
    onKeyframesResolved(keyframes2, finalKeyframe, options, sync) {
      this.keyframeResolver = void 0;
      const { name, type, velocity, delay: delay2, isHandoff, onUpdate } = options;
      this.resolvedAt = time.now();
      if (!canAnimate(keyframes2, name, type, velocity)) {
        if (MotionGlobalConfig.instantAnimations || !delay2) {
          onUpdate?.(getFinalKeyframe$1(keyframes2, options, finalKeyframe));
        }
        keyframes2[0] = keyframes2[keyframes2.length - 1];
        makeAnimationInstant(options);
        options.repeat = 0;
      }
      const startTime = sync ? !this.resolvedAt ? this.createdAt : this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : void 0;
      const resolvedOptions = {
        startTime,
        finalKeyframe,
        ...options,
        keyframes: keyframes2
      };
      const animation = !isHandoff && supportsBrowserAnimation(resolvedOptions) ? new NativeAnimationExtended({
        ...resolvedOptions,
        element: resolvedOptions.motionValue.owner.current
      }) : new JSAnimation(resolvedOptions);
      animation.finished.then(() => this.notifyFinished()).catch(noop);
      if (this.pendingTimeline) {
        this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
        this.pendingTimeline = void 0;
      }
      this._animation = animation;
    }
    get finished() {
      if (!this._animation) {
        return this._finished;
      } else {
        return this.animation.finished;
      }
    }
    then(onResolve, _onReject) {
      return this.finished.finally(onResolve).then(() => {
      });
    }
    get animation() {
      if (!this._animation) {
        this.keyframeResolver?.resume();
        flushKeyframeResolvers();
      }
      return this._animation;
    }
    get duration() {
      return this.animation.duration;
    }
    get iterationDuration() {
      return this.animation.iterationDuration;
    }
    get time() {
      return this.animation.time;
    }
    set time(newTime) {
      this.animation.time = newTime;
    }
    get speed() {
      return this.animation.speed;
    }
    get state() {
      return this.animation.state;
    }
    set speed(newSpeed) {
      this.animation.speed = newSpeed;
    }
    get startTime() {
      return this.animation.startTime;
    }
    attachTimeline(timeline) {
      if (this._animation) {
        this.stopTimeline = this.animation.attachTimeline(timeline);
      } else {
        this.pendingTimeline = timeline;
      }
      return () => this.stop();
    }
    play() {
      this.animation.play();
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.complete();
    }
    cancel() {
      if (this._animation) {
        this.animation.cancel();
      }
      this.keyframeResolver?.cancel();
    }
  }
  const splitCSSVariableRegex = (
/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
  );
  function parseCSSVariable(current) {
    const match = splitCSSVariableRegex.exec(current);
    if (!match)
      return [,];
    const [, token1, token2, fallback] = match;
    return [`--${token1 ?? token2}`, fallback];
  }
  function getVariableValue(current, element, depth = 1) {
    const [token, fallback] = parseCSSVariable(current);
    if (!token)
      return;
    const resolved = window.getComputedStyle(element).getPropertyValue(token);
    if (resolved) {
      const trimmed = resolved.trim();
      return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
    }
    return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
  }
  function getValueTransition(transition, key) {
    return transition?.[key] ?? transition?.["default"] ?? transition;
  }
  const positionalKeys = new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    ...transformPropOrder
  ]);
  const auto = {
    test: (v) => v === "auto",
    parse: (v) => v
  };
  const testValueType = (v) => (type) => type.test(v);
  const dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
  const findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
  function isNone(value) {
    if (typeof value === "number") {
      return value === 0;
    } else if (value !== null) {
      return value === "none" || value === "0" || isZeroValueString(value);
    } else {
      return true;
    }
  }
  const maxDefaults = new Set(["brightness", "contrast", "saturate", "opacity"]);
  function applyDefaultFilter(v) {
    const [name, value] = v.slice(0, -1).split("(");
    if (name === "drop-shadow")
      return v;
    const [number2] = value.match(floatRegex) || [];
    if (!number2)
      return v;
    const unit2 = value.replace(number2, "");
    let defaultValue = maxDefaults.has(name) ? 1 : 0;
    if (number2 !== value)
      defaultValue *= 100;
    return name + "(" + defaultValue + unit2 + ")";
  }
  const functionRegex = /\b([a-z-]*)\(.*?\)/gu;
  const filter = {
    ...complex,
    getAnimatableNone: (v) => {
      const functions = v.match(functionRegex);
      return functions ? functions.map(applyDefaultFilter).join(" ") : v;
    }
  };
  const int = {
    ...number,
    transform: Math.round
  };
  const transformValueTypes = {
    rotate: degrees,
    rotateX: degrees,
    rotateY: degrees,
    rotateZ: degrees,
    scale,
    scaleX: scale,
    scaleY: scale,
    scaleZ: scale,
    skew: degrees,
    skewX: degrees,
    skewY: degrees,
    distance: px,
    translateX: px,
    translateY: px,
    translateZ: px,
    x: px,
    y: px,
    z: px,
    perspective: px,
    transformPerspective: px,
    opacity: alpha,
    originX: progressPercentage,
    originY: progressPercentage,
    originZ: px
  };
  const numberValueTypes = {
borderWidth: px,
    borderTopWidth: px,
    borderRightWidth: px,
    borderBottomWidth: px,
    borderLeftWidth: px,
    borderRadius: px,
    radius: px,
    borderTopLeftRadius: px,
    borderTopRightRadius: px,
    borderBottomRightRadius: px,
    borderBottomLeftRadius: px,
width: px,
    maxWidth: px,
    height: px,
    maxHeight: px,
    top: px,
    right: px,
    bottom: px,
    left: px,
padding: px,
    paddingTop: px,
    paddingRight: px,
    paddingBottom: px,
    paddingLeft: px,
    margin: px,
    marginTop: px,
    marginRight: px,
    marginBottom: px,
    marginLeft: px,
backgroundPositionX: px,
    backgroundPositionY: px,
    ...transformValueTypes,
    zIndex: int,
fillOpacity: alpha,
    strokeOpacity: alpha,
    numOctaves: int
  };
  const defaultValueTypes = {
    ...numberValueTypes,
color,
    backgroundColor: color,
    outlineColor: color,
    fill: color,
    stroke: color,
borderColor: color,
    borderTopColor: color,
    borderRightColor: color,
    borderBottomColor: color,
    borderLeftColor: color,
    filter,
    WebkitFilter: filter
  };
  const getDefaultValueType = (key) => defaultValueTypes[key];
  function getAnimatableNone(key, value) {
    let defaultValueType = getDefaultValueType(key);
    if (defaultValueType !== filter)
      defaultValueType = complex;
    return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
  }
  const invalidTemplates = new Set(["auto", "none", "0"]);
  function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
    let i = 0;
    let animatableTemplate = void 0;
    while (i < unresolvedKeyframes.length && !animatableTemplate) {
      const keyframe = unresolvedKeyframes[i];
      if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
        animatableTemplate = unresolvedKeyframes[i];
      }
      i++;
    }
    if (animatableTemplate && name) {
      for (const noneIndex of noneKeyframeIndexes) {
        unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
      }
    }
  }
  class DOMKeyframesResolver extends KeyframeResolver {
    constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
      super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
    }
    readKeyframes() {
      const { unresolvedKeyframes, element, name } = this;
      if (!element || !element.current)
        return;
      super.readKeyframes();
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        let keyframe = unresolvedKeyframes[i];
        if (typeof keyframe === "string") {
          keyframe = keyframe.trim();
          if (isCSSVariableToken(keyframe)) {
            const resolved = getVariableValue(keyframe, element.current);
            if (resolved !== void 0) {
              unresolvedKeyframes[i] = resolved;
            }
            if (i === unresolvedKeyframes.length - 1) {
              this.finalKeyframe = keyframe;
            }
          }
        }
      }
      this.resolveNoneKeyframes();
      if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
        return;
      }
      const [origin, target] = unresolvedKeyframes;
      const originType = findDimensionValueType(origin);
      const targetType = findDimensionValueType(target);
      if (originType === targetType)
        return;
      if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
        for (let i = 0; i < unresolvedKeyframes.length; i++) {
          const value = unresolvedKeyframes[i];
          if (typeof value === "string") {
            unresolvedKeyframes[i] = parseFloat(value);
          }
        }
      } else if (positionalValues[name]) {
        this.needsMeasurement = true;
      }
    }
    resolveNoneKeyframes() {
      const { unresolvedKeyframes, name } = this;
      const noneKeyframeIndexes = [];
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        if (unresolvedKeyframes[i] === null || isNone(unresolvedKeyframes[i])) {
          noneKeyframeIndexes.push(i);
        }
      }
      if (noneKeyframeIndexes.length) {
        makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
      }
    }
    measureInitialState() {
      const { element, unresolvedKeyframes, name } = this;
      if (!element || !element.current)
        return;
      if (name === "height") {
        this.suspendedScrollY = window.pageYOffset;
      }
      this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
      unresolvedKeyframes[0] = this.measuredOrigin;
      const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (measureKeyframe !== void 0) {
        element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
      }
    }
    measureEndState() {
      const { element, name, unresolvedKeyframes } = this;
      if (!element || !element.current)
        return;
      const value = element.getValue(name);
      value && value.jump(this.measuredOrigin, false);
      const finalKeyframeIndex = unresolvedKeyframes.length - 1;
      const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
      unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
      if (finalKeyframe !== null && this.finalKeyframe === void 0) {
        this.finalKeyframe = finalKeyframe;
      }
      if (this.removedTransforms?.length) {
        this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
          element.getValue(unsetTransformName).set(unsetTransformValue);
        });
      }
      this.resolveNoneKeyframes();
    }
  }
  function resolveElements(elementOrSelector, scope, selectorCache) {
    if (elementOrSelector instanceof EventTarget) {
      return [elementOrSelector];
    } else if (typeof elementOrSelector === "string") {
      let root = document;
      const elements = root.querySelectorAll(elementOrSelector);
      return elements ? Array.from(elements) : [];
    }
    return Array.from(elementOrSelector);
  }
  const getValueAsType = (value, type) => {
    return type && typeof value === "number" ? type.transform(value) : value;
  };
  function isHTMLElement(element) {
    return isObject(element) && "offsetHeight" in element;
  }
  const MAX_VELOCITY_DELTA = 30;
  const isFloat = (value) => {
    return !isNaN(parseFloat(value));
  };
  class MotionValue {
constructor(init, options = {}) {
      this.canTrackVelocity = null;
      this.events = {};
      this.updateAndNotify = (v) => {
        const currentTime = time.now();
        if (this.updatedAt !== currentTime) {
          this.setPrevFrameValue();
        }
        this.prev = this.current;
        this.setCurrent(v);
        if (this.current !== this.prev) {
          this.events.change?.notify(this.current);
          if (this.dependents) {
            for (const dependent of this.dependents) {
              dependent.dirty();
            }
          }
        }
      };
      this.hasAnimated = false;
      this.setCurrent(init);
      this.owner = options.owner;
    }
    setCurrent(current) {
      this.current = current;
      this.updatedAt = time.now();
      if (this.canTrackVelocity === null && current !== void 0) {
        this.canTrackVelocity = isFloat(this.current);
      }
    }
    setPrevFrameValue(prevFrameValue = this.current) {
      this.prevFrameValue = prevFrameValue;
      this.prevUpdatedAt = this.updatedAt;
    }
onChange(subscription) {
      return this.on("change", subscription);
    }
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = new SubscriptionManager();
      }
      const unsubscribe = this.events[eventName].add(callback);
      if (eventName === "change") {
        return () => {
          unsubscribe();
          frame.read(() => {
            if (!this.events.change.getSize()) {
              this.stop();
            }
          });
        };
      }
      return unsubscribe;
    }
    clearListeners() {
      for (const eventManagers in this.events) {
        this.events[eventManagers].clear();
      }
    }
attach(passiveEffect, stopPassiveEffect) {
      this.passiveEffect = passiveEffect;
      this.stopPassiveEffect = stopPassiveEffect;
    }
set(v) {
      if (!this.passiveEffect) {
        this.updateAndNotify(v);
      } else {
        this.passiveEffect(v, this.updateAndNotify);
      }
    }
    setWithVelocity(prev, current, delta) {
      this.set(current);
      this.prev = void 0;
      this.prevFrameValue = prev;
      this.prevUpdatedAt = this.updatedAt - delta;
    }
jump(v, endAnimation = true) {
      this.updateAndNotify(v);
      this.prev = v;
      this.prevUpdatedAt = this.prevFrameValue = void 0;
      endAnimation && this.stop();
      if (this.stopPassiveEffect)
        this.stopPassiveEffect();
    }
    dirty() {
      this.events.change?.notify(this.current);
    }
    addDependent(dependent) {
      if (!this.dependents) {
        this.dependents = new Set();
      }
      this.dependents.add(dependent);
    }
    removeDependent(dependent) {
      if (this.dependents) {
        this.dependents.delete(dependent);
      }
    }
get() {
      return this.current;
    }
getPrevious() {
      return this.prev;
    }
getVelocity() {
      const currentTime = time.now();
      if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
        return 0;
      }
      const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
      return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
    }
start(startAnimation) {
      this.stop();
      return new Promise((resolve) => {
        this.hasAnimated = true;
        this.animation = startAnimation(resolve);
        if (this.events.animationStart) {
          this.events.animationStart.notify();
        }
      }).then(() => {
        if (this.events.animationComplete) {
          this.events.animationComplete.notify();
        }
        this.clearAnimation();
      });
    }
stop() {
      if (this.animation) {
        this.animation.stop();
        if (this.events.animationCancel) {
          this.events.animationCancel.notify();
        }
      }
      this.clearAnimation();
    }
isAnimating() {
      return !!this.animation;
    }
    clearAnimation() {
      delete this.animation;
    }
destroy() {
      this.dependents?.clear();
      this.events.destroy?.notify();
      this.clearListeners();
      this.stop();
      if (this.stopPassiveEffect) {
        this.stopPassiveEffect();
      }
    }
  }
  function motionValue(init, options) {
    return new MotionValue(init, options);
  }
  const { schedule: microtask } = createRenderBatcher(queueMicrotask, false);
  const isDragging = {
    x: false,
    y: false
  };
  function isDragActive() {
    return isDragging.x || isDragging.y;
  }
  function setDragLock(axis) {
    if (axis === "x" || axis === "y") {
      if (isDragging[axis]) {
        return null;
      } else {
        isDragging[axis] = true;
        return () => {
          isDragging[axis] = false;
        };
      }
    } else {
      if (isDragging.x || isDragging.y) {
        return null;
      } else {
        isDragging.x = isDragging.y = true;
        return () => {
          isDragging.x = isDragging.y = false;
        };
      }
    }
  }
  function setupGesture(elementOrSelector, options) {
    const elements = resolveElements(elementOrSelector);
    const gestureAbortController = new AbortController();
    const eventOptions = {
      passive: true,
      ...options,
      signal: gestureAbortController.signal
    };
    const cancel = () => gestureAbortController.abort();
    return [elements, eventOptions, cancel];
  }
  function isValidHover(event) {
    return !(event.pointerType === "touch" || isDragActive());
  }
  function hover(elementOrSelector, onHoverStart, options = {}) {
    const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options);
    const onPointerEnter = (enterEvent) => {
      if (!isValidHover(enterEvent))
        return;
      const { target } = enterEvent;
      const onHoverEnd = onHoverStart(target, enterEvent);
      if (typeof onHoverEnd !== "function" || !target)
        return;
      const onPointerLeave = (leaveEvent) => {
        if (!isValidHover(leaveEvent))
          return;
        onHoverEnd(leaveEvent);
        target.removeEventListener("pointerleave", onPointerLeave);
      };
      target.addEventListener("pointerleave", onPointerLeave, eventOptions);
    };
    elements.forEach((element) => {
      element.addEventListener("pointerenter", onPointerEnter, eventOptions);
    });
    return cancel;
  }
  const isNodeOrChild = (parent, child) => {
    if (!child) {
      return false;
    } else if (parent === child) {
      return true;
    } else {
      return isNodeOrChild(parent, child.parentElement);
    }
  };
  const isPrimaryPointer = (event) => {
    if (event.pointerType === "mouse") {
      return typeof event.button !== "number" || event.button <= 0;
    } else {
      return event.isPrimary !== false;
    }
  };
  const focusableElements = new Set([
    "BUTTON",
    "INPUT",
    "SELECT",
    "TEXTAREA",
    "A"
  ]);
  function isElementKeyboardAccessible(element) {
    return focusableElements.has(element.tagName) || element.tabIndex !== -1;
  }
  const isPressing = new WeakSet();
  function filterEvents(callback) {
    return (event) => {
      if (event.key !== "Enter")
        return;
      callback(event);
    };
  }
  function firePointerEvent(target, type) {
    target.dispatchEvent(new PointerEvent("pointer" + type, { isPrimary: true, bubbles: true }));
  }
  const enableKeyboardPress = (focusEvent, eventOptions) => {
    const element = focusEvent.currentTarget;
    if (!element)
      return;
    const handleKeydown = filterEvents(() => {
      if (isPressing.has(element))
        return;
      firePointerEvent(element, "down");
      const handleKeyup = filterEvents(() => {
        firePointerEvent(element, "up");
      });
      const handleBlur = () => firePointerEvent(element, "cancel");
      element.addEventListener("keyup", handleKeyup, eventOptions);
      element.addEventListener("blur", handleBlur, eventOptions);
    });
    element.addEventListener("keydown", handleKeydown, eventOptions);
    element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
  };
  function isValidPressEvent(event) {
    return isPrimaryPointer(event) && !isDragActive();
  }
  function press(targetOrSelector, onPressStart, options = {}) {
    const [targets, eventOptions, cancelEvents] = setupGesture(targetOrSelector, options);
    const startPress = (startEvent) => {
      const target = startEvent.currentTarget;
      if (!isValidPressEvent(startEvent))
        return;
      isPressing.add(target);
      const onPressEnd = onPressStart(target, startEvent);
      const onPointerEnd = (endEvent, success) => {
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerCancel);
        if (isPressing.has(target)) {
          isPressing.delete(target);
        }
        if (!isValidPressEvent(endEvent)) {
          return;
        }
        if (typeof onPressEnd === "function") {
          onPressEnd(endEvent, { success });
        }
      };
      const onPointerUp = (upEvent) => {
        onPointerEnd(upEvent, target === window || target === document || options.useGlobalTarget || isNodeOrChild(target, upEvent.target));
      };
      const onPointerCancel = (cancelEvent) => {
        onPointerEnd(cancelEvent, false);
      };
      window.addEventListener("pointerup", onPointerUp, eventOptions);
      window.addEventListener("pointercancel", onPointerCancel, eventOptions);
    };
    targets.forEach((target) => {
      const pointerDownTarget = options.useGlobalTarget ? window : target;
      pointerDownTarget.addEventListener("pointerdown", startPress, eventOptions);
      if (isHTMLElement(target)) {
        target.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions));
        if (!isElementKeyboardAccessible(target) && !target.hasAttribute("tabindex")) {
          target.tabIndex = 0;
        }
      }
    });
    return cancelEvents;
  }
  function isSVGElement(element) {
    return isObject(element) && "ownerSVGElement" in element;
  }
  function isSVGSVGElement(element) {
    return isSVGElement(element) && element.tagName === "svg";
  }
  const isMotionValue = (value) => Boolean(value && value.getVelocity);
  const valueTypes = [...dimensionValueTypes, color, complex];
  const findValueType = (v) => valueTypes.find(testValueType(v));
  const MotionConfigContext = React.createContext({
    transformPagePoint: (p) => p,
    isStatic: false,
    reducedMotion: "never"
  });
  function setRef(ref, value) {
    if (typeof ref === "function") {
      return ref(value);
    } else if (ref !== null && ref !== void 0) {
      ref.current = value;
    }
  }
  function composeRefs(...refs) {
    return (node) => {
      let hasCleanup = false;
      const cleanups = refs.map((ref) => {
        const cleanup = setRef(ref, node);
        if (!hasCleanup && typeof cleanup === "function") {
          hasCleanup = true;
        }
        return cleanup;
      });
      if (hasCleanup) {
        return () => {
          for (let i = 0; i < cleanups.length; i++) {
            const cleanup = cleanups[i];
            if (typeof cleanup === "function") {
              cleanup();
            } else {
              setRef(refs[i], null);
            }
          }
        };
      }
    };
  }
  function useComposedRefs(...refs) {
    return React__namespace.useCallback(composeRefs(...refs), refs);
  }
  class PopChildMeasure extends React__namespace.Component {
    getSnapshotBeforeUpdate(prevProps) {
      const element = this.props.childRef.current;
      if (element && prevProps.isPresent && !this.props.isPresent) {
        const parent = element.offsetParent;
        const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
        const size = this.props.sizeRef.current;
        size.height = element.offsetHeight || 0;
        size.width = element.offsetWidth || 0;
        size.top = element.offsetTop;
        size.left = element.offsetLeft;
        size.right = parentWidth - size.width - size.left;
      }
      return null;
    }
componentDidUpdate() {
    }
    render() {
      return this.props.children;
    }
  }
  function PopChild({ children, isPresent, anchorX, root }) {
    const id2 = React.useId();
    const ref = React.useRef(null);
    const size = React.useRef({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0
    });
    const { nonce } = React.useContext(MotionConfigContext);
    const composedRef = useComposedRefs(ref, children?.ref);
    React.useInsertionEffect(() => {
      const { width, height, top, left, right } = size.current;
      if (isPresent || !ref.current || !width || !height)
        return;
      const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
      ref.current.dataset.motionPopId = id2;
      const style2 = document.createElement("style");
      if (nonce)
        style2.nonce = nonce;
      const parent = root ?? document.head;
      parent.appendChild(style2);
      if (style2.sheet) {
        style2.sheet.insertRule(`
          [data-motion-pop-id="${id2}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            top: ${top}px !important;
          }
        `);
      }
      return () => {
        if (parent.contains(style2)) {
          parent.removeChild(style2);
        }
      };
    }, [isPresent]);
    return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, children: React__namespace.cloneElement(children, { ref: composedRef }) });
  }
  const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, root }) => {
    const presenceChildren = useConstant(newChildrenMap);
    const id2 = React.useId();
    let isReusedContext = true;
    let context = React.useMemo(() => {
      isReusedContext = false;
      return {
        id: id2,
        initial,
        isPresent,
        custom,
        onExitComplete: (childId) => {
          presenceChildren.set(childId, true);
          for (const isComplete of presenceChildren.values()) {
            if (!isComplete)
              return;
          }
          onExitComplete && onExitComplete();
        },
        register: (childId) => {
          presenceChildren.set(childId, false);
          return () => presenceChildren.delete(childId);
        }
      };
    }, [isPresent, presenceChildren, onExitComplete]);
    if (presenceAffectsLayout && isReusedContext) {
      context = { ...context };
    }
    React.useMemo(() => {
      presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
    }, [isPresent]);
    React__namespace.useEffect(() => {
      !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
    }, [isPresent]);
    if (mode === "popLayout") {
      children = jsxRuntimeExports.jsx(PopChild, { isPresent, anchorX, root, children });
    }
    return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
  };
  function newChildrenMap() {
    return new Map();
  }
  function usePresence(subscribe = true) {
    const context = React.useContext(PresenceContext);
    if (context === null)
      return [true, null];
    const { isPresent, onExitComplete, register } = context;
    const id2 = React.useId();
    React.useEffect(() => {
      if (subscribe) {
        return register(id2);
      }
    }, [subscribe]);
    const safeToRemove = React.useCallback(() => subscribe && onExitComplete && onExitComplete(id2), [id2, onExitComplete, subscribe]);
    return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
  }
  const getChildKey = (child) => child.key || "";
  function onlyElements(children) {
    const filtered = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child))
        filtered.push(child);
    });
    return filtered;
  }
  const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", root }) => {
    const [isParentPresent, safeToRemove] = usePresence(propagate);
    const presentChildren = React.useMemo(() => onlyElements(children), [children]);
    const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
    const isInitialRender = React.useRef(true);
    const pendingPresentChildren = React.useRef(presentChildren);
    const exitComplete = useConstant(() => new Map());
    const [diffedChildren, setDiffedChildren] = React.useState(presentChildren);
    const [renderedChildren, setRenderedChildren] = React.useState(presentChildren);
    useIsomorphicLayoutEffect(() => {
      isInitialRender.current = false;
      pendingPresentChildren.current = presentChildren;
      for (let i = 0; i < renderedChildren.length; i++) {
        const key = getChildKey(renderedChildren[i]);
        if (!presentKeys.includes(key)) {
          if (exitComplete.get(key) !== true) {
            exitComplete.set(key, false);
          }
        } else {
          exitComplete.delete(key);
        }
      }
    }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
    const exitingChildren = [];
    if (presentChildren !== diffedChildren) {
      let nextChildren = [...presentChildren];
      for (let i = 0; i < renderedChildren.length; i++) {
        const child = renderedChildren[i];
        const key = getChildKey(child);
        if (!presentKeys.includes(key)) {
          nextChildren.splice(i, 0, child);
          exitingChildren.push(child);
        }
      }
      if (mode === "wait" && exitingChildren.length) {
        nextChildren = exitingChildren;
      }
      setRenderedChildren(onlyElements(nextChildren));
      setDiffedChildren(presentChildren);
      return null;
    }
    const { forceRender } = React.useContext(LayoutGroupContext);
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
      const key = getChildKey(child);
      const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
      const onExit = () => {
        if (exitComplete.has(key)) {
          exitComplete.set(key, true);
        } else {
          return;
        }
        let isEveryExitComplete = true;
        exitComplete.forEach((isExitComplete) => {
          if (!isExitComplete)
            isEveryExitComplete = false;
        });
        if (isEveryExitComplete) {
          forceRender?.();
          setRenderedChildren(pendingPresentChildren.current);
          propagate && safeToRemove?.();
          onExitComplete && onExitComplete();
        }
      };
      return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, children: child }, key);
    }) });
  };
  const DeprecatedLayoutGroupContext = React.createContext(null);
  function useIsMounted() {
    const isMounted = React.useRef(false);
    useIsomorphicLayoutEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);
    return isMounted;
  }
  function useForceUpdate() {
    const isMounted = useIsMounted();
    const [forcedRenderCount, setForcedRenderCount] = React.useState(0);
    const forceRender = React.useCallback(() => {
      isMounted.current && setForcedRenderCount(forcedRenderCount + 1);
    }, [forcedRenderCount]);
    const deferredForceRender = React.useCallback(() => frame.postRender(forceRender), [forceRender]);
    return [deferredForceRender, forcedRenderCount];
  }
  const notify = (node) => !node.isLayoutDirty && node.willUpdate(false);
  function nodeGroup() {
    const nodes = new Set();
    const subscriptions = new WeakMap();
    const dirtyAll = () => nodes.forEach(notify);
    return {
      add: (node) => {
        nodes.add(node);
        subscriptions.set(node, node.addEventListener("willUpdate", dirtyAll));
      },
      remove: (node) => {
        nodes.delete(node);
        const unsubscribe = subscriptions.get(node);
        if (unsubscribe) {
          unsubscribe();
          subscriptions.delete(node);
        }
        dirtyAll();
      },
      dirty: dirtyAll
    };
  }
  const shouldInheritGroup = (inherit) => inherit === true;
  const shouldInheritId = (inherit) => shouldInheritGroup(inherit === true) || inherit === "id";
  const LayoutGroup = ({ children, id: id2, inherit = true }) => {
    const layoutGroupContext = React.useContext(LayoutGroupContext);
    const deprecatedLayoutGroupContext = React.useContext(DeprecatedLayoutGroupContext);
    const [forceRender, key] = useForceUpdate();
    const context = React.useRef(null);
    const upstreamId = layoutGroupContext.id || deprecatedLayoutGroupContext;
    if (context.current === null) {
      if (shouldInheritId(inherit) && upstreamId) {
        id2 = id2 ? upstreamId + "-" + id2 : upstreamId;
      }
      context.current = {
        id: id2,
        group: shouldInheritGroup(inherit) ? layoutGroupContext.group || nodeGroup() : nodeGroup()
      };
    }
    const memoizedContext = React.useMemo(() => ({ ...context.current, forceRender }), [key]);
    return jsxRuntimeExports.jsx(LayoutGroupContext.Provider, { value: memoizedContext, children });
  };
  const LazyContext = React.createContext({ strict: false });
  const featureProps = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag"
    ],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"]
  };
  const featureDefinitions = {};
  for (const key in featureProps) {
    featureDefinitions[key] = {
      isEnabled: (props) => featureProps[key].some((name) => !!props[name])
    };
  }
  function loadFeatures(features) {
    for (const key in features) {
      featureDefinitions[key] = {
        ...featureDefinitions[key],
        ...features[key]
      };
    }
  }
  const validMotionProps = new Set([
    "animate",
    "exit",
    "variants",
    "initial",
    "style",
    "values",
    "variants",
    "transition",
    "transformTemplate",
    "custom",
    "inherit",
    "onBeforeLayoutMeasure",
    "onAnimationStart",
    "onAnimationComplete",
    "onUpdate",
    "onDragStart",
    "onDrag",
    "onDragEnd",
    "onMeasureDragConstraints",
    "onDirectionLock",
    "onDragTransitionEnd",
    "_dragX",
    "_dragY",
    "onHoverStart",
    "onHoverEnd",
    "onViewportEnter",
    "onViewportLeave",
    "globalTapTarget",
    "ignoreStrict",
    "viewport"
  ]);
  function isValidMotionProp(key) {
    return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
  }
  let shouldForward = (key) => !isValidMotionProp(key);
  function loadExternalIsValidProp(isValidProp) {
    if (typeof isValidProp !== "function")
      return;
    shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
  }
  try {
    loadExternalIsValidProp(require("@emotion/is-prop-valid").default);
  } catch {
  }
  function filterProps(props, isDom, forwardMotionProps) {
    const filteredProps = {};
    for (const key in props) {
      if (key === "values" && typeof props.values === "object")
        continue;
      if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) ||
props["draggable"] && key.startsWith("onDrag")) {
        filteredProps[key] = props[key];
      }
    }
    return filteredProps;
  }
  const MotionContext = React.createContext({});
  function isAnimationControls(v) {
    return v !== null && typeof v === "object" && typeof v.start === "function";
  }
  function isVariantLabel(v) {
    return typeof v === "string" || Array.isArray(v);
  }
  const variantPriorityOrder = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit"
  ];
  const variantProps = ["initial", ...variantPriorityOrder];
  function isControllingVariants(props) {
    return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
  }
  function isVariantNode(props) {
    return Boolean(isControllingVariants(props) || props.variants);
  }
  function getCurrentTreeVariants(props, context) {
    if (isControllingVariants(props)) {
      const { initial, animate } = props;
      return {
        initial: initial === false || isVariantLabel(initial) ? initial : void 0,
        animate: isVariantLabel(animate) ? animate : void 0
      };
    }
    return props.inherit !== false ? context : {};
  }
  function useCreateMotionContext(props) {
    const { initial, animate } = getCurrentTreeVariants(props, React.useContext(MotionContext));
    return React.useMemo(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
  }
  function variantLabelsAsDependency(prop) {
    return Array.isArray(prop) ? prop.join(" ") : prop;
  }
  const scaleCorrectors = {};
  function addScaleCorrector(correctors) {
    for (const key in correctors) {
      scaleCorrectors[key] = correctors[key];
      if (isCSSVariableName(key)) {
        scaleCorrectors[key].isCSSVariable = true;
      }
    }
  }
  function isForcedMotionValue(key, { layout: layout2, layoutId }) {
    return transformProps.has(key) || key.startsWith("origin") || (layout2 || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
  }
  const translateAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective"
  };
  const numTransforms = transformPropOrder.length;
  function buildTransform(latestValues, transform, transformTemplate) {
    let transformString = "";
    let transformIsDefault = true;
    for (let i = 0; i < numTransforms; i++) {
      const key = transformPropOrder[i];
      const value = latestValues[key];
      if (value === void 0)
        continue;
      let valueIsDefault = true;
      if (typeof value === "number") {
        valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
      } else {
        valueIsDefault = parseFloat(value) === 0;
      }
      if (!valueIsDefault || transformTemplate) {
        const valueAsType = getValueAsType(value, numberValueTypes[key]);
        if (!valueIsDefault) {
          transformIsDefault = false;
          const transformName = translateAlias[key] || key;
          transformString += `${transformName}(${valueAsType}) `;
        }
        if (transformTemplate) {
          transform[key] = valueAsType;
        }
      }
    }
    transformString = transformString.trim();
    if (transformTemplate) {
      transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
    } else if (transformIsDefault) {
      transformString = "none";
    }
    return transformString;
  }
  function buildHTMLStyles(state, latestValues, transformTemplate) {
    const { style: style2, vars, transformOrigin } = state;
    let hasTransform2 = false;
    let hasTransformOrigin = false;
    for (const key in latestValues) {
      const value = latestValues[key];
      if (transformProps.has(key)) {
        hasTransform2 = true;
        continue;
      } else if (isCSSVariableName(key)) {
        vars[key] = value;
        continue;
      } else {
        const valueAsType = getValueAsType(value, numberValueTypes[key]);
        if (key.startsWith("origin")) {
          hasTransformOrigin = true;
          transformOrigin[key] = valueAsType;
        } else {
          style2[key] = valueAsType;
        }
      }
    }
    if (!latestValues.transform) {
      if (hasTransform2 || transformTemplate) {
        style2.transform = buildTransform(latestValues, state.transform, transformTemplate);
      } else if (style2.transform) {
        style2.transform = "none";
      }
    }
    if (hasTransformOrigin) {
      const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
      style2.transformOrigin = `${originX} ${originY} ${originZ}`;
    }
  }
  const createHtmlRenderState = () => ({
    style: {},
    transform: {},
    transformOrigin: {},
    vars: {}
  });
  function copyRawValuesOnly(target, source, props) {
    for (const key in source) {
      if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
        target[key] = source[key];
      }
    }
  }
  function useInitialMotionValues({ transformTemplate }, visualState) {
    return React.useMemo(() => {
      const state = createHtmlRenderState();
      buildHTMLStyles(state, visualState, transformTemplate);
      return Object.assign({}, state.vars, state.style);
    }, [visualState]);
  }
  function useStyle(props, visualState) {
    const styleProp = props.style || {};
    const style2 = {};
    copyRawValuesOnly(style2, styleProp, props);
    Object.assign(style2, useInitialMotionValues(props, visualState));
    return style2;
  }
  function useHTMLProps(props, visualState) {
    const htmlProps = {};
    const style2 = useStyle(props, visualState);
    if (props.drag && props.dragListener !== false) {
      htmlProps.draggable = false;
      style2.userSelect = style2.WebkitUserSelect = style2.WebkitTouchCallout = "none";
      style2.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
    }
    if (props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap)) {
      htmlProps.tabIndex = 0;
    }
    htmlProps.style = style2;
    return htmlProps;
  }
  const dashKeys = {
    offset: "stroke-dashoffset",
    array: "stroke-dasharray"
  };
  const camelKeys = {
    offset: "strokeDashoffset",
    array: "strokeDasharray"
  };
  function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
    attrs.pathLength = 1;
    const keys = useDashCase ? dashKeys : camelKeys;
    attrs[keys.offset] = px.transform(-offset);
    const pathLength = px.transform(length);
    const pathSpacing = px.transform(spacing);
    attrs[keys.array] = `${pathLength} ${pathSpacing}`;
  }
  function buildSVGAttrs(state, {
    attrX,
    attrY,
    attrScale,
    pathLength,
    pathSpacing = 1,
    pathOffset = 0,
...latest
  }, isSVGTag2, transformTemplate, styleProp) {
    buildHTMLStyles(state, latest, transformTemplate);
    if (isSVGTag2) {
      if (state.style.viewBox) {
        state.attrs.viewBox = state.style.viewBox;
      }
      return;
    }
    state.attrs = state.style;
    state.style = {};
    const { attrs, style: style2 } = state;
    if (attrs.transform) {
      style2.transform = attrs.transform;
      delete attrs.transform;
    }
    if (style2.transform || attrs.transformOrigin) {
      style2.transformOrigin = attrs.transformOrigin ?? "50% 50%";
      delete attrs.transformOrigin;
    }
    if (style2.transform) {
      style2.transformBox = styleProp?.transformBox ?? "fill-box";
      delete attrs.transformBox;
    }
    if (attrX !== void 0)
      attrs.x = attrX;
    if (attrY !== void 0)
      attrs.y = attrY;
    if (attrScale !== void 0)
      attrs.scale = attrScale;
    if (pathLength !== void 0) {
      buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
    }
  }
  const createSvgRenderState = () => ({
    ...createHtmlRenderState(),
    attrs: {}
  });
  const isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";
  function useSVGProps(props, visualState, _isStatic, Component2) {
    const visualProps = React.useMemo(() => {
      const state = createSvgRenderState();
      buildSVGAttrs(state, visualState, isSVGTag(Component2), props.transformTemplate, props.style);
      return {
        ...state.attrs,
        style: { ...state.style }
      };
    }, [visualState]);
    if (props.style) {
      const rawStyles = {};
      copyRawValuesOnly(rawStyles, props.style, props);
      visualProps.style = { ...rawStyles, ...visualProps.style };
    }
    return visualProps;
  }
  const lowercaseSVGElements = [
    "animate",
    "circle",
    "defs",
    "desc",
    "ellipse",
    "g",
    "image",
    "line",
    "filter",
    "marker",
    "mask",
    "metadata",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "rect",
    "stop",
    "switch",
    "symbol",
    "svg",
    "text",
    "tspan",
    "use",
    "view"
  ];
  function isSVGComponent(Component2) {
    if (
typeof Component2 !== "string" ||
Component2.includes("-")
    ) {
      return false;
    } else if (
lowercaseSVGElements.indexOf(Component2) > -1 ||
/[A-Z]/u.test(Component2)
    ) {
      return true;
    }
    return false;
  }
  function useRender(Component2, props, ref, { latestValues }, isStatic, forwardMotionProps = false) {
    const useVisualProps = isSVGComponent(Component2) ? useSVGProps : useHTMLProps;
    const visualProps = useVisualProps(props, latestValues, isStatic, Component2);
    const filteredProps = filterProps(props, typeof Component2 === "string", forwardMotionProps);
    const elementProps = Component2 !== React.Fragment ? { ...filteredProps, ...visualProps, ref } : {};
    const { children } = props;
    const renderedChildren = React.useMemo(() => isMotionValue(children) ? children.get() : children, [children]);
    return React.createElement(Component2, {
      ...elementProps,
      children: renderedChildren
    });
  }
  function getValueState(visualElement) {
    const state = [{}, {}];
    visualElement?.values.forEach((value, key) => {
      state[0][key] = value.get();
      state[1][key] = value.getVelocity();
    });
    return state;
  }
  function resolveVariantFromProps(props, definition, custom, visualElement) {
    if (typeof definition === "function") {
      const [current, velocity] = getValueState(visualElement);
      definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
    }
    if (typeof definition === "string") {
      definition = props.variants && props.variants[definition];
    }
    if (typeof definition === "function") {
      const [current, velocity] = getValueState(visualElement);
      definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
    }
    return definition;
  }
  function resolveMotionValue(value) {
    return isMotionValue(value) ? value.get() : value;
  }
  function makeState({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2, createRenderState }, props, context, presenceContext) {
    const state = {
      latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps2),
      renderState: createRenderState()
    };
    return state;
  }
  function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
    const values = {};
    const motionValues = scrapeMotionValues(props, {});
    for (const key in motionValues) {
      values[key] = resolveMotionValue(motionValues[key]);
    }
    let { initial, animate } = props;
    const isControllingVariants$1 = isControllingVariants(props);
    const isVariantNode$1 = isVariantNode(props);
    if (context && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== false) {
      if (initial === void 0)
        initial = context.initial;
      if (animate === void 0)
        animate = context.animate;
    }
    let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
    isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
    const variantToSet = isInitialAnimationBlocked ? animate : initial;
    if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
      const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
      for (let i = 0; i < list.length; i++) {
        const resolved = resolveVariantFromProps(props, list[i]);
        if (resolved) {
          const { transitionEnd, transition, ...target } = resolved;
          for (const key in target) {
            let valueTarget = target[key];
            if (Array.isArray(valueTarget)) {
              const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
              valueTarget = valueTarget[index];
            }
            if (valueTarget !== null) {
              values[key] = valueTarget;
            }
          }
          for (const key in transitionEnd) {
            values[key] = transitionEnd[key];
          }
        }
      }
    }
    return values;
  }
  const makeUseVisualState = (config) => (props, isStatic) => {
    const context = React.useContext(MotionContext);
    const presenceContext = React.useContext(PresenceContext);
    const make = () => makeState(config, props, context, presenceContext);
    return isStatic ? make() : useConstant(make);
  };
  function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
    const { style: style2 } = props;
    const newValues = {};
    for (const key in style2) {
      if (isMotionValue(style2[key]) || prevProps.style && isMotionValue(prevProps.style[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== void 0) {
        newValues[key] = style2[key];
      }
    }
    return newValues;
  }
  const useHTMLVisualState = makeUseVisualState({
    scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
    createRenderState: createHtmlRenderState
  });
  function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
    for (const key in props) {
      if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
        const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
        newValues[targetKey] = props[key];
      }
    }
    return newValues;
  }
  const useSVGVisualState = makeUseVisualState({
    scrapeMotionValuesFromProps,
    createRenderState: createSvgRenderState
  });
  const motionComponentSymbol = Symbol.for("motionComponentSymbol");
  function isRefObject(ref) {
    return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
  }
  function useMotionRef(visualState, visualElement, externalRef) {
    return React.useCallback(
      (instance) => {
        if (instance) {
          visualState.onMount && visualState.onMount(instance);
        }
        if (visualElement) {
          if (instance) {
            visualElement.mount(instance);
          } else {
            visualElement.unmount();
          }
        }
        if (externalRef) {
          if (typeof externalRef === "function") {
            externalRef(instance);
          } else if (isRefObject(externalRef)) {
            externalRef.current = instance;
          }
        }
      },
[visualElement]
    );
  }
  const camelToDash = (str) => str.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase();
  const optimizedAppearDataId = "framerAppearId";
  const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);
  const SwitchLayoutGroupContext = React.createContext({});
  function useVisualElement(Component2, visualState, props, createVisualElement, ProjectionNodeConstructor) {
    const { visualElement: parent } = React.useContext(MotionContext);
    const lazyContext = React.useContext(LazyContext);
    const presenceContext = React.useContext(PresenceContext);
    const reducedMotionConfig = React.useContext(MotionConfigContext).reducedMotion;
    const visualElementRef = React.useRef(null);
    createVisualElement = createVisualElement || lazyContext.renderer;
    if (!visualElementRef.current && createVisualElement) {
      visualElementRef.current = createVisualElement(Component2, {
        visualState,
        parent,
        props,
        presenceContext,
        blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
        reducedMotionConfig
      });
    }
    const visualElement = visualElementRef.current;
    const initialLayoutGroupConfig = React.useContext(SwitchLayoutGroupContext);
    if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) {
      createProjectionNode$1(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
    }
    const isMounted = React.useRef(false);
    React.useInsertionEffect(() => {
      if (visualElement && isMounted.current) {
        visualElement.update(props, presenceContext);
      }
    });
    const optimisedAppearId = props[optimizedAppearDataAttribute];
    const wantsHandoff = React.useRef(Boolean(optimisedAppearId) && !window.MotionHandoffIsComplete?.(optimisedAppearId) && window.MotionHasOptimisedAnimation?.(optimisedAppearId));
    useIsomorphicLayoutEffect(() => {
      if (!visualElement)
        return;
      isMounted.current = true;
      window.MotionIsMounted = true;
      visualElement.updateFeatures();
      visualElement.scheduleRenderMicrotask();
      if (wantsHandoff.current && visualElement.animationState) {
        visualElement.animationState.animateChanges();
      }
    });
    React.useEffect(() => {
      if (!visualElement)
        return;
      if (!wantsHandoff.current && visualElement.animationState) {
        visualElement.animationState.animateChanges();
      }
      if (wantsHandoff.current) {
        queueMicrotask(() => {
          window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
        });
        wantsHandoff.current = false;
      }
      visualElement.enteringChildren = void 0;
    });
    return visualElement;
  }
  function createProjectionNode$1(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
    const { layoutId, layout: layout2, drag: drag2, dragConstraints, layoutScroll, layoutRoot, layoutCrossfade } = props;
    visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent));
    visualElement.projection.setOptions({
      layoutId,
      layout: layout2,
      alwaysMeasureLayout: Boolean(drag2) || dragConstraints && isRefObject(dragConstraints),
      visualElement,
animationType: typeof layout2 === "string" ? layout2 : "both",
      initialPromotionConfig,
      crossfade: layoutCrossfade,
      layoutScroll,
      layoutRoot
    });
  }
  function getClosestProjectingNode(visualElement) {
    if (!visualElement)
      return void 0;
    return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
  }
  function createMotionComponent(Component2, { forwardMotionProps = false } = {}, preloadedFeatures, createVisualElement) {
    preloadedFeatures && loadFeatures(preloadedFeatures);
    const useVisualState = isSVGComponent(Component2) ? useSVGVisualState : useHTMLVisualState;
    function MotionDOMComponent(props, externalRef) {
      let MeasureLayout2;
      const configAndProps = {
        ...React.useContext(MotionConfigContext),
        ...props,
        layoutId: useLayoutId(props)
      };
      const { isStatic } = configAndProps;
      const context = useCreateMotionContext(props);
      const visualState = useVisualState(props, isStatic);
      if (!isStatic && isBrowser) {
        useStrictMode();
        const layoutProjection = getProjectionFunctionality(configAndProps);
        MeasureLayout2 = layoutProjection.MeasureLayout;
        context.visualElement = useVisualElement(Component2, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode);
      }
      return jsxRuntimeExports.jsxs(MotionContext.Provider, { value: context, children: [MeasureLayout2 && context.visualElement ? jsxRuntimeExports.jsx(MeasureLayout2, { visualElement: context.visualElement, ...configAndProps }) : null, useRender(Component2, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, forwardMotionProps)] });
    }
    MotionDOMComponent.displayName = `motion.${typeof Component2 === "string" ? Component2 : `create(${Component2.displayName ?? Component2.name ?? ""})`}`;
    const ForwardRefMotionComponent = React.forwardRef(MotionDOMComponent);
    ForwardRefMotionComponent[motionComponentSymbol] = Component2;
    return ForwardRefMotionComponent;
  }
  function useLayoutId({ layoutId }) {
    const layoutGroupId = React.useContext(LayoutGroupContext).id;
    return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
  }
  function useStrictMode(configAndProps, preloadedFeatures) {
    React.useContext(LazyContext).strict;
  }
  function getProjectionFunctionality(props) {
    const { drag: drag2, layout: layout2 } = featureDefinitions;
    if (!drag2 && !layout2)
      return {};
    const combined = { ...drag2, ...layout2 };
    return {
      MeasureLayout: drag2?.isEnabled(props) || layout2?.isEnabled(props) ? combined.MeasureLayout : void 0,
      ProjectionNode: combined.ProjectionNode
    };
  }
  function createMotionProxy(preloadedFeatures, createVisualElement) {
    if (typeof Proxy === "undefined") {
      return createMotionComponent;
    }
    const componentCache = new Map();
    const factory = (Component2, options) => {
      return createMotionComponent(Component2, options, preloadedFeatures, createVisualElement);
    };
    const deprecatedFactoryFunction = (Component2, options) => {
      return factory(Component2, options);
    };
    return new Proxy(deprecatedFactoryFunction, {
get: (_target, key) => {
        if (key === "create")
          return factory;
        if (!componentCache.has(key)) {
          componentCache.set(key, createMotionComponent(key, void 0, preloadedFeatures, createVisualElement));
        }
        return componentCache.get(key);
      }
    });
  }
  function convertBoundingBoxToBox({ top, left, right, bottom }) {
    return {
      x: { min: left, max: right },
      y: { min: top, max: bottom }
    };
  }
  function convertBoxToBoundingBox({ x, y }) {
    return { top: y.min, right: x.max, bottom: y.max, left: x.min };
  }
  function transformBoxPoints(point, transformPoint2) {
    if (!transformPoint2)
      return point;
    const topLeft = transformPoint2({ x: point.left, y: point.top });
    const bottomRight = transformPoint2({ x: point.right, y: point.bottom });
    return {
      top: topLeft.y,
      left: topLeft.x,
      bottom: bottomRight.y,
      right: bottomRight.x
    };
  }
  function isIdentityScale(scale2) {
    return scale2 === void 0 || scale2 === 1;
  }
  function hasScale({ scale: scale2, scaleX: scaleX2, scaleY: scaleY2 }) {
    return !isIdentityScale(scale2) || !isIdentityScale(scaleX2) || !isIdentityScale(scaleY2);
  }
  function hasTransform(values) {
    return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
  }
  function has2DTranslate(values) {
    return is2DTranslate(values.x) || is2DTranslate(values.y);
  }
  function is2DTranslate(value) {
    return value && value !== "0%";
  }
  function scalePoint(point, scale2, originPoint) {
    const distanceFromOrigin = point - originPoint;
    const scaled = scale2 * distanceFromOrigin;
    return originPoint + scaled;
  }
  function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
    if (boxScale !== void 0) {
      point = scalePoint(point, boxScale, originPoint);
    }
    return scalePoint(point, scale2, originPoint) + translate;
  }
  function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
    axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
    axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
  }
  function applyBoxDelta(box, { x, y }) {
    applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
    applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
  }
  const TREE_SCALE_SNAP_MIN = 0.999999999999;
  const TREE_SCALE_SNAP_MAX = 1.0000000000001;
  function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
    const treeLength = treePath.length;
    if (!treeLength)
      return;
    treeScale.x = treeScale.y = 1;
    let node;
    let delta;
    for (let i = 0; i < treeLength; i++) {
      node = treePath[i];
      delta = node.projectionDelta;
      const { visualElement } = node.options;
      if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") {
        continue;
      }
      if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) {
        transformBox(box, {
          x: -node.scroll.offset.x,
          y: -node.scroll.offset.y
        });
      }
      if (delta) {
        treeScale.x *= delta.x.scale;
        treeScale.y *= delta.y.scale;
        applyBoxDelta(box, delta);
      }
      if (isSharedTransition && hasTransform(node.latestValues)) {
        transformBox(box, node.latestValues);
      }
    }
    if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) {
      treeScale.x = 1;
    }
    if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) {
      treeScale.y = 1;
    }
  }
  function translateAxis(axis, distance2) {
    axis.min = axis.min + distance2;
    axis.max = axis.max + distance2;
  }
  function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
    const originPoint = mixNumber$1(axis.min, axis.max, axisOrigin);
    applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
  }
  function transformBox(box, transform) {
    transformAxis(box.x, transform.x, transform.scaleX, transform.scale, transform.originX);
    transformAxis(box.y, transform.y, transform.scaleY, transform.scale, transform.originY);
  }
  function measureViewportBox(instance, transformPoint2) {
    return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint2));
  }
  function measurePageBox(element, rootProjectionNode2, transformPagePoint) {
    const viewportBox = measureViewportBox(element, transformPagePoint);
    const { scroll } = rootProjectionNode2;
    if (scroll) {
      translateAxis(viewportBox.x, scroll.offset.x);
      translateAxis(viewportBox.y, scroll.offset.y);
    }
    return viewportBox;
  }
  const createAxisDelta = () => ({
    translate: 0,
    scale: 1,
    origin: 0,
    originPoint: 0
  });
  const createDelta = () => ({
    x: createAxisDelta(),
    y: createAxisDelta()
  });
  const createAxis = () => ({ min: 0, max: 0 });
  const createBox = () => ({
    x: createAxis(),
    y: createAxis()
  });
  const prefersReducedMotion = { current: null };
  const hasReducedMotionListener = { current: false };
  function initPrefersReducedMotion() {
    hasReducedMotionListener.current = true;
    if (!isBrowser)
      return;
    if (window.matchMedia) {
      const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
      const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
      motionMediaQuery.addEventListener("change", setReducedMotionPreferences);
      setReducedMotionPreferences();
    } else {
      prefersReducedMotion.current = false;
    }
  }
  const visualElementStore = new WeakMap();
  function updateMotionValuesFromProps(element, next, prev) {
    for (const key in next) {
      const nextValue = next[key];
      const prevValue = prev[key];
      if (isMotionValue(nextValue)) {
        element.addValue(key, nextValue);
      } else if (isMotionValue(prevValue)) {
        element.addValue(key, motionValue(nextValue, { owner: element }));
      } else if (prevValue !== nextValue) {
        if (element.hasValue(key)) {
          const existingValue = element.getValue(key);
          if (existingValue.liveStyle === true) {
            existingValue.jump(nextValue);
          } else if (!existingValue.hasAnimated) {
            existingValue.set(nextValue);
          }
        } else {
          const latestValue = element.getStaticValue(key);
          element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
        }
      }
    }
    for (const key in prev) {
      if (next[key] === void 0)
        element.removeValue(key);
    }
    return next;
  }
  const propEventHandlers = [
    "AnimationStart",
    "AnimationComplete",
    "Update",
    "BeforeLayoutMeasure",
    "LayoutMeasure",
    "LayoutAnimationStart",
    "LayoutAnimationComplete"
  ];
  class VisualElement {
scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
      return {};
    }
    constructor({ parent, props, presenceContext, reducedMotionConfig, blockInitialAnimation, visualState }, options = {}) {
      this.current = null;
      this.children = new Set();
      this.isVariantNode = false;
      this.isControllingVariants = false;
      this.shouldReduceMotion = null;
      this.values = new Map();
      this.KeyframeResolver = KeyframeResolver;
      this.features = {};
      this.valueSubscriptions = new Map();
      this.prevMotionValues = {};
      this.events = {};
      this.propEventSubscriptions = {};
      this.notifyUpdate = () => this.notify("Update", this.latestValues);
      this.render = () => {
        if (!this.current)
          return;
        this.triggerBuild();
        this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
      };
      this.renderScheduledAt = 0;
      this.scheduleRender = () => {
        const now2 = time.now();
        if (this.renderScheduledAt < now2) {
          this.renderScheduledAt = now2;
          frame.render(this.render, false, true);
        }
      };
      const { latestValues, renderState } = visualState;
      this.latestValues = latestValues;
      this.baseTarget = { ...latestValues };
      this.initialValues = props.initial ? { ...latestValues } : {};
      this.renderState = renderState;
      this.parent = parent;
      this.props = props;
      this.presenceContext = presenceContext;
      this.depth = parent ? parent.depth + 1 : 0;
      this.reducedMotionConfig = reducedMotionConfig;
      this.options = options;
      this.blockInitialAnimation = Boolean(blockInitialAnimation);
      this.isControllingVariants = isControllingVariants(props);
      this.isVariantNode = isVariantNode(props);
      if (this.isVariantNode) {
        this.variantChildren = new Set();
      }
      this.manuallyAnimateOnMount = Boolean(parent && parent.current);
      const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
      for (const key in initialMotionValues) {
        const value = initialMotionValues[key];
        if (latestValues[key] !== void 0 && isMotionValue(value)) {
          value.set(latestValues[key]);
        }
      }
    }
    mount(instance) {
      this.current = instance;
      visualElementStore.set(instance, this);
      if (this.projection && !this.projection.instance) {
        this.projection.mount(instance);
      }
      if (this.parent && this.isVariantNode && !this.isControllingVariants) {
        this.removeFromVariantTree = this.parent.addVariantChild(this);
      }
      this.values.forEach((value, key) => this.bindToMotionValue(key, value));
      if (!hasReducedMotionListener.current) {
        initPrefersReducedMotion();
      }
      this.shouldReduceMotion = this.reducedMotionConfig === "never" ? false : this.reducedMotionConfig === "always" ? true : prefersReducedMotion.current;
      this.parent?.addChild(this);
      this.update(this.props, this.presenceContext);
    }
    unmount() {
      this.projection && this.projection.unmount();
      cancelFrame(this.notifyUpdate);
      cancelFrame(this.render);
      this.valueSubscriptions.forEach((remove) => remove());
      this.valueSubscriptions.clear();
      this.removeFromVariantTree && this.removeFromVariantTree();
      this.parent?.removeChild(this);
      for (const key in this.events) {
        this.events[key].clear();
      }
      for (const key in this.features) {
        const feature = this.features[key];
        if (feature) {
          feature.unmount();
          feature.isMounted = false;
        }
      }
      this.current = null;
    }
    addChild(child) {
      this.children.add(child);
      this.enteringChildren ?? (this.enteringChildren = new Set());
      this.enteringChildren.add(child);
    }
    removeChild(child) {
      this.children.delete(child);
      this.enteringChildren && this.enteringChildren.delete(child);
    }
    bindToMotionValue(key, value) {
      if (this.valueSubscriptions.has(key)) {
        this.valueSubscriptions.get(key)();
      }
      const valueIsTransform = transformProps.has(key);
      if (valueIsTransform && this.onBindTransform) {
        this.onBindTransform();
      }
      const removeOnChange = value.on("change", (latestValue) => {
        this.latestValues[key] = latestValue;
        this.props.onUpdate && frame.preRender(this.notifyUpdate);
        if (valueIsTransform && this.projection) {
          this.projection.isTransformDirty = true;
        }
        this.scheduleRender();
      });
      let removeSyncCheck;
      if (window.MotionCheckAppearSync) {
        removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
      }
      this.valueSubscriptions.set(key, () => {
        removeOnChange();
        if (removeSyncCheck)
          removeSyncCheck();
        if (value.owner)
          value.stop();
      });
    }
    sortNodePosition(other) {
      if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) {
        return 0;
      }
      return this.sortInstanceNodePosition(this.current, other.current);
    }
    updateFeatures() {
      let key = "animation";
      for (key in featureDefinitions) {
        const featureDefinition = featureDefinitions[key];
        if (!featureDefinition)
          continue;
        const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
        if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
          this.features[key] = new FeatureConstructor(this);
        }
        if (this.features[key]) {
          const feature = this.features[key];
          if (feature.isMounted) {
            feature.update();
          } else {
            feature.mount();
            feature.isMounted = true;
          }
        }
      }
    }
    triggerBuild() {
      this.build(this.renderState, this.latestValues, this.props);
    }
measureViewportBox() {
      return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
    }
    getStaticValue(key) {
      return this.latestValues[key];
    }
    setStaticValue(key, value) {
      this.latestValues[key] = value;
    }
update(props, presenceContext) {
      if (props.transformTemplate || this.props.transformTemplate) {
        this.scheduleRender();
      }
      this.prevProps = this.props;
      this.props = props;
      this.prevPresenceContext = this.presenceContext;
      this.presenceContext = presenceContext;
      for (let i = 0; i < propEventHandlers.length; i++) {
        const key = propEventHandlers[i];
        if (this.propEventSubscriptions[key]) {
          this.propEventSubscriptions[key]();
          delete this.propEventSubscriptions[key];
        }
        const listenerName = "on" + key;
        const listener = props[listenerName];
        if (listener) {
          this.propEventSubscriptions[key] = this.on(key, listener);
        }
      }
      this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps, this), this.prevMotionValues);
      if (this.handleChildMotionValue) {
        this.handleChildMotionValue();
      }
    }
    getProps() {
      return this.props;
    }
getVariant(name) {
      return this.props.variants ? this.props.variants[name] : void 0;
    }
getDefaultTransition() {
      return this.props.transition;
    }
    getTransformPagePoint() {
      return this.props.transformPagePoint;
    }
    getClosestVariantNode() {
      return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
    }
addVariantChild(child) {
      const closestVariantNode = this.getClosestVariantNode();
      if (closestVariantNode) {
        closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
        return () => closestVariantNode.variantChildren.delete(child);
      }
    }
addValue(key, value) {
      const existingValue = this.values.get(key);
      if (value !== existingValue) {
        if (existingValue)
          this.removeValue(key);
        this.bindToMotionValue(key, value);
        this.values.set(key, value);
        this.latestValues[key] = value.get();
      }
    }
removeValue(key) {
      this.values.delete(key);
      const unsubscribe = this.valueSubscriptions.get(key);
      if (unsubscribe) {
        unsubscribe();
        this.valueSubscriptions.delete(key);
      }
      delete this.latestValues[key];
      this.removeValueFromRenderState(key, this.renderState);
    }
hasValue(key) {
      return this.values.has(key);
    }
    getValue(key, defaultValue) {
      if (this.props.values && this.props.values[key]) {
        return this.props.values[key];
      }
      let value = this.values.get(key);
      if (value === void 0 && defaultValue !== void 0) {
        value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
        this.addValue(key, value);
      }
      return value;
    }
readValue(key, target) {
      let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
      if (value !== void 0 && value !== null) {
        if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) {
          value = parseFloat(value);
        } else if (!findValueType(value) && complex.test(target)) {
          value = getAnimatableNone(key, target);
        }
        this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
      }
      return isMotionValue(value) ? value.get() : value;
    }
setBaseTarget(key, value) {
      this.baseTarget[key] = value;
    }
getBaseTarget(key) {
      const { initial } = this.props;
      let valueFromInitial;
      if (typeof initial === "string" || typeof initial === "object") {
        const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
        if (variant) {
          valueFromInitial = variant[key];
        }
      }
      if (initial && valueFromInitial !== void 0) {
        return valueFromInitial;
      }
      const target = this.getBaseTargetFromProps(this.props, key);
      if (target !== void 0 && !isMotionValue(target))
        return target;
      return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
    }
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = new SubscriptionManager();
      }
      return this.events[eventName].add(callback);
    }
    notify(eventName, ...args) {
      if (this.events[eventName]) {
        this.events[eventName].notify(...args);
      }
    }
    scheduleRenderMicrotask() {
      microtask.render(this.render);
    }
  }
  class DOMVisualElement extends VisualElement {
    constructor() {
      super(...arguments);
      this.KeyframeResolver = DOMKeyframesResolver;
    }
    sortInstanceNodePosition(a, b) {
      return a.compareDocumentPosition(b) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(props, key) {
      return props.style ? props.style[key] : void 0;
    }
    removeValueFromRenderState(key, { vars, style: style2 }) {
      delete vars[key];
      delete style2[key];
    }
    handleChildMotionValue() {
      if (this.childSubscription) {
        this.childSubscription();
        delete this.childSubscription;
      }
      const { children } = this.props;
      if (isMotionValue(children)) {
        this.childSubscription = children.on("change", (latest) => {
          if (this.current) {
            this.current.textContent = `${latest}`;
          }
        });
      }
    }
  }
  function renderHTML(element, { style: style2, vars }, styleProp, projection) {
    const elementStyle = element.style;
    let key;
    for (key in style2) {
      elementStyle[key] = style2[key];
    }
    projection?.applyProjectionStyles(elementStyle, styleProp);
    for (key in vars) {
      elementStyle.setProperty(key, vars[key]);
    }
  }
  function getComputedStyle$1(element) {
    return window.getComputedStyle(element);
  }
  class HTMLVisualElement extends DOMVisualElement {
    constructor() {
      super(...arguments);
      this.type = "html";
      this.renderInstance = renderHTML;
    }
    readValueFromInstance(instance, key) {
      if (transformProps.has(key)) {
        return this.projection?.isProjecting ? defaultTransformValue(key) : readTransformValue(instance, key);
      } else {
        const computedStyle = getComputedStyle$1(instance);
        const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
        return typeof value === "string" ? value.trim() : value;
      }
    }
    measureInstanceViewportBox(instance, { transformPagePoint }) {
      return measureViewportBox(instance, transformPagePoint);
    }
    build(renderState, latestValues, props) {
      buildHTMLStyles(renderState, latestValues, props.transformTemplate);
    }
    scrapeMotionValuesFromProps(props, prevProps, visualElement) {
      return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
    }
  }
  const camelCaseAttributes = new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
    "startOffset",
    "textLength",
    "lengthAdjust"
  ]);
  function renderSVG(element, renderState, _styleProp, projection) {
    renderHTML(element, renderState, void 0, projection);
    for (const key in renderState.attrs) {
      element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
    }
  }
  class SVGVisualElement extends DOMVisualElement {
    constructor() {
      super(...arguments);
      this.type = "svg";
      this.isSVGTag = false;
      this.measureInstanceViewportBox = createBox;
    }
    getBaseTargetFromProps(props, key) {
      return props[key];
    }
    readValueFromInstance(instance, key) {
      if (transformProps.has(key)) {
        const defaultType = getDefaultValueType(key);
        return defaultType ? defaultType.default || 0 : 0;
      }
      key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
      return instance.getAttribute(key);
    }
    scrapeMotionValuesFromProps(props, prevProps, visualElement) {
      return scrapeMotionValuesFromProps(props, prevProps, visualElement);
    }
    build(renderState, latestValues, props) {
      buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
    }
    renderInstance(instance, renderState, styleProp, projection) {
      renderSVG(instance, renderState, styleProp, projection);
    }
    mount(instance) {
      this.isSVGTag = isSVGTag(instance.tagName);
      super.mount(instance);
    }
  }
  const createDomVisualElement = (Component2, options) => {
    return isSVGComponent(Component2) ? new SVGVisualElement(options) : new HTMLVisualElement(options, {
      allowProjection: Component2 !== React.Fragment
    });
  };
  function resolveVariant(visualElement, definition, custom) {
    const props = visualElement.getProps();
    return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
  }
  const isKeyframesTarget = (v) => {
    return Array.isArray(v);
  };
  function setMotionValue(visualElement, key, value) {
    if (visualElement.hasValue(key)) {
      visualElement.getValue(key).set(value);
    } else {
      visualElement.addValue(key, motionValue(value));
    }
  }
  function resolveFinalValueInKeyframes(v) {
    return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
  }
  function setTarget(visualElement, definition) {
    const resolved = resolveVariant(visualElement, definition);
    let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
    target = { ...target, ...transitionEnd };
    for (const key in target) {
      const value = resolveFinalValueInKeyframes(target[key]);
      setMotionValue(visualElement, key, value);
    }
  }
  function isWillChangeMotionValue(value) {
    return Boolean(isMotionValue(value) && value.add);
  }
  function addValueToWillChange(visualElement, key) {
    const willChange = visualElement.getValue("willChange");
    if (isWillChangeMotionValue(willChange)) {
      return willChange.add(key);
    } else if (!willChange && MotionGlobalConfig.WillChange) {
      const newWillChange = new MotionGlobalConfig.WillChange("auto");
      visualElement.addValue("willChange", newWillChange);
      newWillChange.add(key);
    }
  }
  function getOptimisedAppearId(visualElement) {
    return visualElement.props[optimizedAppearDataAttribute];
  }
  const isNotNull = (value) => value !== null;
  function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe) {
    const resolvedKeyframes = keyframes2.filter(isNotNull);
    const index = repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
    return resolvedKeyframes[index];
  }
  const underDampedSpring = {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restSpeed: 10
  };
  const criticallyDampedSpring = (target) => ({
    type: "spring",
    stiffness: 550,
    damping: target === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10
  });
  const keyframesTransition = {
    type: "keyframes",
    duration: 0.8
  };
  const ease = {
    type: "keyframes",
    ease: [0.25, 0.1, 0.35, 1],
    duration: 0.3
  };
  const getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
    if (keyframes2.length > 2) {
      return keyframesTransition;
    } else if (transformProps.has(valueKey)) {
      return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
    }
    return ease;
  };
  function isTransitionDefined({ when, delay: _delay, delayChildren, staggerChildren, staggerDirection, repeat, repeatType, repeatDelay, from, elapsed, ...transition }) {
    return !!Object.keys(transition).length;
  }
  const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
    const valueTransition = getValueTransition(transition, name) || {};
    const delay2 = valueTransition.delay || transition.delay || 0;
    let { elapsed = 0 } = transition;
    elapsed = elapsed - secondsToMilliseconds(delay2);
    const options = {
      keyframes: Array.isArray(target) ? target : [null, target],
      ease: "easeOut",
      velocity: value.getVelocity(),
      ...valueTransition,
      delay: -elapsed,
      onUpdate: (v) => {
        value.set(v);
        valueTransition.onUpdate && valueTransition.onUpdate(v);
      },
      onComplete: () => {
        onComplete();
        valueTransition.onComplete && valueTransition.onComplete();
      },
      name,
      motionValue: value,
      element: isHandoff ? void 0 : element
    };
    if (!isTransitionDefined(valueTransition)) {
      Object.assign(options, getDefaultTransition(name, options));
    }
    options.duration && (options.duration = secondsToMilliseconds(options.duration));
    options.repeatDelay && (options.repeatDelay = secondsToMilliseconds(options.repeatDelay));
    if (options.from !== void 0) {
      options.keyframes[0] = options.from;
    }
    let shouldSkip = false;
    if (options.type === false || options.duration === 0 && !options.repeatDelay) {
      makeAnimationInstant(options);
      if (options.delay === 0) {
        shouldSkip = true;
      }
    }
    if (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations) {
      shouldSkip = true;
      makeAnimationInstant(options);
      options.delay = 0;
    }
    options.allowFlatten = !valueTransition.type && !valueTransition.ease;
    if (shouldSkip && !isHandoff && value.get() !== void 0) {
      const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
      if (finalKeyframe !== void 0) {
        frame.update(() => {
          options.onUpdate(finalKeyframe);
          options.onComplete();
        });
        return;
      }
    }
    return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
  };
  function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
    const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
    needsAnimating[key] = false;
    return shouldBlock;
  }
  function animateTarget(visualElement, targetAndTransition, { delay: delay2 = 0, transitionOverride, type } = {}) {
    let { transition = visualElement.getDefaultTransition(), transitionEnd, ...target } = targetAndTransition;
    if (transitionOverride)
      transition = transitionOverride;
    const animations2 = [];
    const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
    for (const key in target) {
      const value = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
      const valueTarget = target[key];
      if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
        continue;
      }
      const valueTransition = {
        delay: delay2,
        ...getValueTransition(transition || {}, key)
      };
      const currentValue = value.get();
      if (currentValue !== void 0 && !value.isAnimating && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity) {
        continue;
      }
      let isHandoff = false;
      if (window.MotionHandoffAnimation) {
        const appearId = getOptimisedAppearId(visualElement);
        if (appearId) {
          const startTime = window.MotionHandoffAnimation(appearId, key, frame);
          if (startTime !== null) {
            valueTransition.startTime = startTime;
            isHandoff = true;
          }
        }
      }
      addValueToWillChange(visualElement, key);
      value.start(animateMotionValue(key, value, valueTarget, visualElement.shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
      const animation = value.animation;
      if (animation) {
        animations2.push(animation);
      }
    }
    if (transitionEnd) {
      Promise.all(animations2).then(() => {
        frame.update(() => {
          transitionEnd && setTarget(visualElement, transitionEnd);
        });
      });
    }
    return animations2;
  }
  function calcChildStagger(children, child, delayChildren, staggerChildren = 0, staggerDirection = 1) {
    const index = Array.from(children).sort((a, b) => a.sortNodePosition(b)).indexOf(child);
    const numChildren = children.size;
    const maxStaggerDuration = (numChildren - 1) * staggerChildren;
    const delayIsFunction = typeof delayChildren === "function";
    return delayIsFunction ? delayChildren(index, numChildren) : staggerDirection === 1 ? index * staggerChildren : maxStaggerDuration - index * staggerChildren;
  }
  function animateVariant(visualElement, variant, options = {}) {
    const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? visualElement.presenceContext?.custom : void 0);
    let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
    if (options.transitionOverride) {
      transition = options.transitionOverride;
    }
    const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve();
    const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
      const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
      return animateChildren(visualElement, variant, forwardDelay, delayChildren, staggerChildren, staggerDirection, options);
    } : () => Promise.resolve();
    const { when } = transition;
    if (when) {
      const [first, last] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
      return first().then(() => last());
    } else {
      return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
    }
  }
  function animateChildren(visualElement, variant, delay2 = 0, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
    const animations2 = [];
    for (const child of visualElement.variantChildren) {
      child.notify("AnimationStart", variant);
      animations2.push(animateVariant(child, variant, {
        ...options,
        delay: delay2 + (typeof delayChildren === "function" ? 0 : delayChildren) + calcChildStagger(visualElement.variantChildren, child, delayChildren, staggerChildren, staggerDirection)
      }).then(() => child.notify("AnimationComplete", variant)));
    }
    return Promise.all(animations2);
  }
  function animateVisualElement(visualElement, definition, options = {}) {
    visualElement.notify("AnimationStart", definition);
    let animation;
    if (Array.isArray(definition)) {
      const animations2 = definition.map((variant) => animateVariant(visualElement, variant, options));
      animation = Promise.all(animations2);
    } else if (typeof definition === "string") {
      animation = animateVariant(visualElement, definition, options);
    } else {
      const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
      animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
    }
    return animation.then(() => {
      visualElement.notify("AnimationComplete", definition);
    });
  }
  function shallowCompare(next, prev) {
    if (!Array.isArray(prev))
      return false;
    const prevLength = prev.length;
    if (prevLength !== next.length)
      return false;
    for (let i = 0; i < prevLength; i++) {
      if (prev[i] !== next[i])
        return false;
    }
    return true;
  }
  const numVariantProps = variantProps.length;
  function getVariantContext(visualElement) {
    if (!visualElement)
      return void 0;
    if (!visualElement.isControllingVariants) {
      const context2 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
      if (visualElement.props.initial !== void 0) {
        context2.initial = visualElement.props.initial;
      }
      return context2;
    }
    const context = {};
    for (let i = 0; i < numVariantProps; i++) {
      const name = variantProps[i];
      const prop = visualElement.props[name];
      if (isVariantLabel(prop) || prop === false) {
        context[name] = prop;
      }
    }
    return context;
  }
  const reversePriorityOrder = [...variantPriorityOrder].reverse();
  const numAnimationTypes = variantPriorityOrder.length;
  function animateList(visualElement) {
    return (animations2) => Promise.all(animations2.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
  }
  function createAnimationState(visualElement) {
    let animate = animateList(visualElement);
    let state = createState();
    let isInitialRender = true;
    const buildResolvedTypeValues = (type) => (acc, definition) => {
      const resolved = resolveVariant(visualElement, definition, type === "exit" ? visualElement.presenceContext?.custom : void 0);
      if (resolved) {
        const { transition, transitionEnd, ...target } = resolved;
        acc = { ...acc, ...target, ...transitionEnd };
      }
      return acc;
    };
    function setAnimateFunction(makeAnimator) {
      animate = makeAnimator(visualElement);
    }
    function animateChanges(changedActiveType) {
      const { props } = visualElement;
      const context = getVariantContext(visualElement.parent) || {};
      const animations2 = [];
      const removedKeys = new Set();
      let encounteredKeys = {};
      let removedVariantIndex = Infinity;
      for (let i = 0; i < numAnimationTypes; i++) {
        const type = reversePriorityOrder[i];
        const typeState = state[type];
        const prop = props[type] !== void 0 ? props[type] : context[type];
        const propIsVariant = isVariantLabel(prop);
        const activeDelta = type === changedActiveType ? typeState.isActive : null;
        if (activeDelta === false)
          removedVariantIndex = i;
        let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
        if (isInherited && isInitialRender && visualElement.manuallyAnimateOnMount) {
          isInherited = false;
        }
        typeState.protectedKeys = { ...encounteredKeys };
        if (
!typeState.isActive && activeDelta === null ||
!prop && !typeState.prevProp ||
isAnimationControls(prop) || typeof prop === "boolean"
        ) {
          continue;
        }
        const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
        let shouldAnimateType = variantDidChange ||
type === changedActiveType && typeState.isActive && !isInherited && propIsVariant ||
i > removedVariantIndex && propIsVariant;
        let handledRemovedValues = false;
        const definitionList = Array.isArray(prop) ? prop : [prop];
        let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
        if (activeDelta === false)
          resolvedValues = {};
        const { prevResolvedValues = {} } = typeState;
        const allKeys = {
          ...prevResolvedValues,
          ...resolvedValues
        };
        const markToAnimate = (key) => {
          shouldAnimateType = true;
          if (removedKeys.has(key)) {
            handledRemovedValues = true;
            removedKeys.delete(key);
          }
          typeState.needsAnimating[key] = true;
          const motionValue2 = visualElement.getValue(key);
          if (motionValue2)
            motionValue2.liveStyle = false;
        };
        for (const key in allKeys) {
          const next = resolvedValues[key];
          const prev = prevResolvedValues[key];
          if (encounteredKeys.hasOwnProperty(key))
            continue;
          let valueHasChanged = false;
          if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
            valueHasChanged = !shallowCompare(next, prev);
          } else {
            valueHasChanged = next !== prev;
          }
          if (valueHasChanged) {
            if (next !== void 0 && next !== null) {
              markToAnimate(key);
            } else {
              removedKeys.add(key);
            }
          } else if (next !== void 0 && removedKeys.has(key)) {
            markToAnimate(key);
          } else {
            typeState.protectedKeys[key] = true;
          }
        }
        typeState.prevProp = prop;
        typeState.prevResolvedValues = resolvedValues;
        if (typeState.isActive) {
          encounteredKeys = { ...encounteredKeys, ...resolvedValues };
        }
        if (isInitialRender && visualElement.blockInitialAnimation) {
          shouldAnimateType = false;
        }
        const willAnimateViaParent = isInherited && variantDidChange;
        const needsAnimating = !willAnimateViaParent || handledRemovedValues;
        if (shouldAnimateType && needsAnimating) {
          animations2.push(...definitionList.map((animation) => {
            const options = { type };
            if (typeof animation === "string" && isInitialRender && !willAnimateViaParent && visualElement.manuallyAnimateOnMount && visualElement.parent) {
              const { parent } = visualElement;
              const parentVariant = resolveVariant(parent, animation);
              if (parent.enteringChildren && parentVariant) {
                const { delayChildren } = parentVariant.transition || {};
                options.delay = calcChildStagger(parent.enteringChildren, visualElement, delayChildren);
              }
            }
            return {
              animation,
              options
            };
          }));
        }
      }
      if (removedKeys.size) {
        const fallbackAnimation = {};
        if (typeof props.initial !== "boolean") {
          const initialTransition = resolveVariant(visualElement, Array.isArray(props.initial) ? props.initial[0] : props.initial);
          if (initialTransition && initialTransition.transition) {
            fallbackAnimation.transition = initialTransition.transition;
          }
        }
        removedKeys.forEach((key) => {
          const fallbackTarget = visualElement.getBaseTarget(key);
          const motionValue2 = visualElement.getValue(key);
          if (motionValue2)
            motionValue2.liveStyle = true;
          fallbackAnimation[key] = fallbackTarget ?? null;
        });
        animations2.push({ animation: fallbackAnimation });
      }
      let shouldAnimate = Boolean(animations2.length);
      if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) {
        shouldAnimate = false;
      }
      isInitialRender = false;
      return shouldAnimate ? animate(animations2) : Promise.resolve();
    }
    function setActive(type, isActive) {
      if (state[type].isActive === isActive)
        return Promise.resolve();
      visualElement.variantChildren?.forEach((child) => child.animationState?.setActive(type, isActive));
      state[type].isActive = isActive;
      const animations2 = animateChanges(type);
      for (const key in state) {
        state[key].protectedKeys = {};
      }
      return animations2;
    }
    return {
      animateChanges,
      setActive,
      setAnimateFunction,
      getState: () => state,
      reset: () => {
        state = createState();
        isInitialRender = true;
      }
    };
  }
  function checkVariantsDidChange(prev, next) {
    if (typeof next === "string") {
      return next !== prev;
    } else if (Array.isArray(next)) {
      return !shallowCompare(next, prev);
    }
    return false;
  }
  function createTypeState(isActive = false) {
    return {
      isActive,
      protectedKeys: {},
      needsAnimating: {},
      prevResolvedValues: {}
    };
  }
  function createState() {
    return {
      animate: createTypeState(true),
      whileInView: createTypeState(),
      whileHover: createTypeState(),
      whileTap: createTypeState(),
      whileDrag: createTypeState(),
      whileFocus: createTypeState(),
      exit: createTypeState()
    };
  }
  class Feature {
    constructor(node) {
      this.isMounted = false;
      this.node = node;
    }
    update() {
    }
  }
  class AnimationFeature extends Feature {
constructor(node) {
      super(node);
      node.animationState || (node.animationState = createAnimationState(node));
    }
    updateAnimationControlsSubscription() {
      const { animate } = this.node.getProps();
      if (isAnimationControls(animate)) {
        this.unmountControls = animate.subscribe(this.node);
      }
    }
mount() {
      this.updateAnimationControlsSubscription();
    }
    update() {
      const { animate } = this.node.getProps();
      const { animate: prevAnimate } = this.node.prevProps || {};
      if (animate !== prevAnimate) {
        this.updateAnimationControlsSubscription();
      }
    }
    unmount() {
      this.node.animationState.reset();
      this.unmountControls?.();
    }
  }
  let id$1 = 0;
  class ExitAnimationFeature extends Feature {
    constructor() {
      super(...arguments);
      this.id = id$1++;
    }
    update() {
      if (!this.node.presenceContext)
        return;
      const { isPresent, onExitComplete } = this.node.presenceContext;
      const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
      if (!this.node.animationState || isPresent === prevIsPresent) {
        return;
      }
      const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
      if (onExitComplete && !isPresent) {
        exitAnimation.then(() => {
          onExitComplete(this.id);
        });
      }
    }
    mount() {
      const { register, onExitComplete } = this.node.presenceContext || {};
      if (onExitComplete) {
        onExitComplete(this.id);
      }
      if (register) {
        this.unmount = register(this.id);
      }
    }
    unmount() {
    }
  }
  const animations = {
    animation: {
      Feature: AnimationFeature
    },
    exit: {
      Feature: ExitAnimationFeature
    }
  };
  function addDomEvent(target, eventName, handler, options = { passive: true }) {
    target.addEventListener(eventName, handler, options);
    return () => target.removeEventListener(eventName, handler);
  }
  function extractEventInfo(event) {
    return {
      point: {
        x: event.pageX,
        y: event.pageY
      }
    };
  }
  const addPointerInfo = (handler) => {
    return (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
  };
  function addPointerEvent(target, eventName, handler, options) {
    return addDomEvent(target, eventName, addPointerInfo(handler), options);
  }
  const SCALE_PRECISION = 1e-4;
  const SCALE_MIN = 1 - SCALE_PRECISION;
  const SCALE_MAX = 1 + SCALE_PRECISION;
  const TRANSLATE_PRECISION = 0.01;
  const TRANSLATE_MIN = 0 - TRANSLATE_PRECISION;
  const TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
  function calcLength(axis) {
    return axis.max - axis.min;
  }
  function isNear(value, target, maxDistance) {
    return Math.abs(value - target) <= maxDistance;
  }
  function calcAxisDelta(delta, source, target, origin = 0.5) {
    delta.origin = origin;
    delta.originPoint = mixNumber$1(source.min, source.max, delta.origin);
    delta.scale = calcLength(target) / calcLength(source);
    delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint;
    if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) {
      delta.scale = 1;
    }
    if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) {
      delta.translate = 0;
    }
  }
  function calcBoxDelta(delta, source, target, origin) {
    calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
    calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
  }
  function calcRelativeAxis(target, relative, parent) {
    target.min = parent.min + relative.min;
    target.max = target.min + calcLength(relative);
  }
  function calcRelativeBox(target, relative, parent) {
    calcRelativeAxis(target.x, relative.x, parent.x);
    calcRelativeAxis(target.y, relative.y, parent.y);
  }
  function calcRelativeAxisPosition(target, layout2, parent) {
    target.min = layout2.min - parent.min;
    target.max = target.min + calcLength(layout2);
  }
  function calcRelativePosition(target, layout2, parent) {
    calcRelativeAxisPosition(target.x, layout2.x, parent.x);
    calcRelativeAxisPosition(target.y, layout2.y, parent.y);
  }
  function eachAxis(callback) {
    return [callback("x"), callback("y")];
  }
  const getContextWindow = ({ current }) => {
    return current ? current.ownerDocument.defaultView : null;
  };
  const distance = (a, b) => Math.abs(a - b);
  function distance2D(a, b) {
    const xDelta = distance(a.x, b.x);
    const yDelta = distance(a.y, b.y);
    return Math.sqrt(xDelta ** 2 + yDelta ** 2);
  }
  class PanSession {
    constructor(event, handlers, { transformPagePoint, contextWindow = window, dragSnapToOrigin = false, distanceThreshold = 3 } = {}) {
      this.startEvent = null;
      this.lastMoveEvent = null;
      this.lastMoveEventInfo = null;
      this.handlers = {};
      this.contextWindow = window;
      this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo))
          return;
        const info2 = getPanInfo(this.lastMoveEventInfo, this.history);
        const isPanStarted = this.startEvent !== null;
        const isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
        if (!isPanStarted && !isDistancePastThreshold)
          return;
        const { point: point2 } = info2;
        const { timestamp: timestamp2 } = frameData;
        this.history.push({ ...point2, timestamp: timestamp2 });
        const { onStart, onMove } = this.handlers;
        if (!isPanStarted) {
          onStart && onStart(this.lastMoveEvent, info2);
          this.startEvent = this.lastMoveEvent;
        }
        onMove && onMove(this.lastMoveEvent, info2);
      };
      this.handlePointerMove = (event2, info2) => {
        this.lastMoveEvent = event2;
        this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint);
        frame.update(this.updatePoint, true);
      };
      this.handlePointerUp = (event2, info2) => {
        this.end();
        const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
        if (this.dragSnapToOrigin)
          resumeAnimation && resumeAnimation();
        if (!(this.lastMoveEvent && this.lastMoveEventInfo))
          return;
        const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
        if (this.startEvent && onEnd) {
          onEnd(event2, panInfo);
        }
        onSessionEnd && onSessionEnd(event2, panInfo);
      };
      if (!isPrimaryPointer(event))
        return;
      this.dragSnapToOrigin = dragSnapToOrigin;
      this.handlers = handlers;
      this.transformPagePoint = transformPagePoint;
      this.distanceThreshold = distanceThreshold;
      this.contextWindow = contextWindow || window;
      const info = extractEventInfo(event);
      const initialInfo = transformPoint(info, this.transformPagePoint);
      const { point } = initialInfo;
      const { timestamp } = frameData;
      this.history = [{ ...point, timestamp }];
      const { onSessionStart } = handlers;
      onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
      this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
    }
    updateHandlers(handlers) {
      this.handlers = handlers;
    }
    end() {
      this.removeListeners && this.removeListeners();
      cancelFrame(this.updatePoint);
    }
  }
  function transformPoint(info, transformPagePoint) {
    return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
  }
  function subtractPoint(a, b) {
    return { x: a.x - b.x, y: a.y - b.y };
  }
  function getPanInfo({ point }, history) {
    return {
      point,
      delta: subtractPoint(point, lastDevicePoint(history)),
      offset: subtractPoint(point, startDevicePoint(history)),
      velocity: getVelocity(history, 0.1)
    };
  }
  function startDevicePoint(history) {
    return history[0];
  }
  function lastDevicePoint(history) {
    return history[history.length - 1];
  }
  function getVelocity(history, timeDelta) {
    if (history.length < 2) {
      return { x: 0, y: 0 };
    }
    let i = history.length - 1;
    let timestampedPoint = null;
    const lastPoint = lastDevicePoint(history);
    while (i >= 0) {
      timestampedPoint = history[i];
      if (lastPoint.timestamp - timestampedPoint.timestamp > secondsToMilliseconds(timeDelta)) {
        break;
      }
      i--;
    }
    if (!timestampedPoint) {
      return { x: 0, y: 0 };
    }
    const time2 = millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
    if (time2 === 0) {
      return { x: 0, y: 0 };
    }
    const currentVelocity = {
      x: (lastPoint.x - timestampedPoint.x) / time2,
      y: (lastPoint.y - timestampedPoint.y) / time2
    };
    if (currentVelocity.x === Infinity) {
      currentVelocity.x = 0;
    }
    if (currentVelocity.y === Infinity) {
      currentVelocity.y = 0;
    }
    return currentVelocity;
  }
  function applyConstraints(point, { min, max }, elastic) {
    if (min !== void 0 && point < min) {
      point = elastic ? mixNumber$1(min, point, elastic.min) : Math.max(point, min);
    } else if (max !== void 0 && point > max) {
      point = elastic ? mixNumber$1(max, point, elastic.max) : Math.min(point, max);
    }
    return point;
  }
  function calcRelativeAxisConstraints(axis, min, max) {
    return {
      min: min !== void 0 ? axis.min + min : void 0,
      max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
    };
  }
  function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
    return {
      x: calcRelativeAxisConstraints(layoutBox.x, left, right),
      y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
    };
  }
  function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
    let min = constraintsAxis.min - layoutAxis.min;
    let max = constraintsAxis.max - layoutAxis.max;
    if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
      [min, max] = [max, min];
    }
    return { min, max };
  }
  function calcViewportConstraints(layoutBox, constraintsBox) {
    return {
      x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
      y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
    };
  }
  function calcOrigin(source, target) {
    let origin = 0.5;
    const sourceLength = calcLength(source);
    const targetLength = calcLength(target);
    if (targetLength > sourceLength) {
      origin = progress(target.min, target.max - sourceLength, source.min);
    } else if (sourceLength > targetLength) {
      origin = progress(source.min, source.max - targetLength, target.min);
    }
    return clamp(0, 1, origin);
  }
  function rebaseAxisConstraints(layout2, constraints) {
    const relativeConstraints = {};
    if (constraints.min !== void 0) {
      relativeConstraints.min = constraints.min - layout2.min;
    }
    if (constraints.max !== void 0) {
      relativeConstraints.max = constraints.max - layout2.min;
    }
    return relativeConstraints;
  }
  const defaultElastic = 0.35;
  function resolveDragElastic(dragElastic = defaultElastic) {
    if (dragElastic === false) {
      dragElastic = 0;
    } else if (dragElastic === true) {
      dragElastic = defaultElastic;
    }
    return {
      x: resolveAxisElastic(dragElastic, "left", "right"),
      y: resolveAxisElastic(dragElastic, "top", "bottom")
    };
  }
  function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
    return {
      min: resolvePointElastic(dragElastic, minLabel),
      max: resolvePointElastic(dragElastic, maxLabel)
    };
  }
  function resolvePointElastic(dragElastic, label) {
    return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
  }
  const elementDragControls = new WeakMap();
  class VisualElementDragControls {
    constructor(visualElement) {
      this.openDragLock = null;
      this.isDragging = false;
      this.currentDirection = null;
      this.originPoint = { x: 0, y: 0 };
      this.constraints = false;
      this.hasMutatedConstraints = false;
      this.elastic = createBox();
      this.latestPointerEvent = null;
      this.latestPanInfo = null;
      this.visualElement = visualElement;
    }
    start(originEvent, { snapToCursor = false, distanceThreshold } = {}) {
      const { presenceContext } = this.visualElement;
      if (presenceContext && presenceContext.isPresent === false)
        return;
      const onSessionStart = (event) => {
        const { dragSnapToOrigin: dragSnapToOrigin2 } = this.getProps();
        dragSnapToOrigin2 ? this.pauseAnimation() : this.stopAnimation();
        if (snapToCursor) {
          this.snapToCursor(extractEventInfo(event).point);
        }
      };
      const onStart = (event, info) => {
        const { drag: drag2, dragPropagation, onDragStart } = this.getProps();
        if (drag2 && !dragPropagation) {
          if (this.openDragLock)
            this.openDragLock();
          this.openDragLock = setDragLock(drag2);
          if (!this.openDragLock)
            return;
        }
        this.latestPointerEvent = event;
        this.latestPanInfo = info;
        this.isDragging = true;
        this.currentDirection = null;
        this.resolveConstraints();
        if (this.visualElement.projection) {
          this.visualElement.projection.isAnimationBlocked = true;
          this.visualElement.projection.target = void 0;
        }
        eachAxis((axis) => {
          let current = this.getAxisMotionValue(axis).get() || 0;
          if (percent.test(current)) {
            const { projection } = this.visualElement;
            if (projection && projection.layout) {
              const measuredAxis = projection.layout.layoutBox[axis];
              if (measuredAxis) {
                const length = calcLength(measuredAxis);
                current = length * (parseFloat(current) / 100);
              }
            }
          }
          this.originPoint[axis] = current;
        });
        if (onDragStart) {
          frame.postRender(() => onDragStart(event, info));
        }
        addValueToWillChange(this.visualElement, "transform");
        const { animationState } = this.visualElement;
        animationState && animationState.setActive("whileDrag", true);
      };
      const onMove = (event, info) => {
        this.latestPointerEvent = event;
        this.latestPanInfo = info;
        const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
        if (!dragPropagation && !this.openDragLock)
          return;
        const { offset } = info;
        if (dragDirectionLock && this.currentDirection === null) {
          this.currentDirection = getCurrentDirection(offset);
          if (this.currentDirection !== null) {
            onDirectionLock && onDirectionLock(this.currentDirection);
          }
          return;
        }
        this.updateAxis("x", info.point, offset);
        this.updateAxis("y", info.point, offset);
        this.visualElement.render();
        onDrag && onDrag(event, info);
      };
      const onSessionEnd = (event, info) => {
        this.latestPointerEvent = event;
        this.latestPanInfo = info;
        this.stop(event, info);
        this.latestPointerEvent = null;
        this.latestPanInfo = null;
      };
      const resumeAnimation = () => eachAxis((axis) => this.getAnimationState(axis) === "paused" && this.getAxisMotionValue(axis).animation?.play());
      const { dragSnapToOrigin } = this.getProps();
      this.panSession = new PanSession(originEvent, {
        onSessionStart,
        onStart,
        onMove,
        onSessionEnd,
        resumeAnimation
      }, {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin,
        distanceThreshold,
        contextWindow: getContextWindow(this.visualElement)
      });
    }
stop(event, panInfo) {
      const finalEvent = event || this.latestPointerEvent;
      const finalPanInfo = panInfo || this.latestPanInfo;
      const isDragging2 = this.isDragging;
      this.cancel();
      if (!isDragging2 || !finalPanInfo || !finalEvent)
        return;
      const { velocity } = finalPanInfo;
      this.startAnimation(velocity);
      const { onDragEnd } = this.getProps();
      if (onDragEnd) {
        frame.postRender(() => onDragEnd(finalEvent, finalPanInfo));
      }
    }
cancel() {
      this.isDragging = false;
      const { projection, animationState } = this.visualElement;
      if (projection) {
        projection.isAnimationBlocked = false;
      }
      this.panSession && this.panSession.end();
      this.panSession = void 0;
      const { dragPropagation } = this.getProps();
      if (!dragPropagation && this.openDragLock) {
        this.openDragLock();
        this.openDragLock = null;
      }
      animationState && animationState.setActive("whileDrag", false);
    }
    updateAxis(axis, _point, offset) {
      const { drag: drag2 } = this.getProps();
      if (!offset || !shouldDrag(axis, drag2, this.currentDirection))
        return;
      const axisValue = this.getAxisMotionValue(axis);
      let next = this.originPoint[axis] + offset[axis];
      if (this.constraints && this.constraints[axis]) {
        next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
      }
      axisValue.set(next);
    }
    resolveConstraints() {
      const { dragConstraints, dragElastic } = this.getProps();
      const layout2 = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : this.visualElement.projection?.layout;
      const prevConstraints = this.constraints;
      if (dragConstraints && isRefObject(dragConstraints)) {
        if (!this.constraints) {
          this.constraints = this.resolveRefConstraints();
        }
      } else {
        if (dragConstraints && layout2) {
          this.constraints = calcRelativeConstraints(layout2.layoutBox, dragConstraints);
        } else {
          this.constraints = false;
        }
      }
      this.elastic = resolveDragElastic(dragElastic);
      if (prevConstraints !== this.constraints && layout2 && this.constraints && !this.hasMutatedConstraints) {
        eachAxis((axis) => {
          if (this.constraints !== false && this.getAxisMotionValue(axis)) {
            this.constraints[axis] = rebaseAxisConstraints(layout2.layoutBox[axis], this.constraints[axis]);
          }
        });
      }
    }
    resolveRefConstraints() {
      const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
      if (!constraints || !isRefObject(constraints))
        return false;
      const constraintsElement = constraints.current;
      const { projection } = this.visualElement;
      if (!projection || !projection.layout)
        return false;
      const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
      let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
      if (onMeasureDragConstraints) {
        const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
        this.hasMutatedConstraints = !!userConstraints;
        if (userConstraints) {
          measuredConstraints = convertBoundingBoxToBox(userConstraints);
        }
      }
      return measuredConstraints;
    }
    startAnimation(velocity) {
      const { drag: drag2, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
      const constraints = this.constraints || {};
      const momentumAnimations = eachAxis((axis) => {
        if (!shouldDrag(axis, drag2, this.currentDirection)) {
          return;
        }
        let transition = constraints && constraints[axis] || {};
        if (dragSnapToOrigin)
          transition = { min: 0, max: 0 };
        const bounceStiffness = dragElastic ? 200 : 1e6;
        const bounceDamping = dragElastic ? 40 : 1e7;
        const inertia2 = {
          type: "inertia",
          velocity: dragMomentum ? velocity[axis] : 0,
          bounceStiffness,
          bounceDamping,
          timeConstant: 750,
          restDelta: 1,
          restSpeed: 10,
          ...dragTransition,
          ...transition
        };
        return this.startAxisValueAnimation(axis, inertia2);
      });
      return Promise.all(momentumAnimations).then(onDragTransitionEnd);
    }
    startAxisValueAnimation(axis, transition) {
      const axisValue = this.getAxisMotionValue(axis);
      addValueToWillChange(this.visualElement, axis);
      return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
    }
    stopAnimation() {
      eachAxis((axis) => this.getAxisMotionValue(axis).stop());
    }
    pauseAnimation() {
      eachAxis((axis) => this.getAxisMotionValue(axis).animation?.pause());
    }
    getAnimationState(axis) {
      return this.getAxisMotionValue(axis).animation?.state;
    }
getAxisMotionValue(axis) {
      const dragKey = `_drag${axis.toUpperCase()}`;
      const props = this.visualElement.getProps();
      const externalMotionValue = props[dragKey];
      return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
    }
    snapToCursor(point) {
      eachAxis((axis) => {
        const { drag: drag2 } = this.getProps();
        if (!shouldDrag(axis, drag2, this.currentDirection))
          return;
        const { projection } = this.visualElement;
        const axisValue = this.getAxisMotionValue(axis);
        if (projection && projection.layout) {
          const { min, max } = projection.layout.layoutBox[axis];
          axisValue.set(point[axis] - mixNumber$1(min, max, 0.5));
        }
      });
    }
scalePositionWithinConstraints() {
      if (!this.visualElement.current)
        return;
      const { drag: drag2, dragConstraints } = this.getProps();
      const { projection } = this.visualElement;
      if (!isRefObject(dragConstraints) || !projection || !this.constraints)
        return;
      this.stopAnimation();
      const boxProgress = { x: 0, y: 0 };
      eachAxis((axis) => {
        const axisValue = this.getAxisMotionValue(axis);
        if (axisValue && this.constraints !== false) {
          const latest = axisValue.get();
          boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis]);
        }
      });
      const { transformTemplate } = this.visualElement.getProps();
      this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
      projection.root && projection.root.updateScroll();
      projection.updateLayout();
      this.resolveConstraints();
      eachAxis((axis) => {
        if (!shouldDrag(axis, drag2, null))
          return;
        const axisValue = this.getAxisMotionValue(axis);
        const { min, max } = this.constraints[axis];
        axisValue.set(mixNumber$1(min, max, boxProgress[axis]));
      });
    }
    addListeners() {
      if (!this.visualElement.current)
        return;
      elementDragControls.set(this.visualElement, this);
      const element = this.visualElement.current;
      const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
        const { drag: drag2, dragListener = true } = this.getProps();
        drag2 && dragListener && this.start(event);
      });
      const measureDragConstraints = () => {
        const { dragConstraints } = this.getProps();
        if (isRefObject(dragConstraints) && dragConstraints.current) {
          this.constraints = this.resolveRefConstraints();
        }
      };
      const { projection } = this.visualElement;
      const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
      if (projection && !projection.layout) {
        projection.root && projection.root.updateScroll();
        projection.updateLayout();
      }
      frame.read(measureDragConstraints);
      const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
      const stopLayoutUpdateListener = projection.addEventListener("didUpdate", (({ delta, hasLayoutChanged }) => {
        if (this.isDragging && hasLayoutChanged) {
          eachAxis((axis) => {
            const motionValue2 = this.getAxisMotionValue(axis);
            if (!motionValue2)
              return;
            this.originPoint[axis] += delta[axis].translate;
            motionValue2.set(motionValue2.get() + delta[axis].translate);
          });
          this.visualElement.render();
        }
      }));
      return () => {
        stopResizeListener();
        stopPointerListener();
        stopMeasureLayoutListener();
        stopLayoutUpdateListener && stopLayoutUpdateListener();
      };
    }
    getProps() {
      const props = this.visualElement.getProps();
      const { drag: drag2 = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
      return {
        ...props,
        drag: drag2,
        dragDirectionLock,
        dragPropagation,
        dragConstraints,
        dragElastic,
        dragMomentum
      };
    }
  }
  function shouldDrag(direction, drag2, currentDirection) {
    return (drag2 === true || drag2 === direction) && (currentDirection === null || currentDirection === direction);
  }
  function getCurrentDirection(offset, lockThreshold = 10) {
    let direction = null;
    if (Math.abs(offset.y) > lockThreshold) {
      direction = "y";
    } else if (Math.abs(offset.x) > lockThreshold) {
      direction = "x";
    }
    return direction;
  }
  class DragGesture extends Feature {
    constructor(node) {
      super(node);
      this.removeGroupControls = noop;
      this.removeListeners = noop;
      this.controls = new VisualElementDragControls(node);
    }
    mount() {
      const { dragControls } = this.node.getProps();
      if (dragControls) {
        this.removeGroupControls = dragControls.subscribe(this.controls);
      }
      this.removeListeners = this.controls.addListeners() || noop;
    }
    unmount() {
      this.removeGroupControls();
      this.removeListeners();
    }
  }
  const asyncHandler = (handler) => (event, info) => {
    if (handler) {
      frame.postRender(() => handler(event, info));
    }
  };
  class PanGesture extends Feature {
    constructor() {
      super(...arguments);
      this.removePointerDownListener = noop;
    }
    onPointerDown(pointerDownEvent) {
      this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
        transformPagePoint: this.node.getTransformPagePoint(),
        contextWindow: getContextWindow(this.node)
      });
    }
    createPanHandlers() {
      const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
      return {
        onSessionStart: asyncHandler(onPanSessionStart),
        onStart: asyncHandler(onPanStart),
        onMove: onPan,
        onEnd: (event, info) => {
          delete this.session;
          if (onPanEnd) {
            frame.postRender(() => onPanEnd(event, info));
          }
        }
      };
    }
    mount() {
      this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
    }
    update() {
      this.session && this.session.updateHandlers(this.createPanHandlers());
    }
    unmount() {
      this.removePointerDownListener();
      this.session && this.session.end();
    }
  }
  const globalProjectionState = {
hasAnimatedSinceResize: true,
hasEverUpdated: false
  };
  function pixelsToPercent(pixels, axis) {
    if (axis.max === axis.min)
      return 0;
    return pixels / (axis.max - axis.min) * 100;
  }
  const correctBorderRadius = {
    correct: (latest, node) => {
      if (!node.target)
        return latest;
      if (typeof latest === "string") {
        if (px.test(latest)) {
          latest = parseFloat(latest);
        } else {
          return latest;
        }
      }
      const x = pixelsToPercent(latest, node.target.x);
      const y = pixelsToPercent(latest, node.target.y);
      return `${x}% ${y}%`;
    }
  };
  const correctBoxShadow = {
    correct: (latest, { treeScale, projectionDelta }) => {
      const original = latest;
      const shadow = complex.parse(latest);
      if (shadow.length > 5)
        return original;
      const template = complex.createTransformer(latest);
      const offset = typeof shadow[0] !== "number" ? 1 : 0;
      const xScale = projectionDelta.x.scale * treeScale.x;
      const yScale = projectionDelta.y.scale * treeScale.y;
      shadow[0 + offset] /= xScale;
      shadow[1 + offset] /= yScale;
      const averageScale = mixNumber$1(xScale, yScale, 0.5);
      if (typeof shadow[2 + offset] === "number")
        shadow[2 + offset] /= averageScale;
      if (typeof shadow[3 + offset] === "number")
        shadow[3 + offset] /= averageScale;
      return template(shadow);
    }
  };
  let hasTakenAnySnapshot = false;
  class MeasureLayoutWithContext extends React.Component {
componentDidMount() {
      const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
      const { projection } = visualElement;
      addScaleCorrector(defaultScaleCorrectors);
      if (projection) {
        if (layoutGroup.group)
          layoutGroup.group.add(projection);
        if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
          switchLayoutGroup.register(projection);
        }
        if (hasTakenAnySnapshot) {
          projection.root.didUpdate();
        }
        projection.addEventListener("animationComplete", () => {
          this.safeToRemove();
        });
        projection.setOptions({
          ...projection.options,
          onExitComplete: () => this.safeToRemove()
        });
      }
      globalProjectionState.hasEverUpdated = true;
    }
    getSnapshotBeforeUpdate(prevProps) {
      const { layoutDependency, visualElement, drag: drag2, isPresent } = this.props;
      const { projection } = visualElement;
      if (!projection)
        return null;
      projection.isPresent = isPresent;
      hasTakenAnySnapshot = true;
      if (drag2 || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0 || prevProps.isPresent !== isPresent) {
        projection.willUpdate();
      } else {
        this.safeToRemove();
      }
      if (prevProps.isPresent !== isPresent) {
        if (isPresent) {
          projection.promote();
        } else if (!projection.relegate()) {
          frame.postRender(() => {
            const stack = projection.getStack();
            if (!stack || !stack.members.length) {
              this.safeToRemove();
            }
          });
        }
      }
      return null;
    }
    componentDidUpdate() {
      const { projection } = this.props.visualElement;
      if (projection) {
        projection.root.didUpdate();
        microtask.postRender(() => {
          if (!projection.currentAnimation && projection.isLead()) {
            this.safeToRemove();
          }
        });
      }
    }
    componentWillUnmount() {
      const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
      const { projection } = visualElement;
      hasTakenAnySnapshot = true;
      if (projection) {
        projection.scheduleCheckAfterUnmount();
        if (layoutGroup && layoutGroup.group)
          layoutGroup.group.remove(projection);
        if (promoteContext && promoteContext.deregister)
          promoteContext.deregister(projection);
      }
    }
    safeToRemove() {
      const { safeToRemove } = this.props;
      safeToRemove && safeToRemove();
    }
    render() {
      return null;
    }
  }
  function MeasureLayout(props) {
    const [isPresent, safeToRemove] = usePresence();
    const layoutGroup = React.useContext(LayoutGroupContext);
    return jsxRuntimeExports.jsx(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: React.useContext(SwitchLayoutGroupContext), isPresent, safeToRemove });
  }
  const defaultScaleCorrectors = {
    borderRadius: {
      ...correctBorderRadius,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ]
    },
    borderTopLeftRadius: correctBorderRadius,
    borderTopRightRadius: correctBorderRadius,
    borderBottomLeftRadius: correctBorderRadius,
    borderBottomRightRadius: correctBorderRadius,
    boxShadow: correctBoxShadow
  };
  function animateSingleValue(value, keyframes2, options) {
    const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
    motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options));
    return motionValue$1.animation;
  }
  const compareByDepth = (a, b) => a.depth - b.depth;
  class FlatTree {
    constructor() {
      this.children = [];
      this.isDirty = false;
    }
    add(child) {
      addUniqueItem(this.children, child);
      this.isDirty = true;
    }
    remove(child) {
      removeItem(this.children, child);
      this.isDirty = true;
    }
    forEach(callback) {
      this.isDirty && this.children.sort(compareByDepth);
      this.isDirty = false;
      this.children.forEach(callback);
    }
  }
  function delay(callback, timeout) {
    const start = time.now();
    const checkElapsed = ({ timestamp }) => {
      const elapsed = timestamp - start;
      if (elapsed >= timeout) {
        cancelFrame(checkElapsed);
        callback(elapsed - timeout);
      }
    };
    frame.setup(checkElapsed, true);
    return () => cancelFrame(checkElapsed);
  }
  const borders = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"];
  const numBorders = borders.length;
  const asNumber = (value) => typeof value === "string" ? parseFloat(value) : value;
  const isPx = (value) => typeof value === "number" || px.test(value);
  function mixValues(target, follow, lead, progress2, shouldCrossfadeOpacity, isOnlyMember) {
    if (shouldCrossfadeOpacity) {
      target.opacity = mixNumber$1(0, lead.opacity ?? 1, easeCrossfadeIn(progress2));
      target.opacityExit = mixNumber$1(follow.opacity ?? 1, 0, easeCrossfadeOut(progress2));
    } else if (isOnlyMember) {
      target.opacity = mixNumber$1(follow.opacity ?? 1, lead.opacity ?? 1, progress2);
    }
    for (let i = 0; i < numBorders; i++) {
      const borderLabel = `border${borders[i]}Radius`;
      let followRadius = getRadius(follow, borderLabel);
      let leadRadius = getRadius(lead, borderLabel);
      if (followRadius === void 0 && leadRadius === void 0)
        continue;
      followRadius || (followRadius = 0);
      leadRadius || (leadRadius = 0);
      const canMix = followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius);
      if (canMix) {
        target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress2), 0);
        if (percent.test(leadRadius) || percent.test(followRadius)) {
          target[borderLabel] += "%";
        }
      } else {
        target[borderLabel] = leadRadius;
      }
    }
    if (follow.rotate || lead.rotate) {
      target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress2);
    }
  }
  function getRadius(values, radiusName) {
    return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
  }
  const easeCrossfadeIn = compress(0, 0.5, circOut);
  const easeCrossfadeOut = compress(0.5, 0.95, noop);
  function compress(min, max, easing) {
    return (p) => {
      if (p < min)
        return 0;
      if (p > max)
        return 1;
      return easing( progress(min, max, p));
    };
  }
  function copyAxisInto(axis, originAxis) {
    axis.min = originAxis.min;
    axis.max = originAxis.max;
  }
  function copyBoxInto(box, originBox) {
    copyAxisInto(box.x, originBox.x);
    copyAxisInto(box.y, originBox.y);
  }
  function copyAxisDeltaInto(delta, originDelta) {
    delta.translate = originDelta.translate;
    delta.scale = originDelta.scale;
    delta.originPoint = originDelta.originPoint;
    delta.origin = originDelta.origin;
  }
  function removePointDelta(point, translate, scale2, originPoint, boxScale) {
    point -= translate;
    point = scalePoint(point, 1 / scale2, originPoint);
    if (boxScale !== void 0) {
      point = scalePoint(point, 1 / boxScale, originPoint);
    }
    return point;
  }
  function removeAxisDelta(axis, translate = 0, scale2 = 1, origin = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
    if (percent.test(translate)) {
      translate = parseFloat(translate);
      const relativeProgress = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100);
      translate = relativeProgress - sourceAxis.min;
    }
    if (typeof translate !== "number")
      return;
    let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin);
    if (axis === originAxis)
      originPoint -= translate;
    axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
    axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
  }
  function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
    removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
  }
  const xKeys = ["x", "scaleX", "originX"];
  const yKeys = ["y", "scaleY", "originY"];
  function removeBoxTransforms(box, transforms, originBox, sourceBox) {
    removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
    removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
  }
  function isAxisDeltaZero(delta) {
    return delta.translate === 0 && delta.scale === 1;
  }
  function isDeltaZero(delta) {
    return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
  }
  function axisEquals(a, b) {
    return a.min === b.min && a.max === b.max;
  }
  function boxEquals(a, b) {
    return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
  }
  function axisEqualsRounded(a, b) {
    return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
  }
  function boxEqualsRounded(a, b) {
    return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
  }
  function aspectRatio(box) {
    return calcLength(box.x) / calcLength(box.y);
  }
  function axisDeltaEquals(a, b) {
    return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
  }
  class NodeStack {
    constructor() {
      this.members = [];
    }
    add(node) {
      addUniqueItem(this.members, node);
      node.scheduleRender();
    }
    remove(node) {
      removeItem(this.members, node);
      if (node === this.prevLead) {
        this.prevLead = void 0;
      }
      if (node === this.lead) {
        const prevLead = this.members[this.members.length - 1];
        if (prevLead) {
          this.promote(prevLead);
        }
      }
    }
    relegate(node) {
      const indexOfNode = this.members.findIndex((member) => node === member);
      if (indexOfNode === 0)
        return false;
      let prevLead;
      for (let i = indexOfNode; i >= 0; i--) {
        const member = this.members[i];
        if (member.isPresent !== false) {
          prevLead = member;
          break;
        }
      }
      if (prevLead) {
        this.promote(prevLead);
        return true;
      } else {
        return false;
      }
    }
    promote(node, preserveFollowOpacity) {
      const prevLead = this.lead;
      if (node === prevLead)
        return;
      this.prevLead = prevLead;
      this.lead = node;
      node.show();
      if (prevLead) {
        prevLead.instance && prevLead.scheduleRender();
        node.scheduleRender();
        node.resumeFrom = prevLead;
        if (preserveFollowOpacity) {
          node.resumeFrom.preserveOpacity = true;
        }
        if (prevLead.snapshot) {
          node.snapshot = prevLead.snapshot;
          node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
        }
        if (node.root && node.root.isUpdating) {
          node.isLayoutDirty = true;
        }
        const { crossfade } = node.options;
        if (crossfade === false) {
          prevLead.hide();
        }
      }
    }
    exitAnimationComplete() {
      this.members.forEach((node) => {
        const { options, resumingFrom } = node;
        options.onExitComplete && options.onExitComplete();
        if (resumingFrom) {
          resumingFrom.options.onExitComplete && resumingFrom.options.onExitComplete();
        }
      });
    }
    scheduleRender() {
      this.members.forEach((node) => {
        node.instance && node.scheduleRender(false);
      });
    }
removeLeadSnapshot() {
      if (this.lead && this.lead.snapshot) {
        this.lead.snapshot = void 0;
      }
    }
  }
  function buildProjectionTransform(delta, treeScale, latestTransform) {
    let transform = "";
    const xTranslate = delta.x.translate / treeScale.x;
    const yTranslate = delta.y.translate / treeScale.y;
    const zTranslate = latestTransform?.z || 0;
    if (xTranslate || yTranslate || zTranslate) {
      transform = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
    }
    if (treeScale.x !== 1 || treeScale.y !== 1) {
      transform += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
    }
    if (latestTransform) {
      const { transformPerspective, rotate: rotate2, rotateX, rotateY, skewX, skewY } = latestTransform;
      if (transformPerspective)
        transform = `perspective(${transformPerspective}px) ${transform}`;
      if (rotate2)
        transform += `rotate(${rotate2}deg) `;
      if (rotateX)
        transform += `rotateX(${rotateX}deg) `;
      if (rotateY)
        transform += `rotateY(${rotateY}deg) `;
      if (skewX)
        transform += `skewX(${skewX}deg) `;
      if (skewY)
        transform += `skewY(${skewY}deg) `;
    }
    const elementScaleX = delta.x.scale * treeScale.x;
    const elementScaleY = delta.y.scale * treeScale.y;
    if (elementScaleX !== 1 || elementScaleY !== 1) {
      transform += `scale(${elementScaleX}, ${elementScaleY})`;
    }
    return transform || "none";
  }
  const transformAxes = ["", "X", "Y", "Z"];
  const animationTarget = 1e3;
  let id = 0;
  function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
    const { latestValues } = visualElement;
    if (latestValues[key]) {
      values[key] = latestValues[key];
      visualElement.setStaticValue(key, 0);
      if (sharedAnimationValues) {
        sharedAnimationValues[key] = 0;
      }
    }
  }
  function cancelTreeOptimisedTransformAnimations(projectionNode) {
    projectionNode.hasCheckedOptimisedAppear = true;
    if (projectionNode.root === projectionNode)
      return;
    const { visualElement } = projectionNode.options;
    if (!visualElement)
      return;
    const appearId = getOptimisedAppearId(visualElement);
    if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
      const { layout: layout2, layoutId } = projectionNode.options;
      window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout2 || layoutId));
    }
    const { parent } = projectionNode;
    if (parent && !parent.hasCheckedOptimisedAppear) {
      cancelTreeOptimisedTransformAnimations(parent);
    }
  }
  function createProjectionNode({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
    return class ProjectionNode {
      constructor(latestValues = {}, parent = defaultParent?.()) {
        this.id = id++;
        this.animationId = 0;
        this.animationCommitId = 0;
        this.children = new Set();
        this.options = {};
        this.isTreeAnimating = false;
        this.isAnimationBlocked = false;
        this.isLayoutDirty = false;
        this.isProjectionDirty = false;
        this.isSharedProjectionDirty = false;
        this.isTransformDirty = false;
        this.updateManuallyBlocked = false;
        this.updateBlockedByResize = false;
        this.isUpdating = false;
        this.isSVG = false;
        this.needsReset = false;
        this.shouldResetTransform = false;
        this.hasCheckedOptimisedAppear = false;
        this.treeScale = { x: 1, y: 1 };
        this.eventHandlers = new Map();
        this.hasTreeAnimated = false;
        this.updateScheduled = false;
        this.scheduleUpdate = () => this.update();
        this.projectionUpdateScheduled = false;
        this.checkUpdateFailed = () => {
          if (this.isUpdating) {
            this.isUpdating = false;
            this.clearAllSnapshots();
          }
        };
        this.updateProjection = () => {
          this.projectionUpdateScheduled = false;
          this.nodes.forEach(propagateDirtyNodes);
          this.nodes.forEach(resolveTargetDelta);
          this.nodes.forEach(calcProjection);
          this.nodes.forEach(cleanDirtyNodes);
        };
        this.resolvedRelativeTargetAt = 0;
        this.hasProjected = false;
        this.isVisible = true;
        this.animationProgress = 0;
        this.sharedNodes = new Map();
        this.latestValues = latestValues;
        this.root = parent ? parent.root || parent : this;
        this.path = parent ? [...parent.path, parent] : [];
        this.parent = parent;
        this.depth = parent ? parent.depth + 1 : 0;
        for (let i = 0; i < this.path.length; i++) {
          this.path[i].shouldResetTransform = true;
        }
        if (this.root === this)
          this.nodes = new FlatTree();
      }
      addEventListener(name, handler) {
        if (!this.eventHandlers.has(name)) {
          this.eventHandlers.set(name, new SubscriptionManager());
        }
        return this.eventHandlers.get(name).add(handler);
      }
      notifyListeners(name, ...args) {
        const subscriptionManager = this.eventHandlers.get(name);
        subscriptionManager && subscriptionManager.notify(...args);
      }
      hasListeners(name) {
        return this.eventHandlers.has(name);
      }
mount(instance) {
        if (this.instance)
          return;
        this.isSVG = isSVGElement(instance) && !isSVGSVGElement(instance);
        this.instance = instance;
        const { layoutId, layout: layout2, visualElement } = this.options;
        if (visualElement && !visualElement.current) {
          visualElement.mount(instance);
        }
        this.root.nodes.add(this);
        this.parent && this.parent.children.add(this);
        if (this.root.hasTreeAnimated && (layout2 || layoutId)) {
          this.isLayoutDirty = true;
        }
        if (attachResizeListener) {
          let cancelDelay;
          let innerWidth = 0;
          const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
          frame.read(() => {
            innerWidth = window.innerWidth;
          });
          attachResizeListener(instance, () => {
            const newInnerWidth = window.innerWidth;
            if (newInnerWidth === innerWidth)
              return;
            innerWidth = newInnerWidth;
            this.root.updateBlockedByResize = true;
            cancelDelay && cancelDelay();
            cancelDelay = delay(resizeUnblockUpdate, 250);
            if (globalProjectionState.hasAnimatedSinceResize) {
              globalProjectionState.hasAnimatedSinceResize = false;
              this.nodes.forEach(finishAnimation);
            }
          });
        }
        if (layoutId) {
          this.root.registerSharedNode(layoutId, this);
        }
        if (this.options.animate !== false && visualElement && (layoutId || layout2)) {
          this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeLayoutChanged, layout: newLayout }) => {
            if (this.isTreeAnimationBlocked()) {
              this.target = void 0;
              this.relativeTarget = void 0;
              return;
            }
            const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
            const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
            const hasTargetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout);
            const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeLayoutChanged;
            if (this.options.layoutRoot || this.resumeFrom || hasOnlyRelativeTargetChanged || hasLayoutChanged && (hasTargetChanged || !this.currentAnimation)) {
              if (this.resumeFrom) {
                this.resumingFrom = this.resumeFrom;
                this.resumingFrom.resumingFrom = void 0;
              }
              const animationOptions = {
                ...getValueTransition(layoutTransition, "layout"),
                onPlay: onLayoutAnimationStart,
                onComplete: onLayoutAnimationComplete
              };
              if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
                animationOptions.delay = 0;
                animationOptions.type = false;
              }
              this.startAnimation(animationOptions);
              this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
            } else {
              if (!hasLayoutChanged) {
                finishAnimation(this);
              }
              if (this.isLead() && this.options.onExitComplete) {
                this.options.onExitComplete();
              }
            }
            this.targetLayout = newLayout;
          });
        }
      }
      unmount() {
        this.options.layoutId && this.willUpdate();
        this.root.nodes.remove(this);
        const stack = this.getStack();
        stack && stack.remove(this);
        this.parent && this.parent.children.delete(this);
        this.instance = void 0;
        this.eventHandlers.clear();
        cancelFrame(this.updateProjection);
      }
blockUpdate() {
        this.updateManuallyBlocked = true;
      }
      unblockUpdate() {
        this.updateManuallyBlocked = false;
      }
      isUpdateBlocked() {
        return this.updateManuallyBlocked || this.updateBlockedByResize;
      }
      isTreeAnimationBlocked() {
        return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
      }
startUpdate() {
        if (this.isUpdateBlocked())
          return;
        this.isUpdating = true;
        this.nodes && this.nodes.forEach(resetSkewAndRotation);
        this.animationId++;
      }
      getTransformTemplate() {
        const { visualElement } = this.options;
        return visualElement && visualElement.getProps().transformTemplate;
      }
      willUpdate(shouldNotifyListeners = true) {
        this.root.hasTreeAnimated = true;
        if (this.root.isUpdateBlocked()) {
          this.options.onExitComplete && this.options.onExitComplete();
          return;
        }
        if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) {
          cancelTreeOptimisedTransformAnimations(this);
        }
        !this.root.isUpdating && this.root.startUpdate();
        if (this.isLayoutDirty)
          return;
        this.isLayoutDirty = true;
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          node.shouldResetTransform = true;
          node.updateScroll("snapshot");
          if (node.options.layoutRoot) {
            node.willUpdate(false);
          }
        }
        const { layoutId, layout: layout2 } = this.options;
        if (layoutId === void 0 && !layout2)
          return;
        const transformTemplate = this.getTransformTemplate();
        this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
        this.updateSnapshot();
        shouldNotifyListeners && this.notifyListeners("willUpdate");
      }
      update() {
        this.updateScheduled = false;
        const updateWasBlocked = this.isUpdateBlocked();
        if (updateWasBlocked) {
          this.unblockUpdate();
          this.clearAllSnapshots();
          this.nodes.forEach(clearMeasurements);
          return;
        }
        if (this.animationId <= this.animationCommitId) {
          this.nodes.forEach(clearIsLayoutDirty);
          return;
        }
        this.animationCommitId = this.animationId;
        if (!this.isUpdating) {
          this.nodes.forEach(clearIsLayoutDirty);
        } else {
          this.isUpdating = false;
          this.nodes.forEach(resetTransformStyle);
          this.nodes.forEach(updateLayout);
          this.nodes.forEach(notifyLayoutUpdate);
        }
        this.clearAllSnapshots();
        const now2 = time.now();
        frameData.delta = clamp(0, 1e3 / 60, now2 - frameData.timestamp);
        frameData.timestamp = now2;
        frameData.isProcessing = true;
        frameSteps.update.process(frameData);
        frameSteps.preRender.process(frameData);
        frameSteps.render.process(frameData);
        frameData.isProcessing = false;
      }
      didUpdate() {
        if (!this.updateScheduled) {
          this.updateScheduled = true;
          microtask.read(this.scheduleUpdate);
        }
      }
      clearAllSnapshots() {
        this.nodes.forEach(clearSnapshot);
        this.sharedNodes.forEach(removeLeadSnapshots);
      }
      scheduleUpdateProjection() {
        if (!this.projectionUpdateScheduled) {
          this.projectionUpdateScheduled = true;
          frame.preRender(this.updateProjection, false, true);
        }
      }
      scheduleCheckAfterUnmount() {
        frame.postRender(() => {
          if (this.isLayoutDirty) {
            this.root.didUpdate();
          } else {
            this.root.checkUpdateFailed();
          }
        });
      }
updateSnapshot() {
        if (this.snapshot || !this.instance)
          return;
        this.snapshot = this.measure();
        if (this.snapshot && !calcLength(this.snapshot.measuredBox.x) && !calcLength(this.snapshot.measuredBox.y)) {
          this.snapshot = void 0;
        }
      }
      updateLayout() {
        if (!this.instance)
          return;
        this.updateScroll();
        if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) {
          return;
        }
        if (this.resumeFrom && !this.resumeFrom.instance) {
          for (let i = 0; i < this.path.length; i++) {
            const node = this.path[i];
            node.updateScroll();
          }
        }
        const prevLayout = this.layout;
        this.layout = this.measure(false);
        this.layoutCorrected = createBox();
        this.isLayoutDirty = false;
        this.projectionDelta = void 0;
        this.notifyListeners("measure", this.layout.layoutBox);
        const { visualElement } = this.options;
        visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
      }
      updateScroll(phase = "measure") {
        let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
        if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) {
          needsMeasurement = false;
        }
        if (needsMeasurement && this.instance) {
          const isRoot = checkIsScrollRoot(this.instance);
          this.scroll = {
            animationId: this.root.animationId,
            phase,
            isRoot,
            offset: measureScroll(this.instance),
            wasRoot: this.scroll ? this.scroll.isRoot : isRoot
          };
        }
      }
      resetTransform() {
        if (!resetTransform)
          return;
        const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
        const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
        const transformTemplate = this.getTransformTemplate();
        const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
        const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
        if (isResetRequested && this.instance && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
          resetTransform(this.instance, transformTemplateValue);
          this.shouldResetTransform = false;
          this.scheduleRender();
        }
      }
      measure(removeTransform = true) {
        const pageBox = this.measurePageBox();
        let layoutBox = this.removeElementScroll(pageBox);
        if (removeTransform) {
          layoutBox = this.removeTransform(layoutBox);
        }
        roundBox(layoutBox);
        return {
          animationId: this.root.animationId,
          measuredBox: pageBox,
          layoutBox,
          latestValues: {},
          source: this.id
        };
      }
      measurePageBox() {
        const { visualElement } = this.options;
        if (!visualElement)
          return createBox();
        const box = visualElement.measureViewportBox();
        const wasInScrollRoot = this.scroll?.wasRoot || this.path.some(checkNodeWasScrollRoot);
        if (!wasInScrollRoot) {
          const { scroll } = this.root;
          if (scroll) {
            translateAxis(box.x, scroll.offset.x);
            translateAxis(box.y, scroll.offset.y);
          }
        }
        return box;
      }
      removeElementScroll(box) {
        const boxWithoutScroll = createBox();
        copyBoxInto(boxWithoutScroll, box);
        if (this.scroll?.wasRoot) {
          return boxWithoutScroll;
        }
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          const { scroll, options } = node;
          if (node !== this.root && scroll && options.layoutScroll) {
            if (scroll.wasRoot) {
              copyBoxInto(boxWithoutScroll, box);
            }
            translateAxis(boxWithoutScroll.x, scroll.offset.x);
            translateAxis(boxWithoutScroll.y, scroll.offset.y);
          }
        }
        return boxWithoutScroll;
      }
      applyTransform(box, transformOnly = false) {
        const withTransforms = createBox();
        copyBoxInto(withTransforms, box);
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) {
            transformBox(withTransforms, {
              x: -node.scroll.offset.x,
              y: -node.scroll.offset.y
            });
          }
          if (!hasTransform(node.latestValues))
            continue;
          transformBox(withTransforms, node.latestValues);
        }
        if (hasTransform(this.latestValues)) {
          transformBox(withTransforms, this.latestValues);
        }
        return withTransforms;
      }
      removeTransform(box) {
        const boxWithoutTransform = createBox();
        copyBoxInto(boxWithoutTransform, box);
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          if (!node.instance)
            continue;
          if (!hasTransform(node.latestValues))
            continue;
          hasScale(node.latestValues) && node.updateSnapshot();
          const sourceBox = createBox();
          const nodeBox = node.measurePageBox();
          copyBoxInto(sourceBox, nodeBox);
          removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot ? node.snapshot.layoutBox : void 0, sourceBox);
        }
        if (hasTransform(this.latestValues)) {
          removeBoxTransforms(boxWithoutTransform, this.latestValues);
        }
        return boxWithoutTransform;
      }
      setTargetDelta(delta) {
        this.targetDelta = delta;
        this.root.scheduleUpdateProjection();
        this.isProjectionDirty = true;
      }
      setOptions(options) {
        this.options = {
          ...this.options,
          ...options,
          crossfade: options.crossfade !== void 0 ? options.crossfade : true
        };
      }
      clearMeasurements() {
        this.scroll = void 0;
        this.layout = void 0;
        this.snapshot = void 0;
        this.prevTransformTemplateValue = void 0;
        this.targetDelta = void 0;
        this.target = void 0;
        this.isLayoutDirty = false;
      }
      forceRelativeParentToResolveTarget() {
        if (!this.relativeParent)
          return;
        if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) {
          this.relativeParent.resolveTargetDelta(true);
        }
      }
      resolveTargetDelta(forceRecalculation = false) {
        const lead = this.getLead();
        this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
        this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
        this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
        const isShared = Boolean(this.resumingFrom) || this !== lead;
        const canSkip = !(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize);
        if (canSkip)
          return;
        const { layout: layout2, layoutId } = this.options;
        if (!this.layout || !(layout2 || layoutId))
          return;
        this.resolvedRelativeTargetAt = frameData.timestamp;
        if (!this.targetDelta && !this.relativeTarget) {
          const relativeParent = this.getClosestProjectingParent();
          if (relativeParent && relativeParent.layout && this.animationProgress !== 1) {
            this.relativeParent = relativeParent;
            this.forceRelativeParentToResolveTarget();
            this.relativeTarget = createBox();
            this.relativeTargetOrigin = createBox();
            calcRelativePosition(this.relativeTargetOrigin, this.layout.layoutBox, relativeParent.layout.layoutBox);
            copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
          } else {
            this.relativeParent = this.relativeTarget = void 0;
          }
        }
        if (!this.relativeTarget && !this.targetDelta)
          return;
        if (!this.target) {
          this.target = createBox();
          this.targetWithTransforms = createBox();
        }
        if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
          this.forceRelativeParentToResolveTarget();
          calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target);
        } else if (this.targetDelta) {
          if (Boolean(this.resumingFrom)) {
            this.target = this.applyTransform(this.layout.layoutBox);
          } else {
            copyBoxInto(this.target, this.layout.layoutBox);
          }
          applyBoxDelta(this.target, this.targetDelta);
        } else {
          copyBoxInto(this.target, this.layout.layoutBox);
        }
        if (this.attemptToResolveRelativeTarget) {
          this.attemptToResolveRelativeTarget = false;
          const relativeParent = this.getClosestProjectingParent();
          if (relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
            this.relativeParent = relativeParent;
            this.forceRelativeParentToResolveTarget();
            this.relativeTarget = createBox();
            this.relativeTargetOrigin = createBox();
            calcRelativePosition(this.relativeTargetOrigin, this.target, relativeParent.target);
            copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
          } else {
            this.relativeParent = this.relativeTarget = void 0;
          }
        }
      }
      getClosestProjectingParent() {
        if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) {
          return void 0;
        }
        if (this.parent.isProjecting()) {
          return this.parent;
        } else {
          return this.parent.getClosestProjectingParent();
        }
      }
      isProjecting() {
        return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
      }
      calcProjection() {
        const lead = this.getLead();
        const isShared = Boolean(this.resumingFrom) || this !== lead;
        let canSkip = true;
        if (this.isProjectionDirty || this.parent?.isProjectionDirty) {
          canSkip = false;
        }
        if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) {
          canSkip = false;
        }
        if (this.resolvedRelativeTargetAt === frameData.timestamp) {
          canSkip = false;
        }
        if (canSkip)
          return;
        const { layout: layout2, layoutId } = this.options;
        this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
        if (!this.isTreeAnimating) {
          this.targetDelta = this.relativeTarget = void 0;
        }
        if (!this.layout || !(layout2 || layoutId))
          return;
        copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
        const prevTreeScaleX = this.treeScale.x;
        const prevTreeScaleY = this.treeScale.y;
        applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
        if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
          lead.target = lead.layout.layoutBox;
          lead.targetWithTransforms = createBox();
        }
        const { target } = lead;
        if (!target) {
          if (this.prevProjectionDelta) {
            this.createProjectionDeltas();
            this.scheduleRender();
          }
          return;
        }
        if (!this.projectionDelta || !this.prevProjectionDelta) {
          this.createProjectionDeltas();
        } else {
          copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
          copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
        }
        calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
        if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
          this.hasProjected = true;
          this.scheduleRender();
          this.notifyListeners("projectionUpdate", target);
        }
      }
      hide() {
        this.isVisible = false;
      }
      show() {
        this.isVisible = true;
      }
      scheduleRender(notifyAll = true) {
        this.options.visualElement?.scheduleRender();
        if (notifyAll) {
          const stack = this.getStack();
          stack && stack.scheduleRender();
        }
        if (this.resumingFrom && !this.resumingFrom.instance) {
          this.resumingFrom = void 0;
        }
      }
      createProjectionDeltas() {
        this.prevProjectionDelta = createDelta();
        this.projectionDelta = createDelta();
        this.projectionDeltaWithTransform = createDelta();
      }
      setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
        const snapshot = this.snapshot;
        const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
        const mixedValues = { ...this.latestValues };
        const targetDelta = createDelta();
        if (!this.relativeParent || !this.relativeParent.options.layoutRoot) {
          this.relativeTarget = this.relativeTargetOrigin = void 0;
        }
        this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
        const relativeLayout = createBox();
        const snapshotSource = snapshot ? snapshot.source : void 0;
        const layoutSource = this.layout ? this.layout.source : void 0;
        const isSharedLayoutAnimation = snapshotSource !== layoutSource;
        const stack = this.getStack();
        const isOnlyMember = !stack || stack.members.length <= 1;
        const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
        this.animationProgress = 0;
        let prevRelativeTarget;
        this.mixTargetDelta = (latest) => {
          const progress2 = latest / 1e3;
          mixAxisDelta(targetDelta.x, delta.x, progress2);
          mixAxisDelta(targetDelta.y, delta.y, progress2);
          this.setTargetDelta(targetDelta);
          if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
            calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox);
            mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress2);
            if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) {
              this.isProjectionDirty = false;
            }
            if (!prevRelativeTarget)
              prevRelativeTarget = createBox();
            copyBoxInto(prevRelativeTarget, this.relativeTarget);
          }
          if (isSharedLayoutAnimation) {
            this.animationValues = mixedValues;
            mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress2, shouldCrossfadeOpacity, isOnlyMember);
          }
          this.root.scheduleUpdateProjection();
          this.scheduleRender();
          this.animationProgress = progress2;
        };
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
      }
      startAnimation(options) {
        this.notifyListeners("animationStart");
        this.currentAnimation?.stop();
        this.resumingFrom?.currentAnimation?.stop();
        if (this.pendingAnimation) {
          cancelFrame(this.pendingAnimation);
          this.pendingAnimation = void 0;
        }
        this.pendingAnimation = frame.update(() => {
          globalProjectionState.hasAnimatedSinceResize = true;
          this.motionValue || (this.motionValue = motionValue(0));
          this.currentAnimation = animateSingleValue(this.motionValue, [0, 1e3], {
            ...options,
            velocity: 0,
            isSync: true,
            onUpdate: (latest) => {
              this.mixTargetDelta(latest);
              options.onUpdate && options.onUpdate(latest);
            },
            onStop: () => {
            },
            onComplete: () => {
              options.onComplete && options.onComplete();
              this.completeAnimation();
            }
          });
          if (this.resumingFrom) {
            this.resumingFrom.currentAnimation = this.currentAnimation;
          }
          this.pendingAnimation = void 0;
        });
      }
      completeAnimation() {
        if (this.resumingFrom) {
          this.resumingFrom.currentAnimation = void 0;
          this.resumingFrom.preserveOpacity = void 0;
        }
        const stack = this.getStack();
        stack && stack.exitAnimationComplete();
        this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
        this.notifyListeners("animationComplete");
      }
      finishAnimation() {
        if (this.currentAnimation) {
          this.mixTargetDelta && this.mixTargetDelta(animationTarget);
          this.currentAnimation.stop();
        }
        this.completeAnimation();
      }
      applyTransformsToTarget() {
        const lead = this.getLead();
        let { targetWithTransforms, target, layout: layout2, latestValues } = lead;
        if (!targetWithTransforms || !target || !layout2)
          return;
        if (this !== lead && this.layout && layout2 && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout2.layoutBox)) {
          target = this.target || createBox();
          const xLength = calcLength(this.layout.layoutBox.x);
          target.x.min = lead.target.x.min;
          target.x.max = target.x.min + xLength;
          const yLength = calcLength(this.layout.layoutBox.y);
          target.y.min = lead.target.y.min;
          target.y.max = target.y.min + yLength;
        }
        copyBoxInto(targetWithTransforms, target);
        transformBox(targetWithTransforms, latestValues);
        calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
      }
      registerSharedNode(layoutId, node) {
        if (!this.sharedNodes.has(layoutId)) {
          this.sharedNodes.set(layoutId, new NodeStack());
        }
        const stack = this.sharedNodes.get(layoutId);
        stack.add(node);
        const config = node.options.initialPromotionConfig;
        node.promote({
          transition: config ? config.transition : void 0,
          preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : void 0
        });
      }
      isLead() {
        const stack = this.getStack();
        return stack ? stack.lead === this : true;
      }
      getLead() {
        const { layoutId } = this.options;
        return layoutId ? this.getStack()?.lead || this : this;
      }
      getPrevLead() {
        const { layoutId } = this.options;
        return layoutId ? this.getStack()?.prevLead : void 0;
      }
      getStack() {
        const { layoutId } = this.options;
        if (layoutId)
          return this.root.sharedNodes.get(layoutId);
      }
      promote({ needsReset, transition, preserveFollowOpacity } = {}) {
        const stack = this.getStack();
        if (stack)
          stack.promote(this, preserveFollowOpacity);
        if (needsReset) {
          this.projectionDelta = void 0;
          this.needsReset = true;
        }
        if (transition)
          this.setOptions({ transition });
      }
      relegate() {
        const stack = this.getStack();
        if (stack) {
          return stack.relegate(this);
        } else {
          return false;
        }
      }
      resetSkewAndRotation() {
        const { visualElement } = this.options;
        if (!visualElement)
          return;
        let hasDistortingTransform = false;
        const { latestValues } = visualElement;
        if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) {
          hasDistortingTransform = true;
        }
        if (!hasDistortingTransform)
          return;
        const resetValues = {};
        if (latestValues.z) {
          resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
        }
        for (let i = 0; i < transformAxes.length; i++) {
          resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
          resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
        }
        visualElement.render();
        for (const key in resetValues) {
          visualElement.setStaticValue(key, resetValues[key]);
          if (this.animationValues) {
            this.animationValues[key] = resetValues[key];
          }
        }
        visualElement.scheduleRender();
      }
      applyProjectionStyles(targetStyle, styleProp) {
        if (!this.instance || this.isSVG)
          return;
        if (!this.isVisible) {
          targetStyle.visibility = "hidden";
          return;
        }
        const transformTemplate = this.getTransformTemplate();
        if (this.needsReset) {
          this.needsReset = false;
          targetStyle.visibility = "";
          targetStyle.opacity = "";
          targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
          targetStyle.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
          return;
        }
        const lead = this.getLead();
        if (!this.projectionDelta || !this.layout || !lead.target) {
          if (this.options.layoutId) {
            targetStyle.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
            targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
          }
          if (this.hasProjected && !hasTransform(this.latestValues)) {
            targetStyle.transform = transformTemplate ? transformTemplate({}, "") : "none";
            this.hasProjected = false;
          }
          return;
        }
        targetStyle.visibility = "";
        const valuesToRender = lead.animationValues || lead.latestValues;
        this.applyTransformsToTarget();
        let transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
        if (transformTemplate) {
          transform = transformTemplate(valuesToRender, transform);
        }
        targetStyle.transform = transform;
        const { x, y } = this.projectionDelta;
        targetStyle.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`;
        if (lead.animationValues) {
          targetStyle.opacity = lead === this ? valuesToRender.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
        } else {
          targetStyle.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
        }
        for (const key in scaleCorrectors) {
          if (valuesToRender[key] === void 0)
            continue;
          const { correct, applyTo, isCSSVariable } = scaleCorrectors[key];
          const corrected = transform === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
          if (applyTo) {
            const num = applyTo.length;
            for (let i = 0; i < num; i++) {
              targetStyle[applyTo[i]] = corrected;
            }
          } else {
            if (isCSSVariable) {
              this.options.visualElement.renderState.vars[key] = corrected;
            } else {
              targetStyle[key] = corrected;
            }
          }
        }
        if (this.options.layoutId) {
          targetStyle.pointerEvents = lead === this ? resolveMotionValue(styleProp?.pointerEvents) || "" : "none";
        }
      }
      clearSnapshot() {
        this.resumeFrom = this.snapshot = void 0;
      }
resetTree() {
        this.root.nodes.forEach((node) => node.currentAnimation?.stop());
        this.root.nodes.forEach(clearMeasurements);
        this.root.sharedNodes.clear();
      }
    };
  }
  function updateLayout(node) {
    node.updateLayout();
  }
  function notifyLayoutUpdate(node) {
    const snapshot = node.resumeFrom?.snapshot || node.snapshot;
    if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
      const { layoutBox: layout2, measuredBox: measuredLayout } = node.layout;
      const { animationType } = node.options;
      const isShared = snapshot.source !== node.layout.source;
      if (animationType === "size") {
        eachAxis((axis) => {
          const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
          const length = calcLength(axisSnapshot);
          axisSnapshot.min = layout2[axis].min;
          axisSnapshot.max = axisSnapshot.min + length;
        });
      } else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout2)) {
        eachAxis((axis) => {
          const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
          const length = calcLength(layout2[axis]);
          axisSnapshot.max = axisSnapshot.min + length;
          if (node.relativeTarget && !node.currentAnimation) {
            node.isProjectionDirty = true;
            node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
          }
        });
      }
      const layoutDelta = createDelta();
      calcBoxDelta(layoutDelta, layout2, snapshot.layoutBox);
      const visualDelta = createDelta();
      if (isShared) {
        calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
      } else {
        calcBoxDelta(visualDelta, layout2, snapshot.layoutBox);
      }
      const hasLayoutChanged = !isDeltaZero(layoutDelta);
      let hasRelativeLayoutChanged = false;
      if (!node.resumeFrom) {
        const relativeParent = node.getClosestProjectingParent();
        if (relativeParent && !relativeParent.resumeFrom) {
          const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
          if (parentSnapshot && parentLayout) {
            const relativeSnapshot = createBox();
            calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox);
            const relativeLayout = createBox();
            calcRelativePosition(relativeLayout, layout2, parentLayout.layoutBox);
            if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) {
              hasRelativeLayoutChanged = true;
            }
            if (relativeParent.options.layoutRoot) {
              node.relativeTarget = relativeLayout;
              node.relativeTargetOrigin = relativeSnapshot;
              node.relativeParent = relativeParent;
            }
          }
        }
      }
      node.notifyListeners("didUpdate", {
        layout: layout2,
        snapshot,
        delta: visualDelta,
        layoutDelta,
        hasLayoutChanged,
        hasRelativeLayoutChanged
      });
    } else if (node.isLead()) {
      const { onExitComplete } = node.options;
      onExitComplete && onExitComplete();
    }
    node.options.transition = void 0;
  }
  function propagateDirtyNodes(node) {
    if (!node.parent)
      return;
    if (!node.isProjecting()) {
      node.isProjectionDirty = node.parent.isProjectionDirty;
    }
    node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
    node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
  }
  function cleanDirtyNodes(node) {
    node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
  }
  function clearSnapshot(node) {
    node.clearSnapshot();
  }
  function clearMeasurements(node) {
    node.clearMeasurements();
  }
  function clearIsLayoutDirty(node) {
    node.isLayoutDirty = false;
  }
  function resetTransformStyle(node) {
    const { visualElement } = node.options;
    if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) {
      visualElement.notify("BeforeLayoutMeasure");
    }
    node.resetTransform();
  }
  function finishAnimation(node) {
    node.finishAnimation();
    node.targetDelta = node.relativeTarget = node.target = void 0;
    node.isProjectionDirty = true;
  }
  function resolveTargetDelta(node) {
    node.resolveTargetDelta();
  }
  function calcProjection(node) {
    node.calcProjection();
  }
  function resetSkewAndRotation(node) {
    node.resetSkewAndRotation();
  }
  function removeLeadSnapshots(stack) {
    stack.removeLeadSnapshot();
  }
  function mixAxisDelta(output, delta, p) {
    output.translate = mixNumber$1(delta.translate, 0, p);
    output.scale = mixNumber$1(delta.scale, 1, p);
    output.origin = delta.origin;
    output.originPoint = delta.originPoint;
  }
  function mixAxis(output, from, to, p) {
    output.min = mixNumber$1(from.min, to.min, p);
    output.max = mixNumber$1(from.max, to.max, p);
  }
  function mixBox(output, from, to, p) {
    mixAxis(output.x, from.x, to.x, p);
    mixAxis(output.y, from.y, to.y, p);
  }
  function hasOpacityCrossfade(node) {
    return node.animationValues && node.animationValues.opacityExit !== void 0;
  }
  const defaultLayoutTransition = {
    duration: 0.45,
    ease: [0.4, 0, 0.1, 1]
  };
  const userAgentContains = (string) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string);
  const roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop;
  function roundAxis(axis) {
    axis.min = roundPoint(axis.min);
    axis.max = roundPoint(axis.max);
  }
  function roundBox(box) {
    roundAxis(box.x);
    roundAxis(box.y);
  }
  function shouldAnimatePositionOnly(animationType, snapshot, layout2) {
    return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout2), 0.2);
  }
  function checkNodeWasScrollRoot(node) {
    return node !== node.root && node.scroll?.wasRoot;
  }
  const DocumentProjectionNode = createProjectionNode({
    attachResizeListener: (ref, notify2) => addDomEvent(ref, "resize", notify2),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body.scrollLeft,
      y: document.documentElement.scrollTop || document.body.scrollTop
    }),
    checkIsScrollRoot: () => true
  });
  const rootProjectionNode = {
    current: void 0
  };
  const HTMLProjectionNode = createProjectionNode({
    measureScroll: (instance) => ({
      x: instance.scrollLeft,
      y: instance.scrollTop
    }),
    defaultParent: () => {
      if (!rootProjectionNode.current) {
        const documentNode = new DocumentProjectionNode({});
        documentNode.mount(window);
        documentNode.setOptions({ layoutScroll: true });
        rootProjectionNode.current = documentNode;
      }
      return rootProjectionNode.current;
    },
    resetTransform: (instance, value) => {
      instance.style.transform = value !== void 0 ? value : "none";
    },
    checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
  });
  const drag = {
    pan: {
      Feature: PanGesture
    },
    drag: {
      Feature: DragGesture,
      ProjectionNode: HTMLProjectionNode,
      MeasureLayout
    }
  };
  function handleHoverEvent(node, event, lifecycle) {
    const { props } = node;
    if (node.animationState && props.whileHover) {
      node.animationState.setActive("whileHover", lifecycle === "Start");
    }
    const eventName = "onHover" + lifecycle;
    const callback = props[eventName];
    if (callback) {
      frame.postRender(() => callback(event, extractEventInfo(event)));
    }
  }
  class HoverGesture extends Feature {
    mount() {
      const { current } = this.node;
      if (!current)
        return;
      this.unmount = hover(current, (_element, startEvent) => {
        handleHoverEvent(this.node, startEvent, "Start");
        return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
      });
    }
    unmount() {
    }
  }
  class FocusGesture extends Feature {
    constructor() {
      super(...arguments);
      this.isActive = false;
    }
    onFocus() {
      let isFocusVisible = false;
      try {
        isFocusVisible = this.node.current.matches(":focus-visible");
      } catch (e) {
        isFocusVisible = true;
      }
      if (!isFocusVisible || !this.node.animationState)
        return;
      this.node.animationState.setActive("whileFocus", true);
      this.isActive = true;
    }
    onBlur() {
      if (!this.isActive || !this.node.animationState)
        return;
      this.node.animationState.setActive("whileFocus", false);
      this.isActive = false;
    }
    mount() {
      this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
    }
    unmount() {
    }
  }
  function handlePressEvent(node, event, lifecycle) {
    const { props } = node;
    if (node.current instanceof HTMLButtonElement && node.current.disabled) {
      return;
    }
    if (node.animationState && props.whileTap) {
      node.animationState.setActive("whileTap", lifecycle === "Start");
    }
    const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle);
    const callback = props[eventName];
    if (callback) {
      frame.postRender(() => callback(event, extractEventInfo(event)));
    }
  }
  class PressGesture extends Feature {
    mount() {
      const { current } = this.node;
      if (!current)
        return;
      this.unmount = press(current, (_element, startEvent) => {
        handlePressEvent(this.node, startEvent, "Start");
        return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
      }, { useGlobalTarget: this.node.props.globalTapTarget });
    }
    unmount() {
    }
  }
  const observerCallbacks = new WeakMap();
  const observers = new WeakMap();
  const fireObserverCallback = (entry) => {
    const callback = observerCallbacks.get(entry.target);
    callback && callback(entry);
  };
  const fireAllObserverCallbacks = (entries) => {
    entries.forEach(fireObserverCallback);
  };
  function initIntersectionObserver({ root, ...options }) {
    const lookupRoot = root || document;
    if (!observers.has(lookupRoot)) {
      observers.set(lookupRoot, {});
    }
    const rootObservers = observers.get(lookupRoot);
    const key = JSON.stringify(options);
    if (!rootObservers[key]) {
      rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options });
    }
    return rootObservers[key];
  }
  function observeIntersection(element, options, callback) {
    const rootInteresectionObserver = initIntersectionObserver(options);
    observerCallbacks.set(element, callback);
    rootInteresectionObserver.observe(element);
    return () => {
      observerCallbacks.delete(element);
      rootInteresectionObserver.unobserve(element);
    };
  }
  const thresholdNames = {
    some: 0,
    all: 1
  };
  class InViewFeature extends Feature {
    constructor() {
      super(...arguments);
      this.hasEnteredView = false;
      this.isInView = false;
    }
    startObserver() {
      this.unmount();
      const { viewport = {} } = this.node.getProps();
      const { root, margin: rootMargin, amount = "some", once } = viewport;
      const options = {
        root: root ? root.current : void 0,
        rootMargin,
        threshold: typeof amount === "number" ? amount : thresholdNames[amount]
      };
      const onIntersectionUpdate = (entry) => {
        const { isIntersecting } = entry;
        if (this.isInView === isIntersecting)
          return;
        this.isInView = isIntersecting;
        if (once && !isIntersecting && this.hasEnteredView) {
          return;
        } else if (isIntersecting) {
          this.hasEnteredView = true;
        }
        if (this.node.animationState) {
          this.node.animationState.setActive("whileInView", isIntersecting);
        }
        const { onViewportEnter, onViewportLeave } = this.node.getProps();
        const callback = isIntersecting ? onViewportEnter : onViewportLeave;
        callback && callback(entry);
      };
      return observeIntersection(this.node.current, options, onIntersectionUpdate);
    }
    mount() {
      this.startObserver();
    }
    update() {
      if (typeof IntersectionObserver === "undefined")
        return;
      const { props, prevProps } = this.node;
      const hasOptionsChanged = ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps));
      if (hasOptionsChanged) {
        this.startObserver();
      }
    }
    unmount() {
    }
  }
  function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
    return (name) => viewport[name] !== prevViewport[name];
  }
  const gestureAnimations = {
    inView: {
      Feature: InViewFeature
    },
    tap: {
      Feature: PressGesture
    },
    focus: {
      Feature: FocusGesture
    },
    hover: {
      Feature: HoverGesture
    }
  };
  const layout = {
    layout: {
      ProjectionNode: HTMLProjectionNode,
      MeasureLayout
    }
  };
  const featureBundle = {
    ...animations,
    ...gestureAnimations,
    ...drag,
    ...layout
  };
  const motion = createMotionProxy(featureBundle, createDomVisualElement);
  let addMessage = null;
  function MessageHolder() {
    const [message2, setMessage] = React.useState([]);
    const timers = React.useRef( new Map());
    const deleteMessage = (msgId) => {
      setMessage(
        (prev) => prev.filter((n) => {
          timers.current.delete(msgId);
          return n.id !== msgId;
        })
      );
    };
    React.useEffect(() => {
      addMessage = ({ id: id2, type, duration, ...rest }) => {
        const now2 = Date.now();
        const timeout = duration ?? 3;
        const msgId = id2 ?? now2;
        const msgType = type ?? "info";
        setMessage((prev) => {
          const index = prev.findIndex((m) => m.id === msgId);
          if (index > -1) {
            const newMessage = [...prev];
            newMessage[index] = {
              ...newMessage[index],
              content: rest.content,
              type: msgType,
              ...duration ? { duration } : {}
            };
            return newMessage;
          }
          return [
            ...prev,
            { id: msgId, type: type ?? "info", duration: timeout, ...rest }
          ];
        });
        if (timers.current.has(msgId)) {
          clearTimeout(timers.current.get(msgId));
        }
        if (timeout > 0) {
          const t = setTimeout(() => {
            deleteMessage(msgId);
          }, timeout * 1e3);
          timers.current.set(msgId, t);
        }
        return () => {
          deleteMessage(msgId);
        };
      };
      return () => {
        addMessage = null;
        timers.current.forEach((t) => clearTimeout(t));
        timers.current.clear();
      };
    }, []);
    return reactDomExports.createPortal(
jsxRuntimeExports.jsx("div", { className: "message-container", children: jsxRuntimeExports.jsx(LayoutGroup, { children: jsxRuntimeExports.jsx(AnimatePresence, { children: message2.map((m) => jsxRuntimeExports.jsx(
        motion.div,
        {
          layout: true,
          initial: { opacity: 0, y: -20, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -20, scale: 0.9 },
          transition: { duration: 0.25 },
          children: jsxRuntimeExports.jsx(WMessage, { type: m.type, children: m.content })
        },
        m.id
      )) }) }) }),
      document.body
    );
  }
  const message = {
    open(config) {
      return addMessage(config);
    },
    info(config) {
      return this.open({ ...config, type: "info" });
    },
    error(config) {
      return this.open({ ...config, type: "error" });
    },
    success(config) {
      return this.open({ ...config, type: "success" });
    },
    loading(config) {
      return this.open({ ...config, type: "loading" });
    }
  };
  const indexCss$8 = ".weibo-link{color:var(--w-alink)}";
  importCSS(indexCss$8);
  function WLink({ children, className, ...rest }) {
    return jsxRuntimeExports.jsx("a", { ...rest, className: `weibo-link ${className}`, children });
  }
  function BeginLiveMessage({
    liveHref,
    user,
    countdown = 5
  }) {
    const { uid, screenName } = user;
    const [seconds, setSeconds] = React.useState(countdown);
    React.useEffect(() => {
      if (seconds <= 0) {
        return;
      }
      const timer = setTimeout(() => {
        setSeconds((s) => {
          if (s <= 0) clearTimeout(timer);
          return s - 1;
        });
      }, 1e3);
      return () => clearTimeout(timer);
    }, [seconds]);
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsxs("span", { children: [
        "【",
jsxRuntimeExports.jsx(WLink, { href: `https://weibo.com/u/${uid}`, target: "_blank", children: screenName }),
        "】已开播！"
      ] }),
jsxRuntimeExports.jsxs(
        motion.a,
        {
          className: "woo-button-main woo-button-flat woo-button-primary woo-button-s woo-button-round",
          style: { marginLeft: 6, width: 130 },
          href: liveHref,
          target: "_self",
          animate: { scale: [1, 1.08, 1], opacity: [1, 0.8, 1] },
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          children: [
            "点我进入直播间 ",
            seconds
          ]
        }
      )
    ] });
  }
  function FindLiveRoomMessage({
    user
  }) {
    const { uid, screenName } = user;
    return jsxRuntimeExports.jsxs("span", { children: [
      "正在寻找【",
jsxRuntimeExports.jsx(WLink, { href: `https://weibo.com/u/${uid}`, target: "_blank", children: screenName }),
      "】的新直播间。"
    ] });
  }
  function LiveRoomNotFoundMessage({
    user
  }) {
    const { uid, screenName } = user;
    return jsxRuntimeExports.jsxs("span", { children: [
      "未找到新的直播间，【",
jsxRuntimeExports.jsx(WLink, { href: `https://weibo.com/u/${uid}`, target: "_blank", children: screenName }),
      "】可能未开播。"
    ] });
  }
  async function findLiveRoom(blogs) {
    const liveRooms = blogs.find((item) => item.page_info?.type === "26");
    if (!liveRooms) return null;
    const liveInfoDetail = await getLiveInfoDetail(
      liveRooms.page_info.media_info.live_id
    );
    if (liveInfoDetail?.status === 1) {
      return liveRooms.url_struct[0].long_url;
    }
    return null;
  }
  async function launchLiveRoom(user) {
    const { autoRedirectLive, autoSearchLive } = globalSettingStore.getGlobalSetting();
    if (autoSearchLive) {
      const { uid } = user;
      message.loading({
        content: jsxRuntimeExports.jsx(FindLiveRoomMessage, { user }),
        id: "launch live room",
        duration: 0
      });
      await sleep(3e3);
      const mBlog = await getMyMBlog(uid);
      if (!mBlog) return;
      const href = await findLiveRoom(mBlog.list);
      if (href) {
        if (autoRedirectLive) {
          window.location.href = href;
        } else {
          message.info({
            content: jsxRuntimeExports.jsx(BeginLiveMessage, { liveHref: href, user, countdown: 15 }),
            id: "launch live room",
            duration: 15
          });
        }
      } else {
        message.error({
          content: jsxRuntimeExports.jsx(LiveRoomNotFoundMessage, { user }),
          id: "launch live room",
          duration: 5
        });
      }
    }
  }
  function log(...args) {
    console.log("[weibo-pc-live-comments] ", ...args);
  }
  async function getRoomInfo(liveId) {
    const res = await fetch(
      `https://weibo.com/l/!/2/wblive/room/show_pc_live.json?live_id=${liveId}`
    );
    if (res) {
      const { data } = await res.json();
      return data;
    }
    return null;
  }
  async function getComments(mid, uid, isFirst) {
    if (!isFirst) {
      await sleep(Math.random() * Number("3000"));
    }
    const res = await fetch(
      `https://weibo.com/ajax/statuses/buildComments?flow=1&is_reload=1&id=${mid}&is_show_bulletin=2&is_mix=0&max_id=0&count=20&uid=${uid}&fetch_level=0&locale=zh-CN&expand_text=0`
    );
    if (res.ok) {
      const { data } = await res.json();
      return data;
    } else {
      return [];
    }
  }
  async function getMyMBlog(uid) {
    const res = await fetch(
      `https://weibo.com/ajax/statuses/mymblog?uid=${uid}&page=1&feature=0`
    );
    if (res.ok) {
      const { data } = await res.json();
      return data;
    }
    return null;
  }
  async function getLiveInfoDetail(liveId) {
    const res = await fetch(
      `https://weibo.com/ajax/multimedia/getLiveInfoDetail?live_id=${liveId}`
    );
    if (res.ok) {
      const { data } = await res.json();
      return data;
    }
    return null;
  }
  const indexCss$7 = ".video-comments-box{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;color:#fff;overflow:hidden}.video-comments-box>.video-comment{position:absolute;white-space:nowrap;font-size:16px;--stroke-color: rgba(0, 0, 0, .8);text-shadow:1px 0 var(--stroke-color),0 1px var(--stroke-color),-1px 0 var(--stroke-color),0 -1px var(--stroke-color);left:100%;opacity:.6;will-change:transform}.video-comments-box>.video-comment a{color:#fff}.video-comments-box>.video-comment img{height:16px;width:16x;max-width:16px;max-height:16px;vertical-align:-4px}.video-comments-box>span img+img{margin-left:2px}@keyframes danmaku-move{0%{transform:translateZ(0)}to{transform:translate3d(var(--end-x),0,0)}}";
  importCSS(indexCss$7);
  const maxTracks = Number("10");
  const trackHeight = Number("30");
  const safeGap = Number("100");
  function measureCommentWidth(text, container) {
    const tempSpan = document.createElement("span");
    tempSpan.className = "video-comment";
    tempSpan.style.position = "absolute";
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.style.visibility = "hidden";
    tempSpan.innerHTML = text;
    container.appendChild(tempSpan);
    const commentWidth = tempSpan.offsetWidth;
    container.removeChild(tempSpan);
    return commentWidth;
  }
  function VideoComments() {
    const newComments = useIncrementalComments();
    const [globalSetting] = useGlobalSetting();
    const { commentSpeed } = globalSetting;
    const containerRef = React.useRef(null);
    const [activeComments, setActiveComments] = React.useState([]);
    const lastDisappearTimes = React.useRef(
      Array(maxTracks).fill(0).map(() => ({
        disappearTime: -1,
        appearTime: -1,
        speed: Number.MAX_SAFE_INTEGER,
        width: 0
      }))
    );
    const containerWidthRef = React.useRef(0);
    function assignTrack(commentWidth) {
      const now2 = Date.now();
      const duration = commentSpeed * 1e3;
      const containerWidth = containerWidthRef.current;
      const speed = (containerWidth + commentWidth) / duration;
      const completeAppear = commentWidth / speed;
      let track = -1;
      let delay2 = 0;
      for (let i = 0; i < lastDisappearTimes.current.length; i++) {
        const last = lastDisappearTimes.current[i];
        if (now2 >= last.appearTime + safeGap / last.speed) {
          track = i;
          break;
        }
      }
      if (track === -1) {
        let soonestTime = Number.MAX_VALUE;
        lastDisappearTimes.current.forEach((last2, i) => {
          const readyTime = last2.appearTime + safeGap / last2.speed;
          if (readyTime < soonestTime) {
            soonestTime = readyTime;
            track = i;
          }
        });
        const last = lastDisappearTimes.current[track];
        delay2 = last.disappearTime + safeGap / last.speed - now2 - containerWidth / speed;
        if (delay2 < soonestTime - now2) delay2 = soonestTime - now2;
        if (delay2 < 0) delay2 = 0;
      } else {
        const last = lastDisappearTimes.current[track];
        if (last.speed < speed) {
          delay2 = last.disappearTime + safeGap / last.speed - now2 - containerWidth / speed;
          if (delay2 < 0) delay2 = 0;
        }
      }
      const appearTime = now2 + delay2 + completeAppear;
      const disappearTime = now2 + delay2 + duration;
      lastDisappearTimes.current[track] = {
        speed,
        width: commentWidth,
        appearTime,
        disappearTime
      };
      return { track, duration: duration / 1e3, delay: delay2 / 1e3 };
    }
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      containerWidthRef.current = container.offsetWidth;
      const ro = new ResizeObserver(() => {
        const newWidth = container.offsetWidth;
        containerWidthRef.current = newWidth;
        lastDisappearTimes.current = Array(maxTracks).fill(0).map(() => ({
          disappearTime: -1,
          appearTime: -1,
          speed: Number.MAX_SAFE_INTEGER,
          width: 0
        }));
        setActiveComments([]);
      });
      ro.observe(container);
      return () => ro.disconnect();
    }, []);
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container || newComments.length === 0) return;
      const newActive = newComments.map((c) => {
        const commentWidth = measureCommentWidth(c.text, container);
        const { track, duration, delay: delay2 } = assignTrack(commentWidth);
        return {
          ...c,
          top: track * trackHeight + 20,
          duration,
          delay: delay2,
          width: commentWidth,
          endX: commentWidth + containerWidthRef.current + 50
        };
      });
      setActiveComments((prev) => [...prev, ...newActive]);
    }, [newComments]);
    return jsxRuntimeExports.jsx("div", { ref: containerRef, className: "video-comments-box", children: activeComments.map((c) => jsxRuntimeExports.jsx(
      "span",
      {
        className: "video-comment",
        style: {
          top: `${c.top}px`,
          animation: `danmaku-move ${c.duration}s linear ${c.delay}s forwards`,
          "--end-x": `-${c.endX}px`
        },
        onAnimationEnd: () => setActiveComments((prev) => prev.filter((item) => item.id !== c.id)),
        dangerouslySetInnerHTML: { __html: c.text }
      },
      c.id
    )) });
  }
  const indexCss$6 = ".danmu-icon{height:24px;width:24px}.wbpv-fullscreen.wbp-video .danmu-icon{width:34px;height:34px}";
  importCSS(indexCss$6);
  const SvgDanmuClose = (props) => React__namespace.createElement("svg", { t: 1759563176201, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1275, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M663.04 457.6H610.133333v37.973333h52.906667v-37.973333z m-100.266667 0h-50.346666v37.973333h50.346666v-37.973333z m0 77.226667h-50.346666v35.84h50.346666v-35.84z m100.266667 0H610.133333v35.84h52.906667v-35.84z m-25.6-193.28l45.653333 16.213333c-9.386667 22.186667-20.053333 41.813333-31.573333 59.306667h53.76v194.133333h-95.573333v35.413333h41.813333l-14.08 45.226667h-27.733333l-0.426667-0.426667-113.92 0.426667h-43.52v-45.226667h110.08v-35.413333h-93.44v-194.133333h55.466667a362.24 362.24 0 0 0-34.56-57.173334l43.946666-14.933333c12.8 18.346667 24.746667 37.973333 34.133334 58.88l-29.013334 12.8h64c13.653333-23.04 24.746667-48.64 34.986667-75.093333z m-198.826667 20.48v142.08H355.413333l-6.4 62.293333h92.586667c0 79.36-2.986667 132.266667-7.253333 159.146667-5.546667 26.88-29.013333 41.386667-71.253334 44.373333-11.946667 0-23.893333-0.853333-37.12-1.706667l-12.373333-44.8c11.946667 1.28 25.173333 2.133333 37.973333 2.133334 23.04 0 36.266667-7.253333 39.253334-22.186667 3.413333-14.933333 5.12-46.506667 5.12-95.573333H299.52l12.8-144.64h78.08v-59.733334H303.786667v-40.96h134.826666v-0.426666z", fill: "currentColor", "p-id": 1276 }), React__namespace.createElement("path", { d: "M775.424 212.693333a170.666667 170.666667 0 0 1 170.496 162.133334l0.170667 8.533333v74.24a42.666667 42.666667 0 0 1-85.034667 4.992l-0.298667-4.992v-74.24a85.333333 85.333333 0 0 0-78.933333-85.077333l-6.4-0.256H246.954667a85.333333 85.333333 0 0 0-85.12 78.976l-0.213334 6.4v400.597333a85.333333 85.333333 0 0 0 78.933334 85.12l6.4 0.213333h281.770666a42.666667 42.666667 0 0 1 4.992 85.034667l-4.992 0.298667H246.954667a170.666667 170.666667 0 0 1-170.453334-162.133334l-0.213333-8.533333v-400.64a170.666667 170.666667 0 0 1 162.133333-170.453333l8.533334-0.213334h528.469333z", fill: "currentColor", "p-id": 1277 }), React__namespace.createElement("path", { d: "M300.842667 97.194667a42.666667 42.666667 0 0 1 56.32-3.541334l4.010666 3.541334 128 128a42.666667 42.666667 0 0 1-56.32 63.914666l-4.010666-3.541333-128-128a42.666667 42.666667 0 0 1 0-60.373333z", fill: "currentColor", "p-id": 1278 }), React__namespace.createElement("path", { d: "M702.506667 97.194667a42.666667 42.666667 0 0 0-56.32-3.541334l-4.010667 3.541334-128 128a42.666667 42.666667 0 0 0 56.32 63.914666l4.010667-3.541333 128-128a42.666667 42.666667 0 0 0 0-60.373333z", fill: "currentColor", "p-id": 1279 }), React__namespace.createElement("path", { d: "M768 512a213.333333 213.333333 0 1 0 0 426.666667 213.333333 213.333333 0 0 0 0-426.666667z m0 85.333333a128 128 0 1 1 0 256 128 128 0 0 1 0-256z", fill: "currentColor", "p-id": 1280 }), React__namespace.createElement("path", { d: "M848.512 588.245333a42.666667 42.666667 0 0 1 62.592 57.728l-3.626667 3.925334-214.954666 205.610666a42.666667 42.666667 0 0 1-62.592-57.728l3.626666-3.925333 214.954667-205.653333z", fill: "currentColor", "p-id": 1281 }));
  const SvgDanmuOpen = (props) => React__namespace.createElement("svg", { t: 1759563191722, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1440, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M663.04 457.6H610.133333v37.973333h52.906667v-37.973333z m-100.266667 0h-50.346666v37.973333h50.346666v-37.973333z m0 77.226667h-50.346666v35.84h50.346666v-35.84z m100.266667 0H610.133333v35.84h52.906667v-35.84z m-25.6-193.28l45.653333 16.213333c-9.386667 22.186667-20.053333 41.813333-31.573333 59.306667h53.76v194.133333h-95.573333v35.413333h113.493333v44.8l-0.426667 0.426667h-113.066666l-0.426667-0.426667c-29.013333-31.146667-77.653333-33.28-109.226667-4.266666l-4.693333 4.693333h-43.52v-45.226667h110.08v-35.413333h-93.44v-194.133333h55.466667a362.24 362.24 0 0 0-34.56-57.173334l43.946666-14.933333c12.8 18.346667 24.746667 37.973333 34.133334 58.88l-29.013334 12.8h64c13.653333-23.04 24.746667-48.64 34.986667-75.093333z m-198.826667 20.48v142.08H355.413333l-6.4 62.293333h92.586667c0 79.36-2.986667 132.266667-7.253333 159.146667-5.546667 26.88-29.013333 41.386667-71.253334 44.373333-11.946667 0-23.893333-0.853333-37.12-1.706667l-12.373333-44.8c11.946667 1.28 25.173333 2.133333 37.973333 2.133334 23.04 0 36.266667-7.253333 39.253334-22.186667 3.413333-14.933333 5.12-46.506667 5.12-95.573333H299.52l12.8-144.64h78.08v-59.733334H303.786667v-40.96h134.826666v-0.426666z", fill: "currentColor", "p-id": 1441 }), React__namespace.createElement("path", { d: "M775.424 212.693333a170.666667 170.666667 0 0 1 170.496 162.133334l0.170667 8.533333v106.666667a42.666667 42.666667 0 0 1-85.034667 4.949333l-0.298667-4.992V383.36a85.333333 85.333333 0 0 0-78.933333-85.077333l-6.4-0.256H246.954667a85.333333 85.333333 0 0 0-85.12 78.976l-0.213334 6.4v400.597333a85.333333 85.333333 0 0 0 78.933334 85.12l6.4 0.213333h281.770666a42.666667 42.666667 0 0 1 4.992 85.034667l-4.992 0.298667H246.954667a170.666667 170.666667 0 0 1-170.453334-162.133334l-0.213333-8.533333v-400.64a170.666667 170.666667 0 0 1 162.133333-170.453333l8.533334-0.213334h528.469333z", fill: "currentColor", "p-id": 1442 }), React__namespace.createElement("path", { d: "M300.842667 97.194667a42.666667 42.666667 0 0 1 56.32-3.541334l4.010666 3.541334 128 128a42.666667 42.666667 0 0 1-56.32 63.914666l-4.010666-3.541333-128-128a42.666667 42.666667 0 0 1 0-60.373333z", fill: "currentColor", "p-id": 1443 }), React__namespace.createElement("path", { d: "M702.506667 97.194667a42.666667 42.666667 0 0 0-56.32-3.541334l-4.010667 3.541334-128 128a42.666667 42.666667 0 0 0 56.32 63.914666l4.010667-3.541333 128-128a42.666667 42.666667 0 0 0 0-60.373333z", fill: "currentColor", "p-id": 1444 }), React__namespace.createElement("path", { d: "M872.362667 610.773333a42.666667 42.666667 0 0 1 65.578666 54.314667l-3.413333 4.138667-230.058667 244.608a42.666667 42.666667 0 0 1-57.685333 4.096l-4.096-3.712-110.634667-114.688a42.666667 42.666667 0 0 1 57.472-62.848l3.968 3.626666 79.488 82.389334 199.381334-211.925334z", fill: "#ff8200", "p-id": 1445 }));
  function CommentSwitch({
    checked,
    onClick
  }) {
    const handleClick = () => {
      onClick?.(!checked);
    };
    return jsxRuntimeExports.jsx("div", { onClick: handleClick, children: checked ? jsxRuntimeExports.jsx(SvgDanmuOpen, { className: "danmu-icon" }) : jsxRuntimeExports.jsx(SvgDanmuClose, { className: "danmu-icon" }) });
  }
  const style = "div[class*=Frame_content]{width:100%;padding:0 80px;box-sizing:border-box;gap:20px}div[class^=Frame_side2]{width:400px}div[class^=Frame_main]{width:calc(100% - 420px)}div[class*=Frame_wrap]{height:calc(100% - var(--weibo-top-nav-height));min-height:calc(100% - var(--weibo-top-nav-height))}div[class^=PlayInfo_boxin]{overflow:hidden;padding-bottom:calc(100vh - 10px - var(--weibo-top-nav-height) - 115px - 50px - 30px);border-radius:8px 8px 0 0}div[class^=PlayInfo_videoinfo]>div[class*=VideoInfo_wrap]{border-radius:0 0 8px 8px}.wbpv-poster{display:block;filter:blur(35px);z-index:0}div[class^=Detail_wrap]~*{display:none}@media screen and (max-width: 1319px){div[class*=Frame_content]{padding:0 50px}div[class^=Frame_side2]{width:350px}div[class^=Frame_main]{width:calc(100% - 370px)}}";
  const indexCss$5 = ".video-background{position:absolute;left:0;top:0;height:100%;width:100%;z-index:0;filter:blur(35px);background-size:cover}";
  importCSS(indexCss$5);
  function VideoBackground() {
    const [url, setUrl] = React.useState("");
    React.useEffect(() => {
      const posterDom = document.querySelector(".wbpv-poster");
      if (posterDom) {
        const matches = posterDom.style.backgroundImage.match(/http(s?).*(?="\))/);
        if (matches?.[0]) {
          setUrl(matches[0]);
        }
      }
    }, []);
    return jsxRuntimeExports.jsx(
      "div",
      {
        className: "video-background",
        style: { backgroundImage: `url(${url})` }
      }
    );
  }
  const indexCss$4 = ".global-setting{position:fixed;z-index:99;bottom:100px;right:20px;height:40px;width:40px;border-radius:50%;padding:0;color:#1d1d1dcc;background-color:#fff;box-shadow:0 6px 16px #00000014,0 3px 6px -4px #0000001f,0 9px 28px 8px #0000000d;font-size:14px;font-family:QuoteFallback,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif}.btn-body{height:100%;width:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;background-color:#fff}.btn-body:hover{background-color:#00000017}.global-setting .setting-icon{width:24px;height:24px}";
  importCSS(indexCss$4);
  const SvgSetting = (props) => React__namespace.createElement("svg", { t: 1759993317793, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1611, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56c10.1-8.6 13.8-22.6 9.3-35.2l-0.9-2.6c-18.1-50.5-44.9-96.9-79.7-137.9l-1.8-2.1c-8.6-10.1-22.5-13.9-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85c-2.4-13.1-12.7-23.3-25.8-25.7l-2.7-0.5c-52.1-9.4-106.9-9.4-159 0l-2.7 0.5c-13.1 2.4-23.4 12.6-25.8 25.7l-15.8 85.4c-35.9 13.6-69.2 32.9-99 57.4l-81.9-29.1c-12.5-4.4-26.5-0.7-35.1 9.5l-1.8 2.1c-34.8 41.1-61.6 87.5-79.7 137.9l-0.9 2.6c-4.5 12.5-0.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5c-10.1 8.6-13.8 22.6-9.3 35.2l0.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1c8.6 10.1 22.5 13.9 35.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4c2.4 13.1 12.7 23.3 25.8 25.7l2.7 0.5c26.1 4.7 52.8 7.1 79.5 7.1 26.7 0 53.5-2.4 79.5-7.1l2.7-0.5c13.1-2.4 23.4-12.6 25.8-25.7l15.7-85c36.2-13.6 69.7-32.9 99.7-57.6l81.3 28.9c12.5 4.4 26.5 0.7 35.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l0.9-2.6c4.5-12.3 0.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9c-11.3 26.1-25.6 50.7-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97c-28.1 3.2-56.8 3.2-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9z", "p-id": 1612, fill: "currentColor" }), React__namespace.createElement("path", { d: "M512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176z m79.2 255.2C570 602.3 541.9 614 512 614c-29.9 0-58-11.7-79.2-32.8C411.7 560 400 531.9 400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8C612.3 444 624 472.1 624 502c0 29.9-11.7 58-32.8 79.2z", "p-id": 1613, fill: "currentColor" }));
  function WForm(props) {
    const {
      children,
      labelCol,
      wrapperCol,
      onSubmit,
      initialValues,
      ...formProps
    } = props;
    const [values, setValues] = React.useState(initialValues ?? {});
    const setFieldValue = (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit?.(e, values);
    };
    return jsxRuntimeExports.jsx("form", { ...formProps, onSubmit: handleSubmit, children: jsxRuntimeExports.jsx(FormContext, { value: { labelCol, wrapperCol, values, setFieldValue }, children }) });
  }
  const indexCss$3 = '.form-item{display:flex;align-items:center;margin-bottom:16px}.form-item .form-item-label{text-align:end;white-space:nowrap}.form-item .form-item-label label:after{content:":";margin-inline-start:2px;margin-inline-end:6px}.form-item .form-item-label .form-item-label-icon{cursor:help;margin-left:4px;color:#aaa;vertical-align:top}.form-item .form-item-label .form-item-label-icon>svg{height:18px;width:18px}.form-item .form-item-control-content{display:flex;align-items:center}';
  importCSS(indexCss$3);
  const indexCss$2 = '.w-tooltip{position:absolute;z-index:9999;font-size:14px}.w-tooltip .w-tooltip-arrow{position:absolute;top:100%;left:50%;width:16px;height:16px;pointer-events:none}.w-tooltip .w-tooltip-arrow:before{content:"";position:absolute;clip-path:path("M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z");width:16px;height:8px;background-color:#000000d9;transform:rotate(180deg)}.w-tooltip .w-tooltip-arrow:after{transform:translateY(50%) rotate(-135deg);content:"";box-shadow:2px 2px 5px #0000000d;z-index:0;height:8.970562748477143px;width:8.970562748477143px;position:absolute;bottom:100%;border-radius:0 0 2px;background:transparent;margin:auto;inset-inline:0}.w-tooltip-content{background-color:#000000d9;color:#fff;border-radius:8px;padding:10px;box-shadow:0 6px 16px #00000014,0 3px 6px -4px #0000001f,0 9px 28px 8px #0000000d}';
  importCSS(indexCss$2);
  function mergeEvent(original, added) {
    return (e) => {
      original?.(e);
      added?.(e);
    };
  }
  function Tooltip(props) {
    const { children, title } = props;
    const [visible, setVisible] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const ref = React.useRef(null);
    const tooltipRef = React.useRef(null);
    const handleMouseEnter = () => {
      setVisible(true);
    };
    const handleMouseLeave = () => {
      setVisible(false);
    };
    let childNode;
    if (React.isValidElement(children)) {
      const element = children;
      childNode = React.cloneElement(children, {
        ref,
        onMouseEnter: mergeEvent(element?.props.onMouseEnter, handleMouseEnter),
        onMouseLeave: mergeEvent(element?.props.onMouseLeave, handleMouseLeave)
      });
    } else {
      childNode = jsxRuntimeExports.jsx(
        "span",
        {
          ref,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          children
        }
      );
    }
    React.useEffect(() => {
      if (!visible || !ref.current) return;
      if (!tooltipRef.current) return;
      const rect = ref.current.getBoundingClientRect();
      const tooltopReact = tooltipRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      setPosition({
        top: rect.top + scrollTop - tooltopReact.height - 15,
left: rect.left + scrollLeft - tooltopReact.width / 2
});
    }, [visible]);
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      childNode,
      reactDomExports.createPortal(
jsxRuntimeExports.jsx("div", { children: jsxRuntimeExports.jsx(AnimatePresence, { children: visible && jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { y: 6, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: 6, opacity: 0 },
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.5
            },
            ref: tooltipRef,
            className: "w-tooltip",
            style: { left: position.left, top: position.top },
            children: [
jsxRuntimeExports.jsx("div", { className: "w-tooltip-arrow" }),
jsxRuntimeExports.jsx("div", { className: "w-tooltip-content", children: title })
            ]
          }
        ) }) }),
        document.body
      )
    ] });
  }
  const unit = 100 / 24;
  function WFormItem(props) {
    const {
      children,
      label,
      className,
      align,
      labelProps,
      name,
      labelCol,
      wrapperCol,
      tooltip
    } = props;
    const formContext = useFormContext();
    const alignItems = align ?? "center";
    let currentLabelCol = labelCol, currentWrapperCol = wrapperCol;
    let icon, tooltipProps;
    if (formContext) {
      const { labelCol: labelCol2, wrapperCol: wrapperCol2 } = formContext;
      if (currentLabelCol === void 0) {
        currentLabelCol = labelCol2;
      }
      if (currentWrapperCol === void 0) {
        currentWrapperCol = wrapperCol2;
      }
    }
    currentLabelCol = currentLabelCol ?? 6;
    currentWrapperCol = currentWrapperCol ?? 18;
    const labelStyle = { flex: `0 0 ${unit * currentLabelCol}%` };
    const wrapperStyle = { flex: `0 0 ${unit * currentWrapperCol}%` };
    if (tooltip) {
      const { icon: iconFromTooltip, ...restTooltipProps } = tooltip;
      icon = iconFromTooltip;
      tooltipProps = restTooltipProps;
    }
    return jsxRuntimeExports.jsx(
      "div",
      {
        className: `form-item ${className ?? ""}`,
        style: { alignItems },
        children: jsxRuntimeExports.jsxs(FormItemContext.Provider, { value: { name }, children: [
jsxRuntimeExports.jsx("div", { style: labelStyle, className: "form-item-label", children: label && jsxRuntimeExports.jsxs("label", { htmlFor: name, ...labelProps, children: [
            label,
            icon && jsxRuntimeExports.jsx(Tooltip, { ...tooltipProps, children: jsxRuntimeExports.jsx("span", { className: "form-item-label-icon", children: icon }) })
          ] }) }),
jsxRuntimeExports.jsx("div", { style: wrapperStyle, className: "form-item-control-content", children })
        ] })
      }
    );
  }
  const indexCss$1 = ".w-input-number{display:flex;align-items:stretch;padding:0;width:100%;overflow:hidden}.w-input-number .w-input-number-box{flex:1;position:relative}.w-input-number .w-input-number-box input{padding:0 0 0 var(--w-input-indent)}.w-input-number .w-input-number-box .w-input-number-handler-wrapper{position:absolute;right:0;top:0;bottom:0;background-color:var(--w-input-background);color:#a8a8a8;transform:translate(18px);z-index:1;transition:transform .15s cubic-bezier(.4,0,.2,1)}.w-input-number .w-input-number-box:hover .w-input-number-handler-wrapper{transform:translate(0)}.w-input-number .w-input-number-box .w-input-number-handler-wrapper .w-input-number-handler{height:50%;width:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-user-select:none;user-select:none}.w-input-number .w-input-number-box .w-input-number-handler-wrapper .w-input-number-handler.ban{cursor:not-allowed}.w-input-number .w-input-number-box .w-input-number-handler-wrapper .w-input-number-handler:hover{background-color:#e7e7e7;color:#1d1d1dcc}.w-input-number .w-input-number-addon{padding:5px var(--w-input-indent);display:flex;align-items:center;justify-content:center;border-left:1px solid #e4e4e4;position:relative;z-index:2;background:#e4e4e4}";
  importCSS(indexCss$1);
  function WInputNumber(props) {
    const {
      value,
      onChange,
      name: nameInProps,
      defaultValue,
      className,
      addonAfter,
      step = 1,
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      precision,
      ...rest
    } = props;
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    const stepTimeout = React.useRef(null);
    const stepInterval = React.useRef(null);
    let name = nameInProps;
    if (formItemContext) {
      const { name: nameInContext } = formItemContext;
      if (name === void 0) name = nameInContext;
    }
    let realDefaultValue = defaultValue;
    if (formContext && name && realDefaultValue === void 0) {
      realDefaultValue = formContext.values?.[name];
    }
    const [currentValue, setCurrentValue] = useControllableState({
      value,
      defaultValue: realDefaultValue,
      onChange
    });
    const [inputValue, setInputValue] = React.useState(currentValue?.toString() || "");
    const isMaxReached = currentValue !== void 0 && currentValue >= max;
    const isMinReached = currentValue !== void 0 && currentValue <= min;
    React.useEffect(() => {
      if (formContext && name !== void 0) {
        formContext.setFieldValue?.(name, currentValue);
      }
    }, [currentValue]);
    React.useEffect(() => {
      if (defaultValue !== void 0 && formContext && name) {
        formContext.setFieldValue?.(name, defaultValue);
      }
    }, []);
    const handleChange = (e) => {
      setInputValue(e.target.value);
    };
    const handleBlur = () => {
      let num = Number(inputValue);
      if (Number.isNaN(num)) {
        num = currentValue || min || 0;
      }
      if (num < min) num = min;
      if (num > max) num = max;
      num = formatValue(num);
      setCurrentValue(num);
      setInputValue(num.toString());
    };
    const formatValue = (num) => {
      if (precision !== void 0) {
        return Number(num.toFixed(precision));
      }
      return num;
    };
    const clampValue = (num) => {
      if (num < min) return min;
      if (num > max) return max;
      return num;
    };
    const applyStep = (direction) => {
      setCurrentValue((prev) => {
        let next = clampValue(
          formatValue(prev + (direction === "up" ? step : -step))
        );
        setInputValue(next.toString());
        if (direction === "up" && next >= max || direction === "down" && next <= min) {
          stopStepping();
        }
        return next;
      });
    };
    const startStepping = (direction) => {
      applyStep(direction);
      stepTimeout.current = setTimeout(() => {
        stepInterval.current = setInterval(() => applyStep(direction), 100);
      }, 400);
    };
    const stopStepping = () => {
      if (stepTimeout.current) {
        clearTimeout(stepTimeout.current);
        stepTimeout.current = null;
      }
      if (stepInterval.current) {
        clearInterval(stepInterval.current);
        stepInterval.current = null;
      }
    };
    return jsxRuntimeExports.jsxs("div", { className: `woo-input-wrap  w-input-number ${className}`, children: [
jsxRuntimeExports.jsxs("div", { className: "w-input-number-box", children: [
jsxRuntimeExports.jsx(
          "input",
          {
            className: "woo-input-main",
            name,
            value: inputValue,
            onChange: handleChange,
            onBlur: handleBlur,
            step,
            max,
            min,
            ...rest,
            type: "text"
          }
        ),
jsxRuntimeExports.jsxs("div", { className: "w-input-number-handler-wrapper", children: [
jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-input-number-handler ${isMaxReached ? "ban" : ""}`,
              onMouseDown: () => startStepping("up"),
              onMouseUp: stopStepping,
              onMouseLeave: stopStepping,
              children: "+"
            }
          ),
jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-input-number-handler ${isMinReached ? "ban" : ""}`,
              onMouseDown: () => startStepping("down"),
              onMouseUp: stopStepping,
              onMouseLeave: stopStepping,
              children: "-"
            }
          )
        ] })
      ] }),
      addonAfter && jsxRuntimeExports.jsx("div", { className: "w-input-number-addon", children: addonAfter })
    ] });
  }
  const indexCss = ".w-switch{position:relative;overflow:hidden;cursor:pointer;display:inline-block}.w-switch .w-switch-button{position:absolute;left:2px;top:2px;transform:translate(0);transition:transform .15s cubic-bezier(.4,0,.2,1)}.w-switch .w-switch-button .w-switch-input{cursor:inherit;position:absolute;height:100%;width:300%;left:-100%;z-index:1;margin:0;opacity:0}.w-switch .w-switch-button .w-switch-thumb{height:16px;width:16px;border-radius:50%;background-color:#fff;z-index:0}.w-switch .w-switch-track{width:40px;height:20px;border-radius:12px;background-color:#00000040;transition:background-color .15s cubic-bezier(.4,0,.2,1)}.w-switch.checked .w-switch-track{background-color:var(--w-brand)}.w-switch.checked .w-switch-button{transform:translate(20px)}";
  importCSS(indexCss);
  function WSwitch(props) {
    const { checked, defaultChecked, onChecked, name: nameInProps } = props;
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    let name = nameInProps;
    if (formItemContext) {
      const { name: nameInContext } = formItemContext;
      if (name === void 0) name = nameInContext;
    }
    let realDefault = defaultChecked;
    if (formContext && name && realDefault === void 0) {
      realDefault = formContext.values?.[name];
    }
    const [isChecked, setIsChecked] = useControllableState({
      value: checked,
      defaultValue: realDefault,
      onChange: onChecked
    });
    const handleClick = () => {
      setIsChecked((prev) => {
        if (formContext && name !== void 0) {
          formContext.setFieldValue?.(name, !prev);
        }
        return !prev;
      });
    };
    React.useEffect(() => {
      if (defaultChecked !== void 0 && formContext && name) {
        formContext.setFieldValue?.(name, defaultChecked);
      }
    }, []);
    return jsxRuntimeExports.jsxs(
      "div",
      {
        className: `w-switch ${isChecked ? "checked" : ""}`,
        onClick: handleClick,
        children: [
jsxRuntimeExports.jsxs("div", { className: "w-switch-button", children: [
jsxRuntimeExports.jsx(
              "input",
              {
                className: "w-switch-input",
                type: "checkbox",
                name,
                checked: isChecked,
                readOnly: true
              }
            ),
jsxRuntimeExports.jsx("div", { className: "w-switch-thumb" })
          ] }),
jsxRuntimeExports.jsx("div", { className: "w-switch-track" })
        ]
      }
    );
  }
  const GlobalSettingFormCss = ".setting-form-box{width:300px;min-height:240px;padding:20px 20px 45px;border-radius:8px 8px 20px;background-color:#fff;position:absolute;right:0;bottom:0;text-align:center;box-shadow:0 6px 16px #00000014,0 3px 6px -4px #0000001f,0 9px 28px 8px #0000000d;z-index:-1}.setting-form-box .setting-form-title{margin:0;font-weight:500;font-size:18px}.setting-form-box .setting-form{margin-top:20px;width:100%}";
  importCSS(GlobalSettingFormCss);
  const SvgTooltip = (props) => React__namespace.createElement("svg", { t: 1760187262851, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1641, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M554.688 687.808V493.504l-0.32-5.184a42.24 42.24 0 0 0-42.304-36.288 42.24 42.24 0 0 0-42.368 36.288l-0.32 5.184v194.304l0.32 5.184a42.24 42.24 0 0 0 42.368 36.352 42.24 42.24 0 0 0 42.304-36.352l0.32-5.184zM512 396.672a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4z", "p-id": 1642, fill: "currentColor" }), React__namespace.createElement("path", { d: "M512 185.6a326.4 326.4 0 1 0 0 652.8A326.4 326.4 0 0 0 512 185.6zM96 512a416 416 0 1 1 832 0 416 416 0 0 1-832 0z", "p-id": 1643, fill: "currentColor" }));
  function GlobalSettingForm({
    show,
    onSaveSuccess
  }) {
    const [globalSetting, setGlobalSetting] = useGlobalSetting();
    const handleSubmit = (e, value) => {
      e.preventDefault();
      setGlobalSetting(value);
      onSaveSuccess?.();
    };
    return jsxRuntimeExports.jsx(AnimatePresence, { children: show && jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "setting-form-box",
        style: { originX: "right", originY: "bottom" },
        initial: { opacity: 0, scale: 0.2 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.3 },
        transition: { type: "spring", stiffness: 180, damping: 15 },
        children: [
jsxRuntimeExports.jsx("h4", { className: "setting-form-title", children: "微博PC直播弹幕助手插件配置" }),
jsxRuntimeExports.jsxs(
            WForm,
            {
              className: "setting-form",
              initialValues: globalSetting,
              labelCol: 11,
              wrapperCol: 12,
              onSubmit: handleSubmit,
              children: [
jsxRuntimeExports.jsx(
                  WFormItem,
                  {
                    label: "自动搜寻直播间",
                    name: "autoSearchLive",
                    tooltip: {
                      icon: jsxRuntimeExports.jsx(SvgTooltip, {}),
                      title: jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        "启用后如果主播关闭直播后，会自动",
jsxRuntimeExports.jsx("br", {}),
                        "搜寻主播的新直播间。"
                      ] })
                    },
                    children: jsxRuntimeExports.jsx(WSwitch, {})
                  }
                ),
jsxRuntimeExports.jsx(
                  WFormItem,
                  {
                    label: "自动跳转直播间",
                    name: "autoRedirectLive",
                    tooltip: {
                      icon: jsxRuntimeExports.jsx(SvgTooltip, {}),
                      title: "启用后在找到新直播间时，会自动跳转至该直播间。"
                    },
                    children: jsxRuntimeExports.jsx(WSwitch, {})
                  }
                ),
jsxRuntimeExports.jsx(
                  WFormItem,
                  {
                    label: "弹幕刷新间隔",
                    name: "requestGap",
                    tooltip: {
                      icon: jsxRuntimeExports.jsx(SvgTooltip, {}),
                      title: jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        "控制弹幕获取频率，单位为秒。最小为3s。",
jsxRuntimeExports.jsx("br", {}),
                        "在此基础上会有0-3s的随机间隔，防止风控。"
                      ] })
                    },
                    children: jsxRuntimeExports.jsx(WInputNumber, { min: 3, addonAfter: "s" })
                  }
                ),
jsxRuntimeExports.jsx(
                  WFormItem,
                  {
                    label: "弹幕上限",
                    name: "maxCommentsNum",
                    tooltip: {
                      icon: jsxRuntimeExports.jsx(SvgTooltip, {}),
                      title: jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        "设置弹幕列表最多保留的弹幕数量，",
jsxRuntimeExports.jsx("br", {}),
                        "超过后会删除最早的弹幕。"
                      ] })
                    },
                    children: jsxRuntimeExports.jsx(WInputNumber, { min: 200, max: 800, precision: 0 })
                  }
                ),
jsxRuntimeExports.jsx(
                  WFormItem,
                  {
                    label: "弹幕速度",
                    name: "commentSpeed",
                    tooltip: {
                      icon: jsxRuntimeExports.jsx(SvgTooltip, {}),
                      title: jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        "设置弹幕在屏幕上显示的时间（持续时间），",
jsxRuntimeExports.jsx("br", {}),
                        "数值越大，弹幕停留越久。"
                      ] })
                    },
                    children: jsxRuntimeExports.jsx(WInputNumber, { min: 5, max: 20, addonAfter: "s" })
                  }
                ),
jsxRuntimeExports.jsx(WFormItem, { children: jsxRuntimeExports.jsx(WButton, { type: "submit", children: "保存配置" }) })
              ]
            }
          )
        ]
      }
    ) });
  }
  function GlobalSetting() {
    const [showForm, setShowForm] = React.useState(false);
    const formRef = React.useRef(null);
    const handleClick = () => {
      setShowForm(!showForm);
    };
    const handleSaveSuccess = () => {
      message.success({ content: "配置保存成功！", duration: 3 });
    };
    React.useEffect(() => {
      if (!showForm) return;
      const handleClickOutside = (e) => {
        if (formRef.current && !formRef.current.contains(e.target)) {
          setShowForm(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showForm]);
    return jsxRuntimeExports.jsxs("div", { className: "global-setting", ref: formRef, children: [
jsxRuntimeExports.jsx(
        motion.button,
        {
          className: "btn-body",
          whileHover: { rotate: 180 },
          transition: { duration: 0.25, ease: "linear" },
          onClick: handleClick,
          children: showForm ? jsxRuntimeExports.jsx(SvgClose, { className: "setting-icon" }) : jsxRuntimeExports.jsx(SvgSetting, { className: "setting-icon" })
        }
      ),
jsxRuntimeExports.jsx(GlobalSettingForm, { show: showForm, onSaveSuccess: handleSaveSuccess })
    ] });
  }
  function FrameSideApp() {
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: jsxRuntimeExports.jsx(ChatHistoryPanel, {}) });
  }
  function VideoBoxApp() {
    const [checked] = useCommentSwitch();
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      checked && jsxRuntimeExports.jsx(VideoComments, {}),
jsxRuntimeExports.jsx(VideoBackground, {})
    ] });
  }
  function VideoControlApp() {
    const [checked, setChecked] = useCommentSwitch();
    const handleClick = (checked2) => setChecked(checked2);
    return jsxRuntimeExports.jsx(CommentSwitch, { checked, onClick: handleClick });
  }
  function mountMessageHolder() {
    const div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.createRoot(div).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsx(MessageHolder, {}) })
    );
  }
  window.addEventListener("load", async () => {
    mountMessageHolder();
    const frameSide = document.body.querySelector("[class^='Frame_side2']");
    const videoBox = document.body.querySelector("[id^='wbpv_video_']");
    const videoControlBar = document.body.querySelector(".wbpv-control-bar");
    const matches = window.location.href.match(/show\/(.*)$/);
    if (!matches?.[1]) return;
    const roomInfo = await getRoomInfo(matches[1]);
    if (roomInfo) {
      if (roomInfo.status !== 1) {
        const { user } = roomInfo;
        await launchLiveRoom(user);
        return;
      }
    } else {
      return;
    }
    injectCSS(style);
    ReactDOM.createRoot(
      (() => {
        const div = document.createElement("div");
        document.body.appendChild(div);
        return div;
      })()
    ).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsx(GlobalSetting, {}) })
    );
    const {
      mid,
      user: { uid }
    } = roomInfo;
    if (frameSide) {
      ReactDOM.createRoot(frameSide).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsx(FrameSideApp, {}) })
      );
    }
    if (videoBox) {
      const container = document.createElement("div");
      videoBox.append(container);
      ReactDOM.createRoot(container).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsx(VideoBoxApp, {}) })
      );
    }
    if (videoControlBar) {
      const container = document.createElement("button");
      container.className = "danmu-switch";
      videoControlBar.insertBefore(
        container,
        videoControlBar.querySelector(".wbpv-fullscreen-control")
      );
      ReactDOM.createRoot(container).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsx(VideoControlApp, {}) })
      );
    }
    const updateComments = async (isFirst) => {
      const latest = await getComments(mid, uid, isFirst);
      const displayComments = extractDisplayComments(latest);
      addComments(displayComments);
    };
    function request() {
      let intervalId;
      let currentGap = globalSettingStore.getGlobalSetting().requestGap;
      const startRequest = (gap) => {
        if (intervalId !== void 0) clearInterval(intervalId);
        intervalId = setInterval(updateComments, gap * 1e3);
        currentGap = gap;
        log(`request start with gap=${gap}s`);
      };
      updateComments(true);
      startRequest(currentGap);
      const unsubscribe = globalSettingStore.subscribe(
        ({ requestGap: newRequestGap }) => {
          if (newRequestGap !== currentGap) {
            startRequest(newRequestGap);
          }
        }
      );
      return () => {
        if (intervalId !== void 0) clearInterval(intervalId);
        unsubscribe?.();
        log("request stopped");
      };
    }
    let stop = request();
    const video = videoBox?.querySelector("video");
    if (video) {
      video.addEventListener("play", () => {
        stop();
        stop = request();
      });
      video.addEventListener("pause", () => {
        stop();
      });
    }
  });

})(React, ReactDOM);