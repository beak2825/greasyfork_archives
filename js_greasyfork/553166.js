// ==UserScript==
// @name         Generate TS Interface
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Auto-expand YApi interface and generate TS interface with fixed button
// @author       ihopeful
// @match        *://*/project/*/interface/api/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553166/Generate%20TS%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/553166/Generate%20TS%20Interface.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const typeMap = {
    string: 'string',
    number: 'number',
    integer: 'number',
    boolean: 'boolean',
    object: 'Record<string, any>',
    'object []': 'Record<string, any>[]',
    array: 'any[]'
  };

  const toTsType = t => {
    if (!t) return 'any';
    const lower = t.toLowerCase();
    if (lower.includes('array')) return 'any[]';
    if (lower.includes('object')) return 'Record<string, any>';
    return typeMap[lower] || 'any';
  };

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
  let anonCount = 1;
  let interfaces = [];

  function safeInterfaceName(name, parentName) {
    let base = name ? capitalize(name.replace(/List$/, '')) : `${parentName.replace(/^I/, '')}DTO`;
    let interfaceName = 'I' + base;
    if (interfaces.some(i => i.startsWith(`interface ${interfaceName} `))) {
      interfaceName += anonCount++;
    }
    return interfaceName;
  }

  /** 递归展开所有折叠行 */
  function expandAllNow() {
    const icons = Array.from(document.querySelectorAll('span.ant-table-row-expand-icon'))
      .filter(el => el.classList.contains('ant-table-row-collapsed'));

    icons.forEach(icon => {
      icon.scrollIntoView();
      icon.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });

    if (document.querySelectorAll('span.ant-table-row-expand-icon.ant-table-row-collapsed').length > 0) {
      requestAnimationFrame(expandAllNow);
    }
  }

  /** 解析请求参数 */
  function parseRequest(prefix) {
    const rows = document.querySelectorAll('.colQuery table tbody tr');
    if (!rows.length) return null;
    const props = Array.from(rows).map(tr => {
      const tds = tr.querySelectorAll('td');
      const name = tds[0]?.innerText.trim();
      const required = (tds[1]?.innerText || '').includes('是');
      const comment = tds[3]?.innerText.trim() || name;
      return `  /** ${comment} */\n  ${name}${required ? '' : '?'}: string | number;`;
    });
    return `interface ${prefix}RequestQuery {\n${props.join('\n')}\n}`;
  }

  /** 解析响应参数 */
  function parseResponse(prefix) {
    const rows = document.querySelectorAll('h2.interface-title + div table tbody tr');
    if (!rows.length) return null;

    const root = { name: 'Response', children: [] };
    const stack = [root];

    Array.from(rows).forEach(tr => {
      const levelClass = Array.from(tr.classList).find(c => c.includes('ant-table-row-level-'));
      const level = levelClass ? parseInt(levelClass.split('-').pop(), 10) : 0;
      const tds = tr.querySelectorAll('td');
      const name = tds[0]?.innerText.trim();
      const typeRaw = tds[1]?.innerText.trim();
      const required = (tds[2]?.innerText || '').includes('必须');
      const comment = tds[4]?.innerText.trim() || name;
      const node = { name, type: toTsType(typeRaw), required, comment, children: [], rawType: typeRaw || '' };
      while (stack.length > level + 1) stack.pop();
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    });

    function genInterface(nodes, parentName, rootPrefix = parentName.replace(/^I/, '')) {
      let res = '';
      nodes.forEach(n => {
        const pad = '  ';
        const comment = `/** ${n.comment || ''} */\n`;
        const isArray = n.rawType.includes('[]');
        const hasChildren = n.children.length > 0;

        if (hasChildren) {
          if (isArray && n.children.length === 1 && (!n.children[0].name || n.children[0].name === '')) {
            const child = n.children[0];
            const dtoName = `I${rootPrefix}${capitalize(n.name.replace(/List$/, ''))}DTO`;
            interfaces.push(`interface ${dtoName} {\n${genInterface(child.children, dtoName, rootPrefix)}\n}`);
            n.type = `${dtoName}[]`;
            res += `${pad}${comment}${n.name}${n.required ? '' : '?'}: ${n.type};\n`;
          } else {
            const interfaceName = `I${rootPrefix}${capitalize(n.name.replace(/List$/, ''))}`;
            interfaces.push(`interface ${interfaceName} {\n${genInterface(n.children, interfaceName, rootPrefix)}\n}`);
            n.type = interfaceName + (isArray ? '[]' : '');
            res += `${pad}${comment}${n.name}${n.required ? '' : '?'}: ${n.type};\n`;
          }
        } else {
          res += `${pad}${comment}${n.name}${n.required ? '' : '?'}: ${n.type};\n`;
        }
      });
      return res.trim();
    }

    interfaces.push(`interface ${prefix}Response {\n${genInterface(root.children, prefix)}\n}`);
    return interfaces.join('\n\n');
  }

  function parseInterfaceName() {
    const nameEl = document.querySelector('.panel-view .colName');
    return nameEl?.innerText.trim() || '接口名称';
  }

  function parseApiUrl() {
    const urlEl = document.querySelector('.panel-view .colValue .colValue:nth-child(2)');
    if (!urlEl) return { method: 'get', url: '' };
    const method = urlEl.previousElementSibling?.innerText.toLowerCase() || 'get';
    let url = urlEl.innerText.trim();
    url = url.replace(/^\/admin/, '');
    return { method, url };
  }

  function genFuncName(url) {
    return url.split('/').filter(Boolean).map((s, i) => i === 0 ? s.toLowerCase() : capitalize(s)).join('');
  }

  /** 生成 TS */
  function generateInterface() {
    const apiName = parseInterfaceName();
    const { method, url } = parseApiUrl();
    const funcName = genFuncName(url);
    const prefix = 'I' + capitalize(funcName);

    const req = parseRequest(prefix);
    const res = parseResponse(prefix);
    if (!res) return;
    const paramsStr = req ? `params: ${prefix}RequestQuery` : 'params?: Record<string, any>';

    const fullFunc = `
/**
 * ${apiName}
 */
export async function ${funcName}(${paramsStr}): Promise<${prefix}Response> {
  return await ${method}(\`${url}\`, ${req ? 'params' : 'params'});
}
`;

    const simpleFunc = `
/**
 * ${apiName}
 */
export function get${capitalize(funcName)}(${paramsStr}) {
  return request<${prefix}Data>("${method}", \`${url}\`, params)
}
`;

    const result = [req, res, fullFunc, simpleFunc].filter(Boolean).join('\n\n');

    const panelView = document.querySelector('.panel-view');
    if (panelView) {
      let pre = document.getElementById('ts-interface-generate');
      if (!pre) {
        pre = document.createElement('pre');
        pre.id = 'ts-interface-generate';
        pre.style = 'display:none;background:#f0f0f0;padding:10px;border-radius:6px;margin:10px 0;white-space:pre-wrap;position:relative;z-index:999;';
        panelView.parentNode.insertBefore(pre, panelView.nextSibling);
      }
      pre.textContent = result;
    }
  }

  /** 添加固定按钮 */
  function addFixedButton() {
    const btn = document.createElement('div');
    btn.textContent = 'Generate TS Interface';
    btn.style = `
      position: fixed;
      top: 80px;
      right: 20px;
      background:#1890ff;
      color:#fff;
      padding:6px 12px;
      border-radius:4px;
      cursor:pointer;
      z-index:9999;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    `;
    btn.onclick = () => {
      expandAllNow();        // 立即展开折叠行
      generateInterface();   // 立即生成 TS
      const pre = document.getElementById('ts-interface-generate');
      if (pre) pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
    };
    document.body.appendChild(btn);
  }

  // 页面加载 1.5 秒后先展开所有折叠行
  setTimeout(expandAllNow, 1500);
  setTimeout(addFixedButton, 1500);
})();