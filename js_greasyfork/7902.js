// ==UserScript==
// @name        Autofocus Searchboxes
// @namespace   angrydev
// @description Focus the searchboxes of sites like wikipedia and amazon when visiting a site so you dont have to click it
// @include     *.wikipedia.org/*
// @include     *.amazon.com/*
// @include     *.amazon.co.uk/*
// @include     *.amazon.de/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7902/Autofocus%20Searchboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/7902/Autofocus%20Searchboxes.meta.js
// ==/UserScript==
var ids = [
  'searchInput',
  'twotabsearchtextbox'
];
ids.forEach(function (id) {
  var element = document.getElementById(id);
  if (element) {
    element.focus();
  }
});
