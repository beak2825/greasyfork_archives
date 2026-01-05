// ==UserScript==
// @name        GOTA_Container
// @namespace   gota_container
// @description Modifies the container in which the game is hosted (optionally).
// @include     https://games.disruptorbeam.com/gamethrones*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @version     1.2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/7033/GOTA_Container.user.js
// @updateURL https://update.greasyfork.org/scripts/7033/GOTA_Container.meta.js
// ==/UserScript==

// Resolve jQuery conflicts
this.$ = this.jQuery = jQuery.noConflict(true);

// Button HTML definition
var hideHeaderLink = '<a href="#" id="hideHeader">Hide header</a>';
var showGameOnly = '<a href="http://gota-www.disruptorbeam.com/" id="showGameOnly">Show game only</a>&nbsp;';

$(function() {
    try {

        // Append button        
        var $header = $("header.site-header");
        if ($header && $header.length > 0) {
            $header.before(showGameOnly);
            $header.before(hideHeaderLink);
        }

        var $hideLnk = $("#hideHeader");
        if (!$hideLnk && $hideLnk.length == 0) {
            warn("Could not append link button.");
        }

        (function() {
            // Fix iframe visual bugs in FF
            var $iframe = $("#iframe_content iframe");
            if (!$iframe || $iframe.length == 0) {
                return;
            }

            $iframe.css("display", "inline");
            $iframe.css("height", "1000px");
            $iframe.attr("id", "gota_iframe");

            GM_getValue("hideHeader", false)
                ? ($header.show(), $hideLnk.text("Hide header"))
                : ($header.hide(), $hideLnk.text("Show header"));
        })();

        // Attach handler on the buttons
        $("#hideHeader").on('click', function(e) {
            e.preventDefault();

            if (!$header || $header.length == 0) {
                error("Could not locate header.");
                return;
            }

            $header.is(":hidden")
                ? ($header.show(), $hideLnk.text("Hide header"))
                : ($header.hide(), $hideLnk.text("Show header"));

            GM_setValue("hideHeader", $header.is(":hidden"));
        });

        inject(scope.toString());

    } catch (err) {
        error("Error encountered: " + err);
    }
});

function inject(code) {

    var script = document.createElement('script');
    script.type = "text/javascript";
    script.innerHTML = code;
    document.head.appendChild(script);

}

// --> Message handling
function log(message, type) {
    if (console && console.log && typeof (console.log) == "function") {
        if (!type)
            type = "ex-container";

        var prefix = type.toString().toUpperCase() + " <" + new Date().toLocaleTimeString() + "> ";
        console.log(prefix + message);
    }
}

function error(message, type) {
    if (console && console.error && typeof (console.error) == "function") {
        if (!type)
            type = "ex-container";

        var prefix = type.toString().toUpperCase() + " - ERROR <" + new Date().toLocaleTimeString() + "> ";
        console.error(prefix + message);
    }
}

function warn(message, type) {
    if (console && console.warn && typeof (console.warn) == "function") {
        if (!type)
            type = "ex-container";

        var prefix = type.toString().toUpperCase() + " - WARNING <" + new Date().toLocaleTimeString() + "> ";
        console.warn(prefix + message);
    }
}

function scope(data) {
    //console.debug("Attempting to post data to the frame, data: " + data);
    window.frames[0].postMessage(data, "https://gota-www.disruptorbeam.com");
    return data;
}