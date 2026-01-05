// ==UserScript==
// @name          CH Block Using HIT Scraper's Blocklist
// @description   Block requesters and HITs on regular MTurk search results pages using your blocklist from 'HIT Scraper With Export'. Also highlights favorite requesters from your includelist.
// @version       3.0c
// @author        clickhappier
// @namespace     clickhappier
// @include       https://www.mturk.com/mturk/findhits*
// @include       https://www.mturk.com/mturk/viewhits*
// @include       https://www.mturk.com/mturk/sorthits*
// @include       https://www.mturk.com/mturk/searchbar*selectedSearchType=hitgroups*
// @include       https://www.mturk.com/mturk/viewsearchbar*selectedSearchType=hitgroups*
// @include       https://www.mturk.com/mturk/sortsearchbar*HITGroup*
// @include       https://www.mturk.com/mturk/preview*
// @include       https://www.mturk.com/mturk/accept*
// @include       https://www.mturk.com/mturk/return*
// @include       https://www.mturk.com/mturk/submit*
// @exclude       https://www.mturk.com/*hit_scraper*
// @require       http://code.jquery.com/jquery-latest.min.js
// @grant         GM_log
// @downloadURL https://update.greasyfork.org/scripts/7857/CH%20Block%20Using%20HIT%20Scraper%27s%20Blocklist.user.js
// @updateURL https://update.greasyfork.org/scripts/7857/CH%20Block%20Using%20HIT%20Scraper%27s%20Blocklist.meta.js
// ==/UserScript==


// adaptations from Kerek+Tjololo's 'HIT Scraper WITH EXPORT': https://greasyfork.org/en/scripts/2002-hit-scraper-with-export


// use localStorage instead of GM's storage
//if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {  // these grants aren't declared, so the answer's always no
    this.GM_getValue = function(key,def) {
        return localStorage[key] || def;
        };
    this.GM_setValue = function(key,value) {
        return localStorage[key]=value;
        };
    this.GM_deleteValue = function(key) {
        return localStorage.removeItem(key);
        };
//}


// load ignore (block) list
console.log("blocklist script loaded");
var ignore_list;
if ( !GM_getValue("scraper_ignore_list") )
{
    GM_setValue("scraper_ignore_list","nothing blocked yet");
}
if ( GM_getValue("scraper_ignore_list") )
{
    ignore_list = GM_getValue("scraper_ignore_list").split('^');
//    console.log(ignore_list);
}

// check ignore list for requester name and HIT title (wildcard support from feihtality)
function ignore_check(r,t){
    var tempList = ignore_list.map(function(item) { return item.toLowerCase().replace(/\s+/g," "); });
    var foundR = -1;
    var foundT = -1;
    var blockWilds = [], blockExact = [];
    blockExact = tempList.filter(function(item) { // separate glob patterns from literal strings
        if (item.search(".*?[*].*")) return true; else if (item.length > 1) {blockWilds.push(item); return false;} 
    });
    // run default matching first
    foundR = blockExact.indexOf(r.toLowerCase().replace(/\s+/g," "));
    foundT = blockExact.indexOf(t.toLowerCase().replace(/\s+/g," "));
    // if no match, try globs
    if (foundR == -1 && foundT == -1) {
        for (var i=0; i<blockWilds.length; i++) {
            blockWilds[i] = blockWilds[i].replace(/([+${}[\](\)^|?.\\])/g, "\\$1"); // escape special characters
            blockWilds[i] = "^".concat(blockWilds[i].replace(/([^*]|^)[*](?!\*)/g, "$1.*").replace(/\*{2,}/g, function(s) { return s.replace(/\*/g, "\\*"); })).concat("$"); //set up wildcards and escape consecutive asterisks
            foundR = r.toLowerCase().replace(/\s+/g," ").search(blockWilds[i]);
            foundT = t.toLowerCase().replace(/\s+/g," ").search(blockWilds[i]);
            if (foundR != -1 || foundT != -1)
                break;
        }
    }
    var found = foundR == -1 && foundT == -1;
    return found;  // returns false (making !(ignore_check(x,y)) true) if HIT should be blocked, returns true if it shouldn't be blocked
}


// load include list
var include_list = [];
if ( !GM_getValue("scraper_include_list") )
{
    GM_setValue("scraper_include_list","nothing includelisted yet");
}
if ( GM_getValue("scraper_include_list") )
{
    include_list = GM_getValue("scraper_include_list").split('^');
//    console.log(include_list);
}

