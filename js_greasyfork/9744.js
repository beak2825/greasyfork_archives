// ==UserScript==
// @name Anti-Adblock Killer on vipleague
// @namespace https://userscripts.org/scripts/show/155840
// @description Anti-Adblock Killer vipleague is a userscript whose functionality is removing protections used on vipleague sites that force the user to disable the AdBlocker.
// @author Reek | reeksite.com
// @version 1.2
// @license Creative Commons BY-NC-SA
// @encoding utf-8
// @homepage https://github.com/reek/anti-adblock-killer#anti-adblock-killer--reek
// @twitter https://twitter.com/antiadbkiller
// @supportURL https://github.com/reek/anti-adblock-killer/issues
// @contributionURL https://github.com/reek/anti-adblock-killer#donate
// @icon https://raw.github.com/reek/anti-adblock-killer/master/anti-adblock-killer-icon.png
// @include http*://*
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_log
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_info
// @grant GM_getMetadata
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/9744/Anti-Adblock%20Killer%20on%20vipleague.user.js
// @updateURL https://update.greasyfork.org/scripts/9744/Anti-Adblock%20Killer%20on%20vipleague.meta.js
// ==/UserScript==
/*=====================================================
  Thanks
=======================================================

  Donors: M. Howard, Shunjou, Charmine, Kierek93, G. Barnard, H. Young, Seinhor9, ImGlodar, Ivanosevitch, HomeDipo, R. Martin, DrFiZ, Tippy, B. Rohner, P. Kozica, M. Patel, W4rell, Tscheckoff, AdBlock Polska, AVENIR INTERNET, coolNAO, Ben, J. Park, C. Young
  
  Collaborators: InfinityCoding, Couchy, Dindog, Floxflob, U Bless, Watilin, @prdonahue, Hoshie, 3lf3nLi3d, Alexo, Crits, Noname120, Crt32, JixunMoe, Athorcis, Killerbadger, SMed79, Alexander255, Anonsubmitter, RaporLoLpro, Maynak00, Robotex
  
  Users: Thank you to all those who use Anti Adblock Killer, who report problems, who write the review, which add to their favorites, making donations, which support the project and help in its development or promote.

=======================================================
  Mirrors
=======================================================

  Github: http://tinyurl.com/mcra3dn
  Greasyfork: http://tinyurl.com/puyxrn4
  Openuserjs: http://tinyurl.com/nnqje32
  MonkeyGuts: http://tinyurl.com/ka5fcqm
  Userscripts: http://tinyurl.com/q8xcejl

=======================================================
  Documentation
=======================================================

  Greasemonkey: http://tinyurl.com/yeefnj5
  Scriptish: http://tinyurl.com/cnd9nkd
  Tampermonkey: http://tinyurl.com/pdytfde
  Violentmonkey: http://tinyurl.com/n34wn6j
  NinjaKit: http://tinyurl.com/pkkm9ug

=======================================================
  Script
======================================================*/

