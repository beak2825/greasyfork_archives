// ==UserScript==
// @name         Popmundo Heist Analyzerr
// @namespace    http://tampermonkey.net/
// @version      2.27.0
// @description  Analisa assaltos com base nos logs e probabilidades reais da gangue. Inclui Extrator de Inteligência.
// @author       Chris
// @match        https://*.popmundo.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/561899/Popmundo%20Heist%20Analyzerr.user.js
// @updateURL https://update.greasyfork.org/scripts/561899/Popmundo%20Heist%20Analyzerr.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 1. Injeção do Font Awesome 6 ---
  const faLink = document.createElement('link');
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
  document.head.appendChild(faLink);

  // --- 2. CSS (Painel do Analisador e Botões do Extrator) ---
  GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap');

    /* Painel do Analisador */
    #heist-analyzer-panel {
        position: fixed; bottom: 20px; right: 20px;
        width: 320px;
        background: #fff;
        border: 2px solid #000;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: 'Segoe UI', Tahoma, sans-serif;
        color: #333;
        z-index: 999999;
        overflow: hidden;
        display: none;
    }

    .auto-header {
        padding: 12px 20px;
        display: flex; justify-content: space-between; align-items: center;
        background: #fcfcfc;
        border-bottom: 1px solid #eee;
        cursor: move;
        user-select: none;
    }
    .auto-header h3 { margin: 0; font-size: 13px; font-weight: 700; color: #444; display: flex; align-items: center; gap: 6px; }
    .version-tag { background: #000; color: #fff; font-size: 9px; padding: 2px 6px; border-radius: 10px; font-weight: 800; }

    .auto-body { padding: 15px; max-height: 80vh; overflow-y: auto; }

    .rec-box {
        background: #fff;
        border: 1px solid #ddd;
        border-left: 5px solid #28a745;
        padding: 12px; margin-bottom: 15px; border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .rec-box.intelligence { border-left-color: #6f42c1; background: #f8f0ff; }

    .rec-title { font-weight: 700; font-size: 14px; color: #333; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .rec-desc { font-size: 12px; color: #666; line-height: 1.4; font-weight: 600; }
    .rec-equip { font-size: 10px; color: #888; margin-top: 6px; display: flex; align-items: center; gap: 4px; text-transform: uppercase; font-weight: 700; }

    .list-section { border-top: 1px solid #eee; padding-top: 10px; }
    .list-title { font-size: 10px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }

    .action-item {
        display: flex; justify-content: space-between; align-items: center;
        padding: 8px 8px; border-bottom: 1px solid #f9f9f9;
        font-size: 12px; color: #444;
        transition: background 0.1s;
        border-radius: 4px;
    }
    .action-item:last-child { border-bottom: none; }
    .action-item:hover { background: #f5f5f5; }
    .score-badge { font-weight: bold; font-size: 10px; color: #ccc; min-width: 20px; text-align: right; }
    .score-high { color: #6f42c1; }
    .obs-label { font-size: 9px; color: #aaa; margin-left: 4px; font-weight: 400; font-style: italic; }

    /* Estilos do Extrator */
    #extrator-tools {
        position: fixed; top: 10px; right: 10px;
        z-index: 999999; display: flex; flex-direction: column; gap: 5px;
    }
    .extrator-btn {
        padding: 10px 15px; border: 1px solid #fff; cursor: pointer;
        font-family: 'Segoe UI', sans-serif; font-weight: bold; font-size: 12px;
        border-radius: 5px; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .btn-map { background: #4CAF50; }
    .btn-view { background: #2196F3; }
    .btn-clear { background: #f44336; }
  `);

  const CONFIG = {
    actionEquipment: {
        'passar sorrateiramente': 'Botas Ninja', 'arrombar': 'Gazua/Pé de Cabra',
        'hackear': 'Circuito de segurança', 'nocautear': 'Arma/Taco', 'violar': 'Estetoscópio',
        'subornar': 'Dinheiro', 'amarrar': 'Corda/Algemas', 'burlar': 'Laptop',
        'destrancar': 'Fio Dental', 'perfurar': 'Furadeira', 'cortar': 'Torquês/Alicate'
    },
    verbStems: {
        'nocaute': 'nocaut', 'hacke': 'hack', 'distra': 'distrai', 'passar': 'passou',
        'arromb': 'arromb', 'viol': 'viol', 'destranc': 'destranc', 'amarra': 'amarr',
        'suborn': 'suborn', 'perfur': 'perfur', 'abrir': 'abriu', 'burl': 'burl',
        'analis': 'analis', 'remov': 'remov', 'lidar': 'lidou', 'aliment': 'aliment'
    }
  };

  // --- Funções Auxiliares ---
  function formatSentenceCase(str) {
    if (!str) return "";
    let s = str.trim().replace(/^\d+\.\s+/i, "");
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  function normalize(t) {
    return t ? t.toLowerCase().trim()
      .replace(/^(o|a|os|as|um|uma)\s+/i, "")
      .replace(/^\d+\.\s+/i, "")
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, ' ') : '';
  }

  // --- Lógica do Extrator ---
  function fetchPageContent(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET", url: url,
            onload: (res) => res.status === 200 ? resolve(res.responseText) : reject(),
            onerror: reject
        });
    });
  }

  function parseAndSaveLogs(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const intelligence = JSON.parse(localStorage.getItem('heist_intelligence') || '{}');
    const logs = $(doc).find('table.data:not(#tableheists) tbody tr');

    const verbosLista = ['nocauteou', 'destrancou', 'lidou com', 'amarrou', 'violou', 'arrombou', 'passou sorrateiramente por', 'hackeou', 'subornou', 'perfurar', 'cortou', 'alimentar', 'abriu', 'burlou', 'analisou', 'removeu'];

    logs.each(function() {
        const text = $(this).find('td:eq(1)').text().trim();
        if (text.includes("usou uma carta") || text.includes("prosseguiu para")) return;

        verbosLista.forEach(verbo => {
            if (text.includes(verbo)) {
                let partes = text.split(verbo);
                if (partes.length > 1) {
                    let obstaculoCru = partes[1].split(" em ")[0].trim();
                    let obstaculo = obstaculoCru.replace(/^(o|a|os|as|um|uma)\s+/i, "").toLowerCase();
                    let acao = verbo.toLowerCase();

                    if (!intelligence[obstaculo]) intelligence[obstaculo] = {};
                    if (!intelligence[obstaculo][acao]) intelligence[obstaculo][acao] = { success: 0, total: 0 };

                    intelligence[obstaculo][acao].success++;
                    intelligence[obstaculo][acao].total++;
                }
            }
        });
    });
    localStorage.setItem('heist_intelligence', JSON.stringify(intelligence));
  }

  function runExtractorUI() {
    // Verifica se estamos na página de lista de assaltos da gangue
    if (!window.location.href.includes('/Artist/Heists/')) return;

    const container = $('<div id="extrator-tools"></div>');
    const startBtn = $('<button class="extrator-btn btn-map">Mapear Logs Novos</button>');
    const viewBtn = $('<button class="extrator-btn btn-view">Ver Banco de Dados</button>');
    const clearBtn = $('<button class="extrator-btn btn-clear">Limpar Tudo</button>');

    $('body').append(container.append(startBtn, viewBtn, clearBtn));

    startBtn.on('click', async function() {
        const links = $('#tableheists tbody tr td:nth-child(2) a').map((i, el) => $(el).attr('href')).get();
        if (links.length === 0) return;

        startBtn.text('Processando...').prop('disabled', true);
        for (let i = 0; i < links.length; i++) {
            try {
                const html = await fetchPageContent(window.location.origin + links[i]);
                parseAndSaveLogs(html);
                startBtn.text(`${i + 1}/${links.length}`);
            } catch (e) {}
            await new Promise(r => setTimeout(r, 400));
        }
        startBtn.text('Logs Mapeados!').css('background', '#2e7d32');
        setTimeout(() => location.reload(), 1000);
    });

    viewBtn.on('click', function() {
        const data = JSON.parse(localStorage.getItem('heist_intelligence') || '{}');
        let report = "INTELIGÊNCIA DE ASSALTO:\n\n";
        for (let obs in data) {
            report += `[${formatSentenceCase(obs)}]\n`;
            for (let ac in data[obs]) {
                report += `  > ${ac}: ${data[obs][ac].success} sucessos\n`;
            }
            report += "\n";
        }
        const win = window.open("", "", "width=500,height=600");
        win.document.write(`<pre>${report || "Banco vazio."}</pre>`);
    });

    clearBtn.on('click', () => {
        if (confirm("Resetar toda a inteligência aprendida?")) {
            localStorage.removeItem('heist_intelligence');
            location.reload();
        }
    });
  }

  // --- Lógica do Analisador ---
  function getIntelligence(obs, act) {
    const db = JSON.parse(localStorage.getItem('heist_intelligence') || '{}');
    const nObs = normalize(obs);
    const nAct = normalize(act);

    let stem = null;
    for (let s in CONFIG.verbStems) {
        if (nAct.includes(s)) { stem = CONFIG.verbStems[s]; break; }
    }

    for (let key in db) {
        const nKey = normalize(key);
        if (nObs.includes(nKey) || nKey.includes(nObs)) {
            for (let savedAction in db[key]) {
                const sSaved = normalize(savedAction);
                if (sSaved.includes(nAct) || nAct.includes(sSaved) || (stem && sSaved.includes(stem))) {
                    const s = db[key][savedAction];
                    const rate = (s.success / s.total) * 100;
                    return { score: (s.success / s.total) * 30 + 10, prob: rate.toFixed(0) };
                }
            }
        }
    }
    return null;
  }

  function runAnalysis() {
    const heistView = document.getElementById('heist-view-actions') ||
                      document.querySelector('.heist-view') ||
                      document.querySelector('[id*="divHeistActions"]');

    const panel = document.getElementById('heist-analyzer-panel') || createPanel();

    if (!heistView || $(heistView).find('select, button, input[type="submit"]').length === 0) {
        panel.style.display = 'none';
        return;
    }

    panel.style.display = 'block';
    const options = [];
    const blocks = $(heistView).find('div[id*="_divBarrier"], .box.bmargin5, div.box.ofauto');

    blocks.each(function() {
        const barrierDiv = $(this);
        let rawObstacle = barrierDiv.find('p:not(.float_right)').first().text().trim() ||
                          barrierDiv.find('h4').text().trim() ||
                          barrierDiv.find('b').first().text().trim();

        if (!rawObstacle || rawObstacle.length < 2) return;
        const cleanObstacle = rawObstacle.replace(/^\d+\.\s+/i, "").split('\n')[0].trim();

        barrierDiv.find('select option:not([value="NONE"]), input[type="button"], button').each(function() {
            const txt = ($(this).text() || $(this).val() || "").trim();
            if (txt.length > 2 && txt.toUpperCase() !== 'VÁ!' && !txt.includes('Carta')) {
                const intel = getIntelligence(cleanObstacle, txt);
                options.push({
                    text: txt,
                    obstacle: cleanObstacle,
                    score: intel ? intel.score : 0,
                    prob: intel ? intel.prob : null
                });
            }
        });
    });

    options.sort((a, b) => b.score - a.score);
    render(options);
  }

  function createPanel() {
    const p = document.createElement('div');
    p.id = 'heist-analyzer-panel';
    p.innerHTML = `
        <div class="auto-header">
            <h3><i class="fa-solid fa-brain"></i> AI Heist Analyzer <span class="version-tag">LOG AI</span></h3>
        </div>
        <div class="auto-body">
            <div id="heist-recommendations"></div>
            <div class="list-section">
                <div class="list-title">Ações Detectadas</div>
                <div id="heist-options-list"></div>
            </div>
        </div>`;
    document.body.appendChild(p);

    const header = p.querySelector('.auto-header');
    let isDragging = false, startX, startY, initialLeft, initialTop;

    header.onmousedown = (e) => {
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        const rect = p.getBoundingClientRect();
        initialLeft = rect.left; initialTop = rect.top;
        p.style.bottom = 'auto'; p.style.right = 'auto';
        p.style.left = initialLeft + 'px'; p.style.top = initialTop + 'px';
        e.preventDefault();
    };

    document.onmousemove = (e) => {
        if (!isDragging) return;
        p.style.left = (initialLeft + (e.clientX - startX)) + 'px';
        p.style.top = (initialTop + (e.clientY - startY)) + 'px';
    };

    document.onmouseup = () => isDragging = false;
    return p;
  }

  function render(opts) {
    const recDiv = document.getElementById('heist-recommendations');
    const listDiv = document.getElementById('heist-options-list');
    if (!recDiv || !listDiv) return;

    recDiv.innerHTML = ''; listDiv.innerHTML = '';

    if (opts.length > 0 && opts[0].prob !== null) {
        const best = opts[0];
        const nBestText = normalize(best.text);
        let equip = null;

        for (let key in CONFIG.actionEquipment) {
            if (nBestText.includes(normalize(key)) || normalize(key).includes(nBestText)) {
                equip = CONFIG.actionEquipment[key];
                break;
            }
        }

        recDiv.innerHTML = `
            <div class="rec-box intelligence">
                <div class="rec-title"><i class="fa-solid fa-microchip"></i> ${formatSentenceCase(best.text)}</div>
                <div class="rec-desc">Probabilidade de sucesso de ${best.prob}%</div>
                ${equip ? `<div class="rec-equip"><i class="fa-solid fa-wrench"></i> ${equip}</div>` : ''}
            </div>`;
    } else {
        recDiv.innerHTML = `<div class="rec-box" style="border-left-color: #ccc; color: #999; font-size: 11px; text-align: center; padding: 15px;">Deteção ativa. Aguardando obstáculo mapeado nos logs...</div>`;
    }

    opts.forEach(o => {
        const scoreClass = o.score > 10 ? 'score-high' : '';
        listDiv.innerHTML += `
            <div class="action-item">
                <span>${formatSentenceCase(o.text)} <span class="obs-label">(${formatSentenceCase(o.obstacle)})</span></span>
                <span class="score-badge ${scoreClass}">${o.score > 0 ? (o.score - 10).toFixed(0) : '-'}</span>
            </div>`;
    });
  }

  // --- Inicialização ---
  runExtractorUI();
  setInterval(runAnalysis, 1000);
})();
