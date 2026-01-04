// ==UserScript==
// @name          PornteenGirl - Show Related Actress v.1
// @description   PornteenGirl - Show Related Actress + Button To copy Related Actress list
// @author        janvier57
// @namespace     https://greasyfork.org/users/7434
// @include       https://www.pornteengirl.com/model/*
// @match         https://www.pornteengirl.com/model/*
// @version       1.00
// @icon          https://external-content.duckduckgo.com/ip3/www.pornteengirl.com.ico
// @license       unlicense
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556106/PornteenGirl%20-%20Show%20Related%20Actress%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/556106/PornteenGirl%20-%20Show%20Related%20Actress%20v1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract principal actress from URL
    const urlPath = window.location.pathname;
    const principalActress = urlPath.split('/').pop().replace('.html', '');

    // Find scenes list and related actresses
    let scenesList = document.querySelector('section:has([href="/css/list-scenesLast.css"]) .postList ul#scenesContainer');
    if (!scenesList) {
        const noRelatedButton = document.createElement('button');
        noRelatedButton.textContent = 'No Related Actress';
        noRelatedButton.classList.add('RelatedButton');
        document.body.appendChild(noRelatedButton);
        return;
    }

    // Click Show All Scenes button if present
    const showAllScenesButton = document.querySelector('.postList:has(#scenesContainer) + .loadmore .loadmore');
    if (showAllScenesButton) {
        showAllScenesButton.click();
        setTimeout(() => {
            createRelatedList();
        }, 2000);
    } else {
        createRelatedList();
    }

    function createRelatedList() {
        scenesList = document.querySelector('section:has([href="/css/list-scenesLast.css"]) .postList ul#scenesContainer');
        const relatedActresses = {};
        const relatedActressesListItems = scenesList.querySelectorAll('li .badges span.scene-models-list ul a.screenshot');
        relatedActressesListItems.forEach((item) => {
    const href = item.href.split('/').pop().replace('.html', '');
    if (href !== principalActress) {
        relatedActresses[href] = {
            name: href.replace(/[_-]/g, ' ').replace(/\b\w/g, match => match.toUpperCase()),
            image: item.rel,
            link: item.href,
        };
    }
});

        if (Object.keys(relatedActresses).length === 0) {
            const noRelatedButton = document.createElement('button');
            noRelatedButton.textContent = 'No Related Actress';
            noRelatedButton.classList.add('RelatedButton');
            document.body.appendChild(noRelatedButton);
            return;
        }

        // Create button and list for related actresses
        const relatedButton = document.createElement('button');
        relatedButton.textContent = 'Related Actress';
        relatedButton.classList.add('RelatedButton');
        document.body.appendChild(relatedButton);

        const relatedList = document.createElement('ul');
        relatedList.classList.add('RelatedList');
        document.body.appendChild(relatedList);

        GM_addStyle(`
            /* MODEL INFOS - GM "Show Related Actress" */
button.RelatedButton {
	position: fixed;
	right: 0;
	margin: 0vh 0 0 0;
	padding: 4px 5px;
    overflow: hidden;
	z-index: 5000;
background-color: red;
border: 1px solid aqua;
}

ul.RelatedList {
    position: fixed;
    display: none;
	right: 0;
	margin: 2.8vh 0 0 0;
    padding: 10px;
background: white;
border: 1px solid black;
}

ul.RelatedList li {
	display: block;
	width: 100%;
	height: 6.5vh;
	line-height: 6vh;
border: 1px solid black;
}
ul.RelatedList li a {
	display: inline-block;
	width: 100%;
	height: 6.5vh;
	padding: 2px 5px;
border: 1px solid black;
}
ul.RelatedList li a img {
	display: block;
	float: left;
	height: 50px;
	width: 50px;
	margin:  0px 5px 0 0px;
border: 1px solid black;
}

ul.RelatedList button.RelatedButton {
	position: relative;
    width: 100%;
    margin: 2vh 0px 0px;
	overflow: hidden;
background-color: red;
border: 1px solid aqua;
}
        `);

        Object.values(relatedActresses).forEach((actress) => {
            const listItem = document.createElement('li');
            const image = document.createElement('img');
            image.onerror = function() {
                this.style.display = 'none';
            };
            image.src = actress.image;

            const link = document.createElement('a');
            link.href = actress.link;
            link.appendChild(image);
            link.appendChild(document.createTextNode(actress.name));

            listItem.appendChild(link);
            relatedList.appendChild(listItem);
        });

        // Copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Related Names';
        copyButton.classList.add('RelatedButton');
        relatedList.appendChild(copyButton);

        relatedButton.addEventListener('mouseover', () => {
            relatedList.style.display = 'inline-block';
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target !== relatedButton && e.target !== copyButton && !relatedList.contains(e.target)) {
                relatedList.style.display = 'none';
            }
        });

        copyButton.addEventListener('click', () => {
            let relatedNames = 'Related:\n';
            Object.values(relatedActresses).forEach((actress, index) => {
                relatedNames += actress.name;
                if (index < Object.keys(relatedActresses).length - 1) {
                    relatedNames += ', ';
                }
            });
            navigator.clipboard.writeText(relatedNames);
        });
    }
})();

