// ==UserScript==
// @name         Resolucion inteligente GDriveLatinoHD - Sistema Intuitivo
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Sistema intuitivo de filtrado por capas: Resolución → Calidad
// @match        *://gdrivelatinohd.net/*
// @grant        none
// @icon         https://gdrivelatinohd.net/wp-content/themes/GDriveLatinoHD/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/561280/Resolucion%20inteligente%20GDriveLatinoHD%20-%20Sistema%20Intuitivo.user.js
// @updateURL https://update.greasyfork.org/scripts/561280/Resolucion%20inteligente%20GDriveLatinoHD%20-%20Sistema%20Intuitivo.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // CONSTANTES DE ALMACENAMIENTO
  const STORAGE_KEY = 'resolucionesConfig';

// DEFINICIÓN COMPLETA DE RESOLUCIONES - REORDENADO Y CON EXPLICIT SDR
const resoluciones = [
  // ========== 4K ==========
  // BDRemux 4K (más específicos primero)
  { clave: 'bdremux_4k_dv_hdr10', nombre: 'BDRemux 4K DV HDR10', regex: /\bBDRemux 4K DV HDR10\b/i, grupo: 'bdremux', resolucion: '4k', esHDR: true, esSDR: false, esRemux: true },
  { clave: 'bdremux_4k_hdr10', nombre: 'BDRemux 4K HDR10', regex: /\bBDRemux 4K HDR10\b/i, grupo: 'bdremux', resolucion: '4k', esHDR: true, esSDR: false, esRemux: true },
  { clave: 'bdremux_4k_sdr', nombre: 'BDRemux 4K SDR', regex: /\bBDRemux 4K SDR\b/i, grupo: 'bdremux', resolucion: '4k', esHDR: false, esSDR: true, esRemux: true },

  // WEB-DL 4K (más específicos primero)
  { clave: 'webdl_4k_dv_hdr10_plus', nombre: 'WEB-DL 4K DV HDR10+', regex: /\bWEB-DL 4K DV HDR10\+\b/i, grupo: 'webdl', resolucion: '4k', esHDR: true, esSDR: false },
  { clave: 'webdl_4k_hdr10_plus', nombre: 'WEB-DL 4K HDR10+', regex: /\bWEB-DL 4K HDR10\+\b/i, grupo: 'webdl', resolucion: '4k', esHDR: true, esSDR: false },
  { clave: 'imax_webdl_4k_dv_hdr10', nombre: 'IMAX WEB-DL 4K DV HDR10', regex: /\bIMAX WEB-DL 4K DV HDR10\b/i, grupo: 'webdl', resolucion: '4k', esHDR: true, esSDR: false },
  { clave: 'webdl_4k_dv_hdr10', nombre: 'WEB-DL 4K DV HDR10', regex: /\bWEB-DL 4K DV HDR10\b/i, grupo: 'webdl', resolucion: '4k', esHDR: true, esSDR: false },
  { clave: 'webdl_4k_hdr10', nombre: 'WEB-DL 4K HDR10', regex: /\bWEB-DL 4K HDR10\b/i, grupo: 'webdl', resolucion: '4k', esHDR: true, esSDR: false },
  { clave: 'webdl_4k_sdr', nombre: 'WEB-DL 4K SDR', regex: /\bWEB-DL 4K SDR\b/i, grupo: 'webdl', resolucion: '4k', esHDR: false, esSDR: true },

  // BDRip 4K (más específicos primero)
  { clave: 'bdrip_4k_dv_hdr10', nombre: 'BDRip 4K DV HDR10', regex: /\bBDRip 4K DV HDR10\b/i, grupo: 'bdrip', resolucion: '4k', esHDR: true, esSDR: false },
  { clave: 'bdrip_4k_hdr10', nombre: 'BDRip 4K HDR10', regex: /\bBDRip 4K HDR10\b/i, grupo: 'bdrip', resolucion: '4k', esHDR: true, esSDR: false },
  { clave: 'bdrip_4k_sdr', nombre: 'BDRip 4K SDR', regex: /\bBDRip 4K SDR\b/i, grupo: 'bdrip', resolucion: '4k', esHDR: false, esSDR: true },

  // Otros 4K
  { clave: '4k_hdr10_plus', nombre: '4K HDR10+', regex: /\b4K HDR10\+\b/i, grupo: 'otros', resolucion: '4k', esHDR: true, esSDR: false },
  { clave: '4k_hdr10', nombre: '4K HDR10', regex: /\b4K HDR10\b/i, grupo: 'otros', resolucion: '4k', esHDR: true, esSDR: false },
  { clave: '4k_sdr', nombre: '4K SDR', regex: /\b4K SDR\b/i, grupo: 'otros', resolucion: '4k', esHDR: false, esSDR: true },

  // ========== 1080p ==========
  // BDRemux 1080p HDR (específicos primero)
  { clave: 'bdremux_1080p_dv_hdr10', nombre: 'BDRemux 1080p DV HDR10', regex: /\bBDRemux 1080p DV HDR10\b/i, grupo: 'bdremux', resolucion: '1080p', esHDR: true, esSDR: false, esRemux: true },
  { clave: 'bdremux_1080p_hdr10', nombre: 'BDRemux 1080p HDR10', regex: /\bBDRemux 1080p HDR10\b/i, grupo: 'bdremux', resolucion: '1080p', esHDR: true, esSDR: false, esRemux: true },
  { clave: 'imax_bdremux_1080p', nombre: 'IMAX BDRemux 1080p', regex: /\bIMAX BDRemux 1080p\b/i, grupo: 'bdremux', resolucion: '1080p', esHDR: false, esSDR: true, esRemux: true },
  { clave: 'bdremux', nombre: 'BDRemux 1080p', regex: /\bBDRemux 1080p\b(?!\s*[DH]V?\s*HDR)/i, grupo: 'bdremux', resolucion: '1080p', esHDR: false, esSDR: true, esRemux: true },

  // WEB-DL 1080p HDR (específicos primero)
  { clave: 'webdl_1080p_dv_hdr10', nombre: 'WEB-DL 1080p DV HDR10', regex: /\bWEB-DL 1080p DV HDR10\b/i, grupo: 'webdl', resolucion: '1080p', esHDR: true, esSDR: false },
  { clave: 'webdl_1080p_hdr10', nombre: 'WEB-DL 1080p HDR10', regex: /\bWEB-DL 1080p HDR10\b/i, grupo: 'webdl', resolucion: '1080p', esHDR: true, esSDR: false },
  { clave: 'imax_webdl_1080p', nombre: 'IMAX WEB-DL 1080p', regex: /\bIMAX WEB-DL 1080p\b/i, grupo: 'webdl', resolucion: '1080p', esHDR: false, esSDR: true },
  { clave: 'openmatte_webdl_1080p', nombre: 'OPEN MATTE WEB-DL 1080p', regex: /\bOPEN MATTE WEB-DL 1080p\b/i, grupo: 'webdl', resolucion: '1080p', esHDR: false, esSDR: true },
  { clave: 'webdl_1080p', nombre: 'WEB-DL 1080p', regex: /\bWEB-DL 1080p\b(?!\s*[DH]V?\s*HDR)/i, grupo: 'webdl', resolucion: '1080p', esHDR: false, esSDR: true },

  // BDRip 1080p HDR (específicos primero)
  { clave: 'bdrip_1080p_dv_hdr10', nombre: 'BDRip 1080p DV HDR10', regex: /\bBDRip 1080p DV HDR10\b/i, grupo: 'bdrip', resolucion: '1080p', esHDR: true, esSDR: false },
  { clave: 'bdrip_1080p_hdr10', nombre: 'BDRip 1080p HDR10', regex: /\bBDRip 1080p HDR10\b/i, grupo: 'bdrip', resolucion: '1080p', esHDR: true, esSDR: false },
  { clave: 'imax_bdrip_1080p', nombre: 'IMAX BDRip 1080p', regex: /\bIMAX BDRip 1080p\b/i, grupo: 'bdrip', resolucion: '1080p', esHDR: false, esSDR: true },
  { clave: 'bdrip_restaurado_1080p', nombre: 'BDRip Restaurado 1080p', regex: /\bBDRip Restaurado 1080p\b/i, grupo: 'bdrip', resolucion: '1080p', esHDR: false, esSDR: true },
  { clave: 'bdrip_x265_1080p', nombre: 'BDRip x265 1080p', regex: /\bBDRip\s*x265\s*1080p|\bBDRip\s*1080p\s*x265(?!\s*[DH]V?\s*HDR)/i, grupo: 'bdrip', resolucion: '1080p', esHDR: false, esSDR: true },
  { clave: 'bdrip_1080p', nombre: 'BDRip 1080p', regex: /\bBDRip 1080p\b(?!\s*x265)(?!\s*[DH]V?\s*HDR)/i, grupo: 'bdrip', resolucion: '1080p', esHDR: false, esSDR: true },

  // WEBRip/BRRip 1080p HDR (específicos primero)
  { clave: 'webrip_1080p_dv_hdr10', nombre: 'WEBRip 1080p DV HDR10', regex: /\bWEBRip 1080p DV HDR10\b/i, grupo: 'webrip', resolucion: '1080p', esHDR: true, esSDR: false },
  { clave: 'webrip_1080p_hdr10', nombre: 'WEBRip 1080p HDR10', regex: /\bWEBRip 1080p HDR10\b/i, grupo: 'webrip', resolucion: '1080p', esHDR: true, esSDR: false },
  { clave: 'brrip_1080p_dv_hdr10', nombre: 'BRRip 1080p DV HDR10', regex: /\bBRRip 1080p DV HDR10\b/i, grupo: 'webrip', resolucion: '1080p', esHDR: true, esSDR: false },
  { clave: 'brrip_1080p_hdr10', nombre: 'BRRip 1080p HDR10', regex: /\bBRRip 1080p HDR10\b/i, grupo: 'webrip', resolucion: '1080p', esHDR: true, esSDR: false },
  { clave: 'imax_brrip_1080p', nombre: 'IMAX BRRip x265 1080p', regex: /\bIMAX BRRip 1080p\b/i, grupo: 'webrip', resolucion: '1080p', esHDR: false, esSDR: true },
  { clave: 'openmatte_webrip_x265_1080p', nombre: 'Open Matte WEBRip x265 1080p', regex: /\bOpen Matte WEBRip x265 1080p\b/i, grupo: 'webrip', resolucion: '1080p', esHDR: false, esSDR: true },
  { clave: 'webrip_x265_1080p', nombre: 'WEBRip x265 1080p', regex: /\bWEBRip\s*x265\s*1080p|\bWEBRip\s*1080p\s*x265(?!\s*[DH]V?\s*HDR)/i, grupo: 'webrip', resolucion: '1080p', esHDR: false, esSDR: true },
  { clave: 'brrip_1080p', nombre: 'BRRip 1080p', regex: /\bBRRip 1080p\b(?!\s*[DH]V?\s*HDR)/i, grupo: 'webrip', resolucion: '1080p', esHDR: false, esSDR: true },
  { clave: 'webrip_1080p', nombre: 'WEBRip 1080p', regex: /\bWEBRip 1080p\b(?!\s*[DH]V?\s*HDR)/i, grupo: 'webrip', resolucion: '1080p', esHDR: false, esSDR: true },

  // Otros 1080p
  { clave: 'hdts_1080p', nombre: 'HDTS 1080p', regex: /\bHDTS 1080p\b/i, grupo: 'otros', resolucion: '1080p', esHDR: false, esSDR: true },

  // ========== 720p ==========
  { clave: 'imax_bdremux_720p', nombre: 'IMAX BDRemux 720p', regex: /\bIMAX BDRemux 720p\b/i, grupo: 'bdremux', resolucion: '720p', esHDR: false, esSDR: true, esRemux: true },
  { clave: 'imax_bdrip_x265_720p', nombre: 'IMAX BDRip x265 720p', regex: /\bIMAX BDRip x265 720p\b/i, grupo: 'bdrip', resolucion: '720p', esHDR: false, esSDR: true },
  { clave: 'bdrip_x265_720p', nombre: 'BDRip x265 720p', regex: /\bBDRip x265 720p\b/i, grupo: 'bdrip', resolucion: '720p', esHDR: false, esSDR: true },
  { clave: 'webdl_720p', nombre: 'WEB-DL 720p', regex: /\bWEB-DL 720p\b/i, grupo: 'webdl', resolucion: '720p', esHDR: false, esSDR: true },

  // ========== 480p ==========
  { clave: 'bdrip_480p', nombre: 'BDRip 480p', regex: /\bBDRip 480p\b/i, grupo: 'bdrip', resolucion: '480p', esHDR: false, esSDR: true },
  { clave: 'dvdrip_480p', nombre: 'DVDRip 480p', regex: /\bDVDRip 480p\b/i, grupo: 'otros', resolucion: '480p', esHDR: false, esSDR: true }
];

