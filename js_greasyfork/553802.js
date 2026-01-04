// ==UserScript==
// @name         Atualizador de Ranking
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Detecta o gênero do tópico atual e gera o post de atualização do ranking.
// @author       Chris Popper
// @match        https://*.popmundo.com/Forum/Popmundo.aspx/Thread/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      www.popmundo.com
// @downloadURL https://update.greasyfork.org/scripts/553802/Atualizador%20de%20Ranking.user.js
// @updateURL https://update.greasyfork.org/scripts/553802/Atualizador%20de%20Ranking.meta.js
// ==/UserScript==

(function() {
'use strict';

const SOCIAL_CLUB_URL = 'https://www.popmundo.com/World/Popmundo.aspx/SocialClub/GenreRanking/6582';

// --- Injeção do Font Awesome ---
const faLink = document.createElement('link');
faLink.rel = 'stylesheet';
faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
document.head.appendChild(faLink);

// ================================================================================= //
// FUNÇÃO DE DETECÇÃO DE GÊNERO
// ================================================================================= //

function detectGenre() {
    const header = document.querySelector('#ctl00_cphLeftColumn_ctl00_hdrMain');
    if (!header) return null;

    const headerText = header.innerText;
    const match = headerText.match(/\[Ranking\]\s+(.+?)\s+\(/i);

    if (match && match[1]) {
        return match[1].trim().replace(/\s*-\s*BR\/PT\s*/i, '');
    }
    return null;
}

// ================================================================================= //
// INTERFACE DO USUÁRIO
// ================================================================================= //

function createUI() {
    const currentGenre = detectGenre();
    if (!currentGenre) {
        console.log("Script de Ranking: Nenhum gênero de ranking detectado no título deste tópico.");
        return;
    }

    const container = document.createElement('div');
    container.id = 'ranking-updater-container';

    // HTML da interface reformulada
    container.innerHTML = `
        <div class="panel-header">
            <h2><i class="fa-solid fa-ranking-star"></i>Atualizador de Ranking</h2>
        </div>

        <div class="genre-info">
            <label><i class="fa-solid fa-music"></i>Gênero detectado</label>
            <div class="genre-display">${currentGenre}</div>
        </div>

        <div class="action-section">
            <button type="button" id="generate-ranking-btn">
                <i class="fa-solid fa-rotate"></i>ATUALIZAR RANKING DE ${currentGenre.toUpperCase()}
            </button>
            <div id="status-feedback" class="status-message"></div>
        </div>

        <div class="tab-container">
            <button type="button" class="tab-link active" data-tab="bbcode">
                <i class="fa-solid fa-code"></i>BBCode
            </button>
            <button type="button" class="tab-link" data-tab="preview">
                <i class="fa-solid fa-eye"></i>Pré-visualização
            </button>
        </div>

        <div class="content-container">
            <div id="bbcode-content" class="tab-content active">
                <textarea id="ranking-output-textarea"
                    readonly
                    placeholder="Clique no botão para gerar o ranking de ${currentGenre}...">
                </textarea>
            </div>
            <div id="preview-content" class="tab-content">
                <div id="ranking-preview-div">
                    <em>A pré-visualização aparecerá aqui...</em>
                </div>
            </div>
        </div>
    `;

    const mainContent = document.getElementById('ppm-content');
    if (mainContent) {
        mainContent.insertBefore(container, mainContent.firstChild);
    }

    // Event Listeners
    document.getElementById('generate-ranking-btn').addEventListener('click', () => generateRanking(currentGenre));

    const textarea = document.getElementById('ranking-output-textarea');
    textarea.addEventListener('click', () => textarea.select());

    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab-link, .tab-content').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
        });
    });

    // ================================================================================= //
    // CSS ESTILO GERENCIADOR DE TURNÊS
    // ================================================================================= //
    GM_addStyle(`
        /* Container Principal */
        #ranking-updater-container {
            background-color: #f0f0f0;
            border: 1px solid #dcdcdc;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            font-family: Arial, sans-serif;
            font-size: 13px;
        }

        /* Header do Painel */
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #dcdcdc;
        }

        .panel-header h2 {
            margin: 0;
            font-size: 16px;
            color: #333;
            font-weight: bold;
            display: flex;
            align-items: center;
        }

        .panel-header i {
            margin-right: 8px;
            color: #555;
        }

        /* Informação do Gênero */
        .genre-info {
            background: #fafafa;
            border: 1px dashed #ccc;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 15px;
        }

        .genre-info label {
            display: flex;
            align-items: center;
            font-weight: bold;
            font-size: 11px;
            color: #555;
            margin-bottom: 6px;
        }

        .genre-info i {
            margin-right: 6px;
            font-size: 12px;
        }

        .genre-display {
            font-size: 14px;
            font-weight: bold;
            color: #0056b3;
            padding: 5px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }

        /* Seção de Ação */
        .action-section {
            margin-bottom: 15px;
        }

        /* Botão Principal */
        #generate-ranking-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #555;
            border-radius: 4px;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            background: linear-gradient(to bottom, #f7f7f7, #e3e3e3);
            color: #333;
            text-shadow: 1px 1px 1px #fff;
        }

        #generate-ranking-btn:hover:not(:disabled) {
            background: linear-gradient(to bottom, #e3e3e3, #d1d1d1);
            border-color: #333;
        }

        #generate-ranking-btn:disabled {
            background: #e9ecef !important;
            border-color: #ccc !important;
            color: #999 !important;
            cursor: not-allowed;
            opacity: 0.7;
        }

        #generate-ranking-btn i {
            margin-right: 8px;
        }

        /* Status Feedback */
        .status-message {
            padding: 8px;
            border-radius: 4px;
            text-align: center;
            font-weight: bold;
            font-size: 12px;
            margin-top: 10px;
            display: none;
        }

        .status-loading {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }

        .status-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .status-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        /* Tabs */
        .tab-container {
            display: flex;
            border-bottom: 2px solid #e0e0e0;
            margin-bottom: 0;
            background: #fafafa;
            border-radius: 4px 4px 0 0;
        }

        .tab-link {
            background: transparent;
            border: none;
            padding: 10px 15px;
            cursor: pointer;
            font-weight: normal;
            color: #666;
            border-bottom: 2px solid transparent;
            margin-right: 5px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            font-size: 12px;
        }

        .tab-link i {
            margin-right: 6px;
            font-size: 12px;
        }

        .tab-link.active {
            font-weight: bold;
            color: #0056b3;
            border-bottom: 2px solid #0056b3;
            background-color: #fff;
        }

        .tab-link:hover:not(.active) {
            background-color: #f0f0f0;
            color: #333;
        }

        /* Conteúdo das Tabs */
        .content-container {
            background: #fff;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 4px 4px;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        /* Textarea */
        #ranking-output-textarea {
            width: 100%;
            min-height: 300px;
            padding: 15px;
            box-sizing: border-box;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            border: none;
            resize: vertical;
            background: #fcfcfc;
        }

        #ranking-output-textarea:focus {
            outline: none;
            background: #fff;
        }

        /* Preview */
        #ranking-preview-div {
            width: 100%;
            min-height: 300px;
            max-height: 500px;
            overflow-y: auto;
            padding: 15px;
            box-sizing: border-box;
            background: #fff;
            font-size: 13px;
            line-height: 1.6;
        }

        #ranking-preview-div .quote {
            border-left: 4px solid #0056b3;
            background-color: #f7faff;
            padding: 12px 15px;
            margin: 15px 0;
            font-style: italic;
            color: #555;
            border-radius: 0 4px 4px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        #ranking-preview-div a {
            color: #0056b3;
            text-decoration: none;
            font-weight: 500;
        }

        #ranking-preview-div a:hover {
            text-decoration: underline;
        }

        #ranking-preview-div strong {
            color: #333;
            font-weight: bold;
        }

        #ranking-preview-div u {
            text-decoration: underline;
        }

        /* Animação de loading */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .fa-spin {
            animation: spin 1s linear infinite;
        }
    `);
}

