// ==UserScript==
// @name         YouTube Limiter
// @version      2024-02-24
// @description  Limit YouTube usage with an unlock system (150 points = 2.5 hours per day)
// @author       Popup Games
// @match        https://www.youtube.com/*
// @icon         https://cdn0.iconfinder.com/data/icons/user-interface-2063/24/UI_Essential_icon_expanded_2-56-256.png
// @grant        none
// @namespace https://greasyfork.org/users/1511449
// @downloadURL https://update.greasyfork.org/scripts/548248/YouTube%20Limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/548248/YouTube%20Limiter.meta.js
// ==/UserScript==

/*
    A tampermonkey script to limit YouTube usage with an unlock system.

    150 points = 2.5 hours per day
    You unlock videos by spending points, where the cost is the video's duration in minutes.
    Points are reset when you go 10 hours without watching a video.
    When you're out of points you can't unlock any videos.
    When you're low on points you'll have to wait a few minutes before watching each video,
    giving you a chance to think.
    You can change the variables `startPoints` and `resetHours`.

    YouTube is full of amazing videos, but it's easy to get lost in it and waste your life.
    This script helps to make YouTube less impulsive and more intentional, where you'll make
    deliberate decisions about what to watch and when to watch it rather than mindlessly
    and endlessly watching anything.
*/

