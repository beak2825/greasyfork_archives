// Hello HDW&TTG
// version 0.3 BETA!
// 2014-11-16
// Copyright (c) 2014, Marco Meng
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.

// How to install new scripts to Tampermonkey? (quote from http://tampermonkey.net/faq.php#Q102)
// 1.Go to userscripts.org, greasyfork.org, openuserjs.org or monkeyguts.com. 
//   Search for a script, open the script's page and click at the install button.)
// 2.Search GitHub Gist and Github for userscripts. Then click it at the view raw link.
// 3.You can also search for scripts at your preferred search engine. 
//   Then search for a link that ends up on .user.js and click it
// 4.If you have a URL to a script, just paste it to Chrome's Omnibox.
// 5.Go to TMs options page and click at the edit column of the <New script> item. Enter the source and save it.
// 6.Go to Chromes extensions page, enable the Allow access to file URLs checkbox at the Tampermonkey item, 
// create a file with the file extensions .tamper.js and drag-and-drop it to Chrome.

// How to install new scripts to GreaseMonkey?
// just name the file with extension .user.js and open with firefox.

// To uninstall, go to Tools/Manage User Scripts,
// select "Hello HDWing", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Hello HDW&TTG
// @namespace     http://marcogreasemonkey.org/download/
// @author        Marco Meng
// @version       0.3 beta
// @license        GPL version 3
// @description   auto-sign for HDW and TTG
// @grant         GM_xmlhttpRequest
// @require       http://code.jquery.com/jquery-1.4.2.js 
// @include       http://hdwing.com/*
// @include       http://totheglory.im/*
// @exclude       http://marcogreasemonkey.org/*
// @downloadURL https://update.greasyfork.org/scripts/6545/Hello%20HDWTTG.user.js
// @updateURL https://update.greasyfork.org/scripts/6545/Hello%20HDWTTG.meta.js
// ==/UserScript==
var hdwing = "hdwing.com";
var ttg    = "totheglory.im";

$().ready(function() {
    var signBtn,scripts,index,signScript,re,rd;
    var hostName = window.location.hostname;
    if (hostName == hdwing) {
        
        signBtn= $("#sign_button");
        if (signBtn.is(":disabled")) return;
        signBtn.attr("disabled","disabled");
        
        // check current sign state
        if (signBtn.attr("value") == "签　到") {
            // extract hash value in the script
            scripts = $("script");
            index = scripts.length - 3;
            signScript = scripts[index].textContent;
            re = /hash:"(.*)"/;
            rd = re.exec(signScript);
            var hashValue = encodeURIComponent(rd[1]);
            // post sign request
            GM_xmlhttpRequest({
                method:'POST',
                url:'http://hdwing.com/usersign.php',
                data:'hash='+hashValue,
                headers:{
                    'User-agent': 'Mozilla/5.0 (compatible) Greasemonkey/2.3',
                    'Host':'hdwing.com',
                    'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8'
                },
                onload: function(data) {
                    var rd = data.responseText.split("|");
                    if(rd.length<3||parseInt(rd[0])<1){
                        var msg  ="";
                        if(parseInt(rd[0])==-1)msg="，请稍后再试";
                        if(parseInt(rd[0])==-2)msg="，今天已经签到了？";
                        alert("数据无效"+msg);
                    }else{
                        alert("第"+rd[4]+"个签到成功，已经连续签到"+rd[1]+"天，赠送积分"+rd[2]+",明天继续签到可赠送"+rd[3]+"分");
                        $("#sign_button").attr('class','btnd btn-blue');
                        $("#sign_button").attr('value','已签到');
                    }
                    
                }
            });
        }
    }else if (hostName == ttg) {
        signBtn= $("a#signed");
        if (signBtn.length) {
            var timeStamp,token;
            scripts = $("head").children("script");
            index = scripts.length - 1;
            signScript = scripts[index].textContent;
            re = /signed_timestamp:\s*"(.*)",\s*signed_token:\s*"(.*)"/;
            rd = re.exec(signScript);
            timeStamp = rd[1];
            token     = rd[2]; 
            GM_xmlhttpRequest({
                method:'POST',
                url:'http://totheglory.im/signed.php',
                data:'signed_timestamp='+timeStamp+"&signed_token="+token,
                headers:{
                    'User-agent': 'Mozilla/5.0 (compatible) Greasemonkey/2.3',
                    'Host':'totheglory.im',
                    'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8'
                },
                onload: function(data) {
                    $('#sp_signed').html("<b style=\"color:green;\">已签到</b>");
                    alert(data.responseText);
                }
            });
            
            
        }
        
        
    }
        
        });