// check include list for requester name and HIT title
function include_check(r,t)
{
    var tempList = include_list.map(function(item) { return item.toLowerCase().replace(/\s+/g," "); });
    var foundR = -1;
    var foundT = -1;
    foundR = tempList.indexOf(r.toLowerCase().replace(/\s+/g," "));
    foundT = tempList.indexOf(t.toLowerCase().replace(/\s+/g," "));
    var found = foundR == -1 && foundT == -1;
    return found;  // returns false (making !(include_check(x,y)) true) if HIT should be highlighted, returns true if it shouldn't be highlighted
}


// identify HITs, requesters, and titles
var $requester = $('a[href^="/mturk/searchbar?selectedSearchType=hitgroups&requester"]');
var $title = $('a[class="capsulelink"]');
var $hitcapsule = $("table[width='100%'][cellspacing='0'][cellpadding='0'][border='0'][height='100%']").parent();  // using parent td for compatibility with 'mmmturkeybacon Color-Coded Search' / 'mmmturkeybacon Color-Coded Search with Checkpoints', which hides/shows the table inside the parent td
console.log("HIT capsules identified: " + $hitcapsule.length);

// hide blocked hits
var blockedcount = 0;
var blockednames = "";
function hideBlocked()
{
    // reload lists
    if ( GM_getValue("scraper_ignore_list") ) { ignore_list = GM_getValue("scraper_ignore_list").split('^'); }
    if ( GM_getValue("scraper_include_list") ) { include_list = GM_getValue("scraper_include_list").split('^'); }
    
    console.log("starting to block, total HITs to check: " + $requester.length);
    blockedcount = 0;
    blockednames = "";
    for (var j = 0; j < $requester.length; j++)
    {
        var requester_name = $requester.eq(j).text().trim();
        var title = $title.eq(j).text().trim();
        console.log("HIT " + (j+1) + " detected. Requester: " + requester_name + ", Title: " + title);
        var hitcapsule = $hitcapsule.eq(j);
        // hide hit if requester name or hit title is in your blocklist
        if (!ignore_check(requester_name,title))
        {  
            hitcapsule.css('border','red solid thick');
            hitcapsule.hide();
            blockedcount++;
            blockednames += requester_name + ", ";
            console.log("blocked HIT " + (j+1) );
        }
        // check includelist for favorite hits to highlight (green outline)
        else if (!include_check(requester_name,title))
        {
            hitcapsule.css('border','green dashed thick');
            hitcapsule.show();
            console.log("highlighted HIT " + (j+1) );
        }
        // reset display for hits no longer on blocklist or includelist
        else 
        {
            hitcapsule.css('border','none');
            hitcapsule.show();            
        }
    }
    console.log("Total HITs blocked: " + blockedcount);
    blockednames = blockednames.replace(/,\s*$/, "");  // remove final comma and space
    $('#showblocked').prop('title', blockednames);  // update displayed list in show/hide link's mouseover text
    $('#showblocked').text("Show " + blockedcount + " Blocked");  // update displayed block count
}

$(document).ready(hideBlocked());  // initiate hiding first time when page loads

// unhide blocked hits
function showBlocked(){
    console.log("starting to un-hide");
    for (var j = 0; j < $requester.length; j++){
        var hitcapsule = $hitcapsule.eq(j);
        hitcapsule.show();
    }
}

// open blocklist editor
var edit_blocks = document.createElement("span");
edit_blocks.innerHTML = '<a href="#" class="footer_links" id="blocklist_edit_link" title="Blocklist = Disliked requester names and HIT titles to be hidden/ignored, and displayed with a red solid border when unhidden.">Edit Blocklist</a>';
edit_blocks.onclick = function(){
//    console.log("opened blocklist editor");
    ignore_list = GM_getValue("scraper_ignore_list").split('^');
    var textarea = $("#blocklist_text");
    var text = "";
    for (var i = 0; i < ignore_list.length; i++){
        text += ignore_list[i]+"^";
    }
    textarea.val(text.substring(0, text.length - 1));
    $("#blocklist_div").show();
};

