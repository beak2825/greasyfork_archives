// ==UserScript==
// @name          	WM Feed Manager Objects
// @namespace       MerricksdadWMFeedManagerObjects
// @description	This is the host object which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.4
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

//***************************************************************************************************************************************
//***** Feed Objects
//***************************************************************************************************************************************
	WM.feedManager = {
		feeds : [],
		
		init : function(){
			var feedsIn=(getOptJSON("feeds3_"+WM.currentUser.profile)||[]);
			var feedsInGlobal=(getOptJSON("feeds3_global")||[]);
			
			if (isArrayAndNotEmpty(feedsIn)) {
				//import feeds from storage
				for (var f=0;f<feedsIn.length;f++){
					feed=feedsIn[f];
					if (!feed.isGlobal){
						WM.feedManager.feeds.push(new WM.Feed(feed));
					} else {
						var glob=feedsInGlobal[feed.uniqueID]||null;
						if (glob){
							var merge=mergeJSON(glob,feed);
							WM.feedManager.newFeed(merge);
							glob.alreadyUsed=true;
						} else {
							log("WM.feedManager.init: Global feed missing, cannot merge");
						}
					}
				}
			} else {
				//never been used before, create base feeds
				WM.feedManager.feeds.push(new WM.Feed({title:"My Home Feed", url:"https://graph.facebook.com/me/home", isRemoveable:false}));
				//WM.feedManager.feeds.push(new WM.Feed({title:"My Profile Wall", url:"https://graph.facebook.com/me/feed", isRemoveable:false}));
				
				//import oldstyle feeds
				var feedsOld=getOpt("feeds_"+WM.currentUser.profile);
				if (feedsOld){
					feedsOld=feedsOld.split("\n");
					if (isArrayAndNotEmpty(feedsOld)) for (var f=0;f<feedsOld.length;f++) {
						//prevent empties
						if (feedsOld[f]) {
							//create the new feed
							WM.feedManager.newFeed({id:feedsOld[f],title:feedsOld[f]});
						}
					}
				}
				WM.feedManager.save();
			}
			//import all global feeds not already accounted for
			for (var t in feedsInGlobal) {
				var glob=feedsInGlobal[t];
				if (!glob.alreadyUsed){
					glob.uniqueID=t;
					glob.isGlobal=true;
					WM.feedManager.newFeed(glob); //newFeed adds app filters, where New Feed() does not
				}
			}
		},
		
		newFeed : function(params){
			params=params||{};
			var feed = new WM.Feed(params);
			WM.feedManager.feeds.push(feed);
			
			//add filters for each app available
			for (var a in WM.apps){
				feed.addFilter({id:"app_"+a});
			}
		},
		
		save :function(){
			var retFeeds=[];
			var retGlobal={};
			
			if (isArrayAndNotEmpty(WM.feedManager.feeds)) for (var f=0,len=WM.feedManager.feeds.length; f<len; f++){
				var feed=WM.feedManager.feeds[f];
				if (!feed.isGlobal) {
					retFeeds.push(feed.saveableData);
				} else {
					retFeeds.push({isGlobal:true, uniqueID:feed.uniqueID, enabled:feed.enabled, expanded:feed.expanded});
					var glob=feed.saveableData;
					glob.uniqueID=feed.uniqueID;
					retGlobal[feed.uniqueID]=glob;
				}
			}
			setOptJSON("feeds3_"+WM.currentUser.profile,retFeeds);
			setOptJSON("feeds3_global",retGlobal);
		},
		
	};

