// ==UserScript==
// @name        Data scrape
// @description WIP 
// @version       0.1
// @include      *
// @author        Cristo
// @grant    GM_setClipboard
// @run-at document-end
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6604/Data%20scrape.user.js
// @updateURL https://update.greasyfork.org/scripts/6604/Data%20scrape.meta.js
// ==/UserScript==

//Ctrl Z to hide and show lists.
//Clicking item copies it to clipboard.
//Emails are now changed to the correct format.
//Phone numbers can include long distance,spaces,no spaces,(,-,. and some extensions. 
//to turn off phone numbers add two / at the start of line 112



//to do
//clicking an item should highlight item and scroll to it's location so it can be double checked

//more phone number extension formats are needed
//the phone number regexp seems a little too broad. mistakes urls and script names. limiting it to visible elements might be best

//address finder might be possible.
//zipcodes are not always included with bing maps, state names and abbreviations would be bulky and slow, st|lane|ave|ect is not reliable 
//only common flag seems to be states

//auto open links based on innerHTML, about, contact, loaction

//facebook navigator redirect to info page

//scrape socail media links, facebook, twitter, linkedin

var loc = window.location.toString();

if (loc.indexOf('mturk') === -1){
    var pageText = document.documentElement.textContent.toLowerCase(); 
    var EmRegPat = /[a-z0-9\._\-]{3,}( ?@ ?| at | ?[\[\{\(<\-_]at[\]\}\)>\-_] ?)[a-z]{3,}( ?\. ?| ?dot ?| ?[\[\{\(<\-_]dot[\]\}\)>\-_] ?)[a-z]{2,}/g;
    var PhRegPat = /1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?/g;
    //var AdRegPat = /noWayThisWillWork/g;
    
    var EmResults = pageText.match(EmRegPat);
    var PhResults = pageText.match(PhRegPat);
    //var AdResults = pageText.match(AdRegPat);
    ////////////////////////////////////////////////Body and containing div
    var bod = document.getElementsByTagName("body")[0];
    var theDiv = document.createElement("div");
    theDiv.setAttribute("id", "thediv");
    theDiv.style.display = "block"
    bod.appendChild(theDiv);
    ////////////////////////////////////////////////Individual divs
    var emDiv = document.createElement("div");
    var phDiv = document.createElement("div");
    var adDiv = document.createElement("div");
    theDiv.appendChild(emDiv);
    theDiv.appendChild(phDiv);
    theDiv.appendChild(adDiv);
    ////////////////////////////////////////////////Email Div
    emDiv.style.position = "fixed";
    emDiv.style.zIndex="999";
    emDiv.style.bottom = "0%";
    emDiv.style.left = "0%";
    emDiv.setAttribute("id", "emDiv");
    emDiv.style.backgroundColor = "white";
    var emListu = document.createElement('ul');
    emListu.style.listStyle='none';
    emListu.style.paddingLeft = "0px";
    emDiv.appendChild(emListu);
    ////////////////////////////////////////////////Phone Dive
    phDiv.style.position = "fixed";
    phDiv.style.zIndex="999";
    phDiv.style.bottom = "0%";
    phDiv.style.right = "49%";
    phDiv.setAttribute("id", "phDiv");
    phDiv.style.backgroundColor = "white";
    var phListu = document.createElement('ul');
    phListu.style.listStyle='none';
    phListu.style.paddingLeft = "0px";
    phDiv.appendChild(phListu);
    ////////////////////////////////////////////////Address Div
    adDiv.style.position = "fixed";
    adDiv.style.zIndex="999";
    adDiv.style.bottom = "0%";
    adDiv.style.right = "0%";
    adDiv.setAttribute("id", "adDiv");
    adDiv.style.backgroundColor = "white";
    var asListu = document.createElement('ul');
    asListu.style.listStyle='none';
    asListu.style.paddingLeft = "0px";
    adDiv.appendChild(asListu);
    ////////////////////////////////////////////////Populate Lists
    function makingAList(results,div){
        if (results !== null){
            for (var f = 0; f < results.length; f++){
                var listi = document.createElement('li');
                div.appendChild(listi);
                var newSpan = document.createElement("span");
                newSpan.style.color = "#000000";
                newSpan.style.textDecoration = "underline";
                newSpan.style.cursor = "pointer";
                newSpan.style.fontSize="15px";
                newSpan.innerHTML = results[f].replace(/ @ | at | ?[\[\{\(<\-_]at[\]\}\)>\-_] ?/g, "@").replace(/ \. | ?dot ?| ?[\[\{\(<\-_]dot[\]\}\)>\-_] ?/g, ".");
                newSpan.addEventListener('click', cas, false);
                listi.appendChild(newSpan);
            }
        }
    }
    ////////////////////////////////////////////////Trigger list creation 
    makingAList(EmResults,emListu);
    makingAList(PhResults,phListu);
    //makingAList(AdResults,asListu);
    ////////////////////////////////////////////////List item clicked
    function cas(j){
        //scroll to location on page and highlight somehow
        GM_setClipboard(j.target.innerHTML);
    }
    ////////////////////////////////////////////////Hide containing div
    document.addEventListener('keydown',function(i) {
        if (i.keyCode == 90) {//z
            if (i.ctrlKey === true){
                var theDiv = document.getElementById('thediv');
                if (theDiv.style.display == "none") {
                    theDiv.style.display = "block";
                } else if (theDiv.style.display == "block") {
                    theDiv.style.display = "none";
                }}
        }}, false);
}
