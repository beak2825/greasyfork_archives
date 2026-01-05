// ==UserScript==
// @name        Aptoide Direct Download APK
// @description A basic script for download apk from Aptoide
// @include     http://*.store.aptoide.com/*
// @exclude     http://apps.store.aptoide.com/
// @version     2.3
// @grant       none
// @namespace https://greasyfork.org/users/9362
// @downloadURL https://update.greasyfork.org/scripts/8246/Aptoide%20Direct%20Download%20APK.user.js
// @updateURL https://update.greasyfork.org/scripts/8246/Aptoide%20Direct%20Download%20APK.meta.js
// ==/UserScript==

// Based on http://userscripts-mirror.org/scripts/show/180436

var current_location = window.location;

if(!current_location.toString().match(/http:\/\/m\./)){
    
mobile_site_add = "http://m."+window.location.toString().slice(7);

var mobile_site = function() {
        var b = document.getElementsByTagName('body')[0];
        var t = document.createElement('div');
    t.innerHTML = '<font color=green size=2><a href="'+mobile_site_add+'" style=text-decoration:none><div>Get Download Link<br>From Mobile Site</div></a>';
        t.style.position = 'absolute';
        t.style.left = '10px';
        t.style.top = '10px';
        b.appendChild(t);

}

mobile_site();
}//END NOTIFICATION

var src = document.documentElement.innerHTML;
var md5 = "-"+src.match(/MD5\:<\/strong> [A-Za-z0-9]*/).toString().slice(14);

var arrayURL = current_location.toString().split('/');
var appName = "/"+arrayURL[arrayURL.length-4].replace(/\./g,'-').toLowerCase();
var buildVer = "-"+arrayURL[arrayURL.length-3]+'-';
var appId = arrayURL[arrayURL.length-2];

var urlStore = arrayURL[2].toString().split('.');
var folder = "/"+urlStore[1];

var domain = "http://pool.apk.aptoide.com";

var download = domain+folder+appName+buildVer+appId+md5+".apk";

var ins_FC = function() {
        var div = document.createElement('div');
        div.setAttribute('style', ';border:1px solid red;padding:80px 10px 10px 10px;');
        div.innerHTML = '<a href=' + 'https://www.aptoide.com/webservices/2/getApkInfo/id:' + appId +'/xml' + '>+Info (XML)</a><br>';
        div.innerHTML += '<a href=' + 'https://www.aptoide.com/webservices/2/getApkInfo/id:' + appId +'/json' + '>+Info (JSON)</a>';
        document.body.insertBefore(div, document.body.firstChild);
}


var dl_button = function() {
        var b = document.getElementsByClassName('app_meta install_area')[0];
        var t = document.createElement('div');
        t.innerHTML = '<a href="'+download+'"><font size=2>&nbsp;<strong>DOWNLOAD APK</strong></a>' ;
        //t.style.position = 'absolute';
        //t.style.left = '70px' ;
        //t.style.top = '-20px' ;
        b.insertBefore(t,b.childNodes[1]);
}

ins_FC();
dl_button();