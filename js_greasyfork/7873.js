// ==UserScript==
// @name         Class Dojo Plus
// @namespace    https://greasyfork.org/en/scripts/7873-class-dojo-plus
// @version      2015.05.31.02
// @description  Useful hacks for the already excellent Class Dojo
// @author       Ryan Meyers
// @icon          http://appsandoranges.github.io/Class-Dojo-Plus/images/icon.png
// @match        http://teach.classdojo.com/*
// @match    https://teach.classdojo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7873/Class%20Dojo%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/7873/Class%20Dojo%20Plus.meta.js
// ==/UserScript==
/*!
 * Class Dojo Plus
 * http://appsandoranges.github.io/Class-Dojo-Plus/
 *
 * Allows for class arrangements (saved per computer), hotkeys for students/behaviors,
 * quick points via mouse wheel, and more!
 *
 *
 * Copyright 2015, Ryan Meyers
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */


 debugging = true;
 show_ajax = false;

if(!debugging)
{
 console.newLog = console.log;
 console.log = function(){};
}

/*!
  * Bowser - a browser detector
  * https://github.com/ded/bowser
  * MIT License | (c) Dustin Diaz 2014
  */
!function(e,t){typeof module!="undefined"&&module.exports?module.exports.browser=t():typeof define=="function"&&define.amd?define(t):this[e]=t()}("bowser",function(){function t(t){function n(e){var n=t.match(e);return n&&n.length>1&&n[1]||""}var r=n(/(ipod|iphone|ipad)/i).toLowerCase(),i=/like android/i.test(t),s=!i&&/android/i.test(t),o=n(/version\/(\d+(\.\d+)?)/i),u=/tablet/i.test(t),a=!u&&/[^-]mobi/i.test(t),f;/opera|opr/i.test(t)?f={name:"Opera",opera:e,version:o||n(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)}:/windows phone/i.test(t)?f={name:"Windows Phone",windowsphone:e,msie:e,version:n(/iemobile\/(\d+(\.\d+)?)/i)}:/msie|trident/i.test(t)?f={name:"Internet Explorer",msie:e,version:n(/(?:msie |rv:)(\d+(\.\d+)?)/i)}:/chrome|crios|crmo/i.test(t)?f={name:"Chrome",chrome:e,version:n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:r?(f={name:r=="iphone"?"iPhone":r=="ipad"?"iPad":"iPod"},o&&(f.version=o)):/sailfish/i.test(t)?f={name:"Sailfish",sailfish:e,version:n(/sailfish\s?browser\/(\d+(\.\d+)?)/i)}:/seamonkey\//i.test(t)?f={name:"SeaMonkey",seamonkey:e,version:n(/seamonkey\/(\d+(\.\d+)?)/i)}:/firefox|iceweasel/i.test(t)?(f={name:"Firefox",firefox:e,version:n(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)},/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(t)&&(f.firefoxos=e)):/silk/i.test(t)?f={name:"Amazon Silk",silk:e,version:n(/silk\/(\d+(\.\d+)?)/i)}:s?f={name:"Android",version:o}:/phantom/i.test(t)?f={name:"PhantomJS",phantom:e,version:n(/phantomjs\/(\d+(\.\d+)?)/i)}:/blackberry|\bbb\d+/i.test(t)||/rim\stablet/i.test(t)?f={name:"BlackBerry",blackberry:e,version:o||n(/blackberry[\d]+\/(\d+(\.\d+)?)/i)}:/(web|hpw)os/i.test(t)?(f={name:"WebOS",webos:e,version:o||n(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)},/touchpad\//i.test(t)&&(f.touchpad=e)):/bada/i.test(t)?f={name:"Bada",bada:e,version:n(/dolfin\/(\d+(\.\d+)?)/i)}:/tizen/i.test(t)?f={name:"Tizen",tizen:e,version:n(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i)||o}:/safari/i.test(t)?f={name:"Safari",safari:e,version:o}:f={},/(apple)?webkit/i.test(t)?(f.name=f.name||"Webkit",f.webkit=e,!f.version&&o&&(f.version=o)):!f.opera&&/gecko\//i.test(t)&&(f.name=f.name||"Gecko",f.gecko=e,f.version=f.version||n(/gecko\/(\d+(\.\d+)?)/i)),s||f.silk?f.android=e:r&&(f[r]=e,f.ios=e);var l="";r?(l=n(/os (\d+([_\s]\d+)*) like mac os x/i),l=l.replace(/[_\s]/g,".")):s?l=n(/android[ \/-](\d+(\.\d+)*)/i):f.windowsphone?l=n(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i):f.webos?l=n(/(?:web|hpw)os\/(\d+(\.\d+)*)/i):f.blackberry?l=n(/rim\stablet\sos\s(\d+(\.\d+)*)/i):f.bada?l=n(/bada\/(\d+(\.\d+)*)/i):f.tizen&&(l=n(/tizen[\/\s](\d+(\.\d+)*)/i)),l&&(f.osversion=l);var c=l.split(".")[0];if(u||r=="ipad"||s&&(c==3||c==4&&!a)||f.silk)f.tablet=e;else if(a||r=="iphone"||r=="ipod"||s||f.blackberry||f.webos||f.bada)f.mobile=e;return f.msie&&f.version>=10||f.chrome&&f.version>=20||f.firefox&&f.version>=20||f.safari&&f.version>=6||f.opera&&f.version>=10||f.ios&&f.osversion&&f.osversion.split(".")[0]>=6||f.blackberry&&f.version>=10.1?f.a=e:f.msie&&f.version<10||f.chrome&&f.version<20||f.firefox&&f.version<20||f.safari&&f.version<6||f.opera&&f.version<10||f.ios&&f.osversion&&f.osversion.split(".")[0]<6?f.c=e:f.x=e,f}var e=!0,n=t(typeof navigator!="undefined"?navigator.userAgent:"");return n._detect=t,n})

/*!
 * Fastclick
 * https://github.com/ftlabs/fastclick
 * MIT License | (c) Financial Times Labs 2015
 */
!function e(t,n,r){function o(s,a){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(i)return i(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[s]={exports:{}};t[s][0].call(u.exports,function(e){var n=t[s][1][e];return o(n?n:e)},u,u.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(e,t){!function(){"use strict";function e(t,n){function o(e,t){return function(){return e.apply(t,arguments)}}var i;if(n=n||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=n.touchBoundary||10,this.layer=t,this.tapDelay=n.tapDelay||200,this.tapTimeout=n.tapTimeout||700,!e.notNeeded(t)){for(var s=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],a=this,c=0,l=s.length;l>c;c++)a[s[c]]=o(a[s[c]],a);r&&(t.addEventListener("mouseover",this.onMouse,!0),t.addEventListener("mousedown",this.onMouse,!0),t.addEventListener("mouseup",this.onMouse,!0)),t.addEventListener("click",this.onClick,!0),t.addEventListener("touchstart",this.onTouchStart,!1),t.addEventListener("touchmove",this.onTouchMove,!1),t.addEventListener("touchend",this.onTouchEnd,!1),t.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(t.removeEventListener=function(e,n,r){var o=Node.prototype.removeEventListener;"click"===e?o.call(t,e,n.hijacked||n,r):o.call(t,e,n,r)},t.addEventListener=function(e,n,r){var o=Node.prototype.addEventListener;"click"===e?o.call(t,e,n.hijacked||(n.hijacked=function(e){e.propagationStopped||n(e)}),r):o.call(t,e,n,r)}),"function"==typeof t.onclick&&(i=t.onclick,t.addEventListener("click",function(e){i(e)},!1),t.onclick=null)}}var n=navigator.userAgent.indexOf("Windows Phone")>=0,r=navigator.userAgent.indexOf("Android")>0&&!n,o=/iP(ad|hone|od)/.test(navigator.userAgent)&&!n,i=o&&/OS 4_\d(_\d)?/.test(navigator.userAgent),s=o&&/OS [6-7]_\d/.test(navigator.userAgent),a=navigator.userAgent.indexOf("BB10")>0;e.prototype.needsClick=function(e){switch(e.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(e.disabled)return!0;break;case"input":if(o&&"file"===e.type||e.disabled)return!0;break;case"label":case"iframe":case"video":return!0}return/\bneedsclick\b/.test(e.className)},e.prototype.needsFocus=function(e){switch(e.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!r;case"input":switch(e.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!e.disabled&&!e.readOnly;default:return/\bneedsfocus\b/.test(e.className)}},e.prototype.sendClick=function(e,t){var n,r;document.activeElement&&document.activeElement!==e&&document.activeElement.blur(),r=t.changedTouches[0],n=document.createEvent("MouseEvents"),n.initMouseEvent(this.determineEventType(e),!0,!0,window,1,r.screenX,r.screenY,r.clientX,r.clientY,!1,!1,!1,!1,0,null),n.forwardedTouchEvent=!0,e.dispatchEvent(n)},e.prototype.determineEventType=function(e){return r&&"select"===e.tagName.toLowerCase()?"mousedown":"click"},e.prototype.focus=function(e){var t;o&&e.setSelectionRange&&0!==e.type.indexOf("date")&&"time"!==e.type&&"month"!==e.type?(t=e.value.length,e.setSelectionRange(t,t)):e.focus()},e.prototype.updateScrollParent=function(e){var t,n;if(t=e.fastClickScrollParent,!t||!t.contains(e)){n=e;do{if(n.scrollHeight>n.offsetHeight){t=n,e.fastClickScrollParent=n;break}n=n.parentElement}while(n)}t&&(t.fastClickLastScrollTop=t.scrollTop)},e.prototype.getTargetElementFromEventTarget=function(e){return e.nodeType===Node.TEXT_NODE?e.parentNode:e},e.prototype.onTouchStart=function(e){var t,n,r;if(e.targetTouches.length>1)return!0;if(t=this.getTargetElementFromEventTarget(e.target),n=e.targetTouches[0],o){if(r=window.getSelection(),r.rangeCount&&!r.isCollapsed)return!0;if(!i){if(n.identifier&&n.identifier===this.lastTouchIdentifier)return e.preventDefault(),!1;this.lastTouchIdentifier=n.identifier,this.updateScrollParent(t)}}return this.trackingClick=!0,this.trackingClickStart=e.timeStamp,this.targetElement=t,this.touchStartX=n.pageX,this.touchStartY=n.pageY,e.timeStamp-this.lastClickTime<this.tapDelay&&e.preventDefault(),!0},e.prototype.touchHasMoved=function(e){var t=e.changedTouches[0],n=this.touchBoundary;return Math.abs(t.pageX-this.touchStartX)>n||Math.abs(t.pageY-this.touchStartY)>n?!0:!1},e.prototype.onTouchMove=function(e){return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(e.target)||this.touchHasMoved(e))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},e.prototype.findControl=function(e){return void 0!==e.control?e.control:e.htmlFor?document.getElementById(e.htmlFor):e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},e.prototype.onTouchEnd=function(e){var t,n,a,c,l,u=this.targetElement;if(!this.trackingClick)return!0;if(e.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(e.timeStamp-this.trackingClickStart>this.tapTimeout)return!0;if(this.cancelNextClick=!1,this.lastClickTime=e.timeStamp,n=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,s&&(l=e.changedTouches[0],u=document.elementFromPoint(l.pageX-window.pageXOffset,l.pageY-window.pageYOffset)||u,u.fastClickScrollParent=this.targetElement.fastClickScrollParent),a=u.tagName.toLowerCase(),"label"===a){if(t=this.findControl(u)){if(this.focus(u),r)return!1;u=t}}else if(this.needsFocus(u))return e.timeStamp-n>100||o&&window.top!==window&&"input"===a?(this.targetElement=null,!1):(this.focus(u),this.sendClick(u,e),o&&"select"===a||(this.targetElement=null,e.preventDefault()),!1);return o&&!i&&(c=u.fastClickScrollParent,c&&c.fastClickLastScrollTop!==c.scrollTop)?!0:(this.needsClick(u)||(e.preventDefault(),this.sendClick(u,e)),!1)},e.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},e.prototype.onMouse=function(e){return this.targetElement?e.forwardedTouchEvent?!0:e.cancelable&&(!this.needsClick(this.targetElement)||this.cancelNextClick)?(e.stopImmediatePropagation?e.stopImmediatePropagation():e.propagationStopped=!0,e.stopPropagation(),e.preventDefault(),!1):!0:!0},e.prototype.onClick=function(e){var t;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===e.target.type&&0===e.detail?!0:(t=this.onMouse(e),t||(this.targetElement=null),t)},e.prototype.destroy=function(){var e=this.layer;r&&(e.removeEventListener("mouseover",this.onMouse,!0),e.removeEventListener("mousedown",this.onMouse,!0),e.removeEventListener("mouseup",this.onMouse,!0)),e.removeEventListener("click",this.onClick,!0),e.removeEventListener("touchstart",this.onTouchStart,!1),e.removeEventListener("touchmove",this.onTouchMove,!1),e.removeEventListener("touchend",this.onTouchEnd,!1),e.removeEventListener("touchcancel",this.onTouchCancel,!1)},e.notNeeded=function(e){var t,n,o,i;if("undefined"==typeof window.ontouchstart)return!0;if(n=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!r)return!0;if(t=document.querySelector("meta[name=viewport]")){if(-1!==t.content.indexOf("user-scalable=no"))return!0;if(n>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(a&&(o=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),o[1]>=10&&o[2]>=3&&(t=document.querySelector("meta[name=viewport]")))){if(-1!==t.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===e.style.msTouchAction||"manipulation"===e.style.touchAction?!0:(i=+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1],i>=27&&(t=document.querySelector("meta[name=viewport]"),t&&(-1!==t.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth))?!0:"none"===e.style.touchAction||"manipulation"===e.style.touchAction?!0:!1)},e.attach=function(t,n){return new e(t,n)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return e}):"undefined"!=typeof t&&t.exports?(t.exports=e.attach,t.exports.FastClick=e):window.FastClick=e}()},{}],2:[function(e){window.Origami={fastclick:e("./bower_components/fastclick/lib/fastclick.js")}},{"./bower_components/fastclick/lib/fastclick.js":1}]},{},[2]);;(function() {function trigger(){document.dispatchEvent(new CustomEvent('o.load'))};document.addEventListener('load',trigger);if (document.readyState==='ready') trigger();}());(function() {function trigger(){document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'))};document.addEventListener('DOMContentLoaded',trigger);if (document.readyState==='interactive') trigger();}())

var attachFastClick = Origami.fastclick;
attachFastClick(document.body);

/*!
 * Smart Resize
 *
 */
!function(n,r){var t=function(n,r,t){var e;return function(){function i(){t||n.apply(u,a),e=null}var u=this,a=arguments;e?clearTimeout(e):t&&n.apply(u,a),e=setTimeout(i,r||100)}};jQuery.fn[r]=function(n){return n?this.bind("resize",t(n)):this.trigger(r)}}(jQuery,"smartresize");

function sizer(){
  if(inClass)
  {
  var highest = $(window).height();
  var leftmost = $(window).width();
  var rightmost = 0;
  var lowest = 0;
  //var tileWrapper = document.getElementsByClassName('students-wrapper')[0];
  var tileWrapper = tiles[0].parentNode.parentNode.parentNode;

  if(tileWrapper.style.transform !== "")
          {
          //  var tVal = document.getElementsByClassName('students-wrapper')[0].style.transform;
            var tVal = tileWrapper.style.transform;

            var regex_t3d = /translate3d\(-?\d*px, -?\d*px, -?\d*px\) scale\((-?\d*\.?\d+), -?\d*\.?\d+\)/;
            var regex_matrix = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*-?\d*\.?\d+,\s*0,\s*0\)/;
            if(regex_t3d.test(tVal))
              var alreadyScaled = regex_t3d.exec(tVal)[1];
            else if(regex_matrix.test(tVal))
              var alreadyScaled = regex_matrix.exec(tVal)[1];

          }
        else
          {
            var alreadyScaled = 1;
          }

  for(i=0; i<tiles.length; i++)
    {
      tile = tiles[i].parentNode;
      //tile = tiles[i];
      var pos = $(tile).offset();
      pos.left -= 10;
      pos.top -= 10;
      pos.bottom = pos.top + $(tile).outerHeight()*alreadyScaled;
      pos.right = pos.left + $(tile).outerWidth()*alreadyScaled;
      if(pos.top < highest) highest = pos.top;
      if(pos.left < leftmost) leftmost = pos.left;
      if(pos.bottom > lowest) lowest = pos.bottom;
      if(pos.right > rightmost) rightmost = pos.right;
    }
    tilesHeight = lowest-highest;
    tilesWidth = rightmost-leftmost;
    var useThisForVerticalSpace = $('#leaderboard_list').offset().top;
    var availableVerticalSpace = $(window).height() - useThisForVerticalSpace - (5*alreadyScaled);
    var availableHorizontalSpace = $(window).width() -leftmost - (26*alreadyScaled);




          var scaleToV = availableVerticalSpace/((tilesHeight/alreadyScaled));
          var scaleToV = (availableVerticalSpace+(5*alreadyScaled)-(5*scaleToV))/((tilesHeight/alreadyScaled));
          var scaleToH = availableHorizontalSpace/((tilesWidth/alreadyScaled));
          var scaleToH = (availableHorizontalSpace+(26*alreadyScaled)-(26*scaleToH))/((tilesWidth/alreadyScaled));
          //console.log(availableVerticalSpace, tilesHeight, scaleTo);
        //  TweenMax.set('.students-wrapper',{transformOrigin: '0 0 0' });
        var scaleToVv = $(window).height()/lowest;
        var scaleToHh = $(window).width()/rightmost;

       if(Math.min(scaleToV,scaleToH) != alreadyScaled)
       { TweenMax.set(tileWrapper,{transformOrigin: '0 0 0' });
          TweenMax.to(tileWrapper,1,{scale:Math.min(scaleToV,scaleToH)});
        }


  }
}

$(window).smartresize(sizer);

if (bowser.chrome) { // XHook is pretty great, so if it's Chrome, use it!
  console.log("Using Chrome");
  var appBrowser = 'chrome';
    // XHook - v1.3.0 - https://github.com/jpillora/xhook
  // Jaime Pillora <dev@jpillora.com> - MIT Copyright 2014
  (function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};r=a.document,d="before",c="after",l="readyState",k="addEventListener",j="removeEventListener",g="dispatchEvent",o="XMLHttpRequest",h="FormData",m=["load","loadend","loadstart"],e=["progress","abort","error","timeout"],u=parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase())||[])[1]),isNaN(u)&&(u=parseInt((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase())||[])[1])),(y=Array.prototype).indexOf||(y.indexOf=function(a){var b,c,d,e;for(b=d=0,e=this.length;e>d;b=++d)if(c=this[b],c===a)return b;return-1}),w=function(a,b){return Array.prototype.slice.call(a,b)},q=function(a){return"returnValue"===a||"totalSize"===a||"position"===a},t=function(a,b){var c,d;for(c in a)if(d=a[c],!q(c))try{b[c]=a[c]}catch(e){}return b},v=function(a,b,c){var d,e,f,h;for(e=function(a){return function(d){var e,f,h;e={};for(f in d)q(f)||(h=d[f],e[f]=h===b?c:h);return c[g](a,e)}},f=0,h=a.length;h>f;f++)d=a[f],b["on"+d]=e(d)},s=function(a){var b;if(null!=r.createEventObject)return b=r.createEventObject(),b.type=a,b;try{return new Event(a)}catch(c){return{type:a}}},f=function(a){var c,d,e;return d={},e=function(a){return d[a]||[]},c={},c[k]=function(a,c,f){d[a]=e(a),d[a].indexOf(c)>=0||(f=f===b?d[a].length:f,d[a].splice(f,0,c))},c[j]=function(a,c){var f;return a===b?void(d={}):(c===b&&(d[a]=[]),f=e(a).indexOf(c),void(-1!==f&&e(a).splice(f,1)))},c[g]=function(){var d,f,g,h,i,j,k,l;for(d=w(arguments),f=d.shift(),a||(d[0]=t(d[0],s(f))),h=c["on"+f],h&&h.apply(b,d),l=e(f).concat(e("*")),g=j=0,k=l.length;k>j;g=++j)i=l[g],i.apply(b,d)},a&&(c.listeners=function(a){return w(e(a))},c.on=c[k],c.off=c[j],c.fire=c[g],c.once=function(a,b){var d;return d=function(){return c.off(a,d),b.apply(null,arguments)},c.on(a,d)},c.destroy=function(){return d={}}),c},x=f(!0),x.EventEmitter=f,x[d]=function(a,b){if(a.length<1||a.length>2)throw"invalid hook";return x[k](d,a,b)},x[c]=function(a,b){if(a.length<2||a.length>3)throw"invalid hook";return x[k](c,a,b)},x.enable=function(){a[o]=n},x.disable=function(){a[o]=x[o]},p=x.headers=function(a,b){var c,d,e,f,g,h,i,j,k;switch(null==b&&(b={}),typeof a){case"object":d=[];for(e in a)g=a[e],f=e.toLowerCase(),d.push(""+f+": "+g);return d.join("\n");case"string":for(d=a.split("\n"),i=0,j=d.length;j>i;i++)c=d[i],/([^:]+):\s*(.+)/.test(c)&&(f=null!=(k=RegExp.$1)?k.toLowerCase():void 0,h=RegExp.$2,null==b[f]&&(b[f]=h));return b}},i=a[h],i&&(x[h]=i,a[h]=function(a){var b;this.fd=a?new i(a):new i,this.form=a,b=[],Object.defineProperty(this,"entries",{get:function(){var c;return c=a?w(a.querySelectorAll("input,select")).filter(function(a){var b;return"checkbox"!==(b=a.type)&&"radio"!==b||a.checked}).map(function(a){return[a.name,"file"===a.type?a.files:a.value]}):[],c.concat(b)}}),this.append=function(a){return function(){var c;return c=w(arguments),b.push(c),a.fd.append.apply(a.fd,c)}}(this)}),x[o]=a[o],n=a[o]=function(){var b,i,j,n,q,r,s,w,y,A,B,C,D,E,F,G,H;return b=-1,H=new x[o],A={},D=null,r=void 0,E=void 0,B=void 0,y=function(){var a,c,d,e;if(B.status=D||H.status,D===b&&10>u||(B.statusText=H.statusText),D!==b){e=p(H.getAllResponseHeaders());for(a in e)d=e[a],B.headers[a]||(c=a.toLowerCase(),B.headers[c]=d)}},w=function(){"responseText"in H&&(B.text=H.responseText),"responseXML"in H&&(B.xml=H.responseXML),"response"in H&&(B.data=H.response)},G=function(){q.status=B.status,q.statusText=B.statusText},F=function(){"text"in B&&(q.responseText=B.text),"xml"in B&&(q.responseXML=B.xml),"data"in B&&(q.response=B.data)},n=function(a){for(;a>i&&4>i;)q[l]=++i,1===i&&q[g]("loadstart",{}),2===i&&G(),4===i&&(G(),F()),q[g]("readystatechange",{}),4===i&&setTimeout(j,0)},j=function(){r||q[g]("load",{}),q[g]("loadend",{}),r&&(q[l]=0)},i=0,C=function(a){var b,d;return 4!==a?void n(a):(b=x.listeners(c),d=function(){var a;return b.length?(a=b.shift(),2===a.length?(a(A,B),d()):3===a.length&&A.async?a(A,B,d):d()):n(4)},void d())},q=A.xhr=f(),H.onreadystatechange=function(){try{2===H[l]&&y()}catch(a){}4===H[l]&&(E=!1,y(),w()),C(H[l])},s=function(){r=!0},q[k]("error",s),q[k]("timeout",s),q[k]("abort",s),q[k]("progress",function(){3>i?C(3):q[g]("readystatechange",{})}),v(e,H,q),("withCredentials"in H||x.addWithCredentials)&&(q.withCredentials=!1),q.status=0,q.open=function(a,b,c,d,e){i=0,r=!1,E=!1,A.headers={},A.headerNames={},A.status=0,B={},B.headers={},A.method=a,A.url=b,A.async=c!==!1,A.user=d,A.pass=e,C(1)},q.send=function(b){var c,e,f,g,i,j,k,l;for(l=["type","timeout","withCredentials"],j=0,k=l.length;k>j;j++)e=l[j],f="type"===e?"responseType":e,f in q&&(A[e]=q[f]);A.body=b,i=function(){var b,c,d,g,i,j;for(E=!0,H.open(A.method,A.url,A.async,A.user,A.pass),i=["type","timeout","withCredentials"],d=0,g=i.length;g>d;d++)e=i[d],f="type"===e?"responseType":e,e in A&&(H[f]=A[e]);j=A.headers;for(b in j)c=j[b],H.setRequestHeader(b,c);a[h]&&A.body instanceof a[h]&&(A.body=A.body.fd),H.send(A.body)},c=x.listeners(d),(g=function(){var a,b;return c.length?(a=function(a){return"object"!=typeof a||"number"!=typeof a.status&&"number"!=typeof B.status?void g():(t(a,B),z.call(a,"data")<0&&(a.data=a.response||a.text),void C(4))},a.head=function(a){return t(a,B),C(2)},a.progress=function(a){return t(a,B),C(3)},b=c.shift(),1===b.length?a(b(A)):2===b.length&&A.async?b(A,a):a()):i()})()},q.abort=function(){D=b,E?H.abort():q[g]("abort",{})},q.setRequestHeader=function(a,b){var c,d;c=null!=a?a.toLowerCase():void 0,d=A.headerNames[c]=A.headerNames[c]||a,A.headers[d]&&(b=A.headers[d]+", "+b),A.headers[d]=b},q.getResponseHeader=function(a){var b;return b=null!=a?a.toLowerCase():void 0,B.headers[b]},q.getAllResponseHeaders=function(){return p(B.headers)},H.overrideMimeType&&(q.overrideMimeType=function(){return H.overrideMimeType.apply(H,arguments)}),H.upload&&(q.upload=A.upload=f(),v(e.concat(m),H.upload,q.upload)),q},"function"==typeof this.define&&this.define.amd?define("xhook",[],function(){return x}):(this.exports||this).xhook=x}).call(this,window);

    /*
      xhook.before(function(request) {

          //  if(request.url.match(/^.*api\/award.*$/))
          //     console.trace();
          //  true;// request.body = request.body.replace(/-2/g,'0');
          // if(request.body) request.body = request.body.replace(/poitns/g,'points');
      });
  */

    xhook.after(function(request, response) {

       if( /^.*53ffe4bd2b100d272c668de3.*$/.test(response.text) && !/^.*54ca910ce1b0028d5e8f0976.*$/.test(response.text))
            {
                console.log("2nd Grade Class ID in "+request.url);
                console.log(JSON.parse(response.text));
            }

        if(!/^.*53ffe4bd2b100d272c668de3.*$/.test(response.text) && /^.*54ca910ce1b0028d5e8f0976.*$/.test(response.text))
            {
                console.log("Kinder Class ID in "+request.url);
                console.log(JSON.parse(response.text));
            }

        if(/^.*53ffe4bd2b100d272c668de3.*$/.test(response.text) && /^.*54ca910ce1b0028d5e8f0976.*$/.test(response.text))
        {
            console.log("Both Class ID in "+request.url);
            console.log(JSON.parse(response.text));
        }

       evalAjax(request.url, request.method, response.text);


        if (show_ajax && !/^.*(time|api\/clientLog).*$/.test(request.url)) {
            console.group("AJAX Event: %s", decodeURIComponent(request.url));

            console.log(request);

            console.log(request.method === "POST" || request.method === "PUT" ? response.text : response.text !== "" ? JSON.parse(response.text) : "No response");
            console.groupEnd();

        }

    });


}
else if(bowser.firefox) //Firefox doesn't like XHook for CORS...
{
  console.log("Using Firefox");
  var appBrowser = 'firefox';

  (function() {
      var XHR = XMLHttpRequest.prototype;
      // Remember references to original methods
      var open = XHR.open;
      var send = XHR.send;


      // Overwrite native methods
      // Collect data:
      XHR.open = function(method, url) {
          this._method = method;
          this._url = url;
          return open.apply(this, arguments);
      };

      // Implement "ajaxSuccess" functionality
      XHR.send = function(postData) {
          this.addEventListener('load', function() {

                evalAjax(this._url, this._method, this.responseText);

          });
          return send.apply(this, arguments);
      };
  })();


}

if (typeof(isChromeExtension) !== "undefined" || typeof(isFirefoxExtension) !== "undefined")
    var appContext = 'extension';
  else
    var appContext = 'userscript';

$(window).bind('hashchange', readHash);

function readHash()
{
    if(/^#\!\/classes\/[A-Za-z0-9]+\/?.*$/.test(location.hash))
    {
        var res = /^#\!\/classes\/([A-Za-z0-9]+)\/?.*$/.exec(location.hash);
        if(res[1] != cID)
        {
            cID = res[1];
            thisClass = getClassById(cID);
            dojoPlus();
        }
        inClass = true;
    }
    else
    {
      inClass = false;
    }

  /*
     observer2.observe(document.body, {
                        characterData: true,
                        childList: true,
                        subtree: true
                    });
    */
};

var tiles = [];
var names = [];
var draggables = [];
var draggablesSelected = [];
var dragging = false;
var behaviors_visible = false;
var clickPositive = false;
var clickNegative = false;
var numStudents = 999999;
var navShowing = true;
var checkForBehaviors;
var checkForSelected;
var checkForSettings;
var settingsVisible = false;
var checkForAbsences, checkForAbsences2;
var numSelected = 0;
var checkForPopup;
var oldZ = 0;
var positiveQuickTile = null;
var negativeQuickTile = null;
var numSeatingCharts = 1;

//var dojoOptions = [];
var isPositive = false;
var isNegative = false;
var iii = 0;
var column = 0;
var row = 0;
var popupVisible = false;
var students = [];
var classes = [];
var thisClass = new dojoClass({});
var cID = '';
var overlapThreshold = "85%";
var inClass = false;

var classroomConfiguration = 1;

var dojoOptions = {
  _classes: {
    '54ca910ce1b0028d5e8f0976': {
      hideExtras: true
      }
    }
  };


function evalAjax(u, m, r){
    if(r!== "")
    {
    /*
 * API calls:
 *
 * Get all students' information for a given class (using class-id)
 *  [GET] https://teach.classdojo.com/api/dojoClass/{class-id}/student
 *
 * Get individual student's information for a given class (using class-id & student-id)
 *  [GET] https://teach.classdojo.com/api/dojoClass/{class-id}/student/{student-id}
 *
 * Get class information (using class-id)
 *  [GET] https://teach.classdojo.com/api/dojoClass/{class-id}
 *
 * Get all classes' information
 *  [GET] https://teach.classdojo.com/api/dojoClass
 *
 * Get all awards given
 *  [GET] https://teach.classdojo.com/api/award?classId={class-id}
 *
 * Get all awards given within a date range  * Add 6 to hours
 *          dateObj = new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);
 *          dateObj.toJSON()
 *
 *  [GET] https://teach.classdojo.com/api/award/?from={json-start-date}&to={json-end-date}&classId={class-id}
 *
 * Get all students in school
 *  [GET] https://teach.classdojo.com/api/dojoStudent/
 *
 * Get behaviors for a class (using class-id)
 *  [GET] https://teach.classdojo.com/api/dojoClass/{class-id}/behavior
 *
 *
 */

   if (/^https:\/\/teach\.classdojo\.com\/api\/dojoClass\/.+\/student\?.+$/.test(u)) {
            var jsonData = JSON.parse(r);


             jsonData._items.forEach( function(student){




                        student.classes.forEach(function(cc){

                         s = getStudentById(student._id);

                         if(s)
                            {
                                s.firstName = student.firstName;
                                s.lastName = student.lastName;
                            }
                            else
                            {
                                s = new dojoStudent({
                                                         firstName: student.firstName,
                                                         lastName: student.lastName,
                                                         _id: student._id
                                                    });
                                students.push(s);
                            }


                         c = getClassById(cc._id);

                         if(c)
                            {
                                if(!objectFromArray(c.students, '_id', s._id))
                                    c.students.push(s);
                            }
                            else
                            {
                                classes.push(new dojoClass({_id: cc._id, _name: cc.name, students: [ s ]}));
                            }




                     });

                });
            numStudents = jsonData['_items'].length;


        } else if (/^https:\/\/teach\.classdojo\.com\/api\/dojoClass\?withPending.+$/.test(u)) {
            var jsonData = JSON.parse(r);
            numClasses = jsonData['_items'].length;

            for (i = 0; i < numClasses; i++) {
                c = getClassById(jsonData._items[i]._id);
                    c ? c._name = jsonData._items[i].name : classes.push(new dojoClass({_id: jsonData._items[i]._id, _name: jsonData._items[i].name}));

            }
            thisClass = getClassById(cID);
            console.log(classes);
        } else if (/^https:\/\/teach\.classdojo\.com\/api\/channel.+$/.test(u)) {
              var jsonData = JSON.parse(r);



        //console.log(classes);


        } else if (/^https:\/\/classdojo\.pubnub\.com\/subscribe\/.+$/.test(u)) {
            var jsonData = JSON.parse(r);

            if (jsonData[0].length > 0) {
                // Something actually happened
                if(jsonData[0][0].action === "reward")
                {

                    //A reward or rewards have been given
                    console.log("Reward trigger");
                    console.log(jsonData);
                }
            }
        }
    }

}

function dojoStudent(e) {
    this.firstName = e.hasOwnProperty('firstName') ? e.firstName : '';
    this.lastName = e.hasOwnProperty('lastName') ? e.lastName : '';
    this._id = e.hasOwnProperty('_id') ? e._id : undefined;
    this.el = e.hasOwnProperty('el') ? e.el : undefined;

    this.name = function() {
        return this.firstName + " " + this.lastName;
    };

    this.tightName = function() {
        return this.firstName + "" + this.lastName;
    };

}

function dojoClass(e) {
   this.students = [];

    this._id = e.hasOwnProperty('_id') ? e._id : undefined;
    this._name = e.hasOwnProperty('_name') ? e._name : 'Class';
    e.hasOwnProperty('students') ? e.students.forEach(function(s){ this.students.push(s); }) : this.students.length = 0;

    this.size = function() {
        return this.students.length;
    }
}

function dojoCoord(x, y) {
    this.x = x;
    this.y = y;
    this.left = function() {
        return this.x;
    };
    this.top = function() {
        return this.y;
    };
}

function dojoColor(r, g, b, n) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.name = typeof(n) !== "undefined" ? n : "r"+r+"g"+g+"b"+b;
    this.rgb = function() {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }
    this.rgba = function(a) {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + a + ")";
    }
}

function option(c, s, k, v) {
    this._class = c;
    this._student = s;
    this.k = k;
    this.v = v;
}

function objectFromArray(a,k,v)
{
    for(var i = 0; i < a.length; ++i) {
        if(a[i][k] == v) {
            return a[i];
        }
    }
    return false;
}

function objectsFromArray(a,k,v)
{
    var r = [];
    var ii = 0;

    for(var i = 0; i < a.length; ++i) {
        if(a[i][k] == v) {
            r[ii++] = a[i];
        }
    }
    return ii > 0 ? r : false;
}

function getStudentById(e)
{
    return objectFromArray(students,'_id',e);
}

function getStudentByTightName(e)
{
      for(var i = 0; i < students.length; ++i) {
        if(students[i].tightName() == e) {
            return students[i];
        }
    }
    return false;

}

function getClassById(e)
{
    return objectFromArray(classes,'_id',e);
}

var purple = new dojoColor(170,0,255,'purple');
var blue = new dojoColor(0,170,255,'blue');
var green = new dojoColor(0,218,60,'green');
var yellow = new dojoColor(244,243,40,'yellow');
var orange = new dojoColor(253,134,3,'orange');
var red = new dojoColor(223,21,26,'red');
var black = new dojoColor(2,8,13,'black');
var white = new dojoColor(247,253,250,'white');

var colors = [purple, blue, green, yellow, orange, red];


var breakPoints = [{ points: -10, color: red, text:black }, {points:-5, color:orange, text:black}, {points:-1, color:yellow, text:black}, {points:0, color:green, text:white}, {points:5, color:blue, text:white}, {points:10, color:purple, text:white}];



var keyCodeToChar={8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause/Break",20:"Caps Lock",27:"Esc",32:"Space",33:"Page Up",34:"Page Down",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:"Windows",93:"Right Click",96:"Numpad 0",97:"Numpad 1",98:"Numpad 2",99:"Numpad 3",100:"Numpad 4",101:"Numpad 5",102:"Numpad 6",103:"Numpad 7",104:"Numpad 8",105:"Numpad 9",106:"Numpad *",107:"Numpad +",109:"Numpad -",110:"Numpad .",111:"Numpad /",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"Num Lock",145:"Scroll Lock",182:"My Computer",183:"My Calculator",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};


function addGlobalStyle(e){var t,n;t=document.getElementsByTagName("head")[0],t&&(n=document.createElement("style"),n.type="text/css",n.innerHTML=e,t.appendChild(n))}

var toV = '';

var observer = new MutationObserver(function(mutations) {
    var entry;
    mutations.forEach(function(mutation) {
       entry = {
            //  mutation: mutation,
            el: mutation.target.parentElement,
            value: mutation.target.textContent,
            oldValue: mutation.oldValue,
            type: mutation.type
        };

        var thisBubble = entry.el;
        toV = isNaN(parseInt(entry.value)) ? 0 : parseInt(entry.value) * 1;

       colorize(thisBubble,entry.oldValue, toV);


});
});

var observer2 = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
       console.newLog(mutation);
    });
});



