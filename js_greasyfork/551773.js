// ==UserScript==
// @name        Pipeline Elevator Music
// @namespace   Violentmonkey Scripts
// @match       https://gitlab.pixul.co/*/-/pipelines/*
// @match       https://gitlab.pixul.co/*/-/jobs/*
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @license     MIT
// @author      p-sam
// @description Un peu de musique pour attendre confortablement la fin de la pipeline
// @version 0.0.1.20251014104100
// @downloadURL https://update.greasyfork.org/scripts/551773/Pipeline%20Elevator%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/551773/Pipeline%20Elevator%20Music.meta.js
// ==/UserScript==

const SONGS = [
    // Slack huddle hold music
    ['sc', 0.4, 'https://soundcloud.com/idan-avitan-885166524/slack-huddle-hold-music-as-is-no-extra-bass'],
    // Super Mario Land 1 - Birabuto Kingdom (Elevator remix)
    ['sc', 0.5, 'https://soundcloud.com/user-761512284/marios-elevator'],
    // Hades II - Lap of luxury
    ['bc', 0.25, 'https://supergiantgames.bandcamp.com/track/lap-of-luxury'],
    // Hotel Dusk Room 215 - Monochrome
    ['sc', 0.4, 'https://soundcloud.com/user-547465739/hotel-dusk_room-215-18-monochrome-18'],
    // Mario And Sonic 2016 - Rosalina's Comet Observatory
    ['sc', 0.3, 'https://soundcloud.com/faded_boo/rosalina-in-the-observatory-super-mario-galaxy'],
    // Animal Crossing New Leaf - 5 PM
    ['sc', 0.3, 'https://soundcloud.com/carnationplantation/5pm-animal-crossing-new-leaf'],
    // Super Smash Bros. Brawl - Trophy Gallery
    ['sc', 0.25, 'https://soundcloud.com/user-424706401/trophy-mode-super-smash-bros-brawl'],
    // Pokemon HG/SS - Saffron, Pewter & Viridian City
    ['sc', 0.3, 'https://soundcloud.com/alveus_x/saffron-pewter-viridian-city'],
    // Wii Shop channel
    ['sc', 0.25, 'https://soundcloud.com/bootlegfool/wii-shop-channel-original-music'],
    // Maplestory cash shop
    ['sc', 0.4, 'https://soundcloud.com/mmomusic/maplestory-cash-shop'],
    // Maplestory henesys
    ['sc', 0.4, 'https://soundcloud.com/mmomusic/maplestory-floral-life']
]

let lastRunning = false;
let lastSong = null;

async function httpGet(url) {
    const res = await new Promise((resolve, reject) => GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: resolve,
        onerror: reject
    }));

    return res.responseText;
}

async function jsonGet(url) {
    return JSON.parse(await httpGet(url));
}

class Song {
  constructor() {
      this._audio = document.createElement('audio');
  }

  addSource(url, mime) {
      const sourceEl = document.createElement('source');
      sourceEl.src = url;
      if(mime) {
          sourceEl.type = mime;
      }
      this._audio.appendChild(sourceEl);
  }

  async _tryPlay() {
      try {
          await this._audio.play();
      } catch(error) {
          console.warn('_tryPlay', error);
          this._playRetryTimeout = setTimeout(() => this._tryPlay(), 100);
      }
  }

  async stop() {
      try { this._audio.pause(); } catch {}
      try { document.body.removeChild(this._audio); } catch {}
  }

  async play(loop, volume = 1.0) {
      await this.stop();
      this._audio.autoplay = true;
      this._audio.volume = volume;
      this._audio.loop = true;
      try { this._audio.load(); } catch(error) { console.warn('load', error); }
      document.body.appendChild(this._audio);
      await this._tryPlay();
    }
}

async function loadSoundcloud(scurl) {
  const clientId = '2TbzkniijIjR2bzVmnakv77C05jctxtC';

  const json = await jsonGet(`https://api-widget.soundcloud.com/resolve?url=${scurl}&format=json&client_id=${clientId}`);

  const song = new Song();

  for(const transcoding of json.media.transcodings) {
      const url = new URL(transcoding.url);
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('track_authorization', json.track_authorization);

      const stream = await jsonGet(url.toString());
      song.addSource(stream.url, transcoding.format.mime_type);
  }

  return song;
}

async function loadBandcamp(bcurl) {
  const html = await httpGet(bcurl);

  const matches = html.match(/data-tralbum="(\{[^"]+\})"/);
  if(!matches) {
    throw new Error('bad bandcamp url');
  }

  const txtEl = document.createElement('textarea');
  txtEl.innerHTML = matches[1];
  const json = JSON.parse(txtEl.value);

  if(!json?.trackinfo?.[0]?.file) {
    throw new Error('bad bandcamp json info');
  }

  const song = new Song();
  for(const url of Object.values(json.trackinfo[0].file)) {
      song.addSource(url);
  }

  return song;
}

async function elevatorStop() {
  if(lastSong) {
    try { await lastSong?.stop(); } catch(error) { console.warn(error); }
    lastSong = null;
  }
}

async function elevatorPlay(idx) {
  await elevatorStop();

  if(typeof(idx) !== 'number' || idx < 0 || idx >= SONGS.length) {
    return;
  }

  const [type, volume, url] = SONGS[idx];

  switch(type) {
    case 'sc':
      lastSong = await loadSoundcloud(url);
      break;
    case 'bc':
      lastSong = await loadBandcamp(url);
      break;
    default:
      throw new Error('unknown song type');
  }

  await lastSong.play(true, volume);
}

function elevatorPlayRandom() {
  return elevatorPlay(Math.floor(Math.random() * SONGS.length));
}

function checkRun() {
  const ciIcon = document.querySelector('[data-testid="ci-icon"]');

  return ciIcon?.classList?.contains('ci-icon-variant-info') || ciIcon?.classList?.contains('ci-icon-variant-warning');
}


function loop() {
  const running = checkRun();

  if(lastRunning === running) {
    return;
  }

  lastRunning = running;

  if(running) {
    elevatorPlayRandom().catch(console.warn);
  } else {
    elevatorStop().catch(console.warn);
  }
}

setInterval(loop, 250);

unsafeWindow.$elevator = {
  play: elevatorPlay,
  playRandom: elevatorPlayRandom,
  stop: elevatorStop
};
