// ==UserScript==
// @name         FMP Position Analyzer and Comparator - Modern
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Modern multi-language FMP position analyzer with advanced player comparison and beautiful UI
// @author       FMP Assistant
// @match        https://footballmanagerproject.com/Team/Player*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557016/FMP%20Position%20Analyzer%20and%20Comparator%20-%20Modern.user.js
// @updateURL https://update.greasyfork.org/scripts/557016/FMP%20Position%20Analyzer%20and%20Comparator%20-%20Modern.meta.js
// ==/UserScript==

/*
 * FMP Position Analyzer and Comparator v4.4
 * Modern multi-language FMP position analyzer with beautiful UI
 * Features advanced player comparison, custom charts, and modern design
 *
 * Author: FMP Assistant
 * License: MIT
 */

(function() {
    'use strict';

    // ===== MULTI-LANGUAGE SUPPORT =====
    const translations = {
        en: {
            savePlayer: '💾 Save Player',
            compareWindow: '📊 Comparison Window',
            modalTitle: '👥 Player Comparison',
            clearList: 'Clear List',
            savedCount: 'Saved players',
            noPlayers: 'No players saved. Go to player profile and click "Save".',
            confirmClear: 'Delete all saved players?',
            playerSaved: ' saved successfully!',
            maxPlayers: 'Maximum 5 players. Please clear list first.',
            unknownPlayer: 'Unknown Player',
            unknownPosition: 'Unknown',
            age: 'Age',
            salary: 'Salary',
            rating: 'Rating',
            quality: 'Quality',
            points: 'POINTS',
            difference: 'DIFF',
            feature: 'FEATURE',
            tableView: 'Table View',
            chartView: 'Chart View',
            skillsChart: 'Skills Radar Chart',
            physical: 'Physical',
            technical: 'Technical',
            mental: 'Mental',
            attacking: 'Attacking',
            defending: 'Defending',
            overallRating: 'Overall Rating',
            sortBy: 'Sort by',
            highToLow: 'High → Low',
            lowToHigh: 'Low → High',
            apply: 'Apply',
            topPlayers: 'Top Players'
        },
        tr: {
            savePlayer: '💾 Oyuncuyu Kaydet',
            compareWindow: '📊 Karşılaştırma Penceresi',
            modalTitle: '👥 Oyuncu Karşılaştırma',
            clearList: 'Listeyi Temizle',
            savedCount: 'Kayıtlı oyuncular',
            noPlayers: 'Henüz oyuncu kaydedilmedi. Oyuncu profiline gidip "Kaydet" butonuna basın.',
            confirmClear: 'Tüm kayıtlı oyuncular silinsin mi?',
            playerSaved: ' başarıyla kaydedildi!',
            maxPlayers: 'Maksimum 5 oyuncu. Lütfen önce listeyi temizleyin.',
            unknownPlayer: 'Bilinmeyen Oyuncu',
            unknownPosition: 'Bilinmiyor',
            age: 'Yaş',
            salary: 'Maaş',
            rating: 'Derece',
            quality: 'Kalite',
            points: 'PUAN',
            difference: 'FARK',
            feature: 'ÖZELLİK',
            tableView: 'Tablo Görünümü',
            chartView: 'Grafik Görünümü',
            skillsChart: 'Yetenek Radar Grafiği',
            physical: 'Fiziksel',
            technical: 'Teknik',
            mental: 'Mental',
            attacking: 'Hücum',
            defending: 'Savunma',
            overallRating: 'Genel Değerlendirme',
            sortBy: 'Sırala',
            highToLow: 'Yüksek → Düşük',
            lowToHigh: 'Düşük → Yüksek',
            apply: 'Uygula',
            topPlayers: 'En İyi Oyuncular'
        }
    };

    // Auto-detect game language
    function detectGameLanguage() {
        const htmlLang = document.documentElement.lang;
        if (htmlLang && translations[htmlLang]) {
            return htmlLang;
        }

        const bodyText = document.body.innerText;
        if (bodyText.includes('Yaş') || bodyText.includes('Maaş')) return 'tr';
        return 'en';
    }

    const currentLang = detectGameLanguage();
    const t = translations[currentLang] || translations.en;

    // ===== POSITION DEFINITIONS =====
    const positionSkills = {
        'KL': { primary: ['Poz', '1e1', 'ElK'], secondary: ['Ref', 'HH', 'Sçr', 'Zıp'] },
        'GK': { primary: ['Poz', '1e1', 'ElK'], secondary: ['Ref', 'HH', 'Sçr', 'Zıp'] },
        'DC': { primary: ['Mrkj', 'TpK', 'Poz'], secondary: ['Kaf', 'Day', 'Hız'] },
        'DL': { primary: ['TpK', 'Ort', 'Poz'], secondary: ['Pas', 'Tek', 'Hız'] },
        'DR': { primary: ['TpK', 'Ort', 'Poz'], secondary: ['Pas', 'Tek', 'Hız'] },
        'DMC': { primary: ['Mrkj', 'TpK', 'Poz'], secondary: ['Kaf', 'Pas', 'Day'] },
        'MC': { primary: ['Pas', 'Tek', 'Poz'], secondary: ['TpK', 'Kaf', 'Day'] },
        'ML': { primary: ['Ort', 'Pas', 'Poz'], secondary: ['Tek', 'Kaf', 'Hız'] },
        'MR': { primary: ['Ort', 'Pas', 'Poz'], secondary: ['Tek', 'Kaf', 'Hız'] },
        'AMC': { primary: ['Pas', 'Bit', 'Tek'], secondary: ['Ort', 'Uza', 'Poz'] },
        'AML': { primary: ['Ort', 'Pas', 'Poz'], secondary: ['Tek', 'Bit', 'Hız'] },
        'AMR': { primary: ['Ort', 'Pas', 'Poz'], secondary: ['Tek', 'Bit', 'Hız'] },
        'FC': { primary: ['Bit', 'Kaf'], secondary: ['Uza', 'Poz', 'Hız'] },
        'ST': { primary: ['Bit', 'Kaf'], secondary: ['Uza', 'Poz', 'Hız'] }
    };

    // ===== SKILL CATEGORIES FOR CHARTS =====
    const skillCategories = {
        technical: ['Pas', 'Tek', 'Ort', 'Şut', 'Bit', 'Kaf', 'Uza'],
        physical: ['Hız', 'Çab', 'Day', 'Kuv', 'Zıp'],
        mental: ['Mrkj', 'Poz', 'TpK', 'Ces', 'HH', 'Tak', 'Kar'],
        goalkeeping: ['Poz', '1e1', 'ElK', 'Ref', 'HH', 'Sçr', 'Zıp']
    };

    // ===== MODERN COLOR SCHEME =====
    const colors = {
        primary: '#6366f1',
        primaryDark: '#4f46e5',
        secondary: '#ec4899',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        dark: '#1f2937',
        light: '#f8fafc',
        background: '#ffffff',
        surface: '#f8fafc',
        border: '#e2e8f0',
        text: '#1f2937',
        textLight: '#6b7280'
    };

    // ===== CUSTOM CHART SYSTEM =====

    function createCustomRadarChart(players, containerId) {
        const playerIds = Object.keys(players);
        if (playerIds.length === 0) return '';

        const keySkills = ['Pas', 'Tek', 'Bit', 'Kaf', 'Hız', 'Day', 'Mrkj', 'TpK', 'Ort', 'Ref'];
        const centerX = 150, centerY = 150, radius = 120;
        const angleStep = (2 * Math.PI) / keySkills.length;

        let svgHTML = `<svg width="300" height="300" viewBox="0 0 300 300" class="fmp-radar-svg">`;

        // Draw grid circles with gradient
        for (let i = 1; i <= 5; i++) {
            const circleRadius = radius * (i / 5);
            svgHTML += `<circle cx="${centerX}" cy="${centerY}" r="${circleRadius}" fill="none" stroke="url(#gridGradient)" stroke-width="1" opacity="0.6"/>`;
        }

        // Define gradients
        svgHTML += `
            <defs>
                <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${colors.primary}" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="${colors.secondary}" stop-opacity="0.3" />
                </linearGradient>
            </defs>
        `;

        // Draw axis lines and labels
        keySkills.forEach((skill, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            // Axis line
            svgHTML += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="${colors.border}" stroke-width="1" opacity="0.5"/>`;

            // Skill label
            const labelX = centerX + (radius + 15) * Math.cos(angle);
            const labelY = centerY + (radius + 15) * Math.sin(angle);
            const textAnchor = Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle';

            svgHTML += `<text x="${labelX}" y="${labelY}" text-anchor="${textAnchor}" dominant-baseline="middle" font-size="11" font-weight="600" fill="${colors.text}">${skill}</text>`;
        });

        // Draw player data
        const playerColors = [colors.primary, colors.secondary, colors.success, colors.warning, colors.danger];

        playerIds.forEach((id, playerIndex) => {
            const player = players[id];
            const color = playerColors[playerIndex] || colors.dark;
            let points = [];

            keySkills.forEach((skill, skillIndex) => {
                const angle = skillIndex * angleStep - Math.PI / 2;
                const value = player.skills[skill] || 0;
                const scaledRadius = radius * (value / 100);
                const x = centerX + scaledRadius * Math.cos(angle);
                const y = centerY + scaledRadius * Math.sin(angle);
                points.push(`${x},${y}`);
            });

            // Draw polygon with gradient
            svgHTML += `<polygon points="${points.join(' ')}" fill="${color}20" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>`;

            // Draw data points
            points.forEach(point => {
                const [x, y] = point.split(',').map(Number);
                svgHTML += `<circle cx="${x}" cy="${y}" r="3" fill="${color}" stroke="${colors.background}" stroke-width="1"/>`;
            });
        });

        svgHTML += `</svg>`;

        // Modern legend
        let legendHTML = '<div class="fmp-radar-legend">';
        playerIds.forEach((id, index) => {
            const player = players[id];
            const color = playerColors[index] || colors.dark;
            legendHTML += `<div class="fmp-legend-item">
                <span class="fmp-legend-color" style="background: linear-gradient(135deg, ${color}, ${darkenColor(color, 20)});"></span>
                <span class="fmp-legend-name">${player.name}</span>
            </div>`;
        });
        legendHTML += '</div>';

        return `<div class="fmp-radar-container">${svgHTML}${legendHTML}</div>`;
    }

    function createCustomBarChart(players, containerId) {
        const playerIds = Object.keys(players);
        if (playerIds.length === 0) return '';

        const categories = [t.technical, t.physical, t.mental];
        const categorySkills = {
            [t.technical]: skillCategories.technical,
            [t.physical]: skillCategories.physical,
            [t.mental]: skillCategories.mental
        };

        const playerColors = [colors.primary, colors.secondary, colors.success, colors.warning, colors.danger];
        let html = '<div class="fmp-bar-chart">';

        categories.forEach(category => {
            html += `<div class="fmp-bar-category">
                <div class="fmp-bar-label">${category}</div>
                <div class="fmp-bars-container">`;

            playerIds.forEach((id, index) => {
                const player = players[id];
                const skills = categorySkills[category];
                const total = skills.reduce((sum, skill) => sum + (player.skills[skill] || 0), 0);
                const average = skills.length > 0 ? total / skills.length : 0;
                const color = playerColors[index] || colors.dark;

                html += `<div class="fmp-bar-wrapper">
                    <span class="fmp-bar-player">${player.name}</span>
                    <div class="fmp-bar-background">
                        <div class="fmp-bar" style="width: ${average}%; background: linear-gradient(90deg, ${color}, ${darkenColor(color, 10)});">
                            <span class="fmp-bar-value">${Math.round(average)}</span>
                        </div>
                    </div>
                </div>`;
            });

            html += `</div></div>`;
        });

        html += '</div>';
        return html;
    }

    // ===== MODERN STYLES =====
    GM_addStyle(`
        :root {
            --primary: ${colors.primary};
            --primary-dark: ${colors.primaryDark};
            --secondary: ${colors.secondary};
            --success: ${colors.success};
            --warning: ${colors.warning};
            --danger: ${colors.danger};
            --dark: ${colors.dark};
            --light: ${colors.light};
            --background: ${colors.background};
            --surface: ${colors.surface};
            --border: ${colors.border};
            --text: ${colors.text};
            --text-light: ${colors.textLight};
        }

        .fmp-primary-skill { 
            background: linear-gradient(135deg, var(--warning), #fbbf24) !important; 
            color: var(--dark) !important; 
            font-weight: 600 !important; 
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
        }
        .fmp-secondary-skill { 
            background: linear-gradient(135deg, var(--primary), var(--secondary)) !important; 
            color: white !important; 
            font-weight: 600 !important; 
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
        }
        #playerdata .skilltable th, #playerdata .skilltable td { 
            padding: 4px 8px !important; 
            transition: all 0.2s ease;
        }

        /* Modern Modal Styles */
        .fmp-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(31, 41, 55, 0.8);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fmp-modal-overlay.active {
            visibility: visible;
            opacity: 1;
        }
        .fmp-modal {
            background: var(--background);
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
            width: 95%;
            max-width: 1400px;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid var(--border);
        }
        .fmp-modal.active {
            transform: translateY(0) scale(1);
        }
        .fmp-modal-header {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            padding: 20px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .fmp-modal-title {
            font-size: 20px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .fmp-modal-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            line-height: 1;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        }
        .fmp-modal-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
        .fmp-modal-content {
            padding: 24px;
            overflow-y: auto;
            flex-grow: 1;
            background: var(--surface);
        }

        /* Modern Tabs */
        .fmp-tabs {
            display: flex;
            margin-bottom: 24px;
            background: var(--background);
            border-radius: 12px;
            padding: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid var(--border);
        }
        .fmp-tab {
            padding: 12px 24px;
            cursor: pointer;
            border: none;
            border-radius: 8px;
            margin: 0 2px;
            background: transparent;
            color: var(--text-light);
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            flex: 1;
            text-align: center;
        }
        .fmp-tab.active {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .fmp-tab:hover:not(.active) {
            background: rgba(99, 102, 241, 0.1);
            color: var(--primary);
        }
        .fmp-tab-content {
            display: none;
            animation: fadeIn 0.3s ease;
        }
        .fmp-tab-content.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Modern Comparison Table */
        #fmp-compare-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 16px;
            font-size: 0.95em;
            background: var(--background);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: 1px solid var(--border);
        }
        #fmp-compare-table th, #fmp-compare-table td {
            border: none;
            padding: 12px 8px;
            text-align: center;
            transition: all 0.2s ease;
        }
        #fmp-compare-table th {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
        }
        #fmp-compare-table tbody tr:nth-child(even) {
            background: rgba(248, 250, 252, 0.8);
        }
        #fmp-compare-table tbody tr:hover {
            background: rgba(99, 102, 241, 0.05);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .fmp-diff-positive { 
            color: var(--success); 
            font-weight: 700; 
            background: rgba(16, 185, 129, 0.1);
            padding: 4px 8px;
            border-radius: 6px;
        }
        .fmp-diff-negative { 
            color: var(--danger); 
            font-weight: 700; 
            background: rgba(239, 68, 68, 0.1);
            padding: 4px 8px;
            border-radius: 6px;
        }
        .fmp-clear-btn {
            background: linear-gradient(135deg, var(--danger), #dc2626);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9em;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        .fmp-clear-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
        }

        /* Modern Radar Chart */
        .fmp-radar-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 24px 0;
            padding: 20px;
            background: var(--background);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: 1px solid var(--border);
        }
        .fmp-radar-svg {
            border-radius: 8px;
            background: var(--surface);
            padding: 16px;
        }
        .fmp-radar-legend {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
            margin-top: 20px;
        }
        .fmp-legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: var(--surface);
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .fmp-legend-color {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .fmp-legend-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--text);
        }

        /* Modern Bar Chart */
        .fmp-bar-chart {
            margin: 24px 0;
        }
        .fmp-bar-category {
            margin-bottom: 24px;
            padding: 20px;
            background: var(--background);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: 1px solid var(--border);
        }
        .fmp-bar-label {
            font-weight: 700;
            margin-bottom: 16px;
            color: var(--text);
            font-size: 16px;
            text-align: center;
        }
        .fmp-bars-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .fmp-bar-wrapper {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .fmp-bar-background {
            flex: 1;
            background: var(--surface);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            height: 32px;
        }
        .fmp-bar {
            height: 100%;
            min-width: 40px;
            border-radius: 8px;
            position: relative;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .fmp-bar-value {
            color: white;
            font-weight: 700;
            font-size: 12px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .fmp-bar-player {
            min-width: 140px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text);
        }

        /* Modern Chart Container */
        .fmp-chart-container {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            margin-top: 24px;
        }
        .fmp-chart-wrapper {
            flex: 1;
            min-width: 320px;
            background: var(--background);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: 1px solid var(--border);
            transition: all 0.3s ease;
        }
        .fmp-chart-wrapper:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .fmp-chart-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
            color: var(--text);
            position: relative;
        }
        .fmp-chart-title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 3px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 2px;
        }

        /* Modern Player Cards */
        .fmp-player-cards {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 24px;
        }
        .fmp-player-card {
            flex: 1;
            min-width: 220px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .fmp-player-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--secondary), var(--warning));
        }
        .fmp-player-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4);
        }
        .fmp-player-card h4 {
            margin: 0 0 12px 0;
            font-size: 16px;
            font-weight: 700;
        }
        .fmp-player-card p {
            margin: 6px 0;
            font-size: 13px;
            opacity: 0.9;
        }

        /* Modern Buttons */
        #fmp-save-player-btn, #fmp-open-modal-btn {
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            margin-left: 12px;
            white-space: nowrap;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
        }
        #fmp-save-player-btn::before, #fmp-open-modal-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        #fmp-save-player-btn:hover::before, #fmp-open-modal-btn:hover::before {
            left: 100%;
        }
        #fmp-save-player-btn {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        }
        #fmp-save-player-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }
        #fmp-open-modal-btn {
            background: linear-gradient(135deg, var(--success), #059669);
        }
        #fmp-open-modal-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        /* Modern Sorting Controls */
        .fmp-sorting-controls {
            background: var(--background);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: 1px solid var(--border);
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
        }
        .fmp-sorting-controls strong {
            color: var(--text);
            font-weight: 600;
            font-size: 14px;
        }
        .fmp-sorting-controls select {
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 10px 12px;
            background: var(--surface);
            color: var(--text);
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        .fmp-sorting-controls select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .fmp-sorting-controls button {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .fmp-sorting-controls button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }

        /* Modern Top Players */
        .fmp-top-players {
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
            color: white;
            padding: 24px;
            border-radius: 16px;
            margin: 24px 0;
            position: relative;
            overflow: hidden;
        }
        .fmp-top-players::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,0 L100,0 L100,100 Z" fill="rgba(255,255,255,0.1)"/></svg>');
            background-size: cover;
        }
        .fmp-top-players h4 {
            margin: 0 0 20px 0;
            text-align: center;
            font-size: 18px;
            font-weight: 700;
            position: relative;
            z-index: 1;
        }
        .fmp-top-players-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
            position: relative;
            z-index: 1;
        }
        .fmp-top-player-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 16px;
            border-radius: 12px;
            text-align: center;
            min-width: 140px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .fmp-top-player-card:hover {
            transform: translateY(-4px);
            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        .fmp-top-player-card .medal {
            font-size: 32px;
            margin-bottom: 8px;
            display: block;
        }
        .fmp-top-player-card strong {
            display: block;
            margin-bottom: 4px;
            font-size: 14px;
        }
        .fmp-top-player-card small {
            opacity: 0.9;
            font-size: 12px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .fmp-modal {
                width: 98%;
                margin: 10px;
            }
            .fmp-tabs {
                flex-direction: column;
            }
            .fmp-chart-wrapper {
                min-width: 100%;
            }
            .fmp-player-cards {
                flex-direction: column;
            }
            .fmp-sorting-controls {
                flex-direction: column;
                align-items: stretch;
            }
            .fmp-sorting-controls select {
                margin: 4px 0;
            }
        }
    `);

    // ===== HELPER FUNCTIONS =====
    function darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // ===== CORE FUNCTIONS =====
    // [Previous core functions remain the same, but updated to use new translation keys]
    // [Include all the previous functions like getPlayerMainPosition, highlightSkills, extractPlayerName, etc.]
    // [They remain functionally the same but will use the new modern styling]

    function getPlayerMainPosition() {
        const posElement = document.querySelector('.pitch-position');
        if (posElement) return posElement.textContent.trim();

        const positionElementB = document.querySelector('#playerdata .playerpos b');
        if (positionElementB) {
            const text = positionElementB.textContent.trim();
            return text.split(' ')[0].replace(/[^a-zA-Z]/g, '').toUpperCase();
        }
        return t.unknownPosition;
    }

    function highlightSkills() {
        const mainPosition = getPlayerMainPosition();
        if (!positionSkills[mainPosition]) return;

        const config = positionSkills[mainPosition];
        const skillTable = document.querySelector('#playerdata .skilltable');
        if (!skillTable) return;

        const headers = skillTable.querySelectorAll('th');
        headers.forEach((th, index) => {
            const skillName = th.textContent.trim();
            const isPrimary = config.primary.includes(skillName);
            const isSecondary = config.secondary.includes(skillName);

            if (isPrimary || isSecondary) {
                if (isPrimary) th.classList.add('fmp-primary-skill');
                if (isSecondary) th.classList.add('fmp-secondary-skill');

                const parentRow = th.parentElement;
                const valueRow = parentRow.nextElementSibling;
                if (valueRow && valueRow.children[index]) {
                    const valueCell = valueRow.children[index];
                    const numSpan = valueCell.querySelector('.num');
                    const styleClass = isPrimary ? 'fmp-primary-skill' : 'fmp-secondary-skill';
                    if (numSpan) numSpan.classList.add(styleClass);
                    else valueCell.classList.add(styleClass);
                }
            }
        });
    }

    function extractPlayerName() {
        let nameElement = $('.lheader h3');
        if (nameElement.length === 0) nameElement = $('h1');
        if (nameElement.length === 0) nameElement = $('.lheader').find(':header').first();

        if (nameElement.length > 0) {
            let rawText = nameElement.contents().filter(function() {
                return this.nodeType === 3;
            }).text().trim();

            if (!rawText) rawText = nameElement.text().trim();
            let cleanName = rawText.replace(/^\d+\.\s*/, '').trim();
            if (cleanName) return cleanName;
        }
        return t.unknownPlayer;
    }

    async function extractPlayerData() {
        const player = {};
        const urlParams = new URLSearchParams(window.location.search);
        player.id = urlParams.get('id');
        player.name = extractPlayerName();
        player.position = getPlayerMainPosition();

        if (!player.id) return null;

        // Extract skills from table
        player.skills = {};
        const skillTable = $('#playerdata .skilltable');
        const headers = skillTable.find('th');
        const values = skillTable.find('td');

        headers.each((index, th) => {
            const skillName = $(th).text().trim();
            const skillValueText = $(values[index]).text().trim();
            const skillValue = parseInt(skillValueText.match(/(\d+)/)?.[0], 10) || 0;
            if(skillName) {
                player.skills[skillName] = skillValue;
            }
        });

        // Extract additional data from JSON
        try {
            const response = await fetch(`/Team/Player?handler=PlayerData&playerId=${player.id}`);
            if (response.ok) {
                const json = await response.json();
                if (json && json.player) {
                    if (json.player.age) player.age = `${json.player.age.years} ${t.age} ${json.player.age.months}M`;
                    if (json.player.wage) player.salary = json.player.wage.toLocaleString();
                    if (json.player.rating) {
                        player.rating = json.player.rating;
                        player.lastRating = json.player.rating;
                    }
                    if (json.player.qi) player.qi = json.player.qi;
                }
            }
        } catch (e) {
            console.error("JSON data fetch failed:", e);
        }

        // Fallback data extraction
        const infoText = $('.infotable').text();
        if (!player.age) {
            const ageMatch = infoText.match(/(Yaş|Age|Alter|Edad|Âge|Età)\s*(\d+)[.,](\d+)/);
            player.age = ageMatch ? `${ageMatch[2]} ${t.age} ${ageMatch[3]}M` : t.unknownPosition;
        }
        if (!player.salary || player.salary === t.unknownPosition) {
            const wageMatch = infoText.match(/(Maaş|Wage|Gehalt|Salario|Salaire|Stipendio)\s*ⓕ\s*([\d,.]+)/);
            player.salary = wageMatch ? wageMatch[2] : t.unknownPosition;
        }

        player.value = t.unknownPosition;
        player.timestamp = new Date().toLocaleString();
        player.lang = currentLang;
        return player;
    }

    async function savePlayer() {
        const player = await extractPlayerData();
        if (!player) {
            alert('Player data could not be fetched. Please refresh the page.');
            return;
        }

        let savedPlayers = await GM_getValue('fmp_saved_players', {});
        if (Object.keys(savedPlayers).length >= 5 && !savedPlayers[player.id]) {
            alert(t.maxPlayers);
            return;
        }

        savedPlayers[player.id] = player;
        await GM_setValue('fmp_saved_players', savedPlayers);
        alert(player.name + t.playerSaved);
        await updateCompareModal();
    }

    // ===== MODERN MODAL FUNCTIONS =====
    function createModal() {
        if ($('#fmp-modal-overlay').length) return;

        const modalHTML = `
            <div class="fmp-modal-overlay" id="fmp-modal-overlay">
                <div class="fmp-modal" id="fmp-modal">
                    <div class="fmp-modal-header" id="fmp-modal-header">
                        <h3 class="fmp-modal-title">${t.modalTitle}</h3>
                        <button class="fmp-modal-close" id="fmp-modal-close">×</button>
                    </div>
                    <div class="fmp-modal-content" id="fmp-modal-content">
                        <div class="fmp-tabs">
                            <div class="fmp-tab active" data-tab="table">${t.tableView}</div>
                            <div class="fmp-tab" data-tab="chart">${t.chartView}</div>
                        </div>
                        <div id="fmp-tab-table" class="fmp-tab-content active">
                            <p>${t.noPlayers}</p>
                        </div>
                        <div id="fmp-tab-chart" class="fmp-tab-content">
                            <p>${t.noPlayers}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalHTML);

        // Close modal functionality
        $('#fmp-modal-close, #fmp-modal-overlay').on('click', function(e) {
            if (e.target === this) {
                $('#fmp-modal-overlay').removeClass('active');
                $('#fmp-modal').removeClass('active');
            }
        });

        // Tab functionality
        $('.fmp-tab').on('click', function() {
            const tabId = $(this).data('tab');
            $('.fmp-tab').removeClass('active');
            $('.fmp-tab-content').removeClass('active');
            $(this).addClass('active');
            $(`#fmp-tab-${tabId}`).addClass('active');
        });

        makeModalDraggable();
    }

    function makeModalDraggable() {
        const modal = document.getElementById('fmp-modal');
        const header = document.getElementById('fmp-modal-header');

        let isDragging = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

        header.addEventListener("mousedown", dragStart);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", dragEnd);

        function dragStart(e) {
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
                setTranslate(currentX, currentY, modal);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    // ===== MODERN SORTING AND RANKING FUNCTIONS =====
    function addSortingFeatures() {
        const sortHTML = `
            <div class="fmp-sorting-controls">
                <strong>${t.sortBy}:</strong>
                <select id="fmp-sort-criteria">
                    <option value="rating">${t.quality} (${t.rating})</option>
                    <option value="overall">${t.overallRating}</option>
                    <option value="technical">${t.technical}</option>
                    <option value="physical">${t.physical}</option>
                    <option value="mental">${t.mental}</option>
                    <option value="age">${t.age}</option>
                    <option value="salary">${t.salary}</option>
                </select>
                <select id="fmp-sort-order">
                    <option value="desc">${t.highToLow}</option>
                    <option value="asc">${t.lowToHigh}</option>
                </select>
                <button id="fmp-apply-sort">${t.apply}</button>
            </div>
            <div id="fmp-top-players"></div>
        `;
        
        $('#fmp-tab-table').prepend(sortHTML);
        $('#fmp-tab-chart').prepend(sortHTML);
        
        $('#fmp-apply-sort').on('click', applySorting);
    }

    async function applySorting() {
        const criteria = $('#fmp-sort-criteria').val();
        const order = $('#fmp-sort-order').val();
        
        const players = await GM_getValue('fmp_saved_players', {});
        const sortedPlayers = sortPlayers(players, criteria, order);
        
        await updateCompareTableWithSorting(sortedPlayers);
        showTopPlayers(sortedPlayers, criteria);
    }

    function sortPlayers(players, criteria, order) {
        const playerArray = Object.entries(players);
        
        playerArray.sort((a, b) => {
            let valueA = getPlayerValue(a[1], criteria);
            let valueB = getPlayerValue(b[1], criteria);
            
            if (order === 'desc') {
                return valueB - valueA;
            } else {
                return valueA - valueB;
            }
        });
        
        const sortedPlayers = {};
        playerArray.forEach(([id, player]) => {
            sortedPlayers[id] = player;
        });
        
        return sortedPlayers;
    }

    function getPlayerValue(player, criteria) {
        switch(criteria) {
            case 'rating':
                return parseFloat(player.rating) || 0;
                
            case 'overall':
                const allSkills = Object.values(player.skills || {});
                return allSkills.length > 0 ? allSkills.reduce((a, b) => a + b, 0) / allSkills.length : 0;
                
            case 'technical':
                const techSkills = skillCategories.technical.map(skill => player.skills[skill] || 0);
                return techSkills.length > 0 ? techSkills.reduce((a, b) => a + b, 0) / techSkills.length : 0;
                
            case 'physical':
                const physSkills = skillCategories.physical.map(skill => player.skills[skill] || 0);
                return physSkills.length > 0 ? physSkills.reduce((a, b) => a + b, 0) / physSkills.length : 0;
                
            case 'mental':
                const mentalSkills = skillCategories.mental.map(skill => player.skills[skill] || 0);
                return mentalSkills.length > 0 ? mentalSkills.reduce((a, b) => a + b, 0) / mentalSkills.length : 0;
                
            case 'age':
                const ageMatch = (player.age || '').match(/(\d+)/);
                return ageMatch ? parseInt(ageMatch[1]) : 99;
                
            case 'salary':
                const salaryMatch = (player.salary || '').replace(/[^0-9]/g, '');
                return salaryMatch ? parseInt(salaryMatch) : 0;
                
            default:
                return 0;
        }
    }

    function showTopPlayers(players, criteria) {
        const playerIds = Object.keys(players);
        if (playerIds.length === 0) return;
        
        const criteriaLabels = {
            'rating': t.quality,
            'overall': t.overallRating,
            'technical': t.technical,
            'physical': t.physical,
            'mental': t.mental,
            'age': t.age,
            'salary': t.salary
        };
        
        let html = `<div class="fmp-top-players">
            <h4>🏆 ${criteriaLabels[criteria]} ${t.topPlayers}</h4>
            <div class="fmp-top-players-grid">`;
        
        playerIds.slice(0, 3).forEach((id, index) => {
            const player = players[id];
            const value = getPlayerValue(player, criteria);
            const medals = ['🥇', '🥈', '🥉'];
            
            html += `
                <div class="fmp-top-player-card">
                    <span class="medal">${medals[index] || '🎯'}</span>
                    <strong>${player.name}</strong>
                    <small>${value.toFixed(1)} puan</small>
                </div>
            `;
        });
        
        html += `</div></div>`;
        $('#fmp-top-players').html(html);
    }

    async function updateCompareTableWithSorting(sortedPlayers) {
        const tableHTML = createCompareTable(sortedPlayers);
        $('#fmp-tab-table').find('table').remove();
        $('#fmp-tab-table').append(tableHTML);
    }

    function createCompareTable(players) {
        const playerIds = Object.keys(players);
        const allSkills = new Set();
        playerIds.forEach(id => {
            if(players[id].skills) {
                Object.keys(players[id].skills).forEach(skill => allSkills.add(skill));
            }
        });
        const sortedSkills = Array.from(allSkills).sort();

        let html = '<table id="fmp-compare-table"><thead><tr>';
        html += `<th style="width:10%">${t.feature}</th>`;

        playerIds.forEach(id => {
            const displayName = (players[id].name && players[id].name !== t.unknownPlayer) ? players[id].name : `Player ${players[id].id}`;
            html += `<th colspan="2">${displayName.toUpperCase()} <br><small>(${players[id].position})</small></th>`;
        });
        html += '</tr><tr><th>&nbsp;</th>';
        playerIds.forEach(() => { html += `<th>${t.points}</th><th>${t.difference}</th>`; });
        html += '</tr></thead><tbody>';

        const infoKeys = [
            { label: t.age, key: 'age' },
            { label: t.salary, key: 'salary' },
            { label: `${t.quality} (${t.rating})`, key: 'rating' },
            { label: 'QI', key: 'qi' }
        ];

        infoKeys.forEach(info => {
            html += `<tr class="fmp-key-info-row"><td><b>${info.label}</b></td>`;
            playerIds.forEach(id => {
                let val = players[id][info.key] || '-';
                html += `<td colspan="2" style="font-weight:bold;">${val}</td>`;
            });
            html += '</tr>';
        });

        // Pozisyon bazlı renklendirme
        sortedSkills.forEach(skill => {
            html += `<tr><td style="text-align:left;font-weight:bold;">${skill}</td>`;
            const refVal = players[playerIds[0]].skills[skill] || 0;

            playerIds.forEach((id, idx) => {
                const player = players[id];
                const val = player.skills[skill] || 0;
                let diffHtml = '';
                
                // Pozisyon yetenek kontrolü
                const pos = player.position;
                let skillClass = '';
                if (positionSkills[pos]) {
                    if (positionSkills[pos].primary.includes(skill)) {
                        skillClass = 'fmp-primary-skill';
                    } else if (positionSkills[pos].secondary.includes(skill)) {
                        skillClass = 'fmp-secondary-skill';
                    }
                }

                if (idx > 0) {
                    const diff = val - refVal;
                    if (diff > 0) diffHtml = `<span class="fmp-diff-positive">+${diff}</span>`;
                    else if (diff < 0) diffHtml = `<span class="fmp-diff-negative">${diff}</span>`;
                    else diffHtml = '<span style="color:gray">-</span>';
                }

                html += `<td class="${skillClass}">${val}</td><td>${diffHtml}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }

    function createPlayerCards(players) {
        const playerIds = Object.keys(players);
        if (playerIds.length === 0) return '';

        let html = '<div class="fmp-player-cards">';
        playerIds.forEach((id, index) => {
            const player = players[id];
            const cardColors = [
                `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                `linear-gradient(135deg, ${colors.secondary}, #db2777)`,
                `linear-gradient(135deg, ${colors.success}, #059669)`,
                `linear-gradient(135deg, ${colors.warning}, #d97706)`,
                `linear-gradient(135deg, ${colors.danger}, #dc2626)`
            ];

            html += `
                <div class="fmp-player-card" style="background: ${cardColors[index] || cardColors[0]};">
                    <h4>${player.name}</h4>
                    <p><strong>${t.quality}:</strong> ${player.rating || 'N/A'}</p>
                    <p><strong>${t.position}:</strong> ${player.position}</p>
                    <p><strong>${t.age}:</strong> ${player.age || 'N/A'}</p>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    async function updateCompareModal() {
        const players = await GM_getValue('fmp_saved_players', {});
        const playerIds = Object.keys(players);

        let tableHTML = '';
        let chartHTML = '';

        if (playerIds.length === 0) {
            tableHTML = `<p style="text-align: center; padding: 40px; color: var(--text-light);">${t.noPlayers}</p>`;
            chartHTML = `<p style="text-align: center; padding: 40px; color: var(--text-light);">${t.noPlayers}</p>`;
        } else {
            tableHTML = `
                <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 16px;">
                    <button class="fmp-clear-btn" id="fmp-clear-btn">${t.clearList}</button>
                    <span style="font-size: 0.9em; color: var(--text-light);">
                        ${t.savedCount}: ${playerIds.length}/5
                    </span>
                </div>
                ${createCompareTable(players)}
            `;

            chartHTML = `
                <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 16px;">
                    <button class="fmp-clear-btn" id="fmp-clear-btn-chart">${t.clearList}</button>
                    <span style="font-size: 0.9em; color: var(--text-light);">
                        ${t.savedCount}: ${playerIds.length}/5
                    </span>
                </div>
                ${createPlayerCards(players)}
                <div class="fmp-chart-container">
                    <div class="fmp-chart-wrapper">
                        <div class="fmp-chart-title">${t.skillsChart}</div>
                        ${createCustomRadarChart(players, 'fmp-radar-chart')}
                    </div>
                    <div class="fmp-chart-wrapper">
                        <div class="fmp-chart-title">${t.technical} / ${t.physical} / ${t.mental}</div>
                        ${createCustomBarChart(players, 'fmp-bar-chart')}
                    </div>
                </div>
            `;
        }

        $('#fmp-tab-table').html(tableHTML);
        $('#fmp-tab-chart').html(chartHTML);

        if (playerIds.length > 0) {
            addSortingFeatures();
        }

        $('#fmp-clear-btn, #fmp-clear-btn-chart').on('click', async () => {
            if (confirm(t.confirmClear)) {
                await GM_setValue('fmp_saved_players', {});
                await updateCompareModal();
            }
        });
    }

    function openModal() {
        $('#fmp-modal-overlay').addClass('active');
        $('#fmp-modal').addClass('active');
    }

    function createOpenModalButton() {
        if ($('#fmp-open-modal-btn').length) return;
        const $headerCell = $('.lheader h3').parent();
        if ($headerCell.length) {
            const $btn = $(`<button id="fmp-open-modal-btn">${t.compareWindow}</button>`);
            $btn.on('click', openModal);
            $('#fmp-save-player-btn').after($btn);
        }
    }

    function createSaveButton() {
        if ($('#fmp-save-player-btn').length) return;
        const $headerCell = $('.lheader h3').parent();
        if ($headerCell.length) {
            const $btn = $(`<button id="fmp-save-player-btn">${t.savePlayer}</button>`);
            $btn.on('click', savePlayer);
            $('.lheader h3').after($btn);
        }
    }

    // ===== INITIALIZATION =====
    setTimeout(async () => {
        createSaveButton();
        createModal();
        createOpenModalButton();
        highlightSkills();
        await updateCompareModal();
    }, 1000);

})();