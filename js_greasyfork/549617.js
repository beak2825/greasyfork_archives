// ==UserScript==
// @name         ADC rules and data elements details
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rule and data elements details in Adobe Launch
// @match        https://experience.adobe.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549617/ADC%20rules%20and%20data%20elements%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/549617/ADC%20rules%20and%20data%20elements%20details.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.__spaLoggerStarted) {
        window.__spaLoggerStarted = true;

        setTimeout(() => {

            window.visitedUrls = window.visitedUrls || [];
            let latestRules = [];
            let renderScheduled = false;
            let fetchHooked = false;
            let currentPage = location.href;

            function logHola() {
                currentPage = location.href;
                window.visitedUrls.push(currentPage);
                if (currentPage.includes("/rules/") || currentPage.includes("/dataElements/")) {
                    hookFetchOnce();
                } else {
                    let panel = document.querySelector("#rule-status-panel");
                    if (panel) {
                        panel.remove();
                    }
                }
            }

            function renderBoxes() {
                const breadcrumbs = document.querySelector("ul.u-flex.u-flexOne.spectrum-Breadcrumbs");
                if (!breadcrumbs) {
                    return;
                }

                let panel = document.querySelector("#rule-status-panel");
                if (!panel) {
                    panel = document.createElement("div");
                    panel.id = "rule-status-panel";
                    panel.style.marginLeft = "20px";
                    panel.style.minWidth = "300px";
                    panel.style.maxHeight = "80vh";
                    panel.style.overflowY = "auto";
                    panel.style.border = "1px solid #ccc";
                    panel.style.borderRadius = "8px";
                    panel.style.padding = "10px";
                    panel.style.fontFamily = "sans-serif";
                    panel.style.fontSize = "13px";
                    breadcrumbs.appendChild(panel);
                }

                panel.querySelectorAll(".rule-status-box").forEach(el => el.remove());

                latestRules.forEach(ruleObj => {
                    const { name, revisions } = ruleObj;
                    if (!revisions.length) return;
                    const latestRev = revisions.reduce((a, b) => (a.revision_number > b.revision_number ? a : b));
                    let color = "#E13D3D";
                    let statusText = `❌ Never published`;

                    if (latestRev.published) {
                        color = "#ACD8AA";
                        statusText = `✅ Latest revision published (Rev ${latestRev.revision_number})`;
                    } else if (revisions.some(r => r.published)) {
                        const lastPublished = revisions
                        .filter(r => r.published)
                        .reduce((a, b) => (new Date(a.published_at) > new Date(b.published_at) ? a : b));
                        color = "#F9AD77";
                        statusText = `🟠 Previous revision published (Rev ${lastPublished.revision_number})`;
                    } else if (latestRev.included_in_libraries && latestRev.included_in_libraries.length > 0) {
                        color = "#3498db";
                        statusText = `🔵 Included in library but never published`;
                    }

                    const box = document.createElement("div");
                    box.className = "rule-status-box";
                    box.style.border = `1px solid ${color}`;
                    box.style.borderRadius = "8px";
                    box.style.padding = "6px 8px";
                    box.style.marginTop = "6px";
                    box.style.backgroundColor = color;
                    box.style.color = "black";
                    box.style.boxShadow = "0 1px 4px rgba(0,0,0,0.2)";

                    box.innerHTML = `
                        <strong>${name}</strong><br>
                        Total revisions: ${revisions.length}<br>
                        ${statusText}<br>
                    `;

                    panel.appendChild(box);
                });
            }

            function scheduleRender() {
                if (renderScheduled) return;
                renderScheduled = true;
                requestAnimationFrame(() => {
                    renderBoxes();
                    renderScheduled = false;
                });
            }

            function hookFetchOnce() {
                const origFetch = window.fetch;
                window.fetch = async function(...args) {
                    const pageAtFetch = currentPage;
                    const response = await origFetch.apply(this, args);
                    try {
                        if (args[0].includes("/rules/") && args[0].includes("/revisions?") && !args[0].includes("/libraries") && !args[0].includes("/notes") && !args[0].includes("/rule_components")) {
                            response.clone().json().then(data => {
                                if (!data.data) {
                                    return;
                                }

                                const rulesMap = new Map();
                                data.data.forEach(item => {
                                    const attr = item.attributes;
                                    if (attr.delegate_descriptor_id) return;
                                    if (attr.state) return;
                                    const key = "1";
                                    if (!rulesMap.has(key)) {
                                        rulesMap.set(key, { name: attr.name, revisions: [] });
                                    }
                                    rulesMap.get(key).revisions.push(attr);
                                });

                                latestRules = Array.from(rulesMap.values());
                                scheduleRender();
                            }).catch(err => console.error("[fetchHook] JSON parse error:", err));
                        }
                        if (args[0].includes("data_elements") && args[0].includes("/revisions?") && !args[0].includes("/libraries") && !args[0].includes("/notes") ){
                            response.clone().json().then(data => {
                                if (!data.data) {
                                    return;
                                }

                                const rulesMap = new Map();
                                data.data.forEach(item => {
                                    const attr = item.attributes;
                                    if (item.type !== "data_elements") return;
                                    const key = "1";
                                    if (!rulesMap.has(key)) {
                                        rulesMap.set(key, { name: attr.name, revisions: [] });
                                    }
                                    rulesMap.get(key).revisions.push(attr);
                                });

                                latestRules = Array.from(rulesMap.values());
                                scheduleRender();
                            }).catch(err => console.error("[fetchHook] JSON parse error:", err));
                        }
                    } catch (e) {
                        //console.error("[fetchHook] error:", e);
                    }
                    return response;
                };
            }

            logHola();
            window.addEventListener("hashchange", logHola);
            window.addEventListener("popstate", logHola);

            const origPushState = history.pushState;
            history.pushState = function(...args) {
                const ret = origPushState.apply(this, args);
                logHola();
                return ret;
            };

            const origReplaceState = history.replaceState;
            history.replaceState = function(...args) {
                const ret = origReplaceState.apply(this, args);
                logHola();
                return ret;
            };

        }, 500);
    }

})();
