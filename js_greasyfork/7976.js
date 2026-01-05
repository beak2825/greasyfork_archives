// ==UserScript==
// @name			WME Beta/Prod switcher
// @namespace		@BPS_Myriades
// @description		allow you to switch faster from beta to prod editor and vice versa
// @include			https://*.waze.com/*editor/*
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA3CAYAAABQOymxAAAABGdBTUEAAYagMeiWXwAAAAlwSFlz AAALEwAACxMBAJqcGAAAAAd0SU1FB98BFRQjL3tMy9MAAATrSURBVGje7ZldbBVFFMd/e1uKt0XK h+3dC2I0YjRgINKARow8iAmEgA9IotGINoqQUIkajD5oDD7ogzEKKA9EDARjbDCoCcQYE4nGRGjF irUoWFEiDbRIC/2+3T3jw521y3Rvb6F3t03cfzLJnbm755z/njMz58xAjBgxYsSIESNGjEEoUIWS lQjDOAVKICPwiwPL/w/esO6GyQ6sEmgZhbjbAKuQHi4ULGAiMFsbt7sImh1Y4SesPb9VIAOQgfkC RwS6BQ5n4HY9vsCBxi5w34b28UR4JrAE2AH0osNZgcqACDQ5sMJP2IXHDkERgECdCzWtUOZCjcBh b/wgbEuCu1HLAzaPB8LrszwGmxr8vTco3Ouh2OsL9LRAEqAVygS6vfEknARU8nKZe8YD6aXApQDC r+VbbbWH15+FUu3hIwDn4cTToK4BteFymQqoHmvCdwJnAgivy0c4A3cI1An0CNRlYD5QshBaj4Hq AvX6UMIKqBorsssMQ5ys41DAylFslZuBPoYS9dpvQGnUZG2gg6Hh9qL+PW+U8ueSXeFzkX4qasI/ GwbsRa++wF1AugA6Jvmni9GOR+nl5wzlZ4AJIemaBVzMQXpRFGQnAecMxRtC1rnatzb4W20UhKsM pd1AKgK9P+RYvELHfkPp9xFNo/sCCJ8FpoZZLRUDC4yxtuFeuK6f2baw3RY+t102UJvVWdFNyhbe sIWPKl02UT+YgeXAMeBCwPSaFCbhSqDcGGvP9fCMXq4vnkA9cCPQicU2+0HeuqGDKUVJvlPwiIJM wqLGXsC+PLrbGFp5lQHXhhlWc4B+I6x259yoha228M5/X8vhAVtwU8K3ttAw9QKTASpaKbOF5vQA 9+TR/1VAWM8N08PlQIkxNtwXrlIuH3qd1mI+A/ZYsNh1WNs+jUsAbZV0K/jETeRNGf8x+j1AV5iE g+rSiit6R9GMhZVIMC3AGGsEdbdJuDtMwu06pP2YnWulVNBAEQ97/VSGOVhsVoo6K8HOdCfTAdIt JC1YjXA0j34ze7s43BpSCFTqsDLn0f2B1vUyyxY6UsIBW9hlC522sHPGJabZQnNKOJ0S3rWFRlv4 cgTOOW7o/TSK/fBUAOGGXA9X9HGzLWxPCftTLs9428/0HtIpYUdK+CIlbEm3ZA8C8pyumBXU4igI fxxA2NGlYph40tB5KqriYV6ORN7R+20YKAFOG/pqoqqUygKUe62tQHm1Tfb0w8MeQ8/RgO0xVKzL Ub0o4O8CFP/ztPzngZcM+W6IkTTsfnhymNOIfm1o0VXKX67liCbol33vWJ1nLQpIM81DgYlXKbs6 h7yFozV6NHdLR4AXgtIqHXdpgSYX1owgfVMBpxwmSq+0MgoL7zP0IL5+DRQ7sFSG5r8jIbxrmMip Hg+kn/XmmjZ+ZS0kNOET3kP9cIvA1wJdAscGYJHyXc/4iB/S1zKqGdSybIHwnp6/MxknuBVo9Bsv kHF859MC37iw9k+Y6MBygZ9yeLgJ+KAIntgHjzrwK/kLi7GBZ/yrYDmwROB3H+Eu44O4QYTbYZPA HwID+jmnUPYlIvgG/krqR4HHz0GZBVZCb1sKent8lVA5bBHYeB6muLDKuvrtLRoPa6+IwF8uPOT9 1wc3CRwQuOifswJvCnR6fRdeFugQaHHhlfF4IR4jRowYMWLEiBHDxL9n5GmO270lnAAAAABJRU5E rkJggg==
// @version			0.2.5
// @copyright		2015, Myriades
// @downloadURL https://update.greasyfork.org/scripts/7976/WME%20BetaProd%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/7976/WME%20BetaProd%20switcher.meta.js
// ==/UserScript==

/***	Bootstrap et inits	***/
function BPS_Bootstrap(){
    if (typeof unsafeWindow === "undefined") {
        unsafeWindow    = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window');
            return dummyElem.onclick();
        }) ();
    }
	console.info('BPS_Bootstrap ok');
    BPS_Initialise();
}

function BPS_Initialise(){
	_isBetaTester = null;
	_helpers = new helpers();
	_helpers.checkUserGroup('WME beta testers');
	_BPSimgs = new imgs();
	_helpers.log('BPS_Initialise', 'info', 'Done');
	BPS_check_Waze_Els();
}

