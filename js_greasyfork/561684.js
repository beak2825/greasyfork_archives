// ==UserScript==
// @name         JW Player AutoConfig
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automatically enforces playback speed, preferred quality, fullscreen, and mute state on JW Player–based streaming sites. Works across multiple hosts and mirrors without site‑specific configuration. Inspired by Ghoste's HiAnime Auto 1080p script.
// @match        https://*/*
// @author       AliensStoleMyAntibodies
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI0OCIgc3R5bGU9ImZpbGw6IzAwQUVFRiIvPjxwb2x5Z29uIHBvaW50cz0iMTA0LDgwIDE3NiwxMjggMTA0LDE3NiIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjEyOCIgeT0iMjIwIiBmb250LXNpemU9IjQ4IiBmb250LWZhbWlseT0iQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiPkFVVE88L3RleHQ+PC9zdmc+
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561684/JW%20Player%20AutoConfig.user.js
// @updateURL https://update.greasyfork.org/scripts/561684/JW%20Player%20AutoConfig.meta.js
// ==/UserScript==


var pauseOnFocusLoss = false
// Set this to true if you want it to pause/unpause based on if you're looking at
// Valid Values: true, false.

var autoFocus = false
// If this is true, automatically focuses on the player once it begins playback (for keyboard shortcuts)
// Valid Values: true, false.

var autoUnmute = false
// If this is true, automatically unmutes the player if it starts muted.
// Valid Values: true, false.

var autoFullscreen = false
// Set this to true if you want the video to automatically go fullscreen.
// Valid Values: true, false.

var playbackQuality = "1080"
// Sets the Video Quality.
// Valid Values: 1080, 720, 360.

var playbackRate = 1
// Sets the Playback Speed.
// Valid Values: 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2. (higher might work)



function createPlayerAdapter(source) {
  // JW Player
  if (source && typeof source.getState === "function") {
    return {
      type: "jw",
      play: () => source.play(),
      pause: () => source.pause(),
      isPlaying: () => source.getState() === "playing",
      setRate: (r) => source.setPlaybackRate?.(r),
      setMute: (m) => source.setMute?.(m ? 1 : 0),
      fullscreen: () => source.setFullscreen?.(true),
      setQuality: (q) => selectQuality(source, q),
      onReady: (fn) => source.on("firstFrame", fn),
      onQualityChange: (fn) => source.on("levels", fn),
    };
  }

  // Native <video>
  if (source instanceof HTMLVideoElement) {
    return {
      type: "video",
      play: () => source.play().catch(() => {}),
      pause: () => source.pause(),
      isPlaying: () => !source.paused,
      setRate: (r) => {
        if (source.playbackRate !== r) source.playbackRate = r;
      },
      setMute: (m) => {
        source.muted = m;
      },
      fullscreen: () => {
        if (!document.fullscreenElement) {
          source.requestFullscreen?.().catch(() => {});
        }
      },
      setQuality: () => {}, // impossible natively
      onReady: (fn) => {
        if (source.readyState >= 2) fn();
        else source.addEventListener("playing", fn, { once: true });
      },
      onQualityChange: () => {},
    };
  }

  return null;
}


function applyAutoBehavior(adapter) {
  if (!adapter) return;

  adapter.onReady(() => {
    adapter.setRate(playbackRate);
    if (autoUnmute) adapter.setMute(false);
    if (autoFullscreen) adapter.fullscreen();
    adapter.setQuality(playbackQuality);
  });

  adapter.onQualityChange(() => {
    adapter.setQuality(playbackQuality);
  });

  if (pauseOnFocusLoss) {
    let wasPlaying = false;

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        wasPlaying = adapter.isPlaying();
        adapter.pause();
      } else if (wasPlaying) {
        adapter.play();
      }
    });
  }
}

function hookJWPlayers(onPlayer) {
  const seen = new Set();

  function scan() {
    if (typeof jwplayer !== "function") return;

    let players = [];

    try {
      // Official supported way
      players = jwplayer.getPlayers
        ? jwplayer.getPlayers()
        : [jwplayer()];
    } catch {
      return;
    }

    players.forEach((player) => {
      if (!player || !player.id) return;

      if (seen.has(player.id)) return;

      seen.add(player.id);
      onPlayer(player);
    });
  }

  // Scan repeatedly until players appear
  const interval = setInterval(scan, 500);

  // Stop aggressive scanning after 15s
  setTimeout(() => clearInterval(interval), 15000);
}

function hookNativeJWVideoFallback() {
  const seen = new Set();

  function scan() {
    if (!isTabVisible) return;

    document.querySelectorAll("video.jw-video").forEach((video) => {
      if (seen.has(video)) return;
      seen.add(video);

      console.log("JW native video fallback hooked");

      // Apply ONCE
      if (playbackRate && video.playbackRate !== playbackRate) {
        video.playbackRate = playbackRate;
      }

      if (autoUnmute && video.muted) {
        video.muted = false;
      }

      // Fullscreen only once, only if playing
      if (autoFullscreen && !document.fullscreenElement) {
        video.addEventListener(
          "playing",
          () => {
            if (isTabVisible) {
              video.requestFullscreen?.().catch(() => {});
            }
          },
          { once: true }
        );
      }

      // Pause handling (native fallback)
      if (pauseOnFocusLoss) {
        let wasPlaying = false;

        document.addEventListener("visibilitychange", () => {
          if (!isTabVisible) {
            wasPlaying = !video.paused;
            video.pause();
          } else if (wasPlaying) {
            video.play().catch(() => {});
          }
        });
      }
    });
  }

  setInterval(scan, 1000);
}

function hookNativeFallback() {
  const seen = new Set();

  setInterval(() => {
    document.querySelectorAll("video.jw-video").forEach((video) => {
      if (seen.has(video)) return;
      seen.add(video);

      // Only fallback if JW API is missing
      if (typeof jwplayer === "function") return;

      const adapter = createPlayerAdapter(video);
      applyAutoBehavior(adapter);
    });
  }, 1000);
}

hookJWPlayers((jw) => {
  const adapter = createPlayerAdapter(jw);
  applyAutoBehavior(adapter);
});

hookNativeFallback();
