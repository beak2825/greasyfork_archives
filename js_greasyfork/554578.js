// ==UserScript==
// @name         TealMIDIPlayer (JMP only)
// @name:pt-BR   Tocador de MIDIs do Teal
// @homepage     https://ccjt.sad.ovh/
// @version      1.2.1
// @description  MIDI Player bot for MPP. (Based off of Teal's MIDI player)
// @description:pt-BR  Bot tocador de MIDIs para MPP. (Baseado no tocador de MIDIs do Teal)
// @author       ccjt
// @match        *://multiplayerpiano.net/*
// @match        *://multiplayerpiano.org/*
// @match        *://piano.mpp.community/*
// @match        *:///*
// @match        *://www.multiplayerpiano.dev/*
// @match        *://mpp.smp-meow.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_info
// @license      MIT
// @namespace    https://greasyfork.org/users/1459137
// @downloadURL https://update.greasyfork.org/scripts/554578/TealMIDIPlayer%20%28JMP%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554578/TealMIDIPlayer%20%28JMP%20only%29.meta.js
// ==/UserScript==

// change this however you like - mude isso para o que quiser
const prefix = "p."
// you'll have to use commands by starting with the characters in the text above. - você vai precisar usar comandos com os caracteres no texto acima.

const sep = '-'

const SCRIPT = GM_info.script
const name = SCRIPT.name
const version = SCRIPT.version
const author = SCRIPT.author
const link = SCRIPT.homepage

// JMIDIPlayer
// "THE BEER-WARE LICENSE" (Revision 42):
// <me@seq.wtf> wrote this file.
// As long as you retain this notice you can do whatever you want with this stuff.
// If we meet some day, and you think this stuff is worth it, you can buy me a beer in return.
// - James

const HEADER_LENGTH = 14;
const DEFAULT_TEMPO = 500000; // 120 bpm / 500ms/qn
const EVENT_SIZE = 8;
const EVENT_CODE = {
  NOTE_ON: 0x09,
  NOTE_OFF: 0x08,
  CONTROL_CHANGE: 0x0B,
  SET_TEMPO: 0x51,
  END_OF_TRACK: 0x2F
};

class JMIDIPlayer {
  // playback state
  #isPlaying = false;
  #currentTick = 0;
  #currentTempo = DEFAULT_TEMPO;
  #playbackWorker = null;

  // loading state & file data
  #isLoading = false;
  #totalEvents = 0;
  #totalTicks = 0;
  #songTime = 0;
  #ppqn = 0;
  #numTracks = 0;
  #timeMap = [];

  // configurable properties
  #playbackSpeed = 1; // multiplier

  // event listeners
  #eventListeners = {};

  constructor() {
    this.#eventListeners = {};
    this.#createWorker();
  }

