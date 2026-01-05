// ==UserScript==
// @name           Fallen London resizer
// @namespace      tag://fallenlondon
// @description    Tiny script for resizing main game body to fit all cards in one row with some minor tweaks
// @author         Mutik
// @version        0.1.3
// @grant          unsafeWindow
// @include        http://fallenlondon.storynexus.com*
// @downloadURL https://update.greasyfork.org/scripts/7366/Fallen%20London%20resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/7366/Fallen%20London%20resizer.meta.js
// ==/UserScript==

function main() {
    window.mFL = {
        version: { major: "0.1", minor: '3' },
        isFirefox: navigator.userAgent.indexOf('Firefox') > 0,
        c: function(ele) {
            function Cele(ele) {
                this._ele = ele;
                this.ele = function() { return this._ele };
                this.set = function(param) { for (var attr in param) if (param.hasOwnProperty(attr)) this._ele.setAttribute(attr, param[attr]); return this };
                this.text = function(text) { this._ele.appendChild(document.createTextNode(text)); return this };
                this.html = function(text,overwrite) { this._ele.innerHTML = overwrite ? text : this._ele.innerHTML + text; return this };
                this.on = function(event,func,bubble) { this._ele.addEventListener(event,func,bubble); return this };
                this.attach = function(method,ele) {
                    if (typeof ele == 'string') ele = document.getElementById(String(ele));
                    if (!(ele instanceof Node)) throw 'Invalid attachment element specified';
                    else if (!/^(?:to|before|after)$/i.test(method)) throw 'Invalid append method specified';
                    else if (method == 'to') ele.appendChild(this._ele);
                    else if (method == 'before') ele.parentNode.insertBefore(this._ele, ele);
                    else if (typeof ele.nextSibling == 'undefined') ele.parentNode.appendChild(this._ele);
                    else ele.parentNode.insertBefore(this._ele, ele.nextSibling);
                    return this
                };
            }
            if (typeof ele == 'string') ele = /^#/i.test(String(ele)) ? document.getElementById(ele.substring(1)) : document.createElement(String(ele));
            if (ele instanceof Node) return new Cele(ele);
            throw 'Invalid element type specified';
        },
        layout: {
            apply: function() {
                mFL.c('style').set({type: "text/css",id: 'mFL_style'}).html('\
                    .outer_wrapper              {width: 1080px;}\
                    .rhs_col                    {width: 950px;}\
                    .content_lhs                {width: 820px;}\
                    .tab_content_bg             {width: 785px}\
                    .tab_content                {width: 750px}\
                    .toggle-map                 {margin-right: 7px}\
                    .you_lhs p                  {font-size: 0.7em}\
                    img#mainContentLoading      {margin-left: 343px !important}\
                    div#topMap                  {margin-left: 40px}\
                    ul#cards                    {width: 610px}\
                    .storylet                   {width: 741px}\
                    .storylet-select\
                    .storylet_rhs               {width: 645px}\
                    .storylet_flavour_text      {width: 728px}\
                    .quality_update_box         {width: 748px}\
                    .quality_update_rank        {width: 600px}\
                    .quality_update_box p       {width: 670px; margin-left: 6px}\
                    .quality_update_box .score  {margin: 0 6px}\
                    input.standard_btn          {height: 30px}\
                    a.standard_btn              {padding: 5px 6px !important}\
                    .site-message               {width: 736px;}\
                    div.landingPageColumn       {width: 365px;}\
                    .shop-items                 {width: 555px;}\
                    /*.shop-item                {display: inline-block !important; width: 270px;}\
                    .shop-item:nth-child(even)  {margin-left: 10px}*/\
                    .me-page-inventory          {width: 425px}\
                    ul.me-profile-slot-items    {width: 360px}\
                    ul.me-profile-slot-items li {margin: 0 8px 10px 0;}\
                    ul.me-profile-slot-items li.slot-item-empty,\
                    ul.me-profile-slot-items li.slot-item-empty:hover,\
                    ul.me-profile-slot-items li.slot-item-empty:focus {margin: 2px 10px 10px 2px;}\
                    ',true).attach('to',document.head);
                console.log('[mFL] Loaded!');
            }
        }
    };
    mFL.layout.apply();
}

console.log('[mFL] Initializing...');
var scr = document.createElement('script');
scr.appendChild(document.createTextNode('(' + main + ')()'));
(document.head || document.body || document.documentElement).appendChild(scr);