//***************************************************************************************************************************************
//***** FeedFilter Class
//***************************************************************************************************************************************
	WM.FeedFilter = function(params){try{
		this.objType="feedFilter";
		params=params||{};
		var self=this;
		
		//set defaults
		this.enabled=true;
		this.expanded=true;
		this._olderLimitReached=false;
		//initialize edges to the collector startup time
		this.oldedge=Math.round(timeStamp()/1000); //older edge timestamp
		this.newedge=Math.round(timeStamp()/1000); //newer edge timestamp
		
		//use passed params
		for (var p in params) this[p]=params[p];

		this.enable=function(){try{
			this.enabled=true;
			this.node.className=this.node.className.removeWord("disabled");
			WM.feedManager.save();
		}catch(e){log("WM.FeedFilter.enable: "+e);}};

		this.disable=function(){try{
			this.enabled=false;
			this.node.className=this.node.className.addWord("disabled");
			WM.feedManager.save();
		}catch(e){log("WM.FeedFilter.disable: "+e);}};

		this.toggle=function(){try{
			this.enabled=this.toggleNode.checked;
			this.node.className=this.node.className.swapWordB(this.enabled,"enabled","disabled");
			WM.feedManager.save();
		}catch(e){log("WM.FeedFilter.toggle: "+e);}};

		this.toggleContent=function(){try{
			this.expanded=!this.expanded;
			var btnSize=WM.opts.littleButtonSize;
			with (this.contentNode)
				className=className.swapWordB(this.expanded,"expanded","collapsed");
			with (this.toggleImgNode)
				className=className.swapWordB(this.expanded,"treeCollapse"+btnSize,"treeExpand"+btnSize);
			WM.feedManager.save();
		}catch(e){log("WM.FeedFilter.toggleContent: "+e);}};
		
		//remove this
		this.remove=function(){try{
			if (this.node) remove(this.node);
			if (this.parent) delete this.parent.filters[this.id];
			WM.feedManager.save();
		}catch(e){log("WM.FeedFilter.remove: "+e);}};
		
		//fetch posts for this
		this.fetchNewer=function(){try{
			WM.fetch({
				newer:true,
				apps:WM.apps[this.appID],
				feeds:[this.parent],
				bypassPause:true,
				bypassAppDisabled:true,
				bypassFeedDisabled:true,
				bypassFilterDisabled:true,
			});
		}catch(e){log("WM.FeedFilter.fetchNewer: "+e);}};

		this.fetchOlder=function(){try{
			WM.fetch({
				older:true,
				apps:WM.apps[this.appID],
				feeds:[this.parent],
				bypassPause:true,
				bypassAppDisabled:true,
				bypassFeedDisabled:true,
				bypassFilterDisabled:true,
			});
		}catch(e){log("WM.FeedFilter.fetchOlder: "+e);}};
		
		this.__defineGetter__("olderLimitReached",function(){try{
			return this._olderLimitReached;
		}catch(e){log("WM.FeedFilter.olderLimitReached: "+e);}});
		
		this.__defineSetter__("olderLimitReached",function(v){try{
			this._olderLimitReached=v;
			//update the sidekick page button graphics
			var node=this.olderLimitNode;
			if (node) node.textContent=v;
			if (v) {
				WM.rulesManager.doEvent("onFeedFilterOlderLimitReached",this);
			}
		}catch(e){log("WM.FeedFilter.olderLimitReached: "+e);}});

		this.__defineGetter__("appID",function(){try{
			//this assumes its an app filter because so far thats all we use
			return this.id.removePrefix("app_");
		}catch(e){log("WM.FeedFilter.appID: "+e);}});

		this.__defineGetter__("appName",function(){try{
			//this assumes its an app filter because so far thats all we use
			//it also assumes app objects are global, which they are
			//but that they are also available and already filled in by the sidekick, which they may not be
			var a = WM.apps[this.appID];
			if (a!=undefined) {
				//debug.print([this.appID,a]);
				return a.name;
			}
			return "";
		}catch(e){log("WM.FeedFilter.appName: "+e);}});
		
		//draw it
		try{
			if (this.parent.filtersNode) this.parent.filtersNode.appendChild(
				this.node=createElement("div",{className:"listItem "+((this.enabled)?"enabled":"disabled")},[
					createElement("div",{className:"line"},[
						createElement("div",{className:"littleButton",title:"Toggle Content",onclick:function(){self.toggleContent();}},[
							this.toggleImgNode=createElement("img",{className:"resourceIcon "+(this.expanded?"treeCollapse"+WM.opts.littleButtonSize:"treeExpand"+WM.opts.littleButtonSize)}),
						]),
						this.toggleNode=createElement("input",{type:"checkbox",checked:this.enabled,onchange:function(){
							self.enabled=this.checked;
							with (self.node) className=className.toggleWordB(!this.checked,"disabled");
							WM.feedManager.save();
						}}),
						createElement("span",{textContent:this.appName + " (" + this.id + ")"}),
						
						//toolbox
						/*createElement("div",{className:"littleButton oddBlue", title:"Fetch Newer"},[
							this.fetchNewerButton=createElement("img",{className:"resourceIcon rssUpRight"+WM.opts.littleButtonSize,onclick:function(){self.fetchNewer();} })
						]),
						createElement("div",{className:"littleButton", title:"Fetch Older"},[
							this.fetchOlderButton=createElement("img",{className:"resourceIcon rssDownLeft"+WM.opts.littleButtonSize,onclick:function(){self.fetchOlder();} })
						]),*/
					]),
					this.contentNode=createElement("div",{className:"subsection "+(this.expanded?"expanded":"collapsed")},[
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"Older Limit Reached: ",title:"Reports if this filter has reached the user defined oldest post limit."}),
							this.olderLimitNode=createElement("span",{textContent:this.olderLimitReached}),
						]),
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"Newer Edge: ",title:"A Unixtime indicator of the newest post-time you have fetched for this filter."}),
							this.newedgeNode=createElement("span",{textContent:this.newedge}),
						]),
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"Older Edge: ",title:"A Unixtime indicator of the oldest post-time you have fetched for this filter."}),
							this.oldedgeNode=createElement("span",{textContent:this.oldedge}),
						]),
					]),
				])
			);
		}catch(e){log("WM.FeedFilter.init:addManagerElement: "+e);};				
		
		return self;
	}catch(e){log("WM.FeedFilter.init: "+e);}};

