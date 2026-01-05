// ==UserScript==
// @name        TMD comments hider
// @description hide comments of specific users
// @include     *torrentsmd.*/forum*
// @version     1.3
// @require     http://code.jquery.com/jquery-1.10.2.js
// @namespace https://greasyfork.org/users/213
// @downloadURL https://update.greasyfork.org/scripts/5633/TMD%20comments%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/5633/TMD%20comments%20hider.meta.js
// ==/UserScript==

//dacă apar buguri cu funcționarea unor butoane pe pagini, ștergeți rândul cu ”@require” de mai sus 
//iar apoi decomentați rândul următor de mai jos, prin ștergerea celor două slash-uri

//var $ = unsafeWindow.jQuery;

jQuery(function($)
{
    var ignoreUser = ['username1', 'username2']; //username here
    $('#forumPosts .forumPostName a[href*="userdetails.php?id"] b').each(function (i, v)
    {
        ($.inArray(v.innerHTML, ignoreUser) + 1) && $(v).closest('.forumPostName').css('background-color', 'rgba(247, 12, 12, 0.16)').next('.main').empty();
    });
});

//pentru a ascunde pe forum și rândul cu autorul comentariului ascuns, înlocuiți mai sus rândul ce începe cu ($.inArray cu acest cod, fără bare
//        ($.inArray(v.innerHTML, ignoreUser) + 1) && $(v).closest('.forumPostName').empty().next('.main').empty();
