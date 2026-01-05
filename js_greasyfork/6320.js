// ==UserScript==
// @name         Re 2ch Links
// @version      1.2b
// @description  2ch各種連結還原、縮圖預覽
// @include      http://*.2ch.*/
// @include      http://*.bbspink.com/*
// @include      http://*.open2ch.net/*
// @grant        GM_log
// @grant        GM_addStyle
// @noframes
// @namespace https://greasyfork.org/users/6037
// @downloadURL https://update.greasyfork.org/scripts/6320/Re%202ch%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/6320/Re%202ch%20Links.meta.js
// ==/UserScript==
var imgSE = 1; //預設1開啟縮圖預覽 0關閉

var ttp = function ttp(){
    var b=document.body; 
    b.innerHTML = b.innerHTML.replace(/(\<br\>\s)(ttp\:\/\/.*?\/.*?)(\s\<br\>)/g, '$1<a href="h$2" target="_blank">h$2</a>$3');
    //b.innerHTML = b.innerHTML.replace(/(\s)(ttp\:\/\/.*?\/.*?\.jpg)(\s\<br\>)|(\s)(ttp\:\/\/.*?\/.*?\.png)(\s\<br\>)|(\s)(ttp\:\/\/.*?\/.*?\.gif)(\s\<br\>)/ig, '$1<a href="h$2" target="_blank">h$2</a>$3');
};ttp();

var ras = 0;
var ra = function re1(){
    var b=document.body;

    b.innerHTML = b.innerHTML.replace(/(\<a\shref\=\")http\:\/\/.*?\/.*?(\"\starget\=\"\_blank\"\>)(http\:\/\/.*?)(\<\/a\>)/ig, '$1$3$2$3$4');
    if (ras < 1){
        setTimeout(ra, 1000);
    }ras++;
};ra();

var css = '.UCss1{max-width:200px;max-height:200px}';
var Uimg = function Uimg1(){   
    GM_addStyle(css);
    if (imgSE == 1){
        var Ulinks = document.links;
        
        for(var i=1;i<Ulinks.length;i++){
            if (Ulinks[i].innerHTML.match('.png') !== null || Ulinks[i].innerHTML.match('.jpg') !== null || Ulinks[i].innerHTML.match('.gif') !== null || Ulinks[i].innerHTML.match('.JPG') !== null || Ulinks[i].innerHTML.match('.PNG') !== null || Ulinks[i].innerHTML.match('.GIF') !== null ){
                Ulinks[i].innerHTML = Ulinks[i].innerHTML.replace(/(.*)/, "");
                var Uhref = Ulinks[i].href;
                var imgt = document.createElement('img');
                imgt.setAttribute('src', Uhref);
                imgt.setAttribute('class', 'UCss1');
                Ulinks[i].appendChild(imgt);              
                var imgt2 = document.createElement('p');
                imgt2.innerHTML = Uhref;
                Ulinks[i].appendChild(imgt2);
            }
        }
    }};Uimg();
