// ==UserScript==
// @name        InstaSynch emote list
// @description Shows a list of available emotes, hidden by default and toggled by button. Click on an emote to post it.
// @namespace   oh no oh god oh man og nafaasdasd
// @include     http://instasync.com/r/*
// @version     1.23
// @run_at      document_end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5484/InstaSynch%20emote%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/5484/InstaSynch%20emote%20list.meta.js
// ==/UserScript==

$("<style type='text/css'> .poll.always-active{ box-shadow:0px 0px 8px rgba(0,0,0,0.25); background-color:#FFF !important;} </style>").appendTo("head");

// post a message
function sendMessage(message){
    $('#cin').val(message);
    $('#cin').trigger({ type : 'keypress', which : 13 });
}
sndmsg_pre = "$(\"#cin\").val(\""
sndmsg_post = "\");$(\"#cin\").trigger({ type : \"keypress\", which : 13 });"

function toDo(){
	var emotes_button = $("\
<button id='emotes' class='btn btn-xs btn-default' onclick='javascript: $(\"#poll_column.emotes\").toggle();' style='margin-left: 4px; margin-bottom: 6px;'>Emotes</button>");
	if($(".mod-control").is(":visible")){
		emotes_button.insertAfter("#create_poll_btn_column");
	}
	else{
		emotes_button.insertBefore(".mod-control");
	}
  emote_container=$("\
<div id='poll_column' class='emotes poll'><div class='poll always-active' style='overflow: auto;vertical-align: middle;height: 200px;'></div></div>").insertAfter("#poll_column")
  for(code in $codes){
    emote_container.find(">:first-child").append("<tr onclick='javascript:"+sndmsg_pre+"/"+code+sndmsg_post+"'><td style='padding:5px 0px 5px 5px;'>"+code+":</td><td style='padding:5px 5px 5px 0px;'>"+$codes[code]+"</td></tr>")
  }
  emote_container.toggle();
}


// gotta delay the script to allow other scripts to settle down
setTimeout(toDo,2500);