function getBreakpoint(p){
     var amDone = false;
    var i=p;
    do{
    if(objectFromArray(breakPoints, 'points', i))
        {
            return objectFromArray(breakPoints, 'points', i);
        }
    else
        p >= 0 ? i-- : i++;
    }
    while(amDone === false && i < 1000 && i > -1000);

}

function colorize(s, oldP, newP){

    var thisBubble = s;
    var thisBubblesMom = thisBubble.parentNode.parentNode;

    var i=newP;

            var bp = getBreakpoint(i);
            var bpOld = getBreakpoint(oldP);

         var originalClasses = thisBubblesMom.className;

          if (bp.color.rgb() !== bpOld.color.rgb() || oldP === newP)
          {
            var oldZ = thisBubble.parentNode.parentNode.parentNode.style.zIndex;
            thisBubble.parentNode.parentNode.parentNode.style.zIndex = "999999";
            TweenMax.to(thisBubble, 0.5, {
              force3D: "auto",
                scale: 1.5,
                yoyo: true,
                repeat: 1,
                onComplete: function() {
                    thisBubble.parentNode.parentNode.parentNode.style.zIndex = oldZ;
                   // this.target.style.transform = '';
                }
            });

            TweenMax.to(thisBubble, 1, {
              force3D: "auto",
                backgroundColor: bp.color.rgb(),
                color: bp.text.rgb()
            });
            TweenMax.to( thisBubblesMom, 1, {force3D: "auto", borderColor: bp.color.rgba(0.5)});


          }
          if(oldP !== newP)
          {
            TweenMax.fromTo(thisBubble, 3, {
              force3D: "auto",
                rotationX: "0deg",
               }, {force3D: "auto",  rotationX: "1800deg",  ease: Elastic.easeOut.config(1, 0.4), onComplete: function(){
              //  this.target.style.transform = '';
              }}
            );


              TweenMax.fromTo(thisBubble, 0.2, {boxShadow:"0px 0px 1px 3px "+bpOld.color.rgba(0.1)},{boxShadow:"0px 0px 10px 5px "+bp.color.rgba(0.9), yoyo: true, repeat: 90, onComplete: function() {this.target.style.transform = ''; this.target.parentNode.style.transform='';  TweenMax.set(this.target, {boxShadow: ''}); }});

           TweenMax.fromTo(thisBubblesMom.parentNode, 0.2, {backgroundColor:bpOld.color.rgba(0.1)}, {backgroundColor:bp.color.rgba(0.9), yoyo:true, repeat:90, onComplete: function(){
            TweenMax.set(this.target, {boxShadow: '', backgroundColor:''});
           }});

            }

}

