// ==UserScript==
// @name         Bitcointalk Board Stats (con Top Threads e Merit Ratio)
// @namespace    http://tampermonkey.net/
// @version      2.4.1
// @description  Statistiche board Bitcointalk con grafici interattivi, filtro Merit receiver/sender, report annuale, sintesi testuale, top 10 thread per replies, top post per Merit e rapporto Merit ricevuti/inviati.
// @author       Ace
// @match        https://bitcointalk.org/*
// @grant        GM_xmlhttpRequest
// @grant        fetch
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548735/Bitcointalk%20Board%20Stats%20%28con%20Top%20Threads%20e%20Merit%20Ratio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548735/Bitcointalk%20Board%20Stats%20%28con%20Top%20Threads%20e%20Merit%20Ratio%29.meta.js
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
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.ninjastic.space/boards`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.result !== "success" || !data.data) {
                            console.error("Errore API o dati mancanti:", data);
                            resolve(`Board ${boardId}`);
                            return;
                        }
                        for (const board of data.data) {
                            if (board.value == boardId) {
                                console.log("Board trovata:", board.title);
                                resolve(board.title || `Board ${boardId}`);
                                return;
                            }
                            if (board.children && board.children.length > 0) {
                                for (const child of board.children) {
                                    if (child.value == boardId) {
                                        console.log("Child board trovata:", child.title);
                                        resolve(child.title || `Board ${boardId}`);
                                        return;
                                    }
                                }
                            }
                        }
                        resolve(`Board ${boardId}`);
                    } catch (err) {
                        console.error("Errore parsing board name:", err);
                        resolve(`Board ${boardId}`);
                    }
                },
                onerror: function(error) {
                    console.error("Errore richiesta board name:", error);
                    resolve(`Board ${boardId}`);
                }
            });
        });
    }

    // Funzione per recuperare l'elenco delle board
    async function fetchAllBoards() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.ninjastic.space/boards`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.result !== "success" || !data.data) {
                            console.error("Errore API o dati mancanti:", data);
                            resolve([]);
                            return;
                        }
                        const boards = [];
                        const processBoards = (boardList, parentName = "") => {
                            boardList.forEach(board => {
                                const boardName = board.title || `Board ${board.value}`;
                                const displayName = parentName ? `${parentName} > ${boardName}` : boardName;
                                boards.push({
                                    id: board.value,
                                    name: boardName,
                                    displayName: `${board.value} - ${boardName}`
                                });
                                if (board.children && board.children.length > 0) {
                                    processBoards(board.children, boardName);
                                }
                            });
                        };
                        processBoards(data.data);
                        resolve(boards);
                    } catch (err) {
                        console.error("Errore parsing boards:", err);
                        resolve([]);
                    }
                },
                onerror: function(error) {
                    console.error("Errore richiesta boards:", error);
                    resolve([]);
                }
            });
        });
    }

    // Funzione per recuperare le child boards
    async function fetchChildBoards(boardId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.ninjastic.space/boards`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.result !== "success") {
                            throw new Error("Errore API: " + (data.message || "Dati non validi"));
                        }
                        const childBoards = [];
                        const findChildren = (boards) => {
                            boards.forEach(board => {
                                if (board.parent === parseInt(boardId)) {
                                    const boardTitle = board.title || `Board ${board.value}`;
                                    childBoards.push({ id: board.value, title: boardTitle });
                                }
                                if (board.children && board.children.length > 0) {
                                    findChildren(board.children);
                                }
                            });
                        };
                        findChildren(data.data);
                        resolve(childBoards);
                    } catch (err) {
                        console.error("Errore parsing child boards:", err);
                        reject(err);
                    }
                },
                onerror: function(error) {
                    console.error("Errore richiesta child boards:", error);
                    reject(error);
                }
            });
        });
    }

    // Funzione per recuperare i dati Merit da più board (inviati e ricevuti)
    async function fetchMeritBatchData(boardIds, startDate, endDate) {
        let allReceivers = {};
        let allSenders = {};
        let totalMeritsCount = 0;
        let topReceiversSum = 0;
        let topSendersSum = 0;
        let hasMeritData = false;

        // Formatta le date
        const formatDateForBitlist = (dateString) => dateString.split('T')[0];
        const formattedStartDate = formatDateForBitlist(startDate);
        const formattedEndDate = formatDateForBitlist(endDate);

        // Endpoint unificato per Merit (inviati e ricevuti)
        const meritEndpoint = `https://bitlist.co/trpc/merits.top_merit_users?batch=1&input=%7B%220%22%3A%7B%22date_min%22%3A%22${formattedStartDate}%22%2C%22date_max%22%3A%22${formattedEndDate}%22%2C%22board_id%22%3A%5B${boardIds.join('%2C')}%5D%2C%22limit%22%3A1000%7D%7D`;

        try {
            // Recupera i dati Merit con GM_xmlhttpRequest
            const meritData = await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Timeout: La richiesta ha impiegato troppo tempo (10s)."));
                }, 10000);

                GM_xmlhttpRequest({
                    method: "GET",
                    url: meritEndpoint,
                    onload: function(response) {
                        clearTimeout(timeout);
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log("Dati Merit per board:", boardIds, ":", data);
                            resolve(data);
                        } catch (err) {
                            console.error("Errore parsing Merit:", err, response.responseText);
                            reject(new Error(`Errore parsing Merit: ${err.message}`));
                        }
                    },
                    onerror: function(error) {
                        clearTimeout(timeout);
                        console.error("Errore richiesta Merit:", error);
                        reject(new Error(`Errore richiesta Merit: ${error.statusText || error.message}`));
                    }
                });
            });

            // Estrai i dati
            const result = meritData[0]?.result?.data || {};

            // Verifica se ci sono dati Merit
            const hasReceivers = result.top_receivers && result.top_receivers.length > 0;
            const hasSenders = result.top_senders && result.top_senders.length > 0;

            if (!hasReceivers && !hasSenders) {
                console.log(`Nessun dato Merit trovato per le board ${boardIds}.`);
                return {
                    receiver: [],
                    sender: [],
                    totalReceived: 0,
                    totalSent: 0,
                    totalMeritsCount: 0,
                    ratios: [],
                    warning: "Nessun dato Merit trovato per il periodo selezionato."
                };
            }

            hasMeritData = true;

            // Imposta valori predefiniti se i dati sono mancanti
            result.top_receivers = result.top_receivers || [];
            result.top_senders = result.top_senders || [];
            result.total_merits_count = result.total_merits_count || 0;

            // Aggrega i dati
            result.top_receivers.forEach(user => {
                if (!allReceivers[user.user_uid]) {
                    allReceivers[user.user_uid] = { sum: 0, user: user.user };
                }
                allReceivers[user.user_uid].sum += user.sum;
                topReceiversSum += user.sum;
            });

            result.top_senders.forEach(user => {
                if (!allSenders[user.user_uid]) {
                    allSenders[user.user_uid] = { sum: 0, user: user.user };
                }
                allSenders[user.user_uid].sum += user.sum;
                topSendersSum += user.sum;
            });

            // Aggiorna il totale delle transazioni Merit
            totalMeritsCount += result.total_merits_count || 0;

        } catch (err) {
            console.error(`Errore durante il recupero dei dati Merit per le board ${boardIds}:`, err);
            return {
                receiver: [],
                sender: [],
                totalReceived: 0,
                totalSent: 0,
                totalMeritsCount: 0,
                ratios: [],
                warning: `Errore durante il recupero dei dati Merit: ${err.message}`
            };
        }

        // Ordina i dati
        const allReceiversList = Object.entries(allReceivers)
            .sort((a, b) => b[1].sum - a[1].sum)
            .map(([uid, data]) => ({ user_uid: uid, user: data.user, sum: data.sum }));

        const allSendersList = Object.entries(allSenders)
            .sort((a, b) => b[1].sum - a[1].sum)
            .map(([uid, data]) => ({ user_uid: uid, user: data.user, sum: data.sum }));

        // Crea la mappa dei rapporti Merit
        const allUserUids = new Set([...Object.keys(allReceivers), ...Object.keys(allSenders)]);
        const userMeritRatioMap = {};

        allUserUids.forEach(uid => {
            const receiver = allReceivers[uid];
            const sender = allSenders[uid];
            const received = receiver ? receiver.sum : 0;
            const sent = sender ? sender.sum : 0;
            userMeritRatioMap[uid] = {
                user: receiver?.user || sender?.user || `Utente ${uid}`,
                user_uid: uid,
                received: received,
                sent: sent,
                ratio: received > 0 ? (sent / received).toFixed(2) : "N/A"
            };
        });

        // Ordina per Merit ricevuti
        const userRatios = Object.values(userMeritRatioMap)
            .sort((a, b) => b.received - a.received);

        return {
            receiver: allReceiversList,
            sender: allSendersList,
            totalReceived: topReceiversSum,
            totalSent: topSendersSum,
            totalMeritsCount: totalMeritsCount,
            ratios: userRatios
        };
    }

    // Funzione per recuperare il numero di post che hanno ricevuto Merit
    async function fetchMeritedPosts(boardIds, startDate, endDate) {
        const formatDateForBitlist = (dateString) => dateString.split('T')[0];
        const formattedStartDate = formatDateForBitlist(startDate);
        const formattedEndDate = formatDateForBitlist(endDate);

        try {
            const endpoint = `https://bitlist.co/trpc/merits.count_merited_posts?batch=1&input=%7B%220%22%3A%7B%22date_min%22%3A%22${formattedStartDate}%22%2C%22date_max%22%3A%22${formattedEndDate}%22%2C%22board_id%22%3A%5B${boardIds.join('%2C')}%5D%2C%22limit%22%3A100%7D%7D`;

            console.log("Chiamata API per Merited Posts a:", endpoint);

            const response = await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Timeout: La richiesta ha impiegato troppo tempo (10s)."));
                }, 10000);

                GM_xmlhttpRequest({
                    method: "GET",
                    url: endpoint,
                    onload: function(res) {
                        clearTimeout(timeout);
                        try {
                            const data = JSON.parse(res.responseText);
                            resolve(data);
                        } catch (err) {
                            reject(new Error(`Errore parsing Merited Posts: ${err.message}`));
                        }
                    },
                    onerror: function(err) {
                        clearTimeout(timeout);
                        reject(new Error(`Errore richiesta Merited Posts: ${err.statusText || err.message}`));
                    }
                });
            });

            const result = response[0]?.result?.data;
            return result?.meritedCount || result?.count || 0;

        } catch (err) {
            console.error(`Errore durante il recupero dei Merited Posts:`, err);
            return 0;
        }
    }

   // Funzione per recuperare i top post per numero di Merit ricevuti (versione definitiva con GM_xmlhttpRequest)
