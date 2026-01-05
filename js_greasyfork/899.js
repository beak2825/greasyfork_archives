// ==UserScript==
// @name    Feedly Scroll Marker
// @description    Display the marker of page scroll in Feedly. / Feedlyでページスクロールしたときにマーカーを表示します。
// @id    FeedlyScrollMarker
// @namespace    http://userscripts.org/scripts/show/174679
// @homepage    https://greasyfork.org/scripts/899-feedly-scroll-marker
// @include    http://feedly.com/*
// @include    https://feedly.com/*
// @grant    GM_addStyle
// @version    1.03
// @downloadURL https://update.greasyfork.org/scripts/899/Feedly%20Scroll%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/899/Feedly%20Scroll%20Marker.meta.js
// ==/UserScript==

(function() {

try { if (typeof localStorage !== 'object') return alert('FSM Error: DOM Storage'); }
catch(er) { return alert('FSM Error: DOM Storage'); }
var $id = function(id) { return document.getElementById(id); }, iInit;

var init = function() {
  var nScrPos = 0, nTime = 750, shift = false, iMarker, st;
  var ism = document.createElement('div');
  ism.id = 'fsm_scroll_marker';
  document.body.appendChild(ism);
  var CSS = [
    '#fsm_settings { display: none; color: black; position: fixed; top: 68px; left: 68px; z-index: 90200; background: rgba(255, 255, 255, 0.98); border: 1px solid #999999; border-radius: 4px; min-width: 35em; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); }',
    '#fsm_s_titlebar { background-color: #666666; border-radius: 4px 4px 0 0; padding: 2px 0 0 4px; height: 2em; }',
    '#fsm_s_title a { font-size: 110%; font-weight: bold; color: white; text-decoration: none; }',
    '#fsm_s_title a:hover { color: #FFFF99; }',
    '#fsm_s_btn { position: absolute; top: 2px; right: 4px; }',
    '#fsm_s_ok { margin-right: 0.5em; padding: 0 2em; }',
    '#fsm_s_cancel { padding: 0 1ex; }',
    '#fsm_s_ok, #fsm_s_cancel { font-size: 80%; }',
    '#fsm_s_body { padding: 0.5em 1em; }',
    '#fsm_s_body fieldset { margin: 4px 2px; background: rgba(255, 255, 255, 0); }',
    '#fsm_s_body input { margin-left: 0.5em; text-align: center; width: 6ex; }',
    '#fsm_s_body input[type="checkbox"] { vertical-align: middle; width: auto; }',
    '#fsm_s_time { vertical-align: inherit; }',
    '#fsm_scroll_marker, #fsm_scroll_marker2 { position: absolute; width: 100%; height: 4px; margin-top: -2px; background: rgba(255,0,0,0.25); display: none; }',
    '#fsm_scroll_marker { z-index: 88801; }',
    '#fsm_scroll_marker2 { z-index: 88802; }'
  ].join('');
  GM_addStyle(CSS);
  
  var locale_ja = [
    '設定',
    'キャンセル',
    'マーカーを表示する時間 (ミリ秒):',
    'マーカーを表示するショートカットキー'
  ];
  var locale_en = [
    'Settings',
    'Cancel',
    'Time to display the marker (msec):',
    'Keyboard shortcut to display the marker'
  ];
  var loc = (window.navigator.language === 'ja') ? locale_ja : locale_en;
  
  var currentMode = function() {
    var e1 = $id('feedlyPageFX'), e2 = $id('timeline'),
      t1 = 'presentation-', t2 = 'EntryList';
    if (document.getElementsByClassName('floatingEntryScroller').length) return 'fes';
    if (e1 && e1.hasChildNodes()) {
      e1 = e1.firstChild;
      return (e1.classList.contains(t1 + '0')) ? 'T'
            : (e1.classList.contains(t1 + '4')) ? 'M2'
            : (e1.classList.contains(t1 + '5')) ? 'C'
            : (e1.classList.contains(t1 + '100')) ? 'F' : '';
    }
    if (e2) {
      return (e2.classList.contains('u0' + t2)) ? 'T'
            : (e2.classList.contains('u4' + t2)) ? 'M1'
            : (e2.classList.contains('u5' + t2)) ? 'C'
            : (e2.classList.contains('u100' + t2)) ? 'F' : '';
    }
    return '';
  };
  
  var currentEntry = function(m) {
    var mode = (m) ? m : currentMode();
    switch (mode) {
      case 'T': case 'M1':
        return document.querySelector('#timeline .inlineFrame');
      case 'C': case 'M2': case 'fes':
        return document.querySelector('#floatingEntry .floatingEntryScroller');
      case 'F':
        return document.querySelector('#timeline .selectedEntry');
      default:
        return document.querySelector('#mainArea .inlineFrame');
    }
  };
  
  var setMarker = function() {
    var mode = currentMode();
    if (mode === 'C' || mode === 'M2' || mode === 'fes') {
      if ($id('fsm_scroll_marker2')) ism = $id('fsm_scroll_marker2');
      else {
        var ism2 = document.createElement('div');
        ism2.id = 'fsm_scroll_marker2';
        currentEntry(mode).appendChild(ism2);
        ism = ism2;
      }
    } else ism = $id('fsm_scroll_marker');
  };
  
  var viewSettings = function() {
    if ($id('fsm_settings').style.display === 'block') {
      $id('fsm_settings').style.display = 'none';
      return;
    }
    $id('fsm_s_time').value = st.time;
    $id('fsm_s_key_page').checked = (st.key_page) ? true : false;
    $id('fsm_s_key_space').checked = (st.key_space) ? true : false;
    $id('fsm_settings').style.display = 'block';
  };
  
  var loadSettings = function() {
    st = {};
    try {
      st = JSON.parse(localStorage.getItem('FeedlyScrollMarker_settings')) || {};
    } catch(er) { alert('FSM Error: Load Settings'); }
    var notB = function(a) {
      return (typeof a !== 'boolean') ? true : false;
    };
    var notN = function(a) {
      return (typeof a !== 'number') ? true : false;
    };
    if (notN(st.time)) st.time = nTime;
    if (notB(st.key_page)) st.key_page = true;
    if (notB(st.key_space)) st.key_space = true;
  };
  
  var saveSettings = function() {
    try {
      localStorage.setItem('FeedlyScrollMarker_settings', JSON.stringify(st));
    } catch(er) { alert('FSM Error: Save Settings'); }
  };
  
  var div = document.createElement('div');
  div.id = 'fsm_settings';
  document.body.appendChild(div);
  $id('fsm_settings').innerHTML = '<div id="fsm_s_titlebar"><div id="fsm_s_title"><a href="https://greasyfork.org/scripts/899-feedly-scroll-marker" target="_blank">Feedly Scroll Marker ' + loc[0] + '</a></div><div id="fsm_s_btn"><input type="button" id="fsm_s_ok" value="OK"><input type="button" id="fsm_s_cancel" value="' + loc[1] + '"></div></div><div id="fsm_s_body"><label>' + loc[2] + '<input id="fsm_s_time" type="text" maxlength="4"></label><fieldset><legend>' + loc[3] + ' : </legend><label><input id="fsm_s_key_page" type="checkbox">PageUp / PageDown</label><br><label><input id="fsm_s_key_space" type="checkbox">Space / Shift+Space</label></fieldset></div>';
  
  var eTabs = $id('feedlyTabs'), eItem;
  if (eTabs) {
    eItem = document.createElement('div');
    eItem.className = 'tab';
    eItem.innerHTML = '<div class="header target"><div id="fsm_settings-menu" class="label primary iconless">Scroll Marker ' + loc[0] + '</div></div>';
    eTabs.appendChild(eItem);
  }
  
  document.addEventListener('keydown', function(e) {
    if (!/^input|^textarea/i.test(e.target.tagName) && st.time !== 0) {
      setMarker();
      if (
        (st.key_page && e.keyCode === 33) ||
        (st.key_page && e.keyCode === 34) ||
        (st.key_space && e.keyCode === 32)
      ) {
        var mode = currentMode();
        ism.style.display = 'none';
        if (mode === 'C' || mode === 'M2' || mode === 'fes') nScrPos = currentEntry(mode).scrollTop;
        else nScrPos = window.scrollY;
        if (e.shiftKey) shift = true;
      } else if (e.keyCode === 13) {
        if (currentEntry()) {
          window.clearTimeout(iMarker);
          ism.style.display = 'none';
        }
      } else if (ism.style.display !== 'none') {
        window.clearTimeout(iMarker);
        ism.style.display = 'none';
      }
    }
  }, true);
  
  document.addEventListener('keyup', function(e) {
    if (!/^input|^textarea/i.test(e.target.tagName) && st.time !== 0) {
      var mode = currentMode(), sch, sst, ele;
      if (mode === 'C' || mode === 'M2' || mode === 'fes') {
        ele = currentEntry(mode);
        sch = ele.clientHeight;
        sst = ele.scrollTop;
      } else {
        sch = document.body.parentNode.clientHeight;
        sst = document.body.parentNode.scrollTop;
      }
      if (
        (st.key_page && e.keyCode === 33) ||
        (st.key_space && e.keyCode === 32 && e.shiftKey)
      ) {
        if (nScrPos !== sst) {
          ism.style.display = 'block';
          ism.style.top = (nScrPos - (ism.scrollHeight / 2)) + 'px';
          window.clearTimeout(iMarker);
          if (st.time > 0) {
            iMarker = window.setTimeout(function() {
              window.clearTimeout(iMarker);
              ism.style.display = 'none';
            }, st.time);
          }
        }
        shift = false;
      } else if (
        (st.key_page && e.keyCode === 34) ||
        (st.key_space && e.keyCode === 32 && !e.shiftKey)
      ) {
        if (nScrPos !== sst) {
          ism.style.display = 'block';
          ism.style.top = (nScrPos + sch + (ism.scrollHeight / 2)) + 'px';
          window.clearTimeout(iMarker);
          if (st.time > 0) {
            iMarker = window.setTimeout(function() {
              window.clearTimeout(iMarker);
              ism.style.display = 'none';
            }, st.time);
          }
        }
        shift = false;
      }
    }
  }, true);
  
  document.addEventListener('click', function(e) {
    if (e.button >= 2) return;
    if (e.target.id === 'fsm_settings-menu') {
      viewSettings();
    } else if (e.target.id === 'fsm_s_ok') {
      var time = $id('fsm_s_time').value, problem = false;
      if (time === '' || /^\s+$/.test(time)) st.time = nTime;
      else if (time && !isNaN(time)) st.time = Number(time);
      else problem = true;
      if (!problem) {
        st.key_page = $id('fsm_s_key_page').checked;
        st.key_space = $id('fsm_s_key_space').checked;
        $id('fsm_s_ok').blur();
        $id('fsm_settings').style.display = 'none';
        saveSettings();
      }
    } else if (e.target.id === 'fsm_s_cancel') {
      $id('fsm_s_cancel').blur();
      $id('fsm_settings').style.display = 'none';
    } else if (ism.style.display !== 'none') {
      window.clearTimeout(iMarker);
      ism.style.display = 'none';
    }
  }, false);
  loadSettings();
};

iInit = window.setInterval(function() {
  var e = $id('feedlyTitleBar');
  if (e && e.hasChildNodes()) {
    window.clearInterval(iInit);
    window.setTimeout(function() {
      init();
    }, 1000);
  }
}, 500);

})();
