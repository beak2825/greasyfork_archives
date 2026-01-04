// ==UserScript==
// @name         ACU VK DLC Scriptas
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Overlay Twitch player with VK embed
// @author       UgandanHobo
// @match        https://www.twitch.tv/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/550496/ACU%20VK%20DLC%20Scriptas.user.js
// @updateURL https://update.greasyfork.org/scripts/550496/ACU%20VK%20DLC%20Scriptas.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Channel -> VK embed base URL
  const channelMap = {
    "poorkiwi": "https://vkvideo.ru/video_ext.php?oid=-230429474&id=456239024&hash=5fc3f72c715ac08f&autoplay=1&hd=4&js_api=1",
    "finger_plasma": "https://vkvideo.ru/video_ext.php?oid=-230429399&id=456239020&hash=d1ade4e0a6b3989b&autoplay=1&hd=4&js_api=1",
    "warpcorebreachwallsfell": "https://vkvideo.ru/video_ext.php?oid=-232483180&id=456239017&hash=c6860ae4a01cc4c2&autoplay=1&hd=4&js_api=1"
  };

  let lastPath = null;
  let previousTwitchPlayer = null;
  let clickToEnableAudioHandler = null;

  function getChannelName() {
    const m = location.pathname.match(/^\/([^\/?#]+)/);
    return m ? m[1].toLowerCase() : null;
  }

  function hideTwitchPlayer(t) {
    if (!t) return;
    previousTwitchPlayer = t;
    t.dataset.oldStyle = t.getAttribute("style") || "";
    t.style.position = "absolute";
    t.style.top = "-10000px";
    t.style.left = "-10000px";
  }

  function restoreTwitchPlayer() {
    const t = previousTwitchPlayer || document.querySelector('.video-player');
    if (!t) return;
    if (t.dataset.oldStyle !== undefined) {
      t.setAttribute("style", t.dataset.oldStyle);
      delete t.dataset.oldStyle;
    } else {
      t.style.position = "";
      t.style.top = "";
      t.style.left = "";
    }
    previousTwitchPlayer = null;
  }

  function ensureVkApi(cb) {
    if (window.VK && window.VK.VideoPlayer) return cb();
    let s = document.getElementById('vk-api-script');
    if (!s) {
      s = document.createElement('script');
      s.id = 'vk-api-script';
      s.src = "https://vk.com/js/api/videoplayer.js";
      s.onload = cb;
      document.head.appendChild(s);
    } else {
      s.onload = cb; // in case it’s loading
    }
  }

  function trySet1080p(iframe) {
    // Best effort: URL already has hd=4; also try a postMessage nudge after init/start.
    try { iframe.contentWindow.postMessage({ method: "set_quality", quality: 4 }, "*"); } catch(e){}
    // Retry once more a bit later in case the stream qualities weren’t known yet.
    setTimeout(() => {
      try { iframe.contentWindow.postMessage({ method: "set_quality", quality: 4 }, "*"); } catch(e){}
    }, 1500);
  }

  function wireAudioAutoplayWorkaround(player) {
    // Immediate attempt after init
    try { player.unmute(); player.play && player.play(); } catch(e){}

    // If browser blocks autoplay with sound, VK emits AUTOPLAY_SOUND_PROHIBITED.
    const onBlocked = () => {
      // One-time global click to satisfy user-gesture requirement, then unmute+play.
      if (clickToEnableAudioHandler) return;
      clickToEnableAudioHandler = () => {
        try { player.unmute(); player.play && player.play(); } catch(e){}
        document.removeEventListener('click', clickToEnableAudioHandler, true);
        document.removeEventListener('touchstart', clickToEnableAudioHandler, true);
        clickToEnableAudioHandler = null;
      };
      document.addEventListener('click', clickToEnableAudioHandler, true);
      document.addEventListener('touchstart', clickToEnableAudioHandler, true);
    };

    player.on && player.on("autoplaySoundProhibited", onBlocked);
    // Some builds use lowercase event names; just in case:
    player.on && player.on("AUTOPLAY_SOUND_PROHIBITED", onBlocked);
  }

  function injectOverlay() {
    const channel = getChannelName();
    const t = document.querySelector('.video-player');
    const existing = document.getElementById('vk-overlay-frame');

    if (!channel || !(channel in channelMap)) {
      if (existing) existing.remove();
      restoreTwitchPlayer();
      return;
    }

    if (existing || !t) return;

    hideTwitchPlayer(t);

    const p = t.parentNode;
    const o = document.createElement('div');
    o.id = 'vk-overlay-frame';
    o.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:99999;background:#000;';
    p.style.position = 'relative';

    // Request autoplay + 1080p + API
    const src = channelMap[channel];

    const f = document.createElement('iframe');
    f.src = src;
    f.style.cssText = 'width:100%;height:100%;border:0;display:block;';
    f.setAttribute('frameborder', '0');
    f.setAttribute('allowfullscreen', '1');
    f.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture');

    o.appendChild(f);
    p.appendChild(o);

    ensureVkApi(() => {
      // Wait a tick for the iframe to be ready-ish
      const hook = () => {
        try {
          const player = VK.VideoPlayer(f);
          // Robust unmute: immediate + blocked-autoplay fallback via first user click.
          wireAudioAutoplayWorkaround(player);

          // Nudge quality to 1080p after init/start
          trySet1080p(f);

          // Also retry both actions right after "started"
          player.on && player.on("started", () => {
            trySet1080p(f);
            try { player.unmute(); } catch(e){}
          });

          // As a belt-and-suspenders, unmute again after 10s (your requested delay)
          setTimeout(() => { try { player.unmute(); } catch(e){} }, 10000);
        } catch (e) {
          // If VideoPlayer throws (iframe not ready yet), try again shortly
          setTimeout(hook, 500);
        }
      };
      hook();
    });
  }

  function tick() {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      injectOverlay();
    }
  }

  setInterval(tick, 800);
  injectOverlay();

})();