async function fetchTopMeritedPosts(boardIds, startDate, endDate, limit = 10) {
    const formatDateForBitlist = (dateString) => dateString.split('T')[0];
    const formattedStartDate = formatDateForBitlist(startDate);
    const formattedEndDate = formatDateForBitlist(endDate);

    const endpoint = `https://bitlist.co/trpc/merits.top_posts_by_merit_count?batch=1&input=%7B%220%22%3A%7B%22date_min%22%3A%22${formattedStartDate}%22%2C%22date_max%22%3A%22${formattedEndDate}%22%2C%22board_id%22%3A%5B${boardIds.join('%2C')}%5D%2C%22limit%22%3A${limit}%7D%7D`;

    console.log("Chiamata API per Top Posts by Merit:", endpoint);

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Timeout: La richiesta ha impiegato troppo tempo (15s)."));
        }, 15000); // Timeout aumentato a 15 secondi

        GM_xmlhttpRequest({
            method: "GET",
            url: endpoint,
            onload: function(response) {
                clearTimeout(timeout);

                // Controlla se la risposta è valida
                if (response.status !== 200) {
                    console.error("Errore HTTP:", response.status, response.statusText);
                    reject(new Error(`Errore HTTP: ${response.status} ${response.statusText}`));
                    return;
                }

                if (!response.responseText || response.responseText.trim() === "") {
                    console.error("Risposta vuota dall'API.");
                    reject(new Error("Risposta vuota dall'API."));
                    return;
                }

                try {
                    console.log("Risposta grezza API:", response.responseText);
                    const data = JSON.parse(response.responseText);
                    console.log("Dati parsati:", data);

                    // Controlla la struttura della risposta
                    if (!data || !data[0] || !data[0].result || !data[0].result.data) {
                        console.warn("Struttura risposta API non valida:", data);
                        resolve([]);
                        return;
                    }

                    const result = data[0].result.data;
                    if (!Array.isArray(result)) {
                        console.warn("Dati non sono un array:", result);
                        resolve([]);
                        return;
                    }

                    // Filtra e ordina i post per merit_count
                    const filteredPosts = result
                        .filter(post => post && post.merit_count > 0) // Solo post con almeno 1 merit
                        .sort((a, b) => (b.merit_count || 0) - (a.merit_count || 0))
                        .slice(0, limit);

                    // Mappa i dati nel formato desiderato, fornendo valori di default per i campi mancanti
                    const mappedPosts = filteredPosts.map(post => ({
                        post_id: post.post_id || 0,
                        topic_id: post.topic_id || 0,
                        title: post.title ? (post.title.startsWith("Re: ") ? post.title.substring(4) : post.title) : "Sconosciuto",
                        author: post.author || "Sconosciuto",
                        author_uid: post.author_uid || 0,
                        merit_count: post.merit_count || 0,
                        total_merits: post.total_merits || 0,
                        link: post.topic_id && post.post_id ?
                            `https://bitcointalk.org/index.php?topic=${post.topic_id}.msg${post.post_id}#msg${post.post_id}` :
                            "#"
                    }));

                    console.log("Post mappati:", mappedPosts);
                    resolve(mappedPosts);

                } catch (err) {
                    console.error("Errore parsing JSON:", err, response.responseText);
                    reject(new Error(`Errore parsing: ${err.message}`));
                }
            },
            onerror: function(error) {
                clearTimeout(timeout);
                console.error("Errore richiesta (GM_xmlhttpRequest):", error);
                reject(new Error(`Errore richiesta: ${error.statusText || error.message || "Sconosciuto"}`));
            },
            onabort: function() {
                clearTimeout(timeout);
                reject(new Error("Richiesta annullata."));
            },
            ontimeout: function() {
                clearTimeout(timeout);
                reject(new Error("Timeout: La richiesta ha impiegato troppo tempo."));
            }
        });
    });
}



    // Funzione per assicurarsi che le date abbiano i secondi
    function ensureSeconds(dateTimeString) {
        if (!dateTimeString.endsWith(':59') && !dateTimeString.endsWith(':00')) {
            if (dateTimeString.includes('T23:59')) {
                return dateTimeString.replace('T23:59', 'T23:59:59');
            } else if (dateTimeString.includes('T00:00')) {
                return dateTimeString.replace('T00:00', 'T00:00:00');
            } else {
                return dateTimeString + ':00';
            }
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
                        font: {
                            size: 14
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
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
                    title: {
                        display: true,
                        text: title,
                        font: {
                            size: 14
                        }
                    },
                    legend: {
                        position: 'right'
                    }
                }
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

                if (data.result !== "success" || !data.data || !data.data.posts || data.data.posts.length === 0) {
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
                const title = post.title || "Sconosciuto";
                const author = post.author || "Sconosciuto";

                if (!threads[topicId]) {
                    threads[topicId] = {
                        id: topicId,
                        title: title.startsWith("Re: ") ? title.substring(4) : title,
                        author: author,
                        replyCount: 0,
                        posts: []
                    };
                }
                threads[topicId].posts.push(post);
            });

            for (const threadId in threads) {
                const thread = threads[threadId];
                const posts = thread.posts;
                thread.replyCount = Math.max(0, posts.length - 1);
                if (posts.length > 0 && !posts[0].title.startsWith("Re: ")) {
                    thread.title = posts[0].title;
                }
            }

            const sortedThreads = Object.values(threads)
                .sort((a, b) => b.replyCount - a.replyCount)
                .slice(0, limit);

            return sortedThreads;

        } catch (err) {
            console.error("Errore durante il recupero dei thread:", err);
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
            <div style="
                max-width: 950px;
                margin: 20px auto;
                background: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                border: 1px solid #ddd;
            ">
                <h2 style="text-align: center; margin-bottom: 20px; color: #2e3b4e;">Statistiche Board</h2>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Board:</label>
                    <select id="board-select" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px; margin-bottom: 10px;">
                        <option value="">Caricamento board in corso...</option>
                    </select>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="margin-right: 10px;">oppure</span>
                        <input type="text" id="board-id" placeholder="Inserisci ID board manualmente" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 3px;">
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
                        <input type="datetime-local" id="current-start" value="2025-10-01T00:00:00" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Mese corrente (fine):</label>
                        <input type="datetime-local" id="current-end" value="2025-10-31T23:59:59" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Mese precedente (inizio):</label>
                        <input type="datetime-local" id="previous-start" value="2025-09-01T00:00:00" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Mese precedente (fine):</label>
                        <input type="datetime-local" id="previous-end" value="2025-09-30T23:59:59" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px;">
                    </div>
                </div>

                <div id="annual-date-section" style="display: none; margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Anno:</label>
                    <select id="annual-year" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px;">
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

                <!-- Sezione per la selezione delle statistiche -->
                <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
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
                        <input type="checkbox" id="show-merit-ratio" checked> Top Merit Received/Sent Ratio
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="show-top-merited-posts" checked> Top 10 Post per Merit Ricevuti
                    </label>
                </div>

                <button id="generate-stats" style="
                    width: 100%;
                    padding: 10px;
                    font-weight: bold;
                    background: #2e3b4e;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                ">Genera Statistiche</button>

                <div id="stats-preview" style="margin-top: 20px; display: none;">
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Anteprima Tabella</h3>
                    <div id="preview-table" style="overflow-x: auto;"></div>
                    <div id="charts-container" style="margin-top: 20px;"></div>
                </div>

                <div id="stats-output" style="
                    margin-top: 20px;
                    padding: 15px;
                    background: #f5f5f5;
                    border-radius: 3px;
                    border: 1px solid #ddd;
                    min-height: 100px;
                    display: none;
                ">
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">BBCode</h3>
                    <textarea id="bbcode-output" style="
                        width: 100%;
                        height: 300px;
                        padding: 10px;
                        font-family: monospace;
                        border: 1px solid #ccc;
                        border-radius: 3px;
                        resize: vertical;
                    "></textarea>
                    <button id="copy-bbcode" style="
                        display: block;
                        margin: 10px auto 0;
                        padding: 8px 16px;
                        background: #2e3b4e;
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                    ">Copia BBCode</button>
                </div>

                <button id="close-page" style="
                    display: block;
                    margin: 20px auto 0;
                    padding: 8px 16px;
                    font-weight: bold;
                    background: #ccc;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                ">Chiudi</button>
            </div>
        `;

        document.body.appendChild(page);

        // Gestione del checkbox per il report annuale
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

        // Carica le board nel menu a tendina
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
            // Recupera e normalizza le date
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

        // Nomi dei mesi per l'intestazione
        const currentMonthName = isAnnualReport ? document.querySelector('#annual-year').value : getMonthName(currentStart);
        const previousMonthName = isAnnualReport ? (parseInt(document.querySelector('#annual-year').value) - 1) : getMonthName(previousStart);

        // Recupera il nome della board
        const boardName = await fetchBoardName(boardId);

        const previewDiv = document.querySelector('#stats-preview');
        const outputDiv = document.querySelector('#stats-output');
        const chartsContainer = document.querySelector('#charts-container');

        previewDiv.style.display = 'none';
        outputDiv.style.display = 'none';
        chartsContainer.innerHTML = '';

        // Spinner di caricamento "Dot Wave"
        const loadingMsg = document.createElement('div');
        loadingMsg.style.textAlign = 'center';
        loadingMsg.style.margin = '20px 0';
        loadingMsg.innerHTML = `
            <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p style="color: #666; margin-top: 10px;">Caricamento dati in corso...</p>
            <style>
                .lds-ellipsis {
                    display: inline-block;
                    position: relative;
                    width: 64px;
                    height: 64px;
                }
                .lds-ellipsis div {
                    position: absolute;
                    top: 27px;
                    width: 11px;
                    height: 11px;
                    border-radius: 50%;
                    background: #2e3b4e;
                    animation-timing-function: cubic-bezier(0, 1, 1, 0);
                }
                .lds-ellipsis div:nth-child(1) {
                    left: 6px;
                    animation: lds-ellipsis1 0.6s infinite;
                }
                .lds-ellipsis div:nth-child(2) {
                    left: 6px;
                    animation: lds-ellipsis2 0.6s infinite;
                }
                .lds-ellipsis div:nth-child(3) {
                    left: 26px;
                    animation: lds-ellipsis2 0.6s infinite;
                }
                .lds-ellipsis div:nth-child(4) {
                    left: 45px;
                    animation: lds-ellipsis3 0.6s infinite;
                }
                @keyframes lds-ellipsis1 {
                    0% {
                        transform: scale(0);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                @keyframes lds-ellipsis3 {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(0);
                    }
                }
                @keyframes lds-ellipsis2 {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(19px, 0);
                    }
                }
            </style>
        `;

        previewDiv.parentNode.insertBefore(loadingMsg, previewDiv);

        try {
            // Fetch dati mese corrente (post)
            const currentUrl = `https://api.ninjastic.space/posts/authors?board=${boardId}&child_boards=${childBoards}&after_date=${currentStart}&before_date=${currentEnd}&limit=1000`;
            const currentRes = await fetch(currentUrl);
            const currentJson = await currentRes.json();

            // Fetch dati mese precedente (post)
            const previousUrl = `https://api.ninjastic.space/posts/authors?board=${boardId}&child_boards=${childBoards}&after_date=${previousStart}&before_date=${previousEnd}&limit=1000`;
            const previousRes = await fetch(previousUrl);
            const previousJson = await previousRes.json();

            // Fetch dati mese corrente e precedente (Merit)
            const boardIds = childBoards ? [boardId, ...(await fetchChildBoards(boardId)).map(b => b.id)] : [boardId];

            const currentMeritData = await fetchMeritBatchData(
                boardIds,
                currentStart.split('T')[0],
                currentEnd.split('T')[0]
            );

            const previousMeritData = await fetchMeritBatchData(
                boardIds,
                previousStart.split('T')[0],
                previousEnd.split('T')[0]
            );

            // Fetch dati Merited Posts (mese corrente e precedente)
            const currentMeritedPosts = await fetchMeritedPosts(
                boardIds,
                currentStart.split('T')[0],
                currentEnd.split('T')[0]
            );

            const previousMeritedPosts = await fetchMeritedPosts(
                boardIds,
                previousStart.split('T')[0],
                previousEnd.split('T')[0]
            );

            if (currentJson.result !== "success" || previousJson.result !== "success") {
                loadingMsg.innerHTML = `<p style="color: red; text-align: center;">Errore API: ${currentJson.message || previousJson.message || "Sconosciuto"}</p>`;
                return;
            }

            const currentAuthors = currentJson.data.authors;
            const previousAuthors = previousJson.data.authors;

            // Crea mappa post mese precedente (author_uid -> count)
            const previousPostsMap = {};
            previousAuthors.forEach(a => {
                previousPostsMap[a.author_uid] = a.count || 0;
            });

            // Unisci e ordina gli utenti per post del mese corrente
            const allAuthors = [...currentAuthors];
            allAuthors.sort((a, b) => (b.count || 0) - (a.count || 0));

            // Calcola i totali
            const totalPostsCurrent = currentAuthors.reduce((sum, a) => sum + (a.count || 0), 0);
            const totalPostsPrevious = previousAuthors.reduce((sum, a) => sum + (a.count || 0), 0);
            const totalMeritReceivedCurrent = currentMeritData.totalReceived;
            const totalMeritReceivedPrevious = previousMeritData.totalReceived;
            const totalMeritSentCurrent = currentMeritData.totalSent;
            const totalMeritSentPrevious = previousMeritData.totalSent;
            const totalMeritsCountCurrent = currentMeritData.totalMeritsCount;
            const totalMeritsCountPrevious = previousMeritData.totalMeritsCount;

            // Calcola la variazione percentuale
            const postVariation = totalPostsCurrent - totalPostsPrevious;
            const postVariationPercent = totalPostsPrevious > 0 ? ((postVariation / totalPostsPrevious) * 100).toFixed(2) : (totalPostsCurrent > 0 ? "∞" : "0");

            const meritReceivedVariation = totalMeritReceivedCurrent - totalMeritReceivedPrevious;
            const meritReceivedVariationPercent = totalMeritReceivedPrevious > 0 ? ((meritReceivedVariation / totalMeritReceivedPrevious) * 100).toFixed(2) : (totalMeritReceivedCurrent > 0 ? "∞" : "0");

            const meritSentVariation = totalMeritSentCurrent - totalMeritSentPrevious;
            const meritSentVariationPercent = totalMeritSentPrevious > 0 ? ((meritSentVariation / totalMeritSentPrevious) * 100).toFixed(2) : (totalMeritSentCurrent > 0 ? "∞" : "0");

            const meritsCountVariation = totalMeritsCountCurrent - totalMeritsCountPrevious;
            const meritsCountVariationPercent = totalMeritsCountPrevious > 0 ? ((meritsCountVariation / totalMeritsCountPrevious) * 100).toFixed(2) : (totalMeritsCountCurrent > 0 ? "∞" : "0");

            // Calcola Unmerited Posts
            const currentUnmeritedPosts = totalPostsCurrent - currentMeritedPosts;
            const previousUnmeritedPosts = totalPostsPrevious - previousMeritedPosts;

            // Distribuzione post per child board (se attivate)
            let childBoardDistribution = {};
            let childBoardVariation = {};

            if (childBoards) {
                const childBoardsList = await fetchChildBoards(boardId);

                for (const child of childBoardsList) {
                    const childUrlCurrent = `https://api.ninjastic.space/posts/authors?board=${child.id}&after_date=${currentStart}&before_date=${currentEnd}&limit=1000`;
                    const childResCurrent = await fetch(childUrlCurrent);
                    const childJsonCurrent = await childResCurrent.json();

                    const childUrlPrevious = `https://api.ninjastic.space/posts/authors?board=${child.id}&after_date=${previousStart}&before_date=${previousEnd}&limit=1000`;
                    const childResPrevious = await fetch(childUrlPrevious);
                    const childJsonPrevious = await childResPrevious.json();

                    if (childJsonCurrent.result === "success" && childJsonPrevious.result === "success") {
                        const childPostsCurrent = childJsonCurrent.data.authors.reduce((sum, a) => sum + (a.count || 0), 0);
                        const childPostsPrevious = childJsonPrevious.data.authors.reduce((sum, a) => sum + (a.count || 0), 0);

                        childBoardDistribution[child.title] = childPostsCurrent;

                        const variation = childPostsCurrent - childPostsPrevious;
                        const variationPercent = childPostsPrevious > 0 ? ((variation / childPostsPrevious) * 100).toFixed(2) : (childPostsCurrent > 0 ? "∞" : "0");

                        childBoardVariation[child.title] = {
                            variation,
                            variationPercent
                        };
                    }
                }
            }

            // Anteprima tabella HTML (post)
            let previewTable = ``;

            // BBCode con intestazione dinamica (post)
            let bbcode = ``;

            // Analizza la distribuzione dei post per utente
            const postDistribution = {
                "1 post": 0,
                "2-5 post": 0,
                "6-10 post": 0,
                "11-20 post": 0,
                "21-50 post": 0,
                ">50 post": 0
            };

            allAuthors.forEach(author => {
                const postCount = author.count || 0;
                if (postCount === 1) postDistribution["1 post"]++;
                else if (postCount >= 2 && postCount <= 5) postDistribution["2-5 post"]++;
                else if (postCount >= 6 && postCount <= 10) postDistribution["6-10 post"]++;
                else if (postCount >= 11 && postCount <= 20) postDistribution["11-20 post"]++;
                else if (postCount >= 21 && postCount <= 50) postDistribution["21-50 post"]++;
                else if (postCount > 50) postDistribution[">50 post"]++;
            });

            // Genera la tabella HTML per la distribuzione dei post
            let postDistributionPreview = ``;

            // Genera il BBCode per la distribuzione dei post
            let postDistributionBBCode = ``;

            // Anteprima tabelle Merit (affiancate)
            let meritPreview = ``;

            // BBCode per Merit (affiancate)
            let meritBBCode = ``;

            // Unisci i dati dei post e dei merit per calcolare il rateo
            const userRateoMap = {};

            allAuthors.forEach(author => {
                const userUid = author.author_uid;
                const postCount = author.count || 0;
                const meritUser = currentMeritData.receiver.find(u => u.user_uid == userUid);
                const meritCount = meritUser ? meritUser.sum : 0;
                const rateo = postCount > 0 ? (meritCount / postCount).toFixed(2) : 0;

                userRateoMap[userUid] = {
                    user: author.author,
                    userUid,
                    postCount,
                    meritCount,
                    rateo: parseFloat(rateo)
                };
            });

            // Ordina per rateo e prendi i primi 10 (filtra utenti con almeno 1 post)
            const topRateoUsers = Object.values(userRateoMap)
                .filter(user => user.postCount > 0)
                .sort((a, b) => b.rateo - a.rateo)
                .slice(0, 10);

            // Genera la tabella HTML per il rateo
            let rateoPreview = ``;

            // Genera il BBCode per il rateo
            let rateoBBCode = ``;

            // Calcola gli utenti con il maggior impatto (Post + Merit)
            const userImpactMap = {};

            allAuthors.forEach(author => {
                const userUid = author.author_uid;
                const postCount = author.count || 0;
                const meritUser = currentMeritData.receiver.find(u => u.user_uid == userUid);
                const meritCount = meritUser ? meritUser.sum : 0;

                // Calcola il punteggio di impatto: (post * 0.5) + (merit * 1.5)
                const impactScore = (postCount * 0.5) + (meritCount * 1.5);

                userImpactMap[userUid] = {
                    user: author.author,
                    userUid,
                    postCount,
                    meritCount,
                    impactScore: impactScore.toFixed(2)
                };
            });

            // Ordina per impatto e prendi i primi 10
            const topImpactUsers = Object.values(userImpactMap)
                .filter(user => user.postCount > 0 || user.meritCount > 0)
                .sort((a, b) => parseFloat(b.impactScore) - parseFloat(a.impactScore))
                .slice(0, 10);

            // Genera la tabella HTML per l'impatto
            let impactPreview = ``;

            // Genera il BBCode per l'impatto
            let impactBBCode = ``;

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

            // Usa i dati già calcolati in fetchMeritBatchData
            const userRatios = currentMeritData.ratios;

            // Filtra gli utenti con rapporto "N/A" e ordina per rapporto
            const filteredUserRatios = userRatios
                .filter(user => user.received > 0 && user.sent > 0 && user.ratio !== "N/A")
                .sort((a, b) => parseFloat(b.ratio) - parseFloat(a.ratio))
                .slice(0, 20);

            // Genera la tabella HTML per il rapporto Merit ricevuti/inviati
            let meritRatioPreview = `
                <div style="margin-top: 20px;">
                    <h4 style="text-align: center; margin-bottom: 10px;">Top 20 Utenti per Rapporto Merit Ricevuti/Inviati</h4>
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

            // Genera il BBCode per il rapporto Merit ricevuti/inviati
            let meritRatioBBCode = `
[center][b]Top 20 Utenti per Rapporto Merit Ricevuti/Inviati[/b][/center]
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

            // Genera la tabella dei post solo se richiesto
            if (showPosts) {
                previewTable += `
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 13px;">
                        <tr style="background: #f0f0f0;">
                            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 5%;">Pos.</th>
                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd; width: 25%;">User</th>
                            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 10%;">Post (${isAnnualReport ? currentMonthName : currentMonthName})</th>
                            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 10%;">Post (${isAnnualReport ? previousMonthName : previousMonthName})</th>
                            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 10%;">Change</th>
                        </tr>
                `;

                allAuthors.forEach((a, index) => {
                    const username = a.author || 'Sconosciuto';
                    const userUid = a.author_uid || '';
                    const currentCount = a.count || 0;
                    const previousCount = previousPostsMap[userUid] || 0;
                    const diff = currentCount - previousCount;

                    let variationColor = 'green';
                    let variationText = `▲${diff}`;

                    if (diff < 0) {
                        variationColor = 'red';
                        variationText = `▼${Math.abs(diff)}`;
                    } else if (diff === 0) {
                        variationColor = 'blue';
                        variationText = `=0`;
                    }

                    const userLink = userUid ? `<a href="https://bitcointalk.org/index.php?action=profile;u=${userUid}" target="_blank">${username}</a>` : username;

                    previewTable += `
                        <tr style="border: 1px solid #ddd;">
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}.</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${userLink}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${currentCount}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${previousCount}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center; color: ${variationColor};">${variationText}</td>
                        </tr>
                    `;
                });

                previewTable += `</table>`;

                // BBCode con intestazione dinamica (post)
                bbcode += `[center][b][size=12pt]Statistiche Board[/size][/b][/center]
[center][i]Confronto: ${isAnnualReport ? previousMonthName : previousMonthName} vs ${isAnnualReport ? currentMonthName : currentMonthName}[/i][/center]

[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]User[/b][/td]
[td][b]Post (${isAnnualReport ? currentMonthName : currentMonthName})[/b][/td]
[td][b]Post (${isAnnualReport ? previousMonthName : previousMonthName})[/b][/td]
[td][b]Change[/b][/td]
[/tr]
`;

                allAuthors.forEach((a, index) => {
                    const username = a.author || 'Sconosciuto';
                    const userUid = a.author_uid || '';
                    const currentCount = a.count || 0;
                    const previousCount = previousPostsMap[userUid] || 0;
                    const diff = currentCount - previousCount;

                    let variationColor = 'green';
                    let variationText = `[color=${variationColor}]▲${diff}[/color]`;

                    if (diff < 0) {
                        variationColor = 'red';
                        variationText = `[color=${variationColor}]▼${Math.abs(diff)}[/color]`;
                    } else if (diff === 0) {
                        variationColor = 'blue';
                        variationText = `[color=${variationColor}]=0[/color]`;
                    }

                    const userLink = userUid ? `[url=https://bitcointalk.org/index.php?action=profile;u=${userUid}]${username}[/url]` : username;

                    bbcode += `[tr]
[td]${index + 1}.[/td]
[td]${userLink}[/td]
[td]${currentCount}[/td]
[td]${previousCount}[/td]
[td]${variationText}[/td]
[/tr]
`;
                });

                bbcode += `[/table]`;
            }

            // Genera la distribuzione dei post solo se richiesto
            if (showDistribution) {
                postDistributionPreview += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Distribuzione Post per Utente (${isAnnualReport ? currentMonthName : currentMonthName})</h4>
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

                // Genera il BBCode per la distribuzione dei post
                postDistributionBBCode += `
[center][b]Distribuzione Post per Utente (${isAnnualReport ? currentMonthName : currentMonthName})[/b][/center]
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

            // Genera le tabelle Merit solo se richiesto
            if (showMeritReceiver) {
                meritPreview += `
                    <div style="display: flex; gap: 20px; margin-top: 20px;">
                        <div style="flex: 1;">
                            <h4 style="text-align: center; margin-bottom: 10px;">Top 200 Merit Receiver</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                <tr style="background: #f0f0f0;">
                                    <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Pos.</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">User</th>
                                    <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Merit Ricevuti</th>
                                </tr>
                `;

                currentMeritData.receiver.slice(0, 200).forEach((user, index) => {
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

                meritPreview += `</table></div></div>`;

                // BBCode per Merit (affiancate)
                meritBBCode += `
[center][b]Top 200 Merit Receiver[/b][/center]
[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]User[/b][/td]
[td][b]Merit Ricevuti[/b][/td]
[/tr]
                `;

                currentMeritData.receiver.slice(0, 200).forEach((user, index) => {
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

            // Genera la tabella dei Merit Sender solo se richiesto
            if (showMeritSender) {
                meritPreview += `
                    <div style="display: flex; gap: 20px; margin-top: 20px;">
                        <div style="flex: 1;">
                            <h4 style="text-align: center; margin-bottom: 10px;">Top 200 Merit Sender</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                <tr style="background: #f0f0f0;">
                                    <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Pos.</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">User</th>
                                    <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Merit Inviati</th>
                                </tr>
                `;

                currentMeritData.sender.slice(0, 200).forEach((user, index) => {
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

                meritPreview += `</table></div></div>`;

                // BBCode per Merit Sender
                meritBBCode += `
[center][b]Top 200 Merit Sender[/b][/center]
[table]
[tr]
[td][b]Pos.[/b][/td]
[td][b]User[/b][/td]
[td][b]Merit Inviati[/b][/td]
[/tr]
                `;

                currentMeritData.sender.slice(0, 200).forEach((user, index) => {
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

            // Genera il rateo solo se richiesto
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

                // Genera il BBCode per il rateo
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

            // Genera l'impatto solo se richiesto
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

                // Genera il BBCode per l'impatto
                impactBBCode += `
[center][b]Top 10 Utenti per Impatto (Post + Merit)[/b][/center]
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

            // Genera la sintesi testuale solo se richiesto
            let summaryText = ``;
            let summaryBBCode = ``;

            if (showSummary) {
                summaryText += `
                    <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px; border: 1px solid #ddd;">
                        <h4 style="text-align: center; margin-bottom: 15px; color: #2e3b4e;">Sintesi degli Andamenti</h4>
                        <p style="margin-bottom: 10px;"><strong>Periodo analizzato:</strong> ${isAnnualReport ? currentMonthName : currentMonthName} (vs ${isAnnualReport ? previousMonthName : previousMonthName})</p>
                        <p style="margin-bottom: 10px;"><strong>Board:</strong> ${boardName} (ID: ${boardId}) ${childBoards ? "(incluse child boards)" : ""}</p>
                        <p style="margin-bottom: 10px;">
                            <strong>Post totali (${isAnnualReport ? previousMonthName : previousMonthName}):</strong> ${totalPostsPrevious}<br>
                            <strong>Post totali (${isAnnualReport ? currentMonthName : currentMonthName}):</strong> ${totalPostsCurrent}<br>
                            <strong>Variazione post:</strong> ${postVariation} (${postVariationPercent}%)<br>
                            <strong>Merit totali ricevuti (${isAnnualReport ? previousMonthName : previousMonthName}):</strong> ${totalMeritReceivedPrevious}<br>
                            <strong>Merit totali ricevuti (${isAnnualReport ? currentMonthName : currentMonthName}):</strong> ${totalMeritReceivedCurrent}<br>
                            <strong>Variazione Merit ricevuti:</strong> ${meritReceivedVariation} (${meritReceivedVariationPercent}%)<br>
                            <strong>Merit totali inviati (${isAnnualReport ? previousMonthName : previousMonthName}):</strong> ${totalMeritSentPrevious}<br>
                            <strong>Merit totali inviati (${isAnnualReport ? currentMonthName : currentMonthName}):</strong> ${totalMeritSentCurrent}<br>
                            <strong>Variazione Merit inviati:</strong> ${meritSentVariation} (${meritSentVariationPercent}%)<br>
                            <strong>Totale transazioni Merit:</strong> ${totalMeritsCountCurrent}<br>
                            <strong>Media Merit/Post:</strong> ${totalPostsCurrent > 0 ? (totalMeritReceivedCurrent / totalPostsCurrent).toFixed(2) : 0}<br>
                            <strong>Post con Merit (${isAnnualReport ? previousMonthName : previousMonthName}):</strong> ${previousMeritedPosts}<br>
                            <strong>Post con Merit (${isAnnualReport ? currentMonthName : currentMonthName}):</strong> ${currentMeritedPosts}<br>
                            <strong>Post senza Merit (${isAnnualReport ? previousMonthName : previousMonthName}):</strong> ${previousUnmeritedPosts}<br>
                            <strong>Post senza Merit (${isAnnualReport ? currentMonthName : currentMonthName}):</strong> ${currentUnmeritedPosts}
                        </p>
                        ${childBoards ?
                        `<p style="margin-bottom: 10px;"><strong>Distribuzione Post per Child Board:</strong></p>
                        <ul style="margin-bottom: 15px; padding-left: 20px;">
                            ${Object.entries(childBoardDistribution).map(([title, posts]) => {
                                const variation = childBoardVariation[title]?.variation || 0;
                                const variationPercent = childBoardVariation[title]?.variationPercent || 0;
                                return `<li><strong>${title}:</strong> ${posts} post (Variazione: ${variation} post, ${variationPercent}%)</li>`;
                            }).join('')}
                        </ul>` : ''}
                        <p style="margin-bottom: 10px;"><strong>Utenti attivi:</strong> ${allAuthors.length} (di cui ${allAuthors.filter(a => (a.count || 0) >= 2).length} con almeno 2 post in ${isAnnualReport ? currentMonthName : currentMonthName})</p>

                        <h5 style="margin: 15px 0 10px 0; color: #2e3b4e;">Top Poster</h5>
                        <ul style="margin-bottom: 15px; padding-left: 20px;">
                            <li><strong>1°:</strong> ${allAuthors[0]?.author || "Nessuno"} (${allAuthors[0]?.count || 0} post in ${isAnnualReport ? currentMonthName : currentMonthName})</li>
                            <li><strong>2°:</strong> ${allAuthors[1]?.author || "Nessuno"} (${allAuthors[1]?.count || 0} post)</li>
                            <li><strong>3°:</strong> ${allAuthors[2]?.author || "Nessuno"} (${allAuthors[2]?.count || 0} post)</li>
                        </ul>

                        <h5 style="margin: 15px 0 10px 0; color: #2e3b4e;">Top Merit Receiver</h5>
                        <ul style="margin-bottom: 15px; padding-left: 20px;">
                            <li><strong>1°:</strong> ${currentMeritData.receiver[0]?.user || "Nessuno"} (${currentMeritData.receiver[0]?.sum || 0} merit)</li>
                            <li><strong>2°:</strong> ${currentMeritData.receiver[1]?.user || "Nessuno"} (${currentMeritData.receiver[1]?.sum || 0} merit)</li>
                            <li><strong>3°:</strong> ${currentMeritData.receiver[2]?.user || "Nessuno"} (${currentMeritData.receiver[2]?.sum || 0} merit)</li>
                        </ul>

                        <h5 style="margin: 15px 0 10px 0; color: #2e3b4e;">Top Merit Sender</h5>
                        <ul style="margin-bottom: 15px; padding-left: 20px;">
                            <li><strong>1°:</strong> ${currentMeritData.sender[0]?.user || "Nessuno"} (${currentMeritData.sender[0]?.sum || 0} merit)</li>
                            <li><strong>2°:</strong> ${currentMeritData.sender[1]?.user || "Nessuno"} (${currentMeritData.sender[1]?.sum || 0} merit)</li>
                            <li><strong>3°:</strong> ${currentMeritData.sender[2]?.user || "Nessuno"} (${currentMeritData.sender[2]?.sum || 0} merit)</li>
                        </ul>

                        <h5 style="margin: 15px 0 10px 0; color: #2e3b4e;">Distribuzione Post</h5>
                        <p style="margin-bottom: 10px;">
                            ${postDistribution["1 post"]} utenti con 1 post,<br>
                            ${postDistribution["2-5 post"]} utenti con 2-5 post,<br>
                            ${postDistribution["6-10 post"]} utenti con 6-10 post,<br>
                            ${postDistribution[">50 post"]} utenti con più di 50 post.
                        </p>

                        <h5 style="margin: 15px 0 10px 0; color: #2e3b4e;">Utenti con Maggior Impatto</h5>
                        <ul style="margin-bottom: 15px; padding-left: 20px;">
                            <li><strong>1°:</strong> ${topImpactUsers[0]?.user || "Nessuno"} (Impatto: ${topImpactUsers[0]?.impactScore || 0})</li>
                            <li><strong>2°:</strong> ${topImpactUsers[1]?.user || "Nessuno"} (Impatto: ${topImpactUsers[1]?.impactScore || 0})</li>
                            <li><strong>3°:</strong> ${topImpactUsers[2]?.user || "Nessuno"} (Impatto: ${topImpactUsers[2]?.impactScore || 0})</li>
                        </ul>

                        <h5 style="margin: 15px 0 10px 0; color: #2e3b4e;">Rateo Merit/Post</h5>
                        <p style="margin-bottom: 10px;">
                            ${topRateoUsers[0]?.user || "Nessuno"} ha il rateo più alto: ${topRateoUsers[0]?.rateo || 0} merit per post.
                        </p>
                    </div>
                `;

                summaryBBCode += `
[center][b][size=12pt]Sintesi degli Andamenti[/size][/b][/center]
[b]Periodo analizzato:[/b] ${isAnnualReport ? currentMonthName : currentMonthName} (vs ${isAnnualReport ? previousMonthName : previousMonthName})
[b]Board:[/b] ${boardName} (ID: ${boardId}) ${childBoards ? "(incluse child boards)" : ""}
[b]Post totali (${isAnnualReport ? previousMonthName : previousMonthName}):[/b] ${totalPostsPrevious}
[b]Post totali (${isAnnualReport ? currentMonthName : currentMonthName}):[/b] ${totalPostsCurrent}
[b]Variazione post:[/b] ${postVariation} (${postVariationPercent}%)
[b]Merit totali ricevuti (${isAnnualReport ? previousMonthName : previousMonthName}):[/b] ${totalMeritReceivedPrevious}
[b]Merit totali ricevuti (${isAnnualReport ? currentMonthName : currentMonthName}):[/b] ${totalMeritReceivedCurrent}
[b]Variazione Merit ricevuti:[/b] ${meritReceivedVariation} (${meritReceivedVariationPercent}%)
[b]Merit totali inviati (${isAnnualReport ? previousMonthName : previousMonthName}):[/b] ${totalMeritSentPrevious}
[b]Merit totali inviati (${isAnnualReport ? currentMonthName : currentMonthName}):[/b] ${totalMeritSentCurrent}
[b]Variazione Merit inviati:[/b] ${meritSentVariation} (${meritSentVariationPercent}%)
[b]Totale transazioni Merit:[/b] ${totalMeritsCountCurrent}
[b]Media Merit/Post:[/b] ${totalPostsCurrent > 0 ? (totalMeritReceivedCurrent / totalPostsCurrent).toFixed(2) : 0}
[b]Post con Merit (${isAnnualReport ? previousMonthName : previousMonthName}):[/b] ${previousMeritedPosts}
[b]Post con Merit (${isAnnualReport ? currentMonthName : currentMonthName}):[/b] ${currentMeritedPosts}
[b]Post senza Merit (${isAnnualReport ? previousMonthName : previousMonthName}):[/b] ${previousUnmeritedPosts}
[b]Post senza Merit (${isAnnualReport ? currentMonthName : currentMonthName}):[/b] ${currentUnmeritedPosts}

${childBoards ?
`[center][b]Distribuzione Post per Child Board[/b][/center]
[list]
${Object.entries(childBoardDistribution).map(([title, posts]) => {
    const variation = childBoardVariation[title]?.variation || 0;
    const variationPercent = childBoardVariation[title]?.variationPercent || 0;
    return `[*]${title}: ${posts} post (Variazione: ${variation} post, ${variationPercent}%)`;
}).join('\n')}
[/list]` : ''}

[b]Utenti attivi:[/b] ${allAuthors.length} (di cui ${allAuthors.filter(a => (a.count || 0) >= 2).length} con almeno 2 post in ${isAnnualReport ? currentMonthName : currentMonthName})

[center][b]Top Poster[/b][/center]
[list]
[*]1°: ${allAuthors[0]?.author || "Nessuno"} (${allAuthors[0]?.count || 0} post in ${isAnnualReport ? currentMonthName : currentMonthName})
[*]2°: ${allAuthors[1]?.author || "Nessuno"} (${allAuthors[1]?.count || 0} post)
[*]3°: ${allAuthors[2]?.author || "Nessuno"} (${allAuthors[2]?.count || 0} post)
[/list]

[center][b]Top Merit Receiver[/b][/center]
[list]
[*]1°: ${currentMeritData.receiver[0]?.user || "Nessuno"} (${currentMeritData.receiver[0]?.sum || 0} merit)
[*]2°: ${currentMeritData.receiver[1]?.user || "Nessuno"} (${currentMeritData.receiver[1]?.sum || 0} merit)
[*]3°: ${currentMeritData.receiver[2]?.user || "Nessuno"} (${currentMeritData.receiver[2]?.sum || 0} merit)
[/list]

[center][b]Top Merit Sender[/b][/center]
[list]
[*]1°: ${currentMeritData.sender[0]?.user || "Nessuno"} (${currentMeritData.sender[0]?.sum || 0} merit)
[*]2°: ${currentMeritData.sender[1]?.user || "Nessuno"} (${currentMeritData.sender[1]?.sum || 0} merit)
[*]3°: ${currentMeritData.sender[2]?.user || "Nessuno"} (${currentMeritData.sender[2]?.sum || 0} merit)
[/list]

[center][b]Distribuzione Post[/b][/center]
${postDistribution["1 post"]} utenti con 1 post
${postDistribution["2-5 post"]} utenti con 2-5 post
${postDistribution["6-10 post"]} utenti con 6-10 post
${postDistribution[">50 post"]} utenti con più di 50 post

[center][b]Utenti con Maggior Impatto[/b][/center]
[list]
[*]1°: ${topImpactUsers[0]?.user || "Nessuno"} (Impatto: ${topImpactUsers[0]?.impactScore || 0})
[*]2°: ${topImpactUsers[1]?.user || "Nessuno"} (Impatto: ${topImpactUsers[1]?.impactScore || 0})
[*]3°: ${topImpactUsers[2]?.user || "Nessuno"} (Impatto: ${topImpactUsers[2]?.impactScore || 0})
[/list]

[center][b]Rateo Merit/Post[/b][/center]
${topRateoUsers[0]?.user || "Nessuno"} ha il rateo più alto: ${topRateoUsers[0]?.rateo || 0} merit per post
`;
            }

            // Genera la top 10 thread per replies solo se richiesto
            let topThreadsPreview = ``;
            let topThreadsBBCode = ``;

            if (showTopThreads) {
                const topThreads = await fetchCustomThreadsEndpoint(boardId, currentStart, currentEnd, childBoards, 10);

                // Genera la tabella HTML per i top thread
                topThreadsPreview += `
                    <div style="margin-top: 20px;">
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 10 Thread per Numero di Replies</h4>
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

                // Genera il BBCode per i top thread
                topThreadsBBCode += `
[center][b]Top 10 Thread per Numero di Replies[/b][/center]
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

            // Recupera i top post per Merit (solo se richiesto)
let topMeritedPostsPreview = ``;
let topMeritedPostsBBCode = ``;
let topMeritedPosts = [];

if (showTopMeritedPosts) {
    console.log("Recupero top post per Merit...");
    try {
        topMeritedPosts = await fetchTopMeritedPosts(
            boardIds,
            currentStart.split('T')[0],
            currentEnd.split('T')[0],
            10
        );
        console.log("Top Merited Posts recuperati:", topMeritedPosts);

        if (topMeritedPosts.length > 0) {
            // Genera la tabella HTML per i top post per Merit
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
                        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${post.merit_count}</td>
                        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                            <a href="https://bitcointalk.org/index.php?action=profile;u=${post.author_uid}" target="_blank">${post.author}</a>
                        </td>
                        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                            <a href="${post.link}" target="_blank">Apri</a>
                        </td>
                    </tr>
                `;
            });
            topMeritedPostsPreview += `</table></div>`;

            // Genera il BBCode per i top post per Merit
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
[td]${post.merit_count}[/td]
[td][url=https://bitcointalk.org/index.php?action=profile;u=${post.author_uid}]${post.author}[/url][/td]
[td][url=${post.link}]Apri[/url][/td]
[/tr]
                `;
            });
            topMeritedPostsBBCode += `[/table]`;

        } else {
            topMeritedPostsPreview = `<p style="text-align: center; color: #666;">Nessun post con Merit trovato per il periodo selezionato.</p>`;
            topMeritedPostsBBCode = `[center][i]Nessun post con merit trovato per il periodo selezionato.[/i][/center]`;
        }

    } catch (err) {
        console.error("Errore nel recupero dei top post per Merit:", err);
        topMeritedPostsPreview = `<p style="text-align: center; color: red;">Errore nel recupero dei post con più Merit: ${err.message}</p>`;
        topMeritedPostsBBCode = `[center][color=red][b]Errore:[/b] ${err.message}[/color][/center]`;
    }
}


            // Aggiungi i grafici con pulsanti di download solo se richiesto
            chartsContainer.innerHTML = ``;

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
                    <div style="display: flex; gap: 20px; margin-top: 20px;">
                        <div style="flex: 1;">
                            <h4 style="text-align: center; margin-bottom: 10px;">Top 200 Merit Receiver</h4>
                            <canvas id="topReceiverChart" style="max-height: 300px;"></canvas>
                            <button id="downloadTopReceiverChart"
                                    style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                                Apri Grafico
                            </button>
                        </div>
                    </div>
                `;
            }

            if (showMeritSender) {
                chartsContainer.innerHTML += `
                    <div style="display: flex; gap: 20px; margin-top: 20px;">
                        <div style="flex: 1;">
                            <h4 style="text-align: center; margin-bottom: 10px;">Top 200 Merit Sender</h4>
                            <canvas id="topSenderChart" style="max-height: 300px;"></canvas>
                            <button id="downloadTopSenderChart"
                                    style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                                Apri Grafico
                            </button>
                        </div>
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
                        <h4 style="text-align: center; margin-bottom: 10px;">Top 20 Utenti per Rapporto Merit Ricevuti/Inviati</h4>
                        <canvas id="topMeritRatioChart" style="max-height: 300px;"></canvas>
                        <button id="downloadTopMeritRatioChart"
                                style="display: block; margin: 10px auto; padding: 5px 10px; background: #2e3b4e; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            Apri Grafico
                        </button>
                    </div>
                `;
            }

            if (showTopMeritedPosts && topMeritedPosts && topMeritedPosts.length > 0) {
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
                    // Distribuzione post (torta)
                    createPieChart(
                        'postDistributionChart',
                        Object.keys(postDistribution),
                        Object.values(postDistribution),
                        `Distribuzione Post per Utente (${isAnnualReport ? currentMonthName : currentMonthName})`
                    );

                    // Aggiungi event listener al pulsante di download
                    document.getElementById('downloadPostDistributionChart')?.addEventListener('click', () => {
                        openChartImage('postDistributionChart', `Distribuzione_Post_per_Utente_${isAnnualReport ? currentMonthName : currentMonthName}`);
                    });
                }

                if (showMeritReceiver) {
                    // Top Merit Receiver (barre)
                    createBarChart(
                        'topReceiverChart',
                        currentMeritData.receiver.slice(0, 200).map(u => u.user),
                        currentMeritData.receiver.slice(0, 200).map(u => u.sum),
                        'Top 200 Merit Receiver',
                        'Merit Ricevuti'
                    );

                    // Aggiungi event listener al pulsante di download
                    document.getElementById('downloadTopReceiverChart')?.addEventListener('click', () => {
                        openChartImage('topReceiverChart', 'Top_200_Merit_Receiver');
                    });
                }

                if (showMeritSender) {
                    // Top Merit Sender (barre)
                    createBarChart(
                        'topSenderChart',
                        currentMeritData.sender.slice(0, 200).map(u => u.user),
                        currentMeritData.sender.slice(0, 200).map(u => u.sum),
                        'Top 200 Merit Sender',
                        'Merit Inviati'
                    );

                    // Aggiungi event listener al pulsante di download
                    document.getElementById('downloadTopSenderChart')?.addEventListener('click', () => {
                        openChartImage('topSenderChart', 'Top_200_Merit_Sender');
                    });
                }

                if (showRateo) {
                    // Top Rateo (barre)
                    createBarChart(
                        'topRateoChart',
                        topRateoUsers.map(u => u.user),
                        topRateoUsers.map(u => u.rateo),
                        'Top 10 Utenti per Rateo Merit/Post',
                        'Rateo'
                    );

                    // Aggiungi event listener al pulsante di download
                    document.getElementById('downloadTopRateoChart')?.addEventListener('click', () => {
                        openChartImage('topRateoChart', 'Top_10_Utenti_per_Rateo_Merit_Post');
                    });
                }

                if (showImpact) {
                    // Top Impatto (barre)
                    createBarChart(
                        'topImpactChart',
                        topImpactUsers.map(u => u.user),
                        topImpactUsers.map(u => parseFloat(u.impactScore)),
                        'Top 10 Utenti per Impatto',
                        'Impatto'
                    );

                    // Aggiungi event listener al pulsante di download
                    document.getElementById('downloadTopImpactChart')?.addEventListener('click', () => {
                        openChartImage('topImpactChart', 'Top_10_Utenti_per_Impatto');
                    });
                }

                if (showMeritRatio) {
                    // Top Merit Ratio (barre)
                    createBarChart(
                        'topMeritRatioChart',
                        filteredUserRatios.map(u => u.user),
                        filteredUserRatios.map(u => parseFloat(u.ratio)),
                        'Top 20 Utenti per Rapporto Merit Ricevuti/Inviati',
                        'Rapporto'
                    );

                    // Aggiungi event listener al pulsante di download
                    document.getElementById('downloadTopMeritRatioChart')?.addEventListener('click', () => {
                        openChartImage('topMeritRatioChart', 'Top_20_Utenti_per_Rapporte_Merit_Ricevuti_Inviati');
                    });
                }

                if (showTopMeritedPosts && topMeritedPosts && topMeritedPosts.length > 0) {
                    // Top Merited Posts (barre)
                    createBarChart(
                        'topMeritedPostsChart',
                        topMeritedPosts.map(post => post.title),
                        topMeritedPosts.map(post => post.merit_count),
                        'Top 10 Post per Merit Ricevuti',
                        'Merit'
                    );

                    // Aggiungi event listener al pulsante di download
                    document.getElementById('downloadTopMeritedPostsChart')?.addEventListener('click', () => {
                        openChartImage('topMeritedPostsChart', 'Top_10_Post_per_Merit_Ricevuti');
                    });
                }

                // Mostra anteprima e BBCode
                loadingMsg.remove();
                previewDiv.style.display = 'block';
                outputDiv.style.display = 'block';

                document.querySelector('#preview-table').innerHTML = summaryText + previewTable + postDistributionPreview + meritPreview + rateoPreview + impactPreview + (showMeritRatio ? meritRatioPreview : '') + topThreadsPreview + (showTopMeritedPosts ? topMeritedPostsPreview : '');
                document.querySelector('#bbcode-output').value = summaryBBCode + bbcode + postDistributionBBCode + meritBBCode + rateoBBCode + impactBBCode + (showMeritRatio ? meritRatioBBCode : '') + topThreadsBBCode + (showTopMeritedPosts ? topMeritedPostsBBCode : '');

            }, 500);

        } catch (err) {
            console.error("Errore generale durante il recupero dei dati:", err);
            loadingMsg.innerHTML = '<p style="color: red; text-align: center;">Errore durante il caricamento dati. Vedi console per dettagli.</p>';
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
