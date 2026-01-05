// ==UserScript==
// @name           	Mutik's DotD Script for ArmorGames
// @namespace      	tag://armorgames
// @description    	Script which makes raids management a lot easier
// @author         	Mutik
// @version        	0.9.32
// @grant          	GM_xmlhttpRequest
// @grant          	GM_setValue
// @grant          	GM_getValue
// @grant          	unsafeWindow
// @include        	http://armorgames.com/dawn-of-the-dragons-game/*
// @connect			mutik.erley.org
// @connect			50.18.191.15
// @hompage        	http://mutik.erley.org
// @downloadURL https://update.greasyfork.org/scripts/9868/Mutik%27s%20DotD%20Script%20for%20ArmorGames.user.js
// @updateURL https://update.greasyfork.org/scripts/9868/Mutik%27s%20DotD%20Script%20for%20ArmorGames.meta.js
// ==/UserScript==

//best loop atm: for(var i=0, l=obj.length; i<l; ++i) - for with caching and pre-increment

if (window.location.host === 'armorgames.com') {
    function main() {

        if (typeof GM_setValue == 'undefined') {
            var GM_setValue = function (name, value) {
                localStorage.setItem(name, (typeof value).substring(0, 1) + value);
            };
        }
        if (typeof GM_getValue == 'undefined') {
            var GM_getValue = function (name, dvalue) {
                var value = localStorage.getItem(name);
                if (typeof value != 'string') return dvalue;
                else {
                    var type = value.substring(0, 1);
                    value = value.substring(1);
                    if (type == 'b') return (value == 'true');
                    else if (type == 'n') return Number(value);
                    else return value;
                }
            };
        }
        //if (typeof GM_deleteValue == 'undefined') var GM_deleteValue = function(name) { localStorage.removeItem(name) };

        window.timeSince = function (date, after) {
            if (typeof date === 'number') date = new Date(date);
            var seconds = Math.abs(Math.floor((new Date().getTime() - date.getTime()) / 1000));
            var interval = Math.floor(seconds / 31536000);
            var pretext = 'about ', posttext = after ? ' left' : ' ago';
            if (interval >= 1) return pretext + interval + ' year' + (interval == 1 ? '' : 's') + posttext;
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) return pretext + interval + ' month' + (interval == 1 ? '' : 's') + posttext;
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) return pretext + interval + ' day' + (interval == 1 ? '' : 's') + posttext;
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) return pretext + interval + ' hour' + (interval == 1 ? '' : 's') + posttext;
            interval = Math.floor(seconds / 60);
            if (interval >= 1) return interval + ' minute' + (interval == 1 ? '' : 's') + posttext;
            return Math.floor(seconds) + ' second' + (seconds == 1 ? '' : 's') + posttext;
        };
        window.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        window.DotDX = {
            version: { major: "0.9.32", minor: 'Mutik\'s DotD Extension for ArmorGames' },
			c: function (ele) {
				function Cele(ele) {
					this._ele = ele;
					this.ele = function() {return this._ele};
					this.attr = function(attrName) { attrName.charAt(0) !== '!'?this._ele.setAttributeNode(document.createAttribute(attrName)):this._ele.removeAttribute(attrName.substring(1)); return this };
					this.set = function(param) {for (var attr in param) if (param.hasOwnProperty(attr)) this._ele.setAttribute(attr,param[attr]); return this};
					this.text = function(text) {this._ele.appendChild(document.createTextNode(text)); return this};
					this.html = function(text,overwrite) {this._ele.innerHTML = overwrite ? text : (this._ele.innerHTML + text); return this};
					this.on = function(event,func,bubble) {this._ele.addEventListener(event, func, bubble); return this};
					this.del = function() {this._ele.parentNode.removeChild(this._ele); return null};
					this.attach = function(method,dele) {
						if (typeof dele === 'string') dele = document.getElementById(dele);
						if (!(dele instanceof Node)) throw 'Invalid attachment element specified';
						else if (!/^(?:to|before|after)$/i.test(method)) throw 'Invalid append method specified';
						else if (method === 'to') dele.appendChild(this._ele);
						else if (method === 'before') dele.parentNode.insertBefore(this._ele, dele);
						else if (dele.nextSibling === null) dele.parentNode.appendChild(this._ele);
						else dele.parentNode.insertBefore(this._ele, dele.nextSibling);
						return this
					};
					this.prepend = function(dele) {
						if (typeof dele === 'string') dele = document.getElementById(dele);
						if (!(dele instanceof Node)) throw 'Invalid attachment element specified';
						if (dele.childElementCount === 0) dele.appendChild(this._ele);
						else dele.insertBefore(this._ele,dele.firstChild);
						return this
					};
				}
				if (typeof ele === 'string') ele = ele.charAt(0) === '#' ? document.getElementById(ele.substring(1)) : document.createElement(ele);
				if (ele instanceof Node) return new Cele(ele);
				throw 'Invalid element type specified';
			},
			util: {
				isArrEq: function(a,b) {
					if(a.length !== b.length) return false;
					var ca = a.slice().sort().join(",");
					var cb = b.slice().sort().join(",");
					return ca === cb;
				},
                getQueryVariable: function(v,s) {
                    var query = String(s || window.location.search.substring(1));
                    if (query.indexOf('?') > -1) query = query.substring(query.indexOf('?') + 1);
                    var vars = query.split('&');
                    var i = vars.length;
                    while(i--) {
                        var pair = vars[i].split('=');
                        if (decodeURIComponent(pair[0]) == v) return decodeURIComponent(pair[1]);
                    }
                    return '';
                },
                getRaidFromUrl: function(url) {
                    var r = {id: 0, boss: '', hash: '', diff: 0, sid: 1}, cnt = 0, i;

                    var reg = /[?&]([^=]+)=([^?&]+)/ig, p = url.replace(/&amp;/gi, '&').replace(/kv_&/gi, '&kv_').replace(/http:?/gi, '');
                    while ((i = reg.exec(p)) != null) {
                        switch (i[1]) {
                            case 'ar_raid_id':
                            case 'raid_id': r.id = parseInt(i[2]); cnt++; break;
                            case 'ar_difficulty':
                            case 'difficulty': r.diff = parseInt(i[2]); cnt++; break;
                            case 'ar_raid_boss':
                            case 'raid_boss': r.boss = i[2]; cnt++; break;
                            case 'ar_hash':
                            case 'hash': r.hash = i[2]; cnt++; break;
                            case 'ar_serverid':
                            case 'serverid': r.sid = parseInt(i[2]); cnt++; break;
                        }
                    }
                    if (cnt < 4) return null;

                    return r;
                },
                getShortNum: function(num) {
                    if (isNaN(num) || num < 0) return num;
                    if (num >= 1000000000000) return (num / 1000000000000).toPrecision(4) + 't';
                    if (num >= 1000000000) return (num / 1000000000).toPrecision(4) + 'b';
                    if (num >= 1000000) return (num / 1000000).toPrecision(4) + 'm';
                    if (num >= 1000) return (num / 1000).toPrecision(4) + 'k';
                    return num + ''
                },
                getShortNumMil: function(num) {
                    if (isNaN(num) || num < 0) return num;
                    if (num >= 1000000) return (num / 1000000).toPrecision(4) + 't';
                    if (num >= 1000) return (num / 1000).toPrecision(4) + 'b';
                    return num.toPrecision(4) + 'm'
                },
                objToUriString: function(obj) {
                    if (typeof obj == 'object') {
                        var str = '';
                        for (var i in obj) str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&';
                        str = str.substring(0, str.length - 1);
                        return str
                    }
                    return '';
                },
                serialize: function(obj) {
                    var str = [];
                    for (var p in obj) if (obj[p] != null)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                stringFormat: function() {
                    var s = arguments[0];
                    for (var i = 0; i < arguments.length - 1; i++) {
                        var reg = new RegExp("\\{" + i + "\\}", "gm");
                        s = s.replace(reg, arguments[i + 1]);
                    }
                    return s;
                }
            },
            config: (function() {
                var tmp, reqSave = false;
                try {tmp = JSON.parse(GM_getValue('DotDX', '{}'));}
                catch (e) {tmp = {}; reqSave = true }

                //Raids tab vars
                tmp.filterSearchStringR = typeof tmp.filterSearchStringR === 'string' ? tmp.filterSearchStringR : '';
                tmp.fltIncVis = typeof tmp.fltIncVis === 'boolean' ? tmp.fltIncVis : false;
                tmp.fltExclFull = typeof tmp.fltExclFull === 'boolean' ? tmp.fltExclFull : false;
                tmp.fltShowAll = typeof tmp.fltShowAll === 'boolean' ? tmp.fltShowAll : false;

                //Options tab vars
                tmp.importFiltered = typeof tmp.importFiltered === 'boolean' ? tmp.importFiltered : true;
                tmp.hideVisitedRaids = typeof tmp.hideVisitedRaids === 'boolean' ? tmp.hideVisitedRaids : false;
                tmp.markMyRaidsVisted = typeof tmp.markMyRaidsVisted === 'boolean' ? tmp.markMyRaidsVisted : false;
                tmp.landOwnedCount = typeof tmp.landOwnedCount === 'object' ? tmp.landOwnedCount : [0, 0, 0, 0, 0, 0, 0, 0, 0];
                tmp.confirmDeletes = typeof tmp.confirmDeletes === 'boolean' ? tmp.confirmDeletes : true;
                tmp.selectedRaids = typeof tmp.selectedRaids === 'string' ? tmp.selectedRaids : '';
                tmp.lastImported = typeof tmp.lastImported === 'number' ? tmp.lastImported : (new Date().getTime() - 1728000000);
                tmp.hideGameDetails = typeof tmp.hideGameDetails === 'boolean' ? tmp.hideGameDetails : false;
                tmp.hideGameTitle = typeof tmp.hideGameTitle === 'boolean' ? tmp.hideGameTitle : false;
				tmp.hideArmorFooter = typeof tmp.hideArmorFooter === 'boolean' ? tmp.hideArmorFooter : false;
				tmp.hideArmorBanner = typeof tmp.hideArmorBanner === 'boolean' ? tmp.hideArmorBanner : false;
                tmp.agUser = typeof tmp.agUser === 'string' ? tmp.agUser : 'Guest';
                tmp.agAuth = typeof tmp.agAuth === 'string' ? tmp.agAuth : '0';
                tmp.agId = typeof tmp.agId === 'string' ? tmp.agId : '0';
                tmp.hideScrollBar = typeof tmp.hideScrollBar === 'boolean' ? tmp.hideScrollBar : false;
                tmp.hideWChat = typeof tmp.hideWChat === 'boolean' ? tmp.hideWChat : false;
                tmp.leftWChat = typeof tmp.leftWChat === 'boolean' ? tmp.leftWChat : false;
                tmp.removeWChat = typeof tmp.removeWChat === 'boolean' ? tmp.removeWChat : false;
                tmp.filterRaidList = typeof tmp.filterRaidList === 'boolean' ? tmp.filterRaidList : false;
                tmp.newRaidsAtTopOfList = typeof tmp.newRaidsAtTopOfList === 'boolean' ? tmp.newRaidsAtTopOfList : false;
                tmp.serverMode = typeof tmp.serverMode === 'number' ? tmp.serverMode : 1;

                if (typeof tmp.raidList    !== 'object') tmp.raidList    = {};
                if (typeof tmp.filters     !== 'object') tmp.filters     = [{},{}];
                if (typeof tmp.lastFilter  !== 'object') tmp.lastFilter  = typeof tmp.lastFilter === 'string' ? [tmp.lastFilter, tmp.lastFilter] : ["",""];
				if (tmp.filters.length !== 2) tmp.filters = [tmp.filters, tmp.filters];
				if (tmp.lastImported > (new Date().getTime())) tmp.lastImported = (new Date().getTime() - 1728000000);
                if (reqSave) GM_setValue('DotDX', JSON.stringify(tmp));

                // Delete expired raids
                for (var id in tmp.raidList) {
                    if(tmp.raidList.hasOwnProperty(id)) {
                        if (typeof tmp.raidList[id].magic === "undefined") tmp.raidList[id].magic = [0, 0, 0, 0, 0, 0];
                        if (typeof tmp.raidList[id].hp === "undefined") tmp.raidList[id].hp = 1.0;
                        if (typeof tmp.raidList[id].sid === "undefined") tmp.raidList[id].sid = 1;
                        if (typeof tmp.raidList[id].cs === "undefined") tmp.raidList[id].cs = 0;
                        if (typeof tmp.raidList[id].fs === "undefined") tmp.raidList[id].fs = 1;
						if (typeof tmp.raidList[id].ni === "undefined") tmp.raidList[id].ni = false;
                    }
                }

                tmp.addRaid = function (hash, id, boss, diff, sid, visited, /*user,*/ ts, /*room,*/ magic, hp, cs, fs) {
                    /*if ((/ /).test(user)) {
                        var reg = new RegExp('[0-9]+|[0-9a-zA-Z_]+', 'g');
                        room = reg.exec(user);
                        user = reg.exec(user);
                    }*/
                    if (typeof DotDX.config.raidList[id] !== 'object') {
                        var tStamp = typeof ts === 'undefined' || ts === null ? parseInt(new Date().getTime() / 1000) : parseInt(ts);
                        DotDX.config.raidList[id] = {
                            hash: hash, id: id, boss: boss, diff: diff, sid: sid, visited: visited, user: 'u' /*user*/, timeStamp: tStamp,
                            expTime: (typeof DotDX.raids[boss] === 'object' ? (DotDX.raids[boss].stat === 'H' ? 1 : DotDX.raids[boss].duration) : 24) * 3600 + tStamp,
                            room: 0 /*room === undefined || room === null ? DotDX.util.getGameRoomNumber() : parseInt(room)*/,
                            magic: magic === undefined || magic === null ? [0,0,0,0,0,0] : magic,
                            hp: hp === undefined || hp === null ? 1.0 : parseFloat(hp),
                            cs: cs === undefined || cs === null ? 0 : parseInt(cs),
                            fs: fs === undefined || fs === null ? (typeof DotDX.raids[boss] === 'object' ? DotDX.raids[boss].size : 1) : parseInt(fs),
							ni: magic === undefined
                        };
                        DotDX.gui.addRaid(id);
                    }
                    return DotDX.config.raidList[id]
                };
                tmp.save = function (b) {
                    b = typeof b == 'undefined' ? true : b;
                    GM_setValue('DotDX', JSON.stringify(DotDX.config));
                    if(b) setTimeout(DotDX.config.save, 60000, true);
                    else console.log('[DotDX] Manual config save invoked');
                };
                //tmp.extSave = function(){DotDX.gframe('dotdx.save#'+JSON.stringify({'removeWChat':DotDX.config.removeWChat,'leftWChat':DotDX.config.leftWChat,'hideWChat':DotDX.config.hideWChat}));};
                return tmp;
            })(),
			linksHistory: [],
            request: {
                importLock: false,
                joinAfterImport: false,
                fromChat: false,
                quickBtnLock: true,
                filterSearchStringT: "",
                raids: function (isinit, hours) {
                    if (!DotDX.gui.joining) {
                        var secs = 15 - parseInt((new Date().getTime() - DotDX.config.lastImported) / 1000);
                        if (secs > 0) {
                            //DotDX.util.extEcho
                            DotDX.gui.doStatusOutput("You can import again in " + secs + " seconds."); return
                        }
                        console.log("[DotDX] Importing raids from raids server ...");
                        if (!isinit) this.initialize("Requesting raids");
                        else DotDX.request.tries++;
                        var h = hours ? ('&h=' + hours) : '';
						var url = "http://mutik.erley.org/import_ag.php?u=" + DotDX.config.agUser + "&i=" + DotDX.config.agId + h + '&s=' + DotDX.config.serverMode;
						console.info(url);
                        DotDX.request.req({
                            eventName: "dotd.getraids",
                            url: url,
                            method: "GET",
                            headers: {"Content-Type": "application/JSON"},
                            timeout: 30000
                        });
                    }
                },
				upload: function (isinit) {
					var r = DotDX.util.getRaidFromUrl(document.getElementById('dotdxRaidsUpload').value);
					if (r !== null) {
						console.log("[DotDX] Uploading raid to server ...");
						if (!isinit) this.initialize("Uploading raid");
						else DotDX.request.tries++;
						DotDX.request.req({
							eventName: "dotd.upraid",
							url: "http://mutik.erley.org/submit_ag.php?i=" + DotDX.config.agId + "&id=" + r.id + "&hash=" + r.hash + "&diff=" + r.diff + "&boss=" + r.boss,
							method: "GET",
							headers: {"Content-Type": "application/JSON"},
							timeout: 30000
						});
					}
					else document.getElementById('dotdxRaidsUpload').value = "Paste raid url here then click icon";
				},
                poster: function (isInit) {
                    var txt = document.getElementById('DotDX_checkRaidPoster').value, id;
                    if (txt.length < 1) return;
                    if (isNaN(txt)) {
                        var r = DotDX.util.getRaidFromUrl(txt);
                        if (r === null) return;
                        id = r.id;
                    }
                    else id = parseInt(txt);
                    console.log("[DotDX] Requesting raid poster info from server...");
                    if (!isInit) this.initialize("Requesting raid poster data");
                    else DotDX.request.tries++;
                    DotDX.request.req({
                        eventName: "dotd.getposter",
                        url: "http://mutik.erley.org/getposter.php?i=" + id,
                        method: "GET",
                        headers: {"Content-Type": "application/JSON"},
                        timeout: 30000
                    });
                },
                initialize: function (str) {
                    DotDX.gui.doStatusOutput(str + "...", 3000, true);
                    DotDX.request.tries = 0;
                    DotDX.request.seconds = 0;
                    DotDX.request.complete = false;
                    DotDX.request.timer = setTimeout(DotDX.request.tick, 1000, str);
                },
                tick: function (str) {
                    if (!DotDX.request.complete) {
                        if (DotDX.request.seconds > 25) {
                            DotDX.gui.doStatusOutput("Request failed.", 3000, true); return;
                        }
                        DotDX.request.seconds++;
                        DotDX.gui.doStatusOutput(str + " (" + DotDX.request.seconds + ")...", 1500, true);
                        DotDX.request.timer = setTimeout(DotDX.request.tick, 1000, str);
                    }
                },
                complete: false,
                seconds: 0,
                timer: 0,
                tries: 0,
                req: function (param) {
                    var a = document.createEvent("MessageEvent");
                    if (a.initMessageEvent) a.initMessageEvent("dotd.req", false, false, JSON.stringify(param), document.location.protocol + "//" + document.location.hostname, 0, window, null);
                    else a = new MessageEvent("dotd.req", {"origin": document.location.protocol + "//" + document.location.hostname, "lastEventId": 0, "source": window, "data": JSON.stringify(param)});
                    document.dispatchEvent(a);
                },
                init: function () {
                    document.addEventListener("dotd.joinraid", DotDX.request.joinRaidResponse, false);
                    document.addEventListener("dotd.getraids", DotDX.request.addRaids, false);
                    document.addEventListener("dotd.getposter", DotDX.request.getPoster, false);
					document.addEventListener("dotd.upraid", DotDX.request.uploadResponse, false);
                    delete this.init;
                },
                joinRaid: function (r) {
                    if (typeof r == 'object') {
                        if (!DotDX.gui.joining) DotDX.request.initialize("Joining " + (!DotDX.raids[r.boss] ? r.boss.capitalize().replace(/_/g, ' ') : DotDX.raids[r.boss].shortname));
                        var joinData = 'user_id=' + DotDX.config.agId + '&auth_token=' + DotDX.config.agAuth;
                        console.log("[DotDX] Join raid url: "+DotDX.util.stringFormat('http://50.18.191.15/armor/raidjoin.php?' + joinData + '&ar_raid_id={0}&ar_hash={1}&serverid={2}', r.id, r.hash, r.sid));
						DotDX.request.req({
                            eventName: "dotd.joinraid",
                            url: DotDX.util.stringFormat('http://50.18.191.15/armor/raidjoin.php?' + joinData + '&ar_raid_id={0}&ar_hash={1}&serverid={2}', r.id, r.hash, r.sid),
                            method: "GET",
                            timeout: 30000
                        });
                    }
                },
				uploadResponse: function (e) {
					var r, data = JSON.parse(e.data);
					if (data.status != 200) {
						if (DotDX.request.tries >= 3) {
							DotDX.request.complete = true;
							DotDX.gui.doStatusOutput("Raids server busy. Please try again in a moment.");
							console.log('[DotDX] Raids request failed (url: ' + data.url + ')');
							console.log(JSON.stringify(data));
						} else {
							console.log("[DotDX] Raids server unresponsive (status " + data.status + "). Trying again, " + DotDX.request.tries + " tries.");
						}
						return;
					}
					DotDX.request.complete = true;
					try {
						r = JSON.parse(data.responseText)
					}
					catch (ex) {
						console.log("[DotDX] Uploading raid error");
						console.log('[DotDX] responseText: ' + data.responseText);
						document.getElementById('dotdxRaidsUpload').value = "Paste raid url here then click icon";
						return;
					}
					console.log('[DotDX] Upload resp: ' + r.resp);
					document.getElementById('dotdxRaidsUpload').value = "Paste raid url here then click icon";
					if (r.resp === 1) DotDX.gui.doStatusOutput("Raid submitted to server.");
					else if(r.resp === 2) DotDX.gui.doStatusOutput("Raid already submitted.");
					else DotDX.gui.doStatusOutput("Error when submitting raid.");
				},
                getPoster: function (e) {
                    var r, data = JSON.parse(e.data);
                    if (data.status != 200) {
                        if (DotDX.request.tries >= 3) {
                            DotDX.request.complete = true;
                            DotDX.gui.doStatusOutput("Raids server busy. Please try again in a moment.");
                            console.log('[DotDX] Raids request failed (url: ' + data.url + ')');
                            console.log(JSON.stringify(data));
                        } else {
                            console.log("[DotDX] Raids server unresponsive (status " + data.status + "). Trying again, " + DotDX.request.tries + " tries.");
                        }
                        return;
                    }
                    DotDX.request.complete = true;
                    try {
                        r = JSON.parse(data.responseText)
                    }
                    catch (ex) {
                        console.log("[DotDX] Checking raid poster request error");
                        console.log('[DotDX] responseText: ' + data.responseText);
                        return;
                    }
                    document.getElementById('DotDX_whoPosted_Raid').innerHTML = r.r;
                    document.getElementById('DotDX_whoPosted_Time').innerHTML = new Date(r.t * 1000).toLocaleString();
                    document.getElementById('DotDX_whoPosted_Poster').innerHTML = r.p;
                },
                addRaids: function(e) {
                    var r, data = JSON.parse(e.data);
                    if (data.status != 200) {
                        if (DotDX.request.tries >= 3) {
                            DotDX.request.complete = true;
                            DotDX.gui.doStatusOutput("Raids server busy. Please try again in a moment.");
                            console.log('[DotDX] Raids request failed (url: ' + data.url + ')');
                            console.log(JSON.stringify(data));
                        } else {
                            console.log("[DotDX] Raids server unresponsive (status " + data.status + "). Trying again, " + DotDX.request.tries + " tries.");
                        }
                        return;
                    }
                    DotDX.request.complete = true;
                    try {
                        r = JSON.parse(data.responseText)
                    }
                    catch (ex) {
                        console.log("[DotDX] Raids importing error or no raids imported");
                        console.log('[DotDX] responseText: ' + data.responseText);
                        return;
                    }
                    DotDX.gui.doStatusOutput("Importing " + r.raids.length + " raids...");
                    var raid, n = 0, t = 0, i, il, j, jl, d = 0;
                    var swt = !DotDX.config.importFiltered;
                    for(j = 0, jl = r.raids.length; j < jl; ++j) {
                        raid = r.raids[j];
						//console.log("[DotDX] Adding raid... sid:"+raid.s+", boss:"+raid.b+", diff:"+raid.d);
                        if (swt || typeof DotDX.config.filters[raid.s-1][raid.b] === "undefined" || (typeof DotDX.config.filters[raid.s-1][raid.b] !== "undefined" && !DotDX.config.filters[raid.s-1][raid.b][raid.d-1]) ) {
                            t++;
                            if (typeof DotDX.config.raidList[raid.i] !== 'object') {
                                n++;
                                DotDX.config.addRaid(raid.h, parseInt(raid.i), raid.b, parseInt(raid.d), parseInt(raid.s), false, /*raid.p,*/ raid.t, /*raid.r,*/ raid.m.split("_").map(function (x) {
                                    return parseInt(x)
                                }), parseFloat(raid.hp), raid.cs, raid.fs);
                            }
                            else {
                                DotDX.config.raidList[raid.i].magic = raid.m.split("_").map(function(x){return parseInt(x)});
                                DotDX.config.raidList[raid.i].hp = parseFloat(raid.hp);
                                DotDX.config.raidList[raid.i].cs = parseInt(raid.cs);
                                DotDX.config.raidList[raid.i].fs = parseInt(raid.fs);
								DotDX.config.raidList[raid.i].ni = false;
                            }
                        }
                    }
                    console.log('[DotDX] Import raids from server complete');
					//console.log('[DotDX] Dead raids: ' + r.prune);
                    var id = r.prune.length > 3 ? r.prune.split("_") : [];
                    //clean db
                    for(i = 0, il = id.length; i < il; ++i) if(DotDX.config.raidList[id[i]]) { delete DotDX.config.raidList[id[i]]; d++; }
                    console.log('[DotDX] Removing dead raids on import complete');
                    DotDX.gui.selectRaidsToJoin('import response');
                    DotDX.config.lastImported = new Date().getTime();
                    //DotDX.util.extEcho('Imported ' + t + ' raids, ' + n + ' new, ' + d + ' pruned.');
					DotDX.gui.doStatusOutput('Imported ' + n + ' new raids, ' + d + ' pruned.', 5000);
                    if (DotDX.request.joinAfterImport) DotDX.gui.joinSelectedRaids(false);
                },
                joinRaidResponse: function (e) {
                    var data = JSON.parse(e.data);
                    var statustxt = '';
                    DotDX.request.complete = true;
                    DotDX.gui.joinRaidComplete++;
                    if (data && data.status === 200 && data.responseText && data.url) {
                        var raidid = DotDX.util.getQueryVariable('ar_raid_id', data.url);
                        if (typeof DotDX.config.raidList[raidid] === 'object') {
                            DotDX.config.raidList[raidid].visited = true;
                            DotDX.gui.toggleRaidVisited(raidid);
                            if (/successfully (re-)?joined/i.test(data.responseText)) {
                                DotDX.gui.joinRaidSuccessful++;
                                statustxt = (DotDX.raids[DotDX.config.raidList[raidid].boss] ? DotDX.raids[DotDX.config.raidList[raidid].boss].shortname : DotDX.config.raidList[raidid].boss) + " joined successfully.";
                            }
                            else if (/already a member/i.test(data.responseText)) {
                                statustxt = "Join Failed. You are already a member.";
                            }
                            else if (/already completed/i.test(data.responseText)) {
                                DotDX.gui.joinRaidDead++;
                                statustxt = "Join failed. Raid is dead.";
                                DotDX.gui.deleteRaidFromDB(raidid);
                            }
                            else if (/not a member of the guild/i.test(data.responseText)) {
                                DotDX.gui.joinRaidDead++;
                                statustxt = "Join failed. You are not member of that Guild.";
                                DotDX.gui.deleteRaidFromDB(raidid);
                            }
                            else if (/(invalid|find) raid (hash|ID)/i.test(data.responseText)) {
                                statustxt = "Join failed. Invalid hash or ID.";
                                DotDX.gui.joinRaidInvalid++;
                                DotDX.gui.deleteRaidFromDB(raidid);
                            }
                            else {
                                statustxt = 'Join failed. Unknown join response.';
                            }
                        }
                        else DotDX.gui.joinRaidInvalid++;
                    }
                    else {
                        console.log('[DotDX] Request timed out');
                        DotDX.gui.joinRaidInvalid++;
                        statustxt = "Join failed. Timeout.";
                    }
                    if (DotDX.gui.joining) {
                        if (DotDX.gui.joinRaidComplete >= DotDX.gui.joinRaidList.length) {
                            statustxt = "Finished joining. " + DotDX.gui.joinRaidSuccessful + " new, " + DotDX.gui.joinRaidDead + " dead.";
                            DotDX.gui.joinFinish(true);
                            //if (DotDX.gui.joinRaidSuccessful > 2) DotDX.gui.doStatusOutput(statustxt);
                            setTimeout(DotDX.config.save, 3000, false)
                        }
                        else {
                            statustxt = "Joined " + DotDX.gui.joinRaidComplete + " of " + DotDX.gui.joinRaidList.length + ". " + DotDX.gui.joinRaidSuccessful + " new, " + DotDX.gui.joinRaidDead + " dead.";
                            if (DotDX.gui.joinRaidIndex < DotDX.gui.joinRaidList.length) DotDX.request.joinRaid(DotDX.gui.joinRaidList[DotDX.gui.joinRaidIndex++]);
                        }
                    }
                    else setTimeout(DotDX.config.save, 3000, false);
					//DotDX.gui.selectRaidsToJoin('single_join');
                    if (statustxt !== '') DotDX.gui.doStatusOutput(statustxt, 4000, true);
                }
            },
            getRaidDetailsBase: function (url) {
                var r = {diff: 0, hash: '', boss: '', id: 0, sid: 0}, i, cnt = 0;
                var reg = /[?&]([^=]+)=([^?&]+)/ig, p = url.replace(/&amp;/gi, '&').replace(/ar_&/gi, '&ar_');
                while ((i = reg.exec(p)) != null) {
                    switch (i[1]) {
                        case 'ar_raid_id':
                        case 'raid_id': r.id = parseInt(i[2]); cnt++; break;
                        case 'ar_difficulty':
                        case 'difficulty': r.diff = parseInt(i[2]); cnt++; break;
                        case 'ar_raid_boss':
                        case 'raid_boss': r.boss = i[2]; cnt++; break;
                        case 'ar_hash':
                        case 'hash': r.hash = i[2]; cnt++; break;
                        case 'ar_serverid':
                        case 'serverid': r.sid = parseInt(i[2]); cnt++; break;
                    }
                }
                if (cnt < 4) return false;

                r.diffLongText = ['Normal', 'Hard', 'Legendary', 'Nightmare'][r.diff - 1];
                r.diffShortText = ['N', 'H', 'L', 'NM'][r.diff - 1];
                var stats = DotDX.raids[r.boss];
                if (typeof stats === 'object') {
                    r.name = stats.name;
                    r.shortname = stats.shortname;
                    r.size = stats.size;
                    r.type = stats.type;
                    r.dur = stats.duration;
                    r.durText = stats.dur + "hrs";
                    r.stat = stats.stat;
                }
                else {
                    r.name = r.boss[0].toUpperCase() + r.boss.substring(1).replace(/_/g, " ");
                    r.shortname = r.name;
                    r.dur = 48;
                }
                return r;
            },
            getTierTxt: function (hp, ppl, ap) {
                var num = hp / ppl;
                num = ap ? num / 2 : num;
                if (num >= 1000000000000) return (num / 1000000000000).toPrecision(3) + 't';
                if (num >= 1000000000)    return (num / 1000000000).toPrecision(3) + 'b';
                if (num >= 1000000)       return (num / 1000000).toPrecision(3) + 'm';
                if (num >= 1000)          return (num / 1000).toPrecision(3) + 'k';
                                          return num + ''
            },
            getRaidDetails: function (url, user, visited, ts, room) {
                user = user ? user : '';
                var rVis = visited ? visited : user == DotDX.config.kongUser && DotDX.config.markMyRaidsVisted;
                var r = DotDX.util.getRaidFromUrl(url);
                if (r == null) return null;
                //if (r && typeof r.diff == 'number' && typeof r.hash == 'string' && typeof r.boss == 'string' && typeof r.id == 'string') {
                //var filter = DotDX.c('#DotDX_filters').ele().innerHTML;
                r.visited = rVis;
				var info = DotDX.config.raidList[r.id];
				if (typeof info !== 'object') {
					info = DotDX.config.addRaid(r.hash, r.id, r.boss, r.diff, r.sid, r.visited, user, ts, room);
					if (typeof info === 'object') r.isNew = true;
					else return null;
				}
				else r.isNew = false;
				r.timeStamp = info.timeStamp;
				r.visited = info.visited;
                return r;
            },
            getTimestamp: function() {
				return '(' + ('0' + (new Date().getHours())).slice(-2) + ':' + ('0' + (new Date().getMinutes())).slice(-2) + ')';
            },
            isFirefox: navigator.userAgent.indexOf('Firefox') > 0,
            gui: {
                /*helpBox: function(boxId, magId, raidId, mouseOut) {
                    var boxDiv = document.getElementById(boxId);
                    var magSpan = document.getElementById(magId);
					var i, il;
                    if(mouseOut) {
                        DotDX.gui.CurrentRaidsOutputTimer = setTimeout(function(){document.getElementById('chat_raids_overlay').className = "";}, 1500);
                        if(magSpan) {
                            magSpan.style.maxWidth = "0";
                            setTimeout(function(){ document.getElementById(magId).innerHTML = "" }, 100);
                        }
                    }
                    else {
                        var info = DotDX.config.raidList[raidId], msg = 'Unknown', mWidth = "0", raid;
                        if (typeof info !== 'object') msg = 'Raid not in db (removed?)';
                        else if (typeof DotDX.raids[info.boss] == 'undefined') {
                            msg = '<span style="font-size: 12px;">' + info.boss.capitalize().replace(/_/ig, ' ') + ' on ' + ['Normal', 'Hard', 'Legendary', 'Nightmare'][info.diff - 1] + '</span>';
                        }
                        else {
                            var magE = info.magic.reduce(function(a,b){return a+b;});
                            raid = DotDX.raids[info.boss];
                            var diff = info.diff - 1;
                            if (magE) {
                                var magI = "";
                                for (i = 0, il = raid.nd; i < il; ++i) magI += '<span class="magic" style="background-position: -' + info.magic[i] * 16 + 'px 0">&nbsp;</span>';
                                magSpan.innerHTML = magI;
                                mWidth = (raid.nd * 18 + 10) + "px";
                            }
                            msg = '<span style="font-size: 12px;">' + raid.name + ' on ' + ['Normal', 'Hard', 'Legendary', 'Nightmare'][diff] + '</span><br>';
                            msg += (raid.type === '' ? '' : raid.type + ' | ') + DotDX.raidSizes[raid.size].name + ' Raid' + (diff == 3 ? ' | AP' : '');
                            var size = raid.size < 15 ? 10 : raid.size;
                            var fs = raid.health[diff] / (raid.size == 101 ? 100 : raid.size);
                            if (typeof raid.lt !== 'object') {
                                var epicRatio = DotDX.raidSizes[size].ratios;
                                if (size === 15) msg += '<br>fs:&thinsp;' + DotDX.util.getShortNum(fs) + ' | 65d:&thinsp;' + DotDX.util.getShortNum(fs * epicRatio[0]) + ' | 338d:&thinsp;' + DotDX.util.getShortNum(fs * epicRatio[9]) + ' | 375d:&thinsp;' + DotDX.util.getShortNum(fs * epicRatio[10]);
                                else msg += '<br>fs: ' + DotDX.util.getShortNum(fs) + ' | 1e: ' + DotDX.util.getShortNum(fs * epicRatio[0]) + ' | 2e: ' + DotDX.util.getShortNum(fs * epicRatio[2]) + ' | 2/3e: ' + DotDX.util.getShortNum(fs * epicRatio[3]);
                                //msg += '<br>2e: ' + epicRatio[2] + ' | 3e: ' + epicRatio[4] + ' | fs: ' + fs;
                            }
                            else if (typeof raid.lt === 'object') {
								if(raid.lt[0] !== 'u') {
									var ele = DotDX.lootTiers[raid.lt[diff]];
									var step = DotDX.config.chatSize === 450 ? 6 : (DotDX.config.chatSize === 375 ? 5 : 4);
									var steplow = step - 1;
									var tiers = ele['tiers'];
									var epics = ele['epics'];
									var best = ele['best'];
									var e = ele['e'] ? 'E' : '';
									var text = '</table>';
									var tier;
									for(i = tiers.length-1, il = -1; i > il; --i) {
										tier = (i % step == steplow ? '</td></tr><tr><td>' : '</td><td>' ) + epics[i]+ e + ':</td><td ' + (i === best ? 'class="best"' : '') + '>' + DotDX.util.getShortNumMil(tiers[i]);
										text = tier + text;
									}
									msg += '<table><tr><td>FS:</td><td>' + DotDX.util.getShortNum(fs) + text;
								}
								else msg += '<br>FS: &nbsp;&nbsp;&thinsp;' + DotDX.util.getShortNum(fs) + ' | Tiers not yet known.';
                            }
                            else {
                            }
                        }
                        if(magE) magSpan.style.maxWidth = mWidth;
                        document.getElementById(boxId + '_text').innerHTML = msg;
                        if(!(boxDiv.className.indexOf('active') > 0)) boxDiv.className = "active";
                        clearTimeout(DotDX.gui.CurrentRaidsOutputTimer);
                    }
                },*/
                refreshRaidList: function() {
                    document.getElementById('dotdxRaidsList').innerHTML = "";
                    for (var i = 0, il = DotDX.gui.joinRaidList.length; i < il; ++i) DotDX.gui.addRaid(DotDX.gui.joinRaidList[i]);
                },
                diffTxt: [['u','U','Unknown'],['n','N','Normal'],['h','H','Hard'],['l','L','Legendary'],['nm','NM','Nightmare']],
                addRaid: function(id) {
                    var r = typeof id === 'string' || typeof id === 'number' ? DotDX.config.raidList[id] : id;
                    var a = document.getElementById('dotdxRaidsList');
                    if (r.boss) {
                        if (a !== null) {
                            var rd = typeof DotDX.raids[r.boss] !== 'object' ? {shortname: r.boss.replace(/_/ig, ' '), duration: 24} : DotDX.raids[r.boss];
                            var url = 'http://armorgames.com/dawn-of-the-dragons-game/13509?ar_action_type=raidhelp&ar_difficulty=' + r.diff + '&ar_hash=' + r.hash + '&ar_raid_boss=' + r.boss + '&ar_raid_id=' + r.id + '&ar_serverid=' + r.sid;
                            var hpr = (r.hp * 100).toPrecision(3), fCls = "";
                            var tlp = ((r.expTime - parseInt(new Date().getTime()/1000)) / (36 * rd.duration)).toPrecision(3);
                            var delta = hpr - tlp;
                            /*if (delta > 0) {
                                if (delta < 15) fCls = " failings";
                                else if (delta < 30) fCls = " failingm";
                                else fCls = " failingh";
                            }*/
                            var elem = DotDX.c('div').set({ class: this.diffTxt[r.diff][0] + (r.visited?' visited':''), id: 'dotdxRaids_' + r.id, raidid: r.id, onmouseout: 'DotDX.gui.raidInfoClose(event, this)' }).html(' \
                            <svg class="icon entry-icon reg" onclick="DotDX.gui.raidInfoBox(\''+r.id+'\')"><use xlink:href="#dotdx-info-icon"></use></svg>\
							<span class="diff">' + this.diffTxt[r.diff][1] + '</span>\
							<a href="' + url + '">' + rd.shortname + '</a>\
							<span class="status">'
							+ (delta > 10 ? '<svg class="icon entry-icon reg"><use xlink:href="#dotdx-clock-icon"></use></svg>' : '')
							+ (r.fs === 0 ? '<svg class="icon entry-icon reg"><use xlink:href="#dotdx-cancel-circle-icon"></use></svg>' : '')
							+ '<svg class="icon entry-icon reg visited"><use xlink:href="#dotdx-link-icon"></use></svg>\
								<!-- <svg class="icon entry-icon del"><use xlink:href="#dotdx-bin2-icon"></use></svg> -->\
							</span>\
						    ', true);
							elem.attach('to', a);
                        }
                    }
                    else DotDX.gui.deleteRaidFromDB(id);
                },
                toggleRaidListDesc: function (el, mode) {
                    if(mode) {
                        clearTimeout(el.timerout);
                        el.timerin = setTimeout(function(){el.lastElementChild.style.display = "block";}, 500)
                    }
                    else {
                        clearTimeout(el.timerin);
                        el.timerout = setTimeout(function (){el.lastElementChild.style.display = "none";}, 50)
                    }
                    return false;
                },
                updateMessage: function() { DotDX.gui.doStatusOutput(DotDX.gui.standardMessage(), false, true) },
                standardMessage: function() { return  Object.keys(DotDX.config.raidList).length + ' raids in db, ' + DotDX.gui.joinRaidList.length + ' selected to join'; },
                CurrentStatusOutputTimer: 0,
                doStatusOutput: function(str, msecs) {
                    msecs = msecs || 4000;
					var rel = document.getElementById('dotdxStatusBar');
					if (rel !== null) rel.innerHTML = str;
                    if (msecs) {
                        if (DotDX.gui.CurrentStatusOutputTimer) clearTimeout(DotDX.gui.CurrentStatusOutputTimer);
                        DotDX.gui.CurrentStatusOutputTimer = setTimeout(function () {
							var rel = document.getElementById('dotdxStatusBar');
                            if (rel !== null) rel.innerHTML = DotDX.gui.standardMessage();
                        }, msecs);
                    }
                },
                Importing: false,
                deleteRaid: function(ele) {
                    var id = ele.getAttribute('raidid');
                    DotDX.gui.deleteRaidFromDB(id);
					if(!DotDX.gui.joining) DotDX.gui.refreshRaidList();
                },
                deleteRaidFromDB: function(id,suppress) {
                    if(DotDX.config.raidList[id]) delete DotDX.config.raidList[id];
					if (!suppress) {
						var el = document.getElementById('dotdxRaids_' + id);
						if (el !== null) el.parentNode.removeChild(el);
					}
                },
                quickImportAndJoin: function(joinStr, imp) {
                    DotDX.gui.updateFilterTxt(joinStr, false, true);
                    DotDX.request.quickBtnLock = false;
                    if(imp) {
						DotDX.request.joinAfterImport = true;
						DotDX.gui.importFromServer();
					}
                    else DotDX.gui.joinSelectedRaids();
                },
				toggleRaidVisited: function(id) {
					if (id) {
						DotDX.config.raidList[id].visited = true;
						var el = document.getElementById('dotdxRaids_'+id);
						if (el !== null) el.className += ' visited';
					}
				},
                importFromServer: function() {
                    var h = Math.ceil(((new Date).getTime() - DotDX.config.lastImported) / 3600000);
                    //DotDX.util.extEcho
                    DotDX.gui.doStatusOutput('Importing raids from server...');
                    DotDX.request.raids(false, h);
                },
                sortRaids: function() {
                    var raidArray = [], i, sortFunc;
                    var selectedSort = document.getElementById('FPXRaidSortSelection').value;
                    var selectedDir = document.getElementById('FPXRaidSortDirection').value;
                    var raidlistDIV = document.getElementById('raid_list');
                    var raidList = raidlistDIV.childNodes;
                    console.log('[DotDX] Sorting started ' + selectedSort + ' : ' + selectedDir);
                    i = raidList.length;
                    while (i--) raidArray.push(DotDX.config.raidList[raidList[i].getAttribute('raidid')]);
                    switch (selectedSort) {
                        case 'Id':
                            if (selectedDir == 'asc') sortFunc = function (a, b) {
                                if (!(typeof a.id === 'undefined' || typeof b.id === 'undefined') && a.id > b.id) return -1;
                                return 1;
                            };
                            else sortFunc = function (a, b) {
                                if (!(typeof a.id === 'undefined' || typeof b.id === 'undefined') && a.id < b.id) return -1;
                                return 1;
                            };
                            break;
                        case 'Time':
                            if (selectedDir == 'asc') sortFunc = function (a, b) {
                                if (!(typeof a.timeStamp === 'undefined' || typeof b.timeStamp === 'undefined') && a.timeStamp > b.timeStamp) return -1;
                                return 1;
                            };
                            else sortFunc = function (a, b) {
                                if (!(typeof a.timeStamp === 'undefined' || typeof b.timeStamp === 'undefined') && a.timeStamp < b.timeStamp) return -1;
                                return 1;
                            };
                            break;
                        case 'Name':
                            if (selectedDir == 'asc') sortFunc = function (a, b) {
                                a = DotDX.raids[a.boss];
                                b = DotDX.raids[b.boss];
                                //console.log(a + ' : ' + b + ' : ' + (typeof a === 'undefined') + ' : ' + (typeof b === 'undefined'));
                                if (!(typeof a === 'undefined' || typeof b === 'undefined') && a.name > b.name) return -1;
                                return 1;
                            };
                            else sortFunc = function (a, b) {
                                a = DotDX.raids[a.boss];
                                b = DotDX.raids[b.boss];
                                if (!(typeof a === 'undefined' || typeof b === 'undefined') && a.name < b.name) return -1;
                                return 1;
                            };
                            break;
                    }
                    try {
                        raidArray.sort(sortFunc)
                    }
                    catch (e) {
                        console.log('[DotDX] Sorting error: ' + e);
                        return
                    }
                    raidlistDIV = document.getElementById('raid_list');
                    if(raidlistDIV !== null) while(raidlistDIV.hasChildNodes()) raidlistDIV.removeChild(raidlistDIV.lastChild);
                    i = raidArray.length;
                    while (i--) DotDX.gui.addRaid(raidArray[i]);
                    //DotDX.gui.FPXFilterRaidListByName();
                    console.log('[DotDX] Sorting finished');
                },
                joinRaidList: [],
                postRaidList: [],
                updateFilterTimeout: 0,
                //filterSearchStringR: "",
                updateFilterContext: true,
                includeDiff: function(str, dv) {
                    var diff = isNaN(parseInt(dv)) ? ({'n': 1, 'h': 2, 'l': 3, 'nm': 4, 'nnm': 0})[dv] || 5 : parseInt(dv);
                    var out = "";
                    var string = str.toString();
                    switch(diff) {
                        case 0: out = string.replace(/,|$/g, '_1,') + string.replace(/,|$/g, '_4,'); break;
                        case 1: case 2: case 3: case 4: out = string.replace(/,|$/g, '_' + diff + ','); break;
                        default: for(var i = 1; i < 5; ++i) out += string.replace(/,|$/g, '_' + i + ','); break;
                    }
                    return out.slice(0, -1);
                },
                updateFilterTxt: function(txt, quick) {
                    clearTimeout(this.updateFilterTimeout);
                    var foundRaids = [], field, rf, i, il;
                    if(txt !== "") {
                        var searchArray = txt.split(/\s?\|\s?|\sor\s|\s?,\s?/ig);
						var keys = Object.keys(DotDX.raids);
                        for(i = 0, il = searchArray.length; i < il; ++i) {
                            field = searchArray[i].toLowerCase().split(':');
                            if (field[0] !== "") {
                                if(typeof DotDX.searchPatterns[field[0]] !== 'undefined') foundRaids.push(this.includeDiff(DotDX.searchPatterns[field[0]], field[1]));
                                else if(typeof DotDX.raids[field[0]] !== 'undefined') foundRaids.push(this.includeDiff(field[0], field[1]));
                                else {
                                    for(var k = 0, kl = keys.length; k < kl; ++k) {
                                            rf = (DotDX.raids[keys[k]].name + ':' + DotDX.raids[keys[k]].shortname + ':' + DotDX.raids[keys[k]].type).toLowerCase();
                                            if (rf.indexOf(field[0]) >= 0) foundRaids.push(this.includeDiff(keys[k], field[1]));
                                    }
                                }
                            }
                        }
                    }
                    var finalSearchString = foundRaids.length === 0 ? "" : "," + foundRaids.toString() + ",";
					//console.log('[DotDX] Search string: ' + finalSearchString);
					if(quick) {
						DotDX.request.filterSearchStringT = finalSearchString;
						DotDX.gui.selectRaidsToJoin('quick');
						DotDX.config.save(false)
					}
					else {
						DotDX.config.lastFilter[DotDX.config.serverMode - 1] = txt;
						DotDX.config.filterSearchStringR = finalSearchString;
						this.updateFilterTimeout = setTimeout(function () {
							DotDX.gui.selectRaidsToJoin();
							DotDX.config.save(false)
						}, 300);
					}
                },
                selectRaidsToJoin: function(from) {
                    if(DotDX.request.quickBtnLock) {
                        if(!DotDX.gui.joining) DotDX.gui.joinRaidList.length = 0;
                        var searchString = from && from === 'quick' ? DotDX.request.filterSearchStringT : DotDX.config.filterSearchStringR;
                        var r, /*filter = DotDX.c('#DotDX_filters').ele().innerHTML,*/ server = DotDX.config.serverMode, keys = Object.keys(DotDX.config.raidList);
                        for(var k = 0, kl = keys.length; k < kl; ++k) {
							r = DotDX.config.raidList[keys[k]];
							if (DotDX.config.fltShowAll || (r.sid === server &&
							((!DotDX.config.fltExclFull || r.fs > 0) &&
							(DotDX.config.fltIncVis || !r.visited)) &&
							(typeof DotDX.config.filters[r.sid-1][r.boss] !== "undefined" && !DotDX.config.filters[r.sid-1][r.boss][r.diff-1]) &&
							//filter.indexOf('fltList_' + r.boss + '_' + (r.diff - 1)) < 0 &&
							(searchString === '' || searchString.indexOf("," + r.boss + "_" + r.diff + ",") >= 0) ))
							DotDX.gui.joinRaidList.push(r);
                        }
                        if (!DotDX.gui.joining) {
                            DotDX.gui.updateMessage();
                            DotDX.gui.refreshRaidList();
                        }
                    }
					if (from === 'checkbox') DotDX.config.save(false);
                },
                joining: false,
                joinRaidIndex: 0,
                joinRaidComplete: 0,
                joinRaidSuccessful: 0,
                joinRaidDead: 0,
                joinRaidInvalid: 0,
                joinSelectedRaids: function() {
                    if (!this.joining) {
                        this.joining = true;
                        this.joinRaidIndex = 0;
                        this.joinRaidComplete = 0;
                        this.joinRaidSuccessful = 0;
                        this.joinRaidDead = 0;
                        this.joinRaidInvalid = 0;
                        if (DotDX.gui.joinRaidList.length == 0) {
                            this.joinFinish(true);
                            return
                        }
                        //DotDX.c("#AutoJoinVisibleButton").ele().value = 'Cancel';
                        //DotDX.c("#AutoImpJoinVisibleButton").ele().value = 'Cancel';
                        console.log('[DotDX] Joining ' + DotDX.gui.joinRaidList.length + ' raids');
                        while(DotDX.gui.joinRaidIndex < Math.min(20, DotDX.gui.joinRaidList.length)) DotDX.request.joinRaid(DotDX.gui.joinRaidList[DotDX.gui.joinRaidIndex++]);
                    }
                    else this.joinFinish();
                },
                joinFinish: function(recalc) {
                    this.joining = false;
                    DotDX.request.quickBtnLock = true;
                    //DotDX.c("#AutoJoinVisibleButton").ele().value = 'Join';
                    //DotDX.c("#AutoImpJoinVisibleButton").ele().value = 'Import & Join';
                    if (recalc) this.selectRaidsToJoin('joining finish');
                },
                getScrollbarWidth: function() {
                    var scrollDiv = DotDX.c('div').set({id: "DotDX_scrollMeasure", style: "width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;"}).attach('to', document.body).ele();
                    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                    document.body.removeChild(document.getElementById('DotDX_scrollMeasure'));
                    return scrollbarWidth;
                },
                createFilterTab: function () {
                    var sm = DotDX.config.serverMode - 1;
					var rdObj = Object.keys(DotDX.raids);
                    var i, il, raid, parent, cb;
                    var sectionID = ['Small','Medium','Large','Epic','Colossal','Gigantic'];
                    for(i = 0; i < 6; ++i) document.getElementById('dotdxFilter' + sectionID[i]).innerHTML = '';
                    for(i = 0, il = rdObj.length; i < il; ++i) {
						raid = DotDX.raids[rdObj[i]];
						if (raid.stat !== 'H' && raid.stat !== 'ESH') {
							parent = DotDX.c('div').html(' \
                        <span>' + raid.name + '</span>\
                        <input type="checkbox" id="dotdxFilter_' + raid.id + '_0' + '"/><label for="dotdxFilter_' + raid.id + '_0' + '"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg></label>\
                        <input type="checkbox" id="dotdxFilter_' + raid.id + '_1' + '"/><label for="dotdxFilter_' + raid.id + '_1' + '"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg></label>\
                        <input type="checkbox" id="dotdxFilter_' + raid.id + '_2' + '"/><label for="dotdxFilter_' + raid.id + '_2' + '"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg></label>\
                        <input type="checkbox" id="dotdxFilter_' + raid.id + '_3' + '"/><label for="dotdxFilter_' + raid.id + '_3' + '"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg></label>\
                        <input type="checkbox" id="dotdxFilter_' + raid.id + '_all' + '"/><label for="dotdxFilter_' + raid.id + '_all' + '"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg></label>', false);

						if (raid.size < 40) parent.attach('to', 'dotdxFilterSmall');
						else if (raid.size < 100) parent.attach('to', 'dotdxFilterMedium');
						else if (raid.size < 200) parent.attach('to', 'dotdxFilterLarge');
						else if (raid.size < 300) parent.attach('to', 'dotdxFilterEpic');
						else if (raid.size < 600) parent.attach('to', 'dotdxFilterColossal');
						else if (raid.size < 1000) parent.attach('to', 'dotdxFilterGigantic');

						for (var j = 0; j < 4; ++j) {
							cb = document.getElementById('dotdxFilter_' + raid.id + '_' + j);
							cb.checked = !DotDX.config.filters[sm][raid.id][j];
							cb.addEventListener("click", function () {
								var s = DotDX.config.serverMode - 1;
								var raidId = this.id.substr(12).slice(0, -2);
								var diffIndex = parseInt(this.id.slice(-1));
								DotDX.config.filters[s][raidId][diffIndex] = !this.checked;
								var f = DotDX.config.filters[s][raidId];
								document.getElementById('dotdxFilter_' + raidId + '_all').checked = !f[0] && !f[1] && !f[2] && !f[3];
								DotDX.config.save(false);
							});
						}
						cb = document.getElementById('dotdxFilter_' + raid.id + '_all');
						cb.checked = !(DotDX.config.filters[sm][raid.id][0] && DotDX.config.filters[sm][raid.id][1] && DotDX.config.filters[sm][raid.id][2] && DotDX.config.filters[sm][raid.id][3]);
						cb.addEventListener('click', function() {
							var s = DotDX.config.serverMode - 1;
							var raidId = this.id.substr(12).slice(0, -4);
							var chk = this.checked;
							for (j = 0; j < 4; ++j) {
								document.getElementById('dotdxFilter_' + raidId + '_' + j).checked = chk;
								DotDX.config.filters[s][raidId][j] = !chk;
							}
							DotDX.config.save(false);
						});
					}
                    }
                },
                checkFiltering: function () {
					var sm = DotDX.config.serverMode - 1;
					var rdObj = Object.keys(DotDX.raids);
					var fltObj = Object.keys(DotDX.config.filters[sm]);
                    var i, il;
                    if(!DotDX.util.isArrEq(rdObj, fltObj)) {
                        for(i = 0, il = rdObj.length; i < il; ++i) if (typeof DotDX.config.filters[sm][rdObj[i]] === 'undefined') {
							DotDX.config.filters[0][rdObj[i]] = [true, true, true, false];
							DotDX.config.filters[1][rdObj[i]] = [true, true, true, false];
						}
                        for(i = 0, il = fltObj.length; i < il; ++i) if(rdObj.indexOf(fltObj[i]) < 0) {
							delete DotDX.config.filters[0][fltObj[i]];
							delete DotDX.config.filters[1][fltObj[i]];
						}
                        console.log('[DotDX] Filters array has been altered!');
                    }
                },
                switchServer: function () {
                    var sm = DotDX.config.serverMode;
                    DotDX.config.serverMode = sm === 1 ? 2 : 1;
                    this.createFilterTab();
                    DotDX.c('#dotdxRaidsSearch').ele().value = DotDX.config.lastFilter[DotDX.config.serverMode - 1];
                    this.updateFilterTxt(DotDX.config.lastFilter[DotDX.config.serverMode - 1], true);
                    DotDX.config.save(false);
                },
				changeMenu: function(e) {
					var menuGroup = e.target.parentNode.children;
					var numEl = menuGroup.length;
					for (var i = 0; i < numEl; ++i) menuGroup[i].className = '';
					e.target.className = 'active';
					var contentGroup = document.getElementById('dotdxcontainer').getElementsByClassName('content');
					for (i = 0; i < numEl; ++i) contentGroup[i].className = 'content';
					document.getElementById('dotdx'+e.target.innerHTML).className += ' active';
					return false;
				},
				rollover: function(e) {
					var isSelfActive = e.currentTarget.className.indexOf('active') > 0;
					var items = e.currentTarget.parentNode.getElementsByClassName('rollover');
					var numel = items.length;
					for (var i = 0; i < numel; ++i) items[i].className = items[i].className.replace(' active', '');
					if (!isSelfActive) e.currentTarget.className += ' active';
				},
				raidListClick: function(e) {
					e.preventDefault();
					e.stopPropagation();
					console.log("[DotDX] <raidList> clicked class: " + e.target.className + ", tag: " + e.target.localName + ", id: " + e.target.id);
					switch(e.target.localName) {
						case "a":
							var id = e.target.parentNode.id.split("_")[1];
							console.log("[DotDX] Joining raid with id: "+id);
							DotDX.request.joinRaid(DotDX.config.raidList[id]);
							break;
					}
					return false;
				},
				setArmorLayout: function() {
					var s = '.dotdxDummy';
					if(DotDX.config.hideArmorBanner) s += ", div#ag3-header";
					if(DotDX.config.hideGameTitle) s += ", div#content-canvas > section.game-header";
					if(DotDX.config.hideGameDetails) s += ", div#content-canvas > section.game-secondary";
					if(DotDX.config.hideArmorFooter) s += ", div#footer";
					DotDX.c('#dotdxArmorLayoutCSS').html(s + " { display: none; }", true);
				},
				raidInfoClose: function(evt, el) {
					if(document.getElementById('dotdxInfoBar').className === 'active') {
						var e = evt.relatedTarget;
						//check for all children levels (checking from bottom up)
						while (e !== null) {
							if (e === el) return false;
							e = e.parentNode;
						}
						clearTimeout(window.raidInfoTimer);
						window.raidInfoTimer = setTimeout(function () {
							DotDX.c('#dotdxInfoBar').set({class: ''})
						}, 1500);
					}
					else return false;
				},
				raidInfoBox: function(id) {
					clearTimeout(window.raidInfoTimer);
					var r = DotDX.config.raidList[id];
					var hasInfo = typeof DotDX.raids[r.boss] !== 'undefined';
					var ri = !hasInfo ? {shortname: r.boss.replace(/_/ig, ' '), duration: 24} : DotDX.raids[r.boss];
					var innerInfo = '', magics = '', i, il;
					if (hasInfo) {
						for (i = 0, il = ri.nd; i < il; ++i) magics += '<div style="background-position: -' + r.magic[i] * 16 + 'px 0"></div>';
						var hp = ri.health[r.diff-1];
						var fs = hp / (ri.size === 101 ? 100 : ri.size);
						var tr = r.expTime - parseInt(new Date().getTime()/1000);
						var tm = tr < 0 ? 0 : tr/60, th = Math.floor(tm / 60); tm -= th*60;
						th = th > 1 ? (Math.floor(th)+'h') : '';
						th += ' '+Math.floor(tm)+'min';
						var tlp = (tr / (36 * ri.duration)).toPrecision(3);
						var os = 0, ms = 0;
						if (ri.lt) {
							var lt = DotDX.lootTiers[ri.lt[r.diff-1]];
							os = DotDX.util.getShortNumMil(lt.tiers[lt.best]);
							ms = DotDX.util.getShortNumMil(lt.tiers[lt.tiers.length-1]);
						}
						else {
							var rt = DotDX.raidSizes[ri.size].ratios;
							os = DotDX.util.getShortNum(rt[2] * fs);
							ms = DotDX.util.getShortNum(rt[rt.length-1] * fs);
						}
						innerInfo = '<div class="info">\
							<div>Class: '+(ri.type === 'None' ? '' : ri.type)+'</div>\
							<div>Participants: '+(ri.size- r.fs)+' / '+ri.size+'</div>\
							<div>Health: '+DotDX.util.getShortNum(hp*r.hp)+' / '+DotDX.util.getShortNum(hp)+' ('+(r.hp * 100).toPrecision(3)+'%)</div>\
							<div>Timer: '+th+' / '+ri.duration+'h ('+tlp+'%)</div>\
							<div>\
								<div>'+(r.diff < 4 ? 'FS: '+DotDX.util.getShortNum(fs) : 'AP: '+DotDX.util.getShortNum(fs/2))+'</div>\
								<div>OS: '+os+'</div>\
								<div>MS: '+ms+'</div>\
							</div>\
						</div>';
					}
					var inner = '\
					<div class="'+DotDX.gui.diffTxt[r.diff][0]+'">\
						<div class="title">\
							<div><div>'+ri.shortname+'</div>\
							<div>'+DotDX.gui.diffTxt[r.diff][2]+'</div></div>\
							<div class="magics">'+magics+'</div>\
						</div>\
						'+innerInfo+'\
					</div>';
					var info = DotDX.c('#dotdxInfoBar');
					info.html(inner, true);
					var cont = document.getElementById('dotdxcontainer');
					var list = document.getElementById('dotdxRaidsList');
					var elem = document.getElementById('dotdxRaids_'+id);
					var boxpos = elem.offsetTop-list.scrollTop;
					var bottomfix = cont.offsetHeight-(boxpos+info.ele().offsetHeight+2);
					boxpos += bottomfix > 0 ? -1 : bottomfix;
					info.set({class: 'active', style: 'top:'+boxpos+'px'});
				},
				cleanRaidsDB: function(start) {
					var now = parseInt(new Date().getTime()/1000);
					var r, cnt = 0, keys = Object.keys(DotDX.config.raidList);
					for(var k = 0, kl = keys.length; k < kl; ++k) {
						r = DotDX.config.raidList[keys[k]];
						if(now >= r.expTime || (r.ni && (now-r.timeStamp)/3600 > 3)) {
							DotDX.gui.deleteRaidFromDB(keys[k], true);
							cnt++;
						}
					}
					console.log('[DotDX] Number of expired raids removed: ' + cnt);
					if(cnt > 0 && !start) {
						DotDX.gui.doStatusOutput(cnt + ' expired raids removed from db.');
						DotDX.gui.selectRaidsToJoin('prune');
					}
					if (start) setInterval(DotDX.gui.cleanRaidsDB, 600000);
				},
                load: function() {
					DotDX.gui.checkFiltering();
					var consistencyFixes;
					if (DotDX.isFirefox) {
						consistencyFixes = "\
						#dotdxRaidsList > div {\
							padding: 1px 5px 0;\
						}\
						#dotdxcontainer input[type='checkbox'] + label {\
							line-height: 18px;\
						}\
						#dotdxcontainer div.rollover > span {\
							padding-top: 1px;\
						}\
						#dotdxcontainer svg.action-icon {\
							filter: drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.2));\
						}\
						#dotdxcontainer div.rollover.active svg {\
							transform: rotate(90deg);\
							transform-style: flat;\
							transform-origin: 8px 8px;\
						}\
						#dotdxcontainer div.rollover.active + div.rollover-content {\
							max-height: 383px;\
						}\
						#dotdxRaidsList {\
							max-height: 540px;\
						}\
						";
					}
					else {
						consistencyFixes = "\
						#dotdxRaidsList > div {\
							padding: 1px 5px;\
						}\
						#dotdxcontainer input[type='checkbox'] + label {\
							line-height: 19px;\
						}\
						#dotdxcontainer div.rollover > span {\
							padding-top: 2px;\
						}\
						#dotdxcontainer svg.action-icon {\
							-webkit-filter: drop-shadow(0 0 4px rgba(255,255,255,0.3));\
						}\
						#dotdxcontainer div.rollover.active svg {\
							transform: rotate(180deg);\
						}\
						#dotdxcontainer div.rollover.active + div.rollover-content {\
							max-height: 377px;\
						}\
						#dotdxRaidsList {\
							max-height: 539px;\
						}\
						";
					}
					DotDX.c('style').set({type: "text/css"}).text("\
					/* Custom font, woff2 compressed, base64 encoded */\
					@font-face {\
						font-family: 'lato';\
						src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2');\
						font-weight: bold;\
						font-style: normal;\
					}\
					@font-face {\
						font-family: 'lato';\
						src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2');\
						font-weight: normal;\
						font-style: italic;\
					}\
					@font-face {\
						font-family: 'lato';\
						src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2');\
						font-weight: normal;\
						font-style: normal;\
					}\
					\
					/* AG layout fixes */\
					body { background-position: "+(window.screen.availWidth < 1360 ? '-287px' : 'calc(50% - 110px)')+" 0 !important; }\
					#mmo-updates-notice,\
					#content-canvas div#edblock,\
					#content-canvas div.ad-leaderboard,\
					#content-canvas div.ad-lrgrec,\
					#content-canvas div.ad-large-leaderboard-90,\
					#content-canvas #gamearea + div { display: none !important; }\
					#content-canvas, #footer { width: 993px; margin-left: "+(window.screen.availWidth < 1360 ? '0' : 'calc(50% - 622px)')+"; }\
					#ag3-header { margin: 0; width: 1025px; height: 128px; }\
					#ag3-header #primary-nav { width: 995px; }\
					#ag3-header #player-account .profile { margin: 10px 0 0; }\
					#ag3-header #primary-nav #topnav-tags-link .dropdown-menu { width: 945px; padding: 15px 20px; }\
					#ag3-header #primary-nav #topnav-tags-link .dropdown-menu .featured li a { padding: 0 16px; }\
					#ag3-header #primary-nav #topnav-tags-link .dropdown-menu .highlighted li a { width: 116px; }\
					#gamearea { display: flex; width: 1250px; transition: all, .4s cubic-bezier(0, 0, 0.08, 0.96); }\
					#gamefilearea { width: 1025px; margin-left: -16px; }\
					\
					\
					/* DotDX definitions */\
					#dotdxcontainer {\
						font-family: 'lato', Helvetica, sans-serif;\
						color: #fff;\
						background-color: #101010;\
						width: 220px;\
						border-radius: 0 15px 15px 0;\
						box-shadow: 0 0 12px -1px #000;\
						border: 1px solid #000;\
						background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAIAAADZSiLoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAAgSURBVBhXY1BUN1RUM2BmYmIAYgU1AwV1AwYgBnHUDQAq/ALhQv8cNAAAAABJRU5ErkJggg==');\
					}\
					#dotdxcontainer .menu {\
						font-size: 10pt;\
						background: -webkit-linear-gradient(top,rgba(0,0,0,0),rgba(0,0,0,0.35));\
						background: -moz-linear-gradient(top,rgba(0,0,0,0),rgba(0,0,0,0.35));\
						border-top-right-radius: 10px;\
						border-bottom: 1px solid rgba(255, 255, 255, 0.2);\
					}\
					#dotdxcontainer .menu span {\
						display: inline-block;\
						width: 48px;\
						margin: 3px 0 4px 2px;\
						text-align: center;\
						border: 1px solid transparent;\
						border-radius: 4px;\
						padding: 1px 0;\
						text-shadow: 0 0 3px rgba(255, 255, 255, 0.6);\
						transition: background .3s ease-out, color .2s ease-out;\
						cursor: pointer;\
					}\
					#dotdxcontainer .menu span:hover {\
						background-color: #ECC00E;\
						color: #000;\
						font-weight: bold;\
						padding: 1px 0;\
						border-radius: 3px;\
						box-shadow: 0 0 3px -1px #000;\
					}\
					#dotdxcontainer .menu span.active {\
						border-color: #ECC00E;\
						background-color: #ECC00E;\
						color: #000;\
						padding: 3px 0;\
						border-radius: 4px;\
						font-weight: bold;\
						box-shadow: inset 0 0 0 1px #000;\
					}\
					#dotdxcontainer .bg, #dotdxcontainer #dotdxInfoBar { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAIAAADZSiLoAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAAgSURBVBhXY1BUN1RUM2BmYmIAYgU1AwV1AwYgBnHUDQAq/ALhQv8cNAAAAABJRU5ErkJggg=='); }\
					#dotdxcontainer #dotdxContent { display: flex; height: 597px; }\
					#dotdxcontainer #dotdxInfoBar {\
						position: absolute;\
						width: 200px;\
						z-index: 3;\
						border: 0;\
						right: 241px;\
						max-width: 0;\
						transition: all .3s ease-out;\
						box-shadow: none;\
						border-radius: 7px 0 0 7px;\
						overflow: hidden;\
						font-size: 11px;\
						white-space: nowrap;\
					}\
					#dotdxcontainer #dotdxInfoBar.active {\
						border: 1px solid rgba(255, 255, 255, 0.25);\
						box-shadow: -3px 0 12px 3px rgb(0, 0, 0);\
						max-width: 200px;\
					}\
					#dotdxcontainer div.content {\
						overflow: hidden;\
						width: 0;\
						transition: width .5s cubic-bezier(0.1, 0.65, 0.35, 0.9);\
					}\
					#dotdxcontainer div.actions-menu {\
						padding: 4px 6px 6px;\
						border-top: 1px solid rgba(255, 255, 255, 0.2);\
						background: -webkit-linear-gradient(top,rgba(0,0,0,0.4),rgba(0, 0, 0, 0.3));\
						background: -moz-linear-gradient(top,rgba(0,0,0,0.4),rgba(0, 0, 0, 0.3));\
						border-bottom-right-radius: 14px;\
					}\
					#dotdxcontainer div.content.active {\
						width: 220px;\
					}\
					#dotdxcontainer div.full-width {\
						background-color: rgba(0, 0, 0, 0.35);\
						border-bottom: 1px solid rgba(255, 255, 255, 0.2);\
					}\
					#dotdxcontainer div.full-width.upload { border-bottom: 0; }\
					#dotdxcontainer div.full-width-bottom {\
						border-top: 1px solid rgba(255, 255, 255, 0.2);\
						font-size: 9pt;\
						font-style: italic;\
						padding: 0 5px 2px;\
						text-shadow: 0 0 4px rgba(255, 255, 255, 0.4);\
						text-align: center;\
						background: -webkit-linear-gradient(top,rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.4));\
						background: -moz-linear-gradient(top,rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.4));\
					}\
					#dotdxcontainer svg.icon {\
						display: inline-block;\
						width: 1em;\
						height: 1em;\
						fill: currentcolor;\
						transition: all .2s linear;\
					}\
					#dotdxcontainer .nowrap { white-space: nowrap; } \
					#dotdxcontainer span.form-text {\
						font-size: 12px;\
						display: inline-block;\
						position: relative;\
						top: 1px;\
						margin-left: 2px;\
					}\
					#dotdxcontainer svg.form-icon {\
						position: relative;\
						vertical-align: baseline;\
						z-index: 3;\
						top: 6px;\
						margin-left: 5px;\
						color: #C7A000;\
						font-size: 18px;\
					}\
					#dotdxcontainer svg.action-icon {\
						fill: #f0f0f0;\
						font-size: 18px;\
						cursor: pointer;\
					}\
					#dotdxcontainer svg.action-icon text { font: normal 12px 'lato' }\
					#dotdxcontainer svg.action-icon:hover {\
						fill: #C7A000;\
						-webkit-filter: drop-shadow(0 0 5px rgba(236, 192, 14, 0.5));\
						filter: drop-shadow(0 0 5px rgba(236, 192, 14, 0.5));\
					}\
					#dotdxcontainer input, #dotdxcontainer select {\
						font-family: 'lato', sans-serif;\
						font-size: 12px;\
						padding: 3px 2px 4px;\
						background-color: transparent;\
						box-shadow: none;\
						color: #fff;\
					}\
					#dotdxcontainer div.upload input {\
						padding-left: 6px;\
						color: #d0d0d0;\
					}\
					#dotdxcontainer input.full-width {\
						position: relative;\
						width: 188px;\
						border: 0;\
						margin: 0;\
						border-radius: 0;\
					}\
					#dotdxcontainer select.full-width {\
						border: 0;\
						height: auto;\
						line-height: inherit;\
						border-radius: 0;\
						margin: 0;\
						padding: 3px 0 4px;\
						-webkit-appearance: none;\
					}\
					#dotdxcontainer option {\
						background: #232A33;\
					}\
					#dotdxRaidsList {\
						overflow-y: auto;\
						overflow-x: hidden;\
					}\
					#dotdxRaidsList > div {\
						border-bottom: 1px solid rgba(255, 255, 255, 0.2);\
						font-size: 9pt;\
						display: flex;\
						cursor: pointer;\
						white-space: nowrap;\
					}\
					#dotdxRaidsList > div.nm:hover {\
						background: -webkit-linear-gradient(-85deg,rgba(69, 31, 105, 0.5),rgba(0, 0, 0, 0));\
						background: -moz-linear-gradient(-85deg,rgba(69, 31, 105, 0.5),rgba(0, 0, 0, 0));\
					}\
					#dotdxRaidsList > div.n:hover {\
						background: -webkit-linear-gradient(-85deg,rgba(47, 113, 35, 0.5),rgba(0, 0, 0, 0));\
						background: -moz-linear-gradient(-85deg,rgba(47, 113, 35, 0.5),rgba(0, 0, 0, 0));\
					}\
					#dotdxRaidsList > div.l:hover {\
						background: -webkit-linear-gradient(-85deg,rgba(111, 33, 33, 0.5),rgba(0, 0, 0, 0));\
						background: -moz-linear-gradient(-85deg,rgba(111, 33, 33, 0.5),rgba(0, 0, 0, 0));\
					}\
					#dotdxRaidsList > div.h:hover {\
						background: -webkit-linear-gradient(-85deg,rgba(97, 91, 29, 0.5),rgba(0, 0, 0, 0));\
						background: -moz-linear-gradient(-85deg,rgba(97, 91, 29, 0.5),rgba(0, 0, 0, 0));\
					}\
					#dotdxRaidsList > div .diff {\
						display: inline-block;\
						flex-shrink: 0;\
						margin-left: 6px;\
					}\
					#dotdxRaidsList > div.nm .diff { color: #CC30CC; }\
					#dotdxRaidsList > div.n .diff { color: #49DE49; }\
					#dotdxRaidsList > div.l .diff { color: #DE5959; }\
					#dotdxRaidsList > div.h .diff { color: #EAEA21; }\
					#dotdxRaidsList > div > a {\
						margin-right: auto;\
						margin-left: 5px;\
						overflow-x: hidden;\
						text-overflow: ellipsis;\
						color: #fff;\
					}\
					#dotdxRaidsList > div > a:hover {\
						text-shadow: 0 0 5px rgba(255, 255, 255, 0.9);\
					}\
					#dotdxcontainer svg.entry-icon {\
						fill: #E0E0E0;\
						position: relative;\
						vertical-align: baseline;\
						top: 3px;\
						font-size: 14px;\
						flex-shrink: 0;\
					}\
					#dotdxcontainer .status svg.entry-icon { top: 2px; }\
					#dotdxcontainer svg.entry-icon.del { margin-left: 5px; }\
					#dotdxcontainer svg.entry-icon.del:hover {\
						fill: #CC2A2A;\
						-webkit-filter: drop-shadow(0 0 2px rgba(204, 42, 42, 0.5));\
						filter: drop-shadow(0 0 2px rgba(204, 42, 42, 0.5));\
					}\
					#dotdxcontainer svg.entry-icon.reg:hover {\
						fill: #C7A000;\
						-webkit-filter: drop-shadow(0 0 2px rgba(236, 192, 14, 0.5));\
						filter: drop-shadow(0 0 2px rgba(236, 192, 14, 0.5));\
					}\
					#dotdxcontainer svg.entry-icon.visited { display: none; margin-left: 3px; }\
					#dotdxcontainer div.visited svg.entry-icon.visited { display: inline-block; }\
					#dotdxcontainer input[type='checkbox'] { display: none; }\
					#dotdxcontainer input[type='checkbox'] + label { margin: 0; white-space: nowrap; }\
					#dotdxcontainer input[type='checkbox'] + label svg.checkbox-icon {\
						margin: 0 2px 0 5px;\
						fill: #C7A000;\
						font-size: 15px;\
						cursor: pointer;\
					}\
					#dotdxcontainer input[type='checkbox'] + label svg.checkbox-icon use.checked {\
						opacity: 0;\
						transition: all .2s linear;\
					}\
					#dotdxcontainer input[type='checkbox']:checked + label svg.checkbox-icon use.checked { opacity: 1; }\
					#dotdxcontainer input[type='checkbox'] + label > span {\
						font-size: 9pt;\
						position: relative;\
						top: 1px;\
					}\
					#dotdxcontainer div.rollover {\
						cursor: pointer;\
					}\
					#dotdxcontainer div.rollover:hover {\
						background: -webkit-linear-gradient(93deg,rgba(202, 159, 36, 0.2),rgba(101, 84, 8, 0.14),rgba(0, 0, 0, 0));\
						background: -moz-linear-gradient(93deg,rgba(202, 159, 36, 0.2),rgba(101, 84, 8, 0.14),rgba(0, 0, 0, 0));\
					}\
					#dotdxcontainer div.rollover svg {\
						vertical-align: baseline;\
						position: relative;\
						top: 2px;\
						font-size: 16px;\
						margin: 2px 5px 1px 5px;\
						fill: #C7A000;\
					}\
					#dotdxcontainer div.rollover > span {\
						font-size: 10pt;\
						vertical-align: top;\
						display: inline-block;\
					}\
					#dotdxcontainer div.rollover-content {\
						overflow-y: auto;\
						overflow-x: hidden;\
						max-height: 0;\
						transition: all .35s linear;\
					}\
					#dotdxcontainer div.rollover.active + div.rollover-content {\
						border-bottom: 1px solid rgba(255, 255, 255, 0.2);\
					}\
					#dotdxcontainer div.rollover-content > div { display: flex; cursor: pointer }\
					#dotdxcontainer div.rollover-content > div > span {\
					  	margin: 0 auto 0 5px;\
						font-size: 9pt;\
						overflow-x: hidden;\
						text-overflow: ellipsis;\
						white-space: nowrap;\
					}\
					#dotdxcontainer div.rollover-content > div:hover { background-color: rgba(0, 0, 0, 0.6); }\
					#dotdxcontainer div.rollover-content > div > input[type='checkbox'] + label svg {\
						margin: 0 5px 0 0;\
						vertical-align: baseline;\
						position: relative;\
						top: 2px;\
						font-size: 14px;\
					}\
					#dotdxcontainer #dotdxFilterContent input[type='checkbox'] + label svg.checkbox-icon use { transition: all .3s cubic-bezier(0.45, 0.05, 0.55, 0.95); }\
					#dotdxcontainer div.rollover-content > div > input[type='checkbox'] + label:first-of-type svg { margin-left: 5px; }\
					#dotdxcontainer div.rollover-content > div:hover > input[type='checkbox'] + label:first-of-type svg { fill: #40CA3B; }\
					#dotdxcontainer div.rollover-content > div:hover > input[type='checkbox'] + label:nth-of-type(2) svg { fill: #CECE0E; }\
					#dotdxcontainer div.rollover-content > div:hover > input[type='checkbox'] + label:nth-of-type(3) svg { fill: #D84848; }\
					#dotdxcontainer div.rollover-content > div:hover > input[type='checkbox'] + label:nth-of-type(4) svg { fill: #AE03CC; }\
					#dotdxcontainer div.rollover-content > div:hover > input[type='checkbox'] + label:last-of-type svg { fill: #E0E0E0; }\
					#dotdxcontainer #dotdxOpts div.rollover-content label:last-of-type { padding-bottom: 4px; }\
					#dotdxcontainer #dotdxInfoBar > div {\
						background: -webkit-linear-gradient(top,rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.5));\
						background: -moz-linear-gradient(top,rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.5));\
						border-radius: 7px 0 0 7px;\
						padding: 4px 6px;\
					}\
					#dotdxcontainer #dotdxInfoBar div.magics {\
						width: 52px;\
						display:flex;\
						flex-wrap: wrap-reverse;\
						flex-direction: column;\
						height: 34px;\
						justify-content: space-between;\
						align-content: flex-start;\
					}\
					#dotdxcontainer #dotdxInfoBar div.title { display: flex; }\
					#dotdxcontainer #dotdxInfoBar div.title > div:first-child { margin-right: auto; }\
					#dotdxcontainer #dotdxInfoBar div.title > div:first-child > div:nth-child(1) { font-size: 14px; font-weight: bold; line-height: 16px; }\
					#dotdxcontainer #dotdxInfoBar div.title > div:first-child > div:nth-child(2) { line-height: 20px; font-size: 12px; }\
					#dotdxcontainer #dotdxInfoBar div.magics > div {\
						flex-grow: 0;\
						flex-shrink: 0;\
						background-position: 0 0;\
						height: 16px;\
						width: 16px;\
						background-color: rgba(255, 255, 255, 0.3);\
						margin-left: 2px;\
					}\
					#dotdxcontainer #dotdxInfoBar div.magics > div { background-image: url('http://mutik.erley.org/img/16.png?"+(new Date().getTime())+"'); }\
					#dotdxcontainer #dotdxInfoBar div.info {\
						margin-top: 2px;\
						padding-top: 2px;\
						border-top: 1px solid rgba(255, 255, 255, 0.3);\
					}\
					#dotdxcontainer #dotdxInfoBar div.info > div { line-height: 18px; }\
					#dotdxcontainer #dotdxInfoBar div.info > div:nth-child(5) { display: flex; }\
					#dotdxcontainer #dotdxInfoBar div.info > div:nth-child(5) > div { flex-grow: 1; }\
					" + consistencyFixes).attach('to', document.head);

					DotDX.c('style').set({type: "text/css", id: "dotdxArmorLayoutCSS"}).attach('to', document.head);
					DotDX.gui.setArmorLayout();

					DotDX.c('div').set({ id:'dotdxcontainer' }).html('<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\
					<symbol id="dotdx-stack-icon" viewBox="0 0 1024 1024">\
					<title>stack</title>\
					<path class="path1" d="M1024 320l-512-256-512 256 512 256 512-256zM512 148.97l342.058 171.030-342.058 171.030-342.058-171.030 342.058-171.030zM921.444 460.722l102.556 51.278-512 256-512-256 102.556-51.278 409.444 204.722zM921.444 652.722l102.556 51.278-512 256-512-256 102.556-51.278 409.444 204.722z"></path>\
					</symbol>\
					<symbol id="dotdx-location-icon" viewBox="0 0 1024 1024">\
					<title>location</title>\
					<path class="path1" d="M512 0c-176.732 0-320 143.268-320 320 0 320 320 704 320 704s320-384 320-704c0-176.732-143.27-320-320-320zM512 512c-106.040 0-192-85.96-192-192s85.96-192 192-192 192 85.96 192 192-85.96 192-192 192z"></path>\
					</symbol>\
					<symbol id="dotdx-clock-icon" viewBox="0 0 1024 1024">\
					<title>clock</title>\
					<path class="path1" d="M658.744 749.256l-210.744-210.746v-282.51h128v229.49l173.256 173.254zM512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 896c-212.078 0-384-171.922-384-384s171.922-384 384-384c212.078 0 384 171.922 384 384s-171.922 384-384 384z"></path>\
					</symbol>\
					<symbol id="dotdx-drawer-icon" viewBox="0 0 1024 1024">\
					<title>drawer</title>\
					<path class="path1" d="M1016.988 652.010l-256-320c-6.074-7.592-15.266-12.010-24.988-12.010h-448c-9.72 0-18.916 4.418-24.988 12.010l-256 320c-4.538 5.674-7.012 12.724-7.012 19.99v288c0 35.346 28.654 64 64 64h896c35.348 0 64-28.654 64-64v-288c0-7.266-2.472-14.316-7.012-19.99zM960 704h-224l-128 128h-192l-128-128h-224v-20.776l239.38-299.224h417.24l239.38 299.224v20.776z"></path>\
					<path class="path2" d="M736 512h-448c-17.672 0-32-14.328-32-32s14.328-32 32-32h448c17.674 0 32 14.328 32 32s-14.326 32-32 32z"></path>\
					<path class="path3" d="M800 640h-576c-17.672 0-32-14.326-32-32s14.328-32 32-32h576c17.674 0 32 14.326 32 32s-14.326 32-32 32z"></path>\
					</symbol>\
					<symbol id="dotdx-database-icon" viewBox="0 0 1024 1024">\
					<title>database</title>\
					<path class="path1" d="M512 0c-282.77 0-512 71.634-512 160v128c0 88.366 229.23 160 512 160s512-71.634 512-160v-128c0-88.366-229.23-160-512-160z"></path>\
					<path class="path2" d="M512 544c-282.77 0-512-71.634-512-160v192c0 88.366 229.23 160 512 160s512-71.634 512-160v-192c0 88.366-229.23 160-512 160z"></path>\
					<path class="path3" d="M512 832c-282.77 0-512-71.634-512-160v192c0 88.366 229.23 160 512 160s512-71.634 512-160v-192c0 88.366-229.23 160-512 160z"></path>\
					</symbol>\
					<symbol id="dotdx-spinner11-icon" viewBox="0 0 1024 1024">\
					<title>spinner11</title>\
					<path class="path1" d="M1024 384h-384l143.53-143.53c-72.53-72.526-168.96-112.47-271.53-112.47s-199 39.944-271.53 112.47c-72.526 72.53-112.47 168.96-112.47 271.53s39.944 199 112.47 271.53c72.53 72.526 168.96 112.47 271.53 112.47s199-39.944 271.528-112.472c6.056-6.054 11.86-12.292 17.456-18.668l96.32 84.282c-93.846 107.166-231.664 174.858-385.304 174.858-282.77 0-512-229.23-512-512s229.23-512 512-512c141.386 0 269.368 57.326 362.016 149.984l149.984-149.984v384z"></path>\
					</symbol>\
					<symbol id="dotdx-cog-icon" viewBox="0 0 1024 1024">\
					<title>cog</title>\
					<path class="path1" d="M933.79 610.25c-53.726-93.054-21.416-212.304 72.152-266.488l-100.626-174.292c-28.75 16.854-62.176 26.518-97.846 26.518-107.536 0-194.708-87.746-194.708-195.99h-201.258c0.266 33.41-8.074 67.282-25.958 98.252-53.724 93.056-173.156 124.702-266.862 70.758l-100.624 174.292c28.97 16.472 54.050 40.588 71.886 71.478 53.638 92.908 21.512 211.92-71.708 266.224l100.626 174.292c28.65-16.696 61.916-26.254 97.4-26.254 107.196 0 194.144 87.192 194.7 194.958h201.254c-0.086-33.074 8.272-66.57 25.966-97.218 53.636-92.906 172.776-124.594 266.414-71.012l100.626-174.29c-28.78-16.466-53.692-40.498-71.434-71.228zM512 719.332c-114.508 0-207.336-92.824-207.336-207.334 0-114.508 92.826-207.334 207.336-207.334 114.508 0 207.332 92.826 207.332 207.334-0.002 114.51-92.824 207.334-207.332 207.334z"></path>\
					</symbol>\
					<symbol id="dotdx-cogs-icon" viewBox="0 0 1024 1024">\
					<title>cogs</title>\
					<path class="path1" d="M363.722 722.052l41.298-57.816-45.254-45.256-57.818 41.296c-10.722-5.994-22.204-10.774-34.266-14.192l-11.682-70.084h-64l-11.68 70.086c-12.062 3.418-23.544 8.198-34.266 14.192l-57.818-41.298-45.256 45.256 41.298 57.816c-5.994 10.72-10.774 22.206-14.192 34.266l-70.086 11.682v64l70.086 11.682c3.418 12.060 8.198 23.544 14.192 34.266l-41.298 57.816 45.254 45.256 57.818-41.296c10.722 5.994 22.204 10.774 34.266 14.192l11.682 70.084h64l11.68-70.086c12.062-3.418 23.544-8.198 34.266-14.192l57.818 41.296 45.254-45.256-41.298-57.816c5.994-10.72 10.774-22.206 14.192-34.266l70.088-11.68v-64l-70.086-11.682c-3.418-12.060-8.198-23.544-14.192-34.266zM224 864c-35.348 0-64-28.654-64-64s28.652-64 64-64 64 28.654 64 64-28.652 64-64 64zM1024 384v-64l-67.382-12.25c-1.242-8.046-2.832-15.978-4.724-23.79l57.558-37.1-24.492-59.128-66.944 14.468c-4.214-6.91-8.726-13.62-13.492-20.13l39.006-56.342-45.256-45.254-56.342 39.006c-6.512-4.766-13.22-9.276-20.13-13.494l14.468-66.944-59.128-24.494-37.1 57.558c-7.812-1.892-15.744-3.482-23.79-4.724l-12.252-67.382h-64l-12.252 67.382c-8.046 1.242-15.976 2.832-23.79 4.724l-37.098-57.558-59.128 24.492 14.468 66.944c-6.91 4.216-13.62 8.728-20.13 13.494l-56.342-39.006-45.254 45.254 39.006 56.342c-4.766 6.51-9.278 13.22-13.494 20.13l-66.944-14.468-24.492 59.128 57.558 37.1c-1.892 7.812-3.482 15.742-4.724 23.79l-67.384 12.252v64l67.382 12.25c1.242 8.046 2.832 15.978 4.724 23.79l-57.558 37.1 24.492 59.128 66.944-14.468c4.216 6.91 8.728 13.618 13.494 20.13l-39.006 56.342 45.254 45.256 56.342-39.006c6.51 4.766 13.22 9.276 20.13 13.492l-14.468 66.944 59.128 24.492 37.102-57.558c7.81 1.892 15.742 3.482 23.788 4.724l12.252 67.384h64l12.252-67.382c8.044-1.242 15.976-2.832 23.79-4.724l37.1 57.558 59.128-24.492-14.468-66.944c6.91-4.216 13.62-8.726 20.13-13.492l56.342 39.006 45.256-45.256-39.006-56.342c4.766-6.512 9.276-13.22 13.492-20.13l66.944 14.468 24.492-59.13-57.558-37.1c1.892-7.812 3.482-15.742 4.724-23.79l67.382-12.25zM672 491.2c-76.878 0-139.2-62.322-139.2-139.2s62.32-139.2 139.2-139.2 139.2 62.322 139.2 139.2c0 76.878-62.32 139.2-139.2 139.2z"></path>\
					</symbol>\
					<symbol id="dotdx-bin2-icon" viewBox="0 0 1024 1024">\
					<title>bin2</title>\
					<path class="path1" d="M192 1024h640l64-704h-768zM640 128v-128h-256v128h-320v192l64-64h768l64 64v-192h-320zM576 128h-128v-64h128v64z"></path>\
					</symbol>\
					<symbol id="dotdx-target-icon" viewBox="0 0 1024 1024">\
					<title>target</title>\
					<path class="path1" d="M1024 448h-100.924c-27.64-178.24-168.836-319.436-347.076-347.076v-100.924h-128v100.924c-178.24 27.64-319.436 168.836-347.076 347.076h-100.924v128h100.924c27.64 178.24 168.836 319.436 347.076 347.076v100.924h128v-100.924c178.24-27.64 319.436-168.836 347.076-347.076h100.924v-128zM792.822 448h-99.762c-19.284-54.55-62.51-97.778-117.060-117.060v-99.762c107.514 24.49 192.332 109.31 216.822 216.822zM512 576c-35.346 0-64-28.654-64-64s28.654-64 64-64c35.346 0 64 28.654 64 64s-28.654 64-64 64zM448 231.178v99.762c-54.55 19.282-97.778 62.51-117.060 117.060h-99.762c24.49-107.512 109.31-192.332 216.822-216.822zM231.178 576h99.762c19.282 54.55 62.51 97.778 117.060 117.060v99.762c-107.512-24.49-192.332-109.308-216.822-216.822zM576 792.822v-99.762c54.55-19.284 97.778-62.51 117.060-117.060h99.762c-24.49 107.514-109.308 192.332-216.822 216.822z"></path>\
					</symbol>\
					<symbol id="dotdx-power-icon" viewBox="0 0 1024 1024">\
					<title>power</title>\
					<path class="path1" d="M384 0l-384 512h384l-256 512 896-640h-512l384-384z"></path>\
					</symbol>\
					<symbol id="dotdx-download2-icon" viewBox="0 0 1024 1024">\
					<title>download2</title>\
					<path class="path1" d="M896 512h-160l-224 224-224-224h-160l-128 256v64h1024v-64l-128-256zM0 896h1024v64h-1024v-64zM576 320v-256h-128v256h-224l288 288 288-288h-224z"></path>\
					</symbol>\
					<symbol id="dotdx-upload2-icon" viewBox="0 0 1024 1024">\
					<title>upload2</title>\
					<path class="path1" d="M0 896h1024v64h-1024zM1024 768v64h-1024v-64l128-256h256v128h256v-128h256zM224 320l288-288 288 288h-224v256h-128v-256z"></path>\
					</symbol>\
					<symbol id="dotdx-flag-icon" viewBox="0 0 1024 1024">\
					<title>flag</title>\
					<path class="path1" d="M0 0h128v1024h-128v-1024z"></path>\
					<path class="path2" d="M832 643.002c82.624 0 154.57-19.984 192-49.5v-512c-37.43 29.518-109.376 49.502-192 49.502s-154.57-19.984-192-49.502v512c37.43 29.516 109.376 49.5 192 49.5z"></path>\
					<path class="path3" d="M608 32.528c-46.906-19.94-115.52-32.528-192-32.528-96.396 0-180.334 19.984-224 49.502v512c43.666-29.518 127.604-49.502 224-49.502 76.48 0 145.094 12.588 192 32.528v-512z"></path>\
					</symbol>\
					<symbol id="dotdx-notification-icon" viewBox="0 0 1024 1024">\
					<title>notification</title>\
					<path class="path1" d="M512 96c-111.118 0-215.584 43.272-294.156 121.844s-121.844 183.038-121.844 294.156c0 111.118 43.272 215.584 121.844 294.156s183.038 121.844 294.156 121.844c111.118 0 215.584-43.272 294.156-121.844s121.844-183.038 121.844-294.156c0-111.118-43.272-215.584-121.844-294.156s-183.038-121.844-294.156-121.844zM512 0v0c282.77 0 512 229.23 512 512s-229.23 512-512 512c-282.77 0-512-229.23-512-512s229.23-512 512-512zM448 704h128v128h-128zM448 192h128v384h-128z"></path>\
					</symbol>\
					<symbol id="dotdx-info-icon" viewBox="0 0 1024 1024">\
					<title>info</title>\
					<path class="path1" d="M448 304c0-26.4 21.6-48 48-48h32c26.4 0 48 21.6 48 48v32c0 26.4-21.6 48-48 48h-32c-26.4 0-48-21.6-48-48v-32z"></path>\
					<path class="path2" d="M640 768h-256v-64h64v-192h-64v-64h192v256h64z"></path>\
					<path class="path3" d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 928c-229.75 0-416-186.25-416-416s186.25-416 416-416 416 186.25 416 416-186.25 416-416 416z"></path>\
					</symbol>\
					<symbol id="dotdx-cancel-circle-icon" viewBox="0 0 1024 1024">\
					<title>cancel-circle</title>\
					<path class="path1" d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 928c-229.75 0-416-186.25-416-416s186.25-416 416-416 416 186.25 416 416-186.25 416-416 416z"></path>\
					<path class="path2" d="M672 256l-160 160-160-160-96 96 160 160-160 160 96 96 160-160 160 160 96-96-160-160 160-160z"></path>\
					</symbol>\
					<symbol id="dotdx-cross-icon" viewBox="0 0 1024 1024">\
					<title>cross</title>\
					<path class="path1" d="M1014.662 822.66c-0.004-0.004-0.008-0.008-0.012-0.010l-310.644-310.65 310.644-310.65c0.004-0.004 0.008-0.006 0.012-0.010 3.344-3.346 5.762-7.254 7.312-11.416 4.246-11.376 1.824-24.682-7.324-33.83l-146.746-146.746c-9.148-9.146-22.45-11.566-33.828-7.32-4.16 1.55-8.070 3.968-11.418 7.31 0 0.004-0.004 0.006-0.008 0.010l-310.648 310.652-310.648-310.65c-0.004-0.004-0.006-0.006-0.010-0.010-3.346-3.342-7.254-5.76-11.414-7.31-11.38-4.248-24.682-1.826-33.83 7.32l-146.748 146.748c-9.148 9.148-11.568 22.452-7.322 33.828 1.552 4.16 3.97 8.072 7.312 11.416 0.004 0.002 0.006 0.006 0.010 0.010l310.65 310.648-310.65 310.652c-0.002 0.004-0.006 0.006-0.008 0.010-3.342 3.346-5.76 7.254-7.314 11.414-4.248 11.376-1.826 24.682 7.322 33.83l146.748 146.746c9.15 9.148 22.452 11.568 33.83 7.322 4.16-1.552 8.070-3.97 11.416-7.312 0.002-0.004 0.006-0.006 0.010-0.010l310.648-310.65 310.648 310.65c0.004 0.002 0.008 0.006 0.012 0.008 3.348 3.344 7.254 5.762 11.414 7.314 11.378 4.246 24.684 1.826 33.828-7.322l146.746-146.748c9.148-9.148 11.57-22.454 7.324-33.83-1.552-4.16-3.97-8.068-7.314-11.414z"></path>\
					</symbol>\
					<symbol id="dotdx-loop2-icon" viewBox="0 0 1024 1024">\
					<title>loop2</title>\
					<path class="path1" d="M889.68 166.32c-93.608-102.216-228.154-166.32-377.68-166.32-282.77 0-512 229.23-512 512h96c0-229.75 186.25-416 416-416 123.020 0 233.542 53.418 309.696 138.306l-149.696 149.694h352v-352l-134.32 134.32z"></path>\
					<path class="path2" d="M928 512c0 229.75-186.25 416-416 416-123.020 0-233.542-53.418-309.694-138.306l149.694-149.694h-352v352l134.32-134.32c93.608 102.216 228.154 166.32 377.68 166.32 282.77 0 512-229.23 512-512h-96z"></path>\
					</symbol>\
					<symbol id="dotdx-sort-alpha-asc-icon" viewBox="0 0 1024 1024">\
					<title>sort-alpha-asc</title>\
					<path class="path1" d="M320 768v-768h-128v768h-160l224 224 224-224h-160z"></path>\
					<path class="path2" d="M928 1024h-256c-11.8 0-22.644-6.496-28.214-16.9-5.566-10.404-4.958-23.030 1.59-32.85l222.832-334.25h-196.208c-17.672 0-32-14.328-32-32s14.328-32 32-32h256c11.8 0 22.644 6.496 28.214 16.9 5.566 10.404 4.958 23.030-1.59 32.85l-222.83 334.25h196.206c17.672 0 32 14.328 32 32s-14.328 32-32 32z"></path>\
					<path class="path3" d="M1020.622 401.686l-192.002-384c-5.42-10.842-16.502-17.69-28.622-17.69-12.122 0-23.202 6.848-28.624 17.69l-191.996 384c-7.904 15.806-1.496 35.030 14.31 42.932 4.594 2.296 9.476 3.386 14.288 3.386 11.736 0 23.040-6.484 28.644-17.698l55.156-110.31h216.446l55.156 110.31c7.902 15.806 27.124 22.21 42.932 14.31 15.808-7.902 22.216-27.124 14.312-42.93zM723.778 255.996l76.22-152.446 76.224 152.446h-152.444z"></path>\
					</symbol>\
					<symbol id="dotdx-sort-alpha-desc-icon" viewBox="0 0 1024 1024">\
					<title>sort-alpha-desc</title>\
					<path class="path1" d="M320 768v-768h-128v768h-160l224 224 224-224h-160z"></path>\
					<path class="path2" d="M928 448h-256c-11.8 0-22.644-6.496-28.214-16.9-5.566-10.406-4.958-23.030 1.59-32.85l222.832-334.25h-196.208c-17.672 0-32-14.328-32-32s14.328-32 32-32h256c11.8 0 22.644 6.496 28.214 16.9 5.566 10.406 4.958 23.030-1.59 32.85l-222.83 334.25h196.206c17.672 0 32 14.328 32 32s-14.328 32-32 32z"></path>\
					<path class="path3" d="M1020.622 977.69l-192.002-384c-5.42-10.842-16.502-17.69-28.622-17.69-12.122 0-23.202 6.848-28.624 17.69l-191.996 384c-7.904 15.806-1.496 35.030 14.31 42.932 4.594 2.296 9.476 3.386 14.288 3.386 11.736 0 23.040-6.484 28.644-17.698l55.158-110.31h216.446l55.156 110.31c7.902 15.806 27.124 22.21 42.932 14.31 15.806-7.902 22.214-27.124 14.31-42.93zM723.778 832l76.22-152.446 76.226 152.446h-152.446z"></path>\
					</symbol>\
					<symbol id="dotdx-sort-amount-asc-icon" viewBox="0 0 1024 1024">\
					<title>sort-amount-asc</title>\
					<path class="path1" d="M320 768v-768h-128v768h-160l224 224 224-224h-160z"></path>\
					<path class="path2" d="M448 576h576v128h-576v-128z"></path>\
					<path class="path3" d="M448 384h448v128h-448v-128z"></path>\
					<path class="path4" d="M448 192h320v128h-320v-128z"></path>\
					<path class="path5" d="M448 0h192v128h-192v-128z"></path>\
					</symbol>\
					<symbol id="dotdx-sort-amount-desc-icon" viewBox="0 0 1024 1024">\
					<title>sort-amount-desc</title>\
					<path class="path1" d="M320 768v-768h-128v768h-160l224 224 224-224h-160z"></path>\
					<path class="path2" d="M448 0h576v128h-576v-128z"></path>\
					<path class="path3" d="M448 192h448v128h-448v-128z"></path>\
					<path class="path4" d="M448 384h320v128h-320v-128z"></path>\
					<path class="path5" d="M448 576h192v128h-192v-128z"></path>\
					</symbol>\
					<symbol id="dotdx-checkbox-checked-icon" viewBox="0 0 1024 1024">\
					<title>checkbox-checked</title>\
					<path class="path1" d="M896 0h-768c-70.4 0-128 57.6-128 128v768c0 70.4 57.6 128 128 128h768c70.4 0 128-57.6 128-128v-768c0-70.4-57.6-128-128-128zM448 794.51l-237.254-237.256 90.51-90.508 146.744 146.744 306.746-306.746 90.508 90.51-397.254 397.256z"></path>\
					</symbol>\
					<symbol id="dotdx-checkbox-unchecked-icon" viewBox="0 0 1024 1024">\
					<title>checkbox-unchecked</title>\
					<path class="path1" d="M896 0h-768c-70.4 0-128 57.6-128 128v768c0 70.4 57.6 128 128 128h768c70.4 0 128-57.6 128-128v-768c0-70.4-57.6-128-128-128zM896 896h-768v-768h768v768z"></path>\
					</symbol>\
					<symbol id="dotdx-radio-checked2-icon" viewBox="0 0 1024 1024">\
					<title>radio-checked2</title>\
					<path class="path1" d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 640c-70.692 0-128-57.306-128-128 0-70.692 57.308-128 128-128 70.694 0 128 57.308 128 128 0 70.694-57.306 128-128 128z"></path>\
					</symbol>\
					<symbol id="dotdx-radio-unchecked-icon" viewBox="0 0 1024 1024">\
					<title>radio-unchecked</title>\
					<path class="path1" d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 896c-212.078 0-384-171.922-384-384s171.922-384 384-384c212.078 0 384 171.922 384 384s-171.922 384-384 384z"></path>\
					</symbol>\
					<symbol id="dotdx-filter-icon" viewBox="0 0 1024 1024">\
					<title>filter</title>\
					<path class="path1" d="M512 0c-282.77 0-512 71.634-512 160v96l384 384v320c0 35.346 57.306 64 128 64 70.692 0 128-28.654 128-64v-320l384-384v-96c0-88.366-229.23-160-512-160zM94.384 138.824c23.944-13.658 57.582-26.62 97.278-37.488 87.944-24.076 201.708-37.336 320.338-37.336 118.628 0 232.394 13.26 320.338 37.336 39.696 10.868 73.334 23.83 97.28 37.488 15.792 9.006 24.324 16.624 28.296 21.176-3.972 4.552-12.506 12.168-28.296 21.176-23.946 13.658-57.584 26.62-97.28 37.488-87.942 24.076-201.708 37.336-320.338 37.336s-232.394-13.26-320.338-37.336c-39.696-10.868-73.334-23.83-97.278-37.488-15.792-9.008-24.324-16.624-28.298-21.176 3.974-4.552 12.506-12.168 28.298-21.176z"></path>\
					</symbol>\
					<symbol id="dotdx-search-icon" viewBox="0 0 1024 1024">\
					<title>search</title>\
					<path class="path1" d="M992.262 871.396l-242.552-206.294c-25.074-22.566-51.89-32.926-73.552-31.926 57.256-67.068 91.842-154.078 91.842-249.176 0-212.078-171.922-384-384-384-212.076 0-384 171.922-384 384s171.922 384 384 384c95.098 0 182.108-34.586 249.176-91.844-1 21.662 9.36 48.478 31.926 73.552l206.294 242.552c35.322 39.246 93.022 42.554 128.22 7.356s31.892-92.898-7.354-128.22zM384 640c-141.384 0-256-114.616-256-256s114.616-256 256-256 256 114.616 256 256-114.614 256-256 256z"></path>\
					</symbol>\
					<symbol id="dotdx-swords-icon" viewBox="0 0 225 225">\
					<title>swords</title>\
					<path class="path1" d="M224.973 0 185.839 10.85 52.041 157.022 41.249 146.247l-10.607 10.607 9.192 9.192-23.688 23.688-4.567-4.567-10.607 10.607 4.658 4.658-5.392 5.392 19.388 19.388 5.392-5.392 4.939 4.939 10.607-10.607-4.973-4.973 23.688-23.688 9.723 9.723 10.607-10.607L 68.304 173.285 214.1 39.156 224.973 0z"></path>\
					<path class="path2" d="M0 0.239 10.85 39.373 157.022 173.171l-10.775 10.792 10.607 10.607 9.192-9.192 23.688 23.688-4.567 4.567 10.607 10.607 4.658-4.658 5.392 5.392 19.388-19.388-5.392-5.392 4.939-4.939-10.607-10.607-4.973 4.973-23.688-23.688 9.723-9.723-10.607-10.607-11.322 11.305L39.156 11.111 0 0.239z"></path>\
					</symbol>\
					<symbol id="dotdx-circle-up-icon" viewBox="0 0 1024 1024">\
					<title>circle-up</title>\
					<path class="path1" d="M0 512c0 282.77 229.23 512 512 512s512-229.23 512-512-229.23-512-512-512-512 229.23-512 512zM928 512c0 229.75-186.25 416-416 416s-416-186.25-416-416 186.25-416 416-416 416 186.25 416 416z"></path>\
					<path class="path2" d="M706.744 669.256l90.512-90.512-285.256-285.254-285.254 285.256 90.508 90.508 194.746-194.744z"></path>\
					</symbol>\
					<symbol id="dotdx-circle-down-icon" viewBox="0 0 1024 1024">\
					<title>circle-down</title>\
					<path class="path1" d="M1024 512c0-282.77-229.23-512-512-512s-512 229.23-512 512 229.23 512 512 512 512-229.23 512-512zM96 512c0-229.75 186.25-416 416-416s416 186.25 416 416-186.25 416-416 416-416-186.25-416-416z"></path>\
					<path class="path2" d="M317.256 354.744l-90.512 90.512 285.256 285.254 285.254-285.256-90.508-90.508-194.746 194.744z"></path>\
					</symbol>\
					<symbol id="dotdx-link-icon" viewBox="0 0 1024 1024">\
					<title>link</title>\
					<path class="path1" d="M440.236 635.766c-13.31 0-26.616-5.076-36.77-15.23-95.134-95.136-95.134-249.934 0-345.070l192-192c46.088-46.086 107.36-71.466 172.534-71.466s126.448 25.38 172.536 71.464c95.132 95.136 95.132 249.934 0 345.070l-87.766 87.766c-20.308 20.308-53.23 20.308-73.54 0-20.306-20.306-20.306-53.232 0-73.54l87.766-87.766c54.584-54.586 54.584-143.404 0-197.99-26.442-26.442-61.6-41.004-98.996-41.004s-72.552 14.562-98.996 41.006l-192 191.998c-54.586 54.586-54.586 143.406 0 197.992 20.308 20.306 20.306 53.232 0 73.54-10.15 10.152-23.462 15.23-36.768 15.23z"></path>\
					<path class="path2" d="M256 1012c-65.176 0-126.45-25.38-172.534-71.464-95.134-95.136-95.134-249.934 0-345.070l87.764-87.764c20.308-20.306 53.234-20.306 73.54 0 20.308 20.306 20.308 53.232 0 73.54l-87.764 87.764c-54.586 54.586-54.586 143.406 0 197.992 26.44 26.44 61.598 41.002 98.994 41.002s72.552-14.562 98.998-41.006l192-191.998c54.584-54.586 54.584-143.406 0-197.992-20.308-20.308-20.306-53.232 0-73.54 20.306-20.306 53.232-20.306 73.54 0.002 95.132 95.134 95.132 249.932 0.002 345.068l-192.002 192c-46.090 46.088-107.364 71.466-172.538 71.466z"></path>\
					</symbol>\
					</svg>\
					<div id="dotdxMenu" class="menu">\
						<span class="active">Raids</span>\
						<span>Filter</span>\
						<span>Utils</span>\
						<span style="border-top-right-radius: 12px;">Opts</span>\
					</div>\
					<div id="dotdxContent">\
						<div id="dotdxRaids" class="content active">\
							<div class="nowrap full-width">\
								<svg class="icon form-icon"><use xlink:href="#dotdx-search-icon"></use></svg>\
								<input type="text" id="dotdxRaidsSearch" class="full-width" value="">\
							</div>\
							<div class="nowrap full-width">\
								<svg class="icon form-icon"><use xlink:href="#dotdx-stack-icon"></use></svg>\
								<span class="form-text">Sort by:</span>\
								<select id="dotdxRaidsSort" class="full-width" style="width: 110px;">\
									<option value="0">raid name</option>\
									<option value="1">raid size</option>\
									<option value="2">time left</option>\
									<option value="3">time left %</option>\
									<option value="4">health left</option>\
									<option value="5" selected>health left %</option>\
								</select>\
								<svg class="icon form-icon"><use id="dotdxRaidsSortOrder" xlink:href="#dotdx-sort-amount-asc-icon"></use></svg>\
							</div>\
							<div id="dotdxRaidsList"></div>\
						</div>\
						<div id="dotdxFilter" class="content">\
							<div class="nowrap full-width">\
								<input type="checkbox" id="dotdxFilterDisableFilters">\
									<label for="dotdxFilterDisableFilters" style="padding-top: 3px;"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg>\
									<span>Disable raid filters (bypass)</span></label>\
								<input type="checkbox" id="dotdxFilterIncludeVisited">\
									<label for="dotdxFilterIncludeVisited"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg>\
									<span>Include already visited (joined) raids</span></label>\
								<input type="checkbox" id="dotdxFilterExcludeFull">\
									<label for="dotdxFilterExcludeFull" style="padding-bottom: 6px;"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg>\
									<span>Exclude full raids from joining</span></label>\
							</div>\
							<div id="dotdxFilterContent">\
								<div class="nowrap full-width rollover"><svg class="icon"><use xlink:href="#dotdx-circle-down-icon"></use></svg><span>Small Raids</span></div>\
								<div class="rollover-content" id="dotdxFilterSmall"></div>\
								<div class="nowrap full-width rollover"><svg class="icon"><use xlink:href="#dotdx-circle-down-icon"></use></svg><span>Medium Raids</span></div>\
								<div class="rollover-content" id="dotdxFilterMedium"></div>\
								<div class="nowrap full-width rollover"><svg class="icon"><use xlink:href="#dotdx-circle-down-icon"></use></svg><span>Large Raids</span></div>\
								<div class="rollover-content" id="dotdxFilterLarge"></div>\
								<div class="nowrap full-width rollover"><svg class="icon"><use xlink:href="#dotdx-circle-down-icon"></use></svg><span>Epic Raids</span></div>\
								<div class="rollover-content" id="dotdxFilterEpic"></div>\
								<div class="nowrap full-width rollover"><svg class="icon"><use xlink:href="#dotdx-circle-down-icon"></use></svg><span>Colossal Raids</span></div>\
								<div class="rollover-content" id="dotdxFilterColossal"></div>\
								<div class="nowrap full-width rollover"><svg class="icon"><use xlink:href="#dotdx-circle-down-icon"></use></svg><span>Gigantic Raids</span></div>\
								<div class="rollover-content" id="dotdxFilterGigantic"></div>\
							</div>\
						</div>\
						<div id="dotdxUtils" class="content">\
							<div class="nowrap full-width rollover"><svg class="icon"><use xlink:href="#dotdx-circle-down-icon"></use></svg><span>Raid submission</span></div>\
							<div class="rollover-content">\
								<div class="nowrap full-width upload">\
								<svg class="icon form-icon" onclick="DotDX.request.upload()" style="top:4px"><use xlink:href="#dotdx-upload2-icon"></use></svg>\
								<input type="text" id="dotdxRaidsUpload" class="full-width" value="Paste raid url here then click icon" onClick="this.select();">\
								</div>\
							</div>\
						</div>\
						<div id="dotdxOpts" class="content">\
							<div class="nowrap full-width rollover"><svg class="icon"><use xlink:href="#dotdx-circle-down-icon"></use></svg><span>AG Interface</span></div>\
							<div class="rollover-content">\
								<input type="checkbox" id="dotdxOptsHideBanner">\
									<label for="dotdxOptsHideBanner"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg>\
									<span>Hide Armor banner and menus</span></label>\
								<input type="checkbox" id="dotdxOptsHideTitle">\
									<label for="dotdxOptsHideTitle"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg>\
									<span>Hide game title bar</span></label>\
								<input type="checkbox" id="dotdxOptsHideContent">\
									<label for="dotdxOptsHideContent"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg>\
									<span>Hide content below game</span></label>\
								<input type="checkbox" id="dotdxOptsHideFooter">\
									<label for="dotdxOptsHideFooter"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg>\
									<span>Hide footer</span></label>\
							</div>\
							<div class="nowrap full-width rollover"><svg class="icon"><use xlink:href="#dotdx-circle-down-icon"></use></svg><span>Server mode</span></div>\
							<div class="rollover-content">\
								<input type="checkbox" id="dotdxOptsPlayKasan">\
									<label for="dotdxOptsPlayKasan"><svg class="icon checkbox-icon"><use xlink:href="#dotdx-checkbox-unchecked-icon"></use><use class="checked" xlink:href="#dotdx-checkbox-checked-icon"></use></svg>\
									<span>Use World Server (Kasan) mode</span></label>\
							</div>\
							<div class="nowrap full-width rollover"><svg class="icon"><use xlink:href="#dotdx-circle-down-icon"></use></svg><span>Maintenance</span></div>\
							<div class="rollover-content">\
								<div></div>\
							</div>\
						</div>\
					</div>\
					<div id="dotdxInfoBar" class="" style="top: 94px;"></div>\
					<div id="dotdxStatusBar" class="nowrap full-width-bottom"></div>\
					<div id="dotdxActionsMenu" class="nowrap actions-menu">\
						<svg class="icon action-icon" style="width: 57px" onclick="DotDX.gui.joinSelectedRaids()"><use xlink:href="#dotdx-swords-icon" x="-18"></use><text x="25" y="13">Join</text></svg>\
						<svg class="icon action-icon" style="width: 72px" onclick="DotDX.request.raids(false,0)"><use xlink:href="#dotdx-database-icon" x="-26"></use><text x="25" y="13">Import</text></svg>\
						<svg class="icon action-icon" style="width: 68px" onclick="DotDX.reload()"><use xlink:href="#dotdx-loop2-icon" x="-24"></use><text x="25" y="13">Reload</text></svg>\
					</div>', true).attach('after','gamefilearea');

					DotDX.gui.createFilterTab();

					var i, group, numEl;

					/*\
					 *	Defaults & Listeners
					\*/

					// Menu mechanic
					group = document.getElementById('dotdxMenu').children;
					numEl = group.length;
					for(i = 0; i < numEl; ++i) group[i].addEventListener('click',DotDX.gui.changeMenu);

					// Rollover mechanic
					group = document.getElementById('dotdxcontainer').getElementsByClassName('rollover');
					numEl = group.length;
					for(i = 0; i < numEl; ++i) group[i].addEventListener('click',DotDX.gui.rollover);

					// Raids List Global Click Listener
					DotDX.c('#dotdxRaidsList').on('click',DotDX.gui.raidListClick);

					// Raids tab
					DotDX.c('#dotdxRaidsSearch').set({value:DotDX.config.lastFilter[DotDX.config.serverMode - 1]}).on('keyup', function() { DotDX.gui.updateFilterTxt(this.value, false); });

					// Filter tab
					DotDX.c('#dotdxFilterDisableFilters').attr((DotDX.config.fltShowAll?'':'!')+'checked').on('click', function() { DotDX.config.fltShowAll = this.checked; DotDX.gui.selectRaidsToJoin('checkbox'); });
					DotDX.c('#dotdxFilterIncludeVisited').attr((DotDX.config.fltIncVis?'':'!')+'checked').on('click', function() { DotDX.config.fltIncVis = this.checked; if (!DotDX.config.fltShowAll) DotDX.gui.selectRaidsToJoin('checkbox'); });
					DotDX.c('#dotdxFilterExcludeFull').attr((DotDX.config.fltExclFull?'':'!')+'checked').on('click', function() { DotDX.config.fltExclFull = this.checked; DotDX.gui.selectRaidsToJoin('checkbox'); });

					// Options tab
					DotDX.c('#dotdxOptsHideBanner').attr((DotDX.config.hideArmorBanner?'':'!')+'checked').on('click', function() { DotDX.config.hideArmorBanner = this.checked; DotDX.gui.setArmorLayout(); });
					DotDX.c('#dotdxOptsHideTitle').attr((DotDX.config.hideGameTitle?'':'!')+'checked').on('click', function() { DotDX.config.hideGameTitle = this.checked; DotDX.gui.setArmorLayout(); });
					DotDX.c('#dotdxOptsHideContent').attr((DotDX.config.hideGameDetails?'':'!')+'checked').on('click', function() { DotDX.config.hideGameDetails = this.checked; DotDX.gui.setArmorLayout(); });
					DotDX.c('#dotdxOptsHideFooter').attr((DotDX.config.hideArmorFooter?'':'!')+'checked').on('click', function() { DotDX.config.hideArmorFooter = this.checked; DotDX.gui.setArmorLayout(); });
					DotDX.c('#dotdxOptsPlayKasan').attr((DotDX.config.serverMode === 2?'':'!')+'checked').on('click', DotDX.gui.switchServer.bind(DotDX.gui) );

					/*\
					 *	Timers / Intervals
					\*/
					window.userInt = setInterval(function(){
						var gameIFrame = document.getElementById('gamefilearea').children[0];
						if(typeof gameIFrame === 'object' && typeof gameIFrame.src === 'string') {
							var ag = gameIFrame.src.match(/^.+user_id=([a-f\d]{32})&auth_token=([a-f\d]{32}).+$/);
							DotDX.config.agId = ag[1];
							DotDX.config.agAuth = ag[2];
							DotDX.config.agUser = document.getElementById('topnav-profile-link').children[0].getAttribute('href').substring(6);
							console.log("[DotDX] Initialized user: " + DotDX.config.agUser + " | " + DotDX.config.agId + " | " + DotDX.config.agAuth);
							clearInterval(window.userInt);
						}
						else console.log("[DotDX] User init failed... trying again in 3s");
					}, 3000);


					// Post initialisation routines
					DotDX.gui.cleanRaidsDB(true);
					DotDX.gui.selectRaidsToJoin();
				}

            },
			reload: function() {
				var iFrame = document.getElementById('gamefilearea').children[0];
				iFrame.src = iFrame.src;
			},
            searchPatterns: {
                z1: ['kobold', 'scorp', 'ogre'],
                z2: ['rhino', 'alice', 'lurker'],
                z3: ['4ogre', 'squid', 'batman', 'drag', 'tainted'],
                z4: ['bmane', '3dawg', 'hydra', 'sircai', 'tyranthius'],
                z5: ['ironclad', 'zombiehorde', 'stein', 'bogstench', 'nalagarst'],
                z6: ['gunnar', 'nidhogg', 'kang', 'ulfrik', 'kalaxia'],
                z7: ['maraak', 'erakka_sak', 'wexxa', 'guilbert', 'bellarius'],
                z8: ['hargamesh', 'grimsly', 'rift', 'sisters', 'mardachus'],
                z9: ['mesyra', 'nimrod', 'phaedra', 'tenebra', 'valanazes'],
                'z1_9': ['kobold', 'scorp', 'ogre', 'rhino', 'alice', 'lurker', '4ogre', 'squid', 'batman', 'drag', 'tainted', 'bmane', '3dawg', 'hydra', 'sircai', 'tyranthius', 'ironclad', 'zombiehorde', 'stein', 'bogstench', 'nalagarst', 'gunnar', 'nidhogg', 'kang', 'ulfrik', 'kalaxia', 'maraak', 'erakka_sak', 'wexxa', 'guilbert', 'bellarius', 'hargamesh', 'grimsly', 'rift', 'sisters', 'mardachus', 'mesyra', 'nimrod', 'phaedra', 'tenebra', 'valanazes'],
                'z9.5': ['pumpkin', 'jacksrevenge1'],
                'z9.7': ['hellemental', 'shadow'],
                z10: ['krugnug', 'tomb_gargoyle', 'leonine_watcher', 'centurion_marius', 'caracalla'],
                z14: ['zugen', 'gulkinari', 'verkiteia', 'cannibal_barbarians'],
                z15: ['korxun', 'xerkara', 'shaar', 'nereidon', 'drulcharus'],
                z16: ['bad_blood','way_warden','draconic_dreams','doppelganger'],
                z17: ['the_sight_of_solus','engine_of_the_ancients','ascendants_echo','drakontos_the_first_terror'],
                farm: ['maraak', 'erakka_sak', 'wexxa', 'guilbert', 'bellarius', 'drag', 'tainted', 'ogre', 'scorp', 'baroness'],
                flute: ['kobold', 'scorp', 'ogre', 'rhino', 'alice', 'lurker', '4ogre', 'squid', 'batman', 'drag', 'tainted', 'harpy', 'spider', 'djinn', 'evilgnome', 'basilisk', 'roc', 'gladiators', 'chimera', 'crabshark', 'gorgon', 'warewolfpack', 'blobmonster', 'giantgolem'],
                tower: ['thaltherda', 'hurkus', 'malleus', 'yydians_sanctuary', 'clockwork_dragon', 'krxunara', 'karkata', 'corrupted_wilds', 'marble_colossus', 'elite_butcher', 'elite_killers', 'elite_mangler', 'elite_murderer', 'elite_caster', 'elite_whispers', 'elite_malleus', 'elite_riders', 'elite_warrior','elite_lady'],
                small: ['kobold', 'rhino', 'bmane', '4ogre', 'serpina', 'dragons_lair', 'gunnar', 'hargamesh', 'ironclad', 'krugnug', 'maraak', 'thaltherda', 'zugen', 'nereidon', 'mestr_rekkr_rematch', 'ghostly_alchemist', 'master_ninja_bakku','valtrias','bad_blood','elite_caster','elite_warrior','frost_the_snow_dragon','unholy_rite','bloodsuckers','elite_bloodsuckers','elite_slitherer','the_sight_of_solus'],
                medium: ['alice', 'erakka_sak', 'grimsly', '3dawg', 'scorp', 'nidhogg', 'tomb_gargoyle', 'squid', 'tisiphone', 'zombiehorde', 'baroness', 'hurkus', 'gulkinari', 'korxun', 'drunken_ragunt', 'shadow', 'rudaru_the_axe_master','doppelganger','bash_brothers', 'elite_whispers', 'yule_punishment_bearer', 'damned_shade','ascendants_echo'],
                large: ['ogre', 'batman', 'hydra', 'kang', 'leonine_watcher', 'lurker', 'rift', 'stein', 'wexxa', 'teremarthu', 'zralkthalat', 'malleus', 'verkiteia', 'drulcharus', 'gigantomachy', 'green_killers', 'yule_present_bearer','clockwork_giant','blood_dancer','elite_murderer','elite_riders','qwiladrian_sporeforms', 'the_thaw_of_elvigar', 'demonic_skeleton','possessed_cadaver','war_damned_shade','lord_hoton_the_usurper', 'war_swarm', 'war_bloodsuckers', 'war_soldier_ants', 'initiates_of_the_abyss', 'elite_initiates'],
                epic: ['bogstench', 'centurion_marius', 'drag', 'tainted', 'guilbert', 'pumpkin', 'jacksrevenge1', 'mesyra', 'nimrod', 'phaedra', 'sircai', 'sisters', 'ulfrik', 'frogmen_assassins', 'burbata', 'yydians_sanctuary', 'grundus', 'shaar', 'tuxargus', 'nylatrix', 'rannveig', 'legion_of_darkness', 'valley_of_death', 'murgrux_the_mangler', 'marble_colossus', 'drakes_fire_elemental','elite_mangler', 'elite_malleus', 'qwiladrian_stormship', 'jershan_thurns_portal', 'odius_pods','reaper_mantis','elite_reaper_mantis','soldier_ants', 'hullbore_worms', 'elite_5th_terror'],
                colossal: ['bellarius', 'caracalla', 'kalaxia', 'tyranthius', 'mardachus', 'nalagarst', 'tenebra', 'valanazes', 'siculus', 'ruzzik', 'cannibal_barbarians', 'vortex_abomination', 'xerkara', 'keron', 'clockwork_dragon', 'krxunara', 'hellemental', 'kanehuar_yachu', 'karkata', 'thratus_abomination', 'way_warden', 'faetouched_dragon','vineborn_behemoth','badland_ambusher', 'prison_of_fear', 'elite_lady', 'the_frozen_spire','elite_devourer','elite_karkata','engine_of_the_ancients'],
                gigantic: ['imryx', 'trekex', 'gataalli_huxac', 'kessov_fort', 'corrupted_wilds','draconic_dreams','horthania_stam','jormungan_the_sea_storm_stam', 'euryino', 'grotesque_hybrid','red_snow','drakontos_the_first_terror'],
                glyph: ['maraak', 'erakka_sak', 'wexxa', 'guilbert', 'bellarius'],
                goblin: ['master_ninja_bakku', 'green_killers', 'elite_killers', 'elite_riders'],
                citadel: ['thaltherda', 'hurkus', 'malleus', 'yydians_sanctuary', 'clockwork_dragon', 'krxunara', 'karkata', 'corrupted_wilds', 'marble_colossus', 'elite_butcher', 'elite_killers', 'elite_murderer', 'elite_mangler', 'elite_caster', 'elite_whispers', 'elite_malleus', 'elite_riders', 'elite_warrior', 'elite_lady'],
                festival: ['vortex_abomination', 'drunken_ragunt', 'mestr_rekkr_rematch', 'valley_of_death', 'green_killers', 'murgrux_the_mangler', 'euryino', 'jershan_thurns_portal','elite_5th_terror'],
                abyssal: ['elite_devourer','elite_bloodsuckers','elite_reaper_mantis','soldier_ants', 'war_swarm', 'war_bloodsuckers', 'war_soldier_ants', 'elite_initiates', 'hullbore_worms','elite_5th_terror','elite_karkata','elite_slitherer'],
                aquatic: ['dirthax', 'frogmen_assassins', 'lurker', 'nidhogg', 'crabshark', 'squid', 'thaltherda', 'nereidon', 'krxunara', 'trekex', 'paracoprion', 'bog_bodies','karkata','jormungan_the_sea_storm_stam', 'euryino', 'initiates_of_the_abyss', 'elite_initiates', 'hullbore_worms', 'elite_5th_terror', 'elite_karkata','elite_slitherer','drakontos_the_first_terror'],
                beastman: ['bmane', 'burbata', 'frogmen_assassins', 'batman', 'war_boar', 'hargamesh', 'hurkus', 'krugnug', 'malleus', 'scorp', 'ruzzik', 'squid', 'korxun', 'shaar', 'nereidon', 'drulcharus', 'trekex', 'elite_malleus'],
                beasts: ['lurker', 'rhino', '3dawg', 'nidhogg', 'hydra', 'kang', 'wexxa', 'karkata', 'nrlux', 'spider', 'basilisk', 'chimera', 'doomglare', 'roc', 'crabshark', 'dirthax', 'nrlux', 'paracoprion', 'corrupted_wilds', 'elite_riders','elite_devourer'],
                bludheim: ['gunnar', 'nidhogg', 'kang', 'ulfrik', 'kalaxia'],
                colosseum: ['gladiators', 'serpina', 'crabshark', 'tisiphone', 'chimera', 'green_killers', 'marble_colossus','blood_dancer','bash_brothers'],
                construct: ['cedric', 'erakka_sak', 'giantgolem', 'leonine_watcher', 'tomb_gargoyle', 'stein', 'yydians_sanctuary', 'clockwork_dragon', 'clockwork_giant', 'thratus_abomination', 'marble_colossus', 'the_frozen_spire','engine_of_the_ancients'],
                demon: ['apoc_demon', '3dawg', 'tyranthius', 'lunacy', 'salome', 'sircai', 'blobmonster', 'malchar', 'zralkthalat', 'krxunara', 'adrastos', 'hellemental','valtrias','red_snow','jershan_thurns_portal', 'damned_shade','demonic_skeleton','possessed_cadaver','war_damned_shade','odius_pods','unholy_rite'],
                dragon: ['bellarius', 'corrupterebus', 'dragons_lair', 'echidna', 'drag', 'kalaxia', 'krykagrius', 'mardachus', 'mesyra', 'nalagarst', 'nimrod', 'phaedra', 'rhalmarius_the_despoiler', 'tainted', 'tenebra', 'thaltherda', 'tisiphone', 'grundus', 'valanazes', 'verkiteia', 'winter_kessov', 'xerkara', 'nereidon', 'drulcharus', 'keron', 'tuxargus', 'nylatrix', 'clockwork_dragon', 'imryx', 'draconic_dreams', 'horthania_stam', 'jormungan_the_sea_storm_stam', 'drakes_fire_elemental', 'faetouched_dragon', 'grotesque_hybrid', 'frost_the_snow_dragon', 'elite_slitherer','the_sight_of_solus','drakontos_the_first_terror'],
                giant: ['gigantomachy', 'gataalli_huxac', 'kanehuar_yachu','clockwork_giant','aberrant_strength_serum'],
                guild: ['harpy', 'spider', 'djinn', 'evilgnome', 'basilisk', 'roc', 'gladiators', 'chimera', 'crabshark', 'gorgon', 'werewolfpack', 'blobmonster', 'giantgolem', 'slaughterers', 'lunacy', 'felendis', 'agony', 'fairy_prince', 'war_boar', 'dirthax', 'dreadbloom', 'rhalmarius_the_despoiler', 'gladiators', 'krasgore', 'xessus', 'malchar', 'nrlux', 'salome', 'apoc_demon', 'grundus', 'tuxargus', 'nylatrix', 'keron', 'adrastos', 'doomglare', 'darhednal', 'paracoprion', 'bog_bodies', 'clockwork_giant', 'drakes_fire_elemental', 'faetouched_dragon', 'aberrant_strength_serum', 'bash_brothers','unholy_rite','soldier_ants','hullbore_worms'],
                human: ['agony', 'rhino', 'gladiators', 'baroness', 'warewolfpack', 'alice', 'cannibal_barbarians', 'guilbert', 'gunnar', 'pumpkin', 'jacksrevenge1', 'lunacy', 'slaughterers', 'ulfrik', 'mestr_rekkr_rematch', 'rannveig', 'adrastos', 'legion_of_darkness', 'yule_present_bearer', 'bad_blood', 'yule_punishment_bearer','possessed_cadaver','lord_hoton_the_usurper','unholy_rite'],
                insect: ['elite_devourer','bloodsuckers','elite_bloodsuckers','reaper_mantis','elite_reaper_mantis','soldier_ants', 'war_swarm', 'war_bloodsuckers', 'war_soldier_ants'],
                magical: ['djinn', 'grimsly', 'hargamesh', 'fairy_prince', 'rift', 'sisters', 'vortex_abomination', 'grundus', 'shadow', 'bog_bodies', 'corrupted_wilds','way_warden', 'doppelganger', 'drakes_fire_elemental', 'faetouched_dragon' ,'blood_dancer', 'prison_of_fear', 'ascendants_echo'],
                nmqueen: ['elite_butcher', 'elite_killers', 'elite_murderer', 'elite_mangler', 'elite_caster', 'elite_riders', 'elite_whispers', 'elite_malleus', 'prison_of_fear', 'elite_warrior', 'elite_lady'],
                ogre: ['ogre', '4ogre', 'felendis', 'zugen', 'korxun', 'drunken_ragunt', 'valley_of_death', 'murgrux_the_mangler', 'elite_butcher', 'elite_mangler', 'bash_brothers'],
                orc: ['darhednal', 'rudaru_the_axe_master', 'green_killers', 'elite_killers', 'elite_murderer'],
                plant: ['vineborn_behemoth', 'badland_ambusher', 'haunted_forest', 'qwiladrian_sporeforms','odius_pods'],
                oddish: ['vineborn_behemoth', 'badland_ambusher', 'haunted_forest', 'qwiladrian_sporeforms'],
                qwiladrian: ['gulkinari', 'teremarthu', 'vortex_abomination', 'grotesque_hybrid', 'qwiladrian_sporeforms', 'qwiladrian_stormship'],
                ryndor: ['bmane', '3dawg', 'hydra', 'sircai', 'tyranthius'],
                siege: ['echidna', 'ulfrik', 'yydians_sanctuary', 'drunken_ragunt', 'kessov_fort', 'the_frozen_spire'],
                terror: ['euryino', 'elite_5th_terror', 'drakontos_the_first_terror'],
                undead: ['agony', 'bogstench', 'serpina', 'ironclad', 'malleus', 'nalagarst', 'stein', 'siculus', 'zombiehorde', 'caracalla', 'centurion_marius', 'ghostly_alchemist', 'elite_caster', 'elite_whispers', 'elite_malleus', 'haunted_forest', 'elite_warrior', 'elite_lady', 'the_thaw_of_elvigar','demonic_skeleton'],
                underground: ['maraak', 'erakka_sak', 'wexxa', 'guilbert', 'bellarius', 'spider', 'tomb_gargoyle', 'leonine_watcher', 'centurion_marius', 'caracalla', 'dragons_lair', 'kang', '3dawg', 'lurker', 'salome', 'stein', 'imryx', 'elite_caster', 'elite_riders', 'elite_lady'],
                war: ['demonic_skeleton', 'possessed_cadaver', 'war_damned_shade', 'war_swarm', 'war_bloodsuckers', 'war_soldier_ants'],
                winter: ['yule_punishment_bearer', 'the_thaw_of_elvigar', 'the_frozen_spire', 'frost_the_snow_dragon', 'red_snow']
            },
            raids: {
                aberrant_strength_serum: {name: 'Aberrant Strength Potion', shortname: 'Strength Potion', id: 'aberrant_strength_serum', type: 'Giant', stat: 'H', size:10, nd:2, duration:24, health: [2000000000,2500000000,3400000000,4000000000,0,0], lt: ['pot','pot','pot','pot']},
                adrastos: {name: 'Adrastos of the Kavala ', shortname: 'Adrastos', id: 'adrastos', type: 'Human, Demon', stat: 'H', size: 101, nd: 5, duration: 192, health: [5000000000, 6250000000, 8750000000, 10000000000, 0, 0], lt: ['keron', 'keron', 'keron', 'keron']},
                agony: {name: 'Agony', shortname: 'Agony', id: 'agony', type: 'Undead, Human', stat: 'H', size: 101, nd: 5, duration: 168, health: [700000000, 875000000, 1120000000, 1400000000, 0, 0]},
                apoc_demon: {name: 'Apocolocyntosised Demon', shortname: 'Apoc', id: 'apoc_demon', type: 'Demon', stat: 'H', size: 50, nd: 3, duration: 144, health: [500000000, 750000000, 1000000000, 2000000000, 0, 0], lt: ['apoc', 'apoc', 'apoc', 'apoc']},
                djinn: {name: 'Al-Azab', shortname: 'Azab', id: 'djinn', type: 'Magical Creature', stat: 'H', size: 100, nd: 4, duration: 168, health: [55000000, 68750000, 88000000, 110000000, 0, 0]},
                spider: {name: 'Arachna', shortname: 'Arachna', id: 'spider', type: 'Underground, Beast', stat: 'H', size: 50, nd: 3, duration: 144, health: [22000000, 27500000, 35200000, 44000000, 0, 0]},
                rhino: {name: 'Ataxes', shortname: 'Ataxes', id: 'rhino', type: 'Human, Beast', stat: 'S', size: 10, nd: 2, duration: 120, health: [2000000, 2500000, 3200000, 4000000, 0, 0]},
                badland_ambusher: {name: 'Badland Ambusher', shortname: 'Badlands', id: 'badland_ambusher', type: 'Plant', stat: 'S', size:500, nd:6, duration:96, health: [225000000000,450000000000,675000000000,900000000000,0,0], lt: ['badl','badl','badl','badl']},
                bash_brothers: {name: 'The Bash Brothers',shortname: 'B. Brothers',id: 'bash_brothers', type: 'Colosseum Ogre', stat: 'H', size:25, nd:4, duration:48, health: [25000000000,33000000000,41000000000,50000000000,0,0], lt: ['bsh','bsh','bsh','bsh']},
                gladiators: {name: 'Batiatus Gladiators ', shortname: 'Gladiators', id: 'gladiators', type: 'Colosseum, Human', stat: 'H', size: 10, nd: 2, duration: 120, health: [12000000, 15000000, 19200000, 24000000, 0, 0]},
                bellarius: {name: 'Bellarius the Guardian', shortname: 'Bellarius', id: 'bellarius', type: 'Dragon, Underground', stat: 'S', size: 500, nd: 6, duration: 96, health: [900000000, 1125000000, 1440000000, 1800000000, 0, 0]},
                bad_blood: {name: 'Bad Blood', shortname: 'Bad Blood', id: 'bad_blood', type: 'Human', stat: 'S', size:30, nd:4, duration:48, health: [8000000000,16000000000,24000000000,32000000000,0,0], lt: ['badb','badb','badb','badb']},
                baroness: {name: 'The Baroness', shortname: 'Baroness', id: 'baroness', type: 'Human', stat: 'S', size: 50, nd: 3, duration: 60, health: [68000000, 85000000, 108800000, 136000000, 0, 0]},
                werewolfpack: {name: 'The Black Moon Pack', shortname: 'Black Moon', id: 'werewolfpack', type: 'Human', stat: 'H', size: 50, nd: 3, duration: 144, health: [135000000, 168750000, 216000000, 270000000, 0, 0]},
                blood_dancer: {name: 'Blood Dancer', shortname: 'Blood Dancer', id: 'blood_dancer', type: 'Magical Creature, Colosseum', stat: 'S', size:100, nd:5, duration:48, health: [50000000000,100000000000,150000000000,200000000000,0,0], lt: ['danc','danc','danc','danc']},
                bloodsuckers: {name: 'Bloodsuckers', shortname: 'Bloodsuckers', id: 'bloodsuckers', type: 'Insect', stat: 'S', size: 20, nd: 3, duration: 36, health: [17500000000,35000000000,52500000000,70000000000,0,0], lt: ['u','u','u','u']},
                alice: {name: 'Bloody Alice', shortname: 'Alice', id: 'alice', type: 'Human', stat: 'S', size: 50, nd: 3, duration: 120, health: [15000000, 18750000, 24000000, 30000000, 0, 0]},
                bog_bodies: {name: 'The Bog Bodies', shortname: 'Bog Bodies', id: 'bog_bodies', type: 'Magical Creature, Aquatic', stat: 'H', size:101, nd:5, duration:192, health: [3750000000,7500000000,11250000000,15000000000,0,0], lt: ['keron', 'keron', 'keron', 'keron']},
                bogstench: {name: 'Bogstench', shortname: 'Bogstench', id: 'bogstench', type: 'Undead', stat: 'S', size: 250, nd: 5, duration: 96, health: [450000000, 562500000, 720000000, 900000000, 0, 0]},
                '4ogre': {name: 'Briareus the Butcher', shortname: 'Briareus', id: '4ogre', type: 'Ogre', stat: 'S', size: 10, nd: 2, duration: 72, health: [4500000, 5625000, 7200000, 9000000, 0, 0]},
                bmane: {name: 'Bloodmane', shortname: 'Bloodmane', id: 'bmane', type: 'Beastman, Ryndor', stat: 'S', size: 10, nd: 2, duration: 72, health: [7000000, 8750000, 11200000, 14000000, 0, 0]},
                burbata: {name: 'Burbata the Spine-Crusher', shortname: 'Burbata', id: 'burbata', type: 'Beastman', stat: 'S', size: 250, nd: 5, duration: 96, health: [1000000000, 2000000000, 3500000000, 5000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
                cannibal_barbarians: {name: 'Cannibal Barbarians', shortname: 'Cannibals', id: 'cannibal_barbarians', type: 'Human', stat: 'S', size: 500, nd: 6, duration: 128, health: [60000000000, 90000000000, 180000000000, 240000000000, 0, 0], lt: ['canib', 'canib', 'canib', 'canib']},
                cedric: {name: 'Cedric the Smashable', shortname: 'Cedric', id: 'cedric', type: 'Construct', stat: 'ESH', size: 90000, nd: 0, duration: 24, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
                caracalla: {name: 'Caracalla', shortname: 'Caracalla', id: 'caracalla', type: 'Undead, Underground', stat: 'S', size: 500, nd: 6, duration: 128, health: [50000000000, 75000000000, 150000000000, 200000000000, 0, 0], lt: ['cara', 'cara', 'cara', 'cara']},
                harpy: {name: 'Celeano', shortname: 'Celeano', id: 'harpy', type: '', stat: 'H', size: 10, nd: 2, duration: 120, health: [3000000, 3750000, 4800000, 6000000, 0, 0]},
                centurion_marius: {name: 'Centurion Marius', shortname: 'Marius', id: 'centurion_marius', type: 'Undead, Underground', stat: 'S', size: 250, nd: 5, duration: 96, health: [10000000000, 12000000000, 16000000000, 40000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
                kobold: {name: 'Chieftain Horgrak', shortname: 'Horgrak', id: 'kobold', type: '', stat: 'S', size: 10, nd: 2, duration: 168, health: [150000, 187500, 240000, 300000, 0, 0]},
                clockwork_dragon: {name: 'Clockwork Dragon', shortname: 'Clock Dragon', id: 'clockwork_dragon', type: 'Construct, Dragon', stat: 'S', size: 500, nd: 6, duration: 128, health: [70000000000, 140000000000, 210000000000, 280000000000], lt: ['clock', 'clock', 'clock', 'clock']},
                clockwork_giant: {name: 'Clockwork Giant',shortname: 'Clockwork Giant',id: 'clockwork_giant', type: 'Construct, Giant', stat: 'H', size:100, nd:4, duration:12, health: [5000000000,10000000000,15000000000,20000000000,0,0], lt: ['cwg','cwg','cwg','cwg']},
                corrupterebus: {name: 'Corrupted Erebus', shortname: 'Cbus', id: 'corrupterebus', type: 'Dragon', stat: 'ESH', size: 90000, nd: 0, duration: 96, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
                corrupted_wilds: {name: 'Corrupted Wilds',shortname: 'Corrupted Wilds',id: 'corrupted_wilds', type: 'Magical Creature, Beast', stat: 'S', size:800, nd:6, duration:128, health: [325000000000,650000000000,975000000000,1300000000000,0,0], lt: ['wlds','wlds','wlds','wlds']},
                serpina: {name: 'Countess Serpina', shortname: 'Serpina', id: 'serpina', type: 'Colosseum, Undead', stat: 'E', size: 15, nd: 2, duration: 5, health: [75000000, 112500000, 150000000, 187500000, 0, 0]},
                damned_shade: {name: 'Damned Shade', shortname: 'Shade', id: 'damned_shade', type: 'Demon', stat: 'S', size: 40, nd: 4, duration: 48, health: [50000000000,100000000000,150000000000,200000000000,0,0], lt: ['shade','shade','shade','shade']},
                war_damned_shade: {name: 'War Damned Shade', shortname: 'War Shade', id: 'war_damned_shade', type: 'War, Demon', stat: 'S', size: 100, nd: 4, duration: 24, health: [500000000000,0,0,0,0,0], lt: ['u','u','u','u']},
                darhednal: {name: 'Dar\'Hed\'Nal', shortname: 'Dar\'Hed\'Nal', id: 'darhednal', type: 'Orc', stat: 'H', size: 50, nd: 3, duration: 144, health: [500000000, 1000000000, 1500000000, 2000000000, 0, 0], lt: ['keron', 'keron', 'keron', 'keron']},
                basilisk: {name: 'Deathglare', shortname: 'Deathglare', id: 'basilisk', type: 'Beast', stat: 'H', size: 50, nd: 3, duration: 144, health: [45000000, 56250000, 72000000, 90000000, 0, 0]},
                demonic_skeleton: {name: 'Demonic Skeleton', shortname: 'War Skel', id: 'demonic_skeleton', type: 'War, Demon, Undead', stat: 'S', size: 100, nd: 4, duration: 24, health: [1000000000000,0,0,0,0,0], lt: ['u','u','u','u']},
                dirthax: {name: 'Dirthax', shortname: 'Dirthax', id: 'dirthax', type: 'Aquatic, Beast', stat: 'H', size: 100, nd: 4, duration: 168, health: [550000000, 687500000, 880000000, 1100000000, 0, 0]},
                doomglare: {name: 'Doomglare', shortname: 'Doomglare', id: 'doomglare', type: 'Beast', stat: 'H', size: 100, nd: 4, duration: 12, health: [500000000, 1250000000, 2000000000, 3000000000, 0, 0], lt: ['keron', 'keron', 'keron', 'keron']},
                doppelganger: {name: 'Doppelganger', shortname: 'Doppelganger', id: 'doppelganger', type: 'Magical Creature', stat: 'S', size:50, nd:5, duration:60, health: [12000000000,24000000000,36000000000,48000000000,0,0], lt: ['dopp','dopp','dopp','dopp']},
                draconic_dreams: {name: 'Draconic Dreams', shortname: 'D. Dreams',id: 'draconic_dreams', type: 'Dragon', stat: 'S', size: 800, nd:6, duration:128, health: [500000000000,1000000000000,1500000000000,2000000000000,0,0], lt: ['drac','drac','drac','drac']},
                dragons_lair: {name: 'Dragons Lair', shortname: 'Lair', id: 'dragons_lair', type: 'Dragon, Underground', stat: 'S', size: 13, nd: 2, duration: 5, health: [100000000, 500000000, 1000000000, 1500000000, 0, 0], lt: ['nDl', 'hDl', 'lDl', 'nmDl']},
                drakes_fire_elemental: {name: 'Drake\'s Fire Elemental', shortname: 'Fire Elemental', id: 'drakes_fire_elemental', type: 'Magical Creature, Dragon', stat: 'H', size:50, nd:5, duration:48, health: [12000000000,16000000000,20000000000,24000000000,0,0], lt: ['fel','fel','fel','fel']},
                drulcharus: {name: 'Drulcharus', shortname: 'Drulcharus', id: 'drulcharus', type: 'Dragon, Beastman', stat: 'S', size: 100, nd: 5, duration: 72, health: [10000000000, 15000000000, 20000000000, 25000000000, 0, 0], lt: ['z15hi', 'z15hi', 'z15hi', 'z15hi']},
                drunken_ragunt: {name: 'Drunken Ragunt', shortname: 'Ragunt', id: 'drunken_ragunt', type: 'Siege, Ogre', stat: 'S', size: 50, nd: 5, duration: 60, health: [8500000000, 14450000000, 18700000000, 25500000000, 0, 0], lt: ['rag', 'rag', 'rag', 'rag']},
                echidna: {name: 'Echidna', shortname: 'Echidna', id: 'echidna', type: 'Dragon, Siege', stat: 'ESH', size: 90000, nd: 0, duration: 96, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
                elite_bloodsuckers: {name: 'Elite Bloodsuckers', shortname: 'E. Bloodsuckers', id: 'elite_bloodsuckers', type: 'Abyssal, Insect', stat: 'S', size: 25, nd: 2, duration: 18, health: [800000000000,800000000000,800000000000,800000000000,0,0], lt: ['u','u','u','u']},
                elite_butcher: {name: 'Elite Butcher', shortname: 'E. Butcher', id: 'elite_butcher', type: 'Ogre, Nightmare Queen', stat: 'ES', size:20, nd: 2, duration: 12, health: [500000000000,500000000000,500000000000,500000000000,0,0], lt: ['ebut','ebut','ebut','ebut']},
                elite_caster: {name: 'Elite Caster', shortname: 'E. Caster', id: 'elite_caster', type: 'Undead, Underground, Nightmare Queen', stat: 'ES', size: 25, nd: 2, duration: 18, health: [750000000000,750000000000,750000000000,750000000000,0,0], lt: ['ecas','ecas','ecas','ecas']},
                elite_devourer: {name: 'Elite Devourer', shortname: 'Devourer', id: 'elite_devourer', type: 'Abyssal, Insect, Beast', stat: 'H', size: 100, nd: 5, duration: 48, health: [1500000000000,1500000000000,1500000000000,1500000000000,0,0], lt: ['u','u','u','u']},
                elite_killers: {name: 'Elite Killers', shortname: 'E. Killers', id: 'elite_killers', type: 'Goblin, Orc, Nightmare Queen', stat: 'ES', size: 50, nd: 2, duration: 18, health: [1500000000000,1500000000000,1500000000000,1500000000000,0,0], lt: ['ekil','ekil','ekil','ekil']},
                elite_lady: {name: 'Elite Lady Cecile',shortname: 'E. Lady',id: 'elite_lady', type: 'Undead, Underground, Nightmare Queen', stat: 'S', size:300, nd:4, duration:36, health: [18000000000000,18000000000000,18000000000000,18000000000000,0,0], lt: ['ecec','ecec','ecec','ecec']},
                elite_malleus: {name: 'Elite Malleus', shortname: 'E. Malleus', id: 'elite_malleus', type: 'Undead, Beastman, Nightmare Queen', stat: 'ES', size: 200, nd: 4, duration: 32, health: [10000000000000,10000000000000,10000000000000,10000000000000,0,0], lt: ['emal','emal','emal','emal']},
                elite_murderer: {name: 'Elite Murderer', shortname: 'E. Murderer', id: 'elite_murderer', type: 'Orc, Nightmare Queen', stat: 'ES', size: 100, nd: 3, duration: 24, health: [3750000000000,3750000000000,3750000000000,3750000000000,0,0], lt: ['emrd','emrd','emrd','emrd']},
                elite_mangler: {name: 'Elite Mangler', shortname: 'E. Mangler', id: 'elite_mangler', type: 'Ogre, Nightmare Queen', stat: 'ES', size: 200, nd: 4, duration: 30, health: [8000000000000,8000000000000,8000000000000,8000000000000,0,0], lt: ['eman','eman','eman','eman']},
                elite_reaper_mantis: {name: 'Elite Reaper', shortname: 'E. Reaper', id: 'elite_reaper_mantis', type: 'Abyssal, Insect', stat: 'S', size: 200, nd: 4, duration: 30, health: [12000000000000,12000000000000,12000000000000,12000000000000,0,0], lt: ['u','u','u','u']},
                elite_riders: {name: 'Elite Riders', shortname: 'E. Riders', id: 'elite_riders', type: 'Goblin, Beast, Underground, Nightmare Queen', stat: 'ES', size: 125, nd:3, duration:30, health: [5000000000000,5000000000000,5000000000000,5000000000000,0,0], lt: ['erid','erid','erid','erid']},
                elite_warrior: {name: 'Elite Warrior',shortname: 'E. Warrior', id: 'elite_warrior', type: 'Undead, Nightmare Queen', stat: 'ES', size:25, nd:2, duration:15, health: [1000000000000,1000000000000,1000000000000,1000000000000,0,0], lt: ['ewar','ewar','ewar','ewar']},
                elite_whispers: {name: 'Elite Whispers', shortname: 'E. Whispers', id: 'elite_whispers', type: 'Undead, Nightmare Queen', stat: 'ES', size: 75, nd: 3, duration: 18, health: [2625000000000,2625000000000,2625000000000,2625000000000,0,0], lt: ['ewsp','ewsp','ewsp','ewsp']},
                kessov_fort: {name: 'Engines of War', shortname: 'Engines of War', id: 'kessov_fort', type: 'Siege', stat: 'S', size: 800, nd: 6, duration: 128, health: [300000000000, 600000000000, 900000000000, 1200000000000, 0, 0], lt: ['eow', 'eow', 'eow', 'eow']},
                erakka_sak: {name: 'Erakka-Sak', shortname: 'Erakka-Sak', id: 'erakka_sak', type: 'Underground, Construct', stat: 'S', size: 50, nd: 3, duration: 60, health: [62000000, 77500000, 99200000, 124000000, 0, 0]},
                giantgolem: {name: 'Euphronios', shortname: 'Euphronios', id: 'giantgolem', type: 'Construct', stat: 'H', size: 101, nd: 5, duration: 168, health: [450000000, 562500000, 720000000, 900000000, 0, 0]},
                euryino: {name: 'Euryino, The Fifth Terror', shortname: 'Euryino', id: 'euryino', type: 'Aquatic, Festival, Terror', stat: 'S', size:800, nd:6, duration:96, health: [900000000000,1800000000000,2700000000000,3600000000000,0,0], lt: ['eio','eio','eio','eio']},
                echthros: {name: 'Echthros', shortname: 'Echty', id: 'echthros', type: '', stat: 'ESH', size: 90000, nd: 2, duration: 96, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
                drag: {name: 'Erebus the Black', shortname: 'Erebus', id: 'drag', type: 'Dragon', stat: 'S', size: 250, nd: 5, duration: 168, health: [150000000, 187500000, 240000000, 300000000, 0, 0]},
                faetouched_dragon: {name: 'Faetouched Dragon',shortname: 'Fae Dragon',id: 'faetouched_dragon', type: 'Magical Creature, Dragon', stat: 'H', size:100, nd:6, duration:48, health: [25000000000,33000000000,41000000000,50000000000,0,0], lt: ['fae','fae','fae','fae']},
                frogmen_assassins: {name: 'Frog-Men Assassins', shortname: 'Frog-Men', id: 'frogmen_assassins', type: 'Beastman, Aquatic', stat: 'S', size: 250, nd: 5, duration: 96, health: [16000000000, 24000000000, 32000000000, 64000000000, 0, 0], lt: ['cara', 'cara', 'cara', 'cara']},
                frost_the_snow_dragon: {name: 'Frost the Snow Dragon', shortname: 'Snow Drag', id: 'frost_the_snow_dragon', type: 'Winter, Dragon', stat: 'S', size: 20, nd: 3, duration: 96, health: [15000000000,30000000000,45000000000,60000000000,0,0], lt: ['frost','frost','frost','frost']},
                the_frozen_spire: {name: 'The Frozen Spire', shortname: 'Frozen Spire', id: 'the_frozen_spire', type: 'Winter, Construct, Siege', stat: 'S', size: 300, nd: 5, duration: 72, health: [300000000000,600000000000,900000000000,1200000000000,0,0], lt: ['spire','spire','spire','spire']},
                felendis: {name: 'Felendis & Shaoquin', shortname: 'Banhammer', id: 'felendis', type: 'Ogre', stat: 'H', size: 100, nd: 4, duration: 168, health: [441823718, 549238221, 707842125, 888007007, 0, 0]},
                gataalli_huxac: {name: 'Gataalli Huxac', shortname: 'Gataalli', id: 'gataalli_huxac', type: 'Giant', stat: 'S', size: 800, nd: 6, duration: 128, health: [375000000000, 750000000000, 1125000000000, 1500000000000], lt: ['gat', 'gat', 'gat', 'gat']},
                ogre: {name: 'General Grune', shortname: 'Grune', id: 'ogre', type: 'Ogre', stat: 'S', size: 100, nd: 4, duration: 172, health: [20000000, 25000000, 32000000, 40000000, 0, 0]},
                korxun: {name: 'General Korxun', shortname: 'Korxun', id: 'korxun', type: 'Beastman, Ogre', stat: 'S', size: 50, nd: 4, duration: 60, health: [8000000000, 12000000000, 16000000000, 20000000000, 0, 0], lt: ['z15lo', 'z15lo', 'z15lo', 'z15lo']},
                ghostly_alchemist: {name: 'Ghostly Alchemist', shortname: 'Alchemist', id: 'ghostly_alchemist', type: 'Undead', stat: 'S', size: 25, nd: 4, duration: 48, health: [5000000000, 10000000000, 15000000000, 20000000000], lt: ['alch', 'alch', 'alch', 'alch']},
                dreadbloom: {name: 'Giant Dreadbloom', shortname: 'Dreadbloom', id: 'dreadbloom', type: 'Plant', stat: 'H', size: 101, nd: 5, duration: 192, health: [900000000, 1125000000, 1440000000, 1800000000, 0, 0]},
                gigantomachy: {name: 'Gigantomachy', shortname: 'Gigantomachy', id: 'gigantomachy', type: 'Giant', stat: 'S', size: 100, nd: 5, duration: 72, health: [25000000000, 50000000000, 75000000000, 100000000000], lt: ['gig', 'gig', 'gig', 'gig']},
                batman: {name: 'Gravlok the Night-Hunter', shortname: 'Gravlok', id: 'batman', type: 'Beastman', stat: 'S', size: 100, nd: 4, duration: 72, health: [50000000, 62500000, 80000000, 100000000, 0, 0]},
                green_killers: {name: 'Green Killers', shortname: 'Green Killers', id: 'green_killers', type: 'Orc, Goblin, Festival, Colosseum', stat: 'S', size: 100, nd: 4, duration: 48, health: [12500000000, 25000000000, 37500000000, 50000000000, 0, 0], lt: ['gk', 'gk', 'gk', 'gk']},
                evilgnome: {name: 'Groblar Deathcap', shortname: 'Groblar', id: 'evilgnome', type: '', stat: 'H', size: 10, nd: 2, duration: 120, health: [6000000, 7500000, 9600000, 12000000, 0, 0]},
                grotesque_hybrid: {name: 'Grotesque Hybrid', shortname: 'Hybrid', id: 'grotesque_hybrid', type: 'Qwiladrian, Dragon', stat: 'S', size: 600, nd: 6, duration: 96, health: [550000000000,1100000000000,1650000000000,2200000000000,0,0], lt: ['hbr','hbr','hbr','hbr']},
                grundus: {name: 'Grundus', shortname: 'Grundus', id: 'grundus', type: 'Dragon, Magical Creature', stat: 'H', size: 101, nd: 5, duration: 72, health: [800000000, 1600000000, 4000000000, 12000000000]},
                guilbert: {name: 'Guilbert the Mad', shortname: 'Guilbert', id: 'guilbert', type: 'Underground, Human', stat: 'S', size: 250, nd: 5, duration: 96, health: [550000000, 687500000, 880000000, 1100000000, 0, 0]},
                gulkinari: {name: 'Gulkinari', shortname: 'Gulkinari', id: 'gulkinari', type: 'Qwiladrian', stat: 'S', size: 50, nd: 4, duration: 60, health: [7500000000, 9375000000, 12000000000, 15000000000, 0, 0], lt: ['gulk', 'gulk', 'gulk', 'gulk']},
                gunnar: {name: 'Gunnar the Berserk', shortname: 'Gunnar', id: 'gunnar', type: 'Bludheim, Human', stat: 'S', size: 10, nd: 2, duration: 48, health: [12000000, 15000000, 19200000, 24000000, 0, 0]},
                war_boar: {name: 'Hammer', shortname: 'Hammer', id: 'war_boar', type: 'Beastman', stat: 'H', size: 50, nd: 3, duration: 144, health: [220000000, 275000000, 352000000, 440000000, 0, 0]},
                hargamesh: {name: 'Hargamesh', shortname: 'Hargamesh', id: 'hargamesh', type: 'Beastman, Magical Creature', stat: 'S', size: 10, nd: 2, duration: 48, health: [18000000, 22500000, 28800000, 36000000, 0, 0]},
                haunted_forest: {name: 'The Haunted Forest', shortname: 'Forest', id: 'haunted_forest', type: 'Undead, Plant', stat: 'S', size: 200, nd: 5, duration: 96, health: [110000000000,220000000000,330000000000,440000000000,0,0], lt: ['fst','fst','fst','fst']},
                grimsly: {name: 'Headmaster Grimsly', shortname: 'Grimsly', id: 'grimsly', type: 'Magical Creature', stat: 'S', size: 50, nd: 3, duration: 60, health: [72000000, 90000000, 115200000, 144000000, 0, 0]},
                hellemental: {name: 'Hellemental', shortname: 'Hellemental', id: 'hellemental', type: 'Demon', stat: 'S', size: 500, nd: 6, duration: 128, health: [75000000000, 150000000000, 225000000000, 300000000000, 0, 0], lt: ['hell', 'hell', 'hell', 'hell']},
                horthania_stam: {name: 'Horthania the Grey', shortname: 'Horthania', id: 'horthania_stam', type: 'Dragon', stat: 'S', size:800, nd:6, duration:128, health: [500000000000,1000000000000,1500000000000,2000000000000,0,0], lt: ['hort','hort','hort','hort']},
                hurkus: {name: 'Hurkus the Eviscerator', shortname: 'Hurkus', id: 'hurkus', type: 'Beastman', stat: 'S', size: 50, nd: 4, duration: 60, health: [2812500000, 4218750000, 5625000000, 11250000000, 0, 0], lt: ['hurk', 'hurk', 'hurk', 'hurk']},
                hydra: {name: 'Hydra', shortname: 'Hydra', id: 'hydra', type: 'Ryndor, Beast', stat: 'S', size: 100, nd: 4, duration: 72, health: [65000000, 81250000, 104000000, 130000000, 0, 0]},
                imryx: {name: 'Imryx the Incinerator', shortname: 'Imryx', id: 'imryx', type: 'Underground, Dragon', stat: 'S', size: 800, nd: 6, duration: 128, health: [180000000000, 360000000000, 540000000000, 720000000000, 0, 0], lt: ['imx', 'imx', 'imx', 'imx']},
                ironclad: {name: 'Ironclad', shortname: 'Ironclad', id: 'ironclad', type: 'Undead', stat: 'S', size: 10, nd: 2, duration: 48, health: [10000000, 12500000, 16000000, 20000000, 0, 0]}, //0.5/0.625/0.8/1
                pumpkin: {name: 'Jack', shortname: 'Jack', id: 'pumpkin', type: 'Human', stat: 'S', size: 250, nd: 6, duration: 48, health: [1000000000, 1500000000, 2000000000, 3000000000], lt: ['njack', 'hjack', 'ljack', 'nmjack']},
                jacksrevenge1: {name: 'Jack\'s Revenge', shortname: 'Revenge', id: 'jacksrevenge1', type: 'Human', stat: 'S', size: 250, nd: 6, duration: 48, health: [5000000000, 7500000000, 10000000000, 15000000000], lt: ['njr', 'hjr', 'ljr', 'nmjr']},
                jershan_thurns_portal: {name: 'Jershan\'thurn\'s Portal', shortname: 'Jershan\'thurn', id: 'jershan_thurns_portal', type: 'Festival, Demon', stat: 'S', size: 200, nd: 5, duration: 60, health: [250000000000,500000000000,750000000000,1000000000000,0,0], lt: ['u','u','u','u']},
                jormungan_the_sea_storm_stam: {name: 'Jormungan the Sea-Storm', shortname: 'Jormungan', id: 'jormungan_the_sea_storm_stam', type: 'Dragon, Aquatic', stat: 'ES', size:800, nd:6, duration:128, health: [750000000000,1500000000000,2250000000000,3000000000000,0,0], lt: ['jorm','jorm','jorm','jorm']},
                kang: {name: 'Kang-Gsod', shortname: 'Kang', id: 'kang', type: 'Bludheim, Underground, Beast', stat: 'S', size: 100, nd: 4, duration: 72, health: [95000000, 118750000, 152000000, 190000000, 0, 0]},
                '3dawg': {name: 'Kerberos', shortname: 'Kerberos', id: '3dawg', type: 'Demon, Underground, Ryndor, Beast', stat: 'S', size: 50, nd: 3, duration: 72, health: [35000000, 43750000, 56000000, 70000000, 0, 0]},
                keron: {name: 'Keron the Sky-Shaker', shortname: 'Keron', id: 'keron', type: 'Dragon', stat: 'H', size: 101, nd: 6, duration: 192, health: [15000000000, 18750000000, 24000000000, 30000000000, 0, 0], lt: ['keron', 'keron', 'keron', 'keron']},
                kessovtowers: {name: 'Kessov Towers', shortname: 'Towers', id: 'kessovtowers', type: 'Siege', stat: 'ESH', size: 90000, nd: 0, duration: 120, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
                kessovtower: {name: 'Treachery and the Tower', shortname: 'Treachery', id: 'kessovtower', type: 'Siege', stat: 'ESH', size: 90000, nd: 0, duration: 24, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
                kessovforts: {name: 'Kessov Forts', shortname: 'Forts', id: 'kessovforts', type: 'Siege', stat: 'ESH', size: 90000, nd: 0, duration: 120, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
                kessovcastle: {name: 'Kessov Castle', shortname: 'Castle', id: 'kessovcastle', type: 'Siege', stat: 'ESH', size: 90000, nd: 0, duration: 144, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
                kalaxia: {name: 'Kalaxia the Far-Seer', shortname: 'Kalaxia', id: 'kalaxia', type: 'Dragon, Bludheim', stat: 'S', size: 500, nd: 6, duration: 96, health: [800000000, 1000000000, 1280000000, 1600000000, 0, 0]},
                kanehuar_yachu: {name: 'Kanehuar Yachu', shortname: 'Kanehuar Yachu', id: 'kanehuar_yachu', type: 'Giant', stat: 'S', size: 500, nd: 6, duration: 128, health: [100000000000, 200000000000, 300000000000, 400000000000, 0, 0], lt: ['kane', 'kane', 'kane', 'kane']},
                karkata: {name: 'Karkata', shortname: 'Karkata',id: 'karkata', type: 'Aquatic, Beast', stat: 'S', size:500, nd:6, duration:128, health: [95000000000,190000000000,285000000000,380000000000,0,0], lt: ['kark','kark','kark','kark']},
                krugnug: {name: 'Krugnug', shortname: 'Krugnug', id: 'krugnug', type: 'Beastman', stat: 'S', size: 25, nd: 4, duration: 48, health: [1000000000, 1500000000, 2000000000, 4000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
                krxunara: {name: 'Kr\'xunara of the Bloody Waves', shortname: 'Kr\'xunara', id: 'krxunara', type: 'Aquatic, Demon', stat: 'S', size: 500, nd: 6, duration: 128, health: [62500000000, 125000000000, 187500000000, 250000000000], lt: ['krx', 'krx', 'krx', 'krx']},
                krykagrius: {name: 'Krykagrius', shortname: 'Krykagrius', id: 'krykagrius', type: 'Dragon', stat: 'ESH', size: 90000, nd: 0, duration: 72, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
                legion_of_darkness: {name: 'Legions of Darkness', shortname: 'Darkness', id: 'legion_of_darkness', type: 'Human', stat: 'S', size: 250, nd: 5, duration: 96, health: [20000000000, 40000000000, 60000000000, 80000000000], lt: ['dark', 'dark', 'dark', 'dark']},
                leonine_watcher: {name: 'Leonine', shortname: 'Leonine', id: 'leonine_watcher', type: 'Underground, Construct', stat: 'S', size: 100, nd: 5, duration: 48, health: [4000000000, 6000000000, 8000000000, 16000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
                lord_hoton_the_usurper: {name: 'Lord Hoton the Usurper', shortname: 'Lord Hoton', id: 'lord_hoton_the_usurper', type: 'Human', stat: 'S', size: 100, nd: 4, duration: 48, health: [175000000000,350000000000,525000000000,700000000000,0,0], lt: ['u','u','u','u']},
                tyranthius: {name: 'Lord Tyranthius', shortname: 'Tyranthius', id: 'tyranthius', type: 'Demon, Ryndor', stat: 'S', size: 500, nd: 6, duration: 168, health: [600000000, 750000000, 960000000, 1200000000, 0, 0]},
                lunacy: {name: 'Lunatics', shortname: 'Lunatics', id: 'lunacy', type: 'Demon, Human', stat: 'H', size: 50, nd: 3, duration: 144, health: [180000000, 225000000, 288000000, 360000000, 0, 0]},
                lurker: {name: 'Lurking Horror', shortname: 'Lurking Horror', id: 'lurker', type: 'Underground, Aquatic, Beast', stat: 'S', size: 100, nd: 4, duration: 120, health: [35000000, 43750000, 56000000, 70000000, 0, 0]},
                malleus: {name: 'Malleus Vivorum', shortname: 'Malleus', id: 'malleus', type: 'Beastman, Undead', stat: 'S', size: 100, nd: 5, duration: 72, health: [8000000000, 12000000000, 16000000000, 20000000000, 0, 0], lt: ['mall', 'mall', 'mall', 'mall']},
                maraak: {name: 'Maraak the Impaler', shortname: 'Maraak', id: 'maraak', type: 'Underground', stat: 'S', size: 10, nd: 2, duration: 48, health: [15000000, 18750000, 24000000, 30000000, 0, 0]},
                marble_colossus: {name: 'Marble Colossus', shortname: 'Colossus', id: 'marble_colossus', type: 'Construct, Colosseum', stat: 'S', size:250, nd:6, duration:84, health: [30000000000,60000000000,90000000000,120000000000,0,0], lt: ['marb','marb','marb','marb']},
                mardachus: {name: 'Mardachus the Destroyer', shortname: 'Mardachus', id: 'mardachus', type: 'Dragon', stat: 'S', size: 500, nd: 6, duration: 96, health: [1100000000, 1375000000, 1760000000, 2200000000, 0, 0]},
                master_ninja_bakku: {name: 'Master Ninja Bakku', shortname: 'Bakku', id: 'master_ninja_bakku', type: 'Goblin', stat: 'S', size: 25, nd: 4, duration: 48, health: [5500000000, 11000000000, 16500000000, 22000000000, 0, 0], lt: ['bak', 'bak', 'bak', 'bak']},
                scorp: {name: 'Mazalu', shortname: 'Mazalu', id: 'scorp', type: 'Beastman', stat: 'S', size: 50, nd: 3, duration: 168, health: [5000000, 6250000, 8000000, 10000000, 0, 0]},
                mestr_rekkr_rematch: {name: 'Mestr Rekkr Rematch', shortname: 'Rekkr II', id: 'mestr_rekkr_rematch', type: 'Human', stat: 'S', size: 25, nd: 4, duration: 48, health: [6000000000, 9000000000, 13200000000, 18000000000, 0, 0], lt: ['rekkr', 'rekkr', 'rekkr', 'rekkr']},
                mesyra: {name: 'Mesyra the Watcher', shortname: 'Mesyra', id: 'mesyra', type: 'Dragon', stat: 'S', size: 250, nd: 5, duration: 96, health: [1000000000, 1250000000, 1600000000, 2000000000, 0, 0]},
                murgrux_the_mangler: {name: 'Murgrux the Mangler', shortname: 'Murgrux', id: 'murgrux_the_mangler', type: 'Ogre, Festival', stat: 'S', size: 250, nd: 5, duration: 48, health: [25000000000, 50000000000, 75000000000, 100000000000, 0, 0], lt: ['murg', 'murg', 'murg', 'murg']},
                nalagarst: {name: 'Nalagarst', shortname: 'Nalagarst', id: 'nalagarst', type: 'Dragon, Undead', stat: 'S', size: 500, nd: 6, duration: 98, health: [700000000, 875000000, 1120000000, 1400000000, 0, 0]},
                nereidon: {name: 'Nereidon the Sea Slayer', shortname: 'Nereidon', id: 'nereidon', type: 'Dragon, Beastman, Aquatic', stat: 'S', size: 30, nd: 3, duration: 48, health: [6000000000, 9000000000, 12000000000, 15000000000, 0, 0], lt: ['z15lo', 'z15lo', 'z15lo', 'z15lo']},
                nidhogg: {name: 'Nidhogg', shortname: 'Nidhogg', id: 'nidhogg', type: 'Bludheim, Aquatic, Beast', stat: 'S', size: 50, nd: 3, duration: 60, health: [52000000, 65000000, 83200000, 104000000, 0, 0]},
                nimrod: {name: 'Nimrod the Hunter', shortname: 'Nimrod', id: 'nimrod', type: 'Dragon', stat: 'S', size: 250, nd: 5, duration: 96, health: [1200000000, 1500000000, 1920000000, 2400000000, 0, 0]},
                nylatrix: {name: 'Nylatrix', shortname: 'Nylatrix', id: 'nylatrix', type: 'Dragon', stat: 'H', size: 101, nd: 5, duration: 192, health: [2000000000, 2500000000, 3400000000, 4000000000, 0, 0], lt: ['nker', 'hker', 'lker', 'nmker']},
                odius_pods: {name: 'Odious Pods', shortname: 'Pods', id: 'odius_pods', type: 'Demon, Plant', stat: 'S', size: 200, nd: 5, duration: 60, health: [175000000000,350000000000,525000000000,700000000000,0,0], lt: ['u','u','u','u']},
                paracoprion: {name: 'Paracoprion', shortname: 'Paracoprion', id: 'paracoprion', type: 'Aquatic, Beast', stat: 'H', size:101, nd:5, duration:192, health: [2000000000,4000000000,6000000000,8000000000,0,0], lt: ['keron', 'keron', 'keron', 'keron']},
                phaedra: {name: 'Phaedra the Deceiver', shortname: 'Phaedra', id: 'phaedra', type: 'Dragon', stat: 'S', size: 250, nd: 5, duration: 96, health: [1400000000, 1750000000, 2240000000, 2800000000, 0, 0]},
                fairy_prince: {name: 'Prince Obyron', shortname: 'Obyron', id: 'fairy_prince', type: 'Magical Creature', stat: 'H', size: 10, nd: 2, duration: 120, health: [30000000, 37500000, 48000000, 60000000, 0, 0]},
                possessed_cadaver: {name: 'Possessed Cadaver', shortname: 'War Cadav', id: 'possessed_cadaver', type: 'War, Human, Demon', stat: 'S', size: 100, nd: 4, duration: 24, health: [1000000000000,0,0,0,0,0], lt: ['u','u','u','u']},
                prison_of_fear: {name: 'Prison of Fear',shortname: 'Fear', id: 'prison_of_fear', type: 'Magical Creature, Nightmate Queen', stat: 'ES', size:400, nd:5, duration:48, health: [2500000000000,5000000000000,7500000000000,10000000000000,0,0], lt: ['pof','pof','pof','pof']},
                qwiladrian_sporeforms: {name: 'Qwiladrian Sporeforms', shortname: 'Sporeforms', id: 'qwiladrian_sporeforms', type: 'Qwiladrian, Plant', stat: 'S', size: 100, nd: 4, duration: 60, health: [100000000000,200000000000,300000000000,400000000000,0,0], lt: ['spr','spr','spr','spr']},
                qwiladrian_stormship: {name: 'Qwiladrian Stormship', shortname: 'Stormship', id: 'qwiladrian_stormship', type: 'Qwiladrian', stat: 'S', size: 200, nd: 4, duration: 60, health: [150000000000,300000000000,450000000000,600000000000,0,0], lt: ['strm','strm','strm','strm']},
                roc: {name: 'Ragetalon', shortname: 'Ragetalon', id: 'roc', type: 'Beast', stat: 'H', size: 100, nd: 4, duration: 168, health: [110000000, 137500000, 176000000, 220000000, 0, 0]},
                rannveig: {name: 'Rannveig', shortname: 'Rannveig', id: 'rannveig', type: 'Human', stat: 'E', size: 250, nd: 6, duration: 128, health: [15000000000, 30000000000, 45000000000, 60000000000, 0, 0], lt: ['rann', 'rann', 'rann', 'rann']},
                reaper_mantis: {name: 'Reaper Mantis', shortname: 'Mantis', id: 'reaper_mantis', type: 'Insect', stat: 'S', size: 200, nd: 5, duration: 60, health: [200000000000,400000000000,600000000000,800000000000,0,0], lt: ['u','u','u','u']},
                red_snow: {name: 'Red Snow', shortname: 'Red Snow', id: 'red_snow', type: 'Winter, Demon', stat: 'S', size: 600, nd: 6, duration: 96, health: [625000000000,1250000000000,1875000000000,2500000000000,0,0], lt: ['red','red','red','red']},
                rhalmarius_the_despoiler: {name: 'Rhalmarius the Despoiler', shortname: 'Rhalmarius', id: 'rhalmarius_the_despoiler', type: 'Dragon', stat: 'H', size: 100, nd: 6, duration: 84, health: [500000000, 1250000000, 3125000000, 7812500000, 0, 0]},
                tomb_gargoyle: {name: 'Riddler Gargoyle', shortname: 'Riddler', id: 'tomb_gargoyle', type: 'Underground, Construct', stat: 'S', size: 50, nd: 4, duration: 48, health: [2000000000, 3000000000, 4000000000, 8000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
                rift: {name: 'Rift the Mauler', shortname: 'Rift', id: 'rift', type: 'Magical Creature', stat: 'S', size: 100, nd: 4, duration: 72, health: [125000000, 156250000, 200000000, 250000000, 0, 0]},
                rudaru_the_axe_master: {name: 'Rudaru the Axe Master', shortname: 'Rudaru', id: 'rudaru_the_axe_master', type: 'Orc', stat: 'S', size: 50, nd: 4, duration: 48, health: [10500000000, 21000000000, 31500000000, 36750000000, 0, 0], lt: ['rud', 'rud', 'rud', 'rud']},
                ruzzik: {name: 'Ruzzik the Slayer', shortname: 'Ruzzik', id: 'ruzzik', type: 'Beastman', stat: 'S', size: 500, nd: 6, duration: 128, health: [55000000000, 82500000000, 165000000000, 220000000000, 0, 0], lt: ['ruzz', 'ruzz', 'ruzz', 'ruzz']},
                salome: {name: 'Salome the Seductress', shortname: 'Salome', id: 'salome', type: 'Demon, Underground', stat: 'H', size: 100, nd: 4, duration: 48, health: [666000000, 832500000, 1065600000, 1332000000, 0, 0], lt: ['nSlut', 'hSlut', 'lSlut', 'nmSlut']},
                crabshark: {name: 'Scuttlegore', shortname: 'Scuttlegore', id: 'crabshark', type: 'Colosseum, Aquatic, Beast', stat: 'H', size: 100, nd: 4, duration: 168, health: [220000000, 275000000, 352000000, 440000000, 0, 0]},
                squid: {name: 'Scylla', shortname: 'Scylla', id: 'squid', type: 'Beastman, Aquatic', stat: 'S', size: 50, nd: 3, duration: 72, health: [25000000, 31250000, 40000000, 50000000, 0, 0]},
                shaar: {name: 'Shaar the Reaver', shortname: 'Shaar', id: 'shaar', type: 'Beastman', stat: 'S', size: 250, nd: 6, duration: 96, health: [12000000000, 24000000000, 36000000000, 60000000000, 0, 0], lt: ['z15hi', 'z15hi', 'z15hi', 'z15hi']},
                shadow: {name: 'Shadow', shortname: 'Shadow', id: 'shadow', type: 'Magical Creature', stat: 'S', size: 50, nd: 5, duration: 60, health: [10000000000, 17000000000, 25000000000, 35000000000, 0, 0], lt: ['shd', 'shd', 'shd', 'shd']},
                sircai: {name: 'Sir Cai', shortname: 'Sir Cai', id: 'sircai', type: 'Demon, Ryndor', stat: 'S', size: 250, nd: 5, duration: 168, health: [350000000, 437500000, 560000000, 700000000, 0, 0]},
                sisters: {name: 'Sisters of the Song', shortname: 'Sisters', id: 'sisters', type: 'Magical Creature', stat: 'S', size: 250, nd: 5, duration: 96, health: [600000000, 750000000, 960000000, 1200000000, 0, 0]},
                slaughterers: {name: 'Slaughterers Six', shortname: 'Slaughterers', id: 'slaughterers', type: 'Human', stat: 'H', size: 10, nd: 2, duration: 120, health: [24000000, 30000000, 38400000, 48000000, 0, 0]},
                stein: {name: 'Stein', shortname: 'Stein', id: 'stein', type: 'Undead, Underground, Construct', stat: 'S', size: 100, nd: 4, duration: 72, health: [80000000, 100000000, 128000000, 160000000, 0, 0]},
                siculus: {name: 'Count Siculus\' Phantom', shortname: 'Siculus', id: 'siculus', type: 'Undead', stat: 'S', size: 500, nd: 6, duration: 128, health: [850000000, 1700000000, 2975000000, 4250000000, 0, 0], lt: ['sic', 'sic', 'sic', 'sic']},
                soldier_ants: {name: 'Soldier Ants', shortname: 'Ants', id: 'soldier_ants', type: 'Guild, Abyssal, Insect', stat: 'H', size: 50, nd: 4, duration: 12, health: [25000000000,50000000000,75000000000,100000000000,0,0], lt: ['u','u','u','u']},
                tainted: {name: 'Tainted Erebus', shortname: 'Tainted', id: 'tainted', type: 'Dragon', stat: 'S', size: 250, nd: 5, duration: 168, health: [250000000, 312500000, 400000000, 500000000, 0, 0]},
                tenebra: {name: 'Tenebra Shadow Mistress', shortname: 'Tenebra', id: 'tenebra', type: 'Dragon', stat: 'S', size: 500, nd: 6, duration: 128, health: [2000000000, 2500000000, 3200000000, 4000000000, 0, 0]},
                thaltherda: {name: 'Thaltherda the Sea-Slitherer', shortname: 'Thaltherda', id: 'thaltherda', type: 'Aquatic, Dragon', stat: 'S', size: 25, nd: 4, duration: 48, health: [3000000000, 4500000000, 6000000000, 7500000000, 0, 0], lt: ['nessy', 'nessy', 'nessy', 'nessy']},
                the_thaw_of_elvigar: {name: 'The Thaw of Elvigar', shortname: 'Thaw of Elvigar', id: 'the_thaw_of_elvigar', type: 'Winter, Undead', stat: 'S', size: 100, nd: 4, duration: 60, health: [150000000000,300000000000,450000000000,600000000000,0,0], lt: ['elv','elv','elv','elv']},
                thratus_abomination: {name: 'Thratu\'s Abomination', shortname: 'Abomination',id: 'thratus_abomination', type: 'Construct', stat: 'S', size:500, nd:6, duration:128, health: [90000000000,180000000000,270000000000,360000000000,0,0], lt: ['abo','abo','abo','abo']},
                tisiphone: {name: 'Tisiphone the Vengeful', shortname: 'Tisiphone', id: 'tisiphone', type: 'Dragon, Colosseum', stat: 'E', size: 50, nd: 3, duration: 12, health: [500000000, 2500000000, 5000000000, 7500000000, 0, 0], lt: ['nTisi', 'hTisi', 'lTisi', 'nmTisi']},
                teremarthu: {name: 'Teremarthu', shortname: 'Teremarthu', id: 'teremarthu', type: 'Qwiladrian', stat: 'S', size: 100, nd: 5, duration: 48, health: [6000000000, 9000000000, 12000000000, 24000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
                chimera: {name: 'Tetrarchos', shortname: 'Tetrarchos', id: 'chimera', type: 'Colosseum, Beast', stat: 'H', size: 50, nd: 3, duration: 144, health: [90000000, 112500000, 144000000, 180000000, 0, 0]},
                gorgon: {name: 'Tithrasia', shortname: 'Tithrasia', id: 'gorgon', type: '', stat: 'H', size: 10, nd: 2, duration: 120, health: [18000000, 22500000, 28800000, 36000000, 0, 0]},
                trekex: {name: 'Trekex\'s Amphibious Assault', shortname: 'Trekex', id: 'trekex', type: 'Aquatic, Beastman', stat: 'S', size: 800, nd: 6, duration: 128, health: [250000000000, 500000000000, 750000000000, 1000000000000], lt: ['trex', 'trex', 'trex', 'trex']},
                tuxargus: {name: 'Tuxargus', shortname: 'Tuxargus', id: 'tuxargus', type: 'Dragon', stat: 'H', size: 101, nd: 5, duration: 192, health: [2000000000, 2500000000, 3400000000, 4000000000, 0, 0], lt: ['nker', 'hker', 'lker', 'nmker']},
                ulfrik: {name: 'Ulfrik', shortname: 'Ulfrik', id: 'ulfrik', type: 'Bludheim, Siege, Human', stat: 'S', size: 250, nd: 5, duration: 96, health: [500000000, 625000000, 800000000, 1000000000, 0, 0]},
                unholy_rite: {name: 'Unholy Rite', shortname: 'Unholy Rite', id: 'unholy_rite', type: 'Guild, Human, Demon', stat: 'H', size: 10, nd: 3, duration: 48, health: [25000000000,33000000000,41000000000,50000000000,0,0], lt: ['u','u','u','u']},
                valanazes: {name: 'Valanazes the Gold', shortname: 'Valanazes', id: 'valanazes', type: 'Dragon', stat: 'S', size: 500, nd: 6, duration: 128, health: [2400000000, 3000000000, 3840000000, 4800000000, 0, 0]},
                valley_of_death: {name: 'Valley of Death', shortname: 'Valley of Death', id: 'valley_of_death', type: 'Ogre, Festival', stat: 'S', size: 250, nd: 5, duration: 48, health: [22000000000, 44000000000, 66000000000, 88000000000, 0, 0], lt: ['valley', 'valley', 'valley', 'valley']},
                valtrias: {name: 'Valtrias', shortname: 'Valtrias', id: 'valtrias', type: 'Demon', stat: 'S', size:25, nd:4, duration:48, health: [6250000000, 12500000000, 18750000000, 25000000000, 0, 0], lt: ['val','val','val','val']},
                blobmonster: {name: 'Varlachleth', shortname: 'Varlachleth', id: 'blobmonster', type: 'Demon', stat: 'H', size: 100, nd: 4, duration: 168, health: [330000000, 412500000, 528000000, 660000000, 0, 0]},
                verkiteia: {name: 'Verkiteia', shortname: 'Verkiteia', id: 'verkiteia', type: 'Dragon', stat: 'S', size: 100, nd: 5, duration: 72, health: [11250000000, 14062500000, 18000000000, 22500000000, 0, 0], lt: ['verk', 'verk', 'verk', 'verk']},
                vineborn_behemoth: {name: 'Vineborn Behemoth', shortname: 'Behemoth', id: 'vineborn_behemoth', type: 'Plant', stat: 'S', size:500, nd:6, duration:96, health: [200000000000,400000000000,600000000000,800000000000,0,0], lt: ['bhm','bhm','bhm','bhm']},
                vortex_abomination: {name: 'Vortex Abomination', shortname: 'Vortex', id: 'vortex_abomination', type: 'Qwiladrian, Magical Creature', stat: 'S', size: 500, nd: 6, duration: 128, health: [50000000000, 75000000000, 110000000000, 205000000000, 0, 0], lt: ['vort', 'vort', 'vort', 'vort']},
                zugen: {name: 'Warlord Zugen', shortname: 'Zugen', id: 'zugen', type: 'Ogre', stat: 'S', size: 25, nd: 4, duration: 48, health: [4000000000, 6000000000, 8000000000, 10000000000, 0, 0], lt: ['zugen', 'zugen', 'zugen', 'zugen']},
                war_swarm: {name: 'War Swarm', shortname: 'War Swarm', id: 'war_swarm', type: 'War, Abyssal, Insect', stat: 'S', size: 100, nd: 4, duration: 24, health: [1000000000000,1000000000000,1000000000000,1000000000000,0,0], lt: ['u','u','u','u']},
                war_bloodsuckers: {name: 'War Bloodsuckers', shortname: 'War Bloodsuckers', id: 'war_bloodsuckers', type: 'War, Abyssal, Insect', stat: 'S', size: 100, nd: 4, duration: 24, health: [1000000000000,1000000000000,1000000000000,1000000000000,0,0], lt: ['u','u','u','u']},
                war_soldier_ants: {name: 'War Soldier Ants', shortname: 'War Soldier Ants', id: 'war_soldier_ants', type: 'War, Abyssal, Insect', stat: 'S', size: 100, nd: 4, duration: 24, health: [500000000000,500000000000,500000000000,500000000000,0,0], lt: ['u','u','u','u']},
                way_warden: {name: 'Way Warden', shortname: 'Way Warden', id: 'way_warden', type: 'Magical Creature', stat: 'S', size:500, nd:6, duration:128, health: [115000000000,230000000000,345000000000,460000000000,0,0], lt: ['way','way','way','way']},
                wexxa: {name: 'Wexxa the Worm-Tamer', shortname: 'Wexxa', id: 'wexxa', type: 'Underground, Beast', stat: 'S', size: 100, nd: 4, duration: 72, health: [110000000, 137500000, 176000000, 220000000, 0, 0]},
                winter_kessov: {name: 'Blood Will Run Cold', shortname: 'Cold Blood', id: 'winter_kessov', type: 'Dragon, Siege', stat: 'ESH', size: 90000, nd: 0, duration: 290, health: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited']},
                xessus: {name: 'Xessus of the Grim Wood', shortname: 'Xessus', id: 'xessus', type: '', stat: 'H', size: 100, nd: 4, duration: 48, health: [500000000, 625000000, 800000000, 1000000000, 0, 0], lt: ['nIns', 'hIns', 'lIns', 'nmIns']},
                malchar: {name: 'Malchar the Tri-Eyed', shortname: 'Malchar', id: 'malchar', type: 'Demon', stat: 'H', size: 100, nd: 4, duration: 48, health: [500000000, 625000000, 800000000, 1000000000, 0, 0], lt: ['nIns', 'hIns', 'lIns', 'nmIns']},
                krasgore: {name: 'Krasgore', shortname: 'Krasgore', id: 'krasgore', type: '', stat: 'H', size: 100, nd: 4, duration: 48, health: [500000000, 625000000, 800000000, 1000000000, 0, 0], lt: ['nIns', 'hIns', 'lIns', 'nmIns']},
                nrlux: {name: 'N\'rlux the Devourer', shortname: 'N\'rlux', id: 'nrlux', type: 'Giant Insect, Beast', stat: 'H', size: 100, nd: 6, duration: 48, health: [10000000000, 12500000000, 16000000000, 20000000000, 0, 0], lt: ['lux', 'lux', 'lux', 'lux']},
                xerkara: {name: 'Xerkara', shortname: 'Xerkara', id: 'xerkara', type: 'Dragon', stat: 'S', size: 500, nd: 6, duration: 128, health: [65000000000, 113750000000, 143000000000, 260000000000, 0, 0], lt: ['z15hi', 'z15hi', 'z15hi', 'z15hi']},
                yule_present_bearer: {name: 'Yule Present Bearer', shortname: 'Present Bearer', id: 'yule_present_bearer', type: 'Human', stat: 'S', size: 100, nd: 5, duration: 48, health: [30000000000, 60000000000, 90000000000, 120000000000, 0, 0], lt: ['yule', 'yule', 'yule', 'yule']},
                yule_punishment_bearer: {name: 'Yule Punishment Bearer', shortname: 'Punishment', id: 'yule_punishment_bearer', type: 'Human, Winter', stat: 'S', size: 50, nd: 4, duration: 48, health: [30000000000,60000000000,90000000000,120000000000,0,0], lt: ['yule2','yule2','yule2','yule2']},
                yydians_sanctuary: {name: 'Yydian\'s Sanctuary', shortname: 'Yydian', id: 'yydians_sanctuary', type: 'Siege, Construct', stat: 'S', size: 250, nd: 5, duration: 96, health: [10000000000, 20000000000, 30000000000, 50000000000, 0, 0], lt: ['yyd', 'yyd', 'yyd', 'yyd']},
                zombiehorde: {name: 'Zombie Horde', shortname: 'Zombies', id: 'zombiehorde', type: 'Undead', stat: 'S', size: 50, nd: 3, duration: 60, health: [45000000, 56250000, 72000000, 90000000, 0, 0]},
                zralkthalat: {name: 'Z\'ralk\'thalat', shortname: 'Z\'ralk\'thalat', id: 'zralkthalat', type: 'Demon', stat: 'S', size: 100, nd: 4, duration: 72, health: [8750000000, 13125000000, 17500000000, 35000000000, 0, 0], lt: ['z10', 'z10', 'z10', 'z10']},
                initiates_of_the_abyss: {name: 'Initiates of the Abyss', shortname: 'Initiates', id: 'initiates_of_the_abyss', type: 'Aquatic', stat: 'S', size: 100, nd: 4, duration: 48, health: [200000000000,400000000000,600000000000,800000000000,0,0], lt: ['u','u','u','u']},
                elite_initiates: {name: 'Elite Initiates', shortname: 'E. Initiates', id: 'elite_initiates', type: 'Abyssal, Aquatic', stat: 'S', size: 100, nd: 4, duration: 26, health: [6000000000000,6000000000000,6000000000000,6000000000000,0,0], lt: ['u','u','u','u']},
                hullbore_worms: {name: 'Hullbore Wyrms', shortname: 'Hullbore Wyrms', id: 'hullbore_worms', type: 'Guild, Abyssal, Aquatic', stat: 'H', size: 100, nd: 4, duration: 48, health: [30000000000,45000000000,60000000000,75000000000,0,0], lt: ['u','u','u','u']},
                elite_5th_terror: {name: 'Elite 5th Terror', shortname: 'E. 5th Terror', id: 'elite_5th_terror', type: 'Abyssal, Aquatic, Terror, Festival', stat: 'S', size: 300, nd: 5, duration: 48, health: [30000000000000,30000000000000,30000000000000,30000000000000,0,0], lt: ['u','u','u','u']},
                elite_karkata: {name: 'Elite Karkata', shortname: 'E. Karkata', id: 'elite_karkata', type: 'Abyssal, Aquatic', stat: 'S', size: 300, nd: 4, duration: 36, health: [20000000000000,20000000000000,20000000000000,20000000000000,0,0], lt: ['u','u','u','u']},
                elite_slitherer: {name: 'Elite Slitherer', shortname: 'E. Slitherer', id: 'elite_slitherer', type: 'Abyssal, Aquatic, Dragon', stat: 'S', size: 20, nd: 2, duration: 18, health: [1000000000000,1000000000000,1000000000000,1000000000000,0,0], lt: ['u','u','u','u']},
                the_sight_of_solus: {name: 'The Sight of Solus', shortname: 'Sight of Solus', id: 'the_sight_of_solus', type: 'Dragon', stat: 'S', size: 20, nd: 1, duration: 36, health: [25000000000,50000000000,75000000000,100000000000,0,0], lt: ['u','u','u','u']},
                engine_of_the_ancients: {name: 'Engine of the Ancients', shortname: 'Engine of the Ancients', id: 'engine_of_the_ancients', type: 'Construct', stat: 'S', size: 250, nd: 5, duration: 72, health: [400000000000,800000000000,1200000000000,1600000000000,0,0], lt: ['u','u','u','u']},
                ascendants_echo: {name: 'Ascendant\'s Echo', shortname: 'Ascendant\'s Echo', id: 'ascendants_echo', type: 'Magical Creature', stat: 'S', size: 50, nd: 3, duration: 48, health: [75000000000,150000000000,225000000000,300000000000,0,0], lt: ['u','u','u','u']},
                drakontos_the_first_terror: {name: 'Drakontos, The First Terror', shortname: 'Drakontos', id: 'drakontos_the_first_terror', type: 'Aquatic, Dragon, Terror', stat: 'S', size: 500, nd: 6, duration: 96, health: [1250000000000,2500000000000,3750000000000,5000000000000,0,0], lt: ['u','u','u','u']}
            },

			raidSizes: {
				10: { name: 'Small', ratios: [0.6, 0.9, 1.2, 1.6, 2.5, 3.5], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				13: { name: 'Small' },
				15: { name: 'Small', ratios: [0.45, 0.6, 0.755, 0.9, 1.05, 1.2, 1.35, 1.5, 1.65, 1.8, 1.95], enames: ['65D', '92D', '119D', '146D', '173D', '200D', '227D', '264D', '301D', '338D', '375D'] },
				20: { name: 'Small' },
				25: { name: 'Small' },
				30: { name: 'Small' },
				40: { name: 'Medium' },
				50: { name: 'Medium', ratios: [0.7, 0.95, 2.05, 3.125, 6.75, 8.5], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				75: { name: 'Medium'},
				100: { name: 'Large', ratios: [0.9, 1.5, 2.2, 3.2, 6.5, 9.0], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				101: { name: 'Epic', ratios: [0.225, 0.325, 0.625, 1.775, 4.525, 10.25], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				125: { name: 'Large'},
				200: { name: 'Epic' },
				250: { name: 'Epic', ratios: [0.225, 0.325, 0.625, 1.775, 4.525, 10.25], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				300: { name: 'Colossal'},
				400: { name: 'Colossal'},
				500: { name: 'Colossal', ratios: [0.45, 0, 0.65, 1.25, 2.5, 9.0], enames: ['1E6T', '1E8T', '2E', '2/3E', '3E', '3/4E'] },
				600: { name: 'Gigantic' },
				800: { name: 'Gigantic' },
				90000: { name: 'World/Event' }
			},

			lootTiers: {
				u: { tiers: ['N/A'], epics: [0], best: 0},
				shade: { tiers: [250,500,1000,1500,2000,2500,5000,7500,10000,15000], epics: [14,41,61,93,125,167,263,297,347,383], best: 5, e: false},
				spire: { tiers: [1000,5000,10000,15000,20000,30000,40000,50000,60000], epics: [61,296,422,470,535,604,675,795,848], best: 1, e: false },
				frost: { tiers: [250,500,1000,1500,2000,2500,5000,7500], epics: [15,40,61,71,103,153,217,248], best: 5, e: false},
				red: { tiers: [200,300,500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000,150000], epics: [2,4,24,54,90,131,164,199,227,267,284,301,317,349,380,397,422,443,479,509,541,604,832,999,1241,1433,1675,1918,2153], best: 7, e: false},
				hbr: { tiers: [200,300,500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000], epics: [2,4,24,54,90,129,161,195,223,261,278,295,311,342,373,389,414,435,470,499,531,592,818,985,1226,1417,1634,1800], best: 7, e: false},
				strm: { tiers: [200,300,500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000], epics: [3,9,27,72,114,148,185,219,256,299,318,337,356,390,427,446,474,496,539,570], best: 4, e: false},
				spr: { tiers: [1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000,20000], epics: [95,104,114,128,140,152,170,192,231,261,306,353,383,414,444,477,539], best: 8, e: false},
				elv: { tiers: [1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000,20000,25000], epics: [95,104,114,128,140,152,170,192,231,261,306,353,383,414,444,477,539,585], best: 8, e: false},
				fst: { tiers: [1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000,20000,25000,30000,35000,40000], epics: [95,104,114,128,140,152,170,192,231,261,306,352,382,415,445,477,539,577,616,655,695], best: 1, e: false},
				pof: { tiers: [3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000,150000,200000], epics: [195,223,263,280,297,315,346,377,395,420,441,477,606,737,899,1460,1953,2447,2940,3433,3933,4907,5913], best: 20, e: false},
				eio: { tiers: [300,500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000,150000], epics: [1,6,13,22,32,40,48,55,65,70,74,78,86,94,98,105,110,119,126,134,149,201,240,278,318,359,408,521], best: 6, e: false},

				ebut: { tiers: [10000,15000,20000,25000,30000,35000,40000,45000,50000], epics: [300,500,750,1250,1750,2050,2350,2650,3200], best: 8, e: false},
				ekil: { tiers: [10000,15000,20000,25000,30000,35000,40000,45000,50000,55000,60000], epics: [300,500,750,1250,1750,2050,2350,2650,3000, 3400, 3900], best: 10, e: false},
				ecas: { tiers: [10000,15000,20000,25000,30000,35000,40000,45000,50000,55000,60000,70000,80000,90000,100000], epics: [300,500,750,1250,1750,2050,2350,2650,3000,3400,3900,4400,5000,5600,6200], best: 10, e: false},
				ewar: { tiers: [10000,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000], epics: [300,700,1250,1800,2500,3150,3900,4600,5500,6000,6400], best: 8, e: false},
				ewsp: { tiers: [10000,15000,20000,25000,30000,35000,40000,45000,50000,55000,60000,70000,80000,90000,100000,125000], epics: [300,500,750,1250,1750,2050,2350,2650,3000,3400,3900,4800,5400,6000,6300,6600], best: 11, e: false},
				emrd: { tiers: [15000,20000,25000,30000,37500,45000,50000,55000,60000,65000,70000,75000,80000,90000,100000], epics: [500,750,1250,1750,2300,2800,3150,3500,3900,4500,5100,5700,6000,6300,6500], best: 11, e: false},
				erid: { tiers: [15000,20000,25000,30000,35000,40000,45000,50000,55000,60000,65000,70000,75000,80000,90000,100000,125000,150000], epics: [500,750,1250,1750,2050,2400,2800,3150,3500,3900,4500,5100,5700,6300,6700,7200,7650,8000], best: 13, e: false},
				eman: { tiers: [20000,25000,30000,35000,40000,45000,50000,55000,60000,65000,70000,75000,80000,90000,100000,125000,150000], epics: [750,1250,1750,2050,2400,2800,3150,3500,3900,4500,5100,5700,6200,6700,7200,7650,8000], best: 12, e: false},
				emal: { tiers: [20000,25000,30000,35000,40000,45000,50000,55000,60000,65000,70000,75000,80000,90000,100000,150000,200000], epics: [750,1250,1750,2050,2400,2800,3150,3500,3900,4500,5100,5700,6100,6900,7800,8400,9000], best: 14, e: false},
				ecec: { tiers: [20000,25000,30000,35000,40000,45000,50000,55000,60000,65000,70000,75000,80000,90000,100000,120000,150000,200000,240000,300000], epics: [750,1250,1600,1900,2200,2500,2800,3100,3900,4300,4700,5100,5500,6200,6900,8300,8800,9200,10000,11000], best: 15, e: false},

				bsh: { tiers:  [1000,1500,2000,2500,3000,4000,5000,7500,10000,15000,20000], epics: [8,12,16,20,24,32,40,60,80,120,160], best: 0, e: true},
				badl: { tiers: [1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000,20000,25000,30000,35000,40000,50000], epics: [37,56,65,70,74,77,84,87,93,109,130,147,168,180,194,212,235,253,269,287,304,335], best: 1, e: false},
				bhm: { tiers: [200,300,400,500,600,700,800,900,1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000,20000,25000,30000,35000,40000], epics: [4,6,10,14,18,19,23,26,29,32,36,40,44,48,53,60,72,83,98,114,125,136,146,157,177,190,203,216,230], best: 8, e: false},
				pot: { tiers: [50,100,200,300,400,500,750,1000], epics: [1,5,7,10,13,15,17,20], best: 2, e: true },
				danc: { tiers: [250,500,750,1000,1500,2000,2500,3000,3500,4000,5000,8000], epics: [4,14,19,25,30,40,54,63,65,70,90,112], best: 3, e: false },
				fel: { tiers: [200,300,500,750,1000,1500,2000,2500,3000,4000,5000,7500,10000], epics: [8,12,16,21,25,33,42,48,54,63,71,81,90], best: 1, e: false},
				fae: { tiers: [200,300,500,750,1000,1500,2000,2500,3000,4000,5000,7500,10000,15000,20000], epics: [8,12,16,21,25,34,42,49,56,65,74,86,97,116,134], best: 1, e: false},
				hort: { tiers: [200,300,500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000,50000,60000,75000], epics: [0,1,6,13,22,32,40,48,55,65,70,74,78,86,94,98,105,110,119,126,134,149,200,237,275], best: 7, e: false},
				jorm: { tiers: [200,300,500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000], epics: [0,1,6,13,22,32,40,48,55,65,70,74,78,86,94,98,105,110,119,126,134,149,200,238,276,315,353,400], best: 7, e: false},
				drac: { tiers: [1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000], epics: [15,23,31,40,48,57,65,69,74,78,86,94,98,103,110,117,126,134,150,198,236,273,311,348,398], best: 4, e: false },
				dopp: { tiers: [100,250,500,750,1000,1250,1500,2000,2500], epics: [1,2,7,12,18,20,25,31,35], best: 4, e: false},
				badb: { tiers: [100,250,500,800,1000,1250,1500,2000,2500,5000], epics: [1,2,5,10,13,17,22,26,30,49], best: 6, e: false},
				way: { tiers: [100,200,300,400,500,600,700,800,880,1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000,20000,25000], epics: [3,6,7,8,10,11,13,14,15,17,21,25,29,31,37,42,45,50,54,62,70,78,85,95,106,126,136], best: 4, e: false},
				marb: { tiers: [100,200,300,400,500,600,700,800,900,1000,1400,2000], epics: [2,4,6,8,10,12,14,16,18,21,32,43], best: 10, e: false},
				abo: { tiers: [200,300,400,500,600,700,800,900,1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000,20000], epics: [6,7,8,10,11,12,13,14,17,21,25,29,33,37,41,45,49,53,60,68,76,83,94,105,126], best: 2, e: false },
				wlds: { tiers: [750,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000], epics: [5,10,15,22,28,37,42,47,52,57,62,67,72,77,82,87,93,100,107,120], best: 5, e: false },
				cwg: { tiers: [100,200,750,1250,1500,2000,2500,3750,5000], epics: [1,2,3,4,5,8,10,12,15], best: 0, e: true },
				val: { tiers: [50,100,250,500,750,1000,1250,1500,2000,2500,5000], epics: [1,2,4,17,21,27,35,44,53,61,99], best: 3, e: false},
				kark: { tiers: [200,300,400,500,600,700,800,900,1000,1250,1500,1750,2000,2250,2500,2750,3000,4000,5000,6000,8000,10000,12500,15000], epics: [8,9,10,11,12,13,14,15,17,20,24,29,32,36,40,44,48,52,59,66,73,80,90,100], best: 2, e: false},
				yule: { tiers: [100,200,300,400,500,750,1000,1500,2000,2500,3000,3500,4000,4500,5000,10000], epics: [0,4,8,10,15,20,30,35,40,50,70,75,80,90,95,125], best: 5, e: true },
				yule2: { tiers: [200,300,400,500,750,1000,1500,2000,2500,3000,3500,4000,5000,10000], epics: [11,22,28,42,57,71,85,114,142,171,185,200,257,371], best: 7, e: false },
				eow: { tiers: [100,200,300,500,1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,35000,40000], epics: [1,2,3,5,10,15,22,28,37,42,47,52,57,63,68,73,78,83,88,95,101,108,115,121], best: 8, e: false },
				gk: { tiers: [150,250,300,400,500,750,1000,1500,2000,2500,3500,5000], epics: [5,6,9,10,12,14,17,23,30,35,49,67], best: 2, e: false },
				murg: { tiers: [150,250,500,750,1000,1500,2000,2500,3000,3500,4000,4500,5000], epics: [0,1,2,5,10,15,31,41,57,67,72,78,87], best: 9, e: false},
				valley: { tiers: [150,250,500,750,1000,1500,2000,2500,3000,3500,4000,4500,5000,6500,8000], epics: [0,1,2,5,10,15,21,35,60,63,67,72,76,84,92], best: 8, e: false},
				bak: { tiers: [100,200,250,300,400,500,650,800,1000,1250,1500,2000], epics: [3,8,10,11,12,15,18,20,26,30,38,47], best: 5, e: false},
				rud: { tiers: [300,500,750,1000,1500], epics: [13,15,17,25,32], best: 1, e: false},
				imx: { tiers: [100,150,200,250,300,400,500,750,1000,1250,1500,1750,2000,2500,3000,3500,4000,4500,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000], epics: [16,21,26,32,38,44,51,69,86,118,142,166,191,239,286,330,355,381,408,435,462,489,516,544,592,640,688,736,815], best: 13, e: false},
				shd: { tiers: [50,75,100,150,200,250,300,500,750,1000], epics: [1,2,5,8,10,12,14,16,19,25], best: 6, e: false},
				hell: { tiers: [200,250,300,500,750,1000,1500,2000,2500,3000,4000,5000,6000,8000,10000], epics: [8,12,16,25,28,34,41,50,58,64,71,77,85,102,120], best: 2, e: false},
				kane: { tiers: [200,250,300,500,750,1000,1500,2000,2500,3000,4000,5000,6000,8000,10000,12500,15000], epics: [6,10,14,21,27,30,37,45,54,62,68,75,81,93,110,127,141], best: 3, e: false},
				dark: { tiers: [200,300,500,750,1000,1500,2000,2500,3000,4000,5000], epics: [2,4,8,14,18,30,40,50,60,75,85], best: 7, e: false},
				gat: { tiers: [1000,1500,2000,2500,3000,4000,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000,25000,30000,40000], epics: [27,48,66,81,94,103,122,132,144,158,176,194,204,209,219,225,242,284,301], best: 2, e: false},
				trex: { tiers: [100,150,200,250,300,400,500,750,1000,1250,1500,1750,2000,2500,3000,3500,4000,4500,5000,6000,7000,8000,9000,10000,12500,15000,17500,20000], epics: [21,28,38,44,47,59,68,94,119,147,179,215,250,308,381,431,498,546,557,593,627,661,691,725,790,861,926,980], best: 14, e: false},
				alch: { tiers: [100,150,200,250,300,400,500,650,800,1000,1250,1500], epics: [4,6,8,9,11,13,15,17,19,20,25,32], best: 5, e: false},
				rann: { tiers: [100,200,300,400,500,600,700,800,900,1000,2000,3000], epics: [12,24,36,48,61,73,85,97,109,122,245,369], best: 9, e: false },
				clock: { tiers: [300,400,750,1000,1500,2000,2500,3000,4000,5000,6000,8000,10000], epics: [56,66,94,118,192,226,254,270,290,360,368,400,460], best: 0, e: false},
				krx: { tiers: [300,400,750,1000,1500,2000,2500,3000,4000,5000,6000,8000], epics: [56,66,94,118,192,226,254,270,290,360,368,400], best: 0, e: false},
				gig: { tiers: [200,300,400,500,750,1000,1500,2000,2500,5000,8000], epics: [36,48,63,76,94,111,146,199,256,400,490], best: 3, e: false},
				rekkr: { tiers: [250,300,400,500,720,1000,1500,2500,3500], epics: [10,11,15,18,23,26,34,37,51], best: 2, e: true},
				rag: { tiers: [225,310,400,510,750,1000,1500,2500,5000], epics: [11,13,17,19,23,27,37,39,61], best: 2, e: true},
				z15lo: { tiers: [225,240,300,400,750,1000,1500,2500,5000], epics: [8,9,14,16,19,23,33,36,48], best: 2, e: true},
				z15hi: { tiers: [225,240,300,400,750,1000,1500,2500,5000,8000], epics: [8,9,14,16,19,23,33,60,90,100], best: 2, e: true},
				apoc: { tiers: [12,24,36,40,60,80,100,120,140,160,180], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true },
				cara: { tiers: [400,500,600,700,800,900,1000,1250,1500,1750,2000,2250,2500,2750,3000], epics: [10,11,12,13,14,15,16,20,24,28,32,36,40,44,48], best: 0, e: true },
				zugen: { tiers: [120,180,225,240,300,400,750,1000,1500], epics: [8,9,10,11,14,16,19,23,33], best: 4, e: true},
				gulk: { tiers: [90,135,150,180,225,300,550,900,1500], epics: [2,5,7,9,11,15,18,22,34], best: 5, e: true },
				verk: { tiers: [100,175,250,300,375,450,525,600,900,1500], epics: [3,8,12,13,15,16,18,21,23,36], best: 2, e: true},
				canib: { tiers: [250,300,380,480,580,660,900,1500,2000,2800,3500], epics: [12,13,14,17,18,21,23,34,46,68,88], best: 0, e: true},
				ruzz: { tiers: [300,400,500,600,700,800,900,1000,1250,1500,1750,2000,2250,2500,2750,3000], epics: [2,5,11,12,13,14,15,16,20,24,28,32,36,40,44,48], best: 2, e: true },
				z10: { tiers: [100,200,300,400,500,600,700,800,900,1000], epics: [7,8,9,10,11,12,13,14,15,16], best: 0, e: true },
				nmDl: { tiers: [105,135,150,225,300,375,450,525,600,675], epics: [2,4,6,8,10,12,14,16,18,20], best: 2, e: true },
				lDl: { tiers: [70,90,100,150,200,250,300,350,400,450], epics: [2,4,6,8,10,12,14,16,18,20], best: 2, e: true },
				hDl: { tiers: [35,45,50,75,100,125,150,175,200,225], epics: [2,4,6,8,10,12,14,16,18,20], best: 2, e: true },
				nDl: { tiers: [7,9,10,15,20,25,30,35,40,45], epics: [2,4,6,8,10,12,14,16,18,20], best: 2, e: true },
				nmTisi: { tiers: [75,105,135,150,225,300,375,450,525,600,675], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true },
				lTisi: { tiers: [50,70,90,100,150,200,250,300,350,400,450], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true },
				hTisi: { tiers: [25,35,45,50,75,100,125,150,175,200,225], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true },
				nTisi: { tiers: [5,7,9,10,15,20,25,30,35,40,45], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true },
				njack: { tiers: [4,20,24,48,72,96,120,144,168,192], epics: [2,3,4,6,7,8,9,10,11,12], best: 0, e: true},
				hjack: { tiers: [6,30,36,72,108,144,180,216,252,288], epics: [2,3,4,6,7,8,9,10,11,12], best: 0, e: true},
				ljack: { tiers: [8,40,48,96,144,192,240,288,336,384], epics: [2,3,4,6,7,8,9,10,11,12], best: 0, e: true},
				nmjack: { tiers: [12,60,72,144,216,288,360,432,504,576], epics: [2,3,4,6,7,8,9,10,11,12], best: 0, e: true},
				hjr: { tiers: [30,150,180,360,750,1500], epics: [8,12,16,27,36,72], best: 0, e: true},
				njr: { tiers: [20,100,120,240,500,1000], epics: [8,12,16,27,36,72], best: 0, e: true},
				ljr: { tiers: [40,200,240,480,1000,2000], epics: [8,12,16,27,36,72], best: 0, e: true},
				nmjr: { tiers: [60,300,360,720,1500,3000], epics: [8,12,16,27,36,72], best: 0, e: true},
				yyd: { tiers: [125,175,250,300,375,450,525,625,900,1500], epics: [3,8,12,13,15,16,18,21,23,36], best: 2, e: true},
				nessy: { tiers: [120,180,225,240,300,500,750,1000], epics: [9,10,11,12,13,14,17,20], best: 1, e: true},
				hurk: { tiers: [90,135,150,180,225,300,550,900], epics: [3,7,10,12,15,19,26,30], best: 2, e: true},
				mall: { tiers: [100,150,225,300,375,450,525,600,900], epics: [3,8,11,12,14,16,18,20,24], best: 1, e: true},
				nIns: { tiers: [5,7,9,10,15,20,25,30,35,40,45], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				hIns: { tiers: [6.250,8.750,11.25,12.50,18.75,25,31.25,37.50,43.75,50,56.25], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				lIns: { tiers: [8,11.20,14.40,16,24,32,40,48,56,64,72], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				nmIns: { tiers: [10,14,18,20,30,40,50,60,70,80,90], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				nker: { tiers: [20,28,36,40,60,80,100,120,140,160,180], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				hker: { tiers: [25,35,45,50,75,100,125,150,175,200,225], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				lker: { tiers: [32,44.80,57.60,64,96,128,160,192,224,256,288], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				nmker: { tiers: [40,56,72,80,120,160,200,240,280,320,360], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				nSlut: { tiers: [6.660,9.324,11.99,13.32,19.98,26.64,33.30,39.96,46.62,53.28,59.94], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				hSlut: { tiers: [8.325,11.66,14.99,16.65,24.98,33.30,41.63,49.95,58.28,66.60,74.93], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				lSlut: { tiers: [10.66,14.92,19.18,21.31,31.97,42.62,53.28,63.94,74.59,85.25,95.90], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				nmSlut: { tiers: [13.32,18.65,23.98,26.64,39.96,53.28,66.60,79.92,93.24,106.6,119.9], epics: [1,2,3,4,5,6,7,8,9,10,11], best: 3, e: true},
				sic: { tiers: [400,500,600,700,800,900,1000,2000], epics: [10,11,12,13,14,15,16,32], best: 0, e: true},
				vort: { tiers: [200,300,400,500,600,700,800,900,1000,1500,2000,2500,3000,3500], epics: [3,10,14,15,17,18,21,23,32,37,44,52,58,90], best: 1, e: true},
				lux: { tiers: [8,17,26,35,45,56,67,78,90,103,116,129,143,157,173,188,202,220,238,255,270,293,311,330,350], epics: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], best: 9, e: true },
				keron: { tiers: [8,17,26,35,45,56,67,78,90,103,116,129,143,157,173,188,202,220,238,255,270,293,311,330,350,1000], epics: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,30], best: 9, e: true }
			},
			camps: {
				bob: {name: 'Bastion of Blood', time: [120, 96], prefixes: 'Regenerating, Morphling, Vengeful, Chilling', numNodes: 6, nodes: ['bmp', 'gor', 'chi', 'zh', 'sic', 'bob'],
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Nerfed: -30% player damage, special loot from EoC'],
					tiers: [[5, 31, 0],[25, 32, 0],[75, 33, 0],[100, 34, 0],[200, 35, 7],[250, 36, 8],[320, 37, 9],[375, 38, 10],[480, 39, 11],[550, 43, 14],[640, 46, 17],[960, 48, 22],[1500, 50, 24],[2400, 53, 26],[2750, 55, 29],[5000, 62, 38],[7000, 64, 42],[10000, 69, 47],[15000, 74, 52]],
					bmp: {name: 'Black Moon Pack', sname: 'Bmp', type: 'Human, Campaign', size: 25, hp: [6000, 18000], gold: false,                         tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]},
					gor: {name: 'Gorgon', sname: 'Gor', type: 'Campaign', size: 50, hp: [12000, 36000], gold: false,                                        tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]},
					chi: {name: 'Chimera', sname: 'Chi', type: 'Campaign', size: 75, hp: [28000, 84000], gold: false,                                       tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]},
					zh: {name: 'Zombie Horde', sname: 'ZH', type: 'Campaign, Undead', size: 100, hp: [50000, 150000], gold: false,                          tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
					sic: {name: 'Byron Siculus', sname: 'Sic', type: 'Campaign', size: 100, hp: [50000, 150000], gold: true,                                tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
					bob: {name: 'Bastion of Blood', sname: 'BoB', type: 'Campaign, Undead, Siege', size: 100, hp: [50000, 150000], gold: false,             tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}},
				mam: {name: 'Monsters and Magma', time: [120, 96], prefixes: 'Regenerating, Vengeful, Chilling, Curse', numNodes: 7, nodes: ['wlp', 'tos', 'gol', 'ele', 'gmh', 'wrm', 'imx'],
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Fatigued: -45% player damage, special loot and +3 slots from EoC', 'Endurance Run: Node timer set to 4h, Molten Troves in EoC'],
					tiers: [[5, 31, 0],[25, 32, 0],[75, 33, 0],[100, 34, 0],[200, 35, 7],[250, 36, 8],[320, 37, 9],[375, 38, 10],[480, 39, 11],[550, 40, 12],[640, 41, 13],[960, 42, 14],[1500, 43, 15],[2400, 44, 16],[2750, 45, 17],[4500, 58, 24],[5000, 62, 38],[5500, 64, 26],[7000, 64, 42],[7500, 74, 28],[10000, 69, 47],[15000, 74, 52]],
					wlp: {name: 'Imryx\'s Whelps', sname: 'Wlp', type: 'Dragon, Underground, Campaign', size: 25, hp: [7000, 21000], gold: false,           tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0]},
					tos: {name: 'Magma Tossers', sname: 'Tos', type: 'Underground, Construct, Campaign', size: 50, hp: [13000, 39000], gold: false,         tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0]},
					gol: {name: 'Magma Golem', sname: 'Gol', type: 'Underground, Construct, Campaign', size: 50, hp: [16000, 48000], gold: true,            tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0]},
					ele: {name: 'Magma Elemental', sname: 'Ele', type: 'Underground, Magical Creature, Campaign', size: 75, hp: [30000, 90000], gold: false,tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0]},
					gmh: {name: 'Grt. Magma Horror', sname: 'Gmh', type: 'Campaign, Undead', size: 100, hp: [55000, 165000], gold: false,                   tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1]},
					wrm: {name: 'Magma Worm', sname: 'Wrm', type: 'Underground, Campaign', size: 100, hp: [60000, 180000], gold: true,                      tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1]},
					imx: {name: 'Imryx the Incinerator', sname: 'Imx', type: 'Dragon, Underground, Campaign', size: 100, hp: [65000, 195000], gold: false,  tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0]}},
				gd: {name: 'The Grey Death', time: [120, 96], prefixes: 'Regenerating, Vengeful, Chilling, Curse', numNodes: 6, nodes: ['crk', 'zrn', 'nun', 'tms', 'crn', 'hrt'],
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Fatigued: -45% player damage, special loot and +3 slots from EoC'],
					tiers: [[25, 31, 0],[100, 34, 0],[200, 36, 6],[300, 38, 9],[500, 40, 14],[750, 42, 16],[1000, 45, 18],[2500, 48, 21],[4100, 50, 25],[6500, 58, 29],[6500, 54, 27],[8500, 62, 31],[8500, 63, 32],[10000, 64, 33],[15000, 66, 35],[20000, 68, 37],[30000, 70, 39],[40000, 73, 41]],
					crk: {name: 'Carshk the Marauder', sname: 'Crk', type: 'Campaign', size: 25, hp: [8000, 25600], gold: false,                            tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0]},
					zrn: {name: 'Zranras', sname: 'Zrn', type: 'Campaign, Beastman', size: 50, hp: [15000, 48000], gold: false,                             tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0]},
					nun: {name: 'General Nund', sname: 'Nun', type: 'Campaign, Ogre', size: 50, hp: [20000, 50000], gold: false,                            tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0]},
					tms: {name: 'Thurmavus the Ripper', sname: 'Tms', type: 'Campaign, Dragon', size: 100, hp: [75000, 202500], gold: false,                tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1]},
					crn: {name: 'Craenaestra the Stalker', sname: 'Crn', type: 'Campaign, Dragon', size: 100, hp: [80000, 224000], gold: true,              tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1]},
					hrt: {name: 'Horthania the Grey', sname: 'Hrt', type: 'Campaign, Dragon', size: 100, hp: [90000, 270000], gold: false,                  tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1]}},
				goc: {name: 'Giants of Chalua', time: [120, 96], prefixes: 'Regenerating, Vengeful, Chilling, Curse', numNodes: 6, nodes: ['mwm', 'bl', 'gh', 'fgs', 'gc', 'ha'],
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Fatigued: -45% player damage, Boss loot from EoC', 'Endurance Run: Node timer set to 4h, 10 guild tokens in EoC'],
					tiers: [[25, 32, 0, 0],[150, 34, 0, 0],[250, 35, 7, 0],[480, 39, 11, 0],[640, 41, 16, 0],[960, 42, 18, 1],[1500, 43, 19, 1],[2500, 45, 21, 3],[4750, 48, 25, 4],[5500, 52, 27, 5],[6400, 54, 29, 5],[8750, 56, 31, 6],[10000, 58, 34, 6],[15000, 60, 38, 8],[25000, 64, 44, 9],[30000, 66, 46, 9],[35000, 68, 48, 9],[40000, 70, 50, 9],[50000, 74, 56, 10]],
					mwm: {name: 'Monkey Warrior Minions', sname: 'MWM', type: 'Human, Campaign', size: 25, hp: [15000, 45000], gold: false,                 tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]},
					bl: {name: 'Basileus Lizard', sname: 'BL', type: 'Campaign', size: 50, hp: [25000, 75000], gold: false,                                 tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]},
					gh: {name: 'Giant Hunter', sname: 'GH', type: 'Giant, Campaign', size: 75, hp: [55000, 165000], gold: false,                            tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0]},
					fgs: {name: 'Fire Giant Shaman', sname: 'FGS', type: 'Giant, Campaign', size: 100, hp: [100000, 250000], gold: false,                   tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0]},
					gc: {name: 'Giant Cook', sname: 'GC', type: 'Giant, Campaign', size: 100, hp: [125000, 312500], gold: true,                             tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0]},
					ha: {name: 'Hitullpa Aatqui', sname: 'HA', type: 'Giant, Campaign', size: 100, hp: [150000, 375000], gold: false,                       tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1]}},
				fw: {name: 'The Frozen War', time: [120, 96], prefixes: 'Frighten Mount, Ethereal, Trample, Intimidate, Vulnerable, Vengeful, Chilling, Curse', numNodes: 6, nodes: ['ur', 'fe', 'nsg', 'bsn', 'bsh', 'eiw'],
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Fatigued: -45% player damage, Extra loot from EoC', 'Endurance Run: Node timer set to 4h, 10 guild tokens in EoC'],
					tiers: [[25, 32, 0, 0],[150, 34, 0, 0],[250, 35, 7, 0],[480, 39, 11, 0],[640, 41, 16, 0],[960, 42, 18, 1],[1500, 86, 38, 1],[2500, 90, 42, 3],[4750, 96, 50, 4],[5500, 104, 54, 5],[6400, 108, 58, 5],[8750, 112, 62, 6],[10000, 116, 68, 6],[15000, 120, 76, 8],[10000, 112, 62, 6],[15000, 116, 68, 8],[25000, 120, 76, 9],[30000, 132, 92, 9],[35000, 136, 96, 9],[40000, 140, 100, 9],[50000, 150, 112, 9]],
					ur: {name: 'Ursine Raiders', sname: 'UR', type: 'Aquatic, Human, Campaign', size: 25, hp: [18000, 54000], gold: false,                  tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]},
					fe: {name: 'Frost Elemental', sname: 'FE', type: 'Aquatic, Magical Cereature, Campaign', size: 50, hp: [28000, 84000], gold: false,     tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]},
					nsg: {name: 'Northern Sea Giant', sname: 'NSG', type: 'Aquatic, Giant, Campaign', size: 100, hp: [105000, 262500], gold: false,         tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0]},
					bsn: {name: 'Konguar, Giant King & Jormungan the Sea-Storm (Normal)', sname: 'BSN', type: 'Aquatic, Dragon, Giant, Campaign', size: 100, hp: [160000, 400000], gold: false, tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], epics: [0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1]},
					bsh: {name: 'Konguar, Giant King & Jormungan the Sea-Storm (Hard)', sname: 'BSH', type: 'Aquatic, Dragon, Giant, Campaign', size: 100, hp: [160000, 400000], gold: false, tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], epics: [0,0,0,0,0,1,1,1,2,2,3,0,0,0,3,4,4,5,5,6,6]},
					eiw: {name: 'Elvigar the Ice Waver', sname: 'EIW', type: 'Aquatic, Undead, Campaign', size: 100, hp: [170000, 425000], gold: true,      tiers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1], epics: [0,0,0,0,0,1,1,1,1,1,2,0,0,0,3,4,5,6,7,8,10]}},
				nmq: {
					name: 'The Nightmare Queen\'s Horde', time: [120, 96], numNodes: 7, nodes: ['pgs', 'bwp', 'to', 'nr', 'cr', 'nh', 'tqc'],
					prefixes: 'Frighten Mount, Regenerating, Ethereal, Trample, Intimidate, Vulnerable, Vengeful, Chilling, Curse',
					mods: ['Speed Run: halved camp timer, +20% guild rep from EoC', 'Hailstorm: +1 prefix, +20% guild exp from EoC', 'Fatigued: -45% player damage, Extra loot from EoC', 'Endurance Run: Node timer set to 4h, 10 guild tokens in EoC'],
					tiers: [
						[150, 2, 1, 0],[250, 2, 2, 0],[960, 8, 8, 0],[2000, 17, 17, 6],
						[4000, 34, 34, 6],[6500, 56, 56, 7],[10000, 88, 88, 10],[15000, 130, 130, 11],
						[25000, 220, 220, 12],[50000, 445, 445, 15],[75000, 665, 665, 25],[100000, 870, 870, 30],
						[150000, 1800, 1800, 35],[200000, 2600, 2600, 40],[300000, 3600, 3600, 0],[400000, 4400, 4400, 0]
					],
					pgs: {name: 'Pillagers', sname: 'PGS', type: 'Campaign, Orc, Goblin, Nightmare Queen',
						size: 25, hp: [75000, 150000], gold: false,
						tiers: [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
						epics: [0,0,0,17,18,19,20,30,30,40,60,76,0,0,0,0]},
					bwp: {name: 'Blood Wolf Patroller', sname: 'BWP', type: 'Campaign, Orc, Beast, Nightmare Queen',
						size: 50, hp: [125000, 250000], gold: false,
						tiers: [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0]},
					to: {name: 'Trance Ogre', sname: 'TO', type: 'Campaign, Ogre, Nightmare Queen',
						size: 50, hp: [130000, 260000], gold: false,
						tiers: [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0]},
					nr: {name: 'Nightmare Riders', sname: 'NR', type: 'Campaign, Goblin, Orc, Ogre, Nightmare Queen',
						size: 75, hp: [200000, 400000], gold: false,
						tiers: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0]},
					cr: {name: 'Centipede Riders', sname: 'CR', type: 'Campaign, Goblin, Beast, Nightmare Queen',
						size: 75, hp: [195000, 390000], gold: false,
						tiers: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0]},
					nh: {name: 'Nightmare Hives', sname: 'NH', type: 'Campaign, Ogre, Beast, Nightmare Queen',
						size: 75, hp: [300000, 600000], gold: true,
						tiers: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
						epics: [0,0,0,0,1,2,3,3,4,5,5,6,6,'?',10,0]},
					tqc: {name: 'The Queen\'s Chosen', sname: 'TQC', type: 'Campaign, Orc, Goblin, Ogre, Beast, Nightmare Queen',
						size: 100, hp: [400000, 800000], gold: false,
						tiers: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
						epics: [0,0,0,0,1,2,2,3,4,5,6,6,7,'?','?',10]}
				}
			},
            fails: 0,
            load: function () {
                if (document.getElementById("gamefilearea") !== null) {
                    window.onbeforeunload = function(){DotDX.config.save(false)};
                    DotDX.fails = 0;
                    console.log('[DotDX] Core loaded. Loading user interface...');
                    DotDX.gui.load();
                    DotDX.request.init();
                    setTimeout(function(){delete DotDX.load}, 100);
                }
                else if(++DotDX.fails < 20) {
                    console.log('[DotDX] Missing needed AG resources (try:' + DotDX.fails + '), retrying in 0.75 second...');
                    setTimeout(DotDX.load, 750);
                }
                else {
                    console.log('[DotDX] Unable to locate required AG resources. Loading aborted');
                    setTimeout(function(){delete DotDX}, 1);
                }
            }
        };
        console.log('[DotDX] Initialized. Checking for needed AG resources...');
        DotDX.load();
    }

    console.log('[DotDX] Initializing...');
    if (window.top == window.self) {
    document.addEventListener("dotd.req", function (param) {
        var p = JSON.parse(param.data);
        if (p.wrappedJSObject) p = p.wrappedJSObject;
        p.callback = function (e, r) {
            this.onload = null;
            this.onerror = null;
            this.ontimeout = null;
            this.event = e;
            this.status = r.status;
            this.responseText = r.responseText;
            var c = document.createEvent("MessageEvent");
            if (c.initMessageEvent) c.initMessageEvent(this.eventName, false, false, JSON.stringify(this), document.location.protocol + "//" + document.location.hostname, 1, unsafeWindow, null);
            else c = new MessageEvent(this.eventName, {"origin": document.location.protocol + "//" + document.location.hostname, "lastEventId": 1, "source": unsafeWindow, "data": JSON.stringify(this)});
            document.dispatchEvent(c);
        };
        p.onload = p.callback.bind(p, "load");
        p.onerror = p.callback.bind(p, "error");
        p.ontimeout = p.callback.bind(p, "timeout");
        setTimeout(function () {
            GM_xmlhttpRequest(p)
        }, 1);
    });
    var scr = document.createElement('script');
    scr.appendChild(document.createTextNode('(' + main + ')()'));
    document.head.appendChild(scr);
    }
}