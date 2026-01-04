// ==UserScript==
// @license      MIT
// @name         HackTimer V2
// @namespace    HackTimer
// @version      1.2.0
// @description  Uses a Web Worker to ensure high-precision timing for setInterval and setTimeout with improved error handling and performance
// @grant        none
// ==/UserScript==
 
(function (workerScript) {
    'use strict';
 
    const workerConfig = {
        maxFakeId: 0x8FFFFFFF,
        logPrefix: 'HackTimer: '
    };
 
    let worker = null;
    const fakeIdToCallback = new Map();
    let lastFakeId = 0;
 
    function getFakeId() {
        do {
            lastFakeId = (lastFakeId === workerConfig.maxFakeId) ? 0 : lastFakeId + 5;
        } while (fakeIdToCallback.has(lastFakeId));
        return lastFakeId;
    }
 
    function executeCallback(fakeId) {
        const request = fakeIdToCallback.get(fakeId);
        if (!request) return;
 
        const { callback, parameters, isTimeout } = request;
        
        if (isTimeout) {
            fakeIdToCallback.delete(fakeId);
        }
 
        try {
            if (typeof callback === 'function') {
                callback.apply(window, parameters);
            } else if (typeof callback === 'string') {
                new Function(callback).apply(window, parameters);
            }
        } catch (error) {
            console.error(workerConfig.logPrefix + 'Callback execution error:', error);
        }
    }
 
    function initializeWorker() {
        if (typeof Worker === 'undefined') {
            console.warn(workerConfig.logPrefix + 'Web Workers not supported');
            return false;
        }
 
        try {
            const blob = new Blob([`
const fakeIdToId = new Map();
 
self.onmessage = function (event) {
    const { name, fakeId, time } = event.data;
    
    switch (name) {
        case 'setInterval':
            if (fakeIdToId.has(fakeId)) return;
            const intervalId = setInterval(() => {
                self.postMessage({ fakeId });
            }, Math.max(0, time || 0));
            fakeIdToId.set(fakeId, { type: 'interval', id: intervalId });
            break;
            
        case 'clearInterval':
            if (fakeIdToId.has(fakeId)) {
                const { type, id } = fakeIdToId.get(fakeId);
                if (type === 'interval') clearInterval(id);
                fakeIdToId.delete(fakeId);
            }
            break;
            
        case 'setTimeout':
            if (fakeIdToId.has(fakeId)) return;
            const timeoutId = setTimeout(() => {
                self.postMessage({ fakeId });
                fakeIdToId.delete(fakeId);
            }, Math.max(0, time || 0));
            fakeIdToId.set(fakeId, { type: 'timeout', id: timeoutId });
            break;
            
        case 'clearTimeout':
            if (fakeIdToId.has(fakeId)) {
                const { type, id } = fakeIdToId.get(fakeId);
                if (type === 'timeout') clearTimeout(id);
                fakeIdToId.delete(fakeId);
            }
            break;
            
        case 'cleanup':
            for (const [id, { type, id: timerId }] of fakeIdToId) {
                if (type === 'interval') clearInterval(timerId);
                else if (type === 'timeout') clearTimeout(timerId);
            }
            fakeIdToId.clear();
            break;
    }
};
 
self.onerror = function (error) {
    console.error('HackTimer Worker Error:', error);
};
`], { type: 'application/javascript' });
            
            workerScript = URL.createObjectURL(blob);
            worker = new Worker(workerScript);
            
            setupTimerOverrides();
            setupWorkerEventHandlers();
            
            return true;
            
        } catch (error) {
            console.error(workerConfig.logPrefix + 'Worker initialization failed:', error);
            return false;
        }
    }
 
    function setupTimerOverrides() {
        const { setInterval: origSetInterval, clearInterval: origClearInterval, 
                setTimeout: origSetTimeout, clearTimeout: origClearTimeout } = window;
 
        window.setInterval = function (callback, time, ...parameters) {
            if (!worker) {
                return origSetInterval(callback, time, ...parameters);
            }
            
            const fakeId = getFakeId();
            fakeIdToCallback.set(fakeId, {
                callback: callback,
                parameters: parameters,
                isTimeout: false
            });
            
            worker.postMessage({
                name: 'setInterval',
                fakeId: fakeId,
                time: Math.max(0, time || 0)
            });
            
            return fakeId;
        };
 
        window.clearInterval = function (fakeId) {
            if (!worker) {
                return origClearInterval(fakeId);
            }
            
            if (fakeIdToCallback.has(fakeId)) {
                fakeIdToCallback.delete(fakeId);
                worker.postMessage({
                    name: 'clearInterval',
                    fakeId: fakeId
                });
            }
        };
 
        window.setTimeout = function (callback, time, ...parameters) {
            if (!worker) {
                return origSetTimeout(callback, time, ...parameters);
            }
            
            const fakeId = getFakeId();
            fakeIdToCallback.set(fakeId, {
                callback: callback,
                parameters: parameters,
                isTimeout: true
            });
            
            worker.postMessage({
                name: 'setTimeout',
                fakeId: fakeId,
                time: Math.max(0, time || 0)
            });
            
            return fakeId;
        };
 
        window.clearTimeout = function (fakeId) {
            if (!worker) {
                return origClearTimeout(fakeId);
            }
            
            if (fakeIdToCallback.has(fakeId)) {
                fakeIdToCallback.delete(fakeId);
                worker.postMessage({
                    name: 'clearTimeout',
                    fakeId: fakeId
                });
            }
        };
    }
 
    function setupWorkerEventHandlers() {
        worker.onmessage = function (event) {
            const { fakeId } = event.data;
            executeCallback(fakeId);
        };
 
        worker.onerror = function (event) {
            console.error(workerConfig.logPrefix + 'Worker error:', event);
        };
    }
 
    function cleanup() {
        if (worker) {
            worker.postMessage({ name: 'cleanup' });
            worker.terminate();
            fakeIdToCallback.clear();
        }
    }
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWorker);
    } else {
        initializeWorker();
    }
 
    window.addEventListener('beforeunload', cleanup);
 
})('HackTimerWorker.js');