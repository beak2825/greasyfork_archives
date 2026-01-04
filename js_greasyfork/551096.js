// ==UserScript==
// @name         Ups - Vault 2.0
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Synchronised vault between all Torn instances.
// @author       Upsilon[3212478]
// @match        https://www.torn.com/properties.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/551096/Ups%20-%20Vault%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/551096/Ups%20-%20Vault%2020.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class VaultTracker {
        constructor(minDateStr) {
            this.minDate = new Date(minDateStr);

            this.vaultSelector = '.vault-trans-list';
            this.transactionSelector = 'li[transaction_id]';

            this.balances = {};
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

            if (!id || !dateEl || !timeEl || !userEl || !typeEl || !amountEl || !balanceEl) return null;

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
            const list = document.querySelector('ul.options-list');

            if (window.innerWidth <= 768) {
                if (!list) {
                    console.warn('📱 ul.options-list introuvable sur mobile');
                    return;
                }

                list.querySelectorAll('li.vault-script').forEach(li => li.remove());

                Object.entries(balances).forEach(([user, amount]) => {
                    const li = document.createElement('li');
                    li.className = 'vault-script';
                    const desc = document.createElement('div');
                    desc.className = 'desc';
                    const sign = amount >= 0 ? '+' : '-';
                    desc.textContent = `${user}: ${sign}${Math.abs(amount).toLocaleString()}`;
                    const icon = document.createElement('div');
                    icon.className = 'p-icon';
                    li.appendChild(icon);
                    li.appendChild(desc);
                    list.appendChild(li);
                    this.updateDot(li, amount);
                });

                const total = Object.values(balances).reduce((a, b) => a + b, 0);
                const totalLi = document.createElement('li');
                totalLi.className = 'vault-script';
                const totalDesc = document.createElement('div');
                totalDesc.className = 'desc';
                const sign = total >= 0 ? '+' : '-';
                totalDesc.textContent = `Total: ${sign}${Math.abs(total).toLocaleString()}`;
                const totalIcon = document.createElement('div');
                totalIcon.className = 'p-icon';
                totalLi.appendChild(totalIcon);
                totalLi.appendChild(totalDesc);
                list.appendChild(totalLi);
                this.updateDot(totalLi, total);
                return;
            }

            const emptyLis = Array.from(document.querySelectorAll('ul.options-list li.empty'));
            const existingLis = Array.from(document.querySelectorAll('ul.options-list li.vault-script'));

            Object.keys(balances).forEach(user => {
                const amount = balances[user];
                const sign = amount >= 0 ? '+' : '-';
                const text = `${user}: ${sign}${Math.abs(amount).toLocaleString()}`;

                let li = existingLis.find(l => l.querySelector('.desc')?.textContent.startsWith(user));

                if (!li) {
                    if (emptyLis.length === 0) {
                        console.warn('Pas assez de <li class="empty"> pour afficher tous les users');
                        return;
                    }
                    li = emptyLis.shift();
                    li.classList.remove('empty');
                    li.classList.add('vault-script');
                }

                const desc = li.querySelector('.desc');
                if (desc) desc.textContent = text;

                this.updateDot(li, amount);
            });

            const total = Object.values(balances).reduce((a, b) => a + b, 0);
            const sign = total >= 0 ? '+' : '-';
            const totalText = `Total: ${sign}${Math.abs(total).toLocaleString()}`;

            let totalLi = existingLis.find(l => l.querySelector('.desc')?.textContent.startsWith("Total"));
            if (!totalLi) {
                if (emptyLis.length === 0) {
                    console.warn('Pas assez de <li class="empty"> pour afficher le total');
                    return;
                }
                totalLi = emptyLis.shift();
                totalLi.classList.remove('empty');
                totalLi.classList.add('vault-script');
            }

            const totalDesc = totalLi.querySelector('.desc');
            if (totalDesc) totalDesc.textContent = totalText;

            this.updateDot(totalLi, total);
        }

        updateDot(li, amount) {
            const icon = li.querySelector('.p-icon');
            if (!icon) return;

            const oldDot = icon.querySelector('.vault-dot');
            if (oldDot) oldDot.remove();

            icon.style.position = 'relative';

            const dot = document.createElement('span');
            dot.className = 'vault-dot';
            dot.style.position = 'absolute';
            dot.style.top = '50%';
            dot.style.left = '50%';
            dot.style.transform = 'translate(-50%, -50%)';
            dot.style.width = '10px';
            dot.style.height = '10px';
            dot.style.borderRadius = '50%';
            dot.style.backgroundColor = amount >= 0 ? 'green' : 'red';

            icon.appendChild(dot);
        }

        async getBalance() {
            try {
                const res = await fetch(`https://api.upsilon-cloud.uk/uhkvLArIYy/vault/balance`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                this.balances = data;
                this.displayBalances(this.balances);
            } catch (err) {
                console.error('Erreur lors du fetch des balances:', err);
            }
        }

        async addTransaction(tx) {
            console.log(tx);
            console.log(this.minDate);
            if (tx.created_date < this.minDate) {
                return;
            }

            try {
                const res = await fetch(`https://api.upsilon-cloud.uk/idIlDYmnRM/vault/transaction`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: tx.id,
                        user: tx.user,
                        amount: tx.type === 'Deposit' ? tx.amount : -tx.amount,
                        created_date: tx.created_date.toISOString()
                    })
                });
                const data = await res.json();

                this.displayBalances(data);
            } catch (err) {
                console.error('Erreur lors de l’envoi de la transaction:', err);
            }
        }

        observeVault() {
            const list = document.querySelector(this.vaultSelector);
            if (!list) return;

            const transactions = Array.from(list.querySelectorAll(this.transactionSelector))
            .map(li => this.extractTransaction(li))
            .filter(Boolean);

            transactions.forEach(tx => this.addTransaction(tx));

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;
                        if (node.matches(this.transactionSelector)) {
                            const tx = this.extractTransaction(node);
                            if (tx) this.addTransaction(tx);
                        }
                    });
                });
            });

            observer.observe(list, {childList: true, subtree: true});
        }

        observeAjax() {
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const response = await originalFetch.apply(this, args);

                try {
                    const url = args[0];
                    if (typeof url === "string" && url.includes("properties.php")) {
                        const self = this;
                        const waitForVaultList = () => {
                            const list = document.querySelector(self.vaultSelector);
                            if (!list) {
                                console.log("waitForVaultList");
                                setTimeout(waitForVaultList, 200);
                                return;
                            }
                            console.log("self.observe from fetch");
                            self.observeVault();
                        };
                        waitForVaultList();
                    }
                } catch (err) {
                    console.error("Erreur hook fetch:", err);
                }

                return response;
            };

            const origOpen = XMLHttpRequest.prototype.open;
            const self = this;
            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                this.addEventListener("load", () => {
                    if (url.includes("properties.php")) {
                        console.log("⚡ XHR properties.php rechargé → reinit VaultTracker");
                        const waitForVaultList = () => {
                            const list = document.querySelector(self.vaultSelector);
                            if (!list) {
                                console.log("waitForVaultList");
                                setTimeout(waitForVaultList, 200);
                                return;
                            }
                            console.log("self.observe from XHR");
                            self.observeVault();
                        };
                        waitForVaultList();
                    }
                });
                return origOpen.call(this, method, url, ...rest);
            };
        }

        async init() {
            await this.getBalance();
            this.observeAjax();

            const interval = setInterval(() => {
                const list = document.querySelector(this.vaultSelector);
                if (list) {
                    clearInterval(interval);
                    this.observeVault();
                }
            }, 100);
        }
    }

    window.vaultTracker = new VaultTracker('2025-09-23T20:00:00Z');
    window.vaultTracker.init();
})();
