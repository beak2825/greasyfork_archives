// ==UserScript==
// @name        Wadsworth Constant
// @description     Script adds a posibility to apply Wadsworth Constant to YouTube videos. Two buttons are added, one to apply and to auto-switch.
// @namespace   Wadsworth Constant
// @include http*://*.youtube.com/*
// @include http*://www.youtube.com/*
// @include http*://youtube.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @noframes
// @run-at document-end
// @author      Dexmaster
// @icon        http://i1.kym-cdn.com/photos/images/masonry/000/257/513/662.jpg
// @co-author   Jake Lauer
// @version     1.2.1
// @downloadURL https://update.greasyfork.org/scripts/8739/Wadsworth%20Constant.user.js
// @updateURL https://update.greasyfork.org/scripts/8739/Wadsworth%20Constant.meta.js
// ==/UserScript==
(function () {
  'use strict';
  var c_loc = window.location.search,
  loaded = false;
  function hms_to_s(hms) {
    var arr = hms.split(':'),
        sec = 0, mult = 1;
    while (arr.length > 0) {
        sec = sec + mult * parseInt(arr.pop(), 10);
        mult = mult * 60;
    }
    return parseInt(sec);
  }
  function ww_apply(apply) {
    var url; //,saveURL
    if (!!apply) {
      url = window.location.href;
      if (url.match('#') || url.match('&t')) {
        url = url.split('#') [0].split('&t') [0];
      }
      url = url.split('?') [1].split('&') [0].split('=') [1];
      url = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id='+url+'&key=AIzaSyDrsu_ibWlFRzBPAA2tAqaJcK2gqLhmIQI';
      //console.log(url);
      if (url === 'https://gdata.youtube.com/feeds/api/videos/') {
        //console.log('Something went wrong... dunno what it was. Sorry!');
      }
      window.location.hash = '#';
      //console.log(saveURL);
      GM_xmlhttpRequest({
        method: 'GET',
        // ignoreCache: true,
        redirectionLimit: 0,
        url: url,
        onerror: function (res) {
          var msg = 'An error occurred.' + '\nresponseText: ' + res.responseText + '\nreadyState: ' + res.readyState + '\nresponseHeaders: ' + res.responseHeaders + '\nstatus: ' + res.status + '\nstatusText: ' + res.statusText + '\nfinalUrl: ' + res.finalUrl;
          console.log(msg);
        },
        onload: function (xhr) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200 && xhr.responseText && xhr.responseText.length > 20) {
              var results = JSON.parse(xhr.responseText),
              duration = hms_to_s(results.items[0].contentDetails.duration.replace("PT","").replace("H",":").replace("M",":").replace("S","")),
              newTime = Math.ceil(duration * 0.3),
              hrr = window.location.href,
              mrr = '';
              //console.log(xhr);
              if (hrr.match('&t=')) {
                hrr = hrr.split('&t=') [0];
                if (hrr.split('&t=').length > 1) {
                  mrr = hrr.split('&t=') [1];
                  hrr += (mrr.match('&')) ? '&' + mrr.split('&') [1] : '';
                }
              }
              if (hrr.match('#')) {
                window.location = (hrr.split('#') [0] + '#t=' + newTime + 's');
              } else {
                window.location = (hrr + '#t=' + newTime + 's');
              }
            }
          }
        }
      });
    }
  }
  
  function toggle_cl(element, toggleClass, state){
    if(state || (!element.classList.contains(toggleClass) && (state === undefined))){
      element.classList.add(toggleClass);
    }else{
      element.classList.remove(toggleClass);
    }
  }
  
  function pp_state(event) {
    var t_loc = window.location,
    yt_wadsworth = GM_getValue('yt_wadsworth', false);
    if (c_loc !== t_loc.search || !loaded) {
      if (!loaded) loaded = true;
      if (yt_wadsworth) {
        ww_apply(true);
        // history changed because of pushState/replaceState
      }
    }
  }
  
  function ww_switch() {
    var yt_wadsworth = GM_getValue('yt_wadsworth', false);
    GM_setValue('yt_wadsworth', !yt_wadsworth);
   document.querySelector('#switch_wadsworth').textContent = 'Switch is ' + (!yt_wadsworth ? 'On' : 'Off');
    ww_apply(!yt_wadsworth);
  }
  
  function hide_ww(initial) {
    var yt_wadsworth_h = GM_getValue('yt_wadsworth_h', false);
    GM_setValue('yt_wadsworth_h', !yt_wadsworth_h);
    yt_wadsworth_h = GM_getValue('yt_wadsworth_h', false);
    toggle_cl(document.querySelector('#block_wadsworth'),'show', yt_wadsworth_h);
    toggle_cl(document.querySelector('#block_wadsworth'),'hide', !yt_wadsworth_h);
    document.querySelector('#hide_wadsworth').textContent = '' + (!yt_wadsworth_h ? 'Show' : 'Hide');
  }
  
  function load_once() {
    if (loaded) return;
    
    var yt_wadsworth = GM_getValue('yt_wadsworth', false), bl_ww, sw_ww, hd_ww, ap_ww, cont_yt = document.querySelector('#content');
    var yt_wadsworth_h = GM_getValue('yt_wadsworth_h', false);
    
    cont_yt.insertAdjacentHTML('beforebegin','<style type="text/css">.hide > div,.hide > div.text{display: none;}.show > div,.hide > #hide_wadsworth{display: inline-block;}.show > div.text {display: block;}#block_wadsworth{background-color: rgb(255, 255, 255); display: block; padding: 4px; position: fixed; z-index: 99; margin: 0;}.button_ww{display: inline-block; border: 1px solid red; cursor: pointer; background: none repeat scroll 0% 0% rgb(204, 204, 204); color: black; z-index: 12; padding: 4px 6px; position: relative; margin-top: 3px;margin-right: 3px;}</style><div id="block_wadsworth" class="' + (yt_wadsworth_h ? 'show' : 'hide') + '"><div class="text">Wadsworth Constant: </div><div id="apply_wadsworth" class="button_ww">Apply</div><div id="switch_wadsworth" class="button_ww">Switch is ' + (yt_wadsworth ? 'On' : 'Off') + '</div><div id="hide_wadsworth" class="button_ww">' + (!yt_wadsworth_h ? 'Show' : 'Hide') + '</div></div>');
    
    if (!window.location.href.match('v=') && !window.location.href.match('#p')) {
      bl_ww = document.querySelector('#block_wadsworth');
      bl_ww.parentNode.removeChild(bl_ww);
    }
    
    pp_state();
    
    sw_ww = document.querySelector('#switch_wadsworth');
    sw_ww.addEventListener('click', ww_switch, false);
    
    hd_ww = document.querySelector('#hide_wadsworth');
    hd_ww.addEventListener('click', hide_ww, false);
    
    ap_ww = document.querySelector('#apply_wadsworth');
    ap_ww.addEventListener('click',  function () {
      ww_apply(true);
    }, false);

  }
  document.addEventListener('DOMContentLoaded', load_once);
  window.addEventListener('spfdone', pp_state);
  //window.addEventListener('popstate', pp_state);
}) ();
