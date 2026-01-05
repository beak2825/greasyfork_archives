// ==UserScript==
// @name           YouTube Links Updater
// @namespace      http://www.smallapple.net/
// @description    Updates YouTube Links. Not meant to be used directly.
// @author         Ng Hun Yang
// @include        http://*.youtube.com/*
// @version        2.03
// @downloadURL https://update.greasyfork.org/scripts/5565/YouTube%20Links%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/5565/YouTube%20Links%20Updater.meta.js
// ==/UserScript==

ujsYtLinks.chkVerCallback([
  { ver: 20300, ts: 2018110700, desc: "Skip updating stale links, update sig" },
  { ver: 20200, ts: 2018101800, desc: "Handle n/a videos properly" },
  { ver: 20100, ts: 2018092900, desc: "Refresh tags in Material Design search page" },
  { ver: 20000, ts: 2018092700, desc: "Support dark theme, user settings, copy to clipboard, work on GM 4" },
  { ver: 19600, ts: 2018092200, desc: "Support Material Design, fix sig" },
  { ver: 19500, ts: 2017050400, desc: "Support Material Design" },
  { ver: 19400, ts: 2017021700, desc: "Add keepFormats" },
  { ver: 19300, ts: 2016062700, desc: "Fixed sig-81" },
  { ver: 19200, ts: 2016040900, desc: "Added @connect for Tampermonkey" },
  { ver: 19100, ts: 2015123000, desc: "Fixed VEVO sig detection" },
  { ver: 19000, ts: 2015121200, desc: "Fixed dangling popup" },
  { ver: 18800, ts: 2015112700, desc: "Updated VEVO sig detection 2" },
  { ver: 18700, ts: 2015111700, desc: "Updated VEVO sig detection" },
  { ver: 18600, ts: 2015091600, desc: "Add VP9/VOR label" },
  { ver: 18500, ts: 2015061700, desc: "Label 8K videos" },
  { ver: 18400, ts: 2015050500, desc: "Set download filename" },
  { ver: 18300, ts: 2015012100, desc: "Detect 4:3 AR properly" },
  { ver: 18200, ts: 2014112100, desc: "Fixed VEVO videos on TamperMonkey" },
  { ver: 18100, ts: 2014111400, desc: "Updated VEVO sig detection" },
  { ver: 18000, ts: 2014111100, desc: "Show >1080p videos and tag videowall" },
  { ver: 17100, ts: 2014110200, desc: "Show 60fps video" },
  { ver: 17000, ts: 2014102700, desc: "Add 256kbps M4A" },
  { ver: 16400, ts: 2014101000, desc: "Fixed events on Firefox" },
  { ver: 16300, ts: 2014100800, desc: "Switch to Greasy Fork" },
  { ver: 16200, ts: 2014030700, desc: "Snap to std res" },
  { ver: 16100, ts: 2014020500, desc: "Improved support for obfuscated videos" },
  { ver: 16000, ts: 2014010900, desc: "Support obfuscated videos" },
  { ver: 15000, ts: 2014010200, desc: "Get video info only if in viewport" },
  { ver: 14300, ts: 2013122500, desc: "Don't show link on buttons" },
  { ver: 14200, ts: 2013122200, desc: "Don't show link on playlist buttons" },
  { ver: 14100, ts: 2013122100, desc: "Snap to standard video res" },
  { ver: 14000, ts: 2013122000, desc: "Support adaptive stream videos" },
  { ver: 13600, ts: 2013072400, desc: "Support sig-87 videos" },
  { ver: 13500, ts: 2013072300, desc: "Support sig-85 videos" },
  { ver: 13400, ts: 2013071700, desc: "Support sig-90/92 videos" },
  { ver: 13300, ts: 2013071200, desc: "Fixed not avail videos, support VEVO videos" },
  { ver: 13200, ts: 2013012500, desc: "Fixed channel video" },
  { ver: 13100, ts: 2013012200, desc: "Fixed filename after YouTube update" },
  { ver: 13000, ts: 2012101700, desc: "Show file size in Firefox and Chrome" },
  { ver: 12300, ts: 2012100300, desc: "Show available update in Chrome" },
  { ver: 12200, ts: 2012092100, desc: "Added YouTube video sig" },
  { ver: 12100, ts: 2011091000, desc: "Tooltip positioning bug fix" },
  { ver: 12000, ts: 2011090500, desc: "Show video formats for cur video in user's channel" },
  { ver: 11000, ts: 2011082500, desc: "Show all formats for video links" },
  { ver: 10100, ts: 2011081800, desc: "Monitor new video links and other minor bug fixes" },
  { ver: 10000, ts: 2011081300, desc: "Initial release" }
  ]);
