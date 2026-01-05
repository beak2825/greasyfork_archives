// ==UserScript==
// @name          	WM Host Object
// @namespace       MerricksdadWMHostObject
// @description	This is the host object which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.4
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

	//*****short text versions for WM.config menu options*****

	var checkBox=function(l,d,c,n){return ({type:"checkbox",label:l,"default":d||false,kids:c,newitem:n});}
	var hidden=function(l,d,c){return ({type:"hidden",label:l,"default":d,kids:c});}
	var optionBlock=function(l,c,hideSelectAll,n){hideSelectAll=hideSelectAll||false;return ({type:"optionblock",label:l,kids:c,hideSelectAll:hideSelectAll,newitem:n});}
	var separator=function(l,s,c,hideSelectAll){hideSelectAll=hideSelectAll||false; return ({type:"separator",label:l,section:s,kids:c}); }
	var section=function(l,c){return ({type:"section",label:l,kids:c});}
	var tabSection=function(l,c){return ({type:"tab",label:l,kids:c});}
	var inputBox=function(l,d,n){return ({type:"float",label:l,"default":(d||0),newitem:n});}
	var textArea=function(l,d,n){return ({type:"textarea",label:l,"default":(d||0),newitem:n});}
	var colorBox=function(l,d,n){return ({type:"colorbox",label:l,"default":(d||"black"),newitem:n});}
	var button=function(l,s){return ({type:"button",label:l,script:s});}
	var anchor=function(l,u,t){return ({type:"link",label:l,href:u,title:(t||'')});}

	this.WallManager={	
		paused : false,
		fetchPaused : false,
		requestsOpen : 0,
		reqTO : 30000, //request timeout default
		newSidekicks : [],

		accDefaultText : "Got this!",
		failText : "Oh no! Sorry pardner!",
		overLimitText : "Limit reached!",

		version:"4.0.0.4",
		currentUser:{
			id:"",
			profile:"",
			alias:""
		},
		resources:{
			iconsURL:GM_getResourceURL("IconSheet")
		},
		apps:{},
		posts:{},
		history:{},
		config:null,
		opts:{},
		quickOpts:{},
		displayGroups:{},
		likeQueue:[],
		switches:{
			manualAuthToken:true
		},

		statusText : {
			"20":"Sidekick returned force accept",
			"3":"Marked as accepted by user",
			"2":"Responseless Collection",
			"1":"Accepted",
			"0":"Unknown",
			"-1":"Failed",
			"-2":"None Left",
			"-3":"Over Limit (App)",
			"-4":"Over Limit, Sent One Anyway",
			"-5":"Server Error",
			"-6":"Already Got",
			"-7":"Server Down For Repairs",
			"-8":"Problem Getting Passback Link",
			"-9":"Final Request Returned Null Page",
			"-10":"Final Request Failure",
			"-11":"Expired",
			"-12":"Not a Neighbor",
			"-13":"Requirements not met",
			"-14":"Timeout",
			"-15":"Unrecognized Response",
			"-16":"Passback Link is missing",
			"-17":"Window Missing",
			"-18":"Marked as failed by user",
			"-20":"Sidekick returned force fail",
			
			"-19":"Over Limit (Bonus Type)",
			"-21":"Cancelled mid-process by user",
			
		},
		
		sortGroups : function(params){
			params=params||{};
			params.direction=(WM.quickOpts.groupDirection=(params.direction||WM.quickOpts.groupDirection||"desc")); //default descending to keep time ordered posts in order newest to oldest
			WM.saveQuickOpts();			
			
			//reorder the groups
			var groupsArray=[];
			for (var g in WM.displayGroups) {
				groupsArray.push({id:g,node:WM.displayGroups[g].parentNode,box:WM.displayGroups[g]});
			}
			
			if (["asc","ascending"].inArray(params.direction.toLowerCase())) groupsArray.sort(function(a,b){return a.id>b.id;});
			else if (["desc","descending"].inArray(params.direction.toLowerCase())) groupsArray.sort(function(a,b){return a.id<b.id;});
			
			WM.displayGroups={};
			for (var g=0; g<groupsArray.length; g++) {
				WM.displayGroups[groupsArray[g].id]=groupsArray[g].box;
				WM.console.feedNode.appendChild(groupsArray[g].node);
			}
		},

		newGroup : function(params){
			params=params||{};

			//prevent duplicates
			if (WM.displayGroups[params.by]||null) return WM.displayGroups[params.by];
			
			//create the nodes
			var box;
			var group=createElement("div",{className:"listItem"},[
				createElement("div",{className:"line", onclick:function(){
					//toggle rollout
					with (this.nextSibling) className=className.swapWordB((className.containsWord("collapsed")),"expanded","collapsed");
					with (this.firstChild.firstChild) className=className.swapWordB((className.containsWord("treeCollapse"+WM.opts.littleButtonSize)),"treeExpand"+WM.opts.littleButtonSize,"treeCollapse"+WM.opts.littleButtonSize);
				}},[
					createElement("div",{className:"littleButton",title:"Toggle Content"},[
						createElement("img",{className:"resourceIcon treeCollapse"+WM.opts.littleButtonSize}),
					]),
					createElement("label",{textContent:params.label||params.by})
				]),
				box=createElement("div",{className:"subsection rollout expanded"}),
			]);
						
			//add it to our group list
			WM.displayGroups[params.by]=box;
			
			WM.sortGroups();
			
			return box;
		},
		
		pauseCollecting : function(doPause){
			var isPaused;
			if (exists(doPause)) isPaused = (WM.paused = doPause);
			else isPaused=(WM.paused = !WM.paused);
			var btn=WM.console.pauseCollectButton;
			btn.className = btn.className.swapWordB(isPaused,"oddGreen","oddOrange");
			btn.title = (isPaused)?"Start Automatic Collection":"Pause Automatic Collection";
			var img = btn.childNodes[0];
			img.className = img.className.swapWordB(isPaused,"playRight24","stop24");
		},

		pauseFetching : function(doPause){
			var isPaused;
			if (exists(doPause)) isPaused = (WM.fetchPaused = doPause);
			else isPaused=(WM.fetchPaused = !WM.fetchPaused);
			var btn=WM.console.pauseFetchButton;
			btn.className = btn.className.swapWordB(isPaused,"oddGreen","oddOrange");
			btn.title = (isPaused)?"Start Automatic Fetching":"Pause Automatic Fetching";
		},

		clearGroups : function(params){
			//destroy previous groups
			for (var g in WM.displayGroups){
				remove(WM.displayGroups[g].parentNode); //kill the node
				delete WM.displayGroups[g]; //remove from list
			}
		},

		clearPosts : function(){
			//remove all post nodes from the collector panel
			for (var p in WM.posts){
				if (WM.posts[p].node) remove(WM.posts[p].node);
			}
		},
		
		constructGroups : function(params){
			params=params||{};
			//this specifically allows a null so we can remove grouping
			var by=exists(params.by)?params.by:WM.quickOpts.groupBy;
			//if nothing changed, just cancel
			if (by==WM.quickOpts.groupBy) return;
			
			//set the new group order
			WM.quickOpts.groupBy=by;
			WM.saveQuickOpts();
			
			WM.clearGroups();
		},
		
		sortPosts : function(params){
			params=params||{};
			params.direction=(WM.quickOpts.sortDirection=(params.direction||WM.quickOpts.sortDirection||"desc")); //default descending to keep time ordered posts in order newest to oldest
			params.by=(WM.quickOpts.sortBy=(exists(params.by)?params.by:(WM.quickOpts.sortBy||"created_time"))); //default by date
			WM.saveQuickOpts();

			//convert to array
			var postsArray=methodsToArray(WM.posts);

			//sort
			postsArray.sort(function(a,b){
				if (["ascending","asc"].inArray(params.direction.toLowerCase())) return a[params.by]>b[params.by];
				if (["descending","desc"].inArray(params.direction.toLowerCase())) return a[params.by]<b[params.by];
			});

			//convert back to object
			WM.posts=arrayToMethods(postsArray);
		},

		doWhichTestTree : function(post, testList, testData, custom) {try{
			//match post to an app
			var app=post.app;
			var synApp=app.synApp, w=null;

			for (var i=0,test;((test=testList[i]) && (w===null));i++) {

				//run only for tests that are not specifically disabled
				if (test.enabled===false) continue;
				
				//set find mode
				var findMode="auto";
			
				//finish constructing dynamic collection tests
				var ret = test.ret;
				if (custom) {
					if (!ret) ret = "dynamic"; //default to dynamic
					if (ret!="dynamic" && ret!="none" && ret!="exclude" && !ret.startsWith(synApp.appID)) ret=synApp.appID+ret; //add appID except to magic words
					findMode=test.findMode;
				}

			    //part to make dynamic collection tests work only if they are the correct appID
			    //also do not process disabled tests			    
				if (!custom || (custom && (!test.appID || (app.appID==test.appID)))){

					//if the test is not disabled (by test enabled both existing and being false)
					//OR if the test IS a dynamic test and the appID matches
					//OR if the test IS a dynamic test and no appID was supplied
					//then run the test

					//detect test type
					var testType=(test.search||null);
					var types=WM.grabber.methods;
					if (!testType) for (var tt=0,len=types.length; tt<len; tt++) {if (test[types[tt]]||"") {testType=types[tt];break;}}

					//select the type of data to use
					var src="";
					if (isArray(testType)){ //new search array format
						for (var t=0,tlen=testType.length;t<tlen;t++) src+=(testData[testType[t]]||"");
					}
					else src = (testData[testType]||""); //old test method like testType:text

					if (src){
						//begin processing this test
						var subTests=test.subTests, kids=test.kids, allowNone=false, subNumRange=test.subNumRange,text=(test.find||test[testType]||"");

						//process subtests array
						if (subTests && (findMode=="auto" || findMode=="subtests") && text) {
							for (var i2=0,subTest,found=false;((subTest=subTests[i2]) && (!found));i2++) {
								var testX = text.replace('{%1}',subTest).toLowerCase();

								//do a standard test with the replaced search string
								found=src.find(testX);

								//return a found value, replacing %1 with a lowercase no-space text equal to the subtest string
								w=(found)?ret.replace('{%1}',subTest.noSpaces().toLowerCase()):w;

								testX=null;
							}

						//process number array
						} else if (subNumRange && (findMode=="auto" || findMode=="subnumrange") && text){
							var start=parseInt(subNumRange.split(",")[0]), end=parseInt(subNumRange.split(",")[1]);
							for (var i2=start,found=false;((!found) && i2<=end);i2++)  {
								var testX = text.replace('{%1}',i2).toLowerCase();

								//do a standard test with the replaced search string
								found=src.find(testX);

								//return a found value, replacing %1 with a lowercase no-space text equal to the subtest string
								w=(found)?ret.replace('{%1}',i2):w;

								testX=null;
							}

						//process text array, process similar to subtests
						} else if (text && (findMode=="auto" || findMode=="basic") && (isArray(text))) {
							for (var i2=0,subTest,found=false;((subTest=text[i2]) && (!found));i2++) {
								var testX = subTest.toLowerCase();

								//do a standard test with the replaced search string
								found=src.find(testX);

								//return the same value no matter which element from the array is found
								w=(found)?ret:w;

								testX=null;
							}


						//process regex
						} else if (text && (test.regex||test.isRegex||null) ) {
							var mods = (test.mods||"gi");
							var testRegex = new RegExp(text,mods);
							var match=src.match(testRegex);
							if (match) match=match[0]; //always take the first match
							w=ret||match||w;



						//process single text
						} else if (text) {
							try{
								w=(src.find(text.toLowerCase() ))?ret:w;
							} catch(e){
								log("WM.doWhichTestTree:"+e);
								log("--app:"+app.appID);
								log("--test:"+JSON.stringify(test));
							}
						}

					}

					//see if test has type 2 subtests (child node tests based on parent test)
					w = ((kids && w)?WM.doWhichTestTree(post, kids, testData, custom):w) || w; //if kids return null, default to key found above

					//if this test tree returned "none", start over with next tree by replacing "none" with null
					//true "none" is handled in the which() function below
					if (w==="none") w=null;


				}//end custom checker
			}

			return w;
		}catch(e){log("WM.doWhichTestTree: "+e);}},

		which : function(post,params) {try{
			//prevent the rules manager from mistaking main as a post object
			if (!post) return;
			
			params=params||{};
			//match post to an app
			var w, app=post.app, synApp=app.synApp;

			//create various data for the tests to use
			if (!params.reid) post.testData = {
				title: (post.name||"undefined").toLowerCase(),
				msg: (post.message||"undefined").toLowerCase(),
				caption: (post.caption||"undefined").toLowerCase(),
				desc: (post.description||"undefined").toLowerCase(),
				link: (post.linkText||"undefined").toLowerCase(),
				url: Url.decode(post.linkHref).toLowerCase(),
				img: (post.picture||"undefined").toLowerCase(),
				fromName: post.fromName.toLowerCase(),
				fromID: post.fromID.toLowerCase(),
				targetName: "undefined", //","+post.getTargets("name").join(",").toLowerCase(),
				//targetID: "undefined", //","+post.getTargets("id").join(",").toLowerCase(),
				canvas: "undefined", //app.namespace.toLowerCase(),
				likeName: "undefined", //","+post.getLikes("name").join(",").toLowerCase(),
				likeID: "undefined", //","+post.getLikes("id").join(",").toLowerCase(),
				comments: "undefined", //post.getComments("message").join(" \n").toLowerCase(),
				commentorName: "undefined", //","+post.getComments("name").join(",").toLowerCase(),
				commentorID: "undefined", //","+post.getComments("id").join(",").toLowerCase(),
			};
			var testData=post.testData;

			//replacement for old options like body, either and html
			testData.body = testData.title+testData.caption+testData.desc;
			testData.either = testData.link+testData.body;
			testData.html = testData.fromID + testData.fromName + testData.targetID + testData.targetName + testData.message
				+ testData.href + testData.either + testData.img + testData.canvas + testData.likeID + testData.likeName
				+ testData.commentorID + testData.commentorName + testData.comments;

			var dynamicTests = WM.grabber.tests;

			//check user built dynamic tests first if enabled and told to run first
			if (WM.opts["dynamic"+app.appID] && WM.opts.dynamicFirst && dynamicTests) {
				w=WM.doWhichTestTree(post,dynamicTests, testData, true)||"none";
			}

			//process this game's tests if dynamic didn't already get one
			if (w=="none" || !w || w=="") {
				w=((tests=synApp.tests)?WM.doWhichTestTree(post,tests, testData):"none")||"none";
			}

			//check user built dynamic tests last if enabled and not told to run first
			if (w=="none" || !w || w=="") {
				if (WM.opts["dynamic"+app.appID] && !WM.opts.dynamicFirst && dynamicTests) {
					w=WM.doWhichTestTree(post,dynamicTests,testData, true)||"none";
				}
			}

			//switch to undefined collection if enabled
			w=(w==="none" && app.opts["doUnknown"])?"doUnknown":w;

			return w;
		}catch(e){log("WM.which: "+e);}},

		resetAccepted : function(params) {
			params=params||{};
			var ask=WM.opts.historyConfirmClear;
			if (params.noConfirm || !ask || (ask && confirm("Delete all history for this profile?"))){
				doAction(function(){
					WM.history={};
					setOpt('history_'+WM.currentUser.profile,'{}');
				});
			}
		},
		
		getIsConfigOpen : function(){
			if (document.evaluate("//iframe[@id='Config']",document,null,9,null).singleNodeValue) return true;
			return false;
		},

		onWindowResize : function(){
			WM.resizeConsole();
		},
		
		onHeartbeat : function(){
			if (WM.rulesManager.enabled) {

				//affect rules at the base level
				WM.rulesManager.doEvent("onHeartbeat",{});
				
				//affect rules at the app level
				if (WM.opts.heartbeatAffectsApps) {
					for (var a in WM.apps) {
						(function(){
							WM.rulesManager.doEvent("onHeartbeat",WM.apps[a]);
						})();
					}
				}

				//affect rules at the post level
				if (WM.opts.heartbeatAffectsPosts) {
					for (var p in WM.posts) if (!WM.posts[p].isGhost) {
						(function(){
							WM.rulesManager.doEvent("onHeartbeat",WM.posts[p]);
						})();
					}
				}

				//affect rules at the rule level
				if (WM.opts.heartbeatAffectsRules) {
					for (var r=0; r<WM.rulesManager.rules.length; r++) {
						(function(){
							WM.rulesManager.doEvent("onHeartbeat",WM.rulesManager.rules[r]);
						})();
					}
				}

				//affect rules at the feed and feed filter levels
				if (WM.opts.heartbeatAffectsFeeds || WM.opts.heartbeatAffectsFeedFilters) {
					var feeds=WM.feedManager.feeds;
					for (var f=0,len=feeds.length; f<len; f++) {
						//do the feed
						if (WM.opts.heartbeatAffectsFeeds) (function(){
							WM.rulesManager.doEvent("onHeartbeat",feeds[f]);
						})();
						
						//do the feed filters
						if (WM.opts.heartbeatAffectsFeedFilters) {
							for (var ff in feeds[f].filters){
								(function(){
									WM.rulesManager.doEvent("onHeartbeat",feeds[f].filters[ff]);
								})();
							}
						}
					}
				}
			}
			
			//check for new sidekick arrivals
			if (isArrayAndNotEmpty(WM.newSidekicks)) {
				while (WM.newSidekicks.length>0) {
					var app=WM.newSidekicks.shift();
					app.fetchPosts();
				}
			}
			
			//check for autolike queue contents
			var quePost = WM.checkAutoLikeQue();
			if (quePost) {
				//log([quePost.fn,quePost.post.id]);
				switch (quePost.fn) {
					case "like":quePost.post.like();break;
					case "comment":quePost.post.comment(quePost.say);break;
				}
			}
			
		},

		//this is for when the WM.config and globalConfig settings change
		onSave : function() {
			//recopy the settings array from WM.config
			WM.updateSettingsValues();

			//hide or show counters
			if (WM.opts.showcounters) WM.showCounters(); else WM.hideCounters();

			//update intervals
			WM.setIntervals();

			//set new user colors
			WM.setColors();
			
			//update config settings
			WM.changeConfigSettings();

			//update those settings we use as global variables
			WM.changeDebugSettings();
			
			//set console heights
			//WM.resizeConsole();
		},

		updateSettingsValues : function(){try{
			WM.opts = WM.config.values;
			
			//new: do this for each of the apps too
			for (var a in WM.apps) WM.apps[a].opts=WM.apps[a].config.values;
			
		}catch(e){"WM.updateSettingsValues: "+e}},

		getAccText: function(appID,w,past,status){
			var app=WM.apps[appID].synApp;
			//detect and use a status code message
			if (!(status>-1 || status==-4 || status==-6)) return WM.statusText[status];
			//or return a generic message based on post type
			else return (w=="dynamic")?"Dynamic Grab"+((past)?"bed":""):(((w.find("send")?"Sen"+((past)?"t":"d")+" ":w.find("wishlist")?"":"G"+((past?"o":"e"))+"t ") + (app.userDefinedTypes[w]||app.accText[w])) || ((past)?WM.accDefaultText:"Get Unknown") || ((w.startsWith(app.appID+"doUnknown"))?"Unknown":"") );
		},
		
		refreshBrowser : function(){
			/*
				make sure no collection process is running
				make sure the options menu is not open
			*/
			
			if (WM.requestsOpen>0 || $("Config")) {
				setTimeout(WM.refreshBrowser,5000);
			} else {
				window.location.reload();
			}
		},

		stopCollectionOf : function(w){
			for (var p in WM.posts) if (!WM.posts[p].isGhost && WM.posts[p].which==w) WM.posts[p].stopCollect();
		},

		startCollectionOf : function(w){
			for (var p in WM.posts) if (!WM.posts[p].isGhost && WM.posts[p].which==w) WM.posts[p].collect();
		},

		pauseByType : function(app,w){
			if (!isArray(w)) w=[w];
			//mark as paused all those posts not yet done
			for (var p in WM.posts) if (!WM.posts[p].isGhost && w.inArray(WM.posts[p].which)) WM.posts[p].pause();
			//store the paused type but dont save it
			var a=(app.parent||app);
			for (var i=0; i<w.length; i++) {
				var t=w[i];
				//add it to the array without making a duplicate
				if (!a.typesPaused.inArray(t)) {
					a.typesPaused.push(t);
					//add a visible node
					a.typesPausedNode.appendChild(
						a.pausedTypesListNodes[t]=createElement("div",{className:"line"},[
							createElement("span",{textContent:(a.userDefinedTypes[t]||a.accText[t])+" ("+t+") "}),
							createElement("div",{className:"littleButton oddGreen", title:"Unpause Type"},[
								createElement("img",{className:"resourceIcon playRight"+WM.opts.littleButtonSize,onclick:function(){
									WM.unPauseByType(a,t);
								}})
							])
						])
					);
				}
			}
		},

		unPauseByType : function(app,w){
			if (!isArray(w)) w=[w];
			//unpause all those posts not yet done
			for (var p in WM.posts) if (!WM.posts[p].isGhost && w.inArray(WM.posts[p].which)) WM.posts[p].unPause();
			//remove paused type from list but dont save it
			var a=(app.parent||app);
			for (var i=0; i<w.length; i++) {
				//remove the visible node
				remove (a.pausedTypesListNodes[w[i]]);
				//delete the visible node entry
				delete a.pausedTypesListNodes[w[i]];
				//remove it from the array
				a.typesPaused.removeByValue(w[i]);
			}
		},

		setAsAccepted : function(comment,status, post) {try{
			var app=post.app;
			var synApp=app.synApp;
			post.state="accepted";
			post.status=status;
			post.accept();

			WM.history[post.id]={status:status, date:timeStamp(), which:(post.which||"undefined").removePrefix(synApp.appID), appID:app.appID};
			setOptJSON('history_'+WM.currentUser.profile,WM.history);

			//do friend tracking
			if (WM.opts.useFriendTracker && WM.opts.trackAccepted){
				WM.friendTracker.trackStatus(post,true);
			}

			var postNode=post.node||$("post_"+post.id);
			if (postNode){
				var link=selectSingleNode(".//a[contains(@class,'linkText')]",{node:postNode});

				var text=WM.getAccText(synApp.appID,post.which,true,status);

				link.textContent = (comment || text || WM.statusText[status] || WM.accDefaultText);
				WM.updatePostStatus(post.id);
			}

			app.acceptCount++; 

			//perform the onAccepted event
			WM.rulesManager.doEvent("onAccepted",post);

			//try autolike
			try{
				if (WM.opts.useautolike && (WM.opts.autolikeall || WM.opts.autolikeaccepted || (WM.opts.autolikesent && (post.which||"undefined").startsWith("send")) )) {
					if (!WM.opts["nolike"+app.appID]){
						WM.queAutoLike(post);
						//post.like();
					}
				}
			} catch(e){log("setAsAccepted: autolike failed: "+e,{level:3});}
			//try autocomment
			
			try{
				if (WM.opts.useautocomment && (WM.opts.autolikeall || WM.opts.autolikeaccepted || (WM.opts.autolikesent && (post.which||"undefined").startsWith(synApp.appID+"send")) )) {
					if (!WM.opts["nolike"+app.appID]){
						//setTimeout(function(){post.comment();},100+(WM.opts.autolikedelay*1000));
						WM.queAutoComment(post,null);
					}
				}
			} catch(e){log("setAsAccepted: autocomment failed: "+e,{level:3});}
			
		}catch(e){log("WM.setAsAccepted: "+e);}},

		disableOpt : function(w,app){try{
			var targetConfig=(app||null)?app.config:WM.config;
			((app||null)?app.opts:WM.opts)[w]=false;
			targetConfig.set(w,false);
			targetConfig.save();
			debug.print([w,app,false]);
		}catch(e){log("WM.disableOpt: "+e);}},

		enableOpt : function(w,app){try{
			var targetConfig=(app||null)?app.config:WM.config;
			((app||null)?app.opts:WM.opts)[w]=true;
			targetConfig.set(w,true);
			targetConfig.save();
			debug.print([w,app,true]);
		}catch(e){log("WM.enableOpt: "+e);}},

		setOpt : function(w,v,app){try{
			var targetConfig=(app||null)?app.config:WM.config;
			((app||null)?app.opts:WM.opts)[w]=v;
			targetConfig.set(w,v);
			targetConfig.save();
			debug.print([w,app,v]);
		}catch(e){log("WM.setOpt: "+e);}},

		resetCounters : function(){try{
			for (var a in WM.apps) WM.apps[a].resetCounter();
		}catch(e){log("WM.resetCounters: "+e);}},

		setAsFailed : function(comment, status, post){try{
			var app=post.app;
			var synApp=app.synApp;
			var postNode=post.node||$("post_"+post.id);

			//special effects for timeout and cancelProcess
			if ((!WM.opts.failontimeout && status==-14) || status==-21) {
				post.state="timeout";
				post.timeout();
				if (status==-14) WM.rulesManager.doEvent("onTimeout",post);

			} else {
				post.state="failed";
				post.fail(); // don't pass true or it will loop here

				WM.history[post.id]={status:status, date:timeStamp(), which:(post.which||"undefined").removePrefix(synApp.appID), appID:app.appID};
				setOptJSON('history_'+WM.currentUser.profile,WM.history);
				
				WM.rulesManager.doEvent("onFailed",post);
			}
			post.status=status;

			//do friend tracking
			if (WM.opts.useFriendTracker && WM.opts.trackFailed){
				WM.friendTracker.trackStatus(post,false);
			}
			
			if (postNode) {
				var link=selectSingleNode(".//a[contains(@class,'linkText')]",{node:postNode});
				if (link) {
					//I can see no reason the link should be missing, but since its been proven to fail, here is a patch
					link.textContent = (comment || WM.statusText[status] || WM.failText);
				}
				WM.updatePostStatus(post.id);
			}

			app.failCount++; 
			
			//try autolike
			try{
				if (WM.opts.useautolike && WM.opts.autolikeall) {
					if (!WM.opts["nolike"+app.appID]){
						WM.queAutoLike(post);
						//post.like();
						//setTimeout(function(){post.like();},100+(WM.opts.autolikedelay*1000));
					}
				}
			} catch(e){log("setAsFailed: autolike failed: "+e,{level:3});}
			//try autocomment
			
			try{
				if (WM.opts.useautocomment && WM.opts.autolikeall) {
					if (!WM.opts["nolike"+app.appID]){
						//setTimeout(function(){post.comment();},100+(WM.opts.autolikedelay*1000));
						WM.queAutoComment(post,null);
					}
				}
			} catch(e){log("setAsFailed: autocomment failed: "+e,{level:3});}
			
		}catch(e){log("WM.setAsFailed: "+e);}},

		setPriority : function(){
			var postNode=selectSingleNode(".//ancestor::*[starts-with(@id,'post_')]",{node:this});
			var id=postNode.id.replace("post_","");
			WM.posts[id]["priority"]=this.getAttribute("name");
			remove(postNode);
			WM.posts[id].draw();
		},

		clearURL : function(tab){
			WM.collector.close(tab);
			WM.requestsOpen--;
		},
		
		//constantly update sidekick channel data
		skChannel : {},
		
		fetchSidekickData : function(){try{
			if (WM) {
				var node=selectSingleNode("./div",{node:$("wmDataDump")});
				while (node){
					log("WM.fetchSidekickData: found "+JSON.parse(node.getAttribute("data-ft")));
					WM.skChannel=mergeJSON(WM.skChannel,JSON.parse(node.getAttribute("data-ft")));
					remove(node);
					node=selectSingleNode("./div",{node:$("wmDataDump")});
				}
				setTimeout(WM.fetchSidekickData,1000);
			}
		}catch(e){log("WM.fetchSidekickData: "+e);}},		
		
		//this is WM3's method of handling conversations with sidekicks
		onFrameLoad3 : function(tab){try{
			log("onFrameLoad3(): tab="+tab.id);
						
			var postID=tab.postID||tab.id;
			var post=tab.post||WM.posts[postID];

			//detect if post process was cancelled by user
			if (post.processCancelled){
				//reset the cancel memory
				post.processCancelled = false;
				log("onFrameLoad3: process cancelled by user");
				//set the timeout flag even though its not timed out
				WM.setAsFailed(null,-21,post);
				WM.clearURL(tab);
				return;
			}

			//detect if valid WM.collector window still exists
			var windowExists=(tab.hwnd && !tab.hwnd.closed);
			/*try{
				var testUrl=tab.hwnd.location.toString();
			} catch(e) {
				windowExists=false; 
			}*/
			
			//make sure the post object still exists
			if (!(post||null)){
				log("onFrameLoad3: post is null");
				WM.clearURL(tab);
				return;
			}

			//check if window object is missing
			if (!windowExists) {
				log("windowExists = false");
				if (!tab.hwnd) log("onFrameLoad3: tab.hwnd is null");
				if (tab.hwnd.closed) log("onFrameLoad3: tab.hwnd is closed");
				WM.setAsFailed(null,-17,post);
				WM.clearURL(tab);
				return;
			}
			
			//check timer on this open post
			var openTime=tab.openTime;
			var nowTime=timeStamp();
			if ((WM.opts.reqtimeout*1000)<(nowTime-openTime)){
				log("onFrameLoad3: post timed out");
				WM.setAsFailed(null,-14,post);
				WM.clearURL(tab);
				return;
			}
			
			//create the retry function
			var retry=function(){setTimeout(function(){WM.onFrameLoad3(tab); return;},1000); return;};
			
			//look for status data
			var tabID = tab.id;
			var skData = WM.skChannel[tabID]||null;
			if (skData) {
				//data exists for this post
				if (skData.status) {
					//status is available
					delete WM.skChannel[tabID];
					
					//get useful post data
					var app=post.app; var synApp=app.parent||app;
					var postNode=post.node||$("post_"+post.id);
					var link=selectSingleNode(".//a[contains(@class,'linkText')]",{node:postNode});
					var w=post.which||"undefined";
					
					//confirm status
					var gotItem=((skData.status>0) || (skData.status==-6) || (skData.status==-4) || (skData.status==-15 && WM.opts.accepton15));
					var failedItem=(skData.status<0);
					
					if (gotItem){
						//build debug block
						switch(skData.status){
							case -6: case -4: case 1:
								// this bonus is available or we still have the ability to send something for no return
								//dont break before next
							case -15: case 2:
								if (!synApp.flags.requiresTwo){
									WM.setAsAccepted(null, skData.status, post);
								}
								break;

							default:
								//should not have come here for any reason, but if we did assume its a status code I didnt script for
								WM.setAsFailed(null, skData.status, post);
								log("onFrameLoad3: unexpected status code: "+skData.status,{level:2});
								break;
						}
					} else {
						WM.setAsFailed(null,skData.status,post);
					}
					
					// click "yes" to accept it, if we got this far we actually found an accept button
					if(synApp.flags.requiresTwo && gotItem) {
						if (skData.nopopLink) {
							var req; req=GM_xmlhttpRequest({
								method: "GET",
								url: skData.nopopLink,
								timeout: WM.opts.reqtimeout*1000,
								onload: function(response) {
									//search for error messages
									var test=response.responseText;
									if (test==""){
										//no text was found at requested href
										log("onFrameLoad3: final stage: null response",{level:2});
										WM.setAsFailed(null, -9,post);
									} else {
										//if no errors then we got it
										WM.setAsAccepted(null, skData.status,post);
									}
									WM.clearURL(tab);
									if(req)req=null;
								},

								onerror: function(response) {
									log("onFrameLoad3: final stage: error returned",{level:2});
									//if final request fails, drop the request for now
									WM.setAsFailed(null, -10,post);
									WM.clearURL(tab);
									if(req)req=null;
								},

								onabort: function(response) {
									log("onFrameLoad3: final stage: request aborted",{level:2});
									WM.setAsFailed(null, -10,post);
									WM.clearURL(tab);
									if(req)req=null;
								},
								ontimeout: function(response) {
									log("onFrameLoad3: final stage: request timeout",{level:2});
									WM.setAsFailed(null, -10,post);
									WM.clearURL(tab);
									if(req)req=null;
								},
							});

						} else {
							log("onFrameLoad3: skData.nopopLink is null and a string was expected",{level:3});
							WM.setAsFailed(null, -16,post);
							WM.clearURL(tab);
							return;
						}
					} else WM.clearURL(tab); //<- default page clearer, do not remove
				} else retry();
			} else {
				retry();
				//send the tab its init message (again)
				tab.hwnd.postMessage({
					channel:"WallManager",
					msg:1,
					tabID:tab.id,
				},"*");
				//log("useGM_openInTab: "+WM.opts.useGM_openInTab);
			}
			
		}catch(e){log("WM.onFrameLoad3: "+e);}},		
		
		//this is WM1-2's method of handling conversation with sidekicks
		//WM3 defaults to this if sidekick is not WM3 compatible
		onFrameLoad : function(tab,noDebug){try{
			//tab object contains {id,post,url}
			if (!noDebug) log("onFrameLoad()",{level:0});

			var id=tab.id; var post=tab.post||WM.posts[id];
			if (!(post||null)) {
				//resource deleted while post was out
				WM.clearURL(tab);
				return;
			}

			//detect if post process was cancelled by user
			if (post.processCancelled){
				//reset the cancel memory
				post.processCancelled = false;
				log("onFrameLoad3: process cancelled by user");
				//set the timeout flag even though its not timed out
				WM.setAsFailed(null,-21,post);
				WM.clearURL(tab);
				return;
			}

			var app=post.app;
			var synApp=app.parent||app;

			var httpsTrouble=synApp.flags.httpsTrouble;
			var responseLess=synApp.flags.skipResponse;

			var postNode=post.node||$("post_"+post.id);
			var link=selectSingleNode(".//a[contains(@class,'linkText')]",{node:postNode});
			var w=post.which||"undefined";

			tab.tries=(tab.tries||0)+1;
			if (tab.tries>WM.opts.reqtimeout) {
				log("onFrameLoad: request timeout",{level:3});
				WM.setAsFailed(null, -14, post);
				WM.clearURL(tab);
				return;
			}

			var retry=function(){setTimeout(function(e){WM.onFrameLoad(tab, true);}, 1000);};

			var failedItem=false, gotItem=false, nopopLink;

			//check if window object is missing
			var windowExists=(tab.hwnd && !tab.hwnd.closed);
			if (!windowExists) {WM.setAsFailed(null,-17,post); WM.clearURL(tab); return;}
			//check if window document does not yet exist
			//if (!(tab.hwnd.document||null)) {retry(); return;}

			//get sidekick return value
			var hashMsg="",hashStatus=0;
			try{
				//if error encountered, reload the page
				if (tab.hwnd.document.title==="Problem loading page"){
					log("processPosts: problem loading page",{level:1});
					tab.hwnd.location.reload();
					retry();
					return;
				}

				var temphash = tab.hwnd.location.hash; //capture a hash if we can
				hashMsg = ((temphash)?temphash.removePrefix("#"):null) || tab.hwnd.location.href.split("#")[1];
				hashStatus=(responseLess)?2:(hashMsg||null)?parseInt(hashMsg.split('status=')[1].split("&")[0]):0;
				gotItem=((hashStatus>0) || (hashStatus==-6) || (hashStatus==-4) || (hashStatus==-15 && WM.opts.accepton15));
				failedItem=(hashStatus<0);
				if (!gotItem && !failedItem) {retry(); return;}

			} catch(e){
				var errText=""+e;
				if (errText.contains("hashMsg is undefined")) {
					//this known issue occurs when a page is not yet fully loaded and the
					//WM script tries to read the page content
					retry();
					return;
				}
				else if (errText.contains("Permission denied to access property")) {
					//we've reached some known cross domain issue
					if (responseLess) {
						//if the sidekick creator has chosen to use responseless collection
						//simply assume the page has loaded and mark the item as collected

						gotItem=true;failedItem=false;hashStatus=2;
					} else {
						console.log("WM.onFrameLoad(before retry): "+e);
						retry();
						return;
					}
				}
				else if (errText.contains("NS_ERROR_INVALID_POINTER")
					|| errText.contains("tab.hwnd.document is null") ) {

					WM.setAsFailed(null,-17,post);
					WM.clearURL(tab);
					return;
				}
				else {
					log("onFrameLoad: "+e,{level:3});
					retry();
					return;
				}
			}

			//if gotItem then we have been offered the item so far
			if (gotItem){
				//build debug block
		    		switch(hashStatus){
					case -6: case -4: case 1:
						// this bonus is available or we still have the ability to send something for no return
						if (synApp.flags.requiresTwo){
							try{
								nopopLink=hashMsg.split("&link=[")[1].split("]")[0];
							}catch(e){
								//known rare issue where no link is passed back by pioneer trail
							}
						}
						//dont break before next
					case -15: case 2:
						if (!synApp.flags.requiresTwo){
							WM.setAsAccepted(null, hashStatus,post);
						}
						break;

					default:
						//should not have come here for any reason, but if we did assume its a status code I didnt script for
						WM.setAsFailed(null, hashStatus,post);
						log("onFrameLoad: unexpected status code: "+hashStatus,{level:2});
						break;
		    		}
			} else {
				WM.setAsFailed(null,hashStatus,post);
			}


			// click "yes" to accept it, if we got this far we actually found an accept button
			if(synApp.flags.requiresTwo && gotItem) {
				if (nopopLink) {
					var req; req=GM_xmlhttpRequest({
						method: "GET",
						url: nopopLink,
						timeout: WM.opts.reqtimeout*1000,
						onload: function(response) {
							//search for error messages
							var test=response.responseText;
							if (test==""){
								//no text was found at requested href
								log("onFrameLoad: final stage: null response",{level:2});
								WM.setAsFailed(null, -9,post);
							} else {
								//if no errors then we got it
								WM.setAsAccepted(null, hashStatus,post);
							}
							WM.clearURL(tab);
							if(req)req=null;
						},

						onerror: function(response) {
							log("onFrameLoad: final stage: error returned",{level:2});
							//if final request fails, drop the request for now
							WM.setAsFailed(null, -10,post);
							WM.clearURL(tab);
							if(req)req=null;
						},

						onabort: function(response) {
							log("onFrameLoad: final stage: request aborted",{level:2});
							WM.setAsFailed(null, -10,post);
							WM.clearURL(tab);
							if(req)req=null;
						},
						ontimeout: function(response) {
							log("onFrameLoad: final stage: request timeout",{level:2});
							WM.setAsFailed(null, -10,post);
							WM.clearURL(tab);
							if(req)req=null;
						},
					});

				} else {
					log("onFrameLoad: nopopLink is null and a string was expected",{level:3});
					WM.setAsFailed(null, -16,post);
					WM.clearURL(tab);
					return;
				}
			} else WM.clearURL(tab);

		}catch(e){log("WM.onFrameLoad: "+e);}},

		toggle : function(opt,app){
			var targetConfig=(app||null)?app.config:WM.config;
			var targetOpts=(app||null)?app.opts:WM.opts;
			if (targetOpts[opt]){
				targetConfig.set(opt, false);
				targetOpts[opt] = false;
			} else {
				targetConfig.set(opt, true);
				targetOpts[opt] = true;
			}
               targetConfig.save();
		},

		getAppDropDownList : function(selectedIndex,allowBlank){
			var retApps=[];
			//add the fake initial option
			retApps.push(createElement("option",{textContent:"select an app",value:""}));
			retApps.push(createElement("option",{textContent:"* All",value:""}));
			if (allowBlank) retApps.push(createElement("option",{textContent:"all apps",value:""}));

			for(var i in WM.apps){
				if (!WM.apps[i].parent) {
					var elem = createElement("option",{textContent:WM.apps[i].name,value:i});
					if ((selectedIndex||null) == i) elem.selected = true;
					retApps.push(elem);
				}
			}
			return retApps;
		},

		getBonusDropDownList : function(params){
			params=params||{};
			var selected = params.selected||"";
			var appID = params.appID||null;
			var dropID = params.dropID||false; //force the element value to drop its appID prefix

			var optsret=[], bonuses={};
			if (appID) bonuses = mergeJSON(WM.apps[appID].accText,WM.apps[appID].userDefinedTypes);
			bonuses["dynamic"]="* Dynamic: Just Grab It";
			bonuses["none"]="* None: Break Identification Circuit";
			bonuses["wishlist"]="* Flag as Wishlist";
			bonuses["exclude"]="* Exclude: Prevent Collection";
			bonuses["send"]="* Send Unknown";
			bonuses["doUnknown"]="* Get Unknown";

			//create option values and names;
			for (var i in bonuses) {
				var elem
				if (appID) elem = createElement("option",{textContent:((i.startsWith(appID+"send"))?"Send ":((bonuses[i].substring(0,1)=="*")?"":"Get "))+bonuses[i],value:((dropID)?i.removePrefix(appID):i)});
				else elem = createElement("option",{textContent:bonuses[i],value:i});

				if (appID) {if (selected==((dropID)?i.removePrefix(appID):i) ) elem.selected = true;}
				else {if (selected==i) elem.selected=true;}

				optsret.push(elem);
			}

			return optsret;
		},

		reIDAll : function(){
			for (var p in WM.posts) {
				if (!WM.posts[p].isGhost && WM.posts[p].identify({reid:true}))
					WM.rulesManager.doEvent("onIdentify",WM.posts[p]);
			}
			WM.sortPosts(); //in this case sorting may cancel movetotop and movetobottom
			WM.clearGroups();
			WM.redrawPosts({postRedraw:true});
		},

		updatePostStatus : function(id){
			var status = WM.posts[id].status;
			var statusNode = selectSingleNode(".//*[contains(@class,'status')]",{node:$("post_"+id)});
			if (statusNode) statusNode.textContent="Status: "+(status||"0") + " " + (WM.statusText[status||"0"]);
			status=null; statusNode=null;
		},

		onLikePost : function(post){
			post.isLiked=true;
			return;
			
			//pre beta 40 stuff
			var postID=tab.id;
			var post=tab.post||WM.posts[postID];

			//detect if post process was cancelled by user
			if (post.processCancelled){
				//reset the cancel memory
				post.processCancelled = false;
				log("onLikePost: feedback cancelled by user");
				WM.collector.close(tab);
				return;
			}

			//detect if valid WM.collector window still exists
			var windowExists=(tab.hwnd && !tab.hwnd.closed);

			//check if window object is missing
			if (!windowExists) {
				log("onLikePost: tab.hwnd is null or closed");
				WM.collector.close(tab);
				return;
			}
			
			try{
				var like=tab.hwnd.location.hash.removePrefix("#").getUrlParam("status")=="1";
				if (like) {
					if (tab.post) {
						//tell the post it is liked
						tab.post.isLiked = true;
						//delete the post reference from the tab
						delete tab.post;
					}
					WM.collector.close(tab);
					return;
				}
			} catch (e){
				//log(""+e);
			}

			tab.tries=(tab.tries||0)+1;
			if (tab.tries<WM.opts.autoliketimeout) setTimeout(function(){WM.onLikePost(tab);}, 1000);
			else {
				log("onLikePost: unable to finish feedback",{level:3});
				doAction(function(){WM.collector.close(tab);});
			}
		},

		toggleSidekick : function(){
			var appID = this.id.split("master_")[1];
			var opt = !(WM.quickOpts["masterSwitch"][appID]||false); //toggle
			WM.quickOpts["masterSwitch"][appID]=opt;
			var className = this.parentNode.className;
			this.parentNode.className = ((opt)?className.removeWord("disabled"):className.addWord("disabled"));
			this.textContent=((opt)?"Disable":"Enable");
			WM.saveQuickOpts();
		},

		saveQuickOpts : function(){
			setOptJSON('quickopts_'+WM.currentUser.profile, WM.quickOpts);
		},

		setAppFilter : function(tab){
			WM.quickOpts.filterApp=tab.appFilter;
			WM.saveQuickOpts();
			WM.clearGroups();
			WM.redrawPosts({postRedraw:false,reorder:true});
			WM.rulesManager.doEvent("onSetAppFilter",WM.apps[tab.appFilter]);
			//debug.print(["Collection Tab Selected",WM.currentAppTab,WM.apps[tab.appFilter]]);
		},
		
		setDisplay : function(){
			var x=this.getAttribute("name");
			WM.quickOpts.displayMode=x;
			WM.saveQuickOpts();
			WM.redrawPosts({postRedraw:true,reorder:true});
			WM.setDisplayCols();
		},
		
		setDisplayCols : function(params){
			params=params||{};
			params.cols=params.cols||WM.quickOpts.displayCols;
			WM.quickOpts.displayCols=params.cols||1;
			WM.saveQuickOpts();
			with (WM.console.feedNode) {
				className=className
					.toggleWordB(params.cols==1,"singleCol")
					.toggleWordB(params.cols==2,"twoCol")
					.toggleWordB(params.cols==3,"threeCol")
					.toggleWordB(params.cols==4,"fourCol");
			}
		},

		redrawPosts : function(params){
			params=params||{};
			var feedNode=WM.console.feedNode;
			
			//set the proper display mode
			feedNode.className=feedNode.className
				.toggleWordB((WM.quickOpts.displayMode=="1" || WM.quickOpts.displayMode=="3"),"short");
			
			//avoid order issues by removing the posts from the panel
			WM.clearPosts();

			//redraw||reorder
			for (var p in WM.posts) {
				var post=WM.posts[p];
				if (!post.isGhost) {
					post.draw(params.postRedraw,params.reorder);
				}
			}
		},

		moveFloater : function(ev){
			if (isChrome) return;
			var img=this, offset=trueOffset(img), scrolled=trueScrollOffset(img),
				post=selectSingleNode(".//ancestor::div[starts-with(@id,'post')]",{node:img}),
				floater=$(post.id.replace("post","floater")), special={};

			//log( (scrolled.left) +","+ (scrolled.top) );

			special.x=(ev.clientX > (document.documentElement.clientWidth/2))?-(240+4+22):0; //width+overshot+BorderAndPadding
			special.y=(ev.clientY > (document.documentElement.clientHeight/2))?-(120+4+12):0;

			floater.style.left=(ev.clientX-(offset.left-scrolled.left))+(2+special.x)+"px";
			floater.style.top=(ev.clientY-(offset.top-scrolled.top))+(2+special.y)+"px";
		},
		
		//create a drip system for autolike, instead of an offset
		queAutoLike : function(post){
			var nowTime = timeStamp();
			var lastInQue = WM.likeQueue.last();
			var targetTime = nowTime + (1000*WM.opts.autolikedelay);
			if (lastInQue||null) {
				if (lastInQue.timer>nowTime) {
					targetTime = lastInQue.timer + (1000*WM.opts.autolikedelay);
				}
			}
			WM.likeQueue.push({post:post, timer:targetTime, fn:"like"});
			WM.console.likeQueueCounterNode.textContent = WM.likeQueue.length;
		},
		
		//create a drip system for autolike, instead of an offset
		queAutoComment : function(post,say){
			var nowTime = timeStamp();
			var lastInQue = WM.likeQueue.last();
			var targetTime = nowTime + (1000*WM.opts.autolikedelay);
			if (lastInQue||null) {
				if (lastInQue.timer>nowTime) {
					targetTime = lastInQue.timer + (1000*WM.opts.autolikedelay);
				}
			}
			WM.likeQueue.push({post:post, timer:targetTime, say:say, fn:"comment"});
			WM.console.likeQueueCounterNode.textContent = WM.likeQueue.length;
			//log(["autocomment added",say]);
		},		

		//dump the autolike queue
		emptyAutoLikeQue : function() {
			WM.likeQueue=[];
			WM.console.likeQueueCounterNode.textContent = 0;
		},
		
		//get the next ready autolike target
		checkAutoLikeQue : function() {
			if (WM.likeQueue.length<1) return null;
			var nowTime = timeStamp();
			if (WM.likeQueue[0].timer<=nowTime) {
				WM.console.likeQueueCounterNode.textContent = (WM.likeQueue.length-1);
				var t=nowTime;
				for (var i in WM.likeQueue) {
					i.timer = t;
					t+=(1000*WM.opts.autolikedelay);
				}
				return WM.likeQueue.shift(); // no longer returns the post, but the block of what to do with what post
			}
			return null;
		},

		processPosts : function(){
			//dont run if menu is open or if requests are still out or if the console is paused
			if($("Config") || (WM.requestsOpen >= WM.opts.maxrequests) || WM.paused) return;

			var postNode=selectSingleNode(".//div[starts-with(@id,'post_') and contains(@class,'collect') and not(contains(@class,'paused') or contains(@class,'working'))]",{node:WM.console.feedNode});
			if (postNode) {
				var post = WM.posts[postNode.id.replace('post_','')];
				if (post) post.open();
			}
		},

		olderPosts : function (params) {
			WM.fetch({older:true});
		},

		newerPosts : function (params) {
			WM.fetch({newer:true});
		},
		
		fetchRange : function (params) {
			WM.fetch({bypassPause:true, older:true, targetEdge:params.oldedge, currentEdge:params.newedge});
		},

		cleanPosts : function () {try{
			for (var p in WM.posts) if (!WM.posts[p].isGhost) {
				var post = WM.posts[p];
				with (post) if (!(
					isPinned || isCollect || isWorking ||
					(isTimeout && !WM.opts.cleanTimedOut)
				)) post.remove();
			}
		}catch(e){log("WM.cleanPosts(): "+e);}},
		
		setIntervals : function() {try{
			//setup the timer to try post collection
			if (procIntv) window.clearInterval(procIntv);
			procIntv=window.setInterval(WM.processPosts, 2000);

			//setup the timer to get new posts
			/*
			if (newIntv) window.clearInterval(newIntv);
			if(calcTime(WM.opts.newinterval)>0) newIntv=window.setInterval(WM.newerPosts, calcTime(WM.opts.newinterval));
			*/

			//setup the timer to get older posts
			/*
			if (oldIntv) window.clearInterval(oldIntv);
			if(calcTime(WM.opts.oldinterval)>0) oldIntv=window.setInterval(WM.olderPosts, calcTime(WM.opts.oldinterval)+2000);
			*/
			
			olderLimit=calcTime(WM.opts.maxinterval)||0;

			//setup the timer to refresh page, fetching newer content
			if (refreshIntv) window.clearInterval(refreshIntv);
			if(calcTime(WM.opts.autoRefresh)>0) refreshIntv=window.setInterval(WM.refreshPage, calcTime(WM.opts.autoRefresh));

			//setup the timer to clean up old posts from the feed
			if (cleanIntv) window.clearInterval(cleanIntv);
			if(calcTime(WM.opts.cleaninterval)>0) cleanIntv=window.setInterval(WM.cleanPosts, calcTime(WM.opts.cleaninterval)+250);

			//setup global heartbeat
			if (hbIntv) window.clearInterval(hbIntv);
			hbIntv=window.setInterval(WM.onHeartbeat, WM.opts.heartRate);
			
		}catch(e){log("WM.setIntervals: "+e);}},

		hideCounters : function(){try{
			hideNodes("//*[contains(@class,'accFailBlock')]");
		}catch(e){log("WM.hideCounters: "+e);}},

		showCounters : function(){try{
			showNodes("//*[contains(@class,'accFailBlock')]");
		}catch(e){log("WM.showCounters: "+e);}},

		validatePost : function(fbPost){try{
			//alert("validatepost");
			//validate required post fields
			/*if (!( exists(fbPost.application) && exists(fbPost.link) && fbPost.type=="link")) {
				return;
			}*/

			//accept only posts we have sidekicks for
			var app=WM.apps[fbPost.app_id];
			//debug.print(app);
			if (!exists(app)) return;
			//debug.print("app detected");
			
			//prevent redrawing same post in case one slips past the graph validator
			var postID=fbPost.source_id + "_" + fbPost.post_id;
			//debug.print([postID,fbPost.qid]);
			if (WM.posts[postID]||null) {
				//debug.print(WM.posts[postID].id);
				return;
			}
			//debug.print("no duplicate post detected");
			//fbPost.pageNode.className +=" notDuplicatePost";

			//accept only posts for which a sidekick is enabled
			if (!WM.quickOpts.masterSwitch[app.appID]) return;
			//debug.print("sidekick for this app is ready and willing");

			//create a Post object from the post data
			var post=(WM.posts[postID]=new WM.Post(fbPost));
			if (post) {
				var hasID=post.identify();
				WM.sortPosts(); //make sure new posts fit the current sort order and direction
				if (hasID) {
					WM.rulesManager.doEvent("onValidate",post);
					WM.rulesManager.doEvent("onIdentify",post);
					post.draw(true,true);
					//debug.print("post has been told to draw");
					
					//track the post
					if (WM.opts.useFriendTracker && !post.isMyPost){
						WM.friendTracker.track(post);
					}
				}
			} else {
				log("WM.validatePost: Unable to transform post data into a useful post object. (id:"+fbPost.source_id + "_" + fbPost.post_id+")");
			}
		}catch(e){log("WM.validatePost: "+e);}},

		handleEdges : function(params){
			/*
				apps
				friends
				edge:{newer,older}
			*/
			//console.log("handleEdges: "+JSON.stringify(params));
			
			if (params.friends||null) {
				//update user created feeds
				for (var f=0,l=WM.feedManager.feeds.length;f<l;f++){
					var feed = WM.feedManager.feeds[f];
					//if this feed is listed in those passed back...
					if (params.friends.contains(feed.id)){
						//update each app filter in this feed
						for (var c=0,l=params.apps.length;c<l;c++) {
							var appID=params.apps[c];
							filter = feed.filters["app_"+appID];
							if (!(filter||null)) {
								//this filter does not exist, create one
								filter=feed.addFilter({id:"app_"+appID});
							}
							if (params.edge.older) filter.oldedge = params.edge.older;
							if (params.edge.newer) filter.newedge = params.edge.newer;
							filter.oldedgeNode.textContent = filter.oldedge;
							filter.newedgeNode.textContent = filter.newedge;
							if (timeStamp()-(filter.oldedge*1000)>olderLimit) filter.olderLimitReached=true;
						}
					}
				}
			} else {
				//update base feed
				feed = WM.feedManager.feeds[0];
				for (var c=0,l=params.apps.length;c<l;c++) {
					var appID=params.apps[c];
					//update each app filter in this feed
					filter = feed.filters["app_"+appID];
					if (!(filter||null)) {
						//this filter does not exist, create one
						filter=feed.addFilter({id:"app_"+appID});
					}
					if (params.edge.older) filter.oldedge = params.edge.older;
					if (params.edge.newer) filter.newedge = params.edge.newer;
					filter.oldedgeNode.textContent = filter.oldedge;
					filter.newedgeNode.textContent = filter.newedge;
					if (timeStamp()-(filter.oldedge*1000)>olderLimit) filter.olderLimitReached=true;
				}					
			}
		},
				
		fetch : function(params) {try{
			/*
				older:bool
				newer:bool
				apps:[]
				feed:[]
				targetEdge:unixtime
				currentEdge:unixtime
				bypassPause:bool
				bypassFeedDisabled:bool
				bypassAppDisabled:bool
			*/
		
			params=params||{};
			if (WM.fetchPaused && !params.bypassPause) return;
			
			Graph.fetchPosts({bypassPause:true});

			//convert a single passed app to a single entry list
			/*
			if (exists(params.apps) && ((params.apps.objType||null)=="app")) {
				var ret={};
				ret[params.apps.appID]=params.apps;
				params.apps=ret;
			}
			
			var useApps = params.apps||WM.apps;

			//convert a single passed feed to an array
			if (exists(params.feeds) && ((params.feeds.objType||null)=="feed")) {
				params.feeds=[params.feeds];
			}
			params.currentEdge = params.currentEdge||null; //nullify undefined edge
						
			//for each feed individually
			var feeds=params.feeds||WM.feedManager.feeds;
			for (var f=0,len=feeds.length;f<len;f++) { 
				var feed=feeds[f];
				var friend=(feed.url!="https://graph.facebook.com/me/home")?[feed.id]:null;
				
				//ignore the old me feed because it is a duplicate of the wall feed
				if (feed.url!="https://graph.facebook.com/me/feed") if (feed.enabled || params.bypassFeedDisabled) {
								
					//for each app make a separate fetch call for the given feed
					//override this: no more by-app fetching
					
					if (false && !WM.opts.groupFetching && (useApps||null)) {
						for (var a in useApps) {
							var app=useApps[a];
							
							//only fetch for enabled apps
							//where we are fetching new
							//or if we are fetching old we are not at our older limit
							var feedFilter=feed.filters["app_"+a];
							if ((app.enabled || params.bypassAppDisabled) && (feedFilter.enabled || params.bypassFilterDisabled) && !(
									params.older && feedFilter.olderLimitReached
								)
							){
								var G=Graph.fetchPostsFQL_B({
									callback:WM.validatePost,
									direction:(params.newer?1:(params.older?-1:0)),
									limit:WM.opts.fetchQty,
									targetEdge:(params.targetEdge||null), //special for new rules manager actions
									friends:friend,
									apps:[app.appID],
									currentEdge:params.currentEdge||(params.newer?feedFilter.newedge:(params.older?feedFilter.oldedge:null)),
									edgeHandler:WM.handleEdges,
									noAppFiltering:WM.opts.noAppFiltering
									
								});								
							}
						}
						
						
					//join apps together before fetching a single time for the given feed
					} else {
						//get the keys of the apps collection
						var keys=Object.keys(useApps);
						//if any sidekicks are docked
						if (keys.length) {
							//get the values of the apps collection
							var appsToProcess=keys.map(function (key) {
								return useApps[key];
							//filter out which apps are able to be fetched for
							}).filter(function(o,i,p){
								//get the feed filter text
								var feedFilter=feed.filters["app_"+o.appID];
								//get if the app is enabled
								var isEnabled = (o.enabled || params.bypassAppDisabled);
								var isFilterEnabled=true,isOlderLimitReached=false; 
								if (feedFilter||null) {
									//get if the feed filter is enabled
									isFilterEnabled = (feedFilter.enabled || params.bypassFilterDisabled);
									//get if the feed filter has already reached its older edge limit
									isOlderLimitReached = (params.older && feedFilter.olderLimitReached);
								} else {
									//feed filter does not exist for this app
									//assume it was deleted by the user on purpose
									//and don't fetch for this app on this feed
									log("WM.fetch: could not find filter for " + o.appID + "in feed " + feed.id);
									return false;
								}
								if (isEnabled && isFilterEnabled && !isOlderLimitReached) return true;
								return false;
							//simply the array
							}).map(function(o,i,p){
								//just get the id's of apps to do, not the entire app object
								return o.appID;
							});
							
							//make sure we matched filters to process
							if (appsToProcess.length){
								//get the shared edges of the passed apps
								var edges = feed.getMergedEdges({apps:appsToProcess});
								//console.log("getMergedEdges returned: "+JSON.stringify(edges));
								
								var G=Graph.fetchPostsFQL_B({
									callback:WM.validatePost,
									direction:(params.newer?1:(params.older?-1:0)),
									limit:WM.opts.fetchQty,
									targetEdge:(params.targetEdge||null), //special for new rules manager actions
									friends:friend,
									apps:appsToProcess,
									currentEdge:params.currentEdge||(params.newer?edges.newedge:(params.older?edges.oldedge:null)),
									edgeHandler:WM.handleEdges,
									noAppFiltering:WM.opts.noAppFiltering
								});
							}
						}
					}
					
					
				}
			}
			*/
		}catch(e){log("WM.fetch: "+e);}},
		
		changeDebugSettings : function(){try{
			if (debug && debug.initialized) {
				debug.doDebug = WM.opts.debug;
				debug.debugLevel = parseInt(WM.opts.debugLevel);
				debug.debugMaxComments = WM.opts.debugMaxComments;
				debug.useScrollIntoView = WM.opts.debugScrollIntoView;
				debug.stackRepeats = WM.opts.debugStackRepeats;
			} else {
				if (debug) debug.init();
				setTimeout(WM.changeDebugSettings,1000);
			}
		}catch(e){log("WM.changeDebugSettings: "+e);}},
				
		changeConfigSettings : function(){try{
			WM.config.sectionsAsTabs=WM.opts.configSectionsAsTabs;
			WM.config.separatorsAsTabs=WM.opts.configSeparatorsAsTabs;
			WM.config.useScrollIntoView=WM.opts.configScrollIntoView;
			WM.config.confirms={
				save:WM.opts.configConfirmSave,
				cancel:WM.opts.configConfirmCancel,
				"import":WM.opts.configConfirmImport,
				restore:WM.opts.configConfirmRestore
			};
		}catch(e){log("WM.changeConfigSettings: "+e);}},

		resizeConsole : function(){try{
			//negotiate height with fb bluebar
			var node=$("pagelet_bluebar");
			var h=(node)?elementOuterHeight(node):0;
			
			with($("wmContent")){
				style.height=document.documentElement.offsetHeight-h+"px";
				style.width=document.documentElement.offsetWidth+"px";
			}
			WM.console.tabContainer.redraw();
			WM.console.collectTabControl.redraw();

		}catch(e){log("WM.resizeConsole: "+e);}},

		setColors : function(){try{
			var colors=["excluded","working","timeout","paused","nodef","failed","accepted","scam","pinned"];
			var css="";
			for (var c=0, color; (color=colors[c]); c++) {
				css+=("div."+color+"{background-color:"+WM.opts["colors"+color]+" !important;}\n");
			}
			//set the new transition delay timer
			css+=(".wm.post.short:hover .floater {-moz-transition-property: padding,border,width,height;-moz-transition-delay:"+WM.opts["transitiondelay"]+"s; width:240px; padding:5px 10px;border:1px solid;}\n");
			remove($("user_colors_css"));
			addGlobalStyle(css,"user_colors_css");
		}catch(e){log("WM.setColors: "+e);}},

		initConsole : function(){try{
			WM.console.loading=false;
			if (WM.console.initialized) log("WM Console Initialized");

			//show options menu button
			with (WM.console.configButton) {
				className = className.removeWord("jsfHidden");
			}

			//set console heights
			WM.resizeConsole();

			//load feed sources
			WM.feedManager.init();
			
			//import friend tracker data
			//and delete posts out of bounds with our "track for how many days"
			WM.friendTracker.init();
			WM.friendTracker.clean();

			//initialize user colors
			WM.setColors();
			
			//set up the priorities and limits object
			//and new rules manager
			WM.rulesManager.init();

			//decipher the dynamic tests
			WM.grabber.init();

			//show counters
			if (WM.opts.showcounters) WM.showCounters(); else WM.hideCounters();
			
			//set intervals
			WM.setIntervals();
			
			//set autopause
			if (WM.opts.autopausecollect) WM.pauseCollecting(true);
			if (WM.opts.autopausefetch) WM.pauseFetching(true);
			
			//open a channel for sidekick communication
			WM.fetchSidekickData();

			//add an entrypoint for sidekicks since we know FB gave us access
			var createDock = function(){
				document.body.appendChild(
					createElement('div',{id:'wmDock',style:'display:none;',onclick:function(){
						WM.dock.answerDockingDoor();
					}})
				);
				document.body.appendChild(
					createElement('div',{id:'wmDataDump',style:'display:none;'})
				);
			};
			
			createDock();			

		}catch(e){log("WM.initConsole: "+e);}},

		cleanHistory : function(params){try{
			log("Cleaning History");
			params=params||{};
			var ask=WM.opts.historyConfirmClean;
			if (params.noConfirm || !ask || (ask && confirm("Clean and pack history for this profile?"))){
				//history = getOptJSON("history_"+WM.currentUser.profile)||{};
				var ageDays=parseInt(WM.opts.itemage);
				var timeNow=timeStamp();
				for(var i in WM.history) {
					if( ( (timeNow-WM.history[i].date) /day) > ageDays) {
						delete WM.history[i];
					}
				}
				setOptJSON("history_"+WM.currentUser.profile, WM.history);
			}
		}catch(e){log("WM.cleanHistory: "+e);}},

		optionsSetup : function(){try{
			//debug.print("WM.optionsSetup:");
			
			//create the settings tree
			var configContent = {};
			configContent.storageName="settings_"+(WM.quickOpts.useGlobalSettings?"global":WM.currentUser.profile);
			configContent.onSave=WM.onSave;
			configContent.title="FB Wall Manager "+WM.version+(WM.quickOpts.useGlobalSettings?" (!! Global Settings !!)":"");
			configContent.logo=createElement("span",{}[
				createElement("img",{className:"logo",src:"",textContent:"v"+WM.version}),
				createElement("text","v"+WM.version)
			]);
			configContent.css=WM.console.dynamicIcons()+jsForms.globalStyle();
			
			//debug.print("starting settings section");
			configContent.settings={}; o=configContent.settings;
			
			o.btn_useGlobal={
				type:"button",
				label:"Use Global Settings", 
				title:"Switch to using a global storage for settings. Those settings can then be used by other accounts (not browser profiles).",
				script:function(){
					if (WM.quickOpts.useGlobalSettings||false) {
						//already using global settings
						return;
					}
					if (confirm("Switch to using global (shared) settings?")){
						WM.quickOpts.useGlobalSettings=true;
						WM.saveQuickOpts();
						WM.config.title = "FB Wall Manager "+WM.version+" (!! Global Settings !!))";
						WM.config.storageName = "settings_global";
						WM.config.values=WM.config.read();
						WM.config.configure();
						WM.config.reload();
					}
				},
			};
			o.btn_useOwnProfile={
				type:"button",
				label:"Use Profile Settings", 
				title:"Switch to using your own profile storage for settings.",
				script:function(){
					if (!(WM.quickOpts.useGlobalSettings||false)) {
						//already using profile settings
						return;
					}
					if (confirm("Switch to using your own profile settings?")){
						WM.quickOpts.useGlobalSettings=false;
						WM.saveQuickOpts();
						WM.config.title = "FB Wall Manager "+WM.version;
						WM.config.storageName = "settings_"+WM.currentUser.profile;
						WM.config.values=WM.config.read();
						WM.config.configure();
						WM.config.reload();
					}
				},
			};
			
			//debug.print("host options section start");
			o.wmtab_opts=tabSection("Host Options",{
			
				section_basicopts:section("Basics",{
					/*authTokenTools:optionBlock("Authorization",{
						devAuthToken:checkBox("Automatically check my developer tool app for my Auth Token"),									
					},true),*/
				
					intervals:optionBlock("Post Fetching",{								
						newinterval:{
							label:"Read Visible Posts Interval",
							type:"selecttime",
							title:"Read new posts from page after a set time (those on the page not yet read).",
							options:{
								"off":"Off",
								"tenth":"6 seconds",
								"sixth":"10 seconds",
								"half":"30 seconds",
								"one":"1 minute",
								"two":"2 minutes",
								"three":"3 minutes",
								"four":"4 minutes",
								"five":"5 minutes",
								"ten":"10 minutes",
							},
							"default":"t:30s"
						},

						autoRefresh:{
							label:"Refresh Page Interval",
							type:"selecttime",
							title:"Refresh page to look for newer posts.",
							options:{
								"off":"Off",
								"one":"1 minute",
								"two":"2 minutes",
								"three":"3 minutes",
								"four":"4 minutes",
								"five":"5 minutes",
								"ten":"10 minutes",
							},
							"default":"off"
						},

						/*fetchQty:{
							label:"Fetch how many? (subject to filtering)",
							type:"select",
							title:"Posts fetched per request. Higher numbers affect speed of fetching.",
							options:{
								"5":"5",
								"10":"10",
								"25":"25",
								"50":"50",
								"100":"100",
								"250":"250",
								"500":"500 (FB maximum)", //known maximum fetch as of 9/8/2013
							},
							"default":"25"
						},*/

						/*oldinterval:{
							label:"Get Older Posts Interval",
							type:"selecttime",
							title:"Fetch previous posts from facebook after a set time.",
							options:{
								"off":"Off",
								"tenth":"6 seconds",
								"sixth":"10 seconds",
								"half":"30 seconds",
								"one":"1 minute",
								"two":"2 minutes",
								"three":"3 minutes",
								"four":"4 minutes",
								"five":"5 minutes",
								"ten":"10 minutes",
							},
							"default":"off"
						},*/

						maxinterval:{
							label:"How old is too old?",
							type:"selecttime",
							title:"Tell WM what you think is a good max post age to fetch. Also affects which posts are considered 'stale'.",
							options:{
								"off":"Off/Infinite",
								"hour":"1",
								"2hour":"2",
								"3hour":"3",
								"4hour":"4",
								"8hour":"8",
								"12hour":"12",
								"18hour":"18",
								"24hour":"24",
								"32hour":"32",
								"48hour":"48",
							},
							"default":"t:1d"
						},

						//groupFetching:checkBox("All installed sidekicks in one request (default: one request per sidekick)",false,{},true),
						//noAppFiltering:checkBox("Have WM filter posts for you instead of having facebook do it (may prevent some empty data set issues)",false,{},true),
					},true),

					autoPauseBlock:optionBlock("Fetching/Collecting Autopause",{
						autopausefetch:checkBox("Pause Fetching after First Fetch"),
						autopausecollect:checkBox("Pause Collection on Startup"),
					},true),

					multiTaskBlock:optionBlock("Multi-task",{
						maxrequests:inputBox("Max requests simultaneously",1),
						recycletabs:inputBox("Recycle Windows/Tabs",1),
						recycletabsall:checkBox("Recycle All",true),
					},true),

					queBlock:optionBlock("Task-Queue",{
						queuetabs:checkBox("Force all posts and autolikes through one tab using a queue (overrides multi-task)",true),
					},true),

					timeoutBlock:optionBlock("Time-outs",{
						reqtimeout:inputBox("Item Acceptance Page Timeout (seconds)",30),
						failontimeout:checkBox("Mark Timeout as Failure (default: retry indefinitely)"),
					},true),
				}),

				section_access:section("Accessibility",{
					shortModeBlock:optionBlock("Short Mode",{
						thumbsize:{
							label:"Thumbnail Size",
							type:"select",
							title:"Size of bonus thumbnails in display mode: short and .",
							options:{
								"mosquito":"16px",
								"tiny":"24px",
								"small":"32px",
								"medium":"48px",
								"large":"64px",
								"xlarge":"96px",
							},
							"default":"medium"
						},
						transitiondelay:inputBox("Hover Box Delay (s)",1),
					},true),

					accessTweaksBlock:optionBlock("Tweaks",{
						debugrecog:checkBox("Show Identified Text (instead of original link text)",true),
						showcounters:checkBox("Show Accept/Fail Counts",true),
						showdynamictips:checkBox("Show Dynamic Console Tips",true),
						appsConfirmDeleteUDT:checkBox("Confirm Delete User Defined Types",true),
					},true),

					toolBoxBlock:optionBlock("Customize Post Toolbox",{
						showtoolbox:checkBox("Enable ToolBox", true),

						showopen:checkBox("Open Post",true),
						showmarkfailed:checkBox("Mark As Failed",true),
						showmarkaccepted:checkBox("Mark As Accepted",true),
						showlike:checkBox("Like Post",true),
						showreid:checkBox("Re-ID Post",true),
						showmovetop:checkBox("Move to Top",true),
						showmovebottom:checkBox("Move to Bottom",true),
						showpin:checkBox("Pin Post",true),
						showclean:checkBox("Clean Post",true),
						showpostsrc:checkBox("Show Post Source",true),

						showcancelprocess:checkBox("Cancel Process or Like",true),
						showrestartprocess:checkBox("Restart Process or Like",true),
						showpausetype:checkBox("Pause Bonus Type",true),
						showunpausetype:checkBox("Unpause Bonus Type",true),
						showaddfeed:checkBox("Add To Feeds",true),

						showmakerule:checkBox("Rule From Post",true),
						showoriginaldata:checkBox("Show Original Data",true),
						//showautocomment:checkBox("Auto Comment",true),
						
					},true),
					
					littleToolBoxBlock:optionBlock("Customize Mini Toolbox",{
						littleButtonSize:{
							label:"Mini Toolbutton Size (requires refresh to redraw)",
							type:"select",
							title:"Size of buttons on mini toolbars",
							options:{
								"16":"16px",
								"24":"24px",
								"32":"32px",
							},
							"default":"24",
						},
					},true),

					userColorsBlock:optionBlock("Colors",{
						colorsaccepted:colorBox("Accepted","limegreen"),
						colorsfailed:colorBox("Failed","red"),
						colorsworking:colorBox("Working","yellow"),
						colorsexcluded:colorBox("Excluded","gray"),
						colorspaused:colorBox("Paused","silver"),
						colorsnodef:colorBox("No Definition","deepskyblue"),
						colorsscam:colorBox("Potential Scam","purple"),
						colorspinned:colorBox("Pinned","black"),
						colorstimeout:colorBox("Timeout","orange"),
					},true),
					

				}),

				section_feedback:section("Feedback",{
					//publishwarning:{type:"message",title:"Autolike has changed",textContent:"As of WM beta 40 you must allow 'publish_actions' on the 'user data permissions' tab in your Graph API Explorer token builder.",newitem:true},
					//gotoapiexplorer:anchor("Visit API Explorer","http://developers.facebook.com/tools/explorer?&version=v1.0"),
					autoSetup:optionBlock("Setup",{
						//useautocomment:checkBox("Use Auto-comment (experimental)"),
						useautolike:checkBox("Use Auto-like"),
						//autoliketimeout:inputBox("Timeout (seconds)",30),
						autolikedelay:inputBox("Ban-Prevention Delay (seconds)",3),
					},true),
					autoLikeBlock:optionBlock("Perform Feedback For",{
						autolikeall:checkBox("All Posts"),
						autolikeaccepted:checkBox("Accepted Posts"),
						autolikesent:checkBox("Sent Posts"),
					},true),
					/*autoCommentListBlock:optionBlock("Comments (experimental)",{
						autocommentlist:textArea("Random Comments (One per line)","Thanks\nThank you\nthanks"),
					},true),*/
					blockautolikebygame:optionBlock("Block Feedback by Game",{},false),
				}),

				section_filters:section("Filters",{
					displayfilters:optionBlock("Remove Feed Parts (Classic Mode Only)",{
						hideimages:checkBox("Images (All)"),
						hideimagesunwanted:checkBox("Images (Unwanted Posts)"),
						hidebody:checkBox("Post Body Text"),
						hidevia:checkBox("Via App"),
						hidedate:checkBox("Date/Time"),
					},true),

					filters:optionBlock("Hide By Type",{
						hidemyposts:checkBox("My Posts"),
						hideunwanted:checkBox("Unwanted"),
						hideaccepted:checkBox("Accepted"),
						hidefailed:checkBox("Failed"),
						hidescams:checkBox("Scams"),
						hidestale:checkBox("Stale Posts"),
						hideexcluded:checkBox("Excluded"),
						hideliked:checkBox("Liked By Me"),
						hideunsupported:checkBox("Unsupported Apps"),

						donthidewishlists:checkBox("Don't Hide Known Wish Lists"),
					}),

					//allow hiding all posts by particular games
					filterapps:optionBlock("Hide By App",{}),

					//now added dynamically as appID+"dontsteal"
					dontstealBlock:optionBlock("Don't take W2W posts not for me",{}),

					skipopts:optionBlock("Skip By Type",{
						skipliked:checkBox("Liked By Me"),
						skipstale:checkBox("Day-Old Posts"),
					}),

					filterTweaksBlock:optionBlock("Tweaks",{
						accepton15:checkBox("Mark 'Unrecognized Response' As Accepted"),
						markliked:checkBox("Mark Liked As Accepted (must check 'Skip By Type: Liked By Me')"),
					},true),

					filterCleanupBlock:optionBlock("Cleanup",{
						cleaninterval:{
							label:"Cleanup Interval",
							type:"selecttime",
							title:"Remove unwanted posts from collection console after a set time.",
							options:{
								"off":"Off",
								"one":"1 minute",
								"two":"2 minutes",
								"five":"5 minutes",
								"ten":"10 minutes",
								"fifteen":"15 minutes",
								"thirty":"30 minutes",
								"hour":"1 hour",
							},
							"default":"off"
						},
						cleanTimedOut:checkBox("Clean timed out posts",true),
					},true),
				}),

				section_history:section("History",{
					itemage:inputBox("How long to keep tried items in memory (days)",2),
					oblock_historyConfirms:optionBlock("Confirm (Changes available on next config open)",{
						historyConfirmClear:{type:"checkbox",label:"Clear History",title:"Confirm before clearing history.","default":true},
					},true),
					reset:button("Clear History",
						WM.resetAccepted
					),
				}),

				section_feedopts:section("Feeds Manager",{
					oblock_feedsConfirms:optionBlock("Confirm",{
						feedsConfirmDeleteFeed:{type:"checkbox",label:"Delete Rule",title:"Require confirmation to delete a feed.","default":true},
					},true),
				}),

				section_dynamicopts:section("Dynamic Grabber",{
					dynamicopts:optionBlock("Dynamic Collection",{
						dynamicFirst:checkBox("Run Dynamics BEFORE Sidekicks",true),
					},true),
					enableDynamic:optionBlock("Enable Dynamics by Game",{}),
					oblock_dynamicConfirms:optionBlock("Confirm",{
						dynamicConfirmDeleteTest:{type:"checkbox",label:"Delete Rule",title:"Require confirmation to delete a test.","default":true},
					},true),
				}),

				section_friendtrackopts:section("Friend Tracker",{
					useFriendTracker:checkBox("Enable Friend Tracking",true),
					trackTime:inputBox("Track For How Many Days",2),
					trackeropts:optionBlock("Track Data",{
						trackCreated:checkBox("Post Creation Counts",true),
						trackLastKnownPost:checkBox("Last Known Post Time",true),
						trackAccepted:checkBox("Bonuses Accepted",true),
						trackFailed:checkBox("Bonuses Failed",true),
					},true),
					oblock_trackerConfirms:optionBlock("Confirm",{
						trackConfirmClearUser:{type:"checkbox",label:"Clear User Data",title:"Require confirmation to clear user data.","default":true},
					},true),
				}),
				
				section_rulesopts:section("Rules Manager",{
					oblock_rulesHeartbeat:optionBlock("Heartbeat",{
						heartRate:inputBox("Global Heartbeat Delay (ms)",1000),
						heartbeatAffectsApps:{type:"checkbox",label:"Affect Apps",title:"Heartbeat can be heard at app level on every rule at once. This can slow down your system."},
						heartbeatAffectsPosts:{type:"checkbox",label:"Affect Posts",title:"Heartbeat can be heard at post level on every rule at once. This can slow down your system."},
						heartbeatAffectsRules:{type:"checkbox",label:"Affect Rules",title:"Heartbeat can be heard at rule level on every rule at once. This can slow down your system."},
						heartbeatAffectsFeeds:{type:"checkbox",label:"Affect Feeds",title:"Heartbeat can be heard at feed level on every rule at once. This can slow down your system."},
						heartbeatAffectsFeedFilters:{type:"checkbox",label:"Affect Feed Filters",title:"Heartbeat can be heard at feed filter level on every rule at once. This can slow down your system."},
					},true),
					oblock_rulesConfirms:optionBlock("Confirm",{
						rulesConfirmDeleteValidator:{type:"checkbox",label:"Delete Validator",title:"Require confirmation to delete a rule's validator.","default":true},
						rulesConfirmDeleteAction:{type:"checkbox",label:"Delete Action",title:"Require confirmation to delete a rule's action.","default":true},
						rulesConfirmDeleteRule:{type:"checkbox",label:"Delete Rule",title:"Require confirmation to delete a rule.","default":true},
						rulesConfirmResetLimit:{type:"checkbox",label:"Reset Limit",title:"Require confirmation to reset individual limits.","default":true},
						rulesConfirmResetAllLimits:{type:"checkbox",label:"Reset All Limits",title:"Require confirmation to reset all limits.","default":true},
						rulesConfirmHatch:{type:"checkbox",label:"Hatch Eggs",title:"Require confirmation to hatch eggs.","default":true},
					},true),
					rulesJumpToNewRule:{type:"checkbox",label:"Jump To New Rules",title:"When new rules are created from tests or posts, select the rules manager tab and scroll the new rule into view.","default":true},
				}),

				section_dev:section("Debug",{
					oblock_debugTweaks:optionBlock("Tweaks",{
						pinundefined:checkBox("Pin Undefined Bonus Types"),
					},true),
					debugOpts:optionBlock("Debug",{
						debug:checkBox("Enable Debug",true),
						debugLevel:{
							label:"Debug Sensitivity",
							title:"Sets the level of errors and warnings to report. 0 is all, 5 shows only the worst.",
							type:"select",
							options:{
								"0":"Function calls",
								"1":"Function subsections & debug notes",
								"2":"Captured expected errors",
								"3":"Known open errors",
								"4":"Unexpected errors",
								"5":"Fatal errors",
							},
							"default":"0"
						},
						debugMaxComments:inputBox("Max debug lines (0 for no limit)",100),
						debugScrollIntoView:checkBox("Use scrollIntoView"),
						debugStackRepeats:checkBox("Stack Immediate Repeats"),

					},true),
					advDebugOpts:optionBlock("Advanced Debug",{
						devDebugFunctionSubsections:checkBox("Debug Function Subsections",false),
						devDebugGraphData:checkBox("Debug Graph Packets (not available for Chrome)",false),
					},true),
					GM_special:optionBlock("Script-runner Options",{
						useGM_openInTab:checkBox("Use GM_openInTab instead of window.open",false),
					},true),

				}),

				section_configopts:section("Config",{
					oblock_configConfirms:optionBlock("Confirm (Changes available on next config open)",{
						configConfirmSave:{type:"checkbox",label:"Save",title:"Confirm before saving settings.","default":true},
						configConfirmCancel:{type:"checkbox",label:"Cancel",title:"Confirm before closing settings without saving.","default":true},
						configConfirmImport:{type:"checkbox",label:"Import",title:"Confirm before importing settings.","default":true},
						configConfirmRestore:{type:"checkbox",label:"Restore Defaults",title:"Confirm before restoring defaults.","default":true},
					},true),
					oblock_configStyling:optionBlock("Styling (Changes available on next config open)",{
						configSectionsAsTabs:{type:"checkbox",label:"Display Sections as Tabs",title:"Converts top level roll-outs only. Display those rollouts as tabs on next open of config."},
						configSeparatorsAsTabs:{type:"checkbox",label:"Display Separators as Tabs",title:"Converts second level roll-outs only. Display those rollouts as tabs on next open of config. Removes select all/none buttons on top of the separator."},
					},true),
					oblock_configTweaks:optionBlock("Tweaks (Changes available on next config open)",{
						configScrollIntoView:{type:"checkbox",label:"Use scrollIntoView",title:"When tabs and sections are opened, use the scrollIntoView function to bring them more fully into view. This is jerky at best."},
					},true),
				}),
			});

			/*wmtab_games:tabSection("Sidekick Options",{
				skmovedwarning:{type:"message",title:"Sidekick options have moved",textContent:"Sidekick options have been moved to separate config windows. Access them by using the 'Manage Sidekicks' tab, where you can find new 'Options' buttons for each sidekick."},
			}),*/
			//debug.print("info section start");
			o.wmtab_info=tabSection("Info",{
				MainMessageCenter:separator("Documentation - Messages - Help",null,{
					//Mainupdate:anchor("Update Script","http://userscripts.org/scripts/source/86674.user.js"),
					donateWM:{type:"link",label:"Donate for FBWM via Paypal",href:"https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=merricksdad%40gmail%2ecom&lc=US&item_name=Charlie%20Ewing&item_number=FBWM&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted"},
					Mainwikipage:anchor("Wiki Support Page","http://fbwm.wikia.com/wiki/Known_Issues"),
					Mainsetupinfo:anchor("Setup Info","http://fbwm.wikia.com/wiki/New_User_Setup"),
					Maindiscuss:anchor("Known Bugs","http://fbwm.wikia.com/wiki/Known_Issues"),
					Mainrevisionlog:anchor("Revision Log","http://fbwm.wikia.com/wiki/Revisions"),
				},true)
			});
			//debug.print("done config content");
				

			
			//debug.print(configContent);
			WM.config = new Config(configContent);
			
			//debug.print("host options menu created");
			
			// add options shortcut to user script commands
			GM_registerMenuCommand("Wall Manager "+WM.version+" Options", function(){WM.config.open();});
		}catch(e){log("WM.optionsSetup: "+e);}},

		init : function(){try{
			//capture user id/alias/name and make it global
			WM.currentUser.id = Graph.userID;
			WM.currentUser.alias = Graph.userAlias;
			WM.currentUser.profile = WM.currentUser.id||WM.currentUser.alias; //switch to id over alias preference, as alias may change

			debug.print("UserID:"+WM.currentUser.id+"; UserAlias:"+WM.currentUser.alias+"; WM is Using:"+WM.currentUser.profile);

			//get WM.quickOpts
			WM.quickOpts = getOptJSON('quickopts_'+WM.currentUser.profile)||{};
			WM.quickOpts["filterApp"]=(WM.quickOpts["filterApp"]||"All");
			WM.quickOpts["displayMode"]=(WM.quickOpts["displayMode"]||"0");
			WM.quickOpts["masterSwitch"]=(WM.quickOpts["masterSwitch"]||{});
			WM.quickOpts["useGlobalSettings"]=(WM.quickOpts["useGlobalSettings"]||false);

			//create the options menu
			//debug.print("starting options setup");
			WM.optionsSetup(); 
			

			//duplicate the options saved in WM.config
			//debug.print("starting update settings values");
			WM.updateSettingsValues();

			//set up the config with its internal special variables
			WM.changeConfigSettings();

			//setup debug beyond its defaults
			WM.changeDebugSettings();
			
			//clean history
			WM.history = getOptJSON('history_'+WM.currentUser.profile)||{};
			WM.cleanHistory();
						
			//prep the console now that we have an id and/or alias
			//and then carry on with our init
			WM.console.init({callback:WM.initConsole});
		}catch(e){log("WM.init: "+e);}},
		
		receiveSidekickMessage: function(event) {
			if (isObject(event.data)) {
				var data=event.data; //just shorten the typing
				if (data.channel=="WallManager"){
					//log(JSON.stringify(data));
					//$("WM_debugWindow").childNodes[1].lastChild.scrollIntoView();
					switch (data.msg){
						case 2: //getting a comOpen response from sidekick
							//WM.collector.tabs[data.tabID].comOpen=true;
							break;
							
						case 4: //getting a status package from sidekick
							switch (data.params.action){
								case "onFrameLoad":
									WM.onFrameLoad(data.params);
									break;
								case "onFrameLoad3":
									WM.onFrameLoad3(data.params);
									break;
							}
							break;
					}
				}
			}
		},		

		run : function() {try{
			// pre-load console images
			//for(var img in imgs) try{new Image().src = imgs[img];}catch(e){log("preload: "+e);}

			/* Removed for version 4

			//special about:config entry for disabling storage of fb auth token
			//should help multi account users
			//if (getOpt("disableSaveAuthToken")) 
			Graph.authToken=null;
			
			//patch 38 auth token stuff
			var flagManualAuthSuccessful=getOpt("flagManualAuthSuccessful")||false;					
			if (WallManager.switches.manualAuthToken && !flagManualAuthSuccessful) {
				var m="WM can no longer access your FB Access Token without your manual assistance.\nTo successfully fetch posts, please complete the following:\n\n*In a new browser window, visit: http://developers.facebook.com/tools/explorer\n\n*If required, allow that app access to your facebook information\n*Find the 'Get Access Token' button and click it\n*In the panel that appears, click 'extended permissions'\n*Be sure that 'read_stream' is selected or otherwise not blank\n*If you want to use autolike/autocomment also select 'publish_actions' from the 'user data permissions' tab*Click the 'Get Access Token' button\n*Now find the box that says 'Access Token' and select its value\n*Copy that value and paste it into the box on this promp\n\nNote: this token does not last forever, you may need to repeat this process";
				var manualToken = prompt(m,"paste token here");
				
				//validate manualToken at least somewhat
				
				//halt if manual token is not given
				if (manualToken=="" || manualToken==null || manualToken=="paste token here") {
					alert("manual token not accepted, please refresh and try again");
					return;
				}
				
				//pass the manual token along
				Graph.authToken=manualToken;
				
				//consider saving time by looking for auth tokens automatically from here out
				var m = "WM thinks your auth token setup is successful.\nIf you like, I can make it so WM just checks your dev tool for new auth tokens every time.\n\nPress Cancel to continue entering auth codes manually.\n\n*If you have multiple facebook accounts on this computer using WM, please make sure you set up the API explorer with every account.";
				var saveProgress = confirm(m);
				if (saveProgress) {
					setOpt("flagManualAuthSuccessful",true);					
				}
			} 

			var G=Graph.fetchUser({callback:WM.init});
			
			if (G){if (G.requestAlreadyOut) {
			} else if (G.initRequestSlow) {
			} else if (G.olderLimitReached) {
			} else if (G.getAuthTokenFailed) {
			}}
			*/
			WM.init();
		}catch(e){log("WM.run: "+e);}}	

	};

	this.WM=WallManager;		
	
	//allow certain options to be seen outside of the WallManager object
	//graph extension is external but still calls on WM options if they exist
	this.opts=WM.opts;
	this.quickOpts=WM.quickOpts;

})();