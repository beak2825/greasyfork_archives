// ==UserScript==
// @name         Google Scholar - PDF Auto-Rename & Download All
// @namespace    http://greasyfork.org/
// @version      1.8
// @description  Adds a "Download All" button to Scholar Labs, renames PDFs based on titles when you click to download URLs
// @author       Bui Quoc Dung
// @match        https://scholar.google.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/559303/Google%20Scholar%20-%20PDF%20Auto-Rename%20%20Download%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/559303/Google%20Scholar%20-%20PDF%20Auto-Rename%20%20Download%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIGS = {
        LABS: { article_container: ".gs_as_r", title_element: ".gs_rt a", pdf_link: ".gs_or_ggsm a", group_container: ".gs_as_cp_tc" },
        STANDARD: { article_container: ".gs_r.gs_or.gs_scl", title_element: ".gs_rt a", pdf_link: ".gs_or_ggsm a", group_container: "#gs_res_ccl_mid" }
    };

    const current_config = window.location.href.includes("scholar_labs") ? CONFIGS.LABS : CONFIGS.STANDARD;
    let isUpdating = false;


    const COPY_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="#70757a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
    const SUCCESS_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="#2db742" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

    async function findPdfInPage(pageUrl) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET", url: pageUrl, timeout: 6000,
                onload: (response) => {
                    if (response.status >= 400) return resolve(null);
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    const metaSelectors = ['meta[name="citation_pdf_url"]', 'meta[property="og:url"]', 'meta[name="dc.Identifier"]'];
                    for (let s of metaSelectors) {
                        const m = doc.querySelector(s);
                        const content = m ? m.getAttribute('content') : null;
                        if (content && content.toLowerCase().includes('pdf')) return resolve(new URL(content, pageUrl).href);
                    }
                    const pdfLink = Array.from(doc.querySelectorAll('a[href]')).find(a => a.getAttribute('href').toLowerCase().includes('pdf'));
                    resolve(pdfLink ? new URL(pdfLink.getAttribute('href'), pageUrl).href : null);
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null)
            });
        });
    }

    async function checkIsPDF(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "HEAD", url: url, timeout: 3500,
                onload: (r) => {
                    const h = (r.responseHeaders || "").toLowerCase();
                    const isHtml = h.includes("text/html");
                    const isPdfType = h.includes("application/pdf");
                    const size = parseInt(h.match(/content-length:\s*(\d+)/)?.[1] || 0, 10);
                    const MIN_SIZE = 50 * 1024;
                    if (r.status === 403 || isHtml) return resolve(false);
                    if (isPdfType) {
                        if (size > 0 && size < MIN_SIZE) return resolve(false);
                        return resolve(true);
                    }
                    const lowerUrl = url.toLowerCase().split(/[?#]/)[0];
                    if (lowerUrl.includes('pdf')) {
                        if (size < MIN_SIZE) return resolve(false);
                        return resolve(true);
                    }
                    resolve(false);
                },
                onerror: () => resolve(false),
                ontimeout: () => resolve(false)
            });
        });
    }

    async function processLink(link) {
        const articleBox = link.closest(current_config.article_container);
        if (!articleBox) return;

        const container = link.closest(".gs_or_ggsm");
        if (container) {
            container.querySelectorAll("a").forEach(item => {
                if (item !== link && (item.innerText.includes("Full View") || item.href.includes("output=instlink"))) item.remove();
            });
        }

        if (articleBox.dataset.lockedPdfUrl) {
            link.href = articleBox.dataset.lockedPdfUrl;
            link.dataset.isRealPdf = articleBox.dataset.isRealPdf;
            link.dataset.pdfChecked = "done";
            if (!link.innerHTML.includes("Downloading")) {
                link.innerHTML = articleBox.dataset.originalLabel;
                if (link.dataset.isRealPdf === "false") {
                     link.style.color = (link.dataset.clickState === "1") ? "orange" : "green";
                } else {
                     link.style.color = "";
                }
            }
            return;
        }

        if (link.dataset.pdfChecked === "done" || link.dataset.pdfChecked === "processing") return;
        if (!articleBox.dataset.originalLabel) articleBox.dataset.originalLabel = link.innerHTML;

        link.dataset.pdfChecked = "processing";
        let isPDF = await checkIsPDF(link.href);

        if (!isPDF) {
            const deeperUrl = await findPdfInPage(link.href);
            if (deeperUrl) {
                const isDeeperPdf = await checkIsPDF(deeperUrl);
                if (isDeeperPdf) {
                    link.href = deeperUrl;
                    isPDF = true;
                }
            }
        }

        link.dataset.isRealPdf = isPDF ? "true" : "false";
        link.style.color = isPDF ? "" : "green";
        link.innerHTML = articleBox.dataset.originalLabel;
        articleBox.dataset.lockedPdfUrl = link.href;
        articleBox.dataset.isRealPdf = link.dataset.isRealPdf;
        link.dataset.pdfChecked = "done";
    }

    async function startDownload(url, fileName, linkElement) {
        const articleBox = linkElement.closest(current_config.article_container);
        const originalLabel = articleBox.dataset.originalLabel;

        linkElement.innerHTML = "Downloading...";
        GM_download({
            url: url, name: fileName, saveAs: false,
            onload: () => { linkElement.innerHTML = originalLabel; },
            onerror: () => {
                window.open(url, '_blank');
                linkElement.innerHTML = originalLabel;
            }
        });
    }

    function addCopyIcons() {
        document.querySelectorAll(current_config.article_container).forEach(box => {
            const titleA = box.querySelector(current_config.title_element);
            if (titleA && !box.querySelector(".gs_copy_title_btn")) {
                const copyBtn = document.createElement('span');
                copyBtn.className = "gs_copy_title_btn";
                copyBtn.innerHTML = COPY_ICON_SVG;
                copyBtn.title = "Copy Title";
                // Style tĩnh: Không hover, không hiệu ứng chuyển động
                copyBtn.style.cssText = `
                    cursor: pointer;
                    margin-left: 10px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    vertical-align: middle;
                `;

                copyBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const fullTitle = titleA.innerText.trim();
                    GM_setClipboard(fullTitle);

                    copyBtn.innerHTML = SUCCESS_ICON_SVG;
                    setTimeout(() => { copyBtn.innerHTML = COPY_ICON_SVG; }, 1200);
                };

                titleA.parentNode.appendChild(copyBtn);
            }
        });
    }

    function updateUI() {
        if (isUpdating) return;
        isUpdating = true;

        addCopyIcons();

        document.querySelectorAll(current_config.pdf_link).forEach(link => processLink(link));

        document.querySelectorAll(current_config.group_container).forEach((container) => {
            if (container.querySelector(".gs_download-all-btn-action")) return;
            const btnAll = document.createElement('button');
            btnAll.className = "gs_download-all-btn-action";
            btnAll.innerText = "Download All PDFs";
            btnAll.style.cssText = `margin: 0px auto; display: block; padding: 6px 20px; border-radius: 12px; border: 1px solid #dadce0; cursor: pointer; font-family: "Google Sans", sans-serif; font-weight: 500; background: white;`;

            btnAll.onclick = async (e) => {
                e.preventDefault();
                btnAll.disabled = true;
                const pdfLinks = Array.from(container.querySelectorAll(current_config.pdf_link));
                for (let i = 0; i < pdfLinks.length; i++) {
                    const link = pdfLinks[i];
                    while (link.dataset.pdfChecked !== "done") { await new Promise(r => setTimeout(r, 500)); }

                    if (link.dataset.isRealPdf !== "true") continue;
                    btnAll.innerText = `Processing ${i + 1}/${pdfLinks.length}`;
                    const box = link.closest(current_config.article_container);
                    const name = (box.querySelector(current_config.title_element)?.innerText.trim().replace(/[\\/:*?"<>|]/g, '_') || "doc") + ".pdf";
                    await startDownload(link.href, name, link);
                }
                btnAll.innerText = "Finished";
                setTimeout(() => { btnAll.innerText = "Download All PDFs"; btnAll.disabled = false; }, 2000);
            };
            const results = container.querySelectorAll(current_config.article_container);
            if (results.length > 0) results[results.length - 1].parentNode.insertBefore(btnAll, results[results.length - 1].nextSibling);
        });
        setTimeout(() => { isUpdating = false; }, 500);
    }

    document.addEventListener('click', async function(e) {
        const pdfLink = e.target.closest(current_config.pdf_link);
        if (pdfLink && e.isTrusted) {
            e.preventDefault();
            while (pdfLink.dataset.pdfChecked !== "done") { await new Promise(r => setTimeout(r, 300)); }

            const box = pdfLink.closest(current_config.article_container);
            const title = box ? box.querySelector(current_config.title_element) : null;
            const name = (title ? title.innerText.trim().replace(/[\\/:*?"<>|]/g, '_') : "doc") + ".pdf";

            if (pdfLink.dataset.isRealPdf === "false") {
                if (!pdfLink.dataset.clickState || pdfLink.dataset.clickState === "0") {
                    pdfLink.dataset.clickState = "1";
                    pdfLink.style.color = "orange";
                    window.open(pdfLink.href, '_blank');
                } else {
                    pdfLink.dataset.clickState = "0";
                    pdfLink.style.color = "green";
                    startDownload(pdfLink.href, name, pdfLink);
                }
            } else {
                startDownload(pdfLink.href, name, pdfLink);
            }
        }
    }, true);

    new MutationObserver(() => updateUI()).observe(document.body, { childList: true, subtree: true });
    updateUI();
})();