Aak = {
  name : 'Anti-Adblock Killer on vipleague',
  version : '7.9',
  scriptid : 'gJWEp0vB',
  homeURL : 'https://github.com/reek/anti-adblock-killer#anti-adblock-killer--reek',
  changelogURL : 'https://github.com/reek/anti-adblock-killer#changelog',
  donateURL : 'https://github.com/reek/anti-adblock-killer#donate',
  featuresURL : 'https://github.com/reek/anti-adblock-killer#features',
  reportURL : 'https://github.com/reek/anti-adblock-killer/wiki/Report-Guide',
  twitterURL : 'https://twitter.com/antiadbkiller',
  downloadURL : 'https://raw.githubusercontent.com/reek/anti-adblock-killer/master/anti-adblock-killer.user.js',
  filtersSubscribe : 'abp:subscribe?location=https://raw.github.com/reek/anti-adblock-killer/master/anti-adblock-killer-filters.txt&title=Anti-Adblock%20Killer%20|%20Filters%20for%20Adblockers',
  filtersURL : "https://raw.githubusercontent.com/reek/anti-adblock-killer/master/anti-adblock-killer-filters.txt",
  iconURL : 'https://raw.githubusercontent.com/reek/anti-adblock-killer/master/anti-adblock-killer-icon.png',
  debug : {
	log: true,
    dump : false,
    inserted : false
  },
  initialize : function () {

    // Debug
    if (Aak.debug.dump) {
		
      Aak.log('Anti-Adblock Killer v' + Aak.getVersion() + ' on ' + Aak.getScriptManager() + ' in ' + Aak.getBrowser());

      Aak.log('Aak');
      Aak.log(Aak);
	  
      Aak.log('Local Storage');
      Aak.log(localStorage);
      //localStorage.clear();
	  
      Aak.log('GM Storage');
      Aak.log(Aak.listValues());

      Aak.log('GM API Supported');
      Aak.log(Aak.apiSupported());
    }

    // Stop if user not use Script Manager or not support GM Api
    if (Aak.apiRequires()) {
		
      // Add Command in Greasemonkey Menu
      Aak.addCommands();

      // Detect Filters
      Aak.once(30, 'aak-detectfilters', Aak.detectFilters);

      // Check Update
      Aak.once(5, 'aak-checkupdate', Aak.update.checkAuto);

      // Detect and Kill
      Aak.kill();
    }
  },
  uw : unsafeWindow || window,
  isTopWindow : !(window.top != window.self),
  ready : function (fn) {
    window.addEventListener('load', fn);
  },
  contains : function (string, search) {
    return string.indexOf(search) != -1;
  },
  log : function (msg, type) {
    if (Aak.debug.log) {
      if (typeof console === 'undefined') {
        console = unsafeWindow.console;
      }
      console[type || 'info']('AntiAdblockKiller: ' + msg);
    }
  },
  apiRequires : function () {
    if (typeof GM_xmlhttpRequest != 'undefined' &&
      typeof GM_setValue != 'undefined' &&
      typeof GM_getValue != 'undefined' &&
      typeof GM_addStyle != 'undefined' &&
      typeof GM_registerMenuCommand != 'undefined') {
      return true;
    } else {
      return false;
    }
  },
  apiSupported : function () { 
    if (Aak.isTopWindow) {
      // GM API
      // Doc: http://tinyurl.com/yeefnj5
	  return {
	    GM_xmlhttpRequest : typeof GM_xmlhttpRequest != 'undefined',
	    GM_setValue : typeof GM_setValue != 'undefined',
	    GM_getValue : typeof GM_getValue != 'undefined',
	    GM_addStyle : typeof GM_addStyle != 'undefined',
	    GM_registerMenuCommand : typeof GM_registerMenuCommand != 'undefined',
	    GM_info : typeof GM_info != 'undefined',
	    GM_getMetadata : typeof GM_getMetadata != 'undefined',
	    GM_deleteValue : typeof GM_deleteValue != 'undefined',
	    GM_listValues : typeof GM_listValues != 'undefined',
	    GM_getResourceText : typeof GM_getResourceText != 'undefined',
	    GM_getResourceURL : typeof GM_getResourceURL != 'undefined',
	    GM_log : typeof GM_log != 'undefined',
	    GM_openInTab : typeof GM_openInTab != 'undefined',
	    GM_setClipboard : typeof GM_setClipboard != 'undefined'
	  }
    }
  },
  listValues : function () {
    var list = GM_listValues();
    var obj = {};
    for (var i in list) {
      obj[list[i]] = GM_getValue(list[i]);
    }
    return obj;
  },
  getBrowser : function () {
    var ua = navigator.userAgent;
    if (Aak.contains(ua, 'Firefox')) {
      return "Firefox";
    } else if (Aak.contains(ua, 'MSIE')) {
      return "IE";
    } else if (Aak.contains(ua, 'Opera')) {
      return "Opera";
    } else if (Aak.contains(ua, 'Chrome')) {
      return "Chrome";
    } else if (Aak.contains(ua, 'Safari')) {
      return "Safari";
    } else if (Aak.contains(ua, 'Konqueror')) {
      return "Konqueror";
    } else if (Aak.contains(ua, 'PaleMoon')) {
      return "PaleMoon"; // fork firefox
    } else if (Aak.contains(ua, 'Cyberfox')) {
      return "Cyberfox"; // fork firefox
    } else if (Aak.contains(ua, 'SeaMonkey')) {
      return "SeaMonkey"; // fork firefox
    } else if (Aak.contains(ua, 'Iceweasel')) {
      return "Iceweasel"; // fork firefox
    } else {
      return ua;
    }
  },
  getVersion : function () {
    return Number(Aak.version);
  },
  getScriptManager : function () {
    if (Aak.apiRequires()) {
      if (typeof GM_info == 'object') {
        // Greasemonkey (Firefox)
        if (typeof GM_info.uuid != 'undefined') {
          return 'Greasemonkey';
        } // Tampermonkey (Chrome/Opera)
        else if (typeof GM_info.scriptHandler != 'undefined') {
          return 'Tampermonkey';
        }
      } else {
        // Scriptish (Firefox)
        if (typeof GM_getMetadata == 'function') {
          return 'Scriptish';
        } // NinjaKit (Safari/Chrome)
        else if (typeof GM_getResourceText == 'undefined' &&
          typeof GM_getResourceURL == 'undefined' &&
          typeof GM_openInTab == 'undefined' &&
          typeof GM_setClipboard == 'undefined') {
          return 'NinjaKit';
        } // GreaseGoogle (Chrome)
        else if (Aak.getBrowser() == 'Chrome' &&
          typeof GM_setClipboard == 'undefined') {
          return 'GreaseGoogle';
        }
      }
    } else {
      Aak.log('No Script Manager detected');
      return false;
    }
  },
  generateID : function () {
    return 'Aak-' + Math.random().toString(36).substring(4);
  },
  generateUUID : function () {
    // Universally Unique IDentifier
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });
    return uuid;
  },
  getUUID : function () {
    // Universally Unique IDentifier
    var name = 'aak-uuid';
    if (typeof GM_getValue(name) == 'undefined') {
      GM_setValue(name, Aak.generateUUID());
    }
    return GM_getValue(name);
  },
  once : function (day, name, callback) {
    setTimeout(function () {
      if (typeof GM_getValue != 'undefined') {
        // Current time
        var time = new Date().getTime();
        // Create setValue
        if (isNaN(GM_getValue(name))) {
          GM_setValue(name, 1);
        }
        // Execute
        if (Number(GM_getValue(name)) < time) {
          GM_setValue(name, (time + (day * 24 * 60 * 60 * 1000)).toString());
          callback();
        }
      }
    }, 0);
  },
  addCommands : function () {
    Aak.ready(function () {
      // Scriptish
      // Note: No menu command is created when the user script is run in a iframe window.
      // Doc: http://tinyurl.com/kvvv7yt
      if (Aak.isTopWindow && typeof GM_registerMenuCommand != 'undefined') {
        GM_registerMenuCommand(Aak.name + ' ' + Aak.getVersion() + ' Homepage', function () {
          location.href = Aak.homeURL;
        });
        GM_registerMenuCommand(Aak.name + ' ' + Aak.getVersion() + ' Check Update', Aak.update.check);
      }
    });
  },
  notification : function (message, delay) {
    if (Aak.isTopWindow) {

      // animation
      Aak.addStyle('@-webkit-keyframes aak-fadeInDown{0%{opacity:0;-webkit-transform:translateY(-20px)}100%{opacity:1;-webkit-transform:translateY(0)}}@keyframes aak-fadeInDown{0%{opacity:0;transform:translateY(-20px)}100%{opacity:1;transform:translateY(0)}}');

      // box
      Aak.addStyle('#aak-notice {-webkit-animation:aak-fadeInDown .5s ease; animation:aak-fadeInDown .5s ease; padding:0px; color:#000; background-color:#fff; display:block; width:100%; position:fixed; z-index:999999; left: 0; top: 0;  text-align: left; vertical-align:middle; margin:0; font-size:14px; font-family:arial; border-bottom:5px solid #DF3A32; line-height:1.2; font-variant:small-caps;}'.replace(/;/g, ' !important;'));

      // navbar
      Aak.addStyle('#aak-notice-navbar {background-color:#DF3A32; padding:0px 20px 0px 62px; background-image:url("' + Aak.iconURL + '"); background-repeat:no-repeat; background-position:20px 3px; background-size:32px;}'.replace(/;/g, ' !important;'));

      // link
      Aak.addStyle('.aak-navbar-link {padding:0px 5px; line-height:35px; color:#fff; display:inline-block; text-decoration:none; transform:skew(345deg, 0deg); background-color:#DF3A32; border-bottom:3px solid #DF3A32;}'.replace(/;/g, ' !important;'));

      // link:hover
      Aak.addStyle('.aak-navbar-link:hover {color:#fff; background-color:#000; border-bottom:3px solid #fff; text-decoration:none;}'.replace(/;/g, ' !important;'));

      // close
      Aak.addStyle('#aak-notice-close {color:#fff; float: right; margin:0px 5px; padding:10px 10px 8px 10px; text-decoration: none;}'.replace(/;/g, ' !important;'));

      // brand
      Aak.addStyle('#aak-notice .brand {padding-right:20px; color:#fff; font-size:14px;}'.replace(/;/g, ' !important;'));

      // content
      Aak.addStyle('#aak-notice-content {padding:5px 20px; min-height:72px;}'.replace(/;/g, ' !important;'));
      Aak.addStyle('#aak-notice-content a {color:#DF3A32; text-decoration:none;}'.replace(/;/g, ' !important;'));
      Aak.addStyle('#aak-notice-content a:hover {text-decoration:underline;}'.replace(/;/g, ' !important;'));

      // remove
      Aak.removeElement('#aak-notice');

      // create
      var node = document.createElement('div');
      node.id = 'aak-notice';
      node.innerHTML = '<div id="aak-notice-navbar"><b class="brand">Anti-Adblock Killer</b><a class="aak-navbar-link" title="Visit Homepage." href="' + Aak.homeURL + '">Homepage</a><a class="aak-navbar-link" title="Report issue or anti-adblock." href="' + Aak.reportURL + '">Report</a><a class="aak-navbar-link" title="See changes" href="' + Aak.changelogURL + '">Changelog</a><a class="aak-navbar-link" title="Make a donation to support the project." href="' + Aak.donateURL + '">Donate</a><a class="aak-navbar-link" title="Submit a new feature." href="' + Aak.featuresURL + '">Suggest Features</a><a class="aak-navbar-link" title="Follow on twitter." href="' + Aak.twitterURL + '">Twitter</a><a title="Close" href="javascript:void(0);" id="aak-notice-close">X</a></div><div id="aak-notice-content"><u style="font-size: 18px;">Notice:<br></u>' + message + '</div>';

      // append
      document.documentElement.appendChild(node);

      // close (manually)
      document.querySelector('#aak-notice-close').onclick = function () {
        Aak.removeElement('#aak-notice');
      }

      // close (automatically)
      setTimeout(function () {
        Aak.removeElement('#aak-notice');
      }, delay);

    }
  },
  detectFilters : function () {
    if (Aak.isTopWindow) {
      Aak.ready(function () {
        var elem = document.createElement("div");
        elem.id = "k2Uw7isHrMm5JXP1Vwdxc567ZKc1aZ4I";
        elem.innerHTML = "<br>";
        document.body.appendChild(elem);

        setTimeout(function () {
          if (elem.clientHeight) {
            Aak.notification('It seems that you have not subscribed to the list <b>Anti-Adblock Killer - Filters for Adblockers</b>, this list is necessary for the proper functioning of Anti-Adblock Killer. <a href="' + Aak.filtersSubscribe + '" target="_blank">Subscribe</a>', 30000);
            console.warn("Anti-Adblock Killer: Filters for Adblockers No detected :( " + elem.clientHeight);
          } else {
            Aak.log("Anti-Adblock Killer: Filters for Adblockers detected");
          }
        }, 5000);
      });
    }
  },
  buildQuery : function (obj) {
    var array = [];
    for (var p in obj) {
      array.push(p + '=' + obj[p]);
    }
    return array.join('&');
  },
  update : {
    check : function () {
      if (Aak.isTopWindow) {
        Aak.notification('<b>Script: </b><i id="aak-update-script">Checking...</i><br/><b>List: </b><i id="aak-update-filters">Checking...</i>', 60000);
        setTimeout(function () {
          Aak.update.getLatestVerScript();
          Aak.update.getLatestVerFilters();
        }, 2000);
      }
    },
    checkAuto : function () {
      if (Aak.isTopWindow) {
        Aak.ready(function () {
          var data = {
            scriptid : Aak.scriptid,
            uuid : Aak.getUUID(),
            version : Aak.getVersion(),
            browser : Aak.getBrowser(),
            scriptmanager : Aak.getScriptManager()
          };
          GM_xmlhttpRequest({
            timeout : 10000, // 10s
            method : "POST",
            data : Aak.buildQuery(data),
            url : 'http://reeksite.com/php/get.php?checkupdate',
            headers : {
              "Content-Type" : "application/x-www-form-urlencoded"
            },
            onload : function (response) {
              var res = response.responseText;
              var status = response.status;
              var json = JSON.parse(res);
              Aak.log(res, status, json);

              if (status == 200 && typeof json == 'object' && json.update) {
                Aak.downloadURL = json.url;
                Aak.update.check();
              }
            }
          });
        });
      }
    },
    getLatestVerScript : function () {
      GM_xmlhttpRequest({
        timeout : 5000, // 5s
        method : "GET",
        url : Aak.downloadURL,
        onload : function (response) {
          var res = response.responseText;
          var status = response.status;
          //Aak.log(status, res);

          if (status == 200) {
            var verInstalled = Aak.getVersion();
            var verLatest = Number(res.match(/@version\s+(\d+\.\d+)/)[1]);

            if (verInstalled < verLatest) {
              var message = ' ' + verLatest + ' available <a title="Install latest version" href="' + Aak.downloadURL + '" target="_blank">Install</a>';
            } else {
              var message = 'Up-to-date &#10004;';
            }
          } else {
            var message = '<i style="color:#c00;">Checking failed &#10008;</i>';
          }

          var notification = document.querySelector('#aak-update-script');
          notification.innerHTML = message;
        },
        ontimeout : function () {}
      });
    },
    getLatestVerFilters : function () {
      GM_xmlhttpRequest({
        timeout : 5000, // 5s
        method : "GET",
        url : Aak.filtersURL,
        onload : function (response) {
          var res = response.responseText;
          var status = response.status;
          //Aak.log(status, res);

          if (status == 200) {
            var verInstalled = Aak.getVersion();
            var verLatest = Number(res.match(/!\s+Version:\s+(\d+\.\d+)/)[1]);

            if (verInstalled < verLatest) {
              var message = ' ' + verLatest + ' available <a title="Install latest version" id="aak-subscribe" href="' + Aak.filtersSubscribe + '" target="_blank">Install</a>';

            } else {
              var message = 'Up-to-date &#10004;';
            }
          } else {
            var message = '<i style="color:#c00;">Checking failed &#10008;</i>';
          }

          var notification = document.querySelector('#aak-update-filters');
          notification.innerHTML = message;
        },
        ontimeout : function () {}
      });
    }
  },
  autoReport : function (system, host, target) {

    var host = (host) ? host : location.host;
    var target = (target) ? target : '';
    var name = 'Aak' + system;

    Aak.log(system);

    if (typeof localStorage != "undefined") {
      if (typeof localStorage[name] == "undefined") {

        // Using localStorage because GM get/setValue does not work
		// Doc: http://tinyurl.com/8peqwvd
        localStorage[name] = host;

        var data = {
          system : system,
          host : host,
          target : target
        };
        GM_xmlhttpRequest({
          timeout : 10000, // 10s
          method : "POST",
          data : Aak.buildQuery(data),
          url : 'http://reeksite.com/php/get.php?autoreport',
          headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
          },
          onload : function (response) {
            var res = response.responseText;
            var status = response.status;
            //Aak.log(res, status);
          }
        });
      } else {
        //Aak.log('Already reported !');
      }
    } else {
      console.warn('Sorry! No Web Storage support.');
    }
  },
  setStorage : function () {
    if (localStorage) {
      // Le navigateur supporte le localStorage
    } else {
      //throw 'localStorage non supporté';
    }
  },
  getStorage : function () {
    if (localStorage) {
      // Le navigateur supporte le localStorage
    } else {
      //throw 'localStorage non supporté';
    }
  },
  kill : function () {

    // Detect & Kill
    for (var i in Aak.rules) {

      // Current
      var current = Aak.rules[i];

      // RegExp host
      var reHost = new RegExp(current.host.join('|'), 'i');
      // If domains is
      if (reHost.test(location.host)) {
        // On all statements
        if (current.onAlways) {
		  current.onAlways(); // loading
		  window.addEventListener('DOMContentLoaded', current.onAlways); // interactive
		  window.addEventListener('load', current.onAlways); // complete
        }
        // Add Js / Css / Cookie
        if (current.onStart) {
          current.onStart();
        }
        // When Before Script Executed
        if (current.onBeforeScript) {
          if ('onbeforescriptexecute' in document) { // Mozilla Firefox
            window.addEventListener('beforescriptexecute', current.onBeforeScript);
          }
        } // When After Script Executed
        if (current.onAfterScript) {
          if ('onafterscriptexecute' in document) { // Mozilla Firefox
            window.addEventListener('afterscriptexecute', current.onAfterScript);
          }
        }
        // When Window Load
        if (current.onEnd) {
          window.addEventListener('load', current.onEnd);
        }
        // When DOM Load
        if (current.onLoad) {
          window.addEventListener('DOMContentLoaded', current.onLoad);
        }
        // When DOM AttrModified
        if (current.onAttrModified) {
          window.addEventListener('DOMAttrModified', current.onAttrModified, false);
        }
        // When DOM SubtreeModified
        if (current.onSubtreeModified) {
          window.addEventListener('DOMSubtreeModified', current.onSubtreeModified, false);
        }
        // When DOM Elements are Inserted in Document
        if (current.onInsert) {

          // Mutation Observer
          // Doc: http://tinyurl.com/mxxzee4
          // Support: http://tinyurl.com/nepn7vy
          if (typeof window.MutationObserver != 'undefined' ||
            typeof WebKitMutationObserver != 'undefined') {

            // Mutation Observer
            var MutationObserver = window.MutationObserver || WebKitMutationObserver;

            // Create an observer instance
            var obs = new MutationObserver(function (mutations) {
                // We can safely use `forEach` because we already use mutation
                // observers that are more recent than `forEach`. (source: MDN)
                mutations.forEach(function (mutation) {
                  // we want only added nodes
                  if (mutation.addedNodes.length) {
                    //Aak.log(addedNodes);
                    Array.prototype.forEach.call(mutation.addedNodes, function (addedNode) {
                      //Aak.log(addedNode);
                      current.onInsert(addedNode);
                    });
                  }
                });
              });
            // Observer
            obs.observe(document, {
              childList : true,
              subtree : true
            });
          }
          // Mutation Events (Alternative Solution)
          // Doc: http://tinyurl.com/op95rfy
          else {
            window.addEventListener("DOMNodeInserted", function (e) {
              current.onInsert(e.target);
            }, false);
          }
        }
        // When DOM Elements are Removed in Document
        if (current.onRemove) {

          // Mutation Observer
          // Doc: http://tinyurl.com/mxxzee4
          // Support: http://tinyurl.com/nepn7vy
          if (typeof window.MutationObserver != 'undefined' ||
            typeof WebKitMutationObserver != 'undefined') {

            // Mutation Observer
            var MutationObserver = window.MutationObserver || WebKitMutationObserver;

            // Create an observer instance
            var obs = new MutationObserver(function (mutations) {
                // We can safely use `forEach` because we already use mutation
                // observers that are more recent than `forEach`. (source: MDN)
                mutations.forEach(function (mutation) {
                  // we want only removed nodes
                  if (mutation.removedNodes.length) {
                    //Aak.log(mutation.removedNodes);
                    Array.prototype.forEach.call(mutation.removedNodes, function (removedNode) {
                      //Aak.log(removedNode);
                      current.onRemove(removedNode);
                    });
                  }
                });
              });
            // Observer
            obs.observe(document, {
              childList : true,
              subtree : true
            });
          }
          // Mutation Events (Alternative Solution)
          // Doc: http://tinyurl.com/op95rfy
          else {
            window.addEventListener("DOMNodeRemoved", function (e) {
              current.onRemove(e.target);
            }, false);
          }
        }
      }
    }
  },
  confirmLeave : function () {
    window.onbeforeunload = function () {
      return '';
    };
  },
  confirmReport : function (elem) {
    elem.innerHTML = 'Report';
    elem.title = 'Report issue or anti-adblock';
    elem.onclick = function (e) {
      e.preventDefault();
      if (confirm("Do you want to report issue or anti-adblock")) { // Clic on OK
        location.href = Aak.reportURL;
      } else {
        location.href = elem.href;
      }
    }
  },
  stopScript : function (e) {
    e.preventDefault();
    e.stopPropagation();
  },
  innerScript : function (e) {
    return e.target.innerHTML;
  },
  addScript : function (code) {
    // Note: Scriptish no support
    if (document.head) {
      if (/\.js$/.test(code)) { // External
        document.head.appendChild(document.createElement('script')).src = code;
      } else { // Inline
        document.head.appendChild(document.createElement('script')).innerHTML = code.toString().replace(/^function.*{|}$/g, '');
      }
    }
  },
  addElement : function (str) { // ex: div.ads or span#ads
    if (Aak.contains(str, '.')) {
      var str = str.replace('.', ':className:');
    } else if (Aak.contains(str, '#')) {
      var str = str.replace('#', ':id:');
    }
    var arr = str.split(':');
    Aak.addScript('function() { document.documentElement.appendChild(document.createElement("' + arr[0] + '")).' + arr[1] + ' = "' + arr[2] + '"; document.querySelector("' + arr[0] + '").innerHTML = "<br>"; }');
  },
  removeElement : function (o) {
    if (o instanceof HTMLElement) {
      return o.parentNode.removeChild(o);
    } else if (typeof o === "string") {
      var elem = document.querySelectorAll(o);
      for (var i = 0; i < elem.length; i++) {
        elem[i].parentNode.removeChild(elem[i]);
      }
    } else {
      return false;
    }
  },
  getElement : function (selector) {
    var elem = document.querySelector(selector) || false;
    if (elem) {
      return elem;
    } else {
      return false;
    }
  },
  setElement : function (selector, props) {
    var elem = Aak.getElement(selector);
    if (elem) {
      for (p in props) {
        elem.setAttribute(p, props[p]);
      }
    } else {
      return false;
    }
  },
  addStyle : function (css) {
    GM_addStyle(css);
  },
  getStyle : function (elem, prop) {
    if (elem.currentStyle)
      return elem.currentStyle[prop];
    else if (window.getComputedStyle)
      return document.defaultView.getComputedStyle(elem, null).getPropertyValue(prop);
  },
  getCookie : function (name) {
    var oRegex = new RegExp("(?:; )?" + name + "=([^;]*);?");
    if (oRegex.test(document.cookie)) {
      return decodeURIComponent(RegExp["$1"]);
    } else {
      return null;
    }
  },
  setCookie : function (name, value, time) {
    var time = (time) ? time : 365 * 24 * 60 * 60 * 1000; // 1 year
    var expires = new Date();
    expires.setTime(new Date().getTime() + time);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + expires.toGMTString() + ";path=/";
  },
  decodeURI : function (str) {
    return decodeURIComponent(str);
  },
  encodeURI : function (str) {
    return encodeURIComponent(str);
  },
  encodeHTML : function (str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
  decodeHTML : function (str) {
    return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  },
  allowfullscreen : function (elem, boolen) {
    var boolen = (boolen) ? boolen : true;
    if (typeof elem == 'string') {
      var elem = document.querySelector(elem);
    }

    var parent = elem.parentNode;
    var clone = elem.cloneNode(true);
    var params = clone.querySelector('param[name="allowfullscreen"]') || false;

    if (params) {
      params.value = boolen;
    }
    if (typeof clone.allowfullscreen != 'undefined') {
      clone.allowfullscreen = boolen;
    }

    // Replace
    parent.replaceChild(clone, elem);
  },
  player : { // http://tinyurl.com/pb6fthj
    in : {
      node : null,
      html : null,
      tag : null,
      parent : null
    },
    out : {
      node : null,
      html : null,
      tag : null,
      parent : null
    },
    nameplayer : 'custom',
    swfvars : null,
    options : {
      method : 'replace',
      output : 'embed'
    },
    flashvars : {
      str : null,
      obj : {}
    },
    attributes : {
      wmode : 'opaque',
      quality : 'high',
      bgcolor : '#000000',
      type : 'application/x-shockwave-flash',
      pluginspage : 'http://www.adobe.com/go/getflash',
      allowscriptaccess : 'always', // never / always
      allowfullscreen : true
    },
    dom : function () {
      GM_registerMenuCommand(Aak.name + ' ' + Aak.getVersion() + ' swfobjects', function () {
        var elems = document.querySelectorAll('embed,object');
        for (var i = 0; i < elems.length; i++) {
          this.custom(elems[i]);
          this.log();
        }
      });
    },
    get : function (element) {

      if (element instanceof HTMLElement) {
        this.in.node = element;
      } else if (typeof element == 'string') {
        if (/^[#\.]/.test(element)) {
          this.in.node = document.querySelector(element);
        } else {
          this.in.node = document.getElementById(element);
        }
      } else {
        throw 'Not object or embed player or invalid selector';
      }

      this.in.html = this.getHtml(this.in.node);
      this.in.parent = this.in.node.parentNode;
      this.in.tag = this.in.node.tagName;

      this.attributes.id = this.attributes.name = Aak.generateID();
      this.attributes.height = this.in.node.height || this.in.node.clientHeight || '100%';
      this.attributes.width = this.in.node.width || this.in.node.clientWidth || '100%';

      if (/^(object|embed)$/i.test(this.in.tag)) {

        //
        this.attributes.src = this.in.node.src || this.in.node.data || false;
        this.flashvars.str = this.in.node.flashvars || this.in.node.querySelector('param[name="flashvars"]') && this.in.node.querySelector('param[name="flashvars"]').value || false;
        var swfvars = !this.flashvars.str && this.in.node.data && this.in.node.data.split('?', 2) || false;

        //
        if (swfvars) {
          this.attributes.src = swfvars[0];
          this.flashvars.str = swfvars[1];
        }

        this.splitVars();
        this.joinVars();
      }
      //Aak.log(this);
    },
    custom : function (element, attributes, flashvars, options) {

      //
      this.get(element);

      //
      if (typeof attributes == 'object') {
        this.mergeObj(this.attributes, attributes);
      }

      //
      if (typeof flashvars == 'object') {
        if (flashvars.set) {
          this.setVars(flashvars.set);
        }
        if (flashvars.remove) {
          this.removeVars(flashvars.remove);
        }
      }

      //
      if (typeof options == 'object') {
        if (options.method) {
          this.options.method = options.method;
        }
        if (options.output) {
          this.options.output = options.output;
        }
      }

      this.insert();
      //Aak.log(this);
    },
    log : function (a) {
      var a = (a) ? a : '';
      Aak.log('Aak.player ' + a + ' --> ', this);
    },
    addDownloadBtn : function () {
      var btn = document.createElement("p");
      btn.innerHTML = '<strong>Video: </strong> <a href="' + this.attributes.src + '" download>Download</a>';
      this.out.node.parentNode.insertBefore(btn, this.out.node);
    },
    mergeObj : function (obj1, obj2) {
      for (var prop in obj2) {
        obj1[prop] = obj2[prop];
      }
    },
    setVars : function (flashvars) {
      if (typeof flashvars == 'string') {
        this.flashvars.str = flashvars;
        this.splitVars();
        this.joinVars();
      } else if (typeof flashvars == 'object') {
        this.mergeObj(this.flashvars.obj, flashvars);
        this.joinVars();
        this.splitVars();
      }
    },
    removeVars : function (str) {
      var obj = this.flashvars.obj;
      var splits = str.split(',');
      for (var i = 0; i < splits.length; i++) {
        var k = splits[i];
        if (k in obj)
          delete obj[k];
      }
      this.flashvars.obj = obj;
      this.joinVars();
    },
    splitVars : function () {
      var str = Aak.decodeHTML(this.flashvars.str);
      var arr = str.split('&');
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        var k = arr[i];
        if (k != '' && k.split('=')) {
          var s = k.split('=');
          obj[s[0]] = Aak.decodeURI(s[1]);
        }
      }
      this.flashvars.obj = obj;
    },
    joinVars : function () {
      var obj = this.flashvars.obj;
      var arr = [];
      for (k in obj) {
        arr.push(k + '=' + Aak.encodeURI(obj[k])); // encodeURIComponent
      }
      this.flashvars.str = arr.join('&'); // &amp;
    },
    insert : function () {

      //
      this.swfvars = [this.attributes.src, this.flashvars.str].join('?');

      //
      switch (this.options.output) {
      case 'iframe':
        this.out.node = document.createElement('iframe');
        this.out.node.setAttribute('src', this.swfvars);
        this.out.node.setAttribute('width', this.attributes.width);
        this.out.node.setAttribute('height', this.attributes.height);
        this.out.node.setAttribute('frameborder', 0);
        this.out.node.setAttribute('scrolling', 'no');
        break;
      case 'tab':
        this.log();
        return GM_openInTab(this.swfvars);
        break;
      case 'html5':
        this.out.node = document.createElement('video');
        this.out.node.innerHTML = '<strong>Video not playing ? <a href="' + this.attributes.src + '" download>Download file</a> instead.</strong>';
		for (k in this.attributes) {
		  if (k == 'autoplay') { // fix bug duplicate playing on firefox
		    this.out.node.onloadstart = function () {
		      this.play();
		    }
		  } else {
		    this.out.node.setAttribute(k, this.attributes[k]);
		  }
		}
		this.out.node.onerror = function () { // switch to plugin player
		  Aak.player.plugin(this, {file:Aak.player.attributes.src});
		};
        break;
      default:
        this.out.node = document.createElement('embed');
        for (k in this.attributes) {
          this.out.node.setAttribute(k, this.attributes[k]);
        }
        if (this.flashvars.str) {
          this.out.node.setAttribute('flashvars', this.flashvars.str);
        }
      }

      //
      this.out.html = this.getHtml(this.out.node);
      this.out.tag = this.out.node.tagName;

      //
      if (this.options.output == 'inner') {
        this.in.node.innerHTML = this.out.html;
      } else { // replace
        this.in.parent.replaceChild(this.out.node, this.in.node);
      }
      //this.addDownloadBtn();
      this.log('done');
    },
    getHtml : function (node) {
      var tmp = document.createElement('div');
      tmp.appendChild(node.cloneNode(true))
      return tmp.innerHTML;
    },
    getMime : function (file) {
      var mime = file.match(/\.(flv|mp4|webm|ogv|ogg|mp3|mpeg|mpg|mkv|avi|mov)$/);
      if (mime && mime.length == 2) {
        return 'video/' + mime[1];
      } else {
        return 'video/mp4';
      }
    },
    jwplayer5 : function (id, setup) {
      // Jwplayer 5 (flash)
	  // Support: http://tinyurl.com/mjavxdr
	  // mp4, m4v, f4v, mov, flv, webm, aac, mp3, vorbis, hls, rtmp, youtube, aac, m4a, f4a, mp3, ogg, oga

      this.get(id);
      this.nameplayer = 'jwplayer5';
      this.attributes.src = "http://player.longtailvideo.com/player5.9.swf"; // v5.9
      this.attributes.src = "http://player.longtailvideo.com/player.swf"; // v5.10
      this.attributes.height = setup.height || this.in.node.clientHeight || "100%";
      this.attributes.width = setup.width || this.in.node.clientWidth || "100%";

      setup.abouttext = 'Anti-Adblock Killer';
      setup.aboutlink = 'https://github.com/reek/anti-adblock-killer';
      this.mergeObj(this.flashvars.obj, setup);
      this.flashvars.obj.controlbar = 'over';
      if (setup.skin) {
        this.flashvars.obj.skin = 'http://www.longtailvideo.com/files/skins/' + setup.skin + '/5/' + setup.skin + '.zip';
      }
      this.joinVars();
	  this.options.output = 'embed';
      this.insert();
    },
    flowplayer : function (id, setup) {
      // Flowplayer (flash)
	  // Support: mp4, flv, f4v, m4v, mov
      // Config: http://tinyurl.com/na7vy7b

      this.get(id);
      this.nameplayer = 'flowplayer';
      this.attributes.src = "http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf";
      this.attributes.height = setup.clip && setup.clip.height || this.in.node.clientHeight || "100%";
      this.attributes.width = setup.clip && setup.clip.width || this.in.node.clientWidth || "100%";

      setup.autoPlay = setup.clip && setup.clip.autostart;
      setup.url = setup.clip && setup.clip.file;

      this.flashvars.obj = {
        config : JSON.stringify(setup)
      };
      this.flashvars.str = 'config=' + JSON.stringify(setup);
	  this.options.output = 'embed';
      this.insert();
    },
    videojs : function (id, setup) {
      //http://tinyurl.com/pcgx2ob
      //http://tinyurl.com/nscztmm
      //http://jsfiddle.net/N8Zs5/18/

      this.get(id);
      this.nameplayer = 'videoJs';

      setup.height = setup.height || this.attributes.height;
      setup.width = setup.width || this.attributes.width;
      setup.type = this.getMime(setup.file || setup.src);

      var html = '<html><head><link href="http://vjs.zencdn.net/4.8/video-js.css" rel="stylesheet"><script src="http://vjs.zencdn.net/4.8/video.js"></script></head><body><video id="my_video_1" class="video-js vjs-default-skin" controls preload="auto" width="' + setup.width + '" height="' + setup.height + '"></video><script>videojs("my_video_1",{techOrder:["flash","html5"],autoplay:true,sources:[{type:"' + setup.type + '",src:"' + setup.file + '"}]})</script></body></html>';
      this.attributes.src = "data:text/html;charset=utf-8," + escape(html);
      this.options.output = 'iframe';
      this.insert();
    },
    jwplayer6 : function (id, setup) {
      // Jwplayer 6 (flash)
      // Config: http://tinyurl.com/lcygyu9
      // Iframe: http://tinyurl.com/86agg68

      this.get(id);
      this.nameplayer = 'jwplayer6';

      setup.primary = 'flash';
      setup.height = setup.height || this.attributes.height;
      setup.width = setup.width || this.attributes.width;

      var html = '<html><head><script src="http://jwpsrv.com/library/5V3tOP97EeK2SxIxOUCPzg.js"></script></head><body><div id="myElement"></div><script>jwplayer("myElement").setup(' + JSON.stringify(setup) + ');</script></body></html>';
      this.attributes.src = "data:text/html;charset=utf-8," + escape(html);
      this.options.output = 'iframe';
      this.insert();
    },
    external : function (nameplayer, id, setup) {

      this.get(id);
      this.nameplayer = 'external';

      setup.height = setup.height || this.attributes.height;
      setup.width = setup.width || this.attributes.width;

      var encoded = btoa(JSON.stringify(setup));
      this.attributes.src = 'http://reeksite.com/player/player.php?' + nameplayer + '=' + encoded;
      this.options.output = 'iframe';
      this.insert();
    },
    plugin : function (id, setup) {
      // Web Player (plugin)
      // VLC : http://tinyurl.com/omlzp39
      // WMP :
      // QT :

      this.get(id);
      this.nameplayer = 'plugin';
      this.attributes.autoplay = setup.autostart || setup.autoplay || false;
      this.attributes.src = setup.file || setup.src;
      this.attributes.height = setup.height || this.in.node.clientHeight || "100%";
      this.attributes.width = setup.width || this.in.node.clientWidth || "100%";

      // Plugins
      var plugins = [];
      if (navigator.plugins && (navigator.plugins.length > 0)) {
        for (var i = 0; i < navigator.plugins.length; i++) {
          plugins.push(navigator.plugins[i].name);
        }
        var plugins = plugins.join('|');
        if (Aak.contains(plugins, 'Windows Media Player')) {
          this.attributes.type = "application/x-mplayer2";
          this.attributes.pluginspage = 'http://www.microsoft.com/Windows/MediaPlayer/';
        } else if (Aak.contains(plugins, 'VLC Web Plugin')) {
          this.attributes.type = "application/x-vlc-plugin";
          this.attributes.pluginspage = "http://www.videolan.org";
        } else if (Aak.contains(plugins, 'QuickTime Plug-in')) {
          this.attributes.type = "video/quicktime";
          this.attributes.pluginspage = "http://www.apple.com/quicktime/download/";
        } else {
          Aak.notification('You need install VLC Web Plugin ! <a href="http://www.videolan.org/vlc/" target="_blank">Install</a>', 30000);
          return false;
        }
      }
      this.options.output = 'embed';
      this.insert();
    },
    html5 : function (id, setup) {

      //  Video Tag (html5)
      /* Note:
      https://html5rocks.com/en/tutorials/video/basics/
      http://www.w3schools.com/tags/tag_video.asp

      // Test video
      https://www.joomlacontenteditor.net/images/big_buck_bunny.flv
      http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4
      http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm
      http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv
       */

      this.get(id);
      //this.attributes = {};
      this.attributes.id = this.attributes.name = Aak.generateID();
      this.attributes.height = setup.height || this.in.node.clientHeight || "100%";
      this.attributes.width = setup.width || this.in.node.clientWidth || "100%";
      this.attributes.src = setup.file || setup.src;
      this.attributes.type = this.getMime(this.attributes.src);
      this.attributes.controls = 'controls';
      //this.attributes.preload = 'none';
      if (setup.autostart || setup.autoplay) {
        this.attributes.autoplay = 'autoplay';
      }
      this.options.output = 'html5';
      this.insert();
    }
  },
  rules : {
    // --------------------------------------------------------------------------------------------
    // Specific
    // --------------------------------------------------------------------------------------------
      vipleague_domains : {
      host : ['vipleague.ws', 'vipleague.tv', 'vipleague.se', 'vipleague.me', 'vipleague.co', 'vipleague.sx', 'vipleague.ch', 'vipbox.tv', 'vipbox.co', 'vipbox.sx', 'vipboxsa.co', 'strikeout.co', 'homerun.re'],
      onAlways : function () {
      //  Aak.uw.test = function () {};
      //    for (i in Aak.uw) { Aak.uw[i] = function () {};  }
       var noop = function () {}, au = Aak.uw, i;
       for (i in au) if (au.hasOwnProperty(i) && typeof au[i] === 'function') au[i] = noop;
      }
    },
    fuckAdBlock : {
      host : ['kooralive.info', 'miniup.com'],
      onAlways : function () {
        Aak.uw.fuckAdBlock = 1;
      }
    },
    // --------------------------------------------------------------------------------------------
    // Players
    // --------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------
    // Generic
    // --------------------------------------------------------------------------------------------
    generic : {
      host : ['.*?'],
      //onRemove : function (removedNode) {Aak.log(removedNode);},
      //onSubtreeModified : function (e) {Aak.log(e.target);},
      onStart : function () {
        // do nothing
      },
      onLoad : function () {

        /* Alternative solution
        // AntiAdblock (Packer) only Zdxd
        if (typeof Aak.uw.k == 'function' &&
        typeof Aak.uw.h == 'function' &&
        typeof Aak.uw.ShowAdbblock == 'function' &&
        Aak.contains(Aak.uw.ShowAdbblock.toString(), 'warningMessage.innerHTML=text_detected()')) {

        // Disable
        Aak.uw.ShowAdbblock = function () {return;};
        Aak.uw.k = function () {return;};
        Aak.uw.h = function () {return;};
        Aak.autoReport('AntiAdblockPackerZdxd)');
        }
         */

        /*
        // Adunblock - http://adunblock.com/
        if (Aak.getCookie('adblock') == 1) {
        Aak.setCookie('adblock', 0);
        Aak.setCookie('bar_closed', 1);
        }
         */

        // Better Stop Adblock
        //Aak.uw.audio_file = false;
		
        // Adbuddy
        if (typeof Aak.uw.closeAdbuddy === 'function') {
		  Aak.uw.closeAdbuddy();
          Aak.autoReport('Adbuddy');
        }

        // AdBlock Alerter (WP) Fix 10.12.2014
        if (Aak.getElement('div.adb_overlay > div.adb_modal_img')) {
          // Remove Alert + Allow Scroll
          Aak.removeElement('div.adb_overlay');
          Aak.addStyle('html,body {height:auto !important; overflow: auto !important;}');
          Aak.autoReport('AdBlockAlerter');
        }

        // Unknow Anti AdBlock system
        if (Aak.getElement('#blockdiv') && Aak.contains(Aak.getElement('#blockdiv').innerHTML, 'disable ad blocking or use another browser without any adblocker when you visit')) {
          Aak.removeElement('#blockdiv');
        }

        // Antiblock - http://antiblock.org/
        localStorage.antiblockId = false;
        var styles = document.querySelectorAll('style');
        for (var i in styles) {
          var style = styles[i];
          //Aak.log(style);
          if (typeof style == "object") {
            var css = style.innerHTML.replace(/[\n\r\t\s]+/g, "");
            var matches = css.match(/#([0-9a-z]{4,10})\{.*position:fixed\!important;.+document\.documentElement.scrollTop\?document\.documentElement\.scrollTop:document\.body\.scrollTop.+\}#/i);
            if (matches != null && matches.length == 2) {
              //Aak.log(matches);
              localStorage.antiblockId = matches[1];
            }
          }
        }

        // Anti-Adblockers
        var systems = {
          // Plugins WordPress
          'NoAdblock' : '(/plugins/no-adblock/|/blockBlock/blockBlock.jquery.js)',
          'WordPressAdBlockBlocker' : '/plugins/wordpress-adblock-blocker/',
          'AntiBlockBukssaAyman' : '/plugins/anti-block/',
          'BlockAlyzer' : '/plugins/blockalyzer-adblock-counter/',
          'AdBlockingDetector' : '/plugins/ad-blocking-detector/',
          // Plugins Website
          'Adworkmedia' : '(adworkmedia|loxtk|contentlockingnetworks).com/gLoader.php',
          'Adscendmedia' : 'adscendmedia.com/gwjs.php',
          'FuckAdBlock' : '/fuckadblock.js',
          'jQueryAdblock' : '/jquery.adblock.js',
          'jQueryAdblockDetector' : '/jquery.adblock-detector.js',
          'AdvertisementJs' : '/advertisement.js',
          'AdvertisementJsMin' : '/advert.js',
          'AdvertisementJsSuffix' : '/advertisement([0-9]+|[\-._][a-z0-9]+)\.js',
          'AdframeJs' : '/adframe.js',
          'AntiAdBuster' : '/anti-ad-buster.js',
          'RTKAntiAdblock' : '/blockcake.js',
          'AdblockDetector' : '/AdblockDetector/handler.min.js',
          'jQueryAntiAdsBlock' : '/jquery.antiadsblock.js',
          'Adbuddy' : '/js/adbuddy.min.js',
          'AntiADsBlocker' : '/aadb/script.js'
        }
        var scripts = document.scripts;
        for (var i = 0; i < scripts.length; i++) {
          var script = scripts[i];
          if (script.src) {
            for (key in systems) {
              if (new RegExp(systems[key], 'i').test(script.src)) {
                //Aak.log(key, location.host, script.src);
                Aak.autoReport(key, location.host, script.src);
                break;
              }
            }
          }
        }

      },
      onInsert : function (insertedNode) {

        // All Nodes
        if (Aak.debug.inserted) {
          Aak.log(insertedNode);
        }
		
		// No-Adblock - http://www.no-adblock.com/
		if (insertedNode.id &&
		  insertedNode.id.length == 4 &&
		  /^[a-z0-9]{4}$/.test(insertedNode.id) &&
		  insertedNode.nodeName == 'DIV' &&
		  insertedNode.firstChild &&
		  insertedNode.firstChild.id &&
		  insertedNode.firstChild.id == insertedNode.id &&
		  Aak.contains(insertedNode.innerHTML, 'no-adblock.com')) {
		  // Remove
		  Aak.autoReport('No-Adblock', false, location.href);
		  Aak.removeElement(insertedNode);
		  //Aak.log(insertedNode);
		}		
		
		
		// StopAdblock - http://stopadblock.org/downloads/
		if (insertedNode.id &&
		  insertedNode.id.length == 7 &&
		  /^a[a-z0-9]{6}$/.test(insertedNode.id) &&
		  insertedNode.nodeName == 'DIV' &&
		  insertedNode.parentNode &&
		  insertedNode.parentNode.id &&
		  insertedNode.parentNode.id == insertedNode.id + '2' &&
		  Aak.contains(insertedNode.innerHTML, 'stopadblock.org')) {
		  // Remove
		  Aak.autoReport('StopAdBlock', false, location.href);
		  Aak.removeElement(insertedNode);
		  //Aak.log(insertedNode);
		}

		
        // AntiAdblock (Packer)
        var reIframeId = /^(zd|wd)$/;
        var reImgId = /^(xd|gd)$/;
        var reImgSrc = /\/ads\/banner.jpg/;
        var reIframeSrc = /(\/adhandler\/|\/adimages\/)/;

        // Communs
        if (insertedNode.id &&
          reImgId.test(insertedNode.id) &&
          insertedNode.nodeName == 'IMG' &&
          reImgSrc.test(insertedNode.src) ||
          insertedNode.id &&
          reIframeId.test(insertedNode.id) &&
          insertedNode.nodeName == 'IFRAME' &&
          reIframeSrc.test(insertedNode.src)) {

          // Variant 1
          if (insertedNode.id == 'xd') {
            Aak.autoReport('AntiAdblockPackerZdxd', false, location.href);
          } // Variant 2
          else if (insertedNode.id == 'gd') {
            Aak.autoReport('AntiAdblockPackerWdgd', false, location.href);
          }
          // Remove
          //Aak.log(insertedNode);
          Aak.removeElement(insertedNode);
        }

        // Adunblock - http://adunblock.com/
        var reId = /^[a-z]{8}$/;
        var reClass = /^[a-z]{8} [a-z]{8}$/;
        var reBg = /^[a-z]{8}-bg$/;
        var reStyle = /top: -?[\d]+px; opacity: [\d]; visibility: visible;/;
        var reMessage = /Il semblerait que vous utilisiez un bloqueur de publicité !/;

        // Communs
        if (typeof Aak.uw.vtfab != 'undefined' &&
          typeof Aak.uw.adblock_antib != 'undefined' &&
          insertedNode.parentNode &&
          insertedNode.parentNode.nodeName == 'BODY' &&
          insertedNode.id &&
          reId.test(insertedNode.id) &&
          insertedNode.nodeName == 'DIV' &&
          insertedNode.nextSibling &&
          insertedNode.nextSibling.className &&
          insertedNode.nextSibling.nodeName == 'DIV') {

          // Full Screen Message (Premium)
          // <div id="lfyhsvdq" class="tvwnoqdf svonexrk" style="top: 100px; opacity: 1; visibility: visible;">
          // <div class="tvwnoqdf-bg" style="display: block;"></div>
          if (insertedNode.className &&
            reClass.test(insertedNode.className) &&
            reBg.test(insertedNode.nextSibling.className) &&
            insertedNode.nextSibling.style &&
            insertedNode.nextSibling.style.display != 'none') {

            // Remove Message
            Aak.autoReport("AdUnBlockPremium");
            Aak.removeElement(insertedNode.nextSibling); // overlay
            Aak.removeElement(insertedNode); // box
          }
          // Top bar Message (Free)
          // <div id="vixmgrly">
          // <div id="mfnhaiyx" class="lkrnvbyt">
          else if (insertedNode.nextSibling.id &&
            reId.test(insertedNode.nextSibling.id) &&
            reMessage.test(insertedNode.innerHTML)) {

            // Remove Message
            Aak.autoReport("AdUnBlockFree");
            Aak.removeElement(insertedNode);
          }
        }

        // Antiblock - http://antiblock.org/
        var reId = /^[a-z0-9]{4,10}$/i;
        var reTag1 = /(div|span|b|i|font|strong|center)/i;
        var reTag2 = /[abisuqp]{1}/i;
        var reWords1 = /ad blocker|ad block|ad-block|adblocker|ad-blocker|adblock|bloqueur|bloqueador|Werbeblocker|adblockert|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;/i;
        var reWords2 = /kapat|disable|désactivez|désactiver|desactivez|desactiver|desative|desactivar|desactive|desactiva|deaktiviere|disabilitare|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le/i;

        // Communs
        if (insertedNode.parentNode &&
          insertedNode.id &&
          insertedNode.style &&
          insertedNode.firstChild &&
          !insertedNode.firstChild.id &&
          !insertedNode.firstChild.className &&
          reId.test(insertedNode.id) &&
          reTag1.test(insertedNode.nodeName) &&
          reTag2.test(insertedNode.firstChild.nodeName)) {
          //Aak.log(insertedNode);
		  
          // Kill audio message
          var audio = insertedNode.querySelector("audio[loop]") || false;
          if (audio) {
		    Aak.log('Antiblock(audio)');
            audio.pause();
            Aak.removeElement(audio);
          }
		  
          // Antiblock.org v3 + Fork
          if (insertedNode.firstChild.firstChild &&
            insertedNode.firstChild.firstChild.nodeName == "IMG" &&
            typeof Aak.uw[insertedNode.id] == 'object' &&
            typeof Aak.uw[insertedNode.id].displayMessage == 'function') {

            // Better Stop Adblock
            // Demo: http://codeclan.altervista.org/
            if (typeof Aak.uw[insertedNode.id].toggle == 'function') {
              var childs = document.body.childNodes;
              for (var i = 0; i < childs.length; i++) {
                var child = childs[i];
                if (child.nodeType == 1 && child.style.display == 'none') {
                  child.style.display = ''; // show
                  //Aak.log(node);
                }
              }
              Aak.autoReport('BetterStopAdblock');
            }
            // Antiblock.org v3
            else {
              Aak.autoReport('Antiblock3');
            }
            // Disable
            //Aak.log(insertedNode, Aak.uw[insertedNode.id]);
            Aak.removeElement(insertedNode);
            Aak.uw[insertedNode.id] = false;
          }
          // Antiblock.org v3 + v2 (Alternative Solution)
          else if (localStorage.antiblockId != false &&
            insertedNode.id == localStorage.antiblockId) {
            // V3
            if (typeof Aak.uw[insertedNode.id] == 'object') {
              Aak.uw[insertedNode.id] = false;
              Aak.autoReport("Antiblock3");
            } else { // V2
              Aak.autoReport("Antiblock2");
            }
            // Disable
            //Aak.log(insertedNode);
            Aak.removeElement(insertedNode);
          }
          // Antiblock.org v2
          else if (reWords1.test(insertedNode.innerHTML) &&
            reWords2.test(insertedNode.innerHTML)) {
            // Disable
            //Aak.log(insertedNode);
            Aak.autoReport("Antiblock2");
            Aak.removeElement(insertedNode);
          }
          //  Many false positive
          else {
            //Aak.removeElement(insertedNode);
          }
        }
      }
    }
  }
};

Aak.initialize();