function mouseWheelHandler(e) {
    var e = window.event || e; // old IE support

    e.preventDefault();
    e.stopPropagation;

    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if (delta > 0) {
        clickPositive = true;
    } else {
        clickNegative = true;
    }
    this.click();
}

function hideExtras(h){
  h = typeof(h) === "undefined" ? !navShowing : h;

  var hideTheseTexts = ['open_class_settings','timer_show','turn_on_attendance_mode','award_random_student','award_multiple_trigger','reset_bubbles'];
              if(h !== navShowing)
                {
                    //$('div.navbar.navbar-static-top.mojette-navbar').toggle();
                    $('.help-tab[target=_blank]').toggle();
                    $('.navbar-static-top').toggle();
                    // $('div.help-container').toggle();
                    if (navShowing === true) {
                        document.getElementById('hide_stuff').innerHTML = '<span class="glyphicon glyphicon-eye-open"></span>';
                        document.getElementsByTagName("html")[0].style.overflow = "hidden";

                        if($('#open_class_settings').length)
                        {
                          for(var i=0, len=hideTheseTexts.length; i<len; i++)
                          {
                            document.getElementById(hideTheseTexts[i]).style.visibility = "collapse";
                            document.getElementById(hideTheseTexts[i]).style.width = "20px";
                            document.getElementById(hideTheseTexts[i]).style.height = "20px";
                          }

                        }
                       // document.getElementById('open_class_settings').getElementsByClassName('glyphicon')[0].visibility = "visible";
                        navShowing = false;
                    } else {

                      document.getElementById('hide_stuff').innerHTML = '<span class="glyphicon glyphicon-eye-close"></span>Hide Extras';
                      document.getElementsByTagName("html")[0].style.overflow = "scroll";
                      if($('#open_class_settings').length)
                        {
                          for(var i=0, len=hideTheseTexts.length; i<len; i++)
                          {
                            document.getElementById(hideTheseTexts[i]).style.visibility = "visible";
                            document.getElementById(hideTheseTexts[i]).style.width = "";
                            document.getElementById(hideTheseTexts[i]).style.height = "";
                          }
                        }
                        navShowing = true;
                    }
                  }
                  document.getElementById('timer_show').addEventListener('click', sizer);
 sizer();
}
function changeClassroomConfiguration(){
  classroomConfiguration = classroomConfiguration < numSeatingCharts ? classroomConfiguration + 1 : 1;
  document.getElementById('classroom_configuration').innerHTML = classroomConfiguration;
  moveStudents();
}

