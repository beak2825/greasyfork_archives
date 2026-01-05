// ==UserScript==
// @name          	WM Rules Manager Objects
// @namespace       MerricksdadWMRulesManagerObjects
// @description	This is the rules manager system which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.4
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

//***************************************************************************************************************************************
//***** Rules Manager Object
//***************************************************************************************************************************************
	WM.rulesManager = {
			
		rules:[],
		
		enabled:function(){return !WM.quickOpts.heartbeatDisabled;},

		init:function(params){try{
			params=(params||{});
			
			// build a kidsNode getter
			WM.rulesManager.__defineGetter__("kidsNode",function(){try{
				return $("wmPriorityBuilder");
			}catch(e){log("WM.rulesManager.kidsNode: "+e);}});

			//import rules
			WM.rulesManager.rules=[];
			var rulesIn=getOptJSON("priority3_"+WM.currentUser.profile)||{};
			var globalsIn=getOptJSON("priority3_global")||{};
			
			//detect early beta rule lists
			if (isObject(rulesIn)) for (var i in rulesIn){
				var rule=rulesIn[i];
				WM.rulesManager.rules.push( new WM.rulesManager.Rule(rule) );
				//don't bother with globals here
				
			//or use current version rule arrays
			} else if (isArrayAndNotEmpty(rulesIn)) for (var i=0,rule;(rule=rulesIn[i]);i++) {
				if (rule.isGlobal) {
					var glob=globalsIn[rule.uniqueID]||null;
					if (glob){
						var merge=mergeJSON(glob,rule);
						WM.rulesManager.rules.push( new WM.rulesManager.Rule(merge) );
						glob.alreadyUsed=true;
					} else {
						log("WM.rulesManager.init: Global rule missing, cannot merge");
					}
				} else {
					WM.rulesManager.rules.push( new WM.rulesManager.Rule(rule) );
				}
				
			}
			
			//import all globals not already accounted for
			for (var t in globalsIn) {
				var glob=globalsIn[t];
				//avoid already imported globals
				if (!glob.alreadyUsed){
					glob.uniqueID=t;
					glob.isGlobal=true;
					WM.rulesManager.rule.push( new WM.rulesManager.Rule(glob) );
				}
			}
			
			
		}catch(e){log("WM.rulesManager.init: "+e);}},
		
		//check to see if any rules match the post object
		doEvent:function(event,obj){
			//do nothing if disabled
			if (!WM.rulesManager.enabled) return;
			
			//log("WM.rulesManager.doEvent: event="+event+", post="+post.id);
			for (var r=0,rule;(rule=WM.rulesManager.rules[r]);r++){
				if (rule.enabled) (function(){rule.doEvent(event,obj);})();
			}
		},
		
		//convert a test (such as dynamic grab entry) to a rule
		ruleFromTest:function(test){
			//[{"id":"_h6qil21n","label":"new test","search":["body"],"find":["nothing"],"ret":"dynamic","kids":[{"id":"_h6qiw4zf","find":[]}],"appID":"102452128776","disabled":true}]
			//[{"enabled":true,"limit":0,"limitCount":0,"expanded":true,"validators":[{"search":["body"],"operand":"lessThan","find":"chipmunk"}],"actions":[{"event":"onIdentify","action":"setColor","params":"orange"}],"kids":[{"enabled":true,"limit":0,"limitCount":0,"expanded":true,"validators":[],"actions":[],"kids":[],"eggs":[]},{"enabled":true,"limit":0,"limitCount":0,"expanded":true,"validators":[],"actions":[],"kids":[],"eggs":[]}],"eggs":[{"enabled":true,"limit":0,"limitCount":0,"expanded":true,"validators":[],"actions":[],"kids":[],"eggs":[]},{"enabled":true,"limit":0,"limitCount":0,"expanded":true,"validators":[],"actions":[],"kids":[],"eggs":[]}]}]
			var ret={
				title:(test.label||test.title)||"Converted Dynamic Test",
				enabled:!(test.disabled||false),
				limit:0,
				limitCount:0,
				expanded:true,
				validators:function(){
					var ret=[];
					//add the initial validator
					ret.push({
						search:["appID"],
						operand:"equals",
						find:test.appID
					});
					//detect search/find method
					var method="basic";
					if (isArrayAndNotEmpty(test.subTests) && test.find.contains("{%1}")) method="subTests";
					if (exists(test.subNumRange) && test.find.contains("{%1}")) method="subNumRange";
					if (test.regex==true) method="regexp";
					if (method=="regexp") {
						//leave the expression just as it is
						ret.push({
							search:test.search||[],
							operand:"matchRegExp",
							find:test.find,
						});
					} else if (method=="basic") {
						//convert the test.find array into a regular espression
						ret.push({
							search:test.search||[],
							operand:"matchRegExp",
							find:arrayToRegExp(test.find),
						});
					} else if (method=="subTests") {
						//insert the subTests into the find insertion point as a regular expression
						//but make the rest of the find parameter not return if found
						var find=test.find;
						if (find.contains("{%1}")){
							find=find.split("{%1}");
							find=(find[0].length?("(?:"+find[0]+")"):"")+arrayToRegExp(test.subTests)+(find[1].length?("(?:"+find[1]+")"):"");
						}
						ret.push({
							search:test.search||[],
							operand:"matchRegExp",
							find:find
						});
					} else if (method=="subNumRange") {
						//insert the subNumRange into the find insertion point as a regular expression
						//but make the rest of the find parameter not return if found
						var numRange=("string"==typeof test.subNumRange)?test.subNumRange.split(","):[test.subNumRange.low,test.subNumRange.high];
						var find=test.find;
						if (find.contains("{%1}")){
							find=find.split("{%1}");
							find=(find[0].length?("(?:"+find[0]+")"):"")+integerRangeToRegExp({min:numRange[0],max:numRange[1]})+(find[1].length?("(?:"+find[1]+")"):"");
						}
						ret.push({
							search:test.search||[],
							operand:"matchRegExp",
							find:find
						});
					}
					return ret;
				}(),
				actions:[
					{
						event:"onIdentify",
						action:"setWhich",
						params:test.ret||"dynamic",
					}
				],
				kids:[],
				eggs:[],				
			};
			
			//convert children
			if (isArrayAndNotEmpty(test.kids)) {
				for (var k=0,kid;(kid=test.kids[k]);k++) {
					ret.kids.push(WM.rulesManager.ruleFromTest(kid));
				}
			}
			
			return ret;
		},
		
		//create a rule based on a specific post
		ruleFromPost:function(post){
			//create some data to get us started
			var rule={
				basedOn:post,
				title:"Based On: "+post.id,
				enabled:false, //start out not using this rule
				validators:[
					{search:["appID"],find:post.appID,operand:"equals"},
					{search:["title"],find:post.name,operand:"matchRegExp"},
					{search:["caption"],find:post.caption,operand:"matchRegExp"},
					{search:["desc"],find:post.description,operand:"matchRegExp"},
					{search:["link"],find:post.linkText,operand:"matchRegExp"},
				],
				actions:[
					{event:"onIdentify",action:"setWhich",params:"dynamic"}
				]
			};
			WM.rulesManager.rules.push(rule=new WM.rulesManager.Rule(rule));

			if (WM.opts.rulesJumpToNewRule){
				//jump to rule view
				WM.console.tabContainer.selectTab(3);
				//scroll to new rule
				rule.node.scrollIntoView();
			}
		},
		
		//copy all dynamics to new rules
		//does not destroy dynamics as they are converted
		convertDynamics:function(){
			var tests=WM.grabber.tests;
			if (isArrayAndNotEmpty(tests)) {
				for (var t=0,test;(test=tests[t]);t++){
					WM.rulesManager.rules.push( new WM.rulesManager.Rule( WM.rulesManager.ruleFromTest(test) ) );
				}
			}
		},

		//rest rule limits for all rules and their children
		resetAllLimits:function(params){
			params=params||{};
			var ask=WM.opts.rulesConfirmResetLimit;
			if (params.noConfirm || !ask || (ask && confirm("Reset Limit Counter?"))) {
				if (isArrayAndNotEmpty(WM.rulesManager.rules)) for (var r=0,rule;(rule=WM.rulesManager.rules[r]);r++) {
					rule.resetLimit({preventSave:true,resetChildren:true,noConfirm:true});
				}
				WM.rulesManager.saveRules();
			}
		},
		
		saveRules : function(){try{
			//pack rule objects
			var retRules=[];
			var retGlobal={};
			
			if (isArrayAndNotEmpty(WM.rulesManager.rules)) {
				for (var r=0,rule; (rule=WM.rulesManager.rules[r]);r++){
					if (!rule.isGlobal) {
						retRules.push(rule.saveableData);
					} else {
						//make a placeholder locally
						retRules.push({isGlobal:true, uniqueID:rule.uniqueID, enabled:rule.enabled, expanded:rule.expanded});
						//and save it globally
						var glob=rule.saveableData;
						glob.uniqueID=rule.uniqueID;
						retGlobal[rule.uniqueID]=glob;						
					}
				}
			}
			
			//save rules
			setOptJSON("priority3_"+WM.currentUser.profile,retRules);
			setOptJSON("priority3_global",retGlobal);
		}catch(e){log("WM.rulesManager.saveRules: "+e);}},	
		
		showData : function(){try{
			promptText(getOpt("priority3_"+WM.currentUser.profile),true);
		}catch(e){log("WM.rulesManager.showData: "+e);}},	

		newRule : function(p){try{
			var rule=new WM.rulesManager.Rule(p);
			WM.rulesManager.rules.push(rule);
			WM.rulesManager.saveRules(); 
		}catch(e){log("WM.rulesManager.newRule: "+e);}},

		importRule: function(){try{
			var params=prompt("Input rule data",null);
			if (params) {
				var convertedInput=JSON.parse(params);
				if (isArray(convertedInput)){
					for (var i=0;i<convertedInput.length;i++){
						WM.rulesManager.newRule(convertedInput[i]);
					}
				} else {
					WM.rulesManager.newRule(convertedInput);
				}
			}
		}catch(e){log("WM.rulesManager.importRule: "+e);}},

		toggleHeartbeat: function(){try{
			WM.quickOpts.heartbeatDisabled=!WM.quickOpts.heartbeatDisabled;
			with (WM.rulesManager.toggleHBNode) {
				className=className.swapWordB(WM.quickOpts.heartbeatDisabled,"oddOrange","oddGreen");
			}
			WM.saveQuickOpts();
			log(WM.quickOpts.heartbeatDisabled);
		}catch(e){log("WM.rulesManager.toggleHeartbeat: "+e);}},
	};
	
