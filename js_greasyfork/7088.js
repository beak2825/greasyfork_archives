// ==UserScript==
// @name        Torrentz
// @namespace   Haktrum
// @author      Haktrum
// @match       *://*.torrentz.com/*
// @match       *://*.torrentz.eu/*
// @match       *://*.torrentz.me/*
// @match       *://*.torrentz.ch/*
// @match       *://*.torrentz.in/*
// @version     1.06
// @description Magnet links for Torrentz
// @downloadURL https://update.greasyfork.org/scripts/7088/Torrentz.user.js
// @updateURL https://update.greasyfork.org/scripts/7088/Torrentz.meta.js
// ==/UserScript==

(function() {

    var xhrListener = function(evt)
    {
        var document, title, parent, a, magnet;
        var document = new DOMParser();
        title = document.parseFromString(evt.target.response.match(/<span>.*?<\/span>/), 'text/xml').firstChild.textContent;
        document = document.parseFromString(evt.target.response.match(/<div class="trackers">.*<\/p><\/div>/), 'text/xml');
        parent = this.parentNode;
        a = parent.querySelector('a:last-child');
        magnet = a.href.match(/[\w\d]{40}/i);
        magnet = getMagnet(document, magnet, title);
        this.href = magnet;
        this.style.cursor = 'pointer';
        this.click();
    }
    var makeMagnet = function()
    {
        this.removeEventListener('click', makeMagnet);
        this.style.cursor = 'wait';
        var xhr = new XMLHttpRequest();
        xhr.onload = xhrListener.bind(this);
        xhr.open('get', this.parentNode.children[1].href, true);
        xhr.send();
    };
    var getMagnet = function(document, magnet, title)
    {
        var trackers;
        if (!title)
            title = document.querySelector('.download h2 span').textContent;
        if (!(magnet || (magnet = window.location.href.match(/[\w\d]{40}/i))))
            return;
        magnet = 'magnet:?xt=urn:btih:' + magnet[0].toUpperCase() + '&dn=' + title;
        trackers = document.querySelectorAll('.trackers a');
        for (i = 0; i < trackers.length - 1; i++)
            magnet += '&tr=' + trackers[i].innerHTML;
        return magnet;
    };

    var magnet, title, i, a;
    var magnetIcon = 'data:image/png;base64,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';

    var links = document.querySelectorAll('.results dl a');
    var title = document.querySelector('.download h2 span');

    var styleElem = document.createElement('style');
    styleElem.appendChild(document.createTextNode(''));
    document.head.appendChild(styleElem);
    var styleSheet = styleElem.sheet;

    styleSheet.insertRule('.magnet-icon { background-image: url("' + magnetIcon + '"); background-size: contain; background-repeat: no-repeat; display: inline-block; padding-right: 2px; margin-bottom: -3px; }', 0);
    styleSheet.insertRule('.magnet-icon.s16 { width: 16px; height: 16px; }', 0);
    styleSheet.insertRule('.magnet-icon.s22 { width: 22px; height: 22px; }', 0);
    if (!title)
    {
        var magnetImg = document.createElement('img');
        magnetImg.className = 'magnet-icon s16';
        var magnetA;
        for (i = 0; i < links.length; i++)
        {
            magnetA = document.createElement('a');
            magnetA.addEventListener('click', makeMagnet);
            magnetA.appendChild(magnetImg.cloneNode());
            magnetA.style.cursor = 'pointer';
            links[i].parentNode.insertBefore(magnetA, links[i]);
        }
    }
    else
    {
        title = document.querySelector('.download h2 span');
        var magnetImg = document.createElement('img');
        var magnetA = document.createElement('a');
        magnetImg.className = 'magnet-icon s22';
        magnetA.appendChild(magnetImg);
        magnetA.href = getMagnet(document, '', title.textContent);
        title.parentNode.insertBefore(magnetA, title);
    }
})();
