// ==UserScript==
// @name         YouTube Resume
// @version      1.3.2
// @description  Resume YouTube videos where you left off.
// @license      MIT
// @author       dreamyyy
// @match        *://www.youtube.com/*
// @exclude      *://www.youtube.com/tv*
// @exclude      *://www.youtube.com/live_chat*
// @run-at       document-end
// @noframes
// @namespace https://greasyfork.org/en/users/88735-lacour
// @downloadURL https://update.greasyfork.org/scripts/552007/YouTube%20Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/552007/YouTube%20Resume.meta.js
// ==/UserScript==

(function() {
  "use strict";

  var player = document.getElementById("movie_player");

  if (typeof player === undefined || player === null) {
    console.warn("[Youtube Resume] Player not defined.");
    return;
  }

  var video_id = player.getVideoData().video_id;
  var video_duration = player.getDuration();

  function saved_progress() {
    return GM_getValue("p_" + video_id, 0);
  }

  function save_progress() {
    GM_setValue("p_" + video_id, player.getCurrentTime());
  }

  function resume_progress() {
    var resume_to = saved_progress();
    var should_resume = true;

    if (video_duration > 0) {
      should_resume = (video_duration - resume_to) >= video_duration * 0.05;
    }

    if (resume_to > 10) {
      resume_to -= 5;
    }

    if (should_resume) {
      player.seekTo(resume_to, true);
    }
  }

  if (player.getCurrentTime() < 2) {
    resume_progress();
  }

  if (video_duration > 2 || video_duration === 0) {
    setInterval(save_progress, 1500);
  }
})();


// 使用 localStorage 作为存储后端
function GM_setValue(key, value) {
    try {
        const serializedValue = JSON.stringify({
            value: value,
            timestamp: Date.now()
        });
        localStorage.setItem(`gm_${key}`, serializedValue);
        return true;
    } catch (error) {
        console.error('GM_setValue failed:', error);
        return false;
    }
}

function GM_getValue(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(`gm_${key}`);
        if (item === null) return defaultValue;
        
        const parsed = JSON.parse(item);
        return parsed.value !== undefined ? parsed.value : defaultValue;
    } catch (error) {
        console.error('GM_getValue failed:', error);
        return defaultValue;
    }
}