// ==UserScript==
// @name         Swagger UI: Extract Endpoint JSON
// @namespace    https://github.com/Yipyipyip/swagger-json-extractor
// @version      1.3
// @description  Adds a button to Swagger UI to copy endpoint JSON. Ideal for LLMs: extracts only the needed context (schemas, refs) for a specific endpoint, saving tokens and reducing noise compared to the full spec.
// @author       Michael Tannenbaum
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @match        *://*/*docs*
// @match        *://*/*api*
// @include      *swagger*
// @include      *openapi*
// @icon         https://static1.smartbear.co/swagger/media/assets/swagger_fav.png
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-end
// @supportURL   https://github.com/Yipyipyip/swagger-json-extractor/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561776/Swagger%20UI%3A%20Extract%20Endpoint%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/561776/Swagger%20UI%3A%20Extract%20Endpoint%20JSON.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let GLOBAL_SPEC = null;
    let SPEC_URL = null;

    // --- 1. SETUP & SPEC LOADING ---

    const initInterval = setInterval(async () => {
        const uiContainer = document.querySelector('.swagger-ui');
        if (uiContainer) {
            clearInterval(initInterval);
            await loadSpec();
            startObserver(uiContainer);
        }
    }, 500);

    async function loadSpec() {
        // Strategy 1: window.ui
        try {
            const uiObj = unsafeWindow.ui || window.ui;
            if (uiObj?.specSelectors?.specJson) {
                let spec = uiObj.specSelectors.specJson();
                if (typeof spec.toJS === 'function') spec = spec.toJS();
                if (spec.paths) {
                    GLOBAL_SPEC = spec;
                    return;
                }
            }
        } catch (e) { }

        // Strategy 2: Script Tags (FastAPI specific)
        if (!SPEC_URL) {
            const scripts = document.getElementsByTagName('script');
            for (let script of scripts) {
                const content = script.innerText || script.textContent;
                const match = content.match(/url:\s*['"]([^'"]+\.json)['"]/);
                if (match && match[1]) {
                    SPEC_URL = match[1];
                    break;
                }
            }
        }

        // Strategy 3: Header Link
        if (!SPEC_URL) {
            const link = document.querySelector('a[href$=".json"]');
            if (link) SPEC_URL = link.getAttribute('href');
        }

        // Strategy 4: Guess
        if (!SPEC_URL) {
            SPEC_URL = window.location.pathname.replace(/\/docs.*/, '') + "/openapi.json";
        }

        // Fetch
        if (SPEC_URL && !GLOBAL_SPEC) {
            try {
                const res = await fetch(SPEC_URL);
                if (res.ok) GLOBAL_SPEC = await res.json();
            } catch (err) {
                console.error("Swagger Extractor: Fetch failed", err);
            }
        }
    }

    // --- 2. OBSERVER ---

    function startObserver(targetNode) {
        // We observe the DOM. When 'opblock-body' appears, we inject immediately.
        const observer = new MutationObserver((mutations) => {
            let shouldInject = false;
            for (const m of mutations) {
                if (m.addedNodes.length > 0) {
                    shouldInject = true;
                    break;
                }
            }
            if (shouldInject) {
                // Use requestAnimationFrame to ensure the paint is ready, but it's visually instant
                requestAnimationFrame(injectButtons);
            }
        });

        observer.observe(targetNode, { childList: true, subtree: true });
        injectButtons(); // Initial run
    }

    // --- 3. INJECTION ---

    function injectButtons() {
        if (!GLOBAL_SPEC) return;

        // Only look at open blocks that don't have our button yet
        const openBlocks = document.querySelectorAll('.opblock.is-open');

        openBlocks.forEach(block => {
            if (block.querySelector('.tm-json-copy-btn')) return;

            // We want to place it in the ".try-out" container
            const tryOutWrapper = block.querySelector('.try-out');

            if (tryOutWrapper) {
                // Find the existing "Try it out" button to copy its style
                const existingBtn = tryOutWrapper.querySelector('button');

                const myBtn = document.createElement('button');
                myBtn.className = 'tm-json-copy-btn'; // Marker class

                // COPY CLASSES: This ensures it looks EXACTLY like the other button
                if (existingBtn) {
                    // Copy all classes from the neighbor (e.g. "btn try-out__btn")
                    myBtn.className += ' ' + existingBtn.className;
                } else {
                    // Fallback style if no button exists
                    myBtn.className += ' btn';
                    myBtn.style.border = '1px solid #555';
                    myBtn.style.marginRight = '10px';
                }

                // Custom override styles to separate it slightly
                myBtn.style.marginRight = '10px';
                myBtn.innerText = "Copy OpenAPI JSON";

                // Tooltip
                myBtn.title = "Extract full JSON definition for this endpoint";

                // Click Handler
                myBtn.onclick = (e) => {
                    e.stopPropagation(); // Stop bubbling
                    e.stopImmediatePropagation(); // Stop other listeners
                    e.preventDefault(); // Stop form submit
                    extractData(block, myBtn);
                };

                // Insert BEFORE the "Try it out" button
                tryOutWrapper.insertBefore(myBtn, tryOutWrapper.firstChild);
            }
        });
    }

    // --- 4. EXTRACTION LOGIC ---

    function extractData(block, btn) {
        try {
            const summary = block.querySelector('.opblock-summary');
            const pathEl = summary.querySelector('.opblock-summary-path');
            const methodEl = summary.querySelector('.opblock-summary-method');

            let path = pathEl ? pathEl.getAttribute('data-path') : null;
            let method = methodEl ? methodEl.innerText.trim().toLowerCase() : null;

            if (!path && pathEl) {
                const link = pathEl.querySelector('a');
                path = link ? link.innerText.trim() : pathEl.innerText.trim();
                path = path.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
            }

            if (!path || !method || !GLOBAL_SPEC.paths[path] || !GLOBAL_SPEC.paths[path][method]) {
                // Flash Error
                const oldText = btn.innerText;
                btn.innerText = "Error: Not Found";
                btn.style.color = "red";
                setTimeout(() => { btn.innerText = oldText; btn.style.color = ""; }, 2000);
                return;
            }

            const endpointDef = GLOBAL_SPEC.paths[path][method];

            const result = {
                openapi: GLOBAL_SPEC.openapi || "3.0.0",
                info: GLOBAL_SPEC.info || {},
                paths: { [path]: { [method]: endpointDef } },
                components: {}
            };

            const buckets = { schemas: {}, responses: {}, parameters: {}, requestBodies: {}, securitySchemes: {} };
            const visited = new Set();

            if (endpointDef.security && GLOBAL_SPEC.components?.securitySchemes) {
                buckets.securitySchemes = GLOBAL_SPEC.components.securitySchemes;
            }

            crawlRefs(endpointDef, GLOBAL_SPEC, buckets, visited);

            Object.keys(buckets).forEach(k => {
                if (Object.keys(buckets[k]).length) result.components[k] = buckets[k];
            });

            GM_setClipboard(JSON.stringify(result, null, 2));

            // Success Animation
            const originalText = btn.innerText;
            btn.innerText = "Copied!";
            // Force a slight style change for feedback
            const prevColor = btn.style.color;
            btn.style.color = "#4caf50"; // Success Green

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.color = prevColor;
            }, 1500);

        } catch (e) {
            console.error(e);
            alert("Error: " + e.message);
        }
    }

    function crawlRefs(obj, root, buckets, visited) {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) { obj.forEach(x => crawlRefs(x, root, buckets, visited)); return; }
        for (let k in obj) {
            if (k === '$ref' && typeof obj[k] === 'string') resolve(obj[k], root, buckets, visited);
            else crawlRefs(obj[k], root, buckets, visited);
        }
    }

    function resolve(ref, root, buckets, visited) {
        if (visited.has(ref) || !ref.startsWith('#/')) return;
        visited.add(ref);
        const parts = ref.split('/');
        const section = parts[2];
        const name = parts.slice(3).join('/');
        let target = root;
        for (let i = 1; i < parts.length; i++) target = target && target[parts[i]];
        if (target) {
            if (!buckets[section]) buckets[section] = {};
            buckets[section][name] = target;
            crawlRefs(target, root, buckets, visited);
        }
    }

})();
