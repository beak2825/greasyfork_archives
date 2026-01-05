// ==UserScript==
// @name    	dA_ignore
// @namespace   dA_ignore
// @author  	Dediggefedde
// @description ignores people on dA
// @match   	*://*.deviantart.com/*
// @require   	 http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @version 	2.7
// @grant   	GM.setValue
// @grant   	GM.getValue
// @grant   	GM.xmlHttpRequest
// @grant       GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/5764/dA_ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/5764/dA_ignore.meta.js
// ==/UserScript==

/* globals $*/
/* globals DiFi*/

let ignorenames = [];
let wordlist = [];
let settings = {
	hideComments: false,
	hideMessages: true,
	deleteMessages: true,
	hideProfile: true,
	hideDeviations: true,
	submitHideRequest: true,
	autoIgnore: false,
};
let msgbox;
let antiBounce = new Date();
let bounceInterval=500;
let viewtimer=null;
let ctrlDown=false;
let shiftDown=false;
let  hoverDisabled=false;

GM_addStyle(`
#dA_ignore_notify p {
  font-weight: bold;
  text-align: center;
  margin: 0;
  color: var(--g-typography-secondary);
}
#dA_ignore_notify{
  position: fixed;
  width: 400px;
  display: block;
  top: 0%;
  background-color: var(--g-bg-tertiary);
  padding: 10px;
  border-radius: 0 10px 10px 0;
  border: 1px solid var(--g-divider1);
  box-shadow: 1px 1px 2px var(--g-bg-primary);
  transition:left;
  transition-duration:0.5s;
  transform: translateY(100%) translateY(10px);
  color: var(--g-typography-primary);
}
button.dA_ignore_popupbtn{
  text-transform:uppercase;
  background:linear-gradient(242deg,#f00,#ddef31);
  border:none;
  cursor:pointer;
  margin:5px;
  position:absolute;
  right:10px;
  top:10px;
}
button.dA_ignore_popupbtn:active{
  filter:brightness(1.1);
}
body.dA_ignore_hoverDisabled .user-link {
  cursor: no-drop;
}
`);

async function loadsettings() {
	let Zignorenames = await GM.getValue('blocklist', null);
	if (Zignorenames != null) ignorenames = Zignorenames.split('\n');
	let Zwordlist = await GM.getValue('wordlist', null);
	if (Zwordlist != null) wordlist = Zwordlist.split('\n');
	let Zsettings = await GM.getValue('settings', null);
	if (Zsettings != null) settings = $.parseJSON(Zsettings);

	if (settings.hideComments == null) settings.hideComments = true;
	if (settings.hideMessages == null) settings.hideMessages = false;
	if (settings.deleteMessages == null) settings.deleteMessages = true;
	if (settings.hideProfile == null) settings.hideProfile = true;
	if (settings.hideDeviations == null) settings.hideDeviations = true;
	if (settings.autoIgnore == null) settings.autoIgnore = false;
}

function inIgnoreList(name) { //n array of string
	let rex;
	for (let n of name) {
    	if (n == "" || n == null) continue;
    	for (let i of ignorenames) {
        	if (i[0] == '#') {
            	rex = new RegExp(i.substr(1), "i");
            	if (rex.test(n.toLowerCase())) {
                	return true;
            	}
        	} else {
            	if (n.toLowerCase() == i.toLowerCase()) return true;
        	}
    	}
	}
	return false;
}

function notify(text){
    msgbox.innerHTML="<p>dA_ignore</p>"+text;
    msgbox.style.left="0px";
    if(viewtimer!=null)clearTimeout(viewtimer);
    viewtimer=setTimeout(()=>{msgbox.style.left="-450px";},2000);
}

function ignoreIndex(nam){
    return ignorenames.findIndex(item => nam.toLowerCase() === item.toLowerCase());
}

function unIgnoreName(nam,reload){
    let foundindex = ignoreIndex(nam);
    if(foundindex==-1){
        alert("Unable to remove an ignore of '"+$(this).attr("userid")+"'.\nPlease report the issue to developer of da_ignore at https://www.deviantart.com/dediggefedde/art/dA-Ignore-455554874.");
    }
    ignorenames.splice(foundindex, 1);
    notify(`${nam} no longer ignored!`);
    setTimeout(() => {
        GM.setValue('blocklist', [...new Set(ignorenames)].join("\n"));
        if(reload){
            location.reload();
        }
    }, 0);
}

