// ==UserScript==
// @name        Renaming Torrents [KAT][Mod]
// @namespace   PXgamer
// @description Adds torrent rename button to search listings
// @include     *kickass.to/user/*/uploads/*
// @include     *kat.cr/user/*/uploads/*
// @include     *kickass.to/usearch/*/*
// @include     *kat.cr/usearch/*/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9963/Renaming%20Torrents%20%5BKAT%5D%5BMod%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/9963/Renaming%20Torrents%20%5BKAT%5D%5BMod%5D.meta.js
// ==/UserScript==
 
var moving = 0;
    
$('.data tr:first').prepend('<th></th>');//('colspan', '2');
$('.data').before('<style>.btnLoading {width:16px;height:16px;background:url(\'http://kastatic.com/images/indicator.gif\');display:block;}.ka-accept.greyButton {background: linear-gradient(to bottom, #929292 0%, #777 100%) repeat scroll 0% 0% transparent !important;text-shadow: 0px 1px 0px #6E6E6E !important;border-radius: 3px;}</style>')

$('.data tr:not(.firstr)').each(function() {
  var title = $('.cellMainLink', $(this)).text();
  var hash = $('[href^="/torrents/edit/"]', $(this)).attr('href').split('/')[3];
  var txt = removeURLs(title).replace(/\"/, '&quot;');
  $(this).prepend('<td>'+(title!=txt ? '<i class="inlineTitleChange ka ka16 ka-edit" torhash="'+hash+'" title="'+txt+'"></i>' : '')+'</td>');
});

function removeURLs(txt) {
  txt = txt.replace(/http*s*:*\/*\/*\s*www*\.*/i, '');
  txt = txt.replace(/www\.*\s*/i, '');
  txt = txt.replace(/http(s*):\/\//i, '');
  txt = txt.replace(/(\s|\.)com\b/i, '');
  txt = txt.replace(/(\s|\.)net\b/i, '');
  txt = txt.replace(/(\s|\.)org\b/i, '');
  txt = txt.replace(/(\s|\.)info\b/i, '');
  txt = txt.replace(/\s*\.*co\s*\.*uk\b/i, '');
  txt = txt.replace(/\s*\.*me\s*\.*uk\b/i, '');
  txt = txt.replace(/(PDVDRip)/gi, 'CAM');
  txt = txt.replace(/(Pre-DVDRip)/gi, 'CAM');
  txt = txt.replace(/(PreDVDRip)/gi, 'CAM');
  txt = txt.replace(/(PDVD)/gi, 'CAM');
  txt = txt.replace(/(PDVD\-Rip)/gi, 'CAM');
  txt = txt.replace(/(PDVDScr)/gi, 'CAM');
  txt = txt.replace(/(PreDVD)/gi, 'CAM');
  return txt;
}

$(document).delegate('.inlineTitleChange', 'click', function() {
  if (moving < 1) {
    moving++;
    var elem = $(this).closest('td');
    var txt = $('.cellMainLink', elem.closest('tr')).text();
    txt = removeURLs(txt).replace(/&quot;/, '\"');
    $.ajax({
  		type: 'POST',
	  	url: '/torrents/edit_title/'+$(this).attr('torhash')+'/',
	  	data: {element: '', value: txt},
  		beforeSend: function() {
	  		elem.html('<div class="btnLoading"></div>');
  		},success: function(data) {
  			elem.html('<i class="ka ka16 ka-accept greyButton" title="Title Changed"></i>');
        $('.cellMainLink', elem.closest('tr')).html(txt);
        moving--;
  		},error: function() {
  			elem.html('<i class="ka ka-cancel" title="'+xhr.statusText + xhr.responseText+'"></i>');
        moving--;
  		}
  	});
  }
});