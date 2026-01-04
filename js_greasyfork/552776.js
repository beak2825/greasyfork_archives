// ==UserScript==
// @name         AF-Scrapper
// @namespace    https://af-scrapper.local
// @version      1.1.1
// @description  Busca UNA O VARIAS actrices desde la portada, detecta retícula, recorre escenas y captura “Actriz YYYY-MM-DD”, con href opcional. Sin duplicados. Bitácora persistente. UI con pill. No limpia nada automáticamente.
// @match        https://www.cuckoldsessions.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @icon         https://cdn4.iconfinder.com/data/icons/data-20/512/N_T_1216Artboard_1_copy_14-256.png
// @noframes
// @license      PolyForm Personal Use License 1.0.0; https://polyformproject.org/licenses/personal-use/1.0.0/
//
// @downloadURL https://update.greasyfork.org/scripts/552776/AF-Scrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/552776/AF-Scrapper.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ============================
  // Selectores del sitio
  // ============================
  const SELECTORES = {
    input_busqueda:
      'input[name="search-input"], input.Input.SearchInput-Input[type="text"], input[placeholder*="Search"][type="text"]',
    boton_ver_todo: 'a.AutoComplete-HitSection-ViewAll-Link[href*="/videos/query/"]',
    contenedores_grid:
      '.SearchListing-ListingGrid, [class*="SearchListing-ListingGrid"], .AutoComplete-Scenes, .ListingGrid, [class*="ListingGrid"]',
    item_escena:
      '.ListingGrid-ListingGridItem, [class*="ListingGrid-ListingGridItem"], .SceneThumb-Default, [class*="SceneThumb"]',
    link_escena: 'a[href^="/en/video/"], a[href^="/es/video/"]',
    fecha_detalle_1: '.SceneDetail-DatePublished-Text',
    fecha_detalle_2: '.ScenePlayerHeaderDesktop-Date-Text, .ScenePlayerHeaderDesktop-Date',
  };

  // ============================
  // Claves de almacenamiento
  // ============================
  const GMK = {
    actrices_raw: 'AF1_actriz',           // string: texto tal cual del campo (una o varias)
    incluir_href: 'AF1_incluir_href',     // boolean
    resultados: 'AF1_resultados',         // array<string>
    bitacora: 'AF1_bitacora',             // string
  };
  const SSK = {
    activo: 'AF1_activo',                 // bool
    home: 'AF1_home',                     // string
    // por actriz
    lista_actrices: 'AF1_lista_actrices', // string[]
    idx_actriz: 'AF1_idx_actriz',         // number
    // por escenas de la actriz actual
    cola: 'AF1_cola',                     // string[]
    idx_cola: 'AF1_idx',
    bloqueo_detalle: 'AF1_bloqueo_detalle',
    procesados: 'AF1_proc_map',           // {href:true}
  };

  // ============================
  // Utilidades generales
  // ============================
  const $  = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const dormir = ms => new Promise(r=>setTimeout(r,ms));
  const ahora = () => `[${new Date().toTimeString().slice(0,8)}]`;

  const leerGM  = (k, dflt) => {
    const v = GM_getValue(k, null);
    if (v === null || v === undefined) return dflt;
    try { return typeof dflt === 'string' ? String(v) : JSON.parse(v); } catch { return v; }
  };
  const escribirGM = (k, v) => {
    if (typeof v === 'string') GM_setValue(k, v);
    else GM_setValue(k, JSON.stringify(v));
  };

  const leerSS  = (k, d=null) => {
    const s = sessionStorage.getItem(k);
    return s == null ? d : JSON.parse(s);
  };
  const escribirSS = (k, v) => sessionStorage.setItem(k, JSON.stringify(v));
  const borrarSS   = (k) => sessionStorage.removeItem(k);

  const es_home     = () => location.pathname === '/';
  const en_detalle  = () => /\/(en|es)\/video\//.test(location.pathname);
  const en_listado  = () => /\/(en|es)\/videos\/query\//.test(location.pathname);
  const to_query_url = nombre => {
    const t = nombre.trim().replace(/\s+/g,'_');
    const pref = document.querySelector('a[href^="/en/videos/query/"]') ? '/en' :
                 document.querySelector('a[href^="/es/videos/query/"]') ? '/es' : '/en';
    return `${pref}/videos/query/${encodeURIComponent(t)}`;
  };

  const meses = {january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12,
                 enero:1,febrero:2,marzo:3,abril:4,mayo:5,junio:6,julio:7,agosto:8,septiembre:9,setiembre:9,octubre:10,noviembre:11,diciembre:12};
  const pad2 = v => String(v).padStart(2,'0');

  function fecha_iso_desde_nodo(n){
    if(!n) return '';
    const raw = (n.textContent || n.getAttribute?.('title') || n.getAttribute?.('datetime') || '').trim().replace(/\s+/g,' ');
    let m = raw.match(/\b(\d{4})-(\d{2})-(\d{2})\b/); if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    m = raw.match(/\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})\b/); if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;
    m = raw.match(/\b([A-Za-zÁÉÍÓÚáéíóú]+)\s+(\d{1,2}),\s*(\d{4})\b/); if (m){ const mm=meses[m[1].toLowerCase()]; if(mm) return `${m[3]}-${pad2(mm)}-${pad2(m[2])}`; }
    m = raw.match(/\b(\d{1,2})\s+de\s+([A-Za-zÁÉÍÓÚáéíóú]+)\s+de\s+(\d{4})\b/i); if (m){ const mm=meses[m[2].toLowerCase()]; if(mm) return `${m[3]}-${pad2(mm)}-${pad2(m[1])}`; }
    return '';
  }

  function esperar_selector(sel, t=8000){
    return new Promise((res,rej)=>{
      const e0 = $(sel); if (e0) return res(e0);
      const mo = new MutationObserver(()=>{
        const e = $(sel); if (e){ mo.disconnect(); res(e); }
      });
      mo.observe(document.documentElement, {childList:true, subtree:true});
      setTimeout(()=>{ mo.disconnect(); rej(new Error('timeout '+sel)); }, t);
    });
  }
  async function esperar_fecha_detalle(t=12000){
    const n0 = $(SELECTORES.fecha_detalle_1) || $(SELECTORES.fecha_detalle_2);
    if (n0) return n0;
    return await esperar_selector(`${SELECTORES.fecha_detalle_1}, ${SELECTORES.fecha_detalle_2}`, t);
  }

  async function escribir_en_busqueda(valor){
    try{
      const el = await esperar_selector(SELECTORES.input_busqueda, 8000);
      el.focus();
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
      set.call(el, valor);
      el.dispatchEvent(new Event('input',{bubbles:true, composed:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
      const ev={key:'Enter',code:'Enter',keyCode:13,which:13,bubbles:true};
      el.dispatchEvent(new KeyboardEvent('keydown', ev));
      el.dispatchEvent(new KeyboardEvent('keyup', ev));
      return true;
    } catch { return false; }
  }

  function recolectar_cola(nombre){
    const rx = nombre ? new RegExp(nombre.replace(/\s+/g,'[ _-]'),'i') : null;
    const uniq = new Map();

    const roots = $$(SELECTORES.contenedores_grid);
    for (const root of roots){
      const grid = root.querySelector('[style*="grid-template-columns"]') || root;
      const tarjetas = $$(SELECTORES.item_escena, grid);
      const links = tarjetas.map(t=>t.querySelector(SELECTORES.link_escena)).filter(Boolean);
      for (const a of links){
        const href = a.getAttribute('href') || '';
        const id = (href.match(/\/(\d{5,})$/)||[,''])[1] || href;

        if (rx){
          const card = a.closest(SELECTORES.item_escena) || root;
          const blob = [
            card?.querySelector('.SceneThumb-SceneInfo-Actor-Link')?.textContent || '',
            card?.querySelector('h2, h3')?.textContent || '',
            a.getAttribute('title') || a.textContent || '',
            card?.querySelector('img[alt], img[title]')?.getAttribute('alt') || '',
            decodeURIComponent(href)
          ].join(' | ');
          if (!rx.test(blob)) continue;
        }
        if (!uniq.has(id)) uniq.set(id, location.origin + href);
      }
    }
    return Array.from(uniq.values());
  }

  async function esperar_reticula(nombre, ms=3000){
    const t0 = Date.now();
    while ((Date.now()-t0) < ms){
      const cola = recolectar_cola(nombre);
      if (cola.length) return cola;
      await dormir(250);
    }
    return [];
  }

  // ============================
  // UI
  // ============================
  GM_addStyle(`
    #af1_pill{position:fixed;right:12px;bottom:12px;z-index:999999;display:flex;align-items:center;gap:8px;
      background:#0d1117;color:#c9d1d9;border:1px solid #30363d;border-radius:999px;padding:8px 12px;box-shadow:0 8px 24px rgba(0,0,0,.25);cursor:pointer}
    #af1_pill .dot{width:8px;height:8px;background:#238636;border-radius:999px}
    #af1_panel{position:fixed;right:12px;bottom:12px;z-index:999999;width:560px;background:#0d1117;color:#c9d1d9;border:1px solid #30363d;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.25)}
    #af1_panel header{padding:8px 10px;border-bottom:1px solid #30363d;display:flex;gap:8px;align-items:center;justify-content:space-between}
    #af1_panel .titulo{font-weight:600}
    #af1_panel .cuerpo{padding:12px;display:grid;gap:12px}
    .af1_texto,.af1_box{background:#161b22;color:#c9d1d9;border:1px solid #30363d;border-radius:8px;padding:10px;resize:vertical;width:100%}
    .af1_box{height:160px}
    .af1_fila{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
    .af1_btn{background:#238636;color:#fff;border:0;border-radius:8px;padding:8px 12px;cursor:pointer}
    .af1_btn.sec{background:#30363d}
    #af1_estado{font-size:12px;color:#8b949e;text-align:center;padding:6px 0 10px}
  `);

  const ui = (() => {
    const pill = document.createElement('div');
    pill.id = 'af1_pill';
    pill.innerHTML = `<span class="dot"></span><strong>AF</strong>`;
    document.body.appendChild(pill);

    const panel = document.createElement('section');
    panel.id = 'af1_panel';
    panel.style.display = 'none';
    panel.innerHTML = `
      <header>
        <span class="titulo">AF-Scrapper · 1 actriz</span>
        <div class="af1_fila">
          <button id="af1_min" class="af1_btn sec" title="Minimizar">Min</button>
          <button id="af1_close" class="af1_btn sec" title="Cerrar">✕</button>
        </div>
      </header>
      <div class="cuerpo">
        <div>
          <label>Actrices (una por línea o separadas por coma)</label>
          <textarea id="af1_actriz" class="af1_texto" placeholder="Ej: Chanel Preston&#10;Lexi Lore&#10;Amirah Adara"></textarea>
        </div>
        <label style="display:flex;gap:8px;align-items:center">
          <input id="af1_chk_href" type="checkbox"> Incluir href en cada línea
        </label>
        <div class="af1_fila">
          <button id="af1_iniciar"  class="af1_btn">Iniciar</button>
          <button id="af1_detener"  class="af1_btn sec">Detener</button>
          <button id="af1_copiar"   class="af1_btn sec">Copiar</button>
          <button id="af1_exportar" class="af1_btn sec">Exportar</button>
          <button id="af1_limpiar"  class="af1_btn sec">Limpiar</button>
        </div>
        <div>
          <label>Resultados</label>
          <textarea id="af1_result" class="af1_box" placeholder="Actriz YYYY-MM-DD [href si marcado]"></textarea>
        </div>
        <div>
          <label>Bitácora</label>
          <textarea id="af1_log" class="af1_box" placeholder=""></textarea>
        </div>
        <div id="af1_estado">Estado: inactivo</div>
      </div>`;
    document.body.appendChild(panel);

    // inicia minimizado
    pill.style.display = 'flex';
    panel.style.display = 'none';

    pill.onclick = () => { pill.style.display='none'; panel.style.display='block'; };
    panel.querySelector('#af1_min').onclick   = () => { panel.style.display='none'; pill.style.display='flex'; };
    panel.querySelector('#af1_close').onclick = () => { panel.style.display='none'; pill.style.display='flex'; };

    // hidratar
    panel.querySelector('#af1_actriz').value = leerGM(GMK.actrices_raw, '');
    panel.querySelector('#af1_chk_href').checked = !!leerGM(GMK.incluir_href, false);
    const arr = leerGM(GMK.resultados, []);
    if (Array.isArray(arr) && arr.length) panel.querySelector('#af1_result').value = arr.join('\n');
    const bit = leerGM(GMK.bitacora, '');
    if (bit) panel.querySelector('#af1_log').value = bit;

    return {
      pill, panel,
      actricesRaw: ()=>panel.querySelector('#af1_actriz'),
      chkHref: ()=>panel.querySelector('#af1_chk_href'),
      btnIniciar: ()=>panel.querySelector('#af1_iniciar'),
      btnDetener: ()=>panel.querySelector('#af1_detener'),
      btnCopiar: ()=>panel.querySelector('#af1_copiar'),
      btnExportar: ()=>panel.querySelector('#af1_exportar'),
      btnLimpiar: ()=>panel.querySelector('#af1_limpiar'),
      resultados: ()=>panel.querySelector('#af1_result'),
      log: ()=>panel.querySelector('#af1_log'),
      estado: ()=>panel.querySelector('#af1_estado'),
    };
  })();

  const set_estado = t => ui.estado().textContent = `Estado: ${t}`;
  const log_linea = t => {
    const s = `${ahora()} ${t}\n`;
    ui.log().value += s;
    escribirGM(GMK.bitacora, ui.log().value);
    ui.log().scrollTop = ui.log().scrollHeight;
  };
  const render_resultados = () => {
    const arr = leerGM(GMK.resultados, []);
    ui.resultados().value = arr.join('\n');
  };

  ui.actricesRaw().addEventListener('input', () => escribirGM(GMK.actrices_raw, ui.actricesRaw().value));
  ui.chkHref().addEventListener('change', () => escribirGM(GMK.incluir_href, !!ui.chkHref().checked));

  ui.btnCopiar().onclick = async () => {
    const dedupe = Array.from(new Set((ui.resultados().value||'').split('\n').filter(Boolean)));
    try{ await navigator.clipboard.writeText(dedupe.join('\n')); log_linea('copiado'); }
    catch{ log_linea('no copiado'); }
  };

  ui.btnExportar().onclick = () => {
    const dedupe = Array.from(new Set((ui.resultados().value||'').split('\n').filter(Boolean)));
    if (!dedupe.length){ log_linea('exportar: sin datos'); return; }
    const nombre = `af-scrapper_${new Date().toISOString().replace(/[:T]/g,'-').slice(0,19)}.txt`;
    const blob = new Blob([dedupe.join('\n')+'\n'], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
    log_linea(`exportado: ${nombre}`);
  };

  ui.btnLimpiar().onclick = () => {
    ui.resultados().value = '';
    ui.log().value = '';
    ui.actricesRaw().value = '';
    escribirGM(GMK.resultados, []);
    escribirGM(GMK.bitacora, '');
    escribirGM(GMK.actrices_raw, '');
    set_estado('limpio');
  };

  ui.btnIniciar().onclick = () => iniciar_flujo();
  ui.btnDetener().onclick = () => detener_flujo();

  // ============================
  // Flujo principal (múltiples actrices)
  // ============================
  function normalizar_lista_actrices(texto){
    return Array.from(
      new Set(
        (texto||'')
          .split(/[\n,;]+/g)
          .map(s=>s.trim())
          .filter(Boolean)
      )
    );
  }

  async function iniciar_flujo(){
    const lista = normalizar_lista_actrices(ui.actricesRaw().value);
    if (!lista.length){ alert('Escribe al menos una actriz.'); return; }

    escribirGM(GMK.actrices_raw, ui.actricesRaw().value);
    set_estado('activo');
    escribirSS(SSK.activo, true);
    escribirSS(SSK.home, location.origin + '/');
    escribirSS(SSK.lista_actrices, lista);
    escribirSS(SSK.idx_actriz, 0);
    escribirSS(SSK.procesados, {}); // limpiar mapa de la tanda

    const nombre = lista[0];
    log_linea(`inicio lista (${lista.length}) · actriz[1]: ${nombre}`);

    if (!es_home()){
      log_linea('navegar a home');
      location.assign(location.origin + '/');
      return;
    }
    await paso_home(nombre);
  }

  function detener_flujo(){
    borrarSS(SSK.activo);
    borrarSS(SSK.home);
    borrarSS(SSK.lista_actrices);
    borrarSS(SSK.idx_actriz);
    borrarSS(SSK.cola);
    borrarSS(SSK.idx_cola);
    borrarSS(SSK.bloqueo_detalle);
    borrarSS(SSK.procesados);
    set_estado('detenido');
    log_linea('detenido por usuario');
  }

  // Reenganche
  (function reanudar_si_activo(){
    if (!leerSS(SSK.activo)) return;

    render_resultados();

    const lista = leerSS(SSK.lista_actrices) || normalizar_lista_actrices(leerGM(GMK.actrices_raw,''));
    let idxA = leerSS(SSK.idx_actriz) ?? 0;
    if (!lista.length){ set_estado('sin actriz'); return; }
    if (idxA >= lista.length){ finalizar_tanda(); return; }

    const nombre = lista[idxA];

    if (en_detalle()){ paso_detalle(nombre); return; }

    const cola = leerSS(SSK.cola);
    const ix = leerSS(SSK.idx_cola);
    if (cola && Number.isInteger(ix)){
      if (ix < cola.length){
        set_estado(`reanudar escena ${ix+1}/${cola.length} · ${nombre}`);
        log_linea(`reanudar: ${nombre} · ${ix+1}/${cola.length}`);
        location.assign(cola[ix]);
        return;
      }
      finalizar_actriz(false); // terminó escenas
      return;
    }

    if (en_listado()){ paso_listado(nombre); return; }
    if (es_home()){ paso_home(nombre); return; }

    const home = leerSS(SSK.home) || (location.origin + '/');
    log_linea('redirigir a home');
    location.assign(home);
  })();

  async function paso_home(nombre){
    set_estado(`escribiendo en búsqueda · ${nombre}`);
    const ok = await escribir_en_busqueda(nombre);
    if (!ok){ log_linea(`sin input o fallo al escribir · ${nombre}`); finalizar_actriz(true); return; }

    log_linea('búsqueda enviada');
    await dormir(600);

    // Intentar retícula en home
    let cola = await esperar_reticula(nombre, 2500);
    if (cola.length){
      log_linea(`escenas detectadas (home): ${cola.length} · ${nombre}`);
      escribirSS(SSK.cola, cola);
      escribirSS(SSK.idx_cola, 0);
      set_estado(`abriendo escena 1/${cola.length} · ${nombre}`);
      location.assign(cola[0]);
      return;
    }

    // Intentar "View All"
    const verTodo = $(SELECTORES.boton_ver_todo);
    if (verTodo){
      verTodo.click();
      log_linea('clic en “View All”');
      return;
    }

    // Abrir listado directo
    const url = to_query_url(nombre);
    log_linea('abrir listado directo: ' + url);
    location.assign(url);
  }

  async function paso_listado(nombre){
    const cola = await esperar_reticula(nombre, 3500);
    if (!cola.length){
      log_linea(`sin resultados para “${nombre}”`);
      finalizar_actriz(true);
      return;
    }
    log_linea(`escenas detectadas (listado): ${cola.length} · ${nombre}`);
    escribirSS(SSK.cola, cola);
    escribirSS(SSK.idx_cola, 0);
    set_estado(`abriendo escena 1/${cola.length} · ${nombre}`);
    location.assign(cola[0]);
  }

  async function paso_detalle(nombre){
    if (leerSS(SSK.bloqueo_detalle)) return;
    escribirSS(SSK.bloqueo_detalle, true);

    const cola = leerSS(SSK.cola) || [];
    let i = leerSS(SSK.idx_cola) || 0;
    const total = cola.length;
    const href_actual = cola[i] || (location.origin + location.pathname);

    // anti-duplicados por href
    const map = leerSS(SSK.procesados) || {};
    if (map[href_actual]){
      log_linea('ya procesado, salto: ' + href_actual);
      avanzar(i, total, cola, nombre);
      return;
    }

    set_estado(`detalle: esperando fecha [${i+1}/${total}] · ${nombre}`);
    log_linea('detalle: esperando fecha');

    let fechaISO = '';
    try{
      const nodo = await esperar_fecha_detalle(12000);
      fechaISO = fecha_iso_desde_nodo(nodo);
    }catch(e){
      log_linea('fecha no encontrada: ' + e.message);
    }

    if (!/\d{4}-\d{2}-\d{2}/.test(fechaISO)){
      log_linea('fecha inválida, salto');
      map[href_actual] = true;
      escribirSS(SSK.procesados, map);
      avanzar(i, total, cola, nombre);
      return;
    }

    const incluirHref = !!leerGM(GMK.incluir_href, false);
    const linea = incluirHref ? `${nombre} ${fechaISO} ${href_actual}` : `${nombre} ${fechaISO}`;

    const arr = leerGM(GMK.resultados, []);
    if (!arr.includes(linea)){
      arr.push(linea);
      escribirGM(GMK.resultados, arr);
      render_resultados();
    }
    map[href_actual] = true;
    escribirSS(SSK.procesados, map);

    log_linea(`capturado => ${linea}`);
    avanzar(i, total, cola, nombre);
  }

  function avanzar(i, total, cola, nombre){
    const next = i + 1;
    escribirSS(SSK.idx_cola, next);
    borrarSS(SSK.bloqueo_detalle);

    if (next < total){
      set_estado(`navegando a escena ${next+1}/${total} · ${nombre}`);
      location.assign(cola[next]);
    } else {
      finalizar_actriz(false);
    }
  }

  function finalizar_actriz(omitida=false){
    // limpiar por-escenas
    borrarSS(SSK.cola);
    borrarSS(SSK.idx_cola);
    borrarSS(SSK.bloqueo_detalle);
    borrarSS(SSK.procesados);

    const lista = leerSS(SSK.lista_actrices) || [];
    let idxA = leerSS(SSK.idx_actriz) || 0;

    const nombre = lista[idxA] || '(desconocida)';
    log_linea('finalizado' + (omitida ? ' (omitida) ' : ' ') + `· ${nombre}`);

    idxA += 1;
    escribirSS(SSK.idx_actriz, idxA);

    if (idxA < lista.length){
      const siguiente = lista[idxA];
      set_estado(`siguiente actriz: ${siguiente}`);
      // siempre arrancar siguiente desde home
      const home = leerSS(SSK.home) || (location.origin + '/');
      location.assign(home);
    } else {
      finalizar_tanda();
    }
  }

  function finalizar_tanda(){
    borrarSS(SSK.activo);
    borrarSS(SSK.home);
    borrarSS(SSK.lista_actrices);
    borrarSS(SSK.idx_actriz);
    set_estado('finalizado');
    log_linea('tanda finalizada');
    // No se limpian recuadros automáticamente.
  }
})();
