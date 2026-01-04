// ==UserScript==
// @name         JMIDIPlayer with speed control and transpose
// @namespace    butter.lot
// @version      1.3.0
// @description  High performance MIDI Player for Multiplayer Piano with transpose
// @author       MrButtersLot
// @license      Beerware
// @match        *://multiplayerpiano.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557152/JMIDIPlayer%20with%20speed%20control%20and%20transpose.user.js
// @updateURL https://update.greasyfork.org/scripts/557152/JMIDIPlayer%20with%20speed%20control%20and%20transpose.meta.js
// ==/UserScript==

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

    this.emit("playbackSpeedChange", speed);
  }
}

// Transpose value (-12 to +12 semitones)
let transposeValue = 0;

function handleMidiEvent(event) {
  if (event.channel === 9) return;

  if (sustainedNotes[event.channel] === undefined) {
    sustainedNotes[event.channel] = new Set();
    sustainState[event.channel] = false;
  }

  if (event.type === EVENT_CODE.CONTROL_CHANGE && event.ccNum === 64) {
    const isSustainOn = event.ccValue >= 64;
    sustainState[event.channel] = isSustainOn;

    if (!isSustainOn) {
      for (const note of sustainedNotes[event.channel]) {
        const transposedNote = note + transposeValue;
        const key = Object.keys(MPP.piano.keys)[transposedNote - 21];
        if (key) MPP.release(key);
      }
      sustainedNotes[event.channel].clear();
    }
    return;
  }

  if ((event.type >> 1) !== 4) return; // note on/off only

  // Apply transpose
  const transposedNote = event.note + transposeValue;

  // Check if transposed note is within valid range (21-108 for 88-key piano)
  if (transposedNote < 21 || transposedNote > 108) return;

  const key = Object.keys(MPP.piano.keys)[transposedNote - 21];
  if (!key) return;

  const isNoteOn = event.type === EVENT_CODE.NOTE_ON && event.velocity > 0;

  if (isNoteOn) {
    npsBuffer[npsHeadIndex] = performance.now();
    npsHeadIndex = (npsHeadIndex + 1) % NPS_BUFFER_SIZE;

    sustainedNotes[event.channel].delete(event.note);
    MPP.press(key, event.velocity / 127);
  } else {
    if (sustainState[event.channel]) {
      sustainedNotes[event.channel].add(event.note);
    } else {
      MPP.release(key);
    }
  }
}

// svg icons
const ICON_PLAY = `<svg viewBox="0 0 16 16"><path d="M3 2 L13 8 L3 14 Z"></path></svg>`;
const ICON_PAUSE = `<svg viewBox="0 0 16 16"><path d="M3 2 H6 V14 H3 Z M10 2 H13 V14 H10 Z"></path></svg>`;
const ICON_STOP = `<svg viewBox="0 0 16 16"><path d="M3 2 H13 V12 H3 Z"></path></svg>`;

const styles = `
  .jmidi-player-window {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 350px;
    background: #2d2d2d;
    border: 1px solid #555;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    color: #eee;
    font-family: sans-serif;
    font-size: 14px;
    z-index: 850;
    display: none;
    border: 2px solid transparent;
    transition: border-color 0.2s;
  }
  .jmidi-player-window.visible {
    display: block;
  }
  .jmidi-player-window.dragover {
    border-color: #0a84ff;
  }
  .jmidi-header {
    padding: 8px 12px;
    background: #3a3a3a;
    cursor: move;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom: 1px solid #555;
    user-select: none;
  }
  .jmidi-content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .jmidi-controls {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  #jmidi-file-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    text-align: center;
  }
  .jmidi-controls button, #jmidi-file-label {
    background: #555;
    border: 1px solid #777;
    color: #eee;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  .jmidi-controls button {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .jmidi-controls button svg {
    width: 16px;
    height: 16px;
    fill: #eee;
  }
  .jmidi-controls button:hover, #jmidi-file-label:hover {
    background: #666;
  }
  .jmidi-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .jmidi-file-input input[type="file"] {
    display: none;
  }
  .jmidi-seekbar-track {
    width: 100%;
    height: 10px;
    background-color: #444;
    border-radius: 5px;
    cursor: ew-resize;
    overflow: hidden;
    position: relative;
  }
  .jmidi-seekbar-track.jmidi-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .jmidi-seekbar-progress {
    height: 100%;
    width: 0%;
    background-color: #0a84ff;
    border-radius: 5px;
    pointer-events: none;
  }
  .jmidi-speed-control, .jmidi-transpose-control {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .jmidi-speed-label, .jmidi-transpose-label {
    font-size: 13px;
    color: #ccc;
    min-width: 80px;
  }
  .jmidi-speed-slider, .jmidi-transpose-slider {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: #444;
    border-radius: 3px;
    outline: none;
  }
  .jmidi-speed-slider::-webkit-slider-thumb, .jmidi-transpose-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #0a84ff;
    border-radius: 50%;
    cursor: pointer;
  }
  .jmidi-speed-slider::-moz-range-thumb, .jmidi-transpose-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #0a84ff;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
  .jmidi-speed-slider:hover::-webkit-slider-thumb, .jmidi-transpose-slider:hover::-webkit-slider-thumb {
    background: #3d9eff;
  }
  .jmidi-speed-slider:hover::-moz-range-thumb, .jmidi-transpose-slider:hover::-moz-range-thumb {
    background: #3d9eff;
  }
  .jmidi-info-area {
    min-height: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }
  .jmidi-status-text, .jmidi-progress-display {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .jmidi-status-text {
    font-style: italic;
    color: #aaa;
  }
  .jmidi-status-text.error {
    color: #ff6b6b;
  }
  .jmidi-progress-display {
    text-align: left;
    font-family: monospace;
  }
  #jmidi-progress-display {
    display: flex;
    align-items: center;
  }
  #jmidi-nps-display::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: #555;
    border-radius: 50%;
    margin: 0 10px;
    vertical-align: middle;
  }
  .jmidi-time-display {
    text-align: left;
    font-family: monospace;
    color: #ccc;
  }
`;