function ignoreName(nam,reload){
    let foundindex = ignoreIndex(nam);
    if(foundindex>=0){
        notify(`${nam} already ignored!`);
        return;
    }
    ignorenames.push(nam.toLowerCase());
    notify(`${nam} ignored!`);
    setTimeout(() => {
        GM.setValue('blocklist', [...new Set(ignorenames)].join("\n"));
        if(reload){
            location.reload();
        }
    }, 0);
}

function pruf(mutationList, observer){
	init();

    const profPopup=document.querySelector("[data-popper-escaped]:not([dA_ignore])");
    if(profPopup){ //ignored users should not appear in first place
        const nam=profPopup.querySelector("a[data-username]").dataset.username;
        const popupUsernameTex=profPopup.querySelector("a[data-username] span").parentElement.parentElement;
        const ignInd=ignoreIndex(nam);
        popupUsernameTex.insertAdjacentHTML("beforeend",`<button class='dA_ignore_popupbtn'>${ignInd==-1?"":"Un"}ignore</button>`);
        popupUsernameTex.querySelector("button.dA_ignore_popupbtn").addEventListener("click",(ev)=>{
            if(ignInd==-1){
                ignoreName(nam,false);
            }else{
                unIgnoreName(nam,true);
            }
        });
        profPopup.setAttribute("dA_ignore",1);
    }

    //ignore phrases automatically
    if (settings.autoIgnore) {
        wordlist.forEach(function(word, i) {
            // Check if the current page is the notifications page
            if (location.href.includes('deviantart.com/notifications')) {
                // Select all comments on the page
                let comments = $('[data-commentid]>div');
                // Iterate through each comment
                comments.each(function () {
                    let username = $(this).closest('section').find('a.user-link').first().data("username").toLowerCase();
                    if(inIgnoreList(username))return; //skip already ignored comments

                    let commentTextRaw = $(this).text()
                    let commentText = commentTextRaw.toLowerCase();
                    if(word=="")return;
                    if(commentText=="")return;

                    // Check if the comment contains the specified word
                    let rex=new RegExp("\\b"+word+"\\b","i");

                    if (rex.test(commentText) && !$(this).hasClass('flagged')){//commentText.includes(word.toLowerCase()) && !$(this).hasClass('flagged')) {
                        $(this).addClass('flagged');
                        let username = $(this).closest('section').find('a.user-link').first().data("username").toLowerCase();

                        // Check if the username is in the blocklist
                        if (!ignorenames.includes(username)) {
                            ignorenames.push(username);
                            notify(username + " was blocked automatically!");
                            setTimeout(() => {
                                GM.setValue('blocklist', [...new Set(ignorenames)].join("\n")); //save unique array
                            }, 0);
                        }
                    }
                });
            }
        });
    }

    //add unhide buttons
    let spambut = $("div[data-commentid]").filter(function(ind, el) { return el.innerText == "COMMENT HIDDEN"; });
    if (spambut.length > 0 && $("#daIgnore_Unhide").length == 0) {
        let unhidebutton = $("<button id='daIgnore_Unhide'>UnHide</button>")
        .css({
            "position": "absolute",
        	"top": "0",
        	"right": "0",
        	"border": "0",
        	"background-color": "#fff",
        	"cursor": "pointer",
    	});
    	spambut.append(unhidebutton);

    	let dUrl = $('meta[property="og:url"]').attr('content');
    	let deviationID = /(\d+)$/.exec(dUrl);
    	if (deviationID != null) { //deviation
        	deviationID = deviationID[1];
    	} else { //profile
        	deviationID = $("header[data-hook=top_nav] a.user-link").data("userid");
    	}
    	let token = $("input[name=validate_token]").val();
    	let commentid = spambut.data("commentid");

    	unhidebutton.click(function() {
        	let dat = {
            	"itemid": deviationID,
            	"commentid": commentid,
            	"csrf_token": token.toString()
        	};
        	GM.xmlHttpRequest({
            	method: "POST",
            	url: "https://www.deviantart.com/_napi/shared_api/comments/unhide",
            	headers: {
                	"accept": 'application/json, text/plain, */*',
                	"content-type": 'application/json;charset=UTF-8'
            	},
            	dataType: 'json',
            	data: JSON.stringify(dat),
            	onerror: function(response) {
                	console.error("error:", response);
            	},
            	onload: async function(response) {
                	spambut.find("button").first().click();
            	}
        	});
    	});
	}

    //check visible usernames to be in ignorelist. bnam is results.
	let bnam = $('a.u:not(notignore),a.user-link:not(notignore),div.tt-a:not(notignore),img.avatar:not(notignore)').attr('notignore', '').filter(function() {
    	return inIgnoreList([$(this).text(), $(this).attr("username"), $(this).attr("title")]);
	});
	if (bnam.length == 0) return;

    //hide thumbnails in overview
	if (settings.hideDeviations) {
    	let thumbs = $("div[data-testid=\"thumb\"]:not(notignore)").attr("notignore", "").filter((id, dl) => {
        	let el = $(dl).closest("a");//.find("a[data-hook=\"deviation_link\"]");
        	if (el.length > 0) el = el.attr("href");
        	else return false;
        	el = el.match(/deviantart.com\/(.*?)\//);
        	if (!el || el.length == 1) return false;
        	return inIgnoreList([el[1]]);
    	});
    	thumbs.remove();
	}

    //hide the profile page, add unignore buttons

	if (settings.hideProfile &&
    	$("#ignore_page_placeholder").length == 0 &&
    	$("#nav").length > 0 &&
    	inIgnoreList([location.href.match(/deviantart\.com\/(.*)($|\/)/i)[1]])
   	) {
    	let replaceSite = '<div align=center style="position: relative;" id="ignore_page_placeholder"><img src="http://fc01.deviantart.net/fs46/f/2009/196/d/4/d49e01f2265f3024db7194a3622a415f.png" alt="user blocked" /><h1>You blocked this user!</h1></div>';
    	let contentContainter=document.querySelector("[data-moduleid]")?.parentElement?.parentElement?.parentElement;
        if(contentContainter==null){
            let flb=document.querySelector("body>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(3)>div:nth-of-type(1)>div:nth-of-type(2)");
            if(flb==null){
                alert("Website structure changed. Please request an update from the developer of da_ignore at https://www.deviantart.com/dediggefedde/art/dA-Ignore-455554874.");
            }
            return;
        }
        contentContainter.innerHTML=replaceSite;

    	let ignorebut = $("#da_ignore_but").html("UnIgnore")
    	.attr({ "title": "remove from your ignore-list", "id": "da_unignore_but" })
    	.off("click");

    	ignorebut.click(function(){
            let nam=$(this).attr("username");
            unIgnoreName(nam,true);
        });

    	let usernam = document.querySelector("h1 a.user-link[data-username]").dataset.username.toLowerCase();
    	ignorebut.attr("username", usernam);
    	return;
	}

    //delete notifications (comments etc) by clicking on the "X"/Trashcan
	if (settings.deleteMessages && location.href.includes("deviantart.com/notifications")) {
    	bnam.closest("section").find("button[aria-label=Remove]").click();
	} else if (bnam.filter("img.avatar").closest("div.grf-deviants").length > 0) {
    	bnam.filter("img.avatar").closest("span.f").remove();
    	bnam.filter("img.avatar").closest("div.grf-deviants").remove();
	}
	if (bnam.filter("img.avatar").closest('a').length > 0) {
    	bnam.filter("img.avatar").closest("a").remove();
	}

    //submit hiderequest for comments
	if (settings.submitHideRequest) {
    	let dUrl = $('meta[property="og:url"]').attr('content');
    	let deviationID = /(\d+)$/.exec(dUrl);
    	if (deviationID != null) { //deviation
        	deviationID = deviationID[1];
    	} else { //profile
        	deviationID = $("header[data-hook=top_nav] a.user-link").data("userid");
    	}

    	let token = $("input[name=validate_token]").val();
    	let els = bnam.closest("div[data-nc]");


    	els.not(".ccomment-hidden").addClass("ccomment-hidden").each((i, el) => {
        	let simg = el.querySelector('[data-hook="deviation_link"]');
        	let username = el.querySelector('[data-hook="user_link"]').getAttribute('data-username');
        	el = el.querySelector("div[data-commentid]");

            if(el!=null){
                let con = el.querySelector(".public-DraftStyleDefault-ltr");
             //   el=el.textContent;

                //if(!el.querySelector('span.public-DraftStyleDefault-ltr').hasClass('flagged')) {
                //}

                if (simg != null) { //deviation
                    deviationID = /(\d+)$/.exec(simg);
                    deviationID = deviationID[1];
                }

                let dat = {
                    "itemid": deviationID,
                    "commentid": $(el).data("commentid"),
                    "csrf_token": token.toString()
                };
                GM.xmlHttpRequest({
                    method: "POST",
                    url: "https://www.deviantart.com/_napi/shared_api/comments/hide",
                    headers: {
                        "accept": 'application/json, text/plain, */*',
                        "content-type": 'application/json;charset=UTF-8'
                    },
                    dataType: 'json',
                    data: JSON.stringify(dat),
                    onerror: function(response) {
                        console.error("error:", response);
                    },
                    onload: async function(response) {
                    }
                });
            }

    	});
	}

    //hide messages/comments with the usernames closest section
	if (settings.hideMessages && location.href.includes("deviantart.com/notifications")) {
    	bnam.closest("section").remove();
	}

    //hide comments with the username's closest div.ccomment
	if (settings.hideComments) {
    	let cContainer = bnam.closest('div[data-hook=comments_thread_item]');
    	cContainer.remove();
    	bnam.closest('div.ccomment').remove(); //eclipse
        bnam.closest("div[data-indent]").remove();
	}
	if (settings.hideComments && bnam.parents('div.deviation-full-minipage').length > 0) {
    	bnam.parents('div.deviation-full-minipage').prev("div.deviation-full-container").remove();
    	bnam.parents('div.deviation-full-minipage').remove();
	}

}

function init(){
    document.querySelectorAll('.user-link').forEach(link => {
        const el=link.parentElement.parentElement.parentElement.parentElement.parentElement;
        el.addEventListener('mouseout', function(event) {
            if(hoverDisabled){
                event.preventDefault();
                event.stopPropagation();
                return;
            }
        });
    });

    //is profile, add ignorebutton
	if ($("#nav").length > 0) {
    	if ($("#da_ignore_but").length == 0 && $("#da_unignore_but").length==0) {

        	let ignoreBut = $('<button id="da_ignore_but"  title="Add to your ignore-list">Ignore</button>');
        	let nav = $("#nav").closest("nav");
        	nav.append(ignoreBut);

        	ignoreBut.css("background-image", "linear-gradient(242deg,#f00,#ddef31)")
            	.attr("class", ignoreBut.prev().find("button").last().attr("class"))
            	.click(function() {
                notify("Ignore-list updated!");
            	ignorenames.push(document.querySelector("h1 a.user-link[data-username]").dataset.username.toLowerCase());
            	setTimeout(() => {
                	GM.setValue('blocklist', [...new Set(ignorenames)].join("\n")); //save unique array
            	}, 0);
        	});
    	}
	}

    if(!document.querySelector("#dA_ignore_notify")){
        msgbox=document.createElement("div");
        msgbox.id="dA_ignore_notify";
        msgbox.style.left="-450px";
        document.body.append(msgbox);
    }

    let extadnam=[...document.querySelectorAll(".dA_ignore_externalAddName")];
    if(extadnam.length>0){
        extadnam.forEach(el=>{
            let username=el.innerHTML;
            if (!ignorenames.includes(username)) {
                ignorenames.push(username);
                notify(username + " was blocked automatically!");
                setTimeout(() => {
                    GM.setValue('blocklist', [...new Set(ignorenames)].join("\n")); //save unique array
                }, 0);
            }
            el.remove();
        });
    }

	//settings page, add custom settings
	if (location.href.indexOf('https://www.deviantart.com/settings') == 0 && $("#dA_ignore_settings").length==0) {
    	let ignoremenu = $('<li id="dA_ignore_settings"><a href="#">Ignore User</a></li>');
    	$('#settings_public').parent().after(ignoremenu);
    	ignoremenu.find('a').click(function() {
        	$('a.active').removeClass('active');
        	$(this).addClass('active');
        	$('div.settings_form').html('' +
                                    	'<div class="fooview ch">' +
                                    	'<div class="fooview-inner">' +
                                    	'<h3>Ignore Users</h3>' +
                                    	'<span>Separate usernames by linebreaks!</span>' +
                                    	'<fieldset style="border:none;padding:0;">' +
                                    	'<textarea cols="70" rows="4" class="itext_uplifted" id="da_ignore_textarea">' + ignorenames.join('\n') + '</textarea>' +
                                    	'</fieldset>' +
                                    	'<div class=" buttons ch hh " id="submit">' +
                                    	'<div style="text-align:right" class="rr">' +
                                    	'<a class="smbutton smbutton-green" href="javascript:void(0)"><span id="da_ignore_saveblocklist">Save</span></a>' +
                                    	'</div></div></div></div>' +
                                    	'' +
                                    	'<div class="fooview ch">' +
                                    	'<div class="fooview-inner">' +
                                    	'<h3>Behavior</h3>' +
                                    	'<div class="altaltview altaltview-wider">' +
                                    	'<div class="row">' +
                                    	'<input ' + (settings.hideComments ? 'checked="checked"' : '') + ' type="checkbox" value="1" id="da_ignore_hideComments" class="icheckbox">' +
                                    	'<label for="da_ignore_hideComments" class="l">Hide Comments</label>' +
                                    	'<br><small>This will automatically <strong>hide</strong> comments and replies made by an ignored user. This affects all Submissions. Other People can still see comments hidden like this.</small>' +
                                    	'</div>' +
                                    	'<div class="browse-sitback row">' +
                                    	'<input ' + (settings.hideMessages ? 'checked="checked"' : '') + ' type="radio" value="1" id="da_ignore_hideMessages" name="da_ignore_message" class="icheckbox">' +
                                    	'<label for="da_ignore_hideMessages" class="l">Hide Messages</label>' +
                                    	'<br><small>This will automatically <strong>hide</strong> Replies and Comments given to you by ignored users. Hidden Comments are still existent and won\'t get removed.</small>' +
                                    	'</div>' +
                                    	'<div class="browse-sitback row">' +
                                    	'<input ' + (settings.deleteMessages ? 'checked="checked"' : '') + ' type="radio" value="1" id="da_ignore_deleteMessages" name="da_ignore_message" class="icheckbox">' +
                                    	'<label for="da_ignore_deleteMessages" class="l">Delete Messages</label>' +
                                    	'<br><small>This will automatically <strong>delete</strong> Replies and Comments given to you by ignored users.</small>' +
                                    	'</div>' +
                                    	'<div class="browse-sitback row">' +
                                    	'<input ' + (settings.hideProfile ? 'checked="checked"' : '') + ' type="checkbox" value="1" id="da_ignore_hideprofile" class="icheckbox">' +
                                    	'<label for="da_ignore_hideprofile" class="l">Hide Profile</label>' +
                                    	'<br><small>This will automatically hide ignored user\'s profile-page. You can still visit them, but instead of their profile-content, there will be a notification.</small>' +
                                    	'</div>' +
                                    	'<div class="browse-sitback row">' +
                                    	'<input ' + (settings.hideDeviations ? 'checked="checked"' : '') + ' type="checkbox" value="1" id="da_ignore_hideDeviations" class="icheckbox">' +
                                    	'<label for="da_ignore_hideDeviations" class="l">Hide Deviations</label>' +
                                    	'<br><small>Hide all submissions from a user that are displayed on deviantart\'s front-pages.</small>' +
                                    	'</div>' +
                                    	'<div class="browse-sitback row">' +
                                    	'<input ' + (settings.submitHideRequest ? 'checked="checked"' : '') + ' type="checkbox" value="1" id="da_ignore_submitHideRquest" class="icheckbox">' +
                                    	'<label for="da_ignore_submitHideRquest" class="l" title="Requests comments to be hidden for everyone. Only works on your profile/deviations!">Hide comments for public (?)</label>' +
                                    	'<br><small>Hide all submissions from a user that are displayed on deviantart\'s front-pages.</small>' +
                                    	'</div>' +
                                    	'<div class="browse-sitback row">' +
                                    	'<input ' + (settings.autoIgnore ? 'checked="checked"' : '') + ' type="checkbox" value="1" id="da_ignore_autoignore" class="icheckbox">' +
                                    	'<label for="da_ignore_autoignore" class="l">Autoignore</label>' +
                                    	'<br><small>Should a user have the audacity to comment with one of the specified phrases, they will automatically be ignored.</small>' +
                                    	'</div>' +
                                    	'<div class=" buttons ch hh " id="submit">' +
                                    	'<div style="text-align:right" class="rr">' +
                                    	'<a class="smbutton smbutton-green" href="javascript:void(0)"><span id="da_ignore_savesettings">Save</span></a>' +
                                    	'</div></div></div></div></div>' +
                                    	'' +
                                    	'<div class="fooview ch">' +
                                    	'<div class="fooview-inner">' +
                                    	'<h3>Auto Ignore Users</h3>' +
                                    	'<span>Separate phrases by linebreaks!</span><br/><span>Regular expressions are supported. Phrase will be surrounded by "\\b"</span>' +
                                    	'<fieldset style="border:none;padding:0;">' +
                                    	'<textarea cols="70" rows="4" class="itext_uplifted" id="da_ignorewords_textarea">' + wordlist.join('\n') + '</textarea>' +
                                    	'</fieldset>' +
                                    	'<div class=" buttons ch hh " id="submit">' +
                                    	'<div style="text-align:right" class="rr">' +
                                    	'<a class="smbutton smbutton-green" href="javascript:void(0)"><span id="da_ignore_savewordlist">Save</span></a>' +
                                    	'</div></div></div></div>');
        	$('#da_ignore_saveblocklist').click(() => {
            	ignorenames = $('#da_ignore_textarea').val().toLowerCase().split('\n');
            	setTimeout(() => {
                	GM.setValue('blocklist', [...new Set(ignorenames)].join("\n"));
            	}, 0);
                notify("List saved!");
            	//alert('List saved!');
        	});
        	$('#da_ignore_savesettings').click(() => {
            	settings.hideComments = $('#da_ignore_hideComments').prop('checked');
            	settings.hideMessages = $('#da_ignore_hideMessages').prop('checked');
            	settings.deleteMessages = $('#da_ignore_deleteMessages').prop('checked');
            	settings.hideProfile = $('#da_ignore_hideprofile').prop('checked');
            	settings.hideDeviations = $('#da_ignore_hideDeviations').prop('checked');
            	settings.submitHideRequest = $('#da_ignore_submitHideRquest').prop('checked');
            	settings.autoIgnore = $('#da_ignore_autoignore').prop('checked');
            	setTimeout(() => {
                	GM.setValue('settings', JSON.stringify(settings));
            	}, 0);
            	//alert('List saved!');
                notify("List saved!");
        	});
        	$('#da_ignore_savewordlist').click(() => {
            	wordlist = $('#da_ignorewords_textarea').val().toLowerCase().split('\n');
            	setTimeout(() => {
                	GM.setValue('wordlist', [...new Set(wordlist)].join("\n"));
            	}, 0);
            	//alert('List saved!');
                notify("List saved!");
        	});
    	});
	}
}

let debounceTimeout = null; // Debounce-Timer
//delayed debounce to avoid calling it multiple times at once
function debouncer(){
    if (debounceTimeout) { //within bounce interval
        clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
        pruf();
        debounceTimeout = null;
    }, bounceInterval);
}

if (window.top === window.self) {
	let prom = loadsettings();
	prom.then(()=>{
        const observer = new MutationObserver(debouncer);
        observer.observe(document.body,{ childList: true, subtree: true });
        debouncer();

        document.addEventListener('click', function(event) {
            const target = event.target.closest('a');
            if (target && event.ctrlKey && event.shiftKey && event.button === 0 && target.classList.contains('user-link')) {
                if(ignoreIndex(target.dataset.username)==-1){
                    ignoreName(target.dataset.username,false);
                }else{
                    unIgnoreName(target.dataset.username,true);
                }
                event.preventDefault();
            }
        });

        function updateHoverState() {
            hoverDisabled = ctrlDown && shiftDown;
            document.body.classList.toggle("dA_ignore_hoverDisabled",hoverDisabled);
        }
        document.addEventListener('keydown', (event) => {
            if (event.repeat) return;
            if (event.key === 'Control') ctrlDown = true;
            if (event.key === 'Shift') shiftDown = true;
            updateHoverState();
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'Control') ctrlDown = false;
            if (event.key === 'Shift') shiftDown = false;
            updateHoverState();
        });
    });
}