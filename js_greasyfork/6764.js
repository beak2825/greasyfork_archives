// ==UserScript==
// @name        Dadafacer
// @namespace   414c45.net
// @description Enjoy the pleasures of chaotic browsing
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6764/Dadafacer.user.js
// @updateURL https://update.greasyfork.org/scripts/6764/Dadafacer.meta.js
// ==/UserScript==

/*
  Dadafacer
  Copyright (c) 2014 Ale
  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation, version 2.1.
  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
  Lesser General Public License for more details.
  You should have received a copy of the GNU Lesser General
  Public License along with this library; if not, write to the
  Free Software Foundation, Inc., 59 Temple Place, Suite 330,
  Boston, MA 02111-1307 USA
*/

var html     = document.getElementsByTagName('html')[0],
    doc      = document.documentElement,
    body     = html.getElementsByTagName('body')[0],
    elements = document.getElementsByTagName('div'),
    n        = elements.length;

//Setting up angle variations for each DOM element
var angles   = new Array(n);
for(var i = 0; i < n; i++) angles[i] = Math.random() - .5;            

//Dealing with crossbrowsing issues
var vendors = [
  'transform',
  'OTransform',
  'msTransform',
  'MozTransform',
  'WebkitTransform'
];

/**
 *  Define functions
 */

//Explode everything with care
function destroy()
{
   for(var i = 0; i < n; i++)
   {
       if(elements[i].tagName== 'body' || elements[i].tagName== 'ubershit') continue;
       //JQuery's crossbrowsing way of retrieving window's scroll top
       var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
       var a = Math.floor(angles[i] * top);
       for (var v = 0; v < vendors.length; v++)
           elements[i].style[ vendors[v] ] = 'rotate('+a+'deg)';
   }      
}

//Redirect after text selection using 'I'm feeling ducky' option of DuckDuckGo
function redirect()
{
     var txt = window.getSelection().toString();
     if(txt)   window.location.href = "http://duckduckgo.com/?q=" + txt + " !";   
}

//Search a random element in current view
function search()
{
   var index = Math.floor( Math.random() * n );
   var rect  = elements[index].getBoundingClientRect();
   window.scrollTo(rect.left, rect.top);   
}

/**
 *  Add new elements to DOM
 */

//Title 
var title = document.createElement('ubershit');
title.innerHTML = 'Dadafacer';
title.setAttribute('style', 'background: #111; position: fixed; top: 20px; left: 20px; padding: 10px; color: yellow; font-family: monospace; letter-spacing: 2px; font-size: 10px; font-weight: bold; z-index: 101010;');
body.appendChild(title);
//Search button
var button = document.createElement('ubershit');
button.innerHTML = 'Enjoy chaos. Scroll to destroy. Click here to move. Select text to go.';
button.setAttribute('id', 'button');
button.setAttribute('style', 'background: yellow; position: fixed; top: 50px; left: 20px; padding: 10px; color: #111; font-family: monospace; letter-spacing: 2px; font-size: 10px; z-index: 101010;');
body.appendChild(button);


/**
 *  Customize style
 */

//Cursor
html.style.cursor = 'crosshair';


/**
 *  Bind events
 */

window.addEventListener('scroll', destroy, true);
body.addEventListener('mouseup', redirect, true);
button.addEventListener('click', search, true);