const playerHTML = `
  <div id="jmidi-player-window" class="jmidi-player-window">
    <div class="jmidi-header">JMIDIPlayer</div>
    <div class="jmidi-content">
      <div class="jmidi-file-input">
        <input type="file" id="jmidi-file-input" accept=".mid,.midi">
        <label for="jmidi-file-input" id="jmidi-file-label">Load MIDI File</label>
      </div>
      <div id="jmidi-seekbar-track" class="jmidi-seekbar-track jmidi-disabled">
        <div id="jmidi-seekbar-progress" class="jmidi-seekbar-progress"></div>
      </div>
      <div class="jmidi-speed-control">
        <span class="jmidi-speed-label">Speed: <span id="jmidi-speed-value">1.00x</span></span>
        <input type="range" id="jmidi-speed-slider" class="jmidi-speed-slider" min="0.25" max="4" step="0.25" value="1">
      </div>
      <div class="jmidi-transpose-control">
        <span class="jmidi-transpose-label">Transpose: <span id="jmidi-transpose-value">0</span></span>
        <input type="range" id="jmidi-transpose-slider" class="jmidi-transpose-slider" min="-12" max="12" step="1" value="0">
      </div>
      <div class="jmidi-controls">
        <button id="jmidi-play-pause-btn" disabled></button>
        <button id="jmidi-stop-btn" disabled></button>
      </div>
      <div class="jmidi-info-area">
        <span id="jmidi-status-text" class="jmidi-status-text">No file loaded.</span>
        <span id="jmidi-time-display" class="jmidi-time-display">00:00 / 00:00</span>
        <span id="jmidi-progress-display" class="jmidi-progress-display">
          <span id="jmidi-percentage-display">0.00%</span>
          <span id="jmidi-nps-display">0 NPS</span>
        </span>
      </div>
    </div>
  </div>
`;

const toggleButtonHTML = `<div class="ugly-button" id="jmidi-toggle-btn">Toggle Player</div>`;

// inject ui
document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
document.body.insertAdjacentHTML('beforeend', playerHTML);

const buttonsContainer = document.querySelector('#buttons');
if (buttonsContainer) {
  buttonsContainer.insertAdjacentHTML('beforeend', toggleButtonHTML);
} else {
  document.body.insertAdjacentHTML('beforeend', toggleButtonHTML);
}

// ui element references
const ui = {
  window: document.getElementById('jmidi-player-window'),
  header: document.querySelector('.jmidi-header'),
  fileInput: document.getElementById('jmidi-file-input'),
  playPauseBtn: document.getElementById('jmidi-play-pause-btn'),
  stopBtn: document.getElementById('jmidi-stop-btn'),
  seekbarTrack: document.getElementById('jmidi-seekbar-track'),
  seekbarProgress: document.getElementById('jmidi-seekbar-progress'),
  speedSlider: document.getElementById('jmidi-speed-slider'),
  speedValue: document.getElementById('jmidi-speed-value'),
  transposeSlider: document.getElementById('jmidi-transpose-slider'),
  transposeValue: document.getElementById('jmidi-transpose-value'),
  statusText: document.getElementById('jmidi-status-text'),
  percentageDisplay: document.getElementById('jmidi-percentage-display'),
  npsDisplay: document.getElementById('jmidi-nps-display'),
  timeDisplay: document.getElementById('jmidi-time-display'),
  fileLabel: document.getElementById('jmidi-file-label'),
  toggleBtn: document.getElementById('jmidi-toggle-btn')
};

