// ==UserScript==
// @name NeoGAF - Hide Forum Threads Mobile
// @namespace ThreadFilter
// @description Hides threads in Vbulletin boards.
// @require http://code.jquery.com/jquery-latest.min.js
// @require http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js
// @include http://m.neogaf.com/*
// @version 0.2
// @downloadURL https://update.greasyfork.org/scripts/7242/NeoGAF%20-%20Hide%20Forum%20Threads%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/7242/NeoGAF%20-%20Hide%20Forum%20Threads%20Mobile.meta.js
// ==/UserScript==

var sThreadTitle;
nShownCount = 0;
nOriginalPageCount = GetNextPage();
nPageCount = nOriginalPageCount;
nAdditionalThreadCount = 0;

$(document).ready(function() {
    IgnoreList = GetListFromLocalStorage('IgnoreList');
    
    if (IsMobile())
        {
         //$('#jumpToLogIn').after("<div style='display:none;'><select id='ThreadFilter' onchange='UpdateThreads();'><option value='Unignored' selected='true'>Show Unignored Only</option><option value='Ignored'>Show Ignored Only</option><option value='All'>Show All</option></select></div>");
    	 $('#jumpToLogIn').after("<a class='jumpTo' id='ShowUnignored'><span>Show Unignored Only</span></a><a class='jumpTo'  id='ShowIgnored'><span>Show Ignored Only</span></a><a  class='jumpTo'  id='ShowAll'><span>Show All</span></a>");
    	 $('#ShowUnignored').click(function() { localStorage.setItem('ThreadFilter','Unignored'); UpdateThreads();});
    	 $('#ShowIgnored').click(function() { localStorage.setItem('ThreadFilter','Ignored'); UpdateThreads();});
    	 $('#ShowAll').click(function() { localStorage.setItem('ThreadFilter','All'); UpdateThreads();});
            
    	   $(".listItemAnchor").each(function( index ) {
        nThreadID = $(this).attr('href').replace('showthread.php?t=','');
    
	    $(this).attr('id',nThreadID);
      	$(this).parent().on("swiperight",{param1: nThreadID, param2: 'IgnoreList', param3: UpdateThreads},IgnoreItem);
    	$(this).parent().on("swipeleft",{param1: nThreadID, param2: 'IgnoreList', param3: UpdateThreads},IgnoreItem);
        //$(this).parent().on("swiperight",SwipeHandler);
        //$(this).parent().on("swipeleft",SwipeHandler);
        
        //return;
        //$(this).append("<br /><a id='RemoveThread" + nThreadID + "' href=javascript:IgnoreThread('" + nThreadID + "');>" + sIgnoreText + "</a>");
		});
    
    
    	//$('div.listItem').on("swiperight",function (event) { IgnoreThread($(this).find('.listItemAnchor').attr('href').replace('showthread.php?t=',''));});
    	//$('div.listItem').on("swipeleft",function (event) { IgnoreThread($(this).find('.listItemAnchor').attr('href').replace('showthread.php?t=',''));});
    
    	//$('div.listItem').on("swiperight",{param1: $(this).find('.listItemAnchor').attr('href').replace('showthread.php?t=',''), param2: 'IgnoreList', param3: UpdateThreads},IgnoreItem);
    	}
    else
    {
    var sHideThreadStyle = 'margin-left: -11px;  margin-top: -38px;';
    var sHideThreadStyle2 = 'padding-left:10px; margin-left:-45px;  margin-top:-2px;';
    
    var sRemoveStyle = '<style>';
    sRemoveStyle += '.threadbit > td > a[id^="RemoveThread"]:before {  content: "x";  font-size: 15pt;}';
    sRemoveStyle += '.threadbit > td > a[id^="RemoveThread"] {  position: absolute !important;  ' + (navigator.userAgent.search("Chrome") >= 0 ? sHideThreadStyle : sHideThreadStyle2) + '  font-size: 0pt;  visibility: hidden !important;}';
    sRemoveStyle += '.threadbit > td:hover > a[id^="RemoveThread"] {  visibility: visible !important; } ';
    
    sRemoveStyle += '.threadbit > td > a[id^="RemoveUser"]:before {  content: "x";  font-size: 15pt;} ';
    sRemoveStyle += '.threadbit > td > a[id^="RemoveUser"] {  position: absolute !important;   padding-left:10px; margin-left:-25px;  margin-top:-2px;   font-size: 0pt;  visibility: hidden !important;} ';
    sRemoveStyle += '.threadbit > td:hover > a[id^="RemoveUser"] {  visibility: visible !important; } ';
    sRemoveStyle += '</style>';
    
    $("body").append("<link rel='stylesheet' href='//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css'>");
    $("body").append(sRemoveStyle);        
    
  	var sControlPanel = "<div id='tabs' style='display:none;'>";
  	sControlPanel += "<ul>";
  	sControlPanel += "<li><a href='#tabs-1'>Word Filter</a></li>";
    sControlPanel += "<li><a href='#tabs-2'>Ignored Threads</a></li>"; 
    sControlPanel += "<li><a href='#tabs-3'>Ignored Users</a></li>"; 
    sControlPanel += "<li><a href='#tabs-4'>Settings</a></li>";
    sControlPanel += "</ul>";
  	sControlPanel += "<div id='tabs-1'>";
    sControlPanel += CreateWordFilter();
    sControlPanel += "</div>";
    sControlPanel += "<div id='tabs-2'>";
    sControlPanel += "<div id='RecentlyIgnoredListing'></div>";
    sControlPanel += "</div>";
    sControlPanel += "<div id='tabs-3'>";
    sControlPanel += CreateIgnoredUserTab();
    sControlPanel += "</div>";
  	sControlPanel += "<div id='tabs-4'>";
    sControlPanel += CreateSettingsOptions();
    sControlPanel += "</div>";
	sControlPanel += "</div>";

    $('.large-button:first').parent().append("<select id='ThreadFilter'><option value='Unignored' selected='true'>Show Unignored Only</option><option value='Ignored'>Show Ignored Only</option><option value='All'>Show All</option></select>&nbsp;");
	$('.large-button:first').parent().append(sControlPanel);
    $('.large-button:first').parent().append($('<a id="OpenFilterCP" class="large-button submit">Filter CP</a>'));

	    $('#ThreadFilter').change(UpdateThreads); 
    $('#OpenFilterCP').click(OpenFilterCP);
	$('#AddWordButton').click(AddToWordFilter);
    $('#AddIgnoredUserButton').click(AddToIgnoredUserList);
    $('#SearchAdditional').change(function() { localStorage.setItem('SearchAdditional', this.checked); }); 
	
	$("td[id*='td_threadstatusicon_']").each(function( index,value ) { AddHideLink(this);});

    document.getElementById("ThreadFilter").value = CheckThreadFilterValue(localStorage.getItem("ThreadFilter"));
    
    if (localStorage.getItem("SearchAdditional"))
        $("#SearchAdditional").attr("checked", localStorage.getItem("SearchAdditional") == "true" ? true : false);
    else
        localStorage.setItem("SearchAdditional", "true");

    }

	UpdateThreads();

});

