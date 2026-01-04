// ==UserScript==
// @name         Asterisk Agents Panel
// @namespace    http://tampermonkey.net/
// @description  Красивая панель с информацией об агентах Asterisk (только указанные операторы)
// @author       You
// @match        https://45.157.212.2/admin/config.php?display=asteriskinfo*
// @match        https://freepbx.avanta-telecom.ru/admin/config.php?display=asteriskinfo*
// @grant        none
// @version 0.0.1.20251002075417
// @downloadURL https://update.greasyfork.org/scripts/551321/Asterisk%20Agents%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/551321/Asterisk%20Agents%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Список операторов для отслеживания
    const TRACKED_OPERATORS = {
        // Техническая поддержка: объединяем всех, для простоты отображения в очереди 1000
        '1000': [
            { name: 'robert.muradyan', extension: '305' },
            { name: 'vitaliy.marchenko', extension: '306' },
            { name: 'danil.ryabickiy', extension: '312' },
            { name: 'daniil.zhaglo', extension: '314' },
            { name: 'aleksandr.naydysh', extension: '316' },
            { name: 'mihail.sarkisyan', extension: '317' },
            { name: 'nikita.zdanovskiy', extension: '318' },
            { name: 'denis.denisenko', extension: '320' },
            { name: 'artur.gadylshin', extension: '321' },
            { name: 'roman.titarenko', extension: '322' },
            { name: 'ilya.butov', extension: '323' },
            { name: 'dmitriy.podmogilnyy', extension: '324' }
        ],
        // Дополнительная TP-очередь 1100 (оставляем существующих)
        '1100': [
            { name: 'aleksandr.myshlennikov', extension: '311' },
            { name: 'vladimir.chugunov', extension: '315' }
        ],
        // Абонентский отдел (очередь 1002)
        '1002': [
            { name: 'anna.kuharenko', extension: '401' },
            { name: 'Intern AO', extension: '402' },
            { name: 'iaroslava.druzhinina', extension: '405' },
            { name: 'kseniya.filippova', extension: '406' },
            { name: 'olesya.petrova', extension: '407' },
            { name: 'vera.nikulina', extension: '412' },
            { name: 'oksana.koichueva', extension: '429' },
            { name: 'ekaterina.leonova', extension: '423' },
            { name: 'tatyana.kalinichenko', extension: '424' },
            { name: '430', extension: '430' },
            { name: 'viktoriya.maslova', extension: '425' },
            { name: 'Archive', extension: '433' },
            { name: 'natalya.polynyankina', extension: '435' },
            { name: 'taschilina.marina', extension: '434' },
            { name: 'Smotreshka', extension: '495' },
            { name: 'olga.mokienko', extension: '436' },
            { name: 'nataliya.shorina', extension: '437' }
        ],
        // АО дополнительная очередь 1003
        '1003': [
            { name: 'elena.blednova', extension: '141' },
            { name: 'anastasiya.saraykina', extension: '408' }
        ],
        // Коммерческий отдел (KO): очереди 1001 и 1005
        '1001': [
            { name: 'aleksei.vlasenko', extension: '109' },
            { name: 'natalia.danilova', extension: '105' },
            { name: 'konstantin.antonov', extension: '104' },
            { name: 'alina.sergeeva', extension: '110' },
            { name: 'elizaveta.kuchabsky', extension: '130' },
            { name: 'elena.ukrainskaya', extension: '120' },
            { name: 'elena.alekseeva', extension: '101' }
        ],
        '1005': [
            { name: 'elena.blednova', extension: '141' },
            { name: 'stanislav.podolskiy', extension: '142' },
            { name: 'oksana.samoilova', extension: '108' },
            { name: 'konstantin.gavrilov', extension: '137' },
            { name: 'elvira.moiseevceva', extension: '135' },
            { name: 'elena.gavrilova', extension: '134' },
            { name: 'konstantin.zubchenko', extension: '116' },
            { name: 'nikolay.basov', extension: '112' }
        ],
        '1006': [
            { name: 'darya.zubchenko', extension: '139' },
            { name: 'nikolay.kalabuhov', extension: '138' },
            { name: 'yuriy.scherbina', extension: '115' }
        ]
    };

    // Константы/утилиты
    const REFRESH_INTERVAL_MS = 1000;
    const STATUS_ORDER = { 'ringing': 0, 'busy': 1, 'available': 2, 'paused': 3, 'unavailable': 4 };

    /** Возвращает css-класс и текст для RTT */
    function getPingMeta(rtt) {
        if (rtt === null || rtt === undefined) return { cssClass: '', text: '' };
        if (rtt < 50) return { cssClass: 'rtt-good', text: `${rtt}ms` };
        if (rtt < 150) return { cssClass: 'rtt-medium', text: `${rtt}ms` };
        return { cssClass: 'rtt-bad', text: `${rtt}ms` };
    }

    /** Возвращает HTML с информацией о звонке */
    function getCallInfo(agent) {
        if (!((agent.status === 'busy' || agent.status === 'ringing') && agent.callDuration)) return '';

        const isNumeric = (value) => /^\d+$/.test(value || '');
        const formatCaller = (num) => num ? (isNumeric(num) ? ` 📱 ${num}` : ` 👤 ${num}`) : '';

        let callType = 'Входящий';
        let callerInfo = '';

        // Сначала различаем дозвон (звонит/набор), затем уже активный разговор
        if (agent.isIncomingRinging) {
            callType = agent.isOutgoing ? 'Исходящий дозвон' : 'Входящий дозвон';
            callerInfo = formatCaller(agent.callerNumber) ? ` ${agent.isOutgoing ? '→' : ''}${formatCaller(agent.callerNumber)}` : '';
        } else {
            callType = agent.isOutgoing ? 'Исходящий' : 'Входящий';
            callerInfo = formatCaller(agent.callerNumber) ? ` ${agent.isOutgoing ? '→' : ''}${formatCaller(agent.callerNumber)}` : '';
        }

        return `<div class="call-info">${callType} ${agent.callDuration}${callerInfo}</div>`;
    }

    /** CSS класс оператора по состоянию присутствия в данных/очереди */
    function getOperatorClass(agent) {
        if (!agent.found) return 'operator-not-found';
        if (!agent.inQueue) return 'operator-not-in-queue';
        return '';
    }

    /** Сортировка агентов по заданным правилам */
