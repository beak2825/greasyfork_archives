// ==UserScript==
// @name        Data scrape
// @description WIP 
// @version       0.81
// @include      *
// @author      Cristo
// @grant       GM_setClipboard
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at document-end
// @copyright    2015+, Cristo
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/6610/Data%20scrape.user.js
// @updateURL https://update.greasyfork.org/scripts/6610/Data%20scrape.meta.js
// ==/UserScript==


//Notes
//Ctrl Z to hide and show lists temporarily.
//Clicking Collapse and Expand Emails toggles permanent visibility settings.
//Clicking item copies it to clipboard.
//Emails are now changed to the correct format after click.
//Sometimes only half an email will be copied. Make sure to check what you paste. 
//Sometimes file types like jpeg slip through. If you see one let me know and I'll add it to the list
//This is not 100% accurate. If it doesn't return an email you still have to search the page.

//update 0.8
//Made email list collapsible with memory

//update 0.7
//Added an array of file types to be filtered out or results. I.E. png, jpg

//update 0.6
//Added padding left for cursor space 
//Limited list to 30% of window space
//Added a scroll bar for longer lists

//update 0.5
//email regex now handles underscores and shorter addresses.
//email is displayed with no changes for clarity
//ats and dots are changed after after click

//to do
//make dive resizeable

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
    if(!GM_getValue('expandboo')){
        GM_setValue('expandboo','open');
    } else {
        console.log(GM_getValue('expandboo'));
    }
    
    var pageText = document.documentElement.innerHTML.toLowerCase(); 
    var EmRegPat = /[a-z0-9\._\-]{2,}( ?@ ?| at | ?&lt;at&gt; ?| ?[\[\{\(<\-_]at[\]\}\)>\-_] ?)[a-z0-9\._\-]{2,}( ?\. ?| ?dot ?| ?&lt;dot&gt; ?| ?[\[\{\(<\-_]dot[\]\}\)>\-_] ?)[a-z]{2,}/g;
    var badEnds = ['gif','htm','html','jpeg','jpg','png'];
    
    var EmResults = pageText.match(EmRegPat);
    
    ////////////////////////////////////////////////Body and containing div
    var bod = document.getElementsByTagName("body")[0];
    var theDiv = document.createElement("div");
    theDiv.setAttribute("id", "thediv");
    theDiv.style.display = "block"
    bod.appendChild(theDiv);
    
    ////////////////////////////////////////////////Email Div
    var emContain = document.createElement("div");
    emContain.setAttribute("id", "emContain");
    emContain.style.position = "fixed";
    emContain.style.visibility = "hidden";
    emContain.style.zIndex="999";
    emContain.style.bottom = "0%";
    emContain.style.left = "0%";
    theDiv.appendChild(emContain);
    
    var emTopper = document.createElement("div");
    emTopper.setAttribute("id", "emTopper");
    emTopper.style.backgroundColor = '#a8a8a8';
    emTopper.style.backgroundColor = '#939393';
    emTopper.style.height = "20px";
    emContain.appendChild(emTopper);
    
    var topperP = document.createElement("div");
    topperP.setAttribute("id", "topperP");
    topperP.style.cursor = "pointer";
    topperP.style.fontFamily ='"Bookman Old Style", serif';
    topperP.style.fontSize="15px";
    topperP.style.color = "#000000";
    topperP.innerHTML = 'Collapse';
    topperP.style.cssFloat = "left";
    topperP.addEventListener('click', casT, false);
    emTopper.appendChild(topperP);
    
    var topperCorner = document.createElement("div");
    topperCorner.setAttribute("id", "topperCorner");
    topperCorner.style.backgroundColor = '#545454';
    topperCorner.style.height = "20px";
    topperCorner.style.width = "19px";
    topperCorner.style.cssFloat = "right";
    emTopper.appendChild(topperCorner);
    
    var emDiv = document.createElement("div");
    emDiv.style.cssFloat = "left";
    emContain.appendChild(emDiv);
    emDiv.setAttribute("id", "emDiv");
    emDiv.style.backgroundColor = "white";
    
    var emListu = document.createElement('ul');
    emListu.style.listStyle='none';
    emListu.style.paddingLeft = "0px";
    emDiv.appendChild(emListu);
    
    ////////////////////////////////////////////////Populate Lists
    function makingAList(results,div){
        if (results !== null){
            for (var f = 0; f < results.length; f++){
                if(badEnds.indexOf(results[f].substring(results[f].lastIndexOf(".")+1)) == -1){
                    var listi = document.createElement('li');
                    div.appendChild(listi);
                    
                    var newSpan = document.createElement("span");
                    newSpan.style.color = "#000000";
                    newSpan.style.paddingLeft = "20px";
                    newSpan.style.textDecoration = "underline";
                    newSpan.style.cursor = "pointer";
                    newSpan.style.fontFamily ='"Bookman Old Style", serif';
                    newSpan.style.fontSize="15px";
                    newSpan.innerHTML = results[f];
                    newSpan.addEventListener('click', cas, false);
                    listi.appendChild(newSpan);
                } else {
                    console.log('Rejects');
                    console.log(results[f]);
                }
            }
            emDiv.setAttribute('tempfix', emDiv.offsetHeight);
            visCheck();
        }
    }
    ////////////////////////////////////////////////Trigger list creation 
    makingAList(EmResults,emListu);
    ////////////////////////////////////////////////Clicks
    function cas(j){//List item Click
        GM_setClipboard(j.target.innerHTML.replace(/ @ | at | ?&lt;at&gt; ?| ?[\[\{\(<\-_]at[\]\}\)>\-_] ?/g, "@").replace(/ \. | ?dot ?| ?&lt;dot&gt; ?| ?[\[\{\(<\-_]dot[\]\}\)>\-_] ?/g, "."));
    }
    ////////////////////////////////////////////////Content and size
    function casT(u){
        if (GM_getValue('expandboo') =='open'){
            GM_setValue('expandboo','close');
        } else {
            GM_setValue('expandboo','open');
        }
        visCheck();
    }
    
    function visCheck(u){
        if (GM_getValue('expandboo') =='open') {
            topperP.innerHTML = 'Collapse';
            topperCorner.style.display = "block";
            if (emDiv.getAttribute("tempfix") < (.3 * window.innerHeight)){
                emContain.style.visibility = "visible";
                emDiv.style.display = "block";
            } else {
                emDiv.style.height = .3 * window.innerHeight+'px';
                emDiv.style.overflowY='auto';
                emDiv.style.overflowX='hidden';
                emContain.style.visibility = "visible";
                emDiv.style.display = "block";
            }
            
        } else if (GM_getValue('expandboo') =='close') {
            emDiv.style.display = "none";
            topperP.innerHTML = 'Expand Emails';
            topperCorner.style.display = "none";
            emContain.style.visibility = "visible";
        }
            }
    ////////////////////////////////////////////////Hide containing div
    document.addEventListener('keydown',function(i) {
        if (i.keyCode == 90) {//ctrl z
            if (i.ctrlKey === true){
                var theDiv = document.getElementById('thediv');
                if (theDiv.style.display == "none") {
                    theDiv.style.display = "block";
                } else if (theDiv.style.display == "block") {
                    theDiv.style.display = "none";
                }}
        }}, false);
}