// ==UserScript==
// @name         Hide popular videos from youtube
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  hides youtube videos with high view counts for finding weird, interesting and random low-view videos or for productivity reasons! edit script to customise max view counts.
// @author       Bennyy_01
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558074/Hide%20popular%20videos%20from%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/558074/Hide%20popular%20videos%20from%20youtube.meta.js
// ==/UserScript==


//SETTINGS
// ---------------------------------------------------------------------------
//MainYoutube
let g_VideosFiltering = true;
let maxViews = 10000; //Change value how you like, defualt is 10k so it hides videos over 10k views

//Shorts
//let g_ShortsFiltering = true;
//let maxLikes = 1000//max likes for shorts

//remove new videos over x views, works from exponential equation: newVideoMaxViews*(maxViews/newVideoMaxViews)^(videoAge/maxMinutes)
let newVideoMaxViews = 100; //start value to remove newer videos over this view count
let maxMinutes = 1440; //max amount of minutes for newer videos with set view count to be removed, default 1440 mins = 24 hours
let static = false; //toggles if you want to apply exponential growth or not
// ---------------------------------------------------------------------------


function IsFeed()
{
    return location.pathname.startsWith("/feed") || location.pathname.startsWith("/playlist") || location.pathname.startsWith("/@");
}

//function IsShorts()
//{
 //   return location.pathname.startsWith("/shorts");
//}

function parseViewCount(text) { //this is to get the approximate number of views
    text = text.replace(/\xa0/g, " ");
    text = text.split('\n')[1] || text;
    text = text.toLowerCase();

    let multiplier = 1;
    if (text.includes("k")) {
        multiplier = 1000;
        text = text.replace("k", "");
    } else if (text.includes("m")) {
        multiplier = 1000000;
        text = text.replace("m", "");
    } else if (text.includes("b")) {
        multiplier = 1000000000;
        text = text.replace("b", "");
    }

    text = text.replace(/[^0-9.]/g, "");
    let number = parseFloat(text);
    return isNaN(number) ? 0 : number * multiplier;
}

function parseAge(text) { //gets how old the video is in minutes
    text = text.replace(/\xa0/g, " ");
    text = text.split('\n')[1] || text;
    text = text.toLowerCase()
    if (!text.includes("ago")) {
        return Infinity;
    }
    text = text.replace("ago", "").trim();

    let multiplier = 1;
    if (text.includes("second")) {
        multiplier = 1/60;
    } else if (text.includes("minute")) {
        multiplier = 1;
    } else if (text.includes("hour")) {
        multiplier = 60;
    } else if (text.includes("day")) {
        multiplier = 1440;
    } else if (text.includes("week")) {
        multiplier = 10080;
    } else if (text.includes("month")) {
        multiplier = 43200;
    } else if (text.includes("year")) {
        multiplier = 525600;
    }
    text = text.replace(/[^0-9.]/g, "");
    let number = parseFloat(text);
    return isNaN(number) ? 0 : number * multiplier;
}

function IsGOODVideo(videoViews, videoTitle, videoAge) {
    if (!videoViews || !videoTitle || !videoAge) {
        return false;
    }
    if (!videoViews.innerText || !videoAge.innerText) {
        return false;
    }
    let viewCount = parseViewCount(videoViews.innerText);
    let ageInMinutes = parseAge(videoAge.innerText);
    let calculatedMaxViews = static ? newVideoMaxViews :
    Math.min(
        newVideoMaxViews * Math.pow(maxViews/newVideoMaxViews, Math.min(ageInMinutes/maxMinutes, 1)),
        maxViews
    );
    if (viewCount > maxViews) {
        console.log("Hid video: '" + videoTitle.innerText + "' with " + videoViews.innerText + " (>" + maxViews + " views)");
        return true; // This video is removed
    }
    else if (viewCount > calculatedMaxViews) {
        console.log("Hid video: '" + videoTitle.innerText + "' with " + videoViews.innerText + " made " + ageInMinutes + " minutes ago (>" + calculatedMaxViews + " views)");
        return true;
    }
    else {
        return false;
    }
}

//function IsGOODShortVideo(videoViews)
//{
//    let text = videoViews.innerText;
//    let viewCount = parseViewCount(text);
//    if (viewCount > maxLikes) {
//        console.log("Hid short with " + text, viewCount + " (>" + maxLikes + " likes)");
//        return true;
//    }
//    else {
//    }
//}

