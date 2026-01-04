// ==UserScript==
// @name         V2EX Next V2Next-save
// @namespace    http://tampermonkey.net/
// @version      10.31
// @author       zyronon
// @description  V2Next - 一个好用的V2EX脚本！手机 App 已发布
// @license      GPL License
// @icon         https://vtonext.vercel.app/favicon.ico
// @homepage     https://github.com/zyronon/V2Next
// @homepageURL  https://github.com/zyronon/V2Next
// @supportURL   https://update.greasyfork.org/scripts/458024/V2Next.user.js
// @match        https://v2ex.com/
// @match        https://v2ex.com/?tab=*
// @match        https://v2ex.com/t/*
// @match        https://v2ex.com/recent*
// @match        https://v2ex.com/go/*
// @match        https://v2ex.com/member/*
// @match        https://v2ex.com/changes*
// @match        https://*.v2ex.com/
// @match        https://*.v2ex.com/?tab=*
// @match        https://*.v2ex.com/t/*
// @match        https://*.v2ex.com/recent*
// @match        https://*.v2ex.com/go/*
// @match        https://*.v2ex.com/member/*
// @match        https://*.v2ex.com/changes*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.21/dist/vue.global.prod.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.18/dayjs.min.js
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/549545/V2EX%20Next%20V2Next-save.user.js
// @updateURL https://update.greasyfork.org/scripts/549545/V2EX%20Next%20V2Next-save.meta.js
// ==/UserScript==


(function (vue, dayjs) {
  'use strict';

  var PageType = /* @__PURE__ */ ((PageType2) => {
    PageType2["Home"] = "Home";
    PageType2["Node"] = "Node";
    PageType2["Post"] = "Post";
    PageType2["Member"] = "Member";
    PageType2["Changes"] = "Changes";
    PageType2["Hot"] = "Hot";
    return PageType2;
  })(PageType || {});
  var CommentDisplayType = /* @__PURE__ */ ((CommentDisplayType2) => {
    CommentDisplayType2[CommentDisplayType2["FloorInFloor"] = 0] = "FloorInFloor";
    CommentDisplayType2[CommentDisplayType2["FloorInFloorNoCallUser"] = 4] = "FloorInFloorNoCallUser";
    CommentDisplayType2[CommentDisplayType2["FloorInFloorNested"] = 5] = "FloorInFloorNested";
    CommentDisplayType2[CommentDisplayType2["Like"] = 1] = "Like";
    CommentDisplayType2[CommentDisplayType2["V2exOrigin"] = 2] = "V2exOrigin";
    CommentDisplayType2[CommentDisplayType2["OnlyOp"] = 3] = "OnlyOp";
    CommentDisplayType2[CommentDisplayType2["New"] = 6] = "New";
    return CommentDisplayType2;
  })(CommentDisplayType || {});
  const _sfc_main$m = {
    name: "Tooltip",
    props: {
      title: {
        type: String,
        default() {
          return "";
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        show: false
      };
    },
    methods: {
      showPop(e2) {
        if (this.disabled)
          return;
        if (!this.title)
          return;
        e2.stopPropagation();
        let rect = e2.target.getBoundingClientRect();
        this.show = true;
        vue.nextTick(() => {
          var _a, _b;
          let tip = (_b = (_a = this.$refs) == null ? void 0 : _a.tip) == null ? void 0 : _b.getBoundingClientRect();
          if (!tip)
            return;
          if (rect.top < 50) {
            this.$refs.tip.style.top = rect.top + rect.height + 10 + "px";
          } else {
            this.$refs.tip.style.top = rect.top - tip.height - 10 + "px";
          }
          let tipWidth = tip.width;
          let rectWidth = rect.width;
          this.$refs.tip.style.left = rect.left - (tipWidth - rectWidth) / 2 + "px";
        });
      }
    },
    render() {
      let Vnode = this.$slots.default()[0];
      return vue.createVNode(vue.Fragment, null, [this.show && this.title && vue.createVNode(vue.Teleport, {
        "to": "body"
      }, {
        default: () => [vue.createVNode(vue.Transition, {
          "name": "fade"
        }, {
          default: () => [vue.createVNode("div", {
            "ref": "tip",
            "className": "tip"
          }, [this.title])]
        })]
      }), vue.createVNode(Vnode, {
        "onClick": () => this.show = false,
        "onmouseenter": (e2) => this.showPop(e2),
        "onmouseleave": () => this.show = false
      }, null)]);
    }
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-ee672411"]]);
  const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
    __name: "BaseSwitch",
    props: {
      modelValue: { type: Boolean }
    },
    emits: ["update:modelValue"],
    setup(__props, { emit: __emit }) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["switch", { active: _ctx.modelValue }]),
          onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", !_ctx.modelValue))
        }, null, 2);
      };
    }
  });
  const BaseSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-e7c0fbef"]]);
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const functions = {
    async refreshOnce(once) {
      return new Promise((resolve) => {
        if (once) {
          if (typeof once === "string") {
            let res = once.match(/var once = "([\d]+)";/);
            if (res && res[1])
              resolve(Number(res[1]));
          }
          if (typeof once === "number")
            resolve(once);
        }
        window.fetchOnce().then((r2) => {
          resolve(r2);
        });
      });
    },
    clone: (val) => JSON.parse(JSON.stringify(val)),
    createList(post, replyList, withRedundList = true) {
      post.replyList = replyList;
      post.topReplyList = this.clone(replyList).filter((v) => v.thankCount >= window.config.topReplyLoveMinCount).sort((a, b) => b.thankCount - a.thankCount).slice(0, window.config.topReplyCount);
      post.replyCount = replyList.length;
      post.allReplyUsers = Array.from(new Set(replyList.map((v) => v.username)));
      post.nestedReplies = functions.createNestedList(this.clone(replyList), post.topReplyList);
      if (withRedundList) {
        post.nestedRedundReplies = functions.createNestedRedundantList(this.clone(replyList), post.topReplyList);
      }
      return post;
    },
    //获取所有回复
    getAllReply(repliesMap = []) {
      return repliesMap.sort((a, b) => a.i - b.i).reduce((pre, i) => {
        pre = pre.concat(i.replyList);
        return pre;
      }, []);
    },
    //查找子回复
    findChildren(item, endList, all, topReplyList) {
      var _a;
      const fn = (child, endList2, parent) => {
        child.level = parent.level + 1;
        let rIndex2 = all.findIndex((v) => v.floor === child.floor);
        if (rIndex2 > -1) {
          all[rIndex2].isUse = true;
        }
        parent.children.push(this.findChildren(child, endList2, all, topReplyList));
      };
      item.children = [];
      let floorReplyList = [];
      for (let i = 0; i < endList.length; i++) {
        let currentItem = endList[i];
        if (currentItem.isUse)
          continue;
        if (currentItem.replyFloor === item.floor) {
          if (currentItem.replyUsers.length === 1 && currentItem.replyUsers[0] === item.username) {
            currentItem.isUse = true;
            floorReplyList.push({ endList: endList.slice(i + 1), currentItem });
          } else {
            currentItem.isWrong = true;
          }
        }
      }
      floorReplyList.reverse().map(({ currentItem, endList: endList2 }) => {
        fn(currentItem, endList2, item);
      });
      let nextMeIndex = endList.findIndex((v) => {
        var _a2;
        return v.username === item.username && ((_a2 = v.replyUsers) == null ? void 0 : _a2[0]) !== item.username;
      });
      let findList = nextMeIndex > -1 ? endList.slice(0, nextMeIndex) : endList;
      for (let i = 0; i < findList.length; i++) {
        let currentItem = findList[i];
        if (currentItem.isUse)
          continue;
        if (currentItem.replyUsers.length === 1) {
          if (currentItem.replyFloor !== -1) {
            if (((_a = all[currentItem.replyFloor - 1]) == null ? void 0 : _a.username) === currentItem.replyUsers[0]) {
              continue;
            }
          }
          let endList2 = endList.slice(i + 1);
          if (currentItem.username === item.username) {
            if (currentItem.replyUsers[0] === item.username) {
              fn(currentItem, endList2, item);
            }
            break;
          } else {
            if (currentItem.replyUsers[0] === item.username) {
              fn(currentItem, endList2, item);
            }
          }
        } else {
          if (currentItem.username === item.username)
            break;
        }
      }
      item.children = item.children.sort((a, b) => a.floor - b.floor);
      item.replyCount = item.children.reduce((a, b) => {
        return a + (b.children.length ? b.replyCount + 1 : 1);
      }, 0);
      let rIndex = topReplyList.findIndex((v) => v.floor === item.floor);
      if (rIndex > -1) {
        topReplyList[rIndex].children = item.children;
        topReplyList[rIndex].replyCount = item.replyCount;
      }
      return item;
    },
    //生成嵌套回复
    createNestedList(allList = [], topReplyList = []) {
      if (!allList.length)
        return [];
      let list = allList;
      let nestedList = [];
      list.map((item, index) => {
        let startList = list.slice(0, index);
        let startReplyUsers = Array.from(new Set(startList.map((v) => v.username)));
        let endList = list.slice(index + 1);
        if (index === 0) {
          nestedList.push(this.findChildren(item, endList, list, topReplyList));
        } else {
          if (!item.isUse) {
            let isOneLevelReply = false;
            if (item.replyUsers.length) {
              if (item.replyUsers.length > 1) {
                isOneLevelReply = true;
              } else {
                isOneLevelReply = !startReplyUsers.find((v) => v === item.replyUsers[0]);
              }
            } else {
              isOneLevelReply = true;
            }
            if (isOneLevelReply) {
              item.level = 0;
              nestedList.push(this.findChildren(item, endList, list, topReplyList));
            }
          }
        }
      });
      return nestedList;
    },
    //生成嵌套冗余回复
    createNestedRedundantList(allList = [], topReplyList) {
      if (!allList.length)
        return [];
      let list = allList;
      let nestedList = [];
      list.map((item, index) => {
        let startList = list.slice(0, index);
        let startReplyUsers = Array.from(new Set(startList.map((v) => v.username)));
        let endList = list.slice(index + 1);
        if (index === 0) {
          nestedList.push(this.findChildren(item, endList, list, topReplyList));
        } else {
          if (!item.isUse) {
            let isOneLevelReply = false;
            if (item.replyUsers.length) {
              if (item.replyUsers.length > 1) {
                isOneLevelReply = true;
              } else {
                isOneLevelReply = !startReplyUsers.find((v) => v === item.replyUsers[0]);
              }
            } else {
              isOneLevelReply = true;
            }
            if (isOneLevelReply) {
              item.level = 0;
              nestedList.push(this.findChildren(item, endList, list, topReplyList));
            }
          } else {
            let newItem = this.clone(item);
            newItem.children = [];
            newItem.level = 0;
            newItem.isDup = true;
            nestedList.push(newItem);
          }
        }
      });
      return nestedList;
    },
    //解析A标签
    parseA(a) {
      let href = a.href;
      let id;
      if (href.includes("/t/")) {
        id = a.pathname.substring("/t/".length);
      }
      return { href, id, title: a.innerText };
    },
    //图片链接转Img标签
    checkPhotoLink2Img(dom) {
      let replaceImgur = window.config.replaceImgur;
      let is_add = false;
      let prefix_img = replaceImgur ? DefaultVal.imgurProxy : "";
      let imgList = dom.querySelectorAll("img");
      imgList.forEach((img) => {
        let href = img.src;
        if (href.includes("imgur.com")) {
          img.setAttribute("originUrl", img.src);
          img.setAttribute("notice", "此img标签由V2Next脚本解析");
          img.setAttribute("referrerpolicy", "no-referrer");
          if (href.includes(".png") || href.includes(".jpg") || href.includes(".jpeg") || href.includes(".gif") || href.includes(".PNG") || href.includes(".JPG") || href.includes(".JPEG") || href.includes(".GIF"))
            ;
          else {
            href = href + ".png";
          }
          if (!is_add && replaceImgur) {
            let meta = document.createElement("meta");
            meta.setAttribute("name", "referrer");
            meta.setAttribute("content", "no-referrer");
            document.getElementsByTagName("head")[0].appendChild(meta);
            is_add = true;
          }
          img.src = prefix_img + href;
        }
      });
      let aList = dom.querySelectorAll("a");
      aList.forEach((a) => {
        let href = a.href;
        if (a.children.length == 0 && a.innerText == href) {
          if (href.includes(".png") || href.includes(".jpg") || href.includes(".jpeg") || href.includes(".gif") || href.includes(".PNG") || href.includes(".JPG") || href.includes(".JPEG") || href.includes(".GIF")) {
            let img = document.createElement("img");
            img.setAttribute("originUrl", a.href);
            img.setAttribute("notice", "此img标签由V2Next脚本解析");
            img.setAttribute("referrerpolicy", "no-referrer");
            if (href.includes("imgur.com")) {
              if (!is_add && replaceImgur) {
                let meta = document.createElement("meta");
                meta.setAttribute("name", "referrer");
                meta.setAttribute("content", "no-referrer");
                document.getElementsByTagName("head")[0].appendChild(meta);
                is_add = true;
              }
              img.src = prefix_img + href;
            } else {
              img.src = href;
            }
            a.innerText = "";
            a.append(img);
          }
        }
      });
    },
    //检测帖子回复长度
    async checkPostReplies(id, needOpen = true) {
      return new Promise(async (resolve) => {
        let res = await functions.getPostDetailByApi(id);
        if ((res == null ? void 0 : res.replies) > window.config.maxReplyCountLimit) {
          if (needOpen) {
            functions.openNewTab(`https://${location.origin}/t/${id}?p=1&script=1`);
          }
          return resolve(true);
        }
        resolve(false);
      });
    },
    async sleep(time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    },
    //打开新标签页
    openNewTab(href, active = false) {
      let isSafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      if (isSafariBrowser) {
        let tempId = "a_blank_" + Date.now();
        let a = document.createElement("a");
        a.setAttribute("href", href);
        a.setAttribute("target", "_blank");
        a.setAttribute("id", tempId);
        a.setAttribute("script", "1");
        if (!document.getElementById(tempId)) {
          document.body.appendChild(a);
        }
        a.click();
      } else {
        _GM_openInTab(href, { active });
      }
    },
    async cbChecker(val, count = 0) {
      if (window.cb) {
        window.cb(val);
      } else {
        while (!window.cb && count < 30) {
          await functions.sleep(500);
          count++;
        }
        window.cb && window.cb(val);
      }
    },
    //初始化脚本菜单
    initMonkeyMenu() {
      try {
        _GM_registerMenuCommand("脚本设置", () => {
          functions.cbChecker({ type: "openSetting" });
        });
        _GM_registerMenuCommand("仓库地址", () => {
          functions.openNewTab(window.const.git);
        });
        _GM_registerMenuCommand("反馈 & 建议", functions.feedback);
      } catch (e2) {
        console.error("无法使用Tampermonkey");
      }
    },
    feedback() {
      functions.openNewTab(DefaultVal.issue);
    },
    //检测页面类型
    checkPageType(a) {
      let l = a || window.location;
      let data = { pageType: null, pageData: { id: "", pageNo: null }, username: "" };
      if (l.pathname === "/") {
        data.pageType = PageType.Home;
      } else if (l.pathname === "/changes") {
        data.pageType = PageType.Changes;
      } else if (l.pathname === "/v2hot") {
        data.pageType = PageType.Hot;
      } else if (l.pathname === "/recent") {
        data.pageType = PageType.Changes;
      } else if (l.href.match(/.com\/?tab=/)) {
        data.pageType = PageType.Home;
      } else if (l.href.match(/.com\/go\//)) {
        if (!l.href.includes("/links")) {
          data.pageType = PageType.Node;
        }
      } else if (l.href.match(/.com\/member/)) {
        data.pageType = PageType.Member;
        data.username = l.pathname.replace("/member/", "").replace("/replies", "").replace("/topics", "");
      } else {
        let r2 = l.href.match(/.com\/t\/([\d]+)/);
        if (r2 && !l.pathname.includes("review") && !l.pathname.includes("info")) {
          data.pageType = PageType.Post;
          data.pageData.id = r2[1];
          if (l.search) {
            let pr = l.href.match(/\?p=([\d]+)/);
            if (pr)
              data.pageData.pageNo = Number(pr[1]);
          }
        }
      }
      return data;
    },
    //通过api获取主题详情
    getPostDetailByApi(id) {
      return new Promise((resolve) => {
        fetch(`${location.origin}/api/topics/show.json?id=${id}`).then(async (r2) => {
          if (r2.status === 200) {
            let res = await r2.json();
            if (res) {
              let d2 = res[0];
              resolve(d2);
            }
          }
        });
      });
    },
    appendPostContent(res, el) {
      let a = document.createElement("a");
      a.href = res.href;
      a.classList.add("post-content");
      let div = document.createElement("div");
      div.innerHTML = res.content_rendered;
      a.append(div);
      el.append(a);
      const checkHeight2 = () => {
        var _a;
        if (div.clientHeight < 300) {
          a.classList.add("show-all");
        } else {
          let showMore = document.createElement("div");
          showMore.classList.add("show-more");
          showMore.innerHTML = "显示更多/收起";
          showMore.onclick = function(e2) {
            e2.stopPropagation();
            a.classList.toggle("show-all");
          };
          (_a = a.parentNode) == null ? void 0 : _a.append(showMore);
        }
      };
      checkHeight2();
    },
    //从本地读取配置
    initConfig() {
      let configStr = localStorage.getItem("v2ex-config");
      let configMap = {};
      let configObj = {};
      let userName = window.user.username || "default";
      if (configStr) {
        configMap = JSON.parse(configStr);
        configObj = configMap[userName];
        if (configObj) {
          window.config = functions.deepAssign(window.config, configObj);
        }
      }
      configMap[userName] = window.config;
      localStorage.setItem("v2ex-config", JSON.stringify(configMap));
    },
    deepAssign(...arg) {
      let name, options, src, copy;
      let length = arguments.length;
      let i = 1;
      let target = arguments[0] || {};
      if (typeof target !== "object") {
        target = {};
      }
      for (; i < length; i++) {
        options = arguments[i];
        if (options != null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
            if (copy && typeof copy == "object") {
              target[name] = this.deepAssign(src, copy);
            } else if (copy !== void 0) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
    },
    //生成dom，从html字符串
    genDomFromHtmlString(htmlText) {
      let bodyText = htmlText.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
      let body = document.createElement("html");
      body.innerHTML = bodyText[0];
      return body;
    },
    stopEvent(e2) {
      e2.preventDefault();
      e2.stopPropagation();
    },
    loadAndRunScript(url) {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: function(response) {
          const code = response.responseText;
          eval(code);
        }
      });
    }
  };
  const DefaultPost = {
    allReplyUsers: [],
    content_rendered: "",
    createDate: "",
    createDateAgo: "",
    lastReplyDate: "",
    lastReplyUsername: "",
    fr: "",
    replyList: [],
    topReplyList: [],
    nestedReplies: [],
    nestedRedundReplies: [],
    username: "",
    url: "",
    href: "",
    member: {
      avatar: "",
      username: ""
    },
    node: {
      title: "",
      url: ""
    },
    headerTemplate: "",
    title: "",
    id: "",
    type: "post",
    once: "",
    replyCount: 0,
    clickCount: 0,
    thankCount: 0,
    collectCount: 0,
    lastReadFloor: 0,
    isFavorite: false,
    isIgnore: false,
    isThanked: false,
    isReport: false,
    inList: false
  };
  const getDefaultPost = (val = {}) => {
    return Object.assign(functions.clone(DefaultPost), val);
  };
  const DefaultUser = {
    tagPrefix: "--用户标签--",
    tags: {},
    tagsId: "",
    username: "",
    avatar: "",
    readPrefix: "--已读楼层--",
    readNoteItemId: "",
    readList: {},
    imgurPrefix: "--imgur图片删除hash--",
    imgurList: {},
    imgurNoteId: "",
    configPrefix: "--config--",
    configNoteId: ""
  };
  const DefaultVal = {
    pageType: void 0,
    pageData: { pageNo: 1 },
    targetUserName: "",
    currentVersion: 5,
    cb: null,
    git: "https://github.com/zyronon/V2Next",
    shortGit: "zyronon/V2Next",
    issue: "https://github.com/zyronon/V2Next/issues",
    pcLog: "https://greasyfork.org/zh-CN/scripts/458024/versions",
    pcScript: "https://greasyfork.org/zh-CN/scripts/458024",
    mobileScript: "https://github.com/zyronon/V2Next/releases",
    homeUrl: "https://vtonext.vercel.app/",
    hotUrl: "https://v2hotlist.vercel.app/hot/",
    imgurProxy: "https://img.noobzone.ru/getimg.php?url="
  };
  function getDefaultConfig(val = {}) {
    return Object.assign({
      showToolbar: true,
      autoOpenDetail: true,
      openTag: false,
      //给用户打标签
      clickPostItemOpenDetail: true,
      closePostDetailBySpace: true,
      //点击空白处关闭详情
      contentAutoCollapse: true,
      //正文超长自动折叠
      viewType: "table",
      commentDisplayType: CommentDisplayType.FloorInFloorNoCallUser,
      newTabOpen: false,
      //新标签打开
      newTabOpenActive: false,
      base64: true,
      //base功能
      sov2ex: false,
      postWidth: "",
      showTopReply: true,
      topReplyLoveMinCount: 3,
      topReplyCount: 5,
      autoJumpLastReadFloor: false,
      rememberLastReadFloor: false,
      autoSignin: true,
      customBgColor: "",
      version: DefaultVal.currentVersion,
      collectBrowserNotice: false,
      fontSizeType: "normal",
      notice: {
        uid: "",
        text: "",
        ddWebhook: "",
        takeOverNoticePage: true,
        whenNewNoticeGlimmer: false,
        loopCheckNotice: false,
        loopCheckNoticeInterval: 5
      },
      replaceImgur: false,
      maxReplyCountLimit: 400
    }, val);
  }
  const emojiEmoticons = [
    {
      title: "常用",
      list: [
        "😅",
        "😭",
        "😂",
        "🥰",
        "😰",
        "🤡",
        "👀",
        "🐴",
        "🐶",
        "❓",
        "❤️",
        "💔",
        "⭐",
        "🔥",
        "💩",
        "🔞",
        "⚠️",
        "🎁",
        "🎉"
      ]
    },
    {
      title: "小黄脸",
      list: [
        "😀",
        "😁",
        "😂",
        "🤣",
        "😅",
        "😊",
        "😋",
        "😘",
        "🥰",
        "😗",
        "🤩",
        "🤔",
        "🤨",
        "😐",
        "😑",
        "🙄",
        "😏",
        "😪",
        "😫",
        "🥱",
        "😜",
        "😒",
        "😔",
        "😨",
        "😰",
        "😱",
        "🥵",
        "😡",
        "🥳",
        "🥺",
        "🤭",
        "🧐",
        "😎",
        "🤓",
        "😭",
        "🤑",
        "🤮"
      ]
    },
    {
      title: "手势",
      list: [
        "🤏",
        "👉",
        "✌️",
        "👌",
        "👍",
        "👎",
        "🤝",
        "🙏",
        "👏"
      ]
    },
    {
      title: "其他",
      list: ["🔞", "👻", "🤡", "🐔", "👀", "💩", "🐴", "🦄", "🐧", "🐶"]
    }
  ];
  const classicsEmoticons = [
    {
      name: "[狗头]",
      low: "https://i.imgur.com/io2SM1h.png",
      high: "https://i.imgur.com/0icl60r.png"
    },
    {
      name: "[doge]",
      low: "https://i.imgur.com/duWRpIu.png",
      high: "https://i.imgur.com/HyphI6d.png"
    },
    {
      name: "[受虐滑稽]",
      low: "https://i.imgur.com/Iy0taMy.png",
      high: "https://i.imgur.com/PS1pxd9.png"
    },
    {
      name: "[马]",
      low: "https://i.imgur.com/8EKZv7I.png",
      high: "https://i.imgur.com/ANFUX52.png"
    },
    {
      name: "[二哈]",
      low: "https://i.imgur.com/XKj1Tkx.png",
      high: "https://i.imgur.com/dOeP4XD.png"
    },
    {
      name: "[舔屏]",
      low: "https://i.imgur.com/Cvl7dyN.png",
      high: "https://i.imgur.com/LmETy9N.png"
    },
    {
      name: "[辣眼睛]",
      low: "https://i.imgur.com/cPNPYD5.png",
      high: "https://i.imgur.com/3fSUmi8.png"
    },
    {
      name: "[吃瓜]",
      low: "https://i.imgur.com/ee8Lq7H.png",
      high: "https://i.imgur.com/0L26og9.png"
    },
    {
      name: "[不高兴]",
      low: "https://i.imgur.com/huX6coX.png",
      high: "https://i.imgur.com/N7JEuvc.png"
    },
    // {
    //   name: '[呵呵]',
    //   low: 'https://i.imgur.com/RvoLAbX.png',
    //   high: 'https://i.imgur.com/xSzIqrK.png'
    // },
    {
      name: "[真棒]",
      low: "https://i.imgur.com/xr1UOz1.png",
      high: "https://i.imgur.com/w8YEw9Q.png"
    },
    {
      name: "[鄙视]",
      low: "https://i.imgur.com/u6jlqVq.png",
      high: "https://i.imgur.com/8JFNANq.png"
    },
    {
      name: "[疑问]",
      low: "https://i.imgur.com/F29pmQ6.png",
      high: "https://i.imgur.com/EbbTQAR.png"
    },
    {
      name: "[吐舌]",
      low: "https://i.imgur.com/InmIzl9.png",
      high: "https://i.imgur.com/Ovj56Cd.png"
    },
    // {
    //   name: '[嘲笑]',
    //   low: 'https://i.imgur.com/BaWcsMR.png',
    //   high: 'https://i.imgur.com/0OGfJw4.png'
    // },
    // {
    //   name: '[滑稽]',
    //   low: 'https://i.imgur.com/lmbN0yI.png',
    //   high: 'https://i.imgur.com/Pc0wH85.png'
    // },
    {
      name: "[笑眼]",
      low: "https://i.imgur.com/ZveiiGy.png",
      high: "https://i.imgur.com/PI1CfEr.png"
    },
    // {
    //   name: '[狂汗]',
    //   low: 'https://i.imgur.com/veWihk6.png',
    //   high: 'https://i.imgur.com/3LtHdQv.png'
    // },
    {
      name: "[大哭]",
      low: "https://i.imgur.com/hu4oR6C.png",
      high: "https://i.imgur.com/b4X9XLE.png"
    },
    {
      name: "[喷]",
      low: "https://i.imgur.com/bkw3VRr.png",
      high: "https://i.imgur.com/wnZL13L.png"
    },
    {
      name: "[苦笑]",
      low: "https://i.imgur.com/VUWFktU.png",
      high: "https://i.imgur.com/NAfspZ1.png"
    },
    {
      name: "[喝酒]",
      low: "https://i.imgur.com/2ZZSapE.png",
      high: "https://i.imgur.com/rVbSVak.png"
    },
    {
      name: "[捂脸]",
      low: "https://i.imgur.com/krir4IG.png",
      high: "https://i.imgur.com/qqBqgVm.png"
    },
    // {
    //   name: '[呕]',
    //   low: 'https://i.imgur.com/6CUiUxv.png',
    //   high: 'https://i.imgur.com/kgdxRsG.png'
    // },
    {
      name: "[阴险]",
      low: "https://i.imgur.com/MA8YqTP.png",
      high: "https://i.imgur.com/e94jbaT.png"
    },
    {
      name: "[怒]",
      low: "https://i.imgur.com/n4kWfGB.png",
      high: "https://i.imgur.com/iMXxNxh.png"
    }
    // {
    //   name: '[衰]',
    //   low: 'https://i.imgur.com/voHFDyQ.png',
    //   high: 'https://i.imgur.com/XffE6gu.png'
    // },
    // {
    //   name: '[合十]',
    //   low: 'https://i.imgur.com/I8x3ang.png',
    //   high: 'https://i.imgur.com/T4rJVee.png'
    // },
    // {
    //   name: '[赞]',
    //   low: 'https://i.imgur.com/lG44yUl.png',
    //   high: 'https://i.imgur.com/AoF5PLp.png'
    // },
    // {
    //   name: '[踩]',
    //   low: 'https://i.imgur.com/cJp0uKZ.png',
    //   high: 'https://i.imgur.com/1XYGfXj.png'
    // },
    // {
    //   name: '[爱心]',
    //   low: 'https://i.imgur.com/sLENaF5.png',
    //   high: 'https://i.imgur.com/dND56oX.png'
    // },
    //
    // {
    //   name: '[心碎]',
    //   low: 'https://i.imgur.com/AZxJzve.png',
    //   high: 'https://i.imgur.com/RiUsPci.png'
    // },
  ];
  const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
    const colonSeparated = value.split(":");
    if (value.slice(0, 1) === "@") {
      if (colonSeparated.length < 2 || colonSeparated.length > 3) {
        return null;
      }
      provider = colonSeparated.shift().slice(1);
    }
    if (colonSeparated.length > 3 || !colonSeparated.length) {
      return null;
    }
    if (colonSeparated.length > 1) {
      const name2 = colonSeparated.pop();
      const prefix = colonSeparated.pop();
      const result = {
        // Allow provider without '@': "provider:prefix:name"
        provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
        prefix,
        name: name2
      };
      return validate && !validateIconName(result) ? null : result;
    }
    const name = colonSeparated[0];
    const dashSeparated = name.split("-");
    if (dashSeparated.length > 1) {
      const result = {
        provider,
        prefix: dashSeparated.shift(),
        name: dashSeparated.join("-")
      };
      return validate && !validateIconName(result) ? null : result;
    }
    if (allowSimpleName && provider === "") {
      const result = {
        provider,
        prefix: "",
        name
      };
      return validate && !validateIconName(result, allowSimpleName) ? null : result;
    }
    return null;
  };
  const validateIconName = (icon, allowSimpleName) => {
    if (!icon) {
      return false;
    }
    return !!// Check prefix: cannot be empty, unless allowSimpleName is enabled
    // Check name: cannot be empty
    ((allowSimpleName && icon.prefix === "" || !!icon.prefix) && !!icon.name);
  };
  const defaultIconDimensions = Object.freeze(
    {
      left: 0,
      top: 0,
      width: 16,
      height: 16
    }
  );
  const defaultIconTransformations = Object.freeze({
    rotate: 0,
    vFlip: false,
    hFlip: false
  });
  const defaultIconProps = Object.freeze({
    ...defaultIconDimensions,
    ...defaultIconTransformations
  });
  const defaultExtendedIconProps = Object.freeze({
    ...defaultIconProps,
    body: "",
    hidden: false
  });
  function mergeIconTransformations(obj1, obj2) {
    const result = {};
    if (!obj1.hFlip !== !obj2.hFlip) {
      result.hFlip = true;
    }
    if (!obj1.vFlip !== !obj2.vFlip) {
      result.vFlip = true;
    }
    const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
    if (rotate) {
      result.rotate = rotate;
    }
    return result;
  }
  function mergeIconData(parent, child) {
    const result = mergeIconTransformations(parent, child);
    for (const key in defaultExtendedIconProps) {
      if (key in defaultIconTransformations) {
        if (key in parent && !(key in result)) {
          result[key] = defaultIconTransformations[key];
        }
      } else if (key in child) {
        result[key] = child[key];
      } else if (key in parent) {
        result[key] = parent[key];
      }
    }
    return result;
  }
  function getIconsTree(data, names) {
    const icons = data.icons;
    const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
    const resolved = /* @__PURE__ */ Object.create(null);
    function resolve(name) {
      if (icons[name]) {
        return resolved[name] = [];
      }
      if (!(name in resolved)) {
        resolved[name] = null;
        const parent = aliases[name] && aliases[name].parent;
        const value = parent && resolve(parent);
        if (value) {
          resolved[name] = [parent].concat(value);
        }
      }
      return resolved[name];
    }
    Object.keys(icons).concat(Object.keys(aliases)).forEach(resolve);
    return resolved;
  }
  function internalGetIconData(data, name, tree) {
    const icons = data.icons;
    const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
    let currentProps = {};
    function parse(name2) {
      currentProps = mergeIconData(
        icons[name2] || aliases[name2],
        currentProps
      );
    }
    parse(name);
    tree.forEach(parse);
    return mergeIconData(data, currentProps);
  }
  function parseIconSet(data, callback) {
    const names = [];
    if (typeof data !== "object" || typeof data.icons !== "object") {
      return names;
    }
    if (data.not_found instanceof Array) {
      data.not_found.forEach((name) => {
        callback(name, null);
        names.push(name);
      });
    }
    const tree = getIconsTree(data);
    for (const name in tree) {
      const item = tree[name];
      if (item) {
        callback(name, internalGetIconData(data, name, item));
        names.push(name);
      }
    }
    return names;
  }
  const optionalPropertyDefaults = {
    provider: "",
    aliases: {},
    not_found: {},
    ...defaultIconDimensions
  };
  function checkOptionalProps(item, defaults) {
    for (const prop in defaults) {
      if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
        return false;
      }
    }
    return true;
  }
  function quicklyValidateIconSet(obj) {
    if (typeof obj !== "object" || obj === null) {
      return null;
    }
    const data = obj;
    if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
      return null;
    }
    if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
      return null;
    }
    const icons = data.icons;
    for (const name in icons) {
      const icon = icons[name];
      if (
        // Name cannot be empty
        !name || // Must have body
        typeof icon.body !== "string" || // Check other props
        !checkOptionalProps(
          icon,
          defaultExtendedIconProps
        )
      ) {
        return null;
      }
    }
    const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
    for (const name in aliases) {
      const icon = aliases[name];
      const parent = icon.parent;
      if (
        // Name cannot be empty
        !name || // Parent must be set and point to existing icon
        typeof parent !== "string" || !icons[parent] && !aliases[parent] || // Check other props
        !checkOptionalProps(
          icon,
          defaultExtendedIconProps
        )
      ) {
        return null;
      }
    }
    return data;
  }
  const dataStorage = /* @__PURE__ */ Object.create(null);
  function newStorage(provider, prefix) {
    return {
      provider,
      prefix,
      icons: /* @__PURE__ */ Object.create(null),
      missing: /* @__PURE__ */ new Set()
    };
  }
  function getStorage(provider, prefix) {
    const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
    return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
  }
  function addIconSet(storage2, data) {
    if (!quicklyValidateIconSet(data)) {
      return [];
    }
    return parseIconSet(data, (name, icon) => {
      if (icon) {
        storage2.icons[name] = icon;
      } else {
        storage2.missing.add(name);
      }
    });
  }
  function addIconToStorage(storage2, name, icon) {
    try {
      if (typeof icon.body === "string") {
        storage2.icons[name] = { ...icon };
        return true;
      }
    } catch (err) {
    }
    return false;
  }
  let simpleNames = false;
  function allowSimpleNames(allow) {
    if (typeof allow === "boolean") {
      simpleNames = allow;
    }
    return simpleNames;
  }
  function getIconData(name) {
    const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
    if (icon) {
      const storage2 = getStorage(icon.provider, icon.prefix);
      const iconName = icon.name;
      return storage2.icons[iconName] || (storage2.missing.has(iconName) ? null : void 0);
    }
  }
  function addIcon(name, data) {
    const icon = stringToIcon(name, true, simpleNames);
    if (!icon) {
      return false;
    }
    const storage2 = getStorage(icon.provider, icon.prefix);
    if (data) {
      return addIconToStorage(storage2, icon.name, data);
    } else {
      storage2.missing.add(icon.name);
      return true;
    }
  }
  function addCollection(data, provider) {
    if (typeof data !== "object") {
      return false;
    }
    if (typeof provider !== "string") {
      provider = data.provider || "";
    }
    if (simpleNames && !provider && !data.prefix) {
      let added = false;
      if (quicklyValidateIconSet(data)) {
        data.prefix = "";
        parseIconSet(data, (name, icon) => {
          if (addIcon(name, icon)) {
            added = true;
          }
        });
      }
      return added;
    }
    const prefix = data.prefix;
    if (!validateIconName({
      provider,
      prefix,
      name: "a"
    })) {
      return false;
    }
    const storage2 = getStorage(provider, prefix);
    return !!addIconSet(storage2, data);
  }
  const defaultIconSizeCustomisations = Object.freeze({
    width: null,
    height: null
  });
  const defaultIconCustomisations = Object.freeze({
    // Dimensions
    ...defaultIconSizeCustomisations,
    // Transformations
    ...defaultIconTransformations
  });
  const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
  const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
  function calculateSize(size, ratio, precision) {
    if (ratio === 1) {
      return size;
    }
    precision = precision || 100;
    if (typeof size === "number") {
      return Math.ceil(size * ratio * precision) / precision;
    }
    if (typeof size !== "string") {
      return size;
    }
    const oldParts = size.split(unitsSplit);
    if (oldParts === null || !oldParts.length) {
      return size;
    }
    const newParts = [];
    let code2 = oldParts.shift();
    let isNumber = unitsTest.test(code2);
    while (true) {
      if (isNumber) {
        const num = parseFloat(code2);
        if (isNaN(num)) {
          newParts.push(code2);
        } else {
          newParts.push(Math.ceil(num * ratio * precision) / precision);
        }
      } else {
        newParts.push(code2);
      }
      code2 = oldParts.shift();
      if (code2 === void 0) {
        return newParts.join("");
      }
      isNumber = !isNumber;
    }
  }
  function splitSVGDefs(content, tag = "defs") {
    let defs = "";
    const index = content.indexOf("<" + tag);
    while (index >= 0) {
      const start = content.indexOf(">", index);
      const end = content.indexOf("</" + tag);
      if (start === -1 || end === -1) {
        break;
      }
      const endEnd = content.indexOf(">", end);
      if (endEnd === -1) {
        break;
      }
      defs += content.slice(start + 1, end).trim();
      content = content.slice(0, index).trim() + content.slice(endEnd + 1);
    }
    return {
      defs,
      content
    };
  }
  function mergeDefsAndContent(defs, content) {
    return defs ? "<defs>" + defs + "</defs>" + content : content;
  }
  function wrapSVGContent(body, start, end) {
    const split = splitSVGDefs(body);
    return mergeDefsAndContent(split.defs, start + split.content + end);
  }
  const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
  function iconToSVG(icon, customisations) {
    const fullIcon = {
      ...defaultIconProps,
      ...icon
    };
    const fullCustomisations = {
      ...defaultIconCustomisations,
      ...customisations
    };
    const box = {
      left: fullIcon.left,
      top: fullIcon.top,
      width: fullIcon.width,
      height: fullIcon.height
    };
    let body = fullIcon.body;
    [fullIcon, fullCustomisations].forEach((props) => {
      const transformations = [];
      const hFlip = props.hFlip;
      const vFlip = props.vFlip;
      let rotation = props.rotate;
      if (hFlip) {
        if (vFlip) {
          rotation += 2;
        } else {
          transformations.push(
            "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
          );
          transformations.push("scale(-1 1)");
          box.top = box.left = 0;
        }
      } else if (vFlip) {
        transformations.push(
          "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
        );
        transformations.push("scale(1 -1)");
        box.top = box.left = 0;
      }
      let tempValue;
      if (rotation < 0) {
        rotation -= Math.floor(rotation / 4) * 4;
      }
      rotation = rotation % 4;
      switch (rotation) {
        case 1:
          tempValue = box.height / 2 + box.top;
          transformations.unshift(
            "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
          );
          break;
        case 2:
          transformations.unshift(
            "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
          );
          break;
        case 3:
          tempValue = box.width / 2 + box.left;
          transformations.unshift(
            "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
          );
          break;
      }
      if (rotation % 2 === 1) {
        if (box.left !== box.top) {
          tempValue = box.left;
          box.left = box.top;
          box.top = tempValue;
        }
        if (box.width !== box.height) {
          tempValue = box.width;
          box.width = box.height;
          box.height = tempValue;
        }
      }
      if (transformations.length) {
        body = wrapSVGContent(
          body,
          '<g transform="' + transformations.join(" ") + '">',
          "</g>"
        );
      }
    });
    const customisationsWidth = fullCustomisations.width;
    const customisationsHeight = fullCustomisations.height;
    const boxWidth = box.width;
    const boxHeight = box.height;
    let width;
    let height;
    if (customisationsWidth === null) {
      height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
      width = calculateSize(height, boxWidth / boxHeight);
    } else {
      width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
      height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    }
    const attributes = {};
    const setAttr = (prop, value) => {
      if (!isUnsetKeyword(value)) {
        attributes[prop] = value.toString();
      }
    };
    setAttr("width", width);
    setAttr("height", height);
    const viewBox = [box.left, box.top, boxWidth, boxHeight];
    attributes.viewBox = viewBox.join(" ");
    return {
      attributes,
      viewBox,
      body
    };
  }
  const regex = /\sid="(\S+)"/g;
  const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
  let counter = 0;
  function replaceIDs(body, prefix = randomPrefix) {
    const ids = [];
    let match;
    while (match = regex.exec(body)) {
      ids.push(match[1]);
    }
    if (!ids.length) {
      return body;
    }
    const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
    ids.forEach((id) => {
      const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
      const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      body = body.replace(
        // Allowed characters before id: [#;"]
        // Allowed characters after id: [)"], .[a-z]
        new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
        "$1" + newID + suffix + "$3"
      );
    });
    body = body.replace(new RegExp(suffix, "g"), "");
    return body;
  }
  const storage = /* @__PURE__ */ Object.create(null);
  function setAPIModule(provider, item) {
    storage[provider] = item;
  }
  function getAPIModule(provider) {
    return storage[provider] || storage[""];
  }
  function createAPIConfig(source) {
    let resources;
    if (typeof source.resources === "string") {
      resources = [source.resources];
    } else {
      resources = source.resources;
      if (!(resources instanceof Array) || !resources.length) {
        return null;
      }
    }
    const result = {
      // API hosts
      resources,
      // Root path
      path: source.path || "/",
      // URL length limit
      maxURL: source.maxURL || 500,
      // Timeout before next host is used.
      rotate: source.rotate || 750,
      // Timeout before failing query.
      timeout: source.timeout || 5e3,
      // Randomise default API end point.
      random: source.random === true,
      // Start index
      index: source.index || 0,
      // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
      dataAfterTimeout: source.dataAfterTimeout !== false
    };
    return result;
  }
  const configStorage = /* @__PURE__ */ Object.create(null);
  const fallBackAPISources = [
    "https://api.simplesvg.com",
    "https://api.unisvg.com"
  ];
  const fallBackAPI = [];
  while (fallBackAPISources.length > 0) {
    if (fallBackAPISources.length === 1) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      if (Math.random() > 0.5) {
        fallBackAPI.push(fallBackAPISources.shift());
      } else {
        fallBackAPI.push(fallBackAPISources.pop());
      }
    }
  }
  configStorage[""] = createAPIConfig({
    resources: ["https://api.iconify.design"].concat(fallBackAPI)
  });
  function addAPIProvider(provider, customConfig) {
    const config2 = createAPIConfig(customConfig);
    if (config2 === null) {
      return false;
    }
    configStorage[provider] = config2;
    return true;
  }
  function getAPIConfig(provider) {
    return configStorage[provider];
  }
  const detectFetch = () => {
    let callback;
    try {
      callback = fetch;
      if (typeof callback === "function") {
        return callback;
      }
    } catch (err) {
    }
  };
  let fetchModule = detectFetch();
  function calculateMaxLength(provider, prefix) {
    const config2 = getAPIConfig(provider);
    if (!config2) {
      return 0;
    }
    let result;
    if (!config2.maxURL) {
      result = 0;
    } else {
      let maxHostLength = 0;
      config2.resources.forEach((item) => {
        const host = item;
        maxHostLength = Math.max(maxHostLength, host.length);
      });
      const url2 = prefix + ".json?icons=";
      result = config2.maxURL - maxHostLength - config2.path.length - url2.length;
    }
    return result;
  }
  function shouldAbort(status) {
    return status === 404;
  }
  const prepare = (provider, prefix, icons) => {
    const results = [];
    const maxLength = calculateMaxLength(provider, prefix);
    const type = "icons";
    let item = {
      type,
      provider,
      prefix,
      icons: []
    };
    let length = 0;
    icons.forEach((name, index) => {
      length += name.length + 1;
      if (length >= maxLength && index > 0) {
        results.push(item);
        item = {
          type,
          provider,
          prefix,
          icons: []
        };
        length = name.length;
      }
      item.icons.push(name);
    });
    results.push(item);
    return results;
  };
  function getPath(provider) {
    if (typeof provider === "string") {
      const config2 = getAPIConfig(provider);
      if (config2) {
        return config2.path;
      }
    }
    return "/";
  }
  const send = (host, params, callback) => {
    if (!fetchModule) {
      callback("abort", 424);
      return;
    }
    let path = getPath(params.provider);
    switch (params.type) {
      case "icons": {
        const prefix = params.prefix;
        const icons = params.icons;
        const iconsList = icons.join(",");
        const urlParams = new URLSearchParams({
          icons: iconsList
        });
        path += prefix + ".json?" + urlParams.toString();
        break;
      }
      case "custom": {
        const uri = params.uri;
        path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
        break;
      }
      default:
        callback("abort", 400);
        return;
    }
    let defaultError = 503;
    fetchModule(host + path).then((response2) => {
      const status = response2.status;
      if (status !== 200) {
        setTimeout(() => {
          callback(shouldAbort(status) ? "abort" : "next", status);
        });
        return;
      }
      defaultError = 501;
      return response2.json();
    }).then((data) => {
      if (typeof data !== "object" || data === null) {
        setTimeout(() => {
          if (data === 404) {
            callback("abort", data);
          } else {
            callback("next", defaultError);
          }
        });
        return;
      }
      setTimeout(() => {
        callback("success", data);
      });
    }).catch(() => {
      callback("next", defaultError);
    });
  };
  const fetchAPIModule = {
    prepare,
    send
  };
  function sortIcons(icons) {
    const result = {
      loaded: [],
      missing: [],
      pending: []
    };
    const storage2 = /* @__PURE__ */ Object.create(null);
    icons.sort((a, b) => {
      if (a.provider !== b.provider) {
        return a.provider.localeCompare(b.provider);
      }
      if (a.prefix !== b.prefix) {
        return a.prefix.localeCompare(b.prefix);
      }
      return a.name.localeCompare(b.name);
    });
    let lastIcon = {
      provider: "",
      prefix: "",
      name: ""
    };
    icons.forEach((icon) => {
      if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
        return;
      }
      lastIcon = icon;
      const provider = icon.provider;
      const prefix = icon.prefix;
      const name = icon.name;
      const providerStorage = storage2[provider] || (storage2[provider] = /* @__PURE__ */ Object.create(null));
      const localStorage2 = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
      let list;
      if (name in localStorage2.icons) {
        list = result.loaded;
      } else if (prefix === "" || localStorage2.missing.has(name)) {
        list = result.missing;
      } else {
        list = result.pending;
      }
      const item = {
        provider,
        prefix,
        name
      };
      list.push(item);
    });
    return result;
  }
  function removeCallback(storages, id) {
    storages.forEach((storage2) => {
      const items = storage2.loaderCallbacks;
      if (items) {
        storage2.loaderCallbacks = items.filter((row) => row.id !== id);
      }
    });
  }
  function updateCallbacks(storage2) {
    if (!storage2.pendingCallbacksFlag) {
      storage2.pendingCallbacksFlag = true;
      setTimeout(() => {
        storage2.pendingCallbacksFlag = false;
        const items = storage2.loaderCallbacks ? storage2.loaderCallbacks.slice(0) : [];
        if (!items.length) {
          return;
        }
        let hasPending = false;
        const provider = storage2.provider;
        const prefix = storage2.prefix;
        items.forEach((item) => {
          const icons = item.icons;
          const oldLength = icons.pending.length;
          icons.pending = icons.pending.filter((icon) => {
            if (icon.prefix !== prefix) {
              return true;
            }
            const name = icon.name;
            if (storage2.icons[name]) {
              icons.loaded.push({
                provider,
                prefix,
                name
              });
            } else if (storage2.missing.has(name)) {
              icons.missing.push({
                provider,
                prefix,
                name
              });
            } else {
              hasPending = true;
              return true;
            }
            return false;
          });
          if (icons.pending.length !== oldLength) {
            if (!hasPending) {
              removeCallback([storage2], item.id);
            }
            item.callback(
              icons.loaded.slice(0),
              icons.missing.slice(0),
              icons.pending.slice(0),
              item.abort
            );
          }
        });
      });
    }
  }
  let idCounter = 0;
  function storeCallback(callback, icons, pendingSources) {
    const id = idCounter++;
    const abort = removeCallback.bind(null, pendingSources, id);
    if (!icons.pending.length) {
      return abort;
    }
    const item = {
      id,
      icons,
      callback,
      abort
    };
    pendingSources.forEach((storage2) => {
      (storage2.loaderCallbacks || (storage2.loaderCallbacks = [])).push(item);
    });
    return abort;
  }
  function listToIcons(list, validate = true, simpleNames2 = false) {
    const result = [];
    list.forEach((item) => {
      const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames2) : item;
      if (icon) {
        result.push(icon);
      }
    });
    return result;
  }
  var defaultConfig = {
    resources: [],
    index: 0,
    timeout: 2e3,
    rotate: 750,
    random: false,
    dataAfterTimeout: false
  };
  function sendQuery(config2, payload, query, done) {
    const resourcesCount = config2.resources.length;
    const startIndex = config2.random ? Math.floor(Math.random() * resourcesCount) : config2.index;
    let resources;
    if (config2.random) {
      let list = config2.resources.slice(0);
      resources = [];
      while (list.length > 1) {
        const nextIndex = Math.floor(Math.random() * list.length);
        resources.push(list[nextIndex]);
        list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
      }
      resources = resources.concat(list);
    } else {
      resources = config2.resources.slice(startIndex).concat(config2.resources.slice(0, startIndex));
    }
    const startTime = Date.now();
    let status = "pending";
    let queriesSent = 0;
    let lastError;
    let timer = null;
    let queue = [];
    let doneCallbacks = [];
    if (typeof done === "function") {
      doneCallbacks.push(done);
    }
    function resetTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function abort() {
      if (status === "pending") {
        status = "aborted";
      }
      resetTimer();
      queue.forEach((item) => {
        if (item.status === "pending") {
          item.status = "aborted";
        }
      });
      queue = [];
    }
    function subscribe(callback, overwrite) {
      if (overwrite) {
        doneCallbacks = [];
      }
      if (typeof callback === "function") {
        doneCallbacks.push(callback);
      }
    }
    function getQueryStatus() {
      return {
        startTime,
        payload,
        status,
        queriesSent,
        queriesPending: queue.length,
        subscribe,
        abort
      };
    }
    function failQuery() {
      status = "failed";
      doneCallbacks.forEach((callback) => {
        callback(void 0, lastError);
      });
    }
    function clearQueue() {
      queue.forEach((item) => {
        if (item.status === "pending") {
          item.status = "aborted";
        }
      });
      queue = [];
    }
    function moduleResponse(item, response2, data) {
      const isError = response2 !== "success";
      queue = queue.filter((queued) => queued !== item);
      switch (status) {
        case "pending":
          break;
        case "failed":
          if (isError || !config2.dataAfterTimeout) {
            return;
          }
          break;
        default:
          return;
      }
      if (response2 === "abort") {
        lastError = data;
        failQuery();
        return;
      }
      if (isError) {
        lastError = data;
        if (!queue.length) {
          if (!resources.length) {
            failQuery();
          } else {
            execNext();
          }
        }
        return;
      }
      resetTimer();
      clearQueue();
      if (!config2.random) {
        const index = config2.resources.indexOf(item.resource);
        if (index !== -1 && index !== config2.index) {
          config2.index = index;
        }
      }
      status = "completed";
      doneCallbacks.forEach((callback) => {
        callback(data);
      });
    }
    function execNext() {
      if (status !== "pending") {
        return;
      }
      resetTimer();
      const resource = resources.shift();
      if (resource === void 0) {
        if (queue.length) {
          timer = setTimeout(() => {
            resetTimer();
            if (status === "pending") {
              clearQueue();
              failQuery();
            }
          }, config2.timeout);
          return;
        }
        failQuery();
        return;
      }
      const item = {
        status: "pending",
        resource,
        callback: (status2, data) => {
          moduleResponse(item, status2, data);
        }
      };
      queue.push(item);
      queriesSent++;
      timer = setTimeout(execNext, config2.rotate);
      query(resource, payload, item.callback);
    }
    setTimeout(execNext);
    return getQueryStatus;
  }
  function initRedundancy(cfg) {
    const config2 = {
      ...defaultConfig,
      ...cfg
    };
    let queries = [];
    function cleanup() {
      queries = queries.filter((item) => item().status === "pending");
    }
    function query(payload, queryCallback, doneCallback) {
      const query2 = sendQuery(
        config2,
        payload,
        queryCallback,
        (data, error) => {
          cleanup();
          if (doneCallback) {
            doneCallback(data, error);
          }
        }
      );
      queries.push(query2);
      return query2;
    }
    function find(callback) {
      return queries.find((value) => {
        return callback(value);
      }) || null;
    }
    const instance = {
      query,
      find,
      setIndex: (index) => {
        config2.index = index;
      },
      getIndex: () => config2.index,
      cleanup
    };
    return instance;
  }
  function emptyCallback$1() {
  }
  const redundancyCache = /* @__PURE__ */ Object.create(null);
  function getRedundancyCache(provider) {
    if (!redundancyCache[provider]) {
      const config2 = getAPIConfig(provider);
      if (!config2) {
        return;
      }
      const redundancy = initRedundancy(config2);
      const cachedReundancy = {
        config: config2,
        redundancy
      };
      redundancyCache[provider] = cachedReundancy;
    }
    return redundancyCache[provider];
  }
  function sendAPIQuery(target, query, callback) {
    let redundancy;
    let send2;
    if (typeof target === "string") {
      const api = getAPIModule(target);
      if (!api) {
        callback(void 0, 424);
        return emptyCallback$1;
      }
      send2 = api.send;
      const cached = getRedundancyCache(target);
      if (cached) {
        redundancy = cached.redundancy;
      }
    } else {
      const config2 = createAPIConfig(target);
      if (config2) {
        redundancy = initRedundancy(config2);
        const moduleKey = target.resources ? target.resources[0] : "";
        const api = getAPIModule(moduleKey);
        if (api) {
          send2 = api.send;
        }
      }
    }
    if (!redundancy || !send2) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    return redundancy.query(query, send2, callback)().abort;
  }
  function emptyCallback() {
  }
  function loadedNewIcons(storage2) {
    if (!storage2.iconsLoaderFlag) {
      storage2.iconsLoaderFlag = true;
      setTimeout(() => {
        storage2.iconsLoaderFlag = false;
        updateCallbacks(storage2);
      });
    }
  }
  function checkIconNamesForAPI(icons) {
    const valid = [];
    const invalid = [];
    icons.forEach((name) => {
      (name.match(matchIconName) ? valid : invalid).push(name);
    });
    return {
      valid,
      invalid
    };
  }
  function parseLoaderResponse(storage2, icons, data) {
    function checkMissing() {
      const pending = storage2.pendingIcons;
      icons.forEach((name) => {
        if (pending) {
          pending.delete(name);
        }
        if (!storage2.icons[name]) {
          storage2.missing.add(name);
        }
      });
    }
    if (data && typeof data === "object") {
      try {
        const parsed = addIconSet(storage2, data);
        if (!parsed.length) {
          checkMissing();
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkMissing();
    loadedNewIcons(storage2);
  }
  function parsePossiblyAsyncResponse(response2, callback) {
    if (response2 instanceof Promise) {
      response2.then((data) => {
        callback(data);
      }).catch(() => {
        callback(null);
      });
    } else {
      callback(response2);
    }
  }
  function loadNewIcons(storage2, icons) {
    if (!storage2.iconsToLoad) {
      storage2.iconsToLoad = icons;
    } else {
      storage2.iconsToLoad = storage2.iconsToLoad.concat(icons).sort();
    }
    if (!storage2.iconsQueueFlag) {
      storage2.iconsQueueFlag = true;
      setTimeout(() => {
        storage2.iconsQueueFlag = false;
        const { provider, prefix } = storage2;
        const icons2 = storage2.iconsToLoad;
        delete storage2.iconsToLoad;
        if (!icons2 || !icons2.length) {
          return;
        }
        const customIconLoader = storage2.loadIcon;
        if (storage2.loadIcons && (icons2.length > 1 || !customIconLoader)) {
          parsePossiblyAsyncResponse(
            storage2.loadIcons(icons2, prefix, provider),
            (data) => {
              parseLoaderResponse(storage2, icons2, data);
            }
          );
          return;
        }
        if (customIconLoader) {
          icons2.forEach((name) => {
            const response2 = customIconLoader(name, prefix, provider);
            parsePossiblyAsyncResponse(response2, (data) => {
              const iconSet = data ? {
                prefix,
                icons: {
                  [name]: data
                }
              } : null;
              parseLoaderResponse(storage2, [name], iconSet);
            });
          });
          return;
        }
        const { valid, invalid } = checkIconNamesForAPI(icons2);
        if (invalid.length) {
          parseLoaderResponse(storage2, invalid, null);
        }
        if (!valid.length) {
          return;
        }
        const api = prefix.match(matchIconName) ? getAPIModule(provider) : null;
        if (!api) {
          parseLoaderResponse(storage2, valid, null);
          return;
        }
        const params = api.prepare(provider, prefix, valid);
        params.forEach((item) => {
          sendAPIQuery(provider, item, (data) => {
            parseLoaderResponse(storage2, item.icons, data);
          });
        });
      });
    }
  }
  const loadIcons = (icons, callback) => {
    const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
    const sortedIcons = sortIcons(cleanedIcons);
    if (!sortedIcons.pending.length) {
      let callCallback = true;
      if (callback) {
        setTimeout(() => {
          if (callCallback) {
            callback(
              sortedIcons.loaded,
              sortedIcons.missing,
              sortedIcons.pending,
              emptyCallback
            );
          }
        });
      }
      return () => {
        callCallback = false;
      };
    }
    const newIcons = /* @__PURE__ */ Object.create(null);
    const sources = [];
    let lastProvider, lastPrefix;
    sortedIcons.pending.forEach((icon) => {
      const { provider, prefix } = icon;
      if (prefix === lastPrefix && provider === lastProvider) {
        return;
      }
      lastProvider = provider;
      lastPrefix = prefix;
      sources.push(getStorage(provider, prefix));
      const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
      if (!providerNewIcons[prefix]) {
        providerNewIcons[prefix] = [];
      }
    });
    sortedIcons.pending.forEach((icon) => {
      const { provider, prefix, name } = icon;
      const storage2 = getStorage(provider, prefix);
      const pendingQueue = storage2.pendingIcons || (storage2.pendingIcons = /* @__PURE__ */ new Set());
      if (!pendingQueue.has(name)) {
        pendingQueue.add(name);
        newIcons[provider][prefix].push(name);
      }
    });
    sources.forEach((storage2) => {
      const list = newIcons[storage2.provider][storage2.prefix];
      if (list.length) {
        loadNewIcons(storage2, list);
      }
    });
    return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
  };
  function mergeCustomisations(defaults, item) {
    const result = {
      ...defaults
    };
    for (const key in item) {
      const value = item[key];
      const valueType = typeof value;
      if (key in defaultIconSizeCustomisations) {
        if (value === null || value && (valueType === "string" || valueType === "number")) {
          result[key] = value;
        }
      } else if (valueType === typeof result[key]) {
        result[key] = key === "rotate" ? value % 4 : value;
      }
    }
    return result;
  }
  const separator = /[\s,]+/;
  function flipFromString(custom, flip) {
    flip.split(separator).forEach((str) => {
      const value = str.trim();
      switch (value) {
        case "horizontal":
          custom.hFlip = true;
          break;
        case "vertical":
          custom.vFlip = true;
          break;
      }
    });
  }
  function rotateFromString(value, defaultValue = 0) {
    const units = value.replace(/^-?[0-9.]*/, "");
    function cleanup(value2) {
      while (value2 < 0) {
        value2 += 4;
      }
      return value2 % 4;
    }
    if (units === "") {
      const num = parseInt(value);
      return isNaN(num) ? 0 : cleanup(num);
    } else if (units !== value) {
      let split = 0;
      switch (units) {
        case "%":
          split = 25;
          break;
        case "deg":
          split = 90;
      }
      if (split) {
        let num = parseFloat(value.slice(0, value.length - units.length));
        if (isNaN(num)) {
          return 0;
        }
        num = num / split;
        return num % 1 === 0 ? cleanup(num) : 0;
      }
    }
    return defaultValue;
  }
  function iconToHTML(body, attributes) {
    let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
    for (const attr in attributes) {
      renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
  }
  function encodeSVGforURL(svg) {
    return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
  }
  function svgToData(svg) {
    return "data:image/svg+xml," + encodeSVGforURL(svg);
  }
  function svgToURL(svg) {
    return 'url("' + svgToData(svg) + '")';
  }
  const defaultExtendedIconCustomisations = {
    ...defaultIconCustomisations,
    inline: false
  };
  const svgDefaults = {
    "xmlns": "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    "aria-hidden": true,
    "role": "img"
  };
  const commonProps = {
    display: "inline-block"
  };
  const monotoneProps = {
    backgroundColor: "currentColor"
  };
  const coloredProps = {
    backgroundColor: "transparent"
  };
  const propsToAdd = {
    Image: "var(--svg)",
    Repeat: "no-repeat",
    Size: "100% 100%"
  };
  const propsToAddTo = {
    webkitMask: monotoneProps,
    mask: monotoneProps,
    background: coloredProps
  };
  for (const prefix in propsToAddTo) {
    const list = propsToAddTo[prefix];
    for (const prop in propsToAdd) {
      list[prefix + prop] = propsToAdd[prop];
    }
  }
  const customisationAliases = {};
  ["horizontal", "vertical"].forEach((prefix) => {
    const attr = prefix.slice(0, 1) + "Flip";
    customisationAliases[prefix + "-flip"] = attr;
    customisationAliases[prefix.slice(0, 1) + "-flip"] = attr;
    customisationAliases[prefix + "Flip"] = attr;
  });
  function fixSize(value) {
    return value + (value.match(/^[-0-9.]+$/) ? "px" : "");
  }
  const render = (icon, props) => {
    const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
    const componentProps = { ...svgDefaults };
    const mode = props.mode || "svg";
    const style = {};
    const propsStyle = props.style;
    const customStyle = typeof propsStyle === "object" && !(propsStyle instanceof Array) ? propsStyle : {};
    for (let key in props) {
      const value = props[key];
      if (value === void 0) {
        continue;
      }
      switch (key) {
        case "icon":
        case "style":
        case "onLoad":
        case "mode":
        case "ssr":
          break;
        case "inline":
        case "hFlip":
        case "vFlip":
          customisations[key] = value === true || value === "true" || value === 1;
          break;
        case "flip":
          if (typeof value === "string") {
            flipFromString(customisations, value);
          }
          break;
        case "color":
          style.color = value;
          break;
        case "rotate":
          if (typeof value === "string") {
            customisations[key] = rotateFromString(value);
          } else if (typeof value === "number") {
            customisations[key] = value;
          }
          break;
        case "ariaHidden":
        case "aria-hidden":
          if (value !== true && value !== "true") {
            delete componentProps["aria-hidden"];
          }
          break;
        default: {
          const alias = customisationAliases[key];
          if (alias) {
            if (value === true || value === "true" || value === 1) {
              customisations[alias] = true;
            }
          } else if (defaultExtendedIconCustomisations[key] === void 0) {
            componentProps[key] = value;
          }
        }
      }
    }
    const item = iconToSVG(icon, customisations);
    const renderAttribs = item.attributes;
    if (customisations.inline) {
      style.verticalAlign = "-0.125em";
    }
    if (mode === "svg") {
      componentProps.style = {
        ...style,
        ...customStyle
      };
      Object.assign(componentProps, renderAttribs);
      let localCounter = 0;
      let id = props.id;
      if (typeof id === "string") {
        id = id.replace(/-/g, "_");
      }
      componentProps["innerHTML"] = replaceIDs(item.body, id ? () => id + "ID" + localCounter++ : "iconifyVue");
      return vue.h("svg", componentProps);
    }
    const { body, width, height } = icon;
    const useMask = mode === "mask" || (mode === "bg" ? false : body.indexOf("currentColor") !== -1);
    const html = iconToHTML(body, {
      ...renderAttribs,
      width: width + "",
      height: height + ""
    });
    componentProps.style = {
      ...style,
      "--svg": svgToURL(html),
      "width": fixSize(renderAttribs.width),
      "height": fixSize(renderAttribs.height),
      ...commonProps,
      ...useMask ? monotoneProps : coloredProps,
      ...customStyle
    };
    return vue.h("span", componentProps);
  };
  allowSimpleNames(true);
  setAPIModule("", fetchAPIModule);
  if (typeof document !== "undefined" && typeof window !== "undefined") {
    const _window = window;
    if (_window.IconifyPreload !== void 0) {
      const preload = _window.IconifyPreload;
      const err = "Invalid IconifyPreload syntax.";
      if (typeof preload === "object" && preload !== null) {
        (preload instanceof Array ? preload : [preload]).forEach((item) => {
          try {
            if (
              // Check if item is an object and not null/array
              typeof item !== "object" || item === null || item instanceof Array || // Check for 'icons' and 'prefix'
              typeof item.icons !== "object" || typeof item.prefix !== "string" || // Add icon set
              !addCollection(item)
            ) {
              console.error(err);
            }
          } catch (e2) {
            console.error(err);
          }
        });
      }
    }
    if (_window.IconifyProviders !== void 0) {
      const providers = _window.IconifyProviders;
      if (typeof providers === "object" && providers !== null) {
        for (let key in providers) {
          const err = "IconifyProviders[" + key + "] is invalid.";
          try {
            const value = providers[key];
            if (typeof value !== "object" || !value || value.resources === void 0) {
              continue;
            }
            if (!addAPIProvider(key, value)) {
              console.error(err);
            }
          } catch (e2) {
            console.error(err);
          }
        }
      }
    }
  }
  const emptyIcon = {
    ...defaultIconProps,
    body: ""
  };
  const Icon = vue.defineComponent({
    // Do not inherit other attributes: it is handled by render()
    inheritAttrs: false,
    // Set initial data
    data() {
      return {
        // Current icon name
        _name: "",
        // Loading
        _loadingIcon: null,
        // Mounted status
        iconMounted: false,
        // Callback counter to trigger re-render
        counter: 0
      };
    },
    mounted() {
      this.iconMounted = true;
    },
    unmounted() {
      this.abortLoading();
    },
    methods: {
      abortLoading() {
        if (this._loadingIcon) {
          this._loadingIcon.abort();
          this._loadingIcon = null;
        }
      },
      // Get data for icon to render or null
      getIcon(icon, onload, customise) {
        if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
          this._name = "";
          this.abortLoading();
          return {
            data: icon
          };
        }
        let iconName;
        if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) {
          this.abortLoading();
          return null;
        }
        let data = getIconData(iconName);
        if (!data) {
          if (!this._loadingIcon || this._loadingIcon.name !== icon) {
            this.abortLoading();
            this._name = "";
            if (data !== null) {
              this._loadingIcon = {
                name: icon,
                abort: loadIcons([iconName], () => {
                  this.counter++;
                })
              };
            }
          }
          return null;
        }
        this.abortLoading();
        if (this._name !== icon) {
          this._name = icon;
          if (onload) {
            onload(icon);
          }
        }
        if (customise) {
          data = Object.assign({}, data);
          const customised = customise(data.body, iconName.name, iconName.prefix, iconName.provider);
          if (typeof customised === "string") {
            data.body = customised;
          }
        }
        const classes = ["iconify"];
        if (iconName.prefix !== "") {
          classes.push("iconify--" + iconName.prefix);
        }
        if (iconName.provider !== "") {
          classes.push("iconify--" + iconName.provider);
        }
        return { data, classes };
      }
    },
    // Render icon
    render() {
      this.counter;
      const props = this.$attrs;
      const icon = this.iconMounted || props.ssr ? this.getIcon(props.icon, props.onLoad, props.customise) : null;
      if (!icon) {
        return render(emptyIcon, props);
      }
      let newProps = props;
      if (icon.classes) {
        newProps = {
          ...props,
          class: (typeof props["class"] === "string" ? props["class"] + " " : "") + icon.classes.join(" ")
        };
      }
      return render({
        ...defaultIconProps,
        ...icon.data
      }, newProps);
    }
  });
  const _hoisted_1$i = { class: "display-type" };
  const _hoisted_2$f = { style: { "position": "relative" } };
  const _hoisted_3$b = {
    key: 0,
    class: "type-list"
  };
  const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
    __name: "BaseSelect",
    props: {
      displayType: {}
    },
    emits: ["update:displayType"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      let state = vue.reactive({
        showChangeDisplayType: false,
        lastDisplayType: null
      });
      function changeOption(item) {
        if (![CommentDisplayType.New, CommentDisplayType.Like].includes(props.displayType)) {
          state.lastDisplayType = props.displayType;
        }
        emit("update:displayType", item);
        state.showChangeDisplayType = false;
      }
      function clickDisplayType() {
        if ([CommentDisplayType.New, CommentDisplayType.Like].includes(props.displayType)) {
          return changeOption(state.lastDisplayType ?? CommentDisplayType.FloorInFloorNoCallUser);
        }
        state.showChangeDisplayType = !state.showChangeDisplayType;
      }
      const currentDisplayType = vue.computed(() => {
        let judge = props.displayType;
        if ([CommentDisplayType.New, CommentDisplayType.Like].includes(props.displayType)) {
          judge = state.lastDisplayType;
        }
        switch (judge) {
          case CommentDisplayType.FloorInFloorNoCallUser:
            return "楼中楼";
          case CommentDisplayType.FloorInFloor:
            return "楼中楼(@)";
          case CommentDisplayType.FloorInFloorNested:
            return "冗余楼中楼";
          case CommentDisplayType.V2exOrigin:
            return "V2原版";
          case CommentDisplayType.OnlyOp:
            return "只看楼主";
          default:
            return "楼中楼";
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$i, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["type", _ctx.displayType === vue.unref(CommentDisplayType).New && "active"]),
            onClick: _cache[0] || (_cache[0] = ($event) => changeOption(vue.unref(CommentDisplayType).New))
          }, "最新 ", 2),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["type", _ctx.displayType === vue.unref(CommentDisplayType).Like && "active"]),
            onClick: _cache[1] || (_cache[1] = ($event) => changeOption(vue.unref(CommentDisplayType).Like))
          }, "最热 ", 2),
          vue.createElementVNode("div", _hoisted_2$f, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["type", ![vue.unref(CommentDisplayType).New, vue.unref(CommentDisplayType).Like].includes(_ctx.displayType) && "active"]),
              onClick: clickDisplayType
            }, [
              vue.createElementVNode("span", null, vue.toDisplayString(currentDisplayType.value), 1),
              vue.createVNode(vue.unref(Icon), { icon: "mingcute:down-line" })
            ], 2),
            vue.unref(state).showChangeDisplayType ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$b, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["item", _ctx.displayType === vue.unref(CommentDisplayType).FloorInFloorNoCallUser && "active"]),
                onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => changeOption(vue.unref(CommentDisplayType).FloorInFloorNoCallUser), ["stop"]))
              }, "楼中楼 ", 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["item", _ctx.displayType === vue.unref(CommentDisplayType).FloorInFloor && "active"]),
                onClick: _cache[3] || (_cache[3] = vue.withModifiers(($event) => changeOption(vue.unref(CommentDisplayType).FloorInFloor), ["stop"]))
              }, "楼中楼(@) ", 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["item", _ctx.displayType === vue.unref(CommentDisplayType).FloorInFloorNested && "active"]),
                onClick: _cache[4] || (_cache[4] = vue.withModifiers(($event) => changeOption(vue.unref(CommentDisplayType).FloorInFloorNested), ["stop"]))
              }, "冗余楼中楼 ", 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["item", _ctx.displayType === vue.unref(CommentDisplayType).OnlyOp && "active"]),
                onClick: _cache[5] || (_cache[5] = vue.withModifiers(($event) => changeOption(vue.unref(CommentDisplayType).OnlyOp), ["stop"]))
              }, "只看楼主 ", 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(["item", _ctx.displayType === vue.unref(CommentDisplayType).V2exOrigin && "active"]),
                onClick: _cache[6] || (_cache[6] = vue.withModifiers(($event) => changeOption(vue.unref(CommentDisplayType).V2exOrigin), ["stop"]))
              }, "V2原版 ", 2)
            ])) : vue.createCommentVNode("", true)
          ])
        ]);
      };
    }
  });
  const BaseSelect = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-e4f684be"]]);
  const eventBus = {
    eventMap: /* @__PURE__ */ new Map(),
    on(eventType, cb) {
      let cbs = this.eventMap.get(eventType);
      if (cbs) {
        cbs.push(cb);
      } else {
        cbs = [cb];
      }
      this.eventMap.set(eventType, cbs);
    },
    offOne(eventType, cb) {
      let cbs = this.eventMap.get(eventType);
      if (cbs) {
        let rIndex = cbs.findIndex((c) => c === cb);
        if (rIndex > -1) {
          cbs.splice(rIndex, 1);
        }
      }
      this.eventMap.set(eventType, cbs);
    },
    emit(eventType, val) {
      let cbs = this.eventMap.get(eventType);
      if (cbs) {
        cbs.map((cb) => cb(val));
      }
    },
    off(eventType) {
      let cbs = this.eventMap.has(eventType);
      if (cbs) {
        this.eventMap.delete(eventType);
      }
    },
    clear() {
      this.eventMap = /* @__PURE__ */ new Map();
    }
  };
  const CMD = {
    SHOW_TOOLTIP: "SHOW_TOOLTIP",
    SHOW_MSG: "SHOW_MSG",
    SET_CALL: "SET_CALL",
    SHOW_CALL: "SHOW_CALL",
    REFRESH_ONCE: "REFRESH_ONCE",
    ADD_REPLY: "ADD_REPLY",
    IGNORE: "IGNORE",
    MERGE: "MERGE",
    REMOVE: "REMOVE",
    CHANGE_COMMENT_THANK: "CHANGE_COMMENT_THANK",
    CHANGE_POST_THANK: "CHANGE_POST_THANK",
    ADD_TAG: "ADD_TAG",
    REMOVE_TAG: "REMOVE_TAG",
    RELATION_REPLY: "RELATION_REPLY",
    JUMP: "JUMP",
    REFRESH_POST: "REFRESH_POST",
    SHOW_CONFIRM_MODAL: "SHOW_CONFIRM_MODAL",
    SHOW_CONFIRM_MODAL_CONFIRM: "SHOW_CONFIRM_MODAL_CONFIRM"
  };
  const _sfc_main$j = {
    name: "PopConfirm",
    props: {
      title: {
        type: String,
        default() {
          return "";
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        id: ""
      };
    },
    created() {
    },
    methods: {
      cb(id) {
        if (id === this.id) {
          this.$emit("confirm");
          this.id = "";
        }
      },
      showPop(e2) {
        if (this.disabled)
          return;
        let rect = e2.target.getBoundingClientRect();
        this.id = Date.now();
        eventBus.emit(CMD.SHOW_CONFIRM_MODAL, { title: this.title, rect, id: this.id });
        eventBus.offOne(CMD.SHOW_CONFIRM_MODAL_CONFIRM, this.cb);
        eventBus.on(CMD.SHOW_CONFIRM_MODAL_CONFIRM, this.cb);
      }
    },
    unmounted() {
      eventBus.offOne(CMD.SHOW_CONFIRM_MODAL_CONFIRM, this.cb);
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("span", {
      onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.showPop && $options.showPop(...args), ["stop"]))
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ]);
  }
  const PopConfirm = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$a]]);
  const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
    __name: "BaseLoading",
    props: {
      size: { default: "normal" }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["loading", [_ctx.size]])
        }, null, 2);
      };
    }
  });
  const BaseLoading = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-2697baa2"]]);
  const _hoisted_1$h = {
    key: 1,
    class: "key-notice"
  };
  const _hoisted_2$e = { class: "key" };
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
    __name: "BaseButton",
    props: {
      keyboard: {},
      active: { type: Boolean },
      disabled: { type: Boolean },
      loading: { type: Boolean },
      size: { default: "normal" },
      type: { default: "primary" }
    },
    emits: ["click"],
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(Tooltip, {
          disabled: !_ctx.keyboard,
          title: `快捷键: ${_ctx.keyboard}`
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", vue.mergeProps({ class: "base-button" }, _ctx.$attrs, {
              onClick: _cache[0] || (_cache[0] = (e2) => !_ctx.disabled && !_ctx.loading && _ctx.$emit("click", e2)),
              class: [
                _ctx.active && "active",
                _ctx.size,
                _ctx.type,
                (_ctx.disabled || _ctx.loading) && "disabled",
                !_ctx.disabled && "hvr-grow"
              ]
            }), [
              vue.createElementVNode("span", {
                style: vue.normalizeStyle({ opacity: _ctx.loading ? 0 : 1 })
              }, [
                vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ], 4),
              _ctx.loading ? (vue.openBlock(), vue.createBlock(BaseLoading, {
                key: 0,
                size: "small"
              })) : vue.createCommentVNode("", true),
              _ctx.keyboard ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$h, [
                vue.createElementVNode("span", _hoisted_2$e, vue.toDisplayString(_ctx.keyboard), 1)
              ])) : vue.createCommentVNode("", true)
            ], 16)
          ]),
          _: 3
        }, 8, ["disabled", "title"]);
      };
    }
  });
  const BaseButton = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-5a7d79ba"]]);
  const _sfc_main$g = {
    name: "Setting",
    components: {
      BaseButton,
      PopConfirm,
      Icon,
      BaseSelect,
      BaseSwitch,
      Tooltip
    },
    inject: ["isNight"],
    props: {
      show: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        tabIndex: 0
      };
    },
    methods: {
      confirm() {
        this.close();
        this.$emit("confirm");
      },
      close() {
        this.$emit("update:show", false);
      }
    }
  };
  const _hoisted_1$g = {
    key: 0,
    class: "setting-modal modal"
  };
  const _hoisted_2$d = { class: "modal-root" };
  const _hoisted_3$a = { class: "modal-header" };
  const _hoisted_4$9 = { class: "body" };
  const _hoisted_5$8 = { class: "btns" };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_BaseButton = vue.resolveComponent("BaseButton");
    return vue.openBlock(), vue.createBlock(vue.Transition, null, {
      default: vue.withCtx(() => [
        $props.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$g, [
          vue.createElementVNode("div", {
            class: "mask",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.close && $options.close(...args))
          }),
          vue.createElementVNode("div", _hoisted_2$d, [
            vue.createElementVNode("div", _hoisted_3$a, [
              _cache[1] || (_cache[1] = vue.createElementVNode("div", { class: "title" }, " 使用需知 ", -1)),
              vue.createVNode(_component_Icon, {
                icon: "ic:round-close",
                onClick: $options.close
              }, null, 8, ["onClick"])
            ]),
            vue.createElementVNode("div", _hoisted_4$9, [
              _cache[4] || (_cache[4] = vue.createElementVNode("div", { class: "modal-content" }, [
                vue.createElementVNode("div", null, "开启此功能会带来以下影响"),
                vue.createElementVNode("div", null, "缺点"),
                vue.createElementVNode("div", { style: { "color": "red" } }, [
                  vue.createElementVNode("div", null, "1、你的IP可能会被封禁"),
                  vue.createElementVNode("div", null, "2、消耗更多流量，给服务器带来更大的负担"),
                  vue.createElementVNode("div", null, "3、你的V站浏览进度条会变快")
                ]),
                vue.createElementVNode("div", null, "优点"),
                vue.createElementVNode("div", null, "1、卡片模式，无需打开主题即可查看内容"),
                vue.createElementVNode("div", null, "2、打开主题时提前预览正文内容，无需等待加载"),
                vue.createElementVNode("div", null, "原理"),
                vue.createElementVNode("div", null, "1、解析列表所有主题ID，批量调用show.json接口，获取对应主题的正文"),
                vue.createElementVNode("div", null, "2、请求的主题数据会缓存到本地，不会重复请求，超过3天的数据会删除"),
                vue.createElementVNode("div", null, "3、前面4条会并发请求，4条以后的一秒请求一条")
              ], -1)),
              vue.createElementVNode("div", _hoisted_5$8, [
                vue.createVNode(_component_BaseButton, {
                  type: "link",
                  onClick: $options.close
                }, {
                  default: vue.withCtx(() => [..._cache[2] || (_cache[2] = [
                    vue.createTextVNode("不同意", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"]),
                vue.createVNode(_component_BaseButton, { onClick: $options.confirm }, {
                  default: vue.withCtx(() => [..._cache[3] || (_cache[3] = [
                    vue.createTextVNode("同意", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ])
          ])
        ])) : vue.createCommentVNode("", true)
      ]),
      _: 1
    });
  }
  const NoticeModal = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$9], ["__scopeId", "data-v-386b43d0"]]);
  const _sfc_main$f = {
    name: "Setting",
    components: {
      BaseButton,
      NoticeModal,
      PopConfirm,
      Icon,
      BaseSelect,
      BaseSwitch,
      Tooltip
    },
    inject: ["isNight", "isLogin"],
    props: {
      modelValue: {
        type: Object,
        default() {
          return {};
        }
      },
      show: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      return {
        tabIndex: 0,
        config: functions.clone(this.modelValue),
        showNotice: false,
        exportLoading: false,
        importLoading: false,
        importOk: false,
        showInput: true,
        total: 0,
        index: 0,
        endTime: "0"
      };
    },
    computed: {
      DefaultVal() {
        return DefaultVal;
      },
      CommentDisplayType() {
        return CommentDisplayType;
      },
      isNew() {
        return this.config.version < DefaultVal.currentVersion && window.isDeadline;
      }
    },
    watch: {
      config: {
        handler(n2) {
          n2.topReplyLoveMinCount = Math.trunc(n2.topReplyLoveMinCount);
          if (n2.topReplyLoveMinCount < 0) {
            n2.topReplyLoveMinCount = 1;
          }
          this.$emit("update:modelValue", n2);
        },
        deep: true
      },
      "config.loopCheckNotice"(n2) {
        if (n2) {
          this.config.loopCheckNoticeInterval = 5;
          this.config.whenNewNoticeGlimmer = false;
        } else {
          this.config.loopCheckNoticeInterval = 0;
          this.config.whenNewNoticeGlimmer = false;
          this.config.ddWebhook = "";
        }
      },
      show(n2) {
        if (n2) {
          if (this.config.version < DefaultVal.currentVersion) {
            $(".v2next-new").remove();
          }
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "unset";
        }
      }
    },
    methods: {
      goPost() {
        fetch(DefaultVal.hotUrl + "new.txt").then(async (r2) => {
          let r22 = await r2.text();
          if (r22) {
            functions.openNewTab(r22, true);
          } else {
            functions.openNewTab(DefaultVal.git, true);
          }
        }).catch(() => functions.openNewTab(DefaultVal.git, true));
      },
      close() {
        if (window.isDeadline) {
          this.config.version = DefaultVal.currentVersion;
        }
        this.$emit("update:show", false);
      },
      exportCollectList() {
        if (!this.isLogin) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
        }
        try {
          let run2 = function(i) {
            return new Promise((resolve) => {
              $.get(`/my/topics?p=${i}`).then((res) => {
                let body = $(functions.genDomFromHtmlString(res));
                let total = body.find(".page_normal").last().text();
                if (typeof total === "string") {
                  total = Number(total);
                }
                let list = [];
                body.find(".topic-link").each(function() {
                  let a = functions.parseA(this);
                  list.push({
                    title: a.title,
                    url: location.origin + "/t/" + a.id
                  });
                });
                resolve({ list, total });
              });
            });
          };
          let allList = [];
          this.exportLoading = true;
          run2(1).then(async (r2) => {
            allList = allList.concat(r2.list);
            if (r2.total > 1) {
              let getList = [];
              for (let i = 2; i <= r2.total; i++) {
                getList.push(run2(i));
              }
              let b = await Promise.allSettled(getList);
              allList = allList.concat(b.map((v) => v.value.list).flat());
            }
            console.log("all", allList);
            let pom = document.createElement("a");
            pom.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(allList, null, 2)));
            pom.setAttribute("download", "V2EX-收藏.json");
            if (document.createEvent) {
              let event = document.createEvent("MouseEvents");
              event.initEvent("click", true, true);
              pom.dispatchEvent(event);
            } else {
              pom.click();
            }
            this.exportLoading = false;
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "收藏列表导出成功！" });
          });
        } catch (e2) {
          this.exportLoading = false;
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "收藏列表导出失败！" });
        }
      },
      importCollectList(e2) {
        if (!this.isLogin) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
        }
        let file = e2.target.files[0];
        let fileName = file.name.split(".").pop().toLowerCase();
        console.log("e", file, fileName);
        if (fileName !== "json") {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "请导入 json 格式文件！" });
        }
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
          if (reader.result) {
            try {
              let list = JSON.parse(reader.result);
              console.log(list);
              this.importLoading = true;
              this.total = list.length;
              for (let i = 0; i < list.length; i++) {
                this.endTime = Math.floor((list.length - i) * 10 / 60);
                this.index = i;
                let v = list[i];
                let a = document.createElement("a");
                a.href = v.url;
                let { id } = functions.parseA(a);
                a.remove();
                let apiRes = await fetch(v.url);
                let htmlText = await apiRes.text();
                let hasPermission = htmlText.search("你要查看的页面需要先登录");
                if (hasPermission > -1 || apiRes.status === 404 || apiRes.status === 404 || apiRes.redirected) {
                  console.log("无权限", v.url, v.title);
                  continue;
                }
                if (htmlText.search("加入收藏") > -1) {
                  console.log("未收藏========>>", v.url, v.title);
                  let once = await window.fetchOnce();
                  let url2 = `${location.origin}/favorite/topic/${id}?once=${once}`;
                  await fetch(url2);
                  await functions.sleep(1e4);
                } else {
                  console.log("已收藏", v.url, v.title);
                }
                await functions.sleep(1e3);
              }
              this.importLoading = false;
              this.importOk = true;
            } catch (e3) {
              eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "数据解析失败！" });
            }
          } else {
            eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "数据为空！" });
          }
        };
        this.showInput = false;
        setTimeout(() => {
          this.showInput = true;
        }, 200);
      }
    }
  };
  const _hoisted_1$f = {
    key: 0,
    class: "setting-modal modal"
  };
  const _hoisted_2$c = { class: "modal-root" };
  const _hoisted_3$9 = { class: "modal-header" };
  const _hoisted_4$8 = {
    key: 0,
    class: "log"
  };
  const _hoisted_5$7 = { class: "body" };
  const _hoisted_6$7 = { class: "left" };
  const _hoisted_7$7 = { class: "tabs" };
  const _hoisted_8$7 = { class: "bottom" };
  const _hoisted_9$7 = { class: "icons" };
  const _hoisted_10$7 = ["href"];
  const _hoisted_11$6 = ["href"];
  const _hoisted_12$5 = { class: "modal-content" };
  const _hoisted_13$5 = { class: "scroll" };
  const _hoisted_14$4 = { key: 0 };
  const _hoisted_15$3 = { class: "border" };
  const _hoisted_16$3 = { class: "row" };
  const _hoisted_17$2 = { class: "wrapper" };
  const _hoisted_18$2 = { class: "radio-group2" };
  const _hoisted_19$2 = { class: "border" };
  const _hoisted_20$2 = { class: "row" };
  const _hoisted_21$1 = { class: "wrapper" };
  const _hoisted_22$1 = { class: "border" };
  const _hoisted_23$1 = { class: "row" };
  const _hoisted_24$1 = { class: "wrapper" };
  const _hoisted_25$1 = { class: "row" };
  const _hoisted_26$1 = { class: "wrapper" };
  const _hoisted_27$1 = { key: 1 };
  const _hoisted_28$1 = { class: "row border" };
  const _hoisted_29$1 = { class: "wrapper" };
  const _hoisted_30$1 = { class: "row border" };
  const _hoisted_31$1 = { class: "wrapper" };
  const _hoisted_32$1 = { class: "row border" };
  const _hoisted_33$1 = { class: "wrapper" };
  const _hoisted_34$1 = { class: "border" };
  const _hoisted_35 = { class: "row" };
  const _hoisted_36 = { class: "wrapper" };
  const _hoisted_37 = { class: "row border" };
  const _hoisted_38 = { class: "wrapper" };
  const _hoisted_39 = { class: "row border" };
  const _hoisted_40 = { class: "wrapper" };
  const _hoisted_41 = { class: "border" };
  const _hoisted_42 = { class: "row" };
  const _hoisted_43 = { class: "wrapper" };
  const _hoisted_44 = { class: "row border" };
  const _hoisted_45 = { class: "wrapper" };
  const _hoisted_46 = { class: "row border" };
  const _hoisted_47 = { class: "item-title" };
  const _hoisted_48 = { class: "wrapper" };
  const _hoisted_49 = { class: "row border" };
  const _hoisted_50 = { class: "item-title" };
  const _hoisted_51 = { class: "wrapper" };
  const _hoisted_52 = { key: 2 };
  const _hoisted_53 = { class: "border" };
  const _hoisted_54 = { class: "row" };
  const _hoisted_55 = { style: { "display": "inline-flex", "overflow": "hidden", "position": "relative" } };
  const _hoisted_56 = {
    key: 0,
    style: { "display": "inline", "margin-left": "10px", "font-size": "18px" }
  };
  const _hoisted_57 = {
    key: 1,
    style: { "display": "inline", "margin-left": "10px" }
  };
  const _hoisted_58 = { class: "row" };
  const _hoisted_59 = { class: "wrapper" };
  const _hoisted_60 = { class: "row border" };
  const _hoisted_61 = { class: "wrapper" };
  const _hoisted_62 = { class: "row" };
  const _hoisted_63 = { class: "wrapper" };
  const _hoisted_64 = { class: "row border" };
  const _hoisted_65 = { class: "wrapper" };
  const _hoisted_66 = { class: "border" };
  const _hoisted_67 = { class: "row" };
  const _hoisted_68 = { class: "wrapper" };
  const _hoisted_69 = { class: "row border" };
  const _hoisted_70 = { class: "wrapper" };
  const _hoisted_71 = { class: "row" };
  const _hoisted_72 = { class: "wrapper" };
  const _hoisted_73 = {
    key: 0,
    class: "sub-content"
  };
  const _hoisted_74 = { class: "row" };
  const _hoisted_75 = { class: "wrapper" };
  const _hoisted_76 = ["value"];
  const _hoisted_77 = { class: "row" };
  const _hoisted_78 = { class: "wrapper" };
  const _hoisted_79 = { class: "desc" };
  const _hoisted_80 = ["value"];
  const _hoisted_81 = { key: 3 };
  const _hoisted_82 = { class: "project-desc" };
  const _hoisted_83 = { style: { "line-height": "2" } };
  const _hoisted_84 = ["href"];
  const _hoisted_85 = ["href"];
  const _hoisted_86 = ["href"];
  const _hoisted_87 = ["href"];
  const _hoisted_88 = ["href"];
  const _hoisted_89 = ["href"];
  const _hoisted_90 = { class: "tips2" };
  const _hoisted_91 = { key: 4 };
  const _hoisted_92 = { class: "row" };
  const _hoisted_93 = { class: "wrapper" };
  const _hoisted_94 = { class: "border" };
  const _hoisted_95 = { class: "row" };
  const _hoisted_96 = { class: "wrapper" };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_BaseSwitch = vue.resolveComponent("BaseSwitch");
    const _component_BaseSelect = vue.resolveComponent("BaseSelect");
    const _component_BaseButton = vue.resolveComponent("BaseButton");
    const _component_NoticeModal = vue.resolveComponent("NoticeModal");
    return vue.openBlock(), vue.createBlock(vue.Transition, null, {
      default: vue.withCtx(() => [
        $props.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$f, [
          vue.createElementVNode("div", {
            class: "mask",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.close && $options.close(...args))
          }),
          vue.createElementVNode("div", _hoisted_2$c, [
            vue.createElementVNode("div", _hoisted_3$9, [
              _cache[38] || (_cache[38] = vue.createElementVNode("div", { class: "title" }, " 脚本设置 ", -1)),
              vue.createVNode(_component_Icon, {
                icon: "ic:round-close",
                onClick: $options.close
              }, null, 8, ["onClick"])
            ]),
            $options.isNew ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$8, [
              vue.createElementVNode("a", {
                onClick: _cache[1] || (_cache[1] = (...args) => $options.goPost && $options.goPost(...args))
              }, "New：手机App现已发布，支持楼中楼！PC脚本新增历史最热数据、imgur换源功能！点击查看详细介绍"),
              _cache[39] || (_cache[39] = vue.createElementVNode("div", { class: "new" }, null, -1))
            ])) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_5$7, [
              vue.createElementVNode("div", _hoisted_6$7, [
                vue.createElementVNode("div", _hoisted_7$7, [
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["tab", $data.tabIndex === 0 && "active"]),
                    onClick: _cache[2] || (_cache[2] = ($event) => $data.tabIndex = 0)
                  }, [
                    vue.createVNode(_component_Icon, { icon: "weui:setting-outlined" }),
                    _cache[40] || (_cache[40] = vue.createElementVNode("span", null, "列表", -1))
                  ], 2),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["tab", $data.tabIndex === 1 && "active"]),
                    onClick: _cache[3] || (_cache[3] = ($event) => $data.tabIndex = 1)
                  }, [
                    vue.createVNode(_component_Icon, { icon: "stash:article-alt-light" }),
                    _cache[41] || (_cache[41] = vue.createElementVNode("span", null, "主题", -1))
                  ], 2),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["tab", $data.tabIndex === 2 && "active"]),
                    onClick: _cache[4] || (_cache[4] = ($event) => $data.tabIndex = 2)
                  }, [
                    vue.createVNode(_component_Icon, { icon: "fluent:more-circle-20-regular" }),
                    _cache[42] || (_cache[42] = vue.createElementVNode("span", null, "其他", -1))
                  ], 2),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["tab", $data.tabIndex === 3 && "active"]),
                    onClick: _cache[5] || (_cache[5] = ($event) => $data.tabIndex = 3)
                  }, [
                    vue.createVNode(_component_Icon, { icon: "ix:about" }),
                    _cache[43] || (_cache[43] = vue.createElementVNode("span", null, "关于", -1))
                  ], 2),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(["tab", $data.tabIndex === 4 && "active"]),
                    onClick: _cache[6] || (_cache[6] = ($event) => $data.tabIndex = 4)
                  }, [
                    vue.createVNode(_component_Icon, { icon: "ix:about" }),
                    _cache[44] || (_cache[44] = vue.createElementVNode("span", null, "插件", -1))
                  ], 2)
                ]),
                vue.createElementVNode("div", _hoisted_8$7, [
                  _cache[45] || (_cache[45] = vue.createElementVNode("div", { class: "tip" }, " 如果可以的话欢迎点个star支持一下~ ", -1)),
                  vue.createElementVNode("div", _hoisted_9$7, [
                    vue.createElementVNode("a", {
                      href: $options.DefaultVal.git,
                      target: "_blank"
                    }, [
                      vue.createVNode(_component_Icon, { icon: "mdi:github" })
                    ], 8, _hoisted_10$7),
                    vue.createElementVNode("a", {
                      href: $options.DefaultVal.homeUrl,
                      target: "_blank"
                    }, [
                      vue.createVNode(_component_Icon, { icon: "iconamoon:home-light" })
                    ], 8, _hoisted_11$6)
                  ])
                ])
              ]),
              vue.createElementVNode("div", _hoisted_12$5, [
                vue.createElementVNode("div", _hoisted_13$5, [
                  $data.tabIndex === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_14$4, [
                    vue.createElementVNode("div", _hoisted_15$3, [
                      vue.createElementVNode("div", _hoisted_16$3, [
                        _cache[46] || (_cache[46] = vue.createElementVNode("label", { class: "item-title" }, "列表展示方式", -1)),
                        vue.createElementVNode("div", _hoisted_17$2, [
                          vue.createElementVNode("div", _hoisted_18$2, [
                            vue.createElementVNode("div", {
                              class: vue.normalizeClass(["radio", $data.config.viewType === "simple" ? "active" : ""]),
                              onClick: _cache[7] || (_cache[7] = ($event) => $data.config.viewType = "simple")
                            }, "简洁 ", 2),
                            vue.createElementVNode("div", {
                              class: vue.normalizeClass(["radio", $data.config.viewType === "table" ? "active" : ""]),
                              onClick: _cache[8] || (_cache[8] = ($event) => $data.config.viewType = "table")
                            }, "表格 ", 2),
                            vue.createElementVNode("div", {
                              class: vue.normalizeClass(["radio", $data.config.viewType === "card" ? "active" : ""]),
                              onClick: _cache[9] || (_cache[9] = ($event) => $data.showNotice = true)
                            }, "卡片 ", 2)
                          ])
                        ])
                      ]),
                      _cache[47] || (_cache[47] = vue.createElementVNode("div", { class: "desc danger" }, " 提示：此项需要刷新页面才能生效 ", -1))
                    ]),
                    vue.createElementVNode("div", _hoisted_19$2, [
                      vue.createElementVNode("div", _hoisted_20$2, [
                        _cache[48] || (_cache[48] = vue.createElementVNode("label", { class: "item-title" }, "主题弹框显示", -1)),
                        vue.createElementVNode("div", _hoisted_21$1, [
                          vue.createVNode(_component_BaseSwitch, {
                            modelValue: $data.config.clickPostItemOpenDetail,
                            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.config.clickPostItemOpenDetail = $event)
                          }, null, 8, ["modelValue"])
                        ])
                      ]),
                      _cache[49] || (_cache[49] = vue.createElementVNode("div", { class: "desc" }, [
                        vue.createTextVNode(" 开启此选项后，主题会"),
                        vue.createElementVNode("span", { class: "danger" }, "始终"),
                        vue.createTextVNode("以弹框的方式显示。优先级大于“新标签页打开链接” ")
                      ], -1))
                    ]),
                    vue.createElementVNode("div", _hoisted_22$1, [
                      vue.createElementVNode("div", _hoisted_23$1, [
                        _cache[50] || (_cache[50] = vue.createElementVNode("label", { class: "item-title" }, "新标签页打开链接", -1)),
                        vue.createElementVNode("div", _hoisted_24$1, [
                          vue.createVNode(_component_BaseSwitch, {
                            modelValue: $data.config.newTabOpen,
                            "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.config.newTabOpen = $event)
                          }, null, 8, ["modelValue"])
                        ])
                      ]),
                      _cache[51] || (_cache[51] = vue.createElementVNode("div", { class: "desc" }, " 网页上所有链接通过新标签页打开 ", -1))
                    ]),
                    vue.createElementVNode("div", _hoisted_25$1, [
                      _cache[52] || (_cache[52] = vue.createElementVNode("label", { class: "item-title" }, "打开新标签页时立即切换过去", -1)),
                      vue.createElementVNode("div", _hoisted_26$1, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.newTabOpenActive,
                          "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.config.newTabOpenActive = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ])
                  ])) : vue.createCommentVNode("", true),
                  $data.tabIndex === 1 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_27$1, [
                    vue.createElementVNode("div", _hoisted_28$1, [
                      _cache[53] || (_cache[53] = vue.createElementVNode("label", { class: "item-title" }, "回复类型", -1)),
                      vue.createElementVNode("div", _hoisted_29$1, [
                        vue.createVNode(_component_BaseSelect, {
                          "display-type": $data.config.commentDisplayType,
                          "onUpdate:displayType": _cache[13] || (_cache[13] = ($event) => $data.config.commentDisplayType = $event)
                        }, null, 8, ["display-type"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_30$1, [
                      _cache[54] || (_cache[54] = vue.createElementVNode("label", { class: "item-title" }, "详情页中显示“回复类型”", -1)),
                      vue.createElementVNode("div", _hoisted_31$1, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.showToolbar,
                          "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.config.showToolbar = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_32$1, [
                      _cache[55] || (_cache[55] = vue.createElementVNode("label", { class: "item-title" }, "替换Imgur源", -1)),
                      vue.createElementVNode("div", _hoisted_33$1, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.replaceImgur,
                          "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.config.replaceImgur = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_34$1, [
                      vue.createElementVNode("div", _hoisted_35, [
                        _cache[56] || (_cache[56] = vue.createElementVNode("label", { class: "item-title" }, "单独打开主题时默认显示楼中楼", -1)),
                        vue.createElementVNode("div", _hoisted_36, [
                          vue.createVNode(_component_BaseSwitch, {
                            modelValue: $data.config.autoOpenDetail,
                            "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.config.autoOpenDetail = $event)
                          }, null, 8, ["modelValue"])
                        ])
                      ]),
                      _cache[57] || (_cache[57] = vue.createElementVNode("div", { class: "desc" }, " 单独打开这种地址 https://v2ex.com/t/xxxx 时，是否默认显示楼中楼 ", -1))
                    ]),
                    vue.createElementVNode("div", _hoisted_37, [
                      _cache[58] || (_cache[58] = vue.createElementVNode("label", { class: "item-title" }, "点击左右两侧透明处关闭主题详情弹框", -1)),
                      vue.createElementVNode("div", _hoisted_38, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.closePostDetailBySpace,
                          "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.config.closePostDetailBySpace = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_39, [
                      _cache[59] || (_cache[59] = vue.createElementVNode("label", { class: "item-title" }, "正文超长自动折叠", -1)),
                      vue.createElementVNode("div", _hoisted_40, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.contentAutoCollapse,
                          "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.config.contentAutoCollapse = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_41, [
                      vue.createElementVNode("div", _hoisted_42, [
                        _cache[60] || (_cache[60] = vue.createElementVNode("label", { class: "item-title" }, "主题宽度", -1)),
                        vue.createElementVNode("div", _hoisted_43, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            type: "text",
                            "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $data.config.postWidth = $event)
                          }, null, 512), [
                            [vue.vModelText, $data.config.postWidth]
                          ])
                        ])
                      ]),
                      _cache[61] || (_cache[61] = vue.createElementVNode("div", { class: "desc" }, [
                        vue.createTextVNode(" 未设定此值时，则默认宽度为77rem。接受合法的width值： "),
                        vue.createElementVNode("a", {
                          style: { "color": "#40a9ff", "text-decoration": "underline" },
                          href: "https://vue3js.cn/interview/css/em_px_rem_vh_vw.html#%E4%BA%8C%E3%80%81%E5%8D%95%E4%BD%8D",
                          target: "_blank"
                        }, "rem、px、vw、vh(点此查看)"),
                        vue.createTextVNode("。 vw代表屏幕百分比，如想要屏幕的66%，请填写66vw ")
                      ], -1)),
                      _cache[62] || (_cache[62] = vue.createElementVNode("div", { class: "desc" }, " 提示：此项设置以后，单独打开详情页时会出现主题突然变宽（窄）的问题，暂时无解 ", -1)),
                      _cache[63] || (_cache[63] = vue.createElementVNode("div", { class: "desc danger" }, " 提示：此项需要刷新页面才能生效 ", -1))
                    ]),
                    _cache[65] || (_cache[65] = vue.createElementVNode("div", { class: "row" }, [
                      vue.createElementVNode("label", { class: "main-title" }, "高赞回复")
                    ], -1)),
                    vue.createElementVNode("div", _hoisted_44, [
                      _cache[64] || (_cache[64] = vue.createElementVNode("label", { class: "item-title" }, "显示高赞回复", -1)),
                      vue.createElementVNode("div", _hoisted_45, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.showTopReply,
                          "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => $data.config.showTopReply = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_46, [
                      vue.createElementVNode("label", _hoisted_47, "最多显示" + vue.toDisplayString($data.config.topReplyCount) + "个高赞回复", 1),
                      vue.createElementVNode("div", _hoisted_48, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          type: "number",
                          min: "1",
                          "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $data.config.topReplyCount = $event)
                        }, null, 512), [
                          [vue.vModelText, $data.config.topReplyCount]
                        ])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_49, [
                      vue.createElementVNode("label", _hoisted_50, "最少需要" + vue.toDisplayString($data.config.topReplyLoveMinCount) + "个赞才能被判定为高赞", 1),
                      vue.createElementVNode("div", _hoisted_51, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          type: "number",
                          min: "1",
                          "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => $data.config.topReplyLoveMinCount = $event)
                        }, null, 512), [
                          [vue.vModelText, $data.config.topReplyLoveMinCount]
                        ])
                      ])
                    ])
                  ])) : vue.createCommentVNode("", true),
                  $data.tabIndex === 2 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_52, [
                    _cache[84] || (_cache[84] = vue.createElementVNode("div", { class: "row" }, [
                      vue.createElementVNode("label", { class: "main-title" }, "收藏列表")
                    ], -1)),
                    vue.createElementVNode("div", _hoisted_53, [
                      vue.createElementVNode("div", _hoisted_54, [
                        vue.createElementVNode("div", null, [
                          vue.createVNode(_component_BaseButton, {
                            onClick: $options.exportCollectList,
                            loading: $data.exportLoading
                          }, {
                            default: vue.withCtx(() => [..._cache[66] || (_cache[66] = [
                              vue.createTextVNode("导出", -1)
                            ])]),
                            _: 1
                          }, 8, ["onClick", "loading"]),
                          _cache[68] || (_cache[68] = vue.createElementVNode("span", null, "   ", -1)),
                          vue.createElementVNode("div", _hoisted_55, [
                            vue.createVNode(_component_BaseButton, { loading: $data.importLoading }, {
                              default: vue.withCtx(() => [..._cache[67] || (_cache[67] = [
                                vue.createTextVNode("导入，并收藏", -1)
                              ])]),
                              _: 1
                            }, 8, ["loading"]),
                            $data.showInput ? (vue.openBlock(), vue.createElementBlock("input", {
                              key: 0,
                              type: "file",
                              style: { "position": "absolute", "width": "100%", "height": "100px", "opacity": "0" },
                              onChange: _cache[23] || (_cache[23] = (...args) => $options.importCollectList && $options.importCollectList(...args))
                            }, null, 32)) : vue.createCommentVNode("", true)
                          ]),
                          $data.importLoading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_56, " 导入中：" + vue.toDisplayString($data.index) + "/" + vue.toDisplayString($data.total) + " ，大约需要" + vue.toDisplayString($data.endTime) + "分钟，导入完成前请勿关闭和刷新本页面 ", 1)) : vue.createCommentVNode("", true),
                          $data.importOk ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_57, " 导入完成 ")) : vue.createCommentVNode("", true)
                        ])
                      ]),
                      _cache[69] || (_cache[69] = vue.createElementVNode("div", { class: "desc" }, " 默认导出为 json 文件，如需其他格式，请使用 ChatGpt/Deepseek 转换 ", -1))
                    ]),
                    vue.createElementVNode("div", _hoisted_58, [
                      _cache[70] || (_cache[70] = vue.createElementVNode("label", { class: "item-title" }, "收藏时提醒添加到书签", -1)),
                      vue.createElementVNode("div", _hoisted_59, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.collectBrowserNotice,
                          "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => $data.config.collectBrowserNotice = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    _cache[85] || (_cache[85] = vue.createElementVNode("div", { class: "desc" }, " 解释：V站帐号一旦被封禁，则无法登录，无法查看账号收藏了 ", -1)),
                    _cache[86] || (_cache[86] = vue.createElementVNode("div", { class: "row border" }, [
                      vue.createElementVNode("label", { class: "main-title" }, "其他")
                    ], -1)),
                    vue.createElementVNode("div", _hoisted_60, [
                      _cache[71] || (_cache[71] = vue.createElementVNode("label", { class: "item-title" }, "用户打标签(跨平台，数据保存在自己的记事本)：", -1)),
                      vue.createElementVNode("div", _hoisted_61, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.openTag,
                          "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => $data.config.openTag = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_62, [
                      _cache[72] || (_cache[72] = vue.createElementVNode("label", { class: "item-title" }, "划词显示Base64解码框", -1)),
                      vue.createElementVNode("div", _hoisted_63, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.base64,
                          "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => $data.config.base64 = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_64, [
                      _cache[73] || (_cache[73] = vue.createElementVNode("label", { class: "item-title" }, "自动签到", -1)),
                      vue.createElementVNode("div", _hoisted_65, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.autoSignin,
                          "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => $data.config.autoSignin = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_66, [
                      vue.createElementVNode("div", _hoisted_67, [
                        _cache[74] || (_cache[74] = vue.createElementVNode("label", { class: "item-title" }, "自定义背景", -1)),
                        vue.createElementVNode("div", _hoisted_68, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            type: "text",
                            "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => $data.config.customBgColor = $event)
                          }, null, 512), [
                            [vue.vModelText, $data.config.customBgColor]
                          ])
                        ])
                      ]),
                      _cache[75] || (_cache[75] = vue.createElementVNode("div", { class: "desc" }, [
                        vue.createTextVNode(" 未设定此值时，则脚本就什么都不做，V站大部分页面背景颜色默认为 #e2e2e2，少部分页面有特定背景。接受一个合法的css color值：例如"),
                        vue.createElementVNode("a", {
                          href: "https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value",
                          target: "_blank"
                        }, "red、#ffffff、rgb(222,222,22)(点此查看)"),
                        vue.createTextVNode("等等。 ")
                      ], -1)),
                      _cache[76] || (_cache[76] = vue.createElementVNode("div", { class: "desc danger" }, " 提示：此项需要刷新页面才能生效 ", -1))
                    ]),
                    _cache[87] || (_cache[87] = vue.createElementVNode("div", { class: "row" }, [
                      vue.createElementVNode("label", { class: "main-title" }, "消息通知")
                    ], -1)),
                    vue.createElementVNode("div", _hoisted_69, [
                      _cache[77] || (_cache[77] = vue.createElementVNode("label", { class: "item-title" }, "接管未读提醒页面", -1)),
                      vue.createElementVNode("div", _hoisted_70, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.notice.takeOverNoticePage,
                          "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => $data.config.notice.takeOverNoticePage = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_71, [
                      _cache[78] || (_cache[78] = vue.createElementVNode("label", { class: "item-title" }, "定时查询未读提醒", -1)),
                      vue.createElementVNode("div", _hoisted_72, [
                        vue.createVNode(_component_BaseSwitch, {
                          modelValue: $data.config.notice.loopCheckNotice,
                          "onUpdate:modelValue": _cache[30] || (_cache[30] = ($event) => $data.config.notice.loopCheckNotice = $event)
                        }, null, 8, ["modelValue"])
                      ])
                    ]),
                    _cache[88] || (_cache[88] = vue.createElementVNode("div", { class: "desc" }, " 开启此功能会带来以下影响： 1、你的IP可能会被封禁 2、消耗更多流量，给服务器带来更大的负担 3、你的V站浏览进度条会变快 ", -1)),
                    $data.config.notice.loopCheckNotice ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_73, [
                      vue.createElementVNode("div", _hoisted_74, [
                        _cache[80] || (_cache[80] = vue.createElementVNode("label", { class: "item-title" }, "查询间隔", -1)),
                        vue.createElementVNode("div", _hoisted_75, [
                          vue.createElementVNode("input", {
                            type: "number",
                            value: $data.config.notice.loopCheckNoticeInterval,
                            onBlur: _cache[31] || (_cache[31] = (e2) => $data.config.notice.loopCheckNoticeInterval = e2.target.value),
                            style: { "margin-right": "1rem" }
                          }, null, 40, _hoisted_76),
                          _cache[79] || (_cache[79] = vue.createTextVNode("分钟 ", -1))
                        ])
                      ]),
                      _cache[82] || (_cache[82] = vue.createElementVNode("div", { class: "desc" }, " 设置值太小，会导致频繁请求，你的IP可能会被封禁，建议设置为5，即每次5分钟查询一次 ", -1)),
                      vue.createElementVNode("div", _hoisted_77, [
                        _cache[81] || (_cache[81] = vue.createElementVNode("label", { class: "item-title" }, "当有新未读提醒时，网页标题闪烁", -1)),
                        vue.createElementVNode("div", _hoisted_78, [
                          vue.createVNode(_component_BaseSwitch, {
                            modelValue: $data.config.notice.whenNewNoticeGlimmer,
                            "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => $data.config.notice.whenNewNoticeGlimmer = $event)
                          }, null, 8, ["modelValue"])
                        ])
                      ]),
                      _cache[83] || (_cache[83] = vue.createElementVNode("div", { class: "row" }, [
                        vue.createElementVNode("label", { class: "item-title" }, "钉钉Webhook地址")
                      ], -1)),
                      vue.createElementVNode("div", _hoisted_79, [
                        vue.createElementVNode("input", {
                          type: "text",
                          value: $data.config.notice.ddWebhook,
                          onBlur: _cache[33] || (_cache[33] = (e2) => $data.config.notice.ddWebhook = e2.target.value),
                          style: { "width": "100%" }
                        }, null, 40, _hoisted_80)
                      ])
                    ])) : vue.createCommentVNode("", true),
                    _cache[89] || (_cache[89] = vue.createElementVNode("div", { class: "desc danger" }, " 提示：此项需要刷新页面才能生效 ", -1))
                  ])) : vue.createCommentVNode("", true),
                  $data.tabIndex === 3 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_81, [
                    _cache[97] || (_cache[97] = vue.createElementVNode("h1", null, "V2EX Next", -1)),
                    vue.createElementVNode("div", _hoisted_82, [
                      vue.createElementVNode("div", _hoisted_83, [
                        vue.createElementVNode("div", null, [
                          _cache[90] || (_cache[90] = vue.createTextVNode("官网：", -1)),
                          vue.createElementVNode("a", {
                            href: $options.DefaultVal.homeUrl,
                            target: "_blank"
                          }, vue.toDisplayString($options.DefaultVal.homeUrl), 9, _hoisted_84)
                        ]),
                        vue.createElementVNode("div", null, [
                          _cache[91] || (_cache[91] = vue.createTextVNode("GitHub地址：", -1)),
                          vue.createElementVNode("a", {
                            href: $options.DefaultVal.git,
                            target: "_blank"
                          }, vue.toDisplayString($options.DefaultVal.git), 9, _hoisted_85)
                        ]),
                        vue.createElementVNode("div", null, [
                          _cache[92] || (_cache[92] = vue.createTextVNode("PC脚本地址：", -1)),
                          vue.createElementVNode("a", {
                            href: $options.DefaultVal.pcScript,
                            target: "_blank"
                          }, vue.toDisplayString($options.DefaultVal.pcScript), 9, _hoisted_86)
                        ]),
                        vue.createElementVNode("div", null, [
                          _cache[93] || (_cache[93] = vue.createTextVNode("App地址：", -1)),
                          vue.createElementVNode("a", {
                            href: $options.DefaultVal.mobileScript,
                            target: "_blank"
                          }, vue.toDisplayString($options.DefaultVal.mobileScript), 9, _hoisted_87)
                        ]),
                        vue.createElementVNode("div", null, [
                          _cache[94] || (_cache[94] = vue.createTextVNode("反馈: ", -1)),
                          vue.createElementVNode("a", {
                            href: $options.DefaultVal.issue,
                            target: "_blank"
                          }, vue.toDisplayString($options.DefaultVal.issue), 9, _hoisted_88)
                        ]),
                        vue.createElementVNode("div", null, [
                          _cache[95] || (_cache[95] = vue.createTextVNode("更新日志：", -1)),
                          vue.createElementVNode("a", {
                            href: $options.DefaultVal.pcLog,
                            target: "_blank"
                          }, vue.toDisplayString($options.DefaultVal.pcLog), 9, _hoisted_89)
                        ])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_90, [
                      vue.createVNode(_component_Icon, { icon: "icon-park-outline:tips" }),
                      _cache[96] || (_cache[96] = vue.createElementVNode("span", null, "代码完全开源，greasyfork上的脚本代码与github上的代码打包后是一样的，不放心也可自行打包~", -1))
                    ])
                  ])) : vue.createCommentVNode("", true),
                  $data.tabIndex === 4 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_91, [
                    vue.createElementVNode("div", _hoisted_92, [
                      _cache[99] || (_cache[99] = vue.createElementVNode("label", { class: "item-title" }, "主题宽度", -1)),
                      vue.createElementVNode("div", _hoisted_93, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => $data.config.postWidth = $event)
                        }, null, 512), [
                          [vue.vModelText, $data.config.postWidth]
                        ]),
                        vue.createVNode(_component_BaseButton, {
                          onClick: $options.exportCollectList,
                          loading: $data.exportLoading
                        }, {
                          default: vue.withCtx(() => [..._cache[98] || (_cache[98] = [
                            vue.createTextVNode("导出", -1)
                          ])]),
                          _: 1
                        }, 8, ["onClick", "loading"])
                      ])
                    ]),
                    vue.createElementVNode("div", _hoisted_94, [
                      vue.createElementVNode("div", _hoisted_95, [
                        _cache[100] || (_cache[100] = vue.createElementVNode("label", { class: "item-title" }, "v2新帖挂件", -1)),
                        vue.createElementVNode("div", _hoisted_96, [
                          vue.createVNode(_component_BaseSwitch, {
                            modelValue: $data.config.notice.loopCheckNotice,
                            "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => $data.config.notice.loopCheckNotice = $event)
                          }, null, 8, ["modelValue"])
                        ])
                      ]),
                      _cache[101] || (_cache[101] = vue.createElementVNode("div", { class: "desc" }, " 脚本地址：https://greasyfork.org/zh-CN/scripts/448472 加载版本号： 0.11 加载地址：https://update.greasyfork.org/scripts/448472/1074290/v2%E6%96%B0%E5%B8%96%E6%8C%82%E4%BB%B6.user.js ", -1))
                    ])
                  ])) : vue.createCommentVNode("", true)
                ])
              ])
            ])
          ]),
          vue.createVNode(_component_NoticeModal, {
            show: $data.showNotice,
            "onUpdate:show": _cache[36] || (_cache[36] = ($event) => $data.showNotice = $event),
            onConfirm: _cache[37] || (_cache[37] = ($event) => $data.config.viewType = "card")
          }, null, 8, ["show"])
        ])) : vue.createCommentVNode("", true)
      ]),
      _: 1
    });
  }
  const Setting = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$8], ["__scopeId", "data-v-086214a4"]]);
  const _sfc_main$e = {
    name: "Point",
    components: { PopConfirm, Icon },
    inject: ["post", "isLogin"],
    props: {
      item: {
        type: Object,
        default() {
          return {};
        }
      },
      apiUrl: ""
    },
    computed: {
      disabled() {
        return this.item.username === window.user.username || this.item.isThanked || !this.isLogin;
      }
    },
    methods: {
      thankError() {
        if (!this.isLogin) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
        }
        if (this.item.username === window.user.username) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "不能感谢自己" });
        }
        if (this.item.isThanked) {
          return eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "已经感谢过了" });
        }
      },
      async thank() {
        this.$emit("addThank");
        let url2 = `${location.origin}/thank/${this.apiUrl}?once=${this.post.once}`;
        $.post(url2).then((res) => {
          if (!res.success) {
            this.$emit("recallThank");
            eventBus.emit(CMD.SHOW_MSG, { type: "error", text: res.message });
          }
          eventBus.emit(CMD.REFRESH_ONCE, res.once);
        }, (err) => {
          this.$emit("recallThank");
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "感谢失败" });
          eventBus.emit(CMD.REFRESH_ONCE);
        });
      }
    }
  };
  const _hoisted_1$e = {
    key: 2,
    class: "link-num"
  };
  const _hoisted_2$b = { key: 3 };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_PopConfirm = vue.resolveComponent("PopConfirm");
    return vue.openBlock(), vue.createBlock(_component_PopConfirm, {
      disabled: $options.disabled,
      title: `确认花费 10 个铜币向 @${$props.item.username} 的这条回复发送感谢？`,
      onConfirm: $options.thank
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["tool", [$options.disabled && "disabled"]]),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.thankError && $options.thankError(...args))
        }, [
          $props.item.isThanked ? (vue.openBlock(), vue.createBlock(_component_Icon, {
            key: 0,
            color: "rgb(224,42,42)",
            icon: "icon-park-solid:like"
          })) : (vue.openBlock(), vue.createBlock(_component_Icon, {
            key: 1,
            color: !$props.item.thankCount ? null : "rgb(224,42,42)",
            icon: "icon-park-outline:like"
          }, null, 8, ["color"])),
          $props.item.thankCount ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$e, vue.toDisplayString($props.item.thankCount), 1)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$b, "感谢"))
        ], 2)
      ]),
      _: 1
    }, 8, ["disabled", "title", "onConfirm"]);
  }
  const Point = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$7]]);
  const _sfc_main$d = {
    name: "Author",
    components: { PopConfirm, Point, Icon },
    inject: ["isLogin", "tags", "config", "isNight"],
    props: {
      modelValue: false,
      comment: {
        type: Object,
        default() {
          return {};
        }
      },
      type: {
        type: String,
        default() {
          return "list";
        }
      }
    },
    computed: {
      isDev() {
        return false;
      },
      pointInfo() {
        return {
          isThanked: this.comment.isThanked,
          thankCount: this.comment.thankCount,
          username: this.comment.username
        };
      },
      myTags() {
        return this.tags[this.comment.username] ?? [];
      },
      context() {
        return this.comment.replyUsers.length;
      }
    },
    methods: {
      jump() {
        eventBus.emit(CMD.JUMP, this.comment.floor);
      },
      showRelationReply() {
        if (!this.comment.replyUsers.length) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "该回复无上下文" });
          return;
        }
        eventBus.emit(CMD.RELATION_REPLY, {
          left: this.comment.replyUsers,
          right: this.comment.username,
          rightFloor: this.comment.floor
        });
      },
      addTag() {
        eventBus.emit(CMD.ADD_TAG, this.comment.username);
      },
      removeTag(tag) {
        eventBus.emit(CMD.REMOVE_TAG, { username: this.comment.username, tag });
      },
      checkIsLogin(emitName = "") {
        if (!this.isLogin) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
          return false;
        }
        this.$emit(emitName);
        return true;
      },
      addThank() {
        eventBus.emit(CMD.CHANGE_COMMENT_THANK, { id: this.comment.id, type: "add" });
      },
      recallThank() {
        eventBus.emit(CMD.CHANGE_COMMENT_THANK, { id: this.comment.id, type: "recall" });
      }
    }
  };
  const _hoisted_1$d = { class: "Author-left" };
  const _hoisted_2$a = ["href"];
  const _hoisted_3$8 = ["src"];
  const _hoisted_4$7 = { class: "texts" };
  const _hoisted_5$6 = ["href"];
  const _hoisted_6$6 = {
    key: 0,
    class: "owner"
  };
  const _hoisted_7$6 = {
    key: 1,
    class: "dup"
  };
  const _hoisted_8$6 = {
    key: 2,
    class: "mod"
  };
  const _hoisted_9$6 = { class: "ago" };
  const _hoisted_10$6 = { class: "my-tag" };
  const _hoisted_11$5 = ["onClick"];
  const _hoisted_12$4 = { class: "Author-right" };
  const _hoisted_13$4 = {
    key: 0,
    class: "toolbar"
  };
  const _hoisted_14$3 = { class: "tool" };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_PopConfirm = vue.resolveComponent("PopConfirm");
    const _component_Point = vue.resolveComponent("Point");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["Author", { expand: !$props.modelValue }])
    }, [
      vue.createElementVNode("div", _hoisted_1$d, [
        !$props.modelValue ? (vue.openBlock(), vue.createBlock(_component_Icon, {
          key: 0,
          onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => _ctx.$emit("update:modelValue", true), ["stop"])),
          color: "#177EC9",
          class: "expand-icon",
          icon: "gravity-ui:chevrons-expand-up-right"
        })) : vue.createCommentVNode("", true),
        $options.config.viewType !== "simple" ? (vue.openBlock(), vue.createElementBlock("a", {
          key: 1,
          class: "avatar",
          href: `/member/${$props.comment.username}`
        }, [
          vue.createElementVNode("img", {
            src: $props.comment.avatar,
            alt: ""
          }, null, 8, _hoisted_3$8)
        ], 8, _hoisted_2$a)) : vue.createCommentVNode("", true),
        vue.createElementVNode("span", _hoisted_4$7, [
          vue.createElementVNode("strong", null, [
            vue.createElementVNode("a", {
              href: `/member/${$props.comment.username}`,
              class: vue.normalizeClass(["username", { "dark": $options.isNight }])
            }, vue.toDisplayString($props.comment.username), 11, _hoisted_5$6)
          ]),
          $props.comment.isOp ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6$6, "OP")) : vue.createCommentVNode("", true),
          $props.comment.isDup ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7$6, "DUP")) : vue.createCommentVNode("", true),
          $props.comment.isMod ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8$6, "MOD")) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", _hoisted_9$6, vue.toDisplayString($props.comment.date), 1),
          $options.isLogin && $options.config.openTag ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.myTags, (i) => {
              return vue.openBlock(), vue.createElementBlock("span", _hoisted_10$6, [
                _cache[6] || (_cache[6] = vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1)),
                vue.createElementVNode("span", null, vue.toDisplayString(i), 1),
                vue.createElementVNode("i", {
                  class: "fa fa-trash-o remove",
                  onClick: vue.withModifiers(($event) => $options.removeTag(i), ["stop"])
                }, null, 8, _hoisted_11$5)
              ]);
            }), 256)),
            vue.createElementVNode("span", {
              class: "add-tag ago",
              onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.addTag && $options.addTag(...args), ["stop"])),
              title: "添加标签"
            }, "+")
          ], 64)) : vue.createCommentVNode("", true)
        ])
      ]),
      vue.createElementVNode("div", _hoisted_12$4, [
        $options.isLogin ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13$4, [
          vue.createVNode(_component_PopConfirm, {
            title: "确认隐藏这条回复?",
            onConfirm: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("hide"))
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_14$3, [
                vue.createVNode(_component_Icon, { icon: "fluent:eye-hide-24-regular" }),
                _cache[7] || (_cache[7] = vue.createElementVNode("span", null, "隐藏", -1))
              ])
            ]),
            _: 1
          }),
          $options.context ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "tool",
            onClick: _cache[3] || (_cache[3] = vue.withModifiers((...args) => $options.showRelationReply && $options.showRelationReply(...args), ["stop"]))
          }, [
            vue.createVNode(_component_Icon, { icon: "iconoir:page-search" }),
            _cache[8] || (_cache[8] = vue.createElementVNode("span", null, "上下文", -1))
          ])) : vue.createCommentVNode("", true),
          $props.type === "top" ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: "tool",
            onClick: _cache[4] || (_cache[4] = vue.withModifiers((...args) => $options.jump && $options.jump(...args), ["stop"]))
          }, [
            vue.createVNode(_component_Icon, { icon: "icon-park-outline:to-bottom" }),
            _cache[9] || (_cache[9] = vue.createElementVNode("span", null, "跳转", -1))
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: "tool",
            onClick: _cache[5] || (_cache[5] = vue.withModifiers(($event) => $options.checkIsLogin("reply"), ["stop"]))
          }, [
            vue.createVNode(_component_Icon, { icon: "mynaui:message" }),
            _cache[10] || (_cache[10] = vue.createElementVNode("span", null, "回复", -1))
          ]),
          vue.withDirectives(vue.createVNode(_component_Point, {
            item: $options.pointInfo,
            onAddThank: $options.addThank,
            onRecallThank: $options.recallThank,
            "api-url": "reply/" + $props.comment.id
          }, null, 8, ["item", "onAddThank", "onRecallThank", "api-url"]), [
            [vue.vShow, !$props.comment.thankCount]
          ])
        ])) : vue.createCommentVNode("", true),
        vue.withDirectives(vue.createVNode(_component_Point, {
          item: $options.pointInfo,
          onAddThank: $options.addThank,
          onRecallThank: $options.recallThank,
          "api-url": "reply/" + $props.comment.id
        }, null, 8, ["item", "onAddThank", "onRecallThank", "api-url"]), [
          [vue.vShow, $props.comment.thankCount]
        ]),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["floor", { isDev: $options.isDev }])
        }, vue.toDisplayString($props.comment.floor), 3)
      ])
    ], 2);
  }
  const Author = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$6], ["__scopeId", "data-v-64aa1930"]]);
  const _hoisted_1$c = { class: "get-cursor" };
  const _hoisted_2$9 = ["innerHTML"];
  const _hoisted_3$7 = { class: "toolbar" };
  const _hoisted_4$6 = { class: "left" };
  const _hoisted_5$5 = { class: "upload" };
  const _hoisted_6$5 = {
    key: 0,
    style: { "color": "black", "font-size": "1.4rem" }
  };
  const _hoisted_7$5 = { class: "right" };
  const _hoisted_8$5 = { class: "list" };
  const _hoisted_9$5 = ["src", "onClick"];
  const _hoisted_10$5 = { class: "emoji" };
  const _hoisted_11$4 = { class: "title" };
  const _hoisted_12$3 = { class: "list" };
  const _hoisted_13$3 = ["onClick"];
  const _sfc_main$c = {
    __name: "PostEditor",
    props: {
      replyUser: null,
      replyFloor: null,
      useType: {
        type: String,
        default() {
          return "reply-comment";
        }
      }
    },
    emits: ["close"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const { replyUser, replyFloor, useType } = props;
      const replyInfo = replyUser ? `@${replyUser} #${replyFloor} ` : "";
      const emits = __emit;
      const post = vue.inject("post");
      const show = vue.inject("show");
      const isNight = vue.inject("isNight");
      vue.inject("pageType");
      const allReplyUsers = vue.inject("allReplyUsers");
      let isFocus = vue.ref(false);
      const loading = vue.ref(false);
      const uploadLoading = vue.ref(false);
      const isShowEmoticons = vue.ref(false);
      const editorId = vue.ref("editorId_" + Date.now());
      const content = vue.ref(replyInfo);
      const txtRef = vue.ref(null);
      const cursorRef = vue.ref(null);
      const emoticonsRef = vue.ref(null);
      const none = vue.ref('<span style="white-space:pre-wrap;"> </span>');
      const imgurClientIdPool = [
        "3107b9ef8b316f3",
        "442b04f26eefc8a",
        "59cfebe717c09e4",
        "60605aad4a62882",
        "6c65ab1d3f5452a",
        "83e123737849aa9",
        "9311f6be1c10160",
        "c4a4a563f698595",
        "81be04b9e4a08ce"
      ];
      __expose({ content, isFocus: () => isFocus.value });
      const editorClass = vue.computed(() => {
        return [useType, isFocus.value ? "isFocus" : "", isNight.value ? "isNight" : ""];
      });
      const cursorHtml = vue.computed(() => {
        var _a;
        if (!txtRef.value || !content.value)
          return "";
        let index = ((_a = txtRef.value) == null ? void 0 : _a.selectionStart) || 0;
        return content.value.substring(0, index).replace(/</g, "<").replace(/>/g, ">").replace(/\n/g, "<br/>").replace(/\s/g, none.value);
      });
      const disabled = vue.computed(() => {
        if (content.value) {
          return content.value === replyInfo;
        } else {
          return true;
        }
      });
      function drop(e2) {
        e2.preventDefault();
        upload(e2.dataTransfer.files[0]);
      }
      async function upload(file) {
        if (!file)
          return;
        if (uploadLoading.value)
          return;
        uploadLoading.value = true;
        const formData = new FormData();
        formData.append("image", file);
        const randomIndex = Math.floor(Math.random() * imgurClientIdPool.length);
        const clidenId = imgurClientIdPool[randomIndex];
        const res = await fetch("https://api.imgur.com/3/upload", {
          method: "POST",
          headers: { Authorization: `Client-ID ${clidenId}` },
          body: formData
        });
        uploadLoading.value = false;
        if (res.ok) {
          const resData = await res.json();
          if (resData.success) {
            return insert(" " + resData.data.link + " ");
          }
        }
        eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "上传失败" });
      }
      async function submit() {
        if (disabled.value || loading.value)
          return;
        loading.value = true;
        let submit_content = content.value.replace(/\[((?!\[).)+\]/g, function(match) {
          let item2 = classicsEmoticons.find((v) => v.name === match);
          if (item2) {
            return item2.low + " ";
          }
          return match;
        });
        let show_content = content.value.replace(/https?:\/\/(i\.)?imgur\.com\/((?!http).)+\.(gif|png|jpg|jpeg|GIF|PNG|JPG|JPEG)/g, function(match) {
          return `<img src="${match}" data-originUrl="${match}" data-notice="这个img标签由v2ex-超级增强脚本解析" style="max-width: 100%">`;
        });
        show_content = show_content.replace(/\[((?!\[).)+\]/g, function(match) {
          let item2 = classicsEmoticons.find((v) => v.name === match);
          if (item2) {
            return `<a target="_blank" href="${item2.low}" rel="nofollow noopener"><img src="${item2.low}" class="embedded_image" rel="noreferrer"></a> `;
          }
          return match;
        });
        let matchUsers = show_content.match(/@([\w]+?[\s])/g);
        if (matchUsers) {
          matchUsers.map((i) => {
            let username = i.replace("@", "").replace(" ", "");
            show_content = show_content.replace(username, `<a href="/member/${username}">${username}</a>`);
          });
        }
        show_content = show_content.replaceAll("\n", "<br/>");
        let item = {
          thankCount: 0,
          isThanked: false,
          isOp: post.value.username === window.user.username,
          isDup: false,
          id: Date.now(),
          username: window.user.username,
          avatar: window.user.avatar,
          date: "几秒前",
          floor: post.value.replyCount + 1,
          reply_content: show_content ?? "",
          children: [],
          replyUsers: replyUser ? [replyUser] : [],
          replyFloor: replyFloor || -1,
          level: useType === "reply-comment" ? 1 : 0
        };
        item.hideCallUserReplyContent = item.reply_content;
        if (item.replyUsers.length === 1) {
          item.hideCallUserReplyContent = item.reply_content.replace(/@<a href="\/member\/[\s\S]+?<\/a>(?:<ul [\s\S]+<\/ul>)?(\s#[\d]+)?\s(<br>)?/, () => "");
        }
        let url2 = `${location.origin}/t/${post.value.id}`;
        $.post(url2, { content: submit_content, once: post.value.once }).then(
          // $.post(url, {content: submit_content, once: 123}).then(
          (res) => {
            loading.value = false;
            let r2 = res.search("你上一条回复的内容和这条相同");
            if (r2 > -1)
              return eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "你上一条回复的内容和这条相同" });
            r2 = res.search("请不要在每一个回复中都包括外链，这看起来像是在 spamming");
            if (r2 > -1)
              return eventBus.emit(CMD.SHOW_MSG, {
                type: "error",
                text: "请不要在每一个回复中都包括外链，这看起来像是在 spamming"
              });
            let r22 = res.search("创建新回复");
            if (r22 > -1) {
              eventBus.emit(CMD.REFRESH_ONCE, res);
              eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "回复出现了问题，请使用原版进行回复" });
              let clientWidth = window.document.body.clientWidth;
              let windowWidth = 1200;
              let left = clientWidth / 2 - windowWidth / 2;
              let newWin = window.open("创建新回复", "", `width=${windowWidth},height=600,left=${left},top=100`);
              newWin.document.write(res);
              let loop = setInterval(function() {
                if (newWin.closed) {
                  clearInterval(loop);
                  eventBus.emit(CMD.REFRESH_POST);
                }
              }, 1e3);
              return;
            }
            content.value = replyInfo;
            emits("close");
            eventBus.emit(CMD.REFRESH_ONCE, res);
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "回复成功" });
            eventBus.emit(CMD.ADD_REPLY, item);
          },
          (err) => {
            console.log("err", err);
            loading.value = false;
            eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "回复失败" });
          }
        ).catch((r2) => {
          console.log("catch", r2);
        });
      }
      function getEmojiSrc(url2) {
        return window.config.replaceImgur ? DefaultVal.imgurProxy + url2 : url2;
      }
      function showEmoticons(e2) {
        if (isShowEmoticons.value) {
          return isShowEmoticons.value = false;
        }
        let rect = e2.currentTarget.getBoundingClientRect();
        emoticonsRef.value.style.left = rect.left + 30 + "px";
        emoticonsRef.value.style.bottom = window.innerHeight - rect.top - 20 + "px";
        isShowEmoticons.value = true;
      }
      function off() {
        eventBus.emit(CMD.SHOW_CALL, { show: false });
        eventBus.off(CMD.SET_CALL);
      }
      function checkHeight2() {
        txtRef.value.style.height = 0;
        txtRef.value.style.height = txtRef.value.scrollHeight + "px";
      }
      function insert(str) {
        let cursorPos = txtRef.value.selectionStart;
        let start = content.value.slice(0, cursorPos);
        let end = content.value.slice(cursorPos, content.value.length);
        content.value = start + str + end;
        let moveCursorPos = start.length + str.length;
        setTimeout(() => {
          txtRef.value.focus();
          txtRef.value.setSelectionRange(moveCursorPos, moveCursorPos);
          checkHeight2();
        });
      }
      function showCallPopover(text) {
        let r2 = cursorRef.value.getBoundingClientRect();
        eventBus.emit(CMD.SHOW_CALL, { show: true, top: r2.top, left: r2.left, text });
        eventBus.off(CMD.SET_CALL);
        eventBus.on(CMD.SET_CALL, (e2) => {
          let cursorPos = txtRef.value.selectionStart;
          let start = content.value.slice(0, cursorPos);
          let end = content.value.slice(cursorPos, content.value.length);
          let lastCallPos = start.lastIndexOf("@");
          start = content.value.slice(0, lastCallPos + 1);
          if (e2 === "管理员") {
            e2 = "Livid @Kai @Olivia @GordianZ @sparanoid @drymonfidelia @GordianZ @sillydaddy";
          }
          if (e2 === "所有人") {
            e2 = allReplyUsers.value.map((v, i) => {
              if (i)
                return "@" + v;
              else
                return v;
            }).join(" ");
          }
          content.value = start + e2 + " " + end;
          let moveCursorPos = start.length + e2.length + 1;
          setTimeout(() => {
            txtRef.value.setSelectionRange(moveCursorPos, moveCursorPos);
            checkHeight2();
          });
          eventBus.off(CMD.SET_CALL);
        });
      }
      function onKeydown(e2) {
        let code2 = e2.keyCode;
        switch (code2) {
          case 8:
            if (content.value === "@") {
              off();
            }
            break;
          case 37:
          case 38:
          case 39:
          case 40:
            setTimeout(() => onInput({ data: "" }), 100);
            break;
          case 27:
            e2.preventDefault();
            e2.stopPropagation();
            e2.stopImmediatePropagation();
            return false;
          case 13:
            if (e2.ctrlKey)
              submit();
            if (e2.metaKey)
              submit();
            break;
        }
      }
      function onInput(e2) {
        let cursorPos = txtRef.value.selectionStart;
        if (!content.value)
          return;
        if (e2.data === " ") {
          return off();
        }
        if (e2.data === "@") {
          if (content.value.length !== 1) {
            if (content.value[cursorPos - 2] === " " || content.value[cursorPos - 2] === "\n") {
              return showCallPopover("");
            }
          } else {
            return showCallPopover("");
          }
          off();
        } else {
          checkHeight2();
          let judgeStr = content.value.slice(0, cursorPos);
          let lastCallPos = judgeStr.lastIndexOf("@");
          if (lastCallPos === -1) {
            return off();
          }
          let callStr = judgeStr.slice(lastCallPos, cursorPos);
          let hasSpace = callStr.includes(" ");
          if (hasSpace) {
            off();
          } else {
            if (lastCallPos === 0) {
              return showCallPopover(callStr.replace("@", ""));
            }
            if (content.value.length !== 1) {
              if (content.value[lastCallPos - 1] === " " || content.value[lastCallPos - 1] === "\n") {
                return showCallPopover(callStr.replace("@", ""));
              }
            } else {
              return showCallPopover(callStr.replace("@", ""));
            }
            off();
          }
        }
      }
      function onPaste(e2) {
        const dataTransferItemList = e2.clipboardData.items;
        const items = [].slice.call(dataTransferItemList).filter(function(item) {
          return item.type.indexOf("image") !== -1;
        });
        if (items.length === 0) {
          return;
        }
        const dataTransferItem = items[0];
        const blob = dataTransferItem.getAsFile();
        upload(blob);
      }
      function onBlur() {
        document.removeEventListener("paste", onPaste);
        isFocus.value = false;
      }
      function onFocusin() {
        document.addEventListener("paste", onPaste);
      }
      vue.watch(() => show, (n2) => {
        if (n2.value)
          isShowEmoticons.value = false;
      }, { deep: true });
      vue.onMounted(() => {
        $(`.${editorId.value}`).each(function() {
          this.setAttribute("style", "height:" + this.scrollHeight + "px;overflow-y:hidden;");
        }).on("input", function() {
          this.style.height = 0;
          this.style.height = this.scrollHeight + "px";
        });
        if (useType === "reply-comment") {
          txtRef.value && txtRef.value.focus();
        }
      });
      vue.onBeforeUnmount(() => {
        $(`.${editorId.value}`).off();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["post-editor-wrapper", editorClass.value])
        }, [
          vue.withDirectives(vue.createElementVNode("textarea", {
            class: vue.normalizeClass(["post-editor", editorId.value]),
            ref_key: "txtRef",
            ref: txtRef,
            onFocus: _cache[0] || (_cache[0] = ($event) => vue.isRef(isFocus) ? isFocus.value = true : isFocus = true),
            onBlur,
            onFocusin,
            placeholder: "请尽量让自己的回复能够对别人有帮助",
            onInput,
            onKeydown,
            onDrop: drop,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => content.value = $event)
          }, null, 34), [
            [vue.vModelText, content.value]
          ]),
          vue.createElementVNode("div", _hoisted_1$c, [
            vue.createElementVNode("span", { innerHTML: cursorHtml.value }, null, 8, _hoisted_2$9),
            vue.createElementVNode("span", {
              class: "cursor",
              ref_key: "cursorRef",
              ref: cursorRef
            }, "|", 512)
          ]),
          vue.createElementVNode("div", _hoisted_3$7, [
            vue.createElementVNode("div", _hoisted_4$6, [
              vue.createVNode(vue.unref(Icon), {
                onClick: vue.withModifiers(showEmoticons, ["stop"]),
                icon: "streamline:smiley-happy"
              }),
              vue.createElementVNode("div", _hoisted_5$5, [
                vue.createElementVNode("input", {
                  type: "file",
                  accept: "image/*",
                  onChange: _cache[2] || (_cache[2] = (e2) => upload(e2.currentTarget.files[0]))
                }, null, 32),
                vue.createVNode(vue.unref(Icon), { icon: "lets-icons:img-load-box-fill" })
              ]),
              uploadLoading.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6$5, "上传中.....")) : vue.createCommentVNode("", true)
            ]),
            vue.createElementVNode("div", _hoisted_7$5, [
              vue.unref(useType) === "reply-comment" ? (vue.openBlock(), vue.createBlock(BaseButton, {
                key: 0,
                type: "link",
                size: "small",
                style: { "margin-right": "1rem", "cursor": "pointer" },
                onClick: _cache[3] || (_cache[3] = vue.withModifiers(($event) => emits("close"), ["stop"]))
              }, {
                default: vue.withCtx(() => [..._cache[5] || (_cache[5] = [
                  vue.createTextVNode(" 关闭 ", -1)
                ])]),
                _: 1
              })) : vue.createCommentVNode("", true),
              vue.createVNode(BaseButton, {
                size: "small",
                disabled: disabled.value,
                loading: loading.value,
                onClick: vue.withModifiers(submit, ["stop"])
              }, {
                default: vue.withCtx(() => [..._cache[6] || (_cache[6] = [
                  vue.createTextVNode("回复 ", -1)
                ])]),
                _: 1
              }, 8, ["disabled", "loading"])
            ])
          ]),
          vue.withDirectives(vue.createElementVNode("div", {
            class: "emoticon-pack",
            ref_key: "emoticonsRef",
            ref: emoticonsRef
          }, [
            vue.createVNode(vue.unref(Icon), {
              icon: "ic:round-close",
              onClick: _cache[4] || (_cache[4] = vue.withModifiers(($event) => isShowEmoticons.value = false, ["stop"]))
            }),
            _cache[7] || (_cache[7] = vue.createElementVNode("div", { class: "title" }, "经典", -1)),
            vue.createElementVNode("div", _hoisted_8$5, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(classicsEmoticons), (item) => {
                return vue.openBlock(), vue.createElementBlock("img", {
                  src: getEmojiSrc(item.high),
                  referrerpolicy: "no-referrer",
                  onClick: vue.withModifiers(($event) => {
                    insert(item.name);
                    isShowEmoticons.value = false;
                  }, ["stop"])
                }, null, 8, _hoisted_9$5);
              }), 256))
            ]),
            vue.createElementVNode("div", _hoisted_10$5, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(emojiEmoticons), (item) => {
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
                  vue.createElementVNode("div", _hoisted_11$4, vue.toDisplayString(item.title), 1),
                  vue.createElementVNode("div", _hoisted_12$3, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item.list, (emoji) => {
                      return vue.openBlock(), vue.createElementBlock("span", {
                        onClick: vue.withModifiers(($event) => {
                          insert(emoji);
                          isShowEmoticons.value = false;
                        }, ["stop"])
                      }, vue.toDisplayString(emoji), 9, _hoisted_13$3);
                    }), 256))
                  ])
                ], 64);
              }), 256))
            ])
          ], 512), [
            [vue.vShow, isShowEmoticons.value]
          ])
        ], 2);
      };
    }
  };
  const PostEditor = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-0e56c62c"]]);
  const _hoisted_1$b = {
    key: 0,
    class: "html-wrapper"
  };
  const _hoisted_2$8 = ["innerHTML"];
  const checkHeight = 900;
  const _sfc_main$b = {
    __name: "BaseHtmlRender",
    props: ["html"],
    setup(__props) {
      const config2 = vue.inject("config");
      const props = __props;
      const contentRef = vue.ref(null);
      const mask = vue.ref(false);
      const handOpen = vue.ref(false);
      function mouseup(e2) {
        if (!config2.value.base64)
          return;
        let selectionText = window.getSelection().toString();
        if (selectionText) {
          let r2 = selectionText.match(/([A-Za-z0-9+/=]+)/g);
          if (r2) {
            if (r2[0].length < 4)
              return;
            eventBus.emit(CMD.SHOW_TOOLTIP, { text: r2[0], e: e2 });
          }
        }
      }
      vue.watch(config2.value, (newVale) => {
        if (!newVale.contentAutoCollapse) {
          mask.value = false;
        }
      });
      vue.watch([() => contentRef.value, () => props.html], () => {
        if (!contentRef.value || !props.html)
          return;
        if (!config2.value.contentAutoCollapse)
          return;
        contentRef.value.querySelectorAll("img").forEach((item) => {
          item.removeEventListener("load", checkContentHeight);
          item.addEventListener("load", checkContentHeight);
        });
        checkContentHeight();
      }, { immediate: true, flush: "post" });
      function checkContentHeight() {
        if (handOpen.value)
          return;
        if (!contentRef.value)
          return;
        let rect = contentRef.value.getBoundingClientRect();
        mask.value = rect.height >= checkHeight;
      }
      return (_ctx, _cache) => {
        return props.html ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$b, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass({ mask: mask.value })
          }, [
            vue.createElementVNode("div", {
              ref_key: "contentRef",
              ref: contentRef,
              innerHTML: props.html,
              onMouseup: mouseup
            }, null, 40, _hoisted_2$8)
          ], 2),
          mask.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "expand",
            onClick: _cache[0] || (_cache[0] = ($event) => {
              mask.value = false;
              handOpen.value = true;
            })
          }, "展开")) : vue.createCommentVNode("", true)
        ])) : vue.createCommentVNode("", true);
      };
    }
  };
  const BaseHtmlRender = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-6f61a860"]]);
  const _sfc_main$a = {
    name: "TopSubComment",
    components: { BaseHtmlRender, Author, PostEditor, Point, Icon },
    inject: ["post", "postDetailWidth", "show", "isNight", "isLogin", "tags", "config"],
    props: {
      modelValue: {
        reply_content: ""
      },
      level: -1
    },
    data() {
      return {
        expand: true,
        edit: false,
        replyInfo: `@${this.modelValue.username} #${this.modelValue.floor} `,
        floor: this.modelValue.floor
      };
    },
    watch: {
      show(e2) {
        if (e2) {
          this.edit = false;
        }
      }
    },
    computed: {
      myTags() {
        return this.tags[this.modelValue.username] ?? [];
      }
    },
    methods: {
      jump() {
        eventBus.emit(CMD.JUMP, this.modelValue.floor);
      }
    }
  };
  const _hoisted_1$a = ["data-floor"];
  const _hoisted_2$7 = { class: "right" };
  const _hoisted_3$6 = { class: "simple-wrapper" };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Author = vue.resolveComponent("Author");
    const _component_BaseHtmlRender = vue.resolveComponent("BaseHtmlRender");
    const _component_PostEditor = vue.resolveComponent("PostEditor");
    const _component_TopSubComment = vue.resolveComponent("TopSubComment", true);
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["top-sub-comment", $props.level === 1 && "top-sub-reply"]),
      ref: "comment",
      "data-floor": $data.floor
    }, [
      _cache[3] || (_cache[3] = vue.createElementVNode("div", { class: "left expand-line" }, null, -1)),
      vue.createElementVNode("div", _hoisted_2$7, [
        vue.createVNode(_component_Author, {
          modelValue: $data.expand,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.expand = $event),
          comment: $props.modelValue,
          onReply: _cache[1] || (_cache[1] = ($event) => $data.edit = !$data.edit),
          type: "top"
        }, null, 8, ["modelValue", "comment"]),
        vue.createVNode(_component_BaseHtmlRender, {
          class: "top-reply_content reply_content",
          html: $props.modelValue.hideCallUserReplyContent
        }, null, 8, ["html"]),
        $data.edit ? (vue.openBlock(), vue.createBlock(_component_PostEditor, {
          key: 0,
          onClose: _cache[2] || (_cache[2] = ($event) => $data.edit = false),
          replyInfo: $data.replyInfo,
          replyUser: $props.modelValue.username,
          replyFloor: $props.modelValue.floor
        }, null, 8, ["replyInfo", "replyUser", "replyFloor"])) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_3$6, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.modelValue.children, (item, index) => {
            return vue.openBlock(), vue.createBlock(_component_TopSubComment, {
              modelValue: $props.modelValue.children[index],
              "onUpdate:modelValue": ($event) => $props.modelValue.children[index] = $event,
              key: index
            }, null, 8, ["modelValue", "onUpdate:modelValue"]);
          }), 128))
        ])
      ])
    ], 10, _hoisted_1$a);
  }
  const TopSubComment = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$5], ["__scopeId", "data-v-d3f8c94b"]]);
  const _sfc_main$9 = {
    name: "Comment",
    components: { BaseHtmlRender, Author, PostEditor, Point, Icon, TopSubComment },
    inject: ["post", "postDetailWidth", "show", "isNight", "config"],
    props: {
      modelValue: {
        reply_content: ""
      },
      type: {
        type: String,
        default() {
          return "list";
        }
      }
    },
    data() {
      return {
        edit: false,
        ding: false,
        expand: true,
        expandTopReply: true,
        expandWrong: false,
        replyInfo: `@${this.modelValue.username} #${this.modelValue.floor} `,
        cssStyle: null,
        floor: this.modelValue.floor
      };
    },
    watch: {
      show(e2) {
        if (e2) {
          this.edit = false;
        }
      },
      postDetailWidth(n2, o) {
        this.checkIsTooLong(n2);
      }
    },
    computed: {
      CommentDisplayType() {
        return CommentDisplayType;
      },
      myClass() {
        return {
          isOp: this.modelValue.isOp,
          isSimple: this.config.viewType === "simple",
          ding: this.ding,
          isLevelOne: this.type === "top" ? true : this.modelValue.level === 0,
          ["c_" + this.floor]: this.type !== "top"
        };
      }
    },
    mounted() {
      this.checkIsTooLong(this.postDetailWidth);
    },
    methods: {
      checkIsTooLong(postDetailWidth) {
        if (postDetailWidth !== 0) {
          let rect = this.$refs.comment.getBoundingClientRect();
          let ban = postDetailWidth * 0.6;
          if (ban < rect.width && rect.width < ban + 25 && this.modelValue.children.length) {
            this.expand = false;
            let padding = 2;
            this.cssStyle = {
              padding: "1rem 0",
              width: `calc(${postDetailWidth}px - ${padding}rem)`,
              transform: `translateX(calc(${rect.width - postDetailWidth}px + ${padding}rem))`,
              background: this.isNight ? "#18222d" : "white"
            };
          }
        }
      },
      //高亮一下
      showDing() {
        this.ding = true;
        setTimeout(() => {
          this.ding = false;
        }, 2e3);
      },
      hide() {
        let url2 = `${location.origin}/ignore/reply/${this.modelValue.id}?once=${this.post.once}`;
        eventBus.emit(CMD.REMOVE, this.modelValue.floor);
        $.post(url2).then((res) => {
          eventBus.emit(CMD.REFRESH_ONCE);
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "隐藏成功" });
        }, (err) => {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "隐藏成功,仅本次有效（接口调用失败！）" });
        });
      },
      toggle() {
        this.expand = !this.expand;
      },
      jump() {
        eventBus.emit(CMD.JUMP, this.modelValue.floor);
      }
    }
  };
  const _hoisted_1$9 = ["data-floor"];
  const _hoisted_2$6 = { class: "comment-content" };
  const _hoisted_3$5 = { class: "right" };
  const _hoisted_4$5 = { class: "w" };
  const _hoisted_5$4 = {
    key: 0,
    class: "wrong-wrapper"
  };
  const _hoisted_6$4 = ["href"];
  const _hoisted_7$4 = { class: "del-line" };
  const _hoisted_8$4 = {
    key: 0,
    class: "warning"
  };
  const _hoisted_9$4 = { class: "simple-wrapper" };
  const _hoisted_10$4 = {
    key: 0,
    class: "top-reply-wrap"
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Author = vue.resolveComponent("Author");
    const _component_BaseHtmlRender = vue.resolveComponent("BaseHtmlRender");
    const _component_PostEditor = vue.resolveComponent("PostEditor");
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_TopSubComment = vue.resolveComponent("TopSubComment");
    const _component_Comment = vue.resolveComponent("Comment", true);
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["comment", $options.myClass]),
      ref: "comment",
      "data-floor": $data.floor
    }, [
      vue.createVNode(_component_Author, {
        modelValue: $data.expand,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.expand = $event),
        comment: $props.modelValue,
        onReply: _cache[1] || (_cache[1] = ($event) => $data.edit = !$data.edit),
        type: $props.type,
        onHide: $options.hide
      }, null, 8, ["modelValue", "comment", "type", "onHide"]),
      $data.cssStyle && !$data.expand ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "more ago",
        onClick: _cache[2] || (_cache[2] = ($event) => $data.expand = !$data.expand)
      }, " 由于嵌套回复层级太深，自动将后续回复隐藏 ")) : vue.createCommentVNode("", true),
      $data.expand ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: "comment-content-w",
        style: vue.normalizeStyle($data.cssStyle)
      }, [
        $data.cssStyle ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "more ago",
          onClick: _cache[3] || (_cache[3] = ($event) => $data.expand = !$data.expand)
        }, " 由于嵌套回复层级太深，自动将以下回复移至可见范围 ")) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_2$6, [
          vue.createElementVNode("div", {
            class: "left expand-line",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.toggle && $options.toggle(...args))
          }),
          vue.createElementVNode("div", _hoisted_3$5, [
            vue.createElementVNode("div", _hoisted_4$5, [
              $props.modelValue.isWrong ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$4, [
                vue.createElementVNode("span", {
                  onClick: _cache[5] || (_cache[5] = ($event) => $data.expandWrong = !$data.expandWrong),
                  title: "点击楼层号查看提示"
                }, [
                  vue.createElementVNode("a", {
                    href: "/member/" + $props.modelValue.replyUsers[0]
                  }, "@" + vue.toDisplayString($props.modelValue.replyUsers[0]) + "  ", 9, _hoisted_6$4),
                  vue.createElementVNode("span", _hoisted_7$4, "#" + vue.toDisplayString($props.modelValue.replyFloor), 1),
                  _cache[9] || (_cache[9] = vue.createElementVNode("i", {
                    class: "fa fa-question-circle-o wrong-icon",
                    "aria-hidden": "true"
                  }, null, -1))
                ]),
                $data.expandWrong ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8$4, [..._cache[10] || (_cache[10] = [
                  vue.createTextVNode(" 这条回复似乎有点问题，指定的楼层号与@的人对应不上 ", -1),
                  vue.createElementVNode("br", null, null, -1),
                  vue.createTextVNode(" 原因可能有下面几种： ", -1),
                  vue.createElementVNode("br", null, null, -1),
                  vue.createTextVNode(" 一、屏蔽用户导致楼层塌陷：你屏蔽了A，自A以后的回复的楼层号都会减1 ", -1),
                  vue.createElementVNode("br", null, null, -1),
                  vue.createTextVNode(" 二、忽略回复导致楼层塌陷：原理同上 ", -1),
                  vue.createElementVNode("br", null, null, -1),
                  vue.createTextVNode(" 三、层主回复时指定错了楼层号（同一，层主屏蔽了别人，导致楼层塌陷） ", -1),
                  vue.createElementVNode("br", null, null, -1),
                  vue.createTextVNode(" 四、脚本解析错误，请在 ", -1),
                  vue.createElementVNode("a", {
                    href: "https://github.com/zyronon/V2Next/issues",
                    target: "_blank"
                  }, "这里", -1),
                  vue.createTextVNode("反馈 ", -1)
                ])])) : vue.createCommentVNode("", true)
              ])) : vue.createCommentVNode("", true),
              [$options.CommentDisplayType.Like, $options.CommentDisplayType.FloorInFloorNoCallUser].includes($options.config.commentDisplayType) && $props.type !== "top" ? (vue.openBlock(), vue.createBlock(_component_BaseHtmlRender, {
                key: 1,
                class: "reply_content",
                html: $props.modelValue.hideCallUserReplyContent
              }, null, 8, ["html"])) : (vue.openBlock(), vue.createBlock(_component_BaseHtmlRender, {
                key: 2,
                class: "reply_content",
                html: $props.modelValue.reply_content
              }, null, 8, ["html"])),
              $data.edit ? (vue.openBlock(), vue.createBlock(_component_PostEditor, {
                key: 3,
                onClose: _cache[6] || (_cache[6] = ($event) => $data.edit = false),
                replyInfo: $data.replyInfo,
                replyUser: $props.modelValue.username,
                replyFloor: $props.modelValue.floor
              }, null, 8, ["replyInfo", "replyUser", "replyFloor"])) : vue.createCommentVNode("", true),
              $props.type === "top" && $props.modelValue.replyCount ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 4,
                class: "reply-count",
                onClick: _cache[7] || (_cache[7] = ($event) => $data.expandTopReply = !$data.expandTopReply)
              }, [
                _cache[11] || (_cache[11] = vue.createElementVNode("div", { class: "gang" }, null, -1)),
                vue.createElementVNode("span", null, " 共有" + vue.toDisplayString($props.modelValue.replyCount) + " 条回复 ", 1),
                $data.expandTopReply ? (vue.openBlock(), vue.createBlock(_component_Icon, {
                  key: 0,
                  icon: "ep:arrow-up-bold"
                })) : (vue.openBlock(), vue.createBlock(_component_Icon, {
                  key: 1,
                  icon: "ep:arrow-down-bold"
                }))
              ])) : vue.createCommentVNode("", true)
            ]),
            vue.createElementVNode("div", _hoisted_9$4, [
              $props.type === "top" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                $data.expandTopReply && $props.modelValue.replyCount ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10$4, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.modelValue.children, (item, index) => {
                    return vue.openBlock(), vue.createBlock(_component_TopSubComment, {
                      level: 1,
                      modelValue: $props.modelValue.children[index],
                      "onUpdate:modelValue": ($event) => $props.modelValue.children[index] = $event,
                      key: index
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]);
                  }), 128))
                ])) : vue.createCommentVNode("", true)
              ], 64)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList($props.modelValue.children, (item, index) => {
                return vue.openBlock(), vue.createBlock(_component_Comment, {
                  modelValue: $props.modelValue.children[index],
                  "onUpdate:modelValue": ($event) => $props.modelValue.children[index] = $event,
                  key: index
                }, null, 8, ["modelValue", "onUpdate:modelValue"]);
              }), 128))
            ])
          ])
        ]),
        $data.cssStyle ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: "more ago",
          onClick: _cache[8] || (_cache[8] = ($event) => $data.expand = !$data.expand)
        }, " 由于嵌套回复层级太深，自动将以上回复移至可见范围 ")) : vue.createCommentVNode("", true)
      ], 4)) : vue.createCommentVNode("", true)
    ], 10, _hoisted_1$9);
  }
  const Comment = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$4], ["__scopeId", "data-v-984ba483"]]);
  const _sfc_main$8 = {
    name: "Toolbar",
    components: { Icon, BaseLoading },
    inject: [
      "isLogin",
      "post",
      "pageType"
    ],
    data() {
      return {
        timer: null,
        loading: false,
        loading2: false,
        loading3: false
      };
    },
    methods: {
      checkIsLogin(emitName = "") {
        if (!this.isLogin) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请先登录！" });
          return false;
        }
        this.$emit(emitName);
        return true;
      },
      tweet() {
        var _a;
        let username = ((_a = window.user) == null ? void 0 : _a.username) ?? "";
        let url2 = `https://twitter.com/intent/tweet?url=${location.origin}/t/${this.post.id}?r=${username}&related=v2ex&text=${this.post.title}`;
        window.open(url2, "_blank", "width=550,height=370");
      },
      async report() {
        if (!this.checkIsLogin())
          return;
        if (this.loading3)
          return;
        let isReport = this.post.isReport;
        if (isReport) {
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "你已对本主题进行了报告" });
          return;
        }
        let url2 = `${location.origin}/report/topic/${this.post.id}?once=${this.post.once}`;
        this.loading3 = true;
        let apiRes = await fetch(url2);
        this.loading3 = false;
        if (apiRes.redirected) {
          let htmlText = await apiRes.text();
          if (htmlText.search("你已对本主题进行了报告")) {
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "你已对本主题进行了报告" });
            eventBus.emit(CMD.REFRESH_ONCE, htmlText);
            eventBus.emit(CMD.MERGE, { isReport: !isReport });
            return;
          }
        }
        eventBus.emit(CMD.REFRESH_ONCE);
        eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "操作失败，请重试" });
      },
      async toggleIgnore() {
        if (!this.checkIsLogin())
          return;
        let url2 = `${location.origin}/${this.post.isIgnore ? "unignore" : "ignore"}/topic/${this.post.id}?once=${this.post.once}`;
        if (this.pageType === PageType.Post) {
          this.loading2 = true;
          let apiRes = await fetch(url2);
          if (apiRes.redirected) {
            if (!this.post.isIgnore) {
              window.location = location.origin;
            }
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: this.post.isIgnore ? "取消成功" : "忽略成功" });
            eventBus.emit(CMD.MERGE, { isIgnore: !this.post.isIgnore });
          } else {
            eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "忽略失败" });
          }
          this.loading2 = false;
        } else {
          if (this.post.isIgnore) {
            this.loading2 = true;
          } else {
            eventBus.emit(CMD.IGNORE);
          }
          let apiRes = await fetch(url2);
          if (apiRes.redirected) {
            if (this.post.isIgnore) {
              eventBus.emit(CMD.REFRESH_ONCE);
            }
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: this.post.isIgnore ? "取消成功" : "忽略成功" });
            eventBus.emit(CMD.MERGE, { isIgnore: !this.post.isIgnore });
          } else {
            eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "忽略成功,仅本次有效（接口调用失败！）" });
          }
          this.loading2 = false;
        }
      },
      async toggleFavorite() {
        if (!this.checkIsLogin())
          return;
        if (this.loading)
          return;
        let isFavorite = this.post.isFavorite;
        if (!isFavorite && config.collectBrowserNotice) {
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "别忘记按Command/Cmd/CTRL + D添加到书签哦" });
        }
        let url2 = `${location.origin}/${isFavorite ? "unfavorite" : "favorite"}/topic/${this.post.id}?once=${this.post.once}`;
        this.loading = true;
        let apiRes = await fetch(url2);
        this.loading = false;
        if (apiRes.redirected) {
          let htmlText = await apiRes.text();
          if (htmlText.search(isFavorite ? "加入收藏" : "取消收藏")) {
            eventBus.emit(CMD.SHOW_MSG, { type: "success", text: isFavorite ? "取消成功" : "收藏成功" });
            eventBus.emit(CMD.MERGE, { collectCount: isFavorite ? this.post.collectCount - 1 : this.post.collectCount + 1 });
            eventBus.emit(CMD.REFRESH_ONCE, htmlText);
            eventBus.emit(CMD.MERGE, { isFavorite: !isFavorite });
            return;
          }
        }
        eventBus.emit(CMD.REFRESH_ONCE);
        eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "操作失败" });
      }
    }
  };
  const _hoisted_1$8 = { class: "toolbar" };
  const _hoisted_2$5 = {
    key: 0,
    class: "tool no-hover"
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_BaseLoading = vue.resolveComponent("BaseLoading");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$8, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
      vue.createElementVNode("div", {
        class: "tool",
        onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => $options.checkIsLogin("reply"), ["stop"]))
      }, [
        vue.createVNode(_component_Icon, { icon: "mynaui:message" }),
        _cache[5] || (_cache[5] = vue.createElementVNode("span", null, "回复", -1))
      ]),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["tool", { disabled: $data.loading }]),
        onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.toggleFavorite && $options.toggleFavorite(...args), ["stop"]))
      }, [
        $data.loading ? (vue.openBlock(), vue.createBlock(_component_BaseLoading, {
          key: 0,
          size: "small"
        })) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
          $options.post.isFavorite ? (vue.openBlock(), vue.createBlock(_component_Icon, {
            key: 0,
            color: "rgb(224,42,42)",
            icon: "iconoir:star-solid"
          })) : (vue.openBlock(), vue.createBlock(_component_Icon, {
            key: 1,
            icon: "iconoir:star"
          }))
        ], 64)),
        vue.createElementVNode("span", null, vue.toDisplayString($options.post.isFavorite ? "取消" : "") + "收藏", 1)
      ], 2),
      $options.post.collectCount !== 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$5, [
        vue.createElementVNode("span", null, vue.toDisplayString($options.post.collectCount + "人收藏"), 1)
      ])) : vue.createCommentVNode("", true),
      vue.createElementVNode("div", {
        class: "tool",
        onClick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => $options.tweet && $options.tweet(...args), ["stop"]))
      }, [
        vue.createVNode(_component_Icon, { icon: "uil:share" }),
        _cache[6] || (_cache[6] = vue.createElementVNode("span", null, "Tweet", -1))
      ]),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["tool", { "disabled": $data.loading2 }]),
        onClick: _cache[3] || (_cache[3] = vue.withModifiers((...args) => $options.toggleIgnore && $options.toggleIgnore(...args), ["stop"]))
      }, [
        $data.loading2 ? (vue.openBlock(), vue.createBlock(_component_BaseLoading, {
          key: 0,
          size: "small"
        })) : (vue.openBlock(), vue.createBlock(_component_Icon, {
          key: 1,
          icon: "fluent:eye-hide-24-regular"
        })),
        vue.createElementVNode("span", null, vue.toDisplayString($options.post.isIgnore ? "取消忽略" : "忽略"), 1)
      ], 2),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["tool", { "disabled": $data.loading3 }]),
        onClick: _cache[4] || (_cache[4] = vue.withModifiers((...args) => $options.report && $options.report(...args), ["stop"]))
      }, [
        $data.loading3 ? (vue.openBlock(), vue.createBlock(_component_BaseLoading, {
          key: 0,
          size: "small"
        })) : (vue.openBlock(), vue.createBlock(_component_Icon, {
          key: 1,
          class: "black",
          icon: "solar:danger-triangle-outline"
        })),
        vue.createElementVNode("span", null, vue.toDisplayString($options.post.isReport ? "你已对本主题进行了报告" : "报告"), 1)
      ], 2)
    ]);
  }
  const Toolbar = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$3], ["__scopeId", "data-v-30dac564"]]);
  const _hoisted_1$7 = ["href"];
  const _hoisted_2$4 = ["src"];
  const _hoisted_3$4 = { class: "texts" };
  const _hoisted_4$4 = {
    key: 0,
    class: "point"
  };
  const _hoisted_5$3 = { class: "link-num" };
  const _hoisted_6$3 = { class: "my-tag" };
  const _hoisted_7$3 = {
    key: 2,
    class: "ago"
  };
  const _hoisted_8$3 = {
    key: 3,
    class: "mod"
  };
  const _hoisted_9$3 = {
    key: 4,
    class: "owner"
  };
  const _hoisted_10$3 = ["href"];
  const _hoisted_11$3 = {
    key: 5,
    class: "owner"
  };
  const _hoisted_12$2 = {
    key: 6,
    class: "mod"
  };
  const _hoisted_13$2 = {
    key: 7,
    class: "ago"
  };
  const _hoisted_14$2 = { class: "my-tag" };
  const _hoisted_15$2 = {
    key: 9,
    class: "point"
  };
  const _hoisted_16$2 = { class: "link-num" };
  const _hoisted_17$1 = ["href"];
  const _hoisted_18$1 = ["src"];
  const _hoisted_19$1 = { class: "Author-right" };
  const _hoisted_20$1 = { class: "floor" };
  const _sfc_main$7 = {
    __name: "SingleComment",
    props: {
      comment: {
        reply_content: ""
      },
      isRight: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    setup(__props) {
      const config2 = vue.inject("config");
      const isLogin = vue.inject("isLogin");
      const tags = vue.inject("tags");
      const props = __props;
      const myTags = vue.computed(() => {
        return tags[props.comment.username] ?? [];
      });
      function jump() {
        eventBus.emit(CMD.JUMP, props.comment.floor);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["comment", { isSimple: vue.unref(config2).viewType === "simple" }]),
          ref: "comment"
        }, [
          !__props.isRight ? (vue.openBlock(), vue.createElementBlock("a", {
            key: 0,
            class: "avatar",
            href: `/member/${__props.comment.username}`
          }, [
            vue.createElementVNode("img", {
              src: __props.comment.avatar,
              alt: ""
            }, null, 8, _hoisted_2$4)
          ], 8, _hoisted_1$7)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["comment-body", { isRight: __props.isRight }])
          }, [
            vue.createElementVNode("div", _hoisted_3$4, [
              __props.comment.thankCount && __props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$4, [
                __props.comment.isThanked ? (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                  key: 0,
                  color: "rgb(224,42,42)",
                  icon: "icon-park-solid:like"
                })) : (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                  key: 1,
                  color: !__props.comment.thankCount ? null : "rgb(224,42,42)",
                  icon: "icon-park-outline:like"
                }, null, 8, ["color"])),
                vue.createElementVNode("div", _hoisted_5$3, vue.toDisplayString(__props.comment.thankCount), 1)
              ])) : vue.createCommentVNode("", true),
              vue.unref(isLogin) && vue.unref(config2).openTag && __props.isRight ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(myTags.value, (i) => {
                return vue.openBlock(), vue.createElementBlock("span", _hoisted_6$3, [
                  _cache[0] || (_cache[0] = vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1)),
                  vue.createElementVNode("span", null, vue.toDisplayString(i), 1)
                ]);
              }), 256)) : vue.createCommentVNode("", true),
              __props.isRight ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_7$3, vue.toDisplayString(__props.comment.date), 1)) : vue.createCommentVNode("", true),
              __props.comment.isMod && __props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8$3, "MOD")) : vue.createCommentVNode("", true),
              __props.comment.isOp && __props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9$3, "OP")) : vue.createCommentVNode("", true),
              vue.createElementVNode("a", {
                href: `/member/${__props.comment.username}`,
                class: "username"
              }, vue.toDisplayString(__props.comment.username), 9, _hoisted_10$3),
              __props.comment.isOp && !__props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11$3, "OP")) : vue.createCommentVNode("", true),
              __props.comment.isMod && !__props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12$2, "MOD")) : vue.createCommentVNode("", true),
              !__props.isRight ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_13$2, vue.toDisplayString(__props.comment.date), 1)) : vue.createCommentVNode("", true),
              vue.unref(isLogin) && vue.unref(config2).openTag && !__props.isRight ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 8 }, vue.renderList(myTags.value, (i) => {
                return vue.openBlock(), vue.createElementBlock("span", _hoisted_14$2, [
                  _cache[1] || (_cache[1] = vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1)),
                  vue.createElementVNode("span", null, vue.toDisplayString(i), 1)
                ]);
              }), 256)) : vue.createCommentVNode("", true),
              __props.comment.thankCount && !__props.isRight ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_15$2, [
                __props.comment.isThanked ? (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                  key: 0,
                  color: "rgb(224,42,42)",
                  icon: "icon-park-solid:like"
                })) : (vue.openBlock(), vue.createBlock(vue.unref(Icon), {
                  key: 1,
                  color: !__props.comment.thankCount ? null : "rgb(224,42,42)",
                  icon: "icon-park-outline:like"
                }, null, 8, ["color"])),
                vue.createElementVNode("div", _hoisted_16$2, vue.toDisplayString(__props.comment.thankCount), 1)
              ])) : vue.createCommentVNode("", true)
            ]),
            vue.createVNode(BaseHtmlRender, {
              class: "reply_content",
              html: __props.comment.reply_content
            }, null, 8, ["html"])
          ], 2),
          __props.isRight ? (vue.openBlock(), vue.createElementBlock("a", {
            key: 1,
            class: "avatar",
            href: `/member/${__props.comment.username}`
          }, [
            vue.createElementVNode("img", {
              src: __props.comment.avatar,
              alt: ""
            }, null, 8, _hoisted_18$1)
          ], 8, _hoisted_17$1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_19$1, [
            vue.createElementVNode("div", _hoisted_20$1, vue.toDisplayString(__props.comment.floor), 1),
            vue.createElementVNode("div", {
              class: "tool jump",
              onClick: vue.withModifiers(jump, ["stop"])
            }, [..._cache[2] || (_cache[2] = [
              vue.createElementVNode("span", null, "跳转", -1)
            ])])
          ])
        ], 2);
      };
    }
  };
  const SingleComment = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-4a063111"]]);
  function _css(el, key, value) {
    const reg = /^-?\d+.?\d*(px|pt|em|rem|vw|vh|%|rpx|ms)$/i;
    if (value === void 0) {
      let val = null;
      if ("getComputedStyle" in window) {
        val = window.getComputedStyle(el, null)[key];
      } else {
        val = el.currentStyle[key];
      }
      return reg.test(val) ? parseFloat(val) : val;
    } else {
      if ([
        "top",
        "left",
        "bottom",
        "right",
        "width",
        "height",
        "font-size",
        "margin",
        "padding"
      ].includes(key)) {
        if (!reg.test(value)) {
          if (!String(value).includes("calc")) {
            value += "px";
          }
        }
      }
      if (key === "transform") {
        el.style.webkitTransform = el.style.MsTransform = el.style.msTransform = el.style.MozTransform = el.style.OTransform = el.style.transform = value;
      } else {
        el.style[key] = value;
      }
    }
  }
  function getImgSize(naturalWidth, naturalHeight, maxWidth, maxHeight) {
    const imgRatio = naturalWidth / naturalHeight;
    const maxRatio = maxWidth / maxHeight;
    let width, height;
    if (imgRatio >= maxRatio) {
      if (naturalWidth > maxWidth) {
        width = maxWidth;
        height = maxWidth / naturalWidth * naturalHeight;
      } else {
        width = naturalWidth;
        height = naturalHeight;
      }
    } else {
      if (naturalHeight > maxHeight) {
        width = maxHeight / naturalHeight * naturalWidth;
        height = maxHeight;
      } else {
        width = naturalWidth;
        height = naturalHeight;
      }
    }
    if (height === 0) {
      height = maxHeight;
      width = height * 1.3;
    } else {
      if (height < 24) {
        height = 50;
        width = height * imgRatio;
      } else if (height < 100) {
        height = 300;
        width = height * imgRatio;
      } else {
        height = maxHeight;
        width = height * imgRatio;
      }
      if (width > maxWidth) {
        width = maxWidth;
        height = width / imgRatio;
      }
    }
    console.log(width, height);
    return { width, height };
  }
  const _sfc_main$6 = {
    name: "detail",
    components: {
      BaseSelect,
      BaseButton,
      SingleComment,
      PopConfirm,
      Comment,
      PostEditor,
      Point,
      Toolbar,
      BaseHtmlRender,
      Tooltip,
      BaseLoading,
      Icon
    },
    inject: ["allReplyUsers", "post", "tags", "isLogin", "config", "pageType", "isNight"],
    provide() {
      return {
        postDetailWidth: vue.computed(() => this.postDetailWidth)
      };
    },
    props: {
      modelValue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      loading: {
        type: Boolean,
        default() {
          return false;
        }
      },
      refreshLoading: {
        type: Boolean,
        default() {
          return false;
        }
      },
      displayType: CommentDisplayType.FloorInFloorNoCallUser
    },
    data() {
      return {
        isSticky: false,
        selectCallIndex: 0,
        postDetailWidth: 0,
        showCallList: false,
        showRelationReply: false,
        replyText: "",
        callStyle: {
          top: 0,
          left: 0
        },
        targetUser: {
          left: [],
          right: "",
          rightFloor: -1
        },
        currentFloor: "",
        showOpTag: false,
        rect: {},
        result: {},
        x: 0,
        y: 0,
        scale: 1,
        minScale: 0.2,
        maxScale: 16,
        preview: {
          rect: {},
          result: {},
          x: 0,
          y: 0,
          scale: 1,
          minScale: 0.2,
          maxScale: 16
        }
      };
    },
    computed: {
      functions() {
        return functions;
      },
      //wow区和东京区的css要特定
      isSpecificArea() {
        if ([PageType.Node, PageType.Post].includes(this.pageType)) {
          if (["东京", "World of Warcraft"].includes(this.post.node.title)) {
            return true;
          }
        }
        return false;
      },
      canAppend() {
        if (this.isMy) {
          let create = new Date(this.post.createDate);
          return Date.now() - create.valueOf() > 1e3 * 60 * 30;
        }
        return false;
      },
      canEditMove() {
        if (this.isMy) {
          let create = new Date(this.post.createDate);
          return Date.now() - create.valueOf() < 1e3 * 60 * 10;
        }
        return false;
      },
      isMy() {
        return this.post.member.username === window.user.username;
      },
      myTags() {
        return this.tags[this.post.member.username] ?? [];
      },
      CommentDisplayType() {
        return CommentDisplayType;
      },
      isPost() {
        return this.pageType === PageType.Post;
      },
      filterCallList() {
        if (this.showCallList) {
          let list = ["管理员", "所有人"].concat(this.allReplyUsers);
          if (this.replyText)
            return list.filter((i) => i.search(this.replyText) > -1);
          return list;
        }
        return [];
      },
      replyList() {
        if ([CommentDisplayType.FloorInFloor, CommentDisplayType.FloorInFloorNoCallUser].includes(this.displayType))
          return this.post.nestedReplies;
        if (this.displayType === CommentDisplayType.Like) {
          return functions.clone(this.post.nestedReplies).sort((a, b) => b.thankCount - a.thankCount);
        }
        if (this.displayType === CommentDisplayType.New) {
          return functions.clone(this.post.replyList).reverse();
        }
        if (this.displayType === CommentDisplayType.V2exOrigin)
          return this.post.replyList;
        if (this.displayType === CommentDisplayType.FloorInFloorNested)
          return this.post.nestedRedundReplies;
        if (this.displayType === CommentDisplayType.OnlyOp)
          return this.post.replyList.filter((v) => {
            var _a;
            return v.username === ((_a = this.post.member) == null ? void 0 : _a.username);
          });
        return [];
      },
      //关联回复
      relationReply() {
        if (this.targetUser.left.length && this.targetUser.right) {
          return this.post.replyList.filter((v) => {
            if (this.targetUser.left.concat(this.targetUser.right).includes(v.username)) {
              if (v.floor > this.targetUser.rightFloor) {
                if (v.replyUsers.includes(this.targetUser.right)) {
                  return true;
                }
                if (v.username === this.targetUser.right) {
                  for (let i = 0; i < this.targetUser.left.length; i++) {
                    if (v.replyUsers.includes(this.targetUser.left[i])) {
                      return true;
                    }
                  }
                }
              } else {
                return true;
              }
            }
            return false;
          });
        }
        return [];
      }
    },
    watch: {
      "post.id"(n2, o) {
        if (this.$refs["post-editor"]) {
          this.$refs["post-editor"].content = "";
          vue.nextTick(() => {
            var _a, _b;
            (_b = (_a = this.$refs) == null ? void 0 : _a.detail) == null ? void 0 : _b.scrollTo({ top: 0 });
          });
        }
      },
      "post.headerTemplate"(n2, o) {
        let mountEl = document.querySelector(".main-wrapper .post-wrapper .html-wrapper .header");
        if (mountEl) {
          this.showOpTag = true;
        }
      },
      modelValue: {
        handler(newVal) {
          if (this.isPost)
            return;
          if (newVal) {
            this.currentFloor = "";
            vue.nextTick(() => {
              var _a, _b;
              (_b = (_a = this.$refs) == null ? void 0 : _a.main) == null ? void 0 : _b.focus();
            });
          } else {
            this.isSticky = false;
            this.showRelationReply = false;
          }
        }
      }
    },
    mounted() {
      vue.nextTick(() => {
        setTimeout(() => {
          var _a;
          this.postDetailWidth = ((_a = this.$refs.mainWrapper) == null ? void 0 : _a.getBoundingClientRect().width) || 0;
        }, 500);
      });
      if (this.isLogin) {
        const observer = new IntersectionObserver(
          ([e2]) => e2.target.toggleAttribute("stuck", e2.intersectionRatio < 1),
          { threshold: [1] }
        );
        observer.observe(this.$refs.replyBox);
        window.addEventListener("keydown", this.onKeyDown);
      }
      eventBus.on(CMD.SHOW_CALL, (val) => {
        if (val.show) {
          this.showCallList = true;
          this.replyText = val.text;
          if (this.isPost) {
            this.callStyle.top = val.top + $(window).scrollTop() + -40 + "px";
          } else {
            this.callStyle.top = val.top + $(".post-detail").scrollTop() + 15 + "px";
          }
          this.callStyle.left = val.left - $(".main")[0].getBoundingClientRect().left + 10 + "px";
          if (this.selectCallIndex >= this.filterCallList.length) {
            this.selectCallIndex = 0;
          }
        } else {
          this.replyText = "";
          this.showCallList = false;
          this.selectCallIndex = 0;
        }
      });
      eventBus.on(CMD.RELATION_REPLY, (val) => {
        this.targetUser = val;
        this.showRelationReply = true;
      });
      eventBus.on(CMD.JUMP, this.jump);
    },
    beforeUnmount() {
      window.removeEventListener("keydown", this.onKeyDown);
      eventBus.off(CMD.SHOW_CALL);
    },
    methods: {
      addTag() {
        eventBus.emit(CMD.ADD_TAG, this.post.member.username);
      },
      removeTag(tag) {
        eventBus.emit(CMD.REMOVE_TAG, { username: this.post.member.username, tag });
      },
      closePreviewModal() {
        let previewModal = document.querySelector(".preview-modal");
        let s = document.querySelector(".shadow");
        let domRect = this.preview.rect;
        _css(s, "transition", "all 0.3s");
        _css(s, "width", domRect.width);
        _css(s, "height", domRect.height);
        _css(s, "transform", `translate3d(${domRect.x}px, ${domRect.y}px, 0) scale(1)`);
        let mask = document.querySelector(".preview-modal .mask");
        _css(mask, "opacity", 0);
        setTimeout(() => {
          _css(s, "transition", "all 0s");
          s.remove();
          _css(previewModal, "top", "-1000vh");
          _css(document.body, "overflow", "auto");
        }, 300);
      },
      stop(e2) {
        e2.stopPropagation();
        e2.stopImmediatePropagation();
        if (e2.target.tagName === "IMG") {
          console.log("e", e2.target.src);
          if (/cdn\.v2ex\.com.*avatar/i.test(e2.target.src)) {
            console.log("t");
          }
          this.preview = {
            rect: {},
            result: {},
            x: 0,
            y: 0,
            scale: 1,
            minScale: 0.2,
            maxScale: 16
          };
          e2.preventDefault();
          let domRect = e2.target.getBoundingClientRect();
          let previewModal = document.querySelector(".preview-modal");
          _css(previewModal, "top", "0");
          let s = e2.target.cloneNode();
          s.classList.add("shadow");
          previewModal.append(s);
          _css(s, "transition", "all 0s");
          _css(s, "width", domRect.width);
          _css(s, "height", domRect.height);
          _css(s, "transform", `translate3d(${domRect.x}px, ${domRect.y}px, 0) scale(1)`);
          let t = ".3";
          let sw = domRect.width / window.innerWidth;
          let sh = domRect.height / window.innerHeight;
          domRect.sw = sw;
          domRect.sh = sh;
          this.preview.rect = domRect;
          this.preview.result = getImgSize(
            s.naturalWidth,
            s.naturalHeight,
            window.innerWidth * 0.95,
            window.innerHeight * 0.9
          );
          this.preview.x = (window.innerWidth - this.preview.result.width) * 0.5;
          this.preview.y = (window.innerHeight - this.preview.result.height) * 0.5;
          let isPointerdown = false;
          let isMove = false;
          let lastPointermove = { x: 0, y: 0 };
          let diff = { x: 0, y: 0 };
          s.addEventListener("pointerdown", function(e3) {
            isPointerdown = true;
            isMove = false;
            s.setPointerCapture(e3.pointerId);
            lastPointermove = { x: e3.clientX, y: e3.clientY };
          });
          s.addEventListener("pointermove", (e3) => {
            if (isPointerdown) {
              isMove = true;
              const current = { x: e3.clientX, y: e3.clientY };
              diff.x = current.x - lastPointermove.x;
              diff.y = current.y - lastPointermove.y;
              lastPointermove = { x: current.x, y: current.y };
              this.preview.x += diff.x;
              this.preview.y += diff.y;
              _css(s, "transition", "all 0.1s");
              _css(s, "transform", `translate3d(${this.preview.x}px, ${this.preview.y}px, 0) scale(${this.preview.scale})`);
            }
            e3.preventDefault();
          });
          s.addEventListener("pointerup", () => {
            if (isPointerdown) {
              isPointerdown = false;
              if (!isMove) {
                this.closePreviewModal();
              }
            }
          });
          s.addEventListener("pointercancel", function(e3) {
            if (isPointerdown) {
              isPointerdown = false;
            }
          });
          let mask = document.querySelector(".preview-modal .mask");
          _css(mask, "transition", "all 0s");
          _css(mask, "opacity", 0);
          setTimeout(() => {
            _css(s, "transition", `all ${t}s`);
            _css(mask, "transition", `all ${t}s`);
            _css(mask, "opacity", 1);
            _css(s, "transform", `translate3d(${this.preview.x}px, ${this.preview.y}px, 0) scale(${this.preview.scale})`);
            _css(s, "width", this.preview.result.width);
            _css(s, "height", this.preview.result.height);
          }, 0);
          setTimeout(() => {
            _css(document.body, "overflow", "hidden");
          }, 300);
          return false;
        }
      },
      wheel(e2) {
        let d2 = e2.deltaY < 0 ? 0.1 : -0.1;
        let ratio = 1 + d2;
        let _scale = this.preview.scale * ratio;
        if (_scale > this.preview.maxScale) {
          ratio = this.preview.maxScale / this.preview.scale;
          this.preview.scale = this.preview.maxScale;
        } else if (_scale < this.preview.minScale) {
          ratio = this.preview.minScale / this.preview.scale;
          this.preview.scale = this.preview.minScale;
        } else {
          this.preview.scale = _scale;
        }
        if (e2.target.tagName === "IMG") {
          const origin = {
            x: d2 * this.preview.result.width / 2,
            y: d2 * this.preview.result.height / 2
          };
          this.preview.x -= d2 * (e2.clientX - this.preview.x) - origin.x;
          this.preview.y -= d2 * (e2.clientY - this.preview.y) - origin.y;
        }
        let s = document.querySelector(".shadow");
        _css(s, "transition", "all 0.2s");
        _css(s, "transform", `translate3d(${this.preview.x}px, ${this.preview.y}px, 0) scale(${this.preview.scale})`);
        e2.preventDefault();
      },
      jump(floor) {
        let lastItem = this.replyList[this.replyList.length - 1];
        if (floor === "") {
          floor = lastItem.floor;
        } else {
          try {
            floor = Number(floor);
          } catch (e2) {
            floor = lastItem.floor;
          }
          if (floor === 0) {
            floor = 1;
          }
          if (floor > lastItem.floor)
            floor = lastItem.floor;
        }
        if (!this.post.replyList.length) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "没有回复可跳转！" });
          return;
        }
        if (floor > this.post.replyList.length) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "没有找到对应回复！" });
          return;
        }
        let comment = $(`.c_${floor}`);
        if (!comment.length) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "没有找到对应回复！" });
          return;
        }
        comment[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        comment.addClass("ding");
        this.currentFloor = floor + 1;
        setTimeout(() => {
          comment.removeClass("ding");
        }, 2e3);
      },
      collapseTopReplyList() {
        $(this.$refs.topReply).slideToggle("fast");
      },
      goBottom() {
        this.isSticky = false;
        setTimeout(() => {
          if (this.isPost) {
            let body = $("body , html");
            let scrollHeight = body.prop("scrollHeight");
            body.animate({ scrollTop: scrollHeight - 850 }, 300);
          } else {
            this.$refs.detail.scrollTo({ top: this.$refs.detail.scrollHeight, behavior: "smooth" });
          }
        });
      },
      close(from) {
        if (this.isPost)
          return;
        if (from === "space") {
          if (this.config.closePostDetailBySpace) {
            this.$emit("update:modelValue", false);
          }
        } else {
          this.$emit("update:modelValue", false);
        }
      },
      setCall(e2) {
        eventBus.emit(CMD.SET_CALL, e2);
        this.showCallList = false;
      },
      onKeyDown(e2) {
        if (!this.modelValue)
          return;
        if (!this.showCallList)
          return;
        let length = this.filterCallList.slice(0, 10).length;
        if (e2.keyCode === 13) {
          this.setCall(this.filterCallList[this.selectCallIndex]);
          e2.preventDefault();
        }
        if (e2.keyCode === 38) {
          this.selectCallIndex--;
          if (this.selectCallIndex < 0) {
            this.selectCallIndex = length - 1;
          }
          e2.preventDefault();
        }
        if (e2.keyCode === 40) {
          this.selectCallIndex++;
          if (this.selectCallIndex > length - 1) {
            this.selectCallIndex = 0;
          }
          e2.preventDefault();
        }
      },
      changeOption(item) {
        this.$emit("update:displayType", item);
      },
      addThank() {
        eventBus.emit(CMD.CHANGE_POST_THANK, { id: this.post.id, type: "add" });
      },
      recallThank() {
        eventBus.emit(CMD.CHANGE_POST_THANK, { id: this.post.id, type: "recall" });
      },
      scrollTop() {
        if (this.isPost) {
          $("body , html").animate({ scrollTop: 0 }, 300);
        } else {
          this.$refs.detail.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  };
  const _hoisted_1$6 = { class: "my-box post-wrapper" };
  const _hoisted_2$3 = { class: "header" };
  const _hoisted_3$3 = { class: "fr" };
  const _hoisted_4$3 = ["href"];
  const _hoisted_5$2 = ["src", "alt"];
  const _hoisted_6$2 = ["href"];
  const _hoisted_7$2 = ["id"];
  const _hoisted_8$2 = ["onclick"];
  const _hoisted_9$2 = ["onclick"];
  const _hoisted_10$2 = { class: "gray" };
  const _hoisted_11$2 = ["href"];
  const _hoisted_12$1 = ["title"];
  const _hoisted_13$1 = ["href"];
  const _hoisted_14$1 = ["href"];
  const _hoisted_15$1 = ["href"];
  const _hoisted_16$1 = ["href"];
  const _hoisted_17 = { class: "my-tag" };
  const _hoisted_18 = ["onClick"];
  const _hoisted_19 = {
    key: 0,
    class: "my-box"
  };
  const _hoisted_20 = { class: "top-reply" };
  const _hoisted_21 = { class: "tool" };
  const _hoisted_22 = { ref: "topReply" };
  const _hoisted_23 = { class: "my-box comment-wrapper" };
  const _hoisted_24 = {
    key: 0,
    class: "my-cell flex"
  };
  const _hoisted_25 = { key: 0 };
  const _hoisted_26 = ["innerHTML"];
  const _hoisted_27 = {
    key: 0,
    class: "loading-wrapper"
  };
  const _hoisted_28 = {
    key: 1,
    class: "comments"
  };
  const _hoisted_29 = {
    key: 1,
    id: "no-comments-yet"
  };
  const _hoisted_30 = { class: "my-cell flex" };
  const _hoisted_31 = { class: "notice-right gray" };
  const _hoisted_32 = { class: "p1" };
  const _hoisted_33 = { class: "top-reply" };
  const _hoisted_34 = ["onClick"];
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_BaseHtmlRender = vue.resolveComponent("BaseHtmlRender");
    const _component_Point = vue.resolveComponent("Point");
    const _component_Toolbar = vue.resolveComponent("Toolbar");
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_Tooltip = vue.resolveComponent("Tooltip");
    const _component_Comment = vue.resolveComponent("Comment");
    const _component_BaseSelect = vue.resolveComponent("BaseSelect");
    const _component_BaseLoading = vue.resolveComponent("BaseLoading");
    const _component_PostEditor = vue.resolveComponent("PostEditor");
    const _component_SingleComment = vue.resolveComponent("SingleComment");
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["post-detail", [$options.isNight ? "isNight" : "", $options.pageType]]),
      ref: "detail",
      onKeydown: _cache[22] || (_cache[22] = vue.withKeys(($event) => $options.close(), ["esc"])),
      onClick: _cache[23] || (_cache[23] = ($event) => $options.close("space"))
    }, [
      vue.createElementVNode("div", {
        ref: "main",
        class: vue.normalizeClass(["main", $options.isSpecificArea ? "specific-area" : ""]),
        tabindex: "1",
        onClick: _cache[19] || (_cache[19] = (...args) => $options.stop && $options.stop(...args))
      }, [
        vue.createElementVNode("div", {
          class: "main-wrapper",
          ref: "mainWrapper",
          style: vue.normalizeStyle({ width: $options.config.postWidth + "!important" })
        }, [
          vue.createElementVNode("div", _hoisted_1$6, [
            vue.createElementVNode("div", _hoisted_2$3, [
              vue.createElementVNode("div", _hoisted_3$3, [
                vue.createElementVNode("a", {
                  href: `/member/${$options.post.member.username}`,
                  style: { "width": "73px", "height": "73px", "display": "inline-block" }
                }, [
                  $options.post.member.avatar_large ? (vue.openBlock(), vue.createElementBlock("img", {
                    key: 0,
                    src: $options.post.member.avatar_large,
                    class: "avatar",
                    style: { "width": "73px", "height": "73px" },
                    border: "0",
                    align: "default",
                    alt: $options.post.member.username
                  }, null, 8, _hoisted_5$2)) : vue.createCommentVNode("", true)
                ], 8, _hoisted_4$3)
              ]),
              _cache[35] || (_cache[35] = vue.createElementVNode("a", { href: "/" }, "V2EX", -1)),
              _cache[36] || (_cache[36] = vue.createElementVNode("span", { class: "chevron" }, "  ›  ", -1)),
              vue.createElementVNode("a", {
                href: $options.post.node.url
              }, vue.toDisplayString($options.post.node.title), 9, _hoisted_6$2),
              _cache[37] || (_cache[37] = vue.createElementVNode("div", { class: "sep10" }, null, -1)),
              vue.createElementVNode("h1", null, vue.toDisplayString($options.post.title), 1),
              vue.createElementVNode("div", {
                id: `topic_${$options.post.id}_votes`,
                class: "votes"
              }, [
                vue.createElementVNode("a", {
                  href: "javascript:",
                  onclick: `upVoteTopic(${$options.post.id});`,
                  class: "vote"
                }, [..._cache[24] || (_cache[24] = [
                  vue.createElementVNode("li", { class: "fa fa-chevron-up" }, null, -1),
                  vue.createTextVNode("   ", -1)
                ])], 8, _hoisted_8$2),
                _cache[26] || (_cache[26] = vue.createTextVNode("   ", -1)),
                vue.createElementVNode("a", {
                  href: "javascript:",
                  onclick: `downVoteTopic(${$options.post.id});`,
                  class: "vote"
                }, [..._cache[25] || (_cache[25] = [
                  vue.createElementVNode("li", { class: "fa fa-chevron-down" }, null, -1)
                ])], 8, _hoisted_9$2)
              ], 8, _hoisted_7$2),
              _cache[38] || (_cache[38] = vue.createTextVNode("   ", -1)),
              vue.createElementVNode("small", _hoisted_10$2, [
                vue.createElementVNode("a", {
                  href: `/member/${$options.post.member.username}`
                }, vue.toDisplayString($options.post.member.username), 9, _hoisted_11$2),
                _cache[33] || (_cache[33] = vue.createTextVNode(" · ", -1)),
                $options.post.member.createDate ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                  vue.createElementVNode("span", {
                    class: vue.normalizeClass($options.post.member.isNew && "danger")
                  }, vue.toDisplayString($options.post.member.createDate), 3),
                  _cache[27] || (_cache[27] = vue.createTextVNode(" · ", -1))
                ], 64)) : vue.createCommentVNode("", true),
                $options.post.createDateAgo ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                  vue.createElementVNode("span", {
                    title: $options.post.createDate
                  }, vue.toDisplayString($options.post.createDateAgo), 9, _hoisted_12$1),
                  _cache[28] || (_cache[28] = vue.createTextVNode(" · ", -1))
                ], 64)) : vue.createCommentVNode("", true),
                vue.createTextVNode(" " + vue.toDisplayString($options.post.clickCount) + " 次点击 ", 1),
                $options.isMy ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
                  _cache[31] || (_cache[31] = vue.createTextVNode("   ", -1)),
                  vue.createElementVNode("a", {
                    href: `/t/${$options.post.id}/info`
                  }, [..._cache[29] || (_cache[29] = [
                    vue.createElementVNode("li", { class: "fa fa-info-circle" }, null, -1)
                  ])], 8, _hoisted_13$1),
                  _cache[32] || (_cache[32] = vue.createTextVNode("   ", -1)),
                  $options.canAppend ? (vue.openBlock(), vue.createElementBlock("a", {
                    key: 0,
                    href: `/append/topic/${$options.post.id}`,
                    class: "op"
                  }, "APPEND", 8, _hoisted_14$1)) : vue.createCommentVNode("", true),
                  $options.canEditMove ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                    vue.createElementVNode("a", {
                      href: `/move/topic/${$options.post.id}`,
                      class: "op"
                    }, "MOVE", 8, _hoisted_15$1),
                    _cache[30] || (_cache[30] = vue.createTextVNode("  ", -1)),
                    vue.createElementVNode("a", {
                      href: `/edit/topic/${$options.post.id}`,
                      class: "op"
                    }, "EDIT", 8, _hoisted_16$1)
                  ], 64)) : vue.createCommentVNode("", true)
                ], 64)) : vue.createCommentVNode("", true)
              ]),
              $options.isLogin && $options.config.openTag ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.myTags, (i) => {
                  return vue.openBlock(), vue.createElementBlock("span", _hoisted_17, [
                    _cache[34] || (_cache[34] = vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1)),
                    vue.createElementVNode("span", null, vue.toDisplayString(i), 1),
                    vue.createElementVNode("i", {
                      class: "fa fa-trash-o remove",
                      onClick: vue.withModifiers(($event) => $options.removeTag(i), ["stop"])
                    }, null, 8, _hoisted_18)
                  ]);
                }), 256)),
                vue.createElementVNode("span", {
                  class: "add-tag ago",
                  onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.addTag && $options.addTag(...args), ["stop"])),
                  title: "添加标签"
                }, "+")
              ], 64)) : vue.createCommentVNode("", true)
            ]),
            $options.post.headerTemplate ? (vue.openBlock(), vue.createBlock(_component_BaseHtmlRender, {
              key: 0,
              html: $options.post.headerTemplate
            }, null, 8, ["html"])) : (vue.openBlock(), vue.createBlock(_component_BaseHtmlRender, {
              key: 1,
              html: $options.post.jsonContent
            }, null, 8, ["html"])),
            vue.createVNode(_component_Toolbar, {
              onReply: _cache[1] || (_cache[1] = ($event) => $data.isSticky = !$data.isSticky)
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_Point, {
                  onAddThank: $options.addThank,
                  onRecallThank: $options.recallThank,
                  item: {
                    isThanked: $options.post.isThanked,
                    thankCount: $options.post.thankCount,
                    username: $options.post.username
                  },
                  "api-url": "topic/" + $options.post.id
                }, null, 8, ["onAddThank", "onRecallThank", "item", "api-url"])
              ]),
              _: 1
            })
          ]),
          $options.post.topReplyList.length && $options.config.showTopReply ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_19, [
            vue.createElementVNode("div", {
              class: "my-cell flex",
              onClick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => $options.collapseTopReplyList && $options.collapseTopReplyList(...args), ["stop"]))
            }, [
              _cache[39] || (_cache[39] = vue.createElementVNode("span", null, "高赞回复", -1)),
              vue.createElementVNode("div", _hoisted_20, [
                vue.createVNode(_component_Tooltip, { title: "收起高赞回复" }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_21, [
                      vue.createVNode(_component_Icon, { icon: "gravity-ui:chevrons-collapse-vertical" })
                    ])
                  ]),
                  _: 1
                })
              ])
            ]),
            vue.createElementVNode("div", _hoisted_22, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.post.topReplyList, (item, index) => {
                return vue.openBlock(), vue.createBlock(_component_Comment, {
                  key: item.floor,
                  type: "top",
                  modelValue: $options.post.topReplyList[index],
                  "onUpdate:modelValue": ($event) => $options.post.topReplyList[index] = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"]);
              }), 128))
            ], 512)
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_23, [
            $options.post.replyList.length || $props.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_24, [
              vue.createElementVNode("div", null, [
                vue.createTextVNode(vue.toDisplayString($options.post.replyCount) + " 条回复 ", 1),
                $options.post.lastReplyDate ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_25, [
                  _cache[40] || (_cache[40] = vue.createTextVNode("  ", -1)),
                  _cache[41] || (_cache[41] = vue.createElementVNode("strong", { class: "snow" }, "•", -1)),
                  vue.createTextVNode("  " + vue.toDisplayString($options.post.lastReplyDate), 1)
                ])) : vue.createCommentVNode("", true)
              ]),
              $options.config.showToolbar ? (vue.openBlock(), vue.createBlock(_component_BaseSelect, {
                key: 0,
                "display-type": $props.displayType,
                "onUpdate:displayType": _cache[3] || (_cache[3] = (e2) => _ctx.$emit("update:displayType", e2))
              }, null, 8, ["display-type"])) : (vue.openBlock(), vue.createElementBlock("div", {
                key: 1,
                class: "fr",
                innerHTML: $options.post.fr
              }, null, 8, _hoisted_26))
            ])) : vue.createCommentVNode("", true),
            $options.replyList.length || $props.loading ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              $props.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_27, [
                vue.createVNode(_component_BaseLoading, { size: "large" })
              ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_28, [
                $props.modelValue ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList($options.replyList, (item, index) => {
                  return vue.openBlock(), vue.createBlock(_component_Comment, {
                    key: item.floor,
                    modelValue: $options.replyList[index],
                    "onUpdate:modelValue": ($event) => $options.replyList[index] = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]);
                }), 128)) : vue.createCommentVNode("", true)
              ]))
            ], 64)) : vue.createCommentVNode("", true)
          ]),
          !($options.replyList.length || $props.loading) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_29, "目前尚无回复")) : vue.createCommentVNode("", true),
          $options.isLogin ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 2,
            class: vue.normalizeClass(["my-box", { "sticky": $data.isSticky }]),
            ref: "replyBox"
          }, [
            vue.createElementVNode("div", _hoisted_30, [
              _cache[42] || (_cache[42] = vue.createElementVNode("span", null, "添加一条新回复", -1)),
              vue.createElementVNode("div", _hoisted_31, [
                $data.isSticky ? (vue.openBlock(), vue.createElementBlock("a", {
                  key: 0,
                  style: { "margin-right": "2rem" },
                  onClick: _cache[4] || (_cache[4] = vue.withModifiers(($event) => $data.isSticky = false, ["stop"]))
                }, "取消回复框停靠")) : vue.createCommentVNode("", true),
                vue.createElementVNode("a", {
                  onClick: _cache[5] || (_cache[5] = vue.withModifiers((...args) => $options.scrollTop && $options.scrollTop(...args), ["stop"]))
                }, "回到顶部")
              ])
            ]),
            vue.createElementVNode("div", _hoisted_32, [
              vue.createVNode(_component_PostEditor, {
                onClose: $options.goBottom,
                ref: "post-editor",
                useType: "reply-post",
                onClick: _cache[6] || (_cache[6] = vue.withModifiers(($event) => $data.isSticky = true, ["stop"]))
              }, null, 8, ["onClose"])
            ])
          ], 2)) : vue.createCommentVNode("", true)
        ], 4),
        $data.showRelationReply ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "relationReply",
          onClick: _cache[10] || (_cache[10] = vue.withModifiers(($event) => $options.close("space"), ["stop"]))
        }, [
          vue.createElementVNode("div", {
            class: "my-cell flex",
            onClick: _cache[8] || (_cache[8] = vue.withModifiers((...args) => $options.stop && $options.stop(...args), ["stop"]))
          }, [
            _cache[43] || (_cache[43] = vue.createElementVNode("span", { class: "gray" }, "上下文", -1)),
            vue.createElementVNode("div", _hoisted_33, [
              vue.createVNode(_component_Icon, {
                icon: "ic:round-close",
                onClick: _cache[7] || (_cache[7] = vue.withModifiers(($event) => $data.showRelationReply = false, ["stop"]))
              })
            ])
          ]),
          vue.createElementVNode("div", {
            class: "comments",
            onClick: _cache[9] || (_cache[9] = vue.withModifiers((...args) => $options.stop && $options.stop(...args), ["stop"]))
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.relationReply, (item, index) => {
              return vue.openBlock(), vue.createBlock(_component_SingleComment, {
                "is-right": item.username === $data.targetUser.right,
                key: item.floor,
                comment: item
              }, null, 8, ["is-right", "comment"]);
            }), 128))
          ])
        ])) : vue.createCommentVNode("", true),
        $data.showCallList && $options.filterCallList.length ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: "call-list",
          style: vue.normalizeStyle($data.callStyle)
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.filterCallList, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass(["call-item", { select: index === $data.selectCallIndex }]),
              onClick: vue.withModifiers(($event) => $options.setCall(item), ["stop"])
            }, [
              vue.createElementVNode("a", null, vue.toDisplayString(item), 1)
            ], 10, _hoisted_34);
          }), 256))
        ], 4)) : vue.createCommentVNode("", true),
        vue.createElementVNode("div", {
          class: "close-btn",
          onClick: _cache[11] || (_cache[11] = vue.withModifiers(($event) => $options.close("btn"), ["stop"]))
        }, [
          vue.createVNode(_component_Icon, { icon: "icon-park-outline:close" })
        ]),
        vue.createElementVNode("div", {
          class: "open-new-tab",
          onClick: _cache[12] || (_cache[12] = vue.withModifiers(($event) => $options.functions.openNewTab("https://www.v2ex.com/t/" + $options.post.id, $options.config.newTabOpenActive), ["stop"]))
        }, [
          vue.createVNode(_component_Icon, { icon: "majesticons:open" })
        ]),
        vue.createElementVNode("div", {
          class: "refresh gray",
          onClick: _cache[13] || (_cache[13] = vue.withModifiers(($event) => _ctx.$emit("refresh"), ["stop"]))
        }, [
          $props.refreshLoading ? (vue.openBlock(), vue.createBlock(_component_BaseLoading, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_Icon, {
            key: 1,
            icon: "material-symbols:refresh"
          }))
        ]),
        vue.createElementVNode("div", {
          class: "scroll-to gray",
          onClick: _cache[17] || (_cache[17] = vue.withModifiers(($event) => $options.jump($data.currentFloor), ["stop"]))
        }, [
          vue.createVNode(_component_Icon, { icon: "lucide:move-down" }),
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.currentFloor = $event),
            onClick: _cache[15] || (_cache[15] = vue.withModifiers((...args) => $options.stop && $options.stop(...args), ["stop"])),
            onKeydown: _cache[16] || (_cache[16] = vue.withKeys(($event) => $options.jump($data.currentFloor), ["enter"]))
          }, null, 544), [
            [vue.vModelText, $data.currentFloor]
          ])
        ]),
        vue.createElementVNode("div", {
          class: "v2next-scroll-top gray",
          onClick: _cache[18] || (_cache[18] = vue.withModifiers((...args) => $options.scrollTop && $options.scrollTop(...args), ["stop"]))
        }, [
          vue.createVNode(_component_Icon, { icon: "lucide:move-up" })
        ])
      ], 2),
      (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
        vue.createElementVNode("div", {
          class: "preview-modal",
          onWheel: _cache[21] || (_cache[21] = (...args) => $options.wheel && $options.wheel(...args))
        }, [
          vue.createElementVNode("div", {
            class: "mask",
            onClick: _cache[20] || (_cache[20] = (...args) => $options.closePreviewModal && $options.closePreviewModal(...args))
          }),
          vue.createVNode(_component_Icon, {
            class: "close",
            icon: "fontisto:close-a",
            onClick: $options.closePreviewModal
          }, null, 8, ["onClick"])
        ], 32)
      ]))
    ], 34)), [
      [vue.vShow, $props.modelValue]
    ]);
  }
  const PostDetail = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$2], ["__scopeId", "data-v-d39217d8"]]);
  const _hoisted_1$5 = { key: 1 };
  const _sfc_main$5 = {
    __name: "Base64Tooltip",
    setup(__props) {
      const tooltip = vue.ref(null);
      const show = vue.ref(false);
      const originalText = vue.ref("");
      const decodeText = vue.ref("");
      const styleObject = vue.reactive({
        left: "-100vw",
        top: "-100vh"
      });
      vue.onMounted(() => {
        eventBus.on(CMD.SHOW_TOOLTIP, ({ text, e: e2 }) => {
          setTimeout(() => show.value = true);
          originalText.value = text;
          decodeText.value = "";
          styleObject.left = e2.clientX + "px";
          styleObject.top = e2.clientY + 20 + "px";
        });
        window.addEventListener("click", (e2) => {
          if (!tooltip.value)
            return;
          if (!tooltip.value.contains(e2.target) && show.value) {
            show.value = false;
          }
        }, { capture: true });
        const fn = () => show.value && (show.value = false);
        $(".post-detail", document).on("scroll", fn);
      });
      function copy() {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(decodeText.value);
          eventBus.emit(CMD.SHOW_MSG, { type: "success", text: "复制成功" });
        } else {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "复制失败！浏览器不支持！" });
        }
      }
      function base64ToArrayBuffer(base64) {
        let binary_string = window.atob(base64);
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
      }
      function decode() {
        try {
          new Blob([base64ToArrayBuffer(originalText.value)]).text().then((r2) => {
            decodeText.value = r2;
          });
        } catch (e2) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "Base64解码失败！不是标准数据！" });
        }
      }
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          class: "base64_tooltip",
          style: vue.normalizeStyle(styleObject),
          onClick: decode,
          ref_key: "tooltip",
          ref: tooltip
        }, [
          !decodeText.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            vue.createTextVNode(" Base64解码：" + vue.toDisplayString(originalText.value) + " ", 1),
            vue.createVNode(vue.unref(Icon), { icon: "system-uicons:translate" })
          ], 64)) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [
            vue.createElementVNode("span", null, vue.toDisplayString(decodeText.value), 1),
            vue.createVNode(BaseButton, {
              class: "btn",
              size: "small",
              onClick: copy
            }, {
              default: vue.withCtx(() => [..._cache[0] || (_cache[0] = [
                vue.createTextVNode("点击复制", -1)
              ])]),
              _: 1
            })
          ]))
        ], 4)), [
          [vue.vShow, show.value]
        ]);
      };
    }
  };
  const Base64Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-06429e70"]]);
  const _sfc_main$4 = {
    name: "Msg",
    components: { Icon },
    props: {
      type: "",
      text: ""
    },
    created() {
      setTimeout(() => {
        this.$emit("close");
      }, 3e3);
    }
  };
  const _hoisted_1$4 = { class: "right" };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Icon = vue.resolveComponent("Icon");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["msg", $props.type])
    }, [
      vue.createElementVNode("div", {
        class: "left",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
      }, [
        vue.createVNode(_component_Icon, { icon: "ic:round-close" })
      ]),
      vue.createElementVNode("div", _hoisted_1$4, vue.toDisplayString($props.text), 1)
    ], 2);
  }
  const Msg = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$1], ["__scopeId", "data-v-8bf692ea"]]);
  const _hoisted_1$3 = {
    key: 0,
    class: "tag-modal modal"
  };
  const _hoisted_2$2 = { class: "wrapper" };
  const _hoisted_3$2 = { class: "option" };
  const _hoisted_4$2 = { class: "btns" };
  const _sfc_main$3 = {
    __name: "TagModal",
    props: ["tags"],
    emits: ["update:tags"],
    setup(__props, { emit: __emit }) {
      const tagModal = vue.reactive({
        show: false,
        currentUsername: "",
        tag: ""
      });
      const props = __props;
      const emit = __emit;
      const inputRef = vue.ref();
      vue.onMounted(() => {
        eventBus.on(CMD.ADD_TAG, (username) => {
          tagModal.currentUsername = username;
          tagModal.show = true;
          vue.nextTick(() => {
            inputRef.value.focus();
          });
        });
      });
      async function addTag() {
        if (!tagModal.tag) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "请输入标签" });
          return;
        }
        let oldTag = functions.clone(props.tags);
        let tempTag = functions.clone(props.tags);
        let userTags = tempTag[tagModal.currentUsername] ?? [];
        let rIndex = userTags.findIndex((v) => v === tagModal.tag);
        if (rIndex > -1) {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "标签已存在！" });
          return;
        } else {
          userTags.push(tagModal.tag);
        }
        tempTag[tagModal.currentUsername] = userTags;
        emit("update:tags", tempTag);
        tagModal.tag = "";
        tagModal.show = false;
        let res = await window.parse.saveTags(tempTag);
        if (!res) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "标签添加失败！" });
          emit("update:tags", oldTag);
        }
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, null, {
          default: vue.withCtx(() => [
            tagModal.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
              vue.createElementVNode("div", {
                class: "mask",
                onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => tagModal.show = false, ["stop"]))
              }),
              vue.createElementVNode("div", _hoisted_2$2, [
                _cache[6] || (_cache[6] = vue.createElementVNode("div", { class: "title" }, " 添加标签 ", -1)),
                vue.createElementVNode("div", _hoisted_3$2, [
                  _cache[3] || (_cache[3] = vue.createElementVNode("span", null, "用户：", -1)),
                  vue.createElementVNode("div", null, [
                    vue.createElementVNode("b", null, vue.toDisplayString(tagModal.currentUsername), 1)
                  ])
                ]),
                vue.withDirectives(vue.createElementVNode("input", {
                  type: "text",
                  ref_key: "inputRef",
                  ref: inputRef,
                  style: { "width": "100%" },
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => tagModal.tag = $event),
                  onKeydown: vue.withKeys(addTag, ["enter"])
                }, null, 544), [
                  [vue.vModelText, tagModal.tag]
                ]),
                vue.createElementVNode("div", _hoisted_4$2, [
                  vue.createVNode(BaseButton, {
                    type: "link",
                    onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => {
                      tagModal.show = false;
                      tagModal.tag = "";
                    }, ["stop"]))
                  }, {
                    default: vue.withCtx(() => [..._cache[4] || (_cache[4] = [
                      vue.createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  vue.createVNode(BaseButton, {
                    onClick: vue.withModifiers(addTag, ["stop"])
                  }, {
                    default: vue.withCtx(() => [..._cache[5] || (_cache[5] = [
                      vue.createTextVNode("确定", -1)
                    ])]),
                    _: 1
                  })
                ])
              ])
            ])) : vue.createCommentVNode("", true)
          ]),
          _: 1
        });
      };
    }
  };
  const TagModal = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-0f1f99f7"]]);
  const _hoisted_1$2 = { class: "msgs" };
  const _sfc_main$2 = {
    __name: "MsgModal",
    setup(__props) {
      const msgList = vue.reactive([
        // {type: 'success', text: '123', id: Date.now()}
      ]);
      vue.onMounted(() => {
        eventBus.on(CMD.SHOW_MSG, (val) => {
          msgList.push({ ...val, id: Date.now() });
        });
      });
      function removeMsg(id) {
        let rIndex = msgList.findIndex((item) => item.id === id);
        if (rIndex > -1) {
          msgList.splice(rIndex, 1);
        }
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(msgList, (v) => {
            return vue.openBlock(), vue.createBlock(Msg, {
              key: v.id,
              type: v.type,
              text: v.text,
              onClose: ($event) => removeMsg(v.id)
            }, null, 8, ["type", "text", "onClose"]);
          }), 128))
        ]);
      };
    }
  };
  const MsgModal = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-b73f4332"]]);
  let u = ".__cf_email__", f = "data-cfemail", d = document.createElement("div");
  function e(e2) {
    console.error(e2);
  }
  function r(e2, t) {
    let r2 = e2.substr(t, 2);
    return parseInt(r2, 16);
  }
  function n(href, index) {
    let o = "", a = r(href, index);
    for (let i = index + 2; i < href.length; i += 2) {
      let l = r(href, i) ^ a;
      o += String.fromCharCode(l);
    }
    try {
      o = decodeURIComponent(escape(o));
    } catch (u2) {
      e(u2);
    }
    d.innerHTML = '<a href="' + o.replace(/"/g, "&quot;") + '"></a>';
    return d.childNodes[0].getAttribute("href") || "";
  }
  function decodeEmail(body) {
    try {
      let as = body.find(u);
      as.each(function() {
        try {
          let o = this, a = o.parentNode, i = o.getAttribute(f);
          if (i) {
            let l = n(i, 0), d2 = document.createTextNode(l);
            a.replaceChild(d2, o);
          }
        } catch (h2) {
          e(h2);
        }
      });
    } catch (s) {
      e(s);
    }
  }
  const _hoisted_1$1 = {
    key: 0,
    class: "NotificationModal modal"
  };
  const _hoisted_2$1 = { class: "modal-root" };
  const _hoisted_3$1 = { class: "modal-body" };
  const _hoisted_4$1 = { class: "filter" };
  const _hoisted_5$1 = { class: "list-wrap" };
  const _hoisted_6$1 = { class: "notify-wrap" };
  const _hoisted_7$1 = ["innerHTML"];
  const _hoisted_8$1 = {
    key: 0,
    class: "loading-wrap"
  };
  const _hoisted_9$1 = { class: "footer" };
  const _hoisted_10$1 = ["innerHTML"];
  const _hoisted_11$1 = { class: "total" };
  const _sfc_main$1 = {
    __name: "NotificationModal",
    props: ["modelValue", "list", "total", "pages", "loading"],
    emits: ["update:modelValue"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const index = vue.ref("all");
      vue.onMounted(() => {
      });
      vue.watch([index, () => props.list], () => {
        $(".notify-wrap").scrollTop(0);
      });
      vue.watch(() => props.modelValue, (n2) => {
        if (n2) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "unset";
          $(".notify-wrap").scrollTop(0);
        }
      });
      function close() {
        emit("update:modelValue", false);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, null, {
          default: vue.withCtx(() => [
            __props.modelValue ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
              vue.createElementVNode("div", {
                class: "mask",
                onClick: vue.withModifiers(close, ["stop"])
              }),
              vue.createElementVNode("div", _hoisted_2$1, [
                vue.createElementVNode("div", { class: "modal-header" }, [
                  _cache[4] || (_cache[4] = vue.createElementVNode("div", { class: "title" }, " 提醒系统 ", -1)),
                  vue.createElementVNode("i", {
                    class: "fa fa-times",
                    onClick: close
                  })
                ]),
                vue.createElementVNode("div", _hoisted_3$1, [
                  vue.createElementVNode("div", _hoisted_4$1, [
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(index.value === "all" && "active"),
                      onClick: _cache[0] || (_cache[0] = ($event) => index.value = "all")
                    }, "全部", 2),
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(index.value === "reply" && "active"),
                      onClick: _cache[1] || (_cache[1] = ($event) => index.value = "reply")
                    }, "回复", 2),
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(index.value === "star" && "active"),
                      onClick: _cache[2] || (_cache[2] = ($event) => index.value = "star")
                    }, "感谢", 2),
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(index.value === "collect" && "active"),
                      onClick: _cache[3] || (_cache[3] = ($event) => index.value = "collect")
                    }, "收藏", 2)
                  ]),
                  vue.createElementVNode("div", _hoisted_5$1, [
                    vue.createElementVNode("div", _hoisted_6$1, [
                      vue.createElementVNode("div", {
                        id: "notifications",
                        class: vue.normalizeClass(index.value),
                        innerHTML: __props.list
                      }, null, 10, _hoisted_7$1)
                    ]),
                    __props.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8$1, [
                      vue.createVNode(BaseLoading)
                    ])) : vue.createCommentVNode("", true)
                  ]),
                  vue.createElementVNode("div", _hoisted_9$1, [
                    vue.createElementVNode("div", {
                      innerHTML: __props.pages,
                      class: "pages"
                    }, null, 8, _hoisted_10$1),
                    vue.createElementVNode("div", _hoisted_11$1, [
                      _cache[5] || (_cache[5] = vue.createElementVNode("span", null, "总共收到提醒", -1)),
                      vue.createTextVNode(vue.toDisplayString(__props.total), 1)
                    ])
                  ])
                ])
              ])
            ])) : vue.createCommentVNode("", true)
          ]),
          _: 1
        });
      };
    }
  };
  const NotificationModal = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-77aa374e"]]);
  const _sfc_main = {
    components: {
      Icon,
      BaseButton,
      NotificationModal,
      BaseLoading,
      BaseSwitch,
      MsgModal,
      TagModal,
      Tooltip,
      Setting,
      PostDetail,
      Base64Tooltip,
      Msg
    },
    provide() {
      return {
        isLogin: vue.computed(() => this.isLogin),
        isNight: vue.computed(() => this.isNight),
        pageType: vue.computed(() => this.pageType),
        tags: vue.computed(() => this.tags),
        show: vue.computed(() => this.show),
        post: vue.computed(() => this.current),
        config: vue.computed(() => this.config),
        allReplyUsers: vue.computed(() => {
          var _a, _b, _c;
          if ((_a = this.current) == null ? void 0 : _a.replyList) {
            return Array.from(new Set(((_c = (_b = this.current) == null ? void 0 : _b.replyList) == null ? void 0 : _c.map((v) => v.username)) ?? []));
          }
          return [];
        }),
        showConfig: this.showConfig
      };
    },
    data() {
      return {
        loading: window.pageType === PageType.Post,
        refreshLoading: false,
        loadMore: false,
        isLogin: !!window.user.username,
        pageType: window.pageType,
        isNight: window.isNight,
        stopMe: window.stopMe,
        //停止使用脚本
        show: false,
        current: getDefaultPost(),
        list: [],
        config: functions.clone(window.config),
        tags: window.user.tags,
        configModal: {
          show: false
        },
        notificationModal: {
          show: false,
          loading: false,
          list: "",
          total: 0
        },
        previewModal: {
          show: false,
          src: ""
        },
        popConfirmModal: {
          show: false,
          title: "",
          id: ""
        },
        timer: -1,
        timer2: -1,
        pageInfo: {
          title: "",
          number: 0
        },
        calendar: {
          show: false,
          year: "",
          month: "",
          dayCount: 0,
          firstDayWeek: 0,
          select: ""
        }
      };
    },
    computed: {
      targetUserTags() {
        return this.tags[window.targetUserName] ?? [];
      },
      isList() {
        return [PageType.Home, PageType.Node].includes(this.pageType);
      },
      isPost() {
        return this.pageType === PageType.Post;
      },
      isMember() {
        return this.pageType === PageType.Member;
      }
    },
    watch: {
      config: {
        handler(newVal, oldVal) {
          console.log("config", functions.clone(newVal).notice, functions.clone(oldVal).notice);
          let configStr = localStorage.getItem("v2ex-config");
          if (configStr) {
            let configObj = JSON.parse(configStr);
            configObj[window.user.username || "default"] = newVal;
            localStorage.setItem("v2ex-config", JSON.stringify(configObj));
          }
          window.config = newVal;
          window.parse.editNoteItem(window.user.configPrefix + JSON.stringify(window.config), window.user.configNoteId);
        },
        deep: true
      },
      tags(newVal) {
        window.user.tags = newVal;
      },
      "config.viewType"(newVal) {
        if (!newVal)
          return;
        if (newVal === "card") {
          $(".post-item").each(function() {
            $(this).addClass("preview");
          });
        } else {
          $(".post-item").each(function() {
            $(this).removeClass("preview");
          });
        }
      },
      "pageInfo.number"(newVal) {
        clearInterval(this.timer2);
        if (newVal) {
          document.title = `(${this.pageInfo.number}) ` + this.pageInfo.title;
          if (this.config.notice.whenNewNoticeGlimmer) {
            let c = 0;
            this.timer2 = setInterval(() => {
              c++;
              document.title = this.pageInfo.title;
              if (c % 2 === 0) {
                document.title = `(${this.pageInfo.number}) ` + this.pageInfo.title;
              }
            }, 1e3);
          }
        } else {
          document.title = this.pageInfo.title;
        }
      },
      show(newVal) {
        if (this.pageType === PageType.Post)
          return;
        if (newVal) {
          document.body.style.overflow = "hidden";
          if (!window.history.state) {
            window.history.pushState({}, 0, this.current.href);
          }
          vue.nextTick(() => {
            this.pageInfo.title = document.title = this.current.title ?? "V2EX";
          });
        } else {
          document.body.style.overflow = "unset";
          this.pageInfo.title = document.title = "V2EX";
          if (window.history.state) {
            window.history.back();
          }
        }
      }
    },
    created() {
      let that = this;
      this.initEvent();
      window.cb = this.winCb;
      if (!window.canParseV2exPage)
        return;
      $(document).on("click", "a", this.clickA);
      $(document).on("click", ".post-item", function(e2) {
        if (e2.currentTarget.getAttribute("script"))
          return;
        if (that.stopMe)
          return true;
        if (this.classList.contains("preview")) {
          if (e2.target.tagName !== "A" && e2.target.tagName !== "IMG" && !e2.target.classList.contains("toggle")) {
            let id = this.dataset["id"];
            let href = this.dataset["href"];
            if (id) {
              that.clickPost(e2, id, href);
            } else {
              if (href)
                location.href = href;
            }
          }
        }
      });
      $(document).on("click", ".toggle", (e2) => {
        if (this.stopMe)
          return true;
        let id = e2.target.dataset["id"];
        let itemDom = document.querySelector(`.id_${id}`);
        if (itemDom.classList.contains("preview")) {
          e2.target.innerText = "预览";
          itemDom.classList.remove("preview");
        } else {
          if (this.config.viewType !== "card") {
            let index = this.list.findIndex((v) => v.id == id);
            if (index > -1) {
              e2.target.innerText = "收起";
              itemDom.classList.add("preview");
            } else {
              e2.target.innerText = "加载中";
              functions.getPostDetailByApi(id).then((res) => {
                if (res.content_rendered) {
                  res.href = itemDom.dataset["href"];
                  this.list.push(getDefaultPost(res));
                  itemDom.classList.add("preview");
                  e2.target.innerText = "收起";
                  functions.appendPostContent(res, itemDom);
                } else {
                  e2.target.innerText = "预览";
                  eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "主题暂无正文！" });
                }
              });
            }
          } else {
            e2.target.innerText = "收起";
            itemDom.classList.add("preview");
          }
        }
      });
      window.onpopstate = (event) => {
        if (event.state) {
          if (!this.show)
            this.show = true;
        } else {
          if (this.show)
            this.show = false;
        }
      };
      if (this.config.notice.takeOverNoticePage) {
        window.deleteNotification = (nId, token) => {
          let item = $("#n_" + nId);
          item.slideUp("fast");
          $.post({
            url: "/delete/notification/" + nId + "?once=" + token,
            success() {
              $.get({
                url: "/notifications/below/" + window.notificationBottom,
                success(data, status, request) {
                  item.remove();
                  $("#notifications").append(that.checkReplyItemType(data));
                  window.notificationBottom = request.getResponseHeader("X-V2EX-New-Notification-Bottom");
                },
                error() {
                  item.slideDown("fast");
                }
              });
            },
            error() {
              item.slideDown("fast");
            }
          });
        };
      }
    },
    beforeUnmount() {
      clearInterval(this.timer);
      eventBus.clear();
      $(document).off("click", "a", this.clickA);
    },
    methods: {
      getMonthDayInfo(num) {
        let now = dayjs();
        now = now.year(this.calendar.year);
        now = now.month(this.calendar.month);
        if (num > 0) {
          now = now.add(1, "month");
        } else {
          now = now.subtract(1, "month");
        }
        this.calendar.year = now.year();
        this.calendar.month = now.month();
        this.calendar.dayCount = now.daysInMonth();
        this.calendar.firstDayWeek = now.startOf("month").day();
      },
      checkReplyItemType(val) {
        let d2 = $(val);
        let str = d2.html();
        if (str.includes("提到了你") || str.includes("回复了你")) {
          d2.addClass("reply");
        }
        if (str.includes("感谢了你")) {
          d2.addClass("star");
        }
        if (str.includes("收藏了你")) {
          d2.addClass("collect");
        }
        return d2;
      },
      async getUnreadMessagesCount() {
        var _a, _b;
        const res = await fetch(`${location.origin}/mission`);
        const htmlText = await res.text();
        const $page = $(htmlText);
        const text = $page.find('#Rightbar a[href^="/notifications"]').text();
        if (text.includes("未读提醒")) {
          const countStr = (_a = text.match(/\d+/)) == null ? void 0 : _a.at(0);
          if (countStr) {
            return Number((_b = text.match(/\d+/)) == null ? void 0 : _b.at(0));
          }
        } else {
          return 0;
        }
        throw new Error("无法获取未读消息数量");
      },
      clickA(e2) {
        let that = this;
        if (e2.currentTarget.getAttribute("script"))
          return;
        if (that.stopMe)
          return true;
        let { pageType } = functions.checkPageType(e2.currentTarget);
        let { href, id, title } = functions.parseA(e2.currentTarget);
        switch (pageType) {
          case PageType.Post:
            if (id) {
              that.clickPost(e2, id, href, title);
            }
            break;
          case PageType.Node:
          case PageType.Home:
          case PageType.Changes:
            return;
          case PageType.Hot:
            let date = e2.currentTarget.search.replace("?", "");
            if (date === "setting") {
              if (this.calendar.show) {
                $("#Rightbar > .sep20:first").css("height", "var(--component-margin)");
              } else {
                $("#Rightbar > .sep20:first").css("height", "unset");
                let now2 = dayjs();
                this.calendar.year = now2.year();
                this.calendar.month = now2.month();
                this.calendar.dayCount = now2.daysInMonth();
                this.calendar.firstDayWeek = now2.startOf("month").day();
                this.calendar.select = `${this.calendar.year}-${this.calendar.month + 1}-${now2.date()}`;
              }
              this.calendar.show = !this.calendar.show;
              functions.stopEvent(e2);
              return;
            }
            let now = dayjs();
            let day = "";
            switch (Number(date)) {
              case -1:
                day = now.subtract(1, "day").format("YYYY-M-D");
                break;
              case -2:
                day = now.subtract(2, "day").format("YYYY-M-D");
                break;
              case 3:
                day = "3d";
                break;
              case 7:
                day = "7d";
                break;
              case 30:
                day = "30d";
                break;
              default:
                day = date;
                if (dayjs(day).isSame(now, "day")) {
                  functions.stopEvent(e2);
                  return location.reload();
                }
            }
            if (day) {
              fetch(DefaultVal.hotUrl + day + ".json").then(async (r2) => {
                let r1 = await r2.json();
                $(".cell.item.post-item").remove();
                r1.reverse().map((v) => {
                  let s = `
<div class="cell item post-item id_${v.id}" style="" data-href="https://www.v2ex.com/t/${v.id}#reply${v.replyCount}">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tbody>
      <tr>
        <td width="48" valign="top" align="center">
          <a href="/member/${v.username}">
            <img src="${v.avatar}" class="avatar"
                 border="0" align="default"
                 width="48"
                 style="width: 48px; max-height: 48px;"
                 alt="ice9191">
          </a>
        </td>
        <td width="10"></td>
        <td width="auto" valign="middle">
          <span class="item_title">
            <a href="https://www.v2ex.com/t/${v.id}#reply${v.replyCount}" class="topic-link" id="topic-link-${v.id}">${v.title}</a>
          </span>
          <div class="sep5"></div>
          <span class="topic_info">
            <div class="votes"></div>
            <a class="node" href="/go/${v.nodeUrl}">${v.nodeTitle}</a> &nbsp;•&nbsp;
            <strong><a href="/member/${v.username}">${v.username}</a></strong> &nbsp;•&nbsp;
            <span title="${v.lastReplyDate}">${v.lastReplyDateAgo}</span> &nbsp;•&nbsp; 最后回复来自
            <strong><a href="/member/${v.lastReplyUsername}">${v.lastReplyUsername}</a></strong>
          </span>
        </td>
        <td width="70" align="right" valign="middle" style="position: relative;">
          <a href="/t/${v.id}#reply${v.replyCount}" class="count_livid">${v.replyCount}</a>
          <div data-id="${v.id}" class="toggle">预览</div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
                `;
                  $("#app").after($(s));
                });
              }).catch((e3) => {
                eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "暂无点击日期的最热数据！" });
              });
            }
            functions.stopEvent(e2);
            return;
          default:
            if (e2.currentTarget.href.includes("/settings/night/toggle"))
              return;
            if (e2.currentTarget.href === location.origin + "/#;")
              return;
            if (e2.currentTarget.href.includes("/notifications")) {
              this.pageInfo.number = 0;
              $("#money").parent().prev().replaceWith(`<a href="/notifications">0 未读提醒</a>`);
              if (this.config.notice.takeOverNoticePage) {
                this.notificationModal.loading = true;
                this.notificationModal.show = true;
                fetch(href).then(async (r2) => {
                  let htmlText = await r2.text();
                  let bodyText = htmlText.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
                  let res = htmlText.match(/var notificationBottom = ([\d]+);/);
                  if (res && res[1]) {
                    window.notificationBottom = Number(res[1]);
                    console.log(" window.notificationBottom", window.notificationBottom);
                  }
                  let body = $(bodyText[0]);
                  let list = body.find("#notifications");
                  list.children().each(function() {
                    that.checkReplyItemType(this);
                  });
                  let h2 = list.html();
                  let d2 = body.find("#Main > .box > .header .fr .gray");
                  if (d2.length) {
                    this.notificationModal.total = d2.text();
                  }
                  this.notificationModal.list = h2;
                  let p = list.next();
                  let tds = p.find(".button");
                  tds.each(function() {
                    let href2 = this.getAttribute("onclick");
                    if (href2) {
                      this.innerHTML = `<a href=${href2.replace("location.href=", "")}>${this.innerHTML}</a>`;
                      this.setAttribute("onclick", "");
                    }
                  });
                  this.notificationModal.pages = p.html();
                  this.notificationModal.loading = false;
                }).catch((e3) => {
                  this.notificationModal.loading = false;
                });
                functions.stopEvent(e2);
                return;
              }
            }
            if (that.config.newTabOpen) {
              functions.stopEvent(e2);
              functions.openNewTab(e2.currentTarget.href, that.config.newTabOpenActive);
            }
            return;
        }
      },
      async clickPost(e2, id, href, title = "") {
        if (id) {
          if (this.config.clickPostItemOpenDetail) {
            functions.stopEvent(e2);
            let postItem = getDefaultPost();
            let index = this.list.findIndex((v) => v.id == id);
            if (index > -1) {
              postItem = this.list[index];
            }
            if (!postItem.title)
              postItem.title = title ?? "加载中";
            postItem.id = id;
            postItem.href = href;
            this.getPostDetail(postItem);
            return;
          }
          if (this.config.newTabOpen) {
            functions.stopEvent(e2);
            functions.openNewTab(`https://www.v2ex.com/t/${id}?p=1`, this.config.newTabOpenActive);
          }
        }
      },
      showPost() {
        this.show = true;
        $(`#Wrapper #Main .box:lt(3)`).each(function() {
          $(this).hide();
        });
      },
      showConfig() {
        this.configModal.show = true;
      },
      resetTitle() {
        let r2 = document.title.match(/\s?\(\d+\)\s?/);
        if (r2 && r2.length) {
          this.pageInfo.title = document.title.replace(r2[0], "");
        } else {
          this.pageInfo.title = document.title;
        }
      },
      async getNotice(body) {
        if (!body) {
          let res = await fetch("/t");
          if (res.status === 200) {
            let htmlText = await res.text();
            let bodyText = htmlText.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
            body = $(bodyText[0]);
          }
        }
        let notify = body.find('a[href="/notifications"]');
        if (notify.length) {
          this.resetTitle();
          let text = notify.text();
          if (text !== "0 未读提醒") {
            this.pageInfo.number = text.replace(" 未读提醒", "");
            console.log("text", text, this.config.notice.ddWebhook);
            if (this.config.notice.text !== text) {
              console.log("有新消息", text, this.config.notice.text);
              $("#money").parent().prev().replaceWith(`<div><div class="orange-dot"></div><strong><a href="/notifications">${text}</a></strong></div>`);
              this.config.notice.text = text;
              if (this.config.notice.ddWebhook) {
                let n2 = /* @__PURE__ */ new Date();
                let s = n2.getSeconds();
                s = s < 10 ? "0" + s : s;
                let m = n2.getMinutes();
                m = m < 10 ? "0" + m : m;
                let h2 = n2.getHours();
                h2 = h2 < 10 ? "0" + h2 : h2;
                $.ajax("https://car-back.ttentau.top/index.php/v1/config/forward", {
                  method: "POST",
                  contentType: "application/json",
                  data: JSON.stringify({
                    url: this.config.notice.ddWebhook,
                    "text": notify.text() + `，时间：${n2.getFullYear()}/${n2.getMonth() + 1}/${n2.getDate()} ${h2}:${m}:${s}`
                  })
                });
              }
            }
          } else {
            $("#money").parent().prev().replaceWith(`<a href="/notifications">${text}</a>`);
            this.config.notice.text = "";
          }
        }
      },
      async winCb({ type, value }) {
        console.log("回调的类型", type, value);
        if (type === "openSetting") {
          this.showConfig();
        }
        if (type === "syncData") {
          this.stopMe = window.stopMe;
        }
        if (type === "getConfigSuccess") {
          if (window.config.version < DefaultVal.currentVersion && window.isDeadline) {
            $(".v2next-setting span").after(`<div class="new v2next-new">new</div>`);
          }
          if (window.isLogin && window.config.notice.loopCheckNotice) {
            this.getNotice($(document.body));
            this.timer = setInterval(this.getNotice, 1e3 * 60 * Number(window.config.notice.loopCheckNoticeInterval));
          }
          this.config = window.config;
          this.tags = window.user.tags;
        }
        if (type === "syncList") {
          this.list = Object.assign(this.list, window.postList);
        }
        if (type === "warningNotice") {
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: value });
        }
        if (this.stopMe)
          return;
        if (type === "restorePost") {
          this.show = false;
          this.loading = false;
          eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "脚本无法查看此页面！" });
          $(`#Wrapper #Main .box:lt(3)`).each(function() {
            $(this).show();
          });
        }
        if (type === "postContent") {
          this.current = Object.assign(this.current, value);
          this.current.inList = true;
          if (this.config.autoOpenDetail) {
            this.showPost();
          }
        }
        if (type === "postReplies") {
          this.loading = false;
          this.current = Object.assign(this.current, value);
          this.list.push(functions.clone(this.current));
        }
      },
      regenerateReplyList() {
        if (this.current.replyList.length) {
          functions.createList(this.current, this.current.replyList);
        } else {
          this.current.replyCount = 0;
          this.current.nestedReplies = [];
          this.current.nestedRedundReplies = [];
        }
        if (this.list.length) {
          let rIndex = this.list.findIndex((i) => i.id === this.current.id);
          if (rIndex > -1) {
            this.list[rIndex] = functions.clone(this.current);
          }
        }
      },
      initEvent() {
        eventBus.on(CMD.CHANGE_COMMENT_THANK, (val) => {
          const { id, type } = val;
          let currentI = this.current.replyList.findIndex((i) => i.id === id);
          if (currentI > -1) {
            this.current.replyList[currentI].isThanked = type === "add";
            if (type === "add") {
              this.current.replyList[currentI].thankCount++;
            } else {
              this.current.replyList[currentI].thankCount--;
            }
            this.regenerateReplyList();
          }
        });
        eventBus.on(CMD.CHANGE_POST_THANK, (val) => {
          const { id, type } = val;
          this.current.isThanked = type === "add";
          if (type === "add") {
            this.current.thankCount++;
          } else {
            this.current.thankCount--;
          }
          let currentI = this.list.findIndex((i) => i.id === id);
          if (currentI > -1) {
            this.list[currentI].isThanked = type === "add";
            if (type === "add") {
              this.list[currentI].thankCount++;
            } else {
              this.list[currentI].thankCount++;
            }
          }
        });
        eventBus.on(CMD.REMOVE, (val) => {
          let removeIndex = this.current.replyList.findIndex((i) => i.floor === val);
          if (removeIndex > -1) {
            this.current.replyList.splice(removeIndex, 1);
          }
          this.regenerateReplyList();
        });
        eventBus.on(CMD.IGNORE, () => {
          this.show = false;
          let rIndex = this.list.findIndex((i) => i.id === this.current.id);
          if (rIndex > -1) {
            this.list.splice(rIndex, 1);
          }
          this.current = getDefaultPost();
        });
        eventBus.on(CMD.MERGE, (val) => {
          this.current = Object.assign(this.current, val);
          let rIndex = this.list.findIndex((i) => i.id === this.current.id);
          if (rIndex > -1) {
            this.list[rIndex] = functions.clone(this.current);
          }
        });
        eventBus.on(CMD.ADD_REPLY, (item) => {
          this.current.replyList.push(item);
          this.regenerateReplyList();
        });
        eventBus.on(CMD.REFRESH_ONCE, async (once) => {
          if (once) {
            if (typeof once === "string") {
              let res = once.match(/var once = "([\d]+)";/);
              if (res && res[1]) {
                this.current.once = Number(res[1]);
                return;
              }
            }
            if (typeof once === "number") {
              this.current.once = once;
              return;
            }
          }
          window.fetchOnce().then((r2) => {
            this.current.once = r2;
          });
        });
        eventBus.on(CMD.REMOVE_TAG, async ({ username, tag }) => {
          let oldTag = functions.clone(this.tags);
          let tags = this.tags[username] ?? [];
          let rIndex = tags.findIndex((v) => v === tag);
          if (rIndex > -1) {
            tags.splice(rIndex, 1);
          }
          this.tags[username] = tags;
          let res = await window.parse.saveTags(this.tags);
          if (!res) {
            eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "标签删除失败！" });
            this.tags = oldTag;
          }
        });
        eventBus.on(CMD.SHOW_CONFIRM_MODAL, (val) => {
          const { rect, title, id } = val;
          this.popConfirmModal.show = true;
          this.popConfirmModal.title = title;
          this.popConfirmModal.id = id;
          vue.nextTick(() => {
            this.$refs.tip.style.top = rect.top + "px";
            this.$refs.tip.style.left = rect.left + rect.width / 2 - 50 + "px";
          });
        });
      },
      async getPostDetail(post) {
        this.current = post;
        this.show = true;
        let url2 = location.origin + "/t/" + this.current.id;
        this.current.url = url2;
        let alreadyHasReply = this.current.replyList.length;
        if (alreadyHasReply) {
          this.refreshLoading = true;
        } else {
          this.loading = true;
          functions.getPostDetailByApi(this.current.id).then((d2) => {
            d2.replyCount = d2.replies;
            this.current = Object.assign(this.current, d2);
            if (this.current.replyCount > window.config.maxReplyCountLimit) {
              functions.openNewTab(`${location.origin}/t/${this.current.id}?p=1&script=1`, true);
              eventBus.emit(CMD.SHOW_MSG, { type: "warning", text: "由于回复数量较多，已为您单独打开此主题" });
              this.loading = this.show = false;
              return;
            } else {
              this.current.jsonContent = `
            <div class="cell">
              <div class="topic_content">
                <div class="markdown_body">
                 ${(d2 == null ? void 0 : d2.content_rendered) ?? ""}
                </div>
              </div>
            </div>`;
            }
          });
        }
        let apiRes = await window.fetch(url2 + "?p=1");
        if (apiRes.status === 404) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "主题未找到" });
          return this.refreshLoading = this.loading = false;
        }
        if (apiRes.status === 403) {
          this.refreshLoading = this.show = this.loading = false;
          functions.openNewTab(`${location.origin}/t/${post.id}?p=1&script=0`, true);
          return;
        }
        if (apiRes.redirected) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "没有权限" });
          return this.refreshLoading = this.loading = false;
        }
        let htmlText = await apiRes.text();
        let hasPermission = htmlText.search("你要查看的页面需要先登录");
        if (hasPermission > -1) {
          eventBus.emit(CMD.SHOW_MSG, { type: "error", text: "你要查看的页面需要先登录" });
          return this.refreshLoading = this.loading = false;
        }
        let bodyText = htmlText.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
        let body = $(bodyText[0]);
        decodeEmail(body);
        await window.parse.getPostDetail(this.current, body, htmlText);
        let index = this.list.findIndex((v) => v.id == this.current.id);
        if (index > -1) {
          this.list[index] = functions.clone(this.current);
        } else {
          this.list.push(functions.clone(this.current));
        }
        this.refreshLoading = this.loading = false;
        await window.parse.parseOp(this.current);
        console.log("当前主题", this.current);
      },
      addTargetUserTag() {
        eventBus.emit(CMD.ADD_TAG, window.targetUserName);
      },
      removeTargetUserTag(tag) {
        eventBus.emit(CMD.REMOVE_TAG, { username: window.targetUserName, tag });
      },
      popConfirmModalCancel() {
        this.popConfirmModal.show = false;
      },
      popConfirmModalConfirm() {
        this.popConfirmModalCancel();
        eventBus.emit(CMD.SHOW_CONFIRM_MODAL_CONFIRM, this.popConfirmModal.id);
      }
    }
  };
  const _hoisted_1 = {
    key: 0,
    class: ""
  };
  const _hoisted_2 = { class: "box calender" };
  const _hoisted_3 = { class: "month" };
  const _hoisted_4 = { class: "ca-title" };
  const _hoisted_5 = { class: "days" };
  const _hoisted_6 = ["onClick"];
  const _hoisted_7 = ["href"];
  const _hoisted_8 = {
    key: 0,
    class: "target-user-tags p1"
  };
  const _hoisted_9 = { class: "my-tag" };
  const _hoisted_10 = ["onClick"];
  const _hoisted_11 = {
    key: 1,
    class: "my-box p2",
    style: { "margin-top": "2rem", "margin-bottom": "0" }
  };
  const _hoisted_12 = {
    key: 0,
    class: "flex flex-center"
  };
  const _hoisted_13 = {
    key: 1,
    class: "loaded"
  };
  const _hoisted_14 = {
    key: 0,
    ref: "tip",
    class: "pop-confirm-content"
  };
  const _hoisted_15 = { class: "text" };
  const _hoisted_16 = { class: "options" };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Setting = vue.resolveComponent("Setting");
    const _component_TagModal = vue.resolveComponent("TagModal");
    const _component_PostDetail = vue.resolveComponent("PostDetail");
    const _component_Base64Tooltip = vue.resolveComponent("Base64Tooltip");
    const _component_MsgModal = vue.resolveComponent("MsgModal");
    const _component_NotificationModal = vue.resolveComponent("NotificationModal");
    const _component_BaseLoading = vue.resolveComponent("BaseLoading");
    const _component_BaseButton = vue.resolveComponent("BaseButton");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createVNode(_component_Setting, {
        modelValue: $data.config,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.config = $event),
        show: $data.configModal.show,
        "onUpdate:show": _cache[1] || (_cache[1] = ($event) => $data.configModal.show = $event)
      }, null, 8, ["modelValue", "show"]),
      vue.createVNode(_component_TagModal, {
        tags: $data.tags,
        "onUpdate:tags": _cache[2] || (_cache[2] = ($event) => $data.tags = $event)
      }, null, 8, ["tags"]),
      vue.createVNode(_component_PostDetail, {
        modelValue: $data.show,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.show = $event),
        ref: "postDetail",
        displayType: $data.config.commentDisplayType,
        "onUpdate:displayType": _cache[4] || (_cache[4] = ($event) => $data.config.commentDisplayType = $event),
        onRefresh: _cache[5] || (_cache[5] = ($event) => $options.getPostDetail($data.current)),
        loading: $data.loading,
        refreshLoading: $data.refreshLoading
      }, null, 8, ["modelValue", "displayType", "loading", "refreshLoading"]),
      vue.createVNode(_component_Base64Tooltip),
      vue.createVNode(_component_MsgModal),
      (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "#Rightbar > .sep20" }, [
        $data.calendar.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          _cache[12] || (_cache[12] = vue.createElementVNode("div", { class: "sep" }, null, -1)),
          vue.createElementVNode("div", _hoisted_2, [
            vue.createElementVNode("div", _hoisted_3, [
              _cache[10] || (_cache[10] = vue.createElementVNode("div", { class: "fade" }, "历史最热", -1)),
              vue.createElementVNode("div", _hoisted_4, [
                vue.createElementVNode("i", {
                  class: "fa fa-arrow-left",
                  onClick: _cache[6] || (_cache[6] = ($event) => $options.getMonthDayInfo(-1)),
                  "aria-hidden": "true"
                }),
                vue.createElementVNode("span", null, vue.toDisplayString($data.calendar.year) + "年" + vue.toDisplayString($data.calendar.month + 1) + "月", 1),
                vue.createElementVNode("i", {
                  class: "fa fa-arrow-right",
                  onClick: _cache[7] || (_cache[7] = ($event) => $options.getMonthDayInfo(1)),
                  "aria-hidden": "true"
                })
              ])
            ]),
            _cache[11] || (_cache[11] = vue.createElementVNode("div", { class: "calender-header" }, [
              vue.createElementVNode("div", null, "日"),
              vue.createElementVNode("div", null, "一"),
              vue.createElementVNode("div", null, "二"),
              vue.createElementVNode("div", null, "三"),
              vue.createElementVNode("div", null, "四"),
              vue.createElementVNode("div", null, "五"),
              vue.createElementVNode("div", null, "六")
            ], -1)),
            vue.createElementVNode("div", _hoisted_5, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.calendar.dayCount + $data.calendar.firstDayWeek, (i) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  class: vue.normalizeClass([
                    "day",
                    $data.calendar.select === `${$data.calendar.year}-${$data.calendar.month + 1}-${i - $data.calendar.firstDayWeek}` ? "active" : ""
                  ]),
                  onClick: ($event) => $data.calendar.select = `${$data.calendar.year}-${$data.calendar.month + 1}-${i - $data.calendar.firstDayWeek}`
                }, [
                  i - $data.calendar.firstDayWeek > 0 ? (vue.openBlock(), vue.createElementBlock("a", {
                    key: 0,
                    href: `/v2hot?${$data.calendar.year}-${$data.calendar.month + 1}-${i - $data.calendar.firstDayWeek}`
                  }, vue.toDisplayString(i - $data.calendar.firstDayWeek > 0 ? i - $data.calendar.firstDayWeek : ""), 9, _hoisted_7)) : vue.createCommentVNode("", true)
                ], 10, _hoisted_6);
              }), 256))
            ])
          ]),
          _cache[13] || (_cache[13] = vue.createElementVNode("div", { class: "sep" }, null, -1))
        ])) : vue.createCommentVNode("", true)
      ])),
      vue.createVNode(_component_NotificationModal, {
        modelValue: $data.notificationModal.show,
        "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.notificationModal.show = $event),
        list: $data.notificationModal.list,
        loading: $data.notificationModal.loading,
        total: $data.notificationModal.total,
        pages: $data.notificationModal.pages
      }, null, 8, ["modelValue", "list", "loading", "total", "pages"]),
      !$data.stopMe ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
        $options.isMember && $data.isLogin && $data.config.openTag ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, [
          _cache[15] || (_cache[15] = vue.createElementVNode("span", null, "标签：", -1)),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.targetUserTags, (i) => {
            return vue.openBlock(), vue.createElementBlock("span", _hoisted_9, [
              _cache[14] || (_cache[14] = vue.createElementVNode("i", { class: "fa fa-tag" }, null, -1)),
              vue.createElementVNode("span", null, vue.toDisplayString(i), 1),
              vue.createElementVNode("i", {
                class: "fa fa-trash-o remove",
                onClick: ($event) => $options.removeTargetUserTag(i)
              }, null, 8, _hoisted_10)
            ]);
          }), 256)),
          vue.createElementVNode("span", {
            class: "add-tag ago",
            onClick: _cache[9] || (_cache[9] = (...args) => $options.addTargetUserTag && $options.addTargetUserTag(...args)),
            title: "添加标签"
          }, "+")
        ])) : vue.createCommentVNode("", true),
        $options.isPost && !$data.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, [
          $data.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12, [
            vue.createVNode(_component_BaseLoading)
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, [
            _cache[17] || (_cache[17] = vue.createElementVNode("span", null, "楼中楼解析完成", -1)),
            vue.createVNode(_component_BaseButton, {
              size: "small",
              onClick: $options.showPost
            }, {
              default: vue.withCtx(() => [..._cache[16] || (_cache[16] = [
                vue.createTextVNode("点击显示", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]))
        ])) : vue.createCommentVNode("", true)
      ], 64)) : vue.createCommentVNode("", true),
      (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
        vue.createVNode(vue.Transition, null, {
          default: vue.withCtx(() => [
            $data.popConfirmModal.show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_14, [
              vue.createElementVNode("div", _hoisted_15, vue.toDisplayString($data.popConfirmModal.title), 1),
              vue.createElementVNode("div", _hoisted_16, [
                vue.createVNode(_component_BaseButton, {
                  type: "link",
                  size: "small",
                  onClick: vue.withModifiers($options.popConfirmModalCancel, ["stop"])
                }, {
                  default: vue.withCtx(() => [..._cache[18] || (_cache[18] = [
                    vue.createTextVNode("取消", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"]),
                vue.createVNode(_component_BaseButton, {
                  size: "small",
                  onClick: vue.withModifiers($options.popConfirmModalConfirm, ["stop"])
                }, {
                  default: vue.withCtx(() => [..._cache[19] || (_cache[19] = [
                    vue.createTextVNode("确认", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ], 512)) : vue.createCommentVNode("", true)
          ]),
          _: 1
        })
      ]))
    ], 64);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a73f564c"]]);
  let isMobile = !document.querySelector("#Rightbar");
  let $section = document.createElement("section");
  $section.id = "app";
  function run() {
    window.user = DefaultUser;
    window.targetUserName = "";
    window.pageType = void 0;
    window.pageData = { pageNo: 1 };
    window.config = getDefaultConfig();
    window.isNight = $(".Night").length === 1;
    window.cb = null;
    window.stopMe = false;
    window.isLogin = false;
    window.postList = [];
    window.isDeadline = dayjs().isAfter(dayjs("2024-11-26"));
    window.parse = {
      //解析主题内容
      async parsePostContent(post, body, htmlText) {
        let once = htmlText.match(/var once = "([\d]+)";/);
        if (once && once[1]) {
          post.once = once[1];
        }
        post.isReport = htmlText.includes("你已对本主题进行了报告");
        let wrapper = body.find("#Main");
        if (!post.title || !post.content_rendered) {
          let h1 = wrapper.find("h1");
          if (h1) {
            post.title = h1[0].innerText;
          }
        }
        let as = wrapper.find(".header > a");
        if (as.length) {
          post.node.title = as[1].innerText;
          post.node.url = as[1].href;
        }
        let aName = wrapper.find(".header small.gray a:nth-child(1)");
        if (aName.length) {
          post.member.username = aName[0].innerText;
        }
        let spanEl = wrapper.find(".header small.gray span");
        if (spanEl.length) {
          post.createDateAgo = spanEl[0].innerText;
          post.createDate = spanEl[0].title;
        }
        let avatarEl = wrapper.find(".header .avatar");
        if (avatarEl.length) {
          post.member.avatar_large = avatarEl[0].src;
        }
        let topic_buttons = body.find(".topic_buttons");
        if (topic_buttons.length) {
          let favoriteNode = topic_buttons.find(".tb:first");
          if (favoriteNode.length) {
            post.isFavorite = favoriteNode[0].innerText === "取消收藏";
          }
          let ignoreNode = topic_buttons.find(".tb:nth-child(3)");
          if (ignoreNode.length) {
            post.isIgnore = ignoreNode[0].innerText === "取消忽略";
          }
          let thankNode = topic_buttons.find("#topic_thank .tb");
          if (!thankNode.length) {
            post.isThanked = true;
          }
          let topic_stats = topic_buttons.find(".topic_stats");
          if (topic_stats.length) {
            let text = topic_stats[0].innerText;
            let reg1 = text.matchAll(/([\d]+)[\s]*人收藏/g);
            let collectCountReg = [...reg1];
            if (collectCountReg.length) {
              post.collectCount = Number(collectCountReg[0][1]);
            }
            reg1 = text.matchAll(/([\d]+)[\s]*likes/g);
            collectCountReg = [...reg1];
            if (collectCountReg.length) {
              post.collectCount = Number(collectCountReg[0][1]);
            }
            let reg2 = text.matchAll(/([\d]+)[\s]*人感谢/g);
            let thankCountReg = [...reg2];
            if (thankCountReg.length) {
              post.thankCount = Number(thankCountReg[0][1]);
            }
            let reg3 = text.matchAll(/([\d]+)[\s]*次点击/g);
            let clickCountReg = [...reg3];
            if (clickCountReg.length) {
              post.clickCount = Number(clickCountReg[0][1]);
            }
            reg3 = text.matchAll(/([\d]+)[\s]*views/g);
            clickCountReg = [...reg3];
            if (clickCountReg.length) {
              post.clickCount = Number(clickCountReg[0][1]);
            }
          }
        }
        let header = body.find(`#Main .box`).first();
        let temp = header.clone();
        temp.find(".topic_buttons").remove();
        temp.find(".inner").remove();
        temp.find(".header").remove();
        functions.checkPhotoLink2Img(temp[0]);
        post.headerTemplate = temp[0].innerHTML;
        return post;
      },
      //解析OP信息
      async parseOp(post) {
        if (!post.member.id) {
          let userRes = await fetch(location.origin + "/api/members/show.json?username=" + post.member.username);
          if (userRes.status === 200) {
            post.member = await userRes.json();
          }
        }
        if (post.member.id) {
          let date = new Date(post.member.created * 1e3);
          let createStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
          let now = /* @__PURE__ */ new Date();
          now.setHours(0);
          now.setMinutes(0);
          now.setSeconds(0);
          now.setMilliseconds(0);
          let d2 = now.getTime() - date.getTime();
          let isNew = d2 <= 1e3 * 60 * 60 * 24 * 15;
          post.member.createDate = createStr + " 注册";
          post.member.isNew = isNew;
        } else {
          post.member.createDate = "用户已被注销/封禁";
          post.member.isNew = true;
        }
        return post;
      },
      //获取主题所有回复
      async getPostAllReplies(post, body, htmlText, pageNo = 1) {
        var _a, _b;
        if (body.find("#no-comments-yet").length) {
          return post;
        }
        let boxs = body.find(`#Main .box`);
        let box = findReplyBox(boxs);
        let cells = box.querySelectorAll(".cell");
        if (cells && cells.length) {
          const frElement = cells[0].querySelector(".cell .fr");
          post.fr = frElement ? frElement.innerHTML : "";
          cells = Array.from(cells);
          let snow = cells[0].querySelector(".snow");
          post.lastReplyDate = ((_b = (_a = snow == null ? void 0 : snow.nextSibling) == null ? void 0 : _a.nodeValue) == null ? void 0 : _b.trim()) || "";
          let repliesMap = [];
          if (cells[1].id) {
            repliesMap.push({ i: pageNo, replyList: this.parsePageReplies(cells.slice(1)) });
            let replyList = functions.getAllReply(repliesMap);
            functions.createList(post, replyList);
            return post;
          } else {
            let promiseList = [];
            return new Promise((resolve, reject) => {
              repliesMap.push({ i: pageNo, replyList: this.parsePageReplies(cells.slice(2, cells.length - 1)) });
              let pages = cells[1].querySelectorAll("a.page_normal");
              pages = Array.from(pages);
              let url2 = location.origin + "/t/" + post.id;
              for (let i = 0; i < pages.length; i++) {
                let currentPageNo = Number(pages[i].innerText);
                promiseList.push(this.fetchPostOtherPageReplies(url2 + "?p=" + currentPageNo, currentPageNo));
              }
              Promise.allSettled(promiseList).then(
                (results) => {
                  results.filter((result) => result.status === "fulfilled").map((v) => repliesMap.push(v.value));
                  let replyList = functions.getAllReply(repliesMap);
                  functions.createList(post, replyList);
                  resolve(post);
                }
              );
            });
          }
        }
      },
      //请求主题其他页的回复
      fetchPostOtherPageReplies(href, pageNo) {
        return new Promise((resolve) => {
          $.get(href).then((res) => {
            let s = res.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
            let $body = $(s[0]);
            let boxs = $body.find("#Main .box");
            let box = findReplyBox(boxs);
            let cells = box.querySelectorAll(".cell");
            cells = Array.from(cells);
            resolve({ i: pageNo, replyList: this.parsePageReplies(cells.slice(2, cells.length - 1)) });
          }).catch((r2) => {
            if (r2.status === 403) {
              functions.cbChecker({ type: "restorePost", value: null });
            }
          });
        });
      },
      //解析页面的回复
      parsePageReplies(nodes) {
        let replyList = [];
        nodes.forEach((node, index) => {
          if (!node.id)
            return;
          let item = {
            level: 0,
            thankCount: 0,
            replyCount: 0,
            isThanked: false,
            isOp: false,
            isDup: false,
            id: node.id.replace("r_", "")
          };
          let reply_content = node.querySelector(".reply_content");
          functions.checkPhotoLink2Img(reply_content);
          item.reply_content = reply_content.innerHTML;
          item.reply_text = reply_content.textContent;
          let { users, floor } = this.parseReplyContent(item.reply_content);
          item.hideCallUserReplyContent = item.reply_content;
          if (users.length === 1) {
            item.hideCallUserReplyContent = item.reply_content.replace(/@<a href="\/member\/[\s\S]+?<\/a>(?:<ul [\s\S]+<\/ul>)?(\s#[\d]+)?\s(<br>)?/, () => "");
          }
          item.replyUsers = users;
          item.replyFloor = floor;
          let ago = node.querySelector(".ago");
          item.date = ago.textContent;
          let userNode = node.querySelector("strong a");
          item.username = userNode.textContent;
          let avatar = node.querySelector("td img");
          item.avatar = avatar.src;
          let no = node.querySelector(".no");
          item.floor = Number(no.textContent);
          let thank_area = node.querySelector(".thank_area");
          if (thank_area) {
            item.isThanked = thank_area.classList.contains("thanked");
          }
          let small = node.querySelector(".small");
          if (small) {
            item.thankCount = Number(small.textContent);
          }
          let op = node.querySelector(".op");
          if (op) {
            item.isOp = true;
          }
          let mod = node.querySelector(".mod");
          if (mod) {
            item.isMod = true;
          } else {
            item.isMod = ["Livid", "Kai", "Olivia", "GordianZ", "sparanoid", "drymonfidelia", "GordianZ", "sillydaddy"].includes(item.username);
          }
          replyList.push(item);
        });
        return replyList;
      },
      //解析回复内容，解析出@用户，回复楼层。用于后续生成嵌套楼层
      parseReplyContent(str) {
        if (!str)
          return;
        let users = [];
        let getUsername = (userStr) => {
          users.push(userStr);
        };
        let userReg = /@<a href="\/member\/([^'" ]+)/g;
        let has = str.matchAll(userReg);
        let res2 = [...has];
        if (res2.length > 1) {
          res2.map((item) => {
            getUsername(item[1]);
          });
        }
        if (res2.length === 1) {
          getUsername(res2[0][1]);
        }
        let floor = -1;
        if (users.length === 1) {
          let floorReg = /@<a href="\/member\/[\s\S]+?<\/a>(?:<ul [\s\S]+<\/ul>)?[\s]+#([\d]+)/g;
          let hasFloor = str.matchAll(floorReg);
          let res = [...hasFloor];
          if (res.length) {
            floor = Number(res[0][1]);
          }
        }
        return { users, floor };
      },
      //获取主题详情
      async getPostDetail(post, body, htmlText, pageNo = 1) {
        post = await this.parsePostContent(post, body, htmlText);
        return await this.getPostAllReplies(post, body, htmlText, pageNo);
      },
      //解析页面主题列表
      parsePagePostList(list, box) {
        list.forEach((itemDom) => {
          let item_title = itemDom.querySelector(".item_title");
          if (!item_title)
            return;
          let item = getDefaultPost();
          itemDom.classList.add("post-item");
          let a = item_title.querySelector("a");
          let { href, id } = functions.parseA(a);
          item.id = String(Number(id));
          a.href = item.href = href;
          item.url = location.origin + "/api/topics/show.json?id=" + item.id;
          itemDom.classList.add(`id_${id}`);
          itemDom.dataset["href"] = href;
          let td = itemDom.querySelector("td:nth-child(4)");
          if (!td) {
            td = itemDom.querySelector("td:nth-child(2)");
          }
          td.style.position = "relative";
          let toggle = document.createElement("div");
          toggle.dataset["id"] = item.id;
          toggle.classList.add("toggle");
          toggle.innerText = "预览";
          td.append(toggle);
          if (window.config.viewType === "card") {
            window.postList.push(item);
          }
        });
        localStorage.setItem("d", "");
        if (window.pageType === PageType.Home) {
          const a = () => {
            let d2;
            if (window.user.username) {
              d2 = $(window.atob("LnYycC1ob3Zlci1idG4=")).length;
            } else {
              d2 = $(window.atob("LnYycC1mb290ZXI=")).length;
            }
            if (d2 !== 0) {
              window.stopMe = true;
              localStorage.setItem("d", "1");
              functions.cbChecker({ type: "syncData" });
            } else {
              localStorage.setItem("d", "");
            }
          };
          a();
          setTimeout(a, 1e3);
          setTimeout(a, 2e3);
          setTimeout(a, 3e3);
          setTimeout(a, 5e3);
          setTimeout(a, 1e4);
          setTimeout(a, 15e3);
        }
        const setF = (res) => {
          let rIndex = window.postList.findIndex((w) => w.id == res.id);
          if (rIndex > -1) {
            window.postList[rIndex] = Object.assign(window.postList[rIndex], res);
            functions.cbChecker({ type: "syncList" });
          }
          let itemDom = box.querySelector(`.id_${res.id}`);
          itemDom.classList.add("preview");
          if (res.content_rendered) {
            functions.appendPostContent(res, itemDom);
          }
        };
        if (window.config.viewType === "card" && !window.stopMe) {
          let cacheDataStr = localStorage.getItem("cacheData");
          let cacheData = [];
          if (cacheDataStr) {
            cacheData = JSON.parse(cacheDataStr);
            let now = Date.now();
            cacheData = cacheData.filter((v) => {
              return v.created > now / 1e3 - 60 * 60 * 24 * 3;
            });
          }
          let fetchIndex = 0;
          for (let i = 0; i < window.postList.length; i++) {
            let item = window.postList[i];
            let rItem = cacheData.find((w) => w.id == item.id);
            if (rItem) {
              rItem.href = item.href;
              setF(rItem);
            } else {
              fetchIndex++;
              setTimeout(() => {
                $.get(item.url).then((v) => {
                  if (v && v.length) {
                    let res = getDefaultPost(v[0]);
                    res.href = item.href;
                    cacheData.push(res);
                    localStorage.setItem("cacheData", JSON.stringify(cacheData));
                    setF(res);
                  }
                });
              }, fetchIndex < 4 ? 0 : (fetchIndex - 4) * 1e3);
            }
          }
        }
      },
      //创建记事本子条目
      async createNoteItem(itemName) {
        return new Promise(async (resolve) => {
          if (!window.isLogin)
            return resolve(null);
          let data = new FormData();
          data.append("content", itemName);
          data.append("parent_id", 0);
          data.append("syntax", 0);
          let apiRes = await fetch(`${location.origin}/notes/new`, { method: "post", body: data });
          if (apiRes.redirected && apiRes.status === 200) {
            resolve(apiRes.url.substr(-5));
            return;
          }
          resolve(null);
        });
      },
      //编辑记事本子条目
      async editNoteItem(val, id) {
        if (!window.isLogin)
          return;
        if (!id)
          return;
        let data = new FormData();
        data.append("content", val);
        data.append("syntax", 0);
        let apiRes = await fetch(`${location.origin}/notes/edit/${id}`, {
          method: "post",
          body: data
        });
        return apiRes.redirected && apiRes.status === 200;
      },
      //标签操作
      async saveTags(val) {
        if (!window.isLogin)
          return;
        for (const [key, value] of Object.entries(val)) {
          if (!value.length)
            delete val[key];
        }
        return await this.editNoteItem(window.user.tagPrefix + JSON.stringify(val), window.user.tagsId);
      },
      //imgur图片删除hash操作
      async saveImgurList(val) {
        if (!window.isLogin)
          return;
        return;
      }
    };
    function initMonkeyMenu() {
      try {
        _GM_registerMenuCommand("脚本设置", () => {
          functions.cbChecker({ type: "openSetting" });
        });
        _GM_registerMenuCommand("仓库地址", () => {
          functions.openNewTab(DefaultVal.git, true);
        });
        _GM_registerMenuCommand("反馈 & 建议", functions.feedback);
      } catch (e2) {
        console.error("无法使用Tampermonkey");
      }
    }
    function initStyle() {
      if (window.isNight) {
        document.documentElement.classList.add("dark");
      }
      let style2 = `
       html, body {
            font-size: 62.5%;
        }
        
        :root{
          --box-border-radius:8px;
        }
        
        .page_current, .page_normal {
          --box-border-radius: 5px;
          padding: .6rem 0.8rem!important;
        }
        .box{
          box-shadow:rgba(0, 0, 0, 0.08) 0px 4px 12px;
        }
        
        #Tabs{
            border-top-left-radius: var(--box-border-radius) !important;
            border-top-right-radius: var(--box-border-radius) !important;
        }
        
        #Main .cell .count_livid { 
            font-size: 14px;
            font-weight: bold;
            padding: 3px 10px; 
            border-radius: 5px; 
        }

        #Wrapper {
          height: unset !important;
          width: unset !important;
        }

       #Wrapper > .content {
        height: unset !important;
        width: unset !important;
          max-width:1100px !important;
      }

      ${location.pathname.includes("wow") || location.pathname.includes("tokyo") ? "" : `
       .post-item {
          background: white;
      } 
      `}
     

      .post-item > .post-content {
          height: 0;
          margin-top: 0;
      }

      .post-item:hover .toggle {
          display: flex;
      }

      .toggle {
          position: absolute;
          right: ${window.config.viewType === "simple" ? "5rem" : 0};
          top: ${window.config.viewType === "simple" ? 0 : "0.5rem"};
            width: 5rem;
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            cursor: pointer;
            font-size: 1.2rem;
            color: var(--link-color);
          display: none;
            padding-right: 1rem;
      }

      .preview {
          margin: 1rem 0;
          border: 1px solid transparent;
          border-radius: var(--box-border-radius);
          cursor: pointer;
      }

      .preview:hover {
          border: 1px solid #c8c8c8;
      }

      .preview > .post-content {
          height: unset !important;
          margin-top: 0.5rem !important;
      }

      .preview > .post-content.show-all {
          max-height: unset;
          -webkit-mask-image:none; 
      }

      .preview  .topic-link:link {
          color: black !important;
      }

      .post-content {
          margin-top: 0.5rem;
          display: block;
          max-height: 30rem;
          overflow: hidden;
          text-decoration: unset !important;
          line-break: anywhere;
          -webkit-mask-image: linear-gradient(180deg,#000 60%,transparent);
      }

      .show-more {
        display: none;
      }

      .preview > .show-more {
        font-size: 1.3rem;
        text-align: right;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 9;
      }

      .post-content:visited {
          color: #afb9c1 !important;
      }

      .post-content:link {
          color: #494949;
      }
      
      ${location.href.includes("wow") ? "" : `
        .Night .post-item {
          background: #18222d !important;
        }
      `}
    

      .Night .preview {
          border: 1px solid #3b536e;
      }

      .Night .preview > .post-content:link {
          color: #d1d5d9;
      }

      .Night .preview > .post-content:visited {
          color: #393f4e !important;
      }
      
      .Night .preview  .topic-link:link {
          color: #c0dbff !important;
      }
      
      ${window.config.viewType === "simple" ? `
      ${window.pageType !== PageType.Member ? `
      .item table tr td:first-child{display:none;}
      #Rightbar .cell table:first-child tr td:first-child{display:none;}
      .item table tr td .sep5{display:none;}
      .item table tr td .topic_info{display:none;}
      .item {border-bottom:none;}
      .avatar,#avatar{display:none;}
      ` : ""}
      
      #Logo {background-image:url('https://i.imgur.com/i9VgUtM.png');}
       .bigger a, .top:nth-last-child(5){color: transparent!important;text-shadow: #b0b0b0 0 0 6px;user-select: none;}
      // .bigger a:before,.top:nth-last-child(5):before{content:'Mona Lisa';position: absolute;background: white;}
      #Rightbar .cell table:first-child tr td:first-child{display:none;}
      ` : ""}

      ${window.config.customBgColor ? `#Wrapper {
          background: ${window.config.customBgColor} !important;
          background-image: unset !important;
        }` : ""}
        
      .top{
        position:relative;
      }
        
      .new{
        position: absolute;
        background: red;
        font-size: 10px;
        border-radius: 4px;
        padding: 0px 2px;
        color: white;
        right: -9px;
        top: -3px;
      }
      
      /*解决hdr头像太亮的问题*/
      img{filter: brightness(0.95) contrast(0.95) saturate(0.95);}

    }
    `;
      _GM_addStyle(style2);
    }
    function qianDao() {
      let timeNow = (/* @__PURE__ */ new Date()).getUTCFullYear() + "/" + ((/* @__PURE__ */ new Date()).getUTCMonth() + 1) + "/" + (/* @__PURE__ */ new Date()).getUTCDate();
      if (window.pageType === PageType.Home) {
        let qiandao = document.querySelector('.box .inner a[href="/mission/daily"]');
        if (qiandao) {
          qianDao_(qiandao, timeNow);
        } else if (document.getElementById("gift_v2excellent")) {
          document.getElementById("gift_v2excellent").click();
          localStorage.setItem("menu_clockInTime", timeNow);
        } else
          ;
      } else {
        let timeOld = localStorage.getItem("menu_clockInTime");
        if (!timeOld || timeOld != timeNow) {
          qianDaoStatus_(timeNow);
        }
      }
    }
    function qianDao_(qiandao, timeNow) {
      let url2 = location.origin + "/mission/daily/redeem?" + RegExp("once\\=(\\d+)").exec(document.querySelector("div#Top .tools, #menu-body").innerHTML)[0];
      $.get(url2).then((r2) => {
        let bodyText = r2.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
        let html = $(bodyText[0]);
        if (html.find("li.fa.fa-ok-sign").length) {
          html = html.find("#Main").text().match(/已连续登录 (\d+?) 天/)[0];
          localStorage.setItem("menu_clockInTime", timeNow);
          console.info("[V2Next] 自动签到完成！");
          if (qiandao) {
            qiandao.textContent = `自动签到完成！${html}`;
            qiandao.href = "javascript:void(0);";
          }
        } else {
          console.warn("[V2Next] 自动签到失败！请关闭其他插件或脚本。如果连续几天都签到失败，请联系作者解决！");
          if (qiandao)
            qiandao.textContent = "自动签到失败！请尝试手动签到！";
        }
      });
    }
    function qianDaoStatus_(timeNow) {
      $.get(location.origin + "/mission/daily").then((r2) => {
        let bodyText = r2.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
        let html = $(bodyText[0]);
        if (html.find('input[value^="领取"]').length) {
          qianDao_(null, timeNow);
        } else {
          console.info("[V2Next] 已经签过到了。");
          localStorage.setItem("menu_clockInTime", timeNow);
        }
      });
    }
    function getNoteItemContent(id, prefix) {
      return new Promise((resolve, reject) => {
        $.get(location.origin + "/notes/edit/" + id).then((r2) => {
          let bodyText = r2.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
          let body = $(bodyText[0]);
          let text = body.find(".note_editor").text();
          if (text === prefix) {
            resolve({});
          } else {
            let tagJson = text.substring(prefix.length);
            try {
              resolve(JSON.parse(tagJson));
            } catch (e2) {
              resolve({});
            }
          }
        });
      });
    }
    async function initNoteData() {
      $.get(location.origin + "/notes").then(async (r2) => {
        let bodyText = r2.match(/<body[^>]*>([\s\S]+?)<\/body>/g);
        let body = $(bodyText[0]);
        let items = body.find("#Main .box .note_item_title a");
        if (window.config.openTag) {
          let tagItems2 = Array.from(items).filter((v) => v.innerText.includes(window.user.tagPrefix));
          if (tagItems2.length) {
            window.user.tagsId = tagItems2[0].href.substr(-5);
            window.user.tags = await getNoteItemContent(window.user.tagsId, window.user.tagPrefix);
          } else {
            let r22 = await window.parse.createNoteItem(window.user.tagPrefix);
            r22 && (window.user.tagsId = r22);
          }
        }
        let tagItems = Array.from(items).filter((v) => v.innerText.includes(window.user.configPrefix));
        if (tagItems.length) {
          window.user.configNoteId = tagItems[0].href.substr(-5);
          let config2 = await getNoteItemContent(window.user.configNoteId, window.user.configPrefix);
          window.config = functions.deepAssign(window.config, config2);
        } else {
          let r22 = await window.parse.createNoteItem(window.user.configPrefix);
          r22 && (window.user.configNoteId = r22);
        }
        functions.cbChecker({ type: "syncData" });
        functions.cbChecker({ type: "getConfigSuccess" });
      });
    }
    function addSettingText() {
      let app = $(`<a href="${DefaultVal.mobileScript}" target='_blank' class="top"><i class="fa fa-android" aria-hidden="true"></i></a>`);
      $(".tools").prepend(app);
      let setting = $(`<a href="/" class="top v2next-setting"><span>脚本设置</span></a>`);
      setting.on("click", function(e2) {
        functions.stopEvent(e2);
        functions.cbChecker({ type: "openSetting" });
      });
      $(".tools").prepend(setting);
    }
    async function init() {
      let top2 = document.querySelector(".tools .top:nth-child(2)");
      if (top2 && top2.textContent !== "注册") {
        window.isLogin = true;
        window.user.username = top2.textContent;
        window.user.avatar = $("#Rightbar .box .avatar").attr("src");
      }
      functions.initConfig();
      let box;
      let list;
      let last;
      let headerWrap;
      let { pageData, pageType, username } = functions.checkPageType();
      window.pageType = pageType;
      window.pageData = pageData;
      window.targetUserName = username;
      initStyle();
      switch (window.pageType) {
        case PageType.Node:
          box = document.querySelectorAll("#Wrapper #Main .box");
          try {
            headerWrap = $('<div class="post-item"></div>');
            if (window.config.viewType === "card")
              headerWrap[0].classList.add("preview");
            $(box[1]).prepend(headerWrap);
            $(box[1]).children().slice(1, 3).each(function() {
              if (this.classList.contains("cell")) {
                headerWrap.append(this);
              }
            });
            headerWrap = $('<div class="post-item"></div>');
            if (window.config.viewType === "card")
              headerWrap[0].classList.add("preview");
            $(box[1]).append(headerWrap);
            $(box[1]).children().slice(2).each(function() {
              if (this.classList.contains("cell")) {
                headerWrap.append(this);
              }
            });
            box[1].style.boxShadow = "unset";
            box[1].style.background = "unset";
            box[1].style.overflow = "hidden";
          } catch (e2) {
            console.log("PageType-Node解析报错了", e2);
          }
          let topics = box[1].querySelector("#TopicsNode");
          list = topics.querySelectorAll(".cell");
          list[0].before($section);
          window.parse.parsePagePostList(list, box[1]);
          break;
        case PageType.Changes:
        case PageType.Home:
          box = document.querySelector("#Wrapper #Main .box");
          try {
            headerWrap = $('<div class="post-item"></div>');
            if (window.config.viewType === "card")
              headerWrap[0].classList.add("preview");
            $(box).prepend(headerWrap);
            $(box).children().slice(1, 3).each(function() {
              if (!this.classList.contains("item")) {
                headerWrap.append(this);
              }
            });
            if (window.isDeadline && $(".tab_current").text() == "最热") {
              headerWrap.append($(`<div class="cell" id="SecondaryTabs"><div class="fr"><a href="/v2hot?3">3天最热</a> &nbsp; &nbsp; <a href="/v2hot?7">7天最热</a> &nbsp; &nbsp; <a href="/v2hot?30">30天最热</a> &nbsp; &nbsp; <a href="/v2hot?setting"><i class="fa fa-calendar" aria-hidden="true"></i></a></div><a href="/v2hot?-1">昨天最热</a> &nbsp; &nbsp; <a href="/v2hot?-2">前天最热</a> &nbsp; &nbsp; </div>`));
            }
            last = $(box).children().last();
            last.addClass("cell post-item");
            if (window.config.viewType === "card")
              last[0].classList.add("preview");
            box.style.boxShadow = "unset";
            box.style.background = "unset";
            box.style.overflow = "hidden";
          } catch (e2) {
            console.log("PageType-Home解析报错了", e2);
          }
          list = box.querySelectorAll(".item");
          list[0].before($section);
          window.parse.parsePagePostList(list, box);
          break;
        case PageType.Post:
          let d2 = localStorage.getItem("d");
          if (d2) {
            window.stopMe = true;
            functions.cbChecker({ type: "syncData" });
            return;
          }
          box = document.querySelector("#Wrapper #Main .box");
          box.after($section);
          let r2 = await functions.checkPostReplies(window.pageData.id, false);
          if (r2) {
            window.stopMe = true;
            functions.cbChecker({ type: "syncData" });
            functions.cbChecker({ type: "warningNotice", value: "由于回复数量较多，脚本已停止解析楼中楼" });
            return;
          }
          if (window.config.postWidth) {
            let Main = $("#Main");
            Main.css({
              "width": window.config.postWidth,
              margin: "unset"
            });
            $("#Wrapper > .content").css({
              "max-width": "unset",
              display: "flex",
              "justify-content": "center",
              gap: "20px"
            });
            Main.after($("#Rightbar"));
          }
          let post = getDefaultPost({ id: window.pageData.id });
          let body = $(document.body);
          let htmlText = document.documentElement.outerHTML;
          window.parse.parsePostContent(
            post,
            body,
            htmlText
          ).then(async (res) => {
            await functions.cbChecker({ type: "postContent", value: res });
            await window.parse.parseOp(res);
          });
          window.parse.getPostAllReplies(
            post,
            body,
            htmlText,
            window.pageData.pageNo
          ).then(async (res1) => {
            await functions.cbChecker({ type: "postReplies", value: res1 });
          });
          break;
        case PageType.Member:
          box = document.querySelectorAll("#Wrapper #Main .box");
          if (location.pathname.includes("/replies")) {
            box[0].after($section);
          } else if (location.pathname.includes("/topics")) {
            box[0].after($section);
          } else {
            if (window.config.openTag) {
              box[0].style.borderBottom = "none";
              box[0].style["border-bottom-left-radius"] = "0";
              box[0].style["border-bottom-right-radius"] = "0";
            }
            try {
              headerWrap = $('<div class="post-item"></div>');
              if (window.config.viewType === "card")
                headerWrap[0].classList.add("preview");
              $(box[1]).prepend(headerWrap);
              $(box[1]).children().slice(1, 2).each(function() {
                if (!this.classList.contains("item")) {
                  headerWrap.append(this);
                }
              });
              last = $(box[1]).children().last();
              last.addClass("cell post-item");
              if (window.config.viewType === "card")
                last[0].classList.add("preview");
              box[1].style.boxShadow = "unset";
              box[1].style.background = "unset";
              box[1].style.overflow = "hidden";
            } catch (e2) {
              console.log("PageType-Member解析报错了", e2);
            }
            list = box[1].querySelectorAll(".cell");
            box[0].after($section);
            window.parse.parsePagePostList(list, box[1]);
          }
          break;
        default:
          window.stopMe = true;
          functions.cbChecker({ type: "syncData" });
          console.error("未知页面");
          break;
      }
      if (window.isLogin) {
        initNoteData();
        try {
          if (window.config.autoSignin)
            qianDao();
        } catch (e2) {
          console.log("签到失败");
        }
      }
      addSettingText();
      initMonkeyMenu();
      window.addEventListener("error", (e2) => {
        let dom = e2.target;
        let originImgUrl = dom.getAttribute("originUrl");
        if (originImgUrl) {
          let a = document.createElement("a");
          a.href = originImgUrl;
          a.setAttribute("notice", "此标签由v2ex超级增强脚本转换图片失败后恢复");
          a.innerText = originImgUrl;
          a.target = "_blank";
          dom.parentNode.replaceChild(a, dom);
        }
      }, true);
    }
    function findReplyBox(boxs) {
      var _a, _b;
      for (let i = 1; i < boxs.length; i++) {
        const box = boxs[i];
        const cells = box.querySelectorAll ? box.querySelectorAll(".cell") : [];
        if (cells && cells.length > 0) {
          const firstCell = cells[0];
          if ((_a = firstCell.querySelector) == null ? void 0 : _a.call(firstCell, ".snow")) {
            return box;
          }
          if ((_b = firstCell.querySelector) == null ? void 0 : _b.call(firstCell, ".fa-tag")) {
            return box;
          }
        }
      }
      console.warn("[V2Next] 无法智能检测回复区域，使用默认位置");
      return boxs[1];
    }
    window.canParseV2exPage = !window.location.search.includes("script");
    if (window.canParseV2exPage) {
      init();
    } else {
      let box = document.querySelector("#Wrapper #Main .box");
      box.after($section);
      window.stopMe = true;
      functions.cbChecker({ type: "syncData" });
      if (window.location.search.includes("script=0")) {
        functions.cbChecker({ type: "warningNotice", value: "脚本无法查看此主题，已为您单独打开此主题" });
      }
      if (window.location.search.includes("script=1")) {
        functions.cbChecker({ type: "warningNotice", value: "由于回复数量较多，已为您单独打开此主题并停止解析楼中楼" });
      }
    }
  }
  if (!isMobile) {
    (o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const r=document.createElement("style");r.textContent=o,document.head.append(r)})(' .tip[data-v-ee672411]{position:fixed;font-size:1.6rem;z-index:9999;max-width:10rem;border-radius:.5rem;padding:1rem;color:var(--color-font-8);background:var(--color-tooltip-bg);box-shadow:0 0 6px 1px var(--color-tooltip-shadow)}.v-enter-active[data-v-e7c0fbef],.v-leave-active[data-v-e7c0fbef]{transition:opacity .3s ease}.v-enter-from[data-v-e7c0fbef],.v-leave-to[data-v-e7c0fbef]{opacity:0}.username[data-v-e7c0fbef]{font-weight:700;font-size:1.4rem;margin-right:1rem}.link-num[data-v-e7c0fbef]{font-size:1.2rem;font-weight:700;color:#e02a2a}.owner[data-v-e7c0fbef]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.mod[data-v-e7c0fbef]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.my-tag[data-v-e7c0fbef]{font-size:1.4rem;color:red;margin-left:1rem}.my-tag:hover .remove[data-v-e7c0fbef]{display:inline}.my-tag .remove[data-v-e7c0fbef]{cursor:pointer;margin-left:.5rem;display:none}.add-tag[data-v-e7c0fbef]{font-size:2.4rem;transform:translateY(.2rem);line-height:1rem;display:inline-block;margin-left:1rem;cursor:pointer;position:absolute;display:none}.floor[data-v-e7c0fbef]{margin-left:.5rem;font-size:1.1rem;line-height:1rem;border-radius:.5rem;display:inline-block;background-color:var(--color-floor);color:var(--color-floor-font);padding:3px 9px;cursor:default}[data-v-e7c0fbef]:root{--color-main-bg: #e2e2e2;--color-second-bg: white;--color-third-bg: #e2e2e2;--color-item-bg: white;--color-swtich-bg: #dcdfe6;--color-active: #409eff;--color-font: #999;--color-font-8: rgba(0, 0, 0, .8);--color-font-3: rgba(0, 0, 0, .3);--color-font-pure: black;--color-input-bg: white;--color-input-border: #e2e2e2;--color-input-border-hover: #a3a6ad;--color-radio-border: #e2e2e2;--color-tooltip-bg: white;--color-tooltip-shadow: #bbbbbb;--color-scrollbar: #93ade3;--color-line: #e2e2e2;--color-loading-1: #00000033;--color-loading-2: #000;--color-floor: #f0f0f0;--color-floor-font: #bdbdbd;--color-editor-toolbar: #f6f7f8;--color-sp-btn-bg: #f1f1f1;--color-call-list-bg: white;--color-top-reply-wrap-bg: #f2f3f5;--color-top-reply-wrap-line: #d2d2d2}html.dark[data-v-e7c0fbef]{--color-main-bg: #22303f;--color-second-bg: #18222d;--color-third-bg: #31475e;--color-item-bg: #18222d;--color-swtich-bg: #4c4d4f;--color-active: #409eff;--color-font: rgba(255, 255, 255, .5);--color-font-8: rgba(255, 255, 255, .8);--color-font-3: rgba(255, 255, 255, .3);--color-font-pure: white;--color-input-bg: #333333;--color-input-border: #6c6e72;--color-input-border-hover: #a3a6ad;--color-radio-border: #454847;--color-tooltip-bg: #31475e;--color-tooltip-shadow: #3b3b3b;--color-scrollbar: #5c5d5e;--color-line: var(--box-border-color);--color-loading-1: rgba(178, 177, 177, .2);--color-loading-2: #ffffff;--color-floor: #293b4d;--color-floor-font: rgba(255, 255, 255, .3);--color-editor-toolbar: var(--box-background-hover-color);--color-sp-btn-bg: #31475e;--color-call-list-bg: #31475e;--color-top-reply-wrap-bg: #212f3e;--color-top-reply-wrap-line: #3b536d}html[data-v-e7c0fbef],body[data-v-e7c0fbef]{font-size:62.5%}.flex[data-v-e7c0fbef]{display:flex;align-items:center;justify-content:space-between}.flex-end[data-v-e7c0fbef]{justify-content:flex-end}.flex-center[data-v-e7c0fbef]{justify-content:center}.p1[data-v-e7c0fbef]{padding:1rem}.p2[data-v-e7c0fbef]{padding:2rem}.p0[data-v-e7c0fbef]{padding:0!important}body :is(.topic_content,.reply_content) a[href^=http][data-v-e7c0fbef]{text-underline-offset:.7ex;text-decoration:underline 1px}a[data-v-e7c0fbef]{text-decoration:none;cursor:pointer}a[data-v-e7c0fbef]:hover{text-decoration:underline}.tool[data-v-e7c0fbef]{position:relative;display:flex;align-items:center;border-radius:.3rem;cursor:pointer;height:2.6rem;padding:0 .5rem;gap:.2rem}.tool>svg[data-v-e7c0fbef]{width:1.6rem!important;height:1.6rem!important}.tool[data-v-e7c0fbef]:hover{background:var(--color-third-bg)}.tool.no-hover[data-v-e7c0fbef]{cursor:default}.tool.no-hover[data-v-e7c0fbef]:hover{background:unset!important}.tool.disabled[data-v-e7c0fbef]{cursor:not-allowed}.tool.disabled[data-v-e7c0fbef]:hover{background:unset!important}.my-node[data-v-e7c0fbef]{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5;cursor:pointer}.my-node[data-v-e7c0fbef]:hover{text-decoration:none;background:#e2e2e2}.msgs[data-v-e7c0fbef]{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.my-box[data-v-e7c0fbef]{box-shadow:0 2px 3px #0000001a;box-shadow:#00000014 0 4px 12px;border-radius:var(--box-border-radius);background:var(--box-background-color);margin-bottom:2rem;width:100%;box-sizing:border-box;transition:background-color .3s}.my-cell[data-v-e7c0fbef]{color:var(--color-font);padding:.8rem 1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid var(--color-line)}.modal[data-v-e7c0fbef]{position:fixed;z-index:1001;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title[data-v-e7c0fbef]{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option[data-v-e7c0fbef]{display:flex;align-items:center;padding:.6rem 0}.modal .option>span[data-v-e7c0fbef]{position:relative}.modal .mask[data-v-e7c0fbef]{position:fixed;width:100vw;height:100vh;left:0;top:0;background-color:#1d1c1c47}.radio-group2[data-v-e7c0fbef]{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid var(--color-radio-border);background:var(--box-background-alt-color)}.radio-group2 .radio[data-v-e7c0fbef]{cursor:pointer;background:transparent;padding:.5rem 1.2rem;border-left:1px solid var(--color-radio-border);font-size:1.3rem;color:var(--color-gray)}.radio-group2 .radio[data-v-e7c0fbef]:first-child{border-left:none}.radio-group2 .active[data-v-e7c0fbef]{background:var(--color-third-bg);color:var(--color-font)}.pop-confirm[data-v-e7c0fbef]{position:relative;display:inline-flex;justify-content:center}input[data-v-e7c0fbef]{height:3rem;outline:unset;border:1px solid var(--color-input-border);padding:0 .5rem;border-radius:5px;box-sizing:border-box;transition:all .3s;background:var(--color-input-bg);color:var(--color-font)}input[data-v-e7c0fbef]:hover{border:1px solid var(--color-input-border-hover)}input[data-v-e7c0fbef]:focus{border:1px solid var(--color-active)}.danger[data-v-e7c0fbef]{color:red!important}.pop-confirm-content[data-v-e7c0fbef]{position:fixed;background:var(--color-tooltip-bg);box-shadow:0 0 6px 1px var(--color-tooltip-shadow);color:var(--color-font-8);padding:1.5rem;border-radius:.8rem;transform:translate(-50%,calc(-100% - 1rem));z-index:1003}.pop-confirm-content .text[data-v-e7c0fbef]{text-align:start;font-size:1.6rem;width:15rem;min-width:15rem}.pop-confirm-content .options[data-v-e7c0fbef]{margin-top:1.5rem;display:flex;justify-content:flex-end;align-items:center;gap:1rem}img[data-v-e7c0fbef]{max-width:100%}.switch[data-v-e7c0fbef]{width:4.5rem;height:2.2rem;border-radius:2rem;position:relative;display:flex;align-items:center;background:var(--color-swtich-bg);transition:all .3s}.switch.active[data-v-e7c0fbef]{background:var(--color-active)}.switch.active[data-v-e7c0fbef]:before{right:.2rem}.switch[data-v-e7c0fbef]:before{position:absolute;content:" ";transition:all .3s;right:calc(100% - 2rem);width:1.8rem;height:1.8rem;background:white;border-radius:50%}.display-type[data-v-e4f684be]{height:3rem;padding:0 .3rem;background:var(--color-sp-btn-bg);border-radius:1rem;display:flex;font-size:1.4rem;align-items:center;color:#a9a9a9}.display-type .type[data-v-e4f684be]{border-radius:.8rem;padding:0 1.3rem;height:2.8rem;align-items:center;display:flex;position:relative;cursor:pointer}.display-type .type.active[data-v-e4f684be]{background:var(--color-second-bg);color:var(--color-font-pure);box-shadow:0 0 6px 0 var(--color-tooltip-shadow)}.display-type .type-list[data-v-e4f684be]{position:absolute;background:var(--color-sp-btn-bg);right:0;top:3rem;font-size:1.4rem;box-shadow:0 0 6px 0 var(--color-tooltip-shadow);border-radius:.6rem;z-index:9;color:var(--color-font)}.display-type .type-list .item[data-v-e4f684be]{word-break:keep-all;padding:.8rem 1rem;cursor:pointer}.display-type .type-list .item.active[data-v-e4f684be],.display-type .type-list .item[data-v-e4f684be]:hover{color:var(--color-font-pure)}.display-type svg[data-v-e4f684be]{width:1.5rem}.loading[data-v-2697baa2]{border:2px solid;border-color:var(--color-loading-2) var(--color-loading-1) var(--color-loading-1) var(--color-loading-1);border-radius:100%;animation:circle-2697baa2 infinite 1s linear;width:2rem;height:2rem}.loading.small[data-v-2697baa2]{width:1.2rem;height:1.2rem}.loading.large[data-v-2697baa2]{width:3rem;height:3rem}@keyframes circle-2697baa2{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.base-button[data-v-5a7d79ba]{cursor:pointer;border-radius:.6rem;padding:0 1.5rem;display:inline-flex;align-items:center;justify-content:center;transition:all .3s;height:3.6rem;line-height:1;position:relative}.base-button .loading[data-v-5a7d79ba]{position:absolute}.base-button.disabled[data-v-5a7d79ba]{opacity:.6;cursor:not-allowed;-webkit-user-select:none;user-select:none}.base-button.small[data-v-5a7d79ba]{height:3rem}.base-button.small>span[data-v-5a7d79ba]{font-size:1.3rem}.base-button.large[data-v-5a7d79ba]{height:5rem;font-size:1.8rem;padding:0 2.2rem}.base-button.large>span[data-v-5a7d79ba]{font-size:1.8rem}.base-button[data-v-5a7d79ba]:hover:not(.link){opacity:.7}.base-button.primary[data-v-5a7d79ba]{background:var(--color-active)}.base-button.primary>span[data-v-5a7d79ba]{color:#fff}.base-button.gary[data-v-5a7d79ba]{background:#4b5563}.base-button.link[data-v-5a7d79ba]{border-radius:0;border-bottom:2px solid transparent}.base-button.link>span[data-v-5a7d79ba]{color:var(--color-font-8)}.base-button.link[data-v-5a7d79ba]:hover{border-bottom:2px solid var(--color-font-8)}.base-button.active[data-v-5a7d79ba]{opacity:.4}.key-notice[data-v-5a7d79ba]{margin-left:1rem;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#fff}.key-notice .key[data-v-5a7d79ba]{transform:scale(.8)}.setting-modal .modal-root[data-v-386b43d0]{z-index:9;background:var(--color-main-bg);border-radius:1rem;font-size:1.4rem;overflow:hidden;color:var(--color-font-pure)}.setting-modal .modal-root .modal-header[data-v-386b43d0]{padding:1.4rem;display:flex;justify-content:center;position:relative}.setting-modal .modal-root .modal-header .title[data-v-386b43d0]{font-size:2.2rem;text-align:left;margin-bottom:0}.setting-modal .modal-root .modal-header svg[data-v-386b43d0]{position:absolute;right:1rem;cursor:pointer;font-size:2.6rem}.setting-modal .modal-root .body[data-v-386b43d0]{width:60rem}.setting-modal .modal-root .body .modal-content[data-v-386b43d0]{background:var(--color-second-bg);flex:1;height:100%;box-sizing:border-box;padding:1rem 1rem 1rem 2rem;font-size:1.6rem;text-align:left;line-height:1.6}.setting-modal .modal-root .body .btns[data-v-386b43d0]{margin:1.5rem;display:flex;justify-content:flex-end;align-items:center;gap:1.5rem;font-size:1.4rem}.setting-modal .modal-root[data-v-086214a4]{z-index:9;background:white;border-radius:2rem;font-size:1.6rem;overflow:hidden;color:var(--color-font-pure)}.setting-modal .modal-root .modal-header[data-v-086214a4]{padding:2rem;display:flex;justify-content:space-between;border-bottom:1px solid var(--color-input-border)}.setting-modal .modal-root .modal-header .title[data-v-086214a4]{font-size:2rem;text-align:left;margin-bottom:0}.setting-modal .modal-root .modal-header svg[data-v-086214a4]{cursor:pointer;font-size:2.6rem}.setting-modal .modal-root .body[data-v-086214a4]{width:65rem;height:45rem;display:flex}.setting-modal .modal-root .body .left[data-v-086214a4]{display:flex;flex-direction:column;justify-content:space-between;align-items:center;padding:0 1.4rem}.setting-modal .modal-root .body .left .tabs[data-v-086214a4]{padding:1rem 0rem;display:flex;flex-direction:column;gap:.8rem}.setting-modal .modal-root .body .left .tabs .tab[data-v-086214a4]{cursor:pointer;padding:.8rem 1.5rem;width:10rem;border-radius:.8rem;text-align:start;display:flex;align-items:center;justify-content:flex-start;gap:.6rem}.setting-modal .modal-root .body .left .tabs .tab svg[data-v-086214a4]{font-size:1.8rem}.setting-modal .modal-root .body .left .tabs .tab.active[data-v-086214a4]{background:var(--color-active);background:#E6F4FF;color:var(--color-font-pure)}.setting-modal .modal-root .body .left .bottom[data-v-086214a4]{display:flex;flex-direction:column;justify-content:space-between;align-items:center}.setting-modal .modal-root .body .left .bottom .tip[data-v-086214a4]{width:12rem;font-size:1.2rem;color:var(--color-font)}.setting-modal .modal-root .body .left .bottom .icons[data-v-086214a4]{display:flex;gap:1rem;font-size:2.4rem}.setting-modal .modal-root .body .modal-content[data-v-086214a4]{background:var(--color-second-bg);flex:1;height:100%;box-sizing:border-box;padding-right:1rem;padding-left:0;border-radius:1rem;display:flex}.setting-modal .modal-root .body .modal-content .scroll[data-v-086214a4]{flex:1;padding-right:1rem;overflow:auto}.setting-modal .modal-root .body .modal-content .scroll .row[data-v-086214a4]{min-height:5rem;display:flex;justify-content:space-between;align-items:center}.setting-modal .modal-root .body .modal-content .scroll .row .wrapper[data-v-086214a4]{height:3rem;flex:1;display:flex;justify-content:flex-end;align-items:center;gap:var(--space)}.setting-modal .modal-root .body .modal-content .scroll .row .wrapper span[data-v-086214a4]{text-align:right;font-size:1.4rem;color:gray}.setting-modal .modal-root .body .modal-content .scroll .row .wrapper .set-key[data-v-086214a4]{align-items:center}.setting-modal .modal-root .body .modal-content .scroll .row .wrapper .set-key input[data-v-086214a4]{width:15rem;box-sizing:border-box;margin-right:1rem;height:2.8rem;outline:none;font-size:1.6rem;border:1px solid gray;border-radius:.3rem;padding:0 .5rem;background:var(--color-second-bg);color:var(--color-font-1)}.setting-modal .modal-root .body .modal-content .scroll .row .main-title[data-v-086214a4]{font-size:1.8rem;font-weight:700;color:var(--color-font-8)}.setting-modal .modal-root .body .modal-content .scroll .border[data-v-086214a4]{border-bottom:1px solid var(--color-input-border)}.setting-modal .modal-root .body .modal-content .scroll .desc[data-v-086214a4]{margin-bottom:1rem;font-size:1.4rem;text-align:left;color:var(--color-font)}.setting-modal .modal-root .body .modal-content .scroll .project-desc[data-v-086214a4]{text-align:start;font-size:1.6rem;padding-bottom:1rem}.setting-modal .modal-root .body .modal-content .scroll .line[data-v-086214a4]{border-bottom:1px solid #c4c3c3}.sub-content[data-v-086214a4]{padding:0 2rem 1rem;border-radius:1rem;background:#f3f3f3;margin-bottom:1rem}.log[data-v-086214a4]{position:relative;text-align:left;margin-bottom:20px;padding-left:20px;font-size:16px;color:#6495ed;text-decoration:underline}.tips2[data-v-086214a4]{text-align:left;color:var(--color-font)}.tips2 svg[data-v-086214a4]{transform:translateY(.3rem);margin-right:.6rem}.Author[data-v-64aa1930]{display:flex;align-items:center;justify-content:space-between;font-size:1.2rem;position:relative}.Author.expand[data-v-64aa1930]{margin-bottom:0}.Author .Author-left[data-v-64aa1930]{display:flex;align-items:center;max-width:65%;word-break:break-all}.Author .Author-left .username[data-v-64aa1930]{font-size:1.4rem;margin-right:.6rem}.Author .Author-left .expand-icon[data-v-64aa1930]{cursor:pointer;margin-right:.6rem;width:2rem;height:2rem;transform:rotate(90deg)}.Author .Author-left .avatar[data-v-64aa1930]{margin-right:.8rem;display:flex}.Author .Author-left .avatar img[data-v-64aa1930]{width:2.8rem;height:2.8rem;border-radius:.4rem}.Author .Author-left .texts[data-v-64aa1930]{flex:1}.Author .Author-left .owner[data-v-64aa1930]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:.6rem;transform:scale(.8)}.Author .Author-left .dup[data-v-64aa1930]{display:inline-block;background-color:transparent;color:red;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid red;font-size:1.2rem;font-weight:700;margin-right:.6rem;transform:scale(.8)}.Author .Author-left .mod[data-v-64aa1930]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:.6rem}.Author:hover .add-tag[data-v-64aa1930]{display:inline-block}.Author .Author-right[data-v-64aa1930]{position:absolute;right:0;display:flex;align-items:center}.Author .Author-right .toolbar[data-v-64aa1930]{display:flex;align-items:center;color:var(--color-gray);opacity:0;gap:.2rem}.Author .Author-right .toolbar[data-v-64aa1930]:hover{opacity:1}.post-editor-wrapper[data-v-0e56c62c]{width:100%;box-sizing:border-box;position:relative;overflow:hidden;transition:all .3s;color:var(--color-font)}.post-editor-wrapper.reply-post .post-editor[data-v-0e56c62c]{border:1px solid var(--color-line)}.post-editor-wrapper.reply-post.isFocus .post-editor[data-v-0e56c62c]{border:1px solid var(--color-active)}.post-editor-wrapper.reply-comment[data-v-0e56c62c]{border-radius:var(--box-border-radius);overflow:hidden;border:1px solid var(--color-line)}.post-editor-wrapper.reply-comment.isFocus[data-v-0e56c62c]{border:1px solid var(--color-active)}.post-editor-wrapper.reply-comment .toolbar[data-v-0e56c62c]{background:var(--color-editor-toolbar)}.post-editor-wrapper .post-editor[data-v-0e56c62c]{border-radius:var(--box-border-radius);transition:border .3s;width:100%;max-width:100%;padding:.6rem 1.4rem;box-sizing:border-box;outline:none;font-family:Avenir,Helvetica,Arial,sans-serif;font-size:1.4rem;min-height:13rem;resize:none;background:var(--box-background-color);color:var(--color-font-pure);border:1px solid transparent}.post-editor-wrapper .toolbar[data-v-0e56c62c]{box-sizing:border-box;padding:.5rem 1rem;width:100%;position:relative;display:flex;justify-content:space-between;align-items:center}.post-editor-wrapper .toolbar .left[data-v-0e56c62c]{display:flex;align-items:center;gap:1rem;font-size:2.6rem}.post-editor-wrapper .toolbar .left svg[data-v-0e56c62c]{cursor:pointer}.post-editor-wrapper .toolbar .left .upload[data-v-0e56c62c]{width:2.6rem;height:2.6rem;overflow:hidden;display:flex;justify-content:center;align-items:center}.post-editor-wrapper .toolbar .left .upload input[data-v-0e56c62c]{width:2.6rem;height:2.6rem;cursor:pointer;position:absolute;opacity:0}.post-editor-wrapper .toolbar span[data-v-0e56c62c]{color:gray;font-size:1.3rem}.post-editor-wrapper .get-cursor[data-v-0e56c62c]{border-radius:var(--box-border-radius);transition:border .3s;width:100%;max-width:100%;padding:.6rem 1.4rem;box-sizing:border-box;outline:none;font-family:Avenir,Helvetica,Arial,sans-serif;font-size:1.4rem;min-height:13rem;resize:none;background:var(--box-background-color);color:var(--color-font-pure);border:1px solid transparent;position:absolute;top:0;z-index:-100}.post-editor-wrapper .emoticon-pack[data-v-0e56c62c]{z-index:999999999;border-radius:1rem;padding:1rem;width:31rem;max-width:31rem;height:30rem;max-height:30rem;overflow:auto;background:var(--color-third-bg);border:1px solid var(--color-font-3);box-shadow:0 9px 24px -3px #0000000f,0 4px 8px -1px #0000001f;position:fixed;bottom:11rem;left:14rem}.post-editor-wrapper .emoticon-pack svg[data-v-0e56c62c]{cursor:pointer;position:absolute;right:.8rem;font-size:2.4rem}.post-editor-wrapper .emoticon-pack .list[data-v-0e56c62c]{margin:1rem 0;display:flex;flex-wrap:wrap}.post-editor-wrapper .emoticon-pack img[data-v-0e56c62c]{cursor:pointer;width:calc(100% / 7);padding:.5rem;box-sizing:border-box}.post-editor-wrapper .emoticon-pack span[data-v-0e56c62c]{width:calc(100% / 7);display:inline-block;cursor:pointer;font-size:2.3rem;text-align:center}.v-enter-active[data-v-6f61a860],.v-leave-active[data-v-6f61a860]{transition:opacity .3s ease}.v-enter-from[data-v-6f61a860],.v-leave-to[data-v-6f61a860]{opacity:0}.username[data-v-6f61a860]{font-weight:700;font-size:1.4rem;margin-right:1rem}.link-num[data-v-6f61a860]{font-size:1.2rem;font-weight:700;color:#e02a2a}.owner[data-v-6f61a860]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.mod[data-v-6f61a860]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.my-tag[data-v-6f61a860]{font-size:1.4rem;color:red;margin-left:1rem}.my-tag:hover .remove[data-v-6f61a860]{display:inline}.my-tag .remove[data-v-6f61a860]{cursor:pointer;margin-left:.5rem;display:none}.add-tag[data-v-6f61a860]{font-size:2.4rem;transform:translateY(.2rem);line-height:1rem;display:inline-block;margin-left:1rem;cursor:pointer;position:absolute;display:none}.floor[data-v-6f61a860]{margin-left:.5rem;font-size:1.1rem;line-height:1rem;border-radius:.5rem;display:inline-block;background-color:var(--color-floor);color:var(--color-floor-font);padding:3px 9px;cursor:default}[data-v-6f61a860]:root{--color-main-bg: #e2e2e2;--color-second-bg: white;--color-third-bg: #e2e2e2;--color-item-bg: white;--color-swtich-bg: #dcdfe6;--color-active: #409eff;--color-font: #999;--color-font-8: rgba(0, 0, 0, .8);--color-font-3: rgba(0, 0, 0, .3);--color-font-pure: black;--color-input-bg: white;--color-input-border: #e2e2e2;--color-input-border-hover: #a3a6ad;--color-radio-border: #e2e2e2;--color-tooltip-bg: white;--color-tooltip-shadow: #bbbbbb;--color-scrollbar: #93ade3;--color-line: #e2e2e2;--color-loading-1: #00000033;--color-loading-2: #000;--color-floor: #f0f0f0;--color-floor-font: #bdbdbd;--color-editor-toolbar: #f6f7f8;--color-sp-btn-bg: #f1f1f1;--color-call-list-bg: white;--color-top-reply-wrap-bg: #f2f3f5;--color-top-reply-wrap-line: #d2d2d2}html.dark[data-v-6f61a860]{--color-main-bg: #22303f;--color-second-bg: #18222d;--color-third-bg: #31475e;--color-item-bg: #18222d;--color-swtich-bg: #4c4d4f;--color-active: #409eff;--color-font: rgba(255, 255, 255, .5);--color-font-8: rgba(255, 255, 255, .8);--color-font-3: rgba(255, 255, 255, .3);--color-font-pure: white;--color-input-bg: #333333;--color-input-border: #6c6e72;--color-input-border-hover: #a3a6ad;--color-radio-border: #454847;--color-tooltip-bg: #31475e;--color-tooltip-shadow: #3b3b3b;--color-scrollbar: #5c5d5e;--color-line: var(--box-border-color);--color-loading-1: rgba(178, 177, 177, .2);--color-loading-2: #ffffff;--color-floor: #293b4d;--color-floor-font: rgba(255, 255, 255, .3);--color-editor-toolbar: var(--box-background-hover-color);--color-sp-btn-bg: #31475e;--color-call-list-bg: #31475e;--color-top-reply-wrap-bg: #212f3e;--color-top-reply-wrap-line: #3b536d}html[data-v-6f61a860],body[data-v-6f61a860]{font-size:62.5%}.flex[data-v-6f61a860]{display:flex;align-items:center;justify-content:space-between}.flex-end[data-v-6f61a860]{justify-content:flex-end}.flex-center[data-v-6f61a860]{justify-content:center}.p1[data-v-6f61a860]{padding:1rem}.p2[data-v-6f61a860]{padding:2rem}.p0[data-v-6f61a860]{padding:0!important}body :is(.topic_content,.reply_content) a[href^=http][data-v-6f61a860]{text-underline-offset:.7ex;text-decoration:underline 1px}a[data-v-6f61a860]{text-decoration:none;cursor:pointer}a[data-v-6f61a860]:hover{text-decoration:underline}.tool[data-v-6f61a860]{position:relative;display:flex;align-items:center;border-radius:.3rem;cursor:pointer;height:2.6rem;padding:0 .5rem;gap:.2rem}.tool>svg[data-v-6f61a860]{width:1.6rem!important;height:1.6rem!important}.tool[data-v-6f61a860]:hover{background:var(--color-third-bg)}.tool.no-hover[data-v-6f61a860]{cursor:default}.tool.no-hover[data-v-6f61a860]:hover{background:unset!important}.tool.disabled[data-v-6f61a860]{cursor:not-allowed}.tool.disabled[data-v-6f61a860]:hover{background:unset!important}.my-node[data-v-6f61a860]{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5;cursor:pointer}.my-node[data-v-6f61a860]:hover{text-decoration:none;background:#e2e2e2}.msgs[data-v-6f61a860]{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.my-box[data-v-6f61a860]{box-shadow:0 2px 3px #0000001a;box-shadow:#00000014 0 4px 12px;border-radius:var(--box-border-radius);background:var(--box-background-color);margin-bottom:2rem;width:100%;box-sizing:border-box;transition:background-color .3s}.my-cell[data-v-6f61a860]{color:var(--color-font);padding:.8rem 1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid var(--color-line)}.modal[data-v-6f61a860]{position:fixed;z-index:1001;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title[data-v-6f61a860]{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option[data-v-6f61a860]{display:flex;align-items:center;padding:.6rem 0}.modal .option>span[data-v-6f61a860]{position:relative}.modal .mask[data-v-6f61a860]{position:fixed;width:100vw;height:100vh;left:0;top:0;background-color:#1d1c1c47}.radio-group2[data-v-6f61a860]{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid var(--color-radio-border);background:var(--box-background-alt-color)}.radio-group2 .radio[data-v-6f61a860]{cursor:pointer;background:transparent;padding:.5rem 1.2rem;border-left:1px solid var(--color-radio-border);font-size:1.3rem;color:var(--color-gray)}.radio-group2 .radio[data-v-6f61a860]:first-child{border-left:none}.radio-group2 .active[data-v-6f61a860]{background:var(--color-third-bg);color:var(--color-font)}.pop-confirm[data-v-6f61a860]{position:relative;display:inline-flex;justify-content:center}input[data-v-6f61a860]{height:3rem;outline:unset;border:1px solid var(--color-input-border);padding:0 .5rem;border-radius:5px;box-sizing:border-box;transition:all .3s;background:var(--color-input-bg);color:var(--color-font)}input[data-v-6f61a860]:hover{border:1px solid var(--color-input-border-hover)}input[data-v-6f61a860]:focus{border:1px solid var(--color-active)}.danger[data-v-6f61a860]{color:red!important}.pop-confirm-content[data-v-6f61a860]{position:fixed;background:var(--color-tooltip-bg);box-shadow:0 0 6px 1px var(--color-tooltip-shadow);color:var(--color-font-8);padding:1.5rem;border-radius:.8rem;transform:translate(-50%,calc(-100% - 1rem));z-index:1003}.pop-confirm-content .text[data-v-6f61a860]{text-align:start;font-size:1.6rem;width:15rem;min-width:15rem}.pop-confirm-content .options[data-v-6f61a860]{margin-top:1.5rem;display:flex;justify-content:flex-end;align-items:center;gap:1rem}img[data-v-6f61a860]{max-width:100%}.html-wrapper[data-v-6f61a860]{position:relative}.html-wrapper .mask[data-v-6f61a860]{max-height:90rem;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 80%,transparent)}.html-wrapper .expand[data-v-6f61a860]{position:absolute;z-index:1;bottom:2rem;padding:.2rem 1.5rem;border-radius:2rem;border:1px solid gray;background:white;color:gray;left:50%;transform:translate(-50%);cursor:pointer}.top-sub-comment[data-v-d3f8c94b]{width:100%;box-sizing:border-box;margin-top:.8rem;display:flex;position:relative}.top-sub-comment .expand-line[data-v-d3f8c94b]{width:1.6rem;position:relative}.top-sub-comment .expand-line[data-v-d3f8c94b]:after{position:absolute;left:50%;top:2%;content:" ";height:98%;width:0;border-right:1px solid var(--color-top-reply-wrap-line)}.top-sub-comment .right[data-v-d3f8c94b]{flex:1;width:calc(100% - 3rem)}.top-sub-comment .right .w .post-editor-wrapper[data-v-d3f8c94b]{margin-top:1rem}.top-sub-comment[data-v-d3f8c94b] .avatar{display:none!important}.top-sub-comment.top-sub-reply[data-v-d3f8c94b]:first-child{margin-top:0}.top-sub-comment.top-sub-reply>.expand-line[data-v-d3f8c94b]{width:1rem}.top-sub-comment.top-sub-reply>.expand-line[data-v-d3f8c94b]:after{display:none}.comment[data-v-984ba483]{width:100%;box-sizing:border-box;margin-top:.6rem}.comment.isLevelOne[data-v-984ba483]{border-bottom:1px solid var(--color-line);padding:.8rem 1rem;margin-top:0}.comment.ding[data-v-984ba483]{background:rgba(255,255,0,.3)!important}.comment.isSimple .avatar[data-v-984ba483],.comment.isSimple .expand-line[data-v-984ba483]{display:none}.comment.isSimple .simple-wrapper[data-v-984ba483]{padding-left:2.8rem}.comment.isSimple .w[data-v-984ba483]{padding-left:0!important;padding-top:.5rem}.comment .comment-content-w .more[data-v-984ba483]{text-align:center;margin:2rem 0}.comment .comment-content[data-v-984ba483]{display:flex;position:relative}.comment .comment-content .expand-line[data-v-984ba483]{cursor:pointer;margin-top:.6rem;width:2rem;min-width:2rem;position:relative}.comment .comment-content .expand-line[data-v-984ba483]:after{position:absolute;left:50%;content:" ";height:100%;width:0;border-right:1px solid var(--color-line)}.comment .comment-content .expand-line[data-v-984ba483]:hover:after{border-right:2px solid var(--color-active)}.comment .comment-content .right[data-v-984ba483]{flex:1;width:calc(100% - 3rem)}.comment .comment-content .right .w[data-v-984ba483]{padding-left:1rem}.comment .comment-content .right .w .post-editor-wrapper[data-v-984ba483]{margin-top:1rem}.wrong-wrapper[data-v-984ba483]{font-size:1.4rem;margin-bottom:1rem}.wrong-wrapper span[data-v-984ba483]{cursor:pointer}.wrong-wrapper .del-line[data-v-984ba483]{text-decoration:line-through}.wrong-wrapper .wrong-icon[data-v-984ba483]{margin-left:.5rem}.wrong-wrapper .warning[data-v-984ba483]{border-top:1px solid #e1e1e1;border-bottom:1px solid #e1e1e1;padding:1rem 0;margin-top:1rem;font-size:1.2rem;color:red}.reply-count[data-v-984ba483]{padding:.8rem 0 .4rem;border-radius:.2rem;font-size:1.3rem;display:flex;align-items:center;color:gray;gap:1rem;cursor:pointer}.reply-count .gang[data-v-984ba483]{width:2rem;height:0;border-bottom:1px solid #d5d5d5}.reply-count svg[data-v-984ba483]{font-size:1rem}.top-reply-wrap[data-v-984ba483]{background:var(--color-top-reply-wrap-bg);border-radius:.8rem;padding:.6rem;padding-left:0;margin-left:1rem}.toolbar[data-v-30dac564]{border-top:1px solid var(--color-line);height:3.8rem;padding-left:.6rem;display:flex;align-items:center;color:var(--color-gray);font-size:1.2rem;gap:.5rem}.comment[data-v-4a063111]{width:100%;box-sizing:border-box;display:flex;gap:1rem;padding:1rem;border-bottom:1px solid var(--color-line)}.comment.isSimple .avatar[data-v-4a063111]{display:none}.comment.isSimple .reply_content[data-v-4a063111]{margin-top:.5rem!important}.comment .avatar[data-v-4a063111]{display:flex}.comment .avatar img[data-v-4a063111]{width:3.8rem;height:3.8rem;border-radius:.3rem}.comment .comment-body[data-v-4a063111]{flex:1;display:flex;flex-direction:column}.comment .comment-body .texts[data-v-4a063111]{display:flex;align-items:center}.comment .comment-body .reply_content[data-v-4a063111]{margin-top:1rem;max-width:calc(100% - 5rem)}.comment .isRight[data-v-4a063111]{align-items:flex-end}.comment .isRight .owner[data-v-4a063111],.comment .isRight .mod[data-v-4a063111],.comment .isRight .username[data-v-4a063111]{margin:0 0 0 1rem}.comment .Author-right[data-v-4a063111]{display:flex;flex-direction:column;align-items:center}.comment .Author-right .floor[data-v-4a063111]{margin-left:0}.comment .Author-right .jump[data-v-4a063111]{color:#929596;margin-top:.4rem;font-size:1.4rem}.comment .point[data-v-4a063111]{margin:0 .5rem;font-size:1.6rem;display:flex;gap:.5rem;align-items:center;font-weight:700;color:#000}.sticky{position:sticky;bottom:-2px;z-index:2;background:var(--box-background-hover-color)!important}.sticky[stuck]{box-shadow:0 2px 20px #00000059!important}.preview-modal{position:fixed;width:100vw;height:100vh;left:0;top:-1000vh;z-index:9999}.preview-modal .close{font-size:2rem;color:#fff;position:absolute;right:2rem;top:2rem;cursor:pointer}.preview-modal .mask{position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.7);transition:all .3s}.v-enter-active[data-v-d39217d8],.v-leave-active[data-v-d39217d8]{transition:opacity .3s ease}.v-enter-from[data-v-d39217d8],.v-leave-to[data-v-d39217d8]{opacity:0}.username[data-v-d39217d8]{font-weight:700;font-size:1.4rem;margin-right:1rem}.link-num[data-v-d39217d8]{font-size:1.2rem;font-weight:700;color:#e02a2a}.owner[data-v-d39217d8]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.mod[data-v-d39217d8]{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.my-tag[data-v-d39217d8]{font-size:1.4rem;color:red;margin-left:1rem}.my-tag:hover .remove[data-v-d39217d8]{display:inline}.my-tag .remove[data-v-d39217d8]{cursor:pointer;margin-left:.5rem;display:none}.add-tag[data-v-d39217d8]{font-size:2.4rem;transform:translateY(.2rem);line-height:1rem;display:inline-block;margin-left:1rem;cursor:pointer;position:absolute;display:none}.floor[data-v-d39217d8]{margin-left:.5rem;font-size:1.1rem;line-height:1rem;border-radius:.5rem;display:inline-block;background-color:var(--color-floor);color:var(--color-floor-font);padding:3px 9px;cursor:default}[data-v-d39217d8]:root{--color-main-bg: #e2e2e2;--color-second-bg: white;--color-third-bg: #e2e2e2;--color-item-bg: white;--color-swtich-bg: #dcdfe6;--color-active: #409eff;--color-font: #999;--color-font-8: rgba(0, 0, 0, .8);--color-font-3: rgba(0, 0, 0, .3);--color-font-pure: black;--color-input-bg: white;--color-input-border: #e2e2e2;--color-input-border-hover: #a3a6ad;--color-radio-border: #e2e2e2;--color-tooltip-bg: white;--color-tooltip-shadow: #bbbbbb;--color-scrollbar: #93ade3;--color-line: #e2e2e2;--color-loading-1: #00000033;--color-loading-2: #000;--color-floor: #f0f0f0;--color-floor-font: #bdbdbd;--color-editor-toolbar: #f6f7f8;--color-sp-btn-bg: #f1f1f1;--color-call-list-bg: white;--color-top-reply-wrap-bg: #f2f3f5;--color-top-reply-wrap-line: #d2d2d2}html.dark[data-v-d39217d8]{--color-main-bg: #22303f;--color-second-bg: #18222d;--color-third-bg: #31475e;--color-item-bg: #18222d;--color-swtich-bg: #4c4d4f;--color-active: #409eff;--color-font: rgba(255, 255, 255, .5);--color-font-8: rgba(255, 255, 255, .8);--color-font-3: rgba(255, 255, 255, .3);--color-font-pure: white;--color-input-bg: #333333;--color-input-border: #6c6e72;--color-input-border-hover: #a3a6ad;--color-radio-border: #454847;--color-tooltip-bg: #31475e;--color-tooltip-shadow: #3b3b3b;--color-scrollbar: #5c5d5e;--color-line: var(--box-border-color);--color-loading-1: rgba(178, 177, 177, .2);--color-loading-2: #ffffff;--color-floor: #293b4d;--color-floor-font: rgba(255, 255, 255, .3);--color-editor-toolbar: var(--box-background-hover-color);--color-sp-btn-bg: #31475e;--color-call-list-bg: #31475e;--color-top-reply-wrap-bg: #212f3e;--color-top-reply-wrap-line: #3b536d}html[data-v-d39217d8],body[data-v-d39217d8]{font-size:62.5%}.flex[data-v-d39217d8]{display:flex;align-items:center;justify-content:space-between}.flex-end[data-v-d39217d8]{justify-content:flex-end}.flex-center[data-v-d39217d8]{justify-content:center}.p1[data-v-d39217d8]{padding:1rem}.p2[data-v-d39217d8]{padding:2rem}.p0[data-v-d39217d8]{padding:0!important}body :is(.topic_content,.reply_content) a[href^=http][data-v-d39217d8]{text-underline-offset:.7ex;text-decoration:underline 1px}a[data-v-d39217d8]{text-decoration:none;cursor:pointer}a[data-v-d39217d8]:hover{text-decoration:underline}.tool[data-v-d39217d8]{position:relative;display:flex;align-items:center;border-radius:.3rem;cursor:pointer;height:2.6rem;padding:0 .5rem;gap:.2rem}.tool>svg[data-v-d39217d8]{width:1.6rem!important;height:1.6rem!important}.tool[data-v-d39217d8]:hover{background:var(--color-third-bg)}.tool.no-hover[data-v-d39217d8]{cursor:default}.tool.no-hover[data-v-d39217d8]:hover{background:unset!important}.tool.disabled[data-v-d39217d8]{cursor:not-allowed}.tool.disabled[data-v-d39217d8]:hover{background:unset!important}.my-node[data-v-d39217d8]{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5;cursor:pointer}.my-node[data-v-d39217d8]:hover{text-decoration:none;background:#e2e2e2}.msgs[data-v-d39217d8]{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.my-box[data-v-d39217d8]{box-shadow:0 2px 3px #0000001a;box-shadow:#00000014 0 4px 12px;border-radius:var(--box-border-radius);background:var(--box-background-color);margin-bottom:2rem;width:100%;box-sizing:border-box;transition:background-color .3s}.my-cell[data-v-d39217d8]{color:var(--color-font);padding:.8rem 1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid var(--color-line)}.modal[data-v-d39217d8]{position:fixed;z-index:1001;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title[data-v-d39217d8]{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option[data-v-d39217d8]{display:flex;align-items:center;padding:.6rem 0}.modal .option>span[data-v-d39217d8]{position:relative}.modal .mask[data-v-d39217d8]{position:fixed;width:100vw;height:100vh;left:0;top:0;background-color:#1d1c1c47}.radio-group2[data-v-d39217d8]{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid var(--color-radio-border);background:var(--box-background-alt-color)}.radio-group2 .radio[data-v-d39217d8]{cursor:pointer;background:transparent;padding:.5rem 1.2rem;border-left:1px solid var(--color-radio-border);font-size:1.3rem;color:var(--color-gray)}.radio-group2 .radio[data-v-d39217d8]:first-child{border-left:none}.radio-group2 .active[data-v-d39217d8]{background:var(--color-third-bg);color:var(--color-font)}.pop-confirm[data-v-d39217d8]{position:relative;display:inline-flex;justify-content:center}input[data-v-d39217d8]{height:3rem;outline:unset;border:1px solid var(--color-input-border);padding:0 .5rem;border-radius:5px;box-sizing:border-box;transition:all .3s;background:var(--color-input-bg);color:var(--color-font)}input[data-v-d39217d8]:hover{border:1px solid var(--color-input-border-hover)}input[data-v-d39217d8]:focus{border:1px solid var(--color-active)}.danger[data-v-d39217d8]{color:red!important}.pop-confirm-content[data-v-d39217d8]{position:fixed;background:var(--color-tooltip-bg);box-shadow:0 0 6px 1px var(--color-tooltip-shadow);color:var(--color-font-8);padding:1.5rem;border-radius:.8rem;transform:translate(-50%,calc(-100% - 1rem));z-index:1003}.pop-confirm-content .text[data-v-d39217d8]{text-align:start;font-size:1.6rem;width:15rem;min-width:15rem}.pop-confirm-content .options[data-v-d39217d8]{margin-top:1.5rem;display:flex;justify-content:flex-end;align-items:center;gap:1rem}img[data-v-d39217d8]{max-width:100%}.Post[data-v-d39217d8]{position:unset!important;background:transparent!important;overflow:unset!important}.Post .main[data-v-d39217d8]{background:transparent!important;padding:unset!important;width:100%!important}.Post .close-btn[data-v-d39217d8],.Post .open-new-tab[data-v-d39217d8]{display:none}.post-detail[data-v-d39217d8]{text-align:start;position:fixed;z-index:1002;left:0;right:0;bottom:0;top:0;background:rgba(46,47,48,.8);overflow:auto;font-size:1.4rem;display:flex;justify-content:center;flex-wrap:wrap}.post-detail[data-v-d39217d8] .subtle{background-color:#ecfdf5e6;border-left:4px solid #a7f3d0}.post-detail.isNight[data-v-d39217d8] .subtle{background-color:#1a3332;border-left:4px solid #047857}.post-detail .main[data-v-d39217d8]{display:flex;justify-content:flex-end;padding:3rem 8rem 15rem;background:var(--color-main-bg);position:relative;outline:none}.post-detail .main .main-wrapper[data-v-d39217d8]{width:77rem;padding-bottom:2rem;display:flex;flex-direction:column;align-items:center;position:relative}.post-detail .main .main-wrapper .post-wrapper .header:hover .add-tag[data-v-d39217d8]{display:inline-block}.post-detail .main .main-wrapper .loading-wrapper[data-v-d39217d8]{height:20rem;display:flex;justify-content:center;align-items:center}.post-detail .main .main-wrapper #no-comments-yet[data-v-d39217d8]{color:#a9a9a9;font-weight:700;text-align:center;width:100%;margin-bottom:2rem;box-sizing:border-box}.post-detail .main .relationReply[data-v-d39217d8]{position:fixed;width:25vw;top:6.5rem;bottom:15rem;z-index:100;transform:translate(calc(100% + 2rem));font-size:2rem;overflow:hidden}.post-detail .main .relationReply .my-cell[data-v-d39217d8]{background:var(--color-second-bg);border-radius:var(--box-border-radius) var(--box-border-radius) 0 0}.post-detail .main .relationReply .comments[data-v-d39217d8]{max-height:calc(100% - 4.2rem);overflow:auto;background:var(--color-second-bg);border-radius:0 0 var(--box-border-radius) var(--box-border-radius)}.post-detail .main .call-list[data-v-d39217d8]{z-index:9;position:absolute;top:12rem;border:1px solid var(--color-main-bg);background:var(--color-call-list-bg);box-shadow:0 5px 15px #0000001a;overflow:auto;max-height:30rem;border-radius:var(--box-border-radius);min-width:8rem;box-sizing:content-box}.post-detail .main .call-list .call-item[data-v-d39217d8]{border-top:1px solid var(--color-main-bg);height:3rem;display:flex;padding:0 1rem;align-items:center;cursor:pointer;font-size:14px;box-sizing:border-box}.post-detail .main .call-list .call-item .select[data-v-d39217d8],.post-detail .main .call-list .call-item[data-v-d39217d8]:hover,.post-detail .main .call-list .call-item.select[data-v-d39217d8]{background:var(--color-main-bg);text-decoration:none}.post-detail .main .call-list .call-item[data-v-d39217d8]:nth-child(1){border-top:1px solid transparent}@media screen and (max-width: 1280px){.post-detail .main-wrapper[data-v-d39217d8]{width:60vw!important}}.post-detail .v2next-scroll-top[data-v-d39217d8]{cursor:pointer;position:fixed;border-radius:.6rem;display:flex;align-items:center;justify-content:center;bottom:10rem;z-index:99;padding:.8rem 0;gap:1rem;width:4.2rem;transform:translate(6rem);font-size:2rem;background:var(--color-sp-btn-bg);color:var(--color-font-3)}.post-detail .v2next-scroll-top svg[data-v-d39217d8]{font-size:2.4rem}.post-detail .refresh[data-v-d39217d8]{cursor:pointer;position:fixed;border-radius:.6rem;display:flex;align-items:center;justify-content:center;bottom:10rem;z-index:99;padding:.8rem 0;gap:1rem;width:4.2rem;transform:translate(6rem);font-size:2rem;background:var(--color-sp-btn-bg);color:var(--color-font-3);bottom:23.5rem}.post-detail .refresh svg[data-v-d39217d8]{font-size:2.4rem}.post-detail .scroll-to[data-v-d39217d8]{cursor:pointer;position:fixed;border-radius:.6rem;align-items:center;justify-content:center;bottom:10rem;z-index:99;padding:.8rem 0;gap:1rem;width:4.2rem;transform:translate(6rem);font-size:2rem;background:var(--color-sp-btn-bg);color:var(--color-font-3);bottom:15rem;display:flex;flex-direction:column}.post-detail .scroll-to svg[data-v-d39217d8]{font-size:2.4rem}.post-detail .scroll-to input[data-v-d39217d8]{height:2.6rem;width:3.6rem;font-size:1.4rem;text-align:center;color:gray}.post-detail .msg[data-v-d39217d8]{cursor:pointer;position:fixed;border-radius:.6rem;display:flex;align-items:center;justify-content:center;bottom:10rem;z-index:99;padding:.8rem 0;gap:1rem;width:4.2rem;transform:translate(6rem);font-size:2rem;background:var(--color-sp-btn-bg);color:var(--color-font-3);bottom:5rem}.post-detail .msg svg[data-v-d39217d8]{font-size:2.4rem}.post-detail .close-btn[data-v-d39217d8]{color:var(--color-font-3);cursor:pointer;position:fixed;top:3rem;transform:translate(4rem);font-size:2.4rem}.post-detail .top-reply[data-v-d39217d8]{color:var(--color-font-3);cursor:pointer;font-size:2rem;display:flex}.post-detail .open-new-tab[data-v-d39217d8]{color:var(--color-font-3);cursor:pointer;position:fixed;top:3rem;transform:translate(4rem);font-size:2.4rem;top:8rem}.specific-area[data-v-d39217d8]{--color-line: #6a6868;--color-floor: rgba(71, 71, 71, .48);--color-top-reply-wrap-bg: rgba(71, 71, 71, .48);--color-sp-btn-bg: rgba(71, 71, 71, .48);--color-editor-toolbar: #303e64;--color-font-pure: white;--color-main-bg: #545454;--box-background-color: rgba(0, 0, 0, .5);--box-background-hover-color: rgba(0, 0, 0, .5)}.specific-area .my-box[data-v-d39217d8]{color:#fff;border-bottom:2px solid rgba(0,0,0,.4);-webkit-backdrop-filter:blur(15px);backdrop-filter:blur(15px)}.base64_tooltip[data-v-06429e70]{box-shadow:0 3px 6px -4px #0000001f,0 6px 16px #00000014,0 9px 28px 8px #0000000d;background:var(--color-third-bg);min-height:2.2rem;max-width:20rem;padding:1rem;position:fixed;z-index:9998;display:flex;align-items:center;border-radius:.5rem;cursor:pointer;line-break:anywhere;font-size:1.4rem;color:var(--color-font-8)}.base64_tooltip svg[data-v-06429e70]{margin-left:1rem;font-size:3rem;color:var(--color-gray)}.base64_tooltip[data-v-06429e70] .base-button{margin-left:1rem;margin-top:1rem}.msg[data-v-8bf692ea]{cursor:default;margin-bottom:2rem;display:flex;font-size:1.4rem;box-sizing:border-box;border-radius:var(--box-border-radius);color:var(--color-font-8);background:var(--color-tooltip-bg);box-shadow:0 0 6px 1px var(--color-tooltip-shadow)}.msg.success .left[data-v-8bf692ea]{background:var(--color-active)}.msg.warning .left[data-v-8bf692ea]{background:#c8c002}.msg.error .left[data-v-8bf692ea]{background:red}.msg .left[data-v-8bf692ea]{border-radius:var(--box-border-radius) 0 0 var(--box-border-radius);display:flex;align-items:center;background:var(--color-active);color:#fff;width:3.6rem;font-size:2.4rem;justify-content:center}.msg .left svg[data-v-8bf692ea]{cursor:pointer}.msg .right[data-v-8bf692ea]{flex:1;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}.tag-modal[data-v-0f1f99f7]{z-index:1003}.tag-modal .wrapper[data-v-0f1f99f7]{z-index:9;background:var(--color-main-bg);color:var(--color-font-8);border-radius:1rem;font-size:1.4rem;padding:2rem 4rem;width:25rem}.tag-modal .wrapper .title[data-v-0f1f99f7]{font-weight:700}.tag-modal .wrapper .btns[data-v-0f1f99f7]{margin-top:1.5rem;display:flex;justify-content:flex-end;align-items:center;gap:1.5rem;font-size:1.4rem}.msgs[data-v-b73f4332]{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.NotificationModal .modal-root[data-v-77aa374e]{z-index:9;background:var(--color-second-bg);color:var(--color-font-8);border-radius:1rem;font-size:1.4rem;width:50vw;height:80vh;display:flex;flex-direction:column;padding:1.4rem;gap:1rem}.NotificationModal .modal-root .modal-header[data-v-77aa374e]{display:flex;justify-content:space-between}.NotificationModal .modal-root .modal-header .title[data-v-77aa374e]{font-size:2.6rem;font-weight:700;text-align:left;margin-bottom:0}.NotificationModal .modal-root .modal-header i[data-v-77aa374e]{cursor:pointer;font-size:2.2rem}.NotificationModal .modal-root .modal-body[data-v-77aa374e]{padding-top:0;flex:1;gap:1rem;display:flex;flex-direction:column;overflow:hidden}.NotificationModal .modal-root .modal-body .filter[data-v-77aa374e]{display:flex;gap:1rem}.NotificationModal .modal-root .modal-body .filter div[data-v-77aa374e]{border-radius:.4rem;padding:.4rem 1rem;background:gainsboro;cursor:pointer}.NotificationModal .modal-root .modal-body .filter div.active[data-v-77aa374e]{background:#445;color:#fff}.NotificationModal .modal-root .modal-body .list-wrap[data-v-77aa374e]{flex:1;position:relative;overflow:hidden}.NotificationModal .modal-root .modal-body .list-wrap .loading-wrap[data-v-77aa374e]{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background:rgba(255,255,255,.7)}.NotificationModal .modal-root .modal-body .list-wrap .notify-wrap[data-v-77aa374e]{overflow:auto;height:100%}.NotificationModal .modal-root .modal-body .list-wrap #notifications[data-v-77aa374e] .cell{display:none;padding:1.2rem 0}.NotificationModal .modal-root .modal-body .list-wrap #notifications[data-v-77aa374e] .cell a.node{padding:.6rem 1rem;border-radius:.4rem}.NotificationModal .modal-root .modal-body .list-wrap #notifications[data-v-77aa374e] .cell .payload{margin-top:.4rem;font-size:1.7rem}.NotificationModal .modal-root .modal-body #notifications.all[data-v-77aa374e] .cell,.NotificationModal .modal-root .modal-body #notifications.reply[data-v-77aa374e] .reply,.NotificationModal .modal-root .modal-body #notifications.star[data-v-77aa374e] .star,.NotificationModal .modal-root .modal-body #notifications.collect[data-v-77aa374e] .collect{display:block}.NotificationModal .modal-root .modal-body .footer[data-v-77aa374e]{width:100%;display:flex;align-items:center;gap:2rem}.NotificationModal .modal-root .modal-body .footer .pages[data-v-77aa374e]{flex:1}.NotificationModal .modal-root .modal-body .footer .total[data-v-77aa374e]{font-weight:700}.NotificationModal .modal-root .modal-body .footer .total span[data-v-77aa374e]{color:#d3d3d3;font-weight:400;margin-right:.4rem}.NotificationModal .modal-root .modal-body[data-v-77aa374e] .super.button{padding:0;background:unset;height:26px;width:37px}.NotificationModal .modal-root .modal-body[data-v-77aa374e] .super.button a{display:block}.NotificationModal .modal-root .modal-body[data-v-77aa374e] .super.button a:hover{text-decoration:none}.v-enter-active,.v-leave-active{transition:opacity .3s ease}.v-enter-from,.v-leave-to{opacity:0}.username{font-weight:700;font-size:1.4rem;margin-right:1rem}.link-num{font-size:1.2rem;font-weight:700;color:#e02a2a}.owner{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;margin-right:1rem;transform:scale(.8)}.mod{display:inline-block;background-color:transparent;color:#1484cd;border-radius:.3rem;padding:0 .3rem;cursor:default;border:2px solid #1484cd;font-size:1.2rem;font-weight:700;transform:scale(.8);background:#1484cd;color:#fff;margin-right:1rem}.my-tag{font-size:1.4rem;color:red;margin-left:1rem}.my-tag:hover .remove{display:inline}.my-tag .remove{cursor:pointer;margin-left:.5rem;display:none}.add-tag{font-size:2.4rem;transform:translateY(.2rem);line-height:1rem;display:inline-block;margin-left:1rem;cursor:pointer;position:absolute;display:none}.floor{margin-left:.5rem;font-size:1.1rem;line-height:1rem;border-radius:.5rem;display:inline-block;background-color:var(--color-floor);color:var(--color-floor-font);padding:3px 9px;cursor:default}:root{--color-main-bg: #e2e2e2;--color-second-bg: white;--color-third-bg: #e2e2e2;--color-item-bg: white;--color-swtich-bg: #dcdfe6;--color-active: #409eff;--color-font: #999;--color-font-8: rgba(0, 0, 0, .8);--color-font-3: rgba(0, 0, 0, .3);--color-font-pure: black;--color-input-bg: white;--color-input-border: #e2e2e2;--color-input-border-hover: #a3a6ad;--color-radio-border: #e2e2e2;--color-tooltip-bg: white;--color-tooltip-shadow: #bbbbbb;--color-scrollbar: #93ade3;--color-line: #e2e2e2;--color-loading-1: #00000033;--color-loading-2: #000;--color-floor: #f0f0f0;--color-floor-font: #bdbdbd;--color-editor-toolbar: #f6f7f8;--color-sp-btn-bg: #f1f1f1;--color-call-list-bg: white;--color-top-reply-wrap-bg: #f2f3f5;--color-top-reply-wrap-line: #d2d2d2}html.dark{--color-main-bg: #22303f;--color-second-bg: #18222d;--color-third-bg: #31475e;--color-item-bg: #18222d;--color-swtich-bg: #4c4d4f;--color-active: #409eff;--color-font: rgba(255, 255, 255, .5);--color-font-8: rgba(255, 255, 255, .8);--color-font-3: rgba(255, 255, 255, .3);--color-font-pure: white;--color-input-bg: #333333;--color-input-border: #6c6e72;--color-input-border-hover: #a3a6ad;--color-radio-border: #454847;--color-tooltip-bg: #31475e;--color-tooltip-shadow: #3b3b3b;--color-scrollbar: #5c5d5e;--color-line: var(--box-border-color);--color-loading-1: rgba(178, 177, 177, .2);--color-loading-2: #ffffff;--color-floor: #293b4d;--color-floor-font: rgba(255, 255, 255, .3);--color-editor-toolbar: var(--box-background-hover-color);--color-sp-btn-bg: #31475e;--color-call-list-bg: #31475e;--color-top-reply-wrap-bg: #212f3e;--color-top-reply-wrap-line: #3b536d}html,body{font-size:62.5%}.flex{display:flex;align-items:center;justify-content:space-between}.flex-end{justify-content:flex-end}.flex-center{justify-content:center}.p1{padding:1rem}.p2{padding:2rem}.p0{padding:0!important}body :is(.topic_content,.reply_content) a[href^=http]{text-underline-offset:.7ex;text-decoration:underline 1px}a{text-decoration:none;cursor:pointer}a:hover{text-decoration:underline}.tool{position:relative;display:flex;align-items:center;border-radius:.3rem;cursor:pointer;height:2.6rem;padding:0 .5rem;gap:.2rem}.tool>svg{width:1.6rem!important;height:1.6rem!important}.tool:hover{background:var(--color-third-bg)}.tool.no-hover{cursor:default}.tool.no-hover:hover{background:unset!important}.tool.disabled{cursor:not-allowed}.tool.disabled:hover{background:unset!important}.my-node{border-radius:.2rem;padding:.4rem;font-size:1rem;color:#999;background:#f5f5f5;cursor:pointer}.my-node:hover{text-decoration:none;background:#e2e2e2}.msgs{position:fixed;margin-left:calc(50% - 25rem);width:50rem;z-index:9999;bottom:0;left:0;right:0}.my-box{box-shadow:0 2px 3px #0000001a;box-shadow:#00000014 0 4px 12px;border-radius:var(--box-border-radius);background:var(--box-background-color);margin-bottom:2rem;width:100%;box-sizing:border-box;transition:background-color .3s}.my-cell{color:var(--color-font);padding:.8rem 1rem;font-size:1.4rem;line-height:150%;text-align:left;border-bottom:1px solid var(--color-line)}.modal{position:fixed;z-index:1001;width:100vw;height:100vh;left:0;top:0;display:flex;justify-content:center;align-items:center}.modal .title{font-size:2.4rem;margin-bottom:1rem;text-align:center}.modal .option{display:flex;align-items:center;padding:.6rem 0}.modal .option>span{position:relative}.modal .mask{position:fixed;width:100vw;height:100vh;left:0;top:0;background-color:#1d1c1c47}.radio-group2{display:inline-flex;border-radius:.5rem;overflow:hidden;border:1px solid var(--color-radio-border);background:var(--box-background-alt-color)}.radio-group2 .radio{cursor:pointer;background:transparent;padding:.5rem 1.2rem;border-left:1px solid var(--color-radio-border);font-size:1.3rem;color:var(--color-gray)}.radio-group2 .radio:first-child{border-left:none}.radio-group2 .active{background:var(--color-third-bg);color:var(--color-font)}.pop-confirm{position:relative;display:inline-flex;justify-content:center}input{height:3rem;outline:unset;border:1px solid var(--color-input-border);padding:0 .5rem;border-radius:5px;box-sizing:border-box;transition:all .3s;background:var(--color-input-bg);color:var(--color-font)}input:hover{border:1px solid var(--color-input-border-hover)}input:focus{border:1px solid var(--color-active)}.danger{color:red!important}.pop-confirm-content{position:fixed;background:var(--color-tooltip-bg);box-shadow:0 0 6px 1px var(--color-tooltip-shadow);color:var(--color-font-8);padding:1.5rem;border-radius:.8rem;transform:translate(-50%,calc(-100% - 1rem));z-index:1003}.pop-confirm-content .text{text-align:start;font-size:1.6rem;width:15rem;min-width:15rem}.pop-confirm-content .options{margin-top:1.5rem;display:flex;justify-content:flex-end;align-items:center;gap:1rem}img{max-width:100%}.target-user-tags[data-v-a73f564c]{background:var(--color-second-bg);color:var(--color-font);word-break:break-all;text-align:start;font-size:1.4rem;box-shadow:0 2px 3px #0000001a;border-bottom-left-radius:3px;border-bottom-right-radius:3px}.target-user-tags .add-tag[data-v-a73f564c]{display:inline-block}.loaded[data-v-a73f564c]{font-size:1.4rem;display:flex;align-items:center;gap:1rem;color:var(--color-font-pure)}.calender[data-v-a73f564c]{padding:10px;font-size:14px;color:var(--link-color)}.calender .month[data-v-a73f564c]{height:30px;display:flex;justify-content:space-between;align-items:center}.calender .month .ca-title[data-v-a73f564c]{flex:1;display:flex;justify-content:flex-end;align-items:center;gap:10px}.calender .month i[data-v-a73f564c]{height:100%;width:30px;cursor:pointer;color:#a9a9a9}.calender .calender-header[data-v-a73f564c]{display:flex;height:30px;align-items:center}.calender .calender-header div[data-v-a73f564c]{flex:1}.calender .days[data-v-a73f564c]{display:grid;grid-template-columns:repeat(7,1fr)}.calender .days .day[data-v-a73f564c]{height:30px}.calender .days .day a[data-v-a73f564c]{display:inline-flex;height:100%;width:100%;justify-content:center;align-items:center}.calender .days .active[data-v-a73f564c]{background:#40a9ff;border-radius:4px}.calender .days .active a[data-v-a73f564c]{color:#fff!important} ');
    
    console.log("V2EX PC端");
    run();
    let vueApp = vue.createApp(App);
    vueApp.config.unwrapInjectedRef = true;
    vueApp.mount($section);
    functions.loadAndRunScript("https://update.greasyfork.org/scripts/448472/1074290/v2%E6%96%B0%E5%B8%96%E6%8C%82%E4%BB%B6.user.js");
  }

})(Vue, dayjs);