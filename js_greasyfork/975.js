// ==UserScript==
// @name           GameFAQs main nav recombobulator
// @description    Takes the console list in the header and remakes it with your own chosen list of consoles.
// @author         King of Cats
// @namespace      Cats
// @version        3
// @grant          none
// @include        http://www.gamefaqs.com/*
// @downloadURL https://update.greasyfork.org/scripts/975/GameFAQs%20main%20nav%20recombobulator.user.js
// @updateURL https://update.greasyfork.org/scripts/975/GameFAQs%20main%20nav%20recombobulator.meta.js
// ==/UserScript==

// Feel free to make changes and redistribute as long as you make it known you're distributing an edited version of this script.

var systemsNav = document.evaluate('//nav[@class="masthead_systems"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var mainNav = document.evaluate('//div[contains(@class,"masthead_nav")]/nav', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

if  (systemsNav !== null) {

	/* Default values as an example */
	//var newNamesHeader = ["3DS","DS","iOS","PC","PS3","PS4","PSP","Vita","Wii U","Xbox 360","Xbox One"];
	//var newLinksHeader = ["3ds","ds","iphone","pc","ps3","ps4","psp","vita","wii-u","xbox360","xboxone"];
	//var newNamesDropdown = ["Android","Ouya","Arcade","PlayStation","Dreamcast","PlayStation 2","Game Boy Advance","Saturn","GameCube","Super Nintendo","Genesis","Wii","NES","Xbox","Nintendo 64","And 96 More..."]
	//var newLinksDropdown = ["android","ouya","arcade","ps","dreamcast","ps2","gba","saturn","gamecube","snes","genesis","wii","nes","xbox","n64","systems.html"]
	//var newNamesMainNav = ["Answers","Boards","Contribute","Features","Users","What's New"];
	//var newLinksMainNav = ["features/qna/index.php","boards","contribute/","features/","users/","new/"];
	//var newDropdownTitle = "More Systems"
	
	/* Custom entries */
	var newNamesHeader = ["","",""];
	var newLinksHeader = ["","",""];
	var newNamesDropdown = ["","",""];
	var newLinksDropdown = ["","",""];
	var newNamesMainNav = ["","",""];
	var newLinksMainNav = ["","",""];
	var newDropdownTitle = "";
	
	// false, remove dropdown. true, edit dropdown.
	var keepDropdown = true;

	var newAnchorsHeader = new Array();
	var newAnchorsDropdown = new Array();
	var newListItemsDropdown = new Array();
	var newAnchorsMainNav = new Array();
	var moreSystems = document.evaluate('//span[@class="masthead_platform_drop"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	
	var headerLinks = systemsNav.getElementsByTagName("a");
	for (var i = headerLinks.length-1; i >= 0; i--) {
		if (headerLinks[i].parentNode == systemsNav) {
			headerLinks[i].parentNode.removeChild(headerLinks[i]);
		}
	}
	
	for (var i = 0; i < newNamesHeader.length; i++) {
		newAnchorsHeader[i] = document.createElement('a');
		newAnchorsHeader[i].setAttribute('href', '/'+newLinksHeader[i]);
		newAnchorsHeader[i].textContent = newNamesHeader[i];
		systemsNav.insertBefore(newAnchorsHeader[i],moreSystems);
	}
	
	if (keepDropdown) {
		var dropdownContainer = moreSystems.getElementsByTagName("ul")[0];
		var dropdownLinks = moreSystems.getElementsByTagName("li");
		
		moreSystems.getElementsByTagName("a")[0].childNodes[0].textContent = newDropdownTitle+" ";
		
		for (var i = dropdownLinks.length-1; i >= 0; i--) {
			dropdownLinks[i].parentNode.removeChild(dropdownLinks[i]);
		}
		
		for (var i = 0; i < newNamesDropdown.length; i++) {
			newListItemsDropdown[i] = document.createElement('li');
			newListItemsDropdown[i].setAttribute('class', 'masthead_platform_subnav_item');
			newAnchorsDropdown[i] = document.createElement('a');
			newAnchorsDropdown[i].setAttribute('href', '/'+newLinksDropdown[i]);
			newAnchorsDropdown[i].textContent = newNamesDropdown[i];
			dropdownContainer.appendChild(newListItemsDropdown[i]);
			newListItemsDropdown[i].appendChild(newAnchorsDropdown[i]);
		}
	} else {
		moreSystems.parentNode.removeChild(moreSystems);
	}
	
	while (mainNav.firstChild) {
		mainNav.removeChild(mainNav.firstChild);
	}
	
	for (var i = 0; i < newNamesMainNav.length; i++) {
		newAnchorsMainNav[i] = document.createElement('a');
		newAnchorsMainNav[i].setAttribute('href', '/'+newLinksMainNav[i]);
		newAnchorsMainNav[i].textContent = newNamesMainNav[i];
		mainNav.appendChild(newAnchorsMainNav[i]);
	}
	
}