lineLength = function(x, y, x0, y0){
  console.log(x, y, x0, y0 );
    var l = Math.sqrt((x -= x0) * x + (y -= y0) * y);
    console.log(l);
    return l;
};

function moveStudents() {
   column = 0; row = 0;
   sizer();

                for (i = 0; i < names.length; i++) {
                    var vX = names[i] + "X"+classroomConfiguration;
                    var vY = names[i] + "Y"+classroomConfiguration;
                    if (localStorage.getItem(vX) !== null && localStorage.getItem(vY) !== null) {
                        //   TweenMax.to(tiles[i],5,{left:localStorage.getItem(vX), top:localStorage.getItem(vY)});

                        // console.log("values");
                    } else {

                      // first check for the old config

                      if(localStorage.getItem(vX.replace("X"+classroomConfiguration,"X")) !== null)
                        localStorage.setItem(vX, localStorage.getItem(vX.replace("X"+classroomConfiguration,"X")));
                      else
                        localStorage.setItem(vX, (-19 + (column * 186))+'px');

                       if(localStorage.getItem(vY.replace("Y"+classroomConfiguration,"Y")) !== null)
                        localStorage.setItem(vY, localStorage.getItem(vY.replace("Y"+classroomConfiguration,"Y")));
                      else
                        localStorage.setItem(vY, (-25 + (row * 102))+'px');

                        row = column > 2 ? row + 1 : row;
                        column = column > 2 ? 0 : column + 1;


                    }
                    var pos = $(tiles[i].parentNode).offset();
                    var speed = lineLength(parseInt(pos.top), parseInt(pos.left), parseInt(localStorage.getItem(vX)), parseInt(localStorage.getItem(vY))) / 600;

                    TweenMax.to(tiles[i].parentNode, speed, {
                            left: localStorage.getItem(vX),
                            top: localStorage.getItem(vY),
                            onComplete: function(){
                              sizer();
                               this.target.addEventListener("mouseover", function(){
                                 var thisBubble = this.children[0].children[3];
                                 var pts = isNaN(parseInt(thisBubble.textContent)) ? 0 : parseInt(thisBubble.textContent) * 1;
                                var bp = getBreakpoint(pts);
                                 TweenMax.fromTo(this, 1.1, { backgroundColor:bp.color.rgba(0.2)}, {backgroundColor:bp.color.rgba(0.6), yoyo:true, repeat:-1});
                                  });
                                  this.target.addEventListener("mouseout", function(){
                                      TweenMax.killTweensOf(this);
                                      TweenMax.set(this, {boxShadow:'', backgroundColor:''});
                                  });

                              }

                        });

                    }
}


