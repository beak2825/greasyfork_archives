// ==UserScript==
// @name        Fimfiction - CMC Story Styles
// @namespace   arcum42
// @include     http*://*fimfiction.net/story*
// @version     0.21
// @description Adds new styles
// @downloadURL https://update.greasyfork.org/scripts/5838/Fimfiction%20-%20CMC%20Story%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/5838/Fimfiction%20-%20CMC%20Story%20Styles.meta.js
// ==/UserScript==

// I thought a
// Sweetie Belle!
var SB_PINK = "#f6b8d2"; // Mane
var SB_PURPLE = "#b28dc0"; // Mane
var SB_COAT = "#efedee"; // light grey
var SB_DARK_COAT = "#e2dee3";
var SB_LIGHT_GREEN = "#cbe5bf"; // Lighter eye color
var SB_GREEN = "#abd298"; // // Medium eye color
var SB_DARK_GREEN = "#8dbb81"; // Darker eye color
var SB_VERY_LIGHT_GREEN = "#f5f9f0"; // Eye hilight

// Scootaloo!
var SCOOTA_MANE = "#c959a2";
var SCOOTA_COAT = "#fdbc5f";
var SCOOTA_DARK_COAT = "#ec9e32";
var SCOOTA_EYES = "#fdbc5f";
var SCOOTA_DARK_EYES = "#6c368e";
var SCOOTA_LIGHT_EYES = "#e6cfe5";

// Apple Bloom!
var AB_MANE = "#f8415f";
var AB_COAT = "#f4f49b";
var AB_RIBBON = "#f46091";
var AB_LIGHT_EYES = "#f2af4d"; // Lighter eye color
var AB_EYES = "#f2af4d"; // // Medium eye color
var AB_DARK_EYES = "#e45762"; // Darker eye color
var AB_VERY_LIGHT_EYES = "#ffc757"; // Eye hilight

// Bonus Babs!
var BABS_LIGHT_MANE = "#ee688a";
var BABS_MANE = "#e22c5e";
var BABS_COAT = "#d89f48";
var BABS_DARK_COAT = "#c38f36";
var BABS_FRECKLES = "#fffaa1";
var BABS_LIGHT_EYES = "#cef879";
var BABS_EYES = "#94d34b";
var BABS_DARK_EYES = "#587f3e";

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(
    // I'm Sweetie Belle!
".content_format_sweetie_belle a.story_name {" + 
    " color: " + SB_DARK_GREEN + " !important;" +
    "}\n" +
    
".content_format_sweetie_belle {" + 
    " background-color: " + SB_COAT + " !important;" +
    " color: " + SB_DARK_GREEN + " !important;" +
"}\n" +

".content_format_sweetie_belle p {" +
    " padding: 10px;" +
    " background-color: " + SB_VERY_LIGHT_GREEN + " !important;" +
    " color: " + SB_PURPLE + " !important;" +
    " margin-top: 0px;" +
    " padding-top: 10px;" +
    " padding-bottom: 10px;" +
"}\n" +

".content_format_sweetie_belle p:nth-child(2n) {" +
    " background-color: " + SB_VERY_LIGHT_GREEN + " !important;" +
    " color: " + SB_PINK + " !important;" +
"}\n" +
    
    // Name's Scootaloo!
".content_format_scootaloo a.story_name {" + 
    " color: " + SCOOTA_DARK_EYES + " !important;" +
    "}\n" +
    
".content_format_scootaloo {" + 
    " background-color: " + SCOOTA_DARK_COAT + " !important;" +
    " color: " + SCOOTA_MANE + " !important;" +
"}\n" +

".content_format_scootaloo p {" +
    " padding: 10px;" +
    " background-color: " + SCOOTA_COAT + " !important;" +
    " color: " + SCOOTA_MANE + " !important;" +
    " margin-top: 0px;" +
    " padding-top: 10px;" +
    " padding-bottom: 10px;" +
"}\n" +
    
      // Apple Bloom!
".content_format_apple_bloom a.story_name {" + 
    " color: " + AB_VERY_LIGHT_EYES + " !important;" +
    "}\n" +
    
".content_format_apple_bloom {" + 
    " background-color: " + AB_RIBBON + " !important;" +
    " color: " + AB_COAT + " !important;" +
"}\n" +

".content_format_apple_bloom p {" +
    " padding: 10px;" +
    " background-color: " + AB_COAT + " !important;" +
    " color: " + AB_MANE + " !important;" +
    " margin-top: 0px;" +
    " padding-top: 10px;" +
    " padding-bottom: 10px;" +
"}\n" +
    
// Babs Seed, Babs Seed, Watcha Gonna Do?
".content_format_babs a.story_name {" + 
    " color: " + BABS_FRECKLES + " !important;" +
"}\n" +
      
".content_format_babs {" + 
    " background-color: " + BABS_DARK_COAT + " !important;" +
    " color: " + BABS_LIGHT_EYES + " !important;" +
"}\n" +

".content_format_babs p {" +
    " padding: 10px;" +
    " background-color: " + BABS_FRECKLES + " !important;" +
    " color: " + BABS_LIGHT_MANE + " !important;" +
    " margin-top: 0px;" +
    " padding-top: 10px;" +
    " padding-bottom: 10px;" +
"}\n" +

".content_format_babs p:nth-child(2n) {" +
    " background-color: " + BABS_FRECKLES + " !important;" +
    " color: " + BABS_MANE + " !important;" +
"}\n");

$('optgroup[label="Ponies"]').append('<option value = "sweetie_belle">Sweetie Belle</option> <option value = "scootaloo">Scootaloo</option> <option value = "apple_bloom">Apple Bloom</option> <option value = "babs">Babs Seed</option>');