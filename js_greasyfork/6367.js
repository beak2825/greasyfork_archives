// ==UserScript==
// @name        GitHub Sortable Filelist
// @namespace   trespassersW
// @description appends sorting function to github directories
// @include https://github.com/*
// @version 18.04.12.1
// 18.04.12 * hotfix 
// 16.04.17 * hotfix -- 'time' becomes 'time-ago'
// 16.02.06 * octicons as svg images
// 15.08.12 ++ octicons for file extensions
// 15.08.07  + case-insensitive sorting
// 15.05.07  sorting is now faster
//  .12 new age format; fix for chrome
//  .10 datetime auto-updating fix; right-aligned datetime column; proper local time; .ext sorting fix; 
//  .8 sorting by file extention
//  .7 date/time display mode switching
// @created 2014-11-10
// @author  trespassersW
// @license MIT
// @icon https://i.imgur.com/8buFLcs.png
// (C) Icon: Aaron Nichols CC Attribution 3.0 Unported
// (C) Opticons Font License: SIL OFL 1.1 (http://scripts.sil.org/OFL)
// @run-at document-end
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/6367/GitHub%20Sortable%20Filelist.user.js
// @updateURL https://update.greasyfork.org/scripts/6367/GitHub%20Sortable%20Filelist.meta.js
// ==/UserScript==