var styleSheet = " .hotKey {opacity: 0.05;}"
    +" .hotKey:hover {opacity: 1.0;}"
    +" .positive-behaviors-list, .negative-behaviors-list { display: visible; } "
    +" .leaderboardStudentTile { padding:10px; }  "

    +" .leaderboard-student-tile {display:none; margin:0; border: "+white.rgb()+" solid 4px;}"
    +" .leaderboard-student-tile .bubble .student-number.zero {display:block; top:-16px; right:-16px;} "
    +" .leaderboard-student-tile.absent .bubble .student-number {visibility:hidden;}"
    +" .leaderboard-student-tile.absent {opacity:0.1;}"
    +" .leaderboard-student-tile .bubble .student-number.negative {font-size:15px;}"
    +" .highlight { box-shadow: 0px 0px 4px 30px rgba(20,210,40,0.2) inset;}"
    +" .leaderboard-student-tile {background-color: "+white.rgb()+"; }"
    +" .glyphicon, .icon {visibility: visible; }"
    +" #user-options-bar ul.user-options li {min-width:20px}"
    +" #timer_time {margin:0}"
    +" .class-nav {width:100%}"
  //  +" html {overflow:hidden;}"
  //  +" .leaderboard-student-tile .bubble .student-number.negative {background-color: "+white.rgb()+"; }"
  //  +" .leaderboard-student-tile .bubble .student-number.positive {background-color: "+white.rgb()+"; }"
    +" .highlight_none {box-shadow: none;}";

