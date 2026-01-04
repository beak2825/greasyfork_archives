// ==UserScript==
// @name         Bunpro Exporter
// @namespace    https://github.com/zyaga/bunpro-exporter
// @version      1.0
// @description  Tampermonkey / Greasemonkey userscript that adds a floating export button to Bunpro.jp pages which exports all of a users in progress and learned vocabulary to a CSV file.
// @author       Zyaga
// @license      MIT
// @match        https://bunpro.jp/*
// @icon         https://bunpro.jp/favicon.ico
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/553992/Bunpro%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/553992/Bunpro%20Exporter.meta.js
// ==/UserScript==

// @run-at       document-end
// ==/UserScript==

// --- Efficient dashboard detector ---
(function setupDashboardDetector() {
  let active = false;
  let lastPath = location.pathname;

  function checkRoute() {
    const isDashboard = location.pathname.startsWith("/dashboard");
    if (isDashboard && !active) {
      active = true;
      main();
    } else if (!isDashboard && active) {
      active = false;
      document.querySelector(".bp-fab-wrap")?.remove();
      window.__BUNPRO_EXPORTER_UI__ = false;
    }
    lastPath = location.pathname;
  }

  // Hook the history API (covers most SPA transitions)
  const _ps = history.pushState;
  const _rs = history.replaceState;
  history.pushState = function () {
    _ps.apply(this, arguments);
    window.dispatchEvent(new Event("locationchange"));
  };
  history.replaceState = function () {
    _rs.apply(this, arguments);
    window.dispatchEvent(new Event("locationchange"));
  };
  window.addEventListener("popstate", () =>
    window.dispatchEvent(new Event("locationchange")),
  );
  window.addEventListener("locationchange", checkRoute);

  // Observe the main React mount point (catches internal rerenders)
  const root = document.querySelector("main") || document.body;
  const observer = new MutationObserver(() => {
    if (location.pathname !== lastPath) {
      checkRoute();
    }
  });
  observer.observe(root, { childList: true, subtree: true });

  // Initial run
  checkRoute();
})();
// --- end detector ---