//***************************************************************************************************************************************
//***** Rules Manager Enums & Functions
//***************************************************************************************************************************************
	WM.rulesManager.ruleActions = {
		"addToFeeds":{name:"Add Poster To Feeds",toolTip:"Add the post's creator to your feeds manager. Can also be used with onFriend* events."}, 
		"appendLink":{name:"Append To Link",toolTip:"Add specific code to the end of the collection link.",hasParam:true,paramType:"textBox","default":""},
		"birth":{name:"Birth Eggs",toolTip:"Clone the egg children to this rule's level, without destroying this rule."}, 
		"cancelInterval":{name:"Cancel Interval",toolTip:"Destroy the repeating timer on this rule."},
		"cancelTimer":{name:"Cancel Timer",toolTip:"Destroy the timer on this rule."} ,
		"cleanPost":{name:"Clean Post",toolTip:"Remove the calling post from the collector."}, 
		"commentPost":{name:"Comment Post",toolTip:"Create a comment on the calling post.",hasParam:true,paramLabel:"comment",paramType:"string","default":"Thanks!"}, 
		"createInterval":{name:"Create Interval",toolTip:"Create a repeating timer on this rule, where 1000 equals 1 second.",hasParam:true,paramType:"timePicker","default":1000} ,
		"createTimer":{name:"Create Timer",toolTip:"Create a timer on this rule, where 1000 equals 1 second.",hasParam:true,paramType:"timePicker","default":1000},
		"decrementCounter":{name:"Decrement Limit Counter",toolTip:"Decrement the rule limit counter.",hasParam:true,paramType:"number","default":1},
		"decrementParentCounter":{name:"Decrement Parent Limit Counter",toolTip:"Decrement the parent rule limit counter.",hasParam:true,paramType:"number","default":1},
		"destroyRule":{name:"Destroy Rule",toolTip:"Permanently removes this rule and all of its children."},
		"disableApp":{name:"Disable App",toolTip:"Disable the specified app. Leave blank to disable the app associated with the activating post.",hasParam:true,paramType:"textBox","default":""},
		"disableAppOption":{name:"Disable App Option",toolTip:"Disable an option in the related sidekick by internal name.",hasParam:true,paramType:"textBox","default":""},
		"disableAutocomment":{name:"Disable Autocomment",toolTip:"Disable the autocomment feature."},
		"disableAutolike":{name:"Disable Autolike",toolTip:"Disable the autolike feature."},
		"disableChildRules":{name:"Disable Child Rules",toolTip:"Disable the immediate children of this rule. Does not disable this rule."},
		"disableHostOption":{name:"Disable Host Option",toolTip:"Disable an option in the wm host by internal name.",hasParam:true},
		"disableRule":{name:"Disable Rule",toolTip:"Disable the current rule."}, 
		"emergencyOpen":{name:"Emergency Open",toolTip:"Move the calling post directly to a new processing window, no matter what your opened window limit is."}, 
		"emptyAutolikeQueue":{name:"emptyAutolikeQueue",toolTip:"Destroys the list of posts you intended to autolike or autocomment."}, 
		"enableApp":{name:"Enable App",toolTip:"Enable the specified app. Leave blank to enable the app associated with the activating post.",hasParam:true,paramType:"textBox","default":""},
		"enableAppOption":{name:"Enable App Option",toolTip:"Enable an option in the related sidekick by internal name.",hasParam:true,paramType:"textBox","default":""},
		"enableAutocomment":{name:"Enable Autocomment",toolTip:"Enable the autocomment feature."},
		"enableAutolike":{name:"Enable Autolike",toolTip:"Enable the autolike feature."},
		"enableChildRules":{name:"Enable Child Rules",toolTip:"Enable the immediate children of this rule."}, 
		"enableHostOption":{name:"Enable Host Option",toolTip:"Enable an option in the wm host by internal name.",hasParam:true},
		"enableRule":{name:"Enable Rule",toolTip:"Enable the current rule."}, 
		"fetchVisiblePosts":{name:"Fetch Visible Posts",toolTip:"Fetch some more posts from those loaded to the page."}, 
		//"fetchNewer":{name:"Fetch Newer Posts",toolTip:"Fetch some more posts for this app, feed or feed filter."}, 
		//"fetchOlder":{name:"Fetch Older Posts",toolTip:"Fetch some more posts for this app, feed or feed filter."}, 
		//"fetchHours":{name:"Fetch Hours of Posts",toolTip:"Fetch some more posts for this app, feed or feed filter.",hasParam:true,paramType:"number","default":24}, 
		"forceOpen":{name:"Force Open",toolTip:"Move the calling post directly to the collector queue."}, 
		"forceOpenFirst":{name:"Force Open First",toolTip:"Move the calling post directly to the collector queue AND cut in line to be next processed."}, 
		"hatch":{name:"Hatch Eggs",toolTip:"Hatch the egg-children of the current rule, and destroy this rule."}, 
		"incrementCounter":{name:"Increment Limit Counter",toolTip:"Increment the rule limit counter.",hasParam:true,paramType:"number","default":1},
		"incrementParentCounter":{name:"Increment Parent Limit Counter",toolTip:"Increment the parent rule limit counter.",hasParam:true,paramType:"number","default":1},
		"likePost":{name:"Like Post",toolTip:"Like the calling post."}, 
		"openPostSource":{name:"Open Post Source",toolTip:"Opens the post source in a separate window/tab."},
		"processLast":{name:"Move To Bottom",toolTip:"Move the post to the bottom of the collector window."}, 
		"processFirst":{name:"Move To Top",toolTip:"Move the post to the top of the collector window."}, 
		"pauseAllApps":{name:"Pause All Apps",toolTip:"Pause all apps currently associated with docked sidekicks."}, 
		"pauseApp":{name:"Pause App",toolTip:"Pauses processing anything by this app.",hasParam:true,paramType:"textBox","default":""}, 
		"pauseWM.collector":{name:"Pause WM.collector",toolTip:"Pauses collection of all posts."}, 
		"pauseFetch":{name:"Pause Fetching",toolTip:"Pauses fetching of all posts."}, 
		"pauseType":{name:"Pause Type",toolTip:"Pause collection of all bonuses of this type."}, 
		"pinPost":{name:"Pin Post",toolTip:"Pins the calling post."}, //pin the post
		"queueCommentPost":{name:"Queue Comment Post",toolTip:"Comment on the calling post by first using the autolike queue system to delay the autocomment.",hasParam:true,paramLabel:"comment",paramType:"string","default":"Thanks!"},
		"queueLikePost":{name:"Queue Like Post",toolTip:"Like the calling post by first using the autolike queue system to delay the autolike."},
		"refreshBrowser":{name:"Refresh Browser",toolTip:"Reloads the browser window."}, 
		"reIDAll":{name:"ReID All",toolTip:"Re-ID all posts in the collector."},
		"removePriority":{name:"Remove Priority",toolTip:"Sets the priority of the calling post to normal."}, 
		"removePriorityApp":{name:"Remove Priority (App)",toolTip:"Sets the priority of all posts of the calling or specified app to normal.",hasParam:true,paramType:"textBox","default":""}, 
		"removePriorityType":{name:"Remove Priority (Type)",toolTip:"Sets the priority of all posts of the calling app with specified or associated type to normal.",hasParam:true,paramType:"textBox","default":"dynamic"}, 
		"resetAllLimits":{name:"Reset All Limit Counters",toolTip:"Reset all limits in the rules manager."},
		"resetLimit":{name:"Reset Limit Counter",toolTip:"Reset the limit counter of the current rule."},
		"resetBranchLimits":{name:"Reset Branch Limit Counters",toolTip:"Reset the limit counter of ALL rules that are lower in this branch (children, grandchildren, etc.). Does not reset the limit on this rule."},
		"resetChildrenLimits":{name:"Reset Children Limit Counters",toolTip:"Reset the limit counter of immediate child rules of this rule. Does not reset the limit on this rule."},
		"resetParentLimit":{name:"Reset Parent Limit Counter",toolTip:"Reset the limit counter of the parent rule."},
		"setAppOption":{name:"Set App Option",toolTip:"Set an option in the related sidekick by internal name.",hasParam:true,paramCount:2,paramData:[{paramType:"textBox","default":"",paramLabel:"Name"},{paramType:"textBox","default":"",paramLabel:"Value"}]},
		"setAppTab":{name:"Set App Tab",toolTip:"Set the current collection tab by app ID.",hasParam:true,paramType:"textBox","default":"all"},
		"setAsAccepted":{name:"Set As Accepted",toolTip:"Set the calling post as accepted.",hasParam:true,paramType:"checkBox",paramLabel:"saveToHistory","default":false},
		"setAsExcluded":{name:"Set As Excluded",toolTip:"Set the calling post as excluded."}, 
		"setAsFailed":{name:"Set As Failed",toolTip:"Set the calling post as failed.",hasParam:true,paramType:"checkBox",paramLabel:"saveToHistory","default":false},
		"setColor":{name:"Set Post Color",toolTip:"Set the background color of the calling post.",hasParam:true,paramType:"colorPicker","default":"blue"},
		"setHostOption":{name:"Set Host Option",toolTip:"Set the value a host option by internal name.",hasParam:true,paramCount:2,paramData:[{paramType:"textBox","default":"",paramLabel:"Name"},{paramType:"textBox","default":"",paramLabel:"Value"}]},
		"setPriority":{name:"Set Priority",toolTip:"Set the priority of the calling post.",hasParam:true,paramType:"number","default":50}, 
		"setPriorityApp":{name:"Set Priority (App)",toolTip:"Set the priority of the calling app or specified app.",hasParam:true,paramCount:2,paramData:[{paramType:"textBox",paramLabel:"App","default":""},{paramType:"number",paramLabel:"Priority","default":50}]}, 
		"setPriorityType":{name:"Set Priority (Type)",toolTip:"Set the priority of the calling post type or specified type for the same app.",hasParam:true,paramCount:2,paramData:[{paramType:"textBox",paramLabel:"Type Code","default":""},{paramType:"number",paramLabel:"Priority","default":50}]}, 
		"setToCollect":{name:"Set To Collect",toolTip:"Set the calling post to be collected in normal order. Use Force Open to do more immediate collection, or Emergency Open to override your opened window limit."},
		"setToCollectPriority1":{name:"Set To Collect Top Priority",toolTip:"Set the calling post to be collected and also set its priority to 1. Use Force Open to do more immediate collection, or Emergency Open to override your opened window limit."},
		"setWhich":{name:"Set Type",toolTip:"Set the bonus type id of the calling post.",hasParam:true,paramType:"textBox","default":"dynamic"},	
		"uncheckType":{name:"Uncheck Post Type",toolTip:"Unchecks option to collect this bonus in the options menu."},		
		"unpauseAllApps":{name:"Unpause All Apps",toolTip:"Unpause all apps currently associated with docked sidekicks."}, 
		"unpauseAllTypesAllApps":{name:"Unpause All Types",toolTip:"Unpause all bonus types by all apps."}, 
		"unpauseAllTypesByApp":{name:"Unpause All Types By App",toolTip:"Unpause all bonus types associated with the given app, or the app associated with the activating post.",hasParam:true,paramType:"textBox","default":""}, 
		"unpauseApp":{name:"Unpause App",toolTip:"Starts processing anything by this app.",hasParam:true,paramType:"textBox","default":""},		
		"unpauseWM.collector":{name:"Unpause WM.collector",toolTip:"Starts collection of posts."}, 
		"unpauseFetch":{name:"Unpause Fetching",toolTip:"Starts fetching of posts."}, 
		"unpauseType":{name:"Unpause Type",toolTip:"Unpause collection of all bonuses of this type."}, 
	};
	
	WM.rulesManager.ruleActionsCodes = {
		"addToFeeds":1,"appendLink":2,"birth":3,"cancelInterval":4,"cancelTimer":5,"cleanPost":6,"commentPost":7,"createInterval":8,"createTimer":9,
		"decrementCounter":10,"decrementParentCounter":11,"destroyRule":12,"disableApp":13,"disableAppOption":14,"disableAutolike":15,"disableChildRules":16,
		"disableHostOption":17,"disableRule":18,"emergencyOpen":19,"emptyAutolikeQueue":20,"enableApp":21,"enableAppOption":22,"enableAutolike":23,
		"enableChildRules":24,"enableHostOption":25,"enableRule":26,"fetchNewer":27,"fetchOlder":28,"forceOpen":29,"forceOpenFirst":30,"hatch":31,
		"incrementCounter":32,"incrementParentCounter":33,"likePost":34,"openPostSource":35,"processLast":36,"processFirst":37,"pauseAllApps":38,
		"pauseApp":39,"pauseWM.collector":40,"pauseFetch":41,"pauseType":42,"pinPost":43,"queueCommentPost":44,"queueLikePost":45,"refreshBrowser":46,
		"reIDAll":47,"removePriority":48,"removePriorityApp":49,"removePriorityType":50,"resetAllLimits":51,"resetLimit":52,"resetBranchLimits":53,
		"resetChildrenLimits":54,"resetParentLimit":55,"setAppOption":56,"setAppTab":57,"setAsAccepted":58,"setAsExcluded":59,"setAsFailed":60,"setColor":61,
		"setHostOption":62,"setPriority":63,"setPriorityApp":64,"setPriorityType":65,"setToCollect":66,"setToCollectPriority1":67,"setWhich":68,
		"uncheckType":69,"unpauseAllApps":70,"unpauseAllTypesAllApps":71,"unpauseAllTypesByApp":72,"unpauseApp":73,"unpauseWM.collector":74,"unpauseFetch":75,
		"unpauseType":76,"fetchHours":77,"enableAutocomment":78,"disableAutocomment":79,"fetchVisiblePosts":80
	};
	
	WM.rulesManager.ruleActionByCode = function(code){
		for (c in WM.rulesManager.ruleActionsCodes) {
			if (WM.rulesManager.ruleActionsCodes[c]==code) return c;
		}
		return null;
	};	
	
	WM.rulesManager.ruleEvents = {
		//post events
		"onIdentify":"Called after a post is (re)identified. Posts are first identified as soon as they are fetched.",
		"onBeforeCollect":"Called before collection opens a sidekick window.",
		"onAfterCollect":"Called after collection is tried. Activates regardless of return status.",
		"onFailed":"Called when a post is marked failed. This could be actual or simulated by the user.",
		"onAccepted":"Called when a post is marked accepted. This could be actual or simulated by the user.",
		"onTimeout":"Called when a post is marked as timed out. This could be actual or simulated by the user.",
		"onValidate":"Called when a post is first fetched, but after its first identification. Not called on posts which fail identification.",
		
		//rule events
		"onLimit":"Called when this rule limit counter equals the rule's limit.",
		"onHatch":"Called when this rule's egg children are hatched.",		
		"onTimer":"Called when the timer on this rule activates.",
		"onInterval":"Called when the repeating timer on this rule activates.",
		"onBirth":"Called when this rule's egg children are birthed.",
		"onRuleCreated":"Called when the rule is created (or loaded on startup).",
		"onRuleButtonClicked":"Called when the rule button is clicked. Available only for control rules.",
		
		//app events
		"onSidekickDock":"Called when the sidekick for this app docks.",
		"onSidekickReady":"Called when the sidekick for this app creates an app object, and after it appends the collection tab for that app.",
		/*
			paused/unpaused
			enabled/disabled
			failCountChanged
			acceptCountChanged
			
		*/
		
		//console events
		"onHeartbeat":"Called when the global heartbeat interval ticks.",
		"onSetAppFilter":"Called when the collection panel app tab changes, including at startup if 'Show All' is selected as default",
		
		//feed events
		"onFeedFilterOlderLimitReached":"Called when a specific feed filter reaches its user-defined older limit.",
		
	};
	
	WM.rulesManager.ruleEventsCodes ={
		"onIdentify":1,"onBeforeCollect":2,"onAfterCollect":3,"onFailed":4,"onAccepted":5,"onTimeout":6,"onValidate":7,"onLimit":8,"onHatch":9,"onTimer":10,
		"onInterval":11,"onBirth":12,"onRuleCreated":13,"onSidekickDock":14,"onSidekickReady":15,"onHeartbeat":16,"onSetAppFilter":17,
		"onFeedFilterOlderLimitReached":18,"onRuleButtonClicked":19
	};
	
	WM.rulesManager.ruleEventByCode = function(code){
		for (c in WM.rulesManager.ruleEventsCodes) {
			if (WM.rulesManager.ruleEventsCodes[c]==code) return c;
		}
		return null;
	};	
	
	WM.rulesManager.postParts = {
		"age":"The time between the current time and the post creation time (in ms).",
		"acceptCount":"An app's accept counter value. Friend objects also have an acceptCount.",
		"activatorType":"Returns the object type of the rule-activating object: app, post, rule, feed, feedfilter or unknown.",
		"alreadyProcessed":"Reports if a post has already created a history entry.",
		"appID":"The appID of the game for which a post belongs. You can read the appID from the following affected objects: app, post, and feedFilter.",
		"appName":"The appName of the game for which this post belongs, as reported by the FB database.",
		"body":"The body of a post is a compilation of the title, caption, and desc.",
		"canvas":"The canvas of a post is its namespace granted by FB, ie. FarmVille's namespace is 'onthefarm'.",
		"caption":"The caption of a post is one line just below its title (or 'name'). Not all posts have this field.",
		"commentorID":"The commentorID is a list of IDs of all commentors.",
		"commentorName":"The commentorName is a list of names of all commentors.",
		"comments":"The comments are list of all comments made to the post, excluding the initial msg.",
		"currentTime":"The current time (in ms) on your system, not localized. This global value can be referenced from any activating object type.",
		"currentAppTab":"The currently selected collection tab's appID, or the word 'all' if the 'Show All' tab is selected.",
		"date":"The date of a post is its creation time on FB, and is the 'created_time' parameter in fb data packets.",
		"desc":"The desc of a post is two lines below the title. This is the 'description' parameter in fb data packets. Not all posts have this field.",
		"either":"The either of a post is the compilation of the link and body.",
		"enabled":"The enabled state of an activating object.",
		"expanded":"The expanded state of an activating object.",
		"failCount":"An app's fail counter value. Friend objects also have a failCount.",
		"friendAcceptedCount":"Gets the accepted count from a FriendTracker friend object matching this post creator.",
		"friendFailedCount":"Gets the failed count from a FriendTracker friend object matching this post creator.",		
		"fromID":"The fromID is the ID of the poster.",
		"fromName":"The fromName is the name of the poster.",
		"fromNameLastFirst":"The name of the poster, displayed as Lastname, Firstname",
		"html":"The html of a post is the compilation of ALL visible FB attributes.",		
		"id":"Normally a post ID, which is usually the post creator's ID and a timestamp separated by an underscore. Alternately, you can ask for the id of an activating friend, feed or feed filter object.",
		"idText":"The identified link text of a post.",
		"img":"The img of a post is the url of the icon that displays with the post. This is the 'picture' parameter in fb data packets.",
		"isAccepted":"Reports if the post is set as having already been successfully collected.",
		"isAppPaused":"Reports if the associated app is paused.",
		"isCollect":"Reports if the post is set to be collected.",
		"isExcluded":"Reports if the post has been set as excluded.",
		"isFailed":"Reports if the post is set as having already failed.",
		"isForMe":"Reports if the W2W post targets the current user.",
		"isLiked":"Reports if the post has been identified as already being liked by the current user.",
		"isMyPost":"Reports if the post belongs to the current user.",
		"isPaused":"Reports if the calling object (post or app) is paused. Not specific!",
		"isPinned":"Reports if the post is marked as being pinned.",
		"isRemovable":"Reports if a feed is removeable. Your own profile wall and your home feed are not removeable, only disableable.",
		"isTimeout":"Reports if the post has been marked as a timed out collection attempt.",
		"isTypePaused":"Reports if the associated bonus type is paused.",
		"isScam":"Reports if a post is suspected of being a scam, usually when the canvas and appName do not match.",
		"isStale":"Reports if a post is older than the user-set older limit.",
		"isUndefined":"Reports if the post does not match any id given by the sidekick.",
		"isWishlist":"Reports if the post is deemed a whichlist request.",
		"isWorking":"Reports if the post is currently in the working state (being processed).",
		"isW2W":"Reports if the post is a Wall-To-Wall post, meaning that it was posted to a specific user's wall.",
		"lastKnownPostDate":"A friend object's last known post date (as unix time, no millisecond data).",
		"likeID":"The likeID is a list of IDs of users who liked the post.",
		"likeName":"The likeName is a list of names of users who liked this post.",
		"limit":"This rule's limit number.",
		"limitCount":"This rule's limit counter.",
		"link":"The 'link' of a post is the link text, not the url. This is the 'action.name' in fb data packets.",
		"linkHref":"The original url as it appeared from facebook. This SHOULD be exactly the same as 'url'.",
		"linkText":"The original link text as it appeared from facebook. You may want to NOT use 'link' and instead use this one.",
		"msg":"The msg of a post is the part the poster added as a comment during the post's creation.",
		"name":"With posts, this is the same as 'title', because its the FB name of a post object. With friend objects, this is the friend's text name.",
		"parentLimit":"The parent rule's limit number, or NULL if no parent exists.",
		"parentLimitCount":"The parent rule's limit counter, or NULL if no parent exists.",
		"postCount":"A friend object's count of posts it is tracking.",
		"postedDay":"A partial date-time value containing only the year/month/day portions, which corresponds to the post creation time.",
		"postedHour":"A partial date-time value containing only the year/month/day/hour portions, which corresponds to the post creation time.",
		"priority":"The priority of a post which could have been set by a rule, or by default of 50.",
		"status":"The status of a post is the return code given by a sidekick, or 0 if it has not been processed.",
		"targetID":"The targetID is a list of targets' IDs that the poster intended the post to display to.",
		"targetName":"The targetName is a list of targets the poster intended the post to display to.",
		"title":"The title of a post contains the bold text, usually including the poster's name, at the top of the post. This is the 'name' parameter in facebook data packets.",
		"totalCount":"An app's failcount and acceptcount combined. Friend objects also have a totalCount.",
		"typesPaused":"An app's list of paused bonus types. Only accessible from an activating post. Please stick to the contains/notContains operators because this is an array, not text.",
		"url":"The url of a post is the address to which the post redirects the user when clicked. This is the 'link' or 'action.link' parameter in fb data packets. This is the original url supplied by the app, not a modified url, such as WM's removal of https or a sidekick-modified url. Alternately, you can ask for the URL of a feed object.",
		"which":"The 'which' of a post is its identified codename that defines its bonus type and ties it to option menu entries. The codename starts with an appID and ends with something the sidekick developer uses to key the bonus type.",
		"whichText":"Text associated with this bonus type.",
	};
	
	WM.rulesManager.postPartsCodes = {
		"age":1,"acceptCount":2,"activatorType":3,"alreadyProcessed":4,"appID":5,"appName":6,"body":7,"canvas":8,"caption":9,"commentorID":10,
		"commentorName":11,"comments":12,"currentTime":13,"currentAppTab":14,"date":15,"desc":16,"either":17,"enabled":18,"expanded":19,"failCount":20,
		"fromID":21,"fromName":22,"fromNameLastFirst":23,"html":24,"id":25,"idText":26,"img":27,"isAccepted":28,"isAppPaused":29,"isCollect":30,
		"isExcluded":31,"isFailed":32,"isForMe":33,"isLiked":34,"isMyPost":35,"isPaused":36,"isPinned":37,"isRemovable":38,"isTimeout":39,"isTypePaused":40,
		"isScam":41,"isStale":42,"isUndefined":43,"isWishlist":44,"isWorking":45,"isW2W":46,"lastKnownPostDate":47,"likeID":48,"likeName":49,"limit":50,
		"limitCount":51,"link":52,"linkHref":53,"linkText":54,"msg":55,"name":56,"parentLimit":57,"parentLimitCount":58,"postCount":59,"postedDay":60,
		"postedHour":61,"priority":62,"status":63,"targetID":64,"targetName":65,"title":66,"totalCount":67,"typesPaused":68,"url":69,"which":70,
		"whichText":71,"friendAcceptedCount":72,"friendFailedCount":73
	};
	
	WM.rulesManager.postPartByCode = function(code){
		for (c in WM.rulesManager.postPartsCodes) {
			if (WM.rulesManager.postPartsCodes[c]==code) return c;
		}
		return null;
	};
	
	WM.rulesManager.ruleOperands = {
		"equals":"Property and query must match.",
		"notEquals":"Property and query must not match.",
		"startsWith":"Property must start with query value.",
		"notStartsWith":"Property cannot start with query value.",
		"endsWith":"Property must end with query value.",
		"notEndsWith":"Property cannot end with query value.",
		"contains":"Property contains anywhere the query value.",
		"notContains":"Property does not contain the query value.",
		"matchRegExp":"Property must match the registered expression.", 
		"notMatchRegExp":"Property must not match the registered expression.",
		"greaterThan":"Property must be greater than query value.",
		"lessThan":"Property must be less than query value.",
		"greaterThanOrEquals":"Property must be greater than or equal to query value.",
		"lessThanOrEquals":"Property must be less than or equal to query value.",

		"equalsExactly":"Property and query must match exactly via binary comparison.",
		"notEqualsExactly":"Property and query must not match exactly via binary comparison.",
		
	};

	WM.rulesManager.ruleOperandsCodes = {
		"equals":1,
		"notEquals":2,
		"startsWith":3,
		"notStartsWith":4,
		"endsWith":5,
		"notEndsWith":6,
		"contains":7,
		"notContains":8,
		"matchRegExp":9, 
		"notMatchRegExp":10,
		"greaterThan":11,
		"lessThan":12,
		"greaterThanOrEquals":13,
		"lessThanOrEquals":14,
		"equalsExactly":15,
		"notEqualsExactly":16,
		
	};	
	
	WM.rulesManager.ruleOperandByCode = function(code){
		for (c in WM.rulesManager.ruleOperandsCodes) {
			if (WM.rulesManager.ruleOperandsCodes[c]==code) return c;
		}
		return null;
	};	
	
