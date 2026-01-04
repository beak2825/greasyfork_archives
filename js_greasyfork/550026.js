// ==UserScript==
// @name         Dexscreener & DeBank Helper
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  1) 在 Dexscreener 的 Address 表头旁添加 DeBank 图标，点击跳转到 #1 持币地址的 DeBank Profile；2) 在 DeBank Profile 页面将形如 #数字 的元素变为可点击，跳转 PancakeSwap 流动性页面；3) 在 DeBank Profile 页面添加复制按钮，一键复制所有流动池ID数字。
// @author       dami16z
// @match        https://dexscreener.com/bsc/*
// @match        https://debank.com/profile*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550026/Dexscreener%20%20DeBank%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/550026/Dexscreener%20%20DeBank%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 常量
  const ICON_URL = 'https://assets.debank.com/favicon.ico';
  const DEBANK_BASE = 'https://debank.com/profile/';
  const PANCAKE_LP_BASE = 'https://pancakeswap.finance/liquidity/';

  // 站点判断
  function isOnDexScreener() {
    return location.hostname.includes('dexscreener.com');
  }
  function isOnDebankProfile() {
    return location.hostname.includes('debank.com') && location.pathname.startsWith('/profile');
  }

  // -----------------------------
  // Part 1: Dexscreener 逻辑
  // -----------------------------

  // 安装图标到“Address”表头
  function installIconIfNeeded() {
    const header = findHoldersAddressHeader();
    if (!header) return;
    if (header.dataset.debankInjected === '1') return;

    const icon = createIcon();
    header.appendChild(icon);
    header.dataset.debankInjected = '1';
  }

  // 寻找“Address”表头（尽量找到与 #1 行同区块的那个）
  function findHoldersAddressHeader() {
    const addressSpans = Array.from(document.querySelectorAll('span'))
      .filter((el) => el.textContent && el.textContent.trim() === 'Address');

    if (addressSpans.length === 0) return null;

    const top1Badge = findTop1Badge();
    if (top1Badge) {
      let cur = top1Badge;
      for (let i = 0; i < 8 && cur; i++) {
        cur = cur.parentElement;
        if (!cur) break;
        const near = Array.from(cur.querySelectorAll('span')).find(
          (el) => el.textContent && el.textContent.trim() === 'Address'
        );
        if (near) {
          return near;
        }
      }
    }

    // 退化选择：第一个可见的 Address
    return addressSpans[0] || null;
  }

  function createIcon() {
    const img = document.createElement('img');
    img.src = ICON_URL;
    img.alt = 'Open in DeBank';
    img.title = '在 DeBank 打开 #1 持币地址';
    img.style.cssText =
      'width:16px;height:16px;margin-left:8px;vertical-align:middle;cursor:pointer;opacity:0.85;';
    img.addEventListener('mouseenter', () => (img.style.opacity = '1'));
    img.addEventListener('mouseleave', () => (img.style.opacity = '0.85'));
    img.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const addr = await resolveTop1Address();
      if (addr) {
        window.open(DEBANK_BASE + addr, '_blank', 'noopener,noreferrer');
      } else {
        alert('未找到 #1 地址，请确保“Top holders/持仓列表”已加载。');
      }
    });
    return img;
  }

  // 找到 '#1' 标记
  function findTop1Badge() {
    const spans = Array.from(document.querySelectorAll('span'));
    return spans.find((el) => el.textContent && el.textContent.trim() === '#1') || null;
  }

  // 找到 '#1' 所在的行容器
  function findTop1Row() {
    const badge = findTop1Badge();
    if (!badge) return null;
    let node = badge;
    for (let i = 0; i < 8 && node; i++) {
      node = node.parentElement;
      if (!node) break;
      if (
        node.querySelector('a[href*="bscscan.com/address/"]') ||
        node.querySelector('button') ||
        node.querySelector('a[aria-label*="block"]')
      ) {
        return node;
      }
    }
    return badge.parentElement || null;
  }

  // 从行容器中解析地址（优先从区块浏览器链接）
  function extractAddressFromRow(row) {
    // 1) 从 bscscan 链接解析（最稳）
    const a = row.querySelector('a[href*="bscscan.com/address/"]');
    if (a && a.href) {
      const m = a.href.match(/address\/(0x[a-fA-F0-9]{40})/);
      if (m) return m[1];
    }
    // 2) 从任意属性中找 0x 地址
    const attrAddr = findAddressInAttributes(row);
    if (attrAddr) return attrAddr;
    return null;
  }

  // 兜底：搜寻元素属性上的完整地址
  function findAddressInAttributes(root) {
    const nodes = [root, ...root.querySelectorAll('*')];
    for (const el of nodes) {
      const names = el.getAttributeNames ? el.getAttributeNames() : [];
      for (const name of names) {
        const val = el.getAttribute(name);
        if (!val) continue;
        const m = val.match(/0x[a-fA-F0-9]{40}/);
        if (m) return m[0];
      }
    }
    return null;
  }

  // 解析 #1 地址：链接解析 -> 复制按钮 -> 属性兜底
  async function resolveTop1Address() {
    const row = findTop1Row();
    if (!row) return null;

    // A. 直接从区块浏览器链接解析
    const fromLink = extractAddressFromRow(row);
    if (fromLink) return fromLink;

    // B. 尝试点击按钮复制，再从剪贴板读取
    const truncatedBtn = row.querySelector('button');
    if (truncatedBtn) {
      try {
        truncatedBtn.click();
        // 等待站点完成复制
        await delay(120);
        const clipText = await navigator.clipboard.readText();
        const m = clipText && clipText.match(/0x[a-fA-F0-9]{40}/);
        if (m) return m[0];
      } catch (e) {
        // ignore
      }
    }

    // C. 兜底：再尝试属性
    const fallback = findAddressInAttributes(row);
    if (fallback) return fallback;

    return null;
  }

  function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // -----------------------------
  // Part 2: DeBank Profile 逻辑
  // -----------------------------

  // 将类似 "#2852078" 的叶子文本节点变为可点击，跳往 PancakeSwap 流动性页
  function makeHashIdsClickable(root = document) {
    const candidates = root.querySelectorAll('span,div,a');
    candidates.forEach((el) => {
      if (el.dataset.psLink === '1') return;
      if (el.childElementCount > 0) return;

      const text = (el.textContent || '').trim();
      const m = text.match(/^#(\d{3,})$/); // 至少3位数字，避免误命中其他 #1 之类标签
      if (!m) return;

      const id = m[1];
      el.dataset.psLink = '1';
      el.title = `在 PancakeSwap 打开流动性 ${id}`;
      el.style.cursor = 'pointer';
      if (!el.style.textDecoration) {
        el.style.textDecoration = 'underline dotted';
      }

      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(PANCAKE_LP_BASE + id, '_blank', 'noopener,noreferrer');
      });
    });
  }

  // 提取页面中所有的流动池ID数字
  function extractAllPoolIds() {
    const ids = [];
    const candidates = document.querySelectorAll('span,div,a');
    
    candidates.forEach((el) => {
      if (el.childElementCount > 0) return;
      const text = (el.textContent || '').trim();
      const m = text.match(/^#(\d{3,})$/);
      if (m) {
        const id = m[1];
        if (!ids.includes(id)) {
          ids.push(id);
        }
      }
    });
    
    return ids.sort((a, b) => parseInt(b) - parseInt(a)); // 按数字大小降序排列
  }

  // 创建复制按钮
  function createCopyButton() {
    const button = document.createElement('button');
    button.textContent = '复制流动池ID';
    button.title = '复制页面中所有流动池ID数字';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 8px 16px;
      background: #1890ff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    `;

    // 悬停效果
    button.addEventListener('mouseenter', () => {
      button.style.background = '#40a9ff';
      button.style.transform = 'translateY(-1px)';
      button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = '#1890ff';
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    });

    // 点击复制功能
    button.addEventListener('click', async () => {
      try {
        const ids = extractAllPoolIds();
        if (ids.length === 0) {
          button.textContent = '未找到ID';
          button.style.background = '#ff4d4f';
          setTimeout(() => {
            button.textContent = '复制流动池ID';
            button.style.background = '#1890ff';
          }, 2000);
          return;
        }

        const idsText = ids.join('\n');
        await navigator.clipboard.writeText(idsText);
        
        // 显示成功反馈
        const originalText = button.textContent;
        button.textContent = `已复制 ${ids.length} 个ID`;
        button.style.background = '#52c41a';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '#1890ff';
        }, 2000);

        console.log('已复制流动池ID:', ids);
      } catch (err) {
        console.error('复制失败:', err);
        button.textContent = '复制失败';
        button.style.background = '#ff4d4f';
        setTimeout(() => {
          button.textContent = '复制流动池ID';
          button.style.background = '#1890ff';
        }, 2000);
      }
    });

    return button;
  }

  // 安装复制按钮
  function installCopyButtonIfNeeded() {
    if (document.querySelector('#pool-ids-copy-btn')) return;
    
    const button = createCopyButton();
    button.id = 'pool-ids-copy-btn';
    document.body.appendChild(button);
  }

  // -----------------------------
  // 初始化（按站点分别处理）
  // -----------------------------
  if (isOnDexScreener()) {
    const moDex = new MutationObserver(() => {
      installIconIfNeeded();
    });
    moDex.observe(document.documentElement, { childList: true, subtree: true });
    installIconIfNeeded();
    setTimeout(installIconIfNeeded, 800);
  } else if (isOnDebankProfile()) {
    const moDebank = new MutationObserver(() => {
      makeHashIdsClickable(document);
      installCopyButtonIfNeeded();
    });
    moDebank.observe(document.documentElement, { childList: true, subtree: true });
    makeHashIdsClickable(document);
    installCopyButtonIfNeeded();
    setTimeout(installCopyButtonIfNeeded, 800);
  }
})();