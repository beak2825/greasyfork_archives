// ==UserScript==
// @name         Tribox Contest Results Graph
// @namespace    https://greasyfork.org/ja/users/1556148
// @license      MIT
// @version      2026.01.04.10
// @description  Tribox Contestの今までのタイムのグラフをマイページに表示するスクリプト
// @author       nattyu3
// @match        https://contest.tribox.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tribox.com
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561433/Tribox%20Contest%20Results%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/561433/Tribox%20Contest%20Results%20Graph.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 設定 ---
    const INITIAL_DELAY = 3000; // ページ表示からクリック開始までの待ち時間 (ms)
    const CLICK_INTERVAL = 1500; // クリックごとの間隔 (ms) - 重いサイト用に長めに設定

    // --- グローバル変数 ---
    let chartInstance = null;
    let eventSelect = null;
    let statusSpan = null; // 進捗表示用

    // データを格納するメインの辞書
    const graphData = {};

    // 読み込み済みフラグ管理
    const processedRows = new Set();

    let isInitialized = false;
    let updateTimer = null;

    // イベントIDマップ
    const EVENT_MAP = {
        'e333': '3x3x3', 'e222': '2x2x2', 'e444': '4x4x4',
        'e555': '5x5x5', 'e666': '6x6x6', 'e777': '7x7x7',
        'e333bf': '3x3x3 目隠し', 'e333fm': '3x3x3 最少手数', 'e333oh': '3x3x3 片手',
        'emega': 'Megaminx', 'epyra': 'Pyraminx', 'eskewb': 'Skewb',
        'esq1': 'Square-1', 'eclock': 'Clock'
    };

    console.log('Tribox Graph v10: Safe Auto Loaded.');

    // 1. 初期化監視
    const bodyObserver = new MutationObserver((mutations, observer) => {
        if (isInitialized) return;

        const headers = Array.from(document.querySelectorAll('h3'));
        const targetHeader = headers.find(el => el.innerText.includes('参加履歴'));

        if (targetHeader) {
            isInitialized = true;

            // グラフエリア作成
            initGraphArea(targetHeader, 'before');

            // 最初のデータスキャン（今シーズンの分）
            scanNewRows();

            // 過去ログボタンを自動クリック（少し待ってから）
            setTimeout(() => {
                autoExpandSeasons();
            }, INITIAL_DELAY);

            observer.disconnect();
            startDataObserver();
        }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // --- 自動展開 ---
    function autoExpandSeasons() {
        console.log('Tribox Graph v10: Starting auto-click sequence...');

        // IDが "show-past-" で始まるaタグ（ボタン）を取得
        // 既に開かれている(btn-empty)ものは除外してもいいが、
        // 念のため未クリックっぽいもの(btn-success)を優先、あるいは全部押す
        const buttons = Array.from(document.querySelectorAll('a[id^="show-past-"]'));

        if (buttons.length === 0) {
            updateStatus("No history found.");
            return;
        }

        buttons.forEach((btn, index) => {
            setTimeout(() => {
                updateStatus(`Auto-loading... ${index + 1}/${buttons.length}`);
                btn.click();

                // 最後なら完了表示
                if (index === buttons.length - 1) {
                    setTimeout(() => updateStatus("Ready"), 1000);
                }
            }, index * CLICK_INTERVAL);
        });
    }

    // --- UI作成 ---
    function initGraphArea(targetElement, position) {
        if (document.getElementById('tribox-graph-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'tribox-graph-wrapper';
        wrapper.style.marginBottom = '30px';
        wrapper.style.padding = '15px';
        wrapper.style.backgroundColor = '#fff';
        wrapper.style.border = '1px solid #ddd';
        wrapper.style.borderRadius = '5px';
        wrapper.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

        const header = document.createElement('div');
        header.style.marginBottom = '10px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';

        // タイトル部分コンテナ
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.alignItems = 'baseline';
        titleContainer.style.gap = '10px';

        const title = document.createElement('h4');
        title.innerText = '📈 Time Progress';
        title.style.margin = '0';
        title.style.color = '#333';

        // 進捗表示用
        statusSpan = document.createElement('span');
        statusSpan.style.fontSize = '12px';
        statusSpan.style.color = '#666';
        statusSpan.innerText = 'Waiting...';

        titleContainer.appendChild(title);
        titleContainer.appendChild(statusSpan);

        eventSelect = document.createElement('select');
        eventSelect.style.padding = '4px';
        eventSelect.addEventListener('change', () => renderChart(eventSelect.value));

        header.appendChild(titleContainer);
        header.appendChild(eventSelect);
        wrapper.appendChild(header);

        const canvasDiv = document.createElement('div');
        canvasDiv.style.position = 'relative';
        canvasDiv.style.height = '300px';
        canvasDiv.style.width = '100%';

        const canvas = document.createElement('canvas');
        canvasDiv.appendChild(canvas);
        wrapper.appendChild(canvasDiv);

        if (position === 'before') {
            targetElement.parentNode.insertBefore(wrapper, targetElement);
        } else {
            targetElement.appendChild(wrapper);
        }
    }

    function updateStatus(text) {
        if (statusSpan) statusSpan.innerText = text;
    }

    // --- データ監視 ---
    function startDataObserver() {
        const dataObserver = new MutationObserver(() => {
            // DOM変更のたびに即実行すると重いので、少し待ってからスキャン
            if (updateTimer) clearTimeout(updateTimer);
            updateTimer = setTimeout(() => {
                scanNewRows();
            }, 300);
        });
        dataObserver.observe(document.body, { childList: true, subtree: true });
    }

    // --- メインロジック ---
    function scanNewRows() {
        const tables = document.querySelectorAll('table');
        let hasUpdates = false;

        tables.forEach((table) => {
            let eventName = findPreviousHeading(table);
            if (!eventName) {
                const firstRow = table.querySelector('tbody tr[id]');
                if (firstRow && firstRow.id.includes('-')) {
                    const eventId = firstRow.id.split('-')[0];
                    if (EVENT_MAP[eventId]) eventName = EVENT_MAP[eventId];
                }
            }
            if (!eventName) return;

            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                // 1. ユニークID取得・生成
                let uniqueId = row.id;
                let roundText = "";

                if (row.cells.length > 0) {
                    roundText = row.cells[0].innerText.trim();
                }

                if (!uniqueId) {
                    uniqueId = `Current-${eventName}-${roundText}`;
                }

                // 2. 読み込み済みチェック
                if (processedRows.has(uniqueId)) {
                    return;
                }

                // 3. データ解析
                let timeVal = null;
                const detailsCell = row.querySelector('.mb-hide');
                let targetCell = null;

                if (detailsCell && detailsCell.previousElementSibling) {
                    targetCell = detailsCell.previousElementSibling;
                } else if (row.cells.length > 2) {
                    targetCell = row.cells[2];
                }

                if (!targetCell) return;

                const rawTime = targetCell.innerText.trim();
                timeVal = parseFloat(rawTime);
                if (isNaN(timeVal)) timeVal = null;

                // ラベル・ソートキー
                let label = "";
                let sortKey = 0;

                const idMatch = (row.id || "").match(/-(\d{4})(\d)(\d+)/);

                if (idMatch) {
                    const year = idMatch[1].substring(2, 4);
                    const seasonNum = parseInt(idMatch[2]);
                    const roundNum = parseInt(idMatch[3]);

                    const termChar = seasonNum === 1 ? 'F' : 'S';
                    const roundPad = roundNum.toString().padStart(2, '0');

                    label = `${year}${termChar}${roundPad}`;
                    sortKey = parseInt(idMatch[1]) + (seasonNum === 2 ? 0.5 : 0.0) + (roundNum / 10000);

                } else {
                    const rNumMatch = roundText.match(/\d+/);
                    const rNum = rNumMatch ? parseInt(rNumMatch[0]) : 0;

                    label = `Now${rNum.toString().padStart(2, '0')}`;
                    sortKey = 9999 + (rNum / 10000);
                }

                if (!graphData[eventName]) graphData[eventName] = [];

                graphData[eventName].push({
                    label: label,
                    time: timeVal,
                    rawTime: rawTime,
                    sortKey: sortKey
                });

                processedRows.add(uniqueId);
                hasUpdates = true;
            });
        });

        if (hasUpdates) {
            updateSelect(Object.keys(graphData));
            const currentEvent = eventSelect.value || Object.keys(graphData)[0];
            renderChart(currentEvent);
        }
    }

    function findPreviousHeading(node) {
        let current = node;
        let depth = 0;
        while (current && depth < 10) {
            let sibling = current.previousElementSibling;
            while (sibling) {
                if (['H3', 'H4', 'div'].includes(sibling.tagName)) {
                    const text = sibling.innerText.trim();
                    if (text && !text.includes('履歴') && !text.includes('一覧') && text.length < 30) {
                        return text.split('\n')[0];
                    }
                }
                sibling = sibling.previousElementSibling;
            }
            current = current.parentElement;
            depth++;
        }
        return null;
    }

    function updateSelect(events) {
        const current = eventSelect.value;
        if (eventSelect.options.length === events.length) return;

        eventSelect.innerHTML = '';
        events.forEach(evt => {
            const opt = document.createElement('option');
            opt.value = evt;
            opt.innerText = evt;
            eventSelect.appendChild(opt);
        });
        if (events.includes(current)) {
            eventSelect.value = current;
        } else if (events.length > 0) {
            eventSelect.value = events[0];
        }
    }

    function renderChart(eventName) {
        if (!graphData[eventName]) return;

        const dataPoints = graphData[eventName].sort((a, b) => a.sortKey - b.sortKey);

        const canvas = document.querySelector('#tribox-graph-wrapper canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (chartInstance) chartInstance.destroy();

        const labels = dataPoints.map(d => d.label);
        const values = dataPoints.map(d => d.time);

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${eventName} Time`,
                    data: values,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    spanGaps: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Time (s)' }
                    },
                    x: {
                        ticks: {
                            maxRotation: 90,
                            minRotation: 90,
                            autoSkip: true,
                            maxTicksLimit: 100
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return labels[context[0].dataIndex];
                            },
                            afterLabel: function(context) {
                                const d = dataPoints[context.dataIndex];
                                return `Avg: ${d.rawTime}`;
                            }
                        }
                    }
                }
            }
        });
    }
})();