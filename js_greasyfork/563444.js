// ==UserScript==
// @name         B站一键备注 Rev
// @namespace    https://github.com/kaixinol
// @icon         https://www.bilibili.com/favicon.ico
// @version      2.2.1
// @license      AGPL-3.0-or-later
// @description  Bilibili一键备注用户 | B站备注功能
// @author       pxoxq
// @author       kaesinol
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @match        https://*.bilibili.com/*
// @exclude      https://message.bilibili.com/*
// ↑暂时移出……
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563444/B%E7%AB%99%E4%B8%80%E9%94%AE%E5%A4%87%E6%B3%A8%20Rev.user.js
// @updateURL https://update.greasyfork.org/scripts/563444/B%E7%AB%99%E4%B8%80%E9%94%AE%E5%A4%87%E6%B3%A8%20Rev.meta.js
// ==/UserScript==
/* 颜色常量与类常量保持不变（便于后续维护、避免破坏逻辑） */
const BPINK = "#FB7299";
const HL_COLOR = "#FB7299";
const HL_CLS = "pxoxq-memo-hl";
const GRN = "#42BB85";
const LGRN = "#12ef03";
const BBLUE = "#00AEEC";
const ORANGE = "#F85F59";
const EDT_BTN_CLS = "pxoxq-memo-edit-btn";
const EDT_IPT_CLS = "pxoxq-memo-edit-input";
const SPACE_UPNAME_CLS = "pxoxq-space-upname";
const MAX_TIMEOUT = 5;
const HELP_LINK = "https://scriptcat.org/zh-CN/script-show-page/3059";
const CONF_KEY = {
  importM: "importM",
  memoM: "memoM",
};
const IMPORT_MODES = {
  IGNOER: 0,
  OVERWRITE: 1,
  MERGE: 2,
};
const CONF_INIT = {
  importM: 0,
  memoM: 1,
};

/* 内联渐变高亮（保留原效果） */
const INLINE_HL = {
  color: "transparent",
  background:
    "linear-gradient(64deg, #1493ff, #ff00af,rgb(207, 117, 0),rgb(0, 209, 35),rgb(157, 11, 255), blue,rgb(253, 106, 22), purple)",
  backgroundClip: "text",
};

/* 统一样式：把原来各处的内联样式都放这里 */
const CM_STYLE = `
/* --- 保留并统一原先零散的样式 --- */

/* 主题相关 */
.${HL_CLS} {
  color: transparent !important;
  background: linear-gradient(64deg, #1493ff, #ff00af,rgb(207, 117, 0),rgb(0, 209, 35),rgb(157, 11, 255), blue,rgb(253, 106, 22), purple) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
}

/* 编辑按钮/输入框（保留原类名） */
.${EDT_BTN_CLS} {
  background: transparent;
  border: none;
  outline: none;
  color: ${BPINK};
  margin-left: 3px;
  cursor: pointer;
  padding: 0;
}
.${EDT_BTN_CLS}:hover {
  color: #9200fd;
}
.${EDT_IPT_CLS} {
  border: none;
  outline: none;
  padding: unset;
  color: ${BPINK};
  border-bottom: 1px solid ${BPINK};
  background: transparent;
}

/* 空间用户名样式 */
.${SPACE_UPNAME_CLS} {
  padding: 6px 24px;
  position: relative;
  border: none;
  outline: none;
  border-bottom: 2px solid ${BPINK};
  font-size: 23px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  user-select: text;
  background: transparent;
}
.${SPACE_UPNAME_CLS}.pxo-editing {
  color: ${BPINK} !important;
}

/* 夜间模式、选择样式微调（保留原逻辑） */
@supports (color: var(--Ga0)) {
  html {
    color-scheme: dark;
  }
  /* contenteditable 文本 */
  div[contenteditable="true"] {
    color: var(--Ga10) !important;
  }

  /* 搜索框 input（带 button 的） */
  div#info input:has(~ button) {
    background-color: var(--Ga10) !important;
    color: var(--Ga0) !important;
  }

  /* 主菜单 */
  #pxo-bmemo-menu {
    background: var(--Ga1) !important;
    color: var(--Ga9) !important;
    border: 1px solid var(--Ga3) !important;
    box-shadow: 0 4px 12px rgba(var(--Ga0_rgb), .6) !important;
  }

  /* 搜索盒 */
  #pxo-search-box {
    color: var(--Ga9) !important;
  }

  /* dialog */
  dialog.pxo-dialog.pxo-show {
    background: var(--Ga1) !important;
    color: var(--Ga9) !important;
  }

}

/* --- ManagerMenu（底部面板） --- */
#pxo-bmemo-menu {
  position: fixed;
  height: 46vh;
  left: 0;
  right: 0;
  bottom: -46vh; /* 隐藏状态 */
  z-index: 9999;
  background: white;
  border-top: 2px solid ${BPINK};
  /* 只在 bottom 上做过渡，避免影响内部元素 */
  transition: bottom .4s ease;
  box-sizing: border-box;
  padding: 0;
}
#pxo-bmemo-menu.pxo-open {
  bottom: 0;
}

.pxo-menu-box {
  padding: 8px;
  position: relative;
  height: 100%;
  box-sizing: border-box;
}

/* toggle 按钮 */
.pxo-toggle-btn {
  position: absolute;
  top: -30px;
  left: 20px;
  width: 50px;
  opacity: .45;
  border-radius: 6px 6px 0 0;
  user-select: none;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  color: white;
  height: 30px;
  background: ${BPINK};
  text-align: center;
  line-height: 28px;
  transition: opacity .2s ease;
}
.pxo-toggle-btn.pxo-open {
  opacity: 1;
}

/* 帮助按钮 */
.pxo-help-info { position:absolute; right:8px; top:6px; }
.pxo-help-info a { color: ${BPINK}; border: 2px solid ${BPINK}; padding: 4px 6px; display:inline-block; border-radius:3px; text-decoration:none; color:#fff; background:${BPINK}; }

/* 选项区 */
.pxo-opts { border-bottom: 1px solid #ccc; }
.pxo-mm-label { font-size: 17px; font-weight: 600; }
.pxo-memo-mode-box { display:flex; align-items:center; gap: 18px; padding:8px; font-size:16px; }

/* 搜索/导入导出区 */
.pxo-header { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px; border-bottom:1px solid #ccc; box-sizing:border-box; }
.pxo-memo-title { font-size:18px; font-weight:600; flex-grow:2; text-align:center; }
.pxo-search-box { border:1px solid #ccc; padding:6px 4px; border-radius:4px; width:200px; flex-shrink:0; display:flex; align-items:center; gap:4px; box-sizing:border-box; }
.pxo-search-input { border:none; outline:none; width:100%; font-size:16px; color:#333; padding:0 6px; background:transparent; box-sizing:border-box; }
.pxo-clear-btn { color:#ccc; font-size:16px; cursor:pointer; text-align:center; border-radius:50%; line-height:20px; border:1px solid #ccc; width:20px; height:20px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.pxo-action-btn { padding:8px 18px; border:none; outline:none; background:${BPINK}; border-radius:4px; color:white; cursor:pointer; }

/* 导入弹窗 */
.pxo-dialog { display:none; border: 1px solid #ccc; border-radius: 5px; width: 500px; box-shadow: 2px 2px 4px 3px #00000027; background:#fff; padding:12px; box-sizing:border-box; position: fixed;inset: 0;margin: auto;}
.pxo-dialog.pxo-show { display:block; }
.pxo-dialog-title { font-size:17px; font-weight:bold; margin-bottom:8px; text-align:center; }
.pxo-impt-mode-wrap { display:flex; margin-bottom:8px; font-size:16px; gap:18px; align-items:center; }
.pxo-textarea { box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; padding:10px; width:100%; resize: vertical; }

/* 底部备注列表滚动区 */
.pxo-memo-tab { height: calc(45vh - 110px); overflow-y: auto; padding: 8px; box-sizing:border-box; }

/* 单条备注项（卡片式） */
.pxo-memo-row {
  display: flex;
  align-items: center;
  row-gap: 15px;
  column-gap: 40px;
  width: 45%;
  min-width: 410px;
  flex-wrap: wrap;
  padding: 8px 18px;
  border: 1px solid #e9e9e9;
  border-radius: 5px;
  margin: 5px;
  box-shadow: 1px 1px 2px 1px #00000017;
  box-sizing: border-box;
}
.pxo-avatar { border-radius: 50%; overflow: hidden; box-shadow: 1px 1px 3px 2px #00000021; flex-shrink:0; width:50px; height:50px; display:flex; align-items:center; justify-content:center; }
.pxo-avatar img { width:50px; height:50px; display:block; }
.pxo-fake-avatar { width:50px; height:50px; text-align:center; line-height:48px; user-select: none; background: linear-gradient(45deg, ${BPINK}, blue); color: white; font-size:24px; font-weight:600; }
.pxo-label { font-size:12px; color:#a1a0a0; margin-bottom:9px; }

/* 昵称列 */
.pxo-nickname { min-width:60px; max-width:110px; overflow: hidden; flex-shrink:0; }
.pxo-nickname a { font-size:15px; color:${BBLUE}; display:block; text-decoration:none; }

/* 备注输入（不可编辑态） */
.pxo-memo-input {
  border:none; outline:none; font-size:15px; width:120px; color: ${BPINK}; background:transparent;
}

/* 小标签样式 */
.pxo-val { font-size: 15px; }

/* --- 过渡 utilities （用于展开/收起/尺寸过渡） --- */
/* 使用 CSS 变量 --pxo-w --pxo-h --pxo-pad 来控制尺寸；JS 只修改这些变量或切换类 */
.pxo-transition {
  width: var(--pxo-w, 0);
  max-width: var(--pxo-max-w, none);
  height: var(--pxo-h, auto);
  padding: var(--pxo-pad, 0);
  overflow: hidden;
  box-sizing: border-box;
  transition: width .3s linear, padding .25s linear, height .25s linear;
  display: inline-block;
  vertical-align: middle;
}

/* 快速过渡（短些） */
.pxo-fast-trans {
  transition: all 0.2s linear !important;
}

/* 布局帮助类 */
.pxo-flex { display: flex; }
.pxo-inline { display: inline-block; }
.pxo-hidden { display: none !important; }
`;