//***************************************************************************************************************************************
//***** RuleValidator Class
//***************************************************************************************************************************************
	WM.rulesManager.RuleValidator = function(params){try{
		var isNew=(!exists(params));
		var self=this;
	
		//return saveable data from this branch
		this.__defineGetter__("saveableData",function(){try{
			var s=self.search, modSearch=[]; //use a second array to avoid accidental overwrite of first byRef
			for (var c=0;c<s.length;c++){
				modSearch.push(WM.rulesManager.postPartsCodes[s[c]]);
			}
			var ret = {search:modSearch, operand:WM.rulesManager.ruleOperandsCodes[self.operand], find:self.find}
			return ret;
		}catch(e){log("WM.rulesManager.RuleValidator.saveableData: "+e);}});

		//remove this from parent
		this.remove=function(){try{
			var ask=WM.opts.rulesConfirmDeleteValidator;
			if (!ask || (ask && confirm("Delete rule validator?"))){
				remove(this.node);
				this.parent.validators.removeByValue(this);
				doAction(WM.rulesManager.saveRules);
			}
		}catch(e){log("WM.rulesManager.RuleValidator.remove: "+e);}};
	
		this.moveUp=function(){try{
			//where is this
			var parentContainer = this.parent.validators;
			//only affects items not already the first in the list
			//and not the only child in the list
			if ((parentContainer.length>1) && (parentContainer[0]!=this)) {
				//which index is this?
				var myIndex=parentContainer.inArrayWhere(this);
				if (myIndex != -1) {
					//I have a proper index here
					//who is my sibling
					var sibling = parentContainer[myIndex-1];
					//swap me with my sibling
					parentContainer[myIndex-1]=this;
					parentContainer[myIndex]=sibling;
					//place my node before my sibling node
					sibling.node.parentNode.insertBefore(this.node,sibling.node);
					//save it
					WM.rulesManager.saveRules();
				}
			}
		}catch(e){log("WM.rulesManager.RuleValidator.moveUp: "+e);}};

		//move down in the list
		this.moveDown=function(){try{
			//where is this
			var parentContainer = this.parent.validators;
			//only affects items not already the first in the list
			//and not the only child in the list
			if ((parentContainer.length>1) && (parentContainer.last()!=this)) {
				//which index is this?
				var myIndex=parentContainer.inArrayWhere(this);
				if (myIndex != -1) {
					//I have a proper index here
					//who is my sibling
					var sibling = parentContainer[myIndex+1];
					//swap me with my sibling
					parentContainer[myIndex+1]=this;
					parentContainer[myIndex]=sibling;
					//place my node before my sibling node
					sibling.node.parentNode.insertBefore(sibling.node,this.node);
					//save it
					WM.rulesManager.saveRules();
				}
			}
		}catch(e){log("WM.rulesManager.RuleValidator.moveDown: "+e);}};

		//copy this validator on the parent
		this.clone=function(){try{
			this.parent.addValidator({search:this.search, operand:this.operand, find:this.find});
			WM.rulesManager.saveRules();
		}catch(e){log("WM.rulesManager.RuleValidator.clone: "+e);}};

		//init
		//this.id=params.id||unique();
		this.parent=params.parent||null;
		if (!this.parent) {
			log("WM.rulesManager.RuleValidator: no parent specified: abort init");
			return null;
		}
		//this.validationNode=parent.validationNode;
		this.search=params.search||["appID"];
		if (!isArray(this.search)) this.search=[].push(this.search);
		//convert number codes to text commands
		for (var e in this.search) {
			//t=this.search[e];
			if (isNumber(this.search[e])) this.search[e]=WM.rulesManager.postPartByCode(this.search[e]);
			//log([this.search[e],t])
		}
		this.operand=params.operand||"matchRegExp";
		if (isNumber(this.operand)) this.operand=WM.rulesManager.ruleOperandByCode(this.operand);
		this.find=params.find||"";
				
		//draw it
		this.parent.validationNode.appendChild(this.node=createElement("div",{className:"validator"},[
			//search portion for this validator
			createElement("div",{className:"line"},[
				this.searchNode=(this.objSearch=new jsForms.comboBox({
					className:"jsfComboBox selectPostPart",
					onChange:function(){
						self.search=this.value;
						WM.rulesManager.saveRules();
					},
					items:(function(){
						var ret=[];
						for (var i in WM.rulesManager.postParts){
							ret.push(new jsForms.checkBox({
								text:i,
								value:i,
								toolTipText:WM.rulesManager.postParts[i],
								checked:(self.search.inArray(i)),
								size:{width:"200%"},
							}));
						}
						return ret;
					})(),
					borderStyle:"none",
					//borderRadius:{topLeft:"1px", bottomRight:"1px",topRight:"1px",bottomLeft:"1px"},
					//explicitClose:true,
					highlightSelected:true,					
					dropDownSize:{height:"200px"},
					backColor:"#EEEEEE",
				})).node,
							
				//operator portion for this validator
				this.operandNode=createElement("select",{className:"selectOperand",onchange:function(){self.operand=this.value;WM.rulesManager.saveRules();}},(function(){
					var ret=[],elem;
					for (var i in WM.rulesManager.ruleOperands){
						ret.push(elem=createElement("option",{textContent:i,value:i,title:WM.rulesManager.ruleOperands[i]}));
						if (i==self.operand) elem.selected=true;
					}
					return ret;
				})()),
				//find portion for this validator
				/*
					right here we need to bring up an element based on
						the post part chosen
					for most cases, we just need an input box to accept string values
					for special case "which" we need a dropdown of bonus types
					for boolean flags we need a default value of true and maybe 
						some kind of limitation to true and false in the box
				*/
				this.findNode=createElement("input",{className:"findBox",value:this.find,onchange:function(){self.find=this.value;WM.rulesManager.saveRules();}}),
				//toolbox
				createElement("div",{className:"littleButton oddOrange",onclick:function(){self.remove();},title:"Delete Validator"},[
					createElement("img",{className:"resourceIcon trash"+WM.opts.littleButtonSize}),
				]),
				createElement("div",{className:"littleButton oddBlue",onclick:function(){self.clone();},title:"Clone Validator"},[
					createElement("img",{className:"resourceIcon clone"+WM.opts.littleButtonSize}),
				]),
				createElement("div",{className:"littleButton oddGreen",onclick:function(){self.moveUp();},title:"Move Up"},[
					createElement("img",{className:"resourceIcon arrowUp"+WM.opts.littleButtonSize}),
				]),
				createElement("div",{className:"littleButton oddOrange",onclick:function(){self.moveDown();},title:"Move Down"},[
					createElement("img",{className:"resourceIcon arrowDown"+WM.opts.littleButtonSize}),
				]),
				(self.parent.basedOn)?createElement("div",{className:"indent littleButton oddBlue",onclick:function(){
					//if a validator search array exists
					if (isArrayAndNotEmpty(self.search)){
						//fill the 'find' box with the post data linked to the search terms
						var f="";
						var post=self.parent.basedOn;
						for (var s=0;s<self.search.length;s++){
							if (s>0) f+=" ";
							f+=(post.testData[self.search[s]]||post[self.search[s]]||"");
						}
						self.findNode.value=f;
						self.find=f;
						WM.rulesManager.saveRules();
					}
				},title:"Capture Text From Linked Post"},[
					createElement("img",{className:"resourceIcon importData"+WM.opts.littleButtonSize}),
				]):null,
			]),
		]));
		
		//if (isNew) WM.rulesManager.saveRules();
		return self;
	}catch(e){log("WM.rulesManager.RuleValidator.init(): "+e);}};

