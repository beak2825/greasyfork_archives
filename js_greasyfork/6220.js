// ==UserScript==
// @name       WoWI Addon Tabs
// @namespace  digital-utopia.org
// @version    0.2
// @description  tab control for author addons
// @match      http://www.wowinterface.com/downloads/author*
// @copyright  2014, Digital_Utopia
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/6220/WoWI%20Addon%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/6220/WoWI%20Addon%20Tabs.meta.js
// ==/UserScript==
var $ = unsafeWindow.jQuery;

var addons = $(".box-title:eq(0)").parent();
var comments = $(".box-title:eq(1)").parent();
$(comments).css("visibility","hidden");
handleClick=function(tar)
{
    if($(tar).parent().attr("class")!="current")
    {
     	$(".current").attr("class","nocurr");

        $(tar).parent().attr("class","current");
		if($(tar).attr("id")=="Addons_tab")
        {
            $(comments).css("visibility","hidden");
            $(addons).css("display","block");
        }else{
            $(comments).css("visibility","visible");
            $(addons).css("display","none");
        }
        
        
    }
}
var parent = $("table:eq(1)",".clearfix").parent();
$(".vbmenu_popup",parent).after("<div class='tabwrapper' id='tabwrapper'><div class='boxtablist' style='background-color:#181818;'></div></div>");
$(".boxtablist").append("<li class='current' onclick='handleClick(this.childNodes[0])'><a id='Addons_tab' href='javascript:;' onclick='handleClick(this)'>Addons</a></li>");
$(".boxtablist").append("<li class='nocurr' onclick='handleClick(this.childNodes[0])'><a id='Comments_tab' href='javascript:;' onclick='handleClick(this)'>Comments</a></li>");
$(".tabwrapper").append("<div id='lvert-effect'></div>");
$(".tabwrapper").append("<div id='lhorz-effect'></div>");
$(".tabwrapper").append("<div style='clear:both;'></div>");




