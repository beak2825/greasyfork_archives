// ==UserScript==
// @name         C6 直播辅助
// @namespace    ui-preview-enhanced
// @version      0.9527
// @match        http*://*/htm_data/*/*/*
// @match        http*://*/htm_mob/*/*/*
// @match        http*://*/thread0806.php?*
// @match        http*://*/read.php?*
// @match        http*://*/index.php*
// @description  C6 直播辅助+盘口助手+直播助手
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      LGPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/564297/C6%20%E7%9B%B4%E6%92%AD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/564297/C6%20%E7%9B%B4%E6%92%AD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const NS = '__C6__';
  if (!window[NS]) window[NS] = {};
  const C6 = window[NS];

  // =1. 全局配置 (CONFIG)= //
  C6.CONFIG = {
    HOURS_LIMIT: 24,
    DELAY: 500,
    KEYS: {
      PREVIEW_DATA: 'preview_tid_data',
      SCORE_SITES: 'score_site_config',
      LIVE_DATE: 'preview_live_date',
      AUX_DATA: 'aux_panel_data',
      AUX_CONFIG: 'aux_panel_config'
    },
    REGEX: {
      LM: /賽事|赛事/,
      TIME: /比賽時間|時間|比赛时间|时间/,
      HOME: /主隊|主队|主/,
      HANDICAP: /讓球|让球|让|讓|盘口|平局/,
      AWAY: /客隊|客队|客/,
      IMG_MATCH: /賽馬|\[F1|波胆|分差/,
      IS_OVER_UNDER: /总分|大小球|大小|进球数/
    },
    WORDS: {
      FINISHED: ['完', '完结', '结束'],
      VOIDED: ['走', '走盘']
    }
  };

  // =2. 本地存储管理 (Storage)= //
  C6.storage = (function () {
    function loadData(key, def) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return def;
        return JSON.parse(raw);
      } catch (e) {
        return def;
      }
    }
    function saveData(key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        console.error('C6.saveData error', e);
      }
    }
    return { loadData, saveData };
  })();

  // =3. 状态管理 (State)= //
  C6.State = (function (CONFIG, storage) {
    return {
      panel: null,
      previewPanel: null,
      livePanel: null,
      previewVisible: false,
      liveVisible: false,
      scoreManagerVisible: false,
      isEditMode: false,
      previewData: storage.loadData(CONFIG.KEYS.PREVIEW_DATA, []),
      scoreSiteList: storage.loadData(CONFIG.KEYS.SCORE_SITES, [
        { name: '足球(007)', url: 'https://live.titan007.com/oldIndexall.aspx' },
        { name: '篮球(007)', url: 'https://lq3.titan007.com/nba.htm' }
      ]),
      auxData: storage.loadData(CONFIG.KEYS.AUX_DATA, { title: '', content: '', reply: '' }),
      auxConfig: storage.loadData(CONFIG.KEYS.AUX_CONFIG, { refreshSec: 120, autoSec: 120 })
    };
  })(C6.CONFIG, C6.storage);

  // =4. 工具函数 (Utils)= //
  C6.utils = (function (CONFIG) {
    function escapeHtml(str) {
      if (!str && str !== 0) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function generateUUID() {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ?
          r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    function parseTimeStr(str) {
      if (!str) return null;
      str = String(str).trim();
      if (/^\d{1,2}:\d{1,2}$/.test(str)) {
        const parts = str.split(':').map(s => parseInt(s, 10));
        const d = new Date();
        d.setHours(parts[0], parts[1], 0, 0);
        return d;
      }
      const safe = str.replace(/[年月]/g, '-').replace(/日/g, '').replace(/：/g, ':').replace(/[．。]/g, '.');
      const d = new Date(safe);
      return isNaN(d.getTime()) ? null : d;
    }

    function parseDeadline(str) {
      if (!str) return null;
      const safeStr = String(str).replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/g, '$1-$2-$3');
      const m = safeStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{2}):(\d{2})/);
      if (m) {
        return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5])).getTime();
      }
      return null;
    }

    function getDeadlinePlus15Min(deadlineTs) {
      const d = deadlineTs ?
        new Date(deadlineTs + 15 * 60 * 1000) : new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${day} ${hh}:${mm}`;
    }

    function normalizeStartTime(str) {
      if (!str) return '';
      let s = String(str).trim();
      s = s.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2})[:：](\d{1,2})/, (m, y, M, d, h, min) => {
        return `${y}-${String(M).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      });
      s = s.replace(/：/g, ':').replace(/[．。]/g, '.');
      s = s.replace(/(\d{4}-\d{2}-\d{2})\s+(\d{2})(\d{2})$/, (_, d, h, m) => `${d} ${h}:${m}`);
      s = s.replace(/(\d{4}-\d{2}-\d{2})\s+(\d{1,2})[:.](\d{1,2})$/, (_, d, h, m) => `${d} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      return s;
    }

    function isValidStartTimeStrict(str) {
      return /^\d{4}-\d{1,2}-\d{1,2}\s+\d{2}:\d{2}$/.test(String(str || ''));
    }

    function extractFirstBracket(title) {
      if (!title) return '';
      const s = String(title).trim();
      if (s.indexOf('[對賭]') !== -1) {
        const mOne = s.match(/^(\[[^\]]+\])/);
        return mOne ?
          mOne[1].trim() : '';
      }

      if (s.indexOf('[開盤]') !== -1) {
        const mTwo = s.match(/^(\[[^\]]+\]\s*\[[^\]]+\])/);
        if (mTwo) return mTwo[1].trim();
      }

      const m = s.match(/^(\[[^\]]+\]\s*)+/);
      return m ? m[0].trim() : '';
    }

    function extractTitleBrackets(title) {
      if (!title) return '';
      const m = String(title).match(/^(\[[^\]]+\]\s*)+/);
      return m ? m[0].trim() : '';
    }

    function extractDeadlineTsFromTitle(title) {
      if (!title) return 0;
      let processedTitle = title.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/g, '$1-$2-$3');
      const m = processedTitle.match(/下注截止(?:时间|時間)[：:]\s*(\d{4}-\d{1,2}-\d{1,2}\s+\d{2}:\d{2})/);
      if (!m) return 0;
      const dateStr = m[1].replace(/-/g, '/');
      const ts = Date.parse(dateStr);
      return isNaN(ts) ? 0 : ts;
    }

    function sortPreviewDataByTitleDeadline() {
      C6.State.previewData.sort((a, b) => {
        const ta = extractDeadlineTsFromTitle(a.title);
        const tb = extractDeadlineTsFromTitle(b.title);
        if (!ta && !tb) return 0;
        if (!ta) return 1;
        if (!tb) return -1;
        return ta - tb;
      });
    }

    return {
      escapeHtml, generateUUID, parseTimeStr, parseDeadline, getDeadlinePlus15Min,
      normalizeStartTime, isValidStartTimeStrict, extractFirstBracket, extractTitleBrackets,
      extractDeadlineTsFromTitle, sortPreviewDataByTitleDeadline, CONFIG
    };
  })(C6.CONFIG);

  // =5. 比赛逻辑 (Match Logic)= //
  C6.match = (function (CONFIG, utils) {
    function calcMatchStatus(m) {
      if (!m) return '未开赛';
      if (m.status === '走盘') return '走盘';
      const now = Date.now();
      const startTime = utils.parseTimeStr(m.startTime);
      const started = !!(startTime && now >= startTime.getTime());
      const rawProgress = (m.progress || '').trim();
      const progress = rawProgress || '';
      const urlStat = (m.scoreUrlStatus || '').trim();

      const manualTouched = m._manualProgress || m._manualScore || m._manualResult;
      const norm = s => (s == null ? '' : String(s).trim());
      const eqIgnoreCase = (a, b) => norm(a).toLowerCase() === norm(b).toLowerCase();
      const isExact = (val, arr) => {
        if (!val) return false;
        for (const x of (arr || [])) { if (eqIgnoreCase(val, x)) return true; }
        return false;
      };

      if (isExact(progress, CONFIG.WORDS.VOIDED)) return '走盘';
      if (isExact(progress, CONFIG.WORDS.FINISHED)) return '已完结';
      if (!startTime || !started) return '未开赛';
      if (manualTouched || !urlStat || /失败|异常|error|超时/i.test(urlStat)) return '手动';
      return '自动';
    }

    function autoBuildResult(m) {
      if (!m) return '';
      if (m.isImageMatch) return '';
      if (m.status === '走盘') return '走盘';

      let hs = Number(m.homeScore);
      let as = Number(m.awayScore);

      const isOverUnder = CONFIG.REGEX.IS_OVER_UNDER.test(m.league || '');
      if (isOverUnder) {
        if (m.homeScore !== '' && m.homeScore != null) {
          if (m.awayScore === '' || m.awayScore == null) {
            as = 0;
          }
        }
      }

      if (m.homeScore === '' || m.homeScore == null) return '';
      if (!isOverUnder && (m.awayScore === '' || m.awayScore == null)) return '';
      if (isNaN(hs)) hs = 0;
      if (isNaN(as)) as = 0;

      const leagueText = m.league || '';
      const pk = String(m.handicap || '').trim();
      if (isOverUnder && /^(\d+(\.\d+)?)(\/\d+(\.\d+)?)?$/.test(pk)) {
        const total = hs + as;
        const parts = pk.includes('/') ? pk.split('/').map(Number) : [Number(pk)];
        const bigTeam = m.home || '大球';
        const smallTeam = m.away || '小球';
        let bigWin = 0, smallWin = 0;
        parts.forEach(p => {
          if (total > p) bigWin++;
          else if (total < p) smallWin++;
        });
        if (bigWin === 0 && smallWin === 0) return '走盘';
        if (bigWin > smallWin) return `${bigTeam}${bigWin < parts.length ?
          '（赢半）' : ''}`;
        if (smallWin > bigWin) return `${smallTeam}${smallWin < parts.length ? '（赢半）' : ''}`;
        return '';
      }
      return judgeHandicapResultWithHalf(m, hs, as);
    }

    function autoBuildSubResult(sub, mainM) {
      if (!sub) return '';
      if (sub.status === '走盘') return '走盘';
      const hs = Number(sub.homeScore);
      const as = Number(sub.awayScore);
      if (isNaN(hs) || isNaN(as)) return '';
      if (hs > as) return (mainM.home || '主队');
      if (as > hs) return (mainM.away || '客队');
      return '平';
    }

    function judgeHandicapResultWithHalf(m, hs, as) {
      const line = String(m.handicap || '').trim();
      if (!line && line !== '0') return '';

      const homeTeam = m.home || '主队';
      const awayTeam = m.away || '客队';
      const isHomeGive = line.startsWith('-');
      const raw = line.replace(/[+-]/g, '');
      const parts = raw.includes('/') ? raw.split('/').map(Number) : [Number(raw)];
      let homeWin = 0, awayWin = 0;
      parts.forEach(p => {
        const adj = isHomeGive ? -p : p;
        const diff = (hs - as) + adj;
        if (diff > 0) homeWin++;
        else if (diff < 0) awayWin++;
      });
      if (homeWin === 0 && awayWin === 0) return '走盘';
      if (homeWin > awayWin) {
        const half = homeWin < parts.length;
        return `${homeTeam}${half ? '（赢半）' : ''}`;
      }
      if (awayWin > homeWin) {
        const half = awayWin < parts.length;
        return `${awayTeam}${half ? '（赢半）' : ''}`;
      }
      return '';
    }

    function resultChar(m) {
      if (!m) return '*';
      if (m.status === '走盘') return '走';
      if (m.status === '已完结') {
        let r = (m.result || autoBuildResult(m) || '').trim();
        if (r === '走盘') return '走';
        if (!r) return '*';
        const isHalf = /赢半/.test(r);
        const clean = r.replace(/（.*?）/g, '');
        const isOverUnder = CONFIG.REGEX.IS_OVER_UNDER.test(m.league || '');

        if (m.home && clean.includes(m.home)) {
          if (isOverUnder) return isHalf ?
            '大(半)' : '大';
          return isHalf ? '主(半)' : '主';
        }
        if (m.away && clean.includes(m.away)) {
          if (isOverUnder) return isHalf ?
            '小(半)' : '小';
          return isHalf ? '客(半)' : '客';
        }
        return '*';
      }
      return '*';
    }

    function processOverUnderLogic(matches) {
      if (!matches || !matches.length) return;
      for (let i = 0; i < matches.length; i++) {
        const m = matches[i];
        if (CONFIG.REGEX.IS_OVER_UNDER.test(m.league) && i > 0) {
          const prevM = matches[i - 1];
          if (!m.progress && prevM.progress) {
            m.progress = prevM.progress;
          }

          if (prevM.homeScore !== '' && prevM.awayScore !== '' && prevM.homeScore != null && prevM.awayScore != null) {
            const sum = (Number(prevM.homeScore) || 0) + (Number(prevM.awayScore) || 0);
            if (m.homeScore != sum) {
              m.homeScore = sum;
              m.awayScore = '';
            }
          }

          if (m.homeScore !== '' && m.homeScore != null) {
            m.result = autoBuildResult(m);
          }
        }
      }
    }

    return { calcMatchStatus, autoBuildResult, autoBuildSubResult, judgeHandicapResultWithHalf, resultChar, processOverUnderLogic };
  })(C6.CONFIG, C6.utils);

  // =6. 数据抓取 (Fetcher)= //
  C6.fetcher = (function () {
    function fetchRawHTML(url) {
      return new Promise((resolve, reject) => {
        try {
          GM_xmlhttpRequest({
            method: 'GET', url: url, responseType: 'arraybuffer', timeout: 10000,
            onload: res => {
              try {
                const buffer = res.response;
                let html = '';
                try { html = new TextDecoder('utf-8').decode(buffer); } catch (e) { html = ''; }
                if (/charset\s*=\s*["']?(gbk|gb2312|gb18030)/i.test(html)) {
                  try { html = new TextDecoder('gbk').decode(buffer); } catch (e) { }
                }
                resolve(html);
              } catch (e) { reject(e); }
            },
            onerror: err => reject(err),
            ontimeout: () => reject(new Error('timeout'))
          });
        } catch (e) {
          reject(e);
        }
      });
    }

    function checkUrlStatus(url) {
      return new Promise(resolve => {
        if (!url ||
          !/^https?:\/\//i.test(url)) { resolve(''); return; }
        try {
          GM_xmlhttpRequest({
            method: 'GET', url: url, timeout: 5000,
            onload: res => resolve(res.status === 200 ? '正常' : '异常'),
            onerror: () => resolve('异常'),
            ontimeout: () => resolve('超时')
          });
        } catch (e) { resolve('异常'); }
      });
    }

    function fetchRandomPoem() {
      return new Promise(resolve => {
        try {
          GM_xmlhttpRequest({
            method: 'GET', url: 'https://v1.hitokoto.cn/?encode=text&c=a&c=b&c=c&c=d&c=e&c=f&c=g&c=h&c=i&c=j&c=k&c=l', timeout: 5000,
            onload: res => {
              const text = (res.responseText || '').trim();
              resolve(text.replace(/\s+/g, ' '));
            },
            onerror: () => resolve(''),
            ontimeout: () => resolve('')
          });
        } catch (e) { resolve(''); }
      });
    }
    return { fetchRawHTML, checkUrlStatus, fetchRandomPoem };
  })();

  // =7. 解析器 (Parser)= //
  C6.parser = (function (utils, CONFIG) {
    function extractTidsFromTodayHTML(html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const rows = doc.querySelectorAll('tr');
      const nowSec = Math.floor(Date.now() / 1000);
      const LIMIT_SEC = (CONFIG.HOURS_LIMIT || 24) * 3600;
      const list = [];
      rows.forEach(tr => {
        if (!tr.classList.contains('tr3')) return;
        const tdTal = tr.querySelector('td.tal');
        if (!tdTal) return;
        const typeText = tdTal.textContent || '';
        if (!/\[(開盤|對賭)\]/.test(typeText)) return;
        const timeEl = tr.querySelector('span[data-timestamp]');
        if (!timeEl) return;
        const ts = parseInt((timeEl.dataset.timestamp || '').replace(/\D/g, ''), 10);
        if (!ts || (nowSec - ts > LIMIT_SEC)) return;
        const linkEl = tdTal.querySelector('h3 a');
        if (!linkEl) return;
        let tid = null;
        if (linkEl.id && /^t\d+$/.test(linkEl.id)) tid = linkEl.id.replace('t', '');
        else {
          const m = linkEl.href.match(/\/(\d+)\.html/) || linkEl.href.match(/tid=(\d+)/);
          if (m) tid = m[1];
        }
        if (!tid) return;
        const fullTitle = (linkEl.textContent || '').trim();
        let author = '未知';
        const authorEl = tr.querySelector('a.bl');
        if (authorEl) author = authorEl.textContent.trim();
        list.push({ tid, title: fullTitle, author, deadline: utils.parseDeadline(fullTitle), postTs: ts });
      });
      return list;
    }

    function parseReadPageMeta(html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const meta = { title: '', author: '', deadline: null };
      const h4 = doc.querySelector('h4');
      if (h4) {
        meta.title = h4.textContent.trim();
        meta.deadline = utils.parseDeadline(meta.title);
      }
      const authorB = doc.querySelector('th[rowspan="2"] > b');
      if (authorB) meta.author = authorB.textContent.trim();
      else {
        const bl = doc.querySelector('a.bl');
        if (bl) meta.author = bl.textContent.trim();
      }
      return meta;
    }

    function extractRawTablesFromHTML(html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const contentDiv = doc.querySelector('#conttpc');
      if (!contentDiv) return [];
      const tables = Array.from(contentDiv.querySelectorAll('table'));
      const rawTables = [];
      tables.forEach((table, tableIndex) => {
        const trs = Array.from(table.querySelectorAll('tr')).filter(tr => !tr.querySelector('td[colspan]'));
        if (trs.length < 2) return;
        const headerTds = Array.from(trs[0].querySelectorAll('td'));
        const headers = headerTds.map((td, i) => {
          const text = (td.textContent || '').replace(/\s+/g, '').trim();
          let role = null;
          if (CONFIG && CONFIG.REGEX) {
            if (CONFIG.REGEX.LM.test(text)) role = 'league';
            else if (CONFIG.REGEX.TIME.test(text)) role = 'time';
            else if (CONFIG.REGEX.HOME.test(text)) role = 'home';
            else if (CONFIG.REGEX.HANDICAP.test(text)) role = 'handicap';
            else if (CONFIG.REGEX.AWAY.test(text)) role = 'away';
          }
          return { index: i, text, role };
        });
        if (!headers.some(h => h.role === 'home') || !headers.some(h => h.role === 'away')) return;
        const rows = trs.slice(1).map(tr => {
          const tds = Array.from(tr.querySelectorAll('td'));
          return tds.map((td, i) => ({
            text: (td.textContent || '').trim(),
            rawHTML: td.innerHTML.trim(),
            role: headers[i]?.role || null
          }));
        });
        rawTables.push({ tableIndex, headers, rows, rawHTML: table.outerHTML });
      });
      if (rawTables.length === 0) {
        const contentDivText = contentDiv.textContent || '';
        const hasKeyword = (CONFIG && CONFIG.REGEX && CONFIG.REGEX.IMG_MATCH.test(contentDivText));
        const img = contentDiv.querySelector('img[data-link]');
        if (hasKeyword && img) {
          const imgLink = img.getAttribute('data-link');
          if (imgLink) return [{ isImage: true, url: imgLink }];
        }
      }
      return rawTables;
    }

    function rawTablesToMatches(rawTables, title) {
      const items = [];
      const titleDeadlineTs = utils.extractDeadlineTsFromTitle(title);
      const defaultStartTime = utils.getDeadlinePlus15Min(titleDeadlineTs);
      if (rawTables.length === 1 && rawTables[0].isImage) {
        items.push({
          _mid: utils.generateUUID(), isImageMatch: true, league: '图片盘口',
          home: rawTables[0].url, homeOdd: '', handicap: '', away: '', awayOdd: '',
          startTime: defaultStartTime, status: '未开赛', roundTag: utils.extractFirstBracket(title)
        });
        return items;
      }
      const parseTeamCell = (rawText) => {
        return { odd: '', name: String(rawText || '').trim() };
      };
      rawTables.forEach(rt => {
        rt.rows.forEach(row => {
          let league = '', rawTime = '', homeRaw = '', handicap = '', awayRaw = '';
          row.forEach(cell => {
            if (cell.role === 'league') league = cell.text;
            else if (cell.role === 'time') rawTime = cell.text;
            else if (cell.role === 'home') homeRaw = cell.text;
            else if (cell.role === 'handicap') handicap = cell.text;
            else if (cell.role === 'away') awayRaw = cell.text;
          });
          if (!homeRaw && !awayRaw && !league) return;
          const homeObj = parseTeamCell(homeRaw);
          const awayObj = parseTeamCell(awayRaw);

          const formattedTime = utils.normalizeStartTime(rawTime) || defaultStartTime;

          items.push({
            _mid: utils.generateUUID(),
            league, home: homeObj.name, homeOdd: '', handicap,
            away: awayObj.name, awayOdd: '',
            startTime: formattedTime, status: '未开赛',
            roundTag: utils.extractFirstBracket(title)
          });
        });
      });
      return items;
    }
    return { extractTidsFromTodayHTML, parseReadPageMeta, extractRawTablesFromHTML, rawTablesToMatches };
  })(C6.utils, C6.CONFIG);

  // =8. 数据操作 (Data Actions)= //
  C6.dataActions = (function (State, parser, fetcher, utils, storage, CONFIG, match) {
    async function rebuildTodayOddsLogic() {
      State.previewData.length = 0;
      State.auxData = { title: '', content: '', reply: '' };
      storage.saveData(CONFIG.KEYS.AUX_DATA, State.auxData);
      let listHtml = '';
      try {
        const res = await fetch('/thread0806.php?fid=23&search=today').then(r => r.text());
        listHtml = res;
      } catch (e) {
        alert('抓取今日列表失败');
        return;
      }
      const tids = parser.extractTidsFromTodayHTML(listHtml);
      if (!tids.length) {
        alert('未抓取到符合条件(类别/时间)的今日Tid');
        return;
      }
      for (const item of tids) {
        try {
          const readHtml = await fetcher.fetchRawHTML(`/read.php?tid=${item.tid}&toread=1`);
          const meta = parser.parseReadPageMeta(readHtml);
          const rawTables = parser.extractRawTablesFromHTML(readHtml);
          const unifiedItems = parser.rawTablesToMatches(rawTables, meta.title);
          match.processOverUnderLogic(unifiedItems);
          State.previewData.push({
            tid: item.tid, title: meta.title, author: meta.author || item.author || '未知',
            deadline: meta.deadline || item.deadline, extra: { items: unifiedItems }
          });
          await new Promise(res => setTimeout(res, CONFIG.DELAY || 300));
        } catch (e) {
          console.warn('rebuildTodayOddsLogic read error', item.tid, e);
        }
      }
      C6.utils.sortPreviewDataByTitleDeadline();
      storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
    }

    async function refreshSingleTid(tid) {
      const item = State.previewData.find(x => String(x.tid) === String(tid));
      if (!item) return;
      try {
        const html = await fetcher.fetchRawHTML(`/read.php?tid=${tid}&toread=1`);
        const meta = parser.parseReadPageMeta(html);
        const rawTables = parser.extractRawTablesFromHTML(html);
        const matches = parser.rawTablesToMatches(rawTables, meta.title || item.title);
        match.processOverUnderLogic(matches);

        item.extra.items = matches;
        storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
        const ev = new Event('render-preview');
        window.dispatchEvent(ev);
      } catch (e) {
        alert(`Tid ${tid} 刷新失败`);
      }
    }

    async function addCurrentPageSmart() {
      let tid = null;
      const m = location.href.match(/tid=(\d+)/) || location.href.match(/\/(\d+)\.html/);
      tid = m ? m[1] : null;
      let manualInput = null;
      let manualTitle = null;
      if (!tid) {
        tid = prompt("无法获取当前Tid，请输入Tid：", "");
        if (!tid) {
          manualTitle = prompt("请输入标题：", "手动添加比赛");
          if (!manualTitle) return;
          const promptText = "请输入盘口 (格式: [0.95]主队 +3.5 [0.95]客队) 或 图片链接：";
          manualInput = prompt(promptText, "");
          if (!manualInput) return;
          tid = "manual_" + Math.floor(Date.now() / 1000);
        }
      }
      if (State.previewData.find(d => String(d.tid) === String(tid))) {
        alert('该 Tid 已存在列表中！');
        return;
      }
      if (manualInput) {
        const matches = [];
        const deadlineTs = Date.now();
        const defaultStartTime = utils.getDeadlinePlus15Min(deadlineTs);
        const uuid = utils.generateUUID();
        if (/^https?:\/\/.+/.test(manualInput) && !/\[.*\]/.test(manualInput)) {
          matches.push({
            _mid: uuid, isImageMatch: true, league: '手动图片',
            home: manualInput, homeOdd: '', handicap: '', away: '', awayOdd: '',
            startTime: defaultStartTime, status: '未开赛', _isManual: true, roundTag: ''
          });
        } else {
          const regex = /^(.*?)\s+([+-]?\d+(?:\.\d+)?(?:\/[+-]?\d+(?:\.\d+)?)?)\s+(.*)$/;
          const mm = manualInput.match(regex);
          if (mm) {
            matches.push({
              _mid: uuid, league: '手动',
              homeOdd: '', home: mm[1].trim(), handicap: mm[2].trim(),
              awayOdd: '', away: mm[3].trim(),
              startTime: defaultStartTime, status: '未开赛', _isManual: true, roundTag: ''
            });
          } else {
            matches.push({
              _mid: uuid, league: '手动',
              home: manualInput, homeOdd: '', handicap: '', away: '', awayOdd: '',
              startTime: defaultStartTime, status: '未开赛', _isManual: true, roundTag: ''
            });
          }
        }
        match.processOverUnderLogic(matches);
        State.previewData.push({
          tid: String(tid), title: manualTitle || `手动 ${tid}`, author: '手动',
          deadline: deadlineTs, extra: { items: matches }
        });
      } else {
        try {
          const html = await fetcher.fetchRawHTML(`/read.php?tid=${tid}&toread=1`);
          const meta = parser.parseReadPageMeta(html);
          const rawTables = parser.extractRawTablesFromHTML(html);
          const matches = parser.rawTablesToMatches(rawTables, meta.title);
          match.processOverUnderLogic(matches);
          State.previewData.push({
            tid: String(tid), title: meta.title || `Tid ${tid}`, author: meta.author || '未知',
            deadline: meta.deadline, extra: { items: matches }
          });
        } catch (e) {
          alert('添加当前页失败');
          return;
        }
      }
      C6.utils.sortPreviewDataByTitleDeadline();
      storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
      const ev = new Event('render-preview');
      window.dispatchEvent(ev);
    }
    return { rebuildTodayOddsLogic, refreshSingleTid, addCurrentPageSmart };
  })(C6.State, C6.parser, C6.fetcher, C6.utils, C6.storage, C6.CONFIG, C6.match);

  // =9. 辅助功能 (Aux Actions)= //
  C6.auxActions = (function (State, utils, match, storage, CONFIG, fetcher) {
    async function buildAutoPostTitle() {
      const dateStr = (State.previewPanel && State.previewPanel.querySelector('#liveDateInput')?.value) || '';
      const randomTitleCheckbox = document.getElementById('chk_random_title');
      const useRandomPoem = randomTitleCheckbox ? randomTitleCheckbox.checked : true;

      let poem = '';
      if (useRandomPoem) {
        poem = await fetcher.fetchRandomPoem();
      }

      const parts = [];
      State.previewData.forEach(item => {
        const tag = utils.extractTitleBrackets(item.title);
        if (!tag) return;
        const all = item.extra.items || [];
        if (!all.length) return;
        const resultStr = all.map(m => match.resultChar(m)).join('');
        parts.push(`${tag}${resultStr}`);
      });
      return `${dateStr} ${poem}  ${parts.join(' ')}`.trim();
    }

    function buildLiveReplyHeader(m) {
      const round = m.roundTag ? `[${m.roundTag}]` : '';
      const league = m.league ?
        `[${m.league}]` : '';
      return round + league;
    }

    function buildLiveReplyBBCode(m) {
      if (m.isImageMatch) {
        return `[img]${m.home}[/img]\n状态：${m.status}`;
      }
      const homeVal = m.home || '';
      const awayVal = m.away || '';
      const homeScore = m.homeScore ?? '';
      const awayScore = m.awayScore ?? '';
      const hasAwayScore = (awayScore !== '' && awayScore != null);
      let text = (
        `[color=green]${homeVal}[/color]　` +
        `[color=#FF6600]${m.handicap || ''}[/color]　` +
        `[color=green]${awayVal}[/color] ` +
        `[color=orange]${m.progress || ''}[/color]\n` +
        `[size=4]` +
        `[backcolor=blue][color=white]　${homeScore}　[/color][/backcolor]`
      );
      if (hasAwayScore) {
        text += `　-　[backcolor=blue][color=white]　${awayScore}　[/color][/backcolor]`;
      }

      text += `[/size]`;

      if (m.subMatches && m.subMatches.length > 0) {
        m.subMatches.forEach(sub => {
          const subHs = sub.homeScore || '0';
          const subAs = sub.awayScore || '0';
          text += `\n${sub.league || '分盘'} ${subHs}-${subAs}`;
        });
        text += '\n';
      }
      return text;
    }

    function generateLiveReplyText(previewData) {
      const out = [];
      previewData.forEach(item => {
        const validMatches = (item.extra.items || []).filter(m => m.status === '自动' || m.status === '手动');
        if (validMatches.length === 0) return;

        const tag = utils.extractFirstBracket(item.title);

        if (tag) {
          out.push(tag);
        }

        validMatches.forEach(m => {
          if (m.homeScore === '' || m.homeScore == null) return;
          out.push(buildLiveReplyBBCode(m));
        });
      });
      return out.join('\n');
    }

    function buildTidTitle(item) {
      const d = item.deadline ?
        new Date(item.deadline) : null;
      const ym = d ? String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') : '';
      let body = (item.title || '').replace(/^Tid：\d+\s*/i, '').replace(/@\S+$/, '').trim();
      if (body.indexOf('[') !== -1) body = body.slice(body.indexOf('['));
      return `[tid=${item.tid}-23-${ym}]${item.author || '未知'}[/tid]${body}`;
    }

    function buildOddsBBCode(item) {
      const matches = item.extra.items || [];
      if (!matches.length) return '';
      const tidTitle = buildTidTitle(item);
      const tidTag = (tidTitle.match(/^\[tid=[^\]]+\][^\[]+\[\/tid\]/) || [''])[0];

      let bb = `[table][tr][td=7,1][align=center][b][color=red][size=4]${item.title.trim()}[/size][/color][/b]\n${tidTag}[/align][/td][/tr]`;
      bb += `[tr]` + ['开赛时间', '赛事', '主隊', '让球盘', '客隊', '比分', '赢盘球队']
        .map(h => `[td][align=center][b][color=purple][size=3]${h}\n[/size][/color][/b][/align][/td]`).join('') + `[/tr]`;
      matches.forEach((m, idx) => {
        if (m.isImageMatch) {
          bb += `[tr][td=7,1][align=center][img]${m.home}[/img][/align][/td][/tr]`;
          return;
        }
        const n = idx + 1;
        const timeText = m.startTime || `${item.date || ''} 待定${n}`;
        const leagueText = m.league || '';
        const homeText = m.home || '';
        const awayText = m.away || '';
        const handicapText = m.handicap || '';

        let scoreText = `比分${n}`;
        let winText = `赢盘${n}`;

        if (m.status === '已完结' || m.status === '走盘') {
          if (m.status === '走盘') {
            scoreText = m.progress || '走盘';
            winText = '走盘';
          } else {
            if (m.subMatches && m.subMatches.length > 0) {
              scoreText = m.subMatches.map(s => {
                const sh = (s.homeScore === '' || s.homeScore == null) ? '0' : s.homeScore;
                const sa = (s.awayScore === '' || s.awayScore == null) ? '0' : s.awayScore;
                return `${sh}:${sa}`;
              }).join(' ');
            } else {
              const isOverUnder = CONFIG.REGEX.IS_OVER_UNDER.test(leagueText);
              const hasHome = (m.homeScore !== '' && m.homeScore != null);
              const hasAway = (m.awayScore !== '' && m.awayScore != null);

              if (hasHome && hasAway) {
                scoreText = `${m.homeScore}:${m.awayScore}`;
              } else if (isOverUnder && hasHome) {
                scoreText = `${m.homeScore}`;
              } else {
                scoreText = `比分${n}`;
              }
            }
            winText = m.result || match.autoBuildResult(m) || `赢盘${n}`;
          }
        }
        bb += `[tr]` +
          `[td][align=center][b][color=green][size=3]${timeText}\n[/size][/color][/b][/align][/td]` +
          `[td][align=center][b][color=orange][size=3]${leagueText}\n[/size][/color][/b][/align][/td]` +
          `[td][align=center][b][color=green][size=3]${homeText}\n[/size][/color][/b][/align][/td]` +
          `[td][align=center][b][color=red][size=3]${handicapText}\n[/size][/color][/b][/align][/td]` +
          `[td][align=center][b][color=green][size=3]${awayText}\n[/size][/color][/b][/align][/td]` +
          `[td][align=center][b][color=red][size=3]${scoreText}\n[/size][/color][/b][/align][/td]` +
          `[td][align=center][b][color=blue][size=3]${winText}\n[/size][/color][/b][/align][/td]` +
          `[/tr]`;
      });
      return bb + `[/table]\n`;
    }

    async function updateAuxDataSmart(forceReply = false) {
      if (forceReply) {
        const replyText = generateLiveReplyText(State.previewData);
        State.auxData.reply = replyText;
      }
      const content = State.previewData.map(item => buildOddsBBCode(item)).join('\n\n');
      State.auxData.content = content;
      storage.saveData(CONFIG.KEYS.AUX_DATA, State.auxData);
    }

    return { buildAutoPostTitle, buildLiveReplyHeader, buildLiveReplyBBCode, generateLiveReplyText, buildTidTitle, buildOddsBBCode, updateAuxDataSmart };
  })(C6.State, C6.utils, C6.match, C6.storage, C6.CONFIG, C6.fetcher);

  // =10. 用户界面 (UI)= //
  C6.ui = (function (State, storage, CONFIG, utils, dataActions, auxActions, match, fetcher) {

    function buildClickableTidTag(text, tid) {
      const span = document.createElement('span');
      span.className = 'c6-tid-tag';
      span.textContent = text;
      span.style.cursor = 'pointer';
      span.title = '点击打开帖子';
      span.addEventListener('click', () => {
        window.open(`/read.php?tid=${tid}`, '_blank');
      });
      return span;
    }

    function createFloatButton() {
      if (document.getElementById('__c6_float_btn')) return;
      const btn = document.createElement('button');
      btn.id = '__c6_float_btn';
      btn.textContent = '直播辅助';
      Object.assign(btn.style, {
        position: 'fixed', right: '20px', bottom: '60px', zIndex: 999999,
        padding: '10px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'
      });
      btn.addEventListener('click', () => {
        if (!State.panel) return;
        State.panel.style.display = State.panel.style.display === 'none' ? 'block' : 'none';
      });
      document.body.appendChild(btn);
    }

    function createMainPanel() {
      if (State.panel) return;
      const style = document.createElement('style');
      style.textContent = `
        /* ===== 基础样式 ===== */
        .c6-panel {
          position: fixed;
          top: 10px; right: 10px; z-index: 99999;
          background: #fff; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          border-radius: 4px;
          font-family: sans-serif; font-size: 12px; color: #333;
          max-height: 90vh; display: flex; flex-direction: column; width: auto; max-width: 1000px;
        }
        .c6-panel-content { padding: 0; overflow-y: auto; overflow-x: auto; flex-grow: 1;
        }

        /* ===== 表格样式 ===== */
        .odds-table { width: 100%;
          border-collapse: collapse; min-width: 600px; table-layout: fixed; }
        .odds-table th, .odds-table td { padding: 6px 8px;
          border-bottom: 1px solid #eee; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .odds-table th { background: #fafafa; position: sticky; top: 0; z-index: 10;
        }
        .odds-table tr:hover { background: #f0f8ff;
        }

        /* ===== [可配置] 列宽定义区 ===== */
        .col-status     { width: 60px;
        }
        .col-time       { width: 120px;
        }
        .col-league     { width: 100px;
        }
        .col-home       { width: 120px;
        }
        .col-handicap   { width: 60px;
        }
        .col-away       { width: 120px;
        }
        .col-progress   { width: 80px;
        }
        .col-score      { width: 40px;
        }
        .col-result     { width: 100px;
        }
        .col-url-status { width: 40px;
        }
        .col-score-url  { width: 70px;
        }
        .col-op         { width: 80px;
        }

        /* 列具体样式 */
        .col-league { color: #666;
        }
        .col-time { color: #888;
        }
        .col-home, .col-away { font-weight: bold;
        }
        .col-home { text-align: right;
        }
        .col-away { text-align: left;
        }
        .col-score { font-weight: bold; color: #d00;
        }
        .col-handicap { color: #007bff;
        }

        /* 输入框适配 */
        .odds-table input { width: 100%;
          box-sizing: border-box; text-align: center; }
        .ipt-home { text-align: right !important;
        }
        .ipt-away { text-align: left !important;
        }

        /* 移动端适配 */
        @media screen and (max-width: 768px) {
            .c6-panel { top: 0 !important;
              right: 0 !important; left: 0 !important; bottom: 0 !important; width: 100% !important; max-width: 100% !important; max-height: 100vh !important; border-radius: 0;
            }
            .c6-panel-content { padding-bottom: 50px;
            }
            .odds-table { width: max-content !important; min-width: 100%;
            }
            .col-home, .col-away { min-width: 90px !important;
              white-space: normal !important; }
        }
      `;
      document.head.appendChild(style);
      State.panel = document.createElement('div');
      Object.assign(State.panel.style, {
        position: 'fixed', right: '20px', top: '20px', width: '380px', background: '#f9f9f9',
        border: '1px solid #999', fontSize: '13px', zIndex: 999998, display: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      });
      if (window.innerWidth < 600) {
        State.panel.style.width = '90%';
        State.panel.style.right = '5%';
      }

      const renderInputBlock = (label, key, extraHtml = '') => `
        <div style="padding:6px;border-bottom:1px solid #ddd;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <div style="display:flex;align-items:center;">
                <b>${label}</b>
                ${extraHtml}
              </div>
            <div class="aux-btn-group" data-key="${key}">
              <button data-action="clear" style="margin-right:2px;color:red;">清除</button>
              <button data-action="load">刷新</button>
              <button data-action="copy">复制</button>
            </div>
          </div>
          <textarea id="aux_${key}" style="width:100%;height:50px;resize:vertical;">${State.auxData[key] || ''}</textarea>
        </div>
      `;
      State.panel.innerHTML = `
        <div style="padding:8px;font-weight:bold;background:#ddd;border-bottom:1px solid #aaa;display:flex;justify-content:space-between;">
            <span>直播辅助控制台</span>
            <button onclick="this.parentElement.parentElement.style.display='none'" style="font-size:16px;">×</button>
        </div>
        ${renderInputBlock('发帖标题', 'title', '<label style="margin-left:10px;font-weight:normal;"><input type="checkbox" id="chk_random_title" checked> 随机诗句</label>')}
        ${renderInputBlock('发帖内容', 'content')}
        ${renderInputBlock('直播回复', 'reply')}
        <div style="padding:8px;display:flex;gap:8px;">
          <button data-action="open-preview" style="flex:1;padding:8px;background:#17a2b8;color:white;border:none;cursor:pointer;border-radius:4px;">打开盘口助手</button>
          <button data-action="open-live-from-panel" style="flex:1;padding:8px;background:#6f42c1;color:white;border:none;cursor:pointer;border-radius:4px;">打开直播助手</button>
        </div>
      `;
      State.panel.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action], .aux-btn-group button');
        if (!btn) return;
        const action = btn.dataset.action || btn.getAttribute('data-action');
        if (btn.closest('.aux-btn-group')) {
          const group = btn.closest('.aux-btn-group');
          const key = group.dataset.key;
          const textarea = State.panel.querySelector(`#aux_${key}`);

          if (btn.dataset.action === 'clear') {
            if (textarea) {
              textarea.value = '';
              State.auxData[key] = '';
              storage.saveData(CONFIG.KEYS.AUX_DATA, State.auxData);
            }
          } else if (btn.dataset.action === 'load') {
            (async () => {
              let result = '';
              if (key === 'title') {
                result = await auxActions.buildAutoPostTitle();
              } else if (key === 'content') {
                result = State.previewData.map(item => auxActions.buildOddsBBCode(item)).join('\n\n');
              } else if (key === 'reply') {
                result = auxActions.generateLiveReplyText(State.previewData);
              }
              if (result !== undefined) {
                textarea.value = result;
                State.auxData[key] = result;
                storage.saveData(CONFIG.KEYS.AUX_DATA, State.auxData);
              }
            })();
          } else if (btn.dataset.action === 'copy') {
            if (textarea) {
              textarea.select();
              document.execCommand('copy');
            }
          }
          return;
        }

        switch (action) {
          case 'open-preview':
            State.panel.style.display = 'none';
            togglePreview(true);
            break;
          case 'open-live-from-panel':
            State.panel.style.display = 'none';
            if (State.previewPanel) { State.previewPanel.style.display = 'none'; State.previewVisible = false; }
            State.livePanel.style.display = 'flex';
            State.liveVisible = true;
            renderLiveData();
            break;
        }
      });
      document.body.appendChild(State.panel);
    }

    function createPreviewUI() {
      if (State.previewPanel) return;
      State.previewPanel = document.createElement('div');
      State.previewPanel.className = 'preview-panel';
      Object.assign(State.previewPanel.style, {
        position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        width: 'calc(100vw - 40px)', height: 'calc(100vh - 40px)', maxWidth: '1400px', maxHeight: '900px',
        background: '#fff', border: '2px solid #555', zIndex: 999997, borderRadius: '4px',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)', display: 'none', flexDirection: 'column', overflow: 'hidden'
      });
      const header = document.createElement('div');
      header.className = 'preview-header-sticky';
      header.style.cssText = `padding:10px; background:#f0f0f0; border-bottom:1px solid #ccc; position:sticky; top:0; z-index:10;`;
      header.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; width:100%;">
          <strong style="font-size:16px;">盘口助手</strong>
          <span style="font-size:12px;color:#666;">直播日期:</span>
          <input type="text" id="liveDateInput" value="${storage.loadData(CONFIG.KEYS.LIVE_DATE, '')}" style="width:100px;text-align:center;">
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-left:10px;">
            <button class="preview-header-btn" data-action="toggle-edit">编辑盘口</button>
            <button class="preview-header-btn" data-action="refresh-all">重新获取盘口</button>
            <button class="preview-header-btn" data-action="toggle-score-mgr">比分地址管理</button>
            <button class="preview-header-btn" data-action="add-page">添加本页</button>
            <span style="border-left:1px solid #ccc;margin:0 6px;"></span>
            <button class="preview-header-btn" data-action="reload-ui">刷新界面</button>
            <button class="preview-header-btn" style="background:#28a745;color:white;"
                data-action="save-all">保存全部</button>
            <button class="preview-header-btn" style="background:#6f42c1;color:white;"
                data-action="open-live">打开直播助手</button>
          </div>
          <div style="margin-left:auto;">
            <button class="preview-header-btn" style="background:#dc3545;color:white;"
                data-action="close-preview">关闭</button>
          </div>
        </div>`;
      State.previewPanel.appendChild(header);
      const content = document.createElement('div');
      content.className = 'preview-content';
      content.style.cssText = `flex:1; overflow-y:auto; padding:10px;`;
      State.previewPanel.appendChild(content);

      const scoreMgr = document.createElement('div');
      scoreMgr.id = 'scoreManager';
      scoreMgr.style.cssText = `display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:520px; max-width:90vw; background:white; border:1px solid #888; padding:12px; box-shadow:0 8px 25px rgba(0,0,0,0.35); z-index:1000000;
      border-radius:6px;`;
      scoreMgr.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
          <strong>比分地址管理</strong>
          <button data-action="close-score-mgr">✕</button>
        </div>
        <div id="scoreSiteListDiv" style="max-height:240px; overflow-y:auto; margin-bottom:8px; border:1px solid #eee; padding:4px;"></div>
        <div style="display:flex;gap:6px;">
          <input id="newScoreName" placeholder="名称" style="width:90px;">
          <input id="newScoreUrl" placeholder="URL" style="flex:1;min-width:0;">
          <button data-action="add-score-site">添加</button>
        </div>`;
      State.previewPanel.appendChild(scoreMgr);
      State.previewPanel.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action], .edit-ctrl-btn');
        if (!btn) return;
        C6.events.handlePreviewClick(e);
      });
      State.previewPanel.addEventListener('change', (e) => { C6.events.handlePreviewChange(e); });
      State.previewPanel.addEventListener('input', (e) => { C6.events.handlePreviewInput(e); });
      State.previewPanel.addEventListener('focusout', (e) => { C6.events.handlePreviewBlur(e); });

      document.body.appendChild(State.previewPanel);
    }

    function createLiveUI() {
      if (State.livePanel) return;
      State.livePanel = document.createElement('div');
      Object.assign(State.livePanel.style, {
        position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        width: 'calc(100vw - 40px)', height: 'calc(100vh - 40px)', maxWidth: '1200px', maxHeight: '800px',
        background: '#fff', border: '2px solid #444', zIndex: 999996, display: 'none', flexDirection: 'column'
      });
      State.livePanel.innerHTML = `
        <div style="padding:10px;background:#f0f0f0;border-bottom:1px solid #ccc; display:flex;align-items:center;">
          <strong style="font-size:16px;">直播助手</strong>
          <div style="margin-left:auto;display:flex;gap:6px;">
            <button data-action="live-reload">刷新界面</button>
            <button data-action="live-save" style="background:#28a745;color:white;">保存全部</button>
            <button data-action="live-open-preview" style="background:#17a2b8;color:white;">打开盘口助手</button>
            <button data-action="live-close" style="background:#dc3545;color:white;">关闭</button>
          </div>
        </div>
        <div class="live-content" style="flex:1;overflow:auto;padding:10px;"></div>
      `;
      State.livePanel.addEventListener('click', (e) => { C6.events.handleLiveClick(e); });
      State.livePanel.addEventListener('input', (e) => { C6.events.handleLiveInput(e); });
      State.livePanel.addEventListener('focusout', (e) => { C6.events.handleLiveBlur(e); });
      document.body.appendChild(State.livePanel);
    }

    function renderScoreSiteList() {
      if (!State.previewPanel) return;
      const div = State.previewPanel.querySelector('#scoreSiteListDiv');
      if (!div) return;
      div.innerHTML = State.scoreSiteList.map((s, i) => `
        <div style="padding:4px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;">
          <span>${utils.escapeHtml(s.name)}</span>
          <button data-action="score-site-del" data-idx="${i}" style="color:red;font-size:10px;">删</button>
        </div>
      `).join('');
    }

    class SubMatchManager {
      static init(match) { if (!match.subMatches) match.subMatches = [];
      }
      static add(match) {
        this.init(match);
        const newSub = {
          _sid: (typeof utils !== 'undefined' && utils.generateUUID) ?
            utils.generateUUID() : (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2)),
          status: match.status ||
            '未开赛',
          league: `第${match.subMatches.length + 1}盘`,
          home: match.home,
          away: match.away,
          handicap: '0',
          startTime: match.startTime,
          progress: '', homeScore: '', awayScore: '', result: ''
        };
        match.subMatches.push(newSub);
        return newSub;
      }

      static createRowHTML(tidIdx, matchIdx, sub, subIdx, isEditMode) {
        const roAttr = isEditMode ?
          '' : 'readonly style="background:#f9f9f9;color:#666;"';

        return `
          <tr class="sub-match-row" data-tid-idx="${tidIdx}" data-match-idx="${matchIdx}" data-sub-idx="${subIdx}">
            <td>
               <div style="display:flex;align-items:center;">
                  <span style="color:#888;margin-right:2px;">↳</span>
                  <select class="ipt-status" style="flex:1;min-width:0;">
                      ${['自动','手动','未开赛','已完结','走盘'].map(v => `<option value="${v}" ${v === sub.status ? 'selected' : ''}>${v}</option>`).join('')}
                  </select>
               </div>
            </td>
            <td><input class="ipt-time" value="${sub.startTime || ''}"></td>
            <td><input class="ipt-league" value="${sub.league || `第${subIdx + 1}盘`}" ${roAttr}></td>
            <td><input class="ipt-home" value="${sub.home || ''}" ${roAttr}></td>
            <td><input class="ipt-handicap" value="${sub.handicap || ''}" ${roAttr}></td>
            <td><input class="ipt-away" value="${sub.away || ''}" ${roAttr}></td>
            <td><input class="ipt-progress" value="${sub.progress || ''}"></td>
            <td><input class="ipt-hscore" value="${sub.homeScore || ''}"></td>
            <td><input class="ipt-ascore" value="${sub.awayScore || ''}"></td>
            <td><input class="ipt-result" value="${sub.result || ''}"></td>
            <td></td>
            <td>
              ${isEditMode ? `<button data-action="del-sub-match" style="color:red;">删</button>` : ''}
            </td>
          </tr>
        `;
      }
    }
    window.SubMatchManager = SubMatchManager;

    function createMatchRowHTML(m, tidIdx, matchIdx) {
      if (m.isImageMatch) {
        return `
          <tr class="main-match-row" data-idx="${matchIdx}">
            <td>
              <select class="ipt-status">
                <option value="未开赛" ${m.status === '未开赛' ? 'selected' : ''}>未开赛</option>
                <option value="已完结" ${m.status === '已完结' ?
            'selected'
            :
            ''}>已完结</option>
                <option value="走盘" ${m.status === '走盘' ? 'selected' : ''}>走盘</option>
              </select>
            </td>
            <td colspan="11" style="text-align:center;">
              图片盘口：<a href="${m.home}" target="_blank">${m.home}</a>
            </td>
            ${State.isEditMode ?
            `<td><button data-action="match-del" style="color:red;">删</button></td>` : `<td></td>`}
          </tr>`;
      }

      const homeVal = m.home || '';
      const awayVal = m.away || '';
      let siteOpts = `<option value="">选择地址</option>`;
      State.scoreSiteList.forEach(s => {
        siteOpts += `<option value="${s.url}" ${s.url === m.scoreUrl ? 'selected' : ''}>${s.name}</option>`;
      });
      siteOpts += `<option value="__manual__">手动输入</option>`;

      const roAttr = 'data-lock="' + (State.isEditMode ? '0' : '1') + '"';
      let html = `
        <tr class="main-match-row" data-idx="${matchIdx}">
          <td>
            <select class="ipt-status">
              ${['自动','手动','未开赛','已完结','走盘'].map(v => `<option value="${v}" ${v === m.status ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </td>
          <td><input class="ipt-time" value="${m.startTime || ''}"></td>
          <td><input class="ipt-league" value="${m.league || ''}" ${roAttr}></td>
          <td><input class="ipt-home" value="${homeVal}" ${roAttr}></td>
          <td><input class="ipt-handicap" value="${m.handicap || ''}" ${roAttr}></td>
          <td><input class="ipt-away" value="${awayVal}" ${roAttr}></td>
          <td><input class="ipt-progress" value="${m.progress || ''}"></td>
          <td><input class="ipt-hscore" value="${m.homeScore || ''}"></td>
          <td><input class="ipt-ascore" value="${m.awayScore || ''}"></td>
          <td><input class="ipt-result" value="${m.result || ''}"></td>
          <td><input class="ipt-score-url-status" value="${m.scoreUrlStatus || ''}"></td>
          <td class="col-score-url">
            <select class="sel-score-site">${siteOpts}</select>
            <input class="ipt-score-manual" value="${m.scoreUrl || ''}" placeholder="http://.">
          </td>
          ${State.isEditMode ? `<td><button data-action="add-sub-match" style="color:blue;">分</button><button data-action="match-del" style="color:red;">删</button><button data-action="url-test" style="color:green;">测</button></td>` : `<td></td>`}
        </tr>
      `;

      const subs = m.subMatches || [];
      subs.forEach((sub, subIdx) => {
        html += SubMatchManager.createRowHTML(tidIdx, matchIdx, sub, subIdx, State.isEditMode);
      });

      return html;
    }

    function renderPreviewData() {
      if (!State.previewPanel) return;
      const container = State.previewPanel.querySelector('.preview-content');
      if (!container) return;
      container.innerHTML = '';
      if (!State.previewData.length) {
        container.innerHTML = '<div style="color:#999;text-align:center;margin-top:50px;">暂无数据，请点击“添加本页”或“重新获取盘口”</div>';
        return;
      }

      State.previewData.forEach((item, index) => {
        const block = document.createElement('div');
        block.className = 'tid-block';
        block.style.cssText = `border:1px solid #ccc; margin-bottom:15px; background:#fff; position:relative;`;
        block.dataset.tid = item.tid;
        block.dataset.index = index;
        const header = document.createElement('div');
        header.style.cssText = 'background:#f8f9fa; padding:8px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center;';
        const left = document.createElement('div');
        left.style.display = 'flex'; left.style.alignItems = 'center'; left.style.gap = '8px';
        const tidText = C6.auxActions.buildTidTitle(item);
        const tidTagEl = buildClickableTidTag(tidText, item.tid);
        left.appendChild(tidTagEl);
        header.appendChild(left);
        if (State.isEditMode) {
          const ctrl = document.createElement('div');
          ctrl.innerHTML = `
            <button class="edit-ctrl-btn" data-action="tid-refresh">刷</button>
            <button class="edit-ctrl-btn" data-action="tid-up">↑</button>
            <button class="edit-ctrl-btn" data-action="tid-down">↓</button>
            <button class="edit-ctrl-btn" data-action="tid-batch-sub" style="color:#007bff;">分</button>
            <button class="edit-ctrl-btn" style="color:red;"
                data-action="tid-del">删</button>
            <button class="edit-ctrl-btn" style="color:green;"
                data-action="tid-test">测</button>
          `;
          header.appendChild(ctrl);
        }
        block.appendChild(header);

        const allMatches = item.extra.items || [];
        let rowsHtml = allMatches.length === 0 ?
          `<tr><td colspan="13" style="padding:10px;color:#999;">无盘口数据</td></tr>` : allMatches.map((m, mIdx) => createMatchRowHTML(m, index, mIdx)).join('');
        const contentDiv = document.createElement('div');
        contentDiv.style.padding = '5px';
        contentDiv.innerHTML = `
          <table class="odds-table">
            <thead>
              <tr>
                <th class="col-status">状态</th>
                <th class="col-time">开赛时间</th>
                <th class="col-league">赛事</th>
                <th class="col-home">主队</th>
                <th class="col-handicap">盘口</th>
                <th class="col-away">客队</th>
                <th class="col-progress">进度</th>
                <th class="col-score">主</th>
                <th class="col-score">客</th>
                <th class="col-result">赛果</th>
                <th class="col-url-status">地址状态</th>
                <th class="col-score-url">比分地址</th>
                ${State.isEditMode ?
            `<th class="col-op">操作</th>` : ''}
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          ${State.isEditMode ?
            `<button style="margin-top:5px;font-size:12px;" data-action="match-add">+ 添加比分</button>` : ''}
        `;
        block.appendChild(contentDiv);
        container.appendChild(block);
      });
      bindScoreSiteToggle();
    }

    function createLiveRowHTML(m, isSub, tidIdx, matchIdx, subIdx) {
      if (m.isImageMatch) return '';
      const dataMid = m._mid ? `data-mid="${m._mid}"` : '';
      const extraData = isSub ? `data-tid-idx="${tidIdx}" data-match-idx="${matchIdx}" data-sub-idx="${subIdx}"` : `data-tid-idx="${tidIdx}" data-match-idx="${matchIdx}"`;
      if (isSub) {
        const label = m.league || '分盘';
        return `
          <tr class="live-sub-row" ${dataMid} ${extraData}>
            <td>${m.status}</td>
            <td colspan="3" style="padding-left:12px;text-align:left;">↳ ${utils.escapeHtml(label)}</td>
            <td><input class="live-progress" value="${m.progress || ''}"></td>
            <td><input class="live-hs" value="${m.homeScore || ''}"></td>
            <td><input class="live-as" value="${m.awayScore || ''}"></td>
            <td><input class="live-result" value="${m.result || ''}"></td>
          </tr>`;
      } else {
        return `
          <tr ${dataMid} ${extraData}>
            <td>${m.status}</td>
            <td>${utils.escapeHtml(m.home)}</td>
            <td>${utils.escapeHtml(m.handicap || '')}</td>
            <td>${utils.escapeHtml(m.away)}</td>
            <td><input class="live-progress" value="${m.progress || ''}"></td>
            <td><input class="live-hs" value="${m.homeScore || ''}"></td>
            <td><input class="live-as" value="${m.awayScore || ''}"></td>
            <td><input class="live-result" value="${m.result || ''}"></td>
          </tr>`;
      }
    }

    function renderLiveData() {
      if (!State.livePanel) return;
      const container = State.livePanel.querySelector('.live-content');
      if (!container) return;
      container.innerHTML = '';
      State.previewData.forEach((item, tidIdx) => {
        const matchesWithIdx = (item.extra.items || []).map((m, originalIdx) => ({ m, originalIdx })).filter(obj => ['自动', '手动'].includes(obj.m.status));
        if (!matchesWithIdx.length) return;
        const block = document.createElement('div');
        block.style.border = '1px solid #ccc';
        block.style.marginBottom = '12px';
        const liveHeader = document.createElement('div');
        liveHeader.style.cssText = 'background:#fafafa;padding:6px;font-weight:bold;display:flex; align-items:center; gap:8px;';
        const
          tidText = C6.auxActions.buildTidTitle(item);
        const tidTagEl = buildClickableTidTag(tidText, item.tid);
        liveHeader.appendChild(tidTagEl);
        block.appendChild(liveHeader);
        const tableWrapper = document.createElement('div');
        tableWrapper.innerHTML = `
          <table class="live-table odds-table">
            <thead>
              <tr>
                 <th class="col-status">状态</th>
                 <th class="col-home">主队</th>
                 <th class="col-handicap">盘口</th>
                 <th class="col-away">客队</th>
                 <th class="col-progress">进度</th>
                 <th class="col-score">主</th>
                 <th class="col-score">客</th>
                 <th class="col-result">赛果</th>
              </tr>
            </thead>
            <tbody>
              ${matchesWithIdx.map(obj => {
          const mainHtml = createLiveRowHTML(obj.m, false, tidIdx, obj.originalIdx);
          const subsHtml = (obj.m.subMatches || []).map((s, subIdx) => createLiveRowHTML(s, true, tidIdx, obj.originalIdx, subIdx)).join('');
          return mainHtml + subsHtml;
        }).join('')}
            </tbody>
          </table>
        `;
        block.appendChild(tableWrapper);
        container.appendChild(block);
      });
    }

    function updatePreviewRowUI(tr, m) {
      if (!tr || !m) return;
      const sel = tr.querySelector('.ipt-status');
      if (sel) {
        sel.value = m.status; sel.className = 'ipt-status';
      }
      const res = tr.querySelector('.ipt-result');
      if (res) res.value = m.result || '';
      const urlStat = tr.querySelector('.ipt-score-url-status');
      if (urlStat) urlStat.value = m.scoreUrlStatus || '';

      const hs = tr.querySelector('.ipt-hscore');
      if (hs) hs.value = m.homeScore || '';
      const as = tr.querySelector('.ipt-ascore');
      if (as) as.value = m.awayScore || '';
    }

    function togglePreview(show) {
      State.previewVisible = typeof show === 'boolean' ?
        show : !State.previewVisible;
      State.previewPanel.style.display = State.previewVisible ? 'flex' : 'none';
      if (State.previewVisible) {
        State.previewData.forEach(item => { (item.extra.items || []).forEach(m => { m.status = match.calcMatchStatus(m); }); });
        renderPreviewData();
      }
    }

    document.addEventListener('input', e => {
      const el = e.target;
      if (!el.matches('input[data-lock], textarea[data-lock]')) return;

      if (el.dataset.lock === '1') {
        el.value = el.dataset.oldValue ?? el.value;
      } else {
        el.dataset.oldValue = el.value;
      }
    });
    document.addEventListener('focusin', e => {
      const el = e.target;
      if (!el.matches('input[data-lock], textarea[data-lock]')) return;
      el.dataset.oldValue = el.value;
    });
    return {
      createFloatButton, createMainPanel, createPreviewUI, createLiveUI,
      renderScoreSiteList, renderPreviewData, renderLiveData, updatePreviewRowUI, togglePreview
    };
  })(C6.State, C6.storage, C6.CONFIG, C6.utils, C6.dataActions, C6.auxActions, C6.match, C6.fetcher);

  // =11. 事件处理 (Events)= //
  C6.events = (function (State, storage, CONFIG, utils, dataActions, auxActions, match, fetcher) {
    async function handlePreviewClick(e) {
      const target = e.target || (e && e.target) || e;
      const btn = target.closest ? target.closest('button[data-action], .edit-ctrl-btn') : null;
      if (!btn) return;
      const action = btn.dataset.action || btn.getAttribute('data-action');
      const tidBlock = btn.closest('.tid-block');


      const tidIdx = tidBlock ? parseInt(tidBlock.dataset.index) : -1;
      const tr
        = btn.closest('tr');
      const trIdx = tr ? parseInt(tr.dataset.idx) : -1;

      switch (action) {
        case 'close-preview':
          if (State.previewPanel) State.previewPanel.style.display = 'none';
          if (State.panel) State.panel.style.display = 'block';
          break;
        case 'toggle-edit':
          State.isEditMode = !State.isEditMode;

          btn.textContent = State.isEditMode ? '退出编辑' : '编辑盘口';
          btn.style.background = State.isEditMode ?
            '#ffc107' : '';
          if (!State.isEditMode) {
            syncPreviewDataFromUI();
            State.previewData.forEach(item => (item.extra.items || []).forEach(m => m.status = match.calcMatchStatus(m)));
          }
          C6.ui.renderPreviewData();
          break;
        case 'refresh-all':
          if (!confirm('将清空列表并重新抓取今日所有开盘帖，确定？\n注意：这也会清空直播辅助控制台的内容！')) return;
          State.previewPanel.querySelector('.preview-content').innerHTML = '<div style="padding:20px;text-align:center;">正在抓取中...</div>';
          await dataActions.rebuildTodayOddsLogic();
          if (State.panel) {
            const auxKeys = ['title', 'content', 'reply'];
            auxKeys.forEach(key => {
              const el = State.panel.querySelector(`#aux_${key}`);
              if (el) el.value = '';
            });
            State.auxData = { title: '', content: '', reply: '' };
            storage.saveData(CONFIG.KEYS.AUX_DATA, State.auxData);
          }
          const today = new Date();
          const dateStr = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
          const dateInput = State.previewPanel.querySelector('#liveDateInput');
          if (dateInput) dateInput.value = dateStr;
          storage.saveData(CONFIG.KEYS.LIVE_DATE, dateStr);
          C6.ui.renderPreviewData();
          break;
        case 'add-page':
          await dataActions.addCurrentPageSmart();
          C6.ui.renderPreviewData();
          break;
        case 'reload-ui':
          State.previewData = storage.loadData(CONFIG.KEYS.PREVIEW_DATA, []);
          C6.ui.renderPreviewData();
          break;
        case 'save-all':
          if (!canCommitPreviewUI()) {
            alert('存在不合法的时间格式，请修正后再保存');
            return;
          }
          syncPreviewDataFromUI();
          State.previewData.forEach(item => (item.extra.items || []).forEach(m => m.status = match.calcMatchStatus(m)));
          State.previewData.forEach(item => (item.extra.items || []).forEach(m => { if (m.status === '已完结') m.result = match.autoBuildResult(m) || m.result; }));
          State.previewData.forEach(item => match.processOverUnderLogic(item.extra.items));
          storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
          storage.saveData(CONFIG.KEYS.LIVE_DATE, State.previewPanel.querySelector('#liveDateInput').value);
          await auxActions.updateAuxDataSmart(false);
          alert('数据已保存');
          C6.ui.renderPreviewData();
          break;
        case 'toggle-score-mgr':
          State.scoreManagerVisible = !State.scoreManagerVisible;
          State.previewPanel.querySelector('#scoreManager').style.display = State.scoreManagerVisible ?
            'block' : 'none';
          if (State.scoreManagerVisible) C6.ui.renderScoreSiteList();
          break;
        case 'close-score-mgr':
          State.previewPanel.querySelector('#scoreManager').style.display = 'none';
          State.scoreManagerVisible = false;
          break;
        case 'add-score-site':
          {
            const name = State.previewPanel.querySelector('#newScoreName').value.trim();
            const url = State.previewPanel.querySelector('#newScoreUrl').value.trim();
            if (name && url) {
              State.scoreSiteList.push({ name, url });
              storage.saveData(CONFIG.KEYS.SCORE_SITES, State.scoreSiteList);
              C6.ui.renderScoreSiteList();
              State.previewPanel.querySelector('#newScoreName').value = '';
              State.previewPanel.querySelector('#newScoreUrl').value = '';
              C6.ui.renderPreviewData();
            }
          }
          break;
        case 'tid-refresh':
          if (!confirm('确认重新获取？(将清空当前Tid所有盘口)')) return;
          syncPreviewDataFromUI();
          await dataActions.refreshSingleTid(State.previewData[tidIdx].tid);
          C6.ui.renderPreviewData();
          break;
        case 'tid-up':
          syncPreviewDataFromUI();
          if (tidIdx > 0) {
            [State.previewData[tidIdx], State.previewData[tidIdx - 1]] = [State.previewData[tidIdx - 1], State.previewData[tidIdx]];
            storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
            C6.ui.renderPreviewData();
          }
          break;
        case 'tid-down':
          syncPreviewDataFromUI();
          if (tidIdx < State.previewData.length - 1) {
            [State.previewData[tidIdx], State.previewData[tidIdx + 1]] = [State.previewData[tidIdx + 1], State.previewData[tidIdx]];
            storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
            C6.ui.renderPreviewData();
          }
          break;
        case 'tid-del':
          if (!confirm('确认删除该 Tid 及其所有盘口吗？')) return;
          syncPreviewDataFromUI();
          State.previewData.splice(tidIdx, 1);
          storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
          C6.ui.renderPreviewData();
          break;
        case 'tid-test':
          {
            const block = btn.closest('.tid-block');
            if (!block) return;
            const curItem = State.previewData[tidIdx];
            const allMatches = curItem.extra.items || [];
            const rows = block.querySelectorAll('tbody tr.main-match-row');
            for (let i = 0; i < allMatches.length; i++) {
              const m = allMatches[i];
              if (!m || !m.scoreUrl) continue;
              const statusInput = rows[i]?.querySelector('.ipt-score-url-status');
              if (statusInput) statusInput.value = '检测中...';
              const res = await fetcher.checkUrlStatus(m.scoreUrl);
              m.scoreUrlStatus = res;
              if (statusInput) statusInput.value = res;
            }
          }
          break;
        case 'match-add':
          {
            syncPreviewDataFromUI();
            const currentTidData = State.previewData[tidIdx];
            currentTidData.extra.items.push({
              _mid: utils.generateUUID(), _isManual: true, startTime: utils.getDeadlinePlus15Min(),
              league: '', home: '', homeOdd: '', handicap: '', away: '', awayOdd: '', scoreUrl: '',
              status: '未开赛', progress: '', homeScore: '', awayScore: '', result: ''
            });
            storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
            C6.ui.renderPreviewData();
          }
          break;
        case 'match-del':
          if (!confirm('确认删除此盘口？')) return;
          syncPreviewDataFromUI();
          {
            const item = State.previewData[tidIdx];
            if (!item) return;
            item.extra.items.splice(trIdx, 1);
            storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
            C6.ui.renderPreviewData();
          }
          break;
        case 'score-site-del':
          if (!confirm('确认删除？')) return;
          {
            const siteIdx = parseInt(btn.dataset.idx);
            State.scoreSiteList.splice(siteIdx, 1);
            storage.saveData(CONFIG.KEYS.SCORE_SITES, State.scoreSiteList);
            C6.ui.renderScoreSiteList();
            C6.ui.renderPreviewData();
          }
          break;
        case 'tid-batch-sub': {
          syncPreviewDataFromUI();
          const tidBlock = btn.closest('.tid-block');
          const tidIdx = tidBlock ? parseInt(tidBlock.dataset.index) : -1;
          if (tidIdx === -1) return;
          const item = State.previewData[tidIdx];
          (item.extra.items || []).forEach(m => {
            if (!m.isImageMatch) {
              SubMatchManager.add(m);
            }
          });
          storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
          C6.ui.renderPreviewData();
        }
          break;
        case 'add-sub-match': {
          syncPreviewDataFromUI();
          const tr = btn.closest('tr');
          const matchIdx = parseInt(tr.dataset.idx);
          const tidBlock = btn.closest('.tid-block');
          const tidIdx = parseInt(tidBlock.dataset.index);
          const m = State.previewData[tidIdx].extra.items[matchIdx];
          SubMatchManager.add(m);
          storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
          C6.ui.renderPreviewData();
        }
          break;
        case 'del-sub-match':
          {
            if (!confirm('确认删除该子盘口？')) return;
            syncPreviewDataFromUI();
            const sTr = btn.closest('tr.sub-match-row');
            if (!sTr) break;
            const tidBlock = btn.closest('.tid-block');
            const tidIdx = tidBlock ? parseInt(tidBlock.dataset.index) : -1;
            const matchIdx = sTr.dataset.matchIdx ? Number(sTr.dataset.matchIdx) : -1;
            const subIdx = sTr.dataset.subIdx ? Number(sTr.dataset.subIdx) : -1;
            const item = State.previewData[tidIdx];
            if (!item) break;
            const m = (item.extra.items || [])[matchIdx];
            if (!m || !m.subMatches) break;
            m.subMatches.splice(subIdx, 1);
            storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
            C6.ui.renderPreviewData();
          }
          break;
        case 'open-live':
          if (State.previewPanel) {
            State.previewPanel.style.display = 'none';
            State.previewVisible = false;
          }
          if (State.livePanel) {
            State.livePanel.style.display = 'flex';
            State.liveVisible = true;
          }
          C6.ui.renderLiveData();
          break;
        case 'url-test':
          {
            const curItem = State.previewData[tidIdx];
            const tAll = curItem.extra.items || [];
            const tMatch = tAll[trIdx];
            if (tMatch && tMatch.scoreUrl) {
              const trRow = btn.closest('tr');
              const statusInput = trRow?.querySelector('.ipt-score-url-status');
              if (statusInput) statusInput.value = '检测中...';
              const res = await fetcher.checkUrlStatus(tMatch.scoreUrl);
              tMatch.scoreUrlStatus = res;
              if (statusInput) statusInput.value = res;
            }
          }
          break;
      }
    }

    function handlePreviewChange(e) {
      const el = e.target;
      const tr = el.closest('tr');
      if (!tr) return;
      syncPreviewDataFromUI();

      if (tr.classList.contains('main-match-row') && el.classList.contains('ipt-status')) {
        const tidIdx = parseInt(tr.closest('.tid-block').dataset.index);
        const matchIdx = parseInt(tr.dataset.idx);
        const m = State.previewData[tidIdx].extra.items[matchIdx];
        if (['已完结', '走盘'].includes(el.value)) {
          (m.subMatches || []).forEach(sub => { sub.status = el.value; });
          C6.ui.renderPreviewData();
        }
      }
      storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
    }

    function handlePreviewInput(e) {
      const el = e.target;
      const tr = el.closest('tr');
      if (!tr) return;
      const tidBlock = tr.closest('.tid-block');
      const tidIdx = Number(tidBlock.dataset.index);
      const matchIdx = Number(tr.dataset.idx !== undefined ? tr.dataset.idx : tr.dataset.matchIdx);
      const item = State.previewData[tidIdx];
      const m = item.extra.items[matchIdx];
      if (tr.classList.contains('main-match-row')) {
        if (el.classList.contains('ipt-progress')) m._manualProgress = true;
        if (el.classList.contains('ipt-hscore') || el.classList.contains('ipt-ascore')) m._manualScore = true;
        if (el.classList.contains('ipt-result')) m._manualResult = true;
        if (!['已完结', '走盘'].includes(m.status)) {
          m.status = match.calcMatchStatus(m);
        }
        if (el.classList.contains('ipt-hscore') || el.classList.contains('ipt-ascore')) {
          const r = match.autoBuildResult(m);
          if (r && m.result !== r) {
            m.result = r;
            const resultInput = tr.querySelector('.ipt-result');
            if (resultInput) resultInput.value = r;
          }
        }
      }
    }

    function handlePreviewBlur(e) {
      const ipt = e.target;
      const tr = ipt.closest('tr');
      if (!tr) return;

      if (ipt.classList.contains('ipt-time')) {
        const fixed = utils.normalizeStartTime(ipt.value);
        if (fixed !== ipt.value) {
          ipt.value = fixed;
          syncPreviewDataFromUI();
        }
        return;
      }

      if (tr.classList.contains('sub-match-row') && (ipt.classList.contains('ipt-hscore') || ipt.classList.contains('ipt-ascore'))) {
        syncPreviewDataFromUI();
        const tidIdx = Number(tr.dataset.tidIdx);
        const matchIdx = Number(tr.dataset.matchIdx);
        const subIdx = Number(tr.dataset.subIdx);
        const m = State.previewData[tidIdx].extra.items[matchIdx];
        const sub = m.subMatches[subIdx];
        const subRes = match.autoBuildSubResult(sub, m);
        sub.result = subRes;

        const subResInput = tr.querySelector('.ipt-result');
        if (subResInput) subResInput.value = subRes;
        let totalH = 0, totalA = 0;
        m.subMatches.forEach(s => {
          totalH += Number(s.homeScore) || 0;
          totalA += Number(s.awayScore) || 0;
        });
        m.homeScore = totalH;
        m.awayScore = totalA;
        m.result = match.autoBuildResult(m);

        const block = tr.closest('.tid-block');
        if (block) {
          const mainTr = block.querySelector(`tr.main-match-row[data-idx="${matchIdx}"]`);
          if (mainTr) C6.ui.updatePreviewRowUI(mainTr, m);
        }

        storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
        return;
      }

      if (tr.classList.contains('main-match-row')) {
        if (!ipt.classList.contains('ipt-hscore') && !ipt.classList.contains('ipt-ascore') && !ipt.classList.contains('ipt-progress')) return;
        syncPreviewDataFromUI();
        const tidIdx = Number(tr.closest('.tid-block').dataset.index);
        const matchIdx = Number(tr.dataset.idx);
        const m = State.previewData[tidIdx].extra.items[matchIdx];

        const r = match.autoBuildResult(m);
        if (r) m.result = r;

        match.processOverUnderLogic(State.previewData[tidIdx].extra.items);
        storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
        C6.ui.updatePreviewRowUI(tr, m);
      }
    }

    function handleLiveClick(e) {
      const action = e.target.dataset.action;
      if (action === 'live-close') {
        State.livePanel.style.display = 'none';
        State.liveVisible = false;
        if (State.panel) State.panel.style.display = 'block';
      }
      if (action === 'live-reload') {
        State.previewData = storage.loadData(CONFIG.KEYS.PREVIEW_DATA, []);
        C6.ui.renderLiveData();
      }
      if (action === 'live-save') {
        syncLiveDataToPreview();
        State.previewData.forEach(item => (item.extra.items || []).forEach(m => m.status = match.calcMatchStatus(m)));
        State.previewData.forEach(item => (item.extra.items || []).forEach(m => { if (m.status === '已完结') m.result = match.autoBuildResult(m) || m.result; }));
        State.previewData.forEach(item => match.processOverUnderLogic(item.extra.items));

        storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
        alert('数据已保存');
        auxActions.updateAuxDataSmart(true);
        C6.ui.renderLiveData();
        return;
      }
      if (action === 'live-open-preview') {
        State.livePanel.style.display = 'none';
        State.liveVisible = false;
        State.previewPanel.style.display = 'flex';
        State.previewVisible = true;
        C6.ui.renderPreviewData();
        return;
      }
    }

    function handleLiveInput(e) {
      const el = e.target;
      const tr = el.closest('tr');
      if (!tr) return;
    }

    function handleLiveBlur(e) {
      const ipt = e.target;
      if (!ipt.matches('.live-hs, .live-as, .live-progress, .live-result')) return;
      syncLiveDataToPreview();

      const tr = ipt.closest('tr');
      if (tr && tr.classList.contains('live-sub-row')) {
        const tidIdx = Number(tr.dataset.tidIdx);
        const matchIdx = Number(tr.dataset.matchIdx);
        const m = State.previewData[tidIdx].extra.items[matchIdx];

        const subIdx = Number(tr.dataset.subIdx);
        const sub = m.subMatches[subIdx];
        if (sub) {
          sub.result = match.autoBuildSubResult(sub, m);
          const resIpt = tr.querySelector('.live-result');
          if (resIpt) resIpt.value = sub.result;
        }

        let totalH = 0, totalA = 0;
        (m.subMatches || []).forEach(s => {
          totalH += Number(s.homeScore) || 0;
          totalA += Number(s.awayScore) || 0;
          s.result = match.autoBuildSubResult(s, m);
        });
        m.homeScore = totalH;
        m.awayScore = totalA;
        m.result = match.autoBuildResult(m);

        const mainTr = State.livePanel.querySelector(`tr:not(.live-sub-row)[data-tid-idx="${tidIdx}"][data-match-idx="${matchIdx}"]`);
        if (mainTr) {
          const h = mainTr.querySelector('.live-hs');
          const a = mainTr.querySelector('.live-as');
          const r = mainTr.querySelector('.live-result');
          if (h) h.value = m.homeScore;
          if (a) a.value = m.awayScore;
          if (r) r.value = m.result;
        }
      } else {
        const tidIdx = Number(tr.dataset.tidIdx);
        const matchIdx = Number(tr.dataset.matchIdx);
        const m = State.previewData[tidIdx].extra.items[matchIdx];

        match.processOverUnderLogic(State.previewData[tidIdx].extra.items);
        m.result = match.autoBuildResult(m);
        const resIpt = tr.querySelector('.live-result');
        if (resIpt) resIpt.value = m.result;
      }

      storage.saveData(CONFIG.KEYS.PREVIEW_DATA, State.previewData);
      auxActions.updateAuxDataSmart(true);
    }

    function syncPreviewDataFromUI() {
      const rows = document.querySelectorAll('.odds-table tbody tr');
      rows.forEach(tr => {
        const tidIdx = parseInt(tr.dataset.tidIdx || tr.closest('.tid-block')?.dataset.index);
        if (isNaN(tidIdx) || !State.previewData[tidIdx]) return;
        const item = State.previewData[tidIdx];
        const matchIdx = parseInt(tr.dataset.idx !== undefined ? tr.dataset.idx : tr.dataset.matchIdx);
        const m = item.extra.items[matchIdx];
        if (!m) return;

        const getVal = (sel) => tr.querySelector(sel)?.value || '';

        if
          (tr.classList.contains('main-match-row')) {
          m.status = getVal('.ipt-status') || m.status;
          m.startTime = getVal('.ipt-time');
          m.league = getVal('.ipt-league');
          m.home = getVal('.ipt-home');
          m.handicap = getVal('.ipt-handicap');
          m.away = getVal('.ipt-away');
          m.progress = getVal('.ipt-progress');
          m.homeScore = getVal('.ipt-hscore');
          m.awayScore = getVal('.ipt-ascore');
          m.result = getVal('.ipt-result');
          m.scoreUrl = getVal('.ipt-score-manual') || getVal('.sel-score-site');
        } else if (tr.classList.contains('sub-match-row')) {
          const subIdx = parseInt(tr.dataset.subIdx);
          if (m.subMatches && m.subMatches[subIdx]) {
            const sub = m.subMatches[subIdx];
            sub.status = getVal('.ipt-status') || sub.status;
            sub.startTime = getVal('.ipt-time');
            sub.league = getVal('.ipt-league');
            sub.home = getVal('.ipt-home');
            sub.handicap = getVal('.ipt-handicap');
            sub.away = getVal('.ipt-away');
            sub.progress = getVal('.ipt-progress');
            sub.homeScore = getVal('.ipt-hscore');
            sub.awayScore = getVal('.ipt-ascore');
            sub.result = getVal('.ipt-result');
          }
        }
      });
      State.previewData.forEach(item => match.processOverUnderLogic(item.extra.items));
    }

    function syncLiveDataToPreview() {
      if (!State.livePanel) return;
      const trs = State.livePanel.querySelectorAll('tbody tr');
      trs.forEach(tr => {
        const tidIdx = Number(tr.dataset.tidIdx);
        const matchIdx = Number(tr.dataset.matchIdx);
        const item = State.previewData[tidIdx];
        if (!item) return;
        const m = item.extra.items[matchIdx];
        if (!m) return;

        const get = sel => tr.querySelector(sel)?.value.trim() || '';

        if (tr.classList.contains('live-sub-row')) {
          const subIdx = Number(tr.dataset.subIdx);
          const sub = m.subMatches[subIdx];
          if (sub) {
            sub.progress = get('.live-progress');
            sub.homeScore = get('.live-hs');
            sub.awayScore = get('.live-as');
            sub.result = get('.live-result');
          }

        } else {
          m.progress = get('.live-progress');
          m.homeScore = get('.live-hs');
          m.awayScore = get('.live-as');
          m.result = get('.live-result');
          m.status = match.calcMatchStatus(m);
        }
      });
      State.previewData.forEach(item => match.processOverUnderLogic(item.extra.items));
    }

    function canCommitPreviewUI() {
      if (!State.previewPanel) return true;
      const blocks = State.previewPanel.querySelectorAll('.tid-block');
      for (const block of blocks) {
        const rows = block.querySelectorAll('tbody tr');
        for (const tr of rows) {
          const time = tr.querySelector('.ipt-time')?.value.trim();
          if (time && !utils.isValidStartTimeStrict(time)) return false;
        }
      }
      return true;
    }

    return {
      handlePreviewClick, handlePreviewChange, handlePreviewInput, handlePreviewBlur,
      handleLiveClick, handleLiveInput, handleLiveBlur,
      syncPreviewDataFromUI, syncLiveDataToPreview, canCommitPreviewUI
    };
  })(C6.State, C6.storage, C6.CONFIG, C6.utils, C6.dataActions, C6.auxActions, C6.match, C6.fetcher);

  // =12. 初始化与绑定 (Init)= //
  function initUI() {
    try {
      C6.ui.createFloatButton();
      C6.ui.createMainPanel();
      C6.ui.createPreviewUI();
      C6.ui.createLiveUI();

      window.addEventListener('render-preview', () => C6.ui.renderPreviewData());
      window.addEventListener('render-live', () => C6.ui.renderLiveData());
      window.addEventListener('sync-preview-ui', () => { if (C6.events && typeof C6.events.syncPreviewDataFromUI === 'function') C6.events.syncPreviewDataFromUI(); });
      window.addEventListener('sync-live-to-preview', () => { if (C6.events && typeof C6.events.syncLiveDataToPreview === 'function') C6.events.syncLiveDataToPreview(); });
      window.addEventListener('update-aux', (ev) => {
        const force = ev?.detail?.forceReply || false;
        if (C6.auxActions && typeof C6.auxActions.updateAuxDataSmart === 'function') C6.auxActions.updateAuxDataSmart(force);
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          C6.State.previewData.forEach(item => (item.extra.items || []).forEach(m => m.status = C6.match.calcMatchStatus(m)));
        }
      });
    } catch (err) { console.error('C6 initUI error', err); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

  function bindScoreSiteToggle() {
    const rows = document.querySelectorAll('.odds-table tbody tr');
    rows.forEach(tr => {
      const sel = tr.querySelector('.sel-score-site');
      const manualInput = tr.querySelector('.ipt-score-manual');
      const col = tr.querySelector('.col-score-url');
      if (!sel || !col) return;
      if (sel.value === '__manual__' || (manualInput && manualInput.value.trim())) {
        col.classList.add('manual-mode');
        if (manualInput) manualInput.style.display = 'block';
      } else {
        col.classList.remove('manual-mode');
        if (manualInput) manualInput.style.display
          = 'none';
      }
      sel.addEventListener('change', () => {
        if (sel.value === '__manual__') {
          col.classList.add('manual-mode');
          if (manualInput) manualInput.style.display = 'block';
        } else {
          col.classList.remove('manual-mode');
          if (manualInput) manualInput.style.display = 'none';
        }
      });
    });
  }
})();