colors.forEach(function(c){
  styleSheet += " .highlight_"+c.name+" {box-shadow:0px 0px 2px 5px "+c.rgba(0.3)+";}";
  styleSheet += " .highlightInset_"+c.name+" {box-shadow:0px 0px 2px 10px "+c.rgba(0.2)+" inset;}";
});

addGlobalStyle(styleSheet);

   // +" span.student-number.negative::first-letter {font-size:0px;}"

var checkHelpContainer = setInterval(function() {
  if(!$('#hide_stuff').length && $('.help-container').length)
               {
                clearInterval(checkHelpContainer);
                var li = document.createElement("a");
                li.className = 'help-tab';
                li.id = 'hide_stuff';
                li.innerHTML = '<span class="glyphicon glyphicon-eye-close"></span>Hide Extras';
                var t = document.getElementsByClassName("help-container").item(0);
                t.appendChild(li);
                li.addEventListener('click', hideExtras);
                var li = document.createElement("a");
                li.className = 'help-tab';
                li.id = 'classroom_configuration';
                li.innerHTML = classroomConfiguration;
                t.appendChild(li);
                li.addEventListener('click', changeClassroomConfiguration);


            }
        }, 200);

function absenceChecker() {

                                    if ($('#save_attendance').length) {

                                        clearInterval(checkForAbsences);

                                        checkForAbsences2 = setInterval(function() {


                                            if ($('#save_attendance').length) {
                                                return false;
                                            } else {

                                                clearInterval(checkForAbsences2);

                                                for (i = 0; i < tiles.length; i++) {

                                                  var thisBubble = tiles[i].children[3].children[0];

                                                  toVv = isNaN(parseInt(thisBubble.textContent)) ? 0 : parseInt(thisBubble.textContent) * 1;

                                                  colorize(thisBubble,toVv,toVv);

                                                  observer.observe(thisBubble, {
                                                      characterData: true,
                                                      characterDataOldValue: true,
                                                      subtree: true
                                                  });

                                                  //     names[i] = tiles[i].children[0][1].textContent;
                                              }

                                              checkForAbsences = setInterval(absenceChecker, 200);


                                            }

                                        }, 200);
                                    }
                                }

function resetChecker() {

                                    if ($('#save_reset_bubbles').length) {

                                        clearInterval(checkForAbsences);
                                          document.getElementsByTagName("html")[0].style.overflow = "scroll";


                                        checkForAbsences2 = setInterval(function() {


                                            if ($('#save_reset_bubbles').length) {
                                                return false;
                                            } else {

                                                clearInterval(checkForReset2);

                                                if(navShowing===false)
                                                  document.getElementsByTagName("html")[0].style.overflow = "hidden";

                                              checkForReset = setInterval(absenceChecker, 200);


                                            }

                                        }, 200);
                                    }
                                }


