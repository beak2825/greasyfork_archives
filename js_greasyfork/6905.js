// ==UserScript==
// @name          	WM Collector Object
// @namespace       MerricksdadWMCollectorObject
// @description	This is the collector object which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.0
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

//***************************************************************************************************************************************
//***** Collector Object
//***************************************************************************************************************************************
	WM.collector = {
		tabs : {}, //container for window objects
		recycle : [], //container for reusable window objects
		queue : [], //container for urls to do in order
		count : 0,

		windowExists : function(hwnd){
			try{
				var testUrl=tab.hwnd.location.toString();
				return true;
			}catch(e) {
				return false;
			}
		},
		
		//requires id, url and callback
		open : function(params) {try{
			//log("WM.collector.open()",{level:0});

			//check for tab queueing
			if (WM.opts.queuetabs && WM.collector.count && !(params.emergency||false)) {
				if (params.first||false) {
					//cut in line to be next processed
					WM.collector.queue.unshift(params);
					return;
				}
				//toss the next action in the queue while we wait for the current one to finish
				WM.collector.queue.push(params);
				//log("WM.collector.open: request queued",{level:1});
				return;
			}

			var url = params.url;
			var id = params.id;

			//create a window or use a recycled one
			var tabHwnd;
			if (WM.collector.recycle.length) {
				tabHwnd = WM.collector.recycle.shift();
				//watch for missing window objects
				try{
					//use the existing window object if it responds
					tabHwnd.location.href=url;
				} catch (e) {
					//window object missing, make a new one
					//FF22 version
					tabHwnd = GM_openInTab(url,"_blank");
					//FF21 version
					//tabHwnd = ((WM.opts.useGM_openInTab)?GM_openInTab:window.open)(url,"_blank");
				}
			} else {
				//we do not use recycling, just make a new one
				//FF22 version
				tabHwnd = GM_openInTab(url,"_blank");
				//FF21 version
				//tabHwnd = ((WM.opts.useGM_openInTab)?GM_openInTab:window.open)(url,"_blank");
			}

			//window opening
			if (tabHwnd) {
				WM.collector.count++;
				params.hwnd=tabHwnd; //store the window handle
				params.openTime=timeStamp();
				WM.collector.tabs[id]=params; //add the tab and all its data to the array

				//pass data to the sidekick top window
				var callback = params.callback;
				if (callback) delete params.callback;
				if (params.msg) {
					remove($(params.msg));
					delete(params.msg);
				}
				
				//details for posts, not for likes
				var app, synApp, isPost;
				if (isPost=(params.post||null)){
					app=params.post.app; 
					synApp=app.parent||app;
				}
				

				if (callback) {
					//log("WM.collector.open: callback fired",{level:3});
					doAction(function(){
						callback(params);
					});
				}
			} else {
				log("WM.collector: Tab or Window is not opening or your browser does not support controlling tabs and windows via scripts. Check your popup blocker.",{level:5});
			}
		}catch(e){log("WM.collector.open: "+e);}},

		doNext : function(){try{WM.collector.open(WM.collector.queue.shift());}catch(e){log("WM.collector.doNext: "+e);}},

		close : function(tab) {try{
			//recycle or close the passed tab
			try{
				if (WM.opts.recycletabsall || WM.opts.queuetabs || (WM.collector.recycle.length < WM.opts.recycletabs)) {
					//wipe it and put it away
					
					if (tab.hwnd){
						WM.collector.recycle.push(tab.hwnd);
						tab.hwnd.location.href="about:blank";
						if (WM.collector.windowExists(tab.hwnd)){
							tab.hwnd.location.hash="";
						}
					} else {
						//tab is busy, laggy or missing
						tab.closeRetries=(tab.closeRetries||0)+1;
						if (tab.closeRetries<3) {
							setTimeout(function(){WM.collector.close(tab);},1000);
						} else {
							log("WM.collector.close: Control of window handle lost; cannot recycle. Window may be too busy to communicate with, or has been closed manually.");
						}
						return;
					}
				} else {
					if (tab.hwnd) tab.hwnd.close();
				}
			} catch (e){log("WM.collector.close: recycler: "+e);}

			try{
				tab.hwnd=null;
				delete tab.signal;
				delete tab.stage;
				delete tab.closeTries;
			
				if (tab.toIntv) clearInterval(tab.toIntv);
				delete tab; 
				tab=null;
				WM.collector.count--
			}catch(e){log("WM.collector.close: destroy tab: "+e);}

			//check for items in queue to do next
			if (WM.collector.queue.length) {
				//check that queueing is still in practice
				if (WM.opts.queuetabs) {
					setTimeout(WM.collector.doNext,1000); //just do one
				} else {
					//options have changed since queueing was enacted, release all the queue into windows right now
					var offset=1000;
					while (WM.collector.queue.length && (WM.collector.count < WM.opts.maxrequests)) {
						setTimeout(WM.collector.doNext,offset); //open all, up to the limit set in options
						offset+=100;
					}
				}
			}

		} catch (e){log("WM.collector.close: "+e);}},

		closeAll : function() {try{
			//first delete the queue so close fx doesnt pick them up
			WM.collector.queue=[]; //empty but dont destroy

			//then close the active windows, moving any to the recycler if that is enabled
			for (var t in WM.collector.tabs) {
				WM.collector.close(WM.collector.tabs[t]);
			}

			//then close any recycled windows
			if (WM.collector.recycle.length) {
				for (var r=0, hwnd; r < WM.collector.recycle.length; r++) {
					if (hwnd=WM.collector.recycle[r]) {
						hwnd.close();
					}
				}
				WM.collector.recycle=[];
			}
		} catch (e){log("WM.collector.closeAll: "+e);}},
		
		createTimer : function(tab) {try{
			//create a timeout handler based on options and store the timer on the tab
			tab.toIntv=setTimeout(function(){
				if (tab) if (tab.stage!=4) doAction(function(){
					//tab has been active too long, do timeout
					log("WM.collector.timer: request timeout ("+tab.id+")",{level:3});
					WM.setAsFailed(null, -14, tab.post);
					WM.clearURL(tab);
				})
			},WM.opts.reqtimeout*1000);
		} catch (e){
			log("WM.collector.createTimer: "+e);}
		},

		cancelProcess : function(params) {try{
			params=params||{};
			var c = WM.collector;
			
			for (t in c.tabs) {
				if (c.tabs[t] && c.tabs[t][params.search] && c.tabs[t][params.search]==params.find){
					//matching collector tab found
					tab=c.tabs[t];
					
					//close the window
					c.close(tab);
				}
			}
		} catch (e){log("WM.collector.cancelProcess: "+e);}},
		
		refreshProcess : function(params) {try{
			params=params||{};
			var c = WM.collector;
			for (t in c.tabs) {
				if (c.tabs[t] && c.tabs[t][params.search] && c.tabs[t][params.search]==params.find){
					//matching collector tab found
					tab=c.tabs[t];
					
					//restart the window at its initial url
					if (tab.hwnd.location.href==tab.url) {
						tab.hwnd.location.reload();
					} else {
						tab.hwnd.location.href=tab.url;
					}
				}
			}
		} catch (e){log("WM.collector.refreshProcess: "+e);}},

	};	

})();