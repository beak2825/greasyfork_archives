// ==UserScript==
// @name       Gamefaqs Quick Edit
// @namespace  N-eil
// @version    0.9.1
// @description  Edit from within topic in gamefaqs 
// @include *.gamefaqs.com/boards/*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/591/Gamefaqs%20Quick%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/591/Gamefaqs%20Quick%20Edit.meta.js
// ==/UserScript==

var reg = /\/(\d+)/g //Makes a regex to get board and message ID from the url
    ,	boardID = reg.exec(location.href)[1]
    ,	topicID = reg.exec(location.href)[1];	

var key; //Gfaqs has a hidden field called "key" that is required to be filled with a certain code(different for each user) in order to post/edit/pm

if(document.getElementsByName('key').length) //Look for the key on the page: quickposting is enabled
{
    key = document.getElementsByName('key')[0].value;
	addLinks();    
}
else 
{
    $.post("/boards/post.php?board=" + boardID + "&topic=" + topicID, {}).done(function(response){ //Otherwise, look for the key requesting a separate post message page
        key = response.match(/key" value="([^"]*)"/)[1];
        addLinks();
    });
}
//If neither method can find the key, don't bother adding the quick PM and edit links since they cannot function properly


function addLinks(){
    var username = $(".board_nav a:first").html();
    username = username.substring(0,username.indexOf('(')-1);
    
    var $details = $(".msg_stats_left")
    ,	displayLeft = true;
    
    if (!$details.length){ //If nothing was found, they must have user details displayed above the message
        $details = $(".msg_stats");
        displayLeft = false;
    }
    
    $details.each(function(index, el) {
        var $el = $(el);
        if ($el.html().match(username))
        { //Ones with your username in them are your posts, and can be edited
         //   $.post($el.find("a[title='Detail']").attr("href"), {}).done(function(response){ //Makes a request to the message detail page
           //     if(response.match(/name="YES" value="Edit/)) //Looks in the response for the edit button, this could be tricked if you wrote the regex in the post but I don't think anyone would do that ever
                //{
                    var editLink = $("<a> Edit </a>");
                    editLink.click(function() {
                        if (displayLeft)
                            showEditWindow($(el).closest(".msg").find(".msg_body").clone());
                        else
                            showEditWindow($(el).closest(".top").next().find(".msg_body").clone());
                    });
                    $el.append(editLink);
                //}
            //});
        }        
    });
}

function replaceButtons(){} //Placeholder function, modified when the edit window appears to replace the buttons in the relevant place

function createPopup(text){
    replaceButtons();
	$("#popup-window").remove();
	var $window = $("<div id='popup-window'> " + text + " </div>")
		.css("left", "30%")
		.css("top","30%")
		.css("position", "fixed")
		.toggleClass("reg_dialog", true);
    $("body").prepend($window);
	return $window; 
}

function showEditWindow(message) {
        
    function stripTags(index, el) {
        //Function to strip out tags like links, TTI images, etc from the message.
            var $el = $(el);
            console.log(el);
            if ($el.is("s"))  // the s tag hides spoilers
                $el.replaceWith("<spoiler>" + $el.html() + "</spoiler>");
            else if ($el.is("img") || $el.is("video"))
                $el.replaceWith($el.attr("src"));
            else if ($el.is("a"))
                $el.replaceWith($el.attr("href"));
            else
                $el.replaceWith($el.html());
}
	
    
    
    //Parse the HTML message back into the way it looks while a user is typing
    message.html(message.html().replace(/<br>(?:<\/br>)?/g, '\n'));
    
    //Remove the extra sig after gfaqs changed its editing method late June 2014
    message.html(message.html().substr(0,message.html().lastIndexOf("\n---\n")));
    
    var tags = [1];
    while (tags.length) {
        tags = message.find(":not(b, i, code, blockquote, cite, spoiler)");  //Anything that isn't just a display tag has to have the original text stripped out of it to put in the edit messagebox
        tags.each(stripTags);
    }
    var messageID = message.attr("name")
    ,	$editWindow = createPopup("Edit your post")
    ,   $message = $("<div><textarea rows ='" + Math.floor($(window).height() / 45) + "' cols='80' maxlength='4096' name='messagetext'>" + message.html() + "</textarea></div>") //Height of textbox based roughly off height of screen, nothing exact but should ensure all the buttons are visible
    ,	$send = $("<button style='margin: 5px;'>Send</button>").click(function() {makeEdit($message.find("textarea").val(), boardID, topicID, messageID);})
    ,   $cancel = $("<button style='margin: 5px;'>Cancel</button>").click(function() {replaceButtons(); $editWindow.remove(); window.msgArea = document.getElementsByName('messagetext')[0];})
    ,	$buttons = $(".tagbuttons");
    
    if (!$buttons.length) //Either gameweasel or gamefox has replaced the html buttons with their own, so fetch those instead
        $buttons = $("#gamefox-html-buttons");
    
    var $buttonHolder = $buttons.prev();
    replaceButtons = function() {$buttonHolder.after($buttons);}; //Fills in the placeholder to replace the desired buttons, called either on cancelling the edit or when you edit another post
    $editWindow.append($("</br>")).append($buttons).append($message).append($send).append($cancel);
    window.msgArea = document.getElementsByName('messagetext')[0];

}

function makeEdit(message, board, topic, ID) {
    var url = "/boards/post.php?board=" + board + "&topic=" + topic + "&message=" + ID;
    $.post(url, {key: key, messagetext: message, post: 'Post without Preview'}).done(function() {location.reload();}).fail(function() {$("#popup-window textarea").val("Could not edit the post.");});
}