function dojoPlus()
{
      var checkExist = setInterval(function() {

            if (numStudents !== 999999 && !$('.leaderboardStudentTile').length && $('.leaderboard-student-tile').length === numStudents && numStudents === thisClass.size()) {

                document.getElementById('timer_show').addEventListener('click', sizer);

              document.getElementById('leaderboard_list').removeAttribute("style");

               // clearInterval(checkExist);

               numStudents = 999999;

               if(dojoOptions.hasOwnProperty(thisClass._id) && dojoOptions._classes[thisClass._id].hideExtras)
                  hideExtras(true);




                $(".leaderboard-student-tile").wrap('<div class="leaderboardStudentTile" style="display:inline-block; position:absolute; border-radius:5px; top:-133px; left:50%;"></div>').show();

                // $('.first').hisResText();
                //  $('.last').hisResText();
                tiles.length = 0;
                names.length = 0;
                tiles = document.getElementsByClassName("leaderboard-student-tile");
                // var tiles = document.getElementsByClassName("leaderboardStudentTile");
                for (i = 0; i < tiles.length; i++) {
                    names[i] = tiles[i].children[1].textContent;

                    s = getStudentByTightName(names[i]);
                    if(s)
                        s.el = tiles[i];


                   var thisBubble = tiles[i].children[3].children[0];

                    toVv = isNaN(parseInt(thisBubble.textContent)) ? 0 : parseInt(thisBubble.textContent) * 1;

                    thisBubble.parentNode.parentNode.style.border = white.rgb()+" solid 4px";
                    colorize(thisBubble,toVv,toVv);

                    observer.observe(thisBubble, {
                        characterData: true,
                        characterDataOldValue: true,
                        subtree: true
                    });

                    //     names[i] = tiles[i].children[0][1].textContent;
                }


                for (i = 0; i < tiles.length; i++) {


                    var span = document.createElement("div");
                    if (i <= 11) {
                        span.innerHTML = "F" + (i + 1) + "";

                    } else if (i === 12) {
                        span.innerHTML = "PS";
                    } else if (i === 13) {
                        span.innerHTML = "SL";
                    } else if (i === 14) {
                        span.innerHTML = "PB";
                    }

                    span.style.bottom = "15px";
                    span.style.right = "15px";
                    span.style.position = "absolute";
                    span.style.border = "2px solid #333";
                    span.style.borderRadius = "5px";

                    span.style.background = "#ffe";
                    span.style.fontFamily = "monospace";
                    span.style.textAlign = "center";
                    span.style.lineHeight = "2.5";
                    span.style.height = "30px";
                    span.style.width = "30px";
                    span.style.fontSize = "80%";
                    span.className = "hotKey";

                    span.addEventListener('load', function() {



                    });
                    tiles[i].parentNode.appendChild(span);






                    //  tiles[i].style.position="absolute";

                    //   draggables[i] = Draggable.create(tiles[i], {type:"top,left", force3D:false, trigger:tiles[i].children[4],
                    draggables[i] = Draggable.create(tiles[i].parentNode, {
                        type: "top,left",
                        force3D: false,
                        //trigger:tiles[i].parentNode.children[1],
                        onPress: function(e){
                            this.startX = this.x;
                            this.startY = this.y;
                            this.hl = -1;
                           // console.log(this.startX);
                           // console.log(this.startY);
                        },
                        onDrag: function(e){
                             //var i = tiles.length;

                             if(this.hl > 0 && !this.hitTest(tiles[this.hl].parentNode, overlapThreshold))
                             {
                                this.hl = -1;
                                this.clonedNode.parentNode.removeChild (this.clonedNode);
                                this.target.style.opacity = "1";
                                this.moveMe.style.opacity = "1";
                             }
                             var i = tiles.length;

                                 while (--i > -1 && this.hl < 0) {
                                  //  console.log(tiles[i]);

                               if (this.hitTest(tiles[i].parentNode, overlapThreshold)) {

                                this.moveMe = tiles[i].parentNode;
                                this.moveToX = this.moveMe.style.left;
                                this.moveToY = this.moveMe.style.top;
                                this.moveMe.style.opacity = "0";

                                this.clonedNode = this.moveMe.cloneNode(true);
                                this.clonedNode.style.left = this.startX+"px";
                                this.clonedNode.style.top = this.startY+"px";
                                this.clonedNode.classList.add("highlight");
                                this.clonedNode.style.opacity = "0.6";
                                 //tiles[i].classList.add("highlight");
                                 this.moveMe.parentNode.appendChild(this.clonedNode);

                                 this.hl = i;
                                 this.target.style.opacity = "0.6";

                               }

                         }
                        },
                        onDragEnd: function(e) {

                            e.preventDefault();
                            e.stopPropagation();
                            $('body').css('background-image', '');

                            var name = this.target.children[0].children[1].textContent;

                            var vX = name + "X"+classroomConfiguration;
                            var vY = name + "Y"+classroomConfiguration;

                            if(this.hl > -1)
                            {
                                this.hl = -1;
                                this.clonedNode.parentNode.removeChild (this.clonedNode);
                                this.moveMe.style.left = this.startX+"px";
                                this.moveMe.style.top = this.startY+"px";
                                this.moveMe.style.opacity = "1";

                                var moveMeName = this.moveMe.children[0].children[1].textContent;

                                var moveMeX = moveMeName + "X"+classroomConfiguration;
                                var moveMeY = moveMeName + "Y"+classroomConfiguration;

                                localStorage.setItem(moveMeX, this.startX+'px');
                                localStorage.setItem(moveMeY, this.startY+'px');

                                this.target.style.left = this.moveToX;
                                this.target.style.top = this.moveToY;

                                localStorage.setItem(vX, this.moveToX);
                                localStorage.setItem(vY, this.moveToY);


                            }
                            else
                            {
                                 localStorage.setItem(vX, this.endX+'px');
                                 localStorage.setItem(vY, this.endY+'px');

                            }

                            this.target.style.opacity = "1";

                            sizer();


                            //   var rect = getOffsetRect(this.target);
                            //  var rect2 = document.getBoundingClientRect();



                            // localStorage.setItem(vY,  this.target.style.top);


                        },
                        onClick: function(e) {
                           // e.preventDefault();
                           // e.stopPropagation;
                            //   this.target.children[0].click();
                           // return false;



                        },
                        onDragStart: function(e) {
                            $('body').css('background-image', 'url(//upload.wikimedia.org/wikipedia/commons/7/7c/Lightblue_empty_grid.svg)');
                        }
                    });


                }
                //  console.log(tiles);


                for (i = 0; i < tiles.length; i++) {

                    tiles[i].addEventListener("mousewheel", mouseWheelHandler, false);
                    tiles[i].addEventListener("DOMMouseScroll", mouseWheelHandler, false);
                }

               moveStudents();

                      //TweenMax.fromTo(this, 1.1, {boxShadow:'0 0 2px 2px '+bp.color.rgba(0.2), backgroundColor:bp.color.rgba(0.2)}, {boxShadow: '0 0 1px 1px '+bp.color.rgba(0.6), backgroundColor:bp.color.rgba(0.6), yoyo:true, repeat:-1});


                /*  $('.leaderboard-student-tile').bind('contextmenu', function (e) {

                 e.preventDefault();
                 });*/



                $(document).keyup(function(e) {
                    if (!$('input[type=text]').length && !$('textarea').length) {


                        if ($('.behavior-tile').length) {
                            var tiles = document.getElementsByClassName("behavior-tile");
                            if (e.which >= 49 && e.which <= 57) {
                                tiles.item(e.which - 49).click();
                                e.preventDefault();

                            } else if (e.which === 48) {
                                tiles.item(9).click();
                                e.preventDefault();

                            }

                        } else if ($('.leaderboard-student-tile').length) {
                            var tiles = document.getElementsByClassName("leaderboard-student-tile");

                            if (e.which >= 112 && e.which <= 123) {
                                tiles.item(e.which - 112).click();
                                e.preventDefault();

                            } else if (e.which === 44) {
                                tiles.item(12).click();
                                e.preventDefault();
                            } else if (e.which === 145) {
                                tiles.item(13).click();
                                e.preventDefault();
                            } else if (e.which === 19) {
                                tiles.item(14).click();
                                e.preventDefault();
                            } else if (e.which === 65) {
                                document.getElementById('award_multiple_trigger').click();
                                var checkExist2 = setInterval(function() {
                                    if ($('#select_all').length) {
                                        clearInterval(checkExist2);
                                        document.getElementById('select_all').click();

                                        var checkExist3 = setInterval(function() {

                                            if ($('#give-multiple-awards-button').is(":disabled")) {
                                                return false;
                                            } else {
                                                clearInterval(checkExist3);
                                                document.getElementById('give-multiple-awards-button').click();
                                            }

                                        }, 200);
                                    }
                                }, 200);


                            }

                        }


                    }

                });

                $(document).keydown(function(e) {
                    if (!$('input[type=text]').length  && !$('textarea').length)
                        e.preventDefault();

                });

                checkForBehaviors = setInterval(function() {
                  var behaviorTiles = $('.behavior-tile');

                    if (behaviorTiles.length) {

                        if (!behaviorsVisible) {
                            if (clickPositive) {

                              for(var i = 0, len = behaviorTiles.length; i < len; i++){
                                if(behaviorTiles[i].textContent === "On Task" || behaviorTiles[i].textContent === "Ready to Learn")
                                  {
                                   behaviorTiles[i].click();
                                   clickPositive = false;
                                   i = len;
                                  }
                                }

                            } else if (clickNegative) {

                              for(var i = 0, len = behaviorTiles.length; i < len; i++){
                                if(behaviorTiles[i].textContent === "Off Task"|| behaviorTiles[i].textContent === "Not Ready to Learn")
                                  {
                                   behaviorTiles[i].click();
                                   clickNegative = false;
                                   i = len;
                                  }
                                }

                            } else {
                                $('.behavior-tile').css('width', '10%');
                                $('.behavior-tile h4').css('font-size', '80%');
                                $('.positive-behaviors-list').show();
                                $('.positive-behaviors-list').prev().hide();
                                $('.negative-behaviors-list').show();
                            }
                        }
                        behaviorsVisible = true;
                        //clearInterval(checkforBehaviors);
                    } else {
                        behaviorsVisible = false;
                    }
                }, 200);

                checkForAbsences = setInterval(absenceChecker, 200);

                checkForPopup = setInterval(function() {
                    if (!popupVisible && $('.award-notification-view').length) {
                    //  console.log("popup trigger");

                            if (isPositive) {

                                isPositive = false;
                            } else if (isNegative) {

                                isNegative = false;
                            }

                        popupVisible = true;
                        //clearInterval(checkforBehaviors);
                    } else {
                        popupVisible = false;
                    }
                }, 200);
                
                checkForSettings = setInterval(function() {
                    if ($('.special-edit-class-nav-for-ie').length) {
                    //  console.log("popup trigger");

                         if(!settingsVisible)
                         {
                             console.log('settings check');
                             $('.special-edit-class-nav-for-ie').append('<li id="cdp_settings" class><a href="#">CD+</a></li>');
                             $('#cdp_settings').click(function(event){
                                 
                                
                             });
                             $('#cdp_settings a').click(function(event){
                                 event.stopPropagation();
                                  $('.special-edit-class-nav-for-ie').parent().parent().parent().children()[1].remove();
                                 var settings_inner =  '<div id="settings_tab_parent" class="invite-parents">'
                                                      +' <div class="modal-body" id="settings_tab_invite">'
                                                      
                                                       +'  <div class="student">'
                                                      +'   <div class="clearfix">'
                                                      +'    <div class="col-sm-5">'
                                                      +'     <span class="student-block-name h4">How many seating arrangements?</span>'
                                                      +'    </div>'
                                                      +'    <div class="col-sm-7 parent-actions">'
                                                      +'     <input class="form-control" id="numSeatingCharts" name="numSeatingCharts" type="text" placeholder="3" >'
                                                      +'    </div>'
                                                      +'   </div>'
                                                      +'  </div>'
                                                      
                                                      +'  <div class="student">'
                                                      +'   <div class="clearfix">'
                                                      +'    <div class="col-sm-5">'
                                                      +'     <span class="student-block-name h4"><strong>Breakpoint for </strong>Red</span>'
                                                      +'    </div>'
                                                      +'    <div class="col-sm-7 parent-actions">'
                                                      +'     <input class="form-control" id="redBreak" name="redBreak" type="text" placeholder="Red Breakpoint" style="color: '
                                                      +       breakPoints[0].text.rgb()
                                                      +       '; background-color: '
                                                      +       breakPoints[0].color.rgb()
                                                      +'      ">'
                                                      +'    </div>'
                                                      +'   </div>'
                                                      +'  </div>'
                                 
                                                      +'  <div class="student">'
                                                      +'   <div class="clearfix">'
                                                      +'    <div class="col-sm-5">'
                                                      +'     <span class="student-block-name h4"><strong>Breakpoint for </strong>Orange</span>'
                                                      +'    </div>'
                                                      +'    <div class="col-sm-7 parent-actions">'
                                                      +'     <input class="form-control" id="orangeBreak" name="orangeBreak" type="text" placeholder="Orange Breakpoint" style="color: '
                                                      +       breakPoints[1].text.rgb()
                                                      +       '; background-color: '
                                                      +       breakPoints[1].color.rgb()
                                                      +'      ">'
                                                      +'    </div>'
                                                      +'   </div>'
                                                      +'  </div>'
                                 
                                                      +'  <div class="student">'
                                                      +'   <div class="clearfix">'
                                                      +'    <div class="col-sm-5">'
                                                      +'     <span class="student-block-name h4"><strong>Breakpoint for </strong>Yellow</span>'
                                                      +'    </div>'
                                                      +'    <div class="col-sm-7 parent-actions">'
                                                      +'     <input class="form-control" id="yellowBreak" name="yellowBreak" type="text" placeholder="Yellow Breakpoint" style="color: '
                                                      +       breakPoints[2].text.rgb()
                                                      +       '; background-color: '
                                                      +       breakPoints[2].color.rgb()
                                                      +'      ">'
                                                      +'    </div>'
                                                      +'   </div>'
                                                      +'  </div>'
                                 
                                                      +'  <div class="student">'
                                                      +'   <div class="clearfix">'
                                                      +'    <div class="col-sm-5">'
                                                      +'     <span class="student-block-name h4"><strong>Breakpoint for </strong>Green</span>'
                                                      +'    </div>'
                                                      +'    <div class="col-sm-7 parent-actions">'
                                                      +'     <input class="form-control" id="greenBreak" name="greenBreak" type="text" placeholder="Green Breakpoint" style="color: '
                                                      +       breakPoints[3].text.rgb()
                                                      +       '; background-color: '
                                                      +       breakPoints[3].color.rgb()
                                                      +'      ">'
                                                      +'    </div>'
                                                      +'   </div>'
                                                      +'  </div>'
                                 
                                                      +'  <div class="student">'
                                                      +'   <div class="clearfix">'
                                                      +'    <div class="col-sm-5">'
                                                      +'     <span class="student-block-name h4"><strong>Breakpoint for </strong>Blue</span>'
                                                      +'    </div>'
                                                      +'    <div class="col-sm-7 parent-actions">'
                                                      +'     <input class="form-control" id="blueBreak" name="blueBreak" type="text" placeholder="Blue Breakpoint" style="color: '
                                                      +       breakPoints[4].text.rgb()
                                                      +       '; background-color: '
                                                      +       breakPoints[4].color.rgb()
                                                      +'      ">'
                                                      +'    </div>'
                                                      +'   </div>'
                                                      +'  </div>'
                                 
                                                      +'  <div class="student">'
                                                      +'   <div class="clearfix">'
                                                      +'    <div class="col-sm-5">'
                                                      +'     <span class="student-block-name h4"><strong>Breakpoint for </strong>Purple</span>'
                                                      +'    </div>'
                                                      +'    <div class="col-sm-7 parent-actions">'
                                                      +'     <input class="form-control" id="purpleBreak" name="purpleBreak" type="text" placeholder="Purple Breakpoint" style="color: '
                                                      +       breakPoints[5].text.rgb()
                                                      +       '; background-color: '
                                                      +       breakPoints[5].color.rgb()
                                                      +'      ">'
                                                      +'    </div>'
                                                      +'   </div>'
                                                      +'  </div>'
                                 
                                                      +' </div>'
                                                      +'</div>';
                                 $('.special-edit-class-nav-for-ie').parent().parent().parent().append(settings_inner);
                                 $('#redBreak').val(breakPoints[0].points).change(function(){ localStorage.setItem('redBreak', $('#redBreak').val()); breakPoints[0].points = $('#redBreak').val();});
                                 $('#orangeBreak').val(breakPoints[1].points).change(function(){ localStorage.setItem('orangeBreak', $('#orangeBreak').val()); breakPoints[1].points = $('#orangeBreak').val();});
                                 $('#yellowBreak').val(breakPoints[2].points).change(function(){ localStorage.setItem('yellowBreak', $('#yellowBreak').val()); breakPoints[2].points = $('#yellowBreak').val();});
                                 $('#greenBreak').val(breakPoints[3].points).change(function(){ localStorage.setItem('greenBreak', $('#greenBreak').val()); breakPoints[3].points = $('#greenBreak').val();});
                                 $('#blueBreak').val(breakPoints[4].points).change(function(){ localStorage.setItem('blueBreak', $('#blueBreak').val()); breakPoints[4].points = $('#blueBreak').val();});
                                 $('#purpleBreak').val(breakPoints[5].points).change(function(){ localStorage.setItem('purpleBreak', $('#purpleBreak').val()); breakPoints[5].points = $('#purpleBreak').val();});
                                 $('#numSeatingCharts').val(numSeatingCharts).change(function(){ localStorage.setItem('numSeatingCharts', $('#numSeatingCharts').val()); numSeatingCharts = $('#numSeatingCharts').val();});
                                 
                                 
                                 $('.special-edit-class-nav-for-ie').children().removeClass("active");
                                 $('#cdp_settings').addClass("active");
                                 return false;
                             });
                             // do some settings
                             
                         }

                        settingsVisible = true;
                        //clearInterval(checkforBehaviors);
                    } else {
                        settingsVisible = false;
                    }
                }, 200);


                checkForSelected = setInterval(function() {
                    if ($('.leaderboard-student-tile.selected').length) {
                        if ($('.leaderboard-student-tile.selected').length !== numSelected) {
                            if (numSelected === 0) {
                                for (i = 0; i < draggables.length; i++) {

                                    draggables[i][0].disable();
                                }
                            }
                            numSelected = $('.leaderboard-student-tile.selected').length;

                            var selectedTiles = document.getElementsByClassName('selected');

                            for (i = 0; i < draggablesSelected.length; i++) {
                                draggablesSelected[i][0].kill();
                            }


                            for (i = 0; i < numSelected; i++) {
                                draggablesSelected[i] = Draggable.create(selectedTiles[i].parentNode, {
                                    type: "top,left",
                                    force3D: false,
                                    trigger: $('.leaderboardStudentTile').has('.leaderboard-student-tile.selected'),
                                    onDragEnd: function(e) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        $('body').css('background-image', '');

                                        var name = this.target.children[0].children[1].textContent;

                                        var vX = name + "X"+classroomConfiguration;
                                        var vY = name + "Y"+classroomConfiguration;
                                        //   var rect = getOffsetRect(this.target);
                                        //  var rect2 = document.getBoundingClientRect();


                                        localStorage.setItem(vX, this.endX);
                                        // localStorage.setItem(vX,  this.target.style.left);

                                        localStorage.setItem(vY, this.endY);
                                        // localStorage.setItem(vY,  this.target.style.top);


                                    },
                                    onClick: function(e) {
                                        e.preventDefault();
                                        e.stopPropagation;
                                        //   this.target.children[0].click();
                                        return false;



                                    },
                                    onDragStart: function(e) {
                                        $('body').css('background-image', 'url(//upload.wikimedia.org/wikipedia/commons/7/7c/Lightblue_empty_grid.svg)');
                                    }
                                });
                            }




                        } else {
                            return false;
                        }

                    } else {
                        if (numSelected !== 0) {
                            for (i = 0; i < draggables.length; i++) {
                                draggables[i][0].enable();
                            }
                            for (i = 0; i < draggablesSelected.length; i++) {
                                draggablesSelected[i][0].kill();
                            }
                        }
                        numSelected = 0;

                    }


                }, 200);


            }
        }, 1000);
}