// ---------------------------------------------------------------------------
function UpdateVideoFiltering()
{
   if (IsFeed()) { //so script doesn't trigger on playlists, subscriptions, etc
        return;
    }

    let videosList;

//    if (IsShorts())
//    {
//        if (g_ShortsFiltering)
//        {
            // skip bad shorts
//            videosList = document.getElementsByClassName("reel-video-in-sequence style-scope ytd-shorts");
//            for (let i = 0; i < videosList.length; i++)
//           {
//                if (videosList[i].getElementsByTagName("ytd-reel-video-renderer").length == 0) {
//                    continue;
//                }

//                let videoViews = videosList[i].getElementsByClassName("style-scope ytd-like-button-renderer")[0].getElementsByClassName("yt-core-attributed-string")[0];
//
//               if (IsGOODVideo(videoViews)) {
//                    document.getElementsByClassName("navigation-button style-scope ytd-shorts")[1].getElementsByClassName("yt-spec-touch-feedback-shape__fill")[0].click(); // click to next video button (is it even stable lol?)
//                }
//            }
//        }
//    }
//    else
//    {
        if (g_VideosFiltering)
        {
            //hide videos from the right side
            videosList = document.getElementsByClassName("ytd-item-section-renderer lockup");
            for (let i = 0; i < videosList.length; i++)
            {
                let videoViews = videosList[i].getElementsByClassName("yt-core-attributed-string")[2];
                let videoTitle = videosList[i].getElementsByClassName("yt-core-attributed-string")[0];
                let videoAge = videosList[i].getElementsByClassName("yt-core-attributed-string")[3];
                if (IsGOODVideo(videoViews, videoTitle, videoAge)) {
                    videosList[i].remove();
                }
            }
            //hide videos from the right side secoundary (yes theres two versions one with the tab buttons and one without)
            videosList = document.getElementsByClassName("ytd-watch-next-secondary-results-renderer lockup");
            for (let i = 0; i < videosList.length; i++)
            {
                console.log(videosList[i].getElementsByClassName("yt-core-attributed-string"))
                let videoViews = videosList[i].getElementsByClassName("yt-core-attributed-string")[2];
                let videoTitle = videosList[i].getElementsByClassName("yt-core-attributed-string")[0];
                let videoAge = videosList[i].getElementsByClassName("yt-core-attributed-string")[3];
                if (IsGOODVideo(videoViews, videoTitle, videoAge)) {
                    videosList[i].remove();
                }
            }
            //hide videos from the main page
            videosList = document.getElementsByClassName("style-scope ytd-rich-item-renderer");
            for (let i = 0; i < videosList.length; i++)
            {
                if (videosList[i].id != "content") {
                    continue;
                }

                if (videosList[i].getElementsByClassName("ytCollectionsStackHost").length) {
                    continue;
                }
                let videoViews = videosList[i].getElementsByClassName("yt-core-attributed-string")[2];
                let videoTitle = videosList[i].getElementsByClassName("yt-core-attributed-string")[0];
                let videoAge = videosList[i].getElementsByClassName("yt-core-attributed-string")[3];
                if (videoViews == undefined) {
                    continue;
                }

                if (IsGOODVideo(videoViews, videoTitle, videoAge)) {
                    videosList[i].parentElement.remove();
                }
            }
            //hide from result page
            videosList = document.getElementsByClassName("style-scope ytd-video-renderer");
            for (let i = 0; i < videosList.length; i++)
            {
                let videoViews = videosList[i].getElementsByClassName("inline-metadata-item style-scope ytd-video-meta-block")[0];
                let videoTitle = videosList[i].getElementsByClassName("yt-simple-endpoint style-scope ytd-video-renderer")[0];
                let videoAge = videosList[i].getElementsByClassName("yt-core-attributed-string")[3];
                if (videoViews == undefined) {
                    continue;
                }
                if (IsGOODVideo(videoViews, videoTitle, videoAge)) {
                    videosList[i].parentElement.remove();
                }
            }
        }
    }
//}
let observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            //Check if new video elements were added
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) { //Element node
                    if (node.matches && (
                        node.matches('ytd-video-renderer') ||
                        node.matches('ytd-compact-video-renderer') ||
                        node.matches('ytd-rich-item-renderer') ||
                        node.matches('ytd-grid-video-renderer') ||
                        node.querySelector('ytd-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer')
                    )) {
                        shouldUpdate = true;
                        break;
                    }
                }
            }
        }
    });
    if (shouldUpdate) {
        setTimeout(UpdateVideoFiltering, 100);
    }
});
//start
observer.observe(document.body, {
    childList: true,
    subtree: true
});

document.addEventListener("yt-navigate-finish", (event) => {
    setTimeout(UpdateVideoFiltering, 500);
});
window.addEventListener("message", (event) => {
//    if (!IsShorts()) {
        setTimeout(UpdateVideoFiltering, 200);
//    }
});
window.addEventListener("load", (event) => {
//    if (!IsShorts()) {
        setTimeout(UpdateVideoFiltering, 200);
//    }
});
window.addEventListener("scrollend", (event) => {
//    if (!IsShorts()) {
        setTimeout(UpdateVideoFiltering, 0);
//    }
});
window.addEventListener("click", (event) => {
//    if (!IsShorts()) {
        setTimeout(UpdateVideoFiltering, 200);
//    }
});
setInterval(() => {
//   if (!IsShorts()) {
        UpdateVideoFiltering();
//    }
}, 2000);