function UpdateThreads()
    {
      nShownCount = 0;
        
      if (IsMobile())
        {
            $(".listItemAnchor").each(function(index) 
        	{
    		 nThreadID = $(this).attr('href').replace('showthread.php?t=','');
    		 //sThreadTitle = $(this).find('.listItemTitle')[0].text();
             console.log(sThreadTitle);
                
             if (CheckThreadHidden(nThreadID,sThreadTitle))
                 $(this).hide();
             else
             {
                 nShownCount++;
                 $(this).show();
             }
    		});
        }
        else
        {
            $('#ThreadFilter').blur();
          	localStorage.setItem('ThreadFilter',document.getElementById("ThreadFilter").value);
      
            $("td[id*=td_threadstatusicon_]").each(function(index) 
        	{
    		 nThreadID = $(this).attr('id').replace('td_threadstatusicon_','');
    		 sThreadTitle = $('#thread_title_' + nThreadID).text();
             sUserID = $(this).siblings().find('a[href*="member.php?u="]')[0].href.replace("http://www.neogaf.com/forum/member.php?u=","");
             
             if (CheckThreadHidden(nThreadID,sThreadTitle,sUserID))
                 $(this).parent().hide();
             else
             {
                 nShownCount++;
                 $(this).parent().show();
             }
	    	});
            
            if (localStorage.getItem("SearchAdditional") == "true")
        	{
            	GetAdditionalThreads();
        	}
        }
        
} 



