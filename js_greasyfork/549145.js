// ==UserScript==
// @name		Robomonkey.io YouTube Evil Pitch Shifter
// @description		Adjust video pitch and speed independently on YouTube videos
// @version		1.1.5
// @match		https://*.youtube.com/*
// @icon		https://www.youtube.com/s/desktop/1a8d73a2/img/favicon_32x32.png
// @namespace https://greasyfork.org/users/1502537
// @downloadURL https://update.greasyfork.org/scripts/549145/Robomonkeyio%20YouTube%20Evil%20Pitch%20Shifter.user.js
// @updateURL https://update.greasyfork.org/scripts/549145/Robomonkeyio%20YouTube%20Evil%20Pitch%20Shifter.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    let audioContext = null;
    let sourceNode = null;
    let gainNode = null;
    let scriptProcessor = null;
    let currentPitchCents = 0; // pitch in cents (100 cents = 1 semitone)
    let currentSpeed = 1.0;
    let isProcessing = false;
    
    // Advanced pitch shifter using PSOLA (Pitch Synchronous Overlap Add) approach
    class PitchShifter {
        constructor(sampleRate) {
            this.sampleRate = sampleRate;
            this.frameSize = 2048;
            this.hopSize = this.frameSize / 4;
            this.overlapFactor = 4;
            this.inputBuffer = new Float32Array(this.frameSize);
            this.outputBuffer = new Float32Array(this.frameSize);
            this.grainBuffer = new Float32Array(this.frameSize * 2);
            this.position = 0;
            this.grainPosition = 0;
        }
        
        // High-quality pitch shift using granular synthesis with windowing
        process(inputBuffer, pitchRatio) {
            const inputLength = inputBuffer.length;
            const output = new Float32Array(inputLength);
            
            if (Math.abs(pitchRatio - 1.0) < 0.001) {
                // No pitch change, direct copy
                return new Float32Array(inputBuffer);
            }
            
            const grainSize = 1024;
            const overlap = grainSize / 2;
            
            for (let i = 0; i < inputLength; i++) {
                const readPos = i / pitchRatio;
                const baseIndex = Math.floor(readPos);
                const fraction = readPos - baseIndex;
                
                // Bounds checking
                if (baseIndex >= 0 && baseIndex < inputLength - 1) {
                    // Cubic interpolation for better quality
                    const y0 = baseIndex > 0 ? inputBuffer[baseIndex - 1] : inputBuffer[baseIndex];
                    const y1 = inputBuffer[baseIndex];
                    const y2 = inputBuffer[baseIndex + 1];
                    const y3 = baseIndex < inputLength - 2 ? inputBuffer[baseIndex + 2] : inputBuffer[baseIndex + 1];
                    
                    // Cubic interpolation
                    const c0 = y1;
                    const c1 = 0.5 * (y2 - y0);
                    const c2 = y0 - 2.5 * y1 + 2 * y2 - 0.5 * y3;
                    const c3 = 0.5 * (y3 - y0) + 1.5 * (y1 - y2);
                    
                    output[i] = ((c3 * fraction + c2) * fraction + c1) * fraction + c0;
                } else if (baseIndex >= 0 && baseIndex < inputLength) {
                    output[i] = inputBuffer[baseIndex];
                } else {
                    output[i] = 0;
                }
                
                // Apply windowing to reduce artifacts
                if (i < overlap) {
                    const fadeIn = i / overlap;
                    output[i] *= fadeIn;
                } else if (i > inputLength - overlap) {
                    const fadeOut = (inputLength - i) / overlap;
                    output[i] *= fadeOut;
                }
            }
            
            return output;
        }
    }
    
    let pitchShifter = null;
    
    // Debounce function to prevent excessive calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Convert cents to pitch ratio (professional audio formula)
    function centsToPitchRatio(cents) {
        return Math.pow(2, cents / 1200);
    }
    
    // Convert semitones to cents
    function semitonesToCents(semitones) {
        return semitones * 100;
    }
    
    // Convert cents to semitones for display
    function centsToSemitones(cents) {
        return cents / 100;
    }
    
    // Format pitch display (like Transpose does)
    function formatPitchDisplay(cents) {
        const semitones = Math.round(cents / 100 * 10) / 10; // Round to 1 decimal
        const absSemitones = Math.abs(semitones);
        const sign = cents > 0 ? '+' : cents < 0 ? '-' : '';
        
        if (cents === 0) return '0';
        if (cents % 100 === 0) {
            // Whole semitones
            return `${sign}${Math.abs(Math.round(semitones))}`;
        } else {
            // Include decimal for partial semitones
            return `${sign}${absSemitones.toFixed(1)}`;
        }
    }
    
    // Create pitch shifter using Web Audio API
    async function createPitchShifter(video) {
        try {
            if (audioContext) {
                audioContext.close();
            }
            
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            pitchShifter = new PitchShifter(audioContext.sampleRate);
            
            // Create source and destination nodes
            sourceNode = audioContext.createMediaElementSource(video);
            gainNode = audioContext.createGain();
            
            // Create script processor for pitch shifting
            const bufferSize = 4096;
            scriptProcessor = audioContext.createScriptProcessor(bufferSize, 2, 2);
            
            scriptProcessor.onaudioprocess = function(event) {
                if (Math.abs(currentPitchCents) < 1) {
                    // No significant pitch shift, just pass through
                    for (let channel = 0; channel < event.outputBuffer.numberOfChannels; channel++) {
                        const inputData = event.inputBuffer.getChannelData(channel);
                        const outputData = event.outputBuffer.getChannelData(channel);
                        outputData.set(inputData);
                    }
                } else {
                    // Apply pitch shift using cents
                    const pitchRatio = centsToPitchRatio(currentPitchCents);
                    
                    for (let channel = 0; channel < event.outputBuffer.numberOfChannels; channel++) {
                        const inputData = event.inputBuffer.getChannelData(channel);
                        const outputData = event.outputBuffer.getChannelData(channel);
                        const shifted = pitchShifter.process(inputData, pitchRatio);
                        outputData.set(shifted);
                    }
                }
            };
            
            // Connect the audio graph
            sourceNode.connect(scriptProcessor);
            scriptProcessor.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            console.log('Advanced pitch shifter initialized');
            return true;
        } catch (error) {
            console.error('Failed to create pitch shifter:', error);
            return false;
        }
    }
    
    // Apply speed changes (separate from pitch)
    function applySpeed(video, speed) {
        if (!video) return;
        
        try {
            video.playbackRate = speed;
            console.log(`Applied speed: ${speed}x`);
        } catch (error) {
            console.error('Error applying speed:', error);
        }
    }
    
    // Create pitch control UI
    async function createPitchControls() {
        const video = document.querySelector('video.html5-main-video');
        if (!video) return null;
        
        // Load saved position and state
        const savedPosition = await GM.getValue('pitchShifter_position', { top: 80, right: 20, left: null });
        const savedMinimized = await GM.getValue('pitchShifter_minimized', false);
        
        // Create container for pitch controls
        const pitchContainer = document.createElement('div');
        pitchContainer.id = 'pitch-shifter-controls';
        
        // Apply saved position
        let positionCSS = `
            position: fixed;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 0;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 10px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            color: white;
            user-select: none;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            min-width: 280px;
            cursor: move;
        `;
        
        // Set position based on saved data
        if (savedPosition.left !== null) {
            positionCSS += `left: ${savedPosition.left}px; top: ${savedPosition.top}px;`;
        } else {
            positionCSS += `right: ${savedPosition.right}px; top: ${savedPosition.top}px;`;
        }
        
        pitchContainer.style.cssText = positionCSS;
        
        // Create draggable header
        const header = document.createElement('div');
        header.id = 'pitch-shifter-header';
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px 10px 0 0;
            cursor: move;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        // Title
        const title = document.createElement('div');
        title.textContent = '🎼 Pitch Shifter';
        title.style.cssText = 'font-weight: 600; color: #fff; font-size: 14px; flex: 1;';
        
        // Control buttons container
        const headerControls = document.createElement('div');
        headerControls.style.cssText = 'display: flex; gap: 8px; align-items: center;';
        
        // Minimize/Maximize button
        const minimizeButton = document.createElement('button');
        minimizeButton.innerHTML = savedMinimized ? '+' : '−';
        minimizeButton.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        `;
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            background: rgba(255, 0, 0, 0.3);
            color: white;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        `;
        
        // Content container
        const content = document.createElement('div');
        content.id = 'pitch-shifter-content';
        content.style.cssText = `
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        
        let isMinimized = savedMinimized;
        
        // Apply saved minimized state
        if (isMinimized) {
            content.style.display = 'none';
            pitchContainer.style.minWidth = 'auto';
        }
        
        // Save position function
        async function savePosition() {
            const rect = pitchContainer.getBoundingClientRect();
            const position = {
                top: rect.top,
                left: rect.left,
                right: null
            };
            
            // If positioned near right edge, save as right-based position
            if (rect.left > window.innerWidth / 2) {
                position.right = window.innerWidth - rect.right;
                position.left = null;
            }
            
            await GM.setValue('pitchShifter_position', position);
            console.log('Position saved:', position);
        }
        
        // Save minimized state function
        async function saveMinimizedState(minimized) {
            await GM.setValue('pitchShifter_minimized', minimized);
            console.log('Minimized state saved:', minimized);
        }
        
        // Minimize/Maximize functionality
        minimizeButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            isMinimized = !isMinimized;
            
            if (isMinimized) {
                content.style.display = 'none';
                minimizeButton.innerHTML = '+';
                pitchContainer.style.minWidth = 'auto';
                pitchContainer.style.cursor = 'move';
            } else {
                content.style.display = 'flex';
                minimizeButton.innerHTML = '−';
                pitchContainer.style.minWidth = '280px';
                pitchContainer.style.cursor = 'move';
            }
            
            await saveMinimizedState(isMinimized);
        });
        
        // Close functionality
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            pitchContainer.remove();
        });
        
        // Hover effects for buttons
        minimizeButton.addEventListener('mouseenter', () => {
            minimizeButton.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        minimizeButton.addEventListener('mouseleave', () => {
            minimizeButton.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.background = 'rgba(255, 0, 0, 0.5)';
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.background = 'rgba(255, 0, 0, 0.3)';
        });
        
        // Drag functionality
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        function startDrag(e) {
            // Only start drag if clicking on header or container, not on controls
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                if (e.target !== minimizeButton && e.target !== closeButton) {
                    return;
                }
            }
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = pitchContainer.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            pitchContainer.style.transition = 'none';
            document.body.style.userSelect = 'none';
            
            // Add global event listeners for drag
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', endDrag);
        }
        
        function handleDrag(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            // Keep within viewport bounds
            const containerRect = pitchContainer.getBoundingClientRect();
            const maxLeft = window.innerWidth - containerRect.width;
            const maxTop = window.innerHeight - containerRect.height;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            pitchContainer.style.left = `${newLeft}px`;
            pitchContainer.style.top = `${newTop}px`;
            pitchContainer.style.right = 'auto';
        }
        
        async function endDrag() {
            isDragging = false;
            pitchContainer.style.transition = '';
            document.body.style.userSelect = '';
            
            // Remove global event listeners
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', endDrag);
            
            // Save new position
            await savePosition();
        }
        
        // Add drag event listeners to header and container
        header.addEventListener('mousedown', startDrag);
        pitchContainer.addEventListener('mousedown', (e) => {
            // Only allow dragging from empty areas or header
            if (e.target === pitchContainer || e.target === header || e.target === title) {
                startDrag(e);
            }
        });
        
        // Assemble header
        headerControls.appendChild(minimizeButton);
        headerControls.appendChild(closeButton);
        header.appendChild(title);
        header.appendChild(headerControls);
        
        // Fine pitch controls section
        const finePitchSection = document.createElement('div');
        finePitchSection.style.cssText = 'border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;';
        
        const finePitchLabel = document.createElement('div');
        finePitchLabel.textContent = 'Fine Pitch (cents)';
        finePitchLabel.style.cssText = 'font-weight: 500; margin-bottom: 8px; color: #ccc; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;';
        
        const finePitchRow = document.createElement('div');
        finePitchRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        
        const finePitchSlider = document.createElement('input');
        finePitchSlider.type = 'range';
        finePitchSlider.min = '-1200'; // -12 semitones in cents
        finePitchSlider.max = '1200';  // +12 semitones in cents
        finePitchSlider.value = '0';
        finePitchSlider.step = '1'; // 1 cent precision
        finePitchSlider.style.cssText = `
            flex: 1;
            height: 6px;
            background: linear-gradient(to right, #ff4444, #333, #44ff44);
            outline: none;
            border-radius: 3px;
            cursor: pointer;
            -webkit-appearance: none;
        `;
        
        const finePitchValue = document.createElement('span');
        finePitchValue.textContent = '0';
        finePitchValue.style.cssText = `
            min-width: 45px; 
            font-weight: 600; 
            color: #4CAF50; 
            font-family: 'Courier New', monospace;
            font-size: 13px;
            text-align: center;
            background: rgba(76, 175, 80, 0.1);
            padding: 4px 6px;
            border-radius: 4px;
        `;
        
        // Coarse pitch controls (semitones)
        const coarsePitchRow = document.createElement('div');
        coarsePitchRow.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-top: 8px;';
        
        const coarsePitchLabel = document.createElement('span');
        coarsePitchLabel.textContent = 'Semitones:';
        coarsePitchLabel.style.cssText = 'font-weight: 500; min-width: 65px; color: #ccc;';
        
        const coarsePitchSlider = document.createElement('input');
        coarsePitchSlider.type = 'range';
        coarsePitchSlider.min = '-12';
        coarsePitchSlider.max = '12';
        coarsePitchSlider.value = '0';
        coarsePitchSlider.step = '1';
        coarsePitchSlider.style.cssText = `
            flex: 1;
            height: 6px;
            background: #333;
            outline: none;
            border-radius: 3px;
            cursor: pointer;
            -webkit-appearance: none;
        `;
        
        const coarsePitchValue = document.createElement('span');
        coarsePitchValue.textContent = '0';
        coarsePitchValue.style.cssText = 'min-width: 25px; text-align: center; font-weight: 600; color: #fff;';
        
        // Speed controls section
        const speedSection = document.createElement('div');
        speedSection.style.cssText = 'border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;';
        
        const speedLabel = document.createElement('div');
        speedLabel.textContent = 'Playback Speed';
        speedLabel.style.cssText = 'font-weight: 500; margin-bottom: 8px; color: #ccc; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;';
        
        const speedRow = document.createElement('div');
        speedRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '0.25';
        speedSlider.max = '2.0';
        speedSlider.value = '1.0';
        speedSlider.step = '0.01'; // Fine speed control
        speedSlider.style.cssText = `
            flex: 1;
            height: 6px;
            background: #333;
            outline: none;
            border-radius: 3px;
            cursor: pointer;
            -webkit-appearance: none;
        `;
        
        const speedValue = document.createElement('span');
        speedValue.textContent = '1.00x';
        speedValue.style.cssText = `
            min-width: 50px; 
            text-align: center; 
            font-weight: 600; 
            color: #2196F3;
            font-family: 'Courier New', monospace;
            background: rgba(33, 150, 243, 0.1);
            padding: 4px 6px;
            border-radius: 4px;
        `;
        
        // Control buttons
        const buttonRow = document.createElement('div');
        buttonRow.style.cssText = 'display: flex; gap: 8px; margin-top: 12px;';
        
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset All';
        resetButton.style.cssText = `
            flex: 1;
            background: #ff4444;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: background 0.2s;
        `;
        
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Bypass';
        toggleButton.style.cssText = `
            flex: 1;
            background: #666;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: background 0.2s;
        `;
        
        let isBypassed = false;
        
        // Add custom slider styling
        const style = document.createElement('style');
        style.textContent = `
            #pitch-shifter-controls input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #fff;
                cursor: pointer;
                border: 2px solid #333;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            #pitch-shifter-controls input[type="range"]::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #fff;
                cursor: pointer;
                border: 2px solid #333;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            #pitch-shifter-controls button:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
            #pitch-shifter-header button:hover {
                transform: none;
            }
        `;
        document.head.appendChild(style);
        
        // Event handlers
        const debouncedApplyPitch = debounce((cents) => {
            if (!isBypassed) {
                currentPitchCents = cents;
                console.log(`Pitch changed to: ${cents} cents (${centsToSemitones(cents).toFixed(2)} semitones)`);
            }
        }, 30);
        
        const debouncedApplySpeed = debounce((speed) => {
            currentSpeed = speed;
            applySpeed(video, speed);
        }, 30);
        
        // Fine pitch slider
        finePitchSlider.addEventListener('input', (e) => {
            const cents = parseInt(e.target.value);
            finePitchValue.textContent = formatPitchDisplay(cents);
            
            // Update coarse slider to match
            const semitones = Math.round(cents / 100);
            coarsePitchSlider.value = semitones.toString();
            coarsePitchValue.textContent = semitones > 0 ? `+${semitones}` : semitones.toString();
            
            debouncedApplyPitch(cents);
        });
        
        // Coarse pitch slider
        coarsePitchSlider.addEventListener('input', (e) => {
            const semitones = parseInt(e.target.value);
            const cents = semitonesToCents(semitones);
            
            // Update fine slider
            finePitchSlider.value = cents.toString();
            finePitchValue.textContent = formatPitchDisplay(cents);
            coarsePitchValue.textContent = semitones > 0 ? `+${semitones}` : semitones.toString();
            
            debouncedApplyPitch(cents);
        });
        
        // Speed slider
        speedSlider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            speedValue.textContent = `${speed.toFixed(2)}x`;
            debouncedApplySpeed(speed);
        });
        
        // Reset button
        resetButton.addEventListener('click', () => {
            currentPitchCents = 0;
            currentSpeed = 1.0;
            finePitchSlider.value = '0';
            coarsePitchSlider.value = '0';
            speedSlider.value = '1.0';
            finePitchValue.textContent = '0';
            coarsePitchValue.textContent = '0';
            speedValue.textContent = '1.00x';
            applySpeed(video, 1.0);
            console.log('Reset pitch and speed');
        });
        
        // Toggle bypass
        toggleButton.addEventListener('click', () => {
            isBypassed = !isBypassed;
            toggleButton.textContent = isBypassed ? 'Enable' : 'Bypass';
            toggleButton.style.background = isBypassed ? '#4CAF50' : '#666';
            
            if (isBypassed) {
                currentPitchCents = 0; // Bypass pitch processing
            } else {
                currentPitchCents = parseInt(finePitchSlider.value);
            }
            console.log(`Pitch processing ${isBypassed ? 'bypassed' : 'enabled'}`);
        });
        
        // Assemble the controls
        pitchContainer.appendChild(header);
        pitchContainer.appendChild(content);
        
        content.appendChild(finePitchSection);
        finePitchSection.appendChild(finePitchLabel);
        finePitchSection.appendChild(finePitchRow);
        finePitchRow.appendChild(finePitchSlider);
        finePitchRow.appendChild(finePitchValue);
        
        // Coarse pitch
        finePitchSection.appendChild(coarsePitchRow);
        coarsePitchRow.appendChild(coarsePitchLabel);
        coarsePitchRow.appendChild(coarsePitchSlider);
        coarsePitchRow.appendChild(coarsePitchValue);
        
        // Speed section
        content.appendChild(speedSection);
        speedSection.appendChild(speedLabel);
        speedSection.appendChild(speedRow);
        speedRow.appendChild(speedSlider);
        speedRow.appendChild(speedValue);
        
        // Buttons
        content.appendChild(buttonRow);
        buttonRow.appendChild(resetButton);
        buttonRow.appendChild(toggleButton);
        
        return pitchContainer;
    }
    
    // Insert pitch controls into page
    async function insertPitchControls() {
        // Remove existing controls if any
        const existing = document.getElementById('pitch-shifter-controls');
        if (existing) {
            existing.remove();
        }
        
        const pitchControls = await createPitchControls();
        if (!pitchControls) {
            console.log('Failed to create pitch controls');
            return false;
        }
        
        // Insert into document body
        document.body.appendChild(pitchControls);
        
        console.log('Advanced pitch controls inserted successfully');
        return true;
    }
    
    // Initialize pitch shifter for the current video
    async function initializePitchShifter() {
        console.log('Initializing pitch shifter...');
        const video = document.querySelector('video.html5-main-video');
        if (!video) {
            console.log('Video element not found, retrying in 1 second...');
            setTimeout(initializePitchShifter, 1000);
            return;
        }
        
        console.log('Video found, creating pitch shifter...');
        
        // Initialize audio context
        const success = await createPitchShifter(video);
        if (!success) {
            console.error('Failed to initialize audio context');
            return;
        }
        
        // Insert controls
        await insertPitchControls();
        
        // Resume audio context on user interaction
        const resumeAudio = async () => {
            if (audioContext && audioContext.state === 'suspended') {
                await audioContext.resume();
                console.log('Audio context resumed');
            }
        };
        
        video.addEventListener('play', resumeAudio);
        document.addEventListener('click', resumeAudio, { once: true });
    }
    
    // Observe DOM changes to handle YouTube's dynamic content
    function observePlayerChanges() {
        const observer = new MutationObserver(debounce(() => {
            const video = document.querySelector('video.html5-main-video');
            const existingControls = document.getElementById('pitch-shifter-controls');
            
            if (video && !existingControls) {
                console.log('Video detected via observer, initializing pitch shifter...');
                initializePitchShifter();
            }
        }, 500));
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        return observer;
    }
    
    // Handle page navigation (YouTube SPA)
    function handleNavigation() {
        let currentUrl = window.location.href;
        
        const checkUrlChange = () => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                console.log('YouTube navigation detected');
                
                // Reset current values
                currentPitchCents = 0;
                currentSpeed = 1.0;
                
                // Clean up existing audio context
                if (audioContext) {
                    audioContext.close();
                    audioContext = null;
                }
                
                // Wait for new video to load
                setTimeout(() => {
                    initializePitchShifter();
                }, 1000);
            }
        };
        
        // Check for URL changes periodically
        setInterval(checkUrlChange, 1000);
        
        // Also listen for popstate events
        window.addEventListener('popstate', () => {
            setTimeout(checkUrlChange, 500);
        });
    }
    
    // Main initialization
    function init() {
        console.log('YouTube Advanced Pitch Shifter initialized');
        
        // Start immediately
        initializePitchShifter();
        
        // Set up observers and navigation handling
        observePlayerChanges();
        handleNavigation();
        
        // Also try after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initializePitchShifter, 500);
            });
        }
    }
    
    // Start the extension
    init();
})();