// ==UserScript==
// @name         HockeyWeerelt JSON
// @namespace    cz.hw.table
// @version      1.9
// @author       JV
// @license      MIT
// @description  Table
// @match        https://publicaties.hockeyweerelt.nl/mc/matches/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549497/HockeyWeerelt%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/549497/HockeyWeerelt%20JSON.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var pre = document.querySelector('pre');
  var raw = (pre ? pre.textContent : document.body.textContent || '').trim();
  if (!raw || raw.charAt(0) !== '{') return;

  var root; try { root = JSON.parse(raw); } catch (e) { return; }
  var d = root && root.data ? root.data : root;

  var homeName  = d && d.home_team && d.home_team.name ? d.home_team.name : '-';
  var awayName  = d && d.away_team && d.away_team.name ? d.away_team.name : '-';
  var homeScore = toNum(d.home_score);
  var awayScore = toNum(d.away_score);
  var status    = (d && d.status != null) ? d.status : '-';
  var actions   = (d && Array.isArray(d.actions)) ? d.actions.slice() : [];

  var lastMinute = getLastActionMinute(actions) || '-';

  var tbl = document.createElement('table');
  tbl.setAttribute('border','1');
  tbl.setAttribute('cellspacing','0');
  tbl.setAttribute('cellpadding','6');
  tbl.style.cssText = 'border-collapse:collapse;font-family:sans-serif;font-size:14px;margin:20px 0;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.1);width:100%;';

  var thead = document.createElement('thead');
  var kv = ''
    + '<tr><th align="left" style="width:140px;">Home Team</th><td colspan="2">'+esc(homeName)+'</td></tr>'
    + '<tr><th align="left">Away Team</th><td colspan="2">'+esc(awayName)+'</td></tr>'
    + '<tr><th align="left">Home Score</th><td colspan="2"><b>'+homeScore+'</b></td></tr>'
    + '<tr><th align="left">Away Score</th><td colspan="2"><b>'+awayScore+'</b></td></tr>'
    + '<tr><th align="left">Status</th><td colspan="2">'+esc(String(status))+'</td></tr>'
    + '<tr><th align="left">Minute</th><td colspan="2">'+esc(lastMinute)+'</td></tr>'
    + '<tr><th colspan="3" style="text-align:left;background:#f3f4f6;">Actions </th></tr>'
    + '<tr style="background:#f8fafc;"><th align="left">Minute</th><th align="left">Type</th><th align="left">Text</th></tr>';
  thead.innerHTML = kv;

  var tbody = document.createElement('tbody');
  if (actions.length) {
    sortActionsNewestFirst(actions);
    tbody.innerHTML = actions.map(function(a){
      var minute  = minuteFromAction(a) || '';
      var rawType = a && (a.type || a.action) ? String(a.type || a.action) : '';
      var type    = rawType;

      // přidej minutáž v závorkách pro start-period / end-period
      if (/^(?:start-period|end-period)$/i.test(rawType)) {
        // „zlidštění“: pomlčky nahradíme mezerou → "start period", "end period"
        var pretty = rawType.replace(/-/g, ' ');
        type = minute ? (pretty + ' (' + minute + ')') : pretty;
      }

      var text   = firstNonEmpty(
        a && a.text,
        a && a.description,
        a && a.desc,
        buildTextFallback(a, homeName, awayName)
      ) || '';
      return '<tr>'
        + '<td style="white-space:nowrap;width:80px;">'+esc(minute)+'</td>'
        + '<td style="white-space:nowrap;width:200px;">'+esc(type)+'</td>'
        + '<td>'+esc(text)+'</td>'
        + '</tr>';
    }).join('');
  } else {
    tbody.innerHTML = '<tr><td colspan="3" style="color:#6b7280;">Žádné actions.</td></tr>';
  }

  tbl.appendChild(thead);
  tbl.appendChild(tbody);

  if (pre) pre.parentNode.insertBefore(tbl, pre);
  else document.body.insertBefore(tbl, document.body.firstChild);

  function toNum(v){ if (typeof v==='number' && isFinite(v)) return v; var n=+v; return (typeof v==='string'&&v.trim()!==''&&!isNaN(n))? n:0; }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
  function firstNonEmpty(){ for (var i=0;i<arguments.length;i++){ var v=arguments[i]; if (v!=null && String(v).trim()!=='') return String(v); } return ''; }

  function minuteFromAction(a){
    if (!a) return '';
    if (typeof a.minute === 'number' && isFinite(a.minute)) return String(Math.round(a.minute));
    if (typeof a.seconds_since_start === 'number' && isFinite(a.seconds_since_start)){
      var m = Math.floor(a.seconds_since_start/60);
      var s = String(Math.floor(a.seconds_since_start%60)); if (s.length<2) s='0'+s;
      return m + ':' + s;
    }
    if (a.minute != null && String(a.minute).trim()!=='') return String(a.minute);
    return '';
  }

  function sortActionsNewestFirst(arr){
    var hasActionAt = arr.some(function(x){ return typeof x.actionAt === 'string'; });
    if (hasActionAt){
      arr.sort(function(a,b){
        var ta = Date.parse(a && a.actionAt || 0) || 0;
        var tb = Date.parse(b && b.actionAt || 0) || 0;
        return tb - ta;
      });
      return;
    }
    var hasSecs = arr.some(function(x){ return typeof x.seconds_since_start === 'number'; });
    if (hasSecs){
      arr.sort(function(a,b){
        var aa = (a && typeof a.seconds_since_start==='number') ? a.seconds_since_start : -1;
        var bb = (b && typeof b.seconds_since_start==='number') ? b.seconds_since_start : -1;
        return bb - aa;
      });
      return;
    }
    arr.reverse();
  }

  function buildTextFallback(a, homeName, awayName){
    var side = a && a.side === 'home' ? homeName : (a && a.side === 'away' ? awayName : '');
    var who  = a && (a.playerName || (a.player && a.player.name) || a.staffName) || '';
    var extra = a && (a.note || a.reason || '') || '';
    var parts = []; if (side) parts.push(side); if (who) parts.push(who); if (extra) parts.push(extra);
    return parts.join(' · ');
  }

  function getLastActionMinute(list){
    if (!Array.isArray(list) || list.length===0) return '';
    var arr = list.slice(); sortActionsNewestFirst(arr);
    for (var i=0;i<arr.length;i++){ var m = minuteFromAction(arr[i]); if (m) return m; }
    return '';
  }
})();