// ==UserScript==
// @name         WME PLN Module - Stats Handler
// @version      9.0.0
// @description  Módulo de estadísticas para WME Place Normalizer. No funciona por sí solo.
// @author       mincho77
// @license      MIT
// @grant        none
// ==/UserScript==
// Clave para almacenar las estadísticas en localStorage
const STATS_STORAGE_KEY = (window.PLN_META ? `WME_PLN_stats_${window.PLN_META.version}` : 'WME_PLN_stats');
let statsPanelElement = null;
// Crea el panel de estadísticas flotante en la interfaz de usuario.
function createStatsPanel()
{
    // Evitar crear múltiples paneles
    if (document.getElementById('wme-pln-stats-panel')) return;
    // Contenedor principal del panel
    statsPanelElement = document.createElement('div');
    statsPanelElement.id = 'wme-pln-stats-panel';
    statsPanelElement.setAttribute('role', 'region');
    statsPanelElement.setAttribute('aria-label', 'NrmliZer Stats');
    plnLog('ui', '[stats] Panel de estadísticas creado');
    Object.assign(statsPanelElement.style, 
    {
        position: 'fixed',
        bottom: '60px',
        left: '23%', // <-- Ancla el panel a 20px del borde izquierdo
        // Se elimina la propiedad 'transform' que ya no es necesaria
        backgroundColor: 'rgba(45, 45, 45, 0.9)',
        color: 'white',
        padding: '5px 12px',
        borderRadius: '15px',
        fontSize: '13px',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        zIndex: '10000',
        cursor: 'pointer',
        display: 'none', // Oculto inicialmente
        border: '1px solid #555',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        userSelect: 'none',
        whiteSpace: 'nowrap'
    });
    // Vista de resumen (la que siempre está visible)
    const summaryView = document.createElement('div');
    summaryView.id = 'stats-summary-view';
    Object.assign(summaryView.style, 
        {
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    });
    // Texto resumen
    const summaryText = document.createElement('span');
    summaryText.id = 'stats-summary-text';
    summaryText.textContent = '📊 0 NrmliZer Stats';
    // Flecha desplegable
    const dropdownArrow = document.createElement('span');
    dropdownArrow.id = 'stats-arrow';
    dropdownArrow.textContent = '▼';
    dropdownArrow.style.fontSize = '10px';
    // Ensamblar la vista de resumen
    summaryView.appendChild(summaryText);
    summaryView.appendChild(dropdownArrow);
    // Vista detallada (la que se expande)
    const detailView = document.createElement('div');
    detailView.id = 'stats-detail-view';
    Object.assign(detailView.style, {
        display: 'none',
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid #666'
    });
    // Lista de estadísticas
    const list = document.createElement('ul');
    Object.assign(list.style, {
        margin: '0',
        padding: '0',
        listStyle: 'none',
        textAlign: 'left'
    });
    // Crear elementos de la lista
    const items = {
        'Hoy': 'stats-count-today',
        'Esta Semana': 'stats-count-week',
        'Este Mes': 'stats-count-month',
        'Total': 'stats-count-total'
    };
    // Recorre los items para crear cada entrada en la lista
    for (const [label, id] of Object.entries(items)) 
    {
        const listItem = document.createElement('li');
        listItem.style.marginBottom = '4px';
        // Etiqueta y contador
        const countBold = document.createElement('b');
        countBold.id = id;
        countBold.textContent = '0';
        // Ensamblar el item
        listItem.append(`${label}: `, countBold);
        list.appendChild(listItem);
    }
    detailView.appendChild(list);
    // Ensamblar el panel
    statsPanelElement.appendChild(summaryView);
    statsPanelElement.appendChild(detailView);
    document.body.appendChild(statsPanelElement);
    // Lógica para desplegar/contraer
    statsPanelElement.addEventListener('click', () => {
        const isHidden = detailView.style.display === 'none';
        detailView.style.display = isHidden ? 'block' : 'none';
        dropdownArrow.textContent = isHidden ? '▲' : '▼';
    });
    // Lógica para cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!statsPanelElement.contains(e.target)) 
        {
            detailView.style.display = 'none';
            dropdownArrow.textContent = '▼';
        }
    }, true);
    // Mostrar el panel
    if (typeof window.toggleStatsPanelVisibility === 'function') {
        window.toggleStatsPanelVisibility();
    } else {
        statsPanelElement.style.display = 'block';
    }
}// createStatsPanel

