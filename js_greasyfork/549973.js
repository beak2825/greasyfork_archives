// ==UserScript==
// @name                 openSci-Hub
// @name:zh-CN           打开Sci-Hub
// @version              1.0.0
// @description          Highlight DOI link on the current webpage and redirect it to Sci-Hub. based on DOI to Sci-Hub https://greasyfork.org/users/692574
// @description:zh-CN    高亮当前页面的DOI链接，并重定向至Sci-Hub。本脚本基于DOI to Sci-hub, 减少对外部库的依赖 以及 在代码中直接设定sci-hub 地址。 code with Gemini.
// @author               owen
// @license              MIT
// @match                https://*.sciencemag.org/*
// @match                http*://*.webofknowledge.com/*
// @match                https://academic.oup.com/*
// @match                https://academic.microsoft.com/*
// @match                https://dl.acm.org/doi/*
// @match                https://ieeexplore.ieee.org/*
// @match                https://journals.sagepub.com/*
// @match                https://link.springer.com/*
// @match                https://onlinelibrary.wiley.com/doi/*
// @match                https://psycnet.apa.org/*
// @match                https://pubmed.ncbi.nlm.nih.gov/*
// @match                https://pubs.rsc.org/*
// @match                https://pubs.acs.org/doi/*
// @match                https://pubsonline.informs.org/doi/abs/*
// @match                https://schlr.cnki.net/Detail/index/*
// @match                https://schlr.cnki.net//Detail/index/*
// @match                https://xueshu.baidu.com/usercenter/paper/*
// @match                https://www.aeaweb.org/*
// @match                https://www.ingentaconnect.com/*
// @match                https://www.jstor.org/*
// @match                https://www.nature.com/*
// @match                https://www.ncbi.nlm.nih.gov/*
// @match                https://www.researchgate.net/*
// @match                https://www.sciencedirect.com/*
// @match                http://www.socolar.com/*
// @match                https://www.scinapse.io/*
// @match                https://www.science.org/*
// @match                https://www.tandfonline.com/*
// @match                https://www.webofscience.com/wos/*
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_registerMenuCommand
// @grant                GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1516638
// @downloadURL https://update.greasyfork.org/scripts/549973/%E6%89%93%E5%BC%80Sci-Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/549973/%E6%89%93%E5%BC%80Sci-Hub.meta.js
// ==/UserScript==

// global variables
// 您可以直接在此处修改 Sci-Hub 的地址
const defaultBaseURL = "https://sci-hub.se";
const userConfigURL = "https://sci-hub.st"; // <<<<<<<<<< 在这里设置您希望使用的地址
let sciHubBaseURL;
const doiRegex = new RegExp('(10\.\\d{4,}/[-._;()/:\\w]+)', 'g');
const completePrefix = ['http://dx.doi.org/', 'https://doi.org/', 'https://dx.doi.org/'];
const partialPrefix = ['//dx.doi.org/'];

const callback = function(mutationsList, observer) {

    if (!document.querySelector('.sci-hub-link')) {
        // Web of Science New Interface
        convertPlainTextDOI('span#FullRTa-DOI');

        // scinapse
        convertPlainTextDOI('span[class*="doiInPaperShow_doiContext"]');

        // PsycNet
        // journal article info page
        convertPlainTextDOI('div.citation div a');
        // search result page
        convertPlainTextDOI('a[tooltip="DOI link"]');

        // General
        convertHrefDOI(completePrefix, true);
        convertHrefDOI(partialPrefix, false);
    }
};

(function () {
    'use strict';
    // 将 sciHubBaseURL 直接设置为您在代码中配置的地址
    sciHubBaseURL = userConfigURL.trim();
    sciHubBaseURL += sciHubBaseURL.endsWith("/") ? "" : "/";
    redirectToSciHub();
})();

function redirectToSciHub() {
    // hyperlink
    convertHrefDOI(completePrefix, true);
    convertHrefDOI(partialPrefix, false);

    let observer = new MutationObserver(callback);
    const config = { childList: true, subtree: true };
    observer.observe(document, config);

    // Plain text
    // Science
    convertPlainTextDOI('.meta-line:contains("DOI: 10.")');
    // Web of Science
    convertPlainTextDOI('.FullRTa-DOI:contains("DOI:")');
    // Baidu Scholar
    convertPlainTextDOI('.doi_wr > .kw_main');
    // CNKI Scholar
    convertPlainTextDOI('.doc-doi > a');
    // PubMed
    convertPlainTextDOI('span:contains("doi: 10")');
    // ResearchGate
    // article detail page
    convertPlainTextDOI('div.research-detail-header-section__flex-container a.nova-legacy-e-link');
    // search result
    convertPlainTextDOI('li.nova-legacy-e-list__item');
    // AEA
    convertPlainTextDOI('#article-information cite span.doi');
}

function convertPlainTextDOI(selector) {
    // Native JavaScript selector API
    const elements = document.querySelectorAll(selector);

    if (elements.length > 0) {
        elements.forEach(element => {
            // Handle :contains pseudo-class manually for specific selectors
            if (selector.includes(':contains')) {
                const text = element.textContent;
                if (!text.includes('10.')) {
                    return; // Skip this element if it doesn't contain a DOI
                }
            }

            // Use innerHTML and String.prototype.replace
            const modifiedHTML = element.innerHTML.replace(doiRegex, `<a href="${sciHubBaseURL}` & '$1" target="_blank" class="sci-hub-link">$1</a>');
            element.innerHTML = modifiedHTML;
        });
        // Apply CSS to all elements at once
        const sciHubLinks = document.querySelectorAll('.sci-hub-link');
        sciHubLinks.forEach(link => {
            link.style.backgroundColor = '#FFFF00';
        });
    }
}

function convertHrefDOI(prefixArray, isComplete) {
    prefixArray.forEach((prefix) => {
        // Native JavaScript selector API
        const elements = document.querySelectorAll(`a[href^="${prefix}"]`);
        if (elements.length > 0) {
            elements.forEach(element => {
                let doi = "";
                if (!isComplete) {
                    doi = element.textContent.trim();
                } else {
                    doi = element.getAttribute('href');
                }
                element.setAttribute('href', `${sciHubBaseURL}${doi}`);
                element.classList.add('sci-hub-link');
                element.style.backgroundColor = '#FFFF00';
            });
        }
    });
}