const player = new JMIDIPlayer();
let isSeeking = false;
let animStartTick = 0;
let animStartTime = 0;

const originalZIndex = ui.window.style.zIndex || window.getComputedStyle(ui.window).zIndex;
let dragCounter = 0;

const NPS_BUFFER_SIZE = 1 << 20;
const npsBuffer = new Float32Array(NPS_BUFFER_SIZE);
let npsHeadIndex = 0;

let sustainState = {};
let sustainedNotes = {};

function resetSustain() {
  for (const channel in sustainedNotes) {
    if (sustainedNotes[channel].size > 0) {
      for (const note of sustainedNotes[channel]) {
        const transposedNote = note + transposeValue;
        const key = Object.keys(MPP.piano.keys)[transposedNote - 21];
        if (key) MPP.release(key);
      }
    }
  }

  sustainState = {};
  sustainedNotes = {};
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function setControlsEnabled(enabled) {
  ui.playPauseBtn.disabled = !enabled;
  ui.stopBtn.disabled = !enabled;
  ui.seekbarTrack.classList.toggle('jmidi-disabled', !enabled);
}

function resetUIForNewFile() {
  ui.playPauseBtn.innerHTML = ICON_PLAY;
  ui.stopBtn.innerHTML = ICON_STOP;
  setControlsEnabled(true);
  updateProgressDisplay();
}

let currentFileName = null;
async function loadFile(file) {
  if (!file) {
    ui.statusText.textContent = `Error: No file.`;
    ui.statusText.classList.add('error');
    return;
  }

  player.unload();
  ui.statusText.textContent = 'Loading...';
  ui.statusText.classList.remove('error');
  setControlsEnabled(false);

  try {
    currentFileName = file.name;
    const buffer = await file.arrayBuffer();
    await player.loadArrayBuffer(buffer);
  } catch (error) {
    currentFileName = null;
    const errorMessage = `Error: ${error.message}`;
    ui.statusText.textContent = errorMessage;
    ui.statusText.title = errorMessage;
    ui.statusText.classList.add('error');
    console.error("Failed to load MIDI file:", error);
    player.unload();
  }
}

function updateProgressDisplay(displayTick) {
  const currentTick = displayTick !== undefined ? displayTick : player.currentTick;
  const totalTicks = player.totalTicks || 1;
  const percentage = Math.min(100, (currentTick / totalTicks) * 100);
  const clampedTick = Math.min(player.totalTicks, Math.max(0, Math.round(currentTick)));

  const now = performance.now();
  const oneSecondAgo = now - 1000;

  const isSaturated = npsBuffer[npsHeadIndex] > oneSecondAgo;
  let npsDisplay;

  if (isSaturated) {
    npsDisplay = "(!!!)";
  } else {
    let currentNPS = 0;
    for (let i = 0; i < NPS_BUFFER_SIZE; i++) {
      const index = (npsHeadIndex - 1 - i + NPS_BUFFER_SIZE) % NPS_BUFFER_SIZE;
      const timestamp = npsBuffer[index];

      if (timestamp < oneSecondAgo) {
        break;
      }
      currentNPS++;
    }
    npsDisplay = currentNPS;
  }
  ui.percentageDisplay.textContent = `${percentage.toFixed(2)}%`;
  ui.npsDisplay.textContent = `${npsDisplay} NPS`;

  ui.seekbarProgress.style.width = `${percentage}%`;

  const totalTime = player.songTime || 0;
  const currentTime = player.getTimeAtTick(clampedTick);
  ui.timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
}

function animationLoop() {
  if (player.isPlaying) {
    const ppqn = player.ppqn;
    const tempoBPM = player.currentTempo;
    if (ppqn > 0 && tempoBPM > 0) {
      const ticksPerSecond = (ppqn * tempoBPM) / 60;
      const elapsedMs = performance.now() - animStartTime;
      const elapsedTicks = (elapsedMs / 1000) * ticksPerSecond;
      const visualTick = Math.floor(animStartTick + elapsedTicks);
      updateProgressDisplay(visualTick);
    }
  }
  requestAnimationFrame(animationLoop);
}
animationLoop();

// initial button states
ui.playPauseBtn.innerHTML = ICON_PLAY;
ui.stopBtn.innerHTML = ICON_STOP;

// player events
player.on('fileLoaded', ({ parseTime }) => {
  ui.statusText.title = '';
  ui.statusText.classList.remove('error');
  ui.statusText.textContent = `Ready: ${player.totalEvents.toLocaleString('en-US')} events in ${parseTime.toFixed(2)} ms.`;
  ui.fileLabel.textContent = currentFileName;
  resetUIForNewFile();
});

player.on('play', () => {
  ui.statusText.textContent = 'Playing...';
  ui.playPauseBtn.innerHTML = ICON_PAUSE;
  animStartTime = performance.now();
  animStartTick = player.currentTick;
});

player.on('pause', () => {
  ui.statusText.textContent = 'Paused.';
  ui.playPauseBtn.innerHTML = ICON_PLAY;
  npsBuffer.fill(0);
  npsHeadIndex = 0;
  updateProgressDisplay();
});

player.on('stop', () => {
  resetSustain();
  ui.statusText.textContent = 'Stopped.';
  ui.playPauseBtn.innerHTML = ICON_PLAY;
  player.seek(0);
  animStartTick = 0;
  npsBuffer.fill(0);
  npsHeadIndex = 0;
  updateProgressDisplay();
});

player.on('tempoChange', () => {
  animStartTime = performance.now();
  animStartTick = player.currentTick;
});

player.on('playbackSpeedChange', (speed) => {
  ui.speedValue.textContent = `${speed.toFixed(2)}x`;
  animStartTime = performance.now();
  animStartTick = player.currentTick;
});

player.on('endOfFile', () => {
  ui.statusText.textContent = 'Finished.';
  ui.playPauseBtn.innerHTML = ICON_PLAY;
  updateProgressDisplay();
});

player.on('unloaded', () => {
  resetSustain();
  if (!ui.statusText.classList.contains('error')) {
    ui.statusText.textContent = 'No file loaded.';
  }
  ui.fileLabel.textContent = 'Load MIDI File';
  currentFileName = null;
  setControlsEnabled(false);
  npsBuffer.fill(0);
  npsHeadIndex = 0;
  updateProgressDisplay();
});

player.on('midiEvent', handleMidiEvent);

ui.toggleBtn.addEventListener('click', () => {
  ui.window.classList.toggle('visible');
});

// file input
ui.fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    loadFile(e.target.files[0]);
  }
});

