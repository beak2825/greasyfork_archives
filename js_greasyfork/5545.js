// ==UserScript==
// @name       FB Name 2 wot Nick
// @namespace  http://v-dk.dk/
// @version    0.1.0.51.2
// @description  Replace FB Name with a WOT Nick
// @include https://*.facebook.com/groups/1389183988021920/*
// @include https://www.facebook.com/groups/1389183988021920/*
// @match https://www.facebook.com/groups/1389183988021920/*
// @copyright  2012+, gandaDK
// @require http://code.jquery.com/jquery-latest.js
// @grant GM_xmlhttpRequest
// @grant GM_log  
// @downloadURL https://update.greasyfork.org/scripts/5545/FB%20Name%202%20wot%20Nick.user.js
// @updateURL https://update.greasyfork.org/scripts/5545/FB%20Name%202%20wot%20Nick.meta.js
// ==/UserScript==



$(function ($) {
    $.ajaxSetup({
        xhr: function () {
            return new GM_XHR;
        }
    });
    $('a').click(function () {
        setTimeout(function () {
            joink();
        }, 500);
    });
});

function joink() {
    $('._5lus a').css("background-image", "url('http://clans.worldoftanks.eu/media/clans/emblems/cl_656/500018656/emblem_32x32.png')");
    $('._5lus a').css("background-position", "0px, 0px");
    var poster_name_holder = $('div .fwn .fcg > a');
    poster_name_holder.each(function () {
        $(this).text(n2m($(this).text()));
    });
    
    var comment_name_holder = $('.UFICommentActorName');
    comment_name_holder.each(function () {
        $(this).text(n2m($(this).text()));
    });
    
    var like_name_holder = $('.profileLink');
    like_name_holder.each(function () {
        $(this).text(n2m($(this).text()));
    });
    
    var new_added_name_holder = $('span .fwb');
    new_added_name_holder.each(function () {
        $(this).text(n2m($(this).text()));
    });
}




function n2m(name) {
    
    //GM_log(getNick(name));
    //return getNick(name);
    
    var n2mArr = [
        {"name": "Kenneth Buhl Ganda Nielsen", "nick": "gandaDK"},
        {"name": "Lars Kriegler", "nick": "KrieglerDK"},
        {"name": "Michael Hansen", "nick": "Danish_Dynamite"},
        {"name": "Thomas Ipsen", "nick": "Tipsen"},
        {"name": "Lennart Hammerich Petersen", "nick": "Luthic"},
        {"name": "Flemming Bakker Hansen", "nick": "SLOWOFWAR"},
        {"name": "Jesper Bjørn Andersen", "nick": "HELLDOG77"},
        {"name": "Ralf Rasmussen", "nick": "danadorr"},
        {"name": "Piet Pedas", "nick": "Daseman"},
        {"name": "Sune Grønkjær", "nick": "error_dk"},
        {"name": "Carsten Launy", "nick": "ChaosCrew"},
        {"name": "Stefan Sejer Asmussen", "nick": "spaceraver"},
        {"name": "Benny Asmussen", "nick": "Wrestler67"},
        {"name": "Thomas Langthjem", "nick": "Langthjem69"},
        {"name": "Carsten Just Von Thun", "nick": "JvT"},
        {"name": "Jonas Ruben Skousen", "nick": "Rubenspanzer"}
    ];// Jonas Ruben Skousen Rubenspanzer
    
    for (i = 0; i < n2mArr.length; i++) {
        if (n2mArr[i].name === name) {
            return n2mArr[i].nick;
        }
    }
}

setInterval(function(){
    joink();
},1000);


function GM_XHR() {
    this.type = null;
    this.url = null;
    this.async = null;
    this.username = null;
    this.password = null;
    this.status = null;
    this.headers = {};
    this.readyState = null;

    this.open = function(type, url, async, username, password) {
        this.type = type ? type : null;
        this.url = url ? url : null;
        this.async = async ? async : null;
        this.username = username ? username : null;
        this.password = password ? password : null;
        this.readyState = 1;
    };

    this.setRequestHeader = function(name, value) {
        this.headers[name] = value;
    };

    this.abort = function() {
        this.readyState = 0;
    };

    this.getResponseHeader = function(name) {
        return this.headers[name];
    };

    this.send = function(data) {
        this.data = data;
        var that = this;
        GM_xmlhttpRequest({
            method: this.type,
            url: this.url,
            headers: this.headers,
            data: this.data,
            onload: function(rsp) {
                // Populate wrapper object with returned data
                for (k in rsp) {
                    that[k] = rsp[k];
                }
            },
            onerror: function(rsp) {
                for (k in rsp) {
                    that[k] = rsp[k];
                }
            },
            onreadystatechange: function(rsp) {
                for (k in rsp) {
                    that[k] = rsp[k];
                }
            }
        });
    };
};