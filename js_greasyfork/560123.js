// ==UserScript==
// @name         LOGS - 17
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Счетчик для логов!
// @author
// @match        https://logs.blackrussia.online/gslogs/17/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560123/LOGS%20-%2017.user.js
// @updateURL https://update.greasyfork.org/scripts/560123/LOGS%20-%2017.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        #customMenu {
            display: none;
            position: fixed;
            top: 70px;
            right: 20px;
            width: 320px;
            max-height: 90vh;
            overflow-y: auto;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #4CAF50;
            border-radius: 15px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.5s ease forwards;
            transition: all 0.3s ease;
        }
        #customMenu.show {
            display: block;
        }
        @keyframes fadeIn {
            from {opacity: 0; transform: translateY(-20px);}
            to {opacity: 1; transform: translateY(0);}
        }
        .customButton {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 10px 20px;
            margin: 5px 5px 10px 0;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s, transform 0.2s;
        }
        .customButton:hover {
            background-color: #45a049;
            transform: scale(1.05);
        }
        input, select {
            margin: 5px 0;
            padding: 8px;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 8px;
        }
        #result {
            margin-top: 15px;
            font-weight: bold;
            color: #333;
        }
        #mpTable {
            display: none;
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        #mpTable th, #mpTable td {
            border: 1px solid #4CAF50;
            padding: 8px;
            text-align: left;
        }
        #mpTable th {
            background-color: #4CAF50;
            color: white;
        }
        .modeButton {
            display: inline-block;
            margin: 5px 5px 10px 0;
            padding: 8px 12px;
            border: 2px solid #4CAF50;
            border-radius: 10px;
            background: none;
            color: #4CAF50;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .modeButton.active {
            background-color: #4CAF50;
            color: white;
        }
    `;
    document.head.appendChild(style);

    const openButton = document.createElement('button');
    openButton.innerText = '📋 Меню логов';
    openButton.className = 'customButton';
    openButton.style.position = 'fixed';
    openButton.style.top = '10px';
    openButton.style.right = '20px';
    openButton.style.zIndex = 9999;
    document.body.appendChild(openButton);

    const menu = document.createElement('div');
    menu.id = 'customMenu';
    menu.innerHTML = `
        <div>
            <div id="modeButtons">
                <button class="modeButton" data-mode="actions">Действия</button>
                <button class="modeButton" data-mode="mp">МП</button>
                <button class="modeButton" data-mode="reports">Репорты</button>
            </div>
        </div>
        <div id="nicknameField">
            <label>Ник:</label>
            <input type="text" id="nickname" placeholder="Введите ник...">
        </div>
        <div>
            <label>Начальная дата:</label>
            <input type="datetime-local" id="startDate">
        </div>
        <div>
            <label>Конечная дата:</label>
            <input type="datetime-local" id="endDate">
        </div>
        <button id="searchButton" class="customButton">🔍 Искать</button>
        <div id="result"></div>
        <table id="mpTable">
            <thead>
                <tr>
                    <th>Администратор</th>
                    <th>Количество</th>
                </tr>
            </thead>
            <tbody id="mpTableBody"></tbody>
        </table>
    `;
    document.body.appendChild(menu);

    let currentMode = 'actions';

    openButton.addEventListener('click', () => {
        menu.classList.toggle('show');
    });

    document.querySelectorAll('.modeButton').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.modeButton').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentMode = e.target.dataset.mode;
            document.getElementById('nicknameField').style.display = (currentMode === 'actions') ? 'block' : 'none';
            const mpTable = document.getElementById('mpTable');
            mpTable.style.display = (currentMode !== 'actions') ? 'table' : 'none';
            document.getElementById('mpTableBody').innerHTML = '';
            document.getElementById('result').innerHTML = '';
        });
    });

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    document.getElementById('searchButton').addEventListener('click', async () => {
        const nickname = document.getElementById('nickname').value.trim();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const resultDiv = document.getElementById('result');
        const mpTable = document.getElementById('mpTable');
        const mpTableBody = document.getElementById('mpTableBody');

        if (!startDate || !endDate || (currentMode === 'actions' && !nickname)) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        resultDiv.innerHTML = 'Идет поиск... ⏳';
        mpTableBody.innerHTML = '';
        mpTable.style.display = (currentMode !== 'actions') ? 'table' : 'none';
        let totalLogs = 0;
        let mpCounts = {};

        if (currentMode === 'actions') {
            const categories = [41, 45, 40];
            for (const category of categories) {
                let offset = 0;
                while (true) {
                    const url = `https://logs.blackrussia.online/gslogs/17/api/list-game-logs/?category_id__exact=${category}&player_name__exact=${encodeURIComponent(nickname)}&time__gte=${startDate}&time__lte=${endDate}&order_by=time&offset=${offset}&auto=false`;
                    try {
                        await sleep(1000);
                        const response = await fetch(url);
                        const data = await response.json();
                        if (!data || data.length === 0) break;

                        const validActions = data.filter(entry => !entry.transaction_desc.includes('Закончил следить за'));

                        totalLogs += validActions.length;
                        offset += 200;
                    } catch (error) {
                        console.error(error);
                        break;
                    }
                }
            }
        }
        else if (currentMode === 'mp' || currentMode === 'reports') {
            let offset = 0;
            while (true) {
                let url;
                if (currentMode === 'mp') {
                    url = `https://logs.blackrussia.online/gslogs/17/api/list-game-logs/?category_id__exact=41&transaction_desc__ilike=%25%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BB+%D0%BC%D0%B5%D1%80%D0%BE%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D0%B5%25&time__gte=${startDate}&time__lte=${endDate}&order_by=time&offset=${offset}&auto=false`;
                } else if (currentMode === 'reports') {
                    url = `https://logs.blackrussia.online/gslogs/17/api/list-game-logs/?category_id__exact=40&player_name__exact=&player_id__exact=&player_ip__exact=&transaction_amount__exact=&balance_after__exact=&transaction_desc__ilike=%25%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D0%B0+%D0%BE%D1%82%25%25%D0%9E%D1%82%D0%B2%D0%B5%D1%82%3A%25&time__gte=${startDate}&time__lte=${endDate}&order_by=time&offset=${offset}&auto=false`;
                }

                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    if (!data || data.length === 0) break;
                    totalLogs += data.length;

                    for (const entry of data) {
                        const name = entry.player_name;
                        if (!mpCounts[name]) mpCounts[name] = 0;
                        mpCounts[name]++;
                    }

                    const sortedEntries = Object.entries(mpCounts).sort((a, b) => b[1] - a[1]);
                    mpTableBody.innerHTML = sortedEntries.map(([player, count]) => `<tr><td>${player}</td><td>${count}</td></tr>`).join('');

                    offset += 200;
                    await sleep(1000);
                } catch (error) {
                    console.error(error);
                    break;
                }
            }
        }

        resultDiv.innerHTML = `✅ Найдено записей: <b>${totalLogs}</b>`;
    });

})();
