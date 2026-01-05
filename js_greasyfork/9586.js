// ==UserScript==
// @name        lolskill.net : link to others platforms
// @namespace   hideonScript
// @author      Tegomass
// @description Add a direct link the targeted player on op.gg and lolking.net
// @include     http://www.lolskill.net/top*
// @include     http://www.lolskill.net/champion/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @version     1.0
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9586/lolskillnet%20%3A%20link%20to%20others%20platforms.user.js
// @updateURL https://update.greasyfork.org/scripts/9586/lolskillnet%20%3A%20link%20to%20others%20platforms.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a major design change introduced in GM 1.0,
    It restores the sandbox.
*/

$('th.tooltip:contains("LSS")').after('<th id="outLink">Links</th>');
$('#championsTable').find('tr').find('td:eq(5)').after('<td class="outLink" />');
$('#championsTable').find('tr').each(function() {
	var server = $(this).find('.realm.tooltip').text().toLowerCase();
	var serverTruncated = (server == 'kr') ? 'www' : server;
	var opgg = '<a href="http://' + serverTruncated + '.op.gg/summoner/userName=' + $(this).find('.summoner.left').text() + '">op.gg</a>';
	var lolking = '<a href="http://www.lolking.net/search?name=' + $(this).find('.summoner.left').text() + '">lolking</a>';
	$(this).find('.outLink').html(opgg + lolking)
	$('.outLink').css({fontSize: '10px'});
	$('.outLink a').css({display: 'inline-block'});
});