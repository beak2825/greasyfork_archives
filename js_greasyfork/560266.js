// ==UserScript==
// @name         B站番剧 → Bangumi 同步观看进度（自动匹配 + 页面提示）
// @name:zh-CN   B站番剧 → Bangumi 同步观看进度（自动匹配 + 页面提示）
// @name:en      Bilibili Bangumi → Bangumi Sync (Auto Match + Toast)
// @namespace    https://bgm.tv/
// @version      0.6.0
// @description       在 B 站番剧播放页自动同步观看进度到 Bangumi（自动匹配条目，并在页面内提示同步状态）。
// @description:en    Sync watched episode on Bilibili Bangumi play page to Bangumi with auto subject match and visible toasts.
// @description:zh-CN 在 B 站番剧播放页自动同步观看进度到 Bangumi（自动匹配条目，并在页面内提示同步状态）。
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      api.bgm.tv
// @connect      api.bilibili.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560266/B%E7%AB%99%E7%95%AA%E5%89%A7%20%E2%86%92%20Bangumi%20%E5%90%8C%E6%AD%A5%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6%EF%BC%88%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D%20%2B%20%E9%A1%B5%E9%9D%A2%E6%8F%90%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560266/B%E7%AB%99%E7%95%AA%E5%89%A7%20%E2%86%92%20Bangumi%20%E5%90%8C%E6%AD%A5%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6%EF%BC%88%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D%20%2B%20%E9%A1%B5%E9%9D%A2%E6%8F%90%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CFG = {
    watchThreshold: 0.90,
    minDurationSec: 6 * 60,
    pollVideoMs: 800,
    bgmApiPrefix: 'https://api.bgm.tv/v0',
    biliSeasonApiByEp: (epId) => `https://api.bilibili.com/pgc/view/web/season?ep_id=${epId}`,
    searchLimit: 10,
    userAgent: 'tm-bili2bgm/0.6 (tampermonkey)',
    toastDefaultMs: 6500,
  };

  const LS = {
    token: 'bgm_token',
    mapping: 'bili2bgm_mapping',                 // { [seasonId]: { subjectId:number, offset:number, auto?:boolean } }
    syncedEp: (epId) => `bili2bgm_synced_ep_${epId}`,
    warned: (key) => `bili2bgm_warned_${key}`,   // one-time flags
  };

  // ---------------- GM helpers ----------------
  function gmGet(key, defVal = null) {
    const v = GM_getValue(key);
    return (v === undefined) ? defVal : v;
  }
  function gmSet(key, val) { GM_setValue(key, val); }

  function warnOnce(key) {
    const k = LS.warned(key);
    if (gmGet(k, 0)) return false;
    gmSet(k, 1);
    return true;
  }

  function loadMapping() {
    const raw = gmGet(LS.mapping, '{}');
    try { return JSON.parse(raw); } catch { return {}; }
  }
  function saveMapping(obj) { gmSet(LS.mapping, JSON.stringify(obj)); }

  function gmRequest({ method, url, token, body }) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': CFG.userAgent,
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      GM_xmlhttpRequest({
        method,
        url,
        headers,
        data: body ? JSON.stringify(body) : undefined,
        timeout: 20000,
        onload: (resp) => {
          const text = resp.responseText || '';
          let json = null;
          try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }

          if (resp.status >= 200 && resp.status < 300) return resolve(json);
          const err = new Error(`HTTP ${resp.status} ${resp.statusText}: ${text.slice(0, 500)}`);
          err.status = resp.status;
          err.payload = json;
          return reject(err);
        },
        onerror: () => reject(new Error('Network error')),
        ontimeout: () => reject(new Error('Request timeout')),
      });
    });
  }

  // ---------------- UI: Toasts (no console needed) ----------------
  function ensureToastHost() {
    let host = document.getElementById('bili2bgm-toast-host');
    if (host) return host;

    host = document.createElement('div');
    host.id = 'bili2bgm-toast-host';
    host.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:16px',
      'z-index:999999',
      'display:flex',
      'flex-direction:column',
      'gap:10px',
      'max-width:360px',
      'pointer-events:none',
    ].join(';');

    document.documentElement.appendChild(host);
    return host;
  }

  function toast(message, opts = {}) {
    const {
      level = 'info',          // info | warn | error | success
      timeoutMs = CFG.toastDefaultMs,
      sticky = false,
      actions = [],            // [{text, onClick}]
    } = opts;

    const host = ensureToastHost();
    const card = document.createElement('div');
    card.style.cssText = [
      'pointer-events:auto',
      'padding:10px 12px',
      'border-radius:12px',
      'box-shadow:0 8px 24px rgba(0,0,0,0.18)',
      'background:#111',
      'color:#fff',
      'font-size:13px',
      'line-height:1.45',
      'border:1px solid rgba(255,255,255,0.08)',
    ].join(';');

    const head = document.createElement('div');
    head.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;gap:10px;';

    const title = document.createElement('div');
    title.style.cssText = 'font-weight:600;margin-bottom:4px;';
    title.textContent =
      level === 'success' ? 'bili2bgm：已完成' :
      level === 'error' ? 'bili2bgm：需要处理' :
      level === 'warn' ? 'bili2bgm：注意' :
      'bili2bgm：提示';

    const close = document.createElement('button');
    close.textContent = '×';
    close.setAttribute('aria-label', 'close');
    close.style.cssText = [
      'border:0',
      'background:transparent',
      'color:#fff',
      'font-size:16px',
      'cursor:pointer',
      'line-height:1',
      'padding:0 2px',
      'opacity:0.85',
    ].join(';');

    close.addEventListener('click', () => card.remove());

    head.appendChild(title);
    head.appendChild(close);

    const body = document.createElement('div');
    body.textContent = message;

    const footer = document.createElement('div');
    footer.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;';

    const palette = {
      info:   'rgba(88,160,255,0.35)',
      warn:   'rgba(255,200,88,0.35)',
      error:  'rgba(255,88,88,0.35)',
      success:'rgba(88,255,160,0.35)',
    };
    card.style.borderColor = palette[level] || palette.info;

    if (Array.isArray(actions) && actions.length) {
      actions.forEach(a => {
        const btn = document.createElement('button');
        btn.textContent = a.text || '操作';
        btn.style.cssText = [
          'border:1px solid rgba(255,255,255,0.25)',
          'background:rgba(255,255,255,0.06)',
          'color:#fff',
          'padding:6px 10px',
          'border-radius:10px',
          'cursor:pointer',
          'font-size:12px',
        ].join(';');
        btn.addEventListener('click', async () => {
          try { await a.onClick?.(); } catch (e) { console.warn('[bili2bgm] action failed:', e); }
        });
        footer.appendChild(btn);
      });
    }

    card.appendChild(head);
    card.appendChild(body);
    if (footer.childNodes.length) card.appendChild(footer);

    host.appendChild(card);

    if (!sticky) {
      window.setTimeout(() => {
        if (card && card.isConnected) card.remove();
      }, Math.max(1200, timeoutMs));
    }
  }

  function toastOnce(key, message, opts = {}) {
    if (!warnOnce(key)) return;
    toast(message, opts);
  }

  // ---------------- Bangumi API wrappers ----------------
  async function bgmEnsureWatching(token, subjectId) {
    const url = `${CFG.bgmApiPrefix}/users/-/collections/${subjectId}`;
    return gmRequest({ method: 'POST', url, token, body: { type: 3 } });
  }

  async function bgmGetSubjectEpisodeCollections(token, subjectId, offset = 0, limit = 100) {
    const url = `${CFG.bgmApiPrefix}/users/-/collections/${subjectId}/episodes?offset=${offset}&limit=${limit}`;
    return gmRequest({ method: 'GET', url, token });
  }

  async function bgmPutEpisodeWatched(token, episodeId) {
    const url = `${CFG.bgmApiPrefix}/users/-/collections/-/episodes/${episodeId}`;
    return gmRequest({ method: 'PUT', url, token, body: { type: 2 } });
  }

  async function bgmSearchSubjects(token, keyword, limit = CFG.searchLimit, offset = 0) {
    const url = `${CFG.bgmApiPrefix}/search/subjects?limit=${limit}&offset=${offset}`;
    const body = {
      keyword,
      sort: 'rank',
      filter: { type: [2] }, // 2=动画
    };
    return gmRequest({ method: 'POST', url, token, body });
  }

  // ---------------- Bilibili helpers ----------------
  function parseEpIdFromUrl() {
    const m = location.pathname.match(/\/bangumi\/play\/ep(\d+)/);
    return m ? Number(m[1]) : null;
  }
  function parseEpIdFromQuery() {
    const sp = new URLSearchParams(location.search);
    const v = sp.get('ep_id') || sp.get('epId');
    const n = v ? Number(v) : null;
    return Number.isFinite(n) ? n : null;
  }
  function getCurrentEpId() {
    return parseEpIdFromUrl() || parseEpIdFromQuery();
  }

  async function fetchBiliSeasonInfoByEp(epId) {
    const url = CFG.biliSeasonApiByEp(epId);
    const res = await fetch(url, { credentials: 'include' }).then(r => r.json());
    if (!res || res.code !== 0 || !res.result) {
      throw new Error(`Bilibili season API error: ${JSON.stringify(res).slice(0, 300)}`);
    }
    const r = res.result;
    const seasonId = r.season_id;
    const seasonTitle = r.season_title || r.title || '';
    const eps = Array.isArray(r.episodes) ? r.episodes : [];
    const cur = eps.find(e => Number(e.id) === Number(epId)) || null;

    // 修复：cur.index 可能不存在，但 cur.title 往往是 "12"
    let epIndex = null;
    if (cur) {
      const candidates = [
        cur.index,
        cur.title,
        cur.share_copy,
        cur.long_title,
      ].filter(Boolean);

      for (const raw of candidates) {
        const m = String(raw).match(/(\d+)/);
        if (m) { epIndex = parseInt(m[1], 10); break; }
      }
      if (!epIndex) console.warn('[bili2bgm] epIndex parse failed. cur=', cur);
    }

    const epTitle = cur ? (cur.long_title || cur.title || cur.index || '') : '';
    return { seasonId, seasonTitle, epId, epIndex, epTitle, episodes: eps };
  }

  // ---------------- Token / Binding ----------------
  function getTokenPassive() {
    const t = gmGet(LS.token, '');
    return t ? String(t).trim() : '';
  }

  async function ensureTokenInteractive() {
    let token = getTokenPassive();
    if (token) return token;

    token = prompt('请输入 Bangumi Access Token（只需一次，保存在 Tampermonkey 存储中）：') || '';
    token = token.trim();
    if (!token) throw new Error('未设置 Bangumi token');
    gmSet(LS.token, token);
    toast('Token 已保存。', { level: 'success' });
    return token;
  }

  function normTitle(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[·•・\-\–\—_:：,，.。!！?？'"“”‘’（）()\[\]【】]/g, '')
      .replace(/第?\d+季/g, '')
      .replace(/(完结|全集|正版|国语|日语|中字|中字版|TV版|剧场版|OVA|OAD)/g, '');
  }

  function lcsRatio(a, b) {
    if (!a || !b) return 0;
    const m = a.length, n = b.length;
    const dp = Array(n + 1).fill(0);
    let maxLen = 0;
    for (let i = 1; i <= m; i++) {
      let prev = 0;
      for (let j = 1; j <= n; j++) {
        const tmp = dp[j];
        dp[j] = (a[i - 1] === b[j - 1]) ? (prev + 1) : 0;
        prev = tmp;
        if (dp[j] > maxLen) maxLen = dp[j];
      }
    }
    return maxLen / Math.max(m, n);
  }

  function scoreSubject(biliTitle, item) {
    const a = normTitle(biliTitle);
    const b1 = normTitle(item?.name);
    const b2 = normTitle(item?.name_cn);
    if (b1 && (a.includes(b1) || b1.includes(a))) return 1.0;
    if (b2 && (a.includes(b2) || b2.includes(a))) return 0.98;
    return Math.max(lcsRatio(a, b1), lcsRatio(a, b2));
  }

  async function tryAutoMatchSubjectId(token, seasonTitle) {
    const kw1 = seasonTitle || '';
    const kw2 = String(seasonTitle || '').split(/[，,。！!？?：:]/)[0];

    const keywords = [kw1, kw2].map(s => String(s || '').trim()).filter(Boolean);
    let best = null, second = null;

    for (const kw of keywords) {
      let res;
      try {
        res = await bgmSearchSubjects(token, kw);
      } catch (e) {
        console.warn('[bili2bgm] bgm search failed:', e);
        continue;
      }

      const list = Array.isArray(res?.data) ? res.data : [];
      for (const item of list) {
        const s = scoreSubject(seasonTitle, item);
        if (!best || s > best.score) {
          second = best;
          best = { item, score: s, keyword: kw };
        } else if (!second || s > second.score) {
          second = { item, score: s, keyword: kw };
        }
      }

      if (best && best.score >= 0.92 && (!second || best.score - second.score >= 0.08)) break;
    }

    if (best && best.score >= 0.92 && (!second || best.score - second.score >= 0.08)) {
      return { subjectId: best.item.id, score: best.score, picked: best.item };
    }
    return { subjectId: null, score: best?.score || 0, picked: best?.item || null };
  }

  async function ensureBindingAutoOrInteractive({ seasonId, seasonTitle, token, interactive }) {
    const mapping = loadMapping();
    const exist = mapping[String(seasonId)];
    if (exist && exist.subjectId) return exist;

    if (!token) return null;

    // 自动匹配
    const auto = await tryAutoMatchSubjectId(token, seasonTitle);
    if (auto.subjectId) {
      const obj = { subjectId: auto.subjectId, offset: 0, auto: true };
      mapping[String(seasonId)] = obj;
      saveMapping(mapping);
      toast(`已自动匹配并绑定：${seasonTitle}\nsubjectId=${auto.subjectId}`, { level: 'success' });
      console.log('[bili2bgm] auto-bound subjectId=', auto.subjectId, 'score=', auto.score, auto.picked);
      return obj;
    }

    if (!interactive) return null;

    // 交互：候选列表
    let candidates = [];
    try {
      const res = await bgmSearchSubjects(token, seasonTitle);
      candidates = Array.isArray(res?.data) ? res.data.slice(0, 6) : [];
    } catch (e) {
      console.warn('[bili2bgm] candidate search failed:', e);
    }

    const options = candidates.map((x, i) => {
      const name = x.name_cn || x.name || '';
      return `${i + 1}. ${name} (id=${x.id})`;
    }).join('\n');

    const ans = prompt(
      `无法唯一自动匹配，请选择序号（1-${candidates.length}）或直接输入 Bangumi subjectId。\n\n` +
      `B站标题：${seasonTitle}\n\n候选：\n${options}\n`
    );

    if (!ans) return null;

    let subjectId = null;
    const n = Number(ans);
    if (Number.isFinite(n) && n >= 1 && n <= candidates.length) {
      subjectId = candidates[n - 1].id;
    } else {
      const m = String(ans).match(/(\d+)/);
      if (m) subjectId = Number(m[1]);
    }

    if (!subjectId || !Number.isFinite(subjectId) || subjectId <= 0) {
      toast('输入无效：未能解析 subjectId。', { level: 'error', sticky: false });
      return null;
    }

    const offsetStr = prompt(
      `可选：集数偏移 offset（默认 0）。\n` +
      `Bangumi集号 = B站集号 + offset\n\n请输入 offset（可为空）：`
    ) || '';
    const offset = offsetStr.trim() ? Number(offsetStr.trim()) : 0;

    const obj = { subjectId, offset: Number.isFinite(offset) ? offset : 0, auto: false };
    mapping[String(seasonId)] = obj;
    saveMapping(mapping);

    toast(`绑定已保存：subjectId=${subjectId} offset=${obj.offset}`, { level: 'success' });
    return obj;
  }

  async function findBgmEpisodeByIndex(token, subjectId, epIndex) {
    const limit = 100;
    let offset = 0;

    while (true) {
      const epsRes = await bgmGetSubjectEpisodeCollections(token, subjectId, offset, limit);
      const list = Array.isArray(epsRes?.data) ? epsRes.data : [];
      if (!list.length) break;

      let epColl = list.find(ec =>
        ec?.episode &&
        Number(ec.episode.type) === 0 &&
        Number(ec.episode.sort) === Number(epIndex)
      );

      if (!epColl && epIndex - 1 >= offset && epIndex - 1 < offset + list.length) {
        epColl = list[epIndex - 1 - offset];
      }

      if (epColl && epColl.episode && epColl.episode.id) return epColl;

      if (list.length < limit) break;
      offset += limit;
    }
    return null;
  }

  // ---------------- Sync core ----------------
  async function syncOnce(biliCtx, video, interactive = false) {
    const { seasonId, seasonTitle, epId } = biliCtx;

    if (!biliCtx.epIndex) {
      toastOnce(
        `no_epIndex_${epId}`,
        `无法解析当前集数，已跳过自动同步。\n（可尝试换一集或用“立即测试同步”查看详情）`,
        { level: 'warn' }
      );
      return;
    }

    const token = interactive ? await ensureTokenInteractive() : getTokenPassive();
    if (!token) {
      toastOnce(
        'no_token',
        '尚未设置 Bangumi Token，无法同步。',
        {
          level: 'error',
          sticky: true,
          actions: [{
            text: '设置 Token',
            onClick: async () => { await ensureTokenInteractive(); }
          }]
        }
      );
      return;
    }

    const bind = await ensureBindingAutoOrInteractive({
      seasonId: String(seasonId),
      seasonTitle,
      token,
      interactive,
    });

    if (!bind || !bind.subjectId) {
      toastOnce(
        `no_binding_${seasonId}`,
        `未能自动匹配 Bangumi 条目：\n${seasonTitle}`,
        {
          level: 'warn',
          sticky: true,
          actions: [{
            text: '自动匹配并绑定',
            onClick: async () => {
              await ensureBindingAutoOrInteractive({
                seasonId: String(seasonId),
                seasonTitle,
                token,
                interactive: true,
              });
            }
          }, {
            text: '手动绑定',
            onClick: async () => {
              // 走菜单同等效果：这里直接触发一次交互绑定即可
              await ensureBindingAutoOrInteractive({
                seasonId: String(seasonId),
                seasonTitle,
                token,
                interactive: true,
              });
            }
          }]
        }
      );
      return;
    }

    const subjectId = bind.subjectId;
    const epIndex = biliCtx.epIndex + (bind.offset || 0);
    if (epIndex <= 0) throw new Error(`修正后的集号 epIndex=${epIndex} 非法（检查 offset）`);

    try {
      await bgmEnsureWatching(token, subjectId);
    } catch (e) {
      // 非致命，但可提示一次
      if (warnOnce(`ensure_watch_fail_${subjectId}`)) {
        toast('已继续同步，但“设为在看”这一步失败（通常不影响）。', { level: 'warn' });
      }
      console.warn('[bili2bgm] ensure watching failed (non-fatal):', e);
    }

    const epColl = await findBgmEpisodeByIndex(token, subjectId, epIndex);
    if (!epColl || !epColl.episode || !epColl.episode.id) {
      toastOnce(
        `no_episode_${subjectId}_${epIndex}`,
        `未找到 Bangumi 对应分集（第${epIndex}集）。\n建议：调整 offset 或检查是否绑定了正确条目。`,
        { level: 'error', sticky: true }
      );
      throw new Error(`Bangumi episode not found: subjectId=${subjectId}, epIndex=${epIndex}`);
    }

    if (Number(epColl.type) === 2) {
      toastOnce(
        `already_watched_${subjectId}_${epIndex}`,
        `Bangumi 已是“看过”：${seasonTitle} 第${epIndex}集`,
        { level: 'success' }
      );
      gmSet(LS.syncedEp(epId), Date.now());
      console.log('[bili2bgm] already watched, skip.', epColl.episode);
      return;
    }

    await bgmPutEpisodeWatched(token, epColl.episode.id);

    toastOnce(
      `synced_${subjectId}_${epIndex}`,
      `已同步到 Bangumi：${seasonTitle} 第${epIndex}集 → 看过`,
      { level: 'success' }
    );

    gmSet(LS.syncedEp(epId), Date.now());
  }

  // ---------------- Menus / lifecycle ----------------
  let biliCtxCache = null;
  let syncing = false;
  let currentEpId = null;

  function setupMenus() {
    GM_registerMenuCommand('设置 Bangumi Token', async () => {
      try {
        const t = prompt('输入新的 Bangumi Access Token：') || '';
        if (t.trim()) {
          gmSet(LS.token, t.trim());
          toast('Token 已保存。', { level: 'success' });
        }
      } catch (e) {
        toast(`失败：${e.message || e}`, { level: 'error', sticky: true });
      }
    });

    GM_registerMenuCommand('对当前番剧自动匹配并绑定', async () => {
      try {
        const epId = getCurrentEpId();
        if (!epId) return toast('未检测到 epId（请打开 /bangumi/play/epxxxx 页面）', { level: 'warn' });

        const token = await ensureTokenInteractive();
        const ctx = await fetchBiliSeasonInfoByEp(epId);

        const bind = await ensureBindingAutoOrInteractive({
          seasonId: String(ctx.seasonId),
          seasonTitle: ctx.seasonTitle,
          token,
          interactive: true,
        });

        if (bind?.subjectId) {
          toast(`绑定成功：subjectId=${bind.subjectId} offset=${bind.offset || 0} ${bind.auto ? '(auto)' : ''}`, { level: 'success' });
        } else {
          toast('未绑定成功（可能搜索不到或你取消了操作）', { level: 'warn', sticky: true });
        }
      } catch (e) {
        console.warn(e);
        toast(`失败：${e.message || e}`, { level: 'error', sticky: true });
      }
    });

    GM_registerMenuCommand('手动绑定/修改当前番剧 subjectId', async () => {
      try {
        const epId = getCurrentEpId();
        if (!epId) return toast('未检测到 epId（请打开 /bangumi/play/epxxxx 页面）', { level: 'warn' });

        const ctx = await fetchBiliSeasonInfoByEp(epId);
        const mapping = loadMapping();

        const subjectIdStr = prompt(
          `当前番剧：${ctx.seasonTitle}\nseason_id=${ctx.seasonId}\n\n输入 Bangumi subjectId：`
        );
        if (!subjectIdStr) return;

        const subjectId = Number(String(subjectIdStr).trim());
        if (!Number.isFinite(subjectId) || subjectId <= 0) return toast('subjectId 非法', { level: 'error', sticky: true });

        const offsetStr = prompt('输入 offset（默认 0，可为空）：') || '';
        const offset = offsetStr.trim() ? Number(offsetStr.trim()) : 0;

        mapping[String(ctx.seasonId)] = { subjectId, offset: Number.isFinite(offset) ? offset : 0, auto: false };
        saveMapping(mapping);
        toast('绑定已保存。', { level: 'success' });
      } catch (e) {
        toast(`失败：${e.message || e}`, { level: 'error', sticky: true });
      }
    });

    GM_registerMenuCommand('立即测试同步（不等90%）', async () => {
      try {
        const epId = getCurrentEpId();
        if (!epId) return toast('未检测到 epId（请打开 /bangumi/play/epxxxx 页面）', { level: 'warn' });

        const ctx = await fetchBiliSeasonInfoByEp(epId);
        const v = document.querySelector('video');
        await syncOnce(ctx, v, true);
        toast('已触发一次同步（结果见提示）', { level: 'info' });
      } catch (e) {
        console.warn('[bili2bgm] test sync failed', e);
        toast(`测试失败：${e.message || e}`, { level: 'error', sticky: true });
      }
    });

    GM_registerMenuCommand('清除当前 ep 的已同步标记（用于测试）', () => {
      const epId = getCurrentEpId();
      if (!epId) return toast('未检测到 epId', { level: 'warn' });
      gmSet(LS.syncedEp(epId), 0);
      toast('已清除本地同步标记。', { level: 'success' });
    });
  }

  async function waitVideo() {
    for (;;) {
      const v = document.querySelector('video');
      if (v && Number.isFinite(v.duration) && v.duration > 0) return v;
      await new Promise(r => setTimeout(r, CFG.pollVideoMs));
    }
  }

  async function refreshCtx(epId) {
    try {
      biliCtxCache = await fetchBiliSeasonInfoByEp(epId);
    } catch (e) {
      console.warn('[bili2bgm] fetch bili season info failed:', e);
      biliCtxCache = null;
      toastOnce(`bili_api_fail_${epId}`, '获取B站番剧信息失败，自动同步可能不可用。', { level: 'warn', sticky: true });
    }
  }

  async function init() {
    setupMenus();

    const epId = getCurrentEpId();
    currentEpId = epId;

    if (epId) await refreshCtx(epId);

    // 让用户“日常可感知”：如果没 token，给出醒目提示 + 按钮
    if (!getTokenPassive()) {
      toastOnce(
        'need_token_banner',
        '尚未设置 Bangumi Token：自动同步暂不可用。',
        {
          level: 'warn',
          sticky: true,
          actions: [{ text: '设置 Token', onClick: async () => { await ensureTokenInteractive(); } }]
        }
      );
    }

    const video = await waitVideo();
    console.log('[bili2bgm] video detected, start listening...');

    video.addEventListener('timeupdate', async () => {
      const epIdNow = getCurrentEpId();
      if (epIdNow && epIdNow !== currentEpId) {
        currentEpId = epIdNow;
        await refreshCtx(epIdNow);
      }

      if (syncing) return;
      if (!video.duration || !Number.isFinite(video.duration)) return;
      if (video.duration < CFG.minDurationSec) return;

      const pct = video.currentTime / video.duration;
      if (pct < CFG.watchThreshold) return;

      const epIdEffective = currentEpId;
      if (!epIdEffective) return;

      const now = Date.now();
      const last = Number(gmGet(LS.syncedEp(epIdEffective), 0)) || 0;
      if (last && (now - last) < 30 * 24 * 3600 * 1000) return;

      syncing = true;
      try {
        const ctx = biliCtxCache || await fetchBiliSeasonInfoByEp(epIdEffective);
        await syncOnce(ctx, video, false);
      } catch (e) {
        console.warn('[bili2bgm] sync failed:', e);
        toastOnce(`sync_fail_${epIdEffective}`, `同步失败：${e.message || e}`, { level: 'error', sticky: true });
      } finally {
        syncing = false;
      }
    });
  }

  init().catch(e => {
    console.warn('[bili2bgm] init failed:', e);
    toastOnce('init_fail', `脚本初始化失败：${e.message || e}`, { level: 'error', sticky: true });
  });
})();
