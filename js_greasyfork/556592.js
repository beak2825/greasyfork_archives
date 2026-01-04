// ==UserScript==
// @name         eRepublikTraveler
// @namespace    http://tampermonkey.net/
// @version      2025-06-08
// @description  Travel between Sevilla, Spain and Wellington, New Zealand.
// @author       You
// @license      MIT
// @match        https://www.erepublik.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/556592/eRepublikTraveler.user.js
// @updateURL https://update.greasyfork.org/scripts/556592/eRepublikTraveler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = `.hidden { display: none; }
      #rafael-traveler-indicator { display: inline-block; width: 10px; }
      .rafael-traveler-content-container li {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
      }
      .rafael-traveler-content-container li.hidden { display: none; }
      .rafael-traveler-content-container li div {
        margin-bottom: 4px;
      }
      .rafael-traveler-content-body { display: flex; align-items: center; }
      .rafael-traveler-content-header { text-align: center; }
    `;

    const addCSS = document.head.appendChild(document.createElement("style")).innerHTML = style;

    let campaigns = [];
    let sortedCampaigns = [];
    let innerContent;
    let timeoutId;

    function createContainer() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.right = 0;
        container.style.width = 'auto';
        container.style.top = '20px';
        container.style.border = 'solid 1px #000';
        container.style.backgroundColor = '#fff';
        container.style.padding = '8px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.classList.add('rafael-traveler-container');

        const title = document.createElement('p');
        title.innerHTML = 'Traveler <span id="rafael-traveler-indicator">+</span>';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '4px';
        title.style.cursor = 'pointer';
        title.style.textAlign = 'right';

        innerContent = document.createElement('div');
        innerContent.id = 'rafael-traveler-content';
        innerContent.classList.add('hidden');


        title.addEventListener('click', () => toggleVisibility(innerContent, document.querySelector('#rafael-traveler-indicator')));

        container.appendChild(title);
        container.appendChild(innerContent);

        const body = document.querySelector('body');
        body.appendChild(container);

        const containerContent = document.createElement('div');
        innerContent.innerHTML = `<ul class="rafael-traveler-content-container" style="display: flex; flex-direction: column;">
        <li>
            <div class="rafael-traveler-content-header">Viagem 1</div>
            <div class="rafael-traveler-content-body" style="display:flex">
                <div class="rafael-traveler-content-data-to" style="flex: 1;">Para <span>Sevilla</span></div>
                <div class="rafael-traveler-content-action-travel"><button id="travel1">Ir</button></div>
            </div>
        </li>
        <li>
            <div class="rafael-traveler-content-header">Viagem 2</div>
            <div class="rafael-traveler-content-body" style="display:flex">
                <div class="rafael-traveler-content-data-to" style="flex: 1;">Para <span>Wellington</span></div>
                <div class="rafael-traveler-content-action-travel"><button id="travel2">Ir</button></div>
            </div>
        </li>
        <li>
            <div class="rafael-traveler-content-header">Kms a viajar</div>
            <div style="display:flex">
                <div class="rafael-traveler-content-travel-distance" style="flex: 1;"><input min="1" type="number" id="rafaelTravelDistance"></div>
            </div>
        </li>
         <li>
            <div class="rafael-traveler-content-header"></div>
            <div style="display:flex">
                <div class="rafael-traveler-content-travel-distance" style="flex: 1;"><button id="travel">Viajar automaticamete</button></div>
            </div>
        </li>
        <li class="travel-report hidden">
            <div class="rafael-traveler-content-header">Travel report</div>
            <div style="display:flex">
                <div class="rafael-traveler-content-travel-report" style="flex: 1;"><span class="distance-complete"></span>km de <span class="distance-total">km</div>
            </div>
        </li></ul>`;

        const travel1 = innerContent.querySelector('#travel1');
        travel1.addEventListener('click', async () => await travelFn1());

        const travel2 = innerContent.querySelector('#travel2');
        travel2.addEventListener('click', async () => await travelFn2());

        const travel = innerContent.querySelector('#travel');
        travel.addEventListener('click', async () => await automatedTravel());
    }

    async function travelFn1() {
        const travel1 = innerContent.querySelector('#travel1');
        travel1.setAttribute('disabled', true);

        const code = await travelTo(15, 167);

        travel1.removeAttribute('disabled');
        return code;
    }

    async function travelFn2() {
        const travel2 = innerContent.querySelector('#travel2');
        travel2.setAttribute('disabled', true);

        const code = await travelTo(84, 714);

        travel2.removeAttribute('disabled');
        return code;
    }

    let travelComplete = true;
    let distanceComplete = 0;
    const travelKm = 19566;
    async function automatedTravel() {
        const travel = document.querySelector('#travel');
        travel.setAttribute('disabled', true)
        distanceComplete = 0;

        const report = document.querySelector('.travel-report');
        const totalDistanceInput = Number(document.querySelector('#rafaelTravelDistance').value);
        const totalDistance = document.querySelector('.distance-total');
        const totalComplete = document.querySelector('.distance-complete');
        totalDistance.innerText = totalDistanceInput;
        totalComplete.innerText = distanceComplete;

        report.classList.remove('hidden');
        pacedTravel(distanceComplete, travelFn1, 3000);
    }

    async function travelTo(country, region) {
        const code = await travel(country, region);
        return code;
   }

    async function toggleVisibility(element, indicator) {
        if (element.classList.contains('hidden')) {
            element.classList.remove('hidden');
            indicator.innerText = '-';
        } else {
            element.classList.add('hidden');
            indicator.innerText = '+';
            clearTimeout(timeoutId);
        }
    }

    function handleTravelComplete() {
        const travel = document.querySelector('#travel');
        travel.removeAttribute('disabled');

        setTimeout(() => {
            const report = document.querySelector('.travel-report');
            report.classList.add('hidden');
        }, 3000);
    }

    function loadContent(content) {
        innerContent.innerHTML = content;
    }

    async function travel(country, region) {
        const response = await fetch("https://www.erepublik.com/en/main/travel", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9,pt;q=0.8",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
                "sec-ch-ua-arch": "\"x86\"",
                "sec-ch-ua-bitness": "\"64\"",
                "sec-ch-ua-full-version": "\"128.0.6613.138\"",
                "sec-ch-ua-full-version-list": "\"Chromium\";v=\"128.0.6613.138\", \"Not;A=Brand\";v=\"24.0.0.0\", \"Google Chrome\";v=\"128.0.6613.138\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-model": "\"\"",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-ch-ua-platform-version": "\"10.15.1\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://www.erepublik.com/en/main/city/Clermont-Ferrand/overview",
            "referrerPolicy": "same-origin",
            "body": `check=moveAction&_token=${unsafeWindow.SERVER_DATA.csrfToken}&travelMethod=preferCurrency&inRegionId=${region}&toCountryId=${country}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        if (response.status === 200) {
            return true;
        }

        return false;
    }

    async function pacedTravel(distanceTraveled, travelFn, backoff) {
        const totalDistanceInput = Number(document.querySelector('#rafaelTravelDistance').value);

        const totalComplete = document.querySelector('.distance-complete');
        totalComplete.innerText = distanceTraveled;

        if (distanceTraveled >= totalDistanceInput || isNaN(totalDistanceInput) || !totalDistanceInput) {
            handleTravelComplete();
            return;
        }

        distanceTraveled += travelKm;
        const response = await travelFn();

        if (!response) {
            handleTravelComplete();
        }

        timeoutId = setTimeout(async () => await pacedTravel(distanceTraveled, travelFn === travelFn1 ? travelFn2 : travelFn1, backoff), backoff);
    }

    createContainer();
})();