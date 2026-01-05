// ==UserScript==
// @name           Old Meta.SE Stars
// @namespace      https://github.com/AstroCB
// @include        *://meta.stackexchange.com/questions/*
// @exclude        *://meta.stackexchange.com/questions/tagged
// @author          Cameron Bernhardt (AstroCB)
// @version        1.0
// @description  Reverts to the old Meta.SE star style
// @downloadURL https://update.greasyfork.org/scripts/8355/Old%20MetaSE%20Stars.user.js
// @updateURL https://update.greasyfork.org/scripts/8355/Old%20MetaSE%20Stars.meta.js
// ==/UserScript==
var newStyle = document.createElement("style");
newStyle.innerText = ".envelope-on, .envelope-off, .vote-up-off, .vote-up-on, .vote-down-off, .vote-down-on, .star-on, .star-off, .comment-up-off, .comment-up-on, .comment-flag, .edited-yes, .feed-icon, .vote-accepted-off, .vote-accepted-on, .vote-accepted-bounty, .badge-earned-check, .delete-tag, .grippie, .expander-arrow-hide, .expander-arrow-show, .expander-arrow-small-hide, .expander-arrow-small-show, .anonymous-gravatar, .badge1, .badge2, .badge3, .gp-share, .fb-share, .twitter-share, #notify-container span.notify-close, .migrated.to, .migrated.from { background-image: url('https://web.archive.org/web/20150221090806/http://meta.stackexchange.com/content/stackexchangemeta/img/sprites.png?v=145e63c0320f'); } .star-on, .star-off { height: 50px; } .votecell .vote-count-post { margin: 5px 0 17px 0;  }";

document.getElementsByTagName("head")[0].appendChild(newStyle);