  on(event, callback) {
    if (!this.#eventListeners[event]) {
      this.#eventListeners[event] = [];
    }
    this.#eventListeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.#eventListeners[event]) return;
    const index = this.#eventListeners[event].indexOf(callback);
    if (index > -1) {
      this.#eventListeners[event].splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.#eventListeners[event]) return;
    for (const callback of this.#eventListeners[event]) {
      callback(data);
    }
  }

  async loadArrayBuffer(arrbuf) {
    const start = performance.now();
    this.#isLoading = true;

    return new Promise((resolve, reject) => {
      const handleMessage = (e) => {
        const msg = e.data;

        if (msg.type === 'parseComplete') {
          this.#playbackWorker.removeEventListener('message', handleMessage);
          this.#isLoading = false;
          this.#totalEvents = msg.totalEvents;
          this.#totalTicks = msg.totalTicks;
          this.#songTime = msg.songTime;
          this.#ppqn = msg.ppqn;
          this.#numTracks = msg.numTracks;
          this.#timeMap = msg.timeMap;

          const parseTime = performance.now() - start;
          this.emit("fileLoaded", { parseTime });
          resolve([0, parseTime]); // [readTime, parseTime]
        } else if (msg.type === 'parseError') {
          this.#playbackWorker.removeEventListener('message', handleMessage);
          this.unload();
          reject(new Error(msg.error));
        }
      };

      this.#playbackWorker.addEventListener('message', handleMessage);

      // transfer the buffer to the worker
      this.#playbackWorker.postMessage({
        type: 'load',
        buffer: arrbuf
      }, [arrbuf]);
    });
  }

  async loadFile(file) {
    const arrbuf = await file.arrayBuffer();
    return this.loadArrayBuffer(arrbuf);
  }

  unload() {
    this.stop();

    if (this.#isLoading) {
      this.#isLoading = false;
    }

    this.#numTracks = 0;
    this.#ppqn = 0;
    this.#totalEvents = 0;
    this.#totalTicks = 0;
    this.#songTime = 0;
    this.#timeMap = [];
    this.#currentTick = 0;
    this.#currentTempo = DEFAULT_TEMPO / this.#playbackSpeed;

    if (this.#playbackWorker) {
      this.#playbackWorker.postMessage({
        type: 'unload'
      });
    }

    this.emit("unloaded");
  }

  play() {
    if (this.#isPlaying) return;
    if (this.#isLoading) return;
    if (this.#totalTicks === 0) throw new Error("No MIDI data loaded.");

    this.#isPlaying = true;
    this.#playbackWorker.postMessage({
      type: 'play'
    });
    this.emit("play");
  }

  pause() {
    if (!this.#isPlaying) return;

    this.#isPlaying = false;
    this.#playbackWorker.postMessage({
      type: 'pause'
    });
    this.emit("pause");
  }

  stop() {
    if (!this.#isPlaying && this.#currentTick === 0) return;

    const needsEmit = this.#currentTick > 0;

    this.#isPlaying = false;
    this.#currentTick = 0;
    this.#currentTempo = DEFAULT_TEMPO / this.#playbackSpeed;

    this.#playbackWorker.postMessage({
      type: 'stop'
    });

    if (needsEmit) this.emit("stop");
  }

  seek(tick) {
    if (this.#isLoading || this.#totalTicks === 0) return;

    tick = Math.min(Math.max(0, tick), this.#totalTicks);
    if (Number.isNaN(tick)) return;

    const wasPlaying = this.#isPlaying;
    if (wasPlaying) this.pause();

    this.#currentTick = tick;
    this.#playbackWorker.postMessage({
      type: 'seek',
      tick
    });

    this.emit("seek", {
      tick
    });

    if (wasPlaying) this.play();
  }

  #createWorker() {
    const workerCode = `
      const EVENT_SIZE = 8;
      const DEFAULT_TEMPO = 500000;
      const EVENT_CODE = { NOTE_ON: 0x09, NOTE_OFF: 0x08, CONTROL_CHANGE: 0x0B, SET_TEMPO: 0x51, END_OF_TRACK: 0x2F };
      const HEADER_LENGTH = 14;

      // parsed MIDI data
      let tracks = [];
      let ppqn = 0;
      let tempoEvents = [];
      let totalTicks = 0;
      let numTracks = 0;
      let format = 0;

      // playback state
      let playbackSpeed = 1;
      let isPlaying = false;
      let currentTick = 0;
      let currentTempo = DEFAULT_TEMPO;
      let trackEventPointers = [];
      let startTick = 0;
      let startTime = 0;
      let playLoopInterval = null;
      const sampleRate = 5; // ms

      function parseVarlen(view, offset) {
        let value = 0;
        let startOffset = offset;
        let checkNextByte = true;
        while (checkNextByte) {
          const currentByte = view.getUint8(offset);
          value = (value << 7) | (currentByte & 0x7F);
          ++offset;
          checkNextByte = !!(currentByte & 0x80);
        }
        return [value, offset - startOffset];
      }

      function parseTrack(view, trackOffset) {
        let eventIndex = 0;
        let capacity = 2048;
        let packedBuffer = new ArrayBuffer(capacity * EVENT_SIZE);
        let packedView = new DataView(packedBuffer);

        const trackTempoEvents = [];
        let totalTicks = 0;
        let currentTick = 0;
        let runningStatus = 0;

        const trackLength = view.getUint32(trackOffset + 4);
        let offset = trackOffset + 8;
        const endOffset = offset + trackLength;

        while (offset < endOffset) {
          const deltaTimeVarlen = parseVarlen(view, offset);
          offset += deltaTimeVarlen[1];
          currentTick += deltaTimeVarlen[0];

          let statusByte = view.getUint8(offset);
          if (statusByte < 0x80) {
            statusByte = runningStatus;
          } else {
            runningStatus = statusByte;
            ++offset;
          }

          const eventType = statusByte >> 4;
          let ignore = false;

          let eventCode, p1, p2, p3;

          switch (eventType) {
            case 0x8: // note off
            case 0x9: // note on
              eventCode = eventType;
              const note = view.getUint8(offset++);
              const velocity = view.getUint8(offset++);

              p1 = statusByte & 0x0F; // channel
              p2 = note;
              p3 = velocity;
              break;

            case 0xB: // control change
              eventCode = eventType;
              const ccNum = view.getUint8(offset++);
              const ccValue = view.getUint8(offset++);
              if (ccNum !== 64) ignore = true;

              p1 = statusByte & 0x0F; // channel
              p2 = ccNum;
              p3 = ccValue;
              break;

            case 0xA:   // polyphonic key pressure
            case 0xE:   // pitch wheel change
              ++offset; // fallthrough
            case 0xC:   // program change
            case 0xD:   // channel pressure
              ++offset;
              ignore = true;
              break;

            case 0xF: // system common / meta event
              if (statusByte === 0xFF) {
                const metaType = view.getUint8(offset++);
                const lengthVarlen = parseVarlen(view, offset);
                offset += lengthVarlen[1];

                switch (metaType) {
                  case 0x51: // set tempo
                    if (lengthVarlen[0] !== 3) {
                      ignore = true;
                    } else {
                      p1 = view.getUint8(offset);
                      p2 = view.getUint8(offset + 1);
                      p3 = view.getUint8(offset + 2);
                      const uspq = (p1 << 16) | (p2 << 8) | p3;
                      trackTempoEvents.push({ tick: currentTick, uspq: uspq });
                      eventCode = EVENT_CODE.SET_TEMPO;
                    }
                    break;
                  case 0x2F: // end of track
                    eventCode = EVENT_CODE.END_OF_TRACK;
                    offset = endOffset;
                    break;
                  default:
                    ignore = true;
                    break;
                }

                offset += lengthVarlen[0];
              } else if (statusByte === 0xF0 || statusByte === 0xF7) {
                ignore = true;
                const lengthVarlen = parseVarlen(view, offset);
                offset += lengthVarlen[0] + lengthVarlen[1];
              } else {
                ignore = true;
              }
              break;

            default:
              ignore = true;
              break;
          }

          if (!ignore) {
            if (eventIndex >= capacity) {
              capacity *= 2;
              const newBuffer = new ArrayBuffer(capacity * EVENT_SIZE);
              new Uint8Array(newBuffer).set(new Uint8Array(packedBuffer));
              packedBuffer = newBuffer;
              packedView = new DataView(packedBuffer);
            }

            const byteOffset = eventIndex * EVENT_SIZE;

            if (currentTick > 0xFFFFFFFF) {
              throw new Error(\`MIDI file too long! Track tick count exceeds maximum.\`);
            }

            packedView.setUint32(byteOffset, currentTick);
            packedView.setUint8(byteOffset + 4, eventCode);
            packedView.setUint8(byteOffset + 5, p1 || 0);
            packedView.setUint8(byteOffset + 6, p2 || 0);
            packedView.setUint8(byteOffset + 7, p3 || 0);

            ++eventIndex;
          }
        }

        packedBuffer = packedBuffer.slice(0, eventIndex * EVENT_SIZE);
        totalTicks = currentTick;

        return { packedBuffer, tempoEvents: trackTempoEvents, totalTicks };
      }

      function parseMIDI(buffer) {
        const view = new DataView(buffer);

        // HEADER
        const magic = view.getUint32(0);
        if (magic !== 0x4d546864) {
          throw new Error(\`Invalid MIDI magic! Expected 4d546864, got \${magic.toString(16).padStart(8, "0")}.\`);
        }

        const length = view.getUint32(4);
        if (length !== 6) {
          throw new Error(\`Invalid header length! Expected 6, got \${length}.\`);
        }

        format = view.getUint16(8);
        numTracks = view.getUint16(10);

        if (format === 0 && numTracks > 1) {
          throw new Error(\`Invalid track count! Format 0 MIDIs should only have 1 track, got \${numTracks}.\`);
        }

        if (format >= 2) {
          throw new Error(\`Unsupported MIDI format: \${format}.\`);
        }

        ppqn = view.getUint16(12);

        if (ppqn === 0) {
          throw new Error(\`Invalid PPQN/division value!\`);
        }

        if ((ppqn & 0x8000) !== 0) {
          throw new Error(\`SMPTE timecode format is not supported!\`);
        }

        // TRACK OFFSETS
        const trackOffsets = new Array(numTracks);
        let currentOffset = HEADER_LENGTH;

        for (let i = 0; i < numTracks; ++i) {
          if (currentOffset >= buffer.byteLength) {
            throw new Error(\`Reached EOF while looking for track \${i}. Tracks reported: \${numTracks}.\`);
          }

          const trackMagic = view.getUint32(currentOffset);
          if (trackMagic !== 0x4d54726b) {
            throw new Error(\`Invalid track \${i} magic! Expected 4d54726b, got \${trackMagic.toString(16).padStart(8, "0")}.\`);
          }

          const trackLength = view.getUint32(currentOffset + 4);
          trackOffsets[i] = currentOffset;
          currentOffset += trackLength + 8;
        }

        // PARSE TRACKS
        tracks = new Array(numTracks);
        totalTicks = 0;
        tempoEvents = [];

        for (let i = 0; i < numTracks; ++i) {
          const result = parseTrack(view, trackOffsets[i]);
          tracks[i] = {
            packedBuffer: result.packedBuffer,
            eventCount: result.packedBuffer.byteLength / EVENT_SIZE,
            view: new DataView(result.packedBuffer)
          };
          totalTicks = Math.max(totalTicks, result.totalTicks);
          result.tempoEvents.forEach(event => tempoEvents.push(event));
        }

        tempoEvents.sort((a, b) => a.tick - b.tick);

        const tempoMap = [{ tick: 0, uspq: DEFAULT_TEMPO }];

        for (const event of tempoEvents) {
          const lastTempo = tempoMap[tempoMap.length - 1];
          if (event.tick === lastTempo.tick) {
            lastTempo.uspq = event.uspq;
          } else {
            tempoMap.push(event);
          }
        }

        let totalMs = 0;
        const timeMap = [{ tick: 0, time: 0, uspq: DEFAULT_TEMPO }];

        for (let i = 0; i < tempoMap.length; ++i) {
          const lastTimeData = timeMap[timeMap.length-1];
          const lastUspq = lastTimeData.uspq;
          const currentTempoEvent = tempoMap[i];

          const ticksSinceLast = currentTempoEvent.tick - lastTimeData.tick;
          const msSinceLast = (ticksSinceLast * (lastUspq / 1000)) / ppqn;
          const cumulativeTime = lastTimeData.time + msSinceLast;

          timeMap.push({
            tick: currentTempoEvent.tick,
            time: cumulativeTime,
            uspq: currentTempoEvent.uspq
          });
        }

        const lastTimeData = timeMap[timeMap.length - 1];
        const ticksInFinalSegment = totalTicks - lastTimeData.tick;
        const msInFinalSegment = (ticksInFinalSegment * (lastTimeData.uspq / 1000)) / ppqn;
        totalMs = lastTimeData.time + msInFinalSegment;

        const songTime = totalMs / 1000;
        const totalEvents = tracks.map(t => t?.eventCount || 0).reduce((a, b) => a + b, 0);

        return { totalEvents, totalTicks, songTime, ppqn, numTracks, timeMap };
      }

      function findNextEventIndex(trackIndex, tick) {
        const track = tracks[trackIndex];
        if (track.eventCount === 0) return 0;

        let low = 0;
        let high = track.eventCount;

        while (low < high) {
          const mid = Math.floor(low + (high - low) / 2);
          const eventTick = track.view.getUint32(mid * EVENT_SIZE);

          if (eventTick < tick) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return low;
      }

      function getCurrentTick() {
        if (!startTime) return startTick;

        const tpms = ppqn / (currentTempo / 1000);
        const ms = performance.now() - startTime;

        return Math.round(tpms * ms) + startTick;
      }

      function playLoop() {
        if (!isPlaying) {
          clearInterval(playLoopInterval);
          playLoopInterval = null;
          return;
        }

        currentTick = getCurrentTick();

        if (tracks.every((track, i) => trackEventPointers[i] >= track.eventCount) || currentTick > totalTicks) {
          isPlaying = false;
          clearInterval(playLoopInterval);
          playLoopInterval = null;
          currentTick = 0;
          startTick = 0;
          startTime = 0;
          postMessage({ type: 'endOfFile' });
          return;
        }

        const eventPointers = [];
        let totalEventsToPlay = 0;

        for (let i = 0; i < tracks.length; ++i) {
          const track = tracks[i];
          if (!track) continue;

          let ptr = trackEventPointers[i];
          const startPtr = ptr;

          while (ptr < track.eventCount && track.view.getUint32(ptr * EVENT_SIZE) <= currentTick) {
            const eventData = track.view.getUint32((ptr * EVENT_SIZE) + 4);
            const eventTypeCode = eventData >> 24;

            // handle tempo changes immediately
            if (eventTypeCode === EVENT_CODE.SET_TEMPO) {
              const eventTick = track.view.getUint32(ptr * EVENT_SIZE);
              const uspq = eventData & 0xFFFFFF;
              const oldTempo = currentTempo * playbackSpeed;
              const msAfterTempoEvent = ((currentTick - eventTick) * (oldTempo / 1000)) / ppqn;

              startTick = eventTick;
              startTime = performance.now() - msAfterTempoEvent;
              currentTempo = uspq / playbackSpeed;
            }
            ++ptr;
          }

          const numEventsInTrack = ptr - startPtr;
          if (numEventsInTrack > 0) {
            eventPointers.push({ trackIndex: i, start: startPtr, count: numEventsInTrack });
            totalEventsToPlay += numEventsInTrack;
          }
        }

        if (totalEventsToPlay > 0) {
          const buffer = new ArrayBuffer(totalEventsToPlay * EVENT_SIZE);
          const destView = new Uint8Array(buffer);
          let destOffset = 0;

          for (const pointer of eventPointers) {
            const track = tracks[pointer.trackIndex];
            const sourceByteOffset = pointer.start * EVENT_SIZE;
            const sourceByteLength = pointer.count * EVENT_SIZE;

            const sourceView = new Uint8Array(track.packedBuffer, sourceByteOffset, sourceByteLength);

            destView.set(sourceView, destOffset);
            destOffset += sourceByteLength;

            trackEventPointers[pointer.trackIndex] += pointer.count;
          }
          postMessage({ type: 'events', buffer: buffer, currentTick }, [buffer]);
        }
      }

      self.onmessage = function(e) {
        const msg = e.data;

        try {
          switch (msg.type) {
            case 'load':
              const result = parseMIDI(msg.buffer);
              trackEventPointers = new Array(tracks.length).fill(0);
              currentTick = 0;
              currentTempo = DEFAULT_TEMPO / playbackSpeed;
              postMessage({
                type: 'parseComplete',
                totalEvents: result.totalEvents,
                totalTicks: result.totalTicks,
                songTime: result.songTime,
                ppqn: result.ppqn,
                numTracks: result.numTracks,
                timeMap: result.timeMap
              });
              break;

            case 'unload':
              tracks = [];
              ppqn = 0;
              tempoEvents = [];
              totalTicks = 0;
              numTracks = 0;
              trackEventPointers = [];
              currentTick = 0;
              currentTempo = DEFAULT_TEMPO / playbackSpeed;
              isPlaying = false;
              if (playLoopInterval) {
                clearInterval(playLoopInterval);
                playLoopInterval = null;
              }
              break;

            case 'play':
              if (isPlaying) return;
              if (tracks.length === 0) return;
              isPlaying = true;
              startTime = performance.now();
              playLoopInterval = setInterval(playLoop, sampleRate);
              break;

            case 'pause':
              if (!isPlaying) return;
              isPlaying = false;
              clearInterval(playLoopInterval);
              playLoopInterval = null;
              startTick = getCurrentTick();
              currentTick = startTick;
              startTime = 0;
              postMessage({ type: 'tickUpdate', tick: currentTick });
              break;

            case 'stop':
              isPlaying = false;
              clearInterval(playLoopInterval);
              playLoopInterval = null;
              currentTick = 0;
              startTick = 0;
              startTime = 0;
              currentTempo = DEFAULT_TEMPO / playbackSpeed;
              break;

            case 'seek':
              const tick = msg.tick;

              // binary search for tempo
              if (tempoEvents.length > 0) {
                let low = 0;
                let high = tempoEvents.length - 1;
                let bestMatch = -1;

                while (low <= high) {
                  const mid = Math.floor(low + (high - low) / 2);
                  if (tempoEvents[mid].tick <= tick) {
                    bestMatch = mid;
                    low = mid + 1;
                  } else {
                    high = mid - 1;
                  }
                }

                currentTempo = ((bestMatch !== -1) ? tempoEvents[bestMatch].uspq : DEFAULT_TEMPO) / playbackSpeed;
              }

              for (let i = 0; i < tracks.length; ++i) {
                trackEventPointers[i] = findNextEventIndex(i, tick);
              }

              currentTick = tick;
              startTick = tick;
              postMessage({ type: 'tickUpdate', tick });
              break;

            case 'setPlaybackSpeed':
              const oldSpeed = playbackSpeed;
              playbackSpeed = msg.speed;

              if (isPlaying) {
                const tick = getCurrentTick();
                currentTempo = (currentTempo * oldSpeed) / playbackSpeed;
                startTick = tick;
                startTime = performance.now();
              }
              break;
          }
        } catch (error) {
          console.error(error);
          postMessage({ type: 'parseError', error: error.message });
        }
      };
    `;

    const blob = new Blob([workerCode], {
      type: 'application/javascript'
    });
    const workerUrl = URL.createObjectURL(blob);
    this.#playbackWorker = new Worker(workerUrl);

    this.#playbackWorker.onmessage = (e) => {
      const msg = e.data;

      switch (msg.type) {
        case 'events':
          this.#currentTick = msg.currentTick;

          const view = new DataView(msg.buffer);
          const numEvents = msg.buffer.byteLength / EVENT_SIZE;

          for (let i = 0; i < numEvents; i++) {
            const byteOffset = i * EVENT_SIZE;
            const eventTick = view.getUint32(byteOffset);
            const eventData = view.getUint32(byteOffset + 4);

            const eventTypeCode = eventData >> 24;
            const event = {
              tick: eventTick
            };

            switch (eventTypeCode) {
              case EVENT_CODE.NOTE_ON:
              case EVENT_CODE.NOTE_OFF:
                event.type = eventTypeCode;
                event.channel = (eventData >> 16) & 0xFF;
                event.note = (eventData >> 8) & 0xFF;
                event.velocity = eventData & 0xFF;
                break;
              case EVENT_CODE.CONTROL_CHANGE:
                event.type = 0x0B;
                event.channel = (eventData >> 16) & 0xFF;
                event.ccNum = (eventData >> 8) & 0xFF;
                event.ccValue = eventData & 0xFF;
                break;
              case EVENT_CODE.SET_TEMPO:
                event.type = 0xFF;
                event.metaType = 0x51;
                event.uspq = eventData & 0xFFFFFF;
                this.#currentTempo = event.uspq / this.#playbackSpeed;
                this.emit("tempoChange");
                break;
              case EVENT_CODE.END_OF_TRACK:
                event.type = 0xFF;
                event.metaType = 0x2F;
                break;
            }

            this.emit("midiEvent", event);
          }
          break;

        case 'endOfFile':
          this.#isPlaying = false;
          this.#currentTick = 0;
          this.emit("endOfFile");
          this.emit("stop");
          break;

        case 'tickUpdate':
          this.#currentTick = msg.tick;
          break;
      }
    };

    this.#playbackWorker.onerror = (error) => {
      console.error('Worker error:', error);
    };
  }

  getTimeAtTick(tick) {
    if (!this.#timeMap || this.#timeMap.length === 0 || this.#ppqn === 0) {
      return 0;
    }

    let low = 0;
    let high = this.#timeMap.length - 1;
    let bestMatchIndex = 0;

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);
      const midTick = this.#timeMap[mid].tick;

      if (midTick <= tick) {
        bestMatchIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const segment = this.#timeMap[bestMatchIndex];

    const ticksSinceSegmentStart = tick - segment.tick;
    const msSinceSegmentStart = (ticksSinceSegmentStart * (segment.uspq / 1000)) / this.#ppqn;

    const totalMs = segment.time + msSinceSegmentStart;
    return totalMs / 1000;
  }


  get isLoading() {
    return this.#isLoading;
  }

  get isPlaying() {
    return this.#isPlaying;
  }

  get trackCount() {
    return this.#numTracks;
  }

  get songTime() {
    return this.#songTime;
  }

  get ppqn() {
    return this.#ppqn;
  }

  get currentTempo() {
    return 60_000_000 / this.#currentTempo;
  }

  get totalEvents() {
    return this.#totalEvents;
  }

  get totalTicks() {
    return this.#totalTicks;
  }

  get currentTick() {
    return this.#currentTick;
  }

  get playbackSpeed() {
    return this.#playbackSpeed;
  }

  set playbackSpeed(speed) {
    speed = +speed;
    if (Number.isNaN(speed)) throw new Error("Playback speed must be a valid number!");
    if (speed <= 0) throw new Error("Playback speed must be a positive number!");

    const oldSpeed = this.#playbackSpeed;
    if (speed === oldSpeed) return;

    this.#playbackSpeed = speed;

    if (this.#playbackWorker) {
      this.#playbackWorker.postMessage({
        type: 'setPlaybackSpeed',
        speed
      });
    }
  }
}

