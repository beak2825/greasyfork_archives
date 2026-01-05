// ==UserScript==
// @name       Team Trader
// @namespace  Fana
// @version    0.1
// @description  team trader summary
// @include    http*://canto.world-of-dungeons.org/wod/spiel/forum/viewtopic.php?id=5854*
// @copyright  2014+, Fana
// @downloadURL https://update.greasyfork.org/scripts/6582/Team%20Trader.user.js
// @updateURL https://update.greasyfork.org/scripts/6582/Team%20Trader.meta.js
// ==/UserScript==

var mini=(function(){var b=/(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,g=/^(?:[\w\-_]+)?\.([\w\-_]+)/,f=/^(?:[\w\-_]+)?#([\w\-_]+)/,j=/^([\w\*\-_]+)/,h=[null,null];function d(o,m){m=m||document;var k=/^[\w\-_#]+$/.test(o);if(!k&&m.querySelectorAll){return c(m.querySelectorAll(o))}if(o.indexOf(",")>-1){var v=o.split(/,/g),t=[],s=0,r=v.length;for(;s<r;++s){t=t.concat(d(v[s],m))}return e(t)}var p=o.match(b),n=p.pop(),l=(n.match(f)||h)[1],u=!l&&(n.match(g)||h)[1],w=!l&&(n.match(j)||h)[1],q;if(u&&!w&&m.getElementsByClassName){q=c(m.getElementsByClassName(u))}else{q=!l&&c(m.getElementsByTagName(w||"*"));if(u){q=i(q,"className",RegExp("(^|\\s)"+u+"(\\s|$)"))}if(l){var x=m.getElementById(l);return x?[x]:[]}}return p[0]&&q[0]?a(p,q):q}function c(o){try{return Array.prototype.slice.call(o)}catch(n){var l=[],m=0,k=o.length;for(;m<k;++m){l[m]=o[m]}return l}}function a(w,p,n){var q=w.pop();if(q===">"){return a(w,p,true)}var s=[],k=-1,l=(q.match(f)||h)[1],t=!l&&(q.match(g)||h)[1],v=!l&&(q.match(j)||h)[1],u=-1,m,x,o;v=v&&v.toLowerCase();while((m=p[++u])){x=m.parentNode;do{o=!v||v==="*"||v===x.nodeName.toLowerCase();o=o&&(!l||x.id===l);o=o&&(!t||RegExp("(^|\\s)"+t+"(\\s|$)").test(x.className));if(n||o){break}}while((x=x.parentNode));if(o){s[++k]=m}}return w[0]&&s[0]?a(w,s):s}var e=(function(){var k=+new Date();var l=(function(){var m=1;return function(p){var o=p[k],n=m++;if(!o){p[k]=n;return true}return false}})();return function(m){var s=m.length,n=[],q=-1,o=0,p;for(;o<s;++o){p=m[o];if(l(p)){n[++q]=p}}k+=1;return n}})();function i(q,k,p){var m=-1,o,n=-1,l=[];while((o=q[++m])){if(p.test(o[k])){l[++n]=o}}return l}return d})();

var Result = 'result';
var ResultTD = undefined;
var ButtonTable = undefined;
var KeyButton = null;
var MainContent = undefined;
var TextBox = undefined;
var traderResult;

Function.prototype.method = function ( name, func ) {
	this.prototype[name] = func;
	return this;
};

String.method( 'txt', function () {
	return this.replace( /<.*?>|\s+|\s+|\n|\r|!/g, '' );
});

String.method( 'toInt', function() {
    return parseInt(this.replace( /\,/g, ''));
});

// 1 need reset point to unequip
// 2 item name
// 3 = 4+5+6
// 4 group mark
// 5 empty space
// 6 uses
//var rObj = new RegExp( '^(.+?)(!)?([ ])?([\(][0-9]+[\/][0-9]+[\)])?$' );
var rObj = /^(!! )?(.+?)((!)?([ ])?(\([0-9]+\/[0-9]+\))?)$/;

// used to separate item name, group mark, and number of uses
String.method( 'item_txt', function () {
	var result = [];
	var item = this.replace( /<.*?>|\n|\r/g, '' );

	var item_list = rObj.exec(item);
	result.push( (item_list[1])?item_list[1]:'' );
	result.push(item_list[2]);
	result.push( (item_list[3])?item_list[3]:'' );
	return result
	
});

String.method( 'sindexOf', function ( subs ) {
	var i = -1;
	while ( (sub = subs[++i]) ) {
		if ( this.indexOf( sub ) != -1 ) {
			return this.indexOf( sub );
		}
	}
	return ( -1 );
});

var WoDTool = {
	
	attrs : [],
	skills : [],
	items : [],
    heros : [],
    outputs : '',
    heroAttrs : [],
    teams : {},
    heroNum : 0,
    traderNum : 0,
    traderResult : [],
	busy : 0,
	root : location.protocol + '//' + location.host + '/',
	
	done_func : function () {},
	
	done : function ( func ) {
		WoDTool.done_func = func || WoDTool.done_func;
		if (WoDTool.busy === 0) {
			WoDTool.done_func();
		}
		
		return this;
	},

	walker : function ( selector, func, context ) {
	
		var i = -1, node;
		context = context || document;
		var collection = mini( selector, context );
		
		while ( (node = collection[++i]) ) {
			if (func( node ) ) break;
		}
		
		return this;
	},

	loader : function ( url, func, i ) {
		WoDTool.busy++;
		if ( url.indexOf( 'http' ) == -1 ) {
			url = WoDTool.root + url;
		}
		var req = new XMLHttpRequest();
		req.onreadystatechange = function () {
			if ( ( req.readyState == 4 ) && ( req.status == 200 ) ) {
				var dummy = document.createElement( 'div' );
				dummy.innerHTML = req.responseText;
				func( dummy, i );
				WoDTool.busy--;
				WoDTool.done();
			}
		};
		req.open( 'GET', url, true);
		req.send();
		return this;
	},
	
    loadAllLink : function () {
        var boardText = false;
        WoDTool.traderNum = 0;
        WoDTool.traderResult = [];
    
    	WoDTool.walker( 'div', function ( div ) {
    		if ( div.className == "boardtext" ) {
    			boardText = div;
    			return true;
			}
		}, document );

		if ( !boardText ) return false;

        WoDTool.walker( 'a', function ( a ) {
            if (a.href.indexOf('canto.world-of-dungeons.org') == -1) return;
            var searchInfo = {
                name : a.innerHTML,
                result : ''
            }
            WoDTool.traderResult.push(searchInfo);
            WoDTool.loader(a.href, function( dummy, i ) {
                WoDTool.searchTrader( dummy, i );
            }, WoDTool.traderNum);
            WoDTool.traderNum++;
		}, boardText );
        
        return this;
    },
    
    searchTrader : function ( context, NUM ) {
        var tot = WoDTool.traderNum;
        var i = tot - WoDTool.busy + 1;
        ResultTD.innerHTML = 'Searching('+i+'/'+tot+')...';
        context = context || document;

        WoDTool.walker('td > a', function ( a ) { 
			if (a.parentNode.className == 'table_bbcode' && a.innerHTML.indexOf(TextBox.value) != -1) {
                WoDTool.traderResult[NUM]['result'] += '<tr class="table_bbcode" style="border-width: 1px; ">' + a.parentNode.parentNode.innerHTML + '</tr>\n';
            }
        }, context);            
        
        return this;
    },

};

(function () {

    var main_body = document.getElementById("main_content");
    if (main_body === null) return;
    MainContent = main_body;
    
    var allInputs = MainContent.getElementsByTagName("div");
    for (var i = 0; i < allInputs.length; ++i)
    {
        if (allInputs[i].className == "gadget_body popup" || allInputs[i].className == "gadget_body")
        {
            ButtonTable = document.createElement("table");
            ButtonTable.setAttribute("width", "100%");

            var hrTR = document.createElement("tr");
            ButtonTable.appendChild(hrTR);
            var hrTD = document.createElement("td");
            hrTD.setAttribute("colspan", "2");
            hrTR.appendChild(hrTD);
            var hr = document.createElement("hr");
            hrTD.appendChild(hr);

            var newTR = document.createElement("tr");
            ButtonTable.appendChild(newTR);
            var buttonTD = document.createElement("td");
            newTR.appendChild(buttonTD);
            newButton = document.createElement("input");
            newButton.setAttribute("type", "button");
            newButton.setAttribute("class", "button");
            newButton.setAttribute("value", '搜索');
            newButton.addEventListener("click", OnSearch, false);
            buttonTD.appendChild(newButton);
            var checkTD = document.createElement("td");
            checkTD.setAttribute("width", "100%");
            checkTD.setAttribute("align", "left");
            newTR.appendChild(checkTD);
			TextBox = document.createElement("input");
            TextBox.setAttribute("type", "text");
            checkTD.appendChild(TextBox);
            
            var reTR = document.createElement("tr");
            ButtonTable.appendChild(reTR);
            ResultTD = document.createElement("td");
            ResultTD.setAttribute("colspan", "2");
            reTR.appendChild(ResultTD);
            ResultTD.innerHTML = Result;
                                              
            
            allInputs[i].appendChild(ButtonTable);
        }
    }    
})();

function OnSearch() {
    if (TextBox.value == '') return;
    ResultTD.innerHTML = 'Searching...';
    WoDTool.loadAllLink().done( function () {
        Result = '<div class="boardtext">';
        for (var i = 0; i < WoDTool.traderNum; i++) {
            if (WoDTool.traderResult[i]['result'] != '') {
	        	Result += '<span>'+WoDTool.traderResult[i]['name']+'</span><br>\n';
                Result += '<table class="table_bbcode" style="border-width: 1px; "><tbody>\n';
    	        Result += WoDTool.traderResult[i]['result'] + '</tbody></table><br>\n';
            }
        }
        Result += '</div>\n';
        ResultTD.innerHTML = Result;
    });
}

