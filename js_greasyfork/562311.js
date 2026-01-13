// ==UserScript==
// @name         WIRED Timer
// @version      1.0
// @description  WIRED Bot için Arka Plan Hız Sabitleyici (Web Worker)
// @author       WIRED
// @license      MIT
// ==/UserScript==

/* WIRED TIMER - PIXELPLACE ELITE
   Bu kütüphane, tarayıcı sekmesi değişse bile botun 45ms hızında 
   çalışmaya devam etmesini sağlar.
*/

(function (workerScript) {
    if (!/MSIE 10/i.test(navigator.userAgent)) {
        try {
            var blob = new Blob(["\
                var fakeIdToId = {};\
                onmessage = function (event) {\
                    var data = event.data,\
                        name = data.name,\
                        fakeId = data.fakeId,\
                        time;\
                    if(data.hasOwnProperty('time')) {\
                        time = data.time;\
                    }\
                    switch (name) {\
                        case 'setInterval':\
                            fakeIdToId[fakeId] = setInterval(function () {\
                                postMessage({fakeId: fakeId});\
                            }, time);\
                            break;\
                        case 'clearInterval':\
                            if (fakeIdToId.hasOwnProperty (fakeId)) {\
                                clearInterval(fakeIdToId[fakeId]);\
                                delete fakeIdToId[fakeId];\
                            }\
                            break;\
                        case 'setTimeout':\
                            fakeIdToId[fakeId] = setTimeout(function () {\
                                postMessage({fakeId: fakeId});\
                                if (fakeIdToId.hasOwnProperty (fakeId)) {\
                                    delete fakeIdToId[fakeId];\
                                }\
                            }, time);\
                            break;\
                        case 'clearTimeout':\
                            if (fakeIdToId.hasOwnProperty (fakeId)) {\
                                clearTimeout(fakeIdToId[fakeId]);\
                                delete fakeIdToId[fakeId];\
                            }\
                            break;\
                    }\
                }\
            "]);
            workerScript = window.URL.createObjectURL(blob);
        } catch (error) {
            /* Blob desteklenmiyorsa fallback */
        }
    }

    var worker,
        fakeIdToCallback = {},
        lastFakeId = 0,
        maxFakeId = 0x7FFFFFFF;

    if (typeof (Worker) !== 'undefined') {
        function getFakeId() {
            do {
                if (lastFakeId == maxFakeId) {
                    lastFakeId = 0;
                } else {
                    lastFakeId++;
                }
            } while (fakeIdToCallback.hasOwnProperty(lastFakeId));
            return lastFakeId;
        }

        try {
            worker = new Worker(workerScript);
            
            // Ana penceredeki zamanlayıcıları WIRED Worker'a yönlendiriyoruz
            window.setInterval = function (callback, time) {
                var fakeId = getFakeId();
                fakeIdToCallback[fakeId] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call(arguments, 2)
                };
                worker.postMessage({
                    name: 'setInterval',
                    fakeId: fakeId,
                    time: time
                });
                return fakeId;
            };

            window.clearInterval = function (fakeId) {
                if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                    delete fakeIdToCallback[fakeId];
                    worker.postMessage({
                        name: 'clearInterval',
                        fakeId: fakeId
                    });
                }
            };

            window.setTimeout = function (callback, time) {
                var fakeId = getFakeId();
                fakeIdToCallback[fakeId] = {
                    callback: callback,
                    parameters: Array.prototype.slice.call(arguments, 2),
                    isTimeout: true
                };
                worker.postMessage({
                    name: 'setTimeout',
                    fakeId: fakeId,
                    time: time
                });
                return fakeId;
            };

            window.clearTimeout = function (fakeId) {
                if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                    delete fakeIdToCallback[fakeId];
                    worker.postMessage({
                        name: 'clearTimeout',
                        fakeId: fakeId
                    });
                }
            };

            worker.onmessage = function (event) {
                var data = event.data,
                    fakeId = data.fakeId,
                    request,
                    parameters,
                    callback;
                if (fakeIdToCallback.hasOwnProperty(fakeId)) {
                    request = fakeIdToCallback[fakeId];
                    callback = request.callback;
                    parameters = request.parameters;
                    if (request.hasOwnProperty('isTimeout') && request.isTimeout) {
                        delete fakeIdToCallback[fakeId];
                    }
                }
                if (typeof (callback) === 'function') {
                    callback.apply(window, parameters);
                }
            };

        } catch (error) {
            console.error("WIRED Timer Başlatılamadı:", error);
        }
    }
})('WIREDTimerWorker.js');