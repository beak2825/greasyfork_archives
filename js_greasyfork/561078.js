// ==UserScript==
// @name         AutoPawycMe
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Автоматический переход с настройками звука, голосовым управлением, улучшенной автогромкостью, изменением голоса и выбором тем для nekto.me audiochat
// @author       @pawyc
// @match        https://nekto.me/audiochat
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561078/AutoPawycMe.user.js
// @updateURL https://update.greasyfork.org/scripts/561078/AutoPawycMe.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ==========================================
  // КОНФИГУРАЦИЯ
  // ==========================================

  // Звуки
  const START_CONVERSATION_SOUND_URL =
    "https://zvukogram.com/mp3/22/skype-sound-message-received-message-received.mp3";
  const END_CONVERSATION_SOUND_URL =
    "https://www.myinstants.com/media/sounds/teleport1_Cw1ot9l.mp3";
  const START_SOUND_VOLUME = 0.4;
  const END_SOUND_VOLUME = 0.3;

  // Голосовые команды
  const VOICE_COMMANDS = {
    skip: ["скип", "skip", "скиф", "скипнуть", "кефир"],
    stop: ["завершить", "остановить", "закончить", "кумыс"],
    start: ["чат", "старт", "поехали"],
  };

  // Автогромкость
  const TARGET_VOLUME = 50;
  const MIN_VOLUME = 10;
  const MAX_VOLUME = 90;
  const TRANSITION_DURATION = 1000;
  const VOLUME_CHECK_INTERVAL = 200;
  const HISTORY_SIZE = 15;

  // Темы
  const THEMES = {
    Original: null,
    "GitHub Dark":
      "https://raw.githubusercontent.com/pawyc/AutoNektomeV2/main/githubdark.css",
  };

  // Настройки по умолчанию
  const DEFAULT_SETTINGS = {
    enableLoopback: false,
    autoGainControl: false,
    noiseSuppression: true,
    echoCancellation: false,
    gainValue: 1.5,
    voiceControl: false,
    autoVolume: true,
    voicePitch: false,
    pitchLevel: 0,
    conversationCount: 0,
    conversationStats: {
      over5min: 0,
      over15min: 0,
      over30min: 0,
      over1hour: 0,
      over2hours: 0,
      over3hours: 0,
      over5hours: 0,
    },
    selectedTheme: "Original",
  };

  // Загрузка настроек с защитой от null
  const settings = {
    ...DEFAULT_SETTINGS,
    ...JSON.parse(localStorage.getItem("AutoNektomeSettings") || "{}"),
  };

  function saveSettings() {
    localStorage.setItem("AutoNektomeSettings", JSON.stringify(settings));
  }

  // Сохранение отдельных ключей (совместимость со старым кодом)
  function saveSetting(key, value) {
    settings[key] = value;
    saveSettings();
    // Дублируем сохранение в старом формате для совместимости, если нужно
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ==========================================
  // ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
  // ==========================================
  let isAutoModeEnabled = true;
  let isVoiceControlEnabled = settings.voiceControl;
  let globalStream = null;
  let audioContext = null;
  let gainNode = null;
  let micStream = null;
  let recognition = null;
  let voiceHintElement = null;
  let remoteAudioContext = null;
  let volumeAnalyser = null;
  let volumeCheckIntervalId = null;
  let volumeHistory = [];
  let lastAdjustedVolume = TARGET_VOLUME;
  let lastLoudTime = 0;

  // Pitch Shift
  let pitchAudioContext = null;
  let pitchWorkletNode = null;

  // Таймеры и флаги
  let conversationTimer = null;
  let currentConversationStart = null;
  let isConversationActive = false;
  let isMicMuted = false;
  let isHeadphonesMuted = false;
  let currentThemeLink = null;

  // ==========================================
  // АНИМАЦИЯ ФОНА (ПАУТИНА)
  // ==========================================
  function initParticles() {
    // Удаляем старый канвас если есть
    const oldCanvas = document.getElementById("particles-canvas");
    if (oldCanvas) oldCanvas.remove();

    const canvas = document.createElement("canvas");
    canvas.id = "particles-canvas";
    canvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: -1; pointer-events: none; opacity: 0; transition: opacity 2s ease;
        `;
    document.body.prepend(canvas);

    // Плавное появление
    setTimeout(() => (canvas.style.opacity = "1"), 100);

    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 80; // Чуть меньше частиц для чистоты
    const connectionDistance = 140;
    const mouseDistance = 180;

    let mouse = { x: null, y: null };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Очень медленное движение
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.size = Math.random() * 2 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Отскок от краев
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Взаимодействие с мышью (мягкое отталкивание)
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            // Мягкое отклонение
            const directionX = forceDirectionX * force * 0.5;
            const directionY = forceDirectionY * force * 0.5;

            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }

      draw() {
        // GitHub Blue (#58a6ff) с низкой прозрачностью
        ctx.fillStyle = "rgba(88, 166, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticlesArray() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            // Линии становятся прозрачнее с расстоянием
            ctx.strokeStyle = `rgba(88, 166, 255, ${0.15 * (1 - distance / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    initParticlesArray();
    animate();
  }

  // ==========================================
  // ЛОГИКА ТЕМ
  // ==========================================
  function applyTheme(themeName) {
    if (currentThemeLink) {
      currentThemeLink.remove();
      currentThemeLink = null;
    }

    // Если это не Original, загружаем CSS
    if (themeName !== "Original" && THEMES[themeName]) {
      const styleElement = document.createElement("style");
      styleElement.id = "custom-theme-style";

      fetch(THEMES[themeName])
        .then((response) => {
          if (!response.ok) throw new Error("Network error");
          return response.text();
        })
        .then((css) => {
          styleElement.textContent = css;
          document.head.appendChild(styleElement);
          currentThemeLink = styleElement;

          // Принудительно добавляем класс темы body, если требуется
          document.body.classList.add("night_theme");
        })
        .catch((err) => console.error("Ошибка загрузки темы:", err));
    } else {
      // Если Original - удаляем кастомные стили
      const existingStyles = document.querySelectorAll(
        'style[id="custom-theme-style"]',
      );
      existingStyles.forEach((style) => style.remove());

      // Важно: не удаляем класс night_theme жестко, так как сайт может использовать его сам.
      // Но если мы хотим "чистый" вид, можно оставить как есть.
    }

    settings.selectedTheme = themeName;
    saveSetting("selectedTheme", themeName);
  }

  // ==========================================
  // ЗВУКИ И УВЕДОМЛЕНИЯ
  // ==========================================
  const endConversationAudio = new Audio(END_CONVERSATION_SOUND_URL);
  endConversationAudio.volume = END_SOUND_VOLUME;

  const startConversationAudio = new Audio(START_CONVERSATION_SOUND_URL);
  startConversationAudio.volume = START_SOUND_VOLUME;
  startConversationAudio.dataset.custom = "true"; // Маркер для защиты от блокировки

  // Блокировка стандартного звука connect.mp3
  function blockConnectSound() {
    // Перехват через прототип (самый надежный способ)
    const originalPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function () {
      if (
        this.src &&
        this.src.includes("connect.mp3") &&
        !this.dataset.custom
      ) {
        // console.log('AutoNektome: Стандартный звук заблокирован');
        return Promise.resolve();
      }
      return originalPlay.apply(this, arguments);
    };
  }

  // ==========================================
  // PITCH SHIFT WORKLET
  // ==========================================
  const pitchShiftWorkletCode = `
        class PitchShiftProcessor extends AudioWorkletProcessor {
            constructor() {
                super();
                this.bufferSize = 4096;
                this.buffer = new Float32Array(this.bufferSize);
                this.writeIndex = 0;
                this.readIndex = 0;
                this.pitchFactor = 1.0;
                this.port.onmessage = (event) => { this.pitchFactor = event.data; };
            }
            process(inputs, outputs) {
                const input = inputs[0][0];
                const output = outputs[0][0];
                if (!input || !output) return true;
                for (let i = 0; i < input.length; i++) {
                    this.buffer[this.writeIndex] = input[i];
                    this.writeIndex = (this.writeIndex + 1) % this.bufferSize;
                }
                for (let i = 0; i < output.length; i++) {
                    const intIndex = Math.floor(this.readIndex);
                    const frac = this.readIndex - intIndex;
                    const sample1 = this.buffer[intIndex % this.bufferSize];
                    const sample2 = this.buffer[(intIndex + 1) % this.bufferSize];
                    output[i] = sample1 + (sample2 - sample1) * frac;
                    this.readIndex = (this.readIndex + this.pitchFactor) % this.bufferSize;
                }
                return true;
            }
        }
        registerProcessor('pitch-shift-processor', PitchShiftProcessor);
    `;

  // ==========================================
  // ЛОГИКА АВТОМАТИЗАЦИИ
  // ==========================================
  function checkAndClickButton() {
    if (!isAutoModeEnabled) return;

    // Поиск кнопки "Искать собеседника" (разные варианты верстки)
    const selectors = [
      "button.callScreen__findBtn.btn.green.filled", // Новый дизайн
      "button.btn.btn-lg.go-scan-button", // Старый дизайн
      ".scan-button", // Универсальный класс
    ];

    for (let sel of selectors) {
      const btn = document.querySelector(sel);
      if (btn && btn.offsetParent !== null) {
        // Проверка видимости
        btn.click();
        return;
      }
    }
  }

  function skipConversation() {
    const stopSelectors = [
      "button.callScreen__cancelCallBtn.btn.danger2.cancelCallBtnNoMess",
      "button.btn.btn-lg.stop-talk-button",
    ];

    let stopButton = null;
    for (let sel of stopSelectors) {
      stopButton = document.querySelector(sel);
      if (stopButton) break;
    }

    if (stopButton) {
      stopButton.click();
      // Подтверждение (если есть sweetAlert)
      setTimeout(() => {
        const confirmBtn = document.querySelector("button.swal2-confirm");
        if (confirmBtn) confirmBtn.click();
        playNotificationOnEnd();
      }, 300);
    }
  }

  function playNotificationOnEnd() {
    if (isConversationActive) {
      endConversationAudio.play().catch(() => {});
      isConversationActive = false;
    }
  }

  function playNotificationOnStart() {
    if (!isConversationActive) {
      startConversationAudio.currentTime = 0;
      startConversationAudio.play().catch(() => {});
      isConversationActive = true;
    }
  }

  // ==========================================
  // АУДИО ОБРАБОТКА
  // ==========================================
  async function createPitchShiftedStream(stream) {
    if (!settings.voicePitch || settings.pitchLevel <= 0) return stream;

    try {
      if (pitchAudioContext) pitchAudioContext.close();
      pitchAudioContext = new AudioContext();

      const blob = new Blob([pitchShiftWorkletCode], {
        type: "application/javascript",
      });
      await pitchAudioContext.audioWorklet.addModule(URL.createObjectURL(blob));

      const source = pitchAudioContext.createMediaStreamSource(stream);
      pitchWorkletNode = new AudioWorkletNode(
        pitchAudioContext,
        "pitch-shift-processor",
      );

      // Настройка питча (1.0 = норма, < 1.0 = ниже)
      const pitchFactor = 1.0 - settings.pitchLevel;
      pitchWorkletNode.port.postMessage(pitchFactor);

      // Фильтр для сглаживания артефактов
      const filter = pitchAudioContext.createBiquadFilter();
      filter.type = "lowshelf";
      filter.frequency.value = 300;
      filter.gain.value = 5;

      source.connect(pitchWorkletNode);
      pitchWorkletNode.connect(filter);

      const dest = pitchAudioContext.createMediaStreamDestination();
      filter.connect(dest);

      return dest.stream;
    } catch (e) {
      console.error("Pitch Shift Error:", e);
      return stream;
    }
  }

  function enableSelfListening(stream) {
    if (!settings.enableLoopback) {
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
      return;
    }

    if (audioContext) audioContext.close();
    audioContext = new AudioContext();

    const source = audioContext.createMediaStreamSource(stream);
    gainNode = audioContext.createGain();
    gainNode.gain.value = settings.gainValue;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
  }

  function updatePitchEffect(enable) {
    settings.voicePitch = enable;
    // Перезапуск стрима для применения эффекта
    if (globalStream && micStream) {
      createPitchShiftedStream(micStream).then((newStream) => {
        // Тут сложная логика подмены стрима "на лету",
        // проще попросить пользователя перезайти или (в идеале)
        // Nekto сам перезапросит микрофон при следующем звонке.
        // Для текущей сессии меняем globalStream
        globalStream = newStream;
      });
    }
  }

  // ==========================================
  // UI ИНТЕРФЕЙС
  // ==========================================
  function createVoiceHints() {
    const wrapper = document.createElement("div");
    wrapper.className = "voice-hint-wrapper";
    wrapper.style.display = isVoiceControlEnabled ? "block" : "none";
    wrapper.style.marginTop = "10px";
    wrapper.style.fontSize = "11px";
    wrapper.style.color = "#8b949e";
    wrapper.innerHTML = `
            <div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:6px;">
                <b>Команды:</b><br>
                🎤 "Скип" — далее<br>
                🎤 "Стоп" — завершить<br>
                🎤 "Чат" — начать
            </div>
        `;
    voiceHintElement = wrapper;
    return wrapper;
  }

  function createSettingsUI() {
    // Удаляем старый UI если есть
    const oldUI = document.getElementById("autonektome-ui");
    if (oldUI) oldUI.remove();

    // Стили CSS (вставляем один раз)
    if (!document.getElementById("autonektome-css")) {
      const css = `
                #autonektome-ui {
                    position: fixed; top: 20px; right: 20px; z-index: 99999;
                    background: rgba(13, 17, 23, 0.85); backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    padding: 20px; border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                    border: 1px solid rgba(88, 166, 255, 0.2);
                    width: 280px; color: #c9d1d9;
                    font-family: system-ui, -apple-system, sans-serif;
                    transition: opacity 0.3s;
                }
                #autonektome-ui:hover { border-color: rgba(88, 166, 255, 0.5); }
                .an-header {
                    font-size: 16px; font-weight: 700; color: #58a6ff;
                    text-transform: uppercase; letter-spacing: 1px;
                    text-align: center; margin-bottom: 15px; border-bottom: 1px solid #30363d; padding-bottom: 10px;
                }
                .an-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
                .an-icon-btn {
                    width: 40px; height: 40px; border-radius: 50%; border: 1px solid #30363d;
                    background: #161b22; color: #c9d1d9; cursor: pointer; transition: 0.2s;
                    display: flex; align-items: center; justify-content: center; font-size: 18px;
                }
                .an-icon-btn:hover { border-color: #58a6ff; color: #58a6ff; }
                .an-icon-btn.active { background: #238636; border-color: #238636; color: white; }
                .an-icon-btn.muted { background: #da3633; border-color: #da3633; color: white; }

                .an-switch-label { font-size: 13px; color: #c9d1d9; display: flex; align-items: center; gap: 8px; }
                .an-switch { position: relative; display: inline-block; width: 36px; height: 20px; }
                .an-switch input { opacity: 0; width: 0; height: 0; }
                .an-slider {
                    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #30363d; transition: .4s; border-radius: 20px;
                }
                .an-slider:before {
                    position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
                    background-color: white; transition: .4s; border-radius: 50%;
                }
                input:checked + .an-slider { background-color: #238636; }
                input:checked + .an-slider:before { transform: translateX(16px); }

                .an-range { width: 100%; height: 4px; background: #30363d; border-radius: 2px; appearance: none; outline: none; margin-top: 5px; }
                .an-range::-webkit-slider-thumb { appearance: none; width: 14px; height: 14px; background: #58a6ff; border-radius: 50%; cursor: pointer; }

                .an-sub-setting { padding-left: 10px; border-left: 2px solid #30363d; margin-top: 5px; margin-bottom: 10px; }
                .an-select { width: 100%; background: #0d1117; color: #c9d1d9; border: 1px solid #30363d; padding: 5px; border-radius: 6px; margin-top: 5px; }
                .an-stat { font-size: 12px; color: #8b949e; text-align: center; margin-bottom: 15px; background: #161b22; padding: 5px; border-radius: 6px;}
            `;
      const style = document.createElement("style");
      style.id = "autonektome-css";
      style.textContent = css;
      document.head.appendChild(style);
    }

    const container = document.createElement("div");
    container.id = "autonektome-ui";

    // Заголовок
    container.innerHTML = `
            <div class="an-header">AutoNektome v4.3</div>
            <div class="an-stat" id="an-counter">
                Разговоров: ${settings.conversationCount}
            </div>
        `;

    // Кнопки управления звуком
    const controlsRow = document.createElement("div");
    controlsRow.className = "an-row";
    controlsRow.style.justifyContent = "center";
    controlsRow.style.gap = "15px";

    const micBtn = document.createElement("button");
    micBtn.className = "an-icon-btn";
    micBtn.innerHTML = "🎤";
    micBtn.onclick = () => {
      toggleMic();
      updateBtnState();
    };

    const headBtn = document.createElement("button");
    headBtn.className = "an-icon-btn";
    headBtn.innerHTML = "🎧";
    headBtn.onclick = () => {
      toggleHeadphones();
      updateBtnState();
    };

    function updateBtnState() {
      micBtn.className = `an-icon-btn ${isMicMuted ? "muted" : ""}`;
      headBtn.className = `an-icon-btn ${isHeadphonesMuted ? "muted" : ""}`;
      micBtn.style.textDecoration = isMicMuted ? "line-through" : "none";
      headBtn.style.textDecoration = isHeadphonesMuted
        ? "line-through"
        : "none";
    }

    controlsRow.append(micBtn, headBtn);
    container.append(controlsRow);

    // Генератор переключателей
    function createSwitch(label, key, onChange) {
      const wrapper = document.createElement("div");
      wrapper.style.marginBottom = "10px";

      const row = document.createElement("div");
      row.className = "an-row";

      const labelSpan = document.createElement("span");
      labelSpan.className = "an-switch-label";
      labelSpan.textContent = label;

      const switchLabel = document.createElement("label");
      switchLabel.className = "an-switch";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked =
        key === "isAutoModeEnabled" ? isAutoModeEnabled : settings[key];

      input.onchange = (e) => {
        if (key === "isAutoModeEnabled") {
          toggleAutoMode(e.target.checked);
        } else {
          settings[key] = e.target.checked;
          saveSetting(key, e.target.checked);
          if (onChange) onChange(e.target.checked);
        }
      };

      const slider = document.createElement("span");
      slider.className = "an-slider";

      switchLabel.append(input, slider);
      row.append(labelSpan, switchLabel);
      wrapper.append(row);
      return { wrapper, input };
    }

    // Авторежим
    const autoMode = createSwitch("Авторежим", "isAutoModeEnabled");
    container.append(autoMode.wrapper);

    // Остальные настройки
    const loopback = createSwitch(
      "Самопрослушивание",
      "enableLoopback",
      (val) => {
        if (val && globalStream) enableSelfListening(globalStream);
        else if (audioContext) audioContext.close();
        loopbackSettings.style.display = val ? "block" : "none";
      },
    );
    container.append(loopback.wrapper);

    const loopbackSettings = document.createElement("div");
    loopbackSettings.className = "an-sub-setting";
    loopbackSettings.style.display = settings.enableLoopback ? "block" : "none";
    loopbackSettings.innerHTML = `<div style="font-size:11px;color:#8b949e;margin-bottom:3px;">Громкость</div>`;
    const lbSlider = document.createElement("input");
    lbSlider.type = "range";
    lbSlider.className = "an-range";
    lbSlider.min = 0.1;
    lbSlider.max = 3.0;
    lbSlider.step = 0.1;
    lbSlider.value = settings.gainValue;
    lbSlider.oninput = (e) => {
      settings.gainValue = parseFloat(e.target.value);
      saveSetting("gainValue", settings.gainValue);
      if (gainNode) gainNode.gain.value = settings.gainValue;
    };
    loopbackSettings.append(lbSlider);
    container.append(loopbackSettings);

    // Pitch
    const pitch = createSwitch("Изменение голоса", "voicePitch", (val) => {
      updatePitchEffect(val);
      pitchSettings.style.display = val ? "block" : "none";
    });
    container.append(pitch.wrapper);

    const pitchSettings = document.createElement("div");
    pitchSettings.className = "an-sub-setting";
    pitchSettings.style.display = settings.voicePitch ? "block" : "none";
    pitchSettings.innerHTML = `<div style="font-size:11px;color:#8b949e;margin-bottom:3px;">Высота тона (ниже - левее)</div>`;
    const pSlider = document.createElement("input");
    pSlider.type = "range";
    pSlider.className = "an-range";
    pSlider.min = 0;
    pSlider.max = 0.4;
    pSlider.step = 0.01;
    pSlider.value = settings.pitchLevel;
    pSlider.oninput = (e) => {
      settings.pitchLevel = parseFloat(e.target.value);
      saveSetting("pitchLevel", settings.pitchLevel);
      updatePitchLevel(settings.pitchLevel);
    };
    pitchSettings.append(pSlider);
    container.append(pitchSettings);

    // Прочие настройки
    container.append(createSwitch("Автогромкость (чат)", "autoVolume").wrapper);
    container.append(
      createSwitch("Шумоподавление", "noiseSuppression").wrapper,
    );

    const voiceCtrl = createSwitch(
      "Голосовое управление",
      "voiceControl",
      (val) => {
        isVoiceControlEnabled = val;
        if (val) {
          if (!recognition) initSpeechRecognition();
          recognition.start();
        } else if (recognition) recognition.stop();
        voiceHints.style.display = val ? "block" : "none";
      },
    );
    container.append(voiceCtrl.wrapper);
    const voiceHints = createVoiceHints();
    container.append(voiceHints);

    // Выбор темы
    const themeWrapper = document.createElement("div");
    themeWrapper.style.marginTop = "15px";
    themeWrapper.innerHTML = `<div style="font-size:13px; color:#c9d1d9; margin-bottom:5px;">Тема оформления</div>`;
    const themeSelect = document.createElement("select");
    themeSelect.className = "an-select";
    for (const theme in THEMES) {
      const opt = document.createElement("option");
      opt.value = theme;
      opt.textContent = theme;
      if (theme === settings.selectedTheme) opt.selected = true;
      themeSelect.appendChild(opt);
    }
    themeSelect.onchange = (e) => applyTheme(e.target.value);
    themeWrapper.appendChild(themeSelect);
    container.append(themeWrapper);

    document.body.appendChild(container);
  }

  // ==========================================
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ==========================================
  function toggleMic() {
    isMicMuted = !isMicMuted;
    if (globalStream) {
      globalStream.getAudioTracks().forEach((t) => (t.enabled = !isMicMuted));
    }
  }

  function toggleHeadphones() {
    isHeadphonesMuted = !isHeadphonesMuted;
    const audio = document.querySelector("audio#audioStream");
    if (audio) audio.muted = isHeadphonesMuted;
    if (isHeadphonesMuted && !isMicMuted) toggleMic(); // Мутим микро если уши выкл
  }

  function toggleAutoMode(val) {
    isAutoModeEnabled = val;
  }

  function updatePitchLevel(val) {
    if (pitchWorkletNode) {
      pitchWorkletNode.port.postMessage(1.0 - val);
    }
  }

  // Автогромкость собеседника
  function setupAutoVolume(stream) {
    if (!settings.autoVolume || !stream) return;

    if (remoteAudioContext) remoteAudioContext.close();
    remoteAudioContext = new AudioContext();
    const source = remoteAudioContext.createMediaStreamSource(stream);
    volumeAnalyser = remoteAudioContext.createAnalyser();
    volumeAnalyser.fftSize = 256;
    source.connect(volumeAnalyser);

    const dataArray = new Uint8Array(volumeAnalyser.frequencyBinCount);
    const audioElement = document.querySelector("audio#audioStream");

    if (volumeCheckIntervalId) clearInterval(volumeCheckIntervalId);

    volumeCheckIntervalId = setInterval(() => {
      if (!settings.autoVolume) return;
      volumeAnalyser.getByteTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const vol = Math.min(1, rms * 10) * 100;

      // Логика нормализации (упрощенная)
      const slider = document.querySelector(".volume_slider input"); // Родной слайдер некто
      if (slider && vol > TARGET_VOLUME + 15) {
        // Слишком громко -> понижаем
        // Здесь можно имитировать события input для родного слайдера
        // Но для надежности просто меняем громкость элемента
        if (audioElement.volume > 0.2) audioElement.volume -= 0.05;
      }
    }, VOLUME_CHECK_INTERVAL);
  }

  // Голосовое управление (Web Speech API)
  function initSpeechRecognition() {
    if (!("webkitSpeechRecognition" in window)) return;

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "ru-RU";

    recognition.onresult = (event) => {
      if (!isVoiceControlEnabled) return;
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult.isFinal) return;

      const text = lastResult[0].transcript.trim().toLowerCase();
      console.log("Voice Command:", text);

      if (VOICE_COMMANDS.skip.some((cmd) => text.includes(cmd)))
        skipConversation();
      else if (VOICE_COMMANDS.stop.some((cmd) => text.includes(cmd))) {
        toggleAutoMode(false);
        skipConversation();
      } else if (VOICE_COMMANDS.start.some((cmd) => text.includes(cmd))) {
        toggleAutoMode(true);
        checkAndClickButton();
      }
    };

    recognition.onend = () => {
      if (isVoiceControlEnabled) recognition.start();
    };
  }

  // ==========================================
  // ИНИЦИАЛИЗАЦИЯ И ХУКИ
  // ==========================================

  // Перехват микрофона для обработки
  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
    navigator.mediaDevices,
  );
  navigator.mediaDevices.getUserMedia = async (constraints) => {
    if (constraints && constraints.audio) {
      constraints.audio = {
        ...constraints.audio,
        autoGainControl: settings.autoGainControl,
        noiseSuppression: settings.noiseSuppression,
        echoCancellation: settings.echoCancellation,
      };
    }

    try {
      const stream = await originalGetUserMedia(constraints);
      micStream = stream;

      // Создаем обработанный стрим (питч)
      const processed = await createPitchShiftedStream(stream);
      globalStream = processed;

      if (settings.enableLoopback) enableSelfListening(processed);

      return processed;
    } catch (err) {
      console.error("Mic Error:", err);
      throw err;
    }
  };

  // Наблюдатель DOM (Debounced)
  let observerTimeout;
  const observer = new MutationObserver((mutations) => {
    if (observerTimeout) clearTimeout(observerTimeout);
    observerTimeout = setTimeout(() => {
      // Проверка кнопок
      checkAndClickButton();

      // Проверка аудио элемента
      const audio = document.querySelector("audio#audioStream");
      if (audio && !audio.dataset.initialized) {
        audio.dataset.initialized = "true";
        if (settings.autoVolume && audio.srcObject)
          setupAutoVolume(audio.srcObject);
      }

      // Таймеры разговора
      const timerEl = document.querySelector(".callScreen__time, .timer-label");
      if (timerEl && timerEl.textContent === "00:00" && !conversationTimer) {
        playNotificationOnStart();
        conversationTimer = true; // Просто флаг, детальный таймер не обязателен для звука
      } else if (!timerEl && conversationTimer) {
        playNotificationOnEnd();
        conversationTimer = null;
        settings.conversationCount++;
        saveSetting("conversationCount", settings.conversationCount);
        const counter = document.getElementById("an-counter");
        if (counter)
          counter.textContent = `Разговоров: ${settings.conversationCount}`;
      }
    }, 100); // Проверяем раз в 100мс после изменений
  });

  // MAIN START
  function init() {
    console.log("AutoNektome v4.3 Init...");
    blockConnectSound();
    applyTheme(settings.selectedTheme);
    createSettingsUI();
    initParticles();

    observer.observe(document.body, { childList: true, subtree: true });

    // Восстанавливаем голосовое управление
    if (settings.voiceControl) {
      initSpeechRecognition();
      recognition.start();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
