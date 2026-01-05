// ==UserScript==
// @name           Texags Tools
// @namespace      bmc13texagstools
// @description    Version 3.0.1
// @icon		   data:image/png;base64,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
// @include        http://texags.com/forums/*
// @version        3.0.1
// @downloadURL https://update.greasyfork.org/scripts/9482/Texags%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/9482/Texags%20Tools.meta.js
// ==/UserScript==

/*********  USER-DEFINED VARIABLES  ***********/
/**********************************************/

var eraserSRC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjJJREFUeNqkk8+LEmEYx593dlQQVPBvKAg8rAfBREITDXYHD7V0qVuXoTQwPMgSLkgXITxEUEyXZaGiW+y65KUfp6g5epdV9xY0Ooq/nZm3531zxNb11DO8PO+873ze7/d93ncIIQTsiMfjkEqlwOFwwNXCGxBwjM0KQMIUIAlACebPBsBPEygY2EQGRiIRiMVi4HK54JK4bgFN7n56+4yJVXfu2+v+YJNiJpPZBPK1LYCUVD0qdTUNrQiQrr0rfdy5t8WNAXwXYHMw+Nbu8WGpgzClaN6yoNPpwO3a+wMTQMJvbpBsNssdOJ3OZRZFcduyrPCTaxFF73a5MrNPFlk/Pwe/3w+1h/vP1xyg0vZ0Og3ncjnFSIWAoipTZg5YX2s2//YpL+KWcBGeTCbhfD6vzGYzME0T3HeTy0V+L2Cfzwcnj/Zf4OipsAqPx+NwoVBQ0AGH7ea6cxN+nZ3hGhaHq4+fvsRjPEEf34RV5WKxqGD+B2aticrWXoLDp7mDV1jAY8S+8mO0lcvlsjIajdaOot1uYw0F8Hq9sPfhtfyA0Cah5Is9LzLlSqWiDIfDNbjVai1hSZJkwzBUPMw6WflGtEFmdTWYbRtOJBIcdrvd9Ysigq7rajqdlj0eDy8Sa41Gg2c2Fo1G5X6/r+J7/bLbJqByXdM0NRgMygzCPi8WUw6FQvJgMNgI8y0s7Nd7vR4EAgF5Pp/z7Swui4rbWMJXJgS8+AtQ++jxIfyO/0f8EWAADzdBFBtx5MkAAAAASUVORK5CYII=';
var eraserSRC2 = '\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjJJREFUeNqkk8+LEmEYx593dlQQVPBvKAg8rAfBREITDXYHD7V0qVuXoTQwPMgSLkgXITxEUEyXZaGiW+y65KUfp6g5epdV9xY0Ooq/nZm3531zxNb11DO8PO+873ze7/d93ncIIQTsiMfjkEqlwOFwwNXCGxBwjM0KQMIUIAlACebPBsBPEygY2EQGRiIRiMVi4HK54JK4bgFN7n56+4yJVXfu2+v+YJNiJpPZBPK1LYCUVD0qdTUNrQiQrr0rfdy5t8WNAXwXYHMw+Nbu8WGpgzClaN6yoNPpwO3a+wMTQMJvbpBsNssdOJ3OZRZFcduyrPCTaxFF73a5MrNPFlk/Pwe/3w+1h/vP1xyg0vZ0Og3ncjnFSIWAoipTZg5YX2s2//YpL+KWcBGeTCbhfD6vzGYzME0T3HeTy0V+L2Cfzwcnj/Zf4OipsAqPx+NwoVBQ0AGH7ea6cxN+nZ3hGhaHq4+fvsRjPEEf34RV5WKxqGD+B2aticrWXoLDp7mDV1jAY8S+8mO0lcvlsjIajdaOot1uYw0F8Hq9sPfhtfyA0Cah5Is9LzLlSqWiDIfDNbjVai1hSZJkwzBUPMw6WflGtEFmdTWYbRtOJBIcdrvd9Ysigq7rajqdlj0eDy8Sa41Gg2c2Fo1G5X6/r+J7/bLbJqByXdM0NRgMygzCPi8WUw6FQvJgMNgI8y0s7Nd7vR4EAgF5Pp/z7Swui4rbWMJXJgS8+AtQ++jxIfyO/0f8EWAADzdBFBtx5MkAAAAASUVORK5CYII=\'';
var highlighterSRC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfhJREFUeNpi+P//PwMxeG89CycQ26OLMzEQAfY1sPoxsbB/E5DTPQBkT0CRJMJmv/3N3P/fXG///+fT6v+Xllr8B4pNIMoFUJs36obUMAjJaTAw/rrNoOESxyCspJcPcwkjyBRiNP/7tJ3hz48PDH/+STD8+iPJcPfgcoZPT69NxGoALs0/v35i+PL+C8OvvwoM/5jkGZ6dXorpBUKaP739yvCfRYnh49ObDL8+P0c1YHunDg8jKw9ezewivgwfHl9jeH9zMzAG/rrBvTB37lxmRkbGP0xMTAw25pwMiiKXGP58vYOp+cl1hvc3NoE1OzX83g13QXJy8t/v378fcXFxYdh3+CPDjYdyDL9/c6FoBjkbqtkTpBmkD8ULP3780Pzz5w+Ds7Mzw/4TvxmuPNRi+P5dAK753fUNIM0+QM07YHrgXpjQ25nCyMIxG2SAq6srAycnJ8OmTZsYtKS/MEgy3QBqXg/TvBXZUiZoyHv8+3J/Nsj5SkpKYI0fPnxg8PHxYbj4gJ3h+bXdIM3+6JrBLgAmSw8mZtbt/3VyGY5e5WVQVVVlOHv2LMPfv39fAOU/irE8OGrKuSkTqPkXtgTHwsTMsl3TI4nh138uhq8PDzOcPnn5wo8/4lmTJk06TkxGA7sASGcCsR8QTwfiGqBt7xiIBAABBgCq3WnfTNMstwAAAABJRU5ErkJggg==';
var highlighterSRC2 = '\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfhJREFUeNpi+P//PwMxeG89CycQ26OLMzEQAfY1sPoxsbB/E5DTPQBkT0CRJMJmv/3N3P/fXG///+fT6v+Xllr8B4pNIMoFUJs36obUMAjJaTAw/rrNoOESxyCspJcPcwkjyBRiNP/7tJ3hz48PDH/+STD8+iPJcPfgcoZPT69NxGoALs0/v35i+PL+C8OvvwoM/5jkGZ6dXorpBUKaP739yvCfRYnh49ObDL8+P0c1YHunDg8jKw9ezewivgwfHl9jeH9zMzAG/rrBvTB37lxmRkbGP0xMTAw25pwMiiKXGP58vYOp+cl1hvc3NoE1OzX83g13QXJy8t/v378fcXFxYdh3+CPDjYdyDL9/c6FoBjkbqtkTpBmkD8ULP3780Pzz5w+Ds7Mzw/4TvxmuPNRi+P5dAK753fUNIM0+QM07YHrgXpjQ25nCyMIxG2SAq6srAycnJ8OmTZsYtKS/MEgy3QBqXg/TvBXZUiZoyHv8+3J/Nsj5SkpKYI0fPnxg8PHxYbj4gJ3h+bXdIM3+6JrBLgAmSw8mZtbt/3VyGY5e5WVQVVVlOHv2LMPfv39fAOU/irE8OGrKuSkTqPkXtgTHwsTMsl3TI4nh138uhq8PDzOcPnn5wo8/4lmTJk06TkxGA7sASGcCsR8QTwfiGqBt7xiIBAABBgCq3WnfTNMstwAAAABJRU5ErkJggg==\'';
var hidethreadbuttonsrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABf0lEQVQ4ja1Ty26CUBCFpHbJorX/QWL8Ew1GEyWBUnTJkp0IicEdFdBojJr4Aj5L60eApTPE2wAVmzSd5ORy59zDzJ0DFPXfwTDM0y8cXcQ/8DxvdbvdU71eF/Ik5Pher3fsdDo2bEt5npZl+d1xnHi328W6rl+azaZEyFqtJkIuQs513VgURTvTSbVafTZN8+T7frzdbhMYhhG2Wq1Bu93ugzgkeTwzGo3OLMu+ZFqwLEtYLpeX/X4fbzabBNPpNAHZYwer1eoCnUrUrRiPx29wIMJKRIDAZ8xBgci2bbloiEnAHQeHw+G7KoHneTFU1u+KMVRV7ZOqaeDVgBvcFXMcJwyHw5BcIQ3MIddoNF5visE2Hq0iYlyDIEiQzqHFWCgjRhs1TTsSB67TjgDGfD7X1+t1SDhc4exHpVIpp99BgwM2eozDAuFnetpgpYgWI4dngJtQ+U9akqTSbDZzF4vFGV72454gEpCDjibwWT8WzZFWFKVcRF65wp/pT/EFEAk0zgbhR9gAAAAASUVORK5CYII=';
var scriptOptionsImgSRC = 'data:image/gif;base64,R0lGODlhWgAPAPcAAAAAAJmZmf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAABaAA8AAAirAP8JHEiwoMGDCBMqXMhwYYCGECNKnAjxIcWLGDMqtKixo0eKHD+KHIkw5EABKE+m/IdyZUuWL2HGVClAYMuaMlPG3HnS5kqDJlkWxCmUKM6jPW0aNCpUqVOnTF02TRhU5tOnSKcyHdpz69SmUYv6JFqwateuM4/O/Io1J0GyWcXC5Ap0aVqpSl+STToUL12rgKOuJWiWpGGPhQ8rvph4seOKjyNjbCy5ctmAADs=';


