// ==UserScript==
// @name        E-H Auto Note Favourites
// @description Fills the notes section with the gallery's tags
// @author      Hen Tie
// @homepage    https://hen-tie.tumblr.com/
// @namespace   https://greasyfork.org/en/users/8336
// @include     https://e-hentai.org/gallerypopups.php?gid=*
// @include     https://exhentai.org/gallerypopups.php?gid=*
// @include    	https://e-hentai.org/g/*
// @include    	https://exhentai.org/g/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @icon        https://i.imgur.com/pMMVGRx.png
// @version     4.2
// @downloadURL https://update.greasyfork.org/scripts/8280/E-H%20Auto%20Note%20Favourites.user.js
// @updateURL https://update.greasyfork.org/scripts/8280/E-H%20Auto%20Note%20Favourites.meta.js
// ==/UserScript==

	/*╔═════════════════════╦════════════════════╦════════════════════╗
	  ║ Namespace Reference ║ Namespace Includes ║   Tag Filtering    ║
	  ╠═════════════════════╬════════════════════╬════════════════════╣
	  ║ reclass             ║ On line 50.        ║ On line 52.        ║
	  ║ language            ║ Format:            ║ Format:            ║
	  ║ parody              ║ female + male;     ║ (/tag1|tag2/g, '') ║
	  ║ character           ║                    ║                    ║
	  ║ group               ║                    ║                    ║
	  ║ artist              ║                    ║                    ║
	  ║ male                ║                    ║                    ║
	  ║ female              ║                    ║                    ║
	  ║ misc                ║                    ║                    ║
	  ╚═════════════════════╩════════════════════╩════════════════════╝*/

$("#taglist table td:contains('misc:')").attr('id', 'miscid');
//onclick in popup window
$('input[type="radio"][name="favcat"]').click(function () {
	//navigate to parent window, get all tags, delineate with zero-width spaces
	//this is the on-site order
	var reclass = $('#taglist a[id^="ta_reclass"]', window.opener.document).append('​').text();
	var language = $('#taglist a[id^="ta_language"]', window.opener.document).append('​').text();
	var parody = $('#taglist a[id^="ta_parody"]', window.opener.document).append('​').text();
	var character = $('#taglist a[id^="ta_character"]', window.opener.document).append('​').text();
	var group = $('#taglist td[class=""]+td a[id^="ta_group"]', window.opener.document).append('​').text();
	var artist = $('#taglist a[id^="ta_artist"]', window.opener.document).append('​').text();
	var male = $('#taglist a[id^="ta_male"]', window.opener.document).append('​').text();
	var female = $('#taglist a[id^="ta_female"]', window.opener.document).append('​').text();
	var misc = $('#taglist td#miscid+td a', window.opener.document).append('​').text();
	//set included tag namespaces and their order
	var str = reclass + language + parody + character + group + artist + male + female + misc;
	//set tags to remove
	str = str.replace(/full censorship|mosaic censorship|incomplete|out of order|scanmark|poor grammar/g, '');
	//convert to underscored tag format
	str = str.replace(/ /g, '_');
	//delineate tags with commas
	str = str.replace(/\u200B/g, ', ');
	//prevent double commas
	str = str.replace(/(, )+/g, ', ');
	//remove comma from final tag
	str = str.substr(0, str.length - 2);
	$('textarea').val(str);
});
//erases notes when remove button is clicked
$('div[onclick*="favdel"]').click(function () {
	$('textarea').val('');
});