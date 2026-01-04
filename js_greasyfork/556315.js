// ==UserScript==
// @name         TMN Mobile AIO
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  TMN Mobile AIO Script
// @author       Pap
// @license      MIT
// @match        https://*.tmn2010.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556315/TMN%20Mobile%20AIO.user.js
// @updateURL https://update.greasyfork.org/scripts/556315/TMN%20Mobile%20AIO.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const $ = window.jQuery;
    async function getFormState(url) {
        // Fetch the page with credentials
        const html = await fetch(url, { credentials: 'include' }).then(r => r.text());

        // Parse HTML
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Extract ASP.NET hidden fields
        const viewstate = doc.querySelector('#__VIEWSTATE')?.value ?? '';
        const eventval = doc.querySelector('#__EVENTVALIDATION')?.value ?? '';
        const viewstategen = doc.querySelector('#__VIEWSTATEGENERATOR')?.value ?? '';
        const viewstateenc = doc.querySelector('#__VIEWSTATEENCRYPTED')?.value ?? '';

        return { viewstate, eventval, viewstategen, viewstateenc, doc };
    }

    async function doBooze() {
        // Get the form state
        const state = await getFormState('crimes.aspx?p=b');
        const doc = state.doc;
        if ($(doc).find('#ctl00_main_lblResult').length) return;

        // Build POST body
        const body = new URLSearchParams();
        //body.append('__EVENTTARGET', '');
        //body.append('__EVENTARGUMENT', '');
        body.append('__VIEWSTATE', state.viewstate);
        body.append('__VIEWSTATEGENERATOR', state.viewstategen);
        if (state.viewstateenc) body.append('__VIEWSTATEENCRYPTED', state.viewstateenc);
        body.append('__EVENTVALIDATION', state.eventval);

        // Parse Booze rows
        const rows = [...doc.querySelectorAll('#ctl00_main_gvBooze.NewGridCenter tr')].slice(1).map((row, index) => {
            const tds = row.querySelectorAll('td');
            return {
                price: parseInt(tds[1].textContent.replace(/\D/g, '')) || Infinity,
                holdings: parseInt(tds[2].textContent.replace(/\D/g, '')) || 0,
                index
            };
        });

        const cash = parseInt(doc.querySelector('#ctl00_userInfo_lblcash')?.textContent.replace(/\D/g, '') || '0');
        //let amountLimit = parseInt(doc.body.textContent.match(/Maximum for your rank is: (\d+)/)?.[1] || '999');
        let amountLimit = 59;

        const sellRow = rows.find(r => r.holdings > 0);
        let prefix, qty;

        // Action-specific fields
        if (sellRow) {
            prefix = `ctl00$main$gvBooze$ctl${String(sellRow.index + 2).padStart(2, '0')}`;
            body.append(`${prefix}$tbAmtSell`, '1');
            body.append(`${prefix}$btnSell`, 'Sell');
        } else {
            const cheapest = rows.reduce((a, b) => a.price < b.price ? a : b);
            qty = Math.floor(Math.min(cash / cheapest.price, amountLimit));
            prefix = `ctl00$main$gvBooze$ctl${String(cheapest.index + 2).padStart(2, '0')}`;
            body.append(`${prefix}$tbAmtBuy`, qty);
            body.append(`${prefix}$btnBuy`, 'Buy');
        }

        // Send the POST request
        const result = await fetch('crimes.aspx?p=b', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        }).then(r => r.text());

        // Parse the response HTML using jQuery
        const $resultDoc = $('<div>').html(result);
        const $resultContent = $resultDoc.find('#ctl00_lblMsg');

        if ($resultContent.length === 0) {
            console.warn('No element #ctl00_lblMsg found in the response.');
            return;
        }

        $resultContent.appendTo('#divContentIn');
    }

    async function doCrime(victimName = "Victim's name") {
        // Get the form state
        const state = await getFormState('crimes.aspx');
        const doc = state.doc;
        if ($(doc).find('#ctl00_main_lblResult').length) return;

        // Build POST body
        const body = new URLSearchParams();
        //body.append('__EVENTTARGET', '');
        //body.append('__EVENTARGUMENT', '');
        body.append('__VIEWSTATE', state.viewstate);
        body.append('__VIEWSTATEGENERATOR', state.viewstategen);
        if (state.viewstateenc) body.append('__VIEWSTATEENCRYPTED', state.viewstateenc);
        body.append('__EVENTVALIDATION', state.eventval);

        // Action-specific fields
        const randX = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
        const randY = Math.floor(Math.random() * (70 - 30 + 1)) + 30;

        body.append('ctl00$main$btnCrime1.x', randX);
        body.append('ctl00$main$btnCrime1.y', randY);
        body.append('ctl00$main$tbPickPocket', victimName);

        // Send the POST request
        const result = await fetch('crimes.aspx', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        }).then(r => r.text());

        // Parse the response HTML using jQuery
        const $resultDoc = $('<div>').html(result);
        const $resultContent = $resultDoc.find('#ctl00_main_pnlResult');

        if ($resultContent.length === 0) {
            console.warn('No element #ctl00_main_pnlResult found in the response.');
            return;
        }

        $resultContent.appendTo('#divContentIn');
    }

    async function doGTA() {
        // Get the form state
        const state = await getFormState('crimes.aspx?p=g');
        const doc = state.doc;
        if ($(doc).find('#ctl00_main_lblResult').length) return;

        // Build POST body
        const body = new URLSearchParams();
        //body.append('__EVENTTARGET', '');
        //body.append('__EVENTARGUMENT', '');
        body.append('__VIEWSTATE', state.viewstate);
        body.append('__VIEWSTATEGENERATOR', state.viewstategen);
        if (state.viewstateenc) body.append('__VIEWSTATEENCRYPTED', state.viewstateenc);
        body.append('__EVENTVALIDATION', state.eventval);

        // Action-specific fields
        body.append('ctl00$main$carslist', 5);
        body.append('ctl00$main$ddlNetworkList', 1);
        body.append('ctl00$main$btnStealACar', 'Steal a car');

        // Send the POST request
        const result = await fetch('crimes.aspx?p=g', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body
        }).then(r => r.text());

        // Parse the response HTML using jQuery
        const $resultDoc = $('<div>').html(result);
        const $resultContent = $resultDoc.find('#ctl00_main_pnlResult');

        if ($resultContent.length === 0) {
            console.warn('No element #ctl00_main_pnlResult found in the response.');
            return;
        }

        $resultContent.appendTo('#divContentIn');
    }

    await doBooze();
    await doCrime();
    await doGTA();
})();