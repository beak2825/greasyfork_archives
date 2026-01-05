// ==UserScript==
// @name           Chaturbate reloaded
// @name:de        Chaturbate reloaded
// @name:es        Chaturbate reloaded
// @name:es-CO     Chaturbate reloaded
// @name:it        Chaturbate reloaded
// @name:fr        Chaturbate reloaded
// @name:fr-CA     Chaturbate reloaded
// @name:ru        Chaturbate reloaded
// @name:tr        Chaturbate reloaded
// @name:ro        Chaturbate reloaded
// @name:no        Chaturbate reloaded
// @name:nl        Chaturbate reloaded
// @name:pl        Chaturbate reloaded
// @name:ja        Chaturbate reloaded
// @name:el        Chaturbate reloaded
// @name:hu        Chaturbate reloaded
// @name:fi        Chaturbate reloaded
// @name:ar        Chaturbate reloaded
// @name:hi        Chaturbate reloaded
// @name:id        Chaturbate reloaded
// @name:ko        Chaturbate reloaded
// @name:pt-PT     Chaturbate reloaded
// @name:pt-BR     Chaturbate reloaded
// @name:zh        Chaturbate reloaded
// @name:zh-CN     Chaturbate reloaded
// @name:zh-TW     Chaturbate reloaded
// @name:cs        Chaturbate reloaded
// @name:sk        Chaturbate reloaded
// @name:sl        Chaturbate reloaded
// @name:sv        Chaturbate reloaded
// @description      Gives you a new and improved chaturbate experience.
// @description:de   Gibt Ihnen ein neues und verbessertes Chaturbate erlebnis.
// @description:es   Te brinda una experiencia de chaturbate nueva y mejorada.
// @description:es-CO Te brinda una experiencia de chaturbate nueva y mejorada.
// @description:it   Ti dà un'esperienza di chaturbate nuova e migliorata.
// @description:fr   Vous donne une nouvelle expérience de chaturbate améliorée.
// @description:fr-CA Vous donne une nouvelle expérience de chaturbate améliorée.
// @description:ru   Дает вам новый и улучшенный опыт Chaturbate.
// @description:tr   Size yeni ve geliştirilmiş bir Chaturbate deneyimi sunar.
// @description:ro   Vă oferă o experiență de chaturbate nouă și îmbunătățită.
// @description:no   Gir deg en ny og forbedret Chaturbate opplevelse.
// @description:nl   Geeft u een nieuwe en verbeterde chaturbate ervaring.
// @description:pl   Daje nowe i ulepszone doświadczenie chaturbate.
// @description:ja   新しい改善されたChaturbateエクスペリエンスを提供します。
// @description:el  Σας δίνει μια νέα και βελτιωμένη εμπειρία chaturbate.
// @description:hu   Új és továbbfejlesztett Chaturbate élményt nyújt.
// @description:fi   Antaa sinulle uuden ja parannetun Chaturbate kokemuksen.
// @description:ar   يمنحك تجربة Chaturbate جديدة ومحسّنة.
// @description:hi   आपको एक नया और बेहतर चैटबेट अनुभव देता है।
// @description:id   Memberi Anda pengalaman chaturbate yang baru dan lebih baik.
// @description:ko   새롭고 개선 된 Chaturbate 경험을 제공합니다.
// @description:pt-PT Dá a você uma experiência chaturbate nova e aprimorada.
// @description:pt-BR Dá a você uma experiência chaturbate nova e aprimorada.
// @description:zh   为您提供新的和改进的Chaturbate体验。
// @description:zh-CN 为您提供新的和改进的Chaturbate体验。
// @description:zh-TW 为您提供新的和改进的Chaturbate体验。
// @description:cs   Poskytuje vám nový a vylepšený zážitek z chaturebate.
// @description:sk   Vylepšuje Chaturbate pridaním viacerých nových funkcií.
// @description:sl   Poskytuje vám nový a vylepšený zážitok z chatrba.
// @description:sv   Ger dig en ny och förbättrad chaturbate upplevelse.
// @version        1.6.0
// @namespace      chaturbate_goes_Ladroop
// @match          https://*chaturbate.com/*
// @match          https://*.chaturbate.com/*
// @exclude        https://secure.chaturbate.com/*
// @exclude        https://*chaturbate.com/security/
// @exclude        https://*chaturbate.com/apps/*
// @exclude        https://*chaturbate.com/api/*
// @exclude        https://*chaturbate.com/b/*
// @exclude        https://*chaturbate.com/fullvideo/*
// @exclude        https://*chaturbate.com/accounts/followers/*
// @require        https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js
// @grant          window.focus
// @grant          GM_xmlhttpRequest
// @connect        translate.googleapis.com
// @run-at         document-end
// @license	       MIT
// @copyright      2025 Ladroop
// @downloadURL https://update.greasyfork.org/scripts/499685/Chaturbate%20reloaded.user.js
// @updateURL https://update.greasyfork.org/scripts/499685/Chaturbate%20reloaded.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.getElementById("scriptinfo")){return;}
    var scinfo=GM_info;
    var version=scinfo.script.version;
    var scriptname=scinfo.script.name;
    var i=0;
    var n=0;
    var currpage=document.location.href;
    var domain="https://"+window.location.hostname+"/";
    var ppage=false;
    var biodata="";
    var referenceNode="";
    var roomname= currpage.split("/")[3];
    if (roomname =="p"){
        ppage=true;
    }
    var hls_source = "";
    var fetching=0;
    var hlsfetching=false;
    var loggedin=false;
    var yourname="";
    var username="";
    var br="";
    var vfilter="brightness(100%) contrast(100%) invert(0%) saturate(100%) hue-rotate(0deg)";
    var ofils="";
    var vmirror="none";
    var pos1=0;
    var pos2=0;
    var pos3=0;
    var pos4=0;
    var vareaid="";
    if (document.querySelector('[data-testid="username"]')){
        loggedin=true;
        yourname=document.querySelector('[data-testid="username"]').innerHTML;
    }
    var observer4=new MutationObserver(adjusthumbs);
    var observerConfig4 ={attributes : true, attributeFilter : ['class'] };
    var observer41=new MutationObserver(adjusthumbs);
    var observer5=new MutationObserver(adjustbiohumbs);
    var observerConfig5 ={attributes : true, attributeFilter : ['style'] };
    var observer6=new MutationObserver(adjustfollowhumbs);
    var observerConfig6 ={attributes : true, attributeFilter : ['style'] };
    var observer8=new MutationObserver(regetpage);
    var observerConfig8 ={attributes : true, attributeFilter : ['class'] };
    var observer3 = new MutationObserver(varea);
    var observerConfig3 = {childList: true, subtree: true};
    var tabblink=false;
    var ctitle=document.title;
    var container="";
    var bio=false;
    var thisfap="";
    var fapbr="";
    var cimg = new Image();
    var pimg = new Image();
    var lt2=0;
    var usernoteslist = "";
    var stor="greg44609";
    var tour=domain+"in/?tour=4uT2&campaign=hgg5k&track=default";
    var note='<svg style="height: 2.0em; width: 2.0em;" viewBox="0 0 12 12" xmlns="https://www.w3.org/2000/svg"><path fill="hsla(0, 100%, 50%, 0.8)" d="M5.5 2.00002H2C1.73478 2.00002 1.48043 2.10537 1.29289 2.29291C1.10536 2.48044 1 2.7348 1 3.00002V10C1 10.2652 1.10536 10.5196 1.29289 10.7071C1.48043 10.8947 1.73478 11 2 11H9C9.26522 11 9.51957 10.8947 9.70711 10.7071C9.89464 10.5196 10 10.2652 10 10V6.50002" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.25 1.24985C9.44891 1.05094 9.7187 0.939194 10 0.939194C10.2813 0.939194 10.5511 1.05094 10.75 1.24985C10.9489 1.44877 11.0607 1.71855 11.0607 1.99985C11.0607 2.28116 10.9489 2.55094 10.75 2.74985L6 7.49985L4 7.99985L4.5 5.99985L9.25 1.24985Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    var nonote='<svg style="height: 2.0em; width: 2.0em;" viewBox="0 0 12 12" xmlns="https://www.w3.org/2000/svg"><path fill="hsla(197, 10%, 98%, 0.3)" d="M5.5 2.00002H2C1.73478 2.00002 1.48043 2.10537 1.29289 2.29291C1.10536 2.48044 1 2.7348 1 3.00002V10C1 10.2652 1.10536 10.5196 1.29289 10.7071C1.48043 10.8947 1.73478 11 2 11H9C9.26522 11 9.51957 10.8947 9.70711 10.7071C9.89464 10.5196 10 10.2652 10 10V6.50002" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.25 1.24985C9.44891 1.05094 9.7187 0.939194 10 0.939194C10.2813 0.939194 10.5511 1.05094 10.75 1.24985C10.9489 1.44877 11.0607 1.71855 11.0607 1.99985C11.0607 2.28116 10.9489 2.55094 10.75 2.74985L6 7.49985L4 7.99985L4.5 5.99985L9.25 1.24985Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    var notegrey='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 12 12" role="img"><path stroke="#48484E" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V6.5"></path><path stroke="#48484E" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.25 1.25a1.06 1.06 0 0 1 1.5 1.5L6 7.5 4 8l.5-2z"></path></svg>';
    var tr2="https://www.chaturbate.com/translate_a/";
    if (currpage.indexOf(stor)!=-1){document.location.href=domain;}
    var discoverpage=false;
    var thumbpage=false;
    var tagspage=false;
    var openthumbname="";
    var opennote="";
    var data="";
    var room_status="";
    var videoSrc="";
    var cmaf=true;
    var stream;
    var vidwidth=854;
    var hls = new Hls();
    var gojpg=false;
    var fatalerror=0;
    var recording=false;
    var recpause=false;
    var mediaRecorder;
    var recordedBlobs=[];
    var recname="";
    var hidurl=domain+"api/ts/roomlist/room-list/?&hidden=true&limit=90&offset=";
    var hprom=false;
    var hidoffset=0;
    var hiddenarray=[];
    var region=["asia","europe_russia","northamerica","southamerica","other"];
    var niceregion=["Asia","Europe/Russia","North America","South America","Other (Australia, Africa, etc.)"];
    var rcount=0;
    var regoffset=0;
    var regioarray=[];
    var regiofetch=true;
    var banusers=[];
    var noaccess=false;
    var c1=0;
    var c2=0;
    var c3=0;
    var c4=0;
    var c5=0;
    var c6=0;
    var c7=0;
    var c7a=100;
    var c8=0;
    var c10=0;
    var firstentry=true;
    var twaiting=false;
    var chatrules="";
    var roomthumbs="";
    var followstar="";
    var nrt=0;
    var roomstatus="";
    var oldroomstatus="";
    var alarmaudio = new Audio('https://web.static.mmcdn.com/tsdefaultassets/sounds/classic/huge.mp3');
    var alarmrun=false;

    if (!readCookie("agreeterms")){
        createCookie("agreeterms","1");
        window.localStorage.clear();
        setTimeout(function(){
            window.location.reload(true);
        },100);
    }
    if (document.getElementsByClassName("dismiss_notice_tfa_and_email").length>0){
        document.getElementsByClassName("dismiss_notice_tfa_and_email")[0].click();
    }
    setgenstyle();
    getmessage();
    if (roomname=="messages"){
        if(window.opener){
            if (window.opener.innerWidth!=window.innerWidth){
                document.getElementById("header").style.display="none";
                return;
            }
        }
    }
    if (roomname=="my_collection"){
        if (document.getElementsByTagName("video").length>0){
            savedprvdownload();
        }
        return;
    }
    if (roomname=="photo_videos"){
        collectiondownload();
        return;
    }

    var supporter=true;
    var login=true;
    if (document.querySelector('[class="upgrade"]')){
        supporter=false;
    }
    if (document.querySelector('[href="/auth/login/"]')){
        supporter=false;
        login=false;
    }
    getignorelist();
    getsaving();
    refresher();
    if (roomname=="discover"){discoverpage=true;}
    if (roomname=="tags"){tagspage=true;}
    aff();
    noadd();
    moreoptions();
    if (roomname=="messages"){
        document.getElementById("ignore").style.display="none";
        return;
    }
    if (document.querySelector('[data-testid="denied-notice"]')){
        bannedroom();
        return;
    }
    if (roomname=="roomlogin"){
        noaccess=true;
        roomname=currpage.split("/")[4];
        passwordfollow();
        return;
    }
    if (tagspage){setupfollowmove();return;}
    if (discoverpage){dothumbpagethings();return;}
    if (!document.hasFocus()){
        document.addEventListener("focus",getpage);
        return;
    }
    setTimeout(getpage2,500);
    return;

    function getpage(){
        document.removeEventListener("focus",getpage);
        setTimeout(getpage2,500);
        return;
    }
    function getpage2(){
        if (document.querySelector('[src="https://web.static.mmcdn.com/tsdefaultassets/play-inactive.svg"]')){
            document.querySelector('[src="https://web.static.mmcdn.com/tsdefaultassets/play-inactive.svg"]').click();
        }
        thumbpage=false;
        if(!ppage){
            thumbpage=true;
            if(document.querySelector('[data-testid="theatermode-root"]')){
                thumbpage=false;
                if(document.querySelector('[data-testid="theatermode-root"]').style.display=="none"){
                    thumbpage=true;
                }
            }
            setTimeout(function(){observer8.observe(document.getElementById("main"),observerConfig8);},500);
        }
        if (thumbpage){
            document.getElementById("ignore").style.display="none";
            dothumbpagethings();
            return;
        }
        test();
    }
    function regetpage(){
        observer8.disconnect();
        setTimeout(regetpage2,500);
    }
    function regetpage2(){
        setTimeout(function(){observer8.observe(document.getElementById("main"),observerConfig8);},500);
        thumbpage=false;
        document.getElementById("ignore").style.display="block";
        if (document.querySelector('[data-testid="theatermode-root"]').style.display=="none"){
            thumbpage=true;
            document.getElementById("ignore").style.display="none";
            dothumbpagethings();
            return;
        }
        cleanuppage();
        test();
    }
    function test(){
        if(document.getElementsByClassName("BioContents").length>0){
            container=document.getElementsByClassName("BioContents")[0];
            n=0;
            setTimeout(function(){test2();}, 100);
        }else{
            n++;
            if (n==100){return;}
            setTimeout(function(){test();}, 100);
        }
    }
    function test2(){
        if (n==100){return;}
        if (container.innerHTML.indexOf("Loading…")!=-1){
            n++;
            setTimeout(function(){test2();}, 100);
        }else{
            n=0;
            test3();
        }
    }
    function test3(){
        n++;
        if (n==100){
            return;
        }
        setTimeout(function(){
            if (container.getElementsByTagName("table").length>0){
                dobiothings();
            }else{
                test3();
            }
        }, 100);
    }
    function cleanuppage(){
        observer3.disconnect();
        if (document.getElementById("notepop")){
            document.getElementById("notepop").remove();
        }
        if (document.getElementById("vcontr")){
            document.getElementById("vcontr").remove();
        }
        if (document.getElementById("ccontr")){
            document.getElementById("ccontr").remove();
        }
        if (document.getElementById("clean")){
            document.getElementById("clean").remove();
        }
        if (document.getElementById("infore")){
            document.getElementById("infore").remove();
        }
        if (document.getElementById("controls")){
            document.getElementById("controls").remove();
        }
        if (document.getElementById("chatcontrols")){
            document.getElementById("chatcontrols").remove();
        }
        if (document.getElementById("rulespop")){
            document.getElementById("rulespop").remove();
        }
    }
    function hidemtenter(){
        if (!localStorage.getItem("hidemt")){return;}
        var toptabs=document.getElementsByClassName("gender-tab");
        for (n=0; n<toptabs.length; n++){
            if (toptabs[n].href){
                toptabs[n].style.display="block";
            }
        }
        roomname=document.location.href.split("/")[3];
        if (roomname=="followed-cams"){return;}
        if ((roomname=="male-cams")||(roomname=="trans-cams")){
            document.location.href=domain;
        }
        for (n=0; n<toptabs.length; n++){
            if (toptabs[n].href){
                if (toptabs[n].href.indexOf("/male-")!=-1){
                    toptabs[n].style.display="none";
                }
                if (toptabs[n].href.indexOf("/male/")!=-1){
                    toptabs[n].style.display="none";
                }
                if (toptabs[n].href.indexOf("/trans-")!=-1){
                    toptabs[n].style.display="none";
                }
                if (toptabs[n].href.indexOf("/trans/")!=-1){
                    toptabs[n].style.display="none";
                }
            }
        }
    }

    function moreoptions(){
        if (roomname=="auth"){return;}
        var newelemsw=document.getElementById('UserMenuDropDown').firstChild.cloneNode(true);
        var newelemsw2=newelemsw.cloneNode(true);
        var newelemsw3=newelemsw.cloneNode(true);
        var newelemsw4=newelemsw.cloneNode(true);
        var newelemsw5=newelemsw.cloneNode(true);
        var newelemsw6=newelemsw.cloneNode(true);
        var newelemtxt=newelemsw.cloneNode(false);
        var newelemtxt2=newelemsw.cloneNode(false);
        var newelemtxt3=newelemsw.cloneNode(false);
        var newelemtxt4=newelemsw.cloneNode(false);
        var newelemtxt5=newelemsw.cloneNode(false);
        var newelemtxt6=newelemsw.cloneNode(false);
        newelemtxt.innerHTML="Script settings:";
        newelemtxt.style.cursor="default";
        newelemtxt2.innerHTML="Save all settings.";
        newelemtxt2.id="saved";
        newelemtxt2.style.cursor="pointer";
        newelemtxt2.addEventListener("click", savesetting );
        newelemtxt3.innerHTML="Clear all saved settings.";
        newelemtxt3.id="clear";
        newelemtxt3.style.cursor="pointer";
        newelemtxt3.addEventListener("click", clearsettings );
        newelemtxt4.innerHTML="Manage ban's.";
        newelemtxt4.style.cursor="pointer";
        newelemtxt4.addEventListener("click", bantoggle );
        newelemtxt5.innerHTML="<select id='banusers' style='width:220px'></select><br><input id='unbanbut' type='button' value='Unban' style='margin:8px 0px 0px 0px'><input id='permbut' type='button' value='Make permanent' style='margin:8px 15px 0px 8px'>";
        newelemtxt5.id="banlist";
        newelemtxt5.style.display="none";
        newelemtxt6.innerHTML="Ban/ignore this room.";
        newelemtxt6.id="ignore";
        newelemtxt6.style.cursor="pointer";
        newelemtxt6.addEventListener("click", banignore );
        newelemsw.firstChild.data = "Thumbnail zoom off.";
        newelemsw.id="h1";
        newelemsw.getElementsByClassName("dmSwitchCircle")[0].id="a1";
        newelemsw.addEventListener("click", zoomoff );
        newelemsw2.firstChild.data = "Preview rooms off.";
        newelemsw2.id="h2";
        newelemsw2.getElementsByClassName("dmSwitchCircle")[0].id="a2";
        newelemsw2.addEventListener("click", anionoff );
        newelemsw3.firstChild.data = "Open rooms in new tab.";
        newelemsw3.getElementsByClassName("dmSwitchCircle")[0].id="a3";
        newelemsw3.addEventListener("click", newtabon );
        newelemsw4.firstChild.data = "Auto refresh followed off.";
        newelemsw4.id="h3";
        newelemsw4.getElementsByClassName("dmSwitchCircle")[0].id="a4";
        newelemsw4.addEventListener("click", refreshoff );
        newelemsw6.firstChild.data = "Big thumbnails.";
        newelemsw6.id="h4";
        newelemsw6.getElementsByClassName("dmSwitchCircle")[0].id="a6";
        newelemsw6.addEventListener("click", bigthumb );
        newelemsw5.firstChild.data = "Hide male/trans.";
        newelemsw5.getElementsByClassName("dmSwitchCircle")[0].id="a5";
        newelemsw5.addEventListener("click", hidemt );
        document.getElementById('UserMenuDropDown').appendChild(newelemtxt);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw2);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw3);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw4);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw6);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw5);
        if (login){
            document.getElementById('UserMenuDropDown').appendChild(newelemtxt2);
            document.getElementById('UserMenuDropDown').appendChild(newelemtxt3);
        }
        document.getElementById('UserMenuDropDown').appendChild(newelemtxt6);
        if(login){
            document.getElementById('UserMenuDropDown').appendChild(newelemtxt4);
            document.getElementById('UserMenuDropDown').appendChild(newelemtxt5);
        }
        hidesw();
    }

    function hidesw(){
        document.getElementById("h1").style.display="block";
        document.getElementById("h2").style.display="block";
        document.getElementById("h3").style.display="block";
        document.getElementById("ignore").style.display="block";
        if (tagspage){document.getElementById("ignore").style.display="none";}
        if (discoverpage){document.getElementById("ignore").style.display="none";}
        if (!login){document.getElementById("ignore").style.display="none";}
        if (discoverpage){document.getElementById("h1").style.display="none";}
        if (supporter){document.getElementById("h2").style.display="none";}
        if (!login){document.getElementById("h3").style.display="none";}
        setsw();
    }

    function setsw(){
        if (localStorage.getItem("bigthumb")){
            document.getElementById("a6").style.left="25px";
        }else{
            document.getElementById("a6").style.left="3px";
        }
        if (localStorage.getItem("hidemt")){
            document.getElementById("a5").style.left="25px";
        }else{
            document.getElementById("a5").style.left="3px";
        }
        if (localStorage.getItem("refreshoff")){
            document.getElementById("a4").style.left="25px";
        }else{
            document.getElementById("a4").style.left="3px";
        }
        if (localStorage.getItem("newtabon")){
            document.getElementById("a3").style.left="25px";
        }else{
            document.getElementById("a3").style.left="3px";
        }
        if (localStorage.getItem("animationoff")){
            document.getElementById("a2").style.left="25px";
        }else{
            document.getElementById("a2").style.left="3px";
        }
        if (localStorage.getItem("zoomoff")){
            document.getElementById("a1").style.left="25px";
        }else{
            document.getElementById("a1").style.left="3px";
        }
         if (roomname!="discover"){
            document.body.classList.add("thumbpage");
            setclass();
        }
    }
    function setclass(){
        document.body.classList.remove("zoom");
        document.body.classList.remove("bigzoom");
        document.body.classList.remove("bigThumb");
        if(localStorage.getItem("bigthumb")){
            document.body.classList.add("bigThumb");
        }
        if(!localStorage.getItem("zoomoff")){
            if(document.getElementById("main").classList.contains("roomPage")){
                document.body.classList.add("zoom");
                return;
            }
            if(localStorage.getItem("bigthumb")){
                document.body.classList.add("bigzoom");
            }else{
                document.body.classList.add("zoom");
            }
        }
    }

    function bigthumb(){
        if (document.getElementById("a6").style.left=="3px"){
            document.getElementById("a6").style.left="25px";
            localStorage.setItem("bigthumb","foo");
        }else{
            document.getElementById("a6").style.left="3px";
            localStorage.removeItem("bigthumb");
        }
        setclass();
    }
    function zoomoff(){
        if (document.getElementById("a1").style.left=="3px"){
            document.getElementById("a1").style.left="25px";
            localStorage.setItem("zoomoff","foo");
        }else{
            document.getElementById("a1").style.left="3px";
            localStorage.removeItem("zoomoff");
        }
        setclass();
    }
    function hidemt(){
        if (document.getElementById("a5").style.left=="3px"){
            document.getElementById("a5").style.left="25px";
            localStorage.setItem("hidemt","foo");
        }else{
            document.getElementById("a5").style.left="3px";
            localStorage.removeItem("hidemt");
        }
    }
    function refreshoff(){
        if (document.getElementById("a4").style.left=="3px"){
            document.getElementById("a4").style.left="25px";
            localStorage.setItem("refreshoff","foo");
        }else{
            document.getElementById("a4").style.left="3px";
            localStorage.removeItem("refreshoff");
        }
    }
    function newtabon(){
        if (document.getElementById("a3").style.left=="3px"){
            document.getElementById("a3").style.left="25px";
            localStorage.setItem("newtabon","foo");
        }else{
            document.getElementById("a3").style.left="3px";
            localStorage.removeItem("newtabon");
        }
    }
    function anionoff(){
        if (document.getElementById("a2").style.left=="3px"){
            document.getElementById("a2").style.left="25px" ;
            localStorage.setItem("animationoff","foo");
        }else{
            document.getElementById("a2").style.left="3px";
            localStorage.removeItem("animationoff");
        }
    }

    function savesetting(){
        document.getElementById("saved").removeEventListener("click", savesetting );
        var theme_name="lightmode";
        if (readCookie("theme_name")){
            theme_name=readCookie("theme_name");
        }
        var bigthumb=0;
        if (localStorage.getItem("bigthumb")){
            bigthumb=1;
        }
        var hidemt=0;
        if (localStorage.getItem("hidemt")){
            hidemt=1;
        }
        var newtabon=0;
        if (localStorage.getItem("newtabon")){
            newtabon=1;
        }
        var refreshoff=0;
        if (localStorage.getItem("refreshoff")){
            refreshoff=1;
        }
        var zoomoff=0;
        if (localStorage.getItem("zoomoff")){
            zoomoff=1;
        }
        var animationoff=0;
        if (localStorage.getItem("animationoff")){
            animationoff=1;
        }
        var cleanprof=0;
        if (localStorage.getItem("pclean")){
            cleanprof=1;
        }
        var isTheaterMode=localStorage.getItem("isTheaterMode");
        var defaultVideoWidth =localStorage.getItem("defaultVideoWidth");
        var videoControls =localStorage.getItem("videoControls");
        var hpfltopen=localStorage.getItem("hpfltopen");
        var allstring="good boy#refreshoff#"+refreshoff+"#bigthumb#"+bigthumb+"#hidemt#"+hidemt+"#newtabon#"+newtabon+"#zoomoff#"+zoomoff+"#animationoff#"+animationoff+"#cleanprof#"+cleanprof+"#isTheaterMode#"+isTheaterMode+"#defaultVideoWidth#"+defaultVideoWidth+"#videoControls#"+videoControls+"#theme_name#"+theme_name+"#hpfltopen#"+hpfltopen;
        var url=domain+"api/notes/for_user/"+stor+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "text", allstring );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            body: data
        }).then(function(){document.getElementById("saved").innerHTML="Settings saved";setTimeout(function(){document.getElementById("saved").innerHTML="Save all settings.";document.getElementById("saved").addEventListener("click", savesetting );},2000);});
    }

    function clearsettings(){
        document.getElementById("clear").removeEventListener("click", clearsettings );
        var url=domain+"api/notes/for_user/"+stor+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "text", "" );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            body: data
        }).then(function(){document.getElementById("clear").innerHTML="Saved settings removed.";setTimeout(function(){document.getElementById("clear").innerHTML="Clear all saved settings.";document.getElementById("clear").addEventListener("click", clearsettings );},2000);});
    }

    function getsaving(){
        if (!login){
            localStorage.removeItem("login");
            return;
        }else{
            if (localStorage.getItem("login")){
                return;
            }
        }
        localStorage.setItem("login","foo");
        var url=domain+"api/notes/for_user/"+stor+"/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function(data) {
                    if (data.text == null){return;}
                    restoresettings(data.text);
                });
            });
    }

    function restoresettings(data){
        if (data.indexOf("good boy")!=0){return;}
        if (data.indexOf("refreshoff#")!=-1){
            var refreshoff=data.split("refreshoff#")[1].split("#")[0];
            localStorage.setItem("refreshoff","foo");
            if (refreshoff==0){localStorage.removeItem("refreshoff");}
        }
        if (data.indexOf("newtabon#")!=-1){
            var newtabon=data.split("newtabon#")[1].split("#")[0];
            localStorage.setItem("newtabon","foo");
            if (newtabon==0){localStorage.removeItem("newtabon");}
        }
        if (data.indexOf("hidemt#")!=-1){
            var hidemt=data.split("hidemt#")[1].split("#")[0];
            localStorage.setItem("hidemt","foo");
            if (hidemt==0){localStorage.removeItem("hidemt");}
        }
        if (data.indexOf("bigthumb#")!=-1){
            var bigthumb=data.split("bigthumb#")[1].split("#")[0];
            localStorage.setItem("bigthumb","foo");
            if (bigthumb==0){localStorage.removeItem("bigthumb");}
        }
        if (data.indexOf("zoomoff#")!=-1){
            var zoomoff=data.split("zoomoff#")[1].split("#")[0];
            localStorage.setItem("zoomoff","foo");
            if (zoomoff==0){localStorage.removeItem("zoomoff");}
        }
        if (data.indexOf("animationoff#")!=-1){
            var animationoff=data.split("animationoff#")[1].split("#")[0];
            localStorage.setItem("animationoff","foo");
            if (animationoff==0){localStorage.removeItem("animationoff");}
        }
        if (data.indexOf("cleanprof#")!=-1){
            var cleanprof=data.split("cleanprof#")[1].split("#")[0];
            localStorage.setItem("pclean","foo");
            if (cleanprof==0){localStorage.removeItem("pclean");}
        }
        if (data.indexOf("isTheaterMode#")!=-1){
            var isTheaterMode=data.split("isTheaterMode#")[1].split("#")[0];
            localStorage.setItem("isTheaterMode",isTheaterMode);
        }
        if (data.indexOf("defaultVideoWidth#")!=-1){
            var defaultVideoWidth=data.split("defaultVideoWidth#")[1].split("#")[0];
            localStorage.setItem("defaultVideoWidth",defaultVideoWidth);
        }
        if (data.indexOf("videoControls#")!=-1){
            var videoControls=data.split("videoControls#")[1].split("#")[0];
            if (!jsontest(videoControls)){videoControls='{"volume":60,"isMuted":false}';}
            localStorage.setItem("videoControls",videoControls);
        }
        var exp=new Date().getTime()+86400000;
        if (data.indexOf("hpfltopen#")!=-1){
            var hpfltopen=data.split("hpfltopen#")[1].split("#")[0];
            hpfltopen=hpfltopen.split('expiration":')[0]+'expiration":'+exp+'}';
            localStorage.setItem("hpfltopen",hpfltopen);
        }
        if (data.indexOf("theme_name#")!=-1){
            var theme_name=data.split("theme_name#")[1].split("#")[0];
            createCookie("theme_name",theme_name);
        }
        document.location.reload();
    }
    function jsontest(jsonstr){
        try {
            JSON.parse(jsonstr);
            return true;
        } catch(e) {
            return false;
        }
    }

    function dobiothings(){
        hidemtenter();
        if(ppage){
            if (currpage.split("model=").length==1){return;}
            roomname=currpage.split("model=")[1].split("&")[0];
            if (roomname==yourname){return;}
            rebuildbio();
        }else{
            afterrebuild();
        }
    }

    function afterrebuild(){
        bio=true;
        if((ppage)||(!login)){
            document.querySelector('[data-testid="bio-header"]').innerHTML="<a href='"+domain+roomname+"?tab=bio' id=biotop>"+roomname.charAt(0).toUpperCase()+roomname.slice(1)+"'s Bio (Go to the cam page)</a>";
        }else{
            document.querySelector('[data-testid="bio-header"]').innerHTML="<a href='"+domain+"p/"+yourname+"?tab=bio&model="+roomname+"' id=biotop>"+roomname.charAt(0).toUpperCase()+roomname.slice(1)+"'s Bio and Free Webcam (Go to the bio)</a>";
        }
        document.getElementById("biotop").addEventListener("click", function(event){window.location.replace(this.href);event.stopPropagation();event.preventDefault();return false;});
        makevidcontrol();
        cleaninit();
        linkfix();
        info(true);
        buildnotepop();
        getnoteslist();
        if (document.getElementsByTagName("video").length>0){
            getvid();
            vreset();
            iagree();
        }
    }

    function dothumbpagethings(){
        buildnotepop();
        getnoteslist();
        unfollowoption();
        return;
    }

    function unfollowoption(){
        var newelem=document.createElement('li');
        newelem.style.display="none";
        newelem.id="unfollowit";
        newelem.innerHTML="<a href=#>UNFOLLOW THIS PAGE (AND ERASE NOTES)</a>";
        document.getElementById("nav").appendChild(newelem);
        document.getElementById("unfollowit").addEventListener("click",unfollowthispage);
    }

    function iagree(){
        triggerMouseEvent (document.getElementsByClassName("inputDiv")[0], "mousedown");
        if (document.getElementsByClassName("acceptRulesButton").length>0){
            document.getElementsByClassName("acceptRulesButton")[0].click();
        }
        if (document.querySelector('[data-testid="dismissible-message-dismiss"]')){
            document.querySelector('[data-testid="dismissible-message-dismiss"]').click();
        }
    }

    function triggerMouseEvent (node, eventType) {
        var clickEvent = new Event(eventType, { bubbles: true, cancelable: true });
        node.dispatchEvent (clickEvent);
    }

    function setgenstyle(){
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = ".userUpload img{display:none}"+
            ".lockOverlayBg {background-color:rgba(0, 0, 0, 0) !important;top:50% !important}"+
            ".lockOverlayBg img{display:none}"+
            ".userUpload div{background-color:rgba(0, 0, 0, 0) !important}"+
            ".previewBorder {display:block !important}"+
            ".previewText {color:black !important}"+
            ".photoVideoDetailSection img{filter: blur(0px) !important;height:auto !important;width:auto !important; margin-left: auto;margin-right: auto;display:block;min-width:50%;min-height:50%;max-width:100%;max-height:100%}"+
            ".BioContents{position:relative !important}"+
            ".bioContentText div{background-color:rgba(0, 0, 0, 0) !important}"+
            ".theme-external select{background-color: #dde9f5 !important; color:#5e81a4 !important; border-color:#8bb3da !important}"+
            ".profplayer{z-index:99;position:absolute;top:10px;right:10px;border:1px solid rgb(221, 221, 221);border-radius:4px;box-shadow:0px 0px 32px rgba(0, 0, 0, 0.32)}"+
            ".darkmode .profplayer{z-index:99;position:absolute;top:10px;right:10px;border:1px solid rgb(29, 29, 29);border-radius:4px;box-shadow:0px 0px 32px rgba(255, 255, 255, 0.22)}"+
            ".profdivplayer{z-index:99;position:absolute;top:10px;right:10px;overflow:hidden;resize:horizontal;direction:rtl;border:1px solid rgb(221, 221, 221);border-radius:4px;box-shadow:0px 0px 32px rgba(0, 0, 0, 0.32);background-color:rgba(0, 0, 0, 0.32)}"+
            ".darkmode .profdivplayer{z-index:99;position:absolute;top:10px;right:10px;overflow:hidden;resize:horizontal;direction:rtl;border:1px solid rgb(29, 29, 29);border-radius:4px;box-shadow:0px 0px 32px rgba(255, 255, 255, 0.22);background-color:rgba(255, 255, 255, 0.22)}"+
            ".darkmode select{background-color: #202c39 !important; color:#b3b3b3 !important; border-color:#2d3e50 !important}"+
            ".tinput {background-color: #dde9f5 !important; color:#5e81a4 !important; border-color:#8bb3da !important}"+
            ".darkmode .tinput {background-color: #202c39 !important; color:#b3b3b3 !important; border-color:#2d3e50 !important}"+
            "#proftext {width: 200px; height: 45px; line-height: 14px; border-width: 1px; border-style: solid; border-color: #acacac; border-radius: 4px; padding: 7px 8px; overflow: auto;background-color: rgb(230, 230, 230);color:#000;min-width:200px;min-height:45px}"+
            ".darkmode #proftext{width: 200px; height: 45px; line-height: 14px; border-width: 1px; border-style: solid; border-color: #2d3e50; border-radius: 4px; padding: 7px 8px; overflow: auto;background-color: rgb(20,20,20);color:#fff;min-width:200px;min-height:45px}"+
            ".cbLogo {display:none !important}"+
            ".overlay {display:none !important;}"+
            ".cleanprof .profpos {display:none !important}"+
            ".cleanprof .profmar {margin-top:0px !important;}"+
            ".cleanprof .profcur {cursor:default !important }"+
            ".translated {background-color:#FFFFE0;color:red;margin-left:10px;padding:0px 5px 0px 5px;text-shadow:0px 0px !important}"+
            ".darkmode .translated {background-color:#000020;color:red;margin-left:10px;padding:0px 5px 0px 5px;text-shadow:0px 0px !important}"+
            ".popclass {background-color:rgb(255, 255, 211)}"+
            ".darkmode .popclass {background-color:rgb(30, 30, 10)}"+
            ".ad {padding: 0px;overflow:hidden; font-weight: bold;color:white;border-radius:5px}"+
            ".adinfo {position: relative; display: flex; height: 100%; width: 940px; right:0px}"+
            ".adinfo {transition: 1.0s ease-in-out}"+
            ".adinfo:hover {right: 472px }"+
            ".adscriptinfo {display:block;height:100%;width:468px}"+
            ".smallemo img.emoticonImage {max-height:22px !important;}"+
            ".bigThumb ul.list{grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)) !important}"+
            ".roomCard {transition: .5s}"+
            ".roomCard:hover {border-color:red;z-index:20}"+
            ".thumbpage .content{overflow: visible; !important ;margin-right:33px !important;margin-left:33px !important}"+
            ".followedDropdown{z-index:50 !important}"+
            ".list{overflow: visible !important}"+
            ".MoreRooms{overflow: visible !important}"+
            ".zoom .roomCard:hover {transform: scale(1.37)}"+
            ".bigzoom .roomCard:hover {transform: scale(1.23)}"+
            ".followRecommendedHeader{visibility:hidden !important}"+
            ".followRecommendedHeader{height:0px !important}"+
            ".followRoomTable:nth-of-type(2n+1){display:none !important}"+
            ".followRecommendations{display:none !important}";
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function getnoteslist(){
        if(!login){usernoteslist="";whatpage();return;}
        var url=domain+"api/notes/usernames/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(data) {
                    usernoteslist=data;
                }).then(whatpage);
            });
    }

    function whatpage(){
        setupfollowmove();
        if (thumbpage){setupmove();}
        if (bio){setupbiomove();}
        if (discoverpage){
            setInterval(addevent2,5000);
        }
    }

    function setupfollowmove(){
        var observenode=document.getElementsByClassName("followedDropdown")[0];
        observer6.observe(observenode,observerConfig6);
    }

    function adjustfollowhumbs(){
        if (document.getElementsByClassName("followedDropdown")[0].style.display!="block"){return;}
        addevent2();
    }

    function setupmove(){
        var observenode=document.getElementsByClassName("list")[0];
        observer4.observe(observenode,observerConfig4);
        adjusthumbs();
        addevent2();
    }

    function adjusthumbs(){
        subsel();
        if (document.getElementsByClassName("list")[0].classList.contains("loading")){return;}
        notepopclose();
        if (document.getElementsByClassName("list").length>1){
            var observenode=document.getElementsByClassName("list")[1];
            observer41.observe(observenode,observerConfig4);
            setTimeout(addevent2, 1000);
        }else{
            addevent2();
        }
    }

    function setupbiomove(){
        if (ppage){return;}
        var observenode=document.querySelector('[data-testid="more-rooms-like-this-tab-contents"]').firstChild;
        observer5.observe(observenode,observerConfig5);
        addevent2();
    }

    function adjustbiohumbs(){
        if (ppage){return;}
        if(document.querySelector('[data-testid="more-rooms-like-this-tab-contents"]').firstChild.style.display=="block"){return;}
        addevent2();
    }

    function addevent2(){
        if (document.getElementById("unfollowit")){
            document.getElementById("unfollowit").style.display="none";
            if (document.location.href.split("/")[4]=="offline"){
                document.getElementById("unfollowit").style.display="block";
            }
        }
        hidemtenter();
        var hidrooms=0;
        if (currpage!=document.location.href){
            notepopclose();
        }
        currpage=document.location.href;
        var genclass="";
        var tags=document.querySelectorAll('[data-testid="room-card-image"]');
        if (localStorage.getItem("ignoredusers")){
            banusers=localStorage.getItem("ignoredusers").split(",");
        }
        for (n=0; n<tags.length; n++){
            var name=tags[n].parentNode.parentNode.querySelector('[data-testid="room-card-username"]');
            var thumbroomname=name.innerHTML;
            if (banusers.indexOf(thumbroomname)!=-1){
                tags[n].parentNode.parentNode.style.display="none";
            }
            if ((localStorage.getItem("hidemt"))&&(roomname!="followed-cams")){
                if(tags[n].parentNode.parentNode.querySelector('[data-testid="room-card-gender"]')){
                    genclass=tags[n].parentNode.parentNode.querySelector('[data-testid="room-card-gender"]').classList;
                    if ((genclass.contains("genderm"))||(genclass.contains("genders"))){
                        tags[n].parentNode.parentNode.style.display="none";
                        hidrooms++;
                    }
                }
            }
            if(!tags[n].name){
                tags[n].name="Camslut";
                tags[n].parentNode.href=tags[n].parentNode.href+"?tab=bio";
                tags[n].parentNode.addEventListener("click", function(event){event.stopPropagation();event.preventDefault();return false;});
                tags[n].addEventListener("click", function(event){var target="_self";if (localStorage.getItem("newtabon")){target="_blank";}window.open(this.parentNode.href, target);event.stopPropagation();event.preventDefault();return false;});
                if (!supporter){
                    tags[n].parentNode.parentNode.addEventListener("mouseenter", moveimg);
                    tags[n].parentNode.parentNode.addEventListener("mouseleave", moveimgstop);
                }
                if (loggedin){
                    name.href=domain+"p/"+yourname+"/?tab=bio&model="+thumbroomname;
                }
                name.addEventListener("click", function(event){var target="_self";if (localStorage.getItem("newtabon")){target="_blank";}window.open(this.href, target);event.stopPropagation();event.preventDefault();return false;});
                if (usernoteslist!=""){
                    if (tags[n].parentNode.parentNode.className=="roomCard camBgColor"){
                        var newelem=document.createElement('div');
                        if (usernoteslist.usernames.indexOf(thumbroomname)!=-1){
                            newelem.innerHTML=note;
                        }else{
                            newelem.innerHTML=nonote;
                        }
                        newelem.style.position="absolute";
                        newelem.style.top="0px";
                        newelem.style.left="0px";
                        newelem.addEventListener("click", shownote );
                        newelem.style.cursor="pointer";
                        newelem.setAttribute("name", thumbroomname);
                        newelem.name=thumbroomname;
                        newelem.title="User notes";
                        tags[n].parentNode.parentNode.appendChild(newelem);
                    }
                }
            }
        }
        var mymsgline=0;
        if (document.location.href.split("/")[3]=="spy-on-cams"){
            mymsgline=1;
        }
        var msglines=document.querySelectorAll('[data-testid="num-of-rooms-msg"]');
        var msglinesleng=msglines.length;
        if (msglinesleng !=0){
            msglines[0].style.display="block";
            if (mymsgline == 1){
                msglines[1].style.display="block";
            }
            if (localStorage.getItem("hidemt")){
                var msg=msglines[mymsgline].innerHTML.split("filters")[0]+"filters";
                msglines[mymsgline].innerHTML=msg+". "+hidrooms+" on this page are hidden.";
            }
        }
        hidrooms=0;
        showhidden();
    }

    function showhidden(){
        if (document.location.href.split("/")[3]=="spy-on-cams"){showhidden4();return;}
        if (document.location.href.split("/")[3]!="followed-cams"){return;}
        if (document.location.href.split("/")[4]=="offline"){return;}
        if (!document.querySelector('[data-testid="room-card-image"]')){return;}
        if (document.querySelector('[data-testid="room-card-image"]').name=="hid"){return;}
        document.querySelector('[data-testid="room-card-image"]').name="hid";
        hidoffset=0;
        hiddenarray=[];
        showhidden2();
    }

    function showhidden2(){
        if (hprom){return;}
        hprom=true;
        var url=hidurl+hidoffset*90;
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    hprom=false;
                    return;
                }
                response.json().then(function(data){
                    if (data.rooms != null){
                        var hiddenlist=data.rooms;
                        for (n=0; n<hiddenlist.length; n++){
                            hiddenarray.push(hiddenlist[n].username);
                        }
                        var pages=Math.ceil(data.total_count/90);
                        hidoffset++;
                        if (hidoffset!=pages){
                            hprom=false;
                            showhidden2();
                        }else{
                            hprom=false;
                            showhidden3();
                        }
                    }
                });
            });
    }

    function showhidden3(){
        var tags=document.querySelector('[data-testid="room-list-container"]').querySelectorAll('[data-testid="room-card"]');
        for (n=0; n<tags.length; n++){
            var name=tags[n].querySelector('[data-testid="room-card-username"]').innerHTML;
            if (tags[n].querySelector('[data-testid="thumbnail-label"]').innerHTML.indexOf("HIDDEN")!=-1){
                tags[n].querySelector('[data-testid="thumbnail-label"]').innerHTML="";
            }
            if (hiddenarray.indexOf(name)!=-1){
                tags[n].querySelector('[data-testid="thumbnail-label"]').innerHTML=tags[n].querySelector('[data-testid="thumbnail-label"]').innerHTML+" HIDDEN ";
                tags[n].querySelector('[data-testid="thumbnail-label"]').style.backgroundColor = "blue";
           }
        }
    }

    function showhidden4(){
        if (document.querySelectorAll('[data-testid="room-list-container"]')[1].querySelector('[data-testid="room-card-image"]').name=="hid"){return;}
        document.querySelectorAll('[data-testid="room-list-container"]')[1].querySelector('[data-testid="room-card-image"]').name="hid";
        var tags=document.querySelectorAll('[data-testid="room-list-container"]')[1].querySelectorAll('[data-testid="room-card"]');
        for (n=0; n<tags.length; n++){
            tags[n].querySelector('[data-testid="thumbnail-label"]').innerHTML=tags[n].querySelector('[data-testid="thumbnail-label"]').innerHTML+" HIDDEN ";
            tags[n].querySelector('[data-testid="thumbnail-label"]').style.backgroundColor = "blue";
        }
    }

    function shownote(e){
        if(document.getElementById("notepop").style.display=="block"){
            notepopclose();
            if (openthumbname==this.name){
                return;
            }
        }
        document.getElementById("notepop").style.height="170px";
        document.getElementById("notearea").value="";
        document.getElementById("notenote").innerHTML=notegrey + " Note";
        document.getElementById("notepopLink").style.color="grey";
        opennote="";
        openthumbname=this.name;
        var xpos=e.pageX;
        document.getElementById("notearea").innerHTML="";
        document.getElementById("notepop").style.top=e.pageY+100+"px";
        document.getElementById("notepop").style.left=xpos+20+"px";
        document.getElementById("notepop").style.display="block";
        document.getElementById("notepopName").style.color="grey";
        document.getElementById("notepopName").innerHTML=openthumbname;

        setTimeout(function(){document.getElementById("main").addEventListener("click",notepopclose);},100);

        var url=domain+"api/notes/for_user/"+openthumbname+"/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    document.getElementById("notearea").value="!! This room is banned !!";
                    return;
                }
                response.json().then(function(data){
                    if (data.text != null){
                        document.getElementById("notearea").value=data.text;
                        opennote=data.text;
                        if (usernoteslist.usernames.indexOf(openthumbname)==-1){
                            usernoteslist.usernames.push(openthumbname);
                            updatedm2();
                        }
                    }
                    getusercolor();
                });
            });
    }

    function getusercolor(){
        var url=domain+"api/messaging/profile/"+openthumbname+"/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function(data){
                    if (data.can_pm){document.getElementById("notepopLink").style.color="green";}
                    var Bcolor="#939393";
                    if (data.sitewide_user.has_tokens){Bcolor="#69a";}
                    if (data.sitewide_user.tipped_recently){Bcolor="#1e5cfb";}
                    if (data.sitewide_user.tipped_alot_recently){Bcolor="#be6aff";}
                    if (data.sitewide_user.tipped_tons_recently){Bcolor="#804baa";}
                    document.getElementById("notepopName").style.color=Bcolor;
                });
            });
    }

    function buildnotepop(){
        var newelem=document.createElement('span');
        newelem.id="notepop";
        newelem.style.display="none";
        newelem.style.position="absolute";
        newelem.style.overflow="hidden";
        newelem.style.backgroundColor="rgb(255, 255, 255)";
        newelem.style.border="1px solid rgb(221, 221, 221)";
        newelem.style.borderRadius="4px";
        newelem.style.width="188px";
        newelem.style.height="170px";
        newelem.style.zIndex="999";
        newelem.style.boxShadow="0px 0px 32px rgba(0, 0, 0, 0.32)";
        document.getElementById("footer-holder").appendChild(newelem);

        newelem=document.createElement('div');
        newelem.style.backgroundColor = "#dddddd";
        newelem.style.fontWeight="bold";
        newelem.style.height="15px";
        newelem.style.fontSize="15px";
        newelem.style.padding="8px";
        newelem.style.textAlign="left";
        newelem.innerHTML='<span id="notepopName" style="text-Overflow: ellipsis; overflow:hidden; width:150px; height:20px; display:inline-block;cursor:pointer " ></span><span><img src="https://web.static.mmcdn.com/tsdefaultassets/close-gray.svg" style="position: absolute; height: 13px; width: 13px; right: 8px;" title="Close" id="noteclose"></span>';
        document.getElementById("notepop").appendChild(newelem);
        document.getElementById("notepopName").addEventListener("click", function(){var target="_self";if (localStorage.getItem("newtabon")){target="_blank";}window.open(domain+"p/"+yourname+"/?tab=bio&model="+openthumbname, target);});

        document.getElementById("noteclose").addEventListener("click",notepopclose);

        newelem=document.createElement('div');
        newelem.style.backgroundColor = "white";
        newelem.style.border="1px solid rgb(221, 221, 221)";
        newelem.style.height="15px";
        newelem.style.fontSize="12px";
        newelem.style.padding="8px";
        newelem.style.textAlign="left";
        newelem.style.cursor="pointer";
        newelem.addEventListener("click", function(){opendm2(openthumbname);});
        newelem.id="notepopLink";
        newelem.innerHTML='<img src="https://web.static.mmcdn.com/tsdefaultassets/popout-grey-d.svg" height="12px" width="12px"><b> Open DM in new window</b>';
        document.getElementById("notepop").appendChild(newelem);

        newelem=document.createElement('div');
        newelem.style.backgroundColor = "white";
        newelem.style.color="grey";
        newelem.style.height="10px";
        newelem.style.fontSize="12px";
        newelem.style.padding="8px";
        newelem.style.textAlign="left";
        newelem.id="notenote";
        newelem.innerHTML=notegrey + " Note";
        document.getElementById("notepop").appendChild(newelem);

        newelem=document.createElement('textarea');
        newelem.id="notearea";
        newelem.style.height="60px";
        newelem.style.fontSize="12px";
        newelem.style.border="1px solid rgb(172, 172, 172)";
        newelem.style.borderRadius="4px";
        newelem.style.backgroundColor="rgb(255, 255, 255)";
        newelem.style.resize="none";
        newelem.style.padding="5px";
        newelem.style.width="85%";
        newelem.setAttribute("placeholder", "Enter notes about this user (only seen by you)");
        newelem.setAttribute("spellcheck", false);
        newelem.addEventListener("input",openbutton);
        newelem.id="notearea";
        document.getElementById("notepop").appendChild(newelem);

        newelem=document.createElement('div');
        newelem.id="notecancelsubmit";
        document.getElementById("notepop").appendChild(newelem);

        newelem=document.createElement("span");
        newelem.style.position="relative";
        newelem.style.top="12px";
        newelem.style.left="-15px";
        newelem.addEventListener("click",closebutton);
        newelem.innerHTML='<a href="#" >Cancel</a>';
        document.getElementById("notecancelsubmit").appendChild(newelem);

        var subbutstyle="color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; padding: 4px 10px 5px; position: relative; right: 40px; top:10px; float: right; border-radius: 4px; cursor: pointer;";

        newelem=document.createElement("span");
        newelem.setAttribute("style", subbutstyle);
        newelem.addEventListener("click",savenote);
        newelem.innerHTML="Save";
        document.getElementById("notecancelsubmit").appendChild(newelem);
    }

    function savenote(){
        var notetext=document.getElementById("notearea").value;
        var url=domain+"api/notes/for_user/"+openthumbname+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "text", notetext );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            body: data
        }).then(aftersave);
    }

    function aftersave(){
        var notetext=document.getElementById("notearea").value;
        var doupdate=false;
        if ((opennote=="")||(notetext=="")){
            doupdate=true;
        }
        opennote=notetext;
        closebutton();
        if (doupdate){updatedm();}
    }
    function notepopclose(){
        document.getElementById("main").removeEventListener("click",notepopclose);
        document.getElementById("notepop").style.display="none";
    }
    function openbutton(){
        document.getElementById("notepop").style.height="215px";
        document.getElementById("notenote").innerHTML=notegrey + " Note (unsaved)";
        document.getElementById("notearea").value=document.getElementById("notearea").value.replace("$"," "+new Date().toLocaleDateString()+" ");
        if(opennote==document.getElementById("notearea").value){
            closebutton();
        }
    }
    function closebutton(){
        document.getElementById("notenote").innerHTML=notegrey + " Note";
        document.getElementById("notepop").style.height="170px";
        document.getElementById("notearea").value=opennote;
    }

    function opendm2(that){
        var url=domain+"dm/"+that;
        var dmwindow=window.open(url,that,'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=1000,height=800');
        dmwindow.onload = function(){
            this.addEventListener('unload', function(){setTimeout(function(){updatedm();},1000);});
        };
    }

    function updatedm(){
        var url=domain+"api/notes/usernames/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(data) {
                    usernoteslist=data;
                }).then(updatedm2);
            });
    }

    function updatedm2(){
        var tags=document.querySelectorAll('[title="User notes"]');
        for (n=0; n<tags.length; n++){
             if (usernoteslist.usernames.indexOf(tags[n].getAttribute("name"))!=-1){
                 tags[n].innerHTML=note;
             }else{
                 tags[n].innerHTML=nonote;
             }
         }
    }

    function moveimg(){
        if(localStorage.getItem("animationoff")){return;}
        thisfap=this;
        if (thisfap.getElementsByClassName("thumbnail_label_offline").length!=0){return;}
        fapbr=thisfap.getElementsByTagName("img")[0].src.split("/")[4].split("?")[0];
        cimg.addEventListener("load",regetimg);
        lt2=new Date().getTime();
        cimg.src = "https://jpeg.live.mmcdn.com/minifwap/"+fapbr+"?f="+lt2;
    }

    function moveimgstop(){
        cimg.removeEventListener("load",regetimg);
    }

    function regetimg(){
        var lt=new Date().getTime()-lt2;
        if (lt>180){lt=180;}
        thisfap.getElementsByTagName("img")[0].src=cimg.src;
        setTimeout(function(){lt2=new Date().getTime();cimg.src = "https://jpeg.live.mmcdn.com/minifwap/"+fapbr+"?f="+lt2;}, 200-lt);
    }

    function refresher(){
        document.addEventListener("visibilitychange", function(){
            if (document.hidden){return;}
            if (roomname=="followed-cams"){
                if (!localStorage.getItem("refreshoff")){
                    location.reload();
                }
            }
            setsw();
        });
    }

    function noadd(){
        if (document.getElementsByClassName('ad').length>0){
            document.getElementsByClassName('ad')[0].innerHTML="";

            var newelem=document.createElement('div');
            newelem.className="adinfo";

            var newdiv=document.createElement('div');
            newdiv.id="scriptinfo";
            newdiv.className="adscriptinfo";
            newdiv.style.backgroundColor="darkred";
            newelem.appendChild(newdiv);

            newdiv=document.createElement('div');
            newdiv.style.width="4px";
            newdiv.style.backgroundColor="white";
            newelem.appendChild(newdiv);

            newdiv=document.createElement('div');
            newdiv.id="userinfo";
            newdiv.className="adscriptinfo";
            newdiv.style.backgroundColor="darkblue";
            newelem.appendChild(newdiv);
            document.getElementsByClassName('ad')[0].appendChild(newelem);
            var info=scriptname+" version "+version+" is active.";
            newdiv=document.createElement('div');
            newdiv.style.margin="5px";
            if (!readCookie("goodboy")){
                if (!login){
                    info=info+"<br>Support this script, <a href='"+tour+"'>create a new account.</a>";
                    if(document.querySelector('[data-testid="sign-up-tab"]')){
                        document.querySelector('[data-testid="sign-up-tab"]').href=tour;
                    }
                }else{
                    info=info+"<br>Support this script, log out and create a new account.";
                }
                newdiv.innerHTML=info;
            }else{
                newdiv.innerHTML=info+"<br>Thank you for your support.";
            }
            document.getElementById("scriptinfo").appendChild(newdiv);

            newdiv=document.createElement('div');
            newdiv.style.margin="5px";
            if (!localStorage.getItem("topinfo")){
                newdiv.innerHTML="Info not yet available.";
                }else{
                    var topinfo=localStorage.getItem("topinfo").split("{")[1].split("}")[0];
                    topinfo=topinfo.replace(/\[/g,"<");
                    topinfo=topinfo.replace(/\]/g,">");
                    newdiv.innerHTML=topinfo;
                }
            document.getElementById("userinfo").appendChild(newdiv);
        }
    }

    function getmessage(){
        if (!localStorage.getItem("topinfo")){
            getmessage2();
            return;
        }
        var exp=parseInt(localStorage.getItem("topinfo").split("{")[0].split("expires:")[1]);
        if (exp<new Date().getTime()){
            getmessage2();
        }
    }

    function getmessage2(){
        var url=domain+"api/chatvideocontext/"+stor+"/";
        var topinfo="";
        fetch(url,{ credentials: "omit"}).then(
            function(response) {
                if (response.status !== 200){
                    topinfo = "{An error occured retrieving the info}";
                    var exp=new Date().getTime()+3600000;
                    localStorage.setItem("topinfo","expires:"+exp+topinfo);
                    return;
                }
                response.json().then(function(roomdata) {
                topinfo="{No info available}";
                    if (roomdata.chat_rules!=""){
                        topinfo=roomdata.chat_rules;
                    }
                    var exp=new Date().getTime()+14400000;
                    localStorage.setItem("topinfo","expires:"+exp+topinfo);
                });
            });
    }

    function aff(){
        if (currpage==domain+"accounts/welcome/"){createCookie("goodboy","1",14);return;}
        if (currpage.split("?").length>1){
            if (currpage.split("?")[1].indexOf("campaign=hgg5k")!=-1){
                createCookie("agreeterms","1",30);
                if (!login){
                    document.location.href=domain+"accounts/register/?src=header&auipsrc=navbar";
                }
                return;
            }
            if (currpage.split("?")[1].indexOf("campaign=")!=-1){
                if(!login){
                    untrace();
                    document.location.href=tour;
                }
                return;
            }
        }
        if (currpage.split("?")[0]==domain+"auth/login/"){
            localStorage.clear();
            sessionStorage.clear();
        }
        if (currpage.split("?")[0]==domain+"accounts/register/"){
            localStorage.clear();
            sessionStorage.clear();
        }
    }
    function untrace(){
        var cookies = document.cookie.split("; ");
        for (var c = 0; c < cookies.length; c++) {
            var d = window.location.hostname.split(".");
            while (d.length > 0) {
                var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                var p = location.pathname.split('/');
                document.cookie = cookieBase + '/';
                while (p.length > 0) {
                    document.cookie = cookieBase + p.join('/');
                    p.pop();
                }
                d.shift();
            }
        }
        localStorage.clear();
        sessionStorage.clear();
    }

     function subsel(){
        if (discoverpage){return;}
        if (document.getElementById("subselection")){document.getElementById("subselection").remove();}
        if((document.location.href.indexOf("spy-on-cams")==-1)&&(document.location.href.indexOf("followed-cams")==-1)&&(document.location.href.indexOf("/current_app_use/")==-1)){
            var newelem=document.createElement('li');
            newelem.id="subselection";
            var data='<form><select id="subsel" style="margin: 0px 0px 0px 0px; border-radius: 4px 4px 0px 0px;padding: 5px 1px 4px 12px; font-weight: 400; font-size: 13px; font-family: \'UbuntuMedium\',Arial,Helvetica,sans-serif;" >'+
                '<option value="/XX-cams">ALL CAMS IN CATEGORY</option>'+
                '<option value="/exhibitionist-cams/XX">EXHIBITIONIST CAMS</option>'+
                '<option value="/gaming-cams/XX">GAMING CAMS</option>'+
                '<option value="/new-cams/XX">NEW CAMS</option>'+
                '<option value="/teen-cams/XX">TEEN CAMS (18+)</option>'+
                '<option value="/18to21-cams/XX">18 TO 21 CAMS</option>'+
                '<option value="/21to35-cams/XX">21 TO 35 CAMS</option>'+
                '<option value="/30to50-cams/XX">30 TO 50 CAMS</option>'+
                '<option value="/mature-cams/XX">MATURE CAMS (50+)</option>'+
                '<option value="/north-american-cams/XX">NORTH AMERICAN CAMS</option>'+
                '<option value="/euro-russian-cams/XX">EURO RUSSIAN CAMS</option>'+
                '<option value="/south-american-cams/XX">SOUTH AMERICAN CAMS</option>'+
                '<option value="/asian-cams/XX">ASIAN CAMS</option>'+
                '<option value="/other-region-cams/XX">OTHER REGION CAMS</option>'+
                '<option value="/6-tokens-per-minute-private-cams/XX">6 TOKENS PER MINUTE</option>'+
                '<option value="/12-18-tokens-per-minute-private-cams/XX">12 - 18 TOKENS PER MINUTE</option>'+
                '<option value="/30-42-tokens-per-minute-private-cams/XX">30 - 42 TOKENS PER MINUTE</option>'+
                '<option value="/60-72-tokens-per-minute-private-cams/XX">60 - 72 TOKENS PER MINUTE</option>'+
                '<option value="/90-tokens-per-minute-private-cams/XX">90+ TOKENS PER MINUTE</option>'+
                '</select></form>';
            var	uloc=document.location.href+"//";
            var loc=uloc.split("/");
            var	check=loc[3]+loc[4];
            var gen="";
            if(check.indexOf("male") != -1){gen="male";}
            if(check.indexOf("female") != -1){gen="female";}
            if(check.indexOf("couple") != -1){gen="couple";}
            if(check.indexOf("trans") != -1){gen="trans";}
            data=data.replace(/XX/gi,gen);
            if (gen === ""){data=data.replace("-cams","");}
            data=data.replace('<option value="/'+loc[3],'<option selected value="/'+loc[3]);
            newelem.innerHTML=data;
            document.getElementsByClassName('sub-nav')[0].appendChild(newelem);
            document.getElementById("subsel").addEventListener('change',subselected);
        }
    }

    function subselected(){
        document.location.href=document.getElementById("subsel").options[document.getElementById("subsel").selectedIndex].value;
    }

    function tabpm(){
        if (document.visibilityState=="visible"){return;}
        if (tabblink==true){return;}
        tabblink=true;
        tabblinker();
    }

    function tabblinker(){
        if (document.title == "PM !! PM"){
            document.title = "!! PM !!";
        }else{
            document.title = "PM !! PM";
        }
        if (document.visibilityState!="visible"){
            setTimeout(tabblinker,500);
        }else{
            document.title=ctitle;
            tabblink=false;
        }
    }

    function makevidcontrol(){
        var butstyle="margin-right: 5px;color: rgb(255, 255, 255); background-color:#F47321; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; padding: 4px 10px 3px; position: relative;right: 1px;top:-4px; float: right; border-radius: 4px; cursor: pointer; display: inline;";
        var slistyle="text-align: left; width: 310px;margin-right: 4px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 4px 10px 3px; position: relative; top: 0px; right: 1px; float: right; border-radius: 4px; display: inline;";
        var cbutstyle="margin-right: 5px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 4px 10px 3px; position: relative;right: 1px; float: right; border-radius: 4px; cursor: pointer; display: inline;";
        var place2=document.querySelector('[data-paction="BroadcasterFeedback"]');
        if(ppage){
            place2=document.getElementsByClassName("tabBar")[0];
        }
        if (noaccess){
            place2=document.getElementsByClassName("top-section")[0];
        }
        var newelem="";
        if(ppage){
            newelem=document.createElement('span');
            newelem.setAttribute("style", butstyle);
            newelem.innerHTML="FOLLOW";
            newelem.setAttribute("title", "Follow the bitch.");
            newelem.addEventListener("click", followbut);
            newelem.id="followbut";
            newelem.style.display="none";
            place2.appendChild(newelem);

            newelem=document.createElement('span');
            newelem.setAttribute("style", butstyle);
            newelem.innerHTML="UNFOLLOW";
            newelem.setAttribute("title", "Dump her.");
            newelem.addEventListener("click", unfollowbut);
            newelem.style.backgroundColor="#8b8b8b";
            newelem.id="unfollowbut";
            newelem.style.display="none";
            place2.appendChild(newelem);

            newelem=document.createElement('span');
            newelem.setAttribute("style", butstyle);
            newelem.innerHTML="JOIN FAN CLUB";
            newelem.addEventListener("click", function(){
                var fcwindow= window.open(domain+"fanclub/join/"+roomname+"/?source=SupporterSourceJoinFanClubButton","");
                fcwindow.onload = function(){
                    fcwindow.addEventListener('unload', function(){setTimeout(function(){
                        document.getElementById("fanclubbut").style.display="none";
                        document.getElementById("fanclubmembut").style.display="none";
                        newinfo();},1000);});
                };
            });
            newelem.style.backgroundColor="#009900";
            newelem.id="fanclubbut";
            newelem.style.display="none";
            place2.appendChild(newelem);

            newelem=document.createElement('span');
            newelem.setAttribute("style", butstyle);
            newelem.innerHTML="MEMBER";
            newelem.addEventListener("click", function(){window.open(domain+"fanclub/join/"+roomname+"/?source=SupporterSourceJoinFanClubButton","");});
            newelem.style.backgroundColor="#009900";
            newelem.id="fanclubmembut";
            newelem.style.display="none";
            place2.appendChild(newelem);
        }
        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="VIDEO CONTROLS ON/OFF";
        newelem.addEventListener("click", vcontrol);
        newelem.style.zIndex="90";
        newelem.id="vcontr";
        place2.appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.style.display="none";
        newelem.innerHTML="CHAT CONTROLS ON/OFF";
        newelem.addEventListener("click", ccontrol);
        newelem.id="ccontr";
        place2.appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="CLEAN PROFILE = ON";
        newelem.style.width="125px";
        newelem.style.display="none";
        newelem.id="clean";
        newelem.addEventListener("click", cleancookie);
        place2.appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="RELOAD INFO";
        newelem.addEventListener("click", newinfo);
        if (noaccess){
            newelem.style.display="none";
        }
        newelem.id="infore";
        place2.appendChild(newelem);

        newelem=document.createElement('div');
        newelem.id="controls";
        newelem.style.display="none";
        newelem.style.position="absolute";
        newelem.style.border="2px solid rgb(244, 115, 33)";
        newelem.style.borderRadius="6px";
        newelem.style.width="340px";
        newelem.style.padding="12px";
        newelem.style.marginTop="600px";
        newelem.style.right="320px";
        if ((ppage)||(noaccess)){
            newelem.style.marginTop="140px";
            newelem.style.right="880px";
        }
        newelem.style.zIndex="999";
        newelem.setAttribute("class","popclass");
        document.getElementById("user_information").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="MIRROR VIDEO";
        newelem.addEventListener("click",mirror);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="INVERT VIDEO";
        newelem.addEventListener("click",invert);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="DRAG";
        newelem.style.cursor="move";
        newelem.addEventListener("mousedown",dragMouseDown);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="BRIGHTNESS : <input type='range' id='myRange' min=50 max=250 value=100 style='width: 200px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange").addEventListener("input",badjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="CONTRAST : <input type='range' id='myRange1' min=25 max=225 value=100 style='width: 200px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange1").addEventListener("input",cadjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="SATURATION : <input type='range' id='myRange2' min=0 max=200 value=100 style='width: 200px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange2").addEventListener("input",sadjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="HUE : <input type='range' id='myRange3' min=180 max=540 value=360 style='width: 200px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange3").addEventListener("input",hadjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="STOP RECORDING";
        newelem.id="stopbut";
        newelem.addEventListener("click",recstop);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="RECORD/PAUSE";
        newelem.id="recbut";
        newelem.addEventListener("click",recstart);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="RESET ALL";
        newelem.addEventListener("click",vreset);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="HIDE CONTROL PANEL";
        newelem.id="vcontr2";
        newelem.addEventListener("click",vcontrol);
        document.getElementById("controls").appendChild(newelem);

        if ((noaccess)||(ppage)){return;}

        newelem=document.createElement('div');
        newelem.id="chatcontrols";
        newelem.style.display="none";
        newelem.style.position="absolute";
        newelem.style.border="2px solid rgb(244, 115, 33)";
        newelem.style.borderRadius="6px";
        newelem.style.width="340px";
        newelem.style.padding="12px";
        newelem.style.top="40px";
        newelem.style.right="10px";
        newelem.style.zIndex="99";
        newelem.setAttribute("class","popclass");
        document.querySelector('[data-testid="room-tab-bar"]').appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Small emoticons : <input type='range' id='c1' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Notice : <input type='range' id='c2' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Subject change : <input type='range' id='c3' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Mod/fan enter-leave : <input type='range' id='c4' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        if (document.location.href.split(".").length>2){newelem.style.display="none";}
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Grey user chat : <input type='range' id='c5' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Moderator chat : <input type='range' id='c6' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Lovense messages : <input type='range' id='c8' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Tips smaller than : <input class='tinput' type='number' id='c7a' min='2' max='1000' value='100' style='width: 4em;height:11px;cursor: pointer; '> tokens.<input type='range' id='c7' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Translate chat to: <select id='language'></select><input type='range' id='c10' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Tokens received : <span id='tclear' style='cursor:pointer'>  (Clear)</span><span id='c9' style='width: 40px;height:11px;float: right; color:black'>0</span>";
        document.getElementById("chatcontrols").appendChild(newelem);
        tr2=tr2.replace("www.chaturbate","translate.googleapis")+"single?client=gtx&sl=auto&tl=";
        var languages=["Afrikaans","Albanian","Arabic","Armenian","Azerbaijani","Balinese","Basque","Belarusian","Bengali","Bosnian","Bulgarian","Cantonese","Catalan","Chinese","Corsican","Croatian","Czech","Danish","Dutch","English","Estonian","Filipino","Finnish","French","Georgian","German","Greek","Hebrew","Hindi","Hungarian","Icelandic","Indonesian","Irish","Italian","Japanese","Javanese","Kazakh","Korean","Latvian","Limburgan","Lithuanian","Luxembourgish","Macedonian","Maltese","Mongolian","Myanmar","Norwegian","Papiamento","Persian","Polish","Portuguese","Punjabi","Romanian","Russian","Sanskrit","Serbian","Sicilian","Slovak","Slovenian","Somali","Spanish","Sundanese","Swahili","Swedish","Tamil","Thai","Turkish","Ukrainian","Urdu","Uzbek","Vietnamese","Yiddish"];
        var langcode=["af","sq","ar","hy","az","ban","eu","be","bn","bs","bg","yue","ca","zh","co","hr","cs","da","nl","en","et","fil","fi","fr","ka","de","el","he","hi","hu","is","id","ga","it","ja","jv","kk","ko","lv","li","lt","lb","mk","mt","mn","my","no","pap","fa","pl","pt","pa","ro","ru","sa","sr","scn","sk","sl","so","es","su","sw","sv","ta","th","tr","uk","ur","uz","vi","yi"];
        for(i=0;i < languages.length;i++) {
            var option=document.createElement('option');
            option.textContent=languages[i];
            option.value=langcode[i];
            document.getElementById("language").appendChild(option);
        }
    }

    function followbut(){
        var url=domain+"follow/follow/"+roomname+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "location", "FollowButton" );
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: domain+roomname+"/",
            body: data
        }).then(function(){
        document.getElementById("followbut").style.display="none";
        document.getElementById("unfollowbut").style.display="block";
        });
    }

    function unfollowbut(){
        var url=domain+"follow/unfollow/"+roomname+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "location", "FollowButton" );
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: domain+roomname+"/",
            body: data
        }).then(function(){
        document.getElementById("unfollowbut").style.display="none";
        document.getElementById("followbut").style.display="block";
        });
    }

    function getvid(){
        vareaid=document.getElementsByTagName("video")[0].id;
        observer3.observe(document.getElementsByTagName("video")[0].parentNode, observerConfig3);
    }

    function varea(){
        if (document.location.href.split("/")[3]!=roomname){
            observer3.disconnect();
            roomname=document.location.href.split("/")[3];
            regetpage();
            return;
        }
        if((ppage)||(noaccess)){
            var video=document.getElementsByTagName("video")[0];
            video.style.filter=vfilter;
            video.style.transform=vmirror;
            return video;
        }
        var vnode=document.getElementById(vareaid);
        if(!vnode){
            vnode=document.getElementById("chat-player");
            if(!vnode){
                return;
            }
        }
        vnode.style.filter=vfilter;
		vnode.style.transform=vmirror;
        if (document.querySelector('[data-testid="video-container"]')&&vnode.src){
            document.querySelector('[data-testid="video-container"]').style.background="rgb(51, 51, 51)";
        }
        document.getElementById("vcontr").style.display="block";
        if (!vnode.src){
            recstop();
            document.getElementById("vcontr").style.display="none";
            document.getElementById("controls").style.display="none";
        }
        return vnode;
    }

	function badjust(){
		br=document.getElementById("myRange").value;
		ofils=varea().style.filter.split(" ");
        vfilter="brightness("+br+"%) "+ofils[1]+" "+ofils[2]+" "+ofils[3]+" "+ofils[4];
        varea();
	}

	function cadjust(){
		br=document.getElementById("myRange1").value;
		ofils=varea().style.filter.split(" ");
        vfilter=ofils[0]+" contrast("+br+"%) "+ofils[2]+" "+ofils[3]+" "+ofils[4];
		varea();
    }

	function sadjust(){
		br=document.getElementById("myRange2").value;
		ofils=varea().style.filter.split(" ");
		vfilter=ofils[0]+" "+ofils[1]+" "+ofils[2]+" saturate("+br+"%) "+ofils[4];
        varea();
	}

	function hadjust(){
		br=document.getElementById("myRange3").value;
		if (br > 359){br=br-360;}
		ofils=varea().style.filter.split(" ");
		vfilter=ofils[0]+" "+ofils[1]+" "+ofils[2]+" "+ofils[3]+" hue-rotate("+br+"deg)";
        varea();
	}

	function invert(){
		ofils=varea().style.filter.split(" ");
		br=" invert(100%) ";
		if (ofils[2]=="invert(100%)"){br=" invert(0%) ";}
		vfilter=ofils[0]+" "+ofils[1]+br+ofils[3]+" "+ofils[4];
        varea();
	}

	function mirror(){
		if (varea().style.transform=="none"){
            vmirror="matrix(-1, 0, 0, 1, 0, 0)";
			varea();

		}else{
            vmirror="none";
			varea();
		}
	}

	function vreset(){
        vfilter="brightness(100%) contrast(100%) invert(0%) saturate(100%) hue-rotate(0deg)";
        vmirror="none";
  		varea();
 		document.getElementById("myRange").value=100;
		document.getElementById("myRange1").value=100;
		document.getElementById("myRange2").value=100;
		document.getElementById("myRange3").value=360;
	}

    function vcontrol(){
        if (document.getElementById("controls").style.display=="block"){
            if (recording){return;}
            document.getElementById("controls").style.display="none";
        }else{
            document.getElementById("controls").style.display="block";
        }
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        var x =parseInt(document.getElementById("controls").style.right);
        var y =parseInt(document.getElementById("controls").style.marginTop);
        if ((pos3>=110)&&(pos3<=window.innerWidth-324)){
            document.getElementById("controls").style.right = (x + pos1) + "px";
        }
        if ((y-pos2>-50)&&(pos4<=window.innerHeight-20)){
            document.getElementById("controls").style.marginTop = (y - pos2) + "px";
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function info(anon){
        fetching++;
        var cred="same-origin";
        if (!anon){cred="omit";}
        var url=domain+"api/chatvideocontext/"+roomname+"/";
        fetch(url,{ credentials: cred}).then(
            function(response) {
                if (response.status !== 200){
                    wprof("Error:","<div style='color:red'>You have no access to this room</div>");
                    if (anon){
                        noaccess=true;
                        fetching--;
                        info(false);
                        return;
                    }
                    fetching--;
                    return;
                }
                response.json().then(function(roomdata) {
                    data=roomdata;
                    fetching--;
                    if (biodata==""){
                        fanbiodata();
                    }else{
                        setprofileinfo();
                    }
                });
            });
    }

    function fanbiodata(){
        var url=domain+"api/biocontext/"+roomname;
        fetch(url,{ credentials: "omit",referrer: domain+roomname+"/"}).then(
            function(response) {
                if (response.status !== 200){
                    setprofileinfo();
                    return;
                }
                response.json().then(function(data) {
                    biodata=data;
                    setprofileinfo();
                });
            });
    }

    function setprofileinfo(){
        room_status=data.room_status;
        username=data.viewer_username;
        if (room_status =="offline"){
            document.getElementById("vcontr").style.display="none";
        }
        if(ppage){
            document.getElementById("vcontr").style.display="none";
            document.getElementsByClassName("voteText")[0].innerHTML="";
            document.getElementsByClassName("voteText")[1].innerHTML="";
            document.getElementsByClassName("highPercent")[0].innerHTML="";
            if (data.satisfaction_score.up_votes){
                document.getElementsByClassName("voteText")[0].innerHTML=data.satisfaction_score.up_votes;
                document.getElementsByClassName("voteText")[1].innerHTML=data.satisfaction_score.down_votes;
                document.getElementsByClassName("highPercent")[0].innerHTML=data.satisfaction_score.percent+"%";
                if (data.satisfaction_score.percent<85){
                    document.getElementsByClassName("highPercent")[0].style.color="red";
                }
            }
        }
        wprof("Find:","<a href='https://camgirlfinder.net/models/cb/"+roomname+"' rel=noreferrer target='_new'>Open in camgirlfinder</a>");
        wprof("Statistics:","<a href='https://statbate.com/search/1/"+roomname+"' rel=noreferrer target='_new'>Open in statbate</a>");
        wprof("Schedule:","<a href='https://www.cbhours.com/user/"+roomname+".html' rel=noreferrer target='_new'>Open in cbhours</a>");
        if (document.getElementById("vcontr").style.display=="none"){
            if (!data.opt_out){
                wprof("Full video (anon):","<a href='https://www.girls4cock.com/fullvideo/?b="+roomname+"' rel=noreferrer target='_new'>Open full video mode as anonymous</a>");
                if (!noaccess){
                    wprof("Full video:","<a href='"+domain+"fullvideo/?b="+roomname+"' rel=noreferrer target='_new'>Open full video mode</a>");
                }
            }
        }
        if (data.opt_out){
            wprof("On network sites:","No");
        }
        makerulesarea(data.chat_rules);
        if(data.chat_rules!=""){
            wprof ("Chat rules:","<a href=# id='rulesview'>Yes, click to read</a>");
            document.getElementById("rulesview").addEventListener("click",function(){
                if(document.getElementById("rulespop").style.display=="none"){
                    document.getElementById("rulespop").innerHTML=chatrules;
                    document.getElementById("rulespop").style.display="block";
                }
                else{
                    document.getElementById("rulespop").style.display="none";
                    document.getElementById("rulespop").innerHTML="";
                }
            });
        }
        if(ppage){
            if(!noaccess){
                if (data.following){
                    document.getElementById("unfollowbut").style.display="block";
                }else{
                    document.getElementById("followbut").style.display="block";
                }
                if (data.fan_club_is_member){
                    document.getElementById("fanclubmembut").style.display="block";
                }else{
                    if (data.performer_has_fanclub){
                        document.getElementById("fanclubbut").style.display="block";
                    }
                }
            }
        }
        if (room_status =="offline"){
            if (biodata.last_broadcast){
                wprof("Last online:",biodata.last_broadcast.split("T")[0]);
            }
        }
        if (data.num_viewers!=0){
            wprof("Users in room:",data.num_viewers+"<a href=# id='userview' style='display:none'> (Show userlist.)</a>");
            document.getElementById("userview").addEventListener("click",getuserlist);
        }else{
            wprof("Users in room:","0<a href=# id='userview' style='display:none'></a>");
        }
        if (data.low_satisfaction_score){
            wprof("Satisfaction score:","<font color=#CC0000>LOW !!!</font>");
        }
        if (data.is_moderator){
            wprof("Moderator:","Yes");
        }
        if (data.fan_club_is_member){
            wprof("Fanclub member:","Yes");
        }
        if ((room_status=="offline")||(ppage)){
            wprof("Room topic:","<div style='width:450px;height:auto'>"+data.room_title+"</div>");
        }
        if (ppage){
            if (room_status.indexOf("hidden")!=-1){
                wprof("Hidden message:",data.hidden_message);
            }
        }
        if (room_status != "offline"){
            hls_source=data.hls_source;
            cmaf=data.cmaf_edge;
            if (cmaf){
                hls_source=hls_source.replace(".m3u8","_sfm4s.m3u8");
                hls_source=hls_source.replace("live-edge","live-fhls");
            }
            videoSrc=hls_source;
            navigator.clipboard.writeText(hls_source);
            var vidqual=data.quality.quality;
            if (!vidqual){vidqual= "unknown";}
            wprof("Video quality:",vidqual+'<font color=#CC0000 id="vstatus"></font>');
        }
        wprof("Video:",'<div id="rstatus">'+room_status+'</div>');
        if (data.is_age_verified){
            wprof("Alarm:","<div id='alarm'><div>");
            makealarm();
        }
        wprof("Video Url:","<a href=# id='hls'>Click to copy to clipboard/Update status</a>");
        document.getElementById("hls").addEventListener("click",function(){getnewhls(!noaccess,true);});
        if (data.tips_in_past_24_hours !== 0){
            wprof("You tipped:",data.tips_in_past_24_hours+" Tk/24h");
        }
        wprof("Nationality:","<span id='flaginfo'>wait....</span>");
        wprof("Region:","<span id='regioninfo'>wait....</span>");
        getregion(false);
        if (biodata.performer_has_fanclub){
            wprof("Fanclub costs:",biodata.fan_club_cost*3+" Tk / 3 Months");
        }
        if (!data.is_age_verified){
            wprof("Status:","Exhibitionist");
        }else{
            if (data.allow_private_shows){
                wprof("Private recording:",data.allow_show_recordings ? "Yes":"No");
                if (data.spy_private_show_price!=0){
                    if (data.premium_private_price!=0){
                        wprof("Min. premium private:",data.premium_private_min_minutes+" Minutes");
                        wprof("Premium privateshow:",data.premium_private_price+" Tk/min");
                    }
                }
                if (data.spy_private_show_price !== 0){
                    if ((data.fan_club_spy_private_show_price !==null)&&(data.fan_club_spy_private_show_price!==data.spy_private_show_price)){
                        if(data.fan_club_spy_private_show_price==0){
                            wprof("Fan Spy on private:","Free");
                        }else{
                            wprof("Fan Spy on private:",data.fan_club_spy_private_show_price+" Tk/min");
                        }
                    }
                    wprof("Spy on private:",data.spy_private_show_price+" Tk/min");
                }else{
                    wprof("Spy on private:","Disabled");
                }
                wprof("Minimum private:",data.private_min_minutes+" Minutes");
                wprof("Privateshow:",data.private_show_price+" Tk/min");
            }else{
                wprof("Privateshow:","Disabled");
            }
        }
        if (login){
            if (!noaccess){
                if (roomname!=yourname){
                  var dmurl="messages/";
                    if (document.getElementById("dmListIconRoot")){dmurl="dm/";}
                    wprof ("DM:","<a href='"+domain+dmurl+roomname+"/' id='dmpop'>Open window</a>");
                    document.getElementById("dmpop").addEventListener("click", function(event){opendm(this);event.stopPropagation();event.preventDefault();return false;});
                }
            }
            getnotes();
            createimage();
        }
        if ((room_status!="offline")&&(!ppage)){chatchange();}
    }

    function getuserlist(){
        if (regiofetch){alert("Please wait");return;}
        if(document.getElementById("rulespop").style.display=="block"){
            document.getElementById("rulespop").style.display="none";
            document.getElementById("rulespop").innerHTML="";
            return;
        }else{
            document.getElementById("rulespop").style.display="block";
        }

        var listurl=domain+"api/getchatuserlist/?sort_by=a&roomname="+roomname+"&exclude_staff=false";
        fetch(listurl,{credentials: "omit",referrerPolicy: "no-referrer"}).then(
            function(response) {
                if (response.status !== 200){
                    return;
                }
                response.text().then(function(userdata) {
                    formatuserlist(userdata);
                });
            });
    }

    function makealarm(){
        var newelem=document.createElement('span');
        newelem.innerHTML="Off <input type='range' id='alrm' min=0 max=1 value=0 style='width: 35px;height:auto;cursor: pointer'> On <span id='aonly'>|| Alarm only <input type='range' id='alrmtype' min=0 max=1 value=0 style='width: 35px;height:auto;cursor: pointer'> Go to page if public</span>";
        document.getElementById("alarm").appendChild(newelem);
        document.getElementById("alrm").addEventListener("change",setalrm);
        if(document.querySelector('[data-testid="offline-content-container"]')){
            if(document.querySelector('[data-testid="offline-content-container"]').style.display=="none"){
                document.getElementById("aonly").style.display="none";
            }
        }
        document.title=ctitle;
    }

    function setalrm(){
        if (document.getElementById("alrm").value==0){document.title=ctitle;return;}
        ctitle=document.title;
        document.title="\u23F0 "+ctitle;
        getnewhls(true,false);
        setTimeout(function(){
            oldroomstatus=roomstatus;
            if(!alarmrun){
            alarmrun=true;
            testalarm();}},1000);
    }

    function testalarm(){
        setTimeout(function(){
            if(document.getElementById("alrm").value==0){alarmrun=false;return;}
            getnewhls(true,false,2);
        }, 60000);
    }

    function testalarm2(){
        if (roomstatus != oldroomstatus){
            if(document.getElementById("alrmtype").value==1){
                if (roomstatus=="public"){
                    forceopen(roomname);
                }
                oldroomstatus=roomstatus;
                if (alarmrun){
                    testalarm();
                    return;
                }
            }
            playalarm();
            alarmtab();
            alarmrun=false;
        }else{
            if (alarmrun){
                testalarm();
            }
        }
    }

    function playalarm(){
        if (document.getElementById("alrm")){
            if (document.getElementById("alrm").value==0){return;}
        }
        alarmaudio.play();
        setTimeout(playalarm,2000);
    }

    function alarmtab(){
        if (document.getElementById("alrm")){
            if (document.getElementById("alrm").value==0){document.title=ctitle;return;}
        }
        if (document.title != "ALARM"){
            document.title = "ALARM";
        }else{
            document.title = "!!!!!!";
        }
        setTimeout(alarmtab,500);
    }

   function formatuserlist(userdata){
        var broadcastarray=[];
        for(i=0;i < region.length;i++) {
            broadcastarray[i]=JSON.parse(localStorage.getItem("region_"+region[i]));
        }
        var bc="";
        var userarray=userdata.split(",");
        var height=15*userarray.length+120;
        var scroll="";
        if (height<240){height=240;}
        if (height>500){height=500;scroll=";overflow-y:scroll";}
        var userstring="<div style='float:right;color:black'>(Close)</div><div onclick='event.stopPropagation()' style='cursor:default;color:black;width:350px;height:"+height+"px"+scroll+"'>";
        for (i=1; i<userarray.length; i++){
            var user=userarray[i].split("|");
            if (user[1]=="o"){user[1]="#dc5500";}
            if (user[1]=="m"){user[1]="#dc0000";}
            if (user[1]=="f"){user[1]="#090";}
            if (user[1]=="l"){user[1]="#804baa";}
            if (user[1]=="p"){user[1]="#be6aff";}
            if (user[1]=="tr"){user[1]="#1e5cfb";}
            if (user[1]=="t"){user[1]="#69a";}
            if (user[1]=="g"){user[1]="#939393";}
            if (user[2]=="m"){user[2]="https://web.static.mmcdn.com/tsdefaultassets/gendericons/male.svg";}
            if (user[2]=="f"){user[2]="https://web.static.mmcdn.com/tsdefaultassets/gendericons/female.svg";}
            if (user[2]=="c"){user[2]="https://web.static.mmcdn.com/tsdefaultassets/gendericons/couple.svg";}
            if (user[2]=="s"){user[2]="https://web.static.mmcdn.com/tsdefaultassets/gendericons/trans.svg";}
            if (user[3]=="t"){user[3]="<span title='follower'>⭐</span>";}
            if (user[3]=="f"){user[3]="";}
            bc="";
            for(n=0;n < region.length;n++) {
                if (broadcastarray[n].indexOf(user[0])!=-1){
                    bc="<span title='broadcaster' name='broadcast' broadcaster='"+user[0]+"'>🖥️</span>";
                    break;
                }
            }
            if (user[0]==roomname){
                bc="<span title='broadcaster' name='broadcast' broadcaster='"+user[0]+"'>🖥️</span>";
            }
            if ((user[0]==roomname)||(user[0]==yourname)){
                userstring=userstring+"<img style='height:16px' src='"+user[2]+"'>"+bc+"<a style='font-weight: bold;color:"+user[1]+"'>"+user[0]+"</a> "+user[3]+"<br>";
            }else{
                if (loggedin){
                    userstring=userstring+"<img style='height:16px' src='"+user[2]+"'>"+bc+"<a target=_blank style='font-weight: bold;color:"+user[1]+"' href='"+domain+"p/"+yourname+"?tab=bio&model="+user[0]+"'>"+user[0]+"</a> "+user[3]+"<br>";
                }else{
                    userstring=userstring+"<img style='height:16px' src='"+user[2]+"'>"+bc+"<a target=_blank style='font-weight: bold;color:"+user[1]+"' href='"+domain+user[0]+"'>"+user[0]+"</a> "+user[3]+"<br>";
                }
            }
        }
        userstring=userstring+"+"+userarray[0].split("|")[0]+" Anonymous users.</div>";
        document.getElementById("rulespop").innerHTML=userstring;
        broadcastarray="";
        broadcastcheck(document.getElementsByName("broadcast").length-1);
    }

    function broadcastcheck(n){
        if (n<0){return;}
        var name=document.getElementsByName("broadcast")[n].getAttribute("broadcaster");
        var url=domain+"get_edge_hls_url_ajax/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "room_slug", name );
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,{
            credentials: "omit",
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: domain+name+"/",
            body: data
        }).then(function(response){
            response.json().then(function(data){
                if(data.room_status=="offline"){
                    document.getElementsByName("broadcast")[n].innerHTML="🖥️❌";
                    document.getElementsByName("broadcast")[n].title="broadcaster offline";
                }
                n--;
                broadcastcheck(n);
                return;
            });
        });
    }

    function chatchange(){
        document.getElementById("ccontr").style.display="block";
        document.getElementById("c1").addEventListener("change",chatsetchange);
        document.getElementById("c2").addEventListener("change",chatsetchange);
        document.getElementById("c3").addEventListener("change",chatsetchange);
        document.getElementById("c4").addEventListener("change",chatsetchange);
        document.getElementById("c5").addEventListener("change",chatsetchange);
        document.getElementById("c6").addEventListener("change",chatsetchange);
        document.getElementById("c7").addEventListener("change",chatsetchange);
        document.getElementById("c7a").addEventListener("change",chatsetchange);
        document.getElementById("c8").addEventListener("change",chatsetchange);
        document.getElementById("c10").addEventListener("change",chatsetchange);
        var chatobserver = new MutationObserver(chatadjust);
        var pmchatobserver = new MutationObserver(pmchatadjust);
        var chatobserverConfig = {childList: true};
        var observenode=document.getElementsByClassName("message-list")[0];
        var pmobservenode=document.getElementsByClassName("message-list")[1];
        if (localStorage.getItem(roomname+"Tokens")){
            document.getElementById("c9").innerHTML=localStorage.getItem(roomname+"Tokens");
            firstentry=false;
        }
        document.getElementById("tclear").addEventListener("click",cleartokens);
        chatobserver.observe(observenode,chatobserverConfig);
        pmchatobserver.observe(pmobservenode,chatobserverConfig);
    }
    function pmchatadjust(){
        tabpm();
        chatadjust();
    }
    function cleartokens(){
        document.getElementById("c9").innerHTML=0;
        localStorage.removeItem(roomname+"Tokens");
    }

    function chatsetchange(){
        c1=document.getElementById("c1").value;
        c2=document.getElementById("c2").value;
        c3=document.getElementById("c3").value;
        c4=document.getElementById("c4").value;
        c5=document.getElementById("c5").value;
        c6=document.getElementById("c6").value;
        c7=document.getElementById("c7").value;
        c7a=document.getElementById("c7a").value;
        if (c7a<2){c7a=2;document.getElementById("c7a").value=2;}
        if (c7a>1000){c7a=1000;document.getElementById("c7a").value=1000;}
        c8=document.getElementById("c8").value;
        c10=document.getElementById("c10").value;
        smallemoonoff();
        chatadjust();
    }

    function chatadjust(){
        if (!firstentry){
            twaiting=true;
            setTimeout(function(){twaiting=false;}, 200);
            firstentry=true;
        }
        var tags=document.getElementsByClassName('msg-list-fvm');
        for (n=0; n<tags.length; n++){
            chattamper(n);
        }
    }

    function chattamper(tag){
        var messages=document.getElementsByClassName('msg-list-fvm')[tag].querySelectorAll('[data-testid="chat-message"]');
        var chatmessages=messages.length;
        if (chatmessages==0){return;}
        var translated=0;
        for (i = chatmessages-1; i > 0; i--) {
            var noticeelm=messages[i].querySelector('[data-testid="room-notice"]');
            if (noticeelm!=null){
                var noticeclasses=noticeelm.classList;
                var notetext=noticeelm.querySelector('[data-testid="room-notice-viewport"]').textContent;
                if (noticeclasses.length==1){
                    if (notetext.indexOf("Notice:")==0){
                        if (c2==1){
                            messages[i].style.display="none";
                        }else{
                            messages[i].style.display="block";
                        }
                    }
                    if (notetext.indexOf("Moderator")==0){
                        if (c4==1){
                            messages[i].style.display="none";
                        }else{
                            messages[i].style.display="block";
                        }
                    }
                    if (notetext.indexOf("Fan club member")==0){
                        if (c4==1){
                            messages[i].style.display="none";
                        }else{
                            messages[i].style.display="block";
                        }
                    }
                }
                if (noticeclasses.contains("titleChange")){
                    if (c3==1){
                        messages[i].style.display="none";
                    }else{
                        messages[i].style.display="block";
                    }
                }
                if (noticeclasses.contains("isTip")){
                    var tokens=parseInt(notetext.split("tipped ")[1].split(" ")[0]);
                    if (tag==0){
                        if(messages[i].style.display=="flex"){
                            if(!twaiting){
                                document.getElementById("c9").innerHTML=parseInt(document.getElementById("c9").innerHTML)+tokens;
                                localStorage.setItem(roomname+"Tokens",document.getElementById("c9").innerHTML);
                            }
                        }
                    }
                    if ((c7==1)&&(tokens<c7a)){
                        messages[i].style.display="none";
                    }else{
                        messages[i].style.display="block";
                    }
                }
            }
            if (messages[i].querySelector('[data-testid="chat-message-text"]')!=null){
                if (messages[i].querySelector('[data-testid="chat-message-username"]').className=="broadcaster"){
                    var chattext=messages[i].querySelector('[data-testid="chat-message-text"]').textContent;
                    if ((chattext.indexOf("Lovense")!=-1)||(chattext.indexOf("------")!=-1)||(chattext.indexOf("******")!=-1)||(chattext.indexOf("The High Tipper")!=-1)||(chattext.indexOf("The king Tipper")!=-1)||(chattext.indexOf("Special Commands:")!=-1)||(chattext.indexOf("Blitz Mode")!=-1)||(chattext.indexOf("the critical hit rate")!=-1)){
                        messages[i].name="notranslate";
                        if (c8==1){
                            messages[i].style.display="none";
                        }else{
                            messages[i].style.display="block";
                        }
                    }
                }
                if (messages[i].querySelector('[data-testid="chat-message-username"]').className=="defaultUser"){
                    if (c5==1){
                        messages[i].style.display="none";
                    }else{
                        messages[i].style.display="block";
                    }
                }
                if (messages[i].querySelector('[data-testid="chat-message-username"]').className=="mod"){
                    if (c6==1){
                        messages[i].style.display="none";
                    }else{
                        messages[i].style.display="block";
                    }
                }
                if (c10==1){
                    if(!messages[i].name){
                        if (messages[i].style.display!="none"){
                            var splitmode=true;
                            var splitchatblock=false;
                            if(document.getElementsByClassName('msg-list-fvm')[tag].classList.contains("message-list")){splitchatblock=true;}
                            if(document.getElementById("ChatTabContainer").style.display=="none"){splitmode=false;}
                            if ((splitmode&&splitchatblock)||(!splitmode&&!splitchatblock)){
                                messages[i].name="translate";
                                translated++;
                                if (translated<8){
                                    translate(messages[i]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function translate(elm){
        var chattext=elm.querySelector('[data-testid="chat-message-text"]').textContent;
        var result="";
        chattext=chattext.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,"");
        chattext=chattext.replace(/\./gi,"{.}");
        chattext=chattext.replace(/\?/gi,"{?}");
        chattext=chattext.replace(/\!/gi,"{!}");
        chattext=chattext.replace(/\|/gi,"{|}");
        chattext=chattext.replace(/\&/gi,"{{");
        chattext=chattext.toLowerCase();
        if (chattext.length>2){
            chattext=encodeURI(chattext);
            var lang=document.getElementById("language").options[document.getElementById("language").selectedIndex].value;
            GM_xmlhttpRequest({
                method: "GET",
                timeout: 5000,
                mozAnon: true,
                anonymous: true,
                url: tr2+lang+"&dt=t&q="+chattext,
                onload: function(response) {
                    if (response.status !== 200){
                        result="Translate error "+response.status;
                    }else{
                        result=JSON.parse(response.responseText)[0][0][0];
                        result=result.replace(/\\u200b/gi,"");
                        result=result.replace(/\\u003d/gi,"=");
                        result=result.replace(/\\u003c/gi,"<");
                        result=result.replace(/\\u003e/gi,">");
                        result=result.replace(/\{\{/gi,"&");
                        result=result.replace(/\{/gi,"");
                        result=result.replace(/\}/gi,"");
                    }
                    showtranslate(result,elm);
                },
                ontimeout: function(){
                    result="Translate error timeout";
                    showtranslate(result,elm);
                }
            });
        }
    }

    function showtranslate(result,elm){
        var newelem=document.createElement('span');
        newelem.innerHTML=result;
        newelem.className="translated";
        elm.firstChild.lastElementChild.appendChild(newelem);
    }

    function smallemoonoff(){
        if (c1==1){
            document.body.classList.add("smallemo");
        }else{
            document.body.classList.remove("smallemo");
        }
    }

    function ccontrol(){
        if (document.getElementById("chatcontrols").style.display=="block"){
            document.getElementById("chatcontrols").style.display="none";
        }else{
            document.getElementById("chatcontrols").style.display="block";
        }
    }

    function opendm(that){
       var dmwindow= window.open(that.href,'DMpop','toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=1000,height=800');
       dmwindow.onload = function(){
           this.addEventListener('unload', function(){setTimeout(function(){newinfo();},1000);});
       };
    }

    function getnotes(){
        var url=domain+"api/notes/for_user/"+roomname+"/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    wprof("Attention:","This room is banned.");
                    return;
                }
                response.json().then(function(data) {
                    if (data.text == null){data.text="";}
                    opennote=data.text;
                    buildprofnote();
                });
            });
    }

    function makerulesarea(rule){
        if (document.getElementById("rulespop")){return;}
        var rulestyle="cursor:pointer;z-index:999;top:10px;left:10px;box-shadow:0px 0px 32px rgba(0, 0, 0, 0.32);border-radius:4px;border:1px solid rgb(221, 221, 221);background-color:rgb(200, 200, 200);position:absolute; display:none; white-space: pre-line; text-align: left; line-height: 1.4; height: auto; width:500px; padding: 10px 10px 10px 10px; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 15px;";
        var newelem=document.createElement('span');
        newelem.setAttribute("style", rulestyle);
        newelem.id="rulespop";
        chatrules="<div style='color:black'><b>"+roomname+" chatrules:</b><br><br>"+rule+"<br><br><center>(Click to close)</center></div>";
        newelem.addEventListener("click",function(){this.style.display="none";this.innerHTML="";});
        document.querySelector('[data-testid="room-bio-tab-contents"]').appendChild(newelem);
    }

    function createimage(){
        if (!ppage&&!noaccess){return;}
        hls.detachMedia();
        if (document.getElementById("profimg")){document.getElementById("profimg").remove();}
        if (document.getElementById("profjpgimg")){
            pimg.removeEventListener("load",regetimgprof);
            pimg.removeEventListener("error",errorimgprof);
            document.getElementById("profjpgimg").remove();
            removevidplayer();
        }
        if (document.getElementById("vstatus")){document.getElementById("vstatus").innerHTML="";}
        if (videoSrc!=""){
            if ((room_status=="public")||(room_status.indexOf("watching")!=-1)){
                if (!gojpg){
                    if (!document.getElementById("profplayer")){
                        makevidplayer();
                    }
                    startvid();
                }else{
                    document.getElementById("vstatus").innerHTML=" !!Video error please wait!!";
                    removevidplayer();
                    makejpgplayer();
                    setTimeout(function(){gojpg=false;getnewhls(true,false,1);}, 10000);
                }
                return;
            }
        }
        removevidplayer();
        if ((videoSrc=="")&&(room_status=="public")){
            makejpgplayer();
            return;
        }
        var url="https://jpeg.live.mmcdn.com/minifwap/"+roomname+".jpg";
        fetch(url,{
            cache: "no-cache",
            credentials: "same-origin",referrer: domain}).then(
            function(response){
                response.blob().then(
                    function(rawimg){
                        var imgsize=rawimg.size;
                        if (((imgsize<9500)||(imgsize>9510))&&((imgsize<4800)||(imgsize>4850))){
                            makeimg();
                        }else{
                            makecrd();
                        }
                    });
                }
        );
    }

    function removevidplayer(){
        if (document.getElementById("profplayer")){
            document.removeEventListener("visibilitychange",vidpause);
            document.getElementById("profplayer").remove();
            document.getElementById("controls").style.display="none";
            document.getElementById("vcontr").style.display="none";

        }
    }

    function makecrd(){
        if (noaccess){return;}
        if (data.summary_card_image==""){return;}
        var newelem=document.createElement('img');
        newelem.src=data.summary_card_image;
        newelem.className="profplayer";
        newelem.id="profimg";
        newelem.style.height="480px";
        newelem.style.maxWidth="854px";
        document.querySelector('[data-testid="room-bio-tab-contents"]').appendChild(newelem);
    }

    function makeimg(){
        var newelem=document.createElement('img');
        newelem.src="https://jpeg.live.mmcdn.com/minifwap/"+roomname+".jpg";
        newelem.className="profplayer";
        newelem.id="profimg";
        newelem.style.height="270px";
        newelem.style.width="480px";
        document.querySelector('[data-testid="room-bio-tab-contents"]').appendChild(newelem);
    }

    function makejpgplayer(){
        var newelem=document.createElement('canvas');
        newelem.width="854";
        newelem.height="480";
        newelem.id="profjpgimg";
        newelem.style.display="none";
        document.querySelector('[data-testid="room-bio-tab-contents"]').appendChild(newelem);
        pimg.addEventListener("load",regetimgprof);
        pimg.addEventListener("error",errorimgprof);
        pimg.crossOrigin = "Anonymous";
        n=new Date().getTime();
        pimg.src = "https://jpeg.live.mmcdn.com/stream?room="+roomname+"&f="+n;
        var canvas=document.querySelector('canvas');
        stream = canvas.captureStream ? canvas.captureStream() : canvas.mozCaptureStream();
        makevidplayer();
        document.querySelector('video').srcObject=stream;
        document.querySelector('video').play();
    }

    function errorimgprof(){
        if (gojpg){return;}
        recstop();
        setTimeout(function(){getnewhls(true,false,1);},2000);
    }

    function regetimgprof(){
        var lt=new Date().getTime()-n;
        if (lt>180){lt=180;}
        if ((document.visibilityState!="visible")&&(!recording)){
            setTimeout(regetimgprof,2000);
        }else{
            var canvas = document.querySelector('canvas');
            canvas.getContext('2d').drawImage(pimg, 0, 0, pimg.width, pimg.height);
            setTimeout(function(){n=new Date().getTime();pimg.src = "https://jpeg.live.mmcdn.com/stream?room="+roomname+"&f="+n;}, 200-lt);
        }
    }

    function makevidplayer(){
         if(document.getElementById("tabs_content_container")){
            document.getElementById("tabs_content_container").style.minHeight=parseInt(0.562*window.innerWidth-5)+"px";
        }
        var vidobserver=new MutationObserver(vidsize);
        var vidobserverConfig ={attributes : true, attributeFilter : ['style'] };
        var control=localStorage.getItem("videoControls");
        var newdivelem=document.createElement('div');
        newdivelem.className="profdivplayer";
        newdivelem.style.width=vidwidth+"px";
        newdivelem.id="profplayer";
        newdivelem.style.backgroundImage = "url('https://jpeg.live.mmcdn.com/minifwap/"+roomname+".jpg')";
        newdivelem.style.backgroundPosition="center";
        newdivelem.style.backgroundRepeat="no-repeat";
        newdivelem.style.backgroundSize="cover";
        var newelem=document.createElement('video');
        newelem.style.width="100%";
        newelem.controls=true;
        if (control.indexOf("true")!=-1){newelem.muted=true;}
        var volume=control.split(":")[1].split(",")[0];
        newelem.volume=volume/100;
        newelem.poster="https://jpeg.live.mmcdn.com/stream?room="+roomname+"&f="+ new Date().getTime();
        newelem.height=parseInt(vidwidth*0.562)+1;
        newelem.id="profvid";
        newelem.setAttribute("playsinline", "");
        newelem.setAttribute("autoplay", "");
        newdivelem.appendChild(newelem);
        document.querySelector('[data-testid="room-bio-tab-contents"]').appendChild(newdivelem);
        vidobserver.observe(document.getElementById("profplayer"), vidobserverConfig);
        if(!document.querySelector('canvas')){
            document.addEventListener("visibilitychange",vidpause);
        }
        document.getElementById("vcontr").style.display="block";
    }

    function vidsize(){
        vidwidth=parseInt(document.getElementById("profplayer").style.width);
        if (vidwidth<80){vidwidth=80;document.getElementById("profplayer").style.width=vidwidth+"px";}
        if (vidwidth>window.innerWidth-75){vidwidth=window.innerWidth-75;document.getElementById("profplayer").style.width=vidwidth+"px";}
        document.getElementById("profvid").height=parseInt(vidwidth*0.562)+1;
    }

    function startvid(){
        var restarting=false;
        if(document.visibilityState!="visible"){return;}
        document.getElementById("vcontr").style.display="block";
        var video=document.getElementsByTagName('video')[0];
        video.poster="https://jpeg.live.mmcdn.com/stream?room="+roomname+"&f="+ new Date().getTime();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (restarting){return;}
            if (fatalerror==0){setTimeout(function(){fatalerror=0;}, 15000);}
            fatalerror++;
            if (fatalerror < 6){
                if ((data.fatal==true)||(data.type="networkError")){
                    hls.detachMedia();
                    restarting=true;
                    setTimeout(function(){getnewhls(true,false,1);},2000);
                  }
            }else{
                gojpg=true;
                hls.detachMedia();
                restarting=true;
                createimage();
            }
        });
    }

    function vidpause(){
        if (recording){return;}
        if (document.hidden){
            hls. stopLoad();
            hls.detachMedia();
        }else{
            if (!document.hidden){
                startvid();
            }
        }
    }

    function recstop(){
        if (!recording){return;}
        mediaRecorder.stop();
    }
    function recstart(){
        if (recording){
            if (!recpause){
                mediaRecorder.pause();
                recpause=true;
                document.getElementById("recbut").style.color="#990000";
                setTimeout(function(){document.getElementById("recbut").style.color="#990000";},400);
                return;
            }
            mediaRecorder.resume();
            recpause=false;
            return;
        }
        recname=roomname+"_"+new Date().toISOString().split(".")[0]+"GMT";
        recording=true;
        document.getElementById("vcontr").style.cursor="not-allowed";
        document.getElementById("vcontr2").style.cursor="not-allowed";
        document.getElementById("recbut").style.color="#990000";
        if (!document.getElementById('profjpgimg')){
            var video=document.querySelector('video');
            stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
            if (!video.captureStream) {
                var ctx = new AudioContext();
                var dest = ctx.createMediaStreamSource(stream);
                dest.connect(ctx.destination);
            }
        }
        mediaRecorder = new MediaRecorder(stream,{mimeType:'video/webm codecs="vp8" opus'});
        mediaRecorder.onstop = startDownload;
        mediaRecorder.ondataavailable = handleDataAvailable;
        try {
            mediaRecorder.start(1000);
        } catch (e) {
            document.getElementById("recbut").style.color="white";
            recording=false;
            recpause=false;
        }
    }
    function handleDataAvailable(event) {
        document.getElementById("recbut").style.color="#990000";
        if (event.data && event.data.size > 0) {
            setTimeout(function(){document.getElementById("recbut").style.color="white";},300);
            recordedBlobs.push(event.data);
        }
    }
    function startDownload() {
        recpause=false;
        recording=false;
        document.getElementById("vcontr").style.cursor="pointer";
        document.getElementById("vcontr2").style.cursor="pointer";
        if (!document.getElementById('profjpgimg')){
            removevidplayer();
            document.getElementById("controls").style.display="block";
            createimage();
        }
        var blob = new Blob(recordedBlobs, {type: 'video/webm'});
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = recname+'.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(function(){
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            recordedBlobs = [];
        }, 100);
    }

    function buildprofnote(){
        var subbutraw="<span id='profsubmit' style='color: rgb(255, 255, 255); background: rgb(244, 115, 33); font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; padding: 4px 10px 5px; position: relative; left: 120px; float: left; border-radius: 4px; cursor: pointer;'>Save</span>";
        wprof("",'<div width="200px" id="profnote" style="display:none"><a href=# id="profcancel">Cancel</a>'+subbutraw+'</div>');
        wprof("Personal notes:","<textarea id='proftext' spellcheck='false' placeholder='Enter notes about this user (only seen by you)'></textarea>");
        document.getElementById("proftext").value=opennote;
        document.getElementById("proftext").addEventListener("input",profopenbutton);
        document.getElementById("profcancel").addEventListener("click",profclosebutton);
        document.getElementById("profsubmit").addEventListener("click",profsavenote);
    }

    function profsavenote(){
        var notetext=document.getElementById("proftext").value;
        var url=domain+"api/notes/for_user/"+roomname+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "text", notetext );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: domain+roomname+"/",
            body: data
        }).then(profaftersave);
    }

    function profaftersave(){
        opennote=document.getElementById("proftext").value;
        profclosebutton();
    }

    function profopenbutton(){
        document.getElementById("profnote").style.display="block";
        document.getElementById("proftext").value=document.getElementById("proftext").value.replace("$"," "+new Date().toLocaleDateString()+" ");
        if(opennote==document.getElementById("proftext").value){
            profclosebutton();
        }
    }

    function profclosebutton(){
        document.getElementById("profnote").style.display="none";
        document.getElementById("proftext").value=opennote;
    }

    function wprof(col1,col2){
        var container=document.getElementsByClassName("BioContents")[0];
        var newtr=document.createElement('tr');
        newtr.setAttribute("style", "font-size: 14px; font-weight: normal; line-height: 15px; vertical-align: top; text-align: left;");
        newtr.setAttribute("name", "info");
        var newtd=document.createElement('td');
        newtd.setAttribute("style", "padding-bottom: 9px; font-family: UbuntuMedium, Arial, Helvetica, sans-serif; height: 16px;");
        newtd.className="label";
        var newspan=document.createElement('span');
        newspan.className="defaultColor";
        newspan.innerHTML=col1;
        newtd.appendChild(newspan);
        var newtd2=document.createElement('td');
        newtd2.setAttribute("style", "font-size: 14px; line-height: 16px; font-family: UbuntuRegular, Arial, Helvetica, sans-serif;");
        newtd2.className="contentText";
        newtd2.innerHTML=col2;
        newtr.appendChild(newtd);
        newtr.appendChild(newtd2);
        var referenceNode=container.getElementsByTagName("table")[0];
        referenceNode.insertBefore(newtr, referenceNode.getElementsByTagName("tr")[2]);
    }

    function newinfo(){
        if (fetching!==0){alert("Slow down !");return;}
        if (regiofetch){alert("Please wait !");return;}
        regiofetch=true;
        localStorage.setItem("regloaded","bar");
        if(document.getElementById("rulespop")){document.getElementById("rulespop").style.display="none";}
        var tags=document.getElementsByName("info");
        for(i=tags.length-1;i>=0;i--){
            tags[i].remove();
        }
        info(true);
    }

    function cleaninit(){
        var p=0;
        var maxoke="";
        var attr="";
        var tags=document.querySelectorAll('[rel="nofollow"]');
        for (n=0; n<tags.length; n++){
            if (tags[n].style.position){
                if (tags[n].style.position=="fixed"){
                    tags[n].style.position="absolute";
                }
                if (tags[n].style.position.indexOf("var")!=-1){
                    tags[n].style.position="absolute";
                }
                if (tags[n].style.position.indexOf("absolute")!=-1){
                    if (tags[n].getAttribute("style").indexOf("!important")!=-1){
                        attr=tags[n].getAttribute("style");
                        attr=attr.split("!important").join("");
                        tags[n].setAttribute("style",attr);
                    }
                    tags[n].classList.add("profpos");
                    p++;
                }
            }
            if (tags[n].style.marginTop){
                maxoke=-30;
                if(tags[n].style.marginTop.indexOf("px")!=-1){maxoke=-200;}
                if (parseFloat(tags[n].style.marginTop)<maxoke){
                    if (tags[n].getAttribute("style").indexOf("!important")!=-1){
                        attr=tags[n].getAttribute("style");
                        attr=attr.split("!important").join("");
                        tags[n].setAttribute("style",attr);
                    }
                    tags[n].classList.add("profmar");
                    p++;
                }
            }
            if (tags[n].style.margin){
                maxoke=-30;
                if(tags[n].style.margin.split(" ")[0].indexOf("px")!=-1){maxoke=-200;}
                if (parseFloat(tags[n].style.margin)<maxoke){
                    if (tags[n].getAttribute("style").indexOf("!important")!=-1){
                        attr=tags[n].getAttribute("style");
                        attr=attr.split("!important").join("");
                        tags[n].setAttribute("style",attr);
                    }
                    tags[n].classList.add("profmar");
                    p++;
                }
            }
            if (tags[n].style.cursor){
                if (tags[n].getAttribute("style").indexOf("!important")!=-1){
                    attr=tags[n].getAttribute("style");
                    attr=attr.split("!important").join("");
                    tags[n].setAttribute("style",attr);
                }
                tags[n].classList.add("profcur");
                p++;
            }
        }
        document.getElementById("clean").style.display="none";
        if (p!==0){
            document.getElementById("clean").style.display="block";
            cleanup();
        }
    }

	function cleancookie(){
        if (localStorage.getItem("pclean")){
            localStorage.removeItem("pclean");
		}else{
            localStorage.setItem("pclean", "foo");
        }
		cleanup();
	}

    function cleanup(){
        var claction=!localStorage.getItem("pclean");
        if (claction){
            document.getElementById("clean").innerHTML= "CLEAN PROFILE = ON&nbsp;";
            document.body.classList.add("cleanprof");
        }else{
            document.getElementById("clean").innerHTML= "CLEAN PROFILE = OFF";
            document.body.classList.remove("cleanprof");
        }
    }

    function linkfix(){
        var bioarea= document.getElementsByClassName('BioContents')[0];
        var tags = bioarea.getElementsByTagName('a');
        for (i=0; i<tags.length; i++){
            if (tags[i].href.indexOf("campaign=")!=-1){
                tags[i].href=tour;
            }
            if (tags[i].href.indexOf('?url=') != -1){
                var linkout=decodeURIComponent(tags[i].href).split("?url=")[1];
                if (linkout.indexOf("campaign=")!=-1){
                    linkout=tour;
                }
                tags[i].href=linkout;
            }
        }
        if(document.querySelector('[data-testid="sign-up-tab"]')){
            document.querySelector('[data-testid="sign-up-tab"]').href=tour;
        }
    }

    function collectiondownload(){
        document.getElementById("main").addEventListener("click", collectiondownload2);
        collectiondownload2();
    }

    function collectiondownload2(){
        setTimeout(function(){collectiondownload3();}, 2000);
    }

    function collectiondownload3(){
        if(document.getElementsByTagName("video").length>0){
            if(document.getElementsByTagName("video")[0].src){
                if(!document.getElementById("link")){
                    var newelem=document.createElement('a');
                    newelem.id="link";
                    newelem.style.position="relative";
                    newelem.style.left="250px";
                    newelem.style.top="5px";
                    newelem.href= document.getElementsByTagName("video")[0].src;
                    newelem.target="_blank";
                    newelem.innerHTML="Right click, save to disk.";
                    newelem.style.backgroundColor="white";
                    newelem.style.marginLeft="20px";
                    document.getElementsByClassName("createdAt")[0].parentNode.appendChild(newelem);
                }
            }
        }
    }

    function savedprvdownload(){
        setTimeout(function(){savedprvdownload3();}, 2000);
    }

    function savedprvdownload3(){
        var newelem=document.createElement('a');
        newelem.href= document.getElementsByTagName("video")[0].src;
        newelem.target="_blank";
        newelem.innerHTML="Right click, save to disk.<br>";
        newelem.style.backgroundColor="white";
        newelem.style.marginLeft="20px";
        document.getElementById("tsRecordedShowPlayer").appendChild(newelem);
    }

     function passwordfollow(){
         setTimeout(function(){
             var unfollow=document.querySelector('[data-testid="unfollow-button"]');
             var follow=document.querySelector('[data-testid="follow-button"]');
             if (unfollow.style.display=="none"){
                 follow.parentNode.parentNode.style.display="block";
                 follow.style.display="block";
             }
             unfollow.addEventListener("click", function(){setTimeout(function(){document.location.reload();}, 500);} );
             follow.addEventListener("click", function(){setTimeout(function(){document.location.reload();}, 500);} );
         }, 1000);
         var newelem=document.createElement('div');
         newelem.className="BioContents";
         var newtable=document.createElement('table');
         newelem.appendChild(newtable);
         var newtr=document.createElement('tr');
         newtable.appendChild(newtr);
         newtr=document.createElement('tr');
         newelem.style.position="relative";
         newelem.style.float="left";
         newtable.appendChild(newtr);
         document.getElementsByClassName("defaultColor")[0].appendChild(newelem);
         var dmurl="messages/";
         if (document.getElementById("dmListIconRoot")){dmurl="dm/";}
         wprof("Find:","<a href='https://camgirlfinder.net/models/cb/"+roomname+"' rel=noreferrer target='_new'>Open in camgirlfinder</a>");
         wprof("Statistics:","<a href='https://statbate.com/search/1/"+roomname+"' rel=noreferrer target='_new'>Open in statbate</a>");
         wprof("DM:","<a href='"+domain+dmurl+roomname+"/' id='dmpop'>Open window</a>");
         wprof("Video:",'<div id="rstatus"></div>');
         wprof("Video status:","<a href=# id='hls'>Update status</a>");
         wprof("Check:","Off <input type='range' id='pwalrm' min=0 max=1 value=0 style='width: 35px;height:auto;cursor: pointer'> On || Enter the room if you get access.");
         document.getElementById("pwalrm").addEventListener("change",setpwalrm);
         getnewhls(true,false);
         document.getElementById("hls").addEventListener("click",function(){getnewhls(true,true);});
         document.getElementById("dmpop").addEventListener("click", function(event){opendm3(this);event.stopPropagation();event.preventDefault();return false;});
         getnotes();
         document.getElementsByClassName("tooltip")[0].innerHTML="If follow does not work this room banned your region or gender.";
         document.getElementById("tsContent").style.minHeight="400px";
    }

    function setpwalrm(){
        if (document.getElementById("pwalrm").value==0){return;}
        if (alarmrun==false){
            alarmrun=true;
            checkpwalarm();
        }
    }

    function checkpwalarm(){
        setTimeout(function(){
            if(document.getElementById("pwalrm").value==0){alarmrun=false;return;}
            var url=domain+"api/chatvideocontext/"+roomname+"/";
            fetch(url,{credentials: "same-origin"}).then(
            function(response) {
                if (response.status == 200){
                    forceopen(roomname);
                    return;
                }
                checkpwalarm();
            });
        },60000);
    }

    function forceopen(room){
        window.focus();
        document.location.href=domain+room;
    }

    function opendm3(that){
       window.open(that.href,'DMpop','toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=1000,height=800');
    }

    function bannedroom(){
        var url=domain+"api/chatvideocontext/"+roomname+"/";
        fetch(url,{method: 'HEAD', credentials: "omit"}).then(
            function(response) {
                if (response.status !== 200){
                    noaccess=true;
                    setprofile();
                    return;
                }else{
                    document.location.href=domain+'p/'+yourname+'?tab=bio&model='+roomname;
                    return;
                }
            });
    }

    function setprofile(){
        document.getElementsByClassName("BaseRoomContents")[0].style.minHeight=parseInt(0.562*window.innerWidth-5)+"px";
        var newelem=document.createElement('div');
        newelem.style.width="100%";
        newelem.style.height="1px";
        newelem.setAttribute('data-testid', 'room-bio-tab-contents');
        document.getElementsByClassName("BaseRoomContents")[0].appendChild(newelem);
        newelem=document.createElement('div');
        newelem.style.margin="14px 14px";
        document.getElementsByClassName("BaseRoomContents")[0].appendChild(newelem);
        newelem=document.createElement('div');
        newelem.className="BioContents";
        newelem.style.margin="20px";
        var newtable=document.createElement('table');
        newelem.appendChild(newtable);
        var newtr=document.createElement('tr');
        newtable.appendChild(newtr);
        newtr=document.createElement('tr');
        newtable.appendChild(newtr);
        document.getElementsByClassName("BaseRoomContents")[0].appendChild(newelem);
        putinlinks();
        makevidcontrol();
        getnewhls(true,false,1);
        setTimeout(function(){
            if (room_status!="public"){
                if(room_status.indexOf("watching")==-1){
                    document.getElementById("vcontr").style.display="none";
                    document.getElementById("controls").style.display="none";
                }
            }
        },1000);
    }

    function putinlinks(){
        wprof("","<a href=# id=moreinfo>Click here to search for more info.</a>");
        document.getElementById("moreinfo").addEventListener("click",moreinfo);
        wprof("Find:","<a href='https://camgirlfinder.net/models/cb/"+roomname+"' rel=noreferrer target='_new'>Open in camgirlfinder</a>");
        wprof("Statistics:","<a href='https://statbate.com/search/1/"+roomname+"' rel=noreferrer target='_new'>Open in statbate</a>");
        wprof("Schedule:","<a href='https://www.cbhours.com/user/"+roomname+".html' rel=noreferrer target='_new' id='userview'>Open in cbhours</a>");
        wprof("Video status:","<a href=# id='hls'>Update status</a>");
        document.getElementById("hls").addEventListener("click",function(){getnewhls(true,true,1);});
        wprof("Video:",'<div id="rstatus">'+room_status+'</div>');
        wprof("Nationality:","<span id='flaginfo'>wait....</span>");
        wprof("Region:","<span id='regioninfo'>wait....</span>");
        setTimeout(function(){
            getregion(false);
        },1000);
        wprof('<font color=#CC0000 id="vstatus"></font>',"");
        if(login){
            getnotes();
        }
    }
    function moreinfo(){
        if (room_status!="public"){
            document.getElementById("moreinfo").innerHTML="Room is not public.";
            setTimeout(function(){document.getElementById("moreinfo").innerHTML="Click here to search for more info.";},3000);
            return;
        }
        document.getElementById("moreinfo").removeEventListener("click",moreinfo);
        document.getElementById("moreinfo").innerHTML="Please wait....";
        var dataurl=domain+"affiliates/api/onlinerooms/?format=json&wm=DEieF";
        fetch(dataurl,{credentials: "omit",referrerPolicy: "no-referrer"}).then(
            function(response) {
                if (response.status !== 200){
                    document.getElementById("moreinfo").innerHTML="Error reading roomlist.";
                    return;
                }
                response.json().then(function(data) {
                    for (n=0; n<data.length; n++){
                        if (data[n].username==roomname){
                            wprof("Gender:",data[n].gender);
                            wprof("Given location:",data[n].location);
                            if (data[n].country !=""){
                                if (document.getElementById("flaginfo").innerHTML!=data[n].country){
                                    wprof("Nationality:",data[n].country);
                                }
                            }
                            wprof("Room topic:","<div style='width:450px;height:auto'>"+data[n].room_subject+"</div>");
                            wprof("Spoken languages:",data[n].spoken_languages);
                            wprof("Name:", data[n].display_name);
                            wprof("Birthday:",data[n].birthday);
                            wprof("Age:",data[n].age);
                            wprof("Time online:",toTime(data[n].seconds_online));
                            wprof("Users in room:",data[n].num_users);
                            wprof("Followers:",data[n].num_followers);
                            document.getElementById("moreinfo").innerHTML="";
                            data="";
                            break;
                        }
                    }
                    if (n==data.length){
                        document.getElementById("moreinfo").innerHTML="No information found, user may no longer be in public or opt-out.";
                        setTimeout(function(){
                            document.getElementById("moreinfo").innerHTML="Click here to search for more info.";
                            document.getElementById("moreinfo").addEventListener("click",moreinfo);
                        },3000);
                    }
                    data="";
                });
            });
    }
    function toTime(seconds) {
        var date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8).replace(":","h").replace(":","m")+"s";
    }

	function createCookie(name,value,days,cdomain){
        var expires="";
        if (cdomain){
            cdomain=";domain=."+cdomain;
        }else{
            cdomain = "";
        }
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/"+cdomain;
	}

	function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' '){
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) === 0){
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
	}

	function eraseCookie(name,cdomain){
        createCookie(name,"",-1,cdomain);
	}

    function rebuildbio(){
        referenceNode=document.getElementsByClassName("BioContents")[0].getElementsByTagName("table")[0];
        document.querySelector('[data-paction="RoomTabs"]').remove();
        removebionode();
        document.getElementsByClassName("editbio")[0].remove();
        document.getElementsByClassName("tooltip defaultTooltipColor")[0].remove();
        document.querySelector('[data-paction-name="ActiveRoom"]').innerHTML=tocap(roomname) + "'s Bio";
        document.querySelector('[data-paction-name="ActiveRoom"]').title=tocap(roomname) + "'s Bio";
        document.title=tocap(roomname) + "'s Bio";
        ctitle=document.title;
        getbiodata(true);
    }

    function tocap(name){
        if (!name){return "";}
        return name.charAt(0).toUpperCase()+name.slice(1);
    }

    function getbiodata(anon){
        var cred="same-origin";
        if (!anon){cred="omit";}
        var url=domain+"api/biocontext/"+roomname;
        fetch(url,{ credentials: cred,referrer: domain+roomname+"/"}).then(
            function(response) {
                if (response.status !== 200){
                    if (anon){
                        getbiodata(false);
                        return;
                    }
                    document.location.href=domain+roomname+"/";
                    return;
                }
                response.json().then(function(data) {
                    biodata=data;
                    buildbio();
                    afterrebuild();
                });
            });
    }

    function removebionode(){
        if (referenceNode.getElementsByTagName("tr")[3]){
            referenceNode.getElementsByTagName("tr")[3].remove();
            removebionode();
        }
    }

    function buildbio(){
        referenceNode.getElementsByTagName("tr")[2].getElementsByTagName("span")[0].innerHTML="Real Name:";
        referenceNode.getElementsByTagName("tr")[2].getElementsByTagName("td")[1].innerHTML=tocap(biodata.real_name);

        var newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
        newnode.getElementsByTagName("span")[0].innerHTML="Followers:";
        newnode.getElementsByTagName("td")[1].innerHTML=biodata.follower_count;
        referenceNode.appendChild(newnode);
        if (biodata.display_birthday){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Birth Date:";
            newnode.getElementsByTagName("td")[1].innerHTML=biodata.display_birthday;
            referenceNode.appendChild(newnode);
        }
        if (biodata.display_age){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Age:";
            newnode.getElementsByTagName("td")[1].innerHTML=biodata.display_age;
            referenceNode.appendChild(newnode);
        }
        newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
        newnode.getElementsByTagName("span")[0].innerHTML="I Am";
        newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.sex)+" "+tocap(biodata.subgender);
        referenceNode.appendChild(newnode);
        newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
        newnode.getElementsByTagName("span")[0].innerHTML="Interested In:";
        newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.interested_in[0])+" "+tocap(biodata.interested_in[1])+" "+tocap(biodata.interested_in[2])+" "+tocap(biodata.interested_in[3]);
        referenceNode.appendChild(newnode);
        if (biodata.location){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Location:";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.location);
            referenceNode.appendChild(newnode);
        }
        if (biodata.time_since_last_broadcast){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Last Broadcast:";
            newnode.getElementsByTagName("td")[1].innerHTML=biodata.time_since_last_broadcast;
            referenceNode.appendChild(newnode);
        }
        if (biodata.languages){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Language(s):";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.languages);
            referenceNode.appendChild(newnode);
        }
        if (biodata.body_type){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Body Type:";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.body_type);
            referenceNode.appendChild(newnode);
        }
        if (biodata.smoke_drink){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Smoke / Drink:";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.smoke_drink);
            referenceNode.appendChild(newnode);
        }
        if (biodata.body_decorations){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Body Decorations:";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.body_decorations);
            referenceNode.appendChild(newnode);
        }
        if (biodata.social_medias[0]){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Social Media:";
            newnode.getElementsByTagName("td")[1].innerHTML="Available on cam page.";
            referenceNode.appendChild(newnode);
        }
        if (biodata.photo_sets[0]){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Photo/video:";
            newnode.getElementsByTagName("td")[1].innerHTML="<a href='"+domain+"photo_videos/photoset/detail/"+roomname+"/"+biodata.photo_sets[0].id+"' target=_blank> Open in new tab.</a>";
            referenceNode.appendChild(newnode);
        }
        newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
        newnode.getElementsByTagName("span")[0].innerHTML="About Me:";
        newnode.getElementsByTagName("td")[1].innerHTML=biodata.about_me;
        referenceNode.appendChild(newnode);
        if (biodata.wish_list){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Wish List:";
            newnode.getElementsByTagName("td")[1].innerHTML=biodata.wish_list;
            referenceNode.appendChild(newnode);
        }
    }

    function getnewhls(anon,clicked,next){
        if (hlsfetching==true){return;}
        hlsfetching=true;
        var cred="same-origin";
        if (!anon){cred="omit";}
        var oldmsg=document.getElementById("hls").innerHTML;
        if(clicked){
            document.getElementById("hls").innerHTML="Copying....";
        }else{
            document.getElementById("hls").innerHTML="Checking....";
        }
        var url=domain+"get_edge_hls_url_ajax/";
        var csrftoken= readCookie("csrftoken");
        var edge="";
        if (videoSrc!=""){
            edge=videoSrc.split("/")[2];
        }
        var data = new FormData();
        data.append( "room_slug", roomname );
        if (next==1){
            data.append( "bandwidth", "high" );
            data.append( "current_edge", edge );
            data.append( "exclude_edge", "" );
        }
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,{
            credentials: cred,
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: domain+roomname+"/",
            body: data
        }).then(function(response){
            if (response.status !== 200) {
                if (anon){
                    hlsfetching=false;
                    getnewhls(false,clicked,next);
                    return;
                }
                document.getElementById("rstatus").innerHTML="Error";
                document.getElementById("hls").innerHTML=oldmsg;
                hlsfetching=false;
                return;
            }
            response.json().then(function(data){
                document.getElementById("rstatus").innerHTML=data.room_status;
                document.getElementById("hls").innerHTML=oldmsg;
                roomstatus=data.room_status;
                room_status=data.room_status;
                videoSrc=data.url;
                if (videoSrc!=""){
                    if (cmaf){
                        videoSrc=videoSrc.replace(".m3u8","_sfm4s.m3u8");
                        videoSrc=videoSrc.replace("live-edge","live-fhls");
                    }
                    if (clicked){navigator.clipboard.writeText(videoSrc);}
                }
                hlsfetching=false;
                if (next==1){createimage();}
                if (next==2){testalarm2();}
            });
        });
    }

    function getregion(again){
        if (localStorage.getItem("regloaded")=="bar"){
            loadregion();
            return;
        }
        if (localStorage.getItem("regloaded")){
            for(i=0;i < region.length;i++) {
                regioarray=JSON.parse(localStorage.getItem("region_"+region[i]));
                 if (regioarray.indexOf(roomname)!=-1){
                    document.getElementById("regioninfo").innerHTML=niceregion[i];
                    if (regioarray[regioarray.indexOf(roomname)+1].length==2){
                        document.getElementById("flaginfo").innerHTML=regioarray[regioarray.indexOf(roomname)+1];
                    }else{
                        document.getElementById("flaginfo").parentNode.parentNode.style.display="none";
                    }
                     regiofetch=false;
                     document.getElementById("userview").style.display="initial";
                     return;
                }
            }// have array but not in
            if ((room_status=="offline")||(room_status=="away")){
                document.getElementById("regioninfo").parentNode.parentNode.style.display="none";
                document.getElementById("flaginfo").parentNode.parentNode.style.display="none";
                regiofetch=false;
                document.getElementById("userview").style.display="initial";
                return;
            }
            if(!again){
                loadregion();
                return;
            }
        }else{
            if(!again){
                loadregion();
                return;
            }
        }
        regiofetch=false;
        document.getElementById("userview").style.display="initial";
        document.getElementById("regioninfo").parentNode.parentNode.style.display="none";
        document.getElementById("flaginfo").parentNode.parentNode.style.display="none";
    }

    function loadregion(){
        regioarray=[];
        if (localStorage.getItem("regloaded")=="foo"){
            regioarray=JSON.parse(localStorage.getItem("region_"+region[rcount]));
        }
        getregiondata();
    }

    function getregiondata(){
        var url=domain+"api/public/affiliates/onlinerooms/?limit=500&offset="+regoffset*500+"&region="+region[rcount]+"&wm=DEieF&client_ip=212.77.7.51";
        fetch(url,{ credentials: "omit"}).then(
            function(response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function(data){
                    if (data.results != null){
                        var regiolist=data.results;
                        for (n=0; n<regiolist.length; n++){
                            var name=regiolist[n].username;
                            if (regioarray.indexOf(name)==-1){
                                var flag=regiolist[n].country;
                                regioarray.push(name);
                                if (flag.length==2){
                                    regioarray.push(flag);
                                }
                            }
                        }
                        var pages=Math.ceil(data.count/500);
                        regoffset++;
                        if (regoffset!=pages){
                            getregiondata();
                            return;
                        }else{
                            regioarray.push("");
                            localStorage.setItem("region_"+region[rcount],JSON.stringify(regioarray));
                            rcount++;
                            regoffset=0;
                            if (rcount!=region.length){
                                loadregion();
                            }else{
                                rcount=0;
                                localStorage.setItem("regloaded","foo");
                                getregion(true);
                            }
                        }
                    }
                });
            });
    }
    function bantoggle(){
        if (document.getElementById("banlist").style.display=="none"){
            document.getElementById("banlist").style.display="block";
            banusers=[];
            getbanlist(1);
        }else{
            document.getElementById("banusers").innerHTML="";
            document.getElementById("unbanbut").removeEventListener("click", unbanit );
            document.getElementById("permbut").removeEventListener("click", permban );
            document.getElementById("banlist").style.display="none";
        }
    }
    function getbanlist(page){
        var url=domain+"api/ts/chat/ban-list/?page="+page;
        var nowdate=new Date();
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function(data){
                    var selectnode=document.getElementById("banusers");
                    var option=document.createElement('option');
                    option.textContent="Select a user.";
                    option.value=0;
                    selectnode.appendChild(option);
                    var banlist=data.ban_dict.bans;
                    for (n=0; n<banlist.length; n++){
                        var expdate=new Date(banlist[n].expires_at);
                        var expwhen=expdate-nowdate;
                        var expdays=Math.ceil(expwhen/86400000);
                        option=document.createElement('option');
                        option.textContent=banlist[n].username;
                        if (expdays>100){
                            option.textContent=option.textContent+" 🔒";
                        }else{
                            option.textContent=option.textContent+" ("+expdays+" days)";
                        }
                        option.value=banlist[n].id;
                        selectnode.appendChild(option);
                        banusers.push(banlist[n].username);
                    }
                    if (data.ban_dict.current_page!=data.ban_dict.page_count){
                        page++;
                        getbanlist(page);
                        return;
                    }
                    localStorage.setItem("ignoredusers",banusers.toString());
                    document.getElementById("unbanbut").addEventListener("click", unbanit );
                    document.getElementById("permbut").addEventListener("click", permban );
                });
            });
    }
    function unbanit(){
        var banid=document.getElementById("banusers").options[document.getElementById("banusers").selectedIndex].value;
        if (banid==0){return;}
        var url=domain+"edit_room_ban/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "banid", banid);
        data.append( "action", "remove_ban");
        data.append( "room_username", yourname);
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,{
            credentials: "same-origin",
            method: "POST",
            headers: {
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: domain+yourname+"/",
            body: data
        }).then(function(response){
            if (response.status !== 200) {
                alert("Error "+response.status);
                return;
            }
            document.getElementById("banusers").innerHTML="";
            banusers=[];
            getbanlist(1);
       });
    }
    function permban(){
        var banid=document.getElementById("banusers").options[document.getElementById("banusers").selectedIndex].value;
        if (banid==0){return;}
        if (document.getElementById("banusers").options[document.getElementById("banusers").selectedIndex].textContent.split(" ").length<3){return;}
        var url=domain+"edit_room_ban/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "banid", banid);
        data.append( "action", "ban_perm");
        data.append( "room_username", yourname);
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,{
            credentials: "same-origin",
            method: "POST",
            headers: {
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: domain+yourname+"/",
            body: data
        }).then(function(response){
            if (response.status !== 200) {
                alert("Error "+response.status);
                return;
            }
            document.getElementById("banusers").innerHTML="";
            banusers=[];
            getbanlist(1);
       });
    }
    function unfollowthispage(){
        var thumbholder=document.getElementsByClassName("endless_page_template")[0];
        roomthumbs=thumbholder.getElementsByClassName("roomCard");
        nrt=roomthumbs.length;
        if(confirm("Do you want to unfollow these "+thumbholder.getElementsByClassName("icon_following").length+" rooms?")){
            document.getElementById("unfollowit").removeEventListener("click",unfollowthispage);
            unfollowroom2();
        }
    }
    function unfollowroom(){
        setTimeout(unfollowroom2,600);
    }
    function unfollowroom2(){
        document.getElementById("unfollowit").innerHTML="<a href=#>WAIT... "+nrt+"</a>";
        nrt--;
        if (nrt<0){
            var page=document.location.href.split("page=")[1];
            if (page){page--;}
            document.location.href=domain+"followed-cams/offline/?page="+page;
        }
        followstar=roomthumbs[nrt].querySelector('[data-testid="follow-star"]');
        var name=followstar.getAttribute("data-slug");
        if (followstar.title=="Unfollow"){
            unfollowpage(name);
        }else{
            followpage(name);
        }
    }
    function followpage(name){
        var url=domain+"follow/follow/"+name+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "location", "FollowStar" );
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: domain+roomname+"/",
            body: data
        }).then(function(response){
            if (response.status !== 200) {
                alert("Following failed.");
                return;
            }
            followstar.classList.remove("icon_not_following");
            followstar.classList.add("icon_following");
            followstar.title="Unfollow";
            unfollowroom();
        });
    }
    function unfollowpage(name){
        var url=domain+"follow/unfollow/"+name+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "location", "FollowStar" );
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-requested-with': 'XMLHttpRequest'
            },
            body: data
        }).then(function(response){
            if (response.status !== 200) {
                alert("Unfollowing failed.");
                return;
            }
            clearnote(name);
        });
    }
    function clearnote(name){
        var url=domain+"api/notes/for_user/"+name+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "text", "" );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            body: data
        }).then(function(){
            if (name==roomname){makeban2(name);return;}
            roomthumbs[nrt].remove();
            unfollowroom();
        });
    }
    function getignorelist(){
        if (localStorage.getItem("ignoredusers")){
            checkignore();
            return;
        }
        getignoreusers(1);
    }

    function getignoreusers(page){
        var url=domain+"api/ts/chat/ban-list/?page="+page;
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function(data){
                    var banlist=data.ban_dict.bans;
                    for (n=0; n<banlist.length; n++){
                        banusers.push(banlist[n].username);
                    }
                    if (data.ban_dict.current_page!=data.ban_dict.page_count){
                        page++;
                        getignoreusers(page);
                        return;
                    }
                    localStorage.setItem("ignoredusers",banusers.toString());
                    checkignore();
                });
            });
    }

    function checkignore(){
        if (roomname==""){return;}
        banusers=localStorage.getItem("ignoredusers").split(",");
        if (banusers.indexOf(roomname)!=-1){
            document.location.href=domain;
        }

        if (roomname=="roomlogin"){
            if (banusers.indexOf(currpage.split("/")[4])!=-1){
                document.location.href=domain;
            }
        }
        if(ppage){
            if (currpage.split("model=").length==1){return;}
            if (roomname==yourname){return;}
            if (banusers.indexOf(currpage.split("model=")[1].split("&")[0])!=-1){
                document.location.href=domain;
            }
        }
    }

    function banignore(){
        if ((roomname==yourname)||(roomname==stor)||(roomname=="p")){
            alert("Sorry, i can not let you do that.");
            return;
        }
        makeban(roomname);
    }

    function makeban(bname){
        if(!confirm("Do you want to ban/ignore "+bname+" ?\n"+bname+" will never be able to contact you and you will never be able to visit this room again.")){return;}
        unfollowpage(bname);
    }
    function makeban2(bname){
        var url=domain+"api/messaging/delete-conversation/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "csrfmiddlewaretoken", csrftoken );
        data.append( "to_username", bname );
        fetch(url,{
            credentials: "same-origin",
            method: "POST",
            headers: {
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: domain+"messages/",
            body: data
        }).then(function(){
            makeban3(bname);
        });
    }
    function makeban3(bname){
        var url=domain+"roomban/"+bname+"/"+yourname+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,{
            credentials: "same-origin",
            method: "POST",
            headers: {
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: domain+yourname+"/",
            body: data
        }).then(function(response){
            if (response.status !== 200) {
                alert("Error "+response.status);
                return;
            }
            response.json().then(function(data){
                banusers=localStorage.getItem("ignoredusers").split(",");
                banusers.push(bname);
                localStorage.setItem("ignoredusers",banusers.toString());
                setTimeout(function(){document.location.href=domain;},200);
            });
        });
    }

})();