// ==UserScript==
// @name         arXiv Labs BibExplorer Fix
// @namespace    http://tampermonkey.net/
// @version      2025.09.03.5
// @description  Replace broken Bibliographic Explorer with Semantic Scholar Graph API (with icons, local API key config)
// @match        *://arxiv.org/abs/*
// @match        *://www.arxiv.org/abs/*
// @connect      api.semanticscholar.org
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548960/arXiv%20Labs%20BibExplorer%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/548960/arXiv%20Labs%20BibExplorer%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === API Key Config ===
    const KEY_STORAGE = "s2_api_key";
    let S2_API_KEY = localStorage.getItem(KEY_STORAGE);

    if (!S2_API_KEY) {
        S2_API_KEY = prompt("Enter your Semantic Scholar API key (will be stored locally):", "");
        if (S2_API_KEY) {
            localStorage.setItem(KEY_STORAGE, S2_API_KEY);
        } else {
            alert("⚠️ No API key set. The Bibliographic Explorer may not work without it.");
        }
    }

    // === Inject Academicons ===
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/academicons/1.9.4/css/academicons.min.css";
    document.head.appendChild(link);

    // === Custom CSS Adjustments ===
    const style = document.createElement("style");
    style.textContent = `
      .bib-col-header {
          margin: 1.2em 0 0.8em; /* space above and below */
      }
      .bib-authors a {
          color: rgb(61, 150, 255) !important;
      }
      .bib-outbound a {
          margin-right: 0.4em;
          font-size: 1.2em;
      }
      .bib-outbound a .ai {
          vertical-align: middle;
      }
      .bib-outbound a span {
          display: none; /* hide text labels, show only icons */
      }
    `;
    document.head.appendChild(style);

    // === Helpers ===
    function getArxivId() {
        const match = window.location.pathname.match(/\/abs\/(\d+\.\d+.*)/);
        return match ? match[1] : null;
    }

    function paperHTML(p) {
        const title = p.title || "Untitled";
        const year = p.year || "";
        const authors = (p.authors || []).map(a =>
            a.authorId
                ? `<a class="author" href="https://www.semanticscholar.org/author/${a.authorId}" target="_blank">${a.name}</a>`
                : `<span class="author nolink">${a.name}</span>`
        ).join(" ");

        let links = "";
        if (p.externalIds?.ArXiv) {
            links += `<a href="https://arxiv.org/abs/${p.externalIds.ArXiv}" target="_blank" title="View on arXiv"><i class="ai ai-arxiv"></i><span>arXiv</span></a>`;
        }
        if (p.paperId) {
            links += `<a href="https://www.semanticscholar.org/paper/${p.paperId}" target="_blank" title="View on Semantic Scholar"><i class="ai ai-semantic-scholar"></i><span>Semantic Scholar</span></a>`;
        }
        if (p.title) {
            const gsUrl = "https://scholar.google.com/scholar_lookup?title=" + encodeURIComponent(p.title);
            links += `<a href="${gsUrl}" target="_blank" title="Search on Google Scholar"><i class="ai ai-google-scholar"></i><span>Google Scholar</span></a>`;
        }

        return `
            <div class="bib-paper-container">
              <div class="bib-paper-overhang">
                <div class="bib-paper">
                  <div class="bib-col-title">
                    ${p.paperId
                        ? `<a href="https://www.semanticscholar.org/paper/${p.paperId}" target="_blank">${title}</a>`
                        : `<span>${title}</span>`}
                  </div>
                  <div class="bib-authors">${authors}</div>
                  <div class="jinfo">
                    <span class="year">${year}</span>
                  </div>
                  <div class="bib-outbound">${links}</div>
                </div>
              </div>
            </div>
        `;
    }

    function renderData(container, data) {
        const citations = data.citations ?? [];
        const references = data.references ?? [];

        container.innerHTML = `
          <div class="bib-col2">
            <div class="bib-col">
              <h2 class="bib-col-header">Citations (${data.citationCount ?? citations.length})</h2>
              ${citations.length ? citations.map(paperHTML).join("") : "<p><em>None found.</em></p>"}
            </div>
            <div class="bib-col-divider"></div>
            <div class="bib-col">
              <h2 class="bib-col-header">References (${data.referenceCount ?? references.length})</h2>
              ${references.length ? references.map(paperHTML).join("") : "<p><em>None found.</em></p>"}
            </div>
          </div>
        `;
    }

    function fetchAndReplace(container) {
        const arxivId = getArxivId();
        if (!arxivId) return;

        container.innerHTML = `<div class="center"><em>Loading from Semantic Scholar…</em></div>`;

        const fields = [
            "title", "year", "authors",
            "externalIds", "paperId",
            "citationCount", "referenceCount",
            "citations.title", "citations.year", "citations.authors", "citations.externalIds", "citations.paperId",
            "references.title", "references.year", "references.authors", "references.externalIds", "references.paperId"
        ].join(",");

        const url = `https://api.semanticscholar.org/graph/v1/paper/arXiv:${arxivId}?fields=${fields}`;
        console.log("[BibExplorer] Fetching:", url);

        GM_xmlhttpRequest({
            method: "GET",
            url,
            headers: {
                "x-api-key": S2_API_KEY,
                "Content-Type": "application/json"
            },
            onload: (resp) => {
                console.log("[BibExplorer] Response status:", resp.status);
                if (resp.status >= 200 && resp.status < 300) {
                    try {
                        const json = JSON.parse(resp.responseText);
                        console.log("[BibExplorer] Response JSON:", json);
                        renderData(container, json);
                    } catch (e) {
                        console.error("[BibExplorer] JSON parse error:", e, resp.responseText);
                        container.innerHTML = `<p><em>Invalid JSON response.</em></p>`;
                    }
                } else {
                    console.error("[BibExplorer] API error", resp.status, resp.responseText);
                    container.innerHTML = `<p><em>API error (${resp.status}). See console for details.</em></p>`;
                }
            },
            onerror: (err) => {
                console.error("[BibExplorer] Network error", err);
                container.innerHTML = `<p><em>Failed to contact Semantic Scholar API.</em></p>`;
            }
        });
    }

    function observeBibMain() {
        const observer = new MutationObserver(() => {
            const container = document.querySelector("#bib-main");
            if (container) {
                observer.disconnect();
                fetchAndReplace(container);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeBibMain();
})();
