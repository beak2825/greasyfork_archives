// ==UserScript==
// @name           Filmtipset Cast Images
// @namespace      https://github.com/Row/filmtipset-userscripts
// @description    Displays small actor images on each movie page on filmtipset.se
// @version        0.2.1
// @include        http://www.filmtipset.se/film/*
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/5875/Filmtipset%20Cast%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/5875/Filmtipset%20Cast%20Images.meta.js
// ==/UserScript==
(function( document ) {
"use strict";
var persons;

function get(url, cb)
{
    GM_xmlhttpRequest({
        method: "GET",
        headers: {
            "Referer": ""
        },
        url: url,
        onload: function(xhr) {
            cb( xhr.responseText);
        },
        overrideMimeType: 'text/plain; charset=x-user-defined'
    });
}

function fetchImageData(el, imdbObj)
{
    get(imdbObj.img, function(bin) {
        var base64img = base64Encode(bin);
        setCastStyle(el, 'data:image/jpeg;base64,' + base64img);
    });
}

function setCastStyle(el, img)
{
    el.style.display    = 'block';
    el.style.padding    = '14px 5px 14px 50px';
    el.style.margin     = '2px 0';
    el.style.float      = 'left';
    el.style.width      = '120px';
    el.style.background = '#F3F4E7 url("' + img + '") no-repeat 10px 50%';
}

function drawCastBox()
{
    var xpath = '//h2[contains(.,"despelare")]/../../td[2]/span/a';
    persons = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if(!persons.snapshotLength)
        return false;

    var castBox = persons.snapshotItem(0).parentNode.parentNode;
    castBox.innerHTML = '';
    for(var i = 0; i < persons.snapshotLength; i++) {
        var el = persons.snapshotItem(i);
        setCastStyle(el,'http://i.media-imdb.com/images/SF984f0c61cc142e750d1af8e5fb4fc0c7/nopicture/small/name.png');
        castBox.appendChild(el);
    }

    return true;
}

function drawImages(text)
{
    var imdbActors = [];
    text.replace(/title="(.*?)".*?loadlate="(.*?)"/gm,
        function(m, n, o) {imdbActors.push({img: o, name: n});}
    );
    for(var i = 0; i < persons.snapshotLength; i++) {
        for(var j = 0; j < imdbActors.length; j++) {
            var ftActor = persons.snapshotItem(i).text.replace(/ \(.+\)/,'').toLowerCase();
            var imdbActor = imdbActors[j].name.toLowerCase().replace(/\./gm,'');
            if(imdbActor == ftActor) {
                fetchImageData(persons.snapshotItem(i), imdbActors[j]);
            }
        }
    }
}

function callImdb()
{
    var xpath = '//a[contains(@href, "http://www.imdb.com/title/")]';
    var imdbUrl = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
    if(!imdbUrl || !drawCastBox())
        return false;
    get(imdbUrl.toString(), drawImages);
}

// http://stackoverflow.com/a/7372816/4189664
function base64Encode(str) {
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        out = "",
        i = 0,
        len = str.length,
        c1, c2, c3;
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += CHARS.charAt(c3 & 0x3F);
    }
    return out;
}

// Init
callImdb();
})(document);
