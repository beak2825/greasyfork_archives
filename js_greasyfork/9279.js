// ==UserScript==
// @name         AWS
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match		https://www.mturkcontent.com/dynamic/hit?assignmentId=*
// @match		https://www.linkedin.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant	    GM_deleteValue
// @grant        none
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/9279/AWS.user.js
// @updateURL https://update.greasyfork.org/scripts/9279/AWS.meta.js
// ==/UserScript==
var country = "";
var name = "";
var locality = "";
var region = "";
var postalcode = "";
var country = "";
var industry = "";
var size = "";
var website = "";
var density = "";



if (document.querySelector('a[class="density"]')) {
density = document.querySelector('a[class="density"]').textContent;
//density = density.replace("Website", "");
density = density.trim()
}

if (document.querySelector('[class="alert error"]')) 
    density = "NA"

if (density.length == 0) 
    density = 0
    
if (document.querySelector('li[class="website"]')) {
website = document.querySelector('li[class="website"]').textContent;
website = website.replace("Website", "");
website = website.trim()
}
    
if (document.querySelector('[itemprop=name]')) {
name = document.querySelector('[itemprop=name]').textContent;
name = name.trim();
}

if (document.querySelector('[itemprop=addressLocality]')) {
locality = document.querySelector('[itemprop=addressLocality]').textContent;
locality = locality.replace(",", "");
}
if (document.querySelector('[itemprop=addressRegion]')) {
region = document.querySelector('[itemprop=addressRegion]').textContent;
}
if (document.querySelector('[itemprop=postalCode]')) {
postalcode = document.querySelector('[itemprop=postalCode]').textContent;
}
if (document.querySelector('[itemprop=addressCountry]')) {
country = document.querySelector('[itemprop=addressCountry]').textContent;
}
if (document.querySelector('li[class="industry"]')) {
industry = document.querySelector('li[class="industry"]').textContent;
industry = industry.trim();
industry = industry.replace("Industry", "");
industry = industry.trim();
}
if (document.querySelector('li[class="company-size"]')) {
size = document.querySelector('li[class="company-size"]').textContent;
size = size.trim();
size = size.replace("Company Size", "");
size = size.trim();
}

//if (document.find('a[class="followers-count-num"]')) {
    //console.log(document.find('a[class="followers-count-num"]'));
//console.log(name + locality + region + postalcode + country + industry + size + website);
//For editing the blocklist
var div = document.createElement('div');
var textarea = document.createElement('textarea');

div.style.position = 'fixed';
div.style.width = '310px';
div.style.height = '170px';
div.style.left = '50%';
div.style.right = '50%';
div.style.margin = '-250px 0px 0px -250px';
div.style.top = '400px';
div.style.padding = '5px';
div.style.border = '2px';
div.style.backgroundColor = 'black';
div.style.color = 'white';
div.style.zIndex = '100';
div.setAttribute('id','block_div');

textarea.style.padding = '2px';
textarea.style.width = '300px';
textarea.style.height = '120px';
textarea.title = 'Block list';
textarea.setAttribute('id','block_text');

div.textContent = 'Data';
div.style.fontSize = '12px';
div.appendChild(textarea);

var save_button1 = document.createElement('button');

save_button1.textContent = '1';
save_button1.setAttribute('id', 'save_blocklist');
save_button1.style.height = '18px';
save_button1.style.width = '25px';
save_button1.style.fontSize = '10px';
save_button1.style.paddingLeft = '3px';
save_button1.style.paddingRight = '3px';
save_button1.style.backgroundColor = 'white';
save_button1.style.marginLeft = '5px';

div.appendChild(save_button1);

save_button1.addEventListener("click", function() {
    GM_setValue("Density1", density)
    window.close();
}, false);
document.body.insertBefore(div, document.body.firstChild);

var save_button2 = document.createElement('button');

save_button2.textContent = '2';
save_button2.setAttribute('id', 'save_blocklist');
save_button2.style.height = '18px';
save_button2.style.width = '25px';
save_button2.style.fontSize = '10px';
save_button2.style.paddingLeft = '3px';
save_button2.style.paddingRight = '3px';
save_button2.style.backgroundColor = 'white';
save_button2.style.marginLeft = '5px';

div.appendChild(save_button2);

