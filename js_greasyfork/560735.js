// ==UserScript==
// @name         Google Scholar - Copy all Links
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A professional toolkit for Google Scholar Labs to automate result loading up to 50 entries across multiple blocks. Features intelligent PDF/Title link extraction, real-time statistics, and a minimalist Google-style dashboard.
// @author       Bui Quoc Dung
// @match        https://scholar.google.com/scholar_labs/search*
// @match        https://scholar.google.com/scholar?*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560735/Google%20Scholar%20-%20Copy%20all%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/560735/Google%20Scholar%20-%20Copy%20all%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIGS = {
        LABS: {
            group_container: ".gs_as_cp_tc",
            article_container: ".gs_as_r",
            title_element: ".gs_rt a",
            pdf_link: ".gs_or_ggsm a"
        },
        STANDARD: {
            group_container: "#gs_res_ccl_mid",
            article_container: ".gs_r.gs_or.gs_scl",
            title_element: ".gs_rt a",
            pdf_link: ".gs_or_ggsm a"
        }
    };

    const isLabs = window.location.pathname.includes('scholar_labs');
    const config = isLabs ? CONFIGS.LABS : CONFIGS.STANDARD;

    const TARGET_LIMIT = 50;
    let isAutoFinding = false;
    let waitingForReappearance = false;

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

    function getBlockStats(block) {
        const items = block.querySelectorAll(config.article_container);
        let pdfLinks = 0, titleLinks = 0, finalArray = [];

        items.forEach(item => {
            const pdfEl = item.querySelector(config.pdf_link);
            const titleEl = item.querySelector(config.title_element);
            if (pdfEl?.href) {
                pdfLinks++;
                finalArray.push(pdfEl.href);
            } else if (titleEl?.href) {
                titleLinks++;
                finalArray.push(titleEl.href);
            }
        });

        return { total: finalArray.length, pdf: pdfLinks, title: titleLinks, links: finalArray };
    }

    function createHelperElement(boxId) {
        const box = document.createElement('div');
        box.id = boxId;
        box.style.cssText = 'display: flex; align-items: center; justify-content: center; margin: 0px 0; padding: 10px;';

        const findBtnHtml = isLabs ? `<button class="btn-find" style="${btnStyle}">Find 50</button>` : '';

        box.innerHTML = `
            ${findBtnHtml}
            <button class="btn-copy" style="${btnStyle}">Copy (0)</button>
            <div style="margin-left: 15px; font-size: 12px; color: #70757a; font-family: Roboto, Arial, sans-serif;">
                <span class="txt-pdf" style="margin-right: 8px;">PDF: 0</span>
                <span class="txt-title">Title: 0</span>
            </div>
        `;
        return box;
    }

    function updateHelperStats(box, stats) {
        box.querySelector('.btn-copy').innerText = `Copy (${stats.total})`;
        box.querySelector('.txt-pdf').innerText = `PDF: ${stats.pdf}`;
        box.querySelector('.txt-title').innerText = `Title: ${stats.title}`;

        const findBtn = box.querySelector('.btn-find');
        if (findBtn) {
            findBtn.innerText = isAutoFinding ? 'Finding...' : 'Find 50';
            findBtn.style.color = isAutoFinding ? '#ea4335' : 'currentColor';
            findBtn.style.borderColor = isAutoFinding ? '#ea4335' : '#dadce0';
        }
    }

    function attachListeners(box, tc) {
        const findBtn = box.querySelector('.btn-find');
        if (findBtn) {
            findBtn.onclick = (e) => {
                e.preventDefault();
                isAutoFinding = !isAutoFinding;
                waitingForReappearance = false;
                injectHelpers();
            };
        }

        box.querySelector('.btn-copy').onclick = (e) => {
            e.preventDefault();
            const stats = getBlockStats(tc);
            GM_setClipboard(stats.links.join('\n'));
            const b = e.currentTarget;
            const oldText = b.innerText;
            b.innerText = 'Copied!';
            setTimeout(() => { b.innerText = oldText; }, 1200);
        };
    }

    function injectHelpers() {
        const containers = document.querySelectorAll(config.group_container);

        containers.forEach((tc, index) => {
            const resultRows = tc.querySelectorAll(config.article_container);
            if (resultRows.length === 0) return;

            const lastRow = resultRows[resultRows.length - 1];
            const boxId = `helper-box-${index}`;
            let box = tc.querySelector(`#${boxId}`);

            if (!box) {
                box = createHelperElement(boxId);
                attachListeners(box, tc);
            }

            updateHelperStats(box, getBlockStats(tc));

            if (lastRow.nextSibling !== box) {
                lastRow.parentNode.insertBefore(box, lastRow.nextSibling);
            }
        });
    }


    const observer = new MutationObserver((mutations) => {
        const hasNewResults = mutations.some(m =>
            Array.from(m.addedNodes).some(node =>
                node.nodeType === 1 &&
                (node.matches?.(config.article_container) || node.querySelector?.(config.article_container))
            )
        );
        if (hasNewResults) injectHelpers();
    });

    observer.observe(document.body, { childList: true, subtree: true });


    setInterval(() => {
        if (!isAutoFinding || !isLabs) {
            injectHelpers();
            return;
        }

        const moreBtn = document.querySelector('#gs_as_cp_mr');
        const isButtonVisible = !!(moreBtn && moreBtn.offsetParent);

        if (waitingForReappearance) {
            if (isButtonVisible) waitingForReappearance = false;
            return;
        }

        const firstCopyBtn = document.querySelector('.btn-copy');
        const currentCount = firstCopyBtn ? parseInt(firstCopyBtn.innerText.match(/\d+/)[0]) : 0;

        if (currentCount >= TARGET_LIMIT || !moreBtn) {
            isAutoFinding = false;
            injectHelpers();
            return;
        }

        if (isButtonVisible) {
            waitingForReappearance = true;
            moreBtn.click();
        }
    }, 3000);

})();