// ==UserScript==
// @name         Infoclimat - Ajouter liens d'accès direct
// @namespace    https://greasyfork.org/fr/users/1528785
// @version      1.1
// @description  Ajoute des liens d'accès rapide dans le slider d'Infoclimat.
// @author       rommar31
// @match        https://www.infoclimat.fr/*
// @icon         https://static.infoclimat.net/images/minilogoo.png
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553391/Infoclimat%20-%20Ajouter%20liens%20d%27acc%C3%A8s%20direct.user.js
// @updateURL https://update.greasyfork.org/scripts/553391/Infoclimat%20-%20Ajouter%20liens%20d%27acc%C3%A8s%20direct.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_UL_SELECTOR = '#slider-photolive';
    const ITEM_ID_PHOTO = 'tamper-photo-li-infoclimat';
    const ITEM_ID_DUAL = 'tamper-photo-li-itn-ipn';
    const LINK_PHOTO = {
        url: 'https://www.infoclimat.fr/photolive-photos-meteo-temps-reel.html',
        text: 'Voir les photos'
    };
    const LINKS_DUAL = [
        { text: 'ITN', url: 'https://www.infoclimat.fr/climato/indicateur_national.php' },
        { text: 'IPN', url: 'https://www.infoclimat.fr/climato/indicateur_national_RR.php' }
    ];
    const NEW_WIDTH = '1186px'

    function createLink(href, text) {
        const a = document.createElement('a');
        a.href = href;
        a.rel = 'noopener noreferrer';
        a.textContent = text;
        a.style.color = '#ffffff';
        a.style.fontWeight = 'bold';
        a.style.textDecoration = 'none';
        a.style.display = 'flex';
        a.style.alignItems = 'center';
        a.style.justifyContent = 'center';
        a.style.height = '50%'; // chaque lien prend la moitié du li
        return a;
    }

    function createPhotoLi(ul) {
        if (!ul || document.getElementById(ITEM_ID_PHOTO)) return;

        const li = document.createElement('li');
        li.id = ITEM_ID_PHOTO;
        if (ul.firstElementChild) li.className = ul.firstElementChild.className;

        const a = createLink(LINK_PHOTO.url, LINK_PHOTO.text);
        li.appendChild(a);

        Object.assign(li.style, {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '71px',
            width: '90px',
            borderRadius: '4px',
            border: '3px solid white',
            boxSizing: 'border-box',
            marginTop: '12px',
            padding: '0',
        });

        ul.appendChild(li);
    }

function createDualLi(ul) {
        if (!ul || document.getElementById(ITEM_ID_DUAL)) return;

        const li = document.createElement('li');
        li.id = ITEM_ID_DUAL;
        if (ul.firstElementChild) li.className = ul.firstElementChild.className;

        li.style.display = 'flex';
        li.style.flexDirection = 'column';
        li.style.alignItems = 'center';
        li.style.justifyContent = 'center';
        li.style.height = '71px';
        li.style.width = '90px';
        li.style.borderRadius = '4px';
        li.style.border = '3px solid white';
        li.style.boxSizing = 'border-box';
        li.style.margin = '12px 6px 0 6px';
        li.style.padding = '0';
        li.style.overflow = 'hidden';

        LINKS_DUAL.forEach(link => {
            const a = createLink(link.url, link.text);
            a.style.borderBottom = '1px solid rgba(255,255,255,0.4)';
            li.appendChild(a);
        });

        // enlever la bordure du bas du dernier lien
        if (li.lastChild) li.lastChild.style.borderBottom = 'none';

        ul.appendChild(li);
    }

    function widenHeaderContainer() {
        const container = document.querySelector('.pl-header-container');
        if (container) {
            container.style.width = NEW_WIDTH;
            return true;
        }
        return false;
    }

    function applyAll() {
        const ul = document.querySelector(TARGET_UL_SELECTOR);
        widenHeaderContainer();
        createPhotoLi(ul);
        createDualLi(ul);
    }

    applyAll();

})();
