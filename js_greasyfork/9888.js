// ==UserScript==
// @name YT ChatBox Filter
// @namespace http://www.yt-chatbox-filter.com/script
// @description Block users on youtube chatbox
// @include https://www.youtube.com/watch?v=sw4hmqVPe0E
// @version 0.1
// @downloadURL https://update.greasyfork.org/scripts/9888/YT%20ChatBox%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/9888/YT%20ChatBox%20Filter.meta.js
// ==/UserScript==

var TIMER = 0;

var ID_UL_CHATBOX = "all-comments";
var ID_LIST_BUTTON = "chatbx_blocker_button";
var ID_ACTION_MENU = "yt-uix-menu actions-menu";

var DEBUG_MODE = false;

var BLOCKED_USERS = [];

function initDebugMenu(){
	var a = document.createElement("A");
	var div = document.getElementById("live-comments-controls");
	a.textContent = "Debug";
	a.addEventListener("click", function(){
		var userString = "Users in blocked list\n\n";
		for(x=0;x<BLOCKED_USERS.length;x++){
			userString += BLOCKED_USERS[x] + "\n"
		}
		alert(userString);
	}, true);
	div.appendChild(a);
}

function onAddComment(event){
	chatBoxLI = document.getElementById(ID_UL_CHATBOX).lastChild;
	menuNode = chatBoxLI.getElementsByClassName(ID_ACTION_MENU)[0]
	
	// check to see if onAddComment has not been called before for this list item
	if(menuNode.lastChild.tagName == "DIV"){
		// if function not called before then create filter button for comment
		addLinktoList(menuNode);
		var name = getNameFromListNode(chatBoxLI);
		if(isUserBlocked(name)){
			chatBoxLI.style.display = "none";
		}
	}
}

function isUserBlocked(name){
	var ret = true;
	if(BLOCKED_USERS.indexOf(name) == -1){
		ret = false;
	}
	return ret;
}

function onBlockUserClick(event){
	var li = event.target.parentNode.parentNode;
	var name = getNameFromListNode(li);
	if(!isUserBlocked(name)){
		BLOCKED_USERS.push(name);
		removeUserFromChatbox(li.parentNode);
	}
}

function addLinktoList(listNode){
	var btn = document.createElement("A");
	btn.textContent = "X";
	btn.setAttribute("id", ID_LIST_BUTTON);
	btn.style.color = "#FF0000"
	btn.style.fontWeight = "bold";
	btn.addEventListener("click", onBlockUserClick, true);
	listNode.appendChild(btn);
}

function getNameFromListNode(listNode){
	var spanNode = listNode.getElementsByClassName('author')[0];
	var name = spanNode.textContent.trim();
	return name;
}

function intializeList(cbxUL){
	liNodes = cbxUL.childNodes;
	for(x=0;x<liNodes.length;x++){
		liNode = liNodes[x].getElementsByClassName(ID_ACTION_MENU)[0];
		addLinktoList(liNode);
	}
}

function removeUserFromChatbox(cbxUL){
	for(index in cbxUL.childNodes){
		var liNode = cbxUL.childNodes[index];
		if(isUserBlocked(getNameFromListNode(liNode))){
			liNode.style.display = "none";
		}
	}
}

window.addEventListener("load", function(evt){
	
	// check every 4 seconds to see if chatbox has been created
	TIMER = setInterval(function(){
		
		chatBoxUL = document.getElementById(ID_UL_CHATBOX);
		if(chatBoxUL !== null){
			intializeList(chatBoxUL);
			if(DEBUG_MODE){
				initDebugMenu();
			}
			chatBoxUL.addEventListener("DOMNodeInserted", onAddComment, true);
			window.clearInterval(TIMER);
		}
		
	}, 4000);
}, false);
