// ==UserScript==
// @name         Attack Button TEST
// @version      1.0.0
// @description  Adds attack button to hosped player
// @author       Krimian
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @match        https://www.torn.com/hospitalview.php*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://code.jquery.com/jquery-1.8.2.min.js
// @connect      api.torn.com
// @connect      tornstats.com

// @namespace https://greasyfork.org/users/1485200
// @downloadURL https://update.greasyfork.org/scripts/556651/Attack%20Button%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/556651/Attack%20Button%20TEST.meta.js
// ==/UserScript==
var targetID;

const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    var [resource, config] = args;
    var response = await originalFetch(resource, config);
    const json = () => response.clone().json()
    .then((data) => {
        data = { ...data };
        if(response.url.indexOf('?sid=attackData') != -1) {
            if(data.DB.error?.includes('in hospital') || data.DB.error?.includes('unconscious') || data.DB.error?.includes('This fight no longer exists')) {
                data.DB.defenderUser.playername += ' [Hospital]'
                delete data.DB.error
                delete data.startErrorTitle
            }
        }

        return data
    })

    response.json = json;
    response.text = async () =>JSON.stringify(await json());

    if(response.url.indexOf('?sid=attackData') != -1) {
        response.json().then( r => startAttack(r))
    }

    return response;
};

async function once(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!targetID) return;
    $(event.target).attr('disabled','disabled');
    const request_url = `https://www.torn.com/loader.php?sid=attackData&mode=json&user2ID=${targetID}&rfcv=${getRFC()}&step=poll`;
    const response = await unsafeWindow.fetch(request_url, {
        "credentials": "same-origin",
        "headers": {
            "X-Requested-With": "XMLHttpRequest",
        },
        "method": "GET"
    });
    const result = await response.json();
    $(event.target).removeAttr('disabled');
}

async function startAttack(r) {
    var elm = await waitForElm(`[class*='dialogButtons_'] button.torn-btn[type="submit"]`);
    var btn = $(elm);

    if (elm && btn && btn.length) {
        if(r.DB.defenderUser.playername.includes('[Hospital]') || r.DB?.startButtonTimer?.timeLeft > 0) {
            btn.addClass('disabled');
            elm.addEventListener("click", once, false);
        } else {
            if(btn.hasClass('disabled')){
                btn.removeClass('disabled');
                elm.removeEventListener("click", once, false);
            }
        }
    }
}

$( document ).ready(function() {
    'use strict';
    const url = window.location.href;

    if (url.includes("loader.php") && url.includes("sid=attack")) {
        targetID = url.split('ID=').pop();
    }

});

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}