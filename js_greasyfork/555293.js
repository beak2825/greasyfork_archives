// ==UserScript==
// @name        HuggingFace <-> hf-mirror and ModelScope quick jump
// @namespace   http://tampermonkey.net/
// @version     2.2
// @description Add quick jump links between Hugging Face, hf-mirror.com and modelscope.cn pages. Supports precise mapping for Model card, Files, Discussions, and improves SPA stability.
// @author      flyway + Gemini
// @match       https://huggingface.co/*
// @match       https://hf-mirror.com/*
// @match       https://modelscope.cn/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/555293/HuggingFace%20%3C-%3E%20hf-mirror%20and%20ModelScope%20quick%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/555293/HuggingFace%20%3C-%3E%20hf-mirror%20and%20ModelScope%20quick%20jump.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;
    var isMirrorPage = currentUrl.includes('hf-mirror.com');
    var isModelScopePage = currentUrl.includes('modelscope.cn');
    var isHuggingFacePage = currentUrl.includes('huggingface.co');

    // Colors and styles for ModelScope tabs
    const MS_HF_COLOR = 'orange'; // link to Hugging Face
    const MS_HFM_COLOR = 'green';  // link to hf-mirror
    const MS_MODEL_SCOPE_COLOR = '#816DF8'; // link to ModelScope

    // --- Helper: find tab container and create elements ---

    function getTabContainer() {
        // HF tab container typical selector
        var hfContainer = document.querySelector('div.-mb-px.flex.h-12.items-center.overflow-x-auto.overflow-y-hidden');
        if (hfContainer) return hfContainer;

        // ModelScope tab container selector
        var msNav = document.querySelector('div.antd5-tabs-nav');
        if (msNav) {
            return msNav.querySelector('div.antd5-tabs-nav-list');
        }

        return null;
    }

    function createMsJumpTab(text, href, color, className) {
        var tabDiv = document.createElement('div');
        tabDiv.className = 'antd5-tabs-tab ' + className;
        tabDiv.setAttribute('data-node-key', className);

        var tabBtnDiv = document.createElement('div');
        tabBtnDiv.className = 'antd5-tabs-tab-btn';
        tabBtnDiv.setAttribute('role', 'tab');
        tabBtnDiv.setAttribute('aria-selected', 'false');
        tabBtnDiv.setAttribute('tabindex', '0');

        var link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        var textWrapperDiv = document.createElement('div');
        textWrapperDiv.className = 'modelDetail_tabs_icon';
        textWrapperDiv.textContent = text;
        textWrapperDiv.style.color = color;
        textWrapperDiv.style.fontWeight = 'bold';
        textWrapperDiv.style.padding = '0 10px';

        link.appendChild(textWrapperDiv);
        tabBtnDiv.appendChild(link);
        tabDiv.appendChild(tabBtnDiv);

        return tabDiv;
    }


    // --- Core URL conversion logic (tab path mapping) ---

    /**
     * Convert a ModelScope URL to a Hugging Face URL with tab mapping
     */
    function convertMsToHfUrl(url) {
        var targetUrl = url.replace('modelscope.cn', 'huggingface.co');

        // Remove /models/ prefix
        targetUrl = targetUrl.replace(/\/models\//, '/');

        // Map ModelScope tab paths to HF equivalents:
        // /summary -> '' (root / model card)
        // /files -> /tree/main
        // /feedback -> /discussions
        if (targetUrl.includes('/summary')) {
            targetUrl = targetUrl.replace(/\/summary/g, '');
        } else if (targetUrl.includes('/files')) {
            targetUrl = targetUrl.replace(/\/files/g, '/tree/main');
        } else if (targetUrl.includes('/feedback')) {
            targetUrl = targetUrl.replace(/\/feedback/g, '/discussions');
        } else {
            // If it's a model root like /user/repo, ensure it maps to HF model card
            var path = new URL(targetUrl).pathname;
            if (path.match(/^\/([^\/]+)\/([^\/]+)\/?$/)) {
                 // ensure no trailing slash for HF model card
                 targetUrl = targetUrl.replace(/\/$/, '');
            }
        }

        // Remove duplicate slashes except protocol
        targetUrl = targetUrl.replace(/([^:]\/)\/+/g, '$1');

        return targetUrl;
    }

    /**
     * Convert a Hugging Face or hf-mirror URL to a ModelScope URL with tab mapping
     */
    function convertHfToMsUrl(url) {
        var targetUrl = url.replace('huggingface.co', 'modelscope.cn').replace('hf-mirror.com', 'modelscope.cn');

        // Insert /models before user/repo
        targetUrl = targetUrl.replace(/(modelscope\.cn\/)([^\/]+\/[^\/]+)/, '$1models/$2');

        // Map HF tab paths to ModelScope:
        // /discussions -> /feedback
        // /tree/main -> /files
        // root -> /summary
        // Remove /main and /blob occurrences in file paths
        targetUrl = targetUrl.replace(/\/main\/?$|\/blob\/?$/g, '');

        if (targetUrl.includes('/discussions')) {
            targetUrl = targetUrl.replace(/\/discussions/g, '/feedback');
        } else if (targetUrl.includes('/tree')) {
            targetUrl = targetUrl.replace(/\/tree/g, '/files');
        } else {
            // If it's HF model root, convert to ModelScope /summary
            var path = new URL(targetUrl).pathname;
            if (path.match(/\/models\/([^\/]+)\/([^\/]+)\/?$/)) {
                if (!targetUrl.endsWith('/')) {
                    targetUrl += '/';
                }
                targetUrl += 'summary';
            }
        }

        // Remove duplicate slashes except protocol
        targetUrl = targetUrl.replace(/([^:]\/)\/+/g, '$1');

        return targetUrl;
    }

    // --- Main functions: add tab/link elements ---

    function addTabLink() {
        var tabContainer = getTabContainer();
        if (!tabContainer) return;

        var hfLinkClass = 'tab-alternate custom-tab hf-mirror-jump';

        // 1. On Hugging Face / hf-mirror pages: add mirror and modelscope links
        if (!isModelScopePage) {
            if (!tabContainer.querySelector('.custom-tab.hf-mirror-jump')) {
                var jumpLink = document.createElement('a');
                jumpLink.className = hfLinkClass;
                jumpLink.style.marginLeft = '10px';
                jumpLink.target = '_blank';
                jumpLink.rel = 'noopener noreferrer';
                if (isMirrorPage) {
                    jumpLink.href = currentUrl.replace('hf-mirror.com', 'huggingface.co');
                    jumpLink.textContent = 'Open on Hugging Face';
                    jumpLink.style.color = MS_HF_COLOR;
                } else {
                    jumpLink.href = currentUrl.replace('huggingface.co', 'hf-mirror.com');
                    jumpLink.textContent = 'Open on hf-mirror';
                    jumpLink.style.color = MS_HFM_COLOR;
                }
                tabContainer.appendChild(jumpLink);
            }

            // Add ModelScope link
            if (!tabContainer.querySelector('.custom-tab.modelscope-jump')) {
                var modelscopeLink = document.createElement('a');
                modelscopeLink.className = hfLinkClass + ' modelscope-jump';
                modelscopeLink.style.marginLeft = '10px';
                modelscopeLink.target = '_blank';
                modelscopeLink.rel = 'noopener noreferrer';

                var targetUrl = convertHfToMsUrl(currentUrl);

                modelscopeLink.href = targetUrl;
                modelscopeLink.textContent = 'Open on ModelScope';
                modelscopeLink.style.color = MS_MODEL_SCOPE_COLOR;

                tabContainer.appendChild(modelscopeLink);
            }
        }

        // 2. On ModelScope pages: add tabs to HF and hf-mirror
        if (isModelScopePage) {

            if (tabContainer.children.length < 2) return;

            // Add Hugging Face tab
            if (!tabContainer.querySelector('.ms-hf-jump')) {
                var targetUrl = convertMsToHfUrl(currentUrl);

                var hfJumpTab = createMsJumpTab(
                    'Open on Hugging Face',
                    targetUrl,
                    MS_HF_COLOR,
                    'ms-hf-jump'
                );
                tabContainer.appendChild(hfJumpTab);
            }

            // Add hf-mirror tab
            if (!tabContainer.querySelector('.ms-hfm-jump')) {
                // convert to HF then swap domain to hf-mirror
                var targetUrl = convertMsToHfUrl(currentUrl).replace('huggingface.co', 'hf-mirror.com');

                var hfmJumpTab = createMsJumpTab(
                    'Open on hf-mirror',
                    targetUrl,
                    MS_HFM_COLOR,
                    'ms-hfm-jump'
                );
                tabContainer.appendChild(hfmJumpTab);
            }
        }
    }

    // --- Stability helpers and initial run ---

    // Add links on blob/model file pages (avoid ModelScope)
    function addBlobLinks() {
        var isModelScope = window.location.href.includes('modelscope.cn');
        var isMirror = window.location.href.includes('hf-mirror.com');
        if (isModelScope) return;
        var messageDiv = document.querySelector('div.p-4.py-8.text-center');
        if (messageDiv && !messageDiv.querySelector('.custom-links')) {
            var newP = document.createElement('p');
            newP.className = 'custom-links';
            newP.style.marginTop = '20px';
            if (isMirror) {
                return;
            } else {
                var downloadLink = document.querySelector('a[href*="/resolve/"]');
                if (downloadLink) {
                    var originalDownloadUrl = downloadLink.href;
                    var urlObj = new URL(originalDownloadUrl);
                    var mirrorDownloadUrl = urlObj.origin.replace('huggingface.co', 'hf-mirror.com') + urlObj.pathname;
                    var downloadLinkMirror = document.createElement('a');
                    downloadLinkMirror.href = mirrorDownloadUrl;
                    downloadLinkMirror.textContent = 'Download via hf-mirror';
                    downloadLinkMirror.style.color = 'green';
                    downloadLinkMirror.style.textDecoration = 'underline';
                    downloadLinkMirror.style.marginRight = '10px';
                    downloadLinkMirror.target = '_blank';
                    downloadLinkMirror.rel = 'noopener noreferrer';
                    newP.appendChild(downloadLinkMirror);
                }
            }
            messageDiv.appendChild(newP);
        }
    }

    function addTreeDownloadButtons() {
        var isTreePage = window.location.href.includes('/tree/main');
        var isMirrorPage = window.location.href.includes('hf-mirror.com');
        var isModelScopePageLocal = window.location.href.includes('modelscope.cn');
        if (!isTreePage || isMirrorPage || isModelScopePageLocal) return;
        var fileLinks = document.querySelectorAll('a.group.col-span-9.flex.items-center[href*="/resolve/"]');
        fileLinks.forEach(function(link) {
            if (!link.querySelector('.custom-mirror-download')) {
                var originalHref = link.href;
                var mirrorHref = originalHref.replace('huggingface.co', 'hf-mirror.com').split('?')[0];
                var originalDownloadBtn = link.querySelector('div.group-hover\\:shadow-xs.ml-2.flex.h-5.w-5');
                if (originalDownloadBtn) {
                    var mirrorDownloadBtn = document.createElement('div');
                    mirrorDownloadBtn.className = 'ml-2 flex h-5 w-5 items-center justify-center rounded-sm border text-green-500 hover:bg-gray-50 hover:text-green-800 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-green-300 xl:ml-4 custom-mirror-download';
                    mirrorDownloadBtn.innerHTML = '<a href="' + mirrorHref + '" target="_blank" rel="noopener noreferrer" title="Download from hf-mirror"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10l10-10z"></path></svg></a>';
                    link.insertBefore(mirrorDownloadBtn, originalDownloadBtn.nextSibling);
                }
            }
        });
    }

    var observerThrottle = false;

    // Observe DOM changes to handle dynamic tab containers (ModelScope and HF SPA)
    var observer = new MutationObserver(function(mutations) {
        if (observerThrottle) return;

        var needsUpdate = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.matches('div.antd5-tabs-nav') || node.matches('div.antd5-tabs-nav-list') || node.closest('div.antd5-tabs-nav-list') || node.closest('div.-mb-px'))) {
                        needsUpdate = true;
                        break;
                    }
                }
            }
        });

        if (needsUpdate) {
            observerThrottle = true;
            setTimeout(() => {
                addTabLink();
                addTreeDownloadButtons();
                addBlobLinks();
                observerThrottle = false;
            }, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run on initial page load
    window.addEventListener('load', function() {
        addTabLink();
        addTreeDownloadButtons();
        addBlobLinks();
    });

    // Handle SPA URL changes: retry adding UI when URL changes
    var lastUrl = currentUrl;
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            if (isModelScopePage || isHuggingFacePage || isMirrorPage) {
                addTabLink();
            }
        }
    }, 200);

})();