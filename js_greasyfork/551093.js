// ==UserScript==
// @name         MZ - Exportar Transferências (CSV)
// @namespace    MZTools
// @version      0.1.0
// @description  Exporta jogadores no mercado (todas as páginas) em CSV com atributos e metadados. Robusto a temas/idiomas, ignora Forma.
// @author       MZ Tools
// @match        *://*.managerzone.com/*
// @icon         https://www.managerzone.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551093/MZ%20-%20Exportar%20Transfer%C3%AAncias%20%28CSV%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551093/MZ%20-%20Exportar%20Transfer%C3%AAncias%20%28CSV%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** ==========================
   *  CONFIG / LABELS / HELPERS
   *  ==========================
   */

  // Mapeamento de labels dos atributos → chave no CSV
  // Aceita variações em PT/EN/ES e ignora maiúsc/minúsc.
  const ATTR_LABELS = {
    // Físicos / mentais (ajuste se seu idioma estiver diferente)
    'velocidade': 'Velocidade',
    'speed': 'Velocidade',
    'resist': 'Resistência',
    'stamina': 'Resistência',
    'intelig': 'Inteligência',
    'intelligence': 'Inteligência',
    'passe': 'Passe',
    'passing': 'Passe',
    'chute': 'Chute',
    'shooting': 'Chute',
    'cabece': 'Cabeceio',
    'heading': 'Cabeceio',
    'controle': 'Controle de Bola',
    'ball control': 'Controle de Bola',
    'marcação': 'Marcação',
    'marking': 'Marcação',
    'posicion': 'Posicionamento',
    'positioning': 'Posicionamento',
    'tackle': 'Desarme',
    'desarme': 'Desarme',
    'corrida com a bola': 'Corrida com Bola',
    'dribbling': 'Corrida com Bola',
    'finalização': 'Finalização',
    'finishing': 'Finalização',
    'cruzamento': 'Cruzamento',
    'crossing': 'Cruzamento',
    'experi': 'Experiência',
    'experience': 'Experiência',
    // goleiro (se aparecer nos cards)
    'goleiro': 'Goleiro',
    'keeper': 'Goleiro'
  };

  // Labels para estrelas (alto1, baixo2) e velocidade de treino
  const STAR_LABELS = {
    // “alto1” e “baixo2” são nomes de categorias no seu fluxo; aqui salvamos como colunas
    alto1: ['alto', 'high', 'alto1'],
    baixo2: ['baixo', 'low', 'baixo2'],
    treino: ['velocidade de treino', 'training speed', 'velocidad de entrenamiento']
  };

  // Funções auxiliares
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const normText = (t) => (t || '').replace(/\s+/g, ' ').trim();
  const onlyDigits = (t) => (t || '').replace(/[^\d]/g, '');
  const toNumber = (t) => {
    if (t == null) return null;
    const n = String(t).replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');
    const v = parseFloat(n);
    return Number.isFinite(v) ? v : null;
  };

  // CSV safe
  const csvCell = (v) => {
    if (v == null) return '';
    const s = String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  // Tenta ler número de "bolas" (total de pontos/níveis) exibidos no card
  function parseTotalBolas(container) {
    // Heurística 1: badges/bolinhas como <span class="ball ..."> repetidas
    const balls = $$('.ball', container);
    if (balls.length) return balls.length;

    // Heurística 2: texto tipo "Total de bolas: 123"
    const byText = $$('.player-attr, .small, .tiny, .text-muted', container)
      .map(el => normText(el.textContent))
      .find(t => /total.*bolas|balls total|total.*pontos/i.test(t));
    if (byText) {
      const n = toNumber(onlyDigits(byText));
      if (n) return n;
    }
    return '';
  }

  // Conta estrelas num bloco (checa <i class="fa-star">, <img alt="*">, etc.)
  function countStarsIn(node) {
    if (!node) return '';
    const starLike = $$('i[class*="star"], svg[class*="star"], img[alt*="star"], img[src*="star"]', node);
    if (starLike.length) {
      // Se houver half-stars, ajuste aqui (ex.: class*="half"); por ora, contamos inteiras.
      return starLike.length;
    }
    // Fallback: procura “★”
    const txt = normText(node.textContent);
    const stars = (txt.match(/★/g) || []).length;
    return stars || '';
    }

  // Encontra um bloco próximo cujo label contem determinado termo
  function findBlockByLabel(root, labelCandidates) {
    const nodes = $$('*', root).filter(el => {
      const t = normText(el.textContent).toLowerCase();
      return labelCandidates.some(lab => t.includes(lab));
    });
    return nodes[0] || null;
  }

  // Lê “alto/baixo” determinante a partir de rótulos contendo (1) ou (2)
  function parseAltoBaixoDeterminate(attrList) {
    // attrList: array de {label, value, rawLabel}
    // Regra: se o label contém "1", determinante = 'alto1'; se contém "2", 'baixo2'.
    // Salva também o NOME do atributo que carregou o 1 ou 2.
    let det = '';
    let atributo = '';
    for (const row of attrList) {
      const raw = (row.rawLabel || '').toLowerCase();
      if (/\b1\b|\(1\)/.test(raw)) { det = '1'; atributo = row.label; break; }
      if (/\b2\b|\(2\)/.test(raw)) { det = '2'; atributo = row.label; break; }
    }
    return { alto_baixo: det, atributo_determinante: atributo };
  }

  // Extrai ID do jogador a partir de links
  function extractPlayerId(container) {
    const a = $('a[href*="player_id="]', container) || $('a[href*="players&"]', container);
    if (!a) return '';
    const m = a.href.match(/player_id=(\d+)/);
    return m ? m[1] : '';
  }

  // Extrai nome (a partir do link do jogador ou título do card)
  function extractName(container) {
    const a = $('a[href*="player_id="]', container);
    if (a && a.textContent) return normText(a.textContent);
    // fallback: o primeiro H-tag com texto
    const h = $('h3, h4, .player-name, .name', container);
    return h ? normText(h.textContent) : '';
  }

  // Extrai idade e temporada de nascimento a partir de textos frequentes no card
  function extractAgeAndSeason(container) {
    const textNodes = $$('.small, .tiny, .text-muted, .player-meta, .details', container)
      .map(el => normText(el.textContent));
    let idade = '';
    let temporada = '';
    for (const t of textNodes) {
      // Exemplos: "Idade: 23 (Nasc.: temp 95)", "Age: 23 (Born: season 95)"
      const mAge = t.match(/idade[:\s]*?(\d{1,2})|age[:\s]*?(\d{1,2})/i);
      if (mAge) idade = mAge[1] || mAge[2] || idade;

      const mSeason = t.match(/temp(?:orad[ao])?[:\s]*?(\d{2,3})|season[:\s]*?(\d{2,3})/i);
      if (mSeason) temporada = mSeason[1] || mSeason[2] || temporada;
    }
    return { idade, temporada_nascimento: temporada };
  }

  // Extrai prazo final (deadline) e valor solicitado
  function extractDeadlineAndPrice(container) {
    const txts = $$('*', container).map(el => normText(el.textContent));
    // Prazo final
    const tPrazo = txts.find(t => /prazo|deadline|fecha.*em|ends/i.test(t)) || '';
    // ex.: "Prazo final: 2025-09-30 18:00", "Deadline: in 3h 14m", etc.
    let prazo_final = '';
    const mDate = tPrazo.match(/\b(\d{4}-\d{2}-\d{2}.*?)$/) || tPrazo.match(/(\d{1,2}[:h]\d{2}.*)/);
    if (mDate) prazo_final = mDate[1];

    // Valor solicitado
    const tPreco = txts.find(t => /valor|preço|asking|ask/i.test(t)) || '';
    // números com milhar/ponto e decimal/vírgula
    const mMoney = tPreco.match(/([\d\.\,]+)/);
    const valor_solicitado = mMoney ? mMoney[1] : '';

    return { prazo_final, valor_solicitado };
  }

  // Extrai tabela/lista de atributos do card
  function extractAttributes(container) {
    const rows = [];
    // Pega linhas que parecem "Label: valor" ou estão lado a lado
    const possibleRows = $$('li, .row, .attr, .attribute, tr', container);

    for (const r of possibleRows) {
      const t = normText(r.textContent).toLowerCase();
      // encontre um label conhecido
      const key = Object.keys(ATTR_LABELS).find(k => t.includes(k));
      if (!key) continue;

      // label “cru” para detecção de (1)/(2)
      const rawLabelNode = $('*', r) || r;
      const rawLabel = normText(rawLabelNode.textContent);

      // tenta achar número do atributo no mesmo bloco
      let val = '';
      // 1) números explícitos
      const m = rawLabel.match(/(\d{1,2})\s*$/) || normText(r.textContent).match(/(\d{1,2})\s*$/);
      if (m) val = m[1];

      // 2) bolinhas (nível visual)
      if (!val) {
        const dots = $$('i[class*="dot"], span[class*="dot"], .ball', r).length;
        if (dots) val = String(dots);
      }

      rows.push({
        label: ATTR_LABELS[key],
        value: val,
        rawLabel: rawLabel
      });
    }

    // Consolida num objeto {Atributo: valor}
    const out = {};
    for (const row of rows) {
      out[row.label] = row.value;
    }

    // Determina alto/baixo e atributo determinante
    const det = parseAltoBaixoDeterminate(rows);

    return { attrs: out, ...det };
  }

  // Extrai estrelas para alto1, baixo2, velocidade de treino
  function extractStars(container) {
    const findAndCount = (labels) => {
      const node = findBlockByLabel(container, labels);
      return countStarsIn(node);
    };
    return {
      estrelas_alto1: findAndCount(STAR_LABELS.alto1.map(s => s.toLowerCase())),
      estrelas_baixo2: findAndCount(STAR_LABELS.baixo2.map(s => s.toLowerCase())),
      estrelas_vel_treino: findAndCount(STAR_LABELS.treino.map(s => s.toLowerCase()))
    };
  }

  // Seleciona “cards/linhas” de jogadores nos resultados
  function selectPlayerCards() {
    // Heurísticas comuns:
    // - tabela: linhas com link ?player_id=...
    // - cards: divs com link do jogador
    const byTable = $$('tr').filter(tr => $('a[href*="player_id="]', tr));
    if (byTable.length) return byTable;

    const byCard = $$('div, li').filter(div => $('a[href*="player_id="]', div));
    return byCard;
  }

  // Extrai 1 jogador a partir de um card/linha
  function scrapeOne(container) {
    const id = extractPlayerId(container);
    const nome = extractName(container);
    const { idade, temporada_nascimento } = extractAgeAndSeason(container);
    const total_bolas = parseTotalBolas(container);
    const { prazo_final, valor_solicitado } = extractDeadlineAndPrice(container);
    const { attrs, alto_baixo, atributo_determinante } = extractAttributes(container);
    const { estrelas_alto1, estrelas_baixo2, estrelas_vel_treino } = extractStars(container);

    return {
      ID: id,
      Nome: nome,
      Idade: idade,
      'Temporada Nascimento': temporada_nascimento,
      'Total de Bolas': total_bolas,
      'Prazo Final': prazo_final,
      'Valor Solicitado': valor_solicitado,
      // Atributos (ignorando Forma)
      Velocidade: attrs['Velocidade'] || '',
      'Resistência': attrs['Resistência'] || '',
      Inteligência: attrs['Inteligência'] || '',
      Passe: attrs['Passe'] || '',
      Chute: attrs['Chute'] || '',
      Cabeceio: attrs['Cabeceio'] || '',
      'Controle de Bola': attrs['Controle de Bola'] || '',
      Marcação: attrs['Marcação'] || '',
      Posicionamento: attrs['Posicionamento'] || '',
      Desarme: attrs['Desarme'] || '',
      'Corrida com Bola': attrs['Corrida com Bola'] || '',
      Finalização: attrs['Finalização'] || '',
      Cruzamento: attrs['Cruzamento'] || '',
      Experiência: attrs['Experiência'] || '',
      // Estrelas
      'Estrelas Alto1': estrelas_alto1,
      'Estrelas Baixo2': estrelas_baixo2,
      'Velocidade de Treinamento (★)': estrelas_vel_treino,
      // Determinante alto/baixo
      'Alto/Baixo (1/2)': alto_baixo,
      'Atributo Determinante': atributo_determinante
    };
  }

  // Constrói CSV com separador ';'
  function toCSV(rows) {
    const headers = [
      'ID','Nome','Idade','Temporada Nascimento','Total de Bolas','Prazo Final','Valor Solicitado',
      'Velocidade','Resistência','Inteligência','Passe','Chute','Cabeceio','Controle de Bola','Marcação',
      'Posicionamento','Desarme','Corrida com Bola','Finalização','Cruzamento','Experiência',
      'Estrelas Alto1','Estrelas Baixo2','Velocidade de Treinamento (★)',
      'Alto/Baixo (1/2)','Atributo Determinante'
    ];

    const lines = [
      headers.map(csvCell).join(';'),
      ...rows.map(r => headers.map(h => csvCell(r[h])).join(';'))
    ];
    return lines.join('\n');
  }

  // Dispara download
  function download(name, text) {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 250);
  }

  /** ==========================
   *  SCRAPER (PÁGINA ATUAL)
   *  ==========================
   */
  function scrapeCurrentPage() {
    const cards = selectPlayerCards();
    const rows = [];
    for (const c of cards) {
      try {
        const row = scrapeOne(c);
        if (row.ID || row.Nome) rows.push(row);
      } catch (e) {
        // silencioso, segue o baile
      }
    }
    return rows;
  }

  /** ==========================
   *  PAGINAÇÃO (TODAS AS PÁGINAS)
   *  ==========================
   *
   *  Estratégia: usamos ajaxSearchOffset se existir; caso não exista no escopo,
   *  simulamos cliques nos links de paginação que tenham offset.
   */
  async function scrapeAllPages() {
    const aggregate = [];
    const seen = new Set();

    // Se a função global existir, iteramos offsets razoáveis (até 1000 registros)
    const ajaxFn = window.ajaxSearchOffset;
    if (typeof ajaxFn === 'function') {
      // Detecta quantos offsets existem na paginação atual (lê links)
      const getOffsetsFromDOM = () =>
        $$('a[href*="offset="], a.page-link, .pagination a')
          .map(a => {
            const m = (a.getAttribute('onclick') || '').match(/ajaxSearchOffset\((\d+)\)/) ||
                      (a.href || '').match(/offset=(\d+)/);
            return m ? parseInt(m[1], 10) : null;
          })
          .filter(v => Number.isInteger(v));

      const offsets = Array.from(new Set([0, ...getOffsetsFromDOM()])).sort((a,b)=>a-b);
      for (const off of offsets) {
        await goOffset(off);
        await waitForResultsMutation();
        const pageRows = scrapeCurrentPage();
        for (const r of pageRows) {
          const key = r.ID || r.Nome + '|' + r['Prazo Final'] + '|' + r['Valor Solicitado'];
          if (!seen.has(key)) {
            seen.add(key);
            aggregate.push(r);
          }
        }
      }
      return aggregate;
    }

    // Fallback: sem ajaxSearchOffset — tentamos clicar nos links de paginação
    const pagerLinks = $$('a[href*="offset="], a.page-link, .pagination a');
    if (!pagerLinks.length) {
      // Sem paginador → só atual
      return scrapeCurrentPage();
    }

    // Primeira página
    aggregate.push(...scrapeCurrentPage());
    // Demais páginas (abrindo em AJAX se for SPA, ou navegando)
    for (const a of pagerLinks) {
      if (a.click) a.click();
      await waitForResultsMutation();
      aggregate.push(...scrapeCurrentPage());
    }
    return dedupe(aggregate);

    function dedupe(arr) {
      const out = [];
      const s = new Set();
      for (const r of arr) {
        const key = r.ID || r.Nome + '|' + r['Prazo Final'] + '|' + r['Valor Solicitado'];
        if (!s.has(key)) {
          s.add(key);
          out.push(r);
        }
      }
      return out;
    }

    function waitForResultsMutation() {
      return new Promise(resolve => {
        const container = document.body;
        const obs = new MutationObserver((muts) => {
          // heurística: quando houver muitos links de players, deve ter carregado
          const count = $$('a[href*="player_id="]').length;
          if (count > 0) {
            obs.disconnect();
            setTimeout(resolve, 100); // pequeno buffer
          }
        });
        obs.observe(container, { childList: true, subtree: true });
        // timeout de segurança
        setTimeout(() => { obs.disconnect(); resolve(); }, 4000);
      });
    }

    async function goOffset(n) {
      try {
        const ret = ajaxFn(n);
        // Se ajaxFn não retornar Promise, aguarda um pequeno tempo
        if (ret && typeof ret.then === 'function') await ret;
        await new Promise(r => setTimeout(r, 200));
      } catch (e) {
        await new Promise(r => setTimeout(r, 300));
      }
    }
  }

  /** ==========================
   *  UI (PAINEL FLUTUANTE)
   *  ==========================
   */
  function injectPanel() {
    if ($('#mz-export-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'mz-export-panel';
    panel.innerHTML = `
      <div style="
        position: fixed; right: 14px; bottom: 14px; z-index: 99999;
        background: rgba(15, 17, 23, 0.9); color: #fff; padding: 12px 14px;
        border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,.25); font: 13px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, sans-serif;">
        <div style="font-weight:600;margin-bottom:8px;">MZ • Exportar Transferências</div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
          <button id="mz-btn-page" style="padding:6px 10px;border-radius:8px;border:none;cursor:pointer;">Coletar (página)</button>
          <button id="mz-btn-all" style="padding:6px 10px;border-radius:8px;border:none;cursor:pointer;">Coletar (todas páginas)</button>
          <button id="mz-btn-dl" style="padding:6px 10px;border-radius:8px;border:none;cursor:pointer;" disabled>Baixar CSV</button>
        </div>
        <div id="mz-status" style="opacity:.85">Aguardando…</div>
      </div>
    `;
    document.body.appendChild(panel);

    let buffer = [];

    $('#mz-btn-page').addEventListener('click', () => {
      try {
        const rows = scrapeCurrentPage();
        buffer = rows;
        $('#mz-status').textContent = `Coletados (página): ${rows.length}`;
        $('#mz-btn-dl').disabled = rows.length === 0;
      } catch (e) {
        $('#mz-status').textContent = `Erro: ${e.message || e}`;
      }
    });

    $('#mz-btn-all').addEventListener('click', async () => {
      $('#mz-status').textContent = 'Coletando todas as páginas…';
      try {
        buffer = await scrapeAllPages();
        $('#mz-status').textContent = `Coletados (todas páginas): ${buffer.length}`;
        $('#mz-btn-dl').disabled = buffer.length === 0;
      } catch (e) {
        $('#mz-status').textContent = `Erro: ${e.message || e}`;
      }
    });

    $('#mz-btn-dl').addEventListener('click', () => {
      if (!buffer.length) return;
      const csv = toCSV(buffer);
      const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
      download(`mz_transferencias_${stamp}.csv`, csv);
    });
  }

  /** ==========================
   *  BOOT
   *  ==========================
   */
  function isTransferPage() {
    const href = location.href;
    return /[?&]p=transfer(&|$)/i.test(href) || /\/transfer/i.test(href);
  }

  function boot() {
    if (!isTransferPage()) return;
    injectPanel();
  }

  // Espera DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
