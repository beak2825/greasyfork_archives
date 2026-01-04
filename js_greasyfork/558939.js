// ==UserScript==
// @name         Bitcointalk Board Stats (con Cards, % Merit e Grafico Giornaliero)
// @namespace    http://tampermonkey.net/
// @version      4.2.1
// @description  Statistiche board Bitcointalk con cards colorate, percentuale post con Merit, grafico Merit giornalieri e tutte le statistiche originali. Utilizza il nuovo endpoint di bitlist.co con limite 1000.
// @author       Ace
// @match        https://bitcointalk.org/*
// @grant        GM_xmlhttpRequest
// @grant        fetch
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558939/Bitcointalk%20Board%20Stats%20%28con%20Cards%2C%20%25%20Merit%20e%20Grafico%20Giornaliero%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558939/Bitcointalk%20Board%20Stats%20%28con%20Cards%2C%20%25%20Merit%20e%20Grafico%20Giornaliero%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per caricare Chart.js dinamicamente
    async function loadChartJS() {
        return new Promise((resolve, reject) => {
            if (window.Chart) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Funzione per aprire l'immagine del grafico in una nuova scheda
    function openChartImage(canvasId, chartTitle) {
        const canvas = document.getElementById(canvasId);
        const image = canvas.toDataURL('image/png');
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
                <head>
                    <title>${chartTitle}</title>
                </head>
                <body style="text-align: center; padding: 20px;">
                    <h3>${chartTitle}</h3>
                    <img src="${image}" style="max-width: 100%; border: 1px solid #ccc;" />
                    <p>Clicca con il tasto destro sull'immagine e seleziona "Salva immagine con nome" per scaricarla.</p>
                </body>
            </html>
        `);
        newWindow.document.close();
    }

    // Funzione per recuperare il nome di una board
    async function fetchBoardName(boardId) {
        return new Promise((resolve) => {
            const boards = [
                { board_id: 28, name: "Italiano (Italian)" },
                { board_id: 170, name: "Mercato" },
                { board_id: 115, name: "Mining (Italiano)" },
                { board_id: 132, name: "Alt-Currencies (Italiano)" },
                { board_id: 144, name: "Raduni/Meeting (Italiano)" },
                { board_id: 145, name: "Off-Topic (Italiano)" },
                { board_id: 153, name: "Guide (Italiano)" },
                { board_id: 162, name: "Accuse scam/truffe" },
                { board_id: 165, name: "Crittografia e decentralizzazione" },
                { board_id: 169, name: "Progetti" },
                { board_id: 175, name: "Trading, analisi e speculazione" },
                { board_id: 205, name: "Discussioni avanzate e sviluppo" },
                { board_id: 46, name: "Mercato valute" },
                { board_id: 107, name: "Beni" },
                { board_id: 171, name: "Servizi" },
                { board_id: 172, name: "Esercizi commerciali" },
                { board_id: 173, name: "Hardware/Mining (Italiano)" },
                { board_id: 176, name: "Annunci" },
                { board_id: 200, name: "Gambling (Italiano)" }
            ];
            const board = boards.find(b => b.board_id == boardId);
            resolve(board ? board.name : `Board ${boardId}`);
        });
    }

    // Funzione per recuperare l'elenco delle board
    async function fetchAllBoards() {
        return new Promise((resolve) => {
            const boards = [
                { id: 28, name: "Italiano (Italian)", displayName: "28 - Italiano (Italian)" },
                { id: 170, name: "Mercato", displayName: "170 - Mercato" },
                { id: 115, name: "Mining (Italiano)", displayName: "115 - Mining (Italiano)" },
                { id: 132, name: "Alt-Currencies (Italiano)", displayName: "132 - Alt-Currencies (Italiano)" },
                { id: 144, name: "Raduni/Meeting (Italiano)", displayName: "144 - Raduni/Meeting (Italiano)" },
                { id: 145, name: "Off-Topic (Italiano)", displayName: "145 - Off-Topic (Italiano)" },
                { id: 153, name: "Guide (Italiano)", displayName: "153 - Guide (Italiano)" },
                { id: 162, name: "Accuse scam/truffe", displayName: "162 - Accuse scam/truffe" },
                { id: 165, name: "Crittografia e decentralizzazione", displayName: "165 - Crittografia e decentralizzazione" },
                { id: 169, name: "Progetti", displayName: "169 - Progetti" },
                { id: 175, name: "Trading, analisi e speculazione", displayName: "175 - Trading, analisi e speculazione" },
                { id: 205, name: "Discussioni avanzate e sviluppo", displayName: "205 - Discussioni avanzate e sviluppo" },
                { id: 46, name: "Mercato valute", displayName: "46 - Mercato valute" },
                { id: 107, name: "Beni", displayName: "107 - Beni" },
                { id: 171, name: "Servizi", displayName: "171 - Servizi" },
                { id: 172, name: "Esercizi commerciali", displayName: "172 - Esercizi commerciali" },
                { id: 173, name: "Hardware/Mining (Italiano)", displayName: "173 - Hardware/Mining (Italiano)" },
                { id: 176, name: "Annunci", displayName: "176 - Annunci" },
                { id: 200, name: "Gambling (Italiano)", displayName: "200 - Gambling (Italiano)" }
            ];
            resolve(boards);
        });
    }

    // Funzione per recuperare i dati Merit da più board (nuovo endpoint con limite 1000)
    async function fetchMeritBatchData(boardIds, startDate, endDate) {
        const payload = {
            "0": { "json": null, "meta": { "values": ["undefined"], "v": 1 } },
            "1": {
                "json": {
                    "date_min": startDate,
                    "date_max": endDate,
                    "board_id": boardIds,
                    "limit": 1000
                }
            },
            "2": {
                "json": {
                    "date_min": startDate,
                    "date_max": endDate,
                    "board_id": boardIds,
                    "limit": 1000
                }
            },
            "3": {
                "json": {
                    "date_min": startDate,
                    "date_max": endDate,
                    "board_id": boardIds,
                    "limit": 1000
                }
            },
            "4": {
                "json": {
                    "date_min": startDate,
                    "date_max": endDate,
                    "board_id": boardIds,
                    "interval": "day",
                    "limit": 1000
                }
            },
            "5": {
                "json": {
                    "date_min": startDate,
                    "date_max": endDate,
                    "board_id": boardIds,
                    "interval": "day",
                    "limit": 1000
                }
            },
            "6": {
                "json": {
                    "date_min": startDate,
                    "date_max": endDate,
                    "board_id": boardIds,
                    "limit": 1000
                }
            },
            "7": {
                "json": {
                    "date_min": startDate,
                    "date_max": endDate,
                    "board_id": boardIds,
                    "limit": 1000
                }
            },
            "8": {
                "json": {
                    "date_min": startDate,
                    "date_max": endDate,
                    "board_id": boardIds,
                    "limit": 1000
                }
            }
        };

        const endpoint = `https://bitlist.co/trpc/boards.all_boards,posts.count_unique_users,merits.count_merited_posts,merits.top_merit_users,posts.posts_per_day_histogram,merits.merits_per_day_histogram,posts.top_users_by_post_count,posts.top_topics_by_post_count,merits.top_posts_by_merit_count?batch=1&input=${encodeURIComponent(JSON.stringify(payload))}`;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: endpoint,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const topReceivers = data[3]?.result?.data?.json?.top_receivers || [];
                        const topSenders = data[3]?.result?.data?.json?.top_senders || [];
                        const totalMeritsCount = data[3]?.result?.data?.json?.total_merits_count || 0;
                        const totalMeritedPosts = data[2]?.result?.data?.json?.meritedCount || 0;
                        const totalPostsCount = data[6]?.result?.data?.json?.total_posts_count || 0;
                        const dailyPostsHistogram = data[4]?.result?.data?.json?.histogram || [];
                        const dailyMeritsHistogram = data[5]?.result?.data?.json?.histogram || [];
                        const topUsersByPostCount = data[6]?.result?.data?.json?.top_users || [];
                        const topTopicsByPostCount = data[7]?.result?.data?.json || [];
                        const topPostsByMeritCount = data[8]?.result?.data?.json || [];

                        resolve({
                            receiver: topReceivers,
                            sender: topSenders,
                            totalReceived: topReceivers.reduce((sum, user) => sum + user.sum, 0),
                            totalSent: topSenders.reduce((sum, user) => sum + user.sum, 0),
                            totalMeritsCount: totalMeritsCount,
                            totalMeritedPosts: totalMeritedPosts,
                            totalPostsCount: totalPostsCount,
                            dailyPostsHistogram: dailyPostsHistogram,
                            dailyMeritsHistogram: dailyMeritsHistogram,
                            topUsersByPostCount: topUsersByPostCount,
                            topTopicsByPostCount: topTopicsByPostCount,
                            topPostsByMeritCount: topPostsByMeritCount
                        });
                    } catch (err) {
                        console.error("Errore parsing Merit:", err, response.responseText);
                        resolve({
                            receiver: [],
                            sender: [],
                            totalReceived: 0,
                            totalSent: 0,
                            totalMeritsCount: 0,
                            totalMeritedPosts: 0,
                            totalPostsCount: 0,
                            dailyPostsHistogram: [],
                            dailyMeritsHistogram: [],
                            topUsersByPostCount: [],
                            topTopicsByPostCount: [],
                            topPostsByMeritCount: []
                        });
                    }
                },
                onerror: function(error) {
                    console.error("Errore richiesta Merit:", error);
                    resolve({
                        receiver: [],
                        sender: [],
                        totalReceived: 0,
                        totalSent: 0,
                        totalMeritsCount: 0,
                        totalMeritedPosts: 0,
                        totalPostsCount: 0,
                        dailyPostsHistogram: [],
                        dailyMeritsHistogram: [],
                        topUsersByPostCount: [],
                        topTopicsByPostCount: [],
                        topPostsByMeritCount: []
                    });
                }
            });
        });
    }

    // Funzione per assicurarsi che le date abbiano i secondi
    function ensureSeconds(dateTimeString) {
        if (!dateTimeString.endsWith(':59') && !dateTimeString.endsWith(':00')) {
            if (dateTimeString.includes('T23:59')) return dateTimeString.replace('T23:59', 'T23:59:59');
            if (dateTimeString.includes('T00:00')) return dateTimeString.replace('T00:00', 'T00:00:00');
            return dateTimeString + ':00';
        }
        return dateTimeString;
    }

    // Funzione per copiare il BBCode negli appunti
    function copyBBCode() {
        const textarea = document.querySelector('#bbcode-output');
        textarea.select();
        try {
            navigator.clipboard.writeText(textarea.value)
                .then(() => alert('BBCode copiato negli appunti!'))
                .catch(() => {
                    document.execCommand('copy');
                    alert('BBCode copiato negli appunti!');
                });
        } catch (err) {
            document.execCommand('copy');
            alert('BBCode copiato negli appunti!');
        }
    }

    // Funzione per ottenere il nome del mese da una data
    function getMonthName(dateString) {
        const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
        const date = new Date(dateString);
        return months[date.getMonth()];
    }

    // Funzione per creare un grafico a barre
    function createBarChart(canvasId, labels, data, title, label) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: 'rgba(46, 59, 78, 0.7)',
                    borderColor: 'rgba(46, 59, 78, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        font: { size: 14 }
                    },
                    legend: { display: false }
                },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Funzione per creare un grafico a torta
    function createPieChart(canvasId, labels, data, title) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(46, 59, 78, 0.7)',
                        'rgba(70, 130, 180, 0.7)',
                        'rgba(123, 104, 238, 0.7)',
                        'rgba(50, 205, 50, 0.7)',
                        'rgba(255, 165, 0, 0.7)',
                        'rgba(255, 69, 0, 0.7)'
                    ],
                    borderColor: [
                        'rgba(46, 59, 78, 1)',
                        'rgba(70, 130, 180, 1)',
                        'rgba(123, 104, 238, 1)',
                        'rgba(50, 205, 50, 1)',
                        'rgba(255, 165, 0, 1)',
                        'rgba(255, 69, 0, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: title, font: { size: 14 } },
                    legend: { position: 'right' }
                }
            }
        });
    }

    // Funzione per creare un grafico a linea
    function createLineChart(canvasId, labels, data, title, label) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        font: { size: 14 }
                    },
                    legend: { display: false }
                },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Funzione per recuperare i top thread per numero di replies
    async function fetchCustomThreadsEndpoint(boardId, startDate, endDate, childBoards = true, limit = 100) {
        try {
            const allPosts = [];
            let lastPostId = null;
            let hasMore = true;
            const batchSize = 200;

            while (hasMore) {
                let url = `https://api.ninjastic.space/posts?board=${boardId}&child_boards=${childBoards}&after_date=${startDate}&before_date=${endDate}&limit=${batchSize}`;
                if (lastPostId) {
                    url += `&last=${lastPostId}`;
                }

                const response = await fetch(url);
                const data = await response.json();

                if (data.result !== "success" || !data.data?.posts || data.data.posts.length === 0) {
                    hasMore = false;
                    break;
                }

                allPosts.push(...data.data.posts);
                lastPostId = data.data.posts[data.data.posts.length - 1].post_id;

                if (data.data.posts.length < batchSize) {
                    hasMore = false;
                }
            }

            const threads = {};
            allPosts.forEach(post => {
                const topicId = post.topic_id;
                if (!threads[topicId]) {
                    threads[topicId] = {
                        id: topicId,
                        title: post.title || "Sconosciuto",
                        author: post.author || "Sconosciuto",
                        replyCount: 0,
                        posts: []
                    };
                }
                threads[topicId].posts.push(post);
            });

            for (const threadId in threads) {
                const thread = threads[threadId];
                thread.replyCount = Math.max(0, thread.posts.length - 1);
            }

            return Object.values(threads)
                .sort((a, b) => b.replyCount - a.replyCount)
                .slice(0, limit);

        } catch (err) {
            console.error("Errore fetchCustomThreadsEndpoint:", err);
            return [];
        }
    }

    // Funzione per creare la pagina delle statistiche
    function createStatPage() {
        if (document.querySelector('#fake-stat-page')) return;

        const page = document.createElement('div');
        page.id = 'fake-stat-page';
        page.style.position = 'fixed';
        page.style.top = '0';
        page.style.left = '0';
        page.style.width = '100%';
        page.style.height = '100%';
        page.style.backgroundColor = 'rgba(0,0,0,0.5)';
        page.style.zIndex = '9999';
        page.style.overflowY = 'auto';
        page.style.fontFamily = 'Verdana, Arial, sans-serif';
        page.style.fontSize = '14px';

        page.innerHTML = `
            <div style="max-width: 950px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.2); border: 1px solid #ddd;">
                <h2 style="text-align: center; margin-bottom: 20px; color: #2e3b4e;">Statistiche Board</h2>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Board:</label>
                    <select id="board-select" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;">
                        <option value="">Caricamento board in corso...</option>
                    </select>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="margin-right: 10px;">oppure</span>
                        <input type="text" id="board-id" placeholder="Inserisci ID board manualmente" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: inline-flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="annual-report" style="margin-right: 8px;">
                        Report Annuale
                    </label>
                </div>

                <div id="date-range-section">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Mese corrente (inizio):</label>
                        <input type="datetime-local" id="current-start" value="2025-11-01T00:00:00" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Mese corrente (fine):</label>
                        <input type="datetime-local" id="current-end" value="2025-11-30T23:59:59" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Mese precedente (inizio):</label>
                        <input type="datetime-local" id="previous-start" value="2025-10-01T00:00:00" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Mese precedente (fine):</label>
                        <input type="datetime-local" id="previous-end" value="2025-10-31T23:59:59" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                </div>

                <div id="annual-date-section" style="display: none; margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Anno:</label>
                    <select id="annual-year" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: inline-flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="child-boards" style="margin-right: 8px;">
                        Includi child boards
                    </label>
                </div>

                <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
                    <h4 style="margin-bottom: 10px;">Seleziona le statistiche da generare:</h4>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-posts" checked> Post e variazioni
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-merit-receiver" checked> Top Merit Receiver
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-merit-sender" checked> Top Merit Sender
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-rateo" checked> Rateo Merit/Post
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-impact" checked> Utenti per Impatto
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-distribution" checked> Distribuzione Post
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-summary" checked> Sintesi Testuale
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-top-threads" checked> Top 10 Thread per Replies
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-merit-ratio" checked> Top 10 Rapporto Merit Inviati/Ricevuti
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-top-merited-posts" checked> Top 10 Post per Merit Ricevuti
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-daily-posts-chart" checked> Grafico Post Giornalieri
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-daily-merits-chart" checked> Grafico Merit Giornalieri
                    </label>
                </div>

                <button id="generate-stats" style="width: 100%; padding: 10px; font-weight: bold; background: #2e3b4e; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 20px;">Genera Statistiche</button>

                <div id="stats-preview" style="margin-top: 20px; display: none;">
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Anteprima Tabella</h3>
                    <div id="preview-table" style="overflow-x: auto;"></div>
                    <div id="charts-container" style="margin-top: 20px;"></div>
                </div>

                <div id="stats-output" style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px; border: 1px solid #ddd; min-height: 100px; display: none;">
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">BBCode</h3>
                    <textarea id="bbcode-output" style="width: 100%; height: 300px; padding: 10px; font-family: monospace; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"></textarea>
                    <button id="copy-bbcode" style="display: block; margin: 10px auto 0; padding: 8px 16px; background: #2e3b4e; color: white; border: none; border-radius: 4px; cursor: pointer;">Copia BBCode</button>
                </div>

                <button id="close-page" style="display: block; margin: 20px auto 0; padding: 8px 16px; font-weight: bold; background: #ccc; border: none; border-radius: 4px; cursor: pointer;">Chiudi</button>
            </div>
        `;

        document.body.appendChild(page);

        const annualReportCheckbox = document.querySelector('#annual-report');
        const dateRangeSection = document.querySelector('#date-range-section');
        const annualDateSection = document.querySelector('#annual-date-section');

        annualReportCheckbox.addEventListener('change', function() {
            if (this.checked) {
                dateRangeSection.style.display = 'none';
                annualDateSection.style.display = 'block';
            } else {
                dateRangeSection.style.display = 'block';
                annualDateSection.style.display = 'none';
            }
        });

        document.querySelector('#close-page').onclick = () => page.remove();
        document.querySelector('#generate-stats').onclick = generateStats;
        document.querySelector('#copy-bbcode').onclick = copyBBCode;

        fetchAllBoards().then(boards => {
            const select = document.querySelector('#board-select');
            select.innerHTML = '<option value="">Seleziona una board</option>';
            boards.forEach(board => {
                const option = document.createElement('option');
                option.value = board.id;
                option.textContent = board.displayName;
                select.appendChild(option);
            });
        });
    }

    // Funzione per generare le statistiche
    async function generateStats() {
        await loadChartJS();

        const boardSelect = document.querySelector('#board-select');
        const boardIdInput = document.querySelector('#board-id').value.trim();
        const boardId = boardSelect.value || boardIdInput;

        if (!boardId) {
            alert('Seleziona o inserisci una board!');
            return;
        }

        const isAnnualReport = document.querySelector('#annual-report').checked;
        let currentStart, currentEnd, previousStart, previousEnd;

        if (isAnnualReport) {
            const year = document.querySelector('#annual-year').value;
            currentStart = `${year}-01-01T00:00:00`;
            currentEnd = `${year}-12-31T23:59:59`;
            previousStart = `${parseInt(year) - 1}-01-01T00:00:00`;
            previousEnd = `${parseInt(year) - 1}-12-31T23:59:59`;
        } else {
            let rawCurrentStart = document.querySelector('#current-start').value;
            let rawCurrentEnd = document.querySelector('#current-end').value;
            let rawPreviousStart = document.querySelector('#previous-start').value;
            let rawPreviousEnd = document.querySelector('#previous-end').value;

            currentStart = ensureSeconds(rawCurrentStart);
            currentEnd = ensureSeconds(rawCurrentEnd);
            previousStart = ensureSeconds(rawPreviousStart);
            previousEnd = ensureSeconds(rawPreviousEnd);

            if (!currentStart || !currentEnd || !previousStart || !previousEnd) {
                alert('Compila tutti i campi!');
                return;
            }
        }

        const childBoards = document.querySelector('#child-boards').checked;
        const currentMonthName = isAnnualReport ? document.querySelector('#annual-year').value : getMonthName(currentStart);
        const previousMonthName = isAnnualReport ? (parseInt(document.querySelector('#annual-year').value) - 1) : getMonthName(previousStart);
        const boardName = await fetchBoardName(boardId);

        const previewDiv = document.querySelector('#stats-preview');
        const outputDiv = document.querySelector('#stats-output');
        const chartsContainer = document.querySelector('#charts-container');

        previewDiv.style.display = 'none';
        outputDiv.style.display = 'none';
        chartsContainer.innerHTML = '';

        const loadingMsg = document.createElement('div');
        loadingMsg.style.textAlign = 'center';
        loadingMsg.style.margin = '20px 0';
        loadingMsg.innerHTML = `
            <div class="lds-ellipsis">
                <div></div><div></div><div></div><div></div>
            </div>
            <p style="color: #666; margin-top: 10px;">Caricamento dati in corso...</p>
            <style>
                .lds-ellipsis { display: inline-block; position: relative; width: 64px; height: 64px; }
                .lds-ellipsis div { position: absolute; top: 27px; width: 11px; height: 11px; border-radius: 50%; background: #2e3b4e; animation-timing-function: cubic-bezier(0, 1, 1, 0); }
                .lds-ellipsis div:nth-child(1) { left: 6px; animation: lds-ellipsis1 0.6s infinite; }
                .lds-ellipsis div:nth-child(2) { left: 6px; animation: lds-ellipsis2 0.6s infinite; }
                .lds-ellipsis div:nth-child(3) { left: 26px; animation: lds-ellipsis2 0.6s infinite; }
                .lds-ellipsis div:nth-child(4) { left: 45px; animation: lds-ellipsis3 0.6s infinite; }
                @keyframes lds-ellipsis1 { 0% { transform: scale(0); } 100% { transform: scale(1); } }
                @keyframes lds-ellipsis3 { 0% { transform: scale(1); } 100% { transform: scale(0); } }
                @keyframes lds-ellipsis2 { 0% { transform: translate(0, 0); } 100% { transform: translate(19px, 0); } }
            </style>
        `;
        previewDiv.parentNode.insertBefore(loadingMsg, previewDiv);

        try {
            const boardIds = childBoards ? [28, 170, 115, 132, 144, 145, 153, 162, 165, 169, 175, 205, 46, 107, 171, 172, 173, 176, 200] : [boardId];

            const [currentMeritData, previousMeritData] = await Promise.all([
                fetchMeritBatchData(boardIds, currentStart.split('T')[0], currentEnd.split('T')[0]),
                fetchMeritBatchData(boardIds, previousStart.split('T')[0], previousEnd.split('T')[0])
            ]);

            // Calcola i totali per ogni childboard
            const childBoardsData = {};
            const childBoardsNames = [
                { id: 28, name: "Italiano (Italian)" },
                { id: 170, name: "Mercato" },
                { id: 115, name: "Mining (Italiano)" },
                { id: 132, name: "Alt-Currencies (Italiano)" },
                { id: 144, name: "Raduni/Meeting (Italiano)" },
                { id: 145, name: "Off-Topic (Italiano)" },
                { id: 153, name: "Guide (Italiano)" },
                { id: 162, name: "Accuse scam/truffe" },
                { id: 165, name: "Crittografia e decentralizzazione" },
                { id: 169, name: "Progetti" },
                { id: 175, name: "Trading, analisi e speculazione" },
                { id: 205, name: "Discussioni avanzate e sviluppo" },
                { id: 46, name: "Mercato valute" },
                { id: 107, name: "Beni" },
                { id: 171, name: "Servizi" },
                { id: 172, name: "Esercizi commerciali" },
                { id: 173, name: "Hardware/Mining (Italiano)" },
                { id: 176, name: "Annunci" },
                { id: 200, name: "Gambling (Italiano)" }
            ];

            for (const childBoard of childBoardsNames) {
                const currentBoardData = await fetchMeritBatchData([childBoard.id], currentStart.split('T')[0], currentEnd.split('T')[0]);
                const previousBoardData = await fetchMeritBatchData([childBoard.id], previousStart.split('T')[0], previousEnd.split('T')[0]);

                childBoardsData[childBoard.id] = {
                    name: childBoard.name,
                    currentPosts: currentBoardData.totalPostsCount,
                    previousPosts: previousBoardData.totalPostsCount,
                    variation: currentBoardData.totalPostsCount - previousBoardData.totalPostsCount
                };
            }

            // Calcola i totali
            const totalPostsCurrent = currentMeritData.totalPostsCount;
            const totalPostsPrevious = previousMeritData.totalPostsCount;
            const totalMeritReceivedCurrent = currentMeritData.totalReceived;
            const totalMeritReceivedPrevious = previousMeritData.totalReceived;
            const totalMeritSentCurrent = currentMeritData.totalSent;
            const totalMeritSentPrevious = previousMeritData.totalSent;
            const totalMeritsCountCurrent = currentMeritData.totalMeritsCount;
            const currentMeritedPosts = currentMeritData.totalMeritedPosts;
            const previousMeritedPosts = previousMeritData.totalMeritedPosts;

            // Calcola variazioni
            const postVariation = totalPostsCurrent - totalPostsPrevious;
            const postVariationPercent = totalPostsPrevious > 0 ? ((postVariation / totalPostsPrevious) * 100).toFixed(2) : (totalPostsCurrent > 0 ? "∞" : "0");
            const meritReceivedVariation = totalMeritReceivedCurrent - totalMeritReceivedPrevious;
            const meritReceivedVariationPercent = totalMeritReceivedPrevious > 0 ? ((meritReceivedVariation / totalMeritReceivedPrevious) * 100).toFixed(2) : (totalMeritReceivedCurrent > 0 ? "∞" : "0");
            const meritSentVariation = totalMeritSentCurrent - totalMeritSentPrevious;
            const meritSentVariationPercent = totalMeritSentPrevious > 0 ? ((meritSentVariation / totalMeritSentPrevious) * 100).toFixed(2) : (totalMeritSentCurrent > 0 ? "∞" : "0");

            // Calcola Unmerited Posts e percentuali
            const currentUnmeritedPosts = totalPostsCurrent - currentMeritedPosts;
            const previousUnmeritedPosts = totalPostsPrevious - previousMeritedPosts;
            const percentMeritedCurrent = totalPostsCurrent > 0 ? Math.round((currentMeritedPosts / totalPostsCurrent) * 100) : 0;
            const percentMeritedPrevious = totalPostsPrevious > 0 ? Math.round((previousMeritedPosts / totalPostsPrevious) * 100) : 0;

            // Analizza la distribuzione dei post per utente
            const postDistribution = {
                "1 post": 0,
                "2-5 post": 0,
                "6-10 post": 0,
                "11-20 post": 0,
                "21-50 post": 0,
                ">50 post": 0
            };

            const allAuthors = currentMeritData.topUsersByPostCount.slice(0, 1000);
            allAuthors.forEach(author => {
                const postCount = author.doc_count || 0;
                if (postCount === 1) postDistribution["1 post"]++;
                else if (postCount >= 2 && postCount <= 5) postDistribution["2-5 post"]++;
                else if (postCount >= 6 && postCount <= 10) postDistribution["6-10 post"]++;
                else if (postCount >= 11 && postCount <= 20) postDistribution["11-20 post"]++;
                else if (postCount >= 21 && postCount <= 50) postDistribution["21-50 post"]++;
                else if (postCount > 50) postDistribution[">50 post"]++;
            });

            // Calcola rateo e impatto utenti
            const userRateoMap = {};
            allAuthors.forEach(author => {
                const userUid = author.key;
                const postCount = author.doc_count || 0;
                const meritUser = currentMeritData.receiver.find(u => u.user_uid == userUid);
                const meritCount = meritUser ? meritUser.sum : 0;
                const rateo = postCount > 0 ? (meritCount / postCount).toFixed(2) : 0;

                userRateoMap[userUid] = {
                    user: author.top_hit.hits.hits[0]._source.author,
                    userUid,
                    postCount,
                    meritCount,
                    rateo: parseFloat(rateo)
                };
            });

            const userImpactMap = {};
            allAuthors.forEach(author => {
                const userUid = author.key;
                const postCount = author.doc_count || 0;
                const meritUser = currentMeritData.receiver.find(u => u.user_uid == userUid);
                const meritCount = meritUser ? meritUser.sum : 0;
                const impactScore = (postCount * 0.5) + (meritCount * 1.5);

                userImpactMap[userUid] = {
                    user: author.top_hit.hits.hits[0]._source.author,
                    userUid,
                    postCount,
                    meritCount,
                    impactScore: impactScore.toFixed(2)
                };
            });

            // Ordina utenti per rateo e impatto
            const topRateoUsers = Object.values(userRateoMap)
                .filter(user => user.postCount > 0)
                .sort((a, b) => b.rateo - a.rateo)
                .slice(0, 10);

            const topImpactUsers = Object.values(userImpactMap)
                .filter(user => user.postCount > 0 || user.meritCount > 0)
                .sort((a, b) => parseFloat(b.impactScore) - parseFloat(a.impactScore))
                .slice(0, 10);

            // Filtra utenti per rapporto Merit
            const userRatios = [];
            currentMeritData.receiver.forEach(receiver => {
                const sender = currentMeritData.sender.find(s => s.user_uid === receiver.user_uid);
                const received = receiver.sum;
                const sent = sender ? sender.sum : 0;
                const ratio = received > 0 ? (sent / received).toFixed(2) : "N/A";
                userRatios.push({
                    user_uid: receiver.user_uid,
                    user: receiver.user,
                    received: received,
                    sent: sent,
                    ratio: ratio
                });
            });

            const filteredUserRatios = userRatios
                .filter(user => user.received > 0 && user.sent > 0 && user.ratio !== "N/A")
                .sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio))
                .slice(0, 10);

            // Trova i top 3 utenti per ogni categoria
            const top3Posters = currentMeritData.topUsersByPostCount.slice(0, 3);
            const top3Receivers = currentMeritData.receiver.slice(0, 3);
            const top3Senders = currentMeritData.sender.slice(0, 3);
            const top3Rateo = topRateoUsers.slice(0, 3);
            const top3Impact = topImpactUsers.slice(0, 3);
            const top3Ratio = filteredUserRatios.slice(0, 3);

            // Trova i post del mese precedente per i top 100 utenti
            const previousTopUsers = previousMeritData.topUsersByPostCount;
            const topUsersWithPrevious = currentMeritData.topUsersByPostCount.slice(0, 100).map(currentUser => {
                const previousUser = previousTopUsers.find(u => u.key === currentUser.key);
                const previousCount = previousUser ? previousUser.doc_count : 0;
                const variation = (currentUser.doc_count || 0) - previousCount;
                return { ...currentUser, previousCount, variation };
            });

            // Seleziona quali statistiche generare
            const showPosts = document.querySelector('#show-posts').checked;
            const showMeritReceiver = document.querySelector('#show-merit-receiver').checked;
            const showMeritSender = document.querySelector('#show-merit-sender').checked;
            const showRateo = document.querySelector('#show-rateo').checked;
            const showImpact = document.querySelector('#show-impact').checked;
            const showDistribution = document.querySelector('#show-distribution').checked;
            const showSummary = document.querySelector('#show-summary').checked;
            const showTopThreads = document.querySelector('#show-top-threads').checked;
            const showMeritRatio = document.querySelector('#show-merit-ratio').checked;
            const showTopMeritedPosts = document.querySelector('#show-top-merited-posts').checked;
            const showDailyPostsChart = document.querySelector('#show-daily-posts-chart').checked;
            const showDailyMeritsChart = document.querySelector('#show-daily-merits-chart').checked;

            // Genera la sintesi con cards colorate
            let summaryText = ``;
            let summaryBBCode = ``;

            if (showSummary) {
                // Cards Container
                summaryText += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 20px; color: #2e3b4e; font-size: 18px;">📊 Sintesi Analitica delle Statistiche</h4>

                        <!-- Cards Container -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; margin-bottom: 20px;">

                            <!-- Card 1: Post Totali -->
                            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 8px; padding: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <h5 style="margin: 0 0 10px 0; color: #1976d2; font-size: 14px; display: flex; align-items: center;">
                                    <span style="margin-right: 8px;">📝</span> Post Totali
                                </h5>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                                    <span style="color: #666;">${previousMonthName}:</span>
                                    <span style="font-weight: bold; color: #1976d2;">${totalPostsPrevious}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
                                    <span style="color: #666;">${currentMonthName}:</span>
                                    <span style="font-weight: bold; color: #1976d2;">${totalPostsCurrent}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 12px; color: ${postVariation >= 0 ? '#4caf50' : '#f44336'};">
                                    <span>Variazione:</span>
                                    <span>${postVariation >= 0 ? '+' : ''}${postVariation} (${postVariationPercent}%)</span>
                                </div>
                            </div>

                            <!-- Card 2: Merit Ricevuti -->
                            <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 8px; padding: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <h5 style="margin: 0 0 10px 0; color: #388e3c; font-size: 14px; display: flex; align-items: center;">
                                    <span style="margin-right: 8px;">🏅</span> Merit Ricevuti
                                </h5>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                                    <span style="color: #666;">${previousMonthName}:</span>
                                    <span style="font-weight: bold; color: #388e3c;">${totalMeritReceivedPrevious}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
                                    <span style="color: #666;">${currentMonthName}:</span>
                                    <span style="font-weight: bold; color: #388e3c;">${totalMeritReceivedCurrent}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 12px; color: ${meritReceivedVariation >= 0 ? '#4caf50' : '#f44336'};">
                                    <span>Variazione:</span>
                                    <span>${meritReceivedVariation >= 0 ? '+' : ''}${meritReceivedVariation} (${meritReceivedVariationPercent}%)</span>
                                </div>
                            </div>

                            <!-- Card 3: Post con Merit -->
                            <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius: 8px; padding: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <h5 style="margin: 0 0 10px 0; color: #f57c00; font-size: 14px; display: flex; align-items: center;">
                                    <span style="margin-right: 8px;">✨</span> Post con Merit
                                </h5>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                                    <span style="color: #666;">${previousMonthName}:</span>
                                    <span style="font-weight: bold; color: #f57c00;">${previousMeritedPosts} (${percentMeritedPrevious}%)</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
                                    <span style="color: #666;">${currentMonthName}:</span>
                                    <span style="font-weight: bold; color: #f57c00;">${currentMeritedPosts} (${percentMeritedCurrent}%)</span>
                                </div>
                            </div>

                            <!-- Card 4: Media Merit/Post -->
                            <div style="background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%); border-radius: 8px; padding: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <h5 style="margin: 0 0 10px 0; color: #c2185b; font-size: 14px; display: flex; align-items: center;">
                                    <span style="margin-right: 8px;">📈</span> Media Merit/Post
                                </h5>
                                <div style="text-align: center; font-size: 20px; font-weight: bold; color: #c2185b; margin: 10px 0;">
                                    ${totalPostsCurrent > 0 ? (totalMeritReceivedCurrent / totalPostsCurrent).toFixed(2) : 0}
                                </div>
                            </div>

                            <!-- Card 5: Transazioni Merit -->
                            <div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border-radius: 8px; padding: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <h5 style="margin: 0 0 10px 0; color: #7b1fa2; font-size: 14px; display: flex; align-items: center;">
                                    <span style="margin-right: 8px;">🔄</span> Transazioni Merit
                                </h5>
                                <div style="text-align: center; font-size: 20px; font-weight: bold; color: #7b1fa2; margin: 10px 0;">
                                    ${totalMeritsCountCurrent}
                                </div>
                            </div>

                            <!-- Card 6: Merit Inviati -->
                            <div style="background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); border-radius: 8px; padding: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <h5 style="margin: 0 0 10px 0; color: #00897b; font-size: 14px; display: flex; align-items: center;">
                                    <span style="margin-right: 8px;">📤</span> Merit Inviati
                                </h5>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                                    <span style="color: #666;">${previousMonthName}:</span>
                                    <span style="font-weight: bold; color: #00897b;">${totalMeritSentPrevious}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
                                    <span style="color: #666;">${currentMonthName}:</span>
                                    <span style="font-weight: bold; color: #00897b;">${totalMeritSentCurrent}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 12px; color: ${meritSentVariation >= 0 ? '#4caf50' : '#f44336'};">
                                    <span>Variazione:</span>
                                    <span>${meritSentVariation >= 0 ? '+' : ''}${meritSentVariation} (${meritSentVariationPercent}%)</span>
                                </div>
                            </div>
                        </div>

                        <!-- Sintesi testuale dettagliata -->
                        <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px; border: 1px solid #ddd;">
                            <h5 style="margin-bottom: 10px; color: #2e3b4e;">📋 Dettagli Analitici</h5>
                            <p style="margin-bottom: 10px;">
                                <strong>Periodo:</strong> ${currentMonthName} (confronto con ${previousMonthName})<br>
                                <strong>Board:</strong> ${boardName} (ID: ${boardId}) ${childBoards ? "<span style='color: #666;'>[incluse child boards]</span>" : ""}
                            </p>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                <div>
                                    <p style="margin-bottom: 5px;"><strong>Post totali (${previousMonthName}):</strong> ${totalPostsPrevious}</p>
                                    <p style="margin-bottom: 5px;"><strong>Post totali (${currentMonthName}):</strong> ${totalPostsCurrent}</p>
                                    <p style="margin-bottom: 5px;"><strong>Variazione post:</strong> <span style="color: ${postVariation >= 0 ? '#4caf50' : '#f44336'};">${postVariation >= 0 ? '+' : ''}${postVariation} (${postVariationPercent}%)</span></p>
                                </div>
                                <div>
                                    <p style="margin-bottom: 5px;"><strong>Merit ricevuti (${previousMonthName}):</strong> ${totalMeritReceivedPrevious}</p>
                                    <p style="margin-bottom: 5px;"><strong>Merit ricevuti (${currentMonthName}):</strong> ${totalMeritReceivedCurrent}</p>
                                    <p style="margin-bottom: 5px;"><strong>Variazione Merit ricevuti:</strong> <span style="color: ${meritReceivedVariation >= 0 ? '#4caf50' : '#f44336'};">${meritReceivedVariation >= 0 ? '+' : ''}${meritReceivedVariation} (${meritReceivedVariationPercent}%)</span></p>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                <div>
                                    <p style="margin-bottom: 5px;"><strong>Merit inviati (${previousMonthName}):</strong> ${totalMeritSentPrevious}</p>
                                    <p style="margin-bottom: 5px;"><strong>Merit inviati (${currentMonthName}):</strong> ${totalMeritSentCurrent}</p>
                                    <p style="margin-bottom: 5px;"><strong>Variazione Merit inviati:</strong> <span style="color: ${meritSentVariation >= 0 ? '#4caf50' : '#f44336'};">${meritSentVariation >= 0 ? '+' : ''}${meritSentVariation} (${meritSentVariationPercent}%)</span></p>
                                </div>
                                <div>
                                    <p style="margin-bottom: 5px;"><strong>Transazioni Merit:</strong> ${totalMeritsCountCurrent}</p>
                                    <p style="margin-bottom: 5px;"><strong>Media Merit/Post:</strong> ${totalPostsCurrent > 0 ? (totalMeritReceivedCurrent / totalPostsCurrent).toFixed(2) : 0}</p>
                                    <p style="margin-bottom: 5px;"><strong>Post con Merit (${currentMonthName}):</strong> ${currentMeritedPosts} (${percentMeritedCurrent}%)</p>
                                </div>
                            </div>
                            <p style="margin-bottom: 10px;"><strong>Utenti attivi:</strong> ${allAuthors.length} (di cui ${allAuthors.filter(a => (a.doc_count || 0) >= 2).length} con almeno 2 post in ${currentMonthName})</p>
                            ${childBoards ? `
                            <div style="margin-bottom: 10px;">
                                <p style="margin-bottom: 5px;"><strong>Post per childboard (${currentMonthName}):</strong></p>
                                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 5px;">
                                    ${Object.entries(childBoardsData).map(([id, data]) => `
                                        <div style="background: #f0f0f0; padding: 5px; border-radius: 3px; font-size: 12px;">
                                            <strong>${data.name}:</strong> ${data.currentPosts} <span style="color: ${data.variation >= 0 ? '#4caf50' : '#f44336'};">(${data.variation >= 0 ? '+' : ''}${data.variation} vs ${previousMonthName})</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            ` : ''}
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                <div>
                                    <p style="margin-bottom: 5px;"><strong>Top 3 Utenti per Post:</strong> ${top3Posters.map(u => u.top_hit.hits.hits[0]._source.author).join(', ')}</p>
                                    <p style="margin-bottom: 5px;"><strong>Top 3 Merit Receiver:</strong> ${top3Receivers.map(u => u.user).join(', ')}</p>
                                    <p style="margin-bottom: 5px;"><strong>Top 3 Merit Sender:</strong> ${top3Senders.map(u => u.user).join(', ')}</p>
                                </div>
                                <div>
                                    <p style="margin-bottom: 5px;"><strong>Top 3 Rateo Merit/Post:</strong> ${top3Rateo.map(u => u.user).join(', ')}</p>
                                    <p style="margin-bottom: 5px;"><strong>Top 3 Utenti per Impatto:</strong> ${top3Impact.map(u => u.user).join(', ')}</p>
                                    <p style="margin-bottom: 5px;"><strong>Top 3 Rapporto Merit:</strong> ${top3Ratio.map(u => u.user).join(', ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // BBCode sintesi (con percentuali)
                summaryBBCode += `
[center][b][size=12pt]Sintesi Analitica delle Statistiche[/size][/b][/center]
[b]Periodo analizzato:[/b] ${currentMonthName} (confronto con ${previousMonthName})
[b]Board:[/b] ${boardName} (ID: ${boardId}) ${childBoards ? "(incluse child boards)" : ""}

[table]
[tr][td][b]Post totali (${previousMonthName})[/b][/td][td][b]Post totali (${currentMonthName})[/b][/td][td][b]Variazione[/b][/td][/tr]
[tr][td]${totalPostsPrevious}[/td][td]${totalPostsCurrent}[/td][td][color=${postVariation >= 0 ? 'green' : 'red'}]${postVariation >= 0 ? '+' : ''}${postVariation} (${postVariationPercent}%)[/color][/td][/tr]
[/table]

[table]
[tr][td][b]Merit ricevuti (${previousMonthName})[/b][/td][td][b]Merit ricevuti (${currentMonthName})[/b][/td][td][b]Variazione[/b][/td][/tr]
[tr][td]${totalMeritReceivedPrevious}[/td][td]${totalMeritReceivedCurrent}[/td][td][color=${meritReceivedVariation >= 0 ? 'green' : 'red'}]${meritReceivedVariation >= 0 ? '+' : ''}${meritReceivedVariation} (${meritReceivedVariationPercent}%)[/color][/td][/tr]
[/table]

[table]
[tr][td][b]Merit inviati (${previousMonthName})[/b][/td][td][b]Merit inviati (${currentMonthName})[/b][/td][td][b]Variazione[/b][/td][/tr]
[tr][td]${totalMeritSentPrevious}[/td][td]${totalMeritSentCurrent}[/td][td][color=${meritSentVariation >= 0 ? 'green' : 'red'}]${meritSentVariation >= 0 ? '+' : ''}${meritSentVariation} (${meritSentVariationPercent}%)[/color][/td][/tr]
[/table]

[table]
[tr][td][b]Post con Merit (${previousMonthName})[/b][/td][td][b]Post con Merit (${currentMonthName})[/b][/td][td][b]Percentuale[/b][/td][/tr]
[tr][td]${previousMeritedPosts}[/td][td]${currentMeritedPosts}[/td][td][color=${percentMeritedCurrent >= 50 ? 'green' : 'orange'}]${percentMeritedCurrent}%[/color][/td][/tr]
[/table]

[b]Media Merit/Post:[/b] ${totalPostsCurrent > 0 ? (totalMeritReceivedCurrent / totalPostsCurrent).toFixed(2) : 0}
[b]Transazioni Merit:[/b] ${totalMeritsCountCurrent}
[b]Top 3 Utenti per Post:[/b] ${top3Posters.map(u => u.top_hit.hits.hits[0]._source.author).join(', ')}
[b]Top 3 Merit Receiver:[/b] ${top3Receivers.map(u => u.user).join(', ')}
[b]Top 3 Merit Sender:[/b] ${top3Senders.map(u => u.user).join(', ')}
[b]Top 3 Rateo Merit/Post:[/b] ${top3Rateo.map(u => u.user).join(', ')}
[b]Top 3 Utenti per Impatto:[/b] ${top3Impact.map(u => u.user).join(', ')}
[b]Top 3 Rapporto Merit:[/b] ${top3Ratio.map(u => u.user).join(', ')}
                `;
            }

            // Genera le tabelle per le altre statistiche
            let previewTable = ``;
            let bbcode = ``;
            let postDistributionPreview = ``;
            let postDistributionBBCode = ``;
            let meritPreview = ``;
            let meritBBCode = ``;
            let rateoPreview = ``;
            let rateoBBCode = ``;
            let impactPreview = ``;
            let impactBBCode = ``;
            let meritRatioPreview = ``;
            let meritRatioBBCode = ``;
            let topThreadsPreview = ``;
            let topThreadsBBCode = ``;
            let topMeritedPostsPreview = ``;
            let topMeritedPostsBBCode = ``;

            // Genera tabella post (se richiesto)
            if (showPosts) {
                previewTable += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 100 Utenti per Post</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Pos.</th>
                                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">User</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Post (${currentMonthName})</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Post (${previousMonthName})</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Variazione</th>
                            </tr>
                `;

                topUsersWithPrevious.forEach((user, index) => {
                    const username = user.top_hit.hits.hits[0]._source.author || 'Sconosciuto';
                    const userUid = user.key || '';
                    const currentCount = user.doc_count || 0;
                    const previousCount = user.previousCount || 0;
                    const variation = currentCount - previousCount;
                    const color = variation > 0 ? 'green' : variation < 0 ? 'red' : 'blue';

                    previewTable += `
                        <tr style="border: 1px solid #ddd;">
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}.</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">
                                ${userUid ? `<a href="https://bitcointalk.org/index.php?action=profile;u=${userUid}" target="_blank">${username}</a>` : username}
                            </td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${currentCount}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${previousCount}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: ${color};">${variation >= 0 ? '+' : ''}${variation}</td>
                        </tr>
                    `;
                });

                previewTable += `</table></div>`;

                // BBCode
                bbcode += `
[center][b]Top 100 Utenti per Post[/b][/center]
[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]User[/b][/td]
[td][b]Post (${currentMonthName})[/b][/td]
[td][b]Post (${previousMonthName})[/b][/td]
[td][b]Variazione[/b][/td]
[/tr]
                `;

                topUsersWithPrevious.forEach((user, index) => {
                    const username = user.top_hit.hits.hits[0]._source.author || 'Sconosciuto';
                    const userUid = user.key || '';
                    const currentCount = user.doc_count || 0;
                    const previousCount = user.previousCount || 0;
                    const variation = currentCount - previousCount;
                    const color = variation > 0 ? 'green' : variation < 0 ? 'red' : 'blue';

                    bbcode += `
[tr]
[td]${index + 1}.[/td]
[td]${userUid ? `[url=https://bitcointalk.org/index.php?action=profile;u=${userUid}]${username}[/url]` : username}[/td]
[td]${currentCount}[/td]
[td]${previousCount}[/td]
[td][color=${color}]${variation >= 0 ? '+' : ''}${variation}[/color][/td]
[/tr]
                    `;
                });

                bbcode += `[/table]`;
            }

            // Genera distribuzione post (se richiesto)
            if (showDistribution) {
                postDistributionPreview += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Distribuzione Post per Utente (${currentMonthName})</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Intervallo Post</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Num. Utenti</th>
                            </tr>
                `;

                Object.entries(postDistribution).forEach(([range, count]) => {
                    postDistributionPreview += `
                        <tr style="border: 1px solid #ddd;">
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${range}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${count}</td>
                        </tr>
                    `;
                });

                postDistributionPreview += `</table></div>`;

                // BBCode
                postDistributionBBCode += `
[center][b]Distribuzione Post per Utente (${currentMonthName})[/b][/center]
[table]
[tr]
[td][b]Intervallo Post[/b][/td]
[td][b]Num. Utenti[/b][/td]
[/tr]
                `;

                Object.entries(postDistribution).forEach(([range, count]) => {
                    postDistributionBBCode += `
[tr]
[td]${range}[/td]
[td]${count}[/td]
[/tr]
                    `;
                });

                postDistributionBBCode += `[/table]`;
            }

            // Genera tabelle Merit (se richiesto)
            if (showMeritReceiver || showMeritSender) {
                if (showMeritReceiver) {
                    meritPreview += `
                        <div style="margin-top: 20px;">
                            <h4 style="text-align: center; margin-bottom: 10px;">Top 1000 Merit Receiver</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                <tr style="background: #f0f0f0;">
                                    <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Pos.</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">User</th>
                                    <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Merit Ricevuti</th>
                                </tr>
                    `;

                    currentMeritData.receiver.slice(0, 1000).forEach((user, index) => {
                        meritPreview += `
                            <tr style="border: 1px solid #ddd;">
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}.</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">
                                    <a href="https://bitcointalk.org/index.php?action=profile;u=${user.user_uid}" target="_blank">${user.user}</a>
                                </td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.sum}</td>
                            </tr>
                        `;
                    });

                    meritPreview += `</table></div>`;

                    // BBCode
                    meritBBCode += `
[center][b]Top 1000 Merit Receiver[/b][/center]
[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]User[/b][/td]
[td][b]Merit Ricevuti[/b][/td]
[/tr]
                    `;

                    currentMeritData.receiver.slice(0, 1000).forEach((user, index) => {
                        meritBBCode += `
[tr]
[td]${index + 1}.[/td]
[td][url=https://bitcointalk.org/index.php?action=profile;u=${user.user_uid}]${user.user}[/url][/td]
[td]${user.sum}[/td]
[/tr]
                        `;
                    });

                    meritBBCode += `[/table]`;
                }

                if (showMeritSender) {
                    meritPreview += `
                        <div style="margin-top: 20px;">
                            <h4 style="text-align: center; margin-bottom: 10px;">Top 1000 Merit Sender</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                <tr style="background: #f0f0f0;">
                                    <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Pos.</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">User</th>
                                    <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Merit Inviati</th>
                                </tr>
                    `;

                    currentMeritData.sender.slice(0, 1000).forEach((user, index) => {
                        meritPreview += `
                            <tr style="border: 1px solid #ddd;">
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}.</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">
                                    <a href="https://bitcointalk.org/index.php?action=profile;u=${user.user_uid}" target="_blank">${user.user}</a>
                                </td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.sum}</td>
                            </tr>
                        `;
                    });

                    meritPreview += `</table></div>`;

                    // BBCode
                    meritBBCode += `
[center][b]Top 1000 Merit Sender[/b][/center]
[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]User[/b][/td]
[td][b]Merit Inviati[/b][/td]
[/tr]
                    `;

                    currentMeritData.sender.slice(0, 1000).forEach((user, index) => {
                        meritBBCode += `
[tr]
[td]${index + 1}.[/td]
[td][url=https://bitcointalk.org/index.php?action=profile;u=${user.user_uid}]${user.user}[/url][/td]
[td]${user.sum}[/td]
[/tr]
                        `;
                    });

                    meritBBCode += `[/table]`;
                }
            }

            // Genera rateo (se richiesto)
            if (showRateo) {
                rateoPreview += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 10 Utenti per Rateo Merit/Post</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Pos.</th>
                                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">User</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Post</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Merit Ricevuti</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Rateo</th>
                            </tr>
                `;

                topRateoUsers.forEach((user, index) => {
                    rateoPreview += `
                        <tr style="border: 1px solid #ddd;">
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}.</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">
                                <a href="https://bitcointalk.org/index.php?action=profile;u=${user.userUid}" target="_blank">${user.user}</a>
                            </td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.postCount}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.meritCount}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.rateo}</td>
                        </tr>
                    `;
                });

                rateoPreview += `</table></div>`;

                // BBCode
                rateoBBCode += `
[center][b]Top 10 Utenti per Rateo Merit/Post[/b][/center]
[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]User[/b][/td]
[td][b]Post[/b][/td]
[td][b]Merit Ricevuti[/b][/td]
[td][b]Rateo[/b][/td]
[/tr]
                `;

                topRateoUsers.forEach((user, index) => {
                    rateoBBCode += `
[tr]
[td]${index + 1}.[/td]
[td][url=https://bitcointalk.org/index.php?action=profile;u=${user.userUid}]${user.user}[/url][/td]
[td]${user.postCount}[/td]
[td]${user.meritCount}[/td]
[td]${user.rateo}[/td]
[/tr]
                    `;
                });

                rateoBBCode += `[/table]`;
            }

            // Genera impatto (se richiesto)
            if (showImpact) {
                impactPreview += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 10 Utenti per Impatto</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Pos.</th>
                                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">User</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Post</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Merit Ricevuti</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Impatto</th>
                            </tr>
                `;

                topImpactUsers.forEach((user, index) => {
                    impactPreview += `
                        <tr style="border: 1px solid #ddd;">
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}.</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">
                                <a href="https://bitcointalk.org/index.php?action=profile;u=${user.userUid}" target="_blank">${user.user}</a>
                            </td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.postCount}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.meritCount}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.impactScore}</td>
                        </tr>
                    `;
                });

                impactPreview += `</table></div>`;

                // BBCode
                impactBBCode += `
[center][b]Top 10 Utenti per Impatto[/b][/center]
[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]User[/b][/td]
[td][b]Post[/b][/td]
[td][b]Merit Ricevuti[/b][/td]
[td][b]Impatto[/b][/td]
[/tr]
                `;

                topImpactUsers.forEach((user, index) => {
                    impactBBCode += `
[tr]
[td]${index + 1}.[/td]
[td][url=https://bitcointalk.org/index.php?action=profile;u=${user.userUid}]${user.user}[/url][/td]
[td]${user.postCount}[/td]
[td]${user.meritCount}[/td]
[td]${user.impactScore}[/td]
[/tr]
                    `;
                });

                impactBBCode += `[/table]`;
            }

            // Genera rapporto Merit (se richiesto)
            if (showMeritRatio) {
                meritRatioPreview += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 10 Utenti per Rapporto Merit Ricevuti/Inviati</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Pos.</th>
                                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">User</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Merit Ricevuti</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Merit Inviati</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Rapporto</th>
                            </tr>
                `;

                filteredUserRatios.forEach((user, index) => {
                    meritRatioPreview += `
                        <tr style="border: 1px solid #ddd;">
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}.</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">
                                <a href="https://bitcointalk.org/index.php?action=profile;u=${user.user_uid}" target="_blank">${user.user}</a>
                            </td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.received}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.sent}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${user.ratio}</td>
                        </tr>
                    `;
                });

                meritRatioPreview += `</table></div>`;

                // BBCode
                meritRatioBBCode += `
