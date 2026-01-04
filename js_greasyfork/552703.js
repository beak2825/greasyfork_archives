// ==UserScript==
// @name         Tab Hospital Timer
// @license      MIT
// @namespace    https://www.torn.com/
// @version      v2.5
// @description  Displays hospital timers on tab title.
// @author       AngryGod
// @match        https://www.torn.com/profiles.php?XID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552703/Tab%20Hospital%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/552703/Tab%20Hospital%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElementMutation(selector, callback) {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const element = document.querySelector(selector);
                    if (element) {
                        callback(element);
                        observer.disconnect(); // Stop observing once the element is found
                        return;
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

    };
    function secondsTimeSpanToHMS(s) {
        var h = Math.floor(s / 3600); //Get whole hours
        s -= h * 3600;
        var m = Math.floor(s / 60); //Get remaining minutes
        s -= m * 60;
        return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
    };

    /* function ServertimeMs(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
        return totalSeconds * 1000;
    };
    function getservertime(servertimeclass){
        //const datetimeString = servertimeclass.text();
        //const time = datetimeString.split(' ')[1];
        //return ServertimeMs(time);
        return performance.now();
    };*/

    function convertHmsToSeconds(timeString) {
        // Use a regular expression to extract hours, minutes, and seconds
        // The expression looks for one or more digits followed by 'h', 'm', or 's'
        const h = timeString.match(/(\d+)h/);
        const m = timeString.match(/(\d+)m/);
        const s = timeString.match(/(\d+)s/);

        // Initialize total seconds
        let totalSeconds = 0;

        // Convert hours to seconds if found
        if (h) {
            totalSeconds += parseInt(h[1]) * 60 * 60;
        }

        // Convert minutes to seconds if found
        if (m) {
            totalSeconds += parseInt(m[1]) * 60;
        }

        // Add seconds if found
        if (s) {
            totalSeconds += parseInt(s[1]);
        }
        return totalSeconds;
    };
    $.fn.redraw = function() {
        $(this).each(function() {
            var redraw = this.offsetHeight; // Accessing offsetHeight forces a repaint
        });
    };
    function HospitalTimeMs(){
      //  $(".profile-container").redraw();//v1.2 forces redraw so it can recalculate hospital timer if they med out.
        var Hospitaltext = $('.main-desc').text();
        var removetext = 'In hospital for  ';
        var shortenhours = Hospitaltext.replace("hours", "h");
        shortenhours = shortenhours.replace("hour","h");
        var shortenmins = shortenhours.replace("minutes", "m");
        shortenmins = shortenmins.replace("minute","m");
        var shortensecs = shortenmins.replace("seconds", "s");
        var removeand = shortensecs.replace("and", "");
        var removewhitespace = removeand.replace('   ','');
        var Hospitalshorttext = removewhitespace.replace(removetext, "");
        var HSTNowhiteSpace = Hospitalshorttext.replace(new RegExp(' ', 'g'), '');
        var timeString = HSTNowhiteSpace;
        return convertHmsToSeconds(timeString)*1000;
    };
    /* function accurateCountdown(durationInMs,Stime, callback) {
        const endTime = getservertime(Stime) + durationInMs;
        const starttime = getservertime(Stime);

        function tick() {
            const remaining = endTime - getservertime(Stime);

            if (starttime > getservertime(Stime)) { //might cause problems later comment for later.
                //console.log(starttime+' '+getservertime(Stime));
                console.log('Server time Reset Re-load tab');
                callback(0);
                return;
            };


            if (remaining <= 0 || (HospitalTimeMs() === 0)) { //v1.2 added if med out.
                callback(0); // Timer is complete
                return;
            };

            callback(remaining);
            const nextTickDelay = 1000 - (remaining % 1000); // Adjust delay to land near the next second
            setTimeout(tick, nextTickDelay);
        }

        tick();
    };*/
    /*function createAndStartSilentAudio() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!window.AudioContext) {
            console.log('Web Audio API not supported. Throttling may occur.');
            return;
        }

        try {
            const context = new AudioContext();
            const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.loop = true;
            source.connect(context.destination);

            if (context.state === 'suspended') {
                context.resume().then(() => {
                    console.log('AudioContext unlocked and resumed.');
                    source.start(0);
                });
            } else {
                source.start(0);
            }
            console.log('Silent audio started.');
        } catch (e) {
            console.error('Error creating silent audio:', e);
        }
    };*/

    $(document).ready(function() {

        waitForElementMutation('.profile-container', function(element) {
            if ($(".hospital")[0]){
                var pageTitle = $(document).attr('title');
                var removeT = pageTitle.replace(' | Torn','');
                var Servertime = $('.server-date-time');
                var Timerchanged = HospitalTimeMs();
                const checkCondition = setInterval(() => {
                    if (HospitalTimeMs() < Timerchanged)  {
                        console.log("Time changed proceeding with timer");
                        clearInterval(checkCondition);
                        var hospitalins = HospitalTimeMs()/1000;

                        /* var newButton = '<button style="color:whitesmoke;background-color:#333;cursor: pointer; " id="playSilentAudioButton">Play Silent Audio to prevent throttling</button>';
                        $('.description').append(newButton);
                        $('#playSilentAudioButton').on('click', function() {
                            createAndStartSilentAudio();
                            console.log('playing silent sound');
                            $('#playSilentAudioButton').remove();
                        });*/


                        // 1. Define the worker code as a string
                        const workerCode = `

                        self.addEventListener('message', function(e) {
                        if (e.data === 'run the timer') {
                        const tickInterval = 1000; // 1000 milliseconds
                        let expectedTick = performance.now() + tickInterval;

                      function accurateTick() {
                      // Calculate the drift
                      const drift = performance.now() - expectedTick;

                       // Post the message to the main thread
                      self.postMessage('tick');

                      // Schedule the next tick, adjusting for any drift
                      expectedTick += tickInterval;
                     setTimeout(accurateTick, Math.max(0, tickInterval - drift));
                     };

                     // Start the first tick
                    setTimeout(accurateTick, tickInterval);
                    }
                    });

                      `;

                        // 2. Create a Blob from the worker code
                        const blob = new Blob([workerCode], { type: 'application/javascript' });

                        // 3. Create a Blob URL for the worker
                        const workerUrl = URL.createObjectURL(blob);

                        // 4. Create a new Worker instance using the Blob URL
                        const myWorker = new Worker(workerUrl);

                        // 5. Listen for messages from the worker
                        myWorker.addEventListener('message', function(e) {
                            if (e.data === 'tick') {
                                var Changeontick = hospitalins--;
                                //console.log('Timer ticked in the main thread!');
                                document.title = secondsTimeSpanToHMS(Changeontick)+" "+ removeT;
                                if(HospitalTimeMs()/1000 === 0 || Changeontick === 0){
                                    myWorker.terminate();
                                    document.title = '0:00:00 '+removeT;
                                    console.log('Worker has been terminated.');
                                    URL.revokeObjectURL(workerUrl);
                                };
                            }
                        });

                        myWorker.postMessage('run the timer');
                        window.onbeforeunload = function() {
                            myWorker.terminate();
                            console.log('Worker terminated due to page unload/refresh.');
                            URL.revokeObjectURL(workerUrl);
                        };

                        /* accurateCountdown(HospitalTimeMs()-1000, Servertime,(remainingTime) => {
                            const seconds = Math.ceil(remainingTime / 1000);
                            document.title = secondsTimeSpanToHMS(seconds) +" "+ removeT;
                            if (seconds === 0) {
                                console.log("Countdown finished!");
                            }
                        });*/


                    } else {
                        console.log("Waiting for time to change for a more acurate timer");
                    }
                }, 1000); // Check every 1000 milliseconds (1 second)

            } else {
                console.log('not in hospital');
            };


        });
    });
    // Your code here...
})();