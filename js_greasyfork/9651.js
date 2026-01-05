// ==UserScript==
// @name        MyAnimeList (MAL) Add Entry Form Saver
// @namespace   https://greasyfork.org/users/7517
// @description Saves form content on DB add entry pages.
// @icon        http://i.imgur.com/b7Fw8oH.png
// @version     1.1
// @author      akarin
// @include     /^https?:\/\/myanimelist\.net\/panel\.php\?go=\w+&do=add/
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/9651/MyAnimeList%20%28MAL%29%20Add%20Entry%20Form%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/9651/MyAnimeList%20%28MAL%29%20Add%20Entry%20Form%20Saver.meta.js
// ==/UserScript==

/*jslint fudge, maxerr: 10, browser, devel, this, white, for, single */
/*global jQuery */

(function($) {
    "use strict";

/**
 * @author Kyle Florence <kyle[dot]florence[at]gmail[dot]com>
 * @website https://github.com/kflorence/jquery-deserialize/
 * @version 1.3.3
 *
 * Dual licensed under the MIT and GPLv2 licenses.
 */    
function getElements(a){return a.map(function(){return this.elements?jQuery.makeArray(this.elements):this}).filter(":input:not(:disabled)").get()}function getElementsByName(a){var b,c={};return jQuery.each(a,function(a,d){b=c[d.name],void 0===b&&(c[d.name]=[]),c[d.name].push(d)}),c}var push=Array.prototype.push,rcheck=/^(?:radio|checkbox)$/i,rplus=/\+/g,rselect=/^(?:option|select-one|select-multiple)$/i,rvalue=/^(?:button|color|date|datetime|datetime-local|email|hidden|month|number|password|range|reset|search|submit|tel|text|textarea|time|url|week)$/i;jQuery.fn.deserialize=function(a,b){var c,d,e=getElements(this),f=[];if(!a||!e.length)return this;if(jQuery.isArray(a))f=a;else if(jQuery.isPlainObject(a)){var g,h;for(g in a)jQuery.isArray(h=a[g])?push.apply(f,jQuery.map(h,function(a){return{name:g,value:a}})):push.call(f,{name:g,value:h})}else if("string"==typeof a){var i;for(a=a.split("&"),c=0,d=a.length;c<d;c++)i=a[c].split("="),push.call(f,{name:decodeURIComponent(i[0].replace(rplus,"%20")),value:decodeURIComponent(i[1].replace(rplus,"%20"))})}if(!(d=f.length))return this;var j,k,l,m,n,o,p,h,q,r,s,t,u=jQuery.noop,v=jQuery.noop,w={};for(b=b||{},e=getElementsByName(e),jQuery.isFunction(b)?v=b:(u=jQuery.isFunction(b.change)?b.change:u,v=jQuery.isFunction(b.complete)?b.complete:v),c=0;c<d;c++)if(j=f[c],n=j.name,h=j.value,q=e[n],q&&0!==q.length)if(void 0===w[n]&&(w[n]=0),s=w[n]++,q[s]&&(k=q[s],p=(k.type||k.nodeName).toLowerCase(),rvalue.test(p)))u.call(k,k.value=h);else for(l=0,m=q.length;l<m;l++)if(k=q[l],p=(k.type||k.nodeName).toLowerCase(),o=null,rcheck.test(p)?o="checked":rselect.test(p)&&(o="selected"),o){if(t=[],k.options)for(r=0;r<k.options.length;r++)t.push(k.options[r]);else t.push(k);for(r=0;r<t.length;r++)j=t[r],j.value==h&&u.call(j,(j[o]=!0)&&h)}return v.call(this),this};    
    
var mal = {
    page: document.URL.match(/\/panel\.php\?go=(\w+)/)[1]
};
 
function load() {
    $('#content form').deserialize(mal.loadValue('form'));
    $('#content form select[name^="frmGenreID"] option').removeAttr('selected');
    $('#content form select[name^="frmGenreID"]').deserialize(mal.loadValue('genres'));
}

function save() {
    mal.saveValue('form', $('#content form').serialize());
    mal.saveValue('genres', $('#content form select[name^="frmGenreID"]').serialize());
}

mal.loadValue = function(key, value) {
    try {
        value = JSON.parse(localStorage.getItem(mal.page + '#' + key)) || value;
    }
    finally {
        return value;
    }
};

mal.saveValue = function(key, value) {
    localStorage.setItem(mal.page + '#' + key, JSON.stringify(value));
};

if ($('#malLogin').length === 0) {
    $('<li style="float: right"></li>')
        .append($('<a href="javascript:void(0)">Load</a>').click(load))
        .prependTo('#horiznav_nav ul');
    $('<li style="float: right"></li>')
        .append($('<a href="javascript:void(0)">Save</a>').click(save))
        .prependTo('#horiznav_nav ul');
}
    
}(jQuery));