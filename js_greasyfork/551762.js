// ==UserScript==
// @name         ACB tlačítko - Španělský basketbal
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Přepíše url na estadisticas pro přidání statistik
// @author       Michal
// @match        https://live.acb.com/es/partidos/*/previa
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551762/ACB%20tla%C4%8D%C3%ADtko%20-%20%C5%A0pan%C4%9Blsk%C3%BD%20basketbal.user.js
// @updateURL https://update.greasyfork.org/scripts/551762/ACB%20tla%C4%8D%C3%ADtko%20-%20%C5%A0pan%C4%9Blsk%C3%BD%20basketbal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonElement = null;
    let isAdding = false;
    let lastAddTime = 0;
    let currentUrl = window.location.href;
    let retryCount = 0;
    const MAX_RETRIES = 10;

    function addButton() {
        if (!window.location.href.includes('/previa')) {
            isAdding = false;
            return;
        }

        const now = Date.now();
        if (now - lastAddTime < 300 || isAdding) return;

        isAdding = true;
        lastAddTime = now;

        try {
            const tabsContainer = document.querySelector('.MatchDetailsHeaderTabs_matchDetailsTabs__1brw6');

            if (!tabsContainer) {
                isAdding = false;
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    setTimeout(addButton, 500);
                }
                return;
            }

            const existingButton = tabsContainer.querySelector('[data-estadisticas-button="true"]');
            if (existingButton && document.contains(existingButton)) {
                buttonElement = existingButton;
                isAdding = false;
                retryCount = 0;
                return;
            }

            const linkWrapper = document.createElement('a');
            linkWrapper.href = '#';
            linkWrapper.style.textDecoration = 'none';
            linkWrapper.setAttribute('data-estadisticas-button', 'true');

            const tabDiv = document.createElement('div');
            tabDiv.className = 'MatchDetailsHeaderTab_tab__Zazra';
            tabDiv.style.cursor = 'pointer';
            tabDiv.style.transition = 'opacity 0.2s';

            const buttonText = document.createElement('p');
            buttonText.className = 'heading heading--subhead';
            buttonText.textContent = 'Estadísticas';

            tabDiv.appendChild(buttonText);
            linkWrapper.appendChild(tabDiv);

            linkWrapper.onclick = (e) => {
                e.preventDefault();
                window.history.pushState({}, '', window.location.href.replace('/previa', '/estadisticas'));
                window.dispatchEvent(new Event('popstate'));
            };

            linkWrapper.onmouseover = () => tabDiv.style.opacity = '0.7';
            linkWrapper.onmouseout = () => tabDiv.style.opacity = '1';

            tabsContainer.appendChild(linkWrapper);
            buttonElement = linkWrapper;
            retryCount = 0;
            isAdding = false;

        } catch (error) {
            console.error('ACB Stats - Failed to add button:', error);
            isAdding = false;
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(addButton, 500);
            }
        }
    }

    function checkAndAddButton() {
        if (!window.location.href.includes('/previa')) {
            return;
        }

        const existingButton = document.querySelector('[data-estadisticas-button="true"]');
        if (!existingButton || !document.contains(existingButton)) {
            retryCount = 0;
            setTimeout(addButton, 100);
        }
    }

    function setupObserver() {
        try {
            const observer = new MutationObserver((mutations) => {
                const hasTabsChange = mutations.some(mutation => {
                    if (mutation.type === 'childList') {
                        return Array.from(mutation.addedNodes).some(node => {
                            if (node.nodeType !== 1) return false;
                            const isOurButton = node.getAttribute && node.getAttribute('data-estadisticas-button') === 'true';
                            const isInTabsContainer = node.classList &&
                                (node.classList.contains('MatchDetailsHeaderTab_tab__Zazra') ||
                                 node.querySelector('.MatchDetailsHeaderTab_tab__Zazra'));
                            return !isOurButton && isInTabsContainer;
                        });
                    }
                    return false;
                });

                if (hasTabsChange) {
                    checkAndAddButton();
                }
            });

            const headerSection = document.querySelector('.MatchDetailsHeader_section__tabs__JV0FI');
            const tabsContainer = document.querySelector('.MatchDetailsHeaderTabs_matchDetailsTabs__1brw6');

            if (tabsContainer) {
                observer.observe(tabsContainer, {
                    childList: true,
                    subtree: false
                });
            } else if (headerSection) {
                observer.observe(headerSection, {
                    childList: true,
                    subtree: true
                });
            } else {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

        } catch (error) {
            console.error('ACB Stats - Observer setup failed:', error);
        }
    }

    function checkUrlChange() {
        if (window.location.href === currentUrl) return;

        currentUrl = window.location.href;
        buttonElement = null;
        isAdding = false;
        retryCount = 0;

        setTimeout(checkAndAddButton, 800);
        setTimeout(checkAndAddButton, 1500);
    }

    setInterval(() => {
        checkUrlChange();

        if (window.location.href.includes('/previa')) {
            checkAndAddButton();
        }
    }, 1000);

    window.addEventListener('popstate', () => {
        setTimeout(() => {
            currentUrl = window.location.href;
            buttonElement = null;
            isAdding = false;
            retryCount = 0;
            checkAndAddButton();
        }, 500);
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && window.location.href.includes('/previa')) {
            setTimeout(checkAndAddButton, 300);
        }
    });

    const init = () => {
        if (!window.location.href.includes('/previa')) {
            return;
        }

        setTimeout(() => {
            checkAndAddButton();
            setTimeout(setupObserver, 500);
            setTimeout(checkAndAddButton, 2000);
            setTimeout(checkAndAddButton, 4000);
        }, 500);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();