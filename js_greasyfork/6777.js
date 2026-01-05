// ==UserScript==
// @name Trello - minimize lists
// @description    Minimize width of lists with toggle button
// @version        1.02
// @author         XcomeX
// @namespace https://trello.com
// @include https://trello.com/b/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/6777/Trello%20-%20minimize%20lists.user.js
// @updateURL https://update.greasyfork.org/scripts/6777/Trello%20-%20minimize%20lists.meta.js
// ==/UserScript==

// --- USER SETTINGS ---
var defaultmMinimizedLists = new Array(1, 2, 3);
var minimizeWidth = "100px";


// ------------------------------------------------------------------------------------------
var triggerMargin = '18px';
var triggerIconOpen = '';
var triggerIconClose = '';

addLoadEvent(function(){  
  // ADD MENU BUTTONS
    var toggleTrigger = document.createElement('a');
    toggleTrigger.appendChild(document.createTextNode('Toggle size of lists |'));
    toggleTrigger.setAttribute('href','#');
    toggleTrigger.classList.add('board-header-btn');
    toggleTrigger.setAttribute('style', 'padding-left: 3px; padding-right: 0px;');
    toggleTrigger.addEventListener('click', toggleAllOnClick);

    var minimizeTrigger = document.createElement('a');
    minimizeTrigger.appendChild(document.createTextNode('minimize |'));
    minimizeTrigger.setAttribute('href','#');
    minimizeTrigger.classList.add('board-header-btn');
    minimizeTrigger.setAttribute('style', 'padding-left: 0px; padding-right: 0px;');
    minimizeTrigger.addEventListener('click', minimizeAllOnClick);  
    
    var maximizeTrigger = document.createElement('a');
    maximizeTrigger.appendChild(document.createTextNode('maximize |'));
    maximizeTrigger.setAttribute('href','#');
    maximizeTrigger.classList.add('board-header-btn');
    maximizeTrigger.setAttribute('style', 'padding-left: 0px; padding-right: 0px;');
    maximizeTrigger.addEventListener('click', maximizeAllOnClick);
  
    var defaultTrigger = document.createElement('a');
    defaultTrigger.appendChild(document.createTextNode('default |'));
    defaultTrigger.setAttribute('href','#');
    defaultTrigger.classList.add('board-header-btn');
    defaultTrigger.setAttribute('style', 'padding-left: 0px; padding-right: 0px;');
    defaultTrigger.addEventListener('click', defaultOnClick);

    var menuButtonsContainer = document.querySelector('.board-header-btns.left');     
    menuButtonsContainer.appendChild(toggleTrigger);
    menuButtonsContainer.appendChild(defaultTrigger);  
    menuButtonsContainer.appendChild(minimizeTrigger);  
    menuButtonsContainer.appendChild(maximizeTrigger);
    

  // ADD TRIGGER BUTTONS
    var listMenuButtons = document.getElementsByClassName("js-open-list-menu");
    for (var i = 0; i < listMenuButtons.length; i++) {      
      // list elements
      var listMenuButton = listMenuButtons[i];
      var listHeader = listMenuButton.parentNode;
      var list = listHeader.parentNode;

      var triggerIcon = triggerIconClose;
      var triggerStyle = "z-index: 2; margin-right: " + triggerMargin + "; margin-top: 0px;";

      // minimize default lists          
      if (!!~defaultmMinimizedLists.indexOf(i+1)) {  
        list.style.maxWidth = minimizeWidth;   
        triggerIcon = triggerIconOpen;
        var triggerStyle = "z-index: 2; margin-right: 0px; margin-top: " + triggerMargin + ";";
      }    

      // minimize button
      var trigger = document.createElement('a');
      var triggerId = "size-trigger-" + i;
      var triggerText = document.createTextNode(triggerIcon); 
      trigger.appendChild(triggerText);
      trigger.setAttribute('id',triggerId);
      trigger.setAttribute('href','#');
      trigger.classList.add('list-header-menu-icon');
      trigger.classList.add('icon-sm');
      trigger.classList.add('dark-hover');
      trigger.classList.add('js-trigger-list-size');      
      trigger.setAttribute('style', triggerStyle);
      trigger.addEventListener('click', toggleOnClick,false);

      // add minimize button to list header
      listHeader.insertBefore(trigger, listMenuButton);
    }
});

// --- EVENTS ---
function toggleOnClick(e) {    
  var triggerElement = e.target;
  toggleSize(triggerElement);
}

function toggleAllOnClick(e) {
  toggleAllSizeWith("all");
}

function minimizeAllOnClick(e) {
  toggleAllSizeWith(triggerIconClose);
}

function maximizeAllOnClick(e) {
  toggleAllSizeWith(triggerIconOpen);
}

function defaultOnClick(e) {
  maximizeAllOnClick(this);
  var triggers = document.getElementsByClassName("js-trigger-list-size");
  for (var i = 0; i < triggers.length; i++) {    
    var trigger = document.getElementById(triggers[i].id);
    if (!!~defaultmMinimizedLists.indexOf(i+1)) {
     toggleSize(trigger); 
    }
  }
}

function toggleAllSizeWith(triggerIcon) {    
  var triggers = document.getElementsByClassName("js-trigger-list-size");
  for (var i = 0; i < triggers.length; i++) {    
    var trigger = document.getElementById(triggers[i].id);
    if (trigger.innerHTML == triggerIcon || "all" == triggerIcon) {
     toggleSize(trigger); 
    }
  }
}

function toggleSize(triggerElement) {    
  var listHeader = triggerElement.parentElement;
  var list = listHeader.parentElement;
  var listWidth = list.style.maxWidth;  

  triggerElement.innerHTML = (triggerElement.innerHTML == triggerIconOpen ? triggerIconClose : triggerIconOpen);
  triggerElement.style.marginRight = (triggerElement.innerHTML == triggerIconOpen ? "0px" : triggerMargin);
  triggerElement.style.marginTop = (triggerElement.innerHTML == triggerIconOpen ? triggerMargin : "0px");
  list.style.maxWidth = (listWidth == '' ? minimizeWidth : '' );;
}


// --- addLoadEvent ---
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}