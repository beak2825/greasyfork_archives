// ==UserScript==
// @name         F777
// @namespace    http://tampermonkey.net/
// @version      777.0
// @description  YGNJAVASCRIPT GARTIC.IO AUTO F5 ON KICKED discord: ygnJavascript#9171
// @author       YGNJAVASCRIPT
// @grant        none
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/556936/F777.user.js
// @updateURL https://update.greasyfork.org/scripts/556936/F777.meta.js
// ==/UserScript==
var c = setInterval(function(){
if(document.title.indexOf("#") !== -1){
if(document.getElementById("popUp") && document.getElementById("popUp").style.display == "block"){
clearInterval(c);
}
if(document.getElementsByClassName('btYellowBig ic-playHome').length > 0) {
document.getElementsByClassName('btYellowBig ic-playHome')[0].click();
}
}
});

var $ = window.$;
var lastkickedroom = window.location.href;

var copySpace = document.createElement("input");
copySpace.style = "position:fixed;margin-top:-50px;";
copySpace.setAttribute("id","kopispace");
copySpace.setAttribute("value","");
document.body.appendChild(copySpace);

var myname = document.createElement("input");
myname.style = "position:fixed;margin-top:-50px;";
myname.setAttribute("id","myname");
myname.setAttribute("value","ⱤɆᗪ≫RØØMØWNER");
document.body.appendChild(myname);

var copyName = document.createElement("input");
copyName.style = "position:fixed;margin-top:-50px;";
copyName.setAttribute("id","kopiname");
copyName.setAttribute("placeholder","Click any nickname");
document.body.appendChild(copyName);

document.body.addEventListener("keyup", logkey);

function logkey(){
if(event.keyCode == 27){ // ESC Tuşu
var lastroom2 = window.location.href;
if(document.getElementById('exit')) document.getElementById('exit').click();
if(document.getElementsByClassName('btYellowBig smallButton ic-yes').length > 0) document.getElementsByClassName('btYellowBig smallButton ic-yes')[0].click();
var t = setInterval(function(){
if(window.location.href !== lastroom2){
clearInterval(t);
setTimeout(function(){
window.location.href = lastroom2;
},500);}
},1);
}

if(event.keyCode == 109){ // Numpad -
if(document.getElementById("exit")) document.getElementById("exit").click();
if(document.getElementsByClassName('btYellowBig smallButton ic-yes').length > 0) document.getElementsByClassName('btYellowBig smallButton ic-yes')[0].click();
}

if(event.keyCode == 106){ // Numpad * (Kopya alanı kopyalama)
document.getElementById("kopispace").select();
document.getElementById("kopispace").setAttribute("disabled","disabled");
document.execCommand("copy");
document.getElementById("kopispace").removeAttribute("disabled");
}

if(event.keyCode == 33){ // Page Up (İsim kopyalama)
document.getElementById("myname").select();
document.getElementById("myname").setAttribute("disabled","disabled");
document.execCommand("copy");
document.getElementById("myname").removeAttribute("disabled");
}

if(event.keyCode == 111){ // Numpad / (Odaya hızlı dönüş)
var grgr = lastkickedroom;
window.location.href = grgr;
}
}

var readyforkac = 0;

var lol = setInterval(function(){
var documentText = document.body.innerText;
var msgalrt = document.getElementsByClassName("msg alert");

// Diğer hatalı durum kontrolleri (PASİF, PROFİL, HATA vb.)
var searched = documentText.indexOf("PASİF");
if(searched !== -1){
if(document.getElementsByClassName('btYellowBig ic-yes').length > 0) document.getElementsByClassName('btYellowBig ic-yes')[0].click();
}

var searchedo = documentText.indexOf("PROFİL");
if(searchedo !== -1){
document.getElementById("kopiname").value = document.getElementsByClassName("content profile")[0].innerText.split("\n")[1];
document.getElementById("kopiname").select();
document.execCommand("copy");
}

var searchedr = documentText.indexOf("Zaten bu cihazda oynuyorsunuz");
if(searchedr !== -1){
if(document.getElementsByClassName('btYellowBig ic-yes').length > 0) document.getElementsByClassName('btYellowBig ic-yes')[0].click();
if(document.getElementsByClassName('btYellowBig ic-playHome').length > 0) document.getElementsByClassName('btYellowBig ic-playHome')[0].click();
}

var searchedp = documentText.indexOf("HATA");
if(searchedp !== -1){
if(document.getElementsByClassName('btYellowBig ic-yes').length > 0) document.getElementsByClassName('btYellowBig ic-yes')[0].click();
if(document.getElementsByClassName('btYellowBig ic-playHome').length > 0) document.getElementsByClassName('btYellowBig ic-playHome')[0].click();
}

var searchedx = documentText.indexOf("CEVAPLAR");
if(searchedx !== -1){
if(document.getElementsByClassName("user you").length > 0) document.getElementsByClassName("user you")[0].querySelectorAll(".nick")[0].style = "background-color:black;color:white;";
}

var searched2 = documentText.indexOf("KURALLAR");
if(searched2 !== -1){
document.cookie = "durdurma";
if(document.getElementsByClassName('btYellowBig ic-yes').length > 0) document.getElementsByClassName('btYellowBig ic-yes')[0].click();
lastkickedroom = window.location.href;
for (var i2 = 0; i2 < msgalrt.length; i2++){
document.getElementsByClassName("msg alert")[i2].innerHTML = "eski kick silindi";
}
readyforkac = 1;
}

// *** SADECE EN SON UYARI MESAJINI KONTROL ETME MANTIĞI ***
if(readyforkac == 1 && msgalrt.length > 0){
// Sadece en son eklenen alert mesajını alıyoruz.
var lastAlertIndex = msgalrt.length - 1;
var lastAlertText = msgalrt[lastAlertIndex].innerText;

// Bu kontrol (isAlertVisible), chat geçmişinde kalan görünmez mesajları elediğinden,
// burada sadece o an yeni eklenen en son mesajı kontrol etmemiz yeterlidir.
var searched3 = lastAlertText.indexOf("adlı kullanıcıyı atmak için oy verdi");

if(searched3 !== -1){
var mynickname = document.getElementsByClassName("user you")[0].querySelectorAll(".nick")[0].innerText;
var words = lastAlertText.split(" ");

if(words.indexOf(mynickname) !== -1){
clearInterval(lol);
var lastroom2 = window.location.href;

if(document.getElementById('exit')) document.getElementById('exit').click();
if(document.getElementsByClassName('btYellowBig smallButton ic-yes').length > 0) document.getElementsByClassName('btYellowBig smallButton ic-yes')[0].click();

var t = setInterval(function(){
if(window.location.href !== lastroom2){
clearInterval(t);
setTimeout(function(){
window.location.href = lastroom2;
},500);
}
},10);
}
}
}
// *** DÜZELTME BİTİŞİ ***
}, 1);
lol();