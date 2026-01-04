// ==UserScript==
// @name ZX downloader
// @include https://*.zoox18.com/*
// @author blurry, anon from /zoo/
// @grant GM_download
// @version 10
// @description zoox18 private video viewer
// @license MIT
// @namespace https://greasyfork.org/users/1515981
// @downloadURL https://update.greasyfork.org/scripts/549762/ZX%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/549762/ZX%20downloader.meta.js
// ==/UserScript==

// private video example url:
// https://www.zoox18.com/video/149881/a

// public video example url:
// https://www.zoox18.com/video/149899/a

/*
Warning:
ZooX18 hosts some abuse content. This is against the rules, but it doesn't seem like they care to stop it.

Installation:
Requires Violentmonkey extension (or Greasemonkey/Tampermonkey). Adblocker is highly recommended.

After installing one of those, simply click the installation link (ending in "#.user.js") and then confirm the
installation.

Installation from file (Violentmonkey):
If all you have is a file and not an installation link, copy the entire script, then click the extension icon,
then the settings icon, then "+", then "New", and finally paste the script in and click "Save".

Usage:
Once installed, you'll see a "ZX downloader" section at the top of every page on ZooX18. Click "Play video by ID"
and paste in a video ID to play that video. Or, if you're on the home or search results pages, simply click any
video thumbnail to play it directly on the page.

To download a video, first start playing a video, then click the "Download this video" link. You can also try
right-clicking on the video player and selecting "save video as", though that doesn't always work.

Version 6:
* Bypasses the new daily video limit
* Simplifies things
* No longer requires an account to download videos
* Faster downloads (avoids loading the entire Cloudflare-protected video page for no reason)

Version 7:
* Direct download button should work properly now

Version 8: uses brute force method courtesty of "ZXDL" scirpt instead of hash method (rip)

Version 9: Download button works again, also detect video pages and play videos automatically
*/

console.log("[ZX] loaded");

// stolen from ZXDL
function getPaths(id) {
// Path list
var paths =[];
var base = ["https://md.zoox18.com/", "https://md1.zoox18.com/", "https://md2.zoox18.com/", "https://media.zoox18.com/", "https://media1.zoox18.com/", "https://media2.zoox18.com/"];
var keys = ["Afgf8121k", "Iu528sZA", "_asaA34343BN", "082GhjMswdfd3", "HBa23r27ALss", "Iyw9ew27KhgS", "_9121BghguS", "034343sdsA_", "0Gbg3Ga"];
for (var i = 0; i < keys.length; i++) {
var key = keys;
for (var ii = 0; ii < base.length; ii++) {
//h264 mp4 paths
paths.push(base[ii]+key+"/media/videos/h264/"+id+"_SD.mp4");
paths.push(base[ii]+key+"/media/videos/h264/"+id+"_HD.mp4");

//Iphone redundancy
//paths.push(base[ii]+key+"/media/videos/iphone/"+id+"_SD.mp4");
}
}
return paths;
}

// scan for url using a fake video element, pass it to callback if found
function scan(url, callback) {
var v = document.createElement('video');
v.addEventListener('loadeddata', function () { // If video found
v.remove(); // prevent any more data from loading
console.log('[ZX] Video found!');
console.log(url);
callback(url);
});
v.src = url;
}

// try to get video URL and pass it to callback
function getVideoURL2(id, callback) {
let paths = getPaths(id);
for (let path of paths) {
scan(path, callback);
}
}

// stolen from ZXDL
function formatBytes(a,b=2) {
if (0===a) return "0 bytes";
const c=0>b?0:b,d = Math.floor(Math.log(a) / Math.log(1024));
return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " +["bytes","KB","MB","GB"][d];
}

function dl_progress(res) {
if (res.lengthComputable === false) return;
zxddlstatus.innerText = formatBytes(res.loaded) +' / '+ formatBytes(res.total);
}

