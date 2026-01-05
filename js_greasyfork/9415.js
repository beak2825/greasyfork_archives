// ==UserScript==
// @name           E-H Gallery Image Numbers
// @description    Shows image numbers beneath gallery thumbnails
// @author         Hen-Tie
// @homepage       https://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @include        https://e-hentai.org/g/*
// @include        https://exhentai.org/g/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @icon           https://i.imgur.com/pMMVGRx.png
// @version        2.3
// @downloadURL https://update.greasyfork.org/scripts/9415/E-H%20Gallery%20Image%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/9415/E-H%20Gallery%20Image%20Numbers.meta.js
// ==/UserScript==
$(document).ready(function () {
	$('.gdtl img, .gdtm img').each(function () {
		if ($(this).parent().children('br').length === 1) {
			return false;
		}
		else {
			$(this).after($(this).attr('alt')).after('<br>');
		}
	});
});