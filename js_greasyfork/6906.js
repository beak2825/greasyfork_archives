// ==UserScript==
// @name          	WM Sidekick Docking Object
// @namespace       MerricksdadWMSidekickDockingObject
// @description	This is the docking object which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.0
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

//***************************************************************************************************************************************
//***** Sidekick Docking Object
//***************************************************************************************************************************************
	WM.dock = {
		//restructure menu to append appID before every object
		fixMenu: function(menu,app){try{
			var ret={};
			//for each object in menu
			for (var o in menu){
				//WM.message(o);
				ret[app+o]=menu[o];

				//fix button functions and arrays to be prepended by the appID of that sidekick
				var t=menu[o]["type"];
				switch(t){
					case "button_highlight":
					case "button_selectmulti":
					case "button_selectprefix":

						//fix elements in the clearfirst array
						if (menu[o]["clearfirst"]){
							for (var i=0,len=ret[app+o]["clearfirst"].length;i<len;i++){
								ret[app+o]["clearfirst"][i] = app+ret[app+o]["clearfirst"][i];
							}
						}

						//fix elements in the options array
						if (menu[o]["options"]){
							for (var i=0,len=ret[app+o]["options"].length;i<len;i++){
								ret[app+o]["options"][i] = app+ret[app+o]["options"][i];
							}
						}

						if (menu[o]["clearPrefix"]){
							ret[app+o]["clearPrefix"]=app+ret[app+o]["clearPrefix"];
						}

						if (menu[o]["prefix"]){
							ret[app+o]["prefix"]=app+ret[app+o]["prefix"];
						}
				}

				//fix kids
				if (menu[o]["kids"]){
					//rebuild kids object
					ret[app+o]["kids"]=WM.dock.fixMenu(menu[o]["kids"],app);
				}
			}
			return ret;
		} catch(e) {log("WM.dock.fixMenu: "+e);}},

		//restructure tests to append appID before every object's return
		fixTests: function(arr,app){try{
			//for each test in array
			for (var t=0,len=arr.length;t<len;t++) {
				var ret=arr[t].ret, kids=arr[t].kids;
				//replace return value
				if (ret) {
					if (ret!="exclude" && ret!="none") {
						arr[t].ret=app.appID+ret;
					}
				}
				//process subtests
				if (kids) WM.dock.fixTests(kids,app);
			}
		} catch(e) {log("WM.dock.fixTests: "+e);}},

		fixAcceptTexts:function(app){try{
			var newAccText={};
			for (var s in app.accText) {
				newAccText[app.appID+s]=app.accText[s];
			}
			app.accText=newAccText;
		} catch(e) {log("WM.dock.fixAcceptTexts: "+e);}},

		onSidekickParsed: function(newset){try{		
			//save it into the NEW format for games
			var app=(WM.apps[newset.appID]=new WM.App(newset));

			//promptText JSON.stringify(WM.config.settings));
			WM.updateSettingsValues();

			//detach the menu from the newset to reduce duplication
			delete app.menu;
			
			//fire priority event
			(function(){WM.rulesManager.doEvent("onSidekickDock",app);})();
			
			//fetch its initial posts
			//app.fetchPosts();
			WM.newSidekicks.push(app);
			
		}catch(e){log("WM.dock.onSidekickParsed: "+e);}},
		
		parseNewSidekick: function(node){try{
			if (node){	
				var v = node.getAttribute('data-ft');
				node.setAttribute('data-ft','');
				if (v||null) {
					var newset = JSON.parse(v);
					WM.dock.onSidekickParsed(newset);
				}
			}
		} catch(e) {log("WM.dock.parseNewSidekick: "+e);}},
		
		answerDockingDoor: function(){try{
			//log("Sidekick requesting to dock");

			//get all sidekicks that left info on the dock;
			forNodes(".//div[@id='wmDock']/div[(@data-ft) and not(@data-ft='')]",{},function(node){
				if (node.getAttribute('data-ft') !=""){
					window.setTimeout(WM.dock.parseNewSidekick,1,node);
				}
			});
		} catch(e) {log("WM.dock.answerDockingDoor: "+e);}},

	};	

})();