// Muestra los contadores en el panel flotante
function updateStatsDisplay()
{
    // Asegura que el panel y la info del usuario estén disponibles
    if (!statsPanelElement || !window.currentGlobalUserInfo || !window.currentGlobalUserInfo.id) return;
    const userId = String(window.currentGlobalUserInfo.id);
    // Obtiene los datos guardados o valores por defecto si no existen
    const stats = (window.editorStats && window.editorStats[userId]) || 
    {
        daily_count: 0,
        weekly_count: 0,
        monthly_count: 0,
        total_count: 0
    };
    // Actualiza los elementos de la UI con los valores guardados
    const summaryText = statsPanelElement.querySelector('#stats-summary-text');
    const todayCountSpan = statsPanelElement.querySelector('#stats-count-today');
    const weekCountSpan = statsPanelElement.querySelector('#stats-count-week');
    const monthCountSpan = statsPanelElement.querySelector('#stats-count-month');
    const totalCountSpan = statsPanelElement.querySelector('#stats-count-total');
    // Actualiza los textos
    if (summaryText) summaryText.textContent = `📊 ${stats.daily_count || 0} Places NrmliZed`;
    if (todayCountSpan) todayCountSpan.textContent = stats.daily_count || 0;
    if (weekCountSpan) weekCountSpan.textContent = stats.weekly_count || 0;
    if (monthCountSpan) monthCountSpan.textContent = stats.monthly_count || 0;
    if (totalCountSpan) totalCountSpan.textContent = stats.total_count || 0;
    plnLog('ui', `[stats] Display actualizado: hoy=${stats.daily_count||0}, semana=${stats.weekly_count||0}, mes=${stats.monthly_count||0}, total=${stats.total_count||0}`);
}// updateStatsDisplay
// Carga las estadísticas desde localStorage
function loadEditorStats()
{
    // Intenta cargar las estadísticas guardadas
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    if (savedStats)
    {
        try
        {
            window.editorStats = JSON.parse(savedStats);
            if (typeof window.editorStats !== 'object' || window.editorStats === null)
            {
                window.editorStats = {};
            }
        }
        catch (e)
        {
            plnLog('error','[WME PLN Stats] Error al parsear estadísticas desde localStorage:', e);
            window.editorStats = {};
        }
    }
    else
    {
        window.editorStats = {};
    }
}// loadEditorStats

// Guarda las estadísticas en localStorage
function saveEditorStats()
{
    try
    {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(window.editorStats || {}));
    }
    catch (e)
    {
        plnLog('error','[WME PLN Stats] Error al guardar estadísticas en localStorage:', e);
    }
}// Guarda una acción de normalización para el usuario actual

// Registra una edición y actualiza los contadores
function recordNormalizationEvent()
{
    const user = window.currentGlobalUserInfo || {};
    const userId = user.id;
    const userName = user.name;

    if (!userId || userId === 0 || userName === 'No detectado')
    {
        plnLog('warn','[stats] No se registró evento: usuario no detectado.');
        return;
    }
    // Obtiene las estadísticas del usuario o las inicializa si no existen
    window.editorStats = window.editorStats || {};
    const userKey = String(userId);
    let userStats = window.editorStats[userKey];
    if (!userStats)
    {
        userStats = 
        {
            userName: userName,
            total_count: 0,
            monthly_count: 0,
            monthly_period: "N/A",
            weekly_count: 0,
            weekly_period: "N/A",
            daily_count: 0,
            daily_period: "N/A",
            last_update: 0
        };
        window.editorStats[userKey] = userStats;
    }
    // Obtiene los periodos de tiempo actuales
    const todayStr = PLNCore.utils.getCurrentDateString();
    const weekStr = PLNCore.utils.getCurrentISOWeekString();
    const monthStr = PLNCore.utils.getCurrentMonthString();
    // --- Lógica de reseteo de contadores ---
    // Si la fecha guardada es diferente a la de hoy, resetea el contador diario.
    if (userStats.daily_period !== todayStr)
    {
        userStats.daily_count = 0;
        userStats.daily_period = todayStr;
    }
    // Si la semana guardada es diferente a la de hoy, resetea el contador semanal.
    if (userStats.weekly_period !== weekStr)
    {
        userStats.weekly_count = 0;
        userStats.weekly_period = weekStr;
    }
    // Si el mes guardado es diferente al de hoy, resetea el contador mensual.
    if (userStats.monthly_period !== monthStr)
    {
        userStats.monthly_count = 0;
        userStats.monthly_period = monthStr;
    }
    // --- Incrementar los contadores ---
    userStats.daily_count++;
    userStats.weekly_count++;
    userStats.monthly_count++;
    userStats.total_count++;
    userStats.last_update = Date.now();
    userStats.userName = userName; // Asegurarse de que el nombre esté actualizado
    // Guardar los nuevos datos y actualizar la pantalla
    saveEditorStats();
    updateStatsDisplay();
}// recordNormalizationEvent