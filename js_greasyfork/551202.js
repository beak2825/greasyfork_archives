// ==UserScript==
// @name        WaniKani Context Sentence Google TTS
// @namespace   michaelcharles
// @match       https://www.wanikani.com/vocabulary/*
// @match       https://www.wanikani.com/kanji/*
// @match       https://www.wanikani.com/radicals/*
// @match       https://www.wanikani.com/subjects/review
// @match       https://www.wanikani.com/subjects/*
// @match       https://www.wanikani.com/subject-lessons/*
// @grant       none
// @version     1.0.1
// @license     Apache, https://www.apache.org/licenses/LICENSE-2.0
// @author      MichaelCharl.es/Aubrey
// @description Add TTS buttons to context sentences on lesson pages.
// @downloadURL https://update.greasyfork.org/scripts/551202/WaniKani%20Context%20Sentence%20Google%20TTS.user.js
// @updateURL https://update.greasyfork.org/scripts/551202/WaniKani%20Context%20Sentence%20Google%20TTS.meta.js
// ==/UserScript==

(function() {
  // Configurable
  const ttsApiKey = 'YOUR_API_KEY_HERE'; // Your API key goes here.
  const speakingRate = 0.8; // where 1 is 100%
  const voice = "ja-JP-Neural2-C"; // "ja-JP-Neural2-B" and "ja-JP-Neural2-D" are also valid voices.
  // ------
  let audioElement = null;
  async function playTTS(text) {
    if (!text) return;
    try {
      const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=' + ttsApiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: text },
          voice: {
            languageCode: 'ja-JP',
            name: voice,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: speakingRate,
          },
        }),
      });
      const data = await response.json();
      if (data.audioContent) {
        if (audioElement) {
          audioElement.pause();
        }
        audioElement = new Audio('data:audio/mp3;base64,' + data.audioContent);
        audioElement.play();
      }
    } catch (error) {
      console.error('TTS error:', error);
    }
  }
  function addTTSButtons() {
    // Add buttons to context sentences
    const contextSentences = document.querySelectorAll('.subject-section--context .subject-section__text--grouped p[lang="ja"]');
    contextSentences.forEach(p => {
      if (p.querySelector('.tts-button')) return; // Already added
      const originalText = p.textContent; // Capture text before adding button
      const button = document.createElement('button');
      button.className = 'tts-button';
      button.innerHTML = '🔊';
      button.style.cssText = 'margin-left:10px;padding:0;cursor:pointer;border:none;background:none;font-size:1em;';
      button.addEventListener('click', () => playTTS(originalText));
      p.appendChild(button);
    });
    // Add buttons to common word combinations
    const collocations = document.querySelectorAll('.context-sentences p[lang="ja"]');
    collocations.forEach(p => {
      if (p.querySelector('.tts-button')) return; // Already added
      const originalText = p.textContent; // Capture text before adding button
      const button = document.createElement('button');
      button.className = 'tts-button';
      button.innerHTML = '🔊';
      button.style.cssText = 'margin-left:10px;padding:0;cursor:pointer;border:none;background:none;font-size:1em;';
      button.addEventListener('click', () => playTTS(originalText));
      p.appendChild(button);
    });
  }
  // Run when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    addTTSButtons();
    // Watch for dynamic content changes (if WaniKani uses AJAX)
    const observer = new MutationObserver(() => {
      addTTSButtons();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    console.log("WaniKani Lesson Context TTS ready!");
  }
})();