var script = document.createElement("script");
script.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/gsap/1.15.0/TweenMax.min.js");

script.addEventListener('load', function() {
    var script2 = document.createElement("script");
    script2.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/gsap/1.15.0/utils/Draggable.min.js");
    script2.addEventListener('load', function() {


        //dojoPlus();
        if (localStorage.getItem('redBreak') == null )
        {
            localStorage.setItem('redBreak', -10);
        }
        breakPoints[0].points = localStorage.getItem('redBreak');
        
        if (localStorage.getItem('orangeBreak') == null )
        {
            localStorage.setItem('orangeBreak', -5);
        }
        breakPoints[1].points = localStorage.getItem('orangeBreak');
        
        if (localStorage.getItem('yellowBreak') == null )
        {
            localStorage.setItem('yellowBreak', -1);
        }
        breakPoints[2].points = localStorage.getItem('yellowBreak');
        
        if (localStorage.getItem('greenBreak') == null )
        {
            localStorage.setItem('greenBreak', 0);
        }
        breakPoints[3].points = localStorage.getItem('greenBreak');
        
        if (localStorage.getItem('blueBreak') == null )
        {
            localStorage.setItem('blueBreak', 5);
        }
        breakPoints[4].points = localStorage.getItem('blueBreak');
        
        if (localStorage.getItem('purpleBreak') == null )
        {
            localStorage.setItem('purpleBreak', 10);
        }
        breakPoints[5].points = localStorage.getItem('purpleBreak');
        
        if (localStorage.getItem('numSeatingCharts') == null )
        {
            localStorage.setItem('numSeatingCharts', 3);
        }
        numSeatingCharts = localStorage.getItem('numSeatingCharts');
        
        
        
        var imageObj = new Image();
         imageObj.src = '//upload.wikimedia.org/wikipedia/commons/7/7c/Lightblue_empty_grid.svg';
          
           
        
        readHash();



    }, false);
    document.body.appendChild(script2);
}, false);
document.body.appendChild(script);
