// ==UserScript==
// @name         WWsteden
// @version      1.0.0
// @author       Ikzelf
// @description wwsteden
// @include https://nl*.grepolis.com/game/*
// @include https://es*.grepolis.com/game/*
// @exclude forum.*.grepolis.*/*
// @exclude wiki.*.grepolis.*/*
// @grant        none
// @namespace https://greasyfork.org/users/984383
// @downloadURL https://update.greasyfork.org/scripts/550278/WWsteden.user.js
// @updateURL https://update.greasyfork.org/scripts/550278/WWsteden.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const draggableStyles = `
        .draggable-box {
            position: fixed;
            bottom: 50px;
            right: 125px;
            background-color: rgba(255, 255, 255, 0.8);
            border: 1px solid #ccc;
            padding: 10px;
            max-width: 300px;
            overflow: auto;
            z-index: 999;
            cursor: move;
        }

        #triggerButton {
            position: fixed;
            bottom: 10px;
            right: 150px;
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 10px;
            cursor: pointer;
            z-index: 1000; /* Ensure the button is above other elements */
        }
    `;

    const draggableStyleElement = document.createElement('style');
    draggableStyleElement.innerHTML = draggableStyles;
    document.head.appendChild(draggableStyleElement);

    // Create the draggable feed box
    const draggableFeedBox = document.createElement('div');
    draggableFeedBox.className = 'draggable-box';
    draggableFeedBox.id = 'draggableFeedBox';
    document.body.appendChild(draggableFeedBox);

    // Make the feed box draggable
    makeElementDraggable(draggableFeedBox);

    function makeElementDraggable(element) {
        let offsetX, offsetY, isDragging = false;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = e.clientX - offsetX + 'px';
                element.style.top = e.clientY - offsetY + 'px';
            }
        });
    }

    function clearFeed() {
        // Clear all child elements (messages) from the feed box
        while (draggableFeedBox.firstChild) {
            draggableFeedBox.removeChild(draggableFeedBox.firstChild);
        }
    }

    function appendToFeed(townId, townName, message) {
        const townLink = generateTownLink(townId, townName);
        const newMessage = document.createElement('div');
        newMessage.innerHTML = `${townLink}: ${message}`;
        newMessage.style.color = 'black';
        newMessage.style.backgroundColor = 'white';
        draggableFeedBox.appendChild(newMessage);
    }

    function generateTownLink(townId, townName) {
        const encodedData = btoa(JSON.stringify({ id: townId, ix: 436, iy: 445, tp: 'town', name: townName }));
        return `<a href="#${encodedData}" class="gp_town_link">${townName}</a>`;
    }

    // Button to trigger the method
    const triggerButton = document.createElement('button');
    triggerButton.textContent = 'Trigger Method';
    triggerButton.id = 'triggerButton';
    document.body.appendChild(triggerButton);

    triggerButton.onclick = () => {
        clearFeed();
        const towns = Object.values(ITowns.getTowns());
        const townList = MM.getModels().Town;


        for (const town of towns) {
            const buildingsAttributes = town.buildings().attributes;
            let returnMessage = '';
            const currentTown = townList[town.id]
            if (
                buildingsAttributes.stoner !== 40 ||
                buildingsAttributes.ironer !== 40 ||
                buildingsAttributes.lumber !== 40 ||
                buildingsAttributes.market !== 30 ||
                buildingsAttributes.temple !== 30 ||
                buildingsAttributes.storage !== 35 ||
                buildingsAttributes.trade_office !== 1
            ) {
                appendToFeed(town.getId(), town.getName(), returnMessage);
            }
        }
    };

})();