$("#block_div").hide();
save_button2.addEventListener("click", function() {
    GM_setValue("Density2", density)
    window.close();
}, false);
document.body.insertBefore(div, document.body.firstChild);

var save_button3 = document.createElement('button');

save_button3.textContent = '3';
save_button3.setAttribute('id', 'save_blocklist');
save_button3.style.height = '18px';
save_button3.style.width = '25px';
save_button3.style.fontSize = '10px';
save_button3.style.paddingLeft = '3px';
save_button3.style.paddingRight = '3px';
save_button3.style.backgroundColor = 'white';
save_button3.style.marginLeft = '5px';

div.appendChild(save_button3);

$("#block_div").hide();
save_button3.addEventListener("click", function() {
    GM_setValue("Density3", density)
    window.close();
}, false);
document.body.insertBefore(div, document.body.firstChild);

var save_button4 = document.createElement('button');

save_button4.textContent = '4';
save_button4.setAttribute('id', 'save_blocklist');
save_button4.style.height = '18px';
save_button4.style.width = '25px';
save_button4.style.fontSize = '10px';
save_button4.style.paddingLeft = '3px';
save_button4.style.paddingRight = '3px';
save_button4.style.backgroundColor = 'white';
save_button4.style.marginLeft = '5px';

div.appendChild(save_button4);

$("#block_div").hide();
save_button4.addEventListener("click", function() {
    GM_setValue("Density4", density)
    window.close();
}, false);
document.body.insertBefore(div, document.body.firstChild);

var save_button5 = document.createElement('button');

save_button5.textContent = '5';
save_button5.setAttribute('id', 'save_blocklist');
save_button5.style.height = '18px';
save_button5.style.width = '25px';
save_button5.style.fontSize = '10px';
save_button5.style.paddingLeft = '3px';
save_button5.style.paddingRight = '3px';
save_button5.style.backgroundColor = 'white';
save_button5.style.marginLeft = '5px';

div.appendChild(save_button5);

$("#block_div").hide();
save_button5.addEventListener("click", function() {
    GM_setValue("Density5", density)
    window.close();
}, false);
document.body.insertBefore(div, document.body.firstChild);

var save_button6 = document.createElement('button');

save_button6.textContent = '6';
save_button6.setAttribute('id', 'save_blocklist');
save_button6.style.height = '18px';
save_button6.style.width = '25px';
save_button6.style.fontSize = '10px';
save_button6.style.paddingLeft = '3px';
save_button6.style.paddingRight = '3px';
save_button6.style.backgroundColor = 'white';
save_button6.style.marginLeft = '5px';

div.appendChild(save_button6);

$("#block_div").hide();
save_button6.addEventListener("click", function() {
    GM_setValue("Density6", density)
    window.close();
}, false);
document.body.insertBefore(div, document.body.firstChild);

var save_button7 = document.createElement('button');

save_button7.textContent = 'Input';
save_button7.setAttribute('id', 'save_blocklist');
save_button7.style.height = '18px';
save_button7.style.width = '100px';
save_button7.style.fontSize = '10px';
save_button7.style.paddingLeft = '3px';
save_button7.style.paddingRight = '3px';
save_button7.style.backgroundColor = 'white';
save_button7.style.marginLeft = '5px';

div.appendChild(save_button7);

$("#block_div").hide();
save_button7.addEventListener("click", function() {
    $("#block_div").hide();
    var den1 = GM_getValue("Density1");
    var den2 = GM_getValue("Density2");
    var den3 = GM_getValue("Density3");
    var den4 = GM_getValue("Density4");
    var den5 = GM_getValue("Density5");
    var den6 = GM_getValue("Density6");
    document.getElementById('Q1Url').value= den1
    document.getElementById('Q2Url').value= den2
    document.getElementById('Q3Url').value= den3
    document.getElementById('Q4Url').value= den4
    document.getElementById('Q5Url').value= den5
    document.getElementById('Q6Url').value= den6
}, false);
document.body.insertBefore(div, document.body.firstChild);

//var reset_blocks = function(){
        console.log("in");
        var div = $("#block_div");
        var textarea = $("#block_text");
		textarea.val(density + "\n" + name + "\n" +locality + "\n" + region + "\n" + postalcode + "\n" + country + "\n" + industry + "\n" + size + "\n" + website);
        $("#block_div").show();
    //};
 
document.getElementById('Q1Url').value= den