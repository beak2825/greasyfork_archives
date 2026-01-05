// ==UserScript==
// @name        MAL flair to link
// @namespace   zslevi
// @description Transforms all flairs to links on anime related subreddits.
// @include     http://*reddit.com/r/Animesuggest*
// @include     https://*reddit.com/r/Animesuggest*
// @include     http://*reddit.com/r/anime*
// @include     https://*reddit.com/r/anime*
// @include     http://*reddit.com/r/TrueAnime*
// @include     https://*reddit.com/r/TrueAnime*
// @include     http://*reddit.com/r/manga*
// @include     https://*reddit.com/r/manga*
// @include     http://*reddit.com/r/JapaneseAnimation*
// @include     https://*reddit.com/r/JapaneseAnimation*
// @version     1.4.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5650/MAL%20flair%20to%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/5650/MAL%20flair%20to%20link.meta.js
// ==/UserScript==

function modNode(node){
  var url = node.text();  
  node.html('<a style="text-decoration:none;" href="'+url+'">'+url+'</a>');  
}

var selector = "span.flair";

$(selector).each(function(){
  var node = $(this);
  modNode(node);
});

// run the same replacement for Ajax queries
waitForKeyElements (selector, modNode);



/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
	
http://stackoverflow.com/questions/8281441/fire-greasemonkey-script-on-ajax-request/8283815#8283815
https://gist.github.com/BrockA/2625891	

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
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
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
    waitForKeyElements.controlObj   = controlObj;
}