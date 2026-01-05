// ==UserScript==
// @name GSM Arena Info Fetcher
// @namespace http://www.gsmarena.com/
// @version 0.1
// @description Get phone info from GSM arena
// @match http://www.gsmarena.com/*
// @copyright 2014+, Decky Fx.
// @require http://code.jquery.com/jquery-latest.js
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/6450/GSM%20Arena%20Info%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/6450/GSM%20Arena%20Info%20Fetcher.meta.js
// ==/UserScript==
(function() {
    var css_array = [];
    css_array[0] = ".button{text-align:center;background:#65a9d7;background:-webkit-gradient(linear,left top,left bottom,from(#3e779d),to(#65a9d7));background:-webkit-linear-gradient(top,#3e779d,#65a9d7);background:-moz-linear-gradient(top,#3e779d,#65a9d7);background:-ms-linear-gradient(top,#3e779d,#65a9d7);background:-o-linear-gradient(top,#3e779d,#65a9d7);padding:9.5px 19px;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;-webkit-box-shadow:rgba(0,0,0,1)0 1px 0;-moz-box-shadow:rgba(0,0,0,1)0 1px 0;box-shadow:rgba(0,0,0,1)0 1px 0;text-shadow:rgba(0,0,0,.4)0 1px 0;color:#fff;font-size:14px;font-family:'Lucida Grande',Helvetica,Arial,Sans-Serif;text-decoration:none;vertical-align:middle;margin-bottom:5px;width:150px;border:1px solid #000;cursor:pointer}.button:hover{border-top-color:#28597a;background:#28597a;color:#ccc}.button:active{border-top-color:#1b435e;background:#1b435e}";
    css_array[1] = ".modalDialog{position:fixed;font-family:Arial,Helvetica,sans-serif;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.8);z-index:99999;opacity:0;-webkit-transition:opacity 400ms ease-in;-moz-transition:opacity 400ms ease-in;transition:opacity 400ms ease-in;pointer-events:none}.modalDialog:target{opacity:1;pointer-events:auto}.modalDialog>div{max-width:1000px;position:relative;margin:10% auto;padding:5px 20px 13px;border-radius:10px;background:#fff;background:-moz-linear-gradient(#fff,#999);background:-webkit-linear-gradient(#fff,#999);background:-o-linear-gradient(#fff,#999)}.close{background:#606061;color:#FFF;line-height:25px;position:absolute;right:-12px;text-align:center;top:-10px;width:24px;text-decoration:none;font-weight:700;-webkit-border-radius:12px;-moz-border-radius:12px;border-radius:12px;-moz-box-shadow:1px 1px 3px #000;-webkit-box-shadow:1px 1px 3px #000;box-shadow:1px 1px 3px #000}.close:hover{background:#00d9ff}.modalDialog div h2{font-size:large;margin-bottom:10px}.modalDialog div p{font-family:verdana;font-size:small;float:none;width:initial;text-align:initial}"; 
    css_array[2] = ".copy_to_clipboard_toast{width:200px;height:20px;height:auto;position:absolute;left:50%;margin-left:-100px;top:50px;background-color:#000055;color:#F0F0F0;font-family:Calibri;font-size:20px;padding:10px;text-align:center;border-radius:2px;-webkit-box-shadow:0 0 24px -1px rgba(56,56,56,1);-moz-box-shadow:0 0 24px -1px rgba(56,56,56,1);box-shadow:0 0 24px -1px rgba(56,56,56,1)}";
    
    
    var css = css_array.join("");
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }
  
    Array.prototype.clean = function(deleteValue) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };
})();

function getInfo() {
    var tables = $("div#specs-list table");
    var text = "";
    var break_on_misc = false;
    for (var i = 0; i < tables.length; i++) {
        var table = $(tables[i]);
        var trs = table.find("tr");
        var is_camera = false;
        var is_battery = false;
        for (var n = 0; n < trs.length; n++) {            
            var tr = $(trs[n]);
            var text_array = tr.text().trim().split("\n");
            if (text_array.length >= 3) {
                if (text_array[0] == "Camera") {
                    is_camera = true;
                } else {
                    is_camera = false;
                }
                if (text_array[0] == "Battery") {
                    is_battery = true;
                } else {
                    is_battery = false;
                }
                if (text_array[0] == "Misc") {
                    break_on_misc = true;
                    return text.trim();
                }
                text_array.shift();
            }
            text_array.clean("");
            if (text_array.length == 2) {
                if (is_camera) {
                    text_array[0] = "Camera " + text_array[0];
                } else if (is_battery) {
                    text_array[0] = "Battery " + text_array[0];
                }
                text += "\n" + text_array.join(": ");
            } else {
                text += ", " + text_array.join(", ");
            }
        }
    }
    return text.trim();
}


$('div#ttl.brand').prepend('<div class="button" id="getinfo-button">GET INFO</div>');
$("body").append('<div id="openModal" class="modalDialog"><div id="modalContents"><a href="#close" title="Close" class="close">X</a><h2>Modal Box</h2><div id="modalTexts" style="height:400px; overflow:auto;"></div></div></div>');
$("body").append('<div class="copy_to_clipboard_toast" style="display:none; z-index:999999;">Copied to Clipboard</div>');
$("#getinfo-button").click(function() {
    var contents = getInfo();
    var modalContents = $("#modalTexts");
    var splited_contents = contents.split("\n");
    for (var i = 0; i < splited_contents.length; i++) {
        modalContents.append('<p>' + splited_contents[i] + '</p><br/>');
    }
    window.location.hash = "openModal";
    GM_setClipboard (contents);
    $('.copy_to_clipboard_toast').fadeIn(400).delay(3000).fadeOut(400);
});