function GetAdditionalThreads()
{
    if (nShownCount < 40 && nPageCount <= nOriginalPageCount + 5)
    {
        var jqxhr = $.get(window.location.href + "&order=desc&page=" + nPageCount, ProcessAdditionalThread)
    	.done(function() {
        nPageCount ++;
        
        GetAdditionalThreads();
  		});
    }
}

function ProcessAdditionalThread(data)
{
	    var lastThread = $("td[id*='td_threadstatusicon_']").last();
    
        $(data).find("td[id*='td_threadstatusicon_']").each(function(index, value) 
       	{
            nThreadID = $(this).attr('id').replace('td_threadstatusicon_','');
        	sThreadTitle = $(data).find('#thread_title_' + nThreadID).text();
        	sUserID = $(this).siblings().find('a[href*="member.php?u="]')[0].href.replace("http://www.neogaf.com/forum/member.php?u=","");
            
        	nAdditionalThreadCount = nAdditionalThreadCount + 1;
        	
        	if (!CheckThreadHidden(nThreadID, sThreadTitle, sUserID) && nShownCount < 40)
            	{
    	            $(lastThread).parent().after($(this).parent().clone().wrap('<p>').parent().html());
    	    		AddHideLink($("td[id*=td_threadstatusicon_" + nThreadID + "]"));    	
            		nShownCount++;
            	}
           
    	});
}

function CheckThreadFilterValue(sFilterValue)
{
    if (sFilterValue != "Unignored" && sFilterValue != "Ignored" && sFilterValue != "All")
        sFilterValue = "Unignored";
    
    return sFilterValue;
}

function IgnoreItem(event) { 
    var nCurrentID = event.data.param1;
    var sList = event.data.param2;
    var addItem = {};
    addItem.ID = nCurrentID;
    
    if (sList == "IgnoreList")
        addItem.Title = $('#thread_title_' + nCurrentID).text();
    else if (sList == "IgnoredUserList")
        addItem.Username = $('a[href="member.php?u=' + nCurrentID + '"]').attr("title");
    
    CurrentList = GetListFromLocalStorage(sList);
    nFoundIndex = containsObject(nCurrentID,CurrentList);
    
    if (nFoundIndex == -1) 
    	CurrentList.push(addItem); 
    else 
    	CurrentList.splice(nFoundIndex,1); 
        
    
	localStorage.setItem(sList, JSON.stringify(CurrentList));
    
    if (event.data.param3)
    	event.data.param3();
    
    return 0;
}

function AddHideLink(currentThread)
{
    	nThreadID = $(currentThread).attr('id').replace('td_threadstatusicon_','');
        MemberLink = $(currentThread).siblings().find('a[href*="member.php?u="]')[0];
    	nUserID = MemberLink.href.replace("http://www.neogaf.com/forum/member.php?u=","");
    
    	var RemoveUserLinks = $('a[id*=RemoveUser' + nUserID + ']').toArray();
    
    	sUserIDReference = (RemoveUserLinks.length > 0) ? nUserID + RemoveUserLinks.length : nUserID;
    
    	//if (RemoveUserLinks.length > 0)
          //  console.log('multiple references to ' + nUserID);
    
        $(MemberLink).before("<a id='RemoveUser" + sUserIDReference + "'>Remove User</a>");
    	$('#RemoveUser' + sUserIDReference).click({param1: nUserID, param2: 'IgnoredUserList', param3: UpdateThreads}, IgnoreItem); 
	
    	if ($(currentThread).has("a[id*='RemoveThread" + nThreadID + "']").length == 0)
	    {
    	    $('<a></a>', {
	  	    id: "RemoveThread" + nThreadID
			}).appendTo(currentThread);
        
    	    $('#RemoveThread' + nThreadID).click({param1: nThreadID, param2: 'IgnoreList', param3: UpdateThreads}, IgnoreItem); 
    	}
}


