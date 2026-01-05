// ==UserScript==
// @name        KAT - Sort Friends
// @namespace   SortFriends
// @version     1.01
// @description Sort friends
// @match     http://kickass.to/user/*/friends/
// @match     https://kickass.to/user/*/friends/
// @downloadURL https://update.greasyfork.org/scripts/8065/KAT%20-%20Sort%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/8065/KAT%20-%20Sort%20Friends.meta.js
// ==/UserScript==

$('<div id="placeholder" style="visibility: hidden;"></div>').insertBefore(".pages");

var next = 2;
var max = $(".pages > a:last").text();
var user = $.trim($(".nickname").contents().get(0).nodeValue);
var html;

function load(page)
{
    if (next <= max)
    {
			$.get("/user/" + user + "/friends/?page=" + page + "&ajax=1", function() 
            {
            })
            .done(function(data) 
            {
                var temp = data.html;
                temp = temp.replace(/.*?;{/, "{");
                html = temp.substring(temp.indexOf('<div class="badge">'),temp.indexOf('<div class="pages botmarg5px floatright">'));
                console.log('Page ' + page + ' successfully loaded');
                $(".overauto").append(html);
            });
        next++;
        load(next);     
    }
	else 
    { 
        $(".overauto").prepend('Filter By Group: <select id="filter" style="margin-right:10px;" disabled><option value="No Filter">No Filter</option><option value="User">User</option><option value="Uploader">Uploader</option><option value="Verified uploader">Verified Uploader</option><option value="Super User">Super User</option><option value="Former Translator">Former Translator</option><option value="Translator">Translator</option><option value="KAT Elite">KAT Elite</option><optgroup label="Moderators"><option value="Torrent Helper">Torrent Helper</option><option value="Torrent Moderator">Torrent Moderator</option><option value="Forum Moderator">Forum Moderator</option><option value="Super Moderator">Super Moderator</option></optgroup><optgroup label="Staff/Admins"><option value="KAT Staff">KAT Staff</option><option value="Site Administrator">Site Administrator</option><option value="Other Admins">Other Admins</option></optgroup></select>Online Only? <input type="checkbox" id="online" disabled></input><br>Username contains: <input type="text" id="nameFilter"></input> <input id="filterNames" type="button" value="Filter"></input><hr>');
        $("#filter").bind("change", function()
		{
            var group = $("#filter").val();
            if (group != "No Filter" && group != "Other Admins")
            {
            	$(".badge").hide();
				$('.badge span[class*="aclColor"]').each(function()
    			{              
                    if ($(this).text().lastIndexOf(group, 0) === 0) 
                    { 
                        $(this).parents(".badge").show();
                    }
                });
            }
            else if (group == "Other Admins")
            {
                $(".badge").hide();
                $(".aclColor_").parents(".badge").show(); // Mr. people
				$('.badge span[class*="aclColor_10"]').each(function()
    			{              
                    if ($(this).text() != "Site Administrator") 
                    { 
                        $(this).parents(".badge").show();
                    }
                });
            }
            else { $(".badge").show(); }
            $(".hidden").removeClass("hidden");
            $("#online").trigger("change");
		});
        $("#online").bind("change", function() 
            {
                if($(this).is(":checked")) 
                { 
                    $(".badgeSiteStatus > .offline:visible").parents(".badge").addClass("hidden");
                    $(".badgeSiteStatus > .offline:visible").parents(".badge").hide(); 
                }
                else
                {
                    $(".hidden").show();
                    $(".hidden").removeClass("hidden");
                }
            });
        $("#filterNames").bind("click", function() 
            {
                $(".hidden2").show();
                $(".hidden2").removeClass("hidden2");
                $(".badgeUsernamejs:visible").each(function()
                {
                    if ($(this).children("a").text().indexOf($("#nameFilter").val()) == -1)
                    {
                    	$(this).parents(".badge").addClass("hidden2");
                        $(this).parents(".badge").hide();
                    }  
                });
            });
    alert("Experimental: Please wait until all of the pages have finished loading");
    }
};

load(next);
$('.pages').hide();
window.setTimeout(function()
{
	$("#filter").enable();
    $("#online").enable();
}, 5000);