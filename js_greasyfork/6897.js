// ==UserScript==
// @name          	WM Friend Tracker Objects
// @namespace       MerricksdadWMFriendTrackerObjects
// @description	This is the friend tracker system which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.0
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

//***************************************************************************************************************************************
//***** Friend Objects
//***************************************************************************************************************************************
	WM.friendTracker = {
		friends: {},
		
		init : function(){
			//import friends tracker data
			var friendsIn=getOptJSON('friends_'+WM.currentUser.profile)||[];
			if (isArrayAndNotEmpty(friendsIn)) for (var f=0,len=friendsIn.length;f<len;f++) {
				WM.friendTracker.newFriend(friendsIn[f],true);
			}
			WM.friendTracker.sort();
		},
		
		clean : function(){
			//clean friend tracker data
			var len=0;
			if (WM.opts.useFriendTracker && (len=WM.friendTracker.friends.length)) {
				var ageDays=WM.opts.trackDays*day;
				var timeNow=timeStamp();
				for (var f=0; f<len; f++){
					var friend=WM.friendTracker.friends[f];
					if (friend.data && friend.data.posts){
						for (var p in friend.data.posts){
							var post=friend.data.posts[p];
							if ((timeNow-(post.date*1000)) > ageDays) {
								delete friend.data.posts[p];
							}
						}
					}
				}
			}
		},
		
		clearAll : function(noConfirm){
			var ask=WM.opts.trackConfirmClearUser;
			if (noConfirm || !ask || (ask && confirm("Clear tracker history for all users?"))){
				for (var f in WM.friendTracker.friends){
					WM.friendTracker.friends[f].remove(true);
				}
			}			
		},
		
		newFriend : function(params,preventSort){
			params=params||{};
			var friend = new WM.Friend(params);
			WM.friendTracker.friends[friend.id]=friend;
			if (!preventSort) WM.friendTracker.sort();
			return friend;
		},

		save :function(){
			var ret=[];
			for (var f in WM.friendTracker.friends){
				ret.push(WM.friendTracker.friends[f].saveableData);
			}
			setOptJSON("friends_"+WM.currentUser.profile,ret);
		},
		
		sort : function(params){
			params=params||{};
			
			if (exists(params.sortBy)) WM.quickOpts.sortFriendsBy=params.sortBy;
			if (exists(params.sortOrder)) WM.quickOpts.sortFriendsOrder=params.sortOrder;
			WM.saveQuickOpts();

			var sortBy=params.sortBy||WM.quickOpts.sortFriendsBy||"name"
			var sortOrder=params.sortOrd||WM.quickOpts.sortFriendsOrder||"asc"
			
			var friendArray=[];
			for (var f in WM.friendTracker.friends) {
				friend=WM.friendTracker.friends[f];
				friendArray.push({id:friend[sortBy],node:friend.node});
			}
			
			if (["asc","ascending"].inArray(sortOrder)) friendArray.sort(function(a,b){return a.id>b.id;});
			else if (["desc","descending"].inArray(sortOrder)) friendArray.sort(function(a,b){return a.id<b.id;});
			
			for (var f=0,len=friendArray.length; f<len; f++) {
				WM.console.friendBuild.appendChild(friendArray[f].node);
			}
		},
		
		track : function(post){
			//dont track stuff older than our older tracking limit
			var limit=WM.opts.trackTime*day;
			if ( ( timeStamp()-(post.date*1000) ) < limit ) {
				//get/create the friend record
				var friend=WM.friendTracker.friends[post.fromID]||null;
				if (!friend) {
					friend=WM.friendTracker.newFriend({id:post.fromID,name:post.fromNameLastFirst});
				}
				//check if this is newer than last known post
				if (WM.opts.trackLastKnownPost) {
					var data=friend.lastKnownPost;
					if (data) {
						if (data.date<post.date){
							data.date=post.date;
							//data.id=post.id.removePrefix(post.fromID+"_");
						}
					} else {
						friend.data.lastKnownPost={date:post.date};
					}
				}
				//add it to history
				if (WM.opts.trackCreated){
					var data={date:post.date};
					if (WM.opts.trackFailed){
						data.failed=(post.status<0 && post.status !=-4 && post.status !=-6);
					}
					if (WM.opts.trackAccepted){
						data.accepted=(post.status>0 || post.status ==-4 || post.status ==-6);
					}
					friend.data.posts[post.id.removePrefix(post.fromID+"_")]=data;
				}
				//save it
				friend.updateStats();
				WM.friendTracker.save();
				
				//push events
				WM.rulesManager.doEvent("onFriendDataChanged",friend);
			}
		},
		
		trackStatus : function(post,acceptOrFail){
			var friend=WM.friendTracker.friends[post.fromID]||null;
			if (friend) {
				var data=friend.data.posts[post.id.removePrefix(post.fromID+"_")]||null;
				if (data){
					if (acceptOrFail) {
						data.accepted=true;
						delete data.failed;
					} else {
						data.failed=true;
						delete data.accepted;
					}
					friend.updateStats();
					WM.rulesManager.doEvent("onFriendDataChanged",friend);
				} else {
					debug.print("post does not exist under friend");
					//if post does not exists, we had more errors elsewhere
					//or post id not fit our history range
				}
			} else {
				debug.print("friend does not exist for this post");
				//if friend does not exist, we had errors elsewhere
				//don't bother fixing it here
			}
		},
	};