function CheckThreadHidden(nThreadID, sThreadTitle,sUserID)
{
    		var sThreadFilterVal = CheckThreadFilterValue(localStorage.getItem("ThreadFilter"));
    		var bWordFilterApplies = false;
    		var bUserFilterApplies = false;
    
    		IgnoreList = GetListFromLocalStorage('IgnoreList');
    		nThreadIndex = containsObject(nThreadID,IgnoreList);
    		
    		var bThreadIgnored = (nThreadIndex == -1) ? false : true;
    
             if (bThreadIgnored && sThreadFilterVal == 'Unignored' )
             {
                 return true;
             }
             else
             {
                 bWordFilterApplies = WordFilterApplies(sThreadTitle);
                 
                 if (bWordFilterApplies && sThreadFilterVal == 'Unignored')
             		{
                 		return true;
             		}
                else 
                 	{
                        bUserFilterApplies = containsObject(sUserID,GetListFromLocalStorage('IgnoredUserList')) != -1 ? true : false;   
                      
                      if (bUserFilterApplies && sThreadFilterVal == 'Unignored')
             			{
                            return true;
             			}
                     else if (!bThreadIgnored && !bWordFilterApplies && !bUserFilterApplies && sThreadFilterVal == 'Ignored')
             			{
                 			return true;
             			}
                 	}
             	
             }
    
    return false;
}

function WordFilterApplies(sThreadTitle)
{
    var bFilterApplies = false;
	WordList = GetListFromLocalStorage('WordList');
            
    jQuery.each(WordList,function (index)
	{
        if (this.Type == 'plaintext')
		{
			sFragments = this.Word.split('*');
		
			bMatchesPattern = true;
			jQuery.each(sFragments, function(index)
			{
				if (sThreadTitle.toLowerCase().indexOf(this.toLowerCase()) == -1)
				{
					bMatchesPattern = false;
				}
			});
		
			if (bMatchesPattern === true)
            	{
                    bFilterApplies = true;
					return 0;
            	}
		}
		else if (this.Type == 'regularexpression')
		{
			sRegExMatches = sThreadTitle.match(this.Word);
			
			if (sRegExMatches)
            {
                bFilterApplies = true;
                return 0;
            }
		}
    });
	
    return bFilterApplies;
 }   
 

function AddToWordFilter(event) {
    newWord = $('#AddWordText').val();

    var addWord = {};
    addWord.Word = newWord;
    addWord.Type = $('input[name*=AddWordType]:checked').val();

    WordList = GetListFromLocalStorage('WordList');
    nWordIndex = containsObject(addWord.Word, WordList);

    if (nWordIndex == -1) {

        WordList.push(addWord);
    }

    localStorage.setItem('WordList', JSON.stringify(WordList));
    $('#AddWordText').val('');
    
    UpdateListing('WordListing', 'WordList');
}

function AddToIgnoredUserList(event) {
    newIgnoredUserText = $('#AddIgnoredUserText').val();

    var addIgnoredUser = {};
    addIgnoredUser.Username = newIgnoredUser;

    IgnoredUserList = GetListFromLocalStorage('IgnoredUserList');
    nIgnoredUserIndex = containsObject(addIgnoredUser.Username, IgnoredUserList);

    if (nIgnoredUserIndex == -1) {
        IgnoredUserList.push(addIgnoredUser);
    }

    localStorage.setItem('IgnoredUserList', JSON.stringify(IgnoredUserList));
    $('#AddIgnoredUserText').val('');
    
    UpdateListing('IgnoredUserListing', 'IgnoredUserList');
}

function CreateWordFilter()
{
    sWordFilter = "<div id='WordFilter'>";
    sWordFilter += "<strong>Add New Word:</strong>&nbsp;<input id='AddWordText'><input type='button' id='AddWordButton' value='Add'><br /><input type='radio' name='AddWordType' value='plaintext' checked>Plain Text (* supported)<input type='radio' name='AddWordType' value='regularexpression'>Regular Expression<br /><br /><hr width='100%' color='black'><div id='WordListing'></div>";
    sWordFilter += "</div>";
    
    return sWordFilter;
}

function CreateIgnoredUserTab()
{
    sIgnoredUserTab = "<hr width='100%' color='black'><div id='IgnoredUserListing'></div>";
    
    return sIgnoredUserTab;
}

function CreateSettingsOptions()
{
    sCreateSettings = "<input type='checkbox' id='SearchAdditional' checked='true'>Search additional pages for threads</input>";
    
    return sCreateSettings;
}

function OpenFilterCP()
    {
    	UpdateListing('WordListing', 'WordList');
        UpdateListing('RecentlyIgnoredListing', 'IgnoreList');
        UpdateListing('IgnoredUserListing', 'IgnoredUserList');
        
        $('#tabs').tabs();
        $('#tabs').dialog();
        $('#tabs').bind('dialogclose', function(event) { UpdateThreads();});
    	$('#tabs').dialog({ title: "Filter Control Panel"});
        $("#tabs").dialog("option", "width", $("#tabs").dialog( "option", "width" ) + 200);
    }

