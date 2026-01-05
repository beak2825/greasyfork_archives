// ==UserScript==
// @include http://www.reddit.com/*
// @include https://www.reddit.com/*
// @include http://*.reddit.com/*
// @include https://*.reddit.com/*
// @exclude *://*/r/unexpectedjihad/*
// @exclude *://google/*
// @exclude *://*/r/*/comments/*
// @name Really Unexpected Jihad
// @author /u/Mooiweer16 and MeLlamoPablo a.k.a. /u/sfcpfc
// @description This extension changes the subreddit name on the fronpage to make it unexpected! And you're now on a list.
// @version 1.1
// @namespace https://github.com/KaasKop97/RUJ
// @downloadURL https://update.greasyfork.org/scripts/9594/Really%20Unexpected%20Jihad.user.js
// @updateURL https://update.greasyfork.org/scripts/9594/Really%20Unexpected%20Jihad.meta.js
// ==/UserScript==

//Get the cookie value, in case it exists.
var subreddit = readCookie('RUJ_subreddit');

if(readCookie('RUJ_v1.1') == null && subreddit != null)//Check if a) the user has not been prompted the 1.1 update dialog yet and b) he isn't a new user (has the cookie)
{
	var newSubreddit = prompt('Hello! RUJ has been updated to v1.1!\n' +
		'Now you can define multiple subreddits instead of one. Each subreddit will be randomly chosen, and displayed instead of unexpectedjihad. With only one subreddit being defined, chances were that you expected the jihad, because you knew which subreddit was replacing unexpectedjihad. Defining multiple subreddits will fix that problem!\n\n' +

		'Write your subreddits separated with commas, and with no spaces\n' +
		'Don\'t include the /r/ tag, please.\n' +
		'i.e: videos,WTF,montageparodies\n\n' +

		'If you don\'t want to change your setting, just click accept.',
		//Default:
		subreddit);

	//If the input is empty, the user clicked "cancel" or the user clicked "accpet", alert him
	if(newSubreddit == '' || newSubreddit == null || newSubreddit == subreddit)
	{
		alert('Okay, we won\'t change anything. The extension will remain the same for you. If you change your mind, delete Reddit\'s cookies to be able to re-enter your setting. Have a nice day!');
	}
	else //save his new setting
	{
		subreddit = newSubreddit;
		createCookie('RUJ_subreddit', subreddit, 7300);
		alert('We\'ve saved your new settings. Have a nice day!');
	}	
}

//Write the 1.1 cookie so that he isn't prompted this dialog again
//We place this outside the curly braces because if a new user is propmpted the welcome dialog, we don't want him to be prompted the 1.1 dialog the next time he opens Reddit, because the new welcome dialog already explains the new additions.
createCookie('RUJ_v1.1', true, 7300);

if(subreddit == null)//Check if the user has the cookie
{
	//If he hasn't, ask him which subreddit he wants to be displayed
	var subreddit = prompt('Hello! Thanks for installing RUJ!\n' +
		'which subreddits would you like to be displayed instead of unexpectedjihad?\n' +
		'Write your subreddits separated with commas, and with no spaces\n' +
		'Each subreddit will be randomly chosen, and displayed instead of unexpectedjihad.\n\n' +

		'Don\'t include the /r/ tag, please.',
		//Default:
		'videos,WTF,montageparodies');

	//Initialize the closing message
	var closing = '';

	//If the input is empty or the user clicked "cancel", set /r/videos by default
	if(subreddit == '' || subreddit == null)
	{
		subreddit = 'videos';
		closing += 'Since you didn\'t specify anything, we\'ve set "videos" as the default subreddit.\n';
	}

	closing += 'If you wish to change this setting, delete Reddit\'s cookies.\n' +
	'Have a nice day!';
	alert(closing);

	//Saves the desired subreddits into a cookie
	createCookie('RUJ_subreddit', subreddit, 7300);
}

//Split the string so that we can randomly chose one sub.
var subsArray = subreddit.split(',');
//The expression for a random sub from the user specified list is subsArray[Math.floor(Math.random()*subsArray.length)]

//Replace unexpectedjihad with the subreddit value
walk(document.body);

//RES Compatibility: if the DOM changes (because of never ending Reddit adding new content), execute walk(); again
//Thanks to http://stackoverflow.com/a/11546242
MutationObserver = window.MutationObserver || window.WebKitMutationObserver; //MutationObserver for Firefox, WebkitMutationObserver for Chrome

var observer = new MutationObserver(function(mutations, observer) {
    walk(document.body);
});

observer.observe(document, {
  subtree: true,
  attributes: true
});

////////////////
// FUNCTIONS: //
////////////////

function walk(node) 
{
	// I stole this function from here:
	// http://is.gd/mwZp7E
	
	var child, next;

	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function handleText(textNode) 
{
	textNode.nodeValue = textNode.nodeValue.replace(/unexpectedjihad/gi, subsArray[Math.floor(Math.random()*subsArray.length)]);
}

//Thanks to http://www.quirksmode.org/js/cookies.html
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}