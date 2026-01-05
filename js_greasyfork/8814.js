// ==UserScript==
// @name       jawz Gordon Courtney
// @version    1.1
// @description    something
// @match	   https://s3.amazonaws.com/mturk_bulk/hits/*
// @match      http://www.yelp.com/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require         https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/8814/jawz%20Gordon%20Courtney.user.js
// @updateURL https://update.greasyfork.org/scripts/8814/jawz%20Gordon%20Courtney.meta.js
// ==/UserScript==

var allText = $('body').text();
if (allText.indexOf("Business name:") >= 0) {
    allText = allText.replace(/(\r\n|\n|\r)/gm," ");
    var url = allText.match("name:(.*)");
    url = url[1];
    var url = url.match("(.*)City:");
    url = url[1];
    url = url.replace("Address:", "");
    url = url.replace(/\s+/g," ");
    console.log(url)
    
    var google_URL = "http://www.google.com/search?q=" + url + "yelp";
    google_URL = google_URL.replace(/[" "]/g, "+");
    google_URL = google_URL.replace("&", "%26");
    
    var halfScreen = screen.width/2; 
    var windowHeight = screen.height; 
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    
    myWindow = window.open(google_URL, '_blank','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Submit";
	btn.type = "button";
    
    
    ////Detect Ctrl////
    $(document).keydown(function(event){
        if(event.which=="17") {
            var den1 = GM_getValue("docurl");
            var den2 = GM_getValue("number");
            var den3 = GM_getValue("wifi");
            var den4 = GM_getValue("bizurl");
            $('input[name=price_range]').val(den1);
            $('input[name=reservations]').val(den2);
            $('input[name=wifi]').val(den3);
            $('input[name=web_url]').val(den4);
            myWindow.close();
        }
        
        if(event.which=="16") {
            var den1 = "N/A";
            var den2 = "N/A";
            var den3 = "N/A";
            var den4 = "N/A";
            $('input[name=price_range]').val(den1);
            $('input[name=reservations]').val(den2);
            $('input[name=wifi]').val(den3);
            $('input[name=web_url]').val(den4);
            $('select[name="vertical"]').val("Other");
            $('select[name="chain"]').val("No");
            myWindow.close();
        }
        
    });
    
    
}

if (document.URL.indexOf("www.yelp.com") >= 0) { 
    var number = "N/A";
    var wifi = "N/A";
    var count;
    var bizurl = "N/A";
    
    if (document.querySelector('[itemprop=telephone]')) {
        number = document.querySelector('[itemprop=telephone]').textContent;
        number = number.trim();
    }
    
    if (document.querySelector('dt[class="attribute-key"]')) {
        count = document.querySelectorAll('dt');
        wifi = document.querySelectorAll('dd');
        for (i=0; i < count.length; i++) {
            if (count[i].textContent) {
                if (count[i].textContent.indexOf('Wi-Fi') >= 0) {
                    count = i;
                    break
                }
            }
        }
        if (wifi[count]) {
            wifi = wifi[count].textContent.trim();
        } else
            wifi = "N/A"
    }
    
    if (document.querySelector('div[class="biz-website"]')) {
        bizurl = document.links;
        for (i=0; i < bizurl.length; i++) {
            if (bizurl[i].href.indexOf('/biz_redir') >= 0) {
                bizurl = bizurl[i].textContent
                break
            }
        }
        
    }
    console.log(number);
    console.log(wifi);
    console.log(bizurl);
    GM_setValue("number", number)
    GM_setValue("wifi", wifi)
    GM_setValue("bizurl", bizurl)
    GM_setValue("docurl", document.URL)
    
}
