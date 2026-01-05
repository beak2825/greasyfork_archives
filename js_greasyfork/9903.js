// ==UserScript==
// @name        Work from Reported [KAT] [MOD]
// @namespace   PXgamer
// @description Adds the work button in the report list
// @include     *kat.cr/moderator/reported/
// @include     *kat.cr/moderator/reported/torrents/
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9903/Work%20from%20Reported%20%5BKAT%5D%20%5BMOD%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/9903/Work%20from%20Reported%20%5BKAT%5D%20%5BMOD%5D.meta.js
// ==/UserScript==
 

$(window).load( function() {
  $('.data').before("<script>function processTorrent(action, id) {	var btn = $('.processTorrent_'+id);	if (action=='process'||action=='stopprocess') {		$.ajax({			 			type: 'POST',			url: '/moderator/'+action+'/torrent/?id='+id,			data: 'return_uri=',			beforeSend: function() {				btn.addClass('disabledButton')			},success: function(data) {				btn.removeClass('disabledButton').attr('onclick', 'processTorrent('+(action=='process'?\"'stopprocess'\":\"'process'\")+', '+id+')').attr('title', action=='process'?'Mark finished':'Place in work');				if (action=='process') {					btn.find('i').addClass('ka-red').removeClass('ka-green');					btn.closest('tr').find('td:nth-last-child(2)').html('<a title=\"In process by '+$('.usernameProfile').text()+'\" class=\"ilock icon16\"><span></span></a>');				}else {					btn.find('i').addClass('ka-green').removeClass('ka-red');					btn.closest('tr').find('.ilock').remove();				}			},error: function() {				alert('Something went wrong');			}		});	}}</script>");
  $('.data tr:not(.firstr)').each( function() {
    var link = $(this).find('.cellMainLink').attr('href');
    link = link.split('').reverse().join('').split('t-')[0].split('').reverse().join('').split('.')[0];
    var inwork = ($(this).find('.ilock').length==1);
    $(this).find('[href^="/moderator/reported/delete/"]').addClass('botmarg5px').after('<br><a title="'+(inwork?'Mark finished':'Place in work')+'" class="processTorrent_'+link+'" onclick="processTorrent('+(inwork?"'stopprocess'":"'process'")+', '+link+')"><i class="ka ka16 ka-settings '+(inwork?'ka-red':'ka-green')+'"></i></a>');
  });
});