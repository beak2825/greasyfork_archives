// ==UserScript==
// @name         TM Simple Routine + R5 (Stable Field Version) v3.4 - Pop-up Flutuante
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Mostra Routine, R5 e a média R5 da equipe (total, defesa, meio, ataque) em um pop-up flutuante.
// @author       Gemini (baseado no script de Borgo Cervaro e RatingR6)
// @match        https://trophymanager.com/*tactics/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554651/TM%20Simple%20Routine%20%2B%20R5%20%28Stable%20Field%20Version%29%20v34%20-%20Pop-up%20Flutuante.user.js
// @updateURL https://update.greasyfork.org/scripts/554651/TM%20Simple%20Routine%20%2B%20R5%20%28Stable%20Field%20Version%29%20v34%20-%20Pop-up%20Flutuante.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *** Constantes e Variáveis Globais ***
    var players_on_field = {};
    var player_r5_values = {};
    var global_r5_values = { def: [], mid: [], att: [] };
    var updateTimeout;
    const SHARE_BONUS = 0.25;
    const ROUTINE_CAP = 40.0;
    const DEF_LINE_IDX = [0, 6];
    const MID_LINE_IDX = [6, 16];
    const OFF_LINE_IDX = [16, 24];
    const WEIGHT_R5 = [[0.41029304,0.18048062,0.56730138,1.06344654,1.02312672,0.40831256,0.58235457,0.12717479,0.05454137,0.09089830,0.42381693,0.04626272,0.02199046,0],[0.42126371,0.18293193,0.60567629,0.91904794,0.89070915,0.40038476,0.56146633,0.15053902,0.15955429,0.15682932,0.42109742,0.09460329,0.03589655,0],[0.23412419,0.32032289,0.62194779,0.63162534,0.63143081,0.45218831,0.47370658,0.55054737,0.17744915,0.39932519,0.26915814,0.16413124,0.07404301,0],[0.27276905,0.26814289,0.61104798,0.39865092,0.42862643,0.43582015,0.46617076,0.44931076,0.25175412,0.46446692,0.29986350,0.43843061,0.21494592,0],[0.25219260,0.25112993,0.56090649,0.18230261,0.18376490,0.45928749,0.53498118,0.59461481,0.09851189,0.61601950,0.31243959,0.65402884,0.29982016,0],[0.28155678,0.24090675,0.60680245,0.19068879,0.20018012,0.45148647,0.48230007,0.42982389,0.26268609,0.57933805,0.31712419,0.65824985,0.29885649,0],[0.22029884,0.29229690,0.63248227,0.09904394,0.10043602,0.47469498,0.52919791,0.77555880,0.10531819,0.71048302,0.27667115,0.56813972,0.21537826,0],[0.21151292,0.35804710,0.88688492,0.14391236,0.13769621,0.46586605,0.34446036,0.51377701,0.59723919,0.75126119,0.16550722,0.29966502,0.12417045,0],[0.35479780,0.14887553,0.43273380,0.00023928,0.00021111,0.46931131,0.57731335,0.41686333,0.05607604,0.62121195,0.45370457,1.03660702,0.43205492,0],[0.45462811,0.30278232,0.45462811,0.90925623,0.45462811,0.90925623,0.45462811,0.45462811,0.30278232,0.15139116,0.15139116]];

    function initialize() {
        if (typeof players_by_id !== 'undefined' && Object.keys(players_by_id).length > 0) {
            main();
        } else {
            setTimeout(initialize, 200);
        }
    }

    function main() {
        updateAndDisplay();
        setupMutationObserver();
    }

    function updateAndDisplay() {
        if (typeof players_by_id === 'undefined' || typeof formation_by_pos === 'undefined') return;
        updatePlayersRoutine();
        calculateFieldPlayersR5();
        displayAverageRatings(); // Chama a função de exibição das médias
        displayOnFieldRatings();
    }

    function setupMutationObserver() {
        const observer = new MutationObserver(() => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(updateAndDisplay, 150);
        });
        const tacticsNode = document.getElementById('tactics_field');
        if (tacticsNode) {
            observer.observe(tacticsNode, { childList: true, subtree: true });
        }
    }

    function updatePlayersRoutine() {
        players_on_field = {};
        [DEF_LINE_IDX, MID_LINE_IDX, OFF_LINE_IDX].forEach(line => updateLineRoutine(line));
    }

    function updateLineRoutine(line_idx) {
        let players_ar = [];
        for (let i = line_idx[0]; i < line_idx[1]; i++) {
            const id = formation_by_pos[i];
            if (id && id !== "0") {
                players_ar.push({ "id": id, "routine": parseFloat(players_by_id[id].routine) });
            }
        }
        if (players_ar.length > 1) {
            players_ar.sort((a, b) => a.routine - b.routine);
            let min_player = players_ar[0];
            if (min_player.routine < ROUTINE_CAP) {
                let bonus = players_ar[players_ar.length - 1].routine * SHARE_BONUS;
                let new_routine = Math.min(min_player.routine + bonus, players_ar[1].routine, ROUTINE_CAP);
                min_player.routine = parseFloat(new_routine.toFixed(1));
            }
        }
        players_ar.forEach(p => { players_on_field[p.id] = { routine: p.routine }; });
    }

    function calculateFieldPlayersR5() {
        player_r5_values = {};

        let r5_defense = [];
        let r5_midfield = [];
        let r5_attack = [];

        $("div.field_player[player_set='true']").each(function() {
            const id = $(this).attr("player_id");
            const player = players_by_id[id];
            if (!player || !player.skills) return;

            let routine = players_on_field[id] ? players_on_field[id].routine : parseFloat(player.routine);
            const posNames = ["dc","dcl","dcr","dl","dr","dmc","dmcl","dmcr","dml","dmr","mc","mcl","mcr","ml","mr","omc","omcl","omcr","oml","omr","fc","fcl","fcr","gk"];
            const posMap = [0,0,0,1,1,2,2,2,3,3,4,4,4,5,5,6,6,6,7,7,8,8,8,9];
            const player_pos_attr = $(this).attr('position');
            const fp = posMap[posNames.indexOf(player_pos_attr)] ?? player.fp;

            const is_gk = (fp === 9);
            const asi = parseFloat(player.skill_index.replace(",", ""));
            const skill_map = is_gk ? ["0","1","2","3","4","5","7","9","11","13","15"] : ["0","2","4","6","8","10","12","1","3","5","7","9","11","13"];
            const skills = skill_map.map(i => parseFloat(String(player.skills[i]?.value || '0').match(/\d+/)?.[0] || 0));
            const skillSum = skills.reduce((a, b) => a + b, 0);

            const weight = is_gk ? 48717927500 : 263533760000;
            const remainder = Math.max(0, Math.round((Math.pow(2, Math.log(weight * asi) / Math.log(Math.pow(2, 7))) - skillSum) * 10) / 10);
            const rou2 = (3 / 100) * (100 - (100) * Math.pow(Math.E, -routine * 0.035));

            let ratingR = 0, remainderWeight2 = 0;
            const not20 = skills.filter(s => s < 20).length;

            if (WEIGHT_R5[fp]) {
                for (let i = 0; i < skills.length; i++) {
                    if (i < WEIGHT_R5[fp].length) {
                        ratingR += skills[i] * WEIGHT_R5[fp][i];
                        if (skills[i] < 20) remainderWeight2 += WEIGHT_R5[fp][i];
                    }
                }
            }
            if (remainder / (not20 || 1) > 0.9 || not20 === 0) remainderWeight2 = 5;

            ratingR += remainder * remainderWeight2 / (not20 || 1);
            const base_r5 = ratingR + rou2 * 5;

            const goldstar = skills.filter(s => s === 20).length;
            const denom = (skills.length - goldstar) || 1;
            const skillsC = skills.map(s => (s !== 20) ? s + remainder / denom : 20);
            const skillsB = skillsC.map((s, i) => (is_gk || i === 1) ? s : s + rou2);

            let allBonus = 0, posGain = 0, posKeep = 0;
            if (!is_gk) {
                const sB = skillsB;
                const gainBase = ((sB[0]**2 + sB[1]**2*0.5 + sB[2]**2*0.5 + sB[3]**2 + sB[4]**2 + sB[5]**2 + sB[6]**2)/6/22.9**2);
                const keepBase = ((sB[0]**2*0.5 + sB[1]**2*0.5 + sB[2]**2 + sB[3]**2 + sB[4]**2 + sB[5]**2 + sB[6]**2)/6/22.9**2);
                const posGainTable = [gainBase*0.3, gainBase*0.3, gainBase*0.9, gainBase*0.6, gainBase*1.5, gainBase*0.9, gainBase*0.9, gainBase*0.6, gainBase*0.3];
                const posKeepTable = [keepBase*0.3, keepBase*0.3, keepBase*0.9, keepBase*0.6, keepBase*1.5, keepBase*0.9, keepBase*0.9, keepBase*0.6, keepBase*0.3];
                posGain = posGainTable[fp] || 0;
                posKeep = posKeepTable[fp] || 0;

                const headerBonus = sB[10] > 12 ? ((Math.pow(Math.E, (sB[10]-10)**3/1584.77)-1)*0.8 + Math.pow(Math.E, (sB[0]*sB[0]*0.007)/8.73021)*0.15 + Math.pow(Math.E, (sB[6]*sB[6]*0.007)/8.73021)*0.05) : 0;
                const fkBonus = (Math.pow(Math.E, Math.pow(sB[13]+sB[12]+sB[9]*0.5, 2)*0.002)/327.92526);
                const ckBonus = (Math.pow(Math.E, Math.pow(sB[13]+sB[8]+sB[9]*0.5, 2)*0.002)/983.65770);
                const pkBonus = (Math.pow(Math.E, Math.pow(sB[13]+sB[11]+sB[9]*0.5, 2)*0.002)/1967.31409);
                allBonus = headerBonus + fkBonus + ckBonus + pkBonus;
            }

            player_r5_values[id] = (base_r5 + allBonus + posGain + posKeep).toFixed(2);

            const r5_val = parseFloat(player_r5_values[id]);
            if (isNaN(r5_val)) return;

            const def_pos = ['gk', 'dl', 'dr', 'dc', 'dcl', 'dcr'];
            const mid_pos = ['dmc', 'dmcl', 'dmcr', 'dml', 'dmr', 'mc', 'mcl', 'mcr', 'ml', 'mr', 'omc', 'omcl', 'omcr', 'oml', 'omr'];
            const att_pos = ['fc', 'fcl', 'fcr'];

            if (def_pos.includes(player_pos_attr)) {
                r5_defense.push(r5_val);
            } else if (mid_pos.includes(player_pos_attr)) {
                r5_midfield.push(r5_val);
            } else if (att_pos.includes(player_pos_attr)) {
                r5_attack.push(r5_val);
            }
        });

        global_r5_values = {
            def: r5_defense,
            mid: r5_midfield,
            att: r5_attack
        };
    }

    function displayOnFieldRatings() {
        $("div.field_player").each(function() {
            const $this = $(this);
            $this.find(".tm-r5-display").remove();
            if ($this.attr("player_set") === "true") {
                const id = $this.attr("player_id");
                const routine = players_on_field[id] ? players_on_field[id].routine.toFixed(1) : parseFloat(players_by_id[id]?.routine || 0).toFixed(1);
                const r5 = player_r5_values[id] || "N/A";
                const displayText = `Rou: ${routine} / R5: ${r5}`;
                const displayDiv = `<div class="tm-r5-display" style="font-size: 10px; width: 100%; text-align: center; background-color: rgba(0,0,0,0.6); border-radius: 3px; padding: 1px 0; margin-top: 1px;">${displayText}</div>`;
                $this.append(displayDiv);
            }
        });
    }

    // *** MUDANÇA PRINCIPAL AQUI: Função para calcular e exibir as médias ***
    function displayAverageRatings() {
        // 1. Encontra ou cria o container de exibição
        let $container = $("#tm-average-r5-display");
        if ($container.length === 0) {
            $container = $('<div id="tm-average-r5-display"></div>');
            // Anexa o painel diretamente ao 'body' para garantir que ele flutue
            $('body').append($container);
        }

        // 2. Aplica o estilo para posicionamento FIXO (FLUTUANTE)
        $container.css({
            'position': 'fixed', // *** MUDANÇA: de 'absolute' para 'fixed' ***
            'top': '150px',       // Posição do topo (ajuste se necessário)
            'left': '10px',        // Posição da esquerda (ajuste se necessário)
            'z-index': '9999',     // Garante que fique por cima de tudo
            'width': '170px',      // Largura do painel
            'background-color': 'rgba(0, 0, 0, 0.8)', // Um pouco mais escuro
            'color': 'white',
            'padding': '8px',
            'border-radius': '5px',
            'font-size': '12px',
            'box-sizing': 'border-box',
            'border': '1px solid #444' // Adiciona uma borda leve
        });

        // 3. Calcula as médias
        const { def, mid, att } = global_r5_values;
        const all_players = [...def, ...mid, ...att];

        const calc_avg = (arr) => {
            if (arr.length === 0) return "N/A";
            const sum = arr.reduce((a, b) => a + b, 0);
            return (sum / arr.length).toFixed(2);
        };

        const avg_def = calc_avg(def);
        const avg_mid = calc_avg(mid);
        const avg_att = calc_avg(att);
        const avg_total = calc_avg(all_players);

        // 4. Atualiza o HTML do container
        $container.html(`
            <strong style="color: #FFF; border-bottom: 1px solid #555; display: block; margin-bottom: 5px; padding-bottom: 3px;">Média R5 da Equipe</strong>
            <div style="display: flex; justify-content: space-between;"><span>Defesa:</span> <span>${avg_def} (${def.length})</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Meio:</span> <span>${avg_mid} (${mid.length})</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Ataque:</span> <span>${avg_att} (${att.length})</span></div>
            <strong style="margin-top: 5px; border-top: 1px solid #555; display: block; padding-top: 3px; display: flex; justify-content: space-between;">
                <span>Total:</span> <span>${avg_total} (${all_players.length})</span>
            </strong>
        `);
    }
    // *** FIM da função modificada ***

    initialize();

})();