let player = new JMIDIPlayer()

const charLimit = 512
function send(msg, reply, replyTo) {
    if (typeof msg == "string") {
        msg = msg
    } else {
        msg = JSON.stringify(msg)
    }
    msg = "⇀ " + msg
    if (msg.length > charLimit) {
        for (let i = 0; i < Math.floor(msg.length / charLimit) + 1; i++) {
            MPP.chat.send(msg.slice(charLimit * i, charLimit * (i + 1)));
        }
    } else {
        MPP.chat.send(msg)
    }
}
function midiLoading() {
    if (!player.isPlaying) MPP.press('as3', 1);
    setTimeout(() => {
        MPP.release('as3');
        if (!player.isPlaying) MPP.press('cs4', 1)
    }, 250);
    setTimeout(() => {
        MPP.release('cs4');
        if (!player.isPlaying) MPP.press('fs4', 1)
    }, 500);
    setTimeout(() => {
        MPP.release('fs4');
    }, 750);
    setTimeout(() => {
        MPP.release('c4')
    }, 1000)
}
let loadnotes
function loadNotes(start) {
    if (start) {
        midiLoading()
        loadnotes = setInterval(midiLoading, 1e3)
    }
    else clearInterval(loadnotes)
}
function validUrl(url) {
    let result
    try {
        new URL(url)
        result = true
    }
    catch {
        result = false
    }
    return result
}
const signal = new AbortController().signal
async function loadStuff(a, url, id) {
    function validMidi(arrbuf) {
        const decoder = new TextDecoder('utf8');
        let textdata = decoder.decode(arrbuf);
        if (textdata.startsWith('MThd')) return true
        else return false
    }
    let out = await a.arrayBuffer();
    if (validMidi(out)) return out
    else throw new Error('The file provided is invalid, as it doesn\'t start with the header `MThd`.')
}
let playing = {}
async function playMidiFromUrl(url, id) {
    let fetchtime
    let fetchstart
    let parsetime
    loadNotes(true)
    setTimeout(()=>{}, 50)
    let result
    fetchtime = 0
    fetchstart = Date.now()
    console.log('trying to play', url)
    if (validUrl(url)) {
        if (player.isPlaying) {
            player.stop();
            player.unload()
        }
        try {
            fetch(url, {
                method: 'get',
                signal: signal
            }).then(async (a) => {
                try {
                    let out = await loadStuff(a, url, id)
                    return out
                } catch (err) {
                    send("There was an error when playing the file. " + sep + " Error: " + err.message)
                    console.log(err)
                    loadNotes(false)
                    return false
                }
            }).then(async a => {
                fetchtime = Date.now() - fetchstart
                if (a) {
                    let parsestart = Date.now()
                    try {
                        await player.loadArrayBuffer(a)
                        player.play()
                        parsetime = Date.now() - parsestart
                    }
                    catch (err) {
                        parsetime = Date.now() - parsestart
                        result = false
                        send("There was an error when playing the file. ||" + err + "||")
                        console.log(err)
                        loadNotes(false)
                        return
                    }
                    console.log("Fetch time: " + fetchtime + "ms\nParse time: " + parsetime + "ms")
                    send("Fetched MIDI in " + fetchtime + "ms. " + sep + " Parsed MIDI in " + parsetime + "ms. " + sep + " Now playing `" + decodeURIComponent(url.split("/")[url.split("/").length - 1]) + "`.")
                    playing.url = url
                    loadNotes(false)
                } else {
                    loadNotes(false)
                    return
                }
            })
        } catch (err) {
            result = false
            send('Error')
            loadNotes(false)
        }
    } else {
        result = false
        send("There was an error when playing the file. ||Invalid URL||")
    }
    loadNotes(false)
    return result
}
let looping = false
let sustain = false
let transpose = 0
let volume = 1
let jevents = {
    noteon: 9,
    noteoff: 8,
    ctrlChange: 0x0B,
    setTempo: 0x51,
    end: 0x2F,
    meta: 0xFF
};
let eventsplayed = 0
let keys = Object.keys(MPP.piano.keys)
let currenttick
player.on('midiEvent', (event) => {
    eventsplayed++
    currenttick = event.tick
    if (event.type == jevents.noteon && event.velocity !== 0 && event.channel !== 9) {
        MPP.press(keys[event.note - 21 + transpose], (event.velocity / 127) * volume)
    } else if (event.type == jevents.noteoff || event.velocity == 0) {
        if (!sustain) MPP.release(keys[event.note - 21 + transpose])
    }
})
player.on('endOfFile', async () => {
    if (looping) {
        setTimeout(()=>{
            eventsplayed = 0;
            player.seek(0);
            player.play();
        }, 15)
    } else {
        loadNotes(false)
        send("Finished playing track. Duration: `" + player.songTime.toFixed(2) + "s` " + sep + " Played `" + eventsplayed + "` out of `" + player.totalEvents + "` (" + (eventsplayed / player.totalEvents * 100).toFixed(2) + "%) events.")
        MPP.client.sendArray([{
            m: "n",
            n: stopnotes
        }])
        eventsplayed = 0
        sustain = false
    }
})
let stopnotes = []
for (let i = 0; i < keys.length; i++) {
    stopnotes.push({
        'n': keys[i],
        's': 1
    })
}