//***************************************************************************************************************************************
//***** RuleAction Class
//***************************************************************************************************************************************
	WM.rulesManager.RuleAction = function(params){try{
		var isNew=(!exists(params));
		var self=this;
	
		//return saveable data from this branch
		this.__defineGetter__("saveableData",function(){try{
			var a= {event:WM.rulesManager.ruleEventsCodes[this.event], action:WM.rulesManager.ruleActionsCodes[this.action]};
			if (this.hasParam) a.params=this.params;
			if (this.paramCount==2) a.params2=this.params2;
			return a;
		}catch(e){log("WM.rulesManager.RuleAction.saveableData: "+e);}});

		//remove this from parent
		this.remove=function(){try{
			var ask=WM.opts.rulesConfirmDeleteAction;
			if (!ask || (ask && confirm("Delete rule action?"))){
				remove(this.node);
				this.parent.actions.removeByValue(this);
				doAction(WM.rulesManager.saveRules);
			}
		}catch(e){log("WM.rulesManager.RuleAction.remove: "+e);}};
	
		//move up in the list
		this.moveUp=function(){try{
			//where is this
			var parentContainer = this.parent.actions;
			//only affects items not already the first in the list
			//and not the only child in the list
			if ((parentContainer.length>1) && (parentContainer[0]!=this)) {
				//which index is this?
				var myIndex=parentContainer.inArrayWhere(this);
				if (myIndex != -1) {
					//I have a proper index here
					//who is my sibling
					var sibling = parentContainer[myIndex-1];
					//swap me with my sibling
					parentContainer[myIndex-1]=this;
					parentContainer[myIndex]=sibling;
					//place my node before my sibling node
					sibling.node.parentNode.insertBefore(this.node,sibling.node);
					//save it
					WM.rulesManager.saveRules();
				}
			}
		}catch(e){log("WM.rulesManager.RuleAction.moveUp: "+e);}};

		//move down in the list
		this.moveDown=function(){try{
			//where is this
			var parentContainer = this.parent.actions;
			//only affects items not already the first in the list
			//and not the only child in the list
			if ((parentContainer.length>1) && (parentContainer.last()!=this)) {
				//which index is this?
				var myIndex=parentContainer.inArrayWhere(this);
				if (myIndex != -1) {
					//I have a proper index here
					//who is my sibling
					var sibling = parentContainer[myIndex+1];
					//swap me with my sibling
					parentContainer[myIndex+1]=this;
					parentContainer[myIndex]=sibling;
					//place my node before my sibling node
					sibling.node.parentNode.insertBefore(sibling.node,this.node);
					//save it
					WM.rulesManager.saveRules();
				}
			}
		}catch(e){log("WM.rulesManager.RuleAction.moveDown: "+e);}};

		//copy this validator on the parent
		this.clone=function(){try{		
			this.parent.addAction(this.saveableData());
			WM.rulesManager.saveRules();
		}catch(e){log("WM.rulesManager.RuleAction.clone: "+e);}};

		//init
		//this.id=params.id||unique();
		this.parent=params.parent||null;
		if (!this.parent) {
			log("WM.rulesManager.RuleAction: no parent specified: abort init");
			return null;
		}
		//this.actionsNode=parent.actionsNode;
		this.action=params.action||"incrementCounter";
		//log(this.action);
		if (isNumber(this.action)) this.action=WM.rulesManager.ruleActionByCode(this.action);
		this.event=params.event||"onAccepted";
		if (isNumber(this.event)) this.event=WM.rulesManager.ruleEventByCode(this.event);
		
		//setup default values and param types
		//log(this.action);
		var def=WM.rulesManager.ruleActions[this.action];
		this.hasParam = def.hasParam;
		this.params = params.params||def["default"]||((def.paramData||null)?def.paramData[0]["default"]:"");
		this.params2 = params.params2||((def.paramData||null)?def.paramData[1]["default"]:"");
		this.paramCount = def.paramCount;
		
		//draw it
		this.parent.actionsNode.appendChild(this.node=createElement("div",{className:"action"},[
			//event for this action
			createElement("div",{className:"line"},[
				this.eventNode=createElement("select",{className:"selectEvent",onchange:function(){self.event=this.value; if (self.event=="onRuleButtonClicked") {self.parent.ruleButtonHousingNode.style.display="";} else {self.parent.ruleButtonHousingNode.style.display="none";}; WM.rulesManager.saveRules();}},(function(){
					var actioneventsret=[],elem;
					for (var i in WM.rulesManager.ruleEvents){
						actioneventsret.push(elem=createElement("option",{textContent:i,value:i,title:WM.rulesManager.ruleEvents[i]}));
						if (i==self.event) elem.selected=true;
					}
					return actioneventsret;
				})()),
				//function to call on the event
				this.actionNode=createElement("select",{className:"selectFunction",onchange:function(){
					self.action=this.value;
					WM.rulesManager.saveRules();
					//set the param type
					var action = WM.rulesManager.ruleActions[this.value];
					self.paramNode.style.display=((action.hasParam)?"":"none");
					self.param2Node.style.display=((action.hasParam && (action.paramCount==2))?"":"none");		

				}},(function(){
					var actionfuncsret=[],elem;
					for (var i in WM.rulesManager.ruleActions){
						entry=WM.rulesManager.ruleActions[i];
						actionfuncsret.push(elem=createElement("option",{textContent:entry.name,value:i,title:entry.toolTip}));
						if (i==self.action) elem.selected=true;
					}
					return actionfuncsret;
				})()),
				//this is for special cases only and should be hidden otherwise
				this.paramNode=createElement("input",{className:"paramBox",value:this.params,onchange:function(){self.params=this.value;WM.rulesManager.saveRules();}}),
				this.param2Node=createElement("input",{className:"paramBox",value:this.params2,onchange:function(){self.params2=this.value;WM.rulesManager.saveRules();}}),
				
				//toolbox
				createElement("div",{className:"littleButton oddOrange",onclick:function(){self.remove();},title:"Delete Action"},[
					createElement("img",{className:"resourceIcon trash"+WM.opts.littleButtonSize}),
				]),
				createElement("div",{className:"littleButton oddBlue",onclick:function(){self.clone();},title:"Clone Action"},[
					createElement("img",{className:"resourceIcon clone"+WM.opts.littleButtonSize}),
				]),
				createElement("div",{className:"littleButton oddGreen",onclick:function(){self.moveUp();},title:"Move Up"},[
					createElement("img",{className:"resourceIcon arrowUp"+WM.opts.littleButtonSize}),
				]),
				createElement("div",{className:"littleButton oddOrange",onclick:function(){self.moveDown();},title:"Move Down"},[
					createElement("img",{className:"resourceIcon arrowDown"+WM.opts.littleButtonSize}),
				]),

			]),
		]));	
		
		//hide param node when not used
		self.paramNode.style.display=((self.hasParam)?"":"none");
		self.param2Node.style.display=((self.hasParam && (self.paramCount==2))?"":"none");		

		//if (isNew) WM.rulesManager.saveRules();
		return self;
	}catch(e){log("WM.rulesManager.RuleAction.init(): "+e);}};

