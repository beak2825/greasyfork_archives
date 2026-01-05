// ==UserScript==
// @name         DuckDuckGo bang fixer
// @namespace    http://tombebbington.github.io/
// @version      0.3
// @description  Cross-references bangs on the DuckDuckGo bangs page
// @author       Tom Bebbington
// @match        https://duckduckgo.com/bang.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6996/DuckDuckGo%20bang%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/6996/DuckDuckGo%20bang%20fixer.meta.js
// ==/UserScript==

"use strict";
(function() {
    function remove(node) {
        node.parentNode.removeChild(node);
    };
    function run_xpath(path) {
    	return document.evaluate(path, document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
    }
    var re = /(.+) \((\!.+)\)/;
    var bang_re = /\!([^ \!]+)/g;
    var values = run_xpath(".//*[@id=\"content_internal\"]/p[5]");
    var text_values = values.textContent;
    remove(values);
    remove(document.getElementById("bottom_spacing2"));
    remove(run_xpath("//*[@id=\"content_internal\"]/h4[8]"));
    var entries = new Map();
    for(entry of text_values.trim().split("\n")) {
        var matched = entry.match(re);
        if(matched != null) {
        	entries.set(matched[2], matched[1]);
        }
    }
    var content = document.getElementById("content_internal");
    var lists = content.getElementsByTagName("ul");
    lists = [].slice.call(lists);
    lists.shift();
    for(list of lists) {
        var sublists = list.children;
        for(var i = 0; i < sublists.length; i++) {
        	var elem = sublists[i];
        	var new_content = elem.innerHTML.substr(0, elem.innerHTML.indexOf("!") - 1);
        	var bangs = elem.innerHTML.match(bang_re);
            for(bang of bangs) {
        		bang = bang.trim();
        		new_content += bang + " (" + entries.get(bang) + ") \n";
            }
        	elem.innerHTML = new_content;
    	}
    }
})()