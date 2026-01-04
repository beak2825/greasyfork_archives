// ==UserScript==
// @name         Fortnite Item Shop Rightsizer
// @namespace    http://tampermonkey.net/
// @version      2025-10-06
// @description  Hide items you're not interested in
// @author       ZetaGecko
// @license MIT
// @match        https://www.fortnite.com/item-shop?lang=*
// @icon         https://www.fortnite.com/item-shop/assets/metadata/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/551771/Fortnite%20Item%20Shop%20Rightsizer.user.js
// @updateURL https://update.greasyfork.org/scripts/551771/Fortnite%20Item%20Shop%20Rightsizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var showmode; // 0 = show unhidden only, 1 = show hidden only
    var itemlist;
    var firstrun;

    itemlist = [];
    showmode = 0;
    firstrun = 1;

    function ToggleShowMode() {
        var i,btns;
        showmode = 1-showmode;
        for (i=0;i<itemlist.length;i++) itemlist[i].par.style.display='block';
        btns = document.getElementsByClassName('ZetaGeckoHideButton');
        for (i=0;i<btns.length;i++) btns[i].parentNode.removeChild(btns[i]);
        CatalogEverything();
    }

    function HideAnItem(event) {
        var i;
        i=parseInt(event.target.id.substr(8));
        console.log('Hid '+itemlist[i].href);
        itemlist[i].par.style.display='none';
        switch (showmode) {
            case 0: GM_setValue(itemlist[i].href,'hide'); break;
            case 1: GM_deleteValue(itemlist[i].href); break;
        }
        event.stopPropagation();
    }

    function CatalogEverything() {
        var allitems,itemlinktag,mybtn,i,indb;
        if (firstrun) {
            firstrun=0;
            mybtn=document.createElement('div');
            mybtn.style.zIndex=100000;
            mybtn.style.position='fixed';
            mybtn.style.bottom='10px';
            mybtn.style.right='10px';
            mybtn.style.backgroundColor='#000';
            mybtn.style.padding='2px 12px';
            mybtn.style.borderRadius='15px';
            mybtn.innerText='hide <-> show';
            mybtn.addEventListener('click',ToggleShowMode);
            document.getElementById('item-shop').appendChild(mybtn);
        }
        allitems = document.querySelectorAll("[data-testid='grid-catalog-item']");
        for (i=0;i<allitems.length;i++) {
            itemlinktag=allitems[i].getElementsByTagName('a');
            itemlist.push({href:itemlinktag[0].href,par:allitems[i]});
            indb=GM_getValue(itemlinktag[0].href,false);
            if ((indb === false) == (showmode == 0)) {
                mybtn=document.createElement('div');
                mybtn.style.zIndex=100000;
                mybtn.style.position='absolute';
                mybtn.style.top='10px';
                mybtn.style.left='10px';
                mybtn.style.backgroundColor='#000';
                mybtn.style.padding='2px 12px';
                mybtn.style.borderRadius='15px';
                mybtn.innerText='X';
                mybtn.addEventListener('click',HideAnItem);
                mybtn.id='hideitem'+i;
                mybtn.className='ZetaGeckoHideButton';
                itemlinktag[0].parentNode.appendChild(mybtn);
            } else allitems[i].style.display='none';
        }
    }
    setTimeout(CatalogEverything,1500);
})();