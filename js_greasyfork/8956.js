// ==UserScript==
// @name          Heise.de Forum: all comments on one page v2
// @namespace     Vorticon
// @author        marrr, edited by commander_keen, jn
// @version       2.5.0
// @description   All comments on one page, iReply, quick-vote, user-scores.
// @include       http://www.heise.de/*/foren/*
// @include       https://www.heise.de/*/foren/*
// @include       http://www.heise.de/foren/*
// @include       https://www.heise.de/foren/*
// @include       http://www.heise.de/forum/*
// @include       https://www.heise.de/forum/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_log
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8956/Heisede%20Forum%3A%20all%20comments%20on%20one%20page%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/8956/Heisede%20Forum%3A%20all%20comments%20on%20one%20page%20v2.meta.js
// ==/UserScript==


(function() { // Opera wrapper
/********************************************
 * USER SETTINGS
 ********************************************/
// show article ratings by default https://www.heise.de/forum/heise-online/Meinungen-zu-heise-online/Bewertungsanzeige-im-Forum-kann-ab-sofort-ausgeblendet-werden/posting-30356078/show/
var showRatings = 1;
// don't fetch postings whose title ends in (kT), n.T. etc.
var skipNoTextPostings = 0;

var overviewPagePostCount  = 16;
var maxJoinedPosts         = overviewPagePostCount * 10; // in overview, add x posts * y pages
var maxJoinedPostsInThread = 80;

// user score is scaled by this value and then fitted into 0-10
var posterScoreScaleFactor = 0.3;

// here you can enable joining on different overview levels
/*var joinTopLevelForen = 1; this is nowhere to be found*/
var joinSubLevelForen = 1;

var enableThreadView = 1;

// reply stuff
var enableIReply    = 1;
var enableAutoQuote = 1;
var enableQuickVote = 1;

// "plain" for disabling colored bar indentation; or "colored" to enable
var displayMode = "colored";

// defines the colors used for colored indentation
var branchBorderStyle = "1px dashed";

function getBranchColor(lvl) {
	switch(lvl % 8) {
		case 0:  return "#999999";
		case 1:  return "#445599";
		case 2:  return "#995544";
		case 3:  return "#449955";
		case 4:  return "#994455";
		case 5:  return "#554499";
		case 6:  return "#CC77CC";
		case 7:  return "#554499";
	}
}

function getQuoteColor(lvl) {
	switch(lvl) {
		case 2:  return "#668811";
		case 3:  return "#445599";
		case 4:  return "#995544";
		case 5:  return "#449955";
		case 6:  return "#994455";
		case 7:  return "#554499";
		case 8:  return "#CC77CC";
		case 9:  return "#554499";
		// ...
		default: return "";
	}
}


/********************************************
 * BROWSER DEPENDENT
 ********************************************/
function isOpera() {
	return typeof(opera) != "undefined";
}

function isSafari() {
	return typeof(safari) != "undefined" || /apple/i.test(navigator.vendor) || /safari/i.test(navigator.userAgent);
}

function isChrome() {
	return typeof(chrome) != "undefined";
}


function log(msg) {
	if (isOpera()) opera.postError(msg);
	// else if (isChrome()) console.log(msg); // chrome supports GM_log
	else if(isSafari())
	{
		// according to the docs, GM_log is supported
		if(typeof(GM_log) != undefined)
			GM_log(msg);
	}
	else GM_log(msg);
}

function requestHTML(fileUrl, callback, nr, div) {
	fileUrl = ensureAbsoluteUrl(fileUrl);
	if (isOpera() || isSafari()) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open('GET', fileUrl, true);
		xmlHttp.onreadystatechange = function () {
			if(xmlHttp.readyState == 4 &&
			   xmlHttp.status     == 200)
				callback(xmlHttp.responseText, nr, div, fileUrl);
		};
		xmlHttp.send(null);
	}
	else { // maybe the opera way works here, but this one contains more GM_s
		GM_xmlhttpRequest(
		{
			method: 'GET',
			url: fileUrl,
			onload: function(resp) {
				if(resp.status == 200)
					callback(resp.responseText, nr, div, fileUrl);
			}
		});
	}
}

// TODO: this is limited to simple values, yet sufficient
function setLocalValue(name, val) {
    if (isOpera() || isChrome() || isSafari()) {
		var lifeTime = 31536000;
		document.cookie = escape(name) + "=" + escape(val) +
			";expires=" + (new Date((new Date()).getTime() + (1000 * lifeTime))).toGMTString() + ";path=/";
	}
	else
		GM_setValue(name, val);
}

function getLocalValue(name, def ) {
	if(isOpera() || isChrome() || isSafari()) {
		var cookieJar = document.cookie.split("; ");
		for(var x = 0; x < cookieJar.length; x++) {
			var oneCookie = cookieJar[x].split( "=" );
			if( oneCookie[0] == escape(name) ) {
				try {
					eval('var footm = '+unescape(oneCookie[1]));
					return footm;
				} catch(e) { return def; }
			}
		}
		return def;
	}
	else
		return GM_getValue(name, def);
}



/********************************************
 * THE CODE
 ********************************************/
var baseUrl = document.location.protocol + '//' + document.location.host;
var postingRegExp;

var isNewForum = /^\/forum\//.test(document.location.pathname) ? true : false;
if(isNewForum)
	postingRegExp = /((<div class="userbar[\s\S]*?)(?=(<div class="metabar">))\3[\s\S]*?<\/div>\s*<\/div>)(?=\s*<div class="thread_view_switch">)/;
else
	postingRegExp = /((<div class="vote_posting">[\s\S]*?)?(?=(<div class="posting_date">))\3[\s\S]*?(?=(<div class="tovote_links">))\4[\s\S]*?<\/div>)/;

var searchUrl;
if(isNewForum)
	searchUrl = baseUrl + '/forum/suche/?rm=search&q=';
else
	searchUrl = baseUrl + '/foren/suche?q=';

function xpath(xp, root)
{
	if(root === null) return null;
	if(root === undefined) root = document;
	return document.evaluate(xp, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}
function xpath1(xp, root)
{
	var res = xpath(xp, root);
	return res ? ((res.snapshotLength > 0) ? res.snapshotItem(0) : null) : null;
}

function ensureAbsoluteUrl(url)
{
	if(url.match(/^\//))
		url = baseUrl + url;
	else if(url.match(/^\?/))
		url = document.location.href.replace(document.location.search, "") + url;
	return url;
}

function defineScriptInPageContext(code)
{
	var script = document.createElement("script");
	script.type = "application/javascript";
	script.innerHTML = code;

	document.body.appendChild(script);
}

function getElementsByClassName(oElm, strTagName, strClassName) {

	var arrElements = (strTagName == "*" && document.all) ?
		document.all : oElm.getElementsByTagName(strTagName);

	var arrReturnElements = new Array();
	strClassName = strClassName.replace(/\-/g, "\\-");

	var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");

	for(var i = 0; i < arrElements.length; i++) {

		var oElement = arrElements[i];
		if(oRegExp.test(oElement.className))
			arrReturnElements.push(oElement);

	}
	return (arrReturnElements);
}

function grepTitleLinkURL(html)
{
	if(isNewForum)
		var res = html.match(/<a[^>]*? href="([^"]*?)"[^>]*? class="posting_subject">/);
	else
		var res = html.match(/<a[^>]*? href="([\s\S]*?)"[^>]*? title=(["'])[\s\S]*?\2>/i);
	if(!res) return null;
	return res[1];
}
function grepTitle(html)
{
	var res = html.match(/>([^<]*)<\/a>/i);
	if(!res) return null;
	return res[1];
}

function joinThreadPosts()
{
	if(isNewForum) {
		joinThreadPostsNew();
		return;
	}
	// do it this way to respect priorities
	var rootPostDiv = xpath1("//div[@class='forum_content']");
	if(rootPostDiv == null)
		rootPostDiv = xpath1("//div[@id='mitte_forum']");
	if(rootPostDiv == null)
		rootPostDiv = xpath1("//div[@id='mitte']");
	if(rootPostDiv == null)
		rootPostDiv = xpath1("//td[@class='f-content']");
	if(rootPostDiv == null)
		rootPostDiv = xpath1("//*[@id='parttime-forum']");
	if(rootPostDiv == null)
		log("Root div not found!");

	var rootPostText = xpath1("p[@class='posting_text']", rootPostDiv);
	appendReplyFrame(rootPostText, -1, rootPostDiv);

	var replyLinkA = xpath1(".//a[text() = 'Beantworten']", rootPostDiv);
	var replyLink = replyLinkA == null ? "" : replyLinkA.href;
	processMessageDiv(rootPostDiv, document.location.href, replyLink);

	var threadsList = xpath1("//ul[@class='thread_tree']");
	if(threadsList == null)
	{
		log("Thread tree not found - activate it!");
		return;
	}

	var divStack  = new Array();
	divStack.peek = function() { return this[this.length - 1]; }

	var answerDiv = document.createElement('div');
	threadsList.parentNode.insertBefore(answerDiv, threadsList);
	divStack.push(answerDiv);

	var threadMsgs = xpath(".//div[@class='thread_title']", threadsList);
	var maxJoinCnt  = Math.min(threadMsgs.snapshotLength, maxJoinedPostsInThread);
	var afterActive = 0;
	var cntJoined   = 0;
	var rootAbsoluteDepth = 0;

	for(var i = 0; i < threadMsgs.snapshotLength && cntJoined <= maxJoinCnt; i++) {
		var msgDiv   = threadMsgs.snapshotItem(i);
		var isActive = 0;

		// search the currently selected beitrag
		if(msgDiv.innerHTML.match("beitrag_aktiv") ||
		   msgDiv.innerHTML.match("active_post")) {
			afterActive = 1;
			isActive = 1;
			rootAbsoluteDepth = countLevel(msgDiv);
			continue;
		}
		else if(afterActive == 0) continue;

		// count the number of next_levels upwards
		var curRelativeDepth = countLevel(msgDiv) - rootAbsoluteDepth;

		// only show current subnode
		if(curRelativeDepth <= 0) break;

		// find the URL
		var url = grepTitleLinkURL(msgDiv.innerHTML);
		if(!url) {
			log("Error parsing: " + msgDiv.innerHTML);
			continue;
		}

		// create div for the branch
		var divBranch = document.createElement('div');
		if(!isActive)
			divBranch.style.marginLeft = "20px";
		if(displayMode == "colored")
			divBranch.style.borderLeft = branchBorderStyle + " " + getBranchColor(curRelativeDepth);


//		divBranch.innerHTML = '<a style="display: block; font-size: 6px">^^^</a>';

		// create div for the post
		var divPost = document.createElement('div');
		divPost.style.border = "1px dashed #DDDDDD";
		divPost.style.marginLeft = "8px"; // some space from the border

		// decend down to current level
		while(curRelativeDepth < divStack.length) divStack.pop();

		// add it
		divStack.peek().appendChild(divBranch);
		divBranch.appendChild(divPost);

		// create the ireply frame
		appendReplyFrame(divBranch, cntJoined, divPost);

		// remember current branch
		divStack.push(divBranch);

		// grep it
		requestHTML(url, callbackThread, i, divPost);

		cntJoined++;
	}

	if(afterActive == 0) {
		log("found no active post!");
		return;
	}
}

function joinThreadPostsNew()
{
	// do it this way to respect priorities
	var rootPostDiv = xpath1(".//div[@id='forum_wrap']");
	if(rootPostDiv == null)
		rootPostDiv = xpath1("//div[@id='mitte']");
	if(rootPostDiv == null)
		log("Root div not found! (joinThreadPostsNew)");

	if(enableIReply === 1) {
		var rootPostText = xpath1(".//div[@class='post']", rootPostDiv);
		appendReplyFrame(rootPostText, -1, rootPostDiv);
	}

	var replyLinkA = xpath1(".//a[@class='reply']", rootPostDiv);
	var replyLink = replyLinkA === null ? "" : replyLinkA.href;
	var quoteLinkA = xpath1(".//a[@class='quote']", rootPostDiv);
	var quoteLink = quoteLinkA === null ? "" : quoteLinkA.href;
	processMessageDiv(rootPostDiv, document.location.href, replyLink, quoteLink);

	var threadsList = document.getElementById('tree_thread_list');
	if(threadsList == null) {
		// don't complain so often
		if(xpath1(".//div[@class='thread_view_switch']", document.getElementById("forum_wrap")))
			log("Thread tree not found - activate it! (joinThreadPostsNew)");
		return;
	}

	// apply stylesheet once
	addStyles();
	if(showRatings === 1) {
		addStyle('span.rating { display: inline !important /* Rating for each post*/ }\
		          .tree_thread_list--rating { display: inline !important /* Rating in post list at the bottom of the thread, and in thread list*/ }');
		var votebuttonLoggedOutSpan = xpath1(".//span[@title='Bitte loggen Sie sich ein, um den Beitrag zu bewerten.']", document.getElementById("forum_wrap"));
		if(votebuttonLoggedOutSpan === null) {
			addStyle(".first_posting + .rating_buttons_wrapper { display: inline !important /* Show voting buttons */}\
			          .post + .rating_buttons_wrapper { bottom: 60px; display: inline; float: right; position: relative }\
			          #tree_thread_list { clear: right } /* sonst verschieben sich Bewertung+User+Datum (verursacht durch .ratings_button_wrapper{position != absolute}) */ \
			");
		} else
			addStyle(".rating_buttons_wrapper { display: none !important /* Dont show voting buttons if voting is not posible */ }");
	}

	var divStack  = new Array();
	divStack.peek = function() { return this[this.length - 1]; }

	var answerDiv = document.createElement('div');
	threadsList.parentNode.insertBefore(answerDiv, threadsList);
	divStack.push(answerDiv);

	var threadMsgs  = xpath(".//li[contains(@class, 'posting_element')]", threadsList);
	var maxJoinCnt  = Math.min(threadMsgs.snapshotLength, maxJoinedPostsInThread);
	var afterActive = false;
	var cntJoined   = 0;
	var rootAbsoluteDepth     = 0;
	var skippedEntryTitles    = [];
	    skippedEntryTitles[1] = xpath1(".//a[@class='posting_subject']", threadsList).textContent.trim();

	for(var i = 0; i < threadMsgs.snapshotLength && cntJoined <= maxJoinCnt; i++) {
		var msgDiv   = threadMsgs.snapshotItem(i);
		var isActive = false;

		// search the currently selected beitrag
		if(msgDiv.className.match("current_posting")) {
			afterActive       = true;
			isActive          = true;
			rootAbsoluteDepth = countLevel(msgDiv);
			continue;
		}
		else if(afterActive === false) continue;

		// count the number of next_levels upwards
		var curRelativeDepth = countLevel(msgDiv) - rootAbsoluteDepth;

		// only show current subnode
		if(curRelativeDepth <= 0) break;

		// find the URL
		var url = grepTitleLinkURL(msgDiv.innerHTML);
		if(!url) {
			// don't complain about locked posts
			if(!msgDiv.innerHTML.match(/<span [^>]*class=(["'])posting_subject locked\1>/))
				log("Error parsing (joinThreadPostsNew): " + msgDiv.innerHTML);
			continue;
		}

		// create div for the branch
		var divBranch = document.createElement('div');
		if(!isActive)
			divBranch.style.marginLeft = "20px";
		if(displayMode == "colored")
			divBranch.style.borderLeft = branchBorderStyle + " " + getBranchColor(curRelativeDepth);

		// create div for the post
		var divPost = document.createElement('div');
		divPost.style.border = "1px dashed #DDDDDD";
		divPost.style.marginLeft = "8px"; // some space from the border

		// descend down to current level
		while(curRelativeDepth < divStack.length) divStack.pop();

		// add it
		divStack.peek().appendChild(divBranch);
		divBranch.appendChild(divPost);

		// create the ireply frame
		appendReplyFrame(divBranch, cntJoined, divPost);

		// remember current branch
		divStack.push(divBranch);

		// don't retrieve (KeinText) contributions from the server
		skippedEntryTitles[countLevel(msgDiv)] = grepTitle(msgDiv.innerHTML).trim().replace(/^Re:\s*/i, "");
		if(skipNoTextPostings === 1
		   && isNoTextEntry(skippedEntryTitles[countLevel(msgDiv)])
		   && skippedEntryTitles[countLevelNew(msgDiv)-1] != skippedEntryTitles[countLevel(msgDiv)]) {
			processMessageDivNew_NoText(msgDiv, url, divPost);
		} else {
			// grep it
			requestHTML(url, callbackThread, i, divPost);
		}
		cntJoined++;
	}

	if(afterActive === false) {
		log("found no active post! (joinThreadPostsNew)");
		return;
	}
}

function appendReplyFrame(div, id, divPost)
{
	if(div == null)
	{
		log("div to attach reply frame to is null");
		return;
	}

	var iReplyFrame = document.createElement('iframe');
	iReplyFrame.id = "reply" + id;
	iReplyFrame.style.display = 'none';
	iReplyFrame.style.width   = '100%';
	iReplyFrame.style.height  = '35em';
	divPost.setAttribute("replyFrameID", iReplyFrame.id);

	var divReply = document.createElement('div');
	divReply.style.marginLeft = divPost.style.marginLeft;
	divReply.appendChild(iReplyFrame);

	div.appendChild(divReply);
}

function callbackThread(txt, nr, div, url)
{
	if(isNewForum) {
		callbackThreadNew(txt, nr, div, url);
		return;
	}
	try
	{
		// pre-check the posting for performance issues
		// else match can lock up
		if(txt.indexOf('<div class="posting_date">') == -1 ||
		   txt.indexOf('<div class="tovote_links">') == -1) {
			log("No known posting: " + url);
			return;
		}

		var mtchs = txt.match(postingRegExp);
		if(mtchs == null) {
			div.innerHTML = "<i>Could not load comment</i>";
			return;
		}

		var html = mtchs[1];
		div.innerHTML = html;

		var replyLinks = txt.match(/<a href="([^"]*)"\s*>Beantworten<\/a>/);
		var replyLink  = (replyLinks != null) ? replyLinks[1] : "";

		processMessageDiv(div, url, replyLink);
	}
	catch(e)
	{
		log('Error processing post: ' + e);
	}
}

function callbackThreadNew(txt, nr, div, url)
{
	try
	{
		// pre-check the posting for performance issues
		// else match can lock up
		if(txt.indexOf('<div class="thread_view_switch">') === -1) {
			log("No known posting (callbackThreadNew): " + url);
			return;
		}

		var mtchs = txt.match(postingRegExp);
		if(mtchs == null) {
			div.innerHTML = "<i>Could not load comment (new forum)</i>";
			return;
		}

		var html = mtchs[1];
		div.innerHTML = html;

		var replyLinks = txt.match(/<a href="([^"]*)" class="reply"[^>]*>[\s]*Antworten[\s]*<\/a>/);
		var replyLink  = (replyLinks !== null) ? replyLinks[1] : "";

		var quoteLinks = txt.match(/<a href="([^"]*)" class="quote"[^>]*>[\s]*Zitieren[\s]*<\/a>/);
		var quoteLink  = (quoteLinks !== null) ? quoteLinks[1] : "";

		processMessageDiv(div, url, replyLink, quoteLink);
	}
	catch(e)
	{
		log('Error processing post (callbackThreadNew): ' + e);
	}
}

function processMessageDiv(div, messageUrl, replyLink, quoteLink) {
	// parameter quoteLink is only used in the new forum
	if(isNewForum) {
		processMessageDivNew(div, messageUrl, replyLink, quoteLink);
		return;
	}

	// link username to search
	var userI = xpath1(".//div[@class='user_info']/i", div);
	var userName;
	if(userI != null)
	{
		userName = userI.innerHTML.replace(/^(.*?),&nbsp;.*$/, "$1");
		userI.innerHTML = "<a href=\"" + searchUrl + escape(userName) + "\">" + userI.innerHTML + "</a>";

		userI.innerHTML += getPosterScoreBarCode(userName);
	}
	else
	{
		userName = "?";
		log("Could not find username div!");
	}

	// colorize quote
	var quotes = xpath(".//p/span[@class='quote']", div);
	for(var i = 0; i < quotes.snapshotLength; i++) {
		var e = quotes.snapshotItem(i);

		var patternLength = 10;
		var m = e.innerHTML.match(/^((?:&gt;&nbsp;)+)/);
		if(m != null) {
			var color = getQuoteColor(m[0].length / patternLength);
			if(color != "")
				e.innerHTML = "<span style=\"color: " + color + "\">" + e.innerHTML + "</span>";
		}
	}

	// set the reply links
	if(replyLink != "") {
		replyLink       = ensureAbsoluteUrl(replyLink);
		replyLinkInline = "<a style=\"color: #6673DD\" onclick=\"iReply('" + div.getAttribute ("replyFrameID") +
			"', '" + replyLink + "')\">iReply</a>";
		replyLink       = "<a href=\"" + replyLink + "\">Beantworten</a>";

		if(userI != null)
			userI.innerHTML += " --- " + replyLink + (enableIReply ? " / " + replyLinkInline : "");
	}

	// link posting title to posting
	var postingSubject = xpath1(".//h3[@class='posting_subject']", div);
	if(postingSubject != null)
		postingSubject.innerHTML = "<a href=\"" + messageUrl + "\">" + postingSubject.innerHTML + "</a>";
	else
		log("Posting subject not found!");

	// relink voting buttons
	if(enableQuickVote) {
		var voteLinks = xpath(".//div[@class='tovote_links']/a", div);
		for(var i = 0; i < voteLinks.snapshotLength; i++) {
			var voteLink = voteLinks.snapshotItem(i);
			var url = voteLink.href;

			voteLink.removeAttribute("href");
			voteLink.addEventListener("click",
				quickVoteFunctionBuilder(voteLink, url, userName), true);

			voteLink.setAttribute("onclick", "sendVote(this, '" + url + "');");
		}
	}
}

function processMessageDivNew_NoText(div, messageUrl, divPost) {
	var userH;
	var userName = div.getElementsByTagName("span")[0].getElementsByTagName("span")[0].innerText;
	if(userName !== "") {
		userH = "<a href=\"" + searchUrl + escape(userName) + "\">" + userName + "</a>";
		userH+= getPosterScoreBarCode(userName);
	}

	var replyLink = ensureAbsoluteUrl(messageUrl).replace(/\/show\/$/, "/reply/");
	var quoteLink = ensureAbsoluteUrl(messageUrl).replace(/\/show\/$/, "/quote-1/reply");
	replyLink =    '<a href="' + replyLink + '" class="reply">Beantworten<\/a>/';
	quoteLink = ' | <a href="' + quoteLink + '" class="quote">Zitieren<\/a>';
	replyLink+=quoteLink;

	var replyLinkInline = "<a style=\"color: #6673DD\" id=\"iReplyLink_" + divPost.getAttribute("replyFrameID") +"\">iReply</a>";
	userH += " --- " + replyLink + (enableIReply ? " / " + replyLinkInline : "");

	var ntTime = div.getElementsByTagName("time")[0].outerHTML;
	    ntTime = ntTime.replace(/class="[^"]*"/, 'class="posting_timestamp"');
	var ntRatingInner = div.getElementsByTagName("span")[0].getElementsByTagName("span")[1].innerHTML;
	var ntLinkText    = div.getElementsByTagName("span")[0].getElementsByTagName("a")[0].innerText.trim();
	var ntPostingID = messageUrl.match(/posting-(\d+)\/show\//)[1];

	var ntDiv = '<div class="userbar clearfix"><ul class="author forum_userbar--author userbar_list"><li><span class="full_user_string"><span class="pseudonym">' + userH + '</span></span></li></ul><p><!--           xxx Beiträge seit xx.xx.xxxx  --></p><div class="user_interaction"><!-- <a href="Link nicht vorhanden /user-xxxxxx/posting-xxxxxxxx/ignore/" class="ignore" rel="nofollow">ignorieren</a>  --></div></div>';
	    ntDiv+= '<div class="metabar">' + ntTime;
	    ntDiv+= '<ul><li><span class="rating js-rating-chart__wrapper">'+ntRatingInner + '</span></li>';
	    ntDiv+= '<li><a href="https://www.heise.de/forum/p-' + ntPostingID + '/" class="perma" rel="nofollow">Permalink</a></li>';
	    ntDiv+= '<li><a href="https://www.heise.de/forum/posting-' + ntPostingID + '/feedback-links/" class="feedback" rel="nofollow">Melden</a></li>';
	    ntDiv+= '</ul></div><h1 class="thread_title"><a href="' + messageUrl +'">' + ntLinkText + '</a></h1>';

	divPost.innerHTML = ntDiv;

	if(enableIReply === 1)
		document.getElementById("iReplyLink_" + divPost.getAttribute("replyFrameID"))
			.addEventListener("click", function() {
				iReplyNew(div.getAttribute ("replyFrameID"), replyURL)
			}, false);
}

function processMessageDivNew(div, messageUrl, replyURL, quoteLink) {
	// link username to search
	var userI = xpath1(".//span[@class='realname']|.//span[@class='pseudonym']/a|.//span[@class='pseudonym']", div);
	var userName;
	var replyLink;
	if(userI !== null) {
		userName = userI.textContent;
		userI.innerHTML = "<a href=\"" + searchUrl + escape(userName) + "\">" + userI.innerHTML + "</a>";

		userI.innerHTML += getPosterScoreBarCode(userName);
	}
	else {
		userName = "?";
		log("Could not find username div! (processMessageDivNew)");
	}

	// set the reply links
	if(replyURL != "") {
		replyURL            = ensureAbsoluteUrl(replyURL);
		var replyLinkInline = "<a style=\"color: #6673DD\" id=\"iReplyLink_" + div.getAttribute("replyFrameID") +"\">iReply</a>";
		replyLink           = "<a href=\"" + replyURL + "\">Beantworten</a>";

		if(quoteLink != "") {
			quoteLink  = ensureAbsoluteUrl(quoteLink);
			quoteLink  = " | <a href=\"" + quoteLink + "\">Zitieren</a>";
			replyLink += quoteLink;
		}

		if(userI !== null) {
			userI.innerHTML += " --- " + replyLink + (enableIReply ? " / " + replyLinkInline : "");

			if(enableIReply === 1)
				document.getElementById("iReplyLink_" + div.getAttribute("replyFrameID"))
					.addEventListener("click", function() {
						iReplyNew(div.getAttribute ("replyFrameID"), replyURL)
					}, false);
		}
	}

	// link posting title to posting
	var postingSubject = xpath1(".//h1[@class='thread_title']", div);
	if(postingSubject !== null)
		postingSubject.innerHTML = "<a href=\"" + messageUrl + "\">" + postingSubject.innerHTML + "</a>";
	else
		log("Posting subject not found!(processMessageDivNew)");

	// relink voting buttons
	if(enableQuickVote) {
		// not necessary when you cannot vote
		var votebuttonLoggedOutSpan = xpath1(".//span[@title='Bitte loggen Sie sich ein, um den Beitrag zu bewerten.']", document.getElementById("forum_wrap"));
		if(votebuttonLoggedOutSpan !== null) {
			return;
		}

		var voteLinks = xpath(".//a[contains(@class, 'rating_post')]", div);
		for(var i = 0; i < voteLinks.snapshotLength; i++) {
			var voteLink = voteLinks.snapshotItem(i);
			//var url = voteLink.href;	// always points to positive rating?!
			//voteLink.removeAttribute("href");	// modifying the element will invalidate the list element and the event listener will match nothing
 			voteLink.addEventListener("click", function(event) {
				if(GM_xmlhttpRequest || XMLHttpRequest)
					event.preventDefault();
				quickVoteFunctionBuilderNew(this.href, userName);
				sendVoteNew(this, this.href);
				}
			, false);
		}
	}
}

function quickVoteFunctionBuilder(voteLink, url, author) {
	return function() {
		log("voted for author: " + author);

		// mark as voted
		voteLink.style.backgroundColor = "yellow";

		// extract score
		var matches = url.match(/postvote-(-?\d)/);
		if(!matches) return;

		var score = parseInt(matches[1]);
		log("score: " + score);

		// score the author
		scorePoster(author, score);
	};
}

function quickVoteFunctionBuilderNew(url, author) {
	// extract score
	var matches = url.match(/\/rate\/(positive|negative)\/$/);
	if(!matches) {
		log("vote url not found");
		return;
	}

	var score = 0;
	if(     matches[1] === "positive") score = 1;
	else if(matches[1] === "negative") score = -1;

	log("voting score: " + score + " added for author " + author);

	// score the author
	scorePoster(author, score);
}

function sendVoteNew(target, voteUrl) {
	//prefer the GM_ method because XMLHttpRequest requires XHR permission in uMatrix
	if(GM_xmlhttpRequest) {
		GM_xmlhttpRequest({
			method: 'GET',
			url: voteUrl,
			onload: function(resp) {
				if(resp.status == 200) {
					target.style.backgroundColor = "yellow";
				}
			}
		});
	}
	else if(XMLHttpRequest) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open('GET', voteUrl, true);
		xmlHttp.onreadystatechange = function () {
			if(xmlHttp.readyState == 4 &&
			   xmlHttp.status     == 200) {
				target.style.backgroundColor = "yellow";
			}
		};
		xmlHttp.send(null);
	}
	else target.click();
}

function addStyle(styleText) {
	if(GM_addStyle) {
		GM_addStyle(styleText);
	}
	else {
		var copyStyles = document.createElement("style");
		copyStyles.setAttribute("type", "text/css");
		copyStyles.appendChild(document.createTextNode(styleText));
		document.getElementsByTagName("head")[0].appendChild(copyStyles);
	}
}

function addStyles() {
	if(top !== self) return;
	// apply style rules from the first post to all posts
	// fixes look and positioning of the voting buttons
	// this is very messy but I want to avoid an external file
	var styleText = "\
	/*#thread #replys li .post .posting_options,#thread .first_posting*/ .post .posting_options{\
		line-height:10px;\
		position:absolute;\
		right:0\
	}\
	/*#thread #replys li .post .posting_options .thanks,#thread .first_posting*/ .post .posting_options .thanks{\
		display:inline-block;\
		margin:-22px 0 0 10px;\
		float:left;\
		line-height:120%;\
		text-align:center\
	}\
	/*#thread #replys li .post .posting_options .thanks .rate_post,#thread .first_posting*/ .post .posting_options .thanks .rate_post{\
		float:left;\
		width:12px;\
		height:12px;\
		overflow:hidden;\
		color:#039;\
		cursor:pointer;\
		text-align:center;\
		font-size:18px;\
		line-height:14px;\
		border:1px solid #ccc;\
		background:#fff;\
		padding:4px\
	}\
	/*#thread #replys li .post .posting_options .thanks .rate_post:hover,#thread .first_posting*/ .post .posting_options .thanks .rate_post:hover{\
		opacity:.8;\
		text-decoration:none\
	}\
	/*#thread #replys li .post .posting_options .thanks .rate_post.negative,#thread .first_posting*/ .post .posting_options .thanks .rate_post.negative{\
		color:#c30000;\
		margin-right:5px;\
		border:1px solid #c30000;\
		line-height:10px\
	}\
	/*#thread #replys li .post .posting_options .thanks .rate_post.negative:hover,#thread #replys li .post .posting_options .thanks .rate_post.negative:visited,#thread .first_posting*/ .post .posting_options .thanks .rate_post.negative:hover,/*#thread .first_posting*/ .post .posting_options .thanks .rate_post.negative:visited{\
		background-color:#c30000;\
		color:#fff\
	}\
	/*#thread #replys li .post .posting_options .thanks .positive,#thread .first_posting*/ .post .posting_options .thanks .positive{\
		color:#2b8f00;\
		border:1px solid #2b8f00\
	}\
	/*#thread #replys li .post .posting_options .thanks .positive:hover,#thread #replys li .post .posting_options .thanks .positive:visited,#thread .first_posting*/ .post .posting_options .thanks .positive:hover,/*#thread .first_posting*/ .post .posting_options .thanks .positive:visited{\
		background-color:#2b8f00;\
		color:#fff\
	}\
	div[style] > h1.thread_title {\
		font-size: 1.2em;\
		margin-bottom: 10px;\
		line-height: 22px;\
	}\
	";
	addStyle(styleText);
}

function getPosterScoreBarCode(author) {
	var absScore = getPosterScore(author);
	if (absScore === undefined) return "";

	// TODO: think about making it logarithmical
	var score = absScore * posterScoreScaleFactor;
	score += 5;
	if(score >= 4 && score <= 6) return "";

	score = Math.min(score, 10);
	score = Math.max(score, 0);
	score += 1;
	score = Math.round(score);

	return "&nbsp;&nbsp;<img src=\"/icons/forum/wertung_" + score + ".gif\" title=\"User-Score: " + absScore + "\"/>";
}

function getPosterScore(author) {
	return getLocalValue("score_" + author, 0);
}
function scorePoster(author, score) {
	var oldScore = getPosterScore(author);
	setLocalValue("score_" + author, oldScore + score);
}

function countLevel(el)
{
	if(isNewForum) {
		return countLevelNew(el);
	}
	var lvl = 1;

	// limit loop, just to be sure
	for(var i=0; i < 10000; i++) {
		var par = el.parentNode;
		el = par;

		if(par == null) break;
		if(par.className == "thread_tree") break;
		if(par.className == "nextlevel" ||
		   par.className == "nextlevel_line")
			lvl++;
	}

	return lvl;
}

function countLevelNew(el)
{
	var lvl = 1;

	// limit loop, just to be sure
	for(var i=0; i < 10000; i++) {
		var par = el.parentNode;
		el = par;

		if(par == null) break;
		if(!par.className) continue;
		if(par.className == "tree_thread_list") break;
		if(par.className.indexOf("posting_element") === 0)
			lvl++;
	}

	return lvl;
}

function insertPostStart(url, nr)
{
	if(isNewForum)
		return url.replace(/(\/page-|_page=)\d+/, "$1" + nr);
	else {
		var eall = "";
		if(document.location.href.match(/\/e-all/)) eall = "/e-all";

		return url.replace(/(\/(list|foren)\/hs)-\d+/, "$1-" + nr + eall);
	}
}

function extractPostStart(url)
{
	if(isNewForum)
		return extractPostStartNew(url);

	var matches = url.match(/\/hs-(\d+)/);
	if(!matches) return -1;

	return parseInt(matches[1]);
}

function extractPostStartNew(url)
{
	var matches = url.match(/\/page-(\d+)/);
	if(!matches) {
		matches = url.match(/\?forum_page=(\d+)/);
	}
	if(!matches) return -1;

	return parseInt(matches[1]);
}

function joinOverviewPages()
{
	if(isNewForum) {
		joinOverviewPagesNew();
		return;
	}

	showOverviewPosterScores(document);

	var pageNrUls   = getElementsByClassName(document, "ul", "forum_navi");
	var threadTrees = getElementsByClassName(document, "ul", "thread_tree");
	if(threadTrees.length == 0)
		threadTrees = getElementsByClassName(document, "ul", "fora_list");

	if(pageNrUls.length   == 0 ||
	   threadTrees.length == 0) {
		log("no forum_navi or thread_tree");
		return;
	}

	var firstPageURL = "";
	var lastPageURL  = "";

	// find the first and last of the page URLs
	var pageLinks = pageNrUls[0].getElementsByTagName("li");
	for(var i = 0; i < pageLinks.length; i++) {
		var pageLink = pageLinks[i];

		if(pageLink.innerHTML.match(/>Neuere</)) break;
		if(pageLink.innerHTML.match(/^\d+$/))    firstPageURL = "";

		// find the URL
		var url = grepTitleLinkURL(pageLink.innerHTML);
		if(!url) continue;

		if(firstPageURL == "")
			firstPageURL = url;
		lastPageURL = url;
	}
	if(firstPageURL == "" || lastPageURL == "") {
		log("found no page URLs");
		return;
	}

	// extract the post numbers
	var firstPostNr = extractPostStart(firstPageURL);
	var lastPostNr  = extractPostStart(lastPageURL);
	if(firstPostNr == -1 || lastPostNr == -1) {
		log("found no post numbers");
		return;
	}

	// limit pages to users setting
	var limited = false;
	if(lastPostNr - firstPostNr > maxJoinedPosts) {
		lastPostNr = firstPostNr + maxJoinedPosts;
		limited = true;
	}

	// add list items and load the overview pages into them
	var threadTree = threadTrees[0];
	for(var j = firstPostNr; j <= lastPostNr; j += overviewPagePostCount) {
		var url = ensureAbsoluteUrl(insertPostStart(lastPageURL, j));

		var li = document.createElement('li');
		li.innerHTML = "<b>Beitr&auml;ge ab Nr. " + j + "</b>";
		threadTree.appendChild(li);

		li = document.createElement('li');
		li.innerHTML = "<i>Lade...</i>";
		threadTree.appendChild(li);

		requestHTML(url, callbackOverviewPage, j, li);
	}

	// add links to navigate
	if(firstPostNr > overviewPagePostCount) {
		var li = document.createElement('li');
		li.innerHTML = "<a href=\"" + ensureAbsoluteUrl(insertPostStart(lastPageURL, firstPostNr - maxJoinedPosts - 3 * overviewPagePostCount)) + "\"><b>Vorwärts...</b></a>";
		threadTree.insertBefore(li, threadTree.childNodes[0]);
	}
	if(limited) {
		var li = document.createElement('li');
		li.innerHTML = "<a href=\"" + ensureAbsoluteUrl(insertPostStart(lastPageURL, lastPostNr + overviewPagePostCount)) + "\"><b>Weiter...</b></a>";
		threadTree.appendChild(li);
	}
}

function joinOverviewPagesNew()
{
	showOverviewPosterScores(document);

	var pageNrElmFirst = xpath1(".//span[@class='seiten']/a[position()=1]",      document.getElementById("thread_sortierung"));
	var pageNrElmLast  = xpath1(".//span[@class='seiten']/a[position()=last()]", document.getElementById("thread_sortierung"));
	if(pageNrElmFirst == null)
		pageNrElmFirst = xpath1(".//a[@class='page'][starts-with(@href, '?forum_page=')][position()=1]",      document.getElementById("forum_wrap"));
	if(pageNrElmLast  == null)
		pageNrElmLast  = xpath1(".//a[@class='page'][starts-with(@href, '?forum_page=')][position()=last()]", document.getElementById("forum_wrap"));
	// only one page, nothing to join
	if(pageNrElmFirst == null || pageNrElmLast == null)
		return;
	var pageNrElmCurr  = xpath1(".//span[@class='seiten']/em/text()", document.getElementById("thread_sortierung"));
	if(pageNrElmCurr === null)
		pageNrElmCurr  = xpath1("./span[@class='active']/text()", document.getElementById("paginierung"));
	if(pageNrElmCurr === null) {
		log("current page element not found joinOverviewPagesNew()");
		return;
	}

	var threadTree = document.getElementById("tree_thread_list");
	if(!threadTree)
		var threadTree = xpath1(".//div[@class='inner_forum_list']/ul[@class='forum_list']", document.getElementById("forum_wrap"));
	if(threadTree == null) {
		log("no tree_thread_list or forum_list (joinOverviewPagesNew)");
		return;
	}

	// the "first page" is actually the first with a link in the navigation bar
	// so when you are on the first page, firstPage is 2 ("Seite 2")
	var firstPageURL = "";
	var lastPageURL  = "";

	// find the first and last of the page URLs
	firstPageURL = ensureAbsoluteUrl(pageNrElmFirst.getAttribute("href"));
	lastPageURL  = ensureAbsoluteUrl(pageNrElmLast.getAttribute("href"));

	if(firstPageURL == "" || lastPageURL == "") {
		log("found no page URLs (joinOverviewPagesNew)");
		return;
	}

	// extract the post numbers
	var firstPageNr   = extractPostStart(firstPageURL);
	var lastPageNr    = extractPostStart(lastPageURL);
	var currentPageNr = parseInt(pageNrElmCurr.textContent);
	if(firstPageNr == -1 || lastPageNr == -1) {
		log("found no page numbers (joinOverviewPagesNew)");
		return;
	}
	if(Number.isNaN(currentPageNr)) {
		log("could not find current page number");
		return;
	}

	// limit pages to users setting
	var limited = false;
	if(lastPageNr - currentPageNr > maxJoinedPosts / overviewPagePostCount) {
		lastPageNr = currentPageNr + maxJoinedPosts / overviewPagePostCount;
		limited = true;
	}
	// add list items and load the overview pages into them
	for(var j = currentPageNr+1; j <= lastPageNr; j++) {
		var url = ensureAbsoluteUrl(insertPostStart(lastPageURL, j));

		var li = document.createElement('li');
		li.innerHTML = "<b>Beitr&auml;ge ab Seite " + j + "</b>";
		threadTree.appendChild(li);

		li = document.createElement('li');
		li.innerHTML = "<i>Lade...</i>";
		threadTree.appendChild(li);

		requestHTML(url, callbackOverviewPage, j, li);
	}

	// add links to navigate
	if(currentPageNr > 1) {
		var li = document.createElement('li');
		li.innerHTML = "<a href=\"" + ensureAbsoluteUrl(insertPostStart(lastPageURL, currentPageNr > (maxJoinedPosts / overviewPagePostCount) ? currentPageNr - maxJoinedPosts / overviewPagePostCount - 1 : 1)) + "\"><b>Vorwärts...</b></a>";
		threadTree.insertBefore(li, threadTree.childNodes[0]);
	}
	if(limited) {
		var li = document.createElement('li');
		li.innerHTML = "<a href=\"" + ensureAbsoluteUrl(insertPostStart(lastPageURL, lastPageNr + 1)) + "\"><b>Weiter...</b></a>";
		threadTree.appendChild(li);
	}
}

function callbackOverviewPage(txt, nr, startli, url)
{
	if(isNewForum) {
		callbackOverviewPageNew(txt, nr, startli, url);
		return;
	}

	var matches = txt.match(/<ul class=\"(thread_tree|fora_list)\">([\s\S]*)<\/ul>[\s\S]*?<ul class="forum_navi">/i);
	if(!matches) {
		startli.innerHTML = "<b><i>Fehler beim Laden</i></b>";
		return;
	}

	var lis = matches[2];
	lis = lis.replace(/\/read(?!\/showthread-1)/g, "/read/showthread-1");
	startli.innerHTML = "<ul style=\"padding-left: 0px; list-style-type: none\">" + lis + "</ul>";

	showOverviewPosterScores(startli);
}
function callbackOverviewPageNew(txt, nr, startli, url)
{
	var matches = txt.match(/<ol id="tree_thread_list">([\s\S]*)<\/ol>[\s\S]*?<!-- Seitenzahl [\d ]+ -->[\s\S]*?<div class="paginierung(?:_thread)?">/i);
	if(!matches)
		matches = txt.match(/<div class="inner_forum_list" id="inner_forum_list_\d+">\s*<ul class="forum_list">\s*(<li class="forum[\s\S]*)<\/ul>\s*<\/div>\s*<div id="paginierung">/i);
	if(!matches) {
		startli.innerHTML = "<b><i>Fehler beim Laden der Seite</i></b>";
		return;
	}
	var lis = matches[1];
	startli.innerHTML = "" + lis + "";

	showOverviewPosterScores(startli);
}

function showOverviewPosterScores(root) {
	var userdivs;
	if(isNewForum)
		userdivs = xpath(".//span[contains(@class, 'written_by_user')]", root);
	else
		userdivs = xpath(".//div[@class='thread_user']", root);

	for(var i = 0; i < userdivs.snapshotLength; i++) {
		var div = userdivs.snapshotItem(i);
		div.innerHTML += getPosterScoreBarCode(div.innerHTML.trim());
	}
}

function cleanUpReplyPage()
{
	if(isNewForum) {
		cleanUpReplyPageNew();
		return;
	}

	if(enableAutoQuote && document.getElementsByName("message")[0].value == "") {
		// select the right button the ultra hacky way
		document.getElementsByName("quote")[0].click();
		return;
	}

	var form = xpath1("//div[@class='forum_content' or @id='mitte_forum']");
	var html = form.innerHTML;

	// messy but working
	html = html.replace(/(?:Unsere Foren|Dieses Forum)[\s\S]*<textarea/i, "<textarea");
	html = html.replace(/<i>\([^)]+\)<\/i>/ig, "");

	document.body.innerHTML = html;
}

function cleanUpReplyPageNew()
{
	// do not crop the regular answer page (e.g. after click on "Zitat einfügen")
	if(top === self && /\/save\/$/.test(document.location.href))
		return;

	if(enableAutoQuote && document.getElementById("msg_body").value == "") {
		// select the right button the ultra hacky way
		document.getElementsByName("insert_quote")[0].click();
		return;
	}

	/*var noticep = xpath1(".//p[@class='forum__hinweis']", document.getElementById("composer"));
	noticep.parentNode.removeChild(noticep);*/
	var form = document.getElementById("reply_create_posting");
	document.body.innerHTML = form.innerHTML;
}

function isWriteUrl(url)
{
	if(isNewForum)
		return url.match(/\/reply\/$/);
	return url.match(/\/write\/$/);
}

function isNoTextEntry(titleText)
{
	if(titleText.match(/[[/(](?:[kno](?:\.?w)?[./]?t\.?)[\])]\s*$/i)) return true;
	return false;
}

function ensureShowThreadLinks()
{
	//there is no equivalent for this in the new forum?
	if(isNewForum) return;

	var links = xpath("//a[contains(@href, '/read/') and not(contains(@href, '/read/showthread-1'))]");

	// we need the tree enabled on all links
	for (var i = 0; i < links.snapshotLength; i++) {
		var link = links.snapshotItem(i);
		link.href = link.href.replace(/\/read\/(?!showthread-1)/, "/read/showthread-1/");
	}
}

function iReplyNew(frameId, replyUrl) {
	var frm = document.getElementById(frameId);
	frm.src = replyUrl;
	frm.style.display = "";
}

function main()
{
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^\s+/, '').replace(/\s+$/, '');
		};
	}

	ensureShowThreadLinks();

	if(enableIReply) {
		if(!isNewForum)
			defineScriptInPageContext(
			'function iReply(frameId, replyUrl) {' +
				'var frm = document.getElementById(frameId);' +
				'frm.src = replyUrl;' +
				'frm.style.display = ""' +
			'}');

		// is reply page?
		if((isWriteUrl(document.location.href) || document.body.innerHTML.match(/<textarea name="message"/i) || document.body.innerHTML.match(/<textarea name="body" id="msg_body"/i)) &&
		  (top === undefined || !isWriteUrl(top.location.href))) {
			cleanUpReplyPage();
			return;
		}
	}

	if(enableQuickVote && !isNewForum) {
		defineScriptInPageContext(
		'function sendVote(target, voteUrl) {' +
			'var xmlHttp = new XMLHttpRequest();' +
			'xmlHttp.open(\'GET\', voteUrl, true);' +
			'xmlHttp.send(null);' +
			'target.style.backgroundColor = "yellow";' +
		'}');
	}

	// is board overview?
	if(document.location.href.match(/\/forum-\d+\/list/) ||
	   document.location.href.match(/\/foren\/(?:hs-\d+\/)?$/) ||
	   document.location.href.match(/\/forum-\d+(?:\/comment)?\/$/) ||
	   document.location.href.match(/\/forum-\d+\/page-\d+\/$/) ||
	   document.location.href.match(/\/forum-\d+\/\?$/) ||
	   document.location.href.match(/\?forum_page=\d+$/)) {
		if(showRatings === 1)
			addStyle(".tree_thread_list--rating { display: inline !important; }"); // Rating in post list at the bottom of the thread, and in thread list);
		if(joinSubLevelForen === 1)
			joinOverviewPages();
		return;
	}

	// else must be a thread view
	// except the reply site has no thread tree but has comments embedded
	if(!/\/reply\/$/.test(document.location.href))
		joinThreadPosts();
}
main();
})();
