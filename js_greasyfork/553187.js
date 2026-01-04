// ==UserScript==
// @name         Ups - Vault 2.0 (Debug HTML Version)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Version complète du script Vault avec affichage HTML (pour debug TornPDA)
// @author       Upsilon
// @match        https://www.torn.com/properties.php*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553187/Ups%20-%20Vault%2020%20%28Debug%20HTML%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553187/Ups%20-%20Vault%2020%20%28Debug%20HTML%20Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Création du panneau HTML ===
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '10px';
    panel.style.right = '10px';
    panel.style.width = '450px';
    panel.style.maxHeight = '400px';
    panel.style.overflowY = 'auto';
    panel.style.background = 'rgba(0,0,0,0.9)';
    panel.style.color = '#0f0';
    panel.style.fontSize = '12px';
    panel.style.fontFamily = 'monospace';
    panel.style.padding = '8px';
    panel.style.border = '1px solid #0f0';
    panel.style.borderRadius = '8px';
    panel.style.zIndex = '99999';
    document.body.appendChild(panel);

    const log = (...args) => {
        const msg = document.createElement('div');
        msg.textContent = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        panel.appendChild(msg);
        panel.scrollTop = panel.scrollHeight;
    };

    const divider = (txt) => {
        const d = document.createElement('div');
        d.style.color = '#ff0';
        d.style.marginTop = '6px';
        d.textContent = `=== ${txt} ===`;
        panel.appendChild(d);
    };

    // === Script principal ===
    class VaultTracker {
        constructor(minDateStr) {
            this.minDate = new Date(minDateStr);
            this.vaultSelector = '.vault-trans-wrap .vault-trans-list';
            this.transactionSelector = 'li[transaction_id]';
            this.balances = {};
            this.processedIds = new Set();
            this.isTornPDA = navigator.userAgent.includes("TornPDA");
            log("🚀 VaultTracker initialisé. TornPDA:", this.isTornPDA);
            this.init();
        }

        parseAmount(el) {
            if (!el) return null;
            const text = el.textContent.replace(/[^\d]/g, '');
            return text ? parseInt(text, 10) : null;
        }

        parseDate(dateStr, timeStr) {
            const [day, month, year] = dateStr.split('/').map(s => parseInt(s, 10));
            const fullYear = year < 100 ? 2000 + year : year;
            const [hour, min, sec] = timeStr.split(':').map(s => parseInt(s, 10));
            return new Date(fullYear, month - 1, day, hour, min, sec);
        }

        extractTransaction(li) {
            const id = li.getAttribute('transaction_id');
            const dateEl = li.querySelector('.date .transaction-date');
            const timeEl = li.querySelector('.date .transaction-time');
            const userEl = li.querySelector('.user.name');
            const typeEl = li.querySelector('.type');
            const amountEl = li.querySelector('.amount');
            const balanceEl = li.querySelector('.balance');
            if (!id) return null;

            log("🔍 extractTransaction ->", id);
            if (!dateEl || !timeEl || !userEl || !typeEl || !amountEl || !balanceEl) {
                log("⚠️ Transaction incomplète", id);
                return null;
            }

            return {
                id: parseInt(id, 10),
                created_date: this.parseDate(dateEl.textContent.trim(), timeEl.textContent.trim()),
                user: userEl.textContent.trim(),
                type: typeEl.textContent.trim(),
                amount: this.parseAmount(amountEl),
                balance: this.parseAmount(balanceEl)
            };
        }

        displayBalances(balances) {
            divider("Affichage balances");
            log("📊 Balances reçues:", balances);

            const total = Object.values(balances).reduce((a, b) => a + b, 0);
            const sign = total >= 0 ? '+' : '-';
            const totalText = `Total: ${sign}${Math.abs(total).toLocaleString()}`;
            log("💰", totalText);
        }

        async getBalance() {
            divider("getBalance()");
            try {
                // Simulé, pas de fetch réel
                log("🌐 Simulation GET balance...");
                const fake = { Upsilon: 500000, TestUser: -200000 };
                this.balances = fake;
                this.displayBalances(fake);
            } catch (err) {
                log("❌ Erreur getBalance:", err);
            }
        }

        async addTransaction(tx) {
            if (!tx) return;
            if (tx.created_date < this.minDate) return;

            log("➕ addTransaction", tx);
            // Simulation d’appel serveur
            this.balances[tx.user] = (this.balances[tx.user] || 0) + (tx.type === 'Deposit' ? tx.amount : -tx.amount);
            this.displayBalances(this.balances);
        }

        observeVault() {
            divider("observeVault()");
            const list = document.querySelector(this.vaultSelector);
            log("🔎 Recherche vault list:", !!list);
            if (!list) return;

            const transactions = Array.from(list.querySelectorAll(this.transactionSelector))
                .map(li => this.extractTransaction(li))
                .filter(Boolean);

            log(`📑 ${transactions.length} transactions trouvées`);
            transactions.forEach(tx => this.addTransaction(tx));

            const observer = new MutationObserver(mutations => {
                log("👀 Mutation détectée:", mutations.length);
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
                        if (node.matches(this.transactionSelector)) {
                            log("⚡ Nouveau LI détecté:", node.getAttribute('transaction_id'));
                            const tx = this.extractTransaction(node);
                            if (tx) this.addTransaction(tx);
                        }
                    });
                });
            });
            observer.observe(list, { childList: true, subtree: true });
            log("✅ MutationObserver attaché");
        }

        observeAjax() {
            divider("observeAjax()");
            const self = this;

            // Hook fetch
            try {
                const originalFetch = window.fetch;
                window.fetch = async (...args) => {
                    const url = args[0];
                    log("🧨 fetch:", url);
                    const response = await originalFetch.apply(this, args);
                    if (typeof url === "string" && url.includes("properties.php")) {
                        log("🔁 fetch reload properties.php détecté");
                        setTimeout(() => self.observeVault(), 500);
                    }
                    return response;
                };
                log("✅ Hook fetch installé");
            } catch (err) {
                log("❌ Hook fetch échoué:", err);
            }

            // Hook XHR
            try {
                const origOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                    this.addEventListener("load", () => {
                        if (url.includes("properties.php")) {
                            log("⚡ XHR properties.php rechargé → observeVault()");
                            setTimeout(() => self.observeVault(), 500);
                        }
                    });
                    return origOpen.call(this, method, url, ...rest);
                };
                log("✅ Hook XHR installé");
            } catch (err) {
                log("❌ Hook XHR échoué:", err);
            }
        }

        async init() {
            divider("init()");
            await this.getBalance();
            this.observeAjax();

            const tryAttach = setInterval(() => {
                const list = document.querySelector(this.vaultSelector);
                if (list) {
                    clearInterval(tryAttach);
                    log("✅ Table détectée, initialisation des transactions");
                    this.observeVault();
                } else {
                    log("⏳ En attente de la vault list...");
                }
            }, 1000);
        }
    }

    // Lancer le script
    window.vaultTracker = new VaultTracker('2025-09-23T20:00:00Z');
})();