// show/hide blocked hits
var showAllBlocked = document.createElement("span");
showAllBlocked.innerHTML = '<a href="#" class="footer_links" id="showblocked" title="' + blockednames + '">Show ' + blockedcount + ' Blocked</a>';
showAllBlocked.onclick = function(){
    if ( document.getElementById('showblocked').innerHTML.indexOf("Show") > -1 ) { 
        console.log("Un-hiding blocked hits - " + document.getElementById('showblocked').innerHTML );
        showBlocked();
        document.getElementById('showblocked').innerHTML = "Hide " + blockedcount + " Blocked";
    }
    else if ( document.getElementById('showblocked').innerHTML.indexOf("Hide") > -1 ) { 
        console.log("Re-hiding blocked hits - " + document.getElementById('showblocked').innerHTML );
        hideBlocked();
        document.getElementById('showblocked').innerHTML = "Show " + blockedcount + " Blocked";
    }
};

// open includelist editor
var edit_includes = document.createElement("span");
edit_includes.innerHTML = '<a href="#" class="footer_links" id="includelist_edit_link" title="Includelist = Favorite requester names and HIT titles to be displayed with a green dashed border to make them easy to spot.">Edit Includelist</a>';
edit_includes.onclick = function(){
//    console.log("opened includelist editor");
    include_list = GM_getValue("scraper_include_list").split('^');
    var textarea = $("#includelist_text");
    var text = "";
    for (var i = 0; i < include_list.length; i++){
        text += include_list[i]+"^";
    }
    textarea.val(text.substring(0, text.length - 1));
    $("#includelist_div").show();
};

// add edit and show/hide links to regular search results pages
var blocklinksDivider = '&nbsp;&nbsp;<font color="#9ab8ef">|</font>&nbsp;&nbsp;';
if ( document.location.href.indexOf('?last_hits_previewed') < 0 ) {
    $('#collapseall').eq(0).after("<br>", edit_blocks, blocklinksDivider, showAllBlocked, blocklinksDivider, edit_includes);
//    collapseAll.parentNode.insertBefore(showAllBlocked, collapseAll.nextSibling);
//    collapseAll.parentNode.insertBefore(edit_blocks, collapseAll.nextSibling);
}
else {  // add edit and show/hide links to last_hits_previewed page
//    edit_blocks.innerHTML = edit_blocks.innerHTML.replace(blocklinksDivider, '');
    $("h1:contains('Last HITs Previewed')").eq(0).after(edit_blocks, blocklinksDivider, showAllBlocked, blocklinksDivider, edit_includes, "<br><br>");
}


// For editing the blocklist
var blocklistdiv = document.createElement('div');
var blocklisttextarea = document.createElement('textarea');

blocklistdiv.style.position = 'fixed';
blocklistdiv.style.width = '500px';
blocklistdiv.style.height = '255px';
blocklistdiv.style.left = '50%';
blocklistdiv.style.right = '50%';
blocklistdiv.style.margin = '-250px 0px 0px -250px';
blocklistdiv.style.top = '300px';
blocklistdiv.style.padding = '5px';
blocklistdiv.style.border = '2px';
blocklistdiv.style.backgroundColor = 'black';
blocklistdiv.style.color = 'white';
blocklistdiv.style.zIndex = '100';
blocklistdiv.setAttribute('id','blocklist_div');
blocklistdiv.style.display = 'none';

blocklisttextarea.style.padding = '2px';
blocklisttextarea.style.width = '500px';
blocklisttextarea.style.height = '180px';
blocklisttextarea.title = 'Block list';
blocklisttextarea.setAttribute('id','blocklist_text');

blocklistdiv.textContent = 'This BLOCKLIST (ignored requesters/HITs) is shared with HIT Scraper With Export. Separate requester names and HIT titles with the ^ character. After clicking "Save", changes will be immediately applied in this tab (for other tabs to reflect the changes, refresh them or click their show/hide links twice).';
blocklistdiv.style.fontSize = '12px';
blocklistdiv.appendChild(blocklisttextarea);

var save_BLbutton = document.createElement('button');
var cancel_BLbutton = document.createElement('button');

save_BLbutton.textContent = 'Save';
save_BLbutton.setAttribute('id', 'save_BLblocklist');
save_BLbutton.style.height = '18px';
save_BLbutton.style.width = '100px';
save_BLbutton.style.fontSize = '10px';
save_BLbutton.style.paddingLeft = '3px';
save_BLbutton.style.paddingRight = '3px';
save_BLbutton.style.backgroundColor = 'white';
save_BLbutton.style.marginLeft = '5px';

