// ==UserScript==
// @name           FB Wall Manager
// @namespace      MerricksdadWallManager
// @description    Manages Wall Posts for Various FB Games
// @include        http*://www.facebook.com/lists/*
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_getResourceURL
// @version        4.0.0.4
// @copyright      Charlie Ewing except where noted
// @require https://greasyfork.org/scripts/416-wm-common-library/code/WM%20Common%20Library.user.js
// @require https://greasyfork.org/scripts/417-wm-debug-console/code/WM%20Debug%20Console.user.js
// @require https://greasyfork.org/scripts/418-js-forms-library-b/code/JS%20Forms%20Library%20B.user.js
// @require https://greasyfork.org/scripts/419-wm-config-interface/code/WM%20Config%20Interface.user.js
// @require https://greasyfork.org/scripts/6908-wm-host-object/code/WM%20Host%20Object.js
// @require https://greasyfork.org/scripts/6907-wm-user-console-object/code/WM%20User%20Console%20Object.js
// @require https://greasyfork.org/scripts/6906-wm-sidekick-docking-object/code/WM%20Sidekick%20Docking%20Object.js
// @require https://greasyfork.org/scripts/6905-wm-collector-object/code/WM%20Collector%20Object.js
// @require https://greasyfork.org/scripts/6904-wm-dynamic-grabber-object/code/WM%20Dynamic%20Grabber%20Object.js
// @require https://greasyfork.org/scripts/6899-wm-test-object/code/WM%20Test%20Object.js
// @require https://greasyfork.org/scripts/6898-wm-feed-manager-objects/code/WM%20Feed%20Manager%20Objects.js
// @require https://greasyfork.org/scripts/6897-wm-friend-tracker-objects/code/WM%20Friend%20Tracker%20Objects.js
// @require https://greasyfork.org/scripts/6896-wm-rules-manager-objects/code/WM%20Rules%20Manager%20Objects.js
// @require https://greasyfork.org/scripts/6895-wm-app-object/code/WM%20App%20Object.js
// @require https://greasyfork.org/scripts/6894-wm-post-object/code/WM%20Post%20Object.js
// @resource       IconSheet http://i.imgur.com/sLxzUA6.png
// @downloadURL https://update.greasyfork.org/scripts/6909/FB%20Wall%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/6909/FB%20Wall%20Manager.meta.js
// ==/UserScript==

// Based on script built by Joe Simmons in Farmville Wall Manager