//***************************************************************************************************************************************
//***** Feed Class
//***************************************************************************************************************************************
	WM.Feed = function(params){try{
		this.objType="feed";
		params=params||{};
		var self=this;

		//set defaults
		this.enabled=true;
		this.expanded=true;
		this.url="";
		this.id="";
		this.filters={};
		this.feedName="";
		this.isRemoveable=true; //set to false on own feeds
		this.title="New Feed";
		this._isGlobal=false;

		//use passed params
		var newFilters=params.filters||{};
		delete params.filters;
		
		this.__defineGetter__("isGlobal",function(){try{
			return this._isGlobal;
		}catch(e){log("WM.Feed.isGlobal: "+e);}});
		
		this.__defineSetter__("isGlobal",function(v){try{			
			if (!v) {
				if (!confirm("Disabling profile sharing on this feed will prevent other users on this machine from loading it. Are you sure you wish to make this feed locally available only?")) return;
			}
		
			this._isGlobal=v;
			
			//make sure we have a uniqueID
			//but don't destroy one that already exists
			if (v && !exists(this.uniqueID)) this.uniqueID = unique();
			
			//change the color/icon of the isGlobal button
			if (this.toggleGlobalButton) {
				var s=WM.opts.littleButtonSize;
				with (this.toggleGlobalButton) className=className.swapWordB(v,"removeGlobal"+s,"addGlobal"+s);
				with (this.toggleGlobalButton.parentNode) {
					className=className.swapWordB(v,"oddOrange","oddGreen");
					title=(v)?"Disable Profile Sharing":"Share With Other Profiles";
				}
			}
		}catch(e){log("WM.Feed.isGlobal: "+e);}});
		
		this.__defineGetter__("saveableData",function(){try{
			var ret={};
			
			ret.title=this.title;
			ret.enabled=this.enabled;
			ret.expanded=this.expanded;
			ret.isRemoveable=this.isRemoveable;
			ret.url=this.url;
			if (this.isRemoveable) ret.id=this.id;
			
			//capture filters
			ret.filters={};
			for (var f in this.filters) {
				ret.filters[f]={
					enabled:this.filters[f].enabled,
					expanded:this.filters[f].expanded,
					id:this.filters[f].id,
				};
			}
			
			return ret;
		}catch(e){log("WM.Feed.saveableData: "+e);}});		
				
		for (var p in params) this[p]=params[p];

		this.enable=function(){try{
			this.enabled=true;
			this.node.className=this.node.className.removeWord("disabled");
			WM.feedManager.save();
		}catch(e){log("WM.Feed.enable: "+e);}};

		this.disable=function(){try{
			this.enabled=false;
			this.node.className=this.node.className.addWord("disabled");
			WM.feedManager.save();
		}catch(e){log("WM.Feed.disable: "+e);}};

		this.toggle=function(){try{
			this.enabled=this.toggleNode.checked;
			this.node.className=this.node.className.swapWordB(this.enabled,"enabled","disabled");
			WM.feedManager.save();
		}catch(e){log("WM.Feed.toggle: "+e);}};

		//create a filter for a specific app
		//filter id must be "app_"+appID
		//will not add duplicates
		this.addFilter=function(params){try{
			var isNew=!exists(params);
			params=params||{};
			params.parent=this;
			
			//prevent duplicates
			if (!exists(this.filters[params.id])) {
				return (this.filters[params.id]=new WM.FeedFilter(params));
				if (isNew) WM.feedManager.save();
			} else {
				return this.filters[params.id];
			}
		}catch(e){log("WM.Feed.addFilter: "+e);}};	

		//get the extents of the feed by merging all feed filter oldedge/newedge values
		this.getMergedEdges=function(params){
			/*
				apps[]: an array of appID's to test against, otherwise read from all filters
			*/
			
			//console.log("getMergedEdges: "+JSON.stringify(params));
			
			
			var retval = {newedge:Math.round(timeStamp()/1000), oldedge:0};
			
			if (params.apps||null){
				for (var c=0,l=params.apps.length;c<l;c++){
					var filter = this.filters["app_"+params.apps[c]];
					if (filter||null){
						//get the youngest older edge and oldest newer edge so we don't lose posts because one feed is more active.
						//this forces them to run at the same edges after the first pull
						retval.newedge = Math.min(retval.newedge, filter.newedge);
						retval.oldedge = Math.max(retval.oldedge, filter.oldedge);
					} else {
						log("getMergedEdges: no filter matching app_"+params.apps[c]+" on feed " + this.id);
					}
				}
			} else {
				for (var name in this.filters){
					var filter = this.filters[name];
					if (filter||null){
						//get the youngest older edge and oldest newer edge so we don't lose posts because one feed is more active.
						//this forces them to run at the same edges after the first pull
						retval.newedge = Math.min(retval.newedge, filter.newedge);
						retval.oldedge = Math.max(retval.oldedge, filter.oldedge);
					} else {
						log("getMergedEdges: no filter matching "+name+" on feed " + this.id);
					}
				}
				
			}
			
			return retval;
			
		};
		
		//remove this
		this.remove=function(noConfirm){try{
			if (this.isRemoveable) {
				var ask=WM.opts.feedsConfirmDeleteFeed;
				if (noConfirm || (this.isGlobal && confirm("This feed is shared with other profiles. Deleting it here will prevent it from loading for other users. Are you sure you wish to delete this feed and its filters.")) || !ask || (!this.isGlobal && ask && confirm("Delete feed and all of its filters?"))){
					//remove my data
					if (this.node) remove(this.node);
					WM.feedManager.feeds.removeByValue(this);
					
					WM.feedManager.save();
				}
			}
		}catch(e){log("WM.Feed.remove: "+e);}};

		//fetch posts for this
		this.fetchNewer=function(){try{
			WM.fetch({
				newer:true,
				feeds:[self],
				bypassPause:true,
				bypassAppDisabled:true,
				bypassFeedDisabled:true,
			});
		}catch(e){log("WM.Feed.fetchNewer: "+e);}};

		this.fetchOlder=function(){try{
			WM.fetch({
				older:true,
				feeds:[self],
				bypassPause:true,
				bypassAppDisabled:true,
				bypassFeedDisabled:true,
			});
		}catch(e){log("WM.Feed.fetchOlder: "+e);}};

		this.toggleContent=function(){try{
			this.expanded=!this.expanded;
			var btnSize=WM.opts.littleButtonSize;
			with (this.contentNode)
				className=className.swapWordB(this.expanded,"expanded","collapsed");
			with (this.toggleImgNode)
				className=className.swapWordB(this.expanded,"treeCollapse"+btnSize,"treeExpand"+btnSize);
			WM.feedManager.save();
		}catch(e){log("WM.Feed.toggleContent: "+e);}};

		if (this.id && !this.url) this.url="https://graph.facebook.com/"+this.id+"/feed";
		
		//draw it
		try{
			WM.console.feedManagerNode.appendChild(
				this.node=createElement("div",{className:"listItem "+((this.enabled)?"enabled":"disabled")},[
					createElement("div",{className:"line"},[
						createElement("div",{className:"littleButton",title:"Toggle Content",onclick:function(){self.toggleContent();}},[
							this.toggleImgNode=createElement("img",{className:"resourceIcon "+(this.expanded?"treeCollapse"+WM.opts.littleButtonSize:"treeExpand"+WM.opts.littleButtonSize)}),
						]),
						this.toggleNode=createElement("input",{type:"checkbox",checked:this.enabled,onchange:function(){
							self.enabled=this.checked; 
							with (self.node) className=className.toggleWordB(!this.checked,"disabled");
							WM.feedManager.save();
						}}),
						this.titleNode=createElement("input",{value:(this.title||""), onchange:function(){self.title=this.value; WM.feedManager.save();}}),
						
						//toolbox
						/*createElement("div",{className:"littleButton oddBlue", title:"Fetch Newer"},[
							this.fetchNewerButton=createElement("img",{className:"resourceIcon rssUpRight"+WM.opts.littleButtonSize,onclick:function(){self.fetchNewer();} })
						]),
						createElement("div",{className:"littleButton", title:"Fetch Older"},[
							this.fetchOlderButton=createElement("img",{className:"resourceIcon rssDownLeft"+WM.opts.littleButtonSize,onclick:function(){self.fetchOlder();} })
						]),*/
						(this.isRemoveable)?createElement("div",{className:"littleButton oddOrange", title:"Remove Feed"},[
							this.removeButtonNode=createElement("img",{className:"resourceIcon trash"+WM.opts.littleButtonSize,onclick:function(){self.remove();} })
						]):null,
						
						(this.isRemoveable)?createElement("div",{className:"indent littleButton "+((this.isGlobal)?"oddOrange":"oddGreen"), title:((this.isGlobal)?"Disable Profile Sharing":"Share With Other Profiles")},[
							this.toggleGlobalButton=createElement("img",{className:"resourceIcon "+((this.isGlobal)?"removeGlobal":"addGlobal")+WM.opts.littleButtonSize,onclick:function(){self.isGlobal=!self.isGlobal; WM.feedManager.save();}})
						]):null,

					]),
					this.contentNode=createElement("div",{className:"subsection "+(this.expanded?"expanded":"collapsed")},[
						(this.isRemoveable)?createElement("div",{className:"line"},[
							createElement("label",{textContent:"Target FB Entity: ",title:"The request address from where WM gets posts for this fb entity."}),
							this.idNode=createElement("input",{value:(this.id||""), onchange:function(){
								self.id=this.value;
								self.url="https://graph.facebook.com/"+this.value+"/feed";
								self.urlNode.textContent=self.url;
								WM.feedManager.save();
							}}),
							createElement("label",{textContent:"URL: ",title:"The request address from where WM gets posts for this fb entity."}),
							this.urlNode=createElement("span",{textContent:this.url}),
						]):null,
						//app filters sub box
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"App Filters: ",title:"This is a list of filters run on this feed by apps you collect for. Only filters for sidekick-supported apps are used."}),
							this.filtersNode=createElement("div",{className:"subsection"}),
						]),
					]),
				])
			);
		}catch(e){log("WM.Feed.init:addManagerElement: "+e);};		
		
		//add any passed filters
		for (var f in newFilters){
			this.addFilter(newFilters[f]);
		}
		
		return self;
	}catch(e){log("WM.Feed.init: "+e);}};
	

})();