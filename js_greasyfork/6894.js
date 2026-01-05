// ==UserScript==
// @name          	WM Post Object
// @namespace       MerricksdadWMPostObject
// @description	This is the post class which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.3
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

//***************************************************************************************************************************************
//***** Post Class
//***************************************************************************************************************************************
	WM.Post = function(params){try{
		this.objType="post";
		var self=this;
		params=params||{};

		//set defaults
		this.state=""; //classnames
		this.flags=0; //similar to classnames
		this.node=null; //collector panel node
		this.originalData=JSON.stringify(params); //clone the original data from facebook for viewing later
		
		//convert FQL data to what we have previously expected from graph api		
		this.id=params.source_id + "_" + params.post_id;
		this.app=WM.apps[params.app_id];
		this.fromID=params.source_id;
		this.permalink="http://www.facebook.com/"+params.source_id+"/posts/"+params.post_id;
		this.fromName=params.fromName;
		this.date=params.created_time;
		this.message=params.message; //status message from post creator
		this.name=params.title; //params.attachment.name; //first line of the post
		this.title=params.title; //first line of the post
		this.caption=params.caption; //params.attachment.caption; //just below the title, a subtitle
		this.description=params.description; //params.attachment.description; //just below the caption, descriptive text about the story
		this.picture=params.picture; //params.app_data.images;
		
		this.likeLink = params.likeLink;
		this.pageNode = params.pageNode;
		this.commentLink = params.commentLink;
		this.commentNode = params.commentNode;
		
		//removed for WM 4
		/*try{
			this.picture = JSON.parse(this.picture)[0].fbml.match(/https?\:.+\.(png|gif|jpg)/)[0];
		} catch(e){
			//picture data match failed, no big deal
			//leave the data messed up because rules manager might still be able to use it
		}*/
		this.linkHref=params.linkHref;//||(params.action_links||null)?params.action_links[0].href:(params.attachment.media||null)?params.attachment.media[0].href:"";
		this.linkText=params.linkText;//||(params.action_links||null)?params.action_links[0].text:(params.attachment.media||null)?params.attachment.media[0].alt:"";
		this.targetID=params.target_id;
		//this.isLiked=params.isLiked; //params.like_info.user_likes;
		
		//convert a unix date to a readable date
		this.realtime=(new Date(this.date*1000).toLocaleString());
		
		//set a timer on the post for delayed deletion
		this.drawTime=timeStamp();
		
		this._isLiked=params.isLiked;
		this._isPinned=false;
		this._isPaused=false;
		this._isScam=false;
		this._isW2W=false;
		this._isForMe=false;
		this._isMyPost=false;
		this._isWishlist=false;
		this._isUndefined=false;
		this._status=0;
		this._isTimeout=false;
		this._isFailed=false;
		this._isAccepted=false;
		this._isExcluded=false;
		this._isStale=false;
		this._isCollect=false;
		this._isWorking=false;
		this._which=null;
		this._idText="";
		
		//use passed params
		//for (var p in params) this[p]=params[p];

		//link to our application array of objects
		//this.app=WM.apps[this.application.id];

		//shortcuts to app details
		this.__defineGetter__("synApp",function(){try{
			return this.app.synApp;
		}catch(e){log("WM.Post.synApp: "+e);}});

		this.__defineGetter__("postedDay",function(){try{
			var d=new Date(this.date*1000);
			return d.getFullYear()+"/"+d.getMonth()+"/"+d.getDay();
		}catch(e){log("WM.Post.postedDay: "+e);}});

		this.__defineGetter__("postedHour",function(){try{
			var d=new Date(this.date*1000);
			var h=d.getHours();
			var pm=(h/12)>1;
			return d.getFullYear()+"/"+d.getMonth()+"/"+d.getDay()+"   "+((h>12)?h-12:h)+":00"+((pm)?"PM":"AM");
		}catch(e){log("WM.Post.postedHour: "+e);}});

		this.__defineGetter__("appID",function(){try{
			return this.app.appID;
		}catch(e){log("WM.Post.appID: "+e);}});

		this.__defineGetter__("appName",function(){try{
			return this.app.name;
		}catch(e){log("WM.Post.appName: "+e);}});

		//get/set priority
		this.__defineGetter__("priority",function(){try{
			return this._priority;
		}catch(e){log("WM.Post.priority: "+e);}});
		this.__defineSetter__("priority",function(v){try{
			this._priority=v;
		}catch(e){log("WM.Post.priority: "+e);}});

		//get/set liked status
		this.__defineGetter__("isLiked",function(){try{
			return this._isLiked;
		}catch(e){log("WM.Post.isLiked: "+e);}});
		this.__defineSetter__("isLiked",function(v){try{
			this._isLiked=v;
			//remove the toolbutton if liked
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isLiked,"liked");
			if (this.likeButtonNode) with (this.likeButtonNode)
				className=className.toggleWordB(this._isLiked,"hidden");
		}catch(e){log("WM.Post.isLiked: "+e);}});

		//identification flags
		this.__defineGetter__("isScam",function(){try{
			return this._isScam;
		}catch(e){log("WM.Post.isScam: "+e);}});
		this.__defineSetter__("isScam",function(v){try{
			this._isScam=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isScam,"scam");
		}catch(e){log("WM.Post.isScam: "+e);}});

		this.__defineGetter__("isMyPost",function(){try{
			return this._isMyPost;
		}catch(e){log("WM.Post.isMyPost: "+e);}});
		this.__defineSetter__("isMyPost",function(v){try{
			this._isMyPost=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isMyPost,"isMyPost");
		}catch(e){log("WM.Post.isMyPost: "+e);}});

		this.__defineGetter__("isW2W",function(){try{
			return this._isW2W;
		}catch(e){log("WM.Post.isW2W: "+e);}});
		this.__defineSetter__("isW2W",function(v){try{
			this._isW2W=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isW2W,"w2w");
		}catch(e){log("WM.Post.isW2W: "+e);}});

		this.__defineGetter__("isForMe",function(){try{
			return this._isForMe;
		}catch(e){log("WM.Post.isForMe: "+e);}});
		this.__defineSetter__("isForMe",function(v){try{
			this._isForMe=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isForMe,"isForMe");
		}catch(e){log("WM.Post.isForMe: "+e);}});

		this.__defineGetter__("isWishlist",function(){try{
			return this._isWishlist;
		}catch(e){log("WM.Post.isWishlist: "+e);}});
		this.__defineSetter__("isWishlist",function(v){try{
			this._isWishlist=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isWishlist,"wishlist");
		}catch(e){log("WM.Post.isWishlist: "+e);}});

		this.__defineGetter__("isUndefined",function(){try{
			return this._isUndefined;
		}catch(e){log("WM.Post.isUndefined: "+e);}});
		this.__defineSetter__("isUndefined",function(v){try{
			this._isUndefined=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isUndefined,"noDef");
		}catch(e){log("WM.Post.isUndefined: "+e);}});

		this.__defineGetter__("isStale",function(){try{
			return this._isStale;
		}catch(e){log("WM.Post.isStale: "+e);}});
		this.__defineSetter__("isStale",function(v){try{
			this._isStale=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isStale,"stale");
		}catch(e){log("WM.Post.isStale: "+e);}});

		this.__defineGetter__("isTimeout",function(){try{
			return this._isTimeout;
		}catch(e){log("WM.Post.isTimeout: "+e);}});
		this.__defineSetter__("isTimeout",function(v){try{
			this._isTimeout=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isTimeout,"timeout");
		}catch(e){log("WM.Post.isTimeout: "+e);}});

		this.__defineGetter__("isCollect",function(){try{
			return this._isCollect;
		}catch(e){log("WM.Post.isCollect: "+e);}});
		this.__defineSetter__("isCollect",function(v){try{
			this._isCollect=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isCollect,"collect");
		}catch(e){log("WM.Post.isCollect: "+e);}});

		this.__defineGetter__("isExcluded",function(){try{
			return this._isExcluded;
		}catch(e){log("WM.Post.isExcluded: "+e);}});
		this.__defineSetter__("isExcluded",function(v){try{
			this._isExcluded=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isExcluded,"excluded");
		}catch(e){log("WM.Post.isExcluded: "+e);}});

		this.__defineGetter__("isAccepted",function(){try{
			return this._isAccepted;
		}catch(e){log("WM.Post.isAccepted: "+e);}});
		this.__defineSetter__("isAccepted",function(v){try{
			this._isAccepted=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isAccepted,"accepted");
		}catch(e){log("WM.Post.isAccepted: "+e);}});

		this.__defineGetter__("isFailed",function(){try{
			return this._isFailed;
		}catch(e){log("WM.Post.isFailed: "+e);}});
		this.__defineSetter__("isFailed",function(v){try{
			this._isFailed=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isFailed,"failed");
		}catch(e){log("WM.Post.isFailed: "+e);}});

		this.__defineGetter__("isWorking",function(){try{
			return this._isWorking;
		}catch(e){log("WM.Post.isWorking: "+e);}});
		this.__defineSetter__("isWorking",function(v){try{
			this._isWorking=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isWorking,"working");
		}catch(e){log("WM.Post.isWorking: "+e);}});

		this.__defineGetter__("isColored",function(){try{
			return this._isColored;
		}catch(e){log("WM.Post.isColored: "+e);}});
		this.__defineSetter__("isColored",function(v){try{
			this._isColored=v;
			if (this._isColored && this.colorOverride && this.node) this.node.style.setProperty("background-color",this.colorOverride,"important");
		}catch(e){log("WM.Post.isColored: "+e);}});
		
		//get/set post pinned
		this.__defineGetter__("isPinned",function(){try{
			return this._isPinned;
		}catch(e){log("WM.Post.isPinned: "+e);}});
		this.__defineSetter__("isPinned",function(v){try{
			this._isPinned=v;
			//rotate the pin icon
			var btnSize=WM.opts.littleButtonSize;
			if (this.pinImageNode) with (this.pinImageNode) 
				className=className.swapWordB(this._isPinned,"pinned"+btnSize,"pin"+btnSize);
			//pinned class
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isPinned,"pinned");
		}catch(e){log("WM.Post.isPinned: "+e);}});

		//get/set post paused
		this.__defineGetter__("isPaused",function(){try{
			return this._isPaused;
		}catch(e){log("WM.Post.isPaused: "+e);}});
		this.__defineSetter__("isPaused",function(v){try{
			this._isPaused=v;
			if (this.node) with (this.node) 
				className=className.toggleWordB(this._isPaused,"paused");
		}catch(e){log("WM.Post.isPaused: "+e);}});

		//get/set status
		this.__defineGetter__("status",function(){try{
			return this._status;
		}catch(e){log("WM.Post.status: "+e);}});
		this.__defineSetter__("status",function(v){try{
			this._status=v;
			if (this.statusTextNode) this.statusTextNode.textContent=this._status;
		}catch(e){log("WM.Post.status: "+e);}});

		//get/set idText
		this.__defineGetter__("idText",function(){try{
			return this._idText;
		}catch(e){log("WM.Post.idText: "+e);}});
		this.__defineSetter__("idText",function(v){try{
			this._idText=v;
			if (this.linkNode) this.linkNode.textContent=((this._idText||null) && WM.opts.debugrecog)?this._idText:this.linkText;
		}catch(e){log("WM.Post.idText: "+e);}});
		
		//get/set which bonus type this is
		this.__defineGetter__("which",function(){try{
			return this._which;
		}catch(e){log("WM.Post.which: "+e);}});
		this.__defineSetter__("which",function(v){try{
			this._which=v;
			if (this.whichTextNode) this.whichTextNode.textContent=this._which;
		}catch(e){log("WM.Post.which: "+e);}});

		//check if in history already
		this.__defineGetter__("alreadyProcessed",function(){try{
			return exists(WM.history[this.id]);
		}catch(e){log("WM.Post.alreadyProcessed: "+e);}});
		
		/*
		//update the namespace parameter if it does not exist
		if (!exists(this.app.namespace)) this.app.namespace=this.application.namespace;

		//validate the application namespace for sidekicks that provide namespace checking
		if (exists(this.app.namespace) && (this.app.namespace!=this.application.namespace)) {
			//Graph API namespace does not match sidekick known namespace, flag as scam
			this.isScam=true; 
		}		

		//now drop the application object we got from FB
		if (exists(this.application)) delete this.application;
		*/
		
		//this.fromID=this.from.id;
		//this.fromName=this.from.name;
		this.fromNameLastFirst=this.fromName;
		var sp=this.fromName.split(" ");
		if (isArray(sp) && sp.length>1) {
			this.fromNameLastFirst = sp.pop()+", "+sp.join(" ");
		}


		
		//(re)identify this post
		this.identify=function(params){try{
			params=params||{};
			
			//shortcuts
			var post=this;
			var app=post.app;
			var synApp=app.synApp;
		
			//set/reset priority, state, status & flags
			this.priority=50;
			this.status=0;
			this.state="";
			
			//prevent reset of some data holders
			if (!params.reid) {
				this.testData={};
				this.isLiked=false;
				this.isMyPost=false;
				this.isW2W=false;
				this.isForMe=false;
				this.isScam=false;
			}
			
			//reset data holders
			this.isStale=false;
			this.isCollect=false;
			this.isExcluded=false;
			this.isFailed=false;
			this.isAccepted=false;
			this.isPaused=false;
			this.isPinned=false;
			this.isUndefined=false;
			this.isWishlist=false;
			this.isTimeout=false;
			
			//avoid posts that belong to a disabled sidekick
			if(!WM.quickOpts.masterSwitch[app.appID]) {
				//master switch is off
				this.isExcluded=true;
				return true; //draw without identifying anything
			}

			//hide posts by apps that we specifically told to hide
			if (WM.opts["hide"+app.appID]) {this.remove(); return false;}

			//avoid potential scam posts
			/*if (WM.opts.scamblock) {
				if (!params.reid) {
					this.isScam=(!this.linkHref.match(new RegExp("^http(s):\/\/apps\.facebook\.com\/"+app.namespace))!=null);
				}
				if (this.isScam){
					this.isExcluded=true;
					if (WM.opts.hidescams) {this.remove(); return false;}
				}
			}*/

			//avoid posts by self
			if (!params.reid) {
				var whoPosted = this.fromID;
				var whoName = this.fromName;
				this.isMyPost=(whoPosted==WM.currentUser.id);
			}
			if (this.isMyPost){
				this.isExcluded=true;
				if (WM.opts.hidemyposts) {this.remove(); return false;}
			}

			//avoid W2W posts not for me
			if (!params.reid){
				this.isForMe = (this.targetID==WM.currentUser.id);
				this.isW2W = (this.targetID||null);
			}
			if (WM.opts[app.appID+"dontsteal"] && this.isW2W && !this.isForMe){
				this.isExcluded=true;
				if (WM.opts.hidenotforme) {this.remove(); return false;}
			}

			//avoid posts older than olderLimit
			if (olderLimit!=0) {
				if (this.isStale=this.checkStale(olderLimit)){
					if (WM.opts.skipstale) this.isExcluded=true;
					if (WM.opts.hidestale) {this.remove(); return false;}
				}
			}

			//get bonus type
			var w=(this.which = WM.which(this,{reid:params.reid}));

			//check for exclude type
			if (w=="exclude") {
				this.isExcluded=true;
			}

			//check for pause
			if(synApp.typesPaused.inArray(w)) this.isPaused=true;
			
			//check if undefined
			if (w=="none") {
				this.isUndefined=true;
			}
			if (w==synApp.appID+"doUnknown" || w==synApp.appID+"send") {
				this.isUndefined=true;
			}

			//special pin undefined option
			if (WM.opts.pinundefined && this.isUndefined) this.isPinned=true;

			//check if liked by me		
			if (this.isLiked){
				if (WM.opts.skipliked){
					if (WM.opts.markliked) this.status=1; //mark liked as accepted
					this.isExcluded=true;
					debug.print("skip liked");
				}
				if (WM.opts.hideliked) {debug.print("hide liked");this.remove(); return false;}
			}

			//check history
			this.status=this.status||0;
			if (this.alreadyProcessed) {
				//post previously processed
				this.status=(WM.history[this.id].status||0);

				var gotItem=((this.status>0) || (this.status==-6) || (this.status==-4) || (this.status==-15 && WM.opts.accepton15));
				if (gotItem) {
					this.isAccepted=true;
				} else if (this.status<0) {
					this.isFailed=true;
				}

				if (WM.opts.hideaccepted && gotItem) {this.remove(); return false;}
				if (WM.opts.hidefailed && this.status<0) {this.remove(); return false;}
			}

			//check if excluded
			if (this.isExcluded && WM.opts.hideexcluded) {this.remove(); return false;}

			//set identified text
			this.idText=WM.getAccText(synApp.appID,w,(this.alreadyProcessed),this.status);

			//check if wanted
			this.isCollect=(!this.alreadyProcessed && 
				(w=="dynamic" || WM.apps[this.synApp.appID].opts[w] || 
					(w.startsWith("send") && WM.apps[this.synApp.appID].opts["sendall"])
				)
			);

			//check if wishlist
			if (w.find("wishlist")) {
				this.isWishlist=true;
				if (WM.opts.hideunwanted && !WM.opts.donthidewishlists) {this.remove(); return false;}
			}
			
			//if unwanted
			if (!this.isCollect && WM.opts.hideunwanted) {this.remove(); return false;}
			
			//debug post
			/*var pkg=debug.print("WM.Post.debug: ");
			pkg.msg.appendChild(createElement("button",{type:"button",onclick:function(){
					//response.responseText.toClipboard();
					promptText(JSON.stringify(self));
				}},[
				createElement("img",{src:"http://i1181.photobucket.com/albums/x430/merricksdad/array.png",title:"Show Data",style:"width:16px;height:16px; vertical-align:bottom;"})
			]));*/
			
			//return true to draw, false to hide
			return true;
			
		}catch(e){log("WM.Post.identify: "+e);}};

		//open this post using the collector system
		this.open=function(params){try{
			params=params||{};
			var post = this;
			var id = this.id;
			var app = this.app;
			var synApp = this.synApp;

			//perform the onBefore Collect event
			WM.rulesManager.doEvent("onBeforeCollect",post);

			//fix the link based on sidekick alterlink information
			var alterLink=(synApp.alterLink||null);
			var targetHref = post.linkHref;
			var doAlterLink=(synApp.flags.alterLink||false);
			if (doAlterLink && alterLink) {
				//alert("doing alterlink...");
				//pack the alterlink into an array, or detect an array
				if (!isArray(alterLink)) alterLink=[alterLink];
				
				//iterate link alteration commands
				for (var alt=0,alteration;(alteration=alterLink[alt]);alt++) {
				
					//alert("making alteration...");
							
					//note that only find and replace functionality is available right now, no wildcards or array inserts will work
					var find = (alteration.find||"");
					alteration.dataSource=(alteration.dataSource||"either");
					
					//check if user is wanting a regex or string replacement
					if (alteration.isRegex||false) find=new RegExp(find,"");
										
					targetHref = targetHref.replace(find,(alteration.replace||""));


					//check for word specific changes
					if ((alteration.words||null) && (alteration.conversionChart||null)){
						//alert("inserting words...");
						
						//new alterlink capability to change data source from 'either' to another post part
						var dataSource = post.testData[alteration.dataSource].toLowerCase();
						
						//alert(dataSource);
						
						for (var w=0,len=alteration.words.length; w<len; w++) {
							var word=(alteration.words[w]).toLowerCase();
							if (dataSource.contains(word)) {
								//replace the word
								targetHref=targetHref.replace("{%1}",alteration.conversionChart[word.noSpaces()]);
								break;
							}
						}
					}
				
				}
			}

			//fix the link, removing https and switching to http only
			targetHref = targetHref.replace('https://','http://');

			//open the bonus page in a new tab or the previously opened tab object to save memory
			this.isWorking=true;
			post.state="working";
			WM.requestsOpen++;
			doAction(function(){WM.collector.open({url:targetHref,id:id,callback:(synApp.isVer3?WM.onFrameLoad3:WM.onFrameLoad),post:post,first:params.first||false,emergency:params.emergency||false});});
		}catch(e){log("WM.Post.open: "+e);}};

		//open this post using the collector system even if already tried
		this.forceOpen=function(params){try{
			var post=self;
			this.isCollect=true;
			this.isFailed=false;
			this.isTimeout=false;
			this.isAccepted=false;
			post.open(params);
		}catch(e){log("WM.Post.forceOpen: "+e);}};

		//like this post using the collector system
		this.like=function(){try{
			//var url=this.permalink;
			var self=this;
			//setTimeout(function(){WM.collector.open({url:url+"#likeit=true",id:url,callback:WM.onLikePost,post:self});},100);
			//Graph.likePost(this.id,{callback:WM.onLikePost,post:self});
			setTimeout(function(){Graph.likePost(self,{callback:WM.onLikePost,post:self});},100);
		}catch(e){log("WM.Post.like: "+e);}};

		//comment on this post using the collector system
		this.comment=function(commentOverride){try{
			if (commentOverride=="") commentOverride = null;
			//not ready
			//confirm("Feature not ready");
			//return;
			//var url=this.permalink;
			var self=this;
			var say = commentOverride || WM.opts.autocommentlist.split("\n").pickRandom();
			//setTimeout(function(){WM.collector.open({url:url+"#commentit=true&say="+say,id:url,callback:WM.onLikePost,post:self});},100);
			log("commenting "+say);
			//Graph.commentPost(this.id,say);
			setTimeout(function(){Graph.commentPost(self,say);},100);
		}catch(e){log("WM.Post.comment: "+e);}};

		//cancel collection in progress
		this.cancelProcess=function(){
			//tell the collector to cancel any processes with post equal this
			//this will cancel both collect and like activities
			WM.collector.cancelProcess({search:"post",find:this});
			this.processCancelled=true;
		},

		//cancel collection in progress
		this.refreshProcess=function(){
			//tell the collector to reload the href on processes with post equal this
			//this will reload both collect and like activities
			WM.collector.refreshProcess({search:"post",find:this});
			this.processRestarted=true;
		},

		//change the background color of this post
		this.setColor=function(color){try{
			this.colorOverride=color;
			this.isColored=(cBool(color));
		}catch(e){log("WM.Post.setColor: "+e);}};
		
		//change the bonus type of this post
		//and mark it for collection if needed
		//and update its idText
		this.setWhich=function(w){try{
			this.which=w;
			if ((w=="dynamic") || WM.apps[this.synApp.appID].opts[w] || (w.startsWith("send") && WM.apps[this.synApp.appID].opts["sendall"]) ) {
				this.isCollect=!this.alreadyProcessed;
			}
			//update the identified text
			this.idText=WM.getAccText(this.synApp.appID,w,(this.alreadyProcessed),this.status);
		}catch(e){log("WM.Post.setWhich: "+e);}};
		
		//get the time passed since this post was created
		this.__defineGetter__("age",function(){try{
			return timeStamp()-(this.date*1000);
		}catch(e){log("WM.Post.age: "+e);}});

		this.__defineGetter__("whichText",function(){try{
			if (this.which=="dynamic") return "Dynamic Grab";
			return this.synApp.userDefinedTypes[this.which]||this.synApp.accText[this.which];
		}catch(e){log("WM.Post.whichText: "+e);}});

		this.draw=function(redraw,reorder){try{
			var post=this;
			var app=post.app;
			var synApp=app.synApp;
			
			//clean old display
			if (this.node && redraw) {
				remove(this.node);
				this.node=null;
			}

			//prefetch css words
			var tags=("")
				.toggleWordB(post.isAccepted,"accepted")
				.toggleWordB(post.isFailed,"failed")
				.toggleWordB(post.isTimeout,"timeout")
				.toggleWordB(post.isExcluded,"excluded")
				.toggleWordB(post.isStale,"stale")
				.toggleWordB(post.isCollect && !(post.isAccepted||post.isFailed),"collect")
				.toggleWordB(post.isWorking,"working")
				.toggleWordB(post.isW2W,"w2w")
				.toggleWordB(post.isForMe,"isForMe")
				.toggleWordB(post.isMyPost,"isMyPost")
				.toggleWordB(post.isColored,"colored")
				.toggleWordB(post.isPaused,"paused")
				.toggleWordB(post.isPinned,"pinned")
				.toggleWordB(post.isUndefined,"noDef")
				.toggleWordB(post.isWishlist,"wishlist")
				.toggleWordB(post.isScam,"scam")
				.toggleWordB(post.isLiked,"liked");
									
			//detect hidden/drawn image
			var hideimage = (WM.opts.hideimages || (WM.opts.hideimagesunwanted && (post.which==="none" || post.which==="exclude") ) );
			var fakeimage = hideimage && WM.quickOpts.displayMode!="0";
			hideimage=hideimage && WM.quickOpts.displayMode=="0";
			
			//shared elements
			if (redraw){
				post.toolboxNode=createElement("div",{className:"toolBox small inline"});
				post.imageNode=createElement("img",{className:((!fakeimage && post.picture)?"":"resourceIcon noImageSmall16"),src:((!fakeimage)?post.picture:""||""),onerror:function(){this.className=this.className+" resourceIcon noImageSmall16"}});
				post.imageLinkNode=(!hideimage)?
					createElement("span",{href:jsVoid,className:"picture",onclick:function(){post.forceOpen();} },[
						post.imageNode
					]):null;
				post.floaterNode=null;
				post.bodyNode=null;
				post.actorNode=createElement("a",{className:"actor",textContent:post.fromName,href:"http://www.facebook.com/profile.php?id="+post.fromID});
				post.titleNode=createElement("span",{className:"title",textContent:post.name});
				post.captionNode=createElement("span",{className:"caption",textContent:post.caption});
				post.descriptionNode=createElement("span",{className:"description",textContent:post.description});
				post.dateNode=createElement("span",{className:"postDate",textContent:[post.date,post.realtime]});
				post.viaNode=createElement("a",{className:"appName",textContent:"  via "+app.name,href:"http://apps.facebook.com/"+app.namespace+"/",title:app.appID});
				post.linkNode=createElement("a",{className:"linkText"+(post.isExcluded?" excluded":"")+(post.idText?" identified":""),textContent:((post.idText||null) && WM.opts.debugrecog)?post.idText:post.linkText,href:post.linkHref,title:post.linkText});
				post.statusNode=createElement("span",{className:"status",textContent:"Status: "+(post.status||"0")+ " " + (WM.statusText[post.status||"0"])});
				post.pausedNode=createElement("div",{className:"pausedHover",title:"Collection for this post is paused, click to reactivate.",onclick:function(){post.isPaused=false;}},[createElement("img",{className:"resourceIcon playRight64"})]);
				
				//create the layout
				switch (WM.quickOpts.displayMode||"0"){

					case "0": //classic mode
						post.node=createElement("div",{id:"post_"+post.id,className:"wm post classic "+tags+((hideimage)?" noimage":""),title:(post.isScam?"Post is possible scam":"")},[
							post.toolboxNode,
							post.actorNode,
							post.imageLinkNode,
							(!WM.opts.hidebody)?post.bodyNode=createElement("div",{className:"body"},[
								post.titleNode,
								(post.caption||null)?post.captionNode:null,
								(post.description||null)?post.descriptionNode:null,
							]):null,
							createElement("div",{style:"margin-top:5px;"},[
								(!WM.opts.hidedate)?post.dateNode:null,
								(!WM.opts.hidevia)?post.viaNode:null,
								post.linkNode,
							]),
							post.pausedNode,
						]);
						break;

					case "1": case "3": //short mode and old priority mode
						post.node=createElement("div",{id:"post_"+post.id,className:"wm post short "+WM.opts.thumbsize+tags,title:(post.isScam?"Post is possible scam":"")},[
							post.imageLinkNode,
							post.floaterNode=createElement("div",{id:"floater_"+post.id,className:"floater "+WM.opts.thumbsize},[
								post.toolboxNode,
								post.actorNode,
								post.dateNode,
								post.viaNode,
								post.linkNode,
								post.statusNode,
								post.pausedNode,
							]),
						]);
						post.imageNode.onmousemove=WM.moveFloater;
						break;

					case "2": //dev mode
						var fnLine=function(label,text){
							return createElement("div",{className:"line"},[
								createElement("label",{textContent:label+": "}),
								createElement("span",{textContent:text})
							]);
						};
						post.node=createElement("div",{id:"post_"+post.id,className:"listItem wm post dev "+tags,title:(post.isScam?"Post is possible scam":"")},[
							post.idNode=fnLine("id", post.id),
							post.toolboxNode,
							//post.imageLinkNode,
							createElement("div",{className:"subsection"},(function(){
								var ret = [];
								ret.push(post.actorNode=fnLine("fromName (fromID)", post.fromName+"("+post.fromID+")"));
								ret.push(post.titleNode=fnLine("title",post.name));
								if (post.message||null)ret.push(post.messageNode=fnLine("msg",post.message));
								if (post.caption||null)ret.push(post.captionNode=fnLine("caption",post.caption)); 
								if (post.description||null)ret.push(post.descriptionNode=fnLine("desc",post.description)); 
								ret.push(post.appImageNode=fnLine("img",post.picture));
								ret.push(post.dateNode=fnLine("date",post.realtime));
								ret.push(post.appNameNode=fnLine("appName",app.name));
								ret.push(post.appIDNode=fnLine("appID",app.appID));
								ret.push(post.canvasNode=fnLine("canvas",app.namespace));
								ret.push(post.urlNode=fnLine("url",post.linkHref));

								//show likes
								if (post.likes||null){
									if (post.likes.data||null){
										ret.push(fnLine("likes",""));
										ret.push(post.likesNode=createElement("div",{className:"subsection"},(function(){
											var data=post.likes.data;
											var retData=[];
											for(var d=0,lenL=data.length; d<lenL; d++){
												retData.push(fnLine("likeName(likeID)",data[d].name+"("+data[d].id+")"));
											}
											return retData;
										})()));
									}
								}

								//show comments
								if (post.comments||null){
									if (post.comments.data||null){
										ret.push(fnLine("comments",""));
										ret.push(post.commentsNode=createElement("div",{className:"subsection"},(function(){
											var data=post.comments.data;
											var retData=[];
											for(var d=0,lenC=data.length; d<lenC; d++){
												retData.push(fnLine("commentorName(commentorID)",data[d].from.name+"("+data[d].from.id+")"));
												retData.push(fnLine("comment",data[d].message));
											}
											return retData;
										})()));
									}
								}
								ret.push(post.idTextNode=fnLine("idText",post.idText));
								ret.push(post.whichNode=fnLine("which",post.which));
								ret.push(post.linkTextNode=fnLine("linkText",post.linkText));

								return ret;
							})() ),
							post.pausedNode
						]);
						break;
				}

				//add the toolbox
				post.addToolBox();
			
				//use color override
				if (post.colorOverride) {
					post.node.style.setProperty("background-color",post.colorOverride,"important");
				}
			}

			//if a filter exists check against filter
			var filter=(WM.quickOpts.filterApp||"All");
			if (filter!="All" && filter!=app.appID) {
				//dont show this post in this filter
				if (this.node) remove(this.node);
				return;
			}

			//insert the post into view by sort order
			if (redraw || reorder) {
				var groupBy=WM.quickOpts.groupBy;
				if (groupBy){
					//detect/create group
					var group=WM.newGroup({by:post[groupBy]});
					var sibling=post.nextSibling();
					if (sibling) group.insertBefore(post.node,sibling.node);
					else group.appendChild(post.node);
				} else {
					var sibling=post.nextSibling();
					if (sibling) WM.console.feedNode.insertBefore(post.node, sibling.node);
					else WM.console.feedNode.appendChild(post.node);
				}
			}
		}catch(e){log("WM.Post.draw: "+e);}};

		this.openSource=function(){try{
			var url=this.permalink;
			//FF22 version
			GM_openInTab(url,"_blank");
			//FF21 version
			//((WM.opts.useGM_openInTab)?GM_openInTab:window.open)(url,"_blank");
		}catch(e){log("WM.Post.openSource: "+e);}};

		this.addClass=function(s){try{
			if (this.node){
				this.node.className=this.node.className.addWord(s);
			}
		}catch(e){log("WM.Post.addWord: "+e);}};

		this.removeClass=function(s){try{
			if (this.node){
				this.node.className=this.node.className.removeWord(s);
			}
		}catch(e){log("WM.Post.removeWord: "+e);}};

		this.pause=function(){try{
			this.isPaused=true;
		}catch(e){log("WM.Post.pause: "+e);}};

		this.unPause=function(){try{
			this.isPaused=false;
		}catch(e){log("WM.Post.unPause: "+e);}};

		this.exclude=function(){try{
			this.isExcluded=true;
		}catch(e){log("WM.Post.exclude: "+e);}};

		this.collect=function(){try{
			this.isCollect=true;
		}catch(e){log("WM.Post.collect: "+e);}};

		this.stopCollect=function(){try{
			this.isCollect=false;
		}catch(e){log("WM.Post.collect: "+e);}};

		this.togglePin=function(){try{
			this.isPinned=!this.isPinned;
		}catch(e){log("WM.Post.togglePin: "+e);}};

		this.pin=function(){try{
			this.isPinned=true;
		}catch(e){log("WM.Post.pin: "+e);}};

		this.unPin=function(){try{
			this.isPinned=false;
		}catch(e){log("WM.Post.unPin: "+e);}};

		this.addToFeeds=function(){try{
			WM.feedManager.newFeed({id:this.fromID, title:this.fromName});
			WM.feedManager.save();
		}catch(e){log("WM.Post.addToFeeds: "+e);}};

		this.accept=function(mark){try{
			this.isAccepted=true;
			this.isFailed=false;
			this.isTimeout=false;
			this.isWorking=false;
			this.isCollect=false;
			if (mark) WM.setAsAccepted(null, 3,this);
		}catch(e){log("WM.Post.accept: "+e);}};

		this.fail=function(mark){try{
			this.isFailed=true;
			this.isAccepted=false;
			this.isTimeout=false;
			this.isWorking=false;
			this.isCollect=false;
			if (mark) WM.setAsFailed(null, -18,this);
		}catch(e){log("WM.Post.fail: "+e);}};

		this.timeout=function(){try{
			this.isTimeout=true;
			this.isAccepted=false;
			this.isFailed=false;
			this.isWorking=false;
			this.isCollect=false;
		}catch(e){log("WM.Post.timeout: "+e);}};

		this.remove=function(){try{
			var node=(this.node||$("post_"+this.id));
			if (node && node.parentNode) remove(node);
			this.node=null;
			
			//turn this post into a ghost so we can keep its data
			//for linked objects, but not process it in reid or redraw
			this.isGhost=true;
			
			//delete WM.posts[this.id];
		}catch(e){log("WM.Post.remove: "+e);}};

		this.addToolBox=function(){try{
			var post=this;
			if (!WM.opts.showtoolbox) return;
			var toolNode = post.toolboxNode;
			if (toolNode) toolNode.appendChild(
				createElement("div",{},[
					createElement("div",{onclick:function(){post.forceOpen();},title:"Open Post",className:"littleButton oddBlue"+((!WM.opts.showopen)?" hidden":"")},[
						createElement("img",{className:"resourceIcon action"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){post.cancelProcess();},title:"Cancel Process or AutoLike",className:"littleButton oddBlue"+((!WM.opts.showcancelprocess)?" hidden":"")},[
						createElement("img",{className:"resourceIcon cancelProcess"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){post.refreshProcess();},title:"Restart Process or AutoLike",className:"littleButton oddBlue"+((!WM.opts.showrestartprocess)?" hidden":"")},[
						createElement("img",{className:"resourceIcon refreshProcess"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){WM.pauseByType(post.app, post.which);},title:"Pause all bonuses of this type",className:"littleButton oddOrange"+((!WM.opts.showpausetype)?" hidden":"")},[
						createElement("img",{className:"resourceIcon stop"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){WM.unPauseByType(post.app, post.which);},title:"Unpause all bonuses of this type",className:"littleButton oddGreen"+((!WM.opts.showunpausetype)?" hidden":"")},[
						createElement("img",{className:"resourceIcon playRight"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){window.open(post.permalink,"_blank");},title:"Show Post Source",className:"littleButton oddBlue"+((!WM.opts.showpostsrc)?" hidden":"")},[
						createElement("img",{className:"resourceIcon openInNewWindow"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){post.remove();},title:"Clean",className:"littleButton oddOrange"+((!WM.opts.showclean)?" hidden":"")},[
						createElement("img",{className:"resourceIcon trash"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){post.togglePin();},title:"Pin",className:"littleButton"+((!WM.opts.showpin)?" hidden":"")},[
						post.pinImageNode=createElement("img",{className:"resourceIcon "+(post.isPinned?"pinned":"pin")+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){post.moveToBottom();},title:"Move to Bottom",className:"littleButton oddOrange"+((!WM.opts.showmovebottom)?" hidden":"")},[
						createElement("img",{className:"resourceIcon moveBottomLeft"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){post.moveToTop();},title:"Move to Top",className:"littleButton oddGreen"+((!WM.opts.showmovetop)?" hidden":"")},[
						createElement("img",{className:"resourceIcon moveTopLeft"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){post.reID();},title:"ReID Post",className:"littleButton"+((!WM.opts.showreid)?" hidden":"")},[
						createElement("img",{className:"resourceIcon identify"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){post.addToFeeds();},title:"Add To Feeds",className:"littleButton"+((!WM.opts.showaddfeed)?" hidden":"")},[
						createElement("img",{className:"resourceIcon addFeed"+WM.opts.littleButtonSize})]),
					post.likeButtonNode=createElement("div",{onclick:function(){post.like();},title:"Like Post",className:"likeButton littleButton oddBlue"+(post.isLiked?" hidden":"")+((!WM.opts.showlike)?" hidden":"")},[
						createElement("img",{className:"resourceIcon like"+WM.opts.littleButtonSize})]),
					
					createElement("div",{onclick:function(){post.comment();},title:"Auto Comment",className:"littleButton oddBlue"+((!WM.opts.showautocomment)?" hidden":"")},[
						createElement("img",{className:"resourceIcon comment"+WM.opts.littleButtonSize})]),
					
					createElement("div",{onclick:function(){post.fail(true);},title:"Mark as Failed",className:"littleButton oddOrange"+((!WM.opts.showmarkfailed)?" hidden":"")},[
						createElement("img",{className:"resourceIcon minus"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){post.accept(true);},title:"Mark as Accepted",className:"littleButton oddGreen"+((!WM.opts.showmarkaccepted)?" hidden":"")},[
						createElement("img",{className:"resourceIcon plus"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){WM.rulesManager.ruleFromPost(post);},title:"Create Rule From Post",className:"littleButton oddBlue"+((!WM.opts.showmakerule)?" hidden":"")},[
						createElement("img",{className:"resourceIcon gotoLibrary"+WM.opts.littleButtonSize})]),
					createElement("div",{onclick:function(){promptText(self.originalData,true);},title:"Show Original Data",className:"littleButton"+((!WM.opts.showoriginaldata)?" hidden":"")},[
						createElement("img",{className:"resourceIcon object"+WM.opts.littleButtonSize})]),
				])
			);
		}catch(e){log("WM.Post.addToolBox: "+e);}};

		/*
		this.__defineGetter__("linkText", function(){try{
			if (this.actions.length >=3) return this.actions.last().name||"";
			else return "";
		}catch(e){log("WM.Post.linkText: "+e);}});

		this.__defineGetter__("linkHref", function(){try{
			return this.link||((this.actions.length>=3)?(this.actions.last().link||""):"")||"";

			if (this.actions.length >=3) return this.actions.last().link||"";
			else return this.link||"";
		}catch(e){log("WM.Post.linkHref: "+e);}});
		*/

		/*this.actionLink=function(action){try{
			//for (var a=0,act;(act=this.actions[a]);a++) if (act.name.toLowerCase()==action.toLowerCase()) {return act.link; break;}
			return this.linkHref;
		}catch(e){log("WM.Post.actionLink: "+e);}};*/

		this.__defineGetter__("body", function(){try{
			return (this.title||"")+" "+(this.caption||"")+" "+(this.description||"");
		}catch(e){log("WM.Post.body: "+e);}});

		this.__defineGetter__("either", function(){try{
			return this.linkText+" "+this.body;
		}catch(e){log("WM.Post.either: "+e);}});

		/*this.__defineGetter__("date", function(){try{
			return this["created_time"];
		}catch(e){log("WM.Post.date: "+e);}});*/

		this.checkStale=function(timeOverride) {try{
			if (exists(timeOverride) && timeOverride==0) return false;
			var now = timeStamp();
			var pubTime = this.date*1000; //(this.date.length < 10)?this.date+"000":this.date;
			//var pubTime = this.date+"000";
			var aDay = (1000 * 60 * 60 * 24);
			return (now-pubTime)>(timeOverride||aDay);
		}catch(e){log("WM.Post.checkStale: "+e);}};

		//req must equal "id" or "name"
		/*this.getTargets=function(req){try{
			req = req||"id";
			var ret = [];
			if (exists(this.to)) {
				for (var i=0,target; (target=this.to.data[i]);i++) ret.push(target[req]);
			}
			return ret;
		}catch(e){log("WM.Post.getTargets: "+e);}};*/

		//ret must equal "id" or "message" or "name" or "count"
		this.getComments=function(req){try{
			var ret = [];
			if (exists(this.comments)) if (this.comments.count) {
				switch(req){
					case "message": for (var i=0,comment; (comment=this.comments.data[i]);i++) ret.push(comment[req]); break;
					case "id":case "name": for (var i=0,comment; (comment=this.comments.data[i]);i++) ret.push(comment.from[req]); break;
					case "count": return this.comments.count; break;
				}
			}
			return ret;
		}catch(e){log("WM.Post.getComments: "+e);}};

		//ret must equal "id" or "name" or "count"
		this.getLikes=function(req){try{
			req = req||"id";
			var ret = [];
			if (exists(this.likes)) if (this.likes.count) {
				switch(req){
					case "id":case "name": for (var i=0,like; (like=this.likes.data[i]); i++) ret.push(like[req]); break;
					case "count": return this.likes.count; break;
				}
			}
			return ret;
		}catch(e){log("WM.Post.getLikes: "+e);}};

		this.moveToTop = function(){try{
			if (this.node||null) this.node.parentNode.insertBefore(this.node,this.node.parentNode.childNodes[0]);
		}catch(e){log("WM.Post.moveToTop: "+e);}};

		this.moveToBottom = function(){try{
			if (this.node||null) this.node.parentNode.appendChild(this.node);
		}catch(e){log("WM.Post.moveToBottom: "+e);}};

		this.setPriority = function(value){try{
			this.priority=value;
			remove(this.node);
			this.draw();
		}catch(e){log("WM.Post.setPriority: "+e);}};		
		
		this.reID = function(params){try{
			params=params||{};
						
			//reidentify
			var oldW=this.which;
			if (this.identify({reid:true})) {
				WM.rulesManager.doEvent("onIdentify",this);
			}
			
			//sort me into proper location
			WM.sortPosts();

			//redraw||reorder
			if (!this.isGhost) {
				this.draw(true,true);
			}
		}catch(e){log("WM.Post.reID: "+e);}};

		//return the next visible sibling post
		//now checks for group and visibility
		this.nextSibling = function(){try{
			//determine if there is an app filter
			var filter=(WM.quickOpts.filterApp||"All");
			
			//determine display grouping
			var groupBy=WM.quickOpts.groupBy;
			var group=(groupBy)?WM.newGroup({by:this[groupBy]}):null;
			
			//get visible posts
			var visiblePosts=(filter=="All")?WM.posts:matchByParam(WM.posts,"appID",filter);
			if (groupBy) visiblePosts=matchByParam(visiblePosts,groupBy,this[groupBy]);
			
			//search for the current post
			var found=false, sibling=null;
			for (var p in visiblePosts) {
				if (found && visiblePosts[p].node) {
					if ((!groupBy && visiblePosts[p].node.parentNode==WM.console.feedNode) 
					|| (groupBy && visiblePosts[p].node.parentNode==group)){
						sibling=visiblePosts[p]; 
						break
					}
				} else if (visiblePosts[p]==this) found=true;
			}

			//return what is found
			return sibling;
			//warning: returns null if this is the last visible post
		}catch(e){log("WM.Post.nextSibling: "+e);}};

		//return the previous visible sibling post
		//now checks for group and visibility
		this.previousSibling = function(){try{
			//determine if there is an app filter
			var filter=(WM.quickOpts.filterApp||"All");
			
			//determine display grouping
			var groupBy=WM.quickOpts.groupBy;
			var group=(groupBy)?WM.newGroup({by:this[groupBy]}):null;

			//get visible posts
			var visiblePosts=(filter=="All")?WM.posts:matchByParam(WM.posts,"appID",filter);
			if (groupBy) visiblePosts=matchByParam(visiblePosts,groupBy,this[groupBy]);
			
			//search for the current post
			var sibling=null;
			for (var p in visiblePosts) {
				if (visiblePosts[p]==this) break;
				else if (visiblePosts[p].node) {
					if ((!groupBy && visiblePosts[p].node.parentNode==WM.console.feedNode)
					|| (groupBy && visiblePosts.node.parentNode==group)){
						sibling=visiblePosts[p];
					}
				}
			}
			
			//return what is found
			return sibling;
			//warning: returns null if this is the first visible post
		}catch(e){log("WM.Post.previousSibling: "+e);}};
		


		
		//get the friend object related with this post (from the friend tracker)
		this.__defineGetter__("relatedFriend",function(){try{
			return WM.friendTracker.friends[this.fromID]||null;
		}catch(e){log("WM.Post.relatedFriend: "+e);}});
		
		this.__defineGetter__("friendAcceptedCount",function(){try{
			return this.relatedFriend.acceptCount;
		}catch(e){log("WM.Post.friendAcceptedCount: "+e);}});

		this.__defineGetter__("friendFailedCount",function(){try{
			return this.relatedFriend.failCount;
		}catch(e){log("WM.Post.friendFailedCount: "+e);}});

		//a little cleanup
		params = null;
	}catch(e){log("WM.Post.init: "+e);}};

	

})();