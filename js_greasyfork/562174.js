// ==UserScript==
// @name        爱壹帆去广告&模拟VIP (私有自用版)
// @description 本地自用修改版，去广告+长久VIP
// @match       https://*.iyf.tv/*
// @match       https://*.yifan.tv/*
// @match       https://*.yfsp.tv/*
// @match       https://*.aiyifan.tv/*
// @grant       none
// @license     MIT
// @version     9.9.9
// @author      Me
// @compatible  Chrome ViolentMonkey
// @run-at      document-start
// @namespace moe.jixun.dn-noad
// @downloadURL https://update.greasyfork.org/scripts/562174/%E7%88%B1%E5%A3%B9%E5%B8%86%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%A8%A1%E6%8B%9FVIP%20%28%E7%A7%81%E6%9C%89%E8%87%AA%E7%94%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562174/%E7%88%B1%E5%A3%B9%E5%B8%86%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%A8%A1%E6%8B%9FVIP%20%28%E7%A7%81%E6%9C%89%E8%87%AA%E7%94%A8%E7%89%88%29.meta.js
// ==/UserScript==

//// Injection Parameter ////
const __DEBUG__ = false;
const id = "jixun: have fun :D";

const M = {
  InitUser: "T1Vy",
  PermissionManager: "xMFu",
  StoreState: "AytR",
  Utility: "3My9",
  LegacyRouteLoader: "tyNb",
  RxJS: "lJxs",
  RequestHelper: "tWDZ",
};

const moduleLoadList = new Set(Object.values(M));

//// Injection Parameter ////

const ArrProto = Array.prototype;
const call = Function.prototype.call;
const each = call.bind(ArrProto.forEach);

const injectStyle = () => {
  const s = document.createElement("style");
  s.textContent = `
    .cloppe {
      display: block !important;
    }

    .video-player {
      height: unset!important;
    }

    .playPageTop {
      min-height: unset!important;
    }

    .danmu-center {
      min-height: 1005px !important;
      max-width: 300px !important;
    }

    app-dn-user-menu-item.top-item,
    .nav-link-ctn > li:has(a[target="_blank"]),
    .dn-slider-main-container > .dn-slider-image-placeholder[target="_blank"],
    vg-pause-ads,
    .bl.ng-star-inserted,
    .ng-star-inserted.bb,
    app-gg-block, app-gg-block.d-block, .overlay-logo
    {
      display: none !important;
    }
  `.replace(/\s+/g, " ");
  document.head.appendChild(s);
};

const defaultAvatar = "https://static.{Host}/upload/up/20170815000037.jpg";
const fakeIp = Array.from(new Array(4), () => (Math.random() * 255) | 0).join(".");
const fakeGid = 9527;
const gidRegex = new RegExp(`gid=${fakeGid}(&|$)`);

const always = (v) => ({
  get: () => v,
  set: () => {},
});

const hideCurrentModule = () => {
  const idx = webpackJsonp.findIndex((module) => module[1][id]);
  webpackJsonp.splice(idx, 1);
};

const myHooks = [
  [
    /* iF-vod 去广告 */
  ],
  {
    [id]: function (module, exports, require) {
      injectStyle();
      hideCurrentModule();

      const requireDefault = (name) => require(name).a;

      const PermissionManager = requireDefault(M.PermissionManager);
      const StoreState = requireDefault(M.StoreState);
      const RequestHelper = requireDefault(M.RequestHelper);
      const Utility = requireDefault(M.Utility);
      const InitUser = requireDefault(M.InitUser);

      PermissionManager.prototype.isValid = () => true;

      Object.defineProperty(StoreState, "allVip", always(true));
      Object.defineProperty(StoreState, "hideAds", always(true));
      Object.defineProperty(StoreState, "disableNotify", always(true));

      const utils = new Utility(window.document);

      const appendUserInfo = RequestHelper.prototype.appendUserInfo;
      RequestHelper.prototype.appendUserInfo = function (url) {
        const data = appendUserInfo.call(this, url);
        for (const [k, v] of Object.entries(data)) {
          data[k] = v.replace(gidRegex, "gid=0$1");
        }
        return data;
      };

      function updateUser(user) {
        if (!user) return;
        Object.defineProperty(user, "userName", always("某用户"));
        Object.defineProperty(user, "nickName", always("某用户"));
        Object.defineProperty(user, "endDays", always(1));

        Object.defineProperty(user, "vipImage", always("jixun:normal-vip.png"));
        Object.defineProperty(user, "sex", always(9));
        Object.defineProperty(user, "nickName", always(""));
        Object.defineProperty(user, "experience", always(0));
        Object.defineProperty(user, "gold", always(0));
        Object.defineProperty(user, "nextLevel", always(99));
        Object.defineProperty(user, "gid", always(99));

        Object.defineProperty(user, "lastIP", always(fakeIp));
        Object.defineProperty(user, "from", always("地球"));
        Object.defineProperty(user, "headImage", always(utils.GetHost(defaultAvatar)));
      }

      // 过部分检测，如 2.0x 倍速
      // 但也有一些 VIP 功能不会弹窗提示而直接报错。
      function fixUser(user) {
        Object.defineProperty(user, "daysOfMembership", always(1));

        // 若 gid 为 0 或 null，设定为预先设定好的 "假" gid。
        if (!user.token.gid) {
          user.token.gid = fakeGid;
        }

        return user;
      }

      const { fromValidateToken, fromGetAuthorizedUserInfo } = InitUser.prototype;

      InitUser.prototype.fromValidateToken = function (user) {
        updateUser(user);
        return fixUser(fromValidateToken.apply(this, arguments));
      };

      InitUser.prototype.fromGetAuthorizedUserInfo = function (user) {
        updateUser(user);
        return fixUser(fromGetAuthorizedUserInfo.apply(this, arguments));
      };

      if (__DEBUG__) {
        window.__require__ = require;
      }
    },
  },
];

const webpackJsonp = (window.webpackJsonp = window.webpackJsonp || []);
let prevPush = webpackJsonp.push;
function webpackPushFilter(args) {
  if (moduleLoadList.size === 0) return;
  const [nextModuleId, modules] = args;

  for (const key in modules) {
    moduleLoadList.delete(key);
  }

  if (moduleLoadList.size == 0) {
    prevPush.call(webpackJsonp, [...myHooks, [[id, nextModuleId]]]);

    // 还原环境
    window.webpackJsonp.push = prevPush;
  }
}
const myPush = function () {
  each(arguments, webpackPushFilter);
  return prevPush.apply(webpackJsonp, arguments);
}.bind(webpackJsonp);
if (Object.hasOwnProperty.call(webpackJsonp, "push")) {
  webpackJsonp.push = myPush;
} else {
  let prevSlice = webpackJsonp.slice;
  webpackJsonp.slice = function () {
    prevPush = webpackJsonp.push;
    webpackJsonp.push = myPush;
    delete window.webpackJsonp.slice;

    return prevSlice.apply(webpackJsonp, arguments);
  }.bind(webpackJsonp);
}

window.webpackJsonp.forEach(webpackPushFilter);

// 过广告屏蔽检测
try {
  Object.defineProperty(window, "isAdsBlocked", always(false));
} catch (err) {
  delete window.isAdsBlocked;
}
