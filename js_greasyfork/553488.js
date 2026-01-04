// ==UserScript==
// @name         GrepoMassPublisher
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Publicar informes desde el actual hasta arriba
// @author       Tú
// @match        https://*.grepolis.com/game/*
// @icon         https://imgur.com/hSRMoxp.png
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/553488/GrepoMassPublisher.user.js
// @updateURL https://update.greasyfork.org/scripts/553488/GrepoMassPublisher.meta.js
// ==/UserScript==
(function(){
    'use strict';
    let uw = unsafeWindow ?? window;
    let csrf = uw.Game.csrfToken;
    let currentFilter = {};
    let observing = false;

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
    function chunkArray(arr, size){ let out=[]; for(let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size)); return out; }

    async function sendPost(subsets) {
        let allReports = [];

        for (let i = 0; i < subsets.length; i++) {
            const subset = subsets[i];
            console.debug(`📤 Publicando subset ${i + 1}/${subsets.length} (${subset.length} informes)`);

            try {
                // Usamos await para publicar de forma secuencial
                const html = await new Promise((resolve, reject) => {
                    uw.gpAjax.ajaxPost("report", "publish_report_many", { report_ids: subset }, true, (data) => {
                        let html = data?.json?.html || data.html || "";
                        resolve(html);
                    });
                });

                // Extraer los BBcodes del HTML
                let matches = [...html.matchAll(/\[report\][a-f0-9]+\[\/report\]/gi)];
                matches.forEach(m => allReports.push(m[0]));

                // Delay entre peticiones (300–600 ms)
                if (i < subsets.length - 1) {
                    await sleep(300 + Math.random() * 300);
                }
            } catch (err) {
                console.warn(`⚠️ Error al publicar subset ${i + 1}:`, err);
            }
        }

        openReportsWindow(allReports.join("\n"), allReports.length);
    }

    function openReportsWindow(bbcodeText,totalReports){
        let existing = Array.from(document.querySelectorAll('.ui-dialog-title'))
        .some(t=>t.textContent.trim()==='Informes publicados');
        if(existing) return;

        let wnd = uw.Layout.wnd.Create(uw.Layout.wnd.TYPE_DIALOG,"Informes publicados",{width:"520",height:"360"});
        let dialog;
        Array.from(document.querySelectorAll('.ui-dialog-title')).forEach(t=>{
            if(t.textContent.trim()==='Informes publicados') dialog=t.closest('.ui-dialog');
        });
        if(!dialog) return;
        let content=dialog.querySelector('.gpwindow_content')||dialog;
        let box=document.createElement('div'); box.style.padding='12px';
        box.innerHTML=`
    <div style="margin-bottom:8px;font-weight:bold;">${totalReports} informes publicados correctamente.</div>
    <textarea id="reports_bbcode_output" style="width:100%;height:220px;font-family:monospace;margin-top:8px;">${bbcodeText}</textarea>
    <div style="margin-top:10px;display:flex;gap:8px;justify-content:flex-end;">
      <button id="reports_copy" class="button_new">Copiar todo</button>
      <button id="reports_close" class="button_new">Cerrar</button>
    </div>`;
        content.appendChild(box);
        box.querySelector('#reports_copy').onclick=()=>{
            let t=box.querySelector('#reports_bbcode_output');
            t.select(); navigator.clipboard.writeText(t.value)
                .then(()=>uw.HumanMessage.success('Copiado al portapapeles'))
                .catch(()=>uw.HumanMessage.error('No se pudo copiar'));
        };
        box.querySelector('#reports_close').onclick=()=>dialog.remove();
    }

    async function fetchReportsUntil(firstId, currentFilter) {
        let limit = 25;
        let townId = uw.ITowns.getCurrentTown().id;

        // 1️⃣ Obtener el total de informes
        let total = (() => {
            let m = document.body.innerHTML.match(/Total:\s*([0-9]+)/);
            if (m) return parseInt(m[1], 10);
            let lastPageEl = document.querySelector('.es_last_page');
            let pages = lastPageEl ? parseInt(lastPageEl.textContent.trim(), 10) || 1 : 1;
            return pages * limit;
        })();

        let pages = 9999;
        console.debug(`📄 Recorriendo páginas 1 → ${pages} (total=${total})`);

        let found = false;
        let idsSet = new Set();

        // ⚙️ Helper: Promisificar gpAjax.ajaxPost
        function ajaxGetPage(start) {
            return new Promise((resolve, reject) => {
                let payload = {
                    elem_id: "report_list",
                    controller: "report",
                    action: "index",
                    limit: limit,
                    first_element: 0,
                    last_element: Math.max(0, total),
                    ttl: 1800,
                    es_args: {
                        folder_id: currentFilter.folder_id ?? 0,
                        filter_type: currentFilter.filter_type ?? "all",
                        subject_filter: currentFilter.subject_filter ?? ""
                    },
                    es_pagination_id: "es_page_reports",
                    insert_elem_id: "report_list",
                    rowspan: false,
                    start_element: start,
                    town_id: townId
                };

                gpAjax.ajaxGet('report', 'index', payload, true, (data) => {
                    try {
                        // 🧠 El servidor responde con json.view (modo AJAX)
                        let html = data?.html || "";

                        if (!html) {
                            console.warn('⚠️ Página vacía o sin json.view');
                            return resolve([]);
                        }
                        // Extraer todos los IDs visibles
                        let ids = Array.from(html.matchAll(/data-reportid="(\d+)"/g)).map(m => parseInt(m[1], 10));
                        resolve({ html, ids });
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        }

        // 2️⃣ Recorrer todas las páginas
        for (let page = 0; page < pages && !found; page++) {
            let start = page * limit;
            console.debug(`⬇️ Cargando página ${page + 1}/${pages} (start=${start})`);

            try {
                let { html, ids } = await ajaxGetPage(start);

                // Si el servidor no devolvió nada, corto
                if (!ids?.length) {
                    console.warn('⚠️ Sin IDs en la página ${page + 1}');
                    continue;
                }

                // Intentar extraer el array de reportes (si aparece inline)
                let match = html.match(/var report_list\s*=\s*(\[[\s\S]*?\]);/);
                let reports = [];
                if (match) {
                    try { reports = JSON.parse(match[1]); } catch (e) {}
                } else {
                    // Si no está el array JS, usamos solo los IDs
                    reports = ids.map(id => ({ id }));
                }

                // ——— Filtros manuales ———
                if (currentFilter.filter_type && currentFilter.filter_type !== "all") {
                    reports = reports.filter(r => {
                        switch (currentFilter.filter_type) {
                            case "attacks":
                                // Solo ataques directos, excluye apoyos
                                return r.type === "fight";
                            case "support":
                                // Incluye informes relacionados con apoyo o defensa
                                return ["fight_supporter", "fight_defender", "support"].includes(r.type);
                            case "espionage":
                                return r.type === "espionage";
                            default:
                                return true;
                        }
                    });
                }

                if (currentFilter.subject_filter && String(currentFilter.subject_filter).trim() !== "") {
                    let q = String(currentFilter.subject_filter).toLowerCase();
                    reports = reports.filter(r => r.subject?.toLowerCase().includes(q));
                }
                // ————————————————————

                for (let r of reports) {
                    idsSet.add(r.id);
                    if (String(r.id) === String(firstId)) {
                        found = true;
                        break;
                    }
                }

                // Espera entre peticiones para evitar 429
                if (!found) await sleep(150 + Math.random() * 100); // entre 350–550ms

            } catch (e) {
                console.warn("⚠️ Error obteniendo página", page + 1, e);
                break;
            }
        }

        let result = Array.from(idsSet);
        console.debug(`✅ Recopilados ${result.length} informes hasta ${firstId}`);
        return result;
    }

    function getCurrentFiltersFromDOM() {
        // Normaliza texto (minúsculas + sin acentos)
        const norm = s => (s || "")
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

        // Mapeo visible → clave interna
        const TYPE_MAP = {
            "todo": "all",
            "all": "all",
            "ataques": "attacks",
            "refuerzos": "support",
            "espionaje": "espionage",
            "poderes divinos": "divine_powers",
            "alianza": "alliance",
            "reservas": "reservations",
            "maravillas del mundo": "world_wonders",
            "otros": "misc"
        };

        // Captura el texto que muestra el dropdown
        const captionEl = document.querySelector('#dd_filter_type .caption') || document.querySelector('#dd_filter_type');
        const captionText = captionEl ? captionEl.textContent : "";
        const filter_type = TYPE_MAP[norm(captionText)] || "all";

        // Filtro de texto
        const subject_filter = (document.querySelector('#subject_filter')?.value || "").trim();

        // Carpeta actual (si no hay control visible, usa 0)
        const activeFolder = document.querySelector('#folder_toggle_menu .option.selected');
        const folder_id = activeFolder ? parseInt(activeFolder.dataset.folderId || "0", 10) : 0;

        return { filter_type, subject_filter, folder_id };
    }

    function injectButtons() {
        document.querySelectorAll('#report_list input[name="report_ids[]"]').forEach(cb => {
            if (cb.dataset.hasPbtn) return;

            let btn = document.createElement('a');
            btn.href = '#';
            btn.className = 'button';
            btn.style.color = '#3b5'; // 🟢 texto verde
            btn.style.fontWeight = 'bold';
            btn.style.marginLeft = '4px';
            btn.style.position = 'relative';
            btn.style.top = '-2px'; // ⬆️ sube un poco el botón

            btn.innerHTML = `
            <span class="left"><span class="right">
                <span class="middle" style="
                    width:20px !important;
                    min-width:20px !important;
                    max-width:20px !important;
                    display:inline-block !important;
                    text-align:center !important;
                    overflow:hidden;
                ">P↑</span>
            </span></span>
        `;

            btn.onclick = async (e) => {
                e.preventDefault();
                const filters = getCurrentFiltersFromDOM();
                console.debug('P↑ pulsado en', cb.value);

                // feedback inicial
                uw.HumanMessage.success('📡 Recopilando informes...');

                try {
                    // ✅ ahora fetchReportsUntil devuelve TODOS los IDs (incluso los no cargados)
                    let allIds = await fetchReportsUntil(cb.value, filters);

                    if (!allIds?.length) {
                        uw.HumanMessage.error('No se pudieron obtener los informes.');
                        return;
                    }

                    // mantener el orden natural (de arriba a abajo)
                    uw.HumanMessage.success(`Total ${allIds.length} informes a publicar`);

                    // dividir en lotes de 20 e iniciar publicación
                    let subsets = chunkArray(allIds, 20);
                    sendPost(subsets);

                } catch (err) {
                    console.error('Error al recopilar informes:', err);
                    uw.HumanMessage.error('Error al recopilar informes.');
                }
            };

            cb.after(btn);
            cb.dataset.hasPbtn = true;
        });
    }

    uw.$(uw.document).ajaxComplete(function (e, xhr, opt) {
        const parts = (opt.url || '').split('?');
        const filename = parts[0] || '';
        const qs = parts[1] || '';
        if (filename !== '/game/report') return;

        const seg = qs.split(/&/)[1] || '';
        const action = seg.substr(7);
        if (action == 'index'){

            try {
                const params = new URL(opt.url, location.origin);
                const jsonStr = decodeURIComponent(params.searchParams.get('json') || '{}');
                const parsed = JSON.parse(jsonStr);

            } catch (err) {
                console.warn('⚠️ Error al parsear filtros', err);
            }

            // reinyectar botones después de cada carga
            setTimeout(injectButtons, 50);
        }else if (action == 'publish_report_many_dialog'){
            const params = new URLSearchParams(opt.url.split('?')[1]);
            const jsonString = decodeURIComponent(params.get('json'));
            const reportIds = JSON.parse(jsonString).report_ids;
            if (reportIds.length > 20){
                const subsets = chunkArray(reportIds, 20);
                sendPost(subsets);
            }
        }
    });
})();