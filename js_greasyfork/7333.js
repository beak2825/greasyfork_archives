// ==UserScript==
// @name        egovatwar
// @namespace   egov4war
// @description Orders and shouts from Alliance Headquarters and Ministry of Defence
// @include     *.erepublik.com/*
// @version     0.2.10
// @author Serj_LV (aVie)
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/7333/egovatwar.user.js
// @updateURL https://update.greasyfork.org/scripts/7333/egovatwar.meta.js
// ==/UserScript==

function egov4war_start (battleList) {
	
	var egov4war = '0.2.10';
	var scriptLink = 'https://greasyfork.org/ru/scripts/7333-egovatwar';
	
	var countries = {
		"Albania": 167,
		"Argentina": 27,
		"Armenia": 169,
		"Australia": 50,
		"Austria": 33,
		"Belarus": 83,
		"Belgium": 32,
		"Bolivia": 76,
		"Bosnia-Herzegovina": 69,
		"Brazil": 9,
		"Bulgaria": 42,
		"Canada": 23,
		"Chile": 64,
		"China": 14,
		"Colombia": 78,
		"Croatia": 63,
		"Cuba": 171,
		"Cyprus": 82,
		"Czech-Republic": 34,
		"Denmark": 55,
		"Egypt": 165,
		"Estonia": 70,
		"Finland": 39,
		"France": 11,
		"Georgia": 168,
		"Germany": 12,
		"Greece": 44,
		"Hungary": 13,
		"India": 48,
		"Indonesia": 49,
		"Iran": 56,
		"Ireland": 54,
		"Israel": 58,
		"Italy": 10,
		"Japan": 45,
		"Latvia": 71,
		"Lithuania": 72,
		"Macedonia-FYROM": 79,
		"Malaysia": 66,
		"Mexico": 26,
		"Moldova": 52,
		"Montenegro": 80,
		"Netherlands": 31,
		"New-Zealand": 84,
		"Nigeria": 170,
		"North-Korea": 73,
		"Norway": 37,
		"Pakistan": 57,
		"Paraguay": 75,
		"Peru": 77,
		"Philippines": 67,
		"Poland": 35,
		"Portugal": 53,
		"Romania": 1,
		"Russia": 41,
		"Saudi-Arabia": 164,
		"Serbia": 65,
		"Singapore": 68,
		"Slovakia": 36,
		"Slovenia": 61,
		"South-Africa": 51,
		"South-Korea": 47,
		"Spain": 15,
		"Sweden": 38,
		"Switzerland": 30,
		"Taiwan": 81,
		"Thailand": 59,
		"Turkey": 43,
		"Ukraine": 40,
		"United-Arab-Emirates": 166,
		"United-Kingdom": 29,
		"Uruguay": 74,
		"USA": 24,
		"Venezuela": 28
	};
	
	function jsonRequest(u, onSuccess) {
		if ( typeof GM_xmlhttpRequest == 'undefined' ) {
			var aR = new XMLHttpRequest();
			aR.onreadystatechange = function() {
				if( aR.readyState == 4 && (aR.status == 200 || aR.status == 304))
					onSuccess(eval('(' + aR.responseText + ')'));
			};
			aR.open('GET', u, true);
			aR.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
			aR.send();
		} else GM_xmlhttpRequest({
			method: "GET",
			url: u,
			onload: function(e) {
				onSuccess(JSON.parse(e.responseText));
			}
		});
	}
	
	function $g(aID) {return (aID !== '' ? document.getElementById(aID) : null);}
	function $gt(str,m) { return (typeof m == 'undefined' ? document:m).getElementsByTagName(str); }
	function $gc(str,m) { return (typeof m == 'undefined' ? document:m).getElementsByClassName(str); }
	function $at(aElem, att) {if (att !== undefined) {for (var xi in att) {aElem.setAttribute(xi, att[xi]); if (xi.toUpperCase() == 'TITLE') aElem.setAttribute('alt', att[xi]);}}}
	function $t(iHTML) {return document.createTextNode(iHTML);}
	function $e(nElem, att) {var Elem = document.createElement(nElem); $at(Elem, att); return Elem;}
	function $ee(nElem, oElem, att) {var Elem = $e(nElem, att); if (oElem !== undefined) if( typeof(oElem) == 'object' ) Elem.appendChild(oElem); else Elem.innerHTML = oElem; return Elem;}
	function $am(Elem, mElem) { if (mElem !== undefined) for(var i = 0; i < mElem.length; i++) { if( typeof(mElem[i]) == 'object' ) Elem.appendChild(mElem[i]); else Elem.appendChild($t(mElem[i])); } return Elem;}
	function $em(nElem, mElem, att) {var Elem = $e(nElem, att); return $am(Elem, mElem);}
	function insertAfter(node, rN) {rN.parentNode.insertBefore(node, rN.nextSibling);}
	
	var useDOMs = typeof window.localStorage == 'undefined' ? false: true;
	if ( ! (typeof GM_getValue == 'undefined' || /khtml/i.test(navigator.appVersion)) ) {
		if( useDOMs )
			if( GM_getValue('brokenFF',0) == 1 ) useDOMs = false;
			else {
				GM_setValue('brokenFF',1);
				if( typeof window.localStorage.setItem != "undefined" ) GM_setValue('brokenFF',2);
			}
	}
	function RB_getValue ( key, defaultValue ) {
		if( useDOMs ) {
			var value = window.localStorage.getItem(key);
			if( value === null ) value = defaultValue;
			return value;
		} else return GM_getValue( key, defaultValue );
	}
	function RB_setValue( key, value ) {
		if( useDOMs )
			window.localStorage.setItem( key, value );
		else
			GM_setValue( key, value );
	}
	if (typeof GM_addStyle == 'undefined' ) {
		function GM_addStyle(css) {
			var head = document.getElementsByTagName('head')[0];
			if (head) {
				var style = document.createElement("style");
				style.type = "text/css";
				style.appendChild($t(css));
				head.appendChild(style);
			}
		}
	}
	
	
	function getDivision(e) {
		if (e < 35) return 1;
		if (e < 50) return 2;
		if (e < 70) return 3;
		return 4;
	}
	function wallStyle (wallL) {
		return 'margin:0;padding:0;'
		+ 'background: -moz-linear-gradient(left,  #33cc33 0%, #33cc33 ' + wallL + '%, #cc3333 ' + wallL + '%, #cc3333 100%);'
		+ 'background: -webkit-gradient(linear, left top, right top, color-stop(0%,#33cc33), color-stop(' + wallL + '%,#33cc33), color-stop(' + wallL + '%,#cc3333), color-stop(100%,#cc3333));'
		+ 'background: -webkit-linear-gradient(left,  #33cc33 0%,#33cc33 ' + wallL + '%,#cc3333 ' + wallL + '%,#cc3333 100%);'
		+ 'background: -o-linear-gradient(left,  #33cc33 0%,#33cc33 ' + wallL + '%,#cc3333 ' + wallL + '%,#cc3333 100%);'
		+ 'background: -ms-linear-gradient(left,  #33cc33 0%,#33cc33 ' + wallL + '%,#cc3333 ' + wallL + '%,#cc3333 100%);'
		+ 'background: linear-gradient(to right,  #33cc33 0%,#33cc33 ' + wallL + '%,#cc3333 ' + wallL + '%,#cc3333 100%);'
		+ 'border:solid #666 1px;';
	}
	function showPoints(order, countryIdL, countryIdR, wallL, wallR, dominationL, dominationR, totalL, totalR) {
		$am($g("order" + order),[
		$e('img',{class:"egov_img egov_iL", src:"http://cdn.egov4you.org/img/flags/" + countryIdL + ".gif"}),
			$e('img',{class:"egov_img egov_iR", src:"http://cdn.egov4you.org/img/flags/" + countryIdR + ".gif"}),
			$ee('span', totalL, {class:"egov_total egov_tL"}),
			$ee('span', totalR, {class:"egov_total egov_tR"}),
			$ee('span', dominationL, {class:"egov_domination egov_dL"}),
			$ee('span', dominationR, {class:"egov_domination egov_dR"}),
			$em('div',[
			$ee('span', wallL + '%', {class:"egov_wall egov_wL"}),
				$ee('span', wallR + '%', {class:"egov_wall egov_wR"}),
				Math.max(dominationL,dominationR) < 1800 ? "":
				$ee('span', 'Waiting', {class:"egov_percent"})
			],{style:"position:absolute;left:350px;top:10px;width:270px;height:22px;" + wallStyle(wallL)})
		]);
	}
	function showWall(order, countryIdL, countryIdR, wallL, wallR, dominationL, dominationR, totalL, totalR) {
		var bPercent = Math.floor(Math.max(dominationL,dominationR)/18);
		bPercent = bPercent >= 100 ? "waiting": bPercent + "%";
		$am($g("order" + order),[
		$ee('span', totalL, {class:"egov_total egov_tL"}),
			$ee('span', totalR, {class:"egov_total egov_tR"}),
			$ee('span', bPercent, {class:"egov_percent"}),
			$em('div',[
			$e('img', {class:"egov_img egov_iL", src:"http://cdn.egov4you.org/img/flags/" + countryIdL + ".gif"}),
				$e('img', {class:"egov_img egov_iR", src:"http://cdn.egov4you.org/img/flags/" + countryIdR + ".gif"}),
				$ee('span', wallL, {class:"egov_wall egov_wL"}),
				$ee('span', wallR, {class:"egov_wall egov_wR"}),
			],{style:"position:absolute;left:145px;top:31px;width:80px;height:11px;" + wallStyle(wallL)})
		]);
	}
	function getPointsWall(battleId, order, division) {
		//	jsonRequest("/en/military/battle-status/" + battleId + "/1", function(json) {
		jsonRequest("/en/military/nbp-stats/" + battleId + "/"+division, function(json) {
			if (json.message != 'BATTLE_CLOSED') {
				var countryIdL = Object.getOwnPropertyNames(json.division)[0];
				var countryIdR = Object.getOwnPropertyNames(json.division)[1];
				if( json.division.domination[division] == 50 && json.division.domination[11] != 50 )
					division = 11;
				var domination = Math.round(json.division.domination[division] * 1000) / 1000;
				domination = domination.toFixed(3);
				var bar = json.division.bar[division];
				var wallL = domination > 50 ? (
					bar == countryIdL ? domination: 100 - domination
				):(
					bar == countryIdL ? 100 - domination: domination
				);
				var wallR = 100 - wallL;
				var dominationL = json.division[countryIdL][division].domination;
				var dominationR = json.division[countryIdR][division].domination;
				var totalL = json.division[countryIdL].total;
				var totalR = json.division[countryIdR].total;
				if (battleList) {
					wallL = Number(wallL).toFixed(3);
					wallR = Number(wallR).toFixed(3);
					showPoints(order, countryIdL, countryIdR, wallL, wallR, dominationL, dominationR, totalL, totalR);
				} else {
					wallL = Number(wallL).toFixed(2);
					wallR = Number(wallR).toFixed(2);
					showWall(order, countryIdL, countryIdR, wallL, wallR, dominationL, dominationR, totalL, totalR);
				}
				if( totalL < 94 && totalR < 94 ) {
					if (order == 6) {
						$g("hq1").style.display="block";
						$g("hq2").style.display="block";
					} else {
						$g("mod1").style.display="block";
						$g("mod2").style.display="block";
					}
					$g("order" + order).style.display="block";
				}
			}
		});
	}
	function drawStars2(n) {
		var stars = $e('div', {class:"egov_stars"});
		for (var i = 0; i < n; i++) {
			stars.appendChild($e('img', {style:"width:" + (battleList ? 18:16) + "px;margin:0;", alt:"*", src:"http://cdn.egov4you.org/img/star.png"}));
		}
		return stars;
	}
	function showOrder ( order, fl ) {
		return $em('li',[
		drawStars2(order.stars),
				   $ee('span', order.region, {class:"egov_region"}),
				   $ee('span', order.note, {class:"egov_note"}),
				   $ee('span', $ee('a', 'Fight', {title:"", href:(order.side !== null ?
					   '/en/military/battlefield-choose-side/' + order.battle + '/' + order.side:
					   '/en/military/battlefield/' + order.battle), class:"button_body colour_"+(order.stars>4?"red":"blue")}), {class:"button_bkg fight_button egov_button"})
		],{id:"order" + (fl ? order.order: 6), class:"egov_li", style:"display:none;"});
	}
	
	var egov4Country = RB_getValue('egov4Country',40);
	if( ! battleList ) {
		var sb = $gc('user_finances');
		if( sb.length == 0 ) return;
		
		var str = 'egovatwar <a target="_blank" href="'+scriptLink+'">v' + egov4war + '</a><select id="selectCountry" style="margin-top:3px;width:150px;font-size:10px;">';
		for( var country in countries )
			str += '<option value="' + countries[country] + '"' + (countries[country] == egov4Country ?' selected="selected">':'>') + country + '</option>';
		str += '</select>';
		insertAfter($ee('div', str, {id:"egov4warSidebar", style:"font-size:10px;font-weight:bold;color:#333;"}),sb[0]);
		$g('selectCountry').addEventListener('change', function() {
			RB_setValue('egov4Country', this.value);
			window.location = location.href;
		},false);
	}
	
	GM_addStyle("#battle_listing li.egov_li {height: auto; padding: 5px 4px 3px;position:relative;} "+
	".egov_region {position:absolute;left:6px;top:5px;font-size:12px;line-height:14px;color:#333;font-weight:bold;} "+
	".egov_note {position:absolute;left:6px;top:18px;font-size:10px;line-height:12px;color:#333;max-width:205px;overflow:hidden;white-space:nowrap;} "+
	".egov_stars {white-space:nowrap;position:absolute;left:2px;top:29px;} "+
	".egov_updated {color:#b6b6b6;font-size:90%;font-weight:normal;} "+
	(battleList?
	".egov_button a {margin-left: 700px;margin-right:20px;} "+
	"#battle_listing .egov_domination {width:30px;position:absolute;top:17px;font-size:10px;line-height:10px;color:#333;font-weight:bold;} "+
	".egov_dL {text-align:right;left:315px;} .egov_dR {text-align:left;left:627px;} "+
	"#battle_listing .egov_img {position:absolute;top:13px;height:16px;border:solid #666 1px;} "+
	".egov_iL {left:210px;} .egov_iR {left:276px;} "+
	"#battle_listing .egov_total {width:14px;position:absolute;top:17px;font-size:10px;line-height:10px;color:#333;font-weight:bold;} "+
	".egov_tL {left:239px;text-align:left;} .egov_tR {left:258px;text-align:right;} "+
	"#battle_listing .egov_wall {width:45px;position:absolute;bottom:6px;font-size:10px;line-height:10px;color:#fff;font-weight:bold;} "+
	".egov_wL {text-align:left;left:7px;} .egov_wR {text-align:right;right:6px;} "+
	"#battle_listing .egov_percent {width:60px;text-align:center;position:absolute;left:105px;bottom:3px;font-size:16px;line-height:16px;color:#ff3;font-weight:bold;}"
	:
	".egov_button {padding: 6px 10px 6px 257px;}"+
	".egov_button a {padding: 1px 15px 0px !important;} "+
	"#battle_listing .egov_img {position:absolute;bottom:0;width:12px;height:9px;border:solid #666 1px;} "+
	".egov_iL {left:-16px;} .egov_iR {right:-16px;} "+
	"#battle_listing .egov_total {width:15px;position:absolute;top:32px;font-size:10px;line-height:10px;color:#333;font-weight:bold;z-index:100;} "+
	".egov_tL {left:112px;text-align:right;} .egov_tR {left:245px;text-align:left;} "+
	"#battle_listing .egov_wall {width:40px;position:absolute;bottom:1px;font-size:10px;line-height:10px;color:#fff;font-weight:bold;} "+
	".egov_wL {text-align:left;left:3px;} .egov_wR {text-align:right;right:2px;} "+
	"#battle_listing .egov_percent {width:50px;text-align:right;position:absolute;left:180px;top:12px;font-size:10px;line-height:10px;color:#333;font-weight:bold;}"
	)
	);
	
	jsonRequest('http://www.egov4you.org/orders/data/' + egov4Country,
				function(json) {
					var division = getDivision(parseInt($gt('b',$gc("user_level")[0])[0].innerHTML));
					str = '';
					var ordersDiv = $e('div', {style:"clear:both;float:left;"});
					insertAfter(ordersDiv,battleList?$g("campaignsSearchContainer"):$g("battle_listing").childNodes[1]);
					
					if (json.target && json.target.battle !== null && (json.target.div === null || json.target.div == division)) {
						if (json.target.note.length == 0) {
							json.target.note = 'Fight!';
						}
						$am(ordersDiv,[
						$em('h4',[
						json.alliance + ' HeadQuarters ',
		  $ee('span','(updated in day ' + json.target.updated + ')', {class:"egov_updated"})
						],{id:"hq1", style:"display:none;float:none;"}),
		  $ee('ul', showOrder(json.target, false), {id:"hq2", style:"display:none;"})
						]);
						getPointsWall(json.target.battle, '6', division);
					}
					
					if (json.orders) {
						var checkBattles = false;
						for(var index in json.orders) {
							if (json.orders[index].battle !== null) {
								checkBattles = true;
							}
						}
						if (checkBattles) {
							$am(ordersDiv,[
							$em('h4',[
							'Ministry of Defence ',
		   $ee('span', '(updated in day ' + json.updated + ')', {class:"egov_updated"})
							],{id:"mod1", style:"display:none;float:none;"}),
		   $e('ul',{id:"mod2", style:"display:none;"})
							]);
							for(var index in json.orders) {
								if (json.orders[index].battle !== null && (json.orders[index].div === null || json.orders[index].div == division)) {
									if (json.orders[index].note.length == 0) {
										json.orders[index].note = 'Fight!';
									}
									$g('mod2').appendChild( showOrder(json.orders[index], true) );
									getPointsWall(json.orders[index].battle, json.orders[index].order, division);
								}
							}
						}
					}
					
					if ( ! battleList ) {
						if (json.shouts) {
							var firstPost = $gc("wall_post")[0];
							for(var index in json.shouts) {
								if (json.shouts[index].text.length > 0) {
									var sT = json.shouts[index].alliance !== null ? ["/en/main/alliances",2]:["/en/military/campaigns",1];
									firstPost.parentNode.insertBefore($em('li',[
									$em('a',[
									$e('span'),
										$e('img',{src:"http://cdn.egov4you.org/img/about"+sT[1]+".png"})
									],{href:sT[0], class:"user_pic", target:"_blank"}),
									$em('div',[
									$em('h6',[
									$ee('a', (sT[1]==2?json.shouts[index].alliance + ' HeadQuarters':'Ministry of Defence'), {href:sT[0]}),
										$ee('em','wrote in day ' + json.shouts[index].updated)
									]),
			 $ee('p',json.shouts[index].text.replace('="www','="http://www'))
									],{class:"post_content"})
									],{class:"wall_post"}), firstPost);
								}
							}
						}
					}
				});
}

if (window.location.href.split("/").length == 4) {
	egov4war_start(false);
} else if (window.location.href.indexOf("/military/campaigns") > 0) {
	egov4war_start(true);
}