// ================================================================================= //
// LÓGICA DE PARSING E GERAÇÃO
// ================================================================================= //

function parseOldRanking() {
    try {
        const rankingPosts = Array.from(document.querySelectorAll('.talkbox-content')).filter(content =>
            (content.innerText.toLowerCase().includes('ranking') || content.innerText.toLowerCase().includes('ranqueamento')) && content.querySelector('a[href*="/Artist/"]')
        );
        if (rankingPosts.length === 0) {
            console.log("Script de Ranking: Nenhum post de ranking anterior encontrado. Usando base vazia.");
            return new Map();
        }
        const lastPost = rankingPosts[rankingPosts.length - 1];
        const lines = lastPost.innerHTML.split(/<br\s*\/?>/).map(line => line.trim()).filter(Boolean);
        const rankingData = new Map();
        const lineRegex = /<strong>(\d+)<\/strong>.*#(\d+)\s*<a href="[^"]*\/Artist\/(\d+)"[^>]*>([^<]+)<\/a>/;

        lines.forEach(line => {
            const match = line.match(lineRegex);
            if (match) {
                const [, localRank, globalRank, artistId, name] = match;
                rankingData.set(artistId, {
                    localRank: parseInt(localRank, 10),
                    globalRank: parseInt(globalRank, 10),
                    name: name.trim(),
                    artistId: artistId
                });
            }
        });

        if (rankingData.size === 0) {
            console.warn(`Post de ranking encontrado, mas não foi possível extrair dados. Usando base vazia.`);
            return new Map();
        }
        return rankingData;
    } catch (error) {
        console.error(`Erro ao parsear ranking antigo:`, error);
        return null;
    }
}

