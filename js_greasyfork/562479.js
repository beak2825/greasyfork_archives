// ==UserScript==
// @name         TornDarkWiki
// @namespace    TornDarkWiki
// @version      1.0.1
// @description  Dark mode for the Torn Wiki
// @author       AfricanChild [3157295]
// @license      MIT
// @match        https://wiki.torn.com/*
// @icon         https://i.imgur.com/wxXtKVA.png
// @homepageURL  https://greasyfork.org/scripts/562479-torndarkwiki
// @supportURL   https://greasyfork.org/scripts/562479-torndarkwiki/feedback
// @source       https://greasyfork.org/scripts/562479-torndarkwiki/code
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562479/TornDarkWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/562479/TornDarkWiki.meta.js
// ==/UserScript==

//Body
document.body.style.backgroundColor = "#191919";

//Main content
document.querySelector(".col-12.col-md-8.content-area-wrapper").style.backgroundColor = "#333333";
//Headers
document.querySelectorAll("h1, h2, h3, h4").forEach(el => {el.style.color = "#efb300"; el.style.borderBottom = "1px solid #4d4d4d";});
document.querySelectorAll(".firstHeading").forEach(firstHeading => firstHeading.style.borderBottom = "none");

//Paragraphs
document.querySelectorAll("p").forEach(p => p.style.color = "white");
//List
document.querySelectorAll("li").forEach(li => li.style.color = "#a2a9b1");
//Link colors
document.querySelectorAll("a").forEach(a => a.style.color = "#4cc9ff");
document.querySelectorAll(".toctogglelabel").forEach(a => a.style.color = "#4cc9ff");
document.querySelectorAll(".th").forEach(a => a.style.backgroundColor = "red");

//Button
document.querySelectorAll(".torn-mass-collapse-control a").forEach(a => {a.style.color = "white"; a.style.backgroundColor = "#4d4d4d"; a.style.border = "none";});

//Top navigation
document.querySelector(".card.torn-navigation-header").style.backgroundImage = "none";
document.querySelector(".card.torn-navigation-header").style.backgroundColor = "#333333";
document.querySelector(".torn-back-button").style.color = "white";
//Bottom navigation
document.querySelector(".card.torn-navigation-panel").style.backgroundColor = "#333333";

//Footer
document.querySelector(".list-inline").style.color = "#a2a9b1";
document.querySelector(".catlinks").style.border = "0.5px solid #4d4d4d";

//Misc
document.querySelectorAll("pre").forEach(th => {th.style.backgroundColor = "#292929"; th.style.color = "white"; th.style.border = "none";});
document.querySelectorAll("th").forEach(th => {th.style.backgroundColor = "#292929"; th.style.color = "white";});
document.querySelectorAll(".content-area-wrapper #content").forEach(th => {th.style.color = "#a2a9b1";});

//Table
document.querySelectorAll(".table th").forEach(element => element.style.border = "2px solid #4d4d4d");
document.querySelectorAll(".table td").forEach(element => element.style.border = "1px solid #4d4d4d");

document.querySelectorAll("td").forEach(td => {td.style.backgroundColor = "#292929"; td.style.color = "white";});
document.querySelectorAll(".content-area-wrapper #content table.wikitable.mw-collapsible tr:first-child > th, .content-area-wrapper #content table.wikitable.mw-collapsible tr:first-child > td")
    .forEach(cell => {
        cell.style.setProperty("background-color", "#333333", "important");
        cell.style.setProperty("color", "white");
    });
document.querySelectorAll(".content-area-wrapper #content table.wikitable.mw-collapsible tr:first-child > th, .content-area-wrapper #content table.wikitable.mw-collapsible tr:first-child > td").forEach(cell => cell.style.borderTop = "0.5px solid #737373");

//Search profile tabs
document.querySelectorAll(".mw-search-profile-tabs").forEach(el => el.style.cssText += "background-color:#333333;border:1px solid #4d4d4d;");
document.querySelectorAll(".mw-search-profile-tabs .current").forEach(el => el.style.cssText += "background-color:#292929;");
//Search options
document.querySelectorAll("#mw-searchoptions").forEach(el => el.style.cssText += "background-color:#292929;border:1px solid #4d4d4d;color:#a2a9b1;");
//Search Divider
document.querySelectorAll(".divider").forEach(el => {
  el.style.cssText += "border-color: #292929 !important;";
});

//Filetoc
document.querySelectorAll("#filetoc").forEach(el => {el.style.backgroundColor="#292929";el.style.border="1px solid #4d4d4d";});
document.querySelectorAll(".mw-metadata-collapsible th, .mw-metadata-collapsible td").forEach(el=>el.style.border="1px solid #4d4d4d");

//Metadata table
//This element is added after page load, wait for changes and restyle it
new MutationObserver(() => {
  document.querySelectorAll("#mw_metadata .mw-metadata-show-hide-extended td").forEach(td => {
    td.style.setProperty("background-color", "#292929", "important");
    td.style.setProperty("border", "1px solid #4d4d4d", "important");
    td.style.setProperty("color", "white", "important");
  });

  document.querySelectorAll("#mw_metadata .mw-metadata-show-hide-extended a").forEach(a => {
    a.style.setProperty("color", "#4cc9ff", "important");
    a.style.setProperty("background-color", "#292929", "important");
    a.style.display = "block";
    a.style.width = "100%";
  });
}).observe(document.body, { childList: true, subtree: true });

//Category links
document.querySelectorAll("#catlinks").forEach(el=>{el.style.backgroundColor="#292929";el.style.border="1px solid #4d4d4d";});
document.querySelectorAll("#catlinks li").forEach(li=>li.style.color="#a2a9b1");