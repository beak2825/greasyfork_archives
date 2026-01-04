// ==UserScript==
// @name         SEO 站长助手（快捷脚本）
// @namespace    https://yestool.org
// @version      1.0.0
// @description  在任意页面右侧浮动一个快捷脚本启动器，一键把当前域名丢到 Ahrefs/Similarweb/Google 等工具；支持自定义脚本列表（JSON 管理）。
// @author       https://github.com/yestool
// @license MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549035/SEO%20%E7%AB%99%E9%95%BF%E5%8A%A9%E6%89%8B%EF%BC%88%E5%BF%AB%E6%8D%B7%E8%84%9A%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549035/SEO%20%E7%AB%99%E9%95%BF%E5%8A%A9%E6%89%8B%EF%BC%88%E5%BF%AB%E6%8D%B7%E8%84%9A%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ---------- Utilities ----------
  const SKEY = 'qs_scripts_v1';
  const HKEY = 'qs_hidden_v1';

  // 简易 eTLD+1 近似：常见多段后缀覆盖，其他场景回退为最后两段
  const multiPartTLD = new Set([
    'co.uk','org.uk','ac.uk','gov.uk','co.jp','ne.jp','or.jp','com.au','net.au','org.au','co.nz','org.nz','com.br','com.cn','net.cn','org.cn','gov.cn','edu.cn','com.hk','com.sg'
  ]);
  function getDomain(hostname) {
    hostname = (hostname || location.hostname || '').toLowerCase();
    if (!hostname) return '';
    const parts = hostname.split('.');
    if (parts.length <= 2) return hostname;
    const last2 = parts.slice(-2).join('.');
    const last3 = parts.slice(-3).join('.');
    if (multiPartTLD.has(last2)) {
      // xxx.co.uk 场景 -> 取最后三段
      return parts.slice(-3).join('.');
    }
    if (multiPartTLD.has(last3)) {
      // 极少见更长多段，兜底
      return parts.slice(-4).join('.');
    }
    // 普通：取最后两段
    return last2;
  }

  function openTab(url, active = true) {
    try {
      GM_openInTab(url, { active, insert: true });
    } catch (e) {
      window.open(url, '_blank');
    }
  }

  function $(sel, root=document) { return root.querySelector(sel); }

  // 读取/初始化脚本定义
  function defaultScripts() {
    return [
      {
        name: "Ahrefs Backlink",
        type: "func",
        desc: "Ahrefs Backlink查询",
        code: `
          var domain = window.location.hostname;
          var ahrefsUrl = 'https://ahrefs.com/backlink-checker?input=' + encodeURIComponent(domain) + '&mode=subdomains';
          window.open(ahrefsUrl, '_blank');
        `
      },
      {
        name: "Ahrefs Site Explorer（domain）",
        type: "urlTemplate",
        desc: "用当前域名打开 Ahrefs Site Explorer（需已登录）",
        urlTemplate: "https://app.ahrefs.com/site-explorer/overview/v2/subdomains/live?target={domain}"
      },
      {
        name: "Google site:（domain）",
        type: "urlTemplate",
        desc: "快速 site: 当前域名",
        urlTemplate: "https://www.google.com/search?q=site%3A{domain}"
      },
      {
        name: "Similarweb ",
        type: "urlTemplate",
        desc: "查看 Similarweb 站点画像（需已登录）",
        urlTemplate: "https://pro.similarweb.com/#/digitalsuite/websiteanalysis/overview/website-performance/*/999/1m?webSource=Total&key={domain}"
      },
      {
        name: "Ahrefs Keyword Difficulty",
        type: "func",
        desc: "Ahrefs KD值查询（仅Google搜索页有效）",
        code: `
          var kw=document.querySelector('textarea[name=q]').value;
          var ahrefsUrl = 'https://ahrefs.com/keyword-difficulty/?country=us&input=' + encodeURIComponent(kw);
          window.open(ahrefsUrl, '_blank');
        `
      }
    ];
  }

  function readScripts() {
    let scripts = GM_getValue(SKEY, null);
    if (!scripts || !Array.isArray(scripts) || scripts.length === 0) {
      scripts = defaultScripts();
      GM_setValue(SKEY, scripts);
    }
    return scripts;
  }

  function saveScripts(scripts) {
    if (!Array.isArray(scripts)) return;
    GM_setValue(SKEY, scripts);
  }

  // ---------- UI ----------
  // 用 Shadow DOM 隔离样式，避免被站点 CSS 污染
  const host = document.createElement('div');
  host.id = 'qs-launcher-host';
  document.documentElement.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    .qs-wrap{ position: fixed; top: 35%; right: 12px; z-index: 2147483647; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;}
    .qs-btn{ width: 44px; height: 44px; border-radius: 50%; background: #111; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,.25); transition:.2s; }
    .qs-btn:hover{ transform: translateY(-1px); }
    .qs-hide{ display:none !important; }

    .qs-panel{ position: fixed; top: 20%; right: 70px; width: 320px; max-height: 60vh; overflow:auto; background:#fff; color:#111; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,.15); }
    .qs-header{ display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid #eee; position:sticky; top:0; background:#fff; z-index:1;}
    .qs-title{ font-weight:600; font-size:14px;}
    .qs-actions button{ margin-left:8px; font-size:12px; padding:4px 8px; border:1px solid #e5e7eb; background:#f8fafc; border-radius:8px; cursor:pointer;}
    .qs-actions button:hover{ background:#eef2f7;}
    .qs-list{ padding:8px; }
    .qs-item{ display:flex; flex-direction:column; padding:8px; border-radius:10px; border:1px solid #f1f5f9; margin-bottom:8px; }
    .qs-item h4{ margin:0 0 6px 0; font-size:14px; }
    .qs-item p{ margin:0 0 8px 0; font-size:12px; color:#475569;}
    .qs-run{ align-self:flex-start; padding:6px 10px; border-radius:8px; border:1px solid #e5e7eb; background:#111; color:#fff; cursor:pointer; font-size:12px;}
    .qs-run:hover{ filter:brightness(1.05); }
    .qs-empty{ padding:16px; color:#64748b; font-size:13px; }
    .qs-close{ position:absolute; top:6px; right:8px; background:transparent; border:none; font-size:18px; cursor:pointer; color:#333;}
    .qs-toggle{ margin-left:8px; font-size:12px; padding:4px 8px; border:1px solid #e5e7eb; background:#fff; border-radius:8px; cursor:pointer;}
  `;

  const wrap = document.createElement('div');
  wrap.className = 'qs-wrap';

  const btn = document.createElement('div');
  btn.className = 'qs-btn';
  btn.title = '快捷脚本';
  btn.textContent = '⚡';

  const panel = document.createElement('div');
  panel.className = 'qs-panel qs-hide';
  panel.innerHTML = `
    <div class="qs-header">
      <div class="qs-title">快捷脚本</div>
      <div class="qs-actions">
        <button class="qs-manage" title="管理脚本（JSON）">⚙ 管理</button>
        <button class="qs-hidebtn" title="隐藏浮标">🙈 隐藏</button>
      </div>
      <button class="qs-close" title="关闭面板">×</button>
    </div>
    <div class="qs-list"></div>
  `;

  shadow.append(style, wrap);
  wrap.append(btn, panel);

  // 记住隐藏状态
  const hidden = GM_getValue(HKEY, false);
  if (hidden) wrap.classList.add('qs-hide');

  // 列表渲染
  function renderList() {
    const list = $('.qs-list', shadow);
    list.innerHTML = '';
    const scripts = readScripts();
    if (!scripts.length) {
      const div = document.createElement('div');
      div.className = 'qs-empty';
      div.textContent = '暂无脚本，点右上角 “⚙ 管理” 添加。';
      list.appendChild(div);
      return;
    }
    const ctx = buildContext();
    scripts.forEach((s, idx) => {
      const item = document.createElement('div');
      item.className = 'qs-item';
      const h4 = document.createElement('h4');
      h4.textContent = s.name || `脚本 #${idx+1}`;
      const p = document.createElement('p');
      p.textContent = s.desc || '';
      const run = document.createElement('button');
      run.className = 'qs-run';
      run.textContent = '执行';
      run.addEventListener('click', () => runScript(s, ctx));
      item.append(h4, p, run);
      list.appendChild(item);
    });
  }

  // 上下文对象
  function buildContext() {
    const hostname = location.hostname;
    const domain = getDomain(hostname);
    const selection = String(window.getSelection ? (window.getSelection()+'') : '') || '';
    const title = document.title || '';
    const url = location.href;
    return { hostname, domain, selection, title, url };
  }

  // 执行器：两类——urlTemplate / func（字符串函数体）
  function runScript(s, ctx) {
    try {
      if (s.type === 'urlTemplate' && s.urlTemplate) {
        const finalUrl = s.urlTemplate
          .replaceAll('{domain}', encodeURIComponent(ctx.domain))
          .replaceAll('{hostname}', encodeURIComponent(ctx.hostname))
          .replaceAll('{url}', encodeURIComponent(ctx.url))
          .replaceAll('{title}', encodeURIComponent(ctx.title))
          .replaceAll('{selection}', encodeURIComponent(ctx.selection));
        if (!finalUrl || !/^https?:\/\//i.test(finalUrl)) {
          alert('URL 模板无效');
          return;
        }
        openTab(finalUrl, true);
        return;
      }
      if (s.type === 'func' && s.code) {
        // 在 userscript 沙箱中执行，可直接操作 DOM
        const fn = new Function(s.code);
        fn.call(window);
        return;
      }
      alert('未知脚本类型或缺少必要字段。');
    } catch (e) {
      console.error('[Quick Scripts] 执行出错：', e);
      alert('脚本执行失败：' + e.message);
    }
  }

  // 事件绑定
  btn.addEventListener('click', () => {
    panel.classList.toggle('qs-hide');
    if (!panel.classList.contains('qs-hide')) renderList();
  });
  panel.querySelector('.qs-close').addEventListener('click', () => {
    panel.classList.add('qs-hide');
  });
  panel.querySelector('.qs-hidebtn').addEventListener('click', () => {
    wrap.classList.add('qs-hide');
    GM_setValue(HKEY, true);
  });
  panel.querySelector('.qs-manage').addEventListener('click', () => {
    const current = JSON.stringify(readScripts(), null, 2);
    const next = prompt(
      '以 JSON 数组形式编辑脚本：\n' +
      '支持两种类型：\n' +
      '1) { "name":"xxx", "type":"urlTemplate", "desc":"...", "urlTemplate":"https://...{domain}..." }\n' +
      '2) { "name":"xxx", "type":"func", "desc":"...", "code":"/* JS 函数体，可用 document.querySelector 等 */" }\n\n' +
      '当前：',
      current
    );
    if (next == null) return;
    try {
      const parsed = JSON.parse(next);
      if (!Array.isArray(parsed)) throw new Error('必须是数组');
      saveScripts(parsed);
      alert('已保存。');
      renderList();
    } catch (e) {
      alert('JSON 解析失败：' + e.message);
    }
  });

  // 在页面左下角加一个“显示浮标”的极简入口（当你把浮标隐藏后）
  function addRestoreBtn() {
    if ($('#qs-restore', shadow)) return;
    const r = document.createElement('button');
    r.id = 'qs-restore';
    r.textContent = '⚡';
    r.title = '显示快捷脚本浮标';
    r.style.position = 'fixed';
    r.style.left = '10px';
    r.style.bottom = '10px';
    r.style.zIndex = '2147483647';
    r.style.width = '36px';
    r.style.height = '36px';
    r.style.borderRadius = '50%';
    r.style.border = '1px solid #e5e7eb';
    r.style.background = '#fff';
    r.style.cursor = 'pointer';
    r.addEventListener('click', () => {
      wrap.classList.remove('qs-hide');
      GM_setValue(HKEY, false);
      r.remove();
    });
    shadow.appendChild(r);
  }
  if (hidden) addRestoreBtn();

})();