/* ---------- 工具函数（保持原有逻辑） ---------- */
async function asyncGetNodeOnce(selector, root, callback) {
  root = root || document;
  return new Promise((resolve, reject) => {
    elmGetter.each(selector, root, (node) => {
      if (callback) callback(node);
      resolve(node);
      return false;
    });
  });
}

function pxolog(msg, title = "pxoxq") {
  if (typeof msg == "string" || typeof msg == "number") {
    console.log(
      `%c${title}: %c${msg}`,
      "background:#000;color:white;",
      `color:${BPINK};`,
    );
  } else {
    console.log(
      `%c${title}: %c`,
      "background:#000;color:white;",
      `color:${BPINK};`,
      msg,
    );
  }
}
function isSameNode(a, b, excludeAtts = []) {
  const aAtts = Array.from(a.attributes).filter(
    (aa) => !excludeAtts.includes(aa.name),
  );
  const bAtts = Array.from(b.attributes).filter(
    (bb) => !excludeAtts.includes(bb.name),
  );
  if (!excludeAtts.includes("innerText") && a.innerText !== b.innerText) {
    return false;
  }
  if (!excludeAtts.includes("innerHTML") && a.innerHTML !== b.innerHTML) {
    return false;
  }
  if (aAtts.length !== bAtts.length) {
    return false;
  }
  for (let i = 0; i < aAtts.length; i++) {
    const attName = aAtts[i].name;
    if (a.attributes[attName].value !== b.attributes[attName].value) {
      return false;
    }
  }
  return true;
}

class NodeSet {
  constructor({ arr = [], excludeAtts = [] }) {
    this._set = Array.from(arr);
    this.mp = new WeakMap();
    this._removeSame();
    this.excludeAtts = excludeAtts;
  }
  has(node) {
    if (this._set.includes(node)) {
      const _node = this.mp.get(node);
      return isSameNode(node, _node, this.excludeAtts);
    } else {
      return false;
    }
  }

  add(node) {
    if (!this.has(node)) {
      !this._set.includes(node) && this._set.push(node);
      this.mp.set(node, node.cloneNode(true));
    }
  }

  remove(node) {
    if (this.has(node)) {
      this._set = this._set.filter(
        (item) => !isSameNode(node, item, this.excludeAtts),
      );
      this.mp.delete(node);
    }
  }
  _removeSame() {
    this._set = this._set.filter((item, idx) => {
      const i = this._set.indexOf(item);
      return i === idx;
    });
    this._set.forEach((item) => {
      this.mp.set(item, item.cloneNode(true));
    });
  }
}

