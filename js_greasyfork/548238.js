// ==UserScript==
// @name         Open In Steam
// @namespace    http://brooksaar.com/
// @version      2025-08-17
// @description  Adds a link to open Steam content in the desktop client.
// @author       HY chen
// @match        *://steamcommunity.com/*
// @match        *://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548238/Open%20In%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/548238/Open%20In%20Steam.meta.js
// ==/UserScript==

function CreateButton(namedPage, pageId) {
    let divBanner = document.createElement("div");
    let steamButton = document.createElement("a");
    let spanButton = document.createElement("span");
    spanButton.appendChild(document.createTextNode("在桌面 Steam 中開啟"));
    steamButton.setAttribute("href", "steam://url/" + namedPage + pageId);
    steamButton.setAttribute("class", "btnv6_blue_hoverfade btn_medium");
    steamButton.appendChild(spanButton);
    divBanner.appendChild(steamButton);

    let bannerNav = document.getElementsByClassName("banner_open_in_steam")[0]
    if (!bannerNav) {
        let itemNav = document.getElementsByClassName("workshopItemDetailsHeader")[0]
        itemNav.appendChild(divBanner);
    } else {
        let superNav = document.getElementsByClassName("supernav_container")[0];
        superNav.appendChild(divBanner);
    }
}

// Thanks David Morales, https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

var namedPage = ""; // trailing slash important!
var pageId = "";

var currentUrl = window.location.href;
if(currentUrl.match("store.steampowered.com/app/")) {
    var urlParts = currentUrl.split("/");

    namedPage = "StoreAppPage/";
    pageId = urlParts[4];

    CreateButton(namedPage, pageId);
} else if(currentUrl.match("steamcommunity.com/sharedfiles/")) {
    pageId = getURLParameter("id");
    namedPage = "CommunityFilePage/";

    CreateButton(namedPage, pageId);
}