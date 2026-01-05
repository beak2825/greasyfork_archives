// ==UserScript==
// @name        SteamGifts: Giveaways auto paging
// @namespace   lainscripts_steamgifts_auto_paging
// @description Automatically loads following pages in the giveaway lists. Not required with latest Easy SteamGifts version.
// @include     http://www.steamgifts.com/*
// @include     https://www.steamgifts.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8173/SteamGifts%3A%20Giveaways%20auto%20paging.user.js
// @updateURL https://update.greasyfork.org/scripts/8173/SteamGifts%3A%20Giveaways%20auto%20paging.meta.js
// ==/UserScript==

function offsetTopAbs(elm) {
    var ofs = elm, top = 0;
    while(ofs) {       
        top += ofs.offsetTop || 0;
        ofs = ofs.offsetParent;
    }    
    return top;
}

function checkVisible(elm) {
    return (offsetTopAbs(elm) - 250 < (window.innerHeight + window.pageYOffset));
}

function sgHack(d){
    var $ = window.$, el = $(d);
    // Slightly adjusted version of the code copied from minified.js available on site
    el.find('.giveaway__hide').click(function () {
        $('.popup--hide-games input[name=game_id]').val($(this).attr('data-game-id'));
        $('.popup--hide-games .popup__heading__bold').text($(this).closest('h2').find('.giveaway__heading__name').text());
    });
    el.find('.trigger-popup').click(function () {
        $('.' + $(this).attr('data-popup')).bPopup({
            opacity: 0.85,
            fadeSpeed: 200,
            followSpeed: 500,
            modalColor: '#3c424d'
        });
    });
}

var pag = document.querySelector('.page__heading ~ .pagination'),
    par = document.querySelector('.page__heading ~ div > .giveaway__row-outer-wrap').parentNode;

// remove empty text nodes between blocks to fix the distance between blocks in minified layout style
[].forEach.call(par.childNodes, function(i) {
    if (i.nodeName === '#text') i.parentNode.removeChild(i);
});

function replacePaginator(txt) {
    var elements = /<div\s+class="giveaway__row-outer-wrap"[\s\S]*(?=<\/div><div\s+class="pagination")/im,
        paginator = /<div\s+class="pagination__results">[\s\S]*angle-double-right"><\/i><\/a><\/div>/im;
    var lstt = elements.exec(txt);
    if (lstt) {
        var ldiv = document.createElement('div');
        ldiv.innerHTML = lstt[0];
        joinedCleaner(ldiv);
        sgHack(ldiv);
        [].forEach.call(ldiv.querySelectorAll('.giveaway__row-outer-wrap'),function(i){
            par.appendChild(i);
        });
        var pagt = paginator.exec(txt);
        if (pagt) {
            var pdiv = document.createElement('div');
            pdiv.className = 'pagination';
            pdiv.innerHTML = pagt[0];
            pag.parentNode.insertBefore(pdiv, pag);
        }
        pag.parentNode.removeChild(pag);
        pag = pdiv;
        if (pag) setTimeout(checkPagination,100);
    }
}

function getNextPage(){
    var nxtLink = pag.querySelector('.fa-angle-right');
    if (nxtLink) nxtLink = nxtLink.parentNode; else return undefined;
    
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onloadend = function() {
        if (xmlhttp.status == 200) {
            replacePaginator(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", nxtLink.href, true);
    xmlhttp.send();    
}

function checkPagination(){
    if (checkVisible(pag)) getNextPage();
    else setTimeout(checkPagination,100);
}

if (pag) setTimeout(checkPagination,100);