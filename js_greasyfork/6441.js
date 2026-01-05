// Skill Dropdown Prettifier
//
// ==UserScript==
// @name          Skill Dropdown Prettifier
// @description   Makes the dropdown skills page more readable.
// @include       *127.0.0.1:*/skillz.php*
// @include       *kingdomofloathing.com*/skillz.php*
// @version 	  0.2
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/6441/Skill%20Dropdown%20Prettifier.user.js
// @updateURL https://update.greasyfork.org/scripts/6441/Skill%20Dropdown%20Prettifier.meta.js
// ==/UserScript==

var option = 1; // 1 condenses all categories into a dropdown box.
				// 2 adds line breaks between each category.
				// 3 condenses all categories into links.

$(document).ready(function() {
						   
	$('div.cat').siblings('div[style="clear: both; height: 10px"]:not(:last-child)').remove();
	
	if(option===1){ // Dropdown Box Of Categories
	
		$('div.cat').hide();
		
		var i=0; //ID for the .cat divs
		var selectOptions = ''; //Filled out with div.title text() and option tags
		var selectedOption = ''; //Stores the value for the newly created categories dropdown
		
		$('div.cat').each(function(){
			$(this).attr('id','cat'+i);
			selectOptions += '<option>' + $(this).children('div.title').text().substring(0,$(this).children('div.title').text().length - 1) + '</option>';
			i++;
		});
		
		var catSelect = '<div id="catselect" style="margin-bottom: 14px;">Select Category: <select name="catselect"><option value="0">--Category--</option>' + selectOptions + '</select></div>';
		
		$('#cat0').parent().prepend(catSelect);
		
		$('select[name="catselect"]').change(function(){
			selectedOption = $(this).find('option:selected').text();
			//alert(selectedOption);
			$('div.title').parent('div.cat').hide();
			$('div.title:contains('+selectedOption+')').parent('div.cat').show();
		});
		
	} else if(option===2){ // End Option 1
	
		$('div.cat').css({'margin-bottom' : '6px', 'border-bottom' : 'solid 2px black', 'padding-bottom' : '6px'});
		
	} else if(option===3){ // End Option 2
	
		$('div.cat').hide();
		
		var i=0; //ID for the .cat divs
		var j=0; //Variable for adding line breaks between links
		var selectOptions = ''; //Filled out with div.title text() anchor tags
		var selectedOption = ''; //Stores the rel for the newly created anchors
		
		$('div.cat').each(function(){
			$(this).attr('id','cat'+i);
			selectOptions += '<a href="#" rel="catselect">' + $(this).children('div.title').text().substring(0,$(this).children('div.title').text().length - 1) + '</a>&nbsp;&nbsp;';
			i++;
			if(j===5){
				selectOptions+='<br />';
				j=0;
			}
			j++;
		});
		
		var catSelect = '<div id="catselect" style="margin-bottom: 14px; font-size: 14px; text-align: center;">' + selectOptions + '</select></div>';
		
		$('#cat0').parent().prepend(catSelect);
		
		$('a[rel="catselect"]').click(function(){
			selectedOption = $(this).text();
			//alert(selectedOption);
			$('div.title').parent('div.cat').hide();
			$('div.title:contains('+selectedOption+')').parent('div.cat').show();
			return false;
		});
		
	}
});