/* elmGetter 保持不变（原有 DOM 检测/观察器） */
var elmGetter = (function () {
  const win = window.unsafeWindow || document.defaultView || window;
  const doc = win.document;
  const listeners = new WeakMap();
  let mode = "css";
  let $;
  const elProto = win.Element.prototype;
  const matches =
    elProto.matches ||
    elProto.matchesSelector ||
    elProto.webkitMatchesSelector ||
    elProto.mozMatchesSelector ||
    elProto.oMatchesSelector;
  const MutationObs =
    win.MutationObserver ||
    win.WebkitMutationObserver ||
    win.MozMutationObserver;
  function addObserver(target, callback) {
    const observer = new MutationObs((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          callback(mutation.target);
          if (observer.canceled) return;
        }
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) callback(node);
          if (observer.canceled) return;
        }
      }
    });
    observer.canceled = false;
    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    return () => {
      observer.canceled = true;
      observer.disconnect();
    };
  }
  function addFilter(target, filter) {
    let listener = listeners.get(target);
    if (!listener) {
      listener = {
        filters: new Set(),
        remove: addObserver(target, (el) =>
          listener.filters.forEach((f) => f(el)),
        ),
      };
      listeners.set(target, listener);
    }
    listener.filters.add(filter);
  }
  function removeFilter(target, filter) {
    const listener = listeners.get(target);
    if (!listener) return;
    listener.filters.delete(filter);
    if (!listener.filters.size) {
      listener.remove();
      listeners.delete(target);
    }
  }
  function query(all, selector, parent, includeParent, curMode) {
    switch (curMode) {
      case "css":
        const checkParent = includeParent && matches.call(parent, selector);
        if (all) {
          const queryAll = parent.querySelectorAll(selector);
          return checkParent ? [parent, ...queryAll] : [...queryAll];
        }
        return checkParent ? parent : parent.querySelector(selector);
      case "jquery":
        let jNodes = $(includeParent ? parent : []);
        jNodes = jNodes.add([...parent.querySelectorAll("*")]).filter(selector);
        if (all) return $.map(jNodes, (el) => $(el));
        return jNodes.length ? $(jNodes.get(0)) : null;
      case "xpath":
        const ownerDoc = parent.ownerDocument || parent;
        selector += "/self::*";
        if (all) {
          const xPathResult = ownerDoc.evaluate(
            selector,
            parent,
            null,
            7,
            null,
          );
          const result = [];
          for (let i = 0; i < xPathResult.snapshotLength; i++) {
            result.push(xPathResult.snapshotItem(i));
          }
          return result;
        }
        return ownerDoc.evaluate(selector, parent, null, 9, null)
          .singleNodeValue;
    }
  }
  function isJquery(jq) {
    return jq && jq.fn && typeof jq.fn.jquery === "string";
  }
  function getOne(selector, parent, timeout) {
    const curMode = mode;
    return new Promise((resolve) => {
      const node = query(false, selector, parent, false, curMode);
      if (node) return resolve(node);
      let timer;
      const filter = (el) => {
        const node = query(false, selector, el, true, curMode);
        if (node) {
          removeFilter(parent, filter);
          timer && clearTimeout(timer);
          resolve(node);
        }
      };
      addFilter(parent, filter);
      if (timeout > 0) {
        timer = setTimeout(() => {
          removeFilter(parent, filter);
          resolve(null);
        }, timeout);
      }
    });
  }
  return {
    get currentSelector() {
      return mode;
    },
    get(selector, ...args) {
      let parent = (typeof args[0] !== "number" && args.shift()) || doc;
      if (mode === "jquery" && parent instanceof $) parent = parent.get(0);
      const timeout = args[0] || 0;
      if (Array.isArray(selector)) {
        return Promise.all(selector.map((s) => getOne(s, parent, timeout)));
      }
      return getOne(selector, parent, timeout);
    },
    each(selector, ...args) {
      let parent = (typeof args[0] !== "function" && args.shift()) || doc;
      if (mode === "jquery" && parent instanceof $) parent = parent.get(0);
      const callback = args[0];
      const curMode = mode;
      const refs = new WeakSet();
      for (const node of query(true, selector, parent, false, curMode)) {
        refs.add(curMode === "jquery" ? node.get(0) : node);
        if (callback(node, false) === false) return;
      }
      const filter = (el) => {
        for (const node of query(true, selector, el, true, curMode)) {
          const _el = curMode === "jquery" ? node.get(0) : node;
          if (refs.has(_el)) break;
          refs.add(_el);
          if (callback(node, true) === false) {
            return removeFilter(parent, filter);
          }
        }
      };
      addFilter(parent, filter);
    },
    feach(selector, opt, ...args) {
      const { excludeAtts = [] } = opt;
      let parent = (typeof args[0] !== "function" && args.shift()) || doc;
      if (mode === "jquery" && parent instanceof $) parent = parent.get(0);
      const callback = args[0];
      const curMode = mode;
      const refs = new NodeSet({ excludeAtts });
      for (const node of query(true, selector, parent, false, curMode)) {
        refs.add(curMode === "jquery" ? node.get(0) : node);
        if (callback(node, false) === false) return;
      }
      const filter = (el) => {
        for (const node of query(true, selector, el, true, curMode)) {
          const _el = curMode === "jquery" ? node.get(0) : node;
          if (refs.has(_el)) break;
          refs.add(_el);
          if (callback(node, true) === false) {
            return removeFilter(parent, filter);
          }
        }
      };
      addFilter(parent, filter);
    },
    create(domString, ...args) {
      const returnList = typeof args[0] === "boolean" && args.shift();
      const parent = args[0];
      const template = doc.createElement("template");
      template.innerHTML = domString;
      const node = template.content.firstElementChild;
      if (!node) return null;
      parent ? parent.appendChild(node) : node.remove();
      if (returnList) {
        const list = {};
        node.querySelectorAll("[id]").forEach((el) => (list[el.id] = el));
        list[0] = node;
        return list;
      }
      return node;
    },
    selector(desc) {
      switch (true) {
        case isJquery(desc):
          $ = desc;
          return (mode = "jquery");
        case !desc || typeof desc.toLowerCase !== "function":
          return (mode = "css");
        case desc.toLowerCase() === "jquery":
          for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
            if (isJquery(jq)) {
              $ = jq;
              break;
            }
          }
          return (mode = $ ? "jquery" : "css");
        case desc.toLowerCase() === "xpath":
          return (mode = "xpath");
        default:
          return (mode = "css");
      }
    },
  };
})();

