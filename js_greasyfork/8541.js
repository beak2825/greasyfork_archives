// ==UserScript==
// @name           DZ.com post blocker
// @namespace      greasyfork.org
// @description    Automatically hides posts on DZ.com
// @match          http://www.dropzone.com/cgi-bin/forum/gforum.cgi?*post=*
// @require http://code.jquery.com/jquery-latest.min.js
// @require http://code.jquery.com/ui/1.11.2/jquery-ui.min.js
// @grant none
// @version 0.8
// @downloadURL https://update.greasyfork.org/scripts/8541/DZcom%20post%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/8541/DZcom%20post%20blocker.meta.js
// ==/UserScript==
var sThreadTitle;
currentVisibleThreads = [];
Posts = [];
nShownCount = 0;

$(document).ready(function() {
    //  CheckCloudSync();

    CreateStyles();
    CreateFilter();
    //	CreateControlPanel();
    CreateEventHandlers();

    //  SetOptions();

    UpdateHideLinks();
    UpdatePosts();
});

function CreateStyles()
{
    $("body").append("<link rel='stylesheet' href='//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css'>");

    if (localStorage.getItem("HideLinkStyle") != "HideShow")
        $("body").append(GetRemoveStyle());        
}

function CreateFilter()
{
    $('.dropdown-nav-top:first').parent().append("<select id='ThreadFilter'><option value='Unignored' selected='true'>Block Posts</option><option value='All'>Show All Posts</option></select>&nbsp;");
}

function GetRemoveStyle()
{
    var HideThreadStyle = 'margin-left: -11px;  margin-top: -38px;';
    var HideThreadStyle2 = 'padding-left:10px; margin-left:-45px;  margin-top:-2px;';

    RemoveStyle = '<style id="RemoveStyle">';
    RemoveStyle += '.threadbit > td > a[id^="RemoveThread"]:before {  content: "x";  font-size: 15pt;}';
    RemoveStyle += '.threadbit > td > a[id^="RemoveThread"] {  position: absolute !important;  ' + (navigator.userAgent.search("Chrome") >= 0 ? HideThreadStyle : HideThreadStyle2) + '  font-size: 0pt;  visibility: hidden !important;}';
    RemoveStyle += '.threadbit > td:hover > a[id^="RemoveThread"] {  visibility: visible !important; } ';

    RemoveStyle += '.threadbit > td > a[id^="RemoveUser"]:before {  content: "x";  font-size: 15pt;} ';
    RemoveStyle += '.threadbit > td > a[id^="RemoveUser"] {  position: absolute !important;   padding-left:10px; margin-left:-25px;  margin-top:-2px;   font-size: 0pt;  visibility: hidden !important;} ';
    RemoveStyle += '.threadbit > td:hover > a[id^="RemoveUser"] {  visibility: visible !important; } ';
    RemoveStyle += '</style>';

    return RemoveStyle;
}

function UpdateHideLinks()
{
    $("a[name][name!='last']").each(function( index,value ) { AddHideLink($(this).parent()[0])});
}

function CreateEventHandlers()
{
    $('#ThreadFilter').change(function() 
                              { 
                                  var sThreadFilterVal = $('#ThreadFilter').val();
                                  if (sThreadFilterVal == 'All') 
                                  {
                                      Posts.forEach( function(s) { 
                                          s.Hide = false;
                                      } )
                                  }
                                  UpdateHideLinks(); 
                                  UpdatePosts(); 
                              }); 
    //   $('#OpenFilterCP').click(OpenFilterCP);
    //    $('#AddIgnoredUserButton').click(AddToIgnoredUserList);
    //    $('input[name="HideLinkStyle"]').change(function () { localStorage.setItem('HideLinkStyle', this.value); RemoveHideLinks(); SaveLastUpdate();});
}

function RemoveHideLinks()
{
    $("a[id*='RemoveThread']").remove();
    $("a[id*='RemoveUser']").remove();

    $("#RemoveStyle").remove();

    if (localStorage.getItem("HideLinkStyle") != "HideShow")
        $("body").append(GetRemoveStyle());        
}


