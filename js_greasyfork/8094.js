// ==UserScript==
// @name           Kaskus Anti Lazy Load Image
// @namespace      https://greasyfork.org/en/scripts/8094-kaskus-anti-lazy-load-image
// @description    Early Load All Images w/o waiting for window scroll
// @author         tuxie.forte
// @version        0.1
// @dtversion      150215010
// @timestamp      1424014735738
// @include        /^https?://(www\.)?kaskus.co.id/thread/*/
// @include        /^https?://(www\.)?kaskus.co.id/lastpost/*/
// @include        /^https?://(www\.)?kaskus.co.id/post/*/
// @license        (CC) by-nc-sa 3.0
//
// -!--latestupdate
//
// v0.1 - 2015-02-15 . 1424014735738
//  Init
//  
// -/!latestupdate---
// @downloadURL https://update.greasyfork.org/scripts/8094/Kaskus%20Anti%20Lazy%20Load%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/8094/Kaskus%20Anti%20Lazy%20Load%20Image.meta.js
// ==/UserScript==
/*
//
//------
//
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License
// http://creativecommons.org/licenses/by-nc-sa/3.0/deed.ms
// --------------------------------------------------------
*/
(function(){

  var gvar = function(){};
  gvar.sversion = 'v' + '0.1';
  gvar.scriptMeta = {
    timestamp: 1424014735738 // version.timestamp
   ,scriptID: 91051 // script-Id
  };
  /*
  window.alert(new Date().getTime());
  */
  //========-=-=-=-=--=========
  gvar.__DEBUG__ = !1; // development debug
  //========-=-=-=-=--=========

  const GMSTORAGE_PATH = 'GM_';
  const KS       = 'KEY_SAVE_';

  //========= Global Var Init ====
  var $D=function (q, root, single) {
    var el;
    if (root && typeof root == 'string') {
        root = $D(root, null, true);
        if (!root) { return null; }
    }
    if( !q ) return false;
    if ( typeof q == 'object') return q;
    root = root || document;
    if (q[0]=='/' || (q[0]=='.' && q[1]=='/')) {
        if (single) {
          return document.evaluate(q, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
        return document.evaluate(q, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }
    else if (q[0]=='.') {
      el = root.getElementsByClassName(q.substr(1));
      return single ? el[0] : el;
    }
    else {
      return root.getElementById( (q[0]=='#' ? q.substr(1):q.substr(0)) );
    }
    return root.getElementsByTagName(q);
  };


  function init(){
    ApiBrowserCheck();

    // -- let's roll --
    // scan all mls-img
    var node, images = $D('//img[@class="mls-img"]');
    clog("image-males-hits: "+images.snapshotLength+" items");

    if(images.snapshotLength > 0){
      for(var i=0, lg = images.snapshotLength; i<lg; i++) {
        node = images.snapshotItem(i);
        src = node.getAttribute("data-src");

        node.setAttribute("src", node.getAttribute("data-src"));
        node.removeAttribute("data-src");
        addClass("rjn-img", node);
        removeClass("mls-img", node);
      }
    }
  } // end-init



  // static routine
  function trimStr(x) { return x.replace(/^\s+|\s+$/g,""); };
  function addClass(cName, Obj){
    if( !cName || !Obj ) return;
    if( !hasClass(cName, Obj) ) return;
    var neocls = (Obj.className ? ' '+trimStr(Obj.className)+' ' : '')+cName;
    Obj.setAttribute('class', trimStr(neocls));
  }
  function hasClass(cName, Obj){
    return (' ' + Obj.className + ' ').indexOf(' ' +cName + ' ') > -1;
  }
  function removeClass(cName, Obj){
    if( !cName || !Obj ) return;
    if( !hasClass(cName, Obj) ) return;
    var neocls = (Obj.className ? ' '+Obj.className+' ' : '');
    neocls = trimStr ( neocls.replace(cName, "") ); // replace and trim
    Obj.setAttribute('class', neocls);
  }


  // play safe with Opera;
  //=== BROWSER DETECTION / ADVANCED SETTING
  //=============snipet-authored-by:GI-Joe==//
  function ApiBrowserCheck() {
    //delete GM_log; delete GM_getValue; delete GM_setValue; delete GM_deleteValue; delete GM_xmlhttpRequest; delete GM_openInTab; delete GM_registerMenuCommand;
    if(typeof(unsafeWindow)=='undefined') { unsafeWindow=window; }
    if(typeof(GM_log)=='undefined') { GM_log=function(msg) { try { unsafeWindow.console.log('GM_log: '+msg); } catch(e) {} }; }
    
    var needApiUpgrade=false;
    if(window.navigator.appName.match(/^opera/i) && typeof(window.opera)!='undefined') {
      needApiUpgrade=true; gvar.isOpera=true; GM_log=window.opera.postError; clog('Opera detected...',0);
    }
    if(typeof(GM_setValue)!='undefined') {
      var gsv; try { gsv=GM_setValue.toString(); } catch(e) { gsv='.staticArgs.FF4.0'; }
      if(gsv.indexOf('staticArgs')>0) {
        gvar.isGreaseMonkey=true; gvar.isFF4=false;
        clog('GreaseMonkey Api detected'+( (gvar.isFF4=gsv.indexOf('FF4.0')>0) ?' >= FF4':'' )+'...',0); 
      } // test GM_hitch
      else if(gsv.match(/not\s+supported/)) {
        needApiUpgrade=true; gvar.isBuggedChrome=true; clog('Bugged Chrome GM Api detected...',0);
      }
    } else { needApiUpgrade=true; clog('No GM Api detected...',0); }
    
    gvar.noCrossDomain = (gvar.isOpera || gvar.isBuggedChrome);
    if(needApiUpgrade) {
      //gvar.noCrossDomain = gvar.isBuggedChrome = 1;
      clog('Try to recreate needed GM Api...',0);
      //OPTIONS_BOX['FLASH_PLAYER_WMODE'][3]=2; OPTIONS_BOX['FLASH_PLAYER_WMODE_BCHAN'][3]=2; // Change Default wmode if there no greasemonkey installed
      var ws=null; try { ws=typeof(unsafeWindow.localStorage) } catch(e) { ws=null; } // Catch Security error
      if(ws=='object') {
        clog('Using localStorage for GM Api.',0);
        GM_getValue=function(name,defValue) { var value=unsafeWindow.localStorage.getItem(GMSTORAGE_PATH+name); if(value==null) { return defValue; } else { switch(value.substr(0,2)) { case 'S]': return value.substr(2); case 'N]': return parseInt(value.substr(2)); case 'B]': return value.substr(2)=='true'; } } return value; };
        GM_setValue=function(name,value) { switch (typeof(value)) { case 'string': unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'S]'+value); break; case 'number': if(value.toString().indexOf('.')<0) { unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'N]'+value); } break; case 'boolean': unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'B]'+value); break; } };
        GM_deleteValue=function(name) { unsafeWindow.localStorage.removeItem(GMSTORAGE_PATH+name); };
      } else if(!gvar.isOpera || typeof(GM_setValue)=='undefined') {
        clog('Using temporarilyStorage for GM Api.',0); gvar.temporarilyStorage=new Array();
        GM_getValue=function(name,defValue) { if(typeof(gvar.temporarilyStorage[GMSTORAGE_PATH+name])=='undefined') { return defValue; } else { return gvar.temporarilyStorage[GMSTORAGE_PATH+name]; } };
        GM_setValue=function(name,value) { switch (typeof(value)) { case "string": case "boolean": case "number": gvar.temporarilyStorage[GMSTORAGE_PATH+name]=value; } };
        GM_deleteValue=function(name) { delete gvar.temporarilyStorage[GMSTORAGE_PATH+name]; };
      }
      if(typeof(GM_openInTab)=='undefined') { GM_openInTab=function(url) { unsafeWindow.open(url,""); }; }
      if(typeof(GM_registerMenuCommand)=='undefined') { GM_registerMenuCommand=function(name,cmd) { GM_log("Notice: GM_registerMenuCommand is not supported."); }; } // Dummy
      if(!gvar.isOpera || typeof(GM_xmlhttpRequest)=='undefined') {
        clog('Using XMLHttpRequest for GM Api.',0);
        GM_xmlhttpRequest=function(obj) {
        var request=new XMLHttpRequest();
        request.onreadystatechange=function() { if(obj.onreadystatechange) { obj.onreadystatechange(request); }; if(request.readyState==4 && obj.onload) { obj.onload(request); } }
        request.onerror=function() { if(obj.onerror) { obj.onerror(request); } }
        try { request.open(obj.method,obj.url,true); } catch(e) { if(obj.onerror) { obj.onerror( {readyState:4,responseHeaders:'',responseText:'',responseXML:'',status:403,statusText:'Forbidden'} ); }; return; }
        if(obj.headers) { for(name in obj.headers) { request.setRequestHeader(name,obj.headers[name]); } }
        request.send(obj.data); return request;
      }; }
    } // end needApiUpgrade
    GM_getIntValue=function(name,defValue) { return parseInt(GM_getValue(name,defValue),10); };
  }
  // ----my ge-debug--------
  function show_alert(msg, force) {
    if(arguments.callee.counter) { arguments.callee.counter++; } else { arguments.callee.counter=1; }
    GM_log('('+arguments.callee.counter+') '+msg);
    if(force==0) { return; }
  }
  function clog(msg) {
    if(!gvar.__DEBUG__) return;
    show_alert(msg);
  }

  //----
  init()
})();
/* tF. */ 