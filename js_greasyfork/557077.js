// ==UserScript==
// @name         SourceGraph
// @description  SourceGraph button injection on Github
// @namespace    https://gist.github.com/luoling8192/0312f993ce1f59075841b26f3a07d15b
// @version      0.5
// @author       mokeyish, RainbowBird
// @match        https://github.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557077/SourceGraph.user.js
// @updateURL https://update.greasyfork.org/scripts/557077/SourceGraph.meta.js
// ==/UserScript==

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
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

function run() {
    var target = document.querySelector('[data-testid="top-nav-right"]');
    if (target){
        var t = window.location.pathname.split('/');
        var url = window.location.host;
        if (t.length >= 3) {
            var username = t[1];
            var repo = t[2];
            url = `${url}/${username}/${repo}`;
        } else {
            return;
        }
        if (t.length >= 5) {
            var type = t[3];
            var branch = t[4];
            url = `${url}@${branch}/-/${type}`;
        }
        if (t.length >= 6) {
            url = `${url}/${t.slice(5).join('/')}`;
        }
        var html = `
          <a href="https://sourcegraph.com/${url}" target="_blank" aria-label="View repository on Sourcegraph" class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted rgh-seen--20877287924">
            <svg viewBox="0 0 40 40" width="16" height="16" class="action-item__icon--github v-align-text-bottom">
              <g fill="none" fill-rule="evenodd"><path d="M11.5941935,5.12629921 L20.4929032,36.888189 C21.0909677,39.0226772 23.3477419,40.279685 25.5325806,39.6951181 C27.7190323,39.1105512 29.0051613,36.9064567 28.4067742,34.7722835 L19.5064516,3.00944882 C18.9080645,0.875590551 16.6516129,-0.381732283 14.4667742,0.203149606 C12.2822581,0.786771654 10.9958065,2.99149606 11.5941935,5.12598425 L11.5941935,5.12629921 Z" fill="#F96316"></path><path d="M28.0722581,5.00598425 L5.7883871,29.5748031 C4.28516129,31.2314961 4.44225806,33.7647244 6.13741935,35.2327559 C7.83258065,36.7004724 10.4245161,36.5474016 11.9277419,34.8913386 L34.2116129,10.3228346 C35.7148387,8.66614173 35.5577419,6.13385827 33.8625806,4.66551181 C32.1667742,3.19653543 29.5741935,3.34992126 28.0722581,5.00566929 L28.0722581,5.00598425 Z" fill="#B200F8"></path><path d="M2.82258065,18.6204724 L34.6019355,28.8866142 C36.7525806,29.5811024 39.0729032,28.4412598 39.7841935,26.3395276 C40.4970968,24.2381102 39.3293548,21.9716535 37.1777419,21.2762205 L5.39935484,11.0110236 C3.24774194,10.3159055 0.928387097,11.455748 0.216774194,13.5574803 C-0.494193548,15.6588976 0.673548387,17.9259843 2.82322581,18.6204724 L2.82258065,18.6204724 Z" fill="#00B4F2"></path></g>
            </svg>
          </a>`;
        target.insertAdjacentHTML('afterbegin', html);
    }
}

(function() {
    'use strict';
    waitForKeyElements(`[data-testid="top-nav-right"]`, run)
})();