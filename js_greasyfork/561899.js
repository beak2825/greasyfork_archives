// ==UserScript==
// @name         Popmundo Heist Analyzer
// @namespace    http://tampermonkey.net/
// @version      2.14.5
// @description  xxx
// @author       Liss
// @match        https://*.popmundo.com/*
// @run-at       document-idle
// @grant        GM_notification
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/561899/Popmundo%20Heist%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/561899/Popmundo%20Heist%20Analyzer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 1. Injeção do Font Awesome 6 ---
  const faLink = document.createElement('link');
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
  document.head.appendChild(faLink);

  // --- 2. CSS AUTOMATOR STYLE (Round & Black Border) ---
  GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap');

    #heist-analyzer-panel {
        position: fixed; bottom: 20px; right: 20px;
        width: 320px;
        background: #fff;
        border: 2px solid #000; /* Borda preta pedida */
        border-radius: 20px; /* Painel bem redondo */
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: 'Segoe UI', Tahoma, sans-serif;
        color: #333;
        z-index: 999999;
        overflow: hidden; /* Garante que o conteúdo respeite as bordas redondas */
    }

    /* Header */
    .auto-header {
        padding: 12px 20px; /* Mais padding lateral por causa da borda redonda */
        display: flex; justify-content: space-between; align-items: center;
        background: #fcfcfc;
        border-bottom: 1px solid #eee;
        cursor: move; /* Indica que é arrastável */
        user-select: none; /* Previne seleção de texto ao arrastar */
    }
    .auto-header h3 { margin: 0; font-size: 14px; font-weight: 700; color: #444; display: flex; align-items: center; gap: 6px; }
    .version-tag { background: #eee; color: #777; font-size: 10px; padding: 2px 6px; border-radius: 10px; }

    /* Content */
    .auto-body { padding: 15px; max-height: 80vh; overflow-y: auto; }

    /* Status Pills */
    .status-bar { display: flex; gap: 6px; margin-bottom: 15px; flex-wrap: wrap; }
    .auto-status {
        font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 12px;
        border: 1px solid #eee; display: flex; align-items: center; gap: 6px;
    }
    .auto-status i { width: 12px; text-align: center; }

    .status-off { background: #f9f9f9; color: #777; } /* Neutro */
    .status-on { background: #e8f5e9; color: #28a745; border-color: #c3e6cb; } /* Verde/Bom */
    .status-warn { background: #fff3cd; color: #856404; border-color: #ffeeba; } /* Amarelo */
    .status-danger { background: #f8d7da; color: #721c24; border-color: #f5c6cb; } /* Vermelho */

    /* Recommendation Box (Hero) */
    .rec-box {
        background: #fff;
        border: 1px solid #ddd;
        border-left: 5px solid #28a745; /* Verde Sucesso mais grosso */
        padding: 12px; margin-bottom: 15px; border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .rec-box.card-alert { border-left-color: #6f42c1; background: #f8f0ff; } /* Roxo Carta */
    .rec-box.critical { border-left-color: #dc3545; background: #fff5f5; animation: pulse 2s infinite; } /* Vermelho Crítico */

    .rec-title { font-weight: 700; font-size: 14px; color: #333; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .rec-desc { font-size: 11px; color: #666; line-height: 1.4; }
    .rec-equip { font-size: 10px; color: #999; margin-top: 4px; display: flex; align-items: center; gap: 4px; }

    /* List */
    .list-section { border-top: 1px solid #eee; padding-top: 10px; }
    .list-title { font-size: 10px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }

    .action-item {
        display: flex; justify-content: space-between; align-items: center;
        padding: 6px 8px; border-bottom: 1px solid #f9f9f9;
        font-size: 12px; color: #444;
        transition: background 0.1s;
        border-radius: 4px;
    }
    .action-item:last-child { border-bottom: none; }
    .action-item:hover { background: #f5f5f5; }
    .action-left { display: flex; align-items: center; gap: 8px; }
    .action-icon { color: #888; font-size: 11px; width: 14px; text-align: center; }

    .score-badge { font-weight: bold; font-size: 10px; color: #ccc; min-width: 20px; text-align: right; }
    .score-high { color: #28a745; }

    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.2); } 70% { box-shadow: 0 0 0 4px rgba(220, 53, 69, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); } }

    /* Scrollbar */
    .auto-body::-webkit-scrollbar { width: 5px; }
    .auto-body::-webkit-scrollbar-track { background: #f1f1f1; }
    .auto-body::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
    .auto-body::-webkit-scrollbar-thumb:hover { background: #bbb; }
  `);

  function getActionIcon(text) {
      const t = normalizeText(text);
      if (t.includes('hackear') || t.includes('burlar') || t.includes('decodificar') || t.includes('analisar') || t.includes('desconectar')) return 'fa-laptop-code';
      if (t.includes('nocautear') || t.includes('nocaute')) return 'fa-hand-fist';
      if (t.includes('subornar')) return 'fa-money-bill-wave';
      if (t.includes('amarrar')) return 'fa-link';
      if (t.includes('arrombar') || t.includes('destrancar') || t.includes('abrir')) return 'fa-unlock-keyhole';
      if (t.includes('violar') || t.includes('perfurar')) return 'fa-drill';
      if (t.includes('sorrateiramente') || t.includes('passar') || t.includes('surrupiar')) return 'fa-user-ninja';
      if (t.includes('alimentar')) return 'fa-bone';
      if (t.includes('distrair') || t.includes('acalmar')) return 'fa-masks-theater';
      if (t.includes('seduzir')) return 'fa-heart';
      if (t.includes('evadir') || t.includes('fugir') || t.includes('pular') || t.includes('escalar')) return 'fa-person-running';
      if (t.includes('coletar') || t.includes('esvaziar') || t.includes('remover') || t.includes('vasculhar')) return 'fa-sack-dollar';
      if (t.includes('cortar') || t.includes('serrar')) return 'fa-scissors';
      if (t.includes('botar') || t.includes('derrubar')) return 'fa-hammer';
      return 'fa-circle-dot';
  }

  function normalizeText(text) {
      if (!text) return '';
      return text.toLowerCase().trim().replace(/[\(\)]/g, '').replace(/[^\w\s]/gi, '');
  }

  // Função para capitalizar apenas a primeira letra (Sentence case)
  function capitalizeFirstLetter(string) {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const CONFIG = {
    version: '2.14.5',
    WEIGHTS: {
      locationMismatchPenalty: -1.2, locationMatchBonus: 0.8,
      ALERT_PENALTY_YELLOW: 1.0, ALERT_PENALTY_RED: 2.5,
      LOUD_ACTION_PENALTY: -2.0, STEALTH_ACTION_BONUS: 2.5,
      TECH_SPECIFIC_BONUS: 1.5, EVASION_BONUS_WITH_LOOT: 5.0,
      EVASION_PENALTY_NO_LOOT: -2.0, COFRE_BONUS: 4.0,
      BREAK_SAFE_PENALTY: -3.0, OBSTACLE_RECOMMENDED_BONUS: 3.0,
      OBSTACLE_AVOID_PENALTY: -4.0, EQUIPMENT_BONUS: 0.5,
      NEW_SUCCESS_BONUS: 10.0, CARD_RECOMMENDATION_PRIORITY: 15.0,
      DOM_ORDER_PENALTY: 0.5 // Penalidade para ações que aparecem mais abaixo na lista
    },
    actionEquipment: {
        'passar sorrateiramente': 'Botas Ninja', 'escalar/pular': 'Botas Ninja',
        'surrupiar': 'Luvas de Seda', 'arrombar': 'Gazua/Pé de Cabra',
        'violar': 'Estetoscópio', 'destrancar': 'Fio Dental',
        'escalar': 'Arpéu', 'cortar': 'Torquês/Alicate',
        'perfurar': 'Furadeira', 'hackear': 'Circuito Eletrônico',
        'burlar firewall': 'Laptop', 'decodificar': 'Laptop', 'analisar': 'Laptop',
        'nocautear': 'Arma/Taco', 'amarrar': 'Corda/Algemas',
        'botar abaixo': 'Marreta', 'destroçar': 'Marreta'
    },
    // Mantemos as mesmas bases de dados
    relevantActionsPerLocation: {
        hotel: ['subornar', 'nocaute', 'arrombar', 'amarrar', 'alimentar', 'sorrateiramente', 'cofre', 'violar', 'seduzir', 'distrair', 'abrir'],
        banco: ['hackear', 'cofre', 'sensor', 'senha', 'violar', 'subornar', 'nocaute', 'arrombar', 'escalar', 'abrir', 'destrancar', 'sorrateiramente'],
        museu: ['sensor', 'acalmar', 'subornar', 'sorrateiramente', 'cofre', 'nocaute', 'arrombar', 'hackear', 'destrancar', 'remover', 'curador'],
        estúdio: ['hackear', 'acalmar', 'arrombar', 'distrair', 'sorrateiramente', 'cofre', 'seduzir', 'amarrar', 'nocaute', 'subornar'],
        correios: ['hackear', 'nocaute', 'arrombar', 'cofre', 'subornar', 'acalmar', 'amarrar', 'vasculhar', 'cortar', 'abrir'],
        delegacia: ['subornar', 'nocaute', 'amarrar', 'cofre', 'cortar', 'alimentar', 'vasculhar', 'hackear', 'sorrateiramente', 'destrancar', 'perfurar', 'abrir'],
        centro: ['decodificar', 'hackear', 'senha', 'firewall', 'mineração', 'laptop', 'turbinado', 'burlar', 'cortar', 'nocaute', 'destrancar', 'abrir'],
        prisão: ['alimentar', 'cortar', 'hackear', 'derrubar', 'marreta', 'nocaute', 'arrombar', 'abrir'],
        loja: ['hackear', 'nocaute', 'arrombar', 'alimentar', 'esvaziar', 'caixa'],
        escritório: ['hackear', 'nocaute', 'seduzir', 'amarrar', 'violar', 'distrair', 'subornar', 'destrancar', 'arrombar', 'abrir']
    },
    obstacleRecommendations: {
        'câmera de segurança': { recommended: ['hackear'], avoid: ['quebrar'], bonusType: 'hacker' },
        'sensor de movimento infravermelho': { recommended: ['passar sorrateiramente', 'hackear'], avoid: ['quebrar'], bonusType: 'gatuno' },
        'guarda cochilando': { recommended: ['passar sorrateiramente', 'nocautear'], avoid: ['correr'], bonusType: 'gatuno' },
        'cofre': { recommended: ['violar'], avoid: ['quebrar'], bonusType: 'arrombador' },
        'porta de madeira': { recommended: ['arrombar'], avoid: ['botar abaixo'], bonusType: 'gatuno' }
    },

    // ### BASE DE DADOS COMPLETA (VERBOS AJUSTADOS PARA INFINITIVO) ###
    OBSTACLE_SPECIFIC_SUCCESSES: {
        // --- HOTEL ---
        'janela bandeira hotel': { recommended: 'arrombar', successRate: 100, location: 'hotel', obstacle: 'janela bandeira' },
        'porta de madeira hotel': { recommended: 'arrombar', successRate: 100, location: 'hotel', obstacle: 'porta de madeira' },
        'cofre de hospedes hotel': { recommended: 'violar', successRate: 100, location: 'hotel', obstacle: 'cofre de hóspedes' },
        'camareira hotel': { recommended: 'amarrar', successRate: 100, location: 'hotel', obstacle: 'camareira' },
        'chef mal humorado hotel': { recommended: 'amarrar', successRate: 100, location: 'hotel', obstacle: 'chef mal humorado' },
        'ascensorista hotel': { recommended: 'subornar', otherRecommended: 'nocautear', successRate: 100, location: 'hotel', obstacle: 'ascensorista' },
        'entregador de pizza hotel': { recommended: 'subornar', successRate: 100, location: 'hotel', obstacle: 'entregador de pizza' },
        'hospede do hotel hotel': { recommended: 'passar sorrateiramente', otherRecommended: 'nocautear', successRate: 100, location: 'hotel', obstacle: 'hóspede do hotel' },
        'hospede insatisfeito hotel': { recommended: 'subornar', otherRecommended: 'passar sorrateiramente', successRate: 100, location: 'hotel', obstacle: 'hóspede insatisfeito' },
        'carregador de malas hotel': { recommended: 'passar sorrateiramente', successRate: 100, location: 'hotel', obstacle: 'carregador de malas' },
        'zelador zangado hotel': { recommended: 'nocautear', successRate: 100, location: 'hotel', obstacle: 'zelador zangado' },
        'recepcionista do hotel hotel': { recommended: 'subornar', otherRecommended: 'nocautear', successRate: 100, location: 'hotel', obstacle: 'recepcionista do hotel' },
        'dono do hotel hotel': { recommended: 'subornar', otherRecommended: 'distraiu', successRate: 100, location: 'hotel', obstacle: 'dono do hotel' },
        'rottweiler raivoso hotel': { recommended: 'alimentar', successRate: 100, location: 'hotel', obstacle: 'rottweiler raivoso' },
        'chihuahua bravo faminto hotel': { recommended: 'alimentar', successRate: 100, location: 'hotel', obstacle: 'chihuahua bravo faminto' },
        'câmera de segurança hotel': { recommended: 'hackear', successRate: 100, location: 'hotel', obstacle: 'câmera de segurança' },
        'porta com corrente hotel': { recommended: 'destrancar', successRate: 100, location: 'hotel', obstacle: 'porta com corrente' },

        // --- BANCO ---
        'câmera de segurança banco': { recommended: 'hackear', successRate: 100, location: 'banco', obstacle: 'câmera de segurança' },
        'porta do cofre do banco': { recommended: 'violar', successRate: 100, location: 'banco', obstacle: 'porta do cofre do banco' },
        'gerente de banco ganancioso banco': { recommended: 'subornar', successRate: 100, location: 'banco', obstacle: 'gerente de banco ganancioso' },
        'gerente de banco empolgado banco': { recommended: 'nocautear', otherRecommended: 'subornar', successRate: 100, location: 'banco', obstacle: 'gerente de banco empolgado' },
        'gerente de banco idoso banco': { recommended: 'subornar', otherRecommended: 'nocautear', successRate: 100, location: 'banco', obstacle: 'gerente de banco idoso' },
        'guarda de segurança banco': { recommended: 'nocautear', successRate: 100, location: 'banco', obstacle: 'guarda de segurança' },
        'vigilante banco': { recommended: 'nocautear', successRate: 100, location: 'banco', obstacle: 'vigilante' },
        'cliente irritado banco': { recommended: 'nocautear', successRate: 100, location: 'banco', obstacle: 'cliente irritado' },
        'cliente surpreso banco': { recommended: 'nocautear', successRate: 100, location: 'banco', obstacle: 'cliente surpreso' },
        'cliente idoso banco': { recommended: 'nocautear', successRate: 100, location: 'banco', obstacle: 'cliente idoso' },
        'policial de folga banco': { recommended: 'subornar', successRate: 100, location: 'banco', obstacle: 'policial de folga' },
        'inspetor cluedo banco': { recommended: 'passar sorrateiramente', successRate: 100, location: 'banco', obstacle: 'inspetor cluedo' },
        'sensor de movimento infravermelho banco': { recommended: 'passar sorrateiramente', otherRecommended: 'hackear', successRate: 100, location: 'banco', obstacle: 'sensor de movimento infravermelho' },
        'guarda cochilando banco': { recommended: 'nocautear', otherRecommended: 'surrupiar', successRate: 100, location: 'banco', obstacle: 'guarda cochilando' },
        'muro de perímetro banco': { recommended: 'escalar', otherRecommended: 'arpéu', successRate: 100, location: 'banco', obstacle: 'muro de perímetro' },
        'porta de segurança banco': { recommended: 'destrancar', successRate: 100, location: 'banco', obstacle: 'porta de segurança' },

        // --- ESTÚDIO DE GRAVAÇÃO ---
        'gerente do estúdio estúdio': { recommended: 'seduzir', successRate: 100, location: 'estúdio', obstacle: 'gerente do estúdio' },
        'gerente financeiro estúdio': { recommended: 'subornar', successRate: 100, location: 'estúdio', obstacle: 'gerente financeiro' },
        'o grande prodígio estúdio': { recommended: 'distrair', successRate: 100, location: 'estúdio', obstacle: 'o grande prodígio' },
        'músico do estúdio estúdio': { recommended: 'distrair', otherRecommended: 'amarrar', successRate: 100, location: 'estúdio', obstacle: 'músico do estúdio' },
        'fã bêbado estúdio': { recommended: 'passar sorrateiramente', successRate: 100, location: 'estúdio', obstacle: 'fã bêbado' },
        'zelador zangado estúdio': { recommended: 'nocautear', successRate: 100, location: 'estúdio', obstacle: 'zelador zangado' },
        'porta com fechadura dupla estúdio': { recommended: 'arrombar', successRate: 100, location: 'estúdio', obstacle: 'porta com fechadura dupla' },
        'prateleira trancada estúdio': { recommended: 'arrombar', successRate: 100, location: 'estúdio', obstacle: 'prateleira trancada' },
        'porta com cadeado de segurança estúdio': { recommended: 'arrombar', successRate: 100, location: 'estúdio', obstacle: 'porta com cadeado de segurança' },
        'faxineira estúdio': { recommended: 'amarrar', otherRecommended: 'distrair', successRate: 100, location: 'estúdio', obstacle: 'faxineira' },
        'entregador de pizza estúdio': { recommended: 'subornar', successRate: 100, location: 'estúdio', obstacle: 'entregador de pizza' },

        // --- CORREIOS ---
        'gerente dos correios correios': { recommended: 'subornar', successRate: 100, location: 'correios', obstacle: 'gerente dos correios' },
        'funcionário dos correios enfurecido correios': { recommended: 'acalmar', successRate: 100, location: 'correios', obstacle: 'funcionário dos correios enfurecido' },
        'carteiro correios': { recommended: 'nocautear', successRate: 100, location: 'correios', obstacle: 'carteiro' },
        'bolsa de carteiro correios': { recommended: 'vasculhar', successRate: 100, location: 'correios', obstacle: 'bolsa de carteiro' },
        'unidade de energia da cerca elétrica correios': { recommended: 'desconectar', successRate: 100, location: 'correios', obstacle: 'unidade de energia da cerca elétrica' },
        'cerca de perímetro correios': { recommended: 'pular', otherRecommended: 'cortar', successRate: 100, location: 'correios', obstacle: 'cerca de perímetro' },
        'porta dos fundos correios': { recommended: 'abrir', successRate: 100, location: 'correios', obstacle: 'porta dos fundos' },
        'porta com corrente correios': { recommended: 'destrancar', successRate: 100, location: 'correios', obstacle: 'porta com corrente' },

        // --- DELEGACIA ---
        'capitão da polícia delegacia': { recommended: 'passar sorrateiramente', successRate: 100, location: 'delegacia', obstacle: 'capitão da polícia' },
        'oficial de polícia corrupto delegacia': { recommended: 'subornar', otherRecommended: 'nocautear', successRate: 100, location: 'delegacia', obstacle: 'oficial de polícia corrupto' },
        'policial delegacia': { recommended: 'nocautear', successRate: 100, location: 'delegacia', obstacle: 'policial' },
        'cadete da polícia delegacia': { recommended: 'nocautear', otherRecommended: 'passar sorrateiramente', successRate: 100, location: 'delegacia', obstacle: 'cadete da polícia' },
        'detector de movimento dual tech delegacia': { recommended: 'hackear', successRate: 100, location: 'delegacia', obstacle: 'detector de movimento dual tech' },
        'porta de alta segurança delegacia': { recommended: 'perfurar', otherRecommended: 'carta', successRate: 100, location: 'delegacia', obstacle: 'porta de alta segurança' },
        'armário de evidências delegacia': { recommended: 'vasculhar', successRate: 100, location: 'delegacia', obstacle: 'armário de evidências' },
        'cerca de arame farpado delegacia': { recommended: 'cortar', successRate: 100, location: 'delegacia', obstacle: 'cerca de arame farpado' },
        'porta com cadeado de segurança delegacia': { recommended: 'arrombar', otherRecommended: 'cortar', successRate: 100, location: 'delegacia', obstacle: 'porta com cadeado de segurança' },
        'porta com fechadura dupla delegacia': { recommended: 'arrombar', successRate: 100, location: 'delegacia', obstacle: 'porta com fechadura dupla' },
        'porta com corrente delegacia': { recommended: 'destrancar', otherRecommended: 'botou abaixo', successRate: 100.0, location: 'delegacia', obstacle: 'porta com corrente' },

        // --- MUSEU ---
        'curador do museu museu': { recommended: 'subornar', successRate: 100, location: 'museu', obstacle: 'curador do museu' },
        'estudante universitário museu': { recommended: 'nocautear', otherRecommended: 'distrair', successRate: 100, location: 'museu', obstacle: 'estudante universitário' },
        'quadro na parede museu': { recommended: 'remover', successRate: 100, location: 'museu', obstacle: 'quadro na parede' },

        // --- CENTRO DE PESQUISA / ESCRITÓRIO ---
        'gerente geral escritório': { recommended: 'distrair', successRate: 100, location: 'escritório', obstacle: 'gerente geral' },
        'secretária agressiva escritório': { recommended: 'amarrar', otherRecommended: 'seduziu', successRate: 100, location: 'escritório', obstacle: 'secretária agressiva' },
        'cofre do escritório escritório': { recommended: 'violar', successRate: 100, location: 'escritório', obstacle: 'cofre do escritório' },
        'cientista louco centro': { recommended: 'amarrar', successRate: 100, location: 'centro', obstacle: 'cientista louco' },
        'cientista cansado centro': { recommended: 'nocautear', successRate: 100, location: 'centro', obstacle: 'cientista cansado' },
        'firewall centro': { recommended: 'burlar', successRate: 100, location: 'centro', obstacle: 'firewall' },
        'proteção de senha centro': { recommended: 'burlar', successRate: 100, location: 'centro', obstacle: 'proteção de senha' },
        'base de dados gigantesca centro': { recommended: 'analisar', successRate: 100, location: 'centro', obstacle: 'base de dados gigantesca' },
        'base de dados codificada centro': { recommended: 'decodificar', successRate: 100, location: 'centro', obstacle: 'base de dados codificada' },

        // --- PRISÃO ---
        'porta de madeira prisao': { recommended: 'botar abaixo', otherRecommended: 'arrombar', successRate: 100, location: 'prisão', obstacle: 'porta de madeira' },

        // --- LOJA ---
        'caixa loja': { recommended: 'esvaziou', successRate: 100, location: 'loja', obstacle: 'caixa' }
    },
    cardDatabase: {
        'porta de madeira': { name: 'Chave Mestra', effect: 'Lida com porta', locations: ['Geral'] },
        'câmera de segurança': { name: 'Ruído Estático', effect: 'Desativa câmera', locations: ['Geral'] },
        'sensor de movimento infravermelho': { name: 'Cobertor de Emergência', effect: 'Passa pelo sensor', locations: ['Geral'] },
        'detector de movimento dual tech': { name: 'Capa Élfica', effect: 'Passa pelo sensor', locations: ['Delegacia', 'Hospital'] },
        'porta do cofre do banco': { name: 'Abra-te Sésamo', effect: 'Abre o cofre', locations: ['Banco'] },
        'gerente de banco ganancioso': { name: 'Pote de Ouro', effect: 'Suborno garantido', locations: ['Banco'] },
        'gerente de banco empolgado': { name: 'Pegada Firme', effect: 'Suborno garantido', locations: ['Banco'] },
        'cão de guarda': { name: 'Bisteca', effect: 'Distrai o cão', locations: ['Geral'] },
        'rottweiler raivoso': { name: 'Bisteca', effect: 'Distrai o cão', locations: ['Geral'] },
        'chihuahua bravo': { name: 'Brinquedo estridente', effect: 'Distrai o cão', locations: ['Geral'] },
        'zelador zangado': { name: 'Privada Entupida', effect: 'Distrai o zelador', locations: ['Geral'] },
        'cientista louco': { name: 'Rato de Laboratório', effect: 'Distrai o cientista', locations: ['Centro'] },
        'firewall': { name: 'Porta dos Fundos', effect: 'Burlar firewall', locations: ['Centro'] },
        'proteção de senha': { name: '2345MEIA78', effect: 'Quebra senha', locations: ['Centro'] },
        'porta de alta segurança': { name: 'O fortuna', effect: 'Abre a porta', locations: ['Delegacia'] },
        'recepcionista entediada': { name: 'O Meme mais engraçado', effect: 'Distrai', locations: ['Geral'] }
    },
    strategicCards: [
        { name: 'Dar a volta na rotatória III', effect: 'Atrasa guardas 3min', trigger: { time: 18, beforeAlarm: true } },
        { name: 'Dar a volta na rotatória II', effect: 'Atrasa guardas 2min', trigger: { time: 18, beforeAlarm: true } },
        { name: 'Dane-se a polícia III', effect: 'Atrasa polícia 3min', trigger: { afterAlarm: true } },
        { name: 'Bullet Time III', effect: 'Acelera ação 60%', trigger: { time: 18 } },
        { name: 'Espelhos e Fumaça', effect: 'Reduz alerta', trigger: { alert: ['Amarelo', 'Vermelho'] } },
        { name: 'Plano C III', effect: 'Abortar Assalto', trigger: { time: 24, alert: ['Vermelho'] } }
    ]
  };

  // --- 5. FUNÇÕES PRINCIPAIS DE LÓGICA ---
  let detectedLocationType = null;
  let detectedObstacle = null;
  let heistStatus = {};
  let playerCards = [];

  function findEquipmentForAction(actionText) {
      const normalizedAction = normalizeText(actionText);
      for (const key in CONFIG.actionEquipment) {
          if (normalizedAction.includes(normalizeText(key))) return CONFIG.actionEquipment[key];
      }
      return null;
  }

  function detectHeistLocationType() {
    const headers = Array.from(document.querySelectorAll("h1, h4"));
    for (const h of headers) {
        const text = h.textContent.toLowerCase();
        if (text.includes('hotel')) return 'hotel';
        if (text.includes('banco')) return 'banco';
        if (text.includes('museu')) return 'museu';
        if (text.includes('estúdio')) return 'estúdio';
        if (text.includes('correios')) return 'correios';
        if (text.includes('delegacia')) return 'delegacia';
        if (text.includes('prisão')) return 'prisão';
        if (text.includes('loja')) return 'loja';
        if (text.includes('escritório')) return 'escritório';
        if (text.includes('pesquisa')) return 'centro';
        if (text.includes('cemitério') || text.includes('túmulo')) return 'túmulo';
    }
    return null;
  }

  function detectCurrentObstacle() {
    const obstacleHeaders = Array.from(document.querySelectorAll('h3, h4, p'));
    for (const h of obstacleHeaders) {
        if (h.textContent.includes('Prosseguir') || h.textContent.includes('Obstáculos na área')) continue;
        const normalizedHeaderText = normalizeText(h.textContent);

        for (const key in CONFIG.OBSTACLE_SPECIFIC_SUCCESSES) {
             const obstacleName = CONFIG.OBSTACLE_SPECIFIC_SUCCESSES[key].obstacle || key;
             if (normalizedHeaderText.includes(normalizeText(obstacleName))) return obstacleName;
        }
        for (const key in CONFIG.cardDatabase) {
            if (normalizedHeaderText.includes(normalizeText(key))) return key;
        }
        for (const key in CONFIG.obstacleRecommendations) {
            if (normalizedHeaderText.includes(normalizeText(key))) return key;
        }
    }
    return null;
  }

  function getAvailableCards() {
    const cardsOnPage = new Set();
    document.querySelectorAll('#heist-view-cards .card .card-title').forEach(el => {
        const name = el.cloneNode(true);
        if (name.querySelector('.card-level')) name.querySelector('.card-level').remove();
        cardsOnPage.add(normalizeText(name.textContent));
    });
    return Array.from(cardsOnPage);
  }

  function getSpecificObstacleRecommendation() {
      if (!detectedObstacle) return null;
      const normalizedObstacle = normalizeText(detectedObstacle);
      const location = detectedLocationType || 'geral';

      for (const key in CONFIG.OBSTACLE_SPECIFIC_SUCCESSES) {
          const entry = CONFIG.OBSTACLE_SPECIFIC_SUCCESSES[key];
          if (entry.location === location && normalizeText(entry.obstacle) === normalizedObstacle) {
              return entry;
          }
      }
      for (const key in CONFIG.OBSTACLE_SPECIFIC_SUCCESSES) {
          const entry = CONFIG.OBSTACLE_SPECIFIC_SUCCESSES[key];
          if (normalizeText(entry.obstacle) === normalizedObstacle) {
              return entry;
          }
      }
      return null;
  }

  function extractHeistStatus() {
    const status = { alerta: 'Verde', vigilia: 'Baixa', relogio: 0, hasLoot: false };
    const table = $('.box h2:contains("Detalhes do assalto")').closest('.box').find('table')[0];
    if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 2) return;
            const label = cells[0].textContent.trim().toLowerCase();
            const value = cells[1].textContent.trim();
            if (label.includes('alerta')) status.alerta = value;
            else if (label.includes('vigília')) status.vigilia = value;
            else if (label.includes('relógio')) {
                const timeMatch = value.match(/(\d+)\s*minuto/);
                if (timeMatch) status.relogio = parseInt(timeMatch[1], 10);
            }
        });
    }
    if ($('p:contains("A gangue encontrou espólios!")').length > 0 || $('button:contains("Coletar")').length > 0) {
        status.hasLoot = true;
    }
    return status;
  }

  function scoreOption(optionText) {
    let score = 0;
    const reasons = [];
    const text = normalizeText(optionText);

    // Bônus Genéricos
    if (text.includes('sorrateiramente') || text.includes('acalmar')) { score += 2.5; reasons.push('Furtividade'); }
    if (text.includes('hackear') || text.includes('burlar')) { score += 2.0; reasons.push('Técnico'); }
    if (text.includes('nocaute') || text.includes('amarrar')) { score += 1.5; reasons.push('Neutralização'); }
    if (text.includes('subornar')) { score += 1.5; reasons.push('Suborno'); }
    if (text.includes('arrombar') || text.includes('violar') || text.includes('destrancar')) { score += 2.0; reasons.push('Acesso Físico'); }

    // Recomendação Específica (Database Tsunoda)
    const specificRec = getSpecificObstacleRecommendation();
    if (specificRec) {
        const recAction = normalizeText(specificRec.recommended);
        const otherRec = specificRec.otherRecommended ? normalizeText(specificRec.otherRecommended) : null;

        if (text.includes(recAction)) {
            score += 15.0;
            reasons.unshift('★ META: Ação Padrão de Sucesso');
        } else if (otherRec && text.includes(otherRec)) {
            score += 8.0;
            reasons.unshift('☆ Alternativa Segura');
        }
    }

    return { score, reasons };
  }

  function detectOptions(containerEl) {
    const opts = [];
    if (!containerEl) return opts;

    const allElements = containerEl.querySelectorAll('select, button, a.btn');

    allElements.forEach((el, index) => {
        if (el.tagName === 'SELECT') {
            el.querySelectorAll('option:not([value="NONE"])').forEach(optEl => {
                const text = optEl.textContent.trim();
                // Index para penalidade de ordem
                if (text) opts.push({ el: optEl, text, score: 0, reasons: [], index: index });
            });
        } else {
            const text = (el.innerText || el.value || '').trim();
            if (text.length > 3 && !text.toLowerCase().includes('usar carta')) {
                opts.push({ el, text, score: 0, reasons: [], index: index });
            }
        }
    });

    return opts;
  }

  function createPanel() {
    let panel = document.getElementById('heist-analyzer-panel');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'heist-analyzer-panel';
    panel.innerHTML = `
      <div class="auto-header">
        <h3><i class="fa-solid fa-user-secret"></i> Heist Analyzer <span class="version-tag">2.14.5</span></h3>
      </div>
      <div class="auto-body">
        <div class="status-bar" id="heist-status"></div>
        <div id="heist-recommendations"></div>
        <div class="list-section">
            <div class="list-title">Outras Ações:</div>
            <div id="heist-options-list"></div>
        </div>
      </div>`;

    // Tornar o painel arrastável
    const header = panel.querySelector('.auto-header');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = panel.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        // Remove posicionamento bottom/right para usar top/left
        panel.style.bottom = 'auto';
        panel.style.right = 'auto';
        panel.style.left = initialLeft + 'px';
        panel.style.top = initialTop + 'px';

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        panel.style.left = (initialLeft + dx) + 'px';
        panel.style.top = (initialTop + dy) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.body.appendChild(panel);
    return panel;
  }

  function runAnalysisAndRender() {
    const panel = createPanel();
    const heistBlock = document.querySelector('.heist-view, #heist-view-actions, #heist-view-cards') || $('h2:contains("Detalhes do assalto")').closest('.box')[0];

    if (!heistBlock) {
        panel.style.display = 'none';
        return;
    }
    panel.style.display = 'block';

    detectedLocationType = detectHeistLocationType();
    detectedObstacle = detectCurrentObstacle();
    heistStatus = extractHeistStatus();
    playerCards = getAvailableCards();

    // Render Status
    const alertClass = heistStatus.alerta.toLowerCase().includes('vermelho') ? 'status-danger' : (heistStatus.alerta.toLowerCase().includes('amarelo') ? 'status-warn' : 'status-on');
    const timeClass = heistStatus.relogio >= 24 ? 'status-danger' : (heistStatus.relogio >= 18 ? 'status-warn' : 'status-off');

    // Removido o Alvo do Status conforme pedido
    panel.querySelector('#heist-status').innerHTML = `
        <div class="auto-status status-off"><i class="fa-solid fa-map-location-dot"></i> ${detectedLocationType ? detectedLocationType.toUpperCase() : 'N/A'}</div>
        <div class="auto-status ${alertClass}"><i class="fa-solid fa-bell"></i> ${heistStatus.alerta}</div>
        <div class="auto-status ${timeClass}"><i class="fa-solid fa-stopwatch"></i> ${heistStatus.relogio} min</div>
    `;

    const recContainer = panel.querySelector('#heist-recommendations');
    recContainer.innerHTML = '';

    // 1. Avisos Críticos
    if (heistStatus.relogio >= 24) {
        recContainer.innerHTML += `<div class="rec-box critical"><div class="rec-title"><i class="fa-solid fa-triangle-exclamation"></i> FUGA IMEDIATA!</div><div class="rec-desc">Tempo esgotado. Alarme iminente.</div></div>`;
    }

    // 2. Recomendação de Carta
    const cardRec = CONFIG.cardDatabase[normalizeText(detectedObstacle)];
    if (cardRec && playerCards.includes(normalizeText(cardRec.name))) {
        recContainer.innerHTML += `
        <div class="rec-box card-alert">
            <span class="rec-title"><i class="fa-solid fa-star" style="color:#6f42c1"></i> Carta: ${cardRec.name}</span>
            <span class="rec-desc">${cardRec.effect}</span>
        </div>`;
    }

    // 3. Recomendação de Ação Principal
    const options = detectOptions(heistBlock);

    const sortedOptions = [...options];
    sortedOptions.forEach(opt => {
        let { score, reasons } = scoreOption(opt.text);
        score -= (opt.index * CONFIG.WEIGHTS.DOM_ORDER_PENALTY); // Penalidade de ordem
        opt.score = score;
        opt.reasons = reasons;
    });
    sortedOptions.sort((a, b) => b.score - a.score);

    if (sortedOptions.length > 0) {
        const best = sortedOptions[0];
        const equip = findEquipmentForAction(best.text);
        const icon = getActionIcon(best.text);

        const isCritical = heistStatus.relogio >= 24;
        const heroClass = isCritical ? 'critical' : '';

        recContainer.innerHTML += `
        <div class="rec-box ${heroClass}">
            <span class="rec-title"><i class="fa-solid ${icon}"></i> ${best.text}</span>
            <span class="rec-desc">${best.reasons[0] || 'Melhor opção calculada'}</span>
            ${equip ? `<div class="rec-equip"><i class="fa-solid fa-wrench"></i> ${equip}</div>` : ''}
        </div>`;
    } else {
        recContainer.innerHTML += `<div class="rec-box" style="border-left-color:#ccc"><span class="rec-title">Aguardando...</span></div>`;
    }

    // 4. Lista de Todas as Ações (ORDEM ORIGINAL)
    const listContainer = panel.querySelector('#heist-options-list');
    listContainer.innerHTML = '';

    if (options.length > 0) {
        options.forEach(opt => {
            const res = scoreOption(opt.text);
            const icon = getActionIcon(opt.text);
            const equip = findEquipmentForAction(opt.text);
            const scoreClass = res.score > 0 ? 'score-high' : '';

            listContainer.innerHTML += `
            <div class="action-item">
                <div class="action-left">
                    <i class="fa-solid ${icon} action-icon"></i>
                    <span>${opt.text} ${equip ? `<i class="fa-solid fa-wrench" title="${equip}" style="font-size:9px; color:#aaa; margin-left:3px;"></i>` : ''}</span>
                </div>
                <div class="score-badge ${scoreClass}">${res.score.toFixed(0)}</div>
            </div>`;
        });
    }
  }

  setInterval(runAnalysisAndRender, 1000);

})();