// ==UserScript==
// @name        贴吧内容屏蔽器
// @namespace   http://tampermonkey.net/
// @license     GPL-3.0
// @version     1.0
// @author      byhgz
// @description 对贴吧(tieba.baidu.com)部分页面内容进行屏蔽处理
// @icon        https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @noframes    
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @exclude     http://localhost:3001/
// @match       *://localhost/*
// @match       *://tieba.baidu.com/*
// @require     https://unpkg.com/vue@2.7.16/dist/vue.min.js
// @require     https://unpkg.com/element-ui@2.15.14/lib/index.js
// @downloadURL https://update.greasyfork.org/scripts/554869/%E8%B4%B4%E5%90%A7%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554869/%E8%B4%B4%E5%90%A7%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==
"use strict";
(function(Vue){'use strict';var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _regularEvents, _callbackEvents, _EventEmitter_instances, handlePendingEvents_fn, executePreHandle_fn;
class EventEmitter {
  constructor() {
    __privateAdd(this, _EventEmitter_instances);
    __privateAdd(this, _regularEvents, {
      events: {},
      futures: {},
      parametersDebounce: {},
      preHandles: {}
    });
    __privateAdd(this, _callbackEvents, {
      events: {},
      callbackInterval: 1500
    });
  }
  on(eventName, callback, overrideEvents = false) {
    const events = __privateGet(this, _regularEvents).events;
    if (events[eventName]) {
      if (overrideEvents) {
        events[eventName] = callback;
        __privateMethod(this, _EventEmitter_instances, handlePendingEvents_fn).call(this, eventName, callback);
      }
      return this;
    }
    events[eventName] = callback;
    __privateMethod(this, _EventEmitter_instances, handlePendingEvents_fn).call(this, eventName, callback);
    return this;
  }
  onPreHandle(eventName, callback) {
    const preHandles = __privateGet(this, _regularEvents).preHandles;
    preHandles[eventName] = callback;
    return this;
  }
  handler(eventName, callback) {
    const handlerEvents = __privateGet(this, _callbackEvents).events;
    if (handlerEvents[eventName]) {
      throw new Error("该事件名已经存在，请更换事件名");
    }
    handlerEvents[eventName] = callback;
  }
  invoke(eventName, ...data) {
    return new Promise((resolve) => {
      const handlerEvents = __privateGet(this, _callbackEvents).events;
      if (handlerEvents[eventName]) {
        resolve(handlerEvents[eventName](...data));
        return;
      }
      const i1 = setInterval(() => {
        if (handlerEvents[eventName]) {
          clearInterval(i1);
          resolve(handlerEvents[eventName](...data));
        }
      }, __privateGet(this, _callbackEvents).callbackInterval);
    });
  }
  send(eventName, ...data) {
    const ordinaryEvents = __privateGet(this, _regularEvents);
    const events = ordinaryEvents.events;
    const event = events[eventName];
    if (event) {
      const preHandleData = __privateMethod(this, _EventEmitter_instances, executePreHandle_fn).call(this, eventName, data);
      event.apply(null, preHandleData);
      return this;
    }
    const futures = ordinaryEvents.futures;
    if (futures[eventName]) {
      futures[eventName].push(data);
      return this;
    }
    futures[eventName] = [];
    futures[eventName].push(data);
    return this;
  }
  sendDebounce(eventName, ...data) {
    const parametersDebounce = __privateGet(this, _regularEvents).parametersDebounce;
    let timeOutConfig = parametersDebounce[eventName];
    if (timeOutConfig) {
      clearTimeout(timeOutConfig.timeOut);
      timeOutConfig.timeOut = null;
    } else {
      timeOutConfig = parametersDebounce[eventName] = { wait: 1500, timeOut: null };
    }
    timeOutConfig.timeOut = setTimeout(() => {
      this.send(eventName, ...data);
    }, timeOutConfig.wait);
    return this;
  }
  setDebounceWaitTime(eventName, wait) {
    const timeOutConfig = __privateGet(this, _regularEvents).parametersDebounce[eventName];
    if (timeOutConfig) {
      timeOutConfig.wait = wait;
    } else {
      __privateGet(this, _regularEvents).parametersDebounce[eventName] = {
        wait,
        timeOut: null
      };
    }
    return this;
  }
  emit(eventName, ...data) {
    const callback = __privateGet(this, _regularEvents).events[eventName];
    if (callback) {
      callback.apply(null, data);
    }
    return this;
  }
  off(eventName) {
    const events = __privateGet(this, _regularEvents).events;
    if (events[eventName]) {
      delete events[eventName];
      return true;
    }
    const handlerEvents = __privateGet(this, _callbackEvents).events;
    if (handlerEvents[eventName]) {
      delete handlerEvents[eventName];
      return true;
    }
    return false;
  }
  setInvokeInterval(interval) {
    __privateGet(this, _callbackEvents).callbackInterval = interval;
  }
  getEvents() {
    return {
      regularEvents: __privateGet(this, _regularEvents),
      callbackEvents: __privateGet(this, _callbackEvents)
    };
  }
}
_regularEvents = new WeakMap();
_callbackEvents = new WeakMap();
_EventEmitter_instances = new WeakSet();
handlePendingEvents_fn = function(eventName, callback) {
  const futureEvents = __privateGet(this, _regularEvents).futures;
  if (futureEvents[eventName]) {
    for (const eventData of futureEvents[eventName]) {
      const preHandleData = __privateMethod(this, _EventEmitter_instances, executePreHandle_fn).call(this, eventName, eventData);
      callback.apply(null, preHandleData);
    }
    delete futureEvents[eventName];
  }
};
executePreHandle_fn = function(eventName, data) {
  const preHandles = __privateGet(this, _regularEvents).preHandles;
  const callback = preHandles[eventName];
  if (callback) {
    return callback.apply(null, data);
  }
  return data;
};
const eventEmitter = new EventEmitter();GM_registerMenuCommand("主面板", () => {
  eventEmitter.send("主面板开关");
}, "Q");unsafeWindow.mk_win = window;
window.addButton = (el, doNotInsert = false) => {
  const butEl = document.createElement("button");
  butEl.textContent = "屏蔽";
  butEl.setAttribute("gz_type", "");
  if (doNotInsert)
    return butEl;
  el.appendChild(butEl);
};
const returnTempVal = { state: false };
var globalValue = {
  group_url: "http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=tFU0xLt1uO5u5CXI2ktQRLh_XGAHBl7C&authKey=KAf4rICQYjfYUi66WelJAGhYtbJLILVWumOm%2BO9nM5fNaaVuF9Iiw3dJoPsVRUak&noverify=0&group_code=876295632",
  b_url: "https://space.bilibili.com/473239155",
  scriptCat_js_url: "https://scriptcat.org/zh-CN/script-show-page/4551",
  github_url: "https://github.com/hgztask/mkTieBaContentShield",
  update_log_url: "https://docs.qq.com/doc/DSnhjSVZmRkpCd0Nj"
};var defUtil = {
  toTimeString() {
    return ( new Date()).toLocaleString();
  },
  initVueApp(el, App, props = {}) {
    return new Vue({
      render: (h) => h(App, { props })
    }).$mount(el);
  },
  handleFileReader(event) {
    return new Promise((resolve, reject) => {
      const file = event.target.files[0];
      if (!file) {
        reject("未读取到文件");
        return;
      }
      let reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        resolve({ file, content: fileContent });
        reader = null;
      };
      reader.readAsText(file);
    });
  },
  saveTextAsFile(text, filename = "data.txt") {
    const blob = new Blob([text], { type: "text/plain" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
    }, 100);
  }
};var ruleKeyDataList = [
  {
    "name": "用户名",
    "key": "username",
    "pattern": "模糊",
    "fullName": "模糊用户名"
  },
  {
    "name": "用户名",
    "key": "username_precise",
    "pattern": "精确",
    "fullName": "精确用户名"
  },
  {
    "name": "用户名",
    "key": "username_regex",
    "pattern": "正则",
    "fullName": "正则用户名"
  },
  {
    "name": "用户长串id",
    "key": "userLongId_precise",
    "pattern": "精确",
    "fullName": "精确用户长串id"
  },
  {
    "name": "帖子标题",
    "key": "postTitle",
    "pattern": "模糊",
    "fullName": "模糊帖子标题"
  },
  {
    "name": "帖子标题",
    "key": "postTitle_regex",
    "pattern": "正则",
    "fullName": "正则帖子标题"
  },
  {
    "name": "吧名",
    "key": "barName_precise",
    "pattern": "精确",
    "fullName": "精确吧名"
  },
  {
    "name": "吧名",
    "key": "barName",
    "pattern": "模糊",
    "fullName": "模糊吧名"
  },
  {
    "name": "吧名",
    "key": "barName_regex",
    "pattern": "正则",
    "fullName": "正则吧名"
  },
  {
    "name": "评论",
    "key": "comment",
    "pattern": "模糊",
    "fullName": "模糊评论"
  },
  {
    "name": "评论",
    "key": "comment_regex",
    "pattern": "正则",
    "fullName": "正则评论"
  },
  {
    "name": "帖子预览内容",
    "key": "postPreviewContent",
    "pattern": "模糊",
    "fullName": "模糊帖子预览内容"
  },
  {
    "name": "帖子预览内容",
    "key": "postPreviewContent_regex",
    "pattern": "正则",
    "fullName": "正则帖子预览内容"
  },
  {
    "name": "帖子id",
    "key": "postId_precise",
    "pattern": "精确",
    "fullName": "精确帖子id"
  },
  {
    "name": "热议榜词",
    "key": "hotWord",
    "pattern": "模糊",
    "fullName": "模糊热议榜词"
  },
  {
    "name": "热议榜词",
    "key": "hotWord_regex",
    "pattern": "正则",
    "fullName": "正则热议榜词"
  }
];const selectOptions = [
  {
    value: "模糊匹配",
    label: "模糊匹配",
    children: []
  },
  {
    value: "正则匹配",
    label: "正则匹配",
    children: []
  },
  {
    value: "精确匹配",
    label: "精确匹配",
    children: []
  }
];
for (const { name, key, pattern } of ruleKeyDataList) {
  switch (pattern) {
    case "模糊":
      selectOptions[0].children.push({ value: key, label: name, pattern });
      break;
    case "正则":
      selectOptions[1].children.push({ value: key, label: name, pattern });
      break;
    case "精确":
      selectOptions[2].children.push({ value: key, label: name, pattern });
      break;
    case "关联":
      selectOptions[3].children.push({ value: key, label: name, pattern });
      break;
  }
}
var localMKData = {
  selectOptions,
  getDrawerShortcutKeyGm() {
    return GM_getValue("drawer_shortcut_key_gm", "`");
  },
  isDelHomeTopCarouselGm() {
    return GM_getValue("is_del_home_top_carousel_gm", false);
  },
  isDelHomeNoticeBoardGm() {
    return GM_getValue("is_del_home_notice_board_gm", false);
  },
  isDelDownloadClientTipGm() {
    return GM_getValue("is_del_download_client_tip_gm", false);
  },
  isDelAssistantModeButtonGm() {
    return GM_getValue("is_del_assistant_mode_button_gm", false);
  },
  isDelShareButtonGm() {
    return GM_getValue("is_del_share_button_gm", false);
  },
  isDelPostFeedbackButtonGm() {
    return GM_getValue("is_del_post_feedback_button_gm", false);
  }
};var script$e = {
  data() {
    return {
      drawerShortcutKeyVal: localMKData.getDrawerShortcutKeyGm(),
      theKeyPressedKeyVal: ""
    };
  },
  methods: {
    setDrawerShortcutKeyBut() {
      const theKeyPressedKey = this.theKeyPressedKeyVal;
      const drawerShortcutKey = this.drawerShortcutKeyVal;
      if (drawerShortcutKey === theKeyPressedKey) {
        this.$message("不需要重复设置");
        return;
      }
      GM_setValue("drawer_shortcut_key_gm", theKeyPressedKey);
      this.$notify({ message: "已设置打开关闭主面板快捷键", type: "success" });
      this.drawerShortcutKeyVal = theKeyPressedKey;
    }
  },
  created() {
    eventEmitter.on("event-keydownEvent", (event) => {
      this.theKeyPressedKeyVal = event.key;
    });
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    const options = typeof script === 'function' ? script.options : script;
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
    }
    return script;
}
const __vue_script__$e = script$e;
var __vue_render__$e = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('span',[_vm._v("快捷键")])]},proxy:true}])},[_vm._v(" "),_c('div',[_vm._v("1.默认情况下，按键盘tab键上的~键为展开关闭主面板")]),_vm._v(" "),_c('div',[_vm._v("2.当前展开关闭主面板快捷键：\n      "),_c('el-tag',[_vm._v(_vm._s(_vm.drawerShortcutKeyVal))])],1),_vm._v("\n    当前按下的键\n    "),_c('el-tag',[_vm._v(_vm._s(_vm.theKeyPressedKeyVal))]),_vm._v(" "),_c('el-button',{on:{"click":_vm.setDrawerShortcutKeyBut}},[_vm._v("设置打开关闭主面板快捷键")])],1)],1)};
var __vue_staticRenderFns__$e = [];
  const __vue_inject_styles__$e = undefined;
  const __vue_component__$e = normalizeComponent(
    { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
    __vue_inject_styles__$e,
    __vue_script__$e);var script$d = {
  data() {
    return {
      visible: false,
      optionsList: [],
      dialogTitle: "",
      optionsClick: null,
      closeOnClickModal: true,
      contents: []
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
      if (this.contents.length > 0) {
        this.contents = [];
      }
    },
    handleOptionsClick(item) {
      if (this.closeOnClickModal) {
        return;
      }
      let tempBool;
      const temp = this.optionsClick(item);
      if (temp === void 0) {
        tempBool = false;
      } else {
        tempBool = temp;
      }
      this.visible = tempBool === true;
    }
  },
  created() {
    eventEmitter.on("sheet-dialog", ({
      list,
      optionsClick,
      title = "选项",
      closeOnClickModal = false,
      contents
    }) => {
      this.visible = true;
      this.optionsList = list;
      this.dialogTitle = title;
      this.optionsClick = optionsClick;
      this.closeOnClickModal = closeOnClickModal;
      if (contents) {
        this.contents = contents;
      }
    });
  }
};
const __vue_script__$d = script$d;
var __vue_render__$d = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-dialog',{attrs:{"close-on-click-modal":_vm.closeOnClickModal,"title":_vm.dialogTitle,"visible":_vm.visible,"center":"","width":"30%"},on:{"close":_vm.handleClose}},[_c('div',[_c('el-row',[_c('el-col',_vm._l((_vm.contents),function(v){return _c('div',{key:v},[_vm._v(_vm._s(v))])}),0),_vm._v(" "),_vm._l((_vm.optionsList),function(item){return _c('el-col',{key:item.label},[_c('el-button',{staticStyle:{"width":"100%"},attrs:{"title":item.title},on:{"click":function($event){return _vm.handleOptionsClick(item)}}},[_vm._v(_vm._s(item.label)+"\n          ")])],1)})],2)],1)])],1)};
var __vue_staticRenderFns__$d = [];
  const __vue_inject_styles__$d = undefined;
  const __vue_component__$d = normalizeComponent(
    { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
    __vue_inject_styles__$d,
    __vue_script__$d);const verificationInputValue = (ruleValue, type) => {
  if (type === "postId_precise") {
    if (Number.isInteger(parseInt(ruleValue))) {
      return { status: true, res: ruleValue };
    }
  }
  if (typeof ruleValue === "string") {
    ruleValue = ruleValue.trim();
  }
  if (ruleValue === null)
    return { status: false, res: "内容不能为空" };
  if (ruleValue === "") {
    return { status: false, res: "内容不能为空" };
  }
  return { status: true, res: ruleValue };
};
const addRule = (ruleValue, type) => {
  const verificationRes = verificationInputValue(ruleValue, type);
  if (!verificationRes.status) {
    return verificationRes;
  }
  const arr = GM_getValue(type, []);
  if (arr.includes(verificationRes.res)) {
    return { status: false, res: "已存在此内容" };
  }
  arr.push(verificationRes.res);
  GM_setValue(type, arr);
  return { status: true, res: "添加成功" };
};
const delRule = (type, value) => {
  const verificationRes = verificationInputValue(value, type);
  if (!verificationRes.status) {
    return verificationRes;
  }
  const res = verificationRes.res;
  const arr = GM_getValue(type, []);
  const indexOf = arr.indexOf(res);
  if (indexOf === -1) {
    return { status: false, res: "不存在此内容" };
  }
  arr.splice(indexOf, 1);
  GM_setValue(type, arr);
  return { status: true, res: "移除成功" };
};
const verificationRuleMap = (content) => {
  let parse;
  try {
    parse = JSON.parse(content);
  } catch (e) {
    alert("规则内容有误");
    return null;
  }
  const newRule = {};
  for (const key in parse) {
    if (!Array.isArray(parse[key])) {
      continue;
    }
    if (parse[key].length === 0) {
      continue;
    }
    newRule[key] = parse[key];
  }
  if (Object.keys(newRule).length === 0) {
    alert("规则内容为空");
    return null;
  }
  return newRule;
};
var ruleUtil = {
  addRule,
  batchAddRule(ruleValues, type) {
    const successList = [];
    const failList = [];
    const arr = GM_getValue(type, []);
    for (let v of ruleValues) {
      const isNumber = type === "postId_precise";
      if (isNumber && !Number.isInteger(v)) {
        failList.push(v);
        continue;
      }
      if (isNumber) {
        v = parseInt(v);
      }
      if (arr.includes(v)) {
        failList.push(v);
        continue;
      }
      arr.push(v);
      successList.push(v);
    }
    if (successList.length > 0) {
      GM_setValue(type, arr);
    }
    return {
      successList,
      failList
    };
  },
  async showDelRuleInput(type) {
    let ruleValue;
    try {
      const { value } = await eventEmitter.invoke("el-prompt", "请输入要删除的规则内容", "删除指定规则");
      ruleValue = value;
    } catch (e) {
      return;
    }
    const { status, res } = delRule(type, ruleValue);
    eventEmitter.send("el-msg", res);
    status && eventEmitter.emit("刷新规则信息", false);
  },
  getRuleContent(isToStr = true, space = 0) {
    const ruleMap = {};
    for (let ruleKeyListDatum of ruleKeyDataList) {
      const key = ruleKeyListDatum.key;
      const data = GM_getValue(key, []);
      if (data.length === 0)
        continue;
      ruleMap[key] = data;
    }
    if (isToStr) {
      return JSON.stringify(ruleMap, null, space);
    }
    return ruleMap;
  },
  overwriteImportRules(content) {
    const map = verificationRuleMap(content);
    if (map === null)
      return false;
    for (let key of Object.keys(map)) {
      const arr = map[key];
      GM_setValue(key, arr);
    }
    return true;
  },
  appendImportRules(content) {
    const map = verificationRuleMap(content);
    if (map === null)
      return false;
    for (let key of Object.keys(map)) {
      const arr = GM_getValue(key, []);
      for (let item of map[key]) {
        if (!arr.includes(item)) {
          arr.push(item);
        }
      }
      GM_setValue(key, arr);
    }
    return true;
  },
  addRulePrecisePostId(postId, tip = true) {
    const results = addRule(postId, "postId_precise");
    if (tip) {
      eventEmitter.send("el-msg", results.res);
    }
    if (results.status) {
      eventEmitter.emit("event:刷新规则信息");
    }
    return results;
  },
  findRuleItemValue(type, value) {
    return GM_getValue(type, []).find((item) => item === value) || null;
  }
};var script$c = {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    ruleInfo: {
      type: Object,
      default: () => {
        return {
          key: "ruleInfo默认key值",
          name: "ruleInfo默认name值"
        };
      }
    }
  },
  data() {
    return {
      dialogTitle: "",
      dialogVisible: false,
      inputVal: "",
      fragments: [],
      separator: ",",
      successAfterCloseVal: true
    };
  },
  methods: {
    closeHandle() {
      this.inputVal = "";
    },
    addBut() {
      if (this.fragments.length === 0) {
        this.$message.warning("未有分割项，请输入");
        return;
      }
      const { successList, failList } = ruleUtil.batchAddRule(this.fragments, this.ruleInfo.key);
      this.$alert(`成功项${successList.length}个:${successList.join(this.separator)}
                失败项${failList.length}个:${failList.join(this.separator)}
                `, "tip");
      if (successList.length > 0) {
        eventEmitter.emit("event:刷新规则信息", false);
      }
      if (successList.length > 0 && this.successAfterCloseVal) {
        this.dialogVisible = false;
      }
    }
  },
  watch: {
    dialogVisible(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.dialogVisible = val;
    },
    inputVal(val) {
      const list = [];
      for (let s of val.split(this.separator)) {
        if (s === "") continue;
        if (list.includes(s)) continue;
        s = s.trim();
        list.push(s);
      }
      this.fragments = list;
    }
  }
};
const __vue_script__$c = script$c;
var __vue_render__$c = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-dialog',{attrs:{"close-on-click-modal":false,"close-on-press-escape":false,"title":'批量添加'+_vm.ruleInfo.fullName+'-'+_vm.ruleInfo.key,"visible":_vm.dialogVisible},on:{"update:visible":function($event){_vm.dialogVisible=$event;},"close":_vm.closeHandle},scopedSlots:_vm._u([{key:"footer",fn:function(){return [_c('el-button',{on:{"click":_vm.addBut}},[_vm._v("添加")])]},proxy:true}])},[_c('el-card',{attrs:{"shadow":"never"}},[_c('el-row',[_c('el-col',{attrs:{"span":16}},[_c('div',[_vm._v("1.分割项唯一，即重复xxx，只算1个")]),_vm._v(" "),_c('div',[_vm._v("2.空项跳过")])]),_vm._v(" "),_c('el-col',{attrs:{"span":8}},[_c('el-input',{staticStyle:{"width":"200px"},scopedSlots:_vm._u([{key:"prepend",fn:function(){return [_vm._v("分隔符")]},proxy:true}]),model:{value:(_vm.separator),callback:function ($$v) {_vm.separator=$$v;},expression:"separator"}}),_vm._v(" "),_c('div',[_c('el-switch',{attrs:{"active-text":"添加成功后关闭对话框"},model:{value:(_vm.successAfterCloseVal),callback:function ($$v) {_vm.successAfterCloseVal=$$v;},expression:"successAfterCloseVal"}})],1)],1)],1)],1),_vm._v(" "),_c('el-form',[_c('el-form-item',{directives:[{name:"show",rawName:"v-show",value:(_vm.fragments.length!==0),expression:"fragments.length!==0"}],attrs:{"label":"分割项"}},[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("数量:\n            "),_c('el-tag',[_vm._v(_vm._s(_vm.fragments.length))])]},proxy:true}])},[_vm._v(" "),_vm._l((_vm.fragments),function(v){return _c('el-tag',{key:v,staticStyle:{"margin-left":"5px"}},[_vm._v(_vm._s(v))])})],2)],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"输入项"}},[_c('el-input',{attrs:{"type":"textarea"},model:{value:(_vm.inputVal),callback:function ($$v) {_vm.inputVal=$$v;},expression:"inputVal"}})],1)],1)],1)],1)};
var __vue_staticRenderFns__$c = [];
  const __vue_inject_styles__$c = undefined;
  const __vue_component__$c = normalizeComponent(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$c,
    __vue_script__$c);var script$b = {
  data() {
    return {
      show: false,
      ruleType: "",
      ruleName: "",
      ruleFullName: "",
      oldVal: "",
      newVal: ""
    };
  },
  methods: {
    okBut() {
      let tempOldVal = this.oldVal.trim();
      let tempNewVal = this.newVal.trim();
      if (tempOldVal.length === 0 || tempNewVal.length === 0) {
        this.$alert("请输入要修改的值或新值");
        return;
      }
      if (tempNewVal === tempOldVal) {
        this.$alert("新值不能和旧值相同");
        return;
      }
      const tempRuleType = this.ruleType;
      if (tempRuleType === "postId_precise") {
        tempOldVal = parseInt(tempOldVal);
        tempNewVal = parseInt(tempNewVal);
        if (isNaN(tempOldVal) || isNaN(tempNewVal)) {
          this.$alert("请输入整数数字");
          return;
        }
      }
      if (!ruleUtil.findRuleItemValue(tempRuleType, tempOldVal)) {
        this.$alert("要修改的值不存在");
        return;
      }
      if (ruleUtil.findRuleItemValue(tempRuleType, tempNewVal)) {
        this.$alert("新值已存在");
        return;
      }
      const ruleArr = GM_getValue(tempRuleType, []);
      const indexOf = ruleArr.indexOf(tempOldVal);
      ruleArr[indexOf] = tempNewVal;
      GM_setValue(tempRuleType, ruleArr);
      this.$alert(`已将旧值【${tempOldVal}】修改成【${tempNewVal}】`);
      this.show = false;
    }
  },
  watch: {
    show(newVal) {
      if (newVal === false) this.oldVal = this.newVal = "";
    }
  },
  created() {
    eventEmitter.on("event:修改规则对话框", (data) => {
      this.show = true;
      this.ruleType = data.key;
      this.ruleName = data.name;
      this.ruleFullName = data.fullName;
    });
  }
};
const __vue_script__$b = script$b;
var __vue_render__$b = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-dialog',{attrs:{"close-on-click-modal":false,"modal":false,"visible":_vm.show,"title":"修改单项规则值","width":"30%"},on:{"update:visible":function($event){_vm.show=$event;}},scopedSlots:_vm._u([{key:"footer",fn:function(){return [_c('el-button',{on:{"click":function($event){_vm.show=false;}}},[_vm._v("取消")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.okBut}},[_vm._v("确定")])]},proxy:true}])},[_vm._v("\n    "+_vm._s(_vm.ruleFullName)+"-"+_vm._s(_vm.ruleType)+"\n    "),_c('el-form',[_c('el-form-item',{attrs:{"label":"要修改的值"}},[_c('el-input',{attrs:{"clearable":"","type":"text"},model:{value:(_vm.oldVal),callback:function ($$v) {_vm.oldVal=$$v;},expression:"oldVal"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"修改后的值"}},[_c('el-input',{attrs:{"clearable":""},model:{value:(_vm.newVal),callback:function ($$v) {_vm.newVal=$$v;},expression:"newVal"}})],1)],1)],1)],1)};
var __vue_staticRenderFns__$b = [];
  const __vue_inject_styles__$b = undefined;
  const __vue_component__$b = normalizeComponent(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$b,
    __vue_script__$b);var script$a = {
  data() {
    return {
      dialogVisible: false,
      typeMap: {},
      showTags: []
    };
  },
  methods: {
    updateShowRuleTags() {
      this.showTags = GM_getValue(this.typeMap.key, []);
    },
    handleTagClose(tag, index) {
      if (tag === "") return;
      this.$confirm(`确定要删除 ${tag} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.showTags.splice(index, 1);
        GM_setValue(this.typeMap.key, this.showTags);
        this.$message.success(`已移除 ${tag}`);
        eventEmitter.send("刷新规则信息", false);
      });
    },
    closedHandle() {
      this.typeMap = {};
      this.showTags.splice(0, this.showTags.length);
    }
  },
  created() {
    eventEmitter.on("event-lookRuleDialog", (typeMap) => {
      this.typeMap = typeMap;
      this.dialogVisible = true;
      this.updateShowRuleTags();
    });
  }
};
const __vue_script__$a = script$a;
var __vue_render__$a = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-dialog',{attrs:{"close-on-click-modal":false,"close-on-press-escape":false,"fullscreen":true,"modal":false,"visible":_vm.dialogVisible,"title":"查看规则内容"},on:{"update:visible":function($event){_vm.dialogVisible=$event;},"closed":_vm.closedHandle}},[_c('el-card',{scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("规则信息")]},proxy:true}])},[_vm._v(" "),_c('el-tag',[_vm._v(_vm._s(_vm.typeMap.fullName + '|' + _vm.typeMap.key))]),_vm._v(" "),_c('el-tag',[_vm._v(_vm._s(_vm.showTags.length)+"个")])],1),_vm._v(" "),_c('el-card',_vm._l((_vm.showTags),function(item,index){return _c('el-tag',{key:index,attrs:{"closable":""},on:{"close":function($event){return _vm.handleTagClose(item,index)}}},[_vm._v("\n        "+_vm._s(item)+"\n      ")])}),1)],1)],1)};
var __vue_staticRenderFns__$a = [];
  const __vue_inject_styles__$a = undefined;
  const __vue_component__$a = normalizeComponent(
    { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
    __vue_inject_styles__$a,
    __vue_script__$a);const ruleCountList = [];
for (const item of ruleKeyDataList) {
  const key = item.key;
  ruleCountList.push({ ...item, len: GM_getValue(key, []).length });
}
var script$9 = {
  data() {
    return {
      ruleCountList
    };
  },
  methods: {
    refreshInfo(isTip = true) {
      for (let x of this.ruleCountList) {
        x.len = GM_getValue(x.key, []).length;
      }
      if (!isTip) return;
      this.$notify({ title: "tip", message: "刷新规则信息成功", type: "success" });
    },
    refreshInfoBut() {
      this.refreshInfo();
    },
    lookRuleBut(item) {
      if (item.len === 0) {
        this.$message.warning("当前规则信息为空");
        return;
      }
      eventEmitter.emit("event-lookRuleDialog", item);
    }
  },
  created() {
    this.refreshInfo(false);
    eventEmitter.on("刷新规则信息", (isTip = true) => {
      this.refreshInfo(isTip);
    });
  }
};
const __vue_script__$9 = script$9;
var __vue_render__$9 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('div',{staticClass:"el-horizontal-outside"},[_c('div',[_vm._v("基础规则信息")]),_vm._v(" "),_c('div',[_c('el-button',{on:{"click":_vm.refreshInfoBut}},[_vm._v("刷新信息")])],1)])]},proxy:true}])},[_vm._v(" "),_c('div',{staticStyle:{"display":"flex","flex-wrap":"wrap","row-gap":"2px","justify-content":"flex-start"}},_vm._l((_vm.ruleCountList),function(item){return _c('el-button',{key:item.fullName,attrs:{"size":"small"},on:{"click":function($event){return _vm.lookRuleBut(item)}}},[_vm._v("\n        "+_vm._s(item.fullName)+"\n        "),_c('el-tag',{attrs:{"effect":item.len>0?'dark':'light',"size":"mini"}},[_vm._v("\n          "+_vm._s(item.len)+"\n        ")])],1)}),1)])],1)};
var __vue_staticRenderFns__$9 = [];
  const __vue_inject_styles__$9 = undefined;
  const __vue_component__$9 = normalizeComponent(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9);const ruleInfoArr = ruleKeyDataList;
var script$8 = {
  components: { AddRuleDialog: __vue_component__$c, RuleSetValueDialog: __vue_component__$b, ViewRulesRuleDialog: __vue_component__$a, RuleInformationView: __vue_component__$9 },
  data() {
    return {
      ruleInfoArr,
      cascaderVal: ["精确匹配", "userLongId_precise"],
      cascaderOptions: localMKData.selectOptions,
      addRuleDialogVisible: false,
      addRuleDialogRuleInfo: { key: "", name: "", fullName: "" }
    };
  },
  methods: {
    handleChangeCascader(val) {
      console.log(val);
    },
    batchAddBut() {
      const [_, key] = this.cascaderVal;
      this.addRuleDialogVisible = true;
      this.addRuleDialogRuleInfo = ruleInfoArr.find((item) => item.key === key);
    },
    setRuleBut() {
      const [_, key] = this.cascaderVal;
      const typeMap = ruleInfoArr.find((item) => item.key === key);
      eventEmitter.emit("event:修改规则对话框", typeMap);
    },
    findItemAllBut() {
      const [_, key] = this.cascaderVal;
      const typeMap = ruleInfoArr.find((item) => item.key === key);
      eventEmitter.send("event-lookRuleDialog", typeMap);
    },
    delBut() {
      const [_, key] = this.cascaderVal;
      ruleUtil.showDelRuleInput(key);
      eventEmitter.emit("刷新规则信息", false);
    },
    clearItemRuleBut() {
      const [_, key] = this.cascaderVal;
      const find = ruleInfoArr.find((item) => item.key === key);
      this.$confirm(`是要清空${find.fullName}的规则内容吗？`, "tip").then(() => {
        GM_deleteValue(key);
        this.$alert(`已清空${find.fullName}的规则内容`);
      });
      eventEmitter.emit("刷新规则信息", false);
    },
    delAllBut() {
      this.$confirm("确定要删除所有规则吗？").then(() => {
        for (const x of ruleInfoArr) {
          GM_deleteValue(x.key);
        }
        this.$message.success("删除全部规则成功");
        eventEmitter.emit("刷新规则信息", false);
      });
    }
  }
};
const __vue_script__$8 = script$8;
var __vue_render__$8 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-cascader',{staticStyle:{"width":"100%"},attrs:{"options":_vm.cascaderOptions,"props":{ expandTrigger: 'hover' },"show-all-levels":true,"filterable":""},on:{"change":_vm.handleChangeCascader},model:{value:(_vm.cascaderVal),callback:function ($$v) {_vm.cascaderVal=$$v;},expression:"cascaderVal"}}),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('el-button-group',[_c('el-button',{on:{"click":_vm.batchAddBut}},[_vm._v("批量添加")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.setRuleBut}},[_vm._v("修改")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.findItemAllBut}},[_vm._v("查看项内容")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.delBut}},[_vm._v("移除")])],1),_vm._v(" "),_c('el-button-group',[_c('el-button',{attrs:{"type":"danger"},on:{"click":_vm.clearItemRuleBut}},[_vm._v("清空项")]),_vm._v(" "),_c('el-button',{attrs:{"type":"danger"},on:{"click":_vm.delAllBut}},[_vm._v("全部移除")])],1),_vm._v(" "),_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("说明")]},proxy:true}])},[_vm._v(" "),_c('div',[_vm._v("1.规则的值唯一，且不重复。")]),_vm._v(" "),_c('div',[_c('el-link',{attrs:{"href":"https://www.jyshare.com/front-end/854/","target":"_blank","type":"primary"}},[_vm._v("\n        2.正则表达式测试地址\n      ")])],1)]),_vm._v(" "),_c('RuleInformationView'),_vm._v(" "),_c('AddRuleDialog',{attrs:{"rule-info":_vm.addRuleDialogRuleInfo},model:{value:(_vm.addRuleDialogVisible),callback:function ($$v) {_vm.addRuleDialogVisible=$$v;},expression:"addRuleDialogVisible"}}),_vm._v(" "),_c('RuleSetValueDialog'),_vm._v(" "),_c('ViewRulesRuleDialog')],1)};
var __vue_staticRenderFns__$8 = [];
  const __vue_inject_styles__$8 = undefined;
  const __vue_component__$8 = normalizeComponent(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8);var script$7 = {
  data() {
    return {
      outputInfoArr: []
    };
  },
  methods: {
    clearInfoBut() {
      this.$confirm("是否清空信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.outputInfoArr = [];
        this.$notify({ title: "tip", message: "已清空信息", type: "success" });
      });
    },
    lookDataBut(row) {
      console.log(row);
    },
    addOutInfo(data) {
      const find = this.outputInfoArr.find((item) => item.msg === data.msg);
      const date =  new Date();
      const showTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      if (find) {
        find.showTime = showTime;
        if (find.msg === data.msg) {
          return;
        }
        find.data = data.data;
      } else {
        data.showTime = showTime;
        this.outputInfoArr.unshift(data);
      }
    }
  },
  created() {
    eventEmitter.on("event:print-msg", (msgData) => {
      if (typeof msgData === "string") {
        this.addOutInfo({ msg: msgData, data: null });
        return;
      }
      this.addOutInfo(msgData);
    });
  }
};
const __vue_script__$7 = script$7;
var __vue_render__$7 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-table',{attrs:{"data":_vm.outputInfoArr,"border":"","stripe":""}},[_c('el-table-column',{attrs:{"label":"显示时间","prop":"showTime","width":"80"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"msg"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('el-button',{attrs:{"type":"info"},on:{"click":_vm.clearInfoBut}},[_vm._v("清空消息")])]},proxy:true}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"操作","width":"85"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('el-tooltip',{attrs:{"content":"内容打印在控制台中"}},[_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.lookDataBut(scope.row)}}},[_vm._v("print")])],1)]}}])})],1)],1)};
var __vue_staticRenderFns__$7 = [];
  const __vue_inject_styles__$7 = undefined;
  const __vue_component__$7 = normalizeComponent(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7);var script$6 = {
  data() {
    return {
      group_url: globalValue.group_url,
      b_url: globalValue.b_url,
      github_url: globalValue.github_url,
      update_urls: [
        {
          title: "脚本猫",
          url: globalValue.scriptCat_js_url
        }
      ],
      update_log_url: globalValue.update_log_url,
      activeName: ["1", "2"]
    };
  },
  methods: {
    lookImgBut() {
      eventEmitter.send("显示图片对话框", { image: "https://www.mikuchase.ltd/img/qq_group_876295632.webp" });
    }
  }
};
const __vue_script__$6 = script$6;
var __vue_render__$6 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-collapse',{model:{value:(_vm.activeName),callback:function ($$v) {_vm.activeName=$$v;},expression:"activeName"}},[_c('el-collapse-item',{attrs:{"name":"1","title":"作者b站"}},[_c('el-link',{attrs:{"href":_vm.b_url,"target":"_blank","type":"primary"}},[_vm._v("b站传送门")])],1),_vm._v(" "),_c('el-collapse-item',{attrs:{"name":"2","title":"反馈交流群"}},[_c('el-link',{attrs:{"href":_vm.group_url,"target":"_blank","type":"primary"}},[_vm._v("====》Q群传送门《====\n      ")]),_vm._v(" "),_c('el-tooltip',{attrs:{"content":"点击查看群二维码"}},[_c('el-tag',{on:{"click":_vm.lookImgBut}},[_vm._v("876295632")])],1)],1),_vm._v(" "),_c('el-collapse-item',{attrs:{"name":"3","title":"更新地址"}},[_vm._v("\n      目前优先在脚本猫平台上更新发布\n      "),_vm._l((_vm.update_urls),function(item){return _c('div',{key:item.title},[_c('el-link',{attrs:{"href":item.url,"target":"_blank","type":"primary"}},[_vm._v(_vm._s(item.title)+"更新地址")])],1)})],2),_vm._v(" "),_c('el-collapse-item',{attrs:{"name":"4","title":"开源地址"}},[_c('div',[_vm._v("本脚本源代码已开源，欢迎大家Star或提交PR")]),_vm._v(" "),_c('el-link',{attrs:{"href":_vm.github_url,"target":"_blank","type":"primary"}},[_vm._v("github开源地址")])],1)],1)],1)};
var __vue_staticRenderFns__$6 = [];
  const __vue_inject_styles__$6 = undefined;
  const __vue_component__$6 = normalizeComponent(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6);var script$5 = {
  data() {
    return {
      list: [
        { name: "支付宝赞助", alt: "支付宝支持", src: "https://www.mikuchase.ltd/img/paymentCodeZFB.webp" },
        { name: "微信赞助", alt: "微信支持", src: "https://www.mikuchase.ltd/img/paymentCodeWX.webp" },
        { name: "QQ赞助", alt: "QQ支持", src: "https://www.mikuchase.ltd/img/paymentCodeQQ.webp" }
      ],
      dialogIni: {
        title: "打赏点猫粮",
        show: false,
        srcList: []
      }
    };
  },
  methods: {
    showDialogBut() {
      this.dialogIni.show = true;
    }
  },
  created() {
    this.dialogIni.srcList = this.list.map((x) => x.src);
  }
};
const __vue_script__$5 = script$5;
var __vue_render__$5 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('span',[_vm._v("零钱赞助")])]},proxy:true}])},[_vm._v(" "),_c('span',[_vm._v("1元不嫌少，10元不嫌多，感谢支持！")]),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('span',[_vm._v("生活不易，作者叹息")]),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('span',[_vm._v("用爱发电不容易，您的支持是我最大的更新动力")])],1),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',{staticClass:"el-vertical-center"},[_c('el-button',{attrs:{"round":"","type":"primary"},on:{"click":_vm.showDialogBut}},[_vm._v("打赏点猫粮")])],1),_vm._v(" "),_c('el-dialog',{attrs:{"title":_vm.dialogIni.title,"visible":_vm.dialogIni.show,"center":""},on:{"update:visible":function($event){return _vm.$set(_vm.dialogIni, "show", $event)}}},[_c('div',{staticClass:"el-vertical-center"},_vm._l((_vm.list),function(item){return _c('el-image',{key:item.name,staticStyle:{"height":"300px"},attrs:{"preview-src-list":_vm.dialogIni.srcList,"src":item.src}})}),1)])],1)};
var __vue_staticRenderFns__$5 = [];
  const __vue_inject_styles__$5 = undefined;
  const __vue_component__$5 = normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5);var script$4 = {
  data() {
    return {
      ruleContentImport: "",
      select: {
        val: [],
        options: []
      }
    };
  },
  methods: {
    getSelectValRuleContent() {
      const val = this.select.val;
      if (val.length === 0) return;
      const map = {};
      for (const valKey of val) {
        const find = this.select.options.find((item) => item.key === valKey);
        if (find === void 0) continue;
        const { key } = find;
        const ruleItemList = GM_getValue(key, []);
        if (ruleItemList.length === 0) continue;
        map[key] = ruleItemList;
      }
      if (Object.keys(map).length === 0) {
        this.$message.warning(`选定的规则类型都为空`);
        return false;
      }
      return map;
    },
    overwriteImportRulesBut() {
      this.$confirm("是否要覆盖导入规则？").then(() => {
        const trim = this.ruleContentImport.trim();
        if (ruleUtil.overwriteImportRules(trim)) {
          this.$alert("已覆盖导入成功！");
          eventEmitter.emit("event:刷新规则信息");
        }
      });
    },
    appendImportRulesBut() {
      this.$confirm("是否要追加导入规则？").then(() => {
        const trim = this.ruleContentImport.trim();
        if (ruleUtil.appendImportRules(trim)) {
          this.$message("已追加导入成功！");
          eventEmitter.emit("event:刷新规则信息");
        }
      });
    },
    handleFileUpload(event) {
      defUtil.handleFileReader(event).then((data) => {
        const { content } = data;
        try {
          JSON.parse(content);
        } catch (e) {
          this.$message("文件内容有误");
          return;
        }
        this.ruleContentImport = content;
        this.$message("读取到内容，请按需覆盖或追加");
      });
    },
    inputFIleRuleBut() {
      const file = this.$refs.file;
      file.click();
    },
    outToInputBut() {
      this.ruleContentImport = ruleUtil.getRuleContent();
      this.$message("已导出到输入框中");
    },
    ruleOutToFIleBut() {
      const map = this.getSelectValRuleContent();
      if (map === false) return;
      this.$prompt("请输入文件名", "保存为", {
        inputValue: "b站屏蔽器规则-指定类型-" + defUtil.toTimeString()
      }).then((res) => {
        const value = res.value;
        if (value === "" && value.includes(" ")) {
          this.$alert("文件名不能为空或包含空格");
          return;
        }
        defUtil.saveTextAsFile(JSON.stringify(map, null, 4), value + ".json");
      });
    },
    basisRuleOutToFIleBut() {
      let fileName = "b站屏蔽器规则-" + defUtil.toTimeString();
      this.$prompt("请输入文件名", "保存为", {
        inputValue: fileName
      }).then((res) => {
        const value = res.value;
        if (res.value === "" && res.value.includes(" ")) {
          this.$alert("文件名不能为空或包含空格");
          return;
        }
        defUtil.saveTextAsFile(ruleUtil.getRuleContent(true, 4), value + ".json");
      });
    },
    ruleOutToConsoleBut() {
      const map = this.getSelectValRuleContent();
      if (map === false) return;
      console.log(map);
      this.$message.info("已导出到控制台上，F12打开控制台查看");
    },
    basisRuleOutToConsoleBut() {
      console.log(ruleUtil.getRuleContent(false));
      this.$message("已导出到控制台上，F12打开控制台查看");
    }
  },
  created() {
    for (const v of ruleKeyDataList) {
      this.select.options.push(v);
    }
  }
};
const __vue_script__$4 = script$4;
var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('span',[_vm._v("导出基础规则")])]},proxy:true}])},[_vm._v(" "),_c('el-button',{on:{"click":_vm.basisRuleOutToFIleBut}},[_vm._v("导出文件")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.outToInputBut}},[_vm._v("导出编辑框")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.basisRuleOutToConsoleBut}},[_vm._v("导出控制台")])],1),_vm._v(" "),_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("导出指定规则")]},proxy:true}])},[_vm._v(" "),_c('el-select',{attrs:{"clearable":"","filterable":"","multiple":"","placeholder":"请选择导出规则类型"},model:{value:(_vm.select.val),callback:function ($$v) {_vm.$set(_vm.select, "val", $$v);},expression:"select.val"}},_vm._l((_vm.select.options),function(item){return _c('el-option',{key:item.key,attrs:{"label":item.fullName,"value":item.key}})}),1),_vm._v(" "),_c('el-button',{on:{"click":_vm.ruleOutToFIleBut}},[_vm._v("导出文件")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.ruleOutToConsoleBut}},[_vm._v("导出控制台")])],1),_vm._v(" "),_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("导入规则")]},proxy:true}])},[_vm._v(" "),_c('div',[_vm._v("仅支持json格式内容导入,且最外层为对象(花括号)")]),_vm._v(" "),_c('div',[_vm._v("内容格式为{key: [规则列表]}")]),_vm._v(" "),_c('div',[_vm._v("可以只导入指定类型规则，最外层需为对象，key为规则的内部key，value为规则列表")]),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',[_c('el-button',{on:{"click":_vm.inputFIleRuleBut}},[_vm._v("读取外部规则文件")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.overwriteImportRulesBut}},[_vm._v("覆盖导入规则")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.appendImportRulesBut}},[_vm._v("追加导入规则")])],1),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',[_c('el-input',{attrs:{"autosize":{ minRows: 10, maxRows: 50},"placeholder":"要导入的规则内容","type":"textarea"},model:{value:(_vm.ruleContentImport),callback:function ($$v) {_vm.ruleContentImport=$$v;},expression:"ruleContentImport"}})],1)],1),_vm._v(" "),_c('input',{ref:"file",staticStyle:{"display":"none"},attrs:{"accept":"application/json","type":"file"},on:{"change":_vm.handleFileUpload}})],1)};
var __vue_staticRenderFns__$4 = [];
  const __vue_inject_styles__$4 = undefined;
  const __vue_component__$4 = normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4);const isDOMElement = (obj) => {
  return obj !== null && typeof obj === "object" && "nodeType" in obj;
};
const inProgressCache =  new Map();
const validationElFun = (config, selector) => {
  const element = config.doc.querySelector(selector);
  if (element === null)
    return null;
  return config.parseShadowRoot && element.shadowRoot ? element.shadowRoot : element;
};
const __privateValidationElFun = (config, selector) => {
  const result = config.validationElFun(config, selector);
  return isDOMElement(result) ? result : null;
};
var elUtil = {
  isDOMElement,
  async findElement(selector, config = {}) {
    const defConfig = {
      doc: document,
      interval: 1e3,
      timeout: -1,
      parseShadowRoot: false,
      cacheInProgress: true,
      validationElFun
    };
    config = { ...defConfig, ...config };
    const result = __privateValidationElFun(config, selector);
    if (result !== null)
      return result;
    const cacheKey = `findElement:${selector}`;
    if (config.cacheInProgress) {
      const cachedPromise = inProgressCache.get(cacheKey);
      if (cachedPromise) {
        return cachedPromise;
      }
    }
    const p = new Promise((resolve) => {
      let timeoutId, IntervalId;
      IntervalId = setInterval(() => {
        const result2 = __privateValidationElFun(config, selector);
        if (result2 === null)
          return;
        resolve(result2);
      }, config.interval);
      const cleanup = () => {
        if (IntervalId)
          clearInterval(IntervalId);
        if (timeoutId)
          clearTimeout(timeoutId);
        if (config.cacheInProgress) {
          inProgressCache.delete(cacheKey);
        }
      };
      if (config.timeout > 0) {
        timeoutId = setTimeout(() => {
          resolve(null);
          cleanup();
        }, config.timeout);
      }
    });
    if (config.cacheInProgress) {
      inProgressCache.set(cacheKey, p);
    }
    return p;
  },
  async findElements(selector, config = {}) {
    const defConfig = { doc: document, interval: 1e3, timeout: -1, parseShadowRoot: false };
    config = { ...defConfig, ...config };
    return new Promise((resolve) => {
      const i1 = setInterval(() => {
        const els = config.doc.querySelectorAll(selector);
        if (els.length > 0) {
          const list = [];
          for (const el of els) {
            if (config.parseShadowRoot) {
              const shadowRoot = el?.shadowRoot;
              list.push(shadowRoot ? shadowRoot : el);
              continue;
            }
            list.push(el);
          }
          resolve(list);
          clearInterval(i1);
        }
      }, config.interval);
      if (config.timeout > 0) {
        setTimeout(() => {
          clearInterval(i1);
          resolve([]);
        }, config.timeout);
      }
    });
  },
  updateCssVModal() {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `.v-modal  {
    z-index: auto !important;
}`;
    document.head.appendChild(styleEl);
  },
  installStyle(cssText, selector = ".mk-def-style") {
    let styleEl = document.head.querySelector(selector);
    if (styleEl === null) {
      styleEl = document.createElement("style");
      if (selector.startsWith("#")) {
        styleEl.id = selector.substring(1);
      } else {
        styleEl.className = selector.substring(1);
      }
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = cssText;
  },
  createVueDiv(el = null, cssTests = null) {
    const panelDiv = document.createElement("div");
    if (cssTests !== null) {
      panelDiv.style.cssText = cssTests;
    }
    const vueDiv = document.createElement("div");
    panelDiv.appendChild(vueDiv);
    if (el !== null) {
      el.appendChild(panelDiv);
    }
    return { panelDiv, vueDiv };
  }
};var urlUtil = {
  parseUrl(urlString) {
    const url = new URL(urlString);
    const pathSegments = url.pathname.split("/").filter((segment) => segment !== "");
    const searchParams = new URLSearchParams(url.search.slice(1));
    const queryParams = {};
    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }
    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      pathSegments,
      search: url.search,
      queryParams,
      hash: url.hash
    };
  },
  parseUserUrlId(url) {
    const urlObj = this.parseUrl(url);
    return urlObj.queryParams.id;
  },
  parsePostUrlId(url) {
    if (!url.includes("//tieba.baidu.com/p/"))
      return -1;
    const urlObj = this.parseUrl(url);
    return parseInt(urlObj.pathSegments[1]);
  }
};var ruleMatchingUtil = {
  exactMatch(ruleList, value) {
    if (ruleList === null || ruleList === void 0)
      return false;
    if (!Array.isArray(ruleList))
      return false;
    return ruleList.some((item) => item === value);
  },
  regexMatch(ruleList, value) {
    if (ruleList === null || ruleList === void 0)
      return null;
    if (!Array.isArray(ruleList))
      return null;
    const find = ruleList.find((item) => {
      try {
        return value.search(item) !== -1;
      } catch (e) {
        return false;
      }
    });
    return find === void 0 ? null : find;
  },
  fuzzyMatch(ruleList, value) {
    if (ruleList === null || ruleList === void 0 || value === null)
      return null;
    if (!Array.isArray(ruleList))
      return null;
    const find = ruleList.find((item) => value.includes(item));
    return find === void 0 ? null : find;
  }
};const blockExactAndFuzzyMatching = (val, config) => {
  if (!val)
    return returnTempVal;
  const { exactKey, exactTypeName, fuzzyKey, fuzzyTypeName, regexKey, regexTypeName } = config;
  let matching;
  if (exactKey) {
    if (ruleMatchingUtil.exactMatch(GM_getValue(exactKey, []), val)) {
      return { state: true, type: exactTypeName, matching: val };
    }
  }
  if (fuzzyKey) {
    matching = ruleMatchingUtil.fuzzyMatch(GM_getValue(fuzzyKey, []), val);
    if (matching) {
      return { state: true, type: fuzzyTypeName, matching };
    }
  }
  if (regexKey) {
    matching = ruleMatchingUtil.regexMatch(GM_getValue(regexKey, []), val);
    if (matching) {
      return { state: true, type: regexTypeName, matching };
    }
  }
  return returnTempVal;
};
eventEmitter.on("event:插入屏蔽按钮", (itemData) => {
  const { insertionPositionEl, el } = itemData;
  let but = insertionPositionEl.querySelector("button[gz_type]");
  if (but !== null)
    return;
  but = document.createElement("button");
  but.setAttribute("gz_type", "");
  but.textContent = "屏蔽";
  but.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    {
      console.log("点击了屏蔽按钮", itemData);
    }
    eventEmitter.emit("event:mask_options_dialog_box", itemData);
  });
  insertionPositionEl.appendChild(but);
  let explicitSubjectEl = itemData?.explicitSubjectEl;
  if (explicitSubjectEl === void 0) {
    explicitSubjectEl = el;
  }
  if (insertionPositionEl) {
    but.style.display = "none";
    explicitSubjectEl.addEventListener("mouseout", () => but.style.display = "none");
    explicitSubjectEl.addEventListener("mouseover", () => but.style.display = "");
  }
});
const blockBarName = (name) => {
  return blockExactAndFuzzyMatching(name, {
    exactKey: "barName_precise",
    exactTypeName: "精确吧名",
    fuzzyKey: "barName",
    fuzzyTypeName: "模糊吧名",
    regexKey: "barName_regex",
    regexTypeName: "正则吧名"
  });
};
const blockPostTitle = (title) => {
  return blockExactAndFuzzyMatching(title, {
    fuzzyKey: "postTitle",
    fuzzyTypeName: "模糊帖子标题",
    regexKey: "postTitle_regex",
    regexTypeName: "正则帖子标题"
  });
};
const blockPreviewContent = (content) => {
  return blockExactAndFuzzyMatching(content, {
    fuzzyKey: "postPreviewContent",
    fuzzyTypeName: "模糊预览内容",
    regexKey: "postPreviewContent_regex",
    regexTypeName: "正则预览内容"
  });
};
const blockPostId = (id) => {
  if (ruleMatchingUtil.exactMatch(GM_getValue("postId_precise", []), id)) {
    return { state: true, type: "精确帖子id", matching: id };
  }
  return returnTempVal;
};
var shielding = {
  blockExactAndFuzzyMatching,
  blockUserName(name) {
    return blockExactAndFuzzyMatching(name, {
      exactKey: "username_precise",
      exactTypeName: "精确用户名",
      fuzzyKey: "username",
      fuzzyTypeName: "模糊用户名",
      regexKey: "username_regex",
      regexTypeName: "正则用户名"
    });
  },
  blockUserId(id) {
    if (ruleMatchingUtil.exactMatch(GM_getValue("userLongId_precise", []), id)) {
      return { state: true, type: "精确用户长串id", matching: id };
    }
    return returnTempVal;
  },
  shieldingItem(itemData) {
    const { userName, userLongStrId, barName, postTitle, previewContent, postId } = itemData;
    let testV;
    if (userLongStrId) {
      testV = this.blockUserId(userLongStrId);
      if (testV.state)
        return testV;
    }
    if (userName) {
      testV = this.blockUserName(userName);
      if (testV.state)
        return testV;
    }
    if (barName) {
      testV = blockBarName(barName);
      if (testV.state)
        return testV;
    }
    if (postTitle) {
      testV = blockPostTitle(postTitle);
      if (testV.state)
        return testV;
    }
    if (previewContent) {
      testV = blockPreviewContent(previewContent);
      if (testV.state)
        return testV;
    }
    testV = blockPostId(postId);
    if (testV.state)
      return testV;
    return returnTempVal;
  },
  shieldingItemDecorated(list) {
    for (const itemData of list) {
      const testResults = this.shieldingItem(itemData);
      const { state, type, matching } = testResults;
      if (state) {
        const { el, userName } = itemData;
        el.remove();
        const { postTitle } = itemData;
        eventEmitter.send("event:print-msg", `${type}规则【${matching}】屏蔽用户${userName}的帖子${postTitle}`);
        continue;
      }
      eventEmitter.emit("event:插入屏蔽按钮", itemData);
    }
  }
};const getDataList$4 = async () => {
  const els = await elUtil.findElements("#new_list>li");
  const list = [];
  for (const el of els) {
    if (el.childElementCount === 0)
      continue;
    const barNameAEl = el.querySelector(".n_name.feed-forum-link");
    const barTitleEl = el.querySelector(".title.feed-item-link");
    const previewContentEl = el.querySelector(".n_txt");
    const userAEl = el.querySelector(".post_author");
    const barName = barNameAEl.getAttribute("title");
    const barUrl = barNameAEl.href;
    const postTitle = barTitleEl.textContent.trim();
    const postUrl = barTitleEl.href;
    const previewContent = previewContentEl.textContent.trim();
    const userName = userAEl.textContent.trim();
    const userUrl = userAEl.href;
    const userLongStrId = urlUtil.parseUrl(userUrl).queryParams.id;
    const postId = urlUtil.parsePostUrlId(postUrl);
    list.push({
      insertionPositionEl: barTitleEl,
      postId,
      barName,
      userLongStrId,
      barUrl,
      postTitle,
      postUrl,
      previewContent,
      userName,
      userUrl,
      el
    });
  }
  return list;
};
var homePage = {
  isUrlPage(url = location.href, title = document.title) {
    return url === "https://tieba.baidu.com/" && title.trim() === "百度贴吧——全球领先的中文社区";
  },
  checkHomeDynamicList() {
    getDataList$4().then((list) => {
      shielding.shieldingItemDecorated(list);
    });
  },
  shieldHomeTopCarousel() {
    if (!localMKData.isDelHomeTopCarouselGm())
      return;
    elUtil.installStyle(`.top-sec.clearfix{
          display: none;
   }`, "#shield_home_top_carousel");
  },
  shieldHomeNoticeBoard() {
    if (!localMKData.isDelHomeNoticeBoardGm())
      return;
    elUtil.installStyle(`#notice_item{
          display: none;
   }`, "#shield_home_notice_board");
  }
};var script$3 = {
  data() {
    return {
      isDelHomeTopCarouselV: localMKData.isDelHomeTopCarouselGm(),
      isDelHomeNoticeBoardV: localMKData.isDelHomeNoticeBoardGm()
    };
  },
  watch: {
    isDelHomeTopCarouselV(newVal) {
      GM_setValue("is_del_home_top_carousel_gm", newVal);
      if (homePage.isUrlPage()) {
        homePage.shieldHomeTopCarousel();
      }
    },
    isDelHomeNoticeBoardV(n) {
      GM_setValue("is_del_home_notice_board_gm", n);
      if (homePage.isUrlPage()) {
        homePage.shieldHomeNoticeBoard();
      }
    }
  }
};
const __vue_script__$3 = script$3;
var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-switch',{attrs:{"active-text":"屏蔽顶部轮播图"},model:{value:(_vm.isDelHomeTopCarouselV),callback:function ($$v) {_vm.isDelHomeTopCarouselV=$$v;},expression:"isDelHomeTopCarouselV"}}),_vm._v(" "),_c('el-switch',{attrs:{"active-text":"屏蔽公告板"},model:{value:(_vm.isDelHomeNoticeBoardV),callback:function ($$v) {_vm.isDelHomeNoticeBoardV=$$v;},expression:"isDelHomeNoticeBoardV"}})],1)};
var __vue_staticRenderFns__$3 = [];
  const __vue_inject_styles__$3 = undefined;
  const __vue_component__$3 = normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3);const shieldingComment = (commentsData) => {
  const { content, userLongStrId, userName } = commentsData;
  let testV;
  if (userLongStrId) {
    testV = shielding.blockUserId(userLongStrId);
    if (testV.state)
      return testV;
  }
  if (userName) {
    testV = shielding.blockUserName(userName);
    if (testV.state)
      return testV;
  }
  if (content) {
    testV = shielding.blockExactAndFuzzyMatching(content, {
      fuzzyKey: "comment",
      fuzzyTypeName: "模糊评论内容",
      regexKey: "comment_regex",
      regexTypeName: "正则评论内容"
    });
    if (testV.state)
      return testV;
  }
  return returnTempVal;
};
var comments_shielding = {
  shieldingComments(commentsData) {
    for (let commentsDatum of commentsData) {
      const { state, type, matching } = shieldingComment(commentsDatum);
      const { el, replyList, content } = commentsDatum;
      if (state) {
        el.remove();
        eventEmitter.send("event:print-msg", `${type}规则【${matching}】屏蔽评论【${content}】`);
        continue;
      }
      eventEmitter.emit("event:插入屏蔽按钮", commentsDatum);
      if (replyList === void 0)
        continue;
      for (const replyListElement of replyList) {
        const testResults = shieldingComment(replyListElement);
        const { state: state2, type: type2, matching: matching2 } = testResults;
        if (state2) {
          const { el: el2, content: content2 } = replyListElement;
          el2.remove();
          eventEmitter.send("event:print-msg", `${type2}规则【${matching2}】屏蔽评论【${content2}】`);
          continue;
        }
        eventEmitter.emit("event:插入屏蔽按钮", replyListElement);
      }
    }
  }
};const getMidFloorList = async (el) => {
  const replyList = [];
  const replyEls = el.querySelectorAll(".core_reply_wrapper ul>li");
  for (const replyEl of replyEls) {
    if (replyEl.classList.contains("lzl_li_pager_s")) {
      continue;
    }
    const contentEl = replyEl.querySelector(".lzl_content_main");
    const replyDataFieldStr = replyEl.getAttribute("data-field");
    const insertionPositionEl = replyEl.querySelector(".lzl_content_reply");
    const userAEl = replyEl.querySelector('a[href^="/home/main?id"]');
    if (replyDataFieldStr === null) {
      console.error(el, replyEl);
      throw new Error("楼层中的data-field属性为空");
    }
    const replyDataField = JSON.parse(replyDataFieldStr.replaceAll("'", '"'));
    const { portrait } = replyDataField;
    const userLongStrId = portrait;
    const userName = userAEl.textContent.trim();
    const content = contentEl.textContent.trim();
    replyList.push({ userName, userLongStrId, el: replyEl, content, insertionPositionEl });
  }
  return replyList;
};
const waitForCommentListLoadedQueue = async (el) => {
  await new Promise((resolve) => {
    const i = setInterval(() => {
      if (el.querySelector(".core_reply_wrapper .loading_reply") === null) {
        clearInterval(i);
        resolve(null);
      }
    }, 1e3);
  });
  const replyList = await getMidFloorList(el);
  comments_shielding.shieldingComments(replyList);
};
const getDataList$3 = async () => {
  const els = await elUtil.findElements("#j_p_postlist>.l_post");
  const list = [];
  for (const el of els) {
    const dataFieldStr = el.getAttribute("data-field");
    if (dataFieldStr === null) {
      throw new Error("data-field属性为空");
    }
    const userAEl = el.querySelector("a.p_author_name");
    const contentEl = el.querySelector(".d_post_content");
    const dataField = JSON.parse(dataFieldStr);
    const author = dataField.author;
    const { user_id: userLongStrId } = author;
    const userName = userAEl.textContent.trim();
    const content = contentEl.textContent.trim();
    let replyList = [];
    if (el.querySelector(".core_reply_wrapper .loading_reply")) {
      waitForCommentListLoadedQueue(el);
    } else {
      replyList = await getMidFloorList(el);
    }
    list.push({
      userName,
      userLongStrId,
      content,
      el,
      replyList,
      insertionPositionEl: el.querySelector(".d_author")
    });
  }
  return list;
};
var postPage = {
  isUrlPage(url) {
    return url.includes("//tieba.baidu.com/p/");
  },
  checkPostCommentList() {
    getDataList$3().then((list) => {
      comments_shielding.shieldingComments(list);
    });
  },
  shieldRightFeedbackButton() {
    if (!localMKData.isDelPostFeedbackButtonGm())
      return;
    elUtil.installStyle(`.tbui_aside_fbar_button.tbui_fbar_feedback{
         display: none;
        }
        `, "#shield_post_feedback_button");
  },
  insertAddShieldingButton() {
    elUtil.findElement("#j_core_title_wrap").then((el) => {
      const but = document.createElement("button");
      but.textContent = "屏蔽";
      but.setAttribute("gz_type", "");
      el?.appendChild(but);
      but.addEventListener("click", () => {
        const postId = urlUtil.parsePostUrlId(location.href);
        const titleEl = document.querySelector("#j_core_title_wrap>.core_title_txt");
        const title = titleEl.textContent.trim();
        eventEmitter.invoke("el-confirm", `屏蔽帖子${title}吗？id=${postId}`, "添加精确帖子id").then(() => {
          ruleUtil.addRulePrecisePostId(postId);
        });
      });
    });
  }
};var pageCommon = {
  shieldDownloadClientTip() {
    if (!localMKData.isDelDownloadClientTipGm())
      return;
    elUtil.installStyle(`.app_download_box,.tbui_aside_fbar_button.tbui_fbar_down{
          display: none;
     }`, "#shield_home_download_client_tip");
  },
  shieldRightShareBut() {
    if (!localMKData.isDelShareButtonGm())
      return;
    elUtil.installStyle(`#spage-tbshare-container,.tbui_aside_fbar_button.tbui_fbar_share{
         display: none;
        }`, "#shield_home_share_button");
  },
  shieldAssistantModeBut() {
    if (!localMKData.isDelAssistantModeButtonGm())
      return;
    elUtil.installStyle(`.tbui_aside_float_bar>.tbui_fbar_auxiliaryCare{
         display: none;
        }
        `, "#shield_home_assistant_mode_button");
  }
};var script$2 = {
  data() {
    return {
      isDelDownloadClientTipV: localMKData.isDelDownloadClientTipGm(),
      isDelAssistantModeButtonV: localMKData.isDelAssistantModeButtonGm(),
      isDelShareButtonV: localMKData.isDelShareButtonGm()
    };
  },
  watch: {
    isDelDownloadClientTipV: function(n) {
      GM_setValue("is_del_download_client_tip_gm", n);
      pageCommon.shieldDownloadClientTip();
    },
    isDelAssistantModeButtonV(n) {
      GM_setValue("is_del_assistant_mode_button_gm", n);
      pageCommon.shieldAssistantModeBut();
    },
    isDelShareButtonV(n) {
      GM_setValue("is_del_share_button_gm", n);
      pageCommon.shieldRightShareBut();
    }
  }
};
const __vue_script__$2 = script$2;
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-switch',{attrs:{"active-text":"屏蔽下载客户端提示"},model:{value:(_vm.isDelDownloadClientTipV),callback:function ($$v) {_vm.isDelDownloadClientTipV=$$v;},expression:"isDelDownloadClientTipV"}}),_vm._v(" "),_c('el-switch',{attrs:{"active-text":"屏蔽辅助模式按钮"},model:{value:(_vm.isDelAssistantModeButtonV),callback:function ($$v) {_vm.isDelAssistantModeButtonV=$$v;},expression:"isDelAssistantModeButtonV"}}),_vm._v(" "),_c('el-switch',{attrs:{"active-text":"屏蔽右侧分享按钮"},model:{value:(_vm.isDelShareButtonV),callback:function ($$v) {_vm.isDelShareButtonV=$$v;},expression:"isDelShareButtonV"}})],1)};
var __vue_staticRenderFns__$2 = [];
  const __vue_inject_styles__$2 = undefined;
  const __vue_component__$2 = normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2);var script$1 = {
  components: { GeneralPageProcessingView: __vue_component__$2, HomePageProcessingView: __vue_component__$3 },
  data() {
    return {
      isDelPostFeedbackButtonV: localMKData.isDelPostFeedbackButtonGm()
    };
  },
  watch: {
    isDelPostFeedbackButtonV(n) {
      GM_setValue("is_del_post_feedback_button_gm", n);
      postPage.shieldRightFeedbackButton();
    }
  }
};
const __vue_script__$1 = script$1;
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("常规")]},proxy:true}])},[_vm._v(" "),_c('GeneralPageProcessingView')],1),_vm._v(" "),_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("首页")]},proxy:true}])},[_vm._v(" "),_c('HomePageProcessingView')],1),_vm._v(" "),_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("帖子页")]},proxy:true}])},[_vm._v(" "),_c('el-switch',{attrs:{"active-text":"屏蔽右侧我要反馈按钮"},model:{value:(_vm.isDelPostFeedbackButtonV),callback:function ($$v) {_vm.isDelPostFeedbackButtonV=$$v;},expression:"isDelPostFeedbackButtonV"}})],1)],1)};
var __vue_staticRenderFns__$1 = [];
  const __vue_inject_styles__$1 = undefined;
  const __vue_component__$1 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1);var script = {
  components: {
    RuleManagementView: __vue_component__$8,
    PanelSettingsView: __vue_component__$e,
    SheetDialog: __vue_component__$d,
    OutputInformationView: __vue_component__$7,
    AboutAndFeedbackView: __vue_component__$6,
    DonateLayoutView: __vue_component__$5,
    RuleExportImportView: __vue_component__$4,
    PageProcessingView: __vue_component__$1
  },
  data() {
    return {
      drawer: false
    };
  },
  methods: {},
  created() {
    eventEmitter.on("主面板开关", () => {
      this.drawer = !this.drawer;
    });
    document.addEventListener("keydown", (event) => {
      eventEmitter.emit("event-keydownEvent", event);
      if (event.key === "`") {
        this.drawer = !this.drawer;
      }
    });
    eventEmitter.on("el-notify", (options) => {
      if (!options["position"]) {
        options.position = "bottom-right";
      }
      this.$notify(options);
    });
    eventEmitter.on("el-msg", (...options) => {
      this.$message.apply(this, options);
    });
    eventEmitter.on("el-alert", (...options) => {
      this.$alert.apply(this, options);
    });
    eventEmitter.handler("el-confirm", (...options) => {
      return this.$confirm.apply(this, options);
    });
    eventEmitter.handler("el-prompt", (...options) => {
      return this.$prompt.apply(this, options);
    });
  }
};
const __vue_script__ = script;
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-drawer',{staticStyle:{"position":"fixed"},attrs:{"modal":false,"visible":_vm.drawer,"z-index":10006,"direction":"rtl","size":"40%","title":"贴吧内容屏蔽器"},on:{"update:visible":function($event){_vm.drawer=$event;}}},[_c('el-tabs',{attrs:{"tab-position":"left","type":"card"}},[_c('el-tab-pane',{attrs:{"label":"规则管理"}},[_c('RuleManagementView')],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"导出导入","lazy":""}},[_c('RuleExportImportView')],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"页面处理","lazy":""}},[_c('PageProcessingView')],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"输出信息"}},[_c('OutputInformationView')],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"面板设置","lazy":""}},[_c('PanelSettingsView')],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"关于反馈","lazy":""}},[_c('AboutAndFeedbackView'),_vm._v(" "),_c('DonateLayoutView')],1)],1)],1),_vm._v(" "),_c('SheetDialog')],1)};
var __vue_staticRenderFns__ = [];
  const __vue_inject_styles__ = undefined;
  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__);const getDataList$2 = async () => {
  const els = await elUtil.findElements("#ba_list>.ba_info");
  const list = [];
  for (const el of els) {
    const barUrlAEl = el.querySelector("a.ba_href");
    const barNameEl = el.querySelector(".ba_name");
    const barName = barNameEl.textContent.trim();
    const barUrl = barUrlAEl.href;
    list.push({
      barName,
      barUrl,
      el,
      insertionPositionEl: barNameEl
    });
  }
  return list;
};
var postBarClassPage = {
  isThisPage(url) {
    return url.includes("//tieba.baidu.com/f/index/forumpark");
  },
  insertShieldingButton() {
    getDataList$2().then((items) => {
      for (const item of items) {
        eventEmitter.emit("event:插入屏蔽按钮", item);
      }
    });
  }
};const getHotList = async () => {
  const els = await elUtil.findElements(".topic_list>.topic_item");
  const list = [];
  for (const el of els) {
    const titleEl = el.querySelector(".topic_name");
    const title = titleEl.textContent.trim();
    const heatEl = el.querySelector(".topic_num");
    const heatStr = heatEl.textContent.trim();
    const heat = parseInt(heatStr);
    list.push({ title, heat, el });
  }
  return list;
};
const getPostDataList = async () => {
  const els = await elUtil.findElements("li.thread-item");
  const list = [];
  for (const el of els) {
    const barNameEl = el.querySelector("a.forum-name");
    const postTitleEl = el.querySelector("a.title");
    const previewContentEl = el.querySelector(".content");
    const userNameAEl = el.querySelector(".author-info>a");
    const barName = barNameEl.textContent.trim();
    const postTitle = postTitleEl.textContent.trim();
    const postUrl = barNameEl.href;
    const postId = urlUtil.parsePostUrlId(postUrl);
    let previewContent = "";
    if (previewContentEl) {
      previewContent = previewContentEl.textContent.trim();
    }
    const userName = userNameAEl.textContent.trim();
    list.push({
      barName,
      postTitle,
      postUrl,
      previewContent,
      userName,
      el,
      postId,
      insertionPositionEl: userNameAEl.parentElement
    });
  }
  return list;
};
var hotDiscussionPage = {
  isThisPage(url) {
    return url.includes("//tieba.baidu.com/hottopic/browse/hottopic");
  },
  checkHotList() {
    getHotList().then((list) => {
      const hotWordList = GM_getValue("hotWord", []);
      const hotWord_regexList = GM_getValue("hotWord_regex", []);
      for (let item of list) {
        const { title, el } = item;
        let testV = ruleMatchingUtil.fuzzyMatch(hotWordList, title);
        if (testV) {
          el.remove();
          console.log();
          eventEmitter.send("event:print-msg", `根据模糊匹配${testV}屏蔽了热议榜【${title}】`);
          continue;
        }
        testV = ruleMatchingUtil.regexMatch(hotWord_regexList, title);
        if (testV) {
          el.remove();
          eventEmitter.send("event:print-msg", `根据正则匹配${testV}屏蔽了热议榜【${title}】`);
        }
      }
    });
  },
  checkPostList() {
    getPostDataList().then((list) => {
      shielding.shieldingItemDecorated(list);
    });
  }
};const getUserInfo = async () => {
  const userNameEl = await elUtil.findElement(".userinfo_username");
  const { un, id } = urlUtil.parseUrl(location.href).queryParams;
  const dataObj = {};
  if (id) {
    dataObj.userLongStrId = id;
  }
  if (un) {
    dataObj.userName = un;
  } else {
    dataObj.userName = userNameEl.textContent.trim();
  }
  return dataObj;
};
var userHomePage = {
  isThisPage(url) {
    return url.includes("//tieba.baidu.com/home/main");
  },
  insertAddShieldingButton() {
    elUtil.findElement(".interaction_wrap.interaction_wrap_theme1").then((el) => {
      const but = document.createElement("button");
      but.textContent = "添加屏蔽";
      but.setAttribute("gz_type", "");
      el?.appendChild(but);
      but.addEventListener("click", async () => {
        const userInfo = await getUserInfo();
        eventEmitter.emit("event:mask_options_dialog_box", userInfo);
      });
    });
  }
};var router = {
  staticRoute(title, url) {
    console.log("静态路由", title, url);
    eventEmitter.send("event:通知屏蔽");
    if (postBarClassPage.isThisPage(url)) {
      postBarClassPage.insertShieldingButton();
    }
    if (homePage.isUrlPage(url, title)) {
      homePage.shieldHomeTopCarousel();
      homePage.shieldHomeNoticeBoard();
    }
    if (postPage.isUrlPage(url)) {
      postPage.shieldRightFeedbackButton();
      hotDiscussionPage.checkHotList();
      postPage.insertAddShieldingButton();
    }
    if (hotDiscussionPage.isThisPage(url)) {
      hotDiscussionPage.checkHotList();
    }
    if (userHomePage.isThisPage(url)) {
      userHomePage.insertAddShieldingButton();
    }
    pageCommon.shieldDownloadClientTip();
    pageCommon.shieldRightShareBut();
    pageCommon.shieldAssistantModeBut();
  },
  dynamicRouting(title, url) {
    console.log("动态路由", title, url);
    eventEmitter.send("event:通知屏蔽");
    if (postBarClassPage.isThisPage(url)) {
      postBarClassPage.insertShieldingButton();
    }
  }
};const addEventListenerUrlChange = (callback) => {
  let oldUrl = window.location.href;
  setInterval(() => {
    const newUrl = window.location.href;
    if (oldUrl === newUrl)
      return;
    oldUrl = newUrl;
    const title = document.title;
    callback(newUrl, oldUrl, title);
  }, 1e3);
};
const addEventListenerNetwork = (callback) => {
  const performanceObserver = new PerformanceObserver(() => {
    const entries = performance.getEntriesByType("resource");
    const windowUrl = window.location.href;
    const winTitle = document.title;
    for (let entry of entries) {
      const url = entry.name;
      const initiatorType = entry.initiatorType;
      if (initiatorType === "img" || initiatorType === "css" || initiatorType === "link" || initiatorType === "beacon") {
        continue;
      }
      try {
        callback(url, windowUrl, winTitle, initiatorType);
      } catch (e) {
        if (e.message === "stopPerformanceObserver") {
          performanceObserver.disconnect();
          console.log("检测到当前页面在排除列表中，已停止性能观察器对象实例", e);
          break;
        }
        throw e;
      }
    }
    performance.clearResourceTimings();
  });
  performanceObserver.observe({ entryTypes: ["resource"] });
};
var watch = {
  addEventListenerUrlChange,
  addEventListenerNetwork
};var defaultStyle = `
.el-vertical-center {
    display: flex;
    justify-content: center;
}
.el-horizontal-center {
    display: flex;
    align-items: center;
}
.el-horizontal-right {
    display: flex;
    justify-content: flex-end;
}
.el-horizontal-left {
    display: flex;
    justify-content: flex-start;
}
.el-horizontal-outside {
    display: flex;
    justify-content: space-between;
    align-items: center;
}`;var gzStyle = `button[gz_type] {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    color: #F07775;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 8px;
}
button[gz_type="primary"] {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}
button[gz_type="success"] {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
}
button[gz_type="info"] {
    color: #fff;
    background-color: #909399;
    border-color: #909399;
}
button[gz_type="warning"] {
    color: #fff;
    background-color: #e6a23c;
    border-color: #e6a23c;
}
button[gz_type="danger"] {
    color: #fff;
    background-color: #f56c6c;
    border-color: #f56c6c;
}
button[border] {
    border-radius: 20px;
    padding: 12px 23px;
}
input[gz_type] {
    font-family: 'Arial', sans-serif; 
    font-size: 16px; 
    padding: 10px; 
    margin: 10px; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    outline: none; 
}
input[gz_type]:focus {
    border-color: #007bff; 
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); 
}
select {
    font-family: 'Arial', sans-serif; 
    font-size: 16px; 
    padding: 10px; 
    margin: 10px; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    outline: none; 
    background-color: white; 
    color: #333; 
}
select:focus {
    border-color: #007bff; 
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); 
}
select:disabled {
    background-color: #f1f1f1; 
    border-color: #ccc; 
    color: #888; 
}
button:hover {
    border-color: #646cff;
}
button[gz_type]:focus,
button[gz_type]:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
}
`;window.addEventListener("DOMContentLoaded", () => {
  console.log("页面元素加载完成");
  if (document.head.querySelector("#element-ui-css") === null) {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css";
    linkElement.id = "element-ui-css";
    document.head.appendChild(linkElement);
    linkElement.addEventListener("load", () => {
      console.log("element-ui样式加载完成");
    });
  }
  const { vueDiv } = elUtil.createVueDiv(document.body);
  defUtil.initVueApp(vueDiv, __vue_component__);
  router.staticRoute(document.title, window.location.href);
  watch.addEventListenerUrlChange((newUrl, oldUrl, title) => {
    router.dynamicRouting(title, newUrl);
  });
  GM_addStyle(defaultStyle);
  GM_addStyle(gzStyle);
  elUtil.updateCssVModal();
});eventEmitter.on("event:mask_options_dialog_box", (data) => {
  const { userLongStrId, userName, barName, postId } = data;
  const showList = [];
  if (userLongStrId) {
    showList.push({ label: `用户长串id精确屏蔽=${userLongStrId}`, value: "userLongId_precise" });
  }
  if (userName) {
    showList.push({ label: `用户名精确屏蔽=${userName}`, value: "username_precise" });
  }
  if (barName) {
    showList.push({ label: `吧名精确屏蔽=${barName}`, value: "barName_precise" });
  }
  if (postId) {
    showList.push({ label: `帖子id精确屏蔽=${postId}`, value: "postId_precise" });
  }
  eventEmitter.send("sheet-dialog", {
    title: "屏蔽选项",
    list: showList,
    optionsClick: (item) => {
      const { value } = item;
      let results;
      if (value === "userLongId_precise") {
        results = ruleUtil.addRule(userLongStrId, value);
      } else if (value === "username_precise") {
        results = ruleUtil.addRule(userName, value);
      } else if (value === "barName_precise") {
        results = ruleUtil.addRule(barName, value);
      } else if (value === "postId_precise") {
        results = ruleUtil.addRule(postId, value);
      } else {
        eventEmitter.send("el-msg", "出现意外的选项值");
        return;
      }
      if (results) {
        eventEmitter.emit("el-msg", results.res).emit("event:刷新规则信息", false).emit("event:通知屏蔽");
      }
    }
  });
});const getDataList$1 = async () => {
  const els = await elUtil.findElements("#thread_list>li.thread_item_box");
  const list = [];
  for (const el of els) {
    const titleAEl = el.querySelector("a.j_th_tit");
    const userEl = el.querySelector(".tb_icon_author");
    const userAEl = el.querySelector(".tb_icon_author a.frs-author-name");
    const previewContentEl = el.querySelector(".threadlist_text>div");
    const previewContent = previewContentEl.textContent.trim();
    const postTitle = titleAEl.textContent.trim();
    const postUrl = titleAEl.href;
    const postId = urlUtil.parsePostUrlId(postUrl);
    const userElTitle = userEl.getAttribute("title");
    const userATxt = userAEl.textContent;
    let userName;
    if (userATxt.endsWith("...")) {
      const localName = userElTitle.match("作者:(.*)")[1].trim();
      if (localName[0] === userATxt[0]) {
        userName = localName;
      }
    } else {
      userName = userATxt;
    }
    const userLongStrId = urlUtil.parseUserUrlId(userAEl.href);
    list.push({
      insertionPositionEl: userAEl.parentElement,
      postId,
      postUrl,
      previewContent,
      userLongStrId,
      userName,
      el,
      postTitle
    });
  }
  return list;
};
var barHomePage = {
  isThisPage(url) {
    const b = url.includes("tieba.baidu.com/f?kw=");
    if (b) {
      const parseUrl = urlUtil.parseUrl(url);
      const tab = parseUrl.queryParams.tab;
      if (tab === "album" || tab === "video") {
        return false;
      }
    }
    return b;
  },
  checkBarRecommendList() {
    getDataList$1().then((list) => {
      shielding.shieldingItemDecorated(list);
    });
  }
};const getDataList = async () => {
  const els = await elUtil.findElements(".s_post_list>.s_post");
  const list = [];
  for (const el of els) {
    const titleAel = el.querySelector(".p_title>a");
    const previewContentEl = el.querySelector(".p_content");
    const barNameEl = el.querySelector(".p_forum");
    const userAEl = el.querySelector('a[href^="/home/main?id="]');
    const postTitle = titleAel.textContent.trim();
    const postUrl = titleAel.href;
    const postId = urlUtil.parsePostUrlId(postUrl);
    const previewContent = previewContentEl.textContent.trim();
    const barName = barNameEl.textContent.trim();
    const barUrl = barNameEl.href;
    const userName = userAEl.textContent.trim();
    const userUrl = userAEl.href;
    const userLongStrId = urlUtil.parseUserUrlId(userUrl);
    list.push({
      postUrl,
      insertionPositionEl: el,
      barName,
      barUrl,
      postTitle,
      previewContent,
      postId,
      userName,
      userUrl,
      userLongStrId,
      el
    });
  }
  return list;
};
var searchPage = {
  isThisPage(url) {
    return url.includes("//tieba.baidu.com/f/search/res");
  },
  checkSearchContentList() {
    getDataList().then((list) => {
      shielding.shieldingItemDecorated(list);
    });
  }
};eventEmitter.on("event:通知屏蔽", () => {
  const url = location.href;
  const title = document.title;
  if (homePage.isUrlPage(url, title)) {
    homePage.checkHomeDynamicList();
  }
  if (postPage.isUrlPage(url)) {
    postPage.checkPostCommentList();
  }
  if (barHomePage.isThisPage(url)) {
    barHomePage.checkBarRecommendList();
  }
  if (searchPage.isThisPage(url)) {
    searchPage.checkSearchContentList();
  }
  if (hotDiscussionPage.isThisPage(url)) {
    hotDiscussionPage.checkPostList();
    hotDiscussionPage.checkHotList();
  }
});window.parseUrl = urlUtil.parseUrl;
window.addEventListener("load", () => {
  console.log("页面加载完成");
});
watch.addEventListenerNetwork((url) => {
  if (url.includes("//tieba.baidu.com/f/index/feedlist")) {
    homePage.checkHomeDynamicList();
  }
  if (url.includes("//tieba.baidu.com/hottopic/browse/getTopicRelateThread?topic_name=")) {
    hotDiscussionPage.checkPostList();
  }
  if (url.includes("//tieba.baidu.com/p/comment?tid=")) {
    console.log("评论数据加载了");
    postPage.checkPostCommentList();
  }
});})(Vue);