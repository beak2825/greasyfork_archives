// ==UserScript==
// @name          LargeBooru
// @namespace     largebooru
// @version       1.25
// @description   Increases the thumbnail size for Danbooru
// @run-at        document-end
// @include       http://*.donmai.us/*
// @include       https://*.donmai.us/*
// @exclude       http://*.donmai.us/data/*
// @exclude       https://*.donmai.us/data/*
// @downloadURL https://update.greasyfork.org/scripts/6718/LargeBooru.user.js
// @updateURL https://update.greasyfork.org/scripts/6718/LargeBooru.meta.js
// ==/UserScript==

//----User defined variables----
var dimensions = 300;
var gap = 10;
var loadGIFs = true;
var loadVideos = true;
var loadOriginals = false; //Not recommended, will take a LONG time to load.
var fadeIn = true; //If true, samples will only appear once loaded.
//------------------------------

var gifValue = "-large-"; if (!loadGIFs) gifValue = "-preview-";
var videosValue = "-large-"; if (!loadVideos) videosValue = "-preview-";
var origValue = "-large-"; if (loadOriginals) origValue="-";

var exts = ["mp4","webm","zip","jpeg","jpg","png","gif","swf","1","avi","bmp","html","mp3","mpg","pdf","rar","wmv"];
//The ones after swf are just to prevent the script from crashing. You'll never encounter them unless you go out of your way to.
var toGrab = [videosValue,videosValue,videosValue,origValue,origValue,origValue,gifValue,"-preview-","-preview-","-preview-","-preview-","-preview-","-preview-","-preview-","-preview-","-preview-","-preview-"];

var db = dimensions + gap + "px !important; ";
var d = dimensions + "px";
var posts = document.getElementsByClassName("post-preview");
var imgs = document.querySelectorAll("[itemprop='thumbnailUrl']");
var newElems = [];
var queue = [];
var endpoint = posts.length;
var counter = 0;
var clamp = 0;
var abort = 0;
var testing = 0;

$(document).ready (function() {
    for (var x = 0; x < endpoint; x++) {
        var Data = posts[x];
        var Image = imgs[x];
        var ext = Data.getAttribute("data-file-ext");
        var width = Data.getAttribute("data-width");
        var height = Data.getAttribute("data-height");
        var denom = Math.max(width, height) / dimensions;
        var newwidth = Math.round(width / denom);
        var newheight = Math.round(height / denom);
        Image.style.width = newwidth + "px";
        Image.style.height = newheight + "px";
        Image.style.maxHeight = d;
        Image.style.maxWidth = d;
        Data.setAttribute("style", Data.getAttribute("style") + 
            "; margin: 0 !imporant; height: " + db + "width: " + db + "line-height: " + db);
        if (ext != "webm" && ext != "mp4" && ext != "zip") {
            var NewImage = document.createElement("img");
            NewImage.setAttribute("height",height);
            NewImage.setAttribute("width",width);
            NewImage.setAttribute("title",Image.getAttribute("title"));
            NewImage.style.height = newheight + "px";
            NewImage.style.width = newwidth + "px";
            NewImage.style.maxHeight = d;
            NewImage.style.maxWidth = d;
            NewImage.style.position = "absolute";
            if (fadeIn) NewImage.style.opacity = 0.0;
            Image.parentNode.insertBefore(NewImage, Image);
            newElems.push(NewImage);
        } else {
            var Video = document.createElement("video");    
            Video.setAttribute("autoplay","autoplay");
            Video.setAttribute("loop","loop");
            Video.volume = 0.0;
            Video.setAttribute("height",height);
            Video.setAttribute("width",width);
            Video.setAttribute("title",Image.getAttribute("title"));
            Video.style.height = newheight + "px";
            Video.style.width = newwidth + "px";
            Video.style.maxHeight = d;
            Video.style.maxWidth = d;
            Video.style.position = "absolute";
            Video.style.marginTop = "2px"; //I don't know why these are needed
            Video.style.marginLeft = "2px";
            if (fadeIn) Video.style.opacity = 0.0;
            Image.parentNode.insertBefore(Video, Image);
            newElems.push(Video);
        }
    }
    Array.prototype.forEach.call(imgs, function(img) {img.onload = queueIt(img)}); //How CPU intensive is this?
});

function getDistanceFromCenter(elemIndex) {
    var element = newElems[elemIndex];
    var yPosElem = Math.ceil(element.height/2);
    while(element) {
        yPosElem += (element.offsetTop);
        element = element.offsetParent;
    }
    var yPosWin = Math.ceil(window.innerHeight/2+window.scrollY);
    var blPlus = 0;
    if (posts[elemIndex].classList.contains("blacklisted-active")) blPlus += 262144; //blacklisted items load last
    if (exts.indexOf(posts[elemIndex].getAttribute("data-file-ext")) < 3) blPlus += 262144; //so do videos
    return Math.abs(yPosElem-yPosWin+blPlus);
}

function queueIt(img) {
    var imgindex = Array.prototype.indexOf.call(imgs, img);
    queue.push(imgindex);
    queueIfReady();
}

function queueIfReady() {
    if (queue.length > 0 && clamp < 4) { //Because of recently imposed limits, setting maximum downloads at a time to 4
        var closest = 0;
        var dist = 1048576;
        for (var x = 0; x < queue.length; x++) {
            var xDist = getDistanceFromCenter(queue[x]);
            if (xDist < dist) {
                closest = x;
                dist = xDist;
            }
        }
        if (!(dist > window.innerHeight*1.0 && clamp >= 1)) { //Lazyload of sorts
            var index = queue[closest];
            clamp++;
            timeforbig(index);
            queue.splice(closest, 1);
        }
    };
}

var relapse = setInterval(function(){queueIfReady()},400); //Lighter on the CPU than monitoring for scrolling

function timeforbig(x) {
    var Data = posts[x];
    var Elem = newElems[x];
    var extIndex = exts.indexOf(Data.getAttribute("data-file-ext"));
    Elem.setAttribute("src",Data.getAttribute("data" + toGrab[extIndex] + "file-url"));
    Elem.onerror = function () {
        if (abort < 40) {
            counter--;
            abort++; //If it has to reload too many times, it'll stop trying
            Elem.removeAttribute("src");
            setTimeout(function (){timeforbig(x)},300 * abort); //If it fails, try again, getting longer after each try
        }
    };
    if (extIndex > 2 || !videosValue) {Elem.onload = function () {reverseClamp(x)};}
    else {Elem.addEventListener("loadeddata", function () {reverseClamp(x);})};
    counter++;
    if (counter >= endpoint) {clearInterval(relapse); relapse = 0;};
}

function reverseClamp(x) {
    clamp--;
    queueIfReady();
    if (fadeIn) {
        var newElem = newElems[x];
        setTimeout(function(){newElem.style.opacity=0.1},40) //setInterval was being uncooperative
        setTimeout(function(){newElem.style.opacity=0.2},80)
        setTimeout(function(){newElem.style.opacity=0.3},120)
        setTimeout(function(){newElem.style.opacity=0.4},160)
        setTimeout(function(){newElem.style.opacity=0.5},200)
        setTimeout(function(){newElem.style.opacity=0.6},240)
        setTimeout(function(){newElem.style.opacity=0.7},280)
        setTimeout(function(){newElem.style.opacity=0.8},320)
        setTimeout(function(){newElem.style.opacity=0.9},360)
        setTimeout(function(){newElem.style.opacity=1.0},400)
    }
}
