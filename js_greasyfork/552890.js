// ==UserScript==
// @name         bilibili导出直播消费记录
// @namespace    https://github.com/qianjiachun
// @version      2026.01.05.01
// @description  B站导出直播消费记录
// @author       小淳
// @match        *://link.bilibili.com/p/center/index*
// @require      https://registry.npmmirror.com/xlsx/0.16.4/files/dist/xlsx.full.min.js
// @require      https://registry.npmmirror.com/blueimp-md5/2.19.0/files/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      passport.bilibili.com
// @connect      static.geetest.com
// @connect      api.geetest.com
// @connect      api.live.bilibili.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552890/bilibili%E5%AF%BC%E5%87%BA%E7%9B%B4%E6%92%AD%E6%B6%88%E8%B4%B9%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/552890/bilibili%E5%AF%BC%E5%87%BA%E7%9B%B4%E6%92%AD%E6%B6%88%E8%B4%B9%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

"use strict";

/* -------------------- 配置 & 工具 -------------------- */
const ANDROID_APPKEY = "783bbb7264451d82";
const ANDROID_APP_SECRET = "2653583c8873dea268ab9386918b1d65";
const DEFAULT_STATISTICS = '{"appId":1,"platform":3,"version":"7.30.0","abtest":""}';

function payload_sign(payload) {
  const defaults = {
    access_key: "",
    appkey: ANDROID_APPKEY,
    build: "7300400",
    channel: "alifenfa",
    device: "phone",
    mobi_app: "android",
    platform: "android",
    c_locale: "zh_CN",
    s_locale: "zh_CN",
    statistics: DEFAULT_STATISTICS,
    disable_rcmd: "0",
    spm_id: "enter_homepage",
    ts: Math.floor(Date.now() / 1000)
  };
  const merged = Object.assign({}, payload, defaults);
  const keys = Object.keys(merged).sort();
  const ordered = {};
  keys.forEach((k) => (ordered[k] = merged[k]));
  return ordered;
}

function app_sign(payload) {
  const usp = new URLSearchParams(payload);
  const query = usp.toString();
  const sign = md5(query + ANDROID_APP_SECRET);
  payload.sign = sign;
  return payload;
}

