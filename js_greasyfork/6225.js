// ==UserScript==
// @name 			WME Chat Resizer and Auto Scroll
// @description 	Adds resize buttons to the chat window
// @namespace		RickZabel@gmail.com
// @grant			none
// @grant			GM_info
// @version			0.2.8
// @match          https://editor-beta.waze.com/*editor*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @author			Rick Zabel '2014
// @license			MIT/BSD/X11
// @downloadURL https://update.greasyfork.org/scripts/6225/WME%20Chat%20Resizer%20and%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/6225/WME%20Chat%20Resizer%20and%20Auto%20Scroll.meta.js
// ==/UserScript==

var WMEChatResizeVersion = GM_info.script.version;



var WMEChatResizeVersionUpdateNotes = "WME Chat Resizer has been updated to " + WMEChatResizeVersion;
WMEChatResizeVersionUpdateNotes = WMEChatResizeVersionUpdateNotes + "\n" + "Updates for WME, chat addon, and chat UI fix";

//alert the user in  WMEChatResize version updates
if (localStorage.getItem('WMEChatResizeVersion') == WMEChatResizeVersion) {
    //console.log("UR Chat Resize Version " + WMEChatResizeVersion);
} else {
    alert(WMEChatResizeVersionUpdateNotes);
    localStorage.setItem('WMEChatResizeVersion', WMEChatResizeVersion);
}

//Setup some global vars to be used in the functions
//currently i plan on lettings the chat default to normal on page load
//window.WMEChatResizeHeight = "short"; //short or tall
//window.WMEChatResizeUsers  = "shown";  //shown  or hidden


//Setup some global vars to be used in the functions
//currently i plan on lettings the chat default to normal on page load size
window.WMEChatResizeAutoScrollOnOff = "on";
window.WMEChatResizeAutoScrollChatCount = 0;


