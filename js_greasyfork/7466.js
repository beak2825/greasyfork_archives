// ==UserScript==
// @name        Eclyspia Disarm Adblock Detector
// @description A script that bypass attempts to detect Adblock on eclyspia.com
// @namespace   athorcis
// @include     http://www.eclypsia.com/*
// @version     1.0.2
// @grant       unsafeWindow
// @require     https://greasyfork.org/scripts/7465-disarm-adblock-detectors/code/Disarm%20Adblock%20Detectors.js?version=43841
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/7466/Eclyspia%20Disarm%20Adblock%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/7466/Eclyspia%20Disarm%20Adblock%20Detector.meta.js
// ==/UserScript==
/*jslint devel: true */
/*global DAD */

DAD(function (window, utils) {
    "use strict";
    
    console.log("run Eclyspia Disarm Adblock Detector");
    
    var userID, userToken;
    
    function advertListener(data, callback) {
        callback({ status: "OK", userId: userID, userToken: userToken });
    }
    
    function proxyIOSocketOn(caller, args) {
        var type = args[0];
        
        if (type === "advert") {
            args[1] = advertListener;
        }
        
        caller(args);
    }
    
    function proxyIOConnect(caller, args) {
        var socket = caller(args);
        
        utils.createProxy(socket, "on", proxyIOSocketOn);
        
        return socket;
    }
    
    return {
        css: "#adv_tester, #webtv-728 { display: block !important; height: 1px }",

        init: function () {
            var script,
                iframeWrapper = window.jQuery(".webTvIframeWrapper");

            userID = window.userID;
            
            if (iframeWrapper.length) {
                try {
                    script =  iframeWrapper.next().next("script")[0].innerHTML;
                    userToken = utils.extractString(script, { before: "userToken" });

                    utils.createProxy(window.io, "connect", proxyIOConnect);
                } catch (exception) {
                    console.error(exception);
                }
            } else {
                console.warn("unable to find .webTvIframeWrapper");
            }
        }
    };
});
