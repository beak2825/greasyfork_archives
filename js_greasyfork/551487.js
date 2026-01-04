// ==UserScript==
// @name         Hive: PowerUP
// @namespace    http://tampermonkey.net/
// @version      1.5.4
// @description  Kit de ferramentas All-in-One para Hive com módulos para Hive-Engine, PeakD, InLeo e mais.
// @author       Você
// @match        https://hive-engine.com/*
// @match        https://he.dtools.dev/*
// @match        https://peakd.com/*
// @match        https://inleo.io/*
// @match        *://*.hive.pizza/uni*/game.php*
// @match        *://moon.hive.pizza/*
// @match        https://exain.co.in/*
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab
// @connect      api.steemit.com
// @connect      api.justyy.com
// @connect      rpc.blurt.world
// @connect      api.blurt.blog
// @connect      blurt-rpc.saboin.com
// @connect      blurtrpc.actifit.io
// @connect      techcoderx.com
// @connect      he.dtools.dev
// @connect      api.hive-engine.com
// @downloadURL https://update.greasyfork.org/scripts/551487/Hive%3A%20PowerUP.user.js
// @updateURL https://update.greasyfork.org/scripts/551487/Hive%3A%20PowerUP.meta.js
// ==/UserScript==

/*
-=[ CHANGELOG ]=-
Version 1.5.4 (Teste):
- TIMERS: Intervalo do Word Counter ajustado para 2 segundos.
- TIMERS: Intervalos do Módulo EXAIN (Histórico e HUDs) ajustados para 3 segundos.
- UX: No HUD do EXAIN, o texto "Sem dados" agora é um link para o Faucet.

Version 1.5.3 (Teste):
- OTIMIZAÇÃO: Loops padronizados (versão anterior tinha 10s).
- AJUSTE TEXTO HUD.

Version 1.5.1 (Teste):
- REMOVIDO: Módulo CryptoCompany HSBI Generator.
- ADICIONADO: Suporte para HUD em moon.hive.pizza.

Version 1.5.0 (Estável):
- Declarada estável.
*/