if(document.body && document.querySelector('#js-repo-pjax-container')){

var llii=0, _l= function(){/* * /
 for (var s=++llii +':', li=arguments.length, i = 0; i<li; i++) 
  s+=' ' + arguments[i];
 console.log(s)
/* */
}
//_l=console.log.bind(console);
var fakejs = // avoid compiler warning
(function(){ "use strict"; 

var ii=0,tt;
var d0=[0,0,1];
var C=[{c:1, d: 0, s: 0},{c:2, d: 0, s: 0},{c:3, d: 1, s: 0}];
var ASC;
var oa=[],ca=[],clock,ext,dtStyle,upc;
var D=document, TB;
var catcher,locStor;
var prefs={dtStyle:0, ext: 0, upc: 1};
var W= unsafeWindow || window;

// see: https://octicons.github.com/ 
var extIcon=[
//0...........1..............2..............3..............4.......
 "octoface"  ,"zap"        ,"list-unordered","paintcan"   ,"eye"
//5...........6..............7..............8..............9.......
,"globe"    ,"file-binary" ,"file-zip"      ,"file-pdf"   ,"megaphone"
//10..........11.............12.............13.............14......
,"gear"     ,"triangle-right","ruby"        ,"info"       ,"device-camera"    
//15..........16.............17.............18.............19......
,"pencil"   ,"terminal"      ,"book","device-camera-video","stop"
]
var extList={ 
md:0,
js:1,jsm:1,
json:2,xml:2,xul:2,rdf:2,yml:2,
css:3,scss:3,less:3,
png:4,bmp:4,gif:4,cur:4,ico:4,svg:4,
htm:5,html:5,php:5,
bin:6,exe:6,dll:6,
zip:7,rar:7,arj:7,gem:7,tgz:7,
pdf:8,
wav:9,mp3:9,ogg:9,mp4:9,aac:9,
cfg:10,ini:10,
c:11,cpp:11,cc:11,h:11,hpp:11,asm:11,m:11,
rb:12,py:12,
EmptyExt:13,
jpg:14,jpeg:14,
pl:15,java:15,jar:15,cs:15,
sh:16,mak:16,cmd:16,bat:16,
doc:17,rtf:17,djvu:17,
avi:18,mkv:18,mpg:18,mpeg:18,vob:18,m2v:18,
gitignore:19
}

/* 
 https://github.com/github/octicons
*/
var svgList={
octoface: '<svg class="octicon octicon-octoface"><path d="M14.7 4.34c0.13-0.32 0.55-1.59-0.13-3.31 0 0-1.05-0.33-3.44 1.3C10.13 2.05 9.06 2.01 8 2.01c-1.06 0-2.13 0.04-3.13 0.32C2.48 0.69 1.43 1.03 1.43 1.03 0.75 2.75 1.17 4.02 1.3 4.34 0.49 5.21 0 6.33 0 7.69 0 12.84 3.33 14 7.98 14 12.63 14 16 12.84 16 7.69 16 6.33 15.51 5.21 14.7 4.34zM8 13.02c-3.3 0-5.98-0.15-5.98-3.35 0-0.76 0.38-1.48 1.02-2.07 1.07-0.98 2.9-0.46 4.96-0.46 2.07 0 3.88-0.52 4.96 0.46 0.65 0.59 1.02 1.3 1.02 2.07C13.98 12.86 11.3 13.02 8 13.02zM5.49 8.01c-0.66 0-1.2 0.8-1.2 1.78s0.54 1.79 1.2 1.79c0.66 0 1.2-0.8 1.2-1.79S6.15 8.01 5.49 8.01zM10.51 8.01C9.85 8.01 9.31 8.8 9.31 9.79s0.54 1.79 1.2 1.79 1.2-0.8 1.2-1.79C11.71 8.8 11.18 8.01 10.51 8.01z" /></svg>',
zap:'<svg class="octicon octicon-zip"><path d="M10 7H6L9 0 0 9h4L1 16 10 7z" /></svg>',
'list-unordered':'<svg class="octicon octicon-list-unordered"><path d="M2 13c0 0.59 0 1-0.59 1H0.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1h0.81c0.59 0 0.59 0.41 0.59 1z m2.59-9h6.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1H4.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1zM1.41 7H0.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1h0.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1z m0-5H0.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1h0.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1z m10 5H4.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1h6.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1z m0 5H4.59c-0.59 0-0.59 0.41-0.59 1s0 1 0.59 1h6.81c0.59 0 0.59-0.41 0.59-1s0-1-0.59-1z" /></svg>',
paintcan:'<svg class="octicon octicon-paintcan"><path d="M6 0C2.69 0 0 2.69 0 6v1c0 0.55 0.45 1 1 1v5c0 1.1 2.24 2 5 2s5-0.9 5-2V8c0.55 0 1-0.45 1-1v-1C12 2.69 9.31 0 6 0zM9 10v0.5c0 0.28-0.22 0.5-0.5 0.5s-0.5-0.22-0.5-0.5v-0.5c0-0.28-0.22-0.5-0.5-0.5s-0.5 0.22-0.5 0.5v2.5c0 0.28-0.22 0.5-0.5 0.5s-0.5-0.22-0.5-0.5V10.5c0-0.28-0.22-0.5-0.5-0.5s-0.5 0.22-0.5 0.5v0.5c0 0.55-0.45 1-1 1s-1-0.45-1-1v-1c-0.55 0-1-0.45-1-1V7.2C2.91 7.69 4.36 8 6 8s3.09-0.31 4-0.8V9C10 9.55 9.55 10 9 10zM6 7c-1.68 0-3.12-0.41-3.71-1 0.59-0.59 2.03-1 3.71-1s3.12 0.41 3.71 1C9.12 6.59 7.68 7 6 7zM6 4c-2.76 0-5 0.89-5 2 0 0 0 0 0 0C1 3.24 3.24 1 6 1c2.76 0 5 2.24 5 5C11 4.9 8.76 4 6 4z"/></svg>',
eye:'<svg class="octicon octicon-zip"><path d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6c4.94 0 7.94-6 7.94-6S13 2 8.06 2z m-0.06 10c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4z m2-4c0 1.11-0.89 2-2 2s-2-0.89-2-2 0.89-2 2-2 2 0.89 2 2z" /></svg>',
globe:'<svg class="octicon octicon-globe"><path d="M7 1C3.14 1 0 4.14 0 8s3.14 7 7 7c0.48 0 0.94-0.05 1.38-0.14-0.17-0.08-0.2-0.73-0.02-1.09 0.19-0.41 0.81-1.45 0.2-1.8s-0.44-0.5-0.81-0.91-0.22-0.47-0.25-0.58c-0.08-0.34 0.36-0.89 0.39-0.94 0.02-0.06 0.02-0.27 0-0.33 0-0.08-0.27-0.22-0.34-0.23-0.06 0-0.11 0.11-0.2 0.13s-0.5-0.25-0.59-0.33-0.14-0.23-0.27-0.34c-0.13-0.13-0.14-0.03-0.33-0.11s-0.8-0.31-1.28-0.48c-0.48-0.19-0.52-0.47-0.52-0.66-0.02-0.2-0.3-0.47-0.42-0.67-0.14-0.2-0.16-0.47-0.2-0.41s0.25 0.78 0.2 0.81c-0.05 0.02-0.16-0.2-0.3-0.38-0.14-0.19 0.14-0.09-0.3-0.95s0.14-1.3 0.17-1.75 0.38 0.17 0.19-0.13 0-0.89-0.14-1.11c-0.13-0.22-0.88 0.25-0.88 0.25 0.02-0.22 0.69-0.58 1.16-0.92s0.78-0.06 1.16 0.05c0.39 0.13 0.41 0.09 0.28-0.05-0.13-0.13 0.06-0.17 0.36-0.13 0.28 0.05 0.38 0.41 0.83 0.36 0.47-0.03 0.05 0.09 0.11 0.22s-0.06 0.11-0.38 0.3c-0.3 0.2 0.02 0.22 0.55 0.61s0.38-0.25 0.31-0.55 0.39-0.06 0.39-0.06c0.33 0.22 0.27 0.02 0.5 0.08s0.91 0.64 0.91 0.64c-0.83 0.44-0.31 0.48-0.17 0.59s-0.28 0.3-0.28 0.3c-0.17-0.17-0.19 0.02-0.3 0.08s-0.02 0.22-0.02 0.22c-0.56 0.09-0.44 0.69-0.42 0.83 0 0.14-0.38 0.36-0.47 0.58-0.09 0.2 0.25 0.64 0.06 0.66-0.19 0.03-0.34-0.66-1.31-0.41-0.3 0.08-0.94 0.41-0.59 1.08 0.36 0.69 0.92-0.19 1.11-0.09s-0.06 0.53-0.02 0.55 0.53 0.02 0.56 0.61 0.77 0.53 0.92 0.55c0.17 0 0.7-0.44 0.77-0.45 0.06-0.03 0.38-0.28 1.03 0.09 0.66 0.36 0.98 0.31 1.2 0.47s0.08 0.47 0.28 0.58 1.06-0.03 1.28 0.31-0.88 2.09-1.22 2.28-0.48 0.64-0.84 0.92-0.81 0.64-1.27 0.91c-0.41 0.23-0.47 0.66-0.66 0.8 3.14-0.7 5.48-3.5 5.48-6.84 0-3.86-3.14-7-7-7z m1.64 6.56c-0.09 0.03-0.28 0.22-0.78-0.08-0.48-0.3-0.81-0.23-0.86-0.28 0 0-0.05-0.11 0.17-0.14 0.44-0.05 0.98 0.41 1.11 0.41s0.19-0.13 0.41-0.05 0.05 0.13-0.05 0.14zM6.34 1.7c-0.05-0.03 0.03-0.08 0.09-0.14 0.03-0.03 0.02-0.11 0.05-0.14 0.11-0.11 0.61-0.25 0.52 0.03-0.11 0.27-0.58 0.3-0.66 0.25z m1.23 0.89c-0.19-0.02-0.58-0.05-0.52-0.14 0.3-0.28-0.09-0.38-0.34-0.38-0.25-0.02-0.34-0.16-0.22-0.19s0.61 0.02 0.7 0.08c0.08 0.06 0.52 0.25 0.55 0.38 0.02 0.13 0 0.25-0.17 0.25z m1.47-0.05c-0.14 0.09-0.83-0.41-0.95-0.52-0.56-0.48-0.89-0.31-1-0.41s-0.08-0.19 0.11-0.34 0.69 0.06 1 0.09c0.3 0.03 0.66 0.27 0.66 0.55 0.02 0.25 0.33 0.5 0.19 0.63z"/></svg>',
'file-binary':'<svg class="octicon octicon-file-binary"><path d="M4 12h1v1H2v-1h1V10h-1v-1h2v3z m8-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z m-3-1H6v1h1v2h-1v1h3v-1h-1V4z m-6 0h3v4H2V4z m1 3h1V5h-1v2z m3 2h3v4H6V9z m1 3h1V10h-1v2z"/></svg>',
'file-zip':'<svg class="octicon octicon-file-zip"><path d="M8.5 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h10c0.55 0 1-0.45 1-1V4.5L8.5 1z m2.5 13H1V2h3v1h1v-1h3l3 3v9zM5 4v-1h1v1h-1z m-1 0h1v1h-1v-1z m1 2v-1h1v1h-1z m-1 0h1v1h-1v-1z m1 2v-1h1v1h-1z m-1 1.28c-0.59 0.34-1 0.98-1 1.72v1h4v-1c0-1.11-0.89-2-2-2v-1h-1v1.28z m2 0.72v1H4v-1h2z" /></svg>',
'file-pdf':'<svg class="octicon octicon-file-pdf"><path d="M8.5 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h10c0.55 0 1-0.45 1-1V4.5L8.5 1zM1 2h4c-0.11 0.03-0.2 0.09-0.31 0.2-0.09 0.09-0.17 0.25-0.23 0.47-0.11 0.39-0.14 0.89-0.09 1.47s0.17 1.17 0.34 1.8c-0.23 0.73-0.61 1.61-1.11 2.66s-0.8 1.66-0.91 1.84c-0.14 0.05-0.36 0.14-0.69 0.3-0.33 0.14-0.66 0.36-1 0.64V2z m4.42 4.8c0.45 1.13 0.84 1.83 1.17 2.09s0.64 0.45 0.94 0.53c-0.64 0.09-1.23 0.2-1.81 0.33-0.56 0.13-1.17 0.33-1.81 0.59 0.02-0.02 0.22-0.44 0.61-1.25s0.7-1.58 0.91-2.3z m5.58 7.2H1.5c-0.06 0-0.13-0.02-0.17-0.03 0.2-0.06 0.45-0.2 0.73-0.44 0.45-0.38 1.05-1.16 1.78-2.38 0.31-0.13 0.58-0.23 0.81-0.31l0.42-0.14c0.45-0.13 0.94-0.23 1.44-0.33 0.5-0.08 1-0.16 1.48-0.2 0.45 0.22 0.91 0.39 1.39 0.53 0.48 0.13 0.91 0.2 1.23 0.23 0.14 0 0.27-0.02 0.38-0.03v3.09z m0-4.86c-0.19-0.11-0.41-0.2-0.64-0.28-0.23-0.06-0.48-0.09-0.75-0.11-0.39 0-0.8 0.03-1.23 0.08-0.23-0.06-0.56-0.28-0.98-0.64s-0.86-1.14-1.31-2.33c0.13-0.83 0.19-1.48 0.2-1.97s0.02-0.73 0-0.75c0.05-0.41-0.03-0.7-0.2-0.88s-0.38-0.27-0.61-0.27h2.53l3 3v4.14z" /></svg>',
megaphone:'<svg class="octicon octicon-megaphone"><path d="M10 1c-0.17 0-0.36 0.05-0.52 0.14-1.44 0.88-4.98 3.44-6.48 3.86-1.38 0-3 0.67-3 2.5s1.63 2.5 3 2.5c0.3 0.08 0.64 0.23 1 0.41v4.59h2V11.55c1.34 0.86 2.69 1.83 3.48 2.31 0.16 0.09 0.34 0.14 0.52 0.14 0.52 0 1-0.42 1-1V2c0-0.58-0.48-1-1-1z m0 12c-0.38-0.23-0.89-0.58-1.5-1-0.16-0.11-0.33-0.22-0.5-0.34V3.31c0.16-0.11 0.31-0.2 0.47-0.31 0.61-0.41 1.16-0.77 1.53-1v11z m2-6h4v1H12v-1z m0 2l4 2v1L12 10v-1z m4-6v1L12 6v-1l4-2z" /></svg>',
gear:'<svg class="octicon octicon-gear"><path d="M6.999 5.469C5.602 5.469 4.469 6.602 4.469 8c0 1.396 1.133 2.532 2.53 2.532 1.397 0 2.522-1.136 2.522-2.532C9.521 6.602 8.396 5.469 6.999 5.469zM12.072 9.454l-0.456 1.099 0.813 1.598 0.107 0.211-1.128 1.128L9.559 12.615l-1.099 0.451L7.902 14.773l-0.071 0.227H6.237L5.547 13.073l-1.099-0.453-1.6 0.812-0.211 0.105-1.127-1.127 0.873-1.852-0.453-1.098L0.226 8.904 0 8.831V7.238L1.928 6.547l0.453-1.097-0.811-1.601-0.107-0.21 1.126-1.126 1.853 0.873 1.097-0.454 0.557-1.706L6.168 1h1.594l0.69 1.929 1.096 0.454L11.148 2.571l0.213-0.107 1.127 1.126-0.873 1.85L12.066 6.539l1.709 0.557L14 7.168v1.593L12.072 9.454z" /></svg>',
'triangle-right':'<svg class="octicon octicon-triangle-right"><path d="M0 14l6-6L0 2v12z" /></svg>',
ruby:'<svg class="octicon octicon-ruby"><path d="M13 6L8 11V4h3l2 2z m3 0L8 14 0 6l4-4h8l4 4zM8 12.5l6.5-6.5-3-3H4.5L1.5 6l6.5 6.5z"/></svg>',
info:'<svg class="octicon octicon-info"><path d="M6.3 5.69c-0.19-0.19-0.28-0.42-0.28-0.7s0.09-0.52 0.28-0.7 0.42-0.28 0.7-0.28 0.52 0.09 0.7 0.28 0.28 0.42 0.28 0.7-0.09 0.52-0.28 0.7-0.42 0.3-0.7 0.3-0.52-0.11-0.7-0.3z m1.7 2.3c-0.02-0.25-0.11-0.48-0.31-0.69-0.2-0.19-0.42-0.3-0.69-0.31h-1c-0.27 0.02-0.48 0.13-0.69 0.31-0.2 0.2-0.3 0.44-0.31 0.69h1v3c0.02 0.27 0.11 0.5 0.31 0.69 0.2 0.2 0.42 0.31 0.69 0.31h1c0.27 0 0.48-0.11 0.69-0.31 0.2-0.19 0.3-0.42 0.31-0.69h-1V7.98z m-1-5.69C3.86 2.3 1.3 4.84 1.3 7.98s2.56 5.7 5.7 5.7 5.7-2.55 5.7-5.7-2.56-5.69-5.7-5.69m0-1.31c3.86 0 7 3.14 7 7S10.86 14.98 7 14.98 0 11.86 0 7.98 3.14 0.98 7 0.98z"/></svg>',
'device-camera':'<svg class="octicon octicon-device-camera"><path d="M15 3H7c0-0.55-0.45-1-1-1H2c-0.55 0-1 0.45-1 1-0.55 0-1 0.45-1 1v9c0 0.55 0.45 1 1 1h14c0.55 0 1-0.45 1-1V4c0-0.55-0.45-1-1-1zM6 5H2v-1h4v1z m4.5 7c-1.94 0-3.5-1.56-3.5-3.5s1.56-3.5 3.5-3.5 3.5 1.56 3.5 3.5-1.56 3.5-3.5 3.5z m2.5-3.5c0 1.38-1.13 2.5-2.5 2.5s-2.5-1.13-2.5-2.5 1.13-2.5 2.5-2.5 2.5 1.13 2.5 2.5z"/></svg>',
pencil:'<svg class="octicon octicon-pencil"><path d="M0 12v3h3l8-8-3-3L0 12z m3 2H1V12h1v1h1v1z m10.3-9.3l-1.3 1.3-3-3 1.3-1.3c0.39-0.39 1.02-0.39 1.41 0l1.59 1.59c0.39 0.39 0.39 1.02 0 1.41z"/></svg>',
terminal:'<svg class="octicon octicon-terminal"><path d="M7 10h4v1H7v-1z m-3 1l3-3-3-3-0.75 0.75 2.25 2.25-2.25 2.25 0.75 0.75z m10-8v10c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V3c0-0.55 0.45-1 1-1h12c0.55 0 1 0.45 1 1z m-1 0H1v10h12V3z"/></svg>',
book:'<svg class="octicon octicon-book"><path d="M2 5h4v1H2v-1z m0 3h4v-1H2v1z m0 2h4v-1H2v1z m11-5H9v1h4v-1z m0 2H9v1h4v-1z m0 2H9v1h4v-1z m2-6v9c0 0.55-0.45 1-1 1H8.5l-1 1-1-1H1c-0.55 0-1-0.45-1-1V3c0-0.55 0.45-1 1-1h5.5l1 1 1-1h5.5c0.55 0 1 0.45 1 1z m-8 0.5l-0.5-0.5H1v9h6V3.5z m7-0.5H8.5l-0.5 0.5v8.5h6V3z"/></svg>',
'device-camera-video':'<svg class="octicon octicon-device-camera-video"><path d="M15.2 3.09L10 6.72V4c0-0.55-0.45-1-1-1H1c-0.55 0-1 0.45-1 1v9c0 0.55 0.45 1 1 1h8c0.55 0 1-0.45 1-1V10.28l5.2 3.63c0.33 0.23 0.8 0 0.8-0.41V3.5c0-0.41-0.47-0.64-0.8-0.41z"/></svg>',
stop:'<svg class="octicon octicon-stop"><path d="M10 1H4L0 5v6l4 4h6l4-4V5L10 1z m3 9.5L9.5 14H4.5L1 10.5V5.5l3.5-3.5h5l3.5 3.5v5zM6 4h2v5H6V4z m0 6h2v2H6V10z"/></svg>'
}
var svgUsed={};

function stickStyle(css){
 var s=document.createElement("style"); s.type="text/css";
 s.appendChild(document.createTextNode(css));
 return (document.head||document.documentElement).appendChild(s);
}
function insBefore(n,e){
  return e.parentNode.insertBefore(n,e);
}
function insAfter(n,e){
  if(e.nextElementSibling)
   return e.parentNode.insertBefore(n,e.nextElementSibling);
  return e.parentNode.appendChild(n);
}
function outerNode(target, node) {
 if (target.nodeName==node) return target;
  if (target.parentNode) 
  while (target = target.parentNode) try{
   if (target.nodeName==node)
    return target;
  }catch(e){};
 return null;
}
function savePrefs(){
 if(locStor) locStor.setItem('GHSFL',JSON.stringify(prefs));
}

function css(){
stickStyle('\
.fsort-butt,\n\
.tables.file td.content, .tables.file td.message, .tables.file td.age\n\
 {position: relative; }\n\
 \n\
.fsort-butt:before{\n\
 position: absolute; display: inline-block;\n\
 cursor: pointer;\n\
 text-align:center; vertical-align: top;\n\
 width: 18px;   height: 14px;\n\
 line-height: 14px;\n\
 padding:0; margin:0;\n\
 border-color: transparent;\n\
 border-width: 0;\n\
 content: "";\n\
 opacity: .2;\n\
 z-index: 99;\
}\n\
.fsort-butt.fsort-asc:before,.fsort-butt.fsort-desc:before{\n\
 left:1.5em; top: -1em;\n\
}\n\
td.age .fsort-butt.fsort-asc:before, td.age .fsort-butt.fsort-desc:before{\n\
 left: 4.5em; \n\
}\n\
.fsort-asc:before,.fsort-desc:before{\n\
 background-color: #48C;\n\
}\n\
.fsort-asc:before{\n\
 border-radius: 24px 24px 8px 8px;\n\
}\n\
.fsort-desc:before{\n\
 border-radius: 8px 8px 24px 24px;\n\
}\n\
.fsort-asc:before,\n\
.fsort-desc.fsort-sel:hover:before\n\
{\n\
content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAqklEQVR42mNgQAIfPnzg//fv3z4g3vjs2TNOBmzg27dv0kAFl/5DAZB95OPHj4Ioin79+qUFlHj0Hw0Axa5+//5dFqzo58+fGkCB9/9xAKDcw69fv0ow/P37twAqAAJLkRQsgLGBapIZQO4ACk798+eP9+/fv21gkkArZYAKYoFy09++fcuL4lZ0hQy4wMAqtIQpBEaAFE6FL1684AL6chcQb1m1ahUTshwAw2kAJAeNI30AAAAASUVORK5CYII=);\n\
}\n\
.fsort-desc:before,\n\
.fsort-asc.fsort-sel:hover:before{content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAApUlEQVR42mNgQAKrVq1i+vfv3xYg3vXixQsuBlzg27dvUv+h4Pfv35Y4FX7//l0GSaHNYFH49u1bXqAvp//9+zcWXeGfP3+8gXJTP378KMgAVJAMkwQKLkBiLwXifyA2UE0Bw9evXyWA/If/cQCg3PufP39qwNwmCxS4ikXRo1+/fmmhuBXkDqDEESRFl4ARII3V18+ePeMEKtgIxPs+fPjAjywHANCcACRZ1c8XAAAAAElFTkSuQmCC);\n\
}\n\
\n\
.fsort-butt.fsort-sel:before\n\
{\n\
  background-color: #4183C4 !important;\n\
  opacity:.6 !important;\n\
}\n\
\n\
span.fsort-butt:hover:before\n\
,span.fsort-butt:hover span:before\n\
{ opacity: 1 !important;}\n\
\n\
#fsort-clock:before{\n\
 left:6.5em; top: -15px; \n\
 text-align:center; vertical-align: top; top:-15px;\n\
 width: 16px; height: 16px;\
 border-radius: 16px;\n\
  content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAlZJREFUeNqkU0tLG1EUvjORFJPMw6mhTUgxy75EUxiJj6CGLKQV0o2IQd3pxp2bbPs/3MVCIHSRgC3uXBhCSErjtLRkK7TcNCYhk4eGPHvO6AwjXXrgu/fOOff77plzz2VGoxF5iI3hEA6HCcuyxGKxEIZhOMBLcHsAwt0+FfAbDvsFaA4GAzIcDkkqlboVMNlzB8+vzgUCq3N+v+xyOl3opFdXNJfN5nPn52dNVT0DV/FeBjpZcjrfR/b3Dzwul0e02ciPiwsyPTtLptxur7C25n0xMzMfPzoSypQmdREWB0iLt3NcKLK3dzAhSR5+fFxT/JbPG+row9g2HABZhpBjCMA/vZYDgRVOFD02q5WwDKOROp2OIYA+jDlgz8Ly8gpyDIF+v++d9vlkXDdubshlpaKhWCwaawTGsHg+WZaRY9QAPiYEUXyinzY1OanNzWbTWGv7gPynViO4FzlmARavcWgivw2FSDAYJDubm4TjOA0Oh4O8WVwk80tLGscsoLZUtWwThGf6afFEgmxvbZGP8biRAbac2u2S60ajjByjBr1e7/JrJqOMQSNhmmiCJGlknHVAAckjuI1cOq0gx3wLyudkMt1ttejgTkAXMRsWkO106KdEIo0cQwAC9b+l0umHaPRYrVaphWX/63n0XasqjR4eHlNKT5FzrxPBoXxXFEtkY6Ozs7u78G59/dVTt/sxdkSJ0uqXk5OfsVgsU6lUUjzPKzqPwdfo8/lIF4pTr9dJu92WID0/tjZAv8MKti48tqzdbq+JUAsrNFWhULgVeIj9E2AAamUckFr2UCoAAAAASUVORK5CYII=\n\
);}\n\
.fsort-on:before{ background-color: #4183C4 !important; } \n\
#fsort-ext:before{\n\
 left:4em; top:-14px;\n\
 width:28px; height: 14px;\n\
 border-radius: 6px;\n\
content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAANCAYAAAC3mX7tAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWUlEQVQ4y+2SP0sDQRDFT7BQTGtnITYSK8Emha1NCrXwC4gWYiUKiiB4jYKdWAmC4AewtxEExSqVjZ1/OEgwrEQwkLvbmd/aTCBI0IBYCD7YYmaYfW/mTRT9VWRZNq6qm79OBBwBrueGPM8ngWvgHbgXkQX7aC+EEFR1x+IDi7dUdQOQYACuviSp1+tDQA2oquoycAlInucT1Wp1EHgA3r3300AG3FUqlX4RKQOvQFNVV0Rk9ksiEZkzRbtJkgx476faqq1etnoK4L0vdazuqefVqepq6ALgKIqiKI7jPuDRcpVPHn1P5JwrxHHc1zHRofe+1H5pmo6akCWrv4QQgojMdxA9AI3vzPfAsXOuACRAXVW3VXUNOM2yrNhsNofNh1qapmPAG5A45wpGdGMiToD9bvdftKZ9I54ALoCGXd5tq9UaAc7Mr0Wbbr09vfk3Azybf+fRP36KDxJ2sN2uMATcAAAAAElFTkSuQmCC);\n\
}\n\
#fsort-ext:before{ background-color: #BBB}\n\
/* 150806 uppercase */\n\
#fsort-upc:before{\n\
 left:7em; top:-14px;\n\
 width:16px; height: 16px;\n\
 border-radius: 0 4px 0 4px;\n\
content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAABcElEQVQ4y5WSsWoVQRSG/7kbyL1VCosgeQBBbFIYtBCsLYOx1QewiZgqr5HOF5ALRlALbcUigsK1TOUWooUaEbOL2d3z/TaTsOBduPeHYQ4zZ77555yRJEXEDnAE/AZ+As/qur6sBbSS50uS1iQ9lbSZUtoej8eWdHcRiKbT6eg8bprmqm0D37Souq7bBt4BP4AuA04XOtw0zTUggLOIeBgR95YBjIqi2EwpjSTNiqI4sP1dy6ht21v5xjPgCfAZaPoOImLfWRGx/x8EOAD+AF8j4gFw2AcAx8DfPI6XdXgzO3wNvLHttm1vXNRAkmzfGQIURXE/57ywfdhfu5Dt57av59i2b0tSWZarwC+Auq43qqpazx07KctytQ+4Yvuj7c52advnXzzbP+rV420u5s5cy30HwCsPCHgpSWno7VVVrU8mky8ppRXb73tbKaW0Zbur63pjsPoR8Sjf9GFO22f5GbuDAOBTTno8B76X4bN/RgN/lIzFNCAAAAAASUVORK5CYII=);\n\
}\n\
#fsort-upc:before{ background-color: #BBB}\n\
\n\
table.files td.age .css-truncate.css-truncate-target{\n\
 width: 99% !important; \n\
 max-width: none !important;\n\
}\n\
/*table.files td.age span.css-truncate time{\n\
 position: relative !important;\n\
}*/\n\
.fsort-time {\n\
 visibility: hidden;\n\
 display: none;\n\
 padding-right: 0px;\n\
}\n\
.fsort-time i {\n\
 display:inline-block;\
 color: #BBB;\
 font-style: normal !important;\n\
 transform:  scale(0.9);\n\
 margin-left: 0px;\n\
/* font-size: 12px;*/\n\
}\n\
\n\
/* patches (--min-width:12em!important;) */\n\
table.files td.age {text-align: right !important; padding-right: 4px !important;\n\
width:12em!important;\n\
\n\
max-width:none!important;\n\
overflow:visible!important;\n\
}\n\
table.files td.message {overflow: visible !important;}\n\
/*.file-wrap .include-fragment-error { display: table-row !important;}*/\n\
/* 150315 wide filelist *150426 better not touch this* /\n\
div.wrapper div.container{\n\
min-width: 980px!important;\n\
width:90%!important;}\n\
div.wrapper div#js-repo-pjax-container{\n\
min-width: 790px!important;\n\
width: calc(100% - 200px)!important;\n\
}/* */\n\
td.icon .octicon {height: 16px; width: 16px;}\
\
');

dtStyle=stickStyle('\
td.age  span.css-truncate time-ago{\
 visibility: hidden !important;\
 display: none !important;\
}\
td.age  span.css-truncate .fsort-time {\
 visibility: visible !important;\
 display: inline !important;\
}\
')
}

function setC(n){
 for(var i=0,il=C.length; i<il; i++ ){
  if(i!=n) C[i].s= 0, C[i].d=d0[i];
  else C[i].s=1;
  oa[i].className='fsort-butt fsort-'+(C[i].d?'desc':'asc')+(C[i].s?' fsort-sel':'') ;
  //oa[i].title=C[i].d? '\u21ca' : '\u21c8';
 }
}

function dd(s)
{ s=s.toString(); if(s.length<2)return'0'+s; return s}
function d2s(n){
 var hs=dd(n.getHours())+':'+dd(n.getMinutes());
 return {  
   d: n.getFullYear()+'-'+dd(n.getMonth()+1)+'-'+dd(n.getDate())+'<i>'+ hs+'</i>',
   t: hs+':'+dd(n.getSeconds())
 }
}

var xmatch=/(.*)\.(.*)$/;
function filext(x){
 var m= x.match(xmatch);
 if(!m || !m[2]) return "EmptyExt";
 return m[2].toLowerCase();
}
function setIcon(tr){
  var xt,xs,xn,xi,tc,tn,ti;
   //ti=tr.querySelector('td.icon > .octicon-file-text');
   ti=tr.querySelector('td.icon > .octicon-file');
  if(!ti) return;
  tc=tr.querySelector('td.content > span.css-truncate');
  if(!tc) return;
  tc=tc.textContent;
  if(!tc) return;
  xt=filext(tc);
  if(!xt) return;
  xn=extList[xt];
  if(typeof xn === "undefined") return;
  xi=extIcon[xn]; 
  if(!svgList[xi]) return;
  tn=svgUsed[xn];
  if(!tn){
   tn=document.createElement('span');
   tn.innerHTML=svgList[xi];
   tn=tn.childNodes[0];
//   tn.className='octicon octicon-'+xi;
//    console.log('XI:',xi,svgList[xi]);
   svgUsed[xn]=tn;
  }else{
   tn=tn.cloneNode(true);
  }
  ti.parentNode.replaceChild(tn, ti);
  //_l('setIcon '+xt);
}

function setDateTime(x){
 var dt,dtm,dta,dtd,tc,m,now,t;
 var DT=D.querySelectorAll('td.age span.css-truncate time-ago');
 _l('sDT',(x?'refresh':'create')+' # '+DT.length);
 try{
  now = new Date();
 for(var dl=DT.length, i=0; i<dl; i++){
  dta=DT[i].getAttribute('datetime');
  dtd=new Date(dta);
  dt= d2s(dtd); // 2014-07-24T17:06:11Z
  dtm=null;
  if(x){
   dtm=DT[i].parentNode.querySelector('.fsort-time');
  }
  if(!dtm){
   dtm=D.createElement('span');
   dtm.className='fsort-time';
   x=0;
  }
  if(!x || !dtm.title || dtm.title != DT[i].title)
  { dtm.title= DT[i].title;
    t= dt.d;
    if( (now.getTime() -  dtd.getTime() < 12*3600*1000) ||
        ((now.getTime() -  dtd.getTime() < 24*3600*1000) &&
         (now.getDate() == dtd.getDate()) )
      )  t=dt.t;
    dtm.innerHTML=t;
  }
  if(!x) insAfter(dtm,DT[i]);
  if(!x)
    setIcon(outerNode(DT[i],'TR'));
 }
 }catch(e){(console.log(e+'\n*GHSFL* wrong datetime'+x))}
}

function isDir(x){
 var c= TB.rows[x].cells[0].querySelector(".octicon"); //<svg> now!!!11
 try{
 c=c.getAttribute('class');
 if(c.indexOf("-directory")>0) return 0;
 if(c.indexOf("octicon-")>0) return -1;
 } catch(e){ console.log(c,'n',e)};
 return 1;
}
function getCell(r,c,s,p){
 var rc=TB.rows[r].cells[c],q=null;
 if(typeof rc == "undefined") {
 _l('r:',r,'c:',c,'- ???' );
 }else
   q=rc.querySelector(s);
 if(q) q= p? q.getAttribute(p): q.textContent;
 if(q) return q;
 return "";
}
var sDir,sCells,sExts;
 var fa=[
  function(a){
   var r=getCell(a,1,'span.css-truncate-target a');
   return prefs.upc? r.toUpperCase(): r;
  },
  function(a){
   var r= getCell(a,2,'span.css-truncate');
   r=r.replace(/\s+/,' ').replace(/^\s|\s$/,'');
   return prefs.upc? r.toUpperCase(): r;
  },
  function(a){
   var c = getCell(a,3,'span.css-truncate>time-ago','datetime');
   if(c) return c;
   return "2099-12-31T23:59:59Z"
  }
 ]

var b9='\x20\x20\x20'; b9+=b9+b9;
function pad9(s){
 if(s.length<9) return (s+b9).substr(0,9);
 return s;
}
function sort_p(n){// prepare data for sorting
 sDir=[],sCells=[];
 for(var tl=TB.rows.length, a=0; a<tl; a++) 
   sDir.push(isDir(a));
 if( n === 0 && prefs.ext ){
  for( a=0; a<tl; a++){ // f.x -> x.f
   var x=fa[n](a),
   m= x.match(/(.*)(\..*)$/);
   if(!m || !m[2]) m=['',x,''];
   x=pad9(m[2])+' '+m[1];
   sCells.push(x);
  }
 }else{
   for( a=0; a<tl; a++) sCells.push(fa[n](a));
 }
}

function sort_fn(a,b){ 
 var x=sDir[a], y=sDir[b];
 if(x!=y) return ((x<y)? 1: -1);
 x= sCells[a], y= sCells[b];
 return x==y? 0: (((x>y)^ASC)<<1)-1;
}

var CNn={content: 0, message: 1, age: 2}

function oClr(){
 var o= catcher.querySelectorAll('.fsort-butt,.fsort-time')
 for(var ol=o.length,i=0;i<ol;i++)
  o[i] && o[i].parentNode.removeChild(o[i]);
}
//
function extclassName(){
  ext.className='fsort-butt'+ (prefs.ext? ' fsort-on': '' );
}
function clockclassName(){
  clock.className='fsort-butt'+ (prefs.dtStyle? '': ' fsort-on');
}
function upcclassName(){
  upc.className='fsort-butt'+ (prefs.upc? ' fsort-on': '' );
}
//
function doSort(t){
 TB=outerNode(t,'TBODY');
 if(!TB){  _l( "*GHSFL* TBODY not found"); return; }
 var n = CNn[t.parentNode.className];
 if(typeof n=="undefined") n= CNn[t.parentNode.parentNode.className];
 if(typeof n=="undefined"){  _l( "*GHSFL* undefined col"); return; }
 
 if(t.id=='fsort-clock'){
   dtStyle.disabled = (prefs.dtStyle ^= 1);
   savePrefs();
   clockclassName();
   return;
 }
 if (t.id=='fsort-ext'){
  if(C[n].s) prefs.ext ^= 1; 
  else prefs.ext= 1;
  savePrefs();
  extclassName();
  C[n].d^=C[n].s; // don't toggle dir on ext.click
 }else 
 if (t.id=='fsort-upc'){
  if(C[n].s) prefs.upc ^= 1; 
  else prefs.upc= 1;
  savePrefs();
  upcclassName();
  C[n].d^=C[n].s; // don't toggle case on upc.click
 }
 var tb=[],ix=[], i, tl,ti,tx;
 _l('n:'+n);
 tl=TB.rows.length;
 ASC=C[n].d^=C[n].s;
 for( i=0; i<tl; i++)
  ix.push(i);
 oClr();
              //var ms=new Date();
 sort_p(n);
 ix.sort(sort_fn);
 for( i=0; i<tl; i++) 
   tb.push(TB.rows[ix[i]]);
 for( i=tl-1; i>=0; i--)
   TB.removeChild(TB.rows[i]);
 for( i=0; i<tl; i++) 
   TB.appendChild(tb[i]);
              //ms=(new Date())-ms;
              //console.info('sorted by '+ms+'ms');
  setC(n);
 gitDir(0);
}

function onClik(e){doSort(e.target)}

function gitDir(x){
 if(x && document.querySelector('.fsort-butt')) {
  _l('gitDir'+x+ '- already'); return;
 }
 _l('gitDir',x?'create':'refresh')
 var c,o;
 ca=[];
 c= D.querySelector('.file-wrap table.files td.content >span');
 if(!c){ _l( '*GHSFL* no content') ; return; }
 ca.push(c);
 c=D.querySelector('.file-wrap table.files td.message >span');
 if(!c){ _l( '*GHSFL* no messages'); return; }
 ca.push(c);
 c=D.querySelector('.file-wrap table.files td.age >span');
 if(!c){_l( '*GHSFL* no ages'); return; }
 ca.push(c);
 if(x){  oClr(); oa=[];
  o=D.createElement('span'); 
  o.textContent=''; 
  oa.push(o);
  o=o.cloneNode(true); 
  oa.push(o);
  o=o.cloneNode(true); 
  oa.push(o);
  clock=D.createElement('span');
  clock.id='fsort-clock'; clockclassName();
  ext=D.createElement('span');
  ext.id='fsort-ext'; extclassName();
  upc=D.createElement('span');
  upc.id='fsort-upc'; upcclassName();
  setDateTime(); 
  setC(-1);
 }
  o=insBefore(oa[0],ca[0]);
  o.appendChild(upc);
  o.appendChild(ext);
  insBefore(oa[1],ca[1]);
  o=insBefore(oa[2],ca[2]);
  o.appendChild(clock);
}


catcher= D.querySelector('#js-repo-pjax-container');
if(!catcher){  _l( "*GHSFL* err0r"); return; }

catcher.addEventListener('mousedown',function(e){
if(e.target.nodeName && e.target.nodeName=='SPAN' &&
   e.target.className.indexOf('fsort-butt')>-1)
 { onClik(e); }
}
,false);

_l('startup()');

try {
  locStor = W.localStorage;
  tt=locStor.getItem("GHSFL");
} catch(e){ locStor =null}

if(locStor && tt) try{
 var pa =JSON.parse(tt); 
 for (var a in pa) prefs[a]=pa[a];
// _l('prefs:'+JSON.stringify(prefs));
}catch(e){ console.log(e+"\n*GHSFL* bad prefs") }

css();
dtStyle.disabled=(prefs.dtStyle===1);

gitDir(1);
var target = catcher; //document.body; //D.querSelector('.file-wrap');
var  MO = window.MutationObserver;
if(!MO) MO= window.WebKitMutationObserver;
if(!MO) return;
var __started=0;
var mII=0,mI=0;;
var  observer = new MO(function(mutations) {
  var t=mutations[0].target;
//mI++; _l('mut'+mI+'.'+mutations[0].target.nodeName);
 var fc=document.getElementById('fsort-clock')
 if(!fc){
         gitDir(1);
          __started=1;
 return; }
 if(!fc.parentNode.parentNode.querySelector('.fsort-time')){
      setDateTime(1); 
 return;}
});
// D.body
observer.observe(catcher, { attributes: true, childList: true, subtree: true } );
/* attributes: true , childList: true, subtree: true,  
  characterData: true,  attributeOldValue:true,  characterDataOldValue:true
*/

})()};
