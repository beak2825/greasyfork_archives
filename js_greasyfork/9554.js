// ==UserScript==
// @name           Search for TV episodes on TV Calendar at Binsearch and torrent sites
// @namespace      http://world3.net
// @description    Adds 'search' links to every episode
// @include        http://www.pogdesign.co.uk/cat/*
// @grant       none
// @version 0.0.1.20160807153049
// @downloadURL https://update.greasyfork.org/scripts/9554/Search%20for%20TV%20episodes%20on%20TV%20Calendar%20at%20Binsearch%20and%20torrent%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/9554/Search%20for%20TV%20episodes%20on%20TV%20Calendar%20at%20Binsearch%20and%20torrent%20sites.meta.js
// ==/UserScript==
/* */

var allSpans;
var lastName;
var loops;

//allSpans = document.getElementsByClassName('seasep');
allSpans=document.getElementsByTagName('a');

function padZeros(theNumber, max) { var numStr = String(theNumber); while ( numStr.length < max) { numStr = '0' + numStr; } return numStr; }

for (var i = 0; i < allSpans.length; i++ )
{
    if(/s\d\de\d\d/.test(allSpans[i].text))
	{
		newline = document.createElement('br');
        newline2 = document.createElement('br');
		gap = document.createElement('span');
		gap.setAttribute('class', 'seasep');
		gap.innerHTML = ' / ';
		gap.style.display = 'inline';
		gap2 = document.createElement('span');
		gap2.setAttribute('class', 'seasep');
		gap2.innerHTML = ' / ';
		gap2.style.display = 'inline';
		gap3 = document.createElement('span');
		gap3.setAttribute('class', 'seasep');
		gap3.innerHTML = ' / ';
		gap3.style.display = 'inline';
        gap4 = document.createElement('span');
		gap4.setAttribute('class', 'seasep');
		gap4.innerHTML = ' / ';
		gap4.style.display = 'inline';
        gap5 = document.createElement('span');
		gap5.setAttribute('class', 'seasep');
		gap5.innerHTML = ' / ';
		gap5.style.display = 'inline';
        gap6 = document.createElement('span');
		gap6.setAttribute('class', 'seasep');
		gap6.innerHTML = ' / ';
		gap6.style.display = 'inline';
        res = document.createElement('span');
        res.style.display = 'inline';
        res.innerHTML = '720p: ';

		var ep = allSpans[i].textContent.match(/s\d\de\d\d/);

		search = document.createElement('a');
		search.style.color = 'lightblue';
		search.style.textDecoration = 'underline';
		search.style.display = 'inline';
		search.appendChild( document.createTextNode('(BS)') );
		search.setAttribute('href', 'http://binsearch.net/index.php?q=' + lastName + ' ' + ep + ' 720p'+ '&max=100&adv_age=120');

		search3 = document.createElement('a');
		search3.style.color = 'lightblue';
		search3.style.textDecoration = 'underline';
		search3.style.display = 'inline';
		search3.appendChild( document.createTextNode('(13)') );
		search3.setAttribute('href', 'http://1337x.to/search/' + lastName + ' ' + ep + ' 720p/1/');
        
		search4 = document.createElement('a');
		search4.style.color = 'lightblue';
		search4.style.textDecoration = 'underline';
		search4.style.display = 'inline';
		search4.appendChild( document.createTextNode('(Bit)') );
        search4.setAttribute('href', 'https://bitsnoop.com/search/all/' + lastName + ' ' + ep + ' 1080p'+ '/c/d/1/');

		search5 = document.createElement('a');
		search5.style.color = 'lightblue';
		search5.style.textDecoration = 'underline';
		search5.style.display = 'inline';
		search5.appendChild( document.createTextNode('(ET)') );
		search5.setAttribute('href', 'http://extratorrent.cc/search/?search=' + lastName + ' ' + ep + ' 720p'+ '&new=1&x=0&y=0');

		res.appendChild( search );
		res.appendChild( document.createTextNode('/') );
		res.appendChild( search3 );
		res.appendChild( document.createTextNode('/') );
		res.appendChild( search4 );
		res.appendChild( document.createTextNode('/') );
		res.appendChild( search5 );
        
        allSpans[i].parentNode.appendChild( newline );
        allSpans[i].parentNode.appendChild( newline );
        allSpans[i].parentNode.appendChild( res );

        res = document.createElement('span');
        res.style.display = 'inline';
        res.innerHTML = '1080p: ';

   		search = document.createElement('a');
		search.style.color = 'lightblue';
		search.style.textDecoration = 'underline';
		search.style.display = 'inline';
		search.appendChild( document.createTextNode('(BS)') );
        search.setAttribute('href', 'http://binsearch.net/index.php?q=' + lastName + ' ' + ep + ' 1080p'+ '&max=100&adv_age=120');

		search3 = document.createElement('a');
		search3.style.color = 'lightblue';
		search3.style.textDecoration = 'underline';
		search3.style.display = 'inline';
		search3.appendChild( document.createTextNode('(13)') );
		search3.setAttribute('href', 'http://1337x.to/search/' + lastName + ' ' + ep + ' 1080p/1/');

		search4 = document.createElement('a');
		search4.style.color = 'lightblue';
		search4.style.textDecoration = 'underline';
		search4.style.display = 'inline';
		search4.appendChild( document.createTextNode('(Bit)') );
		search4.setAttribute('href', 'https://bitsnoop.com/search/all/' + lastName + ' ' + ep + ' 1080p'+ '/c/d/1/');

		search5 = document.createElement('a');
		search5.style.color = 'lightblue';
		search5.style.textDecoration = 'underline';
		search5.style.display = 'inline';
		search5.appendChild( document.createTextNode('(ET)') );
		search5.setAttribute('href', 'http://extratorrent.cc/search/?search=' + lastName + ' ' + ep + ' 1080p'+ '&new=1&x=0&y=0');

		res.appendChild( search );
		res.appendChild( document.createTextNode('/') );
		res.appendChild( search3 );
		res.appendChild( document.createTextNode('/') );
		res.appendChild( search4 );
		res.appendChild( document.createTextNode('/') );
		res.appendChild( search5 );
        
//        allSpans[i].parentNode.appendChild( newline );
        allSpans[i].parentNode.appendChild( res );
	}
	else
	{
		// Get the program name from previous-previous element
		//prev = allSpans[i].previousSibling;
		//lastName = prev.previousSibling.text;
        lastName = allSpans[i].text;
		//lastName="test";
        lastName = lastName.replace('\'', '');
        lastName = lastName.replace('/', ' ');
        lastName = lastName.replace('+', ' ');
        lastName = lastName.replace('-', ' ');
        lastName = lastName.replace(':', ' ');
        lastName = lastName.replace('!', ' ');
        lastName = lastName.replace('(', ' ');
        lastName = lastName.replace(')', ' ');
        lastName = lastName.replace(/\s\s+/g, ' ');    // strip multiple spaces
	}
}
