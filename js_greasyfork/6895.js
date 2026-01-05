// ==UserScript==
// @name          	WM App Object
// @namespace       MerricksdadWMAppObject
// @description	This is the app class which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.4
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

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

	
//***************************************************************************************************************************************
//***** App Class
//***************************************************************************************************************************************
	WM.App = function(params){try{
		this.objType="app";
		var self=this;
	
		//expected: id, name, namespace, icon
		params=params||{};

		//create the masterswitch
		var testms=WM.quickOpts.masterSwitch[params.appID];
		WM.quickOpts.masterSwitch[params.appID]=(testms==null||testms=="undefined")?true:testms;

		//set defaults
		this._enabled=WM.quickOpts.masterSwitch[params.appID]||false;
		this._paused=false;
		this.tests={};
		this.typesPaused=[];
		this.pausedTypesListNodes={};
		this._acceptCount=0;
		this._failCount=0;
		this.node=null;
		this.expanded=false;
		this.kids=[]; //contains additional filtered apps
		
		//setup config for this sidekick
		this.opts = {};
		this.config = new Config({
			storageName:"settings_"+params.appID+"_"+(WM.quickOpts.useGlobalSettings?"global":WM.currentUser.profile),
			onSave:WM.onSave,
			title:"FB Wall Manager "+WM.version+(WM.quickOpts.useGlobalSettings?" (!! Global Settings !!)":""),
			logo:createElement("span",{}[
				createElement("img",{className:"logo",src:"",textContent:"v"+WM.version}),
				createElement("text","v"+WM.version)
			]),
			css:(
				WM.console.dynamicIcons()+
				jsForms.globalStyle()
			),
			settings:{
				btn_useGlobal:{
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
							this.config.title = "FB Wall Manager "+WM.version+" (!! Global Settings !!))";
							this.config.storageName = "settings_"+params.appID+"_global";
							this.config.values=this.config.read();
							this.config.configure();
							this.config.reload();
						}
					},
				},
				btn_useOwnProfile:{
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
							this.config.title = "FB Wall Manager "+WM.version;
							this.config.storageName = "settings_"+params.appID+"_"+WM.currentUser.profile;
							this.config.values=this.config.read();
							this.config.configure();
							this.config.reload();
						}
					},
				},
			
			},
		});
		
		//setup user defined accept texts
		try{
			if (WM.quickOpts.userDefinedTypes) {
				this.userDefinedTypes=WM.quickOpts.userDefinedTypes[params.appID]||{};
			} else {
				this.userDefinedTypes={}; //create a default here
				WM.quickOpts.userDefinedTypes={};
				WM.quickOpts.userDefinedTypes[params.appID]={};
				WM.saveQuickOpts();
			}
		}catch(e){log("WM.App.init: userDefinedTypes: "+e);}

		//use passed params
		for (var p in params) this[p]=params[p];

		//enable/disable all sidekick functions
		this.enable=function(){try{this.enabled=true;}catch(e){log("WM.App.enable: "+e);}};
		this.disable=function(){try{this.enabled=false;}catch(e){log("WM.App.disable: "+e);}};
		this.toggle=function(){try{this.enabled=!this.enabled;}catch(e){log("WM.App.toggle: "+e);}};

		//pause collection for this app
		this.pause=function(){try{this.paused=true;}catch(e){log("WM.App.pause: "+e);}}
		this.unPause=function(){try{this.paused=false;}catch(e){log("WM.App.unPause: "+e);}}

		//user defined types
		this.addUDT=function(params,drawOnly){try{
			//validate params or ask for input
			if (!exists(params) || !params.id) {
				params=params||{};
				var udtname=prompt("Enter the text name of the bonus type you wish to make (ie 'Horse')\n","");
				var udtid=this.appID+udtname.noSpaces().toLowerCase();
				udtid=prompt("OK, your type will read as '"+udtname+"'.\nNow modify this bonus type code to suit your needs.\n\nTip: You should prefix this code with the appID '"+this.appID+"', but it is not required.\nTip: Most sidekicks use lowercase and no spaces, but again, this is not a requirement.\n", udtid);
				if (udtid.trim()){
					params.id=udtid.trim();
					params.name=udtname;
				} else {
					alert("You supplied a blank user defined type ID. No type was created.");
					return false;
				}
			}
			if (!drawOnly){
				this.userDefinedTypes[params.id]=params.name;
				WM.quickOpts.userDefinedTypes[this.appID]=this.userDefinedTypes;
				WM.saveQuickOpts();
			}
			
			//draw the udt node
			if (this.udtNode){
				this.udtNode.appendChild(
					createElement("div",{className:"listItem"},[
						createElement("label",{textContent:params.id+" : "}),
						createElement("input",{value:params.name,title:"The display name of this type, used wherever bonus types are identified or selected.", onchange:function(){
							self.userDefinedTypes[params.id]=this.value;
							WM.quickOpts.userDefinedTypes[self.appID]=self.userDefinedTypes;
							WM.saveQuickOpts();
						}}),
						createElement("div",{className:"littleButton oddOrange", title:"Remove User-Defined Type"},[
							createElement("img",{className:"resourceIcon trash" +WM.opts.littleButtonSize,onclick:function(){
								var ask=WM.opts.appsConfirmDeleteUDT;
								if (!ask || (ask && confirm("Delete User Defined Type?"))) {
									delete self.userDefinedTypes[params.id];
									WM.quickOpts.userDefinedTypes[self.appID]=self.userDefinedTypes;
									WM.saveQuickOpts();
									remove (this.parentNode.parentNode);
								}
							}})
						]),
						(this.accText[params.id]||null)?createElement("span",{title:"The type id you created exactly matches one provided by the sidekick for this app. If you did not intend to overwrite that bonus's display text, you may wish to create another type id and destroy this one.",style:"color:red;",textContent:"Overwrites a sidekick-provided bonus type id."}):null,
					])
				);
			}			
		}catch(e){log("WM.App.addUDT: "+e);}}

		//unpause all bonus types for this app
		this.unpauseAllTypes=function(){try{
			for (var i=this.typesPaused.length-1;i>=0;i--){
				WM.unPauseByType(this,this.typesPaused[i]);
			}
		}catch(e){log("WM.App.unpauseAllTypes: "+e);}};


		//mass set priority for entire app post collection
		this.setPriority=function(n){try{
			for (var p in WM.posts) {
				var post=WM.posts[p];
				if (post.app==this) post.setPriority(n);
			}
		}catch(e){log("WM.App.setPriority: "+e);}};

		//mass set priority for all posts of type
		this.setPriorityByType=function(w,n){try{
			for (var p in WM.posts) {
				var post=WM.posts[p];
				if (post.app==this && post.which==w) post.setPriority(n);
			}
		}catch(e){log("WM.App.setPriorityByType: "+e);}};
		
		//reset accept/fail counters
		this.resetCounter=function(){try{
			this.acceptCount=0; 
			this.failCount=0;
		}catch(e){log("WM.App.resetCounter: "+e);}};

		//reset all config options for this app
		//except those outside the standard branch (dontsteal,blockautolike,etc.)
		this.resetConfig=function(){try{
			var ask=WM.opts.configConfirmRestore;
			if (!ask || (ask && confirm("Restore sidekick settings to defaults?"))) {
				this.config.configure({reset:true});
				this.config.save();
			}
		}catch(e){log("WM.App.resetConfig: "+e);}};		
		
		//fetch posts only for this app
		//normally used for initial fetching only
		this.fetchPosts=function(){try{
			WM.fetch({bypassPause:true, apps:this});
		}catch(e){log("WM.App.fetchPosts: "+e);}};

		this.fetchNewer=function(){try{
			WM.fetch({
				newer:true,
				apps:this,
				bypassPause:true,
				bypassAppDisabled:true
			});
		}catch(e){log("WM.App.fetchNewer: "+e);}};

		this.fetchOlder=function(){try{
			WM.fetch({
				older:true,
				apps:this,
				bypassPause:true,
				bypassAppDisabled:true
			});
		}catch(e){log("WM.App.fetchOlder: "+e);}};

		//get a list of posts for this app from the global posts list
		this.__defineGetter__("posts",function(){try{
			return matchByParam(WM.posts,"app",this,"object");
		}catch(e){log("WM.App.getPosts: "+e);}});
		
		//detect if this sidekick said it was chrome compatible
		this.__defineGetter__("isVer3",function(){try{
			return this.flags.postMessageCompatible || this.flags.worksInChrome;
		}catch(e){log("WM.App.isVer3: "+e);}});

		//detect if is paused
		this.__defineGetter__("paused",function(){try{
			return this._paused;
		}catch(e){log("WM.App.paused: "+e);}});
		this.__defineSetter__("paused",function(v){try{
			this._paused=v;
			//update the sidekick page button graphics
			var btn=this.pauseButtonNode;
			if (btn) {
				var btnSize=WM.opts.littleButtonSize;
				with (btn.parentNode) 
					className=className.swapWordB(this._paused,"oddGreen","oddOrange");
				with (btn) 
					className=className.swapWordB(this._paused,"playRight"+btnSize,"pause"+btnSize);
			}
			//do events
			if (this._paused) WM.rulesManager.doEvent("onAppPaused",this);
			else WM.rulesManager.doEvent("onAppUnpaused",this);			
		}catch(e){log("WM.App.paused: "+e);}});
		
		//detect if is enabled
		this.__defineGetter__("enabled",function(){try{
			return this._enabled;
		}catch(e){log("WM.App.enabled: "+e);}});
		this.__defineSetter__("enabled",function(v){try{
			this._enabled=v;
			
			//update the WM.quickOpts
			WM.quickOpts.masterSwitch[this.appID]=this._enabled;
			WM.saveQuickOpts();
			
			//update the sidekick page graphics
			if (this.toggleNode) this.toggleNode.checked=this._enabled;
			if (this.node) with (this.node){
				className=className.swapWordB(this._enabled,"enabled","disabled");
			}
			
			//do events
			if (this._enabled) WM.rulesManager.doEvent("onAppEnabled",this);
			else WM.rulesManager.doEvent("onAppDisabled",this);
		}catch(e){log("WM.App.enabled: "+e);}});
				
		this.__defineGetter__("acceptCount",function(){try{
			return this._acceptCount;
		}catch(e){log("WM.App.acceptCount: "+e);}});
		this.__defineSetter__("acceptCount",function(v){try{
			this._acceptCount=v;
			if (this.acceptCounterNode) this.acceptCounterNode.textContent=v;
		}catch(e){log("WM.App.acceptCount: "+e);}});
		
		this.__defineGetter__("failCount",function(){try{
			return this._failCount;
		}catch(e){log("WM.App.failCount: "+e);}});
		this.__defineSetter__("failCount",function(v){try{
			this._failCount=v;
			if (this.failCounterNode) this.failCounterNode.textContent=v;
		}catch(e){log("WM.App.failCount: "+e);}});

		this.__defineGetter__("totalCount",function(){try{
			return this._failCount+this._acceptCount;
		}catch(e){log("WM.App.totalCount: "+e);}});

		//detect if this app is bundled with another app
		//return the main app in this bundle
		this.__defineGetter__("synApp",function(){try{
			return this.parent||this;
		}catch(e){log("WM.App.synApp: "+e);}});
		
		this.toggleContent=function(){try{
			this.expanded=!this.expanded;
			var btnSize=WM.opts.littleButtonSize;
			with (this.contentNode)
				className=className.swapWordB(this.expanded,"expanded","collapsed");
			with (this.toggleImgNode)
				className=className.swapWordB(this.expanded,"treeCollapse"+btnSize,"treeExpand"+btnSize);
		}catch(e){log("WM.App.toggleContent: "+e);}};

		this.showConfig=function(){try{
			this.config.open();
		}catch(e){log("WM.App.showConfig: "+e);}};

		this.disableOpt=function(w){try{
			this.opts[w]=false;
			this.config.set(w,false);
			this.config.save();
		}catch(e){log("WM.App.disableOpt: "+e);}};

		this.enableOpt=function(w){try{
			this.opts[w]=true;
			this.config.set(w,true);
			this.config.save();
		}catch(e){log("WM.App.enableOpt: "+e);}};
		
		//add menu elements
		try{
			/* no longer used in WM3
			if (this.menu) {
				//prefix all menu elements with the appID
				this.menu=WM.dock.fixMenu(this.menu,this.appID);
				//append this app's menu settings
				this.settingsBranch=WM.config.append({branch:"wmtab_games",data:this.menu});
			}
			//prefix all test returns with the appID
			WM.dock.fixTests(this.tests,this);
			//prefix all accept text id's with the appID
			WM.dock.fixAcceptTexts(this);
			*/
			
			//new method
			if (this.menu) this.config.append({data:this.menu});
			
			//I should really move these into the sidekick realm
			var data={}; 
			data["dynamic"+this.appID]=checkBox(this.name+" ("+this.appID+")",true);
			WM.config.append({branch:"enableDynamic",data:data});

			data={}; data[this.appID+"dontsteal"]=checkBox(this.name);
			WM.config.append({branch:"dontstealBlock",data:data});
			
			data={}; data["hide"+this.appID]=checkBox(this.name);
			WM.config.append({branch:"filterapps",data:data});
			
			data={}; data["nolike"+this.appID]=checkBox(this.name);
			WM.config.append({branch:"blockautolikebygame",data:data});
		} catch(e) {log("WM.App.init:addMenuElements: "+e);};
					
		//draw to #sidekickList (WM.console.sidekickNode)
		try{
			WM.console.sidekickNode.appendChild(
				this.node=createElement("div",{className:"listItem "+((this.enabled)?"enabled":"disabled")},[
					createElement("div",{className:"line"},[
						createElement("div",{className:"littleButton",title:"Toggle Content",onclick:function(){self.toggleContent();}},[
							this.toggleImgNode=createElement("img",{className:"resourceIcon "+(this.expanded?"treeCollapse"+WM.opts.littleButtonSize:"treeExpand"+WM.opts.littleButtonSize)}),
						]),
						this.toggleNode=createElement("input",{type:"checkbox",checked:this.enabled,onchange:function(){
							self.enabled=this.checked;
							with (self.node) className=className.toggleWordB(!this.checked,"disabled");
						}}),
						(this.icon)?createElement("img",{className:"icon crisp", src:this.icon,style:"width: 32px;vertical-align: middle"}):null,
						createElement("label",{textContent: this.name}),
						
						//toolbox
						createElement("div",{className:"littleButton odd"+(this.paused?"Green":"Orange"), title:"Pause/Unpause"},[
							this.pauseButtonNode=createElement("img",{className:"resourceIcon "+(this.paused?"playRight":"pause")+WM.opts.littleButtonSize,onclick:function(){self.paused=!self.paused;}})]),
						createElement("div",{className:"littleButton oddBlue", title:"Reset config for this app"},[
							createElement("img",{className:"resourceIcon uncheckAll"+WM.opts.littleButtonSize,onclick:function(){self.resetConfig();}})]),
						//createElement("div",{className:"littleButton oddBlue", title:"Fetch Newer Posts"},[
							//createElement("img",{className:"resourceIcon rssUpRight"+WM.opts.littleButtonSize,onclick:function(){self.fetchNewer();}})]),
						//createElement("div",{className:"littleButton", title:"Fetch Older Posts"},[
							//createElement("img",{className:"resourceIcon rssDownLeft" +WM.opts.littleButtonSize,onclick:function(){self.fetchOlder();}})]),
						
						//new sidekick config button
						this.configButton=createElement("button",{textContent:"Options", onclick:function(){self.config.open();}}),
					]),
					this.contentNode=createElement("div",{className:"subsection "+(this.expanded?"expanded":"collapsed")},[
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"App ID:"}),
							createElement("span",{textContent:this.appID}),
						]),
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"Support Provided By:"}),
							(this.desc)?createElement("span",{textContent: this.desc}):null, //provided in sidekick block
						]),
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"Sidekick Help Link:"}),
							(this.helpLink)?createElement("a",{href:this.helpLink,textContent:this.helpLink}):null, //provided in sidekick block
						]),
						//browsers supported
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"Browsers Supported:",style:"vertical-align:top;"}),
							createElement("img",{className:"resourceIcon firefox16", style:"display:inline-block;",title:"FireFox"}),
							(this.isVer3)?createElement("img",{className:"resourceIcon chrome16", style:"display:inline-block;",title:"Google Chrome"}):null,
						]),
						//types paused subbox
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"Types Paused:",title:"This is a list of bonus types that are currently paused for this app."}),
							createElement("div",{className:"littleButton oddGreen",onclick:function(){self.unpauseAllTypes();},title:"Unpause all types by this app."},[
								createElement("img",{className:"resourceIcon playRight"+WM.opts.littleButtonSize}),
							]),
							this.typesPausedNode=createElement("div",{className:"subsection"}),
						]),				
						//attached apps
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"Attached Apps:",title:"Additional apps filtered and processed by this sidekick."}),
							this.filtersNode=createElement("div",{className:"subsection"}),
						]),
						//helpers subbox
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"Helpers:",title:"Sidekick helpers"}),
							this.helpersNode=createElement("div",{className:"subsection"}),
						]),
						//user defined types subbox
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"User-Defined Types:",title:"User Defined Types ('which')"}),
							createElement("div",{className:"littleButton oddGreen",onclick:function(){self.addUDT();},title:"Add New User Defined Type"},[
								createElement("img",{className:"resourceIcon plus"+WM.opts.littleButtonSize}),
							]),
							this.udtNode=createElement("div",{className:"subsection"}),
						]),
					]),
				])
			);
		}catch(e){log("WM.App.init:addSidekickElement: "+e);};
		
		//create feed filters for this app
		try{
			var feeds=WM.feedManager.feeds;
			for (var f=0,len=feeds.length;f<len;f++){
				feeds[f].addFilter({id:"app_"+this.appID});
			}
		}catch(e){log("WM.App.init:createFeedFilters: ")+e;}

		//draw to collection filter coolbar
		try{
			//create game filter buttons on the WM.console
			var coolBar = WM.console.collectTabControl;
			if (coolBar) {
				//add a tab for this filter
				var tab = coolBar.addTab({
					text:(this.name||""),
					image:(this.icon||null),
					appFilter:this.appID,
					onSelect:WM.setAppFilter,
					selected:(WM.quickOpts.filterApp==this.appID),
				});
				this.collectionTabNode=tab.buttonNode;
				
				//force the image to have the 'crisp' drawing style
				tab.buttonNode.childNodes[0].className="icon crisp";
				
				//add accept/fail counters
				this.failCount=0;
				this.acceptCount=0;
				tab.buttonNode.insertBefore(
					createElement("div",{className:"accFailBlock"},[
						this.failCounterNode=createElement("span",{className:"fail",textContent:"0"}),
						this.acceptCounterNode=createElement("span",{className:"accept",textContent:"0"}),
					])
				, tab.textNode);
			}
		} catch(e) {log("WM.App.init:addConsoleElement: "+e);};
		
		//show additional filtered apps
		try{
			if (isArrayAndNotEmpty(this.addFilters)) {
				for (var f,filt;(filt=this.addFilters[f]);f++){
					//create an app object for this filter
					filt.parent=this;
					this.kids.push(new WM.App(filt));
					if (this.filtersNode) this.filtersNode.appendChild(
						createElement("div",{className:"line"},[
							createElement("img",{className:"icon crisp", src:filt.icon||null}),
							createElement("text",filt.name),
						])
					);
				}
			}
		} catch(e) {log("WM.App.init:addFilteredApps: "+e);};
		
		//draw my user defined types
		try{
			for (var u in this.userDefinedTypes){
				this.addUDT({id:u,name:this.userDefinedTypes[u]},true);
			}
		}catch(e){log("WM.App.init: drawUDTs: "+e);}
		
		//do events
		WM.rulesManager.doEvent("onSidekickReady",this);
		
		return self;
	}catch(e){log("WM.App.init: "+e);}};



})();