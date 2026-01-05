// ==UserScript==
// @name        Webadmin - toggle Formularparameter
// @namespace   com.aforms2web.ds.ujs
// @description Add a toggle to expand/collapse the form-parameters of a afs-webadmin
// @author      dietmar.stoiber@aforms2web.com
// @include     *webadmin*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6364/Webadmin%20-%20toggle%20Formularparameter.user.js
// @updateURL https://update.greasyfork.org/scripts/6364/Webadmin%20-%20toggle%20Formularparameter.meta.js
// ==/UserScript==

var parameterList = document.getElementById("parameterList");

if(parameterList != null){

	// ### Insert CSS (because Stylish is not able to use Wildcards)
	var css = new Array();

	function writeStyle(css) {
	    var style = document.createElement('style');
	    style.type = 'text/css';
	    if (document.getElementsByTagName) {
		document.getElementsByTagName('head')[0].appendChild(style);
		if (style.sheet && style.sheet.insertRule) {
		    for (var i = 0; i < css.length; i++) {
		        style.sheet.insertRule(css[i], 0);
		    }
		}
	    }
	}

	function addStyle(style) {
	    css[css.length] = style;
	}

	// Define your CSS here

	addStyle("#parameterListToggle{"
	 + "  padding-left: 20px!important;"
	 + "  color: navy;"
	 + "  font-weight: normal!important;"
	 + "  cursor: pointer;"
	 + "}");
	addStyle("#parameterListToggle:hover{"
	 + "  color: green;"
	 + "}");
	addStyle("#parameterListToggle:before{"
	 + "  content:  \"[ \";"
	 + "  color: black;"
	 + "}");
	addStyle("#parameterListToggle:after{"
	 + "  content:  \" ] \";"
	 + "  color: black;"
	 + "}");
	
	// Writes CSS to the document
	writeStyle(css);



	// ### Gnerate Toggle Link

	var parameterList = document.getElementById("parameterList");
	var parameterListHeaderTd = parameterList.previousSibling.previousSibling.childNodes[1].childNodes[2].childNodes[1];

	var newSpan = document.createElement("span");
	var idNode = document.createAttribute("id");
	idNode.nodeValue = "parameterListToggle";
	newSpan.setAttributeNode(idNode);
	var onclickNode = document.createAttribute("onclick");
	onclickNode.nodeValue = "toggle_parameterList();";
	newSpan.setAttributeNode(onclickNode);
	newSpan.appendChild(document.createTextNode("toggle"));
	parameterListHeaderTd.appendChild(newSpan)

	var newScript = document.createElement("script");
	var typeNode = document.createAttribute("type");
	typeNode.nodeValue = "text/javascript";
	newScript.setAttributeNode(typeNode);
	newScript.appendChild(document.createTextNode(
	"function toggle_parameterList() {\n"
	 + "  var elem = document.getElementById('parameterList');\n"
	 + "  var tggl = document.getElementById('parameterListToggle').childNodes[0];\n"
	 + "  if(elem.style.display == '')  {\n"
	 + "    elem.style.display = 'none';\n"
	 + "    tggl.nodeValue = '▼ expand';\n"
	 + "  } else {\n"
	 + "    elem.style.display = '';\n"
	 + "    tggl.nodeValue = '△ collapse';\n"
	 + "  }\n"
	 + "} "));
	parameterListHeaderTd.appendChild(newScript)

	toggle_parameterList();

}