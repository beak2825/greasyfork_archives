// ==UserScript==
// @name         ManagerZone - Treino % na Tabela
// @namespace    https://greasyfork.org/users/1520478-emanuel-neves   // troque pelo seu ID no GreasyFork
// @version      0.0.6
// @description  Exibe, em cada atributo do jogador, a porcentagem estimada até o próximo ganho de ponto (bolinha). A informação é mostrada em uma coluna extra, no final da linha da tabela de habilidades, com destaque por cores de acordo com a faixa de progresso. Script baseado em: van.mz.playerAdvanced
// @author       Emanuel Neves (emanuelsn)
// @match        https://www.managerzone.com/*
// @icon         https://www.managerzone.com/favicon.ico
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      managerzone.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550999/ManagerZone%20-%20Treino%20%25%20na%20Tabela.user.js
// @updateURL https://update.greasyfork.org/scripts/550999/ManagerZone%20-%20Treino%20%25%20na%20Tabela.meta.js
// ==/UserScript==

(function(){
  'use strict';
  if (window.__MZ_TRAIN_PUBLISHED__) return;
  window.__MZ_TRAIN_PUBLISHED__ = true;

  /** =========================================================================
   *  CONFIGURAÇÕES BÁSICAS
   *  ========================================================================= */
  const SPORT   = 'soccer';
  const TIMEOUT = 12000;

  // Pesos por nível de treino (mantidos conforme metodologia original)
  const WEIGHTS = {
    1: 0.645*1, 2: 0.55*2, 3: 0.7*3, 4: 0.85*4, 5: 0.96*5,
    6: 1.111*6, 7: 1.3*7, 8: 1.6*8, 9: 2.02*9, 10: 2.4*10
  };

  // Mapeamento de atributos → skill_id usados nos gráficos do ManagerZone
  const SKILL_NAME_TO_ID = {
    'velocidade': 2,
    'resistência': 3,
    'inteligência': 4,
    'passe curto': 5,
    'chute': 6,
    'cabeceio': 7,
    'defesa a gol': 8,
    'controle de bola': 9,
    'desarme': 10,
    'passe longo': 11,
    'bola parada': 12
  };

  /** =========================================================================
   *  FUNÇÕES AUXILIARES
   *  ========================================================================= */
  const fmtDate = ts => {
    try { return new Date(ts).toLocaleDateString('pt-BR'); }
    catch(_) { return String(ts); }
  };

  function sumEff(pos, neg){
    let sPos = 0, sNeg = 0;
    for (let i=1;i<=10;i++){
      const w = WEIGHTS[i]||0;
      sPos += w * (pos[i]||0);
      sNeg += w * (neg[i]||0);
    }
    let s = sPos - sNeg;
    if (s < 0) s = 0;
    if (s >= 100) s = 99.99;
    return +s.toFixed(2);
  }

  function isBall(url){
    return /trainingicon\.php\?icon=bar_pos_\d+_ball/i.test(String(url||''));
  }

  function parseIcon(url){
    const m = String(url||'').match(/trainingicon\.php\?icon=bar_(pos|neg)_(\d+)(?:_ball)?(?:&t=([a-z_]+))?/i);
    if (!m) return null;
    return { sign: m[1].toLowerCase(), t: Math.max(1, Math.min(10, +m[2])) };
  }

  /** =========================================================================
   *  REQUISIÇÕES AOS ENDPOINTS DE TREINO
   *  ========================================================================= */
  async function http(url){
    try{
      const r = await fetch(url, {credentials:'include'});
      return { ok:true, data: await r.text() };
    }catch(_){}
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET', url, timeout: TIMEOUT,
        onload: r => resolve({ ok:true, data:r.responseText }),
        onerror: reject, ontimeout: () => reject(new Error('timeout'))
      });
    });
  }

  async function fetchTrainingData(pid, skillId){
    const tries = [
      `/ajax.php?p=trainingGraph&sub=getJsonTrainingHistory&sport=${SPORT}&player_id=${pid}&skill_id=${skillId}`,
      `/ajax.php?p=trainingGraph&sub=getJsonTrainingHistory&sport=${SPORT}&player_id=${pid}`,
      `/ajax.php?p=players&sub=training_graphs&pid=${pid}&sport=${SPORT}&skill=${skillId}`,
      `/ajax.php?p=players&sub=training_graphs&pid=${pid}&skill=${skillId}`
    ];
    for (const url of tries){
      try{
        const res = await http(url);
        if (res.ok && res.data && res.data.length > 20) return { url, data: res.data };
      }catch(_){}
    }
    return { url:null, data:null };
  }

  /** =========================================================================
   *  PARSE E EXTRAÇÃO DE PONTOS DO HISTÓRICO
   *  ========================================================================= */
  function extractSeries(data){
    let series;
    try{ eval(data); if (Array.isArray(series)) return series; }catch(_){}
    try{ const j = JSON.parse(data); if (j && Array.isArray(j.series)) return j.series; }catch(_){}
    try{
      const m = data.match(/series\s*=\s*(\[[\s\S]*?\]);/);
      if (m){ const tmp = eval(m[1]); if (Array.isArray(tmp)) return tmp; }
    }catch(_){}
    return [];
  }

  function collectPointsFromSeries(seriesArr){
    const pts = [];
    for (const s of seriesArr){
      const data = (s && (s.data || s.points)) || [];
      for (const g of data){
        const x = g && g.x;
        const marker = g && g.marker && (g.marker.symbol || g.marker.url);
        if (!Number.isFinite(x) || !marker) continue;
        const info = parseIcon(marker);
        if (!info) continue;
        pts.push({x, marker});
      }
    }
    return pts;
  }

  /** =========================================================================
   *  CÁLCULO DO % DE TREINO
   *  ========================================================================= */
  async function getPercentForSkill(pid, skillId){
    const net = await fetchTrainingData(pid, skillId);
    if (!net.data) return 0.00;

    const allSeries = extractSeries(net.data);
    const points = collectPointsFromSeries(allSeries);
    if (!points.length) return 0.00;

    let cutoff = -Infinity;
    for (const p of points){ if (isBall(p.marker) && p.x > cutoff) cutoff = p.x; }
    if (!Number.isFinite(cutoff)) cutoff = Math.min(...points.map(p=>p.x));

    const pos = {}, neg = {};
    for (const p of points){
      if (p.x <= cutoff) continue;
      const info = parseIcon(p.marker); if (!info) continue;
      if (info.sign === 'pos') pos[info.t] = (pos[info.t]||0) + 1;
      else                     neg[info.t] = (neg[info.t]||0) + 1;
    }
    return sumEff(pos, neg);
  }

  /** =========================================================================
   *  UI: INSERÇÃO DA COLUNA E ESTILOS
   *  ========================================================================= */
  function injectCSS(){
    if (document.getElementById('mz-train-css')) return;
    const st = document.createElement('style');
    st.id = 'mz-train-css';
    st.textContent = `
      .mz-train-td{ font-size:11px; white-space:nowrap; padding-left:6px; text-align:right; min-width:56px; }
      .mz-train-td--placeholder{ color:transparent; }
      .mz-badge{ display:inline-block; padding:0 6px; border-radius:10px; font-weight:600; line-height:1.6; }
      .mz-badge--g0 { background: rgba(120,120,120,.15); color:#444; }
      .mz-badge--g20{ background: rgba(255,193,7,.18); color:#8a6d00; }
      .mz-badge--g50{ background: rgba(33,150,243,.18); color:#0f4c81; }
      .mz-badge--g80{ background: rgba(76,175,80,.18); color:#1b5e20; }
    `;
    document.head.appendChild(st);
  }

  function getSkillRows(){
    const table = document.querySelector('.player_skills.player_skills_responsive');
    if (!table) return [];
    const rows = [];
    table.querySelectorAll('tr').forEach(tr=>{
      const td = tr.querySelector('td');
      if (!td) return;
      const nameText = (td.textContent||'').trim().toLowerCase();
      for (const key in SKILL_NAME_TO_ID){
        if (nameText.includes(key)){
          rows.push({tr, key, skillId: SKILL_NAME_TO_ID[key]});
          break;
        }
      }
    });
    return rows;
  }

  function clsForPercent(p){
    if (p >= 80) return 'mz-badge--g80';
    if (p >= 50) return 'mz-badge--g50';
    if (p >= 20) return 'mz-badge--g20';
    return 'mz-badge--g0';
  }

  async function runOnce(){
    const url = new URL(location.href);
    const pid = url.searchParams.get('pid');
    if (!pid) return;

    injectCSS();

    const table = document.querySelector('.player_skills.player_skills_responsive');
    if (!table) return;

    // Garante coluna final em todas as linhas
    table.querySelectorAll('tr').forEach(tr=>{
      if (tr.dataset.mzColAdded) return;
      tr.dataset.mzColAdded = '1';
      const tdPercent = document.createElement('td');
      tdPercent.className = 'mz-train-td mz-train-td--placeholder';
      tdPercent.innerHTML = '&nbsp;';
      tr.appendChild(tdPercent);
    });

    // Preenche apenas para as skills reconhecidas
    const rows = getSkillRows();
    for (const {tr, skillId} of rows){
      const tdPercent = tr.querySelector('.mz-train-td');
      if (!tdPercent) continue;
      tdPercent.classList.remove('mz-train-td--placeholder');
      tdPercent.textContent = '';
      const badge = document.createElement('span');
      badge.className = 'mz-badge mz-badge--g0';
      badge.textContent = '(…)';
      tdPercent.appendChild(badge);

      try{
        const pct = await getPercentForSkill(pid, skillId);
        badge.className = `mz-badge ${clsForPercent(pct)}`;
        badge.textContent = `(${pct.toFixed(1)}%)`;
      }catch(_){
        badge.className = 'mz-badge mz-badge--g0';
        badge.textContent = '(0.0%)';
      }
    }
  }

  /** =========================================================================
   *  OBSERVAÇÃO DE MUDANÇAS NA PÁGINA
   *  ========================================================================= */
  function isPlayerPage(){
    return /[?&]p=players\b/.test(location.href) || /players\.php\b/.test(location.href);
  }

  let lastPid=null, t=null;
  const obs = new MutationObserver(()=>{
    if (!isPlayerPage()) return;
    const pid = new URL(location.href).searchParams.get('pid');
    if (pid && pid!==lastPid){
      lastPid = pid;
      clearTimeout(t);
      t = setTimeout(runOnce, 600);
    }
  });
  obs.observe(document.documentElement, {subtree:true, childList:true});
  if (isPlayerPage()) runOnce();

})();
