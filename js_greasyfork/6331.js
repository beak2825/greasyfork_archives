// ==UserScript==
// @name			Easy Report to xadamxk
// @namespace 		xerotic/hfreportingriefing - edited
// @description 	Makes reporting posts/threads to xadamxk easy
// @include  		*hackforums.net/showthread.php*
// @version  		1.1.3
// @downloadURL https://update.greasyfork.org/scripts/6331/Easy%20Report%20to%20xadamxk.user.js
// @updateURL https://update.greasyfork.org/scripts/6331/Easy%20Report%20to%20xadamxk.meta.js
// ==/UserScript==

var navBit = document.getElementsByClassName('navigation')[0];
if(navBit.innerHTML.indexOf('<a href="forumdisplay.php?fid=25">The Lounge</a>') != -1) {
	
	var links = document.getElementsByTagName('a');
	for ( i = 0; i < links.length; i++ ) {
		var element = links[i];
		if( element.href.indexOf( "my_post_key" ) != -1 ) {
			postkey = element.href.split(/my_post_key\=/);
			postkey = postkey[1];
		}
	}	
	
	if(document.body.innerHTML.indexOf("<!-- start: showthread_classic_header -->") != -1) {
		var tds = document.getElementsByTagName('td');
		var authBut = new Array();
		for(var z = 0; z < tds.length; z++) {
			var ele = tds[z];
			if(ele.align == "right") {
				authBut[authBut.length] = ele;
			}
		}
	} else {
		var authBut = document.getElementsByClassName('post_management_buttons');
	}
	
	for(var i = 0; i < authBut.length; i++) {
		var divHold = document.createElement("span");
		var el = authBut[i];
		pid = el.innerHTML.match(/pid\=(\d*)/);
		pid = pid[1];
		var formaction = '<form action="private.php" method="post" name="input" target="_blank" style="display:inline-block;"><input type="hidden" name="action" value="do_send" />';
		var formpmid = '<input type="hidden" name="pmid" value="" />';
		var formdo = '<input type="hidden" name="do" value="" />';
		var formicon = '<input type="hidden" name="icon" value="" />';
		var formmy_post_key = '<input type="hidden" name="my_post_key" value="'+postkey+'" />';
		var formuid = '<input type="hidden" name="uid" value="1306528" />';
		var formto = '<input type="hidden" name="to" id="to" value="xadamxk" />';
		var formsubject = '<input type="hidden" name="subject" value="Quick Report" />';
		var formchecks = '<input type="hidden" name="options[signature]" value="1" /><input type="hidden" name="options[savecopy]" value="1" /><input type="hidden" name="options[readreceipt]" value="1" />';
		var formsend = '<input type="submit" class="bitButton" name="submit" value="Quick Report" tabindex="9" accesskey="s" onclick="return confirm(\'Are you sure that you want to report this post to xadamxk?\');"/>';
		var formmessage = '<input type="hidden" name="message" value="Post: http://www.hackforums.net/showthread.php?pid='+pid+'#pid'+pid+'" />';
		var finalform = formaction+formpmid+formdo+formicon+formmy_post_key+formuid+formto+formsubject+formmessage+formsend+formchecks+'</form>';
		divHold.innerHTML = finalform;
		el.appendChild(divHold);
	}
}