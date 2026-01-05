// ==UserScript==
// @name          Facepunch - Animated avatars on profiles
// @description	  Fixes transparent and animated avatars on profiles and conversations
// @version       1.1
// @namespace     http://horsedrowner.net/
// @include       http://facepunch.com/members/*
// @include       https://facepunch.com/members/*
// @include       http://facepunch.com/member.php*
// @include       https://facepunch.com/member.php*
// @include       http://facepunch.com/converse.php*
// @include       https://facepunch.com/converse.php*
// @include       http://www.facepunch.com/members/*
// @include       https://www.facepunch.com/members/*
// @include       http://www.facepunch.com/member.php*
// @include       https://www.facepunch.com/member.php*
// @include       http://www.facepunch.com/converse.php*
// @include       https://www.facepunch.com/converse.php*
// @downloadURL https://update.greasyfork.org/scripts/7760/Facepunch%20-%20Animated%20avatars%20on%20profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/7760/Facepunch%20-%20Animated%20avatars%20on%20profiles.meta.js
// ==/UserScript==

function unthumbAvatars() {
    var avatarElements = document.getElementsByClassName("avatarlink");
    for (var i = 0; i < avatarElements.length; i++) {
        var img = avatarElements[i].children[0];
        if (img) {
            img.src = img.src.replace('&type=thumb', '');
        }
    }
}

unthumbAvatars();