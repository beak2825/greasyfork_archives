// ==UserScript==
// @name          	WM Dynamic Grabber Object
// @namespace       MerricksdadWMDynamicGrabberObject
// @description	This is the dynamic grabber object which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.0
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

//***************************************************************************************************************************************
//***** Dynamic Grabberrabber Object
//***************************************************************************************************************************************
	WM.grabber = {
		tests:[],

		methods:["msg","fromID","fromName","url","body","html","targetID","targetName","caption","title","desc","comments",
				"commentorID","commentorName","likeName","likeID","link","either","img","canvas"],

		init:function(params){try{
			params=(params||{});
			var testsIn = getOptJSON("dynamics_"+WM.currentUser.profile) || [];
			var globalsIn = getOptJSON("dynamics_global") || {};
			//import locals and intermix globals we have a placeholder for
			if (isArrayAndNotEmpty(testsIn)) {
				for (var t=0; t<testsIn.length; t++) {
					if (testsIn[t].isGlobal) {
						//make sure the global test still exists
						var glob=globalsIn[testsIn[t].uniqueID]||null;
						if (glob){
							//merge global and local data
							//this retains our expanded/enabled parts
							var merge=mergeJSON(glob, testsIn[t]);
							WM.grabber.newTest(merge);
							//flag it so we don't import it again below
							glob.alreadyUsed=true;
						} else {
							//global missing, can't import
							log("WM.grabber.init: Global test missing, cannot merge");
						}
					} else {
						//load from locals
						WM.grabber.newTest(testsIn[t]);
					}
				}
			}
			//import all globals not already accounted for
			for (var t in globalsIn) {
				var glob=globalsIn[t];
				//avoid already imported globals
				if (!glob.alreadyUsed){
					glob.uniqueID=t;
					glob.isGlobal=true;
					WM.grabber.newTest(glob);
				}
			}
			
		}catch(e){log("WM.grabber.init: "+e);}},

		save:function(){try{
			var ret=[];
			var retGlobal={};
			
			if (isArrayAndNotEmpty(WM.grabber.tests)) {
				for (var t=0, len=WM.grabber.tests.length; t<len; t++){
					var test=WM.grabber.tests[t];
					if (!test.isGlobal) {
						//save it locally
						ret.push(test.saveableData);
					} else {
						//make a placeholder locally
						ret.push({isGlobal:true, uniqueID:test.uniqueID, enabled:test.enabled, expanded:test.expanded});
						//and save it globally
						var glob=test.saveableData;
						glob.uniqueID=test.uniqueID;
						retGlobal[test.uniqueID]=glob;
					}
				}
			}
			setOptJSON("dynamics_"+WM.currentUser.profile,ret);
			setOptJSON("dynamics_global",retGlobal);
		}catch(e){log("WM.grabber.save: "+e);}},

		newTest:function(params){try{
			params=params||{};
			var test = new WM.Test(params);
			WM.grabber.tests.push(test);
			WM.grabber.save();
		}catch(e){log("WM.grabber.newTest: "+e);}},

		importTest:function(){try{
			var params=prompt("Input test data",null);
			if (params) {
				WM.grabber.newTest(JSON.parse(params));
			}
		}catch(e){log("WM.grabber.importTest: "+e);}},

		//get the test object with id starting at optional node or at top level
		//may return null
		getTest:function(id,node){try{
			var nodes=(node||WM.grabber.tests);
			for (var i=0,len=nodes.length;i<len;i++){
				if (nodes[i]["id"]==id) {
					return nodes[i];
				} else if (nodes[i]["kids"]) {
					var ret = WM.grabber.getTest(id,nodes[i]["kids"]);
					if (ret) return ret;
				}
			}
		}catch(e){log("WM.grabber.getTest: "+e);}},
	};	

})();