var staffList = Array('WatchOle', 'Liucci', 'JeremyK', 'MWR Admin', 'ooshwa', 'myBCS.com', 'thisladyisacop', 'TLIAC', 'Mr. Traffic', 
					  'gabe_bock', 'Logan Lee', 'ACutt817', 'Brandon Leone', 'TexasA&amp;MFoundation', 'Zerick Rollins', 'AndrewstheMAN', 
					  'Beau Holder', 'Coach Sherrill', 'Jordan Kirkland','TexAgs Sponsors','TexAgs Films','Brice Jones','Jacob Kristen',
					  'TexAgs Studios','bbb','ccc');
var i,j,k;

function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i < els.length; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

function getImgElementsPartialSrc(searchString,node) 
{
	var classElements = new Array();
	var foundElement = null;
	if ( node == null )
	{
		node = document;
	}
	
	var els = node.getElementsByTagName('img');
	
	var pattern = new RegExp(searchString);
	for (i = 0; i < els.length; i++) {
		if ( pattern.test(els[i].src) ) 
		{
			foundElement = els[i];
			i = els.length;
		}
	}
	
	return foundElement;
}

//use http://www.allprofitallfree.com/color-wheel2.html to pick the color of your choice 
//then copy and paste the 6 digit/letter HTML code after the # sign in place of the old color code

var staffListHighlightColor = '#ffdddd';
var postedHighlightColor = '#ddffdd';
var repliedHighlightColor = '#ddddff';
var repliedHighlightColorLight = '#efefff';
var clearHighlightColor = '#ffffff';

var testPM = /privatemessage.postmessage/;

var testForum = /forums/;
var testTopic = /topics/;
var testWatch = /watchtopics.asp/;

var testForumLinks = /forum.main.asp/;

var testTopicHTML = /Topic:/;
var url = window.location.href;

		// when using this make sure to define currObject and topId before inserting this block
var highlightButtonCodeString = '\
{\
console.log(\'trying to highlight:\' + topId);\
localStorage.setItem(topId,\'0\');\
var topicRow = currObject.parentNode.parentNode;\
topicRow.style.backgroundColor=\''+postedHighlightColor+'\';\
topicRow.style.fontWeight=\'bold\';\
for(var j=0;j<topicRow.childNodes.length; j++)\
{\
if(topicRow.childNodes[j].nodeType==1)\
try\
{\
topicRow.childNodes[j].style.backgroundColor = \''+postedHighlightColor+'\';\
topicRow.childNodes[j].style.fontWeight = \'bold\';\
}\
catch(err)\
{}\
}\
currObject.src='+eraserSRC2+';\
currObject.id=currObject.id+\'c\';\
currObject.parentNode.removeChild(currObject);\
}';
var eraseButtonCodeString = '\
{\
console.log(\'trying to clear:\' + topId);\
localStorage.setItem(topId,-1);\
var topicRow = currObject.parentNode.parentNode;\
topicRow.style.backgroundColor=\''+clearHighlightColor+'\';\
topicRow.style.fontWeight=\'bold\';\
for(var j=0;j<topicRow.childNodes.length; j++)\
{\
if(topicRow.childNodes[j].nodeType==1)\
try\
{\
topicRow.childNodes[j].style.backgroundColor = \''+clearHighlightColor+'\';\
topicRow.childNodes[j].style.fontWeight = \'bold\';\
}\
catch(err)\
{}\
}\
currObject.src='+highlighterSRC2+';\
currObject.id=currObject.id+\'c\';\
currObject.parentNode.removeChild(currObject);\
}';

