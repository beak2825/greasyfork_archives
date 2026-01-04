// ==UserScript==
// @name         Action Replay HwH Ext
// @namespace    HeroWarsHelper.ActionReplay
// @version      1.1.6
// @description  Record and replay actions (captured from clicks) with auto-run and repeats
// @author       zzsheep
// @license      Copyright (c) zzsheep
// @match        https://www.hero-wars.com/*
// @match        https://apps-1701433570146040.apps.fbsbx.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559623/Action%20Replay%20HwH%20Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/559623/Action%20Replay%20HwH%20Ext.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const EXTENSION_NAME = "Action Replay";
    const EXTENSION_VERSION = "1.1.6";
    const EXTENSION_AUTHOR = "zzsheep";

    // --- STATE VARIABLES ---
    let recordings = [];
    let isRecording = false;
    let recordingBuffer = [];
    let originalSend = null;
    let recordingButton = null; // Reference to the recording button
    let recordingButtonText = null; // Cached reference to button text element
    let playAllButton = null; // Reference to the play all button
    let playAllButtonText = null; // Cached reference to play all button text element
    let updateButtonInterval = null; // Interval for updating button
    let lastBufferCount = 0; // Track last buffer count to avoid unnecessary DOM updates
    let lastRecordingState = null; // Track last recording state to force update on state change
    let executionQueue = Promise.resolve(); // Serialize executions (auto-run + manual run)
    let autoRunScheduled = false; // Prevent duplicate scheduling on reloads/rehydration
    let isPlaying = false; // Track if playback is active
    let playAllAborted = false; // Flag to abort playback
    let currentlyPlayingRecordingId = null; // Track which individual recording is playing
    let recordingAborted = false; // Flag to abort individual recording execution

    function enqueueExecution(taskFn) {
        // Ensure tasks run one-at-a-time, in order, even if a task fails.
        executionQueue = executionQueue.then(taskFn, taskFn);
        return executionQueue;
    }

    // --- STORAGE KEYS ---
    const STORAGE_RECORDINGS = 'apiRepeater_recordings';
    const STORAGE_SETTINGS = 'apiRepeater_settings';

    // --- API CALLS TO SKIP DURING RECORDING ---
    // Use Map with lowercase keys for O(1) case-insensitive lookup
    const SKIP_API_CALLS = new Map([
        ['specialoffer_check', true],
        ['stashclient', true],
        ['settingsset', true]

    ]);
    
    // Helper function to check if API call should be skipped (case-insensitive, optimized)
    function shouldSkipAPICall(apiName) {
        if (!apiName || typeof apiName !== 'string') return false;
        // O(1) lookup using lowercase key
        return SKIP_API_CALLS.has(apiName.toLowerCase());
    }

    // --- EARLY API INTERCEPTION (before HWH loads) ---
    // Intercept XMLHttpRequest immediately to catch all API calls
    // This runs at document-start, before HeroWarsHelper wraps XMLHttpRequest
    (function() {
        // Store original functions before any other script modifies them
        const originalXHRSend = XMLHttpRequest.prototype.send;
        const originalXHROpen = XMLHttpRequest.prototype.open;
        
        // Intercept open to capture URL
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._apiRepeaterUrl = url;
            this._apiRepeaterMethod = method;
            return originalXHROpen.apply(this, [method, url, ...args]);
        };
        
        // Intercept send to capture API calls
        // Keep it synchronous to preserve XMLHttpRequest API contract (native send returns undefined)
        XMLHttpRequest.prototype.send = function(sourceData) {
            // Early exit if not recording (most common case) - performance optimization
            if (!isRecording) {
                return originalXHRSend.apply(this, arguments);
            }
            
            // Check if recording is active and this is an API call
            if (this._apiRepeaterUrl && typeof this._apiRepeaterUrl === 'string') {
                // Optimized API URL check - check most common pattern first
                const url = this._apiRepeaterUrl;
                const isApiCall = url.includes('/api/') || 
                                 url.includes('nextersglobal.com');
                
                if (isApiCall) {
                    try {
                        let callData = null;
                        let tempData = null;
                        
                        // Handle data the same way HeroWarsHelper does (line 2119-2123)
                        if (sourceData && typeof sourceData === 'string') {
                            tempData = sourceData;
                        } else if (sourceData instanceof ArrayBuffer) {
                            // Handle ArrayBuffer (HeroWarsHelper uses this)
                            const decoder = new TextDecoder('utf-8');
                            tempData = decoder.decode(sourceData);
                        } else {
                            tempData = sourceData;
                        }
                        
                        if (tempData && typeof tempData === 'string') {
                            // Try-catch around JSON.parse is already handled by outer try-catch
                            // But we can add early validation for performance
                            if (tempData.length === 0 || (!tempData.includes('"name"') && !tempData.includes('"calls"'))) {
                                // Skip if doesn't look like API call data
                                return originalXHRSend.apply(this, arguments);
                            }
                            callData = JSON.parse(tempData);
                            
                            if (callData) {
                                if (callData.calls && Array.isArray(callData.calls)) {
                                    // Store each call in the buffer (skip filtered APIs)
                                    // Use for loop instead of forEach for better performance
                                    const calls = callData.calls;
                                    const now = Date.now();
                                    for (let i = 0; i < calls.length; i++) {
                                        const call = calls[i];
                                        // Skip API calls in the skip list
                                        if (!call || !call.name) continue;
                                        if (shouldSkipAPICall(call.name)) continue;
                                        
                                        recordingBuffer.push({
                                            name: call.name,
                                            args: call.args || {},
                                            context: call.context || { actionTs: now },
                                            ident: call.ident || 'body'
                                        });
                                    }
                                } else if (callData.name && callData.args) {
                                    // Skip API calls in the skip list - check first before processing
                                    if (!shouldSkipAPICall(callData.name)) {
                                        // Handle single call object (not wrapped in calls array)
                                        const capturedCall = {
                                            name: callData.name,
                                            args: callData.args || {},
                                            context: callData.context || { actionTs: Date.now() },
                                            ident: callData.ident || 'body'
                                        };
                                        recordingBuffer.push(capturedCall);
                                        // Removed console.log for performance
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.error('Action Replay: Error capturing action:', e, sourceData);
                    }
                }
            }
            
            // Call original send synchronously (preserves XMLHttpRequest API contract)
            // originalXHRSend is the native synchronous version captured before any wrappers
            return originalXHRSend.apply(this, arguments);
        };
        
        console.log('Action Replay: Early XHR interception setup complete (document-start)');
    })();

    // --- INITIALIZATION ---
    function waitForHWH(callback) {
        const interval = setInterval(() => {
            if (window.HWHClasses && window.HWHClasses.ScriptMenu && window.HWHFuncs && window.Send) {
                const scriptMenu = window.HWHClasses.ScriptMenu.getInst();
                if (scriptMenu && scriptMenu.mainMenu) {
                    clearInterval(interval);
                    callback();
                }
            }
        }, 200);
    }

    function initializeExtension() {
        console.log(`${EXTENSION_NAME} v${EXTENSION_VERSION} is loading...`);
        
        const { HWHFuncs, HWHClasses } = window;
        HWHFuncs.addExtentionName(EXTENSION_NAME, EXTENSION_VERSION, EXTENSION_AUTHOR);

        // Load recordings from storage
        loadRecordings();

        // Setup API interception
        setupAPIInterseption();
        
        // Verify interception worked
        if (originalSend) {
            console.log('Action Replay: Action capture setup complete');
        } else {
            console.warn('Action Replay: Action capture may not be working - originalSend is null');
        }

        // Add menu button, recording button, and play all button in the same row
        const scriptMenu = HWHClasses.ScriptMenu.getInst();
        const buttonGroup = scriptMenu.addCombinedButton([
            {
                name: 'Action Replay',
                title: 'Record and replay actions',
                onClick: openMainPopup,
                color: 'purple'
            },
            {
                name: '⏺ 0',
                title: 'Click to start/stop recording actions',
                onClick: toggleRecording,
                color: 'red'
            },
            {
                name: '▶️',
                title: 'Play all enabled recordings',
                onClick: togglePlayAll,
                color: 'blue'
            }
        ]);
        
        // Get reference to recording button (second button in combined row)
        // buttonGroup is a div with class 'scriptMenu_btnRow', buttons are children
        if (buttonGroup && buttonGroup.children && buttonGroup.children.length > 2) {
            recordingButton = buttonGroup.children[1]; // Second button (index 1)
            playAllButton = buttonGroup.children[2]; // Third button (index 2)
            // Cache button text element for performance
            recordingButtonText = recordingButton.querySelector('.scriptMenu_btnPlate');
            playAllButtonText = playAllButton.querySelector('.scriptMenu_btnPlate');
        }
        
        // Start interval to update recording button (only when needed)
        // Use requestAnimationFrame for better performance, but fallback to interval
        updateButtonInterval = setInterval(updateRecordingButton, 500);
        
        // Initialize play all button state
        updatePlayAllButton();

        // Auto-execute enabled recordings
        scheduleAutoRuns();

        console.log(`${EXTENSION_NAME} initialized successfully.`);
    }

    // --- API INTERCEPTION ---
    function setupAPIInterseption() {
        // XMLHttpRequest is already intercepted early, just wrap Send function here
        // Store original Send if available (for replay)
        if (window.Send && !originalSend) {
            originalSend = window.Send;
            window.Send = async function(data) {
                // Do not capture here: XHR is already intercepted at document-start, and
                // capturing here can double-record calls (Send ultimately uses XHR).
                // Call original Send function (preserve async behavior)
                return await originalSend.apply(this, arguments);
            };
            console.log('Action Replay: Send function wrapped');
        }
        
        console.log('Action Replay: Action capture setup complete (XHR already intercepted early)');
    }

    // --- STORAGE SYSTEM ---
    function loadRecordings() {
        const { HWHFuncs } = window;
        recordings = HWHFuncs.getSaveVal(STORAGE_RECORDINGS, []);
        
        // Validate and clean up recordings
        recordings = recordings.filter(rec => rec && rec.id && rec.apiCalls && Array.isArray(rec.apiCalls));
        
        // Check expiration and disable auto-run for expired recordings
        // Also ensure repeatCount exists (default to 1 for old recordings)
        const now = Date.now();
        let hasChanges = false;
        recordings.forEach(rec => {
            if (rec.expirationDays > 0 && rec.expiresAt && now > rec.expiresAt) {
                if (rec.autoRun) {
                    rec.autoRun = false;
                    hasChanges = true;
                }
            }
            // Ensure repeatCount exists (migration for old recordings)
            if (rec.repeatCount === undefined || rec.repeatCount === null || rec.repeatCount < 1) {
                rec.repeatCount = 1;
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            saveRecordings();
        }
    }

    // Debounce storage saves to avoid excessive writes
    let saveRecordingsTimeout = null;
    function saveRecordings() {
        const { HWHFuncs } = window;
        // Clear existing timeout
        if (saveRecordingsTimeout) {
            clearTimeout(saveRecordingsTimeout);
        }
        // Debounce: wait 100ms before saving (batch multiple rapid updates)
        saveRecordingsTimeout = setTimeout(() => {
            HWHFuncs.setSaveVal(STORAGE_RECORDINGS, recordings);
            saveRecordingsTimeout = null;
        }, 100);
    }

    // --- RECORDING MANAGEMENT ---
    function toggleRecording() {
        if (isRecording) {
            stopRecording();
            // Always open the save dialog when stopping (same as popup behavior)
            // Use setTimeout to ensure button state is updated first
            setTimeout(() => {
                if (recordingBuffer.length > 0) {
                    openCreateRecordingPopup();
                } else {
                    // No actions captured, show message
                    const { HWHFuncs } = window;
                    HWHFuncs.setProgress('Action Replay: No actions captured', true);
                }
            }, 50);
        } else {
            startRecording();
        }
    }

    function updateRecordingButton() {
        // Early exit if button not available
        if (!recordingButton || !recordingButtonText) return;
        
        const bufferCount = recordingBuffer.length;
        
        // Force update if recording state changed (important for stop button)
        const stateChanged = lastRecordingState !== isRecording;
        
        // Skip DOM update only if state hasn't changed AND count hasn't changed
        if (!stateChanged && !isRecording && bufferCount === lastBufferCount) return;
        
        lastBufferCount = bufferCount;
        lastRecordingState = isRecording;
        
        if (isRecording) {
            recordingButtonText.textContent = `⏹ ${bufferCount}`;
            recordingButton.title = `Stop recording (${bufferCount} actions captured)`;
        } else {
            recordingButtonText.textContent = `⏺ ${bufferCount}`;
            recordingButton.title = `Start recording (${bufferCount} calls in buffer)`;
        }
    }

    function startRecording() {
        isRecording = true;
        recordingBuffer = [];
        lastBufferCount = 0; // Reset counter
        lastRecordingState = null; // Force update
        const { HWHFuncs } = window;
        // Removed excessive console.log calls for performance
        HWHFuncs.setProgress('Action Replay: Recording started', true);
        updateRecordingButton();
    }

    function stopRecording() {
        isRecording = false;
        lastRecordingState = null; // Force update
        const { HWHFuncs } = window;
        // Removed console.log for performance
        HWHFuncs.setProgress(`Action Replay: Recording stopped - ${recordingBuffer.length} actions captured`, true);
        updateRecordingButton();
    }

    function createRecording(name, description, expirationDays, autoRun, repeatCount) {
        // Filter out any skipped API calls as a safety measure
        const filteredCalls = recordingBuffer.filter(call => {
            if (!call || !call.name) return false;
            return !shouldSkipAPICall(call.name);
        });
        
        const recording = {
            id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
            name: name || 'Unnamed Recording',
            description: description || '',
            createdAt: Date.now(),
            expirationDays: expirationDays || 0,
            expiresAt: expirationDays > 0 ? Date.now() + (expirationDays * 24 * 60 * 60 * 1000) : null,
            autoRun: autoRun || false,
            repeatCount: repeatCount || 1,
            apiCalls: filteredCalls
        };
        
        recordings.push(recording);
        saveRecordings();
        recordingBuffer = [];
        updateRecordingButton();
        return recording;
    }

    function updateRecording(id, updates) {
        const recording = recordings.find(r => r.id === id);
        if (!recording) return false;
        
        Object.assign(recording, updates);
        
        // Recalculate expiration if expirationDays changed
        if (updates.expirationDays !== undefined) {
            if (updates.expirationDays > 0) {
                recording.expiresAt = recording.createdAt + (updates.expirationDays * 24 * 60 * 60 * 1000);
            } else {
                recording.expiresAt = null;
            }
        }
        
        saveRecordings();
        return true;
    }

    function deleteRecording(id) {
        const index = recordings.findIndex(r => r.id === id);
        if (index === -1) return false;
        
        recordings.splice(index, 1);
        saveRecordings();
        return true;
    }

    function deleteAllRecordings() {
        if (recordings.length === 0) {
            const { HWHFuncs } = window;
            HWHFuncs.setProgress('Action Replay: No recordings to delete', true);
            return;
        }
        
        const confirmMessage = `Are you sure you want to delete all ${recordings.length} recording(s)? This action cannot be undone.`;
        if (!confirm(confirmMessage)) {
            return;
        }
        
        recordings = [];
        saveRecordings();
        
        const { HWHFuncs } = window;
        HWHFuncs.setProgress('Action Replay: All recordings deleted', true);
        
        // Refresh the popup if it's open
        const popup = document.getElementById('api-repeater-popup-container');
        if (popup) {
            populateRecordingsList();
        }
    }

    function togglePlayAll() {
        if (isPlaying) {
            stopPlayback();
        } else {
            playAllRecordings();
        }
    }

    function playAllRecordings() {
        const now = Date.now();
        const enabledRecordings = recordings.filter(rec => {
            if (!rec.autoRun) return false;
            if (rec.expirationDays > 0 && rec.expiresAt && now > rec.expiresAt) return false;
            return true;
        });

        if (enabledRecordings.length === 0) {
            const { HWHFuncs } = window;
            HWHFuncs.setProgress('Action Replay: No enabled recordings to play', true);
            return;
        }

        isPlaying = true;
        playAllAborted = false;
        updatePlayAllButton();

        const { HWHFuncs } = window;
        HWHFuncs.setProgress(`Action Replay: Playing all ${enabledRecordings.length} enabled recording(s)...`, true);

        // Execute all enabled recordings sequentially
        enabledRecordings.forEach((rec) => {
            enqueueExecution(async () => {
                if (playAllAborted) {
                    return;
                }
                try {
                    await executeRecordingInternal(rec);
                } catch (e) {
                    console.error('Action Replay: Error during play all:', e);
                } finally {
                    if (!playAllAborted) {
                        await new Promise(r => setTimeout(r, 2000));
                    }
                }
            });
        });

        // Wait for all executions to complete, then update button
        executionQueue.then(() => {
            isPlaying = false;
            updatePlayAllButton();
            if (!playAllAborted) {
                HWHFuncs.setProgress('Action Replay: All recordings completed', true);
            }
        }).catch(() => {
            isPlaying = false;
            updatePlayAllButton();
        });
    }

    function stopPlayback() {
        playAllAborted = true;
        isPlaying = false;
        updatePlayAllButton();
        
        const { HWHFuncs } = window;
        HWHFuncs.setProgress('Action Replay: Playback stopped', true);
    }

    function updatePlayAllButton() {
        if (!playAllButton || !playAllButtonText) return;
        
        if (isPlaying) {
            playAllButtonText.textContent = '⏹';
            playAllButton.title = 'Stop playback';
        } else {
            playAllButtonText.textContent = '▶️';
            playAllButton.title = 'Play all enabled recordings';
        }
    }

    // --- EXECUTION SYSTEM ---
    async function executeRecording(recording) {
        // If this recording is already playing, stop it
        if (currentlyPlayingRecordingId === recording.id) {
            stopRecordingExecution(recording.id);
            return;
        }
        
        // Set as currently playing
        currentlyPlayingRecordingId = recording.id;
        recordingAborted = false;
        updateRecordingButtonState(recording.id, true);
        
        // Always serialize to avoid parallel execution (server risk)
        return enqueueExecution(() => executeRecordingInternal(recording)).then(() => {
            // Reset state when done
            if (currentlyPlayingRecordingId === recording.id) {
                currentlyPlayingRecordingId = null;
                recordingAborted = false;
                updateRecordingButtonState(recording.id, false);
            }
        }).catch(() => {
            // Reset state on error
            if (currentlyPlayingRecordingId === recording.id) {
                currentlyPlayingRecordingId = null;
                recordingAborted = false;
                updateRecordingButtonState(recording.id, false);
            }
        });
    }
    
    function stopRecordingExecution(recordingId) {
        if (currentlyPlayingRecordingId === recordingId) {
            recordingAborted = true;
            currentlyPlayingRecordingId = null;
            updateRecordingButtonState(recordingId, false);
            const { HWHFuncs } = window;
            HWHFuncs.setProgress('Action Replay: Recording execution stopped', true);
        }
    }
    
    function updateRecordingButtonState(recordingId, isPlaying) {
        const button = document.querySelector(`[data-action="run"][data-id="${recordingId}"]`);
        if (button) {
            if (isPlaying) {
                button.textContent = '⏹';
                button.title = 'Stop execution';
            } else {
                button.textContent = '▶️';
                button.title = 'Replay';
            }
        }
    }

    async function executeRecordingInternal(recording) {
        const { Send, HWHFuncs } = window;
        
        if (!recording || !recording.apiCalls || recording.apiCalls.length === 0) {
            HWHFuncs.setProgress(`Action Replay: ${recording.name} - No actions to replay`, true);
            return;
        }

        // Get repeat count (default to 1 if not set)
        const repeatCount = recording.repeatCount || 1;
        
        HWHFuncs.setProgress(`Action Replay: Replaying ${recording.name} (${repeatCount} time${repeatCount > 1 ? 's' : ''})...`, true);
        
        let totalSuccessCount = 0;
        let totalFailureCount = 0;
        const allErrors = [];
        
        // Execute the recording repeatCount times
        for (let repeatIndex = 0; repeatIndex < repeatCount; repeatIndex++) {
            // Check for abort (both play all and individual recording)
            if (playAllAborted || recordingAborted) {
                HWHFuncs.setProgress(`Action Replay: ${recording.name} - Playback interrupted`, true);
                return;
            }
            
            if (repeatCount > 1) {
                HWHFuncs.setProgress(`Action Replay: ${recording.name} - Replay ${repeatIndex + 1}/${repeatCount}...`, true);
            }
            
            let successCount = 0;
            let failureCount = 0;
            const errors = [];
            
            // Execute API calls one by one to avoid duplicate ident errors
            for (let i = 0; i < recording.apiCalls.length; i++) {
                // Check for abort before each API call (both play all and individual recording)
                if (playAllAborted || recordingAborted) {
                    HWHFuncs.setProgress(`Action Replay: ${recording.name} - Playback interrupted`, true);
                    return;
                }
                
                const call = recording.apiCalls[i];
                
                try {
                    // Prepare call with updated timestamp and unique ident
                    const callToExecute = {
                        name: call.name,
                        args: call.args,
                        context: { actionTs: Math.floor(performance.now()) },
                        ident: 'body' // Use 'body' for single calls (API requirement)
                    };

                    // Execute single API call
                    const response = await Send({ calls: [callToExecute] });
                    
                    // Check for API errors in response
                    if (response && response.error) {
                        const errorMsg = `API Error: ${response.error.name || 'Unknown'} - ${response.error.description || 'No description'}`;
                        errors.push({
                            callIndex: i + 1,
                            callName: call.name,
                            error: errorMsg,
                            fullError: response.error,
                            repeatIndex: repeatIndex + 1
                        });
                        failureCount++;
                        console.error(`Action Replay: Step ${i + 1}/${recording.apiCalls.length} (${call.name}) failed in replay ${repeatIndex + 1}/${repeatCount}:`, errorMsg);
                        HWHFuncs.setProgress(`Action Replay: ${recording.name} - Replay ${repeatIndex + 1}/${repeatCount} - Step ${i + 1}/${recording.apiCalls.length} (${call.name}) failed: ${errorMsg}`, true);
                    } else {
                        successCount++;
                        console.log(`Action Replay: Step ${i + 1}/${recording.apiCalls.length} (${call.name}) succeeded in replay ${repeatIndex + 1}/${repeatCount}`);
                    }
                    
                } catch (e) {
                    // Handle execution errors (network, timeout, etc.)
                    const errorMsg = e.message || String(e);
                    errors.push({
                        callIndex: i + 1,
                        callName: call.name,
                        error: errorMsg,
                        fullError: e,
                        repeatIndex: repeatIndex + 1
                    });
                    failureCount++;
                    console.error(`Action Replay: Step ${i + 1}/${recording.apiCalls.length} (${call.name}) threw error in replay ${repeatIndex + 1}/${repeatCount}:`, e);
                    HWHFuncs.setProgress(`Action Replay: ${recording.name} - Replay ${repeatIndex + 1}/${repeatCount} - Step ${i + 1}/${recording.apiCalls.length} (${call.name}) error: ${errorMsg}`, true);
                }
                
                // Add delay between calls (similar to Auto Daily Extension)
                if (i < recording.apiCalls.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
                    // Check for abort after delay (both play all and individual recording)
                    if (playAllAborted || recordingAborted) {
                        HWHFuncs.setProgress(`Action Replay: ${recording.name} - Playback interrupted`, true);
                        return;
                    }
                }
            }
            
            totalSuccessCount += successCount;
            totalFailureCount += failureCount;
            allErrors.push(...errors);
            
            // Add delay between repeats (if more than one repeat)
            if (repeatIndex < repeatCount - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between repeats
                // Check for abort after delay (both play all and individual recording)
                if (playAllAborted || recordingAborted) {
                    HWHFuncs.setProgress(`Action Replay: ${recording.name} - Playback interrupted`, true);
                    return;
                }
            }
        }
        
        // Final summary
        const totalCalls = recording.apiCalls.length * repeatCount;
        const summary = `Action Replay: ${recording.name} - Completed ${repeatCount} replay${repeatCount > 1 ? 's' : ''}: ${totalSuccessCount} succeeded, ${totalFailureCount} failed out of ${totalCalls} total steps`;
        console.log(summary);
        
        if (allErrors.length > 0) {
            console.error(`Action Replay: ${recording.name} - Errors:`, allErrors);
            const errorDetails = allErrors.map(e => `Repeat ${e.repeatIndex}, Call ${e.callIndex} (${e.callName}): ${e.error}`).join('; ');
            HWHFuncs.setProgress(`${summary}. Errors: ${errorDetails}`, true);
        } else {
            HWHFuncs.setProgress(`${summary}`, true);
        }
    }

    function scheduleAutoRuns() {
        const now = Date.now();
        const enabledRecordings = recordings.filter(rec => {
            if (!rec.autoRun) return false;
            if (rec.expirationDays > 0 && rec.expiresAt && now > rec.expiresAt) return false;
            return true;
        });

        if (enabledRecordings.length === 0) return;
        if (autoRunScheduled) return;
        autoRunScheduled = true;

        // Queue auto-runs sequentially in the current recordings order (not random).
        // Each recording may contain multiple API calls and repeats; we run the next
        // recording only after the previous completes.
        const initialDelayMs = 10000;
        setTimeout(() => {
            enabledRecordings.forEach((rec) => {
                enqueueExecution(async () => {
                    // Small gap between recordings to reduce bursty traffic
                    try {
                        await executeRecordingInternal(rec);
                    } finally {
                        await new Promise(r => setTimeout(r, 2000));
                    }
                });
            });
        }, initialDelayMs);
    }

    // --- EXPORT/IMPORT ---
    function exportRecordings() {
        const { HWHFuncs } = window;
        const dataToExport = {
            recordings: recordings,
            exportDate: new Date().toISOString(),
            version: EXTENSION_VERSION
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api_repeater_recordings_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        HWHFuncs.setProgress('Action Replay: Saved actions exported!', true);
    }

    function importRecordings() {
        const { HWHFuncs } = window;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = readerEvent => {
                try {
                    const importedData = JSON.parse(readerEvent.target.result);
                    
                    if (!importedData.recordings || !Array.isArray(importedData.recordings)) {
                        throw new Error('Invalid file structure');
                    }
                    
                    // Validate recordings structure
                    const validRecordings = importedData.recordings.filter(rec => 
                        rec && rec.id && rec.apiCalls && Array.isArray(rec.apiCalls)
                    );
                    
                    if (validRecordings.length === 0) {
                        throw new Error('No valid recordings found in file');
                    }
                    
                    // Merge imported recordings with existing ones (don't replace)
                    // Create a Set of existing recording IDs for quick lookup
                    const existingIds = new Set(recordings.map(rec => rec.id));
                    
                    // Add all recordings, assigning new sequential IDs to duplicates
                    let addedCount = 0;
                    let duplicateCount = 0;
                    let idCounter = 0; // Counter to ensure sequential IDs
                    
                    validRecordings.forEach(importedRec => {
                        let recToAdd = importedRec;
                        
                        if (existingIds.has(importedRec.id)) {
                            // Recording with this ID already exists, assign new sequential ID
                            duplicateCount++;
                            recToAdd = { ...importedRec }; // Create a copy to avoid modifying original
                            // Generate new ID using same format as createRecording: timestamp_random
                            // Add counter to ensure sequential uniqueness
                            recToAdd.id = (Date.now() + idCounter).toString() + '_' + Math.random().toString(36).substr(2, 9);
                            idCounter++; // Increment for next duplicate
                            // Ensure new ID is unique (very unlikely but check anyway)
                            while (existingIds.has(recToAdd.id)) {
                                recToAdd.id = (Date.now() + idCounter).toString() + '_' + Math.random().toString(36).substr(2, 9);
                                idCounter++;
                            }
                        }
                        
                        // Add recording (either original or with new ID)
                        recordings.push(recToAdd);
                        existingIds.add(recToAdd.id); // Add to set to avoid duplicates in same import
                        addedCount++;
                    });
                    
                    saveRecordings();
                    
                    let message = `Action Replay: Imported ${addedCount} item(s)`;
                    if (duplicateCount > 0) {
                        message += ` (${duplicateCount} assigned new IDs due to duplicates)`;
                    }
                    message += `!`;
                    HWHFuncs.setProgress(message, true);
                    
                    // Refresh popup if open
                    const popup = document.getElementById('api-repeater-popup-container');
                    if (popup) {
                        popup.remove();
                        openMainPopup();
                    }
                } catch (err) {
                    alert('Error importing file: ' + err.message);
                    console.error('Action Replay: Import error:', err);
                }
            };
            reader.readAsText(file, 'UTF-8');
        };
        input.click();
    }

    // --- UI COMPONENTS ---
    function formatDate(timestamp) {
        if (!timestamp) return 'Never';
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    function isExpired(recording) {
        if (recording.expirationDays === 0) return false;
        if (!recording.expiresAt) return false;
        return Date.now() > recording.expiresAt;
    }

    async function openMainPopup() {
        const { HWHFuncs } = window;
        
        if (document.getElementById('api-repeater-popup-container')) return;

        const styles = `
            .api-repeater-popup-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10001; }
            .api-repeater-popup-main { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #190e08e6; border: 3px #ce9767 solid; border-radius: 10px; z-index: 10002; color: #fce1ac; padding: 20px; min-width: 900px; max-width: 1200px; max-height: 80vh; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
            .api-repeater-popup-main h2 { text-align: center; margin-top: 0; border-bottom: 1px solid #ce9767; padding-bottom: 10px; }
            .api-repeater-controls { display: flex; gap: 10px; align-items: center; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px; }
            .api-repeater-recording-list { list-style: none; padding: 0; margin: 0; }
            .api-repeater-recording-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid #4a3422; background: rgba(0,0,0,0.2); cursor: move; }
            .api-repeater-recording-item:last-child { border-bottom: none; }
            .api-repeater-recording-item.dragging { opacity: 0.5; background: rgba(76, 175, 80, 0.3); }
            .api-repeater-recording-item.drag-over { border-color: #4CAF50; border-width: 2px; }
            .api-repeater-recording-drag-handle { color: #aaa; margin-right: 8px; cursor: grab; font-size: 16px; }
            .api-repeater-recording-drag-handle:active { cursor: grabbing; }
            .api-repeater-recording-info { flex-grow: 1; margin-right: 15px; }
            .api-repeater-recording-name { font-weight: bold; color: #ffd700; margin-bottom: 5px; }
            .api-repeater-recording-description { font-size: 0.9em; color: #ccc; margin-bottom: 5px; }
            .api-repeater-recording-meta { font-size: 0.8em; color: #aaa; }
            .api-repeater-recording-actions { display: flex; gap: 8px; align-items: center; }
            .api-repeater-btn { cursor: pointer; font-size: 18px; background: none; border: none; padding: 5px 8px; transition: transform 0.2s; color: #fce1ac; }
            .api-repeater-btn:hover { transform: scale(1.2); }
            .api-repeater-btn-danger { color: #ff6b6b; }
            .api-repeater-btn-success { color: #4CAF50; }
            .api-repeater-close-btn { position: absolute; top: 5px; right: 10px; font-size: 24px; color: #ce9767; cursor: pointer; border: none; background: none; }
            .api-repeater-footer { border-top: 1px solid #ce9767; margin-top: 15px; padding-top: 15px; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 10px; }
            .api-repeater-status-badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 0.75em; margin-left: 8px; }
            .api-repeater-status-expired { background: #ff6b6b; color: white; }
            .api-repeater-status-active { background: #4CAF50; color: white; }
            .api-repeater-status-recording { background: #ff4444; color: white; animation: pulse 1s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            .api-repeater-edit-popup-main { min-width: 500px !important; }
            .api-repeater-calls-list { list-style: none; padding: 0; margin: 10px 0; max-height: 300px; overflow-y: auto; }
            .api-repeater-call-item { display: flex; align-items: center; padding: 8px; margin: 5px 0; background: rgba(0,0,0,0.3); border: 1px solid #4a3422; border-radius: 4px; cursor: move; }
            .api-repeater-call-item:hover { background: rgba(0,0,0,0.5); border-color: #ce9767; }
            .api-repeater-call-item.dragging { opacity: 0.5; background: rgba(76, 175, 80, 0.3); }
            .api-repeater-call-item.drag-over { border-color: #4CAF50; border-width: 2px; }
            .api-repeater-call-number { min-width: 30px; color: #aaa; font-weight: bold; margin-right: 10px; }
            .api-repeater-call-name { flex-grow: 1; color: #fce1ac; }
            .api-repeater-drag-handle { color: #aaa; margin-right: 8px; cursor: grab; }
            .api-repeater-drag-handle:active { cursor: grabbing; }
            .api-repeater-call-delete { color: #ff6b6b; cursor: pointer; margin-left: 8px; font-size: 14px; padding: 2px 6px; }
            .api-repeater-call-delete:hover { color: #ff4444; transform: scale(1.2); }
            .api-repeater-expand-btn { cursor: pointer; color: #aaa; font-size: 0.9em; margin-left: 10px; }
            .api-repeater-expand-btn:hover { color: #fce1ac; }
            .api-repeater-calls-expanded { margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 4px; max-height: 400px; overflow-y: auto; }
            .api-repeater-repeat-count { width: 50px; padding: 4px; background: rgba(0,0,0,0.5); border: 1px solid #ce9767; border-radius: 3px; color: #fce1ac; text-align: center; font-size: 14px; }
        `;
        
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const backdrop = document.createElement('div');
        backdrop.className = 'api-repeater-popup-backdrop';
        backdrop.id = 'api-repeater-popup-container';
        
        const popup = document.createElement('div');
        popup.className = 'api-repeater-popup-main';
        
        // Recording controls
        const recordingStatus = isRecording ? '🔴 Recording' : '⚪ Stopped';
        const recordingStatusClass = isRecording ? 'api-repeater-status-recording' : '';
        
        popup.innerHTML = `
            <button class="api-repeater-close-btn">&times;</button>
            <h2>Action Replay</h2>
            <div class="api-repeater-controls">
                <button id="start-recording-btn" class="api-repeater-btn" style="font-size: 16px; padding: 8px 15px; background: ${isRecording ? '#ff4444' : '#4CAF50'}; border-radius: 5px;">
                    ${isRecording ? '⏹ Stop Recording' : '⏺ Start Recording'}
                </button>
                <span class="api-repeater-status-badge ${recordingStatusClass}">${recordingStatus}</span>
                <span style="margin-left: auto; color: #aaa;">Captured: ${recordingBuffer.length} actions</span>
            </div>
            <div>
                <h3 style="margin-top: 0; border-bottom: 1px solid #4a3422; padding-bottom: 5px;">Saved Replays (${recordings.length})</h3>
                <ul class="api-repeater-recording-list" id="recordings-list"></ul>
            </div>
            <div class="api-repeater-footer">
                <button id="export-btn" class="api-repeater-btn" style="font-size: 16px; padding: 8px 15px; background: #4CAF50; border-radius: 5px;">💾 Export</button>
                <button id="import-btn" class="api-repeater-btn" style="font-size: 16px; padding: 8px 15px; background: #2196F3; border-radius: 5px;">📥 Import</button>
                <a href="https://github.com/mailming/Action-Replay-HwH-Ext/tree/main/library" target="_blank" style="font-size: 16px; padding: 8px 15px; background: #9C27B0; border-radius: 5px; color: #fce1ac; text-decoration: none; display: inline-block; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">📚 Templates</a>
                <button id="delete-all-btn" class="api-repeater-btn" style="font-size: 16px; padding: 8px 15px; background: #ff4444; border-radius: 5px;">🗑️ Delete All</button>
            </div>
        `;
        
        backdrop.appendChild(popup);
        document.body.appendChild(backdrop);
        
        // Populate recordings list
        populateRecordingsList();
        
        // Event listeners
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop || e.target.classList.contains('api-repeater-close-btn')) {
                backdrop.remove();
            }
        });
        
        document.getElementById('start-recording-btn').addEventListener('click', () => {
            if (isRecording) {
                stopRecording();
                backdrop.remove();
                // If we have captured calls, open the save dialog
                if (recordingBuffer.length > 0) {
                    openCreateRecordingPopup();
                } else {
                    // No actions captured, just refresh the main popup
                    const { HWHFuncs } = window;
                    HWHFuncs.setProgress('Action Replay: No actions captured', true);
                    openMainPopup();
                }
            } else {
                startRecording();
                backdrop.remove();
                openMainPopup();
            }
        });
        
        document.getElementById('export-btn').addEventListener('click', exportRecordings);
        document.getElementById('import-btn').addEventListener('click', importRecordings);
        document.getElementById('delete-all-btn').addEventListener('click', deleteAllRecordings);
    }

    function populateRecordingsList() {
        const list = document.getElementById('recordings-list');
        if (!list) return;

        // Attach delegated listeners once (populateRecordingsList() is called frequently)
        if (!list.dataset.apiRepeaterListenersAttached) {
            list.dataset.apiRepeaterListenersAttached = '1';

            list.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]');
                if (!action) return;

                const actionType = action.dataset.action;
                const recordingId = action.dataset.id;
                const recording = recordings.find(r => r.id === recordingId);
                if (!recording) return;

                if (actionType === 'run') {
                    executeRecording(recording);
                } else if (actionType === 'delete') {
                    deleteRecording(recordingId);
                    populateRecordingsList();
                } else if (actionType === 'edit') {
                    openEditRecordingPopup(recording);
                } else if (actionType === 'expand') {
                    e.stopPropagation(); // Prevent event bubbling
                    const expandedDiv = document.getElementById(`calls-${recordingId}`);
                    if (expandedDiv) {
                        const isVisible = expandedDiv.style.display !== 'none';
                        expandedDiv.style.display = isVisible ? 'none' : 'block';
                        action.textContent = isVisible ? '▼' : '▲';

                        // Populate on expand (avoid doing work for collapsed recordings)
                        if (!isVisible) {
                            setupApiCallsDragDrop(recordingId, recording.apiCalls);
                        }
                    }
                }
            });

            list.addEventListener('change', (e) => {
                if (e.target.dataset.action === 'toggle-autorun') {
                    const recordingId = e.target.dataset.id;
                    updateRecording(recordingId, { autoRun: e.target.checked });
                    populateRecordingsList();
                } else if (e.target.dataset.action === 'update-repeat-count') {
                    const recordingId = e.target.dataset.id;
                    const repeatCount = parseInt(e.target.value) || 1;
                    if (repeatCount < 1) {
                        e.target.value = 1;
                        return;
                    }
                    updateRecording(recordingId, { repeatCount: repeatCount });
                }
            });
        }
        
        list.innerHTML = '';
        
        if (recordings.length === 0) {
            list.innerHTML = '<li style="padding: 20px; text-align: center; color: #aaa;">No recordings saved yet</li>';
            return;
        }
        
        recordings.forEach((recording, index) => {
            const li = document.createElement('li');
            li.className = 'api-repeater-recording-item';
            li.draggable = true;
            li.dataset.recordingIndex = index;
            
            const expired = isExpired(recording);
            const expiredBadge = expired ? '<span class="api-repeater-status-badge api-repeater-status-expired">Expired</span>' : '';
            const activeBadge = recording.autoRun ? '<span class="api-repeater-status-badge api-repeater-status-active">Auto-Run</span>' : '';
            
            li.innerHTML = `
                <span class="api-repeater-recording-drag-handle">☰</span>
                <div class="api-repeater-recording-info" style="flex-grow: 1;">
                    <div class="api-repeater-recording-name">
                        ${recording.name} ${expiredBadge} ${activeBadge}
                        <span class="api-repeater-expand-btn" data-action="expand" data-id="${recording.id}" title="Show/hide actions">▼</span>
                    </div>
                    <div class="api-repeater-recording-description">${recording.description || 'No description'}</div>
                    <div class="api-repeater-recording-meta">
                        Calls: ${recording.apiCalls.length} | 
                        Created: ${formatDate(recording.createdAt)} | 
                        Expires: ${recording.expirationDays === 0 ? 'Never' : formatDate(recording.expiresAt)}
                    </div>
                    <div class="api-repeater-calls-expanded" id="calls-${recording.id}" style="display: none;">
                        <div style="font-weight: bold; margin-bottom: 8px;">Actions (drag to reorder):</div>
                        <ul class="api-repeater-calls-list" id="calls-list-${recording.id}"></ul>
                    </div>
                </div>
                <div class="api-repeater-recording-actions">
                    <input type="number" class="api-repeater-repeat-count" min="1" value="${recording.repeatCount || 1}" data-action="update-repeat-count" data-id="${recording.id}" title="Number of times to repeat">
                    <button class="api-repeater-btn api-repeater-btn-success" title="${currentlyPlayingRecordingId === recording.id ? 'Stop execution' : 'Replay'}" data-action="run" data-id="${recording.id}">${currentlyPlayingRecordingId === recording.id ? '⏹' : '▶️'}</button>
                    <label style="cursor: pointer;">
                        <input type="checkbox" ${recording.autoRun ? 'checked' : ''} data-action="toggle-autorun" data-id="${recording.id}" style="margin-right: 5px;">
                        <span style="font-size: 0.9em;">Auto</span>
                    </label>
                    <button class="api-repeater-btn" title="Edit" data-action="edit" data-id="${recording.id}">✏️</button>
                    <button class="api-repeater-btn api-repeater-btn-danger" title="Delete" data-action="delete" data-id="${recording.id}">🗑️</button>
                </div>
            `;
            
            // Drag and drop handlers for recording item
            li.addEventListener('dragstart', (e) => {
                // Don't start drag if clicking on buttons, expand button, or inside expanded API calls
                if (e.target.closest('button') || 
                    e.target.closest('.api-repeater-expand-btn') || 
                    e.target.closest('.api-repeater-calls-expanded') ||
                    e.target.closest('.api-repeater-call-item')) {
                    e.preventDefault();
                    return;
                }
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', index.toString());
                li.classList.add('dragging');
            });
            
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
                list.querySelectorAll('.api-repeater-recording-item').forEach(item => {
                    item.classList.remove('drag-over');
                });
            });
            
            li.addEventListener('dragover', (e) => {
                // Don't allow drag over if clicking on buttons, expand button, or inside expanded API calls
                if (e.target.closest('button') || 
                    e.target.closest('.api-repeater-expand-btn') || 
                    e.target.closest('.api-repeater-calls-expanded') ||
                    e.target.closest('.api-repeater-call-item')) {
                    return;
                }
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                li.classList.add('drag-over');
            });
            
            li.addEventListener('dragleave', () => {
                li.classList.remove('drag-over');
            });
            
            li.addEventListener('drop', (e) => {
                // Don't allow drop if clicking on buttons, expand button, or inside expanded API calls
                if (e.target.closest('button') || 
                    e.target.closest('.api-repeater-expand-btn') || 
                    e.target.closest('.api-repeater-calls-expanded') ||
                    e.target.closest('.api-repeater-call-item')) {
                    return;
                }
                e.preventDefault();
                li.classList.remove('drag-over');
                
                const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const targetIndex = parseInt(li.dataset.recordingIndex);
                
                if (!isNaN(draggedIndex) && !isNaN(targetIndex) && draggedIndex !== targetIndex) {
                    // Reorder recordings array
                    const [movedRecording] = recordings.splice(draggedIndex, 1);
                    recordings.splice(targetIndex, 0, movedRecording);
                    
                    // Save the new order
                    saveRecordings();
                    
                    // Re-render the list
                    populateRecordingsList();
                }
            });
            
            list.appendChild(li);
        });
    }

    function setupApiCallsDragDrop(recordingId, apiCalls) {
        const callsList = document.getElementById(`calls-list-${recordingId}`);
        if (!callsList) return;
        
        let reorderedApiCalls = [...apiCalls];

        // Replace (not stack) the delete-click handler each time we (re)setup this list
        callsList.onclick = (e) => {
            if (e.target.classList.contains('api-repeater-call-delete') || e.target.closest('.api-repeater-call-delete')) {
                const deleteBtn = e.target.classList.contains('api-repeater-call-delete') ? e.target : e.target.closest('.api-repeater-call-delete');
                const callIndex = parseInt(deleteBtn.dataset.callIndex);

                if (!isNaN(callIndex) && callIndex >= 0 && callIndex < reorderedApiCalls.length) {
                    // Remove the API call
                    reorderedApiCalls.splice(callIndex, 1);

                    // Update the recording
                    const recording = recordings.find(r => r.id === recordingId);
                    if (recording) {
                        recording.apiCalls = reorderedApiCalls;
                        saveRecordings();
                    }

                    // Re-render list
                    renderCallsList();
                }
            }
        };
        
        function renderCallsList() {
            callsList.innerHTML = '';
            reorderedApiCalls.forEach((call, index) => {
                const li = document.createElement('li');
                li.className = 'api-repeater-call-item';
                li.draggable = true;
                li.dataset.index = index;
                li.innerHTML = `
                    <span class="api-repeater-drag-handle">☰</span>
                    <span class="api-repeater-call-number">${index + 1}.</span>
                    <span class="api-repeater-call-name">${call.name}</span>
                    <span class="api-repeater-call-delete" data-action="delete-call" data-call-index="${index}" title="Delete this action">🗑️</span>
                `;
                
                // Drag and drop event handlers
                li.addEventListener('dragstart', (e) => {
                    // Don't start drag if clicking delete button
                    if (e.target.classList.contains('api-repeater-call-delete') || e.target.closest('.api-repeater-call-delete')) {
                        e.preventDefault();
                        return;
                    }
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', index.toString());
                    li.classList.add('dragging');
                });
                
                li.addEventListener('dragend', () => {
                    li.classList.remove('dragging');
                    callsList.querySelectorAll('.api-repeater-call-item').forEach(item => {
                        item.classList.remove('drag-over');
                    });
                });
                
                li.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    li.classList.add('drag-over');
                });
                
                li.addEventListener('dragleave', () => {
                    li.classList.remove('drag-over');
                });
                
                li.addEventListener('drop', (e) => {
                    e.preventDefault();
                    li.classList.remove('drag-over');
                    
                    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    const targetIndex = parseInt(li.dataset.index);
                    
                    if (!isNaN(draggedIndex) && !isNaN(targetIndex) && draggedIndex !== targetIndex) {
                        // Reorder array
                        const [movedItem] = reorderedApiCalls.splice(draggedIndex, 1);
                        reorderedApiCalls.splice(targetIndex, 0, movedItem);
                        
                        // Update the recording
                        const recording = recordings.find(r => r.id === recordingId);
                        if (recording) {
                            recording.apiCalls = reorderedApiCalls;
                            saveRecordings();
                        }
                        
                        // Re-render list
                        renderCallsList();
                    }
                });
                
                callsList.appendChild(li);
            });
        }
        
        renderCallsList();
    }

    async function openCreateRecordingPopup() {
        const { HWHFuncs } = window;
        
        // Check if popup already exists
        const existingPopup = document.getElementById('api-repeater-create-popup-container');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        if (recordingBuffer.length === 0) {
            HWHFuncs.setProgress('Action Replay: No actions captured', true);
            return;
        }
        
        const backdrop = document.createElement('div');
        backdrop.className = 'api-repeater-popup-backdrop';
        backdrop.id = 'api-repeater-create-popup-container';
        
        const popup = document.createElement('div');
        popup.className = 'api-repeater-popup-main api-repeater-edit-popup-main';
        
        popup.innerHTML = `
            <button class="api-repeater-close-btn">&times;</button>
            <h2>Save Recording</h2>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px;">Name:</label>
                    <input type="text" id="recording-name" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #ce9767; border-radius: 5px; color: #fce1ac;" value="Recording ${new Date().toLocaleString()}">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px;">Description:</label>
                    <textarea id="recording-description" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #ce9767; border-radius: 5px; color: #fce1ac; min-height: 80px;"></textarea>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px;">Expiration (days, 0 = never):</label>
                    <input type="number" id="recording-expiration" min="0" value="0" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #ce9767; border-radius: 5px; color: #fce1ac;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px;">Repeat Count:</label>
                    <input type="number" id="recording-repeat-count" min="1" value="1" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #ce9767; border-radius: 5px; color: #fce1ac;">
                </div>
                <div>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="recording-autorun">
                        <span>Auto-run on game load</span>
                    </label>
                </div>
                <div style="color: #aaa; font-size: 0.9em;">
                    Captured ${recordingBuffer.length} action(s)
                </div>
                <div style="display: flex; justify-content: space-around; margin-top: 15px;">
                    <button id="save-recording-btn" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Save</button>
                    <button id="cancel-recording-btn" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
                </div>
            </div>
        `;
        
        backdrop.appendChild(popup);
        document.body.appendChild(backdrop);
        
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop || e.target.classList.contains('api-repeater-close-btn') || e.target.id === 'cancel-recording-btn') {
                backdrop.remove();
                // Clear the buffer if user cancels
                if (e.target.id === 'cancel-recording-btn' || e.target.classList.contains('api-repeater-close-btn')) {
                    recordingBuffer = [];
                    updateRecordingButton();
                }
                // Refresh main popup
                openMainPopup();
            }
        });
        
        document.getElementById('save-recording-btn').addEventListener('click', () => {
            const name = document.getElementById('recording-name').value.trim();
            const description = document.getElementById('recording-description').value.trim();
            const expirationDays = parseInt(document.getElementById('recording-expiration').value) || 0;
            const autoRun = document.getElementById('recording-autorun').checked;
            const repeatCount = parseInt(document.getElementById('recording-repeat-count').value) || 1;
            
            if (!name) {
                alert('Please enter a name for the recording');
                return;
            }
            
            if (repeatCount < 1) {
                alert('Repeat count must be at least 1');
                return;
            }
            
            createRecording(name, description, expirationDays, autoRun, repeatCount);
            backdrop.remove();
            
            const mainPopup = document.getElementById('api-repeater-popup-container');
            if (mainPopup) {
                mainPopup.remove();
            }
            openMainPopup();
        });
    }

    async function openEditRecordingPopup(recording) {
        const backdrop = document.createElement('div');
        backdrop.className = 'api-repeater-popup-backdrop';
        backdrop.id = 'api-repeater-edit-popup-container';
        
        const popup = document.createElement('div');
        popup.className = 'api-repeater-popup-main api-repeater-edit-popup-main';
        
        popup.innerHTML = `
            <button class="api-repeater-close-btn">&times;</button>
            <h2>Edit Recording</h2>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px;">Name:</label>
                    <input type="text" id="edit-recording-name" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #ce9767; border-radius: 5px; color: #fce1ac;" value="${recording.name}">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px;">Description:</label>
                    <textarea id="edit-recording-description" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #ce9767; border-radius: 5px; color: #fce1ac; min-height: 80px;">${recording.description || ''}</textarea>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px;">Expiration (days, 0 = never):</label>
                    <input type="number" id="edit-recording-expiration" min="0" value="${recording.expirationDays || 0}" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #ce9767; border-radius: 5px; color: #fce1ac;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px;">Repeat Count:</label>
                    <input type="number" id="edit-recording-repeat-count" min="1" value="${recording.repeatCount || 1}" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.5); border: 1px solid #ce9767; border-radius: 5px; color: #fce1ac;">
                </div>
                <div>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="edit-recording-autorun" ${recording.autoRun ? 'checked' : ''}>
                        <span>Auto-run on game load</span>
                    </label>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Actions (drag to reorder):</label>
                    <ul class="api-repeater-calls-list" id="edit-api-calls-list"></ul>
                </div>
                <div style="display: flex; justify-content: space-around; margin-top: 15px;">
                    <button id="update-recording-btn" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Update</button>
                    <button id="cancel-edit-btn" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
                </div>
            </div>
        `;
        
        backdrop.appendChild(popup);
        document.body.appendChild(backdrop);
        
        // Populate API calls list with drag and drop
        const apiCallsList = document.getElementById('edit-api-calls-list');
        let reorderedApiCalls = [...recording.apiCalls]; // Copy for reordering

        // Replace (not stack) click handler for delete buttons in edit popup
        apiCallsList.onclick = (e) => {
            if (e.target.classList.contains('api-repeater-call-delete') || e.target.closest('.api-repeater-call-delete')) {
                const deleteBtn = e.target.classList.contains('api-repeater-call-delete') ? e.target : e.target.closest('.api-repeater-call-delete');
                const callIndex = parseInt(deleteBtn.dataset.callIndex);

                if (!isNaN(callIndex) && callIndex >= 0 && callIndex < reorderedApiCalls.length) {
                    reorderedApiCalls.splice(callIndex, 1);
                    renderApiCallsList();
                }
            }
        };
        
        function renderApiCallsList() {
            apiCallsList.innerHTML = '';
            reorderedApiCalls.forEach((call, index) => {
                const li = document.createElement('li');
                li.className = 'api-repeater-call-item';
                li.draggable = true;
                li.dataset.index = index;
                li.innerHTML = `
                    <span class="api-repeater-drag-handle">☰</span>
                    <span class="api-repeater-call-number">${index + 1}.</span>
                    <span class="api-repeater-call-name">${call.name}</span>
                    <span class="api-repeater-call-delete" data-action="delete-call" data-call-index="${index}" title="Delete this action">🗑️</span>
                `;
                
                // Drag and drop event handlers
                li.addEventListener('dragstart', (e) => {
                    // Don't start drag if clicking delete button
                    if (e.target.classList.contains('api-repeater-call-delete') || e.target.closest('.api-repeater-call-delete')) {
                        e.preventDefault();
                        return;
                    }
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', index.toString());
                    li.classList.add('dragging');
                });
                
                li.addEventListener('dragend', () => {
                    li.classList.remove('dragging');
                    // Remove drag-over class from all items
                    apiCallsList.querySelectorAll('.api-repeater-call-item').forEach(item => {
                        item.classList.remove('drag-over');
                    });
                });
                
                li.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    li.classList.add('drag-over');
                });
                
                li.addEventListener('dragleave', () => {
                    li.classList.remove('drag-over');
                });
                
                li.addEventListener('drop', (e) => {
                    e.preventDefault();
                    li.classList.remove('drag-over');
                    
                    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    const targetIndex = parseInt(li.dataset.index);
                    
                    if (!isNaN(draggedIndex) && !isNaN(targetIndex) && draggedIndex !== targetIndex) {
                        // Reorder array
                        const [movedItem] = reorderedApiCalls.splice(draggedIndex, 1);
                        reorderedApiCalls.splice(targetIndex, 0, movedItem);
                        
                        // Re-render list
                        renderApiCallsList();
                    }
                });
                
                apiCallsList.appendChild(li);
            });
        }
        
        renderApiCallsList();
        
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop || e.target.classList.contains('api-repeater-close-btn') || e.target.id === 'cancel-edit-btn') {
                backdrop.remove();
            }
        });
        
        document.getElementById('update-recording-btn').addEventListener('click', () => {
            const name = document.getElementById('edit-recording-name').value.trim();
            const description = document.getElementById('edit-recording-description').value.trim();
            const expirationDays = parseInt(document.getElementById('edit-recording-expiration').value) || 0;
            const autoRun = document.getElementById('edit-recording-autorun').checked;
            const repeatCount = parseInt(document.getElementById('edit-recording-repeat-count').value) || 1;
            
            if (!name) {
                alert('Please enter a name for the recording');
                return;
            }
            
            if (repeatCount < 1) {
                alert('Repeat count must be at least 1');
                return;
            }
            
            updateRecording(recording.id, {
                name,
                description,
                expirationDays,
                autoRun,
                repeatCount,
                apiCalls: reorderedApiCalls // Save reordered API calls
            });
            
            backdrop.remove();
            
            const mainPopup = document.getElementById('api-repeater-popup-container');
            if (mainPopup) {
                mainPopup.remove();
            }
            openMainPopup();
        });
    }

    // Start initialization
    waitForHWH(initializeExtension);

})();