function dl_load(res) {
if (res.lengthComputable === false) return;
zxddlstatus.innerText = "Complete!";
}

function dl_error(res) {
if (res.lengthComputable === false) return;
zxddlstatus.innerText = "Oops, there was an error. Refresh page to try again";
}

function downloadVideo(url, id) {
console.log(`[ZX] downloading ${id}...`);

zxddlbtn.style.display = "none"; // hide dl btn
zxddlstatus.innerText = `Downloading ${id}...`;
zxddlstatus.style.display = null; // unhide dl status

GM_download({
url: url,
headers: {
'Referer': 'https://www.zoox18.com',
'Origin': 'https://www.zoox18.com'
},
name: id + ".mp4",
onprogress: dl_progress,
onload: dl_load,
onerror: dl_error
});
}

if (document.URL.endsWith(".mp4")) {
// we're on a raw video page, download the video as a file

document.body.innerHTML = `<a id="zxda" style="display: none" download>a</a>`;
zxda.href = document.URL;
zxda.click();
}
else {
// insert video player/downloader directly into the top of the page

let container = document.querySelector("#wrapper > .container");
let html = `
<h1>ZX downloader</h1>
<p>Click any video thumbnail to play it</p>
<p><a id="zxdidbtn" href="javascript:void(0)">Play video by URL/ID</a></p>
<p id="zxdstatus">No video playing...</p>
<p id="zxddlstatus" style="display: none">Download not started</p>
<p><a id="zxddlbtn" style="display: none" href="javascript:void(0)">Download this video</a></p>
<div>
<video style="width:768px; height: 432px;" id="zxdvideo" controls autoplay></video>
</div><br>
`;
container.insertAdjacentHTML("afterbegin", html);

function playVideo(vid) {
zxddlbtn.style.display = "none"; // hide dl btn
zxddlstatus.style.display = "none"; // hide dl status

zxdstatus.innerText = `Playing video ${vid}...`;

getVideoURL2(vid, finalUrl => {
zxdvideo.src = finalUrl;
zxddlbtn.style.display = null; // unhide dl btn
zxddlbtn.onclick = () => {
downloadVideo(finalUrl, vid);
}
});
}

zxdidbtn.onclick = () => {
let idOrUrl = prompt("Video URL or ID:");
if (idOrUrl !== null) {
let idOrUrlSplit = idOrUrl.split("/");
let vid;
if (idOrUrlSplit.length === 1) {
vid = idOrUrl;
}
else {
vid = idOrUrlSplit[4];
}
playVideo(vid);
}
};

// check if we're on a page with video links
let thumbStamps = document.querySelectorAll(".thumb-overlay > .duration");
let onVideoListPage = false;
if (thumbStamps.length > 0) { onVideoListPage = true; }

if (onVideoListPage) {
// redirect all video links to inserted player

for (let ts of thumbStamps) {
let a = ts.parentElement.parentElement;
let vid = a.href.split("/")[4];
a.setAttribute("data-vid", vid);
a.href = "#";
a.onclick = (e) => {
let ea = e.currentTarget;
let vid = ea.getAttribute("data-vid");

playVideo(vid);
};
}

// remove blur on private images

let privateVidImgs = document.querySelectorAll(".img-private");
for (let img of privateVidImgs) {
img.classList.remove("img-private");
}
let privateImgLabels = document.querySelectorAll(".label-private");
for (let label of privateImgLabels) {
label.remove();
}

let thumbImgs = document.querySelectorAll(".thumb-overlay .img-responsive");
for (let thumbImg of thumbImgs) {
thumbImg.alt = "Click to play";
}
}

// check if we're on a video page
if (document.URL.startsWith("https://www.zoox18.com/video/")) {
let videoID = document.URL.split("/")[4];

// remove existing video player if on public video page
let publicVideo = document.querySelector("#video");
if (publicVideo) { publicVideo.remove(); }

playVideo(videoID);
}
}