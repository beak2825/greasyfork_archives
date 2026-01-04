// ==UserScript==
// @name         Translation Helper
// @namespace    https://github.com/NBKelly/jinteki-translation-helper
// @version      2025-10-15
// @description  Make translating stuff via i18n easier for the user
// @author       nbkelly
// @match        *://localhost/*
// @match        *://127.0.0.1/*
// @match        *://*.jinteki.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinteki.net
// @license      Apache 2.0
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552721/Translation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/552721/Translation%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const selector = "[data-i18n-key]:not([data-i18n-success])";
    const HIGHLIGHT_COLOR = "magenta";
    const LABEL_BG = "rgba(255, 0, 255, 0.15)";
    const highlighted = new WeakSet();

    function highlightElements(root = document) {
        const elements = root.querySelectorAll(selector);
        for (const el of elements) {
            if (highlighted.has(el)) continue;
            highlighted.add(el);

            const key = el.getAttribute("data-i18n-key");

            // highlight
            el.style.outline = `2px solid ${HIGHLIGHT_COLOR}`;
            el.style.outlineOffset = "2px";
        }
    }

    // Initial run
    const init = () => highlightElements();
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // React to DOM changes
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.type === "childList") {
                for (const node of m.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        highlightElements(node);
                    }
                }
            } else if (m.type === "attributes" &&
                       (m.attributeName === "data-i18n-key" ||
                        m.attributeName === "data-i18n-success")) {
                if (m.target.matches("[data-i18n-key]:not([data-i18n-success])")) {
                    highlightElements(m.target);
                } else {
                    if (highlighted.has(m.target)) {
                        m.target.style.outline = "";
                        highlighted.delete(m.target);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-i18n-key", "data-i18n-success"],
    });

    function getI18nData(el) {
        const key = el.getAttribute("data-i18n-key");
        const variables = {};

        // Collect all data-i18n-param-* attributes
        for (const attr of el.attributes) {
            if (attr.name.startsWith("data-i18n-param-")) {
                const varName = attr.name.slice("data-i18n-param-".length);
                variables[varName] = attr.value;
            }
        }

        return { key, variables };
    }

    // note: I actually have no clue what the hell this does, but it appears to work.
    function encodePlaygroundState(obj) {
        const jsonStr = JSON.stringify(obj);
        const utf8Bytes = new TextEncoder().encode(jsonStr);
        let binary = "";
        utf8Bytes.forEach(b => binary += String.fromCharCode(b));
        let b64 = btoa(binary);
        b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return b64;
    }

    let enMessages = {};

    document.addEventListener("click", e => {
        if (!e.altKey) return; // only on Alt+Click
        const el = e.target.closest(selector);
        if (!el) return;

        e.preventDefault();
        e.stopPropagation();

        const {key, variables } = getI18nData(el);

        // Look up English message
        let englishComment = "";
        if (enMessages[key]) {
            let cmt = enMessages[key].split("\n").map(line => `# ${line}`).join("\n");
            englishComment = `# English reference: ${cmt}\n`;
        }

        const state = {
            messages: `${englishComment}${key} = `,
            variables,
            setup: {
                visible: ["messages", "output", "config"],
                locale: "en-US",
                dir: "ltr"
            }
        };

        const encoded = encodePlaygroundState(state);
        const url = `https://projectfluent.org/play/?s=${encoded}`;
        window.open(url, "_blank");
    });

    function parseFTL(ftlText) {
        const messages = {};
        const lines = ftlText.split("\n");

        let currentKey = null;
        let currentValue = [];

        for (let line of lines) {
            const trimmed = line.trimEnd();

            // Skip empty lines
            if (!trimmed) continue;

            // Skip full-line comments
            if (/^\s*#/.test(trimmed)) continue;

            // Top-level key match
            const topLevelMatch = trimmed.match(/^([^\s=]+)\s*=\s*(.*)$/);
            if (topLevelMatch) {
                // Save previous message
                if (currentKey) {
                    messages[currentKey] = currentValue.join("\n");
                }

                currentKey = topLevelMatch[1];
                currentValue = [topLevelMatch[2]];
            } else if (currentKey) {
                // Continuation line (indented)
                currentValue.push(trimmed);
            }
        }

        // Save last message
        if (currentKey) {
            messages[currentKey] = currentValue.join("\n");
        }

        return messages;
    }

    async function loadEnglishFTL() {
        try {
            const host = window.location.hostname;
            let ftlUrl;
            if (host === "localhost" || host === "127.0.0.1") {
                ftlUrl = "http://localhost:1042/i18n/en.ftl";
            } else {
                ftlUrl = "https://jinteki.net/i18n/en.ftl";
            }
            console.log("Fetching English FTL...");
            const resp = await fetch(ftlUrl);
            const text = await resp.text();
            enMessages = parseFTL(text);
        } catch (err) {
            console.error("Failed to fetch English FTL", err);
        }
    }

    loadEnglishFTL();
}) ();
