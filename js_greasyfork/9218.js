// ==UserScript==
// @name        zendesk sidebar toggle
// @namespace   http://kah.pw
// @description toggles the ticket left panel in zendesk
// @include     https://*.zendesk.com/agent/*
// @version     2
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9218/zendesk%20sidebar%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/9218/zendesk%20sidebar%20toggle.meta.js
// ==/UserScript==


// original inspiration from
// https://greasyfork.org/en/scripts/7307-reddit-hide-sidebar/code


// wait for jquery, then wait for the nav on the left
// how to wait:
//    - http://joanpiedra.com/jquery/greasemonkey/
//    - https://gist.github.com/BrockA/2625891
(function GM_wait() {
  if (typeof unsafeWindow.jQuery == 'undefined') {
    window.setTimeout(GM_wait, 100);
  } else {
    $ = unsafeWindow.jQuery.noConflict(true);
    waitForKeyElements('#main_navigation', insertButton);
  }
}) ();

// add button to the left nav
function insertButton() {
  $('#main_navigation') .append($('<div/>', {
    html: 'Sidebar',
    id: 'sbToggle'
  }));
  $('#sbToggle') 
    .height(24)
    .width(24)
    .css('margin', '20px 0px 10px 8px')
    .wrap('<a/>')
    .click(function () {
    doToggle()
    });
}

// toggle visibility of left pane and position of ticket pane and footer
function doToggle() {
  $('.ember-view.pane.left.section') .toggle();
  if ($('.ember-view.pane.left.section') .is(':visible')) {
    $('.ember-view.pane.right.section') .css('left', '390px');
    $('footer') .css('left', '390px');
  } 
  else {
    $('.ember-view.pane.right.section') .css('left', '60px');
    $('footer') .css('left', '60px');
  }
}

// via https://github.com/bdotdub/forrst-keyboard-navigation-greasemonkey
var sbkeyNav = function() {
    document.addEventListener("keydown", function(e) {
      // pressed ctrl-alt-b
      if (e.keyCode == 66 && ! e.shiftKey && e.ctrlKey && e.altKey && ! e.metaKey) {
        //console.debug(e.keyCode);
        $('#sbToggle').click()
      }
    }, false);
};


function addJQuery(callback) {
  var script = document.createElement("script");
  var loadCallback = function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  };

  if (typeof($) !== undefined) {
    loadCallback();
  }
  else {
    script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js");
    script.addEventListener('load', function() {
      loadCallback();
    }, false);

    document.body.appendChild(script);
  }
}

addJQuery(sbkeyNav);


/*--- waitForKeyElements(): A utility function, for Greasemonkey scripts,
that detects and handles AJAXed content.
Usage example:
waitForKeyElements (
"div.comments"
, commentCallbackFunction
);
//--- Page-specific function to do what we want when the node is found.
function commentCallbackFunction (jNode) {
jNode.text ("This comment changed by waitForKeyElements().");
}
IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
selectorTxt, /* Required: The jQuery selector string that
specifies the desired element(s).
*/
actionFunction, /* Required: The code to run when elements are
found. It is passed a jNode to the matched
element.
*/
bWaitOnce, /* Optional: If false, will continue to scan for
new elements even after the first match is
found.
*/
iframeSelector /* Optional: If set, identifies the iframe to
search.
*/
) {
var targetNodes, btargetsFound;
 
if (typeof iframeSelector == "undefined")
targetNodes = $(selectorTxt);
else
targetNodes = $(iframeSelector).contents ()
.find (selectorTxt);
 
if (targetNodes && targetNodes.length > 0) {
btargetsFound = true;
/*--- Found target node(s). Go through each and act if they
are new.
*/
targetNodes.each ( function () {
var jThis = $(this);
var alreadyFound = jThis.data ('alreadyFound') || false;
 
if (!alreadyFound) {
//--- Call the payload function.
var cancelFound = actionFunction (jThis);
if (cancelFound)
btargetsFound = false;
else
jThis.data ('alreadyFound', true);
}
} );
}
else {
btargetsFound = false;
}
 
//--- Get the timer-control variable for this selector.
var controlObj = waitForKeyElements.controlObj || {};
var controlKey = selectorTxt.replace (/[^\w]/g, "_");
var timeControl = controlObj [controlKey];
 
//--- Now set or clear the timer as appropriate.
if (btargetsFound && bWaitOnce && timeControl) {
//--- The only condition where we need to clear the timer.
clearInterval (timeControl);
delete controlObj [controlKey]
}
else {
//--- Set a timer, if needed.
if ( ! timeControl) {
timeControl = setInterval ( function () {
waitForKeyElements ( selectorTxt,
actionFunction,
bWaitOnce,
iframeSelector
);
},
300
);
controlObj [controlKey] = timeControl;
}
}
waitForKeyElements.controlObj = controlObj;
} 


