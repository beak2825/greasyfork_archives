// ==UserScript==
// @name         Trakt.tv | Actor Pronunciation Helper
// @description  Adds a button on /people pages for fetching an audio recording of that person's name with the correct pronunciation from https://forvo.com
// @version      1.0.4
// @namespace    https://github.com/Fenn3c401
// @author       Fenn3c401
// @license      GPL-3.0-or-later
// @homepageURL  https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection#readme
// @supportURL   https://github.com/Fenn3c401/Trakt.tv-Userscript-Collection/issues
// @icon         https://trakt.tv/assets/logos/logomark.square.gradient-b644b16c38ff775861b4b1f58c1230f6a097a2466ab33ae00445a505c33fcb91.svg
// @match        https://trakt.tv/*
// @match        https://classic.trakt.tv/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @connect      forvo.com
// @downloadURL https://update.greasyfork.org/scripts/550069/Trakttv%20%7C%20Actor%20Pronunciation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/550069/Trakttv%20%7C%20Actor%20Pronunciation%20Helper.meta.js
// ==/UserScript==


'use strict';

let $, toastr;

const logger = {
  _defaults: {
    title: GM_info.script.name.replace('Trakt.tv', 'Userscript'),
    toast: true,
    toastrOpt: { positionClass: 'toast-top-right', timeOut: 10000, progressBar: true },
    toastrStyles: '#toast-container#toast-container a { color: #fff !important; border-bottom: dotted 1px #fff; }',
  },
  _print(fnConsole, fnToastr, msg = '', opt = {}) {
    const { title = this._defaults.title, toast = this._defaults.toast, toastrOpt, toastrStyles = '', consoleStyles = '', data } = opt,
          fullToastrMsg = `${msg}${data !== undefined ? ' See console for details.' : ''}<style>${this._defaults.toastrStyles + toastrStyles}</style>`;
    console[fnConsole](`%c${title}: ${msg}`, consoleStyles, ...(data !== undefined ? [data] : []));
    if (toast) toastr[fnToastr](fullToastrMsg, title, { ...this._defaults.toastrOpt, ...toastrOpt });
  },
  info(msg, opt) { this._print('info', 'info', msg, opt) },
  success(msg, opt) { this._print('info', 'success', msg, { consoleStyles: 'color:#00c853;', ...opt }) },
  warning(msg, opt) { this._print('warn', 'warning', msg, opt) },
  error(msg, opt) { this._print('error', 'error', msg, opt) },
};


addStyles();

document.addEventListener('turbo:load', () => {
  if (!/^\/people\/[^\/]+(\/lists.*)?$/.test(location.pathname)) return;

  $ ??= unsafeWindow.jQuery;
  toastr ??= unsafeWindow.toastr;
  if (!$ || !toastr) return;

  $(`<button id="btn-pronounce-name">` +
      `<div class="audio-animation fade">` +
        `<div class="bar-1"></div>` +
        `<div class="bar-2"></div>` +
        `<div class="bar-3"></div>` +
      `</div>` +
      `<div class="fa fa-volume fade in"></div>` +
    `</button>`
  ).appendTo($('#summary-wrapper .mobile-title h1')).tooltip({
    title: 'Pronounce Name',
    container: 'body',
    placement: 'top',
    html: true,
  }).one('click', async function() {
    $(this).tooltip('hide');

    const $btnPronounceName = $(this),
          name = $('body > [itemtype$="Person"] > meta[itemprop="name"]').attr('content') ?? $('#summary-wrapper .mobile-title > :last-child').text(); // fallback for /people/<slug>/lists pages

    unsafeWindow.showLoading?.();
    const fullNameAudio = await fetchAudio(name);
    const audios = fullNameAudio ? [fullNameAudio] : await Promise.all(name.split(/\s+/).map((namePart) => {
      return /^\w\.?$/.test(namePart) ? new SpeechSynthesisUtterance(namePart) : fetchAudio(namePart).then((res) => res ?? new SpeechSynthesisUtterance(namePart));
    }));
    unsafeWindow.hideLoading?.();

    if (audios.some((audio) => audio instanceof SpeechSynthesisUtterance)) {
      audios.forEach((audio) => { if (audio instanceof SpeechSynthesisUtterance) audio.lang = 'en-US'; });
      logger.warning(`Could not find a full pronunciation for "${name}" on ` +
                     `<a href="https://forvo.com/search/${encodeURIComponent(name)}" target="_blank"><strong>forvo.com</strong></a>. Falling back to TTS..`);
    }

    ['ended', 'end'].forEach((type) => {
      audios.slice(1).forEach((audio, i) => {
        audios[i]?.addEventListener(type, () => audio.play ? audio.play() : speechSynthesis.speak(audio));
      });
      audios.at(-1).addEventListener(type, () => {
        $btnPronounceName.find('.audio-animation').removeClass('in');
        setTimeout(() => $btnPronounceName.find('.fa').addClass('in'), 150);
      });
    });

    playAudios(audios, $btnPronounceName);
    $btnPronounceName.on('click', () => playAudios(audios, $btnPronounceName));
  });
}, { capture: true });


