// ==UserScript==
// @name        xkcd buttons Alt+Transcript+Explainxkcd
// @author      SammaySarkar
// @namespace   "SammaySarkar_Greasemonkey_Scripts"
// @description add btns to view transcript and alt and explainxkcd
// @version     1.6
// @include     /^https?\://(www\.)?xkcd\.com/?(\d+)?/?.*?$/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6978/xkcd%20buttons%20Alt%2BTranscript%2BExplainxkcd.user.js
// @updateURL https://update.greasyfork.org/scripts/6978/xkcd%20buttons%20Alt%2BTranscript%2BExplainxkcd.meta.js
// ==/UserScript==
// Hi, user! You can change some options in the USER SETTINGS block below!
// Read the accompanying commentary for explanations!

/* -> USER SETTINGS */
var xkcd_atx_showAlttext = 1; //1:display alttext below comic | 0:hide it
var xkcd_atx_showTscript = 0; //1:display transcript | 0:hide it
var xkcd_atx_moveTscript = 0; //1:move Tscript above 2nd nav controls | 0: keep position unchanged
var xkcd_atx_showExplain = 1; //1:show explain button | 0:hide it
var xkcd_atx_ntabExplain = 0; //1:open ExplainXKCD in new tab by default | 0: open in current tab

/* <- USER SETTINGS */






/* -> init */
var xkcd_atx_tscriptDiv = document.getElementById('transcript');
var xkcd_atx_parentElem = xkcd_atx_tscriptDiv.parentElement;
var xkcd_atx_alttext = document.getElementById('comic').getElementsByTagName('img') [0].title;
var xkcd_atx_tscript = xkcd_atx_tscriptDiv.textContent;
var xkcd_atx_comicNum = document.getElementsByClassName('comicNav') [0].getElementsByTagName('a') [1].getAttribute('href');
//if (xkcd_atx_comicNum == "#"){xkcd_atx_comicNum = 1;}
//else {
xkcd_atx_comicNum = parseInt(xkcd_atx_comicNum.slice(1, xkcd_atx_comicNum.length-1)) + 1;
//}
var xkcd_atx_UlNewBtns = document.createElement('ul');
xkcd_atx_UlNewBtns.className = 'comicNav';
//xkcd_atx_UlNewBtns.id = 'xkcdatx_newBtns';
xkcd_atx_parentElem.insertBefore(xkcd_atx_UlNewBtns, xkcd_atx_tscriptDiv);
//xkcd_atx_parentElem.insertBefore(document.createElement("hr"), xkcd_atx_UlNewBtns);
/* <- init */

/* -> alttext ctrl */
if (xkcd_atx_alttext != '') {
    var xkcd_atx_divAlttext = document.createElement('div');
    xkcd_atx_divAlttext.textContent = xkcd_atx_alttext;
    xkcd_atx_divAlttext.style.fontVariant = 'normal';
    xkcd_atx_divAlttext.style.fontSize = '10px';
    xkcd_atx_divAlttext.style.border = '1px solid #000';
    xkcd_atx_divAlttext.style.borderRadius = '3px';
    xkcd_atx_divAlttext.style.padding = '4px';
    xkcd_atx_divAlttext.style.margin = '2px 60px';
    xkcd_atx_divAlttext.style.backgroundColor = '#FFF9BD';
    if (xkcd_atx_showAlttext != 1) {
        xkcd_atx_divAlttext.style.display = 'none';
    }
    var xkcd_atx_LiBtnAlttext = document.createElement('li');
    var xkcd_atx_aBtnAlttext = document.createElement('a');
    xkcd_atx_aBtnAlttext.textContent = 'aLttext';
    xkcd_atx_aBtnAlttext.accessKey = 'l';
    xkcd_atx_aBtnAlttext.style.cursor = 'pointer';
    xkcd_atx_aBtnAlttext.title = 'display Alttext.\nAccesskey: L';
    xkcd_atx_LiBtnAlttext.appendChild(xkcd_atx_aBtnAlttext);
    xkcd_atx_UlNewBtns.appendChild(xkcd_atx_LiBtnAlttext);
    xkcd_atx_parentElem.insertBefore(xkcd_atx_divAlttext, document.getElementsByClassName('comicNav') [1]);

    xkcd_atx_aBtnAlttext.addEventListener('click', function () {
        if (xkcd_atx_divAlttext.style.display == 'none') {
            xkcd_atx_divAlttext.style.display = 'block';
        } 
        else {
            xkcd_atx_divAlttext.style.display = 'none';
        }
    });
}
/* <- alttext ctrl */

