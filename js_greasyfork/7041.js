 
// ==UserScript==
// @name            HackForums Post Helper Custom
// @namespace       HackForums Post Helper Custom
// @description     Adds additional phrases that can be used in posts as a symbol for something else. This script is written by xerotic, Mr Kewl just updated it.
// @include         http://www.hackforums.net/*
// @include         http://hackforums.net/*
// @version         1.6
// @downloadURL https://update.greasyfork.org/scripts/7041/HackForums%20Post%20Helper%20Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/7041/HackForums%20Post%20Helper%20Custom.meta.js
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
 re = /\[Intro\]/gi;
		elmTextarea.value = elmTextarea.value.replace(re,"Welcome to Hack Forums! \n Firstly, Im glad you chose the HF community to be apart of.\n However, there are rules on this site, which can be found [url=http://www.hackforums.net/misc.php?action=help]here[/url].\n This thread is considered an Introduction Thread, which is disallowed: [quote=Hack Forum Rules]16. We dont allow site goals or achievements in signature this includes but not limited to posts, reps, upgrades, and groups memberships.\n This includes Introduction Threads[/quote]\n Don't worry about this, but familiar yourself with the rules.\n See you around mate! :blackhat: \n \n /Closed");
 re = /\[Upgrade\]/gi;
		elmTextarea.value = elmTextarea.value.replace(re,"Congrats on your upgrade! \n However, since you are an upgraded member now, it is about time you familiarize yourself with the rules.\n [help] \n [quote=Hack Forum Rules]16. We dont allow site goals or achievements in signature this includes but not limited to posts, reps, [b]upgrades[/b], and groups memberships.[/quote]\n Enjoy your new features! \n \n /Closed");
 re = /\[iOS\]/gi;
		elmTextarea.value = elmTextarea.value.replace(re,"[url=http://www.hackforums.net/forumdisplay.php?fid=137]iOS & iDevice[/url]");
 re = /\[passcode\]/gi;
		elmTextarea.value = elmTextarea.value.replace(re,"[url=http://www.hackforums.net/showthread.php?tid=3137293&pid=29314584#pid29314584]this post[/url]");
 re = /\[tethered\]/gi;
		elmTextarea.value = elmTextarea.value.replace(re,"[url=http://www.hackforums.net/showthread.php?tid=3137293&pid=29422602#pid29422602]tethered[/url]");
 re = /\[untethered\]/gi;
		elmTextarea.value = elmTextarea.value.replace(re,"[url=http://www.hackforums.net/showthread.php?tid=3137293&pid=29422602#pid29422602]untethered[/url]");
 re = /\[DFU\]/gi;
		elmTextarea.value = elmTextarea.value.replace(re,"[url=http://www.hackforums.net/showthread.php?tid=3137293&pid=29314562#pid29314562]DFU MODE[/url]");
       
  }

   form._submit();
}

window.addEventListener('submit',form_submit, true);
HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit = form_submit;
