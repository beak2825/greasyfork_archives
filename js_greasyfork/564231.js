// ==UserScript==
// @name         FPL Faces
// @namespace    http://tampermonkey.net/
// @version      2.0
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
        /* BASE FACE STYLE */
        .tm-fpl-face {
            object-fit: contain;
            display: block;
            margin: 0 auto;
            z-index: 10;
            filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.2));
            pointer-events: none;
        }

        /* TRANSFERS PAGE */
        .tm-face-transfer {
            width: 70px !important;  
            height: 70px !important; 
            margin-bottom: 30px;      /* Tiny gap above name */
        }

        /* PICK TEAM PAGE */
        .tm-face-pickteam {
            width: 69px !important;  
            height: 90px !important; 
            margin-bottom: 32px;      /* Pull closer to name */
        }

        /* HIDE SHIRTS */
        button[data-pitch-element="true"] picture {
            display: none !important;
        }

        button[data-pitch-element="true"] div[class*="_2j6lqn0"] {
            justify-content: flex-end; /* Align to bottom (name bar) */
        }

        @media (max-width: 700px) {
            .tm-face-pickteam {
                width: 12vw !important;
                height: 11vw !important;
                max-width: 100px !important;
                margin-bottom: 4.5vw;
            }

            .tm-face-transfer {
                width: 11vw !important;
                height: 10.25vw !important;
                margin-bottom: 5.5vw;
            }
        }

        @media (max-width: 420px) {
            .tm-face-pickteam {
                width: 12vw !important;
                height: 12vw !important;
                max-width: 100px !important;
                margin-bottom: 4.5vw;
            }

            .tm-face-transfer {
                width: 11vw !important;
                height: 11.5vw !important;
                margin-bottom: 5.5vw;
            }
        }

        @media (max-width: 366px) {
            .tm-face-pickteam {
                width: 12vw !important;
                height: 13.5vw !important;
                max-width: 100px !important;
                margin-bottom: 4.5vw;
            }

            .tm-face-transfer {
                width: 11vw !important;
                height: 13.75vw !important;
                margin-bottom: 4.5vw;
            }
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
            if (!pictureTag || !pictureTag.nextElementSibling) return;
            const nameContainer = pictureTag.nextElementSibling;
            const nameSpan = nameContainer.querySelector('span');
            if (!nameSpan) return;
            const webName = nameSpan.textContent;

            

            // parent container of the picture
            const parentDiv = pictureTag.parentNode;
            const priceTag = parentDiv.querySelector('span:first-child');

            
            const isTransferPage = priceTag && priceTag.textContent.includes('£');

            // image url
            const faceUrl = getPlayerPhoto(webName, teamName);

            if (faceUrl) {
                const newImg = document.createElement('img');
                newImg.src = faceUrl;
                newImg.className = 'tm-fpl-face'; 

                
                if (isTransferPage) {
                    newImg.classList.add('tm-face-transfer');
                } else {
                    newImg.classList.add('tm-face-pickteam');
                }

                
                pictureTag.parentNode.insertBefore(newImg, pictureTag);
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