/* -> transcript ctrl */
if (xkcd_atx_tscript != '') {
    xkcd_atx_tscriptDiv.style.whiteSpace = 'pre-line';
    xkcd_atx_tscriptDiv.style.textAlign = 'justify';
    xkcd_atx_tscriptDiv.style.fontFamily = 'monospace';
    xkcd_atx_tscriptDiv.style.fontVariant = 'normal';
    xkcd_atx_tscriptDiv.style.fontSize = '12px';
    xkcd_atx_tscriptDiv.style.border = '1px solid #000';
    xkcd_atx_tscriptDiv.style.borderRadius = '3px';
    xkcd_atx_tscriptDiv.style.padding = '4px';
    xkcd_atx_tscriptDiv.style.margin = '16px 60px';
    xkcd_atx_tscriptDiv.style.backgroundColor = '#E4E4E4';
    if (xkcd_atx_showTscript != 0) {
        xkcd_atx_tscriptDiv.style.display = 'block';
    }
    var xkcd_atx_LiBtnTscript = document.createElement('li');
    var xkcd_atx_aBtnTscript = document.createElement('a');
    xkcd_atx_aBtnTscript.textContent = 'Transcript';
    xkcd_atx_aBtnTscript.accessKey = 't';
    xkcd_atx_aBtnTscript.style.cursor = 'pointer';
    xkcd_atx_aBtnTscript.title = 'display Transcript.\nAccesskey: T';
    xkcd_atx_LiBtnTscript.appendChild(xkcd_atx_aBtnTscript);
    xkcd_atx_UlNewBtns.appendChild(xkcd_atx_LiBtnTscript);

    if (xkcd_atx_moveTscript != 0) {
        xkcd_atx_parentElem.insertBefore(xkcd_atx_tscriptDiv, document.getElementsByClassName('comicNav') [1]);
    }
    xkcd_atx_aBtnTscript.addEventListener('click', function () {
        if (xkcd_atx_tscriptDiv.style.display != 'block') {
            xkcd_atx_tscriptDiv.style.display = 'block';
        } 
        else {
            xkcd_atx_tscriptDiv.style.display = 'none';
        }
    });
}
/* <- transcript ctrl */

/* -> explainxkcd ctrl */
if (xkcd_atx_showExplain != 0) {
    var xkcd_atx_LiBtnExplain = document.createElement('li');
    var xkcd_atx_aBtnExplain = document.createElement('a');
    xkcd_atx_aBtnExplain.textContent = 'eXplain';
    xkcd_atx_aBtnExplain.accessKey = 'x';
    //xkcd_atx_aBtnExplain.style.cursor = "pointer"; //already points to a link
    xkcd_atx_aBtnExplain.title = 'Open relevant ExplainXKCD page.\nAccesskey: X';
    xkcd_atx_LiBtnExplain.appendChild(xkcd_atx_aBtnExplain);
    xkcd_atx_UlNewBtns.appendChild(xkcd_atx_LiBtnExplain);
    xkcd_atx_aBtnExplain.href = 'http://www.explainxkcd.com/wiki/index.php/' + xkcd_atx_comicNum;
    if (xkcd_atx_ntabExplain != 0) {
        xkcd_atx_aBtnExplain.target = '_blank';
    }
}
/* -> explainxkcd ctrl */
