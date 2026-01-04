// ==UserScript==
// @name         SteamVerde: God Mode (Kalanos Ultimate v19.1 - Donate Highlight)
// @namespace    http://tampermonkey.net/
// @version      19.1
// @description  Carteiras Destacadas, IP com Ícone Mapa, Remove Modal "Poxa Vida", Bypass e Botão FitGirl
// @author       Kalanos
// @license      MIT
// @match        *://*/*
// @connect      ip-api.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560022/SteamVerde%3A%20God%20Mode%20%28Kalanos%20Ultimate%20v191%20-%20Donate%20Highlight%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560022/SteamVerde%3A%20God%20Mode%20%28Kalanos%20Ultimate%20v191%20-%20Donate%20Highlight%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================================================================
    // 0. VERIFICAÇÃO DE SEGURANÇA E CLOUDFLARE
    // ====================================================================
    const currentHost = window.location.hostname;
    const allowedHosts = ['steamverde.net', 'www.steamverde.net'];

    if (!allowedHosts.includes(currentHost)) return;

    if (document.title.includes("Just a moment") || document.title.includes("Cloudflare")) {
        console.log("⚠️ [Kalanos] Cloudflare detectado. Aguardando...");
        return;
    }

    console.log("%c✅ [Kalanos] STEAM VERDE DETECTADO", "color: #00ff00; font-weight: bold; font-size: 16px; background: #002200; padding: 4px;");

    // ====================================================================
    // 1. VACINA ANTI-ADBLOCK (ANTI-GATO)
    // ====================================================================
    const cssAntiGato = `
        [id^="sys-notify-"], div[id*="sys-notify"], #sys-notify,
        .fc-ab-root, .wp-dark-mode-ignore, #adblock-notice, .ads-blocker-image {
            display: none !important; visibility: hidden !important; opacity: 0 !important;
            pointer-events: none !important; z-index: -99999 !important; width: 0 !important; height: 0 !important;
        }
        body, html { overflow: auto !important; position: static !important; filter: none !important; }
        .modal-backdrop, .blocker-overlay { display: none !important; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = cssAntiGato;
    (document.head || document.documentElement).appendChild(styleSheet);

    try {
        Object.defineProperty(window, 'timeLeft', { get: function() { return 0; }, set: function(v) { }, configurable: true });
    } catch (e) {}

    const observerAntiGato = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.id && node.id.startsWith('sys-notify-')) {
                    node.remove();
                }
            });
        });
    });
    observerAntiGato.observe(document.documentElement, { childList: true, subtree: true });

    // ====================================================================
    // 2. INJEÇÃO NUCLEAR (BYPASS)
    // ====================================================================

    function payloadBypass() {
        console.log("💉 [Kalanos] Injetando Bypass...");
        const originalSetInterval = window.setInterval;
        const originalSetTimeout = window.setTimeout;
        const TEMPO_BYPASS = 10;
        const TEMPO_CARROSSEL = 5000;

        window.setInterval = function(callback, delay, ...args) {
            if (typeof delay === 'number' && delay >= 900 && delay <= 1500) {
                window.dispatchEvent(new CustomEvent('kalanos_bypass_activated'));
                return originalSetInterval(callback, TEMPO_BYPASS, ...args);
            }
            if (typeof delay === 'number' && delay > 1500 && delay < 9000) {
                return originalSetInterval(callback, TEMPO_CARROSSEL, ...args);
            }
            return originalSetInterval(callback, delay, ...args);
        };

        window.setTimeout = function(callback, delay, ...args) {
            if (typeof delay === 'number' && delay >= 900 && delay <= 1500) {
                return originalSetTimeout(callback, TEMPO_BYPASS, ...args);
            }
            return originalSetTimeout(callback, delay, ...args);
        };
    }

    const script = document.createElement('script');
    script.textContent = '(' + payloadBypass.toString() + ')();';
    (document.head || document.documentElement).appendChild(script);
    script.remove();

    // ====================================================================
    // 3. UI, MAPS E SKIN FITGIRL
    // ====================================================================

    const VERSION = "v19.1 (Donate Highlight)";
    const TEMPO_AUTO_CLOSE = 1200;
    const TEMPO_REFRESH_IP = 10000;
    let modalJaExibido = false;
    let ultimoCliqueUsuario = 0;

    const styleAnimation = document.createElement('style');
    styleAnimation.textContent = `
        @keyframes fitgirl-stripes { 0% { background-position: 0 0; } 100% { background-position: 50px 50px; } }
        @keyframes fitgirl-pulse { 0% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.4); } 50% { box-shadow: 0 0 15px rgba(0, 255, 0, 0.8); } 100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.4); } }
    `;
    (document.head || document.documentElement).appendChild(styleAnimation);

    document.addEventListener('click', () => { ultimoCliqueUsuario = Date.now(); }, true);

    window.addEventListener('kalanos_bypass_activated', () => {
        const tempoDesdeClique = Date.now() - ultimoCliqueUsuario;
        if (!modalJaExibido && tempoDesdeClique < 2000) tentarExibirModal();
    });

    function tentarExibirModal() {
        if (document.body) exibirModalSucesso();
        else window.addEventListener('DOMContentLoaded', exibirModalSucesso);
    }

    function personalizarBotaoDownload() {
        setInterval(() => {
            const botoes = document.querySelectorAll('a, button, div[role="button"]');
            botoes.forEach(btn => {
                if (btn.innerText && btn.innerText.toUpperCase().includes("BAIXAR")) {
                    if (btn.getAttribute('data-kalanos-mod')) return;
                    btn.setAttribute('data-kalanos-mod', 'true');

                    btn.style.cssText += `
                        border: none !important; text-decoration: none !important; display: inline-flex !important;
                        flex-direction: column !important; justify-content: center !important; align-items: center !important;
                        position: relative !important; overflow: hidden !important; transition: all 0.2s ease !important;
                        cursor: pointer !important; min-height: 45px !important; padding: 8px 30px !important;
                        border-radius: 4px !important; background-color: #1a1a1a !important;
                        background-image: linear-gradient(-45deg, rgba(76, 175, 80, 0.2) 25%, transparent 25%, transparent 50%, rgba(76, 175, 80, 0.2) 50%, rgba(76, 175, 80, 0.2) 75%, transparent 75%, transparent) !important;
                        background-size: 20px 20px !important; animation: fitgirl-stripes 2s linear infinite, fitgirl-pulse 2s infinite !important;
                        border-bottom: 3px solid #2e7d32 !important;
                    `;

                    btn.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 8px; z-index: 2;">
                            <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 700; font-size: 16px; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); letter-spacing: 1px;">BAIXAR</span>
                            <span style="background: #4CAF50; color: #000; font-size: 10px; font-weight: bold; padding: 1px 4px; border-radius: 2px; font-family: monospace;">FIXED</span>
                        </div>
                        <div style="font-size: 9px; color: #aaa; margin-top: 2px; font-family: monospace; z-index: 2;">by Kalanos 🔓</div>
                    `;

                    btn.addEventListener('mouseenter', () => { btn.style.filter = "brightness(1.2)"; btn.style.transform = "translateY(-1px)"; });
                    btn.addEventListener('mouseleave', () => { btn.style.filter = "brightness(1.0)"; btn.style.transform = "translateY(0)"; });
                }
            });
        }, 1000);
    }

    function iniciarInterface() {
        personalizarBotaoDownload();

        // Modal Sucesso
        window.exibirModalSucesso = function() {
            if (modalJaExibido) return;
            modalJaExibido = true;
            const modal = document.createElement('div');
            modal.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(20, 20, 20, 0.98); border: 1px solid #4CAF50; color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 0 30px rgba(76, 175, 80, 0.2); z-index: 2147483647; font-family: 'Segoe UI', sans-serif; text-align: center; min-width: 280px;`;
            modal.innerHTML = `
                <h2 style="margin: 0 0 5px 0; font-size: 18px; color: #4CAF50;">⚡ BYPASS v19.1 ⚡</h2>
                <p style="font-size: 11px; color: #888; margin-bottom: 10px;">Proteção removida.</p>
                <div style="width: 100%; background: #333; height: 3px; border-radius: 2px;"><div id="bypass-bar" style="width: 100%; height: 100%; background: #4CAF50; transition: width ${TEMPO_AUTO_CLOSE}ms linear;"></div></div>
            `;
            document.body.appendChild(modal);
            setTimeout(() => { document.getElementById('bypass-bar').style.width = '0%'; }, 50);
            setTimeout(() => { modal.style.opacity = '0'; modal.style.transition = 'opacity 0.2s'; setTimeout(() => { modal.remove(); modalJaExibido = false; }, 200); }, TEMPO_AUTO_CLOSE);
        };

        // Painel Flutuante
        const container = document.createElement('div');
        container.style.cssText = `position: fixed; top: 20px; right: 20px; z-index: 2147483640; font-family: 'Consolas', monospace; width: 35px; height: 35px; cursor: pointer;`;
        const btn = document.createElement('div');
        btn.innerHTML = '!';
        btn.style.cssText = `width: 100%; height: 100%; background-color: #111; color: #4CAF50; border: 1px solid #4CAF50; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; box-shadow: 0 0 10px rgba(76, 175, 80, 0.1); transition: all 0.3s; user-select: none;`;

        const tooltip = document.createElement('div');
        tooltip.style.cssText = `position: absolute; top: 45px; right: 0; background-color: rgba(15, 15, 15, 0.98); color: #fff; border: 1px solid #333; padding: 12px; border-radius: 6px; font-size: 11px; text-align: left; width: 320px; box-shadow: 0 5px 20px rgba(0,0,0,0.5); opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.3s ease; backdrop-filter: blur(5px);`;

        // SVG do Ícone de Mapa (Pin)
        const svgMapIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 115-79.5 232.5T480-80Zm0-480Z"/></svg>`;

        // HTML do Painel (COM DONATES DESTACADOS)
        tooltip.innerHTML = `
            <div style="border-bottom: 1px solid #333; padding-bottom: 8px; margin-bottom: 10px; text-align: center;"><strong style="color: #4CAF50; font-size: 13px;">BYPASS POR KALANOS</strong><div style="font-size: 10px; color: #666;">Versão ${VERSION}</div></div>

            <div style="margin-bottom: 15px; background: #0a0a0a; padding: 10px; border-radius: 5px; border-left: 3px solid #333; position: relative; overflow: hidden;" id="kalanos-network-box">
                <div style="margin-bottom: 4px; display: flex; justify-content: space-between;"><span style="color: #666;">Status:</span><strong id="kalanos-status" style="color: #888;">...</strong></div>
                <div style="margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #666;">IP:</span>
                    <a id="kalanos-ip-link" href="#" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 4px;" title="Ver no Maps">
                        <strong id="kalanos-ip" style="color: #eee; transition: color 0.2s;">...</strong>
                        <span id="kalanos-icon-wrapper" style="color: #666; transition: color 0.2s; display: flex;">${svgMapIcon}</span>
                    </a>
                </div>
                <div style="margin-bottom: 4px; display: flex; justify-content: space-between;"><span style="color: #666;">ISP:</span><strong id="kalanos-isp" style="color: #888;">...</strong></div>
                <div style="width: 100%; height: 1px; background: #222; position: absolute; bottom: 0; left: 0;"><div id="kalanos-net-bar" style="width: 0%; height: 100%; background: #4CAF50;"></div></div>
            </div>

            <div style="margin-top: 10px;">
                <p style="margin: 0 0 8px 0; color: #aaa; text-align: center; font-size: 10px;">👇 CONTRIBUA (CLIQUE PARA COPIAR) 👇</p>

                <div class="copy-wallet" data-wallet="bc1q86rc7evx42qrjk392tn9rzs5uxalyqy6rhcrz2" style="background: #0a0a0a; border: 1px solid #f7931a; color: #f7931a; padding: 10px; border-radius: 5px; margin-bottom: 8px; cursor: pointer; text-align: center; font-weight: bold; font-size: 10px; transition: all 0.2s; box-shadow: 0 0 5px rgba(247, 147, 26, 0.1);">
                    <div style="display: flex; justify-content: center; align-items: center; gap: 5px; margin-bottom: 2px;">
                        <span style="color: #fff; font-size: 11px;">BITCOIN</span>
                    </div>
                    <span style="font-family: monospace; font-size: 9px; opacity: 0.8;">bc1q86rc7evx42qrjk392tn9rzs5uxalyqy6rhcrz2</span>
                </div>

                <div class="copy-wallet" data-wallet="0x2b5a6a4fbd70910835e59a10a72487f9eca27754" style="background: #0a0a0a; border: 1px solid #627eea; color: #627eea; padding: 10px; border-radius: 5px; cursor: pointer; text-align: center; font-weight: bold; font-size: 10px; transition: all 0.2s; box-shadow: 0 0 5px rgba(98, 126, 234, 0.1);">
                    <div style="display: flex; justify-content: center; align-items: center; gap: 5px; margin-bottom: 2px;">
                        <span style="color: #fff; font-size: 11px;">ETHEREUM</span>
                    </div>
                    <span style="font-family: monospace; font-size: 9px; opacity: 0.8;">0x2b5a6a4fbd70910835e59a10a72487f9eca27754</span>
                </div>
            </div>
        `;

        // Eventos Hover/Click do Painel
        const mostrar = () => { tooltip.style.opacity = '1'; tooltip.style.visibility = 'visible'; tooltip.style.transform = 'translateY(0)'; btn.style.borderColor = '#4CAF50'; };
        const esconder = () => { tooltip.style.opacity = '0'; tooltip.style.visibility = 'hidden'; tooltip.style.transform = 'translateY(-10px)'; btn.style.borderColor = '#4CAF50'; };
        container.addEventListener('mouseenter', mostrar); container.addEventListener('mouseleave', esconder);
        container.addEventListener('click', () => { if (tooltip.style.visibility === 'visible') esconder(); else mostrar(); });
        container.appendChild(btn); container.appendChild(tooltip); document.body.appendChild(container);

        // Copiar Carteiras (Efeitos Visuais Melhorados)
        tooltip.querySelectorAll('.copy-wallet').forEach(el => {
            // Hover Effect
            el.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#151515';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = `0 0 10px ${this.style.borderColor}`;
            });
            el.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#0a0a0a';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = `0 0 5px rgba(0,0,0,0.2)`;
            });

            // Click Effect
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                GM_setClipboard(this.getAttribute('data-wallet'));

                const originalHTML = this.innerHTML;
                const originalBorder = this.style.borderColor;
                const originalColor = this.style.color;

                this.innerHTML = `<span style="font-size: 12px; line-height: 20px;">✅ COPIADO!</span>`;
                this.style.borderColor = "#00ff00";
                this.style.color = "#00ff00";
                this.style.backgroundColor = "#001100";

                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.borderColor = originalBorder;
                    this.style.color = originalColor;
                    this.style.backgroundColor = '#0a0a0a';
                }, 1500);
            });
        });

        // Atualização de Rede (Incluindo Lat/Lon para Maps)
        const LISTA_ISP_INSECURE = ["Claro", "Vivo", "Tim", "Oi", "Net", "Sky", "Algar", "Brisanet", "Telefonica", "Telecom", "Comcast", "AT&T", "Verizon", "Spectrum", "Vodafone", "Orange"];
        const atualizarRede = () => {
            const netBar = tooltip.querySelector('#kalanos-net-bar');
            if (netBar) { netBar.style.transition = 'none'; netBar.style.width = '0%'; void netBar.offsetWidth; netBar.style.transition = `width ${TEMPO_REFRESH_IP}ms linear`; netBar.style.width = '100%'; }

            GM_xmlhttpRequest({
                method: "GET", url: "http://ip-api.com/json/?fields=status,isp,query,lat,lon",
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.status === 'success') {
                            const ipEl = tooltip.querySelector('#kalanos-ip');
                            const ipLinkEl = tooltip.querySelector('#kalanos-ip-link');
                            const iconWrap = tooltip.querySelector('#kalanos-icon-wrapper');
                            const ispEl = tooltip.querySelector('#kalanos-isp');
                            const statusEl = tooltip.querySelector('#kalanos-status');
                            const boxEl = tooltip.querySelector('#kalanos-network-box');

                            if(ipEl) ipEl.innerText = data.query;
                            if(ispEl) ispEl.innerText = data.isp;

                            // Atualiza o link do Maps (HTTPS)
                            if (data.lat && data.lon && ipLinkEl) {
                                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lon}`;
                                ipLinkEl.href = mapsUrl;
                                ipLinkEl.onclick = function(e) { e.preventDefault(); window.open(mapsUrl, '_blank'); };
                                ipLinkEl.addEventListener('mouseenter', () => { if(ipEl) ipEl.style.color = '#4CAF50'; if(iconWrap) iconWrap.style.color = '#4CAF50'; });
                                ipLinkEl.addEventListener('mouseleave', () => { if(ipEl) ipEl.style.color = '#eee'; if(iconWrap) iconWrap.style.color = '#666'; });
                            }

                            let isInsecure = false;
                            LISTA_ISP_INSECURE.forEach(key => { if (data.isp.toLowerCase().includes(key.toLowerCase())) isInsecure = true; });

                            if (isInsecure) {
                                statusEl.innerText = "⚠️ EXPOSTO"; statusEl.style.color = "#d32f2f"; boxEl.style.borderLeft = "3px solid #d32f2f";
                            } else {
                                statusEl.innerText = "🔒 SEGURO"; statusEl.style.color = "#4CAF50"; boxEl.style.borderLeft = "3px solid #4CAF50";
                            }
                        }
                    } catch(e) {}
                }
            });
        };
        atualizarRede(); setInterval(atualizarRede, TEMPO_REFRESH_IP);
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', iniciarInterface); } else { iniciarInterface(); }
})();