(function() {
    'use strict';

    // ====================================================================================
    // --- MÓDULO DE PAINEL DE CONTROLE VISUAL ---
    // ====================================================================================
    function setupVisualSettingsPanel(settingsDefs) {
        const config = {};
        settingsDefs.forEach(setting => {
            config[setting.key] = GM_getValue(setting.key, setting.defaultValue);
        });

        function createSettingsPanel() {
            if (document.getElementById('power-up-settings-panel')) return;
            const overlay = document.createElement('div');
            overlay.id = 'power-up-settings-overlay';
            const panel = document.createElement('div');
            panel.id = 'power-up-settings-panel';
            let settingsHTML = '';
            settingsDefs.forEach(setting => {
                settingsHTML += `
                    <div class="setting-row">
                        <input type="checkbox" id="setting-${setting.key}" style="cursor: pointer;">
                        <label for="setting-${setting.key}" style="cursor: pointer;">${setting.label}</label>
                    </div>
                `;
            });
            panel.innerHTML = `
                <h3>Configurações do PowerUP</h3>
                ${settingsHTML}
                <button id="power-up-save-btn">Salvar e Recarregar</button>
            `;
            document.body.appendChild(overlay);
            document.body.appendChild(panel);
            const closePanel = () => {
                overlay.style.display = 'none';
                panel.style.display = 'none';
            };
            overlay.addEventListener('click', closePanel);
            panel.querySelector('#power-up-save-btn').addEventListener('click', () => {
                settingsDefs.forEach(setting => {
                    const isEnabled = panel.querySelector(`#setting-${setting.key}`).checked;
                    GM_setValue(setting.key, isEnabled);
                });
                alert('Configurações salvas! A página será recarregada para aplicar as alterações.');
                window.location.reload();
            });
        }

        function openSettingsPanel() {
            if (!document.getElementById('power-up-settings-panel')) createSettingsPanel();
            settingsDefs.forEach(setting => {
                document.querySelector(`#setting-${setting.key}`).checked = GM_getValue(setting.key, setting.defaultValue);
            });
            document.querySelector('#power-up-settings-overlay').style.display = 'block';
            document.querySelector('#power-up-settings-panel').style.display = 'block';
        }

        function addVersionIndicator() {
              const version = GM_info.script.version;
              const name = GM_info.script.name;
              const identifierId = 'power-up-version-indicator';
              if (document.getElementById(identifierId)) return;
              const versionDiv = document.createElement('div');
              versionDiv.id = identifierId;
              versionDiv.title = 'Abrir Configurações do Script';
              versionDiv.textContent = `${name} v${version} ⚙️`;
              versionDiv.addEventListener('click', openSettingsPanel);
              document.body.appendChild(versionDiv);
        }

        GM_addStyle(`
            #power-up-settings-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0,0,0,0.6); z-index: 9998; display: none; }
            #power-up-settings-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 8px; padding: 20px; z-index: 9999; display: none; min-width: 500px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-family: sans-serif; }
            #power-up-settings-panel h3 { margin-top: 0; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #333; }
            #power-up-settings-panel .setting-row { display: flex; align-items: center; margin: 15px 0; }
            #power-up-settings-panel input[type="checkbox"] { width: 20px; height: 20px; margin-right: 15px; flex-shrink: 0; cursor: pointer; }
            #power-up-settings-panel label { font-size: 14px; color: #444; cursor: pointer; }
            #power-up-settings-panel button { display: block; width: 100%; padding: 10px; background-color: #d92626; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-top: 10px; }
            #power-up-settings-panel button:hover { background-color: #b00f0f; }
            #power-up-version-indicator { position: fixed; bottom: 25px; right: 5px; background: rgba(217, 38, 38, 0.85); color: white; padding: 2px 8px; font-size: 10px; border-radius: 3px; z-index: 9990; cursor: pointer; font-weight: bold; }
            #power-up-version-indicator:hover { background: #b00f0f; }
        `);

        addVersionIndicator();
        return config;
    }

    // ====================================================================================
    // --- CONFIGURAÇÃO E EXECUÇÃO PRINCIPAL ---
    // ====================================================================================

    const toolkitSettings = [
        { key: 'enableRichlistEnhancer', label: '<b>Hive-Engine RichList:</b> Remove a paginação, exibe todos os holders e formata os números para o padrão BR.', defaultValue: true },
        { key: 'enablePeakdActivity', label: '<b>Peakd Cross-Activity:</b> Mostra a atividade recente de usuários no Steemit/Blurt diretamente em perfis do PeakD.', defaultValue: true },
        { key: 'enablePeakdKeRatio', label: '<b>Peakd KE-Ratio Viewer:</b> Exibe o KE-Ratio (eficiência de ganhos) ao lado da reputação dos usuários no PeakD.', defaultValue: true },
        { key: 'enableWordCounter', label: '<b>Peakd & InLEO - Contador de palavras:</b> Exibe um contador de palavras em tempo real nos editores.', defaultValue: true },
        { key: 'enableExainFaucetTimer', label: '<b>EXAIN Faucet Timer:</b> Exibe contador de claims/tempo no HUD e redireciona do faucet para o histórico após claim.', defaultValue: true },
    ];

    const config = setupVisualSettingsPanel(toolkitSettings);

    (function createUnifiedHud() {
        if (document.getElementById('power-up-unified-hud')) return;
        const hud = document.createElement('div');
        hud.id = 'power-up-unified-hud';
        GM_addStyle(`
            #power-up-unified-hud {
                position: fixed; bottom: 10px; left: 10px; z-index: 999999;
                background: rgba(0,0,0,0.85); color: #0f0; font-family: monospace;
                font-size: 12px;
                padding: 6px 10px;
                border-radius: 6px;
                box-shadow: 0 0 6px rgba(0,0,0,0.5); display: none;
                flex-direction: column; align-items: flex-start;
            }
            .power-up-hud-line { white-space: pre; }
            #power-up-unified-hud a { color: inherit !important; text-decoration: underline !important; }
            #power-up-unified-hud a:hover { text-decoration: none !important; }
        `);
        document.body.appendChild(hud);
    })();


    // ====================================================================================
    // --- EXECUÇÃO DOS MÓDULOS EM SANDBOX ---
    // ====================================================================================

    if (config.enableRichlistEnhancer && (window.location.hostname === 'hive-engine.com' || window.location.hostname === 'he.dtools.dev') && window.location.pathname.startsWith('/richlist/')) {
        (function() {
            'use strict';
            async function fetchAllHolders(symbol) {
                const allHolders = []; let offset = 0; const limit = 1000; let resultsInBatch;
                do {
                    const response = await fetch('https://api.hive-engine.com/rpc/contracts', {
                        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "find", params: { contract: "tokens", table: "balances", query: { symbol }, limit, offset, indexes: [] }})
                    });
                    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
                    const data = await response.json();
                    if (!data || !Array.isArray(data.result)) { throw new Error(`API Error: ${data?.error?.message || 'Unexpected format.'}`); }
                    resultsInBatch = data.result.length; allHolders.push(...data.result); offset += limit;
                } while (resultsInBatch === limit);
                return allHolders;
            }
            function formatBrNumber(numStr) { const num = parseFloat(String(numStr).replace(/,/g, '')); if (isNaN(num)) return numStr; return num.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 8 }); }
            async function main() {
                const table = document.getElementById('richlistTable'); if (!table) return;
                const tbody = table.querySelector('tbody');
                const displayError = (message) => { if (tbody) tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: red; padding: 20px;">${message}</td></tr>`; };
                try {
                    const symbol = window.location.pathname.split('/').pop().toUpperCase(); if (!symbol) throw new Error("Could not determine token symbol.");
                    if (tbody) tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px;">Carregando todos os dados... ⌛</td></tr>`;
                    const holders = await fetchAllHolders(symbol);
                    holders.forEach(h => { h.total = (parseFloat(h.balance) || 0) + (parseFloat(h.stake) || 0) + (parseFloat(h.pendingUnstake) || 0) + (parseFloat(h.delegationsIn) || 0) - (parseFloat(h.delegationsOut) || 0); });
                    holders.sort((a, b) => b.total - a.total);
                    if (tbody) {
                        tbody.innerHTML = ''; let rank = 0;
                        holders.forEach((holder) => {
                            if (holder.total <= 0) return; rank++; const tr = document.createElement('tr');
                            tr.innerHTML = `<td>${rank}</td><td><a href="https://hive.blog/@${holder.account}">${holder.account}</a></td><td>${formatBrNumber(holder.balance)}</td><td>${formatBrNumber(holder.stake)}</td><td>${formatBrNumber(holder.pendingUnstake)}</td><td>${formatBrNumber(holder.delegationsOut)}</td><td>${formatBrNumber(holder.delegationsIn)}</td><td>${formatBrNumber(holder.total.toString())}</td>`;
                            tbody.appendChild(tr);
                        });
                        table.setAttribute('aria-rowcount', rank.toString());
                    }
                    const pagination = document.querySelector('.pagination.b-pagination'); if (pagination) pagination.remove();
                } catch (error) { console.error('[PowerUP] Richlist Error:', error); displayError(`Falha ao carregar dados. ${error.message}`); }
            }
            const observer = new MutationObserver((mutations, obs) => { if (document.getElementById('richlistTable')) { obs.disconnect(); main(); } });
            observer.observe(document.body, { childList: true, subtree: true });
        })();
    }

    if (config.enablePeakdActivity && window.location.hostname === 'peakd.com') {
        (function() {
            'use strict';
             const LOOKBACK_DAYS = 30;
            const STEEM_NODES = ["https://api.steemit.com", "https://api.justyy.com"];
            const BLURT_NODES = ["https://rpc.blurt.world", "https://api.blurt.blog", "https://blurt-rpc.saboin.com", "https://blurtrpc.actifit.io"];
            const cache = new Map();
            const inflight = new Map();
            const usernameFromHref = href => (href.match(/\/@([\w\-.]+)/) || [])[1] || null;
            const toDateOrNull = dateStr => !dateStr || dateStr.startsWith("1970-01-01") ? null : new Date(dateStr.endsWith("Z") ? dateStr : dateStr + "Z");
            const maxDate = dates => dates.filter(Boolean).sort((a, b) => b - a)[0] || null;
            const daysAgo = date => Math.floor((Date.now() - date.getTime()) / 86400000);
            const within = date => date && (Date.now() - date.getTime()) <= 86400000 * LOOKBACK_DAYS;
            function rpcMulti(nodeUrl, method, params) {
                const payloads = [{ jsonrpc: "2.0", id: 1, method: method, params: params }, { jsonrpc: "2.0", id: 2, method: "call", params: ["condenser_api", "get_accounts", params] }];
                return new Promise((resolve, reject) => {
                    let payloadIndex = 0;
                    const tryNextPayload = () => {
                        if (payloadIndex >= payloads.length) return reject(new Error("all-payloads-failed"));
                        const payload = JSON.stringify(payloads[payloadIndex++]);
                        GM_xmlhttpRequest({
                            method: "POST", url: nodeUrl, headers: { "Content-Type": "application/json" }, data: payload, timeout: 12000,
                            onload: response => { try { const json = JSON.parse(response.responseText); if (json.error) return tryNextPayload(); resolve(json.result); } catch (e) { tryNextPayload(); } },
                            onerror: () => tryNextPayload(), ontimeout: () => tryNextPayload()
                        });
                    };
                    tryNextPayload();
                });
            }
            async function getAccount(nodes, username) {
                let lastError;
                for (const node of nodes) {
                    try {
                        const result = await rpcMulti(node, "condenser_api.get_accounts", [[username]]);
                        if (Array.isArray(result) && result[0]) return { account: result[0], node: node };
                    } catch (error) { lastError = error; }
                }
                throw lastError || new Error("All nodes failed");
            }
            async function check(chain, nodes, username) {
                const cacheKey = `${chain}:${username}`;
                if (cache.has(cacheKey)) return cache.get(cacheKey);
                if (inflight.has(cacheKey)) return inflight.get(cacheKey);
                const promise = (async () => {
                    try {
                        const { account, node } = await getAccount(nodes, username);
                        const lastVote = toDateOrNull(account.last_vote_time); const lastPost = toDateOrNull(account.last_post); const lastRootPost = toDateOrNull(account.last_root_post);
                        const lastActivity = maxDate([lastVote, lastPost, lastRootPost]); const active = within(lastActivity);
                        const sourceField = lastActivity && lastVote && +lastActivity === +lastVote ? "last_vote_time" : lastActivity && lastPost && +lastActivity === +lastPost ? "last_post" : lastActivity && lastRootPost && +lastActivity === +lastRootPost ? "last_root_post" : null;
                        const result = { active: active, last: lastActivity, sourceField: sourceField, node: node, error: false };
                        cache.set(cacheKey, result); return result;
                    } catch (error) {
                        const result = { active: false, last: null, sourceField: null, node: null, error: true };
                        cache.set(cacheKey, result); return result;
                    } finally { inflight.delete(cacheKey); }
                })();
                inflight.set(cacheKey, promise); return promise;
            }
            const tip = document.createElement("div");
            Object.assign(tip.style, { position: "fixed", zIndex: 99999, maxWidth: "420px", padding: "10px 12px", borderRadius: "10px", background: "rgba(20,22,25,0.96)", color: "#e8e8e8", fontSize: "12px", lineHeight: "1.35", boxShadow: "0 8px 24px rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)", pointerEvents: "none", display: "none", whiteSpace: "pre-line" });
            document.body.appendChild(tip);
            const showTip = (html, clientX, clientY) => { tip.innerHTML = html; tip.style.left = Math.min(clientX + 12, window.innerWidth - 440) + "px"; tip.style.top = Math.min(clientY + 12, window.innerHeight - 20) + "px"; tip.style.display = "block"; };
            const hideTip = () => { tip.style.display = "none"; };
            function makeBadge(text, isActive, chain) {
                const badge = document.createElement("span"); badge.textContent = `${text}: ${isActive ? "ACTIVE" : "NO"}`;
                Object.assign(badge.style, { display: "inline-flex", alignItems: "center", padding: "3px 8px", fontSize: "90%", fontWeight: "600", color: "#fff", borderRadius: "999px", marginLeft: "6px", lineHeight: "1.3", letterSpacing: ".2px", background: isActive ? (chain === "STEEM" ? "linear-gradient(135deg,#4CAF50,#2E7D32)" : "linear-gradient(135deg,#3f7fbf,#274b7c)") : "linear-gradient(135deg,#666,#444)", transition: "filter .2s" });
                badge.addEventListener("mouseenter", () => badge.style.filter = "brightness(1.15)"); badge.addEventListener("mouseleave", () => badge.style.filter = "none"); return badge;
            }
            function ensureContainer(repLabel) {
                let container = repLabel.parentElement.querySelector(".xchain-activity-badges");
                if (!container) { container = document.createElement("span"); container.className = "xchain-activity-badges"; container.style.display = "inline-flex"; container.style.alignItems = "center"; container.style.marginLeft = "6px"; repLabel.parentElement.appendChild(container); }
                return container;
            }
            async function processLink(link) {
                const username = usernameFromHref(link.getAttribute("href")); if (!username) return;
                const repLabel = link.parentElement?.querySelector(".reputation-label"); if (!repLabel || repLabel.parentElement.querySelector(".xchain-activity-badges")) return;
                const container = ensureContainer(repLabel); const statusSpan = document.createElement("span"); statusSpan.textContent = "checking…"; statusSpan.style.opacity = "0.6"; statusSpan.style.fontSize = "90%"; statusSpan.style.marginLeft = "6px"; container.appendChild(statusSpan);
                const [steem, blurt] = await Promise.all([check("STEEM", STEEM_NODES, username), check("BLURT", BLURT_NODES, username)]); statusSpan.remove();
                const steemBadge = makeBadge("STEEM", !!steem.active, "STEEM");
                steemBadge.addEventListener("mouseenter", e => { const tipText = steem.error ? "<b>STEEM</b>\nFetch failed." : steem.last ? `<b>STEEM</b>\nLast: ${steem.last.toISOString().slice(0, 19).replace("T", " ")} UTC\nRelative: ${daysAgo(steem.last)} days ago\nField: ${steem.sourceField}\nNode: ${steem.node}` : "<b>STEEM</b>\nNo activity found."; showTip(tipText, e.clientX, e.clientY); });
                steemBadge.addEventListener("mousemove", e => showTip(tip.innerHTML, e.clientX, e.clientY)); steemBadge.addEventListener("mouseleave", hideTip);
                const blurtBadge = makeBadge("BLURT", !!blurt.active, "BLURT");
                blurtBadge.addEventListener("mouseenter", e => { const tipText = blurt.error ? "<b>BLURT</b>\nFetch failed." : blurt.last ? `<b>BLURT</b>\nLast: ${blurt.last.toISOString().slice(0, 19).replace("T", " ")} UTC\nRelative: ${daysAgo(blurt.last)} days ago\nField: ${blurt.sourceField}\nNode: ${blurt.node}` : "<b>BLURT</b>\nNo activity found."; showTip(tipText, e.clientX, e.clientY); });
                blurtBadge.addEventListener("mousemove", e => showTip(tip.innerHTML, e.clientX, e.clientY)); blurtBadge.addEventListener("mouseleave", hideTip);
                container.appendChild(steemBadge); container.appendChild(blurtBadge);
            }
            function processUsers() { document.querySelectorAll('a[href^="/@"]').forEach(processLink); }
            let raf = null; const observer = new MutationObserver(() => { if (!raf) { raf = requestAnimationFrame(() => { raf = null; processUsers(); }); } }); processUsers(); observer.observe(document.body, { childList: true, subtree: true });
        })();
    }

    if (config.enablePeakdKeRatio && window.location.hostname === 'peakd.com') {
        (function() {
            'use strict';
            const KE_CACHE = {};
            function getUsernameFromHref(href) { const match = href.match(/\/@([\w\-.]+)/); return match ? match[1] : null; }
            function calculateKERatio(data) {
                const authorRewards = parseFloat(data.posting_rewards) / 1000; const curationRewards = parseFloat(data.curation_rewards) / 1000; const hp = parseFloat(data.vesting_balance) / 1000;
                if (hp === 0) return null; return ((authorRewards + curationRewards) / hp).toFixed(2);
            }
            function fetchKE(username, callback) {
                if (KE_CACHE[username]) return callback(KE_CACHE[username]);
                GM_xmlhttpRequest({
                    method: "GET", url: `https://techcoderx.com/hafbe-api/accounts/${username}`,
                    onload: function(response) {
                        try { const data = JSON.parse(response.responseText); const ratio = calculateKERatio(data); KE_CACHE[username] = ratio; callback(ratio); } catch (e) { console.error("KE parse error", e); callback(null); }
                    },
                    onerror: function() { console.error("Failed to fetch KE data for", username); callback(null); }
                });
            }
            function insertKELabel(parent, ratio) {
                if (!ratio) return; const label = document.createElement("span"); label.textContent = `KE: ${ratio}`; label.classList.add("label"); label.title = "KE Ratio = (Author Rewards + Curation Rewards) / HP";
                label.style.cssText = "display: inline-block; padding: 4px 6px; font-size: 95%; font-weight: 500; color: #fff; background-color: #313437; border-radius: 0.25em; margin-left: 6px; line-height: 1; vertical-align: baseline; white-space: nowrap; text-align: center; text-transform: uppercase; letter-spacing: .1px;";
                parent.appendChild(label);
            }
            function processUsers() {
                const links = document.querySelectorAll('a[href^="/@"]');
                links.forEach(link => {
                    const username = getUsernameFromHref(link.getAttribute("href")); if (!username) return;
                    const repLabel = link.parentElement?.querySelector(".reputation-label"); if (!repLabel || repLabel.dataset.keInjected) return;
                    repLabel.dataset.keInjected = "true"; fetchKE(username, ratio => { insertKELabel(repLabel.parentElement, ratio); });
                });
            }
            processUsers(); const observer = new MutationObserver(() => { processUsers(); }); observer.observe(document.body, { childList: true, subtree: true });
        })();
    }

    if (config.enableWordCounter && (window.location.hostname === 'peakd.com' || window.location.hostname === 'inleo.io')) {
        (function() {
            'use strict';
            const siteConfig = {
                "inleo.io": {
                    editorSelector: 'div[data-slate-editor="true"]', textSourceSelector: 'div[data-slate-editor="true"]', updateMechanism: 'eventListener',
                    counterId: "realtime-word-counter-inleo", styles: { backgroundColor: "rgba(217, 161, 0, 0.85)", color: "#181818", border: "2px solid rgba(255, 255, 255, 0.5)" }
                },
                "peakd.com": {
                    editorSelector: "textarea.auto-textarea-input", textSourceSelector: "pre.auto-textarea-block", updateMechanism: 'mutationObserver',
                    counterId: "realtime-word-counter-peakd", styles: { backgroundColor: "rgba(33, 150, 243, 0.85)", color: "#FFFFFF", border: "2px solid rgba(255, 255, 255, 0.5)" }
                }
            };
            const currentConfig = siteConfig[window.location.hostname];
            if (!currentConfig) return;
            let setupInterval = null; let activeObserver = null; let eventListenerAttached = false;
            function createCounterElement() {
                let counter = document.getElementById(currentConfig.counterId); if (counter) counter.remove();
                counter = document.createElement("div"); counter.id = currentConfig.counterId;
                Object.assign(counter.style, {
                    position: "fixed", bottom: "25px", right: "25px", width: "80px", height: "80px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column",
                    fontSize: "22px", fontWeight: "bold", fontFamily: "sans-serif", zIndex: "2147483647", boxShadow: "0 4px 15px rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", webkitBackdropFilter: "blur(4px)", transition: "transform 0.2s ease-in-out"
                });
                Object.assign(counter.style, currentConfig.styles);
                counter.onmouseover = () => { counter.style.transform = "scale(1.05)"; }; counter.onmouseout = () => { counter.style.transform = "scale(1)"; };
                document.body.appendChild(counter); return counter;
            }
            function countWords(textSourceElement) {
                if (!textSourceElement) return 0; const text = textSourceElement.innerText;
                const cleanedText = text.replace(/(https?:\/\/[^\s]+)/g, "").replace(/<[^>]*>/g, "").replace(/!\[.*?\]\(.*?\)/g, "").replace(/\[.*?\]\(.*?\)/g, "").replace(/[#*-_`|>]+/g, "").replace(/\s+/g, " ").trim();
                return cleanedText === "" ? 0 : cleanedText.split(/\s+/).length;
            }
            function updateCounter(elementToCount) {
                const counterElement = document.getElementById(currentConfig.counterId); if (!counterElement || !elementToCount) return;
                const wordCount = countWords(elementToCount); counterElement.innerHTML = `${wordCount}<span style="font-size: 11px; font-weight: normal; margin-top: 2px;">palavras</span>`;
            }
            function setupWordCounter() {
                const editor = document.querySelector(currentConfig.editorSelector); const textSource = document.querySelector(currentConfig.textSourceSelector);
                if (editor && textSource) {
                    if (setupInterval) { clearInterval(setupInterval); setupInterval = null; }
                    if (!document.getElementById(currentConfig.counterId)) createCounterElement();
                    updateCounter(textSource);
                    if (currentConfig.updateMechanism === 'mutationObserver') {
                        if (activeObserver) activeObserver.disconnect();
                        activeObserver = new MutationObserver(() => updateCounter(textSource));
                        activeObserver.observe(textSource, { childList: true, characterData: true, subtree: true });
                        eventListenerAttached = false;
                    } else if (currentConfig.updateMechanism === 'eventListener') {
                        if (!eventListenerAttached) {
                            if (activeObserver) activeObserver.disconnect(); activeObserver = null;
                            editor.addEventListener('input', () => updateCounter(editor)); eventListenerAttached = true;
                        }
                    }
                } else {
                    if (activeObserver) { activeObserver.disconnect(); activeObserver = null; }
                    eventListenerAttached = false; const counterElement = document.getElementById(currentConfig.counterId); if (counterElement) counterElement.remove();
                    if (!setupInterval) { setupInterval = setInterval(setupWordCounter, 2000); /* MODIFICADO v1.5.4: Intervalo otimizado para 2s */ }
                }
            }
            setupInterval = setInterval(setupWordCounter, 2000); /* MODIFICADO v1.5.4: Intervalo otimizado para 2s */
        })();
    }

    // Lista global de Hosts onde o HUD deve aparecer
    const hudHosts = ['inleo.io', 'peakd.com', 'he.dtools.dev', 'moon.hive.pizza'];
    const isPizzaPage = window.location.hostname.endsWith('hive.pizza') && window.location.pathname.includes('/uni');
    const isExainFaucetPage = window.location.hostname === 'exain.co.in';
    const isExainHistoryPage = window.location.href.includes('he.dtools.dev/@crazyphantombr') && new URLSearchParams(window.location.search).get('symbol') === 'EXAIN';

    // Módulo EXAIN (HUD + Histórico + Redirecionamento)
    if (config.enableExainFaucetTimer && (isExainHistoryPage || hudHosts.includes(window.location.hostname) || isPizzaPage || isExainFaucetPage)) {
         (function() {
            'use strict';
            const STORAGE_KEY_EXAIN_DATA = 'exain_faucet_data';
            const EXAIN_HISTORY_URL = 'https://he.dtools.dev/@crazyphantombr?symbol=EXAIN';
            const EXAIN_FAUCET_URL = 'https://exain.co.in/';
            const MAX_CLAIMS = 4;

            function updateHUD(htmlContent) {
                const hudContainer = document.getElementById('power-up-unified-hud');
                if (!hudContainer) return;
                let exainLine = document.getElementById('power-up-hud-exain');
                if (!exainLine) {
                    exainLine = document.createElement('div'); exainLine.id = 'power-up-hud-exain'; exainLine.className = 'power-up-hud-line'; hudContainer.appendChild(exainLine);
                }
                exainLine.innerHTML = `EXAIN: ${htmlContent}`;
                hudContainer.style.display = 'flex';
            }

            async function saveData(data) { await GM_setValue(STORAGE_KEY_EXAIN_DATA, JSON.stringify(data)); }
            async function loadData() {
                const dataStr = await GM_getValue(STORAGE_KEY_EXAIN_DATA, null); if (!dataStr) return { nextClaimTs: 0, claimsToday: 0, lastCheckDate: '' };
                try { return JSON.parse(dataStr); } catch (e) { console.error("[PowerUP] Erro ao carregar dados EXAIN:", e); return { nextClaimTs: 0, claimsToday: 0, lastCheckDate: '' }; } }
            function getTodayUTC() { return new Date().toISOString().slice(0, 10); }
            function formatTime(timestamp) { if (!timestamp || timestamp <= 0) return 'Pronto!'; const date = new Date(timestamp); const hours = date.getHours().toString().padStart(2, '0'); const minutes = date.getMinutes().toString().padStart(2, '0'); return `${hours}h${minutes}`; }

             if (isExainHistoryPage) { // Lógica para a página de histórico
                 let lastCheckTime = 0; const CHECK_INTERVAL = 3000; // MODIFICADO v1.5.4: 3s
                 async function checkFaucetClaims() {
                     const now = Date.now(); if (now - lastCheckTime < CHECK_INTERVAL) return; lastCheckTime = now;
                     const historyCards = document.querySelectorAll('.history .card'); if (historyCards.length === 0) return;
                     const todayUTC = getTodayUTC(); let claimsToday = 0; let mostRecentTimestamp = 0;
                     historyCards.forEach(card => {
                         const fromLink = card.querySelector('a[href="/@exain-faucet"]'); const toLink = card.querySelector('a[href="/@crazyphantombr"]'); const memoElement = card.querySelector('code:last-of-type');
                         if (fromLink && toLink && memoElement && memoElement.textContent.includes('faucet drip')) {
                             const timeElement = card.querySelector('a.small[title]'); if (timeElement) { const title = timeElement.getAttribute('title'); if (title) { try { const transactionDate = new Date(title); if (!isNaN(transactionDate) && transactionDate.toISOString().slice(0, 10) === todayUTC) { claimsToday++; if (transactionDate.getTime() > mostRecentTimestamp) { mostRecentTimestamp = transactionDate.getTime(); } } } catch (e) { console.error("[PowerUP] Erro ao parsear data EXAIN:", title, e); } } } } });
                     claimsToday = Math.min(claimsToday, MAX_CLAIMS); let nextClaimTimestamp = 0; if (mostRecentTimestamp > 0) { nextClaimTimestamp = mostRecentTimestamp + (60 * 60 * 1000); }
                     const dataToSave = { nextClaimTs: nextClaimTimestamp, claimsToday: claimsToday, lastCheckDate: todayUTC }; await saveData(dataToSave); updateHUDFromData(dataToSave); }
                 function updateHUDFromData(data) {
                     const claimsHtml = `<a href="${EXAIN_HISTORY_URL}" target="_blank" title="Atualizar dados do histórico">${data.claimsToday}/${MAX_CLAIMS}</a>`; const remainingMs = data.nextClaimTs - Date.now(); const isToday = data.lastCheckDate === getTodayUTC();
                     if (isToday && data.claimsToday >= MAX_CLAIMS) { updateHUD(`${claimsHtml}`); } else if (!isToday) { updateHUD(`${claimsHtml} | <a href="${EXAIN_FAUCET_URL}" target="_blank" title="Ir para o Faucet"><small>Sem dados</small></a>`); /* MODIFICADO v1.5.4: Link adicionado */ } else if (remainingMs <= 0) { const readyHtml = `<a href="${EXAIN_FAUCET_URL}" target="_blank" title="Fazer o claim de EXAIN">Pronto!</a>`; const warning = !isToday ? ' <small>Sem dados</small>' : ''; updateHUD(`${claimsHtml} | ${readyHtml}${warning}`); } else { updateHUD(`${claimsHtml} | ${formatTime(data.nextClaimTs)}`); } }
                 const observer = new MutationObserver((mutations, obs) => { if (document.querySelector('.history .card')) { obs.disconnect(); checkFaucetClaims(); setInterval(checkFaucetClaims, CHECK_INTERVAL); } });
                 setTimeout(() => { if (document.querySelector('.history .card')) { checkFaucetClaims(); setInterval(checkFaucetClaims, CHECK_INTERVAL); } else { observer.observe(document.body, { childList: true, subtree: true }); } }, 500);

             } else if (isExainFaucetPage) { // Lógica para a página do Faucet
                (function() { // Bloco para o redirecionamento
                    'use strict';
                    const SUCCESS_MESSAGE = "Claim sent! Check your wallet soon.";
                    const REDIRECT_DELAY_MS = 10000;
                    let redirectTimer = null;
                    const observer = new MutationObserver(() => {
                        const successDiv = document.querySelector('div.text-l.text-success.my-4');
                        if (successDiv && successDiv.textContent.includes(SUCCESS_MESSAGE)) {
                            if (redirectTimer === null) {
                                updateHUD("Claim OK! Redirecionando...");
                                redirectTimer = setTimeout(() => { window.location.href = EXAIN_HISTORY_URL; }, REDIRECT_DELAY_MS);
                                if (observer) observer.disconnect();
                            }
                        } else { if (redirectTimer !== null) { clearTimeout(redirectTimer); redirectTimer = null; } }
                    });
                    setTimeout(() => { observer.observe(document.body, { childList: true, subtree: true, characterData: true }); }, 500);
                })();

                // Lógica do HUD (copiada da lógica "else" original, intervalo de 3000ms)
                 setInterval(async () => {
                     const successDiv = document.querySelector('div.text-l.text-success.my-4');
                     if (successDiv && successDiv.textContent.includes("Claim sent!")) { updateHUD("Claim OK! Redirecionando..."); return; }
                    const data = await loadData(); const todayUTC = getTodayUTC(); const isToday = data.lastCheckDate === todayUTC; const displayClaims = isToday ? data.claimsToday : 0;
                    const claimsHtml = `<a href="${EXAIN_HISTORY_URL}" target="_blank" title="Atualizar dados do histórico">${displayClaims}/${MAX_CLAIMS}</a>`; const remainingMs = isToday ? data.nextClaimTs - Date.now() : -1;
                    if (isToday && displayClaims >= MAX_CLAIMS) { updateHUD(`${claimsHtml}`); } else if (!isToday) { updateHUD(`${claimsHtml} | <a href="${EXAIN_FAUCET_URL}" target="_blank" title="Ir para o Faucet"><small>Sem dados</small></a>`); /* MODIFICADO v1.5.4 */ } else if (remainingMs <= 0) { const readyHtml = `<a href="${EXAIN_FAUCET_URL}" target="_blank" title="Fazer o claim de EXAIN">Pronto!</a>`; const warning = !isToday ? ' <small>Sem dados</small>' : ''; updateHUD(`${claimsHtml} | ${readyHtml}${warning}`); } else { updateHUD(`${claimsHtml} | ${formatTime(data.nextClaimTs)}`); }
                }, 3000); /* MODIFICADO v1.5.4: 3s */

             } else { // Lógica para as outras páginas
                 setInterval(async () => {
                    const data = await loadData(); const todayUTC = getTodayUTC(); const isToday = data.lastCheckDate === todayUTC; const displayClaims = isToday ? data.claimsToday : 0;
                    const claimsHtml = `<a href="${EXAIN_HISTORY_URL}" target="_blank" title="Atualizar dados do histórico">${displayClaims}/${MAX_CLAIMS}</a>`; const remainingMs = isToday ? data.nextClaimTs - Date.now() : -1;
                    if (isToday && displayClaims >= MAX_CLAIMS) { updateHUD(`${claimsHtml}`); } else if (!isToday) { updateHUD(`${claimsHtml} | <a href="${EXAIN_FAUCET_URL}" target="_blank" title="Ir para o Faucet"><small>Sem dados</small></a>`); /* MODIFICADO v1.5.4 */ } else if (remainingMs <= 0) { const readyHtml = `<a href="${EXAIN_FAUCET_URL}" target="_blank" title="Fazer o claim de EXAIN">Pronto!</a>`; const warning = !isToday ? ' <small>Sem dados</small>' : ''; updateHUD(`${claimsHtml} | ${readyHtml}${warning}`); } else { updateHUD(`${claimsHtml} | ${formatTime(data.nextClaimTs)}`); }
                }, 3000); /* MODIFICADO v1.5.4: 3s */
            }
        })();
    }
})();

