// ==UserScript==
// @name        动漫花园磁力链编码转换
// @namespace   https://github.com/vovict
// @description 将动漫花园磁力链从base32编码转换hex编码
// @include     http://share.dmhy.org/
// @include     https://share.dmhy.org/
// @include     http://share.dmhy.org/topics/list*
// @include     https://share.dmhy.org/topics/list*
// @include     http://share.dmhy.org/topics/view/*
// @include     https://share.dmhy.org/topics/view/*
// @version     1.0
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/9582/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E7%A3%81%E5%8A%9B%E9%93%BE%E7%BC%96%E7%A0%81%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/9582/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E7%A3%81%E5%8A%9B%E9%93%BE%E7%BC%96%E7%A0%81%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

//base32tohex
function base32tohex(base32) {
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var bits = "";
        var hex = "";

        for (var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }

        for (var i = 0; i+4 <= bits.length; i+=4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16) ;
        }
        return hex;
}
function leftpad(str, len, pad) {
        if (len + 1 >= str.length) {
                str = Array(len + 1 - str.length).join(pad) + str;
        }
        return str;
}

// var bttable = document.getElementById("tabs-1");
// var p1 = bttable.getElementsByTagName("p")[0];
// var torrentlink = p1.getElementsByTagName("a")[0];

// var hash  = torrentlink.href.split('/')[6];
// hash = hash.split('.')[0];

//torrent page magnetlink convert
 var magnetlink = document.getElementById("a_magnet");
 if (magnetlink !== null)
 {
	hash = magnetlink.href.split('urn:btih:')[1].split('&dn=')[0];
	magnetlink.href = "magnet:?xt=urn:btih:"+base32tohex(hash);
 }

//torrent list magnetlink convet
var magnetlinks = document.getElementsByClassName("download-arrow arrow-magnet");
//alert(magnetlinks.length);
for (var i = 0; i < magnetlinks.length; i++)
{
	hash = magnetlinks[i].href.split('urn:btih:')[1].split('&dn=')[0];
	magnetlinks[i].href = "magnet:?xt=urn:btih:"+base32tohex(hash);
}