// ==UserScript==
// @name        Voat user account info on mouseover
// @namespace   http://voat.co
// @description Shows Voat user information on tooltip when you mouseover a user name
// @version     2015.2.21
// @author      morbo
// @include     http://*.voat.co/*
// @include     https://*.voat.co/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8190/Voat%20user%20account%20info%20on%20mouseover.user.js
// @updateURL https://update.greasyfork.org/scripts/8190/Voat%20user%20account%20info%20on%20mouseover.meta.js
// ==/UserScript==


var userName = "";
var as = document.getElementsByTagName("a");

for(var i = 0; i<as.length; i++)
{
    var cls = as[i].getAttribute("class");
    if(cls)
    {
        if(cls.indexOf("author") >= 0)
        {
            userName = as[i].textContent;
            as[i].userName = userName;
            as[i].addEventListener("mouseover", showUserInfo, false);
        }
    }
}


function showUserInfo(event)
{
    if (event.target.title != "")
        {
            return;
        }
    
    var apiQuery = "https://voat.co/api/userinfo?userName=" + event.target.userName;
    var parseXml;
    
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", apiQuery, false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML; 
    
    var userInfo = xmlDoc.getElementsByTagName("ApiUserInfo") [0];
    var userName = userInfo.getElementsByTagName("Name") [0].childNodes[0].nodeValue; 
    var ccp = userInfo.getElementsByTagName("CCP") [0].childNodes[0].nodeValue; 
    var lcp = userInfo.getElementsByTagName("LCP") [0].childNodes[0].nodeValue; 
    var startDate = userInfo.getElementsByTagName("RegistrationDate") [0].childNodes[0].nodeValue;
    var startDateConvert = new Date(startDate);
    
    event.target.title = userName + "   LCP: " + lcp + "   CCP: " + ccp + "   Voater since: " + startDateConvert.toLocaleDateString();
}