function WMEChatResize_init() {

    WMEChatResize =  {
        last: new Array(),
        isLast: false,
        isLSsupported: false,
        zoom: false
    };

    WMEChatResize.init = function() {
        //add the buttons to the chat title bar to hide/show user list and max and min

        //
        var g = $('<style type="text/css">.WMEChatResize { font-size: 15px; color:#FFFFFF; background: transparent; border: 0px none !important; padding: 5px 5px 3px 3px; opacity: 100; }</style>');
        $("head").append(g);

		var g = $('<style type="text/css">.WMEChatResizeScrollChat { font-size: 15px; color:#FFFFFF; background: transparent; border: 0px none !important; padding: 3px 3px 3px 3px; opacity: 100; }</style>');
        $("head").append(g);

		var b = "";

		b = b + '<div id="ChatResizeHeader" style="top: 0px; height: 25px; text-align: center; padding: 0px 0px 0px 0px;color:#5A5A5A; font-size: 10px; width: 100%;">';

		//auto scroll running
        b = b + '<button id="WMEChatResizeAutoScrollChatIsRunning" class="WMEChatResizeScrollChat" style="position:absolute;Left:15px" title="MEChatResize Auto Scroll Running" type="button">v</button>';

        //stopped auto scrolling
 		b = b + '<button id="WMEChatResizeAutoScrollChatIsStopped" class="WMEChatResizeScrollChat" style="position:absolute;Left:15px" title="MEChatResize Auto Scroll Stopped" type="button">-</button>';

		b = b + ' Chat Resizer &nbsp' + WMEChatResizeVersion;

        //Short Chat Hide Users
        b = b + '<button id="WMEChatResizeShortChatHideUsers" class="WMEChatResize" style="position:absolute;Right:15px;" title="Short Chat Hide Users" type="button"><</button>';

        //Tall Chat Hide Users
        b = b + '<button id="WMEChatResizeTallHideUsers" class="WMEChatResize" style="position:absolute;Right:15px;" title="Tall Chat Hide Users" type="button"><</button>';

        //Short Chat Show Users
        b = b + '<button id="WMEChatResizeShortChatShowUsers" class="WMEChatResize" style="position:absolute;Right:15px;" title="Short Chat Show Users" type="button">></button>';

        //Tall Chat Show Users
        b = b + '<button id="WMEChatResizeTallShowUsers" class="WMEChatResize" style="position:absolute;Right:15px;" title="Tall Chat Show Users" type="button">></button>';

        //Tall Chat Go Short with Hidden Users
        b = b + '<button id="WMEChatResizeShortChatHideUsers2" class="WMEChatResize" style="position:absolute;Right:35px;" title="Tall Chat Go Short with Hidden Users" 	type="button">v</button>';

        //Tall Chat Go Short and Show Users
        b = b + '<button id="WMEChatResizeShortChatShowUsers2" class="WMEChatResize" style="position:absolute;Right:35px;" title="Tall Chat Go Short With Shown Users" 	type="button">v</button>';

        //Short Chat Go Tall and Hide Users
        b = b + '<button id="WMEChatResizeTallHideUsers2" class="WMEChatResize" style="position:absolute;Right:35px;" title="Short Chat Go Tall and Hide Users" type="button">^</button>';

        //Short Chat Go Tall and Show Users
        b = b + '<button id="WMEChatResizeTallShowUsers2" class="WMEChatResize" style="position:absolute;Right:35px;" title="Short Chat Go Tall and Show Users" type="button">^</button>';

		/*
		//Extra Short Chat With user list
        b = $('<button id="WMEChatResizeTallShowUsers2" class="WMEChatResize" style="float:right;color:#CC0000" title="Extra short chat" type="button">_</button>';
        b.click (WMEChatResize.TallShowUsers);
        $("#chat .header").append(b);
		*/

		//Extra Short Chat without user list
        b = b + '<button id="WMEChatResizeExtraShortChatHideUsers" class="WMEChatResize" style="position:absolute;Right:55px;" title="Extra short chat" type="button">_</button>';

        b = b + '</div>';
		//alert(b);
		//style="position:absolute;Right:50px;color:#CC0000"

		//$("#chat .header").append($(b));
		//$("#chat").prepend($(b));
		$("#chat .header").prepend($(b));

		//$("#ChatResizeHeader").mouseup(WMEChatResize.ChatResizeminchat);


		$("#ChatResizeHeader").mouseup(function(e) {
		//alert(e.which);
        if (e.which == 1)  {
		//check to make sure we are not over any of our buttons
			if ($('#WMEChatResizeAutoScrollChatIsRunning').is(':hover') || $('#WMEChatResizeAutoScrollChatIsStopped').is(':hover') || $('#WMEChatResizeTallHideUsers').is(':hover') || $('#WMEChatResizeShortChatShowUsers').is(':hover') || $('#WMEChatResizeTallShowUsers').is(':hover') || $('#WMEChatResizeShortChatHideUsers2').is(':hover') || $('#WMEChatResizeShortChatShowUsers2').is(':hover') || $('#WMEChatResizeTallHideUsers2').is(':hover') || $('#WMEChatResizeTallShowUsers2').is(':hover') || $('#WMEChatResizeExtraShortChatHideUsers').is(':hover') || $('#WMEChatResizeShortChatHideUsers').is(':hover')) {
					//alert('mouse over buttons');

			} else {
				//click the chat toggle button (chat balloon)_
				$('#chat-overlay.open .toggle').trigger('click');
			}
		}
		//alert(e.which);

		});

		//setup button clicks
		$("#WMEChatResizeShortChatHideUsers").click(WMEChatResize.ShortChatHideUsers);
        $("#WMEChatResizeTallHideUsers").click(WMEChatResize.TallHideUsers);
        $("#WMEChatResizeShortChatShowUsers").click(WMEChatResize.ShortChatShowUsers);
        $("#WMEChatResizeTallShowUsers").click(WMEChatResize.TallShowUsers);
        $("#WMEChatResizeShortChatHideUsers2").click(WMEChatResize.ShortChatHideUsers);
        $("#WMEChatResizeShortChatShowUsers2").click(WMEChatResize.ShortChatShowUsers);
        $("#WMEChatResizeTallHideUsers2").click(WMEChatResize.TallHideUsers);
        $("#WMEChatResizeTallShowUsers2").click(WMEChatResize.TallShowUsers);
        $("#WMEChatResizeExtraShortChatHideUsers").click(WMEChatResize.ExtraShortChatHideUsers);
		$("#WMEChatResizeAutoScrollChatIsRunning").click(WMEChatResize.WMEChatResizeAutoScrollChatIsStopped);
		$("#WMEChatResizeAutoScrollChatIsStopped").click(WMEChatResize.WMEChatResizeAutoScrollChatGo);

		/*
         //auto scroll div
        b = $('<div id="autoscrolldiv" Style="position:absolute; left: 0px; bottom: 15px; width 10px;"></div>');
		//b = $('<div id="autoscrolldiv" Style="width: 50%; position: relative;"></div>');
        $(".new-message").after(b);
		//$("#chat").prepend(b);


        //auto scroll running
        //position:absolute;Left:4px;bottom: 20px; Right:5px;color:#CC0000; background: #ffffff; border: 0px none !important; padding: 0px 0px 0px 0px;
        //opacity: 100;color:#CC0000; background: #ffffff; border: 0px none !important; padding: 0px 0px 0px 0px;
        b = $('<button id="WMEChatResizeAutoScrollChatIsRunning" class="WMEChatResizeScrollChat" style="position:absolute;Left:6px;bottom: 0px; color: #CC0000; background: #ffffff; border: 0px none !important; padding: 0px 0px 0px 0px;" title="MEChatResize Auto Scroll Running" type="button">v</button>');
        b.click(WMEChatResize.WMEChatResizeAutoScrollChatIsStopped);
        $("#autoscrolldiv").prepend(b);

        //stopped auto scrolling
        //position:absolute;Left:6px;bottom: 20px; Right:5px;color:#CC0000; background: #ffffff; border: 0px none !important; padding: 0px 0px 0px 0px;
        b = $('<button id="WMEChatResizeAutoScrollChatIsStopped" class="WMEChatResizeScrollChat" style="position:absolute;Left:6px;bottom: 0px; opacity: 100; color: #CC0000; background: #ffffff; border: 0px none !important; padding: 0px 0px 0px 0px;" title="MEChatResize Auto Scroll Stopped" type="button">-</button>');
        b.click(WMEChatResize.WMEChatResizeAutoScrollChatGo);
        $("#autoscrolldiv").prepend(b);
		*/

        //get the WMEChatResizeAutoScroll option
        window.WMEChatResizeAutoScroll = localStorage.getItem('WMEChatResizeAutoScroll');
        //alert(WMEChatResizeAutoScroll);

        if (WMEChatResizeAutoScroll == "" || WMEChatResizeAutoScroll == null) {
            //alert(WMEChatResizeAutoScroll);
            //} else {
            //alert("UR-Comments now has multiple User's comment lists that you may choose from. To select from the lists look under the settings section");
            WMEChatResizeAutoScroll ="Scroll";
            localStorage.setItem('WMEChatResizeAutoScroll', WMEChatResizeAutoScroll);
        }

        //if the user wants the chat scroll on enable auto scroll
        if(WMEChatResizeAutoScroll ==="Scroll"){
            // auto scroll buttons
            document.getElementById('WMEChatResizeAutoScrollChatIsRunning').style.visibility = "visible"; //
            document.getElementById('WMEChatResizeAutoScrollChatIsStopped').style.visibility = "hidden"; //
            //delay start auto scroll
            setTimeout( WMEChatResize.WMEChatScrollChatTimeout, 2000);
        } else {
            document.getElementById('WMEChatResizeAutoScrollChatIsRunning').style.visibility = "hidden"; //
            document.getElementById('WMEChatResizeAutoScrollChatIsStopped').style.visibility = "visible"; //
        }

        //hide my short chat button since the chat loads short
        //document.getElementById('WMEChatResizeShortChatHideUsers').style.visibility="hidden";		// < short hide users
        document.getElementById('WMEChatResizeTallHideUsers').style.visibility="hidden";			// > tall hide users
        document.getElementById('WMEChatResizeShortChatShowUsers').style.visibility="hidden";		// < short show users
        document.getElementById('WMEChatResizeTallShowUsers').style.visibility="hidden";			// > tall show users
        document.getElementById('WMEChatResizeShortChatHideUsers2').style.visibility="hidden";		// V short hide users
        document.getElementById('WMEChatResizeShortChatShowUsers2').style.visibility="hidden";		// V short show users
        document.getElementById('WMEChatResizeTallHideUsers2').style.visibility="hidden";			// ^ tall hide users
        //document.getElementById('WMEChatResizeTallShowUsers2').style.visibility="hidden";			// ^ tall show users
		document.getElementById('WMEChatResizeExtraShortChatHideUsers').style.visibility="visible";			// ^ tall show users

		//extra short chat
		//$("#chat WMEChatResizeExtraShortChatHideUsers").show();
		//extra short chat
		//$("#chat WMEChatResizeExtraShortChatHideUsers").hide();

		//hide / show the default minimize button
        //$("#chat .minimize").hide();

        //chat size buttons
        /*
        short hide users btn
        >	V
        WMEChatResize.ShortChatHideUsers

        short show users btn
        <	V
        WMEChatResize.ShortChatShowUsers


        tall hide users btn
        >	^
        WMEChatResize.TallHideUsers

        tall shown users btn
        <	^
        WMEChatResize.TallShowUsers

        //button IDs
        WMEChatResizeShortChatHideUsers
        WMEChatResizeTallHideUsers
        WMEChatResizeShortChatShowUsers
        WMEChatResizeTallShowUsers
        WMEChatResizeShortChatHideUsers2
        WMEChatResizeShortChatShowUsers2
        WMEChatResizeTallHideUsers2
        WMEChatResizeTallShowUsers2
        */

        // since the chat jumper link isn't always present I had to apply the style to the head
        var g = $('<style type="text/css">#ChatJumper-JUMP.ChatJumper, #ChatJumper-JUMP-clear { font-size: 11px !important; padding-left: 1px !important; padding-right: 1px !important; }</style>');
        $("head").append(g);

		//this is the container I use to apply css to the site
        //since sometime waze takes back over i am going to make a custom ccs that I edit the innerhtml
        var h = $('<style type="text/css" id="WMEChatResizeCSS">.list-unstyled {padding-left: 5px !important;}</style>');
        $("head").append(h);

        //move the chat all the way to the left
        //document.getElementById('chat-overlay').style.left="0px";

        //shrink down the chat title bar stuff to work with chat jumper

        //single-room-label
        var divsToModify = document.getElementsByClassName("single-room-label");
        for(var i = 0; i < divsToModify.length; i++) {
            divsToModify[i].style.fontSize="10px";
            divsToModify[i].style.paddingLeft="8px";
        }

        //dropdown-toggle
        var divsToModify = document.getElementsByClassName("dropdown-toggle");
        for(var i = 0; i < divsToModify.length; i++) {
			divsToModify[i].style.fontSize="10px";
            divsToModify[i].style.paddingLeft="5px";
            divsToModify[i].style.paddingRight="0px";
        }

        //status
        var divsToModify = document.getElementsByClassName("status");
        for(var i = 0; i < divsToModify.length; i++) {
            divsToModify[i].style.fontSize="11px";
        }


    };


	WMEChatResize.ChatResizeminchat = function(a) {
			//minimize the chat if chatresize's header is clicked

			//check to make sure we are not over any of our buttons
			if ($('#WMEChatResizeAutoScrollChatIsRunning').is(':hover') || $('#WMEChatResizeAutoScrollChatIsStopped').is(':hover') || $('#WMEChatResizeTallHideUsers').is(':hover') || $('#WMEChatResizeShortChatShowUsers').is(':hover') || $('#WMEChatResizeTallShowUsers').is(':hover') || $('#WMEChatResizeShortChatHideUsers2').is(':hover') || $('#WMEChatResizeShortChatShowUsers2').is(':hover') || $('#WMEChatResizeTallHideUsers2').is(':hover') || $('#WMEChatResizeTallShowUsers2').is(':hover') || $('#WMEChatResizeExtraShortChatHideUsers').is(':hover') || $('#WMEChatResizeShortChatHideUsers').is(':hover')) {
					//alert('mouse over buttons');

			} else {
				//click the chat toggle button (chat balloon)_
				//$('#chat-overlay.open .toggle').trigger('click');
			}
	};

    WMEChatResize.WMEChatResizeAutoScrollChatIsStopped = function() {
        //console.log("WME Chat Resizer - Clicked Stop Auto Scrolling Chat");
        //The button that showed auto scroll is running "V" was clicked turn off autoscroll and hide/ show buttons

        //window.WMEChatResizeAutoScrollOnOff = "Off";
        //WMEChatResizeAutoScrollOnOff == "Off"
    		document.getElementById('WMEChatResizeAutoScrollChatIsRunning').style.visibility = "hidden";
		    document.getElementById('WMEChatResizeAutoScrollChatIsStopped').style.visibility = "visible";

        //save the autoscroll setting
            WMEChatResizeAutoScroll ="NoScroll";
            localStorage.setItem('WMEChatResizeAutoScroll', WMEChatResizeAutoScroll);
    };


    WMEChatResize.WMEChatResizeAutoScrollChatGo = function() {

        //The button that showed auto scroll is off "-" was clicked turn on autoscroll and hide/ show buttons
        //console.log("WME Chat Resizer - Clicked Scroll to bottom of chat");

        //auto scroll btns
        //WMEChatResizeAutoScrollOnOff == "On"
        document.getElementById('WMEChatResizeAutoScrollChatIsRunning').style.visibility = "visible";
        document.getElementById('WMEChatResizeAutoScrollChatIsStopped').style.visibility = "hidden";

        //save the autoscroll setting
        WMEChatResizeAutoScroll ="Scroll";
        localStorage.setItem('WMEChatResizeAutoScroll', WMEChatResizeAutoScroll);

        //set the timeout to launch the function that does the scrolling of the chat
		    setTimeout( WMEChatResize.WMEChatScrollChatTimeout, 5000);
    };


    WMEChatResize.WMEChatScrollChatTimeout = function() {

            if (document.getElementById('WMEChatResizeAutoScrollChatIsRunning').style.visibility == "visible") {
                //scroll the chat to the divs length
                //console.log($("#chat .chat-body .messages .message-list").scrollHeight);
                //console.log($("#chat .chat-body .messages .message-list").scrollTop());

                var elem = $("#chat .chat-body .messages .message-list");
                if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight()) {
                    //bottom of chat
                    //console.log("WMEChatResize - Chat is All Ready At The Bottom");
                } else {

                    $("#chat .chat-body .messages .message-list").scrollTop($("#chat .chat-body .messages .message-list")[0].scrollHeight+10000);


					//the count was possible killing browser, disabled to be on the safe side
                    //WMEChatResizeAutoScrollChatCount++;;
                    //$("#WMEChatResizeAutoScrollChatIsRunning").html(WMEChatResizeAutoScrollChatCount);
                    //console.log("WMEChatResize - Scrolling Down To The Bottom Of Chat; " + WMEChatResizeAutoScrollChatCount + " Times.");
					//console.log("WMEChatResize - Scrolling Down To The Bottom Of Chat");
                }

            }
           setTimeout(WMEChatResize.WMEChatScrollChatTimeout, 5000);
                    /*
                    //send text to the chat message area
                    b = $('<div id="rickzabel" class="message normal-message"><div class="from">RickZabel</div><div class="body"><div style="direction: ltr; text-align: left;">testing</div>');
                    // b.click (WMEChatResize.TallShowUsers);
                    $("#chat .chat-body .messages .message-list").append(b);
                    */
    };


    WMEChatResize.ShortChatHideUsers = function() {
        //alert("ShortChatHideUsers");
        //console.log("WME Chat Resizer - ShortChatHideUsers");
        // adjust my buttons
        document.getElementById('WMEChatResizeShortChatHideUsers').style.visibility="hidden";		// < short hide users
        document.getElementById('WMEChatResizeTallHideUsers').style.visibility="hidden";			// > tall hide users
        document.getElementById('WMEChatResizeShortChatShowUsers').style.visibility="visible";		// < short show users
        document.getElementById('WMEChatResizeTallShowUsers').style.visibility="hidden";			// > tall show users
        document.getElementById('WMEChatResizeShortChatHideUsers2').style.visibility="hidden";		// V short hide users
        document.getElementById('WMEChatResizeShortChatShowUsers2').style.visibility="hidden";		// V short show users
        document.getElementById('WMEChatResizeTallHideUsers2').style.visibility="visible";			// ^ tall hide users
        document.getElementById('WMEChatResizeTallShowUsers2').style.visibility="hidden";			// ^ tall show users

		document.getElementById('WMEChatResizeExtraShortChatHideUsers').style.visibility="visible";			// ^ tall show users

        var WMEChatResizeStringer = "";

        //hide users list
        WMEChatResizeStringer = WMEChatResizeStringer + ".users {visibility: hidden !important; width: 195px !important;}";

        //document.getElementById('chat').style.width="310px ";  //497
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat {width: 360px  !important; }";

        //chat-body
        WMEChatResizeStringer = WMEChatResizeStringer + ".chat-body {width: 360px  !important;}";

        //messages
        WMEChatResizeStringer = WMEChatResizeStringer + ".messages {width: 348px !important; border-right: 0px solid rgba(126, 126, 126, 0.26)!important;}";

        //message-list
        //WMEChatResizeStringer = WMEChatResizeStringer + ".message-list {width: 310px ; max-height: 246px;}"
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat-overlay #chat .messages .message-list {width: 360px  !important; top: 76px !important; bottom: 0px !important; position: absolute !important; max-height: 90% !important;}";

        //new-message
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat .messages .new-message {width: 100% !important;}";

        //message-input
        WMEChatResizeStringer = WMEChatResizeStringer + ".message-input {width: 100% !important;}";

        //unread-messages-notification width
        WMEChatResizeStringer = WMEChatResizeStringer + ".unread-messages-notification {width: 251px !important;}";

		//.list-unstyled Chataddon padding fix
		WMEChatResizeStringer = WMEChatResizeStringer + ".list-unstyled {padding-left: 5px !important;}"

        document.getElementById("WMEChatResizeCSS").innerHTML = WMEChatResizeStringer;
    };


    WMEChatResize.ShortChatShowUsers = function() {
        //alert("ShortChatShowUsers");
		//console.log("WME Chat Resizer - ShortChatShowUsers");
        // adjust my buttons
        document.getElementById('WMEChatResizeShortChatHideUsers').style.visibility="visible";		// < short hide users
        document.getElementById('WMEChatResizeTallHideUsers').style.visibility="hidden";			// > tall hide users
        document.getElementById('WMEChatResizeShortChatShowUsers').style.visibility="hidden";		// < short show users
        document.getElementById('WMEChatResizeTallShowUsers').style.visibility="hidden";			// > tall show users
        document.getElementById('WMEChatResizeShortChatHideUsers2').style.visibility="hidden";		// V short hide users
        document.getElementById('WMEChatResizeShortChatShowUsers2').style.visibility="hidden";		// V short show users
        document.getElementById('WMEChatResizeTallHideUsers2').style.visibility="hidden";			// ^ tall hide users
        document.getElementById('WMEChatResizeTallShowUsers2').style.visibility="visible";			// ^ tall show users

		//extra short chat
		document.getElementById('WMEChatResizeExtraShortChatHideUsers').style.visibility="visible";			// ^ tall show users


        var WMEChatResizeStringer = "";

        //WMEChatResizeStringer = WMEChatResizeStringer + "#chat {height: 357px;}"

        //show users
        WMEChatResizeStringer = WMEChatResizeStringer + ".users {visibility: visible !important; width: 195px !important;}";

        //#chat
        //WMEChatResizeStringer = WMEChatResizeStringer + "#chat {width: 497px !important;}"; //derived width 620 px
		WMEChatResizeStringer = WMEChatResizeStringer + "#chat {width: 620px !important;}"; //derived width 620 px


        //chat-body
        //WMEChatResizeStringer = WMEChatResizeStringer + ".chat-body {width: 497px !important;}"; //derived width 620 px
		WMEChatResizeStringer = WMEChatResizeStringer + ".chat-body {width: 620px !important;}"; //derived width 620 px

        //messages
        //WMEChatResizeStringer = WMEChatResizeStringer + ".messages {width: 349px !important;}"; //427
		WMEChatResizeStringer = WMEChatResizeStringer + ".messages {width: 427px !important;}"; //427


        //message-list
        //WMEChatResizeStringer = WMEChatResizeStringer + ".message-list {width: 348px !important; max-height: 246px !important;}";
		//derived 396
		WMEChatResizeStringer = WMEChatResizeStringer + ".message-list {width: 396px !important; width: auto!important; max-height: 246px !important;}";

        //new-message
        //WMEChatResizeStringer = WMEChatResizeStringer + ".new-message {width: 349px !important;}"; //427
		WMEChatResizeStringer = WMEChatResizeStringer + ".new-message {width: 427px !important;}"; //427

        //message-input
        WMEChatResizeStringer = WMEChatResizeStringer + ".message-input {width: 100% !important;}";

        //unread-messages-notification
        //WMEChatResizeStringer = WMEChatResizeStringer + ".unread-messages-notification {width: 322px !important;}"; //427
		WMEChatResizeStringer = WMEChatResizeStringer + ".unread-messages-notification {width: 427px !important;}"; //427

		//.list-unstyled Chataddon padding fix
		WMEChatResizeStringer = WMEChatResizeStringer + ".list-unstyled {padding-left: 5px !important;}"

        document.getElementById("WMEChatResizeCSS").innerHTML = WMEChatResizeStringer;


    };


    WMEChatResize.TallHideUsers = function() {
        //alert("TallHideUsers");
        //WMEChatResizeHeight = "tall";
        //console.log("WME Chat Resizer - TallHideUsers");
        // adjust my buttons
        document.getElementById('WMEChatResizeShortChatHideUsers').style.visibility="hidden";		// < short hide users
        document.getElementById('WMEChatResizeTallHideUsers').style.visibility="hidden";			// > tall hide users
        document.getElementById('WMEChatResizeShortChatShowUsers').style.visibility="hidden";		// < short show users
        document.getElementById('WMEChatResizeTallShowUsers').style.visibility="visible";			// > tall show users
        document.getElementById('WMEChatResizeShortChatHideUsers2').style.visibility="visible";		// V short hide users
        document.getElementById('WMEChatResizeShortChatShowUsers2').style.visibility="hidden";		// V short show users
        document.getElementById('WMEChatResizeTallHideUsers2').style.visibility="hidden";			// ^ tall hide users
        document.getElementById('WMEChatResizeTallShowUsers2').style.visibility="hidden";			// ^ tall show users

		document.getElementById('WMEChatResizeExtraShortChatHideUsers').style.visibility="visible";			// ^ tall show users

        var WMEChatResizeStringer = "";

        //chat
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat {height: 100% !important; width: 360px  !important;}";

        //chat-body
        WMEChatResizeStringer = WMEChatResizeStringer + ".chat-body {height: 96% !important; width: 360px  !important;}";

        //messages
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat .messages {height: 95% !important; width: 348px !important; border-right: 0px solid rgba(126, 126, 126, 0.26)!important;}";

        WMEChatResizeStringer = WMEChatResizeStringer + "#chat-overlay #chat .messages .message-list {width: 360px  !important;height: auto!important;  top: 76px !important; bottom: 0px !important; position: absolute !important; max-height: 90% !important;}";

        //hide users list
        WMEChatResizeStringer = WMEChatResizeStringer + ".users {visibility: hidden !important; width: 195px !important;}";

        //unread-messages-notification
        WMEChatResizeStringer = WMEChatResizeStringer + ".unread-messages-notification {width: 251px !important;}";

        //new-message
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat .messages .new-message {width: 100% !important;}";

        //chat-overlay
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat-overlay {bottom: 26px !important; height: 85% !important;}";

		//.list-unstyled Chataddon padding fix
		WMEChatResizeStringer = WMEChatResizeStringer + ".list-unstyled {padding-left: 5px !important;}"

        // lets build up a string and set that as the innerhtml
        document.getElementById("WMEChatResizeCSS").innerHTML = WMEChatResizeStringer;

    };


    WMEChatResize.TallShowUsers = function() {
        //alert("TallShowUsers");
        //WMEChatResizeHeight = "tall";
        //console.log("WME Chat Resizer - TallShowUsers");
        // adjust my buttons
        document.getElementById('WMEChatResizeShortChatHideUsers').style.visibility="hidden";		// < short hide users
        document.getElementById('WMEChatResizeTallHideUsers').style.visibility="visible";			// > tall hide users
        document.getElementById('WMEChatResizeShortChatShowUsers').style.visibility="hidden";		// < short show users
        document.getElementById('WMEChatResizeTallShowUsers').style.visibility="hidden";			// > tall show users
        document.getElementById('WMEChatResizeShortChatHideUsers2').style.visibility="hidden";		// V short hide users
        document.getElementById('WMEChatResizeShortChatShowUsers2').style.visibility="visible";		// V short show users
        document.getElementById('WMEChatResizeTallHideUsers2').style.visibility="hidden";			// ^ tall hide users
        document.getElementById('WMEChatResizeTallShowUsers2').style.visibility="hidden";			// ^ tall show users

		document.getElementById('WMEChatResizeExtraShortChatHideUsers').style.visibility="visible";			// ^ tall show users

        var WMEChatResizeStringer = "";

        //chat
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat {width: 497px !important; height: 100% !important;}";

        //chat-body
        WMEChatResizeStringer = WMEChatResizeStringer + ".chat-body {width: 497px !important; height: 96% !important;}";

        //messages
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat .messages {width: 482px !important; height: 95% !important;}";

        //message-list
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat-overlay #chat .messages .message-list {width: 349px !important; height: auto!important; top: 76px !important; bottom: 0px !important; position: absolute !important; max-height: 90% !important;}";

        //users
        WMEChatResizeStringer = WMEChatResizeStringer + ".users {height: 99% !important; max-height: 91% !important; width: 195px !important;}";

        //chat-overlay
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat-overlay {bottom: 26px !important; height: 85% !important;}";

        //new-message
        WMEChatResizeStringer = WMEChatResizeStringer + ".new-message {width: 349px !important;}";

        //message-input
        WMEChatResizeStringer = WMEChatResizeStringer + ".message-input {width: 100% !important;}";

        //unread-messages-notification
        WMEChatResizeStringer = WMEChatResizeStringer + ".unread-messages-notification {width: 322px !important;}";

		//.list-unstyled Chataddon padding fix
		WMEChatResizeStringer = WMEChatResizeStringer + ".list-unstyled {padding-left: 5px !important;}"

        // lets build up a string and set that as the innerhtml
        document.getElementById("WMEChatResizeCSS").innerHTML = WMEChatResizeStringer;

    };

    WMEChatResize.ExtraShortChatHideUsers = function() {
        //alert("ExtraShortChatHideUsers");
		//console.log("WME Chat Resizer - ExtraShortChatHideUsers");
        // adjust my buttons
        document.getElementById('WMEChatResizeShortChatHideUsers').style.visibility="hidden";		// < short hide users
        document.getElementById('WMEChatResizeTallHideUsers').style.visibility="hidden";			// > tall hide users
        document.getElementById('WMEChatResizeShortChatShowUsers').style.visibility="visible";		// < short show users
        document.getElementById('WMEChatResizeTallShowUsers').style.visibility="hidden";			// > tall show users
        document.getElementById('WMEChatResizeShortChatHideUsers2').style.visibility="hidden";		// V short hide users
        document.getElementById('WMEChatResizeShortChatShowUsers2').style.visibility="hidden";		// V short show users
        document.getElementById('WMEChatResizeTallHideUsers2').style.visibility="visible";			// ^ tall hide users
        document.getElementById('WMEChatResizeTallShowUsers2').style.visibility="hidden";			// ^ tall show users

		document.getElementById('WMEChatResizeExtraShortChatHideUsers').style.visibility="hidden";			// ^ tall show users


        var WMEChatResizeStringer = "";

        //hide users list
        WMEChatResizeStringer = WMEChatResizeStringer + ".users {visibility: hidden !important; width: 195px !important;}";

        //document.getElementById('chat').style.width="310px ";  //497
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat {height: 200px !important; width: 400px !important; }"; //width: 310px

        //chat-body
        WMEChatResizeStringer = WMEChatResizeStringer + ".chat-body {width: 400px !important;}"; //width: 310px

        //messages
        WMEChatResizeStringer = WMEChatResizeStringer + ".messages {width: 400px !important; border-right: 0px solid rgba(126, 126, 126, 0.26)!important;}"; //width: 348px

		//#chat-overlay
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat-overlay {height: 200px !important}";


        //message-list
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat-overlay #chat .messages .message-list {width: 400px !important; top: 76px !important; bottom: 0px !important; position: absolute !important; max-height: 90% !important; min-height: 0px !important;}"; //width: 310px

        //new-message
        WMEChatResizeStringer = WMEChatResizeStringer + "#chat .messages .new-message {width: 100% !important;}";

        //message-input
        WMEChatResizeStringer = WMEChatResizeStringer + ".message-input {width: 100% !important;}";

        //unread-messages-notification width
        WMEChatResizeStringer = WMEChatResizeStringer + ".unread-messages-notification {width: 251px !important;}";

		//.list-unstyled Chataddon padding fix
		WMEChatResizeStringer = WMEChatResizeStringer + ".list-unstyled {padding-left: 5px !important;}"

        document.getElementById("WMEChatResizeCSS").innerHTML = WMEChatResizeStringer;
    };

    WMEChatResize.startcode = function () {
        // Check if WME is loaded, if not, waiting a moment and checks again. if yes init WMEChatResize
        try {
            //if ("undefined" != typeof unsafeWindow.W.model.chat.rooms._events.listeners.add[0].obj.userPresenters[unsafeWindow.W.model.loginManager.user.id] ) {
            if ( $( "#chat" ).length ) {
				//console.log("WMEChatResize ready to resize");
                WMEChatResize.init();
            } else {
                setTimeout(WMEChatResize.startcode, 200);
            }
        } catch(err) {
            setTimeout(WMEChatResize.startcode, 200);
        }
    };
    //setTimeout(WMEChatResize.startcode, 5000);
    WMEChatResize.startcode();
}

WMEChatResize_init();
