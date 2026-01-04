// ==UserScript==
// @name          司机社 签到
// @version       2.0
// @require       https://cdn.jsdelivr.net/npm/sweetalert2@9
// @author        uncharity
// @description   司机社论坛自动签到
// @match         http://*/*
// @match         https://*/*
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @license       MIT
// @noframes
// @namespace https://greasyfork.org/users/1464366
// @downloadURL https://update.greasyfork.org/scripts/559773/%E5%8F%B8%E6%9C%BA%E7%A4%BE%20%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559773/%E5%8F%B8%E6%9C%BA%E7%A4%BE%20%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

/**
 * 基于皮皮鸡原版重写
 * 原作者: 皮皮鸡
 * 重写作者: uncharity
 * 修改日期: 2025-12-16
 */

/* global Swal */

const domains = [
  "https://xsijishe.net",
  "https://sjs47.me",
  "https://sjs47.net",
  "https://sjs47.com",
  "https://sjslt.cc",
  "https://sijishecn.cc",
  "https://sijishex.cc",
  "https://sijishe.ink",
];
const mainTimes = 5;
const hashTimes = 3;
async function init() {
  if (GM_getValue("initialized")) {
    console.log("已初始化，跳过");
    return;
  }
  await Swal.fire({
    text: '由于脚本使用了tampermonkey进行跨域请求, 弹出提示请选择"总是允许此域名"',
    confirmButtonText: "确定",
  });
  console.log("开始初始化...");
  for (const domain of domains) {
    GM_xmlhttpRequest({
      method: "GET",
      url: `${domain}/plugin.php?id=k_misign:sign`,
      timeout: 10e3,
      onload: (response) => {
        const formhashMatch = response.responseText.match(
          /name="formhash" value="([a-zA-Z0-9]+)"/
        );
        if (formhashMatch) {
          const formhash = formhashMatch[1];
          console.log(`初始化--${domain}: ${formhash}`);
        } else {
          console.log(`初始化--${domain}:没找到formhash`);
        }
      },
      onerror: function () {
        console.log(`初始化--${domain}:请求失败`);
      },
    });
  }
  GM_setValue("activeDomains", []);
  GM_setValue("ts", 0);
  GM_setValue("initialized", true);
  console.log("初始化完成");
}

function checkNewDay(ts) {
  if (!ts) return true;
  const lastDate = new Date(ts);
  lastDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today > lastDate;
}
function gmRequest(options) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...options,
      onload: resolve,
      onerror: reject,
      ontimeout: reject,
    });
  });
}
async function getFormHash(domain, times = 0) {
  if (times >= hashTimes) {
    console.log(`${domain} 达到最大重试次数，放弃`);
    return { formhash: null, success: false };
  }
  try {
    const response = await gmRequest({
      method: "GET",
      url: `${domain}/plugin.php?id=k_misign:sign`,
      timeout: 10e3,
    });
    const formhashMatch = response.responseText.match(
      /name="formhash" value="([a-zA-Z0-9]+)"/
    );
    if (formhashMatch) {
      const formhash = formhashMatch[1];
      console.log(`${domain}: ${formhash}`);
      return { formhash, success: true };
    } else {
      console.log(`${domain}: 没找到formhash`);
      return getFormHash(domain, times + 1);
    }
  } catch (error) {
    console.log(`${domain}: 请求失败`);
    console.log(error);
    return getFormHash(domain, times + 1);
  }
}

async function fetchSign(domain, formhash, times = 0) {
  if (times >= mainTimes) {
    console.log(`${domain} 达到最大重试次数，放弃`);
    return { success: false };
  }
  try {
    const response = await gmRequest({
      method: "GET",
      url: `${domain}/plugin.php?id=k_misign:sign&operation=qiandao&formhash=${formhash}&format=empty`,
      timeout: 10e3,
    });
    const text = response.responseText;
    console.log(`${domain} 返回: ${text}`);
    if (text.match("<![CDATA[]]>") || text.match("今日已签")) {
      return { success: true, text };
    } else if (text.match("您所在用户组不允许使用")) {
      return { success: false, text };
    } else {
      return fetchSign(domain, formhash, times + 1);
    }
  } catch (error) {
    console.log(error);
    return fetchSign(domain, formhash, times + 1);
  }
}
async function sign(domain) {
  const { formhash, success: formhashSuccess } = await getFormHash(domain);
  if (!formhashSuccess) {
    return { success: false };
  }
  const { success: signSuccess } = await fetchSign(domain, formhash);
  if (signSuccess) {
    GM_setValue("ts", Date.now());
  }
  return { success: signSuccess };
}
async function main() {
  if (checkNewDay(GM_getValue("ts"))) {
    console.log("开始签到...");
    let flag = false;
    const activeDomains = GM_getValue("activeDomains") || [];
    const sortedDomains = [
      ...activeDomains.filter((d) => domains.includes(d)),
      ...domains.filter((d) => !activeDomains.includes(d)),
    ];
    console.log(`域名尝试顺序: ${sortedDomains.join(", ")}`);
    for (const domain of sortedDomains) {
      const { success } = await sign(domain);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "sijishes论坛自动签到",
          html: `<strong>签到成功!</strong>`,
        });
        console.log(`签到成功，停止尝试其他域名`);
        const newActiveDomains = new Set(GM_getValue("activeDomains"));
        newActiveDomains.add(domain);
        GM_setValue("activeDomains", Array.from(newActiveDomains));
        flag = true;
        break;
      }
    }
    if (!flag) {
      const result = await Swal.fire({
        icon: "error",
        title: "sijishes论坛自动签到",
        html: `<strong>签到失败!</strong>`,
        showCancelButton: true,
        confirmButtonText: "重新尝试",
        cancelButtonText: "放弃",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        console.log("用户选择重新尝试签到");
        return main();
      } else {
        GM_setValue("ts", Date.now());
        console.log("用户选择放弃签到");
      }
    }
  } else {
    console.log("今日已签到，跳过");
  }
}
window.addEventListener("load", async function () {
  await init();
  await main();
});