(function() {
//***************************************************************************************************************************************
//***** Preload
//***************************************************************************************************************************************
	//dont run in iframes
	try {
		//this does not mean we are using GM's unsafe window
		var unsafeWindow = unsafeWindow || window.wrappedJSObject || window;
		if (unsafeWindow.frameElement != null) {
			alert("unsafe window");
			return;
		}
	} catch(e) {log("preload: "+e);}

//***************************************************************************************************************************************
//***** Debug Object
//***************************************************************************************************************************************
	if (debug) { //from script WM_Debug_Console.user.js
		debug.init();
		if (debug.initialized) log("Debug Console Initialized");
	}

//***************************************************************************************************************************************
//***** Globals
//***************************************************************************************************************************************

	//returns the current date-time in unix format, not localized
	WM.__defineGetter__("currentTime",function(){try{
		return timeStamp();
	}catch(e){log("WM.currentTime: "+e);}});
	
	//returns the appID of the selected app tab on the collection panel, or 'all' if 'Show All' is selected
	WM.__defineGetter__("currentAppTab",function(){try{
		var tabCtrl=WM.console.collectTabControl;
		if (tabCtrl||null) {
			var tab = tabCtrl._selectedTab;
			if (tab||null) return tab.appFilter;
		}
		return "all";
	}catch(e){log("WM.currentAppTab: "+e);}});

	var sandbox=this;
	

//***************************************************************************************************************************************
//***** new graph functions
//***************************************************************************************************************************************
	
this.Graph={
	posts:{}, //"post_id":1 or null
	userID:null,
	userName:null,
	userAlias:null,
	
	fetchTimeout: 30,
	
	likePost: function(postObj,params){
		//detect state of like link
		var subNode = postObj.likeLink;
		if (subNode) {
			var isLiked = subNode.getAttribute('data-ft').parseJSON()['tn'] == "?";
			if (!isLiked) {
				click(subNode);
			} else {
				//already liked
			}
			if (params.callback) params.callback(postObj);
		}
		postObj.pageNode.style.display="block";
	},
	
	unlikePost: function(postObj){
		//detect state of like link
		var subNode = postObj.likeLink;
		if (subNode) {
			var isLiked = subNode.getAttribute('data-ft').parseJSON()['tn'] == "?";
			if (isLiked) {
				click(subNode);
			} else {
				//already not liked
			}
			if (params.callback) params.callback(postObj);
		}
		postObj.pageNode.style.display="block";
	},
	
	commentPost: function(postObj,comment){
		debug.print("commenting is disabled in WM version 4 until further notice");
		/*
		var subNode = postObj.commentLink;
		if (subNode) {
			click(subNode);
			setTimeout(function(){typeText(comment);},1000);
			
		}
		*/
	},
	
	getCurrentUser: function(params){
		var node = selectSingleNode("//img[starts-with(@id,'profile_pic_header_')]");		
		this.userID = node.id.split("profile_pic_header_")[1];
		this.userName = node.parentNode.childNodes[1].textContent; //will only get first name
		this.userAlias = node.parentNode.href.split("facebook.com/")[1];
	},
	
	validatePost: function(params){
		var post=params.post;
		var callback=params.callback;
		var isOlder=params.next;

		//log("Graph.validatePost()",{level:1});

		//exclude non-app posts and posts with no action links
		//if (!exists(post.actions||null) || !exists(post.application)) return;

		//exclude posts with less than like and comment and which have no link
		//if (!(post.actions.length>=2) || !exists(post.link)) return;
		
		var postID=post["post_id"]||post["id"];

		//exclude posts already in our repository
		if (exists(Graph.posts[postID])) return;

		//store a reference to this post
		Graph.posts[postID]=1;

		//send the post back to the callback function here
		if (callback) setTimeout(function(){callback(post,isOlder);},0);		
	},
	
	fetchPosts: function(params){	
		//check for paused fetching
		if (WM.fetchPaused && !params.bypassPause) return;
		
		params = params||{};
		params.callback = params.callback||WM.validatePost; //default callback if not specified
		
		//reads post data from the page
		var postNodes = selectNodes("//div[starts-with(@class,'_4-u2 mbm _5jmm _5pat _5v3q') and not(contains(@class,'foundWM'))]");
											       
		//translate post dom to useable data
		var retPosts = {};
		if (postNodes.snapshotLength) {
			//debug.print (postNodes.snapshotLength + " post nodes found");
			
			for (var i=0,node;(node=postNodes.snapshotItem(i));i++) {
				
				var post = {};
				post.pageNode = node.childNodes[0].parentNode;
				
				//post id
				try{
					var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//form//input[contains(@value,'target_fbid')]",{node:node});
					post.post_id = subNode.getAttribute('value').parseJSON()['target_fbid'];
				} catch (e){
					//debug.print("cound not locate postID " + node.id);
					continue;
				}

				/*//post QID
				try{
					post.qid = post.pageNode.getAttribute('data-ft').parseJSON()['qid'];
				} catch (e){
					debug.print("cound not locate post qid " + node.id);
					//continue;
				}*/

				//from
				try{
					var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//span[contains(@class,'fwb fcg')]/a[contains(@data-hovercard,'user.php')]",{node:node});
					post.source_id = subNode.getAttribute('data-hovercard').split('user.php?id=')[1].split("&")[0];
					post.fromName = subNode.textContent;
				} catch (e){
					//debug.print("cound not locate fromID " + node.id);
					continue;
				}

					//exclude posts already in our repository
				if (Graph.posts[post.source_id+"_"+post.post_id]!=1) {

					//appID
					try{
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]",{node:node});
						post.app_id = subNode.getAttribute('data-gt').parseJSON()['appid'].toString(); 
						if (!(WM.apps[post.app_id]||null)) continue;
					} catch (e){
						//debug.print("cound not locate appID: " + node.id);
						continue;
					}

					//created time
					try{
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//abbr[contains(@class,'timestamp')]",{node:node});
						post.created_time = subNode.getAttribute('data-utime');
					} catch (e){
						//debug.print("cound not locate created time " + node.id);
						continue;
					}
									
					//message
					try{
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//div[contains(@class,'_5pbx userContent')]",{node:node});
						post.message = subNode.textContent;
					} catch (e){
						//debug.print("cound not locate message " + node.id);
						//continue; //don't break if this does not exist
						post.message="";
					}

					//title
					try{
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//div[contains(@class,'_6m6')]/a",{node:node});
						post.title = subNode.textContent;
					} catch (e){
						//debug.print("cound not locate title " + node.id);
						continue;
					}
									
					//description
					try{
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//div[contains(@class,'_6lz _6mb')]",{node:node});
						post.description = subNode.textContent;
					} catch (e){
						//debug.print("cound not locate description " + node.id);
						continue;
					}
					
					//caption
					try{
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//div[contains(@class,'_6m7')]",{node:node});
						post.caption = subNode.textContent;
					} catch (e){
						//debug.print("cound not locate caption " + node.id);
						continue;
					}
					
					//picture
					try{
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//div[contains(@class,'fbStoryAttachmentImage')]/img",{node:node});
						post.picture = subNode.src;
					} catch (e){
						//debug.print("cound not locate picture " + node.id);
						continue;
					}

					//link href
					try{
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//form//div[contains(@class,'_5pcp _5vsi')]/div/a",{node:node});
						//put our mouse over it first to force it to update link data
						mouseover(subNode);
						post.linkHref = subNode.href;
						post.linkText = subNode.textContent;
					} catch (e){
						//debug.print("cound not locate link " + node.id);
						continue;
					}

					//like button
					try{
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//div[contains(@class,'_5pcp _5vsi')]/div/span/a[contains(@data-reactid,'.')]",{node:node});
						post.isLiked = subNode.getAttribute('data-ft').parseJSON()['tn'] == "?";
						post.likeLink = subNode;
					} catch (e){
						//debug.print("cound not locate likes " + node.id);
						continue;
					}
					
					//comment section
					try{
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//label[contains(@class,'uiLinkButton comment_link')]/input",{node:node});
						post.commentLink = subNode;
						
						var subNode = selectSingleNode("./div[starts-with(@class,'userContentWrapper')]//div[contains(@class,'_209g _2vxa')]/span/br",{node:node});
						post.commentNode = subNode;
					} catch (e){
						//debug.print("cound not locate comments " + node.id);
						continue;
					}

					
					
					node.className += " foundWM";
					if (post.isLiked) {
						post.pageNode.style.display="block";
					}
					
					//debug.print([post.app_id, post.source_id, post.post_id, post.fromName, post.created_time, post.title, post.caption, post.description, post.picture, post.linkHref, post.linkText, post.isLiked]);


					//store a reference to this post
					Graph.posts[post.source_id+"_"+post.post_id]=1;

					//send the post back to the callback function here
					params.callback(post);
				}				
				
			}
		} else {
			//debug.print ("no post nodes found");
		};
	}
	
};

Graph.getCurrentUser();

	


//***************************************************************************************************************************************
//***** Immediate
//***************************************************************************************************************************************

	log("Script: WM initialized",{level:0});

	// section for reclaiming memory and stopping memory leaks
	this.newIntv=null; //refresh interval
	this.oldIntv=null; //refresh interval
	this.procIntv=null; //process interval
	this.cleanIntv=null; //post removal interval
	this.hbIntv=null; //global heartbeat interval
	this.refreshIntv=null; //global page refresh interval

	this.olderLimit=day; //default 1 day

	//mutation observer
	var observer = new MutationObserver(function(mutations) {
		//mutations.forEach(function(mutation) {
		//console.log(mutation.type);
		
		//only process new nodes if console is ready for them
		if (!WM.console.initialized) return;
		
		//when any page mutation occurs, run our post detector
		Graph.fetchPosts({
			callback:WM.validatePost
		});
	});    
	
	//cleanup function
	var cleanup=function() {try{
		//destroy intervals
		if (newIntv) window.clearInterval(newIntv);
		if (oldIntv) window.clearInterval(oldIntv);
		if (procIntv) window.clearInterval(procIntv);
		if (cleanIntv) window.clearInterval(cleanIntv);
		if (hbIntv) window.clearInterval(hbIntv);
		if (refreshIntv) window.clearInterval(refreshIntv);
		refreshIntv = oldIntv = newIntv = procIntv = cleanIntv = hbIntv = null;

		//close the sidekick tabs
		WM.collector.closeAll();

		//remove this event listener
		window.removeEventListener("beforeunload", cleanup, false);
		window.removeEventListener("message", WM.receiveSidekickMessage, false);
		window.removeEventListener("resize", WM.onWindowResize, false);
		
		observer.disconnect();

		//clean up memory
		WallManager=null;
		Graph=null;
		jsForms=null;
		olderLimit=null;
		opts=null; quickOpts=null;
		
	}catch(e){log("cleanup: "+e);}}

	window.addEventListener("beforeunload", cleanup, false);
	window.addEventListener("resize", WM.onWindowResize, false);

	observer.observe(document.body,{ attributes: true, childList: true, characterData: true });
	
	addGlobalStyle(".foundWM {background-color:green; display:none;}\n","styleDebugTemp");
	
	//start it up
	WM.run();
	
})(); // anonymous function wrapper end

/* recent changes
	4.0.0.0:
		moved many object's code to their own files
	4.0.0.3:
		fixed autolike
		fixed undefined post type debugging
	4.0.0.4:
		fixed fetching pause
		fixed fetching manually
		added autorefresh page timer to options menu
		updated rules manager refreshBrowser function to check for options menu open, or posts being collected
		removed fetching older posts functions
		changed rules manager fetch newer posts to fetch visible posts, for use when auto fetch is paused
		
		
	
*/