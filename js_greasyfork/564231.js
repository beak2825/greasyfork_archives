// ==UserScript==
// @name         FPL Faces
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Replaces player jerseys with faces
// @author       Luigi
// @match        https://fantasy.premierleague.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/564231/FPL%20Faces.user.js
// @updateURL https://update.greasyfork.org/scripts/564231/FPL%20Faces.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`

        button.tm-card-pickteam {
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-bottom: 0 !important;
        }


        button.tm-card-pickteam div[class*="_2j6lqn0"] {
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
            align-items: center !important;

            /* Remove internal gaps */
            padding: 0 !important;
            margin: 0 !important;

            height: 100% !important;
            width: 100% !important;
            position: relative !important;
        }


        .tm-face-pickteam {
            order: 1 !important;
            flex: 1 1 auto !important;


            width: auto !important;
            height: auto !important;
            max-height: 65% !important;
            max-width: 85% !important;

            margin: 0 auto !important;
            margin-bottom: -1px !important;

            object-fit: contain !important;
            object-position: bottom center !important;
            z-index: 1 !important;
            pointer-events: none;
        }


        button.tm-card-pickteam div[class*="_5supsj"] {
            order: 2 !important;
            flex: 0 0 auto !important;


            width: 100% !important;
            margin: 0 !important;
            max-width: none !important;

            z-index: 20 !important;
            position: relative !important;


            border-radius: 0 0 6px 6px !important;
        }

        button.tm-card-transfer {
            position: relative !important;
        }

        .tm-face-transfer {
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 auto !important;
            display: block !important;
            top: 22px !important;
            bottom: 58px !important;
            width: 75% !important;
            max-width: 70px !important;
            object-fit: contain !important;
            object-position: bottom center !important;
            z-index: 0 !important;
            pointer-events: none;
        }

        button.tm-card-transfer div[class*="_2j6lqn0"] {
            z-index: 20 !important;
            position: relative !important;
        }

        button[data-pitch-element="true"] picture {
            display: none !important;
        }
    `);

    let playersData = [];
    let teamsData = [];
    let isDataLoaded = false;


    function fetchFPLData() {
        if (isDataLoaded) return;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://fantasy.premierleague.com/api/bootstrap-static/",
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    playersData = data.elements;
                    teamsData = data.teams;
                    isDataLoaded = true;
                    console.log('FPL Faces: Database loaded.');
                    runScript();
                }
            }
        });
    }


    function getPlayerPhoto(webName, teamNameRaw) {
        if (!isDataLoaded || !webName || !teamNameRaw) return null;
        const cleanTeamName = teamNameRaw.trim();
        const teamObj = teamsData.find(t => t.name === cleanTeamName || t.short_name === cleanTeamName);
        if (!teamObj) return null;
        const playerObj = playersData.find(p => p.team === teamObj.id && p.web_name === webName.trim());

        if (playerObj) {
            let code = playerObj.photo.replace('.jpg', '.png');
            return `https://resources.premierleague.com/premierleague25/photos/players/110x140/${code}`;
        }
        return null;
    }


    function runScript() {
        if (!isDataLoaded) return;

        const playerCards = document.querySelectorAll('button[data-pitch-element="true"]:not(.tm-processed)');

        playerCards.forEach(card => {
            const shirtImg = card.querySelector('picture img');
            if (!shirtImg) return;
            const teamName = shirtImg.getAttribute('alt');

            const pictureTag = card.querySelector('picture');
            if (!pictureTag) return;
            const innerContainer = pictureTag.parentNode;

            const nameContainer = pictureTag.nextElementSibling;
            if (!nameContainer) return;
            const nameSpan = nameContainer.querySelector('span');
            if (!nameSpan) return;
            const webName = nameSpan.textContent;

            const parentDiv = innerContainer.parentNode;
            const priceTag = parentDiv ? parentDiv.querySelector('span') : null;
            const isTransferPage = priceTag && priceTag.textContent.includes('£');

            const faceUrl = getPlayerPhoto(webName, teamName);

            if (faceUrl) {
                const newImg = document.createElement('img');
                newImg.src = faceUrl;
                newImg.className = 'tm-fpl-face';

                if (isTransferPage) {
                    newImg.classList.add('tm-face-transfer');
                    card.classList.add('tm-card-transfer');
                } else {
                    newImg.classList.add('tm-face-pickteam');
                    card.classList.add('tm-card-pickteam');
                }

                innerContainer.insertBefore(newImg, pictureTag);
                card.classList.add('tm-processed');
            }
        });
    }

    const observer = new MutationObserver(() => {
        runScript();
    });

    fetchFPLData();

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();