console.log("starting");

var showHighlightButtons = localStorage.getItem('SHOW_HIGHLIGHT_BUTTONS_TOPICS_PAGE');
if(showHighlightButtons == null || showHighlightButtons == 'none')
{
	localStorage.setItem('SHOW_HIGHLIGHT_BUTTONS_TOPICS_PAGE','true');
	showHighlightButtons = 'true';
}
var highlightStaffThreads = localStorage.getItem('HIGHLIGHT_STAFF_THREADS_TOPICS_PAGE');
if(highlightStaffThreads == null || highlightStaffThreads == 'none')
{
	localStorage.setItem('HIGHLIGHT_STAFF_THREADS_TOPICS_PAGE','true');
	highlightStaffThreads = 'true';
}
var showHideThreadButtons = localStorage.getItem('SHOW_HIDE_THREAD_BUTTONS');
if(showHideThreadButtons == null || showHideThreadButtons == 'none')
{
	localStorage.setItem('SHOW_HIDE_THREAD_BUTTONS','true');
	showHideThreadButtons = 'true';
}

var showHiddenThreads = localStorage.getItem('SHOW_HIDDEN_THREADS');
if(showHiddenThreads == null || showHiddenThreads == 'none')
{
	localStorage.setItem('SHOW_HIDDEN_THREADS','false');
	showHiddenThreads = 'false';
}
console.log('showing the highlight options? ' + showHighlightButtons);
console.log('highlighting staff threads? ' + highlightStaffThreads);
console.log('show hide thread buttons? ' + showHideThreadButtons);
console.log('show hidden threads? ' + showHiddenThreads);
// do always


var timeout = null;