(function() {
    'use strict';

    setTimeout(tryToRun(), 500);

    function tryToRun() {
        try {
            run();
        } catch (e) {
            //Retry in 2 seconds
            setTimeout(tryToRun, 2000);
        }
    }

    function run() {
        /* Bypass CSP restrictions (introduced by the latest Chrome updates) */
        if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
            window.trustedTypes.createPolicy('default', {
                createHTML: string => string,
                createScriptURL: string => string,
                createScript: string => string
            });
        }

        console.log("Running YT Limiter");
        // Retrieve points remaining
        var startPoints = 150;
        var resetHours = 10;
        let lastVideoTime = localStorage.getItem("lastVideoTime");
        if (lastVideoTime == null || Date.now() - lastVideoTime > 10 * 60 * 60 * 1000) {
            setPointsRemaining(startPoints);
        }

        // Create div to display points remaining
        var pointsDiv = document.createElement("div");
        pointsDiv.style = "background-color: gray; color: white; margin: auto; text-align: center; left: 280px; position: absolute; font-size: medium; mix-blend-mode: difference;";
        updatePointCounter();

        var logoBox = document.getElementById("logo").parentElement;
        logoBox.appendChild(pointsDiv);

        var addButton = null;
        var modal = null;

        //On watch page
        setInterval(updatePointCounter, 60000); // Update point counter (reset timer) every minute

        var pauseInterval = null;
        var modalInterval = null;

        // Run startBlocking() everytime the page changes
        var oldHref = document.location.href;
        setInterval(function() {
            if (document.location.href !== oldHref) {
                oldHref = document.location.href;
                startBlocking();
            }
        }, 1000);

        setInterval(function() {
            if (addButton != null) {
                addButton.innerHTML = "-" + Math.round(getVideoPoints());
            }
        }, 100);

        startBlocking();

        function startBlocking() {
            setTimeout(function() {
                if (window.location.href.includes("watch?v=")) {
                    // If the video is saved, don't block it
                    if (isUnlockedVideo()) {
                        return;
                    }
                    // Constantly try to pause the video
                    if (pauseInterval != null) {
                        clearInterval(pauseInterval);
                        pauseInterval = null;
                    }
                    pauseInterval = setInterval(function() {
                        let playButton = document.getElementsByClassName("ytp-play-button")[0];
                        if (playButton.getAttribute("data-title-no-tooltip") == "Pause") {
                            playButton.click();
                        }
                        // Temporarily display play button
                        playButton.style.display = "none";
                    }, 50);


                    // "Add" button
                    if (addButton == null) {
                        addButton = document.createElement("button");
                        addButton.style = "position: absolute; left: 318px; color: red";
                        addButton.onclick = addVideo;
                        logoBox.appendChild(addButton);
                    }
                    addButton.style.display = "block";
                    addButton.innerHTML = "-" + Math.round(getVideoPoints());
                } else {
                    // Hide "Add" button
                    if (addButton != null) {
                        addButton.style.display = "none";
                    }
                }
            }, 2000);
        }

        function addVideo() {
            if (getVideoPoints() > getPointsRemaining()) {
                return;
            }

            // Remove add button
            addButton.style.display = "none";

            // Reset points if 10 hours have passed
            localStorage.setItem("lastVideoTime", Date.now());

            //Add video to saved videos in local storage
            let unlockedVideos = localStorage.getItem("unlockedVideos");
            if (unlockedVideos == null) {
                unlockedVideos = [];
            } else {
                unlockedVideos = JSON.parse(unlockedVideos);
            }
            unlockedVideos.push(window.location.href.split("&")[0].split("v=")[1]);
            localStorage.setItem("unlockedVideos", JSON.stringify(unlockedVideos));

            // Start delay based on points
            let pointsRemaining = getPointsRemaining();
            let startDelay = 0;
            if (pointsRemaining < 50) {
                startDelay = 300;
            } else if (pointsRemaining < 100) {
                startDelay = 60;
            }

            // Subtract points from total
            subtractPoints(getVideoPoints());

            if (!startDelay) {
                allowVideo();
                let playButton = document.getElementsByClassName("ytp-play-button")[0];
                playButton.click();
                return;
            }

            // Start delay
            setTimeout(allowVideo, startDelay * 1000);

            // Show page blocking modal until start delay is over
            if (modal == null) {
                modal = document.createElement("div");
                document.body.appendChild(modal);
            }
            if (startDelay > 0) {
                let displayDelay = startDelay;
                modal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: black; z-index: 1000; opacity: 0.98;";
                modal.innerHTML = "<h1 style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white;'>Loading...&nbsp;&nbsp;&nbsp;" +
                    displayDelay + "</h1>";

                if (modalInterval !== null) {
                    clearInterval(modalInterval);
                    modalInterval = null;
                }
                modalInterval = setInterval(function() {
                    displayDelay--;
                    modal.innerHTML = "<h1 style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white;'>Loading...&nbsp;&nbsp;&nbsp;" +
                        displayDelay + "</h1>";
                }, 1000);
            }
        }

        function allowVideo() {
            if (pauseInterval != null) {
                clearInterval(pauseInterval);
                pauseInterval = null;
            }
            if (modalInterval !== null) {
                clearInterval(modalInterval);
                modalInterval = null;
            }
            let playButton = document.getElementsByClassName("ytp-play-button")[0];
            playButton.style.display = "block";
            if (modal != null) {
                modal.style.display = "none";
            }
        }

        function isUnlockedVideo() {
            let unlockedVideos = localStorage.getItem("unlockedVideos");
            if (unlockedVideos == null) {
                return false;
            }
            unlockedVideos = JSON.parse(unlockedVideos);
            return unlockedVideos.includes(window.location.href.split("&")[0].split("v=")[1]);
        }

        function setPointsRemaining(points) {
            localStorage.setItem("pointsRemaining", points);
        }

        function getPointsRemaining() {
            return localStorage.getItem("pointsRemaining");
        }

        function subtractPoints(points) {
            let pointsRemaining = getPointsRemaining() - points;
            localStorage.setItem("pointsRemaining", pointsRemaining);
            updatePointCounter();
        }

        function getVideoPoints() {
            let duration = document.getElementsByClassName("ytp-time-duration")[0].innerHTML;
            let time = duration.split(":").map(Number); // [minutes, seconds] or [hours, minutes, seconds]
            if (time.length == 2) {
                return time[0] + (time[1] / 60);
            } else if (time.length == 3) {
                return (time[0] * 60) + time[1] + (time[2] / 60);
            }
            return 9999;
        }

        function updatePointCounter() {
            let pointsRemaining = getPointsRemaining();
            if (pointsRemaining > 100) {
                pointsDiv.innerHTML = Math.round(pointsRemaining);
            } else {
                pointsDiv.innerHTML = Math.round(pointsRemaining * 10) / 10;
            }
            //Set color between white and red
            pointsDiv.style.color = interpolate("#ffffff", "#ff0000", 1 - (pointsRemaining / startPoints));

            //Show the hours remaining (lastVideoTime + 10 hours - now) format 10h, 9h, 8h, etc.
            let lastVideoTime = localStorage.getItem("lastVideoTime");
            if (pointsRemaining != startPoints && lastVideoTime != null) {
                // Get hours between now and lastVideoTime
                let hours = Math.max(resetHours - (Date.now() - lastVideoTime) / 1000 / 60 / 60, 0);
                if (hours > 1) {
                    pointsDiv.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + Math.round(hours) +"h";
                } else {
                    pointsDiv.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + Math.round(hours * 60) + "m";
                }
            }
        }

        function interpolate(color1, color2, percent) {
            // Convert the hex colors to RGB values
            const r1 = parseInt(color1.substring(1, 3), 16);
            const g1 = parseInt(color1.substring(3, 5), 16);
            const b1 = parseInt(color1.substring(5, 7), 16);

            const r2 = parseInt(color2.substring(1, 3), 16);
            const g2 = parseInt(color2.substring(3, 5), 16);
            const b2 = parseInt(color2.substring(5, 7), 16);

            // Interpolate the RGB values
            const r = Math.round(r1 + (r2 - r1) * percent);
            const g = Math.round(g1 + (g2 - g1) * percent);
            const b = Math.round(b1 + (b2 - b1) * percent);

            // Convert the interpolated RGB values back to a hex color
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
    }
})();