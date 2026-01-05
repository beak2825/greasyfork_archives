// ==UserScript==
// @id             dojinup.ktkr.net-fea20226-dbbe-4275-99d3-af9c84c718c0@scriptish
// @name           dojinup.ktkr.net
// @version        1.0
// @namespace      
// @author         vinsai
// @description    test
// @include        http://dojinup.ktkr.net/*
// @run-at         document-end
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6831/dojinupktkrnet.user.js
// @updateURL https://update.greasyfork.org/scripts/6831/dojinupktkrnet.meta.js
// ==/UserScript==
(function () {
    var imgs = $('tbody tr td:nth-child(2) a');
    $(imgs).each(function(index, element) {
        var src = $(this).attr('href');
        $(this).html('<img src="' + src + '" height="600px">');
        $(this).attr("target","_blank");
    });
})();