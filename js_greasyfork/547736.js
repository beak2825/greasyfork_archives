// ==UserScript==
// @name         Amazon LibGen Buttons
// @version      2.9
// @description  Adds LibGen buttons to Amazon books pages.
// @authors      Hugo, Flejta
// @match        https://www.amazon.*/*
// @grant        none
// @namespace https://greasyfork.org/users/1327664
// @downloadURL https://update.greasyfork.org/scripts/547736/Amazon%20LibGen%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/547736/Amazon%20LibGen%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var BASEURL = 'http://libgen.li/';

    function getAuthor() {
        var author = document.querySelector('span.author span a.contributorNameID') || document.querySelector('span.author a.a-link-normal') || document.getElementById('bylineContributor') || document.getElementById('contributorLink');
        return author.innerText.trim();
    }

    function getTitle() {
        var title = document.getElementById('productTitle') || document.getElementById('title') || document.getElementById('ebooksTitle');
        return title.innerText.trim();
    }

    function addLinkElem(id, elem) {
        document.getElementById(id).appendChild(elem);
    }

    function createLibgenDiv() {
        // Outer div
        var outerDiv = document.createElement('div');
        outerDiv.className = 'a-size-base';

        if (document.getElementById('dp') && document.getElementById('dp').className.trim() == 'ebooks_mobile') {
            outerDiv.style.margin = '20px';
            document.getElementById('dp').insertBefore(outerDiv, document.getElementsByClassName('a-container')[0]);
        } else {
            var parentDivId = '[id*="Northstar-Buybox"]';
            var parentDiv = document.querySelector(parentDivId);
            parentDiv.insertBefore(outerDiv, document.querySelector(parentDivId + ' [id*="mediamatrix" i]'));
        }

        outerDiv.style.padding = '8px';
        outerDiv.style.border = '3px solid rgb(160, 0, 0)';

        // LibGen div
        var libgenDiv = document.createElement('div');
        libgenDiv.id = 'libgen';
        libgenDiv.style.display = 'flex';
        libgenDiv.style.flexDirection = 'column';
        libgenDiv.style.alignItems = 'center';

        var boxTitle = document.createElement('b');
        boxTitle.innerText = 'LibGen Search:';
        boxTitle.style.border = '1px solid transparent';
        boxTitle.style.marginBottom = '2px';

        var links = document.createElement('div');
        links.id = 'container';
        links.style.display = 'flex';

        libgenDiv.appendChild(boxTitle);
        libgenDiv.appendChild(links);
        outerDiv.appendChild(libgenDiv);

        // Mobile-specific Styles
        var parentDivIdMobile = '[id*="Northstar-Buybox-Mobile"]';
        if (document.querySelector(parentDivIdMobile)) {
            document.querySelector(parentDivIdMobile + ' .a-size-base').style.marginTop = '10px';
            document.querySelector(parentDivIdMobile + ' .a-size-base b').style.marginBottom = '4px';
        }
    }

    function createLink(href, text) {
        var container = document.createElement('div');
        container.style.padding = '0 5px';
        var innerContainer = document.createElement('div');
        innerContainer.style.border = '1px solid rgb(127, 127, 127)';
        innerContainer.style.padding = '0 5px';
        var a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.innerText = text;
        innerContainer.appendChild(a);
        container.appendChild(innerContainer);
        return container;
    }

    function addIsbnSearchLink(isbnType) {
        var isbnElement = document.querySelector(`[id*="${isbnType.toLowerCase().replace(/-/, '')}"] :last-child span`);
        if (isbnElement) {
            var url = BASEURL + 'index.php?req=' + isbnElement.innerText.replace(/-/, '') + '&columns[]=i';
            addLinkElem('container', createLink(url, isbnType));
        }
        // Fallback
        else if (document.querySelector('[id*="detailbullets" i]').innerText.match(isbnType)) {
            var isbnFallback = document.querySelector('[id*="detailbullets" i]').innerText.match(/(\d{10})|(\d{3}-\d{10})/g)[0];
            url = BASEURL + 'index.php?req=' + isbnFallback.replace(/-/, '') + '&columns[]=i';
            addLinkElem('container', createLink(url, isbnType));
        }
    }

    function addLibgenTitleLink(linkText) {
        // Filter by Title
        var url = BASEURL + 'index.php?req=' + getTitle() + '&columns[]=t';
        addLinkElem('container', createLink(url, linkText))
    }

    function addLibgenAuthorLink(linkText) {
        // Filter by Author
        var url = BASEURL + 'index.php?req=' + getAuthor() + '&columns[]=a';
        addLinkElem('container', createLink(url, linkText))
    }

    if (!(document.querySelector('[id*="AUDIO_DOWNLOAD"].selected'))) {
        createLibgenDiv();

        addLibgenTitleLink('Title');
        addLibgenAuthorLink('Author');
        addIsbnSearchLink('ISBN-10');
        addIsbnSearchLink('ISBN-13');
    }
})();
