// ==UserScript==
// @name                 Bilibili Video MP4 Copy
// @name:zh-CN           Bilibili 视频直链复制器
// @namespace            https://github.com/TZFC
// @version              1.3
// @description          Floating button + dropdown near toolbar; dark-mode readable; fetches all progressive MP4 qualities.
// @description:zh-CN    在哔哩哔哩视频工具栏附近添加带清晰度选择的悬浮复制 MP4 按钮，支持深色模式。
// @match                *://www.bilibili.com/video/*
// @icon                 https://www.bilibili.com/favicon.ico
// @license              GPL-3.0
// @run-at               document-idle
// @grant                GM_setClipboard
// @grant                GM_xmlhttpRequest
// @connect              api.bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/548007/Bilibili%20Video%20MP4%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/548007/Bilibili%20Video%20MP4%20Copy.meta.js
// ==/UserScript==


(function () {
  "use strict";

  const locale = (() => {
    const langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || "en"];
    return String(langs[0] || "en").toLowerCase().startsWith("zh") ? "zh-CN" : "en";
  })();
  const L = {
    "en": { button_idle:"Copy MP4", button_fetching:"Fetching…", button_copied:"Copied ✅", button_error:"Error ❌",
            button_title:"Copy selected MP4 URL", dropdown_title:"Choose MP4 stream (lowest preselected)",
            placeholder:"Select stream…", size_unknown:"unknown", label_unknown:"Unknown",
            error_extract_bvid:"Could not extract BV identifier.", error_bad_json:"Failed to parse JSON.",
            error_no_mp4:"No MP4 found.", error_no_mp4_candidates:"No MP4 candidates." },
    "zh-CN": { button_idle:"复制 MP4", button_fetching:"获取中…", button_copied:"已复制 ✅", button_error:"出错 ❌",
               button_title:"复制所选 MP4 直链", dropdown_title:"选择 MP4 流（默认最低画质）",
               placeholder:"选择流…", size_unknown:"未知", label_unknown:"未知",
               error_extract_bvid:"无法提取 BV 号。", error_bad_json:"JSON 解析失败。",
               error_no_mp4:"未找到 MP4。", error_no_mp4_candidates:"没有可用的 MP4。" }
  }[locale];

  const style = document.createElement("style");
  style.textContent = `
    #bili_mp4_container {
      position:absolute;
      top:8px;
      right:8px;
      display:inline-flex;
      align-items:center;
      gap:8px;
      z-index:9999;
    }
    #bili_mp4_container .bili_mp4_select {
      font-size:12px; min-width:200px; padding:4px 8px; appearance:auto; -webkit-appearance:auto; -moz-appearance:auto;
    }
    #bili_mp4_container .bili_mp4_select option:disabled { opacity:0.7; }
    @media (prefers-color-scheme: dark) {
      #bili_mp4_container .bili_mp4_select { color:#e8e8e8 !important; background-color:#16181b !important; border:1px solid rgba(255,255,255,0.18) !important; -webkit-text-fill-color:#e8e8e8 !important; }
      #bili_mp4_container .bili_mp4_select option { color:#e8e8e8 !important; background-color:#16181b !important; }
      #bili_mp4_container .bili_mp4_select option:disabled { color:rgba(232,232,232,0.75) !important; }
    }
    #bili_mp4_container .bili_mp4_button {
      cursor:pointer; padding:6px 12px; font-size:12px; line-height:1; border:none; border-radius:8px;
      background:linear-gradient(135deg,#ff7ac3 0%,#7aa8ff 100%); color:#101010; font-weight:700;
    }
    #bili_mp4_container .bili_mp4_button[disabled]{ opacity:.6; cursor:not-allowed; }
  `;
  document.head.appendChild(style);

  const getBV = () => {
    const m = location.pathname.match(/\/video\/(BV[0-9A-Za-z]+)/);
    if (!m) throw new Error(L.error_extract_bvid);
    return m[1];
  };
  const getPage = () => {
    const u = new URL(location.href);
    return parseInt(u.searchParams.get("p") || "1", 10);
  };
  const clip = (t) => GM_setClipboard(t, { type: "text", mimetype: "text/plain" });
  const fmtSize = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return L.size_unknown;
    const units = ["B","KB","MB","GB"]; let i=0, v=bytes;
    while (v>=1024 && i<units.length-1){ v/=1024; i++; }
    return `${v.toFixed(v>=100?0:v>=10?1:2)} ${units[i]}`;
  };
  const httpGetJson = (url) => new Promise((res, rej) => {
    GM_xmlhttpRequest({
      method:"GET", url, headers:{ Referer:"https://www.bilibili.com/" }, timeout:30000,
      onload:r=>{ try{ res(JSON.parse(r.responseText)); } catch{ rej(new Error(L.error_bad_json)); } },
      onerror:()=>rej(new Error("Network error: "+url)),
      ontimeout:()=>rej(new Error("Network timeout: "+url))
    });
  });

  const pagelistCache = new Map();
  const playurlCache = new Map();

  const getCidForPage = async (bvid, page) => {
    if (!pagelistCache.has(bvid)) {
      const js = await httpGetJson(`https://api.bilibili.com/x/player/pagelist?bvid=${encodeURIComponent(bvid)}&jsonp=jsonp`);
      pagelistCache.set(bvid, Array.isArray(js?.data) ? js.data : []);
    }
    const arr = pagelistCache.get(bvid);
    const item = arr.find(x=>x.page===page) || arr[0];
    return item && item.cid;
  };

  const fetchPlayurlForQn = async (bvid, cid, qn) => {
    const key = `${bvid}:${cid}:qn=${qn}`;
    if (playurlCache.has(key)) return playurlCache.get(key);
    const params = new URLSearchParams({
      bvid:String(bvid), cid:String(cid), qn:String(qn),
      fourk:"1", fnver:"0", fnval:"0", otype:"json", platform:"html5"
    });
    const js = await httpGetJson(`https://api.bilibili.com/x/player/playurl?${params.toString()}`);
    playurlCache.set(key, js);
    return js;
  };

  const getAllMp4Options = async (bvid, cid) => {
    const baseParams = new URLSearchParams({
      bvid:String(bvid), cid:String(cid), qn:"120",
      fourk:"1", fnver:"0", fnval:"0", otype:"json", platform:"html5"
    });
    const first = await httpGetJson(`https://api.bilibili.com/x/player/playurl?${baseParams.toString()}`);
    const support = Array.isArray(first?.data?.support_formats) ? first.data.support_formats : [];
    const acceptQ = Array.isArray(first?.data?.accept_quality) ? first.data.accept_quality : [];
    let qualities = support.length
      ? support.map(s => ({ qn: s.quality, label: s.new_description || s.display_desc || String(s.quality) }))
      : acceptQ.map(qn => ({ qn, label: String(qn) }));
    const seen = new Set();
    qualities = qualities.filter(q=>!seen.has(String(q.qn)) && seen.add(String(q.qn))).sort((a,b)=>a.qn-b.qn);

    const results = [];
    for (const q of qualities) {
      try {
        const js = await fetchPlayurlForQn(bvid, cid, q.qn);
        const durl = js?.data?.durl;
        if (!Array.isArray(durl) || durl.length===0) continue;
        let picked = null;
        for (const e of durl) {
          if (e?.url && e.url.toLowerCase().includes(".mp4") && !e.url.toLowerCase().includes(".m4s")) { picked = { url:e.url, size:Number(e.size||0) }; break; }
          if (Array.isArray(e?.backup_url)) {
            const b = e.backup_url.find(u => u.toLowerCase().includes(".mp4") && !u.toLowerCase().includes(".m4s"));
            if (b) { picked = { url:b, size:Number(e.size||0) }; break; }
          }
        }
        if (picked) results.push({ qn:q.qn, label:q.label, url:picked.url, size:picked.size });
      } catch {}
    }

    if (results.length===0) {
      const durl = first?.data?.durl;
      if (Array.isArray(durl)) {
        for (const e of durl) {
          if (e?.url && e.url.toLowerCase().includes(".mp4") && !e.url.toLowerCase().includes(".m4s")) {
            results.push({ qn:first?.data?.quality ?? 0, label:L.label_unknown, url:e.url, size:Number(e.size||0) });
          }
        }
      }
    }

    const haveSize = results.every(r => Number.isFinite(r.size) && r.size>0);
    results.sort((a,b)=> haveSize ? (a.size-b.size) : (a.qn-b.qn));
    return results;
  };

  const createControls = ()=>{
    const wrap = document.createElement("div");
    wrap.id = "bili_mp4_container";
    wrap.setAttribute("data-bili-mp4","1");
    const sel = document.createElement("select"); sel.className = "bili_mp4_select"; sel.title = L.dropdown_title;
    const ph = document.createElement("option"); ph.value=""; ph.disabled=true; ph.selected=true; ph.textContent=L.placeholder; sel.appendChild(ph);
    const btn = document.createElement("button"); btn.className="bili_mp4_button"; btn.title=L.button_title; btn.textContent=L.button_idle;
    wrap.appendChild(sel); wrap.appendChild(btn);
    return { wrap, sel, btn };
  };

  const setBtn = (btn, label, dis)=>{ btn.textContent = label; btn.disabled = !!dis; };
  const populate = (sel, list)=>{
    sel.length = 1;
    for (const it of list) {
      const o = document.createElement("option");
      o.value = it.url;
      o.textContent = `${it.label} • ${fmtSize(it.size)} (qn=${it.qn})`;
      sel.appendChild(o);
    }
    if (sel.options.length > 1) sel.selectedIndex = 1;
  };

  const controls = createControls();
  let loaded = false;
  const loadOnce = async ()=>{
    if (loaded) return; loaded = true;
    setBtn(controls.btn, L.button_fetching, true);
    try {
      const bvid = getBV(); const page = getPage(); const cid = await getCidForPage(bvid, page);
      const list = await getAllMp4Options(bvid, cid);
      if (!list || list.length===0) throw new Error(L.error_no_mp4_candidates);
      populate(controls.sel, list); setBtn(controls.btn, L.button_idle, false);
    } catch (e) { console.error(e); setBtn(controls.btn, L.button_error, true); }
  };
  controls.sel.addEventListener("mousedown", loadOnce, { passive:true });
  controls.btn.addEventListener("mousedown", loadOnce, { passive:true });
  controls.btn.addEventListener("click", async ()=>{
    if (!loaded) await loadOnce();
    if (!controls.sel.value) { setBtn(controls.btn, L.button_error, true); setTimeout(()=>setBtn(controls.btn, L.button_idle, false), 1200); return; }
    try { clip(controls.sel.value); setBtn(controls.btn, L.button_copied, true); }
    catch(e){ console.error(e); setBtn(controls.btn, L.button_error, true); }
    setTimeout(()=>setBtn(controls.btn, L.button_idle, false), 1200);
  }, { passive:true });

  function attach_controls_into_left_container_once() {
  const target = document.querySelector(".left-container.scroll-sticky");
  if (!target) {
    console.debug("VC: left container not found (yet)");
    return false;
  }
  if (!target.contains(controls.wrap)) {
    target.style.position = "relative"; // ensure positioning context
    target.appendChild(controls.wrap);
    console.debug("VC: left container attached");
  }
  return true;
}

// Try immediately (in case it already exists)
attach_controls_into_left_container_once();

// Observe DOM for when Vue mounts/replaces the container
const vcObserver = new MutationObserver(() => {
  if (attach_controls_into_left_container_once()) {
    vcObserver.disconnect();
  }
});
vcObserver.observe(document.body, { childList: true, subtree: true });

// Re-try on SPA navigations (Bilibili uses History API)
const hookHistory = (method) => {
  const orig = history[method];
  history[method] = function () {
    const ret = orig.apply(this, arguments);
    // defer to next tick so DOM can render
    setTimeout(() => {
      // keep observing until attached; re-enable observer if needed
      if (vcObserver.takeRecords(), !attach_controls_into_left_container_once()) {
        // if not found yet, ensure observer is active
        try { vcObserver.observe(document.body, { childList: true, subtree: true }); } catch {}
      }
    }, 0);
    return ret;
  };
};
hookHistory("pushState");
hookHistory("replaceState");

// Also handle back/forward
window.addEventListener("popstate", () => {
  setTimeout(() => {
    if (!attach_controls_into_left_container_once()) {
      try { vcObserver.observe(document.body, { childList: true, subtree: true }); } catch {}
    }
  }, 0);
});

})();

