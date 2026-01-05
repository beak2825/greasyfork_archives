// ==UserScript==
// @name        MAL Status to Episodes Focus
// @namespace   MAL
// @include     *myanimelist.net/panel.php?go=add&selected_series_id=*
// @include     *myanimelist.net/panel.php?go=addmanga&selected_manga_id=*
// @include     *myanimelist.net/editlist.php?type=anime&id=*
// @include     *myanimelist.net/panel.php?go=editmanga&id=*
// @include     *myanimelist.net/anime/*
// @include     *myanimelist.net/manga/*
// @include     *myanimelist.net/anime.php?id=*
// @include     *myanimelist.net/manga.php?id=*
// @description Moves focus to "Episodes Watched" after you selected "Status"
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/8692/MAL%20Status%20to%20Episodes%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/8692/MAL%20Status%20to%20Episodes%20Focus.meta.js
// ==/UserScript==

function xpath(query, object) {
    if(!object) var object = document;
    return document.evaluate(query, object, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

selectStatus = xpath("//select[@id='status'] | //select[@id='myinfo_status']");

episodesWatched = xpath("//input[@id='completedEpsID'] | //input[@id='myinfo_watchedeps'] | //input[@id='chap_read'] | //input[@id='myinfo_chapters']");
episodesWatchedSnap = episodesWatched.snapshotItem(0);

selectStatus.snapshotItem(0).addEventListener('change', function() {
    episodesWatchedSnap.focus();
    episodesWatchedSnap.setSelectionRange(0, episodesWatchedSnap.value.length);
}, false);