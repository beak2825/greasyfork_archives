// ==UserScript==
// @name        Draft Ideas
// @namespace   PXgamer
// @description Adds Draft tab to Ideabox
// @include     *kat.cr/ideabox/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9897/Draft%20Ideas.user.js
// @updateURL https://update.greasyfork.org/scripts/9897/Draft%20Ideas.meta.js
// ==/UserScript==

$('.tabNavigation > li:nth-child(8)').after('<li><a class="darkButton" href="/ideabox/draft/"><span>Draft</span></a></li>');