function main() {
  (() => {
    if (window.__BUNPRO_EXPORTER_UI__) return;
    window.__BUNPRO_EXPORTER_UI__ = true;

    if (!location.pathname.startsWith("/dashboard")) return;

    /************** 1) Inject page-scope token hook (no auto-run) **************/
    const hookCode = `
    (function(){
      function normalize(raw){ if(!raw) return null; return raw.includes("Token token=")? raw.split("Token token=")[1] : raw.trim(); }
      function postToken(t){ if(!t) return; window.__BUNPRO_TOKEN__ = t; window.postMessage({type:"bunpro_token", token:t},"*"); }
      function storeToken(raw){ const t = normalize(raw); if(!t) return; if(window.__BUNPRO_TOKEN__!==t){ console.log("🔐 [Page] Captured Bunpro token:",t); } postToken(t); }

      const origFetch = window.fetch;
      window.fetch = function(input, init){
        try{
          const headers = (init && init.headers) || (input && input.headers);
          if (headers){
            if (headers.get){
              const h = headers.get("Authorization") || headers.get("authorization");
              if (h) storeToken(h);
            } else if (Array.isArray(headers)){
              for (const [k,v] of headers) if ((k||"").toLowerCase()==="authorization"){ storeToken(v); break; }
            } else if (typeof headers === "object"){
              for (const k in headers) if ((k||"").toLowerCase()==="authorization"){ storeToken(headers[k]); break; }
            }
          }
        }catch(_){}
        return origFetch.apply(this, arguments);
      };

      const origSet = XMLHttpRequest.prototype.setRequestHeader;
      XMLHttpRequest.prototype.setRequestHeader = function(name, value){
        try{ if((name||"").toLowerCase()==="authorization" && value) storeToken(value); }catch(_){}
        return origSet.apply(this, arguments);
      };

      // If already present (e.g., SPA navigation), post it once
      if (window.__BUNPRO_TOKEN__) postToken(window.__BUNPRO_TOKEN__);
      console.log("🟢 [Page] Bunpro token hook injected.");
    })();
  `;
    const sc = document.createElement("script");
    sc.textContent = hookCode;
    document.documentElement.appendChild(sc);
    sc.remove();

    // Keep latest token in GM storage
    let latestToken = null;
    window.addEventListener("message", async (ev) => {
      if (!ev?.data || ev.data.type !== "bunpro_token") return;
      latestToken = ev.data.token;
      try {
        await GM_setValue("bunpro_token", latestToken);
      } catch {}
    });

    /************** 2) Floating button UI **************/
    const styles = `
    .bp-fab-wrap {
      position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
      display: flex; flex-direction: column; gap: 8px; align-items: flex-end;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    }
    .bp-fab {
      appearance: none; border: 0; outline: 0; cursor: pointer;
      background: #2563eb; color: white; font-weight: 600; font-size: 14px;
      padding: 10px 14px; border-radius: 9999px; box-shadow: 0 8px 20px rgba(0,0,0,.2);
      display: inline-flex; align-items: center; gap: 10px;
      transition: transform .08s ease, opacity .2s ease, background .2s ease;
    }
    .bp-fab:hover { background: #1d4ed8; }
    .bp-fab.bp-disabled { opacity: .7; cursor: default; pointer-events: none; }
    .bp-spinner {
      width: 16px; height: 16px; border-radius: 9999px;
      border: 2px solid rgba(255,255,255,.35); border-top-color: #fff;
      animation: bp-spin .9s linear infinite;
    }
    @keyframes bp-spin { to { transform: rotate(360deg); } }
    .bp-toast {
      background: #0f172a; color: #e2e8f0; padding: 8px 10px; border-radius: 8px; font-size: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,.25); max-width: 280px;
    }
    .bp-success { background: #16a34a; color: #fff; }
    .bp-error { background: #dc2626; color: #fff; }
  `;
    const st = document.createElement("style");
    st.textContent = styles;
    document.head.appendChild(st);

    const wrap = document.createElement("div");
    wrap.className = "bp-fab-wrap";
    const toast = document.createElement("div");
    toast.className = "bp-toast";
    toast.style.display = "none";
    const btn = document.createElement("button");
    btn.className = "bp-fab";
    btn.innerHTML = `📝 Export Bunpro CSV`;

    wrap.appendChild(toast);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);

    function showToast(text, variant = "") {
      toast.textContent = text;
      toast.className = `bp-toast ${variant}`;
      toast.style.display = "block";
      clearTimeout(showToast._t);
      showToast._t = setTimeout(() => {
        toast.style.display = "none";
      }, 4000);
    }

    function setLoading(on) {
      if (on) {
        btn.classList.add("bp-disabled");
        btn.innerHTML = `<span class="bp-spinner"></span> Exporting…`;
      } else {
        btn.classList.remove("bp-disabled");
        btn.innerHTML = `📝 Export Bunpro CSV`;
      }
    }

    /************** 3) Click handler -> run exporter **************/
    btn.addEventListener("click", async () => {
      setLoading(true);

      // Wait for token (most of the time we already have it)
      let token = latestToken || (await GM_getValue("bunpro_token"));
      const t0 = Date.now();
      while (!token && Date.now() - t0 < 30000) {
        // wait up to 30s
        await new Promise((r) => setTimeout(r, 300));
        token = latestToken || (await GM_getValue("bunpro_token"));
      }
      if (!token) {
        setLoading(false);
        showToast(
          "Couldn’t get token. Trigger any Bunpro request (e.g. ‘See More’) and click again.",
          "bp-error",
        );
        return;
      }

      try {
        const total = await runExporter(token, (msg) => showToast(msg));
        btn.innerHTML = `✅ Done (${total} items)`;
        showToast(`Exported ${total} items. CSV downloaded.`, "bp-success");
        try {
          GM_notification({
            title: "Bunpro Export Complete",
            text: `${total} items exported`,
            timeout: 4000,
          });
        } catch {}
      } catch (e) {
        console.error(e);
        showToast(`Export failed: ${e?.message || e}`, "bp-error");
        setLoading(false);
        return;
      }

      // reset after a bit
      setTimeout(() => setLoading(false), 1800);
    });

    /************** 4) Exporter (same logic, just callable) **************/
    async function runExporter(token, notify) {
      const LEVELS = [
        { api: "beginner", label: "Beginner" },
        { api: "adept", label: "Adept" },
        { api: "seasoned", label: "Seasoned" },
        { api: "expert", label: "Expert" },
        { api: "master", label: "Master" },
      ];
      const TYPE = "Vocab";
      const BASE = `https://api.bunpro.jp/api/frontend/user_stats/srs_level_details?reviewable_type=${TYPE}&level=`;

      const all = new Map();

      async function fetchLevel(api, label) {
        let page = 1;
        notify?.(`Fetching ${label}…`);
        while (true) {
          const url = `${BASE}${api}&page=${page}&_=${Date.now()}`;
          const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
              Authorization: `Token token=${token}`,
              Accept: "application/json",
              "X-Requested-With": "XMLHttpRequest",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          });
          if (!res.ok) {
            if (res.status === 500) break; // end
            throw new Error(`${label} HTTP ${res.status} on page ${page}`);
          }
          const j = await res.json();
          const d = j.reviews?.data || [];
          const inc = j.reviews?.included || [];
          if (!d.length && !inc.length) break;

          const vocabMap = new Map(
            inc.map((v) => [
              String(v.id),
              {
                title: (v.attributes?.title ?? "").trim(),
                meaning: (v.attributes?.meaning ?? "").trim(),
              },
            ]),
          );

          for (const r of d) {
            const id = String(r.attributes?.reviewable_id ?? "");
            const v = vocabMap.get(id);
            if (v && v.title && !all.has(v.title))
              all.set(v.title, [v.title, v.meaning, label]);
          }

          page++;
          await new Promise((r) => setTimeout(r, 150)); // be polite
        }
      }

      for (const lvl of LEVELS) await fetchLevel(lvl.api, lvl.label);

      // Build and download CSV
      let csv = '"word","description","progress"\n';
      for (const [, [w, d, p]] of all)
        csv += `"${w.replace(/"/g, '""')}","${d.replace(/"/g, '""')}","${p}"\n`;

      const blob = new Blob([csv], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `bunpro_vocab_all_levels_${Date.now()}.csv`;
      a.click();

      return all.size;
    }

    // Optional initial hint
    console.log(
      "🟢 Bunpro Exporter ready — use the floating button when you want to export.",
    );
  })();
}
main();
