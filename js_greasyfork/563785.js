// ==UserScript==
// @name         NEO-LOGS • CYBER
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Ультра-киберпанк панель для логов
// @author       WashingtonNuked LOGI 61
// @match        https://logs.blackrussia.online/gslogs/*
// @grant        none
// @license      Mit
// @require      https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @resource     fontOrbitron https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap
// @resource     fontRajdhani https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap
// @resource     fontExo2 https://fonts.googleapis.com/css2?family=Exo+2:wght@100;200;300;400;500;600;700;800;900&display=swap
// @downloadURL https://update.greasyfork.org/scripts/563785/NEO-LOGS%20%E2%80%A2%20CYBER.user.js
// @updateURL https://update.greasyfork.org/scripts/563785/NEO-LOGS%20%E2%80%A2%20CYBER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Очищаем body и добавляем наш контент
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // Создаем и добавляем стили
    const styles = `
        /* 🔥 КИБЕРПАНК СТИЛИ ULTRA */
        :root {
            --bg-primary: #0a0a16;
            --bg-secondary: #151528;
            --bg-card: #1e1e3a;
            --accent-primary: #8b5ceb;
            --accent-secondary: #00d4ff;
            --accent-tertiary: #ff2a6d;
            --accent-pinned: #ffdd57;
            --text-primary: #ffffff;
            --text-secondary: #a0a0c0;
            --text-glow: 0 0 10px currentColor;
            --danger: #ff3860;
            --warning: #ffdd57;
            --success: #23d160;
            --neon-shadow: 0 0 20px rgba(139, 92, 235, 0.3);
            --pinned-shadow: 0 0 20px rgba(255, 221, 87, 0.3);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, var(--bg-primary) 0%, #1a1a2e 50%, #16213e 100%);
            color: var(--text-primary);
            font-family: 'Exo 2', sans-serif;
            overflow-x: hidden;
            position: relative;
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: auto !important;
        }

        #particles-js {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
        }

        .cyber-container {
            max-width: 2000px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
        }

        .cyber-header {
            text-align: center;
            padding: 40px 0;
            position: relative;
            margin-bottom: 40px;
        }

        .cyber-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 3px;
            background: linear-gradient(90deg, transparent, var(--accent-primary), var(--accent-secondary), transparent);
            animation: scanLine 3s linear infinite;
        }

        @keyframes scanLine {
            0% { width: 0; opacity: 0; }
            50% { width: 200px; opacity: 1; }
            100% { width: 0; opacity: 0; left: calc(50% + 100px); }
        }

        .main-title {
            font-family: 'Orbitron', monospace;
            font-size: 4rem;
            font-weight: 900;
            background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(139, 92, 235, 0.5);
            margin-bottom: 10px;
            letter-spacing: 3px;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .subtitle {
            font-family: 'Rajdhani', sans-serif;
            font-size: 1.5rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 4px;
        }

        .cyber-grid {
    display: grid;
    grid-template-columns: 320px 1fr 350px;
    gap: 30px;
    align-items: start;
}

        .cyber-filters {
            background: rgba(30, 30, 58, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(139, 92, 235, 0.3);
            border-radius: 20px;
            padding: 25px;
            box-shadow: var(--neon-shadow);
            position: sticky;
            top: 20px;
            transform-style: preserve-3d;
            transition: all 0.3s ease;
        }

        .cyber-filters:hover {
            transform: translateY(-5px) rotateX(5deg);
            box-shadow: 0 15px 30px rgba(139, 92, 235, 0.4);
        }

        .filters-header {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(139, 92, 235, 0.3);
        }

        .filters-header i {
            font-size: 1.5rem;
            margin-right: 10px;
            color: var(--accent-primary);
        }

        .filter-group {
            margin-bottom: 25px;
            position: relative;
        }

        .filter-label {
            display: block;
            margin-bottom: 8px;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
        }

        .cyber-input {
            width: 100%;
            padding: 12px 15px;
            background: rgba(10, 10, 22, 0.6);
            border: 1px solid rgba(139, 92, 235, 0.2);
            border-radius: 10px;
            color: var(--text-primary);
            font-family: 'Exo 2', sans-serif;
            transition: all 0.3s ease;
        }

        .cyber-input:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: 0 0 15px rgba(139, 92, 235, 0.3);
        }

        .cyber-btn-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 30px;
        }

        .cyber-btn {
            padding: 14px 20px;
            border: none;
            border-radius: 10px;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .cyber-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s ease;
        }

        .cyber-btn:hover::before {
            left: 100%;
        }

        .cyber-btn-primary {
            background: linear-gradient(135deg, var(--accent-primary), #6a42c4);
            color: white;
            box-shadow: 0 5px 15px rgba(139, 92, 235, 0.4);
        }

        .cyber-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(139, 92, 235, 0.6);
        }

        .cyber-btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-secondary);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cyber-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            color: var(--text-primary);
        }

        .cyber-main {
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .cyber-stat-card {
            background: linear-gradient(135deg, rgba(30, 30, 58, 0.8), rgba(42, 42, 72, 0.8));
            backdrop-filter: blur(10px);
            border: 1px solid rgba(139, 92, 235, 0.2);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .cyber-stat-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(139, 92, 235, 0.1) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .cyber-stat-card:hover::before {
            opacity: 1;
        }

        .cyber-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(139, 92, 235, 0.3);
        }

        .stat-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
            opacity: 0.8;
        }

        .stat-value {
            font-family: 'Orbitron', monospace;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 5px;
            background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .stat-label {
            font-family: 'Rajdhani', sans-serif;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
        }

        /* 🎯 КОНТЕЙНЕР ДЛЯ ЗАКРЕПЛЕННЫХ ЛОГОВ */
        .pinned-logs-container {
            background: rgba(30, 30, 58, 0.6);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 221, 87, 0.3);
            border-radius: 20px;
            padding: 30px;
            box-shadow: var(--pinned-shadow);
            margin-bottom: 30px;
        }

        .pinned-logs-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(255, 221, 87, 0.3);
        }

        .pinned-logs-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.8rem;
            background: linear-gradient(45deg, var(--accent-pinned), #ffb347);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .clear-pinned-btn {
            background: rgba(255, 221, 87, 0.2);
            border: 1px solid var(--accent-pinned);
            border-radius: 8px;
            padding: 8px 15px;
            color: var(--accent-pinned);
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .clear-pinned-btn:hover {
            background: rgba(255, 221, 87, 0.3);
            transform: translateY(-2px);
        }

        .pinned-logs-feed {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .pinned-log-row {
            background: linear-gradient(135deg,
                rgba(40, 40, 60, 0.95) 0%,
                rgba(50, 50, 70, 0.85) 50%,
                rgba(40, 40, 60, 0.95) 100%);
            backdrop-filter: blur(25px) saturate(200%);
            border: 1px solid rgba(255, 221, 87, 0.4);
            border-radius: 16px;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            position: relative;
            overflow: hidden;
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.15),
                0 0 0 1px rgba(255, 221, 87, 0.1);
        }

        .pinned-log-row::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg,
                transparent,
                rgba(255, 221, 87, 0.1),
                rgba(255, 193, 7, 0.1),
                transparent);
            transition: left 0.6s ease;
        }

        .pinned-log-row:hover::before {
            left: 100%;
        }

        .pinned-log-row:hover {
            transform: translateY(-4px) scale(1.01);
            border-color: rgba(255, 221, 87, 0.7);
            box-shadow:
                0 15px 40px rgba(255, 221, 87, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.25),
                0 0 20px rgba(255, 221, 87, 0.3);
        }

        .pinned-first-row {
            display: grid;
            grid-template-columns: 70px 200px 200px 1fr 140px 160px 150px 80px;
            gap: 15px;
            padding: 20px 25px;
            align-items: center;
            min-height: 70px;
            position: relative;
        }

        .pinned-log-number {
            font-family: 'Orbitron', monospace;
            font-weight: 900;
            color: var(--accent-pinned);
            font-size: 1.1rem;
            text-shadow: 0 0 15px var(--accent-pinned);
            background: rgba(255, 221, 87, 0.1);
            padding: 8px 12px;
            border-radius: 12px;
            border: 1px solid rgba(255, 221, 87, 0.3);
            text-align: center;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .pinned-log-category {
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            padding: 10px 16px;
            border-radius: 14px;
            font-size: 0.85rem;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: rgba(255, 221, 87, 0.2);
            border: 2px solid rgba(255, 221, 87, 0.5);
            backdrop-filter: blur(15px);
            color: var(--accent-pinned);
        }

        .unpin-btn {
            background: rgba(255, 221, 87, 0.1);
            border: 1px solid rgba(255, 221, 87, 0.3);
            border-radius: 8px;
            padding: 8px 12px;
            color: var(--accent-pinned);
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            font-size: 0.8rem;
        }

        .unpin-btn:hover {
            background: rgba(255, 221, 87, 0.2);
            transform: translateY(-2px);
        }

        .cyber-logs-container {
            background: rgba(30, 30, 58, 0.6);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(139, 92, 235, 0.3);
            border-radius: 20px;
            padding: 30px;
            box-shadow: var(--neon-shadow);
        }

        .logs-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(139, 92, 235, 0.3);
        }

        .logs-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.8rem;
            background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .live-indicator {
            display: flex;
            align-items: center;
            background: rgba(255, 42, 109, 0.2);
            padding: 8px 15px;
            border-radius: 20px;
            border: 1px solid var(--accent-tertiary);
        }

        .pulse-dot {
            width: 10px;
            height: 10px;
            background: var(--accent-tertiary);
            border-radius: 50%;
            margin-right: 8px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 42, 109, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 42, 109, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 42, 109, 0); }
        }

        /* 🎯 ЕБАНИСТИЧЕСКИЙ ДИЗАЙН ЛОГОВ */
        .cyber-logs-feed {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .log-row-ultra {
            background: linear-gradient(135deg,
                rgba(30, 30, 58, 0.95) 0%,
                rgba(42, 42, 72, 0.85) 50%,
                rgba(30, 30, 58, 0.95) 100%);
            backdrop-filter: blur(25px) saturate(200%);
            border: 1px solid rgba(139, 92, 235, 0.4);
            border-radius: 16px;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            position: relative;
            overflow: hidden;
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.15),
                0 0 0 1px rgba(139, 92, 235, 0.1);
        }

        .log-row-ultra::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg,
                transparent,
                rgba(139, 92, 235, 0.1),
                rgba(0, 212, 255, 0.1),
                transparent);
            transition: left 0.6s ease;
        }

        .log-row-ultra:hover::before {
            left: 100%;
        }

        .log-row-ultra:hover {
            transform: translateY(-4px) scale(1.01);
            border-color: rgba(139, 92, 235, 0.7);
            box-shadow:
                0 15px 40px rgba(139, 92, 235, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.25),
                0 0 20px rgba(139, 92, 235, 0.3);
        }

        .first-row-ultra {
            display: grid;
            grid-template-columns: 70px 200px 200px 1fr 140px 160px 150px;
            gap: 15px;
            padding: 20px 25px;
            align-items: center;
            min-height: 70px;
            position: relative;
        }

        .log-number-ultra {
            font-family: 'Orbitron', monospace;
            font-weight: 900;
            color: var(--accent-secondary);
            font-size: 1.1rem;
            text-shadow: 0 0 15px var(--accent-secondary);
            background: rgba(0, 212, 255, 0.1);
            padding: 8px 12px;
            border-radius: 12px;
            border: 1px solid rgba(0, 212, 255, 0.3);
            text-align: center;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .log-number-ultra:hover {
            background: rgba(0, 212, 255, 0.2);
            transform: scale(1.05);
        }

        .time-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .log-date, .log-time {
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            padding: 6px 10px;
            border-radius: 8px;
            transition: all 0.3s ease;
            background: rgba(139, 92, 235, 0.05);
            border: 1px solid rgba(139, 92, 235, 0.1);
        }

        .log-date:hover, .log-time:hover {
            background: rgba(139, 92, 235, 0.15);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(139, 92, 235, 0.2);
        }

        .log-date {
            color: var(--accent-secondary);
        }

        .log-time {
            color: var(--text-secondary);
        }

        .log-category-ultra {
            font-family: 'Rajdhani', sans-serif;
            font-weight: 700;
            padding: 10px 16px;
            border-radius: 14px;
            font-size: 0.85rem;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: rgba(139, 92, 235, 0.2);
            border: 2px solid rgba(139, 92, 235, 0.5);
            backdrop-filter: blur(15px);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .log-category-ultra::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            transition: left 0.5s ease;
        }

        .log-category-ultra:hover::before {
            left: 100%;
        }

        .log-category-ultra:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 8px 20px rgba(139, 92, 235, 0.4);
        }

        .log-player-ultra {
            font-family: 'Exo 2', sans-serif;
            font-weight: 700;
            color: var(--text-primary);
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.05);
            padding: 8px 12px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }

        .log-player-ultra:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
        }

        .log-id-ultra, .log-ip-ultra {
            font-family: 'Orbitron', monospace;
            font-weight: 600;
            font-size: 0.9rem;
            background: rgba(255, 255, 255, 0.05);
            padding: 8px 12px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }

        .log-id-ultra:hover, .log-ip-ultra:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
        }

        .log-id-ultra {
            color: var(--accent-primary);
        }

        .log-ip-ultra {
            color: var(--accent-tertiary);
        }

        .amount-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
            align-items: flex-end;
        }

        .log-amount-ultra, .log-balance-ultra {
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 0.9rem;
            text-align: center;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.05);
            min-width: 120px;
        }

        .log-amount-ultra:hover, .log-balance-ultra:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
        }

        .log-amount-ultra.negative {
            color: var(--danger);
            background: rgba(255, 56, 96, 0.1);
            border-color: rgba(255, 56, 96, 0.3);
        }

        .log-amount-ultra.negative:hover {
            background: rgba(255, 56, 96, 0.2);
        }

        .log-amount-ultra.positive {
            color: var(--success);
            background: rgba(34, 197, 94, 0.1);
            border-color: rgba(34, 197, 94, 0.3);
        }

        .log-amount-ultra.positive:hover {
            background: rgba(34, 197, 94, 0.2);
        }

        .log-balance-ultra {
            color: var(--accent-secondary);
            background: rgba(0, 212, 255, 0.1);
            border-color: rgba(0, 212, 255, 0.3);
        }

        .log-balance-ultra:hover {
            background: rgba(0, 212, 255, 0.2);
        }

        .log-description-ultra {
            font-size: 1rem;
            line-height: 1.5;
            color: var(--text-primary);
            font-weight: 500;
            word-wrap: break-word;
            padding: 15px 25px 20px 25px;
            background: rgba(10, 10, 22, 0.4);
            border-top: 1px solid rgba(139, 92, 235, 0.2);
            backdrop-filter: blur(15px);
            position: relative;
            font-family: 'Exo 2', sans-serif;
            border-radius: 0 0 16px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .log-description-ultra::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg,
                rgba(139, 92, 235, 0.05) 0%,
                transparent 50%,
                rgba(0, 212, 255, 0.05) 100%);
            pointer-events: none;
        }

        .description-text {
            flex: 1;
            margin-right: 15px;
        }

        .pin-btn {
            background: rgba(255, 221, 87, 0.1);
            border: 1px solid rgba(255, 221, 87, 0.3);
            border-radius: 8px;
            padding: 8px 15px;
            color: var(--accent-pinned);
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            font-size: 0.8rem;
            white-space: nowrap;
        }

        .pin-btn:hover {
            background: rgba(255, 221, 87, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 221, 87, 0.2);
        }

        .pin-btn.pinned {
            background: rgba(255, 221, 87, 0.3);
            border-color: rgba(255, 221, 87, 0.6);
        }

        /* 🔥 СУПЕР-КРАСИВЫЙ CONFETTI ЭФФЕКТ */
        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        }

        .confetti {
            position: absolute;
            width: 15px;
            height: 15px;
            background: var(--accent-primary);
            top: -10px;
            opacity: 0;
            border-radius: 0;
        }

        .confetti:nth-child(5n) {
            width: 12px;
            height: 12px;
            background: #8b5ceb;
            animation-duration: 2s;
        }

        .confetti:nth-child(5n+1) {
            width: 18px;
            height: 18px;
            background: #00d4ff;
            animation-duration: 2.5s;
        }

        .confetti:nth-child(5n+2) {
            width: 14px;
            height: 14px;
            background: #ff2a6d;
            animation-duration: 1.8s;
        }

        .confetti:nth-child(5n+3) {
            width: 16px;
            height: 16px;
            background: #23d160;
            animation-duration: 2.2s;
        }

        .confetti:nth-child(5n+4) {
            width: 13px;
            height: 13px;
            background: #ffdd57;
            animation-duration: 1.9s;
        }

        .confetti.circle {
            border-radius: 50%;
        }

        .confetti.triangle {
            width: 0;
            height: 0;
            background: transparent !important;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 16px solid currentColor;
        }

        .confetti.heart {
            background: transparent !important;
            font-size: 16px;
            color: #ff2a6d;
        }

        .confetti.heart::before {
            content: '❤';
        }

        .confetti.star {
            background: transparent !important;
            font-size: 14px;
            color: #ffdd57;
        }

        .confetti.star::before {
            content: '★';
        }

        .copy-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            transform: translateX(100%);
            background: linear-gradient(135deg, rgba(30, 30, 58, 0.95), rgba(42, 42, 72, 0.95));
            backdrop-filter: blur(30px);
            border: 2px solid var(--accent-primary);
            border-radius: 12px;
            padding: 15px 25px;
            color: var(--text-primary);
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 1rem;
            z-index: 10000;
            box-shadow:
                0 0 40px rgba(139, 92, 235, 0.6),
                inset 0 0 20px rgba(255, 255, 255, 0.1);
            text-align: center;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            text-shadow: 0 0 10px currentColor;
            max-width: 300px;
        }

        .copy-notification.show {
            transform: translateX(0);
        }

        .copy-notification i {
            font-size: 1.2rem;
            margin-right: 8px;
            text-shadow: 0 0 20px currentColor;
        }

        .cyber-pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(139, 92, 235, 0.3);
        }

        .cyber-page-btn {
            padding: 12px 20px;
            background: rgba(139, 92, 235, 0.2);
            border: 1px solid var(--accent-primary);
            border-radius: 8px;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
        }

        .cyber-page-btn:hover {
            background: rgba(139, 92, 235, 0.4);
            transform: translateY(-2px);
        }

        .cyber-page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(139, 92, 235, 0.3);
            border-radius: 50%;
            border-top-color: var(--accent-primary);
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .cyber-sidebar {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.cyber-calculator, .cyber-command-generator {
    background: rgba(30, 30, 58, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 20px;
    padding: 20px;
}

.calculator-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
}

.calc-btn {
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: rgba(139, 92, 235, 0.2);
    color: white;
    cursor: pointer;
}

.command-textarea {
    min-height: 100px;
    resize: vertical;
}
/* 🧮 КРАСИВЫЙ ДИСПЛЕЙ КАЛЬКУЛЯТОРА */
.calculator-display {
    position: relative;
    margin-bottom: 15px;
}

.calc-history {
    position: absolute;
    top: 8px;
    right: 15px;
    font-family: 'Orbitron', monospace;
    font-size: 0.8rem;
    color: var(--accent-secondary);
    opacity: 0.7;
    text-align: right;
    pointer-events: none;
}

.calc-display {
    width: 100%;
    padding: 20px 15px;
    background: linear-gradient(135deg, rgba(10, 10, 22, 0.8), rgba(20, 20, 40, 0.9));
    border: 2px solid rgba(0, 212, 255, 0.4);
    border-radius: 15px;
    color: var(--text-primary);
    font-family: 'Orbitron', monospace;
    font-size: 1.8rem;
    font-weight: 700;
    text-align: right;
    outline: none;
    box-shadow:
        inset 0 0 20px rgba(0, 212, 255, 0.1),
        0 0 30px rgba(0, 212, 255, 0.2);
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
    letter-spacing: 2px;
    position: relative;
    overflow: hidden;
}

.calc-display::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
    transition: left 0.5s ease;
}

.calc-display:focus {
    border-color: var(--accent-secondary);
    box-shadow:
        inset 0 0 30px rgba(0, 212, 255, 0.2),
        0 0 40px rgba(0, 212, 255, 0.4);
}

.calc-display:hover::before {
    left: 100%;
}

/* 🌐 IP ИНФОРМАТОР */
.cyber-ip-info {
    background: rgba(30, 30, 58, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.ip-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid rgba(34, 197, 94, 0.3);
}

.ip-header i {
    font-size: 1.5rem;
    margin-right: 10px;
    color: #23d160;
}

.ip-header h2 {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.2rem;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.ip-controls {
    margin-bottom: 25px;
}

.ip-result {
    border-top: 1px solid rgba(34, 197, 94, 0.2);
    padding-top: 20px;
}

.ip-info-card {
    background: rgba(10, 10, 22, 0.6);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
}

.ip-info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ip-info-item:last-child {
    margin-bottom: 0;
    border-bottom: none;
}

.ip-label {
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.ip-value {
    font-family: 'Exo 2', sans-serif;
    font-weight: 500;
    color: var(--text-primary);
    font-size: 0.9rem;
}
/* 📸 ЗАГРУЗЧИК СКРИНШОТОВ */
.cyber-screenshot {
    background: rgba(30, 30, 58, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 42, 109, 0.3);
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 0 20px rgba(255, 42, 109, 0.3);
    transform-style: preserve-3d;
    transition: all 0.3s ease;
}

.cyber-screenshot:hover {
    transform: translateY(-5px) rotateX(5deg);
    box-shadow: 0 15px 30px rgba(255, 42, 109, 0.4);
}

.screenshot-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid rgba(255, 42, 109, 0.3);
}

.screenshot-header i {
    font-size: 1.5rem;
    margin-right: 10px;
    color: var(--accent-tertiary);
}

.screenshot-header h2 {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.2rem;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.screenshot-controls {
    margin-bottom: 25px;
}

.screenshot-result {
    border-top: 1px solid rgba(255, 42, 109, 0.2);
    padding-top: 20px;
}

.screenshot-preview {
    background: rgba(10, 10, 22, 0.6);
    border: 2px dashed rgba(255, 42, 109, 0.3);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
    text-align: center;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-placeholder {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.preview-placeholder i {
    font-size: 2rem;
    margin-bottom: 10px;
    display: block;
    opacity: 0.5;
}

.screenshot-preview img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    border: 2px solid rgba(255, 42, 109, 0.5);
}

.upload-result {
    display: block;
}

.upload-result input {
    width: 100%;
    margin-bottom: 12px;
    border-radius: 12px;
    padding: 14px;
    font-size: 0.95rem;
    background: rgba(10, 10, 22, 0.8);
    border: 2px solid rgba(139, 92, 235, 0.3);
    transition: all 0.3s ease;
}

.upload-result input:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 20px rgba(139, 92, 235, 0.4);
}

.upload-result .cyber-btn {
    width: 100%;
    padding: 14px;
    font-size: 0.95rem;
    border-radius: 12px;
    justify-content: center;
    background: rgba(139, 92, 235, 0.2);
    border: 2px solid rgba(139, 92, 235, 0.4);
}

.upload-result .cyber-btn:hover {
    background: rgba(139, 92, 235, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 235, 0.4);
}

#screenshotInput {
    cursor: pointer;
}

#screenshotInput:hover {
    background: rgba(255, 42, 109, 0.1);
}
/* 📸 СТИЛИ ДЛЯ INPUT ФАЙЛА */
.file-input-wrapper {
    position: relative;
    display: block;
}

.file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
}

.file-input-label {
    display: block;
    padding: 12px 15px;
    background: rgba(10, 10, 22, 0.6);
    border: 1px solid rgba(255, 42, 109, 0.3);
    border-radius: 10px;
    color: var(--text-secondary);
    font-family: 'Exo 2', sans-serif;
    font-size: 0.9rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
}

.file-input-label:hover {
    background: rgba(255, 42, 109, 0.1);
    border-color: rgba(255, 42, 109, 0.5);
    color: var(--text-primary);
}

.file-input:focus + .file-input-label {
    border-color: var(--accent-tertiary);
    box-shadow: 0 0 15px rgba(255, 42, 109, 0.3);
}
/* 📸 СТИЛИ ДЛЯ МНОЖЕСТВЕННОГО ПРЕВЬЮ */
.preview-item {
    display: inline-block;
    margin: 5px;
    text-align: center;
    vertical-align: top;
}

.preview-item img {
    max-width: 80px;
    max-height: 80px;
    border-radius: 6px;
    border: 2px solid rgba(255, 42, 109, 0.5);
}

.preview-info {
    font-size: 0.7rem;
    color: var(--text-secondary);
    margin-top: 4px;
    max-width: 80px;
    word-break: break-word;
}
/* 🏠 ПОИСК НЕДВИЖИМОСТИ - НОВЫЕ СТИЛИ */
.cyber-realestate {
    background: rgba(30, 30, 58, 0.9);
    border: 2px solid #8b5ceb;
    border-radius: 15px;
    padding: 20px;
    margin: 10px 0;
    position: relative;
    z-index: 100;
}

.realestate-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #8b5ceb;
}

.realestate-header i {
    font-size: 1.5rem;
    margin-right: 10px;
    color: #8b5ceb;
}

.realestate-header h2 {
    font-family: Arial, sans-serif;
    font-size: 1.2rem;
    color: white;
    margin: 0;
}

.realestate-controls {
    margin-bottom: 15px;
}

.realestate-input {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    background: rgba(10, 10, 22, 0.8);
    border: 1px solid #8b5ceb;
    border-radius: 5px;
    color: white;
    font-size: 14px;
}

.realestate-btn {
    width: 100%;
    padding: 12px;
    margin: 5px 0;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
}

.realestate-btn-primary {
    background: #8b5ceb;
    color: white;
}

.realestate-btn-primary:hover {
    background: #7b4cdb;
}

.realestate-btn-secondary {
    background: rgba(139, 92, 235, 0.2);
    color: #8b5ceb;
    border: 1px solid #8b5ceb;
}

.realestate-btn-secondary:hover {
    background: rgba(139, 92, 235, 0.3);
}

.property-info {
    background: rgba(10, 10, 22, 0.8);
    border: 1px solid #8b5ceb;
    border-radius: 5px;
    padding: 15px;
    margin: 10px 0;
    min-height: 100px;
}

.property-placeholder {
    color: #888;
    text-align: center;
    padding: 20px;
}

        @media (max-width: 1600px) {
            .first-row-ultra {
                grid-template-columns: 60px 180px 180px 1fr 120px 140px 130px;
                gap: 12px;
                padding: 15px 20px;
            }
            .pinned-first-row {
                grid-template-columns: 60px 180px 180px 1fr 120px 140px 130px 70px;
                gap: 12px;
                padding: 15px 20px;
            }
        }

        @media (max-width: 1200px) {
            .cyber-grid {
                grid-template-columns: 1fr;
            }

            .cyber-filters {
                position: relative;
                top: 0;
            }

            .main-title {
                font-size: 3rem;
            }

            .first-row-ultra {
                grid-template-columns: 50px 150px 150px 1fr 100px 120px 100px;
                gap: 10px;
                padding: 12px 15px;
            }
            .pinned-first-row {
                grid-template-columns: 50px 150px 150px 1fr 100px 120px 100px 60px;
                gap: 10px;
                padding: 12px 15px;
            }
        }

        @media (max-width: 768px) {
            .main-title {
                font-size: 2.5rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .cyber-btn-group {
                grid-template-columns: 1fr;
            }

            .first-row-ultra {
                grid-template-columns: 1fr;
                grid-template-areas:
                    "number time time"
                    "category category category"
                    "player player player"
                    "id ip amount"
                    "balance balance balance";
                gap: 10px;
                padding: 15px;
            }

            .pinned-first-row {
                grid-template-columns: 1fr;
                grid-template-areas:
                    "number time time"
                    "category category category"
                    "player player player"
                    "id ip amount"
                    "balance balance balance"
                    "unpin unpin unpin";
                gap: 10px;
                padding: 15px;
            }

            .log-number-ultra { grid-area: number; }
            .time-container { grid-area: time; }
            .log-category-ultra { grid-area: category; }
            .log-player-ultra { grid-area: player; }
            .log-id-ultra { grid-area: id; }
            .log-ip-ultra { grid-area: ip; }
            .amount-container { grid-area: amount; }
            .log-balance-ultra { grid-area: balance; }
            .unpin-btn { grid-area: unpin; }

            .log-description-ultra {
                font-size: 0.9rem;
                padding: 12px 15px 15px 15px;
                flex-direction: column;
                gap: 10px;
            }

            .description-text {
                margin-right: 0;
                text-align: center;
            }

            .copy-notification {
                top: 10px;
                right: 10px;
                left: 10px;
                transform: translateY(-100%);
            }

            .copy-notification.show {
                transform: translateY(0);
            }
        }
    `;

    // Добавляем стили в документ
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Добавляем HTML структуру напрямую в body
    document.body.innerHTML = `
        <!-- 🌌 Анимированный фон -->
        <div id="particles-js"></div>
        <div class="confetti-container" id="confettiContainer"></div>

        <div class="cyber-container">
            <!-- 🚀 Хедер -->
            <header class="cyber-header">
                <h1 class="main-title">NEO-LOGS ULTRA</h1>
                <p class="subtitle">BLACK RUSSIA ONLINE • REAL-TIME MONITORING</p>
            </header>

            <!-- 🎛️ Основной контент -->
            <div class="cyber-grid">
                <!-- 🎚️ Боковая панель фильтров -->
                <aside class="cyber-filters" data-tilt data-tilt-max="5" data-tilt-speed="400" data-tilt-perspective="1000">
                    <div class="filters-header">
                        <i class="fas fa-sliders-h"></i>
                        <h2>ФИЛЬТРЫ И НАСТРОЙКИ</h2>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Игрок (Никнейм)</label>
                        <input type="text" class="cyber-input" id="playerName" placeholder="Введите ник...">
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Категория</label>
                        <select class="cyber-input" id="category">
                            <option value="">Все категории</option>
                            <!-- Категории будут заполнены через JS -->
                        </select>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">ID игрока</label>
                        <input type="text" class="cyber-input" id="playerId" placeholder="Введите ID...">
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">IP адрес</label>
                        <input type="text" class="cyber-input" id="playerIp" placeholder="Введите IP...">
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Сумма транзакции</label>
                        <input type="number" class="cyber-input" id="transactionAmount" placeholder="Сумма...">
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Баланс после</label>
                        <input type="number" class="cyber-input" id="balanceAfter" placeholder="Баланс...">
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Описание</label>
                        <input type="text" class="cyber-input" id="transactionDesc" placeholder="Текст описания...">
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Начальная дата</label>
                        <input type="datetime-local" class="cyber-input" id="timeStart">
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Конечная дата</label>
                        <input type="datetime-local" class="cyber-input" id="timeEnd">
                    </div>

                    <div class="cyber-btn-group">
                        <button class="cyber-btn cyber-btn-primary" id="applyFilters">
                            <i class="fas fa-play-circle"></i> Применить
                        </button>
                        <button class="cyber-btn cyber-btn-secondary" id="resetFilters">
                            <i class="fas fa-undo"></i> Сбросить
                        </button>
                    </div>
                </aside>

                <!-- 📊 Основная область -->
                <main class="cyber-main">
                    <!-- 🎪 Статистика -->
                    <section class="stats-grid">
                        <div class="cyber-stat-card" data-tilt>
                            <div class="stat-icon">
                                <i class="fas fa-broadcast-tower"></i>
                            </div>
                            <div class="stat-value" id="totalLogs">0</div>
                            <div class="stat-label">Всего событий</div>
                        </div>
                        <div class="cyber-stat-card" data-tilt>
                            <div class="stat-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="stat-value" id="activePlayers">0</div>
                            <div class="stat-label">Активных игроков</div>
                        </div>
                        <div class="cyber-stat-card" data-tilt>
                            <div class="stat-icon">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="stat-value" id="totalMoney">0</div>
                            <div class="stat-label">Общий оборот</div>
                        </div>
                        <div class="cyber-stat-card" data-tilt>
                            <div class="stat-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="stat-value" id="lastUpdate">0s</div>
                            <div class="stat-label">Последнее обновление</div>
                        </div>
                    </section>

                    <!-- 📌 КОНТЕЙНЕР ДЛЯ ЗАКРЕПЛЕННЫХ ЛОГОВ -->
                    <section class="pinned-logs-container" id="pinnedLogsContainer" style="display: none;">
                        <div class="pinned-logs-header">
                            <h2 class="pinned-logs-title">
                                <i class="fas fa-thumbtack"></i> ЗАКРЕПЛЕННЫЕ ЛОГИ
                            </h2>
                            <button class="clear-pinned-btn" id="clearPinnedBtn">
                                <i class="fas fa-trash"></i> Очистить все
                            </button>
                        </div>

                        <div class="pinned-logs-feed" id="pinnedLogsFeed">
                            <!-- Закрепленные логи будут здесь -->
                        </div>
                    </section>

                    <!-- 📜 Лента логов -->
                    <section class="cyber-logs-container">
                        <div class="logs-header">
                            <h2 class="logs-title">
                                <i class="fas fa-list-alt"></i> ЖУРНАЛ СОБЫТИЙ ULTRA
                            </h2>
                            <div class="live-indicator">
                                <div class="pulse-dot"></div>
                                <span>LIVE</span>
                            </div>
                        </div>

                        <div class="cyber-logs-feed" id="cyberLogsFeed">
                            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                                <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
                                <div>Загрузка логов...</div>
                            </div>
                        </div>

                        <!-- 🔄 Пагинация -->
                        <div class="cyber-pagination">
                            <button class="cyber-page-btn" id="prevPage" disabled>
                                <i class="fas fa-chevron-left"></i> Назад
                            </button>
                            <span style="color: var(--text-secondary);" id="pageInfo">Страница 1</span>
                            <button class="cyber-page-btn" id="nextPage">
                                Вперед <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </section>
                </main>

                <!-- 🧮 ПРАВАЯ ПАНЕЛЬ -->
                <aside class="cyber-sidebar">
                    <!-- Калькулятор -->
                    <div class="cyber-calculator">
                        <div class="calculator-header">
                            <i class="fas fa-calculator"></i>
                            <h2>КАЛЬКУЛЯТОР</h2>
                        </div>
                        <div class="calculator-display">
                            <input type="text" class="calc-display" id="calcDisplay" readonly value="0">
                        </div>
                        <div class="calculator-buttons">
                            <button class="calc-btn calc-btn-clear" data-action="clear">C</button>
                            <button class="calc-btn calc-btn-clear" data-action="clear-all">CE</button>
                            <button class="calc-btn calc-btn-operator" data-action="backspace">⌫</button>
                            <button class="calc-btn calc-btn-operator" data-action="/">/</button>
                            <button class="calc-btn" data-number="7">7</button>
                            <button class="calc-btn" data-number="8">8</button>
                            <button class="calc-btn" data-number="9">9</button>
                            <button class="calc-btn calc-btn-operator" data-action="*">×</button>
                            <button class="calc-btn" data-number="4">4</button>
                            <button class="calc-btn" data-number="5">5</button>
                            <button class="calc-btn" data-number="6">6</button>
                            <button class="calc-btn calc-btn-operator" data-action="-">−</button>
                            <button class="calc-btn" data-number="1">1</button>
                            <button class="calc-btn" data-number="2">2</button>
                            <button class="calc-btn" data-number="3">3</button>
                            <button class="calc-btn calc-btn-operator" data-action="+">+</button>
                            <button class="calc-btn calc-btn-zero" data-number="0">0</button>
                            <button class="calc-btn" data-action=".">.</button>
                            <button class="calc-btn calc-btn-equals" data-action="=">=</button>
                        </div>
                    </div>

                    <!-- Генератор команд -->
                    <div class="cyber-command-generator">
                        <div class="command-header">
                            <i class="fas fa-terminal"></i>
                            <h2>ГЕНЕРАТОР КОМАНД</h2>
                        </div>
                        <div class="command-controls">
                            <div class="filter-group">
                                <label class="filter-label">Команда</label>
                                <select class="cyber-input" id="banCommand">
                                    <option value="/ban">/ban</option>
                                    <option value="/spermban">/spermban</option>
                                    <option value="/permban">/permban</option>
                                    <option value="/sban">/sban</option>
                                    <option value="/bot">/bot</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label class="filter-label">Список игроков</label>
                                <textarea class="cyber-input command-textarea" id="playersList" placeholder="Никнейм Причина"></textarea>
                            </div>
                            <button class="cyber-btn cyber-btn-primary" id="generateCommands">
                                <i class="fas fa-code"></i> Создать формы
                            </button>
                        </div>
                        <div class="command-result">
                            <label class="filter-label">Результат:</label>
                            <textarea class="cyber-input command-textarea" id="commandsResult" readonly></textarea>
                            <button class="cyber-btn cyber-btn-secondary" id="copyCommands">
                                <i class="fas fa-copy"></i> Копировать все
                            </button>
                        </div>
                    </div>

                    <!-- 🌐 IP ИНФОРМАТОР -->
                    <div class="cyber-ip-info">
                        <div class="ip-header">
                            <i class="fas fa-globe"></i>
                            <h2>IP ИНФОРМАЦИЯ</h2>
                        </div>

                        <div class="ip-controls">
                            <div class="filter-group">
                                <label class="filter-label">IP Адрес</label>
                                <input type="text" class="cyber-input" id="ipAddress" placeholder="Введите IP...">
                            </div>

                            <button class="cyber-btn cyber-btn-primary" id="getIpInfo">
                                <i class="fas fa-search"></i> Получить информацию
                            </button>
                        </div>

                        <div class="ip-result">
                            <label class="filter-label">Результат:</label>
                            <div class="ip-info-card" id="ipInfoResult">
                                <div class="ip-info-item">
                                    <span class="ip-label">Страна:</span>
                                    <span class="ip-value" id="ipCountry">—</span>
                                </div>
                                <div class="ip-info-item">
                                    <span class="ip-label">Город:</span>
                                    <span class="ip-value" id="ipCity">—</span>
                                </div>
                                <div class="ip-info-item">
                                    <span class="ip-label">Провайдер:</span>
                                    <span class="ip-value" id="ipIsp">—</span>
                                </div>
                                <div class="ip-info-item">
                                    <span class="ip-label">Регион:</span>
                                    <span class="ip-value" id="ipRegion">—</span>
                                </div>
                                <div class="ip-info-item">
                                    <span class="ip-label">Часовой пояс:</span>
                                    <span class="ip-value" id="ipTimezone">—</span>
                                </div>
                                <div class="ip-info-item">
                                    <span class="ip-label">Координаты:</span>
                                    <span class="ip-value" id="ipCoordinates">—</span>
                                </div>
                            </div>
                            <button class="cyber-btn cyber-btn-secondary" id="copyIpInfo">
                                <i class="fas fa-copy"></i> Копировать информацию
                            </button>
                        </div>
                    </div>

                    <!-- 📸 ЗАГРУЗЧИК СКРИНШОТОВ -->
                    <div class="cyber-screenshot">
                        <div class="screenshot-header">
                            <i class="fas fa-camera"></i>
                            <h2>ЗАГРУЗКА СКРИНШОТОВ</h2>
                        </div>

                        <div class="screenshot-controls">
                            <div class="filter-group">
                                <label class="filter-label">Скриншот (Ctrl+V или файл)</label>
                                <div class="file-input-wrapper">
                                    <input type="file" class="cyber-input file-input" id="screenshotInput" accept="image/*" multiple>
                                    <span class="file-input-label">Выберите файлы (несколько) или вставьте скриншот</span>
                                </div>
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">Название файла</label>
                                <input type="text" class="cyber-input" id="screenshotName" placeholder="screenshot_001">
                            </div>

                            <button class="cyber-btn cyber-btn-primary" id="uploadScreenshot">
                                <i class="fas fa-cloud-upload-alt"></i> Загрузить на imgBB
                            </button>
                        </div>

                        <div class="screenshot-result">
                            <label class="filter-label">Результат:</label>
                            <div class="screenshot-preview" id="screenshotPreview">
                                <div class="preview-placeholder">
                                    <i class="fas fa-paste"></i>
                                    <span>Вставьте скриншот (Ctrl+V)<br>или выберите файл</span>
                                </div>
                            </div>
                            <div class="upload-result" id="uploadResult">
                                <textarea class="cyber-input command-textarea" id="imageUrl" readonly placeholder="Ссылки появятся здесь..."></textarea>
                                <button class="cyber-btn cyber-btn-secondary" id="copyImageUrl">
                                    <i class="fas fa-copy"></i> Копировать ссылку
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 🏠 ПОИСК НЕДВИЖИМОСТИ -->
                    <div class="cyber-realestate" id="realEstateSearch">
                        <div class="realestate-header">
                            <i class="fas fa-building"></i>
                            <h2>ПОИСК НЕДВИЖИМОСТИ</h2>
                        </div>

                        <div class="realestate-controls">
                            <div class="filter-group">
                                <label class="filter-label">ID недвижимости</label>
                                <input type="text" class="realestate-input" id="propertyIdInput" placeholder="Введите ID...">
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">Тип недвижимости</label>
                                <select class="realestate-input" id="propertyTypeSelect">
                                    <option value="all">Все типы</option>
                                    <option value="house">Дома</option>
                                    <option value="apartment">Квартиры</option>
                                </select>
                            </div>

                            <button class="realestate-btn realestate-btn-primary" id="searchPropertyBtn">
                                <i class="fas fa-search"></i> Найти недвижимость
                            </button>
                        </div>

                        <div class="realestate-result">
                            <label class="filter-label">Результат:</label>
                            <div class="property-info" id="propertyInfoResult">
                                <div class="property-placeholder">
                                    <i class="fas fa-home"></i>
                                    <span>Информация появится здесь</span>
                                </div>
                            </div>
                            <button class="realestate-btn realestate-btn-secondary" id="copyPropertyInfoBtn">
                                <i class="fas fa-copy"></i> Копировать информацию
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>

        <!-- 🔔 Уведомление о копировании -->
        <div class="copy-notification" id="copyNotification">
            <i class="fas fa-check-circle"></i> Скопировано!
        </div>
    `;

    // 🎮 КОНФИГУРАЦИЯ API
    const API_BASE = 'https://logs.blackrussia.online/gslogs/36/api';
    const LOGS_ENDPOINT = `${API_BASE}/list-game-logs/`;

    // 🎨 ЦВЕТА ДЛЯ КАТЕГОРИЙ
    const categoryColors = {};

    // 🗂️ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
    let currentPage = 0;
    let currentFilters = {};
    let allCategories = [];
    let isLoading = false;
    let pinnedLogs = [];

    // 🗂️ МАППИНГ КАТЕГОРИЙ
    const categoryMap = {
        60: "BlackPass",
        58: "Helper чат",
        54: "NonRP чат",
        55: "RP чат",
        72: "Tele2",
        53: "VIP чат",
        46: "Админ-блокировки",
        41: "Админ-действия",
        43: "Админ-общий-чат",
        45: "Админ-супердействия",
        39: "Админ-чат",
        6: "Аккаунт игрока",
        26: "Античит",
        8: "Аренда транспорта",
        37: "Аукцион",
        10: "Банковская система",
        2: "Бизнесы",
        27: "Взаимодействие с игроками",
        3: "Взаимодействие с казино",
        44: "Восстановления",
        18: "Донат",
        40: "Жалобы/Вопросы",
        35: "Ивенты",
        16: "Имущество игрока",
        28: "Квесты",
        30: "Контейнеры",
        68: "Крафт",
        49: "Купоны",
        9: "Лицензии",
        17: "Личное транспортное средство",
        21: "Лотерея",
        69: "Маркетплейс",
        13: "Материалы",
        7: "Мероприятия",
        11: "Мобильный телефон",
        65: "Настройки",
        4: "Начальные работы",
        34: "Номера",
        36: "Обмен баллов",
        20: "Объявления",
        0: "Остальное",
        31: "Охота",
        38: "Подключения/Отключания",
        12: "Пожертвования",
        33: "Покупка кустов с наркотиками",
        14: "Покупка предметов в магазине",
        23: "Попрошайничество",
        25: "Промокоды",
        71: "Радиостанция",
        47: "Реклама",
        22: "Реферальная система",
        50: "Рулетка",
        15: "Рыболовство",
        29: "Свадьба",
        52: "Семейный чат",
        5: "Семьи",
        19: "Склад фракции",
        48: "Смена имени",
        42: "Сообщения",
        56: "Телефонные звонки",
        57: "Трейды",
        32: "Ферма",
        24: "Фракции",
        1: "Штрафы"
    };

    // 🛠️ ОСНОВНЫЕ ФУНКЦИИ

    // Форматирование чисел с пробелами
    function formatNumber(number) {
        if (!number && number !== 0) return '—';
        if (isNaN(number)) return '—';
        return Math.abs(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    // СУПЕР-КРАСИВЫЙ CONFETTI ЭФФЕКТ
    function createUltraConfetti() {
        const container = document.getElementById('confettiContainer');
        container.innerHTML = '';

        const confettiTypes = ['', 'circle', 'triangle', 'heart', 'star'];
        const colors = ['#8b5ceb', '#00d4ff', '#ff2a6d', '#23d160', '#ffdd57'];

        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            const type = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];

            confetti.className = `confetti ${type}`;
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = type === '' ? color : 'transparent';
            confetti.style.color = color;
            confetti.style.opacity = '1';

            container.appendChild(confetti);

            // Анимация с GSAP
            if (window.gsap) {
                gsap.to(confetti, {
                    y: window.innerHeight + 100,
                    x: `+=${Math.random() * 200 - 100}`,
                    rotation: Math.random() * 720 - 360,
                    duration: 2 + Math.random() * 1,
                    ease: "power2.out",
                    onComplete: () => {
                        confetti.remove();
                    }
                });

                // Дополнительные эффекты
                gsap.to(confetti, {
                    scale: 0,
                    duration: 0.5,
                    delay: 1.5 + Math.random() * 0.5
                });
            }
        }
    }

    // Функция для показа уведомления о копировании
    function showCopyNotification(text) {
        const notification = document.getElementById('copyNotification');
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${text}`;
        notification.classList.add('show');

        // Запускаем ультра-красивый confetti
        createUltraConfetti();

        // Автоматически скрываем через 1 секунду
        setTimeout(() => {
            notification.classList.remove('show');
        }, 1000);
    }

    // Функция для копирования текста
    function copyToClipboard(text, message = 'Скопировано!') {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification(message);
        }).catch(() => {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopyNotification(message);
        });
    }

    // Функция для закрепления лога
    function pinLog(log) {
        // Проверяем, не закреплен ли уже этот лог
        const isAlreadyPinned = pinnedLogs.some(pinnedLog =>
            pinnedLog.id === log.id ||
            (pinnedLog.time === log.time && pinnedLog.player_id === log.player_id)
        );

        if (!isAlreadyPinned) {
            // Добавляем лог в начало массива (новые сверху)
            pinnedLogs.unshift({
                ...log,
                pinnedAt: new Date().toISOString()
            });

            // Обновляем отображение закрепленных логов
            updatePinnedLogsDisplay();

            // Показываем контейнер с закрепленными логами
            document.getElementById('pinnedLogsContainer').style.display = 'block';

            // Показываем уведомление
            showCopyNotification('Лог закреплен! 📌');
        }
    }

    // Функция для открепления лога
    function unpinLog(logIndex) {
        pinnedLogs.splice(logIndex, 1);
        updatePinnedLogsDisplay();

        // Скрываем контейнер, если нет закрепленных логов
        if (pinnedLogs.length === 0) {
            document.getElementById('pinnedLogsContainer').style.display = 'none';
        }
    }

    // Функция для очистки всех закрепленных логов
    function clearAllPinnedLogs() {
        pinnedLogs = [];
        document.getElementById('pinnedLogsContainer').style.display = 'none';
        updatePinnedLogsDisplay();
    }

    // Обновление отображения закрепленных логов
    function updatePinnedLogsDisplay() {
        const pinnedFeed = document.getElementById('pinnedLogsFeed');

        if (pinnedLogs.length === 0) {
            pinnedFeed.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <i class="fas fa-thumbtack" style="font-size: 2rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <div>Нет закрепленных логов</div>
                </div>
            `;
            return;
        }

        pinnedFeed.innerHTML = pinnedLogs.map((log, index) => createPinnedLogEntry(log, index)).join('');

        // Добавляем обработчики для открепления
        document.querySelectorAll('.unpin-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => unpinLog(index));
        });

        // Добавляем обработчики для копирования в закрепленных логах
        addCopyHandlers();
    }

    // 🔧 ОБНОВЛЕННАЯ ФУНКЦИЯ ДЛЯ ЗАКРЕПЛЕННЫХ ЛОГОВ
    function createPinnedLogEntry(log, index) {
        const categoryName = getCategoryName(log.category_id);
        const categoryColor = categoryColors[categoryName] || generateCategoryColor(categoryName);
        const isNegative = log.transaction_amount && log.transaction_amount < 0;

        const amount = log.transaction_amount ?
            (isNegative ? `- ${formatNumber(Math.abs(log.transaction_amount))}` : `+ ${formatNumber(log.transaction_amount)}`) : '—';
        const amountClass = log.transaction_amount ? (isNegative ? 'negative' : 'positive') : '';

        const dateObj = log.time ? new Date(log.time) : null;
        const date = dateObj ? dateObj.toLocaleDateString('ru-RU') : '—';
        const time = dateObj ? dateObj.toLocaleTimeString('ru-RU') : '—';

        return `
            <div class="pinned-log-row" data-pinned-id="${log.id || index}">
                <div class="pinned-first-row">
                    <div class="pinned-log-number">#${index + 1}</div>

                    <div class="time-container">
                        <div class="log-date" data-copy="${date}" data-message="Дата скопирована!">${date}</div>
                        <div class="log-time" data-copy="${time}" data-message="Время скопировано!">${time}</div>
                    </div>

                    <div class="pinned-log-category" style="background: ${categoryColor}20; color: ${categoryColor}; border-color: ${categoryColor}60;">
                        ${categoryName}
                    </div>

                    <div class="log-player-ultra" data-copy="${log.player_name || 'Неизвестный'}" data-message="Никнейм скопирован!">
                        ${log.player_name || 'Неизвестный'}
                    </div>

                    <div class="log-id-ultra" data-copy="${log.player_id || '—'}" data-message="ID скопирован!">
                        ${log.player_id || '—'}
                    </div>

                    <div class="log-ip-ultra" data-copy="${log.player_ip || '—'}" data-message="IP скопирован!">
                        ${log.player_ip || '—'}
                    </div>

                    <div class="amount-container">
                        <div class="log-amount-ultra ${amountClass}" data-copy="${log.transaction_amount || '—'}" data-message="Сумма скопирована!">
                            ${amount}
                        </div>
                        <div class="log-balance-ultra" data-copy="${log.balance_after || '—'}" data-message="Баланс скопирован!">
                            ${log.balance_after ? formatNumber(log.balance_after) : '—'}
                        </div>
                    </div>

                    <button class="unpin-btn" title="Открепить лог">
                        <i class="fas fa-times"></i> Открепить
                    </button>
                </div>

                <div class="log-description-ultra">
                    <div class="description-text">
                        ${log.transaction_desc || 'Нет описания'}
                    </div>
                    <button class="pin-btn pinned" disabled>
                        <i class="fas fa-thumbtack"></i> Закреплено
                    </button>
                </div>
            </div>
        `;
    }

    // Функция для генерации цвета категории
    function generateCategoryColor(categoryName) {
        const colors = [
            '#8b5ceb', '#23d160', '#00d4ff', '#ffdd57', '#ff6b35',
            '#ff3860', '#ff2a6d', '#a855f7', '#f59e0b', '#10b981',
            '#f97316', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'
        ];

        let hash = 0;
        for (let i = 0; i < categoryName.length; i++) {
            hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    }

    // Загрузка логов с API
    async function loadLogs(filters = {}, page = 0) {
        if (isLoading) return;

        isLoading = true;
        showLoading();

        try {
            const params = new URLSearchParams({
                ...filters,
                offset: page * 50,
                auto: 'false'
            });

            const response = await fetch(`${LOGS_ENDPOINT}?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            displayLogs(data);
            updateStats(data);
            updatePagination(data.length >= 50);

        } catch (error) {
            console.error('Ошибка загрузки логов:', error);
            showError('Ошибка загрузки логов');
        } finally {
            isLoading = false;
            hideLoading();
        }
    }

    // Отображение логов в ультра-формате
    function displayLogs(logs) {
        const logsFeed = document.getElementById('cyberLogsFeed');

        if (!logs || logs.length === 0) {
            logsFeed.innerHTML = `
                <div style="text-align: center; padding: 60px; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <div>Логи не найдены</div>
                </div>
            `;
            return;
        }

        logsFeed.innerHTML = logs.map((log, index) => createUltraLogEntry(log, index)).join('');

        // Добавляем обработчики для копирования
        addCopyHandlers();

        // Добавляем обработчики для закрепления
        addPinHandlers();

        // Анимация появления
        if (window.gsap) {
            gsap.fromTo('.log-row-ultra', {
                opacity: 0,
                y: 30,
                scale: 0.9
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.2)"
            });
        }
    }

    // Создание ультра-записи лога
    function createUltraLogEntry(log, index) {
        // Получаем название категории по ID
        const categoryName = getCategoryName(log.category_id);
        const categoryColor = categoryColors[categoryName] || generateCategoryColor(categoryName);

        const isNegative = log.transaction_amount && log.transaction_amount < 0;
        const amount = log.transaction_amount ?
            (isNegative ? `- ${formatNumber(Math.abs(log.transaction_amount))}` : `+ ${formatNumber(log.transaction_amount)}`) : '—';
        const amountClass = log.transaction_amount ? (isNegative ? 'negative' : 'positive') : '';

        const dateObj = log.time ? new Date(log.time) : null;
        const date = dateObj ? dateObj.toLocaleDateString('ru-RU') : '—';
        const time = dateObj ? dateObj.toLocaleTimeString('ru-RU') : '—';

        return `
            <div class="log-row-ultra" data-log-id="${log.id || index}">
                <div class="first-row-ultra">
                    <div class="log-number-ultra">#${index + 1}</div>

                    <div class="time-container">
                        <div class="log-date" data-copy="${date}" data-message="Дата скопирована!">${date}</div>
                        <div class="log-time" data-copy="${time}" data-message="Время скопировано!">${time}</div>
                    </div>

                    <div class="log-category-ultra" style="background: ${categoryColor}20; color: ${categoryColor}; border-color: ${categoryColor}60;">
                        ${categoryName}
                    </div>

                    <div class="log-player-ultra" data-copy="${log.player_name || 'Неизвестный'}" data-message="Никнейм скопирован!">
                        ${log.player_name || 'Неизвестный'}
                    </div>

                    <div class="log-id-ultra" data-copy="${log.player_id || '—'}" data-message="ID скопирован!">
                        ${log.player_id || '—'}
                    </div>

                    <div class="log-ip-ultra" data-copy="${log.player_ip || '—'}" data-message="IP скопирован!">
                        ${log.player_ip || '—'}
                    </div>

                    <div class="amount-container">
                        <div class="log-amount-ultra ${amountClass}" data-copy="${log.transaction_amount || '—'}" data-message="Сумма скопирована!">
                            ${amount}
                        </div>
                        <div class="log-balance-ultra" data-copy="${log.balance_after || '—'}" data-message="Баланс скопирован!">
                            ${log.balance_after ? formatNumber(log.balance_after) : '—'}
                        </div>
                    </div>
                </div>

                <div class="log-description-ultra">
                    <div class="description-text">
                        ${log.transaction_desc || 'Нет описания'}
                    </div>
                    <button class="pin-btn" data-log-index="${index}">
                        <i class="fas fa-thumbtack"></i> Закрепить
                    </button>
                </div>
            </div>
        `;
    }

    // Добавление обработчиков копирования
    function addCopyHandlers() {
        // Обработчики для всех кликабельных элементов
        document.querySelectorAll('.log-date, .log-time, .log-player-ultra, .log-id-ultra, .log-ip-ultra, .log-amount-ultra, .log-balance-ultra').forEach(el => {
            el.addEventListener('click', function() {
                const text = this.getAttribute('data-copy');
                const message = this.getAttribute('data-message') || 'Скопировано!';

                if (text && text !== '—') {
                    copyToClipboard(text, message);

                    // Анимация элемента
                    const originalBg = this.style.background;
                    const originalBorder = this.style.borderColor;
                    this.style.background = 'rgba(34, 197, 94, 0.3)';
                    this.style.borderColor = 'rgba(34, 197, 94, 0.6)';

                    if (window.gsap) {
                        gsap.to(this, {
                            scale: 1.1,
                            duration: 0.2,
                            yoyo: true,
                            repeat: 1,
                            onComplete: () => {
                                this.style.background = originalBg;
                                this.style.borderColor = originalBorder;
                            }
                        });
                    } else {
                        setTimeout(() => {
                            this.style.background = originalBg;
                            this.style.borderColor = originalBorder;
                        }, 1000);
                    }
                }
            });
        });
    }

    // Добавление обработчиков для закрепления
    function addPinHandlers() {
        document.querySelectorAll('.pin-btn:not(.pinned)').forEach(btn => {
            btn.addEventListener('click', function() {
                const logIndex = parseInt(this.getAttribute('data-log-index'));
                const logRow = document.querySelector(`[data-log-id="${logIndex}"]`);

                if (logRow) {
                    // Получаем данные лога правильно
                    const timeElement = logRow.querySelector('.log-time');
                    const dateElement = logRow.querySelector('.log-date');
                    const amountElement = logRow.querySelector('.log-amount-ultra');
                    const balanceElement = logRow.querySelector('.log-balance-ultra');

                    // Получаем оригинальные значения времени и даты
                    const originalTime = timeElement.textContent;
                    const originalDate = dateElement.textContent;

                    // Получаем числовые значения сумм
                    let transactionAmount = null;
                    let balanceAfter = null;

                    // Парсим сумму транзакции
                    const amountText = amountElement.textContent;
                    if (amountText && amountText !== '—') {
                        const amountValue = amountText.replace(/[+\-\s]/g, '');
                        transactionAmount = amountValue ? parseInt(amountValue) : null;
                    }

                    // Парсим баланс
                    const balanceText = balanceElement.textContent;
                    if (balanceText && balanceText !== '—') {
                        const balanceValue = balanceText.replace(/\s/g, '');
                        balanceAfter = balanceValue ? parseInt(balanceValue) : null;
                    }

                    // Создаем объект с правильными данными
                    const logData = {
                        id: logIndex,
                        time: `${originalDate} ${originalTime}`, // Сохраняем оригинальное время
                        player_name: logRow.querySelector('.log-player-ultra').getAttribute('data-copy'),
                        player_id: logRow.querySelector('.log-id-ultra').getAttribute('data-copy'),
                        player_ip: logRow.querySelector('.log-ip-ultra').getAttribute('data-copy'),
                        category_name: logRow.querySelector('.log-category-ultra').textContent,
                        transaction_amount: transactionAmount,
                        balance_after: balanceAfter,
                        transaction_desc: logRow.querySelector('.description-text').textContent,
                        // Сохраняем отдельно для отображения
                        display_time: originalTime,
                        display_date: originalDate,
                        display_amount: amountText,
                        display_balance: balanceText
                    };

                    pinLog(logData);
                }
            });
        });
    }

    // Форматирование времени
    function formatTime(timeString) {
        if (!timeString) return '—';
        const date = new Date(timeString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Обновление статистики
    function updateStats(logs) {
        document.getElementById('totalLogs').textContent = logs.length;

        const uniquePlayers = new Set(logs.map(log => log.player_id).filter(Boolean));
        document.getElementById('activePlayers').textContent = uniquePlayers.size;

        const totalMoney = logs.reduce((sum, log) => sum + (log.transaction_amount || 0), 0);
        document.getElementById('totalMoney').textContent = formatNumber(totalMoney);

        document.getElementById('lastUpdate').textContent = 'только что';
    }

    // Пагинация
    function updatePagination(hasNextPage) {
        document.getElementById('prevPage').disabled = currentPage === 0;
        document.getElementById('nextPage').disabled = !hasNextPage;
        document.getElementById('pageInfo').textContent = `Страница ${currentPage + 1}`;
    }

    // 🔧 ОБНОВЛЕННАЯ ФУНКЦИЯ ЗАГРУЗКИ КАТЕГОРИЙ
    async function loadCategories() {
        try {
            // Пробуем получить категории из JSON в DOM
            const categoriesScript = document.getElementById('game-log-categories');
            if (categoriesScript) {
                try {
                    const categoriesData = JSON.parse(categoriesScript.textContent);
                    // Обновляем маппинг на основе данных из DOM
                    categoriesData.forEach(cat => {
                        categoryMap[cat.id] = cat.name;
                        if (!categoryColors[cat.name]) {
                            categoryColors[cat.name] = generateCategoryColor(cat.name);
                        }
                    });
                } catch (e) {
                    console.log('Используем статичный маппинг категорий');
                }
            }

            // Заполняем select в фильтрах
            const categorySelect = document.getElementById('category');
            categorySelect.innerHTML = '<option value="">Все категории</option>' +
                Object.entries(categoryMap).map(([id, name]) =>
                    `<option value="${id}">${name}</option>`
                ).join('');

            // Генерируем цвета для всех категорий
            Object.values(categoryMap).forEach(categoryName => {
                if (!categoryColors[categoryName]) {
                    categoryColors[categoryName] = generateCategoryColor(categoryName);
                }
            });

        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    }

    // 🔧 ФУНКЦИЯ ПОЛУЧЕНИЯ НАЗВАНИЯ КАТЕГОРИИ ПО ID
    function getCategoryName(categoryId) {
        return categoryMap[categoryId] || 'Неизвестно';
    }

    // Обработка фильтров
    function getFilters() {
        const categorySelect = document.getElementById('category');
        const selectedCategoryId = categorySelect.value;

        return {
            category_id__exact: selectedCategoryId || '',
            player_name__exact: document.getElementById('playerName').value || '',
            player_id__exact: document.getElementById('playerId').value || '',
            player_ip__exact: document.getElementById('playerIp').value || '',
            transaction_amount__exact: document.getElementById('transactionAmount').value || '',
            balance_after__exact: document.getElementById('balanceAfter').value || '',
            transaction_desc__ilike: document.getElementById('transactionDesc').value || '',
            time__gte: document.getElementById('timeStart').value ?
                new Date(document.getElementById('timeStart').value).toISOString() : '',
            time__lte: document.getElementById('timeEnd').value ?
                new Date(document.getElementById('timeEnd').value).toISOString() : ''
        };
    }

    // Сброс фильтров
    function resetFilters() {
        document.getElementById('playerName').value = '';
        document.getElementById('category').value = '';
        document.getElementById('playerId').value = '';
        document.getElementById('playerIp').value = '';
        document.getElementById('transactionAmount').value = '';
        document.getElementById('balanceAfter').value = '';
        document.getElementById('transactionDesc').value = '';
        document.getElementById('timeStart').value = '';
        document.getElementById('timeEnd').value = '';

        currentPage = 0;
        currentFilters = {};
        loadLogs();
    }

    // UI функции
    function showLoading() {
        const logsFeed = document.getElementById('cyberLogsFeed');
        logsFeed.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <div class="loading-spinner" style="margin: 0 auto 20px;"></div>
                <div>Загрузка логов...</div>
            </div>
        `;
    }

    function hideLoading() {
        // Убирается автоматически при displayLogs
    }

    function showError(message) {
        const logsFeed = document.getElementById('cyberLogsFeed');
        logsFeed.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--danger);">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <div>${message}</div>
                <button class="cyber-btn cyber-btn-primary" onclick="loadLogs()" style="margin-top: 20px;">
                    <i class="fas fa-redo"></i> Попробовать снова
                </button>
            </div>
        `;
    }

    // 🧮 КАЛЬКУЛЯТОР
    function initializeCalculator() {
        const display = document.getElementById('calcDisplay');
        const historyDisplay = document.createElement('div');
        historyDisplay.className = 'calc-history';
        display.parentNode.insertBefore(historyDisplay, display);

        let currentValue = '0';
        let previousValue = '';
        let operator = null;
        let shouldResetDisplay = false;
        let operationHistory = '';

        function updateDisplay() {
            display.value = currentValue;
            historyDisplay.textContent = operationHistory;
        }

        function inputDigit(digit) {
            if (currentValue === '0' || shouldResetDisplay) {
                currentValue = digit;
                shouldResetDisplay = false;
            } else {
                currentValue += digit;
            }
        }

        function inputDecimal() {
            if (shouldResetDisplay) {
                currentValue = '0.';
                shouldResetDisplay = false;
                return;
            }

            if (!currentValue.includes('.')) {
                currentValue += '.';
            }
        }

        function handleOperator(nextOperator) {
            if (previousValue !== '' && operator && !shouldResetDisplay) {
                calculate();
            }

            if (currentValue !== '0' || previousValue !== '') {
                operationHistory = previousValue ? `${previousValue} ${operator} ${currentValue}` : currentValue;
                previousValue = currentValue;
                operator = nextOperator;
                shouldResetDisplay = true;
            }
        }

        function performCalculation() {
            const prev = parseFloat(previousValue);
            const current = parseFloat(currentValue);

            if (isNaN(prev) || isNaN(current)) return currentValue;

            switch (operator) {
                case '+': return prev + current;
                case '-': return prev - current;
                case '*': return prev * current;
                case '/': return current !== 0 ? prev / current : 'Error';
                default: return current;
            }
        }

        function calculate() {
            if (operator && previousValue !== '') {
                const result = performCalculation();
                operationHistory = `${previousValue} ${operator} ${currentValue} = ${result}`;
                currentValue = `${result}`;
                operator = null;
                previousValue = '';
                shouldResetDisplay = true;
            }
        }

        function resetCalculator() {
            currentValue = '0';
            previousValue = '';
            operator = null;
            shouldResetDisplay = false;
            operationHistory = '';
        }

        function clearEntry() {
            currentValue = '0';
            operationHistory = '';
        }

        function backspace() {
            if (currentValue.length > 1 && currentValue !== '0') {
                currentValue = currentValue.slice(0, -1);
            } else {
                currentValue = '0';
            }
        }

        // Обработчики кнопок
        document.querySelectorAll('.calc-btn').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                const number = button.getAttribute('data-number');

                if (number !== null) {
                    inputDigit(number);
                } else if (action === '.') {
                    inputDecimal();
                } else if (action === 'clear') {
                    clearEntry();
                } else if (action === 'clear-all') {
                    resetCalculator();
                } else if (action === 'backspace') {
                    backspace();
                } else if (action === '=') {
                    calculate();
                } else if (['+', '-', '*', '/'].includes(action)) {
                    handleOperator(action);
                }

                updateDisplay();
            });
        });

        updateDisplay();
    }

    // 🎯 ГЕНЕРАТОР КОМАНД
    function initializeCommandGenerator() {
        document.getElementById('generateCommands').addEventListener('click', () => {
            const command = document.getElementById('banCommand').value;
            const playersText = document.getElementById('playersList').value;
            const lines = playersText.split('\n').filter(line => line.trim());
            const commands = lines.map(line => `\`${command} ${line.trim()}\``).join('\n');
            document.getElementById('commandsResult').value = commands;
        });

        document.getElementById('copyCommands').addEventListener('click', () => {
            copyToClipboard(document.getElementById('commandsResult').value, 'Команды скопированы!');
        });
    }

    // 🌐 IP ИНФОРМАТОР
    function initializeIpInfo() {
        document.getElementById('getIpInfo').addEventListener('click', async () => {
            const ip = document.getElementById('ipAddress').value.trim();
            const btn = document.getElementById('getIpInfo');

            if (!ip) {
                showCopyNotification('Введите IP адрес!');
                return;
            }

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Поиск...';
            btn.disabled = true;

            try {
                // Используем CORS proxy чтобы обойти блокировку
                const proxyUrl = 'https://api.allorigins.win/raw?url=';
                const targetUrl = `http://ip-api.com/json/${ip}`;

                const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
                const data = await response.json();

                console.log('IP API Response:', data);

                if (data.status === 'success') {
                    document.getElementById('ipCountry').textContent = data.country || '—';
                    document.getElementById('ipCity').textContent = data.city || '—';
                    document.getElementById('ipIsp').textContent = data.isp || '—';
                    document.getElementById('ipRegion').textContent = data.regionName || '—';
                    document.getElementById('ipTimezone').textContent = data.timezone || '—';
                    document.getElementById('ipCoordinates').textContent =
                        data.lat && data.lon ? `Ш: ${data.lat}, Д: ${data.lon}` : '—';

                    showCopyNotification('Информация получена! ✅');
                } else {
                    showCopyNotification('IP не найден ❌');
                }

            } catch (error) {
                console.error('IP API Error:', error);
                showCopyNotification('Ошибка получения данных ❌');
            } finally {
                btn.innerHTML = '<i class="fas fa-search"></i> Получить информацию';
                btn.disabled = false;
            }
        });

        document.getElementById('copyIpInfo').addEventListener('click', () => {
            const text = `IP Информация:
Страна: ${document.getElementById('ipCountry').textContent}
Город: ${document.getElementById('ipCity').textContent}
Провайдер: ${document.getElementById('ipIsp').textContent}
Регион: ${document.getElementById('ipRegion').textContent}
Часовой пояс: ${document.getElementById('ipTimezone').textContent}
Координаты: ${document.getElementById('ipCoordinates').textContent}`;

            copyToClipboard(text, 'IP информация скопирована! 📋');
        });
    }

    // 📸 ЗАГРУЗЧИК СКРИНШОТОВ
    function initializeScreenshotUploader() {
        const screenshotInput = document.getElementById('screenshotInput');
        const uploadBtn = document.getElementById('uploadScreenshot');
        const preview = document.getElementById('screenshotPreview');
        const imageUrlInput = document.getElementById('imageUrl');
        const copyUrlBtn = document.getElementById('copyImageUrl');

        const IMGBB_API_KEY = 'b385c3dac9032298767fb825567c7bae';

        let currentFiles = [];

        // Функция для отображения превью нескольких файлов
        function showPreview(files) {
            currentFiles = Array.from(files);
            preview.innerHTML = '';

            currentFiles.forEach((file, index) => {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview ${index + 1}">
                        <div class="preview-info">${file.name} (${Math.round(file.size/1024)}KB)</div>
                    `;
                    preview.appendChild(previewItem);
                };

                reader.readAsDataURL(file);
            });

            // Обновляем label
            const label = document.querySelector('.file-input-label');
            if (label) {
                label.textContent = `Файлов: ${currentFiles.length}`;
                label.style.color = 'var(--accent-tertiary)';
            }

            showCopyNotification(`Загружено файлов: ${currentFiles.length} 📁`);
        }

        // Обработка выбора файлов
        screenshotInput.addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                showPreview(files);
            }
        });

        // Обработка Ctrl+V на ВСЕЙ СТРАНИЦЕ
        document.addEventListener('paste', function(e) {
            const items = e.clipboardData?.items;
            if (!items) return;

            const newFiles = [];
            for (let item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const file = item.getAsFile();
                    if (file) {
                        newFiles.push(file);
                    }
                }
            }

            if (newFiles.length > 0) {
                // Добавляем новые файлы к существующим
                const allFiles = [...currentFiles, ...newFiles];
                const dataTransfer = new DataTransfer();

                allFiles.forEach(file => {
                    dataTransfer.items.add(file);
                });

                screenshotInput.files = dataTransfer.files;
                showPreview(allFiles);
            }
        });

        // Загрузка всех файлов на imgBB
        uploadBtn.addEventListener('click', async function() {
            if (currentFiles.length === 0) {
                showCopyNotification('Выберите файлы или вставьте скриншоты! 📁');
                return;
            }

            uploadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Загрузка ${currentFiles.length} файлов...`;
            uploadBtn.disabled = true;

            try {
                const uploadResults = [];

                // Загружаем каждый файл по очереди
                for (let i = 0; i < currentFiles.length; i++) {
                    const file = currentFiles[i];

                    const formData = new FormData();
                    formData.append('image', file);

                    const fileName = document.getElementById('screenshotName').value
                        ? `${document.getElementById('screenshotName').value}_${i+1}`
                        : `screenshot_${i+1}`;

                    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}&name=${fileName}`, {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();

                    if (data.success) {
                        uploadResults.push({
                            name: file.name,
                            url: data.data.url,
                            size: data.data.size,
                            dimensions: `${data.data.width}x${data.data.height}`
                        });

                        // Показываем прогресс
                        showCopyNotification(`Загружено ${i+1}/${currentFiles.length} ✅`);
                    } else {
                        uploadResults.push({
                            name: file.name,
                            error: data.error?.message || 'Ошибка загрузки'
                        });
                    }

                    // Небольшая задержка между запросами
                    if (i < currentFiles.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }

                // Формируем результат
                const successUploads = uploadResults.filter(r => !r.error);
                const errorUploads = uploadResults.filter(r => r.error);

                if (successUploads.length > 0) {
                    const allUrls = successUploads.map((r, index) => `${index + 1}. ${r.url}`).join('\n');
                    imageUrlInput.value = allUrls;

                    showCopyNotification(`Успешно загружено: ${successUploads.length}/${currentFiles.length} файлов! 🎉`);

                    // Автоматически копируем все ссылки
                    setTimeout(() => {
                        copyToClipboard(allUrls, `Скопировано ${successUploads.length} ссылок! 📋`);
                    }, 1000);
                } else {
                    showCopyNotification('Все файлы не удалось загрузить ❌');
                }

            } catch (error) {
                console.error('Upload error:', error);
                showCopyNotification('Ошибка загрузки: ' + error.message);
            } finally {
                uploadBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Загрузить на imgBB';
                uploadBtn.disabled = false;
            }
        });

        copyUrlBtn.addEventListener('click', function() {
            if (imageUrlInput.value) {
                const urlCount = imageUrlInput.value.split('\n').filter(url => url.trim()).length;
                copyToClipboard(imageUrlInput.value, `Скопировано ${urlCount} ссылок! 📋`);
            }
        });
    }

    // 🏠 ПОИСК НЕДВИЖИМОСТИ
    function initializeRealEstateSearch() {
        const searchBtn = document.getElementById('searchPropertyBtn');
        const input = document.getElementById('propertyIdInput');
        const resultDiv = document.getElementById('propertyInfoResult');
        const copyBtn = document.getElementById('copyPropertyInfoBtn');

        if (!searchBtn) return;

        // Простая заглушка для демонстрации
        searchBtn.addEventListener('click', function() {
            const propertyId = input.value.trim();

            if (!propertyId) {
                resultDiv.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">❌ Введите ID недвижимости!</div>';
                return;
            }

            // Заглушка с тестовыми данными
            resultDiv.innerHTML = `
                <div class="property-item"><span class="property-label">ID:</span><span class="property-value">${propertyId}</span></div>
                <div class="property-item"><span class="property-label">Тип:</span><span class="property-value">🏠 Дом</span></div>
                <div class="property-item"><span class="property-label">Местоположение:</span><span class="property-value">Лос-Сантос</span></div>
                <div class="property-item"><span class="property-label">Цена:</span><span class="property-value" style="color: #00ff00;">$500,000</span></div>
            `;

            showCopyNotification('Информация найдена! ✅');
        });

        copyBtn.addEventListener('click', function() {
            const items = resultDiv.querySelectorAll('.property-item');
            if (items.length === 0) return;

            let text = 'Информация о недвижимости:\n\n';
            items.forEach(item => {
                const label = item.querySelector('.property-label').textContent;
                const value = item.querySelector('.property-value').textContent;
                text += `${label}: ${value}\n`;
            });

            copyToClipboard(text, 'Информация скопирована! 📋');
        });
    }

    // 📦 ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
    function initializeApp() {
        console.log('🚀 ИНИЦИАЛИЗАЦИЯ NEO-LOGS ULTRA...');

        // Инициализация библиотек
        if (window.particlesJS) {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 100, density: { enable: true, value_area: 800 } },
                    color: { value: "#8b5ceb" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#8b5ceb",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "repulse" },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    }
                }
            });
        }

        if (window.VanillaTilt && document.querySelector('.cyber-filters')) {
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                max: 5,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
            });
        }

        // Загрузка данных
        loadCategories();
        loadLogs();

        // Обработчики событий
        document.getElementById('applyFilters').addEventListener('click', function() {
            currentPage = 0;
            currentFilters = getFilters();
            loadLogs(currentFilters, currentPage);
        });

        document.getElementById('resetFilters').addEventListener('click', resetFilters);

        document.getElementById('nextPage').addEventListener('click', function() {
            if (!this.disabled) {
                currentPage++;
                loadLogs(currentFilters, currentPage);
            }
        });

        document.getElementById('prevPage').addEventListener('click', function() {
            if (!this.disabled) {
                currentPage--;
                loadLogs(currentFilters, currentPage);
            }
        });

        // Обработчик для очистки закрепленных логов
        document.getElementById('clearPinnedBtn').addEventListener('click', clearAllPinnedLogs);

        // Инициализация дополнительных функций
        initializeCalculator();
        initializeCommandGenerator();
        initializeIpInfo();
        initializeScreenshotUploader();
        initializeRealEstateSearch();

        // Делаем функции глобальными для обработчиков
        window.loadLogs = loadLogs;
        window.pinLog = pinLog;
        window.unpinLog = unpinLog;
        window.clearAllPinnedLogs = clearAllPinnedLogs;

        console.log('✅ NEO-LOGS ULTRA УСПЕШНО ЗАПУЩЕН!');
    }

    // 🚀 ЗАПУСК ПРИЛОЖЕНИЯ
    function startApp() {
        console.log('🚀 ЗАПУСК NEO-LOGS ULTRA...');
        initializeApp();
    }

    // Несколько способов запуска на всякий случай
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApp);
    } else {
        startApp();
    }

    // Экстренный запуск через 2 секунды если что-то пошло не так
    setTimeout(startApp, 2000);

})();