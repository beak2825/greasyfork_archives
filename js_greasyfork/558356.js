// ==UserScript==
// @name         Lolzteam Official Order Generator V9
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Генератор приказов.
// @author       You
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558356/Lolzteam%20Official%20Order%20Generator%20V9.user.js
// @updateURL https://update.greasyfork.org/scripts/558356/Lolzteam%20Official%20Order%20Generator%20V9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === РЕСУРСЫ ===
    const DEFAULT_LOGO = "https://lolz.live/favicon.svg";

    const getStampSVG = (topText, centerText) => `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="ink-blur">
                <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
        </defs>
        <g filter="url(#ink-blur)" fill="none" stroke="#0047ab" stroke-width="2" transform="rotate(-5 100 100)">
            <circle cx="100" cy="100" r="90" stroke-width="3" />
            <circle cx="100" cy="100" r="65" />
            <path id="rim-path" d="M25,100 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0" />
            <text fill="#0047ab" font-family="Arial, sans-serif" font-size="10" font-weight="bold" stroke="none" letter-spacing="1">
                <textPath xlink:href="#rim-path" startOffset="50%" text-anchor="middle">
                    ★ ${topText.toUpperCase()} ★
                </textPath>
            </text>
            <text x="100" y="105" fill="#0047ab" stroke="none" font-family="Times New Roman" font-size="14" text-anchor="middle" font-weight="bold" style="text-transform:uppercase">${centerText}</text>
        </g>
    </svg>`;

    const STYLES = `
        /* === UI ПАНЕЛИ === */
        #lzt-doc-btn { margin-left: 10px; }

        #lzt-doc-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 99999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
        .lzt-doc-panel { background: #222; width: 1150px; height: 95vh; display: flex; gap: 30px; padding: 20px; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,1); color: #ddd; font-family: sans-serif; }

        .lzt-inputs { width: 400px; overflow-y: auto; padding-right: 15px; display: flex; flex-direction: column; gap: 10px; }
        .lzt-inputs label { font-size: 11px; color: #aaa; margin-bottom: -5px; display: block; }
        .lzt-inputs input, .lzt-inputs textarea { background: #333; border: 1px solid #555; color: #fff; padding: 8px; border-radius: 4px; width: 100%; box-sizing: border-box; font-size: 13px; }

        #i-topic { min-height: 60px; }
        #i-body { min-height: 250px; font-family: monospace; line-height: 1.4; }

        /* Канвас */
        .sig-container { background: #fff; border-radius: 4px; cursor: crosshair; margin-top: 5px; border: 1px dashed #666; width: 100%; height: 80px; }
        canvas { width: 100%; height: 100%; display: block; }

        /* === КНОПКИ (FIX) === */
        /* Жесткие стили чтобы точно отображались */
        .lzt-btn-visible {
            display: block !important;
            width: 100%;
            padding: 12px;
            text-align: center;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            margin-top: 10px;
            border: none;
            text-decoration: none;
        }
        .btn-green-fix { background: #228e5d !important; color: #fff !important; }
        .btn-green-fix:hover { background: #1a6f49 !important; }

        .btn-red-fix { background: transparent !important; border: 1px solid #d32f2f !important; color: #d32f2f !important; }
        .btn-red-fix:hover { background: #d32f2f !important; color: #fff !important; }

        .btn-small-fix { padding: 5px 10px; font-size: 11px; width: auto; background: #444; color: #ccc; border: none; border-radius: 3px; cursor: pointer; margin-bottom: 5px; }

        /* === ПРЕВЬЮ ДОКУМЕНТА === */
        #doc-wrapper { flex: 1; background: #555; overflow: auto; padding: 20px; display: flex; justify-content: center; }
        #doc-preview {
            width: 595px; min-height: 842px; background: #fff; padding: 40px 50px; box-sizing: border-box;
            color: #000; font-family: "Times New Roman", Times, serif; position: relative;
        }

        .doc-emblem { width: 60px; height: 60px; margin: 0 auto 15px auto; display: block; object-fit: contain; }
        .doc-type { text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin-bottom: 10px; text-transform: uppercase; }
        .doc-org { text-align: center; font-size: 13px; text-transform: uppercase; font-weight: bold; margin-bottom: 8px; color: #000; }
        .doc-meta { text-align: center; font-size: 13px; margin-bottom: 25px; }
        .doc-topic { text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 15px; padding: 0 10px; line-height: 1.2; }
        .doc-text { font-size: 14px; line-height: 1.4; text-align: justify; text-indent: 35px; min-height: 350px; white-space: pre-wrap; }

        /* === ПОДВАЛ === */
        .doc-footer { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; position: relative; }

        /* Левая часть */
        .footer-left {
            width: 45%; position: relative;
            display: flex; flex-direction: column; justify-content: flex-end;
        }
        .text-job { font-size: 13px; font-weight: bold; text-transform: uppercase; line-height: 1.2; z-index: 2; position: relative; text-align: left; }
        .text-rank { font-size: 13px; font-weight: normal; margin-top: 4px; z-index: 2; position: relative; text-align: left; }

        /* Печать (Ниже звания и левее) */
        .stamp-img {
            position: absolute; width: 125px; height: 125px;
            top: -30px;
            left: 120px;
            opacity: 0.9; mix-blend-mode: multiply; pointer-events: none; z-index: 1;
        }

        /* Правая часть */
        .footer-right { width: 50%; display: flex; flex-direction: column; align-items: flex-end; }
        .sign-line-container { width: 120px; border-bottom: 1px solid #000; height: 30px; position: relative; margin-bottom: 5px; }
        .signature-img {
            position: absolute; bottom: 2px; left: 0; right: 0;
            max-width: 100px; max-height: 50px; mix-blend-mode: multiply;
            transform: rotate(-2deg); margin: 0 auto; display: block;
        }
        .sign-name-text { font-size: 13px; font-weight: bold; }
    `;

    const styleEl = document.createElement("style");
    styleEl.innerText = STYLES;
    document.head.appendChild(styleEl);

    function init() {
        new MutationObserver(() => {
            const bar = document.querySelector('.submitUnit .button.primary');
            if (bar && !document.getElementById('lzt-doc-btn')) {
                const btn = document.createElement('button');
                btn.id = 'lzt-doc-btn';
                btn.className = 'button primary';
                btn.innerText = 'Приказ';
                btn.type = 'button';
                btn.onclick = openModal;
                bar.parentNode.appendChild(btn);
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    function openModal() {
        if (document.getElementById('lzt-doc-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'lzt-doc-modal';
        modal.innerHTML = `
            <div class="lzt-doc-panel">
                <div class="lzt-inputs">
                    <h3>Настройки оформления</h3>
                    <label>URL Герба</label>
                    <input id="i-logo" value="${DEFAULT_LOGO}">
                    <label>Организация</label>
                    <input id="i-org" value="МИНИСТЕРСТВО ФОРУМНЫХ ДЕЛ">
                    <label>Тип документа</label>
                    <input id="i-type" value="П Р И К А З">
                    <label>Дата и Номер</label>
                    <input id="i-meta" value="8 декабря 2025 г. № 1400">
                    <label>Город</label>
                    <input id="i-city" value="г. Оффтоп">

                    <h3>Содержание</h3>
                    <label>Тема</label>
                    <textarea id="i-topic">О проведении внеплановой проверки форума</textarea>
                    <label>Текст приказа</label>
                    <textarea id="i-body">ПРИКАЗЫВАЮ:\n\nОбнулить всех пользователей с 100+ симпатий.</textarea>

                    <h3>Подписант</h3>
                    <label>Должность</label>
                    <input id="i-job" value="МИНИСТР ОФФТОПА">
                    <label>Звание</label>
                    <input id="i-rank" value="генерал форума">
                    <label>Фамилия И.О.</label>
                    <input id="i-name" value="RaysMorgan">

                    <label>Роспись:</label>
                    <div class="sig-container">
                        <canvas id="sig-canvas" width="360" height="80"></canvas>
                    </div>
                    <button class="btn-small-fix" id="btn-clear" type="button">Очистить</button>

                    <!-- КНОПКИ ТЕПЕРЬ ТОЧНО ВИДНЫ -->
                    <button class="lzt-btn-visible btn-green-fix" id="btn-make" type="button">Создать и скопировать</button>
                    <button class="lzt-btn-visible btn-red-fix" id="btn-exit" type="button">Закрыть</button>
                </div>

                <div id="doc-wrapper">
                    <div id="doc-preview">
                        <img src="" class="doc-emblem" id="v-logo">
                        <div class="doc-type" id="v-type"></div>
                        <div class="doc-org" id="v-org"></div>
                        <div class="doc-meta"><span id="v-meta"></span><br><span id="v-city"></span></div>
                        <div class="doc-topic" id="v-topic"></div>
                        <div class="doc-text" id="v-body"></div>

                        <div class="doc-footer">
                            <div class="footer-left">
                                <div class="text-job" id="v-job"></div>
                                <div class="text-rank" id="v-rank"></div>
                                <div id="v-stamp-place" class="stamp-img"></div>
                            </div>
                            <div class="footer-right">
                                <div class="sign-line-container">
                                    <img id="v-sig-img" class="signature-img" style="display:none">
                                </div>
                                <div class="sign-name-text" id="v-name"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);

        setupInteractions();
        initCanvas();
        updateView();
    }

    function setupInteractions() {
        ['i-logo', 'i-org', 'i-type', 'i-meta', 'i-city', 'i-topic', 'i-body', 'i-job', 'i-rank', 'i-name']
            .forEach(id => document.getElementById(id).addEventListener('input', updateView));

        document.getElementById('btn-exit').onclick = () => document.getElementById('lzt-doc-modal').remove();
        document.getElementById('btn-make').onclick = copyImage;
    }

    function updateView() {
        const val = (id) => document.getElementById(id).value;
        document.getElementById('v-logo').src = val('i-logo');
        document.getElementById('v-org').innerText = val('i-org');
        document.getElementById('v-type').innerText = val('i-type');
        document.getElementById('v-meta').innerText = val('i-meta');
        document.getElementById('v-city').innerText = val('i-city');
        document.getElementById('v-topic').innerText = val('i-topic');
        document.getElementById('v-body').innerText = val('i-body');
        document.getElementById('v-job').innerText = val('i-job');
        document.getElementById('v-rank').innerText = val('i-rank');
        document.getElementById('v-name').innerText = val('i-name');

        const orgText = val('i-org') || "МИНИСТЕРСТВО";
        const nameText = val('i-name').split(' ').pop().toUpperCase() || "ДОКУМЕНТ";
        document.getElementById('v-stamp-place').innerHTML = getStampSVG(orgText, nameText);
    }

    function initCanvas() {
        const canvas = document.getElementById('sig-canvas');
        const ctx = canvas.getContext('2d');
        let drawing = false;

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
        };

        ctx.strokeStyle = "#0000aa"; ctx.lineWidth = 2; ctx.lineJoin = "round";

        canvas.onmousedown = (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); };
        window.onmouseup = () => {
            if(drawing) {
                drawing = false;
                document.getElementById('v-sig-img').src = canvas.toDataURL();
                document.getElementById('v-sig-img').style.display = 'block';
            }
        };
        canvas.onmousemove = (e) => { if(drawing) { const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); } };
        document.getElementById('btn-clear').onclick = () => {
             ctx.clearRect(0,0, canvas.width, canvas.height);
             document.getElementById('v-sig-img').style.display = 'none';
        };
    }

    function copyImage() {
        const el = document.getElementById('doc-preview');
        html2canvas(el, { scale: 2, useCORS: true }).then(canvas => {
            canvas.toBlob(blob => {
                navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
                    .then(() => alert("✅ Приказ готов и скопирован!"))
                    .catch(e => alert("Ошибка: " + e));
            });
        });
    }

    init();
})();