// playback speed slider
ui.speedSlider.addEventListener('input', (e) => {
  const speed = parseFloat(e.target.value);
  player.playbackSpeed = speed;
});

// transpose slider
ui.transposeSlider.addEventListener('input', (e) => {
  transposeValue = parseInt(e.target.value);
  const sign = transposeValue > 0 ? '+' : '';
  ui.transposeValue.textContent = `${sign}${transposeValue}`;
});

// drag'n'drop
ui.window.addEventListener('dragover', (e) => {
  e.preventDefault();
  ui.window.classList.add('dragover');
});
ui.window.addEventListener('dragleave', () => {
  ui.window.classList.remove('dragover');
});
ui.window.addEventListener('drop', (e) => {
  e.preventDefault();
  ui.window.classList.remove('dragover');
  if (e.dataTransfer.files.length > 0) {
    loadFile(e.dataTransfer.files[0]);
  }
});

document.addEventListener('dragenter', (e) => {
  if (e.dataTransfer.types.includes('Files')) {
    if (dragCounter === 0) {
      ui.window.style.zIndex = '99999';
    }
    dragCounter++;
  }
});

document.addEventListener('dragleave', (e) => {
  if (e.dataTransfer.types.includes('Files')) {
    dragCounter--;
    if (dragCounter === 0) {
      ui.window.style.zIndex = originalZIndex;
    }
  }
});

document.addEventListener('dragover', e => e.preventDefault());

document.addEventListener('drop', (e) => {
  e.preventDefault();
  dragCounter = 0;
  ui.window.style.zIndex = originalZIndex;
});

// player controls
ui.playPauseBtn.addEventListener('click', () => {
  if (player.isPlaying) {
    player.pause();
    ui.playPauseBtn.innerHTML = ICON_PLAY;
  } else {
    player.play();
    ui.playPauseBtn.innerHTML = ICON_PAUSE;
  }
});

ui.stopBtn.addEventListener('click', () => {
  player.stop();
  ui.playPauseBtn.innerHTML = ICON_PLAY;
});

// seekbar
function seekFromEvent(e) {
  if (player.totalTicks === 0) return;
  const rect = ui.seekbarTrack.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
  const percentage = x / rect.width;
  const tick = Math.round(percentage * player.totalTicks);

  resetSustain();
  player.seek(tick);
  npsBuffer.fill(0);
  npsHeadIndex = 0;
  updateProgressDisplay();
}

ui.seekbarTrack.addEventListener('mousedown', (e) => {
  if (player.totalTicks === 0) return;
  isSeeking = true;
  seekFromEvent(e);
});

document.addEventListener('mousemove', (e) => {
  if (isSeeking) {
    seekFromEvent(e);
  }
});

document.addEventListener('mouseup', () => {
  if (isSeeking) {
    isSeeking = false;
  }
});

// draggable window
let isDragging = false;
let offsetX, offsetY;

ui.header.addEventListener('mousedown', (e) => {
  isDragging = true;
  const rect = ui.window.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    ui.window.style.left = `${e.clientX - offsetX}px`;
    ui.window.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
