// ==UserScript==
// @name         Bomb Party Suggester - Español
// @namespace    http://tampermonkey.net/
// @version      0.2.1-es
// @description  Sugeridor de palabras en ESPAÑOL para Bomb Party (JKLM.fun). UI en español y diccionario español (remoto + fallback robusto). Auto-mode incluido.
// @author       Yeferson Andres & Ario Ost
// @match        *.jklm.fun/games/bombparty*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555378/Bomb%20Party%20Suggester%20-%20Espa%C3%B1ol.user.js
// @updateURL https://update.greasyfork.org/scripts/555378/Bomb%20Party%20Suggester%20-%20Espa%C3%B1ol.meta.js
// ==/UserScript==

(() => {
  // Espacio global
  window.BPS = window.BPS || {};

  /* ---------------------------
     src/core/typer.js
     Simula tecleo "humano" y envía el submit.
     --------------------------- */
  (function() {
    const KEYBOARD_LAYOUT = {
      layout: {
        q:[0,0], w:[0,1], e:[0,2], r:[0,3], t:[0,4], y:[0,5], u:[0,6], i:[0,7], o:[0,8], p:[0,9],
        a:[1,0], s:[1,1], d:[1,2], f:[1,3], g:[1,4], h:[1,5], j:[1,6], k:[1,7], l:[1,8],
        z:[2,0], x:[2,1], c:[2,2], v:[2,3], b:[2,4], n:[2,5], m:[2,6]
      },
      adjacent: {}
    };
    Object.entries(KEYBOARD_LAYOUT.layout).forEach(([key,[row,col]])=>{
      KEYBOARD_LAYOUT.adjacent[key] = Object.entries(KEYBOARD_LAYOUT.layout)
        .filter(([k,[r,c]])=>{
          if(k===key) return false;
          const rowDiff = Math.abs(r-row), colDiff = Math.abs(c-col);
          return rowDiff<=1 && colDiff<=1;
        }).map(([k])=>k);
    });

    const DEFAULT_TYPER_CONFIG = {
      baseDelay: 45,
      distanceMultiplier: 10,
      minDelay: 10,
      delayVariation: 0.18,
      typoChance: 1.2, // porcentaje
      typoNoticeDelay: { mean: 180, stdDev: 40 },
      typoBackspaceDelay: { mean: 80, stdDev: 30 },
      typoRecoveryDelay: { mean: 140, stdDev: 40 }
    };

    const STORAGE_KEY = 'bombPartyTyperSettings_es_v1';
    let TYPER_CONFIG = Object.assign({}, DEFAULT_TYPER_CONFIG);

    function loadSavedSettings() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) Object.assign(TYPER_CONFIG, JSON.parse(saved));
      } catch (e) { /* ignore */ }
    }
    function saveSettings() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(TYPER_CONFIG)); } catch (e) {}
    }

    function normalRandom(mean, stdDev) {
      // Box-Muller
      let u=0,v=0;
      while(u===0) u=Math.random();
      while(v===0) v=Math.random();
      const num = Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v);
      return Math.floor(num*stdDev + mean);
    }

    function calculateTypingDelay(fromKey, toKey) {
      if (!fromKey) return TYPER_CONFIG.baseDelay;
      fromKey = String(fromKey).toLowerCase(); toKey = String(toKey).toLowerCase();
      const fromPos = KEYBOARD_LAYOUT.layout[fromKey], toPos = KEYBOARD_LAYOUT.layout[toKey];
      if(!fromPos || !toPos) return TYPER_CONFIG.baseDelay;
      const distance = Math.sqrt(Math.pow(fromPos[0]-toPos[0],2) + Math.pow(fromPos[1]-toPos[1],2));
      const meanDelay = TYPER_CONFIG.baseDelay + distance * TYPER_CONFIG.distanceMultiplier;
      const stdDev = Math.max(1, meanDelay * TYPER_CONFIG.delayVariation);
      return Math.max(TYPER_CONFIG.minDelay, normalRandom(meanDelay, stdDev));
    }

    async function simulateTypo(inputField, correctChar) {
      const c = String(correctChar).toLowerCase();
      if (!KEYBOARD_LAYOUT.adjacent[c] || Math.random() > TYPER_CONFIG.typoChance/100) return false;
      const neighbors = KEYBOARD_LAYOUT.adjacent[c];
      const typoChar = neighbors[Math.floor(Math.random()*neighbors.length)];
      inputField.value += typoChar;
      inputField.dispatchEvent(new Event('input',{bubbles:true}));
      await new Promise(r=>setTimeout(r, calculateTypingDelay(null, typoChar)));
      await new Promise(r=>setTimeout(r, Math.max(10, normalRandom(TYPER_CONFIG.typoNoticeDelay.mean, TYPER_CONFIG.typoNoticeDelay.stdDev))));
      inputField.value = inputField.value.slice(0,-1);
      inputField.dispatchEvent(new Event('input',{bubbles:true}));
      await new Promise(r=>setTimeout(r, Math.max(10, normalRandom(TYPER_CONFIG.typoBackspaceDelay.mean, TYPER_CONFIG.typoBackspaceDelay.stdDev))));
      inputField.value += correctChar;
      inputField.dispatchEvent(new Event('input',{bubbles:true}));
      await new Promise(r=>setTimeout(r, Math.max(10, normalRandom(TYPER_CONFIG.typoRecoveryDelay.mean, TYPER_CONFIG.typoRecoveryDelay.stdDev))));
      return true;
    }

    async function simulateTyping(word) {
      try {
        const selfTurn = document.querySelector('.selfTurn');
        const form = document.querySelector('.selfTurn form');
        const inputField = document.querySelector('.selfTurn input');
        if(!inputField || !form || (selfTurn && selfTurn.hidden)) return;
        inputField.value = '';
        inputField.focus();
        let lastChar = null;
        for (let i=0;i<word.length;i++) {
          const ch = word[i];
          const didTypo = await simulateTypo(inputField, ch);
          if(!didTypo) {
            inputField.value += ch;
            inputField.dispatchEvent(new Event('input',{bubbles:true}));
            await new Promise(r=>setTimeout(r, calculateTypingDelay(lastChar, ch)));
            lastChar = ch;
          } else {
            lastChar = ch;
          }
        }
        // try to submit via form submit, fallback to pressing enter key event
        try {
          form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
        } catch(e) {
          const enter = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true });
          inputField.dispatchEvent(enter);
        }
      } catch(e){}
    }

    function isPlayerTurn() {
      const selfTurn = document.querySelector('.selfTurn');
      return !!(selfTurn && !selfTurn.hidden);
    }

    loadSavedSettings();
    window.BPS.TYPER_CONFIG = TYPER_CONFIG;
    window.BPS.loadSavedSettings = loadSavedSettings;
    window.BPS.saveSettings = saveSettings;
    window.BPS.simulateTyping = simulateTyping;
    window.BPS.isPlayerTurn = isPlayerTurn;
    window.BPS.calculateTypingDelay = calculateTypingDelay;
  })();


  /* ---------------------------
     src/core/dictionaryLoader.js
     -> Reforzado: acepta JSON array, newline list, comma/quote list.
     --------------------------- */
  (function(){
    const dictionaries = {
      "es-10k": {
        url: "https://raw.githubusercontent.com/words/an-array-of-spanish-words/master/index.json",
        words: [],
        hasFrequency: false
      },
      "es-fallback": {
        url: null,
        words: [],
        hasFrequency: false
      }
    };

    // fallback (reducción razonable, puede ampliarse)
    const FALLBACK_WORDS = [
      "a","aba","abajo","abeja","abril","acabar","aceite","aceptar","actividad","actor","actriz","actuar",
      "acuerdo","adelante","adiós","adulto","afecto","agencia","agua","agenda","aire","alegría","amigo",
      "amor","andar","animal","anotar","ansiedad","apagar","aparecer","aprender","apoyo","archivo","árbol",
      "arena","arte","asunto","atención","autor","avanzar","ayer","azul","bajar","baile","banco","barco",
      "barato","base","bebé","beber","buscar","caballo","caja","cantar","casa","caso","castillo","cargar",
      "carne","carta","casi","cerrar","cielo","ciencia","cliente","cocina","coche","color","comer","comida",
      "comprar","conocer","construir","contar","corazón","correr","creer","cruzar","cuadro","cuando","cuatro",
      "cuchara","cuerpo","cultura","cumplir","dar","dedo","dejar","delgado","demasiado","desayuno","descanso",
      "descubrir","despacio","despertar","destino","día","dibujar","dinero","dios","disco","diva","doctor",
      "dolor","domingo","dormir","dulce","economía","edad","edificio","efecto","elegir","elemento","empezar",
      "empleo","encontrar","entrada","enviar","equipo","escalera","escena","escuchar","espacio","especial",
      "esperar","estación","estadio","estado","estrella","estudio","evento","exacto","existir","extra","fácil",
      "familia","favor","fecha","feliz","fiesta","flor","fuego","fuerte","gafas","gastar","gato","girar","gloria",
      "gol","gorra","gordo","grande","guitarra","gustar","haber","hábito","hacer","hambre","harina","hermano",
      "hermosa","herramienta","hielo","hogar","honor","hora","idea","idioma","iglesia","imagen","importante",
      "informar","ingenio","interés","invierno","isla","jardín","jefe","jugar","junio","junta","justo","kilo",
      "kilómetro","largo","lago","lámpara","lavar","leer","lejos","lengua","libro","limpio","limón","lista",
      "llamar","llegar","llevar","llorar","luz","lugar","lunes","mañana","madre","mar","mariposa","marzo","masa",
      "matar","mayor","mejor","medio","médico","mejorar","memoria","menor","mensaje","mesa","metro","miedo","minuto",
      "mirar","mismo","mitad","modo","moderno","morir","móvil","música","museo","nadar","nación","nada","nadie",
      "naranja","nariz","navidad","necesario","negro","niño","noche","nombre","normal","noviembre","nuevo","nube",
      "número","océano","odiar","oficina","olor","olvidar","once","operar","opción","orden","origen","oro","otra",
      "otro","oveja","página","pagar","país","palabra","pan","papel","parar","parecer","parte","pasado","pasar",
      "paseo","pasta","patio","paz","pegar","persona","peso","pieza","pintar","piso","placer","plaza","poder",
      "polvo","poner","popular","por","porque","posible","postre","preparar","precio","prensa","preso","primero",
      "prueba","puerta","pueblo","puesto","pulgar","pulir","puntual","punto","queso","quiero","quitar","quizás",
      "raro","rata","razón","reacción","repetir","rey","rico","riesgo","rio","risa","rojo","ropa","rosa","roto",
      "saber","sacar","salir","salud","sano","sábado","sabor","segundo","seguro","seis","sentir","ser","serie",
      "siempre","silla","sin","sistema","sitio","sobre","sol","solo","sombra","sonrisa","sonido","sopa","sorpresa",
      "suave","subir","suerte","sufrir","sujeto","suma","sumar","superar","suponer","sur","sus","tal","tarde",
      "taza","taxi","teatro","techo","tener","tengo","terminar","terror","tesoro","testigo","tiempo","tierra",
      "tienda","tiene","tigre","tímido","tinta","tipo","tirar","tocar","todo","torre","toro","trabajo","trama",
      "trato","tremendo","triste","truco","tubo","tú","turbo","tuyo","uvas","vacío","vacaciones","vaca","valiente",
      "vamos","varios","vecino","vela","venir","venta","ventana","ver","verdad","verde","vestir","viaje","vida",
      "viejo","viernes","villa","visto","vivir","voz","vuelo","yo","zona","zorro"
    ];

    function parseTextToWords(text) {
      text = String(text || '').trim();
      if(!text) return [];
      // Try JSON parse first (common case for index.json)
      try {
        const parsed = JSON.parse(text);
        if(Array.isArray(parsed)) {
          return parsed.map(w => ({ word: String(w).toLowerCase().trim(), freq:1 })).filter(Boolean);
        }
      } catch(e){ /* not JSON */ }

      // If text contains newlines or commas, split robustly
      // Remove quotes around words and split on common separators
      // First replace CRLFs, then split on newlines or commas or semicolons
      const cleaned = text.replace(/\r/g,'\n');
      let candidates = cleaned.split(/\n|,|;|\/|\||\t/).map(s => s.trim()).filter(Boolean);
      // If still looks like one giant quoted list like: "a","b","c"
      if(candidates.length === 1) {
        const single = candidates[0];
        if(single.includes('"') || single.includes("'")) {
          const alt = single.split(/"|'|,|;|\s+/).map(s=>s.trim()).filter(Boolean);
          if(alt.length>1) candidates = alt;
        } else {
          // fallback: split on non-word characters keeping ñ and accents
          candidates = single.split(/[^A-Za-zÁÉÍÓÚáéíóúÑñüÜ]+/).map(s=>s.trim()).filter(Boolean);
        }
      }
      return candidates.map(w => ({ word: String(w).toLowerCase().trim(), freq:1 })).filter(Boolean);
    }

    async function tryLoadRemote(sizeKey){
      const dict = dictionaries[sizeKey];
      if(!dict || !dict.url) return false;
      try{
        const res = await fetch(dict.url, {cache: 'no-store'});
        if(!res.ok) throw new Error('no ok');
        const txt = await res.text();
        const parsed = parseTextToWords(txt);
        if(parsed && parsed.length>0) {
          dict.words = parsed;
          return true;
        } else {
          return false;
        }
      }catch(e){
        return false;
      }
    }

    async function loadAllDictionaries(){
      // preparar fallback
      dictionaries['es-fallback'].words = FALLBACK_WORDS.map(w=>({word:w.toLowerCase(), freq:1}));

      // intento cargar el es-10k remoto
      const ok = await tryLoadRemote('es-10k');
      if(!ok){
        console.warn('[BPS] No se pudo cargar diccionario remoto; usando fallback reducido.');
      } else {
        console.info('[BPS] Diccionario español remoto cargado con', dictionaries['es-10k'].words.length, 'palabras.');
      }
    }

    window.BPS.dictionaries = dictionaries;
    window.BPS.loadAllDictionaries = loadAllDictionaries;
    window.BPS.parseTextToWords = parseTextToWords;
  })();


  /* ---------------------------
     src/ui/styles.js (UI en español, minimalista)
     --------------------------- */
  (function(){
    const styles = {
      colors: {
        primary: "#4dd0e1",
        background: "rgba(18,18,20,0.85)",
        text: "#e8f6f9",
        highlight: "#72f26b",
        accent: "#ffb86b"
      },
      panel: {
        position: "fixed",
        top: "12px",
        right: "12px",
        backgroundColor: "rgba(18,18,20,0.88)",
        border: "1px solid rgba(77,208,225,0.18)",
        borderRadius: "10px",
        padding: "8px",
        zIndex: "2147483647",
        width: "300px",
        maxWidth: "420px",
        fontFamily: "Inter, Roboto, sans-serif",
        fontSize: "13px",
        color: "#e8f6f9",
        boxShadow: "0 8px 24px rgba(0,0,0,0.6)"
      },
      header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        marginBottom: "8px"
      },
      title: { fontSize: "14px", fontWeight: "600", color: "#4dd0e1" },
      controls: { display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" },
      button: {
        padding: "6px 8px",
        borderRadius: "8px",
        border: "1px solid rgba(77,208,225,0.15)",
        background: "transparent",
        color: "#e8f6f9",
        cursor: "pointer",
        fontSize: "12px"
      },
      activeButton: { background: "rgba(77,208,225,0.12)", color: "#001216" },
      smallText: { fontSize: "12px", color: "rgba(232,246,249,0.75)" },
      resultsDiv: {
        marginTop: "8px",
        maxHeight: "260px",
        overflowY: "auto",
        padding: "6px",
        borderRadius: "6px",
        background: "rgba(255,255,255,0.02)"
      },
      resultsList: { listStyle: "none", padding: "0", margin: "0" },
      resultsItem: {
        padding: "6px 8px",
        marginBottom: "6px",
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      },
      highlightSpan: { color: "#72f26b", fontWeight: "700" },
      settingsButton: { position: "absolute", top: "8px", left: "8px", padding: "4px 6px", borderRadius: "6px" },
      footer: { marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }
    };

    function applyStyles(el, obj){
      Object.assign(el.style, obj);
    }

    window.BPS.styles = styles;
    window.BPS.applyStyles = applyStyles;
  })();


  /* ---------------------------
     src/ui/suggester.js (UI y lógica de sugerencias en español)
     --------------------------- */
  (function(){
    const styles = window.BPS.styles;
    const applyStyles = window.BPS.applyStyles;
    const simulateTyping = window.BPS.simulateTyping;
    const isPlayerTurn = window.BPS.isPlayerTurn;
    let currentDictKey = localStorage.getItem('bps_currentDict') || 'es-10k';
    let currentSort = JSON.parse(localStorage.getItem('bps_currentSort') || JSON.stringify({ method: 'length', direction: 'desc' }));
    const dictionaries = window.BPS.dictionaries;
    let AUTO_MODE = localStorage.getItem('bps_autoMode') === 'true';
    let lastSuggested = null;

    function calculateRarityScore(word){
      const scoreMap = { 'z':10,'q':9,'x':8,'k':7,'w':6,'y':5 };
      return word.split('').reduce((s,c)=> s + (scoreMap[c]||1), 0);
    }

    function sortMatches(matches){
      const {method, direction} = currentSort;
      const sortFns = {
        frequency: (a,b)=> (b.freq||1) - (a.freq||1),
        length: (a,b)=> b.word.length - a.word.length,
        rarity: (a,b)=> calculateRarityScore(b.word) - calculateRarityScore(a.word)
      };
      const fn = sortFns[method] || sortFns.length;
      matches.sort((a,b)=> fn(a,b));
      if(direction === 'asc') matches.reverse();
      return matches;
    }

    function suggestWords(syllable){
      const resultsDiv = document.getElementById('bombPartyWordSuggesterResults_es');
      if(!resultsDiv) return;
      if(!syllable){ resultsDiv.textContent = '(Esperando sílaba...)'; return; }
      let dictObj = dictionaries[currentDictKey];
      if(!dictObj || !dictObj.words || dictObj.words.length===0){
        dictObj = dictionaries['es-fallback'];
      }
      if(!dictObj.words.length){ resultsDiv.textContent='(Diccionario no cargado)'; return; }
      const lower = syllable.toLowerCase();
      // Filtro: palabra que COMIENCE con la sílaba o que la contenga (prioriza comienzos)
      let starts = dictObj.words.filter(e => e.word.startsWith(lower));
      let contains = dictObj.words.filter(e => !e.word.startsWith(lower) && e.word.includes(lower));
      let matches = starts.concat(contains);
      if(matches.length===0){ resultsDiv.textContent = 'No se encontraron sugerencias.'; lastSuggested = null; return; }
      sortMatches(matches);
      const ul = document.createElement('ul');
      applyStyles(ul, styles.resultsList);
      matches.slice(0, 50).forEach(({word}, idx)=>{
        const li = document.createElement('li');
        applyStyles(li, styles.resultsItem);
        li.onmouseenter = ()=> li.style.background = 'rgba(114,242,107,0.06)';
        li.onmouseleave = ()=> li.style.background = 'transparent';
        li.onclick = ()=> { if(isPlayerTurn()) simulateTyping(word); };
        li.dataset.word = word;
        const idxMatch = word.indexOf(lower);
        if(idxMatch>=0){
          const before = word.slice(0,idxMatch);
          const match = word.slice(idxMatch, idxMatch+lower.length);
          const after = word.slice(idxMatch+lower.length);
          li.innerHTML = `<span style="font-family:monospace">${before}<span style="color:${styles.colors.highlight};font-weight:700">${match}</span>${after}</span>`;
        } else {
          li.textContent = word;
        }
        // mark first as suggested
        if(idx===0) {
          li.style.border = '1px solid rgba(114,242,107,0.12)';
          li.style.boxShadow = 'inset 0 0 0 1px rgba(114,242,107,0.03)';
        }
        ul.appendChild(li);
      });
      resultsDiv.innerHTML = '';
      resultsDiv.appendChild(ul);
      lastSuggested = (matches[0] && matches[0].word) || null;

      // Auto-mode: si es tu turno y está activado, escribe la mejor sugerencia automáticamente
      if(AUTO_MODE && lastSuggested && isPlayerTurn()) {
        // pequeña espera para dar tiempo a UI del juego
        setTimeout(()=> {
          if(isPlayerTurn()) simulateTyping(lastSuggested);
        }, 120);
      }
    }

    function createDictSelector(){
      const container = document.createElement('div');
      container.style.display='flex'; container.style.gap='6px'; container.style.alignItems='center';
      const label = document.createElement('span'); label.textContent='Diccionario:'; label.style.fontSize='12px'; container.appendChild(label);

      const select = document.createElement('select');
      select.style.padding='6px'; select.style.borderRadius='6px';
      select.innerHTML = `<option value="es-10k">Español (remoto) ⚡</option><option value="es-fallback">Español (local)</option>`;
      select.value = currentDictKey;
      select.onchange = (e)=> {
        currentDictKey = e.target.value;
        localStorage.setItem('bps_currentDict', currentDictKey);
        const sEl = document.querySelector('.syllable');
        if(sEl) suggestWords(sEl.textContent.trim());
      };
      container.appendChild(select);
      return container;
    }

    function createSortControls(){
      const div = document.createElement('div');
      div.style.display='flex'; div.style.gap='6px'; div.style.alignItems='center';
      const btnLen = document.createElement('button'); btnLen.textContent='Longitud'; btnLen.className='bps-sort';
      const btnRar = document.createElement('button'); btnRar.textContent='Raridad';
      const btnFreq = document.createElement('button'); btnFreq.textContent='Frecuencia';
      [btnLen, btnRar, btnFreq].forEach(b=> { b.style.padding='6px'; b.style.borderRadius='6px'; b.style.border='1px solid rgba(255,255,255,0.06)'; b.style.background='transparent'; b.style.cursor='pointer'; });
      btnLen.onclick = ()=> { currentSort.method='length'; saveSortUi(); suggestFromPage(); markActive(btnLen); };
      btnRar.onclick = ()=> { currentSort.method='rarity'; saveSortUi(); suggestFromPage(); markActive(btnRar); };
      btnFreq.onclick = ()=> { currentSort.method='frequency'; saveSortUi(); suggestFromPage(); markActive(btnFreq); };

      function markActive(btn){
        [btnLen, btnRar, btnFreq].forEach(x=> x.style.background='transparent');
        btn.style.background='rgba(77,208,225,0.12)';
      }
      // marcar default
      if(currentSort.method === 'rarity') markActive(btnRar);
      else if(currentSort.method === 'frequency') markActive(btnFreq);
      else markActive(btnLen);

      div.appendChild(btnLen); div.appendChild(btnRar); div.appendChild(btnFreq);
      return div;
    }

    function saveSortUi(){
      localStorage.setItem('bps_currentSort', JSON.stringify(currentSort));
    }

    function suggestFromPage(){
      const sEl = document.querySelector('.syllable');
      if(sEl) suggestWords(sEl.textContent.trim());
    }

    window.BPS.suggestWords = suggestWords;
    window.BPS.createDictSelector = createDictSelector;
    window.BPS.createSortControls = createSortControls;
    window.BPS.getCurrentDict = ()=> currentDictKey;
    window.BPS.getCurrentSort = ()=> currentSort;
    window.BPS.setAutoMode = (v)=> { AUTO_MODE = !!v; localStorage.setItem('bps_autoMode', AUTO_MODE ? 'true' : 'false'); };
    window.BPS.getAutoMode = ()=> AUTO_MODE;
    window.BPS.getLastSuggested = ()=> lastSuggested;
  })();


  /* ---------------------------
     src/ui/main.js (creación UI en español)
     --------------------------- */
  (function(){
    const styles = window.BPS.styles;
    const applyStyles = window.BPS.applyStyles;

    function createUI(){
      if(document.getElementById('bombPartyWordSuggesterPanel_es')) return;

      const panel = document.createElement('div');
      panel.id = 'bombPartyWordSuggesterPanel_es';
      applyStyles(panel, styles.panel);

      // Header
      const header = document.createElement('div');
      applyStyles(header, styles.header);
      const title = document.createElement('div');
      applyStyles(title, styles.title);
      title.textContent = 'BPS — Sugeridor (ES)';

      const controles = document.createElement('div');
      applyStyles(controles, styles.controls);

      // Botón pausa / reanudar (solo UI)
      const btnToggle = document.createElement('button');
      btnToggle.textContent = 'Pausar';
      Object.assign(btnToggle.style, styles.button);
      let paused = false;
      btnToggle.onclick = ()=> {
        paused = !paused;
        btnToggle.textContent = paused ? 'Reanudar' : 'Pausar';
        const res = document.getElementById('bombPartyWordSuggesterResults_es');
        if(res) res.innerHTML = paused ? '(Pausado)' : '(Esperando sílaba...)';
        // Si pausado realmente desactivamos auto-mode temporalmente
        if(paused) {
          window.BPS._wasAuto = window.BPS.getAutoMode();
          window.BPS.setAutoMode(false);
        } else {
          if(window.BPS._wasAuto) window.BPS.setAutoMode(true);
        }
      };
      controles.appendChild(btnToggle);

      // Auto-mode toggle
      const btnAuto = document.createElement('button');
      btnAuto.textContent = window.BPS.getAutoMode() ? 'Auto: ON' : 'Auto: OFF';
      Object.assign(btnAuto.style, styles.button);
      btnAuto.onclick = ()=> {
        const newState = !window.BPS.getAutoMode();
        window.BPS.setAutoMode(newState);
        btnAuto.textContent = newState ? 'Auto: ON' : 'Auto: OFF';
      };
      controles.appendChild(btnAuto);

      // Selector diccionario
      const dictSel = window.BPS.createDictSelector();
      controles.appendChild(dictSel);

      header.appendChild(title);
      header.appendChild(controles);
      panel.appendChild(header);

      // Sort controls
      const sortControls = window.BPS.createSortControls();
      panel.appendChild(sortControls);

      // Results area
      const resultsDiv = document.createElement('div');
      resultsDiv.id = 'bombPartyWordSuggesterResults_es';
      applyStyles(resultsDiv, styles.resultsDiv);
      resultsDiv.textContent = '(Esperando sílaba...)';
      panel.appendChild(resultsDiv);

      // Footer: información y ajustes
      const footer = document.createElement('div');
      applyStyles(footer, styles.footer);

      const infoSpan = document.createElement('div');
      infoSpan.textContent = 'Haz clic en una palabra para que se escriba automáticamente cuando sea tu turno.';
      infoSpan.style.fontSize='12px'; infoSpan.style.opacity='0.85';
      footer.appendChild(infoSpan);

      const settingsBtn = document.createElement('button');
      settingsBtn.textContent = 'Ajustes';
      Object.assign(settingsBtn.style, styles.button);
      settingsBtn.onclick = ()=> {
        const sp = document.getElementById('typerSettingsPanel_es');
        if(sp) sp.style.display = sp.style.display==='none' ? 'block' : 'none';
      };
      footer.appendChild(settingsBtn);

      panel.appendChild(footer);

      // Añadir al body cuando esté disponible
      function attach(){
        if(document.body && !document.getElementById('bombPartyWordSuggesterPanel_es')){
          document.body.appendChild(panel);
        }
      }
      document.addEventListener('DOMContentLoaded', attach);
      if(document.readyState === 'complete' || document.readyState === 'interactive'){ setTimeout(attach, 80); }

      // Crear panel de ajustes
      createSettingsPanelMinimal();
    }

    function createSettingsPanelMinimal(){
      if(document.getElementById('typerSettingsPanel_es')) return;
      const panel = document.createElement('div');
      panel.id = 'typerSettingsPanel_es';
      Object.assign(panel.style, {
        position: 'fixed', left: '12px', top: '12px', zIndex:'2147483647',
        background:'rgba(10,10,12,0.95)', color:'#e8f6f9', padding:'10px', borderRadius:'10px',
        border:'1px solid rgba(77,208,225,0.08)', display:'none', width:'300px', boxShadow:'0 8px 24px rgba(0,0,0,0.6)'
      });
      const title = document.createElement('div'); title.textContent='Ajustes de tipeo (simulación)'; title.style.color='#4dd0e1'; title.style.fontWeight='700'; title.style.marginBottom='6px';
      panel.appendChild(title);

      const STORAGE_KEY = 'bombPartyTyperSettings_es_v1';
      const cfg = window.BPS.TYPER_CONFIG || {};

      const makeRange = (labelText, key, min, max, step) => {
        const row = document.createElement('div'); row.style.marginBottom='8px';
        const label = document.createElement('div'); label.textContent = labelText; label.style.fontSize='12px'; label.style.marginBottom='4px';
        const input = document.createElement('input'); input.type='range'; input.min=min; input.max=max; input.step=step;
        const valSpan = document.createElement('span'); valSpan.style.marginLeft='8px';
        input.value = cfg[key];
        valSpan.textContent = input.value;
        input.oninput = ()=> {
          const num = parseFloat(input.value);
          window.BPS.TYPER_CONFIG[key] = num;
          valSpan.textContent = num;
          window.BPS.saveSettings();
        };
        row.appendChild(label); row.appendChild(input); row.appendChild(valSpan);
        return row;
      };

      panel.appendChild(makeRange('Velocidad base (ms)', 'baseDelay', 5, 200, 1));
      panel.appendChild(makeRange('Multiplicador distancia', 'distanceMultiplier', 0, 30, 0.1));
      panel.appendChild(makeRange('Probabilidad de error (%)', 'typoChance', 0, 10, 0.1));

      const info = document.createElement('div');
      info.textContent = 'Los cambios se guardan automáticamente.';
      info.style.fontSize='12px'; info.style.marginTop='6px'; panel.appendChild(info);

      const closeBtn = document.createElement('button'); closeBtn.textContent='Cerrar'; Object.assign(closeBtn.style, { marginTop:'8px', padding:'6px', borderRadius:'6px' });
      closeBtn.onclick = ()=> panel.style.display='none';
      panel.appendChild(closeBtn);

      document.addEventListener('DOMContentLoaded', ()=> document.body.appendChild(panel));
      if(document.readyState === 'complete' || document.readyState === 'interactive'){
        setTimeout(()=>{ if(!document.getElementById('typerSettingsPanel_es')) document.body.appendChild(panel); }, 100);
      }
    }

    window.BPS.createUI = createUI;
    window.BPS.initScript = function(){
      createUI();
      window.BPS.setupSyllableObserver && window.BPS.setupSyllableObserver();
    };
  })();


  /* ---------------------------
     src/ui/observer.js
     Observador de la sílaba en la página
     --------------------------- */
  (function(){
    let syllableObserver = null;
    function setupSyllableObserver(){
      if(syllableObserver) return;
      syllableObserver = new MutationObserver((mutations)=>{
        for(const m of mutations){
          if(m.type === 'childList' || m.type === 'characterData'){
            const el = m.target;
            const text = (el.textContent || '').trim();
            if(text){
              const candidate = text.trim().slice(0,4);
              window.BPS.suggestWords && window.BPS.suggestWords(candidate);
            }
          }
        }
      });

      function waitForSyllable(){
        const el = document.querySelector('.syllable');
        if(el){
          syllableObserver.observe(el, { childList:true, characterData:true, subtree:true });
          const txt = el.textContent.trim();
          if(txt) window.BPS.suggestWords && window.BPS.suggestWords(txt.trim());
        } else {
          setTimeout(waitForSyllable, 700);
        }
      }
      waitForSyllable();
    }

    window.BPS.setupSyllableObserver = setupSyllableObserver;
  })();


  /* ---------------------------
     src/index.js (inicialización)
     --------------------------- */
  (function(){
    (async ()=> {
      try {
        await window.BPS.loadAllDictionaries();
      } catch(e){}
      // init UI después de cargar diccionarios (si falla se usa fallback)
      window.BPS.initScript && window.BPS.initScript();

      // small safety: re-suggest when the page updates (some SPA behaviors)
      setInterval(()=> {
        const el = document.querySelector('.syllable');
        if(el && el.textContent) window.BPS.suggestWords && window.BPS.suggestWords(el.textContent.trim());
      }, 2000);
    })();
  })();

})();
