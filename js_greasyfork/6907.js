// ==UserScript==
// @name          	WM User Console Object
// @namespace       MerricksdadWMUserConsoleObject
// @description	This is the user console object which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.4
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

//***************************************************************************************************************************************
//***** Visual Console Object
//***************************************************************************************************************************************
	WM.console = {
		initialized: false,
		sidekickNode: null, //remember the sidekicks list
		feedNode: null, //remember where to put the feed data
		loading: true, //set to false after sidekicks have time to load
		priorityNode: null,
		priorityBuild: null,
		dynamicBuild: null,
		
		//new content
		tabContainer:null, //outer tab control
		configButton:null, //userConfig.open control
		collectTabControl:null, //app filter tab control
		
		dynamicIcons: function(){
			//define a crapload of icons
			var icons={
				//128x128 pixel icons
				row0:["refresh","world","check",null,"moveUpLevelLeft","moveUpLevelRight","moveDownLevelLeft","moveDownLevelRight","filter","plus","minus","multiply","import","reset","object","array"],
				row1:["expandDown","expandUp","expandLeft","expandRight","moveTopLeft","moveBottomLeft",null,"allSidekicks","location","sortAsc","sortDesc","tools","treeExpand","treeCollapse","exportGrab","grab"],
				row2:["playDown","playUp","playLeft","playRight","like","unlike","uncheckAll","checkAll","layoutSmall","layoutDetail","layoutList","sidekick","refreshProcess","cancelProcess","importData","heartbeat"],
				row3:["arrowDown","arrowUp","arrowRight","arrowLeft","rssUpRight","rssUpLeft","rssDownRight","rssDownLeft","pin","pinned","redPhone","shuffle",null,"birth","comment"],
				row4:["plugin","identify","add","remove","openInNewWindow","restoreDown","stop","pause","trash","action","logo",null,"moveOutLevel","moveInLevel","removeGlobal","toGlobal"],
				row5:["clone","hatch","tag","noImage","accordionExpandH","accordionCollapseH","accordionExpandV","accordionCollapseV","gotoLibrary","addFilter","removeFilter","maximize","addFeed","addGlobal","fromGlobal","checkGlobal"],
				
				//32px icons
				row6:["firefox","chrome",null,"tabs"],
				
				//16px icons
				row7:["treeCollapseS","treeExpandS","layoutSmallColor","layoutDetailColor","layoutListColor",null,null,null,null,null,null,"noImageSmall"],
			};
			
			var ret=".resourceIcon {display:block; background-image:url('"+WM.resources.iconsURL+"') !important;}\n";
			
			//create css statements 
			//for rows 0-5,6,7
			var sizes=[8,16,24,32,48,64];
			
			for (var si=0,len=sizes.length;si<len;si++){
				var s=sizes[si];
				for (var r=0;r<=6;r++){
					for (var i=0;i<20;i++){
						var iconName=icons["row"+r][i];
						if (iconName!=null) {
							ret+="."+iconName+s+" {background-position:"+(-i*s)+"px "+(-r*s)+"px; width:"+s+"px; height:"+s+"px; background-size:"+(1024/(64/s))+"px;}\n";
						}
					}
				}
				r=6;
				for (var i=0;i<20;i++){
					var iconName=icons["row"+r][i];
					if (iconName!=null) {
						//6 rows of icons 2 times this size
						var yOffset=(6*s*2);
						ret+="."+iconName+s+" {background-position:"+(-(i*s))+"px "+(-yOffset)+"px; width:"+s+"px; height:"+s+"px; background-size:"+(1024/(64/(s*2)))+"px;}\n";
					}
				}
				r=7;
				for (var i=0;i<20;i++){
					var iconName=icons["row"+r][i];
					if (iconName!=null) {
						//6 rows of icons 4 times this size
						//plus 1 row of icons twice this size
						var yOffset=(6*s*4) + (1*s*2);
						ret+="."+iconName+s+" {background-position:"+(-(i*s))+"px "+(-yOffset)+"px; width:"+s+"px; height:"+s+"px; background-size:"+(1024/(64/(s*4)))+"px;}\n";
					}
				}
			}

			return ret;
		},
		
		globalStyle:function(){try{
			return ""+
			
			//icon sheets
			WM.console.dynamicIcons()+
			
			"html {height:100%; width:100%;}\n"+
			"body {margin:0 !important; font-family:tahoma,arial; font-size:small;}\n"+
			
			"a:hover {text-decoration: none !important;}\n"+

			"#content4 {display:none !important; }\n"+

			"#wmContent {background-color:#DDDDEE; position:relative; z-index:900;}\n"+

			".post.classic {position:relative; min-height:90px; border-bottom:1px solid #CCCCDD; padding-bottom:10px; padding-top:10px; clear:both;}\n"+
			".post.classic .actor {margin-top:5px; margin-bottom:10px; font-weight:700; color:#3B5998; display:inline;}\n"+
			".post.classic .picture {padding-top:5px; padding-right:10px; float:left;}\n"+
			".post.classic .picture img {width:90px; height:90px; background-color:white; border:1px solid; border-radius:5px;}\n"+
			".post.classic .body {vertical-align:top;}\n"+
			".post.classic .title {margin-top:5px; font-weight:700; color:#3B5998;display:block;}\n"+
			".post.classic .caption {display:block; }\n"+
			".post.classic .description {padding-top:5px; display:block;}\n"+
			".post.classic .postDate {}\n"+
			".post.classic .appName {position:relative; left:10px;}\n"+
			".post.classic .linkText {color:#899ADB; float:right; padding-right:32px;}\n"+
			".post.classic.noimage {min-height:1px;}\n"+
			
			".post.short {float:left; position:relative;}\n"+
			".post.short .floater {overflow:hidden; display:block; background-color: white; border:0px solid; border-radius:5px; position:absolute; z-index:3; padding:0; width:0px;}\n"+
			".post.short:hover .floater {-moz-transition-property: width,height,padding,border;-moz-transition-delay:1s; width:240px; padding:5px 10px;border:1px solid;}\n"+
			".post.short .actor {display:block;}\n"+
			".post.short .picture {position:relative;}\n"+
			".post.short .picture img {position:relative; width:100%; height:100%; background-color:white;}\n"+
			".post.short .postDate {display:block;}\n"+
			".post.short .appName {display:block;}\n"+
			".post.short .linkText {display:block;}\n"+
			".post.short .progress {opacity:0.25; background-color:#00FF00;}\n"+

			".post.short.working .picture img {opacity:0.25;}\n"+
			".post.short.excluded .picture img {opacity:0.25;}\n"+
			".post.short.timeout .picture img {opacity:0.25;}\n"+
			".post.short.paused .picture img {opacity:0.25;}\n"+
			".post.short.nodef .picture img {opacity:0.25;}\n"+
			".post.short.accepted .picture img {opacity:0.25;}\n"+
			".post.short.failed .picture img {opacity:0.25;}\n"+
			".post.short.colored .picture img {opacity:0.25;}\n"+
			".post.short.scam .picture img {opacity:0.25;}\n"+
			".post.short.pinned .picture img {opacity:0.25;}\n"+

			".post.dev {position:relative; min-height:90px; border-bottom:1px solid #CCCCDD; padding-bottom:20px; padding-top:10px; clear:both;}\n"+
			".post.dev>div:first-child {display: inline-block; margin-right: 16px; border: none;}\n"+

			".wm.content > div > .toolBox {display:inline;}\n"+
			".wm.content > div > .toolBox > div {display:inline;}\n"+
			
			".post .toolBox {display:block; vertical-align:top; position:relative !important;}\n"+
			".post .toolBox > div {display:block; float:right;}\n"+
			
			"div.excluded {background-color:gray !important;}\n"+
			"div.working {background-color:yellow !important;}\n"+
			"div.timeout {background-color:orange !important;}\n"+
			"div.paused {background-color:silver !important;}\n"+
			"div.pinned {background-color:silver !important;}\n"+
			"div.nodef {background-color:deepskyblue !important;}\n"+
			"div.failed {background-color:red !important;}\n"+
			"div.accepted {background-color:limegreen !important;}\n"+
			"div.scam {background-color:purple !important;}\n"+
			
			".pausedHover {display:none; position:absolute; right:50%; top:50%;}\n"+
			".pausedHover>img {margin-left:-32px; margin-top:-32px;}\n"+
			".pausedHover>img:hover {background-color:rgba(0,255,0,0.5); border-radius:20%;}\n"+
			
			".post.paused.short>.floater>.pausedHover>img {background-color:rgba(0,255,0,0.5); border-radius:20%;}\n"+
			".post.paused>.pausedHover, .post.paused>.floater>.pausedHover {display:block;}\n"+
						
			".underline {border-bottom:1px solid #CCCCDD;}\n"+

			".toolTip {display:none; border:1px solid #767676; border-radius:3px; background-color:white; color:black; position:absolute; font-size:8pt; padding:5px; line-height: 12px; z-index:9999;}\n"+
			"*:hover > .toolTip {display:block;}\n"+
			".menuNode {width:0px; height:0px; position:absolute; background:none; border:none;top:-5px;}\n"+
			".toolTip.menuNode > ul {position:absolute; background-color: white; border: 1px solid; border-radius: 5px 5px 5px 5px; padding: 2px; min-width:100px;}\n"+
			".toolTip.menuNode > ul > li {position:relative; line-height:1.28; }\n"+
			".toolTip.right.menuNode {right:5px; }\n"+
			".toolTip.left.menuNode {left:-5px; }\n"+
			".toolTip.right.menuNode > ul {left:0px;}\n"+
			".toolTip.right.menuNode > ul > li {text-align:left;}\n"+
			".toolTip.left.menuNode > ul {right:0px;}\n"+
			".toolTip.left.menuNode > ul > li {text-align:right;}\n"+

			//little button div
			".littleButton {background-color:threedshadow; border-radius:5px; margin:1px; display:inline-block; vertical-align:middle;}\n"+
			".littleButton:hover {background-color:highlight !important;}\n"+
			".littleButton>img {position:relative; display:block; margin:2px;}\n"+
			".littleButton.oddOrange {background-color:#FF9968;}\n"+
			".littleButton.oddBlack {background-color:#82976E;}\n"+
			".littleButton.oddBlue {background-color:#51D1EA;}\n"+
			".littleButton.oddGreen {background-color:#B7E54F;}\n"+
			
			".menuEntry, .menuList > li {position:relative; border-radius:3px; border:1px solid white; padding:3px; min-width:100px;}\n"+
			".menuEntry:hover, .menuList > li:hover {border-color:#CCCCDD; background-color:#E0E8F6; }\n"+

			".accFailBlock {color: white !important;font-size: small !important;left: 16px;line-height: 12px;margin-bottom: -12px;padding: 0 !important;position: relative;top: -32px;}\n"+
			".accFailBlock .fail {background-color: #C3463A; border-radius: 2px 2px 2px 2px; box-shadow: 1px 1px 1px rgba(0, 39, 121, 0.77); padding: 1px 2px;}\n"+
			".accFailBlock .accept {background-color: #46B754; border-radius: 2px 2px 2px 2px; box-shadow: 1px 1px 1px rgba(0, 39, 121, 0.77); padding: 1px 2px;}\n"+

			//rules manager
			"#wmPriorityBuilder {margin:5px; position: relative; background-color:white; min-height:95%;}\n"+
			
			"#wmPriorityBuilder .validator > :before {content:'and: '}\n"+
			"#wmPriorityBuilder .validator:first-child > :before {content:'where: '}\n"+
			"#wmPriorityBuilder .action > :before {content:'and: '}\n"+
			"#wmPriorityBuilder .action:first-child > :before {content:'do: '}\n"+
			
			//collection feed node
			"#wmFeedNode {margin:5px; position: relative; background-color:white;}\n"+

			//sidekick manager
			"#wmSidekickList {margin:5px; position: relative; background-color:white; min-height:95%;}\n"+
			
			//feeds manager
			"#wmFeedsList {margin:5px; position: relative; background-color:white; min-height:95%;}\n"+

			//dynamic grabber
			"#wmDynamicBuilder {margin:5px; position: relative; background-color:white; min-height:95%;}\n"+
			
			//friend tracker
			"#wmFriendTracker {margin:5px; position: relative; background-color:white; min-height:95%;}\n"+

			".expanded {display:block;}\n"+
			".collapsed {display:none;}\n"+
						
			"label {font-weight:bold; margin-right:5px;}\n"+

			".unsaved {background-color:lightyellow !important;}\n"+

			".whiteover:hover {background-color:#FFFFFF !important;}\n"+
			".blueover:hover {background-color:#E0E8F6 !important;}\n"+

			".red {background-color:#C3463A !important; border: 2px solid #982B2F !important; text-shadow: -1px -1px 1px #982B2F, 1px 1px 1px #982B2F, 1px -1px 1px #982B2F, -1px 1px 1px #982B2F; text-transform: none !important; font-color:white !important;}\n"+
			".red:hover {background-color:#EA1515 !important;}\n"+

			".green {background-color:#46B754 !important; border: 2px solid #256E46 !important; text-shadow: -1px -1px 1px #256E46, 1px 1px 1px #256E46, 1px -1px 1px #256E46, -1px 1px 1px #256E46; text-transform: none !important; font-color:white !important;}\n"+
			".green:hover {background-color:#A6E11D !important;}\n"+

			".blue {background-color:#51C2FB !important; border: 2px solid #057499 !important; text-shadow: -1px -1px 1px #057499, 1px 1px 1px #057499, 1px -1px 1px #057499, -1px 1px 1px #057499; text-transform: none !important; font-color:white !important;}\n"+
			".blue:hover {background-color:#C2DEFF !important;}\n"+

			".gray {background-color:#999999 !important; border: 2px solid #666666 !important; text-shadow: -1px -1px 1px #666666, 1px 1px 1px #666666, 1px -1px 1px #666666, -1px 1px 1px #666666; text-transform: none !important; font-color:white !important;}\n"+
			".gray:hover {background-color:#C3C3C3 !important;}\n"+

			".odd {background-image: -moz-linear-gradient(center top , orange, red); box-shadow: 1px 1px 1px black; -moz-transform: rotate(15deg);}\n"+
			".odd:hover {-moz-transform: none;}\n"+

			".post.mosquito {width:16px; height:16px;}\n"+
			".post.tiny {width:24px; height:24px;}\n"+
			".post.small {width:32px; height:32px;}\n"+
			".post.medium {width:48px; height:48px;}\n"+
			".post.large {width:64px; height:64px;}\n"+
			".post.xlarge {width:96px; height:96px;}\n"+

			".floater.mosquito {left:8px;top:8px;}\n"+
			".floater.tiny {left:12px;top:12px;}\n"+
			".floater.small {left:16px;top:16px;}\n"+
			".floater.medium {left:24px;top:24px;}\n"+
			".floater.large {left:32px;top:32px;}\n"+
			".floater.xlarge {left:48px;top:48px;}\n"+

			".post.mosquito.working .picture img {width:24px; height:24px;left:-4px;top:-4px;}\n"+
			".post.tiny.working .picture img {width:32px; height:32px;left:-4px;top:-4px;}\n"+
			".post.small.working .picture img {width:48px; height:48px;left:-8px;top:-8px;}\n"+
			".post.medium.working .picture img {width:64px; height:64px;left:-8px;top:-8px;}\n"+
			".post.large.working .picture img {width:96px; height:96px;left:-16px;top:-16px;}\n"+
			".post.xlarge.working .picture img {width:128px; height:128px;left:-16px;top:-16px;}\n"+

			//"div.pinned {border-radius: 6px; background-color: black !important;}\n"+
			//".post.short.pinned .picture img {border-radius: 5px; height:80% !important; width:80% !important; margin-left:10%; margin-top:10%;}\n"+

			"#wmContent>.jsfTabControl>.tabs {top:10%; width:100px; position:relative;}\n"+
			"#wmContent>.jsfTabControl>.pages {border-radius:5px;}\n"+
			"#wmContent>.jsfTabControl>.tabs>.jsfTab {text-align:center;}\n"+
			
			".jsfTabControl>.tabs {font-family:impact; font-size:large; color:inactivecaptiontext;}\n"+
			"input,select,label,textarea {font-family:tahoma,arial; font-size:small; vertical-align:baseline !important;}\n"+
			".jsfComboBox {line-height:normal;}\n"+
			"button {font-family:tahoma,arial; font-size:small; vertical-align:top !important;}\n"+
			"input[type=\"checkbox\"] {font-family:tahoma,arial; font-size:small; vertical-align:middle !important;}\n"+

			".nomargin {margin:0 !important;}\n"+
			".hidden {display:none !important;}\n"+
			".block {display:block !important;}\n"+
			".alignTop {vertical-align:top !important;}\n"+
			".fit {width:100% !important;}\n"+
			".indent {margin-left:16px;}\n"+
			"img.crisp {image-rendering: -moz-crisp-edges;}\n"+
			
			".listItem {position:relative; clear:both;}\n"+
			".listItem.disabled {opacity:0.5 !important; background-color:#eeeeee;}\n"+
			".listItem .toolBox {position: absolute; right: 0px; top: 0;}\n"+
			".listItem select {border:0px; padding:0px; margin: 0px; margin-left:6px; margin-right:6px; background-color:#eeeeee; vertical-align:middle;}\n"+
			".listItem input {border:0px; padding:0px; margin: 0px; margin-left:6px; margin-right:6px; background-color:#eeeeee; vertical-align:middle;}\n"+
			".listItem textarea {background-color:#eeeeee; border:0px;}\n"+

			".header {background-color: window; font-family:impact; font-size:2em; color:inactivecaptiontext; border-radius:5px 5px 0 0; padding-left:6px;}\n"+
			".headerCaption {background-color: window; color: inactivecaptiontext; font-family: arial; font-size: small; padding-bottom: 6px; padding-left: 16px; padding-right: 16px; padding-top: 6px; border-radius:0 0 5px 5px;}\n"+
			".headerCaption+.toolBox, .header+.toolBox {border-bottom:1px solid activeborder; margin-bottom: 5px; margin-top: 5px; padding-bottom: 5px;}\n"+
			
			".line {border-top:1px solid #c0c0c0; line-height:2em;}\n"+
			".subsection {margin-left:28px;}\n"+
			
			".optioncontainer {max-height:12em; overflow-y:auto; background-color:rgb(238, 238, 238);}\n"+
			".optioncontainer>.line {line-height:normal;}\n"+
			
			".singleCol .post.classic {}\n"+
			".twoCol .post.classic {display: inline-block; width: 50%; vertical-align: top;}\n"+
			".twoCol .post.classic > .body {padding-right:28px;}\n"+
			".threeCol .post.classic {display: inline-block; width: 33%; vertical-align: top;}\n"+
			".threeCol .post.classic > .body {padding-right:28px;}\n"+
			".fourCol .post.classic {display: inline-block; width: 25%; vertical-align: top;}\n"+
			".fourCol .post.classic > .body {padding-right:28px;}\n"+

			".w400 {width:400px;}\n"+
			
			".foundWM {background-color:green;}\n"+


			""
		}catch(e){log("WM.console.globalStyle: "+e);}},

		init: function(params){try{
			debug.print("WM.console.init:");
			var validateFBElements=["globalContainer","content"];
			params=params||{};

			//if console does not already exist
			if (!WM.console.tabContainer) {
				try{
					var gs = WM.console.globalStyle();
					addGlobalStyle(gs,"styleConsole4");
				}catch(e){log("WM.console.init.addGlobalStyle: "+e);};

				/*//attach to facebook page
				var baseNode=$("globalContainer");
				if (baseNode) baseNode=baseNode.parentNode; 
				//or attach to page body
				else baseNode=($("body")||document.body);
				*/
				
				var intendedPositionNode = document.body.childNodes[0];
				//debug.print(intendedPositionNode);

				//sort fields shared by post sorting and grouping
				var sortFields = [
					{value:"age",title:"Time elasped since created (ms)."},
					{value:"alreadyProcessed",title:"History contains a status code for this post."},
					{value:"appID"},
					{value:"appName",title:"App name as it appears on FB."},
					{value:"date",title:"The datetime the post was created, in unix format. Does not contain millisecond data."},
					{value:"fromID",title:"The FB id of the person who created this post."},
					{value:"fromName",title:"The display name of the person who created this post."},
					{value:"fromNameLastFirst",title:"As fromName but displayed as LastName, FirstName"},
					{value:"id",title:"The post object id as it is connected with FB."},
					{value:"idText",title:"Either the whichText of the post, or the statusText of a post already processed."},
					{value:"isAccepted"},
					{value:"isFailed"},
					{value:"isTimeout"},
					{value:"isExcluded"},
					{value:"isCollect",title:"A flag for if this post is to be collected."},
					{value:"isForMe"},
					{value:"isLiked"},
					{value:"isMyPost"},
					{value:"isPaused"},
					{value:"isPinned"},
					{value:"isScam"},
					{value:"isStale"},
					{value:"isUndefined"},
					{value:"isWishlist"},
					{value:"isW2W",title:"If this post is a Wall-to-wall post or just a general feed post."},
					{value:"msg",title:"The comment attached to the post body by the post creator."},
					{value:"postedDay",title:"The year/month/day portion of the creation time for this post."},
					{value:"postedHour",title:"The year/month/day/hour portion of the creation time for this post."},
					{value:"priority",title:"Priority 0 being the first post you would want processed, and Priority 50 being default."},
					{value:"status",title:"The status code returned by the sidekick associated with this post."},
					{value:"which",title:"The sidekick-defined bonus type id for this kind of post."},
					{value:"whichText",title:"The text associated with this bonus type id."},
					{value:null,name:"(none)"},
				];

				//create our content window
				var newNodeBody;
				document.body.insertBefore(newNodeBody=createElement("div",{id:"wmContent"},[
					//toolbox
					(WM.console.tabContainer=new jsForms.tabControl({
						dock:"fillAndShare",
						sizeOffset:{height:-3,width:0},
						alignment:"left",
						tabs:[
							{ //collect tab
								text:"Collect",
								image:null,
								onSelect:function(){WM.console.collectTabControl.redraw();},
								content:[
									createElement("div",{className:"header",textContent:"Collect"}),
									createElement("div",{className:"headerCaption",textContent:"View friends' posts and manage all your collection needs."}),
									createElement("div",{className:"toolBox medium"},[
										createElement("span",{className:"littleButton oddBlue",title:"Fetch Visible Posts Now",onclick:function(){WM.fetch({newer:true,bypassPause:true});} },[createElement("img",{className:"resourceIcon rssUpRight24"})]),
										//createElement("span",{className:"littleButton",title:"Fetch Older Posts Now",onclick:function(){WM.fetch({older:true,bypassPause:true});} },[createElement("img",{className:"resourceIcon rssDownLeft24"})]),
										WM.console.pauseFetchButton=createElement("span",{className:"littleButton oddOrange",title:"Pause Automatic Fetching",onclick:function(){WM.pauseFetching();} },[createElement("img",{className:"resourceIcon expandDown24"})]),
										WM.console.pauseCollectButton=createElement("span",{className:"littleButton oddOrange",title:"Pause Automatic Collection",onclick:function(){WM.pauseCollecting();} },[createElement("img",{className:"resourceIcon stop24"})]),
										createElement("span",{className:"littleButton",name:"0",title:"Classic View",onclick:WM.setDisplay},[createElement("img",{className:"resourceIcon layoutListColor24"})]),
										createElement("span",{className:"littleButton",name:"1",title:"Short View",onclick:WM.setDisplay},[createElement("img",{className:"resourceIcon layoutSmallColor24"})]),
										createElement("span",{className:"littleButton",name:"2",title:"Developer View",onclick:WM.setDisplay},[createElement("img",{className:"resourceIcon layoutDetailColor24"})]),
										createElement("span",{className:"littleButton",title:"Reset Counters",onclick:function(){WM.resetCounters();}},[createElement("img",{className:"resourceIcon refresh24"})]),
										createElement("span",{className:"littleButton oddOrange",title:"Clean Now",onclick:function(){WM.cleanPosts();}},[createElement("img",{className:"resourceIcon trash24"})]),
										createElement("span",{className:"littleButton",title:"ReID All",onclick:function(){WM.reIDAll();}},[createElement("img",{className:"resourceIcon identify24"})]),
										
										createElement("label",{className:"indent",textContent:"Sort By: "}),
										createElement("select",{id:"wmSortBy",className:"", title:"Sort By:", onchange:function(){WM.sortPosts({by:this.value});WM.redrawPosts({postRedraw:false,reorder:true});} },(function(){
											var ret=[];
											for (var i=0;i<sortFields.length;i++) ret.push(createElement("option",{value:sortFields[i].value,title:sortFields[i].title||"",textContent:sortFields[i].name||sortFields[i].value}));
											return ret;
										})()),
										createElement("span",{className:"littleButton oddGreen",title:"Sort Ascending",onclick:function(){WM.sortPosts({direction:"asc"});WM.redrawPosts({reorder:true, postRedraw:false});}},[createElement("img",{className:"resourceIcon sortAsc24"})]),
										createElement("span",{className:"littleButton oddOrange",title:"Sort Descending",onclick:function(){WM.sortPosts({direction:"desc"});WM.redrawPosts({reorder:true, postRedraw:false});}},[createElement("img",{className:"resourceIcon sortDesc24"})]),
										
										createElement("label",{className:"indent",textContent:"Group By: "}),
										createElement("select",{id:"wmGroupBy",className:"", title:"Group By:", onchange:function(){WM.constructGroups({by:this.value});WM.redrawPosts({postRedraw:false,reorder:true});} },(function(){
											var ret=[];
											for (var i=0;i<sortFields.length;i++) ret.push(createElement("option",{value:sortFields[i].value,title:sortFields[i].title||"",textContent:sortFields[i].name||sortFields[i].value}));
											return ret;
										})()),
										createElement("span",{className:"littleButton oddGreen",title:"Group Ascending",onclick:function(){WM.sortGroups({direction:"asc"});WM.redrawPosts({reorder:true, postRedraw:false});}},[createElement("img",{className:"resourceIcon sortAsc24"})]),
										createElement("span",{className:"littleButton oddOrange",title:"Group Descending",onclick:function(){WM.sortGroups({direction:"desc"});WM.redrawPosts({reorder:true, postRedraw:false});}},[createElement("img",{className:"resourceIcon sortDesc24"})]),

										createElement("label",{className:"indent",textContent:"Columns: ",title:"Classic Mode Only"}),
										createElement("select",{title:"Cols:", onchange:function(){WM.setDisplayCols({cols:this.value});} },[
											createElement("option",{value:1,textContent:"One",selected:WM.quickOpts.displayCols==1}),
											createElement("option",{value:2,textContent:"Two",selected:WM.quickOpts.displayCols==2}),
											createElement("option",{value:3,textContent:"Three",selected:WM.quickOpts.displayCols==3}),
											createElement("option",{value:4,textContent:"Four",selected:WM.quickOpts.displayCols==4})
										]),
										createElement("span",{className:"littleButton oddBlue",title:"Autolike Queue"},[
											createElement("img",{className:"resourceIcon like24"}),
											createElement("div",{className:"accFailBlock"},[
												WM.console.likeQueueCounterNode=createElement("span",{className:"accept",textContent:"0"})
											])											
										]),
									]),
									//app filter tabs
									(WM.console.collectTabControl=new jsForms.tabControl({
										dock:"fillAndShare",
										subStyle:"coolBar",
										shareSinglePage:true,
										preventAutoSelectTab:true,
										tabs:[
											{
												//default show all tab
												text:"Show ALL",
												image:"",
												imageClass:"resourceIcon allSidekicks32",
												appFilter:"All",
												onSelect:WM.setAppFilter,
												selected:(WM.quickOpts.filterApp=="All"),
												content:null, //because page is shared
											}
										],
										sharedContent:[
											//bonus display node
											WM.console.feedNode=createElement("div",{id:"wmFeedNode",style:"position: relative;"}),
										],
									})).node,
								],
							},
							{ //sidekicks tab
								text:"Manage Sidekicks",
								image:null,
								content:[
									createElement("div",{className:"header",textContent:"Manage Sidekicks"}),
									createElement("div",{className:"headerCaption",textContent:"Control some of the features of sidekicks."}),
									WM.console.sidekickNode=createElement("div",{id:"wmSidekickList",className:"scrollY"}),
								],
							},
							{ //feeds tab
								text:"Manage Feeds",
								image:null,
								content:[
									createElement("div",{className:"header",textContent:"Manage Feeds"}),
									createElement("div",{className:"headerCaption",textContent:"Add direct links to friends or other public profiles, and fetch posts from those feeds faster."}),
									createElement("div",{className:"toolBox medium columnRight"},[
										createElement("div",{},[
											createElement("div",{className:"littleButton oddGreen",title:"Add Feed",onclick:WM.feedManager.newFeed},[createElement("img",{className:"resourceIcon plus24"})]),
										])
									]),
									WM.console.feedManagerNode=createElement("div",{id:"wmFeedsList",className:"scrollY"}),
								],
							},
							{ //rules tab
								text:"Manage Rules",
								image:null,
								content:[
									createElement("div",{className:"header",textContent:"Manage Rules"}),
									createElement("div",{className:"headerCaption",textContent:"Create rules like macros to control exactly how posts are handled."}),
									createElement("div",{className:"toolBox medium columnRight"},[
										createElement("div",{},[
											createElement("div",{className:"littleButton oddGreen",title:"Add Rule",onclick:WM.rulesManager.newRule},[createElement("img",{className:"resourceIcon plus24"})]),
											createElement("div",{className:"littleButton oddBlue",title:"Reset All Limits",onclick:WM.rulesManager.resetAllLimits},[createElement("img",{className:"resourceIcon reset24"})]),
											createElement("div",{className:"littleButton oddBlue",title:"Convert Dynamics",onclick:WM.rulesManager.convertDynamics},[createElement("img",{className:"resourceIcon exportGrab24"})]),
											createElement("div",{className:"littleButton oddBlue",title:"Import Rule",onclick:WM.rulesManager.importRule},[createElement("img",{className:"resourceIcon importData24"})]),
											createElement("div",{className:"littleButton oddBlue",title:"Export All Rules",onclick:WM.rulesManager.showData},[createElement("img",{className:"resourceIcon object24"})]),
											WM.rulesManager.toggleHBNode=createElement("div",{className:"littleButton "+(WM.quickOpts.heartbeatDisabled?"oddOrange":"oddGreen"),title:"Toggle Heartbeat",onclick:WM.rulesManager.toggleHeartbeat},[createElement("img",{className:"resourceIcon heartbeat24"})]),
										])
									]),
									WM.console.priorityBuild=createElement("div",{id:"wmPriorityBuilder",className:"scrollY"}),
								],
							},
							{ //dynamics tab
								text:"Dynamic Grabber",
								image:null,
								content:[
									createElement("div",{className:"header",textContent:"Dynamic Grabber"}),
									createElement("div",{className:"headerCaption",textContent:"Create tests to capture posts sidekicks might not."}),
									createElement("div",{className:"toolBox medium columnRight"},[
										createElement("div",{},[
											createElement("div",{className:"littleButton oddGreen",title:"Add Test",onclick:WM.grabber.newTest},[createElement("img",{className:"resourceIcon plus24"})]),
											createElement("div",{className:"littleButton oddBlue",title:"Import Test",onclick:WM.grabber.importTest},[createElement("img",{className:"resourceIcon importData24"})]),
										])
									]),
									WM.console.dynamicBuild=createElement("div",{id:"wmDynamicBuilder",className:"scrollY"}),
								],
							},
							{ //friends tab
								text:"Friend Tracker",
								image:null,
								content:[
									createElement("div",{className:"header",textContent:"Friend Tracker"}),
									createElement("div",{className:"headerCaption",textContent:"Track player friends and your interactions with them."}),
									createElement("div",{className:"toolBox medium columnRight"},[
										createElement("span",{className:"littleButton oddOrange",title:"Clean Now",onclick:function(){WM.friendTracker.clearAll();}},[
											createElement("img",{className:"resourceIcon trash24"})
										]),
										
										createElement("label",{className:"indent",textContent:"Sort By: "}),
										createElement("select",{title:"Sort By:", onchange:function(){WM.friendTracker.sort({sortBy:this.value});} },[
											createElement("option",{value:"acceptCount",textContent:"acceptCount",title:"How many posts WM remembers as collected successfully from this user."}),
											createElement("option",{value:"failCount",textContent:"failCount",title:"How many posts WM remembers as failed from this user."}),
											createElement("option",{value:"id",textContent:"id",title:"The facebook id of the user."}),
											createElement("option",{value:"lastKnownPostDate",textContent:"lastKnownPostDate",title:"The date of the last known post WM received for this user."}),
											createElement("option",{value:"name",textContent:"name",title:"The name of the user, with last name first."}),
											createElement("option",{value:"postCount",textContent:"postCount",title:"How many posts WM remembers receiving related to this user."}),
											createElement("option",{value:"totalCount",textContent:"totalCount",title:"How many posts WM remembers failed OR accepted from this user."})
										]),
										createElement("span",{className:"littleButton oddGreen",title:"Sort Ascending",onclick:function(){WM.friendTracker.sort({sortOrder:"asc"});}},[createElement("img",{className:"resourceIcon sortAsc24"})]),
										createElement("span",{className:"littleButton oddOrange",title:"Sort Descending",onclick:function(){WM.friendTracker.sort({sortOrder:"desc"});}},[createElement("img",{className:"resourceIcon sortDesc24"})]),
									]),
									WM.console.friendBuild=createElement("div",{id:"wmFriendTracker",className:"scrollY"}),
								],
							},
							{ //options tab
								text:"Options",
								image:null,
								content:[
									createElement("div",{className:"header",textContent:"Options"}),
									createElement("div",{className:"headerCaption",textContent:"Manage script and sidekick configuration, or link to updates."}),
									//config menu button
									createElement("div",{},[
										createElement("label",{textContent:"Open the options menu: "}),
										WM.console.configButton=createElement("button",{
											className:"jsfHidden",
											textContent:"WM Options",											
											onclick:function(){
												//open options menu
												WM.config.open();
											},
										}),
									]),
									//update script button
									createElement("div",{},[
										createElement("label",{textContent:"Update Script (Current Version: "+WM.version+") :"}),
										createElement("button",{
											className:"",
											textContent:"Update Script",
											onclick:function(){
												//open update url in new window/tab
												window.open(WM.scriptUpdateURL,"_blank");
											},
										}),
									]),									
								],
							},
						]
					})).node
				]), intendedPositionNode);
				//debug.print(newNodeBody);

				//destroy facebook content on page
				//if ($("content")) $("content").style.display="none !important";
				
				//init sort order
				$("wmSortBy").value=WM.quickOpts.sortBy;

				//init group order
				$("wmGroupBy").value=WM.quickOpts.groupBy;

				//init display mode
				with (WM.console.feedNode){
					className = className.toggleWordB(["1","3"].inArray(WM.quickOpts.displayMode),"short");						
				}
				WM.setDisplayCols({cols:WM.quickOpts.displayCols});				
			}
			WM.console.initialized = true;

			//give sidekicks time to dock
			if (params["callback"]||null) {
				var fx = params["callback"];
				delete params["callback"];
				doAction(fx);
			}
			
		}catch(e){log("WM.console.init: "+e);}},
		
	}; //end WM.console	

})();