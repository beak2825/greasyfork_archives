// ==UserScript==
// @name         OVTLYR Indicators
// @description Adds primary indicators to the OVTLYR 9
// @run-at       document-idle
// @include      /^https?://(www\.)?ovtlyr\.com/dashboard/[a-zA-Z]+$/
// @grant        none
// @license      GPL
// @version 0.0.1.20250829074731
// @namespace https://greasyfork.org/users/1509889
// @downloadURL https://update.greasyfork.org/scripts/547705/OVTLYR%20Indicators.user.js
// @updateURL https://update.greasyfork.org/scripts/547705/OVTLYR%20Indicators.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tooltip text for the indicators (you can edit these)
    // Checks the browser's language to use "favourite" or "favorite"
    const isAmericanEnglish = navigator.language === 'en-US';
    const bftTooltipText = isAmericanEnglish ? "Batman's Favorite Trade" : "Batman's Favourite Trade";
    const tbtTooltipText = "The Big Trend";

    // Lists of box IDs for each indicator type
    const bftBoxes = ['div_sectorFG', 'div_marketBreadth', 'div_stockTrend'];
    const tbtBoxes = ['div_marketTrend', 'div_sectorBreadth', 'div_stockTrend'];
    
    // A map of boxes and the indicator text they should have, along with their position
    const indicatorsData = [{
        id: 'div_sectorFG', text: 'BFT', right: '5px'
    }, {
        id: 'div_marketBreadth', text: 'BFT', right: '5px'
    }, {
        id: 'div_stockTrend', text: 'BFT', right: '5px'
    }, {
        id: 'div_marketTrend', text: 'TBT', left: '5px'
    }, {
        id: 'div_sectorBreadth', text: 'TBT', left: '5px'
    }, {
        id: 'div_stockTrend', text: 'TBT', left: '5px'
    }];
    
    // A single, reusable tooltip element for the entire page
    let tooltip;

    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.display = 'none';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.zIndex = '9999';
        tooltip.style.fontSize = '12px';
        tooltip.style.whiteSpace = 'nowrap';
        document.body.appendChild(tooltip);
    }
    
    function addIndicator(targetId, text, position) {
        const targetBox = document.getElementById(targetId);

        if (targetBox) {
            if (targetBox.querySelector(`.indicator-${text}`)) {
                return;
            }

            const indicator = document.createElement('span');
            indicator.className = `indicator-${text}`;
            indicator.style.position = 'absolute';
            indicator.style.top = '5px';
            indicator.style.padding = '2px 5px';
            indicator.style.borderRadius = '5px';
            indicator.style.color = '#FFFFFF';
            indicator.style.fontSize = '10px';
            indicator.style.fontWeight = 'bold';
            indicator.textContent = text;
            indicator.style.transition = 'background-color 0.5s ease-in-out, box-shadow 0.2s ease-in-out';
            indicator.style.zIndex = '1';
            indicator.style.cursor = 'pointer';

            if (text === 'BFT') {
                indicator.dataset.tooltipText = bftTooltipText;
            } else if (text === 'TBT') {
                indicator.dataset.tooltipText = tbtTooltipText;
            }
            
            if (position.right) {
                indicator.style.right = position.right;
            } else if (position.left) {
                indicator.style.left = position.left;
            }

            const computedStyle = window.getComputedStyle(targetBox);
            if (computedStyle.position === 'static') {
                targetBox.style.position = 'relative';
            }

            targetBox.appendChild(indicator);

            indicator.addEventListener('mouseenter', (event) => {
                const rect = event.target.getBoundingClientRect();
                tooltip.textContent = event.target.dataset.tooltipText;
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
                tooltip.style.display = 'block';
                
                const indicatorType = event.target.textContent;
                const allIndicators = document.querySelectorAll(`.indicator-${indicatorType}`);
                allIndicators.forEach(el => {
                    el.style.boxShadow = '0 0 5px 2px #fff';
                });
            });

            indicator.addEventListener('mouseleave', (event) => {
                tooltip.style.display = 'none';
                
                const indicatorType = event.target.textContent;
                const allIndicators = document.querySelectorAll(`.indicator-${indicatorType}`);
                allIndicators.forEach(el => {
                    el.style.boxShadow = 'none';
                });
            });
        }
    }

    function updateAllIndicatorColors() {
        const isBftPink = bftBoxes.some(id => {
            const el = document.getElementById(id);
            return el && el.classList.contains('pink_backg');
        });
        const bftColor = isBftPink ? '#FF0000' : '#008000';

        const isTbtPink = tbtBoxes.some(id => {
            const el = document.getElementById(id);
            return el && el.classList.contains('pink_backg');
        });
        const tbtColor = isTbtPink ? '#FF0000' : '#008000';

        indicatorsData.forEach(item => {
            const box = document.getElementById(item.id);
            if (box) {
                const indicator = box.querySelector(`.indicator-${item.text}`);
                if (indicator) {
                    if (item.text === 'BFT') {
                        indicator.style.backgroundColor = bftColor;
                    } else if (item.text === 'TBT') {
                        indicator.style.backgroundColor = tbtColor;
                    }
                }
            }
        });
    }

    window.addEventListener('load', () => {
        createTooltip();
        
        const allUniqueBoxes = [...new Set([...bftBoxes, ...tbtBoxes])];
        
        allUniqueBoxes.forEach(id => {
            const targetNode = document.getElementById(id);
            if (targetNode) {
                indicatorsData.filter(item => item.id === id).forEach(item => {
                    if (item.right) {
                        addIndicator(item.id, item.text, { right: item.right });
                    } else if (item.left) {
                        addIndicator(item.id, item.text, { left: item.left });
                    }
                });

                const observer = new MutationObserver(updateAllIndicatorColors);
                observer.observe(targetNode, {
                    attributes: true,
                    attributeFilter: ['class']
                });
            }
        });

        updateAllIndicatorColors();
    });
})();