//***************************************************************************************************************************************
//***** Rule Class
//***************************************************************************************************************************************
	WM.rulesManager.Rule = function(params){try{
		this.objType="rule";
		var self=this;
		params=params||{};

		//set defaults
		this.parent=null;
		this.enabled=true;
		this.kids=[]; //child nodes
		this.eggs=[]; //hatchable child nodes
		this.actions=[]; //events:actions list
		this.validators=[]; //search:find list
		this.limitCount=0; 
		this.limit=0;
		this.actionsNode=null;
		this.validationNode=null;
		this.node=null;
		this.isChild=false;
		this.isEgg=false;
		this.expanded=true;		
		this.timers={};
		this.intervals={};
		this._isGlobal=false;
		
		//return savable data from this branch
		this.__defineGetter__("saveableData",function(){try{
			var ret={};
			
			//ret.id=this.id;
			ret.title=this.title;
			ret.enabled=this.enabled;
			ret.limit=this.limit;
			ret.limitCount=this.limitCount;
			//ret.level=this.level;
			ret.expanded=this.expanded;
			
			ret.validators=[];
			if (isArrayAndNotEmpty(this.validators)) for (var i=0,validator;(validator=this.validators[i]);i++) {
				ret.validators.push(validator.saveableData);
			}
			
			ret.actions=[];
			if (isArrayAndNotEmpty(this.actions)) for (var i=0,action;(action=this.actions[i]);i++) {
				ret.actions.push(action.saveableData);
			}
			
			ret.kids=[];
			if (isArrayAndNotEmpty(this.kids)) for (var i=0,kid;(kid=this.kids[i]);i++) {
				ret.kids.push(kid.saveableData);
			}
			
			ret.eggs=[];
			if (isArrayAndNotEmpty(this.eggs)) for (var i=0,egg;(egg=this.eggs[i]);i++) {
				ret.eggs.push(egg.saveableData);
			}
			
			return ret;
		}catch(e){log("WM.rulesManager.Rule.saveableData: "+e);}});		

		//set/get wether this rule is saved as global or profile
		this.__defineGetter__("isGlobal",function(){try{
			return self._isGlobal;
		}catch(e){log("WM.rulesManager.Rule.isGlobal: "+e);}});
		this.__defineSetter__("isGlobal",function(v){try{
			//only top level rule can be global
			if (self.parent) {
				confirm("Only top level rule can be set to global.");
				return;
			} 
			
			if (!v) {
				if (!confirm("Disabling profile sharing on this rule will prevent other users on this machine from loading it. Are you sure you wish to make this rule locally available only?")) return;
			}
		
			self._isGlobal=v;
			
			//make sure we have a uniqueID
			//but don't destroy one that already exists
			if (v && !exists(self.uniqueID)) self.uniqueID = unique();
			
			//change the color/icon of the isGlobal button
			if (self.toggleGlobalButton) {
				var s=WM.opts.littleButtonSize;
				with (self.toggleGlobalButton) className=className.swapWordB(v,"removeGlobal"+s,"addGlobal"+s);
				with (self.toggleGlobalButton.parentNode) {
					className=className.swapWordB(v,"oddOrange","oddGreen");
					title=(v)?"Disable Profile Sharing":"Share With Other Profiles";
				}
			}
		}catch(e){log("WM.rulesManager.Rule.isGlobal: "+e);}});
		
		this.__defineGetter__("parentLimit",function(){try{
			if (self.parent||null) return self.parent.limit;
			return null;
		}catch(e){log("WM.rulesManager.Rule.parentLimit: "+e);}});

		this.__defineGetter__("isBranchDisabled",function(){try{
			var p=self.parent,ret=false;
			while(p) {
				if (!p.enabled) return true;
				p=p.parent;
			}
			return false;
		}catch(e){log("WM.rulesManager.Rule.isBranchDisabled: "+e);}});

		this.__defineGetter__("parentLimitCount",function(){try{
			if (self.parent||null) return self.parent.limitCount;
			return null;
		}catch(e){log("WM.rulesManager.Rule.parentLimitCount: "+e);}});

		//copy passed params to this object
		for (var p in params) {
			//omit specific params
			if (!(["actions","validators","kids","eggs"].inArray(p)) ) {
				//copy only params that make it past the checker
				this[p]=params[p];
			}
		}
		
		this.usesRuleButton=function(){
			for (var action in this.actions) {
				if (action.event=="onRuleButtonClicked") {return true;}
			}
			return false;
		};
		
		this.moveUp=function(){try{
			//where is this
			var parentContainer = 
				(this.isChild)?this.parent.kids:
				(this.isEgg)?this.parent.eggs:
				WM.rulesManager.rules;
			//only affects items not already the first in the list
			//and not the only child in the list
			if ((parentContainer.length>1) && (parentContainer[0]!=this)) {
				//which index is this?
				var myIndex=parentContainer.inArrayWhere(this);
				if (myIndex != -1) {
					//I have a proper index here
					//who is my sibling
					var sibling = parentContainer[myIndex-1];
					//swap me with my sibling
					parentContainer[myIndex-1]=this;
					parentContainer[myIndex]=sibling;
					//place my node before my sibling node
					sibling.node.parentNode.insertBefore(this.node,sibling.node);
					//save it
					WM.rulesManager.saveRules();
				}
			}
		}catch(e){log("WM.rulesManager.Rule.moveUp: "+e);}};
		
		this.moveDown=function(){try{
			//where is this
			var parentContainer = 
				(this.isChild)?this.parent.kids:
				(this.isEgg)?this.parent.eggs:
				WM.rulesManager.rules;
			//only affects items not already the last in the list
			//and not the only child in the list
			if ((parentContainer.length>1) && (parentContainer.last()!=this)) {
				//which index is this?
				var myIndex=parentContainer.inArrayWhere(this);
				if (myIndex != -1) {
					//I have a proper index here
					//who is my sibling
					var sibling = parentContainer[myIndex+1];
					//swap me with my sibling
					parentContainer[myIndex+1]=this;
					parentContainer[myIndex]=sibling;
					//place my node before my sibling node
					sibling.node.parentNode.insertBefore(sibling.node,this.node);
					//save it
					WM.rulesManager.saveRules();
				}
			}
		}catch(e){log("WM.rulesManager.Rule.moveDown: "+e);}};

		this.moveUpLevel=function(){try{
			if (this.parent) {
				//this is not a top level node, so we can move it
				var targetContainer=((this.parent.parent)?this.parent.parent.kids:WM.rulesManager.rules);
				//remove from parent
				this.parent[(this.isChild)?"kids":(this.isEgg)?"eggs":null].removeByValue(this);
				//set new parent
				this.parent=(this.parent.parent||null); //never point to the top level
				//set flags
				this.isChild=(this.parent!=null);
				this.isEgg=false;
				//move the object
				targetContainer.push(this);
				//move the node
				if (this.parent) this.parent.kidsNode.appendChild(this.node);
				else WM.console.priorityBuild.appendChild(this.node);
				
				//save it
				WM.rulesManager.saveRules();
			}
		}catch(e){log("WM.rulesManager.Rule.moveUpLevel: "+e);}};
		
		this.moveDownLevel=function(){try{
			//where is this
			var parentContainer = 
				(this.isChild)?this.parent.kids:
				(this.isEgg)?this.parent.eggs:
				WM.rulesManager.rules;
			//create a new rule at my level
			var newRule = new WM.rulesManager.Rule({
				parent:this.parent||null,
				isChild:this.isChild,
				isEgg:this.isEgg,
			});
			parentContainer.push(newRule);
			//remove me from my current parent
			parentContainer.removeByValue(this);
			//attach me to my new parent
			this.parent=newRule;
			this.isChild=true;
			this.isEgg=false;
			newRule.kids.push(this);
			//move my node
			newRule.kidsNode.appendChild(this.node);
			//save it
			WM.rulesManager.saveRules();			
		}catch(e){log("WM.rulesManager.Rule.moveDownLevel: "+e);}};

		this.enable=function(){try{
			this.enabled=true;
			this.node.className=this.node.className.removeWord("disabled");
			WM.rulesManager.saveRules();
		}catch(e){log("WM.rulesManager.Rule.enable: "+e);}};

		this.disable=function(){try{
			this.enabled=false;
			this.node.className=this.node.className.addWord("disabled");
			WM.rulesManager.saveRules();
		}catch(e){log("WM.rulesManager.Rule.disable: "+e);}};

		this.disableChildren=function(){try{
			if (isArrayAndNotEmpty(this.kids)) for (var k=0,kid;(kid=this.kids[k]);k++){
				kid.disable();
			}			
		}catch(e){log("WM.rulesManager.Rule.disableChildren: "+e);}};

		this.enableChildren=function(){try{
			if (isArrayAndNotEmpty(this.kids)) for (var k=0,kid;(kid=this.kids[k]);k++){
				kid.enable();
			}			
		}catch(e){log("WM.rulesManager.Rule.enableChildren: "+e);}};
		
		this.toggle=function(){try{
			//if(this.enabled)this.disable(); else this.enable();
			
			//this.enabled=!this.enabled;
			this.enabled=this.toggleNode.checked;
			this.node.className=this.node.className.swapWordB(this.enabled,"enabled","disabled");
			WM.rulesManager.saveRules();
			//this.toggleNode.checked=();

		}catch(e){log("WM.rulesManager.Rule.toggle: "+e);}};

		this.clone=function(){try{
			var cloneRule=this.saveableData;
			//cloneRule.id=unique();
			if (this.isChild) this.parent.addChild(cloneRule);
			else if (this.isEgg) this.parent.addEgg(cloneRule);
			else WM.rulesManager.newRule(cloneRule);
		}catch(e){log("WM.rulesManager.RuleAction.clone: "+e);}};

		this.resetLimit=function(params){try{
			params=params||{};
			var ask=WM.opts.rulesConfirmResetLimit;
			if (params.noConfirm || !ask || (ask && confirm("Reset Limit Counter?"))) {
				this.limitCount=0;
				this.limitCounterNode.value=this.limitCount;
				if (!(params.resetChildren||false)) {
					if (isArrayAndNotEmpty(this.kids)) for (var k=0,kid;(kid=this.kids[k]);k++){
						kid.resetLimit(params);
					}
				}
				if (!(params.preventSave||false)) WM.rulesManager.saveRules();
			}
		}catch(e){log("WM.rulesManager.Rule.resetLimit: "+e);}};
		
		this.resetBranchLimits=function(params){try{
			params=params||{};
			//resets the limits of entire branch rules, but not self limit
			if (isArrayAndNotEmpty(this.kids)) for (var k=0,kid;(kid=this.kids[k]);k++){
				kid.resetLimit({resetChildren:true,noConfirm:params.noConfirm||false});
			}
		}catch(e){log("WM.rulesManager.Rule.resetBranchLimits: "+e);}};

		this.resetChildrenLimits=function(params){try{
			params=params||{};
			//resets the limits of all immediate children, but not self limit
			if (isArrayAndNotEmpty(this.kids)) for (var k=0,kid;(kid=this.kids[k]);k++){
				kid.resetLimit({noConfirm:params.noConfirm||false});
			}
		}catch(e){log("WM.rulesManager.Rule.resetChildrenLimits: "+e);}};

		this.incrementLimitCounter=function(o,n){try{
			this.limitCount=parseInt(parseInt(this.limitCount)+(exists(n)?parseInt(n):1));
			this.limitCounterNode.value=this.limitCount;
			WM.rulesManager.saveRules();
			//for reaching of limit
			if (this.limit && (this.limitCount>=this.limit)) this.onEvent("onLimit",o);
		}catch(e){log("WM.rulesManager.Rule.incrementLimitCounter: "+e);}};

		this.decrementLimitCounter=function(o,n){try{
			this.limitCount=parseInt(parseInt(this.limitCount)-(exists(n)?parseInt(n):1));
			//dont allow to drop below 0
			if (this.limitCount<0) this.limitCount=0;
			this.limitCounterNode.value=this.limitCount;
			WM.rulesManager.saveRules();
		}catch(e){log("WM.rulesManager.Rule.decrementLimitCounter: "+e);}};

		this.remove=function(noConfirm){try{
			var ask=WM.opts.rulesConfirmDeleteRule;
			if (noConfirm || (this.isGlobal && confirm("This rule is shared with other profiles. Deleting it here will prevent it from loading for other users. Are you sure you wish to delete this rule and its children.")) || !ask || (!this.isGlobal && ask && confirm("Delete rule and all of its child nodes?"))){
				//destroy intervals and timers
				this.cleanup();				
				//remove my data
				var parentContainer=((this.isChild)?this.parent.kids:(this.isEgg)?this.parent.eggs:WM.rulesManager.rules);
				parentContainer.removeByValue(this);
				//remove my node
				remove(this.node);
				
				doAction(WM.rulesManager.saveRules);
			}
		}catch(e){log("WM.rulesManager.Rule.remove: "+e);}};

		this.cancelAllTimers=function(){try{
			//find the correct timer by target
			for (var t in this.timers){
				if (this.timers[t]!=null) {
					window.clearTimeout(this.timers[t]);
					delete this.timers[t];
				}
			}
		}catch(e){log("WM.rulesManager.Rule.cancelAllTimers: "+e);}};		

		this.cancelTimer=function(target){try{
			//find the correct timer by target
			var timer=null;
			for (var t in this.timers){
				if (this.timers[t].target==target) {
					timer=this.timers[t];
					break;
				}
			}
			if (timer) {
				window.clearTimeout(timer.timer);
				delete this.timers[timer.id];
			}
		}catch(e){log("WM.rulesManager.Rule.cancelTimer: "+e);}};
		
		this.createTimer=function(t,o){try{
			this.cancelTimer(o);
			var self=this;
			var stamp=unique();
			var timer=window.setTimeout(function(){
				self.onEvent("onTimer",o);
			},t);
			this.timers[stamp]={timer:timer, target:o, id:stamp};
		}catch(e){log("WM.rulesManager.Rule.createTimer: "+e);}};
		
		this.cancelAllIntervals=function(){try{
			//find the correct timer by target
			for (var t in this.intervals){
				if (this.intervals[t]!=null) {
					window.clearInterval(this.intervals[t]);
					delete this.intervals[t];
				}
			}
		}catch(e){log("WM.rulesManager.Rule.cancelAllIntervals: "+e);}};		
		
		this.cancelInterval=function(target){try{
			//find the correct timer by target
			var interval=null;
			for (var t in this.intervals){
				if (this.intervals[t].target==target) {
					interval=this.intervals[t];
					break;
				}
			}
			if (interval) {
				window.clearInterval(interval.timer);
				delete this.intervals[interval.id];
			}
		}catch(e){log("WM.rulesManager.Rule.cancelInterval: "+e);}};
		
		this.createInterval=function(t,o){try{
			this.cancelInterval(o);
			var self=this;
			var stamp=unique();
			var interval=window.setInterval(function(){
				self.onEvent("onInterval",o);
			},t);
			this.intervals[stamp]={timer:interval, target:o, id:stamp};
		}catch(e){log("WM.rulesManager.Rule.createInterval: "+e);}};
		
		this.doEvent=function(event,obj,logit){try{
			//check to see if post matches this rule, if it does, perform actions
			//if (this.validators){
				//logit=logit||(obj.objType=="post");
				
				var obj=(obj||{});
				//var self=this;
				var matchPost=true, found=[];
				for (var vl=0,validator;(validator=this.validators[vl]);vl++) { try{
					//within the search array, each result is handled as an OR
					var result=false;
					for (var s=0,search; (search=validator.search[s]); s++) {
						var v = 
							//special request for object type of the object that activated this rule
							(search=="activatorType")?(
								(exists(obj))?(obj.objType||"unknown"):"unknown"
							):
							
							//special specific app being paused test
							(search=="isAppPaused")?(
								(exists(obj) && exists(obj.app))?obj.app.paused:false
							):
							
							//special specific bonus type being paused
							(search=="isTypePaused")?(
								(exists(obj) && exists(obj.which) && exists(obj.app))?obj.app.typesPaused.inArray(obj.which):false
							):
							
							//read from post object test data
							(exists(obj) && exists(obj.testData) && exists(obj.testData[search]))?obj.testData[search]:  
							//read from activating object standard parameters
							(exists(obj) && exists(obj[search]))?obj[search]:
							//read from this rule object
							exists(self[search])?self[search]:
							//read from parameters in the console/main object
							exists(WM[search])?WM[search]:
							//there is no known reference for this query
							"undefined";

						//fail validators that do not work with this obj
						if (v=="undefined") {result=false; break;}
						//convert functions to values
						if (typeof v=="function") v=v();
						
						var query = validator.find;
						//make the query the same type as the value
						if (!(typeof query == typeof v)) {
							switch (typeof v) {
								case "boolean":
									//convert texts of false/true to actual booleans
									query = cBool(query);
									break;
								case "number":
									//convert text numbers to real numbers
									query=(query=Number(query))?query:0;
									//if (query==null) query=0;
									break;
							}
						}
						
						//if (logit) log([search, v, query]);	

						//compare
						switch(validator.operand){
							case "equals": result=result||(v==query); break; 
							case "notEquals": result=result||(v!=query); break; 
							case "startsWith": result=result||(v.startsWith(query)); break; 
							case "notStartsWith": result=result||(!v.startsWith(query)); break; 
							case "endsWith": result=result||(v.endsWith(query)); break; 
							case "notEndsWith": result=result||(!v.endsWith(query)); break; 
							case "contains": result=result||(v.contains(query)); break; 
							case "notContains": result=result||(!v.contains(query)); break; 
							case "greaterThan": result=result||(v>query); break; 
							case "lessThan": result=result||(v<query); break; 
							case "greaterThanOrEquals": result=result||(v>=query); break; 
							case "lessThanOrEquals": result=result||(v<=query); break; 
							case "matchRegExp":
								var f; //storage space for match array
								var regex = new RegExp(query,"gi");
								f=regex.exec(v);
								result=result||isArrayAndNotEmpty(f);
								//result=result||((f=v.match(regex))!=null);
								if (f) found=found.concat(f);
								break;
							case "notMatchRegExp":
								var regex = new RegExp(query,"gi");
								result=result||(v.match(regex)==null);
								break;
							case "equalsExactly": result=result||(v===query); break; 
							case "notEqualsExactly": result=result||!(v===query); break; 
						}
						//any result of true inside this loop is an automatic success
						if (result) break;
					}
					//evaluate our current result with the previous results
					//outside the search array, each value is handled as an AND
					//any one non-match is a complete failure
					matchPost=(matchPost && result);
					if (!matchPost) break;
				}catch(e){
					log("WM.rulesManager.Rule.doEvent: "+e+"{event:" +event+ ", search:"+search+", value:"+v+", query:"+query+", result:"+result+"}");
					continue;
				}}
				//if after all testing we still matched the object
				//then perform this rule's events and check children
				if (matchPost) {
					//log("post matches all validators");
					//first do every child rule
					for (var k=0,kid;(kid=this.kids[k]);k++){
						kid.doEvent(event,obj,true);
					}
					//now finish up with this rule's actions
					this.onEvent(event,obj,found||null);
				}
			//}
			
			//log("WM.rulesManager.Rule.doEvent: {obj="+obj.id+", event="+event+", matchPost="+matchPost+"}");
		}catch(e){log("WM.rulesManager.Rule.doEvent: "+e);}};

		this.onEvent=function(event,obj,found){try{
			var actionFilter=["*"];
			/*
				handle special events
			*/
			if (event=="onRuleCreated") {
				/*
					we do want onRuleCreated events to fire even if the rule is disabled,
					or intervals won't be set and ready for later, if the user does enable the rule
					this session. But we want to filter which actions are available.
				*/
				if (!this.enabled || this.isBranchDisabled) actionFilter=["createInterval","createTimer"];
				
			} else if ((event=="onInterval")||(event=="onTimer")) {
				//special case for intervals and timers
				if (!this.enabled || this.isBranchDisabled) return;
			} else {
				//always break if this rule is disabled
				if (!this.enabled || this.isBranchDisabled) return;
			}
			/*
				end handle special events
			*/
		
			obj=obj||null;
			//var self=this;
			var post=(self!=obj)?obj:null;
			var app=post?(exists(obj.app)?obj.app:obj):null;
			
			//some insertable post parts
			var inserts=["appID","which","fromID"];
			
			//perform an action based on an event call
			//post object may be null if called from this
			for (var a1=0,action;(action=this.actions[a1]);a1++){
				//filter actions: allow only those in the filter list, or all actions if "*" is in the list				
				if (actionFilter.inArray("*") || actionFilter.inArray(action.action) ) if (action.event==event){
					var param=action.params;
					var param2=action.params2;
					var hasParam=action.hasParam;
					//format some post parts into the param
					if (hasParam && param) {
						for (var i=0;i<inserts.length;i++){
							if (post && (post.replace||null)) {
								param.replace(new RegExp("{%"+inserts[i]+"}","gi"), post.testData[inserts[i]] || post[inserts[i]]);
							}
						}
					}
					
					switch(action.action){
						case "destroyRule":(function(){
							doAction(function(){
								self.remove(true);
							});
							})(); break;
						case "pauseType":(function(){
							var w=post.which, a=app;
							doAction(function(){
								WM.pauseByType(a,w);
							});
							})(); break;
						case "unpauseType":(function(){
							var w=post.which, a=app;
							doAction(function(){
								WM.unPauseByType(a,w);
							});
							})(); break;
						case "uncheckType":(function(){
							var w=post.which, a=app;
							doAction(function(){
								WM.disableOpt(w,a);
								//WM.stopCollectionOf(post.which);
							});
							})(); break;

						case "checkType":(function(){
							var w=post.which, a=app;
							doAction(function(){
								WM.enableOpt(w,a);
								//WM.startCollectionOf(post.which);
							});
							})(); break;
						case "disableAppOption":(function(){
							var c=param, f=found, a=app;
							if (f) c=c.format2(f);
							doAction(function(){
								WM.disableOpt(c,a);
							});
							})(); break;
						case "enableAppOption":(function(){
							var c=param, f=found, a=app;
							if (f) c=c.format2(f);
							doAction(function(){
								WM.enableOpt(c,a);
							});
							})(); break;
						case "disableHostOption":(function(){
							//debug.print("option disabled");
							var c=param, f=found;
							if (f) c=c.format2(f);
							doAction(function(){
								WM.disableOpt(c);
							});
							})(); break;
						case "enableHostOption":(function(){
							//debug.print("option enabled");
							var c=param, f=found;
							if (f) c=c.format2(f);
							doAction(function(){
								WM.enableOpt(c);
							});
							})(); break;
						case "disableAutolike":(function(){
							doAction(function(){
								//debug.print("autolike disabled");
								WM.disableOpt("useautolike");
							});
							})(); break;
						case "enableAutolike":(function(){
							doAction(function(){
								//debug.print("autolike enabled");
								WM.enableOpt("useautolike");
							});
							})(); break;
						case "disableAutocomment":(function(){
							doAction(function(){
								WM.disableOpt("useautocomment");
							});
							})(); break;
						case "enableAutocomment":(function(){
							doAction(function(){
								WM.enableOpt("useautocomment");
							});
							})(); break;
						case "pauseApp":(function(){
							var a = WM.apps[param]||app;
							doAction(function(){
								a.pause();
							});
							})(); break;
						case "unpauseApp":(function(){
							var a = WM.apps[param]||app;
							doAction(function(){
								a.unPause();
							});
							})(); break;
						case "appendLink":(function(){
							var p=post, v=param||"";
							if (p) doAction(function(){
								p.link=p.linkHref+v;
							});
							})(); break;
						case "unpauseAllTypesByApp":(function(){
							var a = WM.apps[param]||app;
							doAction(function(){
								a.unpauseAllTypes();
							});
							})(); break;
						case "unpauseAllTypesAllApps":(function(){
							doAction(function(){
								for (var a in WM.apps){
									a.unpauseAllTypes();
								}
							});
							})(); break;
						case "unpauseAllApps":(function(){
							doAction(function(){
								for (var a in WM.apps){
									a.unpause();
								}
							});
							})(); break;
						case "pauseAllApps":(function(){
							doAction(function(){
								for (var a in WM.apps){
									a.pause();
								}
							});
							})(); break;
						case "refreshBrowser":(function(){
							doAction(function(){
								WM.refreshBrowser();
							});
							})(); break;
						case "pauseWM.collector":(function(){
							doAction(function(){
								WM.pauseCollecting(true);
							});
							})(); break;
						case "unpauseWM.collector":(function(){
							doAction(function(){
								WM.pauseCollecting(false);
							});
							})(); break;
						case "pauseFetch":(function(){
							doAction(function(){
								WM.pauseFetching(true);
							});
							})(); break;
						case "unpauseFetch":(function(){
							doAction(function(){
								WM.pauseFetching(false);
							});
							})(); break;
						case "likePost":(function(){
							doAction(function(){
								post.like();
							});
							})(); break;
						case "queueLikePost":(function(){
							doAction(function(){
								WM.queAutoLike(post);
							});
							})(); break;
						case "commentPost":(function(){
							var p=param,f=found;
							if (f) p=p.format2(f);
							doAction(function(){
								post.comment(p);
							});
							})(); break;						
						case "queueCommentPost":(function(){
							var p=param,f=found;
							if (f) p=p.format2(f);
							//log(["queueCommentPost fired",p]);
							doAction(function(){
								WM.queAutoComment(post,p);
							});
							})(); break;
						case "cleanPost":(function(){
							doAction(function(){
								post.remove();
							});
							})(); break;
						case "incrementCounter":(function(){
							var o=obj,p=param,f=found;
							//if (f) p=p.format2(f);
							doAction(function(){
								self.incrementLimitCounter(o,p);
							});
							})(); break;
						case "decrementCounter":(function(){
							var o=obj,p=param,f=found;
							//if (f) p=p.format2(f);
							doAction(function(){
								self.decrementLimitCounter(o,p);
							});
							})(); break;
						case "incrementParentCounter":(function(){
							var o=obj,p=param, f=found;
							//if (f) p=p.format2(f);
							if (this.parent) {
								doAction(function(){
									//passes the activating object, not this rule
									self.parent.incrementLimitCounter(o,p);
								});
							}
							})(); break;
						case "decrementParentCounter":(function(){
							var o=obj,p=param, f=found;
							//if (f) p=p.format2(f);
							if (this.parent){
								doAction(function(){
									//passes the activating object, not this rule
									self.parent.decrementLimitCounter(o,p);
								});
							}
							})(); break;
						case "setColor":(function(){
							var c=param;
							var f=found;
							if (f) c=c.format2(f);
							doAction(function(){
								post.setColor(c);
							});
							})(); break;
						case "pinPost":(function(){
							doAction(function(){
								post.pin();
							});
							})(); break;
						case "setAsAccepted":(function(){
							var saveit=param;
							doAction(function(){
								post.accept(saveit);
							});
							})(); break;
						case "setAsFailed":(function(){
							var saveit=param;
							doAction(function(){
								post.fail(saveit);
							});
							})(); break;
						case "setAsExcluded":(function(){
							doAction(function(){
								post.exclude();
							});
							})(); break;
						case "processFirst":(function(){
							doAction(function(){
								post.moveToTop();
							});
							})(); break;
						case "processLast":(function(){
							doAction(function(){
								post.moveToBottom();
							});
							})(); break;
						case "setPriority":(function(){
							var p=param, f=found;
							if (f) p=p.format2(f);
							doAction(function(){
								post.setPriority(p);
							});
							})(); break;
						case "setPriorityApp":(function(){
							var p=param2, a=WM.apps[param]||app, f=found;
							if (f) p=p.format2(f);
							doAction(function(){
								app.setPriority(p);
							});
							})(); break;
						case "removePriorityApp":(function(){
							var p=param2, a=WM.apps[param]||app, f=found;
							if (f) p=p.format2(f);
							doAction(function(){
								app.setPriority(50);
							});
							})(); break;
						case "setPriorityType":(function(){
							var p=param2, a=app, f=found, w=param||post.which;
							if (f) p=p.format2(f);
							doAction(function(){
								app.setPriorityByType(w,p);
							});
							})(); break;
						case "removePriorityType":(function(){
							var a=app, f=found, w=param||post.which;
							if (f) p=p.format2(f);
							doAction(function(){
								app.setPriorityByType(w,50);
							});
							})(); break;
						case "removePriority":(function(){
							doAction(function(){
								post.setPriority(50);
							});
							})(); break;
						case "resetLimit":(function(){
							doAction(function(){
								self.resetLimit({noConfirm:true});
							});
							})(); break;
						case "resetParentLimit":(function(){
							if (this.parent) {
								doAction(function(){
									self.parent.resetLimit({noConfirm:true});
								});
							}
							})(); break;
						case "resetChildrenLimits":(function(){
							doAction(function(){
								self.resetChildrenLimits({noConfirm:true});
							});
							})(); break;						
						case "resetBranchLimits":(function(){
							doAction(function(){
								self.resetBranchLimits({noConfirm:true});
							});
							})(); break;				
						case "hatch":(function(){
							var o=obj;
							doAction(function(){
								self.hatch(o);
							});
							})(); break;
						case "birth":(function(){
							var o=obj;
							doAction(function(){
								this.birth(o);
							});
							})(); break;
						case "fetchVisiblePosts":(function(){
							doAction(function(){
								WM.fetch({bypassPause:true});
							});
							})(); break;
						case "fetchNewer":(function(){
							doAction(function(){
								app.fetchPosts({newer:true,bypassPause:true});
							});
							})(); break;
						case "fetchOlder":(function(){
							doAction(function(){
								app.fetchPosts({older:true,bypassPause:true});
							});
							})(); break;
						case "fetchHours":(function(){
							var p=param, f=found, a=app;
							if (f) p=p.format2(f);
							doAction(function(){
								//var t0=timestamp()/1000; //let the fetch script calc it from the feed
								var t1=Math.round((timeStamp()-(p*hour))/1000);
								//t=t.substr(0,t.length-3);
								log("fetchHours: "+p+" please wait...");
								WM.fetch({bypassPause:true, older:true, targetEdge:t1, currentEdge:Math.round(timeStamp()/1000), apps:app});
							});
							})(); break;
						case "disableRule":(function(){
							doAction(function(){						
								self.disable();
							});
							})(); break;
						case "enableRule":(function(){
							doAction(function(){
								self.enable();
							});
							})(); break;
						case "disableChildRules":(function(){
							doAction(function(){						
								self.disableChildren();
							});
							})(); break;
						case "enableChildRules":(function(){
							doAction(function(){
								self.enableChildren();
							});
							})(); break;
						case "disableApp":(function(){
							//check for specified app
							var a = WM.apps[param]||app;
							doAction(function(){
								a.disable();
							});
							})(); break;
						case "enableApp":(function(){
							var a = WM.apps[param]||app;
							doAction(function(){
								a.enable();
							});
							})(); break;
						case "forceOpen":(function(){
							doAction(function(){
								post.forceOpen();
							});
							})(); break;
						case "forceOpenFirst":(function(){
							doAction(function(){
								post.forceOpen({first:true});
							});
							})(); break;
						case "emergencyOpen":(function(){
							doAction(function(){
								post.forceOpen({emergency:true});
							});
							})(); break;
						case "setToCollect":(function(){
							doAction(function(){
								post.collect();
							});
							})(); break;
						case "setToCollectPriority1":(function(){
							doAction(function(){
								post.collect();
								post.setPriority(1);
							});
							})(); break;
						case "createTimer":(function(){
							var o=obj, p=param, f=found;
							if (f) p=p.format2(f);
							//allow new time format entry
							//if the calculated time differs from the passed time, then use that calculated time, as long as it doesn't translate to 0
							var t=calcTime(p);
							if (t!=0 && t!=p) p=t;
							//debug.print(["b",param,t,p]);
							doAction(function(){
								self.createTimer(p,o);
							});
							})(); break;
						case "cancelTimer":(function(){
							var o=obj;
							doAction(function(){
								if (o.objType=="rule") self.cancelAllTimers();
								else self.cancelTimer(o);
							});
							})(); break;
						case "createInterval":(function(){
							var o=obj, p=param, f=found;
							if (f) p=p.format2(f);
							//allow new time format entry
							//if the calculated time differs from the passed time, then use that calculated time, as long as it doesn't translate to 0
							var t=calcTime(p);
							if (t!=0 && t!=p) p=t;
							//debug.print(["b",param,t,p]);
							doAction(function(){
								self.createInterval(p,o);
							});
							})(); break;
						case "cancelInterval":(function(){
							var o=obj;
							doAction(function(){
								if (o.objType=="rule") self.cancelAllIntervals();
								else self.cancelInterval(o);
							});
							})(); break;
						case "setWhich":(function(){
							var w=param;
							var f=found;
							if (f) w=w.format2(f);
							doAction(function(){
								post.setWhich(w);
							});
							})(); break;
						case "reIDAll": (function(){
							doAction(function(){
								WM.reIDAll();
							});
							})(); break;
						case "resetAllLimits":(function(){
							doAction(function(){
								WM.rulesManager.resetAllLimits();
							});
							})(); break;							
						case "openPostSource":(function(){
							doAction(function(){
								post.openSource();
							});
							})(); break;
						case "emptyAutolikeQueue":(function(){
							doAction(function(){
								WM.emptyAutoLikeQueue();
							});
							})(); break;							
						case "setHostOption":(function(){
							var c=param, c2=param2, f=found;
							if (f) c=c.format2(f); //format only param1
							doAction(function(){
								WM.setOpt(c,c2);
							});
							})(); break;
						case "setAppOption":(function(){
							var c=param, c2=param2, f=found, a=app;
							if (f) c=c.format2(f); //format only param1
							doAction(function(){
								WM.setOpt(c,c2,a);
							});
							})(); break;							
						case "setAppTab":(function(){
							if (param=="all") {
								doAction(function(){
									//switch to Show All
									WM.console.collectTabControl.selectTab(0);
								});
							} else {
								//check for specified app
								var a = WM.apps[param]||app;
								if (a||null) doAction(function(){
									//switch to associated tab
									click(a.collectionTabNode);
								});
							}})(); break;							
					}	
				}
			}
		}catch(e){log("WM.rulesManager.Rule.onEvent: "+e);}};
		
		this.addAction=function(p){try{
			var isNew=!exists(p);
			p=p||{};
			p.parent=this;
			var ret=new WM.rulesManager.RuleAction(p);
			this.actions.push(ret);
			if (isNew) WM.rulesManager.saveRules();
		}catch(e){log("WM.rulesManager.Rule.addAction: "+e);}};

		this.addValidator=function(p){try{
			var isNew=!exists(p);
			p=p||{};
			p.parent=this;
			var ret=new WM.rulesManager.RuleValidator(p);
			this.validators.push(ret);
			if (isNew) WM.rulesManager.saveRules();
		}catch(e){log("WM.rulesManager.Rule.addValidator: "+e);}};
		
		this.addChild=function(p){try{
			var isNew=!exists(p);
			p=p||{};
			p.parent=this;
			p.isChild=true;
			var rule=new WM.rulesManager.Rule(p);
			this.kids.push(rule);
			if (isNew) WM.rulesManager.saveRules();
		}catch(e){log("WM.rulesManager.Rule.addChild: "+e);}};

		this.addEgg=function(p){try{
			var isNew=!exists(p);
			p=p||{};
			p.parent=this;
			p.isEgg=true;
			var rule=new WM.rulesManager.Rule(p);
			this.eggs.push(rule);
			if (isNew) WM.rulesManager.saveRules();
		}catch(e){log("WM.rulesManager.Rule.addEgg: "+e);}};		
		
		//move eggs to parent node and destroy this node
		this.hatch=function(obj){try{
			var ask=WM.opts.rulesConfirmHatch
			if (!ask || (ask && confirm("Hatch egg child and remove current rule and all its children?")) ) {
				this.onEvent("onHatch",obj||this);
				for (var e=0,egg; (egg=this.eggs[e]); e++){
					egg.moveUpLevel();
				}
				this.remove(true); //with noConfirm
			}
		}catch(e){log("WM.rulesManager.Rule.hatch: "+e);}};

		//clone eggs to parent node
		this.birth=function(obj){try{
			this.onEvent("onBirth",obj||this);
			for (var e=0,egg; (egg=this.eggs[e]); e++){
				var cloneRule=egg.saveableData;
				if (this.isChild) this.parent.addChild(cloneRule);
				else WM.rulesManager.newRule(cloneRule);
			}
		}catch(e){log("WM.rulesManager.Rule.birth: "+e);}};

		//self rule button clicked
		this.ruleButtonClicked=function(obj){try{
			this.onEvent("onRuleButtonClicked",obj||this);
		}catch(e){log("WM.rulesManager.Rule.ruleButtonClicked: "+e);}};

		this.toggleContent=function(){try{
			this.expanded=!this.expanded;
			var btnSize=WM.opts.littleButtonSize;
			with (this.contentNode)
				className=className.swapWordB(this.expanded,"expanded","collapsed");
			with (this.toggleImgNode)
				className=className.swapWordB(this.expanded,"treeCollapse"+btnSize,"treeExpand"+btnSize);
			WM.rulesManager.saveRules();
		}catch(e){log("WM.rulesManager.Rule.toggleContent: "+e);}};

		this.populateBonusList=function(){try{
			var node=this.bonusDropDown;
			var bonuses=[];
			//get the list of accept texts for this app
			if (this.appID!="") {
				if (this.appID=="* All") {
					//populate list with bonuses from ALL docked sidekicks
				} else bonuses = mergeJSON(WM.apps[this.appID].accText,WM.apps[this.appID].userDefinedTypes);
			}
			bonuses["dynamic"]="* Dynamic grab";
			bonuses["none"]="* None";
			bonuses["wishlist"]="* Flaged as Wishlist";
			bonuses["exclude"]="* Excluded types";
			bonuses["send"]="* Send Unknown";
			bonuses["doUnknown"]="* Get Unknown";
			bonuses["*"]="* All"; //perform rule on ALL bonus types for this app

			//sort by display text
			bonuses=sortCollection(bonuses,"value");

			//add each element to the dropdown
			var elem;
			node.innerHTML=""; //wipe previous list
			for (var i in bonuses) {
				var showI=i.removePrefix(this.appID);
				node.appendChild(elem=createElement("option",{textContent:((bonuses[i].startsWith("*"))?"":((showI.startsWith("send"))?"Send ":"Get "))+bonuses[i], value:showI}));
				if (this.bonus== showI) elem.selected = true;
			}
		}catch(e){log("WM.rulesManager.Rule.populateBonusList: "+e);}};

		//draw to priority/rule manager or to the parent node's kids or eggs section
		try{(((this.parent)?this.parent[(this.isChild)?"kidsNode":"eggsNode"]:null)||$("wmPriorityBuilder")).appendChild(
			this.node=createElement("div",{className:"listItem "+((this.enabled)?"enabled":"disabled")},[
				createElement("div",{className:"line"},[
					createElement("div",{className:"littleButton",title:"Toggle Content",onclick:function(){self.toggleContent();}},[
						this.toggleImgNode=createElement("img",{className:"resourceIcon "+(this.expanded?"treeCollapse"+WM.opts.littleButtonSize:"treeExpand"+WM.opts.littleButtonSize)}),
					]),
					this.toggleNode=createElement("input",{type:"checkbox",checked:this.enabled,onchange:function(){
						self.enabled=this.checked;
						with (self.node) className=className.toggleWordB(!this.checked,"disabled");
						WM.rulesManager.saveRules();
					}}),
					createElement("label",{textContent:"Title:"}),
					this.titleNode=createElement("input",{className:"w400",value:(this.title||""), onchange:function(){self.title=this.value; WM.rulesManager.saveRules();}}),
					
					//toolbox
					createElement("div",{className:"littleButton oddOrange", title:"Remove Rule"},[
						createElement("img",{className:"resourceIcon trash"+WM.opts.littleButtonSize,onclick:function(){self.remove();}})]),
					createElement("div",{className:"littleButton oddBlue",title:"Hatch Egg Children"},[
						createElement("img",{className:"resourceIcon hatch"+WM.opts.littleButtonSize,onclick:function(){self.hatch();}})]),
					createElement("div",{className:"littleButton oddBlue", title:"Reset Limit Counter"},[
						createElement("img",{className:"resourceIcon reset"+WM.opts.littleButtonSize,onclick:function(){self.resetLimit();}})]),
					createElement("div",{className:"littleButton oddBlue", title:"Clone Rule"},[
						createElement("img",{className:"resourceIcon clone"+WM.opts.littleButtonSize,onclick:function(){self.clone();}})]),
					createElement("div",{className:"littleButton oddBlue", title:"Birth Egg Children"},[
						createElement("img",{className:"resourceIcon birth"+WM.opts.littleButtonSize,onclick:function(){self.birth();}})]),
					createElement("div",{className:"littleButton oddGreen", title:"Move Up"},[
						createElement("img",{className:"resourceIcon arrowUp"+WM.opts.littleButtonSize,onclick:function(){self.moveUp();}})]),
					createElement("div",{className:"littleButton oddOrange", title:"Move Down"},[
						createElement("img",{className:"resourceIcon arrowDown"+WM.opts.littleButtonSize,onclick:function(){self.moveDown();}})]),
					createElement("div",{className:"littleButton oddGreen", title:"Move Up Level"},[
						createElement("img",{className:"resourceIcon moveUpLevelLeft"+WM.opts.littleButtonSize,onclick:function(){self.moveUpLevel();}})]),
					createElement("div",{className:"littleButton oddOrange", title:"Move Down Level"},[
						createElement("img",{className:"resourceIcon moveInLevel"+WM.opts.littleButtonSize,onclick:function(){self.moveDownLevel();}})]),
					createElement("div",{className:"littleButton oddBlue", title:"Show Source"},[
						createElement("img",{className:"resourceIcon object"+WM.opts.littleButtonSize,onclick:function(){promptText(JSON.stringify(self.saveableData),true);}})]),

					createElement("div",{className:"indent littleButton "+((this.isGlobal)?"oddOrange":"oddGreen"), title:((this.isGlobal)?"Disable Profile Sharing":"Share With Other Profiles")},[
						this.toggleGlobalButton=createElement("img",{className:"resourceIcon "+((this.isGlobal)?"removeGlobal":"addGlobal")+WM.opts.littleButtonSize,onclick:function(){self.isGlobal=!self.isGlobal; WM.rulesManager.saveRules();}})]),
				]),
				this.contentNode=createElement("div",{className:"subsection "+(this.expanded?"expanded":"collapsed")},[
					(this.basedOn)?createElement("div",{className:"line"},[
						createElement("label",{textContent:"This rule is linked to a post: ",title:"This rule is linked to a post. Validators can draw information from that post so you can easily capture similar posts just by editing the captured texts to suit your needs. Post linking is not carried from session to session."}),
						this.basedOnNode=createElement("span",{textContent:this.basedOn.id}),
					]):null,
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"Limit:"}),
						this.limitNode=createElement("input",{value:(this.limit||0), onchange:function(){self.limit=this.value;WM.rulesManager.saveRules();}}),
					]),
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"Counter:"}),
						this.limitCounterNode=createElement("input",{value:(this.limitCount||0), onchange:function(){self.limitCount=this.value;WM.rulesManager.saveRules();}}),
					]),
					this.ruleButtonHousingNode=createElement("div",{className:"line", style:(this.usesRuleButton())?"":"display:none;"},[
						createElement("label",{textContent:"Rule Button:"}),
						this.ruleButtonNode=createElement("button",{type:"button", textContent:"onRuleButtonClicked()", onclick:function(){self.ruleButtonClicked();}}),
					]),
					//validation subbox
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"For Activating Objects:",title:"These validators attempt to match a post or other activating object, such as feed, feed filter, app, or this rule. All activators that match here then have the following actions performed at certain events."}),
						createElement("div",{className:"littleButton oddGreen",onclick:function(){self.addValidator();},title:"Add Validator"},[
							createElement("img",{className:"resourceIcon plus"+WM.opts.littleButtonSize}),
						]),
						this.validationNode=createElement("div",{className:"subsection"}),
					]),				
					//actions subbox
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"Do Actions:",title:"Actions to perform on matching posts."}),
						createElement("div",{className:"littleButton oddGreen",onclick:function(){self.addAction();},title:"Add Action"},[
							createElement("img",{className:"resourceIcon plus"+WM.opts.littleButtonSize}),
						]),
						this.actionsNode=createElement("div",{className:"subsection"}),
					]),
					//kids subbox
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"Child Rules:",title:"Child rules are nested rules which are applied to matching posts at the same time the parent rule is applied. Child rules can have different validators, but will only activate if the parent validators have already matched a post."}),
						createElement("div",{className:"littleButton oddGreen",onclick:function(){self.addChild();},title:"Add Child"},[
							createElement("img",{className:"resourceIcon plus"+WM.opts.littleButtonSize}),
						]),
						this.kidsNode=createElement("div",{className:"subsection"}),
					]),
					//egg kids subbox
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"Egg Rules:", title:"Eggs are potential future rules. When 'hatched', these eggs take the place of the parent rule. The parent rule and its normal children are destroyed."}),
						createElement("div",{className:"littleButton oddGreen",onclick:function(){self.addEgg();},title:"Add Egg"},[
							createElement("img",{className:"resourceIcon plus"+WM.opts.littleButtonSize}),
						]),
						this.eggsNode=createElement("div",{className:"subsection"}),
					]),
				]),
			])
		);}catch(e){log("WM.rulesManager.Rule.init.drawRule: "+e);}

		
		//list the actions for this rule
		if (isArrayAndNotEmpty(params.actions)) for (var i=0,action; (action=params.actions[i]); i++) {
			this.addAction(action);
		}
		//list the validators for this rule
		if (isArrayAndNotEmpty(params.validators)) for (var i=0,validator; (validator=params.validators[i]); i++) {
			this.addValidator(validator);
		}
		//list the kids for this rule
		if (isArrayAndNotEmpty(params.kids)) for (var i=0,kid; (kid=params.kids[i]); i++) {
			this.addChild(kid);
		}
		//list the egg kids for this rule
		if (isArrayAndNotEmpty(params.eggs)) for (var i=0,egg; (egg=params.eggs[i]); i++) {
			this.addEgg(egg);
		}
				
		//create cleanup function
		this.cleanup=function(){try{
			for (var t in this.timers) {
				window.clearTimeout(this.timers[t]);
			}
			for (var i in this.intervals) {
				window.clearInterval(this.intervals[i]);
			}
			var self=this;
			removeEventListener("beforeunload",self.cleanup,false);
		}catch(e){log("WM.rulesManager.Rule.cleanup: "+e);}};
		addEventListener("beforeunload",self.cleanup,false);
		
		this.onEvent("onRuleCreated");
		return self;

	}catch(e){log("WM.rulesManager.Rule.init: "+e);}};	

})();