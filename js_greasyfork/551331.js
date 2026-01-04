// ==UserScript==
// @name         Add Instagram Video Progressbar (Improved)
// @namespace    https://greasyfork.org/en/users/1521486-budget2540
// @version      2.0.2
// @license      GNU AGPLv3
// @author       budget2540
// @description  Improved fork of "Add Instagram Video Progressbar" (original: jcunews). Adds keyboard seek & focus fixes, throttled pointer handling for better perf, robust DOM cleanup, persistent progressbar-height setting with menu commands, and improved unmute/story handling.
// @match        *://www.instagram.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551331/Add%20Instagram%20Video%20Progressbar%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551331/Add%20Instagram%20Video%20Progressbar%20%28Improved%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //===== CONFIGURATION BEGIN =====
  const CONFIG = {
    progressbar: {
      height: 6,             // in pixels. set to zero to hide
      color: '#fff',         // background color
      elapsedColor: '#f00',  // elapsed time color
      opacity: 0.66,         // progressbar opacity
      hudOpacity: 0.95       // HUD tooltip opacity
    },
    video: {
      disableLoop: true,     // disable video looping
      unmute: true           // automatically unmute videos
    },
    keyboard: {
      seekStep: 3            // seconds to seek per arrow key press (default)
    },
    ui: {
      updateInterval: 100,   // milliseconds between progress updates
      hudFadeDelay: 250,     // milliseconds before HUD fades out
    }
  };
  //===== CONFIGURATION END =====

  // ===== CORE STATE MANAGEMENT =====
  const State = {
    videoElementMap: new WeakMap(),        // maps video elements to their elapsed bar elements
    containerMap: new Map(),                // tracks all progressbar containers
    activeVideo: null,                      // currently focused/hovered video for keyboard controls
    keyHandlerInstalled: false,             // global keydown handler flag
    globalPointerHandlerInstalled: false,   // global pointermove handler flag
    lastHoveredContainer: null,             // last hovered container for optimization
    pointerMoveScheduled: false,            // rAF throttling flag
    lastPointerEvent: null,                 // cached pointer event
    domObserver: null,                      // MutationObserver for cleanup
    videoObserver: null,                    // MutationObserver for new videos
    originalAddEventListener: null,         // original HTMLVideoElement.addEventListener
    scrollHandlerInstalled: false,          // scroll handler flag
    scrollUpdateScheduled: false,           // throttling flag for scroll updates
    nextButton: null,
    loopObservers: new WeakMap()            // per-video mutation observers to guard against loop attr re-adding
  };

  // ===== UTILITY FUNCTIONS =====
  const Utils = {
    // Persistent settings with GM_getValue/GM_setValue fallback
    getProgressbarHeight() {
      try {
        if (typeof GM_getValue === 'function') {
          return Number(GM_getValue('aivp_height', CONFIG.progressbar.height));
        }
      } catch (ex) {
        console.warn('[AIVP] Failed to get height from storage:', ex);
      }
      return CONFIG.progressbar.height;
    },

    setProgressbarHeight(height) {
      try {
        if (typeof GM_setValue === 'function') {
          GM_setValue('aivp_height', height);
        }
      } catch (ex) {
        console.warn('[AIVP] Failed to save height to storage:', ex);
      }
      CONFIG.progressbar.height = height;
      this.applyHeightToExisting(height);
    },

    applyHeightToExisting(height) {
      const progressHeight = Number(height);
      const hitAreaHeight = progressHeight;
      
      document.querySelectorAll('div[id^="aivp"]').forEach(container => {
        try {
          container.style.height = `${hitAreaHeight}px`;
          
          const progressBar = container.querySelector('.aivp-elapsed');
          if (progressBar) {
            progressBar.style.height = `${progressHeight}px`;
          }
          
          const background = container.querySelector('.aivp-bg');
          if (background) {
            background.style.height = `${progressHeight}px`;
          }
          
          const hud = container.querySelector('.aivp-hud');
          if (hud) {
            hud.style.bottom = `${progressHeight + 6}px`;
          }
          
          const leftPreview = container.querySelector('.aivp-left');
          if (leftPreview) {
            leftPreview.style.bottom = `${progressHeight + 6}px`;
          }
        } catch (ex) {
          console.warn('[AIVP] Failed to update container height:', ex);
        }
      });
    },

    // Format seconds to HH:MM:SS or MM:SS
    formatTime(seconds) {
      if (!isFinite(seconds) || seconds < 0) return '0:00';
      
      const totalSeconds = Math.floor(seconds);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      
      const minutesStr = (minutes < 10 && hours > 0) ? `0${minutes}` : String(minutes);
      const secondsStr = secs < 10 ? `0${secs}` : String(secs);
      
      return hours > 0 
        ? `${hours}:${minutesStr}:${secondsStr}`
        : `${minutesStr}:${secondsStr}`;
    },

    // Generate unique ID for containers
    generateId() {
      return `aivp${Date.now()}`;
    },

    // Safe element query
    safeQuerySelector(element, selector) {
      try {
        return element?.querySelector(selector);
      } catch (ex) {
        return null;
      }
    },

    // Safe element query all
    safeQuerySelectorAll(element, selector) {
      try {
        return element?.querySelectorAll(selector) || [];
      } catch (ex) {
        return [];
      }
    },

    // Persistent seek-step (seconds) with GM_getValue/GM_setValue fallback
    getSeekStep() {
      try {
        if (typeof GM_getValue === 'function') {
          const v = Number(GM_getValue('aivp_seek_step', CONFIG.keyboard.seekStep));
          if (isFinite(v) && v > 0) return v;
        }
      } catch (ex) {
        console.warn('[AIVP] Failed to get seek step from storage:', ex);
      }
      return CONFIG.keyboard.seekStep;
    },

    setSeekStep(seconds) {
      try {
        const s = Number(seconds);
        if (!isFinite(s) || s <= 0) return;
        if (typeof GM_setValue === 'function') {
          GM_setValue('aivp_seek_step', s);
        }
        CONFIG.keyboard.seekStep = s;
      } catch (ex) {
        console.warn('[AIVP] Failed to save seek step to storage:', ex);
      }
    },

    // Debugging aid: log structured data
    logData(label, data) {
      console.log(`[AIVP] ${label}:`, JSON.stringify(data, null, 2));
    }
  };

  // ===== MENU COMMANDS =====
  const MenuCommands = {
    register() {
      try {
        if (typeof GM_registerMenuCommand !== 'function') return;

        GM_registerMenuCommand('Set AIVP progressbar height (px)', () => {
          const current = Utils.getProgressbarHeight();
          const input = prompt('Set progress bar height in pixels (0 to hide):', String(current));
          
          if (input === null) return;
          
          const value = parseInt(input, 10);
          if (isNaN(value) || value < 0) {
            alert('Invalid height value. Please enter a number >= 0.');
            return;
          }
          
          Utils.setProgressbarHeight(value);
          alert(`Progress bar height set to ${value}px`);
        });

        GM_registerMenuCommand('Reset AIVP progressbar height to default', () => {
          const defaultHeight = 6;
          Utils.setProgressbarHeight(defaultHeight);
          alert(`Progress bar height reset to default (${defaultHeight}px`);
        });

        // New commands for seek step configuration
        GM_registerMenuCommand('Set AIVP seek step (seconds)', () => {
          const current = Utils.getSeekStep();
          const input = prompt('Set seek step in seconds (e.g. 0.5, 1.5, 3):', String(current));
          if (input === null) return;
          const value = parseFloat(input);
          if (!isFinite(value) || value <= 0) {
            alert('Invalid seek step value. Please enter a number > 0.');
            return;
          }
          Utils.setSeekStep(value);
          alert(`Seek step set to ${value} second(s)`);
        });

        GM_registerMenuCommand('Reset AIVP seek step to default', () => {
          const defaultSeek = 3;
          Utils.setSeekStep(defaultSeek);
          alert(`Seek step reset to default (${defaultSeek} seconds)`);
        });
       } catch (ex) {
         console.warn('[AIVP] Failed to register menu commands:', ex);
       }
     }
   };

  // ===== KEYBOARD CONTROLS =====
  const KeyboardControls = {
    handleKeydown(event) {
      // Only react to left/right arrows and when not typing in an input
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.isContentEditable
      )) {
        return;
      }
      
      const video = State.activeVideo;
      if (!video || !isFinite(video.duration) || video.duration === 0) return;
      
      event.preventDefault();
      
      // Use persisted/configured seek step
      const step = Utils.getSeekStep();
      const delta = (event.key === 'ArrowLeft') ? -step : step;
      const newTime = Math.max(0, Math.min(video.duration, video.currentTime + delta));
      
      try {
        video.currentTime = newTime;
        
        // Update visual bar immediately
        const elapsedBar = State.videoElementMap.get(video);
        if (elapsedBar && elapsedBar.parentNode) {
          const container = elapsedBar.parentNode;
          const width = container.offsetWidth || 1;
          elapsedBar.style.width = `${Math.ceil((newTime / video.duration) * width)}px`;
        }
      } catch (ex) {
        console.warn('[AIVP] Failed to seek video:', ex);
      }
    },

    install() {
      if (State.keyHandlerInstalled) return;
      
      document.addEventListener('keydown', this.handleKeydown.bind(this), false);
      State.keyHandlerInstalled = true;
    }
  };

  // ===== POINTER/HOVER MANAGEMENT =====
  const PointerManager = {
    handleGlobalPointerMove(event) {
      // Only capture and schedule; actual processing happens in rAF to avoid running at full pointer frequency
      State.lastPointerEvent = event;
      
      if (!State.pointerMoveScheduled) {
        State.pointerMoveScheduled = true;
        requestAnimationFrame(() => this.processPointerMove());
      }
    },

    processPointerMove() {
      State.pointerMoveScheduled = false;
      const event = State.lastPointerEvent;
      State.lastPointerEvent = null;
      
      if (!event) return;
      
      try {
        const targetContainer = event.target?.closest?.('[id^="aivp"]');
        
        // Nothing changed, skip
        if (targetContainer === State.lastHoveredContainer) return;

        // Hide previous hovered container (if not dragging)
        if (State.lastHoveredContainer) {
          const prevState = State.containerMap.get(State.lastHoveredContainer);
          if (prevState && !prevState.dragging && prevState.hideHudDelayed) {
            prevState.hideHudDelayed(150);
          }
        }

        // Show new container if any
        if (targetContainer) {
          const newState = State.containerMap.get(targetContainer);
          if (newState?.showHud) {
            newState.showHud();
          }
          State.lastHoveredContainer = targetContainer;
        } else {
          State.lastHoveredContainer = null;
        }
      } catch (ex) {
        console.warn('[AIVP] Error processing pointer move:', ex);
      }
    },

    install() {
      if (State.globalPointerHandlerInstalled) return;
      
      try {
        const handler = (e) => this.handleGlobalPointerMove(e);
        document.addEventListener('pointermove', handler, { passive: true });
        State.globalPointerHandlerInstalled = true;
        State.pointerHandler = handler;
      } catch (ex) {
        console.warn('[AIVP] Failed to install pointer handler:', ex);
      }
    },

    uninstall() {
      if (!State.globalPointerHandlerInstalled) return;
      
      try {
        if (State.pointerHandler) {
          document.removeEventListener('pointermove', State.pointerHandler, { passive: true });
        }
        State.globalPointerHandlerInstalled = false;
        State.lastHoveredContainer = null;
      } catch (ex) {
        console.warn('[AIVP] Failed to uninstall pointer handler:', ex);
      }
    }
  };

  // ===== CONTAINER LIFECYCLE MANAGEMENT =====
  const ContainerManager = {
    register(container, state) {
      State.containerMap.set(container, state);
      
      // Install pointer handler once
      PointerManager.install();
      
      // Ensure DOM observer is running to clean up detached containers
      this.ensureDOMObserver();
    },

    unregister(container) {
      try {
        State.containerMap.delete(container);
      } catch (ex) {
        console.warn('[AIVP] Failed to unregister container:', ex);
      }
      
      // If no containers remain, cleanup
      if (State.containerMap.size === 0) {
        this.cleanup();
      }
    },

    ensureDOMObserver() {
      if (State.domObserver) return;
      
      try {
        State.domObserver = new MutationObserver(() => {
          this.cleanupDetachedContainers();
        });
        
        const root = document.documentElement || document.body || document;
        State.domObserver.observe(root, { childList: true, subtree: true });
      } catch (ex) {
        console.warn('[AIVP] Failed to create DOM observer:', ex);
      }
    },

    cleanupDetachedContainers() {
      try {
        for (const [container, state] of State.containerMap.entries()) {
          if (!document.contains(container)) {
            // Call optional cleanup helper on state if provided
            if (state?.cleanup) {
              try {
                state.cleanup();
              } catch (ex) {
                console.warn('[AIVP] Error in container cleanup:', ex);
              }
            }
            State.containerMap.delete(container);
          }
        }
        
        // If no containers remain, cleanup observers and handlers
        if (State.containerMap.size === 0) {
          this.cleanup();
        }
      } catch (ex) {
        console.warn('[AIVP] Error cleaning up detached containers:', ex);
      }
    },

    cleanup() {
      try {
        if (State.domObserver) {
          State.domObserver.disconnect();
          State.domObserver = null;
        }
        
        PointerManager.uninstall();
        ScrollManager.uninstall();
      } catch (ex) {
        console.warn('[AIVP] Error during cleanup:', ex);
      }
    }
  };

  // ===== VIDEO INTERACTION SETUP =====
  const VideoInteraction = {
    setupVideoFocus(video, container) {
      // Make the video/container the active target when hovered or focused
      try {
        container.tabIndex = 0;
        video.tabIndex = 0;
      } catch (ex) {
        console.warn('[AIVP] Failed to set tabIndex:', ex);
      }
      
      const setActive = () => { State.activeVideo = video; };
      const clearActive = () => { if (State.activeVideo === video) State.activeVideo = null; };
      
      container.addEventListener('mouseenter', setActive);
      container.addEventListener('mouseleave', clearActive);
      container.addEventListener('focus', setActive, true);
      container.addEventListener('blur', clearActive, true);
      video.addEventListener('mouseenter', setActive);
      video.addEventListener('mouseleave', clearActive);
    },

    setupSeekableProgressbar(video, container, elapsedBar) {
      const state = {
        dragging: false,
        hudFadeTimeout: 0
      };
      
      let wasPlaying = false;
      
      const hud = container.querySelector('.aivp-hud');
      const backgroundBar = container.querySelector('.aivp-bg');
      const leftPreview = container.querySelector('.aivp-left');
      
      // HUD management functions
      const showHud = () => {
        if (!hud) return;
        if (state.hudFadeTimeout) {
          clearTimeout(state.hudFadeTimeout);
          state.hudFadeTimeout = 0;
        }
        hud.style.opacity = CONFIG.progressbar.hudOpacity;
        if (leftPreview) leftPreview.style.opacity = 1;
      };
      
      const hideHudDelayed = (delay) => {
        if (!hud) return;
        if (state.hudFadeTimeout) clearTimeout(state.hudFadeTimeout);
        state.hudFadeTimeout = setTimeout(() => {
          if (hud) hud.style.opacity = 0;
          if (leftPreview) leftPreview.style.opacity = 0;
          state.hudFadeTimeout = 0;
        }, delay || CONFIG.ui.hudFadeDelay);
      };
      
      const updateHudPosition = (percent) => {
        if (!hud) return;
        const x = Math.ceil(percent * container.offsetWidth);
        hud.style.left = `${x}px`;
        if (leftPreview) leftPreview.style.left = `${x}px`;
        showHud();
      };
      
      const seekAtClientX = (clientX) => {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const w = rect.width || container.offsetWidth || 1;
        const percent = Math.max(0, Math.min(1, x / w));
        
        if (!isFinite(video.duration) || video.duration === 0) return;
        
        // Apply seek and update UI immediately
        video.currentTime = percent * video.duration;
        elapsedBar.style.width = `${Math.ceil(percent * container.offsetWidth)}px`;
        
        // Update HUD with formatted time and position
        if (hud) {
          hud.textContent = Utils.formatTime(video.currentTime);
          updateHudPosition(percent);
        }
        
        if (leftPreview && isFinite(video.duration) && video.duration > 0) {
          leftPreview.textContent = `${Utils.formatTime(video.currentTime)} / ${Utils.formatTime(video.duration)}`;
          leftPreview.style.opacity = 1;
        }
      };
      
      // Event handlers
      const onClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        seekAtClientX(e.clientX);
      };
      
      const onMouseDown = (e) => {
        e.stopPropagation();
        e.preventDefault();
        state.dragging = true;
        wasPlaying = !video.paused;
        seekAtClientX(e.clientX);
        document.addEventListener('mousemove', onMouseMove, { passive: false });
        document.addEventListener('mouseup', onMouseUp, { passive: false });
        showHud();
      };
      
      const onMouseMove = (e) => {
        if (!state.dragging) return;
        e.preventDefault();
        seekAtClientX(e.clientX);
      };
      
      const onMouseUp = (e) => {
        if (!state.dragging) return;
        e.preventDefault();
        seekAtClientX(e.clientX);
        state.dragging = false;
        document.removeEventListener('mousemove', onMouseMove, { passive: false });
        document.removeEventListener('mouseup', onMouseUp, { passive: false });
        if (wasPlaying) {
          try { video.play(); } catch (ex) { /* ignore */ }
        }
        hideHudDelayed(300);
      };
      
      // Show HUD on hover and update position
      container.addEventListener('mousemove', (e) => {
        if (state.dragging) return;
        const rect = container.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / (rect.width || 1)));
        
        if (hud && video && isFinite(video.duration) && video.duration > 0) {
          hud.textContent = Utils.formatTime(percent * video.duration);
          updateHudPosition(percent);
        }
        
        if (leftPreview && isFinite(video.duration) && video.duration > 0) {
          leftPreview.textContent = `${Utils.formatTime(percent * video.duration)} / ${Utils.formatTime(video.duration)}`;
          leftPreview.style.opacity = 1;
        }
        showHud();
      });
      
      container.addEventListener('mouseleave', () => {
        if (!state.dragging) hideHudDelayed(200);
      });
      
      // Wire up events on the progressbar container
      container.addEventListener('click', onClick);
      container.addEventListener('mousedown', onMouseDown, { passive: false });
      
      // Register this container's state
      state.showHud = showHud;
      state.hideHudDelayed = hideHudDelayed;
      state.hud = hud;
      state.leftPreview = leftPreview;
      state.cleanup = () => {
        try {
          if (state.hud && state.hud.parentNode) state.hud.style.opacity = 0;
        } catch (ex) { /* ignore */ }

        // Disconnect any per-video loop observer attached earlier
        try {
          const obs = State.loopObservers.get(video);
          if (obs) {
            obs.disconnect();
            State.loopObservers.delete(video);
          }
        } catch (ex) { /* ignore */ }

        // Remove any temporary markers on the video
        try {
          if (video && video.removeEventListener) {
            // We do not track individual handlers here beyond the MutationObserver
          }
        } catch (ex) { /* ignore */ }
      };
      
      ContainerManager.register(container, state);
    }
  };

  // ===== PROGRESSBAR CREATION AND SETUP =====
  const ProgressbarSetup = {
    // Main setup function called for each video
    setupVideo(video) {
      if (!video || !video.parentNode) return;
      
      // Handle video loop disabling
      if (CONFIG.video.disableLoop && !video.attributes.noloop) {
        this.disableLoopForVideo(video);
      }
      
      // Create progressbar UI
      const { container, elapsedBar } = this.createProgressbarUI(video);
      
      // Map video to its elapsed bar element
      State.videoElementMap.set(video, elapsedBar);
      
      // Attach the progressbar to the video's parent to avoid layout issues in some feeds
      const parent = video.parentNode;
      try {
        const computed = parent && parent.nodeType === 1 ? getComputedStyle(parent) : null;
        if (computed && computed.position === 'static') {
          parent.style.position = 'relative';
        }
      } catch (ex) { /* ignore */ }

      // Ensure the container sits above most IG overlays
      try { container.style.zIndex = '2147483647'; } catch (ex) { /* ignore */ }

      if (parent && parent.appendChild) {
        parent.appendChild(container);
      }
      
      // Setup interactions and controls
      VideoInteraction.setupVideoFocus(video, container);
      VideoInteraction.setupSeekableProgressbar(video, container, elapsedBar);
      this.setupVideoEventHandlers(video, elapsedBar);
      
      // Unmute if configured
      if (CONFIG.video.unmute && video.muted) {
        this.unmuteVideo(video);
      }
    },

    disableLoopForVideo(video) {
      try {
        // Find next button for stories
        State.nextButton = video.parentNode.parentNode?.parentNode?.parentNode?.lastElementChild;
        video.setAttribute('noloop', '');
        // Immediately ensure the loop attribute/property is removed
        try {
          video.loop = false;
          video.removeAttribute('loop');
        } catch (ex) {
          // ignore setting loop if browser prevents it
        }

        // Disconnect previously registered observer if existing
        try {
          const prevObs = State.loopObservers.get(video);
          if (prevObs) {
            prevObs.disconnect();
            State.loopObservers.delete(video);
          }
        } catch (ex) {
          /* ignore */
        }

        // Observe the video element for any attempts to re-add the loop attribute
        try {
          const attrObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
              if (m.type === 'attributes' && m.attributeName === 'loop') {
                try {
                  // Remove the attribute and ensure property is false
                  if (video.hasAttribute('loop')) video.removeAttribute('loop');
                  if (video.loop) video.loop = false;
                } catch (ex) {
                  /* ignore */
                }
              }
            }
          });

          attrObserver.observe(video, { attributes: true, attributeFilter: ['loop'] });
          State.loopObservers.set(video, attrObserver);
        } catch (ex) {
          console.warn('[AIVP] Failed to observe video loop attribute:', ex);
        }

        // As a final mitigation, ensure that when the video plays we re-assert loop=false
        const ensureNoLoopOnPlay = () => {
          try {
            if (video.loop) video.loop = false;
            if (video.hasAttribute('loop')) video.removeAttribute('loop');
          } catch (ex) { /* ignore */ }
        };
        video.addEventListener('play', ensureNoLoopOnPlay);

        // Attach a short timeout to enforce it immediately in case the attribute is set shortly after
        setTimeout(() => {
          try {
            if (video.loop) video.loop = false;
            if (video.hasAttribute('loop')) video.removeAttribute('loop');
          } catch (ex) { /* ignore */ }
        }, 50);

        // Find and fix play/pause buttons
        const roleElements = Utils.safeQuerySelectorAll(video.parentNode.parentNode, 'div[role]');
        roleElements.forEach(element => {
          Object.keys(element).some(key => {
            if (key.startsWith('__reactProps$')) {
              const props = element[key];
              if (props?.onClick && String(props.onClick).includes('pause')) {
                element.addEventListener('click', () => {
                  if (video.paused) video.play();
                });
                return true;
              }
            }
            return false;
          });
        });
      } catch (ex) {
        console.warn('[AIVP] Error disabling video loop:', ex);
      }
    },

    createProgressbarUI(video) {
      const containerId = Utils.generateId();
      const elapsedBarId = `${containerId}bar`;
      const progressHeight = Utils.getProgressbarHeight();
      const hitAreaHeight = progressHeight;
      
      const container = document.createElement('div');
      container.id = containerId;
      container.innerHTML = `<style>
#${containerId} { 
  position: absolute; 
  opacity: ${CONFIG.progressbar.opacity}; 
  left: 0; 
  right: 0; 
  bottom: 0; 
  height: ${hitAreaHeight}px; 
  background: transparent; 
  cursor: pointer; 
  z-index: 9999; 
}
#${elapsedBarId} { 
  position: absolute; 
  left: 0; 
  right: 0; 
  bottom: 0; 
  height: ${progressHeight}px; 
  width: 0; 
  transition: width 100ms linear; 
  background: ${CONFIG.progressbar.elapsedColor}; 
}
.aivp-bg { 
  position: absolute; 
  left: 0; 
  right: 0; 
  bottom: 0; 
  height: ${progressHeight}px; 
  background: ${CONFIG.progressbar.color}; 
  opacity: 0.25; 
}
.aivp-hud { 
  position: absolute; 
  left: 0; 
  transform: translateX(-50%); 
  bottom: ${progressHeight + 6}px; 
  background: rgba(0,0,0,0.75); 
  color: #fff; 
  padding: 2px 6px; 
  border-radius: 4px; 
  font-size: 12px; 
  pointer-events: none; 
  white-space: nowrap; 
  opacity: 0; 
  transition: opacity 120ms; 
  z-index: 10000; 
}
.aivp-left { 
  position: absolute; 
  left: 0; 
  transform: translateX(-50%); 
  bottom: ${progressHeight + 6}px; 
  background: rgba(0,0,0,0.75); 
  color: #fff; 
  padding: 2px 6px; 
  border-radius: 4px; 
  font-size: 12px; 
  pointer-events: none; 
  white-space: nowrap; 
  opacity: 0; 
  transition: opacity 120ms; 
  z-index: 10000; 
}
</style>
<div class="aivp-bg"></div>
<div id="${elapsedBarId}" class="aivp-elapsed"></div>
<div class="aivp-hud">0:00</div>
<div class="aivp-left">0:00 / 0:00</div>`;
      
      const elapsedBar = container.querySelector(`#${elapsedBarId}`);
      
      return { container, elapsedBar };
    },

    setupVideoEventHandlers(video, elapsedBar) {
      let updateTimer = null;
      
      const updateProgressBar = () => {
        if (!isFinite(video.duration) || video.duration === 0) return;
        const container = elapsedBar.parentNode;
        if (!container) return;
        const width = container.offsetWidth || 1;
        elapsedBar.style.width = `${Math.ceil((video.currentTime / video.duration) * width)}px`;
      };
      
      const startTimer = () => {
        // Set this video as the active video for keyboard controls
        State.activeVideo = video;
        
        if (CONFIG.video.disableLoop) {
          try { video.loop = false; } catch (ex) { /* ignore */ }
        }
        if (!updateTimer) {
          updateTimer = setInterval(updateProgressBar, CONFIG.ui.updateInterval);
        }
      };
      
      const stopTimer = (event) => {
        if (event.type === 'ended') {
          try {
            // Ensure video does not restart due to loop being set
            if (CONFIG.video.disableLoop) {
              try { video.pause(); } catch (e) { /* ignore */ }
              try { video.loop = false; } catch (e) { /* ignore */ }
              try { video.removeAttribute && video.removeAttribute('loop'); } catch (e) { /* ignore */ }
            }

            elapsedBar.style.width = '100%';

            // Advance story/next if available but allow UI to settle briefly
            if (CONFIG.video.disableLoop && State.nextButton) {
              setTimeout(() => {
                try { State.nextButton.click(); } catch (ex) { /* ignore */ }
              }, 80);
            }
          } catch (ex) {
            console.warn('[AIVP] Error handling ended event:', ex);
          }
        }
        
        // Update left preview when timer stopped
        try {
          const container = elapsedBar.parentNode;
          const leftPreview = container?.querySelector('.aivp-left');
          if (leftPreview) {
            leftPreview.textContent = `${Utils.formatTime(video.currentTime)} / ${Utils.formatTime(video.duration)}`;
          }
        } catch (ex) { /* ignore */ }
        
        if (updateTimer) {
          clearInterval(updateTimer);
          updateTimer = null;
        }
      };
      
      video.addEventListener('play', startTimer);
      video.addEventListener('playing', startTimer);
      video.addEventListener('waiting', stopTimer);
      video.addEventListener('pause', stopTimer);
      video.addEventListener('ended', stopTimer);
    },

    unmuteVideo(video) {
      try {
        if (location.pathname.startsWith('/stories/')) {
          const storyContainer = video.closest('div[style*="width"]')
            ?.parentNode?.closest('div[style*="width"]')
            ?.parentNode?.closest('div[style*="width"]');
          const muteButton = storyContainer?.querySelector('div[aria-label="Toggle audio"]');
          if (muteButton) muteButton.click();
        } else {
          const buttons = Utils.safeQuerySelectorAll(video.parentNode.parentNode, 'button');
          buttons.forEach(button => {
            Object.keys(button).some(key => {
              if (key.startsWith('__reactProps$')) {
                const props = button[key];
                if (props?.onClick && String(props.onClick).includes('AUDIO_STATES')) {
                  button.click();
                  return true;
                }
              }
              return false;
            });
          });
        }
      } catch (ex) {
        console.warn('[AIVP] Failed to unmute video:', ex);
      }
    }
  };

  // ===== VIDEO DISCOVERY AND MONITORING =====
  const VideoDiscovery = {
    ensureVideoHasProgressbar(video) {
      try {
        if (!video || String(video.tagName).toLowerCase() !== 'video') return;
        
        // Check if already initialized
        if (video.getAttribute('aivp_done')) {
          // If visual elements aren't created yet, and the video is ready, call setup now
          if (!State.videoElementMap.get(video) && video.readyState >= 2) {
            try {
              ProgressbarSetup.setupVideo(video);
            } catch (ex) {
              console.warn('[AIVP] Error setting up video:', ex);
            }
          }
          return;
        }
        
        // Mark as initialized
        video.setAttribute('aivp_done', '1');
        
        // If the video is already in a "can play" state, call setup immediately
        if (video.readyState >= 2) {
          try {
            ProgressbarSetup.setupVideo(video);
          } catch (ex) {
            console.warn('[AIVP] Error setting up video:', ex);
          }
        } else {
          // Wait for canplay event
          video.addEventListener('canplay', function onCanPlay() {
            try {
              ProgressbarSetup.setupVideo(video);
            } catch (ex) {
              console.warn('[AIVP] Error setting up video on canplay:', ex);
            }
            video.removeEventListener('canplay', onCanPlay);
          }, { once: true });
        }
      } catch (ex) {
        console.warn('[AIVP] Error ensuring video has progressbar:', ex);
      }
    },

    startMonitoring() {
      try {
        // Initial scan of existing videos
        const existingVideos = document.querySelectorAll('video');
        existingVideos.forEach(video => this.ensureVideoHasProgressbar(video));
        
        // Observe DOM for newly inserted video elements
        State.videoObserver = new MutationObserver((mutations) => {
          try {
            for (const mutation of mutations) {
              if (mutation.addedNodes && mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                  if (!node) continue;
                  
                  // If the added node is a video
                  if (node.tagName && String(node.tagName).toLowerCase() === 'video') {
                    this.ensureVideoHasProgressbar(node);
                  } else if (node.querySelectorAll) {
                    // Find any descendant videos
                    const descendantVideos = node.querySelectorAll('video');
                    descendantVideos.forEach(video => this.ensureVideoHasProgressbar(video));
                  }
                }
              }
            }
          } catch (ex) {
            console.warn('[AIVP] Error in video observer:', ex);
          }
        });
        
        // Observe large subtree
        const root = document.documentElement || document.body || document;
        State.videoObserver.observe(root, { childList: true, subtree: true });
      } catch (ex) {
        console.warn('[AIVP] Failed to start video monitoring:', ex);
      }
    }
  };

  // ===== SCROLL MANAGEMENT =====
  const ScrollManager = {
    handleScroll() {
      // Throttle scroll updates to avoid excessive processing
      if (!State.scrollUpdateScheduled) {
        State.scrollUpdateScheduled = true;
        requestAnimationFrame(() => {
          this.updateActiveVideoFromScroll();
          State.scrollUpdateScheduled = false;
        });
      }
    },

    updateActiveVideoFromScroll() {
      try {
        // Find all videos with progress bars that are in the document
        const videos = Array.from(State.videoElementMap.keys()).filter(video => {
          return video && document.contains(video) && video.readyState >= 2;
        });

        if (videos.length === 0) return;

        // Find the video closest to the center of the viewport
        const viewportCenter = window.innerHeight / 2;
        let closestVideo = null;
        let minDistance = Infinity;

        for (const video of videos) {
          const rect = video.getBoundingClientRect();
          // Skip videos that are not visible
          if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
          
          const videoCenter = rect.top + rect.height / 2;
          const distance = Math.abs(videoCenter - viewportCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestVideo = video;
          }
        }

        // Set the closest visible video as active
        if (closestVideo && closestVideo !== State.activeVideo) {
          State.activeVideo = closestVideo;
        }
      } catch (ex) {
        console.warn('[AIVP] Error updating active video from scroll:', ex);
      }
    },

    install() {
      if (State.scrollHandlerInstalled) return;
      
      try {
        const handler = () => this.handleScroll();
        window.addEventListener('scroll', handler, { passive: true });
        State.scrollHandlerInstalled = true;
        State.scrollHandler = handler;
      } catch (ex) {
        console.warn('[AIVP] Failed to install scroll handler:', ex);
      }
    },

    uninstall() {
      if (!State.scrollHandlerInstalled) return;
      
      try {
        if (State.scrollHandler) {
          window.removeEventListener('scroll', State.scrollHandler, { passive: true });
        }
        State.scrollHandlerInstalled = false;
      } catch (ex) {
        console.warn('[AIVP] Failed to uninstall scroll handler:', ex);
      }
    }
  };

  // ===== INITIALIZATION =====
  const init = () => {
    try {
      // Override HTMLVideoElement.prototype.addEventListener to hook into video lifecycle
      State.originalAddEventListener = HTMLVideoElement.prototype.addEventListener;
      HTMLVideoElement.prototype.addEventListener = function(type, ...args) {
        const result = State.originalAddEventListener.apply(this, [type, ...args]);
        
        // Ensure progressbar is added when video starts interacting with events
        if (!this.getAttribute('aivp_done')) {
          VideoDiscovery.ensureVideoHasProgressbar(this);
        }
        
        return result;
      };
      
      // Register menu commands
      MenuCommands.register();

      // Initialize keyboard seek step from storage
      try {
        CONFIG.keyboard.seekStep = Utils.getSeekStep();
      } catch (ex) { /* ignore */ }
       
       // Install keyboard controls
       KeyboardControls.install();

       // Install scroll handler for active video management
       ScrollManager.install();
       
       // Start monitoring for videos
       VideoDiscovery.startMonitoring();
       
       // Initial update of active video
       ScrollManager.updateActiveVideoFromScroll();
       
       console.log('[AIVP] Instagram Video Progressbar initialized successfully');
    } catch (ex) {
      console.error('[AIVP] Failed to initialize:', ex);
    }
  };

  // Start initialization
  init();
 })();
