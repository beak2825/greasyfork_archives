// kolreminders
//
// ==UserScript==
// @name          kolreminders
// @description   reminders for things we always forget
// @include       *127.0.0.1:*/fight.php*
// @include       *kingdomofloathing.com*/fight.php*
// @version 	  0.15
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/7894/kolreminders.user.js
// @updateURL https://update.greasyfork.org/scripts/7894/kolreminders.meta.js
// ==/UserScript==

$(document).ready(function() {
	var msg1 = ['hey baby, you should stick this guy for', 'bro, bro, this dude gives', 'i see you \'mirin that', 'give me a break, give me a break, break me off a piece of that', 'stardate 69.420, we found a monster that gives'];
	var msg2 = ['so make sure you grab it', 'you dig it?', 'you feel me, brah?', 'delicious', 'itchy, tasty', 'you sexy person', 'so check yoself before you wreck yoself'];
	whichMsg1 = Math.floor(Math.random() * msg1.length);
	whichMsg2 = Math.floor(Math.random() * msg2.length);
	
	var monsterPhylum = $('img[title^="This monster is"]').attr('title').split(' ').pop();
	reminder="";
	showMsg = false;
	
	if(monsterPhylum=="Bug"){
		reminder=' <span style="color: goldenrod; font-weight: bold;">+25% combat initiative</span>, ';
		showMsg = true;
	} else if(monsterPhylum=="Constellation"){
		reminder=' <span style="color: maroon; font-weight: bold;">+50% meat drops</span>, ';
		showMsg = true;
	} else if(monsterPhylum=="Humanoid"){
		reminder=' <span style="color: maroon; font-weight: bold;">+20% meat drops</span>, ';
		showMsg = true;
	} else if(monsterPhylum=="Weird"){
		reminder=' <span style="color: lightblue">+4 stats per fight</span>, ';
		showMsg = true;
	} else if(monsterPhylum=="Hobo"){
		reminder=' <span style="color: green; font-weight: bold;">+20/20 stench/stench spell damage</span>, ';
	} else if(monsterPhylum=="Demon"){
		reminder=' <span style="color: red; font-weight: bold;">+20/20 hot/hot spell damage</span>, ';
		showMsg = true;
	} else if(monsterPhylum=="Slime"){
		reminder=' <span style="color: purple; font-weight: bold;">+20/20 sleaze/sleaze spell damage</span>, ';
		showMsg = true;
	} else if(monsterPhylum=="Plant"){
		reminder=' <span style="color: blue; font-weight: bold;">+20/20 cold/cold spell damage</span>, ';
		showMsg = true;
	} else if(monsterPhylum=="Undead"){
		reminder=' <span style="color: grey; font-weight: bold;">+20/20 spooky/spooky spell damage</span>, ';
		showMsg = true;
	}
	
	if(showMsg){
		$('#monsterpic').parent().parent().parent().prepend('<tr id="kolminders"><td colspan="3">'+msg1[whichMsg1]+reminder+msg2[whichMsg2]+'</td></tr>');
	}
});