//***************************************************************************************************************************************
//***** Friend Class
//***************************************************************************************************************************************
	WM.Friend = function(params){try{
		this.objType="friend";
		params=params||{};
		var self=this;

		//set defaults
		this.expanded=false;
		this.id="";
		this.name="";
		
		this.data={
			lastKnownPost:{date:0},
			posts:{},
		};

		this.__defineGetter__("saveableData",function(){try{
			var ret={};
			
			ret.id=this.id;
			ret.name=this.name;
			ret.enabled=this.enabled;
			ret.expanded=this.expanded;
			
			//capture posts data
			ret.data=this.data;
			
			return ret;
		}catch(e){log("WM.Friend.saveableData: "+e);}});		
						
		for (var p in params) this[p]=params[p];

		//remove this
		this.remove=function(noConfirm){try{
			var ask=WM.opts.trackConfirmClearUser;
			if (noConfirm || !ask || (ask && confirm("Clear history for this user?"))){
				//remove my data
				if (this.node) remove(this.node);
				delete WM.friendTracker.friends[this.id];					
				WM.friendTracker.save();
			}
		}catch(e){log("WM.Friend.remove: "+e);}};

		this.toggleContent=function(){try{
			this.expanded=!this.expanded;
			var btnSize=WM.opts.littleButtonSize;
			with (this.contentNode)
				className=className.swapWordB(this.expanded,"expanded","collapsed");
			with (this.toggleImgNode)
				className=className.swapWordB(this.expanded,"treeCollapse"+btnSize,"treeExpand"+btnSize);
			WM.friendTracker.save();
		}catch(e){log("WM.Friend.toggleContent: "+e);}};
		
		this.addToFeeds=function(){try{
			WM.feedManager.newFeed({id:this.id, title:this.name});
			WM.feedManager.save();
		}catch(e){log("WM.Friend.addToFeeds: "+e);}};
		
		this.countAccepted=function(){try{
			var c=0;
			if (this.data.posts) for (var p in this.data.posts) {
				var post=this.data.posts[p];
				if (post.accepted) c++;
			}
			return c;
		}catch(e){log("WM.Friend.countAccepted: "+e);}};

		this.countFailed=function(){try{
			var c=0;
			if (this.data.posts) for (var p in this.data.posts) {
				var post=this.data.posts[p];
				if (post.failed) c++;
			}
			return c;
		}catch(e){log("WM.Friend.countFailed: "+e);}};

		this.countCreated=function(){try{
			var c=0;
			if (this.data.posts) for (var p in this.data.posts) {
				c++
			}
			return c;
		}catch(e){log("WM.Friend.countFailed: "+e);}};

		this.__defineGetter__("lastKnownPost",function(){try{
			if (this.data && (this.data.lastKnownPost||null)){
				return this.data.lastKnownPost;
			}
			return {id:null,date:0};
		}catch(e){log("WM.Friend.lastKnownPost: "+e);}});
		this.__defineGetter__("lastKnownPostDate",function(){try{
			if (this.data && (this.data.lastKnownPost||null)){
				return this.data.lastKnownPost.date;
			}
			return 0;
		}catch(e){log("WM.Friend.lastKnownPostDate: "+e);}});
		this.__defineGetter__("acceptCount",function(){try{
			return this.countAccepted();
		}catch(e){log("WM.Friend.acceptCount: "+e);}});
		this.__defineGetter__("failCount",function(){try{
			return this.countFailed();
		}catch(e){log("WM.Friend.failCount: "+e);}});
		this.__defineGetter__("postCount",function(){try{
			return this.countCreated();
		}catch(e){log("WM.Friend.postCount: "+e);}});
		this.__defineGetter__("totalCount",function(){try{
			return this.failCount+this.acceptCount;
		}catch(e){log("WM.Friend.totalCount: "+e);}});
		
		this.updateStats=function(){try{
			var n=this.statsNode;
			if (n) {
				if (WM.opts.trackLastKnownPost){
					d=new Date(((this.lastKnownPost.date*1000)||0)).toLocaleString();
					if (!this.lastPostNode) {
						n.appendChild(createElement("div",{className:"line"},[
							createElement("label",{textContent:"Last Known Post Date: "}),
							this.lastPostNode=createElement("span",{textContent:d})
						]));
					} else {
						this.lastPostNode.textContent=d;
					}
				}

				if (WM.opts.trackCreated){
					if (!this.countCreatedNode) {
						n.appendChild(createElement("div",{className:"line"},[
							createElement("label",{textContent:"Posts Created: "}),
							this.countCreatedNode=createElement("span",{textContent:this.countCreated()})
						]));
					} else {
						this.countCreatedNode.textContent=this.countCreated();
					}
				}
				
				if (WM.opts.trackAccepted){
					if (!this.countAcceptedNode){
						n.appendChild(createElement("div",{className:"line"},[
							createElement("label",{textContent:"Posts Accepted: "}),
							this.countAcceptedNode=createElement("span",{textContent:this.countAccepted()})
						]));
					} else {
						this.countAcceptedNode.textContent=this.countAccepted();
					}
				}
				
				if (WM.opts.trackFailed){
					if (!this.countFailedNode){
						n.appendChild(createElement("div",{className:"line"},[
							createElement("label",{textContent:"Posts Failed: "}),
							this.countFailedNode=createElement("span",{textContent:this.countFailed()})
						]));
					} else {
						this.countFailedNode.textContent=this.countFailed();
					}
				}
			}
		}catch(e){log("WM.Friend.updateStats: "+e);}};
		
		//draw it
		try{
			WM.console.friendBuild.appendChild(
				this.node=createElement("div",{className:"listItem"},[
					createElement("div",{className:"line"},[
						createElement("div",{className:"littleButton",title:"Toggle Content",onclick:function(){self.toggleContent();}},[
							this.toggleImgNode=createElement("img",{className:"resourceIcon "+(this.expanded?"treeCollapse"+WM.opts.littleButtonSize:"treeExpand"+WM.opts.littleButtonSize)}),
						]),
						this.titleNode=createElement("input",{value:(this.name||""), onchange:function(){self.name=this.value; WM.friendTracker.save();}}),
						
						//toolbox
						createElement("div",{className:"littleButton", title:"Add To Feeds"},[
							createElement("img",{className:"resourceIcon addFeed"+WM.opts.littleButtonSize,onclick:function(){self.addToFeeds();} })
						]),
						createElement("div",{className:"littleButton oddOrange", title:"Clear Data"},[
							createElement("img",{className:"resourceIcon trash"+WM.opts.littleButtonSize,onclick:function(){self.remove();} })
						]),
						createElement("div",{onclick:function(){window.open("http://www.facebook.com/profile.php?id="+self.id,"_blank");},title:"Visit Wall",className:"littleButton oddBlue"},[
							createElement("img",{className:"resourceIcon openInNewWindow"+WM.opts.littleButtonSize})
						]),
					]),
					this.contentNode=createElement("div",{className:"subsection "+(this.expanded?"expanded":"collapsed")},[
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"ID: ",title:"The facebook id of this user."}),
							createElement("span",{textContent:self.id}),
						]),
						//post data sub box
						createElement("div",{className:"line"},[
							createElement("label",{textContent:"Statistics: ",title:"Statistics you selected to track."}),
							this.statsNode=createElement("div",{className:"subsection"}),
						]),
					]),
				])
			);
		}catch(e){log("WM.Friend.init:addManagerElement: "+e);};	

		this.updateStats();
		
		return self;
	}catch(e){log("WM.Friend.init: "+e);}};	

})();