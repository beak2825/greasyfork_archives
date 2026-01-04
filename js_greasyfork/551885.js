// ==UserScript==
// @name         Atrium API → Tabulky s odkazy na zápasy (všechny soutěže)
// @version      2.6
// @namespace    lukas.global.tools
// @description  eapi tabulky s live urls pro jednotlivé turnaje
// @match        https://eapi.web.prod.cloud.atriumsports.com/v1/embed/*/fixtures*
// @author       LM
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551885/Atrium%20API%20%E2%86%92%20Tabulky%20s%20odkazy%20na%20z%C3%A1pasy%20%28v%C5%A1echny%20sout%C4%9B%C5%BEe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551885/Atrium%20API%20%E2%86%92%20Tabulky%20s%20odkazy%20na%20z%C3%A1pasy%20%28v%C5%A1echny%20sout%C4%9B%C5%BEe%29.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const locale = navigator.language || 'cs-CZ';

  // 🏆 MAPA soutěží podle seasonId
  const LEAGUE_MAP = {
    '3f73b7bb-9a47-11f0-8a96-b5a52c2e9fb9': 'Bulgaria NBL',
    '1d56ca1a-4cd1-11f0-9272-adc5304a108c': 'Australia WNBL',
    '7763f11f-76c2-11f0-9a4f-3303dee698d3': 'Austria Zweite Liga',
    'e9eadea4-7769-11f0-817d-2bbff9c576d0': 'Austria Superliga Women',
    '9a761374-41a9-11f0-a689-c94a032ca4e8': 'Australia NBL',
    '04d11475-5cee-11f0-868a-ef8300e5eae7': 'Austria Superliga',
    'b1b57094-3f54-11f0-9a4e-9fb16b8df604': 'Mexiko LNBP',
    '77441bb3-9759-11f0-b659-0561c09a0222': 'Asia EASL',
    'fc7fe5e3-7d96-11f0-bd13-a1d8332822d9': 'Austria Austria Cup',
    'df310a05-51ad-11f0-bd89-c735508e1e09': 'France LNB',
    '5e31a852-51ae-11f0-b5bf-5988dba0fcf9': 'France Pro B',
    'c8514e7e-51ae-11f0-9446-a5c0bb403783': 'France Espoirs U21',
    '69d67e09-7e62-11f0-8824-3b98c72e92a4': 'Latvia LBL'
    // ➕ přidávej další dle potřeby
  };

  // 🧩 Přepis cyrilice → latinka
  function transliterate(str = '') {
    const map = {
      'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ж':'Zh','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M',
      'Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'H','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Sht',
      'Ъ':'A','Ь':'Y','Ю':'Yu','Я':'Ya',
      'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m',
      'н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sht',
      'ъ':'a','ь':'y','ю':'yu','я':'ya'
    };
    return str.split('').map(ch => map[ch] || ch).join('');
  }

  // 🎯 Získání embed ID z URL
  function getEmbedId() {
    const match = location.pathname.match(/\/embed\/(\d+)\//);
    return match ? match[1] : null;
  }

  // 🏅 Určení názvu ligy podle seasonId
  function getLeagueName() {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('seasonId');
    return LEAGUE_MAP[sid] || 'Neznámá soutěž';
  }

  // 💅 CSS styl
  function css() {
    const s = document.createElement('style');
    s.textContent = `
      :root { --bg:#0b0f14; --card:#10161d; --text:#e9eef3; --muted:#a9b4bf; --accent:#2ecc71; --accentText:#0b0f14; --border:#1d2732; }
      html, body { background: var(--bg)!important; color: var(--text)!important; margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif; }
      .wrap { padding: 20px; max-width: 1100px; margin: 0 auto; }
      h1 { font-size: 22px; font-weight:700; margin-bottom:16px; }
      table { width: 100%; border-collapse: collapse; border:1px solid var(--border); border-radius: 10px; background: var(--card); overflow:hidden; }
      th, td { padding: 10px 14px; border-bottom: 1px solid var(--border); text-align: left; }
      thead th { background:#0f1520; color: var(--text); position: sticky; top: 0; }
      tr:nth-child(odd) { background: rgba(255,255,255,0.02); }
      a.live { display:inline-block; padding:6px 12px; border-radius:8px; background: var(--accent); color: var(--accentText); text-decoration:none; font-weight:700; }
      a.live:hover { filter:brightness(1.1); }
      .loading { text-align:center; font-size:20px; padding-top:80px; color:var(--muted); }
    `;
    document.documentElement.appendChild(s);
  }

  // 🕓 Loading info
  function showLoading(league) {
    document.body.innerHTML = `<div class="loading">⏳ Načítám data z API (${league})...</div>`;
  }

  // 🔍 Načtení JSONu (i z <pre>)
  async function getJson() {
    try {
      const r = await fetch(location.href, { credentials: 'omit' });
      let txt = await r.text();
      txt = txt.replace(/^[\s\S]*?([{\[])/, '$1').replace(/<\/?pre>/g, '').trim();
      return JSON.parse(txt);
    } catch (e) {
      console.error('❌ Chyba při parsování JSONu', e);
      return null;
    }
  }

  // 📋 Extrakce zápasů
  function extractFixtures(json) {
    if (Array.isArray(json?.fixtures)) return json.fixtures;
    if (json?.data?.fixtures) return json.data.fixtures;
    if (Array.isArray(json)) return json;
    return [];
  }

  // 🕐 Lokální formát data
  function toLocalDT(d) {
    if (!d) return '-';
    const date = new Date(d);
    return date.toLocaleString(locale, {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  // 📊 Vykreslení tabulky
  function render(fixtures, league, embedId) {
    document.body.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'wrap';

    const h1 = document.createElement('h1');
    h1.textContent = `🏀 ${league} – zápasy (${fixtures.length})`;
    wrap.appendChild(h1);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Datum & čas</th>
        <th>Domácí tým</th>
        <th>Skóre (H)</th>
        <th>Hostující tým</th>
        <th>Skóre (A)</th>
        <th>Status</th>
        <th>LIVE URL</th>
      </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    fixtures.forEach(fx => {
      const tr = document.createElement('tr');
      const date = toLocalDT(fx.startTimeLocal || fx.startTimeUTC);
      const fixtureId = fx.fixtureId;

      const homeObj = fx.competitors?.find(c => c.isHome);
      const awayObj = fx.competitors?.find(c => !c.isHome);
      const home = transliterate(homeObj?.name || '');
      const away = transliterate(awayObj?.name || '');
      const scoreH = homeObj?.score || '';
      const scoreA = awayObj?.score || '';
      const status = fx.status?.label || fx.resultStatus || '';

      const tdDate = document.createElement('td'); tdDate.textContent = date;
      const tdHome = document.createElement('td'); tdHome.textContent = home;
      const tdScoreH = document.createElement('td'); tdScoreH.textContent = scoreH;
      const tdAway = document.createElement('td'); tdAway.textContent = away;
      const tdScoreA = document.createElement('td'); tdScoreA.textContent = scoreA;
      const tdStatus = document.createElement('td'); tdStatus.textContent = status;

      const tdLink = document.createElement('td');
      const a = document.createElement('a');
      a.textContent = 'LIVE URL';
      a.href = `https://eapi.web.prod.cloud.atriumsports.com/v1/embed/${embedId}/fixture_detail?fixtureId=${fixtureId}`;
      a.target = '_blank';
      a.className = 'live';
      tdLink.appendChild(a);

      tr.append(tdDate, tdHome, tdScoreH, tdAway, tdScoreA, tdStatus, tdLink);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    document.body.appendChild(wrap);
  }

  // 🚀 Spuštění
  const embedId = getEmbedId();
  const league = getLeagueName();
  css();
  showLoading(league);
  await new Promise(r => setTimeout(r, 5000));

  const json = await getJson();
  if (!json) {
    document.body.innerHTML = `<h2 style="color:red; text-align:center; margin-top:50px;">❌ Nepodařilo se načíst JSON (${league}).</h2>`;
    return;
  }

  const fixtures = extractFixtures(json);
  render(fixtures, league, embedId);
})();