function AddHideLink(currentPost)
{

    IgnoredUserList = GetListFromLocalStorage('IgnoredUserList');

    nPost = $(currentPost).find('a[name][name!="last"]')[0];
    nPostID = $(nPost).attr('name');   
    MemberLink = $(currentPost).find('a[href*="?username="]')[0];
    if (MemberLink)
    {
        nUserID = MemberLink.href.replace("http://www.dropzone.com/cgi-bin/forum/gforum.cgi?username=","").replace(";","");

        var bUserIgnored = (containsObject(nUserID,IgnoredUserList) == -1) ? false : true;

        var UserIgnoreText = bUserIgnored ? "Restore User" : "RU"; 
        var ThreadIgnoreText = bUserIgnored ? "Show" : "Hide";

        if ($(currentPost).has("a[id*='HidePost" + nPostID + "']").length === 0)
        {
            var RemoveUserLinks = $('a[id*="RemoveUser' + nUserID + '"]').toArray();

            sUserIDReference = (RemoveUserLinks.length > 0) ? nUserID + RemoveUserLinks.length : nUserID;

            if (localStorage.getItem("HideLinkStyle") == "HideShow")
                $(MemberLink).after("<br /><a id='RemoveUser" + sUserIDReference + "'>" + UserIgnoreText + " User</a>");
            else
                $(MemberLink).before("<a id='RemoveUser" + sUserIDReference + "'>" + UserIgnoreText + " User</a>");

            $('#RemoveUser' + sUserIDReference).click({param1: nUserID, param2: 'IgnoredUserList', param3: UpdatePosts, param4: currentPost}, IgnoreItem); 
            $(nPost).before("<a id='HidePost" + nPostID + "'>" + ThreadIgnoreText + "</a>");

            $('#HidePost' + nPostID).click({param1: nPostID, param2: 'IgnoreList', param3: UpdatePosts, param4: currentPost}, IgnoreItem);

            addItem = {};
            addItem.ID = nPostID;
            addItem.UserID = nUserID;
            addItem.Hide = bUserIgnored;
            addItem.Post = currentPost;
            Posts.push(addItem);

        }
        var postIndex = containsObject(nPostID,Posts);
        var bThreadIgnored = postIndex >= 0 ? Posts[postIndex].Hide : false;

        ThreadIgnoreText = bThreadIgnored ? "Show post from " + nUserID : "Hide";

        $('#HidePost' + nPostID).text(ThreadIgnoreText);
        $('a[id*="RemoveUser' + nUserID +'"').text(UserIgnoreText);
    }
}

function UpdatePosts()
{
    nShownCount = 0;
    $('#ThreadFilter').blur();
    localStorage.setItem('ThreadFilter',document.getElementById("ThreadFilter").value);
    IgnoredUserList = GetListFromLocalStorage('IgnoredUserList');
    currentVisibleThreads = [];
    var sThreadFilterVal = $('#ThreadFilter').val();  
    $("a[name][name!='last']").each(function(index) 
                                    {
                                        nPostID = $(this).attr('name');

                                        sParent = $(this).parent()[0];
                                        sUser = $(sParent).find('a[href*="gforum.cgi?username="]')[0];
                                        sUserID = sUser.href.replace("http://www.dropzone.com/cgi-bin/forum/gforum.cgi?username=","").replace(";","");
                                        var postIndex = containsObject(nPostID,Posts);
                                        var bThreadIgnored = postIndex >= 0 ? Posts[postIndex].Hide : false;
                                        if (bThreadIgnored)
                                            $(this).siblings('table').hide();
                                        else
                                        {
                                            currentVisibleThreads.push(nPostID);
                                            nShownCount++;
                                            $(this).siblings('table').show();
                                        }
                                    });
}     

function IgnoreItem(event) 
{ 
    var nCurrentID = event.data.param1;
    var sList = event.data.param2;

    if (sList == 'IgnoredUserList') 
    {
        addItem = {}
        addItem.ID = nCurrentID;
        CurrentList = GetListFromLocalStorage(sList);
        nFoundIndex = containsObject(nCurrentID,CurrentList);

        if (nFoundIndex == -1) 
            CurrentList.push(addItem); 
        else 
            CurrentList.splice(nFoundIndex,1);
        localStorage.setItem(sList, JSON.stringify(CurrentList));
        Posts.forEach( function(s) { 
            if (s.UserID == nCurrentID) 
            {
                s.Hide = nFoundIndex == -1 ?  true : false;
                AddHideLink(s.Post);
            }
        } )

    }
    else
    {
        Posts.forEach( function(s) { 
            if (s.ID == nCurrentID) 
            {
                s.Hide = !s.Hide;
                AddHideLink(s.Post);
            }
        } )
    }
    if (event.data.param3)
        event.data.param3();



    return 0;
}
function GetListFromLocalStorage(sListName)
{
    return localStorage.getItem(sListName) ? JSON.parse(localStorage.getItem(sListName)) : [];
}

function containsObject(id, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].ID == id) {
            return i;
        }
    }

    return -1;
}
