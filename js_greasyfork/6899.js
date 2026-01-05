// ==UserScript==
// @name          	WM Test Object
// @namespace       MerricksdadWMHostObject
// @description	This is the post test class which is created under the WM version 4.x script
// @license		http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @version        	4.0.0.0
// @copyright      	Charlie Ewing except where noted
// ==/UserScript==

//this script requires some functions in the WM Common Library
//this script needs access to a pre-defined JSON object


(function(){

//***************************************************************************************************************************************
//***** Test Class
//***************************************************************************************************************************************
	WM.Test = function(params){try{
		this.objType="test";
		var self=this;
		params=params||{};
		
		//defaults
		this.enabled=!(params.disabled||false); //check for WM2 disabled param
		this.expanded=true;
		this.title="";
		this.search=[]; //strings array
		this.find=""; //string
		this.findArray=[]; //string array
		this.kids=[]; //test array
		this.subTests=[]; //strings array
		this.parent=null;
		this.appID="";
		this.ret="dynamic";
		this._findMode="basic";
		this.subNumRange={low:0,high:0};
		this._isGlobal=false;
		
		this.__defineGetter__("saveableData",function(){try{
			var dat={};
				
			//dat.id=this.id;
			dat.label=this.title;
			dat.enabled=this.enabled;
			dat.search=this.search;
			dat.find=(this.findMode=="basic")?this.findArray:this.find;
			dat.ret=this.ret;
			dat.expanded=this.expanded;
			if (this.findMode=="subtests") dat.subTests=this.subTests;
			if (this.findMode=="subnumrange") {
				dat.subNumRange=this.subNumRange.low+","+this.subNumRange.high;
			}
			if (this.findMode=="regex") dat.regex=this.regex;
			dat.appID=this.appID;
			dat.kids=[];
			if (isArrayAndNotEmpty(this.kids)) for (var i=0,kid;(kid=this.kids[i]);i++) {
				dat.kids.push(kid.saveableData);
			}
			return dat;
		}catch(e){log("WM.Test.saveableData: "+e);}});
		
		//set/get wether this test is saved as global or profile
		this.__defineGetter__("isGlobal",function(){try{
			return this._isGlobal;
		}catch(e){log("WM.Test.isGlobal: "+e);}});
		
		this.__defineSetter__("isGlobal",function(v){try{
			//only top level tests can be global
			if (this.parent) {
				confirm("Only top level tests can be set to global.");
				return;
			} 
			
			if (!v) {
				if (!confirm("Disabling profile sharing on this test will prevent other users on this machine from loading it. Are you sure you wish to make this test locally available only?")) return;
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
		}catch(e){log("WM.Test.isGlobal: "+e);}});
		
		//use passed params
		for (var p in params) {
			//omit specific params
			if (!(["subNumRange","kids","disabled","label","find"].inArray(p)) ) {
				//copy only params that make it past the checker
				this[p]=params[p];
			}
		}
		
		//calculate subNumRange as an object
		if (exists(params.subNumRange)) {
			var p=params.subNumRange.split(",");
			this.subNumRange={low:p[0]||0, high:p[1]||0};
			this._findMode="subnumrange";
		}
		
		//get the title from the label field
		if (exists(params.label)) this.title=params.label;
		
		//detect which findMode we are using
		//subNumRange was already inspected above
		if (this.regex) this._findMode="regex";
		else if (exists(params.subTests)) this._findMode="subtests";
		//and we default to "basic" already
		
		//import the find field now
		if (isArray(params.find)) this.findArray=params.find;
		else this.find=params.find;
				
		this.enable=function(){try{
			this.enabled=true;
			this.node.className=this.node.className.removeWord("disabled");
			WM.grabber.save();
		}catch(e){log("WM.Test.enable: "+e);}};

		this.disable=function(){try{
			this.enabled=false;
			this.node.className=this.node.className.addWord("disabled");
			WM.grabber.save();
		}catch(e){log("WM.Test.disable: "+e);}};

		this.remove=function(noConfirm){try{
			var ask=WM.opts.dynamicConfirmDeleteTest;
			if (noConfirm || (this.isGlobal && confirm("This test is shared with other profiles. Deleting it here will prevent it from loading for other users. Are you sure you wish to delete this test and its children.")) || !ask || (!this.isGlobal && ask && confirm("Delete test and all of its child nodes?"))){
				//remove my data
				var parentContainer=(this.parent)?this.parent.kids:WM.grabber.tests;
				parentContainer.removeByValue(this);
				//remove my node
				remove(this.node);
				
				doAction(WM.grabber.save);
			}
		}catch(e){log("WM.Test.remove: "+e);}};

		this.moveUp=function(){try{
			//where is this
			var parentContainer=(this.parent)?this.parent.kids:WM.grabber.tests;
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
					WM.grabber.save();
				}
			}
		}catch(e){log("WM.Test.moveUp: "+e);}};
		
		this.moveDown=function(){try{
			//where is this
			var parentContainer=(this.parent)?this.parent.kids:WM.grabber.tests;
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
					WM.grabber.save();
				}
			}
		}catch(e){log("WM.Test.moveDown: "+e);}};

		this.moveUpLevel=function(){try{
			if (this.parent) {
				//this is not a top level node, so we can move it
				var targetContainer=((this.parent.parent)?this.parent.parent.kids:WM.grabber.tests);
				//remove from parent
				this.parent.kids.removeByValue(this);
				//set new parent
				this.parent=(this.parent.parent||null); //never point to the top level
				//move the object
				targetContainer.push(this);
				//move the node
				if (this.parent) this.parent.kidsNode.appendChild(this.node);
				else WM.console.dynamicBuild.appendChild(this.node);
				
				//save it
				WM.grabber.save();
			}
		}catch(e){log("WM.Test.moveUpLevel: "+e);}};
		
		this.moveDownLevel=function(){try{
			//where is this
			var parentContainer=(this.parent)?this.parent.kids:WM.grabber.tests;
			//create a new rule at my level
			var newTest = new WM.Test({
				parent:this.parent||null,
			});
			parentContainer.push(newTest);
			//remove me from my current parent
			parentContainer.removeByValue(this);
			//attach me to my new parent
			this.parent=newTest;
			newTest.kids.push(this);
			//move my node
			newTest.kidsNode.appendChild(this.node);
			//save it
			WM.grabber.save();
		}catch(e){log("WM.Test.moveDownLevel: "+e);}};
		
		this.clone=function(){try{
			var cloneTest=this.saveableData;
			//global clones are not global
			if (this.parent) this.parent.addChild(cloneTest);
			else WM.grabber.newTest(cloneTest);
		}catch(e){log("WM.Test.clone: "+e);}};

		this.addChild=function(p){try{
			var isNew=!exists(p);
			p=p||{};
			p.parent=this;
			var test=new WM.Test(p);
			this.kids.push(test);
			if (isNew) WM.grabber.save();
		}catch(e){log("WM.Test.addChild: "+e);}};

		this.toggleContent=function(){try{
			this.expanded=!this.expanded;
			var btnSize=WM.opts.littleButtonSize;
			with (this.contentNode)
				className=className.swapWordB(this.expanded,"expanded","collapsed");
			with (this.toggleImgNode)
				className=className.swapWordB(this.expanded,"treeCollapse"+btnSize,"treeExpand"+btnSize);
			WM.grabber.save();
		}catch(e){log("WM.Test.toggleContent: "+e);}};
		
		this.populateBonusList=function(){try{
			var node=this.bonusNode;
			var bonuses={};
			//get the list of accept texts for this app
			if (this.appID!="") {
				if (this.appID=="*") {
					//populate list with bonuses from ALL docked sidekicks
				} else {
					//make sure the app is ready
					//if it has not yet docked, it wont be
					var app=WM.apps[this.appID];
					bonuses = (app?(mergeJSON(app.accText,app.userDefinedTypes)||{}):{});
				}
			}			
			//add special return values
			bonuses["dynamic"]="* Dynamic grab";
			bonuses["none"]="* None";
			bonuses["wishlist"]="* Flaged as Wishlist";
			bonuses["exclude"]="* Excluded types";
			bonuses["send"]="* Send Unknown";
			bonuses["doUnknown"]="* Get Unknown";
			bonuses["{%1}"]="* Subtest Value";

			//sort by display text
			bonuses=sortCollection(bonuses,"value");
			
			//add each element to the dropdown
			var elem;
			node.innerHTML=""; //wipe previous list
			for (var i in bonuses) {
				var showI=i.removePrefix(this.appID);
				node.appendChild(
					elem=createElement("option",{textContent:((bonuses[i].startsWith("*"))?"":((showI.startsWith("send"))?"Send ":"Get "))+bonuses[i], value:i, selected:(this.ret==i)})
				);
			}

		}catch(e){log("WM.Test.populateBonusList: "+e);}};
		
		this.populateAppList=function(){try{
			var node=this.appListNode;
			var a={};
			for (var i in WM.apps){
				a[WM.apps[i].appID]=WM.apps[i].name;
			}

			//add special return values
			a["*"]="* All";

			//add each element to the dropdown
			var elem;
			node.innerHTML=""; //wipe previous list
			for (var i in a) {
				node.appendChild(elem=createElement("option",{textContent:a[i], value:i,selected:(this.appID==i)}));
			}

			//sort it
			elementSortChildren(node,"textContent");
		}catch(e){log("WM.Test.populateAppList: "+e);}};

		this.calcSearch=function(){try{
			//collect the checked search fields in their listed order
			if (self.searchNode) {
				self.search=[];
				forNodes(".//input[(@type='checkbox')]",{node:self.searchNode},function(e){
					if (e && e.checked){
						self.search.push(e.value);
						log(e.value);
					}
				});
			}
			WM.grabber.save();
		}catch(e){log("WM.Test.calcSearch: "+e);}};
		
		this.convertToRule=function(p){try{
			var rule;
			WM.rulesManager.rules.push( 
				rule=new WM.rulesManager.Rule( WM.rulesManager.ruleFromTest( this.saveableData ) ) 
			);
			if (WM.opts.rulesJumpToNewRule){
				//jump to rule view
				WM.console.tabContainer.selectTab(3);
				//scroll to new rule
				rule.node.scrollIntoView();
			}
		}catch(e){log("WM.Test.convertToRule: "+e);}};		
		
		//set/get find field modes
		this.__defineGetter__("findMode",function(){try{
			return this._findMode;
		}catch(e){log("WM.Test.findMode: "+e);}});
		
		this.__defineSetter__("findMode",function(v){try{
			var lastV = this._findMode;
			this._findMode=v;
			if (lastV==v) return; //no change
			
			//enable disable regex type
			this.regex=(v=="regex" || v=="regexp");
			
			//switch to array/string find field type
			//this.setFindType((v=="basic")?"array":"string");
			
			//show the correct find field
			if (this.findNode) this.findNode.value=((v=="basic")?this.findArray.join("\n"):this.find);

			//show/hide the subtests box
			if (this.subTestsBoxNode) with (this.subTestsBoxNode) className=className.toggleWordB((v!="subtests"),"hidden");
			
			//show/hide the subnumrange picker
			if (this.subNumRangeBoxNode) with (this.subNumRangeBoxNode) className=className.toggleWordB((v!="subnumrange"),"hidden");
			
			WM.grabber.save();

		}catch(e){log("WM.Test.findMode: "+e);}});

		//draw it
		try{(((this.parent)?this.parent.kidsNode:null)||$("wmDynamicBuilder")).appendChild(
			this.node=createElement("div",{className:"listItem "+((this.enabled)?"enabled":"disabled")},[
				createElement("div",{className:"line"},[
					createElement("div",{className:"littleButton",title:"Toggle Content",onclick:function(){self.toggleContent();}},[
						this.toggleImgNode=createElement("img",{className:"resourceIcon "+(this.expanded?"treeCollapse"+WM.opts.littleButtonSize:"treeExpand"+WM.opts.littleButtonSize)}),
					]),
					this.toggleNode=createElement("input",{type:"checkbox",checked:this.enabled,onchange:function(){
						self.enabled=this.checked;
						with (self.node) className=className.toggleWordB(!this.checked,"disabled");
						WM.grabber.save();
					}}),
					createElement("label",{textContent:"Title:"}),
					this.titleNode=createElement("input",{value:(this.title||""), onchange:function(){self.title=this.value; WM.grabber.save();}}),
					
					//toolbox
					createElement("div",{className:"littleButton oddOrange", title:"Remove Test"},[
						createElement("img",{className:"resourceIcon trash"+WM.opts.littleButtonSize,onclick:function(){self.remove();}})]),
					createElement("div",{className:"littleButton oddBlue", title:"Clone Test"},[
						createElement("img",{className:"resourceIcon clone"+WM.opts.littleButtonSize,onclick:function(){self.clone();}})]),
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

					createElement("div",{className:"indent littleButton oddBlue", title:"Convert To Rule"},[
						createElement("img",{className:"resourceIcon exportGrab"+WM.opts.littleButtonSize,onclick:function(){self.convertToRule();}})]),

					createElement("div",{className:"indent littleButton "+((this.isGlobal)?"oddOrange":"oddGreen"), title:((this.isGlobal)?"Disable Profile Sharing":"Share With Other Profiles")},[
						this.toggleGlobalButton=createElement("img",{className:"resourceIcon "+((this.isGlobal)?"removeGlobal":"addGlobal")+WM.opts.littleButtonSize,onclick:function(){self.isGlobal=!self.isGlobal; WM.grabber.save();}})]),
				]),
				this.contentNode=createElement("div",{className:"subsection "+(this.expanded?"expanded":"collapsed")},[
					//appID
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"appID:"}),
						this.appIDNode=createElement("input",{value:(this.appID||""), onchange:function(){self.appID=this.value;WM.grabber.save();self.populateBonusList();}}),
						this.appListNode=createElement("select",{onchange:function(){self.appIDNode.value=this.value; self.appID=this.value; WM.grabber.save(); self.populateBonusList();}}),
						createElement("div",{className:"littleButton oddBlue", title:"Refresh App List"},[
							createElement("img",{className:"resourceIcon refresh"+WM.opts.littleButtonSize,onclick:function(){self.populateAppList();}})]),
					]),
					//return type
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"Return Type ('which'):"}),
						this.retNode=createElement("input",{value:(this.ret||"dynamic"), onchange:function(){self.ret=this.value;WM.grabber.save();}}),
						this.bonusNode=createElement("select",{onchange:function(){self.retNode.value=this.value; self.ret=this.value; WM.grabber.save();}}),
						createElement("div",{className:"littleButton oddBlue", title:"Refresh Bonus List"},[
							createElement("img",{className:"resourceIcon refresh"+WM.opts.littleButtonSize,onclick:function(){self.populateBonusList();}})]),
					]),
					//search list
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"Search In Field(s):",title:"Specify fields in which to look for data. Adjust order as needed."}),
						this.searchNode=createElement("div",{className:"subsection optioncontainer"},(function(){
							var ret=[];
							
							//draw first the methods we have already selected
							if (isArrayAndNotEmpty(self.search)) for (var m=0; m<self.search.length; m++) {
								var s = self.search[m];
								ret.push(createElement("div",{className:"line"},[
									createElement("div",{className:"littleButton oddGreen", title:"Move Up"},[
										createElement("img",{className:"resourceIcon nomargin arrowUp16",onclick:function(){elementMoveUp(this.parentNode.parentNode); self.calcSearch();}})
									]),
									createElement("div",{className:"littleButton oddOrange", title:"Move Down"},[
										createElement("img",{className:"resourceIcon nomargin arrowDown16",onclick:function(){elementMoveDown(this.parentNode.parentNode); self.calcSearch();}})
									]),
									createElement("div",{className:"littleButton oddGreen", title:"Move To Top"},[
										createElement("img",{className:"resourceIcon nomargin moveTopLeft16",onclick:function(){elementMoveTop(this.parentNode.parentNode); self.calcSearch();}})
									]),
									createElement("div",{className:"littleButton oddOrange", title:"Move To Bottom"},[
										createElement("img",{className:"resourceIcon nomargin moveBottomLeft16",onclick:function(){elementMoveBottom(this.parentNode.parentNode); self.calcSearch();}})
									]),
									createElement("input",{type:"checkbox",value:s,checked:true,onchange:function(){self.calcSearch();}}),
									createElement("label",{textContent:s,title:WM.rulesManager.postParts[s]}),								
								]));
							}
							
							//draw the remaining items in their normal order
							for (var m=0; m<WM.grabber.methods.length; m++){
								var s = WM.grabber.methods[m];
								//prevent duplicates
								if (self.search.inArray(s)) continue;
								ret.push(createElement("div",{className:"line"},[
									createElement("div",{className:"littleButton oddGreen", title:"Move Up"},[
										createElement("img",{className:"resourceIcon nomargin arrowUp16",onclick:function(){elementMoveUp(this.parentNode.parentNode); self.calcSearch();}})
									]),
									createElement("div",{className:"littleButton oddOrange", title:"Move Down"},[
										createElement("img",{className:"resourceIcon nomargin arrowDown16",onclick:function(){elementMoveDown(this.parentNode.parentNode); self.calcSearch();}})
									]),
									createElement("div",{className:"littleButton oddGreen", title:"Move To Top"},[
										createElement("img",{className:"resourceIcon nomargin moveTopLeft16",onclick:function(){elementMoveTop(this.parentNode.parentNode); self.calcSearch();}})
									]),
									createElement("div",{className:"littleButton oddOrange", title:"Move To Bottom"},[
										createElement("img",{className:"resourceIcon nomargin moveBottomLeft16",onclick:function(){elementMoveBottom(this.parentNode.parentNode); self.calcSearch();}})
									]),
									createElement("input",{type:"checkbox",value:s,onchange:function(){self.calcSearch();}}),
									createElement("label",{textContent:s,title:WM.rulesManager.postParts[s]}),
								]));
							}
							
							return ret;
						})()),
					]),
					//find mode
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"Find Mode:",title:"Choose the mode you will use to find text."}),
						this.findModeNode=createElement("select",{onchange:function(){self.findMode=this.value;}},[
							createElement("option",{selected:(this.findMode=="basic"),value:"basic",textContent:"Basic",title:"Search for a list of words or phrases."}),
							createElement("option",{selected:(this.findMode=="subnumrange"),value:"subnumrange",textContent:"Number Range",title:"Search for a range of numbers using an insertion point '{%1}' in your find parameter."}),
							createElement("option",{selected:(this.findMode=="subtests"),value:"subtests",textContent:"Sub Tests",title:"Search for a list of words or phrases using an insertion point '{%1}' in your find parameter."}),
							createElement("option",{selected:(this.findMode=="regex"),value:"regex",textContent:"Registered Expression",title:"Search for complex phrases using a regular expression."})
						]),
					]),
					//find list
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"Find:",title:"One per line (basic mode), or a single regular expression. First match is used, so mind the order."}),
						createElement("div",{className:"subsection"},[
							this.findNode=createElement("textarea",{className:"fit",textContent:((this.findMode=="basic")?this.findArray.join("\n"):this.find), onchange:function(){
								if (self.findMode=="basic") self.findArray=this.value.split("\n");
								else self.find=this.value;
								WM.grabber.save();
							}}),
						])
					]),
					//subtests list
					this.subTestsBoxNode=createElement("div",{className:("line").toggleWordB(this.findMode!="subtests","hidden")},[
						createElement("label",{textContent:"Subtest Texts:",title:"Provide text replacements for the insertion point. No regular expressions."}),
						createElement("div",{className:"subsection"},[
							this.subTestsNode=createElement("textarea",{className:"fit",textContent:((isArray(this.subTests)?this.subTests.join("\n"):"")||""), onchange:function(){self.subTests=this.value.split("\n"); WM.grabber.save();}}),
						])
					]),
					//subnumrange picker
					this.subNumRangeBoxNode=createElement("div",{className:("line").toggleWordB(this.findMode!="subnumrange","hidden")},[
						createElement("label",{textContent:"Subtest Number Range:",title:"Provide a start and end range for the insertion point."}),
						this.subNumRangeLowNode=createElement("input",{value:this.subNumRange.low||0, onchange:function(){self.subNumRange.low=this.value; WM.grabber.save();}}),
						this.subNumRangeHighNode=createElement("input",{value:this.subNumRange.high||0, onchange:function(){self.subNumRange.high=this.value; WM.grabber.save();}}),
					]),
					//kids subbox
					createElement("div",{className:"line"},[
						createElement("label",{textContent:"Child Tests:",title:"Child tests are nested tests which are applied to matching posts at the same time the parent test is applied. Child rules can have different return values that override the parent return value."}),
						createElement("div",{className:"littleButton oddGreen",onclick:function(){self.addChild();},title:"Add Child"},[
							createElement("img",{className:"resourceIcon plus"+WM.opts.littleButtonSize}),
						]),
						this.kidsNode=createElement("div",{className:"subsection"}),
					]),
				]),
			])
		);}catch(e){log("WM.Test.init.drawTest: "+e);}
		
		//populate my bonus list
		this.populateAppList();
		this.populateBonusList();

		//list the kids for this test
		if (isArrayAndNotEmpty(params.kids)) for (var i=0,kid; (kid=params.kids[i]); i++) {
			this.addChild(kid);
		}
		
		return self;
	}catch(e){log("WM.Test.init: ")+e}};

	

})();