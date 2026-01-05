// title randomizer
//
// ==UserScript==
// @name          title randomizer
// @description   randomize titles with the ability to exclude ones you don't want showing up
// @include       *127.0.0.1:*/charpane.php*
// @include       *kingdomofloathing.com*/charpane.php*
// @include       *127.0.0.1:*/account_avatar.php*
// @include       *kingdomofloathing.com*/account_avatar.php*
// @version 	  1.3
// @grant		  GM_setValue
// @grant		  GM_getValue
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require 	  https://greasyfork.org/scripts/5233-jquery-cookie-plugin/code/jQuery_Cookie_Plugin.js?version=18550
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/7908/title%20randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/7908/title%20randomizer.meta.js
// ==/UserScript==

$(document).ready(function() {
	playerName = $('a[href="charsheet.php"]:not(:contains("<img"))', window.parent.frames["charpane"].document).text().toLowerCase();
	
	if($('a[href*="charsheet.php"]') && $.cookie('klimtogFirstLogin')!=1 && getValue(playerName)){
		$.cookie('klimtogFirstLogin', 1);
		blockList = getValue(playerName).split(',');
		$.get('account_avatar.php?action=titles&whichtitle='+blockList[Math.floor(Math.random()*blockList.length)]);
	}
	
	if($('a[href*="charsheet.php"]') && getValue(playerName)){
		$('a[href="charsheet.php"]:not(:has(img))').after('<br><a id="shuffle" style="text-decoration:underline;font-size:10px;" href="charpane.php">shuffle title</a>');
		
		$('#shuffle').click(function(){
			$.get('account_avatar.php?action=titles&whichtitle='+blockList[Math.floor(Math.random()*blockList.length)]);
		});
	}
	
	if($('input[name="whichtitle"]')){
		var titleId = "";
		var blockList = [];
		if(getValue(playerName)){
			blockList = getValue(playerName).split(',');
		}
		
		$('input[name="whichtitle"]').each(function(){
			titleId = $(this).attr('value');
			if(titleId!=-69 && titleId!=0){
				if(blockList.indexOf(titleId) > -1){
					checkIt = ' checked';
				} else {
					checkIt = "";	
				}
				$(this).parent().prepend('<input name="blockTitle" type="checkbox" value="'+titleId+'"'+checkIt+' />');
			}
			$(this).parent().css('text-align', 'right');
		});
		
		$('input[name="blockTitle"]').change(function(){
			blockId = $(this).attr('value');
			if($(this).is(":checked")) {
				blockList.push(blockId);
				setValue(playerName, blockList.join(','));
			} else {
				blockList = $.grep(blockList, function(value) {
					return value != blockId;
				});
				setValue(playerName, blockList.join(','));
			}
		});
	}
});

function getValue(player) {
	return GM_getValue(player + '.klimtogTitle');
}

function setValue(player, val) {
	GM_setValue(player + '.klimtogTitle', val);
}