/* 其他工具（保留） */
function fixUrl(url) {
  const currUrl = new URL(window.location.href);
  if (url.startsWith("//")) {
    return `${currUrl.protocol}${url}`;
  } else if (url.startsWith("/")) {
    return `${currUrl.origin}${url}`;
  } else {
    return url;
  }
}
function dateTimeNow() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}_${hour}:${minute}`;
}

/* 数据模型与服务（保持不变） */
class BMemo {
  constructor(bid, nickname, memo, avatar, info = "") {
    this.bid = bid;
    this.nickname = nickname;
    this.memo = memo;
    this.avatar = avatar;
    this.info = info;
  }
}

class MemoService {
  static getCllKey(bid) {
    return `bmemo${String(bid)[0]}`;
  }

  static getMemo({ bid = "", nickname = "" }) {
    if (bid) {
      const memo = this.getMemoByid(bid);
      if (nickname && memo && memo.nickname !== nickname) {
        memo.nickname = nickname;
        this.setMemo(memo);
      }
      return memo;
    } else if (nickname) {
      return this.getMemoByNickname(nickname);
    } else {
      return "";
    }
  }

  static getMemoByid(bid) {
    const memos = GM_getValue(this.getCllKey(bid), {});
    return memos[bid] || "";
  }

  static getMemoByNickname(nickname) {
    for (let i = 1; i < 10; i++) {
      const memos = GM_getValue(`bmemo${i}`, {});
      for (const bid in memos) {
        if (memos[bid].nickname === nickname) {
          return memos[bid];
        }
      }
    }
    return "";
  }

  static setMemo(memo) {
    const ckey = this.getCllKey(memo.bid);
    const memos = GM_getValue(ckey, {});
    memos[memo.bid] = { ...memos[memo.bid], ...memo };
    GM_setValue(ckey, memos);
  }

  static deleteMemo(bid) {
    const ckey = this.getCllKey(bid);
    const memos = GM_getValue(ckey, {});
    delete memos[bid];
    GM_setValue(ckey, memos);
  }

  static getAllMemos() {
    let memos = {};
    for (let i = 1; i < 10; i++) {
      const memo = GM_getValue(`bmemo${i}`, {});
      Object.assign(memos, memo);
    }
    return memos;
  }
}

class ConfService {
  static getConf(key) {
    const conf = GM_getValue("bmemoConf", {});
    return conf[key] || null;
  }

  static setConf(key, value) {
    const conf = GM_getValue("bmemoConf", {});
    conf[key] = value;
    GM_setValue("bmemoConf", conf);
  }

  static getAllConf() {
    return GM_getValue("bmemoConf", null);
  }
}

class BMemoUtils {
  static getUserShow({ nickname, memo }) {
    if (!memo) {
      return nickname;
    }
    return this.userNameShow({ nickname, memo }) || nickname;
  }

  static userNameShow({ nickname, memo }) {
    const mMode = ConfService.getConf(CONF_KEY.memoM) ?? CONF_INIT.memoM;
    if (mMode == 0) {
      return "";
    } else if (mMode == 1) {
      return `${memo}(${nickname})`;
    } else if (mMode == 2) {
      return `${nickname}(${memo})`;
    } else if (mMode == 3) {
      return memo;
    }
  }

  static saveMemo({ bid, nickname, memo, avatar = "", info = "" }) {
    if (bid && nickname) {
      if (memo) {
        MemoService.setMemo({ bid, nickname, memo, avatar, info });
        return 1;
      } else {
        MemoService.deleteMemo(bid);
        return -1;
      }
    }
    return 0;
  }

  static importMemos(memos, mode) {
    const dataStatus = testData(memos);
    if (!dataStatus) {
      return null;
    } else {
      let failCnt = 0;
      let successCnt = 0;

      if (dataStatus == 1) {
        memos.forEach((memo) => {
          const bid = memo.bid || "";
          const nickname = memo.nick_name || "";
          const mm = memo.bname || "";
          if (bid && mm) {
            saveOneM({ bid, nickname, memo: mm });
            successCnt++;
          } else {
            failCnt++;
          }
        });
      } else if (dataStatus == 2) {
        for (const k in memos) {
          const memo = memos[k];
          const bid = memo.bid || "";
          const nickname = memo.nickname || "";
          const mm = memo.memo || "";
          const avatar = memo.avatar || "";
          if (bid && mm) {
            saveOneM({ bid, nickname, memo: mm, avatar });
            successCnt++;
          } else {
            failCnt++;
          }
        }
      }
      return { successCnt, failCnt };
    }

    function saveOneM(memo) {
      if (mode == 1) {
        BMemoUtils.saveMemo(memo);
      } else {
        const _memo = MemoService.getMemoByid(memo.bid);
        if (_memo) {
          if (mode == 2) {
            BMemoUtils.saveMemo({ ..._memo, ...memo });
          }
        } else {
          BMemoUtils.saveMemo(memo);
        }
      }
    }

    function testData(data) {
      if (Array.isArray(data)) {
        for (let d of data) {
          if (typeof d != "object") {
            alert("数据列表中数据项格式错误");
            return 0;
          }
        }
        return 1;
      } else if (typeof data == "object") {
        for (const k in data) {
          if (typeof data[k] != "object") {
            alert("数据列表中数据项格式错误");
            return 0;
          }
        }
        return 2;
      } else {
        alert("数据格式错误");
        return 0;
      }
    }
  }
}

/* UI 类：对 DOM 的构建与事件处理保持原有逻辑，仅把内联样式替换为 class / --pxo-* 变量控制 */
class BSpaceUI {
  static init() {
    this.nicknameHandler();
    this.favideosHandler();

    // 优化：记录当前 URL，只有 URL 变化或页面内容显著增加时才触发
    let lastHref = "";
    setInterval(() => {
      if (location.href.includes("/relation/") && location.href !== lastHref) {
        this.relationsHandler();
        // 如果是为了监听滚动加载，这里不更新 lastHref，或者结合 IntersectionObserver
      }
    }, 2000);
  }

  static async relationsHandler() {
    // 1. 一次性获取所有未处理的节点，转换为数组
    const users = Array.from(
      document.querySelectorAll(
        ".relation-content .items .item .relation-card-info > a:not([data-processed])",
      ),
    );

    if (users.length === 0) return;

    // 2. 批量同步标记，防止重复进入
    users.forEach((u) => (u.dataset.processed = "true"));

    // 3. 优化处理逻辑：将耗时的 DOM 读取和写入分离
    for (const user of users) {
      const card = user.closest(".relation-card");
      const bid = user.href.match(/space\.bilibili\.com\/(\d+)/)[1];
      const nickname = user.innerText;

      const memo = MemoService.getMemoByid(bid);
      if (!memo) continue;

      // 同步构造新节点
      const nameDiv = document.createElement("a");
      nameDiv.classList.add("pxo-fast-trans", HL_CLS);
      nameDiv.href = user.href;
      nameDiv.innerText = BMemoUtils.getUserShow({
        nickname,
        memo: memo.memo,
      });

      // 立即替换（尽量减少对布局的影响）
      user.style.display = "none";
      user.after(nameDiv);

      // 异步更新数据（头像等），不阻塞 UI 渲染
      this.updateMemoData(card, bid, nickname, memo);
    }
  }

  // 将头像检查等异步逻辑抽离，不干扰主循环
  static async updateMemoData(card, bid, nickname, oldMemo) {
    try {
      const img = card.querySelector(".relation-card-avatar picture img");
      const avatar = img?.src || "";

      if (oldMemo.nickname !== nickname || oldMemo.avatar !== avatar) {
        BMemoUtils.saveMemo({ ...oldMemo, nickname, avatar });
      }
    } catch (e) {
      console.error("Update memo failed", e);
    }
  }

  static nicknameHandler() {
    elmGetter.each(
      "div.upinfo__main > div.upinfo-detail > div.upinfo-detail__top > div.nickname",
      async (user) => {
        const nickname = user.innerText;
        const bid = new URL(location.href)?.pathname?.split("/")?.[1];
        let avatar = "";
        const aImg = await asyncGetNodeOnce(
          `div.upinfo__main > div.upinfo-avatar .b-avatar picture > img`,
        );
        if (aImg) {
          avatar = aImg.src;
        }
        const mInput = document.createElement("div");
        mInput.classList.add(SPACE_UPNAME_CLS);
        mInput.contentEditable = false;
        let memo = MemoService.getMemo({ bid, nickname });
        let nameShow = BMemoUtils.getUserShow({ memo: memo?.memo, nickname });
        mInput.innerText = nameShow;
        mInput.title = nameShow;
        let isSaving = false;
        if (memo) {
          mInput.classList.add(HL_CLS);
          if (memo.nickname != nickname || memo.avatar != avatar) {
            memo = { ...memo, nickname, avatar };
            BMemoUtils.saveMemo(memo);
          }
        } else {
          mInput.classList.remove(HL_CLS);
        }
        mInput.addEventListener("click", () => {
          if (!mInput.contentEditable || mInput.contentEditable == "false") {
            memo = MemoService.getMemo({ bid, nickname });
            mInput.contentEditable = true;
            mInput.focus();
            mInput.classList.remove(HL_CLS);
            mInput.classList.add("pxo-editing");
            mInput.innerText = memo?.memo ? memo.memo : nickname;
          }
        });
        mInput.addEventListener("blur", () => {
          if (!isSaving) {
            handleSave();
          }
        });
        mInput.addEventListener("keydown", (e) => {
          if (e.code === "Enter") {
            isSaving = true;
            mInput.style.display = "none";
            handleSave();
          }
        });
        user.insertAdjacentElement("beforebegin", mInput);
        user.remove();
        function handleSave() {
          mInput.contentEditable = false;
          mInput.classList.remove("pxo-editing");
          let m = mInput?.innerText?.trim();
          m = m == nickname ? "" : m;
          let _memo = new BMemo(bid, nickname, m, avatar);
          memo = _memo;
          const res = BMemoUtils.saveMemo(_memo);
          if (res == 1) {
            mInput.classList.add(HL_CLS);
            nameShow = BMemoUtils.userNameShow({ nickname, memo: _memo.memo });
            mInput.innerText = nameShow;
            mInput.title = nameShow;
          } else {
            mInput.classList.remove(HL_CLS);
            mInput.innerText = nickname;
            mInput.title = nickname;
          }
          isSaving = false;
        }
      },
    );
  }
  static favideosHandler() {
    elmGetter.each(
      ".fav-list-main .items div.bili-video-card__subtitle > a",
      async (user) => {
        const bid = new URL(user.href)?.pathname?.split("/")?.pop();
        const contentSpan = user.querySelector("div:nth-child(2) > span");
        let contentL = contentSpan.innerText.split(" · ");
        const nickname = contentL[0];
        const memo = MemoService.getMemo({ bid, nickname });
        if (memo) {
          const nameShow = BMemoUtils.getUserShow({
            nickname,
            memo: memo?.memo,
          });
          contentSpan.innerHTML = `${nameShow} · ${contentL[1]}`;
          contentSpan.classList.add(HL_CLS);
        } else {
          contentSpan.classList.remove(HL_CLS);
        }
      },
    );
  }
}

class IndexUI {
  static init() {
    this.vCardHandler();
    this.favideosHandler();
    this.dynamicHandler();
    this.historyHandler();
  }
  static vCardHandler() {
    elmGetter.each(
      "#i_cecream div.container.is-version8 div.bili-video-card__info div.bili-video-card__info--bottom > a",
      async (user) => {
        const unameSpan = user.querySelector(
          "span.bili-video-card__info--author",
        );
        const bid = new URL(user.href)?.pathname?.split("/")?.[1];
        const nickname = unameSpan.innerText;
        const memo = MemoService.getMemo({ bid, nickname });
        if (memo) {
          const nameShow = BMemoUtils.getUserShow({
            nickname,
            memo: memo?.memo,
          });
          unameSpan.innerHTML = nameShow;
          unameSpan.title = nameShow;
          unameSpan.classList.add(HL_CLS);
        } else {
          unameSpan.classList.remove(HL_CLS);
        }
      },
    );
  }
  static dynamicHandler() {
    elmGetter.each(
      "#biliHeaderDynScrollCon div.header-content-panel  div.header-dynamic__box--center div.dynamic-name-line div > a",
      async (user) => {
        const bid = new URL(user.href)?.pathname?.split("/")?.[1];
        const nickname = user.innerText;
        let avatar = "";
        const wrap = user.closest(".header-dynamic-container");
        const aImg = await asyncGetNodeOnce(
          ".header-dynamic-avatar .bili-avatar img",
          wrap,
        );
        if (aImg) {
          avatar = fixUrl(aImg.dataset.src);
        }
        let memo = MemoService.getMemo({ bid, nickname });
        if (memo) {
          const nameShow = BMemoUtils.getUserShow({
            nickname,
            memo: memo?.memo,
          });
          user.innerHTML = nameShow;
          user.title = nameShow;
          user.classList.add(HL_CLS);

          if (memo.nickname != nickname || avatar != memo.avatar) {
            memo = { ...memo, nickname, avatar };
            BMemoUtils.saveMemo(memo);
          }
        } else {
          user.classList.remove(HL_CLS);
        }
      },
    );
  }
  static favideosHandler() {
    elmGetter.feach(
      "#favorite-content-scroll > a > div.header-fav-card__info > span",
      { excludeAtts: ["title", "innerText", "innerHTML"] },
      async (user) => {
        const bid = new URL(fixUrl(user.getAttribute("href")))?.pathname?.split(
          "/",
        )?.[1];
        const nameSpan = user.querySelector("span");
        const nickname = nameSpan.innerText;
        const memo = MemoService.getMemo({ bid, nickname });
        if (memo) {
          const nameShow = BMemoUtils.getUserShow({
            nickname,
            memo: memo?.memo,
          });
          nameSpan.innerText = nameShow;
          nameSpan.title = nameShow;
          nameSpan.classList.add(HL_CLS);
        } else {
          nameSpan.classList.remove(HL_CLS);
        }
      },
    );
  }
  static historyHandler() {
    elmGetter.each(
      "ul.right-entry .header-tabs-panel__content a .header-history-card__info .header-history-card__info--name",
      async (user) => {
        const nameSpan = user.querySelector("span");
        let bid = user.href
          ? new URL(user.href)?.pathname?.split("/")?.[1]
          : "";
        const nickname = nameSpan.innerText;
        const memo = MemoService.getMemo({ bid, nickname });
        if (memo) {
          const nameShow = BMemoUtils.getUserShow({
            nickname,
            memo: memo?.memo,
          });
          nameSpan.innerText = nameShow;
          nameSpan.title = nameShow;
          nameSpan.classList.add(HL_CLS);
        } else {
          nameSpan.classList.remove(HL_CLS);
        }
      },
    );
  }
}

class VideoPlayUI {
  static init() {
    setTimeout(() => {
      this.upHandler();
    }, 1800);
    this.rcmdHandler();
    this.commentUserHander();
  }
  static upHandler() {
    elmGetter.each(
      "#mirror-vdcon .right-container .up-panel-container .up-info-container .up-info--right .up-info__detail .up-detail-top > a:nth-child(1)",
      async (user) => {
        const bid = new URL(user.href)?.pathname?.split("/")?.[1];
        const nickname = user.innerText;
        let avatar = "";
        const aImg = await asyncGetNodeOnce(
          ".up-info--left img",
          user.closest(".up-info-container"),
        );
        if (aImg) {
          avatar = aImg.src;
        }

        const mInput = document.createElement("div");
        mInput.classList.add("pxo-transition");
        // 初始收起
        mInput.style.setProperty("--pxo-w", "0px");
        mInput.style.setProperty("--pxo-h", "0px");
        mInput.style.setProperty("--pxo-pad", "0");
        mInput.contentEditable = true;

        const mBtn = document.createElement("button");
        mBtn.innerText = "备注";
        mBtn.classList.add(EDT_BTN_CLS);
        mBtn.style.fontSize = "15px";
        mBtn.style.marginRight = "4px";

        user.classList.add("pxo-fast-trans");
        let memo = MemoService.getMemo({ bid, nickname });
        let nameShow;
        if (memo) {
          nameShow = BMemoUtils.getUserShow({ nickname, memo: memo?.memo });
          user.innerText = nameShow;
          user.classList.add(HL_CLS);

          if (nickname != memo.nickname || avatar != memo.avatar) {
            memo = { ...memo, nickname, avatar };
            BMemoUtils.saveMemo(memo);
          }
        } else {
          user.classList.remove(HL_CLS);
        }

        mBtn.addEventListener("click", () => {
          if (mBtn.innerText === "备注") {
            memo = MemoService.getMemo({ bid, nickname });
            user.style.display = "none";
            mInput.contentEditable = true;
            mInput.focus();
            mInput.innerText = memo?.memo ? memo.memo : nickname;
            // 展开 input
            mInput.style.setProperty("--pxo-w", "auto");
            mInput.style.setProperty("--pxo-h", "auto");
            mInput.style.setProperty("--pxo-pad", "2px 5px");
            // 收起 username
            user.style.setProperty("--pxo-w", "0px");
            mBtn.innerText = "保存";
          } else {
            handleSave();
            user.style.display = "block";
          }
        });
        mInput.addEventListener("keydown", (e) => {
          if (e.code == "Enter") {
            handleSave();
            user.style.display = "block";
            mInput.style.display = "none";
          }
        });
        mInput.addEventListener("blur", () => {
          if (!mInput.readOnly) {
            handleSave();
            user.style.display = "block";
          }
        });

        function handleSave() {
          mInput.contentEditable = false;
          mBtn.innerText = "备注";
          // 收起 input
          mInput.style.setProperty("--pxo-w", "0px");
          mInput.style.setProperty("--pxo-h", "0px");
          mInput.style.setProperty("--pxo-pad", "0");
          // 恢复用户名显示
          user.style.setProperty("--pxo-w", "auto");
          let m = mInput?.innerText?.trim();
          m = m == nickname ? "" : m;
          let _memo = new BMemo(bid, nickname, m, avatar);
          memo = _memo;
          const res = BMemoUtils.saveMemo(_memo);
          if (res == 1) {
            user.classList.add(HL_CLS);
            nameShow = BMemoUtils.getUserShow({ nickname, memo: _memo.memo });
            user.innerText = nameShow;
          } else {
            user.classList.remove(HL_CLS);
            user.innerText = nickname;
          }
        }

        user.insertAdjacentElement("afterend", mBtn);
        user.insertAdjacentElement("afterend", mInput);
      },
    );
  }
  static rcmdHandler() {
    elmGetter.each("#mirror-vdcon div.card-box", async (card) => {
      const user = card.querySelector(".info .upname > a");
      const nameSpan = user.querySelector(".name");
      const nickname = nameSpan?.innerText;
      const bid = new URL(user.href)?.pathname?.split("/")[1];
      const memo = MemoService.getMemo({ bid, nickname });
      if (memo) {
        // 1. 隐藏原有的名字节点（不要删，删了 Vue 会报错或重建）
        nameSpan.style.display = "none";
        // 2. 检查是否已经加过备注层了，防止重复添加
        if (!nameSpan.nextSibling?.classList?.contains("pxoxq-memo-wrap")) {
          const memoWrap = document.createElement("span");
          memoWrap.className = "pxoxq-memo-wrap " + HL_CLS;
          memoWrap.innerText = BMemoUtils.userNameShow({
            nickname,
            memo: memo.memo,
          });
          // 3. 把带备注的名字插在原节点后面
          nameSpan.insertAdjacentElement("afterend", memoWrap);
        }
      } else {
        nameSpan.classList.remove(HL_CLS);
      }
    });
  }
  static commentUserHander() {
    function handleUser(user, { avatar = "" }) {
      const bid = new URL(user.href)?.pathname?.split("/")[1];
      const nickname = user.innerText;
      user.classList.add("pxo-fast-trans");
      const mInput = document.createElement("input");
      const mBtn = document.createElement("button");
      mInput.classList.add("pxo-transition");
      mInput.style.setProperty("--pxo-w", "0px");
      mInput.style.setProperty("--pxo-h", "0px");
      mInput.style.setProperty("--pxo-pad", "0");
      mInput.addEventListener("blur", () => {
        mInput.style.display = "none";
      });

      mInput.style.display = "none";
      let memo = MemoService.getMemo({ bid, nickname });
      if (memo) {
        mInput.value = memo.memo ?? nickname;
        user.innerText = BMemoUtils.getUserShow({ nickname, memo: memo.memo });
        for (let s in INLINE_HL) {
          user.style[s] = INLINE_HL[s];
        }
        if (nickname != memo.nickname || avatar != memo.avatar) {
          memo = { ...memo, avatar, nickname };
          BMemoUtils.saveMemo(memo);
        }
      } else {
        mInput.value = nickname;
        for (let s in INLINE_HL) {
          user.style[s] = "unset";
        }
      }
      mInput.style.border = "none";
      mInput.style.outline = "none";
      // border-bottom 使用 css 变量显示
      mInput.style.setProperty("border-bottom", `1px solid ${BPINK}`);
      mBtn.innerText = "备注";
      mBtn.style.border = "none";
      mBtn.style.outline = "none";
      mBtn.style.color = BPINK;
      mBtn.style.background = "none";
      mBtn.classList.add(EDT_BTN_CLS);
      mBtn.addEventListener("click", () => {
        if (mBtn.innerText === "备注") {
          memo = MemoService.getMemo({ bid, nickname });
          // 展开 input

          mInput.style.display = "block";
          mInput.style.setProperty("--pxo-w", "100px");
          mInput.style.setProperty("--pxo-pad", "2px 4px");
          mInput.readOnly = false;
          mInput.focus();
          mInput.value = memo?.memo ?? nickname;
          user.style.display = "none";
          user.classList.add("pxo-hidden");
          mBtn.innerText = "保存";
        } else {
          handleSave();
        }
      });
      mInput.addEventListener("keydown", (e) => {
        if (e.code == "Enter") {
          handleSave();
          user.style.display = "block";
          mInput.style.display = "none";
        }
      });
      mInput.addEventListener("blur", () => {
        if (!mInput.readOnly) {
          handleSave();
          user.style.display = "block";
        }
      });
      function handleSave() {
        mInput.style.setProperty("--pxo-w", "0px");
        mInput.style.setProperty("--pxo-pad", "0");
        mInput.readOnly = true;
        user.classList.remove("pxo-hidden");
        mBtn.innerText = "备注";
        let m = mInput?.value?.trim();
        m = m == nickname ? "" : m;
        let _memo = new BMemo(bid, nickname, m, avatar);
        memo = _memo;
        const res = BMemoUtils.saveMemo(_memo);
        if (res == 1) {
          for (let s in INLINE_HL) {
            user.style[s] = INLINE_HL[s];
          }
          user.innerText = BMemoUtils.userNameShow({
            nickname,
            memo: _memo.memo,
          });
        } else {
          for (let s in INLINE_HL) {
            user.style[s] = "unset";
          }
          user.innerText = nickname;
        }
      }
      user.parentNode?.insertAdjacentElement("afterend", mBtn);
      user.parentNode?.insertAdjacentElement("afterend", mInput);
    }
    elmGetter.each("bili-comments", async (cmts) => {
      const cRoot = cmts.shadowRoot;
      elmGetter.each("bili-comment-thread-renderer", cRoot, async (cmt) => {
        const cmtRoot = cmt.shadowRoot;
        elmGetter.each("bili-comment-renderer", cmtRoot, async (topCmt) => {
          const topCmtRoot = topCmt.shadowRoot;
          let avatar = "";
          const aBox = await asyncGetNodeOnce("bili-avatar", topCmtRoot);
          const aImg = await asyncGetNodeOnce(
            "#canvas > .layers:nth-child(2) > div.layer.center picture  img",
            aBox.shadowRoot,
          );
          if (aImg) {
            avatar = aImg.src;
          }
          elmGetter.each(
            "bili-comment-user-info",
            topCmtRoot,
            async (uinfo) => {
              const userInfoRoot = uinfo.shadowRoot;
              elmGetter.each("#user-name a", userInfoRoot, async (user) => {
                handleUser(user, { avatar });
              });
            },
          );
        });
        elmGetter.each(
          "#replies bili-comment-replies-renderer",
          cmtRoot,
          async (replies) => {
            const repliesRoot = replies.shadowRoot;
            elmGetter.each(
              "bili-comment-reply-renderer",
              repliesRoot,
              async (rpl) => {
                const rplRoot = rpl.shadowRoot;
                elmGetter.each(
                  "bili-comment-user-info",
                  rplRoot,
                  async (uinfo) => {
                    const userInfoRoot = uinfo.shadowRoot;
                    let avatar = "";
                    const aImg = uinfo.querySelector("#user-avatar img");
                    if (aImg) {
                      avatar = aImg.src;
                    }
                    elmGetter.each(
                      "#user-name a",
                      userInfoRoot,
                      async (user) => {
                        handleUser(user, { avatar });
                      },
                    );
                  },
                );
              },
            );
          },
        );
      });
    });
  }
}

class MsgUI {
  static init() {
    this.whisperHandler();
    this.replyHandler();
  }

  static whisperHandler() {
    elmGetter.each(
      "#link-message-container .space-right .bili-im .left .list-container .list .name-box .name-value",
      async (user) => {
        let nickname = user.innerText;
        const startT = new Date().getTime();
        if (nickname) {
          handleUser();
        } else {
          const timer = setInterval(() => {
            if (nickname || new Date().getTime() - startT > MAX_TIMEOUT * 1e3) {
              handleUser();
              clearInterval(timer);
            } else {
              nickname = user.innerText;
            }
          }, 300);
        }

        function handleUser() {
          const memo = MemoService.getMemo({ nickname });
          if (memo) {
            user.innerText = BMemoUtils.getUserShow(memo);
            user.classList.add(HL_CLS);
          } else {
            user.classList.remove(HL_CLS);
          }
        }
      },
    );
  }

  static replyHandler() {
    elmGetter.each(
      "#link-message-container .container .space-right .router-view .basic-list-item .center-box .line-1 span.name-field > a",
      async (user) => {
        const bid = new URL(user.href)?.pathname.split("/")[1];
        const nickname = user.innerText;
        let memo = MemoService.getMemo({ bid, nickname });
        if (memo) {
          user.innerText = BMemoUtils.getUserShow(memo);
          user.classList.add(HL_CLS);
        } else {
          user.classList.remove(HL_CLS);
        }
        const mInput = document.createElement("div");
        const mBtn = document.createElement("button");
        let isSaving = false;
        mInput.classList.add("pxo-transition");
        mInput.style.setProperty("--pxo-w", "0px");
        mInput.style.setProperty("--pxo-h", "0px");
        mInput.style.setProperty("--pxo-pad", "0");
        mInput.style.setProperty("border-bottom", `1px solid ${BPINK}`);
        user.classList.add("pxo-fast-trans");
        const line1 = user.closest(".line-1");
        if (line1) {
          line1.style.display = "flex";
          line1.style.gap = "4px";
          line1.style.alignItems = "center";
        }
        mBtn.classList.add(EDT_BTN_CLS);
        mBtn.innerText = "备注";
        mBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          memo = MemoService.getMemo({ bid, nickname });
          mInput.innerText = memo?.memo ? memo.memo : nickname;
          mInput.style.display = "block";
          mInput.contentEditable = true;
          // 展开输入
          mInput.style.setProperty("--pxo-w", "auto");
          mInput.style.setProperty("--pxo-h", "auto");
          mInput.style.setProperty("--pxo-pad", "2px 8px");
          mInput.focus();
          user.classList.add("pxo-hidden");
          mBtn.classList.add("pxo-hidden");
        });
        mInput.addEventListener("blur", () => {
          if (!isSaving) {
            isSaving = true;
            handleSave();
          }
        });
        mInput.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
        });
        mInput.addEventListener("keydown", (e) => {
          if (e.code == "Enter") {
            mInput.style.display = "none";
            isSaving = true;
            handleSave();
          }
        });

        user.insertAdjacentElement("afterend", mInput);
        user.insertAdjacentElement("afterend", mBtn);
        function handleSave() {
          mInput.contentEditable = false;
          isSaving = false;
          // 收起
          mInput.style.setProperty("--pxo-w", "0px");
          mInput.style.setProperty("--pxo-h", "0px");
          mInput.style.setProperty("--pxo-pad", "0");
          user.classList.remove("pxo-hidden");
          mBtn.classList.remove("pxo-hidden");
          let m = mInput.innerText?.trim();
          m = m === nickname ? "" : m;
          const _memo = new BMemo(bid, nickname, m);
          memo = { ..._memo };
          const res = BMemoUtils.saveMemo(memo);
          if (res == 1) {
            user.innerText = BMemoUtils.getUserShow(memo);
            user.classList.add(HL_CLS);
          } else {
            user.innerText = nickname;
            user.classList.remove(HL_CLS);
          }
        }
      },
    );
  }
}

/* ManagerMenu：将所有样式统一到 CSS，保留 DOM 结构与逻辑 */
class ManagerMenu {
  static flushMemoTab;

  static init() {}

  static renderMenuAll() {
    const menu = document.createElement("div");
    menu.id = "pxo-bmemo-menu";
    document.body.appendChild(menu);

    const menuBox = document.createElement("div");
    menuBox.classList.add("pxo-menu-box");
    const toggleBtn = document.createElement("div");
    toggleBtn.classList.add("pxo-toggle-btn");
    const helpInfo = document.createElement("div");
    helpInfo.classList.add("pxo-help-info");
    menu.appendChild(menuBox);
    menu.appendChild(helpInfo);
    menuBox.appendChild(toggleBtn);
    menuBox.appendChild(this.renderOptsUI());
    menuBox.appendChild(this.renderMemosUI());
    const helpA = document.createElement("a");
    helpInfo.appendChild(helpA);
    helpA.href = HELP_LINK;
    helpA.target = "_blank";
    helpA.innerText = "帮助";

    toggleBtn.innerText = "o_o";
    toggleBtn.addEventListener("click", () => {
      if (toggleBtn.innerText === "o_o") {
        toggleBtn.innerText = "O^O";
        menu.classList.add("pxo-open");
        toggleBtn.classList.add("pxo-open");
        this.flushMemoTab();
      } else {
        toggleBtn.innerText = "o_o";
        menu.classList.remove("pxo-open");
        toggleBtn.classList.remove("pxo-open");
      }
    });
  }

  static renderOptsUI() {
    const optsUI = document.createElement("div");
    optsUI.classList.add("pxo-opts");

    optsUI.appendChild(renderMemoModeOpt());

    function renderMemoModeOpt() {
      const memoModes = [
        { label: "昵称", value: 0 },
        { label: "备注(昵称)", value: 1 },
        { label: "昵称(备注)", value: 2 },
        { label: "备注", value: 3 },
      ];
      const memoModeBox = document.createElement("div");
      memoModeBox.classList.add("pxo-memo-mode-box");
      const mmLabel = document.createElement("div");
      mmLabel.classList.add("pxo-mm-label");
      memoModeBox.appendChild(mmLabel);
      mmLabel.innerText = "昵称显示模式：";
      const memoM = ConfService.getConf(CONF_KEY.memoM);
      memoModes.forEach((m) => {
        const wrap = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "memoMode";
        input.value = m.value;
        input.id = "pxo-memomode-" + m.value;
        label.innerText = m.label;
        label.style.userSelect = "none";
        label.setAttribute("for", input.id);
        input.addEventListener("change", (e) => {
          ConfService.setConf(CONF_KEY.memoM, e.target.value);
        });
        if (memoM == m.value) {
          input.checked = true;
        }
        wrap.appendChild(input);
        wrap.appendChild(label);
        memoModeBox.appendChild(wrap);
      });
      return memoModeBox;
    }

    return optsUI;
  }

  static renderMemosUI() {
    const mWrap = document.createElement("div");
    const header = document.createElement("div");
    header.classList.add("pxo-header");
    const memoTab = document.createElement("div");
    memoTab.classList.add("pxo-memo-tab");
    mWrap.appendChild(header);
    mWrap.appendChild(memoTab);
    const importBtn = document.createElement("button");
    const exportBtn = document.createElement("button");
    const memoTitle = document.createElement("div");
    const searchBox = document.createElement("div");
    searchBox.classList.add("pxo-search-box");
    const searchInput = document.createElement("input");
    searchInput.classList.add("pxo-search-input");
    const clearBtn = document.createElement("div");
    clearBtn.classList.add("pxo-clear-btn");
    searchBox.appendChild(searchInput);
    searchBox.appendChild(clearBtn);
    header.appendChild(importBtn);
    header.appendChild(memoTitle);
    header.appendChild(searchBox);
    header.appendChild(exportBtn);
    searchInput.placeholder = "搜索....";
    clearBtn.innerHTML = "&times;";
    memoTitle.innerText = "备注列表";
    memoTitle.classList.add("pxo-memo-title");

    importBtn.innerText = "导入";
    importBtn.classList.add("pxo-action-btn");
    exportBtn.innerText = "导出";
    exportBtn.classList.add("pxo-action-btn");
    exportBtn.addEventListener("click", () => {
      const memos = MemoService.getAllMemos();
      const mlist = JSON.stringify(memos, null, 2);
      const blob = new Blob([mlist], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `B站备注备份_${dateTimeNow()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    {
      const importModes = [
        { name: "跳过", value: 0 },
        { name: "覆盖", value: 1 },
        { name: "合并", value: 2 },
      ];
      const imptDog = document.createElement("dialog");
      imptDog.classList.add("pxo-dialog");
      imptDog.style.zIndex = "10000";
      document.body.appendChild(imptDog);
      importBtn.addEventListener("click", () => {
        imptDog.classList.add("pxo-show");
      });

      const dTitle = document.createElement("div");
      dTitle.classList.add("pxo-dialog-title");
      dTitle.innerText = "批量导入备注";
      imptDog.appendChild(dTitle);
      const imptModeWrap = document.createElement("div");
      imptModeWrap.classList.add("pxo-impt-mode-wrap");
      imptDog.appendChild(imptModeWrap);
      const iptTitle = document.createElement("div");
      imptModeWrap.appendChild(iptTitle);
      iptTitle.innerText = "导入时遇到重复的：";
      iptTitle.style.fontSize = "16px";
      iptTitle.style.fontWeight = "600";
      let currMode = 1;
      importModes.forEach((mode) => {
        const wrap = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "imptMode";
        input.value = mode.value;
        input.id = "pxo-imptmode-" + mode.value;
        input.checked = currMode == mode.value;
        label.innerText = mode.name;
        label.style.userSelect = "none";
        label.setAttribute("for", input.id);
        input.addEventListener("change", (e) => {
          currMode = e.target.value;
        });
        wrap.appendChild(input);
        wrap.appendChild(label);
        imptModeWrap.appendChild(wrap);
      });

      const imtIpt = document.createElement("textarea");
      imtIpt.classList.add("pxo-textarea");
      imptDog.appendChild(imtIpt);
      imtIpt.rows = 14;
      const optBtnWrap = document.createElement("div");
      optBtnWrap.classList.add("pxo-opt-btn-wrap");
      optBtnWrap.style.justifyContent = "space-between";
      optBtnWrap.style.display = "flex";
      imptDog.appendChild(optBtnWrap);
      const cancelBtn = document.createElement("button");
      cancelBtn.classList.add("pxo-primary-btn");
      optBtnWrap.appendChild(cancelBtn);
      cancelBtn.innerText = "取消";
      cancelBtn.addEventListener("click", () => {
        imptDog.classList.remove("pxo-show");
        imptDog.close();
      });
      const cfmBtn = document.createElement("button");
      cfmBtn.classList.add("pxo-primary-btn");
      optBtnWrap.appendChild(cfmBtn);
      cfmBtn.innerText = "导入";
      cfmBtn.addEventListener("click", () => {
        imptDog.showModal();
        const imptData = imtIpt.value;
        let data;
        try {
          if(!imptData.trim()){
            imptDog.close();
            imptDog.classList.remove("pxo-show");
            return false;
          }
          data = JSON.parse(imptData);
        } catch (e) {
          alert("输入内容格式错误");
          return false;
        }
        if (data) {
          const res = BMemoUtils.importMemos(data, currMode);
          if (res) {
            imptDog.classList.remove("pxo-show");
            flushMemoTab();
            alert(
              `${res.successCnt || 0} 条数据导入成功；${res.failCnt || 0} 条数据导入失败`,
            );
          }
        }
      });
    }

    let mFilter = null;
    let filterTimer = null;

    function searchHandler(e) {
      if (filterTimer) {
        clearTimeout(filterTimer);
      }
      filterTimer = setTimeout(() => {
        const searhKey = searchInput.value.trim();
        if (mFilter) mFilter(searhKey);
      }, 800);
    }

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      searchHandler();
    });

    {
      const { memoList, memoFilter } = this.renderMemoTab();
      mFilter = memoFilter;
      searchInput.addEventListener("input", searchHandler);
      if (memoList) {
        memoTab.appendChild(memoList);
      }
    }

    this.flushMemoTab = () => flushMemoTab();
    function flushMemoTab() {
      const { memoList, memoFilter } = ManagerMenu.renderMemoTab();
      mFilter = memoFilter;
      memoTab.innerHTML = "";
      memoTab.appendChild(memoList);
    }
    return mWrap;
  }

  static renderMemoTab() {
    const memos = MemoService.getAllMemos();
    const mp = new Map();
    const memoKeys = ["avatar", "bid", "nickname", "memo"];
    const mLabels = {
      avatar: "头像",
      bid: "BilibiliID",
      nickname: "昵称",
      memo: "备注",
    };
    const mwrap = document.createElement("div");
    mwrap.classList.add("pxo-flex");
    mwrap.style.flexWrap = "wrap";
    mwrap.style.width = "100%";
    mwrap.style.alignItems = "center";
    mwrap.style.justifyContent = "space-between";

    for (const bid in memos) {
      const memo = memos[bid];
      const row = document.createElement("div");
      row.classList.add("pxo-memo-row");
      mwrap.appendChild(row);
      mp.set(bid, row);
      memoKeys.forEach((k) => {
        const item = document.createElement("div");
        row.appendChild(item);
        if (k != "avatar") {
          const label = document.createElement("div");
          label.classList.add("pxo-label");
          item.appendChild(label);
          label.innerText = mLabels[k];
        } else {
          const { avatar } = memo;
          item.classList.add("pxo-avatar");
          if (avatar) {
            const img = document.createElement("img");
            item.appendChild(img);
            img.src = memo[k];
            img.alt = memo.nickname || "";
          } else {
            const fakeA = document.createElement("div");
            item.appendChild(fakeA);
            fakeA.innerText = memo.memo?.[0] || "B";
            fakeA.classList.add("pxo-fake-avatar");
          }
        }

        if (k == "nickname") {
          item.classList.add("pxo-nickname");
          item.title = memo[k];
          const a = document.createElement("a");
          a.title = memo[k];
          a.innerText = memo[k];
          a.href = "https://space.bilibili.com/" + bid;
          a.target = "_blank";
          item.appendChild(a);
        } else if (k == "memo") {
          const memoInput = document.createElement("input");
          memoInput.value = memo[k];
          memoInput.classList.add("pxo-memo-input");
          memoInput.readOnly = true;
          memoInput.title = "单击修改备注";
          memoInput.addEventListener("click", () => {
            memoInput.readOnly = false;
            memoInput.style.setProperty("border-bottom", `1px solid ${BPINK}`);
            memoInput.focus();
          });
          memoInput.addEventListener("blur", () => {
            memoInput.readOnly = true;
            memoInput.style.setProperty("border-bottom", "none");
            let m = memoInput.value.trim();
            if (
              !m &&
              !confirm(`确定删除该备注吗？【${memo.nickname} | ${memo.memo}】`)
            ) {
              memoInput.value = memo.memo;
              return false;
            }
            const _memo = { ...memo, memo: m };
            const res = BMemoUtils.saveMemo(_memo);
            if (res == -1) {
              row.remove();
            } else if (res == 0) {
              memoInput.value = memo.memo;
            } else {
              memo.memo = m;
            }
            GM_setValue(bid, memo);
          });
          item.appendChild(memoInput);
        } else if (k == "bid") {
          const val = document.createElement("div");
          val.classList.add("pxo-val");
          val.innerText = memo[k];
          item.appendChild(val);
        }
      });
    }

    function memoFilter(keyword = "") {
      let kwd = keyword.trim();
      if (!kwd) {
        for (const k of mp.keys()) {
          mp.get(k).style.display = "flex";
        }
      } else {
        const keys = kwd.split(/\s+/);
        for (const k of mp.keys()) {
          const m = memos[k];
          const show = keys.some(
            (k2) =>
              m.memo.includes(k2) ||
              m.nickname.includes(k2) ||
              m.bid.includes(k2),
          );
          mp.get(k).style.display = show ? "flex" : "none";
        }
      }
    }
    return { memoList: mwrap, memoFilter };
  }
}

/* 初始化：注入样式并启动各模块（逻辑与原脚本一致） */
function init() {
  GM_addStyle(CM_STYLE);
  const confs = ConfService.getAllConf();
  if (confs == null || (confs !== null && Object.keys(confs).length == 0)) {
    for (let k in CONF_INIT) {
      ConfService.setConf(k, CONF_INIT[k]);
    }
  }
  BSpaceUI.init();
  IndexUI.init();
  VideoPlayUI.init();
  MsgUI.init();
  ManagerMenu.renderMenuAll();
}

(function () {
  "use strict";
  init();
  document.addEventListener("focusin", (e) => {
    const el = e.target;
    if (!el.classList.contains(EDT_IPT_CLS)) return;

    el.style.setProperty("--pxo-w", "130px");
    el.style.setProperty("--pxo-h", "auto");
    el.style.setProperty("--pxo-pad", "0 4px");
  });

  document.addEventListener("focusout", (e) => {
    const el = e.target;
    if (!el.classList.contains(EDT_IPT_CLS)) return;

    el.style.setProperty("--pxo-w", "0px");
    el.style.setProperty("--pxo-h", "0px");
    el.style.setProperty("--pxo-pad", "0");
  });
})();
