// ==UserScript==
// @name        GoodReads Meta Gen [KAT] [Tinks]
// @namespace   PXgamer
// @description Generates a sexy description from GoodReads.com
// @include     *goodreads.com/book/show/*
// @include     *localhost:999/other/goodReads.php
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @version     1.6
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/9875/GoodReads%20Meta%20Gen%20%5BKAT%5D%20%5BTinks%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/9875/GoodReads%20Meta%20Gen%20%5BKAT%5D%20%5BTinks%5D.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$('.bookCoverPrimary').after('<a id="copyButton" style="cursor:pointer; color:black; -webkit-border-radius: 2px;-webkit-border-bottom-right-radius: 3px;-moz-border-radius: 2px;-moz-border-radius-bottomright: 3px;border-radius: 2px;border-bottom-right-radius: 5px;padding:7px; margin-bottom: 2px; text-decoration:none;background: #d934a5;background-image: -webkit-linear-gradient(top, #d934a5, #b82b3d);background-image: -moz-linear-gradient(top, #d934a5, #b82b3d);background-image: -ms-linear-gradient(top, #d934a5, #b82b3d);background-image: -o-linear-gradient(top, #d934a5, #b82b3d);background-image: linear-gradient(to bottom, #d934a5, #b82b3d);"><span>Copy Stuff</span></a><br/><br/>');

$(document).delegate('#copyButton', 'click', function copyShit() {
//Set variables to blank
var bookTitle = "";
var author = "";
var cover = "";
var info = "";
var genre = "";

//Create hidden save var
var finalInfo;

//Start main shit
bookTitle = $('#bookTitle').html();
cover = $('#coverImage').attr('src');
author = $('.authorName').html();
author = author.replace(/<(.|\n)*?>/g, '');
info = $('#description').html();
info = info.replace(/<(.|\n)*?>/g, '');
info = info.replace(/...more/g, '');
genre = $('.left a[href*="/genres/"]').html();

//Copy to Clipboard
finalInfo = '[b]'+bookTitle+'[/b]<br/>[b]Author:[/b]'+author+'<br/><br/>[center][img]'+cover+'[/img][/center]<br/><br/>'+info+'<br/><br/><br/>[b]Genre: [/b]'+genre+'<br/><br/>[center][image=dKvuYaI8Jl][/center]';
GM_setClipboard(finalInfo);

console.log("Copied to Clipboard, Ctrl + V to paste");
alert("Copied to Clipboard, Ctrl + V to paste");
});