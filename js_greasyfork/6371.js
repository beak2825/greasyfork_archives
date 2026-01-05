// ==UserScript==
// @name        Open Tweet Image
// @author      Arctosmous
// @namespace   https://www.googledrive.com/host/0B0T32ON-a3StUWZGUW9TbFZCVHM/
// @description A thrown together script to open a tweets image in a new tab.
// @include     https://twitter.com/*
// @exclude     https://twitter.com/settings/*
// @grant       none
// @version     1.1.0
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/6371/Open%20Tweet%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/6371/Open%20Tweet%20Image.meta.js
// ==/UserScript==
var OpenTweetImage;
(function (OpenTweetImage) {
    function GetOrigUrl(url) {
        if (url.indexOf(":") != url.lastIndexOf(":")) {
            url = url.substr(0, url.lastIndexOf(':'));
        }
        return url + ':orig';
    }
    var Gallery;
    (function (Gallery) {
        var lightbox = document.getElementsByClassName("Gallery-content")[0];
        var imageConainer = lightbox.getElementsByClassName("Gallery-media")[0];
        var openLink = document.createElement("a");
        openLink.id = "oti-link";
        openLink.target = "_blank";
        openLink.className = "modal-btn";
        openLink.style.position = "absolute";
        openLink.style.right = "-31px";
        openLink.style.padding = "0";
        openLink.style.height = "auto";
        openLink.style.top = "43px";
        openLink.style.color = "#fff";
        openLink.style.fontSize = "20px";
        lightbox.insertBefore(openLink, lightbox.childNodes[0]);
        var linkIcon = document.createElement("span");
        linkIcon.className = "Icon Icon--photo";
        openLink.appendChild(linkIcon);
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type == "childList") {
                    if (imageConainer.children.length !== 0) {
                        var image = imageConainer.children[0];
                        openLink.href = GetOrigUrl(image.src);
                    }
                    else {
                        openLink.href = "";
                    }
                }
            });
        });
        observer.observe(imageConainer, {
            childList: true
        });
    })(Gallery || (Gallery = {}));
    var TweetTools = (function () {
        function TweetTools(tweet) {
            this.openButton = document.createElement("a");
            var t = this;
            t.tweet = tweet;
            t.GetMedia();
            t.actionFooter = tweet.getElementsByClassName("ProfileTweet-actionList")[0];
            // First and last buttons are too wide
            var twitterActions = t.actionFooter.getElementsByClassName("ProfileTweet-action");
            var replyTwitterAction = twitterActions[0];
            var moreTwitterAction = twitterActions[twitterActions.length - 1];
            replyTwitterAction.style.width = "60px";
            moreTwitterAction.style.width = "50px";
            var openContainer = document.createElement("div");
            openContainer.className = "ProfileTweet-action oti-new_tabs";
            openContainer.appendChild(t.openButton);
            openContainer.style.width = "50px";
            t.actionFooter.appendChild(openContainer);
            t.openButton.className = "ProfileTweet-actionButton u-textUserColorHover js-actionButton js-tooltip";
            t.openButton.title = "Open All";
            if (t.downloadableMedia.length == 1) {
                t.openButton.href = t.downloadableMedia[0];
                t.openButton.target = "_blank";
            }
            else {
                t.openButton.onclick = function () {
                    t.downloadableMedia.forEach(function (mediaUrl) {
                        window.open(mediaUrl, "_blank");
                    });
                    t.mobileMedia.forEach(function (mediaUrl) {
                        window.open(mediaUrl, "_blank");
                    });
                };
            }
            var openIcon = document.createElement("span");
            openIcon.className = "Icon Icon--collections";
            t.openButton.appendChild(openIcon);
            tweet.className += " has-oti-tools";
        }
        TweetTools.prototype.GetMp4Gif = function (media) {
            var t = this;
            var iframe = media.getElementsByTagName("iframe")[0];
            var fuckingIframesPosDoesntWorkAndYourBullshit = setInterval(function () {
                if (iframe.contentWindow != null) {
                    var video = iframe.contentWindow.document.getElementsByTagName("video");
                    if (video.length > 0) {
                        t.downloadableMedia.push(video[0].src);
                        clearInterval(fuckingIframesPosDoesntWorkAndYourBullshit);
                    }
                }
                else {
                    clearInterval(fuckingIframesPosDoesntWorkAndYourBullshit);
                }
            }, 500);
        };
        TweetTools.prototype.GetMedia = function () {
            var t = this;
            var media = t.tweet.getElementsByClassName("AdaptiveMedia")[0];
            t.downloadableMedia = [];
            t.mobileMedia = [];
            var images = media.getElementsByTagName("img");
            [].forEach.call(images, function (image) {
                var origImg = GetOrigUrl(image.src);
                t.downloadableMedia.push(origImg);
            });
            if (media.classList.contains("is-generic-video")) {
                if (media.getElementsByClassName("PlayableMedia--gif").length > 0) {
                    if (media.getElementsByTagName("iframe").length > 0) {
                        t.GetMp4Gif(media);
                    }
                    else {
                        var playerContainer_1 = media.getElementsByClassName("PlayableMedia-player")[0];
                        var mediaObserver_1 = new MutationObserver(function (mutations) {
                            mutations.forEach(function (mutation) {
                                if (mutation.type == "childList" && playerContainer_1.children.length) {
                                    t.GetMp4Gif(media);
                                    mediaObserver_1.disconnect();
                                }
                            });
                        });
                        mediaObserver_1.observe(playerContainer_1, {
                            childList: true
                        });
                    }
                }
                else {
                    t.mobileMedia.push("https://mobile.twitter.com" + t.tweet.dataset["permalinkPath"]);
                }
            }
        };
        return TweetTools;
    }());
    function initTools() {
        var tweets = document.querySelectorAll(".has-cards:not(.has-oti-tools):not(.cards-forward):not([data-card2-type])");
        [].forEach.call(tweets, function (tweet) {
            new TweetTools(tweet);
        });
    }
    var timelineObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type == "childList") {
                initTools();
            }
        });
    });
    var overlayObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type == "childList") {
                var overlayContainer = document.getElementsByClassName("PermalinkOverlay-body")[0];
                if (overlayContainer.children.length !== 0) {
                    timelineObserver.disconnect();
                    initTools();
                    var overlayStreams = overlayContainer.getElementsByClassName(".stream-items");
                    [].forEach.call(overlayStreams, function (stream) {
                        timelineObserver.observe(stream, {
                            childList: true
                        });
                    });
                }
            }
        });
    });
    var bodyObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type == "attributes") {
                timelineObserver.disconnect();
                overlayObserver.disconnect();
                initTools();
                if (document.body.classList.contains("overlay-enabled")) {
                    var overlayContainer = document.getElementsByClassName("PermalinkOverlay-body")[0];
                    overlayObserver.observe(overlayContainer, {
                        childList: true
                    });
                    [].forEach.call(overlayContainer.getElementsByClassName("stream-items"), function (stream) {
                        timelineObserver.observe(stream, {
                            childList: true
                        });
                    });
                }
                else {
                    timelineObserver.observe(document.getElementById("stream-items-id"), {
                        childList: true
                    });
                }
            }
        });
    });
    function initBodyObserver() {
        bodyObserver.observe(document.body, {
            attributes: true
        });
    }
    initBodyObserver();
})(OpenTweetImage || (OpenTweetImage = {}));