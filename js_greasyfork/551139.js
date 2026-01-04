// ==UserScript==
// @license MIT
// @name         思源网页信息采集器
// @namespace    https://leay.net/
// @version      2.4
// @description  获取网页不同信息并根据网址规则插入到不同的思源笔记数据库
// @author       hqweay
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/551139/%E6%80%9D%E6%BA%90%E7%BD%91%E9%A1%B5%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551139/%E6%80%9D%E6%BA%90%E7%BD%91%E9%A1%B5%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 序列化配置（保存时调用）
  function serializeConfig(config) {
    return JSON.stringify(config, (key, value) => {
      if (value instanceof RegExp) {
        return {
          __regex__: true, // 自定义标记
          source: value.source, // 正则主体
          flags: value.flags, // 修饰符 (i,g,m等)
        };
      }
      return value;
    });
  }

  // 反序列化配置（加载时调用）
  function deserializeConfig(jsonStr) {
    return JSON.parse(jsonStr, (key, value) => {
      if (value?.__regex__) {
        return new RegExp(value.source, value.flags);
      }
      return value;
    });
  }

  // 保存配置
  function saveConfig() {
    GM_setValue("siyuan-config", serializeConfig(config));
  }

  // 加载配置
  function loadConfig() {
    const saved = GM_getValue("siyuan-config");
    return saved ? deserializeConfig(saved) : defaultConfig;
  }

  // 默认配置
  const defaultConfig = {
    baseURL: "http://localhost:6806",
    token: "",
    rules: [
      {
        name: "默认规则",
        urlPattern: /.*/,
        databaseID: "20250908210738-aaiw4zu",
        columns: {
          title: { name: "标题", type: "block" },
          url: { name: "网址", type: "url" },
          thumbnail: { name: "封面", type: "mAsset" },
          keywords: { name: "标签", type: "mSelect" },
        },
        extractMethod: "meta",
      },
      {
        name: "doubanBook元数据",
        urlPattern:
          /^https:\/\/book\.douban\.com\/subject\/(\d+)(\/|\/?\?.*)?$/i,
        databaseID: "20250908210738-6kaxs8n",
        columns: {
          title: { name: "名称", type: "block" },
          author: { name: "作者", type: "mSelect" },
          cover: { name: "封面", type: "mAsset" },
          isbn: { name: "ISBN", type: "text" },
          url: { name: "链接", type: "url" },
        },
        extractMethod: "doubanBook",
      },
    ],
  };

  // 加载配置
  let config = loadConfig();

  // 初始化正则表达式
  function initRegexPatterns() {
    config.rules.forEach((rule) => {
      if (typeof rule.urlPattern === "string") {
        try {
          const pattern = rule.urlPattern;
          const flags = pattern.endsWith("/i") ? "i" : "";
          const cleanPattern = flags ? pattern.slice(0, -2) : pattern;
          rule.compiledPattern = new RegExp(cleanPattern, flags);
        } catch (e) {
          console.error("无效的正则表达式:", rule.urlPattern, e);
          rule.compiledPattern = /.*/;
        }
      } else if (rule.urlPattern instanceof RegExp) {
        rule.compiledPattern = rule.urlPattern;
      } else {
        rule.compiledPattern = /.*/;
      }
    });
  }
  initRegexPatterns();

  // 配置管理界面
  function showConfigEditor() {
    const editor = document.createElement("div");
    editor.style.position = "fixed";
    editor.style.top = "50%";
    editor.style.left = "50%";
    editor.style.transform = "translate(-50%, -50%)";
    editor.style.backgroundColor = "white";
    editor.style.padding = "20px";
    editor.style.borderRadius = "5px";
    editor.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    editor.style.zIndex = "10000";
    editor.style.width = "80%";
    editor.style.maxWidth = "600px";
    editor.style.maxHeight = "80vh";
    editor.style.overflow = "auto";

    editor.innerHTML = `
					<h2 style="margin-top: 0;">思源笔记采集器配置</h2>
					<div>
							<label>API地址: <input type="text" id="config-baseURL" value="${config.baseURL}" style="width: 100%;"></label>
					</div>
					<div>
							<label>Token: <input type="text" id="config-token" value="${config.token}" style="width: 100%;"></label>
					</div>
					<h3>采集规则</h3>
					<div id="rules-container"></div>
					<div style="margin-top: 10px; display: flex; gap: 10px;">
							<button id="add-rule">添加规则</button>
							<button id="restore-defaults" style="background-color: #ff9500;">恢复默认配置</button>
					</div>
					<div style="margin-top: 20px; display: flex; justify-content: space-between;">
							<button id="save-config">保存配置</button>
							<button id="cancel-config">取消</button>
					</div>
			`;

    const rulesContainer = editor.querySelector("#rules-container");

    // 渲染现有规则
    config.rules.forEach((rule, index) => {
      renderRule(rule, index);
    });

    function renderRule(rule, index) {
      const ruleDiv = document.createElement("div");
      ruleDiv.style.border = "1px solid #ddd";
      ruleDiv.style.padding = "10px";
      ruleDiv.style.marginBottom = "10px";
      ruleDiv.style.position = "relative";

      console.log(rule.urlPattern instanceof RegExp);

      const displayUrlPattern =
        rule.urlPattern instanceof RegExp
          ? `${rule.urlPattern.source}${rule.urlPattern.ignoreCase ? "/i" : ""}`
          : rule.urlPattern;

      ruleDiv.innerHTML = `
							<h4 style="margin-top: 0;">规则 ${index + 1}</h4>
							<div>
									<label>规则名称: <input type="text" class="rule-name" value="${
                    rule.name
                  }" style="width: 100%;"></label>
							</div>
							<div>
									<label>URL匹配规则(正则): <input type="text" class="rule-urlPattern" value="${displayUrlPattern}" style="width: 100%;"></label>
							</div>
							<div>
									<label>数据库ID: <input type="text" class="rule-databaseID" value="${
                    rule.databaseID
                  }" style="width: 100%;"></label>
							</div>
							<div>
									<label>提取方法:
											<select class="rule-extractMethod" style="width: 100%;">
													<option value="meta" ${
                            rule.extractMethod === "meta" ? "selected" : ""
                          }>Meta标签</option>

													<option value="doubanBook" ${
                            rule.extractMethod === "doubanBook"
                              ? "selected"
                              : ""
                          }>doubanBook元数据</option>
											</select>
									</label>
							</div>
							<h5>列映射</h5>
							<div class="columns-container"></div>
							<button class="add-column" style="margin-top: 5px;">添加列</button>
							<button class="remove-rule" style="position: absolute; top: 10px; right: 10px; background-color: #ff4757; color: white;">删除</button>
					`;

      const columnsContainer = ruleDiv.querySelector(".columns-container");

      Object.entries(rule.columns || {}).forEach(([field, col]) => {
        renderColumn(field, col.name, col.type);
      });

      function renderColumn(field = "", colName = "", colType = "text") {
        const columnDiv = document.createElement("div");
        columnDiv.style.display = "grid";
        columnDiv.style.gridTemplateColumns = "1fr 1fr 1fr 50px";
        columnDiv.style.gap = "5px";
        columnDiv.style.marginBottom = "5px";
        columnDiv.style.alignItems = "center";

        columnDiv.innerHTML = `
									<input type="text" class="column-field" value="${field}" placeholder="元数据字段">
									<select class="column-type">
											<option value="text" ${colType === "text" ? "selected" : ""}>文本</option>
											<option value="block" ${colType === "block" ? "selected" : ""}>块</option>
											<option value="mSelect" ${colType === "mSelect" ? "selected" : ""}>多选</option>
											<option value="mAsset" ${colType === "mAsset" ? "selected" : ""}>资源</option>
											<option value="number" ${colType === "number" ? "selected" : ""}>数字</option>
											<option value="url" ${colType === "url" ? "selected" : ""}>链接</option>
									</select>
									<input type="text" class="column-name" value="${colName}" placeholder="数据库列名">
									<button class="remove-column" style="background-color: #ff4757; color: white;">×</button>
							`;

        columnsContainer.appendChild(columnDiv);
      }

      ruleDiv.querySelector(".add-column").addEventListener("click", () => {
        renderColumn("", "", "text");
      });

      ruleDiv.querySelector(".remove-rule").addEventListener("click", () => {
        if (config.rules.length <= 1) {
          alert("至少需要保留一条规则");
          return;
        }
        ruleDiv.remove();
      });

      rulesContainer.appendChild(ruleDiv);
    }

    editor.querySelector("#add-rule").addEventListener("click", () => {
      renderRule(
        {
          name: "新规则",
          urlPattern: ".*",
          databaseID: "",
          extractMethod: "meta",
          columns: {},
        },
        config.rules.length
      );
    });

    // 恢复默认配置按钮
    editor.querySelector("#restore-defaults").addEventListener("click", () => {
      if (confirm("确定要恢复默认配置吗？这将清除所有自定义规则。")) {
        config = defaultConfig; //JSON.parse(JSON.stringify(defaultConfig));
        rulesContainer.innerHTML = "";
        config.rules.forEach((rule, index) => {
          renderRule(rule, index);
        });
        showNotification("已恢复默认配置");
      }
    });

    editor.querySelector("#save-config").addEventListener("click", () => {
      const newConfig = {
        baseURL: editor.querySelector("#config-baseURL").value,
        token: editor.querySelector("#config-token").value,
        rules: [],
      };

      editor.querySelectorAll("#rules-container > div").forEach((ruleDiv) => {
        const patternInput = ruleDiv.querySelector(".rule-urlPattern").value;
        let urlPattern;

        try {
          // 处理带/i标志的情况
          if (patternInput.endsWith("/i")) {
            urlPattern = new RegExp(patternInput.slice(0, -2), "i");
          } else {
            urlPattern = new RegExp(patternInput);
          }
        } catch (e) {
          console.error("无效的正则表达式:", patternInput);
          urlPattern = /.*/; // 默认匹配所有
        }
        const rule = {
          name: ruleDiv.querySelector(".rule-name").value,
          urlPattern: urlPattern,
          databaseID: ruleDiv.querySelector(".rule-databaseID").value,
          extractMethod: ruleDiv.querySelector(".rule-extractMethod").value,
          columns: {},
        };

        ruleDiv
          .querySelectorAll(".columns-container > div")
          .forEach((colDiv) => {
            const field = colDiv.querySelector(".column-field").value;
            const colName = colDiv.querySelector(".column-name").value;
            const colType = colDiv.querySelector(".column-type").value;

            if (field && colName) {
              rule.columns[field] = {
                name: colName,
                type: colType,
              };
            }
          });

        newConfig.rules.push(rule);
      });

      config = newConfig;
      // GM_setValue("siyuan-config", JSON.stringify(config));
      saveConfig();
      initRegexPatterns();
      editor.remove();
      showNotification("配置已保存");
    });

    editor.querySelector("#cancel-config").addEventListener("click", () => {
      editor.remove();
    });

    document.body.appendChild(editor);
  }

  // 注册配置菜单命令
  GM_registerMenuCommand("配置思源笔记采集器", showConfigEditor);

  // 创建UI元素
  const style = document.createElement("style");
  style.textContent = `
			#metaInfoButton {
					position: fixed;
					bottom: 20px;
					right: 20px;
					padding: 10px 15px;
					background-color: #ff4757;
					color: white;
					border: none;
					border-radius: 5px;
					cursor: pointer;
					font-weight: bold;
					z-index: 9999;
			}
			#metaInfoButton:hover {
					background-color: #ff6b81;
			}
			#metaInfoContainer {
					position: fixed;
					bottom: 70px;
					right: 20px;
					width: 300px;
					max-height: 400px;
					overflow-y: auto;
					background-color: white;
					border: 1px solid #ddd;
					border-radius: 5px;
					padding: 15px;
					box-shadow: 0 0 10px rgba(0,0,0,0.1);
					z-index: 9998;
					display: none;
			}
			.meta-item {
					margin-bottom: 10px;
					padding-bottom: 10px;
					border-bottom: 1px solid #eee;
			}
			.meta-name {
					font-weight: bold;
					color: #ff4757;
			}
			.copy-notification {
					position: fixed;
					bottom: 70px;
					right: 20px;
					background-color: #4CAF50;
					color: white;
					padding: 10px 15px;
					border-radius: 5px;
					z-index: 10000;
					display: none;
			}
	`;
  document.head.appendChild(style);

  const button = document.createElement("button");
  button.id = "metaInfoButton";
  button.textContent = "采集到思源笔记";
  document.body.appendChild(button);

  const container = document.createElement("div");
  container.id = "metaInfoContainer";
  document.body.appendChild(container);

  const notification = document.createElement("div");
  notification.className = "copy-notification";
  document.body.appendChild(notification);

  function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.style.backgroundColor = isError ? "#ff4757" : "#4CAF50";
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }

  // 辅助函数：通过文本内容查找元素
  function findElementByText(text) {
    const spans = document.querySelectorAll("#info span.pl");
    for (const span of spans) {
      if (span.textContent.includes(text)) {
        return span;
      }
    }
    return null;
  }
  // 元数据提取器
  const extractors = {
    // 默认meta标签提取
    meta: function () {
      const url = cleanUrl(window.location.href);
      return {
        title:
          document
            .querySelector("meta[property='og:title']")
            ?.getAttribute("content")
            ?.trim() ||
          document.querySelector("title")?.textContent?.trim() ||
          "",
        url: url,
        thumbnail:
          document
            .querySelector("meta[property='og:image']")
            ?.getAttribute("content") ||
          document.querySelector("link[rel='icon']")?.getAttribute("href") ||
          "",
        keywords:
          document
            .querySelector("meta[name='keywords']")
            ?.getAttribute("content") ||
          document
            .querySelector("meta[name='Keywords']")
            ?.getAttribute("content") ||
          "",
      };
    },
    doubanBook: function () {
      const meta = extractors.meta(); // 先获取基础meta信息
      const url = meta.url;

      // 提取书籍ID
      const match = url.match(/\/subject\/(\d+)/);
      meta.id = (match && match[1]) || meta.id;

      // 提取书名
      const titleElement = document.querySelector("h1 span");
      meta.title = (titleElement && titleElement.textContent.trim()) || "";

      const coverElement = document.querySelector("#mainpic img");
      meta.cover =
        (coverElement && coverElement.getAttribute("src").trim()) || "";

      // 提取作者
      const authorElement = document.querySelector("#info span:first-child a");
      meta.author = (authorElement && authorElement.textContent.trim()) || "";

      // 提取出版社
      const publisherElement = findElementByText("出版社");
      meta.publisher =
        (publisherElement &&
          publisherElement.nextElementSibling &&
          publisherElement.nextElementSibling.textContent.trim()) ||
        "";

      // 提取出品方
      const producerElement = findElementByText("出品方");
      meta.producer =
        (producerElement &&
          producerElement.nextElementSibling &&
          producerElement.nextElementSibling.textContent.trim()) ||
        "";

      // 提取副标题
      const subtitleElement = findElementByText("副标题");
      meta.subtitle =
        (subtitleElement &&
          subtitleElement.nextSibling &&
          subtitleElement.nextSibling.textContent.trim()) ||
        "";

      // 提取出版年
      const publishDateElement = findElementByText("出版年");
      meta.publishDate =
        (publishDateElement &&
          publishDateElement.nextSibling &&
          publishDateElement.nextSibling.textContent.trim()) ||
        "";

      // 提取页数
      const pagesElement = findElementByText("页数");
      meta.pages =
        (pagesElement &&
          pagesElement.nextSibling &&
          pagesElement.nextSibling.textContent.trim()) ||
        "";

      // 提取定价
      const priceElement = findElementByText("定价");
      meta.price =
        (priceElement &&
          priceElement.nextSibling &&
          priceElement.nextSibling.textContent.trim()) ||
        "";

      // 提取装帧
      const bindingElement = findElementByText("装帧");
      meta.binding =
        (bindingElement &&
          bindingElement.nextSibling &&
          bindingElement.nextSibling.textContent.trim()) ||
        "";

      // 提取ISBN
      const isbnElement = findElementByText("ISBN");
      meta.isbn =
        (isbnElement &&
          isbnElement.nextSibling &&
          isbnElement.nextSibling.textContent.trim()) ||
        "";

      // 确保URL是干净的（去除查询参数）
      meta.url = `https://book.douban.com/subject/${meta.id}/`;

      return meta;
    },
  };

  // 提取元数据（根据匹配的规则选择提取方法）
  function extractMetadata(rule) {
    const extractMethod = rule.extractMethod || "meta";
    const extractor = extractors[extractMethod] || extractors.meta;
    return extractor();
  }

  function cleanUrl(urlString) {
    const url = new URL(urlString);
    const paramsToRemove = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "yclid",
      "msclkid",
      "icid",
      "mc_cid",
      "mc_eid",
      "_ga",
      "si",
      "igshid",
      "feature",
      "sharing",
      "app",
      "ref",
      "nr",
      "ncid",
      "cmpid",
      "ito",
      "ved",
      "ei",
      "s",
      "cvid",
      "form",
    ];
    paramsToRemove.forEach((param) => url.searchParams.delete(param));
    return url.toString();
  }

  function callSiyuanAPI(endpoint, data = {}, method = "POST") {
    console.log(data);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: method,
        url: `${config.baseURL}${endpoint}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${config.token}`,
        },
        data: JSON.stringify(data),
        onload: (response) => {
          try {
            const result = JSON.parse(response.responseText);
            if (result.code === 0) {
              resolve(result.data);
            } else {
              reject(new Error(result.msg || "API调用失败"));
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: (error) => {
          reject(error);
        },
      });
    });
  }

  async function getDatabaseColumns(avId) {
    try {
      const keys = await callSiyuanAPI("/api/av/getAttributeViewKeysByAvID", {
        avID: avId,
      });
      return keys || [];
    } catch (error) {
      console.error("获取数据库列信息失败:", error);
      return [];
    }
  }

  function formatValue(value, type) {
    switch (type) {
      case "text":
        return { text: { content: value || "" } };
      case "block":
        return { block: { content: value || "" } };
      case "mSelect":
        return {
          mSelect: value
            ? value.split(",").map((item) => ({ content: item.trim() }))
            : [],
        };
      case "mAsset":
        return { mAsset: value ? [{ content: value }] : [] };
      case "number":
        return { number: { content: Number(value) || 0 } };
      case "url":
        return { url: { content: value || "" } };
      default:
        return { text: { content: value || "" } };
    }
  }

  async function insertToSiyuanDatabase(metadata, rule) {
    try {
      const avId = rule.databaseID;
      const columns = await getDatabaseColumns(avId);

      if (columns.length === 0) throw new Error("数据库列信息获取失败");

      const values = [];
      const columnMap = {};
      columns.forEach(
        (col) => (columnMap[col.name] = { id: col.id, type: col.type })
      );

      // 主键列（第一列）
      const pkKeyID = columns[0].id;
      const pkColumnName = columns[0].name; // 获取主键列名

      values.push({
        keyID: pkKeyID,
        ...formatValue(metadata.title || "无标题", columns[0].type),
      });

      console.log(rule);
      console.log(columnMap);

      // 其他列（排除主键列）
      Object.entries(rule.columns).forEach(([field, col]) => {
        // 检查不是主键列且字段存在
        if (
          col.name !== pkColumnName &&
          columnMap[col.name] &&
          metadata[field] !== undefined
        ) {
          values.push({
            keyID: columnMap[col.name].id,
            ...formatValue(metadata[field], col.type),
          });
        }
      });

      const input = {
        avID: avId,
        blocksValues: [values],
      };

      console.log(input);

      await callSiyuanAPI(
        "/api/av/appendAttributeViewDetachedBlocksWithValues",
        input
      );
    } catch (error) {
      console.error("插入数据失败:", error);
      throw error;
    }
  }

  function getMatchingRule(url) {
    console.log("match");
    console.log(url);
    console.log(config.rules);
    for (let i = config.rules.length - 1; i >= 0; i--) {
      const rule = config.rules[i];
      if (rule.compiledPattern.test(url)) return rule;
    }
    return config.rules[0];
  }

  async function isLinkExist(url, avId) {
    try {
      const data = await callSiyuanAPI("/api/av/renderAttributeView", {
        id: avId,
        query: url,
        pageSize: 1,
      });
      return data?.view?.rows?.length > 0 || data?.view?.cards?.length > 0;
    } catch (error) {
      console.error("检查链接存在性失败:", error);
      return false; // 出错时默认返回不存在，避免阻止用户操作
    }
  }

  button.addEventListener("click", async function () {
    try {
      const currentUrl = cleanUrl(window.location.href);
      const rule = getMatchingRule(currentUrl);
      const metadata = extractMetadata(rule);

      // 检查链接是否已存在
      const urlToCheck = metadata.url || currentUrl; // 使用提取的URL或当前URL
      const isExist = await isLinkExist(urlToCheck, rule.databaseID);

      console.log(isExist);
      console.log(urlToCheck);

      if (isExist) {
        // if (!confirm("该链接已存在于数据库中，确定要继续保存吗？")) {
        //   showNotification("操作已取消");
        //   return;
        // }
        showNotification("⚠️ 该链接已存在于数据库中", true); // 使用红色提示
        return; // 直接返回，不继续保存
      }

      container.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: bold;">将保存到: ${
          rule.name
        }</div>
        <div style="margin-bottom: 10px; color: #666;">数据库ID: ${
          rule.databaseID
        }</div>
        ${
          isExist
            ? '<div style="color: orange; margin-bottom: 10px;">⚠️ 注意：该链接已存在于数据库中</div>'
            : ""
        }
      `;

      Object.entries(metadata).forEach(([field, value]) => {
        if (rule.columns[field]) {
          const item = document.createElement("div");
          item.className = "meta-item";
          item.innerHTML = `
            <div class="meta-name">${rule.columns[field].name}</div>
            <div class="meta-content">${value}</div>
          `;
          container.appendChild(item);
        }
      });
      container.style.display = "block";

      await insertToSiyuanDatabase(metadata, rule);
      showNotification(`网页信息已保存到【${rule.name}】数据库`);
      GM_setClipboard(JSON.stringify(metadata, null, 2), "text");

      setTimeout(() => {
        container.style.display = "none";
      }, 2000);
    } catch (error) {
      console.error("保存失败:", error);
      showNotification(`保存失败: ${error.message}`, true);
    }
  });
})();
