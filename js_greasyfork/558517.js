/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 172:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ Options)
});

// EXTERNAL MODULE: ./utils/src/gm/Store.ts
var Store = __webpack_require__(307);
;// ./utils/src/gm/MenuCmd.ts
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 选项菜单
 */
var MenuCmd = /*#__PURE__*/function () {
  function MenuCmd() {
    _classCallCheck(this, MenuCmd);
  }
  return _createClass(MenuCmd, null, [{
    key: "register",
    value:
    /**
     * 注册
     * @param name 名称
     * @param fn 点击菜单时执行的函数
     */
    function register(name, fn) {
      return GM_registerMenuCommand(name, fn);
    }

    /**
     * 注销
     * @param menuCmdId 注册时返回的 ID
     */
  }, {
    key: "unregister",
    value: function unregister(menuCmdId) {
      GM_unregisterMenuCommand(menuCmdId);
    }
  }]);
}();

;// ./utils/src/CommonOptions.ts
function CommonOptions_typeof(o) { "@babel/helpers - typeof"; return CommonOptions_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, CommonOptions_typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function CommonOptions_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function CommonOptions_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, CommonOptions_toPropertyKey(o.key), o); } }
function CommonOptions_createClass(e, r, t) { return r && CommonOptions_defineProperties(e.prototype, r), t && CommonOptions_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function CommonOptions_toPropertyKey(t) { var i = CommonOptions_toPrimitive(t, "string"); return "symbol" == CommonOptions_typeof(i) ? i : i + ""; }
function CommonOptions_toPrimitive(t, r) { if ("object" != CommonOptions_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != CommonOptions_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/**
 * 选项菜单
 */
var CommonOptions = /*#__PURE__*/function () {
  function CommonOptions() {
    CommonOptions_classCallCheck(this, CommonOptions);
  }
  return CommonOptions_createClass(CommonOptions, null, [{
    key: "registerBoolOption",
    value:
    /**
     * 注册 bool 类型的选项
     *
     * @param option 选项
     */
    function registerBoolOption(option) {
      var _this = this;
      var val = option.value,
        valIsBool = typeof val === 'boolean';
      if (!valIsBool) {
        return;
      }
      // 注册选项和选项点击事件
      var currentMenuCmdId = MenuCmd.register((val ? '✅ ' : '🔲 ') + option.label, function () {
        // 点击后取反
        option.value = !option.value;
        Store/* default */.A.set(option.name, JSON.stringify(option));

        // 重新注册
        MenuCmd.unregister(currentMenuCmdId);
        _this.registerBoolOption(option);
        // 刷新页面
        window.location.reload();
      });

      // 保存选项 ID
      option.menuCmdId = currentMenuCmdId;
      Store/* default */.A.set(option.name, JSON.stringify(option));
    }

    /**
     * 注册字符串/按钮类型的选项 (无状态)
     *
     * @param option 选项
     */
  }, {
    key: "registerStrOption",
    value: function registerStrOption(option) {
      MenuCmd.register(option.label, function () {
        if (typeof option.callback === 'function') {
          option.callback();
        }
      });
    }

    /**
     * 注册所有选项
     *
     * @param options 选项
     * @param moreOptionsUrl 更多设置页面 URL
     * @param useStore 是否使用存储（默认 true）
     */
  }, {
    key: "registerAll",
    value: function registerAll(options, moreOptionsUrl) {
      var useStore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (moreOptionsUrl) {
        // 注册“更多设置”选项，点击后打开新页面到更多设置页面
        MenuCmd.register('更多设置', function () {
          window.open(moreOptionsUrl, '_blank');
        });
      }
      var _iterator = _createForOfIteratorHelper(options),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var option = _step.value;
          // TODO 【调试】不保留选项的值，每次都从 Store 中获取
          // Store.set(option.name, null);

          // 声明最终用于注册的选项变量
          var finalOption = option;

          // useStore 为 true 时，才从 Store 读取或更新
          if (useStore) {
            var storeOption = Store/* default */.A.get(option.name) ? JSON.parse(Store/* default */.A.get(option.name)) : null;
            // 如果选项不存在 || 版本不一致 时重置选项
            if (storeOption === null || !storeOption['version'] || storeOption['version'] < option.version) {
              Store/* default */.A.set(option.name, JSON.stringify(option));
              storeOption = option;
            }
            finalOption = storeOption;
          }

          // 根据类型分发注册方法
          if (typeof finalOption.value === 'boolean') {
            this.registerBoolOption(finalOption);
          } else {
            this.registerStrOption(finalOption);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * 在 Greasy Fork 脚本详情页中加载选项
     *
     * @param scriptId 脚本 ID
     * @param loadOptionContentFn 加载选项内容的函数
     */
  }, {
    key: "loadInGreasyfork",
    value: function loadInGreasyfork(scriptId, loadOptionContentFn) {
      // 非脚本详情页结束
      if (location.host !== 'greasyfork.org' || location.href.indexOf('/scripts/' + scriptId) == -1) {
        return;
      }
      var selector = {
        scriptLinks: '#script-links',
        scriptOptions: '#script-options',
        scriptContent: '#script-content'
      };
      var $body = $(document.body),
        $scriptLinks = $(selector.scriptLinks),
        $scriptContent = $(selector.scriptContent);

      // 添加“脚本设置”选项卡和点击事件
      $scriptLinks.children('li:eq(0)').after("<li><a href=\"javascript:;\" id=\"script-options\">\u811A\u672C\u8BBE\u7F6E</a></li>");
      $body.on('click', selector.scriptOptions, function () {
        // 移除其他已选中选项的样式
        var $currentLi = $scriptLinks.children('li.current');
        $currentLi.html("<a href=\"".concat(location.href, "\">").concat($currentLi.text(), "</a>"));
        $currentLi.removeClass('current');
        // 给“脚本设置”选项卡添加选中选项的样式
        var $scriptOptions = $(selector.scriptOptions);
        $scriptOptions.parent().addClass('current');
        loadOptionContentFn($scriptContent);
      });
    }
  }]);
}();

;// ./gemini-pro/src/Options.ts
var _Options;
function Options_typeof(o) { "@babel/helpers - typeof"; return Options_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Options_typeof(o); }
function Options_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Options_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Options_toPropertyKey(o.key), o); } }
function Options_createClass(e, r, t) { return r && Options_defineProperties(e.prototype, r), t && Options_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = Options_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Options_toPropertyKey(t) { var i = Options_toPrimitive(t, "string"); return "symbol" == Options_typeof(i) ? i : i + ""; }
function Options_toPrimitive(t, r) { if ("object" != Options_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Options_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Options = /*#__PURE__*/function () {
  function Options() {
    Options_classCallCheck(this, Options);
  }
  return Options_createClass(Options, null, [{
    key: "registerAll",
    value:
    /**
     * 注册所有选项
     * @param settingsCallback 点击“设置”时的回调函数
     */
    function registerAll(settingsCallback) {
      var _this = this;
      // 如果传入了回调，将其绑定到对应的选项上
      if (settingsCallback) {
        var option = this.options.find(function (o) {
          return o.name === _this.Keys.settings;
        });
        if (option) {
          option.callback = settingsCallback;
        }
      }
      CommonOptions.registerAll(this.options, null, false);
    }
  }]);
}();
_Options = Options;
/**
 * 选项 Key
 */
_defineProperty(Options, "Keys", {
  settings: 'settings'
});
/**
 * 选项
 * @private
 */
_defineProperty(Options, "options", [{
  label: '设置',
  name: _Options.Keys.settings,
  version: 1,
  value: '',
  menuCmdId: null
}]);


/***/ }),

/***/ 307:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Store)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 存储
 */
var Store = /*#__PURE__*/function () {
  function Store() {
    _classCallCheck(this, Store);
  }
  return _createClass(Store, null, [{
    key: "get",
    value:
    /**
     * 获取
     * @param key 键
     */
    function get(key) {
      return GM_getValue(key);
    }

    /**
     * 设置
     * @param key 键
     * @param value 值
     */
  }, {
    key: "set",
    value: function set(key, value) {
      GM_setValue(key, value);
    }
  }]);
}();


/***/ }),