function parseQueryParamsFromUrl(url) {
  const qp = {};
  try {
    const q = url.split("?")[1] || url;
    q.split("&").forEach((pair) => {
      const [k, v] = pair.split("=");
      if (k) qp[k] = decodeURIComponent(v || "");
    });
  } catch (e) {}
  return qp;
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/* -------------------- 样式 & 按钮 -------------------- */
function initStyles() {
  const style = document.createElement("style");
  style.textContent = `
    #export-button {
      height: 20px;
      width: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #7b2cbf;
      border-radius: 12px;
      color: #fff;
      font-family: PingFang SC;
      font-size: 11px;
      cursor: pointer;
      margin-left: 6px;
      transition: all 0.3s ease;
    }
    #export-button:disabled {
      background: #999;
      cursor: not-allowed;
    }
    #export-button.progress {
      width: auto;
      min-width: 120px;
      padding: 0 8px;
      font-size: 10px;
    }
    #login-dialog .dialog-mask {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.4); z-index: 9998;
    }
    #login-dialog .dialog-box {
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: #fff; padding: 20px; border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.3); z-index: 9999;
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      width: 280px;
    }
    #login-dialog input {
      width: 200px; padding: 6px 10px;
      border: 1px solid #ccc; border-radius: 4px;
    }
    #login-dialog button {
      width: 120px; padding: 6px; cursor: pointer;
      border: none; border-radius: 4px; background: #7b2cbf; color: white;
    }
    #geetest-container {
      width: 250px;
      height: 44px;
      margin-top: 5px;
    }
    #date-range-dialog .dialog-mask {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.4); z-index: 9998;
    }
    #date-range-dialog .dialog-box {
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: #fff; padding: 20px; border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.3); z-index: 9999;
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      width: 300px;
    }
    #date-range-dialog input[type="month"] {
      width: 200px; padding: 6px 10px;
      border: 1px solid #ccc; border-radius: 4px;
    }
    #date-range-dialog button {
      width: 120px; padding: 6px; cursor: pointer;
      border: none; border-radius: 4px; background: #7b2cbf; color: white;
      margin: 0 5px;
    }
    #date-range-dialog .button-group {
      display: flex; gap: 10px; margin-top: 10px;
    }
    #date-range-dialog .speed-config {
      display: flex; align-items: center; gap: 10px; margin-top: 10px;
      font-size: 13px;
    }
    #date-range-dialog .speed-config input {
      width: 80px; padding: 4px 8px;
    }
    #download-partial-button {
      height: 20px;
      width: auto;
      padding: 0 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #00a67e;
      border-radius: 12px;
      color: #fff;
      font-family: PingFang SC;
      font-size: 11px;
      cursor: pointer;
      margin-left: 6px;
      transition: all 0.3s ease;
    }
    #download-partial-button:hover {
      background: #008c6a;
    }
  `;
  document.head.appendChild(style);
}

function initExportButton_Dom() {
  const dom = document.querySelector(".bettery-block");
  if (!dom) return;
  const exportButton = document.createElement("div");
  exportButton.className = "pay-button";
  exportButton.id = "export-button";
  exportButton.innerHTML = `<span>导出</span>`;
  dom.appendChild(exportButton);
}

/* -------------------- 初始化 -------------------- */
async function init() {
  initExportButton_Dom();
  const exportButton = document.querySelector("#export-button");
  if (!exportButton) return;
  exportButton.addEventListener("click", async () => {
    const accessKey = localStorage.getItem("app_access_key");
    if (!accessKey) {
      showLoginDialog();
      return;
    }

    // 显示时间范围选择对话框
    showDateRangeDialog(async (minMonth, requestDelay, savedProgress) => {
      // 显示加载状态
      const originalText = exportButton.innerHTML;
      const originalClass = exportButton.className;
      exportButton.innerHTML = "<span>导出中...</span>";
      exportButton.className = originalClass + " progress";
      exportButton.disabled = true;

      // 创建"下载已获数据"按钮
      let downloadPartialButton = document.querySelector("#download-partial-button");
      if (!downloadPartialButton) {
        downloadPartialButton = document.createElement("div");
        downloadPartialButton.className = "pay-button";
        downloadPartialButton.id = "download-partial-button";
        downloadPartialButton.innerHTML = `<span>下载已获数据</span>`;
        const dom = document.querySelector(".bettery-block");
        if (dom) dom.appendChild(downloadPartialButton);
      }

      // 用于存储当前正在获取的数据
      let currentRecords = [];

      downloadPartialButton.onclick = () => {
        if (currentRecords.length > 0) {
          exportToExcel(currentRecords);
          alert(`已下载当前获取的 ${currentRecords.length} 条记录`);
        } else {
          alert("暂无数据可下载");
        }
      };

      try {
        // 获取所有消费记录，带进度回调和时间限制
        const records = await getAllPayRecords(
          accessKey,
          (progress) => {
            const monthDisplay = progress.currentMonth !== "未知" ? ` (${progress.currentMonth})` : "";
            exportButton.innerHTML = `<span>获取中... 第${progress.currentPage}页 (${progress.currentRecords}条)${monthDisplay}</span>`;
            // 更新当前记录供"下载已获数据"按钮使用
            currentRecords = progress.allRecords || [];
          },
          minMonth,
          requestDelay,
          savedProgress
        );

        if (records.length === 0) {
          alert("没有找到消费记录数据");
          return;
        }

        // 显示导出Excel进度
        exportButton.innerHTML = "<span>生成Excel中...</span>";

        // 导出到Excel
        exportToExcel(records);

        // 清除进度
        localStorage.removeItem("export_progress");

        alert(`✅ 导出成功！共导出 ${records.length} 条记录\n时间范围：${minMonth} 及之后`);
      } catch (error) {
        console.error("导出失败:", error);

        // 检查是否是认证失败
        if (error.message.includes("未登录") || error.message.includes("code")) {
          alert("❌ 登录已过期，请重新登录");
          showLoginDialog();
          // 清除进度
          localStorage.removeItem("export_progress");
        } else {
          alert(`❌ 导出失败: ${error.message}`);
        }
      } finally {
        // 恢复按钮状态
        exportButton.innerHTML = originalText;
        exportButton.className = originalClass;
        exportButton.disabled = false;

        // 移除"下载已获数据"按钮
        if (downloadPartialButton && downloadPartialButton.parentNode) {
          downloadPartialButton.parentNode.removeChild(downloadPartialButton);
        }
      }
    });
  });
}

/* -------------------- 时间范围选择对话框 -------------------- */
function showDateRangeDialog(callback) {
  const dialog = document.createElement("div");
  dialog.id = "date-range-dialog";

  // 设置默认值为当前月份
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;

  // 获取保存的速度配置，默认500ms
  const savedDelay = localStorage.getItem("export_request_delay") || "500";

  dialog.innerHTML = `
    <div class="dialog-mask"></div>
    <div class="dialog-box">
      <h3>选择导出时间范围</h3>
      <p style="font-size: 12px; color: #666; text-align: center; margin: 0;">
        导出指定月份之后的所有消费数据<br>
        例如：选择2025-02，则导出2025年2月及之后的数据
      </p>
      <input id="date-range-input" type="month" value="${currentMonth}" />
      <div class="speed-config">
        <label>请求间隔(ms):</label>
        <input id="speed-config-input" type="number" min="0" max="5000" step="100" value="${savedDelay}" />
        <span style="font-size: 11px; color: #999;">建议: 500</span>
      </div>
      <div class="button-group">
        <button id="date-range-cancel">取消</button>
        <button id="date-range-confirm">确认导出</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  const input = dialog.querySelector("#date-range-input");
  const speedInput = dialog.querySelector("#speed-config-input");
  const confirmBtn = dialog.querySelector("#date-range-confirm");
  const cancelBtn = dialog.querySelector("#date-range-cancel");

  cancelBtn.onclick = () => dialog.remove();

  confirmBtn.onclick = async () => {
    const selectedMonth = input.value;
    if (!selectedMonth) {
      alert("请选择月份");
      return;
    }

    const requestDelay = parseInt(speedInput.value) || 500;
    if (requestDelay < 0 || requestDelay > 5000) {
      alert("请求间隔应在0-5000ms之间");
      return;
    }

    // 保存速度配置
    localStorage.setItem("export_request_delay", requestDelay.toString());

    // 将YYYY-MM格式转换为YYYYMM格式
    const monthCode = selectedMonth.replace("-", "");

    // 检查是否有未完成的导出任务
    const savedProgress = localStorage.getItem("export_progress");
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      const continueExport = confirm(
        `检测到上次未完成的导出任务：\n` +
          `时间范围：${progress.minMonth}\n` +
          `已获取：${progress.recordCount}条记录\n` +
          `下一页ID：${progress.nextId}\n\n` +
          `是否继续上次的任务？\n点击"确定"继续，"取消"则重新开始`
      );

      if (continueExport) {
        dialog.remove();
        callback(progress.minMonth, requestDelay, progress);
        return;
      } else {
        // 清除旧的进度
        localStorage.removeItem("export_progress");
      }
    }

    dialog.remove();
    callback(monthCode, requestDelay, null);
  };
}

/* -------------------- 登录弹窗 -------------------- */
function showLoginDialog() {
  const dialog = document.createElement("div");
  dialog.id = "login-dialog";
  dialog.innerHTML = `
    <div class="dialog-mask"></div>
    <div class="dialog-box">
      <h3>短信验证码登录</h3>
      <input id="login-phone" type="text" placeholder="请输入手机号" maxlength="11"/>
      <button id="login-getcode">获取验证码</button>
      <div id="geetest-container"></div>
      <input id="login-code" type="text" placeholder="请输入验证码" maxlength="6" disabled />
      <button id="login-submit" disabled>登录</button>
      <button id="login-cancel">取消</button>
      <div id="login-msg" style="color:red;font-size:12px;"></div>
    </div>
  `;
  document.body.appendChild(dialog);

  const phoneInput = dialog.querySelector("#login-phone");
  const codeInput = dialog.querySelector("#login-code");
  const getCodeBtn = dialog.querySelector("#login-getcode");
  const submitBtn = dialog.querySelector("#login-submit");
  const cancelBtn = dialog.querySelector("#login-cancel");
  const msgEl = dialog.querySelector("#login-msg");

  cancelBtn.onclick = () => dialog.remove();

  getCodeBtn.onclick = async () => {
    const phone = phoneInput.value.trim();
    if (phone.length !== 11) {
      alert("请输入正确的手机号");
      return;
    }

    getCodeBtn.disabled = true;
    getCodeBtn.textContent = "发送中...";
    msgEl.textContent = "";

    try {
      const region = 86;
      const basePayload = { cid: region, tel: phone };
      let payload = payload_sign(basePayload);
      app_sign(payload);
      let body = new URLSearchParams(payload).toString();
      const url = "https://passport.bilibili.com/x/passport-login/sms/send";
      let resp = await gmPost(url, body);

      // 直接成功
      if (resp && resp.code === 0 && resp.data && resp.data.captcha_key) {
        msgEl.textContent = "验证码已发送，请注意查收短信。";
        codeInput.disabled = false;
        submitBtn.disabled = false;
        unsafeWindow._tm_sms_payload = {
          captcha_key: resp.data.captcha_key,
          cid: region,
          tel: phone,
          statistics: payload.statistics || DEFAULT_STATISTICS,
          rawSendResp: resp
        };
        getCodeBtn.textContent = "重新获取";
        return;
      }

      // 需要极验
      if (resp && resp.data && resp.data.recaptcha_url) {
        msgEl.textContent = "需要完成极验验证，请在下方完成。";
        const recUrl = resp.data.recaptcha_url;
        const qp = parseQueryParamsFromUrl(recUrl);
        let gt = qp.gee_gt || qp.gt || qp.geetest_gt || qp.geeGt || qp.gt_id || null;
        let challenge = qp.gee_challenge || qp.challenge || qp.geeChallenge || qp.challenge_id || null;

        // 尝试页面解析
        if ((!gt || !challenge) && recUrl) {
          const page = await gmGet(recUrl);
          const gtm =
            respText.match(/gt['"]?\s*[:=]\s*['"]([0-9a-zA-Z-_]+)['"]/i) ||
            respText.match(/data\-gt=['"]([0-9a-zA-Z-_]+)['"]/i);
          const chm =
            respText.match(/challenge['"]?\s*[:=]\s*['"]([0-9a-zA-Z-_]+)['"]/i) ||
            respText.match(/data\-challenge=['"]([0-9a-zA-Z-_]+)['"]/i);
          if (gtm && gtm[1]) gt = gtm[1];
          if (chm && chm[1]) challenge = chm[1];
        }

        if (!gt || !challenge) {
          msgEl.innerHTML = `极验参数解析失败，请手动完成：<a href="${recUrl}" target="_blank">打开验证链接</a>`;
          getCodeBtn.disabled = false;
          return;
        }

        const validate = await renderGeetestInline(gt, challenge, "popup");
        if (!validate) {
          msgEl.textContent = "极验回调失败";
          getCodeBtn.disabled = false;
          return;
        }

        // 携带极验结果再次发送
        const t_payload = Object.assign({}, basePayload);
        t_payload.recaptcha_token = qp.recaptcha_token || qp.recaptcha || qp.token || undefined;
        t_payload.gee_challenge = validate.geetest_challenge || validate.challenge || validate.geetest_challenge;
        t_payload.gee_validate = validate.geetest_validate || validate.validate || validate.geetest_validate;
        t_payload.gee_seccode = validate.geetest_seccode || validate.seccode || validate.geetest_seccode;

        const finalPayload = payload_sign(t_payload);
        console.log("finalPayload", t_payload, finalPayload);
        app_sign(finalPayload);

        const body2 = new URLSearchParams(finalPayload).toString();
        const resp2 = await gmPost(url, body2);

        console.log("resp2", resp2);

        if (resp2 && resp2.code === 0 && resp2.data && resp2.data.captcha_key) {
          msgEl.textContent = "验证码已发送，请注意查收短信。";
          codeInput.disabled = false;
          submitBtn.disabled = false;
          unsafeWindow._tm_sms_payload = {
            captcha_key: resp2.data.captcha_key,
            cid: region,
            tel: phone,
            statistics: finalPayload.statistics || DEFAULT_STATISTICS,
            rawSendResp: resp2
          };
          getCodeBtn.textContent = "重新获取";
        } else {
          msgEl.textContent = "发送验证码失败：" + (resp2.message || JSON.stringify(resp2));
          getCodeBtn.disabled = false;
        }
      }
    } catch (e) {
      console.error(e);
      msgEl.textContent = "请求异常：" + e.message;
      getCodeBtn.disabled = false;
    }
  };

  submitBtn.onclick = async () => {
    const code = codeInput.value.trim();
    if (code.length !== 6) {
      alert("请输入正确的验证码");
      return;
    }
    const payload = unsafeWindow._tm_sms_payload;
    if (!payload || !payload.captcha_key) {
      alert("验证码未发送");
      return;
    }

    const baseLoginPayload = {
      cid: payload.cid,
      tel: payload.tel,
      captcha_key: payload.captcha_key,
      code
    };
    let loginPayload = payload_sign(baseLoginPayload);
    app_sign(loginPayload);
    const loginData = new URLSearchParams(loginPayload);
    const loginRes = await gmPost("https://passport.bilibili.com/x/passport-login/login/sms", loginData.toString());
    if (loginRes.code === 0 && loginRes.data && loginRes.data.token_info) {
      localStorage.setItem("app_access_key", loginRes.data.token_info.access_token);
      alert("登录成功！请再次点击导出");
      dialog.remove();
    } else {
      alert("登录失败：" + (loginRes.message || JSON.stringify(loginRes)));
    }
  };
}

/* -------------------- 极验渲染 -------------------- */
function renderGeetestInline(gt, challenge, product = "popup") {
  return new Promise((resolve, reject) => {
    if (!unsafeWindow.initGeetest) {
      const s = document.createElement("script");
      s.src = "https://static.geetest.com/static/js/gt.0.4.9.js";
      s.onload = () => _render();
      s.onerror = (e) => reject(new Error("加载 geetest 脚本失败: " + e));
      document.head.appendChild(s);
    } else _render();

    function _render() {
      unsafeWindow.initGeetest({ gt, challenge, offline: false, product, width: "250px" }, (captchaObj) => {
        captchaObj.appendTo("#geetest-container");
        captchaObj.onSuccess(() => {
          const res = captchaObj.getValidate();
          if (!res) reject(new Error("极验失败"));
          else resolve(res);
        });
        captchaObj.onError(() => reject(new Error("极验加载失败")));
      });
    }
  });
}

/* -------------------- gmPost 简单封装 -------------------- */
function gmPost(url, body) {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: "POST",
      url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        Accept: "*/*",
        "User-Agent":
          "Mozilla/5.0 BiliDroid/7.30.0 (bbcallen@gmail.com) os/android model/SM-S9180 mobi_app/android build/7300400 channel/alifenfa innerVer/7300400 osVer/9 network/2",
        "APP-KEY": "android",
        env: "prod"
      },
      data: body,
      onload: (res) => {
        try {
          console.log(JSON.parse(res.responseText));
          resolve(JSON.parse(res.responseText));
        } catch (e) {
          resolve(null);
        }
      },
      onerror: () => resolve(null)
    });
  });
}

/* -------------------- gmGet 简单封装 -------------------- */
function gmGet(url) {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        Accept: "*/*",
        "User-Agent":
          "Mozilla/5.0 BiliDroid/7.30.0 (bbcallen@gmail.com) os/android model/SM-S9180 mobi_app/android build/7300400 channel/alifenfa innerVer/7300400 osVer/9 network/2",
        "APP-KEY": "android",
        env: "prod"
      },
      onload: (res) => resolve({ text: res.responseText }),
      onerror: () => resolve({ text: "" })
    });
  });
}

/* -------------------- 获取消费记录数据 -------------------- */
async function getPayRecords(accessKey, nextId = "") {
  const url = `https://api.live.bilibili.com/xlive/revenue/v2/giftStream/payRecord?access_key=${accessKey}&coin_type=gold&mobi_app=android&page_size=20&next_id=${nextId}`;

  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        Accept: "*/*",
        "User-Agent":
          "Mozilla/5.0 BiliDroid/7.30.0 (bbcallen@gmail.com) os/android model/SM-S9180 mobi_app/android build/7300400 channel/alifenfa innerVer/7300400 osVer/9 network/2",
        "APP-KEY": "android",
        env: "prod"
      },
      onload: (res) => {
        try {
          const data = JSON.parse(res.responseText);
          console.log(data);
          resolve(data);
        } catch (e) {
          resolve({ code: -1, message: "解析响应失败" });
        }
      },
      onerror: () => resolve({ code: -1, message: "网络请求失败" })
    });
  });
}

