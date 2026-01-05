// ==UserScript==
// @name       jawz Jared
// @version    1.6
// @description  enter something useful
// @match      https://www.mturkcontent.com/*
// @match      http://www.amazon.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/9519/jawz%20Jared.user.js
// @updateURL https://update.greasyfork.org/scripts/9519/jawz%20Jared.meta.js
// ==/UserScript==

function listenFor() {
    
    if (GM_getValue(google_URL + "ASIN")) {
        var asin = GM_getValue(google_URL + "ASIN");
        document.getElementById('asin').value = asin;
        document.getElementById('asin').focus();
        GM_deleteValue(google_URL + "ASIN");
        $('#submitButton').click(); 
    }
    
    if (GM_getValue(google_URL + "NA")) {
        $( "input[name='selection'][value='not_found']" ).click();
        //$( "input[name='selection'][value='not_found']" ).prop( "checked", true );
        GM_deleteValue(google_URL + "NA");
        $('#submitButton').click();
    }
}

if (document.URL.indexOf("www.mturkcontent.com") >= 0) { 
    var content = document.body.textContent || document.body.innerText;
    var lines = content.split('\n');
    lines[34] = lines[34].trim().replace("©", "").replace("™", "").replace("�", "").replace("�", "").replace("#", "").replace(/[" "]/g, "%20")
    var google_URL = "http://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=" + lines[34];
    //google_URL = google_URL.replace(/[" "]/g, "+").replace("&", "%26");

    var halfScreen = window.outerWidth; //screen.width/2; 
    var wLeft = window.screenX + halfScreen;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupW = window.open(google_URL,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + wLeft + ',top=0' + specs,false);
    google_URL = google_URL.replace(/[^a-zA-Z ]/g, "").toLowerCase();
    console.log(google_URL);
    window.onbeforeunload = function (e) {
        popupW.close();
    }
    
    var timer = setInterval(function(){ listenFor(); }, 250);
        
}

if (document.URL.indexOf("www.amazon.com") >= 0) { 
    plinks = document.getElementById("nav-belt")
    var btn1 = document.createElement("BUTTON");
    btn1.innerHTML = "Not Available";
	btn1.type = "button";
    (function(){ btn1.onclick = function() { 
        var tagit = window.location.href.replace(/[^a-zA-Z ]/g, "").toLowerCase();
        GM_setValue(tagit + "NA", true); 
        setTimeout(function(){ GM_deleteValue(tagit + "NA"); }, 1000);
    } })();
    plinks.parentNode.insertBefore(btn1,plinks)
            
    $('body').on('click', 'a', function(e) {
        var tagit = window.location.href.replace(/[^a-zA-Z ]/g, "").toLowerCase();
        e.preventDefault();
        var link = this.href
        link = link.substring(link.indexOf("/dp/") + 4);
        link = link.substring(0, link.indexOf("/ref"));
        GM_setValue(tagit + "ASIN", link);
        setTimeout(function(){ GM_deleteValue(tagit + "ASIN"); }, 1000);
        console.log(tagit);
    });
    
}