cancel_BLbutton.textContent = 'Cancel';
cancel_BLbutton.setAttribute('id', 'cancel_BLblocklist');
cancel_BLbutton.style.height = '18px';
cancel_BLbutton.style.width = '100px';
cancel_BLbutton.style.fontSize = '10px';
cancel_BLbutton.style.paddingLeft = '3px';
cancel_BLbutton.style.paddingRight = '3px';
cancel_BLbutton.style.backgroundColor = 'white';
cancel_BLbutton.style.marginLeft = '5px';

blocklistdiv.appendChild(save_BLbutton);
blocklistdiv.appendChild(cancel_BLbutton);
document.body.insertBefore(blocklistdiv, document.body.firstChild);

// save and cancel for blocklist
function save_BLblocklist() {
//    console.log("Save blocklist");
    var textarea = $("#blocklist_text");
    var text = textarea.val();
    var temp_block_list = text.split("^");
    var trimmed_list = [];
    for (var requester in temp_block_list){
        if (temp_block_list[requester].trim().length !== 0)
            trimmed_list.push(temp_block_list[requester].toLowerCase().trim());
    }
//    console.log(trimmed_list);
    GM_setValue("scraper_ignore_list",trimmed_list.join('^'));   
    ignore_list = GM_getValue("scraper_ignore_list").split('^');
//    console.log("Save blocklist complete: ");
//    console.log(ignore_list);
    $("#blocklist_div").hide();
    // apply changes to current page
    hideBlocked();
}
save_BLbutton.addEventListener("click", function(){ save_BLblocklist(); }, false);
cancel_BLbutton.addEventListener("click", function(){ 
    // reset textarea contents upon cancel
    ignore_list = GM_getValue("scraper_ignore_list").split('^');
    var textarea = $("#blocklist_text");
    var text = "";
    for (var i = 0; i < ignore_list.length; i++){
        text += ignore_list[i]+"^";
    }
    textarea.val(text.substring(0, text.length - 1));
    // close editor
    $("#blocklist_div").hide(); 
}, false);


// For editing the includelist
var includelistdiv = document.createElement('div');
var includelisttextarea = document.createElement('textarea');

includelistdiv.style.position = 'fixed';
includelistdiv.style.width = '500px';
includelistdiv.style.height = '255px';
includelistdiv.style.left = '50%';
includelistdiv.style.right = '50%';
includelistdiv.style.margin = '-250px 0px 0px -250px';
includelistdiv.style.top = '300px';
includelistdiv.style.padding = '5px';
includelistdiv.style.border = '2px';
includelistdiv.style.backgroundColor = 'black';
includelistdiv.style.color = 'white';
includelistdiv.style.zIndex = '100';
includelistdiv.setAttribute('id','includelist_div');
includelistdiv.style.display = 'none';

includelisttextarea.style.padding = '2px';
includelisttextarea.style.width = '500px';
includelisttextarea.style.height = '180px';
includelisttextarea.title = 'Include list';
includelisttextarea.setAttribute('id','includelist_text');

includelistdiv.textContent = 'This INCLUDELIST (favorite requesters/HITs) is shared with HIT Scraper With Export. Separate requester names and HIT titles with the ^ character. After clicking "Save", changes will be immediately applied in this tab (for other tabs to reflect the changes, refresh them or click their show/hide links twice).';
includelistdiv.style.fontSize = '12px';
includelistdiv.appendChild(includelisttextarea);

var save_ILbutton = document.createElement('button');
var cancel_ILbutton = document.createElement('button');

save_ILbutton.textContent = 'Save';
save_ILbutton.setAttribute('id', 'save_ILincludelist');
save_ILbutton.style.height = '18px';
save_ILbutton.style.width = '100px';
save_ILbutton.style.fontSize = '10px';
save_ILbutton.style.paddingLeft = '3px';
save_ILbutton.style.paddingRight = '3px';
save_ILbutton.style.backgroundColor = 'white';
save_ILbutton.style.marginLeft = '5px';

cancel_ILbutton.textContent = 'Cancel';
cancel_ILbutton.setAttribute('id', 'cancel_ILincludelist');
cancel_ILbutton.style.height = '18px';
cancel_ILbutton.style.width = '100px';
cancel_ILbutton.style.fontSize = '10px';
cancel_ILbutton.style.paddingLeft = '3px';
cancel_ILbutton.style.paddingRight = '3px';
cancel_ILbutton.style.backgroundColor = 'white';
cancel_ILbutton.style.marginLeft = '5px';

