// ==UserScript==
// @name       jawz James Block
// @version    1.2
// @description  something useful
// @match      https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/8798/jawz%20James%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/8798/jawz%20James%20Block.meta.js
// ==/UserScript==

var allText = $('body').text();
if (allText.indexOf("Please judge the following images and decide if they are adult in nature.") >= 0) {
    var links = document.links;
    var url = links[0];
    //var url = allText.match("url(.*)");
    //url = url[0];
    //url = url.substring(4, url.length);
    console.log(url);

    var myImage = new Image(300, 300);
    myImage.src = url;
    $('p:contains("url:")').append ('<br>');
    $('p:contains("url:")').append (myImage);
}