/* -------------------- 获取所有消费记录数据 -------------------- */
async function getAllPayRecords(
  accessKey,
  progressCallback,
  minMonth = null,
  requestDelay = 500,
  savedProgress = null
) {
  const allRecords = [];
  const existingIds = new Set(); // 在循环外部创建Set，提高性能
  let nextId = "";
  let hasMore = true;
  let pageCount = 0;

  // 如果有保存的进度，从断点继续
  if (savedProgress) {
    // 恢复已有的记录
    if (savedProgress.records && Array.isArray(savedProgress.records)) {
      allRecords.push(...savedProgress.records);
      // 重建existingIds Set
      savedProgress.records.forEach((record) => existingIds.add(record.id));
    }
    nextId = savedProgress.nextId || "";
    pageCount = savedProgress.pageCount || 0;
    console.log(`从断点继续：已有${allRecords.length}条记录，从第${pageCount + 1}页开始`);
  }

  while (hasMore) {
    pageCount++;
    const response = await getPayRecords(accessKey, nextId);

    if (response.code !== 0) {
      // 保存当前进度
      saveProgress(minMonth, allRecords, nextId, pageCount);
      throw new Error(`获取数据失败: ${response.message}`);
    }

    if (response.data && response.data.list) {
      // 过滤掉已存在的记录（基于id去重）
      const newRecords = response.data.list.filter((record) => {
        if (existingIds.has(record.id)) {
          return false; // 已存在，跳过
        }
        existingIds.add(record.id); // 添加到Set中
        return true; // 新记录，保留
      });
      allRecords.push(...newRecords);

      // 检查是否还有更多数据
      const hasNextPage = response.data.params && response.data.params.next_id;
      if (hasNextPage) {
        nextId = response.data.params.next_id;
      } else {
        hasMore = false;
      }

      // 保存进度（只在有下一页时保存）
      if (hasNextPage) {
        saveProgress(minMonth, allRecords, nextId, pageCount);
      }

      // 更新进度
      if (progressCallback) {
        progressCallback({
          currentPage: pageCount,
          currentRecords: allRecords.length,
          pageRecords: newRecords.length,
          currentMonth: response.data.params?.month || "未知",
          allRecords: allRecords // 传递所有记录供"下载已获数据"使用
        });
      }

      // 检查时间范围限制
      if (minMonth && response.data.params && response.data.params.month) {
        const currentMonth = response.data.params.month;
        if (currentMonth < minMonth) {
          console.log(`达到时间限制：当前月份 ${currentMonth} < 最小月份 ${minMonth}，停止获取`);
          hasMore = false;
          break;
        }
      }

      // 添加延迟避免请求过快
      if (hasMore && hasNextPage) {
        await sleep(requestDelay);
      }
    } else {
      hasMore = false;
    }
  }

  return allRecords;
}