function UpdateListing(sListingDiv, sListName)
{
	$('#' + sListingDiv).empty();
    CurrentList = GetListFromLocalStorage(sListName);
 
    if (sListName == 'IgnoreList' || sListName == 'IgnoredUserList')
        CurrentList.reverse();
    
    var sListingText;

	if (sListName == 'IgnoredUserList')    
    	sColumnHeadings = '<td align="center" width="300px"><strong>Username</strong></td>';
    else if (sListName == 'IgnoreList')
        sColumnHeadings = '<td align="center" width="300px"><strong>Title</strong></td>';
    else if (sListName == 'WordList')
        sColumnHeadings = '<td align="center" width="200px"><strong>Word</strong></td><td align="center" width="200px"><strong>Type</strong></td>';
    
    sListingText = '<table width="100%"><tr>' + sColumnHeadings + '<td>&nbsp;</td></tr>';
	
    
  	jQuery.each(CurrentList,function (index) 
	{	
        if (sListName == 'IgnoredUserList')    
        	sListingText += '<tr><td align="center"><div style="word-wrap:break-word;width:300px"><a href="http://www.neogaf.com/forum/member.php?u=' + this.ID + '" target="_blank">' + this.Username + '</a></div></td><td><input type=button id="RemoveIgnoredUser' + this.ID + '" value=Unignore /></td></tr>';
    	else if (sListName == 'IgnoreList')
        	sListingText += '<tr><td align="center"><div style="word-wrap:break-word;width:300px"><a href="http://www.neogaf.com/forum/showthread.php?t=' + this.ID + '" target="_blank">' + this.Title + '</a></div></td><td><input type=button id="RemoveRecentlyIgnored' + this.ID + '" value=Unignore /></td></tr>';
    	else if (sListName == 'WordList')
        	sListingText += '<tr><td align="center"><div style="word-wrap:break-word;width:200px">' + this.Word + '</div></td><td align="center">' + this.Type + '</td><td><input type=button id="RemoveWord' + index + '" value=Remove /></td></tr>';
    
	});
    
    sListingText += '</table>';
    
    $('#' + sListingDiv).append(sListingText);
        
    jQuery.each(CurrentList,function (index) 
                {
                    if (sListName == 'IgnoredUserList')    
                        $('#RemoveIgnoredUser' + this.ID).click({sCurrentID: this.ID, sListName: 'IgnoredUserList', sListDiv: 'IgnoredUserListing'}, RemoveIgnored);
			    	else if (sListName == 'IgnoreList')
        	            $('#RemoveRecentlyIgnored' + this.ID).click({sCurrentID: this.ID, sListName: 'IgnoreList', sListDiv: 'RecentlyIgnoredListing'}, RemoveIgnored);
    				else if (sListName == 'WordList')
                        $('#RemoveWord' + index).click({sCurrentID: this.Word, sListName: 'WordList', sListDiv: 'WordListing'}, RemoveIgnored);
                    
                });
}


function RemoveIgnored(event) { 
    IgnoreList = GetListFromLocalStorage(event.data.sListName);
    nCurrentIndex = containsObject(event.data.sCurrentID,IgnoreList);
    IgnoreList.splice(nCurrentIndex,1); 
    localStorage.setItem(event.data.sListName, JSON.stringify(IgnoreList));
    
    UpdateListing(event.data.sListDiv,event.data.sListName);
}

function containsObject(id, list) {
	    var i;
	    for (i = 0; i < list.length; i++) {
		    if (list[i].ID == id || list[i].Word == id) {
    			return i;
    			}
    		}

    	return -1;
	}

function GetNextPage()
{
    var str = window.location.href; 
	var res = str.match("page=[0-9]+");
    
    if (res)
        	return parseInt(res[0].replace("page=","")) + 1;
    else
            return 2;
                        
}

function GetListFromLocalStorage(sListName)
{
     return localStorage.getItem(sListName) ? JSON.parse(localStorage.getItem(sListName)) : [];
}

function IsMobile()
{
    return window.location.href.indexOf('m.neogaf') != -1 ? true : false;
}