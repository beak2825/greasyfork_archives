// ==UserScript==
// @name         XenForo – Application Tags & VPN/IP Check + Filter + API Status + IP Redirect2 (Auto-Reason)
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Marks application blocks, checks IPs, filters, and auto-fills rejection reasons for VPN/Short apps.
// @author       You
// @match        https://looksmax.org/approval-queue/*
// @match        https://looksmax.org/members/*/warn*
// @icon         https://www.google.com/s2/favicons?domain=looksmax.org
// @grant        GM_xmlhttpRequest
// @connect      proxycheck.io
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
        const ipMatch = ipText.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/);
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
                <li><span class="filterBar-filterToggle-label" style="font-weight:bold; margin-right:5px;">Custom Filters:</span></li>
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
    aAuto.addEventListener('click', e => {
        e.preventDefault();
        // Existing auto-select logic merely selects the radio,
        // the text filling is now handled in the main loop automatically.
        messagesMap.forEach((labels, message) => {
            if (labels.includes("FEMALE") || labels.includes("VPN") || labels.includes("TOO SHORT")) {
                const radioReject = message.querySelector('input[type="radio"][value="reject"]');
                if (radioReject) {
                    radioReject.checked = true;
                    radioReject.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });
    });
    liAuto.appendChild(aAuto);
    menuBody.appendChild(liAuto);

    function updateFilterCounts() {
        filters.forEach(f => {
            const count = [...messagesMap.values()].filter(labels => labels.includes(f)).length;
            const btn = [...menuBody.querySelectorAll('a')].find(b => b.dataset.tag === f);
            if (btn) btn.textContent = `${f} (${count})`;
        });
    }

    function updateFilterDisplay() {
        messagesMap.forEach((labels, message) => {
            if (activeFilters.size === 0) {
                message.style.display = "";
            } else {
                let show = false;
                if (activeFilters.has("NORMAL") && labels.includes("NORMAL")) show = true;
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
            const isVPN = data[ip] ? (data[ip].proxy === "yes" || data[ip].vpn === "yes") : false;
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

  async function highlightApplications() {
    const messages = document.querySelectorAll('.message');
    for (const message of messages) {
        let highlightColor = null;
        let boxShadowColor = null;
        const labels = [];

        const genderField = message.querySelector('dl[data-field="male_female"] dd');
        const reasonField = message.querySelector('dl[data-field="why_join"] dd');
        const dataCells = message.querySelectorAll('.dataList-cell');

        let isFemale = false;
        let isTooShort = false;
        let isAlt = false;
        let isVpnProxy = false;

        if (genderField && genderField.textContent.trim().toLowerCase() === "female") {
            isFemale = true;
            labels.push("FEMALE");
        }

        if (reasonField) {
            const wc = reasonField.textContent.trim().split(/\s+/).filter(w => w.length > 0).length;
            if (wc < 5) {
                isTooShort = true;
                labels.push("TOO SHORT");
            }
        }

        dataCells.forEach(cell => {
            if (/(Moderating|Multiple account|Rejected user)/i.test(cell.textContent)) {
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
                const match = ipText.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/);
                if (match) {
                    ip = ipText;
                    firstLink.href = `https://whatismyipaddress.com/ip/${ip}`;
                    firstLink.target = "_blank";

                    isVpnProxy = await checkVPN(ip);
                    if (isVpnProxy) {
                        labels.push("VPN");
                    }
                }
            }
        }

        // --- NEW LOGIC FOR FILLING REJECTION REASON ---
        // Find the radio button for reject and the text input
        const rejectRadio = message.querySelector('input[type="radio"][value="reject"]');
        // This selector looks for any input where the name starts with "reason[user]"
        const rejectInput = message.querySelector('input[name^="reason[user]"]');

        if (rejectRadio && rejectInput) {
            // Priority: VPN takes precedence over Too Short
            if (isVpnProxy) {
                rejectRadio.checked = true;
                // Dispatch change event so the UI knows it's clicked (enabling the text box)
                rejectRadio.dispatchEvent(new Event('change', { bubbles: true }));

                rejectInput.value = "Registrations made using VPNs are not allowed.";
                rejectInput.dispatchEvent(new Event('input', { bubbles: true }));

            } else if (isTooShort) {
                rejectRadio.checked = true;
                rejectRadio.dispatchEvent(new Event('change', { bubbles: true }));

                rejectInput.value = "We kindly ask that you submit a more detailed application.";
                rejectInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        // ----------------------------------------------

        if (isFemale) {
            const extraCell = message.querySelector('.message-cell--extra');
            if (extraCell && !extraCell.querySelector('.foid-ban-btn')) {

                const userLink = message.querySelector('.message-userDetails a.username');
                if (!userLink) return;

                const profilePath = userLink.getAttribute('href');

                const btn = document.createElement('button');
                btn.type = "button";
                btn.textContent = "Ban";
                btn.className = "foid-ban-btn";

                btn.style.marginTop = "8px";
                btn.style.background = "#701010";
                btn.style.color = "#fff";
                btn.style.fontWeight = "bold";
                btn.style.borderRadius = "4px";
                btn.style.border = "1px solid #400";
                btn.style.padding = "6px 10px";
                btn.style.cursor = "pointer";
                btn.style.boxShadow = "none";
                btn.style.backgroundImage = "none";

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    localStorage.setItem('foidBanTrigger', "1");

                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = profilePath + 'warn';

                    document.body.appendChild(iframe);
                    setTimeout(() => iframe.remove(), 15000);
                });

                extraCell.appendChild(btn);
            }
        }

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
        } else {
            highlightColor = "";
            boxShadowColor = "";
        }

        if (labels.length === 0) {
            labels.push("NORMAL");
        }
        messagesMap.set(message, labels);

        const cells = message.querySelectorAll('.message-cell');
        cells.forEach(cell => {
            if (highlightColor) {
                cell.style.backgroundColor = highlightColor;
                cell.style.boxShadow = `0 0 8px 2px ${boxShadowColor}`;
                cell.style.transition = "box-shadow 0.3s ease, background-color 0.3s ease";
                cell.style.borderRadius = "6px";
            } else {
                cell.style.backgroundColor = "";
                cell.style.boxShadow = "";
                cell.style.borderRadius = "";
            }
        });

        if (highlightColor) {
            message.style.margin = "8px 0";
            message.style.border = "1px solid rgba(0,0,0,0.1)";
            message.style.borderRadius = "8px";
        } else {
            message.style.margin = "";
            message.style.border = "";
            message.style.borderRadius = "";
        }

        if (listPlain) {
            const logItems = listPlain.querySelectorAll('li');
            logItems.forEach(li => {
                const usernameLink = li.querySelector('a[href*="/members/"]');
                if (usernameLink) {
                    usernameLink.style.color = "#bfa900";
                    usernameLink.style.textDecoration = "underline";
                    usernameLink.style.fontWeight = "normal";
                }

                const rejectedMatch = li.textContent.match(/Shared IP with rejected users\s*\(([^)]+)\)/i);
                if (rejectedMatch) {
                    const usersStr = rejectedMatch[1];
                    const users = usersStr.split(',').map(u => u.trim());
                    li.innerHTML = 'Shared IP with rejected users: ' + users.map(u => {
                        const url = `https://looksmax.org/moderatorpanel/recent-registered/?username=${encodeURIComponent(u)}`;
                        return `<a href="${url}" target="_blank" style="color:#bfa900; text-decoration:underline;">${u}</a>`;
                    }).join(', ');
                }
            });
        }
    }
  }

  document.addEventListener('DOMContentLoaded', highlightApplications);
  const observer = new MutationObserver(highlightApplications);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // --- Ban Trigger Logic ---
  (function () {
    if (!location.href.includes('/warn')) return;

    const trigger = localStorage.getItem('foidBanTrigger');
    if (!trigger) return;
    localStorage.removeItem('foidBanTrigger');

    const wait = sel => new Promise(r => {
        const i = setInterval(() => {
            const el = document.querySelector(sel);
            if (el) { clearInterval(i); r(el); }
        }, 200);
    });

    (async () => {
        (await wait('input[name="warning_definition_id"][value="14"]')).click();

        const notes = await wait('textarea[name="notes"]');
        notes.value = "Foid";
        notes.dispatchEvent(new Event('input', { bubbles: true }));

        setTimeout(async () => {
            (await wait('.formSubmitRow-controls button[type="submit"]')).click();
        }, 400);
    })();
  })();
})();