function runWatchHighlight() 
{

var url2 = window.location.href;
console.log(url2);
console.log(testForum.test(url2));

var forumUrlFound = testForum.test(url2)
var topicUrlFound = testTopic.test(url2);

if (forumUrlFound && topicUrlFound) /* look for a topic page */
{
	var topicID;
	var findTopicID = /topics\/(\d+)/; /* regular expression to extract the topic id */
	url2.match(findTopicID);
	topicID = RegExp.$1;
	console.log('extracted topic id:' + topicID);
	
	var lastThread = localStorage.getItem('LAST_THREAD');
	console.log('last thread:'+lastThread);
	try
	{
		if(lastThread == null || lastThread != topicID)
		{
			console.log('new page:'+topicID);
			
			lastThread = topicID;
			
			localStorage.setItem('LAST_THREAD',lastThread);
		}
		else if(lastThread == topicID)
		{
			console.log('same page as last run');
		}
		
		var postReplyBox = document.getElementById('newControls');
		if(postReplyBox != null)
		{
			console.log('found post reply box');
			var postReplyButton = document.getElementById('submit');
			if(postReplyButton != null)
			{
				postReplyButton.addEventListener('click', function(event) {if(null == localStorage.getItem(topicID)){localStorage.setItem(topicID, 0);}}, false);
			}			
		}
		else
		{
			console.log('no post reply box');
		}
	}
	catch(err)
	{
	}
	
	// scan through posts and remove blocked users
	try
	{
		// get the list of topics
		var posts = getElementsByClass("ajax postUsername", null, "a");
		console.log('num posts:'+posts.length);
		for (var ia=0; ia<posts.length; ia++) 
		{
			var postElement = posts[ia];
			var postUserName = postElement.innerHTML.trim();
			var postUserNameUpper = postUserName.toUpperCase();
			var ignoreResult = localStorage.getItem('IGNORE_' + postUserNameUpper);
			if(ignoreResult != null && ignoreResult == "true")
			{
				if(hidePostsByIgnoredUsers)
				{
					var postRow = postElement.parentNode.parentNode;
					postRow.parentNode.removeChild(postRow);
					//postElement.parentNode.innerHTML = 'hello';
					console.log('removing post by ' + postUserName);
				}
				else
				{
					console.log('hiding post by ' + postUserName);
					//userInfo
					var postRow = postElement.parentNode.parentNode;
					for(var i3 = 0; i3 < postRow.childNodes.length; i3++)
					{
						if(postRow.childNodes[i3].nodeType==1)
						{
							if(postRow.childNodes[i3].className != 'userInfo')
							{
								postRow.removeChild(postRow.childNodes[i3]);
								//postRow.childNodes[i3].style.visibility = 'hidden';
							}
						}
					}
					//postRow.parentNode.removeChild(postRow);
					var postParent = postElement.parentNode; 
					postParent.innerHTML = '';
					var tempUserDiv = document.createElement('div');
					tempUserDiv.setAttribute('class','userInfo');
					var tempUserADiv = document.createElement('div');
					tempUserADiv.setAttribute('class','ajax postUsername');
					tempUserADiv.innerHTML = 'Post by ' + postUserName + ' removed.';
					var restoreUserImg = document.createElement('img');
					restoreUserImg.setAttribute('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAcCAYAAABoMT8aAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAB1MAAAdTAB3TNyzQAAAAd0SU1FB9sIGBUCB6dP5EcAAAMXSURBVDjL7VTPa1xVFP7OvXcymWSSFFNj05mYdMb8clE1QUpNCAZsdjVV0E2hm0LBbrIyaxe6DkKhCioumq1Wd66smsZBKHSsoTRuplJrJ8kkk5m8ee/dd+85LkbaIv0T8sHhwOGcb3HO9x3gEPT/wosrI6OnRk6dH+rNLx7JHJkwZMy+3a/sBLUf1ivr1+5e3ig9k2Dw4xwV8y+tvPvqO0tnRt4SL54gTxoVKak0KnS19Pla+f7t+YfLD9xjguOf5GlyZPL28vyHJ7OprGjSpEmD/uMXCLx4sLA4dvTt3es7q7+tDm4tP3IKAAq54srl2Q9OEkist2TZ4iA5QJAEiDmGZYuEE1i2FPsYC6Nnjs6MzpQBQI99OjG68MrCaq43JwAIAli2GO8bh0AQuABOHBy3I+EEEUdSHCgMVKe2y6Y4WDw/NjAmLdci1gxHDm/nz0KRwla4hYZrQJMGBGBwm8BHZDmRwvOFJdOT6Vlsxk3qNJ3IdeXx5sAciAgigun+KUzJa7Bs8d2D7yFgeGaEHKHlWtSd6Z5TpGmi6ZvYtbso9hRA1F7c0zmt03h/+D049mj5EKELceAOYNJG6dy5/EfZbI/qNt24VbsFBYXh7DAAYLOxib/DhzBk0GW6cCzzAm5UfwILo273UNm+D33s7PELNdSea8oBMroT1aiK0k4J0/3T+LF6A3fqf2Bt+ya0Mpjsm8DPW2vYbP6Je/VNNHYboocWh8ZVh35dGUUOCUIfInABvvnrOmpxDc2kidCFKO+VkaIUFAi/799BFEZwQbKhxMk1bnmKXCSRi2B9++Y9qewTDUgCFsbVe58hq7IIXQgfOoiXKwQAp7+a+SXdl55N93WiN9WLjOlESqWgSLWVKALHDqFEqO/WYWFh9+LAx77fAAAY87Zh/wHh6H5WxLKltO6AJg0igmcPywlCF7aH63HMjk+ULq3Hj810+osZQ4rKpsu8bLpTojoUaa0BAtgzvPXwoYNruYAdn/j14s3tZ9r5jS9nz5GmJWXUHDQpAiAswo43xMsVdvx16dJ6fPgJD/E0/gUyOKYLM0EGtAAAAABJRU5ErkJggg==');
					restoreUserImg.setAttribute('title','Click to restore ' + postUserName + '\'s posts on the next page load...');
					restoreUserImg.setAttribute('onClick','localStorage.setItem("IGNORE_' + postUserNameUpper + '","false");var p4 = this.parentNode;p4.innerHTML = \'This post by ' + postUserName + ' will be restored after the next page refresh.\';');
					tempUserDiv.appendChild(tempUserADiv);
					tempUserDiv.appendChild(restoreUserImg);
					postParent.appendChild(tempUserDiv);
				}
			}
			else
			{
				var ignoreUserImg = document.createElement('img');
				ignoreUserImg.setAttribute('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmtJREFUeNqMU0toE2EQ/naTqDSPkoc2pbSlWpAG9ODrkosoLfV1EEUwJ0GwpAQtSEpBvAlCCxIfmKsnb6KCj5ioCKJotVDRSsVqqTUmJtkNyea9u1n//7eJq+nBgW9nmfnm25llhtM0DXqLuq0O4k4R7CLYTmAgmFlBeCgppfV8Ti8QcVsvmixtE517vLBt6oWlrwccz0FaXEaBIP74OeR8YWo4KY23CDxwW686tg4EPCM+cOIS6rk06vkMy/FWJ3ibC1jfh/kbt5Ceng3vT0qjNGekj3sdtguubVsCHt8Qaq/uIHrzIwaP9f/pU8ojFoph8PgANh/ZTSX9pKZw8Gd+nL/bYevizW3n+g95UZp+hLcfTPDFU5iZN0OVVQb6zmJza1B6E8XGfTthtLcHWa2qwd+114vq3EsoVRnDD2Pso9TPfrEx6GNKTUXl/Qt0eneA1vIquAMWCyAXikRAQSp0ptk5LWgUU6M5ypGLZVjtRpDaw7yiwcOVMkRZYci/foLEVAD/Go3RXIOHXAKktp92UCun0pCp8grePf3UIkBjek5FFGkHIAJYKOarUCoyw1K5+6+29ePQXINXzlWJAL7REe5nJTRb0xd/PX+SQS/S4GUljY4QoSOEk4kiamWF/aDPEycYmXrhWYRBH2M/saLg+48iHSHMNjHstE/abcZg7wYD/seW0yqEnHLZL2THmqt8zWm/bjdz/m6nAWT9V7U6ocbFOoRCPRwQsqMtx3TF6Zg0Gbigy6yhfR2w1vg7TnYHuTKQKXGoKdql04J4dtVrpBZyOHqI8xMcJWgcxCLBbXrOY6K4oOf/EmAAfyhg+goYmG4AAAAASUVORK5CYII=');
				ignoreUserImg.setAttribute('title','Click to ignore ' + postUserName + '\'s posts...');
				ignoreUserImg.setAttribute('alt','ignoreuserbutton');
				ignoreUserImg.setAttribute('onClick','var ignoreUserResult = confirm("Are you sure you want to ignore ' + postUserName + '\'s posts?");if(ignoreUserResult != null && ignoreUserResult == true){localStorage.setItem("IGNORE_' + postUserNameUpper + '","true");var p4 = this.parentNode;p4.parentNode.removeChild(p4);}');
				var ignoreDiv = document.createElement('div');
				ignoreDiv.setAttribute('align','right');
				ignoreDiv.setAttribute('style','float:right;padding-left:10px');
				ignoreDiv.appendChild(ignoreUserImg);
				
				var postDiv = postElement.parentNode.parentNode;
				
				var postControlsDiv = getElementsByClass('postControls',postDiv,null);
				
				if(postControlsDiv.length > 0)
				{
					//console.log('found post controls:'+postControlsDiv[0].className);
					var found = postControlsDiv[0].innerHTML.indexOf('ignoreuserbutton');
					if(found == -1)
						postControlsDiv[0].appendChild(ignoreDiv);
				}
				else
				{
					console.log('did not find post controls');
				}
				if(0)
				{
				console.log('child nodes:' + postNameParent.childNodes.length);
				for(var ib=0; ib<postNameParent.childNodes.length; ib++)
				{
					if(postNameParent.childNodes[ib].nodeType==1)
					{
						//console.log('class:' + postNameParent.childNodes[ib].className);
						if(postNameParent.childNodes[ib].className == "userBadges")
						{
							var userBdgs = postNameParent.childNodes[ib];
							var found = userBdgs.innerHTML.indexOf('ignoreuserbutton');
							console.log('found:'+found);
							if(found == -1)
								postNameParent.childNodes[ib].appendChild(ignoreDiv);
							break;
						}
					}
				}
				}
			}
		}
	}
	catch(err)
	{
		console.log(err);
	}
}
else if (forumUrlFound && !topicUrlFound) /* look for a forum topic list page */
{
	console.log('forum topic list found');
	localStorage.setItem('LAST_THREAD',0);
	
	var postTopicBox = document.getElementById('newControls');
	if(postTopicBox != null)
	{
		console.log('-------------------------------------------found post topic box');
		return;
	}
	else
	{
		console.log('-------------------------------------------no post topic box');
	}
	
	var javaCode = document.getElementById('texags.extension.code');
	if(0)//javaCode == null)
	{		
		var codeElement = document.createElement('script');
		codeElement.setAttribute('type','text/javascript');
		codeElement.setAttribute('id','texags.extension.code');
		//codeElement.setAttribute('text','
		codeElement.innerHTML = '\
		function highlightAndSet(var currObject,var topId)\
		{\
		console.log(\'trying to highlight\');\
		localStorage.setItem(topId,\'0\');\
		var topicRow = currObject.parentNode.parentNode;\
		topicRow.style.backgroundColor=\'#ddffdd\';\
		topicRow.style.fontWeight=\'bold\';\
		for(var j=0;j<topicRow.childNodes.length; j++)\
		{\
		if(topicRow.childNodes[j].nodeType==1)\
		try\
		{\
		topicRow.childNodes[j].style.backgroundColor = \'#ddffdd\';\
		topicRow.childNodes[j].style.fontWeight = \'bold\';\
		}\
		catch(err)\
		{}\
		}\
		currObject.src=\'aa\';\
		}';
		//}');
		var headElem = document.getElementsByTagName('script');
		//var headChild = headElem.firstChild;
		//console.log('----------------------------------- ' + headElem);
		headElem[0].parentNode.appendChild(codeElement);
	}
	
	var thisTopic, topicID, lastReplyCount, currentReplyCount, theFooter, myUserName, highlightTopic;
	var findTopicID = /topics\/(\d+)/; /* regular expression to extract the topic id */
	
	/*******************get the logged in user's name*******************/
	//theFooter = getElementsByClass("footer2");
	theFooter = document.getElementById("btnPageUsername");
	
	try
	{
		//console.log(theFooter[0].innerHTML);
		console.log(theFooter.text);
		console.log(theFooter.id);
		myUserName = theFooter.innerHTML;
		console.log(myUserName);
		
	}
	catch(err)
	{
		console.log('no user name');
		myUserName = '';
	}
	/*******************************************************************/
	
	try
	{
		// get the list of topics
		var topics = getElementsByClass("topicInfo", null, "div");
		
		// go through the list of topics, and color them
		console.log('num topics:'+topics.length);
		for (i=0; i<topics.length; i++) 
		{
			thisTopic = topics[i];
			thisTopic.innerHTML.match(findTopicID);
			topicID = RegExp.$1;
			console.log('topicID:' + topicID + ':');
			var hiddenThread = 'false';
			//console.log('showing hidden threads? ' + showHiddenThreads);
			if(showHiddenThreads == 'false')
			{
				hiddenThread = localStorage.getItem("HIDE_THREAD_BT" + topicID);
				try
				{
					if(hiddenThread != null && hiddenThread == '1')
					{
						hiddenThread = 'true';
					
						// delete thread
						var toPicRow = thisTopic.parentNode;
						toPicRow.parentNode.removeChild(toPicRow);
						console.log(topicID + ' hidden');
					}
					if(hiddenThread == null)
					{
						hiddenThread = 'false';
					}
				}
				catch(err)
				{
				}
			}
			if(hiddenThread == 'false')
			{
				//lastReplyCount = localStorage.getItem(topicID);
				highlightTopic = localStorage.getItem(topicID);
				var thisThreadPosterElement = thisTopic.getElementsByClassName('topicAuthor');
				var thisThreadPoster = '----';
				if(thisThreadPosterElement.length == 1)
				{
					thisThreadPoster = thisThreadPosterElement[0].innerHTML.trim();
				}
				
				console.log(':'+thisThreadPoster+':');

				if (highlightTopic == null || highlightTopic == -1) // i haven't stored information about this topic before or i decided to not highlight this topic
				{
					if(highlightTopic == null)
					{
						// was this thread posted by me?
						if (thisThreadPoster == myUserName) 
						{
							console.log(thisTopic.parentNode.className);
							console.log(thisTopic.parentNode.childNodes.length);
							
							thisTopic.parentNode.style.backgroundColor = postedHighlightColor;
							thisTopic.parentNode.style.fontWeight = 'bold';
							// go through all the table cells for the topic and change their background color
							for(j=0;j<thisTopic.parentNode.childNodes.length; j++)
							{
								if(thisTopic.parentNode.childNodes[j].nodeType==1)
								try
								{
									console.log(thisTopic.parentNode.childNodes[j].className);
									thisTopic.parentNode.childNodes[j].style.backgroundColor = postedHighlightColor;
									thisTopic.parentNode.childNodes[j].style.fontWeight = 'bold';
								}
								catch(err)
								{
								}
							}
//							currentReplyCount = thisTopic.parentNode.parentNode.childNodes[4].innerHTML;
//							// store this thread with the current number of posts
//							localStorage.setItem(topicID, currentReplyCount);
						}
						else if(highlightStaffThreads == 'true')
						{
							// go through the staff list to mark their threads
							for(j=0; j<staffList.length; j++)
							{
								if (staffList[j].toUpperCase() == thisThreadPoster.toUpperCase())
								{
									console.log('highlighting staff thread');
									//console.log(thisTopic.parentNode.className);
									//console.log(thisTopic.parentNode.childNodes.length);
									
									thisTopic.parentNode.style.backgroundColor = postedHighlightColor;
									thisTopic.parentNode.style.fontWeight = 'bold';
									// go through all the table cells for the topic and change their background color
									for(j=0;j<thisTopic.parentNode.childNodes.length; j++)
									{
										if(thisTopic.parentNode.childNodes[j].nodeType==1)
										try
										{
											//console.log(thisTopic.parentNode.childNodes[j].className);
											thisTopic.parentNode.childNodes[j].style.backgroundColor = postedHighlightColor;
											thisTopic.parentNode.childNodes[j].style.fontWeight = 'bold';
										}
										catch(err)
										{
										}
									}
									
//									currentReplyCount = thisTopic.parentNode.parentNode.childNodes[4].innerHTML;
//									// store this thread with a -2 until it is actively viewed
//									localStorage.setItem(topicID, -2);
									
									// found a staff member, so jump out of the for loop
									//j = staffList.length;
									break;
								}
							}
						}
					}
				}
				else if ((highlightTopic == -2 && highlightStaffThreads == 'true') || highlightTopic >= 0 ) // some information about this topic was in the database
				{
					var bgColor;
					
					if (thisThreadPoster == myUserName)
					{
						// i posted this thread, so set bgcolor to my color
						bgColor = postedHighlightColor;
					}
					else
					{
						// i didn't post this thread, so i am either watching it, i replied to it, or staff posted it
						bgColor = repliedHighlightColor;
						// go through the staff list to mark their threads
						for(j=0; j<staffList.length; j++)
						{
							if (staffList[j].toUpperCase() == thisThreadPoster.toUpperCase())
							{
								bgColor = staffListHighlightColor;
								// found a staff member, so jump out of the for loop
								break;
							}
						}
					}
					
					thisTopic.parentNode.style.backgroundColor = postedHighlightColor;
					thisTopic.parentNode.style.fontWeight = 'bold';
					// go through all the table cells for the topic and change their background color
					for(j=0;j<thisTopic.parentNode.childNodes.length; j++)
					{
						if(thisTopic.parentNode.childNodes[j].nodeType==1)
						try
						{
							//console.log(thisTopic.parentNode.childNodes[j].className);
							thisTopic.parentNode.childNodes[j].style.backgroundColor = postedHighlightColor;
							thisTopic.parentNode.childNodes[j].style.fontWeight = 'bold';
						}
						catch(err)
						{
						}
					}
					
//					// go through all the table cells for the topic and change their background color to what was set above
//					for(j=0;j<thisTopic.parentNode.parentNode.childNodes.length; j++)
//					{
//						thisTopic.parentNode.parentNode.childNodes[j].style.backgroundColor = bgColor;
//						thisTopic.parentNode.parentNode.childNodes[j].style.fontWeight = 'bold';
//					}
//					currentReplyCount = thisTopic.parentNode.parentNode.childNodes[4].innerHTML;
//					
//					if(lastReplyCount == 0)
//					{
//						localStorage.setItem(topicID,currentReplyCount);
//					}
//					else if (lastReplyCount == -2)
//					{
//						// i haven't posted on or visited this thread yet, so don't do anything
//						thisTopic.setAttribute('onclick','localStorage.setItem(' + topicID + ',' + currentReplyCount +');');
//						thisTopic.parentNode.parentNode.childNodes[6].firstChild.setAttribute('onclick','localStorage.setItem(' + topicID + ',' + currentReplyCount +');');
//					}
//					else if (currentReplyCount != lastReplyCount) 
//					{
//						// update the current reply count section of the row to say xx + x
//						thisTopic.setAttribute('onclick','localStorage.setItem(' + topicID + ',' + currentReplyCount +');');
//					thisTopic.parentNode.parentNode.childNodes[6].firstChild.setAttribute('onclick','localStorage.setItem(' + topicID + ',' + currentReplyCount +');');
//						var newPosts = currentReplyCount - lastReplyCount;
//						if(newPosts != null && newPosts > 0)
//						{
//							var redFont = document.createElement('font');
//							redFont.setAttribute('color','#ff0000');
//							redFont.innerHTML = '&nbsp;+&nbsp;' + newPosts.toString(10);
//							thisTopic.parentNode.parentNode.childNodes[4].innerHTML = lastReplyCount.toString(10);
//							thisTopic.parentNode.parentNode.childNodes[4].appendChild(redFont);
//							//thisTopic.parentNode.parentNode.childNodes[4].innerHTML = lastReplyCount +" <font color='red'>+" + (currentReplyCount-lastReplyCount) + "</font>";
//						}
//						//localStorage.setItem(topicID,currentReplyCount);
//					}
				}
				var oldButton = document.getElementById('highlight'+topicID+'c');
				if(oldButton)
				{
					console.log('removing old button and changing');
					thisTopic.removeChild(oldButton);
				}
				var n = thisTopic.innerHTML.indexOf('highlight list');
				if(n == -1 && (showHighlightButtons == null || showHighlightButtons == 'none' || showHighlightButtons == 'true'))
				{
					for(var i = 0;i < thisTopic.childNodes.length; i++)
					{
						if(thisTopic.parentNode.childNodes[i].nodeType==1)
						{
							//console.log(thisTopic.childNodes[i].type);
							if(thisTopic.childNodes[i].tagName.toUpperCase() == "A")
							{
								//console.log('found link child');
								thisTopic.childNodes[i].style.maxWidth = '80%';
								break;
							}
						}
					}
//					// add highlighter or erase buttons to left side of topics list
//					console.log('---------------------------');
					var highlighterorcancelimg = document.createElement('img');
					//var highlightTopic;
//					thisTopic = topics[i];
//					thisTopic.href.match(findTopicID);
//					topicID = RegExp.$1;
					highlightTopic = localStorage.getItem(topicID);
					console.log(topicID + " - " + highlightTopic);
//					if (lastReplyCount == null || lastReplyCount == -1 || (lastReplyCount == -2 && highlightStaffThreads == 'false')) // i haven't stored information about this topic before or i decided to not highlight this topic
					if (highlightTopic == null || highlightTopic == -1)
					{
						// show an highlight option
						highlighterorcancelimg.setAttribute('src',highlighterSRC);
						//highlighterorcancelimg.setAttribute('onclick','{console.log(\'trying to highlight\');localStorage.setItem(' + topicID + ', \'0\');window.location.reload();}');
						//highlighterorcancelimg.setAttribute('onclick','{console.log(\'trying to highlight\');localStorage.setItem(' + topicID + ', \'0\');var topicRow = this.parentNode.parentNode;topicRow.style.backgroundColor=\'#ddffdd\';topicRow.style.fontWeight=\'bold\';for(var j=0;j<topicRow.childNodes.length; j++){if(topicRow.childNodes[j].nodeType==1)try{topicRow.childNodes[j].style.backgroundColor = \'#ddffdd\';topicRow.childNodes[j].style.fontWeight = \'bold\';}catch(err){}}}this.src='+eraserSRC2+';');
						highlighterorcancelimg.setAttribute('onclick','{var currObject = this;var topId = \''+topicID+'\';'+highlightButtonCodeString+'}');
						highlighterorcancelimg.setAttribute('title','Add this thread to the highlight list');
					}
					else
					{
						// show a delete option
						highlighterorcancelimg.setAttribute('src',eraserSRC);
						//highlighterorcancelimg.setAttribute('onclick','{console.log(\'trying to delete\');localStorage.setItem(' + topicID + ', -1);window.location.reload();}');
						highlighterorcancelimg.setAttribute('onclick','{var currObject = this;var topId = \''+topicID+'\';'+eraseButtonCodeString+'}');
						highlighterorcancelimg.setAttribute('title','Remove this thread from the highlight list');
						//highlighterorcancelimg.addEventListener('click', function(event) {console.log('trying to delete');localStorage.setItem(topicID, -1);}, false);
					}

					highlighterorcancelimg.setAttribute('id','highlight'+topicID);
					//highlighterorcancelimg.setAttribute('style','float:left; padding-top:7px; padding-right:10px');
					highlighterorcancelimg.setAttribute('style','right:10px; padding-top:7px; position:absolute;');
//					highlighterorcancelimg.setAttribute('width','16');
//					highlighterorcancelimg.setAttribute('height','16');
//					highlighterorcancelimg.setAttribute('align','center');
//					highlighterorcancelimg.setAttribute('valign','top');
//					var spacer = document.createElement('img');
//					spacer.setAttribute('src','/images/spacer.gif');
//					spacer.setAttribute('width','15');
//					spacer.setAttribute('height','1');
//					spacer.setAttribute('border','0');
//					spacer.setAttribute('align','center');
//					spacer.setAttribute('valign','middle');
//		
//					//newrowcell.appendChild(highlighterorcancelimg);
//					//thisTopic.parentNode.parentNode.appendChild(newrowcell);
//					var firstCell = thisTopic.parentNode.parentNode.firstChild;
//					firstCell.setAttribute('width','60');
//					firstCell.insertBefore(spacer,firstCell.firstChild);
//					//firstCell.removeChild(firstCell.firstChild);
//					firstCell.insertBefore(highlighterorcancelimg,firstCell.firstChild);
//					//firstCell.appendChild(highlighterorcancelimg);

					//var before = thisTopic.firstChild;					
					//thisTopic.insertBefore(highlighterorcancelimg, before);
					thisTopic.appendChild(highlighterorcancelimg);
				}
//				
//				if(showHideThreadButtons == null || showHideThreadButtons == 'none' || showHideThreadButtons == 'true')
//				{
//					thisTopic = topics[i];
//					topicRow = thisTopic.parentNode.parentNode;
//					topicRow.setAttribute('id','THREAD_BT' + topicID);
//					var hideThreadButtonImg = document.createElement('img');
//					hideThreadButtonImg.setAttribute('id','BT' + topicID);
//					hideThreadButtonImg.setAttribute('src',hidethreadbuttonsrc);
//					hideThreadButtonImg.setAttribute('width','16');
//					hideThreadButtonImg.setAttribute('height','16');
//					//hideThreadButtonImg.setAttribute('valign','top');
//					hideThreadButtonImg.setAttribute('style','position:relative;float:right;top:0px;right:0px;');
//					hideThreadButtonImg.addEventListener ('click', function(event) { console.log('received click event on ' + this.id); localStorage.setItem("HIDE_THREAD_" + this.id,1);var toPic = document.getElementById('THREAD_' + this.id);if(toPic!=null){toPic.parentNode.removeChild(toPic); } }, false );
//					
//					thisTopic.parentNode.appendChild(hideThreadButtonImg);
//					
//					// var tempButton = document.getElementById('BT' + topicID);
//					// if(tempButton != null)
//					// {
//						// tempButton.addEventListener ('click', function(event) { console.log('received click event on '); localStorage.setItem("HIDE_THREAD_" + this.id,1);var toPic = document.getElementById('THREAD_' + this.id);if(toPic!=null){toPic.parentNode.removeChild(toPic); } } );
//					// }
//				}
			}
		}
	}
	catch(err)
	{
		console.log(err);
	}
}

var hideThreadsByIgnoredUsers = localStorage.getItem('HIDE_THREADS_IGNORED_USERS');
if(hideThreadsByIgnoredUsers == null || hideThreadsByIgnoredUsers == 'none')
{
	localStorage.setItem('HIDE_THREADS_IGNORED_USERS','true');
	hideThreadsByIgnoredUsers = 'true';
}
console.log('hiding threads by ignored users? ' + hideThreadsByIgnoredUsers);

var hidePostsByIgnoredUsers = localStorage.getItem('HIDE_POSTS_IGNORED_USERS');
if(hidePostsByIgnoredUsers == null || hidePostsByIgnoredUsers == 'none')
{
	localStorage.setItem('HIDE_POSTS_IGNORED_USERS','false');
	hidePostsByIgnoredUsers = 'false';
}
console.log('hiding posts by ignored users? ' + hidePostsByIgnoredUsers);

var optionsExist = document.getElementById("optionsdiv");

if(optionsExist == null) // add options page
{
	var overDiv = document.createElement("div");
	overDiv.setAttribute("id","optionsdiv");
	overDiv.setAttribute("style","position:relative;overflow:hidden;float:left;width:1;visibility:hidden;");
	var transparentDiv = document.createElement("div");
	transparentDiv.setAttribute("style","z-index:100;position:absolute;top:0;left:0;width:100%;height:100%;background:#000;opacity:0.75;-moz-opacity:0.75;filter:alpha(opacity=75);position:fixed;");	
	overDiv.appendChild(transparentDiv);
	
	var secondDiv = document.createElement('div');
	secondDiv.setAttribute('style','z-index:2000;top:0;left:0;background:#ffffff;opacity:1.0;-moz-opacity:1.0;filter:alpha(opacity=100);position:fixed;float:left;');
	secondDiv.setAttribute('id','optionsarea');
	
	//secondDiv.innerHTML = "<table><tbody><tr><td><input type='checkbox'></td><td>Show highlight options on topic pages and watchlist?</td></tr></tbody></table>";
	
	var table1 = document.createElement('table');
	var table2 = document.createElement('tbody');
	table2.setAttribute('id','optionstablebody');
	var table2row1 = document.createElement('tr');
	var table2row1cell1 = document.createElement('td');
	var table2row1cell2 = document.createElement('td');
	var table2row2 = document.createElement('tr');
	var table2row2cell1 = document.createElement('td');
	var table2row2cell2 = document.createElement('td');
	
	var hideThreadsIgnoredUsersCB = document.createElement('input');
	hideThreadsIgnoredUsersCB.setAttribute('type','checkbox');
	hideThreadsIgnoredUsersCB.setAttribute('id','hideThreadsIgnoredUsersCB');
	if(hideThreadsByIgnoredUsers == 'true')
	{
		hideThreadsIgnoredUsersCB.setAttribute('checked','yes');
	}
	table2row1cell1.appendChild(hideThreadsIgnoredUsersCB);
	table2row1cell2.innerHTML = 'Hide threads by ignored users?';
	table2row1.appendChild(table2row1cell1);
	table2row1.appendChild(table2row1cell2);
	table2.appendChild(table2row1);
	
	var hidePostsIgnoredUsersCB = document.createElement('input');
	hidePostsIgnoredUsersCB.setAttribute('type','checkbox');
	hidePostsIgnoredUsersCB.setAttribute('id','hidePostsIgnoredUsersCB');
	if(hidePostsByIgnoredUsers == 'true')
	{
		hidePostsIgnoredUsersCB.setAttribute('checked','yes');
	}
	table2row2cell1.appendChild(hidePostsIgnoredUsersCB);
	table2row2cell2.innerHTML = 'Completely hide posts by ignored users?';
	table2row2.appendChild(table2row2cell1);
	table2row2.appendChild(table2row2cell2);
	table2.appendChild(table2row2);

	table1.appendChild(table2);		
	secondDiv.appendChild(table1);
	
	var savebutton = document.createElement('input');
	savebutton.setAttribute('id','optionssavebutton');
	savebutton.setAttribute('type','button');
	savebutton.setAttribute('height','30');
	savebutton.setAttribute('value','Save settings');
	//savebutton.setAttribute('onclick',"var o = document.getElementById('hideThreadsIgnoredUsersCB');if(o.checked == 'yes' || o.checked == true){console.log('saving yes');localStorage.setItem('HIDE_THREADS_IGNORED_USERS','true');}else{console.log(o.checked);console.log('saving no');localStorage.setItem('HIDE_THREADS_IGNORED_USERS','false');}o = document.getElementById('optionsdiv');o.style.visibility = 'hidden';");
	
	var cancelbutton = document.createElement('input');
	cancelbutton.setAttribute('type','button');
	cancelbutton.setAttribute('height','30');
	cancelbutton.setAttribute('value','Cancel');
	cancelbutton.setAttribute('onclick',"var o = document.getElementById('optionsdiv');o.style.visibility = 'hidden';");
	
	var clearButton = document.createElement('input');
	clearButton.setAttribute('id','optionsclearbutton');
	clearButton.setAttribute('type','button');
	clearButton.setAttribute('height','30');
	clearButton.setAttribute('value','Clear all script data');
	clearButton.addEventListener('click', function(event) { var deleteConfirm = confirm ("Are you sure you want to clear all stored data and settings?"); if(deleteConfirm){ localStorage.clear(); window.location.reload(); } } );
	
	
	secondDiv.appendChild(savebutton);
	secondDiv.appendChild(cancelbutton);
	secondDiv.appendChild(clearButton);

	overDiv.appendChild(secondDiv);
	document.body.appendChild(overDiv);
	
	var saveButton2 = document.getElementById('optionssavebutton');
	//saveButton2.addEventListener('click', function(event) { window.location.reload(); });
	saveButton2.addEventListener('click', function(event) { var oHTIU = document.getElementById('hideThreadsIgnoredUsersCB');if(oHTIU.checked == 'yes' || oHTIU.checked == true){console.log('saving yes');localStorage.setItem('HIDE_THREADS_IGNORED_USERS','true');}else{console.log(oHTIU.checked);console.log('saving no');localStorage.setItem('HIDE_THREADS_IGNORED_USERS','false');}var oDiv1 = document.getElementById('optionsdiv');oDiv1.style.visibility = 'hidden'; }, false);
	saveButton2.addEventListener('click', function(event) { var oHPIU = document.getElementById('hidePostsIgnoredUsersCB');if(oHPIU.checked == 'yes' || oHPIU.checked == true){console.log('saving yes');localStorage.setItem('HIDE_POSTS_IGNORED_USERS','true');}else{console.log(oHPIU.checked);console.log('saving no');localStorage.setItem('HIDE_POSTS_IGNORED_USERS','false');}var oDiv1 = document.getElementById('optionsdiv');oDiv1.style.visibility = 'hidden'; }, false);		
	saveButton2.addEventListener('click', function(event) { var fED = document.getElementById('emptyextradiv');if(fED != null){document.body.removeChild(fED);} var emptyDiv = document.createElement('div'); emptyDiv.setAttribute('id','emptyextradiv'); document.body.appendChild(emptyDiv);});
}

var pageFooter = document.getElementById('pageFooterNav');

if(pageFooter != null)
{
	for(var ic = 0; ic<pageFooter.childNodes.length; ic++)
	{
		var currNode = pageFooter.childNodes[ic];
		if(currNode.nodeType == 1)
		{
			if(currNode.tagName.toUpperCase() == 'UL')
			{
				var found = currNode.innerHTML.indexOf('configelement');
				if(found == -1)
				{
					var listElement = document.createElement('li');
					listElement.setAttribute('id','configelement');
					var listElA = document.createElement('a');
					//listElement.innerHTML = 'Configure Extension';
					listElA.innerHTML = 'Configure Extension';
					//listElement.setAttribute('onclick','var o = document.getElementById("optionsdiv");o.style.visibility = "visible";');	
					listElA.setAttribute('onclick','var o = document.getElementById("optionsdiv");o.style.visibility = "visible";');	
					listElement.appendChild(listElA);
					currNode.appendChild(listElement);
				}
			}
		}
	}
}


console.log("finito");

}

function listener()
{
	//console.debug('listener fired');
	runWatchHighlight();
}
document.addEventListener("DOMSubtreeModified",function(){if(timeout){clearTimeout(timeout);}timeout=setTimeout(listener,200);},false);

//console.log('waiting');

//setTimeout(runWatchHighlight,500);

// update alt tags to be title tags
//document.body.innerHTML = document.body.innerHTML.replace(/alt=/gi, 'title=');