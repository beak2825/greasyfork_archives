// ==UserScript==
// @name         自动跳过中转页面（Auto Redirect Skipper）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动跳过中转页面，支持站点可配置。
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558687/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E4%B8%AD%E8%BD%AC%E9%A1%B5%E9%9D%A2%EF%BC%88Auto%20Redirect%20Skipper%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558687/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E4%B8%AD%E8%BD%AC%E9%A1%B5%E9%9D%A2%EF%BC%88Auto%20Redirect%20Skipper%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --------------------------------------
  // 配置：每个站点写 host + keys（query 参数名）
  // --------------------------------------
  const rules = [
    { host: "link.juejin.cn", keys: ["target"] }, // 掘金
    { host: "sspai.com", keys: ["target"] }, // 少数派
    { host: "link.zhihu.com", keys: ["target"] }, // 知乎
    { host: "link.csdn.net", keys: ["target"] }, // CSDN
    { host: "www.jianshu.com", keys: ["url"] }, // 简书
    { host: "gitee.com", keys: ["target"] }, // Gitte
    { host: "afdian.com", keys: ["target"] }, // 爱发电
    { host: "weibo.cn", keys: ["toasturl", "url", "u"] }, // 微博
    { host: "www.youtube.com", keys: ["q"] }, // YouTube
    { host: "www.yuque.com", keys: ["url"] }, // 语雀
    { host: "developer.aliyun.com", keys: ["target"] }, // 阿里云
    { host: "www.douban.com", keys: ["url"] }, // 豆瓣
    { host: "xie.infoq.cn", keys: ["target"] }, // InfoQ 写作社区
    { host: "www.infoq.cn", keys: ["target"] }, // InfoQ
    { host: "www.oschina.net", keys: ["url"] }, // OSChina
    { host: "www.gcores.com", keys: ["target"] }, // 机核
    { host: "urlsec.qq.com", keys: ["url"] }, // 腾讯安全中心
    { host: "c.pc.qq.com", keys: ["pfurl"] }, // QQ 安全中心
    { host: "docs.qq.com", keys: ["url"] }, // 腾讯文档
    { host: "cloud.tencent.com", keys: ["target"] }, // 腾讯云
    { host: "www.kdocs.cn", keys: ["target"] }, // 金山文档
    { host: "www.google.com.hk", keys: ["q"] }, // Google 香港
  ];


  // --------------------------------------
  // 工具函数
  // --------------------------------------
  const multiDecode = (v) => {
    if (!v) return v;
    try {
      for (let i = 0; i < 5; i++) v = decodeURIComponent(v);
    } catch {}
    return v;
  };

  const findQuery = (keys) => {
    try {
      const url = new URL(location.href);
      for (const k of keys) {
        const val = url.searchParams.get(k);
        if (val) return val;
      }
    } catch {}
    return null;
  };

  // --------------------------------------
  // 主逻辑
  // --------------------------------------
  const curHost = location.host;

  for (const rule of rules) {
    if (curHost !== rule.host) continue;

    const raw = findQuery(rule.keys);
    if (!raw) continue;

    const target = multiDecode(raw.trim());
    if (!target) continue;

    if (/^https?:\/\//.test(target) && target !== location.href) {
      console.log("[重定向]=>", target);
      location.replace(target);
    }

    break;
  }
})();