// Asegurar que todas las resoluciones tengan esHDR y esSDR definido
resoluciones.forEach(regla => {
  if (regla.esHDR === undefined) {
    regla.esHDR = false;
  }
  if (regla.esSDR === undefined) {
    // Solo es SDR explícito si tiene "SDR" en el nombre
    regla.esSDR = /\bSDR\b/i.test(regla.nombre);
  }
  // Nueva propiedad: esSDRExplicito (tiene SDR en el nombre)
  regla.esSDRExplicito = /\bSDR\b/i.test(regla.nombre);
});

  // GRUPOS POR CALIDAD (SEGUNDA CAPA)
  const gruposCalidad = [
    {
      nombre: '🎬 BDRemux',
      clave: 'bdremux',
      descripcion: 'Máxima calidad, archivos grandes',
      color: '#e2ca4f',
      prioridad: 1
    },
    {
      nombre: '💎 WEB-DL',
      clave: 'webdl',
      descripcion: 'Calidad excelente, tamaño óptimo',
      color: '#4aa304',
      prioridad: 2
    },
    {
      nombre: '🎨 BDRip',
      clave: 'bdrip',
      descripcion: 'Buena calidad comprimida',
      color: '#a574e3',
      prioridad: 3
    },
    {
      nombre: '📹 WEBRip/BRRip',
      clave: 'webrip',
      descripcion: 'Rips comprimidos',
      color: '#5b5d5c',
      prioridad: 4
    },
    {
      nombre: '⚠️ Otros',
      clave: 'otros',
      descripcion: 'HDTS, DVDRip, etc.',
      color: '#FF0000',
      prioridad: 5
    }
  ];

  // GRUPOS POR RESOLUCIÓN (PRIMERA CAPA)
  const gruposResolucion = [
    {
      nombre: '📺 4K',
      clave: '4k',
      descripcion: 'Resolución Ultra HD',
      prioridad: 1
    },
    {
      nombre: '💻 1080p',
      clave: '1080p',
      descripcion: 'Full HD',
      prioridad: 2
    },
    {
      nombre: '📱 720p',
      clave: '720p',
      descripcion: 'HD',
      prioridad: 3
    },
    {
      nombre: '📼 480p',
      clave: '480p',
      descripcion: 'SD',
      prioridad: 4
    }
  ];

  // PRIORIDADES ESPECÍFICAS DENTRO DE CADA GRUPO/RESOLUCIÓN - ACTUALIZADA COMPLETA
  const prioridadesEspecificas = {
    'bdrip': {
      '1080p': [
        'bdrip_1080p_dv_hdr10',  // BDRip 1080p DV HDR10 (nueva)
        'bdrip_1080p_hdr10',     // BDRip 1080p HDR10 (nueva)
        'bdrip_1080p',           // BDRip 1080p normal
        'bdrip_restaurado_1080p', // BDRip Restaurado 1080p
        'imax_bdrip_1080p',      // IMAX BDRip 1080p
        'bdrip_x265_1080p'       // BDRip x265 1080p
      ],
      '720p': [
        'bdrip_x265_720p',       // BDRip x265 720p
        'imax_bdrip_x265_720p'   // IMAX BDRip x265 720p
      ],
      '4k': [
        'bdrip_4k_dv_hdr10',     // BDRip 4K DV HDR10
        'bdrip_4k_hdr10',        // BDRip 4K HDR10
        'bdrip_4k_sdr'           // BDRip 4K SDR
      ],
      '480p': [
        'bdrip_480p'             // BDRip 480p
      ]
    },
    'webrip': {
      '1080p': [
        'webrip_1080p_dv_hdr10', // WEBRip 1080p DV HDR10 (nueva)
        'webrip_1080p_hdr10',    // WEBRip 1080p HDR10 (nueva)
        'brrip_1080p_dv_hdr10',  // BRRip 1080p DV HDR10 (nueva)
        'brrip_1080p_hdr10',     // BRRip 1080p HDR10 (nueva)
        'brrip_1080p',           // BRRip 1080p
        'webrip_1080p',          // WEBRip 1080p
        'imax_brrip_1080p',      // IMAX BRRip 1080p
        'webrip_x265_1080p',     // WEBRip x265 1080p
        'openmatte_webrip_x265_1080p' // Open Matte WEBRip x265 1080p
      ]
    },
    'webdl': {
      '1080p': [
        'webdl_1080p_dv_hdr10',  // WEB-DL 1080p DV HDR10 (NUEVA - para tu ejemplo)
        'webdl_1080p_hdr10',     // WEB-DL 1080p HDR10 (NUEVA)
        'webdl_1080p',           // WEB-DL 1080p normal
        'imax_webdl_1080p',      // IMAX WEB-DL 1080p
        'openmatte_webdl_1080p'  // OPEN MATTE WEB-DL 1080p
      ],
      '720p': [
        'webdl_720p'             // WEB-DL 720p
      ],
      '4k': [
        'webdl_4k_dv_hdr10_plus', // WEB-DL 4K DV HDR10+
        'webdl_4k_hdr10_plus',    // WEB-DL 4K HDR10+
        'webdl_4k_dv_hdr10',      // WEB-DL 4K DV HDR10
        'webdl_4k_hdr10',         // WEB-DL 4K HDR10
        'imax_webdl_4k_dv_hdr10', // IMAX WEB-DL 4K DV HDR10
        'webdl_4k_sdr'           // WEB-DL 4K SDR
      ]
    },
    'bdremux': {
      '1080p': [
        'bdremux_1080p_dv_hdr10', // BDRemux 1080p DV HDR10 (nueva)
        'bdremux_1080p_hdr10',    // BDRemux 1080p HDR10 (nueva)
        'bdremux',               // BDRemux 1080p normal
        'imax_bdremux_1080p'     // IMAX BDRemux 1080p
      ],
      '720p': [
        'imax_bdremux_720p'      // IMAX BDRemux 720p
      ],
      '4k': [
        'bdremux_4k_dv_hdr10',   // BDRemux 4K DV HDR10
        'bdremux_4k_hdr10',      // BDRemux 4K HDR10
        'bdremux_4k_sdr'         // BDRemux 4K SDR
      ]
    }
  };

  // VARIABLES DE ESTADO
  let configGlobal = {
    ordenCalidades: gruposCalidad.map(g => g.clave),
    ordenResoluciones: gruposResolucion.map(g => g.clave),
    priorizarSDR: false, // Por defecto: HDR tiene prioridad (checkbox desmarcado)
    modoVerTodo: false,
    opacidadAtenuados: 0.2 // Valor por defecto para elementos atenuados
  };

  // FUNCIÓN PRINCIPAL PARA INSERTAR LA INTERFAZ
  function insertarInterfazMejorada() {
    const contenedorHeader = document.querySelector('.header-inner.responsive-wrapper.mx-auto');
    if (!contenedorHeader || document.getElementById('panelFiltroResoluciones')) return;

    // Cargar configuración guardada
    cargarConfiguracion();

    // Crear contenedor principal
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: relative;
      display: inline-block;
      margin-left: 15px;
      vertical-align: middle;
    `;

    // Botón principal
    const boton = document.createElement('button');
    boton.id = 'botonFiltroPrincipal';
    boton.innerHTML = '🎬 Filtrar Resoluciones';
    boton.title = 'Configurar filtro por capas: Resolución → Calidad';
    boton.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    `;

    boton.addEventListener('mouseenter', () => {
      boton.style.transform = 'translateY(-2px)';
      boton.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
    });

    boton.addEventListener('mouseleave', () => {
      boton.style.transform = 'translateY(0)';
      boton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });

    // Panel desplegable
    const panel = document.createElement('div');
    panel.id = 'panelFiltroResoluciones';
    panel.style.cssText = `
      display: none;
      position: absolute;
      background: #1a1a1a;
      border: 1px solid #444;
      border-radius: 10px;
      padding: 15px;
      z-index: 1000;
      width: 450px;
      max-height: 70vh;
      overflow-y: auto;
      color: white;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      right: 0;
      top: calc(100% + 10px);
    `;

    // Crear pestañas
    const tabsContainer = document.createElement('div');
    tabsContainer.style.cssText = `
      display: flex;
      margin-bottom: 15px;
      border-bottom: 2px solid #444;
    `;

    const tabResoluciones = crearTab('🖼️ Resoluciones', true);
    const tabCalidades = crearTab('📊 Calidades', false);
    const tabInstrucciones = crearTab('📋 Instrucciones', false);

    tabsContainer.appendChild(tabResoluciones);
    tabsContainer.appendChild(tabCalidades);
    tabsContainer.appendChild(tabInstrucciones);

    // Contenido de pestañas
    const contenido = document.createElement('div');
    contenido.id = 'contenidoPestanas';
    contenido.style.cssText = `
      min-height: 300px;
    `;

    // Inicializar con la pestaña de resoluciones
    contenido.appendChild(crearContenidoResoluciones());

    // Añadir elementos al panel
    panel.appendChild(tabsContainer);
    panel.appendChild(contenido);

    // Añadir sección de botones de opciones al pie del contenedor
    const botonesOpciones = document.createElement('div');
    botonesOpciones.style.cssText = `
      display: flex;
      gap: 10px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #444;
    `;

    // Botón Priorizar SDR sobre HDR
    const btnSDR = document.createElement('button');
    btnSDR.id = 'btnPriorizarSDR';
    btnSDR.textContent = configGlobal.priorizarSDR ? '✅ SDR > HDR' : '📺 SDR > HDR';
    btnSDR.title = 'Priorizar SDR sobre HDR (útil para hardware sin soporte HDR)';
    btnSDR.style.cssText = `
      flex: 1;
      padding: 8px 12px;
      background: ${configGlobal.priorizarSDR ? '#4a90e2' : '#2a2a2a'};
      color: white;
      border: 1px solid ${configGlobal.priorizarSDR ? '#4a90e2' : '#555'};
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
    `;

    // Botón Modo Ver Todo
    const btnVerTodo = document.createElement('button');
    btnVerTodo.id = 'btnVerTodo';
    btnVerTodo.textContent = configGlobal.modoVerTodo ? '✅ Ver Todo' : '👁️ Ver Todo';
    btnVerTodo.title = 'Mostrar todas las resoluciones sin atenuar (útil para comparar)';
    btnVerTodo.style.cssText = `
      flex: 1;
      padding: 8px 12px;
      background: ${configGlobal.modoVerTodo ? '#9C27B0' : '#2a2a2a'};
      color: white;
      border: 1px solid ${configGlobal.modoVerTodo ? '#9C27B0' : '#555'};
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
    `;

    botonesOpciones.appendChild(btnSDR);
    botonesOpciones.appendChild(btnVerTodo);

    // CONTROL DE OPACIDAD
    const opacidadContainer = document.createElement('div');
    opacidadContainer.style.cssText = `
      margin-top: 15px;
      padding: 10px;
      background: #2a2a2a;
      border-radius: 6px;
    `;

    const opacidadLabel = document.createElement('label');
    opacidadLabel.textContent = 'Opacidad elementos atenuados: ';
    opacidadLabel.style.cssText = `
      display: block;
      margin-bottom: 5px;
      font-size: 12px;
      color: #aaa;
    `;

    const opacidadValue = document.createElement('span');
    opacidadValue.id = 'opacidadValue';
    opacidadValue.textContent = configGlobal.opacidadAtenuados;
    opacidadValue.style.cssText = `
      color: #fff;
      font-weight: bold;
      margin-left: 5px;
    `;

    const opacidadSlider = document.createElement('input');
    opacidadSlider.type = 'range';
    opacidadSlider.min = '0.1';
    opacidadSlider.max = '0.8';
    opacidadSlider.step = '0.1';
    opacidadSlider.value = configGlobal.opacidadAtenuados;
    opacidadSlider.style.cssText = `
      width: 100%;
      margin-top: 5px;
    `;

    const opacidadDesc = document.createElement('div');
    opacidadDesc.textContent = 'Controla qué tan visibles son los elementos no seleccionados';
    opacidadDesc.style.cssText = `
      font-size: 10px;
      color: #666;
      margin-top: 5px;
      text-align: center;
    `;

    opacidadLabel.appendChild(opacidadValue);
    opacidadContainer.appendChild(opacidadLabel);
    opacidadContainer.appendChild(opacidadSlider);
    opacidadContainer.appendChild(opacidadDesc);

    // Añadir botones y control de opacidad al panel
    panel.appendChild(botonesOpciones);
    panel.appendChild(opacidadContainer);

    // Añadir al wrapper
    wrapper.appendChild(boton);
    wrapper.appendChild(panel);
    contenedorHeader.appendChild(wrapper);

    // Eventos
    boton.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        panel.style.display = 'none';
      }
    });

    // Eventos de cambio de pestaña
    tabResoluciones.addEventListener('click', () => cambiarPestana(tabResoluciones, tabCalidades, tabInstrucciones, 'resoluciones'));
    tabCalidades.addEventListener('click', () => cambiarPestana(tabCalidades, tabResoluciones, tabInstrucciones, 'calidades'));
    tabInstrucciones.addEventListener('click', () => cambiarPestana(tabInstrucciones, tabResoluciones, tabCalidades, 'instrucciones'));

    // Eventos para los botones de opciones
    btnSDR.addEventListener('click', function() {
      configGlobal.priorizarSDR = !configGlobal.priorizarSDR;
      guardarConfiguracion();

      // Actualizar apariencia del botón
      this.textContent = configGlobal.priorizarSDR ? '✅ SDR > HDR' : '📺 SDR > HDR';
      this.style.background = configGlobal.priorizarSDR ? '#4a90e2' : '#2a2a2a';
      this.style.borderColor = configGlobal.priorizarSDR ? '#4a90e2' : '#555';

      // Aplicar filtros
      resaltarYAtenuar();

      // Mostrar mensaje de confirmación
      mostrarMensajeTemporal(configGlobal.priorizarSDR ?
        'Prioridad SDR activada (SDR > HDR)' :
        'Prioridad HDR activada (HDR > SDR)',
        configGlobal.priorizarSDR ? '#4a90e2' : '#d32f2f'
      );
    });

    btnVerTodo.addEventListener('click', function() {
      configGlobal.modoVerTodo = !configGlobal.modoVerTodo;
      guardarConfiguracion();

      // Actualizar apariencia del botón
      this.textContent = configGlobal.modoVerTodo ? '✅ Ver Todo' : '👁️ Ver Todo';
      this.style.background = configGlobal.modoVerTodo ? '#9C27B0' : '#2a2a2a';
      this.style.borderColor = configGlobal.modoVerTodo ? '#9C27B0' : '#555';

      // Aplicar filtros
      resaltarYAtenuar();
      actualizarBotonPrincipal();
    });

    // Evento para el control de opacidad
    opacidadSlider.addEventListener('input', function() {
      configGlobal.opacidadAtenuados = parseFloat(this.value);
      opacidadValue.textContent = configGlobal.opacidadAtenuados;
      guardarConfiguracion();
      resaltarYAtenuar();
    });

    // Actualizar botón principal
    actualizarBotonPrincipal();
  }

  // FUNCIÓN PARA MOSTRAR MENSAJE TEMPORAL
  function mostrarMensajeTemporal(texto, color) {
    const mensaje = document.createElement('div');
    mensaje.textContent = texto;
    mensaje.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${color};
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      z-index: 9999;
      font-size: 12px;
      animation: fadeInOut 3s ease;
    `;

    // Añadir estilo para la animación
    if (!document.getElementById('feedbackStyles')) {
      const style = document.createElement('style');
      style.id = 'feedbackStyles';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(mensaje);
    setTimeout(() => mensaje.remove(), 3000);
  }

  // FUNCIONES AUXILIARES
  function crearTab(texto, activa) {
    const tab = document.createElement('button');
    tab.textContent = texto;
    tab.style.cssText = `
      flex: 1;
      padding: 10px;
      background: ${activa ? '#444' : '#2a2a2a'};
      border: none;
      color: white;
      cursor: pointer;
      border-radius: 6px 6px 0 0;
      font-size: 12px;
      transition: background 0.3s;
    `;
    return tab;
  }

  function cambiarPestana(tabActiva, tab1, tab2, tipoContenido) {
    // Actualizar estilos de pestañas
    tabActiva.style.background = '#444';
    tab1.style.background = '#2a2a2a';
    tab2.style.background = '#2a2a2a';

    // Actualizar contenido
    const contenido = document.getElementById('contenidoPestanas');
    contenido.innerHTML = '';

    switch (tipoContenido) {
      case 'calidades':
        contenido.appendChild(crearContenidoCalidades());
        break;
      case 'resoluciones':
        contenido.appendChild(crearContenidoResoluciones());
        break;
      case 'instrucciones':
        contenido.appendChild(crearContenidoInstrucciones());
        break;
    }
  }

  function crearContenidoResoluciones() {
    const container = document.createElement('div');

    const titulo = document.createElement('h4');
    titulo.textContent = 'Orden de Resolución (usa flechas para cambiar prioridad)';
    titulo.style.cssText = `
      margin: 0 0 15px 0;
      font-size: 14px;
      color: #fff;
    `;

    const descripcion = document.createElement('p');
    descripcion.innerHTML = '<strong>MÁXIMA PRIORIDAD:</strong> Primero se selecciona por resolución, luego por calidad.';
    descripcion.style.cssText = `
      margin: 0 0 15px 0;
      font-size: 12px;
      color: #aaa;
      background: #2a2a2a;
      padding: 10px;
      border-radius: 6px;
      border-left: 4px solid #4aa304;
    `;

    const lista = document.createElement('div');
    lista.id = 'listaResoluciones';
    lista.style.cssText = `
      max-height: 250px;
      overflow-y: auto;
      margin-bottom: 15px;
    `;

    // Crear contenedor para los items
    configGlobal.ordenResoluciones.forEach((claveRes, index) => {
      const resolucion = gruposResolucion.find(r => r.clave === claveRes);
      if (!resolucion) return;

      const item = crearItemResolucion(resolucion, index);
      lista.appendChild(item);
    });

    container.appendChild(titulo);
    container.appendChild(descripcion);
    container.appendChild(lista);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔄 Reiniciar orden';
    resetBtn.style.cssText = `
      width: 100%;
      padding: 10px;
      background: #555;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      margin-top: 10px;
    `;

    resetBtn.addEventListener('click', () => {
      configGlobal.ordenResoluciones = gruposResolucion.map(r => r.clave);
      guardarConfiguracion();
      actualizarListaResoluciones();
      resaltarYAtenuar();
    });

    container.appendChild(resetBtn);

    return container;
  }

  function crearItemResolucion(resolucion, index) {
    const item = document.createElement('div');
    item.dataset.resolucion = resolucion.clave;
    item.style.cssText = `
      display: flex;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      background: #2a2a2a;
      border: 1px solid #555;
      border-radius: 8px;
      user-select: none;
      transition: all 0.2s ease;
    `;

    // Número de posición
    const numero = document.createElement('div');
    numero.textContent = index + 1;
    numero.style.cssText = `
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #444;
      color: white;
      border-radius: 50%;
      font-weight: bold;
      font-size: 13px;
      margin-right: 12px;
      flex-shrink: 0;
    `;

    // Contenedor de información
    const infoContainer = document.createElement('div');
    infoContainer.style.cssText = `
      flex: 1;
      min-width: 0;
    `;

    const nombre = document.createElement('div');
    nombre.textContent = resolucion.nombre;
    nombre.style.cssText = `
      color: white;
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 4px;
    `;

    const desc = document.createElement('div');
    desc.textContent = resolucion.descripcion;
    desc.style.cssText = `
      font-size: 11px;
      color: #888;
    `;

    infoContainer.appendChild(nombre);
    infoContainer.appendChild(desc);

    // Contenedor de flechas
    const flechasContainer = document.createElement('div');
    flechasContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-left: 10px;
      flex-shrink: 0;
    `;

    // Flecha arriba (solo mostrar si no es el primero)
    if (index > 0) {
      const flechaArriba = document.createElement('button');
      flechaArriba.innerHTML = '↑';
      flechaArriba.title = 'Subir prioridad';
      flechaArriba.style.cssText = `
        width: 30px;
        height: 25px;
        background: #444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      `;

      flechaArriba.addEventListener('mouseenter', () => {
        flechaArriba.style.background = '#555';
      });

      flechaArriba.addEventListener('mouseleave', () => {
        flechaArriba.style.background = '#444';
      });

      flechaArriba.addEventListener('click', (e) => {
        e.stopPropagation();
        moverResolucionArriba(resolucion.clave);
      });

      flechasContainer.appendChild(flechaArriba);
    } else {
      // Espaciador para mantener alineación
      const espaciador = document.createElement('div');
      espaciador.style.cssText = 'width: 30px; height: 25px;';
      flechasContainer.appendChild(espaciador);
    }

    // Flecha abajo (solo mostrar si no es el último)
    if (index < configGlobal.ordenResoluciones.length - 1) {
      const flechaAbajo = document.createElement('button');
      flechaAbajo.innerHTML = '↓';
      flechaAbajo.title = 'Bajar prioridad';
      flechaAbajo.style.cssText = `
        width: 30px;
        height: 25px;
        background: #444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      `;

      flechaAbajo.addEventListener('mouseenter', () => {
        flechaAbajo.style.background = '#555';
      });

      flechaAbajo.addEventListener('mouseleave', () => {
        flechaAbajo.style.background = '#444';
      });

      flechaAbajo.addEventListener('click', (e) => {
        e.stopPropagation();
        moverResolucionAbajo(resolucion.clave);
      });

      flechasContainer.appendChild(flechaAbajo);
    } else {
      // Espaciador para mantener alineación
      const espaciador = document.createElement('div');
      espaciador.style.cssText = 'width: 30px; height: 25px;';
      flechasContainer.appendChild(espaciador);
    }

    item.appendChild(numero);
    item.appendChild(infoContainer);
    item.appendChild(flechasContainer);

    return item;
  }

  function crearContenidoCalidades() {
    const container = document.createElement('div');

    const titulo = document.createElement('h4');
    titulo.textContent = 'Orden de Calidad (usa flechas para cambiar prioridad)';
    titulo.style.cssText = `
      margin: 0 0 15px 0;
      font-size: 14px;
      color: #fff;
    `;

    const descripcion = document.createElement('p');
    descripcion.innerHTML = '<strong>SEGUNDA PRIORIDAD:</strong> Dentro de cada resolución, se ordena por calidad.';
    descripcion.style.cssText = `
      margin: 0 0 15px 0;
      font-size: 12px;
      color: #aaa;
      background: #2a2a2a;
      padding: 10px;
      border-radius: 6px;
      border-left: 4px solid #a574e3;
    `;

    const lista = document.createElement('div');
    lista.id = 'listaCalidades';
    lista.style.cssText = `
      max-height: 250px;
      overflow-y: auto;
      margin-bottom: 15px;
    `;

    // Crear contenedor para los items
    configGlobal.ordenCalidades.forEach((claveGrupo, index) => {
      const grupo = gruposCalidad.find(g => g.clave === claveGrupo);
      if (!grupo) return;

      const item = crearItemCalidad(grupo, index);
      lista.appendChild(item);
    });

    container.appendChild(titulo);
    container.appendChild(descripcion);
    container.appendChild(lista);

    // Botón de reiniciar
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔄 Reiniciar orden';
    resetBtn.style.cssText = `
      width: 100%;
      padding: 10px;
      background: #555;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      margin-top: 10px;
    `;

    resetBtn.addEventListener('click', () => {
      configGlobal.ordenCalidades = gruposCalidad.map(g => g.clave);
      guardarConfiguracion();
      actualizarListaCalidades();
      resaltarYAtenuar();
    });

    container.appendChild(resetBtn);

    return container;
  }

  function crearItemCalidad(grupo, index) {
    const item = document.createElement('div');
    item.dataset.grupo = grupo.clave;
    item.style.cssText = `
      display: flex;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      background: #2a2a2a;
      border: 1px solid #555;
      border-radius: 8px;
      user-select: none;
      transition: all 0.2s ease;
    `;

    // Número de posición
    const numero = document.createElement('div');
    numero.textContent = index + 1;
    numero.style.cssText = `
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #444;
      color: white;
      border-radius: 50%;
      font-weight: bold;
      font-size: 13px;
      margin-right: 12px;
      flex-shrink: 0;
    `;

    // Contenedor de información
    const infoContainer = document.createElement('div');
    infoContainer.style.cssText = `
      flex: 1;
      min-width: 0;
    `;

    const nombre = document.createElement('div');
    nombre.textContent = grupo.nombre;
    nombre.style.cssText = `
      color: ${grupo.color};
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 4px;
    `;

    const desc = document.createElement('div');
    desc.textContent = grupo.descripcion;
    desc.style.cssText = `
      font-size: 11px;
      color: #888;
    `;

    infoContainer.appendChild(nombre);
    infoContainer.appendChild(desc);

    // Contenedor de flechas
    const flechasContainer = document.createElement('div');
    flechasContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-left: 10px;
      flex-shrink: 0;
    `;

    // Flecha arriba (solo mostrar si no es el primero)
    if (index > 0) {
      const flechaArriba = document.createElement('button');
      flechaArriba.innerHTML = '↑';
      flechaArriba.title = 'Subir prioridad';
      flechaArriba.style.cssText = `
        width: 30px;
        height: 25px;
        background: #444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      `;

      flechaArriba.addEventListener('mouseenter', () => {
        flechaArriba.style.background = '#555';
      });

      flechaArriba.addEventListener('mouseleave', () => {
        flechaArriba.style.background = '#444';
      });

      flechaArriba.addEventListener('click', (e) => {
        e.stopPropagation();
        moverCalidadArriba(grupo.clave);
      });

      flechasContainer.appendChild(flechaArriba);
    } else {
      // Espaciador para mantener alineación
      const espaciador = document.createElement('div');
      espaciador.style.cssText = 'width: 30px; height: 25px;';
      flechasContainer.appendChild(espaciador);
    }

    // Flecha abajo (solo mostrar si no es el último)
    if (index < configGlobal.ordenCalidades.length - 1) {
      const flechaAbajo = document.createElement('button');
      flechaAbajo.innerHTML = '↓';
      flechaAbajo.title = 'Bajar prioridad';
      flechaAbajo.style.cssText = `
        width: 30px;
        height: 25px;
        background: #444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      `;

      flechaAbajo.addEventListener('mouseenter', () => {
        flechaAbajo.style.background = '#555';
      });

      flechaAbajo.addEventListener('mouseleave', () => {
        flechaAbajo.style.background = '#444';
      });

      flechaAbajo.addEventListener('click', (e) => {
        e.stopPropagation();
        moverCalidadAbajo(grupo.clave);
      });

      flechasContainer.appendChild(flechaAbajo);
    } else {
      // Espaciador para mantener alineación
      const espaciador = document.createElement('div');
      espaciador.style.cssText = 'width: 30px; height: 25px;';
      flechasContainer.appendChild(espaciador);
    }

    item.appendChild(numero);
    item.appendChild(infoContainer);
    item.appendChild(flechasContainer);

    return item;
  }

  function crearContenidoInstrucciones() {
    const container = document.createElement('div');

    const titulo = document.createElement('h4');
    titulo.textContent = 'Instrucciones de Uso';
    titulo.style.cssText = `
      margin: 0 0 15px 0;
      font-size: 14px;
      color: #fff;
    `;

    // Instrucciones generales
    const instrucciones = document.createElement('div');
    instrucciones.style.cssText = `
      background: #2a2a2a;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      border-left: 4px solid #667eea;
      font-size: 12px;
      line-height: 1.5;
    `;

    instrucciones.innerHTML = `
      <p style="margin: 0 0 10px 0;"><strong>🎯 ¿Cómo funciona?</strong></p>
      <ul style="margin: 0 0 10px 0; padding-left: 20px;">
        <li>El sistema filtra en dos capas: <strong>Resolución</strong> → <strong>Calidad</strong></li>
        <li>Primero busca la mejor resolución según tu orden configurado</li>
        <li>Dentro de esa resolución, selecciona la mejor calidad</li>
      </ul>

      <p style="margin: 0 0 10px 0;"><strong>⬆️⬇️ Cómo usar las flechas:</strong></p>
      <ul style="margin: 0 0 10px 0; padding-left: 20px;">
        <li>Usa las flechas <strong>↑</strong> y <strong>↓</strong> para cambiar el orden de prioridad</li>
        <li>Las flechas solo aparecen cuando el movimiento es posible</li>
        <li>El número indica la posición actual (1 = máxima prioridad)</li>
      </ul>

      <p style="margin: 0 0 10px 0;"><strong>⚙️ Configuración básica:</strong></p>
      <ul style="margin: 0 0 10px 0; padding-left: 20px;">
        <li><strong>Resoluciones:</strong> Ordena de mayor a menor prioridad</li>
        <li><strong>Calidades:</strong> Define qué tipo de fuente prefieres dentro de cada resolución</li>
        <li><strong>SDR > HDR:</strong> Prioriza versiones con <strong>"SDR" en el nombre</strong> sobre HDR</li>
        <li><strong>Ver Todo:</strong> Muestra todas las opciones sin atenuar para comparar</li>
      </ul>

      <p style="margin: 0 0 10px 0;"><strong>🎨 Comportamiento de SDR > HDR:</strong></p>
      <ul style="margin: 0 0 10px 0; padding-left: 20px;">
        <li>La opción <strong>SDR > HDR</strong> solo afecta a versiones con <strong>"SDR" explícito en el nombre</strong></li>
        <li>Ejemplo: "WEB-DL 1080p SDR" tendrá prioridad sobre "WEB-DL 1080p HDR10"</li>
        <li>Las versiones sin etiqueta (ej: "WEB-DL 1080p") no tendrán prioridad sobre HDR</li>
        <li><strong>Útil para:</strong> Hardware que no soporta bien HDR o cuando prefieres versiones SDR explícitas</li>
      </ul>

      <p style="margin: 0; font-size: 11px; color: #aaa; border-top: 1px solid #444; padding-top: 10px;">
        <strong>💡 Consejo:</strong> Configura primero las resoluciones (4K, 1080p, etc.) y luego las calidades dentro de cada una.
        Usa "SDR > HDR" solo si tu equipo tiene problemas con contenido HDR.
      </p>
    `;

    container.appendChild(titulo);
    container.appendChild(instrucciones);

    return container;
  }

  // FUNCIONES PARA MOVER ELEMENTOS CON FLECHAS
  function moverResolucionArriba(claveRes) {
    const index = configGlobal.ordenResoluciones.indexOf(claveRes);
    if (index > 0) {
      // Intercambiar con el elemento anterior
      [configGlobal.ordenResoluciones[index - 1], configGlobal.ordenResoluciones[index]] =
      [configGlobal.ordenResoluciones[index], configGlobal.ordenResoluciones[index - 1]];

      guardarConfiguracion();
      actualizarListaResoluciones();
      resaltarYAtenuar();
    }
  }

  function moverResolucionAbajo(claveRes) {
    const index = configGlobal.ordenResoluciones.indexOf(claveRes);
    if (index < configGlobal.ordenResoluciones.length - 1) {
      // Intercambiar con el elemento siguiente
      [configGlobal.ordenResoluciones[index], configGlobal.ordenResoluciones[index + 1]] =
      [configGlobal.ordenResoluciones[index + 1], configGlobal.ordenResoluciones[index]];

      guardarConfiguracion();
      actualizarListaResoluciones();
      resaltarYAtenuar();
    }
  }

  function moverCalidadArriba(claveGrupo) {
    const index = configGlobal.ordenCalidades.indexOf(claveGrupo);
    if (index > 0) {
      // Intercambiar con el elemento anterior
      [configGlobal.ordenCalidades[index - 1], configGlobal.ordenCalidades[index]] =
      [configGlobal.ordenCalidades[index], configGlobal.ordenCalidades[index - 1]];

      guardarConfiguracion();
      actualizarListaCalidades();
      resaltarYAtenuar();
    }
  }

  function moverCalidadAbajo(claveGrupo) {
    const index = configGlobal.ordenCalidades.indexOf(claveGrupo);
    if (index < configGlobal.ordenCalidades.length - 1) {
      // Intercambiar con el elemento siguiente
      [configGlobal.ordenCalidades[index], configGlobal.ordenCalidades[index + 1]] =
      [configGlobal.ordenCalidades[index + 1], configGlobal.ordenCalidades[index]];

      guardarConfiguracion();
      actualizarListaCalidades();
      resaltarYAtenuar();
    }
  }

  function actualizarListaResoluciones() {
    const lista = document.getElementById('listaResoluciones');
    if (!lista) return;

    // Limpiar la lista
    lista.innerHTML = '';

    // Recrear los items
    configGlobal.ordenResoluciones.forEach((claveRes, index) => {
      const resolucion = gruposResolucion.find(r => r.clave === claveRes);
      if (!resolucion) return;

      const item = crearItemResolucion(resolucion, index);
      lista.appendChild(item);
    });
  }

  function actualizarListaCalidades() {
    const lista = document.getElementById('listaCalidades');
    if (!lista) return;

    // Limpiar la lista
    lista.innerHTML = '';

    // Recrear los items
    configGlobal.ordenCalidades.forEach((claveGrupo, index) => {
      const grupo = gruposCalidad.find(g => g.clave === claveGrupo);
      if (!grupo) return;

      const item = crearItemCalidad(grupo, index);
      lista.appendChild(item);
    });
  }

  function cargarConfiguracion() {
    const guardada = localStorage.getItem(STORAGE_KEY);
    if (guardada) {
      configGlobal = JSON.parse(guardada);
    }
  }

  function guardarConfiguracion() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configGlobal));
  }

  function actualizarBotonPrincipal() {
    const boton = document.getElementById('botonFiltroPrincipal');
    if (!boton) return;

    if (configGlobal.modoVerTodo) {
      boton.textContent = '👁️ Ver Todo';
      boton.style.background = 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)';
    } else {
      boton.textContent = '🎬 Filtrar Resoluciones';
      boton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  // FUNCIÓN DE FILTRADO PRINCIPAL
  function resaltarYAtenuar() {
    if (configGlobal.modoVerTodo) {
      // Modo "Ver Todo": Mostrar todo sin atenuar
      const items = document.querySelectorAll('.pt-cv-ifield');
      items.forEach(item => {
        const enlace = item.querySelector('.pt-cv-title a');
        if (!enlace) return;

        const texto = enlace.textContent;
        let textoResaltado = texto;

        // Resaltar todas las coincidencias
        resoluciones.forEach(regla => {
          if (regla.regex.test(texto)) {
            const grupo = gruposCalidad.find(g => g.clave === regla.grupo);
            const color = grupo ? grupo.color : '#FFFFFF';
            textoResaltado = textoResaltado.replace(regla.regex, match =>
              `<span style="color: ${color}; font-weight: bold;">${match}</span>`
            );
          }
        });

        enlace.innerHTML = textoResaltado;
        item.style.opacity = '1';
        item.style.transition = 'opacity 0.3s ease';
      });
      return;
    }

    // Modo normal con filtrado
    const items = Array.from(document.querySelectorAll('.pt-cv-ifield'));
    const grupos = new Map();

    // Agrupar por título base
    items.forEach(item => {
      const enlace = item.querySelector('.pt-cv-title a');
      if (!enlace) return;

      const texto = enlace.textContent;
      const coincidencias = resoluciones
        .map((regla, idx) => ({ regla, idx }))
        .filter(({ regla }) => regla.regex.test(texto));

      const tituloBase = limpiarTituloBase(texto);
      if (!grupos.has(tituloBase)) grupos.set(tituloBase, []);
      grupos.get(tituloBase).push({ item, enlace, texto, coincidencias });
    });

    // Procesar cada grupo
    grupos.forEach(lista => {
      const mejorCoincidencia = obtenerMejorCoincidencia(lista);

      lista.forEach(({ item, enlace, texto, coincidencias }) => {
        const coincide = coincidencias.find(c => c.idx === mejorCoincidencia?.idx);

        if (coincide) {
          const grupo = gruposCalidad.find(g => g.clave === coincide.regla.grupo);
          const color = grupo ? grupo.color : '#FFFFFF';
          const resaltado = texto.replace(coincide.regla.regex, match =>
            `<span style="color: ${color}; font-weight: bold;">${match}</span>`
          );
          enlace.innerHTML = resaltado;
          item.style.opacity = '1';
        } else {
          enlace.innerHTML = texto;
          item.style.opacity = configGlobal.opacidadAtenuados;
        }
        item.style.transition = 'opacity 0.3s ease';
      });
    });
  }

  function obtenerMejorCoincidencia(lista) {
    // Obtener todas las coincidencias
    let coincidenciasFiltradas = lista.flatMap(({ coincidencias }) => coincidencias);

    if (coincidenciasFiltradas.length === 0) {
      return null;
    }

    // ORDEN CORREGIDO
    coincidenciasFiltradas.sort((a, b) => {
      // 1. PRIORIDAD POR RESOLUCIÓN (máxima prioridad)
      const resPrioridadA = configGlobal.ordenResoluciones.indexOf(a.regla.resolucion);
      const resPrioridadB = configGlobal.ordenResoluciones.indexOf(b.regla.resolucion);

      if (resPrioridadA !== resPrioridadB) {
        return resPrioridadA - resPrioridadB;
      }

      // 2. MISMA RESOLUCIÓN → PRIORIDAD POR CALIDAD
      const calidadPrioridadA = configGlobal.ordenCalidades.indexOf(a.regla.grupo);
      const calidadPrioridadB = configGlobal.ordenCalidades.indexOf(b.regla.grupo);

      if (calidadPrioridadA !== calidadPrioridadB) {
        return calidadPrioridadA - calidadPrioridadB;
      }

      // 3. MISMA RESOLUCIÓN Y CALIDAD → Opción "Priorizar SDR sobre HDR"
      // SOLO APLICA A VERSIONES SDR EXPLÍCITAS vs HDR
      if (configGlobal.priorizarSDR) {
        // Solo priorizamos SDR EXPLÍCITO sobre HDR
        if (a.regla.esSDRExplicito && b.regla.esHDR) return -1;  // a (SDR explícito) va primero sobre b (HDR)
        if (a.regla.esHDR && b.regla.esSDRExplicito) return 1;   // b (SDR explícito) va primero sobre a (HDR)

        // Si ambos son HDR o ninguno es SDR explícito, continuamos con lógica normal
      } else {
        // Por defecto: HDR tiene prioridad sobre SDR
        if (a.regla.esHDR && !b.regla.esHDR) return -1; // a es HDR, b no es HDR → a primero
        if (!a.regla.esHDR && b.regla.esHDR) return 1;  // a no es HDR, b es HDR → b primero
      }

      // 4. MISMA RESOLUCIÓN, CALIDAD Y MISMO TIPO HDR/SDR → Priorizar por tipo específico dentro del grupo
      if (a.regla.grupo === b.regla.grupo && a.regla.resolucion === b.regla.resolucion) {
        const grupoPrioridades = prioridadesEspecificas[a.regla.grupo];
        if (grupoPrioridades) {
          const resolucionesPrioridades = grupoPrioridades[a.regla.resolucion];
          if (resolucionesPrioridades) {
            const prioridadEspecificaA = resolucionesPrioridades.indexOf(a.regla.clave);
            const prioridadEspecificaB = resolucionesPrioridades.indexOf(b.regla.clave);

            // Si ambas tienen prioridad definida, ordenar por ella
            if (prioridadEspecificaA !== -1 && prioridadEspecificaB !== -1) {
              return prioridadEspecificaA - prioridadEspecificaB;
            }
            // Si solo una tiene prioridad definida, esa va primero
            if (prioridadEspecificaA !== -1 && prioridadEspecificaB === -1) return -1;
            if (prioridadEspecificaA === -1 && prioridadEspecificaB !== -1) return 1;
          }
        }
      }

      // 5. Si todo lo demás es igual, dar prioridad a la coincidencia MÁS ESPECÍFICA
      const regexLengthA = a.regla.regex.toString().length;
      const regexLengthB = b.regla.regex.toString().length;

      if (regexLengthA !== regexLengthB) {
        return regexLengthB - regexLengthA; // Más larga (más específica) primero
      }

      return 0;
    });

    return coincidenciasFiltradas[0];
  }

  function limpiarTituloBase(titulo) {
    let tituloLimpio = titulo.toLowerCase();

    let indices = [];
    for (const { regex } of resoluciones) {
      const match = tituloLimpio.match(regex);
      if (match && match.index !== undefined) {
        indices.push(match.index);
      }
    }

    let corte = tituloLimpio.length;
    if (indices.length > 0) {
      corte = Math.min(...indices);
    }

    tituloLimpio = tituloLimpio.slice(0, corte);
    tituloLimpio = tituloLimpio.replace(/\[[^\]]*\]/g, '');
    tituloLimpio = tituloLimpio.replace(/[-–—]/g, ' ');
    tituloLimpio = tituloLimpio.replace(/[.,:;'"!?¡¿]/g, '');
    tituloLimpio = tituloLimpio.replace(/\s+/g, ' ');
    tituloLimpio = tituloLimpio.trim();

    return tituloLimpio;
  }

  // INICIALIZACIÓN
  function init() {
    insertarInterfazMejorada();
    resaltarYAtenuar();

    // Actualizar periódicamente
    setInterval(() => {
      resaltarYAtenuar();
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();