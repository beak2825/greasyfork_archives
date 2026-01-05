// ==UserScript==
// @name        Reddit Sub Filter
// @namespace   http://*.reddit.*/r/all*
// @version     1.023
// @grant       none
// @description:en Filter subs from r/all.
// @description Filter subs from r/all.
// @include     https://*.reddit.*/r/all*
// @include     http://*.reddit.*/r/all*
// @downloadURL https://update.greasyfork.org/scripts/7882/Reddit%20Sub%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/7882/Reddit%20Sub%20Filter.meta.js
// ==/UserScript==

// This list based on: https://gist.github.com/kimagure/4490644
// Edit to your Reddit preferences.
horriblesubreddits = [
	'trees',
	'wtf',
//	'politics',
//	'gonewild',
//	'todayilearned',
//	'4chan',
//	'pokemon',
//	'reactiongifs',
//	'fffffffuuuuuuuuuuuu',
//	'atheism',
//	'adviceanimals',
	'firstworldanarchists',
	'ImGoingToHellForThis',
	'TwoXChromosomes',
//	'mildlyinteresting',
//	'nsfw',
	'gentlemanboners',
//	'RealGirls',
	'creepy',
    'The_Donald',
    'cringepics',
    'niceguys',
    'natureismetal',
    'justneckbearthings',
    'lifeprotips',
];

var shitty_subs = document.getElementsByClassName("subreddit");

for (var i = shitty_subs.length - 1; i > -1; i--) {
	var url = shitty_subs[i].href.toLowerCase();

	for (var j = 0; j < horriblesubreddits.length; j++) {
		if (url.indexOf(horriblesubreddits[j].toLowerCase()) != -1) {
			//shitty_subs[i].parentNode.parentNode.parentNode.remove(); // Uncomment this line and comment or remove the next 4 lines to hide the post completely

            /*
            shitty_subs[i].parentNode.parentNode.children[0].children[0].innerHTML = "{CENSORED}";
			shitty_subs[i].parentNode.parentNode.children[0].children[0].style["font-weight"] = "bold";
            shitty_subs[i].parentNode.parentNode.children[0].children[0].href = "";
			shitty_subs[i].parentNode.parentNode.parentNode.children[3].href = "";
            */
            
//            console.log(shitty_subs[i].parentNode.parentNode.children[0].children[0]);
            
            var a = document.createElement('a');
            a.innerHTML = "{CENSORED}";
            a.style["font-weight"] = "bold";
            a.style["color"] = "#551a8b";
            a.href = "";
            
            shitty_subs[i].parentNode.parentNode.children[0].insertBefore(a, shitty_subs[i].parentNode.parentNode.children[0].children[1]);
            shitty_subs[i].parentNode.parentNode.children[0].children[0].remove();
            
            /*
            // Code to fix Reddit restoring the blocked link
            var link = shitty_subs[i].parentNode.parentNode.children[0].children[0];
            var clone = link.cloneNode(true);
            link.parentNode.replaceChild(clone, link);
            */
		}
	}
}