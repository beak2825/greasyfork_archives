// ==UserScript==
// @name         Google Scholar - Research Assistant
// @namespace    http://greasyfork.org/
// @version      1.9
// @description  An all-in-one Google Scholar enhancement tool: automatically discovers PDF links using DOIs (via Sci-Hub, Sci-Net, Unpaywall, Semantic Scholar), validates if links are direct PDFs, provides batch download and copy-to-clipboard functionality, auto-renames downloaded files using article titles, and automates loading up to 50 results in Scholar Labs.
// @author       Bui Quoc Dung
// @match        https://scholar.google.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/560994/Google%20Scholar%20-%20Research%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/560994/Google%20Scholar%20-%20Research%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIGS = {
        LABS: {
            article_container: ".gs_as_r",
            title_element: ".gs_rt a",
            pdf_link: ".gs_or_ggsm",
            pdf_link_a: ".gs_or_ggsm a",
            group_container: ".gs_as_cp_tc"
        },
        STANDARD: {
            article_container: ".gs_r.gs_or.gs_scl",
            title_element: ".gs_rt a",
            pdf_link: ".gs_or_ggsm",
            pdf_link_a: ".gs_or_ggsm a",
            group_container: "#gs_res_ccl_mid"
        }
    };

    const isLabs = window.location.pathname.includes('scholar_labs');
    const CONF = isLabs ? CONFIGS.LABS : CONFIGS.STANDARD;
    const DOI_REGEX = /\b(10\.\d{4,}(?:\.\d+)*\/(?:(?!["&'<>])\S)+)\b/gi;

    let isUpdating = false;
    let isAutoFinding = false;
    let waitingForReappearance = false;

    const COPY_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="#70757a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><rect x="9" y="9" width="11" height="11" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
    const SUCCESS_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="#70757a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

    const btnStyle = `
        margin-left: 8px;
        padding: 2px 10px;
        font-size: 13px;
        line-height: 20px;
        border-radius: 12px;
        border: 1px solid #dadce0;
        background-color: transparent;
        cursor: pointer;
        font-family: "Google Sans", Roboto, Arial, sans-serif;
        transition: all 0.1s;
        color: currentColor;
        outline: none;
    `;

    function httpRequest(details) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                ...details,
                onload: resolve,
                onerror: reject,
                ontimeout: reject
            });
        });
    }

    async function titleToDOI(title) {
        try {
            const url = `https://api.crossref.org/works?query.title=${encodeURIComponent(title.trim())}&rows=1`;
            const response = await httpRequest({ method: 'GET', url, timeout: 5000 });
            const data = JSON.parse(response.responseText);
            return data.message.items?.[0]?.DOI || null;
        } catch (e) {
            return null;
        }
    }

    async function fetchDOI(titleLink) {
        const url = titleLink.href;
        const match = url.match(DOI_REGEX);
        if (match) return match[0].trim();

        try {
            const response = await httpRequest({ method: 'GET', url, timeout: 5000 });
            const doiMatch = response.responseText.match(DOI_REGEX);
            if (doiMatch) return doiMatch[0].trim();
            return await titleToDOI(titleLink.textContent);
        } catch (e) {
            return await titleToDOI(titleLink.textContent);
        }
    }

    function isLoginOrErrorPage(doc, html) {
        const loginIndicators = [
            'type="password"', 'name="user"', 'name="pass"', 'placeholder="username"', 'placeholder="password"',
            'action="login"', '/join', 'No account yet', 'Sign in', 'Sign up', 'Register', 'Login'
        ];

        const errorIndicators = [
            '404', 'not found', 'error', 'access denied', 'forbidden'
        ];

        const lowerHtml = html.toLowerCase();

        for (const indicator of loginIndicators) {
            if (html.includes(indicator) || lowerHtml.includes(indicator.toLowerCase())) {
                return true;
            }
        }

        const title = doc.querySelector('title')?.textContent?.toLowerCase() || '';
        const h1 = doc.querySelector('h1')?.textContent?.toLowerCase() || '';

        for (const indicator of errorIndicators) {
            if (title.includes(indicator) || h1.includes(indicator)) {
                return true;
            }
        }

        return false;
    }

    async function findPdfInPage(pageUrl) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: pageUrl,
                timeout: 10000,
                onload: (response) => {
                    if (response.status >= 400) return resolve(null);

                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    const html = response.responseText;

                    if (isLoginOrErrorPage(doc, html)) return resolve(null);

                    const embedPdf = doc.querySelector('embed#pdf') || doc.querySelector('iframe#pdf');
                    if (embedPdf?.src) {
                        const src = embedPdf.src.startsWith('//') ? 'https:' + embedPdf.src : embedPdf.src;
                        return resolve(src);
                    }

                    const iframeInPdfDiv = doc.querySelector('.pdf iframe');
                    if (iframeInPdfDiv?.src) {
                        const src = iframeInPdfDiv.src.startsWith('//') ? 'https:' + iframeInPdfDiv.src : iframeInPdfDiv.src;
                        return resolve(src);
                    }

                    const metaSelectors = [
                        'meta[name="citation_pdf_url"]',
                        'meta[property="og:url"]',
                        'meta[name="dc.Identifier"]'
                    ];
                    for (let s of metaSelectors) {
                        const m = doc.querySelector(s);
                        const content = m ? m.getAttribute('content') : null;
                        if (content && content.toLowerCase().includes('pdf')) {
                            return resolve(new URL(content, pageUrl).href);
                        }
                    }

                    const pdfLink = Array.from(doc.querySelectorAll('a[href*=".pdf"]')).find(a => {
                        const href = a.getAttribute('href');
                        return href && href.toLowerCase().endsWith('.pdf');
                    });

                    if (pdfLink) {
                        return resolve(new URL(pdfLink.getAttribute('href'), pageUrl).href);
                    }

                    const hasPdfViewer = doc.querySelector('embed[type="application/pdf"]') ||
                                        doc.querySelector('object[type="application/pdf"]') ||
                                        doc.querySelector('iframe[src*=".pdf"]');

                    if (hasPdfViewer) return resolve(pageUrl);

                    resolve(null);
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null)
            });
        });
    }

    async function searchSciHub(doi) {
        try {
            const gateway = 'https://tesble.com/' + doi;
            return await findPdfInPage(gateway);
        } catch (e) {
            return null;
        }
    }

    async function searchSciNet(doi) {
        try {
            const gateway = 'https://sci-net.xyz/' + doi;
            return await findPdfInPage(gateway);
        } catch (e) {
            return null;
        }
    }

    async function searchSemantic(doi) {
        try {
            const res = await httpRequest({
                method: 'GET',
                url: `https://api.semanticscholar.org/graph/v1/paper/DOI:${doi}?fields=openAccessPdf`,
                timeout: 5000
            });
            const data = JSON.parse(res.responseText);
            return data?.openAccessPdf?.url || null;
        } catch (e) {
            return null;
        }
    }

    async function searchUnpaywall(doi) {
        try {
            const res = await httpRequest({
                method: 'GET',
                url: `https://api.unpaywall.org/v2/${doi}?email=support@unpaywall.org`,
                timeout: 5000
            });
            const data = JSON.parse(res.responseText);
            return (data?.is_oa && data.best_oa_location?.url) ? data.best_oa_location.url : null;
        } catch (e) {
            return null;
        }
    }

    async function checkIsPDF(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "HEAD",
                url: url,
                timeout: 5000,
                onload: (r) => {
                    const h = (r.responseHeaders || "").toLowerCase();
                    if (r.status === 403 || h.includes("text/html")) return resolve(false);
                    const isPdfType = h.includes("application/pdf");
                    const size = parseInt(h.match(/content-length:\s*(\d+)/)?.[1] || 0, 10);
                    const MIN_SIZE = 50 * 1024;

                    if (isPdfType) {
                        if (size > 0 && size < MIN_SIZE) return resolve(false);
                        return resolve(true);
                    }

                    const lowerUrl = url.toLowerCase().split(/[?#]/)[0];
                    if (lowerUrl.includes('pdf')) {
                        if (size > 0 && size < MIN_SIZE) return resolve(false);
                        return resolve(true);
                    }

                    resolve(false);
                },
                onerror: () => resolve(false),
                ontimeout: () => resolve(false)
            });
        });
    }

    function renderDOILine(articleBox, doi) {
        if (!doi || articleBox.querySelector(".gs_doi_display_row")) return;

        const titleContainer = articleBox.querySelector(".gs_rt");
        if (!titleContainer) return;

        const doiRow = document.createElement('div');
        doiRow.className = "gs_doi_display_row";
        doiRow.style.cssText = "font-size: 12px; color: #555; margin-top: 2px; display: flex; align-items: center; line-height: 1.4;";

        const doiText = document.createElement('span');
        doiText.innerHTML = `${doi}`;

        const copyBtn = document.createElement('span');
        copyBtn.className = "gs_copy_doi_btn";
        copyBtn.innerHTML = COPY_ICON_SVG;
        copyBtn.style.cssText = `cursor: pointer; margin-left: 8px; display: inline-flex; vertical-align: middle; opacity: 0.8;`;
        copyBtn.title = "Copy DOIs";

        copyBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            GM_setClipboard("https://doi.org/" + doi);
            copyBtn.innerHTML = SUCCESS_ICON_SVG;
            setTimeout(() => { copyBtn.innerHTML = COPY_ICON_SVG; }, 1500);
        };

        doiRow.appendChild(doiText);
        doiRow.appendChild(copyBtn);
        titleContainer.parentNode.insertBefore(doiRow, titleContainer.nextSibling);
    }

    function addTitleCopyIcons() {
        document.querySelectorAll(CONF.article_container).forEach(box => {
            const titleA = box.querySelector(CONF.title_element);
            if (titleA && !box.querySelector(".gs_copy_title_btn")) {
                const copyBtn = document.createElement('span');
                copyBtn.className = "gs_copy_title_btn";
                copyBtn.innerHTML = COPY_ICON_SVG;
                copyBtn.style.cssText = `cursor: pointer; margin-left: 10px; display: inline-flex; vertical-align: middle;`;
                copyBtn.title = "Copy Title";
                copyBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    GM_setClipboard(titleA.innerText.trim());
                    copyBtn.innerHTML = SUCCESS_ICON_SVG;
                    setTimeout(() => { copyBtn.innerHTML = COPY_ICON_SVG; }, 1500);
                };
                titleA.parentNode.appendChild(copyBtn);
            }
        });
    }

    function insertPdfLink(container, provider, pdfUrl) {
        container.innerHTML = '';
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.target = '_blank';
        a.innerHTML = `<span class="gs_ctg2">[PDF]</span> ${provider}`;
        container.appendChild(a);
    }

    async function processLink(link) {
        const articleBox = link.closest(CONF.article_container);
        if (!articleBox || link.dataset.pdfChecked === "done" || link.dataset.pdfChecked === "processing") return;

        const container = link.closest(CONF.pdf_link);
        if (container) {
            container.querySelectorAll("a").forEach(item => {
                if (item !== link && (item.innerText.includes("Full View") || item.href.includes("output=instlink"))) {
                    item.remove();
                }
            });
        }

        if (!articleBox.dataset.originalLabel) articleBox.dataset.originalLabel = link.innerHTML;
        const previousHTML = link.innerHTML;

        link.innerHTML = `<i style="color: #9E9E9E;">verifying...</i>`;
        link.dataset.pdfChecked = "processing";
        injectCopyLinksHelpers();

        let isPDF = await checkIsPDF(link.href);
        if (!isPDF) {
            const deeperUrl = await findPdfInPage(link.href);
            if (deeperUrl && deeperUrl !== link.href) {
                isPDF = await checkIsPDF(deeperUrl);
                if (isPDF) link.href = deeperUrl;
            }
        }

        link.innerHTML = previousHTML;
        link.dataset.isRealPdf = isPDF ? "true" : "false";
        link.style.color = isPDF ? "" : "green";
        link.dataset.pdfChecked = "done";
        injectCopyLinksHelpers();
    }

    async function processElement(el) {
        if (el.dataset.elementProcessed === "true") return;
        const titleLink = el.querySelector(CONF.title_element);
        if (!titleLink) return;

        let container = el.querySelector(CONF.pdf_link);

        if (!container || !container.querySelector('a')) {
            if (el.querySelector(`${CONF.pdf_link} span.gs_ctg2`)) return;

            if (!container) {
                const wrapper = document.createElement('div');
                wrapper.className = 'gs_ggs gs_fl';
                wrapper.innerHTML = '<div class="gs_ggsd"><div class="gs_or_ggsm"></div></div>';
                el.insertBefore(wrapper, el.firstChild);
                container = wrapper.querySelector('.gs_or_ggsm');
            }

            if (container.dataset.doiSearchDone) return;
            container.dataset.doiSearchDone = "true";

            container.innerHTML = `<span style="color: #9E9E9E;"><i>searching...</i></span>`;

            const doi = await fetchDOI(titleLink);
            if (!doi) {
                container.innerHTML = '';
                return;
            }

            el.dataset.doi = doi;
            renderDOILine(el, doi);

            const providers = [
                { name: 'scihub', fn: searchSciHub },
                { name: 'scinet', fn: searchSciNet },
                { name: 'semantic', fn: searchSemantic },
                { name: 'unpaywall', fn: searchUnpaywall },
            ];

            let foundPdf = false;
            for (const p of providers) {
                const url = await p.fn(doi);
                if (url) {
                    insertPdfLink(container, p.name, url);
                    const newLink = container.querySelector('a');
                    if (newLink) await processLink(newLink);
                    foundPdf = true;
                    break;
                }
            }

            if (!foundPdf) container.innerHTML = '';
        } else {
            if (!el.dataset.doi) {
                const doi = await fetchDOI(titleLink);
                if (doi) {
                    el.dataset.doi = doi;
                    renderDOILine(el, doi);
                }
            }
        }

        el.dataset.elementProcessed = "true";
    }

    function getBlockStats(tc) {
        const rows = Array.from(tc.querySelectorAll(CONF.article_container));
        const titleLinks = Array.from(tc.querySelectorAll(CONF.title_element)).map(a => a.href);
        const pdfLinks = Array.from(tc.querySelectorAll(CONF.pdf_link_a));

        const noPdfLinks = rows.filter(row => !row.querySelector(CONF.pdf_link_a))
                               .map(row => {
                                   const doi = row.dataset.doi;
                                   return doi ? "https://doi.org/" + doi : (row.querySelector(CONF.title_element)?.href || "");
                               })
                               .filter(link => link !== "");

        const downloadable = pdfLinks.filter(l => l.dataset.isRealPdf === "true");
        const needCheck = pdfLinks.filter(l => l.dataset.isRealPdf === "false");
        const processingCount = pdfLinks.filter(l => l.dataset.pdfChecked === "processing").length;

        return {
            titleLinks,
            titleCount: titleLinks.length,
            noPdfLinks,
            noPdfCount: noPdfLinks.length,
            pdfLinks: pdfLinks.map(l => l.href),
            pdfCount: pdfLinks.length,
            downloadableCount: downloadable.length,
            needCheckCount: needCheck.length,
            processingCount: processingCount
        };
    }

    function injectCopyLinksHelpers() {
        const containers = document.querySelectorAll(CONF.group_container);
        containers.forEach((tc, index) => {
            const rows = tc.querySelectorAll(CONF.article_container);
            if (rows.length === 0) return;

            const boxId = `copy-links-helper-${index}`;
            let box = tc.querySelector(`#${boxId}`);
            if (!box) {
                box = document.createElement('div');
                box.id = boxId;
                box.style.cssText = 'display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-start; padding: 5px;';
                tc.appendChild(box);
            }

            const stats = getBlockStats(tc);
            const findBtnHtml = (isLabs && index === 0) ? `<button class="btn-find" style="${btnStyle}">${isAutoFinding ? 'Finding...' : 'Find more'}</button>` : '';

            box.innerHTML = `
                ${findBtnHtml}
                <button class="btn-copy-title-links" style="${btnStyle}">Copy titles: ${stats.titleCount}</button>
                <button class="btn-copy-no-pdf-links" style="${btnStyle}; border-color: #f44336; color: #d32f2f;">Copy DOIs (No PDF): ${stats.noPdfCount}</button>
                <button class="btn-copy-pdf-links" style="${btnStyle}">Copy PDFs: ${stats.pdfCount}</button>
                <button class="btn-download-all" style="${btnStyle}" ${stats.downloadableCount === 0 ? 'disabled style="opacity:0.5"' : ''}>Download PDFs: ${stats.downloadableCount}</button>
                <div style="margin-left: 15px; font-size: 12px; font-family: Roboto, Arial, sans-serif; display: flex; gap: 15px;">
                    <span style="color: #2e7d32;">Unverified: ${stats.needCheckCount}</span>
                    <span style="color: #9E9E9E; font-style: italic;"><b>Processing:</b> ${stats.processingCount}</span>
                </div>
            `;

            box.querySelector('.btn-copy-title-links').onclick = (e) => {
                e.preventDefault();
                const b = e.currentTarget;
                const originalText = b.innerText;
                GM_setClipboard(stats.titleLinks.join('\n'));
                b.innerText = 'Copied';
                setTimeout(() => {
                    b.innerText = originalText;
                    b.style.color = '';
                }, 1200);
            };

            box.querySelector('.btn-copy-pdf-links').onclick = (e) => {
                e.preventDefault();
                const b = e.currentTarget;
                const originalText = b.innerText;
                GM_setClipboard(stats.pdfLinks.join('\n'));
                b.innerText = 'Copied';
                setTimeout(() => {
                    b.innerText = originalText;
                    b.style.color = '';
                }, 1200);
            };

            box.querySelector('.btn-copy-no-pdf-links').onclick = (e) => {
                e.preventDefault();
                const b = e.currentTarget;
                const originalText = b.innerText;
                GM_setClipboard(stats.noPdfLinks.join('\n'));
                b.innerText = 'Copied';
                setTimeout(() => {
                    b.innerText = originalText;
                    b.style.color = '';
                }, 1200);
            };

            const dlBtn = box.querySelector('.btn-download-all');
            if (dlBtn && stats.downloadableCount > 0) dlBtn.onclick = async (e) => {
                e.preventDefault();
                const b = e.currentTarget;
                const originalText = b.innerText;
                const targets = Array.from(tc.querySelectorAll(CONF.pdf_link_a)).filter(l => l.dataset.isRealPdf === "true");

                b.innerText = 'Downloading';
                b.disabled = true;
                b.style.opacity = '0.7';

                for (let link of targets) {
                    const row = link.closest(CONF.article_container);
                    const name = (row.querySelector(CONF.title_element)?.innerText.trim().replace(/[\\/:*?"<>|]/g, '_') || "doc") + ".pdf";

                    const originalLinkHTML = link.innerHTML;
                    link.innerHTML = `Downloading`;

                    GM_download({
                        url: link.href,
                        name: name,
                        onload: () => {
                            link.innerHTML = originalLinkHTML;
                        },
                        onerror: () => {
                            link.innerHTML = originalLinkHTML;
                        }
                    });

                    await new Promise(r => setTimeout(r, 500));
                }

                setTimeout(() => {
                    b.innerText = originalText;
                    b.style.color = '';
                    b.disabled = false;
                    b.style.opacity = '';
                }, 2000);
            };

            const fBtn = box.querySelector('.btn-find');
            if (fBtn) fBtn.onclick = (e) => {
                e.preventDefault();
                isAutoFinding = !isAutoFinding;
                injectCopyLinksHelpers();
            };
        });
    }

    function updateUI() {
        if (isUpdating) return;
        isUpdating = true;
        addTitleCopyIcons();
        document.querySelectorAll(CONF.article_container).forEach(processElement);
        document.querySelectorAll(CONF.pdf_link_a).forEach(processLink);
        injectCopyLinksHelpers();
        setTimeout(() => { isUpdating = false; }, 500);
    }

    document.addEventListener('click', async function(e) {
        const pdfLink = e.target.closest(CONF.pdf_link_a);
        if (pdfLink && e.isTrusted) {
            e.preventDefault();

            while (pdfLink.dataset.pdfChecked !== "done") {
                await new Promise(r => setTimeout(r, 300));
            }

            const box = pdfLink.closest(CONF.article_container);
            const title = box ? box.querySelector(CONF.title_element) : null;
            const name = (title ? title.innerText.trim().replace(/[\\/:*?"<>|]/g, '_') : "doc") + ".pdf";

            if (pdfLink.dataset.isRealPdf === "true") {
                const originalHTML = pdfLink.innerHTML;
                pdfLink.innerHTML = `Downloading`;

                GM_download({
                    url: pdfLink.href,
                    name: name,
                    onload: () => {
                        setTimeout(() => {
                            pdfLink.innerHTML = originalHTML;
                        }, 1500);
                    },
                    onerror: () => {
                        setTimeout(() => {
                            pdfLink.innerHTML = originalHTML;
                        }, 1500);
                    }
                });
                return;
            }

            if (pdfLink.dataset.isRealPdf === "false") {
                if (!pdfLink.dataset.clickState || pdfLink.dataset.clickState === "0") {
                    pdfLink.dataset.clickState = "1";
                    pdfLink.style.color = "orange";
                    window.open(pdfLink.href, '_blank');
                } else {
                    const originalHTML = pdfLink.innerHTML;
                    pdfLink.dataset.clickState = "0";
                    pdfLink.style.color = "green";
                    pdfLink.innerHTML = `Downloading`;

                    GM_download({
                        url: pdfLink.href,
                        name: name,
                        onload: () => {
                            setTimeout(() => {
                                pdfLink.innerHTML = originalHTML;
                                pdfLink.style.color = "green";
                            }, 1500);
                        },
                        onerror: () => {
                            setTimeout(() => {
                                pdfLink.innerHTML = originalHTML;
                                pdfLink.style.color = "green";
                            }, 1500);
                        }
                    });
                }
            }
        }
    }, true);

    const observer = new MutationObserver(() => updateUI());
    observer.observe(document.body, { childList: true, subtree: true });
    updateUI();

    setInterval(() => {
        if (!isAutoFinding || !isLabs) return;
        const moreBtn = document.querySelector('#gs_as_cp_mr');
        if (moreBtn && moreBtn.offsetParent && !waitingForReappearance) {
            waitingForReappearance = true;
            moreBtn.click();
            setTimeout(() => { waitingForReappearance = false; }, 2500);
        }
    }, 3000);
})();