let cmds = {
    help: {
        aliases: ['h'],
        about: "Shows commands and command info.",
        func: (...args) => {
            let ogcmd = args[0]
            if (args.length == 1)
                send(`Commands ${sep} ${createcmdstr()} ${sep} Use \`${ogcmd} <command name>\` to get info about a specific command.`)
            else
                if (Object.keys(cmds).includes(args[1])) {
                    console.log(cmds[args[1]])
                    let cmdinfo = cmds[args[1]]
                    let aliases = cmdinfo.aliases.length > 0 ? `${prefix}${cmdinfo.aliases.join(", " + prefix)}` : "*(none)*"
                    send(`${args[1]} ${sep} Description: ${cmdinfo.about} ${sep} Aliases: ${aliases}`)
                } else send("That command doesn't exist.")
        }
    },
    about: {
        aliases: ['ab'],
        about: "Tells info about the script.",
        func: (...args) => {
            send(`${name} v${version} by ${author} ${sep} ccjt's site: ${link} ${sep} JMIDIPlayer module originally made by seq.wtf ${sep} Get this userscript at https://greasyfork.org/en/scripts/554578-jmidiplayer`)
        }
    },
    play: {
        aliases: ['p'],
        about: "Plays a MIDI file from the web.",
        func: (...args) => {
            let ogcmd = args[0]
            if (args.length === 1)
                send(`Please specify a direct download URL to the desired MIDI file to play. ${sep} Usage: \`${ogcmd} <URL>\``)
            else {
                function getFileName(url) {
                    let filename = ""
                    filename = url.split('/')
                    filename = filename[filename.length - 1]
                    filename = decodeURIComponent(filename)
                    return filename
                }
                player.stop()
                send("Downloading...")
                playing.name = getFileName(args[1])
                playMidiFromUrl(args[1])
            }
        }
    },
    stop: {
        aliases: ['s'],
        about: "Stops the current track.",
        func: (...args) => {
            loadNotes(false)
            player.stop()
            send("Stopped playing.")
        }
    },
    volume: {
        aliases: ['vol', 'v'],
        about: "Adjusts track volume.",
        func: (...args) => {
            let ogcmd = args[0]
            if (args.length === 1) {
                send(`Please specify a volume to set to. ${sep} Range: \`0.0 to 1.0\` ${sep} Usage: \`${ogcmd} <volume from 0.0 to 1.0>\``)
            } else {
                args[1] = parseFloat(args[1])
                if (args[1] >= 0 && args[1] <= 1) {
                    volume = args[1]
                    send(`Volume set to \`${volume}\`.`)
                } else {
                    send("That value is out of range. Please specify a value between `0.0` and `1.0`.")
                }
            }
        }
    },
    pause: {
        aliases: ['pa'],
        about: "Pauses and resumes a track.",
        func: (...args) => {
            if (!player.isLoading && player.trackCount > 0) {
                if (player.isPlaying) {
                    player.pause()
                    send("Paused track.")
                } else {
                    player.play()
                    send("Resumed track.")
                }
            } else send("Nothing loaded yet.")
        }
    },
    resume: {
        aliases: ['re'],
        about: "Resumes a track.",
        func: (...args) => {
            if (!player.isLoading && player.trackCount > 0) {
                player.play()
                send("Resumed track.")
            } else send("Nothing loaded yet.")
        }
    },
    transpose: {
        aliases: ['tr'],
        about: "Changes the key of the current track.",
        func: (...args) => {
            let ogcmd = args[0]
            if (args.length === 1)
                send(`Please specify a value between \`-24\` and \`36\`. ${sep} Usage: \`${ogcmd} <value>\``)
            else {
                args[1] = parseInt(args[1])
                if (isNaN(args[1]))
                    send("Please specify a *number*.")
                else
                    if (args[1] > 36 || args[1] < -24)
                        send("Please specify a value under `36` and above `-24`.")
                    else {
                        transpose = args[1]
                        send(`Transposition set to \`${transpose}\`. ||Note that this will reset after the track has finished.||`)
                    }
            }
        }
    },
    loop: {
        aliases: ['l'],
        about: "Toggles looping.",
        func: (...args) => {
            looping = !looping
            if (looping) send("Now looping track.")
            else send("Stopped looping track.")
        }
    },
    track: {
        aliases: ["t"],
        about: "Shows info about the current playing track.",
        func: (...args) => {
            if (!player.isLoading && player.trackCount > 0) {
                let remaining = ((currenttick * (60 * 1000 / (player.currentTempo * player.ppqn)) / 1000) / player.songTime) * 100
                let progressbar = []
                for (let i = 0; i < remaining / 10; i++) {
                    progressbar.push('█')
                }
                let secondsstr = ""
                let played = currenttick * (60 * 1000 / (player.currentTempo * player.ppqn)) / 1000
                let playedsecondsstr = ""
                let songtime = player.songTime
                if (songtime % 60 > 0) secondsstr = " " + parseInt(songtime % 60) + "s"
                if (played % 60 > 0) playedsecondsstr = " " + parseInt(played % 60) + "s"
                let length = songtime > 60 ? parseInt(songtime / 60) + "m" + secondsstr : songtime.toFixed(3) + "s"
                let lengthplayed = played > 60 ? parseInt(played / 60) + "m" + playedsecondsstr : played.toFixed(3) + "s"
                let totalevents = player.totalEvents
                let bpm = player.currentTempo
                send("`Track name: " + playing.name + " - Track BPM: " + bpm + " - Track length: " + length + " - [" + progressbar.join('').padEnd(10, " ") + "] - " + remaining.toFixed(2) + "% (" + lengthplayed + ") played  - Events played: " + eventsplayed + " out of " + totalevents + " - Looping: " + looping + "`")
            } else {
                send("Nothing loaded yet.")
            }
        }
    }
}
function createcmdstr() {
    let result = []
    for (let i = -1; ++i < Object.keys(cmds).length;) {
        result.push(prefix + Object.keys(cmds)[i])
        if (cmds[Object.keys(cmds)[i]].aliases.length > 0) {
            result[i] += " (" + prefix + cmds[Object.keys(cmds)[i]].aliases.join(', ' + prefix) + ")"
        }
    }
    return result.join(', ')
}
MPP.client.on('a', (data) => {
    if (data.p._id === MPP.client.getOwnParticipant()._id) {
        let args = data.a.split(' ')
        let cmd = args[0].toLowerCase()
        if (cmd.startsWith(prefix)) {
            cmd = cmd.substring(prefix.length)
            if (Object.keys(cmds).includes(cmd)) {
                cmds[cmd].func(...args)
            } else {
                for (let i = -1; ++i < Object.keys(cmds).length;) {
                    if (Object.values(cmds)[i].aliases.includes(cmd)) {
                        cmds[Object.keys(cmds)[i]].func(...args)
                    }
                }
            }
        }
    }
})