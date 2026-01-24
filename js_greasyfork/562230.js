// ==UserScript==
// @name         RED Stats Since Last
// @version      1.4.4
// @description  Shows how your Upload, Download and Ratio on Redacted have changed since your last visit.
// @author       Lancer07
// @include      http*://*redacted.sh/*
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/1535511
// @license All Rights Reserved

// @downloadURL https://update.greasyfork.org/scripts/562230/RED%20Stats%20Since%20Last.user.js
// @updateURL https://update.greasyfork.org/scripts/562230/RED%20Stats%20Since%20Last.meta.js
// ==/UserScript==

// Original author: Chameleon (https://greasyfork.org/users/87476)

// Changelog:
// 1.4.4
// - Removed alert popups
// - Added one-time visual highlight for stat changes
// - Persist Time unit changed from minutes to days
// - UI improved
//
// 1.4.3
// - Updated buffer calculation factor from 0.6 to 0.65
//
// 1.4.2
// - Changed default settings: "Show on no change" enabled. Persist Time 14400 minutes.
//
// 1.4.1
// - Fixed outdated Redacted domain suffix
// - Removed PTP support

(function() {
  'use strict';

    // one-time highlight style for stat changes
  var style = document.createElement('style');
  style.textContent = `
    .stats_highlight {
      color: #e74c3c;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  if((window.location.href.indexOf("threadid=1781") != -1 && window.location.host.indexOf('redacted') != -1) || (window.location.href.indexOf("threadid=76554") != -1 && window.location.host.indexOf('redacted') != -1))
    showSettings();

  var currentStats = {};
  var statspans = document.getElementById('userinfo_stats').querySelectorAll('span');
  currentStats.up = parseStats(statspans[0].textContent);
  currentStats.down = parseStats(statspans[1].textContent);
  currentStats.ratio = parseFloat(statspans[2].textContent);
  if(window.location.href.indexOf("redacted.sh") !== -1 && !isNaN(parseFloat(statspans[0].title)))
  {
    currentStats.up = parseStats(statspans[0].title);
    currentStats.down = parseStats(statspans[1].title);
    currentStats.ratio = parseFloat(statspans[2].title);
  }
  if(isNaN(currentStats.ratio))
    currentStats.ratio = 0;
  currentStats.time=(new Date())*1;

  var oldStats = window.localStorage.lastStats;

  if(!oldStats)
    oldStats = {up:currentStats.up, down:currentStats.down, ratio:currentStats.ratio};
  else
    oldStats = JSON.parse(oldStats);


  var settings = getSettings();

  if(settings.persistTime && oldStats.time)
  {
    var difTime = (new Date())-oldStats.time;
    if(difTime > settings.persistTime * 24 * 60 * 60000)
      window.localStorage.lastStats = JSON.stringify(currentStats);
  }
  else
    window.localStorage.lastStats = JSON.stringify(currentStats);

  var difTime=false;
  if(oldStats.time)
  {
    difTime = (new Date())-oldStats.time;
  }

  var li=false;
  if(settings.showBuffer)
  {
    li=document.createElement('li');
    if(window.location.host.indexOf('popcorn') != -1)
      li.setAttribute('class', 'user-info-bar__item');
    var before=document.getElementById('stats_ratio');
    before.parentNode.insertBefore(li, before);
    var buffer=renderStats((currentStats.up/1.05)-currentStats.down);
    if(window.location.host.indexOf('redacted') != -1)
      buffer=renderStats((currentStats.up/0.65)-currentStats.down);
    li.innerHTML='Buffer: <span class="stat">'+buffer+'</span>';
    li.setAttribute('id', 'stats_buffer');
  }

  var change = {up:currentStats.up-oldStats.up, down:currentStats.down-oldStats.down, ratio:Math.round((currentStats.ratio-oldStats.ratio)*100)/100};
  var lastShown = window.localStorage.lastStatsShown;
  if (lastShown) {
    lastShown = JSON.parse(lastShown);
  } else {
    lastShown = { up: 0, down: 0, ratio: 0 };
  }

  var highlightUp = change.up !== lastShown.up && change.up !== 0;
  var highlightDown = change.down !== lastShown.down && change.down !== 0;
  var highlightRatio = change.ratio !== lastShown.ratio && change.ratio !== 0;

  if(settings.profileOnly && window.location.href.indexOf(document.getElementById('nav_userinfo').getElementsByTagName('a')[0].href) == -1)
    return;
    if(change.up != 0 || settings.noChange)
    {
        var spanUp = document.createElement('span');
        spanUp.className = 'stats_last up';
        if (highlightUp) spanUp.className += ' stats_highlight';
        spanUp.innerHTML = '(' + renderStats(change.up) + ')';
        statspans[0].appendChild(document.createTextNode(' '));
        statspans[0].appendChild(spanUp);

        if(difTime)
            statspans[0].title = (prettyTime(difTime))+' ago';
    }

    if(change.down != 0 || settings.noChange)
    {
        var spanDown = document.createElement('span');
        spanDown.className = 'stats_last down';
        if (highlightDown) spanDown.className += ' stats_highlight';
        spanDown.innerHTML = '(' + renderStats(change.down) + ')';
        statspans[1].appendChild(document.createTextNode(' '));
        statspans[1].appendChild(spanDown);

        if(difTime)
            statspans[1].title = (prettyTime(difTime))+' ago';
    }

  if((change.up != 0 || change.down != 0 || settings.noChange) && settings.showBuffer)
  {
    var span=li.getElementsByTagName('span')[0];
    var buffer=renderStats((change.up/1.05)-change.down);
    if(window.location.host.indexOf('redacted') != -1)
      buffer=renderStats((change.up/0.65)-change.down);
    span.innerHTML += ' <span class="stats_last buffer">('+buffer+')</span>';
    if(difTime)
      span.title = (prettyTime(difTime))+' ago';
  }
  if(change.ratio != 0 || settings.noChange)
  {
      var spanRatio = document.createElement('span');
      spanRatio.className = 'stats_last ratio';
      if (highlightRatio) spanRatio.className += ' stats_highlight';
      spanRatio.innerHTML = '(' + change.ratio + ')';
      statspans[2].appendChild(document.createTextNode(' '));
      statspans[2].appendChild(spanRatio);

      if(difTime)
          statspans[2].title = (prettyTime(difTime))+' ago';
  }

    window.localStorage.lastStatsShown = JSON.stringify(change);
})();

function prettyTime(time)
{
  var t=time;
  if(t/60000 < 1)
    return Math.round(time/1000)+'s';
  if(t/(60000*60) < 1)
    return Math.round(time/60000)+'m';
  if(t/(60000*60*24) < 1)
    return Math.round(time/(60000*60))+'h';
  return Math.round(time/(60000*60*24))+'d '+(Math.round((time%(60000*60*24))/(60000*60)))+'h';
}

function showSettings()
{
  var before = document.getElementsByClassName('forum_post')[0];
  var div = document.createElement('div');
  before.parentNode.insertBefore(div, before);
  div.setAttribute('style', 'width: 100%; text-align: center; padding-bottom: 10px;');
  div.setAttribute('class', 'box');
    // Title with smaller bottom margin
    var title = document.createElement('h2');
    title.textContent = 'RED stats since last Settings';
    title.style.marginBottom = '4px'; // 调整这个数值，单位是 px
    div.appendChild(title);

  var settings = getSettings();

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Show on no change: '+(settings.noChange ? 'On' : 'Off');
  a.addEventListener('click', changeSetting.bind(undefined, a), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Show on profile only: '+(settings.profileOnly ? 'On' : 'Off');
  a.addEventListener('click', changeSetting.bind(undefined, a), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Show buffer: '+(settings.showBuffer ? 'On' : 'Off');
  a.addEventListener('click', changeSetting.bind(undefined, a), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));


    // Create Reset After input with left label and right unit
    var wrapper = document.createElement('span');

    // Left label
    var labelLeft = document.createElement('span');
    labelLeft.innerHTML = 'Reset after ';
    labelLeft.style.marginRight = '4px';
    labelLeft.style.opacity = '0.9';

    // Input field
    var input = document.createElement('input');
    input.type = 'number';
    input.style.width = '60px';
    input.value = settings.persistTime ? settings.persistTime : '';
    input.addEventListener('change', changeInput.bind(undefined, input), false);

    // Right unit
    var labelRight = document.createElement('span');
    labelRight.innerHTML = ' days';
    labelRight.style.marginLeft = '4px';
    labelRight.style.opacity = '0.9';

    // Combine into wrapper
    wrapper.appendChild(labelLeft);
    wrapper.appendChild(input);
    wrapper.appendChild(labelRight);
    div.appendChild(wrapper);
    div.appendChild(document.createElement('br'));


  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = '>>Save<<';
  div.appendChild(a);
  div.appendChild(document.createElement('br'));
}

function changeInput(input)
{
  var settings = getSettings();
  settings.persistTime=input.value;
  GM_setValue('lastStatsSettingsV2', JSON.stringify(settings));
}

function changeSetting(a)
{
  var on=false;
  if(a.innerHTML.indexOf('On') == -1)
  {
    on=true;
    a.innerHTML = a.innerHTML.replace('Off', 'On');
  }
  else
  {
    a.innerHTML = a.innerHTML.replace('On', 'Off');
  }

  var settings = getSettings();
  if(a.innerHTML.indexOf('no change') != -1)
  {
    settings.noChange = on;
  }
  else if(a.innerHTML.indexOf('profile only') != -1)
  {
    settings.profileOnly = on;
  }
  else if(a.innerHTML.indexOf('Show buffer') != -1)
  {
    settings.showBuffer = on;
  }
  GM_setValue('lastStatsSettingsV2', JSON.stringify(settings));
}

function getSettings()
{
  var settings = GM_getValue('lastStatsSettingsV2', false);
  if(!settings)
  {
    settings = {noChange: true, profileOnly: false, showBuffer: false, persistTime: 10};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}

function renderStats(number)
{
  var amount = number;
  var pow = 0;
  for(var i=10; i<=50; i=i+10)
  {
    if(Math.abs(amount)/Math.pow(2, i) > 1)
      pow=i/10;
  }
  var suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  if(window.location.host.indexOf('popcorn') != -1)
    suffixes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
  return (Math.round(amount/Math.pow(2, pow*10)*100))/100+' '+suffixes[pow];
}

function parseStats(string)
{
  string=string.replace(/,/g, '');
  var suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  if(window.location.host.indexOf('popcorn') != -1)
    suffixes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
  var amount = parseFloat(string);
  if(string.indexOf(suffixes[1]) != -1)
    amount = amount*Math.pow(2, 10);
  else if(string.indexOf(suffixes[2]) != -1)
    amount = amount*Math.pow(2, 20);
  else if(string.indexOf(suffixes[3]) != -1)
    amount = amount*Math.pow(2, 30);
  else if(string.indexOf(suffixes[4]) != -1)
    amount = amount*Math.pow(2, 40);
  else if(string.indexOf(suffixes[5]) != -1)
    amount = amount*Math.pow(2, 50);
  return Math.round(amount);
}
