// ==UserScript==
// @name         我堡不可说自动查重
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @author       guyuanwind
// @description  我堡不可说站点严格查重
// @match        *://*/details.php*
// @match        https://*.m-team.cc/detail/*
// @match        https://*.m-team.io/detail/*
// @match        https://*.m-team.vip/detail/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *.m-team.cc
// @connect      *.m-team.io
// @connect      *.m-team.vip
// @connect      ourbits.club
// @connect      springsunday.net
// @run-at       document-idle
// @license      GPL-3.0
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/551622/%E6%88%91%E5%A0%A1%E4%B8%8D%E5%8F%AF%E8%AF%B4%E8%87%AA%E5%8A%A8%E6%9F%A5%E9%87%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/551622/%E6%88%91%E5%A0%A1%E4%B8%8D%E5%8F%AF%E8%AF%B4%E8%87%AA%E5%8A%A8%E6%9F%A5%E9%87%8D.meta.js
// ==/UserScript==


/* eslint-env browser */
(function () {
  'use strict';

  // GM 别名
  const GMxhr = GM_xmlhttpRequest;
  const GMset = GM_setValue;
  const GMget = GM_getValue;

  // =================================================================
  // ==================== 站点禁止规则配置 =======================
  // =================================================================
  const BANNED_RESOURCES_RULES = {
    nvme: { // "不可说"
      generalGroups: [ 'fgt', 'nsbc', 'batweb', 'gpthd', 'dreamhd', 'blacktv', 'catweb', 'xiaomi', 'huawei', 'momoweb', 'ddhdtv', 'seeweb', 'tagweb', 'sonyhd', 'minihd', 'bitstv', 'ctrlhd', 'alt', 'nukehd', 'zerotv', 'hottv', 'enttv', 'gamehd', 'parkhd', 'xunlei', 'bestweb', 'tbmaxub', 'smy', 'seehd', 'verypsp', 'dwr', 'xlmv', 'xjctv', 'mp4ba', '13city', 'goddramas', 'toothless', 'ytsmx', 'frds', 'beitai', 'vcb', 'ubits', 'ubweb' ],
      partialGroups: { general: ['ying'] },
      typeSpecific: {
        encode: ['hdh', 'hds', 'eleph', 'dream', 'bmdru'],
        diy: ['hdhome', 'hdsky'],
        remux: ['dream', 'hdh', 'hds', 'dyz-movie'],
        'web-dl': ['hdh', 'hds']
      },
      bannedTypes: []
    },
    ourbits: { // "我堡"
      generalGroups: ['frds'],
      partialGroups: { general: [] },
      typeSpecific: {},
      bannedTypes: ['remux']
    }
  };

  // 工具
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const text = (el) => (el?.textContent || '').trim();

  function mergePreferRicher(items) {
    const map = new Map();
    for (const it of items) {
      const key = `${it.link}__${it.title}`;
      if (!map.has(key)) { map.set(key, it); continue; }
      const old = map.get(key);
      const oldScore = (old.subtitle || '').length + (old.tags?.length || 0) * 10;
      const newScore = (it.subtitle || '').length + (it.tags?.length || 0) * 10;
      if (newScore > oldScore) map.set(key, it);
    }
    return Array.from(map.values());
  }

  // 内置站点
  const SITES = [
    { key: 'ourbits', name: '我堡', icon: 'https://icon.xiaoge.org/images/pt/OurBits.png', baseUrl: 'https://ourbits.club' },
    { key: 'nvme', name: '不可说', icon: 'https://icon.xiaoge.org/images/pt/Nvme.png', baseUrl: 'https://springsunday.net' }
  ];
  const DOMAIN_TO_KEY = {
    'ourbits.club': 'ourbits',
    'springsunday.net': 'nvme',
    'hhanclub.top': 'hhc',
    'audiences.me': 'aud',
    // MTeam站点域名映射
    'kp.m-team.cc': 'mteam',
    'pt.m-team.cc': 'mteam',
    'tp.m-team.cc': 'mteam',
    'xp.m-team.cc': 'mteam',
    'm-team.cc': 'mteam',
    'm-team.io': 'mteam',
    'm-team.vip': 'mteam'
  };
  const SEARCH_PATH = '/torrents.php';
  const KV = {
    ENABLE_PREFIX: 'xs_enable_',
    COOKIE_PREFIX: 'xs_cookie_',
    AUTO_QUERY: 'xs_auto_query'
  };
  const DEFAULT_ENABLED = { ourbits: true, nvme: true };
  const MAX_PAGES = 5;
  const PARALLEL = 2;

  // 自动查询开关相关函数
  function getAutoQueryEnabled() {
    return GMget(KV.AUTO_QUERY, true); // 默认开启自动查询
  }

  function setAutoQueryEnabled(enabled) {
    GMset(KV.AUTO_QUERY, enabled);
  }

  function applySearchParams(u, siteKey, searchArea = '0') {
    u.searchParams.set('spstate', '0');
    u.searchParams.set('inclbookmarked', '0');
    u.searchParams.set('search_area', searchArea);
    u.searchParams.set('search_mode', '0');
    if (siteKey === 'nvme') {
      u.searchParams.set('incldead', '0');
    } else {
      u.searchParams.set('incldead', '1');
    }
  }

  if (window.__xsInjected) return;
  window.__xsInjected = true;

  // 样式
  const style = document.createElement('style');
  style.textContent = `
  .xs-panel{position:fixed;top:12px;right:12px;width:clamp(360px,45vw,600px);max-width:55vw;background:#fff;border-radius:12px;box-shadow:0 12px 36px rgba(0,0,0,.18);z-index:2147483647;border:1px solid rgba(0,0,0,.08);overflow:hidden;max-height:85vh;overflow-y:auto;display:none}
  .xs-panel.show{display:block}
  .xs-toggle-btn{position:fixed;right:16px;top:50%;transform:translateY(-50%);width:72px;height:72px;background:#111;color:#fff;border:none;border-radius:12px;cursor:pointer;z-index:2147483646;box-shadow:-2px 2px 12px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;padding:8px;transition:all 0.3s ease;overflow:hidden}
  .xs-toggle-btn img{width:100%;height:100%;object-fit:contain;border-radius:6px}
  .xs-toggle-btn:hover{background:#333;width:78px}
  .xs-toggle-btn.active{background:#4CAF50}
  .xs-head{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#111;color:#fff}
  .xs-close{background:transparent;color:#fff;border:0;font-size:18px;cursor:pointer}
  .xs-section{border-bottom:1px solid #eee}
  .xs-section .hd{padding:8px 10px;font-weight:600;background:#fafafa}
  .xs-body{padding:10px}
  .xs-sites{display:flex;flex-direction:column;gap:8px}
  .xs-site{border:1px solid #eee;border-radius:10px;padding:8px;display:grid;grid-template-columns:48px 1fr auto;gap:8px;align-items:center}
  .xs-site .logo{width:36px;height:36px;border-radius:8px;object-fit:contain;background:#fff;border:1px solid #eee}
  .xs-site .meta{display:flex;flex-direction:column;gap:3px}
  .xs-site .meta .name{font-weight:600}
  .xs-site .meta .status{font-size:12px;color:#666}
  .xs-site .ops{display:flex;gap:6px;align-items:center}
  .xs-btn{padding:5px 8px;border:0;border-radius:8px;background:#111;color:#fff;cursor:pointer;font-size:12px}
  .xs-btn.ghost{background:#666}
  .xs-cookie-input{width:100%;padding:7px 9px;border:1px solid #ddd;border-radius:8px;outline:none;font-family:monospace}
  .xs-search{display:flex;gap:6px}
  .xs-input{flex:1;padding:7px 9px;border:1px solid #ddd;border-radius:8px;outline:none}
  .xs-go{padding:7px 10px;border:0;border-radius:8px;background:#111;color:#fff;cursor:pointer}
  .xs-res{max-height:56vh;overflow:auto;padding-bottom:10px}
  .xs-msg{padding:10px;background:#f7f7f7;border:1px dashed #ddd;border-radius:8px;margin:8px 0}
  .xs-err{background:#fff5f5;border-color:#ffd0d0;color:#8a1f1f}
  .xs-group{border:1px solid #eee;border-radius:10px;margin-top:8px}
  .xs-group-hd{padding:7px 9px;background:#fafafa;font-weight:600;display:flex;align-items:center;justify-content:space-between}
  .xs-group-bd{padding:8px}
  .xs-card{padding:8px;border:1px solid #eee;border-radius:10px;margin-top:8px;word-wrap:break-word;overflow-wrap:break-word}
  .xs-title{font-weight:600;text-decoration:none;color:#111}
  .xs-sub{color:#444;margin-top:6px;line-height:1.6;white-space:pre-wrap;word-break:break-word}
  .xs-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
  .xs-tag{font-size:12px;padding:2px 6px;border-radius:999px;border:1px solid #ddd;background:#fafafa}
  details summary { cursor: pointer; font-weight: bold; margin: 4px 0; }
  .item-type { font-size: 10px; color: #fff; background-color: #28a745; padding: 2px 6px; border-radius: 4px; margin-left: 8px; vertical-align: middle; font-weight: bold; }
  .item-type.remux { background-color: #6f42c1; }
  .item-type.webdl { background-color: #007bff; }
  .item-type.diy { background-color: #fd7e14; }
  .item-type.original { background-color: #dc3545; }
  .item-type.encode { background-color: #20c997; }
  .xs-auto-setting{display:flex;flex-direction:column;gap:12px}
  .xs-switch-label{display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:600}
  .xs-switch{position:relative;display:inline-block;width:44px;height:22px}
  .xs-switch input{opacity:0;width:0;height:0}
  .xs-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ddd;border-radius:22px;transition:all 0.3s ease}
  .xs-slider:before{position:absolute;content:"";height:18px;width:18px;left:2px;top:2px;background-color:white;border-radius:50%;transition:all 0.3s ease;box-shadow:0 2px 4px rgba(0,0,0,0.2)}
  input:checked + .xs-slider{background-color:#4CAF50}
  input:checked + .xs-slider:before{transform:translateX(22px)}
  .xs-manual-btn{background:#4CAF50;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:14px;width:100%}
  .xs-manual-btn:hover{background:#45a049}
  `;
  document.documentElement.appendChild(style);

  // 创建悬浮切换按钮
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'xs-toggle-btn';
  toggleBtn.innerHTML = '<img src="https://icon.xiaoge.org/images/pt/OurBits.png" alt="查重">';
  toggleBtn.title = '查重面板';
  document.documentElement.appendChild(toggleBtn);

  const panel = document.createElement('div');
  panel.className = 'xs-panel';
  panel.innerHTML = `
    <div class="xs-head"><strong>自动查重与规则校验</strong><button class="xs-close" title="关闭">×</button></div>
    <div class="xs-section">
      <div class="hd">查询设置</div>
      <div class="xs-body">
        <div class="xs-auto-setting">
          <label class="xs-switch-label">
            <span>自动查询重复</span>
            <div class="xs-switch">
              <input type="checkbox" class="xs-auto-query-toggle" ${getAutoQueryEnabled() ? 'checked' : ''}>
              <span class="xs-slider"></span>
            </div>
          </label>
          <div class="xs-manual-query" style="display: ${getAutoQueryEnabled() ? 'none' : 'block'};">
            <button class="xs-manual-btn">手动查询本详情页重复</button>
          </div>
        </div>
      </div>
    </div>
    <div class="xs-section"><div class="hd">站点配置</div><div class="xs-body"><div class="xs-sites"></div></div></div>
    <div class="xs-section"><div class="hd">手动搜索</div><div class="xs-body"><div class="xs-search"><input class="xs-input xs-q" placeholder="输入关键字"><button class="xs-go">搜索</button></div><div class="xs-res"></div></div></div>`;
  document.documentElement.appendChild(panel);

  // 切换面板显示/隐藏
  const togglePanel = () => {
    const isShown = panel.classList.toggle('show');
    toggleBtn.classList.toggle('active', isShown);
    console.log(`[查重] 面板${isShown ? '显示' : '隐藏'}`);
  };

  toggleBtn.addEventListener('click', togglePanel);

  const qInput = panel.querySelector('.xs-q');
  panel.querySelector('.xs-close').addEventListener('click', togglePanel);
  qInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') panel.querySelector('.xs-go').click(); });

  // 自动查询开关事件监听器
  const autoToggle = panel.querySelector('.xs-auto-query-toggle');
  const manualQueryDiv = panel.querySelector('.xs-manual-query');
  const manualBtn = panel.querySelector('.xs-manual-btn');

  autoToggle.addEventListener('change', async () => {
    const enabled = autoToggle.checked;
    setAutoQueryEnabled(enabled);
    manualQueryDiv.style.display = enabled ? 'none' : 'block';
    console.log(`[查重] 自动查询已${enabled ? '开启' : '关闭'}`);

    // 如果用户切换到自动查询，立即执行当前页面的查重
    if (enabled) {
      console.log('[查重] 开启自动查询，立即执行当前页面查重...');
      try {
        await performDupeCheck();
      } catch (error) {
        console.error('[查重] 自动执行查重失败:', error);
      }
    }
  });

  // 手动查询按钮事件监听器
  manualBtn.addEventListener('click', async () => {
    console.log('[查重] 用户点击手动查询按钮');
    manualBtn.disabled = true;
    manualBtn.textContent = '查询中...';

    try {
      await performDupeCheck();
    } catch (error) {
      console.error('[查重] 手动查询失败:', error);
    } finally {
      manualBtn.disabled = false;
      manualBtn.textContent = '手动查询本详情页重复';
    }
  });

  const getEnabled = (k) => GMget(KV.ENABLE_PREFIX + k, DEFAULT_ENABLED[k] ?? false);
  const setEnabled = (k, v) => GMset(KV.ENABLE_PREFIX + k, !!v);
  const getCookie = (k) => GMget(KV.COOKIE_PREFIX + k, '');
  const setCookie = (k, v) => GMset(KV.COOKIE_PREFIX + k, v || '');

  function renderSites() {
    const sitesWrap = panel.querySelector('.xs-sites');
    sitesWrap.innerHTML = SITES.map(s => {
      const enabled = getEnabled(s.key);
      const cookie = getCookie(s.key);
      return `
        <div class="xs-site" data-key="${s.key}">
          <img class="logo" src="${s.icon}" alt="${esc(s.name)}">
          <div class="meta">
            <div class="name">${esc(s.name)}</div>
            <div class="status">${cookie ? 'Cookie：已设置' : 'Cookie：未设置'}</div>
            ${cookie ? '' : `<input class="xs-cookie-input" placeholder="粘贴 ${esc(s.name)} 的 document.cookie">`}
          </div>
          <div class="ops">
            <span class="xs-switch ${enabled ? 'on' : ''}" data-action="toggle" title="启用/禁用"></span>
            ${cookie ? `<button class="xs-btn ghost" data-action="reset">重置Cookie</button>` : `<button class="xs-btn" data-action="save">保存Cookie</button>`}
          </div>
        </div>`;
    }).join('');
    sitesWrap.addEventListener('click', (e) => {
      const target = e.target;
      const action = target.dataset.action;
      const card = target.closest('.xs-site');
      if (!action || !card) return;
      const k = card.dataset.key;
      if (action === 'toggle') {
        setEnabled(k, !target.classList.contains('on'));
        target.classList.toggle('on');
      } else if (action === 'save') {
        const v = (card.querySelector('.xs-cookie-input').value || '').trim();
        if (!v) return alert('请粘贴完整的 document.cookie');
        setCookie(k, v);
        renderSites();
      } else if (action === 'reset') {
        if (!confirm('确认清除此站 Cookie？')) return;
        setCookie(k, '');
        renderSites();
      }
    });
  }
  renderSites();

  panel.querySelector('.xs-go').addEventListener('click', async () => {
    const q = qInput.value.trim();
    const resEl = panel.querySelector('.xs-res');
    if (!q) {
      resEl.innerHTML = `<div class="xs-msg">请输入关键词</div>`;
      return;
    }
    const actives = SITES.filter((s) => getEnabled(s.key));
    if (!actives.length) {
      resEl.innerHTML = `<div class="xs-msg">请先开启至少一个站点开关</div>`;
      return;
    }
    resEl.innerHTML = `<div class="xs-msg">正在搜索…</div>`;
    try {
      const groups = await Promise.all(actives.map((s) => searchOneSite(s, q)));
      resEl.innerHTML = '';
      let total = 0;
      for (const g of groups) {
        total += g.items.length;
        renderGroup(g);
      }
      resEl.insertAdjacentHTML('afterbegin', `<div class="xs-msg">合计 ${total} 条（${groups.length} 个站点）</div>`);
    } catch (e) {
      resEl.innerHTML = `<div class="xs-msg xs-err">搜索失败：${esc(e?.message || e)}</div>`;
    }
  });

  async function searchOneSite(site, q, searchArea = '0') {
    const cookie = getCookie(site.key);
    if (!cookie) return { site, items: [], error: '未设置 Cookie' };
    const firstUrl = buildUrl(site.baseUrl, q, site.key, searchArea);
    
    // 【调试日志】打印搜索信息
    const searchTypeLabel = searchArea === '4' ? 'IMDb链接' : searchArea === '0' ? '标题' : '其他';
    console.log(`[查重] ${site.name} - 执行搜索: 关键词="${q}", 范围=${searchTypeLabel}(${searchArea}), URL=${firstUrl}`);
    
    const firstDoc = await fetchDocWithCookie(firstUrl, cookie, site.baseUrl);
    let items = extractBySite(firstDoc, site);
    
    console.log(`[查重] ${site.name} - 第1页提取到 ${items.length} 条结果`);
    
    const pages = collectPageUrls(firstDoc, firstUrl, site.baseUrl, MAX_PAGES - 1);
    if (pages.length > 0) {
      const docs = await fetchBatch(pages, PARALLEL, (u) => fetchDocWithCookie(u, cookie, site.baseUrl));
      for (const d of docs) {
        items = items.concat(extractBySite(d, site));
      }
    }
    items = mergePreferRicher(items);
    
    console.log(`[查重] ${site.name} - 搜索完成，共提取到 ${items.length} 条结果`);
    
    return { site, items, error: null };
  }

  function buildUrl(base, kw, key, searchArea = '0') {
    const u = new URL(SEARCH_PATH, base);
    applySearchParams(u, key, searchArea);
    u.searchParams.set('search', kw);
    return u.toString();
  }

  function fetchDocWithCookie(url, cookie, base) {
    return new Promise((resolve, reject) => {
      GMxhr({
        method: 'GET',
        url,
        headers: { Accept: 'text/html', Cookie: cookie, Referer: base },
        onload: (r) => {
          if (r.status >= 200 && r.status < 300) {
            resolve(new DOMParser().parseFromString(r.responseText, 'text/html'));
          } else {
            reject(new Error(`HTTP ${r.status}`));
          }
        },
        onerror: () => reject(new Error('网络或跨域被拦截'))
      });
    });
  }

  async function fetchBatch(urls, parallel, fn) {
    const out = [];
    for (let i = 0; i < urls.length; i += parallel) {
      const slice = urls.slice(i, i + parallel);
      const results = await Promise.allSettled(slice.map(fn));
      for (const x of results) {
        if (x.status === 'fulfilled') out.push(x.value);
      }
    }
    return out;
  }

  function collectPageUrls(doc, baseUrl, baseSite, maxCount) {
    const out = new Map();
    const base = new URL(baseUrl);
    doc.querySelectorAll('a[href*="torrents.php"]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      try {
        const u = new URL(href, baseSite);
        if (u.pathname === base.pathname && u.searchParams.get('search') === base.searchParams.get('search')) {
          const page = parseInt(u.searchParams.get('page'), 10);
          if (page > 0) out.set(u.toString(), page);
        }
      } catch (e) {}
    });
    return Array.from(out.keys()).sort((a,b) => out.get(a) - out.get(b)).slice(0, maxCount);
  }

  function extractBySite(doc, site) {
    const host = new URL(site.baseUrl).host;
    const key = DOMAIN_TO_KEY[host] || site.key;
    if (key === 'nvme') return extractSSD(doc, site.baseUrl);
    if (key === 'ourbits') return extractOurbits(doc, site.baseUrl);
    // 观众和HHC的搜索结果页结构未知，暂不实现
    return [];
  }

  function extractSSD(doc, base) {
    const items = [];
    doc.querySelectorAll('table.torrentname').forEach(table => {
      const titleLink = table.querySelector('a[href^="details.php"]');
      if (!titleLink) return;
      const href = titleLink.getAttribute('href') || '';
      if (/dllist=1#seeders/.test(href)) return;
      const link = new URL(href, base).toString();
      const title = text(titleLink);
      const subtitle = text(table.querySelector('.torrent-smalldescr > span:last-child'));
      // 修复标签提取逻辑：从内层span提取标签文本
      let tags = Array.from(table.querySelectorAll('.torrent-smalldescr > a > span.torrent-tag'))
          .map(s => {
            // 尝试从内层span获取标签文本，如果没有则使用外层span的文本
            const innerSpan = s.querySelector('span');
            return text(innerSpan || s);
          });
      tags = enhanceTagsFromText(tags, `${title} ${subtitle}`);
      const mainTitleInfo = extractMainTitle(title);
      const subtitleTitleInfo = extractSubtitleTitle(subtitle);
      // 季号优先从主标题提取，如果主标题没有则从副标题提取
      const season = mainTitleInfo.season || subtitleTitleInfo.season;
      // 年份提取（优先从主标题，其次副标题）
      const year = extractYear(title) || extractYear(subtitle);
      console.log(`[查重] 不可说搜索结果季号提取: "${title}" + "${subtitle}" -> 主标题季号=${mainTitleInfo.season || 'null'}, 副标题季号=${subtitleTitleInfo.season || 'null'}, 最终季号=${season || 'null'}, 年份=${year || 'null'}`);
      items.push({ 
        title, 
        subtitle, 
        tags, 
        link, 
        mainTitle: mainTitleInfo.title, 
        subtitleTitle: subtitleTitleInfo.title, 
        season: season,
        year: year,
        siteKey: 'nvme' 
      });
    });
    return items;
  }

  function extractOurbits(doc, base) {
    const items = [];
    doc.querySelectorAll('#torrenttable tr.sticky_blank td.embedded').forEach(cell => {
      const titleLink = cell.querySelector('a[href^="details.php?id="]');
      if (!titleLink) return;
      const link = new URL(titleLink.getAttribute('href') || '', base).toString();
      const title = text(titleLink);
      let subtitle = '';
      const br = cell.querySelector('br');
      if (br) {
        let currentNode = br.nextSibling;
        while (currentNode) {
            if (currentNode.nodeType === Node.TEXT_NODE) { // 只拼接纯文本节点
                subtitle += currentNode.textContent;
            }
            currentNode = currentNode.nextSibling;
        }
        subtitle = subtitle.replace(/^[\s\|]+|[\s\|]+$/g, '').trim(); // 清理首尾的 | 和空格
      }
      let tags = Array.from(cell.querySelectorAll('span.tag')).map(s => text(s));
      tags = enhanceTagsFromText(tags, `${title} ${subtitle}`);
      const mainTitleInfo = extractMainTitle(title);
      const subtitleTitleInfo = extractSubtitleTitle(subtitle);
      // 季号优先从主标题提取，如果主标题没有则从副标题提取
      const season = mainTitleInfo.season || subtitleTitleInfo.season;
      // 年份提取（优先从主标题，其次副标题）
      const year = extractYear(title) || extractYear(subtitle);
      console.log(`[查重] 我堡搜索结果季号提取: "${title}" + "${subtitle}" -> 主标题季号=${mainTitleInfo.season || 'null'}, 副标题季号=${subtitleTitleInfo.season || 'null'}, 最终季号=${season || 'null'}, 年份=${year || 'null'}`);
      items.push({ 
        title, 
        subtitle, 
        tags, 
        link, 
        mainTitle: mainTitleInfo.title, 
        subtitleTitle: subtitleTitleInfo.title, 
        season: season,
        year: year,
        siteKey: 'ourbits' 
      });
    });
    return items;
  }

  function renderGroup(g) {
    const resEl = panel.querySelector('.xs-res');
    const box = document.createElement('div');
    box.className = 'xs-group';
    box.innerHTML = `<div class="xs-group-hd"><span>${esc(g.site.name)}</span><span>共 ${g.items.length} 条</span></div><div class="xs-group-bd"></div>`;
    const body = box.querySelector('.xs-group-bd');
    if (!g.items.length) {
      body.innerHTML = `<div class="xs-msg">未找到相关条目${g.error ? `（${esc(g.error)}）` : ''}</div>`;
    } else {
      body.innerHTML = g.items.map(it => {
        const itemType = getItemType(it);
        const typeClass = getItemTypeClass(itemType);
        const seasonInfo = it.season ? `<span class="season-info" style="color: #666; font-size: 12px; margin-left: 8px;">[${it.season}]</span>` : '';
        const yearInfo = it.year ? `<span class="year-info" style="color: #999; font-size: 12px; margin-left: 4px;">[${it.year}]</span>` : '';
        return `
        <div class="xs-card">
          <div style="display: flex; align-items: flex-start; margin-bottom: 4px; gap: 8px;">
            <a class="xs-title" href="${it.link}" target="_blank" rel="noopener noreferrer" style="flex: 1;">${esc(it.title || '（无主标题）')}${seasonInfo}${yearInfo}</a>
            <span class="item-type ${typeClass}" style="flex-shrink: 0;">${esc(itemType)}</span>
          </div>
          ${it.subtitle ? `<div class="xs-sub">${esc(it.subtitle)}</div>` : ''}
          ${it.tags && it.tags.length ? `<div class="xs-tags">${it.tags.map(t => `<span class="xs-tag">${esc(t)}</span>`).join('')}</div>` : ''}
        </div>`;
      }).join('');
    }
    resEl.appendChild(box);
  }

  function extractReleaseGroup(title) {
    if (!title || !title.includes('-')) return null;
    const parts = title.split('-');
    let group = parts.pop().trim();
    if (!group) return null;
    
    // 移除方括号及其后的所有内容（如 [50%] 剩余时间：3天20时）
    const bracketIndex = group.indexOf('[');
    if (bracketIndex !== -1) {
      group = group.substring(0, bracketIndex).trim();
    }
    
    if (!group) return null;
    const commonNonGroups = ['web', 'dl', 'web-dl', 'remux', 'blu-ray', 'bluray'];
    if (commonNonGroups.includes(group.toLowerCase())) return null;
    return group;
  }

  function extractMainTitle(title) {
    if (!title) return { title: '', season: null, fullText: '' };
    
    let mainTitle = title;
    
    // 1. 先提取季号信息（用于后续处理）
    const season = extractSeason(title);
    
    // 2. 移除结尾的方括号标签（如 [免费][一般资源] 等）
    mainTitle = mainTitle.replace(/\s*\[[^\]]+\]\s*/g, '');
    
    // 3. 【核心改进】先找到分辨率的位置，只在分辨率之前提取影片名
    // PT站点标题格式通常是：影片名 年份 分辨率 来源 编码 音频-制作组
    const resolutionPattern = /\b(4320p|2160p|1080p|1080i|720p|576p|576i|480p|480i|4K|8K|SD)\b/i;
    const resolutionMatch = mainTitle.match(resolutionPattern);
    
    if (resolutionMatch) {
      // 如果找到分辨率，只保留分辨率之前的内容
      mainTitle = mainTitle.substring(0, resolutionMatch.index).trim();
      console.log(`[查重] 主标题提取: 找到分辨率"${resolutionMatch[0]}"，提取前面的内容: "${mainTitle}"`);
    } else {
      // 如果没有分辨率标记，尝试找到其他明显的技术参数起始位置
      const fallbackPattern = /(WEB-DL|WEBDL|WEBRip|BluRay|Blu-ray|HDTV|Remux|x264|x265|H\.264|H\.265|HEVC)/i;
      const fallbackMatch = mainTitle.match(fallbackPattern);
      if (fallbackMatch) {
        mainTitle = mainTitle.substring(0, fallbackMatch.index).trim();
        console.log(`[查重] 主标题提取: 未找到分辨率，但找到技术标识"${fallbackMatch[0]}"，提取前面的内容: "${mainTitle}"`);
      }
    }
    
    // 4. 移除季号和集数信息
    const seasonPatterns = [
      /S\d{1,2}E\d+-?E?\d*/gi,                // S01E01-E03, S01E01
      /S\d{1,2}-S\d{1,2}/gi,                  // S01-S05
      /S\d{1,2}/gi,                           // S01, S08
      /第\d{1,2}季/g,                         // 第1季, 第8季
      /Season\s*\d{1,2}/gi,                   // Season 1, Season 8
      /\d{1,2}(?:st|nd|rd|th)\s*Season/gi,    // 1st Season
      /\d{1,2}x\d+/gi,                        // 1x01
    ];
    
    for (const pattern of seasonPatterns) {
      mainTitle = mainTitle.replace(pattern, '');
    }
    
    // 5. 移除年份（通常紧跟在影片名后面）
    mainTitle = mainTitle.replace(/\s+\b(19|20)\d{2}\b/g, '');
    
    // 6. 移除版本信息
    const versionPatterns = [
      /\s+(Director'?s?\s*Cut|Extended\s*Edition|Uncut|International\s*Version)/gi,
      /\s+(Limited\s*Edition|Special\s*Edition|Anniversary\s*Edition)/gi,
      /\s+(Remaster|4K\s*Remaster|IMAX|Open\s*Matte)/gi,
      /\s+(PROPER|REPACK|COMPLETE)/gi,
    ];
    
    for (const pattern of versionPatterns) {
      mainTitle = mainTitle.replace(pattern, '');
    }
    
    // 7. 移除开头的类型标识
    mainTitle = mainTitle.replace(/^(美剧|英剧|韩剧|日剧|电影|纪录片)[:：]\s*/, '');
    
    // 8. 移除罗马数字（通常表示系列、章节等）
    // 罗马数字：Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ Ⅶ Ⅷ Ⅸ Ⅹ Ⅺ Ⅻ
    mainTitle = mainTitle.replace(/\s*[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ]+\s*$/i, '');
    
    // 9. 清理多余空格和标点
    mainTitle = mainTitle.replace(/\s+/g, ' ').trim();
    mainTitle = mainTitle.replace(/[-\s.]+$/, '').trim();
    mainTitle = mainTitle.replace(/^[-\s.]+/, '').trim();
    
    // 10. 额外清理：移除可能遗留的单个数字或短标识符
    mainTitle = mainTitle.replace(/\s+\d{1,2}$/, ''); // 移除结尾的单独数字
    mainTitle = mainTitle.replace(/\s+[A-Z]{1,3}$/, ''); // 移除结尾的短大写字母组合
    
    console.log(`[查重] 主标题提取: "${title}" -> 标题: "${mainTitle}", 季号: ${season || 'null'}`);
    
    return {
      title: mainTitle.trim(),
      season: season,
      fullText: title
    };
  }

  function extractSubtitleTitle(subtitle) {
    if (!subtitle) return { title: '', season: null, fullText: '' };
    
    let subtitleTitle = subtitle;
    
    // 1. 先提取季号信息
    const season = extractSeason(subtitle);
    
    // 2. 副标题通常包含中文译名、其他语言名称等，按分隔符分割取主要部分
    // 常见分隔符：| / ［ ］ * 「 」 ● ★ 丨（优先按主要分隔符分割）
    const delimiterRegex = /[\|\/丨\[\］\*「」●★]/;
    const parts = subtitleTitle.split(delimiterRegex);
    
    // 【核心改进】过滤掉包含元数据标识和描述性文字的部分
    const metadataPatterns = [
      /^(类别|类型|导演|主演|编剧|制片|语言|地区|上映|片长|评分|简介|tags?|imdb|douban)[:：]/i,
      /^(category|director|actor|writer|producer|language|region|runtime|rating|description)[:：]/i,
    ];
    
    // 描述性词汇模式（这些通常不是片名，而是描述）
    const descriptivePatterns = [
      /国产.*?(动画|剧集|电影|真人秀|综艺|纪录片)/i,
      /\d+D(动画|电影|剧集)/i,  // 3D动画、2D动画等
      /(武侠|仙侠|玄幻|科幻|奇幻|悬疑|剧情|喜剧|爱情).*?(动画|剧集|电影)/i,
    ];
    
    const validParts = parts.filter(part => {
      const cleanPart = part.trim();
      if (!cleanPart) return false;
      
      // 检查是否是元数据行
      for (const pattern of metadataPatterns) {
        if (pattern.test(cleanPart)) {
          console.log(`[查重] 副标题提取: 过滤元数据行: "${cleanPart}"`);
          return false;
        }
      }
      
      // 检查是否是描述性文字
      for (const pattern of descriptivePatterns) {
        if (pattern.test(cleanPart)) {
          console.log(`[查重] 副标题提取: 过滤描述性文字: "${cleanPart}"`);
          return false;
        }
      }
      
      return true;
    });
    
    // 【改进选择策略】优先选择第一个简短有效的中文片名
    // 策略：1. 有中文 2. 长度适中（2-20个字符）3. 优先选择靠前的
    let bestPart = '';
    
    for (const part of validParts) {
      const cleanPart = part.trim();
      if (!cleanPart) continue;
      
      // 计算中文字符数量
      const chineseChars = (cleanPart.match(/[\u4e00-\u9fff]/g) || []).length;
      
      // 如果包含中文且长度合理（2-20个字符），优先选择
      if (chineseChars >= 2 && cleanPart.length <= 20) {
        bestPart = cleanPart;
        console.log(`[查重] 副标题提取: 选择简短中文片名: "${bestPart}"`);
        break; // 找到第一个符合条件的就使用
      }
      
      // 备选：如果还没找到，选择中文字符最多的
      if (!bestPart && chineseChars > 0) {
        bestPart = cleanPart;
      }
    }
    
    subtitleTitle = bestPart || (validParts.length > 0 ? validParts[0].trim() : '');
    
    // 3. 移除类型前缀（美剧、电影等）
    subtitleTitle = subtitleTitle.replace(/^(美剧|英剧|韩剧|日剧|电影|纪录片|动漫|综艺)[:：]\s*/, '');
    
    // 4. 移除季号和集数信息（在提取中文之前先清理，避免残留数字）
    const seasonEpisodePatterns = [
      /第[一二三四五六七八九十\d]+季/g,       // 第1季, 第八季
      /Season\s*\d+/gi,                       // Season 1, Season 8
      /\d+(?:st|nd|rd|th)\s*Season/gi,        // 1st Season
      /S\d{1,2}E\d+-?E?\d*/gi,                // S01E01-E03
      /S\d{1,2}/gi,                           // S01, S08
      /第\d+部/g,                             // 第1部
      /Part\s*\d+/gi,                         // Part 1
      /全\d+集/g,                             // 全24集
      /共\d+集/g,                             // 共24集
      /\d+集全/g,                             // 24集全
      /\d+集/g,                               // 24集
      /\d+话/g,                               // 24话
      /Episodes?\s*\d+/gi,                    // Episode 24
    ];
    
    for (const pattern of seasonEpisodePatterns) {
      subtitleTitle = subtitleTitle.replace(pattern, '');
    }
    
    // 5. 智能提取纯中文影片名称
    if (/[\u4e00-\u9fff]/.test(subtitleTitle)) {
      // 提取所有中文字符（包括中文标点），去除英文、数字和其他符号
      const chineseChars = subtitleTitle.match(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]+/g);
      if (chineseChars && chineseChars.length > 0) {
        // 取最长的中文片段
        subtitleTitle = chineseChars.reduce((a, b) => a.length > b.length ? a : b).trim();
      }
    }
    
    // 6. 移除年份信息（可能残留的）
    subtitleTitle = subtitleTitle.replace(/\d{4}/g, '');
    
    // 7. 移除所有剩余的数字（避免像"8"这样的残留）
    subtitleTitle = subtitleTitle.replace(/\d+/g, '');
    
    // 8. 移除版本信息
    const versionPatterns = [
      /导演剪辑版|导演版|加长版|完整版|未删减版|国际版|剧场版/g,
      /Director'?s?\s*Cut|Extended\s*Edition|Uncut|International\s*Version/gi,
      /Limited\s*Edition|Special\s*Edition|Anniversary\s*Edition/gi,
    ];
    
    for (const pattern of versionPatterns) {
      subtitleTitle = subtitleTitle.replace(pattern, '');
    }
    
    // 9. 移除常见的无意义词汇
    const meaninglessPatterns = [
      /高清|蓝光|字幕|中字|中文字幕|英语|国语|粤语|类型|内封|网飞/g,
      /HD|BluRay|Subtitles?|Chinese|English|Netflix|Type/gi,
    ];
    
    for (const pattern of meaninglessPatterns) {
      subtitleTitle = subtitleTitle.replace(pattern, '');
    }
    
    // 10. 清理多余空格和标点
    subtitleTitle = subtitleTitle.replace(/\s+/g, ' ').trim();
    subtitleTitle = subtitleTitle.replace(/[:：·・\-\s、，。！？]+$/, '').trim(); // 移除结尾的标点
    subtitleTitle = subtitleTitle.replace(/^[:：·・\-\s、，。！？]+/, '').trim(); // 移除开头的标点
    
    console.log(`[查重] 副标题提取: "${subtitle}" -> 标题: "${subtitleTitle}", 季号: ${season || 'null'}`);
    
    return {
      title: subtitleTitle.trim(),
      season: season,
      fullText: subtitle
    };
  }

  function isWebDLSource(title, subtitle) { const t = `${title} ${subtitle}`.toLowerCase(); return ['web-dl', 'webdl'].some(k => t.includes(k)); }
  function isRemuxSource(title, subtitle) { return `${title} ${subtitle}`.toLowerCase().includes('remux'); }
  function isBluRaySource(title, subtitle) { const t = `${title} ${subtitle}`.toLowerCase(); return ['blu-ray', 'bluray'].some(k=>t.includes(k)) && ['avc', 'hevc', 'vc-1', 'h.264', 'h.265', 'mpeg-2'].some(k=>t.includes(k)) && !t.includes('remux'); }
  function isEncodeSource(title) { const t = title.toLowerCase(); return t.includes('x264') || t.includes('x265'); }

  function extractTagsFromBrackets(text) {
    if (!text) return [];
    const bracketRegex = /\[([^\]]+)\]/g;
    const extractedTags = [];
    let match;
    while ((match = bracketRegex.exec(text)) !== null) {
      extractedTags.push(...match[1].split('|').map(tag => tag.trim()).filter(Boolean));
    }
    return extractedTags;
  }

  function enhanceTagsFromText(initialTags, text) {
    const hdrRules = [
      { keywords: ['hdr10+'], tag: 'HDR10+' },
      { keywords: ['dolby vision', 'dovi', '杜比视界'], tag: 'DoVi' },
      { keywords: ['hdr10'], tag: 'HDR10' },
      { keywords: ['菁彩hdr', 'vivid'], tag: '菁彩HDR' },
      { keywords: ['hlg'], tag: 'HLG' },
    ];
    
    // 保留所有原始标签
    let finalTags = [...initialTags];
    
    // 仅添加HDR类型的增强标签（从标题和副标题文本中识别）
    if (text) {
      const lowerText = text.toLowerCase();
      const foundHdrTags = new Set();
      for (const rule of hdrRules) {
        // 只从文本内容中识别HDR标签，不从现有标签推断
        if (rule.keywords.some(k => lowerText.includes(k))) {
          foundHdrTags.add(rule.tag);
        }
      }
      // 添加识别到的HDR标签
      finalTags.push(...Array.from(foundHdrTags));
    }
    
    // HDR优先级处理：如果有HDR10+则移除HDR10
    if (finalTags.includes('HDR10+')) {
      finalTags = finalTags.filter(tag => tag !== 'HDR10');
    }
    
    // 去重并返回
    return [...new Set(finalTags)];
  }

  function getBluRaySubType(title, subtitle, tags, siteKey = null) {
    const text = `${title} ${subtitle}`.toLowerCase();
    const tagsLower = tags.map(t => t.toLowerCase());

    // 优先应用通用规则
    if (tagsLower.some(t => t.includes('原生'))) return 'original';
    if (['欧版原盘', '美版原盘', '日版原盘', '韩版原盘', '港版原盘', '台版原盘', '国版原盘', '德版原盘', '法版原盘', '英版原盘', '澳版原盘', '加版原盘', '俄版原盘', '意版原盘', '西版原盘', '北欧版原盘', '印版原盘'].some(k => text.includes(k))) return 'original';
    if (tagsLower.some(t => t.includes('diy')) || text.includes('diy')) return 'diy';

    // 应用站点专属的补充规则
    if (siteKey === 'ourbits') {
      // 我堡：如果没有diy标签，则判断为原盘
      return 'original';
    }
    if (siteKey === 'nvme') {
      // 不可说：如果没有原生标签，则判断为diy
      return 'diy';
    }

    // 其他未定义规则的站点，默认归类为原盘
    return 'original';
  }

  function extractYear(text) { const m = text.match(/\b(19|20)\d{2}\b/); return m ? parseInt(m[0]) : null; }
  
  function extractIMDb(text) {
    if (!text) return null;
    // 匹配 IMDb 编号格式：tt + 7-8位数字
    const patterns = [
      /imdb\.com\/title\/(tt\d{7,8})/i,  // 从链接中提取
      /\b(tt\d{7,8})\b/i,                 // 直接匹配编号
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        console.log(`[查重] IMDb编号提取: "${text}" -> ${match[1]}`);
        return match[1];
      }
    }
    
    console.log(`[查重] IMDb编号提取: "${text}" -> null`);
    return null;
  }

  function extractSeason(text) {
    if (!text) return null;
    
    // 清理掉可能的分隔符和标点，避免匹配到错误的内容
    const cleanText = text.replace(/[|\/\[\]]/g, ' ');
    
    // 支持多种季号格式
    const patterns = [
      { regex: /\bs(\d{1,2})e\d+/i, group: 1 },              // S01E01 (提取季号)
      { regex: /\bs(\d{1,2})\b/i, group: 1 },                // S01, S1
      { regex: /第([一二三四五六七八九十\d]{1,2})季/, group: 1 },  // 第1季, 第八季
      { regex: /season\s+(\d{1,2})\b/i, group: 1 },          // Season 1
      { regex: /(\d{1,2})(?:st|nd|rd|th)\s+season/i, group: 1 },  // 1st season
      { regex: /\b(\d{1,2})x\d+/i, group: 1 },               // 1x01 (提取季号)
      { regex: /第(\d{1,2})部/, group: 1 },                  // 第1部
      { regex: /part\s+(\d{1,2})\b/i, group: 1 },            // Part 1
      { regex: /vol\.?\s*(\d{1,2})\b/i, group: 1 },          // Vol 1
    ];
    
    for (const {regex, group} of patterns) {
      const match = cleanText.match(regex);
      if (match) {
        let seasonNum;
        const matchedText = match[group];
        
        // 处理中文数字
        const chineseNumbers = {'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10};
        if (chineseNumbers[matchedText]) {
          seasonNum = chineseNumbers[matchedText];
        } else {
          seasonNum = parseInt(matchedText);
        }
        
        if (seasonNum > 0 && seasonNum <= 99) {
          const result = `S${seasonNum.toString().padStart(2, '0')}`;
          console.log(`[查重] 季号提取: "${text}" -> ${result}`);
          return result;
        }
      }
    }
    
    console.log(`[查重] 季号提取: "${text}" -> null`);
    return null;
  }

  function extractResolution(text) {
    const patterns = [/(\d{3,4}[pP])/, /(4K|8K)/i];
    const resolutions = new Set();
    patterns.forEach(p => {
      const match = text.match(p);
      if (match) resolutions.add(match[0].toLowerCase());
    });
    if (resolutions.has('4k')) resolutions.add('2160p');
    if (resolutions.has('2160p')) resolutions.add('4k');
    return Array.from(resolutions);
  }

  // 标准化主标题函数（忽略空格和标点符号）- 全局函数供所有查重类型使用
  function normalizeMainTitle(title) {
    if (!title) return '';
    return title.toLowerCase()
      .replace(/[\s\.\-'_\[\]()（）【】]/g, '')  // 移除空格和常见标点符号
      .trim();
  }

  // 主标题完全一致检查函数
  function checkMainTitleExactMatch(sourceMainTitle, items, siteName, typeName) {
    const sourceNormalized = normalizeMainTitle(sourceMainTitle);
    console.log(`[查重] ${siteName} - ${typeName}主标题检查: 源站主标题="${sourceMainTitle}" -> 标准化="${sourceNormalized}"`);
    
    return items.filter(i => {
      const itemNormalized = normalizeMainTitle(i.mainTitle);
      const isMatch = sourceNormalized === itemNormalized;
      
      if (isMatch) {
        console.log(`[查重] ${siteName} - ${typeName}主标题完全一致: "${i.mainTitle}" (标准化:"${itemNormalized}") -> 直接匹配`);
      }
      
      return isMatch;
    });
  }

  function areHdrTagsExactlyMatched(sourceTags, itemTags) {
    const targetKeywords = new Set(['dovi', 'hdr10', 'hdr10+', '菁彩hdr', 'hlg']);
    const normalize = t => t.toLowerCase().replace(/\s+/g, '');
    const sourceHdr = new Set(sourceTags.map(normalize).filter(t => targetKeywords.has(t)));
    const itemHdr = new Set(itemTags.map(normalize).filter(t => targetKeywords.has(t)));
    if (sourceTags.length > 0 && sourceHdr.size !== itemHdr.size) return false;
    for (const tag of sourceHdr) if (!itemHdr.has(tag)) return false;
    return true;
  }

  function checkWebDLDupe(sourceInfo, searchResults) {
    return searchResults.map(siteResult => {
      const allResults = [
        ...(siteResult.mainTitleResults.passedItems || []), 
        ...(siteResult.subtitleTitleResults.passedItems || []),
        ...(siteResult.imdbResults.passedItems || [])
      ];
      const webdlResults = allResults.filter(item => isWebDLSource(item.title, item.subtitle));
      if (webdlResults.length === 0) return { site: siteResult.site.name, isDupe: false, reason: '无同为WEB-DL类型的搜索结果', matchedItems: [] };
      const sourceYear = extractYear(sourceInfo.originalTitle);
      const sourceSeason = extractSeason(sourceInfo.originalTitle);
      const yearOrSeasonMatched = webdlResults.filter(item => {
          const itemYear = extractYear(item.title);
          const itemSeason = extractSeason(item.title);
          if (sourceYear !== null && itemYear !== null) return sourceYear === itemYear;
          if (sourceSeason !== null && itemSeason !== null) return sourceSeason.toLowerCase() === itemSeason.toLowerCase();
          return false;
      });
      if ((sourceYear || sourceSeason) && yearOrSeasonMatched.length === 0) return { site: siteResult.site.name, isDupe: false, reason: `年份(${sourceYear || 'N/A'})或季号(${sourceSeason || 'N/A'})不一致`, matchedItems: [] };
      const sourceRes = extractResolution(sourceInfo.originalTitle);
      const resMatched = sourceRes.length > 0 ? yearOrSeasonMatched.filter(i => extractResolution(i.title).some(r => sourceRes.includes(r))) : yearOrSeasonMatched;
      if (sourceRes.length > 0 && resMatched.length === 0) return { site: siteResult.site.name, isDupe: false, reason: `分辨率不一致 (源站: ${sourceRes.join(', ')})`, matchedItems: [] };
      
      // 【新规则】主标题完全一致检查（最高优先级）
      const mainTitleMatched = checkMainTitleExactMatch(sourceInfo.mainTitle, resMatched, siteResult.site.name, 'WEB-DL');
      if (mainTitleMatched.length > 0) {
        return { site: siteResult.site.name, isDupe: true, reason: 'WEB-DL类型且主标题完全一致', matchedItems: mainTitleMatched };
      }
      
      // 【原有规则】HDR标签检查
      const matchedItems = resMatched.filter(i => areHdrTagsExactlyMatched(sourceInfo.tags, i.tags));
      if (sourceInfo.tags.length === 0) return { site: siteResult.site.name, isDupe: true, reason: '源站无HDR标签，通过检查', matchedItems: resMatched };
      if (matchedItems.length > 0) return { site: siteResult.site.name, isDupe: true, reason: '同为WEB-DL类型，且通过所有检查', matchedItems };
      return { site: siteResult.site.name, isDupe: false, reason: 'HDR标签不完全一致', matchedItems: [] };
    });
  }

  function checkBluRayDupe(sourceInfo, searchResults) {
    const sourceBluRayType = sourceInfo.type; // 直接使用已计算的类型，确保一致性
    console.log(`[查重] 源站BluRay类型: ${sourceBluRayType}`);

    return searchResults.map(siteResult => {
      const allResults = [
        ...(siteResult.mainTitleResults.passedItems || []), 
        ...(siteResult.subtitleTitleResults.passedItems || []),
        ...(siteResult.imdbResults.passedItems || [])
      ];

      const bluRayResults = allResults.filter(i => isBluRaySource(i.title, i.subtitle));

      // 严格筛选：DIY和原盘类型必须完全匹配
      const targetResults = bluRayResults.filter(i => {
        const itemBluRayType = getBluRaySubType(i.title, i.subtitle, i.tags, siteResult.site.key);
        const isTypeMatch = itemBluRayType === sourceBluRayType;

        if (!isTypeMatch) {
          console.log(`[查重] ${siteResult.site.name} - BluRay类型不匹配，已过滤: 源(${sourceBluRayType}) vs 结果(${itemBluRayType}) - ${i.title}`);
        }

        return isTypeMatch;
      });

      if (targetResults.length === 0) return { site: siteResult.site.name, isDupe: false, reason: `无同为 ${sourceBluRayType} 类型的搜索结果`, matchedItems: [] };
      const sourceYear = extractYear(sourceInfo.originalTitle);
      const sourceSeason = extractSeason(sourceInfo.originalTitle);
      console.log(`[查重] ${siteResult.site.name} - BluRay年份季号提取: 源站标题="${sourceInfo.originalTitle}" -> 年份=${sourceYear}, 季号=${sourceSeason}`);
      const yearOrSeasonMatched = targetResults.filter(item => {
          const itemYear = extractYear(item.title);
          const itemSeason = extractSeason(item.title);
          
          console.log(`[查重] ${siteResult.site.name} - 年份季号匹配检查: "${item.title}" -> 年份=${itemYear}, 季号=${itemSeason}`);
          
          // 年份匹配检查
          if (sourceYear !== null && itemYear !== null) {
            const yearMatch = sourceYear === itemYear;
            console.log(`[查重] ${siteResult.site.name} - 年份匹配: 源(${sourceYear}) vs 结果(${itemYear}) -> ${yearMatch}`);
            return yearMatch;
          }
          
          // 季号匹配检查
          if (sourceSeason !== null && itemSeason !== null) {
            const seasonMatch = sourceSeason.toLowerCase() === itemSeason.toLowerCase();
            console.log(`[查重] ${siteResult.site.name} - 季号匹配: 源(${sourceSeason}) vs 结果(${itemSeason}) -> ${seasonMatch}`);
            return seasonMatch;
          }
          
          // 如果源站和结果都没有年份和季号信息，认为匹配（主要针对电影）
          if (sourceYear === null && itemYear === null && sourceSeason === null && itemSeason === null) {
            console.log(`[查重] ${siteResult.site.name} - 双方都无年份季号信息，认为匹配`);
            return true;
          }
          
          // 如果只有一方有年份/季号信息，认为不匹配
          console.log(`[查重] ${siteResult.site.name} - 年份季号信息不对称，不匹配`);
          return false;
      });
      
      console.log(`[查重] ${siteResult.site.name} - 年份季号匹配结果: ${yearOrSeasonMatched.length} 条`);
      if ((sourceYear || sourceSeason) && yearOrSeasonMatched.length === 0) return { site: siteResult.site.name, isDupe: false, reason: `年份(${sourceYear || 'N/A'})或季号(${sourceSeason || 'N/A'})不一致`, matchedItems: [] };
      
      const sourceRes = extractResolution(sourceInfo.originalTitle);
      console.log(`[查重] ${siteResult.site.name} - 源站分辨率: [${sourceRes.join(', ')}]`);
      
      const resMatched = sourceRes.length > 0 ? yearOrSeasonMatched.filter(i => {
        const itemRes = extractResolution(i.title);
        const hasMatchingRes = itemRes.some(r => sourceRes.includes(r));
        console.log(`[查重] ${siteResult.site.name} - 分辨率匹配检查: "${i.title}" -> [${itemRes.join(', ')}] -> ${hasMatchingRes}`);
        return hasMatchingRes;
      }) : yearOrSeasonMatched;
      
      console.log(`[查重] ${siteResult.site.name} - 分辨率匹配结果: ${resMatched.length} 条`);
      if (sourceRes.length > 0 && resMatched.length === 0) return { site: siteResult.site.name, isDupe: false, reason: `分辨率不一致 (源站: ${sourceRes.join(', ')})`, matchedItems: [] };
      let matchedItems = [];
      if (sourceBluRayType === 'original') {
        // 【新规则】主标题完全一致检查（最高优先级）
        const mainTitleMatched = checkMainTitleExactMatch(sourceInfo.mainTitle, resMatched, siteResult.site.name, '原盘');
        if (mainTitleMatched.length > 0) {
          matchedItems = mainTitleMatched;
          console.log(`[查重] ${siteResult.site.name} - 原盘主标题完全一致，直接匹配: ${mainTitleMatched.length} 条`);
        } else {
          // 【原有规则】版本匹配检查
          const sourceSub = sourceInfo.originalSubtitle || '';
          const versionKeywords = ['欧版原盘', '美版原盘', '日版原盘', '韩版原盘', '港版原盘', '台版原盘', '国版原盘'];
          const sourceVersion = versionKeywords.find(k => sourceSub.includes(k));
          console.log(`[查重] ${siteResult.site.name} - 原盘版本检查: 源站副标题="${sourceSub}", 版本关键词="${sourceVersion || '无'}"`);
          
          matchedItems = resMatched.filter(i => {
            const matches = sourceVersion ? (i.subtitle || '').includes(sourceVersion) : true;
            console.log(`[查重] ${siteResult.site.name} - 原盘版本匹配: "${i.subtitle || ''}" -> ${matches}`);
            return matches;
          });
        }
      } else { // diy
        // 【新规则】主标题完全一致检查（最高优先级）
        const mainTitleMatched = checkMainTitleExactMatch(sourceInfo.mainTitle, resMatched, siteResult.site.name, 'DIY原盘');
        if (mainTitleMatched.length > 0) {
          matchedItems = mainTitleMatched;
          console.log(`[查重] ${siteResult.site.name} - DIY原盘主标题完全一致，直接匹配: ${mainTitleMatched.length} 条`);
        } else {
          // 【原有规则】中字检查
          const sourceHasChinese = sourceInfo.tags.some(t => ['中字', '中文', '国语'].includes(t));
          console.log(`[查重] ${siteResult.site.name} - DIY中字检查: 源站中字=${sourceHasChinese}`);
          
          matchedItems = resMatched.filter(i => {
            const matches = sourceHasChinese ? i.tags.some(t => ['中字', '中文', '国语'].includes(t)) : true;
            console.log(`[查重] ${siteResult.site.name} - DIY中字匹配: [${i.tags.join(', ')}] -> ${matches}`);
            return matches;
          });
        }
      }
      
      console.log(`[查重] ${siteResult.site.name} - 最终匹配结果: ${matchedItems.length} 条`);
      if (matchedItems.length > 0) {
        console.log(`[查重] ${siteResult.site.name} - 🎯 检测到重复！匹配的种子:`, matchedItems.map(i => i.title));
        return { site: siteResult.site.name, isDupe: true, reason: `存在匹配的 ${sourceBluRayType} 类型种子`, matchedItems };
      }
      console.log(`[查重] ${siteResult.site.name} - ❌ 未检测到重复`);
      return { site: siteResult.site.name, isDupe: false, reason: `未找到符合所有条件的 ${sourceBluRayType} 类型种子`, matchedItems: [] };
    });
  }

  function checkRemuxDupe(sourceInfo, searchResults) {
    return searchResults.map(siteResult => {
      const allResults = [
        ...(siteResult.mainTitleResults.passedItems || []), 
        ...(siteResult.subtitleTitleResults.passedItems || []),
        ...(siteResult.imdbResults.passedItems || [])
      ];
      const remuxResults = allResults.filter(item => isRemuxSource(item.title, item.subtitle));
      if (remuxResults.length === 0) return { site: siteResult.site.name, isDupe: false, reason: '无同为REMUX类型的搜索结果', matchedItems: [] };
      const sourceYear = extractYear(sourceInfo.originalTitle);
      const sourceSeason = extractSeason(sourceInfo.originalTitle);
      const yearOrSeasonMatched = remuxResults.filter(item => {
          const itemYear = extractYear(item.title);
          const itemSeason = extractSeason(item.title);
          if (sourceYear !== null && itemYear !== null) return sourceYear === itemYear;
          if (sourceSeason !== null && itemSeason !== null) return sourceSeason.toLowerCase() === itemSeason.toLowerCase();
          return false;
      });
      if ((sourceYear || sourceSeason) && yearOrSeasonMatched.length === 0) return { site: siteResult.site.name, isDupe: false, reason: `年份(${sourceYear || 'N/A'})或季号(${sourceSeason || 'N/A'})不一致`, matchedItems: [] };
      const sourceRes = extractResolution(sourceInfo.originalTitle);
      const resMatched = sourceRes.length > 0 ? yearOrSeasonMatched.filter(i => extractResolution(i.title).some(r => sourceRes.includes(r))) : yearOrSeasonMatched;
      if (sourceRes.length > 0 && resMatched.length === 0) return { site: siteResult.site.name, isDupe: false, reason: `分辨率不一致 (源站: ${sourceRes.join(', ')})`, matchedItems: [] };
      
      // 【新规则】主标题完全一致检查（最高优先级）
      const mainTitleMatched = checkMainTitleExactMatch(sourceInfo.mainTitle, resMatched, siteResult.site.name, 'REMUX');
      if (mainTitleMatched.length > 0) {
        return { site: siteResult.site.name, isDupe: true, reason: 'REMUX类型且主标题完全一致', matchedItems: mainTitleMatched };
      }
      
      // 【原有规则】中字检查
      const sourceHasChinese = sourceInfo.tags.some(t => ['中字', '中文', '国语'].includes(t));
      const matchedItems = resMatched.filter(i => sourceHasChinese ? i.tags.some(t => ['中字', '中文', '国语'].includes(t)) : true);
      if (matchedItems.length > 0) return { site: siteResult.site.name, isDupe: true, reason: '存在匹配的REMUX类型种子', matchedItems };
      return { site: siteResult.site.name, isDupe: false, reason: '中字标签不匹配', matchedItems: [] };
    });
  }

  function checkEncodeDupe(sourceInfo, searchResults) {
    const sourceRes = extractResolution(sourceInfo.originalTitle);
    const sourceIs2160p = sourceRes.includes('2160p');
    return searchResults.map(siteResult => {
      const allResults = [
        ...(siteResult.mainTitleResults.passedItems || []), 
        ...(siteResult.subtitleTitleResults.passedItems || []),
        ...(siteResult.imdbResults.passedItems || [])
      ];
      const encodeResults = allResults.filter(item => isEncodeSource(item.title));
      if (encodeResults.length === 0) return { site: siteResult.site.name, isDupe: false, reason: '无同为压制类型的搜索结果', matchedItems: [] };
      const sourceYear = extractYear(sourceInfo.originalTitle);
      const sourceSeason = extractSeason(sourceInfo.originalTitle);
      const yearOrSeasonMatched = encodeResults.filter(item => {
          const itemYear = extractYear(item.title);
          const itemSeason = extractSeason(item.title);
          if (sourceYear !== null && itemYear !== null) return sourceYear === itemYear;
          if (sourceSeason !== null && itemSeason !== null) return sourceSeason.toLowerCase() === itemSeason.toLowerCase();
          return false;
      });
      if ((sourceYear || sourceSeason) && yearOrSeasonMatched.length === 0) return { site: siteResult.site.name, isDupe: false, reason: `年份(${sourceYear || 'N/A'})或季号(${sourceSeason || 'N/A'})不一致`, matchedItems: [] };
      const resMatched = sourceRes.length > 0 ? yearOrSeasonMatched.filter(i => extractResolution(i.title).some(r => sourceRes.includes(r))) : yearOrSeasonMatched;
      if (resMatched.length === 0) return { site: siteResult.site.name, isDupe: false, reason: `分辨率不一致 (源站: ${sourceRes.join(', ')})`, matchedItems: [] };
      
      // 【新规则】主标题完全一致检查（最高优先级）
      const mainTitleMatched = checkMainTitleExactMatch(sourceInfo.mainTitle, resMatched, siteResult.site.name, '压制');
      if (mainTitleMatched.length > 0) {
        return { site: siteResult.site.name, isDupe: true, reason: '压制类型且主标题完全一致', matchedItems: mainTitleMatched };
      }
      
      // 【原有规则】分辨率和HDR检查
      if (sourceIs2160p) {
        const matchedItems = resMatched.filter(i => areHdrTagsExactlyMatched(sourceInfo.tags, i.tags));
        if (sourceInfo.tags.length === 0) return { site: siteResult.site.name, isDupe: true, reason: '源站无HDR标签，通过检查', matchedItems: resMatched };
        if (matchedItems.length > 0) return { site: siteResult.site.name, isDupe: true, reason: '同为压制类型，且年份/季号、分辨率、HDR标签均一致', matchedItems };
        return { site: siteResult.site.name, isDupe: false, reason: '2160p分辨率下HDR标签不完全匹配', matchedItems: [] };
      } else {
        return { site: siteResult.site.name, isDupe: true, reason: '同为压制类型，且年份/季号、分辨率一致', matchedItems: resMatched };
      }
    });
  }

  function validateResourceForSite(sourceInfo, siteKey) {
    const rules = BANNED_RESOURCES_RULES[siteKey];
    if (!rules) return { allowed: true, reason: '' };
    const releaseGroup = sourceInfo.releaseGroup ? sourceInfo.releaseGroup.toLowerCase() : null;
    if (releaseGroup && rules.generalGroups.includes(releaseGroup)) return { allowed: false, reason: `通用禁止小组: ${sourceInfo.releaseGroup}` };
    if (releaseGroup && rules.partialGroups.general.some(p => releaseGroup.startsWith(p))) {
        const matchedRule = rules.partialGroups.general.find(p => releaseGroup.startsWith(p));
        return { allowed: false, reason: `通用禁止小组 (部分匹配): ${matchedRule}*` };
    }
    if (rules.bannedTypes.includes(sourceInfo.type)) return { allowed: false, reason: `禁止资源类型: ${sourceInfo.type.toUpperCase()}` };
    const typeSpecificRules = rules.typeSpecific[sourceInfo.type] || [];
    if (releaseGroup && typeSpecificRules.some(p => releaseGroup.startsWith(p))) {
        const matchedRule = typeSpecificRules.find(p => releaseGroup.startsWith(p));
        return { allowed: false, reason: `该类型禁止小组: ${matchedRule}*` };
    }
    return { allowed: true, reason: '允许发布' };
  }

  function extractAudiences(doc) {
    let title = '', subtitle = '', category = '', description = '';
    let tags = [];

    // 精准提取标题，过滤折扣标签和其他额外信息
    const h1Element = doc.querySelector('h1#top');
    if (h1Element) {
      // 克隆元素以避免修改原始DOM
      const clonedH1 = h1Element.cloneNode(true);
      
      // 移除所有<b>标签（包含折扣信息如[50%]）
      clonedH1.querySelectorAll('b').forEach(b => b.remove());
      
      // 移除所有<font>标签
      clonedH1.querySelectorAll('font').forEach(font => font.remove());
      
      // 获取清理后的文本并去除多余空白
      title = text(clonedH1).replace(/\s+/g, ' ').trim();
      
      console.log(`[查重] Audiences标题提取: 原始="${text(h1Element)}" -> 清理后="${title}"`);
    }

    // 尝试获取描述信息
    const descrEl = doc.querySelector('#kdescr');
    if (descrEl) {
        description = text(descrEl);
    }

    const rows = doc.querySelectorAll('table > tbody > tr');
    rows.forEach(row => {
        const keyCell = row.querySelector('td.rowhead');
        const valueCell = row.querySelector('td.rowfollow');
        if(!keyCell || !valueCell) return;

        const keyText = text(keyCell);
        if (keyText.includes('副标题')) {
            subtitle = text(valueCell);
        } else if (keyText.includes('基本信息')) {
            const infoText = text(valueCell);
            const catMatch = infoText.match(/类型:\s*(\S+)/);
            if(catMatch) category = catMatch[1];
        } else if (keyText.includes('标签')) {
            tags = Array.from(valueCell.querySelectorAll('.tags')).map(tag => text(tag));
        }
    });

    // 提取 IMDb 编号（从描述或页面链接中）
    const imdb = extractIMDb(description) || extractIMDb(doc.body.innerHTML);

    return { title, subtitle, tags, category, description, imdb };
  }

  function extractHHC(doc) {
    let title = '', subtitle = '', category = '', description = '';
    let tags = [];

    // 尝试获取描述信息
    const descrEl = doc.querySelector('#kdescr');
    if (descrEl) {
        description = text(descrEl);
    }

    const mainGridDivs = doc.querySelectorAll('.bg-content_bg > .grid > div');
    for (let i = 0; i < mainGridDivs.length; i += 2) {
        const keyDiv = mainGridDivs[i], valueDiv = mainGridDivs[i + 1];
        if (!keyDiv || !valueDiv) continue;
        const keyText = text(keyDiv);
        if (keyText === '标题') title = text(valueDiv);
        else if (keyText === '副标题') subtitle = text(valueDiv);
        else if (keyText === '标签') tags = Array.from(valueDiv.querySelectorAll('a > span')).map(span => text(span));
    }
    doc.querySelectorAll('.bg-content_bg > .grid .grid.grid-cols-4 > div').forEach(div => {
        const divText = text(div);
        if (divText.startsWith('类型:')) category = divText.replace('类型:', '').trim();
    });
    
    // 提取 IMDb 编号（从描述或页面链接中）
    const imdb = extractIMDb(description) || extractIMDb(doc.body.innerHTML);
    
    return { title, subtitle, tags, category, description, imdb };
  }

  // MTeam站点专用：等待页面完全加载
  async function waitForMTeamPageLoad() {
    const maxAttempts = 30; // 最多等待15秒 (30 * 500ms)
    let attempts = 0;

    return new Promise((resolve) => {
      const checkPageReady = () => {
        attempts++;
        console.log(`[查重] MTeam-第${attempts}次检查页面状态...`);

        // 检查页面标题是否已更新（不只是"M-Team"）
        const pageTitle = document.title;
        const hasFullTitle = pageTitle && pageTitle !== 'M-Team' && pageTitle.includes('種子詳情');

        // 检查关键DOM元素是否存在
        const h2Count = document.querySelectorAll('h2').length;
        const alignMiddleCount = document.querySelectorAll('.align-middle').length;
        const hasContent = h2Count > 0 || alignMiddleCount > 0;

        // 检查是否有种子信息内容
        const bodyText = document.body ? document.body.textContent : '';
        const hasTorrentInfo = bodyText.includes('◎') || bodyText.includes('2160p') || bodyText.includes('1080p');

        console.log(`[查重] MTeam-页面检查: title="${pageTitle}", hasFullTitle=${hasFullTitle}, h2=${h2Count}, alignMiddle=${alignMiddleCount}, hasTorrentInfo=${hasTorrentInfo}`);

        if ((hasFullTitle || hasContent || hasTorrentInfo) && attempts >= 3) {
          // 页面看起来准备好了，再等一点点让内容稳定
          console.log('[查重] MTeam-页面似乎已加载，开始提取信息...');
          setTimeout(() => {
            const info = extractMTeam(document);
            resolve(info);
          }, 1000);
          return;
        }

        if (attempts >= maxAttempts) {
          console.log('[查重] MTeam-等待超时，使用当前页面状态...');
          const info = extractMTeam(document);
          resolve(info);
          return;
        }

        // 继续等待
        setTimeout(checkPageReady, 500);
      };

      // 开始检查
      checkPageReady();
    });
  }

  function extractMTeam(doc) {
    let title = '', subtitle = '', category = '', description = '';
    let tags = [];

    // 方法1: 根据实际DOM结构提取主标题
    // 从用户截图看到的结构: <h2 class="pr-[2em]"><span class="align-middle">标题内容</span></h2>
    let titleEl = doc.querySelector('h2[class*="pr-"] > span.align-middle');
    if (titleEl) {
      title = text(titleEl);
      console.log(`[查重] MTeam-方法1找到标题: ${title}`);
    }

    // 方法2: 尝试更通用的h2选择器
    if (!title) {
      titleEl = doc.querySelector('h2 > span.align-middle');
      if (titleEl) {
        title = text(titleEl);
        console.log(`[查重] MTeam-方法2找到标题: ${title}`);
      }
    }

    // 方法3: 尝试任何h2标签内的align-middle span
    if (!title) {
      titleEl = doc.querySelector('span.align-middle');
      if (titleEl) {
        const parentH2 = titleEl.closest('h2');
        if (parentH2) {
          title = text(titleEl);
          console.log(`[查重] MTeam-方法3找到标题: ${title}`);
        }
      }
    }

    // 方法4: 从页面标题中提取 (fallback方案)
    if (!title) {
      const pageTitle = doc.title;
      console.log(`[查重] MTeam-页面标题: ${pageTitle}`);
      // 页面标题格式通常为 "M-Team - TP __ 種子詳情 _标题内容_ - Powered by mTorrent"
      const titleMatch = pageTitle.match(/_([^_]+)_.*?- Powered by mTorrent/);
      if (titleMatch) {
        title = titleMatch[1];
        console.log(`[查重] MTeam-方法4从页面标题提取: ${title}`);
      }
    }

    // 方法5: 通过React组件查找 (MTeam是React应用)
    if (!title) {
      // 查找可能包含标题的各种元素
      const candidates = [
        'h2 span',
        '[class*="title"] span',
        '[class*="torrent"] h2',
        '.ant-typography h2',
        'h2[class*="text"]',
        // 添加更多可能的选择器
        'h1 span',
        'h3 span',
        '[class*="name"] span',
        '[class*="heading"] span'
      ];

      for (const selector of candidates) {
        const el = doc.querySelector(selector);
        if (el) {
          const text_content = text(el);
          // 检查是否像种子标题(包含常见的编码格式、分辨率等)
          if (text_content && (text_content.includes('2160p') || text_content.includes('1080p') || text_content.includes('720p') ||
              text_content.includes('WEB-DL') || text_content.includes('BluRay') || text_content.includes('REMUX') ||
              text_content.includes('x264') || text_content.includes('x265') || text_content.includes('HEVC'))) {
            title = text_content;
            console.log(`[查重] MTeam-方法5找到可能的标题: ${title} (选择器: ${selector})`);
            break;
          }
        }
      }
    }

    // 方法6: 如果所有方法都失败，尝试从所有文本中查找最长的包含种子特征的文本
    if (!title) {
      console.log('[查重] MTeam-尝试方法6：从所有文本中查找种子标题...');
      const allText = doc.body ? doc.body.textContent : '';
      const lines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 20);

      for (const line of lines) {
        if ((line.includes('2160p') || line.includes('1080p') || line.includes('720p')) &&
            (line.includes('x264') || line.includes('x265') || line.includes('HEVC') ||
             line.includes('WEB-DL') || line.includes('BluRay') || line.includes('REMUX')) &&
            line.length < 200) { // 不要太长的文本
          title = line;
          console.log(`[查重] MTeam-方法6从文本内容找到标题: ${title}`);
          break;
        }
      }
    }

    // 优先从页面顶部的小标题元素提取副标题（MTeam特有的副标题样式）
    // 方法1: 查找特定的CSS类 text-mt-gray-4 leading-[1.425]
    let subtitleEl = doc.querySelector('p.text-mt-gray-4, p[class*="text-mt-gray"]');
    if (subtitleEl && text(subtitleEl).length > 10) {
      subtitle = text(subtitleEl);
      console.log(`[查重] MTeam-方法1从页面顶部提取副标题: ${subtitle}`);
    }

    // 方法2: 查找包含leading-[1.425]类的p元素
    if (!subtitle) {
      const candidates = doc.querySelectorAll('p[class*="leading-"], p[class*="text-mt-"], p[class*="gray-"]');
      for (const el of candidates) {
        const text_content = text(el);
        if (text_content && text_content.includes('|') && text_content.length > 10 && text_content.length < 300) {
          subtitle = text_content;
          console.log(`[查重] MTeam-方法2从CSS类元素提取副标题: ${subtitle}`);
          break;
        }
      }
    }

    // 方法3: 查找可能的副标题元素（包含特定内容的p标签）
    if (!subtitle) {
      const pElements = doc.querySelectorAll('p');
      for (const el of pElements) {
        const text_content = text(el);
        // 查找包含常见副标题特征的元素：包含 | 分隔符，包含中文，长度适中
        if (text_content &&
            text_content.includes('|') &&
            /[\u4e00-\u9fff]/.test(text_content) && // 包含中文
            text_content.length > 10 &&
            text_content.length < 300 &&
            (text_content.includes('字幕') || text_content.includes('收藏版') || text_content.includes('/'))) {
          subtitle = text_content;
          console.log(`[查重] MTeam-方法3从p元素提取副标题: ${subtitle}`);
          break;
        }
      }
    }

    // 提取描述信息
    const descrEl = doc.querySelector('#kdescr, .descr, .torrent-description, [class*="descr"]');
    if (descrEl) {
      description = text(descrEl);
    }

    // 备用方案：如果以上方法都没找到副标题，才从页面内容中查找◎标记的中文信息
    if (!subtitle) {
      console.log('[查重] MTeam-前面方法未找到副标题，使用备用方案从◎标记提取');
      const allTextContent = doc.body ? doc.body.textContent || '' : '';
      const chineseNameMatch = allTextContent.match(/◎中文名[　\s]*([^\n\r◎]+)/);
      const translateNameMatch = allTextContent.match(/◎译[　\s]*名[　\s]*([^\n\r◎]+)/);
      const filmNameMatch = allTextContent.match(/◎片[　\s]*名[　\s]*([^\n\r◎]+)/);

      if (chineseNameMatch) {
        subtitle = chineseNameMatch[1].trim();
        console.log(`[查重] MTeam-备用方案从中文名提取: ${subtitle}`);
      } else if (translateNameMatch) {
        subtitle = translateNameMatch[1].trim();
        console.log(`[查重] MTeam-备用方案从译名提取: ${subtitle}`);
      } else if (filmNameMatch && !filmNameMatch[1].includes(title)) {
        subtitle = filmNameMatch[1].trim();
        console.log(`[查重] MTeam-备用方案从片名提取: ${subtitle}`);
      }
    }

    // 智能分类识别
    category = '电影'; // 默认
    if (title && (/S\d+E\d+|第\d+季|Season|Episode|\bEP\d+|\bE\d+/i.test(title) ||
        /剧集|电视剧|TV Series/i.test(description))) {
      category = '剧集';
    } else if (/动漫|动画|Anime/i.test(description) || /动画|アニメ/i.test(title)) {
      category = '动漫';
    }

    console.log(`[查重] MTeam标题提取结果: title="${title}", subtitle="${subtitle}", category="${category}"`);
    console.log(`[查重] MTeam页面结构调试 - 找到的h2元素:`, doc.querySelectorAll('h2').length);
    console.log(`[查重] MTeam页面结构调试 - 找到的align-middle元素:`, doc.querySelectorAll('.align-middle').length);

    // 提取 IMDb 编号（从描述或页面链接中）
    const imdb = extractIMDb(description) || extractIMDb(doc.body ? doc.body.innerHTML : '');

    return { title, subtitle, tags, category, description, imdb };
  }

  function extractGenericDetails(doc) {
    // 精准提取标题，过滤折扣标签和其他额外信息
    let title = '';
    const h1Element = doc.querySelector('h1');
    if (h1Element) {
      // 克隆元素以避免修改原始DOM
      const clonedH1 = h1Element.cloneNode(true);
      
      // 移除所有<b>标签（包含折扣信息如[50%]、[FREE]等）
      clonedH1.querySelectorAll('b').forEach(b => b.remove());
      
      // 移除所有<font>标签
      clonedH1.querySelectorAll('font').forEach(font => font.remove());
      
      // 移除所有<img>标签（图标等）
      clonedH1.querySelectorAll('img').forEach(img => img.remove());
      
      // 移除所有包含折扣信息的<span>标签
      clonedH1.querySelectorAll('span').forEach(span => {
        const className = span.className || '';
        const textContent = span.textContent || '';
        // 如果span包含折扣类名或折扣文本，则移除
        if (className.includes('down') || className.includes('free') || className.includes('pro') || 
            /\[\d+%\]|FREE|免费|促销/i.test(textContent)) {
          span.remove();
        }
      });
      
      // 获取清理后的文本并去除多余空白
      title = text(clonedH1).replace(/\s+/g, ' ').trim();
      
      console.log(`[查重] 通用标题提取: 原始="${text(h1Element)}" -> 清理后="${title}"`);
    }
    
    let subtitle = '', description = '', tags = [], category = '电影';

    // 尝试获取描述信息
    const descrEl = doc.querySelector('#kdescr, .descr, .torrent-description');
    if (descrEl) {
        description = text(descrEl);
    }

    doc.querySelectorAll('tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 2) return;
      const key = text(cells[0]).toLowerCase();
      const valCell = cells[1];
      if (key.includes('副标题')) subtitle = text(valCell);
      else if (key.includes('标签')) tags = Array.from(valCell.querySelectorAll('span, a')).map(el => text(el)).filter(Boolean);
      else if (key.includes('类型')) {
        const catText = text(valCell).toLowerCase();
        if (catText.includes('剧集')) category = '剧集';
        else if (catText.includes('动漫')) category = '动漫';
      }
    });
    
    // 提取 IMDb 编号（从描述或页面链接中）
    const imdb = extractIMDb(description) || extractIMDb(doc.body.innerHTML);
    
    return { title, subtitle, tags, category, description, imdb };
  }

  const T_S_MAP = {
      '臺': '台', '戰': '战', '門': '门', '隻': '只', '鐵': '铁', '長': '长', '簡': '简', '約': '约',
      '闆': '板', '無': '无', '組': '组', '邊': '边', '讓': '让', '話': '话', '語': '语', '頭': '头',
      '銀': '银', '樣': '样', '塊': '块', '牠': '它', '牠': '它', '兇': '凶', '國': '国', '圍': '围',
      '們': '们', '發': '发', '葉': '叶', '書': '书', '見': '见', '種': '种', '號': '号', '畫': '画'
      // 注：此为常用字映射表，无法覆盖所有简繁体字。
  };

  function normalizeSubtitle(subtitle) {
      if (!subtitle) return '';
      let simplified = '';
      for (const char of subtitle) {
          simplified += T_S_MAP[char] || char;
      }
      return simplified.replace(/[\s\.\-']/g, '');
  }

  function areSubtitlesEqual(subA, subB) {
      if (!subA && !subB) return true; // Both are empty
      if (!subA || !subB) return false;
      return normalizeSubtitle(subA) === normalizeSubtitle(subB);
  }

  function areMainTitlesEqual(titleA, titleB) {
      if (!titleA && !titleB) return true; // Both are empty
      if (!titleA || !titleB) return false;
      const normalize = (str) => str.toLowerCase().replace(/[\s\.\-']/g, '');
      return normalize(titleA) === normalize(titleB);
  }

  function isSimilar(strA, strB) {
    if (!strA || !strB) return false;
    const sA = strA.toLowerCase().replace(/[\s\.\-']/g, '');
    const sB = strB.toLowerCase().replace(/[\s\.\-']/g, '');
    return sA.includes(sB) || sB.includes(sA);
  }

  function filterSearchResults(allResults, sourceInfo) {
      return allResults.map(siteResult => {
          const newSiteResult = { ...siteResult };
          ['mainTitleResults', 'subtitleTitleResults', 'imdbResults'].forEach(key => {
              if (siteResult[key]?.items) {
                  const passedItems = [], failedItems = [];

                  siteResult[key].items.forEach(item => {
                      // 规则更新：同时检查主标题、副标题和季号
                      const mainTitlesMatch = areMainTitlesEqual(item.mainTitle, sourceInfo.mainTitle);
                      const subtitlesMatch = areSubtitlesEqual(item.subtitleTitle, sourceInfo.subtitleTitle);
                      
                      // 季号匹配检查
                      const seasonMatch = (sourceInfo.season && item.season) 
                          ? sourceInfo.season === item.season 
                          : (!sourceInfo.season && !item.season); // 都没有季号也算匹配
                      
                      const searchSourceLabel = key === 'imdbResults' ? 'IMDb搜索' : key === 'subtitleTitleResults' ? '副标题搜索' : '主标题搜索';
                      console.log(`[查重] ${siteResult.site.name} - ${searchSourceLabel}筛选检查: "${item.title}"`);
                      console.log(`[查重] - 主标题匹配: ${mainTitlesMatch} (源:"${sourceInfo.mainTitle}" vs 结果:"${item.mainTitle}")`);
                      console.log(`[查重] - 副标题匹配: ${subtitlesMatch} (源:"${sourceInfo.subtitleTitle}" vs 结果:"${item.subtitleTitle}")`);
                      console.log(`[查重] - 季号匹配: ${seasonMatch} (源:"${sourceInfo.season || 'null'}" vs 结果:"${item.season || 'null'}")`);
                      
                      // 【调试】详细显示标题比较过程
                      if (!mainTitlesMatch && !subtitlesMatch) {
                          console.log(`[查重] - 🔍 标题匹配失败详细分析:`);
                          console.log(`[查重] - 📝 源站完整标题: "${sourceInfo.title || ''}"`);
                          console.log(`[查重] - 📝 源站完整副标题: "${sourceInfo.subtitle || ''}"`);
                          console.log(`[查重] - 📝 搜索结果完整标题: "${item.title || ''}"`);
                          console.log(`[查重] - 📝 搜索结果完整副标题: "${item.subtitle || ''}"`);
                          console.log(`[查重] - 🎯 标准化后主标题对比: "${sourceInfo.mainTitle?.toLowerCase?.().replace(/[\s\.\-']/g, '') || ''}" vs "${item.mainTitle?.toLowerCase?.().replace(/[\s\.\-']/g, '') || ''}"`);
                          console.log(`[查重] - 🎯 标准化后副标题对比: "${sourceInfo.subtitleTitle || ''}" vs "${item.subtitleTitle || ''}" (经过简繁转换)`);
                      }

                      // 只有当标题匹配且季号匹配时，才通过筛选
                      if ((mainTitlesMatch || subtitlesMatch) && seasonMatch) {
                          // 额外检查：对于BluRay类型，确保子类型匹配
                          if ((sourceInfo.type === 'diy' || sourceInfo.type === 'original') && isBluRaySource(item.title, item.subtitle)) {
                              const itemBluRayType = getBluRaySubType(item.title, item.subtitle, item.tags, siteResult.site.key);
                              console.log(`[查重] ${siteResult.site.name} - BluRay筛选检查: 源(${sourceInfo.type}) vs 结果(${itemBluRayType}) - ${item.title}`);
                              if (itemBluRayType !== sourceInfo.type) {
                                  const reason = `BluRay子类型不匹配：源站为${sourceInfo.type}类型，但搜索结果为${itemBluRayType}类型。根据筛选规则，${sourceInfo.type === 'diy' ? 'DIY类型不匹配原盘结果' : '原盘类型不匹配DIY结果'}。`;
                                  failedItems.push({ ...item, failureReason: reason });
                                  console.log(`[查重] ${siteResult.site.name} - 初步筛选阶段过滤BluRay类型不匹配: 源(${sourceInfo.type}) vs 结果(${itemBluRayType}) - ${item.title}`);
                                  return;
                              } else {
                                  console.log(`[查重] ${siteResult.site.name} - BluRay类型匹配，通过筛选: 源(${sourceInfo.type}) vs 结果(${itemBluRayType}) - ${item.title}`);
                              }
                          }
                          // 设置搜索来源标识
                          let searchSource = 'main';
                          if (key === 'subtitleTitleResults') searchSource = 'sub';
                          if (key === 'imdbResults') searchSource = 'imdb';
                          passedItems.push({ ...item, searchSource });
                          console.log(`[查重] ${siteResult.site.name} - 通过筛选: ${item.title}`);
                      } else {
                          // 构建失败原因
                          let reason = '';
                          if (!mainTitlesMatch && !subtitlesMatch) {
                              reason = `主标题与副标题均不匹配。<br><small> - 主标题 (源："${esc(sourceInfo.mainTitle)}", 结果："${esc(item.mainTitle)}")</small><br><small> - 副标题 (源："${esc(sourceInfo.subtitleTitle)}", 结果："${esc(item.subtitleTitle)}")</small>`;
                          } else if (!seasonMatch) {
                              reason = `季号不匹配。<br><small> - 季号 (源："${sourceInfo.season || '无'}", 结果："${item.season || '无'}")</small>`;
                          }
                          failedItems.push({ ...item, failureReason: reason });
                          console.log(`[查重] ${siteResult.site.name} - 未通过筛选: ${item.title} - ${reason.replace(/<[^>]*>/g, '')}`);
                      }
                  });
                  newSiteResult[key] = { passedItems, failedItems };
              }
          });
          return newSiteResult;
      });
  }

  // 核心查重检查函数（独立的逻辑）
  async function performDupeCheck() {
    // 检测是否为支持的详情页面
    const isMTeamDetail = /\/detail\/\d+/.test(window.location.pathname);
    const isTraditionalDetail = window.location.pathname.includes('details.php');

    if (!isMTeamDetail && !isTraditionalDetail) return;
    if (!isMTeamDetail && (!document.querySelector('h1#top') && !document.querySelector('h1') && !document.querySelector('.bg-content_bg'))) return;

    let initialInfo;
    const currentSiteKey = DOMAIN_TO_KEY[window.location.hostname];

    // MTeam站点需要等待React应用完全渲染
    if (currentSiteKey === 'mteam') {
      console.log('[查重] MTeam-开始等待页面完全加载...');
      initialInfo = await waitForMTeamPageLoad();
    } else {
      switch (currentSiteKey) {
          case 'hhc': initialInfo = extractHHC(document); break;
          case 'aud': initialInfo = extractAudiences(document); break;
          default: initialInfo = extractGenericDetails(document);
      }
    }

    const { title, subtitle, tags: initialTags, category, description, imdb } = initialInfo;

    const mainTitleInfo = extractMainTitle(title);
    const subtitleTitleInfo = extractSubtitleTitle(subtitle);
    
    // 季号优先从主标题提取，如果主标题没有则从副标题提取
    const season = mainTitleInfo.season || subtitleTitleInfo.season;
    
    // 年份提取（优先从主标题，其次副标题）
    const year = extractYear(title) || extractYear(subtitle);
    
    console.log(`[查重] 源站信息提取: 主标题季号=${mainTitleInfo.season || 'null'}, 副标题季号=${subtitleTitleInfo.season || 'null'}, 最终季号=${season || 'null'}, 年份=${year || 'null'}, IMDb=${imdb || 'null'}`);

    const     sourceInfo = {
        originalTitle: title,
        originalSubtitle: subtitle,
        mainTitle: mainTitleInfo.title,
        subtitleTitle: subtitleTitleInfo.title,
        season: season,
        year: year,
        imdb: imdb,
        tags: enhanceTagsFromText(initialTags, `${title} ${subtitle} ${description}`),
        category,
        releaseGroup: extractReleaseGroup(title),
        siteKey: currentSiteKey,
        type: (() => {
            const enhancedTags = enhanceTagsFromText(initialTags, `${title} ${subtitle} ${description}`);
            if (isRemuxSource(title, subtitle)) return 'remux';
            if (isWebDLSource(title, subtitle)) return 'web-dl';
            if (isBluRaySource(title, subtitle)) return getBluRaySubType(title, subtitle, enhancedTags, currentSiteKey);
            if (isEncodeSource(title)) return 'encode';
            return 'unknown';
        })()
    };

    if (!sourceInfo.mainTitle && !sourceInfo.subtitleTitle && !sourceInfo.originalTitle) {
        return updateSearchResults('无法提取关键标题信息，请检查页面结构或为该站添加专属解析器。');
    }

    showSearchPanel(sourceInfo);

    if (currentSiteKey === 'nvme' && sourceInfo.type === 'encode') {
      const titleLower = sourceInfo.originalTitle.toLowerCase();
      if (titleLower.includes('1080p') && titleLower.includes('x264') && titleLower.includes('10bit') && sourceInfo.category !== '动漫') {
        return updateSearchResults('规则校验失败：不可说站点不允许发布非动画类型的 1080p x264 10bit 资源。');
      }
      if (titleLower.includes('1080p') && titleLower.includes('x265') && sourceInfo.category !== '动漫') {
        return updateSearchResults('规则校验失败：不可说站点不允许发布非动画类型的 1080p x265 资源。');
      }
    }

    try {
      const enabledSites = SITES.filter(site => getEnabled(site.key) && site.key !== currentSiteKey);
      if (enabledSites.length === 0) return updateSearchResults('请先开启至少一个目标站点的开关');

      const allResults = await Promise.all(enabledSites.map(async site => {
        console.log(`[查重] 开始搜索站点: ${site.name}, mainTitle="${sourceInfo.mainTitle}", subtitleTitle="${sourceInfo.subtitleTitle}", imdb="${sourceInfo.imdb || 'null'}"`);
        
        const searches = [
          sourceInfo.mainTitle ? searchOneSite(site, sourceInfo.mainTitle, '0') : Promise.resolve({ site, items: [], error: null }),
          sourceInfo.subtitleTitle ? searchOneSite(site, sourceInfo.subtitleTitle, '0') : Promise.resolve({ site, items: [], error: null })
        ];
        
        // 如果有IMDb编号，增加IMDb搜索
        if (sourceInfo.imdb) {
          console.log(`[查重] ${site.name} - 准备执行IMDb搜索: "${sourceInfo.imdb}"`);
          searches.push(searchOneSite(site, sourceInfo.imdb, '4'));
        }
        
        const [mainTitleResults, subtitleTitleResults, imdbResults] = await Promise.all(searches);
        
        console.log(`[查重] ${site.name} - 搜索结果汇总: 主标题${mainTitleResults?.items?.length || 0}条, 副标题${subtitleTitleResults?.items?.length || 0}条, IMDb${imdbResults?.items?.length || 0}条`);
        
        return { site, mainTitleResults, subtitleTitleResults, imdbResults: imdbResults || { site, items: [], error: null } };
      }));

      const filteredResults = filterSearchResults(allResults, sourceInfo);

      let dupeResults = null;
      if (sourceInfo.type === 'remux') dupeResults = checkRemuxDupe(sourceInfo, filteredResults);
      else if (sourceInfo.type === 'web-dl') dupeResults = checkWebDLDupe(sourceInfo, filteredResults);
      else if (sourceInfo.type === 'diy' || sourceInfo.type === 'original') dupeResults = checkBluRayDupe(sourceInfo, filteredResults);
      else if (sourceInfo.type === 'encode') dupeResults = checkEncodeDupe(sourceInfo, filteredResults);

      const finalResultsWithValidation = (dupeResults || enabledSites.map(s=>({site:s.name, isDupe: false, reason: '未进行查重（类型未知）', matchedItems: []}))).map(result => {
        const siteInfo = SITES.find(s => s.name === result.site);
        const validation = validateResourceForSite(sourceInfo, siteInfo.key);
        return { ...result, validation };
      });

      updateSearchResults(null, filteredResults, sourceInfo, finalResultsWithValidation);
    } catch (error) {
      updateSearchResults('搜索失败：' + error.message);
    }
  }

  async function autoDetectDupe() {
    // 检查是否启用自动查询
    if (!getAutoQueryEnabled()) {
      console.log('[查重] 自动查询已关闭，不执行自动查重');
      return;
    }

    // 防止重复执行标记
    if (document.querySelector('#dupe-detection-completed')) return;
    const marker = document.createElement('div');
    marker.id = 'dupe-detection-completed';
    marker.style.display = 'none';
    document.body.appendChild(marker);

    console.log('[查重] 自动查询已开启，开始执行查重...');
    
    // 自动查询时显示面板
    panel.classList.add('show');
    toggleBtn.classList.add('active');
    console.log('[查重] 自动查询模式，面板自动显示');
    
    await performDupeCheck();
  }

  function showSearchPanel(sourceInfo) {
    panel.querySelector('.xs-head strong').textContent = '自动查重与规则校验';
    const tagsHtml = sourceInfo.tags.length > 0 ? `<div style="margin-bottom:6px"><strong>提取标签：</strong>${sourceInfo.tags.map(tag => `<span style="background:#e8f4fd;color:#1890ff;padding:2px 6px;border-radius:3px;font-size:11px;margin-right:4px">${esc(tag)}</span>`).join('')}</div>` : '';
    const groupHtml = sourceInfo.releaseGroup ? `<div><strong>发布小组：</strong>${esc(sourceInfo.releaseGroup)}</div>` : '';
    const typeText = sourceInfo.type === 'unknown'
        ? `<span style="color: red; font-weight: bold;">无法识别类型</span>`
        : esc(sourceInfo.type.toUpperCase());

    const imdbHtml = sourceInfo.imdb 
      ? `<div style="color:#9b59b6;"><strong>➤ IMDb：</strong><a href="https://www.imdb.com/title/${esc(sourceInfo.imdb)}/" target="_blank" rel="noopener noreferrer" style="color:#9b59b6;text-decoration:underline;">${esc(sourceInfo.imdb)}</a></div>` 
      : '';
    
    const sourceInfoHtml = `
      <div class="xs-group" style="border:1px solid #eee;border-radius:10px;margin-bottom:8px">
        <div class="xs-group-hd">源种子信息</div>
        <div class="xs-group-bd" style="padding:8px; font-size:12px; line-height:1.8;">
          <div><strong>原始标题：</strong>${esc(sourceInfo.originalTitle)}</div>
          <div><strong>原始副标题：</strong>${esc(sourceInfo.originalSubtitle)}</div>
          <div style="color:#0366d6;"><strong>➤ 搜索主标题：</strong>${esc(sourceInfo.mainTitle)}</div>
          <div style="color:#0366d6;"><strong>➤ 搜索副标题：</strong>${esc(sourceInfo.subtitleTitle)}</div>
          <div style="color:#28a745;"><strong>➤ 季号：</strong>${sourceInfo.season ? esc(sourceInfo.season) : '无'}</div>
          <div style="color:#ff6b6b;"><strong>➤ 年份：</strong>${sourceInfo.year ? sourceInfo.year : '无'}</div>
          ${imdbHtml}
          <div><strong>分类：</strong>${esc(sourceInfo.category)}</div>
          <div><strong>识别类型：</strong>${typeText}</div>
          ${groupHtml}
          ${tagsHtml}
        </div>
      </div>
      <div id="search-results">正在搜索中...</div>`;
    panel.querySelector('.xs-res').innerHTML = sourceInfoHtml;
  }

  function getItemType(item) {
    const { title, subtitle, tags, siteKey } = item;
    if (isRemuxSource(title, subtitle)) return 'Remux';
    if (isWebDLSource(title, subtitle)) return 'WEB-DL';
    if (isBluRaySource(title, subtitle)) {
        const subType = getBluRaySubType(title, subtitle, tags, siteKey);
        if (subType === 'diy') return 'Blu-ray DIY';
        if (subType === 'original') return '原盘';
    }
    if (isEncodeSource(title)) return 'Encode';
    return '无法识别类型';
  }

  function getItemTypeClass(itemType) {
    if (itemType === 'Remux') return 'remux';
    if (itemType === 'WEB-DL') return 'webdl';
    if (itemType === 'Blu-ray DIY') return 'diy';
    if (itemType === '原盘') return 'original';
    if (itemType === 'Encode') return 'encode';
    return '';
  }

  function isSameType(item, sourceInfo) {
    const sourceType = sourceInfo.type;
    if (sourceType === 'remux') return isRemuxSource(item.title, item.subtitle);
    if (sourceType === 'web-dl') return isWebDLSource(item.title, item.subtitle);
    if (sourceType === 'diy' || sourceType === 'original') {
        if (!isBluRaySource(item.title, item.subtitle)) return false;
        const itemBluRayType = getBluRaySubType(item.title, item.subtitle, item.tags);
        const isMatch = itemBluRayType === sourceType;

        // 调试日志：显示BluRay类型匹配情况
        if (!isMatch) {
          console.log(`[查重] BluRay子类型不匹配: 源(${sourceType}) vs 结果(${itemBluRayType}) - ${item.title}`);
        }

        return isMatch;
    }
    if (sourceType === 'encode') return isEncodeSource(item.title);
    return false;
  }

  function updateSearchResults(error, results = null, sourceInfo = null, dupeResults = null) {
    const resultsEl = document.querySelector('#search-results');
    if (!resultsEl) return;
    if (error) {
      resultsEl.innerHTML = `<div class="xs-msg xs-err">${esc(error)}</div>`;
      return;
    }

    let html = '';
    if (dupeResults) {
      html += `<div class="xs-group"><div class="xs-group-hd">查重与规则校验结果</div><div class="xs-group-bd" style="padding:8px;">`;
      for (const result of dupeResults) {
        const { validation } = result;
        let cardStyle, statusText, reasonText, matchedItemsHtml = '';
        if (!validation.allowed) {
          cardStyle = 'background:#ffebe6;border:1px solid #ffccc7;color:#cf1322';
          statusText = '🚫 禁止发布';
          reasonText = validation.reason;
        } else {
          if (result.isDupe) {
            cardStyle = 'background:#fffbe6;border:1px solid #ffe58f;';
            statusText = '⚠️ 发现重复';
          } else {
            cardStyle = 'background:#f6ffed;border:1px solid #b7eb8f;';
            statusText = '✅ 未发现重复';
          }
          reasonText = result.reason || '该站点允许发布此资源';
          if (result.matchedItems && result.matchedItems.length > 0) {
            matchedItemsHtml = '<div style="margin-top:6px;"><strong>匹配项：</strong>';
            result.matchedItems.forEach((item, index) => {
                // --- 核心改进：丰富匹配项的展示信息 ---
                const itemType = getItemType(item);
                const typeClass = getItemTypeClass(itemType);
                const typeBadge = `<span class="item-type ${typeClass}" style="margin-left: 8px; font-size: 10px;">${esc(itemType)}</span>`;
                const seasonInfo = item.season ? `<span class="season-info" style="color: #666; font-size: 11px; margin-left: 4px;">[${item.season}]</span>` : '';
                const yearInfo = item.year ? `<span class="year-info" style="color: #999; font-size: 11px; margin-left: 2px;">[${item.year}]</span>` : '';

                const subtitleHtml = item.subtitle ? `<div class="xs-sub" style="font-size: 11px; margin-left: 10px; margin-top: 3px;">${esc(item.subtitle)}</div>` : '';
                const tagsHtml = item.tags && item.tags.length > 0 ? `<div class="xs-tags" style="margin-top: 5px; margin-left: 10px;">${item.tags.map(t => `<span class="xs-tag">${esc(t)}</span>`).join('')}</div>` : '';
                const hr = index < result.matchedItems.length - 1 ? '<hr style="margin: 6px 0; border: none; border-top: 1px dashed #ddd;">' : '';

                matchedItemsHtml += `<div>
                                      <div style="display: flex; align-items: flex-start; gap: 8px;">
                                        <a href="${item.link}" target="_blank" style="text-decoration:none; flex: 1;">${esc(item.title)}${seasonInfo}${yearInfo}</a>
                                        ${typeBadge}
                                      </div>
                                      ${subtitleHtml}
                                      ${tagsHtml}
                                      ${hr}
                                    </div>`;
                // --- 改进结束 ---
            });
            matchedItemsHtml += '</div>';
          }
        }
        html += `<div style="padding:8px;margin-bottom:8px;border-radius:6px;font-size:12px;${cardStyle}"><div style="display:flex;justify-content:space-between;margin-bottom:4px;font-weight:bold;"><span>${esc(result.site)}</span><span>${statusText}</span></div><div style="color:#666;font-size:11px;">${esc(reasonText)}</div>${matchedItemsHtml}</div>`;
      }
      html += '</div></div>';
    }

    if (results) {
        const renderResultList = (items) => {
            if (!items || items.length === 0) return '<div class="xs-msg" style="padding: 5px; margin: 0;">无结果</div>';
            return items.map(item => {
                const itemType = getItemType(item);
                const typeClass = getItemTypeClass(itemType);
                const seasonInfo = item.season ? `<span class="season-info" style="color: #666; font-size: 12px; margin-left: 8px;">[${item.season}]</span>` : '';
                const yearInfo = item.year ? `<span class="year-info" style="color: #999; font-size: 12px; margin-left: 4px;">[${item.year}]</span>` : '';
                return `
              <div class="xs-card" style="margin-top: 4px; padding: 6px;">
                <div style="display: flex; align-items: flex-start; margin-bottom: 4px; gap: 8px;">
                  <a class="xs-title" href="${item.link}" target="_blank" style="flex: 1;">${esc(item.title)}${seasonInfo}${yearInfo}</a>
                  <span class="item-type ${typeClass}" style="flex-shrink: 0;">${esc(itemType)}</span>
                </div>
                ${item.subtitle ? `<div class="xs-sub" style="font-size: 11px;">${esc(item.subtitle)}</div>` : ''}
                ${item.tags && item.tags.length ? `<div class="xs-tags" style="margin-top: 5px;">${item.tags.map(t => `<span class="xs-tag">${esc(t)}</span>`).join('')}</div>` : ''}
                ${item.failureReason ? `<div style="color: #c41a1a; font-size: 11px; margin-top: 4px; background: #fffbe6; padding: 3px 5px; border-radius: 3px;"><b>筛选失败:</b> ${item.failureReason}</div>` : ''}
              </div>`;
            }).join('');
        };

        html += '<div class="xs-group"><div class="xs-group-hd">原始搜索结果详情</div></div>';
        const searchResultContainer = document.createElement('div');
        searchResultContainer.innerHTML = html;

        results.forEach(siteResult => {
            const { site, mainTitleResults, subtitleTitleResults, imdbResults } = siteResult;
            let siteHtml = '';

            const processResultsForDisplay = (results, sourceInfo) => {
                const originalPassed = results.passedItems || [];
                const originalFailed = results.failedItems || [];

                const sameTypePassed = [];
                const differentTypePassed = [];

                originalPassed.forEach(item => {
                    if (isSameType(item, sourceInfo)) {
                        sameTypePassed.push(item);
                    } else {
                        const itemType = getItemType(item);
                        const reason = `类型不匹配 (源: "${sourceInfo.type.toUpperCase()}", 此结果: "${itemType}")`;
                        differentTypePassed.push({ ...item, failureReason: reason });
                    }
                });
                const combinedFailed = [...differentTypePassed, ...originalFailed];
                return { passed: sameTypePassed, failed: combinedFailed };
            };

            if (sourceInfo.mainTitle && mainTitleResults) {
                const displayResults = processResultsForDisplay(mainTitleResults, sourceInfo);
                siteHtml += `<div class="xs-group" style="margin: 8px;"><div class="xs-group-hd" style="background:#f0f8ff;"><span>${esc(site.name)} - 主标题搜索 ("${esc(sourceInfo.mainTitle)}")</span></div>
                <div class="xs-group-bd">
                    <details open><summary>✅ 通过筛选的结果 (${displayResults.passed.length} 条)</summary>${renderResultList(displayResults.passed)}</details>
                    <details open><summary>❌ 未通过筛选的结果 (${displayResults.failed.length} 条)</summary>${renderResultList(displayResults.failed)}</details>
                </div></div>`;
            }

            if (sourceInfo.subtitleTitle && subtitleTitleResults) {
                const displayResults = processResultsForDisplay(subtitleTitleResults, sourceInfo);
                siteHtml += `<div class="xs-group" style="margin: 8px;"><div class="xs-group-hd" style="background:#f0f8ff;"><span>${esc(site.name)} - 副标题搜索 ("${esc(sourceInfo.subtitleTitle)}")</span></div>
                 <div class="xs-group-bd">
                    <details open><summary>✅ 通过筛选的结果 (${displayResults.passed.length} 条)</summary>${renderResultList(displayResults.passed)}</details>
                    <details open><summary>❌ 未通过筛选的结果 (${displayResults.failed.length} 条)</summary>${renderResultList(displayResults.failed)}</details>
                </div></div>`;
            }

            if (sourceInfo.imdb && imdbResults) {
                const displayResults = processResultsForDisplay(imdbResults, sourceInfo);
                siteHtml += `<div class="xs-group" style="margin: 8px;"><div class="xs-group-hd" style="background:#e6f7ff;"><span>${esc(site.name)} - IMDb搜索 ("${esc(sourceInfo.imdb)}")</span></div>
                 <div class="xs-group-bd">
                    <details open><summary>✅ 通过筛选的结果 (${displayResults.passed.length} 条)</summary>${renderResultList(displayResults.passed)}</details>
                    <details open><summary>❌ 未通过筛选的结果 (${displayResults.failed.length} 条)</summary>${renderResultList(displayResults.failed)}</details>
                </div></div>`;
            }
            if(siteHtml) searchResultContainer.innerHTML += siteHtml;
        });
       resultsEl.innerHTML = searchResultContainer.innerHTML;
    } else if (dupeResults) {
        resultsEl.innerHTML = html;
    }
  }

  function main() {
    const currentSiteKey = DOMAIN_TO_KEY[window.location.hostname];
    const isMTeam = currentSiteKey === 'mteam';

    const run = () => {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            if (isMTeam) {
              console.log('[查重] MTeam站点-DOMContentLoaded后延迟3秒启动...');
              setTimeout(autoDetectDupe, 3000);
            } else {
              autoDetectDupe();
            }
          });
        } else {
          if (isMTeam) {
            console.log('[查重] MTeam站点-页面已加载，延迟3秒启动...');
            setTimeout(autoDetectDupe, 3000);
          } else {
            autoDetectDupe();
          }
        }
    };

    // MTeam需要更长的初始延迟等待React应用启动
    const initialDelay = isMTeam ? 2000 : 500;
    if (isMTeam) {
      console.log('[查重] MTeam站点检测到，初始延迟2秒...');
    }
    setTimeout(run, initialDelay);
  }

  main();

})();