// ==UserScript==
// @name         GrandRP – ACP Dark Mode
// @namespace    https://tampermonkey.net/
// @version      8.5
// @description  Simple dark mode layout for grand acp
// @author       Made with ❤️ by Tom Fresh
// @license      GNU General Public License v3.0
// @match        *://gta5grand.com/admin*/*
// @match        *://gta5grand.com/*admin*/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      update.greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/548205/GrandRP%20%E2%80%93%20ACP%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/548205/GrandRP%20%E2%80%93%20ACP%20Dark%20Mode.meta.js
// ==/UserScript==

(() => {
  'use strict';
  if (window.__grandrp_acp_dark_v85) return; window.__grandrp_acp_dark_v85 = true;

  /* =================== Update-Konfig =================== */
  const GF_META_URL   = 'https://update.greasyfork.org/scripts/548205/GrandRP%20%E2%80%93%20ACP%20Dark%20Mode.meta.js';
  const GF_UPDATE_URL = 'https://greasyfork.org/de/scripts/548205-grandrp-acp-dark-mode';
  const GF_CHECK_MS   = 30_000;

  /* =================== Helpers =================== */
  const $ = (s, r=document) => r.querySelector(s);
  const STORE = 'tmDarkMode';
  const prefersDark = () => matchMedia('(prefers-color-scheme: dark)').matches;
  const readPref = () => { try { const v = localStorage.getItem(STORE); if (v==='1') return true; if (v==='0') return false; } catch {} return prefersDark(); };
  const localVersion = (typeof GM_info!=='undefined' && GM_info.script && GM_info.script.version) ? GM_info.script.version : '0.0.0';

  /* =================== Styles =================== */
  const css = `
  html.tm-dark{--bg:#0f1117;--text:#e6eaf0;--card:#151b23;--muted:#a8b3c2;--border:#2b3545;--rowA:#10151c;--rowB:#141b24;--rowH:#1b2431;--inp:#121822;color-scheme:dark}
  html.tm-dark,html.tm-dark body{background:var(--bg)!important;color:var(--text)!important}

  /* Cards/Modals */
  html.tm-dark .card:not([class*="bg-"]),html.tm-dark .panel,html.tm-dark .panel-default,html.tm-dark .panel-body,html.tm-dark .panel-heading,html.tm-dark .well,html.tm-dark .box,html.tm-dark .modal-content,html.tm-dark .swal2-popup{
    background:var(--card)!important;color:var(--text)!important;border-color:var(--border)!important
  }
  html.tm-dark .card-header,html.tm-dark .panel-heading{background:rgba(255,255,255,.03)!important;border-bottom-color:var(--border)!important}

  /* Tables (allgemein & Bootstrap) */
  html.tm-dark .table,html.tm-dark table{background:var(--card)!important;color:var(--text)!important;border-color:var(--border)!important}
  html.tm-dark .table>thead>tr>th, html.tm-dark table>thead>tr>th{
    background:rgba(255,255,255,.05)!important;color:var(--text)!important;border-color:var(--border)!important
  }
  html.tm-dark table>tbody>tr{background:var(--rowB)!important}
  html.tm-dark table>tbody>tr:nth-child(odd){background:var(--rowA)!important}
  html.tm-dark .table-hover>tbody>tr:hover, html.tm-dark table>tbody>tr:hover{background:var(--rowH)!important}
  html.tm-dark th, html.tm-dark td{color:var(--text)!important;border-color:var(--border)!important}

  /* Spezielle helle Klassen aus Report-Seiten (Ban Scan/Trace) */
  html.tm-dark .sc-header, html.tm-dark .subheader{
    background:rgba(255,255,255,.06)!important;color:var(--text)!important;border-color:var(--border)!important
  }
  html.tm-dark .person-row{background:rgba(255,255,255,.09)!important;color:var(--text)!important}
  html.tm-dark .banlist-table, html.tm-dark .person-cluster{background:var(--card)!important;border-color:var(--border)!important;color:var(--text)!important}
  html.tm-dark .graph-container{background:var(--card)!important;border-color:var(--border)!important}
  html.tm-dark .prefix-note{color:var(--muted)!important}
  html.tm-dark .red{color:#ff6b6b!important}

  /* Overlay/Processing Box */
  html.tm-dark #processingOverlay{background:rgba(0,0,0,.6)!important}
  html.tm-dark #processingOverlayContent{background:var(--card)!important;border:1px solid var(--border)!important;color:var(--text)!important}

  /* Forms */
  html.tm-dark .form-control,html.tm-dark input.form-control,html.tm-dark select.form-control,html.tm-dark textarea.form-control,html.tm-dark .input-group .form-control,html.tm-dark .input-group-addon{
    background:var(--inp)!important;color:var(--text)!important;border:1px solid var(--border)!important;box-shadow:none!important
  }
  html.tm-dark .form-control::placeholder{color:var(--muted)!important;opacity:1!important}

  /* Buttons & Dropdowns */
  html.tm-dark .btn.btn-default{background:#1f2633!important;color:var(--text)!important;border-color:var(--border)!important}
  html.tm-dark .btn.btn-default:hover{filter:brightness(1.08)}
  html.tm-dark .dropdown-menu{background:var(--card)!important;border-color:var(--border)!important;color:var(--text)!important}
  html.tm-dark .dropdown-menu>li>a{color:var(--text)!important}
  html.tm-dark .dropdown-menu>li>a:hover{background:var(--rowH)!important}

  /* Topbar & Sidebar */
  html.tm-dark header .navbar,html.tm-dark .navbar.navbar-default{background:#141b22!important;border-color:var(--border)!important}
  html.tm-dark .navbar .navbar-brand,html.tm-dark .navbar .navbar-nav>li>a,html.tm-dark .navbar .navbar-text{color:var(--text)!important}
  html.tm-dark .navbar .navbar-nav>li>a:hover,html.tm-dark .navbar .navbar-nav>li.active>a,html.tm-dark .navbar .navbar-nav>li.open>a{background:var(--rowH)!important;color:#fff!important}
  html.tm-dark aside.app-layout-drawer,html.tm-dark nav.drawer-main,html.tm-dark .drawer-main{background:#121822!important;color:var(--text)!important;border-right-color:var(--border)!important}
  html.tm-dark .nav.nav-drawer>li>a,html.tm-dark .nav-drawer>li>a,html.tm-dark .nav>li>a{color:var(--text)!important}
  html.tm-dark .nav.nav-drawer>li.active>a,html.tm-dark .nav.nav-drawer>li>a:hover,html.tm-dark .nav-drawer>li.active>a,html.tm-dark .nav-drawer>li>a:hover{background:var(--rowH)!important;color:#fff!important}
  html.tm-dark .nav-subnav{background:var(--rowB)!important;border-color:var(--border)!important}
  html.tm-dark .nav-subnav>li>a{color:var(--text)!important}
  html.tm-dark .nav-subnav>li>a:hover{background:var(--rowH)!important}
  html.tm-dark .nav-divider{border-color:var(--border)!important}
  html.tm-dark .nav-subheader{color:var(--muted)!important}

  /* Update-Hinweis */
  .tm-update-note a{display:block;padding:8px 12px;font-weight:600}
  .tm-update-note a{color:#b25a00!important} html.tm-dark .tm-update-note a{color:#ffcc66!important}

  /* Pagination (Dark, kompakt) */
  html.tm-dark .pagination{margin:12px 0;display:flex;flex-wrap:wrap;gap:6px;background:transparent!important}
  html.tm-dark .pagination>li{display:inline-block}
  html.tm-dark .pagination>li>a, html.tm-dark .pagination>li>span{
    background:#1f2633!important;color:var(--text)!important;border:1px solid var(--border)!important;border-radius:6px!important;padding:6px 10px;line-height:1.2;box-shadow:none!important
  }
  html.tm-dark .pagination>li>a:hover{background:#253142!important;color:#fff!important}
  html.tm-dark .pagination>.active>a, html.tm-dark .pagination>.active>span{background:#2ecc71!important;border-color:#2ecc71!important;color:#fff!important}
  html.tm-dark .pagination>.disabled>a, html.tm-dark .pagination>.disabled>span{background:#10151c!important;color:var(--muted)!important;opacity:.8!important}
  html.tm-dark .pager li>a, html.tm-dark .pager li>span{background:#1f2633!important;color:var(--text)!important;border:1px solid var(--border)!important;border-radius:6px!important;padding:6px 10px}
  html.tm-dark .pager li>a:hover{background:#253142!important}
  `;
  if (!$('#tm-dark-style')) { const st = document.createElement('style'); st.id='tm-dark-style'; st.textContent=css; document.head.appendChild(st); }

  /* =================== Sidebar Utils =================== */
  let _drawerRoot=null, _drawerList=null;
  const getDrawerRoot = () => _drawerRoot ||= ($('aside.app-layout-drawer') || $('.drawer-main') || $('nav.drawer-main'));
  const getDrawerList = () => {
    if (_drawerList && document.contains(_drawerList)) return _drawerList;
    const d = getDrawerRoot(); if (!d) return null;
    _drawerList = (d.tagName==='UL') ? d :
      (d.querySelector('ul.nav.nav-drawer') || d.querySelector('.nav.nav-drawer') || d.querySelector('.nav-drawer') || d.querySelector('ul'));
    return _drawerList;
  };

  /* =================== Dark Mode Toggle =================== */
  const iconHTML = dark => {
    if ($('.zmdi') || $('link[href*="material-design-iconic-font"]')) return `<i class="zmdi ${dark?'zmdi-brightness-2':'zmdi-sun'} zmdi-hc-fw"></i>`;
    if ($('.fa') || $('link[href*="font-awesome"]')) return `<i class="fa ${dark?'fa-moon-o':'fa-sun-o'}"></i>`;
    return dark
      ? `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 0l1.79-1.8 1.41 1.41-1.8 1.79-1.4-1.4zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zm7-10h3v-1h-3v1zM1 12H4v-1H1v1zm15.24 7.16l1.4 1.4 1.8-1.79-1.41-1.41-1.79 1.8zM4.84 17.24l-1.8 1.79 1.41 1.41 1.79-1.8-1.4-1.4zM12 7a5 5 0 100 10 5 5 0 000-10z"/></svg>`;
  };
  const updateSidebarIcon = () => { const a = $('#tm-dark-toggle-sb'); if (!a) return; const dark = document.documentElement.classList.contains('tm-dark'); const next = `${iconHTML(dark)}<span>Dark Mode</span>`; if (a.innerHTML !== next) a.innerHTML = next; };
  const setDark = on => { document.documentElement.classList.toggle('tm-dark', !!on); try { localStorage.setItem(STORE, on?'1':'0'); } catch {} ; updateSidebarIcon(); };
  const buildSidebarToggle = () => {
    const ul = getDrawerList(); if (!ul || $('#tm-dark-toggle-sb')) return;
    const li = document.createElement('li'); li.className='tm-dark-menu';
    const a  = document.createElement('a');  a.id='tm-dark-toggle-sb'; a.href='#';
    a.innerHTML = `${iconHTML(document.documentElement.classList.contains('tm-dark'))}<span>Dark Mode</span>`;
    a.addEventListener('click', e => { e.preventDefault(); setDark(!document.documentElement.classList.contains('tm-dark')); });
    li.appendChild(a); ul.appendChild(li);
  };

  /* =================== E-Mail Maskierung =================== */
  const maskEmail = e => { if(!e||!/@/.test(e)) return e; const i=e.indexOf('@'), l=e.slice(0,i), d=e.slice(i+1); return `${l.slice(0,3)}${l.length>3?'***':''}@${d}`; };
  const replaceAdminEmailMasked = () => {
    const prof=$('.dropdown-profile'); if(!prof) return false;
    const span=$('.m-r-sm',prof); if(span){const t=(span.textContent||'').trim(); if(/@/.test(t)){ const m=maskEmail(t); if (span.textContent!==m) span.textContent=m; }}
    prof.querySelectorAll('a').forEach(a=>{const t=(a.textContent||'').trim(); if(/@/.test(t)&&!a.childElementCount){ const m=maskEmail(t); if (a.textContent!==m) a.textContent=m; }});
    return true;
  };
  const scheduleEmailMask = () => { if(replaceAdminEmailMasked()) return; let i=0; const iv=setInterval(()=>{ if(replaceAdminEmailMasked()||++i>10) clearInterval(iv); },300); };

  /* =================== Update-Notifier (wiederverwendbar) =================== */
  function initGreasyForkUpdateNotifier(metaUrl, updateUrl, intervalMs=30_000) {
    const isNewer = (a,b) => { const pa=a.split('.').map(n=>+n||0), pb=b.split('.').map(n=>+n||0); for(let i=0;i<Math.max(pa.length,pb.length);i++){const x=pa[i]||0,y=pb[i]||0; if(x>y)return true; if(x<y)return false;} return false; };
    let remoteVer=null, timer=null, obs=null, debounce=null;

    function ensureSidebarNote(ver){
      const ul = getDrawerList(); if (!ul) return;
      let li = ul.querySelector('.tm-update-note');
      if (!li) { li = document.createElement('li'); li.className='tm-update-note'; ul.appendChild(li); }
      const txt = `⚠ Script-Update verfügbar (v${ver})`;
      const a = li.querySelector('a') || li.appendChild(document.createElement('a'));
      a.href = updateUrl; a.target = '_blank'; a.rel='noopener';
      if (a.textContent !== txt) a.textContent = txt;
    }

    function pollOnce(){
      GM_xmlhttpRequest({
        method:'GET', url: metaUrl + '?_=' + Date.now(), timeout: 7000,
        onload: r => {
          try{
            const m = /@version\s+([0-9.]+)/i.exec(r.responseText || '');
            const remote = m ? m[1].trim() : null;
            if (remote && remote !== remoteVer && isNewer(remote, localVersion)) {
              remoteVer = remote; ensureSidebarNote(remote); ensureObserver();
            }
          } catch {}
        }
      });
    }

    function ensureObserver(){
      if (obs) return;
      const root = getDrawerRoot(); if (!root) return;
      obs = new MutationObserver(() => {
        if (debounce) return;
        debounce = setTimeout(() => { debounce=null; if (remoteVer) ensureSidebarNote(remoteVer); }, 120);
      });
      obs.observe(root, { childList:true }); // schlank
    }

    if (!timer) { pollOnce(); timer = setInterval(pollOnce, intervalMs); }
    return { stop(){ if (timer) clearInterval(timer); timer=null; }, poll: pollOnce };
  }

  /* =================== Init =================== */
  const init = () => {
    const on = readPref();
    document.documentElement.classList.toggle('tm-dark', !!on);
    try {
      if (localStorage.getItem(STORE)===null)
        matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e=>{
          document.documentElement.classList.toggle('tm-dark', !!e.matches); updateSidebarIcon();
        });
    } catch {}
    buildSidebarToggle();
    updateSidebarIcon();
    scheduleEmailMask();
    initGreasyForkUpdateNotifier(GF_META_URL, GF_UPDATE_URL, GF_CHECK_MS);
  };
  (document.readyState==='loading') ? document.addEventListener('DOMContentLoaded', init, {once:true}) : init();
})();