includelistdiv.appendChild(save_ILbutton);
includelistdiv.appendChild(cancel_ILbutton);
document.body.insertBefore(includelistdiv, document.body.firstChild);

// save and cancel for includelist
function save_ILincludelist() {
//    console.log("Save includelist");
    var textarea = $("#includelist_text");
    var text = textarea.val();
    var temp_include_list = text.split("^");
    var trimmed_list = [];
    for (var requester in temp_include_list){
        if (temp_include_list[requester].trim().length !== 0)
            trimmed_list.push(temp_include_list[requester].toLowerCase().trim());
    }
//    console.log(trimmed_list);
    GM_setValue("scraper_include_list",trimmed_list.join('^'));   
    include_list = GM_getValue("scraper_include_list").split('^');
//    console.log("Save includelist complete: ");
//    console.log(include_list);
    $("#includelist_div").hide();
    // apply changes to current page
    hideBlocked();
}
save_ILbutton.addEventListener("click", function(){ save_ILincludelist(); }, false);
cancel_ILbutton.addEventListener("click", function(){ 
    // reset textarea contents upon cancel
    include_list = GM_getValue("scraper_include_list").split('^');
    var textarea = $("#includelist_text");
    var text = "";
    for (var i = 0; i < include_list.length; i++){
        text += include_list[i]+"^";
    }
    textarea.val(text.substring(0, text.length - 1));
    // close editor
    $("#includelist_div").hide(); 
}, false);


// Buttons - with help from kadauchi
for ( var i = 0; i < ($hitcapsule.length); i++ )
{
    var ButtonXTitle = document.createElement("button");
    ButtonXTitle.innerHTML = "X Title";
    ButtonXTitle.title = "Add HIT title to blocklist.";
    ButtonXTitle.value = $("a[class='capsulelink']").eq(i).text().trim();
    ButtonXTitle.style.width = "44px";
    ButtonXTitle.style.height = "16px";
    ButtonXTitle.style.fontSize = "10px";
    ButtonXTitle.style.fontWeight= "bolder";
    ButtonXTitle.style.border = "2px solid";
    ButtonXTitle.style.marginLeft = "5px";
    ButtonXTitle.style.padding = "0px";
    ButtonXTitle.style.backgroundColor = "transparent";
    ButtonXTitle.addEventListener("click",function(){
        var Title = $(this).val().toLowerCase();
        if (!ignore_check("placeholderxyz",Title))  // if already on blocklist
        {
            window.alert("This HIT title \""+Title+"\" is already in your blocklist. To unblock it, use 'Edit Blocklist'.");
        }
        else
        {
            var Confirm = confirm("Do you really want to block HITs matching HIT title \""+Title+"\"?");
            if (Confirm)
            {
                GM_setValue("scraper_ignore_list", GM_getValue("scraper_ignore_list")+"^"+Title);
                hideBlocked();
            }
        }
    });
    $("a[class='capsulelink']").eq(i).after(ButtonXTitle);

    var ButtonXReq = document.createElement("button");
    ButtonXReq.innerHTML = "X Req";
    ButtonXReq.title = "Add requester name to blocklist.";
    ButtonXReq.value = $("span[class='requesterIdentity']").eq(i).text().trim();
    ButtonXReq.style.width = "44px";
    ButtonXReq.style.height = "16px";
    ButtonXReq.style.fontSize = "10px";
    ButtonXReq.style.fontWeight= "bolder";
    ButtonXReq.style.border = "2px solid";
    ButtonXReq.style.marginLeft = "5px";
    ButtonXReq.style.padding = "0px";
    ButtonXReq.style.backgroundColor = "transparent";
    ButtonXReq.addEventListener("click",function(){
        var Req = $(this).val().toLowerCase();
        if (!ignore_check(Req,"placeholderxyz"))  // if already on blocklist
        {
            window.alert("This requester name \""+Req+"\" is already in your blocklist. To unblock it, use 'Edit Blocklist'.");
        }
        else
        {
            var Confirm = confirm("Do you really want to block HITs matching requester name \""+Req+"\"?");
            if (Confirm)
            {
                GM_setValue("scraper_ignore_list", GM_getValue("scraper_ignore_list")+"^"+Req);
                hideBlocked();
            }
        }
    });
    $("a[class='capsulelink']").eq(i).after(ButtonXReq);
}