/***/ 490:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _utils_gm_Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(307);
/* harmony import */ var _gemini_pro_src_Options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(172);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// ==UserScript==
// @name         Gemini Pro
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  增强 Gemini 对话界面
// @author       duanluan
// @copyright    2025, duanluan (https://github.com/duanluan)
// @license      Apache-2.0; https://www.apache.org/licenses/LICENSE-2.0.txt
// @homepage     https://greasyfork.org/zh-CN/scripts/558517
// @match        https://gemini.google.com/*
// @require      https://update.greasyfork.org/scripts/433051/Trusted%20Types%20Helper.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js
// @resource     layui_css https://cdn.jsdelivr.net/npm/layui-tampermonkey@2.9.9-rc.3/css/layui.css
// @require      https://cdn.jsdelivr.net/npm/layui-tampermonkey@2.9.9-rc.3/layui.js
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/558517/Gemini%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/558517/Gemini%20Pro.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author       duanluan
// @updateURL    https://raw.kkgithub.com/duanluan/tampermonkey-scripts/main/gemini-pro/dist/gemini-pro.user.js
// ==/OpenUserJS==



(function () {
  'use strict';

  // 加载 Layui CSS
  GM_addStyle(GM_getResourceText('layui_css'));

  // 注入自定义样式
  GM_addStyle("\n    .layui-layer-ico{background:url('https://cdn.jsdelivr.net/npm/layer-src@3.5.1/dist/theme/default/icon.png') no-repeat}\n    .layui-layer-ico1{background-position:-30px 0}\n    .layui-layer-ico2{background-position:-60px 0}\n    .layui-layer-ico3{background-position:-90px 0}\n    .layui-layer-ico4{background-position:-120px 0}\n    .layui-layer-ico5{background-position:-150px 0}\n    .layui-layer-ico6{background-position:-180px 0}\n\n    /* === \u8BBE\u7F6E\u5165\u53E3\uFF1A\u5D4C\u5165\u5F0F\u6309\u94AE\u6837\u5F0F === */\n    #gemini-pro-toolbar-btn {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      box-sizing: border-box;\n      width: 40px; /* \u6807\u51C6 Material Icon Button \u5927\u5C0F */\n      height: 40px;\n      border: none;\n      outline: none;\n      background-color: transparent;\n      fill: currentColor;\n      color: #444746;\n      border-radius: 50%;\n      cursor: pointer;\n      margin-right: 4px; /* \u4E0E\u53F3\u4FA7\u539F\u6709\u56FE\u6807\u4FDD\u6301\u4E00\u70B9\u8DDD\u79BB */\n      transition: background-color 0.15s cubic-bezier(0.4, 0.0, 0.2, 1);\n    }\n    \n    /* \u6697\u9ED1\u6A21\u5F0F\u9002\u914D (\u5C1D\u8BD5\u5339\u914D Gemini \u7684\u989C\u8272\u53D8\u91CF\u6216\u901A\u7528\u6DF1\u8272) */\n    @media (prefers-color-scheme: dark) {\n      #gemini-pro-toolbar-btn {\n        color: #e3e3e3;\n      }\n      #gemini-pro-toolbar-btn:hover {\n        background-color: rgba(227, 227, 227, 0.08);\n      }\n    }\n    \n    /* \u666E\u901A\u6A21\u5F0F\u4E0B\u7684 Hover */\n    @media (prefers-color-scheme: light) {\n      #gemini-pro-toolbar-btn:hover {\n        background-color: rgba(68, 71, 70, 0.08);\n      }\n    }\n\n    #gemini-pro-toolbar-btn svg {\n      width: 24px;\n      height: 24px;\n      pointer-events: none;\n    }\n    \n    /* \u6E05\u9664\u9876\u90E8\u7684\u865A\u5316\u906E\u7F69\uFF0C\u8FD9\u662F\u5BFC\u81F4\u957F\u622A\u56FE\u51FA\u73B0\u9634\u5F71\u63A5\u7F1D\u7684\u6839\u6E90 */\n    body.gemini-pro-no-input-shadow .input-gradient,\n    body.gemini-pro-no-input-shadow .input-gradient::before,\n    body.gemini-pro-no-input-shadow .input-gradient::after {\n      background: none !important;\n      background-image: none !important;\n      mask: none !important;\n      -webkit-mask: none !important;\n      box-shadow: none !important;\n    }\n  ");
  var selector = {
    // 我的内容入口按钮
    myContentEntryBtn: '.side-nav-entry-container > side-nav-entry-button',
    // 我的内容预览
    myContentPreview: 'my-stuff-recents-preview',
    // 底部免责声明
    disclaimer: 'hallucination-disclaimer'
  };
  var defaultConfig = {
    hideMyContentEntryBtn: false,
    hideMyContentPreview: false,
    hideDisclaimer: false,
    hideInputShadow: false,
    // 复制时合并多余换行
    trimCopyNewline: false,
    // 注意：移除 fabPos，因为不再需要悬浮按钮位置
    // 默认边距
    page: {
      chatLeftPadding: '10%',
      chatRightPadding: '10%',
      chatBottomPadding: '',
      // 新增：Markdown 内容间距设置 (P 只设下边距，H/LI 设上下边距)
      pBottomSpacing: '',
      hTopSpacing: '',
      hBottomSpacing: '',
      // 新增：UL/OL 列表整体间距
      ulTopSpacing: '',
      ulBottomSpacing: '',
      // LI 列表项间距
      liTopSpacing: '',
      liBottomSpacing: '',
      // 表格下边距
      tableBottomPadding: '0px',
      // 代码块行高
      codeLineHeight: '',
      // 代码块最大高度 (替代原最大行数)
      codeMaxHeight: ''
    }
  };
  var STORE_CONF_KEY = 'config';

  // 读取配置
  var savedConfigStr = _utils_gm_Store__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.get(STORE_CONF_KEY);
  var config = savedConfigStr ? JSON.parse(savedConfigStr) : defaultConfig;
  config.page = _objectSpread(_objectSpread({}, defaultConfig.page), config.page || {});

  /**
   * 辅助函数：确保 CSS 值带有单位 (默认 px)
   */
  var toCssVal = function toCssVal(val) {
    if (!val) return '0px';
    val = String(val).trim();
    // 纯数字补 px
    if (/^\d+$/.test(val)) return val + 'px';
    return val;
  };

  /**
   * 应用页面宽度样式 (核心修复版)
   */
  var applyPageStyle = function applyPageStyle() {
    var styleId = 'gemini-pro-page-style';
    var $style = $("#".concat(styleId));
    if ($style.length === 0) {
      $style = $("<style id=\"".concat(styleId, "\"></style>"));
      $('head').append($style);
    }
    var leftRaw = config.page.chatLeftPadding;
    var rightRaw = config.page.chatRightPadding;
    var bottomRaw = config.page.chatBottomPadding;

    // 计算并限制总边距不超过 80%
    var winWidth = $(window).width() || window.innerWidth || 0;
    // 定义最大总边距 (80%)
    var maxTotalPadding = winWidth * 0.8;

    // 内部辅助：统一转像素
    var parseToPx = function parseToPx(val) {
      if (!val) return 0;
      val = String(val).trim();
      // 如果是百分比
      if (val.endsWith('%')) {
        return parseFloat(val) / 100 * winWidth;
      }
      // 否则视为数字或 px
      return parseFloat(val) || 0;
    };
    var leftPx = parseToPx(leftRaw);
    var rightPx = parseToPx(rightRaw);
    var totalPx = leftPx + rightPx;

    // 判断是否超过阈值 (需确保 width > 0 避免除以 0)
    if (winWidth > 0 && totalPx > maxTotalPadding) {
      // 计算缩放系数
      var scale = maxTotalPadding / totalPx;

      // 按比例缩放左右边距
      leftPx = leftPx * scale;
      rightPx = rightPx * scale;

      // 覆盖原始值为计算后的 px 字符串
      leftRaw = leftPx + 'px';
      rightRaw = rightPx + 'px';
      console.warn("Gemini Pro: Chat padding exceeded limit, adjusted to ".concat(leftRaw, " (left) and ").concat(rightRaw, " (right)"));
    } else {
      // 未超限，使用常规格式化 (补全单位)
      leftRaw = toCssVal(leftRaw);
      rightRaw = toCssVal(rightRaw);
    }

    // 底边距不需要参与宽度计算逻辑，直接格式化
    bottomRaw = toCssVal(bottomRaw);
    var chatLeftPadding = leftRaw;
    var chatRightPadding = rightRaw;
    var chatBottomPadding = bottomRaw;

    // 处理 Markdown 间距配置
    var pBottom = toCssVal(config.page.pBottomSpacing);
    var hTop = toCssVal(config.page.hTopSpacing);
    var hBottom = toCssVal(config.page.hBottomSpacing);
    var ulTop = toCssVal(config.page.ulTopSpacing);
    var ulBottom = toCssVal(config.page.ulBottomSpacing);
    var liTop = toCssVal(config.page.liTopSpacing);
    var liBottom = toCssVal(config.page.liBottomSpacing);
    var tableBottom = toCssVal(config.page.tableBottomPadding);

    // 代码行高：不使用 toCssVal，允许纯数字作为倍数
    var codeLH = config.page.codeLineHeight ? String(config.page.codeLineHeight).trim() : '';

    // 代码块最大高度 CSS 生成逻辑
    var codeMaxHeightCss = '';
    if (config.page.codeMaxHeight) {
      var maxH = toCssVal(config.page.codeMaxHeight);
      // 作用于 code-block 内部的 pre 标签
      // 强制 display: block 以确保 scrollbar 能正常出现
      codeMaxHeightCss = "\n        .formatted-code-block-internal-container pre {\n            max-height: ".concat(maxH, " !important;\n            overflow-y: auto !important;\n            display: block !important;\n        }\n      ");
    }

    // 将显隐逻辑直接转换为 CSS 规则
    var displayNone = 'display: none !important;';
    $style.text("\n      /* \u663E\u9690\u63A7\u5236 */\n      ".concat(selector.myContentEntryBtn, " {\n        ").concat(config.hideMyContentEntryBtn ? displayNone : '', "\n      }\n      ").concat(selector.myContentPreview, " {\n        ").concat(config.hideMyContentPreview ? displayNone : '', "\n      }\n      ").concat(selector.disclaimer, " {\n        ").concat(config.hideDisclaimer ? displayNone : '', "\n      }\n      \n      /* \u804A\u5929\u5BF9\u8BDD\u5BB9\u5668 */\n      #chat-history > .chat-history {\n        padding: 16px ").concat(chatRightPadding, " 20px ").concat(chatLeftPadding, " !important;\n      }\n      /* \u804A\u5929\u5BF9\u8BDD Gem \u4FE1\u606F */\n      #chat-history > .chat-history > .bot-info-card-container {\n        padding: 0 !important;\n      }\n      /* \u89E3\u51B3\u4FEE\u6539 Gem \u4FE1\u606F padding \u540E\u4E0D\u5C45\u4E2D\u95EE\u9898 */\n      bot-info-card > .bot-info-card-container {\n        align-items: center !important;\n      }\n      \n      /* \u7528\u6237\u8BF4 */\n      user-query {\n        max-width: 100% !important;\n      }\n      user-query-content > .user-query-container {\n        max-width: 50% !important;\n      }\n      /* AI \u8BF4 */\n      .conversation-container {\n        max-width: 100% !important;\n      }\n      \n      /* \u804A\u5929\u8F93\u5165\u8FB9\u8DDD */\n      input-container {\n        padding: 0 ").concat(chatRightPadding, " ").concat(chatBottomPadding, " ").concat(chatLeftPadding, " !important;\n      }\n      /* \u804A\u5929\u8F93\u5165\u6700\u5927\u5BBD\u5EA6 */\n      .input-area-container {\n        max-width: 100% !important;\n      }\n\n      /* === Markdown \u5185\u5BB9\u95F4\u8DDD\u8C03\u6574 === */\n      \n      /* \u6BB5\u843D (P)\uFF1A\u53EA\u63A7\u5236\u4E0B\u8FB9\u8DDD */\n      ").concat(config.page.pBottomSpacing ? "\n      message-content .markdown p {\n        margin-bottom: ".concat(pBottom, " !important;\n      }") : '', "\n\n      /* \u6807\u9898 (H1-H6)\uFF1A\u63A7\u5236\u4E0A\u4E0B\u8FB9\u8DDD */\n      ").concat(config.page.hTopSpacing || config.page.hBottomSpacing ? "\n      message-content .markdown h1,\n      message-content .markdown h2,\n      message-content .markdown h3,\n      message-content .markdown h4,\n      message-content .markdown h5,\n      message-content .markdown h6 {\n        ".concat(config.page.hTopSpacing ? "margin-top: ".concat(hTop, " !important;") : '', "\n        ").concat(config.page.hBottomSpacing ? "margin-bottom: ".concat(hBottom, " !important;") : '', "\n      }") : '', "\n\n      /* \u5217\u8868\u6574\u4F53 (UL/OL)\uFF1A\u63A7\u5236\u4E0A\u4E0B\u8FB9\u8DDD */\n      ").concat(config.page.ulTopSpacing || config.page.ulBottomSpacing ? "\n      message-content .markdown ul,\n      message-content .markdown ol {\n        ".concat(config.page.ulTopSpacing ? "margin-top: ".concat(ulTop, " !important;") : '', "\n        ").concat(config.page.ulBottomSpacing ? "margin-bottom: ".concat(ulBottom, " !important;") : '', "\n      }") : '', "\n\n      /* \u5217\u8868\u9879 (LI)\uFF1A\u63A7\u5236\u4E0A\u4E0B\u8FB9\u8DDD */\n      ").concat(config.page.liTopSpacing || config.page.liBottomSpacing ? "\n      message-content .markdown ul li,\n      message-content .markdown ol li,\n      message-content .markdown ul li > p,\n      message-content .markdown ol li > p {\n        ".concat(config.page.liTopSpacing ? "margin-top: ".concat(liTop, " !important;") : '', "\n        ").concat(config.page.liBottomSpacing ? "margin-bottom: ".concat(liBottom, " !important;") : '', "\n      }") : '', "\n\n      /* \u8868\u683C (Table) \u95F4\u8DDD\u53CA\u6EDA\u52A8\u63A7\u5236 */\n      ").concat(config.page.tableBottomPadding !== '' ? "\n      .horizontal-scroll-wrapper,\n      .horizontal-scroll-wrapper > .table-block-component {\n        overflow-x: auto !important;\n        padding-bottom: ".concat(tableBottom, " !important;\n      }") : '', "\n\n      /* \u4EE3\u7801\u5757\u884C\u9AD8 (\u540C\u65F6\u63A7\u5236\u5916\u5C42\u5BB9\u5668\u548C\u5185\u5C42 span) */\n      ").concat(config.page.codeLineHeight ? "\n      .code-container,\n      .code-container pre,\n      .code-container code,\n      .code-container span {\n        line-height: ".concat(codeLH, " !important;\n      }") : '', "\n      \n      /* \u4EE3\u7801\u5757\u6700\u5927\u9AD8\u5EA6 (\u6EDA\u52A8\u6761) */\n      ").concat(codeMaxHeightCss, "\n    "));
  };

  /**
   * 应用配置
   */
  var applyConfig = function applyConfig() {
    // 样式类配置：通过 toggleClass 给 body 加标记
    $('body').toggleClass('gemini-pro-no-input-shadow', config.hideInputShadow);
    applyPageStyle();
  };

  // 初始应用
  applyConfig();

  // 监听窗口大小变化，动态重新计算边距限制
  // (避免大屏幕下设置的 px 值在小屏幕上占满全屏)
  $(window).on('resize', function () {
    applyPageStyle();
  });

  // 标记是否点击了Gemini原生的复制按钮（代码块按钮 或 底部回答按钮）
  var isNativeCopyBtnClick = false;

  // 监听点击事件 (捕获阶段，确保先于页面逻辑执行)
  document.addEventListener('click', function (e) {
    var target = e.target;

    // 1. 代码块右上角的复制按钮 (class="copy-button")
    // 2. 回答底部的复制按钮组件 (tag="copy-button" 或 attribute data-test-id="copy-button")
    var btn = target.closest('button.copy-button') || target.closest('copy-button');
    if (btn) {
      isNativeCopyBtnClick = true;
      // 500ms 后重置，防止影响后续操作
      setTimeout(function () {
        isNativeCopyBtnClick = false;
      }, 500);
    }
  }, true);

  // 监听复制事件 (使用 { capture: true } 以在页面脚本之前拦截)
  document.addEventListener('copy', function (e) {
    // 0. 全局开关校验
    if (!config.trimCopyNewline) return;

    // 1. 如果是点击了 Gemini 原生的复制按钮，放行 (不做 preventDefault)
    if (isNativeCopyBtnClick) {
      isNativeCopyBtnClick = false; // 消费掉标记
      return;
    }
    var selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

    // 2. 如果选区完全在代码块内部（Code Block），也不做处理
    // 查找选区的公共祖先，看它是否在 pre 或 .code-block-component 内
    var commonNode = selection.getRangeAt(0).commonAncestorContainer;
    // 如果是文本节点，取其父元素
    if (commonNode.nodeType === 3) {
      commonNode = commonNode.parentNode;
    }
    var parentEl = commonNode;
    // 检查是否在代码块容器中
    if (parentEl.closest('pre') || parentEl.closest('.code-block-component')) {
      // 纯代码块内容复制，不执行空行合并
      return;
    }

    // 3. 执行混合内容的智能处理（保护代码块结构，合并普通文本空行）
    // 关键修复：阻止后续事件处理，并清除已存在的(可能由页面生成的)数据
    e.preventDefault();
    e.stopImmediatePropagation();

    // 获取 DOM 片段
    var range = selection.getRangeAt(0);
    var fragment = range.cloneContents();
    var tempDiv = document.createElement('div');
    tempDiv.appendChild(fragment);

    // 保护代码块：查找 <pre>
    var codeBlocks = tempDiv.querySelectorAll('pre');
    var placeholders = [];
    codeBlocks.forEach(function (block, index) {
      // 生成唯一占位符
      var placeholder = "__GEMINI_CODE_BLOCK_PROTECTION_".concat(index, "_").concat(Date.now(), "__");
      // 保存原始内容
      placeholders.push({
        id: placeholder,
        content: block.innerText
      });
      // 替换
      block.textContent = placeholder;
    });

    // 获取文本并处理
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.opacity = '0';
    document.body.appendChild(tempDiv);
    var text = tempDiv.innerText;
    document.body.removeChild(tempDiv);

    // 合并换行逻辑：每两个换行符替换为一个
    text = text.replace(/\n\n/g, '\n');

    // 还原代码块
    placeholders.forEach(function (item) {
      text = text.replace(item.id, item.content);
    });

    // 4. 彻底清空剪贴板数据 (防止 text/html 残留)
    if (e.clipboardData) {
      e.clipboardData.clearData();
      e.clipboardData.setData('text/plain', text);
    }
  },
  // 表示在捕获阶段执行
  true);

  // 定义点击设置时的回调函数
  var onSettingsClick = function onSettingsClick() {
    // 辅助函数：获取配置值 > 页面实时计算值 > 兜底默认值
    var getVal = function getVal(key, selector, prop, fallback) {
      // 1. 如果有配置值，直接使用 (保持用户输入的原样)
      if (config.page[key]) return config.page[key];

      // 2. 尝试从 DOM 获取当前计算样式 (浏览器通常返回 px)
      var el = document.querySelector(selector);
      if (el) {
        return getComputedStyle(el)[prop];
      }

      // 3. 使用兜底默认值，如果是 rem 则转换为 px
      if (fallback && fallback.includes('rem')) {
        var rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        return parseFloat(fallback) * rootFontSize + 'px';
      }
      return fallback || '';
    };

    // 获取用于显示在 Input 框中的值
    // 默认值参考：s=8px, h-top=1.75rem, h-bottom=8px, li=8px
    var pBottom = getVal('pBottomSpacing', 'message-content .markdown p', 'marginBottom', '');
    var hTop = getVal('hTopSpacing', 'message-content .markdown h2', 'marginTop', '1.75rem');
    var hBottom = getVal('hBottomSpacing', 'message-content .markdown h2', 'marginBottom', '8px');

    // UL/OL 默认通常是 1em，这里兜底给 16px (1rem)
    var ulTop = getVal('ulTopSpacing', 'message-content .markdown ul', 'marginTop', '1rem');
    var ulBottom = getVal('ulBottomSpacing', 'message-content .markdown ul', 'marginBottom', '1rem');
    var liTop = getVal('liTopSpacing', 'message-content .markdown li', 'marginTop', '8px');
    var liBottom = getVal('liBottomSpacing', 'message-content .markdown li', 'marginBottom', '8px');

    // 表格下边距
    var tableBottom = getVal('tableBottomPadding', '.horizontal-scroll-wrapper', 'paddingBottom', '0px');

    // 代码块行高：优先获取 code 标签的行高，比 span 更能反映块级属性
    var codeLH = getVal('codeLineHeight', '.code-container code', 'lineHeight', '1.5');
    // 代码块最大高度
    var codeMaxH = config.page.codeMaxHeight;
    layer.open({
      type: 1,
      area: ['600px', '650px'],
      title: 'Gemini Pro 设置',
      // 点击遮罩关闭
      shadeClose: true,
      content: "\n        <div class=\"layui-tab layui-tab-brief\" lay-filter=\"gemini-settings-tab\" style=\"margin: 0;\">\n          <ul class=\"layui-tab-title\">\n            <li class=\"layui-this\">\u5E38\u89C4\u8BBE\u7F6E</li>\n            <li>\u9875\u9762\u8C03\u6574</li>\n            <li>\u4EE3\u7801\u5757\u589E\u5F3A</li>\n          </ul>\n          <div class=\"layui-tab-content\">\n            <div class=\"layui-tab-item layui-show\">\n              <form class=\"layui-form\" style=\"padding: 10px;\" action=\"\">\n                <div class=\"layui-form-item\">\n                  <label class=\"layui-form-label\" style=\"width: 60px;\">\u9690\u85CF\uFF1A</label>\n                  <div class=\"layui-input-block\" style=\"margin-left: 90px;\">\n                    <input type=\"checkbox\" title=\"\u4FA7\u8FB9\u680F-\u6211\u7684\u5185\u5BB9\" name=\"hideMyContentEntryBtn\" lay-filter=\"item-switch\" ".concat(config.hideMyContentEntryBtn ? 'checked' : '', "/>\n                    <input type=\"checkbox\" title=\"\u4FA7\u8FB9\u680F-\u6211\u7684\u5185\u5BB9\u9884\u89C8\" name=\"hideMyContentPreview\" lay-filter=\"item-switch\" ").concat(config.hideMyContentPreview ? 'checked' : '', "/>\n                    <input type=\"checkbox\" title=\"\u5E95\u90E8\u514D\u8D23\u58F0\u660E\" name=\"hideDisclaimer\" lay-filter=\"item-switch\" ").concat(config.hideDisclaimer ? 'checked' : '', "/>\n                    <input type=\"checkbox\" title=\"\u804A\u5929\u8F93\u5165\u6846\u4E0A\u65B9\u6E10\u53D8\" name=\"hideInputShadow\" lay-filter=\"item-switch\" ").concat(config.hideInputShadow ? 'checked' : '', "/>\n                  </div>\n                </div>\n                \n                <div class=\"layui-form-item\">\n                  <label class=\"layui-form-label\" style=\"width: 60px;\">\u5176\u4ED6\uFF1A</label>\n                  <div class=\"layui-input-block\" style=\"margin-left: 90px;\">\n                    <input type=\"checkbox\" title=\"\u526A\u8D34\u677F-\u5220\u9664\u9519\u8BEF\u7A7A\u884C\" name=\"trimCopyNewline\" lay-filter=\"item-switch\" ").concat(config.trimCopyNewline ? 'checked' : '', "/>\n                  </div>\n                </div>\n              </form>\n            </div>\n\n            <div class=\"layui-tab-item\">\n              <form class=\"layui-form\" lay-filter=\"page-form\" style=\"padding: 10px;\">\n                <fieldset class=\"layui-elem-field layui-field-title\" style=\"margin-top: 10px;\">\n                  <legend style=\"font-size: 14px;\">\u5BB9\u5668\u8FB9\u8DDD</legend>\n                </fieldset>\n                \n                <div class=\"layui-form-item\">\n                  <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u804A\u5929\u5DE6</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"chatLeftPadding\" value=\"").concat(config.page.chatLeftPadding, "\" placeholder=\"\u5982 10%\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                  <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u804A\u5929\u53F3</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"chatRightPadding\" value=\"").concat(config.page.chatRightPadding, "\" placeholder=\"\u5982 10%\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                  <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u804A\u5929\u4E0B</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"chatBottomPadding\" value=\"").concat(config.page.chatBottomPadding, "\" placeholder=\"\u5982 20px\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                </div>\n                \n                <fieldset class=\"layui-elem-field layui-field-title\" style=\"margin-top: 20px;\">\n                  <legend style=\"font-size: 14px;\">\u5185\u5BB9\u95F4\u8DDD</legend>\n                </fieldset>\n\n                <div class=\"layui-form-item\">\n                  <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u6BB5\u843D\u4E0B</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"pBottomSpacing\" value=\"").concat(pBottom, "\" placeholder=\"\u5982 10px\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                  <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u6807\u9898\u4E0A</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"hTopSpacing\" value=\"").concat(hTop, "\" placeholder=\"\u4E0A\u95F4\u8DDD\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                  <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u6807\u9898\u4E0B</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"hBottomSpacing\" value=\"").concat(hBottom, "\" placeholder=\"\u4E0B\u95F4\u8DDD\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                </div>\n                \n                <div class=\"layui-form-item\">\n                  <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u5217\u8868\u4E0A</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"ulTopSpacing\" value=\"").concat(ulTop, "\" placeholder=\"\u4E0A\u95F4\u8DDD\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                  <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u5217\u8868\u4E0B</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"ulBottomSpacing\" value=\"").concat(ulBottom, "\" placeholder=\"\u4E0B\u95F4\u8DDD\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                    <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u8868\u683C\u4E0B</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"tableBottomPadding\" value=\"").concat(tableBottom, "\" placeholder=\"\u4E0B\u95F4\u8DDD\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                </div>\n\n                <div class=\"layui-form-item\">\n                  <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u5217\u8868\u9879\u4E0A</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"liTopSpacing\" value=\"").concat(liTop, "\" placeholder=\"\u4E0A\u95F4\u8DDD\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                  <div class=\"layui-inline\">\n                    <label class=\"layui-form-label\" style=\"width: 70px; padding-left: 5px; padding-right: 5px;\">\u5217\u8868\u9879\u4E0B</label>\n                    <div class=\"layui-input-inline\" style=\"width: 90px;\">\n                      <input type=\"text\" name=\"liBottomSpacing\" value=\"").concat(liBottom, "\" placeholder=\"\u4E0B\u95F4\u8DDD\" autocomplete=\"off\" class=\"layui-input\">\n                    </div>\n                  </div>\n                </div>\n                \n                <div style=\"padding: 0 20px; color: #999; font-size: 12px; line-height: 1.5;\">\n                  <p>1. \u652F\u6301\u5355\u4F4D\uFF1Apx\uFF08\u50CF\u7D20\uFF09\u6216 %\uFF08\u767E\u5206\u6BD4\uFF09\u3002</p>\n                  <p>2. \u5982\u679C\u53EA\u586B\u6570\u5B57\uFF0C\u9ED8\u8BA4\u4E3A px\u3002</p>\n                  <p>3. \u7559\u7A7A\u5219\u4E0D\u8C03\u6574\uFF0C\u652F\u6301\u9F20\u6807\u6EDA\u8F6E\u8C03\u6574\u6570\u503C\u3002</p>\n                </div>\n              </form>\n            </div>\n\n            <div class=\"layui-tab-item\">\n              <form class=\"layui-form\" style=\"padding: 10px;\">\n                <fieldset class=\"layui-elem-field layui-field-title\" style=\"margin-top: 10px;\">\n                  <legend style=\"font-size: 14px;\">\u663E\u793A\u8BBE\u7F6E</legend>\n                </fieldset>\n                <div class=\"layui-form-item\">\n                  <label class=\"layui-form-label\" style=\"width: 80px;\">\u4EE3\u7801\u884C\u9AD8</label>\n                  <div class=\"layui-input-block\" style=\"margin-left: 110px;\">\n                    <input type=\"text\" name=\"codeLineHeight\" value=\"").concat(codeLH, "\" placeholder=\"\u5982 1.5 \u6216 24px\" autocomplete=\"off\" class=\"layui-input\">\n                  </div>\n                </div>\n                <div class=\"layui-form-item\">\n                  <label class=\"layui-form-label\" style=\"width: 80px;\">\u6700\u5927\u9AD8\u5EA6</label>\n                  <div class=\"layui-input-block\" style=\"margin-left: 110px;\">\n                    <input type=\"text\" name=\"codeMaxHeight\" value=\"").concat(codeMaxH, "\" placeholder=\"\u8D85\u51FA\u5219\u663E\u793A\u6EDA\u52A8\u6761\uFF0C\u5982 600px\" autocomplete=\"off\" class=\"layui-input\">\n                  </div>\n                </div>\n                \n                <div style=\"padding: 0 20px; color: #999; font-size: 12px; line-height: 1.5;\">\n                  <p>1. \u652F\u6301\u5355\u4F4D\uFF1Apx\uFF08\u50CF\u7D20\uFF09\u3002</p>\n                  <p>2. \u884C\u9AD8\u82E5\u65E0\u5355\u4F4D\u5219\u4E3A\u500D\u6570\uFF08\u652F\u6301\u5C0F\u6570\uFF09\u3002</p>\n                  <p>3. \u7559\u7A7A\u5219\u4E0D\u8C03\u6574\uFF0C\u652F\u6301\u9F20\u6807\u6EDA\u8F6E\u8C03\u6574\u6570\u503C\u3002</p>\n                </div>\n              </form>\n            </div>\n          </div>\n        </div>\n      ")
    });

    // layer.open 中 radio、checkbox、select 需要 render 才能显示
    layui.use(['form', 'element'], function () {
      var form = layui.form;
      form.render();
      // 监听复选框变更
      form.on('checkbox(item-switch)', function (data) {
        // 更新配置对象
        config[data.elem.name] = data.elem.checked;
        // 保存配置
        _utils_gm_Store__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.set(STORE_CONF_KEY, JSON.stringify(config));
        applyConfig();
      });

      // 动态监听输入框变化 (包含原来的边距和新增的内容间距)
      var inputSelector = ['input[name="chatLeftPadding"]', 'input[name="chatRightPadding"]', 'input[name="chatBottomPadding"]', 'input[name="pBottomSpacing"]', 'input[name="hTopSpacing"]', 'input[name="hBottomSpacing"]', 'input[name="ulTopSpacing"]', 'input[name="ulBottomSpacing"]', 'input[name="liTopSpacing"]', 'input[name="liBottomSpacing"]', 'input[name="tableBottomPadding"]', 'input[name="codeLineHeight"]', 'input[name="codeMaxHeight"]'].join(', ');
      $(inputSelector).on('input', function () {
        // 获取当前输入框的 name 和 value，更新内存中的配置
        config.page[$(this).attr('name')] = $(this).val();
        // 持久化保存
        _utils_gm_Store__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.set(STORE_CONF_KEY, JSON.stringify(config));
        // 实时应用样式
        applyConfig();
      });

      // 支持鼠标滚轮调整数值
      $(inputSelector).on('wheel', function (e) {
        // 阻止默认滚动行为
        e.preventDefault();
        var $this = $(this);
        // 获取滚动方向：deltaY > 0 为向下滚动(数值减小)，deltaY < 0 为向上滚动(数值增加)
        var originalEvent = e.originalEvent;
        var delta = originalEvent.deltaY || -originalEvent.wheelDelta || originalEvent.detail;

        // 获取当前值并分离数值和单位
        var valStr = String($this.val());
        // 正则匹配：开始(可选负号)(数字)(可选单位)
        var match = valStr.match(/^(-?[\d\.]+)(.*)$/);
        var num = 0;
        var unit = ''; // 默认单位为空，由后续逻辑决定

        if (match) {
          num = parseFloat(match[1]);
          unit = match[2];
        } else if (!valStr) {
          // 如果为空，视为 0
          num = 0;
        }

        // 其他字段默认补 px (行高除外)
        var name = $this.attr('name');
        if (!unit && name !== 'codeLineHeight') {
          unit = 'px';
        }

        // 确定步长：如果是代码行高，步长为 0.1，否则为 1
        var step = name === 'codeLineHeight' ? 0.1 : 1;

        // 根据滚动方向增减
        if (delta < 0) {
          num += step;
        } else {
          num -= step;
          if (num < 0) num = 0;
        }

        // 针对小数运算修复精度问题
        if (name === 'codeLineHeight') {
          num = parseFloat(num.toFixed(1));
        }

        // 更新输入框并手动触发 input 事件以保存和应用
        $this.val(num + unit);
        $this.trigger('input');
      });
    });
  };

  /**
   * 将设置按钮嵌入到页面顶部导航栏 (替代原有的悬浮球逻辑)
   */
  var mountToolbarButton = function mountToolbarButton() {
    var btnId = 'gemini-pro-toolbar-btn';

    // 如果按钮已经存在，则无需重复创建
    if (document.getElementById(btnId)) return;

    // 寻找插入点：
    // 优先寻找 "studio-sidebar-button" (文件列表图标)
    // 其次寻找 "pillbox" (PRO 按钮)
    var anchorEl = document.querySelector('studio-sidebar-button') || document.querySelector('[data-test-id="pillbox"]');
    if (!anchorEl) return; // 还没加载出来，等待下一次 Observer 触发

    // 找到这些按钮的父容器 (也就是 class="buttons-container" 的那个)
    // 根据结构，这些按钮可能被包裹在内层容器中，我们需要把按钮放到最外层的 buttons-container 的最前面
    var container = anchorEl.closest('.buttons-container');

    // 逻辑：如果找到的容器只有这一个子元素（Wrapper），说明是内层，需要再往上找一级
    if (container) {
      // 检查是否是内层包装器
      if (container.children.length === 1 && container.contains(anchorEl)) {
        var _container$parentElem;
        var parentContainer = (_container$parentElem = container.parentElement) === null || _container$parentElem === void 0 ? void 0 : _container$parentElem.closest('.buttons-container');
        if (parentContainer) {
          insertButton(parentContainer);
          return;
        }
      }

      // 默认尝试插入当前找到的容器
      insertButton(container);
    }
    function insertButton(targetContainer) {
      // 再次检查防止重复 (以防万一)
      if (targetContainer.querySelector("#".concat(btnId))) return;
      var $btn = $("\n        <button id=\"".concat(btnId, "\" title=\"Gemini Pro \u8BBE\u7F6E\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 -960 960 960\" width=\"24\">\n            <path d=\"M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z\"/>\n          </svg>\n        </button>\n      "));
      $btn.on('click', function (e) {
        // 阻止冒泡，防止触发潜在的导航栏点击事件
        e.stopPropagation();
        onSettingsClick();
      });

      // 插入到容器的第一个位置 (Prepend)
      $(targetContainer).prepend($btn);

      // 首次运行时显示设置入口提示
      if (!_utils_gm_Store__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.get('hasShownButtonHint')) {
        setTimeout(function () {
          // 使用 layer.tips 在按钮下方显示提示，5秒后自动消失
          layer.tips('Gemini Pro 设置入口在这里', "#".concat(btnId), {
            tips: [3, '#009688'],
            // 3=Bottom, 颜色使用 Teal
            time: 5000,
            anim: 5 // 渐显效果
          });
          // 标记已提示
          _utils_gm_Store__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.set('hasShownButtonHint', true);
        }, 4000);
      }
    }
  };

  // 使用 MutationObserver 监听 DOM 变化，确保 SPA 页面切换/刷新时按钮依然存在
  var observer = new MutationObserver(function (mutations) {
    mountToolbarButton();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 1. 注册 Tampermonkey 菜单选项 (保留作为备用入口)
  _gemini_pro_src_Options__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.registerAll(onSettingsClick);

  // 2. 渲染页面 UI 入口
  mountToolbarButton();
})();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(490);
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(172);
/******/ 	
/******/ })()
;
//# sourceMappingURL=gemini-pro.user.js.map