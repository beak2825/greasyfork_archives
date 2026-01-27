// ==UserScript==
// @name         XenForo – Application Tags & VPN/IP Check + Filter + API Status + IP Redirect2 (Auto-Reason)
// @namespace    https://tampermonkey.net/
// @version      1.3
// @description  Marks application blocks, checks IPs, filters, and auto-fills rejection reasons for VPN/Short apps.
// @author       You
// @match        https://looksmax.org/approval-queue/*
// @match        https://looksmax.org/members/*/warn*
// @match        https://looksmax.org/members/*/edit*
// @icon         https://www.google.com/s2/favicons?domain=looksmax.org
// @grant        GM_xmlhttpRequest
// @connect      proxycheck.io
// @connect      looksmax.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555740/XenForo%20%E2%80%93%20Application%20Tags%20%20VPNIP%20Check%20%2B%20Filter%20%2B%20API%20Status%20%2B%20IP%20Redirect2%20%28Auto-Reason%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555740/XenForo%20%E2%80%93%20Application%20Tags%20%20VPNIP%20Check%20%2B%20Filter%20%2B%20API%20Status%20%2B%20IP%20Redirect2%20%28Auto-Reason%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const API_KEY = "90w2re-x9b1vb-4041e5-u043lp";
    const ipCache = {};
    const filters = ["NORMAL", "FEMALE", "TOO SHORT", "ALT ACCOUNT", "VPN"];
    const activeFilters = new Set();
    const messagesMap = new Map();
    window.__highlightMessageMap = messagesMap;

    const REJECTION_TEMPLATES = {
        ai: "Please submit a new application with original reasoning not generated " +
            "by AI tools.",
        notLm: "Your application does not relate to looksmaxing. Please submit a " +
            "new application with a relevant and appropriate reason.",
        troll: "We only accept serious applications. Please reapply with a " +
            "thoughtful and legitimate reason.",
        deleted: "You must wait three months after deleting your account before " +
            "signing up again. Please reapply once the waiting period has passed.",
        vpn: "Your application was rejected because it was submitted via a VPN or " +
            "proxy. Please reapply without using a VPN or proxy so we can verify " +
            "your IP address.",
        tooShort: "Your application was rejected because your response was too " +
            "short. Please reapply with more detailed and thoughtful answers."
    };

    const altCache = new Map();

    // --- Fix long content overflow into other cells ---
    (function addMainCellWrapStyles() {
        const style = document.createElement('style');
        style.textContent = `
      .message-inner { display: flex; }
      .message-cell { min-width: 0; }
      .message-cell--main { min-width: 0; overflow-wrap: anywhere; }
      .message-cell--main * { max-width: 100%; word-break: break-word; }
      .alt-accounts-box {
        margin-top: 8px;
        padding: 6px 8px;
        background: rgba(0,0,0,0.03);
        border: 1px solid rgba(0,0,0,0.08);
        border-radius: 6px;
        font-size: 12px;
      }
      .alt-accounts-box .alt-title {
        font-weight: bold;
        margin-bottom: 4px;
      }
      .alt-accounts-box .alt-item {
        margin: 2px 0;
      }
      .alt-accounts-box .alt-approved {
        color: #b00020;
        font-weight: bold;
      }
    `;
        document.head.appendChild(style);
    })();

    // --- Insert Filter Menu ---
    (function insertDirectFilterMenu() {
        const filterBar = document.querySelector('.block-filterBar');
        if (!filterBar) return;

        const apiStatus = document.createElement('div');
        apiStatus.style.margin = "5px 0";
        apiStatus.style.fontWeight = "bold";
        apiStatus.style.color = "#666";
        apiStatus.textContent = "Checking API...";
        filterBar.parentNode.insertBefore(apiStatus, filterBar);

        async function checkFirstIP() {
            const firstIPLink = document.querySelector('ul.listPlain li a[href]');
            if (!firstIPLink) {
                apiStatus.textContent = "No IP found yet…";
                apiStatus.style.color = "orange";
                return;
            }
            const ipText = firstIPLink.textContent.trim();
            const ipMatch = ipText.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/);
            if (!ipMatch) {
                apiStatus.textContent = "Invalid IP";
                apiStatus.style.color = "orange";
                return;
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: `https://proxycheck.io/v2/${ipText}?key=${API_KEY}&vpn=1&risk=1`,
                onload(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data[ipText] && typeof data[ipText].proxy !== "undefined") {
                            apiStatus.textContent = "API VALID";
                            apiStatus.style.color = "green";
                        } else {
                            apiStatus.textContent = "API FAILED";
                            apiStatus.style.color = "red";
                        }
                    } catch (e) {
                        apiStatus.textContent = "API FAILED";
                        apiStatus.style.color = "red";
                    }
                },
                onerror() {
                    apiStatus.textContent = "API FAILED";
                    apiStatus.style.color = "red";
                }
            });
        }

        const xfFilterField = document.createElement('div');
        xfFilterField.className = "block-filterBar block-filterBar--standalone";
        xfFilterField.innerHTML = `
      <div class="filterBar">
        <ul class="filterBar-filters">
          <li><span class="filterBar-filterToggle-label"
            style="font-weight:bold; margin-right:5px;">Custom Filters:</span>
          </li>
        </ul>
      </div>
    `;
        filterBar.parentNode.insertBefore(xfFilterField, filterBar);

        const menuBody = xfFilterField.querySelector('.filterBar-filters');

        filters.forEach(f => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#";
            a.className = "filterBar-filterToggle";
            a.dataset.tag = f;
            a.textContent = `${f} (0)`;
            a.addEventListener('click', e => {
                e.preventDefault();
                if (activeFilters.has(f)) activeFilters.delete(f);
                else activeFilters.add(f);
                updateFilterDisplay();
                a.style.fontWeight = activeFilters.has(f) ? "bold" : "normal";
            });
            li.appendChild(a);
            menuBody.appendChild(li);
        });

        const liAuto = document.createElement('li');
        const aAuto = document.createElement('a');
        aAuto.href = "#";
        aAuto.className = "filterBar-filterToggle";
        aAuto.textContent = "Auto Select";
        aAuto.addEventListener('click', async e => {
            e.preventDefault();

            await highlightApplications();

            const originalScrollX = window.scrollX;
            const originalScrollY = window.scrollY;
            const restoreScroll = () => window.scrollTo(originalScrollX, originalScrollY);

            const selectReject = async (message, reasonText) => {
                const radioReject = message.querySelector(
                    'input[type="radio"][value="reject"]'
                );
                if (!radioReject) return;

                if (!radioReject.checked) {
                    radioReject.click();
                }

                await new Promise(r => setTimeout(r, 60));

                const dep = radioReject.closest('li')
                    ?.querySelector('.inputChoices-dependencies');
                if (dep) dep.classList.remove('is-disabled');

                const reasonInput = message.querySelector(
                    'input[name^="reason["], textarea[name^="reason["]'
                );
                if (reasonInput) {
                    reasonInput.disabled = false;
                    reasonInput.readOnly = false;
                    reasonInput.classList.remove('is-disabled');
                    reasonInput.value = reasonText;
                    reasonInput.dispatchEvent(new Event('input', {
                        bubbles: true
                    }));
                    reasonInput.dispatchEvent(new Event('change', {
                        bubbles: true
                    }));
                }
            };

            for (const [message, labels] of messagesMap) {
                if (
                    labels.includes('FEMALE') ||
                    labels.includes('VPN') ||
                    labels.includes('TOO SHORT')
                ) {
                    const hasVpn = labels.includes('VPN');
                    const hasShort = labels.includes('TOO SHORT');

                    const clickCustom = value => {
                        const input = message.querySelector(
                            `input[type="radio"][value="${value}"]`
                        );
                        if (input) input.click();
                        return !!input;
                    };

                    if (hasVpn && !hasShort) {
                        if (!clickCustom('custom_vpn')) {
                            await selectReject(message, REJECTION_TEMPLATES.vpn);
                        }
                    } else if (hasShort && !hasVpn) {
                        if (!clickCustom('custom_too_short')) {
                            await selectReject(message, REJECTION_TEMPLATES.tooShort);
                        }
                    } else {
                        const combined = [
                            hasVpn ? REJECTION_TEMPLATES.vpn : null,
                            hasShort ? REJECTION_TEMPLATES.tooShort : null
                        ].filter(Boolean).join('\n\n');
                        await selectReject(message, combined);
                    }

                    restoreScroll();
                    requestAnimationFrame(restoreScroll);
                }
            }
        });
        liAuto.appendChild(aAuto);
        menuBody.appendChild(liAuto);

        function updateFilterCounts() {
            filters.forEach(f => {
                const count = [...messagesMap.values()]
                    .filter(labels => labels.includes(f)).length;
                const btn = [...menuBody.querySelectorAll('a')]
                    .find(b => b.dataset.tag === f);
                if (btn) btn.textContent = `${f} (${count})`;
            });
        }

        function updateFilterDisplay() {
            messagesMap.forEach((labels, message) => {
                if (activeFilters.size === 0) {
                    message.style.display = "";
                } else {
                    let show = false;
                    if (activeFilters.has("NORMAL") && labels.includes("NORMAL")) {
                        show = true;
                    }
                    if (labels.some(l => activeFilters.has(l))) show = true;
                    message.style.display = show ? "" : "none";
                }
            });
            updateFilterCounts();
        }

        checkFirstIP();
    })();

    function checkVPN(ip) {
        return new Promise(resolve => {
            if (ipCache[ip] !== undefined) return resolve(ipCache[ip]);
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://proxycheck.io/v2/${ip}?key=${API_KEY}&vpn=1&risk=1`,
                onload(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        const isVPN = data[ip] ?
                            (data[ip].proxy === "yes" ||
                                (data[ip].vpn && data[ip].vpn === "yes")) :
                            false;
                        ipCache[ip] = isVPN;
                        resolve(isVPN);
                    } catch {
                        ipCache[ip] = false;
                        resolve(false);
                    }
                },
                onerror() {
                    ipCache[ip] = false;
                    resolve(false);
                }
            });
        });
    }

    function normalizeProfileUrl(url) {
        if (!url) return null;
        const a = document.createElement('a');
        a.href = url;
        return a.href.split('#')[0];
    }

    function buildMultipleAccountListUrl(profileUrl) {
        const normalized = normalizeProfileUrl(profileUrl);
        if (!normalized) return null;
        if (normalized.includes('/multiple-account-list')) return normalized;
        return normalized.endsWith('/') ?
            normalized + 'multiple-account-list/' :
            normalized + '/multiple-account-list/';
    }

    function getAltProfileUrlFromLog(message) {
        const listPlain = message.querySelector('ul.listPlain');
        if (listPlain) {
            const items = listPlain.querySelectorAll('li');
            for (const li of items) {
                if (/Multiple account/i.test(li.textContent)) {
                    const link = li.querySelector('a[href*="/members/"]');
                    if (link) return normalizeProfileUrl(link.getAttribute('href'));
                }
            }
            const anyLink = listPlain.querySelector('a[href*="/members/"]');
            if (anyLink && /Multiple account/i.test(
                    anyLink.closest('li')?.textContent || ''
                )) {
                return normalizeProfileUrl(anyLink.getAttribute('href'));
            }
        }

        const userLink = message.querySelector(
            '.message-userDetails a.username, a.username'
        );
        if (userLink) return normalizeProfileUrl(userLink.getAttribute('href'));

        return null;
    }

    function parseStatusFromRowText(text) {
        if (/Approved/i.test(text)) return "Approved";
        if (/Rejected/i.test(text)) return "Rejected";
        if (/Pending/i.test(text)) return "Pending";
        if (/Moderating/i.test(text)) return "Moderating";
        return "Approved";
    }

    function parseStatusFromRow(row) {
        const statusEl = row.querySelector(
            '.dataList-cell--status, .structItem-status, .status'
        );
        if (statusEl) return parseStatusFromRowText(statusEl.textContent || "");
        return parseStatusFromRowText(row.textContent || "");
    }

    function getUsernameStyleClassFromRow(row, link) {
        const inLink = link.querySelector('span[class*="username--style"]');
        const inRow = row.querySelector('span[class*="username--style"]');
        const el = inLink || inRow;
        if (!el) return null;
        const cls = [...el.classList].find(c => c.startsWith("username--style"));
        return cls || null;
    }

    function extractAltAccountsFromDoc(doc, excludeProfileUrl) {
        const paneRoot = doc.querySelector('.js-memberTabPanes') || doc;

        const blocks = [...paneRoot.querySelectorAll('.block')];
        let targetBlock = null;
        for (const b of blocks) {
            const counter = b.querySelector('.block-footer-counter');
            if (counter && /Matched/i.test(counter.textContent)) {
                targetBlock = b;
                break;
            }
        }

        const searchRoot = targetBlock || paneRoot;
        const rows = searchRoot.querySelectorAll(
            'tr, .dataList-row, .structItem, li'
        );

        const results = [];

        rows.forEach(row => {
            if (!row.textContent.toLowerCase().includes("cookie")) return;

            const link = row.querySelector('a[href*="/members/"]');
            if (!link) return;

            if (link.closest('nav') || link.closest('.p-nav') ||
                link.closest('.p-navEl')) {
                return;
            }

            const url = normalizeProfileUrl(link.getAttribute('href'));
            if (!url) return;
            if (excludeProfileUrl && url === excludeProfileUrl) return;

            const nameSpan = link.querySelector('span') || link;
            const name = (nameSpan.textContent || "").trim();
            if (!name) return;

            const status = parseStatusFromRow(row);
            const nameClass = getUsernameStyleClassFromRow(row, link);

            results.push({
                name,
                url,
                status,
                nameClass
            });
        });

        const unique = new Map();
        results.forEach(item => {
            if (!unique.has(item.url)) unique.set(item.url, item);
        });
        return [...unique.values()];
    }

    function fetchAltAccounts(profileUrl) {
        return new Promise(resolve => {
            const normalized = normalizeProfileUrl(profileUrl);
            if (!normalized) return resolve([]);
            if (altCache.has(normalized)) return resolve(altCache.get(normalized));

            const url = buildMultipleAccountListUrl(normalized);
            if (!url) return resolve([]);

            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload(res) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(
                            res.responseText, "text/html"
                        );
                        const accounts = extractAltAccountsFromDoc(doc, null);
                        altCache.set(normalized, accounts);
                        resolve(accounts);
                    } catch {
                        altCache.set(normalized, []);
                        resolve([]);
                    }
                },
                onerror() {
                    altCache.set(normalized, []);
                    resolve([]);
                }
            });
        });
    }

    function renderAltAccounts(message, accounts, excludeProfileUrl) {
        const userCell = message.querySelector('.message-cell--user');
        if (!userCell) return;

        let box = userCell.querySelector('.alt-accounts-box');
        if (!box) {
            box = document.createElement('div');
            box.className = "alt-accounts-box";
            userCell.appendChild(box);
        }

        const filtered = (accounts || []).filter(acc => {
            if (!excludeProfileUrl) return true;
            return acc.url !== excludeProfileUrl;
        });

        box.innerHTML = "";
        const title = document.createElement('div');
        title.className = "alt-title";
        title.textContent = "Detected alt accounts:";
        box.appendChild(title);

        if (!filtered || filtered.length === 0) {
            const none = document.createElement('div');
            none.className = "alt-item";
            none.textContent = "None found";
            box.appendChild(none);
            return;
        }

        filtered.forEach(acc => {
            const item = document.createElement('div');
            item.className = "alt-item";

            const a = document.createElement('a');
            a.href = acc.url;
            a.target = "_blank";

            if (acc.nameClass) {
                const span = document.createElement('span');
                span.className = acc.nameClass;
                span.textContent = acc.name;
                a.appendChild(span);
            } else {
                a.textContent = acc.name;
            }

            const status = document.createElement('span');
            status.textContent = ` (${acc.status})`;
            if (acc.status === "Approved") {
                status.className = "alt-approved";
            }

            item.appendChild(a);
            item.appendChild(status);
            box.appendChild(item);
        });
    }

    async function highlightApplications() {
        const messages = document.querySelectorAll(
            '.message:not([data-auto-reject="1"])'
        );
        for (const message of messages) {
            message.dataset.autoReject = "1";

            let highlightColor = null;
            let boxShadowColor = null;
            const labels = [];

            const genderField = message.querySelector(
                'dl[data-field="male_female"] dd'
            );
            const reasonField = message.querySelector(
                'dl[data-field="why_join"] dd'
            );
            const dataCells = message.querySelectorAll('.dataList-cell');

            let isFemale = false;
            let isTooShort = false;
            let isAlt = false;
            let isVpnProxy = false;

            const applicantLink = message.querySelector(
                '.message-userDetails a.username, a.username'
            );
            const applicantProfileUrl = normalizeProfileUrl(
                applicantLink ? applicantLink.getAttribute('href') : null
            );

            if (genderField &&
                genderField.textContent.trim().toLowerCase() === "female") {
                isFemale = true;
                labels.push("FEMALE");
            }

            if (reasonField) {
                const wc = reasonField.textContent.trim().split(/\s+/)
                    .filter(w => w.length > 0).length;
                if (wc < 5) {
                    isTooShort = true;
                    labels.push("TOO SHORT");
                }
            }

            dataCells.forEach(cell => {
                if (/(Moderating|Multiple account|Rejected user)/i.test(
                        cell.textContent)) {
                    isAlt = true;
                    labels.push("ALT ACCOUNT");
                }
            });

            let ip = null;
            const listPlain = message.querySelector('ul.listPlain');
            if (listPlain) {
                const firstLink = listPlain.querySelector('li a[href]');
                if (firstLink) {
                    const ipText = firstLink.textContent.trim();
                    const ipMatch = ipText.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/);
                    if (ipMatch) {
                        ip = ipText;
                        firstLink.href = `https://whatismyipaddress.com/ip/${ip}`;
                        firstLink.target = "_blank";
                        isVpnProxy = await checkVPN(ip);
                        if (isVpnProxy) labels.push("VPN");
                    }
                }
            }

            // --- Custom Rejection Logic ---
            const rejectRadio = message.querySelector(
                'input[type="radio"][value="reject"]'
            );
            const rejectInput = message.querySelector(
                'input[name^="reason["], textarea[name^="reason["]'
            );

            if (rejectRadio) {
                const parentUl = rejectRadio.closest('ul.inputChoices');
                if (parentUl) {
                    if (!parentUl.querySelector('.custom-rejections-header')) {
                        const headerLi = document.createElement('li');
                        headerLi.className = "custom-rejections-header";
                        headerLi.style.cssText =
                            "margin-top: 12px; margin-bottom: 4px; padding-left: 5px;";
                        headerLi.innerHTML = `
                <div style="font-weight: bold; font-size: 10px;
                  text-transform: uppercase; color: #aaa;
                  letter-spacing: 0.5px;">Custom Rejections</div>
                <div style="width: 20px; border-bottom: 1.5px solid #666;
                  margin-top: 2px;"></div>
            `;
                        parentUl.appendChild(headerLi);
                    }

                    const customReasons = [{
                            label: "Reject (AI)",
                            key: "ai",
                            value: "custom_ai"
                        },
                        {
                            label: "Reject (Not LM related)",
                            key: "notLm",
                            value: "custom_not_lm"
                        },
                        {
                            label: "Reject (Troll)",
                            key: "troll",
                            value: "custom_troll"
                        },
                        {
                            label: "Reject (Deleted)",
                            key: "deleted",
                            value: "custom_deleted"
                        },
                        {
                            label: "Reject (VPN)",
                            key: "vpn",
                            value: "custom_vpn"
                        },
                        {
                            label: "Reject (Too Short)",
                            key: "tooShort",
                            value: "custom_too_short"
                        }
                    ];

                    customReasons.forEach(reason => {
                        if (parentUl.querySelector(
                                `input[type="radio"][value="${reason.value}"]`
                            )) return;

                        const li = document.createElement('li');
                        li.className = "inputChoices-choice";
                        if (reason.key === "ai") li.classList.add("custom-ai-reject");
                        li.innerHTML = `
                <label class="iconic iconic--radio">
                    <input type="radio" name="${rejectRadio.name}"
                      value="${reason.value}">
                    <i aria-hidden="true"></i>
                    <span class="iconic-label"
                      style="font-weight: bold;">${reason.label}</span>
                </label>
            `;

                        li.querySelector('input').addEventListener('click', () => {
                            const sX = window.scrollX;
                            const sY = window.scrollY;
                            rejectRadio.click();
                            setTimeout(() => {
                                const targetInput = message.querySelector(
                                    'input[name^="reason["], textarea[name^="reason["]'
                                );
                                if (targetInput && REJECTION_TEMPLATES[reason.key]) {
                                    targetInput.disabled = false;
                                    targetInput.readOnly = false;
                                    targetInput.value = REJECTION_TEMPLATES[reason.key];
                                    targetInput.dispatchEvent(
                                        new Event('input', {
                                            bubbles: true
                                        })
                                    );
                                }
                                window.scrollTo(sX, sY);
                            }, 50);
                        });

                        parentUl.appendChild(li);
                    });
                }
            }

            // --- ADD REJECT (AI) WITH GROUPING ---
            if (rejectRadio && !message.querySelector('.custom-ai-reject')) {
                const parentUl = rejectRadio.closest('ul.inputChoices');
                if (parentUl) {
                    const headerLi = document.createElement('li');
                    headerLi.style.cssText =
                        "margin-top: 12px; margin-bottom: 4px; padding-left: 5px;";
                    headerLi.innerHTML = `
                <div style="font-weight: bold; font-size: 10px;
                  text-transform: uppercase; color: #aaa;
                  letter-spacing: 0.5px;">Custom Rejections</div>
                <div style="width: 20px; border-bottom: 1.5px solid #666;
                  margin-top: 2px;"></div>
            `;
                    parentUl.appendChild(headerLi);

                    const aiLi = document.createElement('li');
                    aiLi.className = "inputChoices-choice custom-ai-reject";
                    aiLi.innerHTML = `
                <label class="iconic iconic--radio">
                    <input type="radio" name="${rejectRadio.name}"
                      value="reject_ai">
                    <i aria-hidden="true"></i>
                    <span class="iconic-label"
                      style="font-weight: bold;">Reject (AI)</span>
                </label>
            `;
                    parentUl.appendChild(aiLi);

                    aiLi.querySelector('input').addEventListener('click', () => {
                        const sX = window.scrollX;
                        const sY = window.scrollY;
                        rejectRadio.click();
                        setTimeout(() => {
                            if (rejectInput) {
                                rejectInput.disabled = false;
                                rejectInput.readOnly = false;
                                rejectInput.value = REJECTION_TEMPLATES.ai;
                                rejectInput.dispatchEvent(
                                    new Event('input', {
                                        bubbles: true
                                    })
                                );
                            }
                            window.scrollTo(sX, sY);
                        }, 50);
                    });
                }
            }

            // --- Ban Trigger ---
            if (isFemale) {
                const extraCell = message.querySelector('.message-cell--extra');
                if (extraCell && !extraCell.querySelector('.foid-ban-btn')) {
                    const userLink = message.querySelector(
                        '.message-userDetails a.username'
                    );
                    if (userLink) {
                        const profilePath = userLink.getAttribute('href');
                        const btn = document.createElement('button');
                        btn.type = "button";
                        btn.textContent = "Ban";
                        btn.className = "foid-ban-btn";
                        btn.style.cssText =
                            "margin-top: 8px; background: #701010; color: #fff; " +
                            "font-weight: bold; border-radius: 4px; border: 1px " +
                            "solid #400; padding: 6px 10px; cursor: pointer;";
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();

                            localStorage.setItem('foidBanTrigger', "1");
                            localStorage.setItem('foidCustomTitleTrigger', "1");

                            const warnIframe = document.createElement('iframe');
                            warnIframe.style.display = 'none';
                            warnIframe.src = profilePath + 'warn';
                            document.body.appendChild(warnIframe);
                            setTimeout(() => warnIframe.remove(), 15000);

                            const editIframe = document.createElement('iframe');
                            editIframe.style.display = 'none';
                            editIframe.src = profilePath + 'edit';
                            document.body.appendChild(editIframe);
                            setTimeout(() => editIframe.remove(), 15000);
                        });
                        extraCell.appendChild(btn);
                    }
                }
            }
            // --- Highlighting ---
            if (isFemale) {
                highlightColor = "rgba(255,182,193,0.2)";
                boxShadowColor = "rgba(255,105,180,0.25)";
            } else if (isVpnProxy) {
                highlightColor = "rgba(135,206,250,0.15)";
                boxShadowColor = "rgba(30,144,255,0.2)";
            } else if (isTooShort) {
                highlightColor = "rgba(255,99,71,0.15)";
                boxShadowColor = "rgba(255,69,0,0.2)";
            } else if (isAlt) {
                highlightColor = "rgba(255,255,102,0.15)";
                boxShadowColor = "rgba(255,255,0,0.2)";
            }

            if (labels.length === 0) labels.push("NORMAL");
            messagesMap.set(message, labels);

            const cells = message.querySelectorAll('.message-cell');
            cells.forEach(cell => {
                if (highlightColor) {
                    cell.style.backgroundColor = highlightColor;
                    cell.style.boxShadow = `0 0 8px 2px ${boxShadowColor}`;
                    cell.style.borderRadius = "6px";
                }
            });

            if (highlightColor) {
                message.style.margin = "8px 0";
                message.style.border = "1px solid rgba(0,0,0,0.1)";
                message.style.borderRadius = "8px";
            }

            if (listPlain) {
                const logItems = listPlain.querySelectorAll('li');
                logItems.forEach(li => {
                    const usernameLink = li.querySelector('a[href*="/members/"]');
                    if (usernameLink) {
                        usernameLink.style.color = "#bfa900";
                        usernameLink.style.textDecoration = "underline";
                    }
                    const rejectedMatch = li.textContent.match(
                        /Shared IP with rejected users\s*\(([^)]+)\)/i
                    );
                    if (rejectedMatch) {
                        const users = rejectedMatch[1].split(',')
                            .map(u => u.trim());
                        li.innerHTML = 'Shared IP with rejected users: ' + users.map(u => {
                            const url = "https://looksmax.org/moderatorpanel" +
                                "/recent-registered" +
                                `/?username=${encodeURIComponent(u)}`;
                            return `<a href="${url}" target="_blank"
                style="color:#bfa900; text-decoration:underline;">${u}</a>`;
                        }).join(', ');
                    }
                });
            }

            // --- Alt Accounts Display ---
            if (isAlt && !message.dataset.altChecked) {
                message.dataset.altChecked = "1";
                const altProfileUrl = getAltProfileUrlFromLog(message);
                if (altProfileUrl) {
                    const accounts = await fetchAltAccounts(altProfileUrl);
                    renderAltAccounts(message, accounts, applicantProfileUrl);
                }
            }
        }
    }

    document.addEventListener('DOMContentLoaded', highlightApplications);
    const observer = new MutationObserver(highlightApplications);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    // --- Custom Title Trigger Logic ---
    (function() {
        if (!location.href.includes('/members/') ||
            !location.href.includes('/edit')) {
            return;
        }

        const trigger = localStorage.getItem('foidCustomTitleTrigger');
        if (!trigger) return;
        localStorage.removeItem('foidCustomTitleTrigger');

        const TITLE_DELAY_MS = 1000;
        const SAVE_DELAY_MS = 500;

        const wait = sel => new Promise(r => {
            const i = setInterval(() => {
                const el = document.querySelector(sel);
                if (el) {
                    clearInterval(i);
                    r(el);
                }
            }, 200);
        });

        (async () => {
            const input = await wait('input[name="user[custom_title]"]');
            setTimeout(async () => {
                input.value = "F-Banned";
                input.dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                input.dispatchEvent(new Event('change', {
                    bubbles: true
                }));

                setTimeout(async () => {
                    const saveBtn = await wait(
                        '.formSubmitRow-controls button[type="submit"]'
                    );
                    saveBtn.click();
                }, SAVE_DELAY_MS);
            }, TITLE_DELAY_MS);
        })();
    })();

    // --- Ban Trigger Logic ---
    (function() {
        if (!location.href.includes('/warn')) return;
        const trigger = localStorage.getItem('foidBanTrigger');
        if (!trigger) return;
        localStorage.removeItem('foidBanTrigger');
        const wait = sel => new Promise(r => {
            const i = setInterval(() => {
                const el = document.querySelector(sel);
                if (el) {
                    clearInterval(i);
                    r(el);
                }
            }, 200);
        });
        (async () => {
            (await wait('input[name="warning_definition_id"][value="14"]')).click();
            const notes = await wait('textarea[name="notes"]');
            notes.value = "Foid";
            notes.dispatchEvent(new Event('input', {
                bubbles: true
            }));
            setTimeout(async () => {
                (await wait('.formSubmitRow-controls button[type="submit"]')).click();
            }, 400);
        })();
    })();
})();