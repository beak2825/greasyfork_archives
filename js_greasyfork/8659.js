// ==UserScript==
// @name        KAT - Show Banner
// @namespace   ShowBanner
// @version     1.03
// @description Displays a footer on KAT
// @match     http://kickass.to/*
// @match     https://kickass.to/*
// @downloadURL https://update.greasyfork.org/scripts/8659/KAT%20-%20Show%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/8659/KAT%20-%20Show%20Banner.meta.js
// ==/UserScript==


$("body").append('<div id="footer" style="position:fixed; bottom:0; left:10%; width:80%; height:25px; background-color:#F3EDD9; z-index:100"><div id="innerBanner" width="100%" height="100%" style="display:none; float:left;"></div><i id="showBanner" style="position:absolute; right:0; top:0; margin-top:3px;" class="ka ka16 ka-arrow2-up"></i></div>');

$("#innerBanner").load("http://gazza-911.allalla.com/bannerInner.php", function()
{
    if ($("#active").val() == "1") $("#showBanner").click();
});

$("#showBanner").on("click", function()
{
    if ($("#showBanner").hasClass("ka-180"))
    {
        $("#footer").animate({height: "25px"}, 400);
        $("#innerBanner").hide();
        $("#showBanner").removeClass("ka-180");
    }
    else
    {    
        $("#footer").animate({height: "100px"}, 400);
        $("#innerBanner").show();
        $("#showBanner").addClass("ka-180");
    }
});