// ==UserScript==
// @name         Eolink 接口解析
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  把 eolink 接口自动转换成 ts 类型代码
// @author       Gemini + Human
// @match        *://*.eolink.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eolink.com
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560160/Eolink%20%E6%8E%A5%E5%8F%A3%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/560160/Eolink%20%E6%8E%A5%E5%8F%A3%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const version = GM_info.script.version;
  /**
 * 使用极简的封装思路，通过插件注入的 unsafeWindow
 * 针对 XHR 进行拦截（很多企业级应用底层仍依赖 XHR 或兼容层）
 */
  const interceptXHR = () => {
    const XHR = unsafeWindow.XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;

    // 1. 在 open 阶段捕获请求方法
    XHR.open = function (method, url) {
      this._method = method.toUpperCase(); // 保存方法并转为大写，防止大小写差异
      this._url = url;
      return open.apply(this, arguments);
    };

    // 2. 在执行阶段进行过滤
    XHR.send = function () {
      this.addEventListener('load', async () => {
        // 同时判断：是 POST 方法 且 包含特定 URL
        if (this._method === 'POST' && this._url && /\/getApi$/.test(this._url)) {
          // console.log('检测到 POST 请求:', this._url);
          parseResponse(this.responseText);
        }
      });
      return send.apply(this, arguments);
    };
  };

  /**
 * 解析并打印逻辑
 */
  const parseResponse = (responseText) => {
    try {
      const data = JSON.parse(responseText);

      console.log('%c[Eolink Parser] hit!', 'background: #222; color: #bada55; padding: 2px 5px;');
      console.log('data', data);
      const ret = parseEoLinkApiInfo(data.apiInfo)
      console.log('parsed:', ret)
      const key = ret.info.method + ' ' + ret.info.url
      storeData(key, {
        ts: ret.typescript.full,
        json: responseText
      })
    } catch (e) {
      // 忽略非 JSON 响应
      console.error('Eolink Parser error:', e);
    }
  };

  // 启动拦截
  interceptXHR();

  // store ------ START


  let panelData = {}, panelEl, panelActive;
  function storeData(k, v) {
    if (k in panelData) return false;
    panelData[k] = v;

    if (!panelEl) {
      panelEl = document.createElement('div');
      Object.assign(panelEl.style, {
        position: 'fixed', bottom: '16px', right: '16px', width: '300px',
        background: '#eeeeeec4', border: '1px solid #000', zIndex: 1e4, fontFamily: 'sans-serif',
        borderRadius: '4px',
      });
      panelEl.innerHTML = `
      <div style="padding:5px;display:flex;justify-content:space-between;" id="ctrl">
        <b>Eolink Parser v${version}</b><span id="min" style="cursor:pointer;">[-]</span>
      </div>
      <div id="main">
        <div id="tabs" style="display:flex;overflow-x:auto;border-bottom:1px solid #ccc"></div>
        <div style="padding: 2px;">
          <textarea id="content" style="height:100px; margin-bottom:2px; display: block;width: 100%;font-family: consolas, monospace; font-size: 12px; color: green;"></textarea>
          <button id="dl">Download ts</button>
          <button id="dl-json">Download json</button>
        </div>
      </div>`;
      document.body.appendChild(panelEl);

      const main = panelEl.querySelector('#main');
      panelEl.querySelector('#min').onclick = () => {
        const isH = main.style.display === 'none';
        main.style.display = isH ? 'block' : 'none';
        panelEl.querySelector('#min').innerText = isH ? '[-]' : '[+]';
      };

      const download = (content, fileName) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const a = Object.assign(document.createElement('a'), {
          href: URL.createObjectURL(blob),
          download: fileName
        });
        a.click();
      }

      panelEl.querySelector('#dl').onclick = () => {
        download(panelData[panelActive].ts, `${panelActive}.ts`)
      };
      panelEl.querySelector('#dl-json').onclick = () => {
        download(panelData[panelActive].json, `${panelActive}.json`)
      };
    }

    const tab = document.createElement('div');
    tab.style.border = 'none';
    tab.style.cursor = 'pointer';
    tab.style.width = '100px';
    tab.style.flexShrink = 0
    tab.style.overflow = 'hidden';
    tab.style.textOverflow = 'ellipsis';
    tab.style.whiteSpace = 'nowrap';
    tab.title = k;
    tab.style.fontSize = '12px';
    tab.innerText = k;
    tab.onclick = () => {
      panelActive = k;
      panelEl.querySelector('#content').value = v.ts;
      [...panelEl.querySelector('#tabs').children].forEach(b => b.style.background = b === tab ? '#ddd' : '#f0f0f0');
    };

    // 创建一个x关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '12px';
    closeBtn.style.padding = '0 4px';
    closeBtn.style.color = 'red';
    closeBtn.innerText = '×';
    closeBtn.onclick = (event) => {
      // 阻止事件冒泡
      event.stopPropagation();
      tab.remove();
      delete panelData[k];
      if (panelActive === k) panelActive = null;
      if (panelEl.querySelector('#tabs').children.length === 0) {
        panelEl.querySelector('#content').value = '';
      }
    };
    // 放在tab第一个子元素
    tab.insertBefore(closeBtn, tab.firstChild);

    panelEl.querySelector('#tabs').appendChild(tab);

    if (Object.keys(panelData).length === 1) tab.click();
    return true;
  };


  // store ------ END



  // parser.ts ------ START

  // parser.ts
  var ParamTypeMap = {
    "0": "string",
    "1": "File",
    "2": "string",
    "3": "number",
    "4": "number",
    "5": "number",
    "6": "string",
    "7": "string",
    "8": "boolean",
    "9": "string",
    "10": "number",
    "11": "number",
    "12": "string[]",
    "13": "Record<string, any>",
    "14": "number",
    "15": "null",
    char: "string"
  };
  var RequestTypeMap = { 0: "POST", 1: "GET", 2: "PUT", 3: "DELETE", 4: "HEAD", 5: "OPTIONS", 6: "PATCH" };
  var LocalStorageKeys;
  ((LocalStorageKeys2) => {
    LocalStorageKeys2["FunTempList"] = "FunTempList";
    LocalStorageKeys2["DefaultFunKey"] = "DefaultFunKey";
    LocalStorageKeys2["FunNameGeneratorList"] = "FunNameGeneratorList";
    LocalStorageKeys2["DefaultFunNameGeneratorKey"] = "DefaultFunNameGeneratorKey";
  })(LocalStorageKeys ||= {});
  var InterfaceType = {
    "12": true,
    "13": true
  };
  function parseEoLinkApiInfo(data) {
    const { baseInfo, requestInfo, resultInfo, resultParamJsonType } = data;
    const { apiRequestParamJsonType } = baseInfo;
    const method = RequestTypeMap[baseInfo.apiRequestType] || "GET";
    const url = baseInfo.apiURI;
    const name = baseInfo.apiName;
    const generateComment = (item, indent) => {
      const comments = [];
      if (item.paramName) {
        let name2 = item.paramName;
        if (item.paramMock && !/^@/.test(item.paramMock)) {
          name2 += ` (${item.paramMock})`;
        }
        if (item.paramValue) {
          name2 += ` (${item.paramValue})`;
        }
        if (item.minValue || item.maxValue) {
          name2 += ` (minmax: ${item.minValue} - ${item.maxValue})`;
        }
        comments.push(name2);
      }
      if (item.paramValueList) {
        const list = Array.isArray(item.paramValueList) ? item.paramValueList : [item.paramValueList];
        if (list.length > 0) {
          comments.push("枚举值:");
          list.forEach((val) => {
            const desc = val.valueDescription ? ` (${val.valueDescription})` : "";
            comments.push(`  - ${val.value}${desc}`);
          });
        }
      }
      if (comments.length === 0)
        return "";
      if (comments.length === 1) {
        return `${indent}// ${comments[0]}
`;
      }
      return `${indent}/**
${comments.map((c) => `${indent} * ${c}`).join(`
`)}
${indent} */
`;
    };
    const formatParamKey = (key) => {
      key = key.trim();
      const illegalCharRegex = /[^\w]/g;
      if (illegalCharRegex.test(key)) {
        console.warn(`字符串 "${key}" 包含非法字符，将自动替换为下划线！`);
        return key.replace(illegalCharRegex, "_");
      }
      return key;
    };
    const generateTypeStructure = (params, indent = "  ") => {
      if (!params || params.length === 0)
        return "";
      return params.map((item) => {
        const isOptional = item.paramNotNull === "1";
        let typeStr = ParamTypeMap[item.paramType] || "any";
        if (item.childList && item.childList.length > 0) {
          const childrenContent = generateTypeStructure(item.childList, indent + "  ");
          if (item.paramType === "12") {
            typeStr = `Array<
${childrenContent}${indent}
${indent}>`;
          } else {
            typeStr = `{
${childrenContent}${indent}
${indent}}`;
          }
        }
        const commentBlock = generateComment(item, indent);
        if (item.paramKey === "item[0]") {
          return `${commentBlock}${indent}${typeStr}`;
        }
        return `${commentBlock}${indent}${formatParamKey(item.paramKey)}${isOptional ? "?" : ""}: ${typeStr}`;
      }).join(`
`);
    };
    const wrapWithRootType = (content, jsonType, interfaceName) => {
      if (!content)
        return `export type ${interfaceName} = any`;
      return jsonType === 1 ? `export type ${interfaceName} = {
${content}
}[]` : `export interface ${interfaceName} {
${content}
}`;
    };
    const requestTypeStr = wrapWithRootType(generateTypeStructure(requestInfo), apiRequestParamJsonType, "RequestParams");
    const defaultResult = resultInfo.find((r) => r.isDefault === 1) || resultInfo[0];
    const responseTypeStr = wrapWithRootType(generateTypeStructure(defaultResult?.paramList || []), resultParamJsonType, "ResponseData");
    return {
      info: { method, url, name },
      typescript: {
        request: requestTypeStr,
        response: responseTypeStr,
        full: `/**
 * @name ${name}
 * @route ${method} ${url}
 */

${requestTypeStr}

${responseTypeStr}`
      }
    };
  }

  // parser.ts ------ END

  console.log(`%c[Eolink Parser] v${version} 初始化完成`, 'background: #222; color: #bada55; padding: 2px 5px;');
})();