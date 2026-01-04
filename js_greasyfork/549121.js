// ==UserScript==
// @name         nopia tts ctrl
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  한
// @author       Your Assistant
// @match        https://novelpia.com/viewer/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549121/nopia%20tts%20ctrl.user.js
// @updateURL https://update.greasyfork.org/scripts/549121/nopia%20tts%20ctrl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 기본 설정값 ---
    const DEFAULT_SETTINGS = {
        narration: { rate: 1.2, pitch: 1, voiceName: null },
        dialogue: { rate: 1.3, pitch: 1.1, voiceName: null },
        replacements: ['▶:', '■:', '※:'].join('\n'),
        readComments: true, 
        autoNext: true, 
        nextDelay: 5,
        blankLineDelay: 0,
        ignoreSpecialChars: true,
        readTitle: true,
        removePunctuationDelay: true,
    };
    const HIGHLIGHT_COLOR = '#FFD700';

    // --- 상태 변수 및 UI 요소 ---
    let settings = {}; let voices = []; let allLines = [];
    let currentLineIndex = -1;
    let isReading = false, isPaused = false, isSeeking = false;
    let lineSegmentQueue = [];

    function initialize() {
        console.log('[TTS Script v4.2] Initializing...');
        loadSettings();
        document.addEventListener('keydown', handleKeydown);

        const readyCheck = setInterval(() => {
            if (document.querySelector('#novel_drawing font.line')) {
                clearInterval(readyCheck);
                setupVoiceList();
                createControllerUI();
                createSettingsModal();
                if (sessionStorage.getItem('ttsAutoStart') === 'true') {
                    sessionStorage.removeItem('ttsAutoStart');
                    startReading();
                }
            }
        }, 200);
    }

    function setupVoiceList() {
        function populate() { voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('ko')); }
        populate();
        if (speechSynthesis.onvoiceschanged !== undefined) { speechSynthesis.onvoiceschanged = populate; }
    }
    
    function createControllerUI(){if(document.getElementById("tts-controller"))return;const e=document.createElement("div");e.id="tts-controller",e.innerHTML=`\n            <div id="tts-buttons">\n                <button id="tts-play-pause">▶️ 시작</button>\n                <button id="tts-stop">⏹️ 정지</button>\n                <button id="tts-settings-btn">⚙️ 설정</button>\n            </div>\n            <div id="tts-progress-bar-container">\n                <div id="tts-progress-bar"></div>\n                <div id="tts-progress-handle"></div>\n            </div>`,document.body.appendChild(e);const t=document.createElement("style");t.innerHTML="#tts-controller{position:fixed;bottom:20px;right:20px;width:300px;z-index:99999;background:rgba(0,0,0,.8);color:#fff;padding:12px;border-radius:10px;display:flex;flex-direction:column;gap:10px;user-select:none}#tts-buttons{display:flex;gap:10px}#tts-buttons button{flex-grow:1;padding:8px;border:none;border-radius:5px;cursor:pointer;font-size:14px}#tts-progress-bar-container{position:relative;width:100%;height:10px;background-color:#555;border-radius:5px;cursor:pointer;margin-top:5px}#tts-progress-bar{position:absolute;left:0;top:0;height:100%;background-color:#4caf50;border-radius:5px}#tts-progress-handle{position:absolute;left:0;top:50%;width:16px;height:16px;background-color:#fff;border-radius:50%;transform:translate(-50%,-50%);cursor:grab}",document.head.appendChild(t);const n=document.getElementById("tts-play-pause"),o=document.getElementById("tts-stop");document.getElementById("tts-settings-btn").onclick=openSettingsModal,n.onclick=togglePlayPause,o.onclick=stopReading;const i=document.getElementById("tts-progress-bar-container");i.addEventListener("mousedown",e=>{isSeeking=!0,seek(e)}),document.addEventListener("mousemove",e=>{isSeeking&&seek(e)}),document.addEventListener("mouseup",()=>{isSeeking&&(isSeeking=!1,isReading&&playLine())})}
    function createSettingsModal(){const e=document.createElement("div");e.id="tts-settings-modal",e.innerHTML=`\n            <div class="tts-modal-content">\n                <span class="tts-modal-close">&times;</span>\n                <h2>TTS 전역 설정</h2>\n                <div class="tts-tabs">\n                    <button class="tts-tab-btn active" data-tab="narration">서술부</button>\n                    <button class="tts-tab-btn" data-tab="dialogue">대화부</button>\n                    <button class="tts-tab-btn" data-tab="common">공통</button>\n                </div>\n\n                <div id="tts-tab-narration" class="tts-tab-content active">\n                    <div class="tts-setting-item"><label>목소리:</label><div class="tts-voice-control"><select class="tts-voice-select"></select><button class="tts-voice-test">테스트</button></div></div>\n                    <div class="tts-setting-item"><label>재생 속도: <span class="tts-rate-value">1.2</span></label><input type="range" class="tts-rate-slider" min="0.5" max="4" step="0.1"></div>\n                    <div class="tts-setting-item"><label>음성 높낮이: <span class="tts-pitch-value">1.0</span></label><input type="range" class="tts-pitch-slider" min="0.5" max="2" step="0.1"></div>\n                </div>\n\n                <div id="tts-tab-dialogue" class="tts-tab-content">\n                    <div class="tts-setting-item"><label>목소리:</label><div class="tts-voice-control"><select class="tts-voice-select"></select><button class="tts-voice-test">테스트</button></div></div>\n                    <div class="tts-setting-item"><label>재생 속도: <span class="tts-rate-value">1.3</span></label><input type="range" class="tts-rate-slider" min="0.5" max="4" step="0.1"></div>\n                    <div class="tts-setting-item"><label>음성 높낮이: <span class="tts-pitch-value">1.1</span></label><input type="range" class="tts-pitch-slider" min="0.5" max="2" step="0.1"></div>\n                </div>\n\n                <div id="tts-tab-common" class="tts-tab-content">\n                    <div class="tts-setting-item"><label for="tts-replacements">전역 대치어 설정:</label><textarea id="tts-replacements" rows="5" placeholder="한 줄에 하나씩 '원본:대체' 형식"></textarea></div>\n                    <div class="tts-setting-item tts-checkbox-group"><input type="checkbox" id="tts-read-title"><label for="tts-read-title">시작할 때 제목 읽기</label></div>\n                    <div class="tts-setting-item tts-checkbox-group"><input type="checkbox" id="tts-ignore-chars"><label for="tts-ignore-chars">대치어 외 특수문자 무시</label></div>\n                    <div class="tts-setting-item tts-checkbox-group"><input type="checkbox" id="tts-remove-punct-delay"><label for="tts-remove-punct-delay">[?!] 문장 끝 딜레이 제거</label></div>\n                    <div class="tts-setting-item tts-checkbox-group"><input type="checkbox" id="tts-read-comments"><label for="tts-read-comments">작가의 한마디 읽기</label></div>\n                    <div class="tts-setting-item tts-checkbox-group">\n                        <input type="checkbox" id="tts-auto-next"><label for="tts-auto-next">자동으로 다음화 넘어가기</label>\n                        <input type="number" id="tts-next-delay" min="0" style="width: 60px;"><label for="tts-next-delay">초 후</label>\n                    </div>\n                    <div class="tts-setting-item tts-checkbox-group">\n                        <label for="tts-blank-delay">빈 줄 넘김 속도:</label><input type="number" id="tts-blank-delay" min="0" style="width: 70px;"> ms\n                    </div>\n                </div>\n                <button id="tts-save-settings">설정 저장</button>\n            </div>`,document.body.appendChild(e),setupModalStylesAndEvents(e)}
    function setupModalStylesAndEvents(e){const t=document.createElement("style");t.innerHTML="#tts-settings-modal{display:none;position:fixed;z-index:100000;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,.6)}.tts-modal-content{background-color:#333;color:#fff;margin:5% auto;padding:20px;border:1px solid #888;width:90%;max-width:550px;border-radius:10px}.tts-modal-close{color:#aaa;float:right;font-size:28px;font-weight:700;cursor:pointer}.tts-setting-item{margin-bottom:15px}.tts-setting-item label{display:block;margin-bottom:5px}.tts-tabs{display:flex;border-bottom:1px solid #555;margin-bottom:15px}.tts-tab-btn{background:none;border:none;color:#aaa;padding:10px 15px;cursor:pointer;font-size:16px;outline:none}.tts-tab-btn.active{color:#fff;border-bottom:2px solid #4caf50}.tts-tab-content{display:none}.tts-tab-content.active{display:block}.tts-voice-control{display:flex;gap:10px}.tts-voice-control select{flex-grow:1}.tts-voice-test{padding:0 10px;background-color:#555;border:1px solid #777;color:#fff;cursor:pointer;border-radius:4px}.tts-checkbox-group{display:flex;align-items:center;gap:5px}.tts-checkbox-group label{margin-bottom:0;display:inline-block}.tts-setting-item select,.tts-setting-item input[type=range],.tts-setting-item input[type=number],.tts-setting-item textarea{width:100%;box-sizing:border-box;padding:5px;background-color:#555;color:#fff;border:1px solid #777;border-radius:4px}#tts-save-settings{background-color:#4caf50;color:#fff;padding:10px 15px;border:none;border-radius:5px;cursor:pointer;float:right}",document.head.appendChild(t),e.querySelector(".tts-modal-close").onclick=()=>e.style.display="none",e.querySelector("#tts-save-settings").onclick=saveSettings,e.querySelectorAll(".tts-tab-btn").forEach(t=>{t.onclick=n=>{e.querySelectorAll(".tts-tab-btn, .tts-tab-content").forEach(e=>e.classList.remove("active")),n.target.classList.add("active"),e.querySelector(`#tts-tab-${n.target.dataset.tab}`).classList.add("active")}}),["narration","dialogue"].forEach(t=>{const n=e.querySelector(`#tts-tab-${t}`);n.querySelector(".tts-rate-slider").oninput=e=>n.querySelector(".tts-rate-value").textContent=parseFloat(e.target.value).toFixed(1),n.querySelector(".tts-pitch-slider").oninput=e=>n.querySelector(".tts-pitch-value").textContent=parseFloat(e.target.value).toFixed(1),n.querySelector(".tts-voice-test").onclick=()=>testVoice(t)})}
    function testVoice(e){speechSynthesis.cancel();const t=document.querySelector(`#tts-tab-${e}`),n={rate:parseFloat(t.querySelector(".tts-rate-slider").value),pitch:parseFloat(t.querySelector(".tts-pitch-slider").value),voiceName:t.querySelector(".tts-voice-select").value},o=createUtterance("안녕하세요. 목소리 테스트입니다.",n);o?speechSynthesis.speak(o):alert("텍스트가 비어있습니다.")}
    function openSettingsModal(){const e=document.getElementById("tts-settings-modal"),t=voices.map(e=>`<option value="${e.name}">${e.name} (${e.lang})</option>`).join("");["narration","dialogue"].forEach(n=>{const o=e.querySelector(`#tts-tab-${n}`),i=settings[n];o.querySelector(".tts-voice-select").innerHTML=`<option value="">브라우저 기본</option>${t}`,o.querySelector(".tts-voice-select").value=i.voiceName||"",o.querySelector(".tts-rate-slider").value=i.rate,o.querySelector(".tts-pitch-slider").value=i.pitch,o.querySelector(".tts-rate-value").textContent=i.rate.toFixed(1),o.querySelector(".tts-pitch-value").textContent=i.pitch.toFixed(1)}),e.querySelector("#tts-replacements").value=settings.replacements,e.querySelector("#tts-read-comments").checked=settings.readComments,e.querySelector("#tts-auto-next").checked=settings.autoNext,e.querySelector("#tts-next-delay").value=settings.nextDelay,e.querySelector("#tts-ignore-chars").checked=settings.ignoreSpecialChars,e.querySelector("#tts-blank-delay").value=settings.blankLineDelay,e.querySelector("#tts-read-title").checked=settings.readTitle,e.querySelector("#tts-remove-punct-delay").checked=settings.removePunctuationDelay,e.style.display="block"}
    function saveSettings(){["narration","dialogue"].forEach(e=>{const t=document.querySelector(`#tts-tab-${e}`);settings[e]={voiceName:t.querySelector(".tts-voice-select").value,rate:parseFloat(t.querySelector(".tts-rate-slider").value),pitch:parseFloat(t.querySelector(".tts-pitch-slider").value)}}),Object.assign(settings,{replacements:document.getElementById("tts-replacements").value,readComments:document.getElementById("tts-read-comments").checked,autoNext:document.getElementById("tts-auto-next").checked,nextDelay:parseInt(document.getElementById("tts-next-delay").value,10),ignoreSpecialChars:document.getElementById("tts-ignore-chars").checked,blankLineDelay:parseInt(document.getElementById("tts-blank-delay").value,10),readTitle:document.getElementById("tts-read-title").checked,removePunctuationDelay:document.getElementById("tts-remove-punct-delay").checked}),localStorage.setItem("ttsNovelpiaSettings_v4.2",JSON.stringify(settings)),document.getElementById("tts-settings-modal").style.display="none",alert("설정이 저장되었습니다.")}
    function loadSettings(){const e=localStorage.getItem("ttsNovelpiaSettings_v4.2"),t=JSON.parse(JSON.stringify(DEFAULT_SETTINGS));settings=e?Object.assign(t,JSON.parse(e)):t}
    function processText(e){let t=e;const n=settings.replacements.split("\n").filter(e=>e.includes(":"));return n.forEach(e=>{const n=e.split(/:(.*)/s);if(n.length>=2){const e=n[0],s=n[1]||"";e&&(t=t.split(e).join(s))}}),settings.removePunctuationDelay&&(t=t.replace(/[?!…]+(\s|$)/g,". ")),settings.ignoreSpecialChars&&(t=t.replace(/[^가-힣a-zA-Z0-9\s.,“”"`''‘’]/g,"")),t.trim()}
    function createUtterance(e,t){const n=processText(e);if(!n)return null;const o=new SpeechSynthesisUtterance(n);return o.lang="ko-KR",o.rate=t.rate,o.pitch=t.pitch,t.voiceName&&voices.find(e=>e.name===t.voiceName)&&(o.voice=voices.find(e=>e.name===t.voiceName)),o}
    function getVisibleText(e){if(e.querySelector("img"))return{type:"image",text:"삽화가 존재합니다."};const t=e.cloneNode(!0);return t.querySelectorAll('p[style*="height: 0px"], [style*="display: none"]').forEach(e=>e.remove()),t.innerText.replace(/[ \u00a0\u200b\t\r\n]/g,"")===""?null:{type:"text",text:t.innerText}}

    function playLine() {
        if (isPaused || isSeeking || !isReading) return;
        if (currentLineIndex >= allLines.length) {
            finishReadingSequence();
            return;
        }
        
        const lineElem = allLines[currentLineIndex];
        allLines.forEach((line, index) => line.style.backgroundColor = index === currentLineIndex ? HIGHLIGHT_COLOR : '');
        lineElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        updateProgressBar();
        
        const content = getVisibleText(lineElem);

        if (content === null) {
            const delay = settings.blankLineDelay;
            const next = () => { if (!isPaused && !isSeeking && isReading) { currentLineIndex++; playLine(); } };
            if (delay > 0) { setTimeout(next, delay); } else { next(); }
            return;
        }

        if (content.type === 'image') {
            const utterance = createUtterance(content.text, settings.narration);
            speak(utterance, () => { currentLineIndex++; playLine(); });
            return;
        }
        
        // [핵심 개선] 문장 분할 로직
        const dialogueParts = content.text.split(/([“”"`''‘’].*?[“”"`''‘’])/g).filter(Boolean);
        lineSegmentQueue = [];
        
        dialogueParts.forEach(part => {
            const isDialogue = /^[“”"`''‘’]/.test(part);
            const config = isDialogue ? settings.dialogue : settings.narration;
            // 마침표, 물음표, 느낌표를 기준으로 문장을 더 잘게 나눔
            const sentences = part.match(/[^.?!…]+[.?!…]?/g) || [part];
            
            sentences.forEach(sentence => {
                const utterance = createUtterance(sentence, config);
                if (utterance) lineSegmentQueue.push(utterance);
            });
        });
        
        playSegmentQueue();
    }
    
    function playSegmentQueue() {
        if (isPaused || isSeeking || !isReading) return;
        if (lineSegmentQueue.length === 0) {
            currentLineIndex++;
            playLine();
            return;
        }
        const utterance = lineSegmentQueue.shift();
        utterance.onend = playSegmentQueue;
        speechSynthesis.speak(utterance);
    }

    function startReading() {
        if (isReading) return;
        allLines = Array.from(document.querySelectorAll('#novel_drawing font.line'));
        isReading = true; isPaused = false;
        document.getElementById('tts-play-pause').innerText = '⏸️ 일시정지';
        currentLineIndex = -1;

        if (settings.readTitle) {
            const titleText = `${document.querySelector('.menu-top-tag').innerText.match(/\d+/)[0]}화. ${document.querySelector('.menu-top-title').innerText}`;
            const utterances = (titleText.match(/[^.?!…]+[.?!…]?/g) || [titleText]).map(sentence => createUtterance(sentence, settings.narration)).filter(Boolean);
            lineSegmentQueue = utterances;
            playSegmentQueue = () => {
                if(lineSegmentQueue.length === 0) {
                    currentLineIndex = 0;
                    playLine();
                    return;
                }
                const u = lineSegmentQueue.shift();
                u.onend = playSegmentQueue;
                speechSynthesis.speak(u);
            };
            playSegmentQueue();
        } else {
            currentLineIndex = 0;
            playLine();
        }
    }
    
    function stopReading(){isReading=!1,isPaused=!1,speechSynthesis.cancel(),currentLineIndex>=0&&allLines.length>currentLineIndex&&allLines[currentLineIndex]&&(allLines[currentLineIndex].style.backgroundColor=""),currentLineIndex=-1,document.getElementById("tts-play-pause").innerText="▶️ 시작",updateProgressBar(0)}
    function togglePlayPause(){if(!isReading)startReading();else if(isPaused){isPaused=!1,speechSynthesis.resume(),document.getElementById("tts-play-pause").innerText="⏸️ 일시정지",speechSynthesis.speaking||playSegmentQueue()}else{isPaused=!0,speechSynthesis.pause(),document.getElementById("tts-play-pause").innerText="▶️ 계속"}}
    function handleKeydown(e){if(!isReading||isSeeking)return;if("ArrowLeft"===e.key||"ArrowRight"===e.key){e.preventDefault();let t=currentLineIndex<0?0:currentLineIndex,n="ArrowLeft"===e.key?-1:1;do{t+=n}while(t>0&&t<allLines.length&&null===getVisibleText(allLines[t]));t=Math.max(0,Math.min(allLines.length-1,t)),speechSynthesis.cancel(),currentLineIndex=t,playLine()}}
    function seek(e){const t=document.getElementById("tts-progress-bar-container").getBoundingClientRect();let n=(e.clientX-t.left)/t.width*100;n=Math.max(0,Math.min(100,n));const i=Math.floor(n/100*allLines.length);currentLineIndex!==i&&(speechSynthesis.cancel(),updateProgressBar(n),currentLineIndex=i,isReading&&playLine())}
    function updateProgressBar(e){const t=void 0!==e?e:allLines.length>0?currentLineIndex/(allLines.length-1)*100:0;document.getElementById("tts-progress-bar").style.width=`${t}%`,document.getElementById("tts-progress-handle").style.left=`${t}%`}
    
    function finishReadingSequence(){if(!isReading)return;isReading=!1;speak(createUtterance("끝.",settings.narration),()=>{if(settings.readComments){const e=document.getElementById("writer_comments_box");if(e){let t=getVisibleText(e)?.text.replace("작가의 한마디 (작가후기)","작가의 한마디.")||"";return void speak(createUtterance(t,settings.narration),proceedToNextChapter)}}proceedToNextChapter()})}
    function proceedToNextChapter(){if(settings.autoNext){const e=settings.nextDelay>0?`${settings.nextDelay}초 후 다음화로 넘어갑니다.`:"즉시 다음화로 넘어갑니다.";speak(createUtterance(e,settings.narration),()=>{setTimeout(()=>{const e=document.querySelector("#next_epi_btn_bottom, .menu-next-item");e?(sessionStorage.setItem("ttsAutoStart","true"),e.click()):(alert("다음화 버튼을 찾을 수 없습니다."),stopReading())},1e3*settings.nextDelay)})}else stopReading()}
    function speak(e,t){e?(t&&(e.onend=t),speechSynthesis.speak(e)):t&&t()}
    
    initialize();
})();