function BPS_check_Waze_Els(){
	//	Waze object needed
	if(typeof(unsafeWindow.Waze) == 'undefined'){
		_helpers.log('BPS_check_Waze_Els', 'error', 'unsafeWindow.Waze NOK', unsafeWindow.Waze);
		window.setTimeout(BPS_check_Waze_Els, 500);
		return;
	}
	_Waze = unsafeWindow.Waze;
	if(typeof(_Waze.loginManager) == 'undefined'){
		_helpers.log('BPS_check_Waze_Els', 'error', 'Waze.loginManager NOK', _Waze.loginManager);
		window.setTimeout(BPS_check_Waze_Els, 500);
		return;
	}
	_loginManager = _Waze.loginManager;
	if(_loginManager.user == null){
		_helpers.log('BPS_check_Waze_Els', 'error', 'You are not logged!');
		window.setTimeout(BPS_check_Waze_Els, 1000);
		return;
	}
	//	Waze UI
	if(_helpers.getId('edit-buttons') === null){
		setTimeout(BPS_check_Waze_Els, 250);
		return;
	}
	_layerSwitcher = _helpers.getId('edit-buttons');
	WME_env = /www/.test(location.href);
	var WME_beta = /editor-beta/.test(location.href);
	if(!WME_env && !WME_beta){
		setTimeout(BPS_check_Waze_Els, 250);
		return;
	}
	//	Check user as a beta tester
	if(WME_env){
		switch(_isBetaTester){
			case null:
				_helpers.log('BPS_check_Waze_Els', 'info', 'User groups not acquired, waiting');
				window.setTimeout(BPS_check_Waze_Els, 500);
				return;
			case false:
				_helpers.log('BPS_check_Waze_Els', 'info', 'You are not an editor beta tester (if you are, please subscribes @https://www.waze.com/forum/ucp.php?i=167 . Exiting script!');
				return;
		}
	}
	_helpers.log('BPS_check_Waze_Els', 'info', 'Done');
	BPS_html();
}

/***	HELPERS		***/
function helpers(){
	this.log = function(fName, type, text){
		var text = GM_info.script.name + ' V' + GM_info.script.version + ' ' + fName + ' : ' + text;
		switch(type){
			case 'info':
				console.info(text);
				break;
			case 'error':
				console.error(text);
				break;
			case 'warn':
				console.warn(text);
				break;
			// case 'debug':
				// console.debug(text);
				// break;
			default:
				console.log(text);
				break;
		}
		if(arguments[3] != null){
			switch(typeof(arguments[3])){
				case 'string':
				case 'boolean':
					console.log(arguments[3]);
					break;
				default:
					console.dir(arguments[3]);
					break;
			}
		}
	}

	this.insertAfter = function(element, target){
		this.insertBefore(element, target.nextSibling);
	}

	this.insertBefore = function(element, target){
		target.parentNode.insertBefore(element, target);
	}

	this.getId = function(node){
		if(node != '')return document.getElementById(node);
		return false;
	}
	
	this.checkUserGroup = function(group){
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open('GET', 'https://www.waze.com/forum/ucp.php?i=167', true);
		xmlhttp.onreadystatechange = function(aEvt){
			if (xmlhttp.readyState == 4){
				if(xmlhttp.status == 200){
					var tmp = xmlhttp.responseText.replace(/(\n|\r|\t)/g, '');
					var patt = new RegExp("Change default group.{0,140}(" + group + ")");
					var test = tmp.match(patt);
					if(test != null)_isBetaTester = true;
					else _isBetaTester = false;
				}
				else _helpers.log('checkUserGroup', 'error', 'Error :', xmlhttp.status);
			}
		};
		xmlhttp.send(null);
	}
}

function imgs(){
	var basePng = 'data:image/png;base64,';
	this.beta_active = basePng + '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 RBFFFB7/BQ+8e1fSS3wMAAAAAElFTkSuQmCC';
	this.prod_active = basePng + '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 YII=';
}
/***	le script	***/
function BPS_html(){
	var container = document.createElement('div');
	container.className = 'toolbar-button';
	var myImg = document.createElement('img');
    if(WME_env){
        myImg.src = _BPSimgs.prod_active;
        myImg.title = "Switch to Beta editor";
    }
    else{
        myImg.src = _BPSimgs.beta_active;
        myImg.title = "Switch to Prod editor";
    }
	myImg.style.width = '100%';
	myImg.style.height = '100%';
	container.appendChild(myImg);
	_helpers.insertBefore(container, _layerSwitcher);
	var separator = document.createElement('div');
	separator.className = 'toolbar-separator';
	_helpers.insertBefore(separator, _layerSwitcher);
	container.onclick = BPS_check_perma;
	_helpers.log('BPS_html', 'info', 'Ready');

	function BPS_check_perma(e){
		var _href = document.getElementsByClassName('WazeControlPermalink')[0].getElementsByClassName('icon-link')[0].href;
		if(WME_env)_href = _href.replace(/www/, 'editor-beta');
		else _href = _href.replace(/editor-beta/, 'www');
		if(e.ctrlKey)window.open(_href, '_blank');
		else location.replace(_href);
	}
}

BPS_Bootstrap();