// ==UserScript==
// @name           Youtube Playlists Sorted Alphabetically
// @namespace      http://www.pbworks.net
// @description	   When you click on "+ Add to" (for adding a new video to a playlist) YouTube displays the playlists -by default- in a strange order: beginning with the one selected last. This script arranges your playlists alphabetically, making it easier for you to find the one you are looking for.
// @author         Paolo Brocco
// @homepage       http://www.pbworks.net
// @copyright      2012+, Paolo Brocco (http://www.pbworks.net)
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version        2015.07.09
// @include        http://www.youtube.com/*
// @include        https://www.youtube.com/*
// @uso:script     123272
// @downloadURL https://update.greasyfork.org/scripts/6775/Youtube%20Playlists%20Sorted%20Alphabetically.user.js
// @updateURL https://update.greasyfork.org/scripts/6775/Youtube%20Playlists%20Sorted%20Alphabetically.meta.js
// ==/UserScript==

/*** DOCUMENT READY: triggers (buttons) with added calls to this script functions ***/

document.addEventListener('DOMContentLoaded', function() {
    //here begins everything

    //This is the "Add to" button
    document.querySelector('#watch8-secondary-actions > div.yt-uix-menu.yt-uix-videoactionmenu > button').setAttribute('onclick', ';initSortLists();return false;');
}, false);

/*** INIT FUNCTIONS: logic to decide when to activate the sorting ***/

unsafeWindow.initSortLists = function(){

	//this function checks if the menu is ready (ready I mean: if the ul list has children (li) (youtube populates the list via ajax, then shows it) ):
	//if ready: call sortLists()
	//else: wait for 100 ms
    
    var container = document.querySelector('#addto-list-panel > div.playlists.yt-uix-scroller > ul');

	if(typeof container !== 'undefined' && container != null)
	{
		//unsafeWindow.console.log('the menu is ready!');
		
		if (!container.classList.contains('sorted'))
		{
            var lists = container.querySelectorAll('li');

            if (lists.length > 0) {
                //unsafeWindow.console.log('playlists arrived, sorting them.');
                unsafeWindow.sortLists();
            }
            else {
                setTimeout('initSortLists()', 100);
            }
		}
		else
		{
			//unsafeWindow.console.log('playlists already sorted ;)');
		}
		return false;
	}
	else
	{
		//unsafeWindow.console.log('waiting 100 ms...');
		setTimeout('initSortLists()', 100);
	}
}

/*** SORTING FUNCTIONS ***/

unsafeWindow.sortLists = function(){
	
	//this function does what we want, meaning the sorting of the playlists, alphabetically
	
	//unsafeWindow.console.log('doing the magic!');

    var oldList = document.querySelector('#addto-list-panel > div.playlists.yt-uix-scroller > ul');

    var listParent = oldList.parentNode;

	var plists = [];
	var lTitle, lElement, newList;

    var lists = document.querySelectorAll('#addto-list-panel > div.playlists.yt-uix-scroller > ul li');

    [].forEach.call(lists, function(li) {

        unsafeWindow.console.log('a list');

        lTitle = li.getAttribute('data-item-name');
        lElement = li;

        plists.push(listData(lTitle, li));
    });

	plists.sort(SortByTitle);

    newList = document.createElement('ul');
    newList.setAttribute('role', 'menu');
    newList.setAttribute('tabindex', '0');
    newList.setAttribute('class', 'yt-uix-kbd-nav yt-uix-kbd-nav-list sorted');
	
	for (p in plists)
	{
        newList.appendChild(plists[p].lElement);
	}
	
    listParent.replaceChild(newList, oldList);
}

/*** HELPERS ***/

//This will sort an array
function SortByTitle(a, b){
    var aName = a.title.toLowerCase();
    var bName = b.title.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

//function to populate lists data array
function listData(title, lElement) {
    return {
        title: title,
        lElement: lElement
    }
}