function sortAgents(a, b) {
    const isAvailable = (s) => s === 'available' || s === 'paused';

    function getGroup(agent) {
        // 1. В разговоре
        if (agent.status === 'busy') return 1;
        // 2. Идёт дозвон
        if (agent.status === 'ringing') return 2;
        // 3-6. Свободен
        if (isAvailable(agent.status)) {
            if (agent.inQueue) {
                if ((agent.callsTaken || 0) > 0) return 3; // в очереди, есть звонки
                return 4; // в очереди, без звонков
            }
            if ((agent.callsTaken || 0) > 0) return 5; // вне очереди, есть звонки
            return 6; // вне очереди, без звонков
        }
        // 7-10. Недоступен
        if (agent.status === 'unavailable') {
            if (agent.inQueue) {
                if ((agent.callsTaken || 0) > 0) return 7; // в очереди, есть звонки
                return 8; // в очереди, без звонков
            }
            if ((agent.callsTaken || 0) > 0) return 9; // вне очереди, есть звонки
            return 10; // вне очереди, без звонков
        }
        return 99; // запасной вариант
    }

    const ga = getGroup(a);
    const gb = getGroup(b);
    if (ga !== gb) return ga - gb;

    // В группах с приоритетом по количеству звонков сортируем по убыванию callsTaken
    const groupsWithCallsDesc = new Set([3, 5, 7, 9]);
    if (groupsWithCallsDesc.has(ga)) {
        const ca = a.callsTaken || 0;
        const cb = b.callsTaken || 0;
        if (ca !== cb) return cb - ca;
    }

    // Запасные критерии: по статусу, затем по имени
    const statusDiff = (STATUS_ORDER[a.status] ?? 999) - (STATUS_ORDER[b.status] ?? 999);
    if (statusDiff !== 0) return statusDiff;
    return String(a.name || '').localeCompare(String(b.name || ''));
}

    // Стили для панели
    const styles = `
        /* Темы через CSS-переменные (скоуп только панели) */
        #agents-panel {
            --panel-gradient: linear-gradient(135deg, #2a2f45 0%, #3b2c4f 100%);
            --bg-surface: rgba(255,255,255,0.08);
            --bg-surface-2: rgba(255,255,255,0.10);
            --bg-hover: rgba(255,255,255,0.15);
            --text-color: #ffffff;
            --muted-text: rgba(255,255,255,0.75);
            --divider: rgba(255,255,255,0.2);
            --header-bg: rgba(255,255,255,0.08);
            --shadow: rgba(0,0,0,0.35);
            --primary: #2196F3;
            --success: #4CAF50;
            --warning: #FFC107;
            --danger: #F44336;
            --badge-bg: rgba(255,255,255,0.10);
            --scrollbar-track: rgba(255,255,255,0.10);
            --scrollbar-thumb: rgba(255,255,255,0.30);
            --call-info-bg: rgba(33,150,243,0.30);
            --call-info-border: rgba(33,150,243,0.50);
            --status-available: #4CAF50;
            --status-busy: #FF9800;
            --status-unavailable: #F44336;
            --status-paused: #9E9E9E;
            --status-ringing: #2196F3;
        }

        #agents-panel.theme-light {
            --panel-gradient: linear-gradient(135deg, #eef2f7 0%, #ffffff 100%);
            --bg-surface: rgba(0,0,0,0.04);
            --bg-surface-2: rgba(0,0,0,0.05);
            --bg-hover: rgba(0,0,0,0.07);
            --text-color: #1c1f2a;
            --muted-text: rgba(0,0,0,0.65);
            --divider: rgba(0,0,0,0.12);
            --header-bg: rgba(255,255,255,0.6);
            --shadow: rgba(0,0,0,0.15);
            --primary: #1976D2;
            --success: #2E7D32;
            --warning: #F9A825;
            --danger: #D32F2F;
            --badge-bg: rgba(0,0,0,0.06);
            --scrollbar-track: rgba(0,0,0,0.06);
            --scrollbar-thumb: rgba(0,0,0,0.20);
            --call-info-bg: rgba(25,118,210,0.12);
            --call-info-border: rgba(25,118,210,0.35);
            --status-available: #2E7D32;
            --status-busy: #F57C00;
            --status-unavailable: #D32F2F;
            --status-paused: #757575;
            --status-ringing: #1976D2;
        }

        #agents-panel {
            position: fixed;
            top: 0;
            right: 0;
            width: 600px;
            height: 100vh;
            background: var(--panel-gradient);
            border-radius: 0;
            box-shadow: -5px 0 20px var(--shadow);
            color: var(--text-color);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            z-index: 10000;
            overflow: hidden;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            transition: background 300ms ease, color 300ms ease, box-shadow 300ms ease;
            display: flex;
            flex-direction: column;
        }

        #agents-panel-header {
            background: var(--header-bg);
            padding: 20px 25px;
            border-bottom: 2px solid var(--divider);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        }

        #agents-panel-header .header-right {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        #agents-panel-title {
            font-size: 22px;
            font-weight: 600;
            margin: 0;
        }

        #agents-panel-minimize, #agents-panel-theme, #agents-panel-fullscreen, .filter-btn {
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 24px;
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            transition: background 0.3s;
        }

        #agents-panel-minimize:hover, #agents-panel-theme:hover, #agents-panel-fullscreen:hover, .filter-btn:hover {
            background: var(--bg-hover);
        }

        #agents-panel-minimize:active, #agents-panel-theme:active, #agents-panel-fullscreen:active, .filter-btn:active {
            transform: translateY(1px);
        }

        /* Фильтр ТП/АО */
        #agents-filter {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-right: 8px;
        }
        .filter-btn {
            font-size: 14px;
            padding: 6px 10px;
            border: 1px solid var(--divider);
            background: var(--bg-surface-2);
        }
        .filter-btn.active {
            background: var(--primary);
            border-color: var(--primary);
        }

        #agents-panel-content {
            padding: 20px;
            overflow-y: auto;
            flex: 1 1 auto;
        }

        /* Компактные стили и сетка в полноэкранном режиме */
        #agents-panel.fullscreen #agents-panel-content {
            padding: 12px 16px 8px;
        }

        /* Убираем нижний зазор в конце списка */
        #agents-panel-content > .queue-info:last-child {
            margin-bottom: 0;
        }

        /* Компактная шапка в полноэкранном режиме */
        #agents-panel.fullscreen #agents-panel-header {
            padding: 12px 16px;
        }

        #agents-panel.fullscreen #agents-panel-title {
            font-size: 18px;
        }

        #agents-panel.fullscreen .queue-info {
            padding: 18px;
            margin-bottom: 14px;
        }

        #agents-panel.fullscreen .queue-title {
            font-size: 18px;
            margin-bottom: 12px;
        }

        #agents-panel.fullscreen .queue-stats {
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 10px;
        }

        #agents-panel.fullscreen .stat-item {
            padding: 10px;
        }

        #agents-panel.fullscreen .stat-label {
            font-size: 12px;
            margin-bottom: 3px;
        }

        #agents-panel.fullscreen .stat-value {
            font-size: 16px;
        }

        #agents-panel.fullscreen .agents-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
        }

        @media (min-width: 1400px) {
            #agents-panel.fullscreen .agents-list {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }

        @media (min-width: 1800px) {
            #agents-panel.fullscreen .agents-list {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }
        }

        #agents-panel.fullscreen .agent-item {
            margin-bottom: 0;
            padding: 16px;
            min-height: 0;
        }

        #agents-panel.fullscreen .agent-name {
            font-size: 16px;
            margin-bottom: 3px;
        }

        #agents-panel.fullscreen .agent-status {
            font-size: 15px;
            min-width: auto;
        }

        #agents-panel.fullscreen .agent-details {
            font-size: 12px;
        }

        #agents-panel.fullscreen .agent-tech-info .tech-badge,
        #agents-panel.fullscreen .call-info {
            font-size: 11px;
        }

        /* Колонки */
        .panel-columns {
            display: grid;
            grid-template-columns: 1fr; /* В узкой панели одна колонка */
            gap: 16px;
        }
        #agents-panel.fullscreen .panel-columns {
            grid-template-columns: 1fr 1fr; /* Во весь экран две колонки */
        }
        .panel-column {
            display: flex;
            flex-direction: column;
        }
        .column-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 10px 0;
            opacity: 0.85;
        }
        .queue-title { flex-wrap: wrap; gap: 6px 8px; }
        .agent-name, .agent-details { word-break: break-word; }
        .agent-details {
            white-space: nowrap; /* одна строка */
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .queue-info {
            background: var(--bg-surface);
            border-radius: 10px;
            padding: 18px;
            margin-bottom: 15px;
            border-left: 4px solid var(--success);
            transition: background 250ms ease, transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease;
        }

        .queue-info.has-calls {
            border-left-color: var(--warning);
            box-shadow: 0 8px 20px rgba(0,0,0,0.18);
        }

        .queue-info:hover {
            box-shadow: 0 10px 24px rgba(0,0,0,0.22);
        }

        .queue-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }

        .queue-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
            font-size: 14px;
        }

        .stat-item {
            background: var(--bg-surface-2);
            padding: 12px;
            border-radius: 6px;
            text-align: center;
        }

        .stat-label {
            display: block;
            font-size: 13px;
            opacity: 0.8;
            margin-bottom: 5px;
        }

        .stat-value {
            font-weight: 600;
            font-size: 18px;
        }

        .stat-alert {
            background: rgba(255, 193, 7, 0.25) !important;
            border: 1px solid rgba(255, 193, 7, 0.55);
            animation: pulse 2s infinite;
        }

        /* Цветовые статусы для количества в очереди */
        .stat-ok {
            background: rgba(76, 175, 80, 0.25) !important;
            border: 1px solid rgba(76, 175, 80, 0.55);
        }

        .stat-warn {
            background: rgba(255, 152, 0, 0.25) !important;
            border: 1px solid rgba(255, 152, 0, 0.55);
        }

        .stat-danger {
            background: rgba(244, 67, 54, 0.25) !important;
            border: 1px solid rgba(244, 67, 54, 0.55);
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }

        .agent-item {
            background: var(--bg-surface);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 8px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            min-height: 65px;
            transition: all 0.3s ease;
            gap: 10px; /* небольшая щель между левым и правым блоком */
        }

        .agent-item:hover {
            background: var(--bg-hover);
            box-shadow: 0 10px 24px rgba(0,0,0,0.22);
        }

        .agent-name {
            font-weight: 500;
            font-size: 16px;
            margin-bottom: 4px;
            display: flex;               /* предотвращаем налезание плашек на текст */
            align-items: center;
            column-gap: 6px;
            row-gap: 4px;
            flex-wrap: wrap;             /* переносим аккуратно на следующую строку при нехватке места */
        }

        .agent-status {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
            font-weight: 500;
            min-width: 120px;
            text-align: right;
            flex-shrink: 0; /* не сжимать статусную колонку */
        }
        .agent-status-top {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
        }

        .status-indicator {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            display: inline-block;
            flex-shrink: 0;
            box-shadow: 0 0 0 0 rgba(255,255,255,0.25);
            transition: box-shadow 250ms ease, transform 250ms ease;
        }

        .status-available { background-color: #4CAF50; }
        .status-busy { background-color: #FF9800; }
        .status-unavailable { background-color: #F44336; }
        .status-paused { background-color: #9E9E9E; }
        .status-ringing { background-color: #2196F3; }

        .agent-details {
            font-size: 13px;
            opacity: 0.8;
            margin-top: 4px;
            line-height: 1.3;
        }

        .agent-tech-info {
            font-size: 12px;
            color: var(--muted-text);
            margin-top: 4px;
            display: flex;
            gap: 8px;
            flex-wrap: nowrap; /* одна строка */
        }

        .tech-badge {
            background: var(--badge-bg);
            padding: 4px 10px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap; /* не переносить текст плашек */
        }
        .offline-badge {
            background: rgba(244, 67, 54, 0.18);
            border: 1px solid rgba(244, 67, 54, 0.55);
            color: var(--text-color);
            padding: 2px 6px;
            font-size: 11px;
            line-height: 1.2;
            border-radius: 4px;
            margin-left: 6px;
            white-space: nowrap; /* не переносить текст внутри плашки */
            display: inline-block;
        }
        .not-in-queue-badge {
            background: rgba(255, 193, 7, 0.18);
            border: 1px solid rgba(255, 193, 7, 0.55);
            color: var(--text-color);
            padding: 2px 6px;
            font-size: 11px;
            line-height: 1.2;
            border-radius: 4px;
            margin-left: 6px;
            white-space: nowrap;
            display: inline-block;
        }

        .rtt-good { background: rgba(76, 175, 80, 0.3); }
        .rtt-medium { background: rgba(255, 193, 7, 0.3); }
        .rtt-bad { background: rgba(244, 67, 54, 0.3); }

        .call-info {
            background: var(--call-info-bg);
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            margin-top: 4px;
            font-weight: 500;
            border: 1px solid var(--call-info-border);
        }

        .update-time {
            font-size: 13px;
            opacity: 0.8;
        }

        .minimized {
            height: 80px !important;
        }

        .minimized #agents-panel-content {
            display: none;
        }

        /* Оставляем время обновления видимым и в свернутом состоянии */

        /* Полноэкранный режим */
        #agents-panel.fullscreen {
            left: 0;
            right: 0;
            width: 100vw;
            height: 100vh;
            top: 0;
            border-radius: 0;
            box-shadow: none;
            transform: none !important;
        }

        #agents-panel.fullscreen #agents-panel-header {
            cursor: default;
        }

        .operator-not-found {
            background: rgba(158, 158, 158, 0.25) !important;
            opacity: 0.8;
        }

        .operator-not-found .agent-name::after {
            content: " (не найден)";
            font-size: 12px;
            opacity: 0.7;
        }

        .operator-not-in-queue {
            background: rgba(255, 193, 7, 0.18) !important;
            border-left: 3px solid var(--warning);
        }

        /* заменяем подпись на компактную плашку */
        .operator-not-in-queue .agent-name::after { content: none; }

        .operator-not-in-queue .status-available {
            background-color: var(--status-available) !important;
        }

        .operator-not-in-queue .status-busy {
            background-color: var(--status-busy) !important;
        }

        /* Скроллбар */
        #agents-panel-content::-webkit-scrollbar {
            width: 6px;
        }

        #agents-panel-content::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
            border-radius: 3px;
        }

        #agents-panel-content::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 3px;
        }

        #agents-panel-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.5);
        }

        /* Цвета индикаторов статуса из переменных темы + подсветка */
        .status-available { background-color: var(--status-available); box-shadow: 0 0 10px rgba(76,175,80,0.35); }
        .status-busy { background-color: var(--status-busy); box-shadow: 0 0 10px rgba(255,152,0,0.35); }
        .status-unavailable { background-color: var(--status-unavailable); box-shadow: 0 0 10px rgba(244,67,54,0.35); }
        .status-paused { background-color: var(--status-paused); box-shadow: 0 0 10px rgba(158,158,158,0.35); }
        .status-ringing { background-color: var(--status-ringing); box-shadow: 0 0 12px rgba(33,150,243,0.5); animation: pulse 1.4s infinite; }

        /* Плавность для пользователей с ограничением анимаций */
        @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; transition: none !important; }
        }
    `;

    // Добавляем стили на страницу
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Создаем панель
    const panel = document.createElement('div');
    panel.id = 'agents-panel';
    panel.innerHTML = `
        <div id="agents-panel-header">
            <h3 id="agents-panel-title">📞 Операторы Asterisk</h3>
            <div class="header-right">
                <div id="agents-filter" title="Фильтр колонок">
                    <button class="filter-btn" data-filter="TP">ТП</button>
                    <button class="filter-btn" data-filter="AO">АО</button>
                    <button class="filter-btn" data-filter="KO">КО</button>
                    <button class="filter-btn" data-filter="BOTH">ТП+АО</button>
                </div>
                <div class="update-time">Обновлено: <span id="last-update">никогда</span></div>
                <button id="agents-panel-theme" title="Переключить тему">🌓</button>
                <button id="agents-panel-fullscreen" title="На весь экран">⛶</button>
                <button id="agents-panel-minimize" title="Свернуть">−</button>
            </div>
        </div>
        <div id="agents-panel-content">
            <div class="loading">Загрузка данных...</div>
        </div>
    `;

    document.body.appendChild(panel);

    // Открывать сразу на весь экран
    panel.classList.add('fullscreen');
    const initFsBtn = document.getElementById('agents-panel-fullscreen');
    if (initFsBtn) initFsBtn.textContent = '🗗';

    // Функция для парсинга Endpoints данных
    function parseEndpointsData(pageContent) {
        const endpoints = {};

        // Разбиваем на блоки по Endpoint
        const endpointBlocks = pageContent.split(/(?=Endpoint:\s+\d+\/\d+)/);

        endpointBlocks.forEach(block => {
            // Извлекаем номер внутренней линии
            const extensionMatch = block.match(/Endpoint:\s+(\d+)\/\d+/);
            if (!extensionMatch) return;

            const extension = extensionMatch[1];

            // Извлекаем статус
            const statusMatch = block.match(/Endpoint:\s+\d+\/\d+\s+([^\s]+(?:\s+[^\s]+)*)\s+\d+\s+of\s+inf/);
            const status = statusMatch ? statusMatch[1].trim() : 'Unknown';

            // Извлекаем RTT
            const rttMatch = block.match(/Avail\s+([\d.]+)/);
            const rtt = rttMatch ? parseFloat(rttMatch[1]) : null;

            // Извлекаем информацию о звонке
            const channelUpMatch = block.match(/Channel:.*?Up\s+([\d:]+)/);
            const channelRingMatch = block.match(/Channel:.*?Ring\s+([\d:]+)/);
            const channelRingingMatch = block.match(/Channel:.*?Ringing\s+([\d:]+)/);

            const callDuration = channelUpMatch ? channelUpMatch[1] :
                (channelRingMatch ? channelRingMatch[1] :
                    (channelRingingMatch ? channelRingingMatch[1] : null));

            // Попытка определить направление по CLCID и Extension
            const extenFieldMatch = block.match(/Exten:\s+(\S+)/);
            const extenField = extenFieldMatch ? extenFieldMatch[1] : null;

            let isOutgoing = false;
            // Дозвон определяется по состоянию Ring или Ringing
            // Для состояния Ring проверяем, что это не активный разговор (Up)
            const isIncomingRinging = !!(channelRingingMatch || (channelRingMatch && !channelUpMatch));

            // Извлекаем номер звонящего из CLCID
            const clcidMatch = block.match(/CLCID:\s+"([^"]*)"(?:\s+<([^>]*)>)?/);
            let callerNumber = null;
            let clcidName = null;
            let clcidAngleNumber = null;
            if (clcidMatch) {
                clcidName = clcidMatch[1] || null;
                clcidAngleNumber = clcidMatch[2] || null;
                // Номер звонящего/адресата для показа
                callerNumber = clcidAngleNumber || clcidName;
                if (callerNumber && callerNumber.includes('.')) {
                    callerNumber = clcidName;
                }

                // isOutgoing, если CLCID содержит CID:<extension> текущего оператора
                const cidOwnExtMatch = clcidName ? clcidName.match(/CID:(\d+)/) : null;
                if (cidOwnExtMatch && cidOwnExtMatch[1] === extension) {
                    isOutgoing = true;
                }

                // Если в угловых скобках указан сам внутренний номер, то это входящий
                if (clcidAngleNumber && clcidAngleNumber === extension) {
                    isOutgoing = false;
                }

                // Если состояние канала Ring и Extension = 's', это обычно исходящий звонок
                if (!cidOwnExtMatch && !!channelRingMatch && extenField === 's') {
                    isOutgoing = true;
                }

                // Дополнительная проверка: если в CLCID есть только номер без CID:, это может быть исходящий
                if (!cidOwnExtMatch && clcidName && /^\d+$/.test(clcidName) && !!channelRingMatch) {
                    isOutgoing = true;
                }
            }

            endpoints[extension] = {
                status: status,
                rtt: rtt,
                callDuration: callDuration,
                callerNumber: callerNumber,
                isOutgoing: isOutgoing,
                isIncomingRinging: isIncomingRinging
            };
        });

        return endpoints;
    }

    // Функция для парсинга данных из контента
    function parseAgentsDataFromContent(pageContent) {
        const queues = [];
        const endpoints = parseEndpointsData(pageContent);

        // Разделяем контент на блоки очередей
        const queuePattern = /(\d+) has \d+ calls.*?(?=\d+ has \d+ calls|$)/gs;
        const queueBlocks = pageContent.match(queuePattern);

        if (!queueBlocks) return queues;

        queueBlocks.forEach(block => {
            // Парсим информацию об очереди
            const queueMatch = block.match(/(\d+) has (\d+) calls \(max ([^)]+)\) in '([^']+)' strategy \((\d+)s holdtime, (\d+)s talktime\), W:(\d+), C:(\d+), A:(\d+), SL:([\d.]+)%, SL2:([\d.]+)% within \d+s/);

            if (!queueMatch) return;

            const queueId = queueMatch[1];

            // Обрабатываем очереди 1000, 1100 (ТП), 1002/1003 (АО), 1001/1005/1006 (КО)
            if (!['1000','1100','1002','1003','1001','1005','1006'].includes(queueId)) return;

            // Ищем секцию Members в этом блоке
            const membersMatch = block.match(/Members:\s*(.*?)(?=No Callers|$)/s);
            if (!membersMatch) return;

            const membersSection = membersMatch[1];

            // Получаем список операторов для этой очереди
            const trackedOperators = TRACKED_OPERATORS[queueId] || [];
            const agents = [];

            trackedOperators.forEach(operator => {
                // Ищем информацию об операторе в секции Members
                const operatorPattern = new RegExp(`${operator.name}\\s+\\(Local\\/${operator.extension}@[^)]+\\)[^\\n]*`, 'i');
                const operatorMatch = membersSection.match(operatorPattern);

                if (operatorMatch) {
                    const lineText = operatorMatch[0].toLowerCase();

                    // Извлекаем статистику
                    const callsMatch = operatorMatch[0].match(/has taken (\d+) calls/);
                    const lastCallMatch = operatorMatch[0].match(/last was (\d+) secs ago/);
                    const loginMatch = operatorMatch[0].match(/login was (\d+) secs ago/);

                    const callsTaken = callsMatch ? parseInt(callsMatch[1]) : 0;
                    const lastCallAgo = lastCallMatch ? parseInt(lastCallMatch[1]) : null;
                    const loginAgo = loginMatch ? parseInt(loginMatch[1]) : null;

                    // Определяем статус агента
                    let status = 'unavailable';
                    let statusText = 'Недоступен';

                    if (lineText.includes('ringing')) {
                        status = 'ringing';
                        // Получаем информацию о направлении звонка из Endpoints
                        const endpointInfo = endpoints[operator.extension] || {};
                        statusText = endpointInfo.isOutgoing ? 'Исходящий дозвон' : 'Входящий дозвон';
                    } else if (lineText.includes('not in use')) {
                        status = 'available';
                        statusText = 'Свободен';
                    } else if (lineText.includes('in use') || lineText.includes('in call')) {
                        // Проверяем дополнительную информацию из Endpoints для определения типа звонка
                        const endpointInfo = endpoints[operator.extension] || {};
                        if (endpointInfo.callDuration && endpointInfo.isIncomingRinging) {
                            status = 'ringing';
                            statusText = endpointInfo.isOutgoing ? 'Исходящий дозвон' : 'Входящий дозвон';
                        } else {
                            status = 'busy';
                            statusText = 'В разговоре';
                        }
                    } else if (lineText.includes('paused')) {
                        status = 'paused';
                        statusText = 'На паузе';
                    } else if (lineText.includes('unavailable')) {
                        status = 'unavailable';
                        statusText = 'Недоступен';
                    }

                    // Получаем дополнительную информацию из Endpoints
                    const endpointInfo = endpoints[operator.extension] || {};

                    agents.push({
                        name: operator.name,
                        extension: operator.extension,
                        status: status,
                        statusText: statusText,
                        callsTaken: callsTaken,
                        lastCallAgo: lastCallAgo,
                        loginAgo: loginAgo,
                        isDynamic: lineText.includes('dynamic'),
                        rtt: endpointInfo.rtt,
                        callDuration: endpointInfo.callDuration,
                        callerNumber: endpointInfo.callerNumber,
                        endpointStatus: endpointInfo.status,
                        isOutgoing: endpointInfo.isOutgoing,
                        isIncomingRinging: endpointInfo.isIncomingRinging,
                        found: true,
                        inQueue: true
                    });
                } else {
                    // Проверяем, есть ли оператор в Endpoints данных
                    const endpointInfo = endpoints[operator.extension] || {};
                    const isRegistered = endpointInfo.status && endpointInfo.status !== 'Unknown';

                    if (isRegistered) {
                        // Определяем статус оператора на основе Endpoint данных
                        let status = 'unavailable';
                        let statusText = 'Не в очереди';

                        if (endpointInfo.status === 'Not in use') {
                            status = 'available';
                            statusText = 'Свободен';
                        } else if (endpointInfo.status === 'In use') {
                            status = 'busy';
                            statusText = 'В разговоре';
                        } else if (endpointInfo.status === 'Unavailable') {
                            status = 'unavailable';
                            statusText = 'Недоступен';
                        }

                        agents.push({
                            name: operator.name,
                            extension: operator.extension,
                            status: status,
                            statusText: statusText,
                            callsTaken: 0,
                            lastCallAgo: null,
                            loginAgo: null,
                            isDynamic: false,
                            rtt: endpointInfo.rtt,
                            callDuration: endpointInfo.callDuration,
                            callerNumber: endpointInfo.callerNumber,
                            endpointStatus: endpointInfo.status,
                            isOutgoing: endpointInfo.isOutgoing,
                            isIncomingRinging: endpointInfo.isIncomingRinging,
                            found: true,
                            inQueue: false
                        });
                    } else {
                        // Оператор не найден в данных
                        agents.push({
                            name: operator.name,
                            extension: operator.extension,
                            status: 'unavailable',
                            statusText: 'Не найден',
                            callsTaken: 0,
                            lastCallAgo: null,
                            loginAgo: null,
                            isDynamic: false,
                            rtt: null,
                            callDuration: null,
                            callerNumber: null,
                            endpointStatus: 'Unknown',
                            isOutgoing: false,
                            isIncomingRinging: false,
                            found: false,
                            inQueue: false
                        });
                    }
                }
            });

            queues.push({
                id: queueId,
                currentCalls: parseInt(queueMatch[2]),
                maxCalls: queueMatch[3],
                strategy: queueMatch[4],
                holdTime: parseInt(queueMatch[5]),
                talkTime: parseInt(queueMatch[6]),
                waiting: parseInt(queueMatch[7]),
                completed: parseInt(queueMatch[8]),
                abandoned: parseInt(queueMatch[9]),
                serviceLevel: parseFloat(queueMatch[10]),
                serviceLevel2: parseFloat(queueMatch[11]),
                agents: agents
            });
        });

        // Пост-обработка: если агент найден и зарегистрирован, но не в этой очереди,
        // и одновременно он присутствует в Members какой-либо другой отслеживаемой очереди,
        // помечаем его как "В другой очереди" и меняем бейдж.
        const extensionsInAnyQueue = new Set();
        queues.forEach(q => {
            q.agents.forEach(a => {
                if (a.found && a.inQueue) {
                    extensionsInAnyQueue.add(a.extension);
                }
            });
        });

        queues.forEach(q => {
            q.agents.forEach(a => {
                if (a.found && !a.inQueue && extensionsInAnyQueue.has(a.extension)) {
                    a.inOtherQueue = true;
                    // Корректируем статусный текст, если он про "Не в очереди"
                    if (a.statusText === 'Не в очереди' || a.statusText === 'Свободен') {
                        a.statusText = 'В другой очереди';
                    }
                }
            });
        });

        return queues;
    }

    // Функция для форматирования времени
    function formatTime(seconds) {
        if (seconds < 60) return `${seconds}с`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}м ${seconds % 60}с`;
        return `${Math.floor(seconds / 3600)}ч ${Math.floor((seconds % 3600) / 60)}м`;
    }

    // Функция для получения свежих данных с сервера
    async function fetchFreshData() {
        try {
            const response = await fetch(window.location.href, {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            const html = await response.text();

            // Создаем временный элемент для парсинга
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            return tempDiv.innerText;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return document.body.innerText;
        }
    }

    // Фильтр отображения
    const FILTER_STORAGE_KEY = 'agentsPanelFilter';
    const FILTERS = { TP: 'TP', AO: 'AO', KO: 'KO', BOTH: 'BOTH' };
    function getCurrentFilter() {
        const saved = localStorage.getItem(FILTER_STORAGE_KEY);
        return saved && FILTERS[saved] ? saved : FILTERS.BOTH;
    }
    function setCurrentFilter(filter) {
        localStorage.setItem(FILTER_STORAGE_KEY, filter);
        updateFilterButtons(filter);
    }
    function updateFilterButtons(active) {
        const btns = panel.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            if (btn.getAttribute('data-filter') === active) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    // Функция для обновления панели
    async function updatePanel() {
        const pageContent = await fetchFreshData();
        const queues = parseAgentsDataFromContent(pageContent);
        const content = document.getElementById('agents-panel-content');
        const prevScrollTop = content.scrollTop;

        if (queues.length === 0) {
            content.innerHTML = '<div class="loading">Данные не найдены</div>';
            return;
        }

        let html = '';

        const renderQueueBlock = (queue) => {
            const queueIcon = queue.currentCalls > 0 ? '📞' : '📋';
            const queueStatus = queue.currentCalls > 0 ? ` (${queue.currentCalls} звонок${queue.currentCalls > 1 ? 'а' : ''})` : '';
            const waitingClass = queue.currentCalls > 5
                ? 'stat-danger'
                : (queue.currentCalls > 3
                    ? 'stat-warn'
                    : (queue.currentCalls > 0 ? 'stat-ok' : ''));
            let block = `
                <div class="queue-info ${queue.currentCalls > 0 ? 'has-calls' : ''}">
                    <div class="queue-title">${queueIcon} Очередь ${queue.id}${queueStatus}</div>
                    <div class="queue-stats">
                        <div class="stat-item ${waitingClass}"><span class="stat-label">В очереди</span><span class="stat-value">${queue.currentCalls}</span></div>
                        <div class="stat-item"><span class="stat-label">Завершено</span><span class="stat-value">${queue.completed}</span></div>
                        <div class="stat-item"><span class="stat-label">Брошено</span><span class="stat-value">${queue.abandoned}</span></div>
                        <div class="stat-item"><span class="stat-label">Уровень SL</span><span class="stat-value">${queue.serviceLevel}%</span></div>
                        <div class="stat-item"><span class="stat-label">Ср. ожидание</span><span class="stat-value">${queue.holdTime}с</span></div>
                        <div class="stat-item"><span class="stat-label">Ср. разговор</span><span class="stat-value">${formatTime(queue.talkTime)}</span></div>
                    </div>
                    <div class="agents-list">`;

            const sortedAgents = queue.agents.sort(sortAgents);
            sortedAgents.forEach(agent => {
                const dynamicBadge = agent.isDynamic ? ' <span class="tech-badge">dynamic</span>' : '';
                const { cssClass: pingClass, text: pingText } = getPingMeta(agent.rtt);
                const callInfo = getCallInfo(agent);
                const connectionStatus = agent.endpointStatus === 'Unavailable' ? '<span class="tech-badge offline-badge">Отключен</span>' : '';
                const operatorClass = getOperatorClass(agent);
                const notInQueueBadge = (!agent.inQueue && agent.found)
                    ? `<span class="tech-badge not-in-queue-badge">${agent.inOtherQueue ? 'В другой очереди' : 'Вне очереди'}</span>`
                    : '';
                block += `
                    <div class="agent-item ${operatorClass}">
                        <div>
                            <div class="agent-status-top"><span class="status-indicator status-${agent.status}"></span><span>${agent.statusText}</span></div>
                            <div class="agent-name">${agent.name} (${agent.extension})${dynamicBadge}${connectionStatus}${notInQueueBadge}</div>
                            <div class="agent-details">Звонков: ${agent.callsTaken}${agent.lastCallAgo ? ` | Последний: ${formatTime(agent.lastCallAgo)}` : ''}</div>
                            ${pingText ? `<div class="agent-tech-info">\n                                <span class=\"tech-badge ${pingClass}\">Ping: ${pingText}</span>\n                            </div>` : ''}
                            ${callInfo}
                        </div>
                    </div>`;
            });
            block += '    </div></div>';
            return block;
        };

        const filter = getCurrentFilter();
        const tpQueues = queues.filter(q => q.id === '1000' || q.id === '1100');
        const aoQueues = queues.filter(q => q.id === '1002' || q.id === '1003');
        const koQueues = queues.filter(q => q.id === '1001' || q.id === '1005' || q.id === '1006');

        // KO теперь отображается реальными очередями 1001 и 1005

        if (filter === FILTERS.TP) {
            html += '<div class="panel-column"><div class="column-title">ТП</div>';
            tpQueues.forEach(q => { html += renderQueueBlock(q); });
            html += '</div>';
        } else if (filter === FILTERS.AO) {
            html += '<div class="panel-column"><div class="column-title">АО</div>';
            aoQueues.forEach(q => { html += renderQueueBlock(q); });
            html += '</div>';
        } else if (filter === FILTERS.KO) {
            html += '<div class="panel-column"><div class="column-title">КО</div>';
            koQueues.forEach(q => { html += renderQueueBlock(q); });
            html += '</div>';
        } else {
            html += '<div class="panel-columns">';
            html += '<div class="panel-column"><div class="column-title">ТП</div>';
            tpQueues.forEach(q => { html += renderQueueBlock(q); });
            html += '</div>';
            html += '<div class="panel-column"><div class="column-title">АО</div>';
            aoQueues.forEach(q => { html += renderQueueBlock(q); });
            html += '</div>';
            // в комбинированном режиме показываем только ТП+АО как раньше
            html += '</div>';
        }

        content.innerHTML = html;
        content.scrollTop = prevScrollTop;

        // Обновляем время последнего обновления
        const now = new Date();
        document.getElementById('last-update').textContent = now.toLocaleTimeString('ru-RU');
    }

    // Тема
    const THEME_STORAGE_KEY = 'agentsPanelTheme';
    function applyTheme(theme) {
        if (theme === 'light') {
            panel.classList.add('theme-light');
        } else {
            panel.classList.remove('theme-light');
        }
        const themeBtn = document.getElementById('agents-panel-theme');
        if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌞' : '🌙';
    }
    function toggleTheme() {
        const current = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_STORAGE_KEY, next);
        applyTheme(next);
    }

    // Функция для сворачивания/разворачивания панели
    function togglePanel() {
        panel.classList.toggle('minimized');
        const button = document.getElementById('agents-panel-minimize');
        button.textContent = panel.classList.contains('minimized') ? '+' : '−';
    }

    // Полноэкранный режим
    function toggleFullscreen() {
        // Если свернуто, сначала развернем
        if (panel.classList.contains('minimized')) {
            panel.classList.remove('minimized');
            const minBtn = document.getElementById('agents-panel-minimize');
            if (minBtn) minBtn.textContent = '−';
        }

        panel.classList.toggle('fullscreen');
        const fsBtn = document.getElementById('agents-panel-fullscreen');
        if (fsBtn) fsBtn.textContent = panel.classList.contains('fullscreen') ? '🗗' : '⛶';
    }

    // Инициализация темы и обработчики
    applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || 'dark');
    document.getElementById('agents-panel-theme').addEventListener('click', toggleTheme);
    // Обработчик для кнопки сворачивания
    document.getElementById('agents-panel-minimize').addEventListener('click', togglePanel);
    // Обработчик для полноэкранного режима
    document.getElementById('agents-panel-fullscreen').addEventListener('click', toggleFullscreen);
    // Инициализация фильтра и обработчики
    updateFilterButtons(getCurrentFilter());
    panel.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            setCurrentFilter(filter);
            updatePanel();
        });
    });

    // Делаем панель перетаскиваемой
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const header = document.getElementById('agents-panel-header');

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (panel.classList.contains('fullscreen')) return;
        if (e.target === document.getElementById('agents-panel-minimize')) return;
        if (e.target === document.getElementById('agents-panel-theme')) return;
        if (e.target === document.getElementById('agents-panel-fullscreen')) return;

        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === header || header.contains(e.target)) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            panel.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    // Первоначальное обновление
    updatePanel();

    // Автоматическое обновление каждые N мс
    setInterval(() => { updatePanel(); }, REFRESH_INTERVAL_MS);

})();