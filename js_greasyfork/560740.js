// ==UserScript==
// @name         Google Scholar - PDF Auto-Finder
// @version      1.2
// @author       Bui Quoc Dung
// @match        https://scholar.google.com/scholar_labs/search*
// @match        https://scholar.google.com/scholar?*
// @grant        GM.xmlHttpRequest
// @connect      *
// @namespace ScholarToPDF
// @description Automatically extracts free PDFs from Sci-Hub, Sci-Net, Semantic Scholar, and Unpaywall.
// @downloadURL https://update.greasyfork.org/scripts/560740/Google%20Scholar%20-%20PDF%20Auto-Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/560740/Google%20Scholar%20-%20PDF%20Auto-Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIGS = {
        LABS: {
            article_container: ".gs_as_r",
            title_element: ".gs_rt a",
            pdf_link: ".gs_or_ggsm"
        },
        STANDARD: {
            article_container: ".gs_r.gs_or.gs_scl",
            title_element: ".gs_rt a",
            pdf_link: ".gs_or_ggsm"
        }
    };

    const isLabs = window.location.pathname.includes('scholar_labs');
    const CONF = isLabs ? CONFIGS.LABS : CONFIGS.STANDARD;
    const DOI_REGEX = /\b(10\.\d{4,}(?:\.\d+)*\/(?:(?!["&'<>])\S)+)\b/gi;

    function httpRequest(details) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({ ...details, onload: resolve, onerror: reject });
        });
    }

    async function titleToDOI(title) {
        try {
            const url = `https://api.crossref.org/works?query.title=${encodeURIComponent(title.trim())}&rows=1`;
            const response = await httpRequest({ method: 'GET', url });
            return JSON.parse(response.responseText).message.items?.[0]?.DOI || null;
        } catch (e) { return null; }
    }

    async function fetchDOI(titleLink) {
        const url = titleLink.href;
        const match = url.match(DOI_REGEX);
        if (match) return match[0].trim();
        try {
            const response = await httpRequest({ method: 'GET', url });
            const doiMatch = response.responseText.match(DOI_REGEX);
            return doiMatch ? doiMatch[0].trim() : await titleToDOI(titleLink.textContent);
        } catch (e) { return await titleToDOI(titleLink.textContent); }
    }

    function insertPdfLink(container, provider, pdfUrl) {
        container.innerHTML = '';
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.target = '_blank';
        a.innerHTML = `<span class="gs_ctg2">[PDF]</span> ${provider}`;
        container.appendChild(a);
    }

    async function searchSciHub(doi) {
        try {
            const gateway = 'https://tesble.com/' + doi;
            const res = await httpRequest({ method: 'GET', url: gateway });
            const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
            const embed = doc.querySelector('embed#pdf') || doc.querySelector('iframe#pdf');
            return embed?.src || (/iframe|embed|pdf/.test(res.responseText) ? gateway : null);
        } catch (e) { return null; }
    }

    async function searchSciNet(doi) {
        try {
            const gateway = 'https://sci-net.xyz/' + doi;
            const res = await httpRequest({ method: 'GET', url: gateway });
            const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
            const iframe = doc.querySelector('.pdf iframe');
            if (iframe?.src) {
                return iframe.src.startsWith('//') ? 'https:' + iframe.src : iframe.src;
            }
            return /iframe|pdf|embed/.test(res.responseText) ? gateway : null;
        } catch (e) { return null; }
    }

    async function searchSemantic(doi) {
        try {
            const res = await httpRequest({ method: 'GET', url: `https://api.semanticscholar.org/graph/v1/paper/DOI:${doi}?fields=openAccessPdf` });
            return JSON.parse(res.responseText)?.openAccessPdf?.url || null;
        } catch (e) { return null; }
    }

    async function searchUnpaywall(doi) {
        try {
            const res = await httpRequest({ method: 'GET', url: `https://api.unpaywall.org/v2/${doi}?email=support@unpaywall.org` });
            const data = JSON.parse(res.responseText);
            return (data?.is_oa && data.best_oa_location?.url) ? data.best_oa_location.url : null;
        } catch (e) { return null; }
    }

    async function processElement(el) {
        if (el.querySelector(`${CONF.pdf_link} span.gs_ctg2`)) return;

        const titleLink = el.querySelector(CONF.title_element);
        if (!titleLink) return;

        let container = el.querySelector(CONF.pdf_link);
        if (!container) {
            const wrapper = document.createElement('div');
            wrapper.className = 'gs_ggs gs_fl';
            wrapper.innerHTML = '<div class="gs_ggsd"><div class="gs_or_ggsm"></div></div>';
            el.insertBefore(wrapper, el.firstChild);
            container = wrapper.querySelector('.gs_or_ggsm');
        }

        if (container.dataset.done) return;
        container.dataset.done = "true";

        const doi = await fetchDOI(titleLink);
        if (!doi) return;

        const providers = [
            { name: 'scihub', fn: searchSciHub },
            { name: 'scinet', fn: searchSciNet },
            { name: 'semantic', fn: searchSemantic },
            { name: 'unpaywall', fn: searchUnpaywall }
        ];

        for (const p of providers) {
            const url = await p.fn(doi);
            if (url) {
                insertPdfLink(container, p.name, url);
                break;
            }
        }
    }

    function init() {
        document.querySelectorAll(CONF.article_container).forEach(processElement);
    }

    init();
    new MutationObserver(init).observe(document.body, { childList: true, subtree: true });
})();