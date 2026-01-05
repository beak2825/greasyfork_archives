// ==UserScript==
// @name         Masterani Placeholder
// @description  Loads badass Luffy as a placeholder if original image doesn't load (under recent anime)
// @version      1.1
// @namespace    https://greasyfork.org/users/5141
// @license      WTFPL v2
// @include	 http://www.masterani.me/
// @downloadURL https://update.greasyfork.org/scripts/6102/Masterani%20Placeholder.user.js
// @updateURL https://update.greasyfork.org/scripts/6102/Masterani%20Placeholder.meta.js
// ==/UserScript==

window.onload = function SetImgId()
{
    var imgArray = document.getElementsByClassName("lazy");
    for (var i = 0; i < imgArray.length; i++)
    {
        imgArray[i].id = "img" + i;
        if (document.getElementById(imgArray[i].id).naturalWidth === 1) //note: if image doesn't load naturalWidth === 1
            imgArray[i].src = "http://oi62.tinypic.com/2zoer7s.jpg"; //set your prefered pic
    } 
}