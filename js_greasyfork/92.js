// ==UserScript==
// @name       Write a note!
// @version    2.3.2
// @description  You can edit a note on all websites!
// @match      http://*/*
// @match      https://*/*
// @exclude	   https://apis.google.com/*
// @exclude	   https://evernote.com/Home*
// @exclude    http://mail.google.com/tasks/canvas*
// @exclude    https://talkgadget.google.com/u/0/talkgadget*
// @exclude    http*://www.facebook.com/plugins/*
// @copyright  2014+, ich01
// @namespace https://greasyfork.org/scripts/92
// @grant	  GM_registerMenuCommand
// @grant	  GM_setValue
// @grant	  GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/92/Write%20a%20note%21.user.js
// @updateURL https://update.greasyfork.org/scripts/92/Write%20a%20note%21.meta.js
// ==/UserScript==
var uw = (this.unsafeWindow) ? this.unsafeWindow : window;
uw.WriteANote = {
	langArray: [],
	pageURL: "",
	littleNote: false,
	init: function() {
		WriteANote.addGMMenuItem();
		WriteANote.initLittleNote();
		WriteANote.insertStyles();
		WriteANote.initLanguage();
		//Getting formatted url for localStorage saving
		var _url = document.location.toString();
		if (_url.indexOf("?")) {
			_url = _url.slice(0,_url.indexOf("?"));
		}
		WriteANote.pageURL=_url;
		WriteANote.checkForLittleNote();
	},
	addGMMenuItem: function() {
		GM_registerMenuCommand("Write A Note",function() {WriteANote.openPopup();});
	},
	initLanguage: function() {
		WriteANote.langArray[0] = "Your Note";
		WriteANote.langArray[1] = "Save";
		WriteANote.langArray[2] = "Delete";
		WriteANote.langArray[3] = "Settings";
		WriteANote.langArray[4] = "Your note was saved!";
		WriteANote.langArray[5] = "Your note was deleted!";
		WriteANote.langArray[6] = "Close";
		WriteANote.langArray[7] = "Enable little note in top-left page-corner";
		if (navigator.language.toString().toLowerCase().indexOf("de")>-1) {
			WriteANote.langArray[0] = "Deine Notiz";
			WriteANote.langArray[1] = "Speichern";
			WriteANote.langArray[2] = "L&ouml;schen";
			WriteANote.langArray[3] = "Einstellungen";
			WriteANote.langArray[4] = "Deine Notiz wurde gespeichert!";
			WriteANote.langArray[5] = "Deine Notiz wurde geloescht!";
			WriteANote.langArray[6] = "Schlie&szlig;en";
			WriteANote.langArray[7] = "Mini-Notiz in Ecke links-oben aktivieren";
		}
	},
	openPopup: function() {
		if (document.getElementsByTagName("writeanotepopup").length==0) {
			var xyElement = document.createElement("writeanotepopup");
			xyElement.style.position="fixed";
			xyElement.style.borderRadius="3px";
			xyElement.style.minWidth="500px";
			xyElement.style.minHeight="350px";
			var leftAbstand = (window.innerWidth-500)/2;
			var topAbstand = (window.innerHeight-350)/2;
			xyElement.style.left=leftAbstand+"px";
			xyElement.style.top=topAbstand+"px";
			xyElement.style.zIndex="9999999999999";
			xyElement.style.border="1px solid black";
			xyElement.style.backgroundColor="rgba(200,200,200,0.9)";
			xyElement.style.display="block";
			xyElement.style.overflow="scroll";
			xyElement.style.textAlign="left";
			xyElement.style.color="black";
			var string1 = "<span style='left:-1px;background:rgb(245,233,237);width:97%;margin-left:0px;position:absolute;padding:7px;font-family:Arial;font-size:16px;font-weight:bold;color:black;'>Write A Note!</span>";
			string1+="<span style='right:0px;position:absolute;cursor:pointer;top:0px;font-family:Arial;' onclick=WriteANote.closePopup();>"+WriteANote.langArray[6]+"</span>";
			string1+="<br><br><br>";
			string1+="<span style='background-color:rgba(118,105,199,0.7);color:black;font-weight:bold;font-family:Arial;width:50%;border-radius:3px;padding:1px;position:absolute;'>"+WriteANote.langArray[0]+"</span><br>";
			string1+="<textarea id=writeanotetextarea placeholder='"+WriteANote.langArray[0]+"' rows=4 cols=45 style='font-family:Tahoma;color:black;border:1px solid rgb(140,250,106);'>"+WriteANote.getSavedNote()+"</textarea><br>";
			string1+="<table border=0 cellpadding=1 cellpadding=1><tr><td><button onclick=WriteANote.saveNote();>"+WriteANote.langArray[1]+"</button></td><td><button onclick=WriteANote.deleteNote();>"+WriteANote.langArray[2]+"</td></tr></table><br>";
			string1+="<span style='background-color:rgba(118,105,199,0.7);color:black;font-weight:bold;font-family:Arial;width:50%;border-radius:3px;padding:1px;position:absolute;'>"+WriteANote.langArray[3]+"</span><br>";
			var littleNoteChecked = "";
			if (WriteANote.littleNote==true) {
				littleNoteChecked = "checked";
			}
			string1+="<input type=checkbox onchange=WriteANote.gmChangeNoteStatus(); "+littleNoteChecked+">"+WriteANote.langArray[7]+"</input><br>";
			xyElement.innerHTML=string1;
			document.body.appendChild(xyElement);
		} else {
			document.getElementsByTagName("writeanotepopup")[0].style.display="block";
		}
	},
	saveNote: function() {
		var newNote = document.getElementById("writeanotetextarea").value;
		localStorage.setItem(WriteANote.pageURL+"_notf",newNote);
		alert(WriteANote.langArray[4]);
	},
	deleteNote: function() {
		localStorage.removeItem(WriteANote.pageURL+"_notf");
		document.getElementById("writeanotetextarea").value="";
		alert(WriteANote.langArray[5]);
	},
	getSavedNote: function() {
		if (localStorage.getItem(WriteANote.pageURL+"_notf")!=null) {
			return localStorage.getItem(WriteANote.pageURL+"_notf");
		} else {
			return "";
		}
	},
	closePopup: function() {
		if (document.getElementsByTagName("writeanotepopup").length==1) {
			document.getElementsByTagName("writeanotepopup")[0].outerHTML="";
		}
	},
	gmChangeNoteStatus: function() {
		if (WriteANote.littleNote==true) {
			WriteANote.gmDisableNote();
		} else {
			WriteANote.gmEnableNote();
		}
	},
	gmEnableNote: function() {
		setTimeout(function() {
		GM_setValue("littleNote", "true");
		}, 0);
	},
	gmDisableNote: function() {
		setTimeout(function() {
		GM_setValue("littleNote", "false");
		}, 0);
	},
	initLittleNote: function() {
		if (GM_getValue("littleNote")=="true") {
			WriteANote.littleNote = true;
		} else {
			WriteANote.littleNote = false;
		}
	},
	insertStyles: function() {
		var myStyle = document.createElement("style");
		myStyle.setAttribute("type", "text/css");
		document.getElementsByTagName("head")[0].appendChild(myStyle);
		var styles = document.styleSheets.length;
		myStyle = document.styleSheets[styles-1];
		if (document.styleSheets[0].cssRules) {
			myStyle.insertRule("writeanotelittle {font-family:Tahoma; font-size:0px; cursor:pointer; z-index:9999999999999; white-space:nowrap; text-align:left; color:black;transition:all 0.3s ease; overflow:hidden; width:10px; min-width:10px; min-height:10px; height:10px; background-color:yellow; position:fixed; top:0px; left:0px; text-overflow:ellipsis; opacity:0.8; border:1px solid black; border-radius:3px;}", 0);
			myStyle.insertRule("writeanotelittle:hover {font-size:14px; width:100px; height:20px;}", 0);
		} else {
			if (document.styleSheets[0].rules) {
				myStyle.addRule("writeanotelittle", "font-family:Tahoma; font-size:0px; cursor:pointer; z-index:9999999999999; white-space:nowrap; text-align:left; color:black; transition:all 0.3s ease; overflow:hidden; width:10px; min-width:10px; min-height:10px; height:10px; background-color:yellow; position:fixed; top:0px; left:0px; text-overflow:ellipsis; opacity:0.8; border:1px solid black; border-radius:3px;");
				myStyle.addRule("writeanotelittle:hover", "font-size:14px; width:100px; height:20px;");
			}
		}
	},
	checkForLittleNote: function() {
		if (WriteANote.littleNote==true) {
			var littleNote = document.createElement("writeanotelittle");
			littleNote.setAttribute("id","writeanotelittle");
			littleNote.setAttribute("onclick","WriteANote.openPopup();");
			document.body.appendChild(littleNote);
			document.getElementById("writeanotelittle").innerHTML=WriteANote.getSavedNote();
		}
	}
};
if (navigator.userAgent.toLowerCase().indexOf("firefox")>-1) {
		window.WriteANote = uw.WriteANote;
		console.log("Firefox detected. Compatibility mode enabled.");
}
WriteANote.init();