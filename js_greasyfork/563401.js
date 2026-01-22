// ==UserScript==
// @name         Grepolympia Helper - Estadísticas y Optimización
// @namespace    grepolympia.helper
// @version      1.2.0
// @description  Calcula y muestra stats de suerte, score esperado y guía de entrenamiento óptimo para Grepolympia.
// @match        https://*.grepolis.com/game/*
// @match        http://*.grepolis.com/game/*
// @exclude      https://classic.grepolis.com/game/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563401/Grepolympia%20Helper%20-%20Estad%C3%ADsticas%20y%20Optimizaci%C3%B3n.user.js
// @updateURL https://update.greasyfork.org/scripts/563401/Grepolympia%20Helper%20-%20Estad%C3%ADsticas%20y%20Optimizaci%C3%B3n.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const uw = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : (window.uw || window);
    let tabsBound;
    let isTownSwitchHooked = false;
    let townSwitchSubscription = null;

    // -------------------- CSS --------------------
    function addStyleOnce() {
        if (document.getElementById('go_helper_style')) return;

        const st = document.createElement('style');
        st.id = 'go_helper_style';
        st.textContent = `
/* luck box (user requested exact styles) */
.cstm_go_luck_line{
  margin-top:-170px;
  font-weight:600;
  text-shadow:0 1px rgba(0,0,0,.25), 0 1px rgba(0,0,0,.25), -1px 0 rgba(0,0,0,.25), -1px 0 rgba(0,0,0,.25);
  font-variant-numeric: tabular-nums;
  padding:10px;
  border-radius:12px;
  background:rgba(0,0,0,.5);
  border:1px solid rgba(255,255,255,.10);
}

/* Training: small guidance box (user requested exact styles) */
.cstm_go_training_hint{
  margin-top: -80px;
  padding: 8px 10px;
  border-radius: 10px;
  text-shadow:0 1px rgba(0,0,0,.25);
  font-variant-numeric: tabular-nums;
  background: rgba(0,0,0,.5);
  border: 1px solid rgba(255,255,255,.10);
  width: fit-content;
  margin-inline: auto;
}

/* colors for luck */
.cstm_go_luck_line span.good_3{ color:#2f0; }
.cstm_go_luck_line span.good_2{ color:#8f0; }
.cstm_go_luck_line span.good_1{ color:#bf0; }
.cstm_go_luck_line span.neutral{ color:#ff0; }
.cstm_go_luck_line span.bad_1{ color:#fb0; }
.cstm_go_luck_line span.bad_2{ color:#f80; }
.cstm_go_luck_line span.bad_3{ color:#f20; }

/* training highlights on plus */
.go_plus_good{
  box-shadow: 0 0 0 2px rgba(80,255,120,.85) inset, 0 0 10px rgba(80,255,120,.35);
  border-radius: 4px;
}
.go_plus_bad{
  box-shadow: 0 0 0 2px rgba(255,90,90,.85) inset, 0 0 10px rgba(255,90,90,.35);
  border-radius: 4px;
  opacity: .95;
}

/* training reset warning */
.go_reset_warn{
  box-shadow: 0 0 0 3px rgba(255,90,90,.9) inset, 0 0 14px rgba(255,90,90,.35);
  border-radius: 10px;
}

/* hint text colors */
.cstm_go_training_hint .bad{ color:#ff8a8a; font-weight:700; }
.cstm_go_training_hint .ok{ color:#8dff8d; font-weight:700; }

/* training margins */
.go_athlete .middle_box.training{ margin-top: 50px !important; }
.go_athlete .skill_points_box{ margin-top: 50px !important; }

/* export table button */
.go_export_table_btn {
  position: absolute;
  top: 23px;
  left: 50%;
  transform: translateX(-50%);
  width: 61px;
  height: 52px;
  background-image: url('https://i.imgur.com/9H5tcwS.png');
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  z-index: 10;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.go_export_table_btn:hover{
  opacity: 1;
}
`;
        document.head.appendChild(st);
    }

    // -------------------- helpers --------------------
    function qs(sel, root = document) { return root.querySelector(sel); }

    function readFirstNumber(text) {
        if (!text) return null;
        const m = String(text).replace(/\s+/g, ' ').match(/(\d+(?:\.\d+)?)/);
        return m ? Number(m[1]) : null;
    }

    function getLuckClass(pct) {
        if (pct >= 4) return 'good_3';
        if (pct >= 2) return 'good_2';
        if (pct > 0) return 'good_1';
        if (pct === 0) return 'neutral';
        if (pct > -2) return 'bad_1';
        if (pct > -4) return 'bad_2';
        return 'bad_3';
    }

    // -------------------- models / formula --------------------
    function getDisciplinesData() {
        try {
            const m = uw.MM?.getModels?.();
            const g = m?.Grepolympia?.[uw.Game?.player_id];
            return g?.getDataDisciplines?.() || null;
        } catch {
            return null;
        }
    }

    function getParams(discObj) {
        if (!discObj) return null;
        const base = Number(discObj.basic_score);
        const sm = discObj.score_matrix;
        if (!Number.isFinite(base) || !sm) return null;

        const f = sm.first_skill_points;
        const s = sm.second_skill_points;
        const t = sm.third_skill_points;
        if (!f || !s || !t) return null;

        const params = {
            base,
            m1: Number(f.multiplier), p1: Number(f.power),
            m2: Number(s.multiplier), p2: Number(s.power),
            m3: Number(t.multiplier), p3: Number(t.power),
            unit: discObj.score_unit || '',
            decimals: Number.isFinite(Number(discObj.score_decimal_places)) ? Number(discObj.score_decimal_places) : 0,
            names: discObj.skillnames || discObj.internalskillnames || null
        };
        const ok = [params.m1,params.p1,params.m2,params.p2,params.m3,params.p3].every(Number.isFinite);
        return ok ? params : null;
    }

    function expectedScore(params, a, b, c) {
        return params.base
            + params.m1 * Math.pow(a, params.p1)
            + params.m2 * Math.pow(b, params.p2)
            + params.m3 * Math.pow(c, params.p3);
    }

    function bruteBestSplit(level, params) {
        let best = { a: 0, b: 0, c: level, expected: -Infinity };
        for (let a = 0; a <= level; a++) {
            for (let b = 0; b <= (level - a); b++) {
                const c = level - a - b;
                const s = expectedScore(params, a, b, c);
                if (s > best.expected) best = { a, b, c, expected: s };
            }
        }
        return best;
    }

    function findAthleteByDiscipline(disciplineId) {
        try {
            const athletes = uw.MM?.getModels?.().GrepolympiaAthlete;
            if (!athletes) return null;
            for (const key of Object.keys(athletes)) {
                const a = athletes[key];
                if (a?.getDiscipline?.() === disciplineId) return a;
            }
            return null;
        } catch {
            return null;
        }
    }

    function getSkills(athlete) {
        try {
            const s = athlete?.getSkills?.();
            if (Array.isArray(s) && s.length >= 3) {
                const a = Number(s[0]), b = Number(s[1]), c = Number(s[2]);
                return [a,b,c].every(Number.isFinite) ? [a,b,c] : null;
            }
            return null;
        } catch {
            return null;
        }
    }

    // -------------------- discipline from DOM --------------------
    function getDisciplineFromInfoDom() {
        const el = qs('.go_info .discipline_box .content');
        if (!el) return null;
        const cl = Array.from(el.classList || []);
        for (const c of cl) if (c !== 'content') return c;
        return null;
    }

    function getDisciplineFromTrainingDom() {
        const el = qs('.go_athlete');
        if (!el) return null;
        const cl = Array.from(el.classList || []);
        for (const c of cl) if (c !== 'go_athlete') return c;
        return null;
    }

    // -------------------- persistence (GM) --------------------
    const KEY_PREFIX = 'go_last_attempt_';

    function saveAttemptSkills(disciplineId, skills, expectedScore) {
        try {
            GM_setValue(KEY_PREFIX + disciplineId + uw.Game.world_id, JSON.stringify({
                ts: Date.now(),
                skills,
                expected: expectedScore
            }));
        } catch {}
    }
    function loadAttemptSkills(disciplineId) {
        try {
            const raw = GM_getValue(KEY_PREFIX + disciplineId + uw.Game.world_id, '');
            if (!raw) return null;
            const obj = JSON.parse(raw);
            if (!obj || !Array.isArray(obj.skills) || obj.skills.length < 3) return null;
            return obj;
        } catch {
            return null;
        }
    }

    // -------------------- Export optimal table to BBCode --------------------
    function generateOptimalTableBBCode(disciplineId, maxLevel = 200) {
        const discData = getDisciplinesData();
        const discObj = discData?.[disciplineId];
        const params = getParams(discObj);
        if (!params) return null;

        const disciplineName = discObj.title || disciplineId;
        const skillNames = params.names || {
            first_skill_points: 'Habilidad 1',
            second_skill_points: 'Habilidad 2',
            third_skill_points: 'Habilidad 3'
        };

        // Obtener tiers de recompensa
        const scoreTiers = discObj.score_tier || [];

        const rows = [];

        // Header con columna de Tier
        rows.push(`[**]Nivel[||]${skillNames.first_skill_points}[||]${skillNames.second_skill_points}[||]${skillNames.third_skill_points}[||]Estimado[||]Tier[/**]`);

        // Data rows
        let previousTier = -1;
        for (let level = 1; level <= maxLevel; level++) {
            const optimal = bruteBestSplit(level, params);
            const expectedStr = optimal.expected.toFixed(params.decimals);
            const safeScore = optimal.expected * 0.95; // Asumiendo máximo -5% mala suerte

            // Determinar qué tier se alcanza con seguridad
            let currentTier = 0;
            for (let i = scoreTiers.length - 1; i >= 0; i--) {
                if (safeScore >= scoreTiers[i]) {
                    currentTier = i;
                    break;
                }
            }

            // Marcar en rojo si es un salto de tier
            const isNewTier = currentTier > previousTier;
            const tierText = isNewTier ? `[color=#FF0000]${currentTier}[/color]` : currentTier;
            const levelText = isNewTier ? `[color=#FF0000][b]${level}[/b][/color]` : `[b]${level}[/b]`;

            rows.push(`[*]${levelText}[|]${optimal.a}[|]${optimal.b}[|]${optimal.c}[|]${expectedStr}${params.unit}[|]${tierText}[/*]`);

            previousTier = currentTier;
        }

        const fullTable = `[table]\n${rows.join('\n')}\n[/table]`;

        // Fragmentar en spoilers de 50 niveles
        const spoilers = [];
        const rowsPerSpoiler = 50;

        for (let start = 1; start <= maxLevel; start += rowsPerSpoiler) {
            const end = Math.min(start + rowsPerSpoiler - 1, maxLevel);
            const spoilerRows = [rows[0]]; // Header

            for (let i = start; i <= end; i++) {
                spoilerRows.push(rows[i]); // rows[i] porque rows[0] es header, rows[1] es nivel 1, etc.
            }

            const spoilerTable = `[table]\n${spoilerRows.join('\n')}\n[/table]`;
            const spoilerTitle = `Niveles ${start} al ${end} - ${disciplineName}`;

            spoilers.push({
                title: spoilerTitle,
                content: `[spoiler=${spoilerTitle}]${spoilerTable}[/spoiler]`
            });
        }

        return { fullTable, spoilers, disciplineName };
    }

    function generateUnitsTableBBCode() {
        const trainingData = getTrainingData();
        if (!trainingData) return null;

        const units = [];
        for (const [unitName, data] of Object.entries(trainingData)) {
            if (!Array.isArray(data) || data.length < 2) continue;
            const pointsPerUnit = data[0];
            const maxUnits = data[1];
            const totalPoints = pointsPerUnit * maxUnits;
            units.push({ unitName, pointsPerUnit, maxUnits, totalPoints });
        }

        // Ordenar de mayor a menor eficiencia
        units.sort((a, b) => b.totalPoints - a.totalPoints);

        const rows = [];
        rows.push(`[**]Unidad[||]Puntos/unidad[||]Máx. unidades[||]Total puntos[||]Con +20%[/**]`);

        for (const unit of units) {
            rows.push(`[*]${uw.GameData.units[unit.unitName].name_plural}[|][center]${unit.pointsPerUnit}[/center][|][center]${unit.maxUnits}[/center][|][center][b]${unit.totalPoints}[/b][/center][|][center][b][color=#0101D6]${Math.round(unit.totalPoints * 1.2)}[/color][/b][/center][/*]`);
        }

        const table = `[table]\n${rows.join('\n')}\n[/table]`;
        return { table, units };
    }

    function openTableExportWindow(disciplineId) {
        const tableData = generateOptimalTableBBCode(disciplineId);
        if (!tableData) {
            uw.HumanMessage?.error?.('No se pudo generar la tabla');
            return;
        }

        const unitsData = generateUnitsTableBBCode();
        const unitsHTML = unitsData ? `
            <div style="margin-bottom:12px;">
                <div style="font-weight:bold;margin-bottom:4px;">Ranking de Unidades por Eficiencia</div>
                <textarea id="units_table_textarea" style="width:100%;height:120px;font-family:monospace;font-size:11px;">${unitsData.table}</textarea>
                <button class="button_new" id="copy_units_btn" style="margin-top:4px;">Copiar tabla de unidades</button>
            </div>
        ` : '';

        const existing = Array.from(document.querySelectorAll('.ui-dialog-title'))
            .some(t => t.textContent.trim() === 'Exportar Tabla Óptima');
        if (existing) return;

        const wnd = uw.Layout.wnd.Create(uw.Layout.wnd.TYPE_DIALOG, 'Exportar Tabla Óptima', { width: '620', height: '500' });
        let dialog;
        Array.from(document.querySelectorAll('.ui-dialog-title')).forEach(t => {
            if (t.textContent.trim() === 'Exportar Tabla Óptima') dialog = t.closest('.ui-dialog');
        });
        if (!dialog) return;

        const content = dialog.querySelector('.gpwindow_content') || dialog;
        const box = document.createElement('div');
        box.style.padding = '12px';

        let spoilersHTML = '';
        tableData.spoilers.forEach((spoiler, idx) => {
            spoilersHTML += `
                <div style="margin-bottom:12px;">
                    <div style="font-weight:bold;margin-bottom:4px;">${spoiler.title}</div>
                    <textarea class="spoiler_textarea" data-idx="${idx}" style="width:100%;height:80px;font-family:monospace;font-size:11px;">${spoiler.content}</textarea>
                    <button class="button_new copy_spoiler_btn" data-idx="${idx}" style="margin-top:4px;">Copiar spoiler</button>
                </div>
            `;
        });

        box.innerHTML = `
            <div style="margin-bottom:12px;font-weight:bold;">${tableData.disciplineName} - Tabla de niveles óptimos (1-200)</div>
            <div style="max-height:340px;overflow-y:auto;border:1px solid #333;padding:8px;background:rgba(0,0,0,0.3);">
                ${unitsHTML}
                ${spoilersHTML}
            </div>
            <div style="margin-top:10px;display:flex;gap:8px;justify-content:flex-end;">
                <button id="table_close" class="button_new">Cerrar</button>
            </div>
        `;

        content.appendChild(box);

        // Event listeners para copiar cada spoiler
        box.querySelectorAll('.copy_spoiler_btn').forEach(btn => {
            btn.onclick = () => {
                const idx = btn.getAttribute('data-idx');
                const textarea = box.querySelector(`textarea[data-idx="${idx}"]`);
                textarea.select();
                navigator.clipboard.writeText(textarea.value)
                    .then(() => uw.HumanMessage?.success?.('Spoiler copiado al portapapeles'))
                    .catch(() => uw.HumanMessage?.error?.('No se pudo copiar'));
            };
        });

        const copyUnitsBtn = box.querySelector('#copy_units_btn');
        if (copyUnitsBtn) {
            copyUnitsBtn.onclick = () => {
                const textarea = box.querySelector('#units_table_textarea');
                textarea.select();
                navigator.clipboard.writeText(textarea.value)
                    .then(() => uw.HumanMessage?.success?.('Tabla de unidades copiada'))
                    .catch(() => uw.HumanMessage?.error?.('No se pudo copiar'));
            };
        }

        box.querySelector('#table_close').onclick = () => dialog.remove();
    }

    function addExportButton() {
        const disciplineBox = qs('.go_info .discipline_box .content');
        if (!disciplineBox) return false;

        // Evitar duplicados
        if (qs('.go_export_table_btn', disciplineBox)) return true;

        const disciplineId = getDisciplineFromInfoDom();
        if (!disciplineId) return false;

        const btn = document.createElement('div');
        btn.className = 'go_export_table_btn';
        btn.title = 'Exportar tabla óptima a BBCode';
        btn.onclick = () => openTableExportWindow(disciplineId);

        disciplineBox.appendChild(btn);
        return true;
    }

    // -------------------- Render: Luck (Info tab) --------------------
    function renderLuck() {
        // Intenta renderizar suerte bajo current_best_score
        const infoRoot = qs('.go_info');
        if (!infoRoot) return false;

        const disciplineId = getDisciplineFromInfoDom();
        if (!disciplineId) return false;

        const recordEl = qs('.go_info .current_best_score .result');
        if (!recordEl) return false;

        const record = readFirstNumber(recordEl.textContent);
        if (record == null) return false;

        const discData = getDisciplinesData();
        const discObj = discData?.[disciplineId];
        const params = getParams(discObj);
        if (!params) return false;

        // Cargar datos guardados del último intento
        const savedData = loadAttemptSkills(disciplineId);

        // Priorizar expected guardado (del momento de la tirada)
        let expected = savedData?.expected || null;

        // Si no hay expected guardado, calcularlo con las skills actuales
        if (!expected || !Number.isFinite(expected)) {
            let skills = savedData?.skills || null;
            if (!skills) {
                const athlete = findAthleteByDiscipline(disciplineId);
                skills = getSkills(athlete);
            }
            if (!skills) return false;
            expected = expectedScore(params, skills[0], skills[1], skills[2]);
        }

        if (!Number.isFinite(expected) || expected <= 0) return false;

        const luckPct = (record / expected - 1) * 100;
        const cls = getLuckClass(luckPct);
        const txt = `${luckPct >= 0 ? '+' : ''}${luckPct.toFixed(2)}%`;
        const expectedStr = `${expected.toFixed(params.decimals)}${params.unit}`;

        // Put line inside current_best_score content
        const content = qs('.go_info .current_best_score .content');
        if (!content) return false;

        let line = qs('#go_luck_line', content);
        if (!line) {
            line = document.createElement('div');
            line.id = 'go_luck_line';
            line.className = 'cstm_go_luck_line';
            content.appendChild(line);
        }
        line.innerHTML = `<p>Esperado: <b>${expectedStr}</b></p><p>Suerte: <span class="${cls}">${txt}</span></p>`;

        // Agregar botón de exportación
        addExportButton();

        return true;
    }

    // -------------------- Render: Training guidance --------------------
    function clearTrainingMarks(root) {
        root.querySelectorAll('.button_new.square.plus').forEach(b => {
            b.classList.remove('go_plus_good', 'go_plus_bad');
        });

        const resetBtn = root.querySelector('.btn_skill_reset');
        if (resetBtn) resetBtn.classList.remove('go_reset_warn');

        const hint = root.querySelector('#go_training_hint');
        if (hint) hint.remove();
    }

    function renderTraining() {
        const root = qs('.go_athlete');
        if (!root) return false;

        // IMPORTANTE: Limpiar marcas anteriores primero, incluso si falla la renderización completa
        clearTrainingMarks(root);

        const disciplineId = getDisciplineFromTrainingDom();
        if (!disciplineId) return false;

        const availEl = root.querySelector('.table_skillpoints .header .skill_points');
        if (!availEl) return false;

        const available = readFirstNumber(availEl.textContent);
        if (available == null) return false;

        const rows = root.querySelectorAll('.table_skillpoints .row');
        if (!rows || rows.length < 3) return false;

        const box = root.querySelector('.middle_box.training');
        if (!box) return false;

        const skillBox = root.querySelector('.skill_points_box');
        if (!skillBox) return false;

        const current = [];
        const plusBtns = [];
        const names = [];

        for (let i = 0; i < 3; i++) {
            const row = rows[i];
            const sp = row.querySelector('.skill_points');
            const val = sp ? readFirstNumber(sp.textContent) : null;
            if (val == null) return false;
            current.push(val);

            plusBtns.push(row.querySelector('.button_new.square.plus'));
            names.push(row.querySelector('.title span')?.textContent?.trim() || `Skill ${i+1}`);
        }

        const currentSum = current[0] + current[1] + current[2];
        const totalLevel = currentSum + available;

        const discData = getDisciplinesData();
        const discObj = discData?.[disciplineId];
        const params = getParams(discObj);
        if (!params) return false;

        const target = bruteBestSplit(totalLevel, params);

        // Needs reset if any current > target (cannot decrease without reset)
        const needsReset = (current[0] > target.a) || (current[1] > target.b) || (current[2] > target.c);

        const tgtArr = [target.a, target.b, target.c];
        for (let i = 0; i < 3; i++) {
            const btn = plusBtns[i];
            if (!btn) continue;
            if (current[i] < tgtArr[i]) btn.classList.add('go_plus_good');
            else btn.classList.add('go_plus_bad');
        }

        const resetBtn = root.querySelector('.btn_skill_reset');
        if (resetBtn && needsReset) resetBtn.classList.add('go_reset_warn');

        // Calcular score esperado (suerte 0) con valores óptimos
        const expectedOptimal = expectedScore(params, target.a, target.b, target.c);
        const expectedStr = Number.isFinite(expectedOptimal)
            ? `${expectedOptimal.toFixed(params.decimals)}${params.unit}`
            : 'N/A';

        // Agregar caja de sugerencia con la clase solicitada
        const hint = document.createElement('div');
        hint.id = 'go_training_hint';
        hint.className = 'cstm_go_training_hint';

        const msg = needsReset
            ? `<span class="bad">Te has pasado</span> → necesitas <b>Restablecer</b> para cuadrar el óptimo.`
            : `<span class="ok">OK</span> → sube solo los + en verde hasta el objetivo.`;

        hint.innerHTML = `
            <div><b>Objetivo nivel ${totalLevel}</b>: ${names[0]} <b>${target.a}</b> / ${names[1]} <b>${target.b}</b> / ${names[2]} <b>${target.c}</b></div>
            <div style="margin-top:4px;">Actual: ${current[0]} / ${current[1]} / ${current[2]} (disponibles: ${available})</div>
            <div style="margin-top:4px;">Esperado (suerte 0): <b>${expectedStr}</b></div>
            <div style="margin-top:6px;">${msg}</div>
        `;

        const anchor = root.querySelector('.middle_box.training .content') || root.querySelector('.middle_box.training') || root;
        anchor.appendChild(hint);

        // Enganchar ordenamiento de tropas por eficiencia
        unitPlusButtonsBound = false;
        attachUnitPlusButtonHandlers();

        return true;
    }

    function requestRender(tab = 'all', tries = 0) {
        // Intenta renderizar; si aún no es posible, reintenta en 1ms (máx ~200ms)
        addStyleOnce();

        let okLuck = false;
        let okTrain = false;

        if (tab === 'info') {
            okLuck = !!renderLuck();
        } else if (tab === 'training') {
            okTrain = !!renderTraining();
        } else {
            okLuck = !!renderLuck();
            okTrain = !!renderTraining();
        }

        if (!okLuck && !okTrain && tries < 200) {
            setTimeout(() => requestRender(tab, tries + 1), 1);
        } else if (!okLuck && !okTrain && tries >= 200) {
            // Si fallaron todos los reintentos, desenganchar townswitch
            unhookTownSwitch();
        }
    }


    function renderOnLoad(tab) {
        let btn = document.querySelector('.button_new.square.plus');
        if (!btn || btn.classList.contains('go_plus_bad') || btn.classList.contains('go_plus_good')) {
            setTimeout(() => renderOnLoad(tab), 50);
        }else{
            requestRender(tab);
        }
    }
    // -------------------- Training: Auto-sort units by efficiency --------------------
    let unitPlusButtonsBound = false;

    function getTrainingData() {
        try {
            return uw.MM?.getModels?.().Grepolympia?.[uw.Game?.player_id]?.getTrainingData?.() || null;
        } catch {
            return null;
        }
    }

    function sortUnitsByEfficiency(itemsContainer) {
        if (!itemsContainer || !itemsContainer.children) return;

        const trainingData = getTrainingData();
        if (!trainingData) return;

        const items = Array.from(itemsContainer.children);
        const unitScores = [];

        // Calcular eficiencia (puntos por slot) de cada unidad disponible
        for (const item of items) {
            const option = item.children[0];
            if (!option) continue;

            const unitName = option.getAttribute('name');
            if (!unitName || !trainingData[unitName]) continue;

            const [pointsPerUnit, maxUnits] = trainingData[unitName];
            const efficiency = pointsPerUnit * maxUnits; // puntos totales por slot

            unitScores.push({ item, option, unitName, efficiency });
        }

        // Ordenar por eficiencia descendente
        unitScores.sort((a, b) => b.efficiency - a.efficiency);

        // Reordenar elementos en el DOM
        unitScores.forEach(({ item }) => {
            itemsContainer.appendChild(item);
        });

        // Seleccionar la mejor opción (primera tras ordenar)
        if (unitScores.length > 0) {
            // Quitar selected de todas
            unitScores.forEach(({ option }) => {
                option.classList.remove('selected');
            });
            // Marcar la mejor como selected
            unitScores[0].option.classList.add('selected');

            // Disparar click en la mejor opción para que el juego actualice el item_count_selector
            setTimeout(() => {
                unitScores[0].option.click();
            }, 10);
        }
    }

    function attachUnitPlusButtonHandlers() {
        if (unitPlusButtonsBound) return;

        const units = uw.document.querySelector('.units');
        if (!units) return;

        // Buscar los slots de entrenamiento (li con data-details)
        const slots = units.querySelectorAll('li[data-details]');
        if (!slots || slots.length === 0) return;

        for (const slot of slots) {
            // Buscar el dropdown dentro del slot
            const dropdown = slot.querySelector('.dropdown_units.train_unit');
            if (!dropdown) continue;

            const listId = dropdown.id + '_list';
            if (!listId) continue;

            // Enganchar el evento al slot completo (li[data-details])
            slot.addEventListener('click', function() {
                // Esperar a que se abra la lista
                setTimeout(() => {
                    const el = uw.document.getElementById(listId);
                    if (!el) return;

                    const itemsContainer = el.querySelector('.items');
                    if (!itemsContainer) return;

                    sortUnitsByEfficiency(itemsContainer);
                }, 50);
            });
        }

        unitPlusButtonsBound = true;
    }

    // -------------------- Save skills on doAttempt --------------------
    function hookAjaxForAttempt() {
        // your proven hook
        uw.$(uw.document).ajaxComplete(function (e, xhr, opt) {
            try {
                const parts = (opt.url || '').split('?');
                const filename = parts[0] || '';
                if (filename !== '/game/frontend_bridge') return;

                const qsPart = parts[1] || '';
                const seg = qsPart.split(/&/)[1] || '';
                const action = seg.substr(7);
                if (action !== 'execute') return;

                const dataObj = (function () {
                    try {
                        if (!opt.data) return null;
                        const decoded = decodeURIComponent(String(opt.data).replace(/^json=/, ''));
                        return JSON.parse(decoded);
                    } catch { return null; }
                })();

                if (dataObj) {
                    if (dataObj.action_name === 'startTraining' || dataObj.action_name === 'updateSkills') {
                        renderOnLoad('training')
                    }
                }
                if (!dataObj || dataObj.action_name !== 'doAttempt') return;

                const disciplineId = getDisciplineFromInfoDom() || getDisciplineFromTrainingDom();
                if (!disciplineId) return;

                const athlete = findAthleteByDiscipline(disciplineId);
                const skills = getSkills(athlete);
                if (!skills) return;

                // Calcular y guardar expected score junto con las skills
                const discData = getDisciplinesData();
                const discObj = discData?.[disciplineId];
                const params = getParams(discObj);
                if (params) {
                    const expected = expectedScore(params, skills[0], skills[1], skills[2]);
                    saveAttemptSkills(disciplineId, skills, expected);
                }

            } catch {}
        });
    }

    function hookAjaxForEventOpen() {
        uw.$(uw.document).ajaxComplete(function (e, xhr, opt) {
            try {
                const parts = (opt.url || '').split('?');
                const filename = parts[0] || '';
                const qsPart = parts[1] || '';

                if (filename !== '/game/event_tracking') return;
                const seg = qsPart.split(/&/)[1] || '';
                const action = seg.substr(7);
                if (action !== 'log_json_event') return;

                waitForEventAndAttachObserver(60);
                tabsBound = false;
                attachTabClickHandlers();
            } catch {}
        });
    }

    function attachTabClickHandlers() {
        if (tabsBound) return;
        const wnd = uw.document.querySelector('.classic_window.grepolympia');
        if (!wnd) return;
        const container = wnd.querySelector('.js-tabs_container.tabs_container');
        if (!container) return;

        container.addEventListener('click', (ev) => {
            const tab = ev.target?.closest?.('.tab');
            if (!tab) return;

            setTimeout(() => requestRender(tab.classList[tab.classList.length - 1]), 1);
        });

        tabsBound = true;
    }


    // -------------------- Event-open hook + local observer on the event window --------------------
    let goObserver = null;
    let goObsScheduled = false;

    function stopGoObserver() {
        if (goObserver) {
            try { goObserver.disconnect(); } catch {}
            goObserver = null;
        }
        goObsScheduled = false;
    }

    function startGoObserverOnEventRoot() {
        // Observamos SOLO la ventana del evento (no todo el document)
        const root = qs('.grepolympia') || qs('.window_grepolympia') || qs('.go_info')?.closest('.window2') || qs('.go_info')?.parentElement;
        if (!root) return false;

        stopGoObserver();

        goObserver = new MutationObserver(() => {
            if (goObsScheduled) return;
            goObsScheduled = true;
            setTimeout(() => {
                goObsScheduled = false;
                requestRender();
            }, 0);
        });

        goObserver.observe(root, { childList: true, subtree: true });

        hookTownSwitch();
        requestRender();
        return true;
    }

    function waitForEventAndAttachObserver(maxTries = 60) {
        let tries = 0;
        const tick = () => {
            tries++;
            if (startGoObserverOnEventRoot()) return;
            if (tries < maxTries) setTimeout(tick, 50);
        };
        tick();
    }

    // -------------------- Hook para cambio de ciudad --------------------
    function hookTownSwitch() {
        if (isTownSwitchHooked) return;

        try {
            townSwitchSubscription = uw.$.Observer(uw.GameEvents.town.town_switch).subscribe('GO_TOWN_SWITCH', () => {
                const wnd = uw.document.querySelector('.classic_window.grepolympia');
                if (!wnd) return;

                const container = wnd.querySelector('.js-tabs_container.tabs_container');
                if (!container) return;

                const tab = container.querySelector('.tab.selected');
                if (!tab || !tab.classList.length) {
                    setTimeout(() => requestRender(), 1);
                    return;
                }

                // Renderizar solo la tab activa
                setTimeout(() => requestRender(tab.classList[tab.classList.length - 1]), 1);
            });
            isTownSwitchHooked = true;
        } catch (err) {
            console.error('Error al enganchar town_switch:', err);
        }
    }

    function unhookTownSwitch() {
        if (!isTownSwitchHooked) return;

        try {
            if (townSwitchSubscription) {
                uw.$.Observer(uw.GameEvents.town.town_switch).unsubscribe(townSwitchSubscription);
                townSwitchSubscription = null;
            }
            isTownSwitchHooked = false;
        } catch (err) {
            console.error('Error al desenganchar town_switch:', err);
        }
    }

    function start() {
        addStyleOnce();
        hookAjaxForAttempt();
        hookAjaxForEventOpen();
    }
    start();


})();
