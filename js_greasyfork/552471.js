// ==UserScript==
// @name         Cookies切换
// @description  掌控你的cookie吧~~
// @namespace    https://tampermonkey.net/
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        *://*/*
// @grant        GM_cookie
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @version      1.4
// @author       Cheney & Gemini
// @license      GPLv3
// @icon      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAArlJREFUSEullktoE0EYx//ftEKxD2uVFitW8AH25AssKIiCvVQQsaAeeiiKBzWZRMylXmwvnipkZ6OUoniwh6BexMdBPYiIggcVRS1YwQdUbKWRIhLbuJ+d3abNdjfJNlmYw+73+H0z859vllDgYSlbAMQAVJNSxwv5FrORnwNHo/VgvgDmkzn2PlKqt1jCfHYPiKPRLbCsAQBtniDL2kuJxONSYC4Qh0IHIcRVAA2+yZiryDT/lgXiUKgZQjwBsN43EdFLMoztpUB0zNyMWMpLAE5lE70Zz+Dy6z8YaK9zPjGPkGluLAvEUnYAuJebpFaN2a89bdU411btmIgOk2HcLAVmz4ilvALAJV/PjLLZS4QRR6OrYFnvAdQvotIkgM+kVE/QGGIpTwNIBA3I8RsmpVqDxmmQlvOxoAE5fmkIsY7i8e9BYokjkadg3hXE2ccncLfQoHEwrywRpMM8MI7FGqm/35Ht7OMBfZ38Z5ta6ipc7NHfFtpvpbC2tgL3Oz26+QTmb7NHYA+EOEPxeHwhyLV0+vy0NlTiRZe7C32YyGDH0IRdwLvuFcUWYBjMnWSaWs0OnyORa2Duzn7YnZxAzRLhVzVejWXQtFSguUYUA2l7Gun0Ghoc/OmApNSt/3yQyCA+qbSF5VWuQvocUCi0CUK8BVAZJFEhn0O3f+Hhlyl7aRfs8dlsC7oOoKtc0IkHk3g2Oo2hjmXY2jhX9w9MT7c6oHB4P4julgvKE99LSvXNXxORSBLMRwrBFikGneoOKXXA3qPcxCwl5wMtUt46zSgptXpO3i5QOLwZRI9mmqynU0xOMfbdSGFbU+X8ZZivKqLnZBg7XQfWz7csyRPFyDAuLszr+7uVI5CjAPQoJv0MAL3HSTJN103tu3S+s3POmYZtmB3Z/4aPM0dixB6WlaREYriQkP4DhYT2pc+2+CQAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/552471/Cookies%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/552471/Cookies%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const hostname = location.hostname;

  /**
   * 获取根域名 (例如: pan.baidu.com -> baidu.com)
   */
  function getRootDomain(host) {
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return host;
    const parts = host.split('.');
    if (parts.length <= 2) return host;
    const commonSLDs = ['com', 'net', 'org', 'edu', 'gov', 'co', 'ac', 'mil'];
    if (parts.length > 2 && commonSLDs.includes(parts[parts.length - 2])) {
      return parts.slice(-3).join('.');
    }
    return parts.slice(-2).join('.');
  }

  // 1. 获取统一的根域名作为存储Key
  const domain = getRootDomain(hostname);

  // 初始化为空 改为懒加载
  let cookiesConfig = {};

  // --- 修改：加载配置 (已删除兼容性处理逻辑) ---
  function loadConfig() {
    cookiesConfig = GM_getValue("cookiesConfig", {});
  }

  const mainClassName = `cookieSwitchWrapper_${randomStr()}`;

  const LIVE_COOKIES_OPTION_VALUE = "__LIVE_COOKIES__";
  const LIVE_COOKIES_OPTION_TEXT = "当前";

  function randomStr() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let str = "";
    for (let i = 0; i < 6; i++) {
      str += letters[Math.floor(Math.random() * 26)];
    }
    return str;
  }

  function closePannel() {
    $(`.${mainClassName}`).css("transform", "translateX(110%)");
  }

  function getSelectedDomain() {
    const select = $(`.${mainClassName} .domain-select`);
    if (select.length) {
      return select.val();
    }
    return domain; // 这里的 domain 是脚本开头定义的当前页面根域名
  }

  /**
   * Checks if the table width exceeds the panel width and applies word wrapping to the Name column if necessary.
   */
  function checkAndAdjustNameColumnWrap() {
    setTimeout(() => {
        const $mainDiv = $(`.${mainClassName}`);
        if (!$mainDiv.length) return;

        const $table = $mainDiv.find('.cookieTable');
        if (!$table.length || $table.find('tbody tr').length === 0) return;

        const $nameColumn = $table.find('th:first-child, td.cookie-name');

        // Temporarily remove the class to measure the table's natural width
        $nameColumn.removeClass('force-wrap-name');

        if ($table.outerWidth() > $mainDiv.width()) {
            $nameColumn.addClass('force-wrap-name');
        }
    }, 100); // Use a short delay to ensure DOM is updated before measuring
  }


  function createStyle() {
    const css = `
      .${mainClassName} {
        position: fixed; z-index: 999999; top: 0; right: 0;
        width: 1000px; height: 100%;
        padding: 10px;
        padding-bottom: 10px;
        box-sizing: border-box;
        transition: transform 200ms; transform: translateX(110%);
        background-color: #fff !important; color: #000 !important;
        box-shadow: -10px 0 10px #ddd;

        /* 强制显示垂直滚动条 */
        overflow-y: scroll;
        overflow-x: auto;

        /* --- 新增：阻止滚动链接/穿透 --- */
        /* 这会让滚动事件被限制在当前容器内 不会传递给网页背景 */
        overscroll-behavior: contain;
      }
      .${mainClassName} .topWrapper {
        display: flex; justify-content: space-between; align-items: center; margin-bottom:10px;
      }

      /* --- 修复：固定顶部所有元素的字体大小 --- */
      .${mainClassName} .topWrapper span,
      .${mainClassName} .topWrapper select,
      .${mainClassName} .topWrapper input,
      .${mainClassName} .topWrapper button {
        font-size: 13px !important;
        color: #000 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        vertical-align: middle !important;
      }

      /* --- 通用控件样式：去除圆角 统一高度 --- */
      .${mainClassName} select, .${mainClassName} input, .${mainClassName} button {
        background-color: #fff !important;
        border: 1px solid #ccc !important;
        padding: 0 8px !important;
        height: 30px !important;       /* 统一高度 */
        line-height: 28px !important;  /* 垂直居中 */
        border-radius: 0 !important;   /* 去除圆角 */
        margin-left: 5px !important;
        box-sizing: border-box !important;
      }

      /* --- 1. 固定已保存COOKIE选择框大小 --- */
      .${mainClassName} select.title-select {
        width: 180px !important;
        min-width: 180px !important;
        max-width: 180px !important;
      }

      /* --- 2. 固定删除按钮大小 --- */
      .${mainClassName} .delete-setting-btn {
        background-color: #ffdddd !important;
        border-color: #ffaaaa !important;
        color: #000 !important;
        padding: 0 12px !important;
      }

      .${mainClassName} .delete-setting-btn.disabled {
        background-color: #f0f0f0 !important;
        border-color: #ddd !important;
        color: #aaa !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
      }

      /* --- 3. 固定关闭按钮大小 (位于顶部栏最后的按钮) --- */
      .${mainClassName} .titleInput { outline: none; flex-grow: 1; margin-left:10px !important; }

      .${mainClassName} .topButtonGroup {
        display: flex;
        align-items: center;
        margin-left: auto;
      }
      .${mainClassName} .topButtonGroup button {
        margin-left: 3px !important;
        height: 30px !important;
        line-height: 28px !important;
        padding: 0 12px !important;
        white-space: nowrap;
      }

      .${mainClassName} .cookieTable { width: 100%; margin-top: 15px; border-collapse: collapse; }

      /* 强制重置 thead 样式 */
      .${mainClassName} .cookieTable thead {
          background: #f0f0f0 !important;
          background-color: #f0f0f0 !important;
          background-image: none !important;
          color: #000 !important;
      }

      .${mainClassName} .cookieTable th, .${mainClassName} .cookieTable td {
        font-size: 12px; padding: 6px; text-align: center;
        border: 1px solid #ddd !important;
        color: #000 !important;
      }

      /* --- 修改：固定表头背景色并吸顶 --- */
      .${mainClassName} .cookieTable th {
        font-size: 13px;
        white-space: nowrap;

        /* 使用 background 简写覆盖 image/gradient 并强制不透明 */
        background: #e9e9e9 !important;
        background-color: #e9e9e9 !important;
        background-image: none !important;
        color: #000 !important;
        position: static !important;
      }

      /* 固定交错行背景色 */
      .${mainClassName} .cookieTable tbody tr:nth-child(odd) { background-color: #ffffff !important; }
      .${mainClassName} .cookieTable tbody tr:nth-child(even) { background-color: #f9f9f9 !important; }
      .${mainClassName} .cookieTable tbody tr:hover { background-color: #f1f1f1 !important; }

      .${mainClassName} .cookieTable td.cookie-name { text-align: left; }
      .${mainClassName} .cookieTable td.cookie-value { text-align: left; word-break: break-all; }
      .${mainClassName} .cookieTable textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 2px !important;
        border: 1px solid #eee !important;
        outline: none;
		color: #000 !important;
        background-color: #FFFFFF !important;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        resize: none;
        overflow-y: hidden;
        vertical-align: top;
      }
      .${mainClassName} .cookieTable button {
        word-break: keep-all; padding: 0 6px !important; font-size:11px !important;
        height: 24px !important; line-height: 22px !important; /* 表格内按钮稍小 */
        color: #000000 !important;:
      }
		/* 右下角按钮咬痕 */
		background-color: #f1f1f1;
      #cookieBtn {
        background-color: #FF6E6E !important;
      }
      /* Style to force word wrapping on the name column when needed */
      .${mainClassName} .force-wrap-name {
        white-space: normal !important;
        word-break: break-all !important;
      }
    `;
    return $("<style lang='scss'></style>").text(css);
  }

  function createCookieBtn() {
    const cookieBtn = $(
      `<div id="cookieBtn"><svg t="1715656222971" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1852" width="26" height="26"><path d="M1023.72271 650.495659a541.231658 541.231658 0 0 1-881.127308 230.481105 544.362949 544.362949 0 0 1 221.599077-880.946655A161.773348 161.773348 0 0 0 414.897311 63.37854c9.183114 12.133754 19.901765 23.002948 31.915085 32.366713-12.766034 33.26997-49.468381 147.381451 27.097713 191.791593 16.077976 28.84401 48.655449 49.980227 108.782264 51.184569 0.602171 41.579935 9.785285 109.264001 59.283775 139.222029 27.850427 44.620901 84.635191 71.206769 198.716563 22.611536A167.102565 167.102565 0 0 0 903.288429 609.186701a98.816327 98.816327 0 0 0 120.434281 41.308958z" fill="#FF6E6E" p-id="1853"></path><path d="M195.737029 542.104807a45.162855 45.162855 0 1 1 0 90.32571 45.162855 45.162855 0 0 1 0-90.32571z m270.977132 270.977132a45.162855 45.162855 0 1 1 0 90.32571 45.162855 45.162855 0 0 1 0-90.32571z m0-301.085703a45.162855 45.162855 0 1 1 0 90.325711 45.162855 45.162855 0 0 1 0-90.325711z m-180.651422-301.085702a45.162855 45.162855 0 1 1 0 90.325711 45.162855 45.162855 0 0 1 0-90.325711z m511.845694 451.628553a45.162855 45.162855 0 1 1 0 90.325711 45.162855 45.162855 0 0 1 0-90.325711z" fill="#0C0058" p-id="1854"></path></svg></div>`
    )
      .css({
        width: "26px", height: "26px", position: "fixed",
        right: "10px", bottom: "40px", "z-index": 99999,
        cursor: "pointer", "user-select": "none",
        "box-shadow": "-4px 4px 8px #ddd", "border-radius": "50%",
        opacity: "0", // 修改：平时完全透明 (100%透明度)
        transition: "opacity 0.3s" // 新增：添加过渡动画
      })
      .hover(
        function() { $(this).css("opacity", "1"); }, // 鼠标悬浮：完全不透明 (0%透明度)
        function() { $(this).css("opacity", "0"); }  // 鼠标移开：恢复完全透明
      )
      .click(() => {
        // --- 修改：点击时检查面板是否存在 不存在则初始化 ---
        if ($(`.${mainClassName}`).length === 0) {
            loadConfig(); // 1. 读取配置
            const main = createMain(); // 2. 创建面板 DOM
            $("body").append(main); // 3. 插入页面
            refreshSettingsUI(LIVE_COOKIES_OPTION_VALUE); // 4. 填充数据
        }

        // 显示面板
        $(`.${mainClassName}`).css("transform", "translateX(0)");
        checkAndAdjustNameColumnWrap();
      });
    return cookieBtn;
  }

  function updateDeleteButtonState() {
    const selectedValue = $(`.${mainClassName} .title-select`).val();
    const deleteBtn = $(`.${mainClassName} .delete-setting-btn`);

    // 如果选中的是 "当前Cookie" 或者没有选中值 则禁用按钮
    if (!selectedValue || selectedValue === LIVE_COOKIES_OPTION_VALUE) {
      deleteBtn.addClass('disabled');
    } else {
      // 否则启用按钮 (红色)
      deleteBtn.removeClass('disabled');
    }
  }

  function refreshSettingsUI(selectThisValue = null) {
    const targetDomain = getSelectedDomain();
    const titleSelect = $(`.${mainClassName} .title-select`);
    const titleInput = $(`.${mainClassName} .titleInput`);
    const isCurrentPageDomain = (targetDomain === domain); // 判断是否是当前正在访问的域名

    titleSelect.empty();

    // 修改：只有在当前域名下 才显示 "当前Cookie" 选项
    if (isCurrentPageDomain) {
        titleSelect.append($("<option>").val(LIVE_COOKIES_OPTION_VALUE).text(LIVE_COOKIES_OPTION_TEXT));
    }

    // 加载选中域名的配置
    let hasSavedConfigs = false;
    if (cookiesConfig[targetDomain] && cookiesConfig[targetDomain].length > 0) {
      hasSavedConfigs = true;
      cookiesConfig[targetDomain].forEach((item) => {
        titleSelect.append($("<option>").val(item.title).text(item.title));
      });
    }

    let finalSelectedValue = selectThisValue;

    // 确定默认选中项
    if (!finalSelectedValue) {
        if (isCurrentPageDomain) {
            // 如果是当前域名 默认选 "当前Cookie"
            finalSelectedValue = LIVE_COOKIES_OPTION_VALUE;
        } else if (hasSavedConfigs) {
            // 修改：如果是其他域名 默认选第一个已保存的配置
            finalSelectedValue = cookiesConfig[targetDomain][0].title;
        }
    }

    // 再次校验选中的值是否有效
    const configExists = hasSavedConfigs && cookiesConfig[targetDomain].some(s => s.title === finalSelectedValue);

    if (!isCurrentPageDomain && !configExists) {
         // 如果在其他域名且找不到对应配置（比如刚删完） 清空
         finalSelectedValue = "";
    } else if (isCurrentPageDomain && finalSelectedValue !== LIVE_COOKIES_OPTION_VALUE && !configExists) {
         finalSelectedValue = LIVE_COOKIES_OPTION_VALUE;
    }

    titleSelect.val(finalSelectedValue);

    // 根据选中项渲染表格
    if (finalSelectedValue === LIVE_COOKIES_OPTION_VALUE && isCurrentPageDomain) {
      titleInput.val("");
      GM_cookie.list({ domain: targetDomain }, function (cookies, error) {
        if (!error) {
          fillTable(cookies);
        } else {
          $(`.${mainClassName} tbody`).html("<tr><td colspan='10'>无法加载该域名的Cookie</td></tr>");
        }
      });
    } else if (finalSelectedValue) {
      titleInput.val(finalSelectedValue);
      const setting = cookiesConfig[targetDomain].find(s => s.title === finalSelectedValue);
      fillTable(setting?.cookies);
    } else {
      // 既不是当前Cookie 也没有保存的配置（例如其他域名无配置时）
      titleInput.val("");
      $(`.${mainClassName} tbody`).html("<tr><td colspan='10'>该域名下没有已保存的配置</td></tr>");
    }

    updateDeleteButtonState();
  }


  function handleDeleteCurrentSetting() {
    const targetDomain = getSelectedDomain();
    const titleToDelete = $(`.${mainClassName} .title-select`).val();

    // 校验逻辑...
    if (!titleToDelete || titleToDelete === LIVE_COOKIES_OPTION_VALUE || !cookiesConfig[targetDomain]) {
      return;
    }

    {
      // 删除指定配置
      cookiesConfig[targetDomain] = cookiesConfig[targetDomain].filter(item => item.title !== titleToDelete);

      // 检查该域名下是否还有配置
      if (cookiesConfig[targetDomain].length === 0) {
        delete cookiesConfig[targetDomain]; // 删除空域名 Key
        GM_setValue("cookiesConfig", cookiesConfig);

        // 修改：刷新域名列表 (移除已空的域名)
        refreshDomainListUI();

        // 修改：如果删除的是其他域名 且该域名已无配置 自动切回当前域名
        if (targetDomain !== domain) {
            $(`.${mainClassName} .domain-select`).val(domain);
            refreshSettingsUI(LIVE_COOKIES_OPTION_VALUE);
        } else {
            // 如果是当前域名 切回 Live Cookies
            refreshSettingsUI(LIVE_COOKIES_OPTION_VALUE);
        }
      } else {
        // 该域名下还有其他配置
        GM_setValue("cookiesConfig", cookiesConfig);
        // 刷新UI refreshSettingsUI 会自动处理默认选中第一个配置的逻辑
        refreshSettingsUI();
      }
    }
  }

  // 新增：刷新域名选择框的列表
  function refreshDomainListUI() {
    const domainSelect = $(`.${mainClassName} .domain-select`);
    if (!domainSelect.length) return;

    const currentSelection = domainSelect.val(); // 记录当前选中的值
    domainSelect.empty();

    // 1. 获取除当前域名外的所有已保存域名
    let otherDomains = Object.keys(cookiesConfig).filter(d => d !== domain);

    // 2. 对其他域名进行字母排序
    otherDomains.sort();

    // 3. 构建最终列表：当前域名始终排在第一位
    const allDomains = [domain, ...otherDomains];

    allDomains.forEach(d => {
        const option = $("<option>").val(d).text(d);

        // --- 修改：如果是当前域名 添加特殊背景色和加粗 ---
        if (d === domain) {
            option.css({
                "background-color": "#e6f7ff", // 浅蓝色背景
                "font-weight": "bold",         // 加粗
                "color": "#000"                // 确保文字颜色
            });
        }

        domainSelect.append(option);
    });

    // 尝试恢复之前的选择
    if (currentSelection && allDomains.includes(currentSelection)) {
        domainSelect.val(currentSelection);
    } else {
        domainSelect.val(domain);
    }
  }

  function createMain() {
    // --- 1. 创建域名选择框 ---
    const domainSelect = $("<select class='domain-select'>");

    // 这里的初始化逻辑移到了 refreshDomainListUI 稍后调用

    // 当域名切换时 刷新配置列表
    domainSelect.change(() => {
        // 切换域名时 不传参数 让 refreshSettingsUI 自动决定默认选中项(第一个配置)
        refreshSettingsUI();
    });

    // ... (中间代码保持不变: titleSelect, titleInput, deleteSettingBtn 等) ...
    const titleSelect = $("<select class='title-select'>");
    const titleInput = $("<input class='titleInput' placeholder='输入新配置名称' />");
    const deleteSettingBtn = $("<button class='delete-setting-btn'>删除配置</button>").click(handleDeleteCurrentSetting);

    titleSelect.change((e) => {
      refreshSettingsUI($(e.target).val());
    });

    titleInput.change((e) => {
        // ... (保持不变) ...
        const currentTypedTitle = $(e.target).val().trim();
        const titleSelectElement = $(`.${mainClassName} .title-select`);
        const targetDomain = getSelectedDomain();

        if (currentTypedTitle === "") {
            if (titleSelectElement.val() !== LIVE_COOKIES_OPTION_VALUE && targetDomain === domain) {
                refreshSettingsUI(LIVE_COOKIES_OPTION_VALUE);
            }
        } else if (cookiesConfig[targetDomain] && cookiesConfig[targetDomain].some(item => item.title === currentTypedTitle)) {
            if (titleSelectElement.val() !== currentTypedTitle) {
                 refreshSettingsUI(currentTypedTitle);
            }
        }
    });

    // ... (按钮定义保持不变: addBtn, saveBtn, applyBtn 等) ...
    const addBtn = $("<button>新增</button>").click(() => { /*...*/
        // 注意：addBtn 内部逻辑保持不变
        const deleteRowBtn = $("<button>删除</button>").click(function () {
            if (confirm(`确认删除此行吗?`)) {
                $(this).closest("tr").remove();
                checkAndAdjustNameColumnWrap();
            }
        });
        const deleteTd = $("<td>").append(deleteRowBtn);
        const currentTargetDomain = getSelectedDomain();
        const tr = $("<tr class='cookie-row'>").append(
            `<td class="editable cookie-name"></td><td class="editable cookie-value"></td><td class="editable">${currentTargetDomain}</td><td class="editable">/</td><td class="editable"></td><td></td><td class="editable">false</td><td class="editable">false</td><td class="editable">Lax</td>`,
            deleteTd
        );
        $(`.${mainClassName} tbody`).append(tr);
        checkAndAdjustNameColumnWrap();
    });

    const saveBtn = $("<button>保存</button>").click(() => {
      const currentTitle = $(`.${mainClassName} .titleInput`).val().trim();
      const savedCookies = saveCookie();
      if (savedCookies) {
        // 保存后 可能新增了域名 需要刷新域名列表
        refreshDomainListUI();
        // 重新选中刚才保存的域名(因为 refreshDomainListUI 可能会重置选择)
        const targetDomain = savedCookies[0].domain; // 简单获取一下
        // 实际上 getSelectedDomain() 还是原来的 所以直接刷新UI即可
        refreshSettingsUI(currentTitle);
      }
    });

    const applyBtn = $("<button>保存并导入</button>").click(() => applyCookie());
    const copyBtn = $("<button>复制</button>").click(() => copyCookiesToClipboard());
    const closeBtn = $("<button>关闭</button>").click(closePannel);

    const topButtonGroup = $("<div class='topButtonGroup'></div>").append(
      deleteSettingBtn, addBtn, saveBtn, applyBtn, copyBtn, closeBtn
    );

    const topDiv = $("<div class='topWrapper'>").append(
      domainSelect,
      titleSelect,
      titleInput,
      topButtonGroup
    );

    // ... (表格创建代码保持不变) ...
    const cookieTable = $("<table class='cookieTable'></table>")
      .append(
        `<thead><tr><th>Name</th><th>Value</th><th>Domain</th><th>Path</th><th>Expires/Max-Age</th><th>Size</th><th>HttpOnly</th><th>Secure</th><th>SameSite</th><th>操作</th></tr></thead>`,
        `<tbody></tbody>`
      )
      .on("click", ".editable:not(.editing)", function (event) {
          // ... (表格编辑逻辑保持不变) ...
           const td = $(this);
        td.addClass("editing");
        const originalText = td.text();
        const textarea = $("<textarea />").val(originalText);
        const autoResize = (el) => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        };
        textarea.blur(() => {
          td.removeClass("editing");
          td.text(textarea.val());
          checkAndAdjustNameColumnWrap();
        }).on('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                $(this).blur();
            } else if (e.key === 'Escape') {
                td.removeClass("editing");
                td.text(originalText);
                $(this).remove();
            }
        }).on('input', function() {
            autoResize(this);
        });
        td.html(textarea);
        autoResize(textarea[0]);
        textarea.focus();
      });

    // 创建完DOM后 初始化域名列表
    // 注意：这里需要先把元素 append 到 div 后 或者直接操作 domainSelect 变量
    // 由于 refreshDomainListUI 依赖于 DOM 中存在 .domain-select 我们需要先返回结构
    // 或者稍微修改 refreshDomainListUI 接受参数
    // 最简单的方法是：在 initPage 中调用 refreshDomainListUI 或者在这里手动调用一次填充逻辑

    // 手动填充一次 避免时序问题
    let otherDomains = Object.keys(cookiesConfig).filter(d => d !== domain);
    otherDomains.sort();
    const allDomains = [domain, ...otherDomains];

    allDomains.forEach(d => {
        const option = $("<option>").val(d).text(d);

        // 如果是当前域名 添加特殊背景色和加粗
        if (d === domain) {
            option.css({
                "background-color": "rgb(100, 100, 100)",
                "color": "#fff"
            });
        }

        domainSelect.append(option);
    });

    domainSelect.val(domain);

    // 创建主容器 jQuery 对象
    const $container = $(`<div class='${mainClassName}'></div>`).append(topDiv, cookieTable);

    // --- 新增：事件隔离逻辑 ---
    // 防止在面板内的点击、按键等事件冒泡到网页 导致触发网页快捷键或关闭视频等
    const containerEl = $container[0]; // 获取原生 DOM 元素
    const stopPropagation = (e) => e.stopPropagation();

    ['click', 'mousedown', 'keydown', 'keyup', 'contextmenu', 'focus', 'focusin', 'wheel'].forEach(evtName => {
        containerEl.addEventListener(evtName, stopPropagation, false);
    });

    return $container;
  }

  function initPage() {

    const style = createStyle();
    const cookieBtn = createCookieBtn();

    // 只添加样式和按钮
    $("body").append(style, cookieBtn);

  }

  function saveCookie() {
    const targetDomain = getSelectedDomain(); // 获取目标域名
    const title = $(`.${mainClassName} .titleInput`).val().trim();

    if (!title) {
      alert("请输入配置名称");
      return undefined;
    }
    if (title === LIVE_COOKIES_OPTION_TEXT) {
        alert(`配置名称不能是 "${LIVE_COOKIES_OPTION_TEXT}". 请输入不同的名称`);
        return undefined;
    }

    const cookies = [];
    $(`.${mainClassName} .cookieTable .cookie-row`).each(function () {
      const tds = $(this).children("td");
      const name = tds.eq(0).text().trim();
      if (!name) return;

      let expirationDate;
      const expDateStr = tds.eq(4).text().trim();
      if (expDateStr && expDateStr.toLowerCase() !== 'session') {
        const parsedDate = Date.parse(expDateStr);
        if (!isNaN(parsedDate)) expirationDate = parsedDate / 1000;
      }

      cookies.push({
        name: name, value: tds.eq(1).text(),
        // 如果表格里是空的 使用目标域名
        domain: tds.eq(2).text().trim() || targetDomain,
        path: tds.eq(3).text().trim() || "/",
        expirationDate: expirationDate,
        httpOnly: tds.eq(6).text().trim().toLowerCase() === 'true',
        secure: tds.eq(7).text().trim().toLowerCase() === 'true',
        sameSite: tds.eq(8).text().trim() || 'Lax',
      });
    });

    if (!cookiesConfig[targetDomain]) cookiesConfig[targetDomain] = [];
    const existingSettingIndex = cookiesConfig[targetDomain].findIndex(item => item.title === title);
    if (existingSettingIndex > -1) {
      cookiesConfig[targetDomain][existingSettingIndex].cookies = cookies;
    } else {
      cookiesConfig[targetDomain].push({ title, cookies });
    }
    GM_setValue("cookiesConfig", cookiesConfig);
    return cookies;
  }

  function applyCookie() {
    const targetDomain = getSelectedDomain(); // 获取目标域名
    const cookiesToApply = saveCookie();
    if (!cookiesToApply) return;

    // 1. 获取目标域名的现有Cookie
    GM_cookie.list({ domain: targetDomain }, function(existingCookies, error) {
        if (error) {
            alert('获取现有Cookie列表失败');
            return;
        }

        let deletedCount = 0;
        const totalToDelete = existingCookies.length;

        const setNewCookies = () => {
            let successCount = 0;
            let errorCount = 0;
            const totalToSet = cookiesToApply.length;

            if (totalToSet === 0) {
                alert("所有现有Cookie已被清除");
                // 如果操作的是当前页面域名 刷新页面；否则只关闭面板
                if (targetDomain === domain) {
                    closePannel();
                    location.reload();
                } else {
                    alert(`域名 ${targetDomain} 的Cookie已更新`);
                    closePannel();
                }
                return;
            }

            cookiesToApply.forEach((cookie) => {
                const cookieDetails = { ...cookie };
                if (cookieDetails.expirationDate === undefined || isNaN(cookieDetails.expirationDate)) {
                    delete cookieDetails.expirationDate;
                }
                // 确保设置到正确的域名
                if (!cookieDetails.domain) cookieDetails.domain = targetDomain;
                if (!cookieDetails.path) cookieDetails.path = "/";

                GM_cookie.set(cookieDetails, function (setError) {
                    if (setError) {
                        errorCount++;
                    } else {
                        successCount++;
                    }
                    if (successCount + errorCount === totalToSet) {
                        if (targetDomain === domain) {
                            closePannel();
                            location.reload();
                        } else {
                            alert(`域名 ${targetDomain} 的Cookie已更新`);
                            closePannel();
                        }
                    }
                });
            });
        };

        if (totalToDelete === 0) {
            setNewCookies();
            return;
        }

        existingCookies.forEach(cookie => {
            GM_cookie.delete({ name: cookie.name, domain: cookie.domain, path: cookie.path }, function(deleteError) {
                deletedCount++;
                if (deletedCount === totalToDelete) {
                    setNewCookies();
                }
            });
        });
    });
  }

  /**
   * Copies the current set of cookies (Name and Value) to the clipboard.
   * Format: Name1=Value1;Name2=Value2;Name3=Value3;
   */
  function copyCookiesToClipboard() {
    const cookiePairs = [];
    $(`.${mainClassName} .cookieTable tbody .cookie-row`).each(function () {
        const tds = $(this).children("td");
        const name = tds.eq(0).text().trim();
        const value = tds.eq(1).text().trim();
        if (name) { // Only include if name is not empty
            cookiePairs.push(`${name}=${value}`);
        }
    });

    if (cookiePairs.length === 0) {
        alert("没有可复制的Cookie");
        return;
    }

    // Join with a semicolon and add a trailing semicolon for the correct format
    const cookieString = cookiePairs.join('; ');

    // Use the modern Clipboard API. GM_setClipboard is also an option.
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(cookieString).then(() => {
        }).catch(err => {
            // Fallback for older browsers or non-secure contexts if needed
            GM_setClipboard(cookieString, "text");
        });
    } else {
        // Fallback for older browsers or non-secure contexts
        GM_setClipboard(cookieString, "text");
    }
  }


  function fillTable(cookiesArray) {
    const tbody = $(`.${mainClassName} tbody`);
    tbody.html("");
    if (!cookiesArray || cookiesArray.length === 0) {
      tbody.html("<tr><td colspan='10'>没有Cookies数据</td></tr>");
      checkAndAdjustNameColumnWrap();
      return;
    }
    cookiesArray.forEach((cookie) => {
      const deleteRowBtn = $("<button>删除</button>").click(function () {
        {
            $(this).closest("tr").remove();
            checkAndAdjustNameColumnWrap();
        }
      });
      const deleteTd = $("<td>").append(deleteRowBtn);
      const expirationDateString = cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toLocaleString() : "Session";
      const tr = $("<tr class='cookie-row'>").append(
        `<td class="editable cookie-name">${cookie.name || ""}</td>
         <td class="editable cookie-value">${cookie.value || ""}</td>
         <td class="editable">${cookie.domain || ""}</td>
         <td class="editable">${cookie.path || ""}</td>
         <td class="editable">${expirationDateString}</td>
         <td>${String(cookie.value || "").length}</td>
         <td class="editable">${typeof cookie.httpOnly === 'boolean' ? cookie.httpOnly : false}</td>
         <td class="editable">${typeof cookie.secure === 'boolean' ? cookie.secure : false}</td>
         <td class="editable">${cookie.sameSite || "Lax"}</td>`,
        deleteTd
      );
      tbody.append(tr);
    });
    checkAndAdjustNameColumnWrap();
  }

  initPage();
})();