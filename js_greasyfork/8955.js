// ==UserScript==
// @name        Bunny Black Anti-Ching-Chong
// @namespace   http://userscripts.org/users/33432
// @include     http://chaosmemo.net/bunnyblack/*
// @version     1
// @grant       none
// @description	Translates http://chaosmemo.net/bunnyblack/
// @downloadURL https://update.greasyfork.org/scripts/8955/Bunny%20Black%20Anti-Ching-Chong.user.js
// @updateURL https://update.greasyfork.org/scripts/8955/Bunny%20Black%20Anti-Ching-Chong.meta.js
// ==/UserScript==


var translations={
	// General
	嵐の塔:				"Tower of Storms",
	禍根の地下迷宮:		"Den of Malevolence",
	銅魔の穴:			"Cave of Bueroza",
	魔窟園:				"Garden Lair",
	
	"[[D]]階":			"[[D]]F",
	
};

function defined(v){
	return v!=undefined;
}

function translate(text){
	var numbers=[];
	var no;
	
	if(!defined(text) || !text.match) return undefined;
	
	text=text.replace(/^\s*/,"").replace(/\s*$/,"");

	if(text=="") return undefined;

	while(defined(no=text.match(/\d+/)))
		numbers.push(no[0]),text=text.replace(/\d+/,"[[D]]");

	var translation=translations[text];
	
	if(defined(translation)){
		while(numbers.length)
			translation=translation.replace(/\[\[D\]\]/,numbers.shift());
	}
	
	return translation;
}

function translateTree(a){
	var items=document.evaluate("descendant::*",a,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
	
	for(var i=0;i<items.snapshotLength;i++){
		var e=items.snapshotItem(i);
		
		for(var j=0;j<e.childNodes.length;j++){
			var elem=e.childNodes[j];
			if(elem.nodeType==3){
				var text=translate(elem.wholeText);
				if(defined(text)) elem.nodeValue=text;
			} else{
				var text=translate(elem.value);
				if(defined(text)) elem.value=text;
			}
		}
	}
}

document.body.addEventListener("DOMNodeInserted",function(a){translateTree(a.relatedNode);},false);

translateTree(document);