[center][b]Top 10 Utenti per Rapporto Merit Ricevuti/Inviati[/b][/center]
[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]User[/b][/td]
[td][b]Merit Ricevuti[/b][/td]
[td][b]Merit Inviati[/b][/td]
[td][b]Rapporto[/b][/td]
[/tr]
                `;

                filteredUserRatios.forEach((user, index) => {
                    meritRatioBBCode += `
[tr]
[td]${index + 1}.[/td]
[td][url=https://bitcointalk.org/index.php?action=profile;u=${user.user_uid}]${user.user}[/url][/td]
[td]${user.received}[/td]
[td]${user.sent}[/td]
[td]${user.ratio}[/td]
[/tr]
                    `;
                });

                meritRatioBBCode += `[/table]`;
            }

            // Genera top threads (se richiesto)
            if (showTopThreads) {
                const topThreads = await fetchCustomThreadsEndpoint(boardId, currentStart, currentEnd, childBoards, 10);

                topThreadsPreview += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 10 Thread per Replies</h4>
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Pos.</th>
                                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Thread</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Replies</th>
                                <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Link</th>
                            </tr>
                `;

                topThreads.forEach((thread, index) => {
                    topThreadsPreview += `
                        <tr style="border: 1px solid #ddd;">
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}.</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${thread.title}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${thread.replyCount}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                                <a href="https://bitcointalk.org/index.php?topic=${thread.id}" target="_blank">Apri</a>
                            </td>
                        </tr>
                    `;
                });

                topThreadsPreview += `</table></div>`;

                // BBCode
                topThreadsBBCode += `
[center][b]Top 10 Thread per Replies[/b][/center]
[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]Thread[/b][/td]
[td][b]Replies[/b][/td]
[td][b]Link[/b][/td]
[/tr]
                `;

                topThreads.forEach((thread, index) => {
                    topThreadsBBCode += `
[tr]
[td]${index + 1}.[/td]
[td]${thread.title}[/td]
[td]${thread.replyCount}[/td]
[td][url=https://bitcointalk.org/index.php?topic=${thread.id}]Apri[/url][/td]
[/tr]
                    `;
                });

                topThreadsBBCode += `[/table]`;
            }

            // Genera top post per Merit (se richiesto)
            if (showTopMeritedPosts) {
                try {
                    const topMeritedPosts = currentMeritData.topPostsByMeritCount.slice(0, 10);

                    if (topMeritedPosts.length > 0) {
                        topMeritedPostsPreview += `
                            <div style="margin-top: 20px;">
                                <h4 style="text-align: center; margin-bottom: 10px;">Top 10 Post per Merit Ricevuti</h4>
                                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                    <tr style="background: #f0f0f0;">
                                        <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Pos.</th>
                                        <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Post</th>
                                        <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Merit</th>
                                        <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Autore</th>
                                        <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Link</th>
                                    </tr>
                        `;

                        topMeritedPosts.forEach((post, index) => {
                            topMeritedPostsPreview += `
                                <tr style="border: 1px solid #ddd;">
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}.</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${post.title}</td>
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${post.total_merits}</td>
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                                        <a href="https://bitcointalk.org/index.php?action=profile;u=${post.author_uid}" target="_blank">${post.author}</a>
                                    </td>
                                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                                        <a href="https://bitcointalk.org/index.php?topic=${post.topic_id}.msg${post.post_id}#msg${post.post_id}" target="_blank">Apri</a>
                                    </td>
                                </tr>
                            `;
                        });

                        topMeritedPostsPreview += `</table></div>`;

                        // BBCode
                        topMeritedPostsBBCode += `
[center][b]Top 10 Post per Merit Ricevuti[/b][/center]
[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]Post[/b][/td]
[td][b]Merit[/b][/td]
[td][b]Autore[/b][/td]
[td][b]Link[/b][/td]
[/tr]
                        `;

                        topMeritedPosts.forEach((post, index) => {
                            topMeritedPostsBBCode += `
[tr]
[td]${index + 1}.[/td]
[td]${post.title}[/td]
[td]${post.total_merits}[/td]
[td][url=https://bitcointalk.org/index.php?action=profile;u=${post.author_uid}]${post.author}[/url][/td]
[td][url=https://bitcointalk.org/index.php?topic=${post.topic_id}.msg${post.post_id}#msg${post.post_id}]Apri[/url][/td]
[/tr]
                            `;
                        });

                        topMeritedPostsBBCode += `[/table]`;
                    } else {
                        topMeritedPostsPreview = `<p style="text-align: center; color: #666;">Nessun post con Merit trovato.</p>`;
                        topMeritedPostsBBCode = `[center][i]Nessun post con merit trovato.[/i][/center]`;
                    }
                } catch (err) {
                    console.error("Errore top merited posts:", err);
                    topMeritedPostsPreview = `<p style="text-align: center; color: red;">Errore: ${err.message}</p>`;
                    topMeritedPostsBBCode = `[center][color=red][b]Errore:[/b] ${err.message}[/color][/center]`;
                }
            }

            // Aggiungi i grafici
            chartsContainer.innerHTML = '';

            if (showDistribution) {
                chartsContainer.innerHTML += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Distribuzione Post per Utente</h4>
                        <canvas id="postDistributionChart" style="max-height: 300px;"></canvas>
                        <button id="downloadPostDistributionChart"
                                style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Apri Grafico
                        </button>
                    </div>
                `;
            }

            if (showMeritReceiver) {
                chartsContainer.innerHTML += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 200 Merit Receiver</h4>
                        <canvas id="topReceiverChart" style="max-height: 300px;"></canvas>
                        <button id="downloadTopReceiverChart"
                                style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Apri Grafico
                        </button>
                    </div>
                `;
            }

            if (showMeritSender) {
                chartsContainer.innerHTML += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 200 Merit Sender</h4>
                        <canvas id="topSenderChart" style="max-height: 300px;"></canvas>
                        <button id="downloadTopSenderChart"
                                style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Apri Grafico
                        </button>
                    </div>
                `;
            }

            if (showRateo) {
                chartsContainer.innerHTML += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 10 Utenti per Rateo Merit/Post</h4>
                        <canvas id="topRateoChart" style="max-height: 300px;"></canvas>
                        <button id="downloadTopRateoChart"
                                style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Apri Grafico
                        </button>
                    </div>
                `;
            }

            if (showImpact) {
                chartsContainer.innerHTML += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 10 Utenti per Impatto</h4>
                        <canvas id="topImpactChart" style="max-height: 300px;"></canvas>
                        <button id="downloadTopImpactChart"
                                style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Apri Grafico
                        </button>
                    </div>
                `;
            }

            if (showMeritRatio) {
                chartsContainer.innerHTML += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 10 Utenti per Rapporto Merit</h4>
                        <canvas id="topMeritRatioChart" style="max-height: 300px;"></canvas>
                        <button id="downloadTopMeritRatioChart"
                                style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Apri Grafico
                        </button>
                    </div>
                `;
            }

            if (showDailyPostsChart && currentMeritData.dailyPostsHistogram.length > 0) {
                chartsContainer.innerHTML += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Post Giornalieri</h4>
                        <canvas id="dailyPostsChart" style="max-height: 300px;"></canvas>
                        <button id="downloadDailyPostsChart"
                                style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Apri Grafico
                        </button>
                    </div>
                `;
            }

            if (showDailyMeritsChart && currentMeritData.dailyMeritsHistogram.length > 0) {
                chartsContainer.innerHTML += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Merit Giornalieri</h4>
                        <canvas id="dailyMeritsChart" style="max-height: 300px;"></canvas>
                        <button id="downloadDailyMeritsChart"
                                style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Apri Grafico
                        </button>
                    </div>
                `;
            }

            if (showTopMeritedPosts && currentMeritData.topPostsByMeritCount.length > 0) {
                chartsContainer.innerHTML += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 10 Post per Merit Ricevuti</h4>
                        <canvas id="topMeritedPostsChart" style="max-height: 300px;"></canvas>
                        <button id="downloadTopMeritedPostsChart"
                                style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Apri Grafico
                        </button>
                    </div>
                `;
            }

            // Crea i grafici
            setTimeout(() => {
                if (showDistribution) {
                    createPieChart(
                        'postDistributionChart',
                        Object.keys(postDistribution),
                        Object.values(postDistribution),
                        `Distribuzione Post per Utente (${currentMonthName})`
                    );
                    document.getElementById('downloadPostDistributionChart').addEventListener('click', () => {
                        openChartImage('postDistributionChart', `Distribuzione_Post_${currentMonthName}`);
                    });
                }

                if (showMeritReceiver) {
                    createBarChart(
                        'topReceiverChart',
                        currentMeritData.receiver.slice(0, 20).map(u => u.user),
                        currentMeritData.receiver.slice(0, 20).map(u => u.sum),
                        'Top 20 Merit Receiver',
                        'Merit Ricevuti'
                    );
                    document.getElementById('downloadTopReceiverChart').addEventListener('click', () => {
                        openChartImage('topReceiverChart', 'Top_20_Merit_Receiver');
                    });
                }

                if (showMeritSender) {
                    createBarChart(
                        'topSenderChart',
                        currentMeritData.sender.slice(0, 20).map(u => u.user),
                        currentMeritData.sender.slice(0, 20).map(u => u.sum),
                        'Top 20 Merit Sender',
                        'Merit Inviati'
                    );
                    document.getElementById('downloadTopSenderChart').addEventListener('click', () => {
                        openChartImage('topSenderChart', 'Top_20_Merit_Sender');
                    });
                }

                if (showRateo) {
                    createBarChart(
                        'topRateoChart',
                        topRateoUsers.map(u => u.user),
                        topRateoUsers.map(u => u.rateo),
                        'Top 10 Utenti per Rateo Merit/Post',
                        'Rateo'
                    );
                    document.getElementById('downloadTopRateoChart').addEventListener('click', () => {
                        openChartImage('topRateoChart', 'Top_10_Rateo_Merit_Post');
                    });
                }

                if (showImpact) {
                    createBarChart(
                        'topImpactChart',
                        topImpactUsers.map(u => u.user),
                        topImpactUsers.map(u => parseFloat(u.impactScore)),
                        'Top 10 Utenti per Impatto',
                        'Impatto'
                    );
                    document.getElementById('downloadTopImpactChart').addEventListener('click', () => {
                        openChartImage('topImpactChart', 'Top_10_Utenti_Impatto');
                    });
                }

                if (showMeritRatio) {
                    createBarChart(
                        'topMeritRatioChart',
                        filteredUserRatios.map(u => u.user),
                        filteredUserRatios.map(u => parseFloat(u.ratio)),
                        'Top 10 Utenti per Rapporto Merit',
                        'Rapporto'
                    );
                    document.getElementById('downloadTopMeritRatioChart').addEventListener('click', () => {
                        openChartImage('topMeritRatioChart', 'Top_10_Rapporte_Merit');
                    });
                }

                if (showDailyPostsChart && currentMeritData.dailyPostsHistogram.length > 0) {
                    const dailyPostsLabels = currentMeritData.dailyPostsHistogram.map(item => {
                        const date = new Date(item.key_as_string);
                        return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
                    });
                    const dailyPostsData = currentMeritData.dailyPostsHistogram.map(item => item.doc_count);

                    createLineChart(
                        'dailyPostsChart',
                        dailyPostsLabels,
                        dailyPostsData,
                        `Post Giornalieri (${currentMonthName})`,
                        'Post'
                    );
                    document.getElementById('downloadDailyPostsChart').addEventListener('click', () => {
                        openChartImage('dailyPostsChart', `Post_Giornalieri_${currentMonthName}`);
                    });
                }

                if (showDailyMeritsChart && currentMeritData.dailyMeritsHistogram.length > 0) {
                    const dailyMeritsLabels = currentMeritData.dailyMeritsHistogram.map(item => {
                        const date = new Date(item.key_as_string);
                        return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
                    });
                    const dailyMeritsData = currentMeritData.dailyMeritsHistogram.map(item => item.merits_sum.value);

                    createLineChart(
                        'dailyMeritsChart',
                        dailyMeritsLabels,
                        dailyMeritsData,
                        `Merit Giornalieri (${currentMonthName})`,
                        'Merit'
                    );
                    document.getElementById('downloadDailyMeritsChart').addEventListener('click', () => {
                        openChartImage('dailyMeritsChart', `Merit_Giornalieri_${currentMonthName}`);
                    });
                }

                if (showTopMeritedPosts && currentMeritData.topPostsByMeritCount.length > 0) {
                    createBarChart(
                        'topMeritedPostsChart',
                        currentMeritData.topPostsByMeritCount.slice(0, 10).map(post => post.title),
                        currentMeritData.topPostsByMeritCount.slice(0, 10).map(post => post.total_merits),
                        'Top 10 Post per Merit Ricevuti',
                        'Merit'
                    );
                    document.getElementById('downloadTopMeritedPostsChart').addEventListener('click', () => {
                        openChartImage('topMeritedPostsChart', 'Top_10_Post_Merit');
                    });
                }

                // Mostra tutto
                loadingMsg.remove();
                previewDiv.style.display = 'block';
                outputDiv.style.display = 'block';

                document.querySelector('#preview-table').innerHTML =
                    summaryText +
                    previewTable +
                    postDistributionPreview +
                    meritPreview +
                    rateoPreview +
                    impactPreview +
                    meritRatioPreview +
                    topThreadsPreview +
                    topMeritedPostsPreview;

                document.querySelector('#bbcode-output').value =
                    summaryBBCode +
                    bbcode +
                    postDistributionBBCode +
                    meritBBCode +
                    rateoBBCode +
                    impactBBCode +
                    meritRatioBBCode +
                    topThreadsBBCode +
                    topMeritedPostsBBCode;

            }, 500);

        } catch (err) {
            console.error("Errore generale:", err);
            loadingMsg.innerHTML = '<p style="color: red; text-align: center;">Errore durante il caricamento dati.</p>';
        }
    }

    // Aggiunge pulsante Stat nella navbar
    function addStatButton() {
        const navbar = document.querySelector('table[style*="margin-left: 10px;"]');
        if (!navbar) {
            setTimeout(addStatButton, 1000);
            return;
        }

        const lastCell = navbar.querySelector('td.maintab_last');
        if (lastCell.querySelector('#stat-button')) return;

        const statButton = document.createElement('td');
        statButton.id = 'stat-button';
        statButton.className = 'maintab_back';
        statButton.innerHTML = `<a href="javascript:void(0)" class="maintab_link" style="padding: 0 10px;">Stats</a>`;
        statButton.querySelector('a').onclick = createStatPage;

        navbar.querySelector('tr').insertBefore(statButton, lastCell);
    }

    window.addEventListener('load', () => setTimeout(addStatButton, 1000));
    window.copyBBCode = copyBBCode;
    window.createStatPage = createStatPage;
})();