// ==UserScript==
// @name        Favs+Likes
// @namespace   KuruzkaEsPuto
// @description favs y likes
// @include     *://*.taringa.net/mi*
// @include     *://*.poringa.net/mi*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6855/Favs%2BLikes.user.js
// @updateURL https://update.greasyfork.org/scripts/6855/Favs%2BLikes.meta.js
// ==/UserScript==

$('.action-favorite.pointer:not(.done)').click()
$('.action-vote.pointer:not(.done)').click();