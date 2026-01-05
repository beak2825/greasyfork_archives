// ==UserScript==
// @name        SteamGifts: Hide joined and perform auto paging
// @namespace   lainscripts_steamgifts_hide_joined_and_autopaging
// @description Implements auto paging feature for SG and hides all joined giveaways. Also attempts to replicate Easy SteamGifts Join button if ESG installed.
// @include     http://www.steamgifts.com/*
// @include     https://www.steamgifts.com/*
// @version     1.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8091/SteamGifts%3A%20Hide%20joined%20and%20perform%20auto%20paging.user.js
// @updateURL https://update.greasyfork.org/scripts/8091/SteamGifts%3A%20Hide%20joined%20and%20perform%20auto%20paging.meta.js
// ==/UserScript==


var obs = new MutationObserver(function(m){
    m.forEach(function(i){
        if(i.target.classList.contains('is-faded')) i.target.parentNode.style.display = 'none';
    });
});

function joinedCleaner(n) {    
    [].forEach.call(n.querySelectorAll('.giveaway__row-inner-wrap'), function (i) {
        if (i.classList.contains('is-faded')) i.parentNode.style.display = 'none';
        else obs.observe(i, { attributes: true, attributeFilter: ['class'] });
    });
}

joinedCleaner(document);

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

function esgHack(d){
    if (document.querySelector('[class^="esg-"],[id^="esg-"]')){ // Seems like Easy SteamGifts is installed and did something
        var gpts = parseInt(document.querySelector('.nav__points').innerHTML);
        if (!gpts) return;
        [].forEach.call(d.querySelectorAll('.giveaway__row-inner-wrap'), function(i){
            if(i.querySelector('.esg-join')) return;
            var dat = i.querySelector('.giveaway__heading');
            if (!dat) return;
            var ptsd = dat.querySelectorAll('.giveaway__heading__thin');
            if (!ptsd) return;
            var pts = parseInt(ptsd[ptsd.length-1].innerHTML.substring(1));
            if (pts <= gpts) {
                var btn = document.createElement('div');
                btn.className = 'esg-join';
                var img = i.querySelector('.global__image-outer-wrap--game-medium');
                btn.innerHTML = '<a href="javascript:void(0);" points="'+pts+'" joinhref="'+img.getAttribute('href')+'">Join</a>';
                img.insertBefore(btn, img.querySelector(':first-child'));
            }            
        });
    }
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

// add missing Join buttons if ESG glitched and missed some of them at the first page
document.addEventListener("DOMContentLoaded", function(event) {
    var cnt = 10, check = function(c) {
        if (document.querySelector('[class^="esg-"],[id^="esg-"]')) {
            esgHack(document.querySelector('.pinned-giveaways'));
            esgHack(par);
        }
        else if (c > 0) setTimeout(check.bind(this, --c), 250);
    };
    setTimeout(check.bind(this,cnt), 250);
});

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
        esgHack(ldiv);
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