async function fetchAudio(query) {
  const resp = await GM.xmlHttpRequest({ url: `https://forvo.com/search/${encodeURIComponent(query)}` }),
        doc = new DOMParser().parseFromString(resp.responseText, 'text/html'),
        audioHttpHost = $(doc).find('body > script').text().match(/_AUDIO_HTTP_HOST='(.+?)'/)?.[1],
        audioPathsRaw = $(doc).find('[onclick^="Play"]').attr('onclick')?.match(/Play\([0-9]+,'(.*?)','(.*?)',(?:true|false),'(.*?)','(.*?)'/)?.slice(1),
        audioPaths = audioPathsRaw?.map((pathRaw, i) => pathRaw && ['/mp3/', '/ogg/', '/audios/mp3/', '/audios/ogg/'][i] + atob(pathRaw)).filter(Boolean).reverse();

  return audioPaths?.length ? $('<audio>' + audioPaths.map((path) => {
    return `<source src="https://${audioHttpHost}${path}" type="${path.endsWith('mp3') ? 'audio/mpeg' : 'audio/ogg; codecs=vorbis'}" />`;
  }).join('') + '</audio>')[0] : null;
}

function playAudios(audios, $btnPronounceName) {
  $btnPronounceName.find('.fa').removeClass('in');
  setTimeout(() => {
    $btnPronounceName.find('.audio-animation').addClass('in');
    audios.forEach((audio) => audio.load?.()); // for repeated playback; currentTime = 0 doesn't work for some audio files
    speechSynthesis.cancel();
    audios[0].play ? audios[0].play() : speechSynthesis.speak(audios[0]);
  }, 150);
}


function addStyles() {
  GM_addStyle(`
#btn-pronounce-name {
  margin: 0 0 2px 7px;
  position: relative;
  height: 20px;
  width: 20px;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-style: none;
  background-color: transparent;
}

#btn-pronounce-name .fa {
  position: absolute;
  font-size: 16px;
  color: #aaa;
}
#btn-pronounce-name:hover .fa {
  color: var(--link-color);
}

#btn-pronounce-name .audio-animation {
  position: absolute;
  height: 75%;
  width: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

#btn-pronounce-name .audio-animation [class^="bar-"] {
  flex: 1;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(180deg, rgb(255 0 0), rgb(155 66 200));
  transform: scaleY(0.2);
}

#btn-pronounce-name .in .bar-1 { animation: lineWave-1 .4s .3s infinite alternate; }
#btn-pronounce-name .in .bar-2 { animation: lineWave-2 .3s .2s infinite alternate; }
#btn-pronounce-name .in .bar-3 { animation: lineWave-3 .35s .25s infinite alternate; }

@keyframes lineWave-1 { from { transform: scaleY(0.24); } to { transform: scaleY(0.85); } }
@keyframes lineWave-2 { from { transform: scaleY(0.27); } to { transform: scaleY(0.98); } }
@keyframes lineWave-3 { from { transform: scaleY(0.24); } to { transform: scaleY(0.80); } }
  `);
}