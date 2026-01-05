// ==UserScript==
// @name        WoTStatScript - Forums
// @version     0.9.20.0.1
// @description Adds stats and links for posts on official World of Tanks forums
// @author      Orrie
// @contributor seriych
// @namespace   http://forum.worldoftanks.eu/index.php?/topic/263423-
// @icon        https://i.imgur.com/AxOhQ7C.png
// @include     /^http:\/\/forum\.worldoftanks\.(eu|com|ru|asia|kr)\/\S+(\/topic\/|\?showtopic=)/
// @include     /^http:\/\/forum\.worldoftanks\.(eu|com|ru|asia|kr)\/index\.php\?app=members&module=messaging&section=view&do=showConversation&topicID=\d+/
// @include     /^http:\/\/forum\.worldoftanks\.(eu|com|ru|asia|kr)\/index\.php\?\/forum/\S+/
// @grant       none
// @connect     api.worldoftanks.eu
// @connect     api.worldoftanks.ru
// @connect     api.worldoftanks.com
// @connect     api.worldoftanks.asia
// @connect     api.worldoftanks.kr
// @connect     www.wnefficiency.net
// @connect     puu.sh
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/660/WoTStatScript%20-%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/660/WoTStatScript%20-%20Forums.meta.js
// ==/UserScript==
(function() {
	// global vars
	var d = document;

	// get server info and webpage
	var wg = {host:d.location.host, href:d.location.href, clan:{}};
		wg.srv = wg.host.match(/\.(eu|ru|com|asia|kr)/)[1].replace(/com/,"na");
		wg.topic = /(\/topic\/|\?showtopic=|messaging\&)/.test(wg.href);
		wg.forum = /\/forum\//.test(wg.href);
		wg.login = !!d.getElementsByClassName('js-cm-login-link')[0];

	// server, API and cluster settings
	var sc = {
		vers: ((GM_info) ? GM_info.script.version : ""),
		host: "https://greasyfork.org/scripts/660-wotstatscript-forumsextendedstat",
		user: {
			wl: "https://forum.wotlabs.net/index.php?/user/1618-orrie/",
			wot: "https://worldoftanks.eu/community/accounts/505838943-Orrie/"
		},
		top: {
			eu: "https://forum.worldoftanks.eu/index.php?showtopic=263423",
			na: "https://forum.worldoftanks.com/index.php?showtopic=404652"
		},
		cred: { // translators
			cs: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/500744969/'>Crabtr33</a></td><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/508323506/'>Ragnarocek</a></td></tr><tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/508904714/'>jViks</a></td></tr>" ,
			de: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/504873051/'>ArtiOpa</a></td><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/501118529/'>Crakker</a></td></tr><tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/501072645/'>multimill</a></td><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/500373105/'>coolathlon</a></td></tr>",
			fr: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/506641783/'>SuperPommeDeTerre</a></td></tr>",
			pl: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/501801562/'>KeluMocy</a></td><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/504412736/'>pokapokami</a></td></tr>",
			es: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/512759883/'>Frodo45127</a></td></tr>",
			tr: "<tr><td><a class='b-orange-arrow' href='https://worldoftanks.eu/community/accounts/500400806/'>Ufuko</a></td></tr>",
			ru: "<tr><td>dimon222</td></tr>"
		},
		srv: {
			s: "en",
			wl: false, // wotlabs
			nm: false, // noobmeter
			vb: false, // vbaddict
			ws: false, // wotstats
			wr: false, // wotreplays
			ct: false, // clan-tools
			wlf: false // wot-life
		},
		api: {
			wg_key: "a7595640a90bf2d19065f3f2683b171c"
		},
		sym: ",",
		wn: "https://static.modxvm.com/wn8-data-exp/json/wn8exp.json",
		date: Date.now(),
		dateFormat: {ru: "ru-RU", eu: "en-GB", na: "en-US", asia: "en-AU", kr: "ko-KR"},
		web: {
			gecko: typeof InstallTrigger !== 'undefined',
			opera: !!window.opera || /opera|opr/i.test(navigator.userAgent),
			chrome: !!window.chrome && !!window.chrome.webstore,
			safari: /constructor/i.test(window.HTMLElement)
		}
	};

	// script functions
	var sf = {
		apiInfoHnd: function (resp) { // processing information from player API
			var data = resp.data;
			for (var a in data) {
				if (data.hasOwnProperty(a)) {
					var pData = data[a];
					if (pData !== null) {
						// store stats
						var pDataStats = pData.statistics.all;
						s[pData.account_id].u = {
							name: pData.nickname,
							id: pData.account_id,
							cid: pData.clan_id,
							bat: pDataStats.battles,
							win: (pDataStats.wins/pDataStats.battles)*100,
							dmg: pDataStats.damage_dealt/pDataStats.battles,
							frag: pDataStats.frags/pDataStats.battles,
							spot: pDataStats.spotted/pDataStats.battles,
							def: pDataStats.dropped_capture_points/pDataStats.battles,
							wgr: pData.global_rating,
							lng: pData.client_language,
							time: pData.created_at,
							ban: pData.ban_time
						};
					}
					else {
						// store stats
						s[parseFloat(a)].u = {
							bat: 0
						};
					}
				}
			}
			sf.request(sc.api.v, sf.apiVehHnd);
		},
		apiVehHnd: function (resp) { // processing information from vehicle API and calculate WN8
			var data = resp.data;
			for (var p in data) {
				if (data.hasOwnProperty(p)) {
					var vData = data[p];
					if (vData !== null) {
						var rWin, rDmg, rFrag, rSpot, rDef, wn8 = 0, battles = 0;
						if (s[p].u.bat > 0) {
							for (var v in vData) {
								if (vData.hasOwnProperty(v)) {
									for (var _so=0, _so_len = statArr.length; _so<_so_len; _so++) {
										if (statArr[_so].IDNum == vData[v].tank_id) {
											var vehStat = statArr[_so],
											dataBattles = vData[v].statistics.battles;
											s[p].v.frag += vehStat.expFrag    * dataBattles;
											s[p].v.dmg  += vehStat.expDamage  * dataBattles;
											s[p].v.spot += vehStat.expSpot    * dataBattles;
											s[p].v.def  += vehStat.expDef     * dataBattles;
											s[p].v.win  += vehStat.expWinRate * dataBattles;
											battles += dataBattles;
											break;
										}
									}
								}
							}
							rWin  = Math.max(((s[p].u.win/(s[p].v.win/battles)-0.71)/(1-0.71)),0);
							rDmg  = Math.max(((s[p].u.dmg/(s[p].v.dmg/battles)-0.22)/(1-0.22)),0);
							rFrag = Math.max(Math.min(rDmg+0.2,((s[p].u.frag/(s[p].v.frag/battles)-0.12)/(1-0.12))),0);
							rSpot = Math.max(Math.min(rDmg+0.1,((s[p].u.spot/(s[p].v.spot/battles)-0.38)/(1-0.38))),0);
							rDef  = Math.max(Math.min(rDmg+0.1,((s[p].u.def /(s[p].v.def /battles)-0.10)/(1-0.10))),0);
							wn8 = 980*rDmg + 210*rDmg*rFrag + 155*rFrag*rSpot + 75*rDef*rFrag + 145*Math.min(1.8,rWin);
						}
						// store wn8
						s[p].wn8 = sf.color(wn8,"wn8",0);
					}
				}
			}
			sf.statInsert();
		},
		statInsert: function () { // insert stats and links to every post
			for (var y in s) {
				if (s.hasOwnProperty(y)) {
					var iPost = postObj.ids.indexOf(y), flag;
					if (iPost >- 1 && s[y].u.id) {
						if (wg.topic) {
							var userStats = [
								"<td>"+loc[1]+"</td><td>"+sf.color((s[y].u.bat > 0) ? s[y].u.win : 0,"wr",2,"%")+"</td>",
								"<td>"+loc[2]+"</td><td>"+sf.color(s[y].u.bat,"bat",0,"")+"</td>",
								"<td>"+loc[3]+"</td><td>"+sf.color(s[y].u.wgr,"pr",0,"")+"</td>",
								"<td>"+loc[4]+"</td><td>"+s[y].wn8+"</td>"
							],
							userLinks = [
								[
									["<a target='_blank' href='https://worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/community/accounts/"+s[y].u.id+"-"+s[y].u.name+"/'>Player Profile</a>"],
									[sc.srv.wl, "<a target='_blank' href='https://wotlabs.net/"+sc.srv.wl+"/player/"+s[y].u.name+"'>WoTLabs</a>"]
								],
								[
									[sc.srv.vb, "<a target='_blank' href='https://www.vbaddict.net/player/"+s[y].u.name.toLowerCase()+"-"+sc.srv.vb+"'>vBAddict</a>"],
									[sc.srv.nm, "<a target='_blank' href='https://noobmeter.com/player/"+sc.srv.nm+"/"+s[y].u.name+"'>Noobmeter</a>"]
								],
								[
									[sc.srv.ws, "<a target='_blank' href='https://wotstats.org/stats/"+sc.srv.ws+"/"+s[y].u.name+"/'>WoTstats</a>"],
									[sc.srv.ct, "<a target='_blank' href='https://clantools.us/servers/"+sc.srv.ct+"/players?id="+s[y].u.id+"'>Clan Tools</a>"]
								],
								[
									[sc.srv.wr, "<a target='_blank' href='https://wotreplays."+sc.srv.wr+"/player/"+s[y].u.name+"'>WoTReplays</a>"],
									(wg.srv=="ru") ? [sc.srv.wr, "<a target='_blank' href='https://wots.com.ua/user/stats/"+s[y].u.name+"'>WoTS.com.ua</a>"] : [sc.srv.wlf, "<a target='_blank' href='https://en.wot-life.com/"+sc.srv.wlf+"/player/"+s[y].u.name+"/'>WoT-Life</a>"]
								]
							];
							for (var _i=0, _i_len = postObj.num[iPost].length; _i<_i_len; _i++) {
								var post = postObj.post[postObj.num[iPost][_i]],
								groupTitle = post.getElementsByClassName("group_title")[0],
								basicInfo = post.getElementsByClassName("basic_info")[0],
								infoClass = post.getElementsByClassName("author_info")[0],
								statTable = sf.elem("table", "t-table-stats", ""),
								urlTable = sf.elem("div", "b-table-links", "<table class='t-table-links'><tbody></tbody></table>");
								// insert stats
								for (var _sr=0, _sr_len = userStats.length; _sr<_sr_len; ++_sr) {
									statTable.appendChild(sf.elem("tr", "", userStats[_sr]));
								}
								// insert links
								for (var _l=0, _l_len = userLinks.length; _l<_l_len; ++_l) {
									var uRow = sf.elem("tr", "", "");
									for (var _lr=0, _lr_len = userLinks[_l].length; _lr<_lr_len; ++_lr) {
										uRow.appendChild((userLinks[_l][_lr][0] && userLinks[_l][_lr][1]) ? sf.elem("td", "", userLinks[_l][_lr][1]) : sf.elem("td", "", userLinks[_l][_lr][0]));
									}
									urlTable.firstElementChild.firstElementChild.appendChild(uRow);
								}
								// modify date
								basicInfo.lastElementChild.lastElementChild.innerHTML = new Date(s[y].u.time*1000).toLocaleDateString(sc.dateFormat[wg.srv]);
								// add client flag, if not on Russian forum
								if (wg.srv !== "ru") {
									flag = sf.elem("img", "i-xvm-lang", "", "", "https://bytebucket.org/seriych/worldoftanksforumextendedstat.user.js/raw/tip/data/img/lang/"+s[y].u.lng+".png");
									flag.title = s[y].u.lng.toUpperCase()+" "+loc[0];
									flag.addEventListener('error', sf.flag);
									groupTitle.appendChild(flag);
								}
								// add bantime if it exists
								if (s[y].u.ban) {
									var memTitle = post.getElementsByClassName("member_title")[0];
									memTitle.textContent = "Banned: "+ new Date(s[y].u.ban*1000).toLocaleString(sc.dateFormat[wg.srv]);
									memTitle.classList.add("member_banned");
								}
								basicInfo.insertBefore(statTable, basicInfo.lastElementChild);
								infoClass.appendChild(urlTable);
							}
						}
						else if (wg.forum) {
							for (var _r=0, _r_len = postObj.num[iPost].length; _r<_r_len; _r++) {
								var statCell, id_url = postObj.span[postObj.num[iPost][_r]].getElementsByClassName("url")[0],
								threadRow = postObj.span[postObj.num[iPost][_r]].parentNode.parentNode,
								threadRowClsList = threadRow.classList;
								if (threadRowClsList.contains("announcement")) {
									statCell = threadRow.insertCell(1);
								}
								else if (threadRowClsList.contains("__topic")) {
									statCell = threadRow.insertCell(3);
								}
								statCell.className = "col_f_stats";
								if (!id_url || s[y].u.bat === 0) {
									statCell.appendChild(sf.elem("span", "s-no-stats", loc[6]));
								}
								else {
									var statsRow = [
										"<td>"+loc[1]+"</td><td>"+sf.color((s[y].u.bat > 0) ? s[y].u.win : 0,"wr",2,"%")+"</td><td>"+loc[2]+"</td><td>"+sf.color(s[y].u.bat,"bat",0,"")+"</td>",
										"<td>"+loc[3]+"</td><td>"+sf.color(s[y].u.wgr,"pr",0,"")+"</td><td>"+loc[4]+"</td><td>"+s[y].wn8+"</td>",
									],
									rowTable = sf.elem("table", "t-row-stats", "");
									for (var _rr=0, _rr_len = statsRow.length; _rr<_rr_len; ++_rr) {
										rowTable.appendChild(sf.elem("tr", "", statsRow[_rr]));
									}
									if (wg.srv !== "ru") {
										flag = sf.elem("img", "i-xvm-lang", "", "", "https://bytebucket.org/seriych/worldoftanksforumextendedstat.user.js/raw/tip/data/img/lang/"+s[y].u.lng+".png");
										flag.title = s[y].u.lng.toUpperCase()+" "+loc[0];
										flag.addEventListener('error', sf.flag);
										statCell.appendChild(flag);
									}
									statCell.appendChild(rowTable);
								}
							}
						}
					}
				}
			}
		},
		color: function (input, type, dec, sym) { // color formatting
			var color = colArr.dft[0],
			output = input.toFixed(dec);
			if (sym) {
				output += sym;
			}
			if (input >= 1000) {
				output = input.toFixed(dec).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+sc.sym);
			}
			for (var c in colArr) {
				if (colArr.hasOwnProperty(c)) {
					if (input >= colArr[c][colArr.id[type]]) {
						color = colArr[c][0]; break;
					}
				}
			}
			return "<font color='"+color+"'>"+output+"</font>";
		},
		elem: function (tag, name, html, type, src) { // element creation
			var element = d.createElement(tag);
			if (name) {element.className = name;}
			if (html) {
				if (/</.test(html)) {
					element.innerHTML = html;
				}
				else {
					element.textContent = html;
				}
			}
			if (type) {element.type = type;}
			if (src) {element.src = src;}
			return element;
		},
		flag: function (elem) { // image error picture
			elem.src=uri.q_mark;
		},
		settings: function (name, text) { // script menu handler
			var setItem = sf.elem("li", "b-settingItem"),
			setDiv = sf.elem("div", "b-settingParent b-"+name, "<a>"+text+"</a>");
			switch(name) {
				case ("wnRefresh"):
					setDiv.addEventListener('click', function() {localStorage.removeItem("wnExpValues"); location.reload();}, false);
				break;
				default: break;
			}
			setItem.appendChild(setDiv);
			return setItem;
		},
		links: function (parent, links, type) { // statistic links handler
			var linksFragment = d.createDocumentFragment();
			for (var _l=0, _l_len = links.length; _l<_l_len; ++_l) {
				switch(type) {
					case ("table"):
						var link = sf.elem("tr");
						for (var _lr=0, _lr_len = links[_l].length; _lr<_lr_len; ++_lr) {
							link.appendChild((links[_l][_lr][0] && links[_l][_lr][1]) ? sf.elem("td", "", links[_l][_lr][1]) : sf.elem("td", "", links[_l][_lr][0]));
						}
						linksFragment.appendChild(link);
					break;
					case ("list"):
						if (links[_l] instanceof HTMLElement) {
							linksFragment.appendChild(links[_l]);
						}
						else {
							linksFragment.appendChild((links[_l][0] && links[_l][1]) ? sf.elem("li", "", links[_l][1]) : sf.elem("li", "statname", links[_l][0]));
						}
					break;
					default: break;
				}
			}
			parent.appendChild(linksFragment);
		},
		storage: function (name, data, type, mode) { // localstorage handler
			var storage;
			switch(type) {
				case ("set"):
					if (mode == "string") {
						data = JSON.stringify(data);
					}
					storage = localStorage.setItem(name, data);
					break;
				case ("get"):
					storage = localStorage.getItem(name);
					if (mode == "parse") {
						storage = JSON.parse(storage);
					}
					break;
				default: break;
			}
			return storage;
		},
		wn: function (resp) { // wnefficiency handler
			sf.storage("wnExpValues", resp, "set", "string");
			sf.storage("wnExpDate", sc.date, "set");
			sf.storage("wnExpVers", [sc.vers, resp.header.version], "set", "string");
			location.reload();
		},
		request: function (url, handler) { // request handler
			fetch(url, {
				method: "GET",
				headers: {
					"Accept": "application/json"
				}
			}).then(function(resp) {
				if (resp.status >= 200 && resp.status < 300) {
					return resp.json();
				}
				throw new Error(resp.statusText);
			}).then(function(resp) {
				handler(resp);
			});
		}
	};

	// region settings for external sites
	switch(wg.srv) {
		case ("eu"): // eu server
			sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.wr = sc.srv.ct = sc.srv.wlf = wg.srv;
			break;
		case ("ru"): // ru server
			sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.wr = sc.srv.ct = sc.srv.wlf = wg.srv;
			sc.srv.s = "ru";
			sc.sym = " ";
			break;
		case ("com"): // na server
			sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.ct = "na"; sc.srv.wr = "com";
			break;
		case ("asia"): // asia server
			sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = "sea"; sc.srv.ct = wg.srv; sc.srv.wr = "com";
			break;
		case ("kr"): // korean server
			sc.srv.wl = sc.srv.nm = sc.srv.vb = sc.srv.ws = sc.srv.ct = sc.srv.ch = wg.srv; sc.srv.wr = "com";
			break;
		default: break;
	}

	// data uri
	var uri = {
		icon_arrow:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAAAJCAMAAAAhKrH/AAAAV1BMVEUAAAD///+TKCf9AQmTLiX9AQmTMir9AQmTLif9AQmTMSz9AQmTMir9AQmTMyn9AQmTMirvGgKTMirsIAGTMirwGQOTMiqTMirsIAGaNDGgNzfqJwDrJABtE0DNAAAAGnRSTlMAABERIiIzM0REVVVmZnd3iIqZmrvDzN3g7thzQuwAAACHSURBVHja5dVLDsIwDEXRCySlP0IMoXXs7H+dDBASA1bQ3B0cPclm2Fe2wrfTQeO3qwqqAKWek80HxfO/l1/EBRgtU2tf+KkJ7TO9hdVSV3jU42f6ZClY6Qt/d4n+BGol29jTwQN1pE2QbA610BVefImuwL7xsNAXXhVpEYY8kNfO/rwsyA3ekEsOT2YDLE8AAAAASUVORK5CYII=",
		q_mark: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAAh0lEQVQoz2OwsbGxtre3jwTiBBJxJEgvA4jBQCYA6wWZhkVOFIjLgPgOEH8A4llArIDFgARcBsgCsRkQywGxLhC3AXEtKQYgA5DN6UCcRo4BEkCcDcSVQMxLqgHcQJwPxNVAzIMjEPEaIAXEJUCcgScWiAoDBnINEAbieiCuobkBlKVESvMCADnAReqxtj3zAAAAAElFTkSuQmCC"
	};

	// fetch wnefficiency values - check if array exists in localStorage, otherwise fetch and reload page
	var wn = {
		values: sf.storage("wnExpValues", "", "get", "parse"),
		date: sf.storage("wnExpDate", "", "get", "parse")+12096e5 >= sc.date, // true if timestamp is less than 2 weeks old, refresh list if false.
		vers: sf.storage("wnExpVers", "", "get", "parse") || ""
	}, statArr = [];
	if (wn.vers[0]==sc.vers && wn.values && wn.date) {
		statArr = wn.values.data;
	}
	else {
		sf.request(sc.wn, sf.wn);
	}

	// style contents
	var style = sf.elem("style", "wotstatscript", "", "text/css"),
	styleText = [
		// settings menu rules
		"#common_menu .menu-settings {color: #7C7E80; display: inline-block;}",
		"#common_menu .menu-settings .cm-user-menu-link {margin: 0 10px 0 0;}",
		"#common_menu .menu-settings .cm-user-menu-link_cutted-text {max-width: unset;}",
		"#common_menu .menu-settings .cm-user-menu {min-width: 200px; padding: 15px;}",
		"#common_menu .menu-settings .cm-parent-link:hover {cursor: pointer;}",
		"#common_menu .menu-settings .b-settingItem {margin: 6px 0px; text-align: center;}",
		"#common_menu .menu-settings label {display: table; line-height: normal; cursor: pointer; margin: 0 auto;}",
		"#common_menu .menu-settings .l-box {display: none;}",
		"#common_menu .menu-settings .b-checkbox {height: 16px; width: 16px; float: left; margin-right: 5px;}",
		"#common_menu .menu-settings .b-checkbox span {height: 16px; width: 16px;}",
		"#common_menu .menu-settings .b-combobox-label__checked {color: #DCDCDC;}",
		"#common_menu .menu-settings .b-settingItem .b-combobox-label:hover {color: #DCDCDC;}",
		"#common_menu .menu-settings .b-settingItem .b-combobox-label:hover .b-checkbox {background-position: 0px -34px; box-shadow: 0px 0px 10px 1px rgba(191, 166, 35, 0.15), 0px 0px 3px 1px rgba(191, 166, 35, 0.25);}",
		"#common_menu .menu-settings .b-settingItem .b-combobox-label:hover .b-checkbox.b-checkbox__checked {background-position: 0px -68px;}",
		"#common_menu .menu-settings textarea.l-textarea {background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 2px; color: #FFFFFF; line-height: normal; padding: 5px; min-height: 50px; margin: 5px 0 5px 0; min-width: 175px;}",
		"#common_menu .menu-settings textarea::-webkit-input-placeholder {color: #FFFFFF;}",
		"#common_menu .menu-settings textarea::-moz-placeholder {color: #FFFFFF;}",
		"#common_menu .menu-settings .b-settingParent {line-height: 26px;}",
		"#common_menu .menu-settings .b-settingParent a {cursor: pointer; color: #B1B2B3; text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);}",
		"#common_menu .menu-settings .b-settingParent a:hover {color: #FFFFFF; text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.75); text-decoration: underline;}",
		"#common_menu .menu-settings .settingCredits {margin: 2px 0px;}",
		"#common_menu .menu-settings .settingCredits h1 {color: #B1B2B3;}",
		"#common_menu .menu-settings .settingCredits table {font-size: 12px; margin: 0 auto; width: unset;}",
		"#common_menu .menu-settings .settingCredits table td {padding: 0 5px;}",
		"#common_menu .menu-settings .settingCredits p {font-size: 12px; padding: 2px 0;}",
		"#common_menu .menu-settings .settingCredits .b-orange-arrow {color: #F25322; line-height: 14px; padding-right: 9px;}",
		"#common_menu .menu-settings .settingCredits .b-orange-arrow:hover {color: #FF7432;}",
		"#common_menu .menu-settings .settingCredits.settingSeperator {border-top: 1px dashed #212123; margin-top: 6px; padding-top: 12px;}",
		"#common_menu .menu-settings .settingCredits.settingLinks a {margin: 0 5px;}",
		// forum rules
		".topic_list {table-layout: auto}",
		".col_f_stats {width: 200px;}",
		".col_f_preview {width: 10px !important;}",
		".col_f_views {width: auto;}",
		".col_f_post {width: auto;}",
		".col_f_stats .i-xvm-lang {margin: 6px 0 0 0;}",
		".t-row-stats {float: right; table-layout: fixed; width: 175px;}",
		".realm_ru .t-row-stats {width: 200px;}",
		"table.ipb_table .t-row-stats td {border-bottom: 0; font-size: 11px; padding: 0;}",
		"#announcements .t-row-stats td {border-bottom: 0;}",
		".s-no-stats {color: #A03737; display: table; font-size: 14px; margin: 0 auto;}",
		// thread rules
		".author_info {min-height: 310px; padding: 0 10px 10px 14px;}",
		".user_details > br {display: none;}",
		".author_info .member_title.member_banned {color: #CD3333;}",
		".basic_info {margin: 0 0 4px;}",
		".post_count.margin-bottom {margin: 0 0 5px;}",
		".battles_count {display: none;}",
		".i-xvm-lang {vertical-align: text-top;}",
		".t-table-stats {margin: 5px 0; width: auto;}",
		".t-table-stats td {padding: 0 5px 0 0; line-height: 16px;}",
		".t-table-stats td:last-of-type {font-weight: bold;}",
		".b-table-links {height: 25px; margin: 5px 0px 0px;}",
		".t-table-links {background: #EDEDED; border: 1px solid #d5d5d5; border-radius: 3px; box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1), 0 0 3px 3px rgba(255, 255, 255, 0.2); display: inline-block; overflow: hidden; padding: 3px 3px 0; position: absolute; text-overflow: ellipsis; white-space: nowrap; height: "+((sc.web.chrome) ? "20px" : "25px")+"; width: 90px; z-index: 1;}",
		".t-table-links:hover {border-color: #7D7D7D; height: auto; width: auto;}",
		".t-table-links tbody {display: table; width: 180px;}",
		".t-table-links td {padding: 0 0 2px; font-weight: bold;}",
		".t-table-links td a { background: url("+uri.icon_arrow+") no-repeat scroll 0 2px rgba(0, 0, 0, 0); padding: 0 0 0 10px; vertical-align: middle;}",
		".t-table-links td a:hover {background: url("+uri.icon_arrow+") no-repeat scroll -244px 2px rgba(0, 0, 0, 0);}",
		".t-table-links tr:last-of-type td {}",
		// korean realm widths
		".realm_kr .t-table-links {width: 108px;}",
		".realm_kr .t-table-links:hover {width: 215px;}",
		".realm_kr .t-table-links tbody {width: 215px;}"
	];
	style.textContent = styleText.join("");
	d.head.appendChild(style);
	// end style

	// colour scale array
	var colArr = {
		//      col        wr  bat    wn8   wn7   eff   nm    pr
		sUni: [ "#5A3175", 65, 30000, 2900, 2050, 2050, 2000       ], // 99.99% super unicum
		uni:  [ "#83579D", 60, 25000, 2450, 1850, 1800, 1950, 9930 ], // 99.90% unicum
		gr8:  [ "#3972C6", 56, 21000, 2000, 1550, 1500, 1750, 8525 ], // 99.00% great
		vGud: [ "#4099BF", 54, 17000, 1600, 1350                   ], // 95.00% very good
		good: [ "#4D7326", 52, 13000, 1200, 1100, 1200, 1450, 6340 ], // 82.00% good
		aAvg: [ "#849B24", 50, 10000,  900                         ], // 63.00% above average
		avg:  [ "#CCB800", 48,  7000,  650,  900,  900, 1250, 4185 ], // 40.00% average
		bAvg: [ "#CC7A00", 47,  3000,  450,  700,  600, 1150, 2020 ], // 20.00% below average
		bas:  [ "#CD3333", 46,  1000,  300,  500                   ], //  6.00% basic
		beg:  [ "#930D0D",  0,     0,    0,    0,    0,    0, 0    ], //  0.00% beginner
		dft:  [ "#6B6B6B" ], // default
		id: { "col": 0, "wr": 1, "bat": 2, "wn8": 3, "wn7": 4, "eff": 5, "nm": 6, "pr": 7 }  // type identifier
	};

	// localization
	var loc = [
		{ en: "Client", ru: "Клиент", cs: "Klient", fr: "Client"},
		{ en: "Winrate:", ru: "Винрейт:", cs: "Winrate", fr: "Ratio V."},
		{ en: "Battles:", ru: "Боев:", cs: "Bitev", fr: "Batailles"},
		{ en: "Rating:", ru: "Рейтинг:", cs: "Hodnocení", fr: "Côte"},
		{ en: "WN8:", ru: "WN8:", cs: "WN8:", fr: "WN8"},
		{ en: "Please Login for Stats", ru: "Please Login for Stats", cs: "Přihlaš se pro statistiky", fr: "Veuillez vous connecter pôr les statistiques"},
		{ en: "No Stats Found", ru: "No Stats Found", cs: "Stat. nenalezeny", fr: "Aucune statistique trouvée"},
		{ en: "Script Menu", ru: "Script Menu", cs: "Menu skritpu", fr: "Menu du script"},
		{ en: "Refresh WN8 Table", ru: "Refresh WN8 Table", cs: "Obnov WN8", fr: "Rafraîchir la table WN8"},
		{ en: "Script Author:", ru: "Script Author:", cs: "Autor skriptu:", de: "Script-Autor:", fr: "Auteur du script :", pl: "Script Author:", es:"Script Author:", tr: "Script Author:"},
		{ en: "Contributors (EN):", ru: "Contributors (RU):", cs: "Kontributoři (CZ):", de: "Contributors (DE):", fr: "Contributeurs (FR):", pl: "Contributors (PL):", es:"Contributors (ES):", tr: "Contributors (TR):"}
		//{ en: "f00_en", ru: "f00_ru", fr: "f00_fr"},
	];
	// process localization
	for (var _l=0, l_len = loc.length; _l<l_len; _l++) {
		loc[_l] = loc[_l][sc.srv.s];
	}

	// script link
	var userSet_div = sf.elem("div", "menu-settings menu-top_item", "<a class='cm-user-menu-link' href='#' onClick='return false;'><span class='cm-user-menu-link_cutted-text'>"+loc[7]+"</span><span class='cm-arrow'></span></span>"),
	userSet_list = sf.elem("ul", "cm-user-menu"),
	userSet_list_items = [
		sf.settings("wnRefresh", loc[8]+" [v"+wn.vers[1]+"]"),
		sf.elem("li", "b-settingItem settingCredits settingSeperator", "<p>Version: "+sc.vers+"</p>"),
		sf.elem("li", "b-settingItem settingCredits", "<p>"+loc[9]+" <a class='b-orange-arrow' href='"+sc.user.wot+"'>Orrie</a></p>"+((sc.cred[sc.loc]) ? "<p>"+loc[10]+"</p><table>"+sc.cred[sc.loc]+"</table>" : "")),
		sf.elem("li", "b-settingItem settingCredits settingLinks", "<p><a class='b-orange-arrow' href='"+sc.host+"'>Greasy Fork</a><a class='b-orange-arrow' href='"+((wg.srv == "na") ? sc.top.na : sc.top.eu)+"'>Support Thread</a></p>")
	],
	navMenu = d.getElementById('common_menu'),
	navUser = navMenu.getElementsByClassName('cm-menu__user')[0];
	sf.links(userSet_list, userSet_list_items, "list");
	userSet_div.firstElementChild.addEventListener('click', function() {this.classList.toggle('cm-user-menu-link__opened'); this.nextSibling.classList.toggle('cm-user-menu__opened');}, false);
	userSet_div.appendChild(userSet_list);
	if (navUser) {
		navUser.appendChild(userSet_div);
	}
	else {
		var navLook = new MutationObserver(function() {
			var navUser = navMenu.getElementsByClassName('cm-menu__user')[0];
			navUser.appendChild(userSet_div);
			navLook.disconnect();
		});
		navLook.observe(navMenu, {childList: true});
	}

	// formula calculations and variables
	// create global post variable
	var postObj = {
		post: d.querySelectorAll(".post_wrap, .post_wrap__wg"),
		span: d.querySelectorAll("span.desc.lighter.blend_links"),
		cls: [],
		ids: [],
		num: []
	},
	s = {};
	switch(true) {
		case (wg.topic):
			postObj.cls = postObj.post; break;
		case (wg.forum):
			postObj.cls = postObj.span; break;
		default: break;
	}

	// fetch userids and store all posts into one obj for later use
	if (wg.topic || (wg.forum && wg.login === false)) {
		for (var _t=0, _t_len = postObj.cls.length; _t<_t_len; _t++) {
			var id;
			switch(true) {
				case (wg.topic):
					id = postObj.post[_t].getElementsByClassName("ipsUserPhotoLink")[0].getAttribute('href').match(/\-(\d+)\//)[1]; break;
				case (wg.forum):
					var id_url = postObj.span[_t].getElementsByClassName("url")[0];
					if (id_url) {
						id = id_url.getAttribute('href').match(/\-(\d+)\//)[1];
					}
					break;
				default: break;
			}
			if (!isNaN(id)) {
				var users = postObj.ids.length,
				index = postObj.ids.indexOf(id);
				s[id] = {u:{},v:{frag:0,dmg:0,spot:0,def:0,win:0},wn8:""};
				if (index>-1) {
					postObj.num[index][postObj.num[index].length] = _t;
				}
				else {
					postObj.ids[users] = id;
					postObj.num[users] = [_t];
				}
			}
		}
	}
	else {
		navUser.insertBefore(sf.elem("div", "cm-parent-link b-login-msg", "<div>"+loc[5]+"</div>"), navUser.firstChild);
	}

	// request and retrieve statistics from API
	if (postObj.ids.length > 0) {
		sc.api.i = "https://api.worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/wot/account/info/?application_id="+sc.api.wg_key+"&account_id="+postObj.ids.join(',');
		sc.api.v = "https://api.worldoftanks."+((wg.srv == "na") ? "com" : wg.srv)+"/wot/account/tanks/?application_id="+sc.api.wg_key+"&account_id="+postObj.ids.join(',');
		sf.request(sc.api.i, sf.apiInfoHnd);
	}
	else {
		console.error("No post IDs found or not logged in");
	}
}(window));
