 
// ==UserScript==
// @name            Orchid's Post Helper
// @namespace       Post Helper
// @description     Adds additional phrases that can be used in posts as a symbol for something else. This script is written by xerotic, Mr Kewl, updated by xadamxk
// @include         http://www.hackforums.net/*
// @include         http://hackforums.net/*
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/9718/Orchid%27s%20Post%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/9718/Orchid%27s%20Post%20Helper.meta.js
// ==/UserScript==

function form_submit(event) {
   var form = event ? event.target : this;
   var arTextareas = form.getElementsByTagName('textarea');
   for (var i = arTextareas.length - 1; i >= 0; i--) {
	   var elmTextarea = arTextareas[i];
		//Start making regexes and formatting them....
		//##Template:
		// elmTextarea.value = elmTextarea.value.replace(regex,replace);
		

		elmTextarea.value = elmTextarea.value.replace("<3","&#9829;");
 re = /\[Adware\]/gi;
		elmTextarea.value = elmTextarea.value.replace(re,"[b][color=#FF0000][font=Tahoma][size=large]Adware Removal[/font][/color][/b][/size]\n\n\n\n[color=#00BFFF][u]Adwcleaner[/u][/color]\n[list=1]\n[*]Download [url=http://www.bleepingcomputer.com/download/adwcleaner/][b]Adwcleaner[/b][/url] and save it to your desktop.\n[*]Once Adwcleaner is open press 'scan'\n[*]When the scan is finished press 'clean' which should be on the right hand side of 'scan.'\n[/list]\n\n\n[color=#00BFFF][u]Junkware Removal Tool[/u][/color]\n[list=1]\n[*]Download [url=http://www.bleepingcomputer.com/download/junkware-removal-tool/][b]Junkware Removal Tool[/b][/url] and save it to your desktop.\n[*]A window will open that looks like CMD, press any key to start a full scan of your PC.\n[*]Let the program run until is creates a log on your desktop. \n[/list]\n\n\n[size=xx-small][color=#FFFFFF]If you need further help PM me.[/color][/size]");

  }

   form._submit();
}

window.addEventListener('submit',form_submit, true);
HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit = form_submit;
