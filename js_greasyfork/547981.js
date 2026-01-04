// ==UserScript==
// @name                 Bilibili Live URL Copy
// @name:zh-CN           Bilibili 直播流链接复制器
// @namespace            https://github.com/TZFC
// @version              1.1
// @description          Dropdown lists QNs from current_qn + accept_qn. Default selection = lowest fMP4 QN. On copy, query Bilibili gateway with that QN to get the correct URL/host. Prefers HLS fMP4.
// @description:zh-CN    下拉列出 current_qn + accept_qn。默认选中最低 fMP4 清晰度。点击复制时按所选清晰度请求网关返回正确 URL/主机。偏好 HLS fMP4。
// @author               tianzifangchen
// @match                *://live.bilibili.com/*
// @icon                 https://www.bilibili.com/favicon.ico
// @license              GPL-3.0
// @run-at               document-idle
// @grant                unsafeWindow
// @grant                GM_setClipboard
// @grant                GM_xmlhttpRequest
// @connect              api.live.bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/547981/Bilibili%20Live%20URL%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/547981/Bilibili%20Live%20URL%20Copy.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const qn_label_map = {
    30000: '杜比',
    25000: '默认',
    20000: '4K',
    15000: '2K',
    10000: '原画',
    400:   '蓝光',
    250:   '超清',
    150:   '高清',
    80:    '流畅'
  };

  // Prefer HLS fmp4 → HLS ts → FLV (fallback order only)
  const format_priority = { fmp4: 1, ts: 2, flv: 3 };

  function wait_for_element(query_selector, timeout_ms) {
    const start_time = Date.now();
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        const node = document.querySelector(query_selector);
        if (node) { clearInterval(timer); resolve(node); return; }
        if (Date.now() - start_time > timeout_ms) { clearInterval(timer); resolve(null); }
      }, 150);
    });
  }

  function safe_get(getter) { try { return getter(); } catch { return undefined; } }

  function get_room_id() {
    const neptune = unsafeWindow.__NEPTUNE_IS_MY_WAIFU__;
    const by_neptune = safe_get(() => neptune.roomInitRes.data.room_id);
    if (by_neptune) return Number(by_neptune);
    const m = location.pathname.match(/\/(\d+)/);
    return m ? Number(m[1]) : null;
  }

  function get_anchor_uid_from_page() {
    const neptune = unsafeWindow.__NEPTUNE_IS_MY_WAIFU__;
    const a = safe_get(() => neptune.roomInitRes.data.anchor_info.base_info.uid);
    const r = safe_get(() => neptune.roomInitRes.data.room_info.uid);
    const uid = Number(a || r || 0);
    return uid || 0;
  }

  function build_play_info_url(room_id_number) {
    return `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo` +
           `?room_id=${room_id_number}&protocol=0,1&format=0,1,2&codec=0,1&qn=10000&platform=web&dolby=5&panorama=1`;
  }

  function build_gateway_url(cid, mid, qn) {
    const cid_s = `cid=${cid}`;
    const mid_s = `mid=${mid || 0}`;
    const qn_s  = `qn=${qn}`;
    const fixed = 'pt=web&p2p_type=-1&net=0&free_type=0&build=0&feature=2&drm_type=0&cam_id=0';
    return `https://api.live.bilibili.com/xlive/play-gateway/master/url?${cid_s}&${mid_s}&${qn_s}&${fixed}`;
  }

  function gm_get_json(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { 'Accept': 'application/json' },
        onload: (res) => { try { resolve(JSON.parse(res.responseText)); } catch (e) { reject(e); } },
        onerror: reject
      });
    });
  }

  function gm_fetch_raw(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'text',
        onload: (r) => {
          const ct = (r.responseHeaders || '')
            .split(/\r?\n/).find(h => /^content-type:/i.test(h)) || '';
          resolve({
            text: r.responseText || '',
            contentType: ct.split(':')[1]?.trim().toLowerCase() || '',
            finalUrl: r.finalUrl || url,
            status: r.status
          });
        },
        onerror: reject
      });
    });
  }

  function depth_find_url(obj, keys) {
    const stack = [obj];
    while (stack.length) {
      const cur = stack.pop();
      if (!cur || typeof cur !== 'object') continue;
      for (const k of Object.keys(cur)) {
        const v = cur[k];
        if (keys.includes(k) && typeof v === 'string' && /^https?:\/\//.test(v)) return v;
        if (v && typeof v === 'object') stack.push(v);
      }
    }
    return null;
  }

  function extract_cid(play_info_json) {
    const cid = safe_get(() => play_info_json.data.playurl_info.playurl.cid)
             || safe_get(() => play_info_json.data.playurl_info.playurl.video_project.cid);
    return Number(cid || 0) || null;
  }

  function choose_direct_url_for_current_qn(play_info_json, target_qn) {
    const playurl = safe_get(() => play_info_json.data.playurl_info.playurl) || {};
    const streams = Array.isArray(playurl.stream) ? playurl.stream : [];
    let best = null, best_score = 1e9;

    for (const s of streams) {
      const formats = Array.isArray(s.format) ? s.format : [];
      for (const f of formats) {
        const fmt = String(f.format_name || '').toLowerCase(); // ts | fmp4 | flv
        const codecs = Array.isArray(f.codec) ? f.codec : [];
        for (const c of codecs) {
          if (Number(c.current_qn) !== Number(target_qn)) continue;
          const info = Array.isArray(c.url_info) ? c.url_info[0] : null;
          const host = info && info.host;
          const base = c.base_url;
          const extra = info && info.extra;
          if (host && base && extra) {
            const score = format_priority[fmt] ?? 99;
            if (score < best_score) {
              best_score = score;
              best = host + base + extra;
            }
          }
        }
      }
    }
    return best;
  }

  /**
   * Collect all QNs (current + accept).
   * Also collect QNs that are available specifically under HLS fMP4 formats,
   * using both current_qn and accept_qn advertised by those fMP4 codec entries.
   */
  function collect_qns_with_fmp4_bias(play_info_json) {
    const playurl = safe_get(() => play_info_json.data.playurl_info.playurl) || {};
    const streams = Array.isArray(playurl.stream) ? playurl.stream : [];

    const all_qn_set = new Set();
    const fmp4_qn_set = new Set();

    for (const s of streams) {
      const formats = Array.isArray(s.format) ? s.format : [];
      for (const f of formats) {
        const fmt = String(f.format_name || '').toLowerCase(); // ts | fmp4 | flv
        const codecs = Array.isArray(f.codec) ? f.codec : [];
        for (const c of codecs) {
          const cur = Number(c.current_qn);
          if (Number.isFinite(cur)) {
            all_qn_set.add(cur);
            if (fmt === 'fmp4') fmp4_qn_set.add(cur);
          }
          const acc = Array.isArray(c.accept_qn || c.acceptQn) ? (c.accept_qn || c.acceptQn) : [];
          for (const q of acc) {
            const n = Number(q);
            if (Number.isFinite(n)) {
              all_qn_set.add(n);
              if (fmt === 'fmp4') fmp4_qn_set.add(n);
            }
          }
        }
      }
    }

    const all_qns_sorted = Array.from(all_qn_set).sort((a, b) => a - b);
    const fmp4_qns_sorted = Array.from(fmp4_qn_set).sort((a, b) => a - b);
    return { all_qns_sorted, fmp4_qns_sorted };
  }

  function inject_styles() {
    const style = document.createElement('style');
    style.textContent = `
      .blmuc_wrap { display:inline-flex; gap:8px; align-items:center; }
      .blmuc_btn {
        padding: 4px 10px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        background-image: linear-gradient(135deg, #ff7ac6 0%, #8aa8ff 100%);
        color: #111;
        box-shadow: 0 2px 8px rgba(0,0,0,.15);
        transition: transform .08s ease, filter .15s ease;
      }
      .blmuc_btn:hover { filter: brightness(1.05); }
      .blmuc_btn:active { transform: translateY(1px); }
      .blmuc_sel {
        height: 26px;
        border-radius: 6px;
        padding: 0 8px;
        border: 1px solid var(--blmuc-border, #bbb);
        background: var(--blmuc-bg, #fff);
        color: var(--blmuc-fg, #222);
      }
      @media (prefers-color-scheme: dark) {
        .blmuc_btn { color: #000; }
        .blmuc_sel {
          --blmuc-bg: #1f1f1f;
          --blmuc-fg: #eaeaea;
          --blmuc-border: #444;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function create_controls() {
    const wrap = document.createElement('span');
    wrap.className = 'blmuc_wrap';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'blmuc_btn';
    btn.textContent = '复制直播流 URL';
    const sel = document.createElement('select');
    sel.className = 'blmuc_sel';
    sel.id = 'blmuc_quality_select';
    wrap.appendChild(btn);
    wrap.appendChild(sel);
    return { wrap, btn, sel };
  }

  function fill_quality_select(select_node, quality_numbers_asc) {
    select_node.innerHTML = '';
    for (const qn of quality_numbers_asc) {
      const opt = document.createElement('option');
      const label = qn_label_map[qn] ? `${qn_label_map[qn]} (${qn})` : `品质 ${qn}`;
      opt.value = String(qn);
      opt.textContent = label;
      select_node.appendChild(opt);
    }
  }

  function set_select_default_by_qn(select_node, target_qn) {
    const idx = Array.from(select_node.options).findIndex(o => Number(o.value) === Number(target_qn));
    select_node.selectedIndex = idx >= 0 ? idx : 0;
  }

  async function main() {
    if (!/https:\/\/live\.bilibili\.com\/(blanc\/)?\d+/.test(location.href)) return;

    inject_styles();

    const container =
      await wait_for_element('#head-info-vm .lower-row .right-ctnr', 180000) ||
      await wait_for_element('#head-info-vm .lower-row', 10000);
    if (!container) return;

    const { wrap, btn, sel } = create_controls();
    container.appendChild(wrap);

    const room_id = get_room_id();
    if (!room_id) { btn.textContent = '未获取房间号'; return; }

    let play_info;
    try { play_info = await gm_get_json(build_play_info_url(room_id)); }
    catch { btn.textContent = '加载失败'; return; }

    // Collect all QNs and fMP4-capable QNs
    const { all_qns_sorted, fmp4_qns_sorted } = collect_qns_with_fmp4_bias(play_info);
    if (all_qns_sorted.length === 0) { btn.textContent = '无可用清晰度'; return; }

    // Fill dropdown with ALL available QNs
    fill_quality_select(sel, all_qns_sorted);

    // DEFAULT: lowest fMP4 if present; else lowest overall
    const default_qn = (fmp4_qns_sorted.length > 0 ? fmp4_qns_sorted[0] : all_qns_sorted[0]);
    set_select_default_by_qn(sel, default_qn);

    const cid = extract_cid(play_info);
    const mid = get_anchor_uid_from_page();

    btn.addEventListener('click', async () => {
      const original = btn.textContent;
      try {
        const qn = Number(sel.value || default_qn);

        // Primary: gateway resolves correct host/URL for the target QN
        if (cid) {
          const gw_url = build_gateway_url(cid, mid, qn);
          const gw_res = await gm_fetch_raw(gw_url);

          let final_url = null;
          if (gw_res.text.trim().startsWith('{')) {
            try {
              const js = JSON.parse(gw_res.text);
              final_url = depth_find_url(js, ['master_url', 'm3u8_master_url']);
            } catch {}
          }
          if (!final_url) {
            const looks_m3u8 = gw_res.text.startsWith('#EXTM3U') ||
              /apple\.mpegurl|mpegurl|m3u8/.test(gw_res.contentType);
            if (looks_m3u8) final_url = gw_res.finalUrl;
          }
          if (final_url) {
            GM_setClipboard(final_url, { type: 'text', mimetype: 'text/plain' });
            btn.textContent = '已复制';
            setTimeout(() => btn.textContent = original, 1000);
            return;
          }
        }

        // Fallback: only if target QN exists as current_qn in payload
        const direct = choose_direct_url_for_current_qn(play_info, qn);
        if (direct) {
          GM_setClipboard(direct, { type: 'text', mimetype: 'text/plain' });
          btn.textContent = '已复制(直链)';
          setTimeout(() => btn.textContent = original, 1000);
          return;
        }

        btn.textContent = '未找到链接';
        setTimeout(() => btn.textContent = original, 1200);
      } catch (e) {
        console.log('[blmuc] 复制失败', e);
        btn.textContent = '出错';
        setTimeout(() => btn.textContent = original, 1200);
      }
    });
  }

  main();
})();
