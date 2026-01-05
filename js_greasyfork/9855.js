// ==UserScript==
// @name        Ubuntu-it Forum Fixed Header
// @description Script per rendere sempre visibile il menu superiore del forum
// @namespace   forum.ubuntu-it.org/*
// @include     http://forum.ubuntu-it.org/*
// @version     20140513
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9855/Ubuntu-it%20Forum%20Fixed%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/9855/Ubuntu-it%20Forum%20Fixed%20Header.meta.js
// ==/UserScript==

jQuery(document).ready(function(){
  
  jQuery('#fixed-header').css({
    position:'fixed',
    top: '0px',
    width: '100%',
    backgroundColor: 'white',
    boxShadow: '2px 2px 5px #CCC',
    height: '110px',
    zIndex: 9e9
  });
  jQuery('#wrap').css({ marginTop: '120px' });
});