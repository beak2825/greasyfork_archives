// ==UserScript==
// @name        Fimfiction - Banner Alert!
// @namespace   arcum42
// @include     http*://*fimfiction.net/group*
// @version     0.2
// @description Tells you if a banner needs updating.
// @downloadURL https://update.greasyfork.org/scripts/9816/Fimfiction%20-%20Banner%20Alert%21.user.js
// @updateURL https://update.greasyfork.org/scripts/9816/Fimfiction%20-%20Banner%20Alert%21.meta.js
// ==/UserScript==

$(".banner_overlay").each(function() {
    var image_source = $(this).css("background-image");
    image_source = image_source.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
    
    if (image_source.indexOf("fimfiction.net") == -1)
        {
            $(".group_name").after(' <a href="' + image_source + '">(External Banner!)</a>');
        }
});