function parseNewRanking(htmlString, genreName) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const headers = Array.from(doc.querySelectorAll('h2'));
        const genreHeader = headers.find(h => h.innerText.trim().toLowerCase() === genreName.toLowerCase());

        if (!genreHeader) { return null; }

        let table = genreHeader.nextElementSibling;
        if (table && table.tagName !== 'TABLE') {
            table = table.querySelector('table');
        }

        if (!table) { return null; }

        const rows = table.querySelectorAll('tbody tr');
        const rankingData = [];
        const idRegex = /Artist\/(\d+)/;

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const artistLink = cells.length > 2 ? cells[2].querySelector('a') : null;

            if (cells.length >= 3 && artistLink) {
                const url = artistLink.getAttribute('href');
                const idMatch = url.match(idRegex);

                if (idMatch) {
                    rankingData.push({
                        localRank: parseInt(cells[0].innerText.trim(), 10),
                        globalRank: parseInt(cells[1].innerText.trim(), 10),
                        name: artistLink.innerText.trim(),
                        artistId: idMatch[1]
                    });
                }
            }
        });
        return rankingData;
    } catch (error) {
        console.error(`Erro ao parsear novo ranking:`, error);
        return null;
    }
}

function formatChange(change) {
    if (change > 0) return `(+${change})`;
    if (change < 0) return `(${change})`;
    return '(=)';
}

function generateRankingText(newData, oldData, genreName) {
    const d = new Date();
    const formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    const oldIds = new Set(oldData.keys());
    const newIds = new Set(newData.map(a => a.artistId));
    const dropouts = [...oldData.values()].filter(artist => !newIds.has(artist.artistId));
    const entrants = newData.filter(artist => !oldIds.has(artist.artistId));
    let maxRise = { change: -Infinity, artists: [] };
    let maxFall = { change: Infinity, artists: [] };

    let rankingLines = newData.map(newArtist => {
        const oldArtist = oldData.get(newArtist.artistId);
        let localRankChangeDisplay, globalRankChangeDisplay;
        if (oldArtist) {
            const localChange = oldArtist.localRank - newArtist.localRank;
            const globalChange = oldArtist.globalRank - newArtist.globalRank;
            localRankChangeDisplay = formatChange(localChange);
            globalRankChangeDisplay = formatChange(globalChange);

            if (globalChange > 0 && globalChange >= maxRise.change) {
                if (globalChange > maxRise.change) {
                    maxRise = { change: globalChange, artists: [newArtist] };
                } else {
                    maxRise.artists.push(newArtist);
                }
            }
            if (globalChange < 0 && globalChange <= maxFall.change) {
                if (globalChange < maxFall.change) {
                    maxFall = { change: globalChange, artists: [newArtist] };
                } else {
                    maxFall.artists.push(newArtist);
                }
            }
        } else {
            localRankChangeDisplay = '(=)';
            globalRankChangeDisplay = '(=)';
        }

        const localRankStr = `[b]${String(newArtist.localRank).padStart(2, '0')}[/b]`;
        const artistTag = `[artistid=${newArtist.artistId} name=${newArtist.name}]`;
        let extraBreak = (newArtist.localRank % 10 === 0 && newData.length > newArtist.localRank && newData.length > 10) ? '[br]' : '';

        return `${localRankStr} ${localRankChangeDisplay} #${newArtist.globalRank} ${artistTag} ${globalRankChangeDisplay}${extraBreak}`;
    });

    let output = `[quote]Para fazer parte do ranking, um dos integrantes deve solicitar sua inscrição no nosso [tribeid=6582 name=clube social]. Se você estiver no clube e sua banda/gangue não aparecer aqui, por favor, avise no tópico.[/quote][br]`;
    output += `[u][b]Ranking de ${genreName} - BR/PT[/b][/u][br]`;
    output += `Atualizado em ${formattedDate}[br][br]`;
    output += rankingLines.join('[br]') + '[br][br]';

    output += `[b]Maior subida:[/b][br]`;
    output += maxRise.artists.length > 0 && maxRise.change > 0 ?
        maxRise.artists.map(a => `[artistid=${a.artistId} name=${a.name}] (+${maxRise.change})`).join('[br]') + '[br]' :
        '-[br]';

    output += `[br][b]Maior queda:[/b][br]`;
    output += maxFall.artists.length > 0 && maxFall.change < 0 ?
        maxFall.artists.map(a => `[artistid=${a.artistId} name=${a.name}] (${maxFall.change})`).join('[br]') + '[br]' :
        '-[br]';

    output += `[br][b]Entrando na atualização:[/b][br]`;
    output += entrants.length > 0 ?
        entrants.map(a => `[artistid=${a.artistId} name=${a.name}]`).join(', ') + '[br]' :
        '-[br]';

    output += `[br][b]Fora da atualização:[/b][br]`;
    output += dropouts.length > 0 ?
        dropouts.map(a => `[artistid=${a.artistId} name=${a.name}]`).join(', ') :
        '-';

    return output;
}

function parseBBCodeToHTML(bbcode) {
    return bbcode
        .replace(/\[quote\]([\s\S]*?)\[\/quote\]/g, '<blockquote class="quote">$1</blockquote>')
        .replace(/\[b\]([\s\S]*?)\[\/b\]/g, '<strong>$1</strong>')
        .replace(/\[u\]([\s\S]*?)\[\/u\]/g, '<u>$1</u>')
        .replace(/\[br\]/g, '<br>')
        .replace(/\[artistid=(\d+) name=([^\]]+)\]/g, '<a href="/World/Popmundo.aspx/Artist/$1" target="_blank">$2</a>')
        .replace(/\[tribeid=(\d+) name=([^\]]+)\]/g, '<a href="/World/Popmundo.aspx/SocialClub/$1" target="_blank">$2</a>');
}

// ================================================================================= //
// EXECUÇÃO PRINCIPAL E FEEDBACK
// ================================================================================= //

function generateRanking(genreName) {
    const button = document.getElementById('generate-ranking-btn');
    const textarea = document.getElementById('ranking-output-textarea');
    const previewDiv = document.getElementById('ranking-preview-div');
    const statusFeedback = document.getElementById('status-feedback');

    // Estado de Carregamento Inicial
    button.disabled = true;
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>GERANDO RANKING...`;

    statusFeedback.className = 'status-message status-loading';
    statusFeedback.style.display = 'block';
    statusFeedback.innerText = '1/3: Buscando e parseando o ranking antigo...';

    textarea.value = '';
    previewDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Carregando...';

    const oldRankingData = parseOldRanking(genreName);
    if (oldRankingData === null) {
        statusFeedback.className = 'status-message status-error';
        statusFeedback.innerText = 'Erro ao parsear dados antigos. Verifique o formato do último post.';
        resetButton(genreName, 5000);
        return;
    }

    statusFeedback.innerText = '2/3: Conectando-se ao Clube Social para obter dados novos...';

    GM_xmlhttpRequest({
        method: 'GET',
        url: SOCIAL_CLUB_URL,
        onload: function(response) {
            if (response.status !== 200) {
                statusFeedback.className = 'status-message status-error';
                statusFeedback.innerText = `Erro ao buscar dados do clube social. Status: ${response.status}`;
                resetButton(genreName, 5000);
                return;
            }

            statusFeedback.innerText = '3/3: Dados novos recebidos. Analisando e formatando...';

            const newRankingData = parseNewRanking(response.responseText, genreName);
            if (!newRankingData || newRankingData.length === 0) {
                statusFeedback.className = 'status-message status-error';
                statusFeedback.innerText = `Erro: Gênero "${genreName}" não encontrado ou lista vazia.`;
                resetButton(genreName, 5000);
                return;
            }

            const resultText = generateRankingText(newRankingData, oldRankingData, genreName);
            const resultHTML = parseBBCodeToHTML(resultText);

            textarea.value = resultText;
            previewDiv.innerHTML = resultHTML;
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight + 5) + 'px';

            document.querySelector('.tab-link[data-tab="preview"]').click();

            // Estado de Sucesso
            statusFeedback.className = 'status-message status-success';
            statusFeedback.innerText = '✓ RANKING ATUALIZADO COM SUCESSO! (O BBCode está pronto na aba ao lado.)';
            button.innerHTML = `<i class="fa-solid fa-check"></i>SUCESSO!`;

            resetButton(genreName, 5000);
        },
        onerror: function() {
            statusFeedback.className = 'status-message status-error';
            statusFeedback.innerText = 'Erro de rede ao tentar acessar o clube social.';
            resetButton(genreName, 5000);
        }
    });
}

function resetButton(genreName, delay = 0) {
    const button = document.getElementById('generate-ranking-btn');
    const statusFeedback = document.getElementById('status-feedback');

    setTimeout(() => {
        if (button) {
            button.disabled = false;
            button.innerHTML = `<i class="fa-solid fa-rotate"></i>ATUALIZAR RANKING DE ${genreName.toUpperCase()}`;
        }
        if (statusFeedback && statusFeedback.className.includes('status-success')) {
            setTimeout(() => {
                statusFeedback.style.display = 'none';
            }, 3000);
        }
    }, delay);
}

window.addEventListener('load', createUI);

})();
