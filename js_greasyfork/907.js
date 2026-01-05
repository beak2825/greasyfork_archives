// ==UserScript==
// @name       Captcha Counter
// @version    0.9
// @match      https://www.mturk.com/mturk/*
// @copyright  2014+, Tjololo
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @namespace https://greasyfork.org/users/710
// @description Counts the number of hits remaining before you get a captcha
// @downloadURL https://update.greasyfork.org/scripts/907/Captcha%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/907/Captcha%20Counter.meta.js
// ==/UserScript==

var hitId = "";
if (document.getElementsByName("hitId")[0])
    hitId = document.getElementsByName("hitId")[0].value;
var captchanum = 35;
if (localStorage["captcha_number"]){
    captchanum = parseInt(localStorage["captcha_number"]);
}
var count = 0;
if (localStorage["captcha_counter"]){
    count = parseInt(localStorage["captcha_counter"]);
    console.log("Count: "+count);
}

if(window.location.href.indexOf("accept") > -1) {
    if ($('input[name="userCaptchaResponse"]').length > 0) {
    	count = 0;
    	localStorage["captcha_counter"] = count;
        console.log("Captcha found: "+count);
	}
    else{
    	if (hitId != "" && $('div[class="message error"]').length == 0){
	        console.log("Accepted Hit");
	        count+=1;
	        localStorage["captcha_counter"]=count;
            console.log((captchanum-count)+" hits left until captcha!");
            if (count == captchanum)
                alert("Next hit is a captcha!");
	        //alert((captchanum-count)+" hits left until captcha!");
	    }
	    else{
	        console.log("No hit accepted");
	    }
    }
    
}
else{
    if ($('input[name="userCaptchaResponse"]').length > 0) {
    	count = 0;
    	localStorage["captcha_counter"] = count;
        console.log("Captcha found: "+count);
	}
}

if (captchanum-count == 1)
    captchaCountStr = (captchanum-count)+" hit left until captcha!";
else if (captchanum-count == 0)
    captchaCountStr = "Last hit before captcha!";
else
    captchaCountStr = (captchanum-count)+" hits left until captcha!";

var row = document.createElement("tr");
var cell = document.createElement("td");
if ($('#theTime').length)
  var table = $('#theTime').parents('table')[0];
else
  var table = $('.title_orange_text_bold:first').parents('tbody')[0];
cell.className = "title_orange_text";
cell.setAttribute("align","left");
cell.setAttribute("valign","top");
cell.setAttribute("style","white-space: nowrap; padding-top: 1ex;");
cell.style.paddingTop = "3px";
cell.addEventListener("click", function clickCell(e) {
    var num_str=prompt("How many hits do you accept before you get a captcha? Note: This includes returns","35");
    var num = parseint(num_str);
    if (num){
        localStorage["captcha_number"] = num;
    	alert("Captcha number saved as "+num);
    }
});
cell.innerHTML="<b>Captcha:</b> <span>"+captchaCountStr+"</span>";
row.appendChild(cell);
table.appendChild(row);