/* -------------------- 保存导出进度 -------------------- */
function saveProgress(minMonth, records, nextId, pageCount) {
  try {
    const progress = {
      minMonth,
      records,
      nextId,
      pageCount,
      recordCount: records.length,
      timestamp: Date.now()
    };
    localStorage.setItem("export_progress", JSON.stringify(progress));
  } catch (e) {
    console.warn("保存进度失败（可能是localStorage空间不足）:", e);
  }
}

/* -------------------- 导出Excel功能 -------------------- */
function exportToExcel(records) {
  // 创建工作簿
  const wb = XLSX.utils.book_new();

  // 准备数据，按照指定表头：日期 房间号 主播昵称 礼物类型 数量 电池 支付电池 时间
  const excelData = records.map((record) => {
    const date = new Date(record.timestamp * 1000);
    const dateStr = date.toLocaleDateString("zh-CN");
    const timeStr = date.toLocaleTimeString("zh-CN");

    // 将字符串格式的电池数量转换为数字（处理"1,380"格式）
    const coin = typeof record.coin === "string" ? parseInt(record.coin.replace(/,/g, "")) : record.coin;
    const payCoin = typeof record.pay_coin === "string" ? parseInt(record.pay_coin.replace(/,/g, "")) : record.pay_coin;

    return [
      dateStr, // 日期
      record.room_id, // 房间号
      record.r_uname, // 主播昵称
      record.gift_name, // 礼物类型
      record.gift_num, // 数量
      coin, // 电池
      payCoin, // 支付电池
      timeStr // 时间
    ];
  });

  // 添加表头
  const headers = ["日期", "房间号", "主播昵称", "礼物类型", "数量", "电池", "支付电池", "时间"];
  excelData.unshift(headers);

  // 创建工作表
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // 设置列宽
  ws["!cols"] = [
    { wch: 12 }, // 日期
    { wch: 15 }, // 房间号
    { wch: 20 }, // 主播昵称
    { wch: 15 }, // 礼物类型
    { wch: 8 }, // 数量
    { wch: 10 }, // 电池
    { wch: 12 }, // 支付电池
    { wch: 12 } // 时间
  ];

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, "消费记录");

  // 生成文件名（包含当前日期）
  const now = new Date();
  const fileName = `bilibili消费记录_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now
    .getDate()
    .toString()
    .padStart(2, "0")}.xlsx`;

  // 导出文件
  XLSX.writeFile(wb, fileName);
}

/* -------------------- 自动初始化 -------------------- */
(async function () {
  let count = 0;
  const timer = setInterval(async () => {
    if (count >= 100) clearInterval(timer);
    if (document.querySelector(".bettery-block")) {
      clearInterval(timer);
      initStyles();
      await init();
    }
    count++;
  }, 200);
})();
