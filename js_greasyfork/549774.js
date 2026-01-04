// ==UserScript==
// @name         Politics & War - Resource Highlight
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Highlights resources in the toolbar for Politics and War, based on your settings.
// @author       The Snowman
// @license      None
// @match        https://politicsandwar.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549774/Politics%20%20War%20-%20Resource%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/549774/Politics%20%20War%20-%20Resource%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .informationbar, #mobileLinkBarID {
            background-color: black;
        }
        .resource-icon {
            padding: 1px 0px 1px 1px !important;
            border: solid white;
            border-width: 1px 0px 1px 1px;
        }
        .resource-text {
            margin: 0px 3px 0px 0px;
            padding: 1px 1px 1px 0px;
            border: solid white;
            border-width: 1px 1px 1px 0px;
        }
        .resource-danger {
            background-color: #ffb8b8;
            color: black;
        }
        .resource-warning {
            background-color: #ffe4b8;
            color: black;
        }
        .resource-good {
            background-color: #ffffb8;
            color: black;
        }
        .resource-maxlimit {
            background-color: #b8ffb8;
            color: black;
        }
    `);

    var xpathNodeList = document.evaluate("//div[contains(concat(' ', normalize-space(@class), ' '), ' informationbar ')]/span", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (xpathNodeList.snapshotLength > 0) {
        var resourceToolbar = xpathNodeList.snapshotItem(0).childNodes;
        var resource = null;
        var resourceName = null;
        for(var node of resourceToolbar) {
            if(resource === null && node.nodeType === 1 && node.nodeName === 'A') {
                resource = node;
                resourceName = node.getAttribute('aria-label');
            }
            else if(resource !== null && node.nodeType === 3) {
                var resourceAmount = Number(String(node.nodeValue).trim().replace(/\,/g,''));
                var thresholds = getResourceThreshold(resourceName);
                if(Array.isArray(thresholds) && thresholds.length === 3) {
                    var addClass = 'resource-maxlimit';
                    var title = '';
                    var dailyLimit = thresholds[2];
                    var middleLimit = thresholds[1];
                    var maximumLimit = thresholds[0];
                    //1 day limit
                    if(resourceAmount <= dailyLimit) {
                        addClass = 'resource-danger';
                        title = "DANGER!\nBuy " + Intl.NumberFormat().format(maximumLimit - resourceAmount);
                    }
                    //3 day limit
                    else if(resourceAmount <= middleLimit) {
                        addClass = 'resource-warning';
                        title = "WARNING!\nBuy " + Intl.NumberFormat().format(maximumLimit - resourceAmount);
                    }
                    //10 day limit
                    else if(resourceAmount < maximumLimit) {
                        addClass = 'resource-good';
                        title = 'GOOD\nBuy ' + Intl.NumberFormat().format(maximumLimit - resourceAmount);
                    }
                    //warchest stockpile only
                    else if(resourceAmount >= maximumLimit && dailyLimit === 0) {
                        addClass = '';
                        if(resourceAmount > (maximumLimit + 500)) {
                            title += "\nBank " + Intl.NumberFormat().format(resourceAmount - maximumLimit);
                        }
                    }
                    //don't calculate daily consumption of manufactured goods or money
                    if(!['Gasoline', 'Munitions', 'Steel', 'Aluminum', 'Money'].includes(resourceName) && dailyLimit > 0) {
                        addClass = '';
                        title += "\nDays Left " + Math.ceil(resourceAmount / dailyLimit);
                    }
                    var span = document.createElement('span')
                    span.innerHTML = node.nodeValue;
                    span.setAttribute('title',title);
                    if(addClass !== '') {
                        span.setAttribute('class','resource-text ' + addClass);
                    }
                    else {
                        span.setAttribute('class','resource-text');
                    }
                    node.replaceWith(span);
                    if(addClass !== '') {
                        resource.setAttribute('class','resource-icon ' + addClass);
                    }
                    else {
                        resource.setAttribute('class','resource-icon');
                    }
                }
                resource = null;
            }
        }
    }

    function getResourceThreshold(resourceName) {
        var threshold_Peace = {
            'Credits': [3, 2, 1],
            'Coal': [10000, 0, 0],
            'Oil': [10000, 0, 0],
            'Uranium': [4770, 1431, 477],
            'Lead': [23850, 7155, 2385],
            'Iron': [10000, 0, 0],
            'Bauxite': [10000, 0, 0],
            'Gasoline': [50000, 20000, 10000],
            'Munitions': [50000, 20000, 10000],
            'Steel': [50000, 20000, 10000],
            'Aluminum': [50000, 20000, 10000],
            'Food': [500000, 0, 0],
            'Money': [200000000, 0, 0],
        }
        return threshold_Peace.hasOwnProperty(resourceName)?threshold_Peace[resourceName]:null;
    }
})();