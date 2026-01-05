// ==UserScript==
// @name	ika-core.org Ikariam Tools
// @namespace	ika-core
// @description	Next generation Ikariam search and addons script
// @license     Creative Commons Attribution License
// $icon	http://www.ika-core.org/git/icon48.png
// @include	http://s*.ikariam.gameforge.com/*
// @include	http://m*.ikariam.gameforge.com/*
// @exclude http://support.*.ikariam.gameforge.com/*
// @run-at	document-start
// @require	https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @resource	css http://www.ika-core.org/git/ika-core.css
// @resource	lic http://www.ika-core.org/git/licencemsg.txt
// @version	1.13
// @grant	GM_addStyle
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_getResourceText
// @grant	GM_openInTab
// @grant	GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/7387/ika-coreorg%20Ikariam%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/7387/ika-coreorg%20Ikariam%20Tools.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var nlang = (navigator.language) ? navigator.language : navigator.userLanguage;
var ufo = unsafeWindow,
    game, log, ikariam, screen, server, player, ally, selectedcity, island, islandx, islandy, realHour, nmb, resman, worlddraw, worldmap, transload = false,
    dbg = '',
    lang, hours = 36e5,
    minutes = 60000,
    seconds = 1000,
    COMPRESS = true;
var goods = {
    0: '<img src="skin/resources/icon_wood.png"/>',
    1: '<img src="skin/resources/icon_wine.png"/>',
    2: '<img src="skin/resources/icon_marble.png"/>',
    3: '<img src="skin/resources/icon_glass.png"/>',
    4: '<img src="skin/resources/icon_sulfur.png"/>'
};
var buildings = ["townHall", "shipyard", "port", "glassblowing", "branchOffice", "barracks", "academy", "warehouse", "palace", "palaceColony", "tavern", "museum", "workshop", "wall", "dump", "vineyard", "pirateFortress", "safehouse", "embassy", "stonemason", "carpentering", "forester", "winegrower", "alchemist", "optician", "fireworker", "architect", "temple", "blackMarket", "marineChartArchive"];
String.prototype.strip = function() {
    return this.replace(/<.*?[^>]>/g, '');
};
String.prototype.digits = function() {
    var d = this.replace(/\D/g, '');
    if (d == '') return 0;
    return d;
};
String.prototype.toJSON = function() {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
};
if (dbg == 'y') {
    var deb = ufo.console.log.bind(console);
} else {
    deb = function() {};
}
exportFunction(parser, unsafeWindow.console, {
    defineAs: "log"
});
document.addEventListener('beforescriptexecute', function(e) {
    if (e.target.innerHTML.search(/console\s=/) != -1) {
        e.stopPropagation();
        e.preventDefault();
        window.removeEventListener(e.type, arguments.callee, true);
    }
}, true);
document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        main();
        GM_addStyle(GM_getResourceText('css'));
    }
};

function toJSON(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}


function UTF8ArrToStr (aBytes) {

  var sView = "";

  for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = aBytes[nIdx];
    sView += String.fromCharCode(
      nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
        /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
        (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
        (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
        (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
        (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
        (nPart - 192 << 6) + aBytes[++nIdx] - 128
      : /* nPart < 127 ? */ /* one byte */
        nPart
    );
  }
  return sView;

}

function strToUTF8Arr (sDOMStr) {
  var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0;
  for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
    nChr = sDOMStr.charCodeAt(nMapIdx);
    nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
  }
  aBytes = new Uint8Array(nArrLen);
  for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
    nChr = sDOMStr.charCodeAt(nChrIdx);
    if (nChr < 128) {
      /* one byte */
      aBytes[nIdx++] = nChr;
    } else if (nChr < 0x800) {
      /* two bytes */
      aBytes[nIdx++] = 192 + (nChr >>> 6);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x10000) {
      /* three bytes */
      aBytes[nIdx++] = 224 + (nChr >>> 12);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x200000) {
      /* four bytes */
      aBytes[nIdx++] = 240 + (nChr >>> 18);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x4000000) {
      /* five bytes */
      aBytes[nIdx++] = 248 + (nChr >>> 24);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else /* if (nChr <= 0x7fffffff) */ {
      /* six bytes */
      aBytes[nIdx++] = 252 + (nChr >>> 30);
      aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    }
  }
  return aBytes;
}

function cachetokenizer(t) {
    return player + '_' + t;
}

function cachefetch(obj, ttl, compress) {
    try {
        var cache;
        if (typeof compress === 'undefined') {
            cache = toJSON(localStorage.getItem(cachetokenizer(obj)));
        } else {
            cache = toJSON(localStorage.getItem(cachetokenizer(obj)));
        }
        if (cache) {
            if (typeof ttl === 'undefined') {
                return cache[1];
            }
            var milisecs = Math.abs(new Date(cache[0]) - new Date());
            if (milisecs > ttl) {
                return false;
            } else {
                return cache[1];
            }
        } else {
            localStorage.removeItem(obj);
            return false;
        }
    } catch (e) {
        deb('cache-f:' + obj + ' error:' + e);
        localStorage.removeItem(obj);
    };
}

function cacheset(obj, data, compress) {
    try {
        var ar = [new Date().toJSON(), data];
        if (typeof compress === 'undefined') {
            localStorage.setItem(cachetokenizer(obj), JSON.stringify(ar));
        } else {
        	localStorage.setItem(cachetokenizer(obj), JSON.stringify(ar));
        }
    } catch (e) {
        deb('cache-s:' + obj + ' error:' + e);
    };
}
function cachedel(obj){
	localStorage.removeItem(cachetokenizer(obj));
}
function view(name, title, content, oversize) {
    var tobj = {
        "boxId": name,
        "headerElem": title,
        "contentElem": content,
        "sidebarEls": {
            "0": {},
            "length": 1,
            "prevObject": {
                "0": {},
                "context": {},
                "length": 1
            },
            "context": {},
            "selector": "div.dynamic"
        },
        "oversized": true,
        "replaceBox": true,
        "keepSidebars": true,
        "minisized": false
    };
    ufo.tobj = cloneInto(tobj, ufo);
    ikariam.createTemplateView(ufo.tobj);
}

function viewhandler(s) {
    if (!s.hasOwnProperty("ici")) {
        if (jQuery.inArray(s["boxId"], buildings) !== -1) {
            s["sidebarEls"]["ici"] = s["boxId"];
        }
    }
}

function bar(g, mg) {
    var w = g * 100 / mg;
    return '<div class="barBg" title="' + nmb(w) + '%"><div class="ikbar" style="width:' + w + '%"></div></div>';
}

function CreateSlot(menu, n, bg, bgl, name, desc, fn) {
    menu.append('<li class="expandable slot' + n + '" style="display: inline-block; width: 53px;" onclick=""><div class="image image_friends" style="background:url(' + bg + ') repeat scroll ' + bgl + ' transparent;height:34px;width:32px;"></div><div class="name"><span class="namebox">' + name + '</br><small>' + desc + '</small></span></div></li>')
        .find('.slot' + n)
        .hover(function() {
            $(this).animate({
                width: "199px"
            }, 300, "swing").parent().parent().css('z-index', '120000');
        }, function() {
            $(this).animate({
                width: "53px"
            }, 300, "swing").parent().parent().css('z-index', '65');;
        }).click(fn);
}

function loadcitybuildings() {
    var l = [];
    var d = cachefetch('cities');
    for (k in d) {
        if (d[k].hasOwnProperty("relationship")) {
            if (d[k]["relationship"] == "ownCity") {
                l.push(cachefetch(k + '_buildings'));
            }
        }
    }
    return l;
}

function parser(s) {
    try {
        if (typeof s == "object") {
            game = s;
            datahandler();
            if (s.hasOwnProperty("boxId")) {
                viewhandler(s);
            }
            if (s.hasOwnProperty("ici")) {
                deb("fetch:" + s["ici"]);
                resman = s["ici"];
            }
            if ((s.hasOwnProperty("link") && resman) || (s.hasOwnProperty("selectedCity") && resman)) {
                var r = $('#sidebar .resources');
                if (r.length) {
                    var wood = r.find('.wood').contents(':not(span)').text().digits();
                    var wine = r.find('.wine').contents(':not(span)').text().digits();
                    var marble = r.find('.marble').contents(':not(span)').text().digits();
                    var glass = r.find('.glass').contents(':not(span)').text().digits();
                    var sulfur = r.find('.sulfur').contents(':not(span)').text().digits();
                    var time = r.find('.time').contents(':not(span)').text();
                    var level = $('#sidebar .actions .showLevel').contents(':not(span)').text().digits();
                    var bres = {
                        "0": wood,
                        "1": wine,
                        "2": marble,
                        "3": glass,
                        "4": sulfur,
                        "time": time,
                        "level": level
                    };
                    cacheset(selectedcity + '_br_' + resman, bres);
                    deb("fetch-for-" + resman + "_level" + level.digits() + ":" + JSON.stringify(bres));
                }
            }
            if (s.hasOwnProperty("contentElem")) {
                var obj = s["contentElem"];
                s["contentElem"] = '';
                if (dbg == 'y') {
                    deb("c:" + JSON.stringify(s));
                };
                s["contentElem"] = obj;
            } else {
                if (dbg == 'y') {
                    deb("o:" + JSON.stringify(s));
                };
            }
        } else {
            deb(s);
        }
    } catch (e) {
        deb('parser:' + e);
    }
}

function datahandler() {
    try {
        var gm = game;
        if (gm.hasOwnProperty('backgroundView')) {
            screen = gm['backgroundView'];
            deb("view:" + screen);
        }
        if (gm.hasOwnProperty('gameName')) {
            deb("player:" + gm['avatarId']);
            player = gm['avatarId'];
            deb("ally:" + gm['avatarAllyId']);
            ally = gm['avatarAllyId'];
            realHour = gm['realHour'];
        }
        if (gm.hasOwnProperty('serverName')) {
            deb("server:" + gm['serverName']);
            deb("lang:" + ufo.LocalizationStrings.language);
            server = gm['serverName'];
            lang = ufo.LocalizationStrings.language;
        }
        if (gm.hasOwnProperty("bgViewData")) {
            deb("island:" + gm['bgViewData']['currentIslandId']);
            island = gm['bgViewData']['currentIslandId'];
        }
        if (gm.hasOwnProperty("islandId")) {
            deb("island2:" + gm['islandId']);
            island = gm['islandId'];
        }
        if (gm.hasOwnProperty("islandXCoord")) {
            deb("island2x:" + gm['islandXCoord']);
            deb("island2y:" + gm['islandYCoord']);
            islandx = gm['islandXCoord'];
            islandx = gm['islandYCoord'];
        }

        //city list
        if (gm.hasOwnProperty("relatedCityData")) {
            //deb("citylist:" + JSON.stringify(gm['relatedCityData']));
            selectedcity = gm['relatedCityData']['selectedCity'];
            deb("selectedcity:" + selectedcity);
            cacheset('cities', gm['relatedCityData']);
        }
        if (gm.hasOwnProperty("cityDropdownMenu")) {
            //deb("citylist-dropdown:" + JSON.stringify(gm['cityDropdownMenu']));		
            selectedcity = gm['cityDropdownMenu']['selectedCity'];
            deb("selectedcity:" + selectedcity);
            cacheset('cities', gm['cityDropdownMenu']);
        }
        if (gm.hasOwnProperty("isOwnCity") || gm.hasOwnProperty("relatedCity")) {
            var cityres = {
                'currentResources': gm['currentResources'],
                'maxResources': gm['maxResources'],
                'resourceProduction': gm['resourceProduction'],
                'tradegoodProduction': gm['tradegoodProduction'],
                'wineSpendings': gm['wineSpendings'],
                'wineTickInterval': gm['wineTickInterval'],
                'producedTradegood': gm['producedTradegood'],
                'dt': new Date().getTime()
            };
            cacheset(selectedcity + '_prod', cityres);
            if (transload) transporterload(true);
        }
        if (gm.hasOwnProperty("relatedCity")) {
            if (gm["relatedCity"].hasOwnProperty("owncity")) {
                if (gm["relatedCity"]["owncity"] == 1) {
                    var cityres = {
                        'currentResources': gm['currentResources'],
                        'maxResources': gm['maxResources'],
                        'resourceProduction': gm['resourceProduction'],
                        'tradegoodProduction': gm['tradegoodProduction'],
                        'wineSpendings': gm['wineSpendings'],
                        'wineTickInterval': gm['wineTickInterval'],
                        'producedTradegood': gm['producedTradegood'],
                        'dt': new Date().getTime()
                    };
                    //deb(player+'_'+selectedcity+'_prod:'+JSON.stringify(cityres));
                    cacheset(selectedcity + '_prod', cityres);
                    if (transload) transporterload(true);
                }
            }
        }
        if (gm.hasOwnProperty("backgroundData")) {
            cacheset('city_' + gm['backgroundData']['id'] + '_buildings', gm['backgroundData']);
            rendercity();
        }
        if (screen == 'city' && gm.hasOwnProperty("phase") && gm["ownerId"] == player) {
            cacheset('city_' + gm['id'] + '_buildings', gm);
            rendercity();
        }
        if (screen == 'island' && gm.hasOwnProperty("cities")) {
            cacheset('island_' + gm['id'] + '', gm);
            renderisland();
        }
    } catch (e) {
        deb('datahandler:' + e);
    }
}

function renderisland() {
    var m = $('#cities');
    var ic = cachefetch('island_' + island);
    if (ic) {
        ic = ic['cities'];
        for (var k = 0; k < ic.length; k++) {
            if (ic[k]["type"] == "city") {
                var b = m.find('#cityLocation' + k + ' a.island_feature_img');
                b.find('.blevel').remove();
                b.append('<div class="blevel">' + ic[k]['level'] + '</div>');
                var b = m.find('#cityLocation' + k + 'Scroll div.center');
                b.find('.infotip').remove();
                b.append('<span class="infotip">' + ic[k]['ownerName'] + '</span>');
            }
        }
    }
}

function rendercity() {
    var lc = cachefetch(selectedcity + '_buildings');
    if (lc) {
        var cr = cachefetch(selectedcity + '_prod');
        if (cr.hasOwnProperty('currentResources')) {
        	cr=cr['currentResources'];
        	cr[0]=cr['resource'];
        } else {
        	cr=false;
        }
        var lcp = lc['position'];
        var m = $('#locations');
        var bl = loadcitybuildings();
        for (var k = 0; k < lcp.length; k++) {
            var p = m.find('#position' + k);
            p.find('.bname,.blevel,.linfo,.binfo').remove();
            var cls = '';
            if (lcp[k].hasOwnProperty("name")) {
                if (cr) {
                    var res = cachefetch(selectedcity + '_br_' + lcp[k]['building']);
                    if (res) {
                        var dc=true;
                    	for (var j=0;j<5;j++){
                        	if (res[j] - cr[j] > 0) {
                        		dc=false;
                        		break;
                            }                        	
                        }
                    	if (dc) {cls = 'bgood';}
                    } else {
                        cls = 'bdark';
                    }
                }
                p.append('<div class="bname" data="' + lcp[k]['level'] + '">' + lcp[k]['name'] + '</div><div class="blevel ' + cls + '" data="' + lcp[k]['level'] + '">' + lcp[k]['level'] + '</div><div data="' + lcp[k]['building'].replace(' constructionSite', '') + '" class="linfo"></div><div class="binfo" data="' + lcp[k]['building'].replace(' constructionSite', '') + '"></div>');
                p.find('.bname').click(function() {
                    $(this).parent().find('a').click();
                });
            }
        }
        m.find('.blevel').click(function() {
            $(this).parent().find('.hoverable').click();
        }).hover(function() {
            var p = $(this).parent().css('z-index', 10000);

            //binfo - resource info for building upgrade
            var g = p.find('.binfo');
            var bres = cachefetch(selectedcity + '_br_' + g.attr('data'));
            if (bres) {
                p.find('.bdark').removeClass('bdark');
                var gc=[];
                if (cr) {
                    for (var j=0;j<5;j++){
                    	if (bres[j] - cr[j] > 0) {
                    		gc[j] = true;
                        }                        	
                    }                 	 
                }                 
            	var ht = (bres[0] ? '<span '+(gc[0]?'style="color:red"':'')+'>' + goods[0] + ' ' + nmb(bres[0]) + '</span>' : '') +
                (bres[1] ? '<span '+(gc[1]?'style="color:red"':'')+'>' + goods[1] + ' ' + nmb(bres[1]) + '</span>' : '') +
                (bres[2] ? '<span '+(gc[2]?'style="color:red"':'')+'>' + goods[2] + ' ' + nmb(bres[2]) + '</span>' : '') +
                (bres[3] ? '<span '+(gc[3]?'style="color:red"':'')+'>' + goods[3] + ' ' + nmb(bres[3]) + '</span>' : '') +
                (bres[4] ? '<span '+(gc[4]?'style="color:red"':'')+'>' + goods[4] + ' ' + nmb(bres[4]) + '</span>' : '') +
                '<img src="skin/resources/icon_time.png" width="10px"/>'+bres['time'];                
                g.html(ufo.BubbleTips.createTooltip(ht, '100px'));
            } else{
            	g.html(ufo.BubbleTips.createTooltip('<span>click on building to fetch needed resources</span>', '100px'));
            }
            // others cities same buildings
            var e = p.find('.linfo');
            var bname = e.attr('data');
            if (bname == 'palace') bname = 'palaceColony';
            if (bname != 'fetched') {
                e.attr('data', 'fetched');
                var txt = '';
                try{
	                for (var b = 0; b < bl.length; b++) {
	                    var cnm = bl[b]['name'];	                    
	                    if (cnm != lc['name']) {
	                        if (bl[b].hasOwnProperty('position')){
	                        	var bp = bl[b]['position'];	                        
		                        for (var p = 0; p < bp.length; p++) {
		                            var lbname = bp[p]['building'];
		                            var hl = '';
		                            if (lbname.indexOf('constructionSite') > 0) {
		                                lbname = lbname.replace(' constructionSite', '');
		                                hl = ' class="red"';
		                            } else {
		                                hl = '';
		                            }
		                            if (lbname == 'palace') lbname = 'palaceColony';
		                            if (lbname == bname) {
		                                txt += '<span ' + hl + '>' + cnm + ' ' + bp[p]['level'] + '</span>';
		                            }
		                        }	
	                        }	                    	
	                    }
	                }
	            } catch(e){deb('linfo hover:'+e);}
	            if (txt.length==0){txt='<span>Not found in any other city</span>';}
                e.html(ufo.BubbleTips.createTooltip('<span style="border-bottom:1px solid #e0b018"><b>'+e.parent().find('.bname').html()+'</b></span>'+txt, '100px'));
            }
            if (e.html()) e.show();
            if (g.html()) g.show();
        }, function() {
            $(this).parent().css('z-index', '').find('.linfo,.binfo').hide();
        });
    }
}

function searchview() {
    view("searchika", "Search for players", '<iframe name="isearch" src="http://www.ika-core.org/" frameborder="0" scrolling="auto" marginwidth="0" marginheight="0" width="100%" height="100%"></iframe>', true);
}

function buildingsview() {
    try{
		var bp, o, i, j, busy, link;
	    var bl = loadcitybuildings();
	    var s = '<table class=\"table01 left clearfloat\" style=\"width:100%;margin:0;\"><tbody><tr>\
			<th width=\"20%\"><img src=\"skin/icons/livingspace_24x24.png\"\/><\/th>';
	    for (i = 0; i < buildings.length; i++) {
	        s += '<th width=\"3%\" title=\"' + buildings[i] + '\"><img src=\"skin/buildings/x40_y40/' + buildings[i] + '.png\" width=\"40\"/><\/th>';
	    }
	    s += '<\/tr>';
	    var alt = '';
	    //s+=JSON.stringify(bl);
	    for (i = 0; i < bl.length; i++) {
	    	if (bl[i].hasOwnProperty('position')){
		    	bp = bl[i]['position'];	        
		        o = [];
		        busy = [];
		        link = [];
		        for (j = 0; j < bp.length; j++) {
		            var ind = jQuery.inArray(bp[j]['building'].replace(' constructionSite', ''), buildings);
		            o[ind] = bp[j]['level'];
		            busy[ind] = (bp[j]['building'].indexOf('constructionSite') > 0 ? true : false);
		            link[ind] = '?view=' + bp[j]['building'].replace(' constructionSite', '') + '&cityId=' + bl[i]['id'] + '&position=' + j;
		        }
		        s += '<tr class="' + alt + '"><td title=\"' + bl[i]['name'] + '\">' + bl[i]['name'] + '<\/td>';
		        for (j = 0; j < buildings.length; j++) {
		            if (o[j]) {
		                s += '<td title=\"' + buildings[j] + (busy[j] ? ' upgrading' : '') + ' Level: ' + o[j] + '\" class=\"point right' + (busy[j] ? ' red bold blink' : '') + '\" onclick=\"ajaxHandlerCall(\'' + link[j] + '\');return false;\">' + o[j] + '<\/td>';
		            } else {
		                s += '<td title=\"' + buildings[j] + ' Does not exist' + '\" class=\"right\">-<\/td>';
		            }
		        }
		        s += '<\/tr>';
		        if (alt == '') {
		            alt = 'alt';
		        } else {
		            alt = '';
		        };
	    	}
	    }
	    s += '<\/tbody><\/table><iframe src="http://www.ika-core.org/ikariam-new.html" frameborder="0" scrolling="auto" marginwidth="0" marginheight="0" width="100%" height="115px"></iframe>';
	    view("buildingsika", "Buildings View", s, true);
    } catch(e){deb('buildingsview:'+e);}
}

function mapislands(data) {
	var islands = [];
    var l = data.data;
    alert(JSON.stringify(l));
    var q = data.request;
    for (var m = q.x_min; m <= q.x_max; m++) {
        for (var o = q.y_min; o <= q.y_max; o++) {
            if (!islands[m]) {
                islands[m] = new Array();
            }
            if (l[m] && l[m][o]) {
                islands[m][o] = l[m][o];
            }
            //else { islands[m][o] = "ocean"; }
        }
    }
    alert(JSON.stringify(islands));
    
    return islands;
}

function worldviewprepare() {
		dumpcachesize('worldislands');
    	var cache = cachefetch('worldislands', 48 * hours, COMPRESS);
        if (cache) {
            worldview(cache);
        } else {
            $.getJSON("/", "action=WorldMap&function=getJSONArea&x_min=0&x_max=101&y_min=0&y_max=101", function(data) {            	
            	try{
            		//var islands=mapislands(data);
            		var islands=data.data;
                    cacheset('worldislands', islands, COMPRESS);
                    worldview(islands);	
            	} catch(e){deb('fetch world:'+e);}
            	
            });
        }	
}

function worldview(i) {
    var tg = [ufo.LocalizationStrings.wood, ufo.LocalizationStrings.wine, ufo.LocalizationStrings.marble, ufo.LocalizationStrings.crystal, ufo.LocalizationStrings.sulfur];
    var s = '<Table><tr><td><table id="worldmap_2d">',
        x, y;
    for (y = 0; y < 102; y++) {
        s += '<tr>';
        for (x = 0; x < 102; x++) {
        	var c=i[x];
        	if(c){
                var ci = c[y];
                if (ci) {
                    s += '<td id="is' + ci[0] + '" class="isle ic_' + x + '_' + y + '" title="' + ci[1] + '[' + x + ':' + y + '] ' + tg[0] + ':' + ci[6] + ' ' + tg[ci[2]] + '"></td>';
                } else {
                	s += '<td class="ocean"></td>';
                }                    		
        	} else {
            	s += '<td class="ocean"></td>';
            } 
        }
        s += '</tr>';
    }
    s += '</table></td><td>&nbsp;&nbsp;&nbsp;World search will be added here, its almost complete</td></tr></table>';
    view("worldika", "World Map", s, false);
    var d = cachefetch('cities');
    for (k in d) {
        if (d[k].hasOwnProperty("relationship")) {
            if (d[k]["relationship"] == "ownCity") {}
            var t = /(\d{1,2}:\d{1,2})/img.exec(d[k]["coords"])[0].split(':');
            var x = t[0];
            var y = t[1];
            var f = $('#worldmap_2d .ic_' + x + '_' + y);
            f.addClass('isleown');
            f.attr('title', f.attr('title') + ' ' + d[k]['name']);
        }
    }
}

function transporterload(force) {
    t = $('#iTrans');
    if (t.is(':hidden') == 'true') return;
    if (!transload || force) {
        transload = true;
        var s = '<table class="table01 left clearfloat" style="width:100%;margin:0;"><tbody><tr>\
        	<th width="20%"><img src="skin/icons/livingspace_24x24.png"/></th>\
        	<th width="5%"><img src="skin/resources/icon_population.png"/></th>\
			<th width="12%">' + goods[0] + '</th>\
			<th width="12%">' + goods[1] + '</th>\
			<th width="12%">' + goods[2] + '</th>\
			<th width="12%">' + goods[3] + '</th>\
			<th width="12%">' + goods[4] + '</th>\
			<th width="15%"><img src="skin/interface/btn_max.png"/></th>\
			</tr>';
        var d = cachefetch('cities');
        var alt = '';
        var ar = $('#js_ChangeCityActionRequest').val();
        var tg = [0, 0, 0, 0, 0];
        var pr = [0, 0, 0, 0, 0];
        var dt = new Date().getTime();
        for (k in d) {
            if (d[k].hasOwnProperty("relationship")) {
                if (d[k]["relationship"] == "ownCity") {
                    var cr = cachefetch('city_' + d[k]['id'] + '_prod');
                    //deb('tr:'+JSON.stringify(cr));
                    try {
                        var woodprod = (cr['resourceProduction'] == 0) ? '' : ' <span style="font-size:0.8em">(+' + nmb(cr['resourceProduction'] * realHour) + '/h)</span>';
                        var goodprod = (cr['tradegoodProduction'] == 0) ? '' : ' <span style="font-size:0.8em">(+' + nmb(cr['tradegoodProduction'] * realHour) + '/h)</span>';
                        var trgood = cr['producedTradegood'];
                        var delta = (dt - cr['dt']) / 3600000;
                        cr['currentResources']['resource'] += delta * cr['resourceProduction'] * realHour;
                        var winecon;
                        if (trgood == 1) {
                            cr['currentResources'][1] += delta * (cr['tradegoodProduction'] * realHour - cr['wineSpendings']);
                            winecon = (cr['tradegoodProduction'] * realHour - cr['wineSpendings']);
                            winecon = (winecon == 0) ? '' : ' <span style="font-size:0.8em">(' + ((winecon > 0) ? '+' : '-') + nmb(winecon) + '/h)</span>';
                        } else {
                            winecon = (cr['wineSpendings'] == 0) ? '' : ' <span style="font-size:0.8em">(-' + nmb(cr['wineSpendings']) + '/h)</span>';
                            cr['currentResources'][trgood] += delta * cr['tradegoodProduction'] * realHour;
                        }
                        pr[0] += cr['resourceProduction'] * realHour;
                        pr[trgood] += cr['tradegoodProduction'] * realHour;
                        pr[1] -= cr['wineSpendings'];
                        tg[0] += cr['currentResources']['resource'];
                        tg[1] += cr['currentResources'][1];
                        tg[2] += cr['currentResources'][2];
                        tg[3] += cr['currentResources'][3];
                        tg[4] += cr['currentResources'][4];
                        s += '<tr class="' + alt + '"><td class="city bold"><a title="click to visit city" href="#" onclick="$(\'#js_cityIdOnChange\').val(\'' + d[k]['id'] + '\').parent().submit();">' + goods[d[k]['tradegood']] + ' ' + d[k]['coords'] + ' ' + d[k]['name'] + '</a></td>' +
                        	'<td class="right">' + nmb(cr['currentResources']['citizens']) + '(' + nmb(cr['currentResources']['population']) + ')</td>' +
                        	'<td class="right">' + nmb(cr['currentResources']['resource']) + woodprod + bar(cr['currentResources']['resource'], cr['maxResources']['resource']) + '</td>' +
                            '<td class="right" title="' + ((trgood == 1) ? nmb(cr['tradegoodProduction'] * realHour) : '') + '-' + nmb(cr['wineSpendings']) + '">' + nmb(cr['currentResources']['1']) + winecon + bar(cr['currentResources'][1], cr['maxResources'][1]) + '</td>' +
                            '<td class="right">' + nmb(cr['currentResources'][2]) + ((trgood == 2) ? goodprod : '') + bar(cr['currentResources'][2], cr['maxResources'][2]) + '</td>' +
                            '<td class="right">' + nmb(cr['currentResources'][3]) + ((trgood == 3) ? goodprod : '') + bar(cr['currentResources'][3], cr['maxResources'][3]) + '</td>' +
                            '<td class="right">' + nmb(cr['currentResources'][4]) + ((trgood == 4) ? goodprod : '') + bar(cr['currentResources'][4], cr['maxResources'][4]) + '</td>' +
                            '<td class="center actions">' + (('city_' + d[k]['id'] == selectedcity) ? '' :
                                '<a href="?view=transport&amp;destinationCityId=' + d[k]['id'] + '&amp;backgroundView=' + screen + '&amp;currentIslandId=' + island + '&amp;templateView=cityDetails&amp;actionRequest=' + ar + '" onclick="ajaxHandlerCall(this.href);return false;" id="itranslinkt' + d[k]['id'] + '"><img width="32" height="22" src="skin/interface/mission_transport.png" alt="Transport" class="vertical_middle"></a>' +
                                '<a href="?view=deployment&amp;deploymentType=army&amp;destinationCityId=' + d[k]['id'] + '&amp;backgroundView=' + screen + '&amp;currentIslandId=' + island + '&amp;templateView=cityDetails&amp;actionRequest=' + ar + '" onclick="ajaxHandlerCall(this.href);return false;" id="itranslinkt' + d[k]['id'] + '"><img width="32" height="22" src="skin/interface/mission_deployarmy.png" alt="Army" class="vertical_middle"></a>' +
                                '<a href="?view=deployment&amp;deploymentType=fleet&amp;destinationCityId=' + d[k]['id'] + '&amp;backgroundView=' + screen + '&amp;currentIslandId=' + island + '&amp;templateView=cityDetails&amp;actionRequest=' + ar + '" onclick="ajaxHandlerCall(this.href);return false;" id="itranslinkt' + d[k]['id'] + '"><img width="32" height="22" src="skin/interface/mission_deployfleet.png" alt="Army" class="vertical_middle"></a>') +
                            '</td></tr>';
                    } catch (e) {
                        //deb('tr-catch:'+e);
                        s += '<tr class="' + alt + '"><td class="city bold"><a href="#" onclick="$(\'#js_cityIdOnChange\').val(\'' + d[k]['id'] + '\').parent().submit();">' + goods[d[k]['tradegood']] + ' ' + d[k]['coords'] + ' ' + d[k]['name'] + '</a></td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Visit city to update</td></tr>';
                    }
                }
            }
            if (alt == '') {
                alt = 'alt';
            } else {
                alt = '';
            };
        }
        s += '<tr class="' + alt + ' total"><td class="city bold right">Total</td><td></td><td class="right">' + nmb(tg[0]) + ' <span style="font-size:0.8em">(' + nmb(pr[0]) + '/h)</span></td><td class="right">' + nmb(tg[1]) + ' <span style="font-size:0.8em">(' + nmb(pr[1]) + '/h)</span></td><td class="right">' + nmb(tg[2]) + ' <span style="font-size:0.8em">(' + nmb(pr[2]) + '/h)</span></td><td class="right">' + nmb(tg[3]) + ' <span style="font-size:0.8em">(' + nmb(pr[3]) + '/h)</span></td><td class="right">' + nmb(tg[4]) + ' <span style="font-size:0.8em">(' + nmb(pr[4]) + '/h)</span></td><td></td></tr>';
        t.html(s + '</table><iframe src="http://www.ika-core.org/ikariam-new.html" frameborder="0" scrolling="auto" marginwidth="0" marginheight="0" width="100%" height="115px"></iframe>');
    }
}

function transporter() {
    var t = $('body #container').append('<div id="iTrans"></div>').find('#iTrans').mouseleave(function() {
        $(this).hide();
    });
    var tr = $('<span class="white"> > </span><a id="iTransport" class="yellow" title="Transporter" href="#"><img class="vertical_middle" width="20" height="16" alt="Transport" src="skin/interface/mission_transport.png"> Transporter </a>');
    var trans = (screen == 'city') ? tr.insertAfter('#js_cityBread') : $('#breadcrumbs').append(tr);
    trans.mouseenter(function() {
        transporterload();
        t.css('left', $('#iTransport').offset().left + 'px').show();
    });
}

function rendersidebar() {
    var lm = $('#leftMenu');
    if (lm.length == 0) {
        lm = $('#container').append('<div id="leftMenu"><div class="slot_menu city_menu" id="js_viewCityMenu" style="z-index: 65;"><ul class="menu_slots"></ul></div></div>');
    }
    var menu = lm.find('.menu_slots');
    CreateSlot(menu, 8, 'http://gf1.geo.gfsrv.net/cdn00/0aa3bb98504af3b7f3d779bf46b82b.ico', '-1px 1px', 'Search', 'Find players,islands,cities', searchview);
    CreateSlot(menu, 9, 'skin/layout/btn_world.jpg', '-28px -1px', 'World', 'Show the mini Wolrd Map', worldviewprepare);
    CreateSlot(menu, 10, 'skin/buildings/x40_y40/forester.png', '-1px 1px', 'Buildings', 'Show buidings overview', buildingsview);
}

function worldmap_iso_alterview() {
    $('body').append('<div id="worldmaphovernfo"></div>');
    $("#worldmaphovernfo").click(function() {
        $(this).hide();
    });
    $('#map1 div.islandTile').click(function(e) {
        var t = /(\d{1,2}:\d{1,2})/img.exec(this.title)[0].split(':');
        var x = t[0];
        var y = t[1];
        $("#worldmaphovernfo").css({
            top: e.clientY,
            left: e.clientX
        }).show();
        var cache = cachefetch('islenfo_' + x + '_' + y, 48 * hours); //48 hours lifetime
        if (cache) {
            $("#worldmaphovernfo").html(ufo.BubbleTips.createTooltip(cache, '200px'));
        } else {
            $.getJSON("/", "action=WorldMap&function=getJSONIsland&x=" + x + "&y=" + y, function(data) {
                var d = data['data'];
                var a = d.length;
                var s = '<table><tr class="head"><td><center><img src="skin/characters/y100_citizen_faceright.png" height="24"></center></td><td><center><img src="skin/icons/livingspace_24x24.png" height="24"></center></td></tr>';
                for (var p = 0; p < a; p++) {
                    s += '<tr><td class="first">' + d[p].avatar_name + '</td><td>' + d[p].name + '</td></tr>';
                }
                s += '</table>';
                cacheset('islenfo_' + x + '_' + y, s);
                $("#worldmaphovernfo").html(ufo.BubbleTips.createTooltip(s, '300px'));
            });
        }
    });
}

function parseresponse(m) {
    var success = false;
    var data = [];
    try {
        var o = m.length;
        for (var p = 0; p < o; p++) {
            var n = m[p][0];
            try {
                if (n != "custom") {
                    deb("pr:mapping " + n + " ...");
                    var e = n;
                    var d = m[p][1];
                    if (e == 'updateGlobalData') {
                        if (d.hasOwnProperty("backgroundData")) {
                            data = d["backgroundData"];
                            delete m[p][1]["backgroundData"];
                            if (d.hasOwnProperty("walkers")) {
                                delete m[p][1]["walkers"];
                            }
                            success = true;
                            break;
                        }
                    }
                }
            } catch (l) {
                deb("pr:unable to parse: " + m[p][0] + "\n with parameters: " + m[p][1]);
                deb("pr:" + l);
            }
        }
        deb("pr: calling parser...");        
        ufo.pobj = cloneInto(m, ufo);
        ufo.ajax.Responder.parseResponse(ufo.pobj);
        deb("pr:done.");
    } catch (l) {
        sucess = false;
        deb("pr:Unable to parse ajax response: \n" + m + "\n" + l);
    }
    deb("pr: capture " + JSON.stringify(data));
    return success;
}
function dumpcachesize(obj) {
	var lobj=cachetokenizer(obj);
	if(localStorage[lobj]){
		deb('store:' + obj + "=" + ((localStorage[lobj].length * 2) / 1024 / 1024).toFixed(2) + " MB");	
	}
}

function dumplocalstore() {
    for (var x in localStorage) deb('store:' + x + "=" + ((localStorage[x].length * 2) / 1024 / 1024).toFixed(2) + " MB");
}

function main() {
    try {
        //localStorage.clear();
        ikariam = ufo.ikariam;
        nmb = ufo.ikariam.Model.locaNumberFormat;
        rendersidebar();
        transporter();
        switch (screen) {
            case 'worldmap_iso':
                worldmap_iso_alterview();
                break;
        }
        deb(lang + '-' + server + " - actionrequest:" + ikariam.getModel().actionRequest + ' stub finish.');
        //dumplocalstore();
       // $.getJSON( "/index.php","view=updateGlobalData&islandId=527&backgroundView=island&currentIslandId=527&actionRequest="+ikariam.getModel().actionRequest+"&ajax=1",parseresponse);         
        
    } catch (e) {
        deb('main:' + e);
    }
}

