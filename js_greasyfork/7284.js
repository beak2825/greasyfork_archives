// ==UserScript==
// @name Go Pusher
// @description Simplifies pushing the go button the the vend page gaiaonline
// @include http://www.gaiaonline.com/*
// @include http://gaiaonline.com/*
// @version 0.0.1.20150102082143
// @namespace https://greasyfork.org/users/4142
// @downloadURL https://update.greasyfork.org/scripts/7284/Go%20Pusher.user.js
// @updateURL https://update.greasyfork.org/scripts/7284/Go%20Pusher.meta.js
// ==/UserScript==
shortcut.add('z',function() {
document.location='http://www.gaiaonline.com/marketplace/vendsearch/?sortBy=91';
},{
'disable_in_input':true,
});

shortcut.add('x',function() {
document.location='http://www.gaiaonline.com/marketplace/mystore';
},{
'disable_in_input':true,
});

shortcut.add('s',function() {
document.location='http://www.gaiaonline.com/marketplace/mystore/showinventory/DD';
},{
'disable_in_input':true,
});

shortcut.add('e',function() {
document.location='http://www.gaiaonline.com/marketplace/vendsearch/20/?sortBy=91&start=3';
},{
'disable_in_input':true,
});

shortcut.add('d',function() {
document.location='http://www.gaiaonline.com/marketplace/vendsearch/20/?sortBy=91&start=2';
},{
'disable_in_input':true,
});

shortcut.add('c',function() {
document.location='http://www.gaiaonline.com/marketplace/vendsearch/20/?sortBy=91&start=1';
},{
'disable_in_input':true,
});
shortcut.add('a',function() {
document.button='cta-button-sm';
},{
'disable_in_input':true,
});