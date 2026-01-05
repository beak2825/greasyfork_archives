// ==UserScript==
// @name Reset Steam Workshop Subscriptions
// @name:nl Reset Steam Workshop Abonnementen
// @namespace https://timmy.ws
// @version 1.1.4
// @license MIT
// @supportURL hello@timmy.ws
// @description Unsubscribe from all Steam Workshop Addons with a single click.
// @description:nl Zeg al je Steam Workshop abonnementen op met één enkele klik.
// @author Timmy
// @compatible firefox
// @compatible chrome
// @compatible opera
// @compatible safari
// @match *://steamcommunity.com/id/*/myworkshopfiles/*mysubscriptions*
// @match *://steamcommunity.com/profiles/*/myworkshopfiles/*mysubscriptions*
// @grant GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/9778/Reset%20Steam%20Workshop%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/9778/Reset%20Steam%20Workshop%20Subscriptions.meta.js
// ==/UserScript==

/*jslint browser: true*/

(function () {
    'use strict';

    var addons = [], addonTotal, pageTotal, sessionId;

    // Returns the number of addons the user is subscribed to
    function getAddonTotal() {
        var regex, workshopInfo;
        regex = /([0-9]+)/g;
        workshopInfo = document.getElementsByClassName('workshopBrowsePagingInfo')[0].innerHTML;
        return parseInt(workshopInfo.match(regex)[2], 10);
    }

    // Return the number of pages we have to analyse
    function getPageTotal(addonTotal) {
        return Math.ceil(addonTotal / 30);
    }

    // Returns true if we are on a secured page
    function usingSSL() {
        return (document.location.protocol === 'https:') ? true : false;
    }

    // Returns query variable (https://css-tricks.com/snippets/javascript/get-url-variables/)
    function getQueryVariable(variable) {
        var query, vars, i, pair;

        query = window.location.search.substring(1);
        vars = query.split('&');
        for (i = 0; i < vars.length; i = i + 1) {
            pair = vars[i].split('=');
            if (pair[0] === variable) { return pair[1]; }
        }
        return false;
    }

    // Returns the users' profile id
    function getBaseURL() {
        return document.querySelector(".user_avatar").href;
    }

    // Returns the users' session id
    function getSessionId() {
        return document.getElementById('PublishedFileUnsubscribe').getElementsByTagName('input')[2].value;
    }

    // Returns the appId and name of the game if a filter is applied, or false
    function getAppFilter() {
        var id, name;

        id = getQueryVariable('appid');
        if (!id || id === "0") { return false; }

        name = document.getElementById('searchedForApp').childNodes[0].nodeValue;
        return [ id, name ];
    }

    // Display feedback to user
    function feedback(id, message) {
        var element = document.getElementById(id);

        if (!element) {
            element = document.createElement('div');
            element.id = id;
            document.getElementById('unsub-progress').appendChild(element);
        } else if (element.firstChild) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }

        element.appendChild(document.createTextNode(message));
    }

    // Unsubscribe from all addons
    function processAllAddons(xmlhttp) {
        if (addons.length < addonTotal) { return false; }

        var i, j, handleStateChange, url;

        feedback('ANALYSE_PROG', 'Analysing subscriptions... Done!');

        j = 0;
        handleStateChange = function (index) {
            return function () {
                if (xmlhttp[index].readyState === 4) {
                    j = j + 1;
                    feedback('UNSUB_PROGRESS', 'Unsubscribing from addons... (' + Math.round(j / addonTotal * 100) + '%)');
                    if (j === addonTotal) {
                        feedback('UNSUB_PROGRESS', 'Unsubscribing from addons... Done!');
                        feedback('END', 'Reloading page...');
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    }
                }
            };
        };

        xmlhttp = [];

        url = (usingSSL()) ? 'https' : 'http';
        url += '://steamcommunity.com/sharedfiles/unsubscribe';

        for (i = 0; i < addons.length; i = i + 1) {
            xmlhttp[i] = new XMLHttpRequest();
            xmlhttp[i].open('POST', url);
            xmlhttp[i].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp[i].onreadystatechange = handleStateChange(i);
            xmlhttp[i].send('id=' + addons[i][0] + '&appid=' + addons[i][1] + '&sessionid=' + sessionId);
        }
    }

    // Get subscribed addons for each page and add them to the addons array
    function processSinglePage(xmlhttp, index) {
        if (xmlhttp[index].status === 200) {
            var container, unsubscribeItem, i, itemDetails;

            container = document.implementation.createHTMLDocument().documentElement;
            container.innerHTML = xmlhttp[index].responseText;
            unsubscribeItem = container.querySelectorAll('a[id^="UnsubscribeItemBtn"]');

            for (i = 0; i < unsubscribeItem.length; i = i + 1) {
                itemDetails = decodeURI(unsubscribeItem[i].href).match(/[0-9]+/g); // Extract WorkshopID and AppID
                addons.push([itemDetails[0], itemDetails[1]]);
            }

            processAllAddons(xmlhttp);
        }
    }

    function getAddons() {
        var url, appFilter, xmlhttp, handleStateChange, i;

        appFilter = getAppFilter();

        url = getBaseURL();
        url += '/myworkshopfiles/?browsefilter=mysubscriptions';
        url += appFilter ? '&appid=' + appFilter[0] : '';
        url += '&numperpage=30&p=';

        xmlhttp = [];

        handleStateChange = function (index) {
            return function () {
                if (xmlhttp[index].readyState === 4) {
                    feedback('ANALYSE_PROG', 'Analysing subscriptions... (' + index + '/' + pageTotal + ')');
                    processSinglePage(xmlhttp, index);
                }
            };
        };

        for (i = 1; i <= pageTotal; i = i + 1) {
            xmlhttp[i] = new XMLHttpRequest();
            xmlhttp[i].onreadystatechange = handleStateChange(i);
            xmlhttp[i].open('GET', url + i);
            xmlhttp[i].send();
        }
    }

    // Injects our element in the DOM
    function injectUnsubscriber() {
        if (document.getElementById('no_items')) {
            return false;
        }

        addonTotal = getAddonTotal();
        pageTotal = getPageTotal(addonTotal);
        sessionId = getSessionId();

        var reference, parent, wrap, appFilter, titleText, title, button, clear, leftContents, progress;

        reference = document.getElementById('tabs_basebg_workshop');
        parent = reference.parentNode;

        wrap = document.createElement('div');
        wrap.id = 'unsubscriber';
        parent.insertBefore(wrap, reference);

        appFilter = getAppFilter();
        if (appFilter) {
            titleText = 'Reset Workshop Subscriptions for ' + appFilter[1];
        } else {
            titleText = 'Reset ALL Workshop Subscriptions';
        }

        title = document.createElement('div');
        title.className = 'title';
        title.appendChild(document.createTextNode(titleText));
        wrap.appendChild(title);

        button = document.createElement('div');
        button.className = 'button';
        button.innerHTML = 'Unsubscribe All';
        button.addEventListener('click', function () {
            var confirm = window.confirm("Are you sure you want to " + titleText + "?");

            if (confirm) {
                button.style.pointerEvents = 'none';

                leftContents = document.getElementById('leftContents');
                while (leftContents.firstChild) {
                    leftContents.removeChild(leftContents.firstChild);
                }

                progress = document.createElement('div');
                progress.id = 'unsub-progress';
                progress.className = 'generic-block';
                leftContents.appendChild(progress);

                feedback("START", "Task: " + titleText);

                getAddons();
            }
        });
        wrap.appendChild(button);

        clear = document.createElement('div');
        clear.className = 'clear';
        wrap.appendChild(clear);

        GM_addStyle('#unsubscriber {font-size: 13px; width: 100%; margin-top: 12px; background: rgba(0, 0, 0, 0.4); color: rgb(143, 152, 160); padding: 10px; box-sizing: border-box;}');
        GM_addStyle('#unsubscriber .title {color: #67c1f5; font-size: 16px; font-family: \'Motiva Sans Light\', Arial, Tahoma; float: left;}');
        GM_addStyle('#unsubscriber .button {color: rgba(255, 255, 255, 0.8);background: rgba(231, 76, 60, 0.4); font-size: 13px; padding: 3px 9px; float: right; border-radius: 2px; cursor: pointer;}');
        GM_addStyle('#unsubscriber .button:hover {color: #fff; background: rgba(231, 76, 60, 0.75);}');
        GM_addStyle('#unsubscriber .clear {clear: both;}');
        GM_addStyle('.generic-block {margin-top: 10px; padding: 10px; color: rgb(143, 152, 160); background: rgba(0, 0, 0, 0.4); width: 100%; font-size: 13px; box-sizing: border-box; line-height: 1.5em;}');
        GM_addStyle('.disabled {pointer-events: none; background: rgba(0, 0, 0, 0.7);}');
    }

    injectUnsubscriber();
}());
