// ==UserScript==
// @name        Fix Twitter Layout
// @namespace   halcyon1234
// @description fix twitter layout. Move the post box back to left side. Put titlebar inside timeline.
// @include     https://twitter.com/
// @include     https://twitter.com/search
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6290/Fix%20Twitter%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/6290/Fix%20Twitter%20Layout.meta.js
// ==/UserScript==

function embed()
{
    if (typeof($) == "function")
    {
        $(document).ready(function()
        {
            $(".topbar.js-topbar").prependTo(".content-header");
            $(".content-header").removeClass("visuallyhidden");
            $(".timeline-tweet-box").appendTo(".DashboardProfileCard-content");
            $(".top-timeline-tweet-box-user-image").hide();
        });
    }
    else
    {
        setTimeout(embed, 400);
    }

}

var inject = document.createElement("script");

inject.setAttribute("type", "text/javascript");
inject.appendChild(document.